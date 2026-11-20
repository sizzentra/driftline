# Handoff note

Updated at the end of every session (CLAUDE.md). Current facts only; older notes go to `docs/HISTORY.md`. Shown to the director only on request.

**Last updated:** 2026-11-19, 23:10 (phase 2 built and proven; test builds published at 2305; waiting for the director's count decision and the first phone script runs)

## Where things are
| Where | Version | Stamp | What |
|---|---|---|---|
| Live (PC, Android, iPhone) | 0.4.8.9.4 | 2026.11.19-2100 | unchanged this session |
| Test builds (phone test apps, /driftline/next/) | 0.4.9 | 2026.11.19-2305 | 0.4.9 + phase 2: device report (tap the "test build" pill), a pearl save fix, 3 dead functions removed, test card + 0.4.9 notes lines. Check: PASS (`checks/report-2026.11.19-2305.txt`) |

## Phase 2 (the baseline test): built
- **Count:** `docs/TEST_COUNT.md`. 97 logic tests: 13 caught a real bug, 15 guard a player-found bug, 69 never linked to one. Nothing cut; the director decides.
- **The automatic check:** `check.ps1` (one command, headless Chrome already on the PC, about 7 minutes; details in REFERENCE "The automatic check"). Code rules live in `tools/code_rules.ps1` (build.ps1 uses the same file). Publish scripts refuse without a PASS for the same stamp and page contents (`tools/check_gate.ps1`); `publish_preview.ps1` no longer rebuilds.
- **Device report:** `src/testonly/device_report.js`, test builds only (`src/testonly/` is added by build.ps1 -Preview; a release page holding it is refused). Proof page: `tools/check/devreport_proof.ps1`.
- **Phone script:** `docs/PHONE_SCRIPT.md` (10 steps + how to use the device report). Not tried by the director or Cam yet.
- **For the director and Cam:** doc "Driftline Phase 2: try it with Cam" (https://claude.ai/artifact/Q7UDgTw65rkrwXS435S3d6): count, phone script, device report, proof; a comment there asks whether to cut the Search and Quests checks.
- **Proof:** `docs/PROOF_PHASE2.md` (coin rule → logic tests; cut label → layout checks; dead function → build/code rules; slow screen → device report; publish gate refusals).

## What is open
- **Director:** read the count table and say which tests (if any) to cut; run the phone script once with Cam and flag unclear steps; send both device reports.
- **Pixel 10 size** in check.ps1 is assumed 915×412 until Cam's report shows his window size.
- Follow-ups are listed in `docs/PLAN.md` under "Workflow phase 2 follow-ups" (live publish guard for rule 10, random-roll tests, page pictures, split-screen sizes, heavy save).
- **0.4.9** stays on the test builds until the director has tested it on every platform. Next live hotfix: copy `tools/hotfix_0.4.8.9.4.ps1`.
- Open director decisions (unchanged): tap target size, text size, left-handed menu side, colour-blind help, a tablet layout, the Trophy Room name, whether the aquarium empties on a new voyage, the aquarium tail-wag speed-up. Unanswered questionnaire rows in the workflow doc (5, 6, 7, 10, 12, 14, 15).
- A PS5 controller is connected to this PC and was in use during the session: it reached the tests until the check switched controllers off (incident #126). Any test run outside check.ps1 can still pick it up.

## Not verified
- Everything on real phones: the device report panel, Copy report (the built-in browser blocked the clipboard and the fallback selected the text), the badge tap with a finger, the phone script itself.
- Safari's engine: the check runs Chrome's only.
- The pearl fix on a real old save (tested with constructed saves only).
- Feel: nothing gameplay-related changed.
