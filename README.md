# Driftline

A cozy browser fishing game. It installs as an app on phones and PCs, plays offline, and updates itself.

- `CLAUDE.md`: the project's rulebook and where things stand. Read it first.
- `.claude/skills/`: the routines (small change, full batch, publishing, going live, new page, new water, testing).
- `src/`: the game source: one shared core plus `src/pc/`, `src/mobile/`, `src/ios/` for each platform.
- `build.ps1`: builds the three versions (`pc.html`, `android.html`, `ios.html` behind a router `index.html`) into `site/`; with `-Preview` it builds the test builds into `site/next/` and `testapps/`.
- `tools/`: the local test server (`serve_local.ps1`, http://localhost:8766/), the one-command checks (`sweep_all.ps1`, `baseline.ps1`), the three test saves (`saves/`), publishing (`push_folder.ps1`).
- `docs/`: the plan, standards, lessons, the change log and the bug log.
- `site/`: what gets published.

Live at https://sizzentra.github.io/driftline/ (GitHub Pages, the `gh-pages` branch holds the contents of `site/`). Test builds at https://sizzentra.github.io/driftline/next/ and https://sizzentra.github.io/driftline-test/.
Publishing is described in the skills `publish-test` and `live-and-hotfix`; the live game only changes on the director's word.

Progress is saved on each device. To move it, open Settings in the game (Save & codes) and copy or load a save code.
