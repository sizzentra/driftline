// =====================================================================
// Phones, round 8: settings belong to the device (director, 2026-11-18: "we're even due for settings options separate to specific
// devices... decide what's necessary for settings options to make the user have control over what's necessary").
// Research (Apple HIG "Settings", Microsoft/Xbox accessibility guidance, mobile game support pages, WebKit status):
//  - Sound, controls, display and performance choices depend on the device in your hand (a PC's volume or "tap to aim" make no sense
//    on a phone), so they stay on this device. Moving progress (6-digit code, save code, cloud) carries your progress and the
//    gameplay choices (protect rare fish, mini-games, auto bait, sell filters), never this device's settings.
//  - Frame rate: phones offer 30 (battery saver: less heat and battery) / 60 / Max (the screen's own rate, e.g. 120 Hz Android).
//    iPhone browsers draw at most 60, so iPhone shows 30 / 60 only.
//  - Only settings that work on this device are shown: iPhone has no vibration and no page full screen in the browser, so those
//    two are hidden there. The help text speaks about touch only (no mouse wheel, no keyboard).
// Android + iPhone only.
// =====================================================================
const DEV_KEYS=['master','music','sfx','amb','musicOn','ambient','style','castMode','units','dist','hand','vibrate','effects','boostsOnScreen','hints','showFps','gfx','fpsCap','dockMini','hdrStat','logShow','vaultSort','hideGoal','lastPage','pageLast'];
const DEV_STORE='dl-device-settings-v1';
var DEV_GUARD=null;
const IS_IPHONE=()=>/iPhone|iPod/.test(navigator.userAgent)||(/[?&]test\b/.test(location.search)&&/[?&]iphone\b/.test(location.search));
{ let dev=null, cur=null; const done=new WeakSet(), _mig=migrate, DEF=fresh().settings||{};
  const read=()=>{ try{ const r=localStorage.getItem(DEV_STORE); return r?JSON.parse(r):null; }catch(e){ return null; } };
  const pick=st=>{ const o={}; if(st) for(const k of DEV_KEYS) if(st[k]!==undefined) o[k]=st[k]; return o; };
  let lastJ=null; const write=()=>{ try{ const j=JSON.stringify(dev); if(j===lastJ) return; localStorage.setItem(DEV_STORE,j); lastJ=j; }catch(e){} }; /* only when the settings changed (redundancies list B10: every save rewrote them) */
  const apply=s=>{ if(s&&s.settings&&dev){ for(const k of DEV_KEYS){ if(dev[k]!==undefined) s.settings[k]=dev[k]; else if(DEF[k]!==undefined) s.settings[k]=DEF[k]; else delete s.settings[k]; } } return s; };
  /* first run after this update: this device keeps the settings it has now */
  dev=read(); if(!dev||typeof dev!=="object"){ dev=pick(S.settings); write(); } apply(S); cur=S;
  /* a fresh start or a save arriving from anywhere (code, transfer, cloud, backup) keeps this device's settings */
  migrate=function(){ const s=apply(_mig.apply(this,arguments)); if(s&&typeof s==="object") done.add(s); return s; };
  /* any replaced save (progress reset, code, transfer, cloud, backup) gets this device's settings back before it is used or saved */
  const guard=()=>{ if(S!==cur){ if(!done.has(S)) apply(S); cur=S; } }; DEV_GUARD=guard;
  const _save=save; save=function(){ guard(); if(S&&S.settings){ dev=pick(S.settings); write(); } return _save.apply(this,arguments); };
  if(/[?&]test\b/.test(location.search)) window.__devSettings=()=>({store:read(), keys:DEV_KEYS.slice()}); }

// ---------- frame rate: the game's work runs only as often as the chosen rate (the display keeps its own timing) ----------
{ const _fr=frame; let ema=0, lastRaw=0, k=0;
  const capMs=()=>IS_IPHONE()?0:1000/60; /* Android draws 60 frames a second (on a 120 Hz screen too: director 2026-11-18, "his default was always working perfectly fine"), iPhone runs at its natural rate; no frame-rate setting on either phone, any old saved fpsCap is ignored */
  /* 2026-11-19 (director: "Android: Aquarium preview choppy"): the old limiter skipped by time, so on a 90 Hz screen it drew after
     11 ms, then 22 ms, then 11... (simulated: half the gaps short, half long) and on 144 Hz 14/21 ms: an uneven rhythm reads as
     stutter. Now it draws every n-th screen refresh, n = the smallest that stays at or under 60 a second: steady 60 on 60/120 Hz,
     steady 45 on 90 Hz, steady 48 on 144 Hz. The screen's rate is measured (adaptive screens change it), never assumed. */
  frame=function(now){ if(DEV_GUARD) DEV_GUARD(); const cap=MOB()?capMs():0;
    if(cap){ const d=now-lastRaw; lastRaw=now; if(d>3&&d<50) ema=ema?ema*.9+d*.1:d; const n=ema?Math.max(1,Math.ceil(cap/ema-.15)):1; if(++k<n){ requestAnimationFrame(frame); return; } k=0; }
    return _fr.apply(this,arguments); }; }

