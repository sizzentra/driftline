// =====================================================================
// 0.3.3 map love: every water gets a signature of its own and no empty corners.
// Each scene keeps what it had; the pieces below are layered on top:
//   land  : still pieces (drawn once into the cached scenery, with their own soft reflection)
//   live  : things that move (drawn every frame, kept small and cheap)
//   fore  : foreground along the bottom edge, which the float never reaches (waterY is above ~0.84H there)
// =====================================================================
const M33={};
// one owner per water and hook (Clean Scenes 5, batch 7): the original hook first, then every extra in the order the files added it.
// It replaced 96 nested wrappers (one per extra and water); same order, same size guard, same error report, one call per hook. Proven 2026-11-22: every water drawn at a frozen time is pixel-identical to the nested version.
function m33wrap(id,hook,fn){ const S0=V3SCENES[id]; if(!S0) return; const X=S0.__x||(S0.__x={}); if(!X[hook]){ const list=X[hook]=[], old=S0[hook];
    S0[hook]=function(){ if(old) old.apply(this,arguments); if(!(W>8&&H>8)||window.__noExtras) return; /* never draw extras on a zero-size canvas (some loops step by a fraction of W) */
      for(const f of list){ try{ f.apply(this,arguments); }catch(e){ if(!M33.err){ M33.err=1; console.error(e); } } } }; }
  X[hook].push(fn); }
// a soft mirror of whatever pathFn draws, just under the horizon
function m33reflect(x,hz,depth,alpha,col,pathFn){ x.save(); x.beginPath(); x.rect(0,hz,W,depth); x.clip(); x.translate(0,hz*2); x.scale(1,-1); x.globalAlpha=alpha; x.fillStyle=col; pathFn(); x.fill(); x.restore(); }
const m33dot=(c,x,y,r,col)=>{ c.fillStyle=col; c.beginPath(); c.arc(x,y,r,0,7); c.fill(); };

// ---------- shapes the water files draw with (their scenes and moments: src/w_<id>.js) ----------
// Saltmarsh Coast (w_coast.js): the headland and the village houses on it
M33.headland=(c,hz)=>{ c.beginPath(); c.moveTo(-2,hz+1); c.lineTo(-2,hz-H*.072); c.bezierCurveTo(W*.05,hz-H*.086,W*.12,hz-H*.07,W*.18,hz-H*.064); c.bezierCurveTo(W*.21,hz-H*.062,W*.235,hz-H*.058,W*.246,hz-H*.05); c.lineTo(W*.252,hz-H*.03); c.lineTo(W*.262,hz-H*.016); c.lineTo(W*.27,hz+1); c.closePath(); };
M33.houses=[[.04,.016,'#d8483a'],[.062,.02,'#3a6f9a'],[.086,.017,'#c8853a'],[.132,.019,'#4f8a4a'],[.155,.016,'#d8483a'],[.176,.018,'#7a5a9a']];
// Brine Shelf (w_shelf.js): the far island with its sea arch
M33.island=(c,hz)=>{ const x0=W*.3; c.beginPath(); c.moveTo(x0,hz+1); c.bezierCurveTo(x0+W*.015,hz-H*.02,x0+W*.03,hz-H*.042,x0+W*.06,hz-H*.046); c.bezierCurveTo(x0+W*.085,hz-H*.048,x0+W*.1,hz-H*.03,x0+W*.11,hz-H*.024); c.lineTo(x0+W*.118,hz-H*.024); c.bezierCurveTo(x0+W*.124,hz-H*.03,x0+W*.13,hz-H*.03,x0+W*.134,hz-H*.022); c.lineTo(x0+W*.14,hz+1); c.closePath(); };
// Midnight Deep (w_deep.js): the far rock pillar
M33.pillar=(c,hz)=>{ const x0=W*.33; c.beginPath(); c.moveTo(x0,hz+1); c.lineTo(x0+W*.004,hz-H*.05); c.lineTo(x0+W*.012,hz-H*.062); c.lineTo(x0+W*.022,hz-H*.056); c.lineTo(x0+W*.028,hz-H*.03); c.lineTo(x0+W*.034,hz+1); c.closePath(); };
// Ember Springs (w_ember.js): the steaming lava islets
M33.islets=[[.38,.1,.05,.018],[.86,.19,.065,.024],[.6,.33,.04,.016]];
M33.islet=(c,hz,i)=>{ const [ix,iy,iw,ih]=M33.islets[i], X=W*ix, Y=hz+H*iy, w=W*iw, h=H*ih; c.beginPath(); c.moveTo(X-w,Y); c.lineTo(X-w*.7,Y-h*.7); c.lineTo(X-w*.3,Y-h); c.lineTo(X+w*.1,Y-h*.8); c.lineTo(X+w*.5,Y-h*1.05); c.lineTo(X+w*.85,Y-h*.5); c.lineTo(X+w,Y); c.closePath(); };

