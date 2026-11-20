// =====================================================================
// 0.4.9 [2] Oddities to 300 (director, 2026-11-19: "Increase the amount of oddities to 300. Go hard. Do memes ... household objects,
// human manufactured products, treasures of old and mythological times ... one that's a talking/singing bass mount ... Some of these can
// be location specific ... rarities ... only show in the oddities page once they have been acquired at least once ... acquire conditions
// and percentages ... gold rewards ... scale ... with respect to the highest water you have currently unlocked - but will scale down
// slightly if fished out of an earlier Water ... Each time beyond the first ... scale its gold value."). Shared by every platform.
//  - 200 new oddities (300 in all). Some only turn up at one water (new waters included) or only at night.
//  - Gold: based on your best water, a bit less in earlier ones (never below 60%); each repeat find pays 10% more, up to ×3.
//  - Rarity, odds and where it turns up stay hidden until you have found one.
//  - Art: each new oddity is drawn from one of 26 picture templates in its own colours (also its shadow on the hook).
// Format: 'id|Name|tier 0-3|template|colour,colour|effect|quote|condition'. Effects: c<n> coins × base, b<key>:<v>:<min> boost,
// s<n> Scales, l<bait>:<n> lures, h hat, pc pet colour, nb Nibbles, song the singing bass. Conditions: a water id or 'night'.
// =====================================================================
const ODD_NEW=`
rubberduck|Rubber Duck|0|duck|#ffd23a,#ff8a2a|c0.4|Squeaks once. Then never again.|
fidget|Fidget Spinner|0|spinner|#3a8ae8,#c8c8d0|bbite:.2:5|Still spinning. Since 2017.|
lostsock|Lost Sock|0|sock|#e86a6a,#ffffff|c0.3|So this is where they all go.|
remote|TV Remote|0|remote|#2a2a30,#e8402a|c0.5|The batteries are dead. So is the TV.|
sporkk|Plastic Spork|0|spork|#f0f0f0,#c8c8c8|c0.2|Half spoon, half fork, fully useless.|
dentures|Pair of Dentures|0|teeth|#fff8e8,#e88a8a|c0.6|Smiling at you. Please stop.|
traffic|Traffic Cone|0|cone|#ff7a2a,#ffffff|c0.4|Someone’s Saturday night ended here.|
toaster|Waterlogged Toaster|0|box|#c8ccd4,#3a3a40|c0.7|Do not plug it in.|
cdrom|Scratched CD|0|disc|#d8d8e8,#a87ae8|c0.3|Contains one burned mixtape. Embarrassing.|
gameboy|Handheld Console|0|gadget|#c8c8c0,#5a6a3a|bxp:.2:5|Still has a save file. Level 99.|
umbrella|Inside-out Umbrella|0|umbrella|#3a5ab8,#2a2a30|c0.3|Fought the wind. Lost.|
yoyo|Yo-yo|0|disc|#e8302a,#ffd03a|c0.3|Walks the dog. Underwater.|
crocs|Single Clog|0|shoe|#5ae86a,#3ab04a|c0.3|In sport mode.|
mug|“World’s Best Dad” Mug|0|cup|#ffffff,#3a6ab8|c0.4|Not anymore, apparently.|
plunger|Plunger|0|plunger|#c83a2a,#8a5a3a|c0.3|Hopefully unused.|
keyboard|Soggy Keyboard|0|remote|#2a2a34,#c8c8d0|c0.4|The W key is missing. Classic.|
icecube|Novelty Ice Cube Tray|0|box|#8ad8ff,#ffffff|c0.3|Shaped like little fish. Ironic.|
garden|Garden Gnome Hat|0|cone|#d8302a,#ffffff|c0.4|The gnome is still looking for it.|
pizzabox|Empty Pizza Box|0|box|#e8c888,#c83a2a|c0.3|Somebody ate it all. Rude.|
lavalamp|Lava Lamp|0|lamp|#ff4a8a,#3a3a6a|bcalm:.2:5|Groovy. Still bubbling somehow.|
glowstick|Glow Stick|0|stick|#8aff4a,#ffffff|brare:.1:5|Still glowing from a party in 2009.|night
tennisball|Tennis Ball|0|ball|#d8ff3a,#ffffff|c0.3|A dog is somewhere very sad.|
beachball|Beach Ball|0|ball|#ff5a5a,#5ab0ff|c0.3|Bonks you on the head.|keys
flipflop|Flip-flop|0|shoe|#3ab0e8,#ffd03a|c0.3|The other one is in the Bahamas.|keys
sunglasses|Cheap Sunglasses|0|glasses|#2a2a2a,#e86ab8|c0.4|Too cool for the water.|
snowglobe|Snow Globe|0|globe|#a8d8ff,#ffffff|bshiny:.15:5|It is always winter inside.|rockies
hockey|Hockey Puck|0|disc|#1a1a1a,#3a3a3a|c0.5|Shot from three lakes over.|rockies
maple|Maple Syrup Tin|0|can|#c83a2a,#e8c070|c0.8|Still sweet. Very Canadian.|rockies
chopsticks|Pair of Chopsticks|0|stick|#c8905a,#8a5a2a|c0.3|One is slightly shorter. Typical.|blossom
fan|Paper Fan|0|fan|#f4a0c0,#d8302a|bcalm:.15:5|Cools the koi in summer.|blossom
fishhook|Rusty Hook Collection|0|key|#8a6a4a,#c8a070|s2|Someone’s old tackle. Still sharp.|
banana|Rubber Banana|0|banana|#ffe03a,#8a6a2a|c0.3|For scale.|
pacifier|Pacifier|0|ball|#8ad8ff,#ffffff|c0.2|A baby is crying somewhere on the shore.|
tamagotchi|Pocket Pet Keyring|0|gadget|#f08ab8,#ffffff|c0.5|It died of neglect in 1998. Rest easy.|
pager|Pager|0|remote|#3a3a3a,#8aff8a|c0.4|One message: “call me”.|
lunchbox|Dented Lunchbox|0|box|#3a8ae8,#ffd03a|c0.4|Half a sandwich left. Do not.|
rubikcube|Puzzle Cube|0|cube|#e8302a,#3ae86a|bxp:.15:5|Five sides solved. So close.|
slinky|Metal Spring Toy|0|spring|#c8c8d0,#8a8a96|c0.3|Walks down stairs. Not in water.|
hairdryer|Hairdryer|0|gadget|#f08ab8,#3a3a40|c0.4|Absolutely do not.|
balloon|Deflated Balloon|0|ball|#e8302a,#ffffff|c0.2|Happy Birthday… someone.|
receipt|Very Long Receipt|0|scroll|#ffffff,#c8c8c8|c0.2|You saved 0.00 today.|
headphones|Tangled Earbuds|0|spring|#ffffff,#c8c8c8|c0.3|They tangled themselves underwater.|
rubberchicken|Rubber Chicken|0|banana|#ffd23a,#e8302a|c0.4|Screams when squeezed.|farm
eggcarton|Egg Carton (Empty)|0|box|#e8d8b8,#c8b898|c0.2|The chickens want answers.|farm
napkin|Gravy-Stained Napkin|0|scroll|#ffffff,#9a5a24|c0.2|Someone had a great time.|buffet
tupperware|Lidless Container|0|box|#c8e8ff,#3a8ae8|c0.3|The lid is in another dimension.|buffet
stapler|Red Stapler|0|stapler|#d8302a,#2a2a30|c0.5|They took it. Now it’s yours.|corporate
lanyard|Visitor Lanyard|0|stick|#3a6ab8,#ffffff|c0.3|“Hello my name is: Fish”.|corporate
ankhkey|Clay Ankh Charm|0|key|#c8905a,#8a5a2a|c0.6|Mass-produced in 1300 BC.|nile
floppy|Floppy Disk|0|cube|#2a2a34,#c8c8d0|c0.4|The save icon, in the flesh.|circuit
singingbass|Singing Bass Mount|2|fishmount|#5a7a3a,#8a5a2a|song|It turns its head and sings at you. Every. Single. Time.|
nokia|Brick Phone|1|phone|#2a3a3a,#8ab08a|c1.5|Survived the fall, the water and 20 years. Unbreakable.|
lavaduck|Golden Rubber Duck|1|duck|#ffd03a,#fff0b0|c2.5|Squeaks in a richer tone.|
gnomeking|Gnome King Statue|1|statue|#d8302a,#3a6ab8|c1.8|Rules all garden gnomes. Benevolently.|
pinata|Soggy Piñata|1|statue|#ff6ab8,#ffd03a|c2|Still full of soggy candy.|
vhs|VHS Tape: “Fishing 101”|1|box|#2a2a2a,#e8e8e8|bxp:.3:6|Be kind, rewind.|
discoball|Disco Ball|1|globe|#e8e8f8,#8a8aa8|bshiny:.25:6|The fish start dancing.|night
jukebox|Tiny Jukebox|1|lamp|#e8402a,#ffd03a|c2|Plays one song: a sea shanty.|
lavender|Bath Bomb|1|ball|#b88aff,#ffffff|bcalm:.3:6|The whole lake smells of lavender now.|
crystalball|Fortune Teller’s Crystal Ball|1|globe|#b8a0ff,#3a2a6a|brare:.25:6|It says you will catch a fish. Accurate.|
compass2|Broken Compass|1|disc|#c8a050,#3a3a3a|bhot:.3:6|Always points at the nearest fish.|
treasuremap|Half a Treasure Map|1|scroll|#e8d0a0,#8a5a2a|btreasure:.4:6|X marks… somewhere around here.|
genielamp2|Brass Teapot|1|lamp|#e8b830,#8a6a2a|c2|No genie. Just tea. Very old tea.|
cuckoo|Cuckoo Clock|1|clock|#8a5a2a,#e8d0a0|bbite:.3:6|Goes off every hour. Underwater too.|
typewriter|Typewriter|1|box|#3a3a40,#c8c8c8|bxp:.3:6|The last line reads: “the fish win”.|
roboticdog|Robot Dog Toy|1|gadget|#c8c8d0,#3a8ae8|pc|Barks in binary.|
blender|Smoothie Blender|1|cup|#c8e8ff,#e8402a|c1.5|Still has a strawberry in it.|
trophyfish|Participation Trophy|1|trophy|#e8b830,#8a6a2a|bxp:.25:6|You tried. That’s what counts.|
hourglass2|Sand Timer|1|hourglass|#e8c070,#8a5a2a|bbite:.25:6|Somebody’s two minutes are up.|
keytar|Keytar|1|guitar|#ff3ab8,#3a3a40|c2|The most 80s thing ever caught.|
banjo|Waterlogged Banjo|1|guitar|#c8905a,#f0e8d8|c1.6|Plays one sad note.|
gameboy2|Arcade Cabinet Joystick|1|stick|#e8302a,#2a2a30|bbite:.2:6|High score: AAA.|circuit
vrheadset|VR Headset|1|glasses|#2a2a34,#3af0ff|bxp:.3:6|Was living in a simulation. Now it’s wet.|circuit
hologram|Hologram Projector|1|gadget|#3af0ff,#ff3ab8|bshiny:.25:6|Projects a tiny dancing fish.|circuit
goldbar|Fake Gold Bar|1|bar|#e8c040,#8a6a2a|c1.2|Painted lead. Nice try.|
tiara|Plastic Tiara|1|crown|#f08ab8,#ffffff|c1.4|For a very small princess.|
mixtape|Mixtape “Lake Vibes”|1|box|#ff8a3a,#2a2a2a|bcalm:.3:6|Track 3 is just splashing.|
pharaohcat|Cat Mummy|1|statue|#c8a070,#4a3a2a|c2.2|It looks offended to be woken.|nile
scarab|Scarab Amulet|1|gem|#3ab0a0,#e8c050|brare:.2:6|Rolls toward luck.|nile
papyrus|Papyrus Scroll|1|scroll|#e8d8a0,#3a2a1a|bxp:.35:6|A recipe for fish. Rude.|nile
hieroglyph|Hieroglyph Tablet|1|bar|#c8a070,#3a2a1a|c2|It says “nice catch” in ancient Egyptian.|nile
koipond|Ceramic Lucky Cat|1|statue|#ffffff,#e8302a|bshiny:.25:6|Waves at every fish that passes.|blossom
daruma|Daruma Doll|1|ball|#d8302a,#ffffff|bbite:.3:6|One eye painted. Make a wish.|blossom
kokeshi|Wooden Doll|1|statue|#e8c890,#d8302a|c1.6|Smiles serenely at the bottom of the lake.|blossom
moosehorn|Moose Antler|1|antler|#c8a070,#8a6a4a|c2|The moose wants it back.|rockies
mountiehat|Wide-brim Ranger Hat|1|cone|#8a6a3a,#3a2a1a|h|Always gets its fish.|rockies
flamingo2|Plastic Flamingo|1|flamingo|#ff7ab8,#2a2a2a|c1.5|Every Florida lawn has one. Now so do you.|keys
alligatorhat|Inflatable Alligator|1|banana|#3ab04a,#ffffff|c1.4|It’s a pool toy. Probably.|keys
shrunkenhead|Rainforest Tiki Mask|1|mask|#8a5a2a,#e8c050|c2|Glares at you. Politely.|amazon
dartfrog|Ceramic Poison Frog|1|statue|#3ab0ff,#1a1a1a|brare:.25:6|Bright blue, very warning-like.|amazon
cowbell|Cowbell|1|cone|#c8a050,#3a3a3a|bbite:.3:6|More cowbell.|farm
pitchfork|Pitchfork|1|trident|#8a6a4a,#c8c8d0|c1.4|For hay, not for fish.|farm
goldenegg|Golden Egg|1|egg|#ffd03a,#fff0b0|c3|A goose is very upset somewhere.|farm
gravyboat|Silver Gravy Boat|1|cup|#d8d8e0,#9a5a24|c2|Sails on a sea of gravy.|buffet
fortune2|Giant Fortune Cookie|1|egg|#e8c070,#c8905a|bxp:.3:6|“You will catch a fortune cookie.”|buffet
goldspoon|Golden Spoon|1|spork|#ffd03a,#c8901a|c2.4|Someone was born with it.|buffet
briefcase|Briefcase|1|box|#3a2a1a,#c8a050|c2.5|Full of very important papers. All blank.|corporate
golfclub|Office Golf Putter|1|stick|#c8c8d0,#2a2a30|c1.6|For the corner office putting green.|corporate
laurel|Laurel Wreath|1|ring|#5a9a3a,#e8c050|bxp:.3:6|For the winner. That’s you.|olympus
amphora|Greek Amphora|1|vase|#c8703a,#2a2a2a|c2.4|Painted with a fish story.|olympus
lyre|Golden Lyre|1|guitar|#e8c050,#fff0b0|bcalm:.35:6|Plays itself. Very gently.|olympus
toyrobot|Wind-up Robot|1|gadget|#c8c8d0,#e8302a|c1.4|Walks in circles. Beeps.|
snorkel|Snorkel Mask|1|glasses|#3ab0e8,#ffd03a|bhot:.25:6|Someone was looking for fish too.|
messagebottle|Message in a Bottle|1|bottle|#8ad8a8,#e8d8a0|c2|It says “HELP. Out of bait.”|
pirateparrot|Plush Parrot|1|plush|#3ab04a,#e8302a|pc|Squawks “pieces of eight”.|
lavaflask|Thermos of Soup|1|can|#c83a2a,#c8c8d0|c1.2|Still warm. How?|
wizardstaff|Plastic Wizard Staff|1|stick|#8a5aa0,#3af0ff|bshiny:.2:6|Glows when you say the magic word.|night
astronaut|Astronaut Ice Cream|1|box|#c8c8d0,#ff8a3a|c1.4|Freeze-dried. Crunchy.|
ufo2|Toy Flying Saucer|1|ufo|#c8c8d0,#8aff8a|c1.8|Probed by a small child.|
dino|Plastic Dinosaur|1|dino|#3ab04a,#ffd03a|c1.3|Rawr, but small.|
excalibur|Sword in a Stone (Small)|3|sword|#c8ccd8,#8a8a96|c12|Only the worthy can pull it. You pulled it with a fishing line.|
aztecmask|Golden Sun Mask|2|mask|#e8b830,#3ab0a0|c6|Stares at the sun without blinking.|
vikinghorn|Viking Drinking Horn|2|antler|#e8d8b8,#8a5a2a|c5|Smells of mead and victory.|
samurai|Samurai Helmet|2|helmet|#2a2a30,#d8302a|c6|A crescent moon on the crest.|blossom
katana|Ceremonial Katana|2|sword|#c8ccd8,#2a2a30|c7|Folded a thousand times. Still rusts.|blossom
fabergé|Jewelled Egg|2|egg|#d8302a,#e8c050|c8|Opens to reveal a smaller egg.|
pharaohmask|Golden Death Mask|3|mask|#e8b830,#3a5ab8|c16|The face of a boy king.|nile
canopic|Canopic Jar|2|vase|#e8d8b8,#3a6ab8|c5|There is something inside. Leave it.|nile
eyeofra|Eye of Horus Pendant|2|gem|#3a6ab8,#e8c050|brare:.4:8|It sees everything. Including your bait.|nile
thorhammer|Tiny Thunder Hammer|2|hammer|#8a8a96,#8a5a2a|c6|Only the worthy can lift it. It weighs 2 grams.|olympus
trident|Bronze Trident|3|trident|#c8a050,#3ab0e8|c14|Belonged to someone important.|olympus
goldenfleece|Golden Fleece|3|plush|#ffd03a,#fff0b0|c15|Heroes crossed seas for this. You crossed a dock.|olympus
medusa|Medusa Head Shield|2|disc|#c8a050,#3ab04a|c6|Do not look at it. You looked at it.|olympus
pandorabox|Pandora’s Lunchbox|2|box|#c8a050,#3a2a1a|btreasure:.5:8|Do NOT open it. (You opened it. Hope came out.)|olympus
mjolnirkey|Rune Stone|2|bar|#8a8a96,#3af0ff|bxp:.4:8|The runes spell “fish”.|
dragonegg|Dragon Egg|3|egg|#8a2ae8,#ff6a3a|c18|Warm. Very warm. It just moved.|
phoenix|Phoenix Feather|3|feather|#ff6a2a,#ffd03a|bshiny:.6:10|Burns without burning.|
holygrail|Ancient Golden Cup|3|cup|#e8b830,#fff0b0|c20|Choose wisely. You chose it.|
atlantis|Atlantis Tile|3|bar|#3ab0e8,#e8c050|c15|A floor tile from a city that sank.|
kraken|Kraken Tooth|2|tooth|#f0e8d8,#c8b898|c6|Bigger than your forearm.|
mermaidtail|Mermaid Scale|2|gem|#3ae8c8,#b8a0ff|bshiny:.35:8|Shimmers in every colour.|
unicornhorn|Unicorn Horn|3|horn|#ffffff,#f08ab8|c16|Spiral, pearly and probably not plastic.|
crown2|Lost Crown of the Lake King|3|crown|#e8b830,#d8302a|c18|The lake had a king. You have his crown.|
shipwheel2|Ghost Ship’s Wheel|2|wheel|#8a8aa8,#c8c8e0|c6|Turns by itself at midnight.|night
cursedcoin|Cursed Doubloon|2|coin|#c8a050,#3a2a1a|c7|Worth a fortune. Feels watched.|
ruby|Giant Ruby|3|gem|#e8203a,#ff8a9a|c17|Big enough to see your face in.|
sapphire|Star Sapphire|2|gem|#3a5ae8,#ffffff|c8|A six-pointed star shines inside.|
emerald|Raw Emerald|2|gem|#3ab04a,#bfffd0|c7|Straight from the jungle river.|amazon
eldoradoidol|Golden Idol|3|statue|#e8b830,#8a6a2a|c19|Swap it for a bag of sand. Run.|amazon
jaguarstatue|Jade Jaguar|2|statue|#3ab07a,#1a3a2a|c7|Carved by a lost civilisation.|amazon
moonrock|Moon Rock|2|ball|#c8c8d0,#8a8a96|brare:.35:8|Fell from the sky. Smells like fireworks.|night
meteorite|Small Meteorite|2|ball|#5a4a4a,#ff8a3a|c6|Still warm from re-entry.|night
pearlnecklace|Pearl Necklace|2|ring|#ffffff,#e8e0f0|c6|Somebody’s grandmother is still looking for it.|
goldwatch|Gold Pocket Watch|2|clock|#e8b830,#ffffff|bbite:.4:8|Stopped at the exact moment it fell in.|
stradivarius|Old Violin|2|guitar|#a85a2a,#3a2a1a|c8|Worth millions if it wasn’t full of water.|
gramophone|Gramophone|2|lamp|#c8a050,#3a2a1a|bcalm:.4:8|Plays a scratchy waltz for the fish.|
taxidermy|Mounted Jackalope|2|antler|#c8a070,#f0e8d8|c5|Half rabbit, half antelope, all myth.|rockies
bigfootprint|Bigfoot Footprint Cast|2|shoe|#c8b898,#8a7a6a|c6|Size 47. Very real.|rockies
spaceshuttle|Model Space Shuttle|2|rocket|#ffffff,#3a3a40|c6|Launched from the beach. Landed here.|keys
treasurechest2|Pirate’s Strongbox|3|chest|#8a5a2a,#e8b830|c15|Captain Something’s gold. Some of it.|keys
goldencarp|Golden Koi Figurine|2|statue|#e8b830,#d8302a|c7|Brings luck to every pond it lives in.|blossom
gamecart|Golden Game Cartridge|2|cube|#e8b830,#2a2a30|bxp:.4:8|The rarest game ever made. It’s about fishing.|circuit
quantumchip|Quantum Chip|3|cube|#3af0ff,#ff3ab8|c15|Is both in your hand and not.|circuit
robotheart|Robot Heart|2|gem|#ff3ab8,#c8c8d0|c6|Beats in binary.|circuit
goldstock|Golden Stock Certificate|2|scroll|#e8d0a0,#e8b830|c7|For a company that sells ice to fish.|corporate
cornerstone|Corner Office Key|2|key|#e8b830,#c8a050|c6|You got promoted. Congratulations.|corporate
diamondtie|Diamond Tie Clip|3|bar|#e8f0ff,#c8c8d0|c15|Very expensive. Very shiny. Very corporate.|corporate
truffle|Giant White Truffle|2|ball|#e8d8c0,#8a7a5a|c7|Smells incredible. Pigs are jealous.|buffet
goldenladle|Golden Ladle|2|spork|#e8b830,#c8901a|c6|Serves the soup of the gods.|buffet
caviar|Tin of Caviar|3|can|#2a2a2a,#e8b830|c15|Tiny, black and worth more than your rod.|buffet
blueribbon|Blue Ribbon Rosette|2|ring|#3a6ae8,#ffd03a|c5|First prize, Biggest Pumpkin, 1974.|farm
goldenhorseshoe|Golden Horseshoe|3|horseshoe|#e8b830,#fff0b0|bshiny:.5:10|The luckiest thing on the farm.|farm
pegasusfeather|Pegasus Feather|2|feather|#ffffff,#a8d8ff|bbite:.4:8|Light as a cloud.|olympus
zeusbolt|Bottled Lightning|3|bottle|#ffff8a,#3a5ae8|c16|Crackles. Do not shake.|olympus
nilecrown|Double Crown of Egypt|3|crown|#ffffff,#d8302a|c17|Upper and lower river, one crown.|nile
sphinxnose|The Sphinx’s Nose|3|statue|#c8a070,#8a6a4a|c18|So that’s where it went.|nile
memecat|Grumpy Cat Statuette|1|statue|#c8a070,#3a2a1a|c1.5|Did not enjoy being fished up.|
memedog|Shiba Plushie|1|plush|#e8a050,#ffffff|pc|Much soggy. Very cute. Wow.|
rickroll|Cassette: “Never Gonna…”|1|box|#2a2a2a,#e8402a|bcalm:.3:6|You know the rest.|
nyancat|Pop-Tart Cat Toy|2|plush|#f08ab8,#3a3a6a|bshiny:.3:8|Leaves a rainbow trail in the water.|
amogus|Suspicious Little Astronaut|1|bean|#e8302a,#8ad8ff|c1.4|Looks a bit sus.|
trollface|Trollface Mask|1|mask|#ffffff,#2a2a2a|c1.2|Problem?|
pepe|Sad Frog Mug|1|cup|#4ab04a,#ffffff|c1.3|Feels bad, man.|
thisisfine|“This Is Fine” Dog Figure|1|statue|#e8c070,#ff6a2a|bcalm:.3:6|Everything is fine.|
stonks|“Stonks” Poster|1|scroll|#3a6ae8,#ffffff|c2|Number goes up.|corporate
bigchungus|Very Large Rabbit Plush|2|plush|#c8c8d0,#ffffff|c5|Absolutely enormous.|farm
dramallama|Llama Piñata|1|statue|#ffffff,#ff6ab8|c1.4|Spits candy.|farm
hamsterball|Hamster Ball (Empty)|0|globe|#c8e8ff,#ffffff|c0.3|The hamster escaped. Legend.|farm
expectedtoaster|Toaster Strudel Box|0|box|#3a8ae8,#ffffff|c0.3|Expired in 2004.|buffet
loaf|Loaf of Bread|0|bread|#e8a85a,#c87a3a|lcricket:5|The ducks are furious.|
baguette|Baguette|0|bread|#e8b870,#c8905a|c0.3|Hon hon. Soggy.|
coconut|Coconut|0|ball|#8a5a2a,#f0e8d8|c0.4|Someone named it Wilson.|keys
waterbottle|Plastic Water Bottle|0|bottle|#c8e8ff,#3a8ae8|c0.2|Ironic.|
noodle|Pool Noodle|0|stick|#ff6ab8,#ffffff|c0.2|Floats. Obviously.|
skateboard|Skateboard|1|board|#e8402a,#2a2a2a|c1.4|Kickflipped right into the lake.|
surfboard|Surfboard|1|board|#3ab0e8,#ffffff|c1.6|Gnarly. Wet.|keys
snowboard|Snowboard|1|board|#3a3a40,#ffd03a|c1.6|Took a wrong turn off the mountain.|rockies
canoeoar|Canoe Paddle|0|paddle|#c8905a,#e8402a|c0.4|Up a creek without the rest of it.|rockies
lifering|Life Ring|0|ring|#ff5a3a,#ffffff|c0.4|Saved someone once. Now it’s resting.|
anchor2|Tiny Anchor|0|anchor|#5a6a78,#3a4652|c0.5|From a very small boat.|
bell|Bicycle Bell|0|disc|#c8c8d0,#3a3a40|bbite:.15:5|Ding ding.|
gnomeboot|Wellington Boot (Yellow)|0|shoe|#ffd23a,#3a3a3a|c0.3|The left one. Always the left one.|
selfiestick|Selfie Stick|0|stick|#2a2a30,#c8c8d0|c0.3|Took one last photo on the way down.|
airfryer|Air Fryer|1|box|#2a2a30,#e8402a|c1.4|Cooks fish in eight minutes. Not this one.|buffet
lavabird|Rubber Chicken Mask|0|mask|#ffffff,#e8302a|c0.3|Somebody had a very strange party.|
crystalskull|Crystal Skull|3|mask|#d8f0ff,#a8c8e8|c16|Glows faintly. Hums at night.|night
ancientcoin|Roman Coin|1|coin|#c8a050,#8a6a2a|c2|An emperor’s face, worn smooth by the river.|
gnomeadmiral|Garden Gnome in a Captain’s Hat|1|statue|#3a6ab8,#ffffff|c1.6|Commands the lake with quiet dignity.|
starcharts|Star Chart|2|scroll|#1a2a5a,#ffd03a|brare:.35:8|Maps every constellation, plus one shaped like a fish.|
ghostlantern|Ghost Lantern|2|lamp|#8af0d8,#2a3a3a|bshiny:.35:8|Lit by something that isn’t fire.|night
`.trim().split('\n').filter(Boolean);
const ODD_SPARE=`
cassetteplayer|Portable Cassette Player|0|gadget|#3a6ab8,#c8c8d0|c0.4|Auto-reverse. Auto-soggy.|
gumball|Gumball Machine Globe|0|globe|#ff5a8a,#ffd03a|c0.4|Still full. Still not free.|
bowlingpin|Bowling Pin|0|bottle|#ffffff,#d8302a|c0.4|Strike. Underwater.|
shoppingcart|Shopping Cart Wheel|0|disc|#8a8a96,#2a2a30|c0.3|It wobbles. They all wobble.|
whistle|Coach’s Whistle|0|key|#c8c8d0,#3a3a3a|bbite:.15:5|One long blast. Everyone stops.|
inflatabledino|Inflatable Dinosaur|1|dino|#8ad85a,#ffffff|c1.4|Deflating slowly. Like all dinosaurs.|
goldfishbowl|Empty Goldfish Bowl|0|globe|#c8e8ff,#ffffff|c0.3|The goldfish went home.|
chesspiece|Marble Chess King|1|statue|#f0ece4,#2a2a2a|c1.6|Checkmate, fish.|
bonsai|Bonsai Tree (Plastic)|1|plush|#4a8a3a,#8a5a2a|bcalm:.25:6|Very zen. Very fake.|
weathervane|Rooster Weathervane|1|flamingo|#c8a050,#3a3a3a|bhot:.25:6|Points wherever the fish are.|farm
espresso|Office Espresso Machine|1|box|#c8c8d0,#2a2a30|bbite:.3:6|The most important machine in the building.|corporate
ankhgold|Golden Ankh|2|key|#e8b830,#fff0b0|brare:.35:8|The key of life.|nile
moaimini|Little Stone Head|2|statue|#8a8a80,#5a5a54|c6|Stares out to sea. Patiently.|
viking|Viking Shield|2|disc|#c83a2a,#e8d8b8|c6|Dented by a hundred battles.|
grimoire|Waterlogged Spellbook|2|scroll|#4a2a5a,#e8c050|bxp:.45:8|Half the spells turn things into fish.|night
teslacoil|Tiny Tesla Coil|2|lamp|#c8c8d0,#3af0ff|c6|Zaps the water every few seconds.|circuit
cornucopia|Golden Horn of Plenty|3|horn|#e8b830,#ff8a3a|c15|Pours out fruit forever.|buffet
moonmedal|Silver Moon Medal|2|coin|#d8d8e8,#8a8aa8|c6|Awarded for fishing under a full moon.|night
glassslipper|Glass Slipper|2|shoe|#d8f0ff,#ffffff|c7|Fits nobody. Midnight passed long ago.|
goldenrecord|Golden Record|3|disc|#e8b830,#8a6a2a|c15|Sounds of Earth, sent to the stars. Came back.|
`.trim().split("\n").filter(Boolean); /* spares fill the list to 300 when a new idea repeats an older oddity */
const ODD_TIER_NAMES=['Junk','Odd junk','Rare find','Treasure'];
// add them to the list (each one knows its template, colours, water and night rule)
{ const seen=new Set(), keep=JUNK.filter(j=>!seen.has(j.id)&&seen.add(j.id)); JUNK.length=0; JUNK.push(...keep); for(const j of JUNK) JUNKI[j.id]=j; } /* the old list held a few entries twice (Lava Lamp, Snow Globe): keep the first */
try{ if(JUNKI.ancientcoin) JUNKI.ancientcoin.name='Old Gold Coin'; if(JUNKI.traffic) JUNKI.traffic.name='Road Works Cone'; }catch(e){} /* two old pairs shared a name */
const ODD_OLD_N=JUNK.length, ODD_NAMES=new Set(JUNK.map(j=>j.name.toLowerCase()));
for(const line of [...ODD_NEW,...ODD_SPARE]){ if(JUNK.length>=300) break; let [id,name,t,art,cols,eff,q,cond]=line.split('|'); if(ODD_NAMES.has(name.toLowerCase())) continue; if(JUNKI[id]&&JUNK.includes(JUNKI[id])) id='n_'+id; if(JUNKI[id]&&JUNK.includes(JUNKI[id])) continue; ODD_NAMES.add(name.toLowerCase()); const e={};
  const m=/^c([\d.]+)$/.exec(eff); if(m) e.c=+m[1]; else if(/^b/.test(eff)){ const [k,v,mn]=eff.slice(1).split(':'); e.buff=[k,+v,+mn]; } else if(/^s\d/.test(eff)) e.scales=+eff.slice(1);
  else if(/^l/.test(eff)){ const [k,n]=eff.slice(1).split(':'); e.lure=[k,+n]; } else if(eff==='h') e.hat='random'; else if(eff==='pc') e.petcol=1; else if(eff==='nb') e.nib=1; else if(eff==='song') e.song=1;
  if(!e.c&&!e.buff) e.c=[.4,1.5,5,14][+t]; /* everything also pays a little */
  const j={id,name,t:+t,e,q,art,cols:cols.split(','),loc:cond&&cond!=='night'?cond:null,night:cond==='night'};
  JUNK.push(j); JUNKI[id]=j; }
