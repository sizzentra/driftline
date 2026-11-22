
// =====================================================================
// Driftline 0.3: the other areas, each with its own identity (preview only).
// Shared building blocks first, then one scene per area (V3SCENES.<id>).
// =====================================================================

// ---------- shared building blocks ----------
// a leafy deciduous tree: trunk + overlapping crown clumps, lit from the upper right
function v3tree(c,x,base,h,P,seed,rimA){ const r=v3rng(seed), tw=h*.08;
  c.fillStyle=P.wood||'#6a4a30'; c.beginPath(); c.moveTo(x-tw,base); c.lineTo(x-tw*.6,base-h*.45); c.lineTo(x+tw*.6,base-h*.45); c.lineTo(x+tw,base); c.closePath(); c.fill();
  const cx=x, cy=base-h*.62, R=h*.34, cl=[];
  for(let i=0;i<7;i++){ const a=r()*Math.PI*2, d=r()*R*.55; cl.push([cx+Math.cos(a)*d*1.2,cy+Math.sin(a)*d*.8-R*.1,R*(.5+r()*.25)]); }
  c.fillStyle=mix(P.leaf,'#000000',.32); for(const [a,b,rr] of cl){ c.beginPath(); c.arc(a,b+rr*.18,rr,0,7); c.fill(); }
  c.fillStyle=P.leaf; for(const [a,b,rr] of cl){ c.beginPath(); c.arc(a,b,rr*.92,0,7); c.fill(); }
  c.fillStyle=mix(P.leaf,P.leafHi,.35); for(const [a,b,rr] of cl.slice(0,4)){ c.beginPath(); c.arc(a+rr*.25,b-rr*.3,rr*.45,0,7); c.fill(); }
  if(rimA>0){ c.strokeStyle=v3rgba(P.rim,rimA); c.lineWidth=Math.max(.8,h*.02); c.beginPath(); c.arc(cx+R*.2,cy-R*.15,R*.95,-1.2,.2); c.stroke(); } }
// a natural boulder: irregular outline, a lit top facet, a shadowed side, a wet dark waterline when in water, moss flecks
function v3rock(c,x,y,w,h,P,col,wet,seed){ const base=col||P.stone||'#8a8a8a', r=v3rng(seed||Math.round(x*7+y*13)), n=7, pts=[];
  // a chunky silhouette: a few broad planes with softly rounded corners (never a smooth bun)
  for(let i=0;i<n;i++){ const a=Math.PI+i/(n-1)*Math.PI, k=(i===0||i===n-1)?1:.72+r()*.42, lift=(i>0&&i<n-1)?1.15:1; pts.push([x+Math.cos(a)*w*k,y+Math.sin(a)*h*k*lift]); }
  const peak=pts.reduce((m,p)=>p[1]<m[1]?p:m,pts[0]);
  const shape=()=>{ c.beginPath(); c.moveTo(pts[0][0],pts[0][1]); for(let i=1;i<n;i++){ const [px,py]=pts[i-1], [qx,qy]=pts[i]; c.lineTo(px+(qx-px)*.82,py+(qy-py)*.82); c.quadraticCurveTo(qx,qy,qx+((pts[i+1]||pts[i])[0]-qx)*.18,qy+((pts[i+1]||pts[i])[1]-qy)*.18); } c.lineTo(x+w,y+h*.12); c.quadraticCurveTo(x,y+h*.3,x-w,y+h*.12); c.closePath(); };
  c.fillStyle=base; shape(); c.fill(); c.save(); shape(); c.clip();
  // shadow side (away from the light), lit planes toward it
  const sg=c.createLinearGradient(x-w,0,x+w,0); sg.addColorStop(0,'rgba(15,12,30,.42)'); sg.addColorStop(.5,'rgba(0,0,0,.05)'); sg.addColorStop(1,'rgba(0,0,0,0)'); c.fillStyle=sg; c.fillRect(x-w,y-h*2.5,w*2,h*3);
  c.fillStyle=v3rgba(P.rim,.26); c.beginPath(); c.moveTo(peak[0],peak[1]); for(let i=n-1;i>=0;i--){ if(pts[i][0]<peak[0]) break; c.lineTo(pts[i][0],pts[i][1]); } c.lineTo(x+w*.15,y-h*.25); c.closePath(); c.fill();
  // a crack and two plane edges so it reads as stone
  c.strokeStyle='rgba(20,15,30,.32)'; c.lineWidth=Math.max(.8,w*.035); c.beginPath(); c.moveTo(peak[0]-w*.05,peak[1]+h*.15); c.lineTo(peak[0]-w*.2,y-h*.45); c.lineTo(peak[0]-w*.12,y-h*.05); c.stroke();
  c.fillStyle=mix(P.leaf||'#5a8a4a','#000000',.25); c.beginPath(); c.moveTo(pts[1][0],pts[1][1]); c.quadraticCurveTo(peak[0]-w*.1,peak[1]-h*.05,peak[0]+w*.1,peak[1]+h*.08); c.quadraticCurveTo(peak[0]-w*.2,peak[1]+h*.35,pts[1][0],pts[1][1]+h*.25); c.closePath(); c.fill();
  if(wet){ const wg=c.createLinearGradient(0,y-h*.5,0,y+h*.2); wg.addColorStop(0,'rgba(10,20,35,0)'); wg.addColorStop(.6,'rgba(10,20,35,.45)'); wg.addColorStop(1,'rgba(10,20,35,.6)'); c.fillStyle=wg; c.fillRect(x-w,y-h*.5,w*2,h);
    c.fillStyle=v3rgba('#ffffff',.35); c.beginPath(); c.ellipse(x+w*.35,y-h*.32,w*.18,h*.05,-.2,0,7); c.fill(); }
  c.restore(); }
