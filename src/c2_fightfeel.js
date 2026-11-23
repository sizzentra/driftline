// =====================================================================
// FIGHT FEEL (Cam, 2026-11-21: docs/cam/FIGHT_FEEL.md, the answered questionnaire; it comes before every older note).
// The new fish fight. The old one stays in c_logic.js `fight()` behind the test builds' "Fishing: New / Old" switch
// (Stats › Tester tools), so the director and Cam can compare; the release build always fights the new way.
// The switch covers the fight itself, the fast turn of a running fish (Cam's list #5) and the hotspot hook tries (#10).
//  - Fight works like stamina; temper sets how hard the fish's moves are, and keeps its Fight from draining as fast.
//  - Reeling is steady: the fish rests 1-5 s between moves (head shake 35%, run 45%, jump 20%, a dive in deep water).
//  - Weight decides what a move can do: under 1.5 lb nothing, 1.5-3 lb slows your reel, 3-5 lb stops it, over 5 lb takes line.
//  - A cast to the far edge of the screen is 40 m; a fish that gets 150 m out spools you; 10 s without reeling and it escapes.
//  - Rare fish chain moves; a tired fish gets one Second wind after 10 s; deep waters (100 m+) have dives with a tension band.
// Numbers marked "maths" are Claude's model for Cam's targets (landing times per rarity, measured with __ffSim in test mode).
// =====================================================================
// Cam's fish feel update (2026-11-21, PLAN › "Cam's answers"; it wins over FIGHT_FEEL.md where they differ):
//  - tension builds slightly while you reel (also between moves) and only falls when you stop: steadily, 35 a second, a third of that
//    during a move; temper empties in about 3 s when you stop; full temper makes the fish act up to 3 times as often, each move
//    costing its Fight in proportion (twice as often, half the cost); reeling into a move (not a jump toward you) drains Fight 1.5x
//  - between moves the fish is either still or swimming toward you (reel 25-50% faster, 0.25-3 s, less often and shorter for rarer fish)
//  - a tired fish reels in faster by rarity (common 60% ... mythic 10%); rare to mythic then a little slower (FF.TIRED_SLOW), with its Second-wind clock slowed the same, so it comes in slower without more chances to escape
//  - Second winds: the first is as before; rare and epic fish may get 1 more, legendary and mythic 2 more, each a 50/50 flip after
//    5 s tired, then 3 s, then every 1 s; a legendary or mythic's third waits twice as long and gives only 25% Fight
//  - in waters with dives a third of runs are dives; a dive lasts 5-20 s and stops once tension stays in its band for 1.5 s; it pulls
//    line more slowly but can take far more; a perfect hook holds the fish still for 1.5 s; the spool takes 200 m
const FF = { FAR_M:40, SPOOL_M:200, LB:.4536,
  TEN_RISE:[3,4],                   /* tension per second while you reel between moves: base + up to this much more for a strong fish (Feel call) */
  TEN_DROP:35, TEN_DROP_ACT:35/3,   /* Cam: easing up drops tension 35 a second, a third of that during a move */
  TEMPER_DROP:1, TEMPER_RATE:3,     /* Cam: temper empties in 3 s; full temper = moves up to 3 times as often (Feel call), each costing 1/3 */
  DIVE_HALF:10.625,                 /* Cam, 2026-11-23: the band that stops a dive is 15% narrower than before (25% wide to 21.25%) */
  TEMPER_TEN:1.5,                   /* Cam, 2026-11-23: "high temper needs to be more punishing": reeling between moves builds tension up to 1 + this times faster as the temper bar fills past half (2.5x when full; Feel call) */
  ACT_DRAIN:1.5,                    /* Cam: reeling into a move drains Fight 1.5 times as fast */
  SWIM_P:[.5,.45,.38,.32,.26,.2], SWIM_K:[1.25,1.5], SWIM_T:[.25,3], SWIM_EVERY:[1,2], /* Cam: still or swimming toward you between moves */
  TIRED_FAST:[.6,.45,.3,.25,.2,.1], /* Cam: a tired fish reels in this much faster, by rarity */
  TIRED_SLOW:[1,1,1.1,1.15,1.2,1.25], /* Cam, 2026-11-23: “a little slower reel in when the fish is tired” for rare to mythic: tired reeling divided by this, and the tired (Second-wind) clock runs as much slower, so the fish gets no extra chances (a first version that only slowed the reel cut a steady player’s legendaries landed from about 70% to 25-40%); Feel call */
  SW_EXTRA:[0,0,1,1,2,2], SW_WAITS:[5,3,1], SW_LAST_TO:.25, /* Cam: extra Second winds by rarity, their flip waits, the legendary / mythic third */
  DIVE_SHARE:1/3, DIVE_T:[5,20], DIVE_HOLD:1.5, DIVE_RATE:.5, DIVE_MK:3, /* Cam: dives = a third of runs, 5-20 s, stopped by 1.5 s in the band, slower but longer */
  PERFECT_REST:1.5,                 /* Cam: after a perfect hook the fish doesn't fight for 1.5 s */
  RESIST:[.15,.55,.75,.86,.9,.92],   /* maths: how hard a fresh fish of each rank holds against your reel (C U R E L M) */
  TIRE_T:[12,12,13,15,18,19],       /* seconds of reeling a fish needs to tire with the best gear (Cam 2026-11-21: "speed up fishing" to about half the speed of the old fight with great gear; was 15-24) */
  SHARE:{shake:35,run:45,jump:20},  /* Cam: rough share of each move (Middle and Arcade: runs 40, see ffPick) */
  CHAIN:[1,1,2,3,4,5],              /* Cam: moves in a row, by rank (common and uncommon never chain) */
  DIVE_N:[1,2,3,4,5,6], DIVE_M:[3,5,10,15,20,20], DEEP_M:100, /* Cam: dives per fight and metres if the band is missed; deep = 100 m+ (director) */
  SHORT_T:[3,6,10,15,20,30],        /* Cam: shortest landing time from the far edge by rank; a fish that still has fight never comes in faster */
  NOREEL:10, SNAP_HOLD:.325, /* Cam, 2026-11-23: 35% less grace at full tension (was .5 s) */ SW_AFTER:10, SW_TO:.5, RUN_T:[1.5,5], REST_T:[1,5] };
