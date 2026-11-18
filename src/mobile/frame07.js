// =====================================================================
// Phones: the SET MEASUREMENTS (director, 2026-11-18: "I want standards and set measurements for each platform going forward,
// I'm tired of the same mistakes"). The numbers are written down in docs/PLATFORM_DESIGN.md ("Phone frame: set measurements")
// and checked by window.__spec() in test builds. Rule: the water screen is the master; a menu matches it wherever the same thing
// appears (top row, side rail / bottom tabs, edges), so nothing moves or changes size when you open or close a menu.
//   Upright:  edges 8 px. Top row: top 6, height 36. Second row (water: location + goal; menus: page tabs): top 46.
//             Bottom tabs: a card 8 px from the sides and 6 px from the bottom, 58 tall (padding 3), buttons 50 tall.
//   Sideways: edges 8 px. Top row: top 6, height 38 (every chip, Back, coins, search, settings and the page tabs).
//             Content (the water or the page) starts at top 49 and ends 6 px above the bottom; the right rail is 124 wide,
//             6 px right of the content, 8 px from the right edge; its buttons are 40 tall, 5 apart.
// Also here: tapping right after Back works (the old guard blocked the whole screen for 0.45 s; now only where your finger was).
// Android + iPhone only.
// =====================================================================
const MB_FRAME={ up:{edge:8, row1Top:6, row1H:36, row2Top:46, row2H:30, stageTop:84, barH:58, barPad:3, barBtnH:50, barBottom:6},
                 land:{edge:8, row1Top:6, row1H:38, contentTop:49, bottom:6, railW:124, railWMini:56, railGap:6, railBtnH:40, railBtnGap:5} };