// smooth rolling hill band through given points (fractions of W, heights in px above baseY)
function v3hillBand(c,baseY,pts,col){ c.fillStyle=col; c.beginPath(); c.moveTo(0,baseY+2); c.lineTo(0,baseY-pts[0][1]);
  for(let i=1;i<pts.length;i++){ const [x0,h0]=pts[i-1], [x1,h1]=pts[i], mx=(x0+x1)/2*W; c.quadraticCurveTo(x0*W,baseY-h0,mx,baseY-(h0+h1)/2); }
  const [xl,hl]=pts[pts.length-1]; c.lineTo(xl*W,baseY-hl); c.lineTo(W,baseY-hl); c.lineTo(W,baseY+2); c.closePath(); c.fill(); }
// water base: gradient, mirrored reflection of the land, calm bands, a bright waterline
function v3water(x,P,hz,cnv,reflA=.38){ const wg=x.createLinearGradient(0,hz,0,H); wg.addColorStop(0,P.wTop); wg.addColorStop(.32,P.wMid); wg.addColorStop(1,P.wBot); x.fillStyle=wg; x.fillRect(0,hz,W,H-hz);
  x.save(); x.globalAlpha=reflA; x.beginPath(); x.rect(0,hz,W,H*.3); x.clip(); x.translate(0,hz); x.scale(1,-.72); x.translate(0,-hz); x.drawImage(cnv,0,0,cnv.width,Math.round(hz*cnv.height/H),0,0,W,hz); x.restore();
  const rb=x.createLinearGradient(0,hz,0,hz+H*.3); rb.addColorStop(0,v3rgba(P.wTop,0)); const rf=Math.min(1,H*.3/Math.max(1,H-hz)), rc=rf<.32?mix(P.wTop,P.wMid,rf/.32):mix(P.wMid,P.wBot,(rf-.32)/.68); rb.addColorStop(1,v3rgba(rc,1)); x.fillStyle=rb; x.fillRect(0,hz,W,H*.3);
  x.fillStyle=v3rgba(P.wTop,.35); for(let i=0;i<9;i++){ const y=hz+3+i*i*1.6; x.fillRect(0,y,W,1); }
  x.fillStyle=v3rgba(P.rim,.28+P.d*.2); x.fillRect(0,hz,W,1.2); }
// sun or moon glitter column on the water
function v3glitter(P,t,hz,sun){ if(sun.vis<=.05) return; const gx=clamp(sun.x,W*.05,W*.95); g.fillStyle=v3rgba(sun.up?P.glow:'#dfe6ff',.9*sun.vis);
  for(let i=0;i<10;i++){ const y=hz+3+i*i*2.1; if(y>H*.8) break; const w2=(W*.07-i*W*.005)*(.7+.3*Math.sin(t*2.3+i*1.7)); const off=Math.sin(t*1.3+i*2.1)*W*.006; g.globalAlpha=(.85-i*.07)*sun.vis*(.6+.4*Math.sin(t*3+i)); g.fillRect(gx-w2/2+off,y,w2,1.6+i*.15); } g.globalAlpha=1; }
function v3mist(P,t,hz,a){ if(!S.settings.effects||a<=.02) return; for(let i=0;i<2;i++){ const mx=((t*(6+i*3)+i*W*.4)%(W*1.6))-W*.3, my=hz+H*(.02+i*.05), mw=W*.7; const mg=g.createLinearGradient(mx,0,mx+mw,0); const mc=mix(P.farHaze,'#ffffff',.4); mg.addColorStop(0,v3rgba(mc,0)); mg.addColorStop(.5,v3rgba(mc,a)); mg.addColorStop(1,v3rgba(mc,0)); g.fillStyle=mg; g.fillRect(mx,my,mw,H*.025); } }
function v3fishRing(P,t,hz,per,x0,x1){ const k=(t%per)/per, i=Math.floor(t/per), rr=v3rng(i*97+5)(), fx=W*(x0+rr*(x1-x0)), fy=hz+H*(.08+((i*37)%10)/10*.25);
  if(k<.55){ const e=k/.55; g.strokeStyle=v3rgba(mix(P.wTop,'#ffffff',.7),.6*(1-e)); g.lineWidth=1.2; g.beginPath(); g.ellipse(fx,fy,4+e*W*.03,1.5+e*H*.012,0,0,7); g.stroke(); g.beginPath(); g.ellipse(fx,fy,2+e*W*.018,1+e*H*.007,0,0,7); g.stroke(); } }

// =====================================================================
// STONEBROOK RIVER: fresh morning, a stone arch bridge, a mossy waterwheel mill,
// fast current lines, foam around rocks, a kingfisher, a heron, leaping trout
// =====================================================================
// its colours below; the scene and everything drawn on it: src/w_river.js
V3PAL.river = {
  day:  {top:'#6aa6d8', mid:'#a8d0ec', bot:'#eef0e2', glow:'#fff6d8', far:'#9ab8b0', farHaze:'#d0e2dc', hill:'#6a9a5e', back:'#4f8050', front:'#36603c', bank:'#5a8a4e', wTop:'#a8d4d8', wMid:'#5a9aa4', wBot:'#28525e', rim:'#fff4cc', stone:'#bab2a2', stoneD:'#8a8478', roof:'#7a4a3a', wood:'#7a5a3e', leaf:'#6aa65a', leafHi:'#c8e89a', cloud:'#ffffff', cloudLit:'#fff4e0', cabin:'#8a6a4a'},
  dusk: {top:'#2a2a5a', mid:'#c0607a', bot:'#ffc890', glow:'#ffd090', far:'#8a6a8e', farHaze:'#e89a98', hill:'#4a4a6a', back:'#3a3a5e', front:'#2a2a48', bank:'#3a3a5a', wTop:'#f0a088', wMid:'#7a5a86', wBot:'#1e2446', rim:'#ffc890', stone:'#9a8a98', stoneD:'#6a5a70', roof:'#5a3040', wood:'#5a3a3a', leaf:'#4a5a5a', leafHi:'#ffc08a', cloud:'#c87090', cloudLit:'#ffc8a0', cabin:'#5a4050'},
  night:{top:'#05091a', mid:'#111a3c', bot:'#26306a', glow:'#c8d4ff', far:'#252e56', farHaze:'#36407a', hill:'#1a2244', back:'#141c38', front:'#0c1228', bank:'#121a34', wTop:'#283268', wMid:'#121a40', wBot:'#04060e', rim:'#9fb4ff', stone:'#4a5070', stoneD:'#30344c', roof:'#20182a', wood:'#22202e', leaf:'#1a2638', leafHi:'#6f80c8', cloud:'#2a3058', cloudLit:'#5a66a0', cabin:'#20202e'}
};

