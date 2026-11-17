
// =====================================================================
// Update 1.5: rods & attachments, pet dress-up / petting / bond,
// daily tasks & gift, patch notes, safe reset, Boardwalk 2.0, quips
// =====================================================================
const GAME_VERSION = '0.4';
const PATCHES = [
 {v:'0.4', name:'Fifty Fathoms', items:[
  '## A new way around',
  'The game now has two full-screen modes. Fishing fills the whole screen with the water, on PC, tablets and phones held either way. The category bar on the water (or the M key) opens the full-screen menu, and Back returns you to the water.',
  'The menus are grouped into five categories: Fishing, Upgrades, Collections, Challenges and Customization. Events sit under Challenges, and the Challenges button shows LIVE whenever an event or challenge is running.',
  'The menu opens on the page you used last, and each category shows how many things are waiting in it, so nothing slips by.',
  'In the menu, switch categories straight away from the category bar, and the page tabs above each page. Back, Esc or your phone’s back gesture takes you to the water. Your coins stay in view.',
  'Your line waits while a menu is open: a cast, a bite or a fight pauses and carries on when you come back, never lost.',
  'The top bar keeps what you check most: your coins, level, the water you are fishing at, your next goal (or LIVE with the event or challenge running), cooler and bait. Tap the goal to open its page.',
  'Page titles that only repeat the highlighted tab are gone, and the Wardrobe’s tabs sit in one slim row above your angler.',
  'Every menu page is more compact: tighter cards and more of them per row on every screen, two cards per row on phones held upright, five fish per row in the Fish Log on small phones, and the Hunt button is a small target on each fish card.',
  'The water now has a category bar: Fishing, Upgrades, Collection, Challenges and Customize, each one tap away and showing how many things are waiting there. It runs along the bottom when your phone is upright and down the right side when it is sideways, where the menu keeps its slim rail too, so pages get almost the whole screen. Bait in use now sits under the Bait tab.',
  'The top bar now also shows your aquarium income per hour (it glows gold when coins are waiting) and how many species you have found. Tap either one to open it.',
  'Phone held sideways: Collapse panel at the top of the side panel folds it down to icons, giving the water and the pages more room. Expand panel brings the names back, and your choice is remembered.',
  'Page tabs stay pinned at the top while you scroll, so the Wardrobe’s sections are always one tap away. On a phone held sideways they sit in one row.',
  'The bait chip in the top bar always shows the whole bait name, with how many you have left above it. Tap it to switch bait, or press Use on any bait in the Bait and Special lures tabs.',
  '## Weekly quests and forecasts',
  'Weekly quests: four bigger goals every week, right under your daily tasks in Bounties. Each pays coins and Scales, and finishing all four earns a big Mystery Crate. New quests arrive every Monday.',
  'Weather forecast: the Events page shows the weather coming to every water and when, so you can plan for rare weather like Gilded, Aurora or a Blood Moon. A heads-up arrives a minute before rare weather starts.',
  '## The Boardwalk: prizes, not coins',
  'The Boardwalk games now pay out in prizes: tickets, crates and things to wear. The coin flip is still a coin game, and the wheel keeps one small coin slice.',
  'New on the wheel: a Wear prize (something you don’t own yet) and a jackpot that gives a Boardwalk-only piece.',
  'Scratch cards pay tickets, a crate or a Boardwalk-only piece, and Higher or lower now grows a ticket pot.',
  'Duck pond ducks all hide tickets, and a few hide a crate or something to wear.',
  'Mystery crates are mostly clothes, hats, glasses, fabrics, colours, pet extras, decor and pets. When you already own everything a roll could give, you get tickets.',
  'A crate’s reveal shows what you won, on your angler or your pet.',
  '## Docks',
  'Home is now the Dock, and every water has its own. Each dock keeps its own wood, style, decorations and where everything and your pets stand.',
  'A water you have not fished at yet starts with a copy of the dock you arrive with. You can also copy any other dock’s layout from the Dock page, and the cozy bonus of each dock counts while you fish at its water.',
  '## Hunts',
  'New in the Fish Log: Hunts. Pick up to 3 fish you are still missing at each water, and each one turns up twice as often whenever it can bite. Every water keeps its own hunts, and catching a hunted fish completes its hunt.',
  'Hunted fish are marked HUNTING in the log, the water shows how many hunts you have there, and a fish’s page shows your real chance of catching it.',
  '## Fishing feel',
  'Rare fish fight like rare fish. The rarer the fish, the longer it runs and the slower it tires. Legendary and mythic fish make a signature surge: a long, heavy run with a burst of spray, a moment of calm, then a leap. Watch them closely.',
  'Long fights build to a finish: a fish tires as the fight goes on, so it never drags.',
  'When a fish is close to your line’s limit, the game warns you as you hook it.',
  '## Better choices',
  'Rare odds stack properly now: every source of better odds (bait, rods, skills, hotspots, far casts) keeps counting as you add more, so upgrades you can feel.',
  'Bait, rods and the Lucky Charm skill show your real chance of an epic or better fish at the water you are on, and how much a choice changes it.',
  'Baits rebalanced so each has a place: every water’s own bait is now the best choice there, by day and by night, for rare fish and for coins, and no single bait wins everywhere. Wild Berries, Ice Flies and Live Shrimp are much stronger at their own water. Lava Worms, Stardust and Golden Chum are much cheaper.',
  '## Events',
  'Six new challenges you can start any time from the Events page: Rare Run, Mixed Bag, Long Cast, Steady Hands, Treasure Dive and Trophy Weigh-in. Each is sized to your gear and odds, with coins, Scales and tickets to win.',
  'A new event calendar: the Shoal Run (faster bites, more rare fish), Golden Hour (shiny fish twice as common) and Market Rush (fish sell for 30% more) run on the clock at every water. The calendar shows what is live and when the next one starts.',
  'Live events and challenges show their progress right on the water, and the Events tab shows how many are live.',
  '## Clear direction',
  'A goal on the water always shows what to do next and how close you are, from your first catch to the next water to filling the Fish Log. Tap it to open the right page. It also tells you when your cooler is full.',
  'The search button now opens a map of every page, grouped by category, with a line on what each one is for, and hovering a badge tells you what is waiting.',
  'Nothing scrolls the water away any more: the game always fits one screen, and on iPhone the menu bar can no longer hide under Safari’s toolbar.',
  'The top bar is slimmer. Time and weather moved onto the water, and the weather now says what it does. On phones the bar is one row; the water’s name shows on the water, and search and settings are in the menu.',
  'Every label fits: nothing is cut off with “…” on any page, on any screen.',
  'Smoother everywhere: Aurora weather is far lighter to draw, the Pets page opens about twice as fast, and the top bar does less work while you fish.',
  'The numbers add up: each aquarium fish’s coins per hour add up exactly to the total, short amounts never round up (999,999 coins used to read 1000K), and weekly quests pay exactly what they show.',
  'A sleeping bat’s accessories now hang with it instead of floating.',
  'Backpacks and everything worn on the back have straps that run from the pack over your shoulder: the backpack, tackle pack, plush and seashell packs, scuba tank, jetpack, rod quiver, guitar, shark fin, turtle shell, creel, net, lantern and banner poles.',
  'Necklaces show on your chest instead of hiding behind your arm: the gold chain, pearls, shells, medal, whistle, fish on a string, flower lei, feather boa, bow tie and tie.',
  'The Tiny Lighthouse on your dock now glows at night, and its beam sweeps across the water.',
  'Phone held sideways: the Aquarium shows your whole tank right under your earnings, and Collapse panel works on every menu page to give pages the full width.',
  'The “new version” bar now shows on top of the menus too, so you always know when an update is ready.',
  'Rainbows stand on the side away from the sun and sink lower as the sun climbs, and their reflection lines up with the arc and fades softly into the water instead of ending in a hard edge.',
  'A Blood Moon takes the place of the moon instead of hanging beside it, and the land in front covers it like the moon.',
  'In fog, your angler, dock and boat stay clear while the far shore fades away.',
  'Phones: lists no longer bounce past the top bars, holding a finger down no longer opens copy or zoom menus, and the game no longer zooms in on a double tap or pinch.',
  'Menus: the tab bar at the top of a page now fully covers what scrolls under it, with no gap above or beside it.',
  'Phones: every button now reacts the moment you tap it, with no short wait before the page switches.',
  'Menus: switching pages is quicker, because pictures of fish and decorations are drawn once and reused instead of redrawn every time, and phones skip the card fade.',
  'Menus: tapping quickly back and forth between sections stays smooth: only the page you land on gets built.',
'Phones: buttons no longer light up in a hover colour before acting, and a single tap always works (no second tap needed).',
'Menus on phones held sideways: the side buttons are bigger, the space between them counts as part of a button, and they react as your finger lifts.',
  'Prize counter pictures show your pet awake, and on phones prizes and counter specials sit two to a row. Search finds weekly quests, the weather forecast and the counter specials.',
  'The cast power bar sits above the hint at the bottom of the water, so the hint never covers it on tablets and sideways phones.',
  '## Handy extras',
  'Keyboard shortcuts on PC: M opens and closes the menu, 1 to 5 open a category, [ and ] move between pages, / searches and Esc closes menus and cards. Press ? to see them all.',
  'Bait can restock itself: switch on Auto-restock on the Tackle page and one more pack is bought when you run out, if you have the coins.',
  'The Stats page shows your real chance of epic and legendary fish at the water you are on, and water pictures on the Waters page show the whole scene again.',
  'Your game also saves when the tab is closed or put in the background, a broken streak is saved at once, and very large coin amounts read cleanly (T, Qa...).',
  '## More to catch',
  'Every water now holds 50 fish: 167 new species, spread across every rarity, each with its own look and a short note in the Fish Log.',
  '20 joke fish have slipped in too, two in every water. You will know them when you see them.',
  'The oddity collection grows to 100, with 20 new finds to fish up.',
  '## Voyages',
  'Setting sail now leaves a lasting legacy: every voyage adds +10% coins forever (up to ten voyages, then +5% for each one after), and voyages bring in more pearls the more of them you make.',
  'Six voyage milestones give you a head start on every new voyage, from starting coins and an unlocked river to a bigger cooler, a bait stash and better tackle.',
  'Four new relics, and the fish in your aquarium now go to the Trophy Room when you set sail instead of being lost.',
  'Tiny hybrids are worth keeping: the smaller a hybrid is for its kind, the bigger its aquarium boost.',
  '## A new look',
  'Every scene has real depth now: a slow camera drift moves the sky, the land and the water at different speeds.',
  'Ember Springs looks properly volcanic, with scorched hills and burnt trees instead of green grass.',
  'Fish are drawn with rounded bodies, a lateral line and a wet sheen, and every fin, spine, crown and feeler now grows out of the body. Nothing floats or looks pasted on.',
  'Your angler has more natural proportions, softer shading and a contact shadow. Clothes have a woven texture with creases at the elbows and knees.',
  'Over 30 hats are redrawn to fit the head properly, from caps with curved visors to woven straw hats, jewelled crowns and a glowing lantern. Many outfits gain buttons, drawstrings, belts and trims.',
  'Pet bows and flowers sit on each pet’s head instead of floating above it.',
  'Decorations and oddities have real edges, texture and a shadow on the sand, and two oddities that showed as grey circles have proper drawings.',
  '## Menus and phones',
  'iPhone gets its own fixes: the bottom menu bar sits above Safari’s toolbar, text no longer enlarges when you turn the phone, tapping a picker no longer zooms the page, and the full-screen button explains how to play full screen from your home screen.',
  'Phones held sideways use compact tabs that always fit, even beside the notch.',
  'Pages have clear titles, filter rows are labelled, and Sell all lets you choose what to sell by rarity, price and shinies.',
  'New search button at the top: find any page, setting or item by name (press / on PC).',
  'The Fish Log can show only the fish you are missing, or the ones you can catch right now.',
  'Better catches feel better: the catch card grows more dramatic with each rarity, with its own frame, light, sound and vibration.',
  'Buttons are easier to tap on phones, and nothing on any page runs off the side of the screen.',
 ]},
 {v:'0.3.5.1', name:'Made for Phones', items:[
  'Phones held upright now show everything on one screen: the water stays in view, and only the page you have open scrolls, right above the section bar. No more scrolling the water away and back.',
  'New full-screen button on the water (phones held upright): one tap and the water fills the screen, one more and the menus come back. It shares its setting with the sideways menu button.',
  'Rest is now a proper button on the water, next to the full-screen button, and it glows while you rest.',
  'The tips line sits on the water instead of taking up its own row, and the top bar is slimmer.',
  'Event cards such as patch notes and treasure choices fit on one screen on phones.',
  'The aquarium fits on phones again, held upright or sideways: a wide tank like on PC, with decorations sized to fit.',
  'Fish rows in the Cooler and Aquarium no longer squeeze the fish’s name and details when the menu is narrow: the buttons sit on their own line underneath.',
  'Menus feel snappier on phones: switching pages is instant and the section bar is lighter to draw, so taps respond faster.',
 ]},
 {v:'0.3.5', name:'A Tidier Tackle Box', items:[
  '## Menus',
  'The menus are reorganised into five sections: Fishing, Gear, Collection, Home and Rewards. Pick a section, then a page. The game remembers which page you last had open in each one.',
  'Notification badges add up onto their section, so you can always see where something is waiting.',
  'Settings, Stats and Save live behind the gear button at the top.',
  'The water never gets covered: on PC the sections sit right under it, and on phones held upright they sit along the bottom of the screen.',
  'A “Back to the water” button appears when you scroll deep into a menu, and a “Menus” button takes you back down.',
  'Phones held sideways: the menu button is back to two steps, menus beside the water or the water full screen.',
  '## Trophy Room',
  'New in Collection: the Trophy Room. Mount any fish you love on a plaque and it stays there forever. Trophies earn nothing and give no boosts, but a new voyage never touches them. Press Keep on a fish in your Cooler or Aquarium.',
  '## Catches',
  'The catch card fits on one screen on phones, no scrolling.',
  'What a fish would earn in your aquarium now sits beside its weight, price and XP on the catch card.',
  '## Graphics',
  'High graphics are now the only setting, on every device.',
 ]},
 {v:'0.3.4.2', name:'Cooler and Catch Card Fixes', items:[
  'Sell all’s price filter is now a box you type into: enter any amount (like 2500, 50k or 1.2m) to only sell fish worth less than that. Leave it empty for any price, or tap × to clear it.',
  'New “Sell shinies too” toggle next to it: turn it on to let Sell all sell shiny fish (shiny Epic and rarer fish stay protected while Protect rare fish is on).',
  'The catch card shows just one aquarium earnings line again (it was keeping the lines from earlier catches, so the top number belonged to a different fish).',
 ]},
 {v:'0.3.4.1', name:'Aquarium Numbers Hotfix', items:[
  'The coins-per-hour shown in your cooler now always belong to the right fish (some rows were showing another fish’s number).',
  'Before you move a fish into the aquarium, the number shown now includes its own aquarium boost, so it matches exactly what the Aquarium tab shows once it is on display.',
 ]},
 {v:'0.3.4', name:'Sea Legs', items:[
  '## Fishing',
  'Holding the reel now always reels. While a fish runs you still bring line in, just slowly, and the tension climbs much faster, so watch it.',
  'A soft whirr now tells you when a hooked fish starts to run.',
  'Rarities are balanced across every water: each rarity turns up about as often wherever you fish, and every fish keeps its own steady rate, so some legendaries are rarer than others.',
  'Strong late-game luck (baits, rods, pearls, hotspots) still helps, but with diminishing returns, so legendaries stay special in the last waters.',
  'The fishmonger now asks for a fish from the water you are on most of the time.',
  'Boardwalk winnings now count for at most a quarter of your progress toward Wisdom Pearls on a voyage (you still keep every coin).',
  '## Cooler and aquarium',
  'Sell all has filters: sell only up to a rarity, only fish under a price, or both together. Your choice is remembered.',
  'The aquarium has a Feed button right next to Collect.',
  'See what a fish would earn in your aquarium before you decide: on the catch card, under the price in your cooler, and when you hover To aquarium (even when the aquarium is full).',
  'Shiny fish pictures now twinkle.',
  'Bounties always open on the water you are fishing.',
  '## The waters',
  'Brine Shelf: the dolphins have swum off; flying fish glide over the swell instead. Ships pass in the distance, and the buoy has a gentle bell.',
  'Midnight Deep has new company on the horizon on some nights (keep an eye out).',
  'Storms at sea are much rougher: choppy water, rain squalls that blur the horizon, and a bigger swell.',
  'Rain finally makes a sound.',
  'Hollow Trench: whatever watches from the depths is no longer just one pair of eyes.',
  'Ember Springs: the lava flows down the volcano now, and the crater throws out the odd glowing rock.',
  'Dusk and dawn shift more gently.',
 ]},
 {v:'0.3.3.1', name:'Hair Hotfix', items:[
  'Curly hair no longer pokes out around hats: under a hat the curls sit neatly below the brim.',
  'Spiky hair has been redrawn: swept-back spikes that grow from the head, and it sits properly under hats.',
  'The Coils hairstyle has been removed for now. If you were wearing it, you now have Curly.',
 ]},
 {v:'0.3.3', name:'Every Water Special', items:[
  '## The waters',
  'Several waters got a lot more love so none of them feel empty: new landmarks on the horizon, new wildlife, things floating by and new details in the foreground. Each one now has a signature of its own (go and find them).',
  'Some of the places you stand on have been refined, with more depth and detail.',
  'More life everywhere, especially in the quieter waters: frogs, deer, seabirds, rays, seals, otters, geysers, glowing crests, drifting leaves and more, plus breezes that ripple across calm water and a wake behind a running fish.',
  'Ember Springs has been rebuilt: a natural rock shelf to stand on, a smooth hillside with mineral springs, a rounded headland, a more detailed volcano with lava running down it, and ash drifting from the crater.',
  'Starfall Sea, the last water, has been given a proper finale: glowing nebulas, a richer ringed planet with two moons, a whale made of stars swimming across the sky, comets, ponds on the floating islands feeding their waterfalls, lanterns rising off the lake, and star-blossoms opening on the water. Every so often something mystical happens out there. We will let you find out what.',
  'The light patterns on the water at Coral Shallows now fade gently into the distance.',
  'Mountains and hills everywhere have softer, more natural ridges.',
  'The pictures of each water in the Waters tab now show exactly what the real scene looks like.',
  'The Waters tab opens instantly; its pictures are prepared quietly in the background.',
  'The lighthouse at Saltmarsh Coast now glows softly instead of throwing a hard beam, and its light shimmers on the water.',
  'The waterfalls at Starfall Sea now start from a spring on their island, run across the grass, spill over the edge and pour all the way into the lake, with mist and spray where they land.',
  'The waves at Coral Shallows now wash up the beach and slide back, leaving wet sand behind.',
  'Fixed: at Coral Shallows a short cast could land on the beach, so fish came up out of the sand. Every cast now lands in the water (checked on every water).',
  'The dolphins at the Brine Shelf now break the surface properly: you see them coming under the water, they leap out with a splash and dive back in.',
  '## Weather',
  'Every kind of weather now changes the whole scene, not just the sky: the water reacts, the light shifts and some weathers bring something special to look at. A few that showed nothing at all now have their own look.',
  'Fog is now Heavy fog: it hides the far shore and veils everything beyond your float. Storms and rain darken the whole scene much more.',
  'Every water has more depth: haze where the land meets the horizon, soft motes drifting close by, and water that darkens toward you.',
  'Weather and its effects still build up and fade away smoothly.',
  '## Aquarium',
  'The aquarium is much bigger, so you can actually see your fish and decorations, and the fish are sized to match.',
  'Every fish has its own pace and way of swimming: lazy gliders, quick darters, bottom cruisers, hoverers, wavy swimmers, and rare fish that sweep figure-eights.',
  '## Your angler',
  'Curly hair has been redone from scratch: natural, medium-length curls that follow the head and fall over the ears.',
  'A note on the curly hair situation. We owe you the truth. All previous curly hair was sampled from a single man named Gary, who we found living inside a decommissioned lighthouse off the coast of nowhere. Gary claimed his hair was "naturally curly." Gary was lying. Gary had simply not seen a comb since the late 1900s, and his hair was mostly a seagull nest with opinions.',
  'Our first sample was taken during a thunderstorm, which explains the bubble helmet phase. Our second sample was taken while Gary was upside down, which explains why the curls kept growing out of the back of your head like a startled cauliflower. Our third sample was a mop. We do not know how the mop got into the lab. The mop has since been promoted.',
  'At one point the hair achieved sentience, filed a formal complaint about its working conditions, and briefly unionised with the Bunny Slippers.',
  'Gary has been released back into the wild with a generous supply of conditioner and our deepest apologies. The new curls were sampled from people with actual curly hair, by artists who were not standing in a lighthouse during a thunderstorm. Thank you for your patience, your feedback, and for never once letting us get away with the cauliflower.',
  'New hairstyle: Coils, tight round curls.',
  '## Graphics',
  'New Graphics setting (Settings): High or Balanced. Computers use High automatically, with sharper scenery and more life on the water and in the weather; phones and tablets use Balanced.',
 ]},
 {v:'0.3.2', name:'Prized Catches', items:[
  '## Fishing',
  'A fish on the run now takes line back when you stop reeling, and rarer, fresher fish pull harder. Reeling while it runs holds the line but strains it much more, so big fish give longer, fairer fights even with great gear.',
  'Shiny fish now leap in Fish Frenzy: they glow, move quicker on trickier paths, and each one is worth five fish. Other leapers have a few new jumps too.',
  'The marker showing where your cast will land is much easier to see in bright light, and the float has a soft outline.',
  'Fixed: the shadow of a predator could keep swimming beside your float after you landed the fish it was after.',
  'Fixed: rolling the mouse wheel to reel no longer scrolls the page when the fight ends.',
  '## Aquarium',
  'Weight matters on display: a fish that is heavy for its kind earns more and gives stronger buffs, and every fish now shows at its true size (big fish are big, heavy ones a little bigger still). Your best catches belong in the tank.',
  'The pineapple house has been redrawn, and two new seaside homes have moved in.',
  '## Looks',
  'Your angler has a slimmer side profile with real shoulders, and better arms.',
  'Curly hair is full and voluminous, starting right at the face.',
  'The hot dog suit is now seen from the side like everything else.',
  'Pets are drawn in front of your angler, so clothes and the angler never hide them.',
  'The heron at Stonebrook River has slender legs and stands in a gentle ripple.',
  '## Small changes',
  'Number badges on tabs that need you: newly completed feats on Feats (marked New inside), and the Skills sections where you can spend a point.',
  'The game remembers full screen: if you left it in full screen, it goes back to full screen on your first tap.',
  'The free crate counter at the Boardwalk no longer breaks over two lines.',
 ]},
 {v:'0.3.1', name:'Dressed for the Weather', items:[
  '## Your angler',
  'Clothes are now drawn from the side, the way your angler actually stands: buttons, zips and buckles sit at the front, hoods, collars and bows at the back, and pockets on the side. Every outfit was redrawn this way.',
  'Body types have proper shapes now (back, chest and belly) instead of boxes, from slim to sturdy.',
  'Neckwear wraps the neck and hangs at the front of the chest, so your arm no longer hides it. Backpack and shoulder straps go over the shoulder.',
  'New face options in the Wardrobe: nose, eyebrows, resting mouth and rosy cheeks, for a look that is a little less goofy (or more, if you like).',
  'Curly hair no longer falls over the face, long hair falls more naturally down the back, and beards hang in front of the arm instead of behind it. Eyebrows now always show under a fringe.',
  'Shoes sit properly on the feet: boots line up with the leg, trousers tuck into tall boots and rest on low shoes, and the back bunny slipper keeps its colour.',
  'You can colour your shoes.',
  'The bucket hat looks like a bucket hat, and the sport visor wraps around the face.',
  'Hat pictures in the shops, the Wardrobe and the Boardwalk now show your own angler wearing them.',
  'Capes billow out behind you and move with the wind; storms make them flap harder.',
  '## Aquarium and Home',
  'Not every aquarium decoration gives income now: some make the buffs your fish give stronger, and some are showpieces that boost income from shiny and hybrid fish. A few older pieces changed kind (at a matching value).',
  'New decorations for the aquarium and for your dock.',
  'The decoration shops can be sorted by price, name or bonus (cozy at Home) and filtered by what you own, what is for sale and, in the aquarium, the bonus kind.',
  '## The water',
  'Light changes at dusk and dawn now fade smoothly, without the little stutters.',
  'Weather fades in and out instead of switching at once: rain starts with a few drops and builds up, and eases off before it stops.',
  'Lantern light at night is softer, and its reflection on the water is a gentle shimmer instead of a block.',
  'Ripples around the dock posts pass behind the posts properly.',
  'Shiny fish glow, catch the light and sparkle.',
  '## Small changes',
  'Stats now shows your time played (it starts counting from this update).',
  'Boosts shown on the water no longer overlap the Rest button.',
  'The lo-fi music only crackles where the track loops round (and softly once halfway), not all the time.',
  'Scrollbars are thinner and only show while you scroll or point at a list.',
 ]},
 {v:'0.3', name:'The Big Glow-Up', items:[
  '## A whole new look',
  'Every water has been painted again from scratch, each with its own landmark, wildlife and light, from misty mornings through golden evenings to starry nights. Something always moves: birds, ripples, smoke, glimmers on the water.',
  'You now stand somewhere that fits each water, and weather (rain, storms, fog, golden hours) sits properly on top of the new scenery.',
  'Willow Pond and Stonebrook River have fuller, greener shores, and the willow is a real weeping willow.',
  'Every fish is redrawn with its own body, fins and colours. Catfish have broad heads and long whiskers; gar have diamond scales.',
  'Every pet is redrawn with more personality: they watch your line, cheer your catches and nap at night. Pets are now the right size next to you.',
  'Rods are real gear, each with its own look and a reel that spins while you wind.',
  'Splashes, ripples and sparkles when you cast, when a fish bites, while you fight and when it lands.',
  'Every menu has a fresh look: softer panels, warm buttons, clearer tabs and gentle animations.',
  'Home shows your dock in the water you are fishing. Wardrobe and Pets have a lit stage. The aquarium has light rays, swaying kelp, bubbles and rippled sand. Waters shows a little painting of each water.',
  '## Your angler',
  'Rebuilt from the ground up: rounded, lit shapes, arms and legs that bend, poses that flow into each other, both hands on the rod, and a soft light along your outline that matches the sky.',
  'Seven body types and nine eye colours. Every outfit fits every build.',
  'Hats sit properly: hair shows underneath instead of poking through, your eyes are never covered, and helmets show your face through the glass.',
  'Outfit designs (checks, stripes, flowers, scales) carry on down the sleeves, and the belt only shows where your waist does, not over jackets, sweaters or costumes.',
  '## Music and sound',
  'A cozy music theme for every water. Pick “Follow the water” in Settings, or choose any theme. The old styles are still there.',
  'The lofi music no longer has a constant hiss in the background; its record crackle is now soft and occasional.',
  '## Controls',
  'New, all optional: tap the water to aim your cast (turn it on in Settings), draw circles or roll the mouse wheel to crank the reel, play with a controller (A casts and reels, the right trigger reels gently), and phones buzz on a bite.',
  'Phones no longer flash blue on every tap while reeling.',
  'Phones held sideways: the arrow on the water now has three steps: wider menus, hidden menus, and back.',
  '## New things to find',
  'Something rarer than a shiny is out there. You will know it when you see it, and when it fights.',
  'Now and then a fish weighs far more, or far less, than it has any right to. Your Fish Log keeps a separate record for these, and a new skill helps you find them.',
  'Hungry fish: big predators sometimes come up with a meal inside, and a small fish on your line might get grabbed by something much bigger. Land it to keep both.',
  'Twenty new oddities to fish up.',
  'Three new mini-games between catches.',
  'Rest mode: press Rest on the water and your angler sits down and fishes slowly by themselves, even while you browse other menus. A new skill makes them quicker.',
  'A new weather replaces Fish Rain.',
  'New dock shapes to build in Home, not just new wood.',
  'New relics to trade your Wisdom Pearls for.',
  '## Wardrobe and customisation',
  'The Wardrobe is reorganised into sections (Body, Clothes, Hats, Glasses, Shoes, Neck and back, Shop) so there is far less scrolling.',
  'The clothing shop has a tab for every kind of clothing with its whole range, cheapest first, plus a Featured shelf that changes every 20 minutes and never shows anything you already own. Try anything on before you buy.',
  'New: shoes and boots, scarves and necklaces, capes, wings and backpacks, more glasses, more outfits and more colours.',
  'Hats got a fitting pass: every hat sits on your head and stops just above your eyes. The bucket hat, pirate tricorn, mushroom cap, beret, sombrero and sailor cap are redrawn; the tiara, flower crown, bunny ears, mohawk, fish hat and duck rest on your head instead of floating; headphones and the viking helmet are drawn side-on, the way you would wear them.',
  'Stubble, mustaches and beards are redrawn to follow your jaw.',
  'Shirt patterns are now fabrics: materials like denim, knit, corduroy, tweed or silk, always in your own colours. Every fabric works on shirts, and outfits offer the fabrics that suit them (sleeves included). Flannel and pinstripe stay as fabrics; any other shirt designs you owned were refunded in coins.',
  'Shirts can be two-tone.',
  'Colour choices show their colour before you pick them, for your angler and your pets.',
  'The Boardwalk has Counter Specials, restocking every 3 hours with things you can only get there.',
  'Things you have not found yet show as ??? with a short hint on how to get them: fish, oddities, pets, rods, clothes and decorations.',
  '## Changes to fishing',
  'Cast distance matters more: longer casts lean toward rarer and heavier fish (about 20% more value at full power than a medium cast). Short casts lean slightly the other way, but never inside a hotspot.',
  'Fish Rain is gone, and the bonus it gave to junk is gone with it.',
  'Every mini-game can be skipped, and Settings can turn them off completely.',
  'Sell a fish or put it in the aquarium straight from the catch card. Tap anywhere else to keep it in your cooler, as before.',
  'Tapping on the dock side of the water no longer casts or reels in early, so a missed tap on your pet does nothing.',
  'The catch card shows what the fish sells for, bonuses included.',
  '## Changes to the aquarium and Home',
  'Every decoration is redrawn, on your dock and in your tank, with light, detail and a little movement.',
  'Aquarium decorations give twice the aquarium income bonus they used to.',
  'Cozy level now goes up to 40 (was 25), with two new cozy names, and each point also raises your sale price by 0.5%.',
  'Every fish now gives a boost while on display, including Common ones. Each fish rolls its own boost when caught: usually one that fits its rarity, now and then a much better or weaker one. Heavier fish give more. Fish you caught before 0.3 keep their old boost.',
  'Tanks hold 1.5 times as many fish, and the button now says Increase tank size.',
  'Aquarium income per fish is 25% lower, and each fish now earns at most a set share of what an hour of fishing its own water pays (a larger share for rarer fish). A full tank is still a strong passive bonus, but fishing always pays more.',
  'Drag decorations to move them, in your tank and on your dock. Dock decorations are now sized properly next to you.',
  'Drag your pets along the dock in Home too; they stay where you put them on the water.',
  'Your dock stands in the water on five posts instead of towering over it, and the Home picture matches the dock you fish from.',
  'The tank stays in view while you decorate, so every water, floor and decoration shows as you pick it.',
  '## Changes to rewards and progress',
  'Tide Pass: levels now take about 2.7 times as much XP. Special Tide rewards come at levels 3, 5, 8, 10, 12, 15, 18, 20 and every five levels after, including Tide-only shoes, a scarf, a cape, a shell backpack and, at level 50, Tide Wings. Other levels give clothing or decorations you do not own yet, Big Mystery Crates, or 25 Scales with 150 tickets, and every level shows exactly what you get before you claim it.',
  'Bounties: every water now keeps its own board of 3 bounties, and they wait there until you finish them. Your existing bounties moved to the water they belong to.',
  'Coins from junk, Boardwalk games, crates, mini-games and Tide Pass coin rewards are now based on the fish in each water. They are lower in the later waters (Brine Shelf −37%, Midnight Deep −44%, Hollow Trench −44%, Ember Springs −68%, Starfall Lake −63%), and crate and wheel prices drop by the same amount.',
  'Fish that roll another fish’s weight are worth up to 25 times as much, no more.',
  'Wisdom Pearls reworked: each pearl now gives +25% coins and XP (was +10%) and better rare odds, but pearls are 2.5 times harder to earn on a voyage. Pearls you already have are converted once: you keep 40%, rounded up, so your bonus stays about the same.',
  'Relics cost fewer pearls: Head Start 1 (was 2), Old Mentor 1 (was 3), Old Tackle Box 1 (was 3), Deep Pockets 1 (was 3), Sea Charts 2 (was 4), Brass Compass 2 (was 4), Golden Hook 2 (was 5), Lucky Pearl 2 (was 5).',
  'Levels after 20 need less XP, so late levels come at a steadier pace.',
  'Shops list everything from cheapest to most expensive, and decorations are listed A to Z everywhere. The Fish Log is sorted by rarity and shows your smallest catch too.',
  '## Screens',
  'New Stats tab: bite speed, hook window, rare and shiny odds, reel and line, sale price, XP and aquarium income, with a table of every bonus and where it comes from.',
  'The Boardwalk is rebuilt: a night pier, three sections (Games, Prize counter, Counter specials), tidy game cards, and every prize says exactly what it is and what it does.',
  'The Tackle shop is split into Gear, Bait and Special lures, with short bait rows that show every effect at a glance.',
  'Less scrolling everywhere: Settings, Pets, Feats, Aquarium, Home, Rods and Waters are split into sections. Pets can be filtered by bonus, and Feats show the ones closest to done first.',
  'Skills are split into Catching, Rare finds, Fighting, Coins & XP and Aquarium & pets.',
  'The Save tab is split into Move to another device, Save codes and App.',
  'Settings is no longer listed twice: open it with the ⚙ button at the top.',
  'Your rod: one tidy row per attachment slot, and each attachment shows what it does without clicking.',
  'Buying, equipping or switching something updates the menu in place, without a flash or jump.',
  'On PC the info bar above the water fits on one line.',
  'Mountains look smoother, and the Waters pictures are sharper.',
  'Tide Pass levels never show the same reward twice. When you already own everything a level could give, it gives Scales or tickets instead, never the same as the level beside it.',
  'New Events tab: the fishing derby lives there now, with every medal’s rewards spelled out.',
  'The Wardrobe tabs have icons, and pets fill the Customize stage whatever their size.',
  'Pets: hats sit a little higher on front-facing pets so their eyes always show, and ear pieces (ushanka, aviator) sit on both ears.',
  'Boxes only light up under your mouse when there is something in them to click.',
  '## Fixes',
  'Buying the last two Rod length upgrades could make every catch the same fish. Fixed.',
  'The streak message now shows the streak you actually lost (it used to always say 0).',
  'Everything runs smoothly: scenery is prepared once and reused, so phones stay cool.',
  'Version numbers start fresh: earlier updates are now listed as 0.1 and 0.2.' ]},
 {v:'0.2.2.2', name:'Small patch', items:[
  'Phones held sideways: a new button on the edge of the water hides the menus so the water fills the screen, and brings them back. It remembers your choice.' ]},
 {v:'0.2.2.1', name:'Quick fix', items:[
  'Sending progress with a 6-digit code now works on every network. Before, it could fail to connect on some home Wi-Fi and phone connections.',
  'Your code now stays valid for 3 hours, so there’s no rush to type it in.',
  'The Save tab explains the new way to move your progress.' ]},
 {v:'0.2.2', name:'Closer Together', items:[
  'Moving progress between phone and PC is much easier, in both directions: tap Send on the device with your progress and type its 6-digit code on the other one. Phones can scan the code instead. Works for any amount of progress, no matter how far you’ve come.',
  'The old “progress is too big for a QR code” problem is gone.',
  'Links still work as a backup, under “Other ways” in the Save tab.',
  'The Settings shortcut now opens moving progress and save codes.',
  'A gift code box in Settings, for when a friend has something special for you.' ]},
 {v:'0.2.1', name:'More of Everything', items:[
  '21 new fish across every water. A few of them are very chill. One is an absolute unit.',
  '10 new pets: some in the pet shop, some in crates, one at the Prize Counter.',
  'Two pets at once: pick a ★ favourite that is always with you and bonds faster, plus a companion that tags along. Pet either one on the dock.',
  'Petting in the Pets tab now has a little animation, and the bond hearts update right away.',
  '6 new rods. Not all of them can be bought.',
  '4 new attachments.',
  '5 new skills, each with its own mastery effect.',
  'A fifth Path opens at level 75.',
  '4 new baits, including some for the far waters.',
  '6 new hats and 3 new outfits.',
  '5 new aquarium decorations and 5 new dock decorations.',
  '6 new pieces of junk to fish up.',
  '2 new relics.',
  'A new game on the Boardwalk, and new prizes at the Prize Counter.',
  'A new rare weather.',
  '8 new feats.',
  'Send to my other device: one link (or a QR code) moves your progress between PC and phone. Find it in the Save tab.',
  'All tabs now fit on one screen as a tidy icon grid. No more sideways scrolling. The Encyclopedia is now called the Fish Log.',
  'Settings has a shortcut straight to your save codes.' ]},
 {v:'0.2', name:'Home Waters', items:[
  'Two new waters at the far end of the map, for anglers who think they’ve seen it all.',
  '40 new fish live in them, including a few legends and something rarer still.',
  'Home: your dock now goes with you everywhere. Choose its wood, add up to 8 decorations, and the cozier it gets, the better you fish.',
  'The Tide Pass: a 50-level reward track that fills up just by fishing, with special rewards along the way and bonus rewards after.',
  'Fishing derbies: four-minute contests against three rival anglers. Medals pay well.',
  'Specialisations moved to their own Paths tab.',
  'Every water got a visual makeover: distant mountains, reflections, fish leaping in the distance, wildlife, sunbeams, and warmer light at night.',
  'New hats, outfits and pet colours, some of them only from the Tide Pass.',
  'New gear upgrades for the toughest fish yet.',
  'Phones in landscape now get a side-by-side layout, with the water on the left and menus on the right.',
  'Every tab has an icon now, and buttons, cards and panels got a polish.',
  'New feats for all of the above.' ]},
 {v:'0.1.7', name:'Try Before You Buy', items:[
  'Try things on before you buy them: clothes, hats, glasses and outfits on your angler, colours and accessories on your pet, water, floors and decorations in your tank.',
  'Prize Counter items now show a picture, and the wearable ones can be previewed.',
  '14 new shirt patterns are rotating into the clothing shop.',
  'The fishing vest, life jacket and captain’s coat can now be any colour.' ]},
 {v:'0.1.6', name:'Choices & Skies', items:[
  'Specialisations: four big choices on your angler’s path, each with a real trade-off. You can switch later, for a fee.',
  'Every skill now unlocks a special effect when fully learned. Some of them change how fishing feels.',
  'Wisdom Pearls can now be traded for permanent relics. Choose wisely.',
  'Keep an eye on the sky. Some rare weather has been spotted, and it isn’t subtle.',
  'The harbourmaster has new kinds of bounties, and now pays in Scales too.',
  'The update banner now tells you which update is waiting.' ]},
 {v:'0.1.5', name:'Rods, Pals & the Big Boardwalk', items:[
  'Pets can now be named, dyed and dressed up. They also really like being petted. Try tapping yours.',
  'Pets you pet often grow closer to you, and their bonus grows with them.',
  'A new Rods tab: a whole collection of rods, attachments and upgrades. Not every rod is for sale…',
  'Scales: a new material from rare catches, used for the finest gear.',
  'New baits on the shelf, some with very particular tastes.',
  'Rarer fish now pay out much more: coins, XP, aquarium income, and sometimes a little extra.',
  'Fishermen whisper about something rarer than Legendary.',
  'More fish in every water. Some of them seem to have spent too long on the internet.',
  'New pets to meet, new hats, outfits, glasses, hairstyles and beards.',
  'The aquarium has far more room for decorations, and there are plenty of new ones.',
  'The Boardwalk got a makeover: new games, tickets, a Prize Counter, and free spins every hour.',
  'Daily tasks and a daily gift.',
  'Bigger game window on large screens and in full screen.',
  'Resetting your progress now needs a typed confirmation, and keeps a backup you can restore.',
  'Patch notes! Hello.' ]},
 {v:'0.1.4', name:'The Boardwalk', items:['Settings with volume controls.','Cozy music and nature sounds.','Aquarium decorating and feeding.','Mastery stars and angler ranks.','Surprise mini-games.','The Boardwalk opens.','Lots of new pets.','A cleaner layout for phones.','A Windows desktop app.','The top bar no longer jumps around.']},
 {v:'0.1.3', name:'Take It With You', items:['Install Driftline as an app.','Plays offline and updates itself.','Save codes to move your progress between devices.']},
 {v:'0.1.2', name:'The Big Catch', items:['Three new waters.','Many more fish, each with its own fighting style.','Junk, oddities and treasure.','Hotspots.','Aquarium boosts.','A wardrobe, hats and pets.','The encyclopedia.']},
 {v:'0.1.1', name:'Deeper Waters', items:['Skills, the aquarium, weather, feats and voyages.']},
 {v:'0.1.0', name:'First Cast', items:['Driftline launches. Welcome to the water.']},
];

