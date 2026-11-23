# Canadian Rockies: analysis (2026-11-22 night, before the one-water rework)
Pictures: tools/shots/rk_an1.png (day, dusk, night, rain resting, PC 1920x1080), rk_an_home.png (every home style, fishing and resting).
Theme: docs/MAP_THEMES.md › 6 (Lake Louise / Moraine Lake, turquoise glacier lake below huge jagged peaks; spruce, waterfall, canoe, beavers, moose; log, granite, flannel, maple).

## Map: what is wrong
1. **Mountains are plain triangles with white zebra stripes.** No ridgeline, no peaks within peaks, no gullies, no snowfields, no glacier, no foothills, one flat grey. They read as tents, not the Rockies. The stripes repeat in the reflection.
2. **No sense of scale or depth:** one mountain layer straight behind one flat shore; real Rockies lakes have forested slopes rising from the water on both sides, scree fans, a tree line, and far peaks fading blue.
3. **The shore is one flat strip** with a row of small, evenly spaced pines of similar height; the cabin, the moose and the flag are tiny props on the line; the Canadian Shield granite band barely shows.
4. **The waterfall and beaver lodge** on the right are a small grey block and a scribble of sticks; the fall does not come from anywhere.
5. **Night and dusk:** the striped grey faces stay flat and bright; nothing catches the dusk rose light on snow the theme asks for.
6. **The water** is a big empty flat turquoise below the dock; fine as a glacier lake, but the reflection shows the stripes and nothing else.
7. **The corner pine on a boulder** is a big flat dark silhouette, no rim light, the same pine shape as the shore.
8. Missing what makes it the Rockies: the glacier, the jagged row of peaks (Moraine Lake), the red canoes at a dock, larches near the tree line, fireweed.

## Home: what is wrong
1. **Deck styles look identical** (Log deck, Cedar planks, Granite slab are all brown boards; the granite slab is not stone).
2. **All three shelters are thin sticks high above the angler** (log porch, tarp, canvas fly): none reads as a shelter, none visibly covers.
3. **Canoe options are broken:** "Canoe beside" and "Kayak" are not visible at all; "Canoe on a rack" draws a green line that reads as a hammock.
4. **Campfire options are tiny** (fire ring, fire bowl barely visible).
5. **Seats are tiny and hard to tell apart** (Muskoka chair a red speck).
6. **It is a generic dock,** not the theme's direction: a log platform on a rock ledge, a shingled lean-to in side view, a canoe resting on it, a Muskoka chair.

## The rework (standard: hand-crafted at full size, nothing reads as plain geometry)
- Composition after Lake Louise / Moraine Lake: a jagged row of far peaks with snowfields, couloirs and a hanging glacier in the middle; two dark forested mountainsides framing the lake from both sides; scree fans at their feet; a shore of spruce of varied height with larches at the tree line; a canoe dock with red canoes; a waterfall falling from the glacier down a cliff.
- Mountains built from fractal ridgelines, lit on the sun's side and shaded on the other, gullies and snow following the ridges, haze between layers, dusk rose on the snow, a dim navy night.
- Home rebuilt to the theme: rock ledge, log platform, a real side-view shingled lean-to that covers the angler, a canoe that shows, a proper campfire, a Muskoka chair you can see; three styles of each that clearly differ.

## Outcome (test builds 2026.11.22-23xx)
- Map: own jagged ridgelines (rkRidge / rkRange: lit and shaded faces, snow with couloir fingers, limestone bed lines, a glacier in the saddle), two forested shoulders (rkShoulder: tree line, snow streaks, avalanche paths, larches, scree fans), forest at the foot of the peaks, a canoe dock with red canoes, a granite and fireweed corner; dusk rose snow, navy night.
- Home: a wide log lodge seen from its long side (director: a set building you customise, "make sure the lodge is actually wide"), walls / roof / chimney / porch / door and windows / seat; windows glow warm at night (sp.glow, lit window panes); a granite ledge foundation with braced log posts on rock and submerged boulders, one clean deck (director: "all things need to line up correctly on the base platform").
- Checked: PC day, dusk, night, rain, fishing and resting, every style (__hfSheet); phone 956x440 fishing and resting, day and night; gate, start-up, test suite and map check pass.