// =====================================================================
// SALTMARSH COAST: breezy sea air, dunes with marram grass, a striped lighthouse on a rocky
// headland whose beam sweeps at dusk, rolling waves with foam, gulls, a crab on the pier
// =====================================================================
// its colours below; the scene and everything drawn on it: src/w_coast.js
V3PAL.coast = {
  day:  {top:'#5aa8e0', mid:'#9cd0ee', bot:'#e8f4f0', glow:'#fffbe8', far:'#9ec4c8', farHaze:'#d8ecec', sand:'#e8d6a4', sandD:'#c8b07a', grass:'#8aa85a', wTop:'#9adcd8', wMid:'#3aa0a8', wBot:'#145a6a', rim:'#fffae0', stone:'#9a948a', stoneD:'#6a665e', lh:'#f4f0e6', lhS:'#c8483a', leaf:'#7a9a4a', leafHi:'#c8e08a', cloud:'#ffffff', cloudLit:'#fff8ea', wood:'#8a6a4a'},
  dusk: {top:'#2a2c5e', mid:'#d0687a', bot:'#ffcf8a', glow:'#ffd890', far:'#8a6a8a', farHaze:'#f0a08e', sand:'#c89a8a', sandD:'#8a6a7a', grass:'#6a6a5a', wTop:'#f8b088', wMid:'#8a5a88', wBot:'#1c2448', rim:'#ffcf90', stone:'#7a6a7a', stoneD:'#4a3a54', lh:'#f0d0c0', lhS:'#a8384a', leaf:'#5a5a50', leafHi:'#ffc890', cloud:'#d07890', cloudLit:'#ffd0a0', wood:'#5a3a3a'},
  night:{top:'#04081a', mid:'#0e1a3c', bot:'#22306a', glow:'#c8d4ff', far:'#1e2a50', farHaze:'#303e72', sand:'#3a4268', sandD:'#262c4c', grass:'#22304a', wTop:'#243466', wMid:'#101c40', wBot:'#03060e', rim:'#9fb4ff', stone:'#3a4060', stoneD:'#22263c', lh:'#8a94b8', lhS:'#4a3a5a', leaf:'#1a2638', leafHi:'#6f80c8', cloud:'#283058', cloudLit:'#5a66a0', wood:'#22202e'}
};
const V3CN=v3noise(17);

// =====================================================================
// FROSTBITE LAKE: blue hour over a frozen lake, snowy pines, an ice-fishing hut with a smoking
// stovepipe, an aurora rippling overhead, falling snow, glinting cracks, an owl and an arctic fox
// =====================================================================
// its colours below; the scene and everything drawn on it: src/w_frost.js
V3PAL.frost = {
  day:  {top:'#6a8ad0', mid:'#a8bce8', bot:'#e8e4f4', glow:'#fff4f0', far:'#a0aad8', farHaze:'#dcdcf0', hill:'#c8d0ec', back:'#3e5a78', front:'#2a4058', snow:'#f6f8ff', snowD:'#b8c4e4', ice:'#d8e8f6', iceD:'#8aaad0', wTop:'#a8c0e0', wMid:'#4a6a9a', wBot:'#1a2a4a', rim:'#fff4ea', wood:'#7a5440', roof:'#5a3a30', leaf:'#3e5a78', cloud:'#f4f4ff', cloudLit:'#ffffff', aur:'#7af0b0'},
  dusk: {top:'#1e1e50', mid:'#8a5a9e', bot:'#f0a0b0', glow:'#ffc8b8', far:'#6a5a96', farHaze:'#c890b0', hill:'#9a88b8', back:'#2a2a4e', front:'#1e1e3a', snow:'#f0d8e8', snowD:'#9a88b8', ice:'#d8c0dc', iceD:'#7a6aa0', wTop:'#d8a0c0', wMid:'#5a4a86', wBot:'#141a3a', rim:'#ffd0c0', wood:'#5a3a3a', roof:'#40263a', leaf:'#2a2a4e', cloud:'#b07aa0', cloudLit:'#ffc8c0', aur:'#8af0c0'},
  night:{top:'#030614', mid:'#0a1434', bot:'#1a2a5a', glow:'#c8d4ff', far:'#1e2a54', farHaze:'#2c3a70', hill:'#33406e', back:'#0e1630', front:'#080e22', snow:'#8a9ac8', snowD:'#4a5a8a', ice:'#5a6a9a', iceD:'#2e3a64', wTop:'#22305e', wMid:'#0e1838', wBot:'#02040c', rim:'#a8c0ff', wood:'#24202e', roof:'#1a1624', leaf:'#0e1630', cloud:'#222a50', cloudLit:'#4a5690', aur:'#5af0a0'}
};
function v3snowPine(c,x,base,h,P,rimA){ v3pine(c,x,base,h,P.back,P.rim,rimA); const w=h*.42; c.fillStyle=P.snow;
  for(let i=0;i<4;i++){ const ty=base-h*.12-i*h*.2, tw=w*(1-i*.2), top=ty-h*.36; c.beginPath(); c.moveTo(x,top); c.quadraticCurveTo(x-tw*.18,ty-h*.22,x-tw*.36,ty-h*.08); c.quadraticCurveTo(x-tw*.1,ty-h*.16,x,ty-h*.14); c.quadraticCurveTo(x+tw*.12,ty-h*.18,x+tw*.3,ty-h*.1); c.quadraticCurveTo(x+tw*.16,ty-h*.24,x,top); c.fill(); } }

