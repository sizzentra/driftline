// =====================================================================
// 0.4 Hunts (Fish Log). Pick up to HUNT_MAX fish per water to hunt: each hunted fish's catch weight is multiplied by
// HUNT_MULT inside catchW, the one weight function the catch roll and every on-screen odds number share, so the bonus
// applies after rarity, bait and other modifiers and before the draw is normalised. Time of day, the water's own pool
// and every other rule are untouched: a hunt can never make an unavailable fish appear, only more likely when it can.
// Hunts are for fish you have not found yet (see the balance notes in CLAUDE.md); catching one completes its hunt.
// =====================================================================
// 2026-11-18 (director: "previously caught fish should be allowed to be hunted, how else will you shiny hunt?"): fish you
// have already found can be hunted too, at a gentler HUNT_MULT_FOUND (balance: hunting your rarest found fish forever was
// a big value boost at 2×). A found fish's hunt is a shiny hunt: it ends when you land that fish shiny (if you already
// have its shiny, it runs until you stop it). A missing fish's hunt ends when you catch it, as before.
const HUNT_MAX=3, HUNT_MULT=2, HUNT_MULT_FOUND=1.5;
function huntsAt(loc){ const h=S.hunts&&S.hunts[loc]; return Array.isArray(h)?h:[]; }
const isHunted = s => !!(s&&S.hunts&&Array.isArray(S.hunts[s.loc])&&S.hunts[s.loc].includes(s.id));
const huntMult = s => S.journal[s.id] ? HUNT_MULT_FOUND : HUNT_MULT;
// which fish can be hunted: any fish of a water you have opened
function huntable(s){ return !!(s&&S.unlocked.includes(s.loc)); }
// keep saved hunts valid: known waters only, each fish real, at that water, huntable, no duplicates, at most HUNT_MAX
function cleanHunts(st){ const out={}; const src=st&&st.hunts&&typeof st.hunts==='object'?st.hunts:{};
  for(const L of LOCS){ const a=Array.isArray(src[L.id])?src[L.id]:[]; const seen=[]; for(const id of a){ const s=typeof id==='string'&&SPI[id]; if(!s||s.loc!==L.id||seen.includes(id)) continue; seen.push(id); if(seen.length>=HUNT_MAX) break; } if(seen.length) out[L.id]=seen; }
  return out; }
S.hunts=cleanHunts(S);
/* every load runs cleanHunts: a step of migrate() in c_logic.js */
// the weight: one multiplier, in the shared function
const _catchW_04=catchW;
catchW=function(s,pool,rare,b){ const w=_catchW_04(s,pool,rare,b); return isHunted(s)?w*huntMult(s):w; };
// start or stop a hunt; returns a short result the UI turns into feedback
function toggleHunt(id){ const s=SPI[id]; if(!s) return {ok:false, msg:'That fish does not exist.'};
  S.hunts=S.hunts||{}; const a=huntsAt(s.loc).slice(), i=a.indexOf(id), L=LOCS[locIdx(s.loc)];
  if(i>=0){ a.splice(i,1); if(a.length) S.hunts[s.loc]=a; else delete S.hunts[s.loc]; save(); return {ok:true, on:false, msg:'Stopped hunting'+(S.journal[id]?' '+s.name:' this fish')+'.'}; }
  if(!huntable(s)) return {ok:false, msg:'Open '+L.name+' first to hunt its fish.'};
  if(a.length>=HUNT_MAX) return {ok:false, full:true, msg:'All '+HUNT_MAX+' hunts at '+L.name+' are in use. Stop one to hunt this fish.'};
  a.push(id); S.hunts[s.loc]=a; save(); const found=!!S.journal[id], j=S.journal[id];
  return {ok:true, on:true, msg:found?('Shiny hunt: '+s.name+' turns up '+HUNT_MULT_FOUND+'× as often'+(j&&j.sh?' (you have its shiny already; stop the hunt any time)':' until you land a shiny one')+' ('+a.length+' / '+HUNT_MAX+').'):('Hunting this fish at '+L.name+': it now turns up '+HUNT_MULT+'× as often ('+a.length+' / '+HUNT_MAX+').')}; }
// a missing fish's hunt ends when you catch it; a found fish's (shiny) hunt ends when you land it shiny for the first time
const _landFish_hunt=landFish;
landFish=function(){ const f=G.fish, sp=f&&f.kind==='fish'?f.sp:null, hunted=sp&&isHunted(sp), j0=sp&&S.journal[sp.id], wasMissing=hunted&&!j0, shinyDone=hunted&&j0&&!j0.sh&&!!f.shiny; _landFish_hunt.apply(this,arguments);
  if(wasMissing||shinyDone){ const a=huntsAt(sp.loc).filter(x=>x!==sp.id); if(a.length) S.hunts[sp.loc]=a; else delete S.hunts[sp.loc]; save(); setTimeout(()=>{ toast(wasMissing?'🎯 Hunt complete: '+sp.name+' found!':'✦ Shiny hunt complete: a shiny '+sp.name+'!'); try{ sfx.catch(Math.max(2,sp.r)); }catch(e){ oops('bl_hunts04:sfx.catch',e); } },900); if(S.tab==='journal') renderPanel(); } };
