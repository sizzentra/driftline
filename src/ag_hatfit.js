
// =====================================================================
// 0.3 hat fit, part 2: head toppers follow the curve of the head so they look worn, not pasted on.
// Hat units: origin near the eye line, the head is a dome around (0,-0.6); short hair reaches about
// r=8.2, a bald head about r=6.4. Bases sit at r~6.8 so they rest on every hairstyle and on a bald head.
// =====================================================================
(function(){
  const CX=0, CY=0.7, P=(r,a)=>[CX+Math.cos(a)*r, CY+Math.sin(a)*r];
  const arcBand=(c,r0,r1,a0,a1,fill)=>{ c.fillStyle=fill; c.beginPath(); c.arc(CX,CY,r1,a0,a1); c.arc(CX,CY,r0,a1,a0,true); c.closePath(); c.fill(); };
  const FIT={
    tiara(c,col,t){ const sil=c.createLinearGradient(0,-12,0,-6); sil.addColorStop(0,'#ffffff'); sil.addColorStop(1,'#b8c4d8');
      arcBand(c,6.6,7.7,-2.35,-0.85,sil);
      const peaks=[[-2.12,2.0],[-1.84,2.6],[-1.57,3.4],[-1.3,2.6],[-1.04,2.0]];
      c.fillStyle=sil; for(const [a,h] of peaks){ const [bx,by]=P(7.5,a), [lx,ly]=P(7.5,a-.11), [rx,ry]=P(7.5,a+.11), [tx,ty]=P(7.5+h,a); c.beginPath(); c.moveTo(lx,ly); c.lineTo(tx,ty); c.lineTo(rx,ry); c.closePath(); c.fill(); }
      c.strokeStyle='rgba(120,130,160,.45)'; c.lineWidth=.25; c.beginPath(); c.arc(CX,CY,7.7,-2.35,-0.85); c.stroke();
      const gem=(a,r,cl,s)=>{ const [x,y]=P(r,a); c.fillStyle=cl; c.beginPath(); c.arc(x,y,s,0,7); c.fill(); c.fillStyle='rgba(255,255,255,.7)'; c.beginPath(); c.arc(x-s*.3,y-s*.3,s*.35,0,7); c.fill(); };
      gem(-1.57,9.4,'#e8484a',.95); gem(-1.84,8.6,'#7ac8f0',.6); gem(-1.3,8.6,'#7ac8f0',.6); gem(-1.57,7.15,'#7ac8f0',.4); },
    bunnyears(c,col,t){ const band='#d8604a';
      for(const [a,tilt] of [[-1.9,-.32],[-1.42,.18]]){ const [bx,by]=P(7.2,a); c.save(); c.translate(bx,by); c.rotate(a+Math.PI/2+tilt+Math.sin(t*1.6+a)*.04);
        c.fillStyle='#f4f0ec'; c.beginPath(); c.ellipse(0,-4.6,1.55,4.8,0,0,7); c.fill(); c.fillStyle='#f4a8bc'; c.beginPath(); c.ellipse(0,-4.4,.8,3.7,0,0,7); c.fill(); c.restore(); }
      arcBand(c,6.7,7.8,-2.75,-0.5,band); c.fillStyle='rgba(255,255,255,.25)'; c.beginPath(); c.arc(CX,CY,7.6,-2.4,-1.2); c.arc(CX,CY,7.35,-1.2,-2.4,true); c.fill(); },
    flower(c,col,t){ c.strokeStyle='#4a8a3a'; c.lineWidth=.9; c.beginPath(); c.arc(CX,CY,7.3,-2.8,-0.4); c.stroke();
      const leaf=(a)=>{ const [x,y]=P(7.6,a); c.fillStyle='#5aa04a'; c.beginPath(); c.ellipse(x,y,1.3,.55,a+1.2,0,7); c.fill(); }; for(const a of [-2.55,-2.0,-1.45,-0.9,-0.55]) leaf(a);
      const fl=[[-2.62,'#ffffff',1.05],[-2.25,'#ffd84a',1.2],[-1.88,'#ff8ab8',1.3],[-1.5,'#9ad0ff',1.35],[-1.12,'#ffffff',1.3],[-0.75,'#ffd84a',1.2],[-0.45,'#ff8ab8',1.05]];
      for(const [a,cl,s] of fl){ const [x,y]=P(7.6,a); c.fillStyle=cl; for(let k=0;k<5;k++){ const pa=k*Math.PI*2/5+a; c.beginPath(); c.arc(x+Math.cos(pa)*s*.62,y+Math.sin(pa)*s*.62,s*.5,0,7); c.fill(); } c.fillStyle='#f0a020'; c.beginPath(); c.arc(x,y,s*.38,0,7); c.fill(); } },
    mohawk(c,col,t){ const dk=mix(col,'#000000',.35), lt=mix(col,'#ffffff',.18);
      const n=8; for(let i=0;i<n;i++){ const a=-2.5+i*(1.6/(n-1)), mid=1-Math.abs(i-(n-1)/2)/((n-1)/2), h=3.4+2.6*mid;
        const [lx,ly]=P(6.5,a-.1), [rx,ry]=P(6.5,a+.1), [tx,ty]=P(6.5+h,a+.06); const g=c.createLinearGradient(lx,ly,tx,ty); g.addColorStop(0,dk); g.addColorStop(1,lt); c.fillStyle=g; c.beginPath(); c.moveTo(lx,ly); c.quadraticCurveTo((lx+tx)/2-.3,(ly+ty)/2,tx,ty); c.lineTo(rx,ry); c.closePath(); c.fill(); }
      arcBand(c,6.2,7.0,-2.6,-0.85,dk); },
    // side view: one cup over the ear, the band rises from it over the crown (the far half is behind the head)
    headphones(c,col,t){ const dk=mix(col,'#000000',.35), lt=mix(col,'#ffffff',.25), EX=-2.75, EY=2.1;
      c.strokeStyle=dk; c.lineWidth=1.9; c.beginPath(); c.moveTo(EX+.15,EY-2.6); c.bezierCurveTo(EX-.6,-3.2,-2.6,-5.3,-1.3,-6.25); c.stroke();
      c.strokeStyle=lt; c.lineWidth=.5; c.beginPath(); c.moveTo(EX-.3,EY-3); c.bezierCurveTo(EX-1,-3.4,-3,-5.3,-1.75,-6.1); c.stroke();
      c.fillStyle=dk; c.beginPath(); c.ellipse(EX,EY,2.7,3.3,-.1,0,7); c.fill();
      const g=c.createLinearGradient(EX-2,EY-3,EX+2,EY+3); g.addColorStop(0,lt); g.addColorStop(1,col); c.fillStyle=g; c.beginPath(); c.ellipse(EX-.35,EY,2.15,2.8,-.1,0,7); c.fill();
      c.fillStyle='rgba(255,255,255,.3)'; c.beginPath(); c.ellipse(EX-1,EY-1.2,.7,1,-.3,0,7); c.fill(); },
    // side view: the far horn peeks out behind the helmet, the near horn grows from the side of the helmet
    viking(c,col,t){ const horn=(x0,y0,x1,y1,cx,cy,w,cl)=>{ c.fillStyle=cl; c.beginPath(); c.moveTo(x0-w,y0); c.quadraticCurveTo(cx-w*.6,cy,x1,y1); c.quadraticCurveTo(cx+w*.6,cy+.6,x0+w,y0); c.closePath(); c.fill(); };
      horn(-2.2,-8,-4.4,-15.6,-4.6,-11.5,1.4,'#c8bca0');
      c.fillStyle=col; c.beginPath(); c.arc(0,-2,8.4,Math.PI,0); c.closePath(); c.fill(); c.fillStyle='rgba(255,255,255,.18)'; c.beginPath(); c.ellipse(2.5,-7,3,1.6,-.4,0,7); c.fill();
      c.fillStyle='#7a5a3a'; c.fillRect(-8.6,-3.6,17.2,2.6); c.fillStyle='#d8b060'; for(const x of [-6,-2,2,6]){ c.beginPath(); c.arc(x,-2.3,.45,0,7); c.fill(); }
      horn(-1.2,-4.6,4.2,-15,-4.6,-12.5,1.9,'#f0e8d0'); c.fillStyle='#7a5a3a'; c.beginPath(); c.ellipse(-1.2,-4.5,2.3,1.1,0,0,7); c.fill(); },
  };
  const _drawHat_fit = drawHat;
  // brims that would reach down over the eye curve up at the front instead (the hat stays on the head)
  const TRIM={pirate:-1.5,sombrero:-1.5,mushroom:-1.4,bucket:-1.5};
  const _drawHat_trim = function(c,id,col,t){ const ty=TRIM[id]; if(ty===undefined) return false; c.save(); c.beginPath(); c.rect(-40,-60,80,80);
    c.moveTo(1.4,20); c.lineTo(1.4,ty+.6); c.quadraticCurveTo(1.6,ty,3.2,ty-.15); c.quadraticCurveTo(8,ty-.5,30,ty-1.6); c.lineTo(30,20); c.closePath(); c.clip('evenodd'); _drawHat_fit(c,id,col,t); c.restore(); return true; };
  drawHat = function(c,id,col,t=0){ if(_drawHat_trim(c,id,col,t)) return; const seat={fishhat:3.2,duckonhead:2.8}[id]; if(seat){ c.save(); c.translate(0,seat); _drawHat_fit(c,id,col,t); c.restore(); return; } const f=FIT[id]; if(f){ c.save(); c.lineCap='round'; c.lineJoin='round'; f(c,col,t); c.restore(); return; } return _drawHat_fit(c,id,col,t); };
  // these rest on the hair, so the hair under them is never trimmed flat
  for(const id of ['fishhat','duckonhead','mohawk']) A3_HAT_OPEN.add(id);
})();
