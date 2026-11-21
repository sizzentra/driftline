# Driftline map standard (decided with the director, 2026-11-21)

One job: what every water must have. Homes have their own standard (docs/HOME_STANDARD.md). Nothing here is built yet; it feeds the production queue (PLAN › Production queue, P4).

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

## Checked by tools (to build with it)
- Draws by day, dusk, dawn and night without errors; at least 3 moving things; a moment within 60 seconds; nothing drawn over the fishing area; frame cost under the limit; every event and special weather draws.
- Connection checks where a tool can see it: reflections present under objects on the water, no empty strips between layers at every screen size. The rest of rules 15–21 are judged by the director and Cam.