// where and when an oddity can turn up
function oddW(j,n){ return (j.loc&&j.loc!==S.loc)||(j.night&&!n)?0:JUNK_W[j.t]*(j.loc?3:1); } /* one rule for rolling and for the odds shown */
{ const _pj=pickJunk; pickJunk=function(){ const n=isNight(), ws=JUNK.map(j=>oddW(j,n)); let x=Math.random()*ws.reduce((a,b)=>a+b,0); for(let i=0;i<JUNK.length;i++){ x-=ws[i]; if(x<=0&&ws[i]>0) return JUNK[i]; } return _pj(); }; }
function oddOdds(J){ const n=isNight(), tot=JUNK.reduce((a,j)=>a+oddW(j,n),0)||1; return oddW(J,n)/tot; }
// gold: your best water's catch value, a little less in earlier waters, and more for every repeat find
function oddBase(L,J){ const bl=bestLoot(), f=Math.max(.6,Math.pow(Math.max(1,L.loot)/Math.max(1,bl),.1)), n=(S.junk&&S.junk[J.id])||0; return bl*f*(1+.1*Math.min(20,n))*pathMul('oddgold'); }
// new effects (pet colours, Nibbles, the singing bass) on top of landJunk
{ const _lj=landJunk; landJunk=function(){ const J=G.fish&&G.fish.item; const r=_lj.apply(this,arguments); try{ if(J&&J.e){
    if(J.e.petcol&&typeof petColourPrize==='function'){ const t=petColourPrize(); if(t) setTimeout(()=>toast(t),500); }
    if(J.e.nib){ const ids=Object.keys(S.journal||{}).filter(id=>SPI[id]); if(ids.length){ const id=pick(ids); nibAdd(id,3); setTimeout(()=>toast('+3 '+nibRarName(id)+' Nibbles'+'!'),500); } }
    if(J.e.song){ const songs=['🎵 Take me to the river… 🎵','🎵 Don’t worry, be happy… 🎵','🎵 Under the sea, under the sea… 🎵','🎵 Row, row, row your boat… 🎵']; setTimeout(()=>toast('The Singing Bass Mount turns its head: '+pick(songs)),400); try{ for(let i=0;i<4;i++) setTimeout(()=>tone(520+i*90,.12,'triangle',.05),i*180); }catch(e){} }
  } }catch(e){} return r; }; }
