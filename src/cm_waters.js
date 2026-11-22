// =====================================================================
// 0.4.9 [3]-[7] four new waters and [69] six end-game waters (director, 2026-11-19). Data only (scenes in cn_waterart.js).
//  - New waters, placed where their price fits: Cherry Blossom Lake (after Stonebrook River), Canadian Rockies (after Frostbite Lake),
//    Florida Keys (after Coral Shallows), Amazon Rainforest (after Brine Shelf). Hollow Trench stays the water you must reach to set sail.
//  - Each has the standard 50 fish plus 2 meme fish (15 / 14 / 12 / 6 / 4 / 1 by rarity), fish by day and by night, its own bait.
//    Numbers come from the waters around it (values, weights, strength), so the curve stays smooth.
//  - End-game waters (outside normal progression): Animal Farm (opens after voyage 2), The Buffet (3), Corporate Pond (4), The Nile (5),
//    Circuit Lake (6), Mount Olympus (7). They stay open for good once earned. Their fish pay 25% more than your best normal water and
//    fight like it, scaled to how far you have come (egScale), so they are worth it at every stage and never break the economy.
// Entries: 'Name|note'. Order = rarity: 15 common, 13 uncommon, 11 rare, 6 epic, 4 legendary, 1 mythic; then 2 meme fish (uncommon, rare).
// =====================================================================
const WATERS_NEW=[
 {id:'blossom', name:'Cherry Blossom Lake', after:'river', cost:1400, bonus:9000, loot:230, plat:'dock', depth:'1–4 m', pre:'cb', mul:3, bait:['petalbait','Sakura Petals',1.45,.55,900,'Soft pink petals: odds ×3 at Cherry Blossom Lake.'],
  blurb:'A quiet lake under Mount Fuji, ringed with cherry trees. Koi glide under the petals; eels hide in the reeds.', sky:['#9ec8e8','#ffe0ea'], water:['#5a9a9a','#1e4a52'], hill:'#5a7a5a', amp:.06, freq:2.1,
  cols:['#e86a8a','#f4a0b8','#e8e0d0','#d84a3a','#3a3a44','#c8a050','#6a8aa0','#8aa070'], fish:[
  'Ayu Sweetfish|Smells faintly of watermelon. Really.','Medaka Ricefish|Lives in rice paddies. Dreams of the ocean.','Oikawa Chub|Wears its breeding colors like a festival kimono.','Ugui Dace|Turns red in spring, like everyone else here.','Moroko Gudgeon|Small, round and very polite about it.',
  'Tanago Bitterling|Lays its eggs inside a mussel. Rent-free.','Kawamutsu Minnow|A dark-cheeked minnow with a stern face.','Dojo Loach|Wriggles to the surface when rain is coming.','Yoshinobori Goby|Climbs little waterfalls with its sucker fins.','Wakasagi Smelt|Fished through the ice in winter, fried in spring.',
  'Higai Gudgeon|Spotted, speedy, and gone before you blink.','Kajika Sculpin|Sits under stones and sings at night. Allegedly.','Hasu Chub|A chub with a smile that goes back to its ears.','Nigoi Barbel|Long whiskers, longer patience.','Petal Minnow|Covered in tiny pink spots, like fallen blossoms.',
  'Ginbuna Carp|Silver, sturdy and older than the shrine.','Nishiki Goldfish|Won at a summer festival. Escaped. Thriving.','Ryukin Goldfish|A fancy tail and a fancier attitude.','Unagi Eel|Slippery, smoky and the reason the lake smells of grills in July.','Yamame Trout|Parr marks like thumbprints down its side.',
  'Iwana Char|Lives where the water is coldest and clearest.','Amago Trout|Red dots, mountain streams, no small talk.','Namazu Catfish|Legend says it causes earthquakes when it sulks.','Raigyo Snakehead|Breathes air and judges you for it.','Biwa Catfish|A big, lazy catfish from the great lake.',
  'Lantern Festival Fish|Glows softly on summer evenings.','Bonsai Bass|Kept small on purpose. Very proud.','Ninja Loach|You never see it bite. You just feel it.',
  'Kohaku Koi|White as rice, red as a sunrise.','Showa Koi|Black, red and white, painted by a calm hand.','Sanke Koi|A three-colored classic. Judges love it.','Ogon Koi|Solid gold and knows it.','Tancho Koi|A single red spot on its head, like a flag.',
  'Sakuramasu Salmon|The cherry salmon. Runs up the river when the trees bloom.','Moon-Viewing Carp|Surfaces only to look at the full moon.','Taiyaki Fish|A fish-shaped cake that learned to swim. Still warm.','Power Level Carp|Its power level is over nine thousand grams.',
  'Butterfly Koi|Long flowing fins that move like silk.','Tea Ceremony Carp|Moves slowly and with great respect.',
  'Fuji Snow Trout|Born in the snowmelt from the mountain.','Kitsune Koi|Has nine tails. Shows you one at a time.','Kappa Catfish|Bows when it sees you. Bow back.','Ronin Eel|A wanderer with no master and a scar on its fin.','Shogun Carp|Commands the whole pond from the deepest pool.','Torii Gate Goby|Only swims under the red gate.',
  'Koi Dragon|Climbed the waterfall and almost became a dragon.','Hanzaki Salamander|A giant salamander older than the town. Not a fish. Does not care.','Golden Shrine Koi|Fed by monks for three hundred years.','Tsukimi Moon Eel|Shines silver on autumn nights.',
  'Ryujin, the Dragon King|The dragon of the lake, wearing a koi’s body as a disguise.',
  'Notice Me Senpai Koi|It finally noticed you.','Isekai Goby|Got hit by a boat and woke up as a fish. Classic.']},
 {id:'rockies', name:'Canadian Rockies', after:'frost', cost:10000, bonus:55000, loot:1150, plat:'dock', depth:'2–40 m', pre:'rk', mul:3, bait:['maplelure','Maple Lures',1.45,.7,2400,'Sticky and sweet, eh: odds ×3 in the Canadian Rockies.'],
  blurb:'A glacier lake of crystal-clear water under jagged peaks. Trout, char and river monsters, and a faint smell of maple syrup.', sky:['#7ab0e0','#e4f0f8'], water:['#3ab0b8','#0e4a5a'], hill:'#3a5a48', amp:.07, freq:2.2,
  cols:['#6a8a6a','#c8a070','#e8d8c0','#c84a3a','#5a6a78','#e8c040','#8a6a4a','#4a8ab0'], fish:[
  'Mountain Whitefish|Lives in rivers so clear you can count its scales.','Longnose Dace|Hangs out in the fast water. Loves a challenge.','Lake Chub|Unremarkable. Proudly Canadian.','Slimy Sculpin|Slimy is its actual name. It has made peace with that.','Brook Stickleback|Five spines and a short temper.',
  'Redside Shiner|Flashes red along its side in spring.','Pearl Dace|Tiny, silver and very polite.','Spoonhead Sculpin|Has a head shaped like a spoon. Uses it.','Finescale Dace|Swims in beaver ponds and minds its own business.','Trout-perch|Half trout, half perch, fully confused.',
  'Northern Pikeminnow|Big minnow energy.','Cisco|A silver lake fish that travels in huge schools.','Kokanee|A landlocked salmon that turns red in the fall.','Moose Minnow|Has tiny antlers. Nobody can explain it.','Maple Leaf Darter|A red leaf on each side. Very patriotic.',
  'Brook Trout|Spotted like a starry night. Loves cold creeks.','Westslope Cutthroat|A red slash under the jaw. Looks tougher than it is.','Rainbow Trout|Jumps like it is trying to touch the sky.','Bull Trout|The bully of the mountain streams.','Arctic Grayling|Sails a huge, sparkling dorsal fin.',
  'Lake Whitefish|Smoked, it is famous. Alive, it is offended.','Burbot|A freshwater cod that spawns under the ice in January.','Northern Pike|All teeth, no manners.','Walleye|Glassy eyes that see in the dark.','Sauger|Walleye’s quieter cousin.',
  'Syrup Sucker|Sweetest thing in the river, eh.','Mountie Minnow|Always gets its fish.','Canoe Carp|Paddles around with great dignity.',
  'Lake Trout|Lives deep and lives long. Some are older than you.','Golden Trout|Only found in the highest lakes. Glows like a sunset.','Dolly Varden|Named after a character in a book. Has never read it.','Splake|A trout and a char walked into a hatchery.','Tiger Trout|Wavy stripes and a very bad mood.',
  'Chinook Salmon|The king of salmon. Swims a thousand kilometres to get here.','Sockeye Salmon|Turns bright red with a green head when it spawns.','Coho Salmon|Leaps falls taller than you.','Glacier Char|Silver-blue like the ice it lives under.','Maple Glazed Salmon|Already glazed. Somehow still swimming.','Bear-Scarred Chinook|Got away from a grizzly. Thinks it can get away from you too.',
  'Lake Sturgeon|An armoured giant that has not changed in 100 million years.','Muskellunge|The fish of ten thousand casts.','Glacier Ghost Trout|Clear as meltwater. You only see its shadow.','Moose-Antler Pike|Its fins branch like antlers.','Syrup King Salmon|Sticky, sweet and very large.','Hockey Puck Sculpin|Flat, black and slides across the bottom at speed.',
  'Old Barnacle Sturgeon|A white sturgeon longer than your canoe.','Sasquatch Catfish|Blurry in every photo.','Aurora Char|Its sides shimmer green and purple like the northern lights.','Thunderbird Trout|Leaps with a sound like thunder.',
  'Ogopogo|The lake monster everyone talks about. Turns out it is real, and annoyed.',
  'Sorry Fish|Apologises every time it bumps your hook.','Hoser Bass|Take off, eh.']},
 {id:'keys', name:'Florida Keys', after:'reef', cost:24000, bonus:120000, loot:1900, plat:'pier', depth:'1–5 m', pre:'fk', mul:3, bait:['pinfishbait','Live Pinfish',1.5,.75,3800,'Every predator on the flats wants one: odds ×3 in the Florida Keys.'],
  blurb:'Shallow, warm flats off a long old bridge: sport fishing heaven. Tarpon roll, sharks patrol, and something weird washes up every day.', sky:['#3aa8e8','#e0f6ff'], water:['#6ae0d0','#1a8aa0'], hill:'#4a9a6a', amp:.05, freq:2.6,
  cols:['#e8c050','#5ab0c8','#f0f0f0','#e86a4a','#8a8a9a','#3a5a8a','#c8a070','#f08ab8'], fish:[
  'Pinfish|Steals your bait and leaves a thank-you note.','Bluestriped Grunt|Grunts when you catch it. Loudly.','Pigfish|Also grunts. The flats are noisy.','Mojarra|Silver, quick and always in a group chat.','Houndfish|A needlefish that leaps over boats.',
  'Pilchard|Bait for everything. Knows it. Anxious.','Ballyhoo|Has an underbite and a dream.','Sergeant Major|Striped like a uniform. Bosses the small fish around.','Bluehead Wrasse|Changes color as it grows up. Relatable.','Lane Snapper|Pink, yellow and very snappy.',
  'Mangrove Snapper|Lives under the roots. Too smart for most anglers.','Sheepshead|Has human-looking teeth. Smiles at you. Please stop.','Grass Porgy|Grazes the seagrass like a little cow.','Oyster Toadfish|Hums under the docks at night to find a date.','Flamingo Fish|Pink, stands on one fin. Very Florida.',
  'Spotted Seatrout|Not a trout. Has spots. Half right.','Ladyfish|Jumps more than fish twice its size.','Jack Crevalle|Pulls like a truck and refuses to quit.','Snook|Lurks by the bridge pilings, waiting.','Redfish|A black spot on its tail fools predators.',
  'Mutton Snapper|Grumpy, red and delicious-looking.','Yellowtail Snapper|A yellow stripe from nose to tail.','Hogfish|Snout like a pig, colors like a sunset.','Bonefish|The grey ghost of the flats.','Great Barracuda|Stares at you. Never blinks.',
  'Spanish Mackerel|Fast, shiny and gone.','Lemon Shark|Yellowish, small and surprisingly sweet.','Gulf Flounder|Lies flat in the sand, both eyes on you.',
  'Permit|The hardest fish on the flats to fool.','Tarpon|The silver king. Jumps higher than you.','Cubera Snapper|A huge snapper with huge teeth.','Black Grouper|Lives in a reef hole and never leaves.','Bull Shark|Swims into rivers like it owns them.',
  'Spotted Eagle Ray|Flies through the water like a bird.','Peacock Bass|Got loose from a canal. Now it runs the place.','Lionfish|Pretty, venomous and not supposed to be here.','Python Eel|An escaped python pretending to be an eel. Badly.','Spiny Lobster|All antennae and attitude.','Gator Snook|Has seen an alligator. Picked up some habits.',
  'Silver King Tarpon|A tarpon as long as the skiff.','Smalltooth Sawfish|A nose like a chainsaw.','Great Hammerhead|Scans the flats with a head like a T.','Goliath Grouper|Eats lobsters whole. Eats sharks sometimes.','Sailfish|The fastest fish in the sea. Sails up when it is angry.','Everglades Gar|Armour plates and a crocodile grin.',
  'Grand Slam Bonefish|Landing it counts for three.','Hurricane Tarpon|Rides in on the storm.','Mile Marker Zero Marlin|Found at the very end of the road.','Skunk Ape Snook|Smells awful. Fights harder.',
  'Florida Man Fish|Arrested twice, bit a tourist, also saved a kitten. All before lunch.',
  'Spring Break Sardine|Partied too hard. Swam into your net.','Gas Station Sushi Fish|Bought at 3 a.m. Regretted at 3:05.']},
 {id:'amazon', name:'Amazon Rainforest', after:'shelf', cost:55000, bonus:280000, loot:3200, plat:'raft', depth:'2–25 m', pre:'am', mul:3, bait:['jungleberry','Jungle Fruit',1.55,.8,7000,'Fallen fruit the big fish wait for: odds ×3 in the Amazon.'],
  blurb:'A dark jungle river under roaring waterfalls. Piranhas in every shadow, arowanas leaping for insects, and giants in the deep.', sky:['#6aa8c8','#e0f0d8'], water:['#4a7a4a','#1a2a1a'], hill:'#2a5a2a', amp:.06, freq:2.4,
  cols:['#d83a3a','#3ab0e8','#e8c040','#4a8a3a','#2a2a30','#c8c8d0','#e87a30','#8a5aa0'], fish:[
  'Neon Tetra|Glows blue and red, like a tiny traffic light.','Cardinal Tetra|The neon’s fancier cousin.','Glowlight Tetra|A single orange line that shines.','Hatchetfish|Shaped like an axe. Can glide over the water.','Pencilfish|Thin as a pencil. Writes nothing.',
  'Corydoras Catfish|Winks at you. Catfish can do that, apparently.','Otocinclus|Cleans the leaves all day. Never complains.','Dwarf Cichlid|Small, bright and extremely protective.','Rummynose Tetra|A red nose, like it has been out all night.','Silver Dollar|Round, shiny and worth exactly one coin.',
  'Leaf Fish|Pretends to be a dead leaf. Very convincing.','Banded Leporinus|Stripes and a nervous twitch.','Headstander|Swims head-down. Always.','Black Phantom Tetra|A ghost with one dark spot.','Pacu Fry|A baby pacu with surprisingly human teeth.',
  'Red-bellied Piranha|Comes in a group. Leaves with your bait.','Black Piranha|The biggest piranha. Ruby eyes.','Wimple Piranha|Eats scales off other fish. Rude.','Oscar|Has a personality. Recognises its owner.','Angelfish|Elegant, tall and secretly bossy.',
  'Discus|Round as a plate, painted like a sunset.','Severum|A chunky cichlid that eats fruit.','Pleco|Sucks onto rocks and stares.','Pacu|Has teeth like a person. Do not look at them.','Freshwater Stingray|Spotted, flat and best not stepped on.',
  'Black Ghost Knifefish|Swims backwards using electricity.','Tiger Shovelnose|A long whiskered catfish with tiger stripes.','Payara|The vampire fish: two fangs through its own head.',
  'Silver Arowana|Leaps two metres to snatch a beetle off a branch.','Black Arowana|A rare dark arowana from the flooded forest.','Peacock Bass|An eye on its tail and a temper to match.','Redtail Catfish|Huge, whiskered, red-tailed.','Electric Eel|Packs 800 volts. Your rod tingles.',
  'Golden Dorado|The river tiger. Bright gold, all muscle.','Tambaqui|Cracks nuts with its teeth.','Jungle Candiru|Tiny. Notorious. Let’s not talk about it.','Royal Pleco|Wears stripes like a king.','Rain Dancer Cichlid|Spawns only when the rains come.','Vine Boom Piranha|Every bite comes with a loud BOOM.',
  'Pirarucu|One of the biggest freshwater fish on Earth. Breathes air.','Piraiba Catfish|Big enough to swallow a monkey. Probably has.','Jaguar Cichlid|Spotted like a jungle cat.','Waterfall Leaper Dorado|Climbs the falls in great golden leaps.','Thunder Pleco|Rattles its armour like thunder.','Anaconda Eel|Thicker than your arm.',
  'Golden Arowana|A living dragon of gold.','El Dorado Dorado|The legendary golden fish of the lost city.','Mapinguari Catfish|A forest legend with one huge eye.','Iara’s Fish|Belongs to the river spirit. She wants it back.',
  'Boitata, the Fire Serpent|A snake of fire that guards the forest from those who burn it.',
  'Rainforest Cafe Fish|Lives in a theme restaurant. Has never seen a real tree.','Tarzan Tetra|Swings from vine to vine. Yells.']},
 // ---------------- end-game waters ----------------
 {id:'farm', name:'Animal Farm', eg:2, cost:0, bonus:0, loot:40000, plat:'dock', depth:'1–3 m', pre:'af', mul:3, bait:['farmfeed','Farm Feed',1.6,.9,30000,'A scoop of everything: odds ×3 at Animal Farm.'],
  blurb:'A muddy farm pond where every fish is part animal. Moo. Baa. Blub.', sky:['#8ac8f0','#f8f0d8'], water:['#6a8a5a','#2a3a22'], hill:'#5a8a3a', amp:.06, freq:2.3,
  cols:['#c8a070','#f0e8d8','#3a3a3a','#e8b080','#8a6a4a','#e8e0c0','#c86a4a','#a0a0a8'], fish:[
  'Dogfish|Good boy. Fetches your lure back.','Catfish|Ignores you completely, then bites.','Cowfish|Moos underwater. Makes milk bubbles.','Horsefish|Gallops along the bottom.','Sheepfish|Woolly. Very warm. Smells like a wet jumper.',
  'Goatfish|Eats your line, your lure and your sandwich.','Pigfish|Rolls in the mud at the bottom. Happy.','Chickenfish|Lays eggs. Crosses the pond. Nobody knows why.','Duckfish|Quacks. Floats. Confused about which one it is.','Bunnyfish|Hops out of the water. Ears first.',
  'Hamsterfish|Stores food in its cheeks. Runs on a little wheel.','Mousefish|Squeaks. Afraid of the catfish.','Frogfish|Ribbit.','Snailfish|Takes forever to bite. Worth the wait.','Turkeyfish|Gobbles. Especially in November.',
  'Llamafish|Spits at you. Fluffy though.','Donkeyfish|Stubborn. Will not be reeled. Then suddenly will.','Goosefish|Honks and chases you off the dock.','Squirrelfish|Hides acorns under rocks.','Raccoonfish|Wears a mask. Steals your bait.',
  'Hedgehogfish|Prickly. Rolls into a ball.','Beaverfish|Building a dam out of your bobbers.','Owlfish|Only bites at night. Who? You.','Batfish|Hangs upside down from the dock.','Foxfish|Clever, quick and sly with a lure.',
  'Badgerfish|Digs. Does not care.','Porcupinefish|Hug at your own risk.','Ferretfish|Steals shiny things and dances.',
  'Zebrafish|Black and white and caught all over.','Kangaroofish|Carries a baby fish in its pouch.','Buffalofish|A big, shaggy bottom-feeder.','Snakefish|Hisses. Bites. Very long.','Monkeyfish|Swings from the reeds. Throws mud.',
  'Koalafish|Sleeps twenty hours a day. Smells of eucalyptus.','Pandafish|Eats only bamboo. Lots of it.','Penguinfish|Waddles on the ice. Dives like a rocket.','Flamingofish|Pink because of its diet.','Camelfish|Stores water in its hump. In a pond.','Slothfish|Bites in slow motion.',
  'Elephantfish|Never forgets a lure.','Giraffefish|Its neck sticks out of the water.','Rhinofish|One horn, charges your boat.','Hippofish|Looks friendly. Is not.','Gorillafish|Beats its chest. Splashes everywhere.','Polar Bearfish|Fluffy, white and very hungry.',
  'Tigerfish|Orange stripes, sharp teeth, no mercy.','Eaglefish|Dives from the sky to catch other fish.','Wolf Pack Fish|Never alone. Howls at the moon.','Unicornfish|One horn, rainbow tail, very rare.',
  'Noah’s Arkfish|Two of every animal, all in one fish.',
  'Goat Scream Fish|AAAAAAAAAH.','Doge Fish|Such fish. Very catch. Wow.']},
 {id:'buffet', name:'The Buffet', eg:3, cost:0, bonus:0, loot:60000, plat:'pier', depth:'1–2 m (gravy)', pre:'bf', mul:3, bait:['breadsticks','Endless Breadsticks',1.6,.9,45000,'They never run out: odds ×3 at The Buffet.'],
  blurb:'A lake of soup under a sky of whipped cream, with fish crossed with every dish from every buffet in the world.', sky:['#f8d0a0','#fff4e0'], water:['#d8a050','#8a4a1a'], hill:'#c87a3a', amp:.05, freq:2.0,
  cols:['#e8b040','#d8502a','#f8e8b0','#8a5a2a','#f0c8d8','#e8d070','#c83a2a','#f8f0e8'], fish:[
  'Pizza Perch|Cheese pulls when it fights.','Chicken Wing Wahoo|Comes in mild, hot and regret.','Mac & Cheese Minnow|Gooey. Comforting. Orange.','French Fry Fry|Crispy outside, fluffy inside.','Nugget Fish|Shaped like a dinosaur. Tastes like chicken.',
  'Taco Tetra|Falls apart the moment you catch it.','Pancake Plaice|Flat, golden and stacked three high.','Waffle Wrasse|Has little squares to hold the syrup.','Donut Dace|A hole in the middle. Sprinkles on top.','Pretzel Pike|Twisted, salty and very knotted.',
  'Hot Dog Herring|Is it a sandwich? Nobody agrees.','Meatball Molly|Rolls around in tomato sauce.','Garlic Bread Goby|Keeps the vampire fish away.','Popcorn Puffer|Puffs up when it gets hot.','Jelly Jellyfish|Wobbles. Comes in lime and cherry.',
  'Burrito Bass|Wrapped up tight. Unwrap carefully.','Spaghetti Eel|Long, saucy and tangled in your line.','Dumpling Darter|Steamed, pleated and quick.','Ramen Ribbonfish|Comes with a soft egg on top.','Croissant Crappie|Flaky. Leaves crumbs everywhere.',
  'Bagel Bream|Everything seasoning.','Cupcake Cichlid|Frosting fins.','Pudding Pollock|Smooth, sweet, slightly worrying.','Mashed Potato Mullet|With a little lake of gravy on top.','Fried Rice Rudd|Made from yesterday’s rice. Better for it.',
  'Gravy Grouper|Lives in the gravy boat.','Corn Dog Cod|Comes on a stick.','Nacho Nase|Extra cheese. Extra jalapeños.',
  'Lobster Thermidor Ling|Fancy. Has its own little fork.','Lasagna Lungfish|Layers. So many layers.','Cheesecake Char|Rich enough to slow your reel.','Paella Pompano|Golden rice and a few clams hitching a ride.','Curry Carp|Leaves a warm glow in the water.',
  'Tiramisu Tilapia|Wakes you up. Smells of coffee.','Dim Sum Dory|Arrives on a little cart.','Brisket Barramundi|Smoked for twelve hours.','Fondue Flounder|Dip it in cheese. Or chocolate.','Churro Chub|Cinnamon sugar everywhere.','Kimchi Koi|Fermented, fizzy and proud of it.',
  'Wedding Cake Wahoo|Five tiers. One tiny couple on top.','Turducken Tuna|A tuna in a duck in a chicken.','Chocolate Fountain Fish|Never stops flowing.','Prime Rib Rockfish|Carved to order.','Sundae Sturgeon|Three scoops and a cherry.','All-You-Can-Eat Eel|Just keeps coming.',
  'Golden Truffle Tuna|Shaved truffle on every scale.','Michelin Star Snapper|Three stars. Judges you back.','Bottomless Mimosa Marlin|Brunch never ends for this one.','Thanksgiving Feast Grouper|The whole table, in one fish.',
  'The Endless Buffet Leviathan|Every dish, every plate, every dessert, swimming at once.',
  'Sad Desk Salad Fish|Eaten alone at 12:47 every weekday.','Mukbang Mackerel|Eats on camera for an audience of millions.']},
 {id:'corporate', name:'Corporate Pond', eg:4, cost:0, bonus:0, loot:80000, plat:'pier', depth:'2 m (to the elevator)', pre:'cp', mul:3, bait:['coffeebean','Espresso Beans',1.65,.95,60000,'Fuel for the grind: odds ×3 at Corporate Pond.'],
  blurb:'A reflecting pool in a glass business park, ringed by towers and a stock ticker. The fish wear ties and talk about synergy.', sky:['#9ab8d8','#e8eef4'], water:['#4a6a8a','#1a2a3a'], hill:'#5a6a78', amp:.04, freq:1.8,
  cols:['#3a4a6a','#c8ccd4','#e8e8ec','#2a2a30','#4a8a5a','#d8b040','#c83a3a','#6a7a8a'], fish:[
  'Intern Minnow|Unpaid. Fetches the coffee.','Spreadsheet Shiner|Has a cell for everything.','Memo Mullet|Business in front, party in the back.','Cubicle Carp|Lives in a tiny grey box. Happy enough.','Coffee Run Chub|Always on the way back from the café.',
  'Stapler Stickleback|Do not touch its stapler.','Lanyard Loach|Badge on a string. Beeps at doors.','Sticky Note Sunfish|Covered in reminders it never reads.','Synergy Smelt|Leverages core competencies. Unclear how.','Inbox Dace|4,812 unread.',
  'Commuter Catfish|Spends two hours a day on the train.','Badge Bass|Swipes in at 8:59.','Slide Deck Perch|Has 64 slides. Wants to go through all of them.','Water Cooler Goby|Knows all the gossip.','Timesheet Tetra|Logs every minute. Even this one.',
  'Middle Manager Mackerel|Manages the managers who manage.','Quarterly Report Rockfish|Numbers are up. Morale is down.','Stock Ticker Trout|Its scales scroll green and red.','Bull Market Bass|Charges at everything. Up only.','Bear Market Burbot|Hibernates until things get better.',
  'Pivot Pike|Changed direction four times this week.','Disruptor Dory|Disrupts things. Mostly meetings.','Venture Capital Cod|Funds anything with a good pitch deck.','Hedge Fund Herring|Bets against the other fish.','IPO Eel|Went public. Lost half its value by lunch.',
  'KPI Koi|Measured on everything.','Startup Sardine|Ten employees, one beanbag, no money.','Out of Office Oarfish|Will reply after the holidays.',
  'Unicorn Startup Fish|Worth a billion. Has never made a sale.','CFO Grouper|Guards the budget with its life.','Golden Parachute Pompano|Lands softly wherever it falls.','Blockchain Barracuda|Can explain blockchain. Will not stop.','Crypto Carp|To the moon. Then the bottom of the pond.',
  'Cloud Server Snapper|Lives in the cloud. Mostly the basement.','Keynote Koi|Wears a black turtleneck. One more thing...','Expense Account Eel|Every lunch is a business lunch.','Dividend Dorado|Pays out every quarter.','Boardroom Bream|Sits at the head of the table.','Ledger Lungfish|Breathes numbers.',
  'Hostile Takeover Shark|Buys the pond. Fires the other fish.','CEO Swordfish|Cuts costs. Cuts lines.','Silicon Valley Salmon|Swims upstream to a garage.','Wall Street Wahoo|Shouts BUY BUY BUY.','Insider Trading Tuna|Knows something you don’t.','Golden Handshake Halibut|A very generous goodbye.',
  'Trillion-Dollar Tuna|Bigger than some countries.','Activist Investor Marlin|Demands a seat on your board.','Monopoly Grouper|Owns every hotel on the pond.','Offshore Account Oarfish|Lives somewhere warm. For tax reasons.',
  'The Invisible Hand|Moves the whole market. Nobody has ever seen it. Until now.',
  'Per My Last Email Fish|Cc’d your manager on this catch.','Rise and Grindfish|Up at 4 a.m. Cold showers. Posts about it.']},
 {id:'nile', name:'The Nile', eg:5, cost:0, bonus:0, loot:110000, plat:'raft', depth:'3–10 m', pre:'nl', mul:3, bait:['lotusbait','Lotus Seeds',1.65,1,80000,'Blessed by the river: odds ×3 on the Nile.'],
  blurb:'The great river through the desert, past pyramids and sphinxes. Its fish carry the faces of gods and pharaohs.', sky:['#e8c890','#fff0d0'], water:['#3a8a8a','#0e3a3a'], hill:'#c8a060', amp:.05, freq:2.0,
  cols:['#e8c050','#3a6ab0','#c8a070','#2a2a30','#d84a2a','#4ab0a0','#e8e0c0','#8a5a2a'], fish:[
  'Nile Tilapia|Fed the pharaohs. Feeds you now.','Bolti|The everyday fish of every Nile village.','Nile Perchlet|A young Nile perch. Grows up fast.','Elephantnose Fish|Finds food with an electric nose.','Nile Puffer|Puffs up when the river floods.',
  'Mormyrid|Talks to its friends with tiny electric pulses.','Senegal Bichir|A living fossil with lungs.','Alestes Tetra|Silver and swift as a chariot.','Upside-down Catfish|Swims belly-up. On purpose.','Papyrus Minnow|Hides in the reeds where scrolls are made.',
  'Scarab Shiner|Rolls little balls of mud.','Lotus Loach|Sleeps under the lotus leaves.','Reed Darter|Darts between the reeds of the delta.','Desert Barb|Has never seen rain.','Sandal Sole|Flat as a sandal. Smells like one.',
  'Nile Perch|A giant river hunter.','African Lungfish|Sleeps in the mud through the dry season.','Electric Catfish|Zaps anything that touches it.','Mummy Minnow|Wrapped in bandages. Still wriggling.','Papyrus Pike|Writes its name in the water.',
  'Sphinx Sunfish|Asks you a riddle before it bites.','Hieroglyph Herring|Its scales are written in an ancient script.','Oasis Oscar|Lives in the only water for a hundred miles.','Felucca Fish|Sails along with a tiny white fin.','Dune Dace|Swims through sand like water.',
  'Sand Scarab Sculpin|Armoured like a beetle.','Ibis Bream|Has a long curved nose.','Crocodile Goby|Hangs out with the crocodiles. They tolerate it.',
  'Pharaoh Perch|Wears a tiny striped headdress.','Anubis Eel|Jackal-headed guardian of the riverbed.','Cleopatra Koi|Beautiful, clever and very hard to catch.','Horus Hawkfish|One eye sees the sun, the other the moon.','Sobek Croc-Gar|Half crocodile. Fully grumpy.',
  'Scarab Beetle Bass|Shines like blue-green jewellery.','Canopic Carp|Keeps something in a jar. Don’t ask.','Obelisk Oarfish|Tall, straight and covered in writing.','Sandstorm Snakehead|Arrives in a cloud of dust.','Golden Ankh Angelfish|Shaped like the symbol of life.','Book of the Dead Bream|Knows the spells.',
  'Tutankhamun Tilapia|Gold mask. Very young. Very famous.','Ramses Nile Perch|Built monuments to itself.','Great Pyramid Puffer|Puffs up into a perfect pyramid.','Sphinx Grouper|Lost its nose a long time ago.','Mummified Sturgeon|Three thousand years old. Still bites.','Eye of Ra Ray|A burning eye on its back.',
  'Osiris Lungfish|Comes back to life every flood season.','Isis Moonfish|Silver wings, guardian of the river.','Set, the Storm Catfish|Brings the desert storms.','Thoth Ibisfish|Wrote the first fish book.',
  'Ra, the Sun Barque|Sails the river by day and the sky by night.',
  'Walk Like an Egyptian Fish|Swims sideways. Elbows out.','Pyramid Scheme Fish|Recruited three other fish to get caught for it.']},
 {id:'circuit', name:'Circuit Lake', eg:6, cost:0, bonus:0, loot:150000, plat:'crystal', depth:'0101 m', pre:'ck', mul:3, bait:['databait','Data Packets',1.7,1,110000,'Fresh bytes: odds ×3 at Circuit Lake.'],
  blurb:'A neon lake in a city that never sleeps. The water hums, the sky is a hologram, and the fish run on batteries.', sky:['#1a0a3a','#c84aa8'], water:['#1a3a6a','#05081a'], hill:'#1a1a3a', amp:.04, freq:2.8,
  cols:['#3af0ff','#ff3ab8','#b8ff3a','#2a2a40','#c8c8e0','#ffd03a','#8a3aff','#3a8aff'], fish:[
  'Byte Minnow|Eight bits of pure fish.','Bit Shiner|Either on or off.','Pixel Perch|Looks blocky up close.','Circuit Chub|Its stripes are copper traces.','Solder Smelt|Smells faintly of hot metal.',
  'Diode Dace|Only swims in one direction.','LED Tetra|Blinks when it is happy.','USB Eel|Takes three tries to plug in.','Battery Goby|Low on charge. Moves slowly.','Capacitor Carp|Stores energy for one big jump.',
  'Cable Catfish|Tangles itself instantly.','Glitch Guppy|Teleports a few centimetres sometimes.','Static Stickleback|Crackles when you touch it.','Router Rudd|Blinking lights. Nobody knows what they mean.','Ping Pike|64 ms. Good enough.',
  'Servo Salmon|Swims with a soft whirr.','Neon Barracuda|Glows hot pink in the dark water.','Drone Dory|Hovers just above the surface.','Hologram Halibut|You can see right through it.','Firewall Flounder|Blocks everything. Including your lure.',
  'Modem Mullet|Screeches when it connects.','Laser Lionfish|Its spines are lasers. Careful.','Overclock Oscar|Runs too fast. Gets hot.','Synthwave Sunfish|Purple, pink and very 1986.','Cyber Koi|Chrome scales, glowing eyes.',
  'Chrome Carp|Reflects the whole city.','Mainframe Mackerel|Takes up an entire room.','Pixel Puffer|Inflates into a perfect square.',
  'Android Angelfish|Dreams of electric sheep.','Quantum Koi|Is both caught and not caught until you look.','Mecha Shark|A giant robot shark. Obviously.','Nanobot Swarmfish|Made of a million tiny robots.','Plasma Pike|Leaves a glowing trail.',
  'Neural Net Snapper|Learned how to avoid your lure. Mostly.','VR Viperfish|Lives in a game inside a game.','Turbo Tuna|Has a little exhaust pipe.','Bootloader Bream|Starts everything up.','Cybernetic Sturgeon|Half fossil, half machine.','Data Stream Eel|A long ribbon of glowing numbers.',
  'Megabyte Marlin|A thousand times bigger than the Byte Minnow.','AI Overlord Grouper|Plans to take over the pond. Very polite about it.','Supercomputer Swordfish|Calculates the perfect escape.','Cyber Samurai Salmon|Neon katana. Honour mode on.','Teraflop Tuna|Trillions of thoughts a second, all about food.','Hacker Hammerhead|Got into your tackle box remotely.',
  'Singularity Eel|Smarter than everything. Still fell for a worm.','Gigachip Koi|Made of one single golden chip.','Root Access Shark|Can do anything. Chooses chaos.','Neon Leviathan|The whole skyline in fish form.',
  'Ghost in the Mainframe|Lives in every machine at once. Today, on your line.',
  'Blue Screen Fish|A fatal error has occurred. Please restart your fish.','Turn It Off And On Fish|Works now. Nobody knows why.']},
 {id:'olympus', name:'Mount Olympus', eg:7, cost:0, bonus:0, loot:200000, plat:'stone', depth:'above the clouds', pre:'ol', mul:3, bait:['ambrosia','Ambrosia',1.7,1.1,150000,'Food of the gods: odds ×3 on Mount Olympus.'],
  blurb:'A lake above the clouds where gods of every land go fishing: Greek, Norse, Egyptian and more. Thunder is normal here.', sky:['#6a8ae8','#fff0d0'], water:['#5ac8e8','#1a4a8a'], hill:'#e8e0d0', amp:.06, freq:2.2,
  cols:['#f0e8d8','#e8c050','#5a8ae8','#c8c8d8','#e85a4a','#3a3a4a','#8ad8c8','#b88aff'], fish:[
  'Nymph Minnow|Lives in a spring and giggles.','Satyr Shiner|Half goat. Plays a tiny flute.','Ambrosia Dace|Tastes like honey and lightning.','Laurel Loach|Wears a tiny crown of leaves.','Lyre Perch|Hums a little tune.',
  'Olive Goby|Small, green and sacred to Athena.','Amphora Carp|Shaped like an old vase. Very old.','Toga Tetra|Draped in white fins.','Rune Smelt|Carved with Norse runes.','Mead Mullet|Smells like a feast hall.',
  'Muse Molly|Inspires poets. Mostly bad ones.','Oracle Darter|Knows when you will cast.','Labyrinth Loach|Gets lost on purpose.','Siren Sardine|Sings sailors onto rocks.','Golden Fleece Fry|A tiny wool-covered fish. Heroes want it.',
  'Hermes Swiftfish|Wings on its fins. Delivers messages.','Athena Owlfish|Wise, grey and watching.','Apollo Sunfish|Glows like the sun at noon.','Artemis Moonfish|Silver, wild and hunts at night.','Ares Barracuda|Wants to fight everything.',
  'Aphrodite Angelfish|So beautiful other fish forget to swim.','Hephaestus Forge Carp|Hot scales. Hammer-shaped head.','Dionysus Wine Wrasse|Deep purple. Always at a party.','Freya Falcon Fish|Wears a cloak of feathers.','Loki Trickster Eel|Pretends to be a stick. Then a snake. Then a fish.',
  'Anansi Spider Fish|Weaves stories in the water.','Quetzal Feather Fish|Covered in green feathers.','Heimdall Watchfish|Sees everything from the rainbow bridge.',
  'Poseidon Trident Fish|Three spikes on its nose. Commands the waves.','Thor Thunderbass|Strikes with a sound like thunder.','Medusa Snakehead|Do not look it in the eye.','Hydra Eel|Cut off a head, two grow back.','Odin One-eye Pike|Gave an eye for wisdom. Worth it.',
  'Amaterasu Sunfish|The sun goddess’s own fish.','Cerberus Catfish|Three heads. Guards the deep end.','Minotaur Grouper|Charges out of its maze.','Pegasus Flying Fish|Leaps out of the lake on white wings.','Fenrir Wolf-eel|Bound by a magic ribbon. Chewing on it.','Valkyrie Wrasse|Chooses the bravest anglers.',
  'Zeus Lightning Marlin|Throws lightning when it jumps.','Hades Underworld Eel|Drags your line down to the dark.','Jormungandr Junior|Will one day circle the world. For now, the lake.','Valhalla Warrior Salmon|Fights all day, feasts all night.','Quetzalcoatl Serpent Fish|A feathered serpent with a rainbow tail.','Athena’s Aegis Ray|Its back is a golden shield.',
  'The Kraken|Release it? You caught it.','Yggdrasil Root Sturgeon|Lives at the roots of the world tree.','Charybdis Whirlpool Grouper|Swallows the sea three times a day.','Phoenix Firefish|Burns up and is born again.',
  'Chronos, the Fish of Time|Older than the gods. You caught it before you cast.',
  'Hercules Gym Bro Fish|Twelve labours. Never skips leg day.','Achilles Heelfish|Unbeatable. Except for one small spot.']},
];
// ---------- building it ----------
const WATER_EG = WATERS_NEW.filter(w=>w.eg);
(function(){
  const hs=s=>{ let h=2166136261; for(let i=0;i<s.length;i++){ h^=s.charCodeAt(i); h=Math.imul(h,16777619); } return (h>>>0)/4294967296; };
  const med=a=>{ const s=a.slice().sort((x,y)=>x-y); return s.length?s[Math.floor(s.length/2)]:0; };
  const ref=(loc,r)=>{ const a=SP.filter(s=>s.loc===loc&&s.r===r&&!s.meme); return {base:med(a.map(s=>s.base)),min:med(a.map(s=>s.min)),max:med(a.map(s=>s.max)),str:med(a.map(s=>s.str))}; };
  const RAR_OF=[...Array(15).fill(0),...Array(13).fill(1),...Array(11).fill(2),...Array(6).fill(3),...Array(4).fill(4),5,1,2];
  const TH={calm:.12,dart:.6,run:.32,thrash:.5,jump:.42,dive:.26,sulk:.2}, AG={calm:.2,dart:.4,run:.6,thrash:.62,jump:.5,dive:.5,sulk:.4};
  const BEH=[['dart','calm','jump','dart','sulk'],['dart','jump','run','thrash','calm'],['run','thrash','jump','dive','sulk'],['run','thrash','dive','jump'],['run','thrash','dive'],['thrash','dive']];
  const fidx=id=>LOCS.findIndex(l=>l.id===id), cl=(v,a,b)=>Math.max(a,Math.min(b,v)), hx=c=>[1,3,5].map(k=>parseInt(c.slice(k,k+2),16)), mixc=(a,b,t)=>{ const A=hx(a),B=hx(b); return '#'+A.map((v,k)=>Math.round(v+(B[k]-v)*t).toString(16).padStart(2,'0')).join(''); };
  const slug=n=>n.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'').replace(/[^a-z0-9]+/g,'').slice(0,24);
  const nice=v=>v<1?+v.toFixed(2):v<10?+v.toFixed(1):Math.round(v);
  for(const Wd of WATERS_NEW){
    // where it sits, and the waters whose numbers it takes after
    let idx; if(Wd.eg){ idx=LOCS.length; } else { idx=fidx(Wd.after)+1; }
    const prev=Wd.eg?'starfall':LOCS[idx-1].id, next=Wd.eg?'starfall':LOCS[idx].id;
    LOCS.splice(idx,0,{id:Wd.id, name:Wd.name, cost:Wd.cost, bonus:Wd.bonus, plat:Wd.plat, blurb:Wd.blurb, sky:Wd.sky, water:Wd.water, hill:Wd.hill, amp:Wd.amp, freq:Wd.freq, depth:Wd.depth, loot:Wd.loot, eg:Wd.eg||0});
    if(Wd.eg){ const o=LOCS[idx]; Object.defineProperty(o,'name',{get(){ return egCharted(this)?Wd.name:'Uncharted Waters'; },configurable:true,enumerable:true}); Object.defineProperty(o,'blurb',{get(){ return egCharted(this)?Wd.blurb:'Complete voyage '+Wd.eg+' to chart these waters.'; },configurable:true,enumerable:true}); } /* Cam's list #12 */
    const lpA=LOCS[fidx(prev)], lpB=LOCS[fidx(next)], w=Wd.eg?0:cl(Math.log(Wd.loot/lpA.loot)/Math.log(lpB.loot/lpA.loot),0,1);
    const R=r=>{ const a=ref(prev,r), b=ref(next,r), g=(x,y)=>x>0&&y>0?Math.exp(Math.log(x)*(1-w)+Math.log(y)*w):(x||y); return {base:g(a.base,b.base),min:g(a.min,b.min),max:g(a.max,b.max),str:a.str*(1-w)+b.str*w}; };
    Wd.fish.forEach((e,i)=>{ const [name,note]=e.split('|'); const id=Wd.pre+'_'+slug(name), r=RAR_OF[i], meme=i>=50, nm=name.toLowerCase(); if(SPI[id]) return;
      const j=hs(id), j2=hs(id+'x'), j3=hs(id+'y'), m=R(r);
      const shape=/eel\b|serpent|snake|lamprey|cable|stream|jormun|anaconda|python|spaghetti|ribbon|boitata|hydra/.test(nm)?'e':/\bray\b|stingray|flounder|halibut|plaice|sole\b|aegis|pancake/.test(nm)?'r':/shark|hammerhead|sawfish|dogfish/.test(nm)?'s':/puffer|porcupine|popcorn|donut|meatball|dumpling|balloon/.test(nm)?'p':/lobster|crab|shrimp/.test(nm)?'c':'f';
      const beh=BEH[r][Math.floor(j*BEH[r].length)], time=i%5===0?'night':i%5===1?'day':'any';
      const kw=[[/gold|golden|ogon|sun\b|ra,|amaterasu|yellow/,'#e8b830'],[/pink|sakura|cherry|flamingo|petal|rosy/,'#f08ab8'],[/neon|cyber|laser|plasma|synth|hologram/,'#3af0ff'],[/red|ruby|fire|ember|crimson|kohaku/,'#d8402a'],[/black|shadow|ghost|phantom|night/,'#2a2a34'],[/silver|chrome|moon|white|snow|glacier/,'#c8d0dc'],[/blue|sky|ice\b|poseidon/,'#3a7ad8'],[/green|olive|leaf|moss|jade/,'#4a9a4a']];
      let col=Wd.cols[Math.floor(j2*Wd.cols.length)]; for(const [rx,c] of kw) if(rx.test(nm)){ col=c; break; }
      const belly=mixc(col,'#ffffff',.55+.25*j3), h=shape==='p'?.6:shape==='r'||shape==='e'?.2:shape==='s'?.28:+(.3+.15*j).toFixed(2);
      const size=(r>=5?1.3:.75+.5*j)*(meme?1:1), vk=(meme?1.05:1)*(.82+.4*j);
      const base=Math.max(1,Math.round(m.base*vk)), min=nice(m.min*size*(.85+.3*j2)), max=nice(Math.max(min*1.6,m.max*size*(.85+.3*j)));
      const s={id,loc:Wd.id,name,r,min,max,base,str:+(m.str*(.9+.2*j2)).toFixed(1),time,th:+(TH[beh]+(j-.5)*.08).toFixed(2),col,belly,h,beh,aggr:+(AG[beh]+(j2-.5)*.1).toFixed(2),shape,pat:Math.floor(j3*3),note};
      if(meme) s.meme=1; if(Wd.eg) s.eg=1; SP.push(s); SPI[id]=s; });
    // its own bait, best at its own water
    const [bk,bn,sp,rare,price,bnote]=Wd.bait; if(!BAIT[bk]) BAIT[bk]={name:bn, speed:sp, rare, pack:10, price, loc:Wd.id, locMul:Wd.mul, note:bnote};
  }
})();
// ---------- end-game waters: open by voyages, never in the unlock chain, scaled to your progress ----------
const isEgLoc = id => { const L=LOCS[locIdx(id)]; return !!(L&&L.eg); };
/* Cam's list #12: an end-game water is "Uncharted Waters" (name and card) until you reach its voyage; then it opens for coins like any
   water and stays open for good once paid for (S.egPaid). Waters a save already had open count as paid. */
