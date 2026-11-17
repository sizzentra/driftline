// =====================================================================
// 0.3 FISH: one renderer, a design per species.
// Every species gets a design (body plan, tail, fins, pattern, features) from its own data and name, with
// hand-made designs for the signature fish. A fish faces right, centred at (0,0), nose at +L/2.
// =====================================================================
const FISH3_OVR = {
  // signature designs (anything not set falls back to the rules in fishDesign)
  seahorse:{plan:'horse'}, leafydragon:{plan:'horse', frills:1}, molamola:{plan:'mola'}, anglerfish:{plan:'angler'}, seadevil:{plan:'angler'},
  blobfish:{plan:'blob'}, seapig:{plan:'seapig'}, axolotl:{plan:'axolotl'}, tadpole:{plan:'tadpole'}, boxfish:{plan:'box'}, coralking:{plan:'box', spikes:1},
  puffer:{plan:'ball', spikes:1}, pumicepuffer:{plan:'ball', spikes:1, pat:'dots'}, goofyahh:{plan:'ball', big:1}, pebblefish:{plan:'ball', pat:'marble'}, cloudfish:{plan:'ball', soft:1}, marshmallowfish:{plan:'ball', soft:1, toast:1},
  winterheart:{plan:'ball', crystal:1}, mountainheart:{plan:'ball', glowCore:1}, lionfish:{plan:'deep', dorsal:'lion', pat:'vbars', tail:'round'},
  riversculpin:{plan:'sculpin'}, sculpin:{plan:'sculpin'}, flounder:{plan:'flat'}, halibut:{plan:'flat'},
  johndory:{plan:'disc', pat:'spot1', dorsal:'spiny'}, opah:{plan:'disc', pat:'dots'}, moonfish:{plan:'disc'}, angelfish:{plan:'disc', dorsal:'trail', tail:'lunate'}, batfish:{plan:'disc', dorsal:'trail', tall:1},
  butterflyfish:{plan:'disc', pat:'eyespot'}, tripletail:{plan:'deep', dorsal:'round', tail:'round'},
  swordfish:{plan:'bill', bill:'sword', dorsal:'shark'}, broadbill:{plan:'bill', bill:'sword', dorsal:'shark'}, marlin:{plan:'bill', dorsal:'sail'}, blackmarlin:{plan:'bill', dorsal:'sail'}, tempest:{plan:'bill', dorsal:'sail'},
  sailfish:{plan:'bill', dorsal:'sail', sailBig:1}, sailfin:{plan:'bill', dorsal:'sail', sailBig:1, bill:'short'}, spearfish:{plan:'bill', bill:'short', dorsal:'sail'}, maincharacter:{plan:'bill', dorsal:'sail'},
  hammerhead:{plan:'shark', head:'hammer'}, thresher:{plan:'shark', tail:'thresher'}, goblinshark:{plan:'shark', head:'goblin'}, frilled:{plan:'eel', frills:1, teeth:1},
  whaleshark:{plan:'shark', pat:'dots', mouth:'wide'}, megamouth:{plan:'shark', mouth:'wide'}, greenland:{plan:'shark', slow:1}, sawfish:{plan:'shark', head:'saw'},
  paddlefish:{plan:'long', snout:'paddle'}, sturgeon:{plan:'long', snout:'sturgeon', scutes:1, tail:'shark'}, shovelnose:{plan:'long', snout:'sturgeon', scutes:1, tail:'shark'},
  oarfish:{plan:'eel', ribbon:1, crest:1}, kingoar:{plan:'eel', ribbon:1, crest:1}, cutlass:{plan:'eel', ribbon:1, teeth:1}, needlefish:{plan:'long', snout:'needle'}, garfish:{plan:'long', snout:'needle'},
  gar:{plan:'long', snout:'gar'}, alligatorgar:{plan:'long', snout:'gar', teeth:1}, barracuda:{plan:'long', teeth:1, pat:'vbars'},
  hatchetfish:{plan:'hatchet'}, viperfish:{plan:'long', teeth:'fang', glow:1}, dragonfish:{plan:'eel', barbel:'glow', teeth:'fang', glow:1}, fangtooth:{plan:'deep', teeth:'fang', big:1},
  gulper:{plan:'gulper'}, pelicaneel:{plan:'gulper'}, barreleye:{plan:'fusi', eye:'barrel', clear:1}, tripod:{plan:'fusi', tripod:1}, coelacanth:{plan:'fusi', tail:'coel', pat:'dots', lobed:1},
  chimera:{plan:'chimera'}, hagfish:{plan:'eel', barbel:'short'}, lantern:{plan:'fusi', glow:1, pat:'photo'}, lightfish:{plan:'fusi', glow:1, pat:'photo'}, bristlemouth:{plan:'fusi', teeth:1, glow:1},
  snailfish:{plan:'tadpole', clear:1}, cookiecutter:{plan:'shark', small:1, glow:1}, rattail:{plan:'rattail'}, cuskeel:{plan:'eel'}, eelpout:{plan:'eel'}, wolffish:{plan:'eel', teeth:'fang'},
  burbot:{plan:'eel', barbel:'short', pat:'marble'}, flyingfish:{plan:'fusi', wings:1}, remora:{plan:'long', sucker:1}, clownfish:{plan:'fusi', pat:'clown', tail:'round'}, sergeant:{plan:'deep', pat:'vbars'},
  mandarin:{plan:'fusi', pat:'mandarin', tail:'round'}, parrotfish:{plan:'deep', beak:1, pat:'scales'}, napoleon:{plan:'deep', hump:1, pat:'scales'}, hogfish:{plan:'deep', snout:'hog'}, goatfish:{plan:'fusi', barbel:'goat'},
  triggerfish:{plan:'disc', dorsal:'trigger'}, oceantrigger:{plan:'disc', dorsal:'trigger'}, tang:{plan:'disc'}, bluetang:{plan:'disc', pat:'tang'}, searobin:{plan:'fusi', wings:1, big:1}, gurnard:{plan:'fusi', wings:1, big:1},
  mahi:{plan:'mahi'}, bullmahi:{plan:'mahi'}, cobia:{plan:'long'}, wahoo:{plan:'long', pat:'vbars'}, kingfish:{plan:'long'}, tuna:{plan:'tuna'}, bigeye:{plan:'tuna', eye:'big'}, yellowfin:{plan:'tuna', finlets:'#f0d040'},
  albacore:{plan:'tuna', pectoral:'long'}, skipjack:{plan:'tuna', pat:'hstripes'}, bonito:{plan:'tuna', pat:'stripes'}, mackerel:{plan:'tuna', pat:'tiger'},
  catfish:{barbel:'cat'}, bullhead:{barbel:'cat'}, charcoalcat:{barbel:'cat'}, whiskers:{barbel:'cat'}, koi:{plan:'koi'}, ghostkoi:{plan:'koi'}, rainbowkoi:{plan:'koi'}, springkoi:{plan:'koi'}, phoenixkoi:{plan:'koi', flame:1},
  constellationkoi:{plan:'koi', stars:1}, goldfish:{plan:'goldfish'}, duchess:{plan:'goldfish'}, carp:{plan:'carp'}, mirrorcarp:{plan:'carp', pat:'mirror'}, yeticarp:{plan:'carp', fur:1}, ohiocarp:{plan:'carp'}, obsidiancarp:{plan:'carp', glass:1}, eclipsecarp:{plan:'carp', eclipse:1},
  arapaima:{plan:'long', pat:'scales', tail:'round'}, snakehead:{plan:'long', pat:'blotch', tail:'round'}, bowfin:{plan:'long', dorsal:'long', tail:'round', pat:'eyespot'}, pickerel:{plan:'long', pat:'chain'},
  grouper:{plan:'grouper'}, goliath:{plan:'grouper'}, absoluteunit:{plan:'grouper', big:1}, gloweyegrouper:{plan:'grouper', eye:'glow'}, wreckfish:{plan:'grouper'},
  stingray:{plan:'ray', tail:'whip'}, bluespot:{plan:'ray', tail:'whip', pat:'dots'}, eagleray:{plan:'ray', pat:'dots', wingy:1}, manta:{plan:'manta'}, skate:{plan:'ray', thorns:1}, seraph:{plan:'manta', glow:1},
  polarstar:{plan:'ray', pat:'star'}, rizzray:{plan:'ray'}, blazeray:{plan:'ray', flame:1}, orbitray:{plan:'manta', rings:1}, cinderskate:{plan:'ray', thorns:1, flame:1},
  dogfish:{plan:'shark', pat:'dots', small:1}, sixgill:{plan:'shark', slow:1}, kitefin:{plan:'shark', small:1, glow:1}, mako:{plan:'shark'}, tigershark:{plan:'shark', pat:'vbars'}, greatwhite:{plan:'shark', big:1},
  moray:{plan:'eel', mouth:'open', pat:'marble'}, conger:{plan:'eel'}, mudeel:{plan:'eel'}, sandeel:{plan:'eel', thin:1}, loach:{plan:'eel', barbel:'short', pat:'blotch'}, weatherloach:{plan:'eel', barbel:'short'},
  snipeeel:{plan:'eel', thin:1, snout:'snipe'}, wraitheel:{plan:'eel', ghost:1}, satelliteeel:{plan:'eel', stars:1}, lavaeel:{plan:'eel', flame:1}, auroraeel:{plan:'eel', aurora:1}, icicleeel:{plan:'eel', crystal:1}, bobbitworm:{plan:'worm'},
  seaserpent:{plan:'eel', crest:1, big:1}, frostwyrm:{plan:'eel', crest:1, crystal:1}, chillfish:{plan:'fusi', shades:1}, grumpyguppy:{plan:'guppy', grump:1}, twinkletetra:{plan:'fusi', pat:'neon'}, bubbleblenny:{plan:'blenny'},
  icegoby:{plan:'blenny'}, sulfurgoby:{plan:'blenny'}, cometgoby:{plan:'blenny', comet:1}, touchgrass:{plan:'blenny'}, stickleback:{plan:'fusi', dorsal:'spines3'}, ruffe:{plan:'fusi', dorsal:'spiny', pat:'dots'},
  icefish:{plan:'long', clear:1, snout:'duck'}, glasssquid:{clear:1}, astrofish:{helmet:1}, wishfish:{plan:'fusi', starTip:1}, firststar:{plan:'star'}, starweaver:{plan:'koi', stars:1},
  sigmashark:{plan:'shark'}, tralala:{plan:'shark'}, magmashark:{plan:'shark', flame:1}, pulsarshark:{plan:'shark', pulse:1}, moonleviathan:{plan:'shark', big:1, craters:1}, abyssemperor:{plan:'shark', big:1, crown:1}, volcanoking:{plan:'shark', big:1, flame:1, crown:1},
  stormbringer:{plan:'shark', storm:1}, leviathan:{plan:'shark', big:1, storm:1}, glacierking:{plan:'shark', big:1, crystal:1}, hollowking:{plan:'shark', big:1, ghost:1}, maw:{plan:'gulper', big:1}, reefdragon:{plan:'shark', frills:1}
};

function fish3Hash(s){ let h=2166136261; for(let i=0;i<s.length;i++){ h^=s.charCodeAt(i); h=Math.imul(h,16777619); } return h>>>0; }
const FISH3_CACHE={};
function fishDesign(sp){
  if(FISH3_CACHE[sp.id]) return FISH3_CACHE[sp.id];
  const n=(sp.id+' '+sp.name).toLowerCase(), has=(...w)=>w.some(k=>n.includes(k)), r=v3rng(fish3Hash(sp.id)), pick=a=>a[Math.floor(r()*a.length)];
  const d={plan:'fusi', tail:'fork', dorsal:'round', pat:'none', h:sp.h||.38};
  // body plan from the old shape letter, then from the name
  if(sp.shape==='e') d.plan='eel'; else if(sp.shape==='s') d.plan='shark'; else if(sp.shape==='r') d.plan='ray'; else if(sp.shape==='p') d.plan='ball';
  if(sp.shape==='f'){ if(d.h>.5) d.plan='deep'; else if(d.h<.28) d.plan='long'; }
  if(has('pike','muskie','muskellunge','zander','walleye','pickerel')){ d.plan='long'; d.snout='duck'; d.teeth=1; }
  if(has('trout','salmon','char','steelhead','taimen','grayling','cutthroat')){ d.plan='fusi'; d.adipose=1; d.pat=d.pat==='none'?'spots':d.pat; d.tail='square'; }
  if(has('perch','crappie','bluegill','sunfish','pumpkinseed','rockbass','sunperch','bream','porgy','snapper','seabass','bass')){ d.dorsal='spiny'; if(!has('seabass')&&sp.loc==='pond') d.plan='deep'; }
  if(has('bass')) d.mouth='big';
  if(has('carp','tench','barbel','koi','chub','roach','rudd','dace','redhorse','sucker','shiner','minnow','cisco','vendace','whitefish','muksun','nelma','herring','shad','sardine','smelt','fry','tetra')) d.pat=d.pat==='none'?(r()<.5?'scales':'none'):d.pat;
  if(has('barbel','tench')) d.barbel='short';
  if(has('cod','pollock','haddock','burbot')){ d.barbel=d.barbel||'chin'; d.dorsal='triple'; d.tail='square'; }
  if(has('wrasse','tang','damsel','chromis','cardinal','tetra','guppy')) d.tail=pick(['round','fork','lunate']);
  if(has('jack','trevally','amberjack','yellowtail','bluefish','bonito','scad','mullet','dorado','kingfish')){ d.tail='lunate'; }
  if(has('grouper','roughy','redfish','oilfish','escolar','blackcod','slickhead')){ d.plan=d.plan==='fusi'?'grouper':d.plan; d.eye=has('roughy','redfish','slickhead')?'big':d.eye; }
  if(has('jelly')) d.plan='jelly'; if(has('squid','octopus','kraken','dreamer','endless','telescope','dumbo','mimic')) d.plan=has('octopus','dumbo','mimic','telescope')?'octopus':'squid';
  if(has('crab','lobster','isopod','krill','shrimp','mantis')) d.plan=has('lobster')?'lobster':has('isopod')?'isopod':has('krill')?'krill':has('mantis')?'shrimp':'crab';
  // element touches from the area
  if(sp.loc==='ember'&&!has('jelly')) d.ember=1; if(sp.loc==='starfall') d.cosmic=1; if(sp.loc==='frost') d.frost=1; if(sp.loc==='trench'||sp.loc==='deep') d.deepsea=1;
  if(has('glow','lantern','light','firefly','aurora','neon','twinkle','star','comet','pulsar','galaxy','nebula')) d.glow=1;
  if(has('ghost','phantom','wraith','spirit','glass','crystal','clear')) d.ghost=1;
  // patterns from the old pattern flag
  if(d.pat==='none'||d.pat==='scales'){ if(sp.pat===1) d.pat=has('tiger')?'tiger':pick(['vbars','vbars','hstripe']); else if(sp.pat===2) d.pat=pick(['spots','dots','spots','marble']); }
  // a little individual variety
  d.fin=r(); d.dorsalX=(r()-.5)*.08; d.eyeK=.9+r()*.25; d.tailK=.9+r()*.25;
  if(r()<.25&&d.tail==='fork') d.tail='lunate';
  Object.assign(d,FISH3_OVR[sp.id]||{});
  if(sp.r>=4&&!d.crown&&!d.plan.match(/jelly|squid|octopus|crab|lobster|isopod|krill|shrimp/)) d.legend=1;
  return FISH3_CACHE[sp.id]=d;
}

