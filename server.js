import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const DEFAULT_PUBLIC_DIR = fileURLToPath(new URL('./public/', import.meta.url));
const RELEASE_API = 'https://api.github.com/repos/DDguan2010/wlsaplus/releases/latest';
const CACHE_DURATION_MS = 5 * 60 * 1000;
const CONTENT_SECURITY_POLICY = "default-src 'self'; img-src 'self' data:; style-src 'self'; script-src 'self'; connect-src 'self' https://api.github.com https://gh-proxy.com; frame-ancestors 'none'; base-uri 'self'; form-action 'none'";
const MIME_TYPES = new Map([
  ['.css', 'text/css; charset=utf-8'],
  ['.html', 'text/html; charset=utf-8'],
  ['.js', 'text/javascript; charset=utf-8'],
  ['.json', 'application/json; charset=utf-8'],
  ['.png', 'image/png'],
  ['.svg', 'image/svg+xml'],
  ['.woff2', 'font/woff2'],
]);

function send(response, status, body, contentType) {
  response.writeHead(status, {
    'Content-Type': contentType,
    'Content-Length': Buffer.byteLength(body),
    'Cache-Control': status === 200 ? 'public, max-age=300' : 'no-store',
    'Content-Security-Policy': CONTENT_SECURITY_POLICY,
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'X-Content-Type-Options': 'nosniff',
  });
  response.end(body);
}

function releaseFromGithub(payload) {
  if (!payload || typeof payload !== 'object' || typeof payload.html_url !== 'string' || typeof payload.tag_name !== 'string') {
    throw new Error('GitHub returned an invalid release response.');
  }

  return {
    releaseId: Number(payload.id) || null,
    version: payload.tag_name.replace(/^v/, ''),
    tag: payload.tag_name,
    name: typeof payload.name === 'string' && payload.name ? payload.name : payload.tag_name,
    url: payload.html_url,
    publishedAt: typeof payload.published_at === 'string' ? payload.published_at : null,
    assets: Array.isArray(payload.assets) ? payload.assets.flatMap((asset) => {
      if (!asset || typeof asset.name !== 'string' || typeof asset.browser_download_url !== 'string') return [];
      return [{ name: asset.name, url: asset.browser_download_url, size: Number(asset.size) || 0 }];
    }) : [],
  };
}

export function createApp({ fetchImpl = fetch, publicDir = DEFAULT_PUBLIC_DIR } = {}) {
  const publicRoot = path.resolve(publicDir);
  let cachedRelease = null;
  let cacheExpiresAt = 0;

  async function latestRelease() {
    if (cachedRelease && Date.now() < cacheExpiresAt) return cachedRelease;
    const githubResponse = await fetchImpl(RELEASE_API, {
      headers: {
        Accept: 'application/vnd.github+json',
        'User-Agent': 'wlsaplus-frontpage',
        'X-GitHub-Api-Version': '2022-11-28',
      },
      signal: AbortSignal.timeout(8000),
    });
    if (!githubResponse.ok) throw new Error(`GitHub release request failed with ${githubResponse.status}.`);
    cachedRelease = releaseFromGithub(await githubResponse.json());
    cacheExpiresAt = Date.now() + CACHE_DURATION_MS;
    return cachedRelease;
  }

  return createServer(async (request, response) => {
    const method = request.method ?? 'GET';
    if (method !== 'GET' && method !== 'HEAD') {
      send(response, 405, 'Method not allowed', 'text/plain; charset=utf-8');
      return;
    }

    let pathname;
    try {
      pathname = decodeURIComponent(new URL(request.url ?? '/', 'http://localhost').pathname);
    } catch {
      send(response, 400, 'Bad request', 'text/plain; charset=utf-8');
      return;
    }

    if (pathname === '/api/release') {
      try {
        const body = JSON.stringify(await latestRelease());
        if (method === 'HEAD') {
          response.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8', 'Content-Length': Buffer.byteLength(body) });
          response.end();
        } else {
          send(response, 200, body, 'application/json; charset=utf-8');
        }
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Unable to load the latest release.';
        send(response, 502, JSON.stringify({ error: message }), 'application/json; charset=utf-8');
      }
      return;
    }

    const relativePath = pathname === '/' ? 'index.html' : pathname.replace(/^\/+/, '');
    const filePath = path.resolve(publicRoot, relativePath);
    if (filePath !== publicRoot && !filePath.startsWith(`${publicRoot}${path.sep}`)) {
      send(response, 404, 'Not found', 'text/plain; charset=utf-8');
      return;
    }

    try {
      const body = await readFile(filePath);
      const contentType = MIME_TYPES.get(path.extname(filePath).toLowerCase()) ?? 'application/octet-stream';
      const extension = path.extname(filePath).toLowerCase();
      const shouldRevalidate = extension === '.html' || extension === '.css' || extension === '.js';
      response.writeHead(200, {
        'Content-Type': contentType,
        'Content-Length': body.length,
        'Cache-Control': shouldRevalidate ? 'no-cache' : 'public, max-age=86400',
        'Content-Security-Policy': CONTENT_SECURITY_POLICY,
        'Referrer-Policy': 'strict-origin-when-cross-origin',
        'X-Content-Type-Options': 'nosniff',
      });
      response.end(method === 'HEAD' ? undefined : body);
    } catch (error) {
      const status = error && typeof error === 'object' && error.code === 'ENOENT' ? 404 : 500;
      send(response, status, status === 404 ? 'Not found' : 'Server error', 'text/plain; charset=utf-8');
    }
  });
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const port = Number.parseInt(process.env.PORT ?? '3000', 10);
  const host = process.env.HOST ?? '127.0.0.1';
  const server = createApp();
  server.listen(port, host, () => console.log(`WLSAPlus front page: http://${host}:${port}`));
}
