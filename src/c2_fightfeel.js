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
//  - a tired fish reels in faster by rarity (common 60% ... mythic 10%)
//  - Second winds: the first is as before; rare and epic fish may get 1 more, legendary and mythic 2 more, each a 50/50 flip after
//    5 s tired, then 3 s, then every 1 s; a legendary or mythic's third waits twice as long and gives only 25% Fight
//  - in waters with dives a third of runs are dives; a dive lasts 5-20 s and stops once tension stays in its band for 1.5 s; it pulls
//    line more slowly but can take far more; a perfect hook holds the fish still for 1.5 s; the spool takes 200 m
const FF = { FAR_M:40, SPOOL_M:200, LB:.4536,
  TEN_RISE:[3,4],                   /* tension per second while you reel between moves: base + up to this much more for a strong fish (Feel call) */
  TEN_DROP:35, TEN_DROP_ACT:35/3,   /* Cam: easing up drops tension 35 a second, a third of that during a move */
  TEMPER_DROP:1, TEMPER_RATE:3,     /* Cam: temper empties in 3 s; full temper = moves up to 3 times as often (Feel call), each costing 1/3 */
  ACT_DRAIN:1.5,                    /* Cam: reeling into a move drains Fight 1.5 times as fast */
  SWIM_P:[.5,.45,.38,.32,.26,.2], SWIM_K:[1.25,1.5], SWIM_T:[.25,3], SWIM_EVERY:[1,2], /* Cam: still or swimming toward you between moves */
  TIRED_FAST:[.6,.45,.3,.25,.2,.1], /* Cam: a tired fish reels in this much faster, by rarity */
  SW_EXTRA:[0,0,1,1,2,2], SW_WAITS:[5,3,1], SW_LAST_TO:.25, /* Cam: extra Second winds by rarity, their flip waits, the legendary / mythic third */
  DIVE_SHARE:1/3, DIVE_T:[5,20], DIVE_HOLD:1.5, DIVE_RATE:.5, DIVE_MK:3, /* Cam: dives = a third of runs, 5-20 s, stopped by 1.5 s in the band, slower but longer */
  PERFECT_REST:1.5,                 /* Cam: after a perfect hook the fish doesn't fight for 1.5 s */
  RESIST:[.15,.55,.75,.86,.9,.92],   /* maths: how hard a fresh fish of each rank holds against your reel (C U R E L M) */
  TIRE_T:[15,15,16,19,23,24],       /* seconds of reeling a fish needs to tire with the best gear (Cam: the weakest never under 15 s) */
  SHARE:{shake:35,run:45,jump:20},  /* Cam: rough share of each move */
  CHAIN:[1,1,2,3,4,5],              /* Cam: moves in a row, by rank (common and uncommon never chain) */
  DIVE_N:[1,2,3,4,5,6], DIVE_M:[3,5,10,15,20,20], DEEP_M:100, /* Cam: dives per fight and metres if the band is missed; deep = 100 m+ (director) */
  SHORT_T:[3,6,10,15,20,30],        /* Cam: shortest landing time from the far edge by rank; a fish that still has fight never comes in faster */
  NOREEL:10, SNAP_HOLD:.5, SW_AFTER:10, SW_TO:.5, RUN_T:[1.5,5], REST_T:[1,5] };
