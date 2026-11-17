// =====================================================================
// 0.3.1 side-view clothing. The angler is seen from the side (facing right), so the torso is now a
// real side profile (back, shoulder blade, small of the back, seat; chest and belly at the front)
// instead of a front-on box, and every outfit is drawn the way it looks from that side:
// openings, buttons and zips at the front edge, hoods, sailor collars and bows at the back,
// pockets on the side. Neckwear wraps the neck and hangs at the front, clear of the arm.
// =====================================================================

// ---------- body silhouettes ----------
// front edge of the torso at height y (used to place buttons, zips and ties on the chest)
function sideFront(y,f){ const bb=A3BELLY*2.0;
  if(f){ if(y<-42.4) return 3.4+(y+46.9)/4.5*3.0; if(y<-33.2) return 6.4+Math.sin((y+42.4)/9.2*Math.PI)*1.5-(y+42.4)/9.2*.8; return 5.6+bb*.6+(y+33.2)/9.6*(.6+bb*.4); }
  if(y<-43) return 3.4+(y+46.9)/3.9*2.9; if(y<-35) return 6.3+(y+43)/8*.1+bb*.4*(y+43)/8; return 6.4+bb*.8+Math.sin((y+35)/11.4*Math.PI)*(.4+bb*1.2)-(y+35)/11.4*(.2+bb*.3); }
function sideTorsoPath(c,f){ const bb=A3BELLY*2.0; c.beginPath();
  c.moveTo(-4.6,-46.9);
  c.bezierCurveTo(-6.6,-46.5,-7.3,-43.6,-7.1,-40.6);   // over the shoulder blade
  c.bezierCurveTo(-6.9,-36.6,-5.9,-33.6,-6,-30.2);     // in at the small of the back
  c.bezierCurveTo(-6.1,-27.4,-7,-25.4,-6.9,-23.6);     // out over the seat
  c.lineTo(6.2+bb*.5,-23.6);
  if(f){ c.bezierCurveTo(6.6+bb*1.2,-26.5,6.3+bb*1.6,-30.5,5.6+bb*.6,-33.2); c.bezierCurveTo(7.9,-34.4,8.3,-39.6,6.4,-42.4); c.bezierCurveTo(5.4,-44.2,4.4,-46.2,3.4,-46.9); }
  else { c.bezierCurveTo(6.8+bb*1.5,-26.8,7+bb*2.1,-31.6,6.4+bb*.8,-35); c.bezierCurveTo(6.9,-38.8,6.6,-43.2,3.4,-46.9); }
  c.quadraticCurveTo(-.6,-48.3,-4.6,-46.9); c.closePath(); }
function sideCoatPath(c,f,hemY){ const bb=A3BELLY*2.0; c.beginPath();
  c.moveTo(-4.8,-47.1);
  c.bezierCurveTo(-6.9,-46.6,-7.6,-43.6,-7.4,-40.6);
  c.bezierCurveTo(-7.2,-36.6,-6.4,-33.6,-6.6,-30.2);
  c.bezierCurveTo(-6.8,-27,-7.6,-24,-8.3,hemY);
  c.quadraticCurveTo(0,hemY+1.4,7.7+bb*.8,hemY);
  if(f){ c.bezierCurveTo(7.1+bb*1.2,-24,6.7+bb*1.6,-30.5,6+bb*.6,-33.2); c.bezierCurveTo(8.2,-34.4,8.6,-39.6,6.7,-42.4); c.bezierCurveTo(5.6,-44.3,4.6,-46.3,3.6,-47.1); }
  else { c.bezierCurveTo(7.3+bb*1.5,-25,7.4+bb*2.1,-31.6,6.8+bb*.8,-35); c.bezierCurveTo(7.3,-38.8,6.9,-43.4,3.6,-47.1); }
  c.quadraticCurveTo(-.6,-48.6,-4.8,-47.1); c.closePath(); }
a3TorsoPath=sideTorsoPath; a3CoatPath=sideCoatPath;

