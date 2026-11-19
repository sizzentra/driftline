// =====================================================================
// 0.3.6 platform layer: one game, tuned per device. On load the page knows whether it runs on an iPhone/iPad,
// an Android phone/tablet or a PC (classes plat-ios / plat-android / plat-pc on the page root and body, plus plat-app when
// installed to the home screen), and each gets its own fixes:
//  - iPhone: no text inflation in landscape, no page zoom when a text field or menu is tapped, the notch's side
//    margins counted when choosing the compact layout, a drawn menu arrow instead of iOS's double arrows, and an honest
//    full-screen button (iPhone Safari doesn't allow full screen for websites: it explains Add to Home Screen instead).
//  - Phones held sideways (iPhone and Android): compact stacked tabs and an icon-only settings button, so nothing is
//    cut off or pushes the page sideways.
//  - PC keeps the roomy layout.
// =====================================================================
const DL_PLAT=(function(){ const ua=navigator.userAgent||'', ios=/iPad|iPhone|iPod/.test(ua)||(navigator.platform==="MacIntel"&&navigator.maxTouchPoints>1)||(/[?&]test(&|$)/.test(location.search)&&/[?&]ios(&|$)/.test(location.search)), android=/Android/i.test(ua);
  const p=ios?'ios':android?'android':'pc', app=!!(navigator.standalone||(window.matchMedia&&matchMedia('(display-mode: standalone)').matches));
  for(const el of [document.documentElement,document.body]){ if(!el) continue; el.classList.add('plat-'+p); if(app) el.classList.add('plat-app'); }
  if(ios){ const vp=document.querySelector('meta[name=viewport]'); if(vp&&!/maximum-scale/.test(vp.content)) vp.content+=',maximum-scale=1'; } /* iOS still allows pinch zoom; this only stops the jump-zoom on focus */
  return {p,ios,android,pc:p==='pc',app}; })();
window.DL_PLAT=DL_PLAT;
// full screen where the browser can't do it (iPhone): explain the real way instead of a button that does nothing
document.addEventListener('click',e=>{ const b=e.target.closest&&e.target.closest('[data-act=fullscreen]'); if(!b) return; const d=document.documentElement;
  if(d.requestFullscreen||d.webkitRequestFullscreen) return; e.stopImmediatePropagation(); e.preventDefault();
  toast(DL_PLAT.app?'You are already playing full screen.':DL_PLAT.ios?'iPhone doesn’t let websites go full screen. For a full-screen game: tap Share, then “Add to Home Screen”.':'This browser can’t go full screen. Try adding Driftline to your home screen.'); },true);
// the side-scrolling tab rows re-check their fade edges whenever their size changes (fonts load later on iOS)
(function(){ if(!window.ResizeObserver) return; const ro=new ResizeObserver(es=>{ for(const e of es) e.target.dispatchEvent(new Event('scroll')); });
  const hook=()=>document.querySelectorAll('.subbar').forEach(s=>{ if(!s.__ro){ s.__ro=1; ro.observe(s); } }); hook(); setInterval(hook,2000); })();
// iPhone, held upright: Safari's floating toolbar sits over the bottom of the page, so a bar pinned to the page bottom
// hides under it. The layout already stops at the visible height (calc(100*var(--uvh,1vh))), so the menu bar is placed by that measured
// height instead, landing exactly in the strip reserved for it.
(function(){ if(!DL_PLAT.ios) return; const probe=document.createElement('div'); probe.style.cssText='position:fixed;left:0;top:0;width:0;height:calc(100*var(--uvh,1dvh));visibility:hidden;pointer-events:none'; document.body.appendChild(probe);
  let last=''; const place=()=>{ const b=document.querySelector('#tabs.secmode .secbar'); if(!b) return; const on=document.body.classList.contains('phone-app')&&getComputedStyle(b).position==='fixed';
    const v=on?Math.round(probe.offsetHeight-b.offsetHeight)+'px':''; if(v===last) return; last=v; b.style.top=v; b.style.bottom=on?'auto':''; };
  place(); addEventListener('resize',place); addEventListener('orientationchange',()=>setTimeout(place,250)); if(window.visualViewport) visualViewport.addEventListener('resize',place); setInterval(place,800); })();