// the switch: test builds only (Stats › Tester tools › Fishing: New / Old); read once, changed by the button
let FISH_OLD = (()=>{ try{ return !!window.DL_PREVIEW && localStorage.getItem('dl-fish-old')==='1'; }catch(e){ return false; } })();
const fishNew = () => !FISH_OLD;
function setFishOld(on){ FISH_OLD=!!on && !!window.DL_PREVIEW; try{ if(FISH_OLD) localStorage.setItem('dl-fish-old','1'); else localStorage.removeItem('dl-fish-old'); }catch(e){} }
// a water's depth in metres from its card ("500–3,000 m", "0101 m"); a water with no number at all is deep enough (Cam, section 7)
function waterDepthM(loc){ const L=LOCS.find(l=>l.id===loc); const s=String(L&&L.depth||''); const ns=(s.replace(/,/g,'').match(/\d+(\.\d+)?/g)||[]).map(Number); return ns.length?Math.max(...ns):Infinity; }
const waterDeep = loc => waterDepthM(loc) >= FF.DEEP_M;
// the average fish of a water (strength and weight), so runs scale with how strong a fish is for where it lives
const FF_AVG = {};
function ffAvg(loc){ if(FF_AVG[loc]) return FF_AVG[loc]; const ps=SP.filter(s=>s.loc===loc); const n=Math.max(1,ps.length);
  const str=ps.reduce((a,s)=>a+(s.str||1),0)/n, kg=ps.reduce((a,s)=>a+((s.min||0)+(s.max||0))/2,0)/n; return FF_AVG[loc]={str:Math.max(.5,str), kg:Math.max(.05,kg)}; }
// how many tries a bite gives before it's gone (Cam's list #10): one to start; Quick Reflexes at ranks 5 and 10 and a full Water Reader add one each
const hookTries = () => 1 + (pr('reflex')>=5?1:0) + (pr('reflex')>=10?1:0) + (maxed('reader')?1:0);
// a fresh fight on the new rules (called by hookIt)
function ffInit(){ const f=G.fish;
  G.d0=G.d=Math.max(3, FF.FAR_M*clamp(G.lastCast,0,1)); G.dd=0; G.maxOut=FF.SPOOL_M+rodSpool();
  G.ffA=null; G.ffRest=rnd(.7,1.4); G.chainOn=false; G.chainN=0; G.chainCD=0; G.diveN=0; G.tiredT=0; G.swUsed=false; G.noReelT=0; G.fullT=0; G.jumpAway=false; G.dive=null; G.ffOpen=false;
  /* Cam (section 2): a rare fish hooked close in runs first to gain some ground */
  if(f&&f.kind==='fish'&&fishRank(f)>=2&&G.d0<25){ G.ffOpen=true; G.ffRest=.35; }
  G.swim=null; G.swimT=rnd(FF.SWIM_EVERY[0],FF.SWIM_EVERY[1]); G.swStep=0; G.swNext=0; G.swN=0;
  if(G.perfect){ G.ffOpen=false; G.ffRest=Math.max(FF.PERFECT_REST,G.ffRest); } /* Cam: a perfect hook holds the fish still for 1.5 s */ }
// how often the fish acts, from its temper: 1x calm, up to FF.TEMPER_RATE x at full temper (Cam: full temper = rapid moves)
const ffRate = () => 1+(FF.TEMPER_RATE-1)*clamp((G.temper||0)/3,0,1);
function ffWeightClass(f){ const lb=(f.kg||0)/FF.LB; return lb<1.5?0:lb<3?1:lb<5?2:3; }
function ffPick(f,rk,deep){ if(G.ffOpen){ G.ffOpen=false; return 'run'; } const b=f.beh, w={shake:FF.SHARE.shake*(b==='thrash'?2.2:b==='sulk'?1.3:1), run:FF.SHARE.run*(b==='run'?1.8:b==='dart'?1.3:1), jump:FF.SHARE.jump*(b==='jump'?2.2:1)};
  let x=Math.random()*Object.values(w).reduce((a,c)=>a+c,0), k='shake'; for(const q in w){ x-=w[q]; if(x<=0){ k=q; break; } }
  if(k==='run' && deep && (G.diveN||0)<FF.DIVE_N[rk] && Math.random()<FF.DIVE_SHARE*(b==='dive'?1.6:1)) k='dive'; /* Cam: in waters with dives, a third of runs are dives */
  return k; }