// ---------- drawing helpers ----------
function f3Eye(c,x,y,r,o,d){ if(o.sil){ return; } const glow=d.eye==='glow'||(d.glow&&d.deepsea);
  if(glow){ v3glow(c,x,y,r*3.4,'rgba(200,255,220,.9)',.45); }
  c.fillStyle=glow?'#d8ffe0':'#f4f2ea'; c.beginPath(); c.arc(x,y,r,0,7); c.fill();
  c.fillStyle=d.cosmic?'#2a1050':'#0b1418'; c.beginPath(); c.arc(x+r*.18,y,r*.68,0,7); c.fill();
  c.fillStyle='#ffffff'; c.beginPath(); c.arc(x+r*.38,y-r*.3,Math.max(.6,r*.28),0,7); c.fill(); }
function f3Grad(c,top,bot,y0,y1){ const gr=c.createLinearGradient(0,y0,0,y1); gr.addColorStop(0,top); gr.addColorStop(1,bot); return gr; }

// the side outline of a typical fish body (nose at +L*.46, tail stalk at -L*.32)
function f3BodyPath(c,L,hh,d){ const nose=d.plan==='long'?L*.5:d.plan==='deep'||d.plan==='disc'?L*.44:L*.47, st=-L*.32, sh=hh*(d.plan==='long'?.42:.3), bel=hh*(d.plan==='grouper'?1.1:1.02), top=hh*(d.hump?1.25:1);
  const snoutH=d.plan==='long'?hh*.12:hh*.2;
  c.beginPath(); c.moveTo(nose,0);
  c.bezierCurveTo(nose-L*.02,-snoutH-hh*.25,L*(d.plan==='deep'?.2:.22),-top,L*.02,-top);
  c.bezierCurveTo(-L*.16,-top,-L*.26,-sh*1.4,st,-sh);
  c.lineTo(st,sh);
  c.bezierCurveTo(-L*.24,sh*1.5,-L*.14,bel,L*.04,bel);
  c.bezierCurveTo(L*.26,bel,nose-L*.02,snoutH+hh*.15,nose,0); c.closePath(); }

function f3Tail(c,L,hh,d,col,wag){ const st=-L*.31, tl=L*.2*(d.tailK||1), sp=hh*(d.plan==='long'?.9:1.1)*(d.tailK||1), sw=Math.sin(wag)*.22;
  c.save(); c.translate(st,0); c.rotate(sw); c.fillStyle=col; c.beginPath();
  const t=d.tail;
  if(t==='round'){ c.moveTo(0,-hh*.25); c.quadraticCurveTo(-tl*1.1,-sp*.9,-tl,0); c.quadraticCurveTo(-tl*1.1,sp*.9,0,hh*.25); }
  else if(t==='square'){ c.moveTo(0,-hh*.25); c.lineTo(-tl*.95,-sp*.85); c.quadraticCurveTo(-tl*.86,0,-tl*.95,sp*.85); c.lineTo(0,hh*.25); }
  else if(t==='lunate'){ c.moveTo(0,-hh*.15); c.quadraticCurveTo(-tl*.5,-sp*.5,-tl*1.05,-sp*1.15); c.quadraticCurveTo(-tl*.6,-sp*.2,-tl*.55,0); c.quadraticCurveTo(-tl*.6,sp*.2,-tl*1.05,sp*1.15); c.quadraticCurveTo(-tl*.5,sp*.5,0,hh*.15); }
  else if(t==='shark'){ c.moveTo(0,-hh*.15); c.quadraticCurveTo(-tl*.6,-sp*.7,-tl*1.15,-sp*1.4); c.quadraticCurveTo(-tl*.75,-sp*.3,-tl*.62,0); c.quadraticCurveTo(-tl*.7,sp*.35,-tl*.8,sp*.7); c.quadraticCurveTo(-tl*.4,sp*.3,0,hh*.15); }
  else if(t==='thresher'){ c.moveTo(0,-hh*.15); c.quadraticCurveTo(-tl*1.5,-sp*.6,-tl*3,-sp*1.9); c.quadraticCurveTo(-tl*1.6,-sp*.35,-tl*.6,0); c.quadraticCurveTo(-tl*.7,sp*.35,-tl*.75,sp*.6); c.quadraticCurveTo(-tl*.4,sp*.3,0,hh*.15); }
  else if(t==='fan'){ const wv=Math.sin(wag*1.3)*sp*.18, fg=c.createLinearGradient(0,0,-tl*1.9,0); fg.addColorStop(0,col); fg.addColorStop(1,v3rgba(col.startsWith('#')?col:'#888888',.35)); c.fillStyle=col.startsWith('#')?fg:col; c.moveTo(0,-hh*.18); c.bezierCurveTo(-tl*.5,-sp*.85,-tl*1.3,-sp*1.05+wv,-tl*1.85,-sp*.75+wv); c.quadraticCurveTo(-tl*1.6,-sp*.5+wv,-tl*1.75,-sp*.3); c.quadraticCurveTo(-tl*1.3,-sp*.05,-tl*1.05,0); c.quadraticCurveTo(-tl*1.3,sp*.05,-tl*1.75,sp*.3); c.quadraticCurveTo(-tl*1.6,sp*.5-wv,-tl*1.85,sp*.75-wv); c.bezierCurveTo(-tl*1.3,sp*1.05-wv,-tl*.5,sp*.85,0,hh*.18); }
  else if(t==='coel'){ c.moveTo(0,-hh*.3); c.quadraticCurveTo(-tl*.6,-sp*1.1,-tl*.9,-sp*.5); c.lineTo(-tl*1.3,-sp*.15); c.lineTo(-tl*1.3,sp*.15); c.lineTo(-tl*.9,sp*.5); c.quadraticCurveTo(-tl*.6,sp*1.1,0,hh*.3); }
  else { c.moveTo(0,-hh*.2); c.quadraticCurveTo(-tl*.6,-sp*.55,-tl*1.05,-sp*1.05); c.quadraticCurveTo(-tl*.75,-sp*.2,-tl*.62,0); c.quadraticCurveTo(-tl*.75,sp*.2,-tl*1.05,sp*1.05); c.quadraticCurveTo(-tl*.6,sp*.55,0,hh*.2); }
  c.closePath(); c.fill();
  if(L>40){ c.strokeStyle='rgba(0,0,0,.14)'; c.lineWidth=Math.max(.6,L*.006); c.beginPath(); for(let k=-2;k<=2;k++){ c.moveTo(-tl*.1,k*hh*.06); c.lineTo(-tl*.9,k*sp*.38); } c.stroke(); }
  c.restore(); }

function f3Dorsal(c,L,hh,d,col){ const x0=L*(d.dorsalX||0), top=-hh*(d.hump?1.2:.95); c.fillStyle=col; c.beginPath(); const k=d.dorsal;
  if(k==='spiny'){ c.moveTo(-L*.2+x0,top*.85); for(let i=0;i<=7;i++){ const xx=-L*.2+x0+i*L*.05, hh2=hh*(.42-Math.abs(i-2.5)*.04); c.lineTo(xx,top-hh2); c.lineTo(xx+L*.025,top-hh2*.55); } c.lineTo(L*.18+x0,top*.95); }
  else if(k==='sail'){ const big=d.sailBig?1.5:1; c.moveTo(-L*.18,top*.8); c.quadraticCurveTo(-L*.1,top-hh*1.4*big,L*.2,top-hh*1.1*big); c.quadraticCurveTo(L*.24,top-hh*.3,L*.28,top*.85); }
  else if(k==='shark'){ c.moveTo(-L*.05+x0,top*.9); c.lineTo(L*.02+x0,top-hh*.95); c.quadraticCurveTo(L*.06+x0,top-hh*.4,L*.14+x0,top*.92); }
  else if(k==='long'){ c.moveTo(-L*.3,top*.4); c.quadraticCurveTo(-L*.05,top-hh*.35,L*.22,top*.85); c.lineTo(L*.2,top); c.quadraticCurveTo(-L*.05,top*.9,-L*.3,top*.3); }
  else if(k==='trail'){ c.moveTo(-L*.1,top*.9); c.quadraticCurveTo(-L*.2,top-hh*.9,-L*.42,top-hh*1.2); c.quadraticCurveTo(-L*.22,top-hh*.3,L*.12,top*.95); }
  else if(k==='trigger'){ c.moveTo(-L*.25,top*.7); c.quadraticCurveTo(-L*.15,top-hh*.45,-L*.02,top*.9); c.moveTo(L*.08,top*.95); c.lineTo(L*.1,top-hh*.45); c.lineTo(L*.14,top*.9); }
  else if(k==='spines3'){ for(let i=0;i<3;i++){ const xx=-L*.08+i*L*.08; c.moveTo(xx,top*.95); c.lineTo(xx+L*.012,top-hh*.45); c.lineTo(xx+L*.025,top*.95); } }
  else if(k==='triple'){ for(let i=0;i<3;i++){ const xx=-L*.24+i*L*.15; c.moveTo(xx,top*.85); c.quadraticCurveTo(xx+L*.05,top-hh*.4,xx+L*.12,top*.9); } }
  else if(k==='lion'){ c.strokeStyle=col; c.lineWidth=Math.max(1,L*.012); for(let i=0;i<10;i++){ const xx=-L*.22+i*L*.045; c.moveTo(xx,top*.9); c.lineTo(xx-L*.03,top-hh*(.55+Math.sin(i)*.15)); } c.stroke(); c.globalAlpha*=.4; c.moveTo(-L*.22,top*.9); for(let i=0;i<10;i++){ const xx=-L*.22+i*L*.045; c.lineTo(xx-L*.03,top-hh*(.5+Math.sin(i)*.15)); } c.lineTo(L*.2,top*.9); c.fill(); c.globalAlpha/=.4; return; }
  else { c.moveTo(-L*.16+x0,top*.85); c.quadraticCurveTo(-L*.02+x0,top-hh*(.5+d.fin*.3),L*.16+x0,top*.88); }
  c.closePath(); c.fill(); }

function f3Pattern(c,L,hh,d,col,belly,pcol){ const p=d.pat; c.fillStyle=pcol;
  if(p==='vbars'){ for(let i=-2;i<=3;i++){ c.beginPath(); c.ellipse(i*L*.1,-hh*.1,L*.03,hh*.95,0,0,7); c.fill(); } }
  else if(p==='hstripe'){ c.fillRect(-L*.4,-hh*.12,L*.85,hh*.16); }
  else if(p==='hstripes'){ for(let k=0;k<3;k++) c.fillRect(-L*.4,hh*(.1+k*.22),L*.8,hh*.08); }
  else if(p==='stripes'){ for(let k=0;k<4;k++){ c.beginPath(); c.moveTo(-L*.3,-hh*(.2+k*.18)); c.quadraticCurveTo(0,-hh*(.5+k*.18),L*.3,-hh*(.25+k*.15)); c.lineWidth=Math.max(1,hh*.08); c.strokeStyle=pcol; c.stroke(); } }
  else if(p==='tiger'){ c.strokeStyle=pcol; c.lineWidth=Math.max(1,L*.018); for(let i=-3;i<=4;i++){ c.beginPath(); c.moveTo(i*L*.08,-hh); c.quadraticCurveTo(i*L*.08+L*.04,-hh*.6,i*L*.08-L*.01,-hh*.1); c.stroke(); } }
  else if(p==='spots'||p==='dots'){ const r=v3rng(fish3Hash(d.id||'x')+7); const n=p==='dots'?18:11; for(let i=0;i<n;i++){ c.beginPath(); c.arc(-L*.3+r()*L*.68,-hh*.8+r()*hh*1.2,Math.max(.8,L*(p==='dots'?.012:.02)*(.7+r()*.6)),0,7); c.fill(); } }
  else if(p==='marble'||p==='blotch'){ const r=v3rng(fish3Hash(d.id||'x')+3); for(let i=0;i<7;i++){ c.beginPath(); c.ellipse(-L*.28+r()*L*.6,-hh*.6+r()*hh*1.1,L*(.04+r()*.04),hh*(.14+r()*.16),r()*3,0,7); c.fill(); } }
  else if(p==='scales'||p==='mirror'){ c.strokeStyle=pcol; c.lineWidth=Math.max(.5,L*.005); const s=p==='mirror'?L*.07:L*.045; for(let row=-3;row<=3;row++){ for(let k=-6;k<=8;k++){ const xx=k*s+(row%2)*s*.5, yy=row*s*.7; if(p==='mirror'&&((k+row*3)%4)) continue; c.beginPath(); c.arc(xx,yy,s*.55,Math.PI*.5,Math.PI*1.5); c.stroke(); } } }
  else if(p==='chain'){ c.strokeStyle=pcol; c.lineWidth=Math.max(.6,L*.008); for(let row=-1;row<=1;row++){ for(let k=-5;k<=5;k++){ c.beginPath(); c.ellipse(k*L*.06+(row&1)*L*.03,row*hh*.35,L*.03,hh*.15,0,0,7); c.stroke(); } } }
  else if(p==='clown'){ c.fillStyle='#ffffff'; for(const xx of [L*.22,-L*.02,-L*.24]){ c.beginPath(); c.ellipse(xx,0,L*.045,hh*1.1,0,0,7); c.fill(); c.strokeStyle='#141414'; c.lineWidth=Math.max(.8,L*.012); c.stroke(); } }
  else if(p==='eyespot'||p==='spot1'){ c.fillStyle='#141418'; c.beginPath(); c.arc(p==='spot1'?0:-L*.18,-hh*.15,Math.max(1.5,hh*.22),0,7); c.fill(); if(p==='eyespot'){ c.strokeStyle='#f4f0e0'; c.lineWidth=Math.max(.6,L*.008); c.stroke(); } }
  else if(p==='photo'){ c.fillStyle='#bff8ff'; for(let i=0;i<9;i++){ c.beginPath(); c.arc(-L*.28+i*L*.07,hh*.62,Math.max(.8,L*.012),0,7); c.fill(); } }
  else if(p==='neon'){ c.fillStyle='#4af0ff'; c.fillRect(-L*.25,-hh*.22,L*.6,hh*.16); c.fillStyle='#ff3a5a'; c.fillRect(-L*.25,hh*.05,L*.35,hh*.2); }
  else if(p==='tang'){ c.fillStyle='#141830'; c.beginPath(); c.moveTo(L*.25,-hh*.5); c.quadraticCurveTo(-L*.05,-hh*.1,-L*.3,-hh*.5); c.quadraticCurveTo(-L*.05,hh*.3,L*.15,-hh*.05); c.closePath(); c.fill(); }
  else if(p==='mandarin'){ c.strokeStyle='#ff8a2a'; c.lineWidth=Math.max(1,L*.02); for(let i=0;i<6;i++){ c.beginPath(); c.moveTo(-L*.3+i*L*.12,-hh); c.bezierCurveTo(-L*.25+i*L*.12,-hh*.3,-L*.35+i*L*.12,hh*.2,-L*.28+i*L*.12,hh); c.stroke(); } }
  else if(p==='star'){ c.fillStyle='#ffffff'; for(let i=0;i<6;i++){ c.beginPath(); c.arc(-L*.2+i*L*.08,-hh*.2+Math.sin(i*2)*hh*.3,Math.max(.8,L*.012),0,7); c.fill(); } }
}

