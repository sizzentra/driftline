// =====================================================================
// oops(where, e): the one reporter for errors that are caught and passed over (Foundation F6 slice 2, 2026-11-26). Every
// catch that carries on calls it with a short label ('file:what'); nothing is shown to the player and nothing is sent or stored:
// it keeps a short list in memory (60 labels at most, a count per label, the first 3 different messages). Test builds show the list
// in Stats > Tester tools once something is on it, and the checks read it through window.__errs (bn_qa04.js; tools/sweep.html has
// its own part for it). The release build keeps the same list (the same code runs on live and on test), but no screen reads it.
// It is a function declaration with its list on itself, so code in any file can call it while the page is still loading.
// build.ps1 refuses a catch that does nothing; where reporting would be noise by design, the catch says why: /* quiet: ... */
// =====================================================================
function oops(where,e){ try{ const L=oops.seen||(oops.seen=new Map()); let r=L.get(where);
    if(!r){ if(L.size>=60){ oops.over=(oops.over||0)+1; return; } r={where,n:0,msg:[]}; L.set(where,r); }
    r.n++; if(r.msg.length<3&&r.n<=20){ /* messages are only looked at for the first 20: an error repeating every frame costs a count after that */ const m=String(e&&e.message||e).slice(0,160); if(!r.msg.includes(m)) r.msg.push(m); }
  }catch(_){ /* quiet: the reporter itself never throws */ } }
// =====================================================================
// Steps on a function (Foundation F6 slices 3 and 6, 2026-11-27). A later file that adds to what a core function does adds a step to
// it with stepOn('name', step) instead of wrapping it. The function itself runs its steps, in the order the files load, so there is
// one function and one list per name. Two kinds, one per function:
//   around it (renderPanel, showCard, landFish, renderCooler, menuTidy2): a step is {before(...args){ }, after(t, ...args){ }}.
//     stepsRun runs every "before" from the last added to the first, the function, then every "after" from the first added to the
//     last. What a "before" returns is handed to the same step's "after". A "before" that answers 'drawn' has done the job itself:
//     the steps added before it and the function are skipped, the steps added after it still run their "after". A step's "always"
//     runs right after its "after", also when the function failed.
//   after it, on its value (bonus, catchW, rollFish, aqFishBase, aqBuffsOf): a step is (value, ...args)=>new value; thenRun hands the
//     value through them in order.
// The lists sit on stepOn (like oops' list), so steps can be added, and the functions called, while the page is still loading.
// Limits, on purpose (no array is made per call): an "after" gets the first two arguments, a value step the first four; a "before"
// must not use the text 'drawn' as its own value.
// =====================================================================
function stepOn(name,s){ const L=stepOn.lists||(stepOn.lists={}); (L[name]||(L[name]=[])).push(s); }
function stepsOf(name){ return (stepOn.lists&&stepOn.lists[name])||stepOn.none||(stepOn.none=[]); }
function stepsRun(L,core,a,i){ if(i<0) return core.apply(null,a); const s=L[i]; let t, r; if(s.before){ t=s.before.apply(null,a); if(t==='drawn') return; }
  if(s.always){ try{ r=stepsRun(L,core,a,i-1); if(s.after) s.after(t,a[0],a[1]); } finally{ s.always(t); } } else { r=stepsRun(L,core,a,i-1); if(s.after) s.after(t,a[0],a[1]); } return r; }
function thenRun(name,v,a,b,c,d){ const L=stepsOf(name); for(let i=0;i<L.length;i++) v=L[i](v,a,b,c,d); return v; }
/* a copy of the list for Tester tools and the checks: [{where, n, msg}], msg = the different messages joined */
function oopsList(){ const L=oops.seen?[...oops.seen.values()].map(r=>({where:r.where,n:r.n,msg:r.msg.join(' | ')})):[]; if(oops.over) L.push({where:'(other places, list full)',n:oops.over,msg:''}); return L; }

// =====================================================================
// PLAT: platform settings with neutral defaults (2026-11-19). Shared code never asks "is this a phone?"; it reads a named
// setting here, and a platform layer replaces the setting (phones: src/mobile/perf_round6.js). build.ps1 refuses phone checks
// (the phone-layout test) in shared files, so platform behaviour always lives in its platform folder.
// =====================================================================
const PLAT={
  willowRepaintS:()=>.03,      // seconds between Willow Pond curtain repaints (f3_foliage)
  rippleBands:()=>false,       // rain rings drawn as 3 brightness bands instead of one stroke each (ap_weather033)
  anglerReuseMs:()=>0,         // reuse the lit angler picture for this long (g_angler)
  glowPx:()=>256,              // size of the ready-made soft glow dot (cd_efficiency)
  quietTabSwitch:()=>false,    // tab switches skip the per-card entry animation and its forced layout (af_smooth, aw_menu035, bm_ui04)
  fpsText:null,                // (fps)=>text for the frame counter, null = default text (bm_ui04)
  detail:()=>1,                // how much finer moving detail is drawn (particles, ripples, stars): PC full screen draws more (src/pc/ui_display.js)
  touch:()=>!!(window.matchMedia&&matchMedia('(pointer:coarse)').matches) // touch wording: Tap / Let go and no keys, written beside the mouse wording at the source (e_ui, ai_cooler); phones: always
};
