# Driftline plan (the one active work list)

The director's list of 2026-11-19 (60 points), sorted into batches by dependency and size. Every batch goes to all three test
builds, through the round checklist in CLAUDE.md, before the next one starts. Status per line: ☐ to do, ◐ in progress, ☑ done
(test builds), ✔ live. The release is **0.4.9** (new content). Numbers in brackets = the director's line numbers.
Finished work leaves this list once it is live: batches 1–2 (live since 0.4.8.9) are in `docs/HISTORY.md`.

## Open now (the one place for open work and decisions; CLAUDE.md only points here)
**Sweep tool bookmark** (director, 2026-11-20: tool problems wait here; the game findings from the same runs were fixed first). From the real-phone runs on build 1946:
- ☐ iPhone 16 Pro Max (Safari view from Tester tools): 56 min for 29 checks (Pixel: 6.7 min for 28). The page reloaded (out of memory) during the test suite at 956×440, Content 440×460, Content (extreme) 667×375 and Fish decorations, even after the #151 memory fix. Likely cause: each check loads a whole 2.8 MB game into a frame inside the page, and Safari does not hand back a closed frame's memory quickly. Ideas: open each check as its own page instead of a frame (a fresh page frees everything), or run fewer, smaller checks on iPhone.
- ☐ iPhone: time-outs (Content 667×375 after 400 s; layout/search/quests after 120 s). The iPhone runs about 8× slower than the Pixel here, so the time limits made for a PC are too short. Ideas: per-device limits, or measure the phone first and scale.
- ☐ The sweep in the Safari view uses its own storage, so phones always test a fresh save, not the tester’s own (that is useful, but the report should say so). Locally the sweep only tests Claude’s well-stocked save: add a fresh-save pass to the local sweep (the failures below all came from a fresh save and passed on Claude’s save).
- ☐ Re-run Run every check on both phones once the tool is fixed, and read the game findings (director, 2026-11-20). Fixes from the first reports (build 2035): Bounties sideways row confirmed fixed on the iPhone (director); Market Rush with the Merchant Path and the phone Bait card counted as fixed until the next reports (Market Rush can only be tested while one is on).
- ☐ The Pixel reports its real screen as 924×412 (the checks used 915×412 for Android before); the sweep now uses the real size on phones. Keep.
**Shelved for the next build** (director, 2026-11-20: "we want them in the build, but shelf them for now")
- ☐ Fishmonger's Gamble, empty cooler, phones only: idle picture row 🐟 ⚖️ 🪙 above "Your cooler is empty…", like the other cards' idle art (before/after shown 2026-11-20, pictures in `tools/shots/gamble/`). PC stays as it is (no room: the picture pushed the message out of the card).
- ☐ Fishmonger's Gamble after a play (Android, likely iPhone): the result line pushes the 4 fish buttons down so the card is taller than the screen, and the centred result line sits over left-aligned buttons. Options to show the director first: a shorter result line, or the buttons in two columns.
- ☑ (fixed with the Boardwalk cards, 2026-11-20) PC Boardwalk › Games at 1920×1080 (test build): Mystery crates card text overlaps ("Small crate" over the description) and the Legendary crate row spills below the card. A bug, not a look choice: fix it with this batch, check whether live has it too.

