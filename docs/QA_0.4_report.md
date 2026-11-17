# Driftline 0.4 "Fifty Fathoms": release QA report

Date: 2026-11-17. Build tested: preview 2026.11.17-0549 (local, not published), plus a release build opened from a temp folder.
Environment: Chromium (Claude desktop app browser pane) on Windows, viewport emulation. Re-run everything with `?test` and `await __qa()` in the console.

## How it was tested
- **Automated suite** `src/bn_qa04.js` (test builds only; `build.ps1` strips it from the release build). `window.__qa()` runs 45 checks on the real game code in the real page. Every check snapshots the save and restores it, and saving is switched off while it runs.
- **Random-action test:** 3,000 random clicks per run through the game's real click handler, including bad ids, bad indexes, stale buttons, 15% of them with a line out. All save rules are checked every 50 actions. Run 9 times, about 27,000 actions in total.
- **End-to-end fishing:** an automatic angler using real Space key presses, at all 10 waters by day and by night. Result: 40 catches, 0 lost, 0 errors, and opening a menu mid-fight 4 times. Touch was tested separately with pointer events: hold, release, tap on a bite.
- **Layout:** `__layoutQC()` combines `__audit` (off-screen and clipped), `__trunc` (cut-off labels), a dashboard check and a menu header check in every category. Run at 12 sizes.
- **Saves:** reload right after a purchase or a collect, reload mid-fight, 30 hours offline, a corrupted save file, broken and wrong-typed fields, a 0.3.5-era save, a 2.x-era minimal save, and save codes.
- **Performance:** draw cost per water, page open times on a mid-game and an endgame save, a memory and page-size check over 400 menu opens, a 40-second idle check, and 150 water changes.

## Results by system
| System | Result | Evidence |
|---|---|---|
| Species data (520 species, 50 + 2 meme fish per water, day and night fish everywhere) | PASS | Data checks |
| Catch odds (380 water × bait × day/night combinations sum to 1; no wrong-water or wrong-time fish) | PASS | Odds checks |
| Shown odds match real catches (40,000 real rolls, within 5 standard deviations) | PASS | Odds checks |
| Hunts (exactly ×2 relative odds; found fish refused; locked water refused; limit 3; 25 rapid toggles) | PASS | Odds checks |
| Fights (geared: rare 100% in 12 s, legendary 100% in 19 s) | PASS | Fight simulator |
| Real fishing, all 10 waters, day and night, keyboard and touch | PASS | End-to-end, 40/40 catches |
| Prices (1,560 fish: price = value × sale bonus × daily demand; shiny ×3.98 ≈ ×4) | PASS | Economy checks |
| Purchases (gear, bait, unlocks: refused when 1 coin short, exact deduction, refused at max) | PASS | Economy checks |
| Bounties (unfinished refused, paid once, repeated clicks pay nothing) | PASS | Economy checks + dashboard |
| Aquarium (collect pays once; 1 h = 60 min of income; 30 h away = 8 h cap, ratio 1.0002) | PASS | Economy checks + reload test |
| Cooler (sell all keeps protected fish and pays the shown total; bad indexes refused) | PASS | Economy checks |
| Skills (no points, no rank; reset needs its price) | PASS | Economy checks |
| XP / levels (1e9 XP gives level 63 with XP below the next level) | PASS | Economy checks |
| Feats, Tide Pass (pay once; a second claim gives nothing) | PASS | Economy checks |
| Events calendar (every minute of a day consistent) | PASS | Events checks |
| Challenges (one at a time, reward once, the rest period blocks a restart) | PASS | Events checks |
| Market Rush (exactly +30%: ×1.300) | PASS | Events checks |
| Saving and loading (round trip, save codes, reloads at critical moments) | PASS | Saves checks + reload tests |
| Old saves (0.3.5-era, 2.x-era) | PASS | Saves checks |
| Damaged saves (wrong types, missing fields, broken JSON) | PASS (after fixes) | Saves checks + corrupted-file test |
| Per-water docks (independent, persist, copy) | PASS | Saves checks + manual |
| Every page renders (fresh, mid-game and everything-unlocked saves) | PASS | UI checks, 20 pages |
| Every real button passes the input gate (295 buttons) | PASS | UI checks |
| Dashboard (all card states, live updates, actions) | PASS | UI checks + manual |
| Menus (open and close, Esc, phone back gesture, the line waits, Space blocked) | PASS | UI checks + keyboard tests |
| Keyboard (1–5, [ ], Esc, /, ?, M, Space) | PASS | Keyboard tests |
| Touch (hold to cast, tap to hook, tap categories) | PASS | Touch test, 375×812 |
| Layout at 2560×1440, 1920×1080, 1366×768, 1280×800, 1024×768, 900×700, 768×1024, 1024×1366, 393×760 (iOS), 375×812, 360×720, 844×390, 667×375 | PASS (after 1 fix) | `__layoutQC()` clean at every size |
| Adversarial (about 27,000 random actions) | PASS (after fixes) | Random-action test |
| Release build (no test suite, no preview flag, no gift codes, 17 pages, 0 errors) | PASS | Release check |
| Console (0 errors and 0 warnings during the final full run) | PASS | Console markers |

Not tested (no way to run them here): real iPhone/Android hardware, Firefox and desktop Safari, real screen readers, a real phone's back gesture (simulated with `history.back()`), cloud saves (only active inside the claude.ai runtime), and the Windows desktop app wrapper.