// ---------- quips: a little humour, never the main event ----------
const QUIPS = {
  snap:['The fish sends its regards.','Somewhere a fish is telling its friends about you.','Line: 0. Fish: 1.','That one’s going in the fish newspaper.','It’ll be back. With friends.'],
  lost:['It said “nah”.','Classic fish behaviour.','It had places to be.','It’s fine. You’ll find another. Probably.'],
  pet:['purrs','wiggles happily','does a little hop','leans in','looks very proud','approves'],
  sell:['The fishmonger nods, impressed.','The fishmonger counts it twice. Out loud.','“Pleasure doing business,” says the fishmonger, smelling of fish.','The fishmonger whistles.'],
  full:['Your cooler is full. Even the ice is complaining.','No room left. The cooler is begging you to stop.'],
  seashell:['A pretty seashell. Worth nothing. Treasure it anyway.','A seashell! The wheel thinks this is funny.'],
};
const quip = k => QUIPS[k] ? pick(QUIPS[k]) : '';

// ---------- rods ----------
// id, name, source, price, water needed, attachment slots, colour, stats, description
const RODS = [
 ['bamboo','Bamboo Rod','start',0,'pond',1,'#d9c7a0',{},'Simple and honest. Everyone starts here.'],
 ['willow','Willow Rod','shop',1500,'pond',1,'#a07a4a',{rare:.05,tension:.05},'Bends like a branch, never breaks.'],
 ['fibre','Fibreglass Rod','shop',6000,'river',2,'#e8e8e8',{reel:.08,tension:.08},'Light, springy and very forgiving.'],
 ['carbon','Carbon Pro','shop',25000,'coast',2,'#2a2a2a',{cast:1.1,rare:.1,reel:.1},'What the serious anglers use. Smells expensive.'],
 ['frostrod','Frostbite Rod','shop',60000,'frost',2,'#9ad8ff',{tension:.15,rare:.1,calm:.15},'Cold to the touch. Fish stay calmer on it.'],
 ['coralrod','Coral Caster','shop',120000,'reef',2,'#ff7a9a',{shiny:.5,rare:.15,bite:.1},'Grown, not built. Shiny fish love it.'],
 ['stormrod','Storm Rod','shop',300000,'shelf',3,'#5a6aca',{rare:.25,reel:.15,cast:1.1},'Hums faintly before thunder.'],
 ['abyssrod','Abyssal Spire','shop',800000,'deep',3,'#3a1a5a',{rare:.35,tension:.2,hook:.15},'Forged from something that lived very far down.'],
 ['scrap','Rusty Old Rod','junk',0,'pond',2,'#8a5a3a',{treasure:.6,trophy:.1},'Rusty and bent. Junk seems to love it anyway.'],
 ['golden','Golden Rod','crate',0,'pond',3,'#ffcc33',{sell:.25,shiny:.5},'Solid gold. The fishmonger can’t say no to it.'],
 ['tides','Rod of Tides','rank',0,'pond',3,'#3ad0c0',{rare:.3,hot:1,bite:.15},'The water itself points you to the good spots.'],
 ['spine','Leviathan Spine','feat',0,'pond',3,'#ff6ad5',{rare:.5,reel:.25,tension:.25},'Rumour says it once belonged to something mythic.'],
].map(a=>({id:a[0],name:a[1],src:a[2],price:a[3],need:a[4],slots:a[5],col:a[6],st:a[7],d:a[8]}));
const ROD_I = Object.fromEntries(RODS.map(r=>[r.id,r]));
// id, name, key, values per tier, description
const ATTS = [
 ['bobber','Bright Bobber','bite',[.08,.15,.25],'Fish notice your bait sooner.'],
 ['sinker','Lead Sinker','rare',[.05,.1,.18],'Gets your bait down to the good stuff.'],
 ['swivel','Ball Swivel','tension',[.05,.1,.16],'Stops the line from twisting under strain.'],
 ['bell','Bite Bell','hook',[.08,.15,.25],'Rings when they bite. More time to strike.'],
 ['charm','Lucky Charm','shiny',[.15,.3,.5],'A tiny four-leaf clover in resin.'],
 ['spool','Deep Spool','spool',[10,20,35],'More line before a runner gets away.'],
 ['bead','Glow Bead','night',[.1,.2,.35],'Glows in the dark. Night fish come to look.'],
 ['magnet','Magnet Tip','treasure',[.2,.4,.7],'Junk and treasure stick to it.'],
 ['feather','Feather Fly','trophy',[.1,.2,.35],'Big fish can’t resist a fancy feather.'],
 ['whistle','Calm Whistle','calm',[.08,.15,.25],'A soothing little tune. Tempers cool.'],
].map(a=>({id:a[0],name:a[1],k:a[2],v:a[3],d:a[4]}));
const ATT_I = Object.fromEntries(ATTS.map(a=>[a.id,a]));
const ATT_COST = [[1500,0],[12000,10],[60000,60]];
const rod = () => ROD_I[S.rods.eq] || ROD_I.bamboo;
const rodLvl = (id=S.rods.eq) => S.rods.lvl[id]||0;
function rodAtts(id=S.rods.eq){ return (S.rods.att[id]||[]).filter(a=>ATT_I[a] && S.atts[a]).slice(0,(ROD_I[id]||ROD_I.bamboo).slots); }
function attVal(a){ const t=S.atts[a]||0; return t ? ATT_I[a].v[t-1] : 0; }
function rodBonus(k){ if(!S.rods) return 0; const r=rod(), L=rodLvl(); let v=(r.st[k]||0);
  if(k==='reel') v+=.03*L; if(k==='tension') v+=.02*L; if(k==='rare') v+=.02*L;
  for(const a of rodAtts()){ const at=ATT_I[a]; if(at.k===k) v+=attVal(a); if(k==='rare' && at.k==='night' && isNight()) v+=attVal(a); }
  return v; }
