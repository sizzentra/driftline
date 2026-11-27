/* PC page steps (Clean Pages 4): PC page touches push here instead of wrapping renderPanel; pages_pc.js runs pre (last added first) after PAGES.before and post before PAGES.after. Defined here, the first PC file that uses it. */
const PC_STEPS={pre:[],post:[]};
// PC: a menu page that is a little taller than the screen scales itself down to fit it at once (director, 2026-11-17), down to
// 76% at most; a page that still does not fit scrolls the small rest. Pages that already fit stay at full size. Checked after every
// page or section change and window resize.
{ let q=0; const P=()=>$('panel');
  // one measurement at the current zoom gives the exact zoom that fits (the page's height scales with it), so the page is laid
  // out once or twice instead of up to four times (each pass cost ~17 ms on the biggest pages: that was menu lag in full screen).
  // Every page remembers its zoom (per section and window size) and starts from it, so reopening it usually needs no change at all.
  const ceil=new Map(), cache=new Map(), key=()=>{ const p=P(), on=p&&p.querySelector('.bwx-nav [aria-pressed="true"],.bwx-nav [aria-selected="true"],.bwx-nav .on,.fr-cat[aria-pressed="true"]'); return S.tab+'|'+((typeof SECT==='object'&&SECT[S.tab])||'')+'|'+(on?on.textContent.trim().slice(0,24):'')+'|'+innerWidth+'x'+innerHeight; }; /* per page, per section tab (sections that redraw the page too), per window size */
  const fit=()=>{ q=0; const p=P(); if(!p) return; const on=document.body.classList.contains('pch-on')&&MENU_OPEN;
    if(!on||document.body.classList.contains('pc-fhd')){ if(p.style.zoom) p.style.zoom=''; return; } /* full HD: one fixed size on every page (director, 2026-11-17: headers and sizes must never change between tabs; a zoom per page also moved buttons under the cursor right after a click) */
    if(p.classList.contains('fl-on')||p.classList.contains('aq-on')||p.classList.contains('od-on')||[...p.querySelectorAll('.pc-pn')].some(e=>e.offsetParent!==null)){ if(p.style.zoom) p.style.zoom=''; return; } // the Fish Log and the patch-notes reader size themselves to the screen
    const z0=+p.style.zoom||1, ch=p.clientHeight, sh=p.scrollHeight; if(!ch||!sh) return;
    // full HD (body.pc-fhd): a page with room to spare grows until it fills the screen (up to 125%), so it reads well from the chair;
    // its real content height is measured from its first box to its last (the page's own height never drops below the screen's)
    const big=document.body.classList.contains('pc-fhd'), MAXZ=big?1.25:1; let z;
    if(big){ const R=p.getBoundingClientRect(), cs=getComputedStyle(p); let top=Infinity, bot=-Infinity; for(const c of p.children){ if(c.offsetParent===null&&getComputedStyle(c).position!=='fixed') continue; const r=c.getBoundingClientRect(); if(!r.height) continue; top=Math.min(top,r.top); bot=Math.max(bot,r.bottom); }
      if(bot>top){ const pad=(parseFloat(cs.paddingTop)+parseFloat(cs.paddingBottom))*z0, need=bot-top+pad, avail=R.height; z=z0*avail/need-.004; } else z=1;
      if(sh>ch+2) ceil.set(key(),Math.min(ceil.get(key())||9,z0-.004)); /* this zoom overflowed: never grow back to it */
      z=Math.max(.76,Math.min(MAXZ,ceil.get(key())||9,z)); }
    else z=sh<=ch+2?Math.min(1,z0*ch/sh):Math.max(.76,z0*ch/sh-.003);
    if(Math.abs(z-1)<.004) z=1;
    if(Math.abs(z-z0)>.004){ p.style.zoom=z===1?'':String(+z.toFixed(3)); if(passes++<4) soon(); } cache.set(key(),z); };
  let passes=0; const pre=()=>{ passes=0; const p=P(); if(!p||!document.body.classList.contains('pch-on')) return; const z=cache.get(key()); if(z!==undefined) p.style.zoom=z===1?'':String(+z.toFixed(3)); };
  const soon=()=>{ if(!q) q=requestAnimationFrame(fit); };
  PC_STEPS.pre.push(()=>{ try{ pre(); }catch(e){ oops('pc/ui_fit:pre',e); } }); PC_STEPS.post.push(()=>soon()); /* PC page steps (pages_pc.js runs them) */
  document.addEventListener('click',e=>{ if(e.target.closest&&e.target.closest('#panel .sect-nav,#panel .bwx-nav,#panel details summary')) setTimeout(()=>{ passes=0; soon(); },30); },true);
  addEventListener('resize',()=>setTimeout(soon,60)); document.addEventListener('fullscreenchange',()=>setTimeout(soon,200));
  window.__pcfitSoon=()=>{ passes=0; soon(); }; // a page that changes its own content (a category picked) asks for a fresh fit
  if(/[?&]test\b/.test(location.search)) window.__pcfit=fit; }
document.head.insertAdjacentHTML('beforeend',`<style>
/* PC: the big Dock and aquarium previews no longer take the whole width and most of the screen height, so their pages fit at once */
body.pch-on #menuov #panel #homecv{width:min(100%,calc(min(calc(46*var(--uvh,1vh)),600px)*2.5))!important;height:auto!important;aspect-ratio:900/360;display:block;margin:0 auto}
body.pch-on #menuov #panel .tile:has(> #homecv){background:linear-gradient(180deg,#0f2034,#0a1626)}
body.pch-on #menuov #panel #tankcv{height:min(calc(34*var(--uvh,1vh)),420px)!important}
</style>`);
