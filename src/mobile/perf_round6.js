// =====================================================================
// Phones (Android + iPhone), round 6 performance (director, 2026-11-18: "Aquarium tab on Android the only screen that
// experiences lag while scrolling", "reeling in storms on Android has a severely impacted frame rate").
// =====================================================================
const MOB=()=>{ const b=document.body.classList; return b.contains('phone-app')||b.contains('phone-land'); };

// 1) a menu covers the whole phone screen, so the fishing scene behind it is not drawn (the aquarium tank, the page and its
//    scrolling get the whole frame). The line waits while a menu is open, so nothing on the water is missed.
{ const _dr=draw; draw=function(now){ if(MENU_OPEN&&MOB()) return; return _dr.apply(this,arguments); }; }

// 2) the aquarium tank: a steady pace on phones (round 7 below), a steady half rate while the page scrolls
{ let lastT=0, scrollUntil=0; const P=$('panel'); if(P) P.addEventListener('scroll',()=>{ scrollUntil=performance.now()+180; },{passive:true});
  addEventListener('touchmove',()=>{ if(S.tab==='aquarium') scrollUntil=performance.now()+180; },{passive:true});
  // round 7 (director, 2026-11-18: "horrible stuttering in the aquarium preview"): the old rule skipped any frame that came less than
  // 15 ms after the last one; on a 60 Hz screen frames arrive every 16.7 ms with a little jitter, so an early one was dropped now and
  // then (a 33 ms gap, a visible hitch), and the tank froze completely while the list scrolled (it is always on screen now). Now the
  // pace is steady: every display frame on 60 Hz screens, exactly every other frame on 120 Hz screens (measured, not a cut-off), and a
  // steady half rate while the page scrolls instead of a freeze.
  let ema=16.7, rawLast=0, odd=false;
  const _dt=drawTank; drawTank=function(now){ if(MOB()){ const t=performance.now(), d=t-rawLast; rawLast=t; if(d>2&&d<60) ema=ema*.92+d*.08;
      const half=ema<11||t<scrollUntil; /* 120 Hz screen, or the page is scrolling */ if(half){ odd=!odd; if(odd) return; } else odd=false; lastT=t; }
    return _dt.apply(this,arguments); }; }

// 3) steady frame rate: the water's resolution follows how the phone keeps up. If frames drop for a few seconds (a storm, a
//    big fight), the water is drawn a little less sharp until the phone keeps up again (round 7: five steps, see below).
let MOB_DPR_CAP=2;
{ const _rd=renderDPR; renderDPR=function(w,h){ const d=_rd(w,h); return MOBDPR_ON()?Math.min(d,MOB_DPR_CAP):d; };
  function MOBDPR_ON(){ return MOB(); }
  // round 7 (director, Pixel 10: ~50 fps on the first waters, 20-30 on others, under 20 in storms): finer steps, it reacts below
  // ~54 fps (was 48, so a phone holding 50 never got help), each water remembers the sharpness it settled on (switching back starts
  // there instead of slow again), and the first second after a water change is not counted (one-off loading work).
  const steps=[2,1.75,1.5,1.3,1.15]; let i=0, acc=0, n=0, slow=0, fast=0, last=0, loc='', skipUntil=0; const byLoc={};
  const setStep=k=>{ k=Math.max(0,Math.min(steps.length-1,k)); if(k===i) return; i=k; MOB_DPR_CAP=steps[i]; try{ resize(); }catch(e){} };
  const tick=t=>{ requestAnimationFrame(tick); if(!MOB()||document.hidden||MENU_OPEN){ last=0; return; }
    if(S.loc!==loc){ if(loc) byLoc[loc]=i; loc=S.loc; acc=0; n=0; slow=0; fast=0; skipUntil=t+1000; if(byLoc[loc]!=null) setStep(byLoc[loc]); }
    if(t<skipUntil){ last=t; return; }
    if(last){ const dt=t-last; if(dt<200){ acc+=dt; n++; } } last=t;
    if(n>=45){ const avg=acc/n; acc=0; n=0;
      if(avg>18.5){ slow++; fast=0; if(slow>=2){ slow=0; setStep(i+(avg>30?2:1)); byLoc[loc]=i; } }
      else if(avg<14){ fast++; slow=0; if(fast>=6){ fast=0; setStep(i-1); byLoc[loc]=i; } }
      else { slow=0; fast=0; } } };
  requestAnimationFrame(tick);
  if(/[?&]test\b/.test(location.search)) window.__mobperf=()=>({cap:MOB_DPR_CAP, step:i, byLoc:Object.assign({},byLoc)}); }