**Found by the content check, first run (2026-11-20; all confirmed by measuring and pictures)**
- ✔ **Live and test, PC full HD:** Rods › "In your hands" was squeezed to the screen and hid its Upgrade button and attachment slot. Fixed in the test builds and live as hotfix 0.4.8.9.5 (PC only, 2026-11-20, director: "Push it live. It looks great"). Pictures: `tools/shots/rodslot/`.
- ☑ (fixed 2026-11-20: cards grow with their content, the games area scrolls) **Test, PC 1920×1080, Boardwalk › Games:** the cards have one fixed height, so content spills: Treasure chests' "Open" button sits under the Counter specials section (can't be clicked); Coin flip's 50% button and the Gamble fish buttons hang over the card edge; after a game is played, results overlap buttons on most cards (Duck pond, Scratch card, Claw machine, Gamble, Treasure chests). One cause, one fix (cards grow with their content). 1440×900 and 1024×640 are fine.
- ☑ (fixed 2026-11-20: milestones one per row) **Test, PC all sizes:** Map › Set sail again › Voyage milestones are squeezed into a narrow column (one word per line) and "after N voyages" is printed over the descriptions (like the old Boons bug, #114).
- ☐ **Decision (rule 4, pictures in a group):** Boardwalk › Mystery crates has no picture on every platform (7 of 9 game cards have one); Higher or lower loses its picture after a game on PC. Picture or listed exception.

**Look items noted, not fixed** (2026-11-19 outsider review)
- ☐ The empty Cooler page is mostly blank space.
- ☐ The aura previews in the Wardrobe › Tide Pass tab are small.

**Parked fixes** (undone with phase 2 on 2026-11-20; redo when the director wants)
- ☐ A brand-new save can lose some Wisdom Pearls on its first reload (`fresh()` has no `pearlV`, #121).
- ☐ Three functions nothing calls: `boardwalkBanner`, `clawHTML`, `pathOn` (#124).
- ☑ Flaky QA test: a random shiny broke the batch 5 waters price limit (#127): fixed 2026-11-20 (the test compares a plain fish).

**Needs the director's eye**
- ☐ Aquarium speed-up: drawing the fish costs ≈0.5 ms each (24 fish ≈ 10 ms, forced-sync test; phones not measured). The fix (cached tail-wag frames per fish) changes the animation slightly.

**Decisions waiting on the director**
- Bigger tap targets (ours 32–40 pt vs 44 pt guidance) · text size · left-handed / menu side · colour-blind help · a real tablet layout · the Trophy Room name · whether the aquarium empties on a new voyage.

## Checks overhaul (director, 2026-11-20: make every check as efficient as the content check)
- ☑ One-click sweep (`tools/sweep.html`): every automatic check, every build and size, one report, test save put back; covers the start-up check (also with every Path) and the test-tool problems (no collisions, no menu-open hang).
- ☑ Options stay put (`__snapQC`, in the sweep): picking any option on any page never moves it (C13).
- ☑ Strength table (`__strTable`) and creature outlines (`__creatureBox`): measuring tools for balance and fish pictures.
- ☑ Redundancy counter (build.ps1, 2026-11-20): unused functions refused; wrap layers, force-hide rules, polling timers and watchers per build may only go down (`tools/redundancy_baseline.json`, lowered by the build itself); proven by planting each of the six once; 5 unused functions deleted.
- ☐ Content recipes for fish, oddities, items and waters (every new thing has all its parts: name, art, lessons, search, notes).
- ☐ Saves check (old saves load, migrate keeps everything, save codes round-trip at extreme sizes).
- ☐ Speed budgets per page and per frame, checked by the sweep.
- ☐ Balance targets checked automatically (`__bal` against written targets).

## System clean-up (from the 2026-11-20 audit; going over each with the director)
- ☑ A. Redundancy counter (above). Starting numbers: PC 293 wrap layers, 67 force-hide rules, 31 timers, 16 watchers; phones 322 / 82 / 33 / 18.
- ✗ 1. Picture comparisons: dropped (director, 2026-11-20: “We will judge and tell you when necessary”; it adds work to every round and they would rather judge looks themselves). Look changes still go to them with before/after pictures, as before.
- ☐ B. (overnight project, director 2026-11-20: done while the director and Cam are away; Claude reminds them now and then) Untangle one system at a time, pages first (choices offered: files named by what they do, the five most-opened pages first, one test build per batch of five; estimate 15–25 h of work in about 5 batches plus 3–5 h for shared layers, batch 1 about 4–6 h): fold wrap layers into each page’s own code, files named by what they do; no look change (checked by the existing checks, with before/after pictures of each untangled page for the director). (Ask: OK to move and rename files?) Measured: on phones about 90% of opening Settings is the layers, not the page.
- ☑ C. (first version on the test builds, 2026-11-20: docs/TEXT_STANDARD.md drafted, length limits approved; phone wording written at the source; text checks proven; tips and pop-ups shortened, list in docs/TEXT_CHANGES_2026-11-20.md) Text standard and check: tone, length per place, phone words (“Click or press Space” still in shared text), apostrophes, spoilers in notes. (Ask: draft the tone from the existing jokes, or the director writes it?)
- ☐ D. Map standard: what every water needs (from C35), added to the map check. (Ask: OK on the list once drafted.)
- ☐ E. Docs tidy: SYSTEMS_MAP split into map and log; CLAUDE.md trimmed.
- ☐ 2. Bug log upgrade: fixed labels checked by a tool; “introduced in” and “fixed in”.
- ☐ 3. “Report a problem” button in the test apps. (Ask: what it includes, where it sits.)
- ☐ 4. Guided real-phone tap check. (Ask: 2 or 5 minutes; every build or before a release.)
- ☐ 5. Rest of the checks overhaul (saves, speed budgets, balance targets). (Ask: target numbers.)
- ☐ F. Flavour text coverage (director, 2026-11-20): every kind of flavour text in the game (fish notes, item and oddity blurbs, quips, toasts, pet lines, loading and empty-page lines, catch cards) listed in one place, each with its rules (tone, length per place, spoilers, phone words) and a check that every item has its text and that the text follows them. Builds on C.
- ☐ G. PC review (director, 2026-11-20): a big conversation with the director about how dated the PC systems and design are next to the phone versions. Claude prepares a side-by-side (every page and system: what phones have that PC lacks, older PC layouts and code, measured differences), then we decide together what PC gets.
- Order (director, 2026-11-20): C, D, E, 4, 5, F, G, then B (overnight), then the report-related items last: 2 (bug log), 3 (Report a problem button) and the Sweep tool bookmark (top of Open now). Nothing jumps ahead of its place.

## Batch 6: the director and Cam's list (2026-11-20, test builds; 0.4.9)
Their words, sorted by area. ⚑ = a number or look the list leaves open: Claude builds it as asked and flags it (Feel call / suggested numbers) for the director and Cam to tune. Order of work: text and small fixes → UI → fishing and fights → economy → art and maps.
**Text and small fixes**
- ☑ C1 Non-fish catches: "Tap to dismiss" (phones) / "Click to dismiss" (PC), not "tap anywhere else to store in cooler".
- ☑ C2 Cast power text stays "cast power" over a hotspot; only its colour changes to the hotspot's colour.
- ☑ C3 Bites: "Reeled in early" and "Missed a bite" only. A missed bite keeps the line out; after 5 missed bites, reel in.
- ☑ C4 Stickleback flavour text: "This is how you remind me..."
- ☑ C5 Oddity on the line: just "Dead Weight" or "Snagged!".
- ☑ C6 Rising temper: "Careful!".
- ☑ C7 Running fish: "It's running!".
- ☑ C8 Strong fish: never "heavier"; "Prepare for a fight, this fish is strong!"; only at 10+ above your strength: "Good luck, this fish is out of your league!" (no number otherwise).
- ☑ C9 Heavy fog: "Heavy fog obscures fish, even the fish don't know if it's day or night." Weather pop-ups can be switched off in Settings.
- ☑ C10 Lily is a dog: no purring (done); on her back for belly rubs her paws keep the right orientation (paws flop over at the wrist, white tops with toe lines; first version, Cam to judge).
**UI**
- ☑ C11 "Scrap all" for Nibbles, like Sell all, with the same filters.
- ☑ C12 Colour choices: a highlighted box around the chosen colour, not the whole preview lit.
- ☑ C13 Customization (face styles first, then every customization menu): the menu never snaps or moves when an option is picked. One shared rule holds the tapped option in place (bo_guard04); PC preview bars keep a fixed slot; previews scroll only when hidden; `__snapQC` checks every page (0 of 175 taps move).
- ☑ C14 Cooler: sort by sell value, aquarium bonus, species, most/least recent; most recent after every restart, otherwise remembers the last choice.
- ☑ C15 Phones: a tab on the top bar (next to Settings) to switch between Aquarium and Cooler while in either.
- ☑ C16 Bait: every section and sub-section sorted by purchase price; "Everyday Bait", "Water Baits" and "Favourite Foods" can be folded, and the page opens folded.
- ☑ C17 Phones, Aquarium: no "bigger tank" benefit text; "How the aquarium works" adds "Increase your tank size for more fish, more buffs, and more income!"; the button reads "Expand Tank · price" with small "Next expansion: X fish" under it.
- ☑ C18 Treasure chests pop-up: the three chests centred (the outer two sit at the frame edge).
- ☑ C19 A big fish that has eaten smaller fish may take the cooler past its limit (the extras still go to the cooler).
**Fishing and fights**
- ☑ C20 A running fish turns to face the other way (fish only; never oddities or objects).
- ☑ C21 Jumps: one fluid motion out of the water, tilting down back in with a splash; a wind-up first (the shadow sinks, then comes up) as a warning. ⚑ timing (first version; ⚑ Feel call: numbers at the top of the fight constants in c_logic.js)
- ☑ C22 A predator eating a smaller fish takes line out gradually for a few seconds, unstoppable (can break the line), distance by rarity (maximum only for mythics), never snapping to the end. ⚑ distances (first version; ⚑ Feel call: numbers at the top of the fight constants in c_logic.js)
- ☑ C23 Letting go of a running fish: fish over 5 lb take line out but tension drops at once; reeling on, tension builds slightly faster and the fish takes no line. ⚑ rates (first version; ⚑ Feel call: numbers at the top of the fight constants in c_logic.js)
- ☑ C24 Second wind: a tiring fish's fight drops more slowly while its temper is high, and if temper stays too high its fight can rise again, a limited number of times by rarity (common 1, uncommon 2, …); 15% chance for common/uncommon, 30% for the rest; "Second wind!" shows briefly. ⚑ thresholds (first version; ⚑ Feel call: numbers at the top of the fight constants in c_logic.js)
**Economy and progression** (numbers are suggestions for the director and Cam)
- ☑ C25 Prestige: remove the "Boardwalk counts for at most a quarter" limit.
- ☑ C26 Deep Cooler boon: +1 cooler space every time you gain cooler space (instead of a flat +1).
- ☑ C27 Nibbles work for all fish of the same rarity.
- ☑ C28 Aquarium feeding: fish swim up to eat; each feed 20% chance a fish's buffs improve slightly (not its income), 5% chance of more income plus another stat. ⚑ sizes (first version; ⚑ Feel call: numbers in ce_nibbles.js FEED_* / c_logic.js HOT_*)
- ☑ C29 Hotspots revamp: colour by minimum rarity (uncommon most common … legendary rarest), better hybrid/shiny/titled odds, rising sparkles for a guaranteed shiny, every colour clearly readable. ⚑ odds and colours (first version; ⚑ Feel call: numbers in ce_nibbles.js FEED_* / c_logic.js HOT_*)
- ☑ C30 Angler strength: a little harder to reach, a few more strong fish when first entering a water, max strength lines up with the hardest waters, some strength held in a boon, strength purchases cost a bit more. ⚑ numbers (first version; ⚑ suggested numbers: Line levels and prices in b_data.js, Strong Arms 2% a rank, LOC_BASE 1.2, LOC_VOY .15 a voyage up to 10)
- ☑ C31 Water unlock coins scale up with voyages, and a slightly higher barrier from the start. ⚑ numbers (first version; ⚑ suggested numbers: Line levels and prices in b_data.js, Strong Arms 2% a rank, LOC_BASE 1.2, LOC_VOY .15 a voyage up to 10)
**Art and maps** (no cop-outs: every new map at the standard of the old ones)
- ☑ C32 Hair: curly back to how it was; no hair through hats; light texturing instead of a painted-on look. Curly is the hand-drawn 0.3.3.1 clusters again (restored from git); under a hat hair is cut at that hat's own lower edge (`hatClipY`, measured from the hat drawing) and big hair is pressed to volume 1.1; 13 fine strands per style. ⚑ look (texture strength, how much afro shows under a hat). Check: `__qa` C32 (proven).
- ☑ C33 Cherry Blossom Lake: wood and metal colour/material editable like every other dock; trees with more distinguishing features, petals resting and drifting on the lake, a nicer temple on shore, fake koi replaced by ducks and water lilies, Mount Fuji further away and larger with other mountains around; full quality pass. Done as asked (cn_waterart.js); the bridge offers wood and Lacquer. ⚑ look (all of it is a first version: Fuji size, tree shapes, pagoda, duck count).
- ☑ C34 Canadian Rockies (Cam): beavers (like Stonebrook's otters) and a beaver dam with a flowing river/waterfall; crystal-clear water showing rocks and weeds on the bottom; a moose; a Canadian flag by a reworked log cabin; Canadian Shield and Rockies close together; more flora and fauna (Canada geese); a fishing canoe with a nondescript angler; clear starry nights; a customizable home. Done as asked; the ledge offers wood and Canoe paint (a canoe on the ledge). ⚑ look (the river is only the waterfall: a river running down from the peaks read as smoke against the sky).
- ☑ C35 Every new map (the 4 new + 6 end-game waters): more populated, functional customizable homes, better effects, occasional map-specific animations, full polish. Every new home offers wood (wooden homes) and a named paint; every map gained shore/water life and one moment every 21-61 s (list in cn_waterart.js and SYSTEMS_MAP); Olympus clouds redone. ⚑ look. Check: `__qa` C33-C35 draws every scene through every moment by day and night and every home in all 72 looks (proven).
- ☑ C36 Fix the seahorse sprites (added by the director, 2026-11-20). Need data if the problem is not obvious on sight: which seahorse, which water, what looks wrong. Done: it had its seahorse drawing, but fish pictures were sized by width, so tall creatures (seahorse, leafy sea dragon, manta) were cut to a strip; they now fit by their real height.

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