if(/[?&]test\b/.test(location.search)) window.__hunt={toggleHunt, huntsAt, isHunted, huntable, cleanHunts, HUNT_MAX, HUNT_MULT, get:()=>JSON.parse(JSON.stringify(S.hunts)), set:h=>{ S.hunts=h; }};

// ---------------------------------------------------------------------
// Fish Log: a hunt bar for the water (Hunts 2 / 3, what they do, the fish being hunted), a toggle on every fish you can
// hunt, a highlight and a HUNTING tag on hunted fish, a "Hunting" filter, and the hunt in the fish's detail panel with
// its real chance per catch. Undiscovered fish stay silhouettes: a hunt shows nothing the log did not already show.
// ---------------------------------------------------------------------
function huntLabel(s){ return S.journal[s.id]?s.name:RAR[s.r].k+' fish'+(s.time!=='any'?' ('+(s.time==='night'?'night':'day')+')':''); }
function huntChance(s){ try{ const sh=catchOdds({loc:s.loc}).shares.find(([x])=>x.id===s.id); return sh?sh[1]:0; }catch(e){ oops('bl_hunts04:huntChance',e); return 0; } }
let huntFlash=null;
{ const _rj=renderJournal; renderJournal=function(P){ _rj(P); try{ if(encLoc==='junk') return; const L=LOCS[locIdx(encLoc)]; if(!L) return; const open=S.unlocked.includes(L.id), hs=huntsAt(L.id), mode=S.settings.logShow||'all';
    // the "Hunting" filter
    const show=P.querySelector('.logshow'); if(show&&!show.querySelector('[data-logshow="hunt"]')){ show.insertAdjacentHTML('beforeend',`<button class="chipb" type="button" data-logshow="hunt" aria-pressed="${mode==='hunt'}">🎯 Hunting ${hs.length}</button>`); show.querySelector('[data-logshow="hunt"]').onclick=e=>{ e.stopPropagation(); S.settings.logShow='hunt'; save(); renderPanel(); }; }
    // the hunt bar
    const grid=P.querySelector('.jgrid'); if(!grid) return;
    const chips=hs.map(id=>{ const s=SPI[id]; return `<button type="button" class="hunt-chip" data-huntsel="${id}" title="Show this fish"><i style="background:${RAR[s.r].c}"></i>${esc(huntLabel(s))}</button>`; }).join('');
    const bar=document.createElement('div'); bar.className='tile hunt-bar'+(huntFlash===L.id?' flash':''); bar.innerHTML=open?`<div class="row spread" style="gap:8px;flex-wrap:wrap"><div><span class="rar" style="color:#ffb36a">Hunts</span><h4>🎯 ${hs.length} / ${HUNT_MAX} at ${esc(L.name)}</h4></div>${hs.length?'':'<span class="badge">None yet</span>'}</div>
      <div class="meta">Pick up to ${HUNT_MAX} fish here. A fish you are missing turns up <b>${HUNT_MULT}× as often</b> until you catch it; a fish you have found turns up <b>${HUNT_MULT_FOUND}× as often</b> until you land it shiny. Every water keeps its own hunts.</div>${chips?`<div class="hunt-chips">${chips}</div>`:''}`
      :`<div class="meta">🎯 <b>Hunts</b>: open ${esc(L.name)} to hunt the fish you are missing here.</div>`;
    grid.parentNode.insertBefore(bar,grid);
    bar.querySelectorAll('[data-huntsel]').forEach(b=>b.onclick=e=>{ e.stopPropagation(); encSel=b.dataset.huntsel; renderPanel(); });
    // a toggle beside every fish card (cards are buttons, so the toggle sits next to it, not inside it)
    grid.querySelectorAll('.jcard[data-k]').forEach(c=>{ const s=SPI[c.dataset.k]; if(!s) return; const on=isHunted(s), can=huntable(s);
      if(mode==='hunt'&&!on) c.style.display='none'; else if(mode==='hunt') c.style.display='';
      const cell=document.createElement('div'); cell.className='jcell'+(on?' hunted':''); if(c.style.display==='none'){ cell.style.display='none'; c.style.display=''; } c.parentNode.insertBefore(cell,c); cell.appendChild(c);
      if(on){ c.classList.add('hunted'); c.insertAdjacentHTML('afterbegin','<span class="hunt-tag">HUNTING</span>'); }
      if(can||on){ const full=!on&&hs.length>=HUNT_MAX; const t=document.createElement('button'); t.type='button'; t.className='hunt-t'+(on?' on':'')+(full?' full':''); t.dataset.hunt=s.id; t.setAttribute('aria-pressed',on); t.setAttribute('aria-label',(on?'Stop hunting ':'Hunt ')+huntLabel(s));
        t.title=on?'Stop hunting this fish':full?'All '+HUNT_MAX+' hunts here are in use':'Hunt this fish: it turns up '+huntMult(s)+'× as often'; t.innerHTML=on?'🎯 Hunting':'🎯 Hunt'; cell.appendChild(t); } });
    if(mode==='hunt'){ const emp=P.querySelector('.empty'); if(emp) emp.remove(); if(!hs.length) grid.insertAdjacentHTML('beforebegin',`<div class="empty">No hunts at ${esc(L.name)} yet. Tap 🎯 Hunt on a fish you are missing.</div>`); }
    // the detail panel: hunt control, real chance per catch, and when it can bite
    const det=P.querySelector('.tile.detail'), sel=encSel&&SPI[encSel]; if(det&&sel&&sel.loc===L.id){ const on=isHunted(sel), ch=huntChance(sel), ok=timeOk(sel,phase());
      const box=document.createElement('div'); box.className='hunt-det'+(on?' on':'');
      const fnd=!!S.journal[sel.id];
      box.innerHTML=!open?'<span class="meta">Open this water to hunt this fish.</span>':
        `<div class="row" style="gap:10px;flex-wrap:wrap;align-items:center"><button type="button" class="btn sm ${on?'':'alt'}" data-hunt="${sel.id}">${on?'🎯 Stop hunting':fnd?'✦ Shiny hunt':'🎯 Hunt this fish'}</button><span class="meta">Chance per catch here${ok?'':' (when it bites)'}: <b>${ok?fmtOdds(ch):'—'}</b>${on?' · hunting: '+huntMult(sel)+'×':''}${ok?'':' · it only bites at '+(sel.time==='night'?'night':'day')}</span></div>`;
      const host=det.querySelector(':scope > div:last-child')||det; host.appendChild(box); }
    P.querySelectorAll('[data-hunt]').forEach(b=>b.onclick=e=>{ e.stopPropagation(); const r=toggleHunt(b.dataset.hunt); toast((r.ok?'🎯 ':'')+r.msg); if(r.full){ huntFlash=L.id; setTimeout(()=>{ huntFlash=null; },900); } try{ if(r.ok){ const fn=sfx[r.on?'hot':'lost']; fn&&fn(); } }catch(er){ oops('bl_hunts04:fn',er); } renderPanel(); });
  }catch(e){ console.error(e); } }; }
