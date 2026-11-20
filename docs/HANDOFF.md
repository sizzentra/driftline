# Handoff note

Updated at the end of every session (CLAUDE.md). Current facts only; older notes go to `docs/HISTORY.md`. Shown to the director only on request.

**Last updated:** 2026-11-19, 22:20 (hotfix 0.4.8.9.4 live, phase 1 approved, phase 2 next)

## Where things are
| Where | Version | Stamp | What |
|---|---|---|---|
| Live (PC, Android, iPhone) | 0.4.8.9.4 | 2026.11.19-2100 | hotfix: phone Bait chip, PC oddity names, PC Pets "still to find" tiles (tag v0.4.8.9.4); confirmed by the director (iPhone, PC) and Cam (Pixel) |
| Test builds (phone test apps, /driftline/next/) | 0.4.9 | 2026.11.19-2100 | the whole unreleased 0.4.9 patch, now with the same three fixes |

## What is open
- **Next live hotfix:** copy `tools/hotfix_0.4.8.9.4.ps1` (exact, count-checked replacements on site/*.html; check copy to testapps/hotfix/, then the same script onto site/). Live tags still hold 0.4.9 work. `testapps/hotfix/` now equals live 0.4.8.9.4.
- **Phase 1 (one-page rulebook, dictionary, this note): done**, approved by the director on 2026-11-19 (doc "Driftline Rulebook", https://claude.ai/artifact/BNqRNnji6FVZY7zdduaqro, and a Discord copy; keep both in step with CLAUDE.md). **Phase 2 has the go-ahead** (director, 2026-11-19: "Approved. Proceed"), to run in a fresh session: count which tests ever caught a real bug (docs/qc_incidents.csv vs the QA list) and show the count before cutting anything; one automatic check that refuses to publish on failure and writes the report (PASS/FAIL + a never-empty Not verified list); the device report panel in test builds only (fps, worst stutters, errors with screen, screen size/OS/stamp, Copy report); the ~10-step 5-minute phone script; prove each layer by planting one bug of each kind. Nothing installed; Chrome engine only.
- **0.4.9** stays on the test builds until the director has tested it on every platform.
- **Open director decisions:** bigger tap targets (ours 32–40 pt vs 44 pt guidance), text size, left-handed / menu side, colour-blind help, a real tablet layout, the Trophy Room name, whether the aquarium empties on a new voyage, the aquarium tail-wag speed-up (changes the animation slightly; phone cost not measured).
- Unanswered questionnaire rows in the workflow doc (5, 6, 7, 10, 12, 14, 15).

## Not verified
- Hotfix 0.4.8.9.4: the director (iPhone, PC) and Cam (Pixel) said it looks right, on fresh saves. Not seen on a real phone: the Bait chip during a real Live event, and oddity names with found oddities (both measured in Chrome only).
- Feel: nothing gameplay-related changed this session.
