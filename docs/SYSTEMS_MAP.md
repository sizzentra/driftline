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

## The angler, part by part (0.4.8.1 round 2). Change one part: check every row it lists
Everything below is drawn by `drawAngler(c,x,y,s,lk,o)` (`d_draw.js`) -> `drawAngler3` (`g_angler.js`) -> `a3Body`.
**Every caller (test all of them after any change here):** the fishing scene (`d_draw.js` x2, `f2_areas.js`), resting / sitting on the dock or chair
(`r_rest.js` passes `o.sit`), the Wardrobe preview (`e_ui.js` drawLookPreview, animated every frame by `cb_wearfx06.js`), Wardrobe item tiles
(`w_wardrobe.js`, still, no `o.t`), shop try-on (`d6_preview.js`), Boardwalk (`q_boardwalk.js`), Tide Pass (`y_pass.js`), boards (`t_board.js`),
feats (`bq_feat04.js` x3), `d7_v20.js` x2, back-item previews (`l_wear.js`), and the PC Wardrobe layout (`pc/br_pc05.js` places the same canvas).
Poses to check: standing (`o` empty), `st:'charging'|'reeling'|'flying'` (only change the live scene angler), `sit:{seat:17,hang:false}` (chair),
`sit:{seat:.5,hang:true}` (dock edge). Builds: `BUILDI[lk.build]` (w, l, lw, belly). Bodies: `lk.g` = 'm' / 'f'.

