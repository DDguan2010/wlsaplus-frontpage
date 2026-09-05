# WLSAPlus front page 

A small Node.js site for downloading and learning about WLSAPlus. The server reads the newest public GitHub release and connects each platform button to its current asset.

## Blog

Blog posts are Markdown files in `content/blog`. To add a post, create a lowercase hyphenated filename such as `new-schedule-guide.md`:

```markdown
---
title: New schedule guide
date: 2026-09-05
summary: A short description shown on the blog index.
author: WLSAPlus
---

Write the article here using **Markdown**.
```

The `title` and `date` fields are required. `summary` and `author` are optional. Set `draft: true` to keep a post out of the generated site. Put post images in `public/assets/blog` and reference them as `![Description](/assets/blog/image.png)`.

Edit the Markdown file to update a post, or delete it to remove the post. Run `npm run blog:build` to preview the generated files locally. Do not edit `public/blog` directly because it is replaced during every build.

## Run

```powershell
npm start
```

Open `http://127.0.0.1:3000`.

## Deploy

Build command:

```powershell
npm install && npm run build
```

Start command:

```powershell
npm start
```

For Cloudflare Pages, keep the build output directory set to `public`. No backend or database is required.

## Test

```powershell
npm test
```
