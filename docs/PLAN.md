# Driftline plan (the one active work list)

The director's list of 2026-11-19 (60 points), sorted into batches by dependency and size. Every batch goes to all three test
builds, through the round checklist in CLAUDE.md, before the next one starts. Status per line: ☐ to do, ◐ in progress, ☑ done
(test builds), ✔ live. The release is **0.4.9** (new content). Numbers in brackets = the director's line numbers.
Finished work leaves this list once it is live: batches 1–2 (live since 0.4.8.9) are in `docs/HISTORY.md`.

## Open now (the one place for open work and decisions; CLAUDE.md only points here)
**Shelved for the next build** (director, 2026-11-20: "we want them in the build, but shelf them for now")
- ☐ Fishmonger's Gamble, empty cooler, phones only: idle picture row 🐟 ⚖️ 🪙 above "Your cooler is empty…", like the other cards' idle art (before/after shown 2026-11-20, pictures in `tools/shots/gamble/`). PC stays as it is (no room: the picture pushed the message out of the card).
- ☐ Fishmonger's Gamble after a play (Android, likely iPhone): the result line pushes the 4 fish buttons down so the card is taller than the screen, and the centred result line sits over left-aligned buttons. Options to show the director first: a shorter result line, or the buttons in two columns.
- ☐ PC Boardwalk › Games at 1920×1080 (test build): Mystery crates card text overlaps ("Small crate" over the description) and the Legendary crate row spills below the card. A bug, not a look choice: fix it with this batch, check whether live has it too.