// ONE look per kind of control (director, 2026-11-18: "cross reference everything that's connected, we need this to stop being so
// inconsistent"). Measured across every page: buttons came in 9 heights, section tabs in 3 styles, badges in 4 sizes, descriptions in
// 2 sizes and 2 colours, and the bottom tabs changed text size between the water and the menus. Each kind now has one set of numbers
// (per orientation where the space differs); __spec checks them on every page.
const MB_UI={ up:{btnH:40, btnFs:15, btnSmH:36, btnSmFs:13, tabH:34, tabFs:12, h2Fs:21, h4Fs:14.5, barFs:10.5},
              land:{btnH:38, btnFs:15, btnSmH:32, btnSmFs:13, tabH:32, tabFs:13, h2Fs:18, h4Fs:15, barFs:11.5},
              all:{tabFw:800, tabRad:10, badge:18, badgeFs:10.5, descFs:12.5, descCol:'#97abc2', chipH:32, chipFw:700, chipRad:10} };
{ const U=MB_UI.up, L=MB_UI.land, A=MB_UI.all, both=(o,s)=>s.split(',').map(x=>'html body.phone-'+o+' '+x.trim()).join(','), P=(s)=>both('app',s)+','+both('land',s);
document.head.insertAdjacentHTML('beforeend',`<style>
/* buttons: two kinds. Regular (.btn) and small (.btn.sm, and the aquarium bar's compact pair). One line, never wrapping into a taller button */
${both('app','#menuov #panel button.btn')}{height:${U.btnH}px!important;min-height:${U.btnH}px!important;font-size:${U.btnFs}px!important;padding:0 14px!important;white-space:nowrap!important;box-sizing:border-box!important}
${both('app','#menuov #panel button.btn.sm, #menuov #panel.aq07 .aq07-bar .aq07-bank button.btn')}{height:${U.btnSmH}px!important;min-height:${U.btnSmH}px!important;font-size:${U.btnSmFs}px!important;padding:0 10px!important}
${both('land','#menuov #panel button.btn')}{height:${L.btnH}px!important;min-height:${L.btnH}px!important;font-size:${L.btnFs}px!important;padding:0 14px!important;white-space:nowrap!important;box-sizing:border-box!important}
${both('land','#menuov #panel button.btn.sm, #menuov #panel.aq07 .aq07-bar .aq07-bank button.btn')}{height:${L.btnSmH}px!important;min-height:${L.btnSmH}px!important;font-size:${L.btnSmFs}px!important;padding:0 10px!important}
/* section tabs inside pages (Gear / Bait, Waters / Set sail again, Games / Prize counter...): one style */
${both('app','#menuov #panel .bwx-nav:not(.wd-nav) > button')}{height:${U.tabH}px!important;min-height:${U.tabH}px!important;font-size:${U.tabFs}px!important}
${both('land','#menuov #panel .bwx-nav:not(.wd-nav) > button')}{height:${L.tabH}px!important;min-height:${L.tabH}px!important;font-size:${L.tabFs}px!important}
${P('#menuov #panel .bwx-nav > button')}{font-weight:${A.tabFw}!important;border-radius:${A.tabRad}px!important}
/* badges: one size and style everywhere (bottom tabs, side rail, page tabs, section tabs) */
${P('#catdock .cdb .cddot, #menuov .secb .secdot, #menuov .subbar .subp .subdot, #menuov #panel .sdot, .cddot, .secdot, .subdot, .sdot')}{min-width:${A.badge}px!important;height:${A.badge}px!important;line-height:${A.badge}px!important;font-size:${A.badgeFs}px!important;font-weight:800!important;padding:0 5px!important;border-radius:999px!important;box-sizing:border-box!important;color:#2a1206!important;text-align:center!important}
/* bottom tabs (upright) and side rail (sideways): the same label size on the water and in menus */
${both('app','#catdock .cdb, #menuov .secb')}{font-size:${U.barFs}px!important;border-radius:12px!important}
${both('land','#catdock .cdb, #menuov .secb')}{font-size:${L.barFs}px!important}
/* text */
${P('#menuov #panel p.sub')}{font-size:${A.descFs}px!important;color:${A.descCol}!important}
${both('app','#menuov #panel h4')}{font-size:${U.h4Fs}px!important}
${both('land','#menuov #panel h4')}{font-size:${L.h4Fs}px!important}
${both('app','#menuov #panel h2, #menuov #panel .tp-title, #menuov #panel h3.ev-h')}{font-size:${U.h2Fs}px!important;font-weight:800!important;color:#fff!important}
${both('land','#menuov #panel h2, #menuov #panel .tp-title, #menuov #panel h3.ev-h')}{font-size:${L.h2Fs}px!important;font-weight:800!important;color:#fff!important}
/* chips (filters, choices, toggles): one style */
${P('#menuov #panel .chipb')}{height:${A.chipH}px!important;font-weight:${A.chipFw}!important;border-radius:${A.chipRad}px!important}
/* upright: the "Next goal" chip stays one row tall like the location chip next to it (a long goal made it 44 px and pushed the
   water down 14 px): title on the same line as the label, the progress bar as a thin line along its bottom */
html body.phone-app .hud #goalchip{height:${MB_FRAME.up.row2H}px!important;min-height:0!important;display:flex!important;align-items:center!important;gap:6px!important;overflow:hidden!important;position:relative!important;box-sizing:border-box!important}
html body.phone-app .hud #goalchip > .gl-t{display:block!important;min-width:0!important;overflow:hidden!important;text-overflow:ellipsis!important;white-space:nowrap!important;flex:1 1 auto!important}
html body.phone-app .hud #goalchip > .gl-k{flex:0 0 auto!important}
html body.phone-app .hud #goalchip > .gl-bar{position:absolute!important;left:8px!important;right:8px!important;bottom:3px!important;height:3px!important;margin:0!important}
html body.phone-land .hud > .stat{min-width:max-content!important}
@media (max-height:560px){html body.phone-app.dl-fish .wrap{gap:${MB_FRAME.up.stageTop-MB_FRAME.up.row2Top-MB_FRAME.up.row2H}px!important}} /* upright in a short window (split screen): the short-screen gap meant for sideways phones must not move the water */
</style>`); }
{ const U=MB_FRAME.up, L=MB_FRAME.land;
document.head.insertAdjacentHTML('beforeend',`<style>
/* ---- upright menus: same top row, same edges and the same bottom card as the water ---- */
html body.phone-app #menuov .mo-in{padding:max(${U.row1Top}px,env(safe-area-inset-top)) max(${U.edge}px,env(safe-area-inset-right)) max(${U.barBottom}px,env(safe-area-inset-bottom)) max(${U.edge}px,env(safe-area-inset-left))!important; /* the same edges as the water (body.dl-fish padding): 8 px or the phone safe area (camera, rounded corners, home bar), whichever is bigger */grid-template-rows:${U.row1H}px auto minmax(0,1fr) ${U.barH}px!important;row-gap:4px!important}
html body.phone-app #menuov .mo-back{height:${U.row1H}px!important;min-height:${U.row1H}px!important;align-self:start!important}
html body.phone-app #menuov .mo-tools{align-self:start!important;height:${U.row1H}px!important}
html body.phone-app #menuov .mo-tools > *{height:${U.row1H}px!important;min-height:${U.row1H}px!important;box-sizing:border-box!important}
html body.phone-app #menuov .mo-tools > .mo-tb{width:${U.row1H}px!important;min-width:${U.row1H}px!important}
html body.phone-app #menuov .secbar{margin:0!important;height:${U.barH}px!important;box-sizing:border-box!important;padding:${U.barPad}px!important;gap:2px!important;border:1px solid rgba(255,255,255,.09)!important;border-radius:15px!important;background:#0c1626!important;align-self:stretch!important}
html body.phone-app #menuov .secbar > .secb{height:${U.barBtnH}px!important;min-height:${U.barBtnH}px!important;border-radius:12px!important}
/* ---- sideways menus: one top row at the water's height, content edges and rail exactly where the water has them ---- */
html body.phone-land #menuov .mo-in{padding:max(${L.row1Top}px,env(safe-area-inset-top)) max(${L.edge}px,env(safe-area-inset-right)) max(${L.bottom}px,env(safe-area-inset-bottom)) max(${L.edge}px,env(safe-area-inset-left))!important; /* same edges as the water, safe areas included */grid-template-rows:${L.row1H}px minmax(0,1fr)!important;row-gap:${L.contentTop-L.row1Top-L.row1H}px!important;column-gap:${L.railGap}px!important}
html body.phone-land #menuov .mo-back{height:${L.row1H}px!important;min-height:${L.row1H}px!important;align-self:start!important}
html body.phone-land #menuov .mo-tools{align-self:start!important;height:${L.row1H}px!important}
html body.phone-land #menuov .mo-tools > *{height:${L.row1H}px!important;min-height:${L.row1H}px!important;box-sizing:border-box!important}
html body.phone-land #menuov .mo-tools > .mo-tb{width:${L.row1H}px!important;min-width:${L.row1H}px!important}
html body.phone-land #menuov #tabs .secbar{margin-bottom:0!important;max-height:none!important} /* the frame's bottom gap is the 6 px now; the old extra margin made the menu rail 6 px shorter than the water's */
html body.phone-land #menuov > #toast{left:calc((100% + max(${L.edge}px,env(safe-area-inset-left)) - max(${L.edge}px,env(safe-area-inset-right)) - ${L.railW+L.railGap}px) / 2)!important} /* notices centred over the page, not the whole screen (the rail sits on the right) */
html body.phone-land.dock-mini #menuov > #toast{left:calc((100% + max(${L.edge}px,env(safe-area-inset-left)) - max(${L.edge}px,env(safe-area-inset-right)) - ${L.railWMini+L.railGap}px) / 2)!important}
.mb-sa-probe{position:fixed;left:0;top:0;visibility:hidden;pointer-events:none;padding:env(safe-area-inset-top,0px) env(safe-area-inset-right,0px) env(safe-area-inset-bottom,0px) env(safe-area-inset-left,0px)} /* lets the check read the safe areas */
html body.phone-land #menuov #panel:not(.aq07){padding-top:8px!important} /* breathing room under the top row (the page box itself still starts at 49) */
html body.phone-land #menuov .subbar{align-self:start!important;height:${L.row1H}px!important;padding-top:0!important;padding-bottom:0!important}
html body.phone-land #menuov .subbar > .subp{height:${L.row1H}px!important;min-height:${L.row1H}px!important;box-sizing:border-box!important}
/* the page-tab row only ever scrolls sideways (director, 2026-11-18: "this menu's top headers are unresponsive at times and don't feel
   fluid"). It could also scroll up/down by 4 px while the tabs slide in (0.28 s after a section opens), so a tap that moved a pixel
   became a tiny scroll: the tabs jiggled and the phone cancelled the tap. Both orientations. */
html body.phone-app #menuov .subbar,html body.phone-land #menuov .subbar{overflow-y:hidden!important;touch-action:pan-x!important;overscroll-behavior:contain!important}
/* ...and when a badge ("Events 1") makes the tabs a few px too wide for the row, they squeeze instead of the row scrolling sideways
   (it slid 2 px under the finger at 844 px wide): side padding follows the screen width, and tabs may shrink */
html body.phone-land #menuov .subbar > .subp{padding-left:clamp(6px,1.2vw,11px)!important;padding-right:clamp(6px,1.2vw,11px)!important;flex:0 1 auto!important;min-width:0!important}
/* narrow sideways screens (iPhone SE / 8 at 667 px): five page tabs (Challenges) don't fit with icons in the ~350 px row, so the
   header tabs show their names only there (each icon + gap is 23 px) */
@media (orientation:landscape) and (max-width:759px){ html body.phone-land #menuov .subbar > .subp > .subi{display:none!important} html body.phone-land #menuov .subbar > .subp{gap:4px!important} }
/* sideways, header-tab badges always sit on the tab's top corner (like the side rail's), at every width: a count never makes a tab wider,
   so the row never changes size when a badge appears */
html body.phone-land #menuov .subbar > .subp{position:relative!important}
html body.phone-land #menuov .subbar > .subp > .subdot{position:absolute!important;top:-6px!important;right:-5px!important;margin:0!important;z-index:2!important}
html body.phone-land #menuov .subbar{overflow:visible!important} /* the row always fits now (tabs squeeze, names only under 760 px), so it never scrolls: badges can poke out of the corner like the side rail's and never cover a label */ /* size and style: the one badge standard (MB_UI) */
/* in-page section bars (Gear / Bait..., Games / Prize counter...) sit inside the scrolling page, so they keep vertical page swipes; they
   only lose their own few-pixel vertical scroll */
html body.phone-app #menuov #panel .bwx-nav,html body.phone-land #menuov #panel .bwx-nav{overflow-y:hidden!important}
/* sideways, a row of section tabs squeezes a little instead of overflowing (the Wardrobe's 7 categories were 6-8 px too wide once the camera safe areas narrowed the page, so "Shop" hid under the scroll arrow) */
html body.phone-land #menuov #panel .bwx-nav > button,html body.phone-app #menuov #panel .bwx-nav.mb-squeeze > button{flex:1 1 auto!important;min-width:0!important;padding-left:clamp(5px,0.9vw,9px)!important;padding-right:clamp(5px,0.9vw,9px)!important} /* upright, only rows that are just a little too wide squeeze (mb-squeeze, set by the fit step); rows far too wide stay real sideways scroll areas */
/* the backdrop behind a section bar stuck to the top reached 10 px past the bar (inset -24 -10 -10). The bar clips it, so those 10 px
   were invisible, but they made every stuck bar scroll 10 px sideways (and 10 px down): it shifted under the finger. Kept inside. */
html body.phone-app #menuov #panel .bwx-nav.stuck:not(.wd-top)::before,html body.phone-land #menuov #panel .bwx-nav.stuck:not(.wd-top)::before{inset:0!important}
</style>`);
// ---- Back: the guard against the phone's follow-up tap now covers only a small circle where the finger lifted (it covered the
// whole screen for 0.45 s, so a quick next tap anywhere did nothing: "unresponsive at times") ----
let upX=-1, upY=-1; addEventListener('pointerup',e=>{ if(e.pointerType!=='mouse'){ upX=e.clientX; upY=e.clientY; } },true);
new MutationObserver(ms=>{ if(!MOB()) return; for(const m of ms) for(const n of m.addedNodes){ if(n.nodeType===1&&n.parentNode===document.body&&n.tagName==='DIV'&&n.style.zIndex==='2147483647'&&n.style.inset&&!n.children.length&&upX>=0){
    const R=36; n.style.inset='auto'; n.style.left=(upX-R)+'px'; n.style.top=(upY-R)+'px'; n.style.width=(2*R)+'px'; n.style.height=(2*R)+'px'; n.style.borderRadius='50%'; } } }).observe(document.body,{childList:true});
// ---- button labels always fit on one line: a label wider than its button (e.g. "Unlock · 1,200,000" in a narrow card) shrinks in
// half-pixel steps down to 12 px instead of wrapping into a taller button. Runs at most once a frame, only while a menu is open. ----
{ let queued=false; const fit=()=>{ queued=false; if(!MOB()||!MENU_OPEN) return; const P=document.querySelector('#menuov #panel'); if(!P) return;
    /* buttons (never under 12 px) and tabs: section tabs and header page tabs (never under 11 px); corner badges are left out when measuring */
    const over=b=>{ const abs=[...b.children].filter(k=>getComputedStyle(k).position==='absolute'); const keep=abs.map(k=>k.style.display); abs.forEach(k=>k.style.display='none'); const o=b.scrollWidth>b.clientWidth+1; abs.forEach((k,i)=>k.style.display=keep[i]); return o; };
    const mo=document.getElementById('menuov');
    /* labels inside a button may carry their own text size (Wardrobe tabs do), so the button and its text pieces shrink together */
    const parts=b=>[b,...[...b.querySelectorAll('*')].filter(k=>getComputedStyle(k).position!=='absolute'&&!k.matches('.subi, .sdot, .subdot, .cddot, .secdot'))]; /* badges keep the one badge size */
    /* upright: a section row only a little too wide (up to 24 px) squeezes; one far too wide stays a real sideways scroll area */
    if(document.body.classList.contains('phone-app')) for(const row of mo.querySelectorAll('#panel .bwx-nav:not(.wd-nav)')){ row.classList.remove('mb-squeeze'); const dx=row.scrollWidth-row.clientWidth; if(dx>0&&dx<=24) row.classList.add('mb-squeeze'); }
    for(const [sel,min] of [['#panel button.btn',12],['#panel .bwx-nav > button',11],['.subbar > .subp',11]]) for(const b of mo.querySelectorAll(sel)){ if(!b.getClientRects().length) continue; if(b.dataset.fit){ parts(b).forEach(k=>k.style.removeProperty('font-size')); delete b.dataset.fit; }
      if(!over(b)) continue; const ps=parts(b), base=ps.map(k=>parseFloat(getComputedStyle(k).fontSize)); let s=1; while(over(b)&&base[0]*s>min){ s-=.5/base[0]; ps.forEach((k,i)=>k.style.setProperty('font-size',(base[i]*s).toFixed(2)+'px','important')); } b.dataset.fit='1'; } };
  /* right after the menu's content changes and before the screen is drawn (so a cut label never shows for even a frame); only
     changes inside the menu count, and only while one is open */
  new MutationObserver(ms=>{ if(!MOB()||typeof MENU_OPEN==='undefined'||!MENU_OPEN) return; const mo=document.getElementById('menuov'); if(mo&&ms.some(m=>mo.contains(m.target))) fit(); }).observe(document.body,{childList:true,subtree:true});
  window.addEventListener('resize',()=>{ if(!queued){ queued=true; requestAnimationFrame(fit); } });
  if(/[?&]test\b/.test(location.search)) window.__mbFit=fit; }
// ---- the measurement check (test builds only): returns every place that breaks the set measurements, on the screen now ----
if(/[?&]test\b/.test(location.search)) window.__spec=()=>{ for(const a of document.getAnimations()){ try{ if(a.effect&&a.effect.getComputedTiming().iterations!==Infinity) a.finish(); }catch(e){} } /* measure where things end up, not mid slide-in */
  /* the phone's safe areas (camera cutout, rounded corners, home bar), read through a probe; every expected position follows them
     exactly like the water does: an edge is the standard number or the safe area, whichever is bigger */
  const SA=(()=>{ const p=document.createElement('div'); p.className='mb-sa-probe'; document.body.appendChild(p); const c=getComputedStyle(p); const o={l:parseFloat(c.paddingLeft)||0,r:parseFloat(c.paddingRight)||0,t:parseFloat(c.paddingTop)||0,b:parseFloat(c.paddingBottom)||0}; p.remove(); return o; })();
  const sh=o=>{ const c=Object.assign({},o), dT=Math.max(o.row1Top,SA.t)-o.row1Top; c.edge=Math.max(o.edge,SA.l); c.edgeR=Math.max(o.edge,SA.r); c.row1Top+=dT; for(const k of ['row2Top','stageTop','contentTop']) if(c[k]!=null) c[k]+=dT; if(c.bottom!=null) c.bottom=Math.max(o.bottom,SA.b); if(c.barBottom!=null) c.barBottom=Math.max(o.barBottom,SA.b); return c; };
  const U=sh(MB_FRAME.up), L=sh(MB_FRAME.land);
  const out=[], land=document.body.classList.contains('phone-land'), F=land?L:U, vw=innerWidth, vh=innerHeight, RW=document.body.classList.contains('dock-mini')?L.railWMini:L.railW;
  const R=e=>{ const r=e.getBoundingClientRect(); return {x:Math.round(r.x),y:Math.round(r.y),w:Math.round(r.width),h:Math.round(r.height),r:Math.round(r.right),b:Math.round(r.bottom)}; };
  const vis=s=>[...document.querySelectorAll(s)].filter(e=>e.getBoundingClientRect().width>0&&getComputedStyle(e).visibility!=='hidden');
  const near=(a,b,t=1)=>Math.abs(a-b)<=t; const bad=(what,got,want)=>out.push(what+': '+got+' (should be '+want+')');
  const menu=typeof MENU_OPEN!=='undefined'?MENU_OPEN:document.body.classList.contains('menu-open');
  if(!menu){ for(const e of vis('.hud > *')){ const r=R(e); if(r.y<F.row1Top+10){ if(!near(r.y,F.row1Top)||!near(r.h,F.row1H)) bad('top row '+(e.id||e.className.split(' ').pop()),r.y+'/'+r.h,F.row1Top+'/'+F.row1H); } else if(!land&&!near(r.y,U.row2Top)) bad('second row '+(e.id||e.className.split(' ').pop()),'top '+r.y,'top '+U.row2Top); }
    const st=document.getElementById('stage'); if(st){ const r=R(st); if(!near(r.x,F.edge)) bad('water left edge',r.x,F.edge); if(land){ if(!near(r.y,L.contentTop)) bad('water top',r.y,L.contentTop); if(!near(r.b,vh-L.bottom)) bad('water bottom',r.b,vh-L.bottom); } else if(!near(r.r,vw-U.edgeR)) bad('water right edge',r.r,vw-U.edgeR); }
    const cd=document.getElementById('catdock'); if(cd){ const r=R(cd); if(land){ if(!near(r.w,RW)||!near(r.r,vw-L.edgeR)||!near(r.y,L.contentTop)||!near(r.b,vh-L.bottom)) bad('side rail',r.x+','+r.y+' '+r.w+'w',(vw-L.edgeR-RW)+','+L.contentTop+' '+RW+'w'); } else if(!near(r.x,U.edge)||!near(r.b,vh-U.barBottom)||!near(r.h,U.barH)) bad('bottom tabs',r.x+','+r.b+' '+r.h+'h',U.edge+','+(vh-U.barBottom)+' '+U.barH+'h'); }
    // nothing drawn on the water may sit under the Rest / Bait buttons (the boost list lives in the top-left status corner)
    const rt=document.getElementById('resttog'), stg=document.getElementById('stage'); if(rt&&stg&&typeof MB_STATUS_B==='number'&&MB_STATUS_B>R(rt).y-R(stg).y) bad('status corner reaches the Rest button',MB_STATUS_B,'< '+(R(rt).y-R(stg).y)); }
  else { const mo=document.getElementById('menuov'); for(const e of [...mo.querySelectorAll('.mo-back,.mo-tools > *'+(land?',.subbar > .subp':''))].filter(e=>e.getBoundingClientRect().width>0)){ const r=R(e); if(!near(r.y,F.row1Top)||!near(r.h,F.row1H)) bad('menu top row '+e.className.split(' ')[0],r.y+'/'+r.h,F.row1Top+'/'+F.row1H); }
    if(!land) for(const e of vis('#menuov .subbar > .subp')){ const r=R(e); if(r.y<U.row2Top-1) bad('page tabs',r.y,'>= '+U.row2Top); }
    const body=mo.querySelector('.mo-body'); if(body){ const r=R(body); if(!near(r.x,F.edge)) bad('menu left edge',r.x,F.edge); if(land){ if(!near(r.y,L.contentTop)) bad('menu content top',r.y,L.contentTop); if(!near(r.r,vw-L.edgeR-RW-L.railGap)) bad('menu content right',r.r,vw-L.edgeR-RW-L.railGap); if(!near(r.b,vh-L.bottom)) bad('menu content bottom',r.b,vh-L.bottom); } }
    const sb=mo.querySelector('.secbar'); if(sb){ const r=R(sb); if(land){ if(!near(r.w,RW)||!near(r.r,vw-L.edgeR)||!near(r.y,L.contentTop)||!near(r.b,vh-L.bottom)) bad('menu side rail',r.x+','+r.y+' '+r.w+'w '+r.h+'h',(vw-L.edgeR-RW)+','+L.contentTop+' '+RW+'w'); } else if(!near(r.x,U.edge)||!near(r.b,vh-U.barBottom)||!near(r.h,U.barH)) bad('menu bottom tabs',r.x+','+r.b+' '+r.h+'h',U.edge+','+(vh-U.barBottom)+' '+U.barH+'h'); } }
  // no wobbly rows: anything holding buttons that can scroll by only a few pixels in some direction swallows taps as tiny scrolls
  for(const s of vis('#menuov *, .hud, #catdock, #stage > *')){ if(!s.querySelector||!s.querySelector('button')) continue; if(s.matches('#panel,.mo-body,.aq07-body')) continue; /* page scroll areas may scroll any amount */ const cs=getComputedStyle(s);
    const dy=s.scrollHeight-s.clientHeight, dx=s.scrollWidth-s.clientWidth;
    if(/(auto|scroll)/.test(cs.overflowY)&&dy>0&&dy<=12) bad('row scrolls up/down by '+dy+' px "'+(s.className||s.id||s.tagName).toString().split(' ')[0]+'"',dy+' px','0 (fits, or a real scroll area)');
    if(/(auto|scroll)/.test(cs.overflowX)&&dx>0&&dx<=12) bad('row scrolls sideways by '+dx+' px "'+(s.className||s.id||s.tagName).toString().split(' ')[0]+'"',dx+' px','0 (fits, or a real scroll area)'); }
  // no cut labels: a tab or button whose own text is wider than the button
  for(const b of vis('#menuov .subp, #menuov #panel .bwx-nav > button, #menuov #panel button.btn, #menuov #panel .chipb, #catdock .cdb, #menuov .secb, .hud > .stat, .hud > .hud-link')){ /* corner badges poke out on purpose: measure the label without them */ const abs=[...b.querySelectorAll('*')].filter(k=>getComputedStyle(k).position==='absolute'); const keep=abs.map(k=>k.style.display); abs.forEach(k=>k.style.display='none'); const inner=[...b.querySelectorAll(".lbl, b, span")].find(k=>getComputedStyle(k).position!=="absolute"&&k.clientWidth&&k.scrollWidth>k.clientWidth+1); const cut=b.scrollWidth>b.clientWidth+1||!!inner, sw=inner?inner.scrollWidth:b.scrollWidth; abs.forEach((k,i)=>k.style.display=keep[i]); if(cut) bad('label cut "'+b.innerText.trim().replace(/\s+/g,' ').slice(0,20)+'"',sw+' px of text in '+b.clientWidth,'fits'); }
  // one look per kind of control (MB_UI): every button, section tab, badge, bar label and description matches its standard
  { const UI=land?MB_UI.land:MB_UI.up, AL=MB_UI.all, px=e=>Math.round(e.getBoundingClientRect().height), fs=e=>parseFloat(getComputedStyle(e).fontSize), tag=e=>'"'+(e.innerText||'').trim().replace(/\s+/g,' ').slice(0,18)+'"';
    for(const b of vis('#menuov #panel button.btn')){ const sm=b.matches('.sm, .aq07-bar .btn'), H=sm?UI.btnSmH:UI.btnH, F=sm?UI.btnSmFs:UI.btnFs; const fsOk=b.dataset.fit?(fs(b)>=12&&fs(b)<=F+.3):Math.abs(fs(b)-F)<=.3; /* a fitted label may be smaller, never under 12 px */ if(Math.abs(px(b)-H)>1||!fsOk) bad((sm?'small':'regular')+' button '+tag(b),px(b)+'px / '+fs(b)+'px text',H+'px / '+F+'px'); }
    for(const b of vis('#menuov #panel .bwx-nav:not(.wd-nav) > button')){ const fOk=b.dataset.fit?(fs(b)>=11&&fs(b)<=UI.tabFs+.3):Math.abs(fs(b)-UI.tabFs)<=.3; /* a fitted label may be smaller, never under 11 px */ if(Math.abs(px(b)-UI.tabH)>1||!fOk||getComputedStyle(b).fontWeight!==String(AL.tabFw)) bad('section tab '+tag(b),px(b)+'px / '+fs(b)+'px / '+getComputedStyle(b).fontWeight,UI.tabH+'px / '+UI.tabFs+'px / '+AL.tabFw); }
    for(const d of vis('.cddot, .secdot, .subdot, .sdot')){ if(d.hidden) continue; if(Math.abs(px(d)-AL.badge)>1||Math.abs(fs(d)-AL.badgeFs)>.3) bad('badge '+tag(d),px(d)+'px / '+fs(d)+'px',AL.badge+'px / '+AL.badgeFs+'px');
      /* a badge never covers its button's label */ const host=d.parentElement, br=d.getBoundingClientRect(); for(const n of host.childNodes){ if(n===d||(n.nodeType===1&&(n.classList.contains('subi')||getComputedStyle(n).position==='absolute'))) continue; const rg=document.createRange(); rg.selectNodeContents(n); const tf=parseFloat(getComputedStyle(n.nodeType===1?n:host).fontSize); for(const r0 of rg.getClientRects()){ const lead=Math.max(0,(r0.height-tf)/2), r={left:r0.left,right:r0.right,top:r0.top+lead,bottom:r0.bottom-lead}; /* the letters, not the empty line spacing above and below them */ const ox=Math.min(r.right,br.right)-Math.max(r.left,br.left), oy=Math.min(r.bottom,br.bottom)-Math.max(r.top,br.top); if(ox>1&&oy>1&&(n.textContent||'').trim()) bad('badge covers the label '+tag(host),Math.round(ox)+'x'+Math.round(oy)+' px','no overlap'); } } }
    for(const b of vis('#catdock .cdb, #menuov .secb')){ if(Math.abs(fs(b)-UI.barFs)>.3) bad('category button text '+tag(b),fs(b)+'px',UI.barFs+'px'); }
    for(const p of vis('#menuov #panel p.sub')){ if(Math.abs(fs(p)-AL.descFs)>.3) bad('description text',fs(p)+'px',AL.descFs+'px'); }
    if(!land&&!menu){ const g=document.getElementById('goalchip'), st=document.getElementById('stage'); if(g&&g.getClientRects().length&&Math.abs(px(g)-MB_FRAME.up.row2H)>1) bad('goal chip height',px(g),MB_FRAME.up.row2H); if(st&&Math.abs(Math.round(st.getBoundingClientRect().top)-U.stageTop)>1) bad('water top (upright)',Math.round(st.getBoundingClientRect().top),U.stageTop); } }
  // every button you can see must take the tap (nothing on top of its middle)
  const card=document.getElementById('evcard'), cardOn=!!(card&&card.getClientRects().length); /* a popup card is on top by design: only its own buttons count then */
  const sticky=t=>{ for(let e=t;e&&e!==document.body;e=e.parentElement){ const p=getComputedStyle(e).position; if(p==='sticky') return true; } return false; }; /* scrolled under a sticky bar: scroll back to reach it */
  /* the top layer is the one that takes taps: Search (z 60) > a menu (45) > the catch card / a popup card (40) > the water */
  const on=id=>{ const e=document.getElementById(id); return e&&!e.hidden&&e.getClientRects().length&&getComputedStyle(e).display!=='none'?e:null; };
  const root=on('searchov')||(menu?document.getElementById('menuov'):null)||on('card')||(cardOn?card:null)||document; for(const el of root.querySelectorAll('button,[data-act],[data-sec],[role=button],select,input')){ const r=el.getBoundingClientRect(); if(r.width<4||r.height<4||el.disabled) continue; const cs=getComputedStyle(el); if(cs.visibility==='hidden'||cs.pointerEvents==='none') continue;
    if(!menu&&el.closest('#menuov')) continue; const cx=r.x+r.width/2, cy=r.y+r.height/2; if(cx<0||cy<0||cx>vw||cy>vh) continue; let p=el.parentElement, clip=false; while(p&&p!==document.body){ const ps=getComputedStyle(p); if(/(auto|scroll|hidden)/.test(ps.overflowY+ps.overflowX)){ const q=p.getBoundingClientRect(); if(cy<q.top+2||cy>q.bottom-2||cx<q.left+2||cx>q.right-2){ clip=true; break; } } p=p.parentElement; } if(clip) continue;
    const t=document.elementFromPoint(cx,cy); if(t&&!(t===el||el.contains(t))&&!(sticky(t)&&!sticky(el))) bad('covered button "'+(el.innerText||el.getAttribute('aria-label')||'').trim().replace(/\s+/g,' ').slice(0,20)+'"','under '+(t.id||t.className||t.tagName).toString().split(' ')[0],'nothing on top'); }
  // nothing you read or tap sits under the camera cutout, a rounded corner or the home bar
  if(SA.l||SA.r||SA.t||SA.b){ const lay=root===document?document.body:root; for(const e of lay.querySelectorAll('button, h2, h3, h4, p, .stat, .hud-link, #goalchip, .chipb, .subp, input, select')){ const r=e.getBoundingClientRect(); if(r.width<2||r.height<2||getComputedStyle(e).visibility==='hidden') continue; if(r.right<0||r.left>vw||r.bottom<0||r.top>vh) continue;
      /* only the part you can actually see: cut the element down to every scrolling / clipping box it sits in */
      const v={l:r.left,r:r.right,t:r.top,b:r.bottom}; for(let p=e.parentElement;p&&p!==document.body;p=p.parentElement){ const ps=getComputedStyle(p); if(/(auto|scroll|hidden|clip)/.test(ps.overflowY+ps.overflowX)){ const q=p.getBoundingClientRect(); if(/(auto|scroll|hidden|clip)/.test(ps.overflowX)){ v.l=Math.max(v.l,q.left); v.r=Math.min(v.r,q.right); } if(/(auto|scroll|hidden|clip)/.test(ps.overflowY)){ v.t=Math.max(v.t,q.top); v.b=Math.min(v.b,q.bottom); } } }
      if(v.r-v.l<2||v.b-v.t<2) continue;
      if(v.l<SA.l-.5||v.r>vw-SA.r+.5||v.t<SA.t-.5||v.b>vh-SA.b+.5) bad('under the camera / corner / home bar "'+(e.innerText||e.getAttribute('aria-label')||e.tagName).trim().replace(/\s+/g,' ').slice(0,18)+'"',Math.round(v.l)+'–'+Math.round(v.r)+' x '+Math.round(v.t)+'–'+Math.round(v.b),'inside '+SA.l+'–'+(vw-SA.r)+' x '+SA.t+'–'+(vh-SA.b)); } }
  return out; };
  // test builds only: make the test browser behave like a phone with safe areas (e.g. iPhone Pro Max sideways: 59 left, 59 right,
  // 21 bottom), by writing those numbers into every style that uses the phone's safe areas. Reload the page to undo.
  if(/[?&]test\b/.test(location.search)) window.__safeSim=(l,r,t,b)=>{ const px={left:l,right:r,top:t,bottom:b}; const fix=v=>v.replace(/env\(\s*safe-area-inset-(left|right|top|bottom)\s*(?:,[^()]*(?:\([^()]*\))?[^()]*)?\)/g,(m,s)=>px[s]+'px'); let n=0;
    /* the whole rule text, so shorthands (padding: max(...) max(...)...) and !important are kept */
    const walk=rs=>{ for(const rule of rs){ if(rule.cssRules&&!rule.selectorText) walk(rule.cssRules); else if(rule.style&&rule.style.cssText.includes('safe-area-inset')){ rule.style.cssText=fix(rule.style.cssText); n++; } } };
    for(const ss of document.styleSheets){ try{ walk(ss.cssRules); }catch(e){} } for(const el of document.querySelectorAll('[style*="safe-area-inset"]')){ el.setAttribute('style',fix(el.getAttribute('style'))); n++; } dispatchEvent(new Event('resize')); /* positions the game works out on a resize */ return n; }; }
// ---- phone wording (found in the full QC pass, 2026-11-18): the bite hint and the catch card spoke about clicks and the Space key,
// which a phone has neither of ----
{ const MB_TOUCH=!!(window.matchMedia&&matchMedia('(pointer:coarse)').matches); /* our own check: the core's TOUCH is declared later in the build */
  const _sh=setHint; setHint=function(){ _sh.apply(this,arguments); if(!MB_TOUCH) return; try{ if(G.st==='bite'&&S.settings.hints){ const h=document.getElementById('hint'), t='<b>Now!</b> Tap the water to set the hook.'; if(h&&h.innerHTML!==t) h.innerHTML=t; } }catch(e){} };
  const tap=document.querySelector('#card .tap'); if(tap&&MB_TOUCH) tap.textContent='Tap to keep fishing'; }
