// =====================================================================
// Tablets, round 8: proper iPad and Android tablet support (director, 2026-11-18: "proper tablet and iPad support would be awesome").
// Before, tablets fell back to the desktop layout (small mouse-sized controls, "or Space" hints). Now a tablet shows the same phone
// layouts the game is built and checked around, scaled to fill the tablet: everything is about 1.3-1.9x bigger, so taps are
// tablet-sized and every phone standard (MB_FRAME, MB_UI, __spec) applies unchanged.
//  - How: the page's viewport is set to a phone-shaped width with a fixed zoom (initial = minimum = maximum scale), so layout,
//    taps, safe areas and media queries all stay exact (no CSS transforms).
//  - Sideways: the page is 540 tall (the sideways phone layout, rail on the side). Upright: the page is 600 wide (the upright
//    phone layout). Turning the tablet or resizing a split-screen window measures again.
//  - A tablet is a touch device whose shorter side is at least 600 pt (phones are at most ~440). Phones are never changed.
//  - While typing (keyboard open) nothing is re-measured, so the keyboard never resizes the game.
// Android + iPad (the iPhone build also runs on iPads).
// =====================================================================
const TAB_LAND_H=540, TAB_UP_W=600;
const TAB_VIEW=/[?&]test\b/.test(location.search)&&/[?&]tabletview\b/.test(location.search); /* test builds: show a tablet-sized window as a tablet would */
function tabletTarget(rw,rh){ const touch=(window.matchMedia&&matchMedia('(pointer:coarse)').matches)||navigator.maxTouchPoints>0||/[?&]tablet\b/.test(location.search);
  if(!touch||Math.min(rw,rh)<600) return null;
  const land=rw>rh, s=land?rh/TAB_LAND_H:rw/TAB_UP_W; if(s<=1.05) return null;
  return {w:Math.round(rw/s), s:+s.toFixed(4), land}; }
{ const meta=document.querySelector('meta[name="viewport"]'); const BASE=meta?meta.getAttribute('content'):'';
  let scaled=null, busy=false, real=null, t=0;
  const typing=()=>{ const a=document.activeElement; return !!(a&&(a.tagName==='INPUT'||a.tagName==='TEXTAREA'||a.isContentEditable)); };
  const set=c=>{ if(meta&&meta.getAttribute('content')!==c){ busy=true; meta.setAttribute('content',c); setTimeout(()=>{ busy=false; },250); } };
  const apply=()=>{ real={w:window.innerWidth,h:window.innerHeight}; const tg=tabletTarget(real.w,real.h); scaled=tg;
    document.documentElement.classList.toggle('dl-tablet',!!tg||TAB_VIEW);
    if(tg) set(`width=${tg.w},initial-scale=${tg.s},minimum-scale=${tg.s},maximum-scale=${tg.s},user-scalable=no,viewport-fit=cover`); };
  /* measure at the device's own scale: put the original viewport back, let the browser settle, then decide */
  const remeasure=()=>{ if(!meta) return; clearTimeout(t); if(meta.getAttribute('content')!==BASE){ set(BASE); t=setTimeout(apply,120); } else apply(); };
  if(meta) apply();
  addEventListener('resize',()=>{ if(busy||typing()||!meta) return; if(!scaled){ clearTimeout(t); t=setTimeout(apply,120); return; }
    /* scaled: only a real change of shape (turning, split screen) measures again */
    const a=window.innerHeight/window.innerWidth, want=real?real.h/real.w:a; if(Math.abs(a-want)>0.04) remeasure(); });
  addEventListener('orientationchange',()=>{ if(meta) setTimeout(remeasure,60); });
  if(/[?&]test\b/.test(location.search)) window.__tablet=(w,h)=>w?tabletTarget(w,h):({scaled, real, meta:meta&&meta.getAttribute('content')}); }
/* tablets have a status bar on top when sideways (phones do not): the sideways water and menus keep clear of it */
document.head.insertAdjacentHTML('beforeend',`<style>
html.dl-tablet body.phone-land.dl-fish{padding-top:max(6px,env(safe-area-inset-top))!important}
html.dl-tablet body.phone-land #menuov .mo-in{padding-top:max(6px,env(safe-area-inset-top))!important}
</style>`);