**Found by the content check, first run (2026-11-20; all confirmed by measuring and pictures)**
- ◐ **Live and test, PC full HD:** Rods › "In your hands" was squeezed to the screen and hid its Upgrade button and attachment slot. Fixed in the test builds (2026-11-20) and in hotfix 0.4.8.9.5 (PC only), check copy at /driftline-test/hotfix/; waiting for the director's check on PC and "Push it live". Pictures: `tools/shots/rodslot/`.
- ☐ **Test, PC 1920×1080, Boardwalk › Games:** the cards have one fixed height, so content spills: Treasure chests' "Open" button sits under the Counter specials section (can't be clicked); Coin flip's 50% button and the Gamble fish buttons hang over the card edge; after a game is played, results overlap buttons on most cards (Duck pond, Scratch card, Claw machine, Gamble, Treasure chests). One cause, one fix (cards grow with their content). 1440×900 and 1024×640 are fine.
- ☐ **Test, PC all sizes:** Map › Set sail again › Voyage milestones are squeezed into a narrow column (one word per line) and "after N voyages" is printed over the descriptions (like the old Boons bug, #114).
- ☐ **Decision (rule 4, pictures in a group):** Boardwalk › Mystery crates has no picture on every platform (7 of 9 game cards have one); Higher or lower loses its picture after a game on PC. Picture or listed exception.

**Look items noted, not fixed** (2026-11-19 outsider review)
- ☐ The empty Cooler page is mostly blank space.
- ☐ The aura previews in the Wardrobe › Tide Pass tab are small.

**Parked fixes** (undone with phase 2 on 2026-11-20; redo when the director wants)
- ☐ A brand-new save can lose some Wisdom Pearls on its first reload (`fresh()` has no `pearlV`, #121).
- ☐ Three functions nothing calls: `boardwalkBanner`, `clawHTML`, `pathOn` (#124).
- ☐ Flaky QA test: a random shiny breaks the batch 5 waters price limit (#127).

**Needs the director's eye**
- ☐ Aquarium speed-up: drawing the fish costs ≈0.5 ms each (24 fish ≈ 10 ms, forced-sync test; phones not measured). The fix (cached tail-wag frames per fish) changes the animation slightly.

**Decisions waiting on the director**
- Bigger tap targets (ours 32–40 pt vs 44 pt guidance) · text size · left-handed / menu side · colour-blind help · a real tablet layout · the Trophy Room name · whether the aquarium empties on a new voyage.

## Batch 3: progression and economy
- ☑ [16] Next water needs 10 catches, +10 per voyage, capped at 50.
- ☑ [24] Rods cost Scales too, scaling with the rod.
- ☑ [23] Hybrids inside their normal weight range: value and aquarium income ×2 (common) to ×5 (mythic).
- ☑ [18] Titled shinies (ancestral, prismatic…) get real stat bonuses: several catch/economy buffs, more gold on later voyages, a boost to the tank's other fish.
- ☑ [19] Fish Nibbles: scrap fish for candy (odds by rarity, +2 shiny / hybrid / titled, max 7), feed a favourite in the Aquarium (drop animation, the fish swims up), passive income with diminishing returns, every 10 feeds a buff roll (10%, 50% at 30), half expire at voyage end, Fish Log shows candy, Trophy Room shows candy eaten.
- ☑ [12] Baits by fish: each fish has a favourite and least favourite bait (small effects); rarity-weighted prices; Epic+ favourites hidden until caught with it.
- ☑ [14] New rod attachments for the newer systems.
- ☑ [15] More skills and more ways to earn skill points.
- ☑ [11] Paths: 15 paths across every system, rarer mechanics deeper in; remove a choice; cost to change or remove rises with the feat's level; menu text fixed; reasons to return.
- ☑ [20] Voyage rework: up to 100 milestones, upgradeable end-of-voyage buffs (weight ranges, derby multipliers, streak buffs every 50/40/30/20/10 with ranks and cooldowns, many more), pearls harder per pearl within a voyage, pearl shop +1% gold / +1% XP (2 pearls a level, 100 levels), many one-level pearl relics; heavier late-game scaling.
- ☑ [52] Boardwalk: deeper and more varied; tickets first with occasional coin wins (never breaking pearls or the shop); maybe gamble with cooler fish.

## Batch 4: looks
- ☑ [10] Rod: gentle sway; the second hand turns the reel; left/right-handed setting; arm length and rod proportions.
- ☑ [50] Wizard hat effects redone.
- ☑ [57] Fish eyes: varied, blended into each fish.
- ☑ [59] Character models: new natural styles (keep the current ones), many more hair, face, nose, eye and mouth options.
- ☑ [1] More pet base colours: some in the shop, more as Boardwalk rewards.

## Batch 5: content
- ☑ [2] Oddities to 300 (memes, household objects, products, ancient and mythical treasures; one singing bass mount; some per water), rarities shown once found, conditions and odds on click, gold scaled to your highest water (a bit less in earlier waters), repeat finds worth more.
- ☑ [3] Amazon rainforest water (waterfalls, piranhas, arowana).
- ☑ [4] Cherry Blossom water (Japan, Mount Fuji, eels, carp, koi, anime-referenced fish).
- ☑ [5] Canadian Rockies water (sturgeon, trout, river monsters, clear water, a little syrup).
- ☑ [6] Florida Keys water (shallow saltwater sport fishing, chaotic Florida fauna).
- ☑ [7] Each new water at the standard (52 fish with meme/bonus/rarity split), placed where it fits; Hollow Trench stays last; stutter-tested and as lively as the others.
- ☑ [69] Six end-game waters (decided 2026-11-19: the director listed six themes for "5" slots and asked me to decide; all six stay, one more unlocks with each voyage from the 2nd to the 7th), outside normal progression, in this order: Animal Farm (voyage 2), Buffet (3), Corporate (4), Nile / Egyptian (5), Robot / cyberpunk (6), Olympus / Mythos (7). Working names: Animal Farm, The Buffet, Corporate Pond, The Nile, Circuit Lake, Mount Olympus.

## Added by the director during the big patch (2026-11-19)
- ☑ Tide Pass overhaul: 100 levels in 5 chapters, Pass-only auras / bobbers / lines / pet colours, pearls and Boon points, showcase.
- ☑ PC display: interface size by window (Auto, 85–200%), picture quality, viewport units undo the zoom (pc/ui_display.js).
- ☑ Visual originality pass: own platform per new water, water-specific fish features, varied body plans, per-oddity details.
- ☑ Real aquarium sizes and depth; hair rebuilt (`ct_hair.js`); build silhouettes.
- ☑ Batch 6, the fight meta: fish must be tired out (FIGHT_T by rarity), tension floor in runs, rare/epic surges; holding through runs loses rare+ even maxed. Caps: oddities 20%/cast, hotspots ×4, shiny 15%.

## Older roadmap (still open)
- Android native app (shelved by the director 2026-11-19, "later in the roadmap for sure"): a thin WebView wrapper like the PC desktop app, loading the Android build from the site (patches stay instant, the app shell rarely changes); true full screen, landscape lock, 60 Hz request, Back button, keep-awake, vibration; save moved once with the transfer code. Not a TWA (needs the domain root for Digital Asset Links). Needs the Android build tools (~1 GB, director's OK) and later optionally a Play Console account. Goal: Android as reliable as iPhone.
- Lily polish: a soft rim light so her black coat reads at night; hats following her head tilt.
- Transfer safety net: ntfy.sh is a free relay (~250 messages/day/IP, files expire after ~3 h); move to a tiny own relay if it gets unreliable.
- Code tidy-up: fold the per-update files and the `extraActN` chain into feature files with one action registry, without changing saves.
- Accessibility: rarity shown by more than colour, reduced motion, bigger touch targets (decision: see "Open now").
- Save size: keep codes compact.

## Ideas (nothing decided; moved from CLAUDE.md 2026-11-20)
- **Cam's concepts:** per-water events with a gameplay hook on one shared event system; a backyard pond (breeding, after the trophy room).
- **Friends without accounts:** visit a dock from a code, send gifts/fish by code, a weekly friends' derby leaderboard.
- **Seasonal and live content:** holiday decorations, limited-time fish, weekend derbies, seasonal waters.
- **More personal gifts** using the Lily pattern.
- **New places:** a deep-sea boat trip, a night market, a secret pond behind a feat chain.
- **Cozy activities:** cooking your catch for short buffs, a grumpy lighthouse keeper story, boat upgrades.
- **Aquarium:** fish that interact, themed tanks with bonuses, visitors who comment.
- **More Boardwalk games,** kept light and fair.
- **Optional cloud backup** via a code.
- **Patch test checklist** (archived by the director 2026-11-20): a per-patch list of what to try for each change, with iPhone / Pixel / PC ticks, so it's clear when a test build is ready to go live. Overlaps with the test card the testers already get (one short line per change); revisit only if the director asks.
- *(Removed: "controller support on PC, haptics on phones": already in the game since 0.3, `src/k_controls.js` (gamepad: A/Cross casts, right trigger reels; phone vibration on bite, near-snap and catch, Android only because iPhone browsers can't vibrate).)*
