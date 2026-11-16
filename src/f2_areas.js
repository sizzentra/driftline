
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
  x.save(); x.globalAlpha=reflA; x.beginPath(); x.rect(0,hz,W,H*.3); x.clip(); x.translate(0,hz); x.scale(1,-.72); x.translate(0,-hz); x.drawImage(cnv,0,0,cnv.width,Math.round(hz*DPR),0,0,W,hz); x.restore();
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
V3PAL.river = {
  day:  {top:'#6aa6d8', mid:'#a8d0ec', bot:'#eef0e2', glow:'#fff6d8', far:'#9ab8b0', farHaze:'#d0e2dc', hill:'#6a9a5e', back:'#4f8050', front:'#36603c', bank:'#5a8a4e', wTop:'#a8d4d8', wMid:'#5a9aa4', wBot:'#28525e', rim:'#fff4cc', stone:'#bab2a2', stoneD:'#8a8478', roof:'#7a4a3a', wood:'#7a5a3e', leaf:'#6aa65a', leafHi:'#c8e89a', cloud:'#ffffff', cloudLit:'#fff4e0', cabin:'#8a6a4a'},
  dusk: {top:'#2a2a5a', mid:'#c0607a', bot:'#ffc890', glow:'#ffd090', far:'#8a6a8e', farHaze:'#e89a98', hill:'#4a4a6a', back:'#3a3a5e', front:'#2a2a48', bank:'#3a3a5a', wTop:'#f0a088', wMid:'#7a5a86', wBot:'#1e2446', rim:'#ffc890', stone:'#9a8a98', stoneD:'#6a5a70', roof:'#5a3040', wood:'#5a3a3a', leaf:'#4a5a5a', leafHi:'#ffc08a', cloud:'#c87090', cloudLit:'#ffc8a0', cabin:'#5a4050'},
  night:{top:'#05091a', mid:'#111a3c', bot:'#26306a', glow:'#c8d4ff', far:'#252e56', farHaze:'#36407a', hill:'#1a2244', back:'#141c38', front:'#0c1228', bank:'#121a34', wTop:'#283268', wMid:'#121a40', wBot:'#04060e', rim:'#9fb4ff', stone:'#4a5070', stoneD:'#30344c', roof:'#20182a', wood:'#22202e', leaf:'#1a2638', leafHi:'#6f80c8', cloud:'#2a3058', cloudLit:'#5a66a0', cabin:'#20202e'}
};
V3SCENES.river = {
  land(x,P,hz,cnv){
    // distant rolling hills, layered with haze
    v3hillBand(x,hz+1,[[0,.1*H],[.18,.15*H],[.36,.11*H],[.55,.16*H],[.74,.12*H],[.92,.15*H],[1,.13*H]],mix(P.far,P.farHaze,.25));
    const hg=x.createLinearGradient(0,hz-.16*H,0,hz); hg.addColorStop(0,v3rgba(P.farHaze,0)); hg.addColorStop(1,v3rgba(P.farHaze,.45)); x.fillStyle=hg; x.fillRect(0,hz-.16*H,W,.16*H);
    v3hillBand(x,hz+1,[[0,.07*H],[.2,.05*H],[.4,.075*H],[.6,.045*H],[.8,.07*H],[1,.06*H]],P.hill);
    // groves of round trees on both banks (back row smaller and hazier)
    const r=v3rng(29);
    for(let i=0;i<10;i++){ const tx=W*(.02+i*.04+r()*.02); v3tree(x,tx,hz+1,H*(.07+r()*.03),Object.assign({},P,{leaf:mix(P.back,P.farHaze,.15)}),40+i,P.d*.2); }
    for(let i=0;i<5;i++){ const tx=W*(.8+i*.045+r()*.02); v3tree(x,tx,hz+1,H*(.07+r()*.03),Object.assign({},P,{leaf:mix(P.back,P.farHaze,.15)}),60+i,P.d*.2); }
    for(const [fx,fh,sd] of [[.04,.12,1],[.11,.1,2],[.19,.13,3],[.29,.09,4]]) v3tree(x,W*fx,hz+2,H*fh,Object.assign({},P,{leaf:P.front}),sd,P.d*.5);
    // the stone arch bridge across the river (arches cut out so the far hills show through; reflections come from the mirror pass)
    { const x0=W*.42, x1=W*.76, top=hz-H*.085, dh=H*.018, n=3, span=(x1-x0)/n, ar=Math.min(span*.42,(hz-top-dh*.6)/1.15), cyA=hz+1-ar*.15;
      const arches=(p)=>{ for(let i=0;i<n;i++){ const ax=x0+span*(i+.5); p.moveTo(ax+ar,hz+1); p.arc(ax,cyA,ar,0,Math.PI,true); p.closePath(); } };
      x.save(); x.beginPath(); x.rect(x0,top,x1-x0,hz-top+1); arches(x); x.fillStyle=P.stone; x.fill('evenodd'); x.clip('evenodd');
      x.strokeStyle=v3rgba(P.stoneD,.55); x.lineWidth=.8; const rowH=H*.011;
      for(let yy=top+rowH,row=0;yy<hz;yy+=rowH,row++){ x.beginPath(); x.moveTo(x0,yy); x.lineTo(x1,yy); for(let xx=x0+(row%2)*W*.011;xx<x1;xx+=W*.022){ x.moveTo(xx,yy); x.lineTo(xx,yy+rowH); } x.stroke(); }
      // light falls from the sun's side: a soft shadow across the far end, never a hard edge
      const sh=x.createLinearGradient(x0,0,x1,0); sh.addColorStop(0,'rgba(10,8,25,.22)'); sh.addColorStop(.5,'rgba(10,8,25,.05)'); sh.addColorStop(1,'rgba(0,0,0,0)'); x.fillStyle=sh; x.fillRect(x0,top,x1-x0,hz-top+1);
      // wet, mossy stone at the waterline on every pier
      const wl=x.createLinearGradient(0,hz-H*.016,0,hz); wl.addColorStop(0,v3rgba(P.leaf,0)); wl.addColorStop(.5,v3rgba(mix(P.leaf,'#000000',.3),.55)); wl.addColorStop(1,'rgba(10,15,25,.6)'); x.fillStyle=wl; x.fillRect(x0,hz-H*.016,x1-x0,H*.017);
      // a ring of wedge stones around each arch, with a keystone at the crown
      for(let i=0;i<n;i++){ const ax=x0+span*(i+.5), ro=ar*1.16; x.fillStyle=mix(P.stone,P.rim,.12); x.beginPath(); x.arc(ax,cyA,ro,Math.PI,0); x.arc(ax,cyA,ar,0,Math.PI,true); x.closePath(); x.fill();
        x.strokeStyle=v3rgba(P.stoneD,.7); x.lineWidth=.9; x.beginPath(); for(let k=1;k<11;k++){ const a=Math.PI+k/11*Math.PI; x.moveTo(ax+Math.cos(a)*ar,cyA+Math.sin(a)*ar); x.lineTo(ax+Math.cos(a)*ro,cyA+Math.sin(a)*ro); } x.stroke();
        x.fillStyle=mix(P.stone,P.rim,.25); x.beginPath(); x.moveTo(ax-ar*.09,cyA-ar); x.lineTo(ax-ar*.12,cyA-ro-ar*.05); x.lineTo(ax+ar*.12,cyA-ro-ar*.05); x.lineTo(ax+ar*.09,cyA-ar); x.closePath(); x.fill(); }
      x.restore();
      // the underside of each arch: the stone's thickness in shadow, deepest at the crown
      for(let i=0;i<n;i++){ const ax=x0+span*(i+.5); x.save(); x.beginPath(); x.arc(ax,cyA,ar,Math.PI,0); x.closePath(); x.clip();
        x.strokeStyle=v3rgba(P.stoneD,1); x.lineWidth=ar*.24; x.beginPath(); x.arc(ax,cyA+ar*.09,ar,Math.PI,0); x.stroke();
        x.strokeStyle='rgba(10,8,20,.3)'; x.lineWidth=ar*.08; x.beginPath(); x.arc(ax,cyA+ar*.15,ar*.94,Math.PI,0); x.stroke(); x.restore(); }
      // the deck with its lit edge, then a parapet with posts
      x.fillStyle=P.stoneD; x.fillRect(x0-W*.006,top-dh,(x1-x0)+W*.012,dh); x.fillStyle=v3rgba(P.rim,.4+P.d*.3); x.fillRect(x0-W*.006,top-dh,(x1-x0)+W*.012,1.2);
      x.fillStyle=P.stoneD; for(let i=0;i<=8;i++) x.fillRect(x0+i*(x1-x0)/8-1,top-dh*2,2.2,dh); x.fillRect(x0-W*.006,top-dh*2.2,(x1-x0)+W*.012,1.4); }
    // the mill on the right bank: stone base, timber upper floor, roof
    { const mx=W*.88, mb=hz-H*.005, mw=H*.13, mh=H*.08;
      x.fillStyle=P.stone; x.fillRect(mx-mw/2,mb-mh*.45,mw,mh*.45); x.fillStyle=v3rgba(P.stoneD,.6); for(let i=0;i<4;i++) x.fillRect(mx-mw/2,mb-mh*.45+i*mh*.11,mw,1);
      x.fillStyle=P.cabin; x.fillRect(mx-mw/2,mb-mh,mw,mh*.55); x.fillStyle=mix(P.cabin,'#000000',.3); for(let i=1;i<4;i++) x.fillRect(mx-mw/2+i*mw/4,mb-mh,1.4,mh*.55);
      x.fillStyle=P.roof; x.beginPath(); x.moveTo(mx-mw*.62,mb-mh+1); x.lineTo(mx,mb-mh*1.55); x.lineTo(mx+mw*.62,mb-mh+1); x.closePath(); x.fill();
      x.strokeStyle=v3rgba(P.rim,.35+P.d*.4); x.lineWidth=1; x.beginPath(); x.moveTo(mx+1,mb-mh*1.53); x.lineTo(mx+mw*.6,mb-mh); x.stroke();
      x.fillStyle=mix(P.cabin,'#000000',.5); x.fillRect(mx+mw*.12,mb-mh*.85,mw*.14,mh*.22); x.fillRect(mx-mw*.3,mb-mh*.85,mw*.14,mh*.22);
      x.fillStyle=mix(P.leaf,'#000000',.1); for(let i=0;i<6;i++){ x.beginPath(); x.arc(mx-mw/2+i*mw*.2,mb-mh*.45,H*.006,0,7); x.fill(); } }
    v3water(x,P,hz,cnv);
  },
  live(P,t,hz,sun){ const FX=S.settings.effects, d=P.d, night=P.night;
    // the mill window glows after dusk
    const lit=clamp(night*1.2+d*.8,0,1), mx=W*.88, mb=hz-H*.005, mw=H*.13, mh=H*.08;
    if(lit>.05){ for(const wx of [mx+mw*.12,mx-mw*.3]){ v3glow(g,wx+mw*.07,mb-mh*.74,mh*.6,'rgba(255,200,110,.9)',lit*.45); g.fillStyle=v3rgba('#ffcf7a',.3+lit*.7); g.fillRect(wx,mb-mh*.85,mw*.14,mh*.22); } }
    // the waterwheel turns, dripping
    { const wx=mx-mw*.62, wy=mb-mh*.18, R=mh*.55, a=t*.9; g.save(); g.translate(wx,wy); g.strokeStyle=P.wood; g.lineWidth=Math.max(1.4,H*.005); g.beginPath(); g.arc(0,0,R,0,7); g.stroke(); g.beginPath(); g.arc(0,0,R*.25,0,7); g.stroke();
      for(let i=0;i<8;i++){ const aa=a+i*Math.PI/4; g.beginPath(); g.moveTo(Math.cos(aa)*R*.25,Math.sin(aa)*R*.25); g.lineTo(Math.cos(aa)*R,Math.sin(aa)*R); g.stroke(); g.fillStyle=mix(P.wood,'#000000',.2); g.save(); g.translate(Math.cos(aa)*R,Math.sin(aa)*R); g.rotate(aa); g.fillRect(-R*.04,-R*.14,R*.22,R*.28); g.restore(); }
      g.restore(); if(FX){ g.fillStyle=v3rgba(mix(P.wTop,'#ffffff',.6),.6); for(let i=0;i<5;i++){ const k=((t*1.4+i/5)%1); g.fillRect(wx-R*.6+i*R*.3,wy+R*.2+k*R*.9,1.2,2.2); } for(let i=0;i<8;i++){ const u=i/7, a=.3+.3*Math.sin(t*4+i*2.1); g.fillStyle=v3rgba(mix(P.wTop,"#ffffff",.75),a); g.beginPath(); g.ellipse(wx-R*.9+u*R*1.8,mb+1.5+Math.sin(u*Math.PI)*R*.08,R*.13,R*.05,0,0,7); g.fill(); } } }
    v3glitter(P,t,hz,sun);
    v3mist(P,t,hz,.12*(1-night)*(1-d)+.16*d+.08*night);
    // fast current lines flowing right to left at many depths
    g.strokeStyle=v3rgba(mix(P.wTop,'#ffffff',.55),.28); g.lineWidth=1;
    for(let r0=0;r0<12;r0++){ const y=hz+H*.025+Math.pow(r0/12,1.4)*(H-hz)*.95, sp=W*(.06+r0*.012), len=W*(.02+r0*.006), spd=W*(.05+r0*.01);
      g.beginPath(); for(let X=W+sp-((t*spd+r0*71)%sp);X>-len;X-=sp){ const yy=y+Math.sin(X*.03+r0)*1.2; g.moveTo(X,yy); g.lineTo(X+len,yy+.4); } g.stroke(); }
    // river rocks with foam churning around them (kept off the casting line)
    const foam=mix(P.wTop,'#ffffff',.75);
    for(const [rx,ry,rw,sd] of [[.43,.62,.026,1],[.82,.88,.038,2],[.6,.95,.032,3]]){ const X=W*rx, Y=H*ry, w=W*rw;
      // dark wake behind the rock (downstream = left), then the rock, then foam on top
      g.fillStyle=v3rgba(P.wBot,.35); g.beginPath(); g.moveTo(X-w*.6,Y-w*.06); g.quadraticCurveTo(X-w*2.2,Y-w*.02,X-w*3.4,Y+w*.02); g.quadraticCurveTo(X-w*2.2,Y+w*.16,X-w*.6,Y+w*.14); g.closePath(); g.fill();
      v3rock(g,X,Y,w,w*.62,P,null,true,sd);
      // a pillow of water piling up against the upstream face, wobbling
      g.fillStyle=v3rgba(foam,.75); g.beginPath(); for(let i=0;i<=10;i++){ const a=-.55+i/10*1.45, rr=w*(1.06+.06*Math.sin(t*5+i*1.9+sd)); const px=X+Math.cos(a)*rr, py=Y+w*.05+Math.sin(a)*w*.15; i?g.lineTo(px,py):g.moveTo(px,py); } for(let i=10;i>=0;i--){ const a=-.55+i/10*1.45; g.lineTo(X+Math.cos(a)*w*.94,Y+w*.05+Math.sin(a)*w*.1); } g.closePath(); g.fill();
      // foam beads hugging the waterline, breathing
      for(let i=0;i<9;i++){ const u=i/8, bx=X-w*.95+u*w*1.9, by=Y+w*.1+Math.sin(u*Math.PI)*w*.06, a=.35+.3*Math.sin(t*3+i*2.3+sd); g.fillStyle=v3rgba(foam,a); g.beginPath(); g.ellipse(bx,by,w*(.09+.04*Math.sin(i*1.7)),w*.035,0,0,7); g.fill(); }
      // the V of the wake and bubbles riding it downstream
      g.strokeStyle=v3rgba(foam,.35); g.lineWidth=1; g.beginPath(); g.moveTo(X-w*.9,Y+w*.14); g.quadraticCurveTo(X-w*2,Y+w*.3,X-w*3.2,Y+w*.26); g.moveTo(X-w*.9,Y-w*.04); g.quadraticCurveTo(X-w*2,Y-w*.12,X-w*3.2,Y-w*.08); g.stroke();
      for(let i=0;i<7;i++){ const k=((t*.8+i/7)%1), fx=X-w*1.0-k*w*2.6, fy=Y+w*.05+Math.sin(k*7+i*2)*w*.1; g.fillStyle=v3rgba(foam,.6*(1-k)); g.beginPath(); g.ellipse(fx,fy,w*.08*(1-k*.6),w*.03,0,0,7); g.fill(); } }
    v3fishRing(P,t,hz,6.1,.45,.9);
    // a heron stands in the shallows by the far bank, dipping its head now and then
    { const hx=W*.955, hy=hz+H*.05, s=H*.0016, dip=((t%11)>9.6)?Math.sin(((t%11)-9.6)/1.4*Math.PI):0, hc=mix('#8a94a4',P.front,night*.6);
      g.strokeStyle=hc; g.lineWidth=s*2.6; g.beginPath(); g.moveTo(hx-s*3,hy); g.lineTo(hx-s*2,hy-s*16); g.moveTo(hx+s*1,hy); g.lineTo(hx,hy-s*16); g.stroke();
      g.fillStyle=hc; g.beginPath(); g.ellipse(hx-s*2,hy-s*20,s*8,s*5,-.3,0,7); g.fill(); g.strokeStyle=hc; g.lineWidth=s*2.2; g.beginPath(); g.moveTo(hx+s*4,hy-s*23); g.quadraticCurveTo(hx+s*9,hy-s*30+dip*s*10,hx+s*6+dip*s*8,hy-s*34+dip*s*18); g.stroke();
      g.fillStyle=hc; g.beginPath(); g.arc(hx+s*6+dip*s*8,hy-s*35+dip*s*18,s*2.6,0,7); g.fill(); g.fillStyle=mix('#e8b030',P.front,night*.5); g.beginPath(); g.moveTo(hx+s*8+dip*s*8,hy-s*35.5+dip*s*18); g.lineTo(hx+s*15+dip*s*10,hy-s*34+dip*s*22); g.lineTo(hx+s*8+dip*s*8,hy-s*34+dip*s*18); g.fill(); }
    // a kingfisher darts low over the water now and then
    if(FX&&night<.6){ const per=13, k=(t%per)/per; if(k<.18){ const e=k/.18, kx=W*(1.05-e*1.2), ky=hz+H*(.1+Math.sin(e*Math.PI*3)*.015), s=H*.006;
      g.strokeStyle=v3rgba('#5ac8e8',.25); g.lineWidth=2; g.beginPath(); g.moveTo(kx+s*2,ky); g.lineTo(kx+s*10,ky+s*.5); g.stroke();
      g.fillStyle='#2a8ad8'; g.beginPath(); g.ellipse(kx,ky,s*1.6,s*.9,0,0,7); g.fill(); g.fillStyle='#f08a3a'; g.beginPath(); g.ellipse(kx+s*.2,ky+s*.4,s*1,s*.5,0,0,7); g.fill(); g.fillStyle='#1a1a1a'; g.beginPath(); g.moveTo(kx-s*1.4,ky-s*.2); g.lineTo(kx-s*3,ky); g.lineTo(kx-s*1.4,ky+s*.2); g.fill(); } }
  },
  fore(P,t){ // river stones and ferns in the corner
    const b=H+2; v3rock(g,W*.95,b-H*.02,W*.05,H*.04,P); v3rock(g,W*.995,b-H*.05,W*.03,H*.03,P);
    for(let i=0;i<6;i++){ const fx=W*(.9+i*.015), sw=Math.sin(t*1.1+i)*H*.006; g.strokeStyle=mix('#4a8a4a',P.front,.3+P.night*.4); g.lineWidth=Math.max(1.2,H*.004); g.beginPath(); g.moveTo(fx,b); g.quadraticCurveTo(fx-H*.03+sw,b-H*.08,fx-H*.06+sw,b-H*.09); g.stroke();
      g.fillStyle=mix('#5a9a5a',P.front,.3+P.night*.4); for(let j=1;j<6;j++){ const k=j/6, px=fx-H*.06*k+sw*k, py=b-H*.085*Math.sin(k*Math.PI*.6); g.beginPath(); g.ellipse(px,py-H*.006,H*.008,H*.003,-.8,0,7); g.ellipse(px,py+H*.004,H*.008,H*.003,.6,0,7); g.fill(); } }
  }
};