// ---------- outfits ----------
const SIDE_OUT=(()=>{
  const H=(lk,def)=>lk.outCol&&lk.outCol!=='#d8a020'?lk.outCol:def;                 // outfit colour, or its own default
  const sh=(cl,k)=>mix(cl,'#000000',k), li=(cl,k)=>mix(cl,'#ffffff',k);
  const clipT=(c,f,fn)=>{ c.save(); sideTorsoPath(c,f); c.clip(); fn(); c.restore(); };
  const clipC=(c,f,hem,fn)=>{ c.save(); sideCoatPath(c,f,hem); c.clip(); fn(); c.restore(); };
  const dot=(c,x,y,r,cl)=>{ c.fillStyle=cl; c.beginPath(); c.arc(x,y,r,0,7); c.fill(); };
  const line=(c,pts,cl,w,dash)=>{ c.strokeStyle=cl; c.lineWidth=w; if(dash) c.setLineDash(dash); c.beginPath(); pts.forEach(([x,y],i)=>i?c.lineTo(x,y):c.moveTo(x,y)); c.stroke(); if(dash) c.setLineDash([]); };
  // a seam that follows the front edge, `ins` units inside it
  const frontSeam=(c,f,ins,y0,y1,cl,w,dash)=>{ const p=[]; for(let y=y0;y<=y1+.01;y+=1) p.push([sideFront(y,f)-ins,y]); line(c,p,cl,w,dash); };
  const buttons=(c,f,ins,ys,cl,r)=>{ for(const y of ys) dot(c,sideFront(y,f)-ins,y,r||.55,cl); };
  // a pocket on the side of the body: body, flap, button
  const pocket=(c,x,y,w,h,cl,flap,btn)=>{ c.fillStyle=cl; c.beginPath(); c.roundRect?c.roundRect(x,y,w,h,.5):c.rect(x,y,w,h); c.fill(); c.fillStyle=flap; c.beginPath(); c.moveTo(x-.2,y-.3); c.lineTo(x+w+.2,y-.3); c.lineTo(x+w+.1,y+1.2); c.quadraticCurveTo(x+w/2,y+1.7,x-.1,y+1.2); c.closePath(); c.fill(); if(btn) dot(c,x+w/2,y+1,.3,btn); };
  // a collar standing around the neck, seen from the side: higher at the back, dipping at the throat
  const collar=(c,cl,edge,front)=>{ c.fillStyle=cl; c.beginPath(); c.moveTo(-4.8,-46.6); c.quadraticCurveTo(-4.4,-49.4,-2.4,-49.6); c.quadraticCurveTo(1.6,-48.6,front||3.8,-46.6); c.quadraticCurveTo(.4,-46.9,-4.8,-46.6); c.fill(); if(edge) line(c,[[-4.4,-48.9],[-2.4,-49.5],[1.6,-48.5],[(front||3.8)-.2,-46.7]],edge,.35); };
  const hemBand=(c,f,y,h,cl,rib)=>{ clipT(c,f,()=>{ c.fillStyle=cl; c.fillRect(-9,y,19,h); if(rib){ c.strokeStyle=rib; c.lineWidth=.28; for(let x=-8.6;x<9;x+=1.1){ c.beginPath(); c.moveTo(x,y); c.lineTo(x,y+h); c.stroke(); } } }); };
  return {
    vest(c,lk,D,f){ const col=D(H(lk,'#6a7a4a')), d2=D(sh(H(lk,'#6a7a4a'),.22)), d3=D(sh(H(lk,'#6a7a4a'),.38));
      clipT(c,f,()=>{ c.fillStyle=col; c.beginPath(); c.moveTo(-9,-50); c.lineTo(2.6,-50); for(let y=-46;y<=-22;y+=2) c.lineTo(sideFront(y,f)-1.1,y); c.lineTo(-9,-22); c.closePath(); c.fill();
        pocket(c,.6,-39,3.6,3.8,d2,d3,D('#d8c090')); pocket(c,-.4,-31.4,4.2,3.6,d2,d3,D('#d8c090'));
        frontSeam(c,f,1.5,-45,-23,D('#e8d8a0'),.32,[.8,.7]); dot(c,-3.6,-41,.9,D('#c8c8d0')); dot(c,-3.6,-41,.45,D('#8a8a96')); }); },
    lifejacket(c,lk,D,f){ const col=D(H(lk,'#ff7a2a')), d2=D(sh(H(lk,'#ff7a2a'),.25)), k=D('#262630');
      clipT(c,f,()=>{ c.fillStyle=col; c.fillRect(-9,-50,19,28); c.fillStyle=d2; c.fillRect(-1.4,-46,2.4,24);
        for(const y of [-41,-35.4,-29.4]){ line(c,[[-7,y],[-4,y+.8],[-1.6,y]],d2,.45); line(c,[[1.2,y],[4,y+.8],[7.2,y]],d2,.45); }
        c.fillStyle=k; c.fillRect(-9,-34.6,19,1.8); c.fillRect(-9,-28.8,19,1.8);
        for(const y of [-35.2,-29.4]){ const x=sideFront(y+.9,f)-2.6; c.fillStyle=D('#c8c8d0'); c.fillRect(x,y,2,3); c.fillStyle=k; c.fillRect(x+.5,y+.8,1,1.4); }
        c.fillStyle='rgba(255,255,255,.75)'; c.fillRect(-6.4,-44,2.6,.9); });
      c.fillStyle=col; c.beginPath(); c.moveTo(-5,-46.4); c.quadraticCurveTo(-4.6,-50,-2,-50); c.quadraticCurveTo(2.4,-49.4,4.2,-46.6); c.quadraticCurveTo(0,-47.6,-5,-46.4); c.fill(); line(c,[[-4.6,-48],[-2,-49.6],[3.4,-47.4]],d2,.35); },
    hoodie(c,lk,D,f){ const col=D(H(lk,'#d8a020')), d2=D(sh(H(lk,'#d8a020'),.22));
      clipT(c,f,()=>{ c.fillStyle=col; c.fillRect(-9,-50,19,28);
        c.fillStyle=d2; c.beginPath(); c.moveTo(1,-33.6); c.quadraticCurveTo(2.2,-28,1.2,-26.4); c.lineTo(9,-26.4); c.lineTo(9,-33.6); c.closePath(); c.fill(); line(c,[[1.2,-33.4],[2.4,-29.6],[1.4,-26.6]],D(sh(H(lk,'#d8a020'),.4)),.35); });
      hemBand(c,f,-25,1.4,d2);
      // the hood lies bunched at the back of the neck
      c.fillStyle=col; c.beginPath(); c.moveTo(-1.4,-47); c.quadraticCurveTo(-3,-51.4,-6.4,-49.4); c.quadraticCurveTo(-8.4,-46.4,-6.6,-43.4); c.quadraticCurveTo(-4.4,-44.6,-1.4,-47); c.fill();
      c.fillStyle=d2; c.beginPath(); c.moveTo(-2,-47); c.quadraticCurveTo(-3.4,-50,-5.8,-48.6); c.quadraticCurveTo(-6.6,-46.6,-5.6,-45); c.quadraticCurveTo(-4,-45.6,-2,-47); c.fill();
      // drawstrings at the throat, hanging over the chest front
      line(c,[[3.6,-46.4],[4.6,-43],[4.9,-40.4]],D('#f4f0e8'),.45); line(c,[[3,-46.6],[3.7,-43.4],[3.9,-41.2]],D(mix('#f4f0e8','#000000',.2)),.4); dot(c,4.9,-40.2,.4,D('#f4f0e8')); dot(c,3.9,-41,.35,D(mix('#f4f0e8','#000000',.2))); },
    raincoat(c,lk,D,f){ const col=D(H(lk,'#f2c230')), d2=D(sh(H(lk,'#f2c230'),.22)), d3=D(sh(H(lk,'#f2c230'),.34));
      c.fillStyle=col; sideCoatPath(c,f,-16); c.fill();
      clipC(c,f,-16,()=>{ const p=[]; for(let y=-45;y<=-16;y+=1) p.push([Math.min(7.4,sideFront(Math.min(y,-24),f))-1.3,y]); line(c,p,d3,.5); buttons(c,f,2.3,[-41.5,-35.6,-29.6],D('#3a3a44'),.55); dot(c,5.2,-23.6,.55,D('#3a3a44'));
        pocket(c,-1.2,-27.6,4.4,4.4,d2,d3); line(c,[[-7.2,-20],[7.4,-20]],d2,.3); });
      collar(c,col,d3,4.2); },
    overalls(c,lk,D,f){ const den=D(H(lk,'#3a6f9a')), d2=D(sh(H(lk,'#3a6f9a'),.22)), gold=D('#f2cf5a');
      clipT(c,f,()=>{ c.fillStyle=den; c.fillRect(-9,-26.4,19,4); c.beginPath(); c.moveTo(1.6,-38.6); for(let y=-38.6;y<=-23;y+=1.4) c.lineTo(sideFront(y,f)+.4,y); c.lineTo(-1,-23); c.quadraticCurveTo(.4,-31,1.6,-38.6); c.fill();
        c.fillStyle=d2; c.beginPath(); c.roundRect?c.roundRect(2.6,-35,3,3.4,.4):c.rect(2.6,-35,3,3.4); c.fill(); line(c,[[2.6,-35],[5.6,-35],[5.6,-31.6],[2.6,-31.6],[2.6,-35]],D('#e8c060'),.28,[.6,.5]);
        // strap down the back to the waistband
        line(c,[[-3.6,-46.8],[-5.4,-40],[-5,-33],[-4.2,-26.4]],den,1.7); dot(c,-4.2,-26.6,.6,gold); dot(c,-1.6,-25.2,.55,gold); });
      dot(c,2.4,-38.3,.75,gold); },
    puffer(c,lk,D,f){ const col=D(H(lk,'#d8a020')), d2=D(sh(H(lk,'#d8a020'),.22)), path=()=>{ c.beginPath(); c.moveTo(-5.4,-47.6); c.bezierCurveTo(-8.6,-46.8,-8.8,-40,-8.2,-34); c.bezierCurveTo(-7.8,-29,-8.4,-24,-8,-21.6); c.quadraticCurveTo(0,-20.6,8.2+A3BELLY*2,-21.6); c.bezierCurveTo(8.8+A3BELLY*2.6,-28,8.6+A3BELLY*2,-38,4.6,-47.6); c.quadraticCurveTo(-.6,-49,-5.4,-47.6); c.closePath(); };
      c.fillStyle=col; path(); c.fill(); c.save(); path(); c.clip(); for(let y=-41.6;y<-22;y+=4.6) line(c,[[-9,y],[0,y+1.2],[9.6,y]],d2,.6); c.fillStyle='rgba(255,255,255,.12)'; for(let y=-45;y<-22;y+=4.6) c.fillRect(-9,y,19,1.4);
        line(c,[[5.6,-46.6],[7.6+A3BELLY*2,-38],[7.8+A3BELLY*2.2,-30],[7.4+A3BELLY*1.6,-22]],D('#e8e8ee'),.7); c.restore();
      c.fillStyle=col; c.beginPath(); c.moveTo(-5.6,-46.8); c.quadraticCurveTo(-5.2,-50.4,-2.4,-50.6); c.quadraticCurveTo(2.6,-49.8,4.8,-47); c.quadraticCurveTo(0,-47.8,-5.6,-46.8); c.fill(); line(c,[[-5.2,-48.4],[-2.4,-50.4],[4.2,-47.6]],d2,.4); },
    wetsuit(c,lk,D,f){ const w=D('#1c1c26'), oc=D(H(lk,'#d8a020'));
      clipT(c,f,()=>{ c.fillStyle=w; c.fillRect(-9,-50,19,28); c.fillStyle=oc; c.beginPath(); c.moveTo(-9,-41.6); c.lineTo(9,-43.4); c.lineTo(9,-41.4); c.lineTo(-9,-39.8); c.closePath(); c.fill(); c.fillRect(-9,-26,19,1.4);
        line(c,[[-6.2,-46.4],[-6.8,-40],[-6,-33]],D('#8a8a9a'),.55); dot(c,-6,-32.8,.5,D('#c8c8d0')); });
      c.fillStyle=oc; c.fillRect(-1.6,-12.6,4.6,1.4); c.fillStyle=w; c.beginPath(); c.moveTo(-4.4,-46.6); c.quadraticCurveTo(-4,-49.4,-2,-49.4); c.quadraticCurveTo(1.6,-48.8,3.6,-46.6); c.closePath(); c.fill(); },
    captain(c,lk,D,f){ const n=D(H(lk,'#1a2a4a')), gold=D('#f2c84a'), l2=D(li(H(lk,'#1a2a4a'),.15));
      c.fillStyle=n; sideCoatPath(c,f,-14.5); c.fill();
      clipC(c,f,-14.5,()=>{ const p=[]; for(let y=-44;y<=-14.5;y+=1) p.push([Math.min(7.4,sideFront(Math.min(y,-24),f))-1.1,y]); line(c,p,l2,.5); buttons(c,f,2.2,[-41,-35.4,-29.6],gold,.6); dot(c,5.4,-24,.6,gold);
        c.fillStyle=gold; c.fillRect(-8,-18.6,16,.7); c.fillRect(-8,-20,16,.4); });
      c.fillStyle=D('#f4f4f2'); c.beginPath(); c.moveTo(2.4,-47.2); c.lineTo(4.4,-46.8); c.lineTo(4.6,-44.2); c.closePath(); c.fill(); collar(c,n,gold,4); },
    spacesuit(c,lk,D,f){ const s2=D('#e8ecf0'), s3=D('#c8d0d8');
      clipT(c,f,()=>{ c.fillStyle=s2; c.fillRect(-9,-50,19,28); c.fillStyle=D('#d8603a'); c.fillRect(-9,-27,19,1.8); line(c,[[-1.4,-46],[-1.8,-36],[-1.4,-27]],s3,.4); line(c,[[-6,-44],[-5.6,-30]],s3,.35); });
      // the chest control box stands out in front of the suit
      const bx=sideFront(-38,f)-1.6; c.fillStyle=D('#5a6a7a'); c.beginPath(); c.roundRect?c.roundRect(bx,-41.4,4.2,6.2,.8):c.rect(bx,-41.4,4.2,6.2); c.fill(); c.fillStyle=D('#3a4652'); c.fillRect(bx+3.4,-41,.8,5.4);
      dot(c,bx+1.2,-39.6,.55,D('#ff5a4a')); dot(c,bx+2.6,-39.6,.55,D('#5aff9a')); c.fillStyle=D('#9ad8ff'); c.fillRect(bx+.6,-37.6,2.6,.7);
      c.fillStyle=s3; c.beginPath(); c.moveTo(-5.2,-46.4); c.quadraticCurveTo(-4.8,-49.6,-2.4,-49.8); c.quadraticCurveTo(2,-49.4,4.2,-46.6); c.quadraticCurveTo(-.4,-47.4,-5.2,-46.4); c.fill(); },
    cardigan(c,lk,D,f){ const col=D(H(lk,'#d8a020')), d2=D(sh(H(lk,'#d8a020'),.22));
      clipT(c,f,()=>{ c.fillStyle=col; c.beginPath(); c.moveTo(-9,-50); c.lineTo(2.2,-50); for(let y=-46.4;y<=-22;y+=1.2) c.lineTo(sideFront(y,f)-.9-(y<-40?(y+40)*-.12:0),y); c.lineTo(-9,-22); c.closePath(); c.fill(); c.fillStyle=d2; c.fillRect(-9,-24.8,19,2.4);
        c.strokeStyle=sh(d2,.15); c.lineWidth=.28; for(let x=-8.6;x<9;x+=1.1){ c.beginPath(); c.moveTo(x,-24.8); c.lineTo(x,-22.4); c.stroke(); }
        frontSeam(c,f,1.1,-40,-23,d2,.5); pocket(c,-.6,-31.6,3.8,3.4,d2,d2); });
      buttons(c,f,1.5,[-38.6,-34,-29.4,-25.6],D('#f4ecd8'),.5); },
    sweater(c,lk,D,f){ const col=D(H(lk,'#d8a020')), l3=D(li(H(lk,'#d8a020'),.3)), d2=D(sh(H(lk,'#d8a020'),.22));
      clipT(c,f,()=>{ c.fillStyle=col; c.fillRect(-9,-50,19,28); c.fillStyle=l3; c.beginPath(); for(let x=-9;x<10;x+=3){ c.moveTo(x,-38.4); c.lineTo(x+1.5,-36.6); c.lineTo(x+3,-38.4); c.lineTo(x+1.5,-40.2); } c.fill();
        c.strokeStyle='rgba(0,0,0,.08)'; c.lineWidth=.35; for(let x=-8.4;x<9;x+=1.6){ c.beginPath(); c.moveTo(x,-48); c.lineTo(x,-41); c.moveTo(x,-35); c.lineTo(x,-25); c.stroke(); } });
      hemBand(c,f,-24.9,2.6,d2,D(sh(H(lk,'#d8a020'),.32)));
      c.fillStyle=d2; c.beginPath(); c.moveTo(-4.8,-46.6); c.quadraticCurveTo(-.6,-49,3.6,-46.8); c.lineTo(3.4,-45.6); c.quadraticCurveTo(-.6,-47.6,-4.8,-45.4); c.closePath(); c.fill(); },
    apron(c,lk,D,f){ const col=D(H(lk,'#e8e0d0')), d2=D(sh(H(lk,'#e8e0d0'),.2));
      // the bib and skirt hang down the front of the body; the neck loop and waist ties go round to the back
      line(c,[[3.4,-41],[2.6,-45.6],[0,-48],[-3.6,-47.2]],col,.8);
      c.fillStyle=col; c.beginPath(); c.moveTo(3,-41.2); c.lineTo(sideFront(-41,f)+.5,-41.2); for(let y=-40;y<=-24;y+=2) c.lineTo(sideFront(y,f)+.6,y); c.lineTo(sideFront(-24,f)+1.4,-18); c.lineTo(1.4,-18); c.quadraticCurveTo(2.4,-30,3,-41.2); c.fill();
      c.fillStyle=d2; c.fillRect(2.6,-27.2,sideFront(-27,f)-2.2,1.2); pocket(c,3.4,-34,sideFront(-34,f)-3.2,3.4,d2,d2);
      clipT(c,f,()=>{ c.fillStyle=d2; c.fillRect(-9,-27.2,12,1.2); });
      // the bow at the back
      c.fillStyle=d2; c.beginPath(); c.ellipse(-7.8,-27.2,1.4,.9,-.5,0,7); c.ellipse(-7.6,-25.8,1.3,.8,.6,0,7); c.fill(); line(c,[[-7.4,-26.6],[-8.4,-22.6]],d2,.6); line(c,[[-7,-26.6],[-7.2,-22.2]],d2,.6); },
    tidecoat(c,lk,D,f,t){ const n=D('#1a3a5a'), glow=D('#5ad8e8');
      c.fillStyle=n; sideCoatPath(c,f,-16); c.fill();
      clipC(c,f,-16,()=>{ const wave=()=>{ c.beginPath(); for(let x=-9;x<=9;x+=.6) c.lineTo(x,-21.4+Math.sin(x*.9+t*2)*1.1); }; c.strokeStyle=glow; c.lineWidth=1.1; wave(); c.stroke(); c.save(); c.globalAlpha*=.35; c.lineWidth=2.4; wave(); c.stroke(); c.restore();
        const p=[]; for(let y=-45;y<=-16;y+=1) p.push([Math.min(7.4,sideFront(Math.min(y,-24),f))-1.2,y]); line(c,p,glow,.6); });
      collar(c,n,glow,4); },
    bathrobe(c,lk,D,f){ const col=D(H(lk,'#f0e6f4')), d2=D(sh(H(lk,'#f0e6f4'),.16));
      c.fillStyle=col; sideCoatPath(c,f,-12); c.fill();
      clipC(c,f,-12,()=>{ c.fillStyle='rgba(255,255,255,.25)'; for(let i=0;i<16;i++) dot(c,-8+((i*7)%16),-44+((i*11)%30),.5,'rgba(255,255,255,.25)');
        // shawl collar: from the back of the neck down the front to the belt
        c.fillStyle=d2; c.beginPath(); c.moveTo(-4.6,-46.6); c.quadraticCurveTo(-.6,-48.8,3.8,-46.8); for(let y=-45;y<=-29;y+=2) c.lineTo(sideFront(y,f)+.2,y); c.lineTo(sideFront(-29,f)-2.4,-29); for(let y=-31;y>=-44;y-=2) c.lineTo(sideFront(y,f)-2.2,y); c.quadraticCurveTo(-.4,-46.6,-4.6,-45.2); c.closePath(); c.fill();
        c.fillStyle=d2; c.fillRect(-9,-29.6,19,2.2); });
      const kx=sideFront(-28.5,f); c.fillStyle=d2; c.beginPath(); c.ellipse(kx,-28.5,1.2,1,0,0,7); c.fill(); line(c,[[kx,-28],[kx+.6,-22.6]],d2,1); line(c,[[kx-.4,-28],[kx-.6,-23.4]],d2,1); },
    pajamas(c,lk,D,f){ const col=D(H(lk,'#7a9ad8')), l3=D('#f4f0f8');
      clipT(c,f,()=>{ c.fillStyle=col; c.fillRect(-9,-50,19,28); c.fillStyle=l3; for(let x=-8.6;x<10;x+=2.4) c.fillRect(x,-50,.9,28); frontSeam(c,f,1.4,-45,-23,D(sh(H(lk,'#7a9ad8'),.25)),.4); });
      buttons(c,f,2.2,[-42,-37,-32,-27],l3,.5); collar(c,col,D(sh(H(lk,'#7a9ad8'),.25)),4.2); },
    lumberjack(c,lk,D,f){ const col=D(H(lk,'#b8342a')), d2=D('#1c1416');
      clipT(c,f,()=>{ c.fillStyle=col; c.fillRect(-9,-50,19,28); c.fillStyle=d2; c.globalAlpha*=.75; for(let x=-9;x<10;x+=4.4) c.fillRect(x,-50,2,28); for(let y=-50;y<-22;y+=4.4) c.fillRect(-9,y,19,2); c.globalAlpha/=.75;
        for(let x=-9;x<10;x+=4.4) for(let y=-50;y<-22;y+=4.4) c.fillRect(x,y,2,2); frontSeam(c,f,1.4,-45,-23,d2,.5); pocket(c,1,-41,3.6,3.4,col,d2,D('#d8c090')); });
      buttons(c,f,2.1,[-41,-35.6,-30,-25.4],D('#e8d8b8'),.45); collar(c,col,d2,4.2); },
    tracksuit(c,lk,D,f){ const col=D(H(lk,'#2a5ad8')), st=D('#f4f4f2'), d2=D(sh(H(lk,'#2a5ad8'),.3));
      clipT(c,f,()=>{ c.fillStyle=col; c.fillRect(-9,-50,19,28); c.fillStyle=st; c.fillRect(-1.8,-48,.7,26); c.fillRect(-.8,-48,.7,26); line(c,[[sideFront(-46,f)-.6,-46],[sideFront(-40,f)-.6,-40],[sideFront(-34,f)-.6,-34],[sideFront(-28,f)-.6,-28],[sideFront(-23.6,f)-.6,-23.6]],d2,.7); });
      hemBand(c,f,-24.8,1.6,d2); collar(c,col,d2,4); dot(c,sideFront(-46,f)-.6,-46.2,.45,D('#e8e8ee')); },
    kimono(c,lk,D,f){ const col=D(H(lk,'#c8304a')), dk=D(sh(H(lk,'#c8304a'),.3));
      c.fillStyle=col; sideCoatPath(c,f,-13); c.fill();
      clipC(c,f,-13,()=>{ for(let i=0;i<11;i++){ const x=-8+((i*7)%16), y=-44+((i*11)%28); dot(c,x,y,1.1,'rgba(255,240,220,.25)'); dot(c,x+1.4,y+.4,.8,'rgba(255,240,220,.25)'); }
        // the collar band (eri) crossing down the front into the sash
        c.fillStyle=D('#f4ecd8'); c.beginPath(); c.moveTo(-4.4,-46.8); c.quadraticCurveTo(-.4,-48.6,3.8,-46.6); for(let y=-45;y<=-31;y+=2) c.lineTo(sideFront(y,f)-.4,y); c.lineTo(sideFront(-31,f)-1.8,-31); for(let y=-33;y>=-44;y-=2) c.lineTo(sideFront(y,f)-1.8,y); c.quadraticCurveTo(-.4,-46.6,-4.4,-45.4); c.closePath(); c.fill();
        c.fillStyle=dk; c.fillRect(-9,-31,19,3.6); c.fillStyle=D('#ffd23a'); c.fillRect(-9,-29.8,19,.8); });
      // the sash bow at the back
      // 0.3.6: a folded drum bow tied onto the back (it used to be a box floating behind it)
      c.fillStyle=dk; c.beginPath(); c.moveTo(-6.2,-33.4); c.quadraticCurveTo(-10.4,-34.4,-11.4,-32); c.lineTo(-11.6,-27.4); c.quadraticCurveTo(-10.6,-25.4,-6.4,-26.2); c.closePath(); c.fill();
      c.fillStyle='rgba(255,255,255,.14)'; c.beginPath(); c.moveTo(-7,-32.8); c.quadraticCurveTo(-10,-33.4,-10.8,-31.6); c.lineTo(-10.9,-30.6); c.quadraticCurveTo(-9.8,-32,-7,-31.6); c.closePath(); c.fill();
      c.strokeStyle='rgba(0,0,0,.25)'; c.lineWidth=.35; c.beginPath(); c.moveTo(-11.3,-29.6); c.quadraticCurveTo(-9,-29.2,-6.6,-29.8); c.stroke();
      c.fillStyle=D('#ffd23a'); c.beginPath(); c.moveTo(-6.4,-30.2); c.quadraticCurveTo(-9,-29.6,-11.5,-30.1); c.lineTo(-11.5,-29.4); c.quadraticCurveTo(-9,-28.9,-6.4,-29.5); c.closePath(); c.fill(); },
    denim(c,lk,D,f){ const col=D(H(lk,'#4a6a9a')), dk=D(sh(H(lk,'#4a6a9a'),.28)), st=D('#e8b060');
      clipT(c,f,()=>{ c.fillStyle=col; c.fillRect(-9,-50,19,28); line(c,[[-7,-40.6],[sideFront(-40.6,f),-41]],st,.3,[.6,.5]); frontSeam(c,f,1.2,-46,-23,st,.3,[.6,.5]);
        pocket(c,.6,-40,3.8,3.6,dk,dk,D('#c8c8d0')); c.fillStyle=dk; c.fillRect(-9,-25,19,2.6); line(c,[[-9,-24.5],[9,-24.5]],st,.25,[.6,.5]); });
      buttons(c,f,2,[-37,-32,-27.2],D('#c8c8d0'),.5);
      c.fillStyle=dk; c.beginPath(); c.moveTo(-5,-46.6); c.quadraticCurveTo(-4.4,-49.8,-2,-49.8); c.quadraticCurveTo(2.2,-49,4,-46.6); c.lineTo(3,-44.6); c.quadraticCurveTo(-.4,-46.4,-4.6,-45); c.closePath(); c.fill(); },
    sailor(c,lk,D,f){ const w=D('#f4f4f2'), n=D('#1a2a5a');
      clipT(c,f,()=>{ c.fillStyle=w; c.fillRect(-9,-50,19,28); c.fillStyle=n; c.fillRect(-9,-24.6,19,1.2); });
      // the square sailor collar falls over the upper back, the knot sits at the front of the chest
      c.fillStyle=n; c.beginPath(); c.moveTo(-1.6,-47.6); c.quadraticCurveTo(-5.4,-47.6,-7.6,-46.4); c.lineTo(-7.8,-39.6); c.lineTo(-3.4,-39.8); c.quadraticCurveTo(-2.2,-44,-1.6,-47.6); c.fill();
      line(c,[[-2.6,-46.8],[-6.8,-45.8],[-7,-40.6],[-3.8,-40.6]],w,.35);
      c.fillStyle=n; c.beginPath(); c.moveTo(-1.6,-47.6); c.quadraticCurveTo(1.8,-48.2,3.6,-46.6); c.lineTo(sideFront(-42,f)-1,-42); c.lineTo(sideFront(-42,f)-2.6,-42.4); c.quadraticCurveTo(.6,-45,-1.6,-46.2); c.closePath(); c.fill();
      const kx=sideFront(-41.4,f)-.6; c.fillStyle=D('#d8302a'); c.beginPath(); c.ellipse(kx,-41.4,.9,.8,0,0,7); c.fill(); c.beginPath(); c.moveTo(kx-.2,-41); c.lineTo(kx-.2,-37.4); c.lineTo(kx+.8,-38); c.lineTo(kx+.6,-41); c.closePath(); c.fill(); },
    aloha(c,lk,D,f){ const col=D(H(lk,'#2ab8a8'));
      clipT(c,f,()=>{ c.fillStyle=col; c.beginPath(); c.moveTo(-9,-50); c.lineTo(2.6,-50); for(let y=-46.6;y<=-22;y+=1.2) c.lineTo(sideFront(y,f)-.9-(y<-41?(y+41)*-.2:0),y); c.lineTo(-9,-22); c.closePath(); c.fill();
        const fl=['#ff7a9a','#ffd23a','#ffffff']; for(let i=0;i<14;i++){ const x=-8+((i*9)%14), y=-48+((i*7)%26); for(let p=0;p<5;p++){ const a=p*1.26; dot(c,x+Math.cos(a)*.8,y+Math.sin(a)*.8,.6,D(fl[i%3])); } } });
      c.fillStyle=col; c.beginPath(); c.moveTo(-4.8,-46.6); c.quadraticCurveTo(-4,-49.6,-1.8,-49.6); c.quadraticCurveTo(1.6,-48.8,3.2,-46.6); c.lineTo(3.6,-43); c.quadraticCurveTo(1.6,-44.6,.2,-46.4); c.quadraticCurveTo(-2,-46.6,-4.8,-45.4); c.closePath(); c.fill(); },
    suit(c,lk,D,f){ const col=D(H(lk,'#2a2a34')), dk=D(sh(H(lk,'#2a2a34'),.3)), wh=D('#f4f4f2');
      c.fillStyle=col; sideCoatPath(c,f,-20); c.fill();
      clipC(c,f,-20,()=>{ // shirt and tie showing at the very front, then the lapel
        c.fillStyle=wh; c.beginPath(); c.moveTo(3.2,-47); for(let y=-46;y<=-36;y+=1) c.lineTo(sideFront(y,f)+.4,y); c.lineTo(sideFront(-36,f)-1.4,-36); c.closePath(); c.fill();
        c.fillStyle=D('#c8302a'); c.beginPath(); c.moveTo(3.8,-46.4); for(let y=-45;y<=-35;y+=1) c.lineTo(sideFront(y,f)+.3,y); c.lineTo(sideFront(-35,f)-.7,-35); c.lineTo(sideFront(-44,f)-.6,-44.6); c.closePath(); c.fill();
        c.fillStyle=dk; c.beginPath(); c.moveTo(2.4,-47.4); c.lineTo(sideFront(-36,f)-1.2,-35.2); c.lineTo(sideFront(-36,f)-2.4,-35); c.lineTo(1.2,-44); c.closePath(); c.fill();
        buttons(c,f,1.4,[-29.4,-25.6],D('#c8c8d0'),.5); pocket(c,-.6,-27.4,3.6,.9,dk,dk); }); },
    fishsuit(c,lk,D,f,t){ const col=D(H(lk,'#3aa8a0')), dk=D(sh(H(lk,'#3aa8a0'),.3)), bel=D('#f4ecd8');
      // a dorsal fin along the back and a tail at the bottom, so the costume reads from the side
      c.fillStyle=dk; c.beginPath(); c.moveTo(-6.6,-46); c.quadraticCurveTo(-11+Math.sin(t*3)*.4,-44,-11.4,-38); c.quadraticCurveTo(-9,-36.8,-7.4,-34); c.closePath(); c.fill();
      c.beginPath(); c.moveTo(-6,-21.2); c.quadraticCurveTo(-9.6,-20.6,-12.2,-21.6+Math.sin(t*4)*.6); c.quadraticCurveTo(-11.2,-18,-12.8,-14+Math.sin(t*4)); c.quadraticCurveTo(-9.4,-15.6,-6,-15.4); c.closePath(); c.fill(); /* 0.3.6: the tail grows out of the costume's back */
      c.fillStyle=col; sideCoatPath(c,f,-15); c.fill();
      clipC(c,f,-15,()=>{ c.fillStyle=bel; c.beginPath(); c.ellipse(7,-30,4.4,13,0,0,7); c.fill(); c.strokeStyle=v3rgba(sh(H(lk,'#3aa8a0'),.3),.6); c.lineWidth=.45;
        for(let y=-46,r=0;y<-15;y+=3,r++) for(let x=-9+(r%2)*1.5;x<4;x+=3){ c.beginPath(); c.arc(x,y,1.5,0,Math.PI); c.stroke(); } });
      dot(c,-3.4,-41.4,.6,'rgba(255,255,255,.4)'); },
    hotdog(c,lk,D,f){ const bun=D('#d8a05a'), bunD=D('#b07a3a'), bunL=D('#f0c888'), saus=D('#c8442a'), sausL=D('#e8664a'), mus=D('#f2d23a');
      // seen from the side: the sausage runs top to bottom and peeks out front and back, the near half of the bun wraps your side
      c.fillStyle=saus; c.beginPath(); c.roundRect?c.roundRect(-10.2,-55,20.6,45,8):c.rect(-10.2,-55,20.6,45); c.fill();
      c.fillStyle=sausL; c.beginPath(); c.roundRect?c.roundRect(7.6,-52,1.4,38,.7):c.rect(7.6,-52,1.4,38); c.fill();
      c.strokeStyle=mus; c.lineWidth=1.2; c.lineJoin='round'; c.beginPath(); for(let y=-51,i=0;y<-14;y+=2.6,i++) c.lineTo(8.6+(i%2?1.4:-.4),y); c.stroke();
      c.fillStyle=bun; c.beginPath(); c.moveTo(-7.6,-47); c.bezierCurveTo(-9.4,-38,-9.4,-22,-7.4,-14); c.quadraticCurveTo(-.4,-11.4,6.6,-14); c.bezierCurveTo(8.2,-22,8.2,-38,6.4,-47); c.quadraticCurveTo(-.6,-50.4,-7.6,-47); c.fill();
      c.fillStyle=bunL; c.beginPath(); c.ellipse(-1,-44.6,5.6,1.6,0,0,7); c.fill(); c.fillStyle=bunD; c.beginPath(); c.ellipse(-.4,-15.2,6.4,1.4,0,0,7); c.fill();
      c.fillStyle='rgba(255,240,210,.22)'; c.beginPath(); c.ellipse(4,-32,1.6,12,0,0,7); c.fill(); c.fillStyle='rgba(120,70,20,.18)'; c.beginPath(); c.ellipse(-6,-32,1.8,13,0,0,7); c.fill();
      for(const [x,y] of [[-2,-38],[1.6,-33],[-3.4,-27],[2.2,-23],[-.6,-42]]){ c.fillStyle='rgba(250,240,200,.7)'; c.beginPath(); c.ellipse(x,y,.5,.3,.4,0,7); c.fill(); } },
    tuxshirt(c,lk,D,f){ const w=D('#f4f4f2'), k=D('#1a1a20');
      clipT(c,f,()=>{ c.fillStyle=w; c.fillRect(-9,-50,19,28);
        // the printed jacket: lapel and coat down the front, buttons on the shirt line
        c.fillStyle=k; c.beginPath(); c.moveTo(1.4,-47.2); for(let y=-46;y<=-23.6;y+=1.2) c.lineTo(sideFront(y,f)-1.3-(y<-36?(y+36)*-.08:0),y); for(let y=-23.6;y>=-46;y-=1.2) c.lineTo(sideFront(y,f)-4.4,y); c.closePath(); c.fill();
        c.fillStyle='rgba(255,255,255,.18)'; c.beginPath(); c.moveTo(1.6,-46.8); c.lineTo(sideFront(-38,f)-1.6,-38); c.lineTo(sideFront(-38,f)-2.4,-38); c.closePath(); c.fill(); });
      buttons(c,f,.9,[-38,-34,-30],k,.45); const bx=sideFront(-45,f)-.4; c.fillStyle=k; c.beginPath(); c.moveTo(bx,-45.2); c.lineTo(bx-2.2,-46.4); c.lineTo(bx-2.2,-44); c.closePath(); c.fill(); dot(c,bx,-45.2,.6,k); },
    clownsuit(c,lk,D,f){ const col=D(H(lk,'#e8483a')); c.fillStyle=col; sideCoatPath(c,f,-14); c.fill();
      clipC(c,f,-14,()=>{ const cs=['#ffd84a','#5ad8ff','#7aff8a','#ffffff']; for(let i=0;i<24;i++) dot(c,-8+((i*7)%15),-46+((i*11)%30),1.2,D(cs[i%4])); });
      [-40,-34,-28].forEach((y,i)=>dot(c,sideFront(y,f)-.4,y,1.3,D(['#ffffff','#ffd84a','#5ad8ff'][i])));
      c.fillStyle=D('#f4f4f2'); for(let i=0;i<6;i++){ c.beginPath(); c.ellipse(-4.4+i*1.6,-47.4+Math.abs(i-2.6)*.2,1.3,1.1,0,0,7); c.fill(); } },
  }; })();