// the switch: test builds only (Stats › Tester tools › Fishing: New / Old); read once, changed by the button
let FISH_OLD = (()=>{ try{ return !!window.DL_PREVIEW && localStorage.getItem('dl-fish-old')==='1'; }catch(e){ return false; } })();
const fishNew = () => !FISH_OLD;
function setFishOld(on){ FISH_OLD=!!on && !!window.DL_PREVIEW; try{ if(FISH_OLD) localStorage.setItem('dl-fish-old','1'); else localStorage.removeItem('dl-fish-old'); }catch(e){} }
// =====================================================================
// FEEL LAB (director and Cam, 2026-11-22: "more arcade-y and snappier but still with depth"; test builds: Stats › Tester tools › Feel lab).
// Every knob below changes the new fight live. Presets: Old (the fight before Cam's changes), Current (Cam's update as it was), Middle and
// Arcade (Claude's first versions, Feel calls). Test pages (?test, ?sweep, ?frozen) always fight on Current so the checks stay steady.
//  - len: fight length (how long a fish takes to tire); rest: the pause between moves; tell: a warning before a run, shake or dive
//  - counter: the right reaction pays (ease off in a run or shake, reel when it jumps or swims toward you, hold the dive band)
//  - pull: a perfect pull, a short glowing window as a move ends: press reel right then and the fish loses a chunk of its fight
//  - combo: right reactions in a row speed up your reel (up to +40%); a mistake resets it
//  - sw: how soon second winds come; read: show when the fish swims toward you; juice: hook flash, pop-ups and the combo badge
// =====================================================================
const FEEL_KNOBS=[['len','Fight length',.5,1.5,.1],['tx','Temper curve',0,1.5,.25],['runs','Darting and long runs',0,1,1],['groove','Groove bonus',0,1.5,.25],['rest','Pause between moves',.3,1.2,.1],['tell','Warning before a move (s)',0,.8,.1],['counter','Right-reaction reward',0,2,.25],['pull','Perfect pull',0,2,.25],['combo','Combo boost',0,2,.25],['sw','Second-wind waits',.3,1,.1],['read','Show when it swims in',0,1,1],['juice','Flash and pop-ups',0,1,1]];
const FEEL_PRESETS={ current:{len:1,rest:1,tell:0,counter:0,pull:0,combo:0,sw:1,read:0,juice:0,tx:0,runs:0,groove:0},
  middle:{len:.88,rest:.8,tell:.3,counter:.75,pull:.75,combo:.75,sw:.5,read:1,juice:1,tx:1,runs:1,groove:1}, /* Cam, 2026-11-23: "middle is the one for sure": the feel for everyone; a slightly shorter Reel hard window (sw .7 to .6), Cam's temper curve, darting and long runs, the groove */
  arcade:{len:.65,rest:.6,tell:.45,counter:1.25,pull:1.25,combo:1.25,sw:.5,read:1,juice:1,tx:1.25,runs:1,groove:1.25} };
let FEEL=(()=>{ const testPage=/[?&](test|sweep|frozen)\b/.test(location.search); let s=null; try{ if(window.DL_PREVIEW&&!testPage) s=JSON.parse(localStorage.getItem('dl-feel2')||'null'); }catch(e){}
  const base=Object.assign({},FEEL_PRESETS[testPage?'current':'middle']); /* Middle is the game's feel (Cam, 2026-11-23); test pages fight on Current so the checks stay steady */ return Object.assign(base,s&&typeof s==='object'?s:{}); })();
