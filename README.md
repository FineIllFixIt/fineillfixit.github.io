A website for my viewers to test the projects I posted about.

## Structure

```
index.html          Home page (hero + project grid)
project-1.html       Project page template (filler content)
project-2.html
project-3.html
assets/
  css/style.css      All styling (colors/fonts are CSS variables at the top)
  js/nav-data.js      The list of projects — edit this to add/remove/rename projects
  js/main.js          Builds the header + sidebar from nav-data.js on every page
  img/favicon.svg
```

## Running locally

No server or build step needed — just open `index.html` directly in a
browser, or for a closer-to-production preview, serve the folder:

```bash
python3 -m http.server 8000
```

then visit `http://localhost:8000`.

## Publishing with GitHub Pages

1. Create a GitHub repo and push these files to it (they can sit at the
   repo root, no `docs/` folder needed).
2. In the repo, go to **Settings → Pages**.
3. Under **Build and deployment**, set **Source** to "Deploy from a
   branch," pick your branch (e.g. `main`) and folder `/ (root)`.
4. Save. GitHub will give you a URL like
   `https://yourusername.github.io/your-repo-name/`.

Because every internal link in this site (`index.html`, `project-1.html`,
`assets/css/style.css`, etc.) is a **relative path with no leading
slash**, the site works correctly whether it's served from a domain root
or from a subpath like `/your-repo-name/`. That's also what makes the
next step painless.

## Migrating off GitHub Pages later

Because this is a plain static site with relative links and no
GitHub-specific tooling (no Jekyll, no `_config.yml`, no GitHub Actions
build step), moving it is just a file copy:

1. Copy the entire folder to your new host (Netlify, Vercel, S3,
   Cloudflare Pages, a plain Apache/Nginx server — anything that can
   serve static files).
2. Point your domain at it.
3. Done — no code changes required.

The only GitHub-Pages-specific thing you *might* add later is a `CNAME`
file (a single line with your custom domain) if you attach a custom
domain to GitHub Pages before migrating — just delete that file when you
move, it's not used anywhere else.

## Notes on how the nav works

Each page includes two empty containers:

```html
<div id="site-header"></div>
<div id="site-sidebar"></div>
```

`main.js` fills these in at load time, reading the project list from
`nav-data.js` and using each page's `data-page="..."` attribute (on
`<body>`) to highlight the current page in the sidebar. This avoids
copy-pasting the same nav markup into every HTML file — you maintain the
project list once, in `nav-data.js`.