const _drawOutfit3_side = drawOutfit3;
drawOutfit3 = function(c,lk,D,f,t){ const fn=SIDE_OUT[lk.outfit]; if(fn) return fn(c,lk,D,f,t||0); return _drawOutfit3_side(c,lk,D,f,t); };

// ---------- neckwear: wraps round the neck (seen from the side), hangs at the front of the chest ----------
// the neck spans x -2.1..2.4; its base is at y -45.6. The front arm's shoulder covers roughly x -1.8..3, y -46..-41,
// so anything meant to be seen sits at the throat or on the chest front (x > 3).
const SIDE_NECK=(()=>{
  const dot=(c,x,y,r,cl)=>{ c.fillStyle=cl; c.beginPath(); c.arc(x,y,r,0,7); c.fill(); };
  const band=(c,cl,h,top)=>{ top=top==null?-48.6:top; c.fillStyle=a3Grad(c,top,top+h,cl,.22,.3); c.beginPath(); c.moveTo(-3,top+.6); c.quadraticCurveTo(.4,top-.5,3.5,top+.9); c.lineTo(3.9,top+h+.3); c.quadraticCurveTo(.4,top+h-.2,-3.1,top+h+.4); c.closePath(); c.fill(); };
  // a loop around the neck: the far half passes behind the neck, the near half drapes down to the chest front
  const loopPts=(n,drop)=>{ const out=[]; for(let i=0;i<=n;i++){ const u=i/n, x=-2.8+u*(8.4), y=-47.2+Math.sin(u*Math.PI*.92)*0+u*u*(drop||5.6)-Math.sin(u*Math.PI)*.4; out.push([x+Math.sin(u*Math.PI)*.4,y]); } return out; };
  const pend=(c,drop)=>{ const p=loopPts(1,drop); return p[1]; };
  return {
    scarf(c,D,col,t,sway,id){ const ac=D(col||'#c8553a'), L=id==='longscarf'?17:9, st=id==='stripescarf';
      if(id==='longscarf'){ c.fillStyle=a3Grad(c,-48,-30,D(mix(col||'#c8553a','#000000',.18)),.1,.3); c.beginPath(); c.moveTo(-2.6,-47.6); c.quadraticCurveTo(-7-sway,-42,-9.6-sway*1.5,-33.6); c.lineTo(-7.4-sway*1.5,-33); c.quadraticCurveTo(-5-sway,-41,-1.4,-46.4); c.closePath(); c.fill(); }
      band(c,ac,3.8,-49);
      // the tail falls from the knot at the throat down over the chest front
      c.fillStyle=a3Grad(c,-46,-46+L,ac,.15,.3); c.beginPath(); c.moveTo(2.6,-46.4); c.quadraticCurveTo(4.6+sway*.3,-46+L*.5,4.4+sway,-45.6+L); c.lineTo(6.6+sway,-45.9+L); c.quadraticCurveTo(6.4+sway*.3,-46+L*.5,4.6,-46.8); c.closePath(); c.fill();
      c.fillStyle=a3Grad(c,-47.6,-44.2,ac,.25,.3); c.beginPath(); c.ellipse(3.8,-46.2,1.7,1.6,.2,0,7); c.fill();
      c.strokeStyle=D('#f4ece0'); c.lineWidth=.32; c.beginPath(); for(let i=0;i<4;i++){ c.moveTo(4.6+sway+i*.6,-45.7+L); c.lineTo(4.6+sway+i*.6,-44.3+L); } c.stroke();
      if(st){ c.save(); c.beginPath(); c.moveTo(-3,-48.4); c.lineTo(3.6,-48.2); c.lineTo(3.9,-45.1); c.lineTo(-3.1,-44.6); c.closePath(); c.moveTo(2.6,-46.4); c.lineTo(4.4+sway,-45.6+L); c.lineTo(6.6+sway,-45.9+L); c.lineTo(4.6,-46.8); c.closePath(); c.clip(); c.fillStyle=D('#f4ece0'); for(let y=-49;y<-44+L;y+=2.2) c.fillRect(-4,y,12+sway,.9); for(let x=-3;x<4;x+=2.2) c.fillRect(x,-49,.9,4.6); c.restore(); } },
    cowl(c,D,col){ const ac=D(col||'#c8553a'), dk=D(mix(col||'#c8553a','#000000',.28)); band(c,ac,4.8,-50.2); c.strokeStyle=dk; c.lineWidth=.3; for(let x=-2.4;x<=3.4;x+=1.2){ c.beginPath(); c.moveTo(x,-50); c.quadraticCurveTo(x+.5,-47.6,x+.2,-45.2); c.stroke(); } },
    bandana(c,D,col){ const ac=D(col||'#c8553a'); band(c,ac,2.4,-48.6); c.fillStyle=a3Grad(c,-47,-41,ac,.15,.3); c.beginPath(); c.moveTo(.6,-46.6); c.quadraticCurveTo(3.6,-47.2,4.4,-46.4); c.quadraticCurveTo(6,-44,5.2,-41.6); c.quadraticCurveTo(3,-43,.6,-46.6); c.fill();
      for(let i=0;i<4;i++) dot(c,2.6+i*.7,-45.6+(i%2)*1.2,.28,D('#f4f0e8')); c.fillStyle=ac; c.beginPath(); c.moveTo(-3,-47.8); c.lineTo(-4.8,-46.4); c.lineTo(-3.6,-46); c.closePath(); c.fill(); },
    bowtie(c,D,col){ const ac=D(col||'#c8553a'), dk=D(mix(col||'#c8553a','#000000',.28)); band(c,D('#f4f4f2'),1.6,-47.6);
      // seen from the side: one wing reaching back along the collar, a little of the other peeking past the knot
      c.fillStyle=ac; c.beginPath(); c.moveTo(3.8,-45.6); c.lineTo(1.4,-47.2); c.quadraticCurveTo(.8,-45.6,1.4,-44); c.closePath(); c.fill(); c.fillStyle=dk; c.beginPath(); c.moveTo(3.8,-45.6); c.lineTo(5.2,-46.8); c.lineTo(5.2,-44.4); c.closePath(); c.fill(); dot(c,3.8,-45.6,.75,dk); },
    tie(c,D,col){ const ac=D(col||'#c8553a'), dk=D(mix(col||'#c8553a','#000000',.28)); band(c,D('#f4f4f2'),1.6,-47.6);
      const p=[[3.4,-45.8],[5,-43.4],[6.3,-40],[6.8,-36.4],[6.8,-32.6]]; c.fillStyle=a3Grad(c,-46,-31,ac,.15,.25); c.beginPath(); c.moveTo(p[0][0],p[0][1]); for(const [x,y] of p) c.lineTo(x+.8,y); c.lineTo(6.9,-31.2); for(let i=p.length-1;i>=0;i--) c.lineTo(p[i][0]-.7,p[i][1]); c.closePath(); c.fill();
      c.fillStyle=dk; c.beginPath(); c.moveTo(2.8,-46.6); c.lineTo(4.6,-46.2); c.lineTo(4.2,-44.4); c.lineTo(3,-44.8); c.closePath(); c.fill(); c.strokeStyle=dk; c.lineWidth=.28; for(let k=1;k<4;k++){ c.beginPath(); c.moveTo(p[k][0]-.6,p[k][1]+.6); c.lineTo(p[k][0]+.8,p[k][1]-.4); c.stroke(); } },
    lei(c,D,col){ const cs=['#ff6a8a','#ffd84a','#ff9a3a','#e86ad8'], P=loopPts(10,6.4); P.forEach(([x,y],i)=>{ dot(c,x,y,1.2,D(cs[i%4])); dot(c,x,y,.38,D('#fff4c0')); }); },
    boa(c,D,col,t,sway){ const ac=D(col||'#c8553a'), lt=D(mix(col||'#c8553a','#ffffff',.25)), P=loopPts(12,6); P.forEach(([x,y],i)=>dot(c,x,y,1.5,i%3===1?lt:ac)); for(let i=0;i<5;i++) dot(c,6+sway*.3+i*.1,-40+i*1.6,1.3,i%2?lt:ac); },
    chain(c,D,id){ const big=id==='goldchain', P=loopPts(10,big?6.6:5.4); c.strokeStyle=D(big?'#e8b830':'#d8c8a0'); c.lineWidth=big?.9:.4; c.beginPath(); P.forEach(([x,y],i)=>i?c.lineTo(x,y):c.moveTo(x,y)); c.stroke(); const end=P[P.length-1];
      if(id==='pearls') P.forEach(([x,y],i)=>{ if(i) dot(c,x,y,.6,D('#f8f4ee')); });
      if(id==='shells') for(const k of [5,7,9]){ const [x,y]=P[k]; c.fillStyle=D('#f4d8c0'); c.beginPath(); c.moveTo(x,y+1.3); c.lineTo(x-1,y-.3); c.quadraticCurveTo(x,y-1.1,x+1,y-.3); c.closePath(); c.fill(); }
      if(big){ c.fillStyle=a3Grad(c,end[1],end[1]+4,D('#ffd84a'),.4,.3); c.beginPath(); c.arc(end[0]+.4,end[1]+1.8,1.9,0,7); c.fill(); c.fillStyle=D('#a87a18'); c.font='bold 2.6px sans-serif'; c.textAlign='center'; c.fillText('$',end[0]+.4,end[1]+2.7); } },
    medal(c,D){ const P=loopPts(8,5.6), e=P[P.length-1]; c.strokeStyle=D('#2a5ad8'); c.lineWidth=.9; c.beginPath(); P.forEach(([x,y],i)=>i?c.lineTo(x,y):c.moveTo(x,y)); c.stroke(); c.fillStyle=a3Grad(c,e[1],e[1]+4,D('#ffd84a'),.4,.3); c.beginPath(); c.arc(e[0]+.3,e[1]+1.8,1.8,0,7); c.fill(); dot(c,e[0]+.3,e[1]+1.8,1,D('#c8961e')); },
    whistle(c,D){ const P=loopPts(8,5.4), e=P[P.length-1]; c.strokeStyle=D('#e83a3a'); c.lineWidth=.4; c.beginPath(); P.forEach(([x,y],i)=>i?c.lineTo(x,y):c.moveTo(x,y)); c.stroke(); c.fillStyle=D('#c8ccd4'); c.beginPath(); c.ellipse(e[0]+.6,e[1]+1,1.3,.85,0,0,7); c.fill(); c.fillRect(e[0]+1.2,e[1]+.4,1.6,.8); },
    ascot(c,D,col){ const ac=D(col||'#c8553a'); band(c,ac,2.4,-48.4); c.fillStyle=a3Grad(c,-47,-40,ac,.2,.3); c.beginPath(); c.moveTo(2.4,-46.6); c.quadraticCurveTo(3,-42.6,5.6,-40.6); c.quadraticCurveTo(6.6,-43.6,4.6,-46.8); c.closePath(); c.fill(); dot(c,4.6,-44,.4,D('#ffd84a')); },
    fishneck(c,D,col,t,sway){ const P=loopPts(8,5.2), e=P[P.length-1]; c.strokeStyle=D('#e8e0c8'); c.lineWidth=.35; c.beginPath(); P.forEach(([x,y],i)=>i?c.lineTo(x,y):c.moveTo(x,y)); c.stroke();
      c.save(); c.translate(e[0]+.8+sway*.2,e[1]+1.6); c.rotate(.15+sway*.04); c.fillStyle=a3Grad(c,-1.5,1.5,D('#8ac8e8'),.3,.3); c.beginPath(); c.ellipse(0,0,2.6,1.3,0,0,7); c.fill(); c.beginPath(); c.moveTo(-2.2,0); c.lineTo(-3.8,-1.2); c.lineTo(-3.8,1.2); c.closePath(); c.fill(); dot(c,1.4,-.3,.32,'#14141a'); c.restore(); },
  }; })();