function ffStart(f,rk,tk,I,lively){ const k=ffPick(f,rk,waterDeep(S.loc)), A={k,t:0};
  if(k==='shake'){ A.dur=rnd(.5,.9); G.ev='shake'; sfx.warn(); }
  else if(k==='run'){ A.dur=clamp(FF.RUN_T[0]+(FF.RUN_T[1]-FF.RUN_T[0])*(.25*lively+.35*(G.temper/3)+.4*tk/5)*rnd(.7,1.15),FF.RUN_T[0],FF.RUN_T[1]); G.run=true; splash(G.bob.x,G.bob.y,6+tk*4); }
  else if(k==='jump'){ A.dur=JUMP_WINDUP+.85; A.away=Math.random()<.5; G.ev='windup'; G.evDur=JUMP_WINDUP; G.jumpAway=A.away; }
  else { A.dur=FF.DIVE_T[0]+(FF.DIVE_T[1]-FF.DIVE_T[0])*clamp(.55*tk/5+.25*lively+.2*Math.min(1,I-.6),0,1); A.zone=rnd(35,65); A.max=FF.DIVE_M[rk]*FF.DIVE_MK*(.6+.4*Math.min(1,I)); A.got=0; A.inZT=0; /* Cam: 5 s at least, up to 20 s; far more line in reach */ G.diveN=(G.diveN||0)+1; G.dive=A; G.ev='dive'; G.run=true; splash(G.bob.x,G.bob.y,18); sfx.warn(); setTimeout(()=>sfx.warn(),140); if(V3ON) vib([60,40,60]); }
  G.sta=Math.max(0,G.sta-({shake:.015,run:.03,jump:.035,dive:.045}[k])/ffRate()); /* Cam: a move costs Fight in proportion to how often the temper makes it come (twice as often, half the cost) */
  G.ffA=A; }
function ffEnd(f,tk,lively){ G.ffA=null; G.ev=null; G.run=false; G.dive=null;
  const rest=FF.REST_T[0]+(FF.REST_T[1]-FF.REST_T[0])*(1-lively); /* Cam: 1 s for the liveliest fish, 5 s for the laziest */
  if(G.chainOn){ if(G.chainN<FF.CHAIN[tk] && Math.random()<.5){ G.chainN++; G.ffRest=rnd(.5,1); return; } G.chainOn=false; G.chainCD=5; } /* Cam: a coin flip for every chained move after the first */
  else if(FF.CHAIN[tk]>=2 && G.chainCD<=0 && G.sta>0 && Math.random()<.2){ G.chainOn=true; G.chainN=2; G.ffRest=rnd(.5,1); return; } /* Cam: about 1 move in 5 starts a chain */
  G.ffRest=rest*rnd(.8,1.2); }
