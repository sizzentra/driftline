
// =====================================================================
// 0.3 Home: dock decorations sized to the angler, and decorations you can drag to a new spot
// (on the dock in the Home tab, and in the aquarium tank). Positions are saved as a fraction across the dock/tank.
// =====================================================================
// target height of each decoration in angler units (the angler stands about 70 tall)
const DOCK_H={mug:7,books:9,tacklebox:10,plants:22,gnome:17,lantern:20,bunting:64,blanket:6,umbrella:76,chair:42,windchime:60,birdhouse:60,catbed:12,lights:64,radio:11,campfire:22,telescope:46,tideflag:80,shipwheel:46,minilight:58};
const DOCK_NAT={};
function dockNative(id){ if(DOCK_NAT[id]) return DOCK_NAT[id]; let v={h:40};
  try{ const o=document.createElement('canvas'); o.width=420; o.height=420; const x=o.getContext('2d'); drawDockItem(x,id,210,320,1,0,0); const d=x.getImageData(0,0,420,420).data; let top=420,bot=0;
    for(let y=0;y<420;y++) for(let X=0;X<420;X+=2) if(d[(y*420+X)*4+3]>24){ if(y<top) top=y; if(y>bot) bot=y; }
    if(bot>top) v={h:bot-top}; }catch(e){}
  return DOCK_NAT[id]=v; }
function dockItemScale(id){ return DOCK_H[id] ? DOCK_H[id]/dockNative(id).h : 1.35; }
// positions: saved fraction, else the even spread that keeps clear of the angler
function dockPositions(items,avoidA,avoidB){ const pos=(S.dock.pos=S.dock.pos||{}), free=items.filter(id=>id!=='cottage'), def=homeSlots(free.length,0,1,avoidA,avoidB);
  const out={}; free.forEach((id,i)=>{ out[id]=pos[id]!=null?clamp(pos[id],0,1):def[i]; }); return out; }
function aqPositions(ds){ const pos=(S.aq.pos=S.aq.pos||{}), out={}; ds.forEach((id,i)=>{ out[id]=pos[id]!=null?clamp(pos[id],.03,.97):(i+.5)/Math.max(ds.length,1); }); return out; }

// Home tab: drag a decoration along the dock
const HOME_X0=.06, HOME_X1=.9;
function homeDragSetup(){ const c=$('homecv'); if(!c||c.dataset.drag) return; c.dataset.drag='1'; c.style.cursor='grab'; c.style.touchAction='pan-y';
  let drag=null; const toX=e=>{ const r=c.getBoundingClientRect(); return (e.clientX-r.left)*(c.width/r.width); };
  c.addEventListener('pointerdown',e=>{ const x=toX(e), w=c.width, items=dockView(), P=dockPositions(items,(.46-HOME_X0)/(HOME_X1-HOME_X0),(.64-HOME_X0)/(HOME_X1-HOME_X0)); let best=null, bd=w*.06;
    for(const id in P){ const px=w*(HOME_X0+P[id]*(HOME_X1-HOME_X0)), d=Math.abs(px-x); if(d<bd){ bd=d; best=id; } }
    if(best){ drag=best; c.setPointerCapture(e.pointerId); c.style.cursor='grabbing'; e.preventDefault(); } });
  c.addEventListener('pointermove',e=>{ if(!drag) return; const w=c.width; S.dock.pos[drag]=clamp((toX(e)/w-HOME_X0)/(HOME_X1-HOME_X0),0,1); paintHome(); });
  const end=()=>{ if(drag){ drag=null; c.style.cursor='grab'; save(); } }; c.addEventListener('pointerup',end); c.addEventListener('pointercancel',end); }

// aquarium: drag a decoration along the tank floor
function tankDragSetup(){ const c=$('tankcv'); if(!c||c.dataset.drag) return; c.dataset.drag='1'; c.style.touchAction='pan-y';
  let drag=null; const pt=e=>{ const r=c.getBoundingClientRect(); return {x:(e.clientX-r.left)/r.width, y:(e.clientY-r.top)/r.height}; };
  c.addEventListener('pointerdown',e=>{ const p=pt(e); if(p.y<.45) return; const ds=aqView().decor.filter(id=>id!=='duck'), P=aqPositions(ds); let best=null, bd=.07;
    for(const id in P){ const d=Math.abs(P[id]-p.x); if(d<bd){ bd=d; best=id; } } if(best){ drag=best; c.setPointerCapture(e.pointerId); c.style.cursor='grabbing'; e.preventDefault(); } });
  c.addEventListener('pointermove',e=>{ const p=pt(e); if(!drag){ c.style.cursor=p.y>.45?'grab':'default'; return; } S.aq.pos[drag]=clamp(p.x,.03,.97); });
  const end=()=>{ if(drag){ drag=null; c.style.cursor='grab'; save(); } }; c.addEventListener('pointerup',end); c.addEventListener('pointercancel',end); }
if(/[?&]test\b/.test(location.search)) window.__dockSizes=()=>Object.keys(DOCK_H).map(id=>[id,dockNative(id).h,+dockItemScale(id).toFixed(2)]);
