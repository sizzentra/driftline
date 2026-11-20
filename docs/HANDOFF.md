# Handoff note

Updated at the end of every session (CLAUDE.md). Current facts only; older notes go to `docs/HISTORY.md`. Shown to the director only on request.

**Last updated:** 2026-11-19, 23:50 (phase 2 reverted on the director's word; test builds back to 0.4.9 at stamp 2100)

## Where things are
| Where | Version | Stamp | What |
|---|---|---|---|
| Live (PC, Android, iPhone) | 0.4.8.9.4 | 2026.11.19-2100 | unchanged |
| Test builds (phone test apps, /driftline/next/) | 0.4.9 | 2026.11.19-2100 | the same files as before the proposal work (commit 8033ae5) |

## What happened (2026-11-19, late)
- Phase 2 was built and published as test build 2305 (automatic check `check.ps1`, device report, publish gate). Right after updating to it, **Cam's Pixel froze** at start-up (black water, top bar at its starting values, no taps). The cause was never found: it did not happen in Chrome in any setup tried (fresh save, played save, old build then new, Android identity, clock shifted).
- **The director's decision:** "Revert to the test builds that were active before any of the proposals and use the same checks that one had at the time." Done: `src/`, `build.ps1`, the publish scripts, `tools/serve_local.ps1`, `site/next/` and `testapps/` are identical to commit 12e08d6 (pre-proposal code); the phase 2 tools and their docs were removed. The rulebook (CLAUDE.md) was not touched. Phase 2 work stays in git history (commits d6bc2b0, 2e978d8) if it is ever wanted again.
- Checks are the old ones again: the round checklist in docs/REFERENCE.md (parse gate, `__qa` on every build, the layout sweeps). `docs/TEST_COUNT.md` (which tests ever caught a bug) is kept as information.

## What is open
- **Cam:** reopen DL Test Android; it should offer the update and land back on the 2100 build. Not confirmed yet.
- Reverted along with phase 2 (each was a real fix, parked until the director wants them back): a brand-new save could lose some Wisdom Pearls on its first reload (`fresh()` has no `pearlV`); three functions nothing calls (`boardwalkBanner`, `clawHTML`, `pathOn`); a flaky QA test (a random shiny breaks the batch 5 waters price limit).
- A PS5 controller on this PC reaches `__qa` fight tests when it is in use (a held trigger reels): run `__qa` with the controller idle.
- **0.4.9** stays on the test builds until the director has tested it on every platform. Next live hotfix: copy `tools/hotfix_0.4.8.9.4.ps1`.
- Open director decisions (unchanged): tap target size, text size, left-handed menu side, colour-blind help, a tablet layout, the Trophy Room name, whether the aquarium empties on a new voyage, the aquarium tail-wag speed-up. Unanswered questionnaire rows in the workflow doc (5, 6, 7, 10, 12, 14, 15).
- The doc "Driftline Phase 2: try it with Cam" (claude.ai) describes the reverted work; delete it only if the director asks.

## Not verified
- That Cam's Pixel works again on 2100 after the revert.
- Why 2305 froze on his Pixel.
