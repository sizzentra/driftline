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
const MB_FRAME={ up:{edge:8, row1Top:6, row1H:36, row2Top:46, barH:58, barPad:3, barBtnH:50, barBottom:6},
                 land:{edge:8, row1Top:6, row1H:38, contentTop:49, bottom:6, railW:124, railWMini:56, railGap:6, railBtnH:40, railBtnGap:5} };
{ const U=MB_FRAME.up, L=MB_FRAME.land;
document.head.insertAdjacentHTML('beforeend',`<style>
/* ---- upright menus: same top row, same edges and the same bottom card as the water ---- */
html body.phone-app #menuov .mo-in{padding:${U.row1Top}px ${U.edge}px ${U.barBottom}px!important;grid-template-rows:${U.row1H}px auto minmax(0,1fr) ${U.barH}px!important;row-gap:4px!important}
html body.phone-app #menuov .mo-back{height:${U.row1H}px!important;min-height:${U.row1H}px!important;align-self:start!important}
html body.phone-app #menuov .mo-tools{align-self:start!important;height:${U.row1H}px!important}
html body.phone-app #menuov .mo-tools > *{height:${U.row1H}px!important;min-height:${U.row1H}px!important;box-sizing:border-box!important}
html body.phone-app #menuov .mo-tools > .mo-tb{width:${U.row1H}px!important;min-width:${U.row1H}px!important}
html body.phone-app #menuov .secbar{margin:0!important;height:${U.barH}px!important;box-sizing:border-box!important;padding:${U.barPad}px!important;gap:2px!important;border:1px solid rgba(255,255,255,.09)!important;border-radius:15px!important;background:#0c1626!important;align-self:stretch!important}
html body.phone-app #menuov .secbar > .secb{height:${U.barBtnH}px!important;min-height:${U.barBtnH}px!important;border-radius:12px!important}
/* ---- sideways menus: one top row at the water's height, content edges and rail exactly where the water has them ---- */
html body.phone-land #menuov .mo-in{padding:${L.row1Top}px ${L.edge}px ${L.bottom}px ${L.edge}px!important;grid-template-rows:${L.row1H}px minmax(0,1fr)!important;row-gap:${L.contentTop-L.row1Top-L.row1H}px!important;column-gap:${L.railGap}px!important}
html body.phone-land #menuov .mo-back{height:${L.row1H}px!important;min-height:${L.row1H}px!important;align-self:start!important}
html body.phone-land #menuov .mo-tools{align-self:start!important;height:${L.row1H}px!important}
html body.phone-land #menuov .mo-tools > *{height:${L.row1H}px!important;min-height:${L.row1H}px!important;box-sizing:border-box!important}
html body.phone-land #menuov .mo-tools > .mo-tb{width:${L.row1H}px!important;min-width:${L.row1H}px!important}
html body.phone-land #menuov #tabs .secbar{margin-bottom:0!important;max-height:none!important} /* the frame's bottom gap is the 6 px now; the old extra margin made the menu rail 6 px shorter than the water's */
html body.phone-land #menuov > #toast{left:calc((100% - ${L.railW+L.railGap}px) / 2)!important} /* notices centred over the page, not the whole screen (the rail sits on the right) */
html body.phone-land.dock-mini #menuov > #toast{left:calc((100% - ${L.railWMini+L.railGap}px) / 2)!important}
html body.phone-land #menuov #panel:not(.aq07){padding-top:8px!important} /* breathing room under the top row (the page box itself still starts at 49) */
html body.phone-land #menuov .subbar{align-self:start!important;height:${L.row1H}px!important;padding-top:0!important;padding-bottom:0!important}
html body.phone-land #menuov .subbar > .subp{height:${L.row1H}px!important;min-height:${L.row1H}px!important;box-sizing:border-box!important}
</style>`);
// ---- Back: the guard against the phone's follow-up tap now covers only a small circle where the finger lifted (it covered the
// whole screen for 0.45 s, so a quick next tap anywhere did nothing: "unresponsive at times") ----
let upX=-1, upY=-1; addEventListener('pointerup',e=>{ if(e.pointerType!=='mouse'){ upX=e.clientX; upY=e.clientY; } },true);
new MutationObserver(ms=>{ if(!MOB()) return; for(const m of ms) for(const n of m.addedNodes){ if(n.nodeType===1&&n.parentNode===document.body&&n.tagName==='DIV'&&n.style.zIndex==='2147483647'&&n.style.inset&&!n.children.length&&upX>=0){
    const R=36; n.style.inset='auto'; n.style.left=(upX-R)+'px'; n.style.top=(upY-R)+'px'; n.style.width=(2*R)+'px'; n.style.height=(2*R)+'px'; n.style.borderRadius='50%'; } } }).observe(document.body,{childList:true});
// ---- the measurement check (test builds only): returns every place that breaks the set measurements, on the screen now ----
if(/[?&]test\b/.test(location.search)) window.__spec=()=>{ for(const a of document.getAnimations()){ try{ if(a.effect&&a.effect.getComputedTiming().iterations!==Infinity) a.finish(); }catch(e){} } /* measure where things end up, not mid slide-in */
  const out=[], land=document.body.classList.contains('phone-land'), F=land?L:U, vw=innerWidth, vh=innerHeight, RW=document.body.classList.contains('dock-mini')?L.railWMini:L.railW;
  const R=e=>{ const r=e.getBoundingClientRect(); return {x:Math.round(r.x),y:Math.round(r.y),w:Math.round(r.width),h:Math.round(r.height),r:Math.round(r.right),b:Math.round(r.bottom)}; };
  const vis=s=>[...document.querySelectorAll(s)].filter(e=>e.getBoundingClientRect().width>0&&getComputedStyle(e).visibility!=='hidden');
  const near=(a,b,t=1)=>Math.abs(a-b)<=t; const bad=(what,got,want)=>out.push(what+': '+got+' (should be '+want+')');
  const menu=typeof MENU_OPEN!=='undefined'?MENU_OPEN:document.body.classList.contains('menu-open');
  if(!menu){ for(const e of vis('.hud > *')){ const r=R(e); if(r.y<F.row1Top+10){ if(!near(r.y,F.row1Top)||!near(r.h,F.row1H)) bad('top row '+(e.id||e.className.split(' ').pop()),r.y+'/'+r.h,F.row1Top+'/'+F.row1H); } else if(!land&&!near(r.y,U.row2Top)) bad('second row '+(e.id||e.className.split(' ').pop()),'top '+r.y,'top '+U.row2Top); }
    const st=document.getElementById('stage'); if(st){ const r=R(st); if(!near(r.x,F.edge)) bad('water left edge',r.x,F.edge); if(land){ if(!near(r.y,L.contentTop)) bad('water top',r.y,L.contentTop); if(!near(r.b,vh-L.bottom)) bad('water bottom',r.b,vh-L.bottom); } else if(!near(r.r,vw-U.edge)) bad('water right edge',r.r,vw-U.edge); }
    const cd=document.getElementById('catdock'); if(cd){ const r=R(cd); if(land){ if(!near(r.w,RW)||!near(r.r,vw-L.edge)||!near(r.y,L.contentTop)||!near(r.b,vh-L.bottom)) bad('side rail',r.x+','+r.y+' '+r.w+'w',(vw-L.edge-RW)+','+L.contentTop+' '+RW+'w'); } else if(!near(r.x,U.edge)||!near(r.b,vh-U.barBottom)||!near(r.h,U.barH)) bad('bottom tabs',r.x+','+r.b+' '+r.h+'h',U.edge+','+(vh-U.barBottom)+' '+U.barH+'h'); }
    // nothing drawn on the water may sit under the Rest / Bait buttons (the boost list lives in the top-left status corner)
    const rt=document.getElementById('resttog'), stg=document.getElementById('stage'); if(rt&&stg&&typeof MB_STATUS_B==='number'&&MB_STATUS_B>R(rt).y-R(stg).y) bad('status corner reaches the Rest button',MB_STATUS_B,'< '+(R(rt).y-R(stg).y)); }
  else { const mo=document.getElementById('menuov'); for(const e of [...mo.querySelectorAll('.mo-back,.mo-tools > *'+(land?',.subbar > .subp':''))].filter(e=>e.getBoundingClientRect().width>0)){ const r=R(e); if(!near(r.y,F.row1Top)||!near(r.h,F.row1H)) bad('menu top row '+e.className.split(' ')[0],r.y+'/'+r.h,F.row1Top+'/'+F.row1H); }
    if(!land) for(const e of vis('#menuov .subbar > .subp')){ const r=R(e); if(r.y<U.row2Top-1) bad('page tabs',r.y,'>= '+U.row2Top); }
    const body=mo.querySelector('.mo-body'); if(body){ const r=R(body); if(!near(r.x,F.edge)) bad('menu left edge',r.x,F.edge); if(land){ if(!near(r.y,L.contentTop)) bad('menu content top',r.y,L.contentTop); if(!near(r.r,vw-L.edge-RW-L.railGap)) bad('menu content right',r.r,vw-L.edge-RW-L.railGap); if(!near(r.b,vh-L.bottom)) bad('menu content bottom',r.b,vh-L.bottom); } }
    const sb=mo.querySelector('.secbar'); if(sb){ const r=R(sb); if(land){ if(!near(r.w,RW)||!near(r.r,vw-L.edge)||!near(r.y,L.contentTop)||!near(r.b,vh-L.bottom)) bad('menu side rail',r.x+','+r.y+' '+r.w+'w '+r.h+'h',(vw-L.edge-RW)+','+L.contentTop+' '+RW+'w'); } else if(!near(r.x,U.edge)||!near(r.b,vh-U.barBottom)||!near(r.h,U.barH)) bad('menu bottom tabs',r.x+','+r.b+' '+r.h+'h',U.edge+','+(vh-U.barBottom)+' '+U.barH+'h'); } }
  // every button you can see must take the tap (nothing on top of its middle)
  const card=document.getElementById('evcard'), cardOn=!!(card&&card.getClientRects().length); /* a popup card is on top by design: only its own buttons count then */
  const sticky=t=>{ for(let e=t;e&&e!==document.body;e=e.parentElement){ const p=getComputedStyle(e).position; if(p==='sticky') return true; } return false; }; /* scrolled under a sticky bar: scroll back to reach it */
  /* the top layer is the one that takes taps: Search (z 60) > a menu (45) > the catch card / a popup card (40) > the water */
  const on=id=>{ const e=document.getElementById(id); return e&&!e.hidden&&e.getClientRects().length&&getComputedStyle(e).display!=='none'?e:null; };
  const root=on('searchov')||(menu?document.getElementById('menuov'):null)||on('card')||(cardOn?card:null)||document; for(const el of root.querySelectorAll('button,[data-act],[data-sec],[role=button],select,input')){ const r=el.getBoundingClientRect(); if(r.width<4||r.height<4||el.disabled) continue; const cs=getComputedStyle(el); if(cs.visibility==='hidden'||cs.pointerEvents==='none') continue;
    if(!menu&&el.closest('#menuov')) continue; const cx=r.x+r.width/2, cy=r.y+r.height/2; if(cx<0||cy<0||cx>vw||cy>vh) continue; let p=el.parentElement, clip=false; while(p&&p!==document.body){ const ps=getComputedStyle(p); if(/(auto|scroll|hidden)/.test(ps.overflowY+ps.overflowX)){ const q=p.getBoundingClientRect(); if(cy<q.top+2||cy>q.bottom-2||cx<q.left+2||cx>q.right-2){ clip=true; break; } } p=p.parentElement; } if(clip) continue;
    const t=document.elementFromPoint(cx,cy); if(t&&!(t===el||el.contains(t))&&!(sticky(t)&&!sticky(el))) bad('covered button "'+(el.innerText||el.getAttribute('aria-label')||'').trim().replace(/\s+/g,' ').slice(0,20)+'"','under '+(t.id||t.className||t.tagName).toString().split(' ')[0],'nothing on top'); }
  return out; }; }
// ---- phone wording (found in the full QC pass, 2026-11-18): the bite hint and the catch card spoke about clicks and the Space key,
// which a phone has neither of ----
{ const MB_TOUCH=!!(window.matchMedia&&matchMedia('(pointer:coarse)').matches); /* our own check: the core's TOUCH is declared later in the build */
  const _sh=setHint; setHint=function(){ _sh.apply(this,arguments); if(!MB_TOUCH) return; try{ if(G.st==='bite'&&S.settings.hints){ const h=document.getElementById('hint'), t='<b>Now!</b> Tap the water to set the hook.'; if(h&&h.innerHTML!==t) h.innerHTML=t; } }catch(e){} };
  const tap=document.querySelector('#card .tap'); if(tap&&MB_TOUCH) tap.textContent='Tap to keep fishing'; }
