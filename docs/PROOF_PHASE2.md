# Phase 2 proof: one planted bug of each kind, caught by the right layer (2026-11-19)

Each bug was put into the source, built, run through the layer meant to catch it, then removed (`git checkout` of that file; `grep -rn PLANTED src` is empty afterwards). The final check ran on the clean build.

| Planted bug | Where | Layer that caught it | What it printed |
|---|---|---|---|
| **Broken coin rule:** gear could be bought one coin short | `e_ui.js` buygear: `S.money<c` became `S.money<c-1` | Automatic check, logic tests (`check.ps1 -Only iphone`, build 2247) | `FAIL logic tests: Economy: buy gear: refused one coin short ... :: bought while short` |
| **Cut label on a phone:** the Aquarium chip squeezed to 40 px | a style line in `src/mobile/polish08.js` | Automatic check at the iPhone 16 Pro Max size, three ways (build 2251) | `FAIL logic tests: top bar ... :: .hud > .st-aq text cut`; `FAIL layout on every page: 20 problems (cut "Aquarium" on every page)`; the phone frame check flags `label cut "AQUARIUM 0/h": 55 px of text in 38` |
| **Dead function:** a function nothing calls | `function oldBaitButtonBuild()` added to `d3_update.js` | Code rules: `build.ps1` refused to build (no pages written, stamp unchanged); the same rule in `check.ps1` flags it on a hand-edited page | `GROUND RULE BROKEN: dead function (declared, never called in any build): oldBaitButtonBuild` |
| **Slow screen:** 45 ms of extra work every Aquarium frame | `drawTank` in `cs_tank.js` | Device report (layer 2; `tools/check/devreport_proof.ps1`, build 2255) | `Page: Aquarium: 21 fps / 83 ms / 34 stutters` while `Fishing: 59 fps`; clean build: `Aquarium: 60 fps / 33 ms / 0` |

Also proven:
- **The new pearl test (rule 5):** with the fix taken out again (`fresh()` without `pearlV`), two tests failed: `[20] voyages :: a new save lost pearls on its first reload (3 of 7)` and `start-up pass :: full chain pearlOld 4`.
- **Errors with their screen:** an error raised inside the game while on the Aquarium shows as `[Page: Aquarium] Uncaught Error: planted error for the proof`.
- **The publish gate:** with the last full report for an older build, both `publish_testapps.ps1` and `publish_preview.ps1` stopped with `REFUSED: the last check was for build 2026.11.19-2239, this is 2026.11.19-2257` and made no commit.
- **Pages changed after a passing check:** one space added to `testapps/iphone/index.html` after the 2257 check passed: `REFUSED: the pages changed after the check of 2026.11.19-2257 passed`. With the file put back, the gate accepts it.

## A lesson from the proof itself
The first cut-label plant (`max-width:46px` on `.hud > .st-aq`) changed nothing: an older, more specific rule kept the chip at 67 px, so every check rightly passed. **A planted bug only counts once it is confirmed to be there** (measure it first), the same rule as for fixes (LESSONS, 0.4.8.9.4).

## What a slow screen does to the automatic check
Nothing, by design: the check times how long each page takes to open (limit 300 ms on this PC), not how smooth it runs. Per-frame cost only shows up in real frames, which is the device report's job (rule 8).