// ---------- the main fish (side view) ----------
function drawFishBody3(c,sp,d,L,col,belly,o,wag){
  const hh=Math.min(L*d.h*.5*(d.plan==='deep'?1.1:d.plan==='disc'?1.35:d.plan==='grouper'?1.1:1), L*(d.plan==='disc'?.3:.27)), dark=mix(col,'#000000',.35), fin=o.sil||mix(col,belly,.25), pcol=o.sil?o.sil:lum(col)>160?v3rgba(mix(col,'#000000',.55),.5):v3rgba(mix(col,'#000000',.6),.45);
  const ghostA=d.ghost&&!o.sil?.72:1; const a0=c.globalAlpha; c.globalAlpha=a0*ghostA;
  // tail and fins behind the body
  if(d.plan==='koi'||d.plan==='goldfish') d.tail='fan';
  if(d.plan==='shark') d.tail=d.tail==='thresher'?'thresher':'shark';
  f3Tail(c,L,hh,d,fin,wag);
  // anal fin and pelvic fin
  c.fillStyle=fin; c.beginPath(); c.moveTo(-L*.2,hh*.75); c.quadraticCurveTo(-L*.14,hh*1.35,-L*.03,hh*.92); c.closePath(); c.fill();
  if(d.dorsal==='trail'){ c.beginPath(); c.moveTo(-L*.1,hh*.9); c.quadraticCurveTo(-L*.2,hh*1.9,-L*.42,hh*2.1); c.quadraticCurveTo(-L*.22,hh*1.3,L*.1,hh*.95); c.fill(); }
  f3Dorsal(c,L,hh,d,fin);
  if(d.plan==='mahi'){ c.beginPath(); c.moveTo(L*.36,-hh*.85); c.quadraticCurveTo(0,-hh*1.5,-L*.3,-hh*.4); c.lineTo(-L*.3,-hh*.2); c.quadraticCurveTo(0,-hh*1.1,L*.36,-hh*.6); c.fill(); }
  if(d.plan==='tuna'||d.finlets){ c.fillStyle=o.sil||d.finlets||mix(col,'#f0d040',.5); for(let i=0;i<5;i++){ const xx=-L*.28+i*L*.035; c.beginPath(); c.moveTo(xx,-hh*.3); c.lineTo(xx-L*.012,-hh*.45); c.lineTo(xx-L*.022,-hh*.28); c.fill(); c.beginPath(); c.moveTo(xx,hh*.3); c.lineTo(xx-L*.012,hh*.45); c.lineTo(xx-L*.022,hh*.28); c.fill(); } }
  if(d.adipose){ c.fillStyle=fin; c.beginPath(); c.ellipse(-L*.24,-hh*.42,L*.025,hh*.12,-.3,0,7); c.fill(); }
  // the body with soft shading, belly, pattern, rim light, gill line
  c.fillStyle=o.sil?o.sil:f3Grad(c,dark,col,-hh,hh*.2); f3BodyPath(c,L,hh,d); c.fill();
  if(!o.sil){ c.save(); f3BodyPath(c,L,hh,d); c.clip();
    c.fillStyle=f3Grad(c,v3rgba(belly,0),belly,hh*.05,hh*.75); c.fillRect(-L*.5,0,L,hh*1.2);
    f3Pattern(c,L,hh,Object.assign({id:sp.id},d),col,belly,pcol);
    if(d.pat!=='scales'&&L>70){ c.strokeStyle='rgba(255,255,255,.07)'; c.lineWidth=.6; for(let row=-2;row<=2;row++) for(let k=-4;k<=6;k++){ c.beginPath(); c.arc(k*L*.05+(row&1)*L*.025,row*hh*.3,L*.026,Math.PI*.6,Math.PI*1.4); c.stroke(); } }
    c.fillStyle='rgba(255,255,255,.1)'; c.beginPath(); c.ellipse(L*.05,-hh*.66,L*.26,hh*.1,-.05,0,7); c.fill();
    if(d.ember){ c.fillStyle=f3Grad(c,'rgba(255,120,40,0)','rgba(255,120,40,.35)',0,hh); c.fillRect(-L*.5,0,L,hh); }
    if(d.frost){ c.fillStyle='rgba(220,240,255,.18)'; c.fillRect(-L*.5,-hh,L,hh*.5); }
    if(d.cosmic){ const r=v3rng(fish3Hash(sp.id)); c.fillStyle='rgba(255,255,255,.85)'; for(let i=0;i<10;i++) c.fillRect(-L*.3+r()*L*.7,-hh*.8+r()*hh*1.4,Math.max(.8,L*.01),Math.max(.8,L*.01)); }
    c.restore();
    c.strokeStyle=v3rgba(mix(col,'#000000',.5),.45); c.lineWidth=Math.max(.7,L*.009); c.beginPath(); c.arc(L*.3,0,hh*.62,-1,1); c.stroke(); }
  // pectoral fin (translucent, beats)
  c.fillStyle=o.sil||v3rgba(fin,.75); c.save(); c.translate(L*.2,hh*.2); c.rotate(.5+Math.sin(wag*1.7)*.25); c.beginPath(); const pl=d.pectoral==='long'?L*.3:d.wings?L*.32:L*.12; c.ellipse(-pl*.5,0,pl*.55,hh*(d.wings?.35:.18),0,0,7); c.fill(); if(d.wings&&!o.sil){ c.strokeStyle='rgba(0,0,0,.18)'; c.lineWidth=.6; for(let k=-2;k<=2;k++){ c.beginPath(); c.moveTo(0,0); c.lineTo(-pl,k*hh*.12); c.stroke(); } } c.restore();
  // head features
  const ex=L*(d.plan==='long'?.36:.33), ey=-hh*.28, er=Math.max(1.3,L*.034*(d.eyeK||1)*(d.eye==='big'||d.big?1.45:1));
  if(d.snout==='duck'&&!o.sil){ c.strokeStyle=v3rgba(mix(col,'#000000',.5),.5); c.lineWidth=Math.max(.6,L*.008); c.beginPath(); c.moveTo(L*.5,hh*.02); c.lineTo(L*.36,hh*.12); c.stroke(); }
  if(d.mouth==='big'&&!o.sil){ c.strokeStyle=v3rgba(mix(col,'#000000',.6),.6); c.lineWidth=Math.max(.8,L*.012); c.beginPath(); c.moveTo(L*.46,hh*.02); c.quadraticCurveTo(L*.4,hh*.2,L*.32,hh*.14); c.stroke(); }
  if(d.teeth&&!o.sil){ c.fillStyle='#f4f0e6'; const fang=d.teeth==='fang'; for(let i=0;i<(fang?4:6);i++){ const xx=L*(.46-i*.025); c.beginPath(); c.moveTo(xx,hh*.04); c.lineTo(xx-L*.006,hh*(fang?.3:.12)); c.lineTo(xx-L*.012,hh*.04); c.fill(); } }
  if(d.beak&&!o.sil){ c.fillStyle='#f0f0e0'; c.beginPath(); c.moveTo(L*.47,0); c.quadraticCurveTo(L*.44,-hh*.18,L*.38,-hh*.1); c.lineTo(L*.38,hh*.1); c.quadraticCurveTo(L*.44,hh*.18,L*.47,0); c.fill(); }
  if(d.barbel&&d.barbel!=='cat'){ c.strokeStyle=o.sil||mix(col,'#000000',.3); c.lineWidth=Math.max(.7,L*.009); c.lineCap='round'; c.beginPath(); const bl=d.barbel==='cat'?L*.22:d.barbel==='goat'?L*.1:L*.07;
    if(d.barbel==='chin'){ c.moveTo(L*.38,hh*.25); c.lineTo(L*.37,hh*.25+bl*.6); }
    else for(const k of d.barbel==='cat'?[-1,0,1]:[1]){ c.moveTo(L*.45,hh*.08); c.quadraticCurveTo(L*.5+bl*.3,hh*.2+k*hh*.15,L*.42+bl*.2+Math.sin(wag+k)*L*.01,hh*.25+k*hh*.1+bl*.45); }
    c.stroke(); if(d.barbel==='glow'&&!o.sil){ v3glow(c,L*.42+bl*.2,hh*.25+bl*.45,L*.04,'rgba(150,255,240,.9)',.7); } c.lineCap='butt'; }
  f3Eye(c,ex,ey,er,o,d);
  if(d.shades&&!o.sil){ c.fillStyle='#141418'; c.fillRect(ex-er*1.4,ey-er*.9,er*2.6,er*1.5); c.fillRect(ex-er*2.2,ey-er*.6,er*1,1.2); }
  if(d.grump&&!o.sil){ c.strokeStyle='#141418'; c.lineWidth=Math.max(.8,er*.35); c.beginPath(); c.moveTo(ex-er*1.3,ey-er*1.5); c.lineTo(ex+er*1.1,ey-er*.9); c.stroke(); }
  if(d.helmet&&!o.sil){ c.strokeStyle='rgba(220,240,255,.8)'; c.lineWidth=Math.max(1,L*.012); c.fillStyle='rgba(200,230,255,.25)'; c.beginPath(); c.arc(L*.3,-hh*.1,hh*.85,0,7); c.fill(); c.stroke(); c.fillStyle='rgba(255,255,255,.6)'; c.beginPath(); c.ellipse(L*.26,-hh*.5,hh*.25,hh*.1,-.4,0,7); c.fill(); }
  c.globalAlpha=a0;
}

// glow, flame, frost and crown touches drawn over any plan
function f3Aura(c,sp,d,L,o,t){ if(o.sil) return; const hh=L*d.h*.5;
  if(d.glow&&!d.ghost){ v3glow(c,0,0,L*.55,v3rgba(mix(sp.col,'#ffffff',.4),.6),.18+.08*Math.sin(t*2+L)); }
  if(d.flame||d.ember&&sp.r>=3){ for(let i=0;i<5;i++){ const k=((t*1.4+i/5)%1), fx=-L*.2+i*L*.1, fy=-hh*1.05-k*L*.12; c.fillStyle=v3rgba(i%2?'#ffb040':'#ff6a20',.7*(1-k)); c.beginPath(); c.arc(fx,fy,L*.02*(1-k*.6),0,7); c.fill(); } }
  if(d.crystal){ c.fillStyle='rgba(200,240,255,.75)'; for(let i=0;i<4;i++){ const xx=-L*.18+i*L*.1; c.beginPath(); c.moveTo(xx-L*.015,-hh*.9); c.lineTo(xx,-hh*1.45); c.lineTo(xx+L*.015,-hh*.9); c.fill(); } }
  if(d.stars){ c.fillStyle='#ffffff'; for(let i=0;i<6;i++){ const a=t*.6+i, xx=Math.cos(a)*L*.4, yy=Math.sin(a)*hh*1.4; c.globalAlpha=.4+.4*Math.sin(t*3+i); c.fillRect(xx,yy,Math.max(1,L*.012),Math.max(1,L*.012)); } c.globalAlpha=1; }
  if(d.crown||d.legend&&sp.r>=5){ const cx=L*.18, cy=-hh*1.05, s=Math.max(3,L*.06); c.fillStyle='#ffd34a'; c.beginPath(); c.moveTo(cx-s,cy); c.lineTo(cx-s,cy-s*.6); c.lineTo(cx-s*.5,cy-s*.25); c.lineTo(cx,cy-s*.8); c.lineTo(cx+s*.5,cy-s*.25); c.lineTo(cx+s,cy-s*.6); c.lineTo(cx+s,cy); c.closePath(); c.fill(); c.fillStyle='#ff4a6a'; c.beginPath(); c.arc(cx,cy-s*.3,s*.15,0,7); c.fill(); }
  if(d.storm){ c.strokeStyle='rgba(220,235,255,'+(.4+.4*Math.max(0,Math.sin(t*5)))+')'; c.lineWidth=Math.max(1,L*.012); c.beginPath(); c.moveTo(-L*.1,-hh*1.1); c.lineTo(-L*.05,-hh*.7); c.lineTo(-L*.12,-hh*.6); c.lineTo(-L*.04,-hh*.2); c.stroke(); }
  if(d.pulse){ const k=(t*.8)%1; c.strokeStyle='rgba(180,220,255,'+(.6*(1-k))+')'; c.lineWidth=1.2; c.beginPath(); c.ellipse(0,0,L*(.3+k*.4),hh*(1+k*1.5),0,0,7); c.stroke(); }
  if(d.eclipse){ v3glow(c,-L*.05,0,L*.35,'rgba(255,220,150,.9)',.3); }
  if(d.starTip){ c.fillStyle='#fff2a0'; c.save(); c.translate(L*.1,-hh*1.4); c.rotate(t); c.beginPath(); for(let i=0;i<5;i++){ const a=i/5*Math.PI*2; c.lineTo(Math.cos(a)*L*.05,Math.sin(a)*L*.05); c.lineTo(Math.cos(a+.63)*L*.02,Math.sin(a+.63)*L*.02); } c.fill(); c.restore(); v3glow(c,L*.1,-hh*1.4,L*.12,'rgba(255,240,160,.9)',.5); }
}

// ---------- other body plans ----------
function f3Eel(c,sp,d,L,col,belly,o,wag){ const N=16, th=L*(d.thin?.055:d.ribbon?.1:.085)*(d.big?1.3:1), pts=[];
  for(let i=0;i<=N;i++){ const u=i/N, x=L*(.5-u), amp=L*.05*u*(d.ribbon?1.4:1); pts.push([x,Math.sin(wag-u*5)*amp]); }
  const w=u=>th*(u<.12?.6+u*3.3:1-(u-.12)*.85);
  const L1=[], R1=[]; for(let i=0;i<=N;i++){ const u=i/N, [x,y]=pts[i], [x2,y2]=pts[Math.min(N,i+1)], [x0,y0]=pts[Math.max(0,i-1)], ang=Math.atan2(y2-y0,x2-x0)+Math.PI/2, ww=w(u); L1.push([x+Math.cos(ang)*ww,y+Math.sin(ang)*ww]); R1.push([x-Math.cos(ang)*ww,y-Math.sin(ang)*ww]); }
  const path=()=>{ c.beginPath(); c.moveTo(L1[0][0],L1[0][1]); for(const p of L1) c.lineTo(p[0],p[1]); for(let i=R1.length-1;i>=0;i--) c.lineTo(R1[i][0],R1[i][1]); c.closePath(); };
  const fin=o.sil||mix(col,belly,.3);
  // continuous dorsal fin ribbon along the back
  c.strokeStyle=fin; c.lineWidth=Math.max(1,th*(d.crest?.8:.45)); c.beginPath(); for(let i=2;i<=N;i++){ const p=R1[i]; i===2?c.moveTo(p[0],p[1]-th*.2):c.lineTo(p[0],p[1]-th*.2); } c.stroke();
  if(d.crest&&!o.sil){ c.fillStyle=d.crystal?'rgba(200,240,255,.8)':'#e8483a'; for(let i=1;i<6;i++){ const p=R1[i]; c.beginPath(); c.moveTo(p[0],p[1]); c.lineTo(p[0]-L*.02,p[1]-th*2.6); c.lineTo(p[0]-L*.035,p[1]); c.fill(); } }
  c.fillStyle=o.sil||col; path(); c.fill();
  if(!o.sil){ c.save(); path(); c.clip(); c.strokeStyle=v3rgba(belly,.85); c.lineWidth=th*.8; c.beginPath(); for(let i=0;i<=N;i++){ const p=L1[i]; i?c.lineTo(p[0],p[1]-th*.15):c.moveTo(p[0],p[1]-th*.15); } c.stroke();
    if(d.pat==='marble'||d.pat==='blotch'||d.pat==='spots'||d.pat==='dots'){ c.fillStyle=v3rgba(mix(col,'#000000',.5),.45); for(let i=1;i<N;i+=1){ const [x,y]=pts[i]; c.beginPath(); c.ellipse(x,y+((i*7)%3-1)*th*.3,th*.45,th*.3,0,0,7); c.fill(); } }
    if(d.pat==='vbars'){ c.fillStyle=v3rgba(mix(col,'#000000',.5),.4); for(let i=1;i<N;i+=2){ const [x,y]=pts[i]; c.fillRect(x-th*.25,y-th,th*.5,th*2); } }
    if(d.aurora){ c.strokeStyle='rgba(120,255,200,.6)'; c.lineWidth=th*.35; c.beginPath(); for(let i=0;i<=N;i++){ const [x,y]=pts[i]; i?c.lineTo(x,y):c.moveTo(x,y); } c.stroke(); }
    if(d.flame){ c.fillStyle='rgba(255,140,40,.45)'; for(let i=1;i<N;i+=2){ const [x,y]=pts[i]; c.beginPath(); c.arc(x,y,th*.35,0,7); c.fill(); } }
    c.fillStyle='rgba(255,255,255,.15)'; c.beginPath(); for(let i=0;i<=N;i++){ const p=R1[i]; i?c.lineTo(p[0],p[1]+th*.3):c.moveTo(p[0],p[1]+th*.3); } c.lineTo(pts[N][0],pts[N][1]); c.closePath(); c.fill(); c.restore(); }
  if(d.frills&&!o.sil){ c.strokeStyle='#e8606a'; c.lineWidth=Math.max(1,th*.25); for(let k=0;k<3;k++){ c.beginPath(); c.arc(L*.38-k*th*.5,0,th*1.05,-1.3,1.3); c.stroke(); } }
  const er=Math.max(1.2,th*.32*(d.eye==='big'?1.4:1)); f3Eye(c,L*.44,-th*.3,er,o,d);
  if(d.mouth==='open'&&!o.sil){ c.fillStyle='#3a1418'; c.beginPath(); c.moveTo(L*.5,0); c.lineTo(L*.4,th*.25); c.lineTo(L*.5,th*.45); c.fill(); c.fillStyle='#f4f0e6'; c.fillRect(L*.43,th*.2,1,th*.12); }
  if(d.teeth&&!o.sil){ c.fillStyle='#f4f0e6'; for(let i=0;i<3;i++){ c.beginPath(); c.moveTo(L*(.49-i*.02),th*.1); c.lineTo(L*(.485-i*.02),th*.5); c.lineTo(L*(.48-i*.02),th*.1); c.fill(); } }
  if(d.barbel){ c.strokeStyle=o.sil||mix(col,'#000000',.3); c.lineWidth=Math.max(.6,th*.15); c.beginPath(); c.moveTo(L*.49,th*.2); c.quadraticCurveTo(L*.53,th*.8,L*.5,th*1.5); c.stroke(); if(d.barbel==='glow'&&!o.sil) v3glow(c,L*.5,th*1.5,th*1.2,'rgba(150,255,240,.9)',.8); }
  if(d.snout==='snipe'&&!o.sil){ c.strokeStyle=col; c.lineWidth=Math.max(.8,th*.2); c.beginPath(); c.moveTo(L*.48,-th*.1); c.quadraticCurveTo(L*.58,-th*.3,L*.62,-th*.8); c.moveTo(L*.48,th*.1); c.quadraticCurveTo(L*.58,th*.4,L*.62,th*.9); c.stroke(); }
  if(d.ghost&&!o.sil){ v3glow(c,0,0,L*.45,'rgba(200,230,255,.6)',.18); }
}