// =====================================================================
// CORAL SHALLOWS: tropical noon, turquoise water so clear the reef shows through, caustic light
// dancing on the sand, palms with a hammock, a beach hut on stilts, a turtle and parrots
// =====================================================================
// its colours below; the scene and everything drawn on it: src/w_reef.js
V3PAL.reef = {
  day:  {top:'#2a9ae8', mid:'#6ccaf4', bot:'#d8f6f8', glow:'#fffcea', far:'#5aa88a', farHaze:'#b8e8e0', isl:'#3a8a5a', sand:'#f4e2b0', sandD:'#d8bc80', wTop:'#7ae8e0', wMid:'#18b0c0', wBot:'#0a6a8a', rim:'#fffbe0', trunk:'#9a7a52', frond:'#3a9a4a', frondD:'#22703a', hut:'#c89a5a', thatch:'#d8b46a', coral:'#ff7a6a', coral2:'#ffb84a', coral3:'#c86ad8', cloud:'#ffffff', cloudLit:'#fffaf0', leaf:'#3a9a4a'},
  dusk: {top:'#2a2a6a', mid:'#e0607a', bot:'#ffc070', glow:'#ffd080', far:'#6a4a6a', farHaze:'#f09a8a', isl:'#4a3a5a', sand:'#e8b090', sandD:'#a87a7a', wTop:'#ffa888', wMid:'#a05a8a', wBot:'#2a2058', rim:'#ffd090', trunk:'#6a4a40', frond:'#3a4a4a', frondD:'#2a3040', hut:'#8a5a50', thatch:'#a87a60', coral:'#ff8a7a', coral2:'#ffb070', coral3:'#c070c0', cloud:'#e07890', cloudLit:'#ffd0a0', leaf:'#3a4a4a'},
  night:{top:'#03081c', mid:'#0a1a40', bot:'#1a3070', glow:'#c8d4ff', far:'#142246', farHaze:'#283c74', isl:'#0e1a34', sand:'#4a5078', sandD:'#2e3456', wTop:'#1e4a78', wMid:'#0a2448', wBot:'#020814', rim:'#9fc0ff', trunk:'#2a2a3a', frond:'#121e30', frondD:'#0a1424', hut:'#2a2a3a', thatch:'#34344a', coral:'#5a4a7a', coral2:'#5a5a7a', coral3:'#4a3a7a', cloud:'#283058', cloudLit:'#5a66a0', leaf:'#121e30'}
};
function v3palm(c,x,base,h,lean,P,seed){ const r=v3rng(seed), tx=x+lean*h, ty=base-h;
  c.strokeStyle=P.trunk; c.lineCap='round'; for(let k=0;k<2;k++){ c.lineWidth=h*(.055-k*.02); if(k) c.strokeStyle=mix(P.trunk,P.rim,.25); c.beginPath(); c.moveTo(x+k*h*.008,base); c.quadraticCurveTo(x+lean*h*.2+k*h*.008,base-h*.6,tx,ty); c.stroke(); }
  c.strokeStyle=mix(P.trunk,'#000000',.3); c.lineWidth=Math.max(.7,h*.008); for(let k=1;k<9;k++){ const u=k/9, px=x+(lean*h*.2)*2*u*(1-u)+(tx-x)*u*u, py=base-h*.6*2*u*(1-u)-h*u*u; c.beginPath(); c.moveTo(px-h*.025,py); c.lineTo(px+h*.025,py-h*.01); c.stroke(); }
  for(let i=0;i<8;i++){ const a=-Math.PI*.95+i/7*Math.PI*.9+(r()-.5)*.2, L=h*(.36+r()*.14), ex=tx+Math.cos(a)*L, ey=ty+Math.sin(a)*L*.5+L*.32;
    c.strokeStyle=i%2?P.frondD:P.frond; c.lineWidth=Math.max(1,h*.012); c.beginPath(); c.moveTo(tx,ty); c.quadraticCurveTo(tx+Math.cos(a)*L*.5,ty+Math.sin(a)*L*.3-L*.15,ex,ey); c.stroke();
    c.fillStyle=i%2?P.frondD:P.frond; for(let k=2;k<9;k++){ const u=k/9, mx=(1-u)*(1-u)*tx+2*u*(1-u)*(tx+Math.cos(a)*L*.5)+u*u*ex, my=(1-u)*(1-u)*ty+2*u*(1-u)*(ty+Math.sin(a)*L*.3-L*.15)+u*u*ey, ll=L*.16*(1-u*.5);
      c.beginPath(); c.moveTo(mx,my); c.lineTo(mx+Math.cos(a+1.9)*ll,my+Math.abs(Math.sin(a+1.9))*ll+ll*.3); c.lineTo(mx+Math.cos(a)*ll*.3,my+ll*.15); c.lineTo(mx+Math.cos(a-1.9)*ll,my+Math.abs(Math.sin(a-1.9))*ll+ll*.3); c.closePath(); c.fill(); } }
  c.fillStyle=mix(P.trunk,'#3a2a1a',.4); for(let k=0;k<3;k++){ c.beginPath(); c.arc(tx+(k-1)*h*.025,ty+h*.03,h*.022,0,7); c.fill(); } c.lineCap='butt'; }