| Part | Where | Coordinates and rules | Also affects |
|---|---|---|---|
| Torso outline | **`ak_side.js`** `sideTorsoPath` / `sideCoatPath` (they REPLACE `a3TorsoPath` / `a3CoatPath` from `g_angler.js`, which are only fallbacks); front edge at height y = `sideFront(y,f)` | torso-local, back about -7, front about 6.4 (+x), drawn under `scale(B.w*SIDE_K,1)` (`SIDE_K` .84) | every outfit is clipped to it; `a3Vol` shading; shirt patterns; the seat in `a3Body` (`bx0=-5.6*B.w`) matches its back edge |
| Outfit front details | **`ak_side.js` `SIDE_OUT`** (overrides `drawOutfit3` for all 26 outfits; the `g_angler.js` and `q_boardwalk.js` versions are unused fallbacks), helpers `buttons()`, `frontSeam()`, `pocket()`, `collar()`; fabrics in `ah_fabric.js` | buttons, zips, plackets, drawstrings sit on the FRONT edge (x ≈ 5.5..7.4 torso-local), V collars point to the front (x ≈ 4.6), pockets on the side (x ≈ -2.6..3.6), never the middle (that reads as a front view) | Wardrobe, scene, all callers |
| Leg-level outfit bands | wetsuit in `ak_side.js` | one band across both shins (legs overlap side-on); any new leg band must span x ≈ -4.4..4.8 torso-local | |
| Legs | `a3Body` `leg()` | hips at x 1.1*B.w (far, darker, drawn first) and -0.7*B.w (near); ankles `aF`=3.4+stance*.8 (far foot ahead), `aB`=-1.6-stance; sitting hips .9*B.w / -.7*B.w | shoes, seat, pajama stripes, `A3FXP.feet` |
| Seat | `a3Body` after the far leg | a smooth curve from the waistband into the back of the thigh, coloured `legC` (follows every outfit's leg colour) | outfits with dark/light legs (wetsuit, spacesuit, overalls, pajamas) |
| Shoes | `a3Shoe`, `a3ShoeBody`, `a3Sole`, `a3Foot` in `l_wear.js` | ground at y 0; heel at bx-3, toe at bx+toe; most shoes use `a3ShoeBody` + `a3Sole`, so changing those two changes almost every shoe; work boots = `default:` | shoe shop tiles, `SHOE_TOPY` (trouser cuff height in `g_angler.js`), `SHOE_TALL` |
| Back items | `a3Back` in `l_wear.js` | drawn under `scale(SIDE_K,1)` behind the body; `bx=-7.4*w` is the back | `A3FXP.back` |
| Hats | `drawHat` (`bg_angler036.js`, `bi_hats036.js`, `l_wear.js`) | origin = head centre (translate 0,-57.4); wizard tip (-4.6,-20) | `A3FXP.hat`, glasses FX |
| Living FX | `cb_wearfx06.js` `wearFxDraw` | reads `A3FXP.hat / torso / neck / back / feet` (filled in `a3Body`); drawn only when `o.t` is given | any new cosmetic: add its effect here, in the right anchor's coordinates |

## Frame-rate rules (director: "use more frames across all systems; push the limits without breaking")
- Shiny pictures: every display frame (`requestAnimationFrame` in `ca_shiny06.js`), only while a shiny picture is on screen.
- Wardrobe preview: every display frame while visible (`cb_wearfx06.js`). Measured 1.5 ms plain, 2.5 ms with six FX items (desktop).
- Phone aquarium tank: full rate (`mobile/perf_round6.js`), paused while the page scrolls (that pause is the lag fix).
- The water scene runs every frame already; phones pause it while a menu covers it.

## Phone look, round 7 (one theme). Change any phone surface: check every row
Theme decision (director 2026-11-18, mockup canvas https://claude.ai/artifact/V6sF2Xn4AE9gKYJSBHfYnF row 2, "Theme 1 calm navy"):
one navy surface, one thin light edge, corners 12 (chips/buttons) / 14 (cards) / 16 (frames), display face for labels/values/tabs/buttons,
reading face only for sentences, line icons (no emoji) on chrome, teal label = opens a page, filled teal = action, gold = here/chosen/ready.

| Piece | Defined in | Shows up in / notes |
|---|---|---|
| Phone theme (top bar, search/settings icons, Rest/bait, side panel, menu Back/tools, page tabs, section tabs, buttons, cards) | `mobile/theme07.js` (last phone look file; uses `html body.phone-app/phone-land` so it beats `mobile/ui_modern06.js`) | Android + iPhone, upright + sideways. Icons are CSS masks keyed by `data-sub` (add a new page tab: add its icon to `IC`) |
| Side panel width (sideways) | `mobile/theme07.js` (`.cdb` / `.secb` / `.mo-back` / `.cdmini` all 112 px; mini 40 px) | the water's grid column and the menu's side column follow it; change all four together |
| Page tabs fit (upright) | `mobile/theme07.js` (`.subbar` grid) | max 5 pages per group; a 6th page needs a check at 375 px |
| Goal / live-event line fit | `mobile/theme07.js` (fitGoal) and water name fit in `mobile/ui_modern06.js` | narrow phones (667x375, 375x667) |
| Aquarium (pinned tank, earnings strip, Add fish tab) | `mobile/aquarium07.js` (wraps `renderPanel`, moves `.tank`, `.bank`, `.sect-nav` into `.aq07-pin`, rest into `.aq07-side`; sideways the tabs move to the top of `.aq07-side` and the tank height is capped; turning the phone re-renders; Decorate: tap a card to try (`aqpv`) or place, the `.pvbar` try-on bar moves under the tank, a tried decoration gets the widest free spot in `S.aq.pos`, `#tankcv.scrollIntoView` is a no-op there) | phones only; `x_sections.js` keeps working because elements are moved, not copied; leaving Add fish re-renders. Old `mobile/ui_aquarium_land.js` rules no longer match (`#panel:has(> .tank)`) |
| Top-bar taps on finger lift | `bm_ui04.js` NAV list (menu buttons + `.hud` chips) | iPhone missed clicks; PC (mouse) untouched |
| Menu note position (iPhone sideways) | `ios/ui_homescreen.js` (`#toast` at the bottom like Android, top auto) | with both top and bottom set it stretched over the whole menu ("Bought…", "Claimed…" messages) |
