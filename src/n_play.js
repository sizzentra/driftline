
// =====================================================================
// 0.3 fishing depth: prismatic fish (a shiny tier above shiny), hybrids (a fish that rolled another
// species' weight), predators that already swallowed a smaller fish (or grab yours mid-fight),
// cast distance that matters, and aquarium buffs rolled per fish.
// =====================================================================
const PRISM = {rainbow:{n:'Rainbow',c:'#ff7ad8'}, starry:{n:'Starry',c:'#9ab8ff'}, spectral:{n:'Spectral',c:'#8af4ff'}, ancient:{n:'Ancient',c:'#e8b860'}};
/* [18] (director: "Do not give a fish a special title without modifying its stats to be stronger than the average. Multiple buffs to different
   catching/fishing/economy stats. More gold generation for subsequent runs. Bringing up all percentage buffs of other fish's stats in the
   tank"): each title adds three aquarium bonuses of its own, lifts every other fish's bonuses in the tank (all titles together up to
   +30%), and every different species + title ever caught adds +1% coins on every voyage (up to +20%). */
const TITLE_BUFFS = {rainbow:{keys:['shiny','sell','xp'], aura:.06, what:'money'}, starry:{keys:['rare','hot','bite'], aura:.06, what:'catching'}, spectral:{keys:['reel','tension','calm'], aura:.06, what:'fighting'}, ancient:{keys:['tank','trophy','treasure'], aura:.10, what:'collecting'}};
const TITLE_AURA_CAP=.3, TITLE_COIN=.01, TITLE_COIN_CAP=.2;
const titleAura = () => { let a=0; for(const f of S.tank) if(f.sh===2&&TITLE_BUFFS[f.pv]) a+=TITLE_BUFFS[f.pv].aura+.02*pr('prismkeeper'); return Math.min(TITLE_AURA_CAP+(maxed('prismkeeper')?.1:0),a); };
const titleLegacy = () => Math.min(TITLE_COIN_CAP, TITLE_COIN*Object.keys(S.titled||{}).length);
const PRISM_KEYS = Object.keys(PRISM);
const PRISM_SHARE = .06;        // share of shiny rolls that come up prismatic instead
const PRISM_VALUE = 15;         // value multiplier (shiny is ×4)
const HYBRID_IN_RANGE = [2,2.5,3,3.5,4,5]; // [23] a hybrid inside its own normal weight range: value and aquarium income ×, by rarity
const HYBRID_BASE = .001;       // 0.1%, up to 1% with the Odd Genes skill
const hybridChance = () => HYBRID_BASE*(1+pr('hybrid'))*(pr('hybrid')>=9?2:1)*(1+rodBonus('hybrid'))*pathMul('hybrid'); /* [14] Twin Hook */
const PRED_RX = /pike|musky|muskie|bass|gar|barracuda|shark|tuna|grouper|cod|walleye|zander|trout|salmon|snakehead|catfish|wolf|viper|angler|marlin|swordfish|wahoo|kingfish|mackerel|eel|moray|piranha|perch|char|taimen|arapaima|dragon|fang|leviathan|maw/;
function isPredator(sp){ return sp.r>=1 && (sp.aggr>=.55 || sp.shape==='s' || PRED_RX.test(sp.id)); }
function preyPool(pred,pool){ return pool.filter(s=>s.id!==pred.id && s.max<=Math.max(pred.min*.7,pred.max*.2) && s.r<=Math.max(1,pred.r)); }

// ---------- aquarium buffs: each fish rolls its own, centred on its true rarity ----------
const AQ_MAG2 = [.012,.022,.04,.065,.1,.18];
function rollTier(r){ const x=Math.random(); if(x<.004) return Math.floor(Math.random()*6); if(x<.07) return clamp(r+(Math.random()<.5?-1:1)*2,0,5); if(x<.26) return clamp(r+(Math.random()<.5?-1:1),0,5); return r; }
function rollAqBuff(sp,kg,favoured){ const pref=AQ_KEYS[hashStr(sp.id)%AQ_KEYS.length], k=(favoured||Math.random()<.62)?pref:AQ_KEYS[Math.floor(Math.random()*AQ_KEYS.length)];
  const t=rollTier(sp.r), rel=sp.max>sp.min?clamp((kg-sp.min)/(sp.max-sp.min),0,1.5):.5; return {k,t,w:+(.75+.5*Math.min(1,rel)).toFixed(3)}; }
