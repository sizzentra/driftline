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
