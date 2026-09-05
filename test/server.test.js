import assert from 'node:assert/strict';
import { once } from 'node:events';
import test from 'node:test';
import { createApp } from '../server.js';
import { fetchLatestRelease, mirrorDownloadUrl } from '../public/app.js';
import { parsePost, renderMarkdown } from '../scripts/build-blog.mjs';

async function withServer(options, run) {
  const server = createApp(options);
  server.listen(0, '127.0.0.1');
  await once(server, 'listening');
  const address = server.address();
  try {
    await run(`http://127.0.0.1:${address.port}`);
  } finally {
    await new Promise((resolve, reject) => server.close((error) => error ? reject(error) : resolve()));
  }
}

test('serves the front page and static assets', async () => {
  await withServer({}, async (baseUrl) => {
    const page = await fetch(`${baseUrl}/`);
    assert.equal(page.status, 200);
    const pageBody = await page.text();
    assert.match(pageBody, /<h1 id="hero-title">WLSAPlus<\/h1>/);
    assert.match(pageBody, /href="https:\/\/wlsap\.02studio\.xyz\/"/);
    assert.match(pageBody, /<a class="download-link" href="https:\/\/wlsap\.02studio\.xyz\/">/);
    assert.match(pageBody, /class="download-link unavailable" aria-disabled="true"/);
    assert.match(pageBody, /macOS unavailable/);
    assert.match(pageBody, /href="\/blog\/"/);
    assert.doesNotMatch(pageBody, /data-platform="macos"/);

    const stylesheet = await fetch(`${baseUrl}/styles.css`);
    assert.equal(stylesheet.headers.get('content-type'), 'text/css; charset=utf-8');
    assert.equal(stylesheet.headers.get('cache-control'), 'no-cache');
    assert.match(await stylesheet.text(), /--accent: #00677a/);

    const blog = await fetch(`${baseUrl}/blog/`);
    assert.equal(blog.status, 200);
    assert.match(await blog.text(), /Welcome to the WLSAPlus blog/);
    assert.equal((await fetch(`${baseUrl}/blog`)).status, 200);

    const post = await fetch(`${baseUrl}/blog/welcome-to-wlsaplus/`);
    assert.equal(post.status, 200);
    assert.match(await post.text(), /What you will find here/);

    const vpnGuide = await fetch(`${baseUrl}/blog/use-wechat-on-restricted-networks/`);
    assert.equal(vpnGuide.status, 200);
    assert.match(await vpnGuide.text(), /Full device/);

    const phoneGuide = await fetch(`${baseUrl}/blog/set-up-phone-control-on-windows/`);
    assert.equal(phoneGuide.status, 200);
    const phoneGuideBody = await phoneGuide.text();
    assert.match(phoneGuideBody, /Enable Developer options/);
    assert.match(phoneGuideBody, /same Wi-Fi network/);
  });
});

test('parses blog metadata and sanitizes rendered Markdown', () => {
  const post = parsePost('safe-post.md', `---
title: Safe post
date: 2026-09-05
summary: Test summary
---

## Heading

Hello **WLSA**. <script>alert('no')</script>
`);
  assert.equal(post.slug, 'safe-post');
  assert.equal(post.title, 'Safe post');
  assert.match(post.body, /<h2>Heading<\/h2>/);
  assert.doesNotMatch(post.body, /script|alert/);
  assert.doesNotMatch(renderMarkdown('[bad](javascript:alert(1))'), /javascript:/);
});

test('returns normalized latest-release data', async () => {
  const fetchImpl = async () => ({
    ok: true,
    status: 200,
    async json() {
      return {
        id: 380451677,
        tag_name: 'v1.0.2',
        name: 'WLSAPlus 1.0.2',
        html_url: 'https://github.com/DDguan2010/wlsaplus/releases/tag/v1.0.2',
        published_at: '2026-09-01T12:00:00Z',
        assets: [{ name: 'WLSAPlus-1.0.2-Windows-Setup.exe', browser_download_url: 'https://example.test/setup.exe', size: 1000 }],
      };
    },
  });

  await withServer({ fetchImpl }, async (baseUrl) => {
    const response = await fetch(`${baseUrl}/api/release`);
    assert.equal(response.status, 200);
    assert.deepEqual(await response.json(), {
      releaseId: 380451677,
      version: '1.0.2',
      tag: 'v1.0.2',
      name: 'WLSAPlus 1.0.2',
      url: 'https://github.com/DDguan2010/wlsaplus/releases/tag/v1.0.2',
      publishedAt: '2026-09-01T12:00:00Z',
      assets: [{ name: 'WLSAPlus-1.0.2-Windows-Setup.exe', url: 'https://example.test/setup.exe', size: 1000 }],
    });
  });
});

test('uses a clear gateway error when GitHub is unavailable', async () => {
  const fetchImpl = async () => ({ ok: false, status: 503 });
  await withServer({ fetchImpl }, async (baseUrl) => {
    const response = await fetch(`${baseUrl}/api/release`);
    assert.equal(response.status, 502);
    assert.match((await response.json()).error, /503/);
  });
});

test('loads release assets through the mirror on a static Cloudflare deployment', async () => {
  const requests = [];
  const fetchImpl = async (url) => {
    requests.push(url);
    if (url === '/api/release') {
      return new Response('<!doctype html><title>WLSAPlus</title>', {
        headers: { 'Content-Type': 'text/html; charset=utf-8' },
      });
    }

    return Response.json({
      id: 381134633,
      tag_name: 'v1.0.3',
      name: 'WLSAPlus 1.0.3',
      html_url: 'https://github.com/DDguan2010/wlsaplus/releases/tag/v1.0.3',
      published_at: '2026-09-02T09:45:36Z',
      assets: [{
        name: 'WLSAPlus-1.0.3-Windows-Setup.exe',
        browser_download_url: 'https://github.com/DDguan2010/wlsaplus/releases/download/v1.0.3/WLSAPlus-1.0.3-Windows-Setup.exe',
        size: 237762806,
      }],
    });
  };

  const release = await fetchLatestRelease(fetchImpl);
  assert.equal(requests[0], '/api/release');
  assert.match(requests[1], /^https:\/\/gh-proxy\.com\/https:\/\/api\.github\.com\/repos\/DDguan2010\/wlsaplus\/releases\/latest\?noCache=\d+$/);
  assert.equal(release.version, '1.0.3');
  assert.equal(release.assets[0].url, 'https://github.com/DDguan2010/wlsaplus/releases/download/v1.0.3/WLSAPlus-1.0.3-Windows-Setup.exe');
});

test('falls back to the direct GitHub API when the mirror is unavailable', async () => {
  const requests = [];
  const fetchImpl = async (url) => {
    requests.push(url);
    if (url === '/api/release') return new Response('Not found', { status: 404 });
    if (url.startsWith('https://gh-proxy.com/')) return new Response('Unavailable', { status: 503 });
    return Response.json({
      id: 381134633,
      tag_name: 'v1.0.3',
      html_url: 'https://github.com/DDguan2010/wlsaplus/releases/tag/v1.0.3',
      assets: [],
    });
  };

  const release = await fetchLatestRelease(fetchImpl);
  assert.equal(release.version, '1.0.3');
  assert.equal(requests[0], '/api/release');
  assert.match(requests[1], /^https:\/\/gh-proxy\.com\/https:\/\/api\.github\.com\/repos\/DDguan2010\/wlsaplus\/releases\/latest\?noCache=\d+$/);
  assert.match(requests[2], /^https:\/\/api\.github\.com\/repos\/DDguan2010\/wlsaplus\/releases\/latest\?noCache=\d+$/);
});

test('uses the accelerator only for GitHub release downloads', () => {
  const download = 'https://github.com/DDguan2010/wlsaplus/releases/download/v1.0.3/WLSAPlus-1.0.3-Windows-Setup.exe';
  assert.equal(mirrorDownloadUrl(download, 381134633), `https://gh-proxy.com/${download}?release=381134633`);
  assert.equal(mirrorDownloadUrl('https://example.test/setup.exe'), 'https://example.test/setup.exe');
  assert.equal(
    mirrorDownloadUrl('https://github.com/another/project/releases/download/v1.0.3/setup.exe'),
    'https://github.com/another/project/releases/download/v1.0.3/setup.exe',
  );
});