function aqBuffsOf(f){ const sp=SPI[f.id]; if(!sp) return [];
  const mult=(f.sh===2?3.5:f.sh?(maxed('aquarist')?3:2):1)*(f.tr?1.25:1)*(1+.03*pr('aquarist'))*(f.hy?1.5:1);
  const list=[]; const add=b=>{ if(b) list.push({k:b.k, v:AQ_MAG2[b.t]*(b.w||1)*mult, t:b.t}); };
  if(f.ab){ add(f.ab); add(f.ab2); } else { const b=aqBase(f.id); if(b) list.push({k:b.k, v:b.v*mult, t:sp.r}); }
  if(f.sh===2&&f.pv&&TITLE_BUFFS[f.pv]){ const t=Math.max(3,sp.r); for(const k of TITLE_BUFFS[f.pv].keys) list.push({k, v:AQ_MAG2[t]*1.5, t, title:1}); } /* [18] a title brings three bonuses of its own */ // fish caught before 0.3 keep their old boost
  return list; }

// ---------- distance ----------
// far casts lean rare and heavy; short casts lean the other way, except in a hotspot (no penalty there)
function distanceMods(){ const df=clamp(G.lastCast,0,1); let rare=(df-.5)*.5, weight=.82+.42*df; if(G.inHot){ rare=Math.max(0,rare); weight=Math.max(1,weight); } return {rare,weight}; }

// ---------- prismatic look (catch card, cooler, log) ----------
function prismOverlay(c,w,h,v,t){ c.save(); c.globalCompositeOperation='source-atop';
  if(v==='rainbow'){ const gr=c.createLinearGradient(0,0,w,h*.6); const o=(t*.15)%1; ['#ff5a7a','#ffb84a','#fff06a','#6aff9a','#5ad8ff','#a87aff','#ff5a7a'].forEach((cl,i)=>gr.addColorStop(((i/6)+o)%1,cl)); c.globalAlpha=.42; c.fillStyle=gr; c.fillRect(0,0,w,h); }
  else if(v==='starry'){ c.globalAlpha=.6; c.fillStyle='#16123a'; c.fillRect(0,0,w,h); c.globalAlpha=1; const r=v3rng(77); for(let i=0;i<60;i++){ const s=r()*1.6+.4; c.fillStyle=i%7?'#ffffff':'#ffe08a'; c.globalAlpha=.5+.5*Math.sin(t*2+i); c.fillRect(r()*w,r()*h,s,s); } }
  else if(v==='spectral'){ const gr=c.createLinearGradient(0,0,0,h); gr.addColorStop(0,'rgba(220,255,255,.6)'); gr.addColorStop(1,'rgba(90,200,255,.25)'); c.fillStyle=gr; c.fillRect(0,0,w,h); c.globalCompositeOperation='destination-out'; c.globalAlpha=.3; c.fillRect(0,0,w,h); }
  else { const gr=c.createLinearGradient(0,0,w,h); gr.addColorStop(0,'#f4d27a'); gr.addColorStop(.5,'#b8782a'); gr.addColorStop(1,'#6a4a1a'); c.globalAlpha=.5; c.fillStyle=gr; c.fillRect(0,0,w,h); c.globalAlpha=.55; c.strokeStyle='#fff0b0'; c.lineWidth=Math.max(1,w*.006); const r=v3rng(91); for(let i=0;i<10;i++){ const x=w*.25+r()*w*.5, y=h*.35+r()*h*.3; c.beginPath(); c.moveTo(x,y); c.lineTo(x+w*.02,y-h*.04); c.lineTo(x+w*.04,y); c.stroke(); } }
  c.restore();
  // outer glow + sparkles in the variant's color
  const P=PRISM[v]||PRISM.rainbow; c.save(); c.globalCompositeOperation='destination-over'; const g2=c.createRadialGradient(w/2,h/2,0,w/2,h/2,w*.55); g2.addColorStop(0,v3rgba(P.c,.45)); g2.addColorStop(1,v3rgba(P.c,0)); c.fillStyle=g2; c.fillRect(0,0,w,h); c.restore();
  sparkles(c,w,h,14); }

// ---------- the predator swallowing your fish mid-fight ----------
function maybeEatEvent(dt){ const f=G.fish; if(!f||f.kind!=='fish'||G.eat||G.eatDone||G.eatAt==null) return; if((G.fightT||0)<G.eatAt) return;
  G.eatDone=true; const pool=SP.filter(s=>s.loc===S.loc && timeOk(s,phase()) && isPredator(s) && s.min>=f.kg*2.2 && s.r<=f.sp.r+2); if(!pool.length) return;
  const pred=pick(pool); G.eat={t:0,dur:1.4,sp:pred,swapped:false}; sfx.warn(); }
