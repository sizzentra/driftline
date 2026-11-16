# Driftline: Project Brief

A cozy fishing game in the browser, made for the director and their friends. It installs as an app on phones and PCs, plays offline, and updates itself. It's a side project, separate from OutPace.

## ▶ Where we left off (read first)
- **Live version: 2.2.2** (2026-11-16) at https://sizzentra.github.io/driftline/. Every release is committed on `main`; `gh-pages` holds the published `site/`.
- **Recent releases:**
  - **2.1 "More of Everything":** new content of every kind, two pets at once (★ favourite plus companion), and the tab grid.
  - **2.2 "Closer Together":** moving progress with a 6-digit code, gift codes, and Lily.
  - **2.2.1:** the 6-digit transfer now goes through a relay, so it works on every network.
  - **2.2.2:** a hide/show menus button for phones held sideways.
- **Waiting on the director:**
  - Confirm the 6-digit transfer works between their real phone and PC. It was only tested in two windows on one PC. The first, direct-connection version failed on their phone, which is why it now uses a relay.
  - Confirm Lily looks right to Cam. Lily is his exclusive pet, drawn from a photo of his dog (see "Exclusive gifts").
  - Confirm the sidebar button is the one they meant: landscape phones only. They may also want a toggle in portrait.
- **0.3 overhaul: RELEASE CANDIDATE, awaiting final approval** (2026-11-16):
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