const _a3Neck_side = a3Neck;
a3Neck = function(c,id,D,col,t,w,lean){ if(!id||id==='none') return; const sway=Math.sin(t*1.8)*.5-(lean||0)*5, N=SIDE_NECK;
  switch(id){ case 'scarf': case 'stripescarf': case 'longscarf': return N.scarf(c,D,col,t,sway,id);
    case 'cowl': case 'bandana': case 'bowtie': case 'tie': case 'lei': case 'ascot': return N[id](c,D,col,t,sway);
    case 'boa': case 'fishneck': return N[id](c,D,col,t,sway);
    case 'shells': case 'pearls': case 'goldchain': return N.chain(c,D,id);
    case 'medal': case 'whistle': return N[id](c,D);
  } return _a3Neck_side(c,id,D,col,t,w,lean); };

// ---------- things that sit over the front shoulder (drawn after the front arm) ----------
// shoulder joint: (0.8*w, -44) with radius ~2.5
function a3OverArm(c,lk,D,B,t){ const w=B.w, o=lk.outfit;
  if(o==='captain'){ const gold=D('#f2c84a'); c.fillStyle=gold; c.beginPath(); c.ellipse(.5*w,-48,2.6*w,.9,0,0,7); c.fill(); for(let k=0;k<5;k++) c.fillRect(.5*w-2*w+k*w,-47.5,.45,1.6); }
  if(o==='overalls'){ const den=D(lk.outCol&&lk.outCol!=='#d8a020'?lk.outCol:'#3a6f9a'); c.strokeStyle=den; c.lineWidth=1.7; c.beginPath(); c.moveTo(2.4,-38.4); c.quadraticCurveTo(3.2,-45.2,.6*w,-46.8); c.quadraticCurveTo(-2.4*w,-47.2,-3.4*w,-46.6); c.stroke(); }
  if(o==='lifejacket'){ c.strokeStyle=D(lk.outCol&&lk.outCol!=='#d8a020'?lk.outCol:'#ff7a2a'); c.lineWidth=2; c.beginPath(); c.moveTo(3,-41); c.quadraticCurveTo(2.6,-46.6,.4*w,-47); c.quadraticCurveTo(-2.2*w,-47.2,-3.2*w,-45.6); c.stroke(); }
  const bk=lk.back; if(['backpack','tacklepack','plushpack','sharkfin','guitar'].includes(bk)){ const cl=D(mix(bk==='plushpack'?'#5aa8c8':bk==='sharkfin'?'#3a4450':(lk.accCol||'#c8553a'),'#000000',.35));
    c.strokeStyle=cl; c.lineWidth=1.3; c.beginPath(); c.moveTo(-3*w,-46.4); c.quadraticCurveTo(.8*w,-48,2.8*w,-44.6); c.quadraticCurveTo(3.4*w,-42,2.6*w,-39.6); c.stroke(); }
}

