// =====================================================================
// 0.4.9 PC display (director, 2026-11-19: "pc support for multiple sizes so people playing on a bigger monitor don't feel like the scale
// is wrong, pc should potentially have its own display settings and resolution settings"). PC only.
//  - The PC interface is designed for a 1080p screen. On bigger windows (1440p, 4K, ultrawide) it grows to match, so menus, text and
//    buttons keep the same size on screen; smaller windows stay at 100%.
//  - Settings › Display › Interface size: Auto (by window size) or a fixed 85–200%.
//  - Settings › Display › Picture quality: Auto, Sharp (full resolution up to 4K), Balanced, or Fast (for older PCs).
//  How: the whole page is zoomed (CSS zoom on <html>); rules that used viewport units read --uvh / --uvw, which undo the zoom, and the
//  water canvas renders at window size × zoom, so it stays sharp (c_logic.js resize: UIZ).
// =====================================================================
const UI_SCALES=[['auto','Auto'],[.85,'85%'],[1,'100%'],[1.15,'115%'],[1.3,'130%'],[1.5,'150%'],[1.75,'175%'],[2,'200%']];
const RENDER_Q=[['auto','Auto'],['sharp','Sharp'],['balanced','Balanced'],['fast','Fast']];
function uiAutoZoom(){ const z=Math.min(innerWidth/1920, innerHeight/1080); return z<1.08?1:Math.min(2.5,Math.round(z*20)/20); }
function uiZoomWanted(){ const v=S&&S.settings&&S.settings.uiScale; return v==='auto'||v==null ? uiAutoZoom() : clamp(+v||1,.85,2.5); }
function uiApplyZoom(force){ const z=uiZoomWanted(); if(!force&&Math.abs(z-UIZ)<.001) return; UIZ=z; const R=document.documentElement;
  R.style.zoom=z===1?'':String(z); R.style.setProperty('--uvh',z===1?'1vh':'calc(1vh / '+z+')'); R.style.setProperty('--uvw',z===1?'1vw':'calc(1vw / '+z+')');
  try{ resize(); }catch(e){ oops('pc/ui_display:resize',e); } try{ if(MENU_OPEN) renderPanel(); }catch(e){ oops('pc/ui_display:renderPanel',e); } }
addEventListener('resize',()=>{ clearTimeout(uiApplyZoom.t); uiApplyZoom.t=setTimeout(()=>uiApplyZoom(false),60); });
// picture quality: how many pixels the water is drawn with
{ const _rd=renderDPR; renderDPR=function(w,h){ const q=(S&&S.settings&&S.settings.renderQ)||'auto'; const dpr=window.devicePixelRatio||1;
    if(q==='fast') return 1; if(q==='sharp'){ let d=Math.min(2,dpr); const cap=8.3e6; if(d>1&&w*h*d*d>cap) d=Math.max(1,Math.sqrt(cap/(w*h))); return Math.round(d*100)/100; }
    if(q==='balanced'){ let d=Math.min(1.5,dpr); const cap=2.1e6; if(d>1&&w*h*d*d>cap) d=Math.max(1,Math.sqrt(cap/(w*h))); return Math.round(d*100)/100; }
    /* Auto on PC (PC Reborn, director 2026-11-21: "pc doesn't have enough pixels"; PCs have power to spare): the water is drawn at 1.5×
       its size (at least) and scaled down, so edges and small details come out sharp; capped at about 8 million pixels */
    { let d=Math.min(2,Math.max(dpr,1.5)); const cap=8.3e6; if(w*h*d*d>cap) d=Math.max(1,Math.sqrt(cap/(w*h))); return Math.round(d*100)/100; } }; }
// Settings › Display: the two rows, right under the Display heading
{ const _rs=renderSettings; renderSettings=function(P){ const r=_rs.apply(this,arguments); try{ const pn=P||$('panel'), h=[...pn.querySelectorAll('h4')].find(x=>/^Display$/.test(x.textContent.trim())); if(!h||pn.querySelector('[data-act="uiscale"]')) return r;
    const s=S.settings, cur=String(s.uiScale==null?'auto':s.uiScale), q=s.renderQ||'auto', chips=(act,L,c)=>`<div class="chips">${L.map(([v,n])=>`<button class="chipb" data-act="${act}" data-k="${v}" aria-pressed="${String(v)===c}">${n}</button>`).join('')}</div>`;
    h.insertAdjacentHTML('afterend',`<div class="pcdisp"><h5>Interface size</h5>${chips('uiscale',UI_SCALES,cur)}<div class="meta">Auto fits the window: 100% on a 1080p screen, bigger on 1440p and 4K. Now ${Math.round(UIZ*100)}%.</div>
      <h5>Picture quality</h5>${chips('renderq',RENDER_Q,q)}<div class="meta">Auto draws the water at 1.5× for sharp edges, Sharp at 2×; Balanced and Fast help older PCs keep a smooth frame rate.</div></div>`); }catch(e){ oops('pc/ui_display:pn.querySelectorAll',e); } return r; }; }
{ const _ea=extraAct7; extraAct7=function(b){ const a=b.dataset.act, k=b.dataset.k;
  if(a==='uiscale'){ const ok=UI_SCALES.some(([v])=>String(v)===k); if(!ok) return 'skip'; S.settings.uiScale=k==='auto'?'auto':+k; save(); uiApplyZoom(true); return 'render'; }
  if(a==='renderq'){ if(!RENDER_Q.some(([v])=>v===k)) return 'skip'; S.settings.renderQ=k; save(); try{ cv.width=0; resize(); }catch(e){ oops('pc/ui_display:resize#2',e); } return 'render'; }
  return _ea(b); }; }
if(typeof ACT_OK==='object'){ ACT_OK.uiscale=k=>UI_SCALES.some(([v])=>String(v)===String(k)); ACT_OK.renderq=k=>RENDER_Q.some(([v])=>v===k); }
try{ SEARCH_IDX.push(['Settings: interface size and picture quality','settings','Display','zoom scale size big monitor 1440p 4k resolution sharp quality ui text bigger smaller']); }catch(e){ oops('pc/ui_display:SEARCH_IDX.push',e); }
document.head.insertAdjacentHTML('beforeend','<style>#panel .pcdisp{margin:6px 0 10px}#panel .pcdisp .meta{margin-top:3px}</style>');
setTimeout(()=>uiApplyZoom(true),0);
/* PC Reborn (G #6, "PC feels like PC"): full screen PCs have power to spare, so rain rings and other moving detail are drawn 1.5x finer than on phones */
PLAT.detail=()=>1.5;