// 4) live events never move the game frame (director: "some live events on Android move the game frame as the counter moves
//    down while in portrait mode, seen with Market Rush"): the goal / live chip keeps to one line, digits keep the same width,
//    and the top bar chips keep their height, so the water above never gets re-measured while a countdown ticks
document.head.insertAdjacentHTML('beforeend',`<style>
body.phone-app,body.phone-land{font-variant-numeric:tabular-nums}
body.phone-app.dl-fish .hud > #goalchip .gl-t{white-space:nowrap!important;overflow:hidden!important;text-overflow:ellipsis!important;display:block;min-width:0}
body.phone-app.dl-fish .hud > #goalchip .gl-s{white-space:nowrap!important;overflow:hidden!important;text-overflow:ellipsis!important;display:block;min-width:0}
body.phone-app.dl-fish .hud > #goalchip{overflow:hidden}
</style>`);

// 5) Bait on the fishing screen (phones): a Bait button beside Rest shows the bait you use and opens the bait list
{ let btn=null; const label=()=>{ const b=BAIT[S.baitSel]||BAIT.worm; return '🪱 '+b.name+(S.baitSel!=='worm'?' · '+(S.bait[S.baitSel]||0):''); };
  const place=()=>{ if(!MOB()) { if(btn) btn.hidden=true; return; } const st=$('stage'), rest=$('resttog'); if(!st) return;
    if(!btn){ btn=document.createElement('button'); btn.type='button'; btn.id='baitqk'; btn.className='resttog baitqk'; btn.addEventListener('click',e=>{ e.stopPropagation(); try{ startAudio(); }catch(er){} try{ tackleView='bait'; }catch(er){} openMenu('shop'); }); st.appendChild(btn); }
    btn.hidden=false; const t=label(); if(btn.textContent!==t) btn.textContent=t;
    if(rest&&rest.offsetWidth){ const l=(rest.offsetLeft+rest.offsetWidth+8)+'px', tp=rest.offsetTop+'px', hh=rest.offsetHeight+'px'; // the Rest style pins left with !important, so ours must too
      if(btn.style.left!==l) btn.style.setProperty('left',l,'important'); if(btn.style.top!==tp) btn.style.setProperty('top',tp,'important'); if(btn.style.height!==hh) btn.style.setProperty('height',hh,'important'); btn.style.setProperty('bottom','auto','important'); } };
  setInterval(()=>{ try{ place(); }catch(e){} },1000); setTimeout(place,900); }
document.head.insertAdjacentHTML('beforeend',`<style>
body.phone-app #baitqk,body.phone-land #baitqk{max-width:46vw;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;border-color:#7fe3c466!important}
body.card-open #baitqk{opacity:0;pointer-events:none}
body:not(.phone-app):not(.phone-land) #baitqk{display:none!important}
</style>`);

// 6) Rods (phones): the "Your rods" presets at the top of the Rods page
{ const _rp=renderPanel; renderPanel=function(){ const r=_rp.apply(this,arguments); try{ if(S.tab!=='rods'||!MOB()) return r; const P=$('panel'); if(P.querySelector('.rp-box')) return r; const anchor=P.querySelector(':scope > .tile')||P.querySelector(':scope > .grid'); if(anchor) anchor.insertAdjacentHTML('beforebegin',rodPresetsHTML()); else P.insertAdjacentHTML('afterbegin',rodPresetsHTML()); }catch(e){} return r; }; }