// =====================================================================
// BRINE SHELF: open sea at golden hour, nothing but water to the horizon, a big slow swell that
// tilts the world, a tall ship sailing far off, a bell buoy, dolphins and an albatross
// =====================================================================
// its colours below; the scene and everything drawn on it: src/w_shelf.js
V3PAL.shelf = {
  day:  {top:'#4a8ad0', mid:'#9cc4e4', bot:'#ffe8b8', glow:'#fff0c0', far:'#c8b8a0', farHaze:'#f8dcb0', wTop:'#a8d0d8', wMid:'#2a7a9a', wBot:'#0c3a5a', rim:'#fff0c8', ship:'#5a5060', sail:'#f4ead8', cloud:'#ffffff', cloudLit:'#fff0d0', buoy:'#d8483a', leaf:'#5a7a6a'},
  dusk: {top:'#2a2458', mid:'#e0705a', bot:'#ffc060', glow:'#ffcc70', far:'#a86a6a', farHaze:'#ffb070', wTop:'#ffb070', wMid:'#8a4a6a', wBot:'#1a1a40', rim:'#ffd080', ship:'#3a2a3a', sail:'#ffd8b0', cloud:'#e0708a', cloudLit:'#ffd0a0', buoy:'#c8383a', leaf:'#3a3a4a'},
  night:{top:'#030818', mid:'#0c1838', bot:'#1e2c60', glow:'#c8d4ff', far:'#1e2850', farHaze:'#2a3870', wTop:'#22305e', wMid:'#0c1a3c', wBot:'#02040c', rim:'#9fb4ff', ship:'#10141e', sail:'#4a5478', cloud:'#222a50', cloudLit:'#4a5690', buoy:'#5a3040', leaf:'#121a2a'}
};

// =====================================================================
// MIDNIGHT DEEP: far offshore in weather, low storm clouds racing, lightning that lights the whole sea,
// rain sheets slanting past, a huge swell, the trawler's floodlights, a whale tail in the swell
// =====================================================================
// its colours below; the scene and everything drawn on it: src/w_deep.js
V3PAL.deep = {
  day:  {top:'#3a4a5e', mid:'#6a7a8a', bot:'#a8b0b4', glow:'#e8ecf0', far:'#4a5866', farHaze:'#8a96a0', wTop:'#6a8290', wMid:'#2a4256', wBot:'#0a1826', rim:'#d8e0e8', cl1:'#4a5662', cl2:'#2e3a46', cloud:'#6a7682', cloudLit:'#9aa6b0', leaf:'#2a3a4a'},
  dusk: {top:'#1e1a36', mid:'#4a3048', bot:'#c8704a', glow:'#ff9a5a', far:'#3a2a3e', farHaze:'#7a4a4a', wTop:'#8a5a5a', wMid:'#2a2240', wBot:'#08081a', rim:'#ffb080', cl1:'#3a2a3e', cl2:'#221a2e', cloud:'#4a3448', cloudLit:'#a8606a', leaf:'#1a1a2a'},
  night:{top:'#02040c', mid:'#060c1e', bot:'#0e1834', glow:'#a8b8e8', far:'#0a1226', farHaze:'#141e3a', wTop:'#14203e', wMid:'#060c20', wBot:'#010208', rim:'#8aa0d8', cl1:'#0e1428', cl2:'#060a18', cloud:'#121a32', cloudLit:'#2a3660', leaf:'#060a14'}
};

// =====================================================================
// HOLLOW TRENCH: eerie twilight over black water, sea stacks in the mist, the mast of a sunken ship,
// glowing jellyfish drifting below, plankton trails, a dark middle that swallows light, eyes in the deep
// =====================================================================
// its colours below; the scene and everything drawn on it: src/w_trench.js
V3PAL.trench = {
  day:  {top:'#1e3a48', mid:'#3a6a70', bot:'#8ab0a8', glow:'#d8f0e8', far:'#2a4a52', farHaze:'#5a8a88', rock:'#2a3e46', rockD:'#162630', wTop:'#3a6a70', wMid:'#123a44', wBot:'#020e14', rim:'#b8e8dc', bio:'#5afff0', bio2:'#a080ff', wood:'#3a3a38', cloud:'#4a6a70', cloudLit:'#7aa0a0', leaf:'#1a3a3a'},
  dusk: {top:'#1a1a3a', mid:'#3a3a5e', bot:'#7a6a8a', glow:'#e0c0e0', far:'#2a2844', farHaze:'#5a5276', rock:'#24223a', rockD:'#141428', wTop:'#4a4a6e', wMid:'#14163a', wBot:'#03030e', rim:'#d8c0ff', bio:'#6afff0', bio2:'#c080ff', wood:'#2e2a34', cloud:'#3a3656', cloudLit:'#7a6a9a', leaf:'#1a1a2e'},
  night:{top:'#010508', mid:'#03101a', bot:'#082028', glow:'#9ad8d0', far:'#061218', farHaze:'#0e2a30', rock:'#08141a', rockD:'#030a0e', wTop:'#0a2228', wMid:'#030c12', wBot:'#000204', rim:'#6ad8c8', bio:'#5afff0', bio2:'#a070ff', wood:'#141618', cloud:'#0a1a20', cloudLit:'#1a3a40', leaf:'#061014'}
};
function v3stack(c,x,base,w,h,P,seed){ const r=v3rng(seed), L=[], R=[], n=11;
  // a craggy pillar: wide at the foot, waisted, with ledges and a ragged crown
  for(let i=0;i<=n;i++){ const u=i/n, wd=w*(.5-.18*u+.06*Math.sin(u*7+seed))*(1+(r()-.5)*.22), ledge=(i%4===2)?w*.08:0; L.push([x-wd-ledge,base-h*u]); R.push([x+wd*(.92+r()*.16)+(i%5===3?w*.07:0),base-h*u]); }
  const top=base-h; c.fillStyle=P.rock; c.beginPath(); c.moveTo(L[0][0],L[0][1]); for(const p of L) c.lineTo(p[0],p[1]);
  c.lineTo(x-w*.18,top-h*.04); c.lineTo(x-w*.05,top+h*.01); c.lineTo(x+w*.08,top-h*.05); c.lineTo(x+w*.22,top+h*.005);
  for(let i=R.length-1;i>=0;i--) c.lineTo(R[i][0],R[i][1]); c.closePath(); c.fill();
  c.save(); c.clip(); const sg=c.createLinearGradient(x-w*.6,0,x+w*.6,0); sg.addColorStop(0,v3rgba(P.rim,.14)); sg.addColorStop(.4,'rgba(0,0,0,0)'); sg.addColorStop(1,v3rgba(P.rockD,.9)); c.fillStyle=sg; c.fillRect(x-w,top-h*.1,w*2,h*1.2);
  c.strokeStyle=v3rgba(P.rockD,.7); c.lineWidth=1; for(let k=0;k<4;k++){ const yy=base-h*(.15+k*.21+r()*.05); c.beginPath(); c.moveTo(x-w*.7,yy); c.quadraticCurveTo(x,yy+(r()-.5)*h*.04,x+w*.7,yy+(r()-.5)*h*.03); c.stroke(); }
  c.strokeStyle=v3rgba(P.rockD,.6); c.beginPath(); c.moveTo(x+w*.05,top+h*.1); c.lineTo(x-w*.04,top+h*.35); c.lineTo(x+w*.02,top+h*.55); c.stroke();
  c.fillStyle=v3rgba(mix(P.leaf,P.rim,.2),.5); c.beginPath(); c.moveTo(x-w*.2,top-h*.03); c.quadraticCurveTo(x,top-h*.07,x+w*.24,top); c.quadraticCurveTo(x,top+h*.03,x-w*.2,top-h*.03); c.fill(); c.restore();
  c.fillStyle=v3rgba(P.farHaze,.5); c.beginPath(); c.ellipse(x,base,w*.8,h*.03,0,0,7); c.fill(); }