function feelSave(){ try{ localStorage.setItem('dl-feel2',JSON.stringify(FEEL)); }catch(e){} }
function feelPreset(name){ if(name==='old'){ setFishOld(true); return; } setFishOld(false); FEEL=Object.assign({},FEEL_PRESETS[name]||FEEL_PRESETS.current); feelSave(); }
function feelNudge(k,dir){ const K=FEEL_KNOBS.find(x=>x[0]===k); if(!K) return; const [,,lo,hi,st]=K; FEEL[k]=Math.round(clamp((FEEL[k]||0)+dir*st,lo,hi)*100)/100; feelSave(); }
function feelPresetName(){ if(!fishNew()) return 'old'; for(const n in FEEL_PRESETS){ const p=FEEL_PRESETS[n]; if(Object.keys(p).every(k=>Math.abs((FEEL[k]||0)-p[k])<1e-6)) return n; } return 'custom'; }
function feelPop(txt){ if(!FEEL.juice) return; (G.pops=G.pops||[]).push({txt,t:0}); if(G.pops.length>4) G.pops.shift(); }
function feelCombo(d){ if(!FEEL.combo&&d>0) return; const was=G.combo||0; G.combo=d>0?Math.min(10,was+1):0; if(d<0&&was>=2) feelPop('Combo lost'); }
const feelReelK = () => 1+Math.min(.4,.05*(G.combo||0)*(FEEL.combo||0));
/* drawn over the fight every frame (d_draw.js): the hook flash, the perfect-pull ring, pop-ups rising from the float and the combo badge */
function feelDraw(t){ if(G.st!=='reeling'||!G.fish) return; const bx=G.bob.x, by=G.bob.y, s=clamp(H/420,.7,1.25);
  if(G.flashT>0){ g.fillStyle='rgba(255,252,235,'+(G.flashT/.18*.35)+')'; g.fillRect(0,0,W,H); }
  if(G.ppw>0){ const k=1-G.ppw/.45; g.strokeStyle='rgba(255,230,120,'+(.9-k*.5)+')'; g.lineWidth=2.5*s; g.beginPath(); g.ellipse(bx,by,(10+k*14)*s,(4+k*5)*s,0,0,7); g.stroke(); }
  if(G.tell){ g.strokeStyle='rgba(255,140,90,.8)'; g.lineWidth=2*s; const k=(t*6)%1; g.beginPath(); g.ellipse(bx,by,(6+k*10)*s,(2.5+k*4)*s,0,0,7); g.stroke(); }
  if(G.grooveT>.3){ g.strokeStyle='rgba(150,240,170,'+(.45+.2*Math.sin(t*5))+')'; g.lineWidth=2*s; g.beginPath(); g.ellipse(bx,by,13*s,5*s,0,0,7); g.stroke(); } /* in the groove */
  if(FEEL.read&&G.swim&&!G.ffA){ g.fillStyle='rgba(160,230,255,.85)'; for(let i=0;i<3;i++){ const ax=bx-(14+i*9+((t*30)%9))*s; g.beginPath(); g.moveTo(ax,by-3*s); g.lineTo(ax-5*s,by); g.lineTo(ax,by+3*s); g.fill(); } }
  g.save(); g.textAlign='left'; g.font='800 '+Math.round(15*s)+'px system-ui'; (G.pops||[]).forEach((p,i,arr)=>{ const a=Math.max(0,1-p.t/1.1), off=(arr.length-1-i)*17*s; g.fillStyle='rgba(20,24,30,'+(a*.6)+')'; g.fillText(p.txt,bx+71*s,by-2*s-off-p.t*30*s+1); g.fillStyle=p.txt.startsWith('Combo lost')?'rgba(255,140,120,'+a+')':'rgba(255,236,150,'+a+')'; g.fillText(p.txt,bx+70*s,by-2*s-off-p.t*30*s); }); /* beside the float, clear of the fight card, newest lowest */
  if(FEEL.juice&&(G.combo||0)>=2){ g.font='700 '+Math.round(12*s)+'px system-ui'; g.fillStyle='rgba(255,236,150,.95)'; g.fillText('×'+G.combo+' combo',bx+70*s,by+18*s); }
  g.restore(); }
// a water's depth in metres from its card ("500–3,000 m", "0101 m"); a water with no number at all is deep enough (Cam, section 7)
function waterDepthM(loc){ const L=LOCS.find(l=>l.id===loc); const s=String(L&&L.depth||''); const ns=(s.replace(/,/g,'').match(/\d+(\.\d+)?/g)||[]).map(Number); return ns.length?Math.max(...ns):Infinity; }
const waterDeep = loc => waterDepthM(loc) >= FF.DEEP_M;
// the average fish of a water (strength and weight), so runs scale with how strong a fish is for where it lives
const FF_AVG = {};
function ffAvg(loc){ if(FF_AVG[loc]) return FF_AVG[loc]; const ps=SP.filter(s=>s.loc===loc); const n=Math.max(1,ps.length);
  const str=ps.reduce((a,s)=>a+(s.str||1),0)/n, kg=ps.reduce((a,s)=>a+((s.min||0)+(s.max||0))/2,0)/n; return FF_AVG[loc]={str:Math.max(.5,str), kg:Math.max(.05,kg)}; }
// how many tries a bite gives before it's gone (Cam's list #10): one to start; Quick Reflexes at ranks 5 and 10 and a full Water Reader add one each
const hookTries = () => 1 + (pr('reflex')>=5?1:0) + (pr('reflex')>=10?1:0) + (pr('secondbite')>=1?1:0) + (pr('secondbite')>=5?1:0) + (pr('secondbite')>=10?1:0); /* Second Bite ranks 1, 5 and 10 (Cam, 2026-11-23; were 3, 6 and 9) */
// a fresh fight on the new rules (called by hookIt)
function ffInit(){ const f=G.fish; G.surge3=null;
  G.d0=G.d=Math.max(3, FF.FAR_M*clamp(G.lastCast,0,1)); G.dd=0; G.maxOut=FF.SPOOL_M+rodSpool();
  G.ffA=null; G.ffRest=rnd(.7,1.4); G.chainOn=false; G.chainN=0; G.chainCD=0; G.diveN=0; G.tiredT=0; G.swUsed=false; G.noReelT=0; G.fullT=0; G.jumpAway=false; G.dive=null; G.ffOpen=false;
  /* Cam (section 2): a rare fish hooked close in runs first to gain some ground */
  if(f&&f.kind==='fish'&&fishRank(f)>=2&&FEEL.runs){ if(G.lastCast<=.4&&!G.perfect){ G.surge3={t:0,m:[0,0,2.5,4,5.5,7][fishRank(f)]}; G.ffRest=3.4; } } /* director, 2026-11-23: a rare-or-better fish hooked at 40% of a cast or closer surges for 3 s, more line the rarer it is (replaces the old run-first rule) */
  else if(f&&f.kind==='fish'&&fishRank(f)>=2&&G.d0<25){ G.ffOpen=true; G.ffRest=.35; }
  G.swim=null; G.swimT=rnd(FF.SWIM_EVERY[0],FF.SWIM_EVERY[1]); G.swStep=0; G.swNext=0; G.swN=0;
  if(G.perfect){ G.ffOpen=false; G.ffRest=Math.max(FF.PERFECT_REST,G.ffRest); } /* Cam: a perfect hook holds the fish still for 1.5 s */
  G.combo=0; G.pops=[]; G.ppw=0; G.tell=null; G.prevRin=0; G.dartNext=false; G.dartLeft=0; G.grooveT=0; G.reelHold=0; G.restHold=0; G.flashT=FEEL.juice&&f&&f.kind==='fish'?.18:0; G.ffMin=0; G.lastK=null; G.dQ=0; if(G.perfect) feelPop('Perfect hook!'); /* Feel lab */ }