const rodCast = () => S.rods ? (rod().st.cast||1) : 1;
const rodHook = () => S.rods ? (rod().st.hook||0) + rodAtts().filter(a=>a==='bell').reduce((s,a)=>s+attVal(a),0) : 0;
const rodSpool = () => S.rods ? rodAtts().filter(a=>a==='spool').reduce((s,a)=>s+attVal(a),0) : 0;
const rodUpCost = id => { const L=rodLvl(id); const r=ROD_I[id]; return {coins:Math.round(Math.max(5000,r.price)*.12*(L+1)), scales:(L+1)*(L+1)*2}; };
const statTxt = (k,v) => k==='cast'?'+'+Math.round((v-1)*100)+'% cast distance': k==='hook'?'+'+v.toFixed(2)+' s hook window': k==='spool'?'+'+v+' m of line': k==='night'?'+'+Math.round(v*100)+'% rare bonus at night': fmtB(k,v);
function grantRod(id){ if(S.rods.owned.includes(id)) return null; S.rods.owned.push(id); return {title:'New rod: '+ROD_I[id].name+'!', kind:'rod', id}; }
function rodSVG(col,lvl,id){ if(id==null&&col==="#2a4a55") return `<span style="display:inline-flex;align-items:center;justify-content:center;width:120px;height:40px;border-radius:20px;background:radial-gradient(closest-side,#5a82aa55,#1e344e33 70%,transparent);color:#cde1f5aa;font:700 26px system-ui">?</span>`; if(V3ON&&id&&ROD_I[id]) return rodImg3(id,lvl); return `<svg viewBox="0 0 120 40" width="120" height="40" aria-hidden="true"><path d="M8 34 Q60 30 112 6" stroke="${col}" stroke-width="4" fill="none" stroke-linecap="round"/><circle cx="24" cy="31" r="6" fill="#2a2a2a"/><circle cx="24" cy="31" r="2.5" fill="#8a8a8a"/>${lvl?`<text x="112" y="36" fill="#ffc94d" font-size="11" font-weight="700" text-anchor="end">Lv ${lvl}</text>`:''}</svg>`; }
function renderRods(P){ const r=rod(), atts=rodAtts();
  const stats=r=>{ const keys=Object.keys(r.st); return keys.length?keys.map(k=>statTxt(k,r.st[k])).join(' · '):'No special stats'; };
  const slotRow=(i)=>{ const cur=atts[i]||''; const opts=ATTS.filter(a=>S.atts[a.id] && (a.id===cur || !atts.includes(a.id)));
    return `<div class="slotrow"><b>Slot ${i+1}</b>
      <div class="chips"><button class="chipb" data-act="rodatt" data-k="${i}:" aria-pressed="${!cur}">None</button>${opts.map(a=>`<button class="chipb" data-act="rodatt" data-k="${i}:${a.id}" aria-pressed="${cur===a.id}" title="${esc(a.d)}">${a.name} <span class="meta">${statTxt(a.k,attVal(a.id))}</span></button>`).join('')}</div></div>`; };
  const up=rodUpCost(r.id), L=rodLvl();
  P.innerHTML=`<div class="row spread"><div><h2>Rods</h2><p class="sub">Your rod shapes every cast. Collect rods, upgrade them with coins and <b>Scales</b>, and fit attachments. Scales come from Rare and better fish.</p></div>
   <div style="text-align:right"><div class="pts" style="color:var(--kelp)">${fmt(S.scales)}</div><div class="sub">Scales</div></div></div>
  <div class="tile" style="margin-top:10px;border-color:${r.col}"><div class="row spread"><div class="row">${rodSVG(r.col,L,r.id)}<div><div class="rar" style="color:var(--gold)">In your hands</div><h4>${r.name}</h4><div class="meta">${esc(r.d)}</div></div></div>
    <div style="text-align:right"><div class="meta">Level ${L} / 10</div>${L<10?`<button class="btn sm" data-act="rodup" data-k="${r.id}" ${S.money>=up.coins&&S.scales>=up.scales?'':'disabled'}>Upgrade · <span class="coin">${fmt(up.coins)}</span> + ${up.scales} Scales</button>`:'<span class="badge g">Max level</span>'}</div></div>
    <div class="meta">${stats(r)}${L?` · Level bonus: +${3*L}% reel speed, −${2*L}% line tension, +${2*L}% rare bonus`:''}</div>
    <h5>Attachments (${r.slots} slot${r.slots>1?'s':''})</h5>${Array.from({length:r.slots},(_,i)=>slotRow(i)).join('')}
    ${!Object.keys(S.atts).length?'<p class="sub">Buy attachments below, then fit them here.</p>':''}</div>
  <h2 style="margin-top:16px">Rod rack</h2><div class="grid">${RODS.map(x=>{ const own=S.rods.owned.includes(x.id), here=S.rods.eq===x.id, open=S.unlocked.includes(x.need), hidden=!own&&x.src!=='shop'&&x.src!=='start';
    const btn = here?'<button class="btn alt sm" disabled>Equipped</button>' : own?`<button class="btn sm" data-act="rodeq" data-k="${x.id}">Equip</button>` : x.src==='shop'?(open?`<button class="btn sm" data-act="rodbuy" data-k="${x.id}" ${S.money>=x.price?'':'disabled'}>Buy · <span class="coin">${fmt(x.price)}</span></button>`:`<span class="meta">Unlock ${LOCS[locIdx(x.need)].name} first</span>`) : '<span class="meta">Not sold anywhere. Keep fishing…</span>';
    return `<div class="tile ${here?'done':''}">${rodSVG(hidden?"#2a4a55":x.col,own?rodLvl(x.id):0,hidden?null:x.id)}<h4>${hidden?'???':x.name}</h4><div class="meta">${hidden?'How to get it: '+esc(rodHint(x)):esc(x.d)}</div><div class="meta">${hidden?'':stats(x)+' · '+x.slots+' slot'+(x.slots>1?'s':'')}</div>${btn}</div>`; }).join('')}</div>
  <h2 style="margin-top:16px">Attachments</h2><p class="sub">Each attachment has three tiers. Once you own one, it fits on any rod.</p><div class="grid">${ATTS.map(a=>{ const t=S.atts[a.id]||0, next=t<3?ATT_COST[t]:null;
    return `<div class="tile"><div class="row spread"><h4>${a.name}</h4><span class="meta">Tier ${t} / 3</span></div><div class="pips">${[0,1,2].map(i=>`<i class="${i<t?'on':''}"></i>`).join('')}</div><div class="meta">${esc(a.d)}</div>
      <div class="val" style="font-size:14px">${t?statTxt(a.k,a.v[t-1]):'Not owned'}${next?` <span class="meta">→ ${statTxt(a.k,a.v[t])}</span>`:''}</div>
      ${next?`<button class="btn sm" data-act="attbuy" data-k="${a.id}" ${S.money>=next[0]&&S.scales>=next[1]?'':'disabled'}>${t?'Upgrade':'Buy'} · <span class="coin">${fmt(next[0])}</span>${next[1]?' + '+next[1]+' Scales':''}</button>`:'<span class="badge g">Max tier</span>'}</div>`; }).join('')}</div>`; }