function f3Shark(c,sp,d,L,col,belly,o,wag){ const hh=L*d.h*.5*(d.big?1.1:1), fin=o.sil||mix(col,'#000000',.12), dark=mix(col,'#000000',.3);
  d.tail=d.tail==='thresher'?'thresher':'shark'; f3Tail(c,L,hh,d,fin,wag);
  c.fillStyle=fin; c.beginPath(); c.moveTo(-L*.18,hh*.55); c.lineTo(-L*.22,hh*.95); c.lineTo(-L*.1,hh*.6); c.fill();
  c.beginPath(); c.moveTo(-L*.02,-hh*.9); c.quadraticCurveTo(L*.02,-hh*1.9,L*.03,-hh*1.95); c.quadraticCurveTo(L*.08,-hh*1.3,L*.15,-hh*.85); c.fill();
  c.beginPath(); c.moveTo(-L*.22,-hh*.5); c.lineTo(-L*.21,-hh*.82); c.lineTo(-L*.17,-hh*.5); c.fill();
  const body=()=>{ c.beginPath(); c.moveTo(L*.5,hh*.05); c.quadraticCurveTo(L*.42,-hh*.95,L*.05,-hh); c.quadraticCurveTo(-L*.25,-hh*.85,-L*.32,-hh*.18); c.lineTo(-L*.32,hh*.18); c.quadraticCurveTo(-L*.2,hh*.85,L*.05,hh*.9); c.quadraticCurveTo(L*.4,hh*.85,L*.5,hh*.05); c.closePath(); };
  c.fillStyle=o.sil||f3Grad(c,dark,col,-hh,hh*.2); body(); c.fill();
  if(!o.sil){ c.save(); body(); c.clip(); c.fillStyle=belly; c.beginPath(); c.moveTo(L*.5,hh*.1); c.quadraticCurveTo(L*.1,hh*.1,-L*.32,hh*.05); c.lineTo(-L*.32,hh); c.lineTo(L*.5,hh); c.closePath(); c.fill();
    f3Pattern(c,L,hh,Object.assign({id:sp.id},d),col,belly,v3rgba(mix(col,d.pat==='dots'?'#ffffff':'#000000',.55),.45));
    if(d.craters){ c.fillStyle='rgba(0,0,0,.18)'; for(const [x,y,r] of [[-.1,-.4,.05],[.12,-.5,.035],[.02,-.2,.03]]){ c.beginPath(); c.arc(L*x,hh*y*1.4,L*r,0,7); c.fill(); } }
    if(d.flame){ c.fillStyle=f3Grad(c,'rgba(255,120,30,0)','rgba(255,120,30,.45)',-hh*.2,hh); c.fillRect(-L*.4,-hh,L,hh*2); c.strokeStyle='rgba(255,180,60,.7)'; c.lineWidth=Math.max(1,L*.01); for(let i=0;i<4;i++){ c.beginPath(); c.moveTo(-L*.2+i*L*.12,-hh*.6); c.lineTo(-L*.15+i*L*.12,0); c.lineTo(-L*.2+i*L*.12,hh*.4); c.stroke(); } }
    if(d.crystal){ c.fillStyle='rgba(220,245,255,.25)'; c.fillRect(-L*.4,-hh,L,hh*.6); }
    if(d.ghost){ c.fillStyle='rgba(220,240,255,.2)'; c.fillRect(-L*.4,-hh,L,hh*2); }
    c.fillStyle='rgba(255,255,255,.14)'; c.beginPath(); c.ellipse(L*.05,-hh*.65,L*.3,hh*.12,0,0,7); c.fill(); c.restore();
    c.strokeStyle=v3rgba(mix(col,'#000000',.5),.5); c.lineWidth=Math.max(.7,L*.006); for(let k=0;k<(d.slow?6:5);k++){ c.beginPath(); c.moveTo(L*(.26-k*.025),-hh*.25); c.quadraticCurveTo(L*(.25-k*.025),hh*.05,L*(.26-k*.025),hh*.3); c.stroke(); } }
  c.fillStyle=o.sil||fin; c.save(); c.translate(L*.14,hh*.55); c.rotate(.6+Math.sin(wag*1.2)*.1); c.beginPath(); c.moveTo(0,0); c.lineTo(-L*.1,hh*.9); c.lineTo(L*.04,hh*.1); c.closePath(); c.fill(); c.restore();
  if(d.head==='hammer'){ c.fillStyle=o.sil||col; c.beginPath(); c.ellipse(L*.44,0,L*.05,hh*1.15,0,0,7); c.fill(); f3Eye(c,L*.45,-hh*1.05,Math.max(1.2,L*.022),o,d); f3Eye(c,L*.45,hh*1.05,Math.max(1.2,L*.022),o,d); }
  else if(d.head==='goblin'){ c.fillStyle=o.sil||mix(col,'#ffb0b0',.3); c.beginPath(); c.moveTo(L*.45,-hh*.1); c.quadraticCurveTo(L*.62,-hh*.35,L*.68,-hh*.2); c.quadraticCurveTo(L*.55,-hh*.05,L*.47,hh*.05); c.fill(); f3Eye(c,L*.38,-hh*.35,Math.max(1.2,L*.022),o,d); }
  else f3Eye(c,L*.38,-hh*.32,Math.max(1.2,L*.025*(d.small?1.4:1)),o,d);
  if(!o.sil){ c.strokeStyle=v3rgba(mix(col,'#000000',.6),.6); c.lineWidth=Math.max(.8,L*.008); c.beginPath(); if(d.mouth==='wide'){ c.moveTo(L*.5,hh*.08); c.lineTo(L*.32,hh*.2); } else { c.moveTo(L*.44,hh*.38); c.quadraticCurveTo(L*.38,hh*.5,L*.3,hh*.42); } c.stroke(); }
}

function f3Ray(c,sp,d,L,col,belly,o,wag,manta){ const fl=Math.sin(wag*.6)*.25, w=L*.48, hd=L*.32;
  c.strokeStyle=o.sil||mix(col,'#000000',.2); c.lineWidth=Math.max(1,L*.02); c.lineCap='round'; c.beginPath(); c.moveTo(-L*.18,0); c.quadraticCurveTo(-L*.55,Math.sin(wag)*L*.04,-L*(d.tail==='whip'?.85:.7),Math.sin(wag*1.2)*L*.06); c.stroke(); c.lineCap='butt';
  if(d.tail==='whip'&&!o.sil){ c.fillStyle='#d8d0c0'; c.beginPath(); c.moveTo(-L*.4,0); c.lineTo(-L*.46,-L*.02); c.lineTo(-L*.44,0); c.fill(); }
  const wt=manta?1.08:.95, body=()=>{ c.beginPath(); c.moveTo(L*.3,0); c.quadraticCurveTo(L*.26,-w*.62,L*.02,-w*wt*(1+fl)); c.quadraticCurveTo(-L*.01,-w*.42,-L*.2,-w*.13); c.quadraticCurveTo(-L*.24,0,-L*.2,w*.13); c.quadraticCurveTo(-L*.01,w*.42,L*.02,w*wt*(1-fl)); c.quadraticCurveTo(L*.26,w*.62,L*.3,0); c.closePath(); };
  c.fillStyle=o.sil||f3Grad(c,mix(col,'#000000',.15),col,-w,w); body(); c.fill();
  if(!o.sil){ c.save(); body(); c.clip(); c.fillStyle=v3rgba(belly,.25); c.beginPath(); c.ellipse(L*.08,0,L*.12,hd*.35,0,0,7); c.fill();
    if(d.pat==='dots'||d.pat==='spots'||sp.pat===2){ c.fillStyle=lum(col)<120?'rgba(255,255,255,.65)':'rgba(255,255,255,.55)'; const r=v3rng(fish3Hash(sp.id)); for(let i=0;i<18;i++){ c.beginPath(); c.arc(-L*.1+r()*L*.35,-w+r()*w*2,Math.max(.8,L*.014),0,7); c.fill(); } }
    if(d.pat==='star'){ c.fillStyle='rgba(255,255,255,.8)'; c.save(); c.translate(L*.05,0); c.beginPath(); for(let i=0;i<5;i++){ const a=i/5*Math.PI*2-Math.PI/2; c.lineTo(Math.cos(a)*L*.1,Math.sin(a)*L*.1); c.lineTo(Math.cos(a+.63)*L*.04,Math.sin(a+.63)*L*.04); } c.fill(); c.restore(); }
    if(d.flame){ c.fillStyle=f3Grad(c,'rgba(255,120,30,.4)','rgba(255,200,60,.1)',-w,w); c.fillRect(-L*.3,-w,L*.7,w*2); }
    if(d.thorns){ c.fillStyle='rgba(240,230,210,.8)'; for(let i=0;i<6;i++){ c.beginPath(); c.arc(L*.15-i*L*.06,0,Math.max(.8,L*.01),0,7); c.fill(); } }
    if(d.rings){ c.strokeStyle='rgba(220,200,255,.6)'; c.lineWidth=1; c.beginPath(); c.ellipse(L*.05,0,L*.2,w*.9,0,0,7); c.stroke(); }
    c.fillStyle='rgba(255,255,255,.12)'; c.beginPath(); c.ellipse(L*.12,-w*.3,L*.08,w*.35,0,0,7); c.fill(); c.restore(); }
  if(manta&&!o.sil){ c.fillStyle=mix(col,'#000000',.25); for(const sd of [-1,1]){ c.beginPath(); c.moveTo(L*.28,sd*hd*.12); c.quadraticCurveTo(L*.4,sd*hd*.18,L*.38,sd*hd*.32); c.quadraticCurveTo(L*.32,sd*hd*.22,L*.26,sd*hd*.2); c.fill(); } }
  f3Eye(c,L*.2,-hd*.16,Math.max(1.2,L*.022),o,d); f3Eye(c,L*.2,hd*.16,Math.max(1.2,L*.022),o,d);
  if(d.glow&&!o.sil) v3glow(c,0,0,L*.6,'rgba(200,180,255,.8)',.2);
}

function f3Ball(c,sp,d,L,col,belly,o,wag){ const r=L*(d.big?.36:.3), fin=o.sil||mix(col,belly,.3);
  c.fillStyle=fin; c.save(); c.translate(-r*.9,0); c.rotate(Math.sin(wag)*.3); c.beginPath(); c.moveTo(0,-r*.2); c.quadraticCurveTo(-r*.6,-r*.6,-r*.55,0); c.quadraticCurveTo(-r*.6,r*.6,0,r*.2); c.fill(); c.restore();
  c.beginPath(); c.ellipse(-r*.1,-r*.95,r*.25,r*.15,-.3,0,7); c.fill();
  if(d.spikes&&!o.sil){ c.strokeStyle=mix(col,'#000000',.3); c.lineWidth=Math.max(.8,r*.05); c.beginPath(); for(let i=0;i<22;i++){ const a=i/22*Math.PI*2; c.moveTo(Math.cos(a)*r*.95,Math.sin(a)*r*.9); c.lineTo(Math.cos(a)*r*1.18,Math.sin(a)*r*1.12); } c.stroke(); }
  const body=()=>{ c.beginPath(); if(d.soft){ for(let i=0;i<=16;i++){ const a=i/16*Math.PI*2, rr=r*(1+.06*Math.sin(i*3)); i?c.lineTo(Math.cos(a)*rr,Math.sin(a)*rr*.85):c.moveTo(Math.cos(a)*rr,Math.sin(a)*rr*.85); } c.closePath(); } else c.ellipse(0,0,r,r*.88,0,0,7); };
  c.fillStyle=o.sil||f3Grad(c,mix(col,'#000000',.2),col,-r,r*.4); body(); c.fill();
  if(!o.sil){ c.save(); body(); c.clip(); c.fillStyle=f3Grad(c,v3rgba(belly,0),belly,0,r*.8); c.fillRect(-r,0,r*2,r);
    const pc=v3rgba(mix(col,'#000000',.55),.45); if(d.pat==='dots'||d.pat==='spots'||sp.pat===2){ c.fillStyle=pc; const rr=v3rng(fish3Hash(sp.id)); for(let i=0;i<14;i++){ c.beginPath(); c.arc(-r+rr()*r*2,-r+rr()*r*1.4,Math.max(.8,r*.07),0,7); c.fill(); } }
    if(d.pat==='marble'){ c.fillStyle=pc; for(let i=0;i<5;i++){ c.beginPath(); c.ellipse(-r*.5+i*r*.25,-r*.3+((i*7)%3)*r*.2,r*.18,r*.1,i,0,7); c.fill(); } }
    if(d.toast){ c.fillStyle='rgba(160,90,40,.55)'; c.beginPath(); c.ellipse(0,r*.5,r,r*.4,0,0,7); c.fill(); }
    if(d.crystal){ c.fillStyle='rgba(220,245,255,.5)'; for(let i=0;i<4;i++){ c.beginPath(); c.moveTo(-r*.6+i*r*.4,-r*.9); c.lineTo(-r*.4+i*r*.4,-r*.2); c.lineTo(-r*.8+i*r*.4,-r*.3); c.fill(); } }
    if(d.glowCore){ v3glow(c,0,r*.1,r*.8,'rgba(255,140,40,.9)',.6+.2*Math.sin(performance.now()/400)); }
    c.fillStyle='rgba(255,255,255,.22)'; c.beginPath(); c.ellipse(-r*.15,-r*.55,r*.45,r*.18,-.2,0,7); c.fill(); c.restore(); }
  c.fillStyle=o.sil||v3rgba(fin,.8); c.beginPath(); c.ellipse(r*.15,r*.25,r*.22,r*.12,.6+Math.sin(wag*2)*.3,0,7); c.fill();
  f3Eye(c,r*.5,-r*.25,Math.max(1.4,r*.17*(d.big?1.3:1)),o,d);
  if(!o.sil){ c.strokeStyle=v3rgba(mix(col,'#000000',.6),.7); c.lineWidth=Math.max(.8,r*.05); c.beginPath(); c.arc(r*.82,r*.08,r*.1,-.6,1.2); c.stroke(); }
}

