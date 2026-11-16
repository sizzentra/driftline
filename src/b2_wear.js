
// =====================================================================
// 0.3 wardrobe data: body types, eye colours, shoes, neckwear and back pieces.
// Lives before c_logic so a save can be checked against it on load.
// [id, name, price, source] source: 'start' (owned from the beginning), 'shop' (clothing shop), 'bw' (boardwalk only)
// =====================================================================
const BUILDS = [['average','Average',{w:1,l:1,lw:1,belly:0}],['slim','Slim',{w:.86,l:1.03,lw:.86,belly:0}],['athletic','Athletic',{w:1.12,l:1,lw:1.1,belly:0}],
  ['broad','Broad',{w:1.24,l:1,lw:1.2,belly:0}],['sturdy','Sturdy',{w:1.16,l:.94,lw:1.14,belly:1}],['tall','Tall',{w:.96,l:1.13,lw:.96,belly:0}],['petite','Petite',{w:.9,l:.88,lw:.9,belly:0}]];
const BUILDI = Object.fromEntries(BUILDS.map(b=>[b[0],b[2]]));
const EYES = [['#3a2416','Brown'],['#6b4a22','Hazel'],['#2f6fb0','Blue'],['#3f8f5c','Green'],['#7f8f9c','Grey'],['#c8962a','Amber'],['#8a5ad0','Violet'],['#c83a4a','Ruby'],['#30b8c8','Sea glass']];
const SHOES = [['boots','Work boots',0,'start'],['sneakers','Sneakers',0,'start'],['sandals','Sandals',400,'shop'],['flipflops','Flip-flops',300,'shop'],['wellies','Rain wellies',900,'shop'],
  ['hiking','Hiking boots',1200,'shop'],['cowboyb','Cowboy boots',2200,'shop'],['loafers','Loafers',1400,'shop'],['hightops','High-tops',1600,'shop'],['clogs','Garden clogs',700,'shop'],
  ['slippers','Bunny slippers',1100,'shop'],['flippers','Swim flippers',1800,'shop'],['moonboots','Moon boots',2600,'shop'],['snowboots','Snow boots',1500,'shop'],['combat','Combat boots',2000,'shop'],
  ['brogues','Brogues',1700,'shop'],['rollers','Roller skates',3200,'shop'],['geta','Wooden geta',1300,'shop'],['heeled','Heeled boots',2400,'shop'],['glowkicks','Glow kicks',4800,'shop'],
  ['barefoot','Barefoot',0,'start'],['socksand','Socks and sandals',600,'bw'],['pirateb','Pirate boots',3600,'shop'],['astrob','Astro boots',5200,'shop'],['ducky','Duck feet',2900,'bw'],
  ['fishfeet','Fish shoes',6700,'bw'],['clownshoes','Clown shoes',3300,'bw'],['tidetreads','Tide Treads',0,'pass']];
const NECKS = [['none','Nothing',0,'start'],['scarf','Wool scarf',600,'shop'],['stripescarf','Striped scarf',900,'shop'],['longscarf','Long knit scarf',1600,'shop'],['bandana','Neck bandana',500,'shop'],
  ['bowtie','Bow tie',800,'shop'],['tie','Necktie',700,'shop'],['lei','Flower lei',1200,'shop'],['shells','Shell necklace',1000,'shop'],['medal','Gold medal',2500,'shop'],['pearls','Pearl necklace',3000,'shop'],
  ['whistle','Lifeguard whistle',650,'shop'],['ascot','Ascot',1800,'shop'],['cowl','Cozy cowl',1400,'shop'],['boa','Feather boa',2700,'bw'],['goldchain','Big gold chain',6700,'bw'],['fishneck','Fish on a string',4200,'bw'],['tidescarf','Tide Scarf',0,'pass']];
const BACKS = [['none','Nothing',0,'start'],['backpack','Backpack',1500,'shop'],['tacklepack','Tackle backpack',2600,'shop'],['creel','Fishing creel',1800,'shop'],['netback','Landing net',1200,'shop'],
  ['cape','Hero cape',3000,'shop'],['royalcape','Royal cape',7500,'shop'],['tatteredcape','Tattered cloak',2400,'shop'],['starcape','Starry cape',9000,'shop'],['scuba','Scuba tank',4400,'shop'],
  ['jetpack','Jetpack',12000,'shop'],['angelwings','Angel wings',8000,'shop'],['butterfly','Butterfly wings',5600,'shop'],['batwings','Bat wings',5200,'shop'],['dragonwings','Dragon wings',14000,'shop'],
  ['sharkfin','Shark fin',3800,'bw'],['turtleshell','Turtle shell',4600,'bw'],['rodquiver','Rod quiver',2200,'shop'],['lanternpole','Lantern pole',3400,'shop'],['guitar','Guitar',4000,'shop'],
  ['plushpack','Plush fish backpack',3100,'bw'],['flagpole','Banner flag',2800,'bw'],['tidecape','Tide Cape',0,'pass'],['shellpack','Seashell Pack',0,'pass'],['tidewings','Tide Wings',0,'pass']];
const SHOEI=Object.fromEntries(SHOES.map(x=>[x[0],x])), NECKI=Object.fromEntries(NECKS.map(x=>[x[0],x])), BACKI=Object.fromEntries(BACKS.map(x=>[x[0],x]));
