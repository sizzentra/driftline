# Driftline: Project Brief

A cozy fishing game in the browser, made for the director and their friends. It installs as an app on phones and PCs, plays offline, and updates itself. It's a side project, separate from OutPace.

## ▶ Where we left off (read first)
- **0.3.6 "Fifty Fathoms" IN PROGRESS (2026-11-17, overnight, director asleep; preview only, never publish.ps1 without approval).** Done and committed so far:
  - Content: `src/az_fish036.js` (167 new species = 50 per water, + 20 meme fish; stats from each water/rarity median), `src/ba_art036.js` (per-fish art details), `src/bb_odd036.js` (oddities 80→100, lighting pass + solid silhouettes, cached sprites; disco/ring/goldtoilet drawn live).
  - Systems: `src/bc_voyage036.js` (Legacy +10%/voyage, pearl finder ×(1+.15v) up to ×3, milestones at 1/2/3/5/7/10 voyages, 4 new relics, aquarium → Trophy Room on setting sail, tiny hybrid boosts up to ×3), `src/bd_ui036.js` (page titles match menu, labels above controls, sell filter fields, 44px touch targets, menu search 🔍, rarity-escalating catch card with rays/sparks/fanfare/haptics, Fish Log Show: All/Missing/Catchable now + hints).
  - Art: fish volume shading + lateral line + sheen (i_fish.js), sharks too; NO floating parts (fins have membranes into the body, tail rays and gill line clipped, crowns/spikes/fur/feelers/leaves rooted; an automatic connected-pixel check over all 520 fish now only flags intentional props); `src/be_decor036.js` (decor contact shadows + cached lit sprites, measured in idle time); `src/bf_depth036.js` (out-of-focus foreground framing per water); Ember Springs on theme (no green); character: volume shading + contact shadow (g_angler.js).
  - Measured: every water 1.3–2.0 ms per frame (clear and storm).
  - Research used: NN/g hidden-vs-visible navigation (hidden ≈20% worse discoverability), Apple/Material 44pt/48dp targets and 3–5 nav items, Penzo label-above-field eye tracking.
