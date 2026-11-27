
// =====================================================================
// 0.3 Rest mode: the angler sits down (on the dock edge, or in the Cozy Chair if it's on the dock)
// and fishes slowly by themselves while the game is open, even while you browse other menus.
// Bites come every 3 to 10 minutes (30 s to 3 min with Lazy Days maxed); the fish goes straight
// into the cooler. You can't fish actively while resting.
// =====================================================================
const RST={t:0,at:0,phase:'wait',k:0};
function restBiteTime(){ const z=clamp(pr('dozer')/5,0,1), lo=180-150*z, hi=600-420*z; return rnd(lo,hi); }
function restCast(){ RST.t=0; RST.at=restBiteTime(); RST.phase='wait'; RST.k=0; G.lastCast=.55; G.inHot=false; G.bob.x=castX(.55); G.bob.y=waterY(G.bob.x); }
function setRest(on){ if(on){ if(G.st!=='idle'){ toast('Finish what you are doing first, then rest.'); return; } if(S.cooler.length>=gv('cooler')){ toast('Your cooler is full. Sell or display some fish before resting.'); return; }
    S.settings.rest=true; G.st='rest'; restCast(); toast('You sit down and let the line drift. Fish bite slowly while you rest.'); }
  else { S.settings.rest=false; if(G.st==='rest'){ G.st='idle'; } toast('Back on your feet.'); }
  restBtn(); save(); }
function restTick(dt){ if(!S.settings.rest){ G.st='idle'; return; } RST.t+=dt; petNap(dt);
  if(RST.phase==='wait'){ G.bob.x=castX(.55); G.bob.y=waterY(G.bob.x); if(RST.t>=RST.at){ RST.phase='bite'; RST.k=0; splash(G.bob.x,G.bob.y,10); sfx.bite(); } }
  else if(RST.phase==='bite'){ RST.k+=dt; if(RST.k>1.2){ RST.phase='reel'; RST.k=0; } }
  else if(RST.phase==='reel'){ RST.k+=dt/11; const x0=castX(.55), x1=W*.24; G.bob.x=x0+(x1-x0)*RST.k+Math.sin(RST.t*3)*2; G.bob.y=waterY(G.bob.x); if(Math.random()<dt*1.5) splash(G.bob.x,G.bob.y,5);
    if(RST.k>=1){ restLand(); } } }
function restLand(){ const f=chooseCatch(); splash(G.bob.x,G.bob.y,18); sfx.pull();
  if(f.kind==='fish'){ journalAdd(f); S.cooler.push(coolerEntry(f)); S.stats.caught++; for(const p of (f.prey||[])){ journalAdd(p); if(S.cooler.length<gv('cooler')) S.cooler.push(coolerEntry(p)); }
    const xp=Math.round((5+Math.sqrt(f.value)*3)*RAR[f.sp.r].xp*xpMult()*(pr("dozer")>=5?1:.6)); addXP(xp); checkBounties(f.sp,f.kg); checkBounties2(f); taskProgress('catch',1,f.sp);
    toast('While resting you caught a '+(f.shiny===2?PRISM[f.pv].n+' prismatic ':f.shiny?'shiny ':'')+(f.hy?'hybrid ':'')+f.sp.name+' ('+kgStr(f.kg)+')'+(f.prey&&f.prey.length?', with a '+f.prey[0].sp.name+' inside':'')+'.'); sfx.catch(f.sp.r); }
  else if(f.kind==='junk'){ S.junk[f.item.id]=(S.junk[f.item.id]||0)+1; const c=earn(curLoc().loot*rnd(.8,1.2)*coinMult()); toast('While resting you fished up '+f.item.name+' (+'+fmt(c)+' coins).'); }
  else { S.owned.hats.push(f.hat.id); toast('While resting you fished up a hat: '+f.hat.name+'!'); }
  checkFeats(); save(); lastHud=''; if(S.tab==='cooler'||S.tab==='journal'||S.tab==='bounties') refreshAll();
  if(S.cooler.length>=gv('cooler')){ toast('Your cooler is full, so you stand up again.'); setRest(false); return; }
  restCast(); }