## All-options check (director, 2026-11-22 night: "check all options as well")
Tool: `__hfAll(id,name,pairs,big)` (every style pair of the features that touch, and every allowed colour, fishing and resting) and `__hfOne(id,name,set,rest,phase)` (one combination at full size). Sheets: tools/shots/rk_all_pairs.png, rk_big1-4.png, rk_one_a-f.png, rk_ph_a-b.png (iPhone 956x440).
Found and fixed:
1. Every colour was allowed on every part (turquoise logs, snow-white roofs): each feature now has a realistic palette (`pal`, checked in hfChoice, the swatches and hfAct).
2. The porch's log rail was drawn behind the chair and the angler: now `rkFront`, drawn after them in the scene and the close-up.
3. The covered porch vanished into the log wall: now a shed roof in the cabin roof's material with a shadow on the wall and darker posts.
4. Dutch door and window box gave only one window: both windows now, each with its flower box.
5. Shutters were invisible against the logs: louvred board shutters in the door's colour with an outline.
6. A duplicate copy of the rail function had been left in the file: removed.
7. The shoulder snow drifts still read as pebbles: long streaks tapering down the gullies.
8. On phones the cabin looked "very stretched out" (director's iPhone picture): the phone shows only about 145 px of deck left of the angler, so the whole cabin was squeezed into a tall box (1.4 to 1). Now the walls are a real 1.3 person-heights, the roof pitch follows the visible part, and the lodge is always at least 2.9 times as wide as its walls are tall, running on past the left screen edge where it does not fit (PC 3.2 to 1).

## Round 3 (director's notes, 2026-11-23, with Lake Louise and Moraine Lake reference photos)
Home: Door and Windows split into two parts (7 features; HOME_STANDARD and its test allow a split part); Dovetailed timbers with flush end-grain corners and chinking (no gaps, sides line up); Logs on a stone base replaces Whitewashed chinking; Tin roof in any color (palette per style, `palS` / `hfPal`); a real sod roof (boards, birch bark, thick turf over the whole slope, grass over the eave, turf log on brackets, daisies, buttercups, harebells, fireweed); chimneys clipped to their stack, a detailed stovepipe (joints, damper, storm collar, spark-arrestor mesh, rain cap); Muskoka chair, stump with a point blanket and a log rocker redrawn; the seat at the deck's edge near the water (`seatX` may be a function); seats limited to real colors (`seatPal`); posts carry straight on under the water.
Scene: rock strata (`rkStrata`: beds of different tone, gently bent, ledge lines with lit lips, snow on the ledges) on the peaks, the shoulders and the waterfall cliff, the snowfield edge ragged without teeth or steps, beds blended at their edges; the shoulder snow streaks and avalanche wedges removed; detailed spruces (`rkSpruce`) on the far shore, the cliff and the bank behind the home; a thin green far bank with shrubs and boulders instead of the pink granite humps; the far cabin's chimney behind its roof; the dam drawn after the glitter from its own cached picture (`rkDams`); the canoeist paddles home at dusk and out at dawn; a river otter's corner bottom left (log, boulder, sedges that part around it; swim, dive, glide under water, eat on its back, groom on the rock, leave off-screen); the clear stony lake floor (`rkLakebed`, cached once per screen size, fades in from the deep water).
Checked: `__hfAll` pairs (porch×seat, walls×windows, roof×chimney, door×porch) and every colour of every style (211 cells); `__hfOne` full size; `__timeSheet` the otter's whole loop; PC day, dusk, night; iPhone 956x440.

## Round 4 (director's notes, 2026-11-23 night)
Otter: a neck joins head and body on the rock; the path enters and leaves above the corner boulder and the log. Near corners: boulders, log and the right corner's granite in one cached picture (`rkNookStatic`) with their underwater parts tinted by the water (source-atop) and a surface line; sedges continue faintly under the water with rings where they come out. Lake floor only in the near shallows with a drop-off edge. Cabin: chimney smoke (`rkSmoke`, per frame, after the pets); stone base and sill under the log ends; the bank under the cabin one textured slope; the Muskoka chair redrawn with every part joined. Scene: geese flocks differ per pass (count, V / lopsided V / line / skein, direction, height); the canoeist walks to the cabin door at dusk and out at dawn (`rkWalker`), fading only through the door; the beaver sits on its dam top; the glacier and the birches removed (`waBirch` deleted).
Stream: `rkStream` / `rkStreamPts`: hidden in a forested ravine below the tree line, two cascades glimpsed between the trees, an open run to the cliff's lip with flowing water (the first continuous ribbon read as a road: director).