// ---------- Starfall waterfalls: a ribbon that widens and shimmers as it falls, then lands properly in the cloud sea
// with billowing mist, droplets arcing out, spreading rings and a few glints
function m33fall(t,fx,fy,w,hz){ const FX=S.settings.effects, by=hz+H*.012, /* lands on the lake itself, in front of the cloud bank */ L=by-fy, w0=Math.max(1.4,w*.05), w1=w0*2.6;
  const fg=g.createLinearGradient(0,fy,0,by); fg.addColorStop(0,'rgba(255,255,255,.75)'); fg.addColorStop(.7,'rgba(235,240,255,.5)'); fg.addColorStop(1,'rgba(230,236,255,.15)');
  g.fillStyle=fg; g.beginPath(); g.moveTo(fx-w0/2,fy); g.lineTo(fx+w0/2,fy); g.quadraticCurveTo(fx+w0*.6,fy+L*.6,fx+w1/2,by); g.lineTo(fx-w1/2,by); g.quadraticCurveTo(fx-w0*.6,fy+L*.6,fx-w0/2,fy); g.closePath(); g.fill();
  // streaks flowing down the ribbon
  g.fillStyle='rgba(255,255,255,.55)'; for(let k=0;k<5;k++){ const q=((t*.9+k*.2)%1), y=fy+q*q*L, ww=w0+(w1-w0)*q; g.fillRect(fx-ww*.3+Math.sin(k*2.1)*ww*.2,y,Math.max(1,ww*.25),2+q*3); }
  // mist billowing up where it lands
  for(let k=0;k<6;k++){ const q=((t*.35+k/6)%1), mx=fx+Math.sin(k*1.9+t*.4)*w*.18*(.5+q), my=by-q*H*.05, r=H*(.012+q*.026); g.fillStyle="rgba(240,236,255,"+(.34*(1-q))+")"; g.beginPath(); g.arc(mx,my,r,0,7); g.fill(); }
  v3glow(g,fx,by,w*.6,'rgba(240,236,255,.9)',.25+.08*Math.sin(t*2.2));
  if(FX){ // droplets thrown out to both sides in little arcs
    g.fillStyle='rgba(255,255,255,.75)'; for(let k=0;k<10;k++){ const q=((t*1.4+k*.137)%1), sd=k%2?1:-1, dx=sd*(w*.06+q*w*(.16+(k%3)*.05)), dy=-Math.sin(q*Math.PI)*H*(.012+(k%4)*.004); g.globalAlpha=1-q; g.fillRect(fx+dx,by+dy,1.4,1.4); } g.globalAlpha=1;
    // rings spreading on the surface
    for(let k=0;k<3;k++){ const q=((t*.5+k/3)%1); g.strokeStyle='rgba(240,236,255,'+(.45*(1-q))+')'; g.lineWidth=1; g.beginPath(); g.ellipse(fx,by+1,w*(.08+q*.3),H*(.002+q*.006),0,0,7); g.stroke(); }
    // a glint now and then in the spray
    if(((t*.6)%1)<.12){ const gx=fx+Math.sin(t*3)*w*.1, gy=by-H*.012; g.fillStyle='rgba(255,255,255,.9)'; g.fillRect(gx-H*.006,gy,H*.012,1); g.fillRect(gx,gy-H*.006,1,H*.012); } } }

// ---------- Saltmarsh Coast village: the ground line of the headland (so houses stand on it), and the village itself ----------
function m33groundY(hz,X){ const segs=[[[-2,hz-H*.072],[W*.05,hz-H*.086],[W*.12,hz-H*.07],[W*.18,hz-H*.064]],[[W*.18,hz-H*.064],[W*.21,hz-H*.062],[W*.235,hz-H*.058],[W*.246,hz-H*.05]]];
  let px=null,py=null; for(const s of segs) for(let i=0;i<=24;i++){ const u=i/24, v=1-u, x=v*v*v*s[0][0]+3*v*v*u*s[1][0]+3*v*u*u*s[2][0]+u*u*u*s[3][0], y=v*v*v*s[0][1]+3*v*v*u*s[1][1]+3*v*u*u*s[2][1]+u*u*u*s[3][1];
    if(px!==null&&X>=px&&X<=x) return py+(y-py)*(X-px)/Math.max(.001,x-px); px=x; py=y; } return hz-H*.06; }
