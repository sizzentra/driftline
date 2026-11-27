---
name: publish-test
description: Driftline - publish a preview build to the test builds (PC preview and the phone test apps), with tester notes, version numbers and the stamp check. Use after the checks pass, for any test-build publish.
---
# Driftline: publishing the test builds

Test builds are the default target; Claude may publish them on its own after the checks pass, and reports each one. Nothing here touches the live game.

1. `powershell -ExecutionPolicy Bypass -File build.ps1 -Preview` (writes `site/next/` and `testapps/`; prints the stamp).
2. Gate after the LAST edit: `tools/sweep_all.ps1 -Saves new -Only gate,boot` (or `next/sweep.html?only=gate&go` in the pane). Nothing is edited after the gate (the one live outage came from an edit after QC).
3. Notes: every changed build has its line under `## New in this build` in `src/pc/notes_test.js` (PC) and `src/mobile/notes_test.js` (both phones; a line that differs per phone is `{android:'...', ios:'...'}`). When the next round starts, that heading becomes `## Test build <stamp>` and a new `## New in this build` goes on top.
4. Docs in the same step: CLAUDE.md "Where we left off" (stamp, one line), `docs/CHANGE_LOG.md`, `docs/PLAN.md` marks, one row per new bug in `docs/qc_incidents.csv` (the build checks its labels), `docs/LESSONS.md` for anything learned.
5. Commit (source, docs and the built pages together), `git push origin main`.
6. Publish (5 seconds each; each checks that the published files are identical to the commit):
   - PC preview: `powershell -ExecutionPolicy Bypass -File tools/push_folder.ps1 -Prefix site -Remote origin`
   - Phone test apps: `powershell -ExecutionPolicy Bypass -File tools/push_folder.ps1 -Prefix testapps -Remote https://github.com/sizzentra/driftline-test.git`
   (`publish_preview.ps1` and `publish_testapps.ps1` wrap the same steps.)
7. About a minute later read the published stamps: `https://sizzentra.github.io/driftline/next/version.txt`, `https://sizzentra.github.io/driftline-test/android/version.txt`, `.../iphone/version.txt`; and confirm live did not move (`https://sizzentra.github.io/driftline/version.txt` for PC, `.../version-phone.txt` for phones).
8. The message to the director starts with where it is (**Test builds only** + stamp) and ends with "Awaiting your feedback and testing": numbered directions saying which device, where to tap, what they should see and what to send back.

Every test-app publish shows the update bar to the testers: batch publishes, do not publish twice for one change.

## Patch notes and versions
- **Every update gets player notes** (ghost patches and live fixes too) in `notes_release.js`, and tester lines in `notes_test.js` for each changed build: `src/pc/` for PC, `src/mobile/` for both phones (one file since 2026-11-20; a line that differs per phone is `{android:'…', ios:'…'}`, a line for one phone names only that phone) (the test card re-opens whenever its text changes).
- **Test notes are grouped by test build, newest first** (director, 2026-11-20: "better separation of what keeps being added"): new lines go under `## New in this build`; when the next round starts, that heading becomes `## Test build <stamp>` and a new `## New in this build` goes on top. Testers read only the top section.
- **Spoiler-free but complete:** mention every change, including small fixes, renames and shortcuts; "21 new fish", never their names; no secret fish, crate-only pets, hidden rods or exact odds. Exclusive gifts get only a vague mention (their own notes card on redeem).
- **A published entry is frozen.** Before editing `notes_release.js`, compare the entry's version with the live page's `GAME_VERSION`; new work gets the next version's entry.
- **Numbers climb slowly** ("we're nowhere near 1.0"): 3rd number = new content (0.4.8 → 0.4.9), 4th = fix/polish rounds (0.4.8.6 → 0.4.8.7), 5th = ghost patch / hotfix (0.4.8.5 → 0.4.8.5.1); 0.5+ only for very large updates. If a round mixes content and fixes and it's unclear, ask. State the number when publishing.
- **Where numbers live:** `$platVer` in build.ps1 sets `GAME_VERSION` for each build ("what’s new" triggers on it). Since 0.4.8.7 all three share one number; a release for only some platforms moves only theirs.
- **Game text follows docs/TEXT_STANDARD.md** (short tips, jokes never shortened, each device’s own words written at the source with `PLAT.touch()`; checked by tools). **Curly apostrophes (’) only** in notes and other single-quoted strings: a straight one ended a string and took both phones down once.