function f3Box(c,sp,d,L,col,belly,o,wag){ const w=L*.3, h=L*.22, fin=o.sil||mix(col,belly,.3);
  c.fillStyle=fin; c.save(); c.translate(-w,0); c.rotate(Math.sin(wag)*.3); c.beginPath(); c.moveTo(0,-h*.25); c.quadraticCurveTo(-w*.55,-h*.7,-w*.5,0); c.quadraticCurveTo(-w*.55,h*.7,0,h*.25); c.fill(); c.restore();
  const body=()=>{ c.beginPath(); c.moveTo(w*.95,-h*.2); c.quadraticCurveTo(w,-h,w*.2,-h); c.lineTo(-w*.85,-h*.85); c.quadraticCurveTo(-w*1.05,0,-w*.85,h*.85); c.lineTo(w*.2,h); c.quadraticCurveTo(w,h,w*.95,h*.2); c.closePath(); };
  c.fillStyle=o.sil||col; body(); c.fill();
  if(!o.sil){ c.save(); body(); c.clip(); c.strokeStyle=v3rgba(mix(col,'#000000',.4),.45); c.lineWidth=Math.max(.6,L*.008); const s=h*.42; for(let row=-3;row<=3;row++) for(let k=-4;k<=4;k++){ const cx=k*s*1.5, cy=row*s*.87+(k&1)*s*.43; c.beginPath(); for(let j=0;j<6;j++){ const a=j/6*Math.PI*2; c.lineTo(cx+Math.cos(a)*s*.5,cy+Math.sin(a)*s*.5); } c.closePath(); c.stroke(); }
    c.fillStyle='rgba(20,20,30,.45)'; const rr=v3rng(fish3Hash(sp.id)); for(let i=0;i<10;i++){ c.beginPath(); c.arc(-w*.8+rr()*w*1.6,-h*.8+rr()*h*1.6,Math.max(.8,L*.014),0,7); c.fill(); }
    c.fillStyle='rgba(255,255,255,.2)'; c.fillRect(-w,-h,w*2,h*.35); c.restore(); }
  if(d.spikes&&!o.sil){ c.fillStyle=mix(col,'#ffffff',.3); for(let i=0;i<5;i++){ c.beginPath(); c.moveTo(-w*.6+i*w*.35,-h*.95); c.lineTo(-w*.5+i*w*.35,-h*1.35); c.lineTo(-w*.4+i*w*.35,-h*.95); c.fill(); } }
  f3Eye(c,w*.55,-h*.35,Math.max(1.4,L*.035),o,d); if(!o.sil){ c.fillStyle='#3a1a1a'; c.beginPath(); c.ellipse(w*.98,h*.05,w*.06,h*.08,0,0,7); c.fill(); }
}

function f3Horse(c,sp,d,L,col,belly,o,wag){ const s=L*.5, fin=o.sil||mix(col,belly,.3); c.save(); c.rotate(-.1+Math.sin(wag*.3)*.05);
  const sp2=[[s*.15,-s*.75],[s*.3,-s*.4],[s*.18,0],[s*.05,s*.35],[s*.2,s*.65],[s*.05,s*.85],[-s*.15,s*.75],[-s*.05,s*.62]], tw=u=>s*(.16-u*.13);
  c.strokeStyle=o.sil||col; c.lineCap='round'; c.lineJoin='round'; c.beginPath(); c.moveTo(sp2[0][0],sp2[0][1]); for(let i=1;i<sp2.length;i++){ const p=sp2[i], q=sp2[i-1]; c.quadraticCurveTo(q[0],q[1],(p[0]+q[0])/2,(p[1]+q[1])/2); } c.lineWidth=s*.24; c.stroke();
  c.lineWidth=s*.16; c.beginPath(); c.moveTo(s*.05,s*.35); c.quadraticCurveTo(s*.2,s*.62,s*.08,s*.82); c.quadraticCurveTo(-s*.08,s*.9,-s*.14,s*.76); c.quadraticCurveTo(-s*.12,s*.64,-s*.02,s*.66); c.stroke();
  c.fillStyle=o.sil||col; c.beginPath(); c.ellipse(s*.16,-s*.82,s*.17,s*.13,.3,0,7); c.fill();
  c.lineWidth=s*.08; c.beginPath(); c.moveTo(s*.25,-s*.86); c.lineTo(s*.52,-s*.78); c.stroke(); c.lineCap='butt';
  if(!o.sil){ c.strokeStyle=v3rgba(belly,.8); c.lineWidth=s*.08; c.beginPath(); c.moveTo(s*.32,-s*.5); c.quadraticCurveTo(s*.3,-s*.15,s*.2,s*.2); c.stroke();
    c.strokeStyle=v3rgba(mix(col,'#000000',.4),.5); c.lineWidth=Math.max(.6,s*.02); for(let k=0;k<9;k++){ const yy=-s*.55+k*s*.1; c.beginPath(); c.moveTo(s*.02,yy); c.lineTo(s*.34-Math.abs(k-4)*s*.02,yy+s*.02); c.stroke(); } }
  c.fillStyle=o.sil||v3rgba(fin,.75); c.beginPath(); c.ellipse(-s*.04,-s*.15,s*.08,s*.14+Math.sin(wag*3)*s*.03,0,0,7); c.fill();
  c.beginPath(); c.moveTo(s*.08,-s*.98); c.lineTo(s*.12,-s*1.1); c.lineTo(s*.2,-s*.97); c.fill();
  if(d.frills&&!o.sil){ c.fillStyle=mix(col,'#8ac860',.4); for(const [x,y,a] of [[.3,-.55,-.6],[.32,-.2,.2],[-.05,-.4,-2.5],[.2,.25,.5],[-.05,.5,-2.2],[.15,-.95,-1.2]]){ c.save(); c.translate(s*x,s*y); c.rotate(a+Math.sin(wag+x*9)*.15); c.beginPath(); c.ellipse(s*.12,0,s*.12,s*.04,0,0,7); c.ellipse(s*.2,s*.04,s*.07,s*.03,.6,0,7); c.fill(); c.restore(); } }
  f3Eye(c,s*.2,-s*.85,Math.max(1.2,s*.06),o,d); c.restore(); }

function f3Mola(c,sp,d,L,col,belly,o,wag){ const r=L*.36, fin=o.sil||mix(col,'#000000',.15), fl=Math.sin(wag*.5)*.2;
  c.fillStyle=fin; c.save(); c.translate(-r*.1,-r*.8); c.rotate(-.3+fl); c.beginPath(); c.moveTo(-r*.15,0); c.quadraticCurveTo(-r*.25,-r*.9,-r*.05,-r*1.0); c.quadraticCurveTo(r*.1,-r*.5,r*.15,0); c.fill(); c.restore();
  c.save(); c.translate(-r*.1,r*.8); c.rotate(.3-fl); c.beginPath(); c.moveTo(-r*.15,0); c.quadraticCurveTo(-r*.25,r*.9,-r*.05,r*1.0); c.quadraticCurveTo(r*.1,r*.5,r*.15,0); c.fill(); c.restore();
  const body=()=>{ c.beginPath(); c.moveTo(r*.95,0); c.bezierCurveTo(r*.95,-r*.85,-r*.4,-r*.95,-r*.7,-r*.55); c.quadraticCurveTo(-r*.85,0,-r*.7,r*.55); c.bezierCurveTo(-r*.4,r*.95,r*.95,r*.85,r*.95,0); c.closePath(); };
  c.fillStyle=o.sil||f3Grad(c,mix(col,'#000000',.15),belly,-r,r); body(); c.fill();
  if(!o.sil){ c.save(); body(); c.clip(); c.fillStyle=v3rgba(mix(col,'#000000',.3),.4); for(let k=0;k<8;k++){ c.beginPath(); c.ellipse(-r*.75,-r*.6+k*r*.17,r*.12,r*.05,0,0,7); c.fill(); } c.fillStyle='rgba(255,255,255,.15)'; c.beginPath(); c.ellipse(r*.1,-r*.5,r*.5,r*.15,0,0,7); c.fill(); c.restore(); }
  c.fillStyle=o.sil||v3rgba(fin,.8); c.beginPath(); c.ellipse(r*.25,r*.05,r*.13,r*.07,.4+Math.sin(wag)*.3,0,7); c.fill();
  f3Eye(c,r*.62,-r*.18,Math.max(1.4,r*.09),o,d); if(!o.sil){ c.fillStyle='#3a2a2a'; c.beginPath(); c.arc(r*.95,r*.02,r*.05,0,7); c.fill(); } }

function f3Angler(c,sp,d,L,col,belly,o,wag,t){ const r=L*.3, lx=r*1.25, ly=-r*1.1+Math.sin(t*1.5)*r*.08;
  c.fillStyle=o.sil||mix(col,'#000000',.1); c.save(); c.translate(-r*.95,0); c.rotate(Math.sin(wag)*.25); c.beginPath(); c.moveTo(0,-r*.2); c.quadraticCurveTo(-r*.5,-r*.5,-r*.5,0); c.quadraticCurveTo(-r*.5,r*.5,0,r*.2); c.fill(); c.restore();
  c.fillStyle=o.sil||f3Grad(c,mix(col,'#000000',.2),col,-r,r); c.beginPath(); c.moveTo(r*.95,-r*.1); c.quadraticCurveTo(r*.8,-r*.95,-r*.1,-r*.9); c.quadraticCurveTo(-r*1.05,-r*.6,-r*.95,0); c.quadraticCurveTo(-r*.9,r*.75,0,r*.85); c.quadraticCurveTo(r*.8,r*.8,r*1.0,r*.25); c.closePath(); c.fill();
  if(!o.sil){ c.fillStyle='#1a0a0e'; c.beginPath(); c.moveTo(r*1.0,-r*.05); c.quadraticCurveTo(r*.55,r*.05,r*.4,r*.25); c.quadraticCurveTo(r*.7,r*.4,r*1.0,r*.25); c.closePath(); c.fill();
    c.fillStyle='#f0ece0'; for(let i=0;i<6;i++){ const xx=r*(.95-i*.09); c.beginPath(); c.moveTo(xx,-r*.03); c.lineTo(xx-r*.03,r*.12); c.lineTo(xx-r*.06,-r*.03+i*r*.01); c.fill(); c.beginPath(); c.moveTo(xx,r*.25); c.lineTo(xx-r*.03,r*.12); c.lineTo(xx-r*.06,r*.25); c.fill(); }
    c.strokeStyle=mix(col,'#000000',.3); c.lineWidth=Math.max(.8,r*.05); c.beginPath(); c.moveTo(r*.45,-r*.82); c.quadraticCurveTo(r*.9,-r*1.5,lx,ly); c.stroke();
    v3glow(c,lx,ly,r*.6,'rgba(170,255,230,.95)',.7+.2*Math.sin(t*3)); c.fillStyle='#e0fff4'; c.beginPath(); c.arc(lx,ly,r*.1,0,7); c.fill(); }
  f3Eye(c,r*.55,-r*.45,Math.max(1.2,r*.1),o,d); }

function f3Blob(c,sp,d,L,col,belly,o,wag){ const r=L*.3;
  if(d.plan==='seapig'){ // a sea pig: tube-foot legs underneath, two waving feelers on top, no tail
    c.fillStyle=o.sil||mix(col,'#ffffff',.15); for(let i=0;i<5;i++){ const lx=-r*.6+i*r*.32; c.beginPath(); c.ellipse(lx,r*.62+Math.sin(wag+i)*r*.04,r*.07,r*.16,0,0,7); c.fill(); }
    for(const [ax,ph] of [[r*.1,0],[r*.35,1.3]]){ c.strokeStyle=o.sil||mix(col,'#ffffff',.2); c.lineWidth=Math.max(1,r*.07); c.lineCap='round'; c.beginPath(); c.moveTo(ax,-r*.6); c.quadraticCurveTo(ax+Math.sin(wag+ph)*r*.15,-r*.95,ax+r*.1+Math.sin(wag*1.3+ph)*r*.12,-r*1.15); c.stroke(); c.lineCap='butt'; }
    c.fillStyle=o.sil||col; c.beginPath(); c.ellipse(0,r*.1,r*1.0,r*.62,0,0,7); c.fill();
    if(!o.sil){ c.fillStyle='rgba(255,255,255,.25)'; c.beginPath(); c.ellipse(-r*.1,-r*.25,r*.55,r*.15,0,0,7); c.fill(); c.fillStyle=v3rgba(mix(col,'#a03a5a',.4),.4); for(let i=0;i<6;i++){ c.beginPath(); c.arc(-r*.6+i*r*.25,r*.05+((i*3)%2)*r*.15,r*.05,0,7); c.fill(); } }
    f3Eye(c,r*.7,-r*.05,Math.max(1.1,r*.07),o,d); return; }
  c.fillStyle=o.sil||mix(col,belly,.3); c.beginPath(); c.moveTo(-r*.8,0); c.quadraticCurveTo(-r*1.3,-r*.3,-r*1.25,r*.1); c.quadraticCurveTo(-r*1.2,r*.4,-r*.8,r*.2); c.fill();
  c.fillStyle=o.sil||f3Grad(c,mix(col,'#ffffff',.1),mix(col,'#a05a6a',.2),-r,r); c.beginPath(); c.moveTo(r,r*.1); c.bezierCurveTo(r*1.05,-r*.9,-r*.3,-r*.95,-r*.85,-r*.1); c.quadraticCurveTo(-r*.9,r*.6,-r*.1,r*.75); c.quadraticCurveTo(r*.6,r*.95,r,r*.1); c.fill();
  if(!o.sil){ c.fillStyle=mix(col,'#e08a9a',.3); c.beginPath(); c.ellipse(r*.95,r*.18,r*.18,r*.28,.2,0,7); c.fill(); c.strokeStyle='#5a2a3a'; c.lineWidth=Math.max(.8,r*.05); c.beginPath(); c.arc(r*.72,r*.6,r*.2,Math.PI*1.15,Math.PI*1.85); c.stroke();
    c.fillStyle='rgba(255,255,255,.25)'; c.beginPath(); c.ellipse(r*.1,-r*.5,r*.4,r*.14,-.2,0,7); c.fill(); }
  f3Eye(c,r*.55,-r*.18,Math.max(1.2,r*.08),o,d); }