// how often the fish acts, from its temper: 1x calm, up to FF.TEMPER_RATE x at full temper (Cam: full temper = rapid moves)
const ffRate = () => 1+(FF.TEMPER_RATE-1)*clamp((G.temper||0)/3,0,1);
function ffWeightClass(f){ const lb=(f.kg||0)/FF.LB; return lb<1.5?0:lb<3?1:lb<5?2:3; }
function ffPick(f,rk,deep){ if(G.ffOpen){ G.ffOpen=false; return 'run'; } const b=f.beh, w={shake:FF.SHARE.shake*(b==='thrash'?2.2:b==='sulk'?1.3:1), run:FF.SHARE.run*(FEEL.runs?40/45:1)*(b==='run'?1.8:b==='dart'?1.3:1)*(FEEL.runs&&G.lastK==='run'?.5:1), /* runs 45 to 40 with the new run rules (director, 2026-11-23: runs mustn't crowd out the rest) */ jump:FF.SHARE.jump*(b==='jump'?2.2:1)};
  let x=Math.random()*Object.values(w).reduce((a,c)=>a+c,0), k='shake'; for(const q in w){ x-=w[q]; if(x<=0){ k=q; break; } }
  if(k==='run' && deep && (G.diveN||0)<FF.DIVE_N[rk] && Math.random()<FF.DIVE_SHARE*(b==='dive'?1.6:1)) k='dive'; /* Cam: in waters with dives, a third of runs are dives */
  return k; }
function ffStart(f,rk,tk,I,lively,kk,st,cont){ const k=kk||ffPick(f,rk,waterDeep(S.loc)), A={k,t:0}; if(!cont) G.lastK=k; /* a second run in a row is half as likely */
  if(k==='shake'){ A.dur=rnd(.5,.9); G.ev='shake'; sfx.warn(); }
  else if(k==='run'&&st==='dart'){ A.style='dart'; A.dur=rnd(.55,1.1)*(1+.08*tk); A.dir=G.dartDir=-(G.dartDir||1); if(!cont) G.dartLeft=1+Math.floor(Math.random()*(tk>=4?3:2)); /* 1-2 extra darts, up to 3 for legendary and mythic (director, 2026-11-23) */ G.run=true; splash(G.bob.x,G.bob.y,8+tk*4); } /* Cam, 2026-11-23: a darting run, short sharp bursts one after another, zigzagging: let it go and it tires itself */
  else if(k==='run'&&st==='long'){ A.style='long'; A.dur=rnd(4,6.5)*(1+.05*tk); A.taps=0; A.lastPress=-9; A.holdT=0; G.run=true; splash(G.bob.x,G.bob.y,6+tk*3); } /* a long, steady run: short pulls in rhythm keep it coming and build the combo */
  else if(k==='run'){ A.dur=clamp(FF.RUN_T[0]+(FF.RUN_T[1]-FF.RUN_T[0])*(.25*lively+.35*(G.temper/3)+.4*tk/5)*rnd(.7,1.15),FF.RUN_T[0],FF.RUN_T[1]); G.run=true; splash(G.bob.x,G.bob.y,6+tk*4); }
  else if(k==='jump'){ A.dur=JUMP_WINDUP+.85; A.away=Math.random()<.5; G.ev='windup'; G.evDur=JUMP_WINDUP; G.jumpAway=A.away; }
  else { A.dur=FF.DIVE_T[0]+(FF.DIVE_T[1]-FF.DIVE_T[0])*clamp(.55*tk/5+.25*lively+.2*Math.min(1,I-.6),0,1); A.zone=rnd(35,65); A.max=FF.DIVE_M[rk]*FF.DIVE_MK*(.6+.4*Math.min(1,I)); A.got=0; A.inZT=0; /* Cam: 5 s at least, up to 20 s; far more line in reach */ G.diveN=(G.diveN||0)+1; G.dive=A; G.ev='dive'; G.run=true; splash(G.bob.x,G.bob.y,18); sfx.warn(); setTimeout(()=>sfx.warn(),140); if(V3ON) vib([60,40,60]); }
  G.sta=Math.max(0,G.sta-({shake:.015,run:.03,jump:.035,dive:.045}[k])/ffRate()); /* Cam: a move costs Fight in proportion to how often the temper makes it come (twice as often, half the cost) */
  G.ffA=A; }
/* which kind of run (Cam, 2026-11-23: "some runs more darty and intense, others more prolonged and consistent"; Feel lab "Darting and long
   runs"): darting fish (dart, thrash) mostly dart, runners and sulkers mostly run long, the rest either */
function ffRunStyle(f){ if(!FEEL.runs) return null; const b=f.beh, p=b==='dart'||b==='thrash'?.85:b==='run'||b==='sulk'?.4:.65; return Math.random()<p?'dart':'long'; } /* short runs more common than long ones (director, 2026-11-23) */
function ffEnd(f,tk,lively){ const was=G.ffA; G.ffA=null; G.ev=null; G.run=false; G.dive=null;
  if(was&&was.style==='dart'&&G.dartLeft>0){ G.dartLeft--; G.dartNext=true; G.ffRest=rnd(.12,.3); return; } /* the next dart follows almost at once, the other way */
  if(FEEL.pull>0) G.ppw=.45; /* Feel lab: the perfect-pull window opens as a move ends */
  const rest=(FF.REST_T[0]+(FF.REST_T[1]-FF.REST_T[0])*(1-lively))*FEEL.rest; /* Cam: 1 s for the liveliest fish, 5 s for the laziest */
  if(G.chainOn){ if(G.chainN<FF.CHAIN[tk] && Math.random()<.5){ G.chainN++; G.ffRest=rnd(.5,1)*FEEL.rest; if(FEEL.runs) G.ffMin=.6; return; } G.chainOn=false; G.chainCD=5; } /* Cam: a coin flip for every chained move after the first */
  else if(FF.CHAIN[tk]>=2 && G.chainCD<=0 && G.sta>0 && Math.random()<.2){ G.chainOn=true; G.chainN=2; G.ffRest=rnd(.5,1)*FEEL.rest; if(FEEL.runs) G.ffMin=.6; return; } /* Cam: about 1 move in 5 starts a chain */
  G.ffRest=rest*rnd(.8,1.2); if(FEEL.runs) G.ffMin=was&&was.k==='run'?1.2:.6; } /* real-time floors: 1.2 s after a run, 0.6 s after anything, however hot the fish (director, 2026-11-23: runs mustn't crowd out the rest) */
