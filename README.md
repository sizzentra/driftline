# Driftline

A cosy browser fishing game. It installs as an app, plays offline, and updates itself.

- `src/`: the game source (the five game parts plus the app shell).
- `site/`: what gets published. `index.html` is built from `src/`.
- `build.ps1`: rebuilds `site/index.html` and stamps a new version, so everyone's app offers the update.
- `make_icons.ps1`: redraws the app icons.

Publishing: Netlify is connected to this GitHub repository and publishes `site/` on every push (see `netlify.toml`).

Progress is saved on each device. To move it, open the **Save** tab in the game and copy or load a save code.