// =====================================================================
// EMBER SPRINGS: a volcanic valley, a smouldering volcano with glowing veins, stone terraces of hot pools,
// steam lifting off warm water, embers drifting up, glowing moths, a fire salamander
// =====================================================================
// its colours below; the scene and everything drawn on it: src/w_ember.js
V3PAL.ember = {
  day:  {top:'#6a5a6a', mid:'#b88a7a', bot:'#f0c8a0', glow:'#ffe0b0', far:'#6a5050', farHaze:'#c89a88', rock:'#4a3a3a', rockD:'#2a2024', terr:'#7a6258', wTop:'#e8b090', wMid:'#8a5a5a', wBot:'#2a1a20', rim:'#ffd8b0', lava:'#ff7a2a', lava2:'#ffc04a', pool:'#7ad8d0', cloud:'#9a8080', cloudLit:'#e8c0a0', leaf:'#4a5a3a'},
  dusk: {top:'#2a1430', mid:'#8a2a3a', bot:'#ff7a3a', glow:'#ffa060', far:'#3a1a24', farHaze:'#a84a3a', rock:'#2e1c22', rockD:'#180e14', terr:'#5a3a38', wTop:'#ff9060', wMid:'#6a2a3a', wBot:'#1a0a14', rim:'#ffb070', lava:'#ff6a1a', lava2:'#ffb030', pool:'#6ab8b8', cloud:'#5a2a34', cloudLit:'#d06040', leaf:'#2e2a24'},
  night:{top:'#0a0408', mid:'#1e0a10', bot:'#3a1418', glow:'#ffb090', far:'#140a0e', farHaze:'#3a1a1a', rock:'#140c10', rockD:'#08050a', terr:'#2a1a1a', wTop:'#5a2420', wMid:'#200c10', wBot:'#060204', rim:'#ff9a6a', lava:'#ff5a10', lava2:'#ffa020', pool:'#3a7a80', cloud:'#2a1216', cloudLit:'#6a2a1a', leaf:'#141210'}
};

// =====================================================================
// STARFALL LAKE: a lake above the clouds, a sea of cloud tops at the horizon, a ringed planet, the Milky Way,
// floating islands with waterfalls, crystal spires, shooting stars that fall into the water, light wisps,
// and a constellation of a fish that slowly draws itself
// =====================================================================
// its colours below; the scene and everything drawn on it: src/w_starfall.js
V3PAL.starfall = {
  day:  {top:'#4a4aa8', mid:'#9a8ad8', bot:'#f0d8f0', glow:'#fff4ff', far:'#c8b8e8', farHaze:'#f0e0f8', cloudSea:'#f4ecfa', cloudSh:'#c8b8e0', isl:'#5a8a6a', islD:'#4a3a5a', wTop:'#c8b0f0', wMid:'#6a5ab0', wBot:'#1a1440', rim:'#fff0ff', cry:'#b88aff', cry2:'#7ae0ff', planet:'#f0b890', ring:'#e8d0ff', star:'#ffffff', cloud:'#ffffff', cloudLit:'#fff4ff', leaf:'#5a8a6a'},
  dusk: {top:'#1a1040', mid:'#7a3a8a', bot:'#ff9ab0', glow:'#ffd0e0', far:'#7a5a9a', farHaze:'#e8a0c0', cloudSea:'#f0b8c8', cloudSh:'#8a6a9a', isl:'#4a5a5a', islD:'#2e2440', wTop:'#e8a0d0', wMid:'#4a2a7a', wBot:'#0e0828', rim:'#ffd8f0', cry:'#c890ff', cry2:'#8ae8ff', planet:'#ffb080', ring:'#ffd0e8', star:'#ffffff', cloud:'#d890b0', cloudLit:'#ffd8e0', leaf:'#4a5a5a'},
  night:{top:'#04021a', mid:'#120a3a', bot:'#2a1a5a', glow:'#d8c8ff', far:'#1e1846', farHaze:'#3a2a6a', cloudSea:'#4a3e80', cloudSh:'#241c4a', isl:'#1e2a3a', islD:'#100c22', wTop:'#2a1e5a', wMid:'#100a30', wBot:'#020108', rim:'#c8b8ff', cry:'#a070ff', cry2:'#5ad8ff', planet:'#c89a80', ring:'#b8a0e8', star:'#ffffff', cloud:'#2a2050', cloudLit:'#5a4a90', leaf:'#1e2a3a'}
};

