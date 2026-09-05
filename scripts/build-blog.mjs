import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import matter from 'gray-matter';
import { marked } from 'marked';
import sanitizeHtml from 'sanitize-html';

const root = path.resolve(fileURLToPath(new URL('..', import.meta.url)));
const DEFAULT_CONTENT_DIRECTORY = path.join(root, 'content', 'blog');
const DEFAULT_OUTPUT_DIRECTORY = path.join(root, 'public', 'blog');
const SITE_ORIGIN = 'https://wlsaplus.02studio.xyz';

export function escapeHtml(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function normalizeDate(value, filename) {
  const date = value instanceof Date && !Number.isNaN(value.getTime())
    ? value.toISOString().slice(0, 10)
    : String(value ?? '').trim();
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || Number.isNaN(Date.parse(`${date}T00:00:00Z`))) {
    throw new Error(`${filename}: "date" must use YYYY-MM-DD.`);
  }
  return date;
}

function normalizeSlug(filename) {
  const slug = path.basename(filename, path.extname(filename));
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
    throw new Error(`${filename}: use a lowercase filename containing only letters, numbers, and hyphens.`);
  }
  return slug;
}

function plainText(markdown) {
  return String(markdown)
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/!\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/[#>*_`~\-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function renderMarkdown(markdown) {
  const rendered = marked.parse(String(markdown), { gfm: true, breaks: false });
  return sanitizeHtml(rendered, {
    allowedTags: [
      'a', 'blockquote', 'br', 'code', 'del', 'em', 'h1', 'h2', 'h3', 'h4',
      'h5', 'h6', 'hr', 'img', 'li', 'ol', 'p', 'pre', 'strong', 'table',
      'tbody', 'td', 'th', 'thead', 'tr', 'ul',
    ],
    allowedSchemes: ['http', 'https', 'mailto'],
    allowedSchemesByTag: { img: ['https'] },
    allowProtocolRelative: false,
    transformTags: {
      a: (tagName, attributes) => ({
        tagName,
        attribs: {
          ...attributes,
          ...(attributes.href?.startsWith('http') ? { rel: 'noopener noreferrer' } : {}),
        },
      }),
      img: (tagName, attributes) => ({ tagName, attribs: { ...attributes, loading: 'lazy' } }),
    },
    allowedAttributes: {
      a: ['href', 'title', 'rel'],
      img: ['src', 'alt', 'title', 'width', 'height', 'loading'],
    },
  });
}

export function parsePost(filename, source) {
  const { data, content } = matter(source);
  const title = String(data.title ?? '').trim();
  if (!title) throw new Error(`${filename}: "title" is required.`);
  if (!content.trim()) throw new Error(`${filename}: the post body is empty.`);
  const summary = String(data.summary ?? plainText(content).slice(0, 180)).trim();
  return {
    slug: normalizeSlug(filename),
    title,
    date: normalizeDate(data.date, filename),
    summary,
    author: String(data.author ?? 'WLSAPlus').trim() || 'WLSAPlus',
    draft: data.draft === true,
    body: renderMarkdown(content),
  };
}

function formatDate(date) {
  return new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' })
    .format(new Date(`${date}T00:00:00Z`));
}

function pageTemplate({ title, description, canonicalPath, content }) {
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="theme-color" content="#00677a">
  <meta name="description" content="${escapeHtml(description)}">
  <link rel="canonical" href="${SITE_ORIGIN}${canonicalPath}">
  <title>${escapeHtml(title)} · WLSAPlus</title>
  <link rel="icon" href="/assets/app-icon.svg" type="image/svg+xml">
  <link rel="stylesheet" href="/styles.css?v=2">
</head>
<body>
  <header class="site-header">
    <a class="brand" href="/" aria-label="WLSAPlus home"><img src="/assets/app-icon.svg" alt=""><strong>WLSAPlus</strong></a>
    <nav aria-label="Main navigation"><a href="/#guide">Guide</a><a aria-current="page" href="/blog/">Blog</a><a href="https://wlsap.02studio.xyz/">Web app</a><a class="github-link" href="https://github.com/DDguan2010/wlsaplus">GitHub</a></nav>
  </header>
  ${content}
  <footer><span>WLSAPlus</span><a href="https://github.com/DDguan2010/wlsaplus/issues">Report an issue</a></footer>
</body>
</html>`;
}

function renderPostCard(post) {
  return `<article class="post-card">
    <time datetime="${post.date}">${formatDate(post.date)}</time>
    <h2><a href="/blog/${encodeURIComponent(post.slug)}/">${escapeHtml(post.title)}</a></h2>
    <p>${escapeHtml(post.summary)}</p>
    <a class="read-post" href="/blog/${encodeURIComponent(post.slug)}/">Read article <span aria-hidden="true">→</span></a>
  </article>`;
}

function renderIndex(posts) {
  const cards = posts.length
    ? posts.map(renderPostCard).join('\n')
    : '<div class="blog-empty"><strong>No posts yet</strong><span>Add a Markdown file to content/blog and run the build.</span></div>';
  return pageTemplate({
    title: 'Blog',
    description: 'Updates, guides, and release notes from WLSAPlus.',
    canonicalPath: '/blog/',
    content: `<main class="blog-shell">
      <header class="blog-heading"><p class="eyebrow">News and guides</p><h1>WLSAPlus Blog</h1><p>Product updates, practical guides, and notes for WLSA students.</p></header>
      <section class="post-list" aria-label="Blog posts">${cards}</section>
    </main>`,
  });
}

function renderPostPage(post) {
  return pageTemplate({
    title: post.title,
    description: post.summary,
    canonicalPath: `/blog/${post.slug}/`,
    content: `<main class="article-shell">
      <a class="article-back" href="/blog/"><span aria-hidden="true">←</span> All posts</a>
      <article>
        <header class="article-heading"><time datetime="${post.date}">${formatDate(post.date)}</time><h1>${escapeHtml(post.title)}</h1><p>${escapeHtml(post.summary)}</p><span>By ${escapeHtml(post.author)}</span></header>
        <div class="markdown-body">${post.body}</div>
      </article>
    </main>`,
  });
}

export async function buildBlog({ contentDirectory = DEFAULT_CONTENT_DIRECTORY, outputDirectory = DEFAULT_OUTPUT_DIRECTORY } = {}) {
  await fs.mkdir(contentDirectory, { recursive: true });
  const filenames = (await fs.readdir(contentDirectory)).filter((filename) => filename.toLowerCase().endsWith('.md')).sort();
  const posts = [];
  for (const filename of filenames) {
    const source = await fs.readFile(path.join(contentDirectory, filename), 'utf8');
    const post = parsePost(filename, source);
    if (!post.draft) posts.push(post);
  }
  posts.sort((left, right) => right.date.localeCompare(left.date) || left.title.localeCompare(right.title));

  await fs.rm(outputDirectory, { recursive: true, force: true });
  await fs.mkdir(outputDirectory, { recursive: true });
  await fs.writeFile(path.join(outputDirectory, 'index.html'), renderIndex(posts));
  for (const post of posts) {
    const postDirectory = path.join(outputDirectory, post.slug);
    await fs.mkdir(postDirectory, { recursive: true });
    await fs.writeFile(path.join(postDirectory, 'index.html'), renderPostPage(post));
  }
  return posts;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const posts = await buildBlog();
  console.log(`Generated ${posts.length} blog post${posts.length === 1 ? '' : 's'} in public/blog`);
}
