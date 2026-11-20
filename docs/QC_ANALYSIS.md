# QC analysis: which checks work, and in what order

Data: `docs/qc_incidents.csv` (every recorded bug: category, who found it, where, severity 0–3, what catches it now). Add a row for
every new bug, every round, and re-run the numbers below at the end of each project (PowerShell: `Import-Csv` + `Group-Object`).

## Numbers (89 incidents, 2026-11-18 → 2026-11-19)
- Found by: the director 39 (44%), Cam 8 (9%), my checks 19 (21%), me by hand 23 (26%). **More than half were found by players.**
- Where: before release 46, on the test apps 22, **live 21**.
- Escape rate (reached the test apps or live): 59% on 2026-11-18 → 35% on 2026-11-19, after the parse gate, page-tab and
  every-page checks arrived.

| Category | Bugs | Reached players | Caught by my checks/me | Avg severity | What catches it |
|---|---|---|---|---|---|
| script break (syntax, wrap, regex, line-based inserts) | 10 | 1 | 9 | **3.0** | parse gate + boot, **after the last edit** |
| layout cut / overflow | 17 | 9 | 8 | 1.3 | `__spec` + `__layoutQC` at every size, every page |
| touch / installed app | 5 | **5** | **0** | 2.2 | touch checklist + real phone sign-off |
| UI logic (wrong content per tab/chip, out of sight) | 7 | 6 | 1 | 1.3 | `__qa` page tabs, tab-content checks |
| duplicate name / design | 4 | **4** | 0 | 1.5 | `__qa` no-name-twice, menu-top-row, empty pages |
| Safari-only | 2 | **2** | 0 | 2.0 | robust layout + checks that force the failing case; WebKit not testable here |
| save-state (moved/heavy saves) | 2 | 2 | 0 | 2.0 | heavy-save fixture |
| performance on device | 6 | 4 | 2 | 1.8 | `__qa` frame pacing (60/90/120/144 Hz), draw-cost matrix |
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
6. **The director's "missing" or "choppy" was 3 times out of 3 a condition my tests never set up** (2026-11-19, round 2): a scrolled list (details opened out of sight), a 90 Hz screen (uneven frames), a 1440×900 window (PC Fish Log cut). → Checks now set those conditions themselves: frame pacing at four refresh rates, PC `__qa` at 1920×1080 **and** 1440×900, unreachable-content and first-frame checks on every page; a report of something missing is reproduced along the player's path first.
7. **Order by cost and dependency:** cheapest, broadest, most severe first; anything slow or device-specific last; nothing
   edited after the final gate.

## The order (mirrored in CLAUDE.md, "The round checklist")
1. Build → **parse gate + boot** (seconds; severity-3 bugs).
2. **`__qa`** on all three builds (PC at 1920×1080 and 1440×900) (≈30 s each; logic, page tabs, duplicates, bars, empty pages, pets, rail, top row).
3. **`__spec` + `__layoutQC` + `__searchQC` + `__questsQC`** at every size incl. split-screen, one tool at a time (layout, the
   biggest category).
4. **Performance** (draw-cost matrix, heavy save, 120 Hz loop) only when per-frame code or saves changed.
5. **Touch / installed-app / Safari risks** (checklist; robust design; flag for the real phone).
6. Notes, docs, incident rows → **parse gate again (after the last edit)** → publish → check the published stamps.

## New checks vs old (running log from 2026-11-20, for the director's final report)
The old suite passed 97/97 while every problem below existed.
| # | Found by | Problem | Where | Status |
|---|---|---|---|---|
| 1 | `__contentQC` (spill) | Rods "In your hands" hid the Upgrade button and attachment slot | PC full HD, live and test | fixed, live hotfix 0.4.8.9.5 |
| 2 | `__contentQC` (spill, overlap, after-play states) | Boardwalk cards: chests Open button under Counter specials, buttons over card edges, results over buttons | PC full HD, test | fixed (0330) |
| 3 | `__contentQC` (overlap) | Voyage milestones a word per line, labels over text | PC all sizes, test | fixed (0330) |
| 4 | `__contentQC` (pictures in a group) | Mystery crates, Higher or lower (after a game, PC), Gamble (empty, phones) without a picture | all | held for the director |
| 5 | Cam, then `__contentQC` (mini-game pop-ups) | Three chests overflowed their pop-up | phones, test | fixed (0330), check proven |
| 6 | start-up check (boot every build before publishing) | Own change crashed the game at start-up (`typeof` on a later `const`) | all builds, local | fixed before publishing |
| 7 | Cam, then the new QA test | Tide Pass Claim button missing on phones (rewards could not be claimed) | phones, live and test | fixed on test, live hotfix 0.4.8.9.6 ready |
| 8 | the director, fish sheet by eye | Nile fish headdress floating like a hockey stick, eye line across the eye (attachment at guessed spots, breaking the outline rule) | all, test | fixed; an automatic attachment check comes with the content recipes |
| 9 | the director, then a new QA test | My own Cooler/Aquarium switch left a blank button on other pages | phones, test | fixed; QA checks every page for blank top-row buttons |

## Full sweep of the new systems (2026-11-20, test build 0403 source)
- Content check, normal + extreme save, every page and tab (~240–310 cards a run) plus every mini-game pop-up: phones 956×440, 915×412 (Android build), 667×375, 440×460; PC 1920×1080, 1440×900, 1024×640. Only findings: the held picture decisions (Mystery crates everywhere, Gamble on phones). Nothing new.
- Test suite: 102/102 on iPhone, Android, PC 1920×1080 and PC 1440×900 after fixing the flaky #127 (it failed once in this sweep, then passed).
- Start-up check: every build starts with no errors. The test save was unchanged by all of it.
- Process finding: one sweep took about 20 manual steps (resize, load, run, read, per size). Next tool: one sweep page that runs every size and build in frames and gives a single report.
