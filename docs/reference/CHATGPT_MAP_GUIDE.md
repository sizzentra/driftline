# Driftline map guide for ChatGPT

Give this file to ChatGPT at the start of every map redesign, together with the filled-in prompt (CHATGPT_MAP_PROMPT.txt) and the reference pictures. It holds everything we learned on Cherry Blossom Lake (finished 2026-11-24), so each new map takes fewer rounds and has fewer errors.

---

## What Driftline is
A cozy 2D fishing game for phones and PCs. Every map ("water") is one wide scene seen strictly **from the side**: a far shore and sky at the top, a lake or sea across the middle and bottom, and on the left the player's building with a deck where the angler stands and fishes to the right. The game draws the angler, the rod, the line, the fish, the pet and all moving effects itself.

**How we work together:** you paint; Claude (the game's developer) cuts your paintings into the game, lights them for dawn, dusk and night, adds the reflections and the movement, and checks them on an iPhone and a PC. The director judges the result.

## The most important goal: every map must feel distinct
No map may look like a recolour or a rearrangement of another one. For each map, design these from that place, not from earlier maps:
- **The building and how it meets the water:** on stilts, floating, moored, on a rock ledge, on the shore, on ice, hovering. A new silhouette and a new kind of support every time.
- **The composition:** where the landmark sits (left, centre or right; far or near), what frames the scene (a tree, a cliff, a hull edge, or nothing), what fills the near corners (flowers, ice, coral, sand, rope, rails).
- **The palette and the best hour:** one time of day the map is made for (dusk, a storm, midnight, a golden morning).
- **One or two signature things that move:** something only this place has (a waterfall, lanterns rising, a geyser, swaying kelp). Paint them so they can be animated (see "Layers").
- **What doesn't belong:** never add things just because an earlier map had them.
Cherry Blossom Lake (the finished one) has: a tea house on red stilts, Mount Fuji far right with a torii and pagoda, a big cherry tree framing the top left, flowered stone corners, a waterfall. **Don't reuse any of those choices on another map.**

## Style rules for every painting
1. **Strict side view.** No three-quarter view, no perspective, no tops of things seen from above. A roof is a roof profile, a deck shows its front edge.
2. **Daytime only.** Neutral soft daylight. No dusk or night versions, no lit windows, no glowing lanterns, no light effects. (Separately painted dusk and night versions never line up and blur when blended; the game relights your day painting instead.)
3. **No reflections, no water effects, but still real painted water.** Don't paint mirrored images of the land or sky, ripple rings, wakes, splashes, shadows on the water, or sparkles: the game builds them exactly from your painting (a painted reflection layer sat 12 px off its objects). **But never flat solid colour either:** the water itself must look like water, with a depth gradient (lighter and hazier toward the far shore, deeper toward the viewer, clearer and lighter in the near shallows) and a soft, gentle surface texture of small waves across it, in the painting's brushwork. The game ripples that texture; a flat blue gives it nothing to work with.
4. **Soft, painterly, slightly faded colour.** Match the map painting's brushwork and saturation exactly. A first building painted bright, saturated and crisp looked pasted on; the softer, faded version blended in.
5. **Nothing the game draws itself:** no angler, rod, fishing line, float, fish, pet, people, text, labels, frame or border.
6. **Keep green out of the art** when you deliver on a green background: no green paint on edges, no green tint, no bright green moss right at an edge. Natural foliage is fine inside the picture, never touching the cut-out's edge.

## The scene layout (fixed by the game)
- **The far shoreline** (where the far land meets the water) sits at **42% of the picture's height** from the top.
- **The left side** of the near water is where the building stands. Keep important scenery out of the left quarter below the shoreline; the building covers it.
- **The fishing area,** from about 25% across to the right edge, below the far shoreline and above the bottom corners, stays **open water**: no islands, boats, rocks or plants in it. Fish and the float appear there.
- **The near corners** (bottom left and bottom right) may hold foreground (rocks, flowers, ice, rope); keep the bottom centre low and quiet.
- **The left part of the scene is cut off on wide screens.** Keep the landmark and the best details in the middle and right.
- **Aspect:** about 2:1 (we used 1680×845).

## Layers we need for each map
Deliver each as its own picture at the same size and alignment, on a flat pure #00FF00 green background (or transparent if you can):
1. **Land:** everything solid (far mountains, hills, shores, islands, trees, landmark, near corners), with the **sky and the water left empty** (green). The game shows its own sky, sun, moon and stars through it.
2. **Sky:** the sky alone (we may use the game's own sky instead).
3. **Clouds:** each cloud separate, so they can drift behind the land.
4. **Water:** the water surface alone: no mirrored land or sky, but with its depth gradient and soft wave texture painted in (never one flat colour).
5. **The signature motion pieces:** for example a waterfall's column on its own, so it can flow.
6. **The building with its deck and supports** (see below), as a cut-out.
7. **The chair** (see below), as a cut-out.
Make the layers from one master painting so they line up exactly.

## The building (the player's spot)
The building is the player's fixed home on this map. It is painted in the map's own style, but delivered as its own cut-out, because the game places it under the angler's feet on every screen shape.
- **Measuring stick: 1 AH = the standing angler's height** (we send angler_scale.png: the angler standing and sitting on a deck with lines at 1, 2 and 3 AH).
- **Size:** about 6 AH wide; 2.2–2.5 AH from the deck surface to the top; walls (or the lowest overhang) about 1.4 AH above the deck, so a standing angler fits under them.
- **The deck surface is one flat, level line** where the angler stands. Show the deck exactly from the side: its front edge, at most a very thin strip of its top.
- **The angler stands on the deck in front of the building's wall, near its right end.** To the right of the building, leave **an open stretch of deck about 1.5 AH long** where the chair goes; nothing tall right of the deck's end (the line goes out there).
- **Supports go straight down to the waterline and end there with a soft darker wet band.** About 0.8 AH from the deck down to the water. Paint no water around them.
- **On phones the building's left 40% is cut off,** so put its door, its lights and its best details in its right 60%.
- **Window paper or glass painted plain in daylight** (the game makes it glow at night); lanterns painted unlit.
- **Leave the deck empty:** no angler, seat, cushion or pet.
- **It must be a new kind of building for this place** (see "every map must feel distinct").

## The chair
A separate small cut-out the game places beside the angler; the angler sits in it when resting.
- A chair or seat that belongs to this map's place and culture, in the building's style and wood or material.
- **Strict side view facing right:** backrest on the left, open front on the right.
- **Proportions:** seat top about 0.25–0.35 AH above the floor, backrest top about 0.5–0.75 AH, seat depth about 0.4 AH; all legs end on one level line.
- No armrests that would block the arm holding the rod. No shadow, no floor.
- Painted large (about 60% of a 1024×1024 picture) on green.

## Checklist before you send anything
1. Strict side view; nothing seen from above.
2. Daytime only; nothing lit.
3. No reflections, ripple rings, splashes or water shadows, but the water is real painted water (depth gradient and soft wave texture), never flat colour.
4. Soft, slightly faded colour matching the map painting.
5. No angler, rod, line, fish, pet, people, text or frame.
6. Clean pure green background; no green on the art's edges.
7. The building: deck surface one level line, open deck on the right, supports ending in a wet band, best details in its right 60%.
8. The chair: facing right, legs on one level line.
9. Nothing in the fishing area; nothing reused from another map.
10. Tell us in a few lines how you matched the style and where the deck line is.

## Rounds
1. You paint the map (or we give you the director's picture to work from).
2. You split it into layers and paint the building and the chair.
3. Claude sends **one** list of fixes after a mock-up; you repaint once.
4. Claude puts it in the game and sends pictures to the director.
