
// =====================================================================
// 0.3: aquarium decorations you can drag to a new spot along the tank floor
// (positions are saved as a fraction across the tank).
// =====================================================================
function aqPositions(ds){ const pos=(S.aq.pos=S.aq.pos||{}), out={}; ds.forEach((id,i)=>{ out[id]=pos[id]!=null?clamp(pos[id],.03,.97):(i+.5)/Math.max(ds.length,1); }); return out; }

// aquarium: drag a decoration along the tank floor
function tankDragSetup(){ const c=$('tankcv'); if(!c||c.dataset.drag) return; c.dataset.drag='1'; c.style.touchAction='pan-y';
  let drag=null; const pt=e=>{ const r=c.getBoundingClientRect(); return {x:(e.clientX-r.left)/r.width, y:(e.clientY-r.top)/r.height}; };
  c.addEventListener('pointerdown',e=>{ const p=pt(e); if(p.y<.45) return; const ds=aqView().decor.filter(id=>id!=='duck'), P=aqPositions(ds); let best=null, bd=.07;
    for(const id in P){ const d=Math.abs(P[id]-p.x); if(d<bd){ bd=d; best=id; } } if(best){ drag=best; c.setPointerCapture(e.pointerId); c.style.cursor='grabbing'; e.preventDefault(); } });
  c.addEventListener('pointermove',e=>{ const p=pt(e); if(!drag){ c.style.cursor=p.y>.45?'grab':'default'; return; } S.aq.pos[drag]=clamp(p.x,.03,.97); });
  const end=()=>{ if(drag){ drag=null; c.style.cursor='grab'; save(); } }; c.addEventListener('pointerup',end); c.addEventListener('pointercancel',end); }