// on the water: the goal chip mentions your hunts here
const _nextGoal_hunt=nextGoal;
nextGoal=function(){ const gl=_nextGoal_hunt(); const n=huntsAt(S.loc).length; if(n&&gl&&!gl.live&&!gl.ready) gl.sub=(gl.sub?gl.sub+' · ':'')+'🎯 hunting '+n+' here'; return gl; };
document.head.insertAdjacentHTML('beforeend',`<style>
#panel .hunt-bar{margin:8px 0 10px;border-color:#ffb36a55}
#panel .hunt-bar.flash{animation:huntFlash .8s ease}
@keyframes huntFlash{0%,100%{box-shadow:inset 0 1px 0 #ffffff10}30%{box-shadow:0 0 0 2px #ffb36a,0 0 24px #ffb36a88}}
#panel .hunt-chips{display:flex;flex-wrap:wrap;gap:6px;margin-top:8px}
#panel .hunt-chip{display:inline-flex;align-items:center;gap:6px;padding:4px 10px;border-radius:999px;border:1px solid #ffb36a66;background:#ffb36a14;color:#ffe2c4;font-weight:700;font-size:12px;cursor:pointer}
#panel .hunt-chip i{width:8px;height:8px;border-radius:50%;flex:0 0 auto}
#panel .jgrid .jcell{position:relative;display:flex;flex-direction:column;min-width:0}
#panel .jgrid .jcell > .jcard{flex:1;width:100%}
#panel .jcard{position:relative}
#panel .jcard.hunted{border-color:#ffb36a!important;box-shadow:0 0 0 1px #ffb36a88,0 0 16px #ffb36a33!important}
#panel .jcard .hunt-tag{position:absolute;top:6px;left:6px;z-index:1;padding:1px 7px;border-radius:999px;background:#ffb36a;color:#2a1406;font-weight:900;font-size:9.5px;letter-spacing:.08em}
#panel .hunt-t{margin-top:5px;padding:5px 8px;border-radius:10px;border:1px solid #ffffff22;background:#ffffff0c;color:#cfdcea;font-weight:800;font-size:11.5px;cursor:pointer;min-height:30px}
#panel .hunt-t:hover{border-color:#ffb36a99;color:#ffe2c4}
#panel .hunt-t.on{background:#ffb36a;border-color:#ffb36a;color:#2a1406}
#panel .hunt-t.full{opacity:.55}
#panel .hunt-det{margin-top:10px;padding-top:10px;border-top:1px solid var(--line)}
#panel .hunt-det b{color:#ffe2c4}
@media (pointer:coarse){ #panel .hunt-t{min-height:38px} }
@media (prefers-reduced-motion:reduce){ #panel .hunt-bar.flash{animation:none} }
</style>`);
