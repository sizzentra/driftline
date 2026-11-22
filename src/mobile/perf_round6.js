// =====================================================================
// Phones (Android + iPhone), round 6 performance (director, 2026-11-18: "Aquarium tab on Android the only screen that
// experiences lag while scrolling", "reeling in storms on Android has a severely impacted frame rate").
// =====================================================================
/* MOB(): "is the phone layout on?" was re-read from the page's classes on every call, hundreds of times a frame from the per-frame
   phone paths (2026-11-19, redundancies list C11). It is now a stored answer, refreshed only when the body's classes change. */
const MOB=(()=>{ let v=null; const upd=()=>{ const b=document.body&&document.body.classList; v=!!b&&(b.contains('phone-app')||b.contains('phone-land')); };
  try{ if(document.body&&window.MutationObserver) new MutationObserver(upd).observe(document.body,{attributes:true,attributeFilter:['class']}); }catch(e){}
  return ()=>{ if(v===null) upd(); return v; }; })();

// 1) a menu covers the whole phone screen, so the fishing scene behind it is not drawn (the aquarium tank, the page and its
//    scrolling get the whole frame). The line waits while a menu is open, so nothing on the water is missed.
{ const _dr=draw; draw=function(now){ if(MENU_OPEN&&MOB()){ if(!(typeof DK_SCENE_OK==='function'&&DK_SCENE_OK(now))) return; const f=resize.force; resize.force=true; try{ return _dr.apply(this,arguments); } finally{ resize.force=f; } } return _dr.apply(this,arguments); }; } /* Your home: past the shared "menus draw 4 a second" limit (bm_ui04), which made the live preview choppy */ /* round 8: Your home shows the live scene, so it keeps drawing (30 a second) while that page is open (page_home.js) */

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
  const tick=t=>{ if(!MOB()||document.hidden||MENU_OPEN){ last=0; return; }
    if(S.loc!==loc){ if(loc) byLoc[loc]=i; loc=S.loc; acc=0; n=0; slow=0; fast=0; skipUntil=t+3000; if(byLoc[loc]!=null) setStep(byLoc[loc]); }
    if(t<skipUntil){ last=t; return; }
    if(last){ const dt=t-last; if(dt<200){ acc+=dt; n++; } } last=t;
    if(n>=45){ const avg=acc/n; acc=0; n=0; /* Android draws at most 60 (16.7 ms a frame), and a 60 Hz screen refreshes every 16.7 ms, so "fast" below 14 ms could never happen there and the resolution never came back up after a slow moment (director, 2026-11-19: "gets worse after switching maps and never gets back"); Android uses slow > 24 ms (under ~42 fps), recovered < 20 ms (over ~50 fps), with room for the screen's jitter */ const capd=(typeof IS_IPHONE==="function"&&!IS_IPHONE()), slowT=capd?24:18.5, fastT=capd?20:14;
      if(avg>slowT){ slow++; fast=0; if(slow>=2){ slow=0; setStep(i+(avg>30?2:1)); byLoc[loc]=i; } }
      else if(avg<fastT){ fast++; slow=0; if(fast>=6){ fast=0; setStep(i-1); byLoc[loc]=i; } }
      else { slow=0; fast=0; } } };
  { const _fr=frame; frame=function(now){ try{ tick(now); }catch(e){} return _fr.apply(this,arguments); }; } /* runs inside the game loop (redundancies list B7): it used to keep its own animation-frame loop just to time frames */
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



// 5) Phone values for the shared platform settings (PLAT in a3_plat.js). Each one only applies while the phone layout is on.
PLAT.willowRepaintS=()=>MOB()?.25:.03;      /* Willow curtain repaints 4x a second (its sway is slow) */
PLAT.rippleBands=MOB;                       /* storms: rain rings in 3 brightness bands, 3 strokes instead of ~46 */
PLAT.anglerReuseMs=()=>MOB()?33:0;          /* the lit angler picture is redrawn ~30x a second, at once on any state change */
PLAT.glowPx=()=>MOB()?128:256;              /* smaller glow dots */
PLAT.quietTabSwitch=MOB;                    /* tab switches without the per-card animation or a forced layout */
PLAT.touch=()=>true;                        /* phones are touch screens: hints and cards say Tap / Let go and never Space or click, even if a browser reports a mouse */
PLAT.fpsText=fps=>(MOB()&&typeof mobFpsText==='function')?mobFpsText(fps):null;
