const releaseFallback = 'https://github.com/DDguan2010/wlsaplus/releases/latest';
const patterns = {
  windows: /Windows-Setup\.exe$/i,
  android: /Android\.apk$/i,
  macos: /macOS\.dmg$/i,
};

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
    const response = await fetch('/api/release', { headers: { Accept: 'application/json' } });
    if (!response.ok) throw new Error('Latest release unavailable.');
    const release = await response.json();
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

loadRelease();
