// =====================================================================
// Phones, round 8: landscape only, on iPhone AND Android phones (director, 2026-11-18: "iPhone versions should just have landscape
// available... full forced landscape across the board", then "Also push landscape only on android too").
// Research: iPhone browsers and Home Screen web apps cannot lock the orientation (no screen.orientation.lock, the manifest's
// "orientation" is ignored; WebKit status / caniuse, checked 2026-11-18). Android can lock, but only while the game is full screen.
// Rotating the page with CSS breaks taps, safe areas and the keyboard. So the dependable way, used by web games: whenever a phone
// is held upright, a full screen asks you to turn it sideways; the game underneath pauses (no time passes, nothing is drawn) and
// nothing can be tapped by accident. It also says how to fix a phone that does not turn (iPhone: Portrait Orientation Lock;
// Android: Auto-rotate). On Android, full screen also locks the screen to landscape.
// Phones only: tablets and iPads keep every orientation and split view. Uses the device's orientation (not the window's), so a
// split-screen window on a phone held sideways is not interrupted.
// =====================================================================
const IS_ANDROID_PHONE=()=>(/Android/i.test(navigator.userAgent)&&Math.min(screen.width,screen.height)<600)||(/[?&]test\b/.test(location.search)&&/[?&]phone\b/.test(location.search));
const IS_PHONE=()=>IS_IPHONE()||IS_ANDROID_PHONE();
{ let el=null, on=false;
  const upright=()=>{ if(!IS_PHONE()) return false; try{ const t=screen.orientation&&screen.orientation.type; if(t&&!/[?&]test\b/.test(location.search)) return /portrait/.test(t); }catch(e){ oops('mobile/landscape08:test',e); } return window.innerHeight>window.innerWidth; };
  const build=()=>{ if(el) return el; const ip=IS_IPHONE(), dev=ip?'iPhone':'phone';
    el=document.createElement('div'); el.id='dl-turn'; el.setAttribute('role','dialog'); el.setAttribute('aria-modal','true'); el.setAttribute('aria-label','Turn your '+dev+' sideways');
    el.innerHTML=`<style>
#dl-turn{position:fixed;inset:0;z-index:2147483000;display:none;align-items:center;justify-content:center;flex-direction:column;gap:14px;text-align:center;
  padding:max(24px,env(safe-area-inset-top)) max(28px,env(safe-area-inset-right)) max(24px,env(safe-area-inset-bottom)) max(28px,env(safe-area-inset-left));
  background:radial-gradient(120% 80% at 50% 35%,#13303d 0%,#0a161d 70%);color:#e6efe8;font:600 15px/1.4 "Bricolage Grotesque",system-ui,sans-serif;touch-action:none;-webkit-user-select:none;user-select:none}
#dl-turn.on{display:flex}
#dl-turn .tp{width:58px;height:96px;border:4px solid #7fc8a9;border-radius:14px;position:relative;animation:dlturn 2.4s ease-in-out infinite}
#dl-turn .tp::after{content:"";position:absolute;left:50%;bottom:7px;width:18px;height:3px;margin-left:-9px;border-radius:2px;background:#7fc8a9}
@keyframes dlturn{0%,25%{transform:rotate(0)}55%,85%{transform:rotate(-90deg)}100%{transform:rotate(0)}}
@media (prefers-reduced-motion:reduce){#dl-turn .tp{animation:none;transform:rotate(-90deg)}}
#dl-turn h2{margin:6px 0 0;font-size:22px;line-height:1.2;color:#fff}
#dl-turn p{margin:0;max-width:300px;color:#97abc2;font-size:14px}
#dl-turn p b{color:#e6efe8}
</style><div class="tp" aria-hidden="true"></div><h2>Turn your ${dev} sideways</h2><p>Driftline plays in landscape on ${ip?'iPhone':'phones'}. Your game is paused until you turn it.</p><p>${ip?'Not turning? Swipe down from the top-right corner to open <b>Control Center</b> and switch off <b>Portrait Orientation Lock</b>.':'Not turning? Swipe down from the top of the screen and switch on <b>Auto-rotate</b>.'}</p>`;
    ['pointerdown','pointerup','click','touchstart','touchend','wheel'].forEach(ev=>el.addEventListener(ev,e=>{ e.stopPropagation(); if(ev!=='touchstart'&&ev!=='wheel') e.preventDefault(); },{passive:false}));
    document.body.appendChild(el); return el; };
  const check=()=>{ const v=upright(); if(v===on) return; on=v; build().classList.toggle('on',v); document.documentElement.classList.toggle('dl-turn-on',v);
    if(v){ try{ if(document.activeElement&&document.activeElement.blur) document.activeElement.blur(); }catch(e){ oops('mobile/landscape08:activeElement.blur',e); } } };
  /* paused while upright: no time passes and nothing is drawn underneath (saves battery, and a fish on the line waits for you) */
  const _up=update; update=function(){ if(on) return; return _up.apply(this,arguments); };
  const _dr=draw; draw=function(){ if(on) return; return _dr.apply(this,arguments); };
  addEventListener('resize',check); addEventListener('orientationchange',()=>setTimeout(check,60));
  try{ if(screen.orientation) screen.orientation.addEventListener('change',check); }catch(e){ oops('mobile/landscape08:orientation.addEventListener',e); }
  if(window.matchMedia) try{ matchMedia('(orientation:portrait)').addEventListener('change',check); }catch(e){ oops('mobile/landscape08:matchMedia',e); }
  /* Android: while full screen, the screen itself is locked to landscape */
  document.addEventListener('fullscreenchange',()=>{ try{ if(document.fullscreenElement&&IS_ANDROID_PHONE()&&screen.orientation&&screen.orientation.lock){ const p=screen.orientation.lock('landscape'); if(p&&p.catch) p.catch(()=>{ /* quiet: most browsers refuse to lock the turn outside full screen, by design */ }); } }catch(e){ oops('mobile/landscape08:IS_ANDROID_PHONE',e); } });
  if(document.body) check(); else addEventListener('DOMContentLoaded',check);
  if(/[?&]test\b/.test(location.search)) window.__turn=()=>({phone:IS_PHONE(), iphone:IS_IPHONE(), upright:upright(), shown:on}); }
/* safety net: a turn the browser did not announce (some iPhone Home Screen apps skip the resize event after turning, and the test
   browser never sends it) still switches the layout: twice a second the window size is compared (a cheap read, no layout work) and
   a missed change sends the resize event itself */
{ let w=window.innerWidth, h=window.innerHeight, seen=0; addEventListener('resize',()=>{ seen=Date.now(); w=window.innerWidth; h=window.innerHeight; });
  setInterval(()=>{ const nw=window.innerWidth, nh=window.innerHeight; if(nw!==w||nh!==h){ w=nw; h=nh; if(Date.now()-seen>400){ try{ window.dispatchEvent(new Event('resize')); }catch(e){ oops('mobile/landscape08:window.dispatchEvent',e); } } } },500); }
