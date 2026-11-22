// =====================================================================
// 0.4.9 fish features for the new waters (director: "visually scan the new maps and oddities and fish ... don't overly use duplicated
// assets ... Everything should feel original"). The body is the usual fish; these features sit on top so each end-game water's fish read
// as what they are. Picked from the fish's name, then the water's own style:
//  Animal Farm: ears, horns, beaks, trunks, manes, cow spots, zebra stripes, a unicorn horn. The Buffet: cheese and pepperoni, sprinkles,
//  noodles, lettuce, whipped cream, steam. Corporate Pond: neckties, glasses, a gold coin, a stock chart. The Nile: a striped headdress,
//  eye markings, an ankh. Circuit Lake: glowing circuit lines, an antenna, LED eyes. Mount Olympus: laurels, gilded fins, lightning,
//  a trident crown. Elsewhere only where the name calls for it: fox ears (Kitsune), maple leaves, piranha fangs.
// Drawn in the fish's own space (nose to the right at +0.46 L), so they follow it everywhere it is drawn: water, cooler, Fish Log,
// aquarium. Never on shadows. Cheap: a few shapes per fish.
// =====================================================================
const TRAIT_CACHE={};
function fishTraits(sp){ if(TRAIT_CACHE[sp.id]!==undefined) return TRAIT_CACHE[sp.id]; const n=sp.name.toLowerCase(), has=(...w)=>w.some(k=>n.includes(k)), T=[];
  if(sp.loc==='farm'){
    if(has('dog','cat','bunny','hamster','mouse','fox','koala','panda','bear','squirrel','raccoon','badger','ferret','wolf','doge','tiger','monkey','gorilla','sloth','kangaroo','llama','donkey')) T.push(has('bunny','donkey','llama','kangaroo')?'longears':'ears');
    if(has('cow','goat','buffalo','sheep','rhino','camel')) T.push(has('rhino')?'nosehorn':'horns'); if(has('unicorn','noah')) T.push('unihorn');
    if(has('duck','chicken','goose','turkey','eagle','owl','penguin','flamingo','parrot')) T.push('beak'); if(has('elephant')) T.push('trunk'); if(has('horse','lion','zebra','tiger','noah')) T.push('mane');
    if(has('cow','dalmatian','giraffe','panda','noah')) T.push('spots'); if(has('zebra','tiger','raccoon','skunk','badger')) T.push('stripes'); if(has('sheep','llama')) T.push('wool'); if(has('pig')) T.push('snout'); if(has('porcupine','hedgehog')) T.push('spikes');
    if(!T.length) T.push('ears'); }
  else if(sp.loc==='buffet'){
    if(has('pizza','nacho','mac','cheese','lasagna','fondue')) T.push('cheese'); if(has('pizza','meatball')) T.push('pepperoni'); if(has('donut','cupcake','sundae','cake','churro','popcorn','wedding','sprinkle')) T.push('sprinkles');
    if(has('spaghetti','ramen','noodle','pad thai')) T.push('noodles'); if(has('taco','burrito','burger','salad','kimchi')) T.push('lettuce'); if(has('sundae','pudding','tiramisu','cheesecake','mimosa','chocolate')) T.push('cream');
    if(has('curry','gravy','soup','ramen','dumpling','dim sum','brisket','paella','fried rice','mashed')) T.push('steam'); if(has('hot dog','corn dog','sausage')) T.push('mustard'); if(has('truffle','michelin','golden')) T.push('goldleaf');
    if(!T.length) T.push('steam','drizzle'); }
  else if(sp.loc==='corporate'){ T.push('tie'); if(sp.r>=2||has('ceo','cfo','manager','keynote','analyst')) T.push('glasses'); if(has('crypto','coin','dividend','trillion','golden','parachute')) T.push('coin'); if(has('stock','market','bull','bear','quarterly','ipo','ticker','hedge')) T.push('chart'); }
  else if(sp.loc==='nile'){ if(sp.r>=1||has('pharaoh','king','ramses','tut','cleopatra','sphinx')) T.push('nemes'); T.push('kohl'); if(sp.r>=3||has('ankh','osiris','isis','ra,')) T.push('ankh'); }
  else if(sp.loc==='circuit'){ T.push('circuit'); if(sp.r>=1) T.push('antenna'); T.push('led'); }
  else if(sp.loc==='olympus'){ T.push('laurel'); if(sp.r>=2) T.push('gilded'); if(has('zeus','thor','thunder','lightning')) T.push('bolt'); if(has('poseidon','trident')) T.push('tridentcrown'); }
  else { if(has('kitsune','fox')) T.push('ears'); if(has('maple','syrup','sorry','hoser','mountie','canoe')) T.push('maple'); if(has('piranha','payara','vampire','candiru')) T.push('fangs'); if(has('dragon','ryujin')) T.push('whiskers'); }
  { const std=/^(fusi|deep|long|disc|grouper|tuna|mahi|koi|carp|goldfish|bill|blenny|guppy|)$/.test(fishDesign(sp).plan||''); if(!std) for(let i=T.length-1;i>=0;i--) if(TRAIT_EYE.has(T[i])) T.splice(i,1); } /* eye decorations only where the eye's place is known */
  return TRAIT_CACHE[sp.id]=T.length?T:null; }
