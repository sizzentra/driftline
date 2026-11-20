# Handoff note

Updated at the end of every session (CLAUDE.md). Current facts only; older notes go to `docs/HISTORY.md`. Shown to the director only on request.

**Last updated:** 2026-11-19, 21:10 (hotfix 0.4.8.9.4 + phase 1 session)

## Where things are
| Where | Version | Stamp | What |
|---|---|---|---|
| Live (PC, Android, iPhone) | 0.4.8.9.3 | 2026.11.19-1402 | unchanged this session |
| Hotfix check copy, https://sizzentra.github.io/driftline-test/hotfix/ | 0.4.8.9.4 | 2026.11.19-2100 | live game + 3 fixes: phone Bait chip, PC oddity names, PC Pets "still to find" tiles. Plays on the player's real save (same site as live). |
| Test builds (phone test apps, /driftline/next/) | 0.4.9 | 2026.11.19-2100 | the whole unreleased 0.4.9 patch, now with the same three fixes |

## What is open
- **Hotfix 0.4.8.9.4 waits for:** the director's iPhone check, Cam's Pixel check, the director's PC check, then the director's "Push it live". To ship: `tools/hotfix_0.4.8.9.4.ps1 -From site -To site -Stamp 2026.11.19-2100` (same stamp, so the pages equal the checked copy), parse the pages, commit, push main, `git subtree push --prefix site origin gh-pages`, tag `v0.4.8.9.4`, check the live stamps.
- **Phase 1 (one-page rulebook, dictionary, this note):** written, waiting for the director's and Cam's approval. Phase 2 (baseline check, device report, phone script) and phase 3 (code reorganisation) wait for the director's go-ahead. No new content during phases 1–3. Nothing gets installed on the PC.
- **0.4.9** stays on the test builds until the director has tested it on every platform.
- **Open director decisions:** bigger tap targets (ours 32–40 pt vs 44 pt guidance), text size, left-handed / menu side, colour-blind help, a real tablet layout, the Trophy Room name, whether the aquarium empties on a new voyage, the aquarium tail-wag speed-up (changes the animation slightly; phone cost not measured).
- Unanswered questionnaire rows in the workflow doc (5, 6, 7, 10, 12, 14, 15).

## Not verified
- All three hotfixes on real phones and Safari (checked only in Chrome's engine at 932×430, 915×412, 874×402, 780×360, 667×375, and PC 1024×640 / 1440×900 / 1920×1080).
- The live-event case was forced by shifting the page clock; a real event on a real phone is the director's/Cam's check.
- Feel: nothing gameplay-related changed this session.