- **Director, latest (2026-11-17): "I don't want subtle improvements, I want DRASTIC change and improvements. ALL THINGS."** Also: modernize the player model and all UI menus for realism; maps must feel far more 3D (foreground, background, layers) and less predictable; everything must fit each map's theme; no cartoonish look ("realistic, not cartoonish"); perfect drawing (no clipping, floating parts, order errors), no stutter, stress-tested; full PC + mobile QC (1280×800, 375×812, 844×390); balance everything; spoiler-free patch notes; email was asked for but no email tool exists: send a push notification + a patch-notes artifact when done.
- **Also done (2026-11-17, later):** parallax camera drift + baked land grain + vignette (bf_depth036.js, f_v3scene.js); angler head scale A3HEAD .9, soft blush, real cap (bg_angler036.js); **platform layer bh_platform036.js** (director wants dedicated iPhone / Android / PC versions: one game, `DL_PLAT` + `plat-ios/android/pc/app` classes; iOS: no text inflation, maximum-scale=1 against focus zoom, drawn picker arrow, full screen explains Add to Home Screen; phone-land: stacked tabs + icon settings since iPhone Pro Max is 932 wide with ~59px notch margins). **Never write a literal body tag in source: the local test server injects a script at the first one.**
- **0.3.6 READY ON PREVIEW (2026-11-17, preview 2026.11.17-0257): GAME_VERSION 0.3.6, patch notes written, release check passed (no DL_PREVIEW, no gift codes, zero errors on every page). NOT on the main site: publish.ps1 only after the director approves.** Also done since: hats rebuilt (bi_hats036.js: ~25 hats + shared crown/brim/band helpers, HAT036 table in bg_angler036.js), outfit details (OUT036 overlay, source-atop clipped), clothing weave + creases (a3Weave in g_angler.js), definition pass `defineSprite` (bevel+ao+grain) on decor/oddity sprites and the hat layer, pet bows/flowers on measured head tops (petTopK), Old Rod + Tackle Box drawings, outfit colours via a3OC. QC hooks (test mode): __fishParts, __lists, __audit (all pages, overflow/clipping), __decorReal, __petSheet({ids}). Director feedback this round: wants DRASTIC detail and definition on everything (decor, outfits, hats), dedicated iPhone/Android/PC behaviour (bh_platform036.js, ?test&ios forces iPhone mode). Possible next: more decor redraws, remaining plain hats, menus visual modernisation.
- **0.3.6 polish pass (2026-11-17, after the director asked for a professional-indie quality audit; audit report + director said "all of it" + "Events needs a major expansion").** Done, all on preview: rarity-shaped fights (c_logic.js FIGHT_WILL, surgeTick, fatigue after 12-14 s, heavy-fish warning; tuned with `__fightSim` to legendary 15-20 s / mythic 20-30 s, 90-100% wins when geared); rare odds compound (`rareMul`, `catchW`, `catchOdds` in c_logic.js; note au_fix034 soft cap r/(1+r/3) still applies); baits rebalanced (water bait x2 at its water, behaviour x1.9, Lava Worms 20k, Stardust 40k, Golden Chum 9k; each water bait wins at its water); odds lines on bait rows, rod rack, Lucky Charm; **bj_polish036.js**: pc-app one-screen PC layout + pc-wide side-by-side (>=980 px, aspect >=1.2), goal chip (`nextGoal`), slim HUD (time/weather on water chip with effect tag), save on hide/close, streak save; fmtShort T/Qa...; **bk_events036.js**: challenges (Rare Run, Mixed Bag, Steady Hands, Trophy Weigh-in) sized from catchOdds, 12-min rests, Shoal Run every 90 min for 8 min, live chip, Events dot. The equipped rod is `S.rods.eq` (not S.rod). Test hooks: __fightSim, __ev, catchOdds in __bal. Still not live: publish.ps1 only with approval.
- **Renamed to 0.4 "Fifty Fathoms" (director, 2026-11-17).** All 0.3.6 work ships as 0.4 (GAME_VERSION 0.4, patch notes v 0.4, badge "0.4 preview"). Added since: events system rewritten as general tables in bk_events036.js (6 challenges incl. Long Cast + Treasure Dive; SCHED calendar: Shoal Run 90/8, Golden Hour 120/6 off 50, Market Rush 75/6 off 25 = true +30% sales); PC collapse menu (sidetog + M, shared side-off setting); clarity (breadcrumb on every page, search opens on a page map PAGE_DESC, badge tooltips); QoL (keyboard shortcuts with ? sheet, bait Auto-restock S.settings.autoBait, cooler-full goal); accuracy (water thumbnails at fixed 2.6:1 via cv.height swap, Stats odds via catchOdds, honest odds wording). QC hooks: __audit, __trunc (truncated labels). Preview 2026.11.17-0413 published; NOT live.
- **0.3.4 "Sea Legs" shipped 2026-11-16** (director approved). Contents (Cam's list, Part 1): reel always reels while held (slowly during runs, tension rises), a run sound, rarity normalised per water + per-species rate (`rarBase`, `RAR_REF`) and late-game luck with diminishing returns (`RARE_SOFT=3`), fishmonger asks for local fish 80%, Sell all filters (rarity / price / both), Feed beside Collect, aquarium income on card, cooler row and tank button, twinkling shiny pictures, Bounties opens on the current water, Boardwalk winnings capped at 25% of Wisdom Pearl progress (`bwEarn`, `S.stats.runBw`), Brine Shelf (dolphins removed, flying fish, cargo ship + soft horn, buoy bell), Midnight Deep ghost ships, storm chop + squalls + bigger swell + rain sound, Trench eyes (1 to 4 pairs, sizes/colours), flowing lava + crater bombs, eased dusk/dawn (finer light steps, V3FADE 3.4 s). New files: `src/au_fix034.js` (must load right before `e_ui.js`, which closes the script), `src/av_sea034.js`.
- **0.3.5 "A Tidier Tackle Box" shipped 2026-11-17** (director approved): menu regroup built (`src/aw_menu035.js`: 5 sections + page pills inside `#tabs`, old tab buttons kept hidden so badges/links keep working; More = Settings/Stats/Save behind the gear button; phones upright dock the sections at the bottom; "Back to the water" / "Menus" jump button; compact catch card that floats over the whole phone screen), Trophy Room (`src/ax_trophy035.js`, placeholder name, `S.vault` up to 500 fish, not touched by the voyage reset, Keep on cooler/aquarium rows, To cooler), sideways toggle back to two steps (beside / full screen), Graphics: High only (Balanced removed), aquarium earnings as a 4th stat on the catch card.
- **0.3.5.1 "Made for Phones" shipped 2026-11-17** (director approved): phones held upright use a one-screen layout (`src/ay_phone035.js`, body.phone-app: water fixed, #panel scrolls inside, tip line on the water, slim top bar; c_logic resize() sizes the water for it), full-screen water toggle upright (reuses #sidetog and its saved setting; `stageHOverride`), Rest as a phone control, catch/event cards float over the whole phone screen, wide aquarium on phones (`tankK`), fish rows stack buttons in narrow menus (container query), lighter menus (no blur bar, no page fades on touch, no :has rules). Audited every page (inner tabs too) at 320x640, 375x812 and 812x375: nothing overflows.
- **Still open from the director:** Trophy Room name; whether the aquarium should empty on a new voyage (balance problem the director raised; not changed yet).
- **Next big content round (director 2026-11-17, not started):** (2) revamp and scale the new-voyage (Wisdom Pearl) buffs, "big"; (3)(4) more fish: 50 per area; (5) silly meme fish on top of that; (6) oddities up to 100; (7) hybrids smaller than the normal weight range get scaling buffs beyond normal percentages. ("Allow selling shinies" from the same list shipped in 0.3.4.2.)
- **Next round, waiting on the director's decisions** (asked 2026-11-16 during 0.3.4):
  - **Menu regroup:** 18 tabs into 5 sections in a row (Fishing: Cooler, Waters, Bounties, Events / Gear: Tackle, Rods, Skills, Paths / Collection: Aquarium, Trophy Room, Fish Log, Feats / Home: Dock, Pets, Wardrobe / Rewards: Tide Pass, Boardwalk), sub-tabs as pills, Settings/Stats/Save behind the gear icon, badges roll up. Mockup: https://claude.ai/artifact/SDwdHBavtNBDXo1nbdJ63Y. Director: "where it should be, rather than everything there"; top and bottom bars are fine. Director 2026-11-17: likes the grouping, but nothing may open over the game screen (v1 squeezed the scene to the side). v2: scene full size on top as today, a row of 5 section buttons right under it, then sub-tab pills and the page.
  - **Trophy room (name undecided):** new voyage currently keeps the aquarium (a balance problem). Plan: the aquarium empties on a new voyage; a trophy room keeps chosen fish forever with no income or buffs. Look: walnut panels, carved plaques under spotlights, brass nameplates, gold frames for legendaries. Open: spots per species?, last chance to move aquarium fish on retire?, free or a fee?
  - **Decoration overhaul** (director): "outdated"; much more realism and detail, correct placement and physics on every dock, every fishing spot and the aquarium.
  - **Hat polish** (director): more detail and polish on every hat.
- **Live version: 0.3.5.1 "Made for Phones"** (2026-11-17: one-screen phone layout; on top of 0.3.5 "A Tidier Tackle Box" with menu sections and the Trophy Room; 0.3.4.2, 0.3.4.1 and 0.3.4 "Sea Legs" shipped just before) (shipped 2026-11-16, director approved; 0.3.3.1, 0.3.3, 0.3.2, 0.3.1 and 0.3 shipped earlier the same day) at https://sizzentra.github.io/driftline/. Every release is committed on `main`; `gh-pages` holds the published `site/`.
- **Recent releases:**
  - **2.1 "More of Everything":** new content of every kind, two pets at once (★ favourite plus companion), and the tab grid.
  - **2.2 "Closer Together":** moving progress with a 6-digit code, gift codes, and Lily.
  - **2.2.1:** the 6-digit transfer now goes through a relay, so it works on every network.
  - **2.2.2:** a hide/show menus button for phones held sideways.
- **Waiting on the director:**
  - Confirm the 6-digit transfer works between their real phone and PC. It was only tested in two windows on one PC. The first, direct-connection version failed on their phone, which is why it now uses a relay.
  - Confirm Lily looks right to Cam. Lily is his exclusive pet, drawn from a photo of his dog (see "Exclusive gifts").
  - Confirm the sidebar button is the one they meant: landscape phones only. They may also want a toggle in portrait.
- **0.3.3.1 hair hotfix: SHIPPED 2026-11-16:** curly under hats uses `curlyLobes()` (only lobes below the brim, pulled in; `A3HATON` set around `drawHair3`); Coils removed from `HAIRSTYLES` (old `coils` saves draw and become Curly); spiky redrawn as swept tufts (`drawSpiky3`).
- **0.3.3 "Every Water Special": SHIPPED 2026-11-16** (director approved; publish.ps1, commit d67637b). Its patch-notes entry stays as shipped.
  - **`src/ao_maps033.js`:** each scene hook is wrapped with `m33wrap(id,hook,fn)`; it skips zero-size canvases, because some loops step by W/n.
    - **Coast:** headland and village with lit windows that fade, a sailboat, a seal on a rock, tide-pool rocks.
    - **Shelf:** island with a sea arch, a whale (rises, blows, shows its tail), kelp mats with a gull, a full-width swell.
    - **Deep:** a rock pillar with spray, a pitching ship, visible lightning bolts, whitecaps, swell.
    - **Frost:** camp with tents, a snowman and smooth tip-up flags; the ice platform gets layers, bubbles and a frozen fish.
    - **Ember:** lava islets with glowing cracks and steam, a vent, pumice that fades at the edges.
    - **River:** rowboat, otters, drifting leaves.
    - **Trench:** plankton that brightens near the float.
    - **Starfall:** crystal platform facets, veins, moss, and shards hung from the slab edge (`m33crystalEdge`).
    - **Shelf dolphins (`m33dolphins`):** a shadow under the water, a leap clipped at the waterline, splashes and rings.
  - **`src/ap_weather033.js`:** weather on three layers, all ×`WXA`: sky (`wx3Sky`: rainbow, aurora curtains with one gradient per ribbon, blood moon, Gilded rays, storm scud), water (`wx3Water`: rain rings faded in one by one, whitecaps, reflections, fog wisps, spawning rings), and top (`drawWeatherX0`: fog banks, generic lightning bolt, red vignette).
  - **Hair:** `curly` = `drawCurly3`, the tousled design from the director's right-hand reference; new `coils` = `drawCoils3`, round coils from the left-hand reference. Both use `curlMass` and redraw the ear (`A3SKIN`).
  - **Graphics setting** (`S.settings.gfx`, an_small04): auto = High on non-touch devices; High = full-DPR scenery and denser weather and life (`gfxHigh`, `gfxK`).
  - **Later in this round:** lighthouse uses a soft glow instead of a beam; Saltmarsh village grounded on the headland (`m33groundY`, `m33village`, fields, quay, cliff surf); Starfall waterfalls drawn in `live` and pouring into the lake (`m33fall`, `M33.falls`); curly hair covers the ear (no `drawEar3` for curly; Coils keeps it); aquarium canvas `clamp(300px,52vh,560px)` (phone 260–380), fish size scales with tank height, `tankMove` swim styles (glide, dart, bottom, hover, wave, eight).
  - **More life (`aq_life033.js`):** wind gusts on calm waters (`l3gust`), run wake (`l3wake`), pond frog/deer/leaves/seeds, reef surf/gannet/ray/bait ball, trench mist/glowing crests/wreck lantern/deep shadow, frost spindrift/seal, river foam, coast sandpipers, deep spray, starfall motes; Ember sky clouds off (`SC.noClouds`) with ash plumes, volcano strata/gullies/parasitic cone/lava field and moving lava pulses; salamander removed (it looked like a hopping airship). **Ember rebuilt (`ar_ember033.js`):** `v3stonePlat2` rock shelf, modelled hillside (`embHillY`) with outcrops and a rim light, smooth headland with grass on the exact edge; no geyser, no pillars, no springs. `v3range` uses wide soft smoothing on every map. **Waters thumbnails are 1:1:** `v3Thumb` renders the real scene (v3Scene + platform + fore, clear, day) on the game canvas and copies it (`THUMB_CLEAR`).
  - **Heavy weather and depth (`as_depth033.js`):** Fog shows as "Heavy fog" (`wxName`), thick horizon wall plus near banks; storm and rain darken the scene; gloom Storm .7, Rain .38, Fog .3; per-water horizon haze, near out-of-focus motes and a bottom vignette. The frost fox now crosses the whole shelf (it used to vanish mid-ice).
  - **Starfall finale (`at_starfall033.js`):** nebulas, a star whale (swims head-first, glowing), a comet, lanterns, star-blossoms; `sfEvent(t)` mystical moments every 18–40 s (meteor shower, crystal resonance, a luminous fish leap using a real Starfall species, sky veil, firefly swarm), test with `__sfDraw(kind,frac)`; the fish constellation is static and breathing (`starSignature`, no drawing); `sfPlanet` (cloud bands, storm, ring bands and shadow, two moons); island ponds overflow into the falls.
  - **Coral Shallows:** beach edge kept left of the shortest cast; real swash with wet sand and a soft foam lip; the caustic grid fades in toward the horizon.
  - **Waters thumbnails** render in the background on idle after load (`thumbNext`), never on tab open (that was a 195 ms freeze); a calm moment is chosen for Starfall.
  - **Stutter QC:** frame median about 1.5–1.7 ms at 1280x800. The occasional 30–50 ms frames in back-to-back test loops also happen with all new effects off and on the live build, so they come from the test harness. The test page caps rAF at about 21 fps, so real smoothness must be checked in a real browser.
  - **Other:** tank fish have a minimum size of 14; `__findWx(k,ph0,ph1)` test hook; `tools/grid.ps1`.
  - **QC:** every water and weather at PC, portrait and landscape, zero errors; steady-state draw cost 1.4–2.3 ms per weather.
- **0.3.2 "Prized Catches": SHIPPED 2026-11-16** (director approved; publish.ps1, commit 82b5a4c). Its patch-notes entry stays as shipped. Play notes from a friend plus director requests:
  - **Aquarium weight:** income cap ×`aqWeightK` (0.75 to 1.7 by weight within the species); buffs get a weight factor (`aqBuffsOf` wrap in n_play); tank size by real kg (log scale, d_draw `drawTank`).
  - **Fights:** a running fish takes line when you're not reeling, at `max(base, reel*(.24+.11*rarity))*stamina`; reeling during a run gains no line and adds 95 tension instead of 70. Bot fights: pond 6–10 s, ember legendary 18 s, all landed.
  - **Shiny frenzy fish:** 11%, worth 5 fish, `pat` skip/zig/high; `__frenzy()` test hook.
  - **Bug fixes:** predator-grab shadow cleared when a fight ends (`drawEat`); the mouse wheel doesn't scroll the page for 1.6 s after reeling (`_reelT`).
  - **Visibility:** clearer cast marker and outlined float.
  - **Art:** heron legs and ripple; pineapple house redrawn; Snoozy Rock and Grumpy Tiki House added.
  - **Angler:** body narrowed `SIDE_K` .84 with an `a3Deltoid` shoulder cap and shoulders at y -45.4; curly hair `drawCurls3` (full mass starting at the face); hot dog suit side-on.
  - **Pets:** drawn after the angler (scene and Home).
  - **Badges:** feats badge plus New marks (`S.featSeen`); Skills section badges (`sdot`).
  - **Full screen:** remembered via localStorage `dl-fs`, re-entered on the first tap.
  - **Crate counter:** `.badge` no longer wraps.
- **0.3.1 "Dressed for the Weather": SHIPPED 2026-11-16** (director: "this is 3.1", so it is 0.3.1, not 0.4; publish.ps1, commit d4afb7d). Its patch-notes entry stays as shipped. The director's list after 0.3:
  - **Side-view clothing** (`src/ak_side.js`): side-profile torso and coat paths (`sideTorsoPath` / `sideCoatPath`); `sideFront(y,f)` places front-edge details; all 27 outfits in `SIDE_OUT`; neckwear in `SIDE_NECK` hangs at the chest front; `a3OverArm` draws straps and epaulettes after the front arm; the belt buckle sits at the front.
  - **Body and face:** rounded builds (belly `A3BELLY*2.0`); beards drawn after the front arm (except inside full helmets); curly fringe kept off the face; long hair reshaped; brows drawn over the fringe; face options `NOSES` / `BROWS` / `MOUTHS` / `BLUSHES` (in b2_wear, validated in migrate).
  - **Shoes:** centred and scaled on the ankle (`A3LW`); trousers tucked into `SHOE_TALL`; hem at `SHOE_TOPY`; shoe colour `lk.shoeCol` (recolours `SHOE_MAIN`).
  - **Hats and capes:** bucket hat and sport visor redrawn; `hatPreview` shows the real angler head (cached); capes move with the wind and weather (`capeWind`).
  - **Scene:** the palette uses fine colours plus coarse `P.key` levels, and each new level crossfades over 2.4 s (`v3landDraw`, `V3PREV`); the scenery cache is capped at 2x DPR; weather fades in and out via `wxAmt()` / `WXA` (32 s ramps; lightning only above 0.6); soft lantern pools (`v3lightPool`) and reflections (`v3lanternReflect`); the far half of the post ripples is hidden.
  - **`src/al_decor04.js`:** decoration kinds in `DECOR_KIND`: income; boost (fish buffs ×1.25); show (shiny and hybrid income ×3). Also 5 new tank pieces, 5 new dock pieces, and shiny fish with a glint, glow and sparkles.
  - **`src/am_shoptools.js`:** sort and filter bar for aquarium and Home decor (choice saved in localStorage `dl-shoptools`).
  - **`src/an_small04.js`:** time played (`S.stats.playS`); thin scrollbars that fade out.
  - **Small fixes:** the Rest button no longer overlaps the boost chips; the lo-fi crackle only plays at the loop point and once halfway.
  - **Not reproduced:** "pets behind dock objects". Pets are already drawn after every dock item, so ask the director for the exact case.
  - **QC:** PC 76 views, phone portrait and landscape 48 views, zero errors; with the same save, draw cost is within about 0.3 ms of 0.3.
  - **Patch notes:** the 0.3.1 entry is at the top of d3_update; GAME_VERSION is 0.3.1.
  - **New test hooks:** `__lookSheet(looks,{k,up,ax,o})`, `__landCost`, `__v3st`, `__prof`, `__landSplit`, `__fishSheet({shiny})`, and `tools/crop.ps1` (enlarges a sheet region).
- **0.3 overhaul: SHIPPED to the main game 2026-11-16** (publish.ps1, commit d480a89). Any new work is a new version with its own patch-notes entry; the 0.3 entry stays as shipped. History of the rounds:
  - Preview: https://sizzentra.github.io/driftline/next/ (its own save; it copies the real save once; badge "0.3 preview").
  - Build: `build.ps1 -Preview`. Publish: `publish_preview.ps1` (never rebuilds friends' game).
  - New renderer: `src/f_v3scene.js` (B2 style; on only when `DL_PREVIEW` is set or the URL has `?v3`). It hooks into `draw()` in `d_draw.js` via `v3Scene` / `v3Platform` / `v3Fore`.
  - **Done:** Willow Pond environment (mountain ranges with shaded faces and snow, pine shores, log cabin with lit window + smoke, weeping willow, reflections, sun/moon glitter, mist, ducks, fish rings, lily pads with a glowing bloom, fireflies/dragonflies, cattails, rebuilt dock + lantern), day/dusk/night palettes, static layers cached (worst light-change frame <4 ms on PC).
  - **Done:** Lily attachment system (`d10_lily.js`). Each pose sets `LILY.head` / `LILY.neck` frames (position, tilt, size, flip); every hat and accessory is drawn in that frame. Hats use the player's hat units: origin = head centre, head radius 7.5. The cape is drawn behind her body per pose; the balloon is tied to her collar. Verified with contact sheets: every pose × every accessory × all 60 hats.
  - **Decision:** the old pets' accessories are also misplaced (llama head off-frame, side-on glasses on front-facing pets, blade-like capes, strings across faces). They are NOT patched: every pet is redrawn for 0.3 on the same head/neck frame system and must pass `__petSheet` before shipping.
  - **QC tools (`?test`):**
    - `__lilySheet({poses,accs|hats:"all",from,to,save})` and `__petSheet({from,to,save})` render contact sheets.
    - `__snap(name,x,y,w,h,scale)` saves a canvas crop.
    - All of them save to `tools/shots/<name>.png` via the local server (POST /shot/<name>). Open them with the Read tool: browser-pane screenshots lag and aren't reliable.
  - **Done:** new angler `src/g_angler.js` (`drawAngler3`). It keeps the old anchors (head centre (0,-56), r 7.5) so hats, beards and glasses fit; the torso is a path (male and female); shirt patterns and all 17 outfits are clipped to the body; 9 hairstyles with back and front layers; ear, nose, jaw, blinking eyes, brows, moods (calm, surprised at a bite, focused while reeling, happy while landing); two arms (rod hand + reel hand); boots with soles and laces. Verified with `__anglerSheet({from,to,face,save})`: every outfit × 8 looks, plus face close-ups.
  - **Done:** pet spacing. The favourite stands clear of the angler; the companion goes further left, or on narrow phones sits layered just behind the favourite.
  - **Done:** fishing moments: the angler leans for charge, throw, fight and landing (hands stay on the rod); splash rings + droplets on landing, bite and fight; sparkles for rare catches (`v3Fx` / `v3FxTop`).
  - **Done:** ALL pets redrawn (`src/h_pets.js`).
    - Rigs: `rigQuad` (22 four-legged + 4 reptiles), `rigSit` (10 front-facing), `rigBird` (9), plus 16 one-of-a-kind pets (`PET3_CUSTOM`).
    - Moods: idle (breathe, blink, wag, ear twitch), watch while fishing, bite, petted, happy on a catch, sleep at night.
    - Frames: head/neck/back. `drawGear3` draws every accessory in those frames; per-pet glasses fit uses `gx`/`gy`/`gs`.
    - QC: `__pet3Sheet({ids,moods,cols,cell,save})`; every pet × mood × accessory checked.
    - Old drawings are used only if a pet has no PET3 entry (none left).
  - **ALL 10 AREAS DONE** (`src/f2_areas.js`; shared helpers v3tree / v3rock / v3hillBand / v3water / v3glitter / v3mist / v3fishRing / v3stack / v3palm / v3snowPine). Scene hooks: `land` (cached), `live`, `fore`, optional `sky(P,t,hz)` (before the land cache), `tilt(t)` (world rocks, boat areas), `overcast` (hides stars, dims sun/moon). Every area has its own platform in `V3PLAT` (dock, pier, ice, sand, boat, trawler, raft, stone, crystal). River: arch bridge, mill + waterwheel, rocks with foam pillows. Coast: lighthouse beam, dunes, swells, gulls, crab pier. Frost: aurora, ice hut, floes, owl, fox, snow. Reef: reef patches under water, caustic web, palms, stilt hut, turtle, parrots. Shelf: swell + tilt, tall ship, bell buoy, dolphins, albatross. Deep: storm bands, lightning flash, rain sheets, whale tail, trawler floodlights. Trench: sea stacks, wreck mast, jellyfish, plankton, eyes in the deep, raft. Ember: volcano, travertine terraces, basalt, steam, embers, salamander, moths. Starfall: cached Milky Way + reflection, ringed planet, floating islands, fish constellation, shooting stars. Checked day/dusk/night, PC + phone, weather overlays (`__setWeather(kind)`), draw cost under 1 ms each (`__drawCost(n)`).
  - **FISH DONE** (`src/i_fish.js`, `drawCreature3`, hooked at the top of `drawCreature` when `V3ON`): `fishDesign(sp)` builds a design per species from its old shape letter, pattern flag, size and name keywords (pike/trout/perch/carp/cod/jack/grouper/...), area touches (ember glow, frost sheen, cosmic sparkles, deep-sea glow) and per-id variety; `FISH3_OVR` holds hand-made designs for ~170 signature species. Plans: fusi, deep, long, disc, grouper, koi/carp/goldfish, bill (marlin/swordfish), tuna, mahi, blenny, guppy, eel, worm, shark (hammer/goblin/thresher), ray, manta, ball (puffer), box, horse (seahorse/leafy dragon), mola, angler, blob, seapig, axolotl, tadpole, hatchet, gulper, chimera, rattail, sculpin, flat, star, plus jelly, squid, octopus, crab, lobster, shrimp, isopod, krill. Silhouettes (`o.sil`), shiny, flip and wag all supported; meme overlays still work. QC: `__fishSheet({from,to,ids,loc,cols,cell,save})`. Cost about 0.1 ms per fish.
  - **0.3 RELEASE CANDIDATE READY (2026-11-16), waiting for the director's ONE final approval.** Live for review at https://sizzentra.github.io/driftline/next/ (own save; copies the real save once). Friends' game is untouched (still 2.2.2).
  - **Feedback round 2 (2026-11-16, director + a friend's play notes), all in 0.3, preview only:** angler rebuilt (offscreen render + sky rim light, lit tapered limbs with knee/elbow IK, eased poses, fingers over the rod, head ×1.1, hair clipped under hats `A3_HAT_OPEN/FULL`), 7 body types (`BUILDS`, belly via `A3BELLY`), 9 eye colours, 27 shoes / 17 neckwear / 22 back pieces (`b2_wear.js` data, `l_wear.js` drawing; shop + `bw` Boardwalk-only), dock items sized to the angler (`m_home.js` `DOCK_H`) and draggable on dock + in tank (`S.dock.pos`, `S.aq.pos`), mystery "?" for anything undiscovered (`mysteryThumb`), weeping willow + pond/river foliage (`f3_foliage.js`, willow cached ~20 fps), catfish/gar looks, prismatic shiny tier (`PRISM`, 6% of shinies, ×15 value, switches fight styles), hybrids (`hybridChance`, Odd Genes skill to 1%, own log lines `hb/hs`, 2 aquarium buffs), predator swallow / mid-fight grab with shadow + gulp (`n_play.js`), cast-distance odds (`distanceMods`, no penalty in hotspots), rolled aquarium buffs per fish (`rollAqBuff`, old fish keep their old boost), tank capacity ×1.5 / rate ×.75, "Increase tank size", per-water bounty boards (3 each), streak message fix, Fish Log smallest, price-sorted shops (`o_sort.js`), Rest mode (`r_rest.js`, Lazy Days skill, sits on edge or in the chair), 3 new mini-games + Settings toggle (`p_games.js`), Boardwalk Counter Specials every 3 h + 4 meme outfits (`q_boardwalk.js`), 20 oddities (`s_odd.js`), quieter lofi (no hiss), no blue tap flash. QC: all 10 waters fished with zero errors, phone portrait + landscape, old-save migration, draw cost 0.8–1.3 ms per water. Test hooks: `__forceCatch(id,{shiny,pv,hy,prey,eat})`, `__prismSheet`, `__mg(kind)`, `__rst`, `__dockSizes`.
  - **Round 3 (2026-11-16, director + Cam), preview only:** balance pass with a simulator (`window.__bal` test hook; real catch/fight code): **fixed ROD_RARE missing levels 8-9 (max Rod length made every catch pool[0])**, hybrid value capped ×25, aquarium income per fish capped at `waterEV×4.6×AQ_CAP_K[rarity]`/min (n_play `aqFishBase`), late `LOCS.loot` rescaled to ~1.5× fish EV (shelf 2200, deep 4500, trench 10000, ember 13000, starfall 33000), `xpNeed` ×1.22/level after 20, Tide Pass `passNeed` 180+45L+.8L². Shared formulas `biteSpeed/rareScore/shinyChance` (c_logic) feed both fishing and the new **Stats tab** (`z_stats.js`). Boardwalk rebuilt (`t_board.js`), Tackle sections (`u_tackle.js`), curated Featured shop (`v_shop.js`), Wardrobe sections + full category shop + new glasses/outfits/colours (`w_wardrobe.js`), menu sections (`x_sections.js`: Settings, Pets + bonus filter, Feats closest-first, Aquarium, Home, Rods, Waters), Tide Pass cosmetics per level with stored claims (`y_pass.js`), Spawning Run replaces Fish Rain, hats on a lit layer + hair clip at head top + eye always visible + side-view helmets, close-up eyes, pet scale = angler scale, Lily sleep/zoom poses + bob tail + "Mini Aussie", "???" + how-to-get hints for locked pets/rods/clothes, organised 0.3 patch notes with `## ` headings. **Tester tools (Stats tab, `window.DL_PREVIEW` only): "Unlock everything" etc. for the director's own testing; never enabled in the release build** (verified: release has no DL_PREVIEW and hides them). QC: every tab/section/shop category with zero errors (PC, phone portrait, phone landscape normal + wide), all 10 waters fished day + night, release copy opened with the 0.3 popup.
  - **Round 4 (2026-11-16, director), preview only (commit 6d7716a, published to /next/):** decoration overhaul like the pets one: `ab_decor.js` (`litDraw` lit layer for dock + tank decor, dock item redraws, DECOR bonus ×2, cozy names to 40), `ac_dockart.js` (`DOCK_ART` animated dock decor, `dockThumb` fits measured size), `ad_tankart.js` + `ae_tankart2.js` (`TANK_ART` tank decor, every older piece redrawn; `__decorSheet(t, ids, scale)` test sheet). **Dock shapes** `DOCK_STYLES` + `drawDockStyle` (m_home) used by the water scene and Home. **Pearls rework** (c_logic `PEARL_COIN .25 / PEARL_RARE .03 / PEARL_DIV 250000`, old saves ×0.4 rounded up once via `pearlV`), cheaper relics + Tide Caller + Seasoned Angler (d5), cozy cap 40 + sale bonus. Hats refit (bucket, pirate, mushroom, beret, sombrero, sailor) and facial hair redrawn (l_wear), pattern on outfit (`lk.patOn`), rod slot effects shown, tint colour dots, decor A to Z (o_sort), Skills in 5 sections (`PERK_GROUPS`), Save tab in 3 sections, Settings tab removed from the grid (⚙ in the HUD), Pets > Customize stacks in narrow menus (`.petwrap` container query). Max-rank effects added for Lazy Days (rest XP 100%) and Odd Genes (hybrid ×2). The gift code's plain-text comment was removed from `d10_lily.js` (the live 2.2.2 file still has it until 0.3 ships). QC: 31–32 views per layout with zero errors on PC, phone portrait, landscape normal + wide; all 10 waters fished with 0 and 10+ pearls; old-save pearl conversion; release copy (no DL_PREVIEW, tester tools hidden, gift code not in plain text).
  - **Round 5 (2026-11-16, director), preview only (published to /next/):** smooth menus (`af_smooth.js`: the fade only plays on a tab change; scroll and open drop-downs kept), PC header on one line (flex, ⚙ icon-only 701–1199 px), smoother mountains (`v3range` 1.5 device-px strips filled up to the outline; light-change rebuild stays <4 ms), Waters thumbnails at 2x. Hats: no eye hole any more; every hat measured with an eye-visibility test; bucket/pirate/sombrero/mushroom brims trimmed at the front (`ag_hatfit.js` `TRIM`), toppers redrawn to follow the head (tiara, bunny ears, flower crown, mohawk), fish hat and duck seated, headphones and viking helmet side-on. **Fabrics replace shirt patterns** (`ah_fabric.js`: `FABRICS`, `OUTFIT_FABRICS` per outfit, `lk.outFab`, two-tone `lk.tone`/`lk.shirt2`, outfit fabric drawn on an offscreen layer so it lands only on the garment, sleeves via `a3LimbFab` + `SLEEVE_DESIGN` for outfits with printed designs; old designs refunded once via `fabV`, flannel/pinstripe kept). Belt only for no outfit / vest / life jacket / tux T-shirt. Dock: waterline (`drawDockStyle` wrapper draws below-water parts at 20%), Home uses the scene's proportions (×2.6). Pets draggable in Home (`S.dock.petPos/pet2Pos`, used on the water too). **Dax & Niko** (`d11_pair.js`, id `daxniko`, Zac's exclusive double pet, gift code in the private memory only): one pet, +12% XP exactly like Lily (verified), own faces/poses/animations, gear on both via `drawLilyGear` frames, `__pairSheet` test hook. Cooler (`ai_cooler.js`): Sell / To aquarium on the catch card (buttons under the name), Sell all pill on the water, Cooler tab removed from the grid (the top Cooler counter opens it), catch card shows "Sells for"; **no auto-sell** (director: aquarium choices stay manual). Rod slots one row each, Tide Pass picks never repeat, aquarium tank visible in Decorate, Wardrobe/Pets stack in narrow menus (container queries on `#panel`). Balance: Rest with Lazy Days maxed ≈12% of active income in every water and stops after the cooler fills (8 slots ≈16 min), so active fishing is always best. QC: 38 views per layout with zero errors on PC (1024 + 1440), phone portrait, landscape normal + wide; a real catch in all 10 waters day + night; release copy (no test hooks, tester tools hidden, gift codes not in plain text).
  - **Round 6 (2026-11-16, director), preview only:** the Cooler is a normal menu tab again (director: "back to how it was"); the top Cooler counter is information only and the Sell all pill is gone. Kept: Sell / To aquarium on the catch card, tap anywhere else keeps the fish. New: taps on the dock side of the water (left 20%) never cast or reel in early (`down()` in c_logic, after the pet check), so a missed pet tap does nothing. QC: PC, phone portrait, landscape normal + wide, release copy, all zero errors.
  - **Round 7 (2026-11-16), preview only:** Events tab (`aj_events.js`, derby moved out of Bounties, reward table), info boxes only hover when clickable (`.tile:has(button…)`), 5 dock posts everywhere (`dockPosts5`), Tide Pass fallbacks 50 Scales / 300 tickets (`PASS_FB_*`) so owning everything never repeats, pre-0.3 claimed levels show "Claimed", Wardrobe tab icons, Customize stage fits each pet (`petFitScale`), **Dax & Niko dressed separately** (Niko's look in `S.petLook.daxniko_niko`, Dax/Niko switch in Customize, per-dog tint via canvas filter, capes in every pose, Dax's hats mirrored except text hats), Niko recoloured pale cream, front-facing pet hats raised 1.3 (`LILY.hatLift`, toppers excluded via `HAT_TOPPER`) with no side-view brim trim (`HAT_TRIM_OFF`) and front ushanka/aviator (`FRONT` in ag_hatfit). Verified by contact sheets: Lily 11 poses × 57 hats × 11 accessories, the pair 11 moments × 57 hats × 11 accessories, zero errors. QC 39 views on PC, portrait, landscape normal + wide; release copy.
    - Done since the areas and fish: **UI layer** (`src/a2_v3ui.js`, body.v3: glass panels, lantern buttons, icon tab grid that fits every phone width and sideways), **Home dock diorama** using the current area's sky/landscape/water (`paintHome3`), **lit stage** for Wardrobe/Pets (`v3Pedestal`), **aquarium** (`v3TankBack`/`v3TankGlass`), **Waters thumbnails** painted from each scene (`v3Thumb`), **rods as real gear** (`v3Rod` in game and Rods tab), **music themes per water** (`src/j_music.js`, "Follow the water"), **new controls** (`src/k_controls.js`: tap to aim, crank reeling by circles or mouse wheel, gamepad with analog trigger, phone vibration; Settings > Controls), **0.3 patch notes** with old versions relabelled 0.1.x / 0.2.x.
    - `V3ON` is now always true (src is the 0.3 game). The main site only changes when `publish.ps1` runs.
    - QC done: every area × day/dusk/night on PC, phone portrait and landscape; weather overlays; a full automated cast → bite → hook → reel → land → catch in all 10 areas with zero errors; every fish/creature sheet; rods sheet; hats sheet; music levels measured per theme; draw cost under 1 ms per area; the release build (real save key, no badge) loads and shows the 0.3 notes.
    - **To launch after approval:** `powershell -ExecutionPolicy Bypass -File publish.ps1 "Driftline 0.3: The Big Glow-Up"` (builds `site/index.html` as 0.3, commits, pushes main and gh-pages). Then add the 0.3 entry to the patch-notes memory and set "Live version" above to 0.3.
  - **Next, in order:**
    1. ~~The 9 other areas~~ (done).
    2. ~~Unique fish designs~~ (done).
    3. ~~UI makeover~~ (done).
    4. ~~Music options~~ (done).
    5. ~~New player controls~~ (done).
    6. ~~Dock diorama and aquarium~~ (done).
    7. ~~Patch notes + final QC~~ (done). Launch waits for the director's approval.
  - Test tools (`?test`): `__setPhase(0.5)` sets the clock and finds clear weather, `__crop(x,y,w,h,scale)` enlarges part of the canvas, `__go(id)` moves to an area.

## Roles
- **The user is the director:** a non-programmer who sets the vision, play-tests and approves. Explain things in plain words and guide step by step.
- **Claude is the lead developer:** builds, tests on PC and phone sizes, publishes, and writes the patch notes.

## Ground rules (director)
- **Fishing stays the core.** Everything else supports it.
- **Equal care for PC and mobile,** in both portrait AND landscape. Test all three sizes before publishing: 1280×800, 375×812 and 844×390.
- **Cozy and homey,** with light humour everywhere but never as the focus.
- **Try before you buy:** every purchase has a preview.
- **Don't over-buff,** but make every choice meaningful (skills, paths, gear).
- **No easy way to delete progress:** the reset needs a typed DELETE and makes a backup first.
- **Patch notes for every update, spoiler-free:**
  - Be vague but complete: "21 new fish", never their names.
  - Mention every change, including small fixes, renames and shortcuts.
  - Once a version is published, keep its notes exactly as they shipped. New work gets a new version entry, so players who already read the notes still see the change.
  - If several things are requested in one round, they ship together as one update.
- **It should feel like a real app** (the director compared it to PokéBonk), with a clean look on phone and PC.

## The 0.3 mandate and quality control (director, 2026-11-16)
**Release rule (director, 2026-11-16): ALL updates and fixes ship in ONE giant 0.3 launch. Nothing is published to friends' game (site/index.html) before then: use `publish_preview.ps1` only. The director will check back when the whole project is finished, and wants ONE final approval when EVERYTHING is done, "not a moment before": no interim check-ins or partial reviews.**
"I trust you to finish this entire project on your own, don't let me down." Claude owns 0.3 end to end and judges its own work from the director's perspective, harder than the director would. **No design choice or decision may miss the bar.**
- **Scope:**
  - unique designs for every fish, every backdrop and every lighting setup
  - cozy music options that fit the atmosphere
  - new, innovative ways for players to control and customize
  - optimized, error-free
  - PC and mobile with equal love, both fully functional and smooth
- **Misses the director caught (never again):**
  - a detached pet head in a mockup
  - lantern glow passing through its pole
  - lumpy mountains
  - Lily's hats and accessories not attached to her body (positioned for one pose, never tested across poses and items)

**QC checklist, every piece of work, before the director sees it:**
1. Render it and zoom in (`?test` → `__crop`) on every character, pet, prop, landform and UI element.
2. **Every combination:**
   - each pet × each pose × each hat/accessory/colour
   - each area × day/dusk/night × every weather
   - PC 1280×800, phone 375×812, phone landscape 844×390
3. **Physics of the picture:**
   - parts joined
   - light behind solid objects
   - attachments follow position, rotation and flip
   - nothing pops or vanishes mid-animation
   - shadows and reflections consistent
4. **Silhouettes and shapes:** smooth and deliberate, never lumpy, never clip-art; proportions consistent across the game.
5. **Speed measured:** frame time and the worst case. Nothing heavy every frame that could be cached.
6. **Decisions:** think through saves and migration, balance, mobile, accessibility and patch notes before choosing.
7. **Self-critique:** "what would the director notice first?" Fix it, re-check, and only then present.

## How it's built
- **One HTML file**, built from parts in `src/` by `build.ps1`, in this order: `a_head.html` (layout + CSS), `b_data.js` (data), `c_logic.js`, `d_draw.js`, `d2_extra.js`, `d3_update.js`, `d4_style.js`, `d5_v16.js`, `d6_preview.js`, `d7_v20.js`, `d8_v21.js`, `d9_link.js`, `d10_lily.js`, `e_ui.js`. Around them sit `shell_top.html` and `shell_bottom.html`. The output is `site/index.html` plus `site/version.txt`.
- **Each big update added its own file:**
  - d5 = 1.6
  - d6 = previews
  - d7 = 2.0
  - d8 = 2.1 content
  - d9 = device transfer, tab grid, two-pet actions
  - d10 = Lily
- **Saves:**
  - Saves live in `localStorage` under `driftline-save-v1`, and `migrate()` validates every load.
  - **Data that saves are checked against must live in `b_data.js`** (it loads before the logic): PETS, HATS, PERKS, BAIT, SP.
  - Later files may push into other lists (RODS, ATTS, DECOR, DOCK_DECOR, JUNK, RELICS, OUTFITS, PRIZES, FEATS), but then they must update the matching lookup tables.
  - `fresh()` and `migrate()` may only use plain values or `b_data` constants.
- **Panel buttons:**
  - Buttons use `data-act`. The handler in `e_ui.js` falls through to `extraAct` (d2), which chains `extraAct2` through `extraAct7`.
  - Each returns `undefined` (not handled), `'render'` or `'skip'`.
  - New actions go into `extraAct7` in `d9_link.js` (or a new link in the chain).
- **Version and patch notes:** `GAME_VERSION` and `PATCHES` sit at the top of `d3_update.js`. A new version shows its notes once to returning players.
- **Bonuses:**
  - `bonus(k)` adds up buffs, aquarium, pets and rod, with caps.
  - The favourite pet gives its full bonus. The companion gives `compShare()`: 50% plus 2% per bond level.
- **Moving progress:**
  - Save codes: `DL1:` + deflate + base64.
  - Links: `#load=` + a URL-safe code.
  - **6-digit transfer:** Send puts the save code as a file in an ntfy.sh topic named `driftline-move-<code>`. Get progress reads the newest one from the last 3 hours, then posts to `<code>-ok`, so the sender shows "All done".
  - The QR on the sender encodes `#pair=<code>`, which opens Get progress with the code already filled in.
  - The device-to-device connection (PeerJS/WebRTC) was removed because routers blocked it.
- **Hosting:** GitHub Pages (`sizzentra/driftline`, `gh-pages` branch = `site/`). The service worker fetches the network first and always revalidates. The in-game banner checks `version.txt`, and the Update button bypasses the cache.
- **Windows app:**
  - `desktop/Driftline.cs` is a WPF + WebView2 wrapper that loads the live site, so it updates by itself.
  - `desktop/build_desktop.ps1` builds `site/download/Driftline-Setup.zip`.
  - The app installs to `%LOCALAPPDATA%\Programs\Driftline`; `--portable` skips installing (use it for tests).
  - Rebuild the zip only when `Driftline.cs` changes.

## Workflow
1. Edit `src/`.
2. Build: `powershell -ExecutionPolicy Bypass -File build.ps1`.
3. Test locally: `powershell -ExecutionPolicy Bypass -File tools/serve_local.ps1`, then open `http://localhost:8766/?test`.
   - `window.__dl.S()` returns the save and `__dl.G` the game state.
   - Game functions are not global, so drive the game by clicking `data-act` / `data-tab` buttons from scripts.
   - Check every tab opens without errors at all three sizes.
4. Publish (builds, commits with the attribution trailer, pushes `main`, pushes `site/` to `gh-pages`): `powershell -ExecutionPolicy Bypass -File publish.ps1 -Message "Driftline X.Y: what changed"`.
5. Check that `https://sizzentra.github.io/driftline/version.txt` shows the new stamp. It takes about a minute.

Gotchas:
- Multi-line edits with `sed` fail on these files; use an editor or awk. In bash, `$` and backticks inside heredocs need care.
- A `//` comment inserted mid-line silently eats the rest of that line.
- The local server's `?test` swaps in a steady frame timer, so animations play in background tabs.

## Exclusive gifts
- **Lily** (`d10_lily.js`) is Cam's exclusive pet. Cam is the director's friend, and Lily is a tricolour mini Aussie drawn from a photo of his real dog.
  - **Unlocking:** she unlocks only with a gift code redeemed in Settings. The code is stored base64-encoded in `redeemGift`; the director has it.
  - **Hidden from others:** she has `src:'gift'`, so she's hidden from other players' pet list and doesn't count toward the "own all pets" feat.
  - **Animations:** she sits facing you, like in the photo, with head tilts, sniffing, giving paw, zoomies with paw prints, belly-up rolls every third pet, a "Boof!" when a fish is landed, and night naps.
  - **Patch notes:** redeeming the code shows Cam's own notes card (`LILY_PATCH`), which then stays in his patch-notes list. Public notes only mention "a gift code box".
- To make another one: copy the Lily pattern (a `'gift'` pet in `b_data.js`, a drawing, a code in `redeemGift`, a personal notes card).

## NEXT BIG FOCUS: Driftline 0.3 overhaul (director, 2026-11-16)
Version numbers (director): the overhaul is **0.3**, not 3.0, so each step up carries real weight. Style mockups (3 options, the director picks): https://claude.ai/artifact/326v8aADGzr8wbyemBtmPe
The director wants the whole game taken "up a notch, across the board". Lily showed what's possible. Things feel too simple; the game is missing a cohesive art style.
- **Scope (nearly everything):**
  - visuals, animations, effects, music, atmosphere
  - each map unique and gorgeous
  - a beautiful UI
  - equipment
  - pets, customization, clothes, hats, decor
- **Priorities:** optimization and gameplay.
- **Plan (each phase approved before the next):**
  1. **Art direction:** mockups of 2–3 styles. Each is a full scene (map, character in outfit + hat, pet, decorated dock, aquarium corner, UI panel). The director picks one.
  2. **Performance groundwork:** cache static layers, move water/light effects to the GPU, a quality setting, pause when hidden. Target smooth 60 fps on phones, measured.
  3. **Vertical slice:** one map fully redone (water, lighting, weather, wildlife), the character rebuilt with cast/reel/idle/celebration animations, the catch reveal, music + ambience, 3 pets with Lily-level personality, and a few clothes/hats/decor pieces. The director play-tests it.
  4. **Every map gets its own identity:** palette, landmarks, creatures, sounds, music theme.
  5. **Redraw every item** (pets, clothes, hats, decor) in the style, with deeper customization and bigger previews. Saves carry over.
  6. **UI makeover:** one theme, drawn icons, transitions, feedback.
  7. **Equipment and gameplay depth:** visible, distinct gear; visible effects; a richer reeling fight.
- **Rollout:** build on a separate preview link so friends keep playing the stable version. Ship as **0.3** with full spoiler-free notes.
  - Preview build: `site/next/`, which needs its own save key. It copies the main save on first open and never writes to it.
- **Art direction CHOSEN (2026-11-16): B2 "Glow Diorama"** (the canvas above).
  - Rich layered depth, rim light, bloom on light sources, detailed shapes, and everything gently alive.
  - **Quality bar (director):** zero visual errors. Parts joined, light behaving physically, polished silhouettes. Inspect every drawing up close before showing it. The director rejected B2's detached pet head, glow passing through the lantern pole, and lumpy mountains.
  - Apply the concept to every artwork and system: modern, accurate, alive.
- **Still open:** music (richer generated layered themes vs free-licence recorded tracks); relabelling the old 1.x/2.x patch-note versions as 0.1/0.2 when 0.3 ships.

### Area identities (draft, nothing built yet)
Each area gets:
- its own palette and light
- a landmark
- wildlife
- a signature effect
- ambient sound and a music motif
- a platform look

Names stay; fish and gameplay are unchanged.
1. **Willow Pond** (wooden dock):
   - **Palette:** warm dusk, peach and violet.
   - **Landmark:** a cabin in the pines with a lit window and chimney smoke, and a weeping willow over the water.
   - **Wildlife:** ducks, frogs on lily pads, dragonflies, fireflies.
   - **Signature:** a glowing lily bloom.
   - **Sound:** crickets and soft guitar.
2. **Stonebrook River** (wooden dock):
   - **Palette:** fresh morning, green and silver.
   - **Landmark:** an old stone arch bridge and a mossy waterwheel mill.
   - **Wildlife:** a kingfisher, a heron, trout jumping.
   - **Signature:** fast current lines, foam around rocks, mist.
   - **Sound:** a babbling stream and a fiddle melody.
3. **Saltmarsh Coast** (long pier):
   - **Palette:** breezy midday, sand and teal.
   - **Landmark:** **the lighthouse** with its sweeping beam at dusk, plus dunes with grass.
   - **Wildlife:** gulls, crabs on the posts.
   - **Signature:** rolling waves with foam, wind in the grass.
   - **Sound:** surf and an accordion sea-shanty motif.
4. **Frostbite Lake** (ice):
   - **Palette:** blue hour, ice and lavender.
   - **Landmark:** an ice-fishing hut with a stovepipe, and snowy pines.
   - **Wildlife:** an arctic fox, an owl.
   - **Signature:** an aurora rippling across the sky, falling snow, cracks glinting in the ice.
   - **Sound:** wind and a music box with bells.
5. **Coral Shallows** (sand):
   - **Palette:** bright tropical noon, turquoise and coral.
   - **Landmark:** palm trees, a hammock, a beach hut on stilts.
   - **Wildlife:** a turtle surfacing, parrots.
   - **Signature:** caustic light on the sandy bottom, a reef visible below the surface.
   - **Sound:** ukulele and steel drums.
6. **Brine Shelf** (boat):
   - **Palette:** open-sea golden hour.
   - **Landmark:** a distant tall ship and a buoy bell.
   - **Wildlife:** dolphins leaping, an albatross.
   - **Signature:** a big rolling swell that tilts the horizon, spray.
   - **Sound:** a creaking hull and a strings motif.
7. **Midnight Deep** (trawler):
   - **Palette:** stormy night, deep navy and lightning white.
   - **Landmark:** the trawler's deck lamps and nets.
   - **Wildlife:** a whale tail in the swell.
   - **Signature:** rain sheets, lightning flashes, a huge swell.
   - **Sound:** a low cello drone and thunder.
8. **Hollow Trench** (raft):
   - **Palette:** eerie twilight, inky teal.
   - **Landmark:** sea stacks and a sunken shipwreck mast.
   - **Wildlife:** bioluminescent jellyfish below, glowing eyes in the deep.
   - **Signature:** glowing plankton trails, a light-swallowing dark centre.
   - **Sound:** whale song and an ambient pad.
9. **Ember Springs** (stone):
   - **Palette:** volcanic night, magma orange and basalt.
   - **Landmark:** a smouldering volcano and stone terraces.
   - **Wildlife:** fire salamanders, glowing moths.
   - **Signature:** rising steam, embers drifting up, glowing water.
   - **Sound:** bubbling springs and taiko drums.
10. **Starfall Lake** (crystal):
    - **Palette:** above the clouds, cosmic violet and starlight.
    - **Landmark:** floating islands, crystal spires, a ringed planet.
    - **Wildlife:** star-fish constellations, light wisps.
    - **Signature:** shooting stars falling into the lake, the Milky Way reflected.
    - **Sound:** celesta and choir pads.

### Systems the overhaul covers (all 17 tabs)
- **Fishing scene:** cast, bite, reel fight, catch reveal.
- **The angler:** a rebuilt character with layered clothes, hats and glasses, plus animations.
- **Pets:** every one redrawn with Lily-level personality animations.
- **Home dock and decor; aquarium (tank, fish, decor).**
- **Gear:** rods, attachments and baits, visible on the character and in previews.
- **Every panel:** Cooler, Tackle, Rods, Bounties, Tide Pass, Waters (a map with area art), Aquarium, Home, Pets, Wardrobe, Skills, Paths, Fish Log (fish portraits), Feats, Boardwalk (games), Save, Settings.
- **Effects and feedback:** splashes, sparkles, coins, level-ups, rarity glows.
- **Music and ambience per area.**
- **Performance groundwork first:** cached layers, GPU water and light, a quality setting, pause when hidden.

### Build order (proposed)
1. **Preview link + performance groundwork.**
2. **Willow Pond as the showcase,** built to the B2 bar: the angler, three pets, dock decor, cast/reel/catch moments, and the pond's music. The director play-tests on PC and phone.
3. **The other nine areas,** each shown as a mockup first, then built.
4. **Every pet, clothes, hats and decor redrawn.**
5. **UI makeover across all 17 tabs.**
6. **Gear and fishing depth.**
7. **Ship 0.3.**

## Roadmap: things to work on (closest first)
1. **Confirm the open items** above with the director: the real phone ↔ PC transfer, Lily's look, and the sidebar toggle in portrait.
2. **Lily polish:**
   - At night her black coat is hard to see on a dark dock; consider a soft rim light.
   - Hats don't follow her head tilt exactly.
   - Get Cam's feedback.
3. **Transfer safety net:**
   - ntfy.sh is a free third-party relay (about 250 messages per day per IP, and files expire after about 3 hours).
   - If it ever becomes unreliable, move to our own tiny relay, for example a free Cloudflare Worker.
   - The link buttons stay as the fallback.
4. **Code tidy-up:**
   - One file per update and the `extraActN` chain have grown long.
   - Fold them into feature files (pets, gear, home, social) with one shared action registry, without changing saves.
5. **Performance check on an older phone:**
   - The scene, the Lily animation loop in the Pets tab, and the aquarium all redraw every frame.
   - Measure, and pause the redraws in background tabs.
6. **Accessibility:** rarity shown by more than colour (icons or patterns), a reduced-motion setting, bigger touch targets in the landscape tab grid.
7. **Save size:** saves grow with the fish journal. Keep codes and links compact (drop derived data before encoding).

## Future plans (ideas, nothing decided)
- **Cam's big concepts (2026-11-16), lead dev's recommendation, in order:**
  1. **Per-water events** (best value: makes every water feel alive and rewards being there). Start with the ones that have a gameplay hook, each as a short timed event with a toast and a visible scene moment: Brine Shelf marlins/sailfish runs (bigger fish for a minute), Midnight Deep spectres (drop treasure, shiny boost), Frostbite blizzard (flash-freezes a fish: an instant catch), fishing boats raising a hotspot, Saltmarsh spotlight vessel, Trench jellyfish bloom, Ember eruption, Willow shooting stars, Starfall cosmic event (bigger fish). Build them on one shared event system (weight, duration, effect, scene hook), not ten one-offs.
  2. **Backyard pond** (strong long-term goal, pairs with the trophy room): stock with caught fish (2 of a type to breed), its weight pool comes from what you add, low bite chance, gold to cleanse a type. Design after the trophy room so the two don't overlap.
  3. **New maps** (Amazon rainforest, Cherry Blossom/Japan, Canadian Rockies, Florida Keys): good, but each needs a full water (fish list, scene, weather, events, thumbnails) at the 0.3.3 quality bar. One per release at most, after per-water events exist so they launch with their own.
- **Friends without accounts:**
  - Visit a friend's dock from a code (read-only).
  - Send gifts or fish to a friend with a code (it can use the same relay).
  - A weekly friends' leaderboard for derby scores.
- **Seasonal and live content:** holiday decorations, limited-time fish, weekend derbies, seasonal waters (autumn lake, winter ice fishing).
- **More personal gifts:** exclusive pets or items for other friends, using the Lily pattern.
- **New waters and things to discover:**
  - A deep-sea trip by boat.
  - A night market.
  - A secret pond unlocked by a feat chain.
- **Cozy activities around fishing:**
  - Cooking your catch for short buffs.
  - A small story with a grumpy lighthouse keeper (light humour).
  - Boat upgrades.
- **Aquarium:** fish that behave differently together, themed tanks with bonuses, visitors who comment on your tank.
- **More Boardwalk games** and prizes, keeping the gambling-style games light and fair.
- **Controller support** on PC, and haptics on phones for bites and catches.
- **Optional cloud backup** of your save via a code, building on the transfer relay.