function f3Axolotl(c,sp,d,L,col,belly,o,wag){ const s=L*.5; const leg=(x,y,a)=>{ c.save(); c.translate(x,y); c.rotate(a+Math.sin(wag+x)*.25); c.fillStyle=o.sil||col; c.beginPath(); c.ellipse(0,s*.08,s*.04,s*.1,0,0,7); c.fill(); c.restore(); };
  leg(s*.35,s*.12,.4); leg(-s*.15,s*.12,-.3);
  c.fillStyle=o.sil||mix(col,belly,.2); c.beginPath(); c.moveTo(-s*.35,-s*.05); c.quadraticCurveTo(-s*.75,-s*.2+Math.sin(wag)*s*.05,-s*.95,Math.sin(wag*1.2)*s*.08); c.quadraticCurveTo(-s*.7,s*.12,-s*.35,s*.1); c.fill();
  c.fillStyle=o.sil||col; c.beginPath(); c.ellipse(0,0,s*.45,s*.13,0,0,7); c.fill(); c.beginPath(); c.ellipse(s*.48,-s*.02,s*.2,s*.17,0,0,7); c.fill();
  if(!o.sil){ for(const sd of [-1,0,1]){ c.save(); c.translate(s*.36,-s*.12); c.rotate(-1.9+sd*.45+Math.sin(wag*2+sd)*.1); c.fillStyle='#e8507a'; c.beginPath(); c.ellipse(s*.12,0,s*.13,s*.035,0,0,7); c.fill(); c.fillStyle='#f07a9a'; for(let k=0;k<3;k++){ c.beginPath(); c.ellipse(s*(.06+k*.06),-s*.03,s*.025,s*.015,-.5,0,7); c.fill(); } c.restore(); }
    c.fillStyle=v3rgba(belly,.7); c.beginPath(); c.ellipse(0,s*.06,s*.4,s*.05,0,0,7); c.fill(); c.strokeStyle='#5a2a3a'; c.lineWidth=Math.max(.7,s*.015); c.beginPath(); c.arc(s*.55,s*.02,s*.1,.2,1.2); c.stroke(); }
  leg(s*.3,s*.12,.1); leg(-s*.2,s*.12,-.1);
  f3Eye(c,s*.56,-s*.07,Math.max(1.1,s*.035),o,d); }

function f3Tadpole(c,sp,d,L,col,belly,o,wag){ const r=L*.24; const ga=d.clear&&!o.sil?.7:1, a0=c.globalAlpha; c.globalAlpha=a0*ga;
  c.fillStyle=o.sil||mix(col,belly,.3); c.beginPath(); c.moveTo(-r*.6,-r*.3); for(let i=0;i<=10;i++){ const u=i/10; c.lineTo(-r*.6-u*L*.5,-r*.35*(1-u)+Math.sin(wag-u*4)*r*.4*u); } for(let i=10;i>=0;i--){ const u=i/10; c.lineTo(-r*.6-u*L*.5,r*.35*(1-u)+Math.sin(wag-u*4)*r*.4*u); } c.closePath(); c.fill();
  c.fillStyle=o.sil||f3Grad(c,mix(col,'#000000',.2),col,-r,r); c.beginPath(); c.ellipse(0,0,r*1.05,r*.85,0,0,7); c.fill();
  if(!o.sil){ c.fillStyle=f3Grad(c,v3rgba(belly,0),belly,0,r*.8); c.beginPath(); c.ellipse(0,r*.2,r,r*.6,0,0,Math.PI); c.fill(); c.fillStyle='rgba(255,255,255,.2)'; c.beginPath(); c.ellipse(-r*.1,-r*.45,r*.5,r*.18,0,0,7); c.fill(); }
  c.globalAlpha=a0; f3Eye(c,r*.55,-r*.25,Math.max(1.2,r*.18),o,d); }

function f3Hatchet(c,sp,d,L,col,belly,o,wag){ const s=L*.42; c.fillStyle=o.sil||mix(col,belly,.3); c.save(); c.translate(-s*.6,-s*.1); c.rotate(Math.sin(wag)*.2); c.beginPath(); c.moveTo(0,-s*.1); c.lineTo(-s*.4,-s*.35); c.lineTo(-s*.32,0); c.lineTo(-s*.4,s*.25); c.lineTo(0,s*.05); c.fill(); c.restore();
  const body=()=>{ c.beginPath(); c.moveTo(s*.6,-s*.2); c.lineTo(s*.4,-s*.4); c.lineTo(-s*.6,-s*.25); c.lineTo(-s*.6,s*.02); c.quadraticCurveTo(-s*.1,s*.75,s*.45,s*.25); c.closePath(); };
  c.fillStyle=o.sil||f3Grad(c,mix(col,'#000000',.3),mix(col,'#ffffff',.3),-s*.4,s*.5); body(); c.fill();
  if(!o.sil){ c.save(); body(); c.clip(); c.fillStyle='rgba(255,255,255,.35)'; c.fillRect(-s,-s*.05,s*2,s*.15); c.restore(); c.fillStyle='#bff8ff'; for(let i=0;i<8;i++){ c.beginPath(); c.arc(-s*.45+i*s*.12,s*.25+Math.sin(i*.6)*s*.12,Math.max(.8,s*.025),0,7); c.fill(); } }
  f3Eye(c,s*.38,-s*.18,Math.max(1.3,s*.11),o,{eye:'glow'}); }

function f3Gulper(c,sp,d,L,col,belly,o,wag){ const s=L*.5, N=12; c.strokeStyle=o.sil||col; c.lineCap='round'; c.lineWidth=Math.max(1,s*.06); c.beginPath(); for(let i=0;i<=N;i++){ const u=i/N, x=s*.2-u*s*1.3, y=Math.sin(wag-u*5)*s*.12*u; i?c.lineTo(x,y):c.moveTo(x,y); } c.stroke(); c.lineCap='butt';
  if(!o.sil){ const tx=s*.2-s*1.3, ty=Math.sin(wag-5)*s*.12; v3glow(c,tx,ty,s*.15,'rgba(255,120,160,.9)',.8); }
  c.fillStyle=o.sil||mix(col,'#000000',.2); c.beginPath(); c.moveTo(s*.15,-s*.06); c.quadraticCurveTo(s*.6,-s*.45,s*.95,-s*.2); c.lineTo(s*.5,0); c.lineTo(s*.95,s*.3); c.quadraticCurveTo(s*.6,s*.5,s*.15,s*.06); c.closePath(); c.fill();
  if(!o.sil){ c.fillStyle='#200810'; c.beginPath(); c.moveTo(s*.9,-s*.17); c.lineTo(s*.5,0); c.lineTo(s*.9,s*.27); c.quadraticCurveTo(s*.98,s*.05,s*.9,-s*.17); c.fill(); }
  f3Eye(c,s*.3,-s*.1,Math.max(1,s*.04),o,d); }

function f3Chimera(c,sp,d,L,col,belly,o,wag){ const s=L*.5; c.strokeStyle=o.sil||col; c.lineWidth=Math.max(1,s*.03); c.beginPath(); c.moveTo(-s*.35,0); c.quadraticCurveTo(-s*.7,Math.sin(wag)*s*.06,-s*1.0,Math.sin(wag*1.3)*s*.1); c.stroke();
  c.fillStyle=o.sil||mix(col,belly,.3); c.save(); c.translate(s*.2,s*.15); c.rotate(.4+Math.sin(wag*.8)*.3); c.beginPath(); c.ellipse(-s*.25,0,s*.3,s*.1,0,0,7); c.fill(); c.restore();
  c.beginPath(); c.moveTo(s*.1,-s*.22); c.lineTo(s*.05,-s*.45); c.lineTo(-s*.05,-s*.2); c.fill();
  c.fillStyle=o.sil||f3Grad(c,mix(col,'#000000',.2),belly,-s*.3,s*.3); c.beginPath(); c.moveTo(s*.55,0); c.quadraticCurveTo(s*.45,-s*.3,s*.1,-s*.24); c.quadraticCurveTo(-s*.25,-s*.15,-s*.4,0); c.quadraticCurveTo(-s*.25,s*.12,s*.1,s*.2); c.quadraticCurveTo(s*.45,s*.22,s*.55,0); c.fill();
  if(!o.sil){ c.strokeStyle='rgba(200,230,255,.5)'; c.lineWidth=.8; c.beginPath(); c.moveTo(s*.5,-s*.05); c.quadraticCurveTo(s*.1,-s*.1,-s*.35,0); c.stroke(); }
  f3Eye(c,s*.36,-s*.08,Math.max(1.4,s*.07),o,{eye:'glow'}); }

function f3Rattail(c,sp,d,L,col,belly,o,wag){ const s=L*.5; c.fillStyle=o.sil||col; c.beginPath(); c.moveTo(s*.7,0); c.quadraticCurveTo(s*.6,-s*.32,s*.2,-s*.28); c.quadraticCurveTo(-s*.4,-s*.08,-s*.95,Math.sin(wag)*s*.06); c.quadraticCurveTo(-s*.4,s*.12,s*.2,s*.24); c.quadraticCurveTo(s*.6,s*.25,s*.7,0); c.fill();
  c.fillStyle=o.sil||mix(col,belly,.3); c.beginPath(); c.moveTo(s*.2,-s*.26); c.lineTo(s*.15,-s*.5); c.lineTo(s*.05,-s*.22); c.fill(); f3Eye(c,s*.48,-s*.08,Math.max(1.4,s*.09),o,d); }

function f3Worm(c,sp,d,L,col,belly,o,wag){ const s=L*.5, N=14; c.lineCap='round'; for(let i=N;i>=0;i--){ const u=i/N, x=s*.6-u*s*1.4, y=Math.sin(wag*.6-u*4)*s*.12; c.fillStyle=o.sil||(i%2?col:mix(col,belly,.4)); c.beginPath(); c.arc(x,y,s*.08,0,7); c.fill(); }
  if(!o.sil){ c.strokeStyle='#f0d070'; c.lineWidth=Math.max(1,s*.025); for(const sd of [-1,1]){ c.beginPath(); c.moveTo(s*.65,sd*s*.03); c.quadraticCurveTo(s*.8,sd*s*.12,s*.85,sd*s*.05+Math.sin(wag*3)*s*.03); c.stroke(); } } c.lineCap='butt'; }

function f3Sculpin(c,sp,d,L,col,belly,o,wag){ const s=L*.5; f3Tail(c,L,s*.25,{tail:'round',tailK:1},o.sil||mix(col,belly,.3),wag);
  c.fillStyle=o.sil||mix(col,belly,.3); c.save(); c.translate(s*.35,s*.15); c.rotate(.4+Math.sin(wag)*.2); c.beginPath(); c.ellipse(-s*.2,0,s*.3,s*.18,0,0,7); c.fill(); c.restore();
  c.beginPath(); c.moveTo(-s*.4,-s*.2); c.quadraticCurveTo(0,-s*.55,s*.3,-s*.3); c.fill();
  c.fillStyle=o.sil||f3Grad(c,mix(col,'#000000',.25),col,-s*.4,s*.3); c.beginPath(); c.moveTo(s*.95,s*.05); c.quadraticCurveTo(s*.9,-s*.45,s*.4,-s*.4); c.quadraticCurveTo(-s*.2,-s*.25,-s*.62,-s*.08); c.lineTo(-s*.62,s*.08); c.quadraticCurveTo(-s*.1,s*.3,s*.4,s*.3); c.quadraticCurveTo(s*.9,s*.3,s*.95,s*.05); c.fill();
  if(!o.sil){ c.fillStyle=v3rgba(mix(col,'#000000',.5),.4); const r=v3rng(fish3Hash(sp.id)); for(let i=0;i<8;i++){ c.beginPath(); c.ellipse(-s*.4+r()*s*1.1,-s*.25+r()*s*.4,s*.08,s*.05,r()*3,0,7); c.fill(); } c.strokeStyle=v3rgba(mix(col,'#000000',.6),.6); c.lineWidth=Math.max(.8,s*.03); c.beginPath(); c.moveTo(s*.95,s*.08); c.quadraticCurveTo(s*.75,s*.22,s*.55,s*.18); c.stroke(); }
  f3Eye(c,s*.65,-s*.28,Math.max(1.3,s*.08),o,d); }

function f3Flat(c,sp,d,L,col,belly,o,wag){ const w=L*.42, h=L*.24, fl=Math.sin(wag)*.06;
  c.fillStyle=o.sil||mix(col,belly,.2); c.save(); c.translate(-w*.95,0); c.rotate(Math.sin(wag)*.2); c.beginPath(); c.moveTo(0,-h*.2); c.quadraticCurveTo(-w*.3,-h*.55,-w*.25,0); c.quadraticCurveTo(-w*.3,h*.55,0,h*.2); c.fill(); c.restore();
  c.beginPath(); c.ellipse(-w*.05,0,w*.95,h*(1.18+fl),0,0,7); c.fill();
  c.fillStyle=o.sil||col; c.beginPath(); c.ellipse(0,0,w*.85,h,0,0,7); c.fill();
  if(!o.sil){ c.fillStyle=v3rgba(mix(col,'#000000',.4),.35); const r=v3rng(fish3Hash(sp.id)); for(let i=0;i<14;i++){ c.beginPath(); c.arc(-w*.7+r()*w*1.4,-h*.8+r()*h*1.6,Math.max(.8,L*.015),0,7); c.fill(); } c.fillStyle='rgba(255,255,255,.15)'; c.beginPath(); c.ellipse(-w*.1,-h*.5,w*.5,h*.2,0,0,7); c.fill();
    c.strokeStyle=v3rgba(mix(col,'#000000',.5),.4); c.lineWidth=Math.max(.6,L*.006); c.beginPath(); c.moveTo(w*.75,-h*.2); c.quadraticCurveTo(w*.4,0,-w*.6,0); c.stroke(); }
  f3Eye(c,w*.6,-h*.45,Math.max(1.2,L*.026),o,d); f3Eye(c,w*.68,-h*.12,Math.max(1.2,L*.026),o,d); }

function f3Star(c,sp,d,L,col,belly,o,wag,t){ const r=L*.32; v3glow(c,0,0,r*2.2,'rgba(255,240,170,.9)',o.sil?0:.6+.2*Math.sin(t*2));
  c.fillStyle=o.sil||'#fff4c0'; c.save(); c.rotate(Math.sin(t*.5)*.2); c.beginPath(); for(let i=0;i<5;i++){ const a=i/5*Math.PI*2-Math.PI/2; c.lineTo(Math.cos(a)*r,Math.sin(a)*r); c.lineTo(Math.cos(a+.63)*r*.45,Math.sin(a+.63)*r*.45); } c.closePath(); c.fill(); c.restore();
  f3Eye(c,-r*.18,-r*.05,Math.max(1.2,r*.1),o,d); f3Eye(c,r*.18,-r*.05,Math.max(1.2,r*.1),o,d); if(!o.sil){ c.strokeStyle='#8a5a20'; c.lineWidth=Math.max(.8,r*.04); c.beginPath(); c.arc(0,r*.08,r*.12,.3,2.8); c.stroke(); } }