function eatTick(dt){ const E=G.eat; if(!E) return; E.t+=dt;
  if(!E.swapped && E.t>=E.dur*.62){ E.swapped=true; const prey=G.fish, nf=rollFish(E.sp,{}); nf.prey=[prey].concat(prey.prey||[]); nf.value=Math.round(nf.value*1.5*pathMul('eatval')); nf.ate=true; G.fish=nf; G.maxOut+=12; G.strip={t:0,dur:EAT_STRIP_T,from:G.d,to:Math.max(G.d,Math.min(G.maxOut-3,EAT_RUN_MAX,Math.max(EAT_RUN_M[fishRank(nf)],G.d+3)))}; /* Cam, 2026-11-23: the predator runs out to at most 45 m for a mythic, less for commoner ones, never past 50 m from shore (it used to zoom off the screen) */ /* C22: the line goes out over a few seconds (fight tick), not at once */ G.sta=1; G.ten=Math.max(G.ten,28); G.temper=0; G.run=true; G.runT=rnd(.8,1.4); G.fightT=0; G.surge=null; G.surgeN=0; /* 0.4.9 (director): the big fish strips line out (a little, up to all of it) and the fight starts over at full strength; landing it pays +50% */
    splash(G.bob.x,G.bob.y,28); sfx.gulp(); if(V3ON) vib([60,40,90]); toast(gv("finder")>=5?'Something bigger just swallowed your '+(S.journal[prey.sp.id]?prey.sp.name.toLowerCase():'catch')+'! Land it to keep both, for 50% more coins.':'Something bigger just swallowed your catch! Land it to keep both, for 50% more coins.'); /* the first fish stays a surprise; the top Fish Finder names it if you have caught that species (director, 2026-11-19) */ }
  if(E.t>=E.dur) G.eat=null; }
function drawEat(t){ const E=G.eat; if(!E) return; if(G.st!=="reeling"){ G.eat=null; return; } /* a fight that ends mid-grab takes the shadow with it */ const k=clamp(E.t/(E.dur*.62),0,1), e=1-Math.pow(1-k,2.4), len=60+Math.min(90,Math.sqrt(E.sp.max)*10);
  const x=G.bob.x+(W*.5)*(1-e)+len*.3, y=G.bob.y+16+Math.sin(t*6)*2; g.save(); g.globalAlpha=.45*(E.swapped?Math.max(0,1-(E.t-E.dur*.62)/(E.dur*.38)):1);
  drawCreature(g,E.sp,x,y,len,{sil:'#06121a',wag:t*14,flip:true}); g.restore(); }

