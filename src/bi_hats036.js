// =====================================================================
// 0.3.6 classic hats rebuilt with real construction: brims seen almost edge on (top, underside and rim), crowns with
// volume and creases, bands with buckles and stitching, trims and embroidery. Same hat space as bg_angler036.js.
// =====================================================================
function hat036BrimFlat(c,col,cx,cy,rx,ry,o={}){ const dk=mix(col,'#000000',.42), lt=mix(col,'#ffffff',.2), up=o.up||0;
  // the underside first, then the lit top surface; up>0 curls both ends upward (cowboy, top hat, sombrero)
  c.fillStyle=dk; c.beginPath(); c.moveTo(cx-rx,cy-up); c.bezierCurveTo(cx-rx*.55,cy+ry*1.1,cx+rx*.55,cy+ry*1.1,cx+rx,cy-up); c.bezierCurveTo(cx+rx*.5,cy-ry*.5,cx-rx*.5,cy-ry*.5,cx-rx,cy-up); c.closePath(); c.fill();
  c.fillStyle=hat036Grad(c,cx-rx,cy-ry,cx+rx,cy+ry,[mix(col,'#000000',.15),col,lt]); c.beginPath(); c.moveTo(cx-rx,cy-up-ry*.35); c.bezierCurveTo(cx-rx*.55,cy+ry*.55,cx+rx*.55,cy+ry*.55,cx+rx,cy-up-ry*.35);
  c.bezierCurveTo(cx+rx*.5,cy-ry*1.25,cx-rx*.5,cy-ry*1.25,cx-rx,cy-up-ry*.35); c.closePath(); c.fill();
  // rounded ends: a brim is a thick rolled edge, never a spike
  for(const s of [-1,1]){ c.fillStyle=s<0?mix(col,'#000000',.12):col; c.beginPath(); c.ellipse(cx+s*(rx-ry*.32),cy-up-ry*.12,ry*.5,ry*.42,0,0,7); c.fill(); }
  c.strokeStyle=v3rgba(lt,.6); c.lineWidth=.28; c.beginPath(); c.moveTo(cx-rx*.92,cy-up-ry*.2); c.bezierCurveTo(cx-rx*.5,cy+ry*.45,cx+rx*.5,cy+ry*.45,cx+rx*.92,cy-up-ry*.2); c.stroke();
  if(o.stitch){ c.strokeStyle=v3rgba(o.stitch,.55); c.lineWidth=.22; c.setLineDash([.45,.4]); c.beginPath(); c.moveTo(cx-rx*.8,cy-up*.7); c.bezierCurveTo(cx-rx*.45,cy+ry*.3,cx+rx*.45,cy+ry*.3,cx+rx*.8,cy-up*.7); c.stroke(); c.setLineDash([]); } }
// a band around a crown, between two gentle curves at heights y0 (bottom) and y1 (top)
function hat036CrownBand(c,col,x0,x1,y0,y1){ c.fillStyle=hat036Grad(c,0,y1,0,y0,[mix(col,'#ffffff',.18),col,mix(col,'#000000',.22)]); c.beginPath(); c.moveTo(x0,y0); c.quadraticCurveTo((x0+x1)/2,y0+1,x1,y0-.1); c.lineTo(x1-.1,y1); c.quadraticCurveTo((x0+x1)/2,y1+1,x0+.1,y1); c.closePath(); c.fill();
  c.fillStyle='rgba(255,255,255,.18)'; c.beginPath(); c.moveTo(x0+.1,y1); c.quadraticCurveTo((x0+x1)/2,y1+1,x1-.1,y1); c.lineTo(x1-.1,y1+.45); c.quadraticCurveTo((x0+x1)/2,y1+1.45,x0+.1,y1+.45); c.closePath(); c.fill(); }
