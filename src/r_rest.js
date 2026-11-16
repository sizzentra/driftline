
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
function restTick(dt){ if(!S.settings.rest){ G.st='idle'; return; } RST.t+=dt;
  if(RST.phase==='wait'){ G.bob.x=castX(.55); G.bob.y=waterY(G.bob.x); if(RST.t>=RST.at){ RST.phase='bite'; RST.k=0; splash(G.bob.x,G.bob.y,10); sfx.bite(); } }
  else if(RST.phase==='bite'){ RST.k+=dt; if(RST.k>1.2){ RST.phase='reel'; RST.k=0; } }
  else if(RST.phase==='reel'){ RST.k+=dt/11; const x0=castX(.55), x1=W*.24; G.bob.x=x0+(x1-x0)*RST.k+Math.sin(RST.t*3)*2; G.bob.y=waterY(G.bob.x); if(Math.random()<dt*1.5) splash(G.bob.x,G.bob.y,5);
    if(RST.k>=1){ restLand(); } } }
function restLand(){ const f=chooseCatch(); splash(G.bob.x,G.bob.y,18); sfx.pull();
  if(f.kind==='fish'){ journalAdd(f); S.cooler.push(coolerEntry(f)); S.stats.caught++; for(const p of (f.prey||[])){ journalAdd(p); if(S.cooler.length<gv('cooler')) S.cooler.push(coolerEntry(p)); }
    const xp=Math.round((5+Math.sqrt(f.value)*3)*RAR[f.sp.r].xp*xpMult()*.6); addXP(xp); checkBounties(f.sp,f.kg); checkBounties2(f); taskProgress('catch',1,f.sp);
    toast('While resting you caught a '+(f.shiny===2?PRISM[f.pv].n+' prismatic ':f.shiny?'shiny ':'')+(f.hy?'hybrid ':'')+f.sp.name+' ('+kgStr(f.kg)+')'+(f.prey&&f.prey.length?', with a '+f.prey[0].sp.name+' inside':'')+'.'); sfx.catch(f.sp.r); }
  else if(f.kind==='junk'){ S.junk[f.item.id]=(S.junk[f.item.id]||0)+1; const c=earn(curLoc().loot*rnd(.8,1.2)*coinMult()); toast('While resting you fished up '+f.item.name+' (+'+fmt(c)+' coins).'); }
  else { S.owned.hats.push(f.hat.id); toast('While resting you fished up a hat: '+f.hat.name+'!'); }
  checkFeats(); save(); lastHud=''; if(S.tab==='cooler'||S.tab==='journal'||S.tab==='bounties') refreshAll();
  if(S.cooler.length>=gv('cooler')){ toast('Your cooler is full, so you stand up again.'); setRest(false); return; }
  restCast(); }
// where and how the angler sits: in the chair if it is on the dock, else on the dock edge
function restPose(dockY,pb,sc){ const items=dockView(); if(items.includes('chair')){ const PW=W*.19, ax0=W*.12, X0=W*.008, X1=PW-W*.012, P=dockPositions(items,(ax0-40*sc-X0)/(X1-X0),(ax0+12*sc-X0)/(X1-X0));
    return {ax:X0+P.chair*(X1-X0)+3*sc, ay:dockY+pb, sit:{seat:17,hang:false}, hx:10, hy:-26}; }
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
if(/[?&]test\b/.test(location.search)) window.__bal={ SP, SPI, LOCS, GEAR, RODS, ROD_I, BAIT, PERKS, RAR, RAR_ROD:ROD_RARE, chooseCatch, rollFish, salePrice, sellMult, gv, fishRate, aqCap, TANK_COST, passNeed, PASS_XP, restBiteTime,
  bestLoot, crateCost, wheelCost, clawCost, locCost, coinMult, xpMult, G, S:()=>S, distanceMods, hybridChance, PRISM_SHARE, PRISM_VALUE, ATTS, ATT_COST:typeof ATT_COST!=='undefined'?ATT_COST:null, rodUpCost:typeof rodUpCost!=='undefined'?rodUpCost:null, TANK_RATE, AQ_MAG2, BEH, xpNeed, fight, hookIt, endFight, aqBuffsOf, junkChance, pickJunk, curLoc, bonus };