// ---------- a fish of a given species, rolled the 0.3 way (used for normal catches, prey and predators) ----------
function rollFish(sp,ctx){ const b=BAIT[S.baitSel], wx=weather(), dm=ctx.dist||{rare:0,weight:1};
  const tb = (1 + bonus('trophy') + .06*pr('trophy') + (b.trophy||0)) * (spec('trophyking')?1.6:1) * dm.weight;
  let kg = sp.min + (sp.max-sp.min)*Math.pow(Math.random(),1.8/tb), hy=null;
  // hybrid: the weight of another fish from the same waters
  if(!ctx.noHybrid && (ctx.forceHybrid||Math.random()<hybridChance()*(G.inHot?HOT_HYBRID_K:1))){ const others=SP.filter(s=>s.loc===sp.loc && s.id!==sp.id && Math.abs(Math.log(((s.min+s.max)/2)/((sp.min+sp.max)/2)))>.4); if(others.length){ const o=pick(others); hy=o.id; kg=o.min+(o.max-o.min)*Math.pow(Math.random(),1.8/tb); } }
  const avg=(sp.min+sp.max)/2, R=kg/avg, rel=hy?clamp(R>1?1:0,0,1):(kg-sp.min)/(sp.max-sp.min);
  let str=sp.str*(.8+.4*clamp(rel,0,1))*(wx.str||1); if(hy) str*=clamp(Math.pow(R,.35),1,6); /* a small hybrid keeps its species' strength (Cam, round 4) */
  const shRoll=(G.inHot&&G.hotShiny)||Math.random() < shinyChance(G.inHot); if(G.hotShiny) G.hotShiny=false; /* C29: a sparkling hotspot promises one shiny */
  const shiny = shRoll ? (Math.random()<PRISM_SHARE*pathMul('prism')*(G.inHot?HOT_PRISM_K:1)?2:1) : 0, pv = shiny===2 ? pick(PRISM_KEYS) : null;
  const trophy = !hy && rel > .9;
  // hybrids: the further from normal size, the bigger the multiplier, capped at ×25 so a lucky hybrid is a jackpot, not a broken economy
  /* [23] (director): a hybrid that still lands inside its own normal weight range is worth ×2 (common) to ×5 (mythic) of a normal
     fish its size, in coins and in aquarium income */
  const hx = hy && kg>=sp.min && kg<=sp.max ? HYBRID_IN_RANGE[sp.r]*pathMul('hx') : 0;
  let value = Math.max(1,Math.round(sp.base*(hy&&!hx?clamp(hyWeightK(R)*(1+.6*Math.abs(Math.log(R))),.3,25):Math.pow(R,.85)*(hx||1))*(hy?HY_TOP_K[sp.r]||1:1)*waterCatchUp(sp.loc))); /* Cam, round 6: earlier waters pay more once later ones are open (waterCatchUp) */ /* Cam, round 4: legendary and mythic hybrids are worth more (sale and aquarium both follow the value) */
  value=Math.round(value*RAR[sp.r].val*(1+masteryK()*mastery(sp.id))*specLocValue(sp.loc)); { const bb=BAIT[S.baitSel]; if(pr('gourmet')&&bb&&bb.food&&typeof FISH_FAV!=='undefined'&&FISH_FAV[sp.id]===bb.id) value=Math.round(value*(1+.06*pr('gourmet'))); } /* Gourmet: caught on its favourite food, it sells for 6% more a rank (director, 2026-11-23) */ if(trophy) value=Math.round(value*(spec('trophyking')?2:1.5));
  if(shiny===1) value*=4; else if(shiny===2) value*=PRISM_VALUE;
  const ab=rollAqBuff(sp,kg), ab2=hy?rollAqBuff(SPI[hy],kg,true):null;
  const f={kind:'fish', sp, kg, rel:clamp(rel,0,1), str, th:sp.th, beh:sp.beh, aggr:sp.aggr, value, shiny, pv, hy, hx, ab, ab2, trophy, storm: wx.k==='Storm', hot:G.inHot, prey:null};
  // a predator may already have a smaller fish in its belly
  if(!ctx.noPrey && isPredator(sp) && Math.random()<.12+sp.aggr*.12){ const pp=preyPool(sp,SP.filter(s=>s.loc===sp.loc && timeOk(s,phase()))); if(pp.length){ f.prey=[]; const n=Math.random()<.15?2:1; for(let i=0;i<n;i++) f.prey.push(rollFish(pick(pp),{noHybrid:true,noPrey:true})); } }
  return f; }
// the cooler entry for a landed fish
function coolerEntry(f){ const e={id:f.sp.id, kg:+f.kg.toFixed(3), value:f.value, sh:f.shiny||0, tr:f.trophy?1:0}; if(f.pv) e.pv=f.pv; if(f.hy) e.hy=f.hy; if(f.hx) e.hx=f.hx; if(f.ab) e.ab=f.ab; if(f.ab2) e.ab2=f.ab2; return e; }
// journal update incl. smallest, prismatic and hybrid records
function journalAdd(f){ const sp=f.sp, j=S.journal[sp.id], kg=+f.kg.toFixed(3);
  const n={n:(j?j.n:0)+1, best:j?j.best:0, min:j&&j.min!=null?j.min:null, sh:(j&&j.sh)||!!f.shiny, pr:(j&&j.pr)||f.shiny===2, tr:(j&&j.tr)||f.trophy, bv:Math.max((j&&j.bv)||0, f.value), first:(j&&j.first)||Date.now()};
  if(j&&j.hb!=null){ n.hb=j.hb; n.hs=j.hs; }
  if(f.hy){ n.hb=Math.max(n.hb||0,kg); n.hs=n.hs==null?kg:Math.min(n.hs,kg); } else { n.best=Math.max(n.best,kg); n.min=n.min==null?kg:Math.min(n.min,kg); }
  S.journal[sp.id]=n; return n; }
const aqCap = () => Math.ceil(S.tankSlots*1.5);
if(/[?&]test\b/.test(location.search)) window.__forceCatch=(id,o={})=>{ const sp=SPI[id]; const f=rollFish(sp,{noPrey:!o.prey,noHybrid:!o.hy}); if(o.shiny){ f.shiny=o.shiny; f.pv=o.pv||(o.shiny===2?'rainbow':null); }
  if(o.hy){ const oth=SPI[o.hy]; f.hy=o.hy; f.kg=oth.max*.8; f.ab2=rollAqBuff(oth,f.kg,true); f.str*=3; } if(o.prey){ f.prey=[rollFish(SPI[o.prey],{noPrey:true,noHybrid:true})]; } if(o.eat) G.forceEat=true; G.forced=f; return {kg:f.kg,value:f.value,shiny:f.shiny,hy:f.hy,prey:f.prey&&f.prey.length}; };
