# Outside review of 2026-11-26: what the PC measured

The review itself: `driftline_review_for_pc_claude_md.pdf` (the director's Downloads), written by a Claude cloud session on commit df893af.
This file is the PC's answer to its "Start here" steps 2 and 3. Nothing was fixed. Live untouched.
Run on the director's PC, 2026-11-26, in the long-running session switched to Fable 5.2 (the director's choice).
Rollback tag before any foundation work: `rollback/before-foundation`.

## Publish timings (one test-build publish, same game, stamp 2026.11.26-1230)

| Step | Time |
|---|---|
| build.ps1 -Preview (three builds) | 5 s |
| Full sweep, brand-new save | 19.9 min |
| Full sweep, test save (PC busy: git walks, then a game running) | 37.1 min |
| git add + commit | 1 s |
| git push origin main | 3 s |
| git subtree push --prefix site (PC preview) | 199 s |
| git subtree push --prefix testapps (phone test apps) | 273 s |
| The history walk alone, no upload (git subtree split) | 118 s testapps, 145 s site |

The two subtree pushes are about 8 minutes of every publish, nearly all of it re-walking 728 commits (the review measured 4-5 s on Linux; on Windows it is 30 times slower). The upload itself is seconds. `.git` is 942 MB on disk with a 15.6 MB pack, so almost all of it is loose objects.

## Section 2 findings on this PC

| # | Finding | Brand-new save | Test save | Verdict |
|---|---|---|---|---|
| 2.1 | Willow Pond heaviest water | __mapQC passes (under the 3.2x ceiling), phone and PC | passes | Not reproduced on this graphics card. Code reading confirmed: PC repaints a willow slice every .03 s (a3_plat.js:7, f3_foliage.js:38). Real-frame numbers still to take with the pane visible, and Cam's frame counter. |
| 2.2 | "save -> load keeps everything": changed: docks | FAILS on all four __qa runs | passes | Real, exactly as described. bm_ui04.js:46 creates st.docks; fresh() has none. No data lost. |
| 2.3 | No offline play after one visit | not run here (worker registers on https only) | - | Confirmed by reading sw.js (CORE holds only the router) and shell_bottom.html:8. |
| 2.4 | Phone "mouse wheel" text | not flagged | not flagged | Not reproduced. settings08.js:49 rewrites that line on phones; the source text is in d2_extra.js:182. |
| 2.4 | Patch-notes line spills 31 px | not flagged | not flagged | Not reproduced. |
| 2.4 | __snapQC Rods "None" moved 74 px | 0 issues | 0 issues | Not reproduced. |
| 2.4 | False alarms on "clicking" / "hovering" | none | none | Not reproduced. |
| 2.5 | search "no location" x9, quests tabs missing | passes (79 / 75) | passes | Not reproduced. |
| 2.5 | Fight check "skilled lands rarity 5 only 67%" | passed | failed once (PC 1440x900) | Real and random: the held round 7 item (#225). Shows as FAIL, not HELD, on some sizes. |
| 2.6 | CLAUDE.md garbled characters | - | - | Real, and worse than counted: 230 lone garbled marks in 67,008 characters. |
| 2.6 | Manifests say "224 fish, eight waters"; page says "520 fish, ten waters" | - | - | Real (4 manifests, shell_top.html). |
| 2.6 | PLAN still lists #124 as open | - | - | Real (PLAN line 39; none of the three functions exist). |
| 2.6 | README out of date | - | - | Real. |
| 3 | 355 empty catches, 12 migrate wraps, wrap counts 242/63/29/13 and 272/82/30/14 | - | - | Counts match (355 catches; 11 files wrap migrate by grep). |

Where the PC differed from the review: the 2.4 and 2.5 phone lines did not appear in either run here, so they belong to the review's own set-up (software drawing, its stand-in server) until someone reproduces them. The sweep found nothing else: the brand-new-save run's only red lines were the four `docks` ones.

Also seen: in the test-save run, "Fresh save" (2 checks) and "PC sizes" (3 checks) timed out while the PC was busy; re-run alone they passed in 2.1 minutes. A sweep that depends on how busy the machine is supports the review's F1 (one command, invisible browser).

Reports kept: `tools/shots/sweep_fresh_1126.json`, `tools/shots/sweep_testsave_1126.json`.
