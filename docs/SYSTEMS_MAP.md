# Driftline systems map: what affects what

Read this before changing a shared system. Every row lists **where the system is drawn or used**, so a change can be
checked in every place it shows up. Keep it current: when a round adds a file or a new caller, add it here.

Builds: `build.ps1` joins the shared core (`src/*.js`, in the order of `$core`) with one platform layer
(`src/pc`, `src/mobile` = Android + iPhone, `src/android`, `src/ios`). Later files wrap earlier functions
(`const _x=x; x=function(){...}`), so **the last wrapper wins**. To find every wrapper of a function: `grep -n "fn *=" src -r`.

## Fish pictures and shiny effects
| Piece | Defined in | Shows up in |
|---|---|---|
| `fishCanvas(cnv,sp,known,shiny,pv)` (still fish picture) | `d_draw.js`, wrapped by `ca_shiny06.js` (sparkle FX) | catch card (`c_logic.js` showCard), Cooler / Aquarium lists, Fish Log cards + detail, Trophy Room plaques (all via `paintFish`), prism sheet (`n_play.js`) |
| `paintFish(P)` (draws every `canvas[data-fish]` in a page) | `e_ui.js`, kept-copy cache in `bm_ui04.js`, wrapped by `ca_shiny06.js` | every menu page with fish pictures; PC extras in `pc/ui_fhd.js`, `pc/ui_round5.js` |
| `data-sh` / `data-pv` on list canvases | `e_ui.js` (cooler line 96, tank 137, journal), `ax_trophy035.js` | must carry both or prismatic colours are lost |
| `drawCreature` / `drawCreature3` (fish body) | `d_draw.js`, `i_fish.js`; shiny glint + in-water sparkles in `al_decor04.js` | water (hooked fish, jumps), aquarium tank, pictures; Starfall reflections (`at_starfall033.js`) |
| `prismOverlay(c,w,h,v,t)` | `n_play.js` | prismatic pictures (`fishCanvas` shiny===2) |
| `sparkles()` (old static stars) | `d_draw.js` | disabled inside `fishCanvas` by `ca_shiny06.js`; still used by decor/other art |
| `SHINY3.still` | set by `ca_shiny06.js` | stops the in-water glint/stars freezing into still pictures |

## Angler, wardrobe, pets
| Piece | Defined in | Shows up in |
|---|---|---|
| `drawAngler` -> `drawAngler3` (legs, shoes, outfit) | `d_draw.js`, `g_angler.js`, wear in `l_wear.js` | fishing scene (every water), Wardrobe preview (`w_wardrobe.js`, PC `pc/br_pc05.js`), Boardwalk (`q_boardwalk.js`), Tide Pass (`y_pass.js`), feats (`bq_feat04.js`), boards (`t_board.js`), previews (`d6_preview.js`) |
| `drawPet` | `d_draw.js`, `d2_extra.js`, `d3_update.js` | scene, Pets page, Wardrobe stand, previews |

## Homes and docks
| Piece | Defined in | Shows up in |
|---|---|---|
| `HOME_FEATURES`, `homeLight`, `homeHull` | `bu_home05.js` | lamp/glow drawing in `f_v3scene.js`, `f2_areas.js`, `ar_ember033.js`; pages: PC `pc/br_pc05.js` + `pc/ui_round5.js`, phones `mobile/home06.js` |
| `dockThumb`, `drawDecor`, `paintDecor` | `ac_dockart.js`, `ab_decor.js`, `be_decor036.js`, cache in `bm_ui04.js` | Your home page, Tide Pass rewards, boards, previews, aquarium decor (`d2_extra.js`, `f2_areas.js`) |
| Aquarium sizes `tankK`, fish size | `aw_menu035.js`, `d_draw.js` drawTank | Aquarium tank (all platforms); phones throttle it in `mobile/perf_round6.js` |

## Scenes (waters)
| Piece | Defined in | Notes |
|---|---|---|
| `V3SCENES.<water>.land/live/fore` | `f2_areas.js` (+ `f_v3scene.js`) | `land` is cached (rebuilt only when light changes, PC `pc/scene_light.js`); `live` runs every frame |
| per-water extras `m33wrap(id,'land'/'live'/'fore')` | `ao_maps033.js`, `aq_life033.js`, `at_starfall033.js`, `ar_ember033.js` | animals, otters, leaves, dolphins... |
| Stonebrook village / jetty / wheel / river | `cc_river06.js` | sizes via `rvH()` = min(H, W*.8) so tall phones keep proportions |
| Shared scale rule | any `H*` size in a scene | phones are tall (H >> W): size buildings by `min(H, W*k)`, not `H` |

## Menus
| Piece | Defined in | Notes |
|---|---|---|
| `renderPanel()` | `e_ui.js`, wrapped by ~25 files | add page tweaks as wrappers; check the page on every platform |
| sections (`bwx-nav sect-nav`) | `x_sections.js` | hides by inline `display`; anything you insert must follow its section (see `mobile/home06.js`) |
| scroll-edge arrows | `bx_qol06.js` | selector list `SEL` |
| PC look | `pc/ui_fhd.js`, `pc/ui_header*.js`, `pc/br_pc05.js`, `pc/ui_round5.js`, `pc/ui_round6.js` | `body.pch-on` / `pc-fhd` |
| Phone look | `mobile/ay_phone035.js`, `mobile/ui_*.js`, `mobile/ui_modern06.js` | `body.phone-app` (upright) / `phone-land` (sideways); teal = tap, gold = open/chosen |
| Bait | data `b_data.js`, prices + order `bw_bait06.js`; pages PC `pc/br_pc05.js`, phones tackle view + headings `mobile/ui_modern06.js` | |
| Rod presets | `bz_rods06.js`; PC placement `pc/ui_round6.js`, phones `mobile/perf_round6.js` | |

## Tests
`bn_qa04.js` (preview only): `__qa()`, `__layoutQC()`, `__drawCost(n)`, `__frameProf`, `__go(loc)`, `__setPhase(p)`, `__open(tab)`, `__tabs()`,
`__spk()`, `__aqfill()`, `__reviewSave()`, `__landReview({sh,pv,hy})`, `__lookDiff()`. Clear the local test save from a non-game page
(the game saves on unload).

## Added in 0.4.8.1
| Piece | Defined in | Shows up in |
|---|---|---|
| `shinyFxDraw(c,t,o)`, `sfxFlare`, `SFX_PAL` (shiny FX library) | `ca_shiny06.js` | still pictures (via fishCanvas/paintFish), fish in the water and tank (`shinyFxWater`, called from `al_decor04.js`), Starry cape twinkles (`l_wear.js`), cosmetics FX (`cb_wearfx06.js`) |
| `A3FXP` anchors (hat / torso / neck transforms) | filled in `g_angler.js` (a3Body) | read by `wearFxDraw` in `cb_wearfx06.js`, called at the end of `drawAngler3` when `o.t` is given (animated) |
| Legs, seat, stance | `g_angler.js` a3Body | every angler drawing (scene, Wardrobe, Boardwalk, Tide Pass, boards, previews) |
| Back items (wings, jetpack, capes, lantern, flag) | `l_wear.js` a3Back | same as the angler |
| Saltmarsh seal | `ao_maps033.js` | Saltmarsh Coast only |
| Phone Aquarium header, Cooler guide | `mobile/pages06.js` | Android + iPhone |
| Phone side panel (sideways) | `mobile/ui_modern06.js` (`#catdock`, `#menuov .secbar`) | Android + iPhone held sideways |