// a lit round stage for the Wardrobe and Pets previews: a soft spotlight, a wooden disc with a rim and a shadow
function v3Pedestal(x,cx,cy,rw,t){ const rh=rw*.22;
  const sp=x.createRadialGradient(cx,cy-rw*.9,0,cx,cy-rw*.6,rw*1.8); sp.addColorStop(0,'rgba(255,224,170,.28)'); sp.addColorStop(.5,'rgba(255,200,140,.08)'); sp.addColorStop(1,'rgba(255,200,140,0)'); x.fillStyle=sp; x.fillRect(cx-rw*2,cy-rw*2.6,rw*4,rw*3);
  x.fillStyle='rgba(2,6,15,.45)'; x.beginPath(); x.ellipse(cx,cy+rh*1.25,rw*1.08,rh*.9,0,0,7); x.fill();
  const wd='#7a5a3c'; /* its own wood: the Wardrobe and Pets stand no longer copies the dock you are at (director, 2026-11-18) */ x.fillStyle=mix(wd,'#000000',.35); x.beginPath(); x.ellipse(cx,cy+rh*.45,rw,rh,0,0,Math.PI); x.lineTo(cx-rw,cy); x.ellipse(cx,cy,rw,rh,0,Math.PI,0,true); x.closePath(); x.fill();
  x.fillRect(cx-rw,cy,rw*2,rh*.45);
  const tg=x.createLinearGradient(0,cy-rh,0,cy+rh); tg.addColorStop(0,mix(wd,'#ffffff',.18)); tg.addColorStop(1,mix(wd,'#000000',.1)); x.fillStyle=tg; x.beginPath(); x.ellipse(cx,cy,rw,rh,0,0,7); x.fill();
  x.save(); x.beginPath(); x.ellipse(cx,cy,rw,rh,0,0,7); x.clip(); x.strokeStyle='rgba(0,0,0,.16)'; x.lineWidth=1.5; for(let k=-4;k<=4;k++){ x.beginPath(); x.moveTo(cx+k*rw*.22,cy-rh); x.lineTo(cx+k*rw*.22,cy+rh); x.stroke(); } x.restore();
  x.strokeStyle='rgba(255,236,200,.45)'; x.lineWidth=1.5; x.beginPath(); x.ellipse(cx,cy,rw,rh,0,Math.PI*1.05,Math.PI*1.95); x.stroke(); }

