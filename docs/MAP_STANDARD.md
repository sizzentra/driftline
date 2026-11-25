# Driftline map standard (decided with the director, 2026-11-21)

One job: what every water must have. Homes have their own standard (docs/HOME_STANDARD.md). Every water was brought up to it on 2026-11-21 (pictures for the director and Cam to judge); `__mapQC` checks it (sweep part Maps).

## Every water has
1. **A unique theme of its own,** clearly different from every other water.
2. **Its own land and sky:** a 2D side view, layered back to front, with "Glow Diorama" depth and lighting.
3. **A landmark you recognise at a glance** (the pagoda, the lighthouse, the volcano), even as a thumbnail.
4. **All four times of day:** dawn, day, dusk and night (stars where the sky is open).
5. **Life all the time:** at least 3 moving things (birds, fish, animals, boats).
6. **A moment of its own** every 20–60 seconds (leaping dolphins, Pegasus, a moose drinking).
7. **A clear fishing area:** nothing covers the water where the bobber, fish shadows and hotspots appear, and they stand out against it.
8. **Reads well at every phone size,** from 667×375 to large phones and tablets: no detail that turns to noise when small, nothing empty or stretched when big.
9. **Weather that fits the water** (no rain inside the Buffet).
10. **Its own art:** no pieces copied from other waters.
11. **Its own sound:** music and ambience that suit it.
12. **Events and special weather work there** (Blood Moon, storms, starfall and the rest look right).
13. **A speed limit (a ceiling),** so it runs smoothly on phones: at the start of the production run every water is timed on the phone build (day, night, storm, with an event); the limit is set just above today's smooth ones, and any heavier water is lightened without changing its look. The minimums in this list (life, a moment, a landmark, nothing empty on big phones) are the floor.
14. **Its fish, Fish Log, lessons and Waters card.**

## Side-view design step (director, 2026-11-21: art kept being drawn from the front)
Before any piece of art is drawn:
1. **Describe its side silhouette in one line** (for example: a pergola from the side is two posts, a beam, and the cloth as a thin sagging line on top with short ends hanging straight down).
2. **The director approves that description** (or a rough sketch) during the idea queue.
3. **Only then is it drawn,** and the drawing is judged against that description. Anything that shows a front or top view (scallops facing you, curtains hanging toward you, a roof seen from below) is redone, not patched.

## Placement types (director, 2026-11-21)
Every object on a map has exactly one placement type, and its type decides its rules (rules 15–21 below apply by type). Anything that hovers must be Floating / flying.

| Placement | Examples | Rules |
|---|---|---|
| Sky | sun, moon, clouds, stars, aurora | behind everything; follows the time of day; reflects only on calm water |
| Background | far mountains, skylines, far trees | hazier, softer and darker with distance; part of the land picture; reflects faintly |
| Ground | trees, houses, rocks, animals on land | stands on the ground line; casts a shadow; never hovers |
| In water | boats, posts, lily pads, swimming animals, rocks | sits at the waterline with a ripple or contact line; reflects; bobs if it floats |
| Under water | fish shadows, weeds, sunken things | below the surface, tinted by the water; never covers the bobber and fish in the fishing area |
| Floating / flying | birds, insects, floating islands, Pegasus | may hover; moves through the air; a soft shadow or reflection when low |
| Foreground | reeds and branches at the screen edges | in front of everything, only at the edges; never over the fishing area or the home |

## Everything is grounded and connected (director, 2026-11-21: "we've had issues with things not being connected")
15. **Everything rests on something:** trees, rocks, houses and animals stand on their ground line; nothing hovers unless it flies.
16. **Things in water touch the water:** boats, posts, rocks and swimming animals sit at the waterline, with a ripple or contact line where they meet it.
17. **Reflections line up:** each object's reflection sits directly under it, at the water's edge, never shifted or missing.
18. **Flowing things finish:** waterfalls and streams reach the water below and splash where they land.
19. **Moving things follow the surface:** walking animals stay on the ground, swimming ones in the water, boats ride the waves.
20. **No gaps between layers:** the shore meets the water, the hills meet the shore, the sky meets the horizon; no seams or empty strips at any screen size.
21. **Shadows and light agree:** everything is lit from the same direction as the scene's sun or moon.