/* which decorations sit on the body (cut to its outline) and which need a known eye position (only the standard body types draw their eye there) */
const TRAIT_ON=new Set(['spots','stripes','cheese','pepperoni','sprinkles','noodles','lettuce','drizzle','mustard','goldleaf','coin','chart','circuit','gilded','ankh','maple','bolt','nemes']);
const TRAIT_EYE=new Set(['kohl','led','glasses']);
const TRAIT_NOSE=new Set(['beak','nosehorn','trunk','snout','fangs','whiskers']);
/* the fish's real nose tip (its rightmost point near the middle) and its belly under the head, in body lengths, measured once per species from its silhouette */
const TRAIT_PROBE={};
function traitProbe(sp){ if(TRAIT_PROBE[sp.id]!==undefined) return TRAIT_PROBE[sp.id]; TRAIT_PROBE[sp.id]=null; try{ const S=240, M=150, cv=document.createElement('canvas'); cv.width=S; cv.height=S; const x=cv.getContext('2d',{willReadFrequently:true});
    drawCreature3(x,sp,S/2,S/2,M,{sil:'#000000',t:0,still:1}); const d=x.getImageData(0,0,S,S).data, on=(px,py)=>d[(py*S+px)*4+3]>120;
    let nose=null; for(let px=S-1;px>=S/2&&nose==null;px--) for(let py=Math.round(S/2-M*.12);py<=Math.round(S/2+M*.06);py++) if(on(px,py)){ nose=(px-S/2)/M; break; }
    const head=nose==null?.3:Math.min(.3,nose-.07), bx=Math.round(S/2+M*head); /* the head point: 30% forward, or just behind the nose on short bodies */
    let bot=null, top=null; for(let py=S-1;py>=0;py--) if(on(bx,py)){ bot=(py-S/2)/M; break; } for(let py=0;py<S;py++) if(on(bx,py)){ top=(py-S/2)/M; break; }
    /* the eye: where the pupil sits next to eye-white, from the normal drawing */ let eye=null; try{ x.clearRect(0,0,S,S); drawCreature3(x,sp,S/2,S/2,M,{t:0,still:1}); const e=x.getImageData(0,0,S,S).data, dark=(px,py)=>{ const i=(py*S+px)*4; return e[i]<45&&e[i+1]<45&&e[i+2]<50&&e[i+3]>200; }, white=(px,py)=>{ const i=(py*S+px)*4; return Math.abs(e[i]-244)<14&&Math.abs(e[i+1]-240)<14&&Math.abs(e[i+2]-230)<16&&e[i+3]>200; };
      let sx=0, sy=0, n=0; for(let py=2;py<S-2;py++) for(let px=S/2;px<S-2;px++){ if(!white(px,py)) continue; let ok=false; for(let dy=-4;dy<=4&&!ok;dy++) for(let dx=-4;dx<=4;dx++) if(dark(px+dx,py+dy)){ ok=true; break; } if(ok){ sx+=px; sy+=py; n++; } } if(n>=4) eye={x:(sx/n-S/2)/M, y:(sy/n-S/2)/M, r:Math.sqrt(n/Math.PI)/M}; }catch(e){}
    const prof=[]; for(let f=-.5;f<=.56;f+=.02){ const px=Math.round(S/2+M*f); for(let py=0;py<S;py++) if(on(px,py)){ prof.push([f,(py-S/2)/M]); break; } } /* the top outline along the body: things that sit on the back rest on it (2026-11-22) */
    TRAIT_PROBE[sp.id]={nose,bot,top,head,eye,prof}; }catch(e){} return TRAIT_PROBE[sp.id]; }
