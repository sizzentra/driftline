// PC test notes (preview builds only; the live game never shows them). One short line per change in the next test build, curly
// apostrophes only. Released notes live in notes_release.js.
const TEST_NOTES={v:'test', label:'Test build · PC', name:'0.4.9 big patch, part 3: everything in', items:[
  'Paths (15, ranks I–V, Remove + fee on each fork), Prestige: Pearl shop, Boons, 32 milestones, 21 relics.',
  'Boardwalk: Fishmonger’s Gamble and Treasure chests. Tide Pass: 100 levels, chapters, exclusives (Wardrobe › Tide Pass exclusives).',
  'New waters: Cherry Blossom (after Stonebrook), Rockies (after Frostbite), Keys (after Coral), Amazon (after Brine Shelf). End-game waters open by voyage (Stats › tester tools can add voyages).',
  '300 oddities: rarity and odds show only once found (click a found one).',
  'Looks: reel hand + left-handed (Settings › Display), Natural face + new hair/noses/mouths/eye shapes (Wardrobe), new fish eyes, wizard hat, pet colours.',
  'Fight rework: fish must be tired out; holding through rare runs snaps the line. Times with maxed gear: ~2.5 s common to ~36 s mythic.',
  'PC display: try a big window or full screen on a 1440p/4K monitor; Settings › Display › Interface size and Picture quality.',
  'NEW in this build: aquarium fish show real sizes and depth; hair rebuilt with volume (all 20 styles); body builds have distinct silhouettes; smaller noses on the Natural face.',
  'Deep QC round: 30 fish renamed so no two share a name; attachment stats no longer read “undefined”; oddity names wrap on small PC windows.',
  'Second QC round (looks): the Tide Pass page shows this chapter’s exclusives as pictures plus progress for every chapter; a new Wardrobe tab to wear auras, bobbers and lines; Paths is shorter and uses two columns on wide screens; path fees are round numbers; Boons fill the whole width; end-game waters get their own heading.',
  'Code cleanup: about 260 lines of old code that could never run are gone (each build is about 40 KB smaller), the aquarium no longer re-sorts its fish every frame, and a reeling safety check was added. Nothing should look or play differently.',
  'Pets: the pets still to find no longer show on Your pets and Customize (also going to the live game as a hotfix).',
  'Fixed: a game with a Path chosen could freeze while starting (black water, nothing reacts to clicks).',
  'Rods (full screen): the rod in your hands shows its attachment slots again (also going to the live game as a hotfix).',
  'Boardwalk (full screen): every game card shows all of its content (the chests button was hidden under Counter specials); the games area scrolls if needed. Voyage milestones: one per row, readable again.',
  'NEW (your list, part 1): fight messages are short now: It’s running!, Careful!, Snagged!, Dead Weight; strong fish say Prepare for a fight, this fish is strong! (or Good luck, this fish is out of your league! when it is 10+ stronger than you).',
  'A missed bite keeps your line out; the 5th miss in a row reels in. Reeled in early and Missed a bite say just that. Cast power keeps its words over a hotspot, only its colour changes.',
  'Bait: three groups (Everyday bait, Water baits, Favourite foods), each sorted by price; they open folded, click a group to open it. Cooler: Sort (Newest, Oldest, Sell value, Aquarium bonus, Species) and Scrap all (same filters as Sell all).',
  'Also: shorter Heavy fog text and a Weather pop-ups switch in Settings, Stickleback has a new line, only cats purr, oddities and other non-fish say dismiss instead of the cooler line, the three treasure chests sit inside their pop-up.',
  'Please test on every platform and send me anything that feels off.']};
addTestNotes(TEST_NOTES);