function fightNew(dt){
  if(!G.fish){ G.st='idle'; return; }
  const f=G.fish; if(f.kind!=='fish'){ snagFight(dt); return; }
  maybeEatEvent(dt); eatTick(dt);
  if(f.shiny===2){ G.behT=(G.behT||0)-dt; if(G.behT<=0){ G.behT=rnd(2.2,3.6); const ks=Object.keys(BEH); f.beh=ks[Math.floor(Math.random()*ks.length)]; } }
  const rk=fishRank(f), tk=Math.min(5,rk+(f.shiny===2?1:0)) /* Cam: titled shinies fight much harder */, B=BEH[f.beh]||BEH.calm, wc=ffWeightClass(f), kg=f.kg||.1;
  const AV=ffAvg(S.loc), rel=clamp(((f.str||1)/AV.str+kg/AV.kg)/2,.3,3), over=clamp(fishPull(f)/Math.max(.1,anglerStr()),.2,4), gearK=clamp(Math.sqrt(over),.6,1.6);
  const lively=clamp(.2+.3*(f.th||.4)+.25*(f.aggr||.3)+.05*tk,0,1); /* Cam: commons are lazier */
  const I=(.6+.4*G.temper/3)*(1+.1*tk)*(tk>=4?1.25:1); /* Cam: temper sets how intense a move is; rarity too (legendary and mythic moves hit hardest) */
  const wtK=clamp(.45+.55*(1-Math.exp(-kg/(AV.kg*1.2))),.45,1); /* Cam: tension from moves grows with weight, levelling off at both ends */
  const reel=reelSpeed()*(spec('brawler')?1.2:1)*(maxed('strong')&&G.fightT<2?2:1);
  const rin=V3ON?reelInput(dt):(G.hold?1:0); G.fightT=(G.fightT||0)+dt; G.chainCD=Math.max(0,(G.chainCD||0)-dt);
  // temper: up while you reel; down when you stop, fastest on a tired fish (0 within 1 s for the weakest, 3 s for the strongest)
  if(rin>0) G.temper=Math.min(3,G.temper+dt*rin*(.3+.9*(f.aggr||.3))*tempMult());
  if(rin<1) G.temper=Math.max(0,G.temper-dt*(1-rin)*FF.TEMPER_DROP*(maxed('softtouch')?2:1)); /* Cam: full to empty in about 3 s when you stop */
  // the fish's next move: rests run down faster the higher its temper (Cam: full temper = rapid moves)
  if(!G.ffA){ G.ffRest-=dt*ffRate(); if(G.ffRest<=0){ if(G.sta<=0&&Math.random()>.12) G.ffRest=rnd(2,4); /* Cam: a tired fish rarely moves */ else { G.swim=null; ffStart(f,rk,tk,I,lively); } } }
  // between moves: still, or swimming toward you (Cam: unannounced; 0.25-3 s; rarer fish less often and for shorter)
  if(!G.ffA && G.sta>0){ if(G.swim){ G.swim.t-=dt; if(G.swim.t<=0) G.swim=null; }
    G.swimT-=dt; if(G.swimT<=0){ G.swimT=rnd(FF.SWIM_EVERY[0],FF.SWIM_EVERY[1]); if(!G.swim && Math.random()<FF.SWIM_P[tk]) G.swim={t:clamp(rnd(FF.SWIM_T[0],FF.SWIM_T[1])*(1-.1*tk),FF.SWIM_T[0],FF.SWIM_T[1]), k:rnd(FF.SWIM_K[0],FF.SWIM_K[1])}; } }
  else if(G.ffA) G.swim=null;
  let gainK=G.swim?G.swim.k:1, outV=0, tenRate=0; const A=G.ffA; const runV=(.8+1.0*rel)*(1+.06*tk)*(1+.2*Math.log10(1+kg))*(.5+.5*G.sta)*I*gearK*(1-rodBonus('grip'))*(1-.04*pr('grappler'));
  if(A){ A.t+=dt;
    if(A.k==='shake'){ if(wc>=1) gainK=.45; tenRate=70*wtK*I; }
    else if(A.k==='run'){ gainK=wc===1?.4:wc>=2?0:1; if(wc===3) outV=runV; if(wc>=1) tenRate=(70+20*rel)*wtK*I; G.run=true; }
    else if(A.k==='jump'){ if(A.t<JUMP_WINDUP){ G.ev='windup'; G.evDur=JUMP_WINDUP-A.t; }
      else { if(G.ev!=='jump'){ G.ev='jump'; splash(G.bob.x,G.bob.y,14); sfx.jump(); } G.evDur=Math.max(0,A.dur-A.t);
        if(!A.away) gainK=1.6; /* Cam: a jump toward you is the time to reel */
        else { gainK=wc===1?.4:wc>=2?0:1; if(wc===3) outV=runV*1.2; if(wc>=1) tenRate=140*wtK*I; } } }
    else if(A.k==='dive'){ gainK=0; const inZ=G.ten>=A.zone-12.5&&G.ten<=A.zone+12.5; A.inZ=inZ; const add=Math.min(A.max-A.got,(4+3*rel)*I*FF.DIVE_RATE*(inZ?.3:1)*dt); A.got+=add; G.d+=add; G.dd+=add; tenRate=48;
      A.inZT=inZ?(A.inZT||0)+dt:0; if(A.inZT>=FF.DIVE_HOLD||A.got>=A.max-1e-6) A.t=A.dur; } /* Cam: holding the band for 1.5 s stops the dive at once */
    if(A.t>=A.dur){ if(A.k==='jump') splash(G.bob.x+(A.away?30:-30),G.bob.y,18); ffEnd(f,tk,lively); } }
  // reeling: a fresh fish holds against you by rank (only fish of 1.5 lb and up); a tired one comes in at full speed
  if(rin>0){ const tired=G.sta<=0, fast=tired?1+FF.TIRED_FAST[tk]:1, res=wc>=1?clamp(FF.RESIST[tk]*Math.pow(Math.max(0,G.sta),.6)*(B.heavy?1.1:1),0,.97):0, gain=Math.min(reel*rin*(1-res)*gainK*fast, FF.FAR_M*fast/(tired?3:FF.SHORT_T[tk]))*dt; /* Cam: a tired fish comes in 10-60% faster by rarity */ /* Cam: never faster than its rarity's shortest time while it has fight; a tired fish comes in at full speed (about 3 s from the far edge at most) */
    if(G.dd>0){ const back=Math.min(G.dd,.75*gain); G.dd-=back; } G.d-=gain; /* Cam: dive distance comes back at a 75% rate */
    const intoMove=A&&!(A.k==='jump'&&!A.away&&A.t>=JUMP_WINDUP)?FF.ACT_DRAIN:1; /* Cam: reeling into a move (not a jump toward you) drains its Fight 1.5x */
    G.sta=Math.max(0,G.sta-intoMove*rin*dt/(FF.TIRE_T[tk]*clamp(Math.sqrt(over),1,2)*(B.heavy?1.15:1)*(1+.5*(fightVoy()-1)))*(1-.25*G.temper/3)); /* Cam: the temper keeps its Fight from draining */
    G.tickT-=rin*dt; if(G.tickT<=0){ G.tickT=.07; sfx.tick(); } }
  if(rin<1 && outV>0) G.d+=outV*(1-rin)*dt; /* only a fish over 5 lb takes line, and only while you let it */
  // tension: moves strain the line while you reel into them; between moves it settles; letting go lets it fall (slower for heavy fish)
  const tm=Math.max(.7,tensionMult()), tgK=clamp(Math.pow(over,.25),.85,1.4); /* Cam: tension cuts never make the dive band impossible, and gear eases a move's strain but never removes it */
  if(rin>0){ if(tenRate>0) G.ten+=Math.min(75,tenRate*tm*tgK)*rin*dt; /* never from 0 to a snap in an instant */
    else if(!(A&&A.k==='jump'&&!A.away&&A.t>=JUMP_WINDUP)) G.ten+=(FF.TEN_RISE[0]+FF.TEN_RISE[1]*Math.min(1,over)*(.3+.7*G.sta)*wtK)*tensionMult()*rin*dt; } /* Cam: reeling builds tension slightly, also between moves; it never falls while you reel */
  if(rin<1) G.ten=Math.max(0,G.ten-(1-rin)*dt*(A&&!(A.k==='jump'&&!A.away)?FF.TEN_DROP_ACT:FF.TEN_DROP)); /* Cam: easing up drops it steadily, 35 a second, a third of that during a move */
  if(A&&A.k==='jump'&&!A.away&&A.t>=JUMP_WINDUP) G.ten=Math.max(0,G.ten-30*dt);
  // a tired fish: "Reel hard!"; left 10 s it gets one Second wind (back to half its Fight)
  // Second winds (Cam): the first as before (10 s tired, back to half); rare and epic fish may get 1 more, legendary and mythic 2 more,
  // each a 50/50 flip after 5 s tired, then 3 s, then every 1 s; a legendary or mythic's third waits twice as long and gives 25%
  if(G.sta<=0){ G.tiredT=(G.tiredT||0)+dt; const n=G.swN||0, sw=to=>{ G.swN=n+1; G.swUsed=true; G.sta=to; G.tiredT=0; G.swStep=0; G.swNext=0; G.swT=1.4; sfx.warn(); if(V3ON) vib([30,30,30]); };
    if(n===0){ if(G.tiredT>=FF.SW_AFTER) sw(FF.SW_TO); }
    else if(n<=FF.SW_EXTRA[rk]){ const k2=n===2?2:1; if(!G.swNext) G.swNext=FF.SW_WAITS[0]*k2; if(G.tiredT>=G.swNext){ if(Math.random()<.5) sw(n===2?FF.SW_LAST_TO:FF.SW_TO); else { G.swStep=Math.min(FF.SW_WAITS.length-1,(G.swStep||0)+1); G.swNext=G.tiredT+FF.SW_WAITS[G.swStep]*k2; } } } }
  else G.tiredT=0;
  if(G.swT) G.swT=Math.max(0,G.swT-dt);
  if(G.ten>75 && rin>0){ G.warnT-=dt; if(G.warnT<=0){ G.warnT=.25; sfx.warn(); if(V3ON) vib(15); } }
  // a predator that swallowed your catch strips line (n_play.js), as before
  if(G.strip){ const P=G.strip; P.t+=dt; const k=Math.min(1,P.t/P.dur), e=1-Math.pow(1-k,2); G.d=Math.max(G.d,P.from+(P.to-P.from)*e); G.run=true; if(rin>0) G.ten+=EAT_STRIP_TEN*rin*dt*tensionMult(); if(k>=1){ G.strip=null; if(!G.ffA) G.run=false; } }
  G.noReelT=rin>0?0:(G.noReelT||0)+dt;
  const frac=clamp((G.d-(G.dd||0))/G.d0,0,1.6), x0=W*.24, x1=castX(G.lastCast);
  G.bob.x=x0+(x1-x0)*Math.min(frac,1.25)+(G.run?Math.sin(performance.now()/90)*3:0)+(G.ev==='shake'?Math.sin(performance.now()/30)*3:0); G.bob.y=waterY(G.bob.x);
  if(G.ten>=100){ G.ten=100; G.fullT=rin>0?(G.fullT||0)+dt:0; } else G.fullT=0;
  if(G.fullT>0 && maxed('steady') && !G.saved){ G.saved=true; G.ten=65; G.fullT=0; G.hold=false; toast('Second wind! Your line held.'); tone(700,.15,'triangle',.07); }
  if(G.fullT>=FF.SNAP_HOLD) endFight('snap'); /* Cam: the line goes after about half a second of reeling at 100% */
  else if(G.d>=G.maxOut) endFight('spool');
  else if(G.noReelT>=FF.NOREEL) endFight('escape'); /* Cam: 10 s without reeling and it swims off */
  else if(G.d<=0) endFight('caught'); }
// the fight's one-line instruction, shared by the PC panel (d_draw.js) and the phones' card (mobile/fight08.js)
function fightMsg(danger,oddDanger){ const NF=fishNew(), odd=G.fish&&G.fish.kind!=='fish';
  if(odd) return G.ev==='snag'?'Snagged!':oddDanger?'Ease off!':'Dead Weight';
  return G.swT>0?'Second wind!':G.ev==='windup'?'It’s jumping!':G.ev==='jump'?(NF&&!G.jumpAway?'Reel now!':'Let go!'):G.ev==='dive'?'It’s diving!':G.ev==='shake'?'Head shake!':G.run?'It’s running!':NF&&G.sta<=0?'Reel hard!':(NF?G.temper>2:G.temper>1.7)&&G.hold?'Careful!':danger?'Ease off!':G.hold?'Reeling…':'Hold to reel'; }
// the dive's tension band (Cam: 25% wide; light magenta while the line is inside it)
const fightZone = () => fishNew()&&G.dive&&G.ev==='dive' ? {lo:(G.dive.zone-12.5)/100, hi:(G.dive.zone+12.5)/100, inZ:!!G.dive.inZ} : null;