function fightNew(dt){
  if(!G.fish){ G.st='idle'; return; }
  const f=G.fish; if(f.kind!=='fish'){ G.flashT=0; snagFight(dt); return; } /* no hook flash in an oddity's fight: it never faded there and left the screen white (bug, director 2026-11-23) */
  maybeEatEvent(dt); eatTick(dt);
  if(f.shiny===2){ G.behT=(G.behT||0)-dt; if(G.behT<=0){ G.behT=rnd(2.2,3.6); const ks=Object.keys(BEH); f.beh=ks[Math.floor(Math.random()*ks.length)]; } }
  const rk=fishRank(f), tk=Math.min(5,rk+(f.shiny===2?1:0)) /* Cam: titled shinies fight much harder */, B=BEH[f.beh]||BEH.calm, wc=ffWeightClass(f), kg=f.kg||.1;
  const AV=ffAvg(S.loc), rel=clamp(((f.str||1)/AV.str+kg/AV.kg)/2,.3,3), over=clamp(fishPull(f)/Math.max(.1,anglerStr()),.2,4), gearK=clamp(Math.sqrt(over),.6,1.6);
  const lively=clamp(.2+.3*(f.th||.4)+.25*(f.aggr||.3)+.05*tk,0,1); /* Cam: commons are lazier */
  const fk=ffFightK(f), I=(.6+.4*G.temper/3)*(1+.1*tk)*(tk>=4?1.25:1)*fk; /* Cam: temper sets how intense a move is; rarity too (legendary and mythic moves hit hardest) */
  const wtK=clamp(.45+.55*(1-Math.exp(-kg/(AV.kg*1.2))),.45,1); /* Cam: tension from moves grows with weight, levelling off at both ends */
  /* the groove (Claude's idea, Feel lab "Groove bonus"): between moves, keeping the line between 50% and 80% while you reel brings the fish in 15% faster; it takes feathering the reel, so it rewards a steady hand */
  const inGroove=(FEEL.groove||0)>0&&!G.ffA&&!G.tell&&G.sta>0&&G.ten>=50&&G.ten<=80; G.grooveT=inGroove&&(V3ON?G.prevRin>0:G.hold)?(G.grooveT||0)+dt:0; if(G.grooveT>=1.2&&!G.groovePaid){ G.groovePaid=1; feelPop('In the groove!'); feelCombo(1); } if(!G.grooveT) G.groovePaid=0;
  const reel=reelSpeed()*(spec('brawler')?1.2:1)*(maxed('strong')&&G.fightT<2?2:1)*feelReelK()*(G.grooveT>0?1+.15*FEEL.groove:1); /* Feel lab: the combo and the groove speed the reel */
  const rin=V3ON?reelInput(dt):(G.hold?1:0); G.fightT=(G.fightT||0)+dt; G.chainCD=Math.max(0,(G.chainCD||0)-dt);
  // temper: up while you reel; down when you stop, fastest on a tired fish (0 within 1 s for the weakest, 3 s for the strongest)
  /* Cam, 2026-11-23: temper rises much faster the longer you keep reeling and falls faster the longer you rest (exponential both ways;
     Feel lab "Temper curve": 0 = steady as before) */
  G.reelHold=rin>.5?(G.reelHold||0)+dt:0; G.restHold=rin<=.5?(G.restHold||0)+dt:0; const tcurve=h=>1+(FEEL.tx||0)*(.45*Math.exp(Math.min(h,3)*.85)-.45);
  if(rin>0) G.temper=Math.min(3,G.temper+dt*rin*(.3+.9*(f.aggr||.3))*tempMult()*tcurve(G.reelHold));
  if(rin<1) G.temper=Math.max(0,G.temper-dt*(1-rin)*FF.TEMPER_DROP*(maxed('softtouch')?2:1)*tcurve(G.restHold)); /* Cam: full to empty in about 3 s when you stop (faster with the curve) */
  // the fish's next move: rests run down faster the higher its temper (Cam: full temper = rapid moves)
  if(G.tell){ G.tell.t-=dt; if(G.tell.t<=0){ const k=G.tell.k, st=G.tell.st; G.tell=null; if(G.ev==='tell') G.ev=null; ffStart(f,rk,tk,I,lively,k,st); } } /* Feel lab: the warning runs out, the move starts */
  else if(!G.ffA&&G.dartNext){ G.ffRest-=dt; if(G.ffRest<=0){ G.dartNext=false; ffStart(f,rk,tk,I,lively,'run','dart',true); } } /* the next dart of a darting run */
  else if(!G.ffA){ G.ffRest-=dt*ffRate(); G.ffMin=Math.max(0,(G.ffMin||0)-dt); if(G.ffRest<=0&&G.ffMin<=0){ if(G.sta<=0&&Math.random()>.12) G.ffRest=rnd(2,4); /* Cam: a tired fish rarely moves */ else { G.swim=null; const k=ffPick(f,rk,waterDeep(S.loc)), st=k==='run'?ffRunStyle(f):null; if(FEEL.tell>0&&k!=='jump'){ G.tell={k,st,t:FEEL.tell}; G.ev='tell'; sfx.warn(); } else ffStart(f,rk,tk,I,lively,k,st); } } }
  // between moves: still, or swimming toward you (Cam: unannounced; 0.25-3 s; rarer fish less often and for shorter)
  if(!G.ffA && G.sta>0){ if(G.swim){ G.swim.t-=dt; if(G.swim.t<=0) G.swim=null; }
    G.swimT-=dt; if(G.swimT<=0){ G.swimT=rnd(FF.SWIM_EVERY[0],FF.SWIM_EVERY[1]); if(!G.swim && Math.random()<FF.SWIM_P[tk]) G.swim={t:clamp(rnd(FF.SWIM_T[0],FF.SWIM_T[1])*(1-.1*tk),FF.SWIM_T[0],FF.SWIM_T[1]), k:rnd(FF.SWIM_K[0],FF.SWIM_K[1])}; } }
  else if(G.ffA) G.swim=null;
  let gainK=G.surge3?0:(G.swim?G.swim.k:1), outV=0, tenRate=0; const A=G.ffA; const runV=(.8+1.0*rel)*(1+.06*tk)*(1+.2*Math.log10(1+kg))*(.5+.5*G.sta)*I*gearK*(1-rodBonus('grip'))*(1-.04*pr('grappler'));
  if(A){ A.t+=dt;
    if(A.k==='shake'){ if(wc>=1) gainK=.45; tenRate=70*wtK*I; }
    else if(A.k==='run'){ const sk=A.style==='dart'?1.6:A.style==='long'?.55:1, tq=A.style==='dart'?1.5:A.style==='long'?.45:1; gainK=A.style==='long'?(wc>=2?.35:wc===1?.6:1):(wc===1?.4:wc>=2?0:1); if(wc===3) outV=runV*sk; if(wc>=1) tenRate=(70+20*rel)*wtK*I*tq; G.run=true; } /* a dart strips line fast and strains it hard; a long run pulls gently and lets short pulls win some back */
    else if(A.k==='jump'){ if(A.t<JUMP_WINDUP){ G.ev='windup'; G.evDur=JUMP_WINDUP-A.t; }
      else { if(G.ev!=='jump'){ G.ev='jump'; splash(G.bob.x,G.bob.y,14); sfx.jump(); } G.evDur=Math.max(0,A.dur-A.t);
        if(!A.away) gainK=1.6; /* Cam: a jump toward you is the time to reel */
        else { gainK=wc===1?.4:wc>=2?0:1; if(wc===3) outV=runV*1.2; if(wc>=1) tenRate=140*wtK*I; } } }
    else if(A.k==='dive'){ gainK=0; const inZ=G.ten>=A.zone-FF.DIVE_HALF&&G.ten<=A.zone+FF.DIVE_HALF; A.inZ=inZ; const add=Math.min(A.max-A.got,(4+3*rel)*I*FF.DIVE_RATE*(inZ?.3:1)*dt); A.got+=add; G.d+=add; G.dd+=add; tenRate=48;
      A.inZT=inZ?(A.inZT||0)+dt:0; if(A.inZT>=FF.DIVE_HOLD||A.got>=A.max-1e-6) A.t=A.dur; } /* Cam: holding the band for 1.5 s stops the dive at once */
    /* Feel lab, the right reaction pays: ease off in a run, a shake or a jump away; reel into a jump toward you; hold the dive band */
    if(A.k==='run'&&A.style==='long'){ const press=rin>0&&!(G.prevRin>0); A.holdT=rin>0?(A.holdT||0)+dt:0; /* a long run: short pulls in rhythm pay; holding on strains the line */
      if(press){ const gap=A.t-A.lastPress; if(gap>.18&&gap<.9){ A.taps++; G.sta=Math.max(0,G.sta-.012*Math.max(.5,FEEL.counter||0)); G.dQ=(G.dQ||0)+.25; if(A.taps===2) feelPop('Steady!'); if(A.taps%3===0){ feelCombo(1); A.dur=Math.max(A.t+.2,A.dur-.9); } } /* every 3 good pulls: +1 combo and the run 0.9 s shorter (Cam, 2026-11-23: back to 3; was every 5, and 0.3 s off each pull) */ A.lastPress=A.t; }
      if(A.holdT>1.1&&!A.bad){ A.bad=1; feelCombo(-1); } }
    else if(FEEL.counter>0){ const live=!(A.k==='jump'&&A.t<JUMP_WINDUP), good=!live?false:A.k==='dive'?!!A.inZ:(A.k==='jump'&&!A.away)?rin>.6:rin<.25;
      if(good){ A.good=(A.good||0)+dt; G.sta=Math.max(0,G.sta-dt*.035*FEEL.counter*(A.style==='dart'?1.5:1)); if(!A.paid&&A.good>=.4){ A.paid=1; feelPop(A.k==='dive'?'Held it!':(A.k==='jump'&&!A.away)?'Reeled in!':A.style==='dart'?'Let it dart!':'Nice!'); feelCombo(1); } } /* letting a dart go tires the fish faster */
      else if(live&&rin>0&&G.ten>80&&!A.bad){ A.bad=1; feelCombo(-1); } }
    if(A.t>=A.dur){ if(A.k==='jump') splash(G.bob.x+(A.away?30:-30),G.bob.y,18); ffEnd(f,tk,lively); } }
  if(tenRate>0) tenRate*=1+.7*(FEEL.tx||0)*clamp((G.temper||0)/3,0,1); /* Cam, 2026-11-23: the more temper, the harder every move pulls the line tight */
  // reeling: a fresh fish holds against you by rank (only fish of 1.5 lb and up); a tired one comes in at full speed
  if(rin>0){ const tired=G.sta<=0, fast=tired?(1+FF.TIRED_FAST[tk])/FF.TIRED_SLOW[tk]:1, res=wc>=1?clamp(FF.RESIST[tk]*Math.pow(Math.max(0,G.sta),.6)*(B.heavy?1.1:1),0,.97):0, gain=Math.min(reel*rin*(1-res)*gainK*fast, FF.FAR_M*fast/(tired?3:FF.SHORT_T[tk]*FEEL.len))*dt; /* Cam: a tired fish comes in 10-60% faster by rarity */ /* Cam: never faster than its rarity's shortest time while it has fight; a tired fish comes in at full speed (about 3 s from the far edge at most) */
    if(G.dd>0){ const back=Math.min(G.dd,.75*gain); G.dd-=back; } G.d-=gain; /* Cam: dive distance comes back at a 75% rate */
    const intoMove=A&&!(A.k==='jump'&&!A.away&&A.t>=JUMP_WINDUP)?FF.ACT_DRAIN:1; /* Cam: reeling into a move (not a jump toward you) drains its Fight 1.5x */
    G.sta=Math.max(0,G.sta-intoMove*rin*dt/(FF.TIRE_T[tk]*fk*FEEL.len*clamp(Math.sqrt(over),1,2)*(B.heavy?1.15:1)*(1+.5*(fightVoy()-1)))*(1-.25*G.temper/3)); /* Cam: the temper keeps its Fight from draining */
    G.tickT-=rin*dt; if(G.tickT<=0){ G.tickT=.07; sfx.tick(); } }
  if(rin<1 && outV>0) G.d+=outV*(1-rin)*dt; /* only a fish over 5 lb takes line, and only while you let it */
  // tension: moves strain the line while you reel into them; between moves it settles; letting go lets it fall (slower for heavy fish)
  const tm=Math.max(.7,tensionMult()), tgK=clamp(Math.pow(over,.25),.85,1.4); /* Cam: tension cuts never make the dive band impossible, and gear eases a move's strain but never removes it */
  if(rin>0){ if(tenRate>0) G.ten+=Math.min(75*(1+.35*(FEEL.tx||0)*clamp((G.temper||0)/3,0,1)),tenRate*tm*tgK)*rin*dt; /* never from 0 to a snap in an instant (a hot-tempered fish gets closer) */
    else if(!(A&&A.k==='jump'&&!A.away&&A.t>=JUMP_WINDUP)) G.ten+=(FF.TEN_RISE[0]+FF.TEN_RISE[1]*Math.min(1,over)*(.3+.7*G.sta)*wtK)*tensionMult()*(1+FF.TEMPER_TEN*Math.pow(clamp(((G.temper||0)-1.5)/1.5,0,1),1.5))*rin*dt; } /* Cam: reeling builds tension slightly, also between moves; it never falls while you reel */
  if(rin<1) G.ten=Math.max(0,G.ten-(1-rin)*dt*(A&&!(A.k==='jump'&&!A.away)?FF.TEN_DROP_ACT:FF.TEN_DROP)); /* Cam: easing up drops it steadily, 35 a second, a third of that during a move */
  if(A&&A.k==='jump'&&!A.away&&A.t>=JUMP_WINDUP) G.ten=Math.max(0,G.ten-30*dt);
  // a tired fish: "Reel hard!"; left 10 s it gets one Second wind (back to half its Fight)
  // Second winds (Cam): the first as before (10 s tired, back to half); rare and epic fish may get 1 more, legendary and mythic 2 more,
  // each a 50/50 flip after 5 s tired, then 3 s, then every 1 s; a legendary or mythic's third waits twice as long and gives 25%
  if(G.sta<=0){ G.tiredT=(G.tiredT||0)+dt/FF.TIRED_SLOW[tk]; const n=G.swN||0, sw=to=>{ G.swN=n+1; G.swUsed=true; G.sta=to; G.tiredT=0; G.swStep=0; G.swNext=0; G.swT=1.4; sfx.warn(); if(V3ON) vib([30,30,30]); };
    if(n===0){ if(G.tiredT>=FF.SW_AFTER*FEEL.sw) sw(FF.SW_TO); }
    else if(n<=FF.SW_EXTRA[rk]){ const k2=n===2?2:1; if(!G.swNext) G.swNext=FF.SW_WAITS[0]*k2*FEEL.sw; if(G.tiredT>=G.swNext){ if(Math.random()<.5) sw(n===2?FF.SW_LAST_TO:FF.SW_TO); else { G.swStep=Math.min(FF.SW_WAITS.length-1,(G.swStep||0)+1); G.swNext=G.tiredT+FF.SW_WAITS[G.swStep]*k2*FEEL.sw; } } } }
  else G.tiredT=0;
  if(G.swT) G.swT=Math.max(0,G.swT-dt);
  if(G.ten>75 && rin>0){ G.warnT-=dt; if(G.warnT<=0){ G.warnT=.25; sfx.warn(); if(V3ON) vib(15); } }
  /* the opening surge of a close-hooked rare fish: it takes line for 3 s whatever its weight; reeling against it only builds tension */
  if(G.surge3){ const P3=G.surge3; P3.t+=dt; if(P3.t<3){ G.d+=P3.m/3*dt; G.run=true; if(rin>0) G.ten+=45*rin*dt*tensionMult(); } else { G.surge3=null; if(!G.ffA) G.run=false; } }
  // a predator that swallowed your catch strips line (n_play.js), as before
  if(G.strip){ const P=G.strip; P.t+=dt; const k=Math.min(1,P.t/P.dur), e=1-Math.pow(1-k,2); G.d=Math.max(G.d,P.from+(P.to-P.from)*e); G.run=true; if(rin>0) G.ten+=EAT_STRIP_TEN*rin*dt*tensionMult(); if(k>=1){ G.strip=null; if(!G.ffA) G.run=false; } }
  /* Feel lab: the perfect pull (press reel inside the glowing window as a move ends), the hook flash, pop-ups, a mistake at the snap line */
  { const press=rin>0&&!(G.prevRin>0); if(G.ppw>0){ G.ppw-=dt; if(press&&G.sta>0){ G.ppw=0; G.sta=Math.max(0,G.sta-.1*FEEL.pull); G.dQ=(G.dQ||0)+1.2*FEEL.pull; feelPop('Perfect pull!'); feelCombo(1); try{ tone(880,.08,'triangle',.06); }catch(e){} } }
    G.prevRin=rin; if(G.flashT>0) G.flashT=Math.max(0,G.flashT-dt); if(G.pops){ for(const p of G.pops) p.t+=dt; G.pops=G.pops.filter(p=>p.t<1.1); }
    if(G.ten>92&&rin>0&&(G.combo||0)>0&&!G.ffA) feelCombo(-1); }
  if(G.dQ>0){ const st=Math.min(G.dQ,Math.max(.05,G.dQ*dt*8)); G.d=Math.max(.5,G.d-st); G.dQ-=st; } /* line won back by a reward comes in over a moment, so the float glides instead of jumping (bug: "landing a combo reaction, the game jumps", director 2026-11-23) */
  G.noReelT=rin>0?0:(G.noReelT||0)+dt;
  const frac=clamp((G.d-(G.dd||0))/G.d0,0,1.6), x0=W*.24, x1=castX(G.lastCast);
  G.bob.x=x0+(x1-x0)*Math.min(frac,1.25)+(G.run?Math.sin(performance.now()/90)*3:0)+(G.ffA&&G.ffA.style==='dart'?G.ffA.dir*Math.sin(Math.min(1,G.ffA.t/G.ffA.dur)*Math.PI)*W*.025:0) /* a dart zigzags */+(G.ev==='shake'?Math.sin(performance.now()/30)*3:0)+(G.tell?Math.sin(performance.now()/22)*2:0); G.bob.x=clamp(G.bob.x,W*.2,W*.93); /* the fight never leaves the screen (director, 2026-11-22: "fish fights keep escaping the viewable screen") */ G.bob.y=waterY(G.bob.x);
  if(G.ten>=100){ G.ten=100; G.fullT=rin>0?(G.fullT||0)+dt:0; } else G.fullT=0;
  if(G.fullT>0 && maxed('steady') && !G.saved){ G.saved=true; G.ten=65; G.fullT=0; G.hold=false; toast('Second wind! Your line held.'); tone(700,.15,'triangle',.07); }
  if(G.fullT>=FF.SNAP_HOLD) endFight('snap'); /* Cam: the line goes after about a third of a second of reeling at 100% (FF.SNAP_HOLD) */
  else if(G.d>=G.maxOut) endFight('spool');
  else if(G.noReelT>=FF.NOREEL) endFight('escape'); /* Cam: 10 s without reeling and it swims off */
  else if(G.d<=0){ if(FEEL.juice&&(rk>=3||rel>1.5)){ splash(G.bob.x,G.bob.y,34); try{ tone(523,.09,'triangle',.07); setTimeout(()=>tone(659,.09,'triangle',.07),90); setTimeout(()=>tone(784,.18,'triangle',.08),180); }catch(e){} if(V3ON) vib([40,30,90]); } /* landing a big one (Claude's idea): a big splash, a rising chime and a buzz */ endFight('caught'); } }