// ---------- face options: nose, brows, resting mouth (moods keep their own mouths) ----------
function a3Nose(c,id,sk,skD){ const hi='rgba(255,248,236,.5)';
  switch(id){
    case 'small': c.fillStyle=sk; c.beginPath(); c.ellipse(7.35,-55.3,.95,.85,0,0,7); c.fill(); c.strokeStyle=skD; c.lineWidth=.35; c.beginPath(); c.arc(7.25,-55.1,.75,0,1.7); c.stroke(); break;
    case 'straight': c.fillStyle=sk; c.beginPath(); c.moveTo(6.9,-57.8); c.quadraticCurveTo(7.6,-56.6,8.4,-55); c.quadraticCurveTo(8.3,-54.4,7.4,-54.4); c.lineTo(6.9,-54.6); c.closePath(); c.fill(); c.strokeStyle=skD; c.lineWidth=.35; c.beginPath(); c.moveTo(7.9,-54.7); c.quadraticCurveTo(7.4,-54.5,7.1,-54.9); c.stroke(); break;
    case 'pointed': c.fillStyle=sk; c.beginPath(); c.moveTo(6.9,-57.4); c.quadraticCurveTo(7.8,-56.2,8.9,-55.3); c.quadraticCurveTo(8.4,-54.5,7.3,-54.5); c.lineTo(6.9,-54.8); c.closePath(); c.fill(); c.strokeStyle=skD; c.lineWidth=.35; c.beginPath(); c.moveTo(8.1,-54.8); c.quadraticCurveTo(7.6,-54.6,7.2,-55); c.stroke(); break;
    case 'round': c.fillStyle=sk; c.beginPath(); c.ellipse(7.7,-55.3,1.75,1.5,0,0,7); c.fill(); c.strokeStyle=skD; c.lineWidth=.45; c.beginPath(); c.arc(7.5,-55,1.3,-.2,1.8); c.stroke(); c.fillStyle=hi; c.beginPath(); c.arc(8,-56,.5,0,7); c.fill(); break;
    default: c.fillStyle=sk; c.beginPath(); c.ellipse(7.5,-55.4,1.45,1.25,0,0,7); c.fill(); c.strokeStyle=skD; c.lineWidth=.45; c.beginPath(); c.arc(7.3,-55.1,1.1,-.2,1.8); c.stroke(); c.fillStyle=hi; c.beginPath(); c.arc(7.7,-55.9,.45,0,7); c.fill(); } }