// a cone hat (witch, wizard) whose tip bends over, on a wide brim, with a band and a buckle or stars
function hat036Cone(c,col,o){ const dk=mix(col,'#000000',.38), lt=mix(col,'#ffffff',.2), tx=o.tip[0], ty=o.tip[1];
  hat036BrimFlat(c,col,.3,-2.4,13.4,2.1,{up:.6});
  const cone=()=>{ c.beginPath(); c.moveTo(-6.4,-3); c.quadraticCurveTo(-3.6,-8.6,-1.4,-12.4); c.quadraticCurveTo(-.6,-15.4,tx+3.2,ty+3.4); c.quadraticCurveTo(tx+.8,ty+1.2,tx,ty); c.quadraticCurveTo(tx+3.6,ty+.8,tx+5.4,ty+3.8); c.quadraticCurveTo(3.2,-13.2,4.6,-8.8); c.quadraticCurveTo(5.8,-5.6,6.8,-3); c.quadraticCurveTo(.2,-2,-6.4,-3); c.closePath(); };
  c.fillStyle=hat036Grad(c,-6.4,0,6.8,0,[dk,col,lt]); cone(); c.fill();
  c.save(); cone(); c.clip();
  c.strokeStyle=v3rgba(dk,.55); c.lineWidth=.35; c.beginPath(); c.moveTo(-.6,-13.2); c.quadraticCurveTo(1.4,-13.8,3,-12.8); c.moveTo(-1.6,-10.8); c.quadraticCurveTo(.6,-11.2,2.6,-10.4); c.stroke();
  c.fillStyle='rgba(255,255,255,.12)'; c.beginPath(); c.moveTo(2.6,-4); c.quadraticCurveTo(3.4,-9,1.6,-13.4); c.lineTo(2.4,-13.2); c.quadraticCurveTo(4.2,-9,3.6,-4); c.closePath(); c.fill();
  if(o.stars){ c.fillStyle='#f4e08a'; const star=(x,y,r)=>{ c.beginPath(); for(let i=0;i<10;i++){ const a=-Math.PI/2+i*Math.PI/5, rr=i%2?r*.42:r; c.lineTo(x+Math.cos(a)*rr,y+Math.sin(a)*rr); } c.closePath(); c.fill(); };
    star(-2.4,-6.6,1.1); star(2.6,-10,.8); star(.4,-8.8,.55); c.beginPath(); c.arc(3.6,-6.6,1.15,0,7); c.fill(); c.fillStyle=col; c.beginPath(); c.arc(4.1,-6.9,1,0,7); c.fill(); }
  c.restore();
  hat036CrownBand(c,o.band,-6.6,7,-3.1,-5.3);
  if(o.buckle){ c.strokeStyle='#e8c050'; c.lineWidth=.55; c.strokeRect(2.6,-5.1,2.2,2); c.fillStyle='#e8c050'; c.fillRect(3.5,-4.8,.4,1.4); } }