// ---------- pets: looks, petting, bond ----------
const PET_HEAD = {dog:[8,-13,4.2],cat:[1,-14,4],frog:[0,-8.5,3.5],duck:[5,-11,3.3],goat:[8.5,-14,3.6],turtle:[7,-3,2.3],sheep:[8,-10,3],otter:[0,-18,3.7],owl:[0,-13,4],llama:[6.5,-27,3],capybara:[8,-9,4],
  parrot:[1,-15,3],lizard:[8,-3,2.5],horse:[17,-38,4],penguin:[.5,-17,3.6],crab:[0,-4,3.5],rabbit:[6,-11,4],hamster:[0,-6,4.5],chicken:[4,-14,3.4],pig:[8,-10,4.2],hedgehog:[6,-3.5,3],fox:[7,-12,3.8],
  raccoon:[7,-11,4],seal:[9,-8,4],redpanda:[7,-11,4],snail:[-1,-7,5],bat:[0,-1,3.5],axopet:[8,-5,3.2],flamingo:[8.5,-27,2.4],pelican:[3,-18,3.4],panda:[7,-12,4.4],koala:[1,-15,4.5],monkey:[1,-15,4],
  polarbear:[8,-11,4.6],octopus:[0,-9,6],ghost:[0,-10,7],robot:[0,-16,5],slime:[0,-8,7],dragon:[7,-12,4],unicorn:[13,-26,4],corgi:[8,-11,4],shiba:[8,-12,4],goose:[6,-20,3],squirrel:[3,-13,3.6],
  beaver:[7,-9,4],cow:[10,-15,4.5],sloth:[2,-12,4],deer:[9,-19,3.6],jelly:[0,-12,6],tiger:[8,-12,4.2],phoenix:[5,-17,3.6],narwhal:[6,-7,4],teddy:[0,-15,5]};