// ---------- invertebrates ----------
// jellyfish: a translucent bell that pulses, frilly oral arms, long trailing tentacles, an inner glow
function f3Jelly(c,sp,d,L,col,belly,o,wag,t){ const r=L*.27, p=1+.08*Math.sin(t*2.2+L), a0=c.globalAlpha;
  if(!o.sil) v3glow(c,0,-r*.2,r*2.2,v3rgba(mix(col,'#ffffff',.3),.7),.2+.1*Math.sin(t*2.2));
  c.strokeStyle=o.sil||v3rgba(belly,.6); c.lineWidth=Math.max(.7,L*.008); for(let i=0;i<9;i++){ const xx=-r*.85+i*r*.21; c.beginPath(); c.moveTo(xx,0); c.bezierCurveTo(xx+Math.sin(t*1.4+i)*r*.3,r*.9,xx-Math.sin(t*1.1+i)*r*.3,r*1.6,xx+Math.sin(t*.9+i*2)*r*.2,r*2.4); c.stroke(); }
  c.fillStyle=o.sil||v3rgba(mix(col,belly,.4),.75); for(let i=0;i<4;i++){ const xx=-r*.35+i*r*.23; c.beginPath(); c.moveTo(xx-r*.06,0); c.bezierCurveTo(xx-r*.2+Math.sin(t*1.8+i)*r*.1,r*.6,xx+r*.15,r*.9,xx+Math.sin(t+i)*r*.12,r*1.3); c.bezierCurveTo(xx+r*.2,r*.8,xx+r*.1,r*.4,xx+r*.06,0); c.fill(); }
  const bell=()=>{ c.beginPath(); c.moveTo(-r*p,0); c.bezierCurveTo(-r*p,-r*1.25/p,r*p,-r*1.25/p,r*p,0); for(let i=8;i>=0;i--){ const xx=-r*p+i*r*p*2/8; c.quadraticCurveTo(xx+r*p*.125,r*.14,xx,0); } c.closePath(); };
  c.globalAlpha=a0*(o.sil?1:.82); c.fillStyle=o.sil||f3Grad(c,mix(col,'#ffffff',.35),col,-r,r*.1); bell(); c.fill(); c.globalAlpha=a0;
  if(!o.sil){ c.fillStyle=v3rgba(belly,.55); c.beginPath(); for(let i=0;i<4;i++){ const a=Math.PI+.4+i*.55; c.moveTo(0,-r*.35); c.ellipse(Math.cos(a)*r*.35,-r*.35+Math.sin(a)*r*.25,r*.13,r*.08,a,0,7); } c.fill();
    if(d.cosmic){ c.fillStyle='rgba(255,255,255,.9)'; const rr=v3rng(fish3Hash(sp.id)); for(let i=0;i<9;i++) c.fillRect(-r*.7+rr()*r*1.4,-r*.9+rr()*r*.8,1.2,1.2); }
    c.fillStyle='rgba(255,255,255,.35)'; c.beginPath(); c.ellipse(-r*.35,-r*.65,r*.28,r*.1,-.5,0,7); c.fill(); } }
// squid: a torpedo mantle with fins at the back, big eye, eight arms and two long feeding tentacles trailing behind
function f3Squid(c,sp,d,L,col,belly,o,wag,t){ const s=L*.5, a0=c.globalAlpha; if(d.clear&&!o.sil) c.globalAlpha=a0*.7;
  c.strokeStyle=o.sil||mix(col,belly,.2); c.lineCap='round'; for(let i=0;i<8;i++){ const yy=(i-3.5)*s*.035; c.lineWidth=Math.max(1,s*.04*(1-i%2*.3)); c.beginPath(); c.moveTo(-s*.15,yy); c.quadraticCurveTo(-s*.45,yy*1.6+Math.sin(wag+i)*s*.05,-s*.7,yy*2.4+Math.sin(wag*1.2+i)*s*.08); c.stroke(); }
  c.lineWidth=Math.max(.8,s*.025); for(const sd of [-1,1]){ c.beginPath(); c.moveTo(-s*.15,sd*s*.03); c.bezierCurveTo(-s*.6,sd*s*.1,-s*.8,sd*s*.02+Math.sin(wag)*s*.06,-s*1.0,sd*s*.12); c.stroke(); c.fillStyle=o.sil||col; c.beginPath(); c.ellipse(-s*1.0,sd*s*.12,s*.06,s*.03,0,0,7); c.fill(); } c.lineCap='butt';
  c.fillStyle=o.sil||mix(col,'#000000',.1); for(const sd of [-1,1]){ c.beginPath(); c.moveTo(s*.55,0); c.quadraticCurveTo(s*.7,sd*s*.22+Math.sin(wag*2)*sd*s*.04,s*.85,0); c.fill(); }
  const body=()=>{ c.beginPath(); c.moveTo(s*.9,0); c.quadraticCurveTo(s*.7,-s*.17,s*.1,-s*.15); c.quadraticCurveTo(-s*.12,-s*.13,-s*.15,0); c.quadraticCurveTo(-s*.12,s*.13,s*.1,s*.15); c.quadraticCurveTo(s*.7,s*.17,s*.9,0); c.closePath(); };
  c.fillStyle=o.sil||f3Grad(c,mix(col,'#000000',.15),belly,-s*.17,s*.17); body(); c.fill();
  if(!o.sil){ c.save(); body(); c.clip(); c.fillStyle=v3rgba(mix(col,'#000000',.4),.35); const rr=v3rng(fish3Hash(sp.id)); for(let i=0;i<16;i++){ c.beginPath(); c.arc(rr()*s*.9,-s*.15+rr()*s*.3,Math.max(.6,s*.015*(.5+rr())),0,7); c.fill(); }
    if(d.glow||d.cosmic){ c.fillStyle='rgba(140,220,255,.9)'; for(let i=0;i<10;i++){ c.beginPath(); c.arc(s*.1+i*s*.07,s*.08*Math.sin(i),Math.max(.8,s*.015),0,7); c.fill(); } }
    c.fillStyle='rgba(255,255,255,.2)'; c.beginPath(); c.ellipse(s*.45,-s*.09,s*.35,s*.04,0,0,7); c.fill(); c.restore(); }
  c.globalAlpha=a0; f3Eye(c,-s*.02,-s*.04,Math.max(1.3,s*.07),o,d); }
// octopus: a round mantle above, eight curling arms with suckers below
function f3Octopus(c,sp,d,L,col,belly,o,wag,t){ const s=L*.42, dumbo=sp.id==='dumbo';
  c.lineCap='round'; for(let i=0;i<8;i++){ const a=Math.PI*.15+i/7*Math.PI*.7, bx=Math.cos(a)*s*.35, by=s*.15; c.strokeStyle=o.sil||(i%2?col:mix(col,'#000000',.12)); c.lineWidth=Math.max(1.2,s*.11);
    const ex=Math.cos(a)*s*1.05+Math.sin(t*1.3+i)*s*.08, ey=s*.75+Math.sin(t*1.7+i*1.3)*s*.1; c.beginPath(); c.moveTo(bx,by); c.quadraticCurveTo(Math.cos(a)*s*.8,s*.45,ex,ey); c.stroke();
    c.lineWidth=Math.max(.8,s*.05); c.beginPath(); c.arc(ex+Math.cos(a)*s*.06,ey-s*.05,s*.07,0,Math.PI*1.4); c.stroke(); }
  c.lineCap='butt'; if(!o.sil){ c.fillStyle=v3rgba(belly,.8); for(let i=0;i<8;i++){ const a=Math.PI*.15+i/7*Math.PI*.7; for(let k=1;k<4;k++){ c.beginPath(); c.arc(Math.cos(a)*s*(.4+k*.16),s*(.2+k*.15),Math.max(.6,s*.025),0,7); c.fill(); } } }
  if(dumbo){ c.fillStyle=o.sil||mix(col,belly,.3); for(const sd of [-1,1]){ c.save(); c.translate(sd*s*.45,-s*.45); c.rotate(sd*(.6+Math.sin(t*2)*.3)); c.beginPath(); c.ellipse(sd*s*.15,0,s*.22,s*.12,0,0,7); c.fill(); c.restore(); } }
  c.fillStyle=o.sil||f3Grad(c,mix(col,'#ffffff',.1),mix(col,'#000000',.15),-s*.9,s*.2); c.beginPath(); c.ellipse(0,-s*.3,s*.5,s*.6,0,0,7); c.fill();
  if(!o.sil){ c.fillStyle=v3rgba(mix(col,'#000000',.35),.35); const rr=v3rng(fish3Hash(sp.id)); for(let i=0;i<8;i++){ c.beginPath(); c.arc(-s*.35+rr()*s*.7,-s*.75+rr()*s*.6,Math.max(.7,s*.03),0,7); c.fill(); } c.fillStyle='rgba(255,255,255,.22)'; c.beginPath(); c.ellipse(-s*.15,-s*.6,s*.2,s*.12,-.4,0,7); c.fill();
    if(sp.id==='mimic'){ c.save(); c.beginPath(); c.ellipse(0,-s*.3,s*.5,s*.6,0,0,7); c.clip(); c.fillStyle='rgba(250,245,235,.75)'; for(let k=0;k<4;k++) c.fillRect(-s*.5,-s*.75+k*s*.25,s,s*.07); c.restore(); } }
  const telescope=sp.id==='telescope'; f3Eye(c,-s*.2,-s*.05,Math.max(1.3,s*(telescope?.12:.08)),o,d); f3Eye(c,s*.2,-s*.05,Math.max(1.3,s*(telescope?.12:.08)),o,d); }
// crabs and friends seen from the front or side: shell, legs, claws, stalk eyes
function f3Crab(c,sp,d,L,col,belly,o,wag,t){ const s=L*.42, kind=d.plan, leg=o.sil||mix(col,'#000000',.15);
  if(kind==='lobster'||kind==='shrimp'||kind==='krill'){ const n=kind==='krill'?3:1, sc=kind==='krill'?.45:1;
    for(let k=0;k<n;k++){ c.save(); if(n>1) c.translate((k-1)*s*.5,(k%2?-1:1)*s*.25); c.scale(sc,sc);
      c.strokeStyle=leg; c.lineWidth=Math.max(.8,s*.025); for(let i=0;i<5;i++){ c.beginPath(); c.moveTo(s*(.1-i*.12),s*.1); c.lineTo(s*(.05-i*.12),s*.3+Math.sin(wag+i)*s*.04); c.stroke(); }
      c.beginPath(); c.moveTo(s*.55,-s*.05); c.quadraticCurveTo(s*1.0,-s*.5,s*1.2,-s*.3); c.moveTo(s*.55,-s*.02); c.quadraticCurveTo(s*.9,-s*.2,s*1.15,-s*.05); c.stroke();
      c.fillStyle=o.sil||col; for(let i=0;i<6;i++){ const xx=-s*.15-i*s*.13, ww=s*(.13-i*.012); c.beginPath(); c.ellipse(xx,0,ww,s*(.17-i*.018),0,0,7); c.fill(); if(!o.sil){ c.fillStyle=v3rgba(mix(col,'#000000',.3),.4); c.fillRect(xx+ww*.6,-s*.15,1,s*.3); c.fillStyle=col; } }
      c.beginPath(); c.moveTo(-s*.9,0); c.lineTo(-s*1.12,-s*.18); c.lineTo(-s*1.12,s*.18); c.closePath(); c.fill();
      c.fillStyle=o.sil||f3Grad(c,mix(col,'#ffffff',.1),mix(col,'#000000',.15),-s*.2,s*.2); c.beginPath(); c.ellipse(s*.25,0,s*.38,s*.2,0,0,7); c.fill(); c.beginPath(); c.moveTo(s*.6,-s*.05); c.lineTo(s*.8,0); c.lineTo(s*.6,s*.05); c.fill();
      if(kind==='lobster'||kind==='shrimp'){ c.fillStyle=o.sil||col; for(const sd of [-1,1]){ c.save(); c.translate(s*.45,sd*s*.12); c.rotate(sd*.3+Math.sin(wag*.5)*.1*sd); c.fillRect(0,-s*.03,s*.3,s*.06); c.beginPath(); c.ellipse(s*.45,0,s*.18,s*.1*(kind==='shrimp'?.7:1),0,0,7); c.fill(); if(!o.sil){ c.strokeStyle=mix(col,'#000000',.35); c.lineWidth=1; c.beginPath(); c.moveTo(s*.45,0); c.lineTo(s*.62,0); c.stroke(); } c.restore(); } }
      if(!o.sil){ c.fillStyle='rgba(255,255,255,.25)'; c.beginPath(); c.ellipse(s*.2,-s*.1,s*.25,s*.05,0,0,7); c.fill(); if(kind==='shrimp'){ c.fillStyle='#3af0a0'; for(let i=0;i<4;i++) c.fillRect(-s*.2-i*s*.13,-s*.12,s*.05,s*.04); } }
      f3Eye(c,s*.48,-s*.12,Math.max(1,s*.05),o,d); c.restore(); } return; }
  if(kind==='isopod'){ c.strokeStyle=leg; c.lineWidth=Math.max(.8,s*.03); for(let i=0;i<7;i++){ c.beginPath(); c.moveTo(s*(.5-i*.15),s*.15); c.lineTo(s*(.45-i*.15),s*.32+Math.sin(wag+i)*s*.03); c.stroke(); }
    c.beginPath(); c.moveTo(s*.75,-s*.05); c.quadraticCurveTo(s*1.0,-s*.3,s*1.05,-s*.15); c.stroke();
    c.fillStyle=o.sil||col; c.beginPath(); c.moveTo(s*.8,s*.15); c.quadraticCurveTo(s*.8,-s*.4,0,-s*.42); c.quadraticCurveTo(-s*.8,-s*.4,-s*.85,s*.15); c.closePath(); c.fill();
    if(!o.sil){ c.strokeStyle=v3rgba(mix(col,'#000000',.35),.6); c.lineWidth=Math.max(.7,s*.02); for(let i=1;i<8;i++){ const xx=s*.8-i*s*.2; c.beginPath(); c.moveTo(xx,s*.14); c.quadraticCurveTo(xx+s*.03,-s*.2,xx-s*.02,-s*.38); c.stroke(); } c.fillStyle='rgba(255,255,255,.22)'; c.beginPath(); c.ellipse(0,-s*.3,s*.6,s*.06,0,0,7); c.fill(); }
    f3Eye(c,s*.62,-s*.12,Math.max(1,s*.05),o,d); return; }
  // crab, front view
  c.strokeStyle=leg; c.lineCap='round'; c.lineWidth=Math.max(1,s*.06);
  for(const sd of [-1,1]) for(let i=0;i<4;i++){ const bx=sd*s*.45, by=s*(.0+i*.08); c.beginPath(); c.moveTo(bx,by); c.lineTo(sd*s*(.85+i*.08),by-s*.12+Math.sin(wag+i)*s*.04); c.lineTo(sd*s*(1.0+i*.08),by+s*.25); c.stroke(); }
  for(const sd of [-1,1]){ c.beginPath(); c.moveTo(sd*s*.4,-s*.15); c.lineTo(sd*s*.7,-s*.45); c.stroke(); c.save(); c.translate(sd*s*.78,-s*.58); c.rotate(sd*(-.4)+Math.sin(t*2+sd)*.12); c.fillStyle=o.sil||col; c.beginPath(); c.ellipse(0,0,s*.22,s*.17,0,0,7); c.fill(); c.fillStyle=o.sil||mix(col,'#000000',.2); c.beginPath(); c.moveTo(sd*s*.05,-s*.15); c.lineTo(sd*s*.12,-s*.38); c.lineTo(-sd*s*.06,-s*.16); c.fill(); if(!o.sil){ c.fillStyle='rgba(255,255,255,.25)'; c.beginPath(); c.ellipse(-sd*s*.05,-s*.06,s*.08,s*.04,0,0,7); c.fill(); } c.restore(); }
  c.lineCap='butt'; c.fillStyle=o.sil||f3Grad(c,mix(col,'#ffffff',.1),mix(col,'#000000',.2),-s*.4,s*.3); c.beginPath(); c.moveTo(-s*.62,-s*.05); c.quadraticCurveTo(-s*.55,-s*.45,0,-s*.42); c.quadraticCurveTo(s*.55,-s*.45,s*.62,-s*.05); c.quadraticCurveTo(s*.4,s*.32,0,s*.3); c.quadraticCurveTo(-s*.4,s*.32,-s*.62,-s*.05); c.fill();
  if(!o.sil){ c.fillStyle=v3rgba(mix(col,'#000000',.35),.3); const rr=v3rng(fish3Hash(sp.id)); for(let i=0;i<7;i++){ c.beginPath(); c.arc(-s*.4+rr()*s*.8,-s*.32+rr()*s*.4,Math.max(.7,s*.035),0,7); c.fill(); }
    if(sp.id==='yeticrab'){ c.strokeStyle='rgba(255,255,255,.8)'; c.lineWidth=Math.max(.6,s*.02); for(const sd of [-1,1]) for(let i=0;i<6;i++){ c.beginPath(); c.moveTo(sd*s*.78,-s*.5+i*s*.03); c.lineTo(sd*s*(.95+i*.02),-s*.42+i*s*.04); c.stroke(); } }
    if(sp.id==='steamcrab'){ for(let i=0;i<3;i++){ const k=((t*.5+i/3)%1); c.fillStyle='rgba(255,255,255,'+(.4*(1-k))+')'; c.beginPath(); c.arc(-s*.2+i*s*.2,-s*.5-k*s*.5,s*(.06+k*.1),0,7); c.fill(); } }
    if(d.cosmic){ c.fillStyle='rgba(255,255,255,.9)'; for(let i=0;i<8;i++) c.fillRect(-s*.4+((i*37)%80)/100*s,-s*.35+((i*53)%50)/100*s*.5,1.2,1.2); }
    c.fillStyle='rgba(255,255,255,.2)'; c.beginPath(); c.ellipse(-s*.15,-s*.3,s*.25,s*.07,-.1,0,7); c.fill(); }
  for(const sd of [-1,1]){ c.strokeStyle=leg; c.lineWidth=Math.max(.8,s*.035); c.beginPath(); c.moveTo(sd*s*.12,-s*.38); c.lineTo(sd*s*.16,-s*.55); c.stroke(); f3Eye(c,sd*s*.16,-s*.58,Math.max(1.1,s*.06),o,d); }
  if(!o.sil){ c.strokeStyle=v3rgba(mix(col,'#000000',.5),.7); c.lineWidth=Math.max(.7,s*.025); c.beginPath(); c.arc(0,-s*.15,s*.08,.3,2.8); c.stroke(); } }

