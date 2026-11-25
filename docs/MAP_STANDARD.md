# Driftline map standard (decided with the director, 2026-11-21)

One job: what every water must have. Homes are fixed buildings painted with their map now (section "The painted-map standard"; docs/HOME_STANDARD.md is paused). Every water was brought up to it on 2026-11-21 (pictures for the director and Cam to judge); `__mapQC` checks it (sweep part Maps).

## Every water has
1. **A unique theme of its own,** clearly different from every other water.
2. **Its own land and sky:** a 2D side view, layered back to front, with "Glow Diorama" depth and lighting.
3. **A landmark you recognise at a glance** (the pagoda, the lighthouse, the volcano), even as a thumbnail.
4. **All four times of day:** dawn, day, dusk and night (stars where the sky is open).
5. **Life all the time:** at least 3 moving things (birds, fish, animals, boats).
6. **A moment only if it fits** (director, 2026-11-24: moments are optional). A water may have one every 20–60 seconds (leaping dolphins, Pegasus, a moose drinking) or none at all; a calm painted water is often better without (Cherry Blossom has none). `__mapQC` checks a moment only where `MAP_STD` gives one; a water without sets `none:why`.
7. **A clear fishing area:** nothing covers the water where the bobber, fish shadows and hotspots appear, and they stand out against it.
8. **Reads well at every phone size,** from 667×375 to large phones and tablets: no detail that turns to noise when small, nothing empty or stretched when big.
9. **Weather that fits the water** (no rain inside the Buffet).
10. **Its own art:** no pieces copied from other waters.
11. **Its own sound:** music and ambience that suit it.
12. **Live events and special weather only where they fit** (director, 2026-11-24: not mandatory for every map). Whatever does appear must look right there (Blood Moon, storms, starfall); a water may leave out an event or a weather look that doesn't belong (no rain inside the Buffet), written in its MAP_THEMES entry ("Doesn't belong") and in code.
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
28. **Moments are special, and optional:** where a water has one, it comes every 20–60 seconds, varies a little each time, and is the only big thing happening while it runs.
29. **Never in the way:** out of the fishing area and off the home; never over the bobber or fish shadows.
30. **Grounded and connected** (rules 15–21): feet touch the ground, swimmers make ripples, low fliers get a soft reflection.
31. **Cheap to draw:** every creature stays within the speed limit, so a busy map still runs smoothly on phones.

**All 21 waters, old and new, are held to this same standard** (director, 2026-11-21): the production run brings every water up to it, and the director judges the results.

## Still to decide
- Nothing: the map standard is decided (2026-11-21). The speed limit's number comes from the measurement at the start of the production run.

## Checked by tools
- **Built (`__mapQC`, bn_qa04.js; sweep part Maps, phone build and PC):** draws at dawn, day, dusk and night and in every weather without errors; at least 3 moving things and life after dark listed per water (`MAP_STD`); the moment, where a water has one (`none:'why'` in `MAP_STD` when it has none), every 20–60 s and visibly on screen (frames outside its window make an envelope of normal motion; the frame inside it must clearly break out); frame cost at most 3.2× the median water (rule 13's ceiling, set 2026-11-21 just above today's heaviest smooth water). Midnight Deep's moment is judged by eye (the whole view rocks and its rain never stops).
- Not a tool yet (judged by the director and Cam from pictures): nothing over the fishing area, reflections under objects on the water, no empty strips between layers, the rest of rules 15–21.

## The painted-map standard (director, 2026-11-24: "Cherry Blossom looks fantastic… make it a process that comes with less errors and time… the biggest things we want for maps is for them to feel distinct")
How every revamped water is made from now on. Cherry Blossom is the proof (src/w_blossom.js, src/w_blossom_home.js; history and reasons: docs/reviews/blossom.md), but **it is a method, not a look to copy**: every rule below is about process and placement, and every water's content comes from its own place. The brief for ChatGPT is **docs/reference/CHATGPT_MAP_GUIDE.md** (with a fill-in prompt, docs/reference/CHATGPT_MAP_PROMPT.txt).

### 1. Distinct, never repetitive (the first test for every map)
A new map is judged first on whether it could be mistaken for another water. Each water decides these for itself, writes them in its MAP_THEMES entry and in the **distinctness board** below, and differs from every other water in most of them:
- **Its building and how it meets the water:** on stilts, floating, moored, on a rock ledge, on the shore, on ice, hovering. Never the same silhouette or the same kind of support as another water.
- **Its composition:** where the landmark sits (left, centre, right; far or near), what frames the scene (a tree, a cliff, a hull, nothing), what the near foreground is (flowers, ice, coral, sand, rope, rails). Cherry Blossom's framing tree top left and flowered corners are its own; another water doesn't reuse them.
- **Its palette and its best hour:** one time of day the water is made for (Cherry Blossom: dusk into night with its lanterns). Day colours alone never decide distinctness.
- **Its signature motion:** one or two things that move in a way only this place has (a waterfall, sky lanterns, a geyser, swaying kelp). Not the same set of ducks, birds and butterflies everywhere.
- **Its sound:** music and ambience of its own (docs/MAP_THEMES.md).
- **Its own moment, or none:** moments are optional (rule 6). A water without one is fine; a moment copied from another water isn't.
- **Its own events:** a water shows only the live events and weather that fit it (rule 12).
Things that may repeat across waters are mechanics, never looks: the standing line, the scale, the lighting steps, the reflection method.