function traitTopAt(pr,f){ const p=pr&&pr.prof; if(!p||!p.length) return null; let best=p[0]; for(const q of p) if(Math.abs(q[0]-f)<Math.abs(best[0]-f)) best=q; return Math.abs(best[0]-f)<.05?best[1]:null; }const TRAIT_MASKS={}, TRAIT_OFF=document.createElement('canvas'); let TRAIT_MASKN=0;
function traitMask(sp,L){ const Lb=Math.max(12,Math.round(L/8)*8), key=sp.id+'|'+Lb; let m=TRAIT_MASKS[key]; const S=Math.ceil(L*1.9);
  if(!m){ if(++TRAIT_MASKN>400){ for(const k in TRAIT_MASKS) delete TRAIT_MASKS[k]; TRAIT_MASKN=1; } const Sb=Math.ceil(Lb*1.9); m=document.createElement('canvas'); m.width=m.height=Sb; drawCreature3(m.getContext('2d'),sp,Sb/2,Sb/2,Lb,{sil:'#000000',t:0,still:1}); TRAIT_MASKS[key]=m; }
  return {m,S}; }
function drawTraits(c0,sp,L,col,belly,t){ const T=fishTraits(sp); if(!T) return; let c=c0; const d=fishDesign(sp), hh=L*(d.h||sp.h||.35)*.5, k=L/62; const pr0=traitProbe(sp), hx=L*(pr0&&pr0.head!=null?pr0.head:.3), top=pr0&&pr0.top!=null?pr0.top*L+L*.01:-hh*.92; /* head decorations sit on the measured top of the head (2026-11-20: a fixed -0.92 floated or sank on other body shapes) */ const stdEye=/^(fusi|deep|long|disc|grouper|tuna|mahi|koi|carp|goldfish|bill|blenny|guppy|)$/.test(d.plan||''); /* features read at every size */
  const F=(cl)=>{ c.fillStyle=cl; }, S=(cl,w)=>{ c.strokeStyle=cl; c.lineWidth=Math.max(.6,w*k); c.lineCap='round'; }, E=(x,y,rx,ry,r=0)=>{ c.beginPath(); c.ellipse(x,y,rx,ry,r,0,7); c.fill(); }, P=a=>{ c.beginPath(); c.moveTo(a[0],a[1]); for(let i=2;i<a.length;i+=2) c.lineTo(a[i],a[i+1]); c.closePath(); c.fill(); };
  const dk=mix(col,'#000000',.35), lt=mix(col,'#ffffff',.4);
  const ON=T.filter(x=>TRAIT_ON.has(x)), OUT=T.filter(x=>!TRAIT_ON.has(x)&&(stdEye||!TRAIT_EYE.has(x)));
  const pr=pr0, noseDx=pr&&pr.nose!=null?pr.nose*L-L*.46:0, tieDy=pr&&pr.bot!=null?(pr.bot*L-L*.03)-hh*.4:0; /* nose and throat decorations start at the measured nose tip and belly (2026-11-20: beaks floated off short fish, ties hung loose) */
  const run=list=>{ for(const tr of list){ const nz=TRAIT_NOSE.has(tr), bz=tr==='tie'; if(nz||bz){ c.save(); c.translate(nz?noseDx:0,bz?tieDy:0); } switch(tr){
    case 'ears': F(dk); P([hx-6*k,top+2*k,hx-2*k,top-10*k,hx+3*k,top+2*k]); F(mix(dk,'#ff9aa8',.4)); P([hx-4.5*k,top+1*k,hx-2*k,top-6*k,hx+1*k,top+1*k]); break;
    case 'longears': F(dk); E(hx-4*k,top-9*k,2.6*k,9*k,-.25); F(mix(dk,'#ff9aa8',.45)); E(hx-4*k,top-9*k,1.3*k,7*k,-.25); break;
    case 'horns': F('#e8dcc0'); P([hx-3*k,top+1*k,hx-7*k,top-8*k,hx-1*k,top+1*k]); P([hx+2*k,top+1*k,hx+5*k,top-8*k,hx+4*k,top+1*k]); break;
    case 'nosehorn': F('#d8ccb0'); P([L*.4,-hh*.2,L*.5,-hh*.9,L*.44,-hh*.1]); break;
    case 'unihorn': { const g2=c.createLinearGradient(0,top-16*k,0,top); g2.addColorStop(0,'#ffd36a'); g2.addColorStop(1,'#fff6dc'); c.fillStyle=g2; P([hx-2*k,top+1*k,hx+1*k,top-16*k,hx+3*k,top+1*k]); break; }
    case 'beak': F('#f0a020'); P([L*.44,-hh*.15,L*.6,-hh*.02,L*.44,hh*.1]); break;
    case 'trunk': S(col,5); c.beginPath(); c.moveTo(L*.44,-hh*.05); c.quadraticCurveTo(L*.62,hh*.1,L*.58,hh*.6); c.stroke(); break;
    case 'mane': F(mix(col,'#5a3a1a',.6)); for(let i=0;i<6;i++) E(hx-8*k+i*2.6*k,top-1*k,2.4*k,3.6*k,-.4); break;
    case 'spots': F(i_fishDark(col)); for(let i=0;i<5;i++) E(-L*.25+i*L*.12,-hh*.2+((i*7)%3-1)*hh*.25,L*.035,L*.025,i); break;
    case 'stripes': S(mix(col,'#000000',.6),2.4); for(let i=0;i<6;i++){ const x=-L*.2+i*L*.09; c.beginPath(); c.moveTo(x,-hh*.8); c.quadraticCurveTo(x+L*.02,0,x,hh*.7); c.stroke(); } break;
    case 'wool': F('#f4f0e8'); for(let i=0;i<7;i++) E(-L*.2+i*L*.08,-hh*.7,L*.045,L*.035); break;
    case 'snout': F(mix(col,'#ff9aa8',.5)); E(L*.47,-hh*.05,L*.035,L*.045); F(dk); E(L*.48,-hh*.12,L*.006,L*.01); E(L*.48,hh*.02,L*.006,L*.01); break;
    case 'spikes': F(dk); for(let i=0;i<9;i++){ const x=-L*.24+i*L*.065; P([x,-hh*.75,x+L*.02,-hh*1.25,x+L*.04,-hh*.75]); } break;
    case 'cheese': F('#ffd03a'); P([-L*.18,-hh*.85,L*.18,-hh*.85,L*.12,-hh*.45,L*.06,-hh*.6,0,-hh*.3,-L*.06,-hh*.55,-L*.12,-hh*.4]); break;
    case 'pepperoni': F('#c8322a'); for(const [x,y] of [[-.1,-.35],[.05,-.1],[-.02,.2],[.12,-.4]]) E(L*x,hh*y,L*.04,L*.04); break;
    case 'sprinkles': { const C=['#ff5a8a','#5ac8ff','#ffd83a','#8aff6a','#c87aff']; for(let i=0;i<12;i++){ c.save(); c.translate(-L*.22+((i*37)%11)*L*.04,-hh*.7+((i*13)%5)*hh*.25); c.rotate(i*1.3); F(C[i%5]); c.fillRect(-2*k,-.6*k,4*k,1.2*k); c.restore(); } break; }
    case 'noodles': S('#f0d890',1.6); for(let i=0;i<4;i++){ c.beginPath(); c.moveTo(-L*.2,-hh*.4+i*hh*.2); c.bezierCurveTo(-L*.05,-hh*.9+i*hh*.2,L*.05,hh*.1+i*hh*.1,L*.2,-hh*.5+i*hh*.2); c.stroke(); } break;
    case 'lettuce': F('#6ac83a'); for(let i=0;i<6;i++) E(-L*.18+i*L*.07,-hh*.85,L*.04,L*.025,(i%2?.4:-.4)); break;
    case 'cream': F('#fffaf0'); for(let i=0;i<3;i++) E(-L*.05+i*L*.05,-hh*(.95+i%2*.15),L*.05,L*.035); F('#d8302a'); E(0,-hh*1.25,L*.022,L*.022); break;
    case 'steam': S('rgba(255,255,255,.55)',1.2); for(let i=0;i<3;i++){ const x=-L*.1+i*L*.1, q=(t*.6+i*.3)%1; c.globalAlpha=1-q; c.beginPath(); c.moveTo(x,-hh-2*k-q*8*k); c.quadraticCurveTo(x+3*k,-hh-6*k-q*8*k,x,-hh-10*k-q*8*k); c.stroke(); c.globalAlpha=1; } break;
    case 'drizzle': S(mix(col,'#5a2a10',.6),1.4); c.beginPath(); c.moveTo(-L*.22,-hh*.5); for(let i=1;i<8;i++) c.lineTo(-L*.22+i*L*.06,-hh*(.5+(i%2?.25:-.1))); c.stroke(); break;
    case 'mustard': S('#f8d020',1.6); c.beginPath(); c.moveTo(-L*.22,-hh*.2); for(let i=1;i<9;i++) c.lineTo(-L*.22+i*L*.05,-hh*(.2+(i%2?.2:-.2))); c.stroke(); break;
    case 'goldleaf': F('#ffd36a'); for(let i=0;i<4;i++) P([-L*.1+i*L*.06,-hh*.6,-L*.08+i*L*.06,-hh*.8,-L*.05+i*L*.06,-hh*.55]); break;
    case 'tie': F('#c8322a'); P([hx-1*k,hh*.4,hx+3*k,hh*.4,hx+2.5*k,hh*.55,hx+4*k,hh*1.25,hx+1*k,hh*1.45,hx-1.5*k,hh*1.25,hx,hh*.55]); F('#8a1a14'); P([hx-1*k,hh*.4,hx+3*k,hh*.4,hx+2*k,hh*.6,hx,hh*.6]); break;
    case 'glasses': S('#1a1a1a',1); c.beginPath(); c.arc(L*.33,-hh*.28,L*.04,0,7); c.stroke(); c.beginPath(); c.moveTo(L*.29,-hh*.3); c.lineTo(L*.2,-hh*.32); c.stroke(); break;
    case 'coin': F('#e8b830'); E(-L*.08,0,L*.05,L*.05); F('#fff0b0'); E(-L*.08,0,L*.028,L*.028); break;
    case 'chart': S('#5aff8a',1.3); c.beginPath(); c.moveTo(-L*.25,hh*.2); c.lineTo(-L*.15,0); c.lineTo(-L*.08,hh*.1); c.lineTo(0,-hh*.3); c.lineTo(L*.08,-hh*.15); c.lineTo(L*.16,-hh*.55); c.stroke(); break;
    case 'nemes': { /* the striped headcloth sits on the fish's real head outline (f3TopAt measures it per species), behind the eye; no loose side piece (2026-11-20: it floated above some body shapes like a hockey stick) */
      const xs=[.1,.145,.19,.235,.28,.32].map(f=>L*f), tops=xs.map(x=>{ const y=f3TopAt(sp,L,x/L); return y==null?-hh*.9:y+L*.012; }), band=hh*.42;
      for(let i=0;i<5;i++){ F(i%2?'#2a4ab8':'#e8c040'); P([xs[i],tops[i],xs[i+1],tops[i+1],xs[i+1]-L*.02,tops[i+1]+band,xs[i]-L*.02,tops[i]+band]); } break; }    case 'kohl': { /* eye markings around the eye, never across it (2026-11-20: the old line ran through the eye); only on the usual fish shapes, where the eye's place is known */
      if(!/^(fusi|deep|long|disc|grouper|tuna|mahi|koi|carp|goldfish|bill|blenny|guppy|)$/.test(d.plan||'')) break; /* body types that draw their own eye elsewhere get none */ const ex=L*(d.plan==='long'?.36:.33), ey=-hh*.28, er=Math.max(1.3,L*.034*(d.eyeK||1)*(d.eye==='big'||d.big?1.45:1));
      S('#14141a',1); c.beginPath(); c.moveTo(ex+er*.7,ey-er*1.25); c.quadraticCurveTo(ex-er*.4,ey-er*1.55,ex-er*1.3-L*.05,ey-er*.55); c.stroke(); c.beginPath(); c.moveTo(ex-er*.25,ey+er*1.25); c.quadraticCurveTo(ex-er*.5,ey+er*1.25+L*.03,ex-er*1.1,ey+er*1.25+L*.04); c.stroke(); break; }    case 'ankh': S('#e8c040',1.6); c.beginPath(); c.ellipse(-L*.1,-hh*.15,L*.025,L*.035,0,0,7); c.moveTo(-L*.1,-hh*.15+L*.035); c.lineTo(-L*.1,-hh*.15+L*.11); c.moveTo(-L*.14,-hh*.15+L*.05); c.lineTo(-L*.06,-hh*.15+L*.05); c.stroke(); break;
    case 'circuit': { /* each fish gets its own traces (count, height, length from its id) with a pad at the end of each, so they read as circuitry, not the same four dots on every fish (2026-11-20) */
      let h=0; for(let i=0;i<sp.id.length;i++) h=(h*31+sp.id.charCodeAt(i))>>>0; const n=2+h%3, pads=[];
      S('rgba(58,240,255,'+(.55+.25*Math.sin(t*3+sp.r))+')',1); c.beginPath();
      for(let i=0;i<n;i++){ const r1=((h>>>(i*5))&31)/31, r2=((h>>>(i*5+2))&31)/31, y=-hh*.55+hh*1.05*(i+.5)/n+(r1-.5)*hh*.12, x0=-L*(.28-r2*.08), xb=-L*(.06-r1*.1), x1=L*(.04+r2*.16), dy=(i%2?-1:1)*hh*(.06+r1*.08);
        c.moveTo(x0,y); c.lineTo(xb,y); c.lineTo(xb+L*.04,y+dy); c.lineTo(x1,y+dy); pads.push([x1,y+dy]); }
      c.stroke(); F('#3af0ff'); for(const [px,py] of pads) E(px,py,1.1*k,1.1*k); break; }    case 'antenna': S('#c8c8d0',1); c.beginPath(); c.moveTo(hx,top+2*k); c.lineTo(hx-3*k,top-10*k); c.stroke(); F(Math.sin(t*4)>0?'#ff3ab8':'#ff9ad8'); E(hx-3*k,top-10*k,1.8*k,1.8*k); break;
    case 'led': v3glow(c,L*.33,-hh*.28,L*.06,'rgba(255,58,184,.9)',.6); break;
    case 'laurel': { /* a laurel crown resting ON the back behind the eye (director, 2026-11-22: it lay across the eye and body on many Olympus
         fish, and its yellow berry read as a second eye): each leaf sits on the fish's real top outline there, pointing up and back */
      const ex=pr0&&pr0.eye?pr0.eye.x-pr0.eye.r-.05:(pr0&&pr0.head!=null?pr0.head:.3)-.08;
      for(let i=0;i<6;i++){ const f=ex-i*.035, ty=traitTopAt(pr0,f), y=(ty!=null?ty*L:top)-1.3*k; F(i%2?'#4f8f34':'#68a844'); E(f*L,y,2.4*k,1.05*k,-.75); } break; }
    case 'gilded': S('rgba(255,211,106,.85)',1.4); c.beginPath(); c.moveTo(-L*.3,-hh*.2); c.quadraticCurveTo(0,-hh*1.1,L*.3,-hh*.6); c.stroke(); break;
    case 'bolt': F('#ffe84a'); P([-L*.05,-hh*.6,L*.05,-hh*.6,0,-hh*.1,L*.07,-hh*.1,-L*.06,hh*.6,-L*.01,0,-L*.08,0]); break;
    case 'tridentcrown': F('#e8c040'); for(const dx of [-4,0,4]) P([hx+dx*k-1.2*k,top+1*k,hx+dx*k,top-(dx?6:9)*k,hx+dx*k+1.2*k,top+1*k]); c.fillRect(hx-6*k,top,12*k,1.6*k); break;
    case 'maple': F('#d8302a'); { const cx=-L*.08, cy=0, s=L*.05; P([cx,cy-s,cx+s*.25,cy-s*.4,cx+s*.8,cy-s*.6,cx+s*.5,cy,cx+s*.9,cy+s*.3,cx+s*.15,cy+s*.35,cx,cy+s,cx-s*.15,cy+s*.35,cx-s*.9,cy+s*.3,cx-s*.5,cy,cx-s*.8,cy-s*.6,cx-s*.25,cy-s*.4]); } break;
    case 'fangs': F('#ffffff'); P([L*.4,hh*.05,L*.42,hh*.35,L*.44,hh*.05]); P([L*.43,hh*.04,L*.445,hh*.28,L*.46,hh*.03]); break;
    case 'whiskers': S(mix(col,'#ffd36a',.5),.8); for(const s of [-1,1]){ c.beginPath(); c.moveTo(L*.44,hh*.05*s); c.quadraticCurveTo(L*.6,hh*.3*s,L*.68,hh*.1*s+Math.sin(t*2)*2*k); c.stroke(); } break; } if(nz||bz) c.restore(); } };
  run(OUT);
  /* body decorations are cut to the fish's own body (its still silhouette), so they never hang off a shape they were not drawn for (2026-11-20: circuit dots, Nile headdress) */
  if(ON.length){ const M=traitMask(sp,L), S=M.S; if(TRAIT_OFF.width!==S||TRAIT_OFF.height!==S){ TRAIT_OFF.width=S; TRAIT_OFF.height=S; } const o=TRAIT_OFF.getContext('2d'); o.setTransform(1,0,0,1,0,0); o.globalCompositeOperation='source-over'; o.clearRect(0,0,S,S); o.translate(S/2,S/2); c=o; run(ON); c=c0; o.setTransform(1,0,0,1,0,0); o.globalCompositeOperation='destination-in'; o.drawImage(M.m,0,0,S,S); if(pr0&&pr0.eye){ o.globalCompositeOperation='destination-out'; o.beginPath(); o.arc(S/2+pr0.eye.x*L,S/2+pr0.eye.y*L,Math.max(2,pr0.eye.r*L*1.9),0,7); o.fill(); } /* and never over the eye */ o.globalCompositeOperation='source-over'; c0.drawImage(TRAIT_OFF,-S/2,-S/2); } }