// where and how the angler sits: in the home's seat (every water has one since batch 5)
function restPose(dockY,pb,sc){ const sp=HOMEF[S.loc]; if(sp&&sp.seatH){ return {ax:HF.seatX()+3*sc, ay:dockY+pb, sit:{seat:sp.seatH,hang:false}, hx:10, hy:-26}; } /* the home's one seat (homes fixed, 2026-11-25) */ /* resting sits the angler in the home's seat (batch 5) */
  return {ax:W*.19-14*sc, ay:dockY+pb, sit:{seat:.5,hang:true}, hx:10, hy:-12}; }
// the toggle on the water
function restBtn(){ let b=$('resttog'); if(!b){ $('stage').insertAdjacentHTML('beforeend','<button id="resttog" class="resttog" type="button" title="Rest mode: sit down and fish slowly by yourself"></button>'); b=$('resttog');
    b.addEventListener('pointerdown',e=>e.stopPropagation()); b.addEventListener('click',e=>{ e.stopPropagation(); e.currentTarget.blur(); startAudio(); setRest(!S.settings.rest); }); }
  b.textContent=S.settings.rest?'☾ Resting':'☾ Rest'; b.setAttribute('aria-pressed',String(!!S.settings.rest)); }
document.head.insertAdjacentHTML('beforeend',`<style>.resttog{position:absolute;left:10px;bottom:10px;z-index:3;border-radius:12px;padding:6px 10px;font:600 12px system-ui;color:#e8eef8;background:linear-gradient(180deg,#1a2a44e6,#111c2ee6);border:1px solid #3a587888;box-shadow:0 4px 14px #02060f66;cursor:pointer}
.resttog[aria-pressed="true"]{border-color:#ffd36a;color:#ffe6a0;box-shadow:0 0 0 1px #ffd36a44,0 0 16px #ffd36a33}
@media (max-width:520px),(max-height:520px){ .resttog{left:6px;bottom:6px;padding:4px 8px;font-size:11px;border-radius:10px} }</style>`);
restBtn(); if(S.settings.rest){ setTimeout(()=>{ if(G.st==='idle'){ G.st='rest'; restCast(); } },300); }
if(/[?&]test\b/.test(location.search)) window.__rst=RST;
if(/[?&]test\b/.test(location.search)) window.__bal={ SP, SPI, catchOdds, rareMul, LOCS, GEAR, RODS, ROD_I, BAIT, PERKS, RAR, RAR_ROD:ROD_RARE, chooseCatch, rollFish, salePrice, sellMult, gv, fishRate, aqCap, TANK_COST, passNeed, PASS_XP, restBiteTime,
  bestLoot, crateCost, wheelCost, clawCost, locCost, coinMult, xpMult, G, S:()=>S, distanceMods, hybridChance, PRISM_SHARE, PRISM_VALUE, ATTS, ATT_COST:typeof ATT_COST!=='undefined'?ATT_COST:null, rodUpCost:typeof rodUpCost!=='undefined'?rodUpCost:null, TANK_RATE, AQ_MAG2, BEH, xpNeed, fight, hookIt, endFight, aqBuffsOf, junkChance, pickJunk, curLoc, bonus };