// ---------- entry point: returns true when it drew the creature ----------
function drawCreature3(c,sp,x,y,L,o={}){
  const d=fishDesign(sp); let col=sp.col, belly=sp.belly; if(o.shiny){ col=mix(col,'#ffd36a',.45); belly=mix(belly,'#fff6d6',.5); } if(o.sil){ col=belly=o.sil; }
  const wag=o.wag||0, t=performance.now()/1000, plan=d.plan;
  if(/^(jelly|squid|octopus|crab|lobster|isopod|krill|shrimp)$/.test(plan)){ c.save(); c.translate(x,y); if(o.flip) c.scale(-1,1);
    if(plan==='jelly') f3Jelly(c,sp,d,L,col,belly,o,wag,t); else if(plan==='squid') f3Squid(c,sp,d,L,col,belly,o,wag,t); else if(plan==='octopus') f3Octopus(c,sp,d,L,col,belly,o,wag,t); else f3Crab(c,sp,d,L,col,belly,o,wag,t);
    c.restore(); return true; }
  const meme=!o.sil && typeof MEME_X!=='undefined' && MEME_X[sp.id];
  if(meme) memeBehind(c,sp,x,y,L,o);
  c.save(); c.translate(x,y); if(o.flip) c.scale(-1,1);
  if(plan==='eel'||plan==='worm'&&false) f3Eel(c,sp,d,L,col,belly,o,wag);
  else if(plan==='worm') f3Worm(c,sp,d,L,col,belly,o,wag);
  else if(plan==='shark') f3Shark(c,sp,d,L,col,belly,o,wag);
  else if(plan==='ray') f3Ray(c,sp,d,L,col,belly,o,wag,false);
  else if(plan==='manta') f3Ray(c,sp,d,L,col,belly,o,wag,true);
  else if(plan==='ball') f3Ball(c,sp,d,L,col,belly,o,wag);
  else if(plan==='box') f3Box(c,sp,d,L,col,belly,o,wag);
  else if(plan==='horse') f3Horse(c,sp,d,L,col,belly,o,wag);
  else if(plan==='mola') f3Mola(c,sp,d,L,col,belly,o,wag);
  else if(plan==='angler') f3Angler(c,sp,d,L,col,belly,o,wag,t);
  else if(plan==='blob'||plan==='seapig') f3Blob(c,sp,d,L,col,belly,o,wag);
  else if(plan==='axolotl') f3Axolotl(c,sp,d,L,col,belly,o,wag);
  else if(plan==='tadpole') f3Tadpole(c,sp,d,L,col,belly,o,wag);
  else if(plan==='hatchet') f3Hatchet(c,sp,d,L,col,belly,o,wag);
  else if(plan==='gulper') f3Gulper(c,sp,d,L,col,belly,o,wag);
  else if(plan==='chimera') f3Chimera(c,sp,d,L,col,belly,o,wag);
  else if(plan==='rattail') f3Rattail(c,sp,d,L,col,belly,o,wag);
  else if(plan==='sculpin') f3Sculpin(c,sp,d,L,col,belly,o,wag);
  else if(plan==='flat') f3Flat(c,sp,d,L,col,belly,o,wag);
  else if(plan==='star') f3Star(c,sp,d,L,col,belly,o,wag,t);
  else {
    const dd=Object.assign({},d); if(plan==='koi'||plan==='carp'||plan==='goldfish'){ dd.plan=plan==='goldfish'?'deep':'fusi'; if(plan==='koi'||plan==='goldfish') dd.tail='fan'; if(!dd.barbel&&plan!=='goldfish') dd.barbel='short'; if(plan==='carp'&&dd.pat==='none') dd.pat='scales'; }
    if(plan==='bill'){ dd.plan='fusi'; dd.tail='lunate'; }
    if(plan==='tuna'||plan==='mahi'){ dd.tail='lunate'; }
    if(plan==='grouper'){ dd.tail='round'; dd.mouth='big'; dd.dorsal=dd.dorsal==='round'?'spiny':dd.dorsal; }
    if(plan==='blenny'){ dd.plan='fusi'; dd.eye='big'; dd.tail='round'; dd.dorsal='long'; }
    if(plan==='guppy'){ dd.plan='fusi'; dd.tail='fan'; }
    if(plan==='disc'){ dd.tail=dd.tail==='fork'?'square':dd.tail; }
    if(plan==='bill'&&!o.sil){ const hh=L*dd.h*.5, bl=d.bill==='sword'?L*.45:d.bill==='short'?L*.15:L*.3; c.fillStyle=mix(col,'#000000',.2); c.beginPath(); c.moveTo(L*.44,-hh*.12); c.lineTo(L*.46+bl,-hh*.03); c.lineTo(L*.44,hh*.08); c.closePath(); c.fill(); }
    else if(plan==='bill'){ const hh=L*dd.h*.5; c.fillStyle=o.sil; c.beginPath(); c.moveTo(L*.44,-hh*.12); c.lineTo(L*.76,-hh*.03); c.lineTo(L*.44,hh*.08); c.closePath(); c.fill(); }
    if(d.snout==='paddle'||d.snout==='sturgeon'||d.snout==='needle'||d.snout==='gar'){ const hh=L*dd.h*.5; c.fillStyle=o.sil||mix(col,'#000000',.15); c.beginPath();
      if(d.snout==='paddle'){ c.moveTo(L*.44,-hh*.15); c.quadraticCurveTo(L*.6,-hh*.5,L*.82,-hh*.35); c.quadraticCurveTo(L*.84,-hh*.1,L*.82,hh*.0); c.quadraticCurveTo(L*.6,hh*.1,L*.44,hh*.12); }
      else if(d.snout==='sturgeon'){ c.moveTo(L*.44,-hh*.25); c.quadraticCurveTo(L*.58,-hh*.2,L*.62,hh*.05); c.lineTo(L*.44,hh*.15); }
      else { const ln=d.snout==='needle'?L*.26:L*.2; c.moveTo(L*.46,-hh*.08); c.lineTo(L*.48+ln,-hh*.01); c.lineTo(L*.48+ln,hh*.04); c.lineTo(L*.46,hh*.1); }
      c.closePath(); c.fill(); if(d.snout==='sturgeon'&&!o.sil){ c.strokeStyle=mix(col,'#000000',.4); c.lineWidth=Math.max(.6,L*.006); c.beginPath(); for(let k=0;k<4;k++){ c.moveTo(L*(.5+k*.025),hh*.05); c.lineTo(L*(.5+k*.025),hh*.3); } c.stroke(); } }
    drawFishBody3(c,sp,dd,L,col,belly,o,wag);
    // catfish: broad flat head, wide mouth and long sweeping whiskers (also in the shadow, so they read under water)
    if(d.barbel==='cat'){ const hh=L*dd.h*.5, hc=o.sil||mix(col,'#000000',.12); c.fillStyle=hc; c.beginPath(); c.moveTo(L*.18,-hh*.72); c.quadraticCurveTo(L*.44,-hh*.78,L*.5,-hh*.05); c.quadraticCurveTo(L*.5,hh*.5,L*.2,hh*.7); c.closePath(); c.fill();
      if(!o.sil){ c.fillStyle=v3rgba(mix(col,'#000000',.4),.35); c.beginPath(); c.ellipse(L*.32,-hh*.42,L*.13,hh*.26,0,0,7); c.fill(); c.strokeStyle=v3rgba(mix(col,'#000000',.6),.7); c.lineWidth=Math.max(.8,L*.012); c.beginPath(); c.moveTo(L*.5,hh*.0); c.quadraticCurveTo(L*.45,hh*.22,L*.36,hh*.2); c.stroke(); }
      c.strokeStyle=o.sil||mix(col,'#000000',.35); c.lineCap='round'; c.lineWidth=Math.max(.8,L*.011); c.beginPath(); const sw=Math.sin(wag*.7)*L*.015;
      c.moveTo(L*.48,-hh*.06); c.bezierCurveTo(L*.56,-hh*.5,L*.42,-hh*.2+sw,L*.16,hh*.15+sw); c.moveTo(L*.48,hh*.0); c.bezierCurveTo(L*.6,hh*.2,L*.46,hh*.75-sw,L*.24,hh*1.05-sw); c.stroke();
      c.lineWidth=Math.max(.6,L*.007); c.beginPath(); for(const k of [0,1]){ c.moveTo(L*(.44-k*.04),hh*.42); c.quadraticCurveTo(L*(.45-k*.04),hh*.7,L*(.4-k*.05),hh*.9); } c.stroke(); c.lineCap='butt';
      if(!o.sil){ const ex=L*.37, ey=-hh*.32, er=Math.max(1.2,L*.028); c.fillStyle='#f4f0e6'; c.beginPath(); c.arc(ex,ey,er,0,7); c.fill(); c.fillStyle='#14141a'; c.beginPath(); c.arc(ex+er*.15,ey,er*.6,0,7); c.fill(); c.fillStyle='#ffffff'; c.beginPath(); c.arc(ex+er*.35,ey-er*.3,er*.22,0,7); c.fill(); } }
    // gar: diamond (ganoid) scale lattice and the dorsal and anal fins set far back by the tail
    if(d.snout==='gar'){ const hh=L*dd.h*.5, fc=o.sil||mix(col,'#000000',.25); c.fillStyle=fc; c.beginPath(); c.moveTo(-L*.24,-hh*.85); c.quadraticCurveTo(-L*.32,-hh*1.55,-L*.4,-hh*.65); c.closePath(); c.moveTo(-L*.24,hh*.85); c.quadraticCurveTo(-L*.32,hh*1.55,-L*.4,hh*.65); c.closePath(); c.fill();
      if(!o.sil){ c.save(); f3BodyPath(c,L,hh,dd); c.clip(); c.strokeStyle=v3rgba(mix(col,'#000000',.55),.35); c.lineWidth=Math.max(.5,L*.005); c.beginPath(); const st=L*.045; for(let X=-L*.6;X<L*.6;X+=st){ c.moveTo(X,-hh); c.lineTo(X+hh*2,hh); c.moveTo(X,hh); c.lineTo(X+hh*2,-hh); } c.stroke(); c.restore(); } }
    if(d.scutes&&!o.sil){ const hh=L*dd.h*.5; c.fillStyle=mix(col,'#ffffff',.3); for(let i=0;i<9;i++){ const xx=-L*.28+i*L*.075; c.beginPath(); c.moveTo(xx-L*.015,-hh*.9+Math.abs(i-4)*hh*.03); c.lineTo(xx,-hh*1.1+Math.abs(i-4)*hh*.03); c.lineTo(xx+L*.015,-hh*.9+Math.abs(i-4)*hh*.03); c.fill(); } }
    if(d.fur&&!o.sil){ const hh=L*dd.h*.5; c.strokeStyle='rgba(255,255,255,.55)'; c.lineWidth=Math.max(.6,L*.006); c.beginPath(); for(let i=0;i<18;i++){ const xx=-L*.3+i*L*.04; c.moveTo(xx,-hh*.9); c.lineTo(xx-L*.01,-hh*1.08); } c.stroke(); }
    if(d.glass&&!o.sil){ const hh=L*dd.h*.5; c.strokeStyle='rgba(255,255,255,.35)'; c.lineWidth=Math.max(.7,L*.008); c.beginPath(); c.moveTo(-L*.2,-hh*.7); c.lineTo(L*.1,hh*.4); c.moveTo(0,-hh*.8); c.lineTo(L*.2,0); c.stroke(); }
    if(d.wings&&d.plan==='fusi'&&!o.sil&&false){}
  }
  f3Aura(c,sp,d,L,o,t);
  c.restore();
  if(meme) memeExtra(c,sp,x,y,L,o);
  return true;
}

// test helper: every fish on one sheet
if(/[?&]test\b/.test(location.search)){
  window.__fishSheet=(opt={})=>{ const list=(opt.ids?opt.ids.map(i=>SP.find(s=>s.id===i)).filter(Boolean):SP.filter(s=>!opt.loc||s.loc===opt.loc)).slice(opt.from||0,opt.to||9999), cols=opt.cols||10, cw=opt.cell||110, chh=Math.round(cw*.62), rows=Math.ceil(list.length/cols);
    const cv2=document.createElement('canvas'); cv2.width=cols*cw; cv2.height=rows*chh; const x=cv2.getContext('2d'); x.fillStyle=opt.bg||'#1c3a4a'; x.fillRect(0,0,cv2.width,cv2.height);
    list.forEach((s,i)=>{ const cx=(i%cols)*cw+cw/2, cy=Math.floor(i/cols)*chh+chh*.46; x.save(); drawCreature(x,s,cx,cy,cw*(opt.scale||.62),{wag:opt.wag||0.6,sil:opt.sil,shiny:opt.shiny}); x.restore(); x.fillStyle='rgba(255,255,255,.75)'; x.font='9px sans-serif'; x.textAlign='center'; x.fillText(s.id,cx,Math.floor(i/cols)*chh+chh-3); });
    if(opt.save) __post(opt.save,cv2.toDataURL()); return [cv2.width,cv2.height,list.length]; };
}
