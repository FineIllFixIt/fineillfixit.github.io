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
```

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
