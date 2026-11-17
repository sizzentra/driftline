// =====================================================================
// 0.3.6: the details that make each new fish recognisable (body plan, snout, eyes, glow, patterns),
// so none of them reads as a plain plank or a copy of its neighbour.
// =====================================================================
Object.assign(FISH3_OVR,{
 // shrimp are shrimp, not crabs
 iceshrimp:{plan:'shrimp', clear:1}, trenchshrimp:{plan:'shrimp'}, ventshrimp:{plan:'shrimp', flame:1}, starshrimp:{plan:'shrimp', stars:1},
 // gars, pipefish and needle noses: long bodies with a proper snout
 spottedgar:{plan:'long', snout:'snipe', teeth:1, pat:'spots', tail:'round'}, ghostgar:{plan:'long', snout:'snipe', ghost:1, tail:'round'},
 garfishcoast:{plan:'long', snout:'snipe', thin:1, pat:'hstripe'}, pipefish:{plan:'eel', thin:1, snout:'snipe', pat:'chain'}, zodiacgar:{plan:'long', snout:'snipe', stars:1, pat:'dots'},
 saury:{plan:'long', snout:'snipe', thin:1, pat:'hstripe'}, starlance:{plan:'long', snout:'snipe', glow:1, starTip:1},
 // salamander-ish and worms
 mudpuppy:{plan:'long', barbel:'short', tail:'round', pat:'blotch'}, abyssworm:{plan:'worm'}, seasnail:{plan:'blenny', clear:1},
 // eels with character
 ribboneel:{plan:'eel', thin:1, mouth:'open', frills:1}, viperling:{plan:'eel', mouth:'open', teeth:1, glow:1}, stoplight:{plan:'eel', glow:1, eye:'glow'},
 snipe:{plan:'eel', thin:1, snout:'snipe'}, gulperling:{plan:'gulper'}, ribbonfish:{plan:'eel', thin:1, crest:1}, obsidianeel:{plan:'eel', glass:1},
 galaxyeel:{plan:'eel', stars:1, glow:1}, glasswyrm:{plan:'eel', glass:1, crest:1}, celestialdragon:{plan:'eel', crest:1, stars:1, big:1}, blackdragon:{plan:'eel', mouth:'open', glow:1},
 magmaloach:{plan:'eel', barbel:'short', flame:1}, polarwolf:{plan:'eel', mouth:'open', teeth:1}, frostburbot:{plan:'long', barbel:'chin', tail:'round', pat:'marble'},
 brookdragon:{plan:'long', snout:'duck', teeth:1, crest:1, pat:'spots'}, willowpike:{plan:'long', snout:'duck', teeth:1, pat:'chain'}, tuskpike:{plan:'long', snout:'duck', teeth:1},
 lunarpike:{plan:'long', snout:'duck', craters:1}, magmapike:{plan:'long', snout:'duck', teeth:1, flame:1}, lakesturgeon:{plan:'long', snout:'snipe', barbel:'short', thorns:1},
 // eyes, glass and glow
 goldeye:{eye:'big'}, mooneye:{eye:'big', tail:'lunate'}, glasshead:{clear:1, eye:'big'}, spookfish:{eye:'big', ghost:1}, ambereye:{eye:'glow'}, whitecharmer:{clear:1},
 northernlight:{aurora:1, glow:1}, deeplantern:{glow:1, pat:'dots'}, lowbattery:{glow:1, eye:'glow'}, quasarling:{glow:1}, voidtetra:{stars:1},
 // shapes from the name
 narwhalfish:{snout:'snipe'}, lookdown:{plan:'deep'}, moorishidol:{plan:'deep', dorsal:'long'}, regalangel:{plan:'deep'}, nebulaangel:{plan:'deep', stars:1}, sulfurangel:{plan:'deep'},
 dorado:{tail:'lunate', plan:'tuna'}, bluefintuna:{plan:'tuna'}, bluerunner:{plan:'tuna', tail:'lunate'}, rainbowrunner:{plan:'tuna', pat:'hstripes'}, horsemackerel:{plan:'tuna', pat:'tiger'},
 spearmarlin:{plan:'shark', snout:'snipe'}, tarpon:{plan:'tuna', pat:'scales'}, bumphead:{plan:'grouper'}, deepcod:{barbel:'chin', dorsal:'triple'}, lighthousegrouper:{plan:'grouper', glow:1},
 blenny:{plan:'blenny'}, goby:{plan:'blenny'}, neongoby:{plan:'blenny', pat:'neon'}, firegoby:{plan:'blenny'}, sootgoby:{plan:'blenny'}, nebulagoby:{plan:'blenny', stars:1}, brittlefish:{plan:'blenny', clear:1},
 cometcarp:{plan:'carp', comet:1}, calderacarp:{plan:'carp', flame:1}, pondking:{plan:'carp', big:1, crown:1}, celestialkoi:{plan:'koi', stars:1}, moltenkoi:{plan:'koi', flame:1},
 ashphoenix:{flame:1, frills:1}, blazefin:{flame:1}, supernova:{glow:1, flame:1}, blackholebass:{stars:1}, cosmicwhale:{plan:'shark', stars:1, slow:1}, dawnbringer:{plan:'shark', glow:1, frills:1},
 infernoshark:{plan:'shark', flame:1}, calderaqueen:{plan:'shark', big:1, flame:1, crown:1}, blizzardking:{plan:'shark', big:1, crystal:1}, shelfwarden:{plan:'shark', big:1}, deepcrown:{plan:'shark', crown:1, glow:1},
 trenchtitan:{plan:'shark', big:1, slow:1, ghost:1}, ghostshark:{plan:'shark', ghost:1}, abyssheart:{plan:'grouper', glow:1, eye:'glow'}, reeforacle:{plan:'deep', glow:1, frills:1},
 ashray:{plan:'ray', pat:'dots'}, solarray:{plan:'manta', glow:1}, eclipseray:{plan:'manta', rings:1}, angelshark:{plan:'ray', pat:'dots'},
 // meme fish that look like their joke
 chillguy:{shades:1}, bruh:{grump:1}, minecraftfish:{plan:'ball', pat:'vbars'}, gigachad:{plan:'grouper', big:1}, brainfreeze:{plan:'ball', crystal:1}, ohno:{plan:'ball', eye:'big'},
 tobyfish:{helmet:1}, ufo:{plan:'manta', rings:1, glow:1}, rizzler:{plan:'fusi', glow:1}, sheesh:{plan:'shark', mouth:'open'}, cringefish:{grump:1}, bussin:{flame:1},
 backrooms:{plan:'fusi', glow:1}, bottomtext:{plan:'grouper'}, spicy:{flame:1}, lavachicken:{plan:'ball', flame:1}, delulu:{plan:'tuna', stars:1}, nemoactually:{plan:'fusi', pat:'vbars'}, ratiofish:{grump:1},
});
