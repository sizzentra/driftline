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
