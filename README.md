# Driftline

A cosy browser fishing game. It installs as an app, plays offline, and updates itself.

- `src/`: the game source (the game parts in build order plus the app shell).
- `CLAUDE.md`: the project brief: where things stand, how it is built, ground rules, roadmap and future plans.
- `tools/serve_local.ps1`: a local test server at http://localhost:8766/
- `site/`: what gets published. `index.html` is built from `src/`.
- `build.ps1`: rebuilds `site/index.html` and stamps a new version, so everyone's app offers the update.
- `make_icons.ps1`: redraws the app icons.

Live at https://sizzentra.github.io/driftline/ (GitHub Pages, served from the `gh-pages` branch, which holds the contents of `site/`).
Publish an update: `powershell -ExecutionPolicy Bypass -File publish.ps1 "What changed"` (builds, commits, pushes `main`, then pushes `site/` to `gh-pages`).
`netlify.toml` is there in case the site ever moves to Netlify.

Progress is saved on each device. To move it, open the **Save** tab in the game and copy or load a save code.
