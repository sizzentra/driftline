
// =====================================================================
// 0.3 smooth menus: a click that changes something redraws the menu in place. The fade-in only
// plays when you open a different tab, and scroll position and open drop-downs are kept, so
// buying, equipping or toggling never looks like a page reload.
// =====================================================================
let _smoothTab=null;
const _renderPanel_2 = renderPanel;
renderPanel = function(){ const P=$('panel'); if(!P) return _renderPanel_2();
  const newTab = S.tab!==_smoothTab; _smoothTab=S.tab;
  const ps=P.scrollTop, ws=window.scrollY;
  const open=newTab?[]:[...P.querySelectorAll('details[open]')].map(d=>(d.querySelector('summary')||{}).textContent||'');
  _renderPanel_2();
  if(newTab){ P.classList.remove('pin'); void P.offsetWidth; P.classList.add('pin'); clearTimeout(P._pinT); P._pinT=setTimeout(()=>P.classList.remove('pin'),400); return; }
  if(open.length) for(const d of P.querySelectorAll('details')){ const s=(d.querySelector('summary')||{}).textContent||''; if(open.includes(s)) d.open=true; }
  if(P.scrollTop!==ps) P.scrollTop=ps; if(window.scrollY!==ws) window.scrollTo(0,ws); };