if(/[?&]test\b/.test(location.search)) window.__prismSheet=(ids)=>{ const o=document.createElement('canvas'); o.width=4*220; o.height=ids.length*110; const x=o.getContext('2d'); x.fillStyle='#1d3a44'; x.fillRect(0,0,o.width,o.height);
  ids.forEach((id,r)=>PRISM_KEYS.forEach((v,i)=>{ const c=document.createElement('canvas'); c.width=220; c.height=110; fishCanvas(c,SPI[id],true,2,v); x.drawImage(c,i*220,r*110); })); __post('prism',o.toDataURL()); };

// ---------- aquarium income cap (0.3 balance) ----------
// Each fish earns from its value, but never more than a small share of what an hour of fishing its water pays,
// rising with rarity. So a full tank is a strong passive bonus, and fishing yourself always pays more per hour.
const AQ_CAP_K=[.006,.008,.012,.02,.03,.045], WATER_EV={};
function waterEV(loc){ if(WATER_EV[loc]==null){ const pool=SP.filter(s=>s.loc===loc); let a=0,t=0; for(let r=0;r<6;r++){ const L=pool.filter(s=>s.r===r); if(!L.length) continue; a+=RAR[r].w*L.reduce((x,s)=>x+s.base,0)/L.length*RAR[r].val; t+=RAR[r].w; } WATER_EV[loc]=t?a/t:1; } return WATER_EV[loc]; }
function aqFishBase(f){ const sp=SPI[f.id]; if(!sp) return 0; const sm=hySmall(f,sp), raw=(+f.value||0)/(sm?hyWeightK(sm):1)*TANK_RATE*.75*RAR[sp.r].aq*(f.sh===2?1.6:1)*(f.hy?1.3:1), cap=waterEV(sp.loc)*4.6*AQ_CAP_K[sp.r]*(sm?aqWeightK({kg:(sp.min+sp.max)/2},sp):aqWeightK(f,sp))*(f.sh===2?1.6:f.sh?1.25:1)*(f.hy?1.3:1)*(f.hx||1); return Math.min(raw,cap); } /* [23] in-range hybrids lift the cap by the same multiplier */
// 0.3.2: weight counts in the aquarium. A fish heavy for its kind earns more (its income cap grows from x0.75 for the
// lightest to x1.7 for a record-breaker) and rolls stronger buffs, so your best prized catches belong on display.
function aqRel(f,sp){ return sp&&sp.max>sp.min ? clamp(((+f.kg||0)-sp.min)/(sp.max-sp.min),0,1.5) : .5; }
function aqWeightK(f,sp){ return .75+.63*aqRel(f,sp); }
const _aqBuffsOf_w = aqBuffsOf;
aqBuffsOf = function(f){ const L=_aqBuffsOf_w(f), sp=SPI[f.id]; if(!sp) return L; const r=aqRel(f,sp);
  // fish rolled since 0.3 already carry a weight factor (0.75 to 1.25); this adds a bonus for the top end, and gives
  // older fish (which had none) the full weight effect
  const k=f.ab ? 1+.3*Math.max(0,r-.6) : .75+.5*Math.min(1.5,r); if(k!==1) for(const e of L) e.v*=k; return L; };
/* small hybrids (Cam, 2026-11-23: "small hybrids lose only half of their sell value from the drop in weight rather than all, and don't lose any
   from aquarium revenue"): a hybrid lighter than its own kind's usual weight loses half of what its weight would cost in coins (value
   follows weight^0.85; half of that drop is given back), and in the aquarium it earns as if it weighed the usual amount */
const HY_TOP_K=[1,1,1,1,1.5,2]; /* Cam, round 4: a legendary hybrid is worth 1.5x, a mythic 2x (on top of the hybrid rules; Feel call) */
function hyWeightK(R){ const w=Math.pow(R,.85); return R<1?1-(1-w)/2:w; }
function hySmall(f,sp){ if(!f||!f.hy||f.hx||!sp) return 0; const R=(+f.kg||0)/((sp.min+sp.max)/2); return R>0&&R<1?R:0; } /* its weight against the usual, when lighter (in-range hybrids are paid by their own rule) */