### 2. Platform placement (fixed numbers, so the angler always stands right)
Measured in the game (docs/reference/home_guides/blossom/SPEC.md). The unit is the standing angler's height, **AH** (61 px on the iPhone 16 Pro Max, 83 px on PC full screen; 66.9 angler units).
- **The standing line** (deck surface, feet of the angler, chair and pet): 60% down the screen. **The angler** stands 12% from the left, facing right; **the rod tip** is at 21.5% across and 27% down; the line goes out to the right.
- **The building** stands behind the angler on the left. About 6 AH wide, 2.2–2.5 AH from the standing line to its top, walls about 1.4 AH so the angler fits under any eave. Its left 40% may run off the screen on phones, so its best details sit in its right 60%.
- **An open stretch of deck** to the right of the building, about 1.5 AH, where the chair stands; nothing tall to the right of the deck's end.
- **Supports** reach down to the waterline and end there with a wet band; the game adds the contact ripples and the reflection.
- **The fishing area** (right of about 25% across, below the far shoreline, above the bottom corners) stays open water: no islands, boats or plants in it.
- **The chair** is its own cut-out on the open deck, seat at 17 angler units (about a quarter of AH), so it moves with the angler if the angler's spot moves. It always stands on a painted floor.
- **The building is its own layer,** never only painted into the map: the painting is fitted to each screen's shape (cover-fit, waterline on the horizon, extra width cut on the left), while the angler stands at fixed screen fractions, so only a separate layer stays under the angler's feet on every screen. ChatGPT may paint the full scene with the building for style, then hands the building over as its own cut-out.

