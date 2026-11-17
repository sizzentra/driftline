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
  party(c,col){ const dk=mix(col,'#000000',.32), lt=mix(col,'#ffffff',.25), c2=lum(col)>140?'#3a7ad8':'#f2c84a';
    const cone=()=>{ c.beginPath(); c.moveTo(-6,-3.4); c.quadraticCurveTo(-1.6,-12,1.4,-21.4); c.quadraticCurveTo(3.6,-12,7,-3.4); c.quadraticCurveTo(.5,-2.2,-6,-3.4); c.closePath(); };
    c.fillStyle=hat036Grad(c,-6,0,7,0,[dk,col,lt,col]); cone(); c.fill();
    c.save(); cone(); c.clip(); c.fillStyle=c2; for(let i=0;i<4;i++){ const y=-5.4-i*4.2; c.beginPath(); c.moveTo(-8,y+1.6); c.quadraticCurveTo(.5,y+2.6,9,y+1.4); c.lineTo(9,y); c.quadraticCurveTo(.5,y+1.2,-8,y); c.closePath(); c.fill(); }
      c.fillStyle='#ffffff'; for(const [x,y] of [[-2.4,-8],[3.4,-11.6],[.6,-15.6],[4.2,-6.4]]){ c.beginPath(); c.arc(x,y,.42,0,7); c.fill(); } c.restore();
    c.strokeStyle='rgba(255,255,255,.75)'; c.lineWidth=.3; c.beginPath(); c.moveTo(-5.4,-3.2); c.quadraticCurveTo(-2,4.6,1.6,7.2); c.stroke();
    c.fillStyle='#f4f0ea'; for(let i=0;i<9;i++){ const a=i/9*Math.PI*2; c.beginPath(); c.arc(1.4+Math.cos(a)*1.1,-21.8+Math.sin(a)*1.1,.95,0,7); c.fill(); } c.fillStyle='#ffffff'; c.beginPath(); c.arc(1,-22.3,.7,0,7); c.fill();
    c.fillStyle=hat036Grad(c,0,-4.4,0,-2.4,['#f4f0ea','#d8d2ca']); c.beginPath(); c.moveTo(-6.6,-2.6); c.quadraticCurveTo(.5,-1.4,7.6,-2.7); c.lineTo(7.2,-4.2); c.quadraticCurveTo(.5,-3,-6.3,-4.1); c.closePath(); c.fill(); },
  gnomehat(c,col){ const dk=mix(col,'#000000',.35), lt=mix(col,'#ffffff',.2);
    const cone=()=>{ c.beginPath(); c.moveTo(-7.6,-2.8); c.quadraticCurveTo(-6,-12,-1,-19.4); c.quadraticCurveTo(1.2,-22.4,4.2,-21.8); c.quadraticCurveTo(2.6,-20.4,2.8,-17.6); c.quadraticCurveTo(5.6,-10.6,8.4,-2.8); c.quadraticCurveTo(.4,-1.4,-7.6,-2.8); c.closePath(); };
    c.fillStyle=hat036Grad(c,-7.6,0,8.4,0,[dk,col,lt]); cone(); c.fill();
    c.save(); cone(); c.clip(); c.strokeStyle=v3rgba(dk,.5); c.lineWidth=.4; c.beginPath(); c.moveTo(-3.2,-12.6); c.quadraticCurveTo(-.4,-11.6,2.6,-13); c.moveTo(-4.8,-8.2); c.quadraticCurveTo(-.4,-7,4.2,-8.6); c.stroke();
      c.fillStyle='rgba(255,255,255,.12)'; c.beginPath(); c.moveTo(3.4,-3.4); c.quadraticCurveTo(4.4,-10,1.6,-17.4); c.lineTo(2.6,-17); c.quadraticCurveTo(5.4,-10,4.8,-3.4); c.closePath(); c.fill(); c.restore();
    c.fillStyle=hat036Grad(c,0,-4.8,0,-1.4,[mix(col,'#000000',.1),dk]); c.beginPath(); c.moveTo(-8,-1.6); c.quadraticCurveTo(.4,-.2,8.8,-1.7); c.lineTo(8.5,-3.7); c.quadraticCurveTo(.4,-2.4,-7.8,-3.6); c.closePath(); c.fill(); },
  sailor(c,col){ const blue='#24365e', w1='#ffffff', w2='#d6dbe2';
    const top=()=>{ c.beginPath(); c.moveTo(-8.4,-2.4); c.quadraticCurveTo(-9.2,-7.8,-5.6,-9.4); c.quadraticCurveTo(.4,-11,6.4,-9.4); c.quadraticCurveTo(9.6,-8,8.8,-2.4); c.quadraticCurveTo(.2,-1.2,-8.4,-2.4); c.closePath(); };
    c.fillStyle=hat036Grad(c,-8,-10,8,-2,[w2,w1,w1,w2]); top(); c.fill();
    c.save(); top(); c.clip(); c.strokeStyle='rgba(120,130,150,.4)'; c.lineWidth=.3; for(const x of [-4.6,-.8,3,6.4]){ c.beginPath(); c.moveTo(x,-10.4); c.quadraticCurveTo(x+.4,-6,x+.2,-2.2); c.stroke(); } c.restore();
    c.fillStyle=hat036Grad(c,0,-5.6,0,-1.2,['#33497a',blue]); c.beginPath(); c.moveTo(-8.9,-1.2); c.quadraticCurveTo(.2,.1,9.3,-1.3); c.lineTo(9,-4.6); c.quadraticCurveTo(.2,-3.4,-8.6,-4.5); c.closePath(); c.fill();
    c.fillStyle='rgba(255,255,255,.2)'; c.fillRect(-8.6,-4.5,17.6,.5);
    c.fillStyle=blue; c.beginPath(); c.moveTo(-8.6,-2.6); c.quadraticCurveTo(-10.4,1.4,-11.6,5); c.lineTo(-10.6,5.4); c.quadraticCurveTo(-9.6,2.4,-8,-1.4); c.closePath(); c.fill();
    c.beginPath(); c.moveTo(-8.2,-2.2); c.quadraticCurveTo(-9,2,-9.4,5.6); c.lineTo(-8.5,5.7); c.quadraticCurveTo(-8,2.6,-7.4,-1.6); c.closePath(); c.fill(); },
  bandanahead(c,col){ const dk=mix(col,'#000000',.3), lt=mix(col,'#ffffff',.3);
    const cap=()=>{ c.beginPath(); c.moveTo(-8.3,-1.2); c.bezierCurveTo(-8.8,-7.6,-4.2,-10.4,.2,-10.3); c.bezierCurveTo(4.8,-10.2,8.8,-7.6,8.5,-1.6); c.quadraticCurveTo(.2,-.4,-8.3,-1.2); c.closePath(); };
    c.fillStyle=hat036Grad(c,-8,-10,8,-1,[dk,col,lt]); cap(); c.fill();
    c.save(); cap(); c.clip(); c.fillStyle=v3rgba('#ffffff',.85); for(let r=0;r<4;r++) for(let k=0;k<6;k++){ const x=-7+k*2.9+(r%2)*1.45, y=-8.6+r*2.1; c.beginPath(); c.arc(x,y,.45,0,7); c.fill(); }
      c.strokeStyle=v3rgba('#ffffff',.6); c.lineWidth=.25; c.beginPath(); c.moveTo(-7.6,-2.4); c.quadraticCurveTo(.2,-1.4,7.8,-2.6); c.stroke();
      c.strokeStyle=v3rgba(dk,.55); c.lineWidth=.4; c.beginPath(); c.moveTo(-4,-9.4); c.quadraticCurveTo(-5.4,-6,-5.8,-2); c.moveTo(2.6,-9.8); c.quadraticCurveTo(3.4,-6,3.2,-1.6); c.stroke(); c.restore();
    c.fillStyle=dk; c.beginPath(); c.ellipse(-8,-2.6,1.4,1.2,0,0,7); c.fill();
    c.fillStyle=col; c.beginPath(); c.moveTo(-8.2,-3.2); c.quadraticCurveTo(-11,-3.6,-12.4,-1.4); c.lineTo(-11.2,-.8); c.quadraticCurveTo(-10.2,-2.2,-8.2,-2); c.closePath(); c.fill();
    c.fillStyle=dk; c.beginPath(); c.moveTo(-8.3,-2.4); c.quadraticCurveTo(-10.6,-1,-11.4,1.6); c.lineTo(-10.4,1.8); c.quadraticCurveTo(-9.6,-.2,-8,-1.6); c.closePath(); c.fill(); },
  strawsun(c,col){ const s1='#e8cc88', s2='#c9a85e', s3='#a8884a';
    hat036BrimFlat(c,s1,.3,-2.8,15.4,2.6,{up:-.8});
    c.save(); c.beginPath(); c.ellipse(.3,-3.1,15.4,2.7,0,0,7); c.clip(); c.strokeStyle='rgba(140,104,40,.35)'; c.lineWidth=.22; for(const k of [.5,.7,.86]){ c.beginPath(); c.ellipse(.3,-3.1,15.4*k,2.7*k,0,0,7); c.stroke(); } c.restore();
    const dome=()=>{ c.beginPath(); c.moveTo(-6.6,-3.4); c.bezierCurveTo(-7,-9.4,-3.4,-11.4,.3,-11.3); c.bezierCurveTo(4,-11.2,7.6,-9.4,7.2,-3.4); c.quadraticCurveTo(.3,-2.6,-6.6,-3.4); c.closePath(); };
    c.fillStyle=hat036Grad(c,-6.6,0,7.2,0,[s2,s1,'#f2dc9e']); dome(); c.fill();
    c.save(); dome(); c.clip(); c.strokeStyle='rgba(140,104,40,.28)'; c.lineWidth=.25; for(let y=-11;y<-3;y+=.9){ c.beginPath(); c.moveTo(-8,y); c.lineTo(8,y+.2); c.stroke(); } c.restore();
    hat036CrownBand(c,col,-6.8,7.4,-3.5,-5.4);
    const fl='#f4a0c0'; for(let i=0;i<5;i++){ const a=i/5*Math.PI*2; c.fillStyle=fl; c.beginPath(); c.ellipse(-5.4+Math.cos(a)*.9,-4.6+Math.sin(a)*.9,.75,.55,a,0,7); c.fill(); } c.fillStyle='#f4d24a'; c.beginPath(); c.arc(-5.4,-4.6,.5,0,7); c.fill();
    c.fillStyle='#5a9a4a'; c.beginPath(); c.ellipse(-3.6,-4.2,1.1,.45,-.3,0,7); c.fill(); },
  hardhat(c,col){ const dk=mix(col,'#000000',.32), lt=mix(col,'#ffffff',.3);
    hat036BrimFlat(c,col,.6,-2.4,10.6,1.5,{up:-.2});
    c.fillStyle=col; c.beginPath(); c.moveTo(7,-2.8); c.quadraticCurveTo(11,-3.2,12.6,-2); c.quadraticCurveTo(11,-1.4,7,-1.6); c.closePath(); c.fill();
    const dome=()=>{ c.beginPath(); c.moveTo(-8,-2.4); c.bezierCurveTo(-8.6,-9.4,-4,-12,.4,-11.9); c.bezierCurveTo(4.8,-11.8,9.2,-9.4,8.6,-2.4); c.quadraticCurveTo(.4,-1.4,-8,-2.4); c.closePath(); };
    c.fillStyle=hat036Grad(c,-8,-12,8,-2,[dk,col,lt]); dome(); c.fill();
    c.save(); dome(); c.clip(); c.fillStyle=hat036Grad(c,-1,0,2,0,[mix(col,'#000000',.15),lt,mix(col,'#000000',.1)]); c.beginPath(); c.moveTo(-1.2,-12); c.quadraticCurveTo(-1.6,-7,-1.6,-2); c.lineTo(1.8,-2); c.quadraticCurveTo(1.8,-7,1.4,-12); c.closePath(); c.fill();
      c.strokeStyle=v3rgba(dk,.4); c.lineWidth=.3; c.beginPath(); c.moveTo(-5.6,-10); c.quadraticCurveTo(-6.6,-6,-6.4,-2.4); c.moveTo(5.4,-10.2); c.quadraticCurveTo(6.6,-6,6.6,-2.4); c.stroke();
      c.fillStyle='rgba(255,255,255,.22)'; c.beginPath(); c.ellipse(3.4,-8.6,2.6,1.2,-.5,0,7); c.fill(); c.restore();
    c.fillStyle='#2a2a30'; c.beginPath(); c.ellipse(4.6,-5.2,1.1,.8,0,0,7); c.fill(); c.fillStyle='#e8e8f0'; c.beginPath(); c.ellipse(4.5,-5.3,.55,.38,0,0,7); c.fill(); },
  beret(c,col){ const dk=mix(col,'#000000',.32), lt=mix(col,'#ffffff',.22);
    const body=()=>{ c.beginPath(); c.moveTo(-7.4,-2.6); c.bezierCurveTo(-11.6,-4,-11,-9.6,-4.6,-10.4); c.bezierCurveTo(2,-11.2,9.2,-10,10.2,-7.2); c.bezierCurveTo(10.8,-5,8.8,-3.4,7.6,-3); c.quadraticCurveTo(.2,-2,-7.4,-2.6); c.closePath(); };
    c.fillStyle=hat036Grad(c,-10,-10,10,-3,[dk,col,lt]); body(); c.fill();
    c.save(); body(); c.clip(); c.fillStyle='rgba(0,0,0,.18)'; c.beginPath(); c.ellipse(-2,-3.2,9,1.6,0,0,7); c.fill();
      c.fillStyle='rgba(255,255,255,.14)'; c.beginPath(); c.ellipse(2.4,-8.8,5.4,1.4,-.08,0,7); c.fill();
      c.strokeStyle=v3rgba(dk,.35); c.lineWidth=.3; c.beginPath(); c.moveTo(-8,-6); c.quadraticCurveTo(-2,-7.4,6,-6.4); c.stroke(); c.restore();
    c.fillStyle=hat036Grad(c,0,-3.8,0,-1.8,[dk,mix(col,'#000000',.5)]); c.beginPath(); c.moveTo(-7.4,-1.8); c.quadraticCurveTo(.2,-.8,7.8,-2); c.lineTo(7.6,-3.3); c.quadraticCurveTo(.2,-2.2,-7.2,-3.1); c.closePath(); c.fill();
    c.fillStyle=dk; c.beginPath(); c.moveTo(-.4,-10.8); c.quadraticCurveTo(-.2,-12.4,.6,-12.6); c.lineTo(.9,-12.2); c.quadraticCurveTo(.3,-12,.4,-10.8); c.closePath(); c.fill(); },
  crown(c,col){ const g1='#f6d55a', g2='#c8962a', g3='#8a5a14';
    const band=()=>{ c.beginPath(); c.moveTo(-7.4,-1.6); c.quadraticCurveTo(.4,-.4,8,-1.8); c.lineTo(8.4,-5); c.lineTo(5.6,-4.2); c.lineTo(4.2,-11.4); c.lineTo(2,-5.2); c.lineTo(.4,-12.8); c.lineTo(-1.4,-5.2); c.lineTo(-3.4,-11.2); c.lineTo(-4.8,-4.4); c.lineTo(-7.8,-5.2); c.closePath(); };
    c.fillStyle=hat036Grad(c,-7.8,0,8.4,0,[g3,g2,g1,'#fff0b0',g2]); band(); c.fill();
    c.save(); band(); c.clip(); c.fillStyle=hat036Grad(c,0,-5,0,-1,['rgba(255,255,255,.25)','rgba(0,0,0,.2)']); c.beginPath(); c.moveTo(-8,-1.2); c.quadraticCurveTo(.4,0,8.6,-1.4); c.lineTo(8.6,-4.4); c.quadraticCurveTo(.4,-3.2,-8,-4.2); c.closePath(); c.fill();
      c.strokeStyle='rgba(90,56,10,.55)'; c.lineWidth=.3; c.beginPath(); c.moveTo(-8,-4.2); c.quadraticCurveTo(.4,-3.2,8.6,-4.4); c.stroke(); c.restore();
    for(const [x,y] of [[4.2,-11.4],[.4,-12.8],[-3.4,-11.2]]){ c.fillStyle=g1; c.beginPath(); c.arc(x,y,.8,0,7); c.fill(); c.fillStyle='rgba(255,255,255,.8)'; c.beginPath(); c.arc(x-.25,y-.3,.3,0,7); c.fill(); }
    const gem=(x,y,r,cl)=>{ const gg=c.createRadialGradient(x-r*.3,y-r*.35,r*.1,x,y,r); gg.addColorStop(0,'#ffffff'); gg.addColorStop(.35,cl); gg.addColorStop(1,mix(cl,'#000000',.45)); c.fillStyle=gg; c.beginPath(); c.arc(x,y,r,0,7); c.fill(); c.strokeStyle=g3; c.lineWidth=.25; c.stroke(); };
    gem(.6,-2.8,1.15,'#e0284a'); gem(-4.4,-2.9,.85,'#2a6ae0'); gem(5.4,-3,.85,'#2ab86a'); },
  cone(c){ const o1='#ff8a2a', o2='#d8601a', w='#f8f8f4';
    c.fillStyle='#e0661e'; c.beginPath(); c.moveTo(-9.2,-1); c.lineTo(9.8,-1.2); c.lineTo(9.4,-3); c.lineTo(-8.8,-2.8); c.closePath(); c.fill(); c.fillStyle='rgba(0,0,0,.25)'; c.fillRect(-9.2,-1.6,19,.6);
    const body=()=>{ c.beginPath(); c.moveTo(-6,-2.8); c.lineTo(-.6,-19); c.quadraticCurveTo(.4,-19.8,1.4,-19); c.lineTo(6.8,-2.9); c.closePath(); };
    c.fillStyle=hat036Grad(c,-6,0,6.8,0,[o2,o1,'#ffb060',o1]); body(); c.fill();
    c.save(); body(); c.clip(); c.fillStyle=w; c.beginPath(); c.moveTo(-8,-8.6); c.quadraticCurveTo(.4,-7.8,8,-8.8); c.lineTo(8,-11.2); c.quadraticCurveTo(.4,-10.2,-8,-11); c.closePath(); c.fill();
      c.fillStyle='rgba(200,210,220,.6)'; c.fillRect(-8,-9.2,16,.4); c.fillStyle='rgba(255,255,255,.3)'; c.beginPath(); c.moveTo(2,-3); c.lineTo(.6,-18.6); c.lineTo(1.4,-18.6); c.lineTo(3.6,-3); c.closePath(); c.fill(); c.restore(); },
  acorn(c){ const cap1='#8a5a30', cap2='#5a3618', nut='#c88a40';
    const cap=()=>{ c.beginPath(); c.moveTo(-8.6,-1.4); c.bezierCurveTo(-9.4,-8.6,-4.4,-11.6,.4,-11.4); c.bezierCurveTo(5.2,-11.2,9.6,-8.4,9,-1.4); c.quadraticCurveTo(.2,-.2,-8.6,-1.4); c.closePath(); };
    c.fillStyle=hat036Grad(c,-8,-11,8,-1,[cap2,cap1,'#a87a48']); cap(); c.fill();
    c.save(); cap(); c.clip(); for(let r=0;r<5;r++) for(let k=-6;k<=6;k++){ const x=k*1.5+(r%2)*.75, y=-1.8-r*1.9; c.fillStyle=r%2?'rgba(40,20,6,.4)':'rgba(255,220,170,.18)'; c.beginPath(); c.moveTo(x-.7,y); c.quadraticCurveTo(x,y-1.5,x+.7,y); c.closePath(); c.fill(); } c.restore();
    c.fillStyle=cap2; c.beginPath(); c.moveTo(-.4,-11.2); c.quadraticCurveTo(-.8,-13.4,.4,-14.2); c.lineTo(1.2,-13.8); c.quadraticCurveTo(.4,-13,.8,-11.2); c.closePath(); c.fill();
    c.fillStyle=hat036Grad(c,0,-1.8,0,.4,[nut,mix(nut,'#000000',.3)]); c.beginPath(); c.moveTo(-8.4,-.8); c.quadraticCurveTo(.2,.6,8.8,-.8); c.lineTo(8.6,-1.8); c.quadraticCurveTo(.2,-.6,-8.2,-1.8); c.closePath(); c.fill(); },
  tinfoil(c){ const a='#d8dde2', b='#9aa2aa', d='#6a727a';
    const cone=()=>{ c.beginPath(); c.moveTo(-8.2,-2.4); c.lineTo(-5.2,-8.4); c.lineTo(-3.8,-9); c.lineTo(-1.4,-15.6); c.lineTo(.6,-18.4); c.lineTo(2.2,-15); c.lineTo(5,-9.4); c.lineTo(6.2,-8.6); c.lineTo(8.8,-2.4); c.quadraticCurveTo(.3,-1.2,-8.2,-2.4); c.closePath(); };
    c.fillStyle=hat036Grad(c,-8,0,9,0,[d,b,a,'#ffffff',b]); cone(); c.fill();
    c.save(); cone(); c.clip(); const fac=[[-8,-2,-3,-12,-1,-3],[.6,-18,-1,-6,3,-7],[2,-15,8,-3,4,-3],[-5,-8,-6,-3,-2,-4],[1,-10,3,-3,6,-6]];
      fac.forEach((f,i)=>{ c.fillStyle=i%2?'rgba(255,255,255,.35)':'rgba(40,46,54,.22)'; c.beginPath(); c.moveTo(f[0],f[1]); c.lineTo(f[2],f[3]); c.lineTo(f[4],f[5]); c.closePath(); c.fill(); });
      c.strokeStyle='rgba(60,66,74,.45)'; c.lineWidth=.22; c.beginPath(); c.moveTo(-3.8,-9); c.lineTo(-1,-4); c.lineTo(2.2,-15); c.moveTo(5,-9.4); c.lineTo(1,-6); c.moveTo(-5.4,-6); c.lineTo(3,-4.2); c.stroke(); c.restore();
    c.fillStyle='rgba(255,255,255,.9)'; for(const [x,y] of [[.4,-16.6],[3.4,-7],[-4.4,-6]]){ c.beginPath(); c.moveTo(x,y-.8); c.lineTo(x+.25,y); c.lineTo(x,y+.8); c.lineTo(x-.25,y); c.closePath(); c.fill(); c.beginPath(); c.moveTo(x-.8,y); c.lineTo(x,y+.25); c.lineTo(x+.8,y); c.lineTo(x,y-.25); c.closePath(); c.fill(); } },
  flowerpot(c){ const t1='#c86a3a', t2='#8a4220', soil='#3a2618';
    const pot=()=>{ c.beginPath(); c.moveTo(-7,-1.6); c.lineTo(-8.2,-10.6); c.lineTo(8.8,-10.6); c.lineTo(7.6,-1.6); c.quadraticCurveTo(.3,-.6,-7,-1.6); c.closePath(); };
    c.fillStyle=hat036Grad(c,-8,0,8.8,0,[t2,t1,'#e08a58',t1]); pot(); c.fill();
    c.save(); pot(); c.clip(); c.fillStyle='rgba(0,0,0,.12)'; for(const [x,y] of [[-4,-6],[3,-4],[5,-8],[-1,-3]]){ c.beginPath(); c.ellipse(x,y,.9,.5,0,0,7); c.fill(); } c.restore();
    c.fillStyle=hat036Grad(c,-9,0,9.6,0,[t2,t1,'#e89a68',t1]); c.beginPath(); if(c.roundRect) c.roundRect(-9.2,-13,18.8,2.8,.7); else c.rect(-9.2,-13,18.8,2.8); c.fill(); c.fillStyle='rgba(255,255,255,.18)'; c.fillRect(-9,-12.9,18.4,.5);
    c.fillStyle=soil; c.beginPath(); c.ellipse(.3,-13,8.6,.9,0,0,7); c.fill();
    c.strokeStyle='#4a8a3a'; c.lineWidth=.7; c.beginPath(); c.moveTo(.6,-13); c.quadraticCurveTo(-.4,-16.4,1,-19.6); c.stroke();
    c.fillStyle='#5aa84a'; c.beginPath(); c.ellipse(-1.8,-16,2.2,.9,-.5,0,7); c.fill(); c.beginPath(); c.ellipse(2.4,-17,1.8,.8,.6,0,7); c.fill();
    for(let i=0;i<6;i++){ const a=i/6*Math.PI*2; c.fillStyle='#f06a8a'; c.beginPath(); c.ellipse(1+Math.cos(a)*1.1,-20.2+Math.sin(a)*1.1,.9,.6,a,0,7); c.fill(); } c.fillStyle='#f8d24a'; c.beginPath(); c.arc(1,-20.2,.65,0,7); c.fill(); },
  froghat(c){ const g1='#5ab84a', g2='#3a8a30', g3='#9ad87a';
    const dome=()=>{ c.beginPath(); c.moveTo(-8.6,-1.2); c.bezierCurveTo(-9.2,-8.2,-4.4,-10.8,.3,-10.7); c.bezierCurveTo(5,-10.6,9.6,-8.2,9.2,-1.2); c.quadraticCurveTo(.3,0,-8.6,-1.2); c.closePath(); };
    c.fillStyle=hat036Grad(c,-8,-10,8,-1,[g2,g1,g3]); dome(); c.fill();
    c.save(); dome(); c.clip(); c.fillStyle='rgba(30,80,20,.35)'; for(const [x,y,r] of [[-5,-5,1.2],[-1.6,-7.6,.9],[2.8,-4.4,1.1],[-3,-2.6,.7],[5.6,-6.6,.8]]){ c.beginPath(); c.arc(x,y,r,0,7); c.fill(); }
      c.fillStyle='#f0e8a8'; c.beginPath(); c.moveTo(-9,-1.2); c.quadraticCurveTo(.3,.4,9.4,-1.2); c.lineTo(9.4,-2.6); c.quadraticCurveTo(.3,-1.2,-9,-2.6); c.closePath(); c.fill(); c.restore();
    for(const x of [-2.6,4.8]){ c.fillStyle=hat036Grad(c,x-2.2,-13,x+2.2,-9,[g2,g1,g3]); c.beginPath(); c.arc(x,-10.6,2.5,0,7); c.fill();
      c.fillStyle='#ffffff'; c.beginPath(); c.arc(x+.2,-10.9,1.7,0,7); c.fill(); c.fillStyle='#1a1a1a'; c.beginPath(); c.ellipse(x+.6,-10.8,.75,1,0,0,7); c.fill(); c.fillStyle='#ffffff'; c.beginPath(); c.arc(x+.85,-11.3,.3,0,7); c.fill(); }
    c.strokeStyle='#2a5a20'; c.lineWidth=.45; c.beginPath(); c.moveTo(6.8,-4.6); c.quadraticCurveTo(8,-3.4,9,-4.4); c.stroke(); },
  grad(c,col){ const blk='#1c1c24', b2='#34343e', gold='#e8c050';
    const skull=()=>{ c.beginPath(); c.moveTo(-7.8,-1.4); c.bezierCurveTo(-8.2,-6,-4.2,-7.8,.3,-7.8); c.bezierCurveTo(4.8,-7.8,8.8,-6,8.4,-1.4); c.quadraticCurveTo(.3,-.2,-7.8,-1.4); c.closePath(); };
    c.fillStyle=hat036Grad(c,-8,-8,8,-1,[blk,b2,blk]); skull(); c.fill();
    c.fillStyle=blk; c.beginPath(); c.moveTo(-10.6,-8.4); c.lineTo(1.6,-11.8); c.lineTo(12.4,-8.2); c.lineTo(.4,-5); c.closePath(); c.fill();
    c.fillStyle=b2; c.beginPath(); c.moveTo(-10.6,-8.4); c.lineTo(1.6,-11.8); c.lineTo(12.4,-8.2); c.lineTo(12.4,-7.5); c.lineTo(.4,-4.2); c.lineTo(-10.6,-7.7); c.closePath(); c.globalAlpha*=.5; c.fill(); c.globalAlpha/=.5;
    c.fillStyle='rgba(255,255,255,.1)'; c.beginPath(); c.moveTo(-8,-8.6); c.lineTo(1.6,-11.2); c.lineTo(9.6,-8.6); c.lineTo(1.6,-10.2); c.closePath(); c.fill();
    c.fillStyle=gold; c.beginPath(); c.arc(1.2,-8.6,.6,0,7); c.fill(); c.strokeStyle=gold; c.lineWidth=.4; c.beginPath(); c.moveTo(1.2,-8.6); c.quadraticCurveTo(-4,-8.4,-7.2,-6.4); c.lineTo(-7.6,-3.4); c.stroke();
    c.fillStyle=gold; c.beginPath(); c.moveTo(-8.3,-3.6); c.lineTo(-6.9,-3.6); c.lineTo(-6.6,-.4); c.lineTo(-8.8,-.4); c.closePath(); c.fill(); c.fillStyle='rgba(120,80,10,.5)'; for(let i=0;i<4;i++) c.fillRect(-8.6+i*.55,-3,.18,2.5); },
  lanternhat(c,col,t){ const brass='#c8963a', b2='#8a6420';
    hat036Crown(c,col,{noButton:1}); hat036Brim(c,col);
    c.strokeStyle=b2; c.lineWidth=.6; c.beginPath(); c.moveTo(.4,-10); c.lineTo(.4,-13); c.quadraticCurveTo(.4,-14.6,2.4,-14.8); c.lineTo(4.6,-14.8); c.stroke();
    const fl=.85+Math.sin((t||0)*7)*.08+Math.sin((t||0)*13)*.05;
    const gl=c.createRadialGradient(4.6,-12.2,0,4.6,-12.2,5); gl.addColorStop(0,'rgba(255,214,120,'+(.5*fl)+')'); gl.addColorStop(1,'rgba(255,190,90,0)'); c.fillStyle=gl; c.beginPath(); c.arc(4.6,-12.2,5,0,7); c.fill();
    c.fillStyle=brass; c.fillRect(3.4,-14.6,2.4,.7); c.fillStyle=hat036Grad(c,3.5,-13.8,5.7,-10.6,['#fff4c8','#ffc860']); c.fillRect(3.6,-13.9,2,3.1);
    c.strokeStyle=b2; c.lineWidth=.3; c.strokeRect(3.6,-13.9,2,3.1); c.beginPath(); c.moveTo(4.6,-13.9); c.lineTo(4.6,-10.8); c.stroke(); c.fillStyle=brass; c.fillRect(3.3,-10.9,2.6,.7); },
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
