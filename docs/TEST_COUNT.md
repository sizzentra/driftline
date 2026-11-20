# Which tests ever caught a real bug (phase 2, step 1: count before cutting)

Made 2026-11-19 from `docs/qc_incidents.csv` (120 logged bugs), the 0.4 audit (`docs/QA_0.4_report.md`, 14 defects), `docs/LESSONS.md`, and every test in `src/bn_qa04.js` plus the separate tools. **Nothing has been removed.** The director decides what is cut.

Three verdicts:
- **Caught** = the test found a real bug before a player did.
- **Guard** = written after a bug was found another way (mostly by the director or Cam); it has not caught anything new yet, but it would catch that bug again.
- **Never** = no logged bug links to it. It may still protect something (a coin rule, a save), it just has never fired on a real bug.

## The count

| What | How many | Caught | Guard | Never |
|---|---|---|---|---|
| Logic tests in `__qa` | 97 | 13 | 15 | 69 |
| Separate check tools | 9 | 4 | 3 | 2 |
| Build and gate checks | 5 | 2 | 3 | 0 |
| Picture / measuring tools (not checks) | 16 | 0 | 0 | 16 |

The logged bugs (120, of which 99 are game bugs; the rest are slips in Claude's own process or tests):
- Game bugs found by the director 39, Cam 8, Claude's checks 36, Claude by hand 16.
- 51 of the 99 reached the test apps or the live game. Only 5 of the 36 that a check found got that far.

## Tests and tools that caught real bugs (keep)

| Test or tool | Bugs it caught (log numbers) |
|---|---|
| Parse gate (every page's code is read once before anything runs) | 6: #5, #6, #7, #30, #35, #73 (each would have killed the game) |
| `__layoutQC` (cut, hidden or off-screen text on every page) | 7: #11, #29, #33, #103, #110, #111, audit #9 |
| `__spec` (phone frame and control sizes) | 2: #76, #111 |
| `__drawCost` (drawing cost per water) | 1: #21 |
| Broken saves load safely | 3: audit #1 (a damaged save overwrote the real one), #2, #3 |
| 3,000 random actions | 5: audit #4, #5, #6, #7, #109 |
| Page tabs: a hidden part never stays | 3: #62, #63, #119 |
| Page bars: numbers never cut | 2: #77, #102 |
| Each water bait is best at its own water | 2: #91, #97 |
| Deep QC: own names, readable labels | 2: #107, #108 |
| Top bar complete from the first frame | 1: #84 |
| Top bar fits the longest bait name | 1: #96 |
| Favourite foods | 1: #100 |
| Start-up save pass | 1: #98 (old pearls would have lost their bonus) |
| Oddities: unique ids and names | 1: #99 |
| Aquarium rates add up | 1: #95 |
| Touch: pages never bounce | 1: #85 (found by accident at 1440×900) |
| Build: no function replaced and left behind | 30 dead functions found when it was added (#115) |
| Build: no function declared twice | written for #94 (guard) |

## Guards (written after a player found the bug; keep while they are cheap)

| Test | The bug it was written for |
|---|---|
| Side panel fits (iPhone rail) | #67, #93 (director, live) |
| No name twice | #68 |
| Empty pages fill the screen | #70 |
| Pets awake everywhere but at night | #74 |
| Menu top row: one thing lit | #75 |
| Frame pacing on 60/90/120/144 Hz | #83 |
| No unreachable content | #85 |
| Decorations hide/remove | #86 |
| Every kind of catch can be fought | #94 (live: oddity fights crashed) |
| Batch 6 fight: holding reel loses rare fish | #101 |
| Aquarium real sizes + hair volume | #104, #105 |
| Bait chip never cut with Tasks/Live | #111, #118 |
| Badges never cut | #82 |
| Contrast 3+ on every page | hand-found contrast bug (0.4) |
| Action gate never blocks a real button | audit #6 |
| Build: platform code stays out of shared files | #57 |
| Build: each build holds its own platform files | (no bug yet; it enforces rule 7) |
| `__safeSim` (iPhone camera and corners) | #1 |
| `__spec` sizes standard | #3, #14, #19, #22, #25, #26, #41 |

## Never linked to a bug (69 logic tests, 2 tools)

| Group | Tests | Note |
|---|---|---|
| Data (species, gear, XP, baits, rods, pages) | 7 | cheap (milliseconds) |
| Odds (catch odds, hunts, fights) | 6 | cheap; they guard fairness |
| Economy (buying, selling, aquarium, feats, Tide Pass) | 15 | **the coin rules**; step 5 plants a coin bug to show they still catch one |
| Events | 3 | cheap |
| Saves (round trip, old saves, save codes, docks) | 5 | they guard the one save everyone shares |
| Pages render with no error (3 saves) | 3 | the broadest smoke test there is |
| Feature tests from the 0.4.9 batches ([16] [23] [24] [18] [19] [11] [20] [52], Tide Pass, batch 4 looks, batch 5 waters, [14] [15], Paths) | 13 | new; none has had time to catch anything |
| Fights (fight pass, snags, swallowed fish, Angler strength) | 4 | balance targets |
| Other UI (menu, weights, weekly, forecast, no Menu button, Boardwalk prizes, cast bar, mouse, PC top bar, PC full screen, short numbers, menu open/close, PC display) | 13 | |
| `__searchQC`, `__questsQC` (Search and Quests on phones) | 2 tools | never caught a bug; once raised a false alarm |

## Checks the log names that do not exist as code
The log's "caught now by" column names some checks that were only ever a habit: `fnTime` (#10, #34), a heavy-save fixture (#48), a look-behind grep (#23), the stamp-vs-version-file gate (#43), the touch checklist (#36, #42, #46, #49, #79) and a frame-loop test at 120 Hz (#27, #44; the frame pacing test covers it now). The new automatic check adds the look-behind grep and the stamp gate as real code. The touch bugs stay with the phone script, because Chrome can't produce them.

## Claude's recommendation (the director decides)
Keep everything that caught something or guards a player-found bug (28 logic tests, all the tools that check). **Cut nothing yet** from the 69: together they take seconds, and the coin, save and odds tests are exactly what step 5 shows still works. The two candidates if something has to go are `__searchQC` and `__questsQC` (slowest, zero catches). The automatic check runs them all for now.
