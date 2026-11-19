# QC analysis: which checks work, and in what order

Data: `docs/qc_incidents.csv` (every recorded bug: category, who found it, where, severity 0–3, what catches it now). Add a row for
every new bug, every round, and re-run the numbers below at the end of each project (PowerShell: `Import-Csv` + `Group-Object`).

## Numbers (80 incidents, 2026-11-18 → 2026-11-19)
- Found by: the director 36 (45%), Cam 8 (10%), my checks 17 (21%), me by hand 19 (24%). **More than half were found by players.**
- Where: before release 40, on the test apps 22, **live 18**.
- Escape rate (reached the test apps or live): 59% on 2026-11-18 → 35% on 2026-11-19, after the parse gate, page-tab and
  every-page checks arrived.

| Category | Bugs | Reached players | Caught by my checks/me | Avg severity | What catches it |
|---|---|---|---|---|---|
| script break (syntax, wrap, regex) | 8 | 1 | 7 | **3.0** | parse gate + boot, **after the last edit** |
| layout cut / overflow | 14 | 8 | 6 | 1.3 | `__spec` + `__layoutQC` at every size, every page |
| touch / installed app | 5 | **5** | **0** | 2.2 | touch checklist + real phone sign-off |
| UI logic (wrong content per tab/chip) | 6 | 5 | 1 | 1.2 | `__qa` page tabs, tab-content checks |
| duplicate name / design | 4 | **4** | 0 | 1.5 | `__qa` no-name-twice, menu-top-row, empty pages |
| Safari-only | 2 | **2** | 0 | 2.0 | robust layout + checks that force the failing case; WebKit not testable here |
| save-state (moved/heavy saves) | 2 | 2 | 0 | 2.0 | heavy-save fixture |
| performance on device | 5 | 3 | 2 | 1.8 | 120 Hz frame-loop test, draw-cost matrix |
| release / versions | 4 | 2 | 2 | 1.5 | gate: stamps vs version files, frozen notes |
| test-tool / process | 16 | 0 | 15 | 0.8 | rules (they cost time, not players) |

## What the data says
1. **The parse gate is the best check there is:** every script break was severity 3 (game dead), and it caught 7 of 8 in
   seconds. The one escape (the live outage) came from an edit made after QC. → It runs **first** (nothing else means anything
   if the script is broken) and **again after the last edit**, right before any publish.
2. **Checks only find what they visit.** The worst gap of 2026-11-19 was every new check skipping the top-bar pages. → Every
   check walks `qaAllPages()` and every size, including split-screen.
3. **An unproven check is worth nothing:** 3 of 6 new checks passed with their bug present until I put the bug back. → Prove
   each new check the moment it is written.
4. **Touch, installed-app and Safari bugs escaped 100%.** Chrome can't produce them. → They get their own step (checklist +
   robust design), and every round that touches them ends with "needs a real-phone check" in the closing message.
5. **Visible-content bugs (duplicates, wrong tab content, empty states) were only ever found by the director** until the
   2026-11-19 checks. → `__qa` runs before the layout sweep: it is cheaper and now covers them.
6. **Order by cost and dependency:** cheapest, broadest, most severe first; anything slow or device-specific last; nothing
   edited after the final gate.

## The order (mirrored in CLAUDE.md, "The round checklist")
1. Build → **parse gate + boot** (seconds; severity-3 bugs).
2. **`__qa`** on all three builds (≈30 s each; logic, page tabs, duplicates, bars, empty pages, pets, rail, top row).
3. **`__spec` + `__layoutQC` + `__searchQC` + `__questsQC`** at every size incl. split-screen, one tool at a time (layout, the
   biggest category).
4. **Performance** (draw-cost matrix, heavy save, 120 Hz loop) only when per-frame code or saves changed.
5. **Touch / installed-app / Safari risks** (checklist; robust design; flag for the real phone).
6. Notes, docs, incident rows → **parse gate again (after the last edit)** → publish → check the published stamps.
