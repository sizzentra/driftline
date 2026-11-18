// =====================================================================
// iPhone, round 8: landscape only (director, 2026-11-18: "iPhone versions should just have landscape available. It should be a full
// forced landscape across the board so we don't keep having to run into problems. This is just for iPhone.").
// Research: iPhone browsers and Home Screen web apps cannot lock the orientation (Safari has no screen.orientation.lock and ignores
// the manifest's "orientation" field; WebKit status / caniuse, checked 2026-11-18). Rotating the whole page with CSS breaks taps,
// safe areas and the keyboard. So the dependable way, used by web games: whenever an iPhone is held upright, a full screen asks you
// to turn it sideways; the game underneath pauses (no time passes, nothing is drawn) and nothing can be tapped by accident.
// The prompt also says how to turn off Portrait Orientation Lock, the usual reason a phone does not turn.
// iPhone only (iPads keep every orientation and split view).
// =====================================================================
{ let el=null, on=false;
  const upright=()=>IS_IPHONE()&&window.innerHeight>window.innerWidth;
  const build=()=>{ if(el) return el; el=document.createElement('div'); el.id='dl-turn'; el.setAttribute('role','dialog'); el.setAttribute('aria-modal','true'); el.setAttribute('aria-label','Turn your iPhone sideways');
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
</style><div class="tp" aria-hidden="true"></div><h2>Turn your iPhone sideways</h2><p>Driftline plays in landscape on iPhone. Your game is paused until you turn it.</p><p>Not turning? Swipe down from the top-right corner to open <b>Control Center</b> and switch off <b>Portrait Orientation Lock</b>.</p>`;
    ['pointerdown','pointerup','click','touchstart','touchend','wheel'].forEach(ev=>el.addEventListener(ev,e=>{ e.stopPropagation(); if(ev!=='touchstart'&&ev!=='wheel') e.preventDefault(); },{passive:false}));
    document.body.appendChild(el); return el; };
  const check=()=>{ const v=upright(); if(v===on) return; on=v; build().classList.toggle('on',v); document.documentElement.classList.toggle('dl-turn-on',v);
    if(v){ try{ if(document.activeElement&&document.activeElement.blur) document.activeElement.blur(); }catch(e){} } };
  /* paused while upright: no time passes and nothing is drawn underneath (saves battery, and a fish on the line waits for you) */
  const _up=update; update=function(){ if(on) return; return _up.apply(this,arguments); };
  const _dr=draw; draw=function(){ if(on) return; return _dr.apply(this,arguments); };
  addEventListener('resize',check); addEventListener('orientationchange',()=>setTimeout(check,60));
  if(window.matchMedia) try{ matchMedia('(orientation:portrait)').addEventListener('change',check); }catch(e){}
  if(document.body) check(); else addEventListener('DOMContentLoaded',check);
  if(/[?&]test\b/.test(location.search)) window.__turn=()=>({iphone:IS_IPHONE(), upright:upright(), shown:on}); }
