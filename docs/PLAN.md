# Driftline plan (the one active work list)

The director's list of 2026-11-19 (60 points), sorted into batches by dependency and size. Every batch goes to all three test
builds, through the round checklist in CLAUDE.md, before the next one starts. Status per line: ☐ to do, ◐ in progress, ☑ done
(test builds), ✔ live. The release is **0.4.9** (new content). Numbers in brackets = the director's line numbers.

## Batch 1: bugs and small fixes (all platforms where they apply)
- ☑ [17] A fish eaten by a bigger fish stays anonymous ("something bigger ate your catch"); a high Fish Finder level may name it.
- ☑ [26] The fully upgraded radar never names species you haven't caught.
- ☑ [27] Shadows of hooked fish: one even tone, no lighter fins or patches.
- ☑ [30] Challenges: no "1" badge next to the "Live" tag.
- ☑ [31] Shinies: remove the sweeping shine band.
- ☐ [32] Fish Log shiny toggle on phones (exists on PC).
- ☑ [36] iPhone: re-reading patch notes is cluttered, hard to open and scroll.
- ◐ [37] iPhone: Settings from the top bar shows "Settings" twice as headers (not reproducible on the build: screenshot asked from the director).
- ☑ [39] Android: search needs press-and-hold to open; the keyboard covers the results and the typed text.
- ☑ [41] Android: a ready Weekly Quest also badges the Daily Tasks tab.
- ◐ [42] Android: Aquarium preview choppy (to do); Earning / Ready values overlap when numbers are large (☑ fixed).
- ☑ [43] Events: Calendar, Challenges and Derby tabs show the same content.
- ☑ [44] Trophy Room tiny when empty; check with fish in and out.
- ☑ [45] Skills: the "Looking for specializations?" line breaks the spacing.
- ☑ [46] Hints off leaves an empty round box at the bottom.
- ☑ [48] Rods: "Your rods" (not "Your rod") and only on the first tab.
- ☐ [56] PC full screen: the orange upgrade-count circle is clipped.
- ☐ [34] Setting: metric / imperial weights.
- ☐ [8] Aquarium: hide a decoration from view while keeping its bonus.

- ☑ [new, 2026-11-19] Phones: while reeling, the hint and Rest step aside (director: "too much ui covers the screen"; hint kept for the first 5 catches).

## Batch 2: the fight (one design pass, measured with a fight simulator)
- ☐ [9] "Heavy fish" message explained; an Angler strength stat; each water shows its fish strength range and where you stand.
- ☐ [22] New voyages raise how hard fish fight, up to a cap.
- ☐ [25] Perfect hook: less idle time for the fish.
- ☐ [33] Heavy and rare fish keep you still or take line even while you reel, at any gear level.
- ☐ [54] Target: a maxed mythic takes 30–60 s with the best gear; behaviours and rarities matter at every stage.
- ☐ [29] Rarer "eaten" events: the big fish pulls line out to its max, the fight restarts at full, a coin bonus on landing.
- ☐ [13] Oddities: shadows under water; they snag (no fight) and reeling too hard can snap the line.

## Batch 3: progression and economy
- ☐ [16] Next water needs 10 catches, +10 per voyage, capped at 50.
- ☐ [24] Rods cost Scales too, scaling with the rod.
- ☐ [23] Hybrids inside their normal weight range: value and aquarium income ×2 (common) to ×5 (mythic).
- ☐ [18] Titled shinies (ancestral, prismatic…) get real stat bonuses: several catch/economy buffs, more gold on later voyages, a boost to the tank's other fish.
- ☐ [19] Fish Nibbles: scrap fish for candy (odds by rarity, +2 shiny / hybrid / titled, max 7), feed a favourite in the Aquarium (drop animation, the fish swims up), passive income with diminishing returns, every 10 feeds a buff roll (10%, 50% at 30), half expire at voyage end, Fish Log shows candy, Trophy Room shows candy eaten.
- ☐ [12] Baits by fish: each fish has a favourite and least favourite bait (small effects); rarity-weighted prices; Epic+ favourites hidden until caught with it.
- ☐ [14] New rod attachments for the newer systems.
- ☐ [15] More skills and more ways to earn skill points.
- ☐ [11] Paths: 15 paths across every system, rarer mechanics deeper in; remove a choice; cost to change or remove rises with the feat's level; menu text fixed; reasons to return.
- ☐ [20] Voyage rework: up to 100 milestones, upgradeable end-of-voyage buffs (weight ranges, derby multipliers, streak buffs every 50/40/30/20/10 with ranks and cooldowns, many more), pearls harder per pearl within a voyage, pearl shop +1% gold / +1% XP (2 pearls a level, 100 levels), many one-level pearl relics; heavier late-game scaling.
- ☐ [52] Boardwalk: deeper and more varied; tickets first with occasional coin wins (never breaking pearls or the shop); maybe gamble with cooler fish.

## Batch 4: looks
- ☐ [10] Rod: gentle sway; the second hand turns the reel; left/right-handed setting; arm length and rod proportions.
- ☐ [50] Wizard hat effects redone.
- ☐ [57] Fish eyes: varied, blended into each fish.
- ☐ [59] Character models: new natural styles (keep the current ones), many more hair, face, nose, eye and mouth options.
- ☐ [1] More pet base colours: some in the shop, more as Boardwalk rewards.

## Batch 5: content
- ☐ [2] Oddities to 300 (memes, household objects, products, ancient and mythical treasures; one singing bass mount; some per water), rarities shown once found, conditions and odds on click, gold scaled to your highest water (a bit less in earlier waters), repeat finds worth more.
- ☐ [3] Amazon rainforest water (waterfalls, piranhas, arowana).
- ☐ [4] Cherry Blossom water (Japan, Mount Fuji, eels, carp, koi, anime-referenced fish).
- ☐ [5] Canadian Rockies water (sturgeon, trout, river monsters, clear water, a little syrup).
- ☐ [6] Florida Keys water (shallow saltwater sport fishing, chaotic Florida fauna).
- ☐ [7] Each new water at the standard (52 fish with meme/bonus/rarity split), placed where it fits; Hollow Trench stays last; stutter-tested and as lively as the others.
- ☐ [69] Five end-game waters, one unlocked per voyage after the first, outside normal progression, in this order: Animal Farm, Buffet, Corporate, Egyptian (Nile), Robot, Olympus/Mythos (the director lists six names for five slots: confirm).

## Older roadmap (still open)
- Lily polish: a soft rim light so her black coat reads at night; hats following her head tilt.
- Transfer safety net: ntfy.sh is a free relay (~250 messages/day/IP, files expire after ~3 h); move to a tiny own relay if it gets unreliable.
- Code tidy-up: fold the per-update files and the `extraActN` chain into feature files with one action registry, without changing saves.
- Accessibility: rarity shown by more than colour, reduced motion, bigger touch targets (director decision pending).
- Save size: keep codes compact.
