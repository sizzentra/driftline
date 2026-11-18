// PC: the Dock preview was always drawn as a 900x360 picture and stretched across the wide full-screen card, so it looked soft.
// It now draws at the card's real size on screen (screen scaling included), with the same layout: the drawing still works in
// 900x360 units and is scaled up, so nothing moves. Dragging decorations keeps working (it reads the canvas size).
{ const _ph3=paintHome3;
  paintHome3=function(c){ if(!c||c.id!=='homecv') return _ph3(c); if(!document.body.classList.contains('pch-on')){ if(c.dataset.lw&&c.width!==+c.dataset.lw){ c.width=+c.dataset.lw; c.height=+c.dataset.lh; } return _ph3(c); }
    const lw=+c.dataset.lw||c.width, lh=+c.dataset.lh||c.height; c.dataset.lw=lw; c.dataset.lh=lh;
    const r=c.getBoundingClientRect(); if(!r.width) return _ph3(c);
    const k=Math.max(1,Math.min(3,r.width*Math.min(2,window.devicePixelRatio||1)/lw)), cw=Math.round(lw*k), ch=Math.round(lh*k);
    if(c.width!==cw||c.height!==ch){ c.width=cw; c.height=ch; }
    const x=c.getContext('2d'); const view={width:lw,height:lh,getContext:()=>{ x.setTransform(k,0,0,k,0,0); return x; }};
    try{ return _ph3(view); } finally{ x.setTransform(1,0,0,1,0,0); } }; }