### 3. The process, step by step (who does what)
1. **Theme first (Claude):** the water's MAP_THEMES entry and its row on the distinctness board are filled in: place, palette, landmark, building, best hour, signature motion, what doesn't belong, moment or none, events that fit.
2. **The director picks a picture** (a painting or reference) for the water; Claude checks it against the board and the theme and says what clashes.
3. **ChatGPT paints the map** from the guide and the fill-in prompt, then splits it into layers (land with see-through sky and water, sky, clouds one by one, water without reflections) and paints the building and the chair as cut-outs. Day only. No reflections, no water effects, no glow.
4. **One focused fix list (Claude):** every problem in one message to ChatGPT, with a mock-up on the painting when the look is in doubt (a mock-up showed the tea house's style match in minutes).
5. **Claude builds it in:** cleaning and keying, light steps, reflections, the sky in the water, movement from the painting, sparse life, glow at night, the building and chair from the standing line, the speed check.
6. **Claude checks it in pictures** (dawn, day, dusk, night, weather; fishing and resting; iPhone and PC; full-size crops) and puts them on a picture page before the test builds; then the sweep, then the test builds.

### 4. What works, and why
| What works | Why |
|---|---|
| The director's picture used 1:1 as the scenery | Five code-drawn redraws never reached the painted look; the painting did in one build |
| Separate layers: land with see-through sky, sky, clouds, water | The game's own sky, sun, moon and stars show through, clouds drift behind the land, water effects run under it |
| Day painting only, relit in code for dawn, dusk and night (32 steps, 1.3 s fades) | Every blend lines up, no blur and no jumps |
| Reflections built in code from the land and the building | They start exactly at each object's feet and match its height |
| Water effects drawn under the land, the land drawn again on top | Ripples, glitter, rain rings and petals never cross rock or flowers |
| Movement taken from the painting (rippling strips, trees leaning from their foot, a seamless waterfall texture) | It moves like the painting instead of drawn things pasted over it |
| Few added creatures, each sized in pictures at two sizes | Sky lanterns read right at 22 px; 36 was "way too big", 16 read as specks |
| The building as a cut-out in the map's own style, softer and faded, lit like the painting's land | It looks painted into the scene, glows at night, reflects, and stays under the angler on every screen |
| Guide pictures with marked boxes and angler-height units for ChatGPT | ChatGPT sized and placed the building right on the first try |
| A mock-up on the painting before importing | Style problems show in minutes, not after a build |
| The chair as its own cut-out | It moves with the angler; the angler sits at the right height |

### 5. What doesn't work (don't repeat)
| What failed | What to do instead |
|---|---|
| Drawing a painted look in code | Use the painting |
| Separately painted dusk and night versions | Relight the day painting |
| Painted reflection layers (sat 12 px off) | Build reflections in code; ChatGPT paints none |
| Green-key edges left as they are (a teal line on ridges, grey halos) | Pull each edge pixel's colour from just inside, despill, soften the outer pixel |
| A first building painting bright, saturated and crisp | Ask for soft, slightly faded colour and brushwork matching the map; check with a mock-up |
| Swaying strips over a see-through sky (seam lines) | Lean the whole piece from its foot |
| Coarse light steps (jumps at dusk) | Fine steps with fades |
| A wobbly mirror line (staircase in a railing's reflection) | Smooth the shoreline hard; one fixed line for a bridge |
| Extra creatures and gusts on top of a painting (koi, leaping fish, petal gusts) | Fewer, sparser, only what the place has; nothing in the fishing area |
| One water's layout reused for another (the Rockies box and bank) | Every water its own building, composition and foreground |
| Customisable homes (6 parts × 3 styles × 16 colours) | One fixed building painted with its map (customisation removed 2026-11-24) |
| Effects over solid things (glitter on a dam, rain on land) | Effects under the land |
| Removing a line in code without checking its brackets (the phones didn't start) | Print the lines around every deletion; run the gate after each build |

### 6. The distinctness board (fill in each row before that water is painted)
| Water | Building and how it meets the water | Landmark and where | Framing and foreground | Best hour | Signature motion | Moment |
|---|---|---|---|---|---|---|
| Cherry Blossom (painted) | Tea house on lacquered stilts, open deck | Fuji far right, torii and pagoda right | Cherry tree top left; flowered stone corners | Dusk into night | Waterfall, sky lanterns, rippling reflections | None |
| Willow Pond | Boathouse over the water | (to fill) | (to fill) | | | |
| Stonebrook River | Stone mill house over the race | (to fill) | | | | |
| Saltmarsh Coast | Lobster shack on a tarred pier | (to fill) | | | | |
| Frostbite Lake | Ice shanty on sled skids | (to fill) | | | | |
| Canadian Rockies | Log cabin on a stone base | (to fill) | | | | |
| Coral Shallows | Overwater bungalow on palm stilts | (to fill) | | | | |
| Florida Keys | Flats skiff staked with a push pole | (to fill) | | | | |
| Brine Shelf | Sport-fisher stern | (to fill) | | | | |
| Amazon | Palafito on lashed stilts | (to fill) | | | | |
| Midnight Deep | Steel stern trawler | (to fill) | | | | |
| Hollow Trench | Castaway raft on barrels | (to fill) | | | | |
| Ember Springs | Basalt bathhouse | (to fill) | | | | |
| Starfall Lake | Observatory on a floating rock | (to fill) | | | | |
| Animal Farm | Red gambrel barn | (to fill) | | | | |
| The Buffet | Gingerbread house | (to fill) | | | | |
| Corporate Pond | Glass pavilion on steel columns | (to fill) | | | | |
| The Nile | Papyrus reed boat | (to fill) | | | | |
| Circuit Lake | Capsule pod on its pad | (to fill) | | | | |
| Mount Olympus | Marble temple over the clouds | (to fill) | | | | |
The buildings above are today's code-drawn homes; each may change when its water is painted, but stays different from every other row.

### 7. Technique notes (Claude's side)
- **Cleaning:** everything the game draws itself (house, angler, rod, line, float, labels, frame) is cleaned out of a painting once; the cleaned source is kept in `art/`.
- **Light:** `blFaded` builds each painted layer per light step; the building and chair use the painting's own day-to-dusk and day-to-night colour change, measured from its versions near the shore (`blLandRatio`), so they darken exactly like the land.
- **Reflections:** from the land at each shoreline (`blShore`, `blReflect`), objects in front of the far shore at their own base, a bridge at one fixed line; the building mirrored at its posts' waterline in rippling strips (`blHomeRefl`); the sky and the moon's path mirrored where the land's reflection isn't.
- **Glow:** a pane mask made from the painting's bright window paper glows warm after dusk; lanterns light up from inside (screen blend) with a halo, a light pool and a reflection.
- **Cost:** one WebP atlas per water (about 1 MB with its building); measured by `__mapQC` (frame cost under 3.2× the median water).
## The Rockies standard (director, 2026-11-23: "Canadian Rockies is our most polished map, the new standard for all maps")
**Painted maps follow the painted-map standard above; the Rockies' rules on realism still apply to them (start from the real place, grounded and joined life, routines, nothing that doesn't belong). Code-drawn maps follow this section until they are painted.**
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
