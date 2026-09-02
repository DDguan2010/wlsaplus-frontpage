import assert from 'node:assert/strict';
import { once } from 'node:events';
import test from 'node:test';
import { createApp } from '../server.js';

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
    assert.match(await page.text(), /<h1 id="hero-title">WLSAPlus<\/h1>/);

    const stylesheet = await fetch(`${baseUrl}/styles.css`);
    assert.equal(stylesheet.headers.get('content-type'), 'text/css; charset=utf-8');
    assert.equal(stylesheet.headers.get('cache-control'), 'no-cache');
    assert.match(await stylesheet.text(), /--accent: #00677a/);
  });
});

test('returns normalized latest-release data', async () => {
  const fetchImpl = async () => ({
    ok: true,
    status: 200,
    async json() {
      return {
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