function a3Brow(c,id,col,ex,by,mood){ const f=mood==='focus'; c.strokeStyle=col; c.lineCap='round';
  const lw={bold:1.15,thin:.42}[id]||.75, arch=id==='arched'?.9:id==='straight'?.05:id==='thin'?.4:.45;
  c.lineWidth=lw; c.beginPath(); c.moveTo(ex-1.5,by+.25); c.quadraticCurveTo(ex,by-(f?-.2:arch),ex+1.6,by+(id==='straight'?.25:.15)); c.stroke(); }
function a3Mouth(c,id,D){ c.strokeStyle=D('#7a2e24'); c.fillStyle=D('#7a2e24'); c.lineWidth=.6;
  switch(id){
    case 'calm': c.lineWidth=.5; c.beginPath(); c.moveTo(4.4,-52.8); c.quadraticCurveTo(5.5,-52.6,6.6,-52.9); c.stroke(); break;
    case 'smirk': c.lineWidth=.55; c.beginPath(); c.moveTo(4.3,-52.8); c.quadraticCurveTo(5.6,-52.5,6.8,-53.6); c.stroke(); break;
    case 'grin': c.beginPath(); c.moveTo(4,-53.1); c.quadraticCurveTo(5.4,-51.4,6.8,-53.2); c.quadraticCurveTo(5.4,-52.5,4,-53.1); c.fill(); c.fillStyle='#ffffff'; c.fillRect(4.6,-53,1.7,.38); break;
    default: c.beginPath(); c.moveTo(4.1,-53); c.quadraticCurveTo(5.4,-52,6.7,-53.1); c.stroke(); } }

// ---------- shoes: centred on the ankle and as wide as the leg, trousers tucked into tall boots, a colour of your own ----------
var A3LW=1, A3SHOE="boots";
var SHOE_TALL=new Set(['wellies','hightops','hiking','cowboyb','moonboots','astrob','snowboots','combat','pirateb','rollers','heeled','tidetreads']);
// each shoe's main colour (the part a chosen shoe colour replaces); accents, soles and laces keep their own
const SHOE_MAIN={boots:'#33241a',sneakers:'#e8e8ee',glowkicks:'#2a2a3a',hightops:'#2a4a8a',wellies:'#f2c230',hiking:'#6a4a2a',cowboyb:'#8a5a2a',loafers:'#4a2418',brogues:'#8a5428',clogs:'#4ab89a',slippers:'#f4e8f0',moonboots:'#c8443a',astrob:'#e8ecf0',snowboots:'#5a3a24',combat:'#1e1e22',pirateb:'#18121a',rollers:'#f4f0ec',heeled:'#5a1a2a',clownshoes:'#e0302a',fishfeet:'#5ab8d8',ducky:'#ff9a2a',flippers:'#2ad8a8',sandals:'#6a4428',socksand:'#6a4428',flipflops:'#2a8ad8',tidetreads:'#2a8a9a'};
const SHOE_NOCOL=new Set(['barefoot','geta']);
const _a3Shoe_side = a3Shoe;
a3Shoe = function(c,id,bx,dark,D,sk,t,col){ const ax=bx+.2, s=Math.max(1,A3LW), main=SHOE_MAIN[id||'boots'];
  if(col===undefined && id===A3SHOE) col=A3SHOECOL;
  let D2=D; if(col && main && !SHOE_NOCOL.has(id)){ const m=String(main).toLowerCase(), md=mix(main,'#000000',.25), cd=mix(col,'#000000',.25); D2=cl=>{ const k=String(cl).toLowerCase(); return k===m?D(col):k===String(md).toLowerCase()?D(cd):D(cl); }; }
  c.save(); c.translate(ax,0); c.scale(s,1);
  if(id==='slippers'&&dark){ // the far slipper: the same soft pink, only a touch shaded (it used to turn grey)
    _a3Shoe_side(c,id,.7,false,D2,sk,t); c.fillStyle='rgba(90,40,70,.16)'; c.beginPath(); c.ellipse(2.3,-2.4,5,2.8,0,0,7); c.fill(); }
  else _a3Shoe_side(c,id,.7,dark,D2,sk,t);
  c.restore(); };
var A3SHOECOL=null;
// how high each low shoe's opening is, so the trouser hem sits right on it (tall boots tuck the trousers in)
var SHOE_TOPY={boots:5.2,sneakers:4.3,glowkicks:4.3,loafers:3.4,brogues:3.4,clogs:4.5,slippers:4.6,sandals:4.6,socksand:5.8,flipflops:4.4,barefoot:4.4,geta:4.2,flippers:4.4,ducky:4.6,fishfeet:4.4,clownshoes:5.2};

// ---------- hat previews (shop, Wardrobe, Boardwalk, Tide Pass): the real angler's head wearing the hat ----------
const HATPV=new Map();
hatPreview = function(c,w,h,id,col,big){ const fixed=HATI[id]&&HATI[id].fixed, hc=fixed?'#888888':col, L=S.look;
  const key=[id,hc,w,h,L.skin,L.hair,L.hairStyle,L.g,L.eye|0,L.nose,L.brows,L.mouth,L.blush,L.beard,big?1:0].join('|');
  let cv=HATPV.get(key);
  if(!cv){ cv=document.createElement('canvas'); cv.width=w*2; cv.height=h*2; const x=cv.getContext('2d'); x.scale(2,2);
    const s=h/(big?44:42), lk=Object.assign({},L,{hat:id,hatCol:hc,outfit:'none',neck:'none',back:'none',glasses:'none'});
    drawAngler3(x,w*.42,h*.7+56.6*s,s,lk,{t:1.3});
    if(HATPV.size>400) HATPV.clear(); HATPV.set(key,cv); }
  c.drawImage(cv,0,0,w,h); if(big) sparkles(c,w,h,5); };

// ---------- bucket hat, redrawn: a tapered crown with a flat top, a band, and a short brim sloping down all round ----------
// hat units: origin near the head centre, head radius 7.5, eye centre at y +0.4 (eye top -0.95): the brim stays above it
const _drawHat_side = drawHat;
drawHat = function(c,id,col,t){ if(id!=='bucket'||(typeof HAT_TRIM_OFF!=='undefined'&&HAT_TRIM_OFF)) return _drawHat_side(c,id,col,t);
  const dk=mix(col,'#000000',.28), dk2=mix(col,'#000000',.42), lt=mix(col,'#ffffff',.22), gr=(y0,y1,a,b)=>{ const g=c.createLinearGradient(0,y0,0,y1); g.addColorStop(0,a); g.addColorStop(1,b); return g; };
  c.save(); c.lineJoin='round';
  // brim (behind the crown at the back, in front at the front): a sloping skirt
  c.fillStyle=gr(-4,1,col,dk); c.beginPath(); c.moveTo(-7.9,-3.6); c.quadraticCurveTo(0,-4.6,8.1,-3.6); c.quadraticCurveTo(9.8,-2.8,10.6,-1.7); c.quadraticCurveTo(5,-1.6,0,-.2); c.quadraticCurveTo(-6,.9,-10.9,.7); c.quadraticCurveTo(-9.8,-1.6,-7.9,-3.6); c.closePath(); c.fill();
  c.strokeStyle=v3rgba(lt,.55); c.lineWidth=.35; c.setLineDash([.7,.55]); c.beginPath(); c.moveTo(9.4,-2.4); c.quadraticCurveTo(4.6,-2.3,0,-1.1); c.quadraticCurveTo(-5.6,-.1,-9.8,-.2); c.stroke(); c.beginPath(); c.moveTo(8.8,-3); c.quadraticCurveTo(4.4,-3.1,0,-2.2); c.quadraticCurveTo(-5.2,-1.2,-9,-1.3); c.stroke(); c.setLineDash([]);
  // crown: slightly tapered, flat top with soft corners
  c.fillStyle=gr(-12,-3,lt,col); c.beginPath(); c.moveTo(-7.3,-3.6); c.lineTo(-6.4,-10.4); c.quadraticCurveTo(-6.1,-11.9,-4.6,-11.9); c.lineTo(4.9,-11.9); c.quadraticCurveTo(6.4,-11.9,6.7,-10.4); c.lineTo(7.6,-3.6); c.quadraticCurveTo(0,-4.6,-7.3,-3.6); c.closePath(); c.fill();
  c.fillStyle=v3rgba(dk2,.25); c.beginPath(); c.moveTo(-7.3,-3.6); c.lineTo(-6.4,-10.4); c.quadraticCurveTo(-6.1,-11.9,-4.6,-11.9); c.lineTo(-3.4,-11.9); c.lineTo(-4.4,-3.9); c.closePath(); c.fill();
  c.strokeStyle=v3rgba(dk,.6); c.lineWidth=.35; c.beginPath(); c.moveTo(-1,-11.9); c.quadraticCurveTo(-1.6,-7.6,-1.4,-4.2); c.moveTo(3.4,-11.9); c.quadraticCurveTo(3.8,-7.6,3.6,-4.2); c.stroke();
  // band and a couple of air holes
  c.fillStyle=dk; c.beginPath(); c.moveTo(-7.2,-4.2); c.quadraticCurveTo(0,-5.2,7.5,-4.2); c.lineTo(7.3,-5.9); c.quadraticCurveTo(0,-6.9,-7,-5.9); c.closePath(); c.fill();
  c.fillStyle=dk2; for(const x of [4.6,5.9]){ c.beginPath(); c.arc(x,-8.4,.35,0,7); c.fill(); }
  c.fillStyle='rgba(255,255,255,.18)'; c.beginPath(); c.moveTo(-2.4,-11.7); c.lineTo(4.4,-11.7); c.lineTo(4.2,-11.1); c.lineTo(-2.4,-11.1); c.closePath(); c.fill();
  c.restore(); };

