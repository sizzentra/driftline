
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

// test-only (?test): time the scene helpers during one land rebuild, to find what makes light changes slow
if(/[?&]test\b/.test(location.search)) window.__prof=(n=3)=>{ const names=['v3range','v3hillBand','v3tree','v3rock','v3water','v3glitter','v3mist','v3stack','v3palm','v3snowPine','v3pine','v3glow','v3leafTree','v3bushes','v3flowers','v3reeds','v3fishRing','v3willow'];
  const T={}, orig={}; for(const k of names){ try{ orig[k]=eval(k); T[k]=0; eval(k+'=function(){ const t0=performance.now(); const r=orig["'+k+'"].apply(this,arguments); T["'+k+'"]+=performance.now()-t0; return r; }'); }catch(e){} }
  const tot=__landCost(n); for(const k in orig) eval(k+'=orig["'+k+'"]'); const o={total:tot}; for(const k in T) if(T[k]>.2) o[k]=+(T[k]/n).toFixed(1); return o; };
if(/[?&]test\b/.test(location.search)) window.__landSplit=(n=5)=>{ const L=LOCS.find(l=>l.id===S.loc), P=v3palette.v, hz=H*.5;
  const real=document.createElement('canvas'); real.width=W*DPR; real.height=H*DPR; const rx=real.getContext('2d'); rx.setTransform(DPR,0,0,DPR,0,0);
  const noop=new Proxy({},{get:(o,k)=>{ if(k==='canvas') return real; const v=rx[k]; if(typeof v==='function') return /^create|getImageData|measureText|isPointInPath/.test(k)?v.bind(rx):()=>{}; return v; }, set:()=>true});
  let a=0,b=0; for(let i=0;i<n;i++){ let t0=performance.now(); V3SCENES[L.id].land(noop,P,hz,real); a+=performance.now()-t0; t0=performance.now(); V3SCENES[L.id].land(rx,P,hz,real); b+=performance.now()-t0; }
  return {jsOnly:+(a/n).toFixed(1), full:+(b/n).toFixed(1)}; };
// test-only: time named functions across many frames; reports the worst single call of each
if(/[?&]test\b/.test(location.search)) window.__timeFns=(names,run)=>{ const T={}, orig={}; for(const k of names){ try{ orig[k]=eval(k); T[k]=0; eval(k+'=function(){ const t0=performance.now(); const r=orig["'+k+'"].apply(this,arguments); const d=performance.now()-t0; if(d>T["'+k+'"]) T["'+k+'"]=d; return r; }'); }catch(e){ T[k]='n/a'; } } try{ run(); } finally { for(const k in orig) eval(k+'=orig["'+k+'"]'); } const o={}; for(const k in T) o[k]=typeof T[k]==='number'?+T[k].toFixed(1):T[k]; return o; };
