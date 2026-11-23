# Driftline home standard (decided with the director, 2026-11-21)

**Pilot built (2026-11-21, test builds): Willow Pond, in `src/cv_homefmt.js`.** The other waters follow once the director approves the pilot.

One job: what every home is, how it is built, what the player can change. Part of the map standard (PLAN item D). The pilot (Willow Pond) is on the test builds for the director's judgement.

## Purpose
- **A home is your place** (the player's), **designed with and fitting its map**: its materials, colours and culture. Each water has its own home (the home is that water's signature); homes do not carry over between waters.

## The format (the same on every home)
- **Same placement and footprint** on every water; the map changes around the home, never the home's place.
- **Same standing surface** (height and width), so the angler and pets always stand right.
- **No shore:** the home stands on its own (director, 2026-11-21, after the pilot: the bank at Willow Pond didn't work; the home is all that needs to be there).
- **Pet spot 1** (favourite pet, beside the angler) and **pet spot 2** (companion), the same on every home.
- **A light spot** in the same place on every home.
- **Water rules:** supports fade into the water with ripples; floating homes (boats, platter, hover pad) **bob gently** with the waves.
- **A free zone above and behind the deck** for each home's own shape (sail, roof, arch), inside a set box that never blocks the casting water.

## What the player customises
- **6 features per home:** the **seat** on every home (resting sits the angler in it), plus **5 features made for that water from its description** (director, 2026-11-22: only the seat is shared; Willow Pond keeps light, deck, posts, rail, canopy). One feature per home carries its light at night. A home may have a 6th made feature where one part would mix two things (director, 2026-11-23: the Rockies "door and windows" became Door and Windows). **Colours per part:** each feature offers only the colours real ones come in (`pal`), per style where styles differ (`palS`: a sod roof grows grass, a tin roof is painted any colour). Every home's features and styles: `docs/HOME_DESIGNS.md`. Decorations no longer exist.
- **3 real styles per element**, each fitting the map (no neon at Willow Pond, no rustic lantern at Circuit Lake). **Nothing is no choice:** an element that offers \
- **One colour list per home, at least 16 colours, shared by every feature** (director, 2026-11-21: so parts can be set to the same shade), taken from the water's palette in `docs/MAP_THEMES.md`; phones show 8 per row (2 full rows).
- **No unlocking:** as soon as a water is reached, its home and every style and colour are free to use.
- Each water keeps its own choices.

## Side-view design step (director, 2026-11-21: art kept being drawn from the front)
Before any piece of art is drawn:
1. **Describe its side silhouette in one line** (for example: a pergola from the side is two posts, a beam, and the cloth as a thin sagging line on top with short ends hanging straight down).
2. **The director approves that description** (or a rough sketch) during the idea queue.
3. **Only then is it drawn,** and the drawing is judged against that description. Anything that shows a front or top view (scallops facing you, curtains hanging toward you, a roof seen from below) is redone, not patched.

## Drawing
- **Glow Diorama at medium detail:** the maps' lighting language (rim light, soft shading, a glowing light fixture, water contact), fine textures hinted rather than drawn piece by piece.
- **A clear silhouette and contrast against its map** (never grey on grey or white on white).
- **Lit by the map's light** (the same sun, dusk and night colours as the scenery).
- **The angler and pets always stand out** more than the home.

## Performance
- **The home is a stored picture,** built from its parts, repainted only when the player changes an element (and in small steps while the light changes at dawn and dusk).
- **Drawn live each frame:** only the light fixture's effects (glow, flicker, light pool, reflection), the water ripples (drawn behind the supports, sized to each), the bob (the stored picture pasted a little higher or lower) and the pets.

## The Home page
- **A close-up framed on the home** (the same box on every home), drawn at its own size: the home from a stored picture at close-up resolution, the angler, rod and pets drawn sharp, over a soft copy of the water behind (director, 2026-11-21: the stretched scene was blurry).
- **6 tabs named for that home's features;** every tab laid out the same way: styles, then colours.

## Removed
- **Decorations** and the **cozy bonus**, taken out of saves when they load; dock style prices. Nothing else in a save (coins, levels, fish, rods, pets) is touched. Test notes say so in one line. Tide Pass levels, feats and quests that used decorations get new rewards.

## New homes
- **Stonebrook River: a mill landing** (stone and timber by the watermill, with a millstone), so it no longer shares Willow Pond's dock.

## Checked by tools (to build with it)
- Every home fills every part of the format; 6 features (7 where a part splits in two), light and seat included; every style draws with every colour; pets and the angler stand on the surface; the home picture is repainted only on a change.

## The Rockies standard for homes (director, 2026-11-23: the log cabin is the new standard)
Reference: the Canadian Rockies log cabin (src/cw_homes.js `hfMake('rockies')`, docs/reviews/rockies.md).
- **One base building per water** that fits its theme (the Rockies: a log cabin). The choices change aspects of it (walls, roof, chimney, porch, door, windows, seat), never swap it for a different concept or add loose props. Every option is a real-life choice for that place; a choice never mixes two parts (door and windows are two parts).
- **Colours real ones come in,** per part and per style (`pal`, `palS`); a style is never named after a colour; seats too (`seatPal`).
- **Proportions:** the building is wide (at least 2.9 times as wide as its walls are tall), walls about 1.3 times the angler's height; on narrow screens it runs on past the screen edge instead of squeezing.
- **It belongs to the place:** it connects to the land (a bank or shore behind, a ledge or footing under it), never a box floating in the water.
- **Built, not drawn:** real foundations; posts meet the deck's underside, braced, strapped, wet at the waterline, carrying straight on under the water; no gaps anywhere (log ends, corners, posts, deck, bank, water); a stone base reaches under the log ends.
- **Front to back as you would see it:** a rail stands in front of the angler, the chair and the pets; a porch roof is in the roof's material and shades the wall, so it reads as a roof.
- **Details are real:** chimneys keep their stones inside the stack, a stovepipe has joints, a collar and a cap; a sod roof has bark, turf and a turf log; flowers have petals; the chair's parts all join.
- **Living:** windows glow at night, the chimney smokes, the resting rod never crosses a cover, the seat sits at the deck's edge close to the water.
- **Checked in every combination:** `__hfAll` (every style pair of the parts that touch and every colour of every style, fishing and resting) and `__hfOne` at full size, phone and PC, day and night.
