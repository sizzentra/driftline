# Next round (director, 2026-11-18): start the moment the PC UI update is released

Platform notes: fix each item in the platform it belongs to (Platform ground rules in CLAUDE.md).

## Bug fixes
1. **Android:** the Aquarium is the only screen that lags while scrolling.
2. **Android:** reeling in storms badly hurts the frame rate.
3. **All (shared drawing):** the angler's left shoe is drawn behind; from this angle it is closer to the viewer and should be in front. Fix for every shoe.
4. **PC:** countdown numbers in Events make the text and the screen move and jitter at certain intervals. Check every menu with countdowns.
5. **PC:** a stutter every couple of seconds at Willow Pond, and also at Frostbite Lake.
6. **Android, upright:** some live events (seen with Market Rush) move the game frame as their counter ticks down.
7. **PC:** some live events change bar size while counting down. Bars must be a fixed size (nearly all status bars); only the words change.
8. **All:** the Ocean Sunfish's fins are not attached to its body.
9. **All:** otters at Stonebrook River move through the rocks; keep them separate.
10. **PC:** with hints off, a black dot stays at the bottom centre of the screen (maybe also an empty placeholder when there is no text).
11. **PC:** the Market Rush event popup doesn't show the coin icon properly.

## Quality of life
12. **Android:** wherever a bar scrolls left or right, add a slight indicator at the edge so players don't miss it.
13. **PC:** after Travel here on Waters, jump back to the game, or ask "Get to fishing" / "Stay in the menus".
14. **All:** show a hybrid fish's stat changes in the catch popup.
15. **PC (and check phones):** Bait should still be reachable from the fishing screen.
16. **PC:** "Your rod" becomes "Your rods": 3 presets picked from the Rod Rack, each keeping its attachments. An attachment can be on more than one preset at once.
17. **PC:** attachments on a preset are centred properly (they look off-centre when all are owned). Add a better way to list and add attachments to a preset.
18. **All:** bait that is best at one water costs in proportion to that water's economy, while staying fair. In the bait list those baits are grouped together, in the order the waters unlock.
19. **All:** remove the static sparkles from shiny fish; sparkles are animated and follow the fish sprite. Higher variants (prismatic and other high-end shinies) get distinct shading, and maybe different sparkle colours (light blue, purple, rainbow...).

## Map adjustments
20. **Aquarium:** scale the fish and decorations in the tank down slightly so each piece can be seen.
21. **Stonebrook River:**
    - Rework the environment and the water.
    - Remove the grass behind each pillar.
    - Maybe add a hydroelectric dam and/or a village in the background.
    - The boat in the background should be closer to, or tied to, the dock.
    - The waterwheel is a nice touch but could use a rework.

## Added by the director (2026-11-18)
22. **iPhone gets the relevant QoL too** (scroll indicators, performance, hybrid stats, bait access...), and **both phones get the modern PC look** in their own layers: teal = click me, gold = open now, the same navy panels and card style, and the same tidy-page decisions (each page in one place, clear explanations, no clutter). Design it per phone: no PC layouts copied as they are.