/* (function declarations: the name getters below can run while the page is still loading) */
function egCharted(L){ try{ return !!L && ((S.tides||0) >= (L.eg||0) || S.unlocked.includes(L.id)); }catch(e){ return false; } } /* a water you can already travel to is charted (director, 2026-11-22: open waters were still called Uncharted Waters after Unlock everything) */
const egCost = L => Math.max(1000, Math.round(30*bestNormalLoot()*(1+.15*((L.eg||2)-2))/1000)*1000); /* balance first version (the director and Cam decide): about 30 catches' worth at your best water */
function egOpenAdd(st){ st=st||S; if(!st||!Array.isArray(st.unlocked)) return; if(!Array.isArray(st.egPaid)) st.egPaid=[];
  for(const Wd of WATER_EG){ if(st.unlocked.includes(Wd.id)&&!st.egPaid.includes(Wd.id)) st.egPaid.push(Wd.id); if(st.egPaid.includes(Wd.id)&&!st.unlocked.includes(Wd.id)) st.unlocked.push(Wd.id); } }
/* the water before an end-game water only has to be open when it is an end-game water too (they open in order) */
const locPrevOk = i => i<=0 || S.unlocked.includes(LOCS[i-1].id) || (!!LOCS[i].eg && !LOCS[i-1].eg);
const bestNormalLoot = () => Math.max(...S.unlocked.filter(id=>!isEgLoc(id)).map(id=>{ const L=LOCS[locIdx(id)]; return L?L.loot:40; }),40);
function egRefStr(){ const ids=S.unlocked.filter(id=>!isEgLoc(id)), best=ids.map(id=>LOCS[locIdx(id)]).filter(Boolean).sort((a,b)=>b.loot-a.loot)[0]||LOCS[0]; const a=SP.filter(s=>s.loc===best.id&&!s.meme).map(s=>s.str).sort((x,y)=>x-y); return a.length?a[a.length>>1]:3; }
let EG_SF_STR=0; const egSfStr = () => EG_SF_STR||(EG_SF_STR=(()=>{ const a=SP.filter(s=>s.loc==='starfall'&&!s.meme).map(s=>s.str).sort((x,y)=>x-y); return a[a.length>>1]||40; })());
function egScale(){ return {v:1.25*bestNormalLoot()/33000, s:1.1*egRefStr()/egSfStr()}; }
document.head.insertAdjacentHTML('beforeend','<style>#panel .eg-head{grid-column:1/-1;margin:14px 0 2px;padding-top:10px;border-top:1px solid #ffd36a44}#panel .eg-head h3{margin:0 0 2px;color:#ffe6a8}</style>');
