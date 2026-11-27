# Driftline: the `live` branch

This branch holds exactly what players have: the files published at https://sizzentra.github.io/driftline/ and nothing else.
The folder `site/` here is the live site, file for file (without `site/next/`, the PC test build, which comes from `main`).

- Every commit on this branch is one change to the live game: a hotfix or a release. `git log live` is the list of what players have had.
- There is no game source here. The live pages are built pages that were patched by the hotfix scripts
  (`tools/hotfix_*.ps1` on `main`), so no commit of the source builds them. The pages themselves are the source of truth.
- A hotfix is a commit here that changes the pages (and the version file of the platform it touches).
- Publishing: `tools/push_live.ps1` on `main` puts this branch's `site/` on the Pages branch and keeps the test build's `next/` as it is.
- The rules for going live are in `.claude/skills/live-and-hotfix/SKILL.md` on `main`.

Started 2026-11-26 (Foundation F2) from the published pages: PC 0.4.8.9.6 (stamp 2026.11.21-2220, commit 7b3b949 on `main`),
Android and iPhone 0.4.8.9.4 (stamp 2026.11.19-2100, commit cfe9067 on `main`).