// the pictures: 26 templates, each in the oddity's own colours (and as one flat colour for its shadow on the hook)
const ODD_ART={
  duck(R,E,P,Ci,c,a,b){ E(0,8,40,24,a); Ci(26,-18,18,a); P([40,-20,62,-14,40,-10],b); Ci(30,-22,3,'#1a1a1a'); },
  spinner(R,E,P,Ci,c,a,b){ for(let i=0;i<3;i++){ const an=i*Math.PI*2/3; Ci(Math.cos(an)*30,Math.sin(an)*30,18,a); } Ci(0,0,14,b); },
  sock(R,E,P,Ci,c,a,b){ P([-14,-50,14,-50,14,10,40,22,40,40,-14,40],a); R(-14,-50,28,10,b); },
  remote(R,E,P,Ci,c,a,b){ R(-16,-50,32,100,a); Ci(0,-34,6,b); for(let i=0;i<4;i++) for(let k=0;k<2;k++) R(-10+k*12,-14+i*14,8,8,'#9a9aa8'); },
  spork(R,E,P,Ci,c,a,b){ E(0,-30,16,22,a); R(-4,-10,8,60,a); for(let k=-1;k<=1;k++) R(k*8-2,-52,4,14,b); },
  teeth(R,E,P,Ci,c,a,b){ E(0,0,48,26,b); for(let i=0;i<8;i++){ R(-40+i*10,-14,9,12,a); R(-40+i*10,2,9,12,a); } },
  cone(R,E,P,Ci,c,a,b){ P([0,-56,30,40,-30,40],a); P([-16,-12,16,-12,22,6,-22,6],b); R(-40,40,80,10,a); },
  box(R,E,P,Ci,c,a,b){ R(-46,-32,92,64,a); R(-46,-32,92,12,b); R(-6,-32,12,64,b); },
  disc(R,E,P,Ci,c,a,b){ Ci(0,0,46,a); Ci(0,0,16,b); Ci(0,0,6,'#1a1a1a'); },
  gadget(R,E,P,Ci,c,a,b){ R(-34,-50,68,100,a); R(-24,-40,48,40,b); Ci(-14,22,8,'#3a3a40'); Ci(14,22,8,'#3a3a40'); },
  umbrella(R,E,P,Ci,c,a,b){ P([-50,0,0,-40,50,0,30,-6,0,4,-30,-6],a); R(-2,0,4,52,b); },
  shoe(R,E,P,Ci,c,a,b){ P([-46,10,-40,-24,-8,-24,0,-4,40,4,46,24,-46,24],a); R(-46,18,92,8,b); },
  cup(R,E,P,Ci,c,a,b){ P([-30,-40,30,-40,24,40,-24,40],a); c.lineWidth=8; c.strokeStyle=c.fillStyle; c.beginPath(); c.arc(32,0,16,-1.2,1.2); c.stroke(); R(-30,-20,60,10,b); },
  plunger(R,E,P,Ci,c,a,b){ R(-4,-56,8,70,b); E(0,22,32,20,a); },
  lamp(R,E,P,Ci,c,a,b){ P([-18,-50,18,-50,26,30,-26,30],a); R(-28,30,56,14,b); R(-14,-56,28,8,b); Ci(0,-10,8,'#ffffff'); },
  stick(R,E,P,Ci,c,a,b){ c.save(); c.rotate(-.5); R(-6,-56,12,112,a); R(-6,-56,12,20,b); c.restore(); },
  ball(R,E,P,Ci,c,a,b){ Ci(0,0,40,a); E(-12,-12,12,8,b); },
  glasses(R,E,P,Ci,c,a,b){ E(-22,0,20,16,b); E(22,0,20,16,b); R(-2,-4,4,6,a); R(-46,-4,10,4,a); R(36,-4,10,4,a); },
  globe(R,E,P,Ci,c,a,b){ Ci(0,-8,40,a); R(-30,28,60,16,'#6a4a2a'); E(-12,-20,12,8,b); },
  can(R,E,P,Ci,c,a,b){ R(-26,-44,52,88,a); E(0,-44,26,8,b); R(-26,-10,52,22,b); },
  fan(R,E,P,Ci,c,a,b){ c.beginPath(); c.moveTo(0,30); c.arc(0,30,60,Math.PI*1.15,Math.PI*1.85); c.closePath(); c.fillStyle=c.fillStyle; P([0,30,-50,-4,0,-30,50,-4],a); Ci(0,30,6,b); },
  key(R,E,P,Ci,c,a,b){ Ci(-30,0,18,a); Ci(-30,0,7,b); R(-14,-5,60,10,a); R(30,0,6,14,a); R(40,0,6,10,a); },
  banana(R,E,P,Ci,c,a,b){ c.lineWidth=22; c.lineCap='round'; c.strokeStyle=c.fillStyle=a; c.beginPath(); c.arc(0,-40,56,.6,2.5); c.stroke(); Ci(-41,-2,5,b); },
  cube(R,E,P,Ci,c,a,b){ R(-36,-36,72,72,a); for(let i=0;i<3;i++) for(let k=0;k<3;k++) if((i+k)%2) R(-34+i*24,-34+k*24,20,20,b); },
  spring(R,E,P,Ci,c,a,b){ for(let i=0;i<7;i++) E(-36+i*12,0,10,30,i%2?a:b); },
  scroll(R,E,P,Ci,c,a,b){ R(-40,-30,80,60,a); E(-40,0,8,30,b); E(40,0,8,30,b); for(let i=0;i<4;i++) R(-28,-18+i*10,56,3,b); },
  stapler(R,E,P,Ci,c,a,b){ P([-46,10,40,-14,46,-6,-40,18],a); R(-46,18,92,10,b); },
  fishmount(R,E,P,Ci,c,a,b){ R(-50,-36,100,72,b); E(0,0,38,16,a); P([-36,0,-52,-14,-52,14],a); Ci(22,-4,3,'#ffffff'); E(36,4,8,5,'#e8a0a0'); },
  phone(R,E,P,Ci,c,a,b){ R(-18,-52,36,104,a); R(-12,-40,24,30,b); for(let i=0;i<3;i++) for(let k=0;k<3;k++) R(-12+k*9,0+i*12,6,8,'#9aa0a0'); R(10,-62,4,12,a); },
  statue(R,E,P,Ci,c,a,b){ Ci(0,-30,16,a); P([-22,-14,22,-14,28,36,-28,36],a); R(-34,36,68,12,b); },
  trophy(R,E,P,Ci,c,a,b){ P([-30,-44,30,-44,18,0,-18,0],a); R(-5,0,10,24,a); R(-22,24,44,12,b); },
  hourglass(R,E,P,Ci,c,a,b){ R(-30,-50,60,8,b); R(-30,42,60,8,b); P([-24,-42,24,-42,4,0,24,42,-24,42,-4,0],a); },
  guitar(R,E,P,Ci,c,a,b){ Ci(-14,14,26,a); Ci(4,-6,18,a); R(10,-58,8,52,b); Ci(-12,14,6,'#1a1a1a'); },
  bar(R,E,P,Ci,c,a,b){ P([-44,20,-32,-20,32,-20,44,20],a); R(-24,-12,48,6,b); },
  crown(R,E,P,Ci,c,a,b){ P([-44,24,-44,-20,-22,0,0,-30,22,0,44,-20,44,24],a); Ci(0,-6,6,b); Ci(-26,10,5,b); Ci(26,10,5,b); },
  mask(R,E,P,Ci,c,a,b){ E(0,0,40,48,a); E(-15,-8,9,6,'#1a1a1a'); E(15,-8,9,6,'#1a1a1a'); R(-14,18,28,5,b); },
  antler(R,E,P,Ci,c,a,b){ c.lineWidth=10; c.strokeStyle=a; c.beginPath(); c.moveTo(-30,40); c.lineTo(0,-10); c.lineTo(30,-50); c.moveTo(0,-10); c.lineTo(-30,-40); c.moveTo(14,-30); c.lineTo(40,-24); c.stroke(); Ci(-30,40,8,b); },
  flamingo(R,E,P,Ci,c,a,b){ E(0,0,28,16,a); c.lineWidth=6; c.strokeStyle=a; c.beginPath(); c.moveTo(18,-4); c.quadraticCurveTo(40,-40,24,-50); c.stroke(); Ci(24,-50,8,a); R(-4,14,3,36,b); },
  trident(R,E,P,Ci,c,a,b){ R(-3,-30,6,86,a); for(let k=-1;k<=1;k++) P([k*16-4,-30,k*16+4,-30,k*16,-58],b); R(-20,-32,40,6,b); },
  egg(R,E,P,Ci,c,a,b){ E(0,0,32,42,a); E(-10,-14,8,12,b); },
  ring(R,E,P,Ci,c,a,b){ c.lineWidth=12; c.strokeStyle=a; c.beginPath(); c.arc(0,0,36,0,7); c.stroke(); for(let i=0;i<8;i++) Ci(Math.cos(i*.8)*36,Math.sin(i*.8)*36,5,b); },
  vase(R,E,P,Ci,c,a,b){ E(0,10,30,34,a); R(-12,-44,24,24,a); R(-18,-48,36,6,b); R(-30,8,60,6,b); },
  bottle(R,E,P,Ci,c,a,b){ R(-18,-20,36,64,a); R(-8,-48,16,30,a); R(-10,-54,20,8,b); R(-12,0,24,20,b); },
  plush(R,E,P,Ci,c,a,b){ E(0,10,34,30,a); Ci(0,-28,24,a); Ci(-18,-46,9,a); Ci(18,-46,9,a); Ci(-8,-30,3,'#1a1a1a'); Ci(8,-30,3,'#1a1a1a'); E(0,14,16,14,b); },
  ufo(R,E,P,Ci,c,a,b){ E(0,0,52,14,a); E(0,-10,22,16,b); for(let i=0;i<5;i++) Ci(-36+i*18,6,3,'#ffff8a'); },
  dino(R,E,P,Ci,c,a,b){ E(-4,8,34,20,a); E(30,-22,14,10,a); R(18,-16,10,20,a); P([-30,8,-56,24,-30,22],a); R(-20,24,8,16,a); R(8,24,8,16,a); Ci(34,-24,2.5,'#1a1a1a'); },
  sword(R,E,P,Ci,c,a,b){ P([-4,-60,4,-60,4,26,0,34,-4,26],a); R(-20,26,40,6,b); R(-4,32,8,22,'#6a4a2a'); },
  helmet(R,E,P,Ci,c,a,b){ c.beginPath(); c.arc(0,10,40,Math.PI,0); c.fillStyle=a; c.fill(); R(-48,8,96,10,a); P([-8,-30,0,-60,8,-30],b); },
  hammer(R,E,P,Ci,c,a,b){ R(-30,-46,60,34,a); R(-6,-12,12,62,b); },
  feather(R,E,P,Ci,c,a,b){ E(0,0,16,50,a,.4); E(4,-6,8,36,b,.4); c.lineWidth=2; c.strokeStyle='#ffffff'; c.beginPath(); c.moveTo(-14,40); c.lineTo(14,-40); c.stroke(); },
  tooth(R,E,P,Ci,c,a,b){ P([-16,-46,16,-46,8,40,0,52,-8,40],a); R(-16,-46,32,10,b); },
  horn(R,E,P,Ci,c,a,b){ P([-14,46,14,46,0,-58],a); for(let i=0;i<5;i++) R(-12+i*2,30-i*18,24-i*4,3,b); },
  wheel(R,E,P,Ci,c,a,b){ c.lineWidth=8; c.strokeStyle=a; c.beginPath(); c.arc(0,0,34,0,7); c.stroke(); for(let i=0;i<8;i++){ const an=i*Math.PI/4; c.beginPath(); c.moveTo(0,0); c.lineTo(Math.cos(an)*50,Math.sin(an)*50); c.stroke(); } Ci(0,0,10,b); },
  coin(R,E,P,Ci,c,a,b){ Ci(0,0,40,a); Ci(0,0,30,b); Ci(0,0,24,a); },
  gem(R,E,P,Ci,c,a,b){ P([-30,-14,-14,-34,14,-34,30,-14,0,40],a); P([-14,-14,14,-14,0,30],b); },
  rocket(R,E,P,Ci,c,a,b){ E(0,0,18,46,a); P([-18,20,-34,44,-14,36],b); P([18,20,34,44,14,36],b); Ci(0,-12,7,'#3a8ae8'); },
  chest(R,E,P,Ci,c,a,b){ R(-46,-10,92,46,a); c.beginPath(); c.ellipse(0,-10,46,24,0,Math.PI,0); c.fillStyle=a; c.fill(); R(-46,-12,92,8,b); R(-8,-12,16,20,b); },
  horseshoe(R,E,P,Ci,c,a,b){ c.lineWidth=16; c.strokeStyle=a; c.beginPath(); c.arc(0,4,34,Math.PI*.15,Math.PI*.85,true); c.stroke(); for(let i=0;i<6;i++){ const an=Math.PI*(1.1+i*.16); Ci(Math.cos(an)*34,4+Math.sin(an)*34,3,b); } },
  bean(R,E,P,Ci,c,a,b){ E(0,6,28,40,a); E(10,-14,18,10,b); R(-36,-4,12,28,a); },
  bread(R,E,P,Ci,c,a,b){ E(0,0,52,22,a); for(let i=0;i<4;i++) E(-30+i*20,-10,6,3,b,.5); },
  board(R,E,P,Ci,c,a,b){ E(0,0,58,14,a); R(-40,-2,80,4,b); },
  paddle(R,E,P,Ci,c,a,b){ R(-3,-58,6,70,a); E(0,30,16,30,b); },
  anchor(R,E,P,Ci,c,a,b){ R(-4,-40,8,76,a); R(-20,-30,40,6,a); Ci(0,-46,8,b); c.lineWidth=8; c.strokeStyle=a; c.beginPath(); c.arc(0,10,30,.2,Math.PI-.2); c.stroke(); },
  clock(R,E,P,Ci,c,a,b){ Ci(0,0,40,a); Ci(0,0,32,b); c.lineWidth=4; c.strokeStyle='#2a2a2a'; c.beginPath(); c.moveTo(0,0); c.lineTo(0,-22); c.moveTo(0,0); c.lineTo(14,6); c.stroke(); },
};
{ const _dj=drawJunkAt; drawJunkAt=function(c,id,x,y,s,sil){ const J=JUNKI[id]; const fn=J&&J.art&&ODD_ART[J.art]; if(!fn) return _dj.apply(this,arguments);
    c.save(); c.translate(x,y); c.scale(s,s); c.lineJoin='round'; c.lineCap='round'; const F=col=>sil||col, a=F(J.cols[0]), b=F(J.cols[1]||J.cols[0]);
    const R=(x,y,w,h,col)=>{ c.fillStyle=F(col); c.fillRect(x,y,w,h); }, Ci=(x,y,r,col)=>{ c.fillStyle=F(col); c.beginPath(); c.arc(x,y,r,0,7); c.fill(); }, E=(x,y,rx,ry,col,rot=0)=>{ c.fillStyle=F(col); c.beginPath(); c.ellipse(x,y,rx,ry,rot,0,7); c.fill(); }, P=(pts,col)=>{ c.fillStyle=F(col); c.beginPath(); c.moveTo(pts[0],pts[1]); for(let i=2;i<pts.length;i+=2) c.lineTo(pts[i],pts[i+1]); c.closePath(); c.fill(); };
    c.fillStyle=a; try{ fn(R,E,P,Ci,c,a,b); if(!sil) oddDecor(c,J,a,b,R,E,Ci); }catch(e){} if(!sil){ c.globalAlpha=.18; c.fillStyle='#ffffff'; c.beginPath(); c.ellipse(-14,-20,16,7,-.5,0,7); c.fill(); } c.restore(); }; }