const PET_TINTS = [['none','Natural',0,''],['rose','Rose',800,'hue-rotate(-40deg) saturate(1.3)'],['mint','Mint',800,'hue-rotate(90deg)'],['sky','Sky',800,'hue-rotate(180deg)'],['violet','Violet',1500,'hue-rotate(250deg) saturate(1.2)'],
  ['shadow','Shadow',5000,'brightness(.5) contrast(1.2)'],['snow','Snow',5000,'grayscale(1) brightness(1.55)'],['golden','Golden',0,'sepia(1) saturate(3) hue-rotate(-10deg) brightness(1.1)'],['rainbow','Rainbow',0,'rainbow'],
  ['tidal','Tidal',0,'hue-rotate(160deg) saturate(1.5) brightness(1.1)'],['peach','Peach',1200,'sepia(.6) hue-rotate(-20deg) saturate(1.6)'],['lavender','Lavender',1500,'hue-rotate(220deg) saturate(.8) brightness(1.15)'],['cocoa','Cocoa',1200,'sepia(1) saturate(1.2) brightness(.7)']];
const PET_ACCS = [['none','Nothing',0],['bandana','Bandana',0],['bow','Bow',600],['bowtie','Bow tie',1200],['scarf','Scarf',900],['bell','Bell collar',1000],['flower','Flower',800],['glasses','Sunglasses',1500],['cape','Hero cape',3000],['balloon','Star balloon',0],['partyhat','Party hat',0]];
const PRIZE_TINT = {golden:600, rainbow:1200, tidal:1}, PRIZE_ACC = {balloon:150, partyhat:250};
let PET_EDIT=null; const editPet = () => (PET_EDIT && (PET_EDIT===S.pet||PET_EDIT===S.pet2)) ? PET_EDIT : S.pet;
function petLook(id=editPet()){ if(!S.petLook[id]) S.petLook[id]={name:'',tint:'none',hat:'none',hatCol:'#c8553a',acc:'none',accCol:'#d8303a'}; return S.petLook[id]; }
const petName = (id=S.pet) => (S.petLook[id]&&S.petLook[id].name) || PETI[id].name;
function bondLevel(id){ const b=S.bond&&S.bond[id]; return b ? Math.min(10, Math.floor(Math.sqrt(b.xp/4))) : 0; }
function tintFilter(lk,t){ const tt=PET_TINTS.find(x=>x[0]===lk.tint); if(!tt||!tt[3]) return 'none'; return tt[3]==='rainbow' ? 'hue-rotate('+((t*80)%360|0)+'deg) saturate(1.4)' : tt[3]; }
function petOffset(id,t){ if(id==='frog') return [0,-Math.pow(Math.max(0,Math.sin(t*1.4)),10)*7]; if(id==='bat') return [0,-14+Math.sin(t*2)*2]; if(id==='ghost') return [0,Math.sin(t*2)*2-4]; if(id==='crab') return [Math.sin(t*1.2)*2,0]; return [0,0]; }
function drawPetGear(c,id,lk,t){ if(id==='lily'){ drawLilyGear(c,lk,t); return; } if(id==='daxniko'){ drawPairGear(c,lk,t); return; } const a=PET_HEAD[id]||[2,-12,4]; const [hx,hy,r]=a; const k=r/7.5;
  const col=lk.accCol||'#d8303a';
  c.save(); c.lineCap='round';
  if(lk.acc==='cape'){ c.fillStyle=col; c.beginPath(); c.moveTo(hx-r*.9,hy+r*.8); c.quadraticCurveTo(hx-r*3.4,hy+r*2+Math.sin(t*4)*1.2,hx-r*3,hy+r*3.6); c.lineTo(hx-r*.4,hy+r*2.4); c.closePath(); c.fill(); }
  if(lk.acc==='balloon'){ c.strokeStyle='#ddd'; c.lineWidth=.5; c.beginPath(); c.moveTo(hx-r,hy+r); c.quadraticCurveTo(hx-r*2,hy-r*3,hx-r*1.6+Math.sin(t*1.5)*1.5,hy-r*6); c.stroke(); c.fillStyle='#ffd84a'; c.save(); c.translate(hx-r*1.6+Math.sin(t*1.5)*1.5,hy-r*6.6); c.beginPath(); for(let i=0;i<10;i++){ const ang=-Math.PI/2+i*Math.PI/5, rr=i%2?r*.6:r*1.4; c.lineTo(Math.cos(ang)*rr,Math.sin(ang)*rr); } c.fill(); c.restore(); }
  if(lk.hat && lk.hat!=='none'){ c.save(); c.translate(hx,hy); c.scale(k,k); drawHat(c,lk.hat,HATI[lk.hat]&&HATI[lk.hat].fixed?'#888888':(lk.hatCol||'#c8553a'),t); c.restore(); }
  if(lk.acc==='partyhat'){ c.save(); c.translate(hx,hy); c.scale(k,k); drawHat(c,'party',col,t); c.restore(); }
  const nx=hx-r*.2, ny=hy+r*1.05;
  if(lk.acc==='bandana'){ c.fillStyle=col; c.beginPath(); c.moveTo(nx-r*.9,ny-r*.2); c.lineTo(nx+r*.9,ny-r*.2); c.lineTo(nx,ny+r*.8); c.closePath(); c.fill(); }
  if(lk.acc==='scarf'){ c.fillStyle=col; c.fillRect(nx-r*.9,ny-r*.25,r*1.8,r*.45); c.fillRect(nx-r*.9,ny,r*.4,r*1.1); }
  if(lk.acc==='bowtie'||lk.acc==='bow'){ const bx=lk.acc==='bow'?hx-r*.7:nx, by=lk.acc==='bow'?hy-r*.9:ny; c.fillStyle=col; c.beginPath(); c.moveTo(bx,by); c.lineTo(bx-r*.6,by-r*.35); c.lineTo(bx-r*.6,by+r*.35); c.closePath(); c.moveTo(bx,by); c.lineTo(bx+r*.6,by-r*.35); c.lineTo(bx+r*.6,by+r*.35); c.closePath(); c.fill(); c.beginPath(); c.arc(bx,by,r*.15,0,7); c.fill(); }
  if(lk.acc==='bell'){ c.strokeStyle=col; c.lineWidth=r*.25; c.beginPath(); c.moveTo(nx-r*.8,ny-r*.2); c.lineTo(nx+r*.8,ny-r*.2); c.stroke(); c.fillStyle='#ffcc33'; c.beginPath(); c.arc(nx,ny+r*.15,r*.3,0,7); c.fill(); }
  if(lk.acc==='flower'){ const fx=hx-r*.6, fy=hy-r*.75; for(let i=0;i<5;i++){ c.fillStyle='#ff9ad0'; c.beginPath(); c.arc(fx+Math.cos(i*1.26)*r*.28,fy+Math.sin(i*1.26)*r*.28,r*.2,0,7); c.fill(); } c.fillStyle='#ffd84a'; c.beginPath(); c.arc(fx,fy,r*.15,0,7); c.fill(); }
  if(lk.acc==='glasses'){ c.fillStyle='#111'; c.beginPath(); c.ellipse(hx+r*.25,hy-r*.15,r*.32,r*.22,0,0,7); c.ellipse(hx+r*.85,hy-r*.15,r*.28,r*.2,0,0,7); c.fill(); c.strokeStyle='#111'; c.lineWidth=r*.1; c.beginPath(); c.moveTo(hx+r*.5,hy-r*.18); c.lineTo(hx+r*.6,hy-r*.18); c.stroke(); }
  c.restore(); }
function drawPetStyled(c,id,x,y,s,t,night=0,lkOver=null){ const lk=lkOver||petLook(id); if(id==='lily') LILY.lk=lk; if(id==='daxniko') PAIR.lk=lk; c.save(); c.filter=tintFilter(lk,t); drawPet(c,id,x,y,s,t,night,lk); c.restore();
  if(V3ON && id!=='lily' && id!=='daxniko' && PET3[id]){ drawGear3(c,id,lk,t); return; }
  const o=petOffset(id,t); c.save(); c.translate(x+o[0]*s,y+o[1]*s); c.scale(s,s); if(id==='slime'){ const sq=1+Math.sin(t*3)*.08; c.scale(1/sq,sq); } drawPetGear(c,id,lk,t); c.restore(); }
let PET_NIGHT=0, PET_BOX=null, PET_BOX2=null, hearts=[], petT=-9999, petT2=-9999, lastPetAt=0, petNameFor=null;
function drawOnePet(id,px,ay,sc,t,night,pt){ const big=id==='horse'||id==='cow'; const s=sc*(big?.85:1);
  const k=(performance.now()-pt)/650; g.save(); if(k>=0&&k<1){ const b=Math.sin(k*Math.PI); g.translate(px,ay); g.scale(1+.1*b,1-.12*b); g.translate(-px,-ay-b*7*sc); }
  drawPetStyled(g,id,px,ay,s,t,night*.6); g.restore(); return {x0:px-18*s,x1:px+(big?22:16)*s,y0:ay-(big?48:30)*s,y1:ay+4,k}; }
function drawPetScene(ax,ay,sc,t,night){ PET_NIGHT=night; const id=S.pet, big=id==='horse'||id==='cow'; const px=(S.dock&&S.dock.petPos!=null&&G.st!=='rest')?scenePetX(S.dock.petPos):ax-(big?44:31)*sc;
  if(S.pet2&&PETI[S.pet2]){ const big2=S.pet2==='horse'||S.pet2==='cow'; let x2=px-(big?22:15)*sc-(big2?36:26)*sc, y2=ay; if(S.dock&&S.dock.pet2Pos!=null&&G.st!=='rest') x2=scenePetX(S.dock.pet2Pos); else if(x2-(big2?20:13)*sc<2){ x2=px-(big?24:15)*sc; y2=ay-2.2*sc; } PET_BOX2=drawOnePet(S.pet2,x2,y2,sc*.9,t,night,petT2); } else PET_BOX2=null;
  PET_BOX=drawOnePet(id,px,ay,sc,t,night,petT);
  const two=PET_BOX2&&PET_BOX2.k<PET_BOX.k, nb=two?PET_BOX2:PET_BOX, nmId=two?S.pet2:id, k=nb.k;
  if(k>=0&&k<2.2){ const nm=(nmId===id&&S.pet2?'★ ':'')+petName(nmId), cx=(nb.x0+nb.x1)/2; g.font='700 11px system-ui'; g.textAlign='center'; const tw=g.measureText(nm).width; g.globalAlpha=Math.min(1,2.2-k); g.fillStyle='rgba(5,14,20,.7)'; rr(cx-tw/2-7,nb.y0-22,tw+14,17,8); g.fill(); g.fillStyle='#ffc94d'; g.fillText(nm,cx,nb.y0-10); g.globalAlpha=1; }
  for(let i=hearts.length-1;i>=0;i--){ const h=hearts[i]; h.t+=1/60; if(h.t>1.4){ hearts.splice(i,1); continue; } const hy=h.y-h.t*40, hx=h.x+Math.sin(h.t*5+i)*6; g.globalAlpha=Math.max(0,1-h.t/1.4); g.fillStyle='#ff6a9a'; g.beginPath(); const z=h.s; g.moveTo(hx,hy+z*.4); g.bezierCurveTo(hx-z,hy-z*.3,hx-z*.5,hy-z,hx,hy-z*.4); g.bezierCurveTo(hx+z*.5,hy-z,hx+z,hy-z*.3,hx,hy+z*.4); g.fill(); } g.globalAlpha=1; }