## Defects found and fixed
| # | Severity | Defect | Fix | Verified |
|---|---|---|---|---|
| 1 | High (save integrity) | A save with a wrong-typed field (for example the cooler not being a list) made loading throw. The game then started fresh and **the next autosave overwrote the real save**. | `saveClean` in `migrate` (c_logic.js): wrong types fall back to defaults, numbers stay finite and ≥ 0, lists keep only valid entries. A save that can't be parsed is kept as `driftline-save-next-unreadable`, and the player sees a notice. | Broken-save checks; corrupted-file reload test |
| 2 | Medium | A damaged save could hold more skill ranks than points (a negative point count), negative tickets or a fractional level. | Ranks are refunded when over the points; numbers are clamped; level is floored to a whole number ≥ 1. | Broken-save checks |
| 3 | Medium | Unknown rod ids in a save were kept. | Dropped once the rod list exists (`rodsClean`). | Broken-save checks |
| 4 | Medium (exploit/crash) | A crate with an unknown kind set coins and tickets to NaN. | Only small, big and legend are accepted. | Random-action test |
| 5 | Medium (exploit) | Coin-flip bets accepted any fraction, giving NaN coins or a bet bigger than your coins. | Only the offered 10%, 25% and 50% are accepted. | Random-action test |
| 6 | Medium (crash) | Travel accepted an unknown water and set it as your location (which would break the game). Unlock, buy gear, rod upgrade, attachments, offers and previews threw errors on stale or bad buttons. | One input gate (`src/bo_guard04.js`) in front of every page action. | 295 real buttons pass; random actions give 0 errors |
| 7 | Low | "Buy" for the free bait (Worms) could make its count NaN. | Free or packless bait can't be bought. | Random-action test |
| 8 | Medium (performance) | The Brine Shelf and Hollow Trench Waters pictures threw on small screens, and Brine Shelf retried every 60 ms in the background. | Negative ellipse sizes clamped; a picture that fails twice is not retried. | All 10 pictures draw at 360 px wide |
| 9 | Low (layout) | The water name was cut off in the top bar on small phones held sideways (667×375), and on 768 px tablets. | The top bar chips share width by what they hold. | `__layoutQC` clean; all 10 names fit |
| 10 | Low (performance) | The first Dock open took 95–121 ms because it measured every decoration on the spot. | Measured in idle time after load. | First open 43 ms (warm 19 ms) |
| 11 | Low | Save codes and cloud copies could carry a slightly stale copy of the current water's dock (harmless on load, but untidy). | The dock is stored before every save code and cloud push. | Save-code check |
| 12 | Cosmetic | The Equipment card skipped cast and hook rod stats. | Shown through the rod stat text. | Manual |
| 13 | Cosmetic (console) | A vibration attempt before the first real tap logged a Chrome message. | Vibration waits for the first real tap. | Release console clean |
| 14 | Low (console) | Canvas readback hints logged by Chrome. | `willReadFrequently` on the two heavy measuring canvases. Remaining hints appear only at load, from one-time measurements. They are not errors. | Console clean during the full run |

UI change requested during the audit: menus now fill the whole window like fishing mode (the 1,280 px cap was removed).

## Performance (Chromium, Windows desktop; targets in brackets)
| Measure | Result |
|---|---|
| Draw cost per frame, 1920×1080, each water [≤ 8 ms, so 120 Hz has headroom] | 2.2–3.1 ms (Starfall highest) |
| First frame after changing water, 150 changes [≤ 16 ms] | p50 2.8 ms, p95 4.0 ms, max 4.9 ms |
| Page open, mid-game save [≤ 100 ms] | 2–37 ms (Dock first open 43 ms after fix) |
| Page open, endgame save (520 species, everything unlocked) [≤ 100 ms steady] | 23–45 ms steady; cold first open up to 164 ms (Fish Log) while caches fill |
| Menu open and close round trip [≤ 100 ms] | p50 18.5 ms, max 43.7 ms |
| Memory over 400 menu opens [no growth] | 18.2 → 18.5 MB; 432 → 432 page elements |
| Memory over 40 s idle in fishing mode [no growth] | 19.7–20.4 MB, oscillating |
| Memory over 150 water changes [no growth] | 20.6 → 21.0 MB |

Real frame pacing could not be measured: the browser pane was hidden, so the browser throttled frames to about 21 fps for every page. The script time per frame above is the reliable measure. Phones are slower than this PC; on the director's earlier phone tests the game ran smoothly, but no phone profile was taken in this audit.

## Save compatibility
- 0.3.5-era save (no hunts, no docks, old menu tab): loads into fishing mode, docks seeded, all rules hold.
- 2.x-era minimal save: loads with coins, level, cooler, bait and Fish Log intact.
- Wrong types, Infinity, NaN, negative values, missing objects: load safely with defaults.
- Broken JSON: kept aside, a new game starts, the player is told.
- Reload right after a purchase or a collect, and mid-fight: nothing lost, nothing duplicated.
- The director's preview save was backed up before testing and restored afterwards, verified identical (1,545,638 coins, level 23, streak 38).

## Remaining risks
- Not run on real devices or other browsers (see "Not tested").
- Reloading during a fight that is about to fail keeps your streak. That is normal for browser games and low impact, so it is left as is.
- Endgame first opens of the Fish Log and Pets can reach about 150 ms once while caches fill.

## Verdict
On everything that could be tested here, no known reproducible defects remain: 45/45 automated checks, about 27,000 random actions with no rule broken, 40/40 real catches, clean layouts at 12 sizes, and a clean release build and console. Release-ready **for the tested environment (Chromium on desktop, phone sizes emulated)**. A short real-phone check (one iPhone, one Android) is recommended before publishing, since real devices and other browsers were not available.