// ---------- the Settings page on phones ----------
{ const _rs=renderSettings;
  renderSettings=function(P){ _rs(P); if(!MOB()) return; try{ const ip=IS_IPHONE(), dev=ip?'iPhone':'phone';
    const sub=P.querySelector('h2 + .sub'); if(sub) sub.textContent='These settings belong to this '+dev+'. Moving your progress to another device keeps each device’s own settings.';
    const rowOf=b=>b&&b.closest('.toggle');
    if(ip){ const v=rowOf(P.querySelector('[data-act="tog"][data-k="vibrate"]')); if(v) v.remove(); } { const f=rowOf(P.querySelector('[data-act="fullscreen"]')); if(f) f.remove(); } /* no Full screen option on any phone: it is automatic (director 2026-11-18) */
    for(const m of P.querySelectorAll('.tile .meta')) if(/mouse wheel/i.test(m.textContent)) m.innerHTML='Reel by <b>holding</b> the water, or by <b>drawing circles</b> on it like a crank.';
    const fr=rowOf(P.querySelector('[data-act="tog"][data-k="showFps"]')); if(fr){ const b=fr.querySelector('b'), m=fr.querySelector('.meta'); if(b) b.textContent='Frame rate counter'; if(m) m.textContent='Shows the current frame rate in the corner of the water.'; }
    /* no frame-rate choice on phones (director, 2026-11-18: "Max completely messes up with phones; iPhone and Android locked, tested and built at 60, no choices, the exact same always"): the old 30 / 60 / Max chips are gone */
  }catch(e){} }; }

// ---------- the frame counter counts frames actually DRAWN (director, 2026-11-18: "30 fps saver mode brought his fps to 120"):
// the counter in bm_ui04 runs its own loop, so it measured the screen's refresh (120 Hz on a Pixel) even while the game drew only
// 30 frames. On phones it now shows drawn frames per second, the screen's rate and the slowest gap between drawn frames.
const MOB_DRAWN=[]; { const _dw=draw; draw=function(now){ const r=_dw.apply(this,arguments); try{ MOB_DRAWN.push(performance.now()); if(MOB_DRAWN.length>240) MOB_DRAWN.shift(); }catch(e){} return r; }; }
function mobFpsText(screenFps){ const now=performance.now(), d=MOB_DRAWN.filter(t=>now-t<2000); if(d.length<3) return null; let worst=0; for(let i=1;i<d.length;i++) worst=Math.max(worst,d[i]-d[i-1]); const fps=Math.round((d.length-1)*1000/(d[d.length-1]-d[0])); let res=''; try{ res=' · res '+(typeof MOB_DPR_CAP!=='undefined'?MOB_DPR_CAP:'?')+'x'; }catch(e){} return fps+' fps · screen '+screenFps+' Hz · slowest '+worst.toFixed(1)+' ms'+res; }

// ---------- test builds only: Graphics test (director, 2026-11-18: Android holds 30 but drops to 25-38 at 60 = each frame costs
// the phone ~30 ms). Each button switches one part of the water scene off, so the frame counter shows which part is too heavy on
// that phone. Nothing here exists in the release build (DL_PREVIEW), and every part comes back with one more tap or a restart.
const GT_PARTS=[['wx','Weather (rain, snow, fog)',['drawWeatherX']],['water','Water shimmer + reflections',['v3water','v3glitter','drawReflect','v3fishRing']],['glow','Lights and glows',['v3glow']],['mist','Mist',['v3mist']],['you','You (the angler)',['drawAngler3']],['pets','Pets',['drawPetStyled']],['dock','Home decorations on the dock',['drawDockItem']],['wear','Moving cosmetic effects',['wearFxDraw']],['odd','Oddities and junk',['drawJunkAt']],['plants','Trees and plants',['v3tree','v3willow','v3reeds','v3bushes','v3flowers','v3leafTree','v3pine','v3snowPine','v3palm']],['lowres','Low resolution (1x)',[]]];
const GT_OFF=new Set();
if(window.DL_PREVIEW){
  const wrap=(name,key)=>{ try{ const f=eval(name); if(typeof f!=='function') return; eval(name+'=function(){ if(GT_OFF.has("'+key+'")) return; return f.apply(this,arguments); }'); }catch(e){} };
  for(const [k,,fns] of GT_PARTS) for(const n of fns) wrap(n,k);
  { const _rd=renderDPR; renderDPR=function(w,h){ return GT_OFF.has('lowres')?1:_rd(w,h); }; }
  const _th=testerHTML; testerHTML=function(){ const base=_th(); if(!MOB()) return base;
    return base+`<details class="tile st-test" open><summary><b>Graphics test</b> <span class="meta">· turn parts of the water off, then read the frame counter</span></summary><p class="sub">Switch on the frame counter (Settings, Display), then tap one part at a time and look at the water. A part that makes the counter jump is the heavy one.</p><div class="row" style="gap:6px;flex-wrap:wrap">${GT_PARTS.map(([k,n])=>`<button class="btn${GT_OFF.has(k)?'':' alt'} sm" data-act="gtest" data-k="${k}">${GT_OFF.has(k)?'OFF: ':''}${n}</button>`).join('')}</div></details>`; };
  const _xa=extraAct2; extraAct2=function(b){ if(b.dataset.act==='gtest'){ const k=b.dataset.k; if(GT_OFF.has(k)) GT_OFF.delete(k); else GT_OFF.add(k); try{ if(typeof V3CACHE!=='undefined'&&V3CACHE) V3CACHE.key=''; }catch(e){} try{ resize(); }catch(e){} toast((GT_OFF.has(k)?'Off: ':'Back on: ')+GT_PARTS.find(p=>p[0]===k)[1]); return 'render'; } return _xa(b); };
}