// what the Oddities page shows once you have found one: rarity, odds, where and when, what it gives
function oddKV(id){ const J=JUNKI[id]; if(!J) return ''; const L=J.loc&&LOCS[locIdx(J.loc)], o=oddOdds(J), jc=junkChance();
  return `<div><span>Rarity</span> ${ODD_TIER_NAMES[J.t]}</div><div><span>Turns up</span> ${L?'only at '+esc(L.name):'at every water'}${J.night?', only at night':''}</div>`+
    `<div><span>Chance</span> ${o?fmtOdds(o)+' of oddities here ('+fmtOdds(o*jc)+' a cast)':'not here'+(J.night&&!isNight()?' (wait for night)':'')}</div>`+(J.e.c?`<div><span>Coins now</span> about ${fmt(Math.round(oddBase(curLoc(),J)*J.e.c))}</div>`:''); }
document.head.insertAdjacentHTML('beforeend','<style>#panel .jcard[data-odd]{cursor:pointer!important}#panel .odd-kv{grid-column:1/-1;margin:-2px 0 6px;padding:8px 10px;border-radius:12px;border:1px solid var(--line,#26385180);background:#0e1828;font-size:12.5px}#panel .odd-kv>div{display:flex;justify-content:space-between;gap:8px}#panel .odd-kv span{opacity:.7}</style>');
// compact Oddities cards (phones, narrow PC): tap a found one to see its rarity, odds and where it turns up
document.addEventListener('click',e=>{ const card=e.target.closest&&e.target.closest('#panel .jcard[data-odd]'); if(!card) return; const P=card.parentElement, id=card.dataset.odd, open=P.querySelector('.odd-kv');
  if(open){ const same=open.dataset.for===id; open.remove(); if(same) return; } card.insertAdjacentHTML('afterend',`<div class="odd-kv" data-for="${id}"><div><b>${esc(JUNKI[id].name)}</b></div>${oddKV(id)}</div>`); });
