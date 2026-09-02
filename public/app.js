const releaseFallback = 'https://github.com/DDguan2010/wlsaplus/releases/latest';
const releaseApi = 'https://api.github.com/repos/DDguan2010/wlsaplus/releases/latest';
const patterns = {
  windows: /Windows-Setup\.exe$/i,
  android: /Android\.apk$/i,
  macos: /macOS\.dmg$/i,
};

function normalizeGithubRelease(payload) {
  if (!payload || typeof payload.tag_name !== 'string' || typeof payload.html_url !== 'string') {
    throw new Error('GitHub returned invalid release data.');
  }

  return {
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

function validRelease(payload) {
  return payload && typeof payload.version === 'string' && typeof payload.tag === 'string'
    && typeof payload.url === 'string' && Array.isArray(payload.assets);
}

export async function fetchLatestRelease(fetchImpl = fetch) {
  try {
    const response = await fetchImpl('/api/release', { headers: { Accept: 'application/json' } });
    const contentType = response.headers?.get('content-type') ?? '';
    if (!response.ok || !contentType.includes('application/json')) throw new Error('Local release API is unavailable.');
    const release = await response.json();
    if (!validRelease(release)) throw new Error('Local release API returned invalid data.');
    return release;
  } catch {
    const response = await fetchImpl(releaseApi, { headers: { Accept: 'application/vnd.github+json' } });
    if (!response.ok) throw new Error(`GitHub release request failed with ${response.status}.`);
    return normalizeGithubRelease(await response.json());
  }
}

function formatSize(bytes) {
  if (!Number.isFinite(bytes) || bytes <= 0) return 'Release file';
  return `${(bytes / 1024 / 1024).toFixed(bytes >= 100 * 1024 * 1024 ? 0 : 1)} MB`;
}

function formatDate(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

async function loadRelease() {
  const links = document.querySelectorAll('[data-platform]');
  try {
    const release = await fetchLatestRelease();
    document.querySelector('#release-version').textContent = `Version ${release.version}`;
    document.querySelector('#release-date').textContent = formatDate(release.publishedAt);
    const notes = document.querySelector('#release-notes');
    notes.href = release.url;

    for (const link of links) {
      const asset = release.assets.find((candidate) => patterns[link.dataset.platform]?.test(candidate.name));
      link.href = asset?.url ?? release.url;
      const detail = link.querySelector('span');
      detail.textContent = asset ? `${formatSize(asset.size)} | ${release.tag}` : `View ${release.tag} files`;
    }
  } catch {
    document.querySelector('#release-version').textContent = 'Latest release on GitHub';
    for (const link of links) link.href = releaseFallback;
  }
}

if (typeof document !== 'undefined') void loadRelease();
