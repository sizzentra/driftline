// iPhone Home Screen app (director, 2026-11-17, screenshot): opened sideways, the whole game sat ~55 points too low, below an
// empty band. iOS can keep the safe-area numbers of the other orientation after launching or turning the phone, so the layout
// left room for a notch that isn't there (and, the other way round, upright could sit under the notch). Two fixes:
// 1. Sideways, an iPhone never needs room at the top (the status bar is hidden), so that layout no longer reads the top inset.
// 2. After a launch or a turn, iOS is made to read the safe areas again (the viewport setting is re-applied and styles refreshed).
document.head.insertAdjacentHTML('beforeend',`<style>
html body.phone-land.dl-fish{padding-top:6px!important}
html body.phone-land #menuov .mo-in{padding-top:5px!important}
html body.phone-land #menuov > #toast{top:60px!important}
html body.phone-land #menuov #panel .wd-prev{height:calc(100dvh - 150px)!important}
html body.phone-land .dlprev{top:4px!important}
</style>`);
{ const ios=/iP(hone|od|ad)/.test(navigator.userAgent)||(navigator.platform==='MacIntel'&&navigator.maxTouchPoints>1);
  if(ios){ const vp=document.querySelector('meta[name=viewport]'); let q=0;
    const refresh=()=>{ try{ if(vp){ const c=vp.getAttribute('content'); vp.setAttribute('content',c+' '); vp.setAttribute('content',c); }
        const r=document.documentElement; r.classList.add('sa-recalc'); void r.offsetHeight; r.classList.remove('sa-recalc'); try{ resize(); }catch(e){} }catch(e){} };
    const soon=()=>{ clearTimeout(q); [80,400,1000].forEach(ms=>setTimeout(refresh,ms)); };
    addEventListener('orientationchange',soon); addEventListener('resize',soon); addEventListener('pageshow',soon); document.addEventListener('visibilitychange',()=>{ if(!document.hidden) soon(); });
    soon(); }
  document.head.insertAdjacentHTML('beforeend','<style>html.sa-recalc body{padding-bottom:calc(env(safe-area-inset-bottom) + 0.01px)}</style>'); }