const i_fishDark = col => mix(col,'#1a1a1a',.7);
{ const _dc=drawCreature; drawCreature=function(c,sp,x,y,L,o={}){ const r=_dc.apply(this,arguments); try{ if(sp&&!o.sil&&fishTraits(sp)){ c.save(); c.translate(x,y); if(o.flip) c.scale(-1,1); drawTraits(c,sp,L,sp.col,sp.belly,performance.now()/1000); c.restore(); } }catch(e){} return r; }; }
// more body variety in the new waters: a fish that would get the plain default body gets a plan, tail and fin of its own (from its id)
{ const NEWW=new Set(WATERS_NEW.map(w=>w.id)), EGP=['fusi','deep','long','disc','grouper','tuna','mahi','ball','box','koi','goldfish','sculpin','mola','hatchet','tadpole','bill','carp','guppy'],
    NP=['fusi','deep','long','disc','grouper','tuna','koi','carp','sculpin','blenny','guppy','bill'], TAILS=['fork','round','lunate','fan','fork'], DORS=['round','long','sail','spiny','trail','trigger','round'];
  for(const sp of SP){ if(!NEWW.has(sp.loc)||sp.shape!=='f') continue; const d=fishDesign(sp); if(d.plan!=='fusi'||d.fam) continue; let h=0; for(let i=0;i<sp.id.length;i++) h=(h*33+sp.id.charCodeAt(i))>>>0;
    const L2=sp.eg?EGP:NP; d.plan=L2[h%L2.length]; d.tail=TAILS[(h>>>4)%TAILS.length]; d.dorsal=DORS[(h>>>8)%DORS.length]; if(d.plan==='mola'||d.plan==='ball'||d.plan==='box') d.h=Math.max(d.h,.5); } }