// ---------- sport visor (glasses): a curved wraparound lens following the face, thin frame, arm to the ear ----------
const _drawFace_side = drawFace;
drawFace = function(c,lk,D,hair){ if(lk.glasses!=='visor') return _drawFace_side(c,lk,D,hair);
  _drawFace_side(c,Object.assign({},lk,{glasses:'none'}),D,hair); const ey=-57;
  c.save(); const lens=()=>{ c.beginPath(); c.moveTo(1.9,ey-1.5); c.quadraticCurveTo(5,ey-2.2,7.8,ey-1.4); c.quadraticCurveTo(8.3,ey+.1,7.4,ey+1.3); c.quadraticCurveTo(5.2,ey+2.1,2.5,ey+1.2); c.quadraticCurveTo(1.6,ey,1.9,ey-1.5); c.closePath(); };
  const g1=c.createLinearGradient(2,0,8,0); g1.addColorStop(0,'rgba(40,90,160,.55)'); g1.addColorStop(.6,'rgba(60,170,240,.62)'); g1.addColorStop(1,'rgba(170,110,255,.65)'); c.fillStyle=g1; lens(); c.fill();
  c.save(); lens(); c.clip(); c.fillStyle='rgba(255,255,255,.55)'; c.beginPath(); c.moveTo(3.6,ey-1.8); c.lineTo(5.2,ey-1.8); c.lineTo(3.4,ey+2); c.lineTo(2.4,ey+2); c.closePath(); c.fill(); c.restore();
  c.strokeStyle=D('#2a2e38'); c.lineWidth=.45; c.beginPath(); c.moveTo(1.9,ey-1.5); c.quadraticCurveTo(5,ey-2.2,7.8,ey-1.4); c.stroke();
  c.lineWidth=.5; c.beginPath(); c.moveTo(1.9,ey-1.2); c.quadraticCurveTo(.4,ey-1.2,-1.2,ey-.6); c.stroke(); c.restore(); };

// ---------- capes with a little life: they flare out behind, the hem ripples, and the wind (and weather) moves them ----------
function capeWind(t){ let k=.35; try{ const wx=weather().k; k+=(wx==='Storm'?1.1:wx==='Rain'?.55:wx==='Fog'?.1:0)*(typeof WXA==='number'?WXA:1); }catch(e){} return k; }
const _a3Back_side = a3Back;
a3Back = function(c,id,D,col,t,w,lean,st){ if(!['cape','royalcape','tatteredcape','starcape'].includes(id)) return _a3Back_side(c,id,D,col,t,w,lean,st);
  const len=id==='royalcape'?42:id==='tatteredcape'?34:36, W0=capeWind(t), gust=W0*(.7+.3*Math.sin(t*.9)+.25*Math.sin(t*2.3+1)), mv=-(lean||0)*14;
  const flare=Math.max(2,6+gust*5+mv), flut=(.5+gust*.9), sp=2.4+gust*2.2, y0=-47.2, yb=y0+len, ragged=id==='tatteredcape';
  const cl=id==='starcape'?D('#1a1a4a'):ragged?D(mix(col||'#5a4a3a','#2a2a2a',.4)):D(col||'#c8553a'), lining=id==='starcape'?D('#3a2a7a'):id==='royalcape'?D('#f4f0ea'):D(mix(col||'#c8553a','#000000',.4));
  // the back edge sweeps out and down, the hem is a travelling wave, the front edge hides behind the body
  const hemPts=[]; const N=10, bx0=-6.4*w-flare, bx1=1*w; for(let i=0;i<=N;i++){ const u=i/N, x=bx0+(bx1-bx0)*u, y=yb-u*len*.1+Math.sin(u*5.2-t*sp)*flut*(1-u*.6)+(ragged&&i%2?-2.2:0); hemPts.push([x,y]); }
  const shape=()=>{ c.beginPath(); c.moveTo(-4.4*w,y0); c.bezierCurveTo(-8*w-flare*.25,y0+len*.18,-7.6*w-flare*.8,y0+len*.6,hemPts[0][0],hemPts[0][1]); for(const [x,y] of hemPts) c.lineTo(x,y); c.lineTo(1.6*w,y0+len*.5); c.lineTo(3.6*w,-46.8); c.closePath(); };
  // a sliver of lining shows where the hem lifts
  c.fillStyle=lining; c.beginPath(); c.moveTo(hemPts[0][0],hemPts[0][1]); for(const [x,y] of hemPts) c.lineTo(x,y-1.1-flut*.5); for(let i=hemPts.length-1;i>=0;i--) c.lineTo(hemPts[i][0],hemPts[i][1]); c.closePath(); c.fill();
  const gr=c.createLinearGradient(-8*w-flare,0,2*w,0); gr.addColorStop(0,mix(cl,'#000000',.32)); gr.addColorStop(.55,cl); gr.addColorStop(1,mix(cl,'#fff2dc',.12)); c.fillStyle=gr; shape(); c.fill();
  // folds that follow the billow and move with it
  c.save(); shape(); c.clip(); c.strokeStyle='rgba(0,0,0,.2)'; c.lineWidth=.6; for(let k=1;k<4;k++){ const f=k/4, hx=hemPts[Math.round(f*N)]; c.beginPath(); c.moveTo(-4.4*w+f*3*w,y0+1); c.quadraticCurveTo(-6*w-flare*.5*(1-f)+f*3,y0+len*.5,hx[0],hx[1]); c.stroke(); }
  c.strokeStyle='rgba(255,240,220,.12)'; c.lineWidth=.9; c.beginPath(); c.moveTo(-5*w,y0+2); c.bezierCurveTo(-7.4*w-flare*.2,y0+len*.25,-7*w-flare*.7,y0+len*.6,hemPts[0][0]+.6,hemPts[0][1]-1); c.stroke();
  if(id==='starcape'){ for(let i=0;i<26;i++){ const u=((i*37)%23)/23, v=((i*53)%19)/19, x=-4*w+(bx0+4*w)*u*.9+v*4, y=y0+3+v*(len-6); c.globalAlpha=.45+.5*Math.sin(t*2+i); c.fillStyle='#fff8d0'; c.beginPath(); c.arc(x,y,.35+(i%3)*.15,0,7); c.fill(); } c.globalAlpha=1; }
  if(id==='royalcape'){ c.fillStyle=D('#d8a830'); c.fillRect(-12*w-flare,yb-3.6,20*w+flare,.8); }
  c.restore();
  if(id==='royalcape'){ c.fillStyle=D('#f4f0ea'); c.beginPath(); c.ellipse(-1.4*w,-46.8,6.6*w,2.6,0,0,7); c.fill(); for(let i=0;i<6;i++){ c.fillStyle=D('#1a1a1a'); c.beginPath(); c.arc(-5.6*w+i*2*w,-46.4+(i%2)*.6,.35,0,7); c.fill(); } } };

// head centre (0,-56), radius 7.5, face to the right; the hairline sits above the brow and runs behind the ear
// ---------- side-view proportions: a narrower body front to back, and a real shoulder for the arm ----------
var SIDE_K=.84;
function a3Deltoid(c,sh,el,w,col,fabs){ const r=w*.6, cx=sh.x-.1, cy=sh.y-.15, a=Math.atan2(el.y-sh.y,el.x-sh.x);
  const path=()=>{ c.beginPath(); c.ellipse(cx,cy,r*1.08,r,a,0,7); };
  const gr=c.createLinearGradient(cx-r,cy-r,cx+r,cy+r); gr.addColorStop(0,mix(col,'#fff4e2',.16)); gr.addColorStop(.55,col); gr.addColorStop(1,mix(col,'#000000',.22)); c.fillStyle=gr; path(); c.fill();
  if(fabs&&fabs.length){ c.save(); path(); c.clip(); for(const f of fabs) drawFabric(c,f,null,cx-r*1.4,cy-r*1.4,r*2.8,r*2.8); c.restore(); }
  c.save(); path(); c.clip(); c.strokeStyle='rgba(255,244,226,.28)'; c.lineWidth=.6; c.beginPath(); c.arc(cx,cy,r*.82,Math.PI*1.1,Math.PI*1.7); c.stroke(); c.restore(); }

// ---------- curly hair (0.3.3, from the director's reference): a full round mass with a bumpy outline of small curls,
// packed with spiral curls shaded darker underneath and lit on top; it frames the face, falls to the jaw behind,
// and the ear stays visible in front of it. Head centre (0,-56), radius 7.5, face to the right.
var A3SKIN=null;
function curlMass(c){ c.beginPath(); c.moveTo(6.8,-60.2); c.bezierCurveTo(8.6,-64.4,6.4,-69.4,0,-69.6); c.bezierCurveTo(-6.4,-69.8,-9.8,-65.4,-9.8,-59.6); c.bezierCurveTo(-9.8,-54.6,-8.6,-50.8,-6,-49.4); c.bezierCurveTo(-3.6,-49.6,-1.6,-50.6,-.6,-52.6); c.bezierCurveTo(.2,-55,0,-57,1.2,-58.4); c.bezierCurveTo(2.8,-59.8,4.8,-59.6,6.8,-60.2); c.closePath(); }
// curl positions inside the mass: an irregular scatter (sizes, spacing and spiral angles vary, like real curls)
const CURL_CELLS=(()=>{ const out=[]; let s=7; const rnd=()=>{ s=(s*16807)%2147483647; return s/2147483647; }; for(let y=-68.8;y<=-50;y+=2.05) for(let x=-9.6;x<=7.6;x+=2.15){ if(rnd()<.12) continue; out.push([x+(rnd()-.5)*1.5,y+(rnd()-.5)*1.3,1.0+rnd()*.7,rnd()*Math.PI*2]); } return out; })();
// points along the outline, for the little curls that make its edge bumpy
const CURL_EDGE=(()=>{ const pts=[], ctrl=[[6.8,-60.2],[7.9,-62.6],[7.6,-65.4],[5.6,-67.9],[2.8,-69.3],[0,-69.6],[-3,-69.4],[-5.8,-68.3],[-8,-66.2],[-9.4,-63.2],[-9.8,-59.6],[-9.6,-56.2],[-9,-53.2],[-7.8,-50.8],[-6,-49.4],[-3.8,-49.6]]; for(let i=0;i<ctrl.length-1;i++){ const [x0,y0]=ctrl[i],[x1,y1]=ctrl[i+1], n=Math.max(1,Math.round(Math.hypot(x1-x0,y1-y0)/1.5)); for(let k=0;k<n;k++){ const u=k/n; pts.push([x0+(x1-x0)*u,y0+(y1-y0)*u]); } } return pts; })();
function a3EarOver(){ if(!A3SKIN) return null; return A3SKIN; }
function drawEar3(c){ const s=a3EarOver(); if(!s) return; const [sk,skD]=s; c.fillStyle=sk; c.beginPath(); c.ellipse(-1.8,-55.4,1.8,2.3,0,0,7); c.fill(); c.fillStyle=skD; c.beginPath(); c.ellipse(-1.6,-55.3,.85,1.25,0,0,7); c.fill(); c.fillStyle='rgba(255,240,225,.3)'; c.beginPath(); c.ellipse(-2.4,-56.2,.5,.9,0,0,7); c.fill(); }

// ---------- CURLY (director's reference, right-hand image): loose tousled curls. A full mass whose edge breaks into
// curled, pointed flicks, with swooping crescent locks inside, a curl dropping over the temple, falling to the jaw behind.
const CURLY_TIPS=(()=>{ const out=[], E=CURL_EDGE; for(let i=0;i<E.length;i+=1){ const p=E[i], q=E[Math.min(E.length-1,i+1)], o=E[Math.max(0,i-1)], tx=q[0]-o[0], ty=q[1]-o[1], L=Math.hypot(tx,ty)||1; out.push([p[0],p[1],-ty/L,tx/L,1.3+((i*7)%4)*.32,(i%3)?1:-1]); /* outward normal */ } return out; })();
// loose locks inside the curly mass: fewer and bigger than the coil grid, kept inside the outline
const CURLY_LOCKS=(()=>{ const cv=document.createElement('canvas'), x=cv.getContext('2d'), out=[]; let s=5; const rnd=()=>{ s=(s*16807)%2147483647; return s/2147483647; }; curlMass(x);
  for(let y=-68.6;y<=-51;y+=2.6) for(let X=-9.2;X<=6.8;X+=2.8){ const px=X+(rnd()-.5)*1.4, py=y+(rnd()-.5)*1.2; if(x.isPointInPath(px,py)) out.push([px,py,1.1+rnd()*.5,rnd()*6.28]); } return out; })();