// the fight's one-line instruction, shared by the PC panel (d_draw.js) and the phones' card (mobile/fight08.js)
function fightMsg(danger,oddDanger){ const NF=fishNew(), odd=G.fish&&G.fish.kind!=='fish';
  if(odd) return G.ev==='snag'?'Snagged!':oddDanger?'Ease off!':'Dead Weight';
  if(NF&&G.tell) return G.tell.k==='dive'?'It’s about to dive!':G.tell.k==='run'?(G.tell.st==='dart'?'It’s about to dart!':G.tell.st==='long'?'It’s about to run!':'It’s about to run!'):'Head shake coming!'; /* Feel lab */
  if(NF&&G.ppw>0&&!G.ffA) return 'Pull now!';
  return G.swT>0?'Second wind!':G.ev==='windup'?'It’s jumping!':G.ev==='jump'?(NF&&!G.jumpAway?'Reel now!':'Let go!'):G.ev==='dive'?'It’s diving!':G.ev==='shake'?'Head shake!':G.run?(NF&&G.ffA&&G.ffA.style==='dart'?'It’s darting':NF&&G.ffA&&G.ffA.style==='long'?'It’s running!':'It’s running!'):NF&&FEEL.read&&G.swim?'Swimming in, reel!':NF&&G.sta<=0?'Reel hard!':(NF?G.temper>2:G.temper>1.7)&&G.hold?'Careful!':danger?'Ease off!':G.hold?'Reeling…':'Hold to reel'; }