function m33village(x,P,hz){ const wall=mix(P.lh,P.farHaze,.22), wallS=mix(wall,P.far,.35), dark=mix(P.stoneD,P.farHaze,.15), green=mix(P.grass,P.far,.3), greenD=mix(green,'#0a1a10',.3);
  // fields on the hillside in a few greens, divided by hedgerows (clipped to the headland)
  x.save(); M33.headland(x,hz); x.clip(); const fr=v3rng(83);
  // soft bands of pasture following the slope, a hedgerow of little bushes between them
  for(let k=0;k<3;k++){ x.fillStyle=v3rgba(mix(green,k%2?'#c8b85a':'#7aa84a',.25),.35); x.beginPath(); x.moveTo(0,hz); for(let X=0;X<=W*.27;X+=W*.006) x.lineTo(X,m33groundY(hz,Math.min(X,W*.246))+H*(.01+k*.016)); x.lineTo(W*.27,hz); x.closePath(); x.fill(); }
  x.fillStyle=v3rgba(greenD,.7); for(let X=W*.01;X<W*.2;X+=W*.007){ const y=m33groundY(hz,X)+H*.018; x.beginPath(); x.arc(X,y,H*.0022,0,7); x.fill(); } x.restore();
  // the cliff face: cracks, darker crevices and tufts of grass clinging to ledges
  x.strokeStyle=v3rgba(mix(P.stoneD,'#000000',.2),.55); x.lineWidth=.8; for(const [a,b] of [[.222,.05],[.236,.044],[.249,.036],[.257,.024]]){ x.beginPath(); x.moveTo(W*a,hz-H*b); x.lineTo(W*a+W*.003,hz-H*(b-.012)); x.lineTo(W*a-W*.001,hz-H*(b-.022)); x.stroke(); }
  x.fillStyle=green; for(const [a,b] of [[.226,.046],[.244,.034],[.254,.02]]){ x.beginPath(); x.ellipse(W*a,hz-H*b,W*.004,H*.002,0,0,7); x.fill(); }
  // a stone quay at the cliff foot with two little boats moored to it
  { const qx=W*.262, qy=hz; x.fillStyle=mix(P.stone,P.farHaze,.25); x.fillRect(qx,qy-H*.006,W*.03,H*.006); x.fillStyle=v3rgba(mix(P.stoneD,'#000000',.2),.6); x.fillRect(qx,qy-H*.0015,W*.03,H*.0015);
    for(const [bx,col] of [[.276,'#c8483a'],[.292,'#3a6f9a']]){ const X=W*bx, s=H*.0028, cc=mix(col,P.farHaze,.25); x.fillStyle=cc; x.beginPath(); x.moveTo(X-s*3,qy-s*.8); x.lineTo(X+s*3,qy-s*.8); x.lineTo(X+s*2,qy+s*.4); x.lineTo(X-s*2.2,qy+s*.4); x.closePath(); x.fill(); x.fillStyle=mix(P.wood||'#5a3a2a',P.farHaze,.3); x.fillRect(X-.4,qy-s*5.5,.8,s*4.8); } }
  // a footpath winding along the ridge
  x.strokeStyle=v3rgba(mix(P.sand,P.farHaze,.3),.8); x.lineWidth=Math.max(1,H*.0025); x.beginPath(); for(let X=W*.02;X<=W*.2;X+=W*.004){ const y=m33groundY(hz,X)+H*.006+Math.sin(X/W*40)*H*.0015; X===W*.02?x.moveTo(X,y):x.lineTo(X,y); } x.stroke();
  // trees and bushes behind and between the houses
  for(const [tx,s] of [[.025,1],[.074,.8],[.112,1.1],[.145,.9],[.192,1.05]]){ const X=W*tx, g0=m33groundY(hz,X), r=H*.009*s; x.fillStyle=greenD; x.fillRect(X-.6,g0-r*1.6,1.2,r*1.6); x.fillStyle=green; x.beginPath(); x.arc(X,g0-r*1.9,r,0,7); x.arc(X-r*.7,g0-r*1.4,r*.75,0,7); x.arc(X+r*.7,g0-r*1.45,r*.7,0,7); x.fill(); x.fillStyle=v3rgba(P.rim,.2); x.beginPath(); x.arc(X+r*.3,g0-r*2.2,r*.45,0,7); x.fill(); }
  for(const [hx,hh,rc] of M33.houses){ const X=W*hx, w=H*.03, h=H*hh, gl=m33groundY(hz,X), gr=m33groundY(hz,X+w), base=Math.max(gl,gr)+H*.002, top=base-h, roofC=mix(rc,P.farHaze,.25+P.night*.35);
    // walls planted in the ground (a little foundation where the slope drops), lit front and shaded side
    x.fillStyle=wall; x.fillRect(X,top,w,base-top+H*.004); x.fillStyle=wallS; x.fillRect(X+w*.72,top,w*.28,base-top+H*.004);
    // roof with a lit slope, a darker slope and a ridge line; a chimney
    x.fillStyle=roofC; x.beginPath(); x.moveTo(X-w*.14,top+.3); x.lineTo(X+w*.42,top-w*.44); x.lineTo(X+w*1.14,top+.3); x.closePath(); x.fill();
    x.fillStyle=mix(roofC,'#000000',.22); x.beginPath(); x.moveTo(X+w*.42,top-w*.44); x.lineTo(X+w*1.14,top+.3); x.lineTo(X+w*.7,top+.3); x.closePath(); x.fill();
    x.strokeStyle=mix(roofC,'#ffffff',.25); x.lineWidth=.7; x.beginPath(); x.moveTo(X-w*.1,top); x.lineTo(X+w*.42,top-w*.42); x.stroke();
    x.fillStyle=mix(wall,P.stoneD,.4); x.fillRect(X+w*.66,top-w*.36,w*.12,w*.26);
    // a door and framed windows
    x.fillStyle=mix(rc,'#2a1a14',.45); x.fillRect(X+w*.42,base-h*.5,w*.18,h*.5); x.fillStyle=v3rgba(dark,.8); x.fillRect(X+w*.12,base-h*.68,w*.18,h*.26); if(w*.82<w) x.fillRect(X+w*.7,base-h*.68,w*.16,h*.26);
    x.strokeStyle=v3rgba(wall,.9); x.lineWidth=.5; x.beginPath(); x.moveTo(X+w*.21,base-h*.68); x.lineTo(X+w*.21,base-h*.42); x.stroke();
    // grass tufts at the foot so the house sits in the ground
    x.fillStyle=green; x.beginPath(); x.ellipse(X+w*.5,base+H*.002,w*.7,H*.003,0,0,7); x.fill(); }
  // the chapel: tower, belfry opening, slate spire with a cross
  { const X=W*.108, w=H*.022, base=m33groundY(hz,X+w/2)+H*.002, top=base-H*.05; x.fillStyle=wall; x.fillRect(X,top,w,base-top+H*.003); x.fillStyle=wallS; x.fillRect(X+w*.7,top,w*.3,base-top+H*.003);
    x.fillStyle=v3rgba(dark,.8); x.beginPath(); x.moveTo(X+w*.3,top+H*.012); x.lineTo(X+w*.3,top+H*.006); x.arc(X+w*.5,top+H*.006,w*.2,Math.PI,0); x.lineTo(X+w*.7,top+H*.012); x.closePath(); x.fill();
    x.fillStyle=mix('#7a8494',P.farHaze,.25); x.beginPath(); x.moveTo(X-1,top); x.lineTo(X+w/2,top-H*.036); x.lineTo(X+w+1,top); x.closePath(); x.fill(); x.fillStyle=mix('#5a6474',P.farHaze,.25); x.beginPath(); x.moveTo(X+w/2,top-H*.036); x.lineTo(X+w+1,top); x.lineTo(X+w*.55,top); x.closePath(); x.fill();
    x.strokeStyle=mix(P.stoneD,P.farHaze,.2); x.lineWidth=.8; x.beginPath(); x.moveTo(X+w/2,top-H*.036); x.lineTo(X+w/2,top-H*.046); x.moveTo(X+w/2-1.6,top-H*.042); x.lineTo(X+w/2+1.6,top-H*.042); x.stroke();
    x.fillStyle=green; x.beginPath(); x.ellipse(X+w/2,base+H*.002,w*.8,H*.003,0,0,7); x.fill(); } }
// the Starfall waterfalls are drawn over the scenery so they visibly pour past the cloud bank into the lake