// ---------- COILS (director's reference, left-hand image): tight round coils. Every curl is its own round coil with a
// spiral in it and a dark outline, piled into a dome that falls to the jaw behind.
const COIL_BLOBS=(()=>{ const out=[]; let s=11; const rnd=()=>{ s=(s*16807)%2147483647; return s/2147483647; };
  for(const [x,y] of CURL_EDGE) out.push([x,y,1.55+rnd()*.5,rnd()*6.28]);
  const cv=document.createElement('canvas'), cx=cv.getContext('2d'); curlMass(cx); for(let y=-68.4;y<=-50.6;y+=2.3) for(let x=-8.8;x<=6.6;x+=2.4){ if(rnd()<.06) continue; const px=x+(rnd()-.5)*1.1, py=y+(rnd()-.5)*1; if(cx.isPointInPath(px,py)) out.push([px,py,1.45+rnd()*.55,rnd()*6.28]); } /* only inside the hair outline */
  return out.sort((a,b)=>b[1]-a[1]); })(); // lowest first, so the upper coils overlap the ones below
function drawCoils3(c,hair,hairC,D,t){ const base=D(hairC), dk=D(mix(hairC,'#000000',.48)), dk2=D(mix(hairC,'#000000',.25)), lt=D(mix(hairC,'#ffffff',.3)), lt2=D(mix(hairC,'#ffffff',.55));
  // a dark backing so gaps between coils read as depth, not scalp
  c.fillStyle=dk2; curlMass(c); c.fill(); c.lineCap='round';
  for(const [x,y,r,a] of COIL_BLOBS){
    const g2=c.createRadialGradient(x-r*.35,y-r*.4,r*.1,x,y,r); g2.addColorStop(0,y<-61?lt:D(mix(hairC,'#ffffff',.15))); g2.addColorStop(.7,base); g2.addColorStop(1,D(mix(hairC,'#000000',.18)));
    c.fillStyle=g2; c.beginPath(); c.arc(x,y,r,0,7); c.fill(); c.strokeStyle=dk; c.lineWidth=.32; c.stroke();
    // the spiral: an outer sweep and an inner turn
    c.strokeStyle=v3rgba(dk,.85); c.lineWidth=.38; c.beginPath(); c.arc(x,y,r*.72,a,a+Math.PI*1.45); c.stroke(); c.beginPath(); c.arc(x+Math.cos(a)*r*.18,y+Math.sin(a)*r*.18,r*.38,a+Math.PI,a+Math.PI*2.5); c.stroke();
    c.strokeStyle=v3rgba(y<-61?lt2:lt,.75); c.lineWidth=.32; c.beginPath(); c.arc(x,y,r*.82,Math.PI*1.15,Math.PI*1.65); c.stroke(); }
  drawEar3(c); }

// ---------- CURLY (0.3.3 redesign, per the director's brief): modern, medium-length, slightly messy curls that follow the
// skull. About eleven soft curl clusters (C, S and loose spiral shapes) at irregular sizes and angles, moderate volume on
// top, a couple of curls falling toward the forehead, small tight curls at the temple, a compact back tapering to the
// nape. Three tones per colour (shadow, base, light) and only a soft outline. Head centre (0,-56), radius 7.5.
const CURLY_LOBES=[ // x, y, rx, ry, rotation, curl type
  [-6.3,-52.6,1.6,1.7,-1.4,'S'],[-7.3,-55.8,1.9,2.0,-1.2,'C'],[-7.2,-59.4,2.0,2.1,-1.0,'P'],[-5.9,-62.6,2.4,2.2,-.6,'C'],
  [-3.2,-64.6,2.9,2.2,-.25,'S'],[.1,-65,3.0,2.2,-.05,'C'],[3.2,-64,2.8,2.1,.15,'S'],[-3.4,-60.8,2.4,2.1,.45,'P'],
  [1.2,-61.8,2.3,1.8,.2,'S'],[5.4,-61.5,2.4,1.8,.35,'C'],[.4,-58.6,1.4,1.3,.8,'C'],[6.8,-59.8,1.35,1.25,.7,'C'],
  [-1.9,-57,1.9,2.1,-1,'C'],[-2.4,-54.2,1.6,1.8,-1.2,'S'],[-4.4,-52.2,1.5,1.5,-1.3,'C']]; /* curls fall over the ear */
function curlyCap(c){ c.beginPath(); c.moveTo(6.6,-60.2); c.bezierCurveTo(7.4,-63.6,4.6,-66.4,0,-66.4); c.bezierCurveTo(-4.8,-66.4,-8.2,-63.4,-8.4,-58.6); c.bezierCurveTo(-8.5,-55,-7.8,-52.2,-6.2,-50.8); c.bezierCurveTo(-4.8,-51.2,-3.6,-52,-3.2,-53.2); c.bezierCurveTo(-2.4,-55.8,-1.4,-57.6,.6,-58.6); c.bezierCurveTo(2.6,-59.6,4.6,-59.6,6.6,-60.2); c.closePath(); }
var A3HATON=false;
// under a hat the curls sit tight to the head: only the ones below the brim, pulled in so nothing pokes out around it
function curlyLobes(){ if(!A3HATON) return CURLY_LOBES; return CURLY_LOBES.filter(L=>L[1]>-61.5).map(([x,y,rx,ry,r,ty])=>[x*.86,y+(y<-58?1:0),rx*.8,ry*.8,r,ty]); }
function drawCurly3(c,hair,hairC,D,t){ const LOBES=curlyLobes(), base=D(hairC), shade=D(mix(hairC,'#000000',.3)), light=D(mix(hairC,'#ffffff',.3)), line=D(mix(hairC,'#000000',.45));
  const lobe=(L,grow)=>{ const [x,y,rx,ry,r]=L; c.beginPath(); c.ellipse(x,y,rx+grow,ry+grow,r,0,7); };
  // soft outline: the whole shape a touch larger in the shadow tone, then the base colour over it
  c.fillStyle=shade; curlyBase(c); for(const L of LOBES){ lobe(L,.32); c.fill(); }
  c.fillStyle=base; curlyBase(c); for(const L of LOBES){ lobe(L,0); c.fill(); }
  // each cluster: a shadow under its lower edge, the curl's line, and a light sweep on top
  c.lineCap='round'; c.lineJoin='round';
  for(const [x,y,rx,ry,r,ty] of LOBES){ const s=Math.min(rx,ry), cs=Math.cos(r), sn=Math.sin(r), P=(u,v)=>[x+u*cs-v*sn,y+u*sn+v*cs];
    c.save(); c.beginPath(); c.ellipse(x,y,rx,ry,r,0,7); c.clip();
    c.fillStyle=v3rgba(shade,.7); c.beginPath(); c.ellipse(x+sn*s*.35,y+cs*s*.45,rx*.95,ry*.55,r,0,7); c.fill();
    c.fillStyle=base; c.beginPath(); c.ellipse(x-sn*s*.15,y-cs*s*.2,rx*.86,ry*.72,r,0,7); c.fill();
    c.strokeStyle=v3rgba(line,.75); c.lineWidth=.42; c.beginPath();
    if(ty==='C'){ c.ellipse(x,y,rx*.6,ry*.58,r,Math.PI*.15,Math.PI*1.35); }
    else if(ty==='S'){ const [a1,b1]=P(-rx*.55,ry*.2), [a2,b2]=P(0,-ry*.25), [a3,b3]=P(rx*.55,ry*.15), [m1,n1]=P(-rx*.3,-ry*.55), [m2,n2]=P(rx*.3,ry*.6); c.moveTo(a1,b1); c.quadraticCurveTo(m1,n1,a2,b2); c.quadraticCurveTo(m2,n2,a3,b3); }
    else { c.ellipse(x,y,rx*.62,ry*.6,r,Math.PI*1.0,Math.PI*2.2); c.moveTo(...P(rx*.62*Math.cos(Math.PI*2.2),ry*.6*Math.sin(Math.PI*2.2))); c.ellipse(x+cs*s*.12,y+sn*s*.12,rx*.32,ry*.3,r,Math.PI*.2,Math.PI*1.4); }
    c.stroke();
    c.strokeStyle=v3rgba(light,.85); c.lineWidth=.5; c.beginPath(); c.ellipse(x-sn*s*.08,y-cs*s*.12,rx*.68,ry*.58,r,Math.PI*1.2,Math.PI*1.72); c.stroke();
    c.restore(); }
  }
if(S&&S.look&&S.look.hairStyle==='coils') S.look.hairStyle='curly';

// ---------- spiky hair (0.3.3.1): swept-back tufts that grow out of the scalp along the curve of the head, varied
// in length, each lit on its leading edge; under a hat only the short fringe and sides show ----------
function drawSpiky3(c,hair,hairC,D,t,cap){ cap(); if(A3HATON) return; const base=D(hairC), dk=D(mix(hairC,'#000000',.3)), lt=D(mix(hairC,'#ffffff',.3));
  const tufts=[[1.15,3.2],[1.28,4.4],[1.42,5.2],[1.56,5.4],[1.7,5],[1.84,4.4],[1.97,3.4]]; // angle on the head (x PI), length
  for(let pass=0;pass<2;pass++) for(const [a,L] of tufts){ const ang=a*Math.PI, bx=Math.cos(ang)*7.3, by=-57+Math.sin(ang)*7.3, nx=Math.cos(ang), ny=Math.sin(ang), sw=-.55; // sweep toward the back
    const dx=nx*Math.cos(sw)-ny*Math.sin(sw), dy=nx*Math.sin(sw)+ny*Math.cos(sw), tx=bx+dx*L, ty=by+dy*L, w=1.9, px=-ny*w, py=nx*w;
    c.fillStyle=pass?base:dk; c.beginPath(); c.moveTo(bx-px*(pass?1:1.15),by-py*(pass?1:1.15)); c.quadraticCurveTo(bx+dx*L*.55-px*.4,by+dy*L*.55-py*.4,tx,ty); c.quadraticCurveTo(bx+dx*L*.45+px*.6,by+dy*L*.45+py*.6,bx+px*(pass?1:1.15),by+py*(pass?1:1.15)); c.closePath(); c.fill();
    if(pass){ c.strokeStyle=v3rgba(lt,.7); c.lineWidth=.45; c.beginPath(); c.moveTo(bx-px*.4,by-py*.4); c.quadraticCurveTo(bx+dx*L*.5-px*.2,by+dy*L*.5-py*.2,tx,ty); c.stroke(); } }
  c.fillStyle=base; c.beginPath(); c.arc(0,-57,7.6,Math.PI*1.08,Math.PI*1.95); c.lineTo(6,-60); c.quadraticCurveTo(0,-62.4,-6.6,-58); c.closePath(); c.fill(); }
// the curly base mass: full size normally; under a hat a slightly smaller copy so it fills the scalp (no bald spot)
// without poking out around the brim
function curlyBase(c){ if(!A3HATON){ curlyCap(c); c.fill(); return; } c.save(); c.translate(0,-56); c.scale(.9,.92); c.translate(0,56); curlyCap(c); c.restore(); c.fill(); }