// ---------- patch notes a phone has already shown stay shown (director, 2026-11-18: after moving progress from PC "my first relaunch
// brought up the patch notes for the patch previous"): the save carries the last notes seen on the device it came from (PC 0.4.8.2),
// so the phone showed its own older updates again. Phones remember the newest notes they showed; an arriving save never lowers it.
{ const K='dl-seen-patch'; const get=()=>{ try{ return localStorage.getItem(K)||''; }catch(e){ return ''; } }, put=v=>{ try{ localStorage.setItem(K,v); }catch(e){} };
  const fix=s=>{ try{ if(!MOB()||!s||typeof s!=='object') return; const d=get(); if(d&&(!s.seenPatch||verNewer(d,s.seenPatch))) s.seenPatch=d; }catch(e){} };
  const _mg=migrate; migrate=function(){ const s=_mg.apply(this,arguments); fix(s); return s; };
  const _sv=save; save=function(){ try{ if(MOB()&&S&&S.seenPatch){ const d=get(); if(!d||verNewer(S.seenPatch,d)) put(S.seenPatch); } }catch(e){} return _sv.apply(this,arguments); };
  try{ fix(S); }catch(e){} }

// ---------- Settings, Patch notes on phones (director, 2026-11-19, iPhone: "patch notes are hard to open on your own, and are so
// cluttered compared to the first initial opening. Reading patch notes again sucks and scrolling through is really hard and glitchy"):
// the tab used to hold every update's full text in one block (~1,850 px inside the scrolling menu). Now it is a short list, newest
// first; tapping one opens the same card as the first opening (finger scrolling, button always on screen).
{ const list=()=>(S.owned.pets.includes('lily')?[LILY_PATCH]:[]).concat(S.owned.pets.includes('daxniko')?[PAIR_PATCH]:[]).concat(PATCHES);
  pageDone('settings',()=>{ /* a finishing touch of the Settings page (Clean Pages 2026-11-21: was its own renderPanel wrapper) */
      const t=[...document.querySelectorAll('#panel .tile')].find(x=>{ const h=x.querySelector(':scope > h4'); return h&&h.textContent.trim()==='Patch notes'; }); if(!t||t.classList.contains('pn9')) return;
      t.classList.add('pn9'); t.innerHTML=`<h4>Patch notes</h4><div class="meta">You’re on Driftline ${esc(GAME_VERSION)}. Tap an update to read it.</div><div class="pn9-list">${list().map((p,i)=>`<button type="button" class="pn9-row${i>=10?" pn9-old":""}" data-pn9="${i}"><span class="pn9-v">${p.label?esc(p.label):'Update '+esc(p.v)}</span><b>${esc(p.name)}</b></button>`).join('')}</div>${list().length>10?`<button type="button" class="btn alt sm pn9-more">Show ${list().length-10} older updates</button>`:''}`;
    });
  document.addEventListener('click',e=>{ const m=e.target.closest&&e.target.closest('.pn9-more'); if(m&&MOB()){ e.stopPropagation(); const t=m.closest('.pn9'); t.classList.add('pn9-all'); m.remove(); return; } const b=e.target.closest&&e.target.closest('[data-pn9]'); if(!b||!MOB()) return; e.stopPropagation(); const p=list()[+b.dataset.pn9]; if(!p) return; try{ closeMenu(); }catch(er){} showPatchNotes(p); },true);
  document.head.insertAdjacentHTML('beforeend',`<style>
body.phone-app #panel .pn9-list,body.phone-land #panel .pn9-list{display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:6px;margin:8px 0}
body.phone-app #panel .pn9:not(.pn9-all) .pn9-old,body.phone-land #panel .pn9:not(.pn9-all) .pn9-old{display:none}
body.phone-app #panel .pn9-row,body.phone-land #panel .pn9-row{display:flex;align-items:baseline;gap:10px;width:100%;text-align:left;padding:10px 12px;border-radius:12px;border:1px solid var(--line);background:#ffffff08;color:inherit;font:inherit;cursor:pointer}
body.phone-app #panel .pn9-row .pn9-v,body.phone-land #panel .pn9-row .pn9-v{flex:0 0 auto;font-size:12px;color:var(--muted)}
body.phone-app #panel .pn9-row b,body.phone-land #panel .pn9-row b{flex:1;min-width:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
</style>`); }
