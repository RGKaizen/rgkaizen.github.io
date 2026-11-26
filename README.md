# RGKaizen Devlog

Source for https://rgkaizen.github.io/, a Hugo site with the PaperMod theme.
Every push to `main` builds the site and deploys it to GitHub Pages.

## Setup on a new machine

1. Clone the repo with the theme: `git clone --recurse-submodules git@github.com:RGKaizen/rgkaizen.github.io.git`
2. Install Hugo **extended** 0.170.1 or later from https://github.com/gohugoio/hugo/releases.
   Put the `hugo` binary in `~/.local/bin`.
3. Run `hugo version` to check the install.

If you cloned without `--recurse-submodules`, run `git submodule update --init`.

## Where posts live

Each post is a folder under `content/posts/`. The post text is `index.md` in that folder.
Images and videos go in the same folder, and the post refers to them by file name only.

```
content/posts/2026-11-21-software-factory-journey/
  index.md     the post: front matter, then the body
  s1-codex-live.webp
  charts.js
```

## Preview locally

1. Run `hugo server -D` in the repo root. The `-D` flag also shows drafts.
2. Open http://localhost:1313/ in a browser.
3. Edit and save a file. The browser reloads by itself.
4. Press Ctrl+C to stop the server.

## Write a new post

1. Run `hugo new posts/YYYY-MM-DD-short-title/index.md`.
2. Fill in the front matter at the top of `index.md`:

   ```yaml
   ---
   title: "My title"
   date: 2026-12-01
   draft: true
   tags: ["okonomiyaki"]
   siteLabel: "Okonomiyaki Devlog"   # optional: renames the site in this post's header
   ---
   ```

3. Write the body in Markdown below the front matter. Raw HTML also works.
4. Copy images and videos into the post folder. Use them like this: `![Alt text](screenshot.webp)`.
5. Preview the post with `hugo server -D`.
6. Delete the `draft: true` line when the post is ready.

A post with `draft: true` is never published, even after a push. A post with a future `date`
is not published until a push after that date.

## Edit an existing post

1. Open `content/posts/<folder>/index.md`.
2. Make the change.
3. Preview it with `hugo server -D`.

## Publish

1. Run `git add -A`.
2. Run `git commit -m "Add post: my title"`.
3. Run `git push`.
4. Open the **Actions** tab on GitHub and wait for "Deploy Hugo site to Pages" to finish. It takes about a minute.
5. Check the live site at https://rgkaizen.github.io/.

If the deploy fails, open the failed run in the Actions tab and read the "Build" step log.

## Where things are

| What | Where |
| --- | --- |
| Site title, menu, footer, `baseURL` | `hugo.toml` |
| Styles for long report posts (tiles, galleries, charts, contents sidebar) | `assets/css/extended/journey.css` |
| Header and tab-title override for `siteLabel` | `layouts/_partials/header.html`, `layouts/_partials/head.html` |
| Deploy workflow | `.github/workflows/hugo.yml` |
| Theme (do not edit; override in `layouts/` or `assets/css/extended/`) | `themes/PaperMod/` |

## License

Site code is MIT-licensed (see `LICENSE`). Post text, images and video are all rights reserved.
