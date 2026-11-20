// Android test notes (preview builds only; the live game never shows them). One short line per change in the next test build,
// curly apostrophes only. The card opens once per device whenever the text changes. Released notes live in notes_release.js.
const TEST_NOTES={v:'test', label:'Test build · Android', name:'0.4.9 big patch, part 3: everything in', items:[
  'Paths (15, ranks I–V, Remove + fee on each fork), Prestige: Pearl shop, Boons, 32 milestones, 21 relics.',
  'Boardwalk: Fishmonger’s Gamble and Treasure chests. Tide Pass: 100 levels, chapters, exclusives (Wardrobe › Tide Pass exclusives).',
  'New waters: Cherry Blossom (after Stonebrook), Rockies (after Frostbite), Keys (after Coral), Amazon (after Brine Shelf). End-game waters open by voyage (Stats › tester tools can add voyages).',
  '300 oddities: rarity and odds show only once found (tap a found one).',
  'Looks: reel hand + left-handed (Settings › Display), Natural face + new hair/noses/mouths/eye shapes (Wardrobe), new fish eyes, wizard hat, pet colours.',
  'Fight rework: fish must be tired out; holding through rare runs snaps the line. Times with maxed gear: ~2.5 s common to ~36 s mythic.',
  'Fishing: try holding reel through a rare fish’s runs (it should snap), then let go when it runs (it should land).',
  'NEW: tap the “test build” pill for the device report. Play, then Copy report and send it (Cam: text it to the director). The 10-step phone script comes with Claude’s message.',
  'Fixed: a brand-new game could lose some Wisdom Pearls on its first reload.',
  'Earlier in part 3: aquarium fish show real sizes and depth; hair rebuilt with volume (all 20 styles); body builds have distinct silhouettes; smaller noses on the Natural face.',
  'Deep QC round: 30 fish renamed so no two share a name; attachment stats no longer read “undefined”; oddity names wrap on small PC windows.',
  'Second QC round (looks): the Tide Pass page shows this chapter’s exclusives as pictures plus progress for every chapter; a new Wardrobe tab to wear auras, bobbers and lines; Paths is shorter and uses two columns on wide screens; path fees are round numbers; Boons fill the whole width; end-game waters get their own heading.',
  'Top bar Bait chip, fixed properly this time (the first fix did not work): with a live event on, Tasks and then the event chip make room before Bait ever shortens.',
  'Code cleanup: about 260 lines of old code that could never run are gone (each build is about 40 KB smaller), the aquarium no longer re-sorts its fish every frame, and a reeling safety check was added. Nothing should look or play differently.',
  'Please test on every platform and send me anything that feels off.']};
addTestNotes(TEST_NOTES);