document.head.insertAdjacentHTML('beforeend',`<style>
.baitsel .lbl{flex:none!important;line-height:11px!important}
.baitsel #bait{flex:none}
body.phone-app #bait,body.phone-land #bait{height:20px!important;line-height:20px!important}
.plat-ios #bait{height:22px;line-height:22px;padding-top:0!important;padding-bottom:0!important;margin:0;font-size:15px;box-sizing:border-box}
html{-webkit-text-size-adjust:100%;text-size-adjust:100%}
/* the search and settings buttons keep their own width in the top bar; the stat boxes give way instead (they overflowed the window by a few pixels on mid-size PC windows) */
.hud .hudbtns{flex:0 0 auto!important}
.plat-ios *,.plat-android *{-webkit-tap-highlight-color:transparent}
.plat-ios select{-webkit-appearance:none;appearance:none;padding-right:15px!important;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='9' height='6'%3E%3Cpath d='M1 1l3.5 3.5L8 1' fill='none' stroke='%23cfe0f0' stroke-width='1.6' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")!important;background-repeat:no-repeat!important;background-position:right 2px center!important}
/* phones held sideways: the side margins (notch) eat width, so use the compact stacked tabs regardless of the width number */
body.phone-land #tabs.secmode .secb{flex-direction:column;gap:2px;font-size:11px;min-height:46px;padding:4px 2px;white-space:nowrap}
body.phone-land #tabs.secmode .secb .seci svg{width:18px;height:18px}
body.phone-land #tabs.secmode .secdot{right:4px}
body.phone-land .hudbtns #settingsbtn{font-size:0;padding:0 10px;display:flex;align-items:center;justify-content:center}
body.phone-land .hudbtns #settingsbtn::before{content:"⚙";font-size:18px;line-height:1}
</style>`);
// QC (test mode only): open every menu page and report sideways overflow, things off the screen and clipped button text
if(/[?&]test\b/.test(location.search)) window.__audit=async(label)=>{ const out=[]; const vw=document.documentElement.clientWidth, vh=innerHeight;
  const check=where=>{ const sw=document.documentElement.scrollWidth; if(sw>vw+1) out.push(where+': page '+sw+'>'+vw);
    document.querySelectorAll('#panel *, .hud *, #tabs *').forEach(e=>{ const r=e.getBoundingClientRect(); if(!r.width||!r.height) return; const cs=getComputedStyle(e); if(cs.position==='fixed'||cs.visibility==='hidden') return; if(window.__inHScroll&&__inHScroll(e)) return;
      if(r.right>vw+2&&!e.closest('.subbar')&&!e.closest('[data-hscroll]')) out.push(where+': off-screen '+(e.id||e.className||e.tagName)+' "'+(e.textContent||'').trim().slice(0,20)+'" r='+Math.round(r.right));
      if((e.tagName==='BUTTON'||e.classList.contains('chip'))&&e.scrollWidth>e.clientWidth+2&&cs.overflow!=='visible'&&cs.textOverflow!=='ellipsis') out.push(where+': clipped "'+e.textContent.trim().slice(0,30)+'"'); }); };
  for(const s of [...document.querySelectorAll('#tabs .secb')]){ s.click(); await new Promise(r=>setTimeout(r,220)); for(const b of [...document.querySelectorAll('#tabs .subbar .subp')]){ b.click(); await new Promise(r=>setTimeout(r,260)); check(s.textContent.trim().replace(/\d+/g,'')+'>'+b.textContent.trim().replace(/\d+/g,'')); } }
  return {label:label||vw+'x'+vh, n:out.length, out:[...new Set(out)].slice(0,40)}; };
// QC (test mode only): every page, every visible label that is cut off with "…" (text-overflow) or clipped
if(/[?&]test\b/.test(location.search)) window.__trunc=async()=>{ const out=new Set(); const look=where=>{ document.querySelectorAll('#panel *, .hud *, #tabs *').forEach(e=>{ if(!e.offsetParent||e.children.length>2||e.clientWidth<=2) return; /* 1 px labels are hidden on purpose (screen-reader names on swatches) */ const cs=getComputedStyle(e); const t=(e.textContent||'').trim(); if(!t) return;
    if(e.scrollWidth>e.clientWidth+1&&(cs.textOverflow==='ellipsis'||cs.overflow==='hidden'||cs.overflowX==='hidden')) out.add(where+': "'+t.slice(0,28)+'"'); }); };
  for(const s of [...document.querySelectorAll('#tabs .secb')]){ s.click(); await new Promise(r=>setTimeout(r,200)); for(const b of [...document.querySelectorAll('#tabs .subbar .subp')]){ b.click(); await new Promise(r=>setTimeout(r,260)); look(s.textContent.trim().replace(/\d+/g,'')+'>'+b.textContent.trim().replace(/\d+/g,'')); } }
  return [...out].slice(0,60); };