## Life on the map (director, 2026-11-21)
22. **Every creature fits its water's theme** (a moose at the Rockies, a capybara in the Amazon), never a generic animal dropped anywhere.
23. **Each creature has a placement type** (ground, in water, under water, flying) and moves only along it.
24. **True to size:** sized against the angler and each other, smaller the farther back.
25. **Natural behaviour:** believable speeds, turns and pauses; no obvious identical loops.
26. **Enters and leaves off-screen** or from behind something; never pops in or out in the open.
27. **Time and weather matter:** owls and fireflies at night, birds by day; animals shelter or thin out in storms.
28. **Moments are special:** each water's moment comes every 20–60 seconds, varies a little each time, and is the only big thing happening while it runs.
29. **Never in the way:** out of the fishing area and off the home; never over the bobber or fish shadows.
30. **Grounded and connected** (rules 15–21): feet touch the ground, swimmers make ripples, low fliers get a soft reflection.
31. **Cheap to draw:** every creature stays within the speed limit, so a busy map still runs smoothly on phones.

**All 21 waters, old and new, are held to this same standard** (director, 2026-11-21): the production run brings every water up to it, and the director judges the results.

## Still to decide
- Nothing: the map standard is decided (2026-11-21). The speed limit's number comes from the measurement at the start of the production run.

## Checked by tools
- **Built (`__mapQC`, bn_qa04.js; sweep part Maps, phone build and PC):** draws at dawn, day, dusk and night and in every weather without errors; at least 3 moving things and life after dark listed per water (`MAP_STD`); the moment every 20–60 s and visibly on screen (frames outside its window make an envelope of normal motion; the frame inside it must clearly break out); frame cost at most 3.2× the median water (rule 13's ceiling, set 2026-11-21 just above today's heaviest smooth water). Midnight Deep's moment is judged by eye (the whole view rocks and its rain never stops).
- Not a tool yet (judged by the director and Cam from pictures): nothing over the fishing area, reflections under objects on the water, no empty strips between layers, the rest of rules 15–21.

## The painted-scenery standard (director, 2026-11-24: "With cherry blossom lake, i'm very happy where it's at (outside of its home)")
Cherry Blossom (src/w_blossom.js, src/w_blossom_art.js; history: docs/reviews/blossom.md) is the reference for a water whose scenery is a painting. Painting other waters is the director's call. When a water is painted, it follows this:
**Source and cleaning**
- The director's picture is the target (1:1 layout). Everything the game draws itself is cleaned out once: house, angler, rod, line, float, labels, the frame's edge. Patch from the scenery beside it (mirrored shore, water from above). Keep the cleaned full-size source in `art/`.
- Split it into layers: land by day, sky, clouds, water. The land's sky is see-through, so the game's own sky, sun, moon and stars show behind it. Clouds are cut out one by one and drift behind the land.
- Edges of keyed layers take the colour just inside them (1-3 px), so no coloured line rings the ridges.
**One painting, relit**
- Dusk and night are the day painting relit (per colour channel), never separately painted versions. Separate versions never line up, and every blend between them doubles up like a blurred photo.
- Painted layers are built at fine light steps (32) and faded in over about 1.3 s, so dusk and dawn change smoothly with no jumps. Arriving shows the right light at once.
**Water and reflections**
- The lake and its reflections are drawn under the land, and the land is drawn again on top, so no water effect (ripples, glitter, rain, petals) ever crosses rock, islands or flowers.
- **ChatGPT paints no reflections and no water effects** (director, 2026-11-24: "you do reflections better than chat gpt for sure"): every painting request (maps, buildings, chairs) says no reflections, ripples, water, shadows on the water or glow; Claude builds them in the game.
- Reflections are made from the land itself at each shoreline, not painted. Something standing in front of the far shore (an island, a torii) mirrors at its own base. A bridge mirrors at one fixed line, its posts' waterline. The shoreline is smoothed hard, because a 1 px wobble moves a reflection 2 px. Check reflections in full-size crops against what they mirror.
- The sky shows in the lake (clouds, the moon's path), cut where the land's reflection stands. There is no sun reflection on this water (director).
- Reflections fade with depth, are a little darker and cooler, and are fainter at night.
**Movement and life**
- Movement comes from the painting itself: strips of it ripple (more toward you), trees and flowers lean as one piece from their foot (strips leave seam lines over a see-through sky), and the painted waterfall scrolls a seamless texture cut to its own shape. Strengths live in one table (`BL_MOTION`); reduced motion holds it all still.
- Added life is small and sparse and fits the place: birds behind the tree, butterflies, dragonflies, fireflies, sky lanterns at night (in front of the mountains, behind the tree, dim, about 22 px). Nothing that fights the painting: no koi, no leaping fish, no petal gust (director). A painted water may have no moment (`MAP_STD` eye exception).
**Home and cost**
- The home is the one thing drawn in the game's own style over the painting, so it needs its own pass to sit in the light and the brushwork (Cherry Blossom's is still open).
- Keep the atlas small (one WebP, about 0.85 MB) and measure the frame cost day and night on phone and PC (Cherry Blossom: about 3 ms day, 7 ms night on PC).