const inPetBox = (m,b) => b && m.x>=b.x0 && m.x<=b.x1 && m.y>=b.y0 && m.y<=b.y1;
function petHit(e){ if(!e||!PET_BOX) return false; const m=canvasXY(e); const hit=inPetBox(m,PET_BOX)?S.pet:inPetBox(m,PET_BOX2)?S.pet2:null; if(!hit) return false;
  const now=performance.now(); if(now-lastPetAt<300) return true; lastPetAt=now; const bx=hit===S.pet?PET_BOX:PET_BOX2; if(hit===S.pet) petT=now; else petT2=now;
  for(let i=0;i<3;i++) hearts.push({x:(bx.x0+bx.x1)/2+rnd(-8,8), y:bx.y0+rnd(0,8), t:-i*.12, s:rnd(4,7)});
  tone(880,.08,'sine',.05); tone(1320,.12,'sine',.04,0,.08); petTap(hit); return true; }
// one pet (on the dock or in the Pets tab). The favourite bonds twice as fast.
function petTap(id){ const today=dayKey(); const b=S.bond[id]||(S.bond[id]={xp:0,day:today,today:0}); if(b.day!==today){ b.day=today; b.today=0; }
  const before=bondLevel(id); if(b.today<25){ b.today++; b.xp+=id===S.pet?2:1; } S.gstats.pets++; taskProgress('pet',1);
  if(maxed('petpal') && Date.now()-(S.petGiftT||0)>3600000 && Math.random()<.35){ S.petGiftT=Date.now(); const r=Math.random(); let gift;
    if(r<.4){ gift=fmt(earn(bestLoot()*rnd(2,5)*coinMult()))+' coins'; } else if(r<.75){ const sc=rint(3,8); S.scales+=sc; gift=sc+' Scales'; } else { const opts=Object.keys(BAIT).filter(k=>k!=='worm'&&!BAIT[k].junk&&!BAIT[k].scales); const k=pick(opts); S.bait[k]+=5; renderBait(); gift='5 '+BAIT[k].name; }
    setTimeout(()=>toast(petName(id)+' brought you a gift: '+gift+'!'),600); sfx.coin(); }
  refreshPetInfo(); const after=bondLevel(id); if(after>before){ toast(petName(id)+' feels closer to you. Bond level '+after+'! (+'+after*5+'% pet bonus)'); sfx.shiny(); } else if(Math.random()<.25) toast(petName(id)+' '+quip('pet')+'.');
  checkFeats(); save(); }
function petBondText(id){ const bl=bondLevel(id), b=S.bond[id], p=PETI[id], fav=id===S.pet; const val=fav?petVal(id):petVal(id)*compShare();
  return `Bonus: <span class="aq">${fmtB(p.k,val)}</span>${bl?' (bond +'+bl*5+'%)':''}${fav?'':' ('+Math.round(compShare()*100)+'% as your companion, rising with bond)'}. ${bl<10?`Pet them to grow closer: ${b?b.xp:0} / ${Math.pow(bl+1,2)*4}. Up to 25 pets a day count${b&&b.today>=25?' (that’s today’s 25!)':''}${fav?', and favourites bond twice as fast':''}.`:'You’re best friends.'}`; }
function petCustomHTML(){ const id=editPet(), lk=petLook(id), p=PETI[id], bl=bondLevel(id);
  const pvOn=(kind,id)=>PET_PV&&PET_PV.kind===kind&&PET_PV.id===id;
  const tints=PET_TINTS.filter(x=>x[2]||S.petTints.includes(x[0])||!(x[0] in PRIZE_TINT)).map(x=>{ const own=S.petTints.includes(x[0]); return `<button class="chipb" data-act="${own?'pettint':'petpv'}" data-k="${own?x[0]:'tint:'+x[0]}" aria-pressed="${lk.tint===x[0]||pvOn('tint',x[0])}"><span class="tint-dot" style="${x[3]==='rainbow'?'background:linear-gradient(90deg,#ff6a6a,#ffd84a,#6aff8a,#5ab8ff,#b88aff)':'background:#c8945a;'+(x[3]?'filter:'+x[3]:'')}"></span>${x[1]}${own?'':' · '+fmt(x[2])}</button>`; }).join('');
  const accs=PET_ACCS.filter(x=>x[2]||S.petAccs.includes(x[0])||!PRIZE_ACC[x[0]]).map(x=>{ const own=S.petAccs.includes(x[0]); return `<button class="chipb" data-act="${own?'petacc':'petpv'}" data-k="${own?x[0]:'acc:'+x[0]}" aria-pressed="${lk.acc===x[0]||pvOn('acc',x[0])}">${x[1]}${own?'':' · '+fmt(x[2])}</button>`; }).join('');
  const hats=HATS.filter(h=>S.owned.hats.includes(h.id)).map(h=>`<button class="chipb" data-act="pethat" data-k="${h.id}" aria-pressed="${lk.hat===h.id}">${esc(h.name)}</button>`).join('');
  const cols=[...FREE_COLS,...S.owned.cols]; const sw=k=>`<div class="chips">${cols.map(cl=>`<button class="sw" data-act="petcol" data-k="${k}" data-v="${cl}" aria-pressed="${lk[k]===cl}" style="background:${cl}" title="${cl}"></button>`).join('')}</div>`;
  const pick2 = S.pet2 ? `<div class="chips" style="margin-bottom:8px"><span class="meta" style="align-self:center">Dressing up:</span><button class="chipb" data-act="petedit" data-k="${S.pet}" aria-pressed="${id===S.pet}">★ ${esc(petName(S.pet))}</button><button class="chipb" data-act="petedit" data-k="${S.pet2}" aria-pressed="${id===S.pet2}">${esc(petName(S.pet2))}</button></div>` : '';
  return `<div class="tile" style="margin-top:10px">${petPvBarHTML()}${pick2}<div class="stylewrap petwrap" style="margin-top:0"><div class="preview"><canvas id="petcv" width="400" height="300" style="cursor:pointer" title="Pet me!"></canvas></div><div>
    <div class="row spread"><h4>${id===S.pet?'<span title="Favourite" style="color:#ffc94d">★</span> ':''}${esc(petName(id))} <span class="meta">the ${(id==="lily"||id==="daxniko")?p.name:p.name.toLowerCase()}${S.pet2?(id===S.pet?' · favourite':' · companion'):''}</span></h4><span id="petbond"><span class="meta">Bond ${'♥'.repeat(bl)}${'♡'.repeat(10-bl)}</span></span></div>
    <div class="meta" id="petbondinfo">${petBondText(id)}</div>
    <div class="meta" style="color:#ff9ac0">Tap ${esc(petName(id))} in the picture to pet them.</div>
    <h5>Name</h5><input id="petname" maxlength="16" value="${esc(lk.name)}" placeholder="${esc(p.name)}" style="width:100%;background:#0a161d;color:var(--ink);border:1px solid var(--line);border-radius:9px;padding:8px">
    <h5>Colour</h5><div class="chips">${tints}</div>
    <h5>Accessory</h5><div class="chips">${accs}</div>${lk.acc!=='none'&&lk.acc!=='balloon'?'<h5>Accessory colour</h5>'+sw('accCol'):''}
    <h5>Hat <span style="text-transform:none;letter-spacing:0">(shares your hat collection)</span></h5><div class="chips">${hats}</div>${lk.hat!=='none'&&!(HATI[lk.hat]&&HATI[lk.hat].fixed)?'<h5>Hat colour</h5>'+sw('hatCol'):''}
  </div></div></div>`; }
function paintPetCustom(){ const c=$('petcv'); if(!c) return; const id=editPet();
  if((id==='lily'||id==='daxniko')&&!paintPetCustom.live){ paintPetCustom.live=true; const step=()=>{ if(!$('petcv')||!['lily','daxniko'].includes(editPet())){ paintPetCustom.live=false; return; } paintPetCustom(); requestAnimationFrame(step); }; requestAnimationFrame(step); } const x=c.getContext('2d'); x.clearRect(0,0,c.width,c.height); const big=id==='horse'||id==='cow'; const now=performance.now(), k=(now-(id===S.pet?petT:petT2))/700;
  x.save(); if(k>=0&&k<1){ const b=Math.sin(k*Math.PI); x.translate(200,250); x.scale(1+.08*b,1-.1*b); x.translate(-200,-250-b*28); }
  if(V3ON){ x.save(); x.setTransform(1,0,0,1,0,0); v3Pedestal(x,200,250,128,now/1000); x.restore(); } PET_NIGHT=0; drawPetStyled(x,id,200,250,petFitScale(id),now/1000,0,petPreviewLook(id)); x.restore();
  if(k>=0&&k<1.6){ for(let i=0;i<4;i++){ const hk=k-i*.12; if(hk<0) continue; const hx=170+i*22+Math.sin(hk*6+i)*10, hy=150-hk*110, z=12; x.globalAlpha=Math.max(0,1-hk/1.4); x.fillStyle='#ff6a9a'; x.beginPath(); x.moveTo(hx,hy+z*.4); x.bezierCurveTo(hx-z,hy-z*.3,hx-z*.5,hy-z,hx,hy-z*.4); x.bezierCurveTo(hx+z*.5,hy-z,hx+z,hy-z*.3,hx,hy+z*.4); x.fill(); } x.globalAlpha=1; requestAnimationFrame(paintPetCustom); }
  c.onclick=()=>{ const pid=editPet(); for(let i=0;i<3;i++) setTimeout(()=>tone(900+i*200,.08,'sine',.04),i*70); if(pid===S.pet) petT=performance.now(); else petT2=performance.now(); petTap(pid); requestAnimationFrame(paintPetCustom); }; }
// update the bond text without rebuilding the whole tab (so the petting animation keeps playing)
function refreshPetInfo(){ if(S.tab!=='pets') return; const el=$('petbond'); if(!el) return; const id=editPet(), bl=bondLevel(id);
  el.innerHTML=`<span class="meta">Bond ${'♥'.repeat(bl)}${'♡'.repeat(10-bl)}</span>`; const inf=$('petbondinfo'); if(inf) inf.innerHTML=petBondText(id); }