// QC (test mode only): fight simulator. Plays real fights with the real fight code: a simulated angler lets go when the
// tension passes a threshold or the fish runs or leaps, with a reaction delay. Restores the game state afterwards.
if(/[?&]test\b/.test(location.search)) window.__fightSim=(opts)=>{ const B=__bal, S0=S, snap=JSON.stringify(S); const gsnap={}; for(const k of Object.keys(G)){ try{ gsnap[k]=typeof G[k]==='object'&&G[k]!==null?JSON.parse(JSON.stringify(G[k])):G[k]; }catch(e){ oops('r_rest:JSON.parse',e); } } const out=[]; const os=window.save;
 try{ window.save=()=>{};
  for(const [loc,lvl,g,rod] of opts.places) for(const r of opts.rars) for(const [name,lag,thr] of opts.players){ S.loc=loc; S.lvl=lvl; ['rod','reel','line','hook','cooler','finder'].forEach((k,i)=>S.gear[k]=g[i]); S.rod=rod; S.baitSel='worm'; S.perks=opts.perks||{}; S.boons=opts.boons||{}; S.relics=opts.relics||[]; S.tides=opts.tides||0; /* no Boons or relics unless asked: the result no longer depends on the save it runs on (2026-11-25) */
   const pool=SP.filter(s=>s.loc===loc&&s.r===r); if(!pool.length) continue; let caught=0,ts=0,N=opts.N||100,peak=0;
   for(let i=0;i<N;i++){ const sp=pool[i%pool.length]; G.fish=rollFish(sp,{}); G.fish.kind='fish'; G.fish.shiny=0; G.st='reeling'; G.lastCast=.8; G.d0=G.d=6+.8*gv('rod')*.6; G.maxOut=gv('rod')+28; G.ten=10; G.sta=1; G.temper=0; G.run=false; G.runT=.8; G.ev=null; G.evT=1.6; G.hold=false; G.fightT=0; G.eatAt=null; G.eat=null; G.behT=0; G.tickT=1; G.surge=null; G.surgeN=0; G.dd=0; G.lastCast=opts.cast||.8; if(fishNew()) ffInit();
    let t=0; const dt=1/60, hist=[]; let pk=0;
    while(t<90){ hist.push({ten:G.ten,run:G.run,ev:G.ev,tmp:G.temper}); const o=hist[Math.max(0,hist.length-1-Math.round(lag/dt))]; G.hold = name==='holder'?true:fishNew()?((o.run||(o.ev==='jump'&&G.jumpAway)||o.ev==='shake')?o.ten<thr*.55:o.ev==='dive'?(G.dive?G.ten<G.dive.zone:false):!(o.ten>thr||o.tmp>2.4)):!(o.ten>thr || o.run || o.ev || o.tmp>1.2); /* new fight: short pulls during a move, hold the dive band */ fight(dt); pk=Math.max(pk,G.ten); t+=dt; if(G.st!=='reeling') break; }
    if(G.st==='landing'){ caught++; ts+=t; } peak+=pk; }
   out.push(loc+' '+['C','U','R','E','L','M'][r]+' '+name+': '+Math.round(caught/N*100)+'% in '+(caught?(ts/caught).toFixed(1):'-')+'s peak '+Math.round(peak/N)); }
 }catch(e){ out.push(String(e.stack).slice(0,300)); } finally { window.save=os; const o=JSON.parse(snap); for(const k of Object.keys(S)) delete S[k]; Object.assign(S,o); for(const k in gsnap) G[k]=gsnap[k]; G.st='idle'; G.fish=null; }
 return out; };
/* Pet Nap (Rest path, batch 5, replaces Homebody with the decorations): while you rest, each pet with you gains a bond point every
   minute (the favourite two), up to 20 a day from napping. First version; the amount is tuned in the balance batch. */
function petNap(dt){ if(!pathChosen().includes('petnap')) return; RST.nap=(RST.nap||0)+dt; if(RST.nap<60) return; RST.nap=0; const today=dayKey();
  for(const id of [S.pet,S.pet2]){ if(!id||!PETI[id]) continue; const b=S.bond[id]||(S.bond[id]={xp:0,day:today,today:0}); if(b.napDay!==today){ b.napDay=today; b.nap=0; } if(b.nap>=20) continue; b.nap++; b.xp+=id===S.pet?2:1; } }
