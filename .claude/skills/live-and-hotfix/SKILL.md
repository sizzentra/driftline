---
name: live-and-hotfix
description: Driftline - anything that changes the LIVE game - a live hotfix for a bug, a phones-only release, or a full release. Only on the director's word ("Push it live") or, for bug hotfixes, under the standing permission after the check copy is confirmed. Use before touching site/pc.html, site/android.html, site/ios.html or the live version files.
---
# Driftline: going live and hotfixes

**Never on Claude's own:** anything that changes look or feel, balance numbers, and the 0.5 release itself. **Allowed on its own, reported each time:** live hotfixes for bugs, after the checks pass and the check copy is confirmed on the platforms they touch. Before changing any system, tag a rollback point (`rollback/before-<what>`). Never publish the Windows exes until a download has been tested by the director.

Live right now and the waiting hotfix are in CLAUDE.md "Where we left off". A release build never contains `DL_PREVIEW`, the QA suite (`bn_qa04.js`), tester tools or plain-text gift codes.

## Two branches, one published site (Foundation F2, 2026-11-26)
- **`live` = exactly what players have.** Its `site/` folder is the live site file for file (pages, version files, service worker, manifests, icons, the Windows download), without `site/next/`; plus a README. No game source: the live pages are built pages patched by the hotfix scripts, so no commit of the source builds them; the pages are the source of truth. Every commit on `live` is one change to the live game.
- **`main` = the test build** (source, tools, docs, `site/next/`, `testapps/`). `main` also carries a copy of the live files in `site/`, because the Pages branch (`gh-pages`) is one folder: the live files at its top, the PC test build in `next/`.
- **Who publishes what:** live is published only by `tools/push_live.ps1` (takes `site/` from the `live` branch on GitHub, keeps the published `next/` untouched, checks the result; `-DryRun` shows what would change and changes nothing). Test builds are published from `main` as before (the `publish-test` skill). **The guard:** `tools/push_folder.ps1 -Prefix site` refuses when `main`'s copy of a live file differs from `live`, so a test publish can never change the live game.
- The shared checkout stays on `main`. Work on `live` in its own folder: `git worktree add ..\Driftline-live live`, and `git worktree remove ..\Driftline-live` when done.

## The three ways live changes
- **Live hotfix** (never build from a tag: the live tags hold 0.4.9 work). An ordinary commit on `live`:
  1. On `main`: copy the newest `tools/hotfix_*.ps1` to the new version (the old scripts stay as history); it patches the pages with exact, count-checked replacements. Write the check copy from the `live` folder: `-From ..\Driftline-live\site -To testapps\hotfix -Stamp <stamp>`, publish it with the test apps.
  2. After the platforms it touches confirm (and, for anything but a bug, the director says "Push it live"): the same script with `-From ..\Driftline-live\site -To ..\Driftline-live\site -Stamp <same stamp>`, so what was confirmed is byte-for-byte what ships. In that folder: commit ("Live for …: hotfix 0.4.8.9.x, …"), `git push origin live`.
  3. On `main`: `tools/push_live.ps1 -DryRun` (must list only the pages and version file of the platforms meant), then `tools/push_live.ps1`. Tag the version on the `live` commit.
  4. Bring `main`'s copy along: `git checkout origin/live -- site`, commit, push `main` (until then the guard refuses test publishes of `site/`).
- **Live, phones only (on the director's word):** on `main`, `build.ps1` (release), then restore `site/pc.html` and `site/version.txt` from HEAD so PC sees no update; the release changes `site/android.html`, `site/ios.html`, `site/index.html`, `site/version-phone.txt` and `site/manifest-android.webmanifest`; run the gate on the release pages; commit ("Live for Android and iPhone: … (PC unchanged; live stamp kept)"), push `main`; `tools/live_take_main.ps1 -DryRun`, then with `-Message "…"` (one commit on `live` with `main`'s live files); `tools/push_live.ps1 -DryRun`, then `tools/push_live.ps1`; tag the version.
- **Live, everything:** `publish.ps1 -Message "…"` (builds, commits and pushes `main`, records the pages on `live`, publishes `live`) only when the director approves a full release. First real use will be 0.5: run the two dry runs by hand first.
- After any of them: check the live pages' stamps (phones read `version-phone.txt`, PC reads `version.txt`).
- A release build never contains `DL_PREVIEW`, the QA suite (`bn_qa04.js`), tester tools or plain-text gift codes. Small measuring hooks gated by `?test` do ship in shared files (they only wake with `?test` in the address and cost nothing otherwise).


## Before any of it
- The full round checklist (the `full-batch` skill) on the release pages.
- A published notes entry is frozen: before editing `notes_release.js`, compare the entry's version with the live page's `GAME_VERSION`; new work gets the next version's entry (see the `publish-test` skill, "Patch notes and versions").
- Afterwards fetch the live page AND its version file and compare stamps (phones read `version-phone.txt`, PC reads `version.txt`) before saying a release is done.
- To check at any time that `live` is what players have: `tools/push_live.ps1 -DryRun` answers "already identical" (it compares with the Pages branch); for the pages as served, download each file from https://sizzentra.github.io/driftline/ and compare `git hash-object <file>` with `git rev-parse live:site/<file>`.
