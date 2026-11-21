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
  movingDecorMs:()=>0,         // moving dock decorations: 0 = drawn fresh every frame, else cached for this long (cd_efficiency)
  quietTabSwitch:()=>false,    // tab switches skip the per-card entry animation and its forced layout (af_smooth, aw_menu035, bm_ui04)
  fpsText:null,                // (fps)=>text for the frame counter, null = default text (bm_ui04)
  detail:()=>1,                // how much finer moving detail is drawn (particles, ripples, stars): PC full screen draws more (src/pc/ui_display.js)
  touch:()=>!!(window.matchMedia&&matchMedia('(pointer:coarse)').matches) // touch wording: Tap / Let go and no keys, written beside the mouse wording at the source (e_ui, ai_cooler); phones: always
};