// the dive's tension band (Cam: 21.25% wide since 2026-11-23, was 25%; light magenta while the line is inside it)
const fightZone = () => fishNew()&&G.dive&&G.ev==='dive' ? {lo:(G.dive.zone-FF.DIVE_HALF)/100, hi:(G.dive.zone+FF.DIVE_HALF)/100, inZ:!!G.dive.inZ} : null;
/* special fish fight harder (Cam, 2026-11-23: "if the fish is a shiny, hybrid, titled, etc. they need to have noticeably more fight"): their
   moves hit harder and their Fight lasts longer by this much. A shiny a little more; a titled (prismatic) one by its tier; a hybrid by its
   size against its own kind's usual weight, bigger ones far more, small ones still a touch more (all Feel calls) */
const FF_SPECIAL={shiny:1.12, titled:{rainbow:1.2,starry:1.3,spectral:1.4,ancient:1.55}, hybrid:[1.05,1.2,1.65]}; /* hybrid: smallest, usual size, largest */
function ffFightK(f){ if(!f||f.kind!=='fish'||!f.sp) return 1; let k=1;
  if(f.shiny===2) k*=FF_SPECIAL.titled[f.pv]||FF_SPECIAL.titled.rainbow; else if(f.shiny===1) k*=FF_SPECIAL.shiny;
  if(f.hy){ const R=(f.kg||.1)/((f.sp.min+f.sp.max)/2), H=FF_SPECIAL.hybrid, u=clamp(Math.log(R)/Math.log(8),-1,1); k*=u<0?H[1]+(H[1]-H[0])*u:H[1]+(H[2]-H[1])*u; } /* 8x lighter or heavier is the end of the scale */
  return k; }