## The Rockies standard (director, 2026-11-23: "Canadian Rockies is our most polished map, the new standard for all maps")
Every water is brought up to this, in its own theme. Reference: the Canadian Rockies (src/w_rockies.js; how it got there: docs/reviews/rockies.md, rounds 1-4).
**Start from the real place.** Read the water's MAP_THEMES entry and look at real reference pictures of the place before drawing; nothing goes in that doesn't belong there (no birches at Lake Louise), nothing iconic of the place is missing.
**Landforms**
- Natural outlines from noise, never plain triangles, zebra stripes, teeth or tents; each water its own landforms (nothing recycled).
- Layered depth: a far range, a nearer range, framing slopes at the sides, a band of forest or land at their foot, haze between the layers.
- Rock texture that fits the geology (the Rockies' limestone strata), blended at its edges, never hard-edged stripes or stickers; light from one side, shade consistent across rock and snow.
- Snow and similar fields end raggedly, never in hanging teeth, stair steps or floating ovals; no hair-thin vertical lines, no floating patches, no stray triangles.
**Plants**
- Species that grow there, drawn in detail (tiers of branches, a trunk, a lit side), varied heights, never an even row of the same shape.
**Shore and water**
- A thin, natural shoreline (grass, shrubs, boulders, a wet edge) unless the place really has a beach.
- Where the water is clear, its floor shows only in the near shallows and drops away to deep water, so fights happen over the deep; it fades in, no edge.
- Anything standing in the water sits in it: its underwater part takes the water's colour, a bright line rings it at the surface, reeds and posts carry on faintly below.
- Water always comes from somewhere: a waterfall is fed by a stream from the land, realistic from a distance (hidden in a forested ravine, glimpsed where it cascades, open just before the lip).
- Effects never run across solid things (the glitter is drawn under the beaver dam).
**Life**
- Animals and people never pop in or out: they enter and leave off-screen, behind something or under the water, with ripples and splashes; they stand on real surfaces (the beaver on its dam top), their parts join (the otter's neck), their paths never pass through rocks or logs.
- An animal gets a corner with things to use (the otter: a fallen log to dive by, a boulder to climb, sedges that part as it passes).
- People have routines (the canoeist paddles home at dusk, walks in through his door, comes out at dawn); repeating life varies (each goose flock flies a different formation).
**Time and light**
- Dusk tints, night dims everything (bright rock and foliage too), windows glow, chimneys smoke.
**Play and speed**
- Fights never leave the screen; heavy still detail is kept as its own cached picture (lake floor, near corners, dam) so light changes don't repaint it.
**Checked with pictures, by Claude, before the director sees it**
- Full-size pictures at dawn, day, dusk and night and in weather, phone (956×440) and PC (1920×1080); crops of every detail; `__timeSheet` for every moving animal and person through its whole loop; compared against the reference pictures and the director's earlier notes.