// so oddities that share a template never look alike: each also gets its own small detail, chosen from its id
function oddDecor(c,J,a,b,R,E,Ci){ let h=0; for(let i=0;i<J.id.length;i++) h=(h*31+J.id.charCodeAt(i))>>>0; const v=h%7, dk=mix(a,'#000000',.4), lt=mix(a,'#ffffff',.55);
  c.save(); c.globalAlpha=.9;
  if(v===1){ R(-40,-4,80,8,lt); } /* a stripe band */
  else if(v===2){ for(let i=0;i<6;i++) Ci(-24+(i%3)*24,-14+Math.floor(i/3)*24,4,lt); } /* polka dots */
  else if(v===3){ c.fillStyle='#ffd36a'; c.beginPath(); for(let i=0;i<10;i++){ const r=i%2?4:10, an=-Math.PI/2+i*Math.PI/5; c.lineTo(24+Math.cos(an)*r,-24+Math.sin(an)*r); } c.closePath(); c.fill(); } /* a gold star badge */
  else if(v===4){ R(-22,6,44,16,'#f4f0e4'); R(-16,10,32,2.5,dk); R(-16,15,22,2.5,dk); } /* a label */
  else if(v===5){ for(let i=0;i<4;i++) Ci(-30+i*20,26,3,dk); } /* rivets */
  else if(v===6){ c.globalAlpha=.8; c.fillStyle='#ffffff'; for(const [x,y,s] of [[26,-30,5],[-30,-22,3.5],[32,10,3]]){ c.beginPath(); c.moveTo(x,y-s); c.lineTo(x+s*.3,y-s*.3); c.lineTo(x+s,y); c.lineTo(x+s*.3,y+s*.3); c.lineTo(x,y+s); c.lineTo(x-s*.3,y+s*.3); c.lineTo(x-s,y); c.lineTo(x-s*.3,y-s*.3); c.closePath(); c.fill(); } } /* glints */
  c.restore(); }
