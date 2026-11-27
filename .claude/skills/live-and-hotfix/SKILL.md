---
name: live-and-hotfix
description: Driftline - anything that changes the LIVE game - a live hotfix for a bug, a phones-only release, or a full release. Only on the director's word ("Push it live") or, for bug hotfixes, under the standing permission after the check copy is confirmed. Use before touching site/pc.html, site/android.html, site/ios.html or the live version files.
---
# Driftline: going live and hotfixes

**Never on Claude's own:** anything that changes look or feel, balance numbers, and the 0.5 release itself. **Allowed on its own, reported each time:** live hotfixes for bugs, after the checks pass and the check copy is confirmed on the platforms they touch. Before changing any system, tag a rollback point (`rollback/before-<what>`). Never publish the Windows exes until a download has been tested by the director.

Live right now and the waiting hotfix are in CLAUDE.md "Where we left off". A release build never contains `DL_PREVIEW`, the QA suite (`bn_qa04.js`), tester tools or plain-text gift codes.

- **Live, phones only (on the director's word):** `build.ps1` (release), then restore `site/pc.html` and `site/version.txt` from HEAD so PC sees no update; ship `site/android.html`, `site/ios.html`, `site/index.html`, `site/version-phone.txt` and `site/manifest-android.webmanifest`; run the gate on the release pages; commit ("Live for Android and iPhone: … (PC unchanged; live stamp kept)"), push `main`, `tools/push_folder.ps1 -Prefix site -Remote origin` (since 2026-11-26 every publish script uses it in place of `git subtree push`, which re-read the whole history, 3 to 4.5 minutes per folder; it puts the committed folder on the Pages branch as one commit and checks the published files are identical), tag the version. Check the live pages' stamps afterwards (phones read `version-phone.txt`, PC reads `version.txt`).
- **Live hotfix (live tags hold 0.4.9 work, so never build from a tag):** copy `tools/hotfix_0.4.8.9.4.ps1` to the new version; it patches the live pages with exact, count-checked replacements, writes the check copy to `testapps/hotfix/` (published with the test apps), and after both phones confirm and the director says "Push it live", writes the same patches into the live pages, so what the phones confirmed is byte-for-byte what ships.
- **Live, everything:** `publish.ps1 -Message "…"` (builds, commits, pushes main and gh-pages) only when the director approves a full release.
- A release build never contains `DL_PREVIEW`, the QA suite (`bn_qa04.js`), tester tools or plain-text gift codes. Small measuring hooks gated by `?test` do ship in shared files (they only wake with `?test` in the address and cost nothing otherwise).


## Before any of it
- The full round checklist (the `full-batch` skill) on the release pages.
- A published notes entry is frozen: before editing `notes_release.js`, compare the entry's version with the live page's `GAME_VERSION`; new work gets the next version's entry (see the `publish-test` skill, "Patch notes and versions").
- Afterwards fetch the live page AND its version file and compare stamps (phones read `version-phone.txt`, PC reads `version.txt`) before saying a release is done.