Object.assign(HAT036,{
  bowler(c,col){ const dk=mix(col,'#000000',.35), lt=mix(col,'#ffffff',.25);
    hat036BrimFlat(c,col,.3,-2.3,11.2,1.9,{up:.9});
    const dome=()=>{ c.beginPath(); c.moveTo(-7,-2.6); c.bezierCurveTo(-7.6,-9.6,-3.4,-11.6,.4,-11.5); c.bezierCurveTo(4.4,-11.4,8.2,-9.4,7.6,-2.6); c.quadraticCurveTo(.3,-1.6,-7,-2.6); c.closePath(); };
    c.fillStyle=hat036Grad(c,-7,-11,7,-2,[dk,col,lt]); dome(); c.fill();
    c.fillStyle='rgba(255,255,255,.16)'; c.beginPath(); c.ellipse(2.6,-8.6,3.4,1.6,-.45,0,7); c.fill();
    hat036CrownBand(c,mix(col,'#000000',.55),-7.3,7.7,-2.9,-4.6);
    c.fillStyle=mix(col,'#000000',.62); c.beginPath(); c.ellipse(-6.6,-3.8,1.1,.85,0,0,7); c.fill(); c.beginPath(); c.moveTo(-6.4,-3.4); c.lineTo(-7.8,-1.4); c.lineTo(-7,-1.2); c.closePath(); c.fill(); },
  cowboy(c,col){ const dk=mix(col,'#000000',.35), lt=mix(col,'#ffffff',.22), leather='#4a2c18';
    hat036BrimFlat(c,col,.4,-2.6,14.2,2.1,{up:2.6,stitch:lt});
    const crown=()=>{ c.beginPath(); c.moveTo(-6.6,-3); c.lineTo(-6.2,-9.4); c.quadraticCurveTo(-3.6,-11.6,-1.4,-10.2); c.quadraticCurveTo(-.2,-9.6,1.2,-10.4); c.quadraticCurveTo(4.4,-11.8,6.4,-9.2); c.lineTo(7,-3); c.quadraticCurveTo(.2,-2.1,-6.6,-3); c.closePath(); };
    c.fillStyle=hat036Grad(c,-7,-11,7,-3,[dk,col,lt]); crown(); c.fill();
    c.save(); crown(); c.clip(); c.strokeStyle=v3rgba(dk,.7); c.lineWidth=.5; c.beginPath(); c.moveTo(-.2,-9.8); c.quadraticCurveTo(.2,-7.4,.1,-5.6); c.stroke();
    c.fillStyle='rgba(0,0,0,.14)'; c.beginPath(); c.ellipse(-4.6,-8.2,1.2,2.4,.2,0,7); c.ellipse(4.4,-8.2,1.2,2.4,-.2,0,7); c.fill(); c.restore();
    hat036CrownBand(c,leather,-7,7.2,-3.4,-5.1);
    c.strokeStyle='rgba(230,200,150,.55)'; c.lineWidth=.2; c.setLineDash([.4,.35]); c.beginPath(); c.moveTo(-6.8,-4.3); c.quadraticCurveTo(.2,-3.3,7,-4.4); c.stroke(); c.setLineDash([]);
    c.fillStyle='#d8b860'; c.fillRect(4.6,-5.1,1.6,1.7); c.fillStyle=leather; c.fillRect(5,-4.7,.8,.9); },
  tophat(c,col){ const dk=mix(col,'#000000',.4), lt=mix(col,'#ffffff',.22);
    hat036BrimFlat(c,col,.3,-2.4,11.6,1.8,{up:1.3});
    const crown=()=>{ c.beginPath(); c.moveTo(-6,-2.9); c.quadraticCurveTo(-5.3,-8,-6.3,-14.6); c.lineTo(6.6,-14.6); c.quadraticCurveTo(5.6,-8,6.4,-2.9); c.quadraticCurveTo(.2,-2,-6,-2.9); c.closePath(); };
    c.fillStyle=hat036Grad(c,-6.4,0,6.6,0,[dk,col,lt,col]); crown(); c.fill();
    c.save(); crown(); c.clip(); c.fillStyle='rgba(255,255,255,.16)'; c.fillRect(2.4,-14.6,1.3,12); c.fillStyle='rgba(255,255,255,.08)'; c.fillRect(4,-14.6,.6,12); c.restore();
    hat036CrownBand(c,mix(col,'#000000',.55),-6.4,6.6,-3.1,-5.4);
    c.fillStyle=hat036Grad(c,-6,-15.4,6,-13.8,[lt,col]); c.beginPath(); c.ellipse(.15,-14.6,6.45,.95,0,0,7); c.fill(); },
  witch(c,col){ hat036Cone(c,col,{tip:[-6.8,-18.6],band:'#8a5ad8',buckle:1}); },
  wizard(c,col){ hat036Cone(c,col,{tip:[-4.6,-20],band:'#e8c050',stars:1}); },
  jester(c,col){ const c2=lum(col)>120?mix(col,'#1a2a6a',.7):mix(col,'#f0d040',.75), bell='#f2c84a';
    const lobe=(p,cl)=>{ c.fillStyle=hat036Grad(c,p[0],p[1],p[4],p[5],[mix(cl,'#000000',.25),cl,mix(cl,'#ffffff',.18)]); c.beginPath(); c.moveTo(p[0],p[1]); c.quadraticCurveTo(p[2],p[3],p[4],p[5]); c.quadraticCurveTo(p[6],p[7],p[8],p[9]); c.closePath(); c.fill(); };
    lobe([-7.6,-3.4,-12,-8,-13.6,-3.6,-9.6,-8.4,-2.6,-6.4],c2);
    lobe([5.2,-5.6,10.4,-9.4,12.6,-4.4,9.4,-10.6,1.4,-7.4],c2);
    lobe([-4.4,-5.4,-3.8,-14.4,1.6,-15.6,1.2,-11,4.6,-5.6],col);
    for(const [x,y] of [[-13.6,-3.6],[12.6,-4.4],[1.6,-15.6]]){ c.fillStyle=bell; c.beginPath(); c.arc(x,y,1.25,0,7); c.fill(); c.fillStyle='rgba(255,255,255,.65)'; c.beginPath(); c.arc(x-.35,y-.4,.4,0,7); c.fill(); c.fillStyle='#6a4a10'; c.fillRect(x-.5,y+.35,1,.3); }
    c.fillStyle=hat036Grad(c,0,-5.6,0,-.6,[mix(col,'#ffffff',.2),col]); c.beginPath(); c.moveTo(-8.4,-1); c.quadraticCurveTo(.2,0,8.6,-1.2); c.lineTo(8.3,-4.6); c.quadraticCurveTo(.2,-5.8,-8.2,-4.4); c.closePath(); c.fill();
    c.fillStyle=c2; for(let i=0;i<7;i++){ const x=-7+i*2.4; c.beginPath(); c.moveTo(x,-2.8); c.lineTo(x+1.2,-4.3); c.lineTo(x+2.4,-2.8); c.lineTo(x+1.2,-1.3); c.closePath(); c.fill(); } },
  fez(c,col){ const dk=mix(col,'#000000',.32), lt=mix(col,'#ffffff',.2);
    const body=()=>{ c.beginPath(); c.moveTo(-6.6,-1.2); c.lineTo(-5.2,-10.6); c.quadraticCurveTo(.4,-11.6,5.8,-10.4); c.lineTo(7,-1.4); c.quadraticCurveTo(.2,-.3,-6.6,-1.2); c.closePath(); };
    c.fillStyle=hat036Grad(c,-6.6,0,7,0,[dk,col,lt,col]); body(); c.fill();
    c.save(); body(); c.clip(); c.strokeStyle=v3rgba(dk,.3); c.lineWidth=.25; for(let x=-5;x<7;x+=1.6){ c.beginPath(); c.moveTo(x,-11); c.lineTo(x*1.12,-.8); c.stroke(); } c.restore();
    c.fillStyle=hat036Grad(c,-5,-11.6,5,-10,[lt,col]); c.beginPath(); c.ellipse(.3,-10.5,5.5,.9,0,0,7); c.fill();
    c.strokeStyle='#1a1410'; c.lineWidth=.45; c.beginPath(); c.moveTo(.3,-10.7); c.quadraticCurveTo(-3.4,-11.4,-5.6,-8.2); c.lineTo(-6.2,-5.4); c.stroke();
    c.fillStyle='#1a1410'; c.beginPath(); c.moveTo(-6.9,-5.6); c.lineTo(-5.5,-5.6); c.lineTo(-5,-1.8); c.lineTo(-7.6,-1.8); c.closePath(); c.fill();
    c.strokeStyle='#3a3028'; c.lineWidth=.18; for(let i=0;i<5;i++){ c.beginPath(); c.moveTo(-7.2+i*.55,-5.2); c.lineTo(-7.5+i*.6,-1.9); c.stroke(); } c.fillStyle='#c8a040'; c.beginPath(); c.ellipse(-6.2,-5.6,.75,.4,0,0,7); c.fill(); },
  sombrero(c,col){ const dk=mix(col,'#000000',.35), lt=mix(col,'#ffffff',.25), red='#c83a2a', grn='#2a8a4a';
    hat036BrimFlat(c,col,.4,-2.8,16,2.4,{up:2.2});
    c.strokeStyle=red; c.lineWidth=.55; c.beginPath(); c.moveTo(-15.2,-4.6); c.bezierCurveTo(-8,-1.2,8.8,-1.2,15.8,-4.6); c.stroke(); c.strokeStyle=grn; c.lineWidth=.35; c.beginPath(); c.moveTo(-14.6,-4.1); c.bezierCurveTo(-8,-.8,8.8,-.8,15.2,-4.1); c.stroke();
    const crown=()=>{ c.beginPath(); c.moveTo(-6,-3.2); c.bezierCurveTo(-6.6,-10.6,-3.4,-14.4,.4,-14.4); c.bezierCurveTo(4.2,-14.4,7.4,-10.6,6.8,-3.2); c.quadraticCurveTo(.4,-2.4,-6,-3.2); c.closePath(); };
    c.fillStyle=hat036Grad(c,-6.6,-14,6.8,-3,[dk,col,lt]); crown(); c.fill();
    c.save(); crown(); c.clip(); c.fillStyle='#ffffff'; for(let i=0;i<6;i++){ c.beginPath(); c.arc(-5.2+i*2.2,-9.6+Math.sin(i)*.4,.3,0,7); c.fill(); } c.restore();
    hat036CrownBand(c,red,-6.6,7.2,-4,-6.6);
    c.strokeStyle='#f4d24a'; c.lineWidth=.4; c.beginPath(); for(let i=0;i<=12;i++){ const x=-6.2+i*1.1, y=-5.2+(i%2?-.7:.6); i?c.lineTo(x,y):c.moveTo(x,y); } c.stroke();
    c.fillStyle='rgba(255,255,255,.14)'; c.beginPath(); c.ellipse(2.4,-11.4,2.6,1.2,-.5,0,7); c.fill(); },
});