// ---------- the aquarium tank in the 0.3 look ----------
// Static layers (depth, far rock silhouettes, sand with ripples) are cached per size, theme and sand;
// light rays, caustics, kelp and bubbles move every frame. Theme and sand colors come from the player's choices.
let V3TANK=null;
function v3TankBack(c,w,h,t){ const V=aqView(), th=THEMES.find(x=>x[0]===V.theme)||THEMES[0], sd=SANDS.find(x=>x[0]===V.sand)||SANDS[0], DP=Math.min(DPR||1,2);
  const key=w+'|'+h+'|'+V.theme+'|'+V.sand;
  if(!V3TANK||V3TANK.key!==key){ const cc=(V3TANK&&V3TANK.c)||document.createElement('canvas'); cc.width=Math.round(w*DP); cc.height=Math.round(h*DP); const x=cc.getContext('2d'); x.setTransform(DP,0,0,DP,0,0); x.clearRect(0,0,w,h);
    const bg=x.createLinearGradient(0,0,0,h); bg.addColorStop(0,mix(th[3],'#ffffff',.08)); bg.addColorStop(.55,th[3]); bg.addColorStop(1,th[4]); x.fillStyle=bg; x.fillRect(0,0,w,h);
    // far rock and coral silhouettes, two depths, tinted by the water
    const r=v3rng(31); for(let L=0;L<2;L++){ x.fillStyle=mix(th[4],th[3],L?.35:.6); x.beginPath(); x.moveTo(0,h); for(let X=0;X<=w;X+=w/24){ const hh=h*(.18+.16*Math.abs(Math.sin(X*.011+L*2))+.06*r())*(L?.75:1); x.lineTo(X,h-hh); } x.lineTo(w,h); x.closePath(); x.fill(); }
    for(let i=0;i<6;i++){ const bx=w*(.08+i*.17+r()*.05), bh=h*(.2+r()*.15); x.strokeStyle=mix(th[4],th[3],.45); x.lineWidth=Math.max(2,h*.012); x.lineCap='round'; x.beginPath(); x.moveTo(bx,h*.9); x.lineTo(bx,h*.9-bh); for(const sdx of [-1,1]){ x.moveTo(bx,h*.9-bh*.5); x.quadraticCurveTo(bx+sdx*bh*.25,h*.9-bh*.6,bx+sdx*bh*.3,h*.9-bh*.85); } x.stroke(); }
    // sand: a soft dune with ripples and grains, lighter at the front lip
    const sy=X=>h-h*.075-Math.sin(X*.018)*h*.022-Math.sin(X*.05)*h*.008;
    const sg=x.createLinearGradient(0,h*.82,0,h); sg.addColorStop(0,mix(sd[3],'#000000',.15)); sg.addColorStop(1,mix(sd[3],'#ffffff',.12)); x.fillStyle=sg; x.beginPath(); x.moveTo(0,h); for(let X=0;X<=w;X+=8) x.lineTo(X,sy(X)); x.lineTo(w,h); x.closePath(); x.fill();
    x.strokeStyle=v3rgba(mix(sd[3],'#000000',.3),.35); x.lineWidth=1; for(let k=1;k<4;k++){ x.beginPath(); for(let X=0;X<=w;X+=10){ const Y=sy(X)+k*h*.022+Math.sin(X*.06+k)*1.5; X?x.lineTo(X,Y):x.moveTo(X,Y); } x.stroke(); }
    for(let i=0;i<120;i++){ x.fillStyle=v3rgba(i%2?mix(sd[3],'#ffffff',.4):mix(sd[3],'#000000',.35),.5); const X=r()*w; x.fillRect(X,sy(X)+r()*h*.07,1.3,1); }
    if(V.sand==='pebble'){ for(let i=0;i<46;i++){ const X=(i*37.3)%w; x.fillStyle=['#a8a89a','#6a6a62','#c8c0b0'][i%3]; x.beginPath(); x.ellipse(X,sy(X)+h*.03+((i*13)%10)*h*.004,4,2.5,0,0,7); x.fill(); x.fillStyle='rgba(255,255,255,.25)'; x.fillRect(X-2,sy(X)+h*.025+((i*13)%10)*h*.004,2,1); } }
    V3TANK={key,c:cc}; }
  c.drawImage(V3TANK.c,0,0,w,h);
  // light rays fanning down from the surface, fading with depth
  c.save(); c.globalCompositeOperation='lighter'; for(let i=0;i<6;i++){ const x0=w*(i/5)+Math.sin(t*.25+i*1.7)*w*.03, rw=w*(.04+(i%3)*.015), gr=c.createLinearGradient(0,0,0,h); gr.addColorStop(0,'rgba(190,235,255,.12)'); gr.addColorStop(1,'rgba(190,235,255,0)'); c.fillStyle=gr; c.beginPath(); c.moveTo(x0,0); c.lineTo(x0+rw,0); c.lineTo(x0+rw-w*.06,h); c.lineTo(x0-w*.1,h); c.closePath(); c.fill(); }
  // caustic shimmer on the sand
  if(S.settings.effects){ c.strokeStyle='rgba(220,250,255,.14)'; c.lineWidth=1; for(let i=0;i<16;i++){ const cx=w*((i*.0631)%1)+Math.sin(t*.4+i)*8, cy=h*(.9+((i*7)%5)*.015), R=w*.022; c.beginPath(); for(let j=0;j<=6;j++){ const a=j/6*6.283, rr=R*(.7+.3*Math.sin(t*1.5+i+j*1.9)); const X=cx+Math.cos(a)*rr, Y=cy+Math.sin(a)*rr*.3; j?c.lineTo(X,Y):c.moveTo(X,Y); } c.stroke(); } }
  c.restore();
  if(V.theme==='abyss'||V.theme==='midnight'){ c.save(); c.globalCompositeOperation='lighter'; for(let i=0;i<24;i++){ c.fillStyle='rgba(127,245,255,'+(.25+.25*Math.sin(t*2+i))+')'; c.beginPath(); c.arc((i*97+t*5)%w,(i*53)%h,1.5,0,7); c.fill(); } c.restore(); }
  // leafy kelp swaying
  for(let i=0;i<7;i++){ const x=(i+.5)*w/7+((i*29)%20)-10, hh=h*(.3+((i*17)%40)/100), base=h*.93, col=i%2?'#3f8f5a':'#2f7a4c';
    c.strokeStyle=col; c.lineWidth=Math.max(2,h*.012); c.lineCap='round'; c.beginPath(); const pts=[]; for(let k=0;k<=8;k++){ const u=k/8, px=x+Math.sin(t*.9+i+u*2.2)*h*.04*u, py=base-hh*u; pts.push([px,py]); k?c.lineTo(px,py):c.moveTo(px,py); } c.stroke();
    c.fillStyle=col; for(let k=2;k<8;k++){ const [px,py]=pts[k], sdx=k%2?1:-1, a=Math.sin(t*1.1+i+k)*.3; c.beginPath(); c.ellipse(px+sdx*h*.03,py,h*.035,h*.011,sdx*(.5+a),0,7); c.fill(); } }
  // bubbles rising from a little vent on the left
  for(let i=0;i<10;i++){ const k=((t*.25+i/10)%1), bx=w*.06+Math.sin(t*2+i*1.7)*w*.008, by=h*.9-k*h*.9, rr=1.5+(i%3)*1.2; c.strokeStyle='rgba(230,250,255,'+(.6*(1-k*.6))+')'; c.lineWidth=1; c.beginPath(); c.arc(bx,by,rr,0,7); c.stroke(); c.fillStyle='rgba(255,255,255,.5)'; c.fillRect(bx-rr*.4,by-rr*.5,1,1); }
  const ds=V.decor.filter(id=>id!=='duck'), AP=aqPositions(ds); ds.forEach(id=>drawDecor(c,id,w*AP[id],h*.95,tankK(w,h),t)); tankDragSetup();
  return true; }
// glass: a shimmering waterline at the top, a diagonal reflection, and darker corners
function v3TankGlass(c,w,h,t){ c.fillStyle='rgba(220,250,255,.18)'; c.fillRect(0,0,w,2); c.strokeStyle='rgba(220,250,255,.25)'; c.lineWidth=1; c.beginPath(); for(let X=0;X<=w;X+=12) c.lineTo(X,5+Math.sin(X*.05+t*2)*1.5); c.stroke();
  const rg=c.createLinearGradient(0,0,w*.4,h); rg.addColorStop(0,'rgba(255,255,255,0)'); rg.addColorStop(.48,'rgba(255,255,255,0)'); rg.addColorStop(.5,'rgba(255,255,255,.06)'); rg.addColorStop(.56,'rgba(255,255,255,0)'); c.fillStyle=rg; c.fillRect(0,0,w,h);
  const vg=c.createRadialGradient(w/2,h/2,h*.3,w/2,h/2,w*.6); vg.addColorStop(0,'rgba(0,0,0,0)'); vg.addColorStop(1,'rgba(0,4,12,.35)'); c.fillStyle=vg; c.fillRect(0,0,w,h); }

// ---------- Waters tab: a painted thumbnail of every area (rendered once, from the real scene code) ----------
const V3THUMB={};
{ const _rm=renderMap; renderMap=function(P){ _rm(P); if(V3ON) v3WaterThumbs(P); }; }