// ---------- daily tasks & gift ----------
function dayKey(d=new Date()){ return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0'); }
const rint = (a,b) => a+Math.floor(Math.random()*(b-a+1));
function makeTasks(){ const L=pick(S.unlocked), base=bestLoot(); const pool=[
  {t:'catch', n:rint(10,20), d:'Land {n} fish'}, {t:'catchat', loc:L, n:rint(5,10), d:'Land {n} fish at '+LOCS[locIdx(L)].name}, {t:'rare', n:rint(2,4), d:'Land {n} Rare or better fish'},
  {t:'pet', n:rint(5,10), d:'Pet {pet} {n} times'}, {t:'hot', n:rint(2,3), d:'Land {n} catches from hotspots'}, {t:'junk', n:2, d:'Fish up {n} pieces of junk'},
  {t:'earn', n:Math.round(base*rint(15,30)), start:S.stats.earned, d:'Earn {n} coins'}, {t:'game', n:rint(1,3), d:'Play {n} Boardwalk games'} ];
  const out=[]; while(out.length<3){ const x=pick(pool); if(out.some(o=>o.t===x.t)) continue; out.push(Object.assign({have:0, claimed:false, coins:Math.round(base*rnd(4,8)), scales:rint(3,8)},x)); } return out; }
function ensureDaily(){ const k=dayKey(); if(!S.daily||S.daily.day!==k) S.daily={day:k, tasks:makeTasks(), bonus:false}; return S.daily; }
function taskHave(t){ return t.t==='earn' ? Math.max(0,S.stats.earned-t.start) : t.have; }
function taskProgress(type,n,sp){ const d=ensureDaily(); for(const t of d.tasks){ if(t.claimed) continue; if(t.t===type || (t.t==='catchat' && type==='catch' && sp && sp.loc===t.loc)) t.have=Math.min(t.n,t.have+n); } }
function dailyLogin(){ const k=dayKey(), y=dayKey(new Date(Date.now()-86400000)); if(S.login.last===k) return null; S.login.streak = S.login.last===y ? S.login.streak+1 : 1; S.login.last=k;
  if(!S.stats.caught && !S.savedAt) return null; const day=S.login.streak, mult=Math.min(3,1+day*.25); const coins=earn(bestLoot()*3*mult*coinMult()); const sc=Math.min(10,day); S.scales+=sc; let extra='';
  if(day%7===0){ S.tokens.big++; extra=' and a big Mystery Crate'; } S.freeSpins=Math.min(3,S.freeSpins+1);
  return 'Daily gift, day '+day+': +'+fmt(coins)+' coins, +'+sc+' Scales, a free spin'+extra+'!'; }
function dailyHTML(){ const d=ensureDaily(); const done=d.tasks.filter(t=>taskHave(t)>=t.n).length;
  return `<div class="tile" style="margin-bottom:12px"><div class="row spread"><div><h4>Daily tasks</h4><div class="meta">New tasks every day. Finish all three for a bonus crate. Login streak: ${S.login.streak} day${S.login.streak===1?'':'s'}.</div></div><span class="meta">${done} / 3</span></div>
   ${d.tasks.map((t,i)=>{ const h=Math.min(t.n,taskHave(t)), ok=h>=t.n; return `<div class="toggle"><div style="min-width:0"><b>${esc(t.d.replace('{n}',fmt(t.n)).replace('{pet}',petName()))}</b><div class="meta">${fmt(h)} / ${fmt(t.n)} · reward <span class="coin">${fmt(t.coins)}</span> + ${t.scales} Scales</div><div class="prog"><i style="width:${h/t.n*100}%"></i></div></div>
     ${t.claimed?'<span class="badge g">Done</span>':`<button class="btn sm" data-act="taskclaim" data-i="${i}" ${ok?'':'disabled'}>Claim</button>`}</div>`; }).join('')}
   ${d.tasks.every(t=>t.claimed)?(d.bonus?'<p class="sub">Bonus collected. See you tomorrow!</p>':'<button class="btn" data-act="taskbonus" style="margin-top:8px">Claim bonus crate</button>'):''}</div>`; }

// ---------- patch notes ----------
function patchHTML(p){ return `<div class="rar" style="color:var(--gold)">${p.label?esc(p.label):"Update "+p.v}</div><h3>${esc(p.name)}</h3><ul style="text-align:left;margin:8px 0 0;padding-left:20px;line-height:1.55">${p.items.map(i=>i.startsWith("## ")?`<li class="pn-h">${esc(i.slice(3))}</li>`:`<li>${esc(i)}</li>`).join('')}</ul>`; }
function showPatchNotes(p=PATCHES[0], after){ G.st='event'; $('evin').innerHTML=patchHTML(p)+`<div class="row" style="justify-content:center;margin-top:12px"><button class="btn" data-ev="skip">Let’s fish!</button></div>`; $('evcard').hidden=false;
  if(after) setTimeout(()=>toast(after),400); }
function allPatchesHTML(){ return (S.owned.pets.includes("lily")?[LILY_PATCH]:[]).concat(S.owned.pets.includes("daxniko")?[PAIR_PATCH]:[]).concat(PATCHES).map(p=>`<details ${p===PATCHES[0]?'open':''} style="margin:6px 0"><summary style="cursor:pointer"><b>${p.label?esc(p.label):"Update "+p.v}</b> · ${esc(p.name)}</summary><ul style="margin:6px 0;padding-left:20px;line-height:1.5">${p.items.map(i=>i.startsWith("## ")?`<li class="pn-h">${esc(i.slice(3))}</li>`:`<li class="meta" style="color:var(--ink)">${esc(i)}</li>`).join('')}</ul></details>`).join(''); }

// ---------- safe reset ----------
const BACKUP_KEY='driftline-backup';
function hasBackup(){ try{ return !!localStorage.getItem(BACKUP_KEY); }catch(e){ return false; } }
function dangerHTML(){ const bk=hasBackup();
  return `<details class="tile" style="margin-top:12px;border-color:#ff546855"><summary style="cursor:pointer"><b>Danger zone</b> <span class="meta">· reset progress</span></summary>
   <p class="sub">This erases your coins, fish, pets, rods, everything. A backup is saved first, so you can restore it on this device afterwards.</p>
   <label class="meta" for="resetword">Type <b>DELETE</b> to confirm</label><div class="row" style="margin-top:6px"><input id="resetword" autocomplete="off" style="background:#0a161d;color:var(--ink);border:1px solid var(--line);border-radius:9px;padding:7px;width:140px">
   <button class="btn sm" id="resetbtn" data-act="safereset" style="background:var(--danger)" disabled>Erase everything</button></div>
   ${bk?'<div class="toggle"><div><b>Restore backup</b><div class="meta">Bring back the progress you had before your last reset.</div></div><button class="btn alt sm" data-act="restorebk">Restore</button></div>':''}</details>`; }
document.addEventListener('fullscreenchange',()=>setTimeout(resize,60));
document.addEventListener('input',e=>{ if(e.target.id==='resetword'){ const b=$('resetbtn'); if(b) b.disabled=e.target.value.trim()!=='DELETE'; } });
document.addEventListener('change',e=>{ if(e.target.id==='petname'){ petLook().name=e.target.value.trim().slice(0,16); save(); lastHud=''; toast(petName()+' likes that name.'); } });

// ---------- Boardwalk 2.0 ----------
const SPIN_EVERY = 3600*1000, SPIN_BANK = 3;
function accrueSpins(){ const now=Date.now(); if(!S.wheelT){ S.wheelT=now; return; } const h=Math.floor((now-S.wheelT)/SPIN_EVERY); if(h>0){ S.freeSpins=Math.min(SPIN_BANK,S.freeSpins+h); S.wheelT = S.freeSpins>=SPIN_BANK ? now : S.wheelT+h*SPIN_EVERY; } }
const PRIZES = [
 ['scales10','10 Scales',100,()=>{ S.scales+=10; return '10 Scales'; }],
 ['crate','Small Mystery Crate',120,()=>{ S.tokens.small++; return 'a small Mystery Crate'; }],
 ['myth','3 Myth Bait',220,()=>{ S.bait.mythbait=(S.bait.mythbait||0)+3; renderBait(); return '3 Myth Bait'; }],
 ['balloon','Star balloon (pet accessory)',150,()=>{ S.petAccs.push('balloon'); return 'a star balloon for your pet'; },()=>S.petAccs.includes('balloon')],
 ['partyhat','Party hat (pet accessory)',250,()=>{ S.petAccs.push('partyhat'); return 'a tiny party hat for your pet'; },()=>S.petAccs.includes('partyhat')],
 ['golden','Golden pet colour',600,()=>{ S.petTints.push('golden'); return 'the Golden pet colour'; },()=>S.petTints.includes('golden')],
 ['carousel','Carousel (aquarium decor)',700,()=>{ S.aq.owned.push('carousel'); return 'a Carousel for your aquarium'; },()=>S.aq.owned.includes('carousel')],
 ['sixsevencap','67 Cap (hat)',670,()=>{ S.owned.hats.push('sixsevencap'); return 'the 67 Cap'; },()=>S.owned.hats.includes('sixsevencap')],
 ['carnival','Carnival Top Hat (hat)',900,()=>{ S.owned.hats.push('carnival'); return 'the Carnival Top Hat'; },()=>S.owned.hats.includes('carnival')],
 ['fishbowl','Fishbowl Helmet (hat)',1100,()=>{ S.owned.hats.push('fishbowl'); return 'the Fishbowl Helmet'; },()=>S.owned.hats.includes('fishbowl')],
 ['rainbow','Rainbow pet colour',1200,()=>{ S.petTints.push('rainbow'); return 'the Rainbow pet colour'; },()=>S.petTints.includes('rainbow')],
 ['teddy','Teddy Bear (pet)',1500,()=>{ S.owned.pets.push('teddy'); return 'a Teddy Bear pet!'; },()=>S.owned.pets.includes('teddy')],
 ['spacesuit','Space suit (outfit)',1800,()=>{ S.owned.outfits.push('spacesuit'); return 'a Space suit'; },()=>S.owned.outfits.includes('spacesuit')],
];
function addTickets(n){ n=Math.max(0,Math.round(n)); S.tickets+=n; return n; }
let duck=null, hilo=null;
function newDuck(){ const prizes=[]; for(let i=0;i<6;i++){ const r=Math.random(); prizes.push(r<.04?{k:'crate',t:'a small crate!'}:r<.2?{k:'coins',m:rnd(2,4)}:r<.5?{k:'tix',n:rint(20,45)}:{k:'tix',n:rint(5,15)}); } duck={prizes, pick:-1}; }
function newHilo(){ hilo={card:rint(1,13), streak:0, pot:Math.round(bestLoot()*2), done:false, msg:'Higher or lower than '+0+'?'}; }
const CARD_FISH = ['','Minnow','Perch','Trout','Bass','Carp','Pike','Salmon','Tuna','Shark','Marlin','Kraken','Leviathan','Legend'];
function boardwalkBanner(){ return `<div class="bw-banner"><div class="bw-lights">${Array.from({length:18},(_,i)=>`<i style="animation-delay:${(i%6)*.25}s"></i>`).join('')}</div><h2>The Boardwalk</h2><p class="sub">Games of chance on the pier. Coins only, no real money, and the gulls are watching.</p>
  <div class="row" style="justify-content:center;gap:18px;margin-top:6px"><span><b class="coin">${fmtShort(S.money)}</b></span><span><b>🎟 ${fmt(S.tickets)}</b> <span class="meta">tickets</span></span><span><b style="color:var(--kelp)">${fmt(S.scales)}</b> <span class="meta">Scales</span></span></div></div>`; }
function renderBoardwalk(P){ accrueSpins(); const tk=S.tokens, base=bestLoot(); const nextIn=Math.max(0,Math.ceil((SPIN_EVERY-(Date.now()-S.wheelT))/60000));
  const crateRow=(k,name,desc)=>`<div class="row spread" style="padding:6px 0;border-bottom:1px solid var(--line)"><div style="min-width:0"><b>${name}</b>${tk[k]?` <span class="badge g">${tk[k]} free</span>`:''}<div class="meta">${desc}</div></div>
    ${tk[k]?`<button class="btn sm" data-act="crate" data-k="${k}" data-free="1">Open free</button>`:`<button class="btn sm" data-act="crate" data-k="${k}" ${S.money>=crateCost(k)?'':'disabled'}>Open · <span class="coin">${fmt(crateCost(k))}</span></button>`}</div>`;
  const betBtn=f=>{ const amt=Math.min(Math.floor(S.money*f), base*60); return `<button class="btn alt sm" data-act="flip" data-k="${f}" ${amt>=10?'':'disabled'}>Bet ${Math.round(f*100)}% · <span class="coin">${fmt(Math.max(0,amt))}</span></button>`; };
  const ducks = duck ? duck.prizes.map((p,i)=>{ const open=duck.pick>=0; const lab=p.k==='crate'?'📦':p.k==='coins'?'🪙':'🎟'+p.n; return `<button class="duckb ${open?(i===duck.pick?'picked':'open'):''}" data-act="duckpick" data-i="${i}" ${open?'disabled':''} aria-label="Duck ${i+1}" style="animation-delay:${i*.3}s">${open?`<span>${lab}</span>`:'🦆'}</button>`; }).join('') : '';
  P.innerHTML=boardwalkBanner()+`<div class="grid bw">
   <div class="tile bwt" style="--c:#c8553a"><h4>Lucky wheel</h4><div class="wheelwrap"><div class="wheelring"><canvas id="wheelcv" width="520" height="520"></canvas></div>
     ${S.freeSpins>0?`<button class="btn" data-act="spin" data-k="free" ${WH.spinning?'disabled':''}>Free spin! (${S.freeSpins} left)</button>`:`<button class="btn" data-act="spin" ${WH.spinning||S.money<wheelCost()?'disabled':''}>Spin · <span class="coin">${fmt(wheelCost())}</span></button>`}
     <span class="meta">A free spin every hour, up to ${SPIN_BANK} saved.${S.freeSpins<SPIN_BANK?' Next in '+nextIn+' min.':''}</span>
     ${WH.result?`<div class="val" style="text-align:center">${esc(WH.result)}</div>`:''}</div></div>
   <div class="tile bwt" style="--c:#7a4a9a"><h4>Mystery crates</h4><div class="meta">Coins, lures, clothes, decor, rods, and pets you can’t get anywhere else.</div>
     ${crateRow('small','Small crate','Mostly coins and lures. Sometimes a pet.')}${crateRow('big','Big crate','Clothes, decor, and the rarer pets.')}${crateRow('legend','Legendary crate','The really good stuff.')}
     ${crateRes?`<div class="reveal" style="text-align:center;margin-top:8px"><canvas width="240" height="180" id="crateprev"></canvas><div class="val">${esc(crateRes.title)}</div></div>`:''}</div>
   <div class="tile bwt" style="--c:#2a8aa8"><h4>Duck pond</h4><div class="meta">Pick a rubber duck. Every duck wins something. Mostly tickets. Sometimes…</div>
     ${duck?`<div class="ducks">${ducks}</div>${duck.pick>=0?`<div class="val" style="text-align:center">${esc(duck.msg||'')}</div><button class="btn alt sm" data-act="duckagain" ${S.money>=base?'':'disabled'}>Play again · <span class="coin">${fmt(base)}</span></button>`:''}`:`<button class="btn" data-act="duckagain" ${S.money>=base?'':'disabled'}>Play · <span class="coin">${fmt(base)}</span></button>`}</div>
   <div class="tile bwt" style="--c:#4f8a4a"><h4>Higher or lower</h4><div class="meta">Guess if the next fish card is higher or lower. Every right guess grows the pot by half. Cash out any time.</div>
     ${hilo&&!hilo.done?`<div class="hilocard"><b>${hilo.card}</b><span>${CARD_FISH[hilo.card]}</span></div><div class="val" style="text-align:center">Pot: <span class="coin">${fmt(hilo.pot)}</span> · streak ${hilo.streak}</div>
       <div class="row" style="justify-content:center"><button class="btn sm" data-act="hilo" data-k="hi">Higher ▲</button><button class="btn sm" data-act="hilo" data-k="lo">Lower ▼</button><button class="btn alt sm" data-act="hilocash" ${hilo.streak?'':'disabled'}>Cash out</button></div>`
      :`${hilo&&hilo.done?`<div class="val" style="text-align:center">${esc(hilo.msg)}</div>`:''}<button class="btn" data-act="hilostart" ${S.money>=base*2?'':'disabled'}>Deal · <span class="coin">${fmt(base*2)}</span></button>`}</div>
   <div class="tile bwt" style="--c:#d8a020"><h4>Coin flip with the Fishmonger</h4><div class="meta">Heads you double it, tails he keeps it. A fair coin, he swears on his best haddock.</div>
     <div class="row">${betBtn(.1)}${betBtn(.25)}${betBtn(.5)}</div>${flipRes?`<div class="val" style="font-size:18px;color:${flipRes.win?'var(--gold)':'var(--muted)'}">${esc(flipRes.txt)}</div>`:''}<div class="meta">${S.gstats.flips} flips · ${S.gstats.flipWins} won</div></div>
   <div class="tile bwt" style="--c:#d87aa0"><h4>Scratch card</h4><div class="meta">Find three of the same: 🐟 ×2 · 🦀 ×4 · 🐚 ×8 · 💎 ×20 · 👑 ×60 (times ${fmt(base)} coins).</div>
     ${scratch&&!scratch.done?`<div class="scratch">${scratch.cells.map((s,i)=>`<button data-act="scratch" data-i="${i}" class="${scratch.open[i]?'open':''}" aria-label="Scratch box ${i+1}">${scratch.open[i]?scratch.sym[s]:''}</button>`).join('')}</div><div class="row" style="justify-content:center"><button class="btn alt sm" data-act="scratchall">Reveal all</button></div>`
      :`${scratch&&scratch.done?`<div class="scratch">${scratch.cells.map(s=>`<button class="open" disabled>${scratch.sym[s]}</button>`).join('')}</div><div class="val" style="text-align:center;color:${scratch.win>=0?'var(--gold)':'var(--muted)'}">${scratch.win>=0?'Winner! +'+fmt(scratch.prize)+' coins':'No match this time.'}</div>`:''}
      <button class="btn" data-act="buyscratch" ${S.money>=base*2?'':'disabled'}>Buy a card · <span class="coin">${fmt(base*2)}</span></button>`}</div>
   ${clawHTML()}
  </div>
  <div class="tile bwt" style="--c:#ffc94d;margin-top:12px"><div class="row spread"><div><h4>Prize counter</h4><div class="meta">Every Boardwalk game hands out tickets. Trade them here for things you can’t get anywhere else.</div></div><b>🎟 ${fmt(S.tickets)}</b></div>
   <div class="grid" style="grid-template-columns:repeat(auto-fill,minmax(200px,1fr))">${PRIZES.map(p=>{ const owned=p[4]&&p[4](); return `<div class="row spread prize"><span class="row" style="gap:8px;flex-wrap:nowrap"><canvas width="96" height="80" data-prize="${p[0]}" style="width:48px;height:40px;cursor:default;flex:0 0 auto"></canvas><span>${esc(p[1])}</span></span>
     <span class="row" style="gap:4px">${!owned&&PRIZE_PV[p[0]]?`<button class="btn alt sm" data-act="prizepv" data-k="${p[0]}">Preview</button>`:''}${owned?'<span class="badge g">Owned</span>':`<button class="btn sm" data-act="prize" data-k="${p[0]}" ${S.tickets>=p[2]?'':'disabled'}>🎟 ${p[2]}</button>`}</span></div>`; }).join('')}</div></div>`;
  paintPrizes(P); paintClaw();
  drawWheel(); const cp=$('crateprev'); if(cp&&crateRes){ const x=cp.getContext('2d'); const k=crateRes.kind;
    if(k==='pet') drawPetStyled(x,crateRes.id,120,160,crateRes.id==='unicorn'?3.4:5,0); else if(k==='decor') drawDecor(x,crateRes.id,120,170,1.6,0); else if(k==='hat') hatPreview(x,240,180,crateRes.id,S.look.hatCol,true);
    else if(k==='rod'){ x.strokeStyle=ROD_I[crateRes.id].col; x.lineWidth=8; x.lineCap='round'; x.beginPath(); x.moveTo(30,160); x.quadraticCurveTo(120,150,215,30); x.stroke(); }
    else if(k==='col'){ x.fillStyle=crateRes.id; x.beginPath(); x.arc(120,90,50,0,7); x.fill(); } else drawJunk(x,240,180,k==='lure'?'goldlure':'chest'); } }

// ---------- actions for this update ----------
function extraAct2(b){ const k=b.dataset.k, i=+b.dataset.i;
  switch(b.dataset.act){
    case 'rodeq': if(S.rods.owned.includes(k)){ S.rods.eq=k; toast('You pick up the '+ROD_I[k].name+'.'); } return 'render';
    case 'rodbuy': { const r=ROD_I[k]; if(!r||r.src!=='shop'||S.rods.owned.includes(k)||S.money<r.price||!S.unlocked.includes(r.need)) return 'skip'; S.money-=r.price; S.rods.owned.push(k); S.rods.eq=k; sfx.coin(); toast('New rod: '+r.name+'!'); return 'render'; }
    case 'rodup': { const c=rodUpCost(k); if(rodLvl(k)>=10||S.money<c.coins||S.scales<c.scales) return 'skip'; S.money-=c.coins; S.scales-=c.scales; S.rods.lvl[k]=rodLvl(k)+1; sfx.catch(2); toast(ROD_I[k].name+' is now level '+S.rods.lvl[k]); return 'render'; }
    case 'rodatt': { const [si,a]=k.split(':'); const id=S.rods.eq, list=(S.rods.att[id]||[]).slice(); list[+si]=a||''; S.rods.att[id]=list.slice(0,rod().slots); return 'render'; }
    case 'attbuy': { const t=S.atts[k]||0; if(t>=3) return 'skip'; const c=ATT_COST[t]; if(S.money<c[0]||S.scales<c[1]) return 'skip'; S.money-=c[0]; S.scales-=c[1]; S.atts[k]=t+1; sfx.coin(); toast(ATT_I[k].name+' tier '+(t+1)+'!');
      const cur=S.rods.att[S.rods.eq]||[]; if(!t && cur.filter(Boolean).length<rod().slots && !cur.includes(k)){ const l=cur.slice(); const free=l.findIndex(x=>!x); if(free>=0) l[free]=k; else l.push(k); S.rods.att[S.rods.eq]=l.slice(0,rod().slots); } return 'render'; }
    case 'pettint': { const tt=PET_TINTS.find(x=>x[0]===k); if(!tt) return 'skip'; PET_PV=null; if(!S.petTints.includes(k)){ if(!tt[2]||S.money<tt[2]) return 'skip'; S.money-=tt[2]; S.petTints.push(k); sfx.coin(); } petLook().tint=k; return 'render'; }
    case 'petacc': { const a=PET_ACCS.find(x=>x[0]===k); if(!a) return 'skip'; PET_PV=null; if(!S.petAccs.includes(k)){ if(!a[2]||S.money<a[2]) return 'skip'; S.money-=a[2]; S.petAccs.push(k); sfx.coin(); } petLook().acc=k; return 'render'; }
    case 'pethat': if(S.owned.hats.includes(k)) petLook().hat=k; return 'render';
    case 'petcol': petLook()[k]=b.dataset.v; return 'render';
    case 'taskclaim': { const t=ensureDaily().tasks[i]; if(!t||t.claimed||taskHave(t)<t.n) return 'skip'; t.claimed=true; addPassXP(40); earn(t.coins*coinMult()); S.scales+=t.scales; S.gstats.tasks++; sfx.coin(); toast('Task done: +'+fmt(t.coins*coinMult())+' coins, +'+t.scales+' Scales'); return 'render'; }
    case 'taskbonus': { const d=ensureDaily(); if(d.bonus||!d.tasks.every(t=>t.claimed)) return 'skip'; d.bonus=true; S.tokens.small++; sfx.catch(3); toast('All tasks done! A small Mystery Crate is waiting at the Boardwalk.'); return 'render'; }
    case 'patches': showPatchNotes(); return 'skip';
    case 'safereset': { const w=$('resetword'); if(!w||w.value.trim()!=='DELETE') return 'skip'; try{ localStorage.setItem(BACKUP_KEY, JSON.stringify(S)); }catch(e){}
      S=fresh(); S.seenPatch=GAME_VERSION; S.tab='settings'; S.savedAt=Date.now(); G.st='idle'; fillBounties(); toast('Progress erased. A backup was kept. You can restore it in Settings.'); return 'render'; }
    case 'restorebk': { try{ const raw=localStorage.getItem(BACKUP_KEY); if(!raw) return 'skip'; S=migrate(JSON.parse(raw)); S.savedAt=Date.now(); localStorage.removeItem(BACKUP_KEY); G.st='idle'; toast('Backup restored. Welcome back!'); }catch(e){ toast('That backup couldn’t be read.'); } return 'render'; }
    case 'duckagain': { const c=bestLoot(); if(S.money<c) return 'skip'; S.money-=c; newDuck(); taskProgress('game',1); return 'render'; }
    case 'duckpick': { if(!duck||duck.pick>=0) return 'skip'; duck.pick=i; const p=duck.prizes[i]; if(p.k==='crate'){ S.tokens.small++; duck.msg='A small Mystery Crate! Quack.'; sfx.shiny(); } else if(p.k==='coins'){ duck.msg='+'+fmt(bwEarn(bestLoot()*p.m*coinMult()))+' coins. Quack quack.'; sfx.coin(); } else { duck.msg='+'+addTickets(p.n)+' tickets. Quack.'; tone(1200,.08,'triangle',.05); } return 'render'; }
    case 'hilostart': { const c=bestLoot()*2; if(S.money<c) return 'skip'; S.money-=c; newHilo(); taskProgress('game',1); return 'render'; }
    case 'hilo': { if(!hilo||hilo.done) return 'skip'; let n; do{ n=rint(1,13); }while(n===hilo.card); const ok=(k==='hi')===(n>hilo.card); const prev=hilo.card; hilo.card=n;
      if(ok){ hilo.streak++; hilo.pot=Math.round(hilo.pot*1.5); addTickets(3); tone(900+hilo.streak*100,.1,'triangle',.06); if(hilo.streak>=8){ bwEarn(hilo.pot); hilo.done=true; hilo.msg='Eight in a row! The pot pays out: +'+fmt(hilo.pot)+' coins.'; sfx.catch(4); } }
      else { hilo.done=true; hilo.msg=prev+' → '+n+'. Wrong way! The pot sinks to the bottom of the sea.'; addTickets(2); sfx.lost(); } return 'render'; }
    case 'hilocash': { if(!hilo||hilo.done||!hilo.streak) return 'skip'; bwEarn(hilo.pot); hilo.done=true; hilo.msg='Cashed out: +'+fmt(hilo.pot)+' coins after '+hilo.streak+' right guesses.'; sfx.coin(); return 'render'; }
    case 'prize': { const p=PRIZES.find(x=>x[0]===k); if(!p||S.tickets<p[2]||(p[4]&&p[4]())) return 'skip'; S.tickets-=p[2]; const got=p[3](); PREVIEW=null; PET_PV=null; AQ_PV=null;
      if(k==='golden'||k==='rainbow') petLook().tint=k; if(k==='balloon'||k==='partyhat') petLook().acc=k; if(['sixsevencap','carnival','fishbowl'].includes(k)) S.look.hat=k; if(k==='spacesuit') S.look.outfit='spacesuit'; sfx.shiny(); toast('Prize counter: you got '+got+'!'); return 'render'; }
  }
  return undefined; }
// the Customize stage fits each pet: measured once (drawn small offscreen), then scaled to fill the stage
const PET_FIT={};
function petFitScale(id){ if(PET_FIT[id]) return PET_FIT[id]; const big=id==='horse'||id==='cow'; let s=big?4.2:6.5;
  try{ const o=document.createElement('canvas'); o.width=240; o.height=200; const x=o.getContext('2d'), k=2; const keepN=PET_NIGHT; PET_NIGHT=0; drawPetStyled(x,id,120,170,k,0,0,Object.assign({},petLook(id),{hat:'none',acc:'none'})); PET_NIGHT=keepN;
    const d=x.getImageData(0,0,o.width,o.height).data; let x0=1e9,y0=1e9,x1=-1,y1=-1; for(let yy=0;yy<o.height;yy++) for(let xx=0;xx<o.width;xx++){ if(d[(yy*o.width+xx)*4+3]>30){ if(xx<x0)x0=xx; if(xx>x1)x1=xx; if(yy<y0)y0=yy; if(yy>y1)y1=yy; } }
    if(x1>x0&&y1>y0){ const w=(x1-x0)/k, h=(y1-y0)/k; s=Math.min(175/h, 300/w, 11); } }catch(e){}
  return PET_FIT[id]=s; }
