---
name: new-water
description: Driftline - adding a new water (map) or reworking an existing one. Covers where the idea must come from, the art direction in force, every place a water has to be added, and the map checks. Use before any work on a water's scene, fish list or home.
---
# Driftline: a new or reworked water

## Before drawing anything (decisions in force)
- **The idea comes from the team** (director, 2026-11-25): ask the director for the idea and its details first; do not fill gaps with realism or outside references. One picture or sketch page approved before a water is built.
- **Maps are about character, not realism** (director, 2026-11-25): each water is judged first on personality, purpose and cozy-fishing feel, in the game's one shared drawn style. Style references: Starfall Lake and the Canadian Rockies. The Rockies is a quality reference, never a template: every water has its own layout, building shape and surroundings.
- **Painted maps are scrapped** (director, 2026-11-25): drawn scenes in the game's own style only. `docs/MAP_STANDARD.md`'s painted-map standard, the ChatGPT guide and `docs/HOME_STANDARD.md` are history.
- **Homes are fixed:** one building per water with its platform and seat (`hfMake` look in `src/cw_homes.js`, or a `HOMEF.<id>={fixed:true,...}` that draws itself); no customisation.
- **One water = one batch**, thoroughly, published on its own; findings in `docs/reviews/<water>.md`.
- **A 2D side-view game:** everything drawn as seen from the side. Art direction "Glow Diorama". Nothing floats or looks pasted on.
- No new content until past 0.5, and nothing new during the Foundation (CLAUDE.md "Where we left off").

## Every place a water lives
- **New water:** LOCS data, Waters cards, Quests journey, lesson numbers, Home scene thumbnails, scene drawers, weather (a `WX_RAINLOOK` line if rain makes no sense there), events, and its `MAP_STD` line for `__mapQC` (moving things, life at night, the moment's timing).
- Its scene file `src/w_<id>.js` (`V3SCENES.<id>`, every piece in drawing order), colours in `V3PAL` / `WA_PAL`, its theme entry in `docs/MAP_THEMES.md`, its `MAP_STD` line in `src/bn_qa04.js`.

## Checks, by Claude, with pictures first
- `__shot(name, water, rest)` and `__homeSheet` on a `?test` page: dawn, day, dusk, night and weather, phone and PC, resting and fishing; `__timeSheet` for moving life. Look at them before the director does (standing rule 8b), then a picture page for the director.
- `tools/sweep_all.ps1 -Only gate,maps` (frame cost under the ceiling, the moment visible, no errors at any time or weather); frame-rate problems are measured on real frames with the pane visible.
- `tools/baseline.ps1 -Check`: only that water's scenes may differ; then `-Make`.
- Fish art: `__fishParts()`, `__fishSheet({loc})`.
