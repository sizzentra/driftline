
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
    riverVillage(x,P,hz);
    v3hillBand(x,hz+1,[[0,.07*H],[.2,.05*H],[.4,.075*H],[.6,.045*H],[.8,.07*H],[1,.06*H]],P.hill);
    // groves of round trees on both banks (back row smaller and hazier)
    const r=v3rng(29);
    for(let i=0;i<10;i++){ const tx=W*(.02+i*.04+r()*.02); v3tree(x,tx,hz+1,H*(.07+r()*.03),Object.assign({},P,{leaf:mix(P.back,P.farHaze,.15)}),40+i,P.d*.2); }
    for(let i=0;i<5;i++){ const tx=W*(.8+i*.045+r()*.02); v3tree(x,tx,hz+1,H*(.07+r()*.03),Object.assign({},P,{leaf:mix(P.back,P.farHaze,.15)}),60+i,P.d*.2); }
    // a hazy far row behind the groves, varied heights, so the banks read in depth
    for(let i=0;i<16;i++){ const tx=W*(i*.065+r()*.03); if(tx>W*.4&&tx<W*.78) continue; v3leafTree(x,tx,hz,H*(.045+r()*.03),P,90+i,{leaf:mix(P.back,P.farHaze,.45),wide:.3+r()*.12}); }
    for(const [fx,fh,sd] of [[.04,.12,1],[.11,.1,2],[.19,.13,3],[.29,.09,4]]) v3tree(x,W*fx,hz+2,H*fh,Object.assign({},P,{leaf:P.front}),sd,P.d*.5);
    v3bushes(x,-W*.01,W*.36,hz+3,H*.022,P,71,{leaf:mix(P.leaf,P.front,.3)}); v3bushes(x,W*.77,W*1.01,hz+3,H*.02,P,73,{leaf:mix(P.leaf,P.front,.3)});
    v3reeds(x,-W*.01,W*.3,hz+4,H*.03,mix(P.leaf,P.front,.45),75,{heads:mix(P.cabin,"#5a3a1a",.4)}); v3reeds(x,W*.8,W*1.01,hz+4,H*.028,mix(P.leaf,P.front,.45),77);
    v3flowers(x,W*.0,W*.34,hz+H*.004,hz+H*.016,["#f4e06a","#ffffff","#f49ac0"],79,30);
    // the stone arch bridge across the river (arches cut out so the far hills show through; reflections come from the mirror pass)
    { const x0=W*.42, x1=W*.76, top=hz-rvH()*.085, dh=rvH()*.018, n=3, span=(x1-x0)/n, ar=Math.min(span*.42,(hz-top-dh*.6)/1.15), cyA=hz+1-ar*.15;
      const arches=(p)=>{ for(let i=0;i<n;i++){ const ax=x0+span*(i+.5); p.moveTo(ax+ar,hz+1); p.arc(ax,cyA,ar,0,Math.PI,true); p.closePath(); } };
      // round 6 (director: "remove the grass behind each pillar"): through each arch you see the river running on upstream,
      // a far bank and hazy sky, instead of a wall of green hill
      x.save(); x.beginPath(); arches(x); x.clip();
      { const sky=x.createLinearGradient(0,top,0,hz); sky.addColorStop(0,mix(P.mid,P.farHaze,.5)); sky.addColorStop(1,mix(P.bot,P.farHaze,.4)); x.fillStyle=sky; x.fillRect(x0,top,x1-x0,hz-top+2);
        const bankY=hz-ar*.42; x.fillStyle=mix(P.back,P.farHaze,.55); x.beginPath(); x.moveTo(x0,bankY); for(let xx=x0;xx<=x1;xx+=W*.008) x.lineTo(xx,bankY-H*.006*(1+Math.sin(xx*.21)+Math.sin(xx*.07))); x.lineTo(x1,hz); x.lineTo(x0,hz); x.closePath(); x.fill();
        const wy=hz-ar*.3, wg=x.createLinearGradient(0,wy,0,hz+1); wg.addColorStop(0,mix(P.wTop,P.farHaze,.45)); wg.addColorStop(1,P.wTop); x.fillStyle=wg; x.fillRect(x0,wy,x1-x0,hz-wy+2);
        x.strokeStyle=v3rgba(P.rim,.35+P.d*.2); x.lineWidth=.8; x.beginPath(); for(let k=0;k<5;k++){ const yy=wy+(hz-wy)*(.2+k*.18); for(let xx=x0+((k*37)%23);xx<x1;xx+=W*.03){ x.moveTo(xx,yy); x.lineTo(xx+W*(.006+k*.002),yy); } } x.stroke(); }
      x.restore();
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
    { const mx=W*.88, mb=hz-H*.005, mw=rvH()*.13, mh=rvH()*.08;
      x.fillStyle=P.stone; x.fillRect(mx-mw/2,mb-mh*.45,mw,mh*.45); x.fillStyle=v3rgba(P.stoneD,.6); for(let i=0;i<4;i++) x.fillRect(mx-mw/2,mb-mh*.45+i*mh*.11,mw,1);
      x.fillStyle=P.cabin; x.fillRect(mx-mw/2,mb-mh,mw,mh*.55); x.fillStyle=mix(P.cabin,'#000000',.3); for(let i=1;i<4;i++) x.fillRect(mx-mw/2+i*mw/4,mb-mh,1.4,mh*.55);
      x.fillStyle=P.roof; x.beginPath(); x.moveTo(mx-mw*.62,mb-mh+1); x.lineTo(mx,mb-mh*1.55); x.lineTo(mx+mw*.62,mb-mh+1); x.closePath(); x.fill();
      x.strokeStyle=v3rgba(P.rim,.35+P.d*.4); x.lineWidth=1; x.beginPath(); x.moveTo(mx+1,mb-mh*1.53); x.lineTo(mx+mw*.6,mb-mh); x.stroke();
      x.fillStyle=mix(P.cabin,'#000000',.5); x.fillRect(mx+mw*.12,mb-mh*.85,mw*.14,mh*.22); x.fillRect(mx-mw*.3,mb-mh*.85,mw*.14,mh*.22);
      x.fillStyle=mix(P.leaf,'#000000',.1); for(let i=0;i<6;i++){ x.beginPath(); x.arc(mx-mw/2+i*mw*.2,mb-mh*.45,H*.006,0,7); x.fill(); } }
    v3water(x,P,hz,cnv);
    riverJetty(x,P,hz);
  },
  live(P,t,hz,sun){ const FX=S.settings.effects, d=P.d, night=P.night;
    // the mill window glows after dusk
    const lit=clamp(night*1.2+d*.8,0,1), mx=W*.88, mb=hz-H*.005, mw=rvH()*.13, mh=rvH()*.08;
    if(lit>.05){ for(const wx of [mx+mw*.12,mx-mw*.3]){ v3glow(g,wx+mw*.07,mb-mh*.74,mh*.6,'rgba(255,200,110,.9)',lit*.45); g.fillStyle=v3rgba('#ffcf7a',.3+lit*.7); g.fillRect(wx,mb-mh*.85,mw*.14,mh*.22); } }
    // the waterwheel (reworked in round 6, see cc_river06.js)
    riverWheel(P,t,hz,mx,mb,mw,mh,FX);
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
      /* thin, true-to-life legs with a little backward knee, standing in a slow ripple */
      { const lc=mix('#c8a060',P.front,.35+night*.4); g.strokeStyle=lc; g.lineWidth=Math.max(.6,s*.95); g.lineCap='round'; g.beginPath(); g.moveTo(hx-s*3.2,hy+s*1); g.lineTo(hx-s*2.6,hy-s*8); g.lineTo(hx-s*2.2,hy-s*16); g.moveTo(hx+s*.8,hy+s*1); g.lineTo(hx+s*.2,hy-s*8); g.lineTo(hx-s*.4,hy-s*16); g.stroke();
        g.fillStyle=lc; g.beginPath(); g.arc(hx-s*2.6,hy-s*8,s*.8,0,7); g.arc(hx+s*.2,hy-s*8,s*.8,0,7); g.fill();
        for(let k=0;k<2;k++){ const ph=((t*.35+k*.5)%1); g.strokeStyle=v3rgba(mix(P.wTop,'#ffffff',.5),.4*(1-ph)); g.lineWidth=Math.max(.5,s*.7); g.beginPath(); g.ellipse(hx-s*1.2,hy+s*1.2,s*(4+ph*9),s*(1+ph*2.2),0,0,7); g.stroke(); } }
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

// =====================================================================
// SALTMARSH COAST: breezy sea air, dunes with marram grass, a striped lighthouse on a rocky
// headland whose beam sweeps at dusk, rolling waves with foam, gulls, a crab on the pier
// =====================================================================
V3PAL.coast = {
  day:  {top:'#5aa8e0', mid:'#9cd0ee', bot:'#e8f4f0', glow:'#fffbe8', far:'#9ec4c8', farHaze:'#d8ecec', sand:'#e8d6a4', sandD:'#c8b07a', grass:'#8aa85a', wTop:'#9adcd8', wMid:'#3aa0a8', wBot:'#145a6a', rim:'#fffae0', stone:'#9a948a', stoneD:'#6a665e', lh:'#f4f0e6', lhS:'#c8483a', leaf:'#7a9a4a', leafHi:'#c8e08a', cloud:'#ffffff', cloudLit:'#fff8ea', wood:'#8a6a4a'},
  dusk: {top:'#2a2c5e', mid:'#d0687a', bot:'#ffcf8a', glow:'#ffd890', far:'#8a6a8a', farHaze:'#f0a08e', sand:'#c89a8a', sandD:'#8a6a7a', grass:'#6a6a5a', wTop:'#f8b088', wMid:'#8a5a88', wBot:'#1c2448', rim:'#ffcf90', stone:'#7a6a7a', stoneD:'#4a3a54', lh:'#f0d0c0', lhS:'#a8384a', leaf:'#5a5a50', leafHi:'#ffc890', cloud:'#d07890', cloudLit:'#ffd0a0', wood:'#5a3a3a'},
  night:{top:'#04081a', mid:'#0e1a3c', bot:'#22306a', glow:'#c8d4ff', far:'#1e2a50', farHaze:'#303e72', sand:'#3a4268', sandD:'#262c4c', grass:'#22304a', wTop:'#243466', wMid:'#101c40', wBot:'#03060e', rim:'#9fb4ff', stone:'#3a4060', stoneD:'#22263c', lh:'#8a94b8', lhS:'#4a3a5a', leaf:'#1a2638', leafHi:'#6f80c8', cloud:'#283058', cloudLit:'#5a66a0', wood:'#22202e'}
};
const V3CN=v3noise(17);
V3SCENES.coast = {
  land(x,P,hz,cnv){
    // the open sea runs to the horizon on the left; low dunes and a rocky headland rise on the right
    const sh=x.createLinearGradient(0,hz-H*.02,0,hz); sh.addColorStop(0,v3rgba(P.farHaze,0)); sh.addColorStop(1,v3rgba(P.farHaze,.6)); x.fillStyle=sh; x.fillRect(0,hz-H*.02,W,H*.02);
    // a distant dune line far left, barely there
    x.fillStyle=mix(P.far,P.farHaze,.4); x.beginPath(); x.moveTo(0,hz+1); x.lineTo(0,hz-H*.022); x.quadraticCurveTo(W*.06,hz-H*.032,W*.12,hz-H*.012); x.quadraticCurveTo(W*.16,hz-H*.004,W*.2,hz+1); x.closePath(); x.fill();
    // dunes on the right, two layers, with grass fringes
    v3hillBand(x,hz+1,[[.5,0],[.56,.012*H],[.64,.04*H],[.72,.03*H],[.8,.055*H],[.9,.05*H],[1,.06*H]],mix(P.sandD,P.farHaze,.3));
    x.save(); x.beginPath(); x.rect(W*.5,0,W*.5,H); x.clip();
    const dg=x.createLinearGradient(0,hz-H*.04,0,hz); dg.addColorStop(0,mix(P.sand,P.rim,.25)); dg.addColorStop(1,mix(P.sand,P.sandD,.6)); v3hillBand(x,hz+1,[[.52,0],[.6,.008*H],[.68,.026*H],[.76,.018*H],[.84,.034*H],[.93,.03*H],[1,.036*H]],dg);
    x.restore();
    const r=v3rng(71); x.strokeStyle=P.grass; x.lineWidth=1;
    for(let i=0;i<90;i++){ const gx=W*(.6+r()*.4), top=hz-H*(.008+.028*Math.max(0,(gx/W-.58)/.42))*(.7+r()*.3), gh=H*(.006+r()*.008); x.beginPath(); for(let k=0;k<3;k++){ x.moveTo(gx+k*1.2,top+gh*.2); x.quadraticCurveTo(gx+k*1.2-gh*.2,top-gh*.5,gx+k*1.2-gh*.6+k*.6,top-gh); } x.stroke(); }
    // a weathered fence line running over the dunes
    x.strokeStyle=mix(P.wood,P.farHaze,.3); x.lineWidth=1.2; for(let i=0;i<9;i++){ const fx=W*(.62+i*.022), fy=hz-H*(.012+i*.0022); x.beginPath(); x.moveTo(fx,fy); x.lineTo(fx+.6,fy-H*.012); x.stroke(); }
    x.beginPath(); x.moveTo(W*.62,hz-H*.02); x.quadraticCurveTo(W*.71,hz-H*.026,W*.8,hz-H*.036); x.stroke();
    // the rocky headland with the lighthouse
    { const lx=W*.86, base=hz-H*.03;
      for(const [ox,rh,rw,sd] of [[-.06,.03,.05,11],[.04,.035,.06,12],[-.01,.024,.045,13],[.07,.028,.035,14]]) v3rock(x,lx+W*ox,hz+H*.004,W*rw,H*rh,P,null,false,sd);
      const bw=H*.032, tw=H*.022, th=H*.2, ty=base-th;
      const tower=()=>{ x.beginPath(); x.moveTo(lx-bw,base); x.lineTo(lx-tw,ty); x.lineTo(lx+tw,ty); x.lineTo(lx+bw,base); x.closePath(); };
      x.fillStyle=P.lh; tower(); x.fill(); x.save(); tower(); x.clip();
      x.fillStyle=P.lhS; for(let i=0;i<3;i++){ const y0=base-th*(.18+i*.28); x.fillRect(lx-bw,y0-th*.12,bw*2,th*.12); }
      const tg=x.createLinearGradient(lx-bw,0,lx+bw,0); tg.addColorStop(0,'rgba(20,15,40,.38)'); tg.addColorStop(.45,'rgba(0,0,0,0)'); tg.addColorStop(.85,v3rgba(P.rim,.22)); tg.addColorStop(1,'rgba(20,15,40,.1)'); x.fillStyle=tg; x.fillRect(lx-bw,ty,bw*2,th);
      x.fillStyle='rgba(20,20,40,.5)'; x.fillRect(lx-tw*.18,base-th*.62,tw*.36,th*.06); x.fillRect(lx-tw*.2,base-th*.32,tw*.4,th*.07); x.restore();
      // the door and a little keeper's cottage beside it
      x.fillStyle=mix(P.lhS,'#000000',.4); x.beginPath(); x.moveTo(lx-bw*.25,base); x.lineTo(lx-bw*.25,base-th*.08); x.arc(lx,base-th*.08,bw*.25,Math.PI,0); x.lineTo(lx+bw*.25,base); x.fill();
      x.fillStyle=mix(P.lh,P.sandD,.25); x.fillRect(lx+bw*.9,base-H*.022,H*.04,H*.022); x.fillStyle=P.lhS; x.beginPath(); x.moveTo(lx+bw*.8,base-H*.021); x.lineTo(lx+bw*.9+H*.02,base-H*.036); x.lineTo(lx+bw*1.0+H*.04,base-H*.021); x.closePath(); x.fill();
      // gallery, lantern room frame, dome
      x.fillStyle=mix(P.stoneD,'#000000',.3); x.fillRect(lx-tw*1.45,ty-H*.004,tw*2.9,H*.005); x.fillRect(lx-tw*1.45,ty-H*.012,tw*2.9,1.2); for(let i=0;i<7;i++) x.fillRect(lx-tw*1.45+i*tw*2.9/6-.6,ty-H*.012,1.2,H*.008);
      x.fillStyle=mix(P.stoneD,'#000000',.4); x.fillRect(lx-tw*.8,ty-H*.032,1.6,H*.028); x.fillRect(lx+tw*.8-1.6,ty-H*.032,1.6,H*.028); x.fillRect(lx-1,ty-H*.032,2,H*.028);
      x.fillStyle=P.lhS; x.beginPath(); x.moveTo(lx-tw*1.05,ty-H*.031); x.quadraticCurveTo(lx,ty-H*.06,lx+tw*1.05,ty-H*.031); x.closePath(); x.fill();
      x.fillStyle=mix(P.stoneD,'#000000',.4); x.fillRect(lx-.8,ty-H*.066,1.6,H*.012); x.beginPath(); x.arc(lx,ty-H*.067,1.6,0,7); x.fill(); }
    v3water(x,P,hz,cnv,.3);
  },
  live(P,t,hz,sun){ const FX=S.settings.effects, night=P.night, d=P.d;
    // the lighthouse lamp; after dusk its beam sweeps round, flaring when it faces you
    { const lx=W*.86, ly=hz-H*.03-H*.2-H*.018, lit=clamp(night*1.4+d*1.1,0,1);
      if(lit>.04){ const a=t*.7, face=Math.cos(a), dir=Math.sin(a)>0?1:-1, len=W*(.35+.25*Math.abs(Math.sin(a)));
        /* 0.3.3: no hard beam; a layered soft glow that swells as the turning lamp faces you, and a shimmer on the water */
        const sw=.5+.5*face, soft=sw*sw;
        v3glow(g,lx,ly,H*.3,'rgba(255,226,160,.9)',lit*(.08+.1*soft)); v3glow(g,lx,ly,H*(.1+.04*soft),'rgba(255,236,180,.95)',lit*(.32+.3*soft)); v3glow(g,lx,ly,H*.035,'rgba(255,250,225,1)',lit*(.6+.35*soft));
        if(typeof v3lanternReflect==='function') v3lanternReflect(lx,hz+2,lit*(.55+.35*soft),t,'255,226,160');
        g.fillStyle=v3rgba('#fff6d0',.5+lit*.5); g.fillRect(lx-H*.012,ly-H*.008,H*.024,H*.016); }
      else { g.fillStyle=v3rgba(mix(P.farHaze,'#ffffff',.4),.7); g.fillRect(lx-H*.012,ly-H*.008,H*.024,H*.016); g.fillStyle=v3rgba(P.rim,.6); g.fillRect(lx+H*.003,ly-H*.007,H*.004,H*.014); } }
    v3glitter(P,t,hz,sun);
    // the surf where the sea meets the dunes, breathing in and out
    { const sw=Math.sin(t*.9)*W*.006; g.fillStyle=v3rgba(mix(P.wTop,'#ffffff',.7),.55); g.beginPath(); g.moveTo(W*.5,hz+1); for(let i=0;i<=20;i++){ const u=i/20, X=W*(.5+u*.5)+sw*u; g.lineTo(X,hz+1.5+Math.sin(u*25+t*2)*.8+u*H*.004); } g.lineTo(W,hz); g.closePath(); g.fill(); }
    // rolling swells, each with a lit face and a foamy crest, coming in toward you
    const foam=mix(P.wTop,'#ffffff',.78), N=7;
    for(let r0=0;r0<N;r0++){ const u=((t*.035+r0/N)%1), y=hz+H*.02+Math.pow(u,1.5)*(H-hz)*1.02, amp=1+u*H*.012, a=Math.sin(u*Math.PI), sp=W*(.18-u*.06), off=r0*137;
      if(a<.05) continue;
      g.fillStyle=v3rgba(P.wTop,.22*a); g.beginPath(); g.moveTo(0,y+amp*2);
      for(let X=0;X<=W+8;X+=8){ const yy=y-amp*(.6+.4*Math.sin((X+off)/sp*Math.PI*2+t*.6)); g.lineTo(X,yy); } g.lineTo(W,y+amp*2.5); g.closePath(); g.fill();
      g.strokeStyle=v3rgba(foam,.5*a); g.lineWidth=Math.max(1,u*2.2); g.beginPath();
      for(let X=0;X<=W;X+=6){ const yy=y-amp*(.6+.4*Math.sin((X+off)/sp*Math.PI*2+t*.6)), on=V3CN((X+off)*.012+r0*3.1)>.42; if(on){ g.moveTo(X,yy); g.lineTo(X+6,yy-.2); } } g.stroke();
      if(FX&&u>.35){ g.fillStyle=v3rgba(foam,.35*a); for(let i=0;i<10;i++){ const fx=((i*173+off)%W), fy=y+amp*(1.2+((i*31)%7)*.25); g.fillRect(fx,fy,2+u*3,1); } } }
    // gulls glide on the wind
    if(night<.7){ for(let i=0;i<3;i++){ const per=24+i*7, k=((t+i*9)%per)/per, gx=W*(1.1-k*1.3), gy=hz*(.35+i*.14)+Math.sin(t*.8+i)*hz*.03, s=H*(.006+i*.0015), fl=Math.sin(t*(3+i)+i)*.7;
        g.strokeStyle=v3rgba(mix('#ffffff',P.top,night*.8),.9); g.lineWidth=Math.max(1,s*.5); g.beginPath(); g.moveTo(gx-s*2.2,gy-s*fl*.8); g.quadraticCurveTo(gx-s,gy-s*(.4+fl*.6),gx,gy); g.quadraticCurveTo(gx+s,gy-s*(.4+fl*.6),gx+s*2.2,gy-s*fl*.8); g.stroke(); } }
    v3fishRing(P,t,hz,7.3,.42,.85);
  },
  fore(P,t){ // a sandy corner with marram grass bending in the wind
    const b=H+2, wind=Math.sin(t*1.3)*.5+Math.sin(t*2.9)*.2;
    g.fillStyle=mix(P.sand,P.wBot,.15); g.beginPath(); g.moveTo(W*.84,b); g.quadraticCurveTo(W*.92,b-H*.05,W+2,b-H*.07); g.lineTo(W+2,b); g.closePath(); g.fill();
    g.fillStyle=v3rgba(P.rim,.2); g.beginPath(); g.moveTo(W*.87,b-H*.012); g.quadraticCurveTo(W*.93,b-H*.052,W+2,b-H*.068); g.lineTo(W+2,b-H*.06); g.quadraticCurveTo(W*.93,b-H*.044,W*.87,b-H*.012); g.fill();
    for(let i=0;i<16;i++){ const fx=W*(.88+i*.0075), fy=b-H*(.02+i*.0028), h=H*(.06+((i*7)%5)*.012), bend=(wind+.6)*h*.35+Math.sin(t*3+i)*h*.04;
      g.strokeStyle=mix(i%3?P.grass:mix(P.grass,P.sand,.4),P.wBot,.1+P.night*.3); g.lineWidth=Math.max(1,H*.0025); g.beginPath(); g.moveTo(fx,fy); g.quadraticCurveTo(fx-bend*.3,fy-h*.6,fx-bend,fy-h); g.stroke(); }
  }
};

// the long sea pier: heavy pilings with cross bracing and barnacles, a rope railing, a life ring,
// a lamp at the end, and a crab that sidles along under the deck
function v3pier(P,t,night,dockY){
  const PW=W*.19, wd=mix(dockWood(),'#8a8a80',.25), N=c=>mix(c,'#0a1020',night*.55);
  const top=N(mix(wd,'#ffffff',.1)), face=N(mix(wd,'#000000',.22)), dark=N(mix(wd,'#000000',.48));
  const lit=clamp(night*1.2+P.d*.9,0,1), lx=PW-W*.008, ly=dockY-H*.1;
  if(lit>.05){ v3glow(g,lx,ly,H*.2,'rgba('+homeLight('255,214,140')+',.85)',lit*.55*(.95+.05*Math.sin(t*5.3)));
    v3lightPool(lx-W*.02,dockY-1,W*.085,homeLight('255,200,120'),.3*lit); v3lanternReflect(lx,dockY+H*.075,lit,t,homeLight('255,210,130')); }
  // pilings: thick, round-shaded, barnacles and weed at the tide line, X bracing between them
  const pw=Math.max(6,W*.013), xs=[W*.015,W*.085,W*.155];
  g.strokeStyle=N(mix(wd,'#000000',.4)); g.lineWidth=Math.max(2,W*.003);
  for(let i=0;i<2;i++){ const a=xs[i]+pw, b2=xs[i+1], y0=dockY+H*.02, y1=dockY+(H-dockY)*.45; g.beginPath(); g.moveTo(a,y0); g.lineTo(b2,y1); g.moveTo(b2,y0); g.lineTo(a,y1); g.stroke(); }
  for(const px of xs){ const pg=g.createLinearGradient(px,0,px+pw,0); pg.addColorStop(0,dark); pg.addColorStop(.4,face); pg.addColorStop(1,dark); g.fillStyle=pg; g.fillRect(px,dockY,pw,H-dockY);
    const ty=dockY+(H-dockY)*.5; g.fillStyle=v3rgba(P.wMid,.55); g.fillRect(px,ty,pw,H-ty); g.fillStyle=N('#2e5a42'); g.fillRect(px,ty-H*.012,pw,H*.02); g.fillStyle=N('#4a7a54'); g.fillRect(px,ty-H*.012,pw,1.5);
    g.fillStyle=N('#d8d0c0'); const r=v3rng(Math.round(px)); for(let k=0;k<7;k++){ g.beginPath(); g.arc(px+r()*pw,ty-r()*H*.02,1+r()*1.2,0,7); g.fill(); } }
  // deck
  const th=Math.max(4,H*.012), fh=Math.max(7,H*.02);
  g.fillStyle=top; g.fillRect(-2,dockY-th,PW+2,th); g.fillStyle=N(mix(wd,'#000000',.14)); for(let X=W*.012;X<PW;X+=W*.02) g.fillRect(X,dockY-th,1,th);
  g.fillStyle=face; g.fillRect(-2,dockY,PW+2,fh); g.fillStyle=N('#2a1a14'); for(let X=W*.01;X<PW;X+=W*.04){ g.fillRect(X,dockY+fh*.3,1.6,1.6); g.fillRect(X,dockY+fh*.7,1.6,1.6); }
  g.fillStyle=v3rgba(P.rim,.45+P.d*.25); g.fillRect(-2,dockY-th,PW+2,1); g.fillStyle='rgba(0,0,0,.3)'; g.fillRect(-2,dockY+fh,PW+2,2);
  // railing posts and a sagging rope along the back edge
  const rh=H*.05; g.fillStyle=N(mix(wd,'#000000',.3)); const rp=[W*.005,W*.065,W*.125]; for(const px of rp) g.fillRect(px,dockY-th-rh,Math.max(3,W*.004),rh);
  g.strokeStyle=N('#d8c09a'); g.lineWidth=1.4; g.beginPath(); for(let i=0;i<rp.length-1;i++){ const a=rp[i]+1.5, b2=rp[i+1]+1.5, y=dockY-th-rh*.82; g.moveTo(a,y); g.quadraticCurveTo((a+b2)/2,y+rh*.25,b2,y); } g.stroke();
  // a life ring hanging on the middle post
  { const cx=rp[1]+W*.002, cy=dockY-th-rh*.45, R=H*.016; g.lineWidth=R*.55; g.strokeStyle=N('#e8e4dc'); g.beginPath(); g.arc(cx,cy,R,0,7); g.stroke(); g.strokeStyle=N('#d8483a'); for(let k=0;k<4;k++){ g.beginPath(); g.arc(cx,cy,R,k*Math.PI/2,k*Math.PI/2+.6); g.stroke(); } }
  // the crab: sidles back and forth on the end piling, now and then waving a claw
  { const cx=xs[2]+pw/2+Math.sin(t*.6)*pw*.25, cy=dockY+fh+H*.016, s=H*.0045, wave=(t%7)<1?Math.sin(t*14)*.4:0, cc=N('#d0583a');
    g.fillStyle=cc; g.beginPath(); g.ellipse(cx,cy,s*2.4,s*1.4,0,0,7); g.fill(); g.strokeStyle=cc; g.lineWidth=s*.5;
    for(const sd of [-1,1]){ for(let k=0;k<3;k++){ g.beginPath(); g.moveTo(cx+sd*s*1.6,cy+s*.3); g.lineTo(cx+sd*s*(2.8+k*.5),cy+s*(1.6+k*.2)+Math.sin(t*8+k)*s*.3); g.stroke(); }
      g.save(); g.translate(cx+sd*s*2.2,cy-s*.8); g.rotate(sd*(-.4)+(sd>0?-wave:0)); g.beginPath(); g.ellipse(sd*s*.6,-s*.6,s*.9,s*.6,0,0,7); g.fill(); g.restore(); }
    g.fillStyle=N('#1a1a1a'); g.fillRect(cx-s*.9,cy-s*1.9,s*.6,s*.6); g.fillRect(cx+s*.3,cy-s*1.9,s*.6,s*.6); }
  // lamp post at the end (light first, then the pole over it)
  const pX=lx-1.5; g.fillStyle=N('#2c2a32'); g.fillRect(pX,ly+H*.012,3,dockY-th-(ly+H*.012)); g.fillRect(pX-3,dockY-th-2,9,2);
  const hw=H*.022, hh=H*.03; g.fillStyle=lit>.05?v3rgba('#ffe09a',.35+lit*.6):N('#7a7a88'); g.beginPath(); g.arc(lx,ly,hw*.55,0,7); g.fill();
  g.strokeStyle=N('#2c2a32'); g.lineWidth=1.4; g.beginPath(); g.arc(lx,ly,hw*.55,0,7); g.stroke(); g.fillStyle=N('#2c2a32'); g.beginPath(); g.moveTo(lx-hw*.7,ly-hw*.45); g.quadraticCurveTo(lx,ly-hh*.95,lx+hw*.7,ly-hw*.45); g.closePath(); g.fill();
  if(lit>.05){ g.fillStyle='#fff4cc'; g.beginPath(); g.arc(lx,ly+hw*.05,hw*.2,0,7); g.fill(); }
  // bait bucket
  { const bx=W*.152, s=H*.022; g.fillStyle=N("#5a7a9a"); g.beginPath(); g.moveTo(bx,dockY-th); g.lineTo(bx+s*.12,dockY-th-s); g.lineTo(bx+s*.88,dockY-th-s); g.lineTo(bx+s,dockY-th); g.closePath(); g.fill(); g.fillStyle=N('#8aa8c4'); g.fillRect(bx+s*.1,dockY-th-s,s*.8,1.4); }
}
V3PLAT.pier=(P,t,night,dockY)=>v3pier(P,t,night,dockY);

// =====================================================================
// FROSTBITE LAKE: blue hour over a frozen lake, snowy pines, an ice-fishing hut with a smoking
// stovepipe, an aurora rippling overhead, falling snow, glinting cracks, an owl and an arctic fox
// =====================================================================
V3PAL.frost = {
  day:  {top:'#6a8ad0', mid:'#a8bce8', bot:'#e8e4f4', glow:'#fff4f0', far:'#a0aad8', farHaze:'#dcdcf0', hill:'#c8d0ec', back:'#3e5a78', front:'#2a4058', snow:'#f6f8ff', snowD:'#b8c4e4', ice:'#d8e8f6', iceD:'#8aaad0', wTop:'#a8c0e0', wMid:'#4a6a9a', wBot:'#1a2a4a', rim:'#fff4ea', wood:'#7a5440', roof:'#5a3a30', leaf:'#3e5a78', cloud:'#f4f4ff', cloudLit:'#ffffff', aur:'#7af0b0'},
  dusk: {top:'#1e1e50', mid:'#8a5a9e', bot:'#f0a0b0', glow:'#ffc8b8', far:'#6a5a96', farHaze:'#c890b0', hill:'#9a88b8', back:'#2a2a4e', front:'#1e1e3a', snow:'#f0d8e8', snowD:'#9a88b8', ice:'#d8c0dc', iceD:'#7a6aa0', wTop:'#d8a0c0', wMid:'#5a4a86', wBot:'#141a3a', rim:'#ffd0c0', wood:'#5a3a3a', roof:'#40263a', leaf:'#2a2a4e', cloud:'#b07aa0', cloudLit:'#ffc8c0', aur:'#8af0c0'},
  night:{top:'#030614', mid:'#0a1434', bot:'#1a2a5a', glow:'#c8d4ff', far:'#1e2a54', farHaze:'#2c3a70', hill:'#33406e', back:'#0e1630', front:'#080e22', snow:'#8a9ac8', snowD:'#4a5a8a', ice:'#5a6a9a', iceD:'#2e3a64', wTop:'#22305e', wMid:'#0e1838', wBot:'#02040c', rim:'#a8c0ff', wood:'#24202e', roof:'#1a1624', leaf:'#0e1630', cloud:'#222a50', cloudLit:'#4a5690', aur:'#5af0a0'}
};
function v3snowPine(c,x,base,h,P,rimA){ v3pine(c,x,base,h,P.back,P.rim,rimA); const w=h*.42; c.fillStyle=P.snow;
  for(let i=0;i<4;i++){ const ty=base-h*.12-i*h*.2, tw=w*(1-i*.2), top=ty-h*.36; c.beginPath(); c.moveTo(x,top); c.quadraticCurveTo(x-tw*.18,ty-h*.22,x-tw*.36,ty-h*.08); c.quadraticCurveTo(x-tw*.1,ty-h*.16,x,ty-h*.14); c.quadraticCurveTo(x+tw*.12,ty-h*.18,x+tw*.3,ty-h*.1); c.quadraticCurveTo(x+tw*.16,ty-h*.24,x,top); c.fill(); } }
V3SCENES.frost = {
  sky(P,t,hz){ // the aurora: three slow ribbons with soft rays, brightest at night, a hint at dusk
    const a=clamp(P.night*1.1+P.d*.35,0,1)*(1-P.gloom); if(a<.03) return;
    g.save(); g.globalCompositeOperation='lighter';
    for(let r0=0;r0<3;r0++){ const y0=hz*(.42+r0*.1)-r0*hz*.04, hh=hz*(.3-r0*.06), col=r0===1?mix(P.aur,'#60e0ff',.4):P.aur, top=mix(P.aur,'#ff6ab8',.55), al=a*(.5-r0*.12), pts=[];
      for(let i=0;i<=40;i++){ const u=i/40, X=-W*.05+u*W*1.1; pts.push([X,y0+Math.sin(u*4+t*.15+r0*2.2)*hz*.07+Math.sin(u*11-t*.27+r0)*hz*.02-r0*u*hz*.08]); }
      const gr=g.createLinearGradient(0,y0+hz*.06,0,y0-hh); gr.addColorStop(0,v3rgba(col,0)); gr.addColorStop(.12,v3rgba(col,al)); gr.addColorStop(.45,v3rgba(col,al*.45)); gr.addColorStop(.8,v3rgba(top,al*.25)); gr.addColorStop(1,v3rgba(top,0)); g.fillStyle=gr;
      g.beginPath(); g.moveTo(pts[0][0],pts[0][1]); for(const [X,Y] of pts) g.lineTo(X,Y); for(let i=pts.length-1;i>=0;i--){ const [X,Y]=pts[i]; g.lineTo(X,Y-hh*(.75+.25*Math.sin(i*.7+t*.35+r0))); } g.closePath(); g.fill();
      g.lineCap="round"; for(let i=0;i<pts.length;i++){ const [X,Y]=pts[i], k=Math.abs(Math.sin(i*2.37+t*.45+r0*1.3)), q=Math.sin(i*5.1+r0)*.5+.5; if(k<.45) continue; g.strokeStyle=v3rgba(mix(col,"#ffffff",.25),al*.22*k); g.lineWidth=W*(.004+q*.006); g.beginPath(); g.moveTo(X+q*W*.01,Y-hh*.05); g.lineTo(X+q*W*.01+hz*.006,Y-hh*.8*k); g.stroke(); } g.lineCap="butt";
      g.strokeStyle=v3rgba(mix(col,"#ffffff",.4),al*.35); g.lineWidth=3; g.beginPath(); g.moveTo(pts[0][0],pts[0][1]); for(const [X,Y] of pts) g.lineTo(X,Y); g.stroke(); }
    g.restore(); },
  land(x,P,hz,cnv){
    v3range(x,{seed:53, base:hz+1, amp:.17*H, massifs:[[.12,.7,.16],[.3,1,.14],[.44,.75,.12],[.64,.85,.15],[.86,.95,.14]], light:mix(P.far,"#ffffff",.25), shadow:mix(P.far,"#1a1030",.3), haze:P.farHaze, snow:P.snow, snowLine:hz-.1*H, hazeA:.55});
    // snowy rolling hills
    x.fillStyle=P.hill; x.beginPath(); x.moveTo(0,hz+1); x.lineTo(0,hz-.04*H); x.bezierCurveTo(W*.15,hz-.065*H,W*.3,hz-.035*H,W*.45,hz-.025*H); x.bezierCurveTo(W*.6,hz-.05*H,W*.78,hz-.06*H,W,hz-.035*H); x.lineTo(W,hz+1); x.closePath(); x.fill();
    const hg=x.createLinearGradient(0,hz-.06*H,0,hz); hg.addColorStop(0,v3rgba(P.rim,.15)); hg.addColorStop(1,v3rgba(P.snowD,.4)); x.fillStyle=hg; x.fill();
    // snowy pine forests on both shores, back row hazier
    const r=v3rng(41);
    for(let X=-W*.01;X<W*.36;X+=W*.012) v3snowPine(x,X+r()*W*.006,hz+1,H*(.045+r()*.03),Object.assign({},P,{back:mix(P.back,P.farHaze,.35),snow:mix(P.snow,P.farHaze,.2)}),0);
    for(let X=W*.74;X<W*1.01;X+=W*.012) v3snowPine(x,X+r()*W*.006,hz+1,H*(.045+r()*.03),Object.assign({},P,{back:mix(P.back,P.farHaze,.35),snow:mix(P.snow,P.farHaze,.2)}),0);
    for(const [fx,fh] of [[.03,.13],[.08,.1],[.14,.12],[.2,.085],[.9,.11],[.96,.13]]) v3snowPine(x,W*fx,hz+3,H*fh,P,P.d*.4);
    v3water(x,P,hz,cnv,.25);
    // the frozen shelf: a band of ice at the far side with drifts, cracks and a bluish edge where the open lead begins
    const iy=hz+H*.035; x.fillStyle=P.ice; x.beginPath(); x.moveTo(0,hz); x.lineTo(W,hz); x.lineTo(W,iy-H*.004);
    for(let i=20;i>=0;i--){ const X=W*i/20; x.lineTo(X,iy+Math.sin(i*2.3)*H*.004+((i*7)%3)*H*.002); } x.closePath(); x.fill();
    const ig=x.createLinearGradient(0,hz,0,iy); ig.addColorStop(0,v3rgba(P.snow,.9)); ig.addColorStop(.6,v3rgba(P.ice,0)); x.fillStyle=ig; x.fillRect(0,hz,W,iy-hz);
    x.strokeStyle=P.iceD; x.lineWidth=Math.max(1.5,H*.004); x.beginPath(); for(let i=0;i<=20;i++){ const X=W*i/20, Y=iy+Math.sin(i*2.3)*H*.004+((i*7)%3)*H*.002; i?x.lineTo(X,Y):x.moveTo(X,Y); } x.stroke();
    x.fillStyle=P.snow; for(let i=0;i<9;i++){ const dx=W*(.05+i*.11+r()*.03); x.beginPath(); x.ellipse(dx,hz+H*.008,W*(.03+r()*.03),H*.006,0,Math.PI,0); x.fill(); }
    x.strokeStyle=v3rgba(P.iceD,.7); x.lineWidth=.9; for(let i=0;i<7;i++){ let X=W*(.1+i*.13), Y=hz+H*.012; x.beginPath(); x.moveTo(X,Y); for(let k=0;k<4;k++){ X+=W*(.01+r()*.012); Y+=H*(r()-.4)*.008; x.lineTo(X,Y); } x.stroke(); }
    // the ice-fishing hut: plank walls, a snow-heavy roof, a stovepipe, a sled by the door
    { const hx=W*.66, hb=hz+H*.014, hw=H*.06, hh=H*.042;
      x.fillStyle=P.wood; x.fillRect(hx-hw/2,hb-hh,hw,hh); x.fillStyle=mix(P.wood,'#000000',.3); for(let k=1;k<5;k++) x.fillRect(hx-hw/2+k*hw/5,hb-hh,1,hh);
      x.fillStyle='rgba(0,0,0,.22)'; x.fillRect(hx+hw*.1,hb-hh,hw*.4,hh);
      x.fillStyle=mix(P.wood,'#000000',.45); x.fillRect(hx-hw*.36,hb-hh*.62,hw*.18,hh*.62); x.fillRect(hx+hw*.08,hb-hh*.72,hw*.2,hh*.24);
      x.fillStyle=P.roof; x.beginPath(); x.moveTo(hx-hw*.62,hb-hh+1); x.lineTo(hx,hb-hh*1.6); x.lineTo(hx+hw*.62,hb-hh+1); x.closePath(); x.fill();
      x.fillStyle=P.snow; x.beginPath(); x.moveTo(hx-hw*.66,hb-hh+1); x.lineTo(hx,hb-hh*1.66); x.lineTo(hx+hw*.66,hb-hh+1); x.quadraticCurveTo(hx+hw*.5,hb-hh*.9,hx+hw*.4,hb-hh*1.05); x.quadraticCurveTo(hx,hb-hh*1.35,hx-hw*.4,hb-hh*1.05); x.quadraticCurveTo(hx-hw*.55,hb-hh*.88,hx-hw*.66,hb-hh+1); x.fill();
      x.fillStyle=mix(P.wood,'#222222',.6); x.fillRect(hx+hw*.22,hb-hh*1.75,hw*.07,hh*.55); x.fillRect(hx+hw*.2,hb-hh*1.78,hw*.11,hh*.06);
      x.fillStyle=P.snow; x.beginPath(); x.ellipse(hx,hb,hw*.75,H*.004,0,Math.PI,0); x.fill();
      x.strokeStyle=mix(P.lhS||'#b8483a',P.night>.5?'#202030':'#b8483a',P.night); x.lineWidth=1.2; x.beginPath(); x.moveTo(hx+hw*.6,hb-1); x.lineTo(hx+hw*1.05,hb-1); x.quadraticCurveTo(hx+hw*1.12,hb-1,hx+hw*1.12,hb-H*.006); x.stroke(); x.fillStyle=mix('#9a5a3a',P.front,P.night*.6); x.fillRect(hx+hw*.62,hb-H*.006,hw*.42,H*.004); }
  },
  live(P,t,hz,sun){ const FX=S.settings.effects, night=P.night, d=P.d;
    const hx=W*.66, hb=hz+H*.014, hw=H*.06, hh=H*.042, lit=clamp(night*1.2+d*.8,0,1);
    if(lit>.05){ v3glow(g,hx+hw*.18,hb-hh*.6,hh*.9,'rgba(255,190,110,.9)',lit*.45); g.fillStyle=v3rgba('#ffcf7a',.3+lit*.7); g.fillRect(hx+hw*.08,hb-hh*.72,hw*.2,hh*.24); }
    // smoke curling up from the stovepipe, drifting with the breeze
    if(FX){ for(let i=0;i<7;i++){ const k=((t*.12+i/7)%1), sx=hx+hw*.255+k*W*.03+Math.sin(k*6+t*.5)*W*.004, sy=hb-hh*1.8-k*H*.09, rr=H*(.004+k*.012);
      g.fillStyle=v3rgba(mix(P.snow,P.farHaze,.4),.35*(1-k)); g.beginPath(); g.arc(sx,sy,rr,0,7); g.fill(); } }
    v3glitter(P,t,hz,sun);
    // cracks in the ice catch the light
    for(let i=0;i<6;i++){ const k=(t*.3+i*.37)%1, gx=W*(.12+i*.14), gy=hz+H*(.01+(i%3)*.007), a=Math.max(0,Math.sin(k*Math.PI))**6; if(a<.05) continue; g.fillStyle=v3rgba('#ffffff',a);
      g.fillRect(gx-H*.006,gy,H*.012,1); g.fillRect(gx,gy-H*.006,1,H*.012); }
    // ice floes drifting in the open lead
    for(const [fx,fy,fw,sp] of [[.5,.18,.05,1],[.78,.3,.035,1.4],[.35,.42,.028,.8]]){ const X=((W*fx-t*W*.004*sp)%(W*1.2)+W*1.2)%(W*1.2)-W*.1, Y=hz+H*fy+Math.sin(t*.8+fx*9)*1.2, w=W*fw;
      g.fillStyle=v3rgba(P.wBot,.4); g.beginPath(); g.ellipse(X,Y+w*.09,w,w*.14,0,0,7); g.fill();
      g.fillStyle=P.ice; g.beginPath(); g.moveTo(X-w,Y); g.lineTo(X-w*.6,Y-w*.12); g.lineTo(X+w*.4,Y-w*.14); g.lineTo(X+w,Y-w*.02); g.lineTo(X+w*.7,Y+w*.06); g.lineTo(X-w*.8,Y+w*.06); g.closePath(); g.fill();
      g.fillStyle=P.snow; g.beginPath(); g.moveTo(X-w*.85,Y-w*.02); g.lineTo(X-w*.55,Y-w*.12); g.lineTo(X+w*.4,Y-w*.14); g.lineTo(X+w*.85,Y-w*.03); g.closePath(); g.fill();
      g.strokeStyle=v3rgba(P.rim,.4); g.lineWidth=1; g.beginPath(); g.moveTo(X-w*.55,Y-w*.12); g.lineTo(X+w*.4,Y-w*.14); g.stroke(); }
    // the arctic fox trots along the shelf now and then, stops, looks around
    { const per=40, k=(t%per)/per; if(k<.7){ const e=k/.7, ep=e<.44?e/.44*.5:e<.56?.5:.5+(e-.56)/.44*.5, fxp=W*(1.06-ep*1.14), stop=e>=.44&&e<.56, /* crosses the whole shelf: in from the right, out on the left */ fy=hz+H*.016, s=H*.0042, step=stop?0:Math.sin(t*12), fc=mix('#f8f8ff',P.snowD,.15+night*.5);
        g.fillStyle=fc; g.beginPath(); g.ellipse(fxp,fy-s*3.2,s*3.2,s*1.6,0,0,7); g.fill(); g.beginPath(); g.arc(fxp-s*3.2,fy-s*4.4,s*1.4,0,7); g.fill();
        g.beginPath(); g.moveTo(fxp-s*4.2,fy-s*4.4); g.lineTo(fxp-s*5.4,fy-s*4); g.lineTo(fxp-s*4,fy-s*3.6); g.fill(); g.beginPath(); g.moveTo(fxp-s*3.6,fy-s*5.4); g.lineTo(fxp-s*3.4,fy-s*6.6); g.lineTo(fxp-s*2.8,fy-s*5.5); g.fill();
        g.beginPath(); g.ellipse(fxp+s*4.4,fy-s*3.6,s*2.6,s*1.1,-.4+(stop?Math.sin(t*6)*.2:0),0,7); g.fill();
        g.strokeStyle=fc; g.lineWidth=s*.7; g.beginPath(); for(const [lx,ph] of [[-2,0],[-1.2,Math.PI],[1.6,Math.PI],[2.4,0]]){ g.moveTo(fxp+lx*s,fy-s*2); g.lineTo(fxp+lx*s+step*s*.8*Math.cos(ph),fy); } g.stroke();
        g.fillStyle='#1a1a24'; g.beginPath(); g.arc(fxp-s*5.3,fy-s*4,s*.35,0,7); g.fill(); } }
    // the owl on the near pine: blinks, turns its head
    { const ox=W*.08, oy=hz+3-H*.1*.62, s=H*.0042, turn=Math.sin(t*.4)>.7?1:Math.sin(t*.4)<-.8?-1:0, blink=(t%5.3)<.15, oc=mix('#c8b8a8',P.back,.2+night*.4);
      g.fillStyle=oc; g.beginPath(); g.ellipse(ox,oy,s*2.6,s*3.4,0,0,7); g.fill(); g.beginPath(); g.arc(ox+turn*s*.4,oy-s*3.6,s*2.3,0,7); g.fill();
      g.fillStyle=mix('#f4ece0',P.back,night*.4); g.beginPath(); g.ellipse(ox,oy+s*.6,s*1.6,s*2.2,0,0,7); g.fill();
      g.beginPath(); g.moveTo(ox-s*2+turn*s*.4,oy-s*5.2); g.lineTo(ox-s*1.4+turn*s*.4,oy-s*6.4); g.lineTo(ox-s*.9+turn*s*.4,oy-s*5.4); g.moveTo(ox+s*2+turn*s*.4,oy-s*5.2); g.lineTo(ox+s*1.4+turn*s*.4,oy-s*6.4); g.lineTo(ox+s*.9+turn*s*.4,oy-s*5.4); g.fillStyle=oc; g.fill();
      if(blink){ g.strokeStyle='#2a2020'; g.lineWidth=s*.4; g.beginPath(); for(const sd of [-1,1]){ g.moveTo(ox+turn*s*.6+sd*s*1.3,oy-s*3.8); g.lineTo(ox+turn*s*.6+sd*s*.4,oy-s*3.8); } g.stroke(); }
      else { for(const sd of [-1,1]){ g.fillStyle=night>.4?'#ffd860':'#f0c040'; g.beginPath(); g.arc(ox+turn*s*.6+sd*s*.85,oy-s*3.8,s*.7,0,7); g.fill(); g.fillStyle='#1a1414'; g.beginPath(); g.arc(ox+turn*s*.7+sd*s*.85,oy-s*3.8,s*.35,0,7); g.fill(); } }
      g.fillStyle='#d8a040'; g.beginPath(); g.moveTo(ox+turn*s*.6-s*.3,oy-s*3.2); g.lineTo(ox+turn*s*.6+s*.3,oy-s*3.2); g.lineTo(ox+turn*s*.6,oy-s*2.5); g.fill(); }
    v3fishRing(P,t,hz,7.9,.45,.88);
    // falling snow, gentle, drifting sideways (more of it when effects are on)
    const nF=FX?70:25; g.fillStyle=v3rgba('#ffffff',.75);
    for(let i=0;i<nF;i++){ const sp=.25+((i*37)%10)/20, X=((i*97.3+t*W*.012+Math.sin(t*.7+i)*W*.01)%(W+20))-10, Y=((i*53.1+t*H*.04*sp)%(H+10))-5, r=.8+((i*13)%4)*.35; g.globalAlpha=.4+.5*((i*7)%5)/5; g.beginPath(); g.arc(X,Y,r,0,7); g.fill(); }
    g.globalAlpha=1;
  },
  fore(P,t){ // a snowdrift corner with frosted reeds and a few icicles hanging from a bough
    const b=H+2; g.fillStyle=P.snow; g.beginPath(); g.moveTo(W*.82,b); g.quadraticCurveTo(W*.9,b-H*.07,W+2,b-H*.09); g.lineTo(W+2,b); g.closePath(); g.fill();
    g.fillStyle=v3rgba(P.snowD,.6); g.beginPath(); g.moveTo(W*.86,b); g.quadraticCurveTo(W*.93,b-H*.035,W+2,b-H*.045); g.lineTo(W+2,b); g.closePath(); g.fill();
    v3rock(g,W*.97,b-H*.05,W*.03,H*.02,P,mix(P.snowD,P.front,.3),false,77); g.fillStyle=P.snow; g.beginPath(); g.ellipse(W*.968,b-H*.068,W*.026,H*.008,0,Math.PI,0); g.fill();
    for(const [cx,n] of [[.895,7],[.932,5]]){ const fx=W*cx, fy=b-H*(.03+(cx-.88)*.7); for(let i=0;i<n;i++){ const u=i/(n-1)-.5, h=H*(.05+((i*5)%3)*.014), sw=Math.sin(t*.9+i+cx*9)*H*.003, tx=fx+u*H*.05+sw, ty=fy-h*(1-Math.abs(u)*.4);
      g.strokeStyle=mix(i%2?'#c8b08a':'#a89070',P.front,.25+P.night*.45); g.lineWidth=Math.max(1,H*.0024); g.beginPath(); g.moveTo(fx+u*H*.006,fy); g.quadraticCurveTo(fx+u*H*.02,fy-h*.65,tx,ty); g.stroke(); } }
  }
};

// standing on the lake ice: a thick slab with a snowy top and translucent blue layers, icicles at the edge,
// an auger in the snow, a red tackle box, and a lantern on a stake
function v3icePlat(P,t,night,dockY){
  const PW=W*.19, N=c=>mix(c,'#0a1020',night*.4), lit=clamp(night*1.2+P.d*.9,0,1), lx=PW-W*.012, ly=dockY-H*.085;
  if(lit>.05){ v3glow(g,lx,ly,H*.18,'rgba('+homeLight('255,210,140')+',.85)',lit*.55*(.94+.06*Math.sin(t*6.3)));
    v3lightPool(lx-W*.02,dockY-1,W*.085,homeLight('255,200,130'),.3*lit); }
  const ed=PW+W*.012, path=()=>{ g.beginPath(); g.moveTo(-2,dockY); g.lineTo(ed-W*.01,dockY); g.lineTo(ed,dockY+H*.02); g.lineTo(ed+W*.006,H*.78); g.lineTo(ed-W*.004,H+2); g.lineTo(-2,H+2); g.closePath(); };
  const ig=g.createLinearGradient(0,dockY,0,H); ig.addColorStop(0,N(P.ice)); ig.addColorStop(.3,N(mix(P.ice,P.iceD,.6))); ig.addColorStop(1,N(mix(P.iceD,P.wBot,.6))); g.fillStyle=ig; path(); g.fill();
  g.save(); path(); g.clip();
  g.strokeStyle=v3rgba(P.rim,.22); g.lineWidth=1; for(let k=0;k<6;k++){ const y=dockY+H*.03+k*H*.05; g.beginPath(); g.moveTo(-2,y); g.quadraticCurveTo(PW*.5,y+H*.008*Math.sin(k*1.7),ed+W*.01,y+H*.004); g.stroke(); }
  g.fillStyle=v3rgba('#ffffff',.25); g.beginPath(); g.moveTo(ed-W*.01,dockY); g.lineTo(ed,dockY+H*.02); g.lineTo(ed+W*.006,H*.78); g.lineTo(ed-W*.006,H*.78); g.lineTo(ed-W*.014,dockY+H*.03); g.closePath(); g.fill();
  g.fillStyle=v3rgba(P.wBot,.25); for(let k=0;k<5;k++){ g.beginPath(); g.ellipse(PW*(.15+k*.18),dockY+H*(.08+((k*3)%4)*.04),W*.006,H*.003,0,0,7); g.fill(); } g.restore();
  // snow cap with a soft lip, icicles under the lip
  g.fillStyle=N(P.snow); g.beginPath(); g.moveTo(-2,dockY+2); g.lineTo(-2,dockY-H*.008); g.quadraticCurveTo(PW*.4,dockY-H*.016,ed-W*.012,dockY-H*.006); g.quadraticCurveTo(ed-W*.002,dockY-H*.002,ed-W*.004,dockY+H*.006); g.quadraticCurveTo(PW*.5,dockY+H*.004,-2,dockY+2); g.fill();
  g.fillStyle=v3rgba(P.rim,.45); g.fillRect(-2,dockY-H*.012,ed-W*.02,1);
  g.fillStyle=N(mix(P.ice,'#ffffff',.4)); for(let k=0;k<5;k++){ const ix=ed-W*.004-k*W*.004, il=H*(.012+((k*7)%3)*.008); g.beginPath(); g.moveTo(ix-1.6,dockY+H*.004); g.lineTo(ix+1.6,dockY+H*.004); g.lineTo(ix,dockY+H*.004+il); g.closePath(); g.fill(); }
  // auger standing in the snow
  { const ax=W*.03; g.strokeStyle=N('#8a8a96'); g.lineWidth=2; g.beginPath(); g.moveTo(ax,dockY-H*.004); g.lineTo(ax,dockY-H*.07); g.stroke(); g.strokeStyle=N('#5a5a66'); g.lineWidth=1.4; for(let k=0;k<4;k++){ g.beginPath(); g.moveTo(ax-3,dockY-H*(.01+k*.01)); g.lineTo(ax+3,dockY-H*(.016+k*.01)); g.stroke(); }
    g.strokeStyle=N('#c8483a'); g.lineWidth=2.4; g.beginPath(); g.moveTo(ax-H*.014,dockY-H*.07); g.lineTo(ax+H*.014,dockY-H*.07); g.stroke(); }
  // red tackle box
  { const bx=W*.152, s=H*.02; g.fillStyle=N('#c8483a'); g.fillRect(bx,dockY-H*.008-s*.75,s*1.3,s*.75); g.fillStyle=N('#a0302a'); g.fillRect(bx,dockY-H*.008-s*.75,s*1.3,s*.18); g.fillStyle=N('#e8d8a0'); g.fillRect(bx+s*.55,dockY-H*.008-s*.62,s*.2,s*.12); }
  // lantern on a stake
  const pX=lx-1.2; g.fillStyle=N('#3a2a2a'); g.fillRect(pX,ly+H*.016,2.4,dockY-H*.006-(ly+H*.016));
  const hw=H*.018, hh=H*.026; g.fillStyle=lit>.05?v3rgba('#ffd27a',.35+lit*.6):N('#7a7a88'); g.fillRect(lx-hw/2,ly-hh/2,hw,hh);
  if(lit>.05){ g.fillStyle='#fff2c4'; g.beginPath(); g.ellipse(lx,ly+hh*.08,hw*.16,hh*.22*(1+Math.sin(t*13)*.08),0,0,7); g.fill(); }
  g.strokeStyle=N('#2c2232'); g.lineWidth=1.3; g.strokeRect(lx-hw/2,ly-hh/2,hw,hh); g.fillStyle=N('#2c2232'); g.beginPath(); g.moveTo(lx-hw*.7,ly-hh/2); g.lineTo(lx,ly-hh*.95); g.lineTo(lx+hw*.7,ly-hh/2); g.closePath(); g.fill();
}
V3PLAT.ice=(P,t,night,dockY)=>v3icePlat(P,t,night,dockY);

// =====================================================================
// CORAL SHALLOWS: tropical noon, turquoise water so clear the reef shows through, caustic light
// dancing on the sand, palms with a hammock, a beach hut on stilts, a turtle and parrots
// =====================================================================
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
V3SCENES.reef = {
  land(x,P,hz,cnv){
    // far volcanic islands on the horizon
    for(const [ix,iw,ih] of [[.1,.11,.06],[.24,.06,.035],[.5,.05,.025]]){ x.fillStyle=mix(P.isl,P.farHaze,.5); x.beginPath(); x.moveTo(W*(ix-iw),hz+1); x.quadraticCurveTo(W*(ix-iw*.4),hz-H*ih*1.2,W*ix,hz-H*ih); x.quadraticCurveTo(W*(ix+iw*.4),hz-H*ih*1.1,W*(ix+iw),hz+1); x.closePath(); x.fill(); }
    // the sandy spit on the right with palms, hammock and the hut on stilts
    x.fillStyle=P.sand; x.beginPath(); x.moveTo(W*.6,hz+1); x.quadraticCurveTo(W*.72,hz-H*.016,W*.84,hz-H*.02); x.quadraticCurveTo(W*.94,hz-H*.026,W,hz-H*.02); x.lineTo(W,hz+1); x.closePath(); x.fill();
    x.fillStyle=mix(P.sand,P.wTop,.4); x.fillRect(W*.6,hz-1,W*.4,2);
    for(let i=0;i<14;i++){ x.fillStyle=mix(P.frondD,P.farHaze,.15); const bx=W*(.66+i*.024); x.beginPath(); x.ellipse(bx,hz-H*.014-Math.sin(i*1.3)*H*.003,W*.016,H*.012,0,Math.PI,0); x.fill(); }
    // the stilt hut out over the shallows
    { const hx=W*.57, hb=hz-H*.002, hw=H*.07, hh=H*.035, deck=hb-H*.024;
      x.strokeStyle=mix(P.trunk,'#000000',.35); x.lineWidth=Math.max(1.4,H*.004); for(const sx of [-.45,-.15,.15,.45]){ x.beginPath(); x.moveTo(hx+hw*sx,hb+H*.004); x.lineTo(hx+hw*sx,deck); x.stroke(); }
      x.fillStyle=mix(P.trunk,'#000000',.2); x.fillRect(hx-hw*.62,deck-H*.004,hw*1.24,H*.005);
      x.fillStyle=P.hut; x.fillRect(hx-hw/2,deck-hh,hw,hh); x.fillStyle=mix(P.hut,'#000000',.25); for(let k=1;k<6;k++) x.fillRect(hx-hw/2+k*hw/6,deck-hh,1,hh);
      x.fillStyle='rgba(0,0,0,.2)'; x.fillRect(hx+hw*.1,deck-hh,hw*.4,hh);
      x.fillStyle=mix(P.hut,'#000000',.5); x.fillRect(hx-hw*.3,deck-hh*.75,hw*.16,hh*.3); x.fillRect(hx+hw*.12,deck-hh*.75,hw*.16,hh*.3);
      x.fillStyle=P.thatch; x.beginPath(); x.moveTo(hx-hw*.75,deck-hh+H*.004); x.lineTo(hx,deck-hh-H*.05); x.lineTo(hx+hw*.75,deck-hh+H*.004); x.closePath(); x.fill();
      x.strokeStyle=mix(P.thatch,'#000000',.2); x.lineWidth=.8; for(let k=0;k<10;k++){ const u=k/9; x.beginPath(); x.moveTo(hx,deck-hh-H*.048); x.lineTo(hx-hw*.75+u*hw*1.5,deck-hh+H*.004); x.stroke(); }
      x.fillStyle=mix(P.thatch,'#000000',.12); for(let k=0;k<12;k++){ x.beginPath(); x.moveTo(hx-hw*.75+k*hw*.125,deck-hh+H*.003); x.lineTo(hx-hw*.69+k*hw*.125,deck-hh+H*.01); x.lineTo(hx-hw*.63+k*hw*.125,deck-hh+H*.003); x.fill(); }
      x.strokeStyle=mix(P.trunk,'#000000',.2); x.lineWidth=1; x.beginPath(); x.moveTo(hx+hw*.62,deck-H*.004); x.lineTo(hx+hw*1.3,hz-H*.016); x.stroke(); }
    // palms and the hammock slung between two of them
    v3palm(x,W*.74,hz-H*.016,H*.16,.18,P,3); v3palm(x,W*.83,hz-H*.02,H*.19,-.1,P,5); v3palm(x,W*.93,hz-H*.024,H*.15,.12,P,9);
    { const a=[W*.74+H*.16*.18*.75,hz-H*.016-H*.075], b=[W*.83-H*.19*.1*.65,hz-H*.02-H*.08]; x.strokeStyle=mix('#f0e0c0',P.trunk,.2); x.lineWidth=1; x.beginPath(); x.moveTo(a[0],a[1]); x.lineTo(a[0]+W*.012,a[1]+H*.02); x.moveTo(b[0],b[1]); x.lineTo(b[0]-W*.012,b[1]+H*.02); x.stroke();
      const hg=x.createLinearGradient(0,a[1],0,a[1]+H*.035); hg.addColorStop(0,mix('#e8604a',P.night>.5?'#303048':'#e8604a',P.night)); hg.addColorStop(1,mix('#f0c050',P.night>.5?'#303048':'#f0c050',P.night)); x.fillStyle=hg;
      x.beginPath(); x.moveTo(a[0]+W*.012,a[1]+H*.02); x.quadraticCurveTo((a[0]+b[0])/2,a[1]+H*.05,b[0]-W*.012,b[1]+H*.02); x.quadraticCurveTo((a[0]+b[0])/2,a[1]+H*.036,a[0]+W*.012,a[1]+H*.02); x.fill(); }
    v3water(x,P,hz,cnv,.3);
    // the reef below the surface: pale sand, then a few reef patches (rock mounds crowded with brain coral,
    // staghorn, sea fans, tube sponges and anemones), all seen through water that thickens with distance
    { const r=v3rng(88), top=hz+H*.09, corals=[P.coral,P.coral2,P.coral3];
      const sb=x.createLinearGradient(0,top,0,H); sb.addColorStop(0,v3rgba(mix(P.sand,P.wMid,.6),.0)); sb.addColorStop(.5,v3rgba(mix(P.sand,P.wMid,.5),.35)); sb.addColorStop(1,v3rgba(mix(P.sand,P.wMid,.35),.5)); x.fillStyle=sb; x.fillRect(0,top,W,H-top);
      for(const [px,py,ps] of [[.42,.52,.8],[.7,.6,1],[.92,.48,.7],[.55,.86,1.25],[.86,.9,1.15],[.33,.78,.9]]){
        const cx=W*px, cy=H*py; if(cy<hz+H*.08) continue; const k=clamp((cy-hz)/(H-hz),0,1), sc=H*.075*ps*(.5+k*.7), fade=.55-k*.3, rr=v3rng(Math.round(px*100+py*7));
        // rock base mound
        x.fillStyle=mix(mix(mix('#a8957a',P.wBot,P.night*.75),P.wMid,fade+.08),P.sand,.12); x.beginPath(); x.moveTo(cx-sc*2.3,cy); x.quadraticCurveTo(cx-sc*1.6,cy-sc*.55,cx-sc*.6,cy-sc*.5); x.quadraticCurveTo(cx,cy-sc*.75,cx+sc*.8,cy-sc*.45); x.quadraticCurveTo(cx+sc*1.8,cy-sc*.4,cx+sc*2.3,cy); x.closePath(); x.fill();
        x.fillStyle=v3rgba(P.wBot,.25); x.beginPath(); x.ellipse(cx,cy+sc*.05,sc*2.3,sc*.18,0,0,7); x.fill();
        const items=[]; for(let i=0;i<11;i++) items.push([cx+(rr()-.5)*sc*3.6,cy-sc*.1-rr()*sc*.4,i%5,rr()]); items.sort((a,b)=>a[1]-b[1]);
        for(const [ix,iy,kind,q] of items){ const s=sc*(.35+q*.35), col=mix(corals[(kind+Math.floor(q*3))%3],P.wMid,fade); x.fillStyle=col; x.strokeStyle=col;
          if(kind===0){ // brain coral: a dome with winding grooves
            x.beginPath(); x.ellipse(ix,iy,s*.9,s*.62,0,Math.PI,0); x.closePath(); x.fill(); x.strokeStyle=v3rgba(mix(col,'#000000',.35),.6); x.lineWidth=Math.max(.6,s*.05); x.beginPath(); for(let g2=0;g2<3;g2++){ const yy=iy-s*(.12+g2*.16); x.moveTo(ix-s*.7+g2*s*.12,yy); for(let k2=0;k2<5;k2++) x.quadraticCurveTo(ix-s*.55+g2*s*.12+k2*s*.25,yy-s*.08*(k2%2?1:-1),ix-s*.45+g2*s*.12+k2*s*.25,yy); } x.stroke();
            x.fillStyle=v3rgba(P.rim,.18); x.beginPath(); x.ellipse(ix-s*.25,iy-s*.42,s*.35,s*.1,-.2,0,7); x.fill(); }
          else if(kind===1){ // staghorn: forking branches with pale tips
            x.lineCap='round'; const br=(bx,by,a,len,dp)=>{ const ex=bx+Math.cos(a)*len, ey=by+Math.sin(a)*len; x.lineWidth=Math.max(1,s*.13*(1-dp*.25)); x.beginPath(); x.moveTo(bx,by); x.lineTo(ex,ey); x.stroke(); if(dp<2){ br(ex,ey,a-.45,len*.68,dp+1); br(ex,ey,a+.4,len*.7,dp+1); } else { x.fillStyle=mix(col,'#ffffff',.35); x.beginPath(); x.arc(ex,ey,Math.max(.8,s*.06),0,7); x.fill(); x.fillStyle=col; } };
            br(ix,iy,-Math.PI/2-.3,s*.45,0); br(ix,iy,-Math.PI/2+.35,s*.4,0); x.lineCap='butt'; }
          else if(kind===2){ // sea fan: a lacy fan on a short stalk
            x.globalAlpha=.8; x.beginPath(); x.moveTo(ix,iy); x.quadraticCurveTo(ix-s*1.1,iy-s*.9,ix-s*.35,iy-s*1.5); x.quadraticCurveTo(ix+s*.2,iy-s*1.7,ix+s*.7,iy-s*1.25); x.quadraticCurveTo(ix+s*1.05,iy-s*.7,ix,iy); x.fill(); x.globalAlpha=1;
            x.strokeStyle=v3rgba(mix(col,'#ffffff',.3),.5); x.lineWidth=.7; x.beginPath(); for(let b2=0;b2<6;b2++){ const a=-Math.PI*.82+b2*.23; x.moveTo(ix,iy); x.quadraticCurveTo(ix+Math.cos(a)*s*.6,iy+Math.sin(a)*s*.7,ix+Math.cos(a)*s*1.2,iy+Math.sin(a)*s*1.45); } x.stroke(); }
          else if(kind===3){ // tube sponges: a cluster of upright tubes with dark mouths
            for(let tb=0;tb<3;tb++){ const tx2=ix+(tb-1)*s*.32, th2=s*(.7+((tb*7)%3)*.25); x.fillStyle=col; x.fillRect(tx2-s*.12,iy-th2,s*.24,th2); x.fillStyle=mix(col,'#000000',.45); x.beginPath(); x.ellipse(tx2,iy-th2,s*.12,s*.05,0,0,7); x.fill(); x.fillStyle=v3rgba(P.rim,.15); x.fillRect(tx2-s*.1,iy-th2,s*.05,th2); } }
          else { // anemone: soft tentacles in a tuft
            x.lineCap='round'; x.lineWidth=Math.max(1,s*.09); x.beginPath(); for(let tn=0;tn<7;tn++){ const a=-Math.PI/2+(tn-3)*.28; x.moveTo(ix,iy); x.quadraticCurveTo(ix+Math.cos(a)*s*.3,iy+Math.sin(a)*s*.45,ix+Math.cos(a)*s*.55+Math.sin(tn)*s*.1,iy+Math.sin(a)*s*.65); } x.stroke(); x.lineCap='butt'; } } }
      // the water column over everything, thicker with distance
      const tg=x.createLinearGradient(0,top,0,H); tg.addColorStop(0,v3rgba(P.wMid,.5)); tg.addColorStop(.45,v3rgba(P.wMid,.15)); tg.addColorStop(1,v3rgba(P.wBot,.22)); x.fillStyle=tg; x.fillRect(0,top-H*.05,W,H-top+H*.05); }
  },
  live(P,t,hz,sun){ const FX=S.settings.effects, night=P.night, d=P.d;
    v3glitter(P,t,hz,sun);
    // caustics: a wobbling web of light on the sandy bottom, finer far away and bolder close up
    const ca=(1-night*.85)*(1-P.gloom)*(.13+.06*(1-d)); if(FX&&ca>.03){ g.save(); g.globalCompositeOperation='lighter'; g.lineJoin='round';
      const nR=15, nC=30, y0=hz+H*.035, pt=(r,c)=>{ const k=Math.pow(r/nR,1.35), y=y0+k*(H-y0+H*.05), ch=(H-y0)/nR*(.5+k*1.2), cw=W*1.1/nC; return [-W*.05+c*cw+Math.sin(t*1.05+c*1.7+r*2.3)*cw*.34+Math.sin(c*3.1+r*1.9)*cw*.2, y+Math.cos(t*.85+c*2.1+r*1.3)*ch*.3]; };
      const line=(get,n)=>{ let p0=get(0); g.moveTo(p0[0],p0[1]); for(let i=1;i<n;i++){ const p1=get(i), p2=get(Math.min(n-1,i+1)); g.quadraticCurveTo(p1[0],p1[1],(p1[0]+p2[0])/2,(p1[1]+p2[1])/2); } };
      for(let r=0;r<=nR;r++){ const k=r/nR, fade=Math.min(1,k*3.2); /* rows fade in with distance: no hard top edge */ g.strokeStyle=v3rgba(mix(P.wTop,'#ffffff',.7),ca*(.35+k*.65)*fade*fade); g.lineWidth=.6+k*1.8; g.beginPath(); line(c=>pt(r,c),nC+1); g.stroke(); }
      const vg=g.createLinearGradient(0,y0,0,y0+(H-y0)*.4); vg.addColorStop(0,v3rgba(mix(P.wTop,'#ffffff',.7),0)); vg.addColorStop(1,v3rgba(mix(P.wTop,'#ffffff',.7),ca*.75)); for(let c=0;c<=nC;c++){ g.strokeStyle=vg; g.lineWidth=1.1; g.beginPath(); line(r=>pt(r,c),nR+1); g.stroke(); }
      g.restore(); }
    // the sea turtle surfaces now and then for a breath, then glides back down
    { const per=19, k=(t%per)/per; if(k<.32){ const e=k/.32, up=Math.sin(e*Math.PI), tx=W*(.62-e*.12), ty=hz+H*.2+(1-up)*H*.03, s=H*.007, tc=mix('#6a8a4a',P.wMid,Math.min(1,(1-up)*.6+night*.55));
        g.globalAlpha=.35+up*.65; g.fillStyle=mix(tc,'#c8b878',.3); for(const [fx,fy,ro] of [[-1.6,.6,.6+Math.sin(t*3)*.4],[1.4,.7,-.6-Math.sin(t*3)*.4]]){ g.save(); g.translate(tx+fx*s,ty+fy*s); g.rotate(ro); g.beginPath(); g.ellipse(0,s*.8,s*.5,s*1.4,0,0,7); g.fill(); g.restore(); }
        g.fillStyle=tc; g.beginPath(); g.ellipse(tx,ty,s*2.6,s*1.6,0,0,7); g.fill(); g.strokeStyle=v3rgba(mix(tc,'#000000',.4),.7); g.lineWidth=.8; g.beginPath(); g.moveTo(tx-s*1.5,ty); g.lineTo(tx+s*1.5,ty); g.moveTo(tx,ty-s*1.4); g.lineTo(tx,ty+s*1.4); g.stroke();
        g.fillStyle=mix(tc,'#c8b878',.35); g.beginPath(); g.ellipse(tx-s*3,ty-s*.2-up*s*.6,s*.9,s*.75,0,0,7); g.fill(); g.fillStyle='#1a1a1a'; g.fillRect(tx-s*3.4,ty-s*.5-up*s*.6,s*.35,s*.35); g.globalAlpha=1;
        if(up>.7){ g.strokeStyle=v3rgba('#ffffff',(up-.7)*1.6); g.lineWidth=1; g.beginPath(); g.ellipse(tx-s*.5,ty,s*4*(1.5-up*.5),s*1.2,0,0,7); g.stroke(); } } }
    // parrots flit between the palms
    if(night<.6){ const per=17, k=(t%per)/per; if(k<.25){ const e=k/.25; for(let i=0;i<2;i++){ const px=W*(.95-e*.35-i*.02), py=hz-H*(.12+Math.sin(e*Math.PI)*.08)-i*H*.012, s=H*.005, fl=Math.sin(t*16+i*2);
        g.fillStyle=i?'#3a8ae8':'#e83a3a'; g.beginPath(); g.ellipse(px,py,s*1.8,s*.8,-.1,0,7); g.fill(); g.fillStyle=i?'#f0d040':'#3aa8e8'; g.beginPath(); g.moveTo(px-s*.2,py); g.lineTo(px+s*.6,py-s*2.4*fl); g.lineTo(px+s*1.2,py); g.fill();
        g.fillStyle=i?'#3a8ae8':'#e83a3a'; g.beginPath(); g.moveTo(px+s*1.6,py); g.lineTo(px+s*3.4,py+s*.6); g.lineTo(px+s*1.6,py+s*.4); g.fill(); g.fillStyle='#f0e0a0'; g.beginPath(); g.moveTo(px-s*1.8,py-s*.2); g.lineTo(px-s*2.4,py+s*.2); g.lineTo(px-s*1.7,py+s*.3); g.fill(); } } }
    // a small school of fish darts across the reef
    if(FX){ const per=11, k=(t%per)/per, sx=W*(1.1-k*1.4), sy=hz+H*.34+Math.sin(t*.7)*H*.02; g.fillStyle=v3rgba(mix('#ffd84a',P.wMid,.45),.7*(1-night*.7)); for(let i=0;i<7;i++){ const fx=sx+(i%4)*W*.012+Math.sin(t*3+i)*2, fy=sy+Math.floor(i/4)*H*.012+(i%2)*H*.006; g.beginPath(); g.ellipse(fx,fy,H*.006,H*.0025,0,0,7); g.fill(); g.beginPath(); g.moveTo(fx+H*.005,fy); g.lineTo(fx+H*.009,fy-H*.003); g.lineTo(fx+H*.009,fy+H*.003); g.fill(); } }
    v3fishRing(P,t,hz,6.7,.42,.85);
  },
  fore(P,t){ // a palm frond reaching in from the top right corner, swaying
    const sw=Math.sin(t*.8)*.04+Math.sin(t*1.9)*.015, ox=W+H*.02, oy=-H*.04, L=H*.34, a=Math.PI*.72+sw, ex=ox+Math.cos(a)*L, ey=oy+Math.sin(a)*L, cx=ox+Math.cos(a-.25)*L*.5, cy=oy+Math.sin(a-.25)*L*.5;
    g.strokeStyle=mix(P.frondD,'#000000',.2); g.lineWidth=Math.max(2,H*.006); g.beginPath(); g.moveTo(ox,oy); g.quadraticCurveTo(cx,cy,ex,ey); g.stroke();
    for(let k=1;k<16;k++){ const u=k/16, mx=(1-u)*(1-u)*ox+2*u*(1-u)*cx+u*u*ex, my=(1-u)*(1-u)*oy+2*u*(1-u)*cy+u*u*ey, ll=H*.07*(1-u*.55), wob=Math.sin(t*2.2+k)*.06;
      for(const sd of [-1,1]){ const aa=a+sd*(1.1+wob)+.35; g.fillStyle=k%2?P.frond:P.frondD; g.beginPath(); g.moveTo(mx,my); g.quadraticCurveTo(mx+Math.cos(aa)*ll*.5+sd*2,my+Math.sin(aa)*ll*.5,mx+Math.cos(aa)*ll,my+Math.sin(aa)*ll+ll*.25); g.quadraticCurveTo(mx+Math.cos(aa)*ll*.4,my+Math.sin(aa)*ll*.4+ll*.2,mx,my+H*.004); g.fill(); } }
  }
};

// standing on the beach: a sand bank with wet sand at the edge, gentle waves lapping, shells and a
// starfish, a striped towel, and a tiki torch that lights up after dusk
function v3sandPlat(P,t,night,dockY){
  const PW=W*.19, N=c=>mix(c,'#0a1020',night*.35), lit=clamp(night*1.2+P.d*.9,0,1), tx=PW-W*.006, ty=dockY-H*.095;
  if(lit>.05){ v3glow(g,tx,ty,H*.2,'rgba('+homeLight('255,170,80')+',.9)',lit*.55*(.9+.1*Math.sin(t*9)*Math.sin(t*4.1))); }
  const ed=PW+W*.035, path=()=>{ g.beginPath(); g.moveTo(-2,dockY-H*.006); g.quadraticCurveTo(PW*.6,dockY-H*.012,ed-W*.02,dockY); g.quadraticCurveTo(ed+W*.012,dockY+H*.07,ed+W*.004,H+2); /* 0.3.3: the beach stays left of the shortest cast, so fish always come out of the water */ g.lineTo(-2,H+2); g.closePath(); };
  const sg=g.createLinearGradient(0,dockY,0,H); sg.addColorStop(0,N(P.sand)); sg.addColorStop(1,N(P.sandD)); g.fillStyle=sg; path(); g.fill();
  g.save(); path(); g.clip();
  // the wash: water slides up the beach in a thin sheet with a foam lip, then drains back, leaving darker wet sand.
  // The shore follows the beach edge exactly; the sheet is the edge pulled inland by the swash distance.
  const edge=(off,u)=>{ const v=1-u, x0=ed-W*.02, y0=dockY, cx=ed+W*.012, cy=dockY+H*.07, x1=ed+W*.004, y1=H+2; return [v*v*x0+2*v*u*cx+u*u*x1-off*(.6+.4*u), v*v*y0+2*v*u*cy+u*u*y1]; };
  const sw=(Math.sin(t*.55)+1)/2, reach=W*(.006+.02*sw*sw*(3-2*sw));
  g.fillStyle=v3rgba(mix(P.sandD,P.wMid,.35),.55); g.beginPath(); for(let i=0;i<=16;i++){ const [x,y]=edge(W*.028,i/16); i?g.lineTo(x,y):g.moveTo(x,y); } for(let i=16;i>=0;i--){ const [x,y]=edge(0,i/16); g.lineTo(x+2,y); } g.closePath(); g.fill();
  const r=v3rng(19); for(let i=0;i<40;i++){ g.fillStyle=v3rgba(i%2?P.sandD:P.rim,.35); g.fillRect(r()*ed,dockY+r()*(H-dockY),1.5,1.2); }
  g.restore();
  { g.fillStyle=v3rgba(mix(P.wTop,'#ffffff',.35),.5); g.beginPath(); for(let i=0;i<=48;i++){ const [x,y]=edge(reach*(1+.22*Math.sin(i/48*9+t*1.1)+.1*Math.sin(i/48*23-t*.7)),i/48); i?g.lineTo(x,y):g.moveTo(x,y); } for(let i=16;i>=0;i--){ const [x,y]=edge(-W*.004,i/16); g.lineTo(x,y); } g.closePath(); g.fill();
    g.strokeStyle=v3rgba('#ffffff',(.55+.3*Math.cos(t*.55))*(1-night*.5)); g.lineWidth=2; g.beginPath(); for(let i=0;i<=48;i++){ const [x,y]=edge(reach*(1+.22*Math.sin(i/48*9+t*1.1)+.1*Math.sin(i/48*23-t*.7)),i/48); const yy=y; i?g.lineTo(x,yy):g.moveTo(x,yy); } g.stroke();
    if(S.settings.effects){ g.fillStyle=v3rgba('#ffffff',.6*(1-night*.5)); for(let i=1;i<14;i+=2){ const [x,y]=edge(reach+W*.003,i/16); g.fillRect(x+Math.sin(t*3+i)*1.5,y,1.4,1.4); } } }
  g.fillStyle=v3rgba(P.rim,.5); g.fillRect(-2,dockY-H*.008,ed-W*.04,1);
  // striped towel, shells, a starfish
  { const bx=W*.025, by=dockY-H*.004; g.fillStyle=N('#3a8ae0'); g.beginPath(); g.moveTo(bx,by); g.lineTo(bx+W*.05,by-H*.003); g.lineTo(bx+W*.055,by+H*.008); g.lineTo(bx+W*.004,by+H*.011); g.closePath(); g.fill(); g.fillStyle=N('#f4f0e0'); for(let k=1;k<5;k+=2){ g.beginPath(); g.moveTo(bx+W*.011*k,by-H*.0006*k); g.lineTo(bx+W*.011*(k+1),by-H*.0006*(k+1)); g.lineTo(bx+W*.011*(k+1)+W*.001,by+H*.011-H*.0006*(k+1)); g.lineTo(bx+W*.011*k+W*.001,by+H*.011-H*.0006*k); g.closePath(); g.fill(); } }
  { const sx=W*.15, sy=dockY+H*.05, s=H*.012; g.fillStyle=N('#ff8a5a'); g.save(); g.translate(sx,sy); g.rotate(.3); g.beginPath(); for(let i=0;i<5;i++){ const a=i/5*Math.PI*2-Math.PI/2; g.lineTo(Math.cos(a)*s,Math.sin(a)*s); g.lineTo(Math.cos(a+.63)*s*.42,Math.sin(a+.63)*s*.42); } g.closePath(); g.fill(); g.fillStyle=N('#ffc0a0'); for(let i=0;i<5;i++){ const a=i/5*Math.PI*2-Math.PI/2; g.fillRect(Math.cos(a)*s*.5-.6,Math.sin(a)*s*.5-.6,1.2,1.2); } g.restore(); }
  g.fillStyle=N('#f8e8e0'); for(const [sx,sy] of [[.06,.09],[.11,.14]]){ g.beginPath(); g.arc(W*sx,dockY+H*sy,H*.006,Math.PI,0); g.fill(); g.strokeStyle=N('#d8b8a8'); g.lineWidth=.6; g.beginPath(); for(let k=-2;k<=2;k++){ g.moveTo(W*sx,dockY+H*sy); g.lineTo(W*sx+k*H*.0025,dockY+H*sy-H*.005); } g.stroke(); }
  // tiki torch: bamboo pole, a woven head, a living flame after dusk
  g.fillStyle=N('#b89a5a'); g.fillRect(tx-1.4,ty+H*.012,2.8,dockY-ty-H*.012); g.fillStyle=N('#8a6a3a'); for(let k=0;k<4;k++) g.fillRect(tx-1.6,ty+H*(.025+k*.02),3.2,1);
  g.fillStyle=N('#7a5a30'); g.beginPath(); g.moveTo(tx-H*.009,ty-H*.004); g.lineTo(tx+H*.009,ty-H*.004); g.lineTo(tx+H*.006,ty+H*.016); g.lineTo(tx-H*.006,ty+H*.016); g.closePath(); g.fill();
  if(lit>.05){ const fl=1+Math.sin(t*11)*.12+Math.sin(t*7.3)*.08; g.fillStyle=v3rgba('#ff8a2a',.6+lit*.4); g.beginPath(); g.moveTo(tx-H*.008,ty-H*.003); g.quadraticCurveTo(tx-H*.006,ty-H*.02*fl,tx+Math.sin(t*5)*H*.002,ty-H*.03*fl); g.quadraticCurveTo(tx+H*.007,ty-H*.018*fl,tx+H*.008,ty-H*.003); g.fill();
    g.fillStyle=v3rgba('#fff0a0',.8*lit); g.beginPath(); g.ellipse(tx,ty-H*.009,H*.003,H*.007*fl,0,0,7); g.fill(); }
}
V3PLAT.sand=(P,t,night,dockY)=>v3sandPlat(P,t,night,dockY);

// =====================================================================
// BRINE SHELF: open sea at golden hour, nothing but water to the horizon, a big slow swell that
// tilts the world, a tall ship sailing far off, a bell buoy, dolphins and an albatross
// =====================================================================
V3PAL.shelf = {
  day:  {top:'#4a8ad0', mid:'#9cc4e4', bot:'#ffe8b8', glow:'#fff0c0', far:'#c8b8a0', farHaze:'#f8dcb0', wTop:'#a8d0d8', wMid:'#2a7a9a', wBot:'#0c3a5a', rim:'#fff0c8', ship:'#5a5060', sail:'#f4ead8', cloud:'#ffffff', cloudLit:'#fff0d0', buoy:'#d8483a', leaf:'#5a7a6a'},
  dusk: {top:'#2a2458', mid:'#e0705a', bot:'#ffc060', glow:'#ffcc70', far:'#a86a6a', farHaze:'#ffb070', wTop:'#ffb070', wMid:'#8a4a6a', wBot:'#1a1a40', rim:'#ffd080', ship:'#3a2a3a', sail:'#ffd8b0', cloud:'#e0708a', cloudLit:'#ffd0a0', buoy:'#c8383a', leaf:'#3a3a4a'},
  night:{top:'#030818', mid:'#0c1838', bot:'#1e2c60', glow:'#c8d4ff', far:'#1e2850', farHaze:'#2a3870', wTop:'#22305e', wMid:'#0c1a3c', wBot:'#02040c', rim:'#9fb4ff', ship:'#10141e', sail:'#4a5478', cloud:'#222a50', cloudLit:'#4a5690', buoy:'#5a3040', leaf:'#121a2a'}
};
V3SCENES.shelf = {
  tilt(t){ return Math.sin(t*.42)*.007+Math.sin(t*.17+1)*.004; },
  land(x,P,hz,cnv){
    // a long cloud bank resting on the horizon, lit on top
    const cb=x.createLinearGradient(0,hz-H*.05,0,hz); cb.addColorStop(0,v3rgba(P.farHaze,0)); cb.addColorStop(1,v3rgba(P.farHaze,.7)); x.fillStyle=cb; x.fillRect(0,hz-H*.05,W,H*.05);
    x.fillStyle=v3rgba(mix(mix(P.far,P.farHaze,.5),P.cloud,.35),.75); x.beginPath(); x.moveTo(-5,hz+1);
    for(let i=0;i<=24;i++){ const X=W*i/24, h=H*(.012+.012*Math.abs(Math.sin(i*1.37))+.008*Math.sin(i*.6)); x.quadraticCurveTo(X-W/48,hz-h-H*.006,X,hz-h*.7); } x.lineTo(W+5,hz+1); x.closePath(); x.fill();
    x.fillStyle=v3rgba(P.rim,.25*(1-P.night*.85)); for(let i=0;i<24;i++){ const X=W*(i+.5)/24, h=H*(.012+.012*Math.abs(Math.sin(i*1.37+.7))); x.beginPath(); x.ellipse(X,hz-h*.9,W*.012,H*.002,0,0,7); x.fill(); }
    v3water(x,P,hz,cnv,.18);
  },
  live(P,t,hz,sun){ const FX=S.settings.effects, night=P.night, d=P.d;
    // the tall ship, far off, sailing slowly across (a lantern at the stern after dusk)
    { const sx=W*(1.05-((t*.004+.3)%1.3)), sy=hz+1, s=H*.0042, lit=clamp(night*1.3+d,0,1); g.save(); g.translate(sx,0); g.scale(-1,1); g.translate(-sx,0);
      g.fillStyle=P.ship; g.beginPath(); g.moveTo(sx-s*14,sy-s*3); g.lineTo(sx+s*12,sy-s*3); g.lineTo(sx+s*15,sy-s*5.5); g.lineTo(sx+s*9,sy-s*.2); g.lineTo(sx-s*11,sy-s*.2); g.closePath(); g.fill();
      g.fillRect(sx-s*14,sy-s*5,s*4,s*2);
      g.strokeStyle=P.ship; g.lineWidth=Math.max(.8,s*.35); g.beginPath(); for(const mx of [-7,0,7]){ g.moveTo(sx+mx*s,sy-s*3); g.lineTo(sx+mx*s,sy-s*(mx?19:23)); } g.moveTo(sx+s*12,sy-s*4); g.lineTo(sx+s*19,sy-s*10); g.stroke();
      g.fillStyle=P.sail; for(const mx of [-7,0,7]){ const hh=mx?1:1.2; for(let k=0;k<3;k++){ const y0=sy-s*(5+k*5)*hh, w0=s*(4.4-k*.9); g.beginPath(); g.moveTo(sx+mx*s-w0,y0-s*4*hh); g.lineTo(sx+mx*s+w0,y0-s*4*hh); g.quadraticCurveTo(sx+mx*s+w0*1.15+s*.8,y0-s*2*hh,sx+mx*s+w0,y0); g.lineTo(sx+mx*s-w0,y0); g.quadraticCurveTo(sx+mx*s-w0*.8+s*.8,y0-s*2*hh,sx+mx*s-w0,y0-s*4*hh); g.fill(); } }
      g.beginPath(); g.moveTo(sx+s*12.5,sy-s*4.5); g.lineTo(sx+s*18.5,sy-s*10); g.lineTo(sx+s*12,sy-s*11); g.closePath(); g.fill();
      if(lit>.1){ v3glow(g,sx-s*13,sy-s*4,s*6,"rgba(255,210,120,.9)",lit*.6); } g.restore(); }
    v3glitter(P,t,hz,sun);
    // the swell: broad slow rollers with lit faces and darker troughs, breaking into foam here and there
    const foam=mix(P.wTop,'#ffffff',.75), N=6;
    for(let r0=0;r0<N;r0++){ const u=((t*.025+r0/N)%1), y=hz+H*.015+Math.pow(u,1.6)*(H-hz)*1.05, amp=1.5+u*H*.028, a=Math.sin(u*Math.PI), sp=W*(.32-u*.1), off=r0*211;
      if(a<.05) continue; const wy=X=>y-amp*(.55+.45*Math.sin((X+off)/sp*Math.PI*2+t*.4));
      g.fillStyle=v3rgba(P.wBot,.18*a); g.beginPath(); g.moveTo(0,y+amp*3); for(let X=0;X<=W+10;X+=10) g.lineTo(X,wy(X)+amp*1.4); g.lineTo(W,y+amp*4); g.closePath(); g.fill();
      g.fillStyle=v3rgba(P.wTop,.26*a); g.beginPath(); g.moveTo(0,y+amp); for(let X=0;X<=W+10;X+=10) g.lineTo(X,wy(X)); for(let X=W+10;X>=0;X-=10) g.lineTo(X,wy(X)+amp*.9); g.closePath(); g.fill();
      g.strokeStyle=v3rgba(foam,.45*a); g.lineWidth=Math.max(1,u*2.6); g.beginPath(); for(let X=0;X<=W;X+=7){ if(V3CN((X+off)*.009+r0*2.3+t*.05)>.5){ const yy=wy(X); g.moveTo(X,yy); g.lineTo(X+7,wy(X+7)); } } g.stroke();
      // spray off the crests nearest you
      if(FX&&u>.55){ g.fillStyle=v3rgba(foam,.5*a); for(let i=0;i<8;i++){ const X=((i*197+off+t*W*.01)%W), k=((t*1.3+i*.37)%1); if(V3CN((X+off)*.009+r0*2.3+t*.05)<=.5) continue; g.globalAlpha=(1-k)*a; g.beginPath(); g.arc(X+k*W*.01,wy(X)-k*amp*2.5+k*k*amp*2,1+u*1.5,0,7); g.fill(); } g.globalAlpha=1; } }
    // the bell buoy: rides the swell, rocks, its light blinks after dusk, the bell swings
    { const bx=W*.58, by=hz+H*.12+Math.sin(t*.9)*H*.006, rk=Math.sin(t*.9+.6)*.18, s=H*.006, lit=clamp(night*1.4+d,0,1);
      g.save(); g.translate(bx,by); g.rotate(rk);
      g.fillStyle=v3rgba(P.wBot,.35); g.beginPath(); g.ellipse(0,s*.6,s*4,s*.9,0,0,7); g.fill();
      g.fillStyle=P.buoy; g.beginPath(); g.moveTo(-s*3,0); g.lineTo(s*3,0); g.lineTo(s*2.2,-s*2.6); g.lineTo(-s*2.2,-s*2.6); g.closePath(); g.fill(); g.fillStyle=mix(P.buoy,'#ffffff',.75); g.fillRect(-s*2.6,-s*1.6,s*5.2,s*.8);
      g.strokeStyle=mix(P.ship,'#888888',.3); g.lineWidth=Math.max(1,s*.35); g.beginPath(); g.moveTo(-s*1.8,-s*2.6); g.lineTo(-s*.6,-s*8); g.lineTo(s*.6,-s*8); g.lineTo(s*1.8,-s*2.6); g.moveTo(-s*1.2,-s*5.2); g.lineTo(s*1.2,-s*5.2); g.stroke();
      const sw=Math.sin(t*2.2)*.5; g.save(); g.translate(0,-s*7.6); g.rotate(sw); g.fillStyle=mix('#c8a040',P.ship,night*.6); g.beginPath(); g.moveTo(-s*.9,s*2); g.quadraticCurveTo(-s*.9,0,0,0); g.quadraticCurveTo(s*.9,0,s*.9,s*2); g.closePath(); g.fill(); g.restore();
      const blink=((t%3)<.35)?1:0; g.fillStyle=lit>.1&&blink?'#ff5a4a':mix(P.buoy,'#000000',.3); g.beginPath(); g.arc(0,-s*8.6,s*.6,0,7); g.fill(); g.restore();
      if(lit>.1&&blink) v3glow(g,bx,by-s*8.6,s*7,'rgba(255,90,70,.9)',lit*.7);
      if(FX&&Math.abs(Math.sin(t*2.2))>.97){ g.strokeStyle=v3rgba(P.rim,.5); g.lineWidth=1; for(const sd of [-1,1]){ g.beginPath(); g.arc(bx,by-s*7,s*(3+sd*0)+s,sd>0?-.5:Math.PI-.5+1,sd>0?.5:Math.PI+.5-1+1); g.stroke(); } } }
    // flying fish glide over the swell now and then (0.3.4: replaced the dolphins)
    m34flyfish(P,t,hz,foam,night);
    // an albatross glides high on long still wings
    if(night<.7){ const per=40, k=(t%per)/per, ax=W*(-.1+k*1.25), ay=hz*(.28+Math.sin(k*Math.PI*2)*.06), s=H*.009, tilt=Math.sin(t*.5)*.08;
      g.save(); g.translate(ax,ay); g.rotate(tilt); g.strokeStyle=mix('#f4f4f0',P.top,night*.8); g.lineWidth=Math.max(1.2,s*.35); g.beginPath(); g.moveTo(-s*5,-s*.6); g.quadraticCurveTo(-s*2.5,-s*1.2,0,0); g.quadraticCurveTo(s*2.5,-s*1.2,s*5,-s*.6); g.stroke();
      g.strokeStyle=mix('#3a3a40',P.top,night*.8); g.beginPath(); g.moveTo(-s*5,-s*.6); g.lineTo(-s*3.8,-s*.9); g.moveTo(s*5,-s*.6); g.lineTo(s*3.8,-s*.9); g.stroke(); g.fillStyle=mix('#f4f4f0',P.top,night*.8); g.beginPath(); g.ellipse(0,s*.1,s*1.2,s*.4,0,0,7); g.fill(); g.restore(); }
    v3fishRing(P,t,hz,7.7,.42,.85);
  }
};

// the fishing boat: a clinker hull riding the swell, a wheelhouse with a lit window, a mast light,
// rails, a coiled rope and a net over the side; it rises and falls with the water (pb)
function v3boat(P,t,night,dockY,pb){
  const y=dockY+pb, PW=W*.19, N=c=>mix(c,'#0a1020',night*.5), lit=clamp(night*1.2+P.d*.9,0,1);
  const hull=N(homeHull('#f2eee2')), hullD=N(homeHullDark('#f2eee2','#c8c0ae')), trim=N('#2a5a8a'), wood=N(dockWood());
  // hull: flared sides, a raised bow on the right, planks, a waterline, foam where it meets the sea
  const bow=PW+W*.035, hb=y+H*.1;
  const path=()=>{ g.beginPath(); g.moveTo(-12,y-H*.012); g.lineTo(PW,y-H*.012); g.quadraticCurveTo(bow-W*.01,y-H*.018,bow,y-H*.03); g.quadraticCurveTo(bow-W*.01,y+H*.06,PW-W*.03,hb); g.lineTo(-12,hb); g.closePath(); };
  const hg=g.createLinearGradient(0,y,0,hb); hg.addColorStop(0,hull); hg.addColorStop(1,hullD); g.fillStyle=hg; path(); g.fill();
  g.save(); path(); g.clip(); g.strokeStyle=v3rgba(mix(hullD,'#000000',.2),.6); g.lineWidth=1; for(let k=1;k<5;k++){ const yy=y-H*.012+k*H*.022; g.beginPath(); g.moveTo(-12,yy); g.quadraticCurveTo(PW,yy-H*.002,bow,yy-H*.01-k*H*.002); g.stroke(); }
  g.fillStyle=trim; g.fillRect(-12,y-H*.004,bow+12,H*.008); g.fillStyle=N('#a8383a'); g.fillRect(-12,hb-H*.022,bow+12,H*.022);
  g.fillStyle=v3rgba(P.rim,.25); g.fillRect(-12,y-H*.012,bow,1.4); g.restore();
  g.fillStyle=v3rgba('#ffffff',.55); for(let i=0;i<8;i++){ const fx=PW-W*.04+i*W*.008, fy=hb-H*.004+Math.sin(t*3+i)*1.5; g.beginPath(); g.ellipse(fx,fy,W*.006,H*.003,0,0,7); g.fill(); }
  // deck rail along the far side
  g.strokeStyle=N('#c8d0d8'); g.lineWidth=1.5; g.beginPath(); g.moveTo(W*.06,y-H*.05); g.lineTo(PW,y-H*.05); g.quadraticCurveTo(bow-W*.008,y-H*.054,bow-W*.002,y-H*.062); for(let k=0;k<5;k++){ const px=W*.06+k*(PW-W*.06)/4; g.moveTo(px,y-H*.05); g.lineTo(px,y-H*.012); } g.moveTo(bow-W*.002,y-H*.062); g.lineTo(bow-W*.002,y-H*.03); g.stroke();
  // wheelhouse on the left with a lit window, a mast with a light
  { const cw=W*.06, ch=H*.075, cx0=-12; g.fillStyle=N('#e8e2d4'); g.fillRect(cx0,y-H*.012-ch,cw+12,ch); g.fillStyle=N('#2a5a8a'); g.fillRect(cx0,y-H*.012-ch-H*.008,cw+16,H*.01);
    g.fillStyle='rgba(0,0,0,.15)'; g.fillRect(cx0+cw*.6+12,y-H*.012-ch,cw*.4,ch);
    g.fillStyle=lit>.05?v3rgba('#ffd890',.4+lit*.6):N('#6a9ab8'); g.fillRect(cx0+12+cw*.1,y-H*.012-ch*.82,cw*.75,ch*.3); g.strokeStyle=N('#2a5a8a'); g.lineWidth=1.2; g.strokeRect(cx0+12+cw*.1,y-H*.012-ch*.82,cw*.75,ch*.3); g.beginPath(); g.moveTo(cx0+12+cw*.47,y-H*.012-ch*.82); g.lineTo(cx0+12+cw*.47,y-H*.012-ch*.52); g.stroke();
    if(lit>.05) v3glow(g,cx0+12+cw*.47,y-H*.012-ch*.67,ch*.9,'rgba('+homeLight('255,210,130')+',.8)',lit*.4);
    const mx=cx0+12+cw*.5, mt=y-H*.012-ch-H*.09; g.fillStyle=N('#4a4a52'); g.fillRect(mx-1.2,mt,2.4,H*.09); g.strokeStyle=N('#4a4a52'); g.lineWidth=1; g.beginPath(); g.moveTo(mx,mt+H*.01); g.lineTo(PW*.9,y-H*.05); g.stroke();
    const ml=night>.25||P.d>.4; g.fillStyle=ml?'#fff4d0':N('#888'); g.beginPath(); g.arc(mx,mt-2,2.4,0,7); g.fill(); if(ml) v3glow(g,mx,mt-2,H*.05,'rgba(255,244,210,.8)',.6*lit); }
  // coiled rope and a fish crate by the rail
  { const rx=W*.155, ry=y-H*.016; g.strokeStyle=N('#c8a070'); g.lineWidth=1.6; for(let k=0;k<3;k++){ g.beginPath(); g.ellipse(rx,ry-k*1.6,Math.max(.6,H*.016-k*1.6),Math.max(.4,H*.005),0,0,7); g.stroke(); } }
}
V3PLAT.boat=(P,t,night,dockY,pb)=>v3boat(P,t,night,dockY,pb);

// =====================================================================
// MIDNIGHT DEEP: far offshore in weather, low storm clouds racing, lightning that lights the whole sea,
// rain sheets slanting past, a huge swell, the trawler's floodlights, a whale tail in the swell
// =====================================================================
V3PAL.deep = {
  day:  {top:'#3a4a5e', mid:'#6a7a8a', bot:'#a8b0b4', glow:'#e8ecf0', far:'#4a5866', farHaze:'#8a96a0', wTop:'#6a8290', wMid:'#2a4256', wBot:'#0a1826', rim:'#d8e0e8', cl1:'#4a5662', cl2:'#2e3a46', cloud:'#6a7682', cloudLit:'#9aa6b0', leaf:'#2a3a4a'},
  dusk: {top:'#1e1a36', mid:'#4a3048', bot:'#c8704a', glow:'#ff9a5a', far:'#3a2a3e', farHaze:'#7a4a4a', wTop:'#8a5a5a', wMid:'#2a2240', wBot:'#08081a', rim:'#ffb080', cl1:'#3a2a3e', cl2:'#221a2e', cloud:'#4a3448', cloudLit:'#a8606a', leaf:'#1a1a2a'},
  night:{top:'#02040c', mid:'#060c1e', bot:'#0e1834', glow:'#a8b8e8', far:'#0a1226', farHaze:'#141e3a', wTop:'#14203e', wMid:'#060c20', wBot:'#010208', rim:'#8aa0d8', cl1:'#0e1428', cl2:'#060a18', cloud:'#121a32', cloudLit:'#2a3660', leaf:'#060a14'}
};
V3SCENES.deep = {
  overcast:.85,
  tilt(t){ return Math.sin(t*.55)*.012+Math.sin(t*.23+2)*.006; },
  // lightning: every few seconds, a flash (with a bolt now and then); everything else reads it from here
  flash(t){ const per=7.3, k=t%per, n=Math.floor(t/per), strike=v3rng(n*31+7)()<.7; if(!strike) return 0; return k<.08?1:k<.16?.25:k<.24?.8:Math.max(0,1-(k-.24)/.5)*.35; },
  sky(P,t,hz){ const fl=this.flash(t);
    // low clouds in heavy bands racing overhead
    for(let b=0;b<4;b++){ const y=hz*(.08+b*.2), sp=W*.02*(1+b*.6), off=(t*sp)%(W*.5); g.fillStyle=v3rgba(b%2?P.cl1:P.cl2,.75);
      g.beginPath(); g.moveTo(-W*.5+off,y-hz*.06); for(let i=0;i<=12;i++){ const X=-W*.5+off+i*W*.17; g.quadraticCurveTo(X-W*.05,y-hz*(.11+.04*Math.sin(i*1.9+b)),X+W*.04,y-hz*.05); } g.lineTo(W*1.5,y+hz*.06); for(let i=12;i>=0;i--){ const X=-W*.5+off+i*W*.17; g.quadraticCurveTo(X,y+hz*(.08+.03*Math.sin(i*2.3+b)),X-W*.08,y+hz*.04); } g.closePath(); g.fill(); }
    if(fl>0){ g.fillStyle=v3rgba('#dfe8ff',fl*.35); g.fillRect(0,0,W,hz+2);
      const n=Math.floor(t/7.3), r=v3rng(n*13+3), bx=W*(.35+r()*.55); if((t%7.3)<.26 && (t%7.3)>.0){ g.strokeStyle=v3rgba('#ffffff',.9); g.lineWidth=2; g.beginPath(); let X=bx, Y=hz*.15; g.moveTo(X,Y); while(Y<hz){ X+=(r()-.5)*W*.03; Y+=hz*(.05+r()*.06); g.lineTo(X,Math.min(Y,hz)); if(r()<.25){ g.moveTo(X,Y); g.lineTo(X+(r()-.5)*W*.05,Y+hz*.07); g.moveTo(X,Math.min(Y,hz)); } } g.stroke(); v3glow(g,bx,hz*.5,hz*.6,'rgba(220,230,255,.7)',.5); } } },
  land(x,P,hz,cnv){
    // a wall of rain far off on the horizon
    const rg=x.createLinearGradient(0,hz-H*.08,0,hz); rg.addColorStop(0,v3rgba(P.farHaze,0)); rg.addColorStop(1,v3rgba(P.farHaze,.75)); x.fillStyle=rg; x.fillRect(0,hz-H*.08,W,H*.08);
    x.strokeStyle=v3rgba(P.farHaze,.35); x.lineWidth=1; for(let i=0;i<60;i++){ const X=W*i/60; x.beginPath(); x.moveTo(X,hz-H*.07); x.lineTo(X-W*.01,hz); x.stroke(); }
    v3water(x,P,hz,cnv,.12);
  },
  live(P,t,hz,sun){ const FX=S.settings.effects, fl=this.flash(t);
    // a huge swell: tall dark rollers with streaked faces and wind-torn crests
    const foam=mix(P.wTop,'#ffffff',.6), N=6;
    for(let r0=0;r0<N;r0++){ const u=((t*.03+r0/N)%1), y=hz+H*.02+Math.pow(u,1.5)*(H-hz)*1.05, amp=2+u*H*.045, a=Math.sin(u*Math.PI), sp=W*(.38-u*.12), off=r0*173;
      if(a<.05) continue; const wy=X=>y-amp*(.5+.5*Math.sin((X+off)/sp*Math.PI*2+t*.5));
      g.fillStyle=v3rgba(P.wBot,.3*a); g.beginPath(); g.moveTo(0,y+amp*3); for(let X=0;X<=W+10;X+=10) g.lineTo(X,wy(X)+amp*1.6); g.lineTo(W,y+amp*4); g.closePath(); g.fill();
      g.fillStyle=v3rgba(mix(P.wTop,'#dfe8ff',fl*.6),(.2+fl*.25)*a); g.beginPath(); g.moveTo(0,y+amp); for(let X=0;X<=W+10;X+=10) g.lineTo(X,wy(X)); for(let X=W+10;X>=0;X-=10) g.lineTo(X,wy(X)+amp*.8); g.closePath(); g.fill();
      g.strokeStyle=v3rgba(foam,.4*a); g.lineWidth=Math.max(1,u*3); g.beginPath(); for(let X=0;X<=W;X+=7){ if(V3CN((X+off)*.011+r0*1.7+t*.08)>.45){ g.moveTo(X,wy(X)); g.lineTo(X+7,wy(X+7)); } } g.stroke();
      if(FX&&u>.4){ g.fillStyle=v3rgba(foam,.45*a); for(let i=0;i<10;i++){ const X=((i*151+off+t*W*.03)%W), k=((t*1.6+i*.31)%1); g.globalAlpha=(1-k)*a*.8; g.beginPath(); g.arc(X-k*W*.02,wy(X)-k*amp*1.6+k*k*amp,1+u*1.4,0,7); g.fill(); } g.globalAlpha=1; } }
    // a whale's tail lifts out of the swell, pours water, and slides back under
    { const per=23, k=(t%per)/per; if(k<.22){ const e=k/.22, up=Math.sin(e*Math.PI), wx=W*.7, wy=hz+H*.16, s=H*.02, wc=mix('#3a4652',P.wMid,.3+P.night*.3);
        g.save(); g.beginPath(); g.rect(0,0,W,wy); g.clip(); g.translate(wx,wy+(1-up)*s*7); g.rotate((e-.5)*.4); g.fillStyle=wc;
        g.beginPath(); g.moveTo(-s*.8,s*2); g.quadraticCurveTo(-s*.5,-s*1.5,0,-s*2.2); g.quadraticCurveTo(s*.5,-s*1.5,s*.8,s*2); g.fill();
        g.beginPath(); g.moveTo(0,-s*2); g.quadraticCurveTo(-s*2.5,-s*2.6,-s*4.6,-s*4.2); g.quadraticCurveTo(-s*3.2,-s*2.2,-s*1.6,-s*2.3); g.quadraticCurveTo(-s*.6,-s*1.8,0,-s*2.3); g.quadraticCurveTo(s*.6,-s*1.8,s*1.6,-s*2.3); g.quadraticCurveTo(s*3.2,-s*2.2,s*4.6,-s*4.2); g.quadraticCurveTo(s*2.5,-s*2.6,0,-s*2); g.fill();
        g.fillStyle=v3rgba('#c8d4e0',.25); g.beginPath(); g.ellipse(-s*2.4,-s*2.9,s*1.2,s*.25,-.5,0,7); g.fill(); g.restore();
        if(FX){ g.fillStyle=v3rgba(foam,.7*up); for(let i=0;i<9;i++){ const kk=((t*2+i*.27)%1); g.fillRect(wx+(i-4)*s*.9,wy-s*3*up+kk*s*3,1.3,2.4); } }
        g.strokeStyle=v3rgba(foam,.5*up); g.lineWidth=1.4; g.beginPath(); g.ellipse(wx,wy,s*3*(1+e),s*.5,0,0,7); g.stroke(); } }
    // rain sheets slanting in the wind, in two depths
    if(FX){ for(let L=0;L<2;L++){ const n=L?70:50, len=H*(L?.05:.03), sl=W*.012*(L?1.5:1), al=L?.32:.2; g.strokeStyle=v3rgba(mix('#c8d4e8',P.rim,.3),al+fl*.3); g.lineWidth=L?1.1:.8; g.beginPath();
      for(let i=0;i<n;i++){ const sp=(L?1.6:1.1)*(.8+((i*37)%10)/25), X=((i*83.7+t*W*.25*sp)%(W+sl*4))-sl*2, Y=((i*61.3+t*H*1.4*sp)%(H+len))-len; g.moveTo(X,Y); g.lineTo(X-sl,Y+len); } g.stroke(); } }
    // the flash lights the whole sea for a moment
    if(fl>0){ g.fillStyle=v3rgba('#dfe8ff',fl*.14); g.fillRect(0,hz,W,H-hz); }
    v3fishRing(P,t,hz,8.3,.45,.88);
  },
  fore(P,t){ const fl=this.flash(t); if(fl>0){ g.fillStyle=v3rgba('#ffffff',fl*.06); g.fillRect(0,0,W,H); } }
};

// the trawler: a steel hull in deep red, a tall white wheelhouse, floodlights pouring onto a wet deck,
// a gantry with a net drum and a hanging net with floats, running lights, rain-streaked; rides the swell (pb)
function v3trawler(P,t,night,dockY,pb){
  const y=dockY+pb, PW=W*.19, N=c=>mix(c,'#060a14',.25+night*.4), fl=V3SCENES.deep.flash?V3SCENES.deep.flash(t):0;
  const bow=PW+W*.04, hb=y+H*.12, hull=N(homeHull('#9a2e24')), hullD=N(homeHullDark('#9a2e24','#5a1a16'));
  // floodlight cones first (under the structure)
  const fx=W*.07, fy=y-H*.14; { const cg=g.createLinearGradient(fx,fy,fx+W*.06,y); cg.addColorStop(0,'rgba(255,240,200,.35)'); cg.addColorStop(1,'rgba(255,240,200,0)'); g.fillStyle=cg; g.beginPath(); g.moveTo(fx,fy); g.lineTo(fx+W*.16,y); g.lineTo(fx-W*.02,y); g.closePath(); g.fill(); }
  const path=()=>{ g.beginPath(); g.moveTo(-12,y-H*.014); g.lineTo(PW,y-H*.014); g.quadraticCurveTo(bow-W*.012,y-H*.02,bow,y-H*.045); g.quadraticCurveTo(bow-W*.01,y+H*.07,PW-W*.03,hb); g.lineTo(-12,hb); g.closePath(); };
  const hg=g.createLinearGradient(0,y,0,hb); hg.addColorStop(0,hull); hg.addColorStop(1,hullD); g.fillStyle=hg; path(); g.fill();
  g.save(); path(); g.clip(); g.fillStyle=N('#e8e4dc'); g.fillRect(-12,y-H*.008,bow+12,H*.006); g.fillStyle=N('#1a1a20'); g.fillRect(-12,hb-H*.03,bow+12,H*.03);
  g.strokeStyle=v3rgba('#000000',.25); g.lineWidth=1; for(let X=W*.03;X<bow;X+=W*.03){ g.beginPath(); g.moveTo(X,y-H*.014); g.lineTo(X,hb); g.stroke(); }
  g.fillStyle=v3rgba('#c8a070',.35); for(let i=0;i<14;i++){ const rx=(i*53)%Math.round(bow), ry=y+((i*29)%80)/80*(hb-y); g.fillRect(rx,ry,1.4,H*.01); }
  g.strokeStyle=v3rgba('#dfe8ff',.12+fl*.3); g.lineWidth=1; for(let i=0;i<10;i++){ const rx=((i*71+t*40)%bow), ry=y+((i*37+t*90)%(hb-y)); g.beginPath(); g.moveTo(rx,ry); g.lineTo(rx-2,ry+H*.015); g.stroke(); }
  g.fillStyle=v3rgba(P.rim,.2+fl*.4); g.fillRect(-12,y-H*.014,bow,1.4); g.restore();
  g.fillStyle=v3rgba('#ffffff',.5); for(let i=0;i<9;i++){ const fx2=PW-W*.04+i*W*.009, fy2=hb-H*.004+Math.sin(t*3.4+i)*2; g.beginPath(); g.ellipse(fx2,fy2,W*.007,H*.003,0,0,7); g.fill(); }
  // gantry with the net drum and a net hanging over the side, floats bobbing
  { const gx=PW*.86, gt=y-H*.13; g.strokeStyle=N('#d8a030'); g.lineWidth=Math.max(2,W*.003); g.beginPath(); g.moveTo(gx-W*.012,y-H*.014); g.lineTo(gx-W*.004,gt); g.lineTo(gx+W*.03,gt+H*.012); g.moveTo(gx+W*.012,y-H*.014); g.lineTo(gx+W*.004,gt); g.stroke();
    g.fillStyle=N('#3a6a4a'); g.beginPath(); g.ellipse(gx,y-H*.035,W*.014,H*.016,0,0,7); g.fill(); g.strokeStyle=N('#2a4a34'); g.lineWidth=1; for(let k=-2;k<=2;k++){ g.beginPath(); g.moveTo(gx+k*W*.005,y-H*.05); g.lineTo(gx+k*W*.005,y-H*.02); g.stroke(); }
    const nx=gx+W*.03, sway=Math.sin(t*1.1)*W*.004; g.strokeStyle=N('#5a7a5a'); g.lineWidth=.8; g.beginPath(); for(let k=0;k<6;k++){ g.moveTo(nx-W*.01+k*W*.004,gt+H*.012); g.quadraticCurveTo(nx-W*.012+k*W*.005+sway,y-H*.02,nx-W*.008+k*W*.005+sway*1.5,y+H*.03); } for(let k=0;k<6;k++){ const yy=gt+H*.025+k*H*.02; g.moveTo(nx-W*.012+sway*(k/6),yy); g.lineTo(nx+W*.016+sway*(k/6),yy); } g.stroke();
    g.fillStyle=N('#e8803a'); for(let k=0;k<4;k++){ g.beginPath(); g.arc(nx-W*.008+k*W*.008+sway*1.5,y+H*.03+Math.sin(t*2+k)*1.5,H*.005,0,7); g.fill(); } }
  // wheelhouse: tall, white, wet; bright windows; mast with radar, running lights and the floodlight
  { const cw=W*.075, ch=H*.1, x0=-12; g.fillStyle=N('#e4e0d8'); g.fillRect(x0,y-H*.014-ch,cw+12,ch); g.fillStyle=N('#c8c2b8'); g.fillRect(x0+cw*.7+12,y-H*.014-ch,cw*.3,ch);
    g.fillStyle=N('#1a2a3a'); g.fillRect(x0,y-H*.014-ch-H*.012,cw+18,H*.014);
    g.fillStyle=v3rgba('#ffe0a0',.85); for(let k=0;k<3;k++) g.fillRect(x0+12+cw*(.06+k*.3),y-H*.014-ch*.86,cw*.24,ch*.24);
    v3glow(g,x0+12+cw*.5,y-H*.014-ch*.75,ch,'rgba('+homeLight('255,220,150')+',.8)',.35);
    const mx=x0+12+cw*.55, mt=y-H*.014-ch-H*.12; g.fillStyle=N('#3a3a44'); g.fillRect(mx-1.5,mt,3,H*.12);
    const rr=Math.sin(t*2.4); g.fillStyle=N('#5a5a66'); g.fillRect(mx-H*.018*Math.abs(rr),mt+H*.025,H*.036*Math.abs(rr)+1,H*.004);
    g.fillStyle='#ff4a3a'; g.beginPath(); g.arc(mx-H*.01,mt+H*.05,2.2,0,7); g.fill(); g.fillStyle='#3aff8a'; g.beginPath(); g.arc(mx+H*.01,mt+H*.05,2.2,0,7); g.fill(); g.fillStyle='#ffffff'; g.beginPath(); g.arc(mx,mt-2,2.4,0,7); g.fill();
    v3glow(g,mx-H*.01,mt+H*.05,H*.03,'rgba(255,80,60,.8)',.5); v3glow(g,mx+H*.01,mt+H*.05,H*.03,'rgba(60,255,140,.8)',.5); v3glow(g,mx,mt-2,H*.04,'rgba(255,255,240,.8)',.5);
    g.fillStyle=N('#2a2a32'); g.fillRect(fx-H*.012,fy-H*.008,H*.024,H*.016); g.fillStyle='#fff8e0'; g.fillRect(fx-H*.009,fy+H*.002,H*.018,H*.005); v3glow(g,fx,fy+H*.004,H*.06,'rgba(255,248,224,.9)',.7); }
  // deck rail
  g.strokeStyle=N('#c8c8c8'); g.lineWidth=1.4; g.beginPath(); g.moveTo(W*.075,y-H*.05); g.lineTo(PW*.78,y-H*.05); for(let k=0;k<4;k++){ const px=W*.075+k*(PW*.78-W*.075)/3; g.moveTo(px,y-H*.05); g.lineTo(px,y-H*.014); } g.stroke();
}
V3PLAT.trawler=(P,t,night,dockY,pb)=>v3trawler(P,t,night,dockY,pb);

// =====================================================================
// HOLLOW TRENCH: eerie twilight over black water, sea stacks in the mist, the mast of a sunken ship,
// glowing jellyfish drifting below, plankton trails, a dark middle that swallows light, eyes in the deep
// =====================================================================
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
V3SCENES.trench = {
  land(x,P,hz,cnv){
    // sea stacks: far and hazy, then nearer and darker
    for(const [sx,sw,sh,sd] of [[.36,.03,.1,1],[.42,.02,.07,2],[.78,.035,.12,3]]) v3stack(x,W*sx,hz+1,W*sw,H*sh,Object.assign({},P,{rock:mix(P.rock,P.farHaze,.45),rockD:mix(P.rockD,P.farHaze,.45)}),sd);
    for(const [sx,sw,sh,sd] of [[.9,.05,.22,4],[.97,.03,.15,5],[.55,.025,.06,6]]) v3stack(x,W*sx,hz+1,W*sw,H*sh,P,sd);
    // the mast of a sunken ship, leaning out of the water, a torn sail, a crow's nest
    { const mx=W*.66, my=hz+H*.06, tx=mx-W*.03, ty=hz-H*.16; x.strokeStyle=P.wood; x.lineWidth=Math.max(2.4,W*.004); x.beginPath(); x.moveTo(mx,my); x.lineTo(tx,ty); x.stroke();
      const yd=(u)=>[mx+(tx-mx)*u,my+(ty-my)*u]; const [a1,b1]=yd(.55), [a2,b2]=yd(.85); x.lineWidth=Math.max(1.6,W*.0025); x.beginPath(); x.moveTo(a1-W*.035,b1+H*.008); x.lineTo(a1+W*.03,b1-H*.006); x.moveTo(a2-W*.022,b2+H*.004); x.lineTo(a2+W*.02,b2-H*.004); x.stroke();
      x.fillStyle=v3rgba(mix(mix('#c8c0a8',P.farHaze,.5),P.rock,P.night*.7),.7); x.beginPath(); x.moveTo(a1-W*.03,b1+H*.008); x.lineTo(a1+W*.025,b1-H*.005); x.lineTo(a1+W*.02,b1+H*.03); x.lineTo(a1+W*.005,b1+H*.022); x.lineTo(a1-W*.006,b1+H*.04); x.lineTo(a1-W*.02,b1+H*.026); x.closePath(); x.fill();
      x.fillStyle=P.wood; x.fillRect(tx-W*.008,ty+H*.01,W*.016,H*.012); x.strokeStyle=v3rgba(P.wood,.8); x.lineWidth=.8; x.beginPath(); x.moveTo(tx,ty); x.lineTo(mx+W*.06,my-H*.01); x.moveTo(a2,b2); x.lineTo(mx-W*.07,my-H*.005); x.stroke(); }
    v3water(x,P,hz,cnv,.22);
    // the dark middle: a deep, wide shadow in the water that drinks the light
    const dg=x.createRadialGradient(W*.55,hz+H*.3,0,W*.55,hz+H*.3,W*.42); dg.addColorStop(0,'rgba(0,0,0,.6)'); dg.addColorStop(.55,'rgba(0,0,0,.3)'); dg.addColorStop(1,'rgba(0,0,0,0)'); x.fillStyle=dg; x.save(); x.beginPath(); x.rect(0,hz+H*.03,W,H); x.clip(); x.scale(1,1); x.fillRect(0,hz,W,H-hz); x.restore();
  },
  live(P,t,hz,sun){ const FX=S.settings.effects, night=P.night, glowA=.55+night*.45;
    v3glitter(P,t,hz,sun); v3mist(P,t,hz,.22);
    g.save(); g.globalCompositeOperation='lighter';
    // plankton trails: glowing motes drifting along slow curves
    if(FX){ for(let tr=0;tr<5;tr++){ const y0=hz+H*(.12+tr*.13), col=tr%2?P.bio2:P.bio; for(let i=0;i<22;i++){ const u=((t*.03+i/22+tr*.17)%1), X=W*(-.05+u*1.1), Y=y0+Math.sin(u*9+tr*2+t*.4)*H*.03, a=Math.sin(u*Math.PI)*(.25+.35*Math.abs(Math.sin(t*2+i)))*glowA;
      g.fillStyle=v3rgba(col,a); g.beginPath(); g.arc(X,Y,1+((i*7)%3)*.5,0,7); g.fill(); } } }
    // jellyfish drifting under the surface, pulsing
    for(let j=0;j<5;j++){ const per=40+j*9, k=((t+j*13)%per)/per, jx=W*(.3+((j*0.17)%0.65))+Math.sin(t*.2+j)*W*.03, jy=H*(1.05-k*.75), d=(jy-hz)/(H-hz); if(jy<hz+H*.08) continue; const s=H*(.008+d*.022), pulse=1+.15*Math.sin(t*2.4+j*1.3), col=j%2?P.bio2:P.bio, a=glowA*(.25+d*.4);
      v3glow(g,jx,jy,s*4,v3rgba(col,.8),a*.5);
      g.fillStyle=v3rgba(col,a*.6); g.beginPath(); g.ellipse(jx,jy,s*pulse,s*.7/pulse,0,Math.PI,0); g.fill();
      g.strokeStyle=v3rgba(col,a*.5); g.lineWidth=1; g.beginPath(); for(let tn=0;tn<4;tn++){ const tx=jx-s*.6+tn*s*.4; g.moveTo(tx,jy); g.quadraticCurveTo(tx+Math.sin(t*1.8+tn+j)*s*.4,jy+s*1.2,tx+Math.sin(t*1.3+tn)*s*.3,jy+s*2.4); } g.stroke(); }
    g.restore();
    // eyes in the deep: now and then, something down there opens its eyes, looks, and closes them
    { const per=29, k=(t%per)/per; if(k<.3){ const n=Math.floor(t/per), r=m34rng(n*17+3), NP=1+Math.floor(r()*3.2); /* 0.3.4: one to four pairs, each its own size, place, colour and timing */
      for(let pi=0;pi<Math.min(4,NP);pi++){ const st=r()*.1, e=(k-st)/(.13+r()*.07); const ex=W*(.3+r()*.62), ey=hz+H*(.2+r()*.22), s=H*(.0035+r()*.0085)*(.7+(ey-hz)/H*1.4), cols=[['#e8ff9a','220,255,140'],['#b8fff4','150,255,240'],['#ffd27a','255,200,110'],['#ff9a8a','255,130,110']], cl=cols[Math.floor(r()*4)], gap=2.4+r()*1.6, blink=r()<.5?.55:-1; if(e<0||e>1) continue;
        let open=Math.min(1,Math.sin(e*Math.PI)*1.8); if(blink>0&&Math.abs(e-blink)<.04) open*=.1; const look=Math.sin(e*6+pi)*s*.3;
        for(const sd of [-1,1]){ v3glow(g,ex+sd*s*gap,ey,s*4,'rgba('+cl[1]+',.9)',.3*open); g.fillStyle=v3rgba(cl[0],.85*open); g.beginPath(); g.ellipse(ex+sd*s*gap,ey,s*1.4,s*.9*open,0,0,7); g.fill(); g.fillStyle='rgba(0,0,0,.9)'; g.beginPath(); g.ellipse(ex+sd*s*gap+look,ey,s*.25,s*.7*open,0,0,7); g.fill(); } } } }
    v3fishRing(P,t,hz,9.1,.3,.85);
  },
  fore(P,t){ // drifting kelp fronds rising into the bottom corner, faintly glowing at their tips
    const b=H+2; for(let i=0;i<5;i++){ const fx=W*(.9+i*.022), h=H*(.14+((i*7)%3)*.04), sw=Math.sin(t*.7+i*1.3)*H*.02; g.strokeStyle=mix('#1e3a2a',P.wBot,.3+P.night*.3); g.lineWidth=Math.max(2,H*.006); g.beginPath(); g.moveTo(fx,b); g.bezierCurveTo(fx+sw,b-h*.35,fx-sw,b-h*.7,fx+sw*.5,b-h); g.stroke();
      g.fillStyle=v3rgba(P.bio,.25+.2*Math.sin(t*2+i)); g.beginPath(); g.arc(fx+sw*.5,b-h,2,0,7); g.fill(); }
  }
};

// the raft: lashed logs riding low, a crooked mast pole with a lantern of cold light, a crate and a coil of line; rises and falls with the water (pb)
function v3raft(P,t,night,dockY,pb){
  const y=dockY+pb, PW=W*.19, N=c=>mix(c,'#020608',.2+night*.4), lit=.6+night*.4;
  const lx=PW-W*.012, ly=y-H*.1; v3glow(g,lx,ly,H*.2,'rgba('+homeLight('170,255,235')+',.85)',lit*.5*(.92+.08*Math.sin(t*3.1)));
  v3lightPool(lx-W*.02,y-1,W*.095,homeLight('150,255,230'),.22*lit); v3lanternReflect(lx,y+H*.03,lit*.8,t,homeLight('170,255,235'));
  // the logs, end-on rounds on the right, bark streaks, rope lashings
  const lh=H*.022, wood=N('#6a5038');
  for(let k=0;k<2;k++){ const yy=y-H*.004+k*lh*.75; g.fillStyle=k?N('#4a3828'):wood; g.beginPath(); g.roundRect?g.roundRect(-12,yy,PW+W*.02+12,lh,lh/2):g.rect(-12,yy,PW+W*.02+12,lh); g.fill();
    g.strokeStyle=v3rgba('#000000',.25); g.lineWidth=1; for(let X=0;X<PW;X+=W*.02){ g.beginPath(); g.moveTo(X,yy+lh*.3); g.lineTo(X+W*.012,yy+lh*.32); g.stroke(); }
    g.fillStyle=N('#8a6a48'); g.beginPath(); g.ellipse(PW+W*.02,yy+lh/2,lh*.32,lh/2,0,0,7); g.fill(); g.strokeStyle=N('#5a4430'); g.beginPath(); g.ellipse(PW+W*.02,yy+lh/2,lh*.16,lh*.25,0,0,7); g.stroke(); }
  g.fillStyle=v3rgba(P.rim,.2); g.fillRect(-12,y-H*.004,PW+W*.02,1.2);
  g.strokeStyle=N('#b89a6a'); g.lineWidth=1.6; for(const rx of [W*.04,W*.11,PW-W*.01]){ for(let k=0;k<3;k++){ g.beginPath(); g.moveTo(rx+k*2.4,y-H*.004); g.lineTo(rx+k*2.4+1,y-H*.004+lh*1.7); g.stroke(); } }
  // ripples where the raft meets the water
  g.strokeStyle=v3rgba(P.rim,.25); g.lineWidth=1; for(let k=0;k<2;k++){ const e=((t*.4+k*.5)%1); g.globalAlpha=1-e; g.beginPath(); g.ellipse(PW*.5,y+lh*1.8,PW*(.55+e*.3),H*(.006+e*.01),0,0,Math.PI); g.stroke(); } g.globalAlpha=1;
  // crate and a coil of line
  { const cx=W*.03, s=H*.03; g.fillStyle=N('#7a6044'); g.fillRect(cx,y-H*.004-s,s*1.2,s); g.strokeStyle=N('#4a3a28'); g.lineWidth=1.2; g.strokeRect(cx,y-H*.004-s,s*1.2,s); g.beginPath(); g.moveTo(cx,y-H*.004-s); g.lineTo(cx+s*1.2,y-H*.004); g.stroke(); }
  { const rx=W*.152, ry=y-H*.008; g.strokeStyle=N('#c8b088'); g.lineWidth=1.5; for(let k=0;k<3;k++){ g.beginPath(); g.ellipse(rx,ry-k*1.5,Math.max(.6,H*.014-k*1.4),Math.max(.4,H*.0045),0,0,7); g.stroke(); } }
  // crooked pole with the lantern
  g.strokeStyle=N('#4a3a2a'); g.lineWidth=3; g.beginPath(); g.moveTo(lx+W*.004,y-H*.004); g.quadraticCurveTo(lx-W*.004,y-H*.05,lx,ly+H*.016); g.stroke();
  const hw=H*.018, hh=H*.026; g.fillStyle=v3rgba('#c8fff0',.5+lit*.45); g.fillRect(lx-hw/2,ly-hh/2,hw,hh); g.fillStyle='#f0fff8'; g.beginPath(); g.ellipse(lx,ly+hh*.05,hw*.16,hh*.22*(1+Math.sin(t*9)*.06),0,0,7); g.fill();
  g.strokeStyle=N('#1e2a2a'); g.lineWidth=1.3; g.strokeRect(lx-hw/2,ly-hh/2,hw,hh); g.fillStyle=N('#1e2a2a'); g.beginPath(); g.moveTo(lx-hw*.7,ly-hh/2); g.lineTo(lx,ly-hh*.95); g.lineTo(lx+hw*.7,ly-hh/2); g.closePath(); g.fill();
}
V3PLAT.raft=(P,t,night,dockY,pb)=>v3raft(P,t,night,dockY,pb);

// =====================================================================
// EMBER SPRINGS: a volcanic valley, a smouldering volcano with glowing veins, stone terraces of hot pools,
// steam lifting off warm water, embers drifting up, glowing moths, a fire salamander
// =====================================================================
V3PAL.ember = {
  day:  {top:'#6a5a6a', mid:'#b88a7a', bot:'#f0c8a0', glow:'#ffe0b0', far:'#6a5050', farHaze:'#c89a88', rock:'#4a3a3a', rockD:'#2a2024', terr:'#7a6258', wTop:'#e8b090', wMid:'#8a5a5a', wBot:'#2a1a20', rim:'#ffd8b0', lava:'#ff7a2a', lava2:'#ffc04a', pool:'#7ad8d0', cloud:'#9a8080', cloudLit:'#e8c0a0', leaf:'#4a5a3a'},
  dusk: {top:'#2a1430', mid:'#8a2a3a', bot:'#ff7a3a', glow:'#ffa060', far:'#3a1a24', farHaze:'#a84a3a', rock:'#2e1c22', rockD:'#180e14', terr:'#5a3a38', wTop:'#ff9060', wMid:'#6a2a3a', wBot:'#1a0a14', rim:'#ffb070', lava:'#ff6a1a', lava2:'#ffb030', pool:'#6ab8b8', cloud:'#5a2a34', cloudLit:'#d06040', leaf:'#2e2a24'},
  night:{top:'#0a0408', mid:'#1e0a10', bot:'#3a1418', glow:'#ffb090', far:'#140a0e', farHaze:'#3a1a1a', rock:'#140c10', rockD:'#08050a', terr:'#2a1a1a', wTop:'#5a2420', wMid:'#200c10', wBot:'#060204', rim:'#ff9a6a', lava:'#ff5a10', lava2:'#ffa020', pool:'#3a7a80', cloud:'#2a1216', cloudLit:'#6a2a1a', leaf:'#141210'}
};
V3SCENES.ember = {
  land(x,P,hz,cnv){
    // far jagged ridges in ash haze
    v3range(x,{seed:71, base:hz+1, amp:.09*H, massifs:[[.1,.7,.12],[.3,.5,.1],[.92,.6,.12]], light:mix(P.far,P.farHaze,.45), shadow:mix(P.far,'#000000',.2), haze:P.farHaze, snow:null, hazeA:.6});
    // the volcano: broad cone, glowing crater lip and veins of lava running down
    { const vx=W*.62, vb=hz+1, vw=W*.26, vh=H*.22, cw=vw*.16, ty=vb-vh;
      const cone=()=>{ x.beginPath(); x.moveTo(vx-vw,vb); x.quadraticCurveTo(vx-vw*.4,vb-vh*.35,vx-cw,ty); x.lineTo(vx-cw*.4,ty+vh*.03); x.lineTo(vx+cw*.3,ty+vh*.015); x.lineTo(vx+cw,ty); x.quadraticCurveTo(vx+vw*.45,vb-vh*.4,vx+vw,vb); x.closePath(); };
      x.fillStyle=P.rock; cone(); x.fill(); x.save(); cone(); x.clip();
      const sg=x.createLinearGradient(vx-vw,0,vx+vw,0); sg.addColorStop(0,v3rgba(P.rim,.12)); sg.addColorStop(.45,'rgba(0,0,0,0)'); sg.addColorStop(1,v3rgba(P.rockD,.8)); x.fillStyle=sg; x.fillRect(vx-vw,ty,vw*2,vh);
      x.strokeStyle=v3rgba(P.rockD,.6); x.lineWidth=1; for(let k=0;k<9;k++){ const a=-1+k*.25; x.beginPath(); x.moveTo(vx+a*cw*.8,ty+vh*.03); x.quadraticCurveTo(vx+a*vw*.3,vb-vh*.5,vx+a*vw*.9,vb); x.stroke(); }
      // lava veins with a hot core
      for(const [a,len,sd] of [[-.35,.75,1],[.1,.55,2],[.42,.85,3]]){ const r=v3rng(sd); let X=vx+a*cw, Y=ty+vh*.02; const pts=[[X,Y]]; for(let k=0;k<8;k++){ Y+=vh*len/8; X+=a*vw*.07+(r()-.5)*vw*.04; pts.push([X,Y]); }
        for(const [lw,col] of [[4,v3rgba(P.lava,.35)],[2,P.lava],[.9,P.lava2]]){ x.strokeStyle=col; x.lineWidth=lw; x.beginPath(); x.moveTo(pts[0][0],pts[0][1]); for(const p of pts) x.lineTo(p[0],p[1]); x.stroke(); } }
      x.restore();
      x.fillStyle=P.lava2; x.beginPath(); x.moveTo(vx-cw*.85,ty+1); x.lineTo(vx-cw*.4,ty+vh*.03); x.lineTo(vx+cw*.3,ty+vh*.015); x.lineTo(vx+cw*.85,ty+1); x.quadraticCurveTo(vx,ty-vh*.02,vx-cw*.85,ty+1); x.fill(); }
    // a hillside of travertine on the left bank: the slope itself, then terraces cut into it, each holding
    // a steaming turquoise pool, with pale mineral curtains dripping over every lip
    { const hill=()=>{ x.beginPath(); x.moveTo(-2,hz+1); x.lineTo(-2,hz-H*.11); x.bezierCurveTo(W*.08,hz-H*.115,W*.18,hz-H*.07,W*.34,hz+1); x.closePath(); };
      x.fillStyle=mix(P.terr,P.rockD,.35); hill(); x.fill();
      const mc=mix(mix('#f0e8dc',P.terr,.35),P.rockD,P.night*.65);
      for(let k=0;k<5;k++){ const tx=W*(.0+k*.062), tw=W*.075, ty=hz-H*(.098-k*.021), lip=ty+H*.005;
        x.fillStyle=mix(P.terr,P.farHaze,.06*k); x.beginPath(); x.moveTo(tx-W*.01,ty+H*.012); x.quadraticCurveTo(tx,ty-H*.003,tx+tw*.3,ty-H*.003); x.lineTo(tx+tw*.85,ty-H*.003); x.quadraticCurveTo(tx+tw*1.05,ty-H*.001,tx+tw*1.04,lip); x.lineTo(tx+tw*1.04,ty+H*.02); x.lineTo(tx-W*.01,ty+H*.024); x.closePath(); x.fill();
        x.fillStyle=mc; x.beginPath(); x.moveTo(tx+tw*.1,lip); for(let j=0;j<=9;j++){ const u=j/9, X=tx+tw*(.1+u*.94), dl=H*(.007+((j*5)%3)*.004); x.lineTo(X,lip+dl); x.lineTo(X+tw*.05,lip+dl*.35); } x.lineTo(tx+tw*1.04,lip); x.closePath(); x.fill();
        x.fillStyle=v3rgba(mc,.45); for(let j=0;j<4;j++) x.fillRect(tx+tw*(.2+j*.22),lip,1.3,H*(.012+((j*7)%3)*.004));
        x.fillStyle=mix(P.pool,P.wMid,.2+P.night*.35); x.beginPath(); x.ellipse(tx+tw*.58,ty+H*.0006,tw*.4,H*.0035,0,0,7); x.fill();
        x.fillStyle=v3rgba(mix(P.pool,'#ffffff',.6),.55*(1-P.night*.6)); x.fillRect(tx+tw*.32,ty-H*.0015,tw*.3,1); } }
    // basalt cliffs on the right bank: one jagged mass whose face splits into tall columns, slanted caps catching the light
    { const x0=W*.83, cols=14, cw=(W*1.02-x0)/cols, tops=[]; for(let i=0;i<=cols;i++){ const u=i/cols; tops.push(hz-H*(.025+.07*Math.sin(Math.min(1,u*1.3)*Math.PI*.55)+.006*Math.sin(i*2.7))); }
      x.fillStyle=P.rock; x.beginPath(); x.moveTo(x0-W*.02,hz+1); x.quadraticCurveTo(x0-W*.01,hz-H*.01,x0,tops[0]); for(let i=0;i<cols;i++){ x.lineTo(x0+i*cw+cw*.15,tops[i]-H*.004); x.lineTo(x0+(i+1)*cw,tops[i+1]); } x.lineTo(W+2,hz+1); x.closePath(); x.fill();
      for(let i=0;i<cols;i++){ const y0=Math.max(tops[i],tops[i+1]); x.fillStyle=i%3===1?v3rgba(P.rockD,.4):i%3===2?v3rgba(P.rim,.05):'rgba(0,0,0,0)'; x.fillRect(x0+i*cw,y0,cw,hz-y0+1); x.fillStyle=v3rgba(P.rockD,.75); x.fillRect(x0+i*cw,y0+H*.004,1,hz-y0); x.strokeStyle=v3rgba(P.rim,.25); x.lineWidth=1.2; x.beginPath(); x.moveTo(x0+i*cw+1,tops[i]+.5); x.lineTo(x0+i*cw+cw*.15,tops[i]-H*.004+.5); x.lineTo(x0+(i+1)*cw-1,tops[i+1]+.5); x.stroke(); }
      x.fillStyle=v3rgba(P.farHaze,.25); x.fillRect(x0-W*.02,hz-H*.012,W*.2,H*.013); }
    v3water(x,P,hz,cnv,.25);
    // a warm glow in the water under the volcano
    const wg=x.createRadialGradient(W*.62,hz+H*.04,0,W*.62,hz+H*.04,W*.3); wg.addColorStop(0,v3rgba(P.lava,.22)); wg.addColorStop(1,v3rgba(P.lava,0)); x.fillStyle=wg; x.fillRect(0,hz,W,H-hz);
  },
  live(P,t,hz,sun){ const FX=S.settings.effects, night=P.night;
    const vx=W*.62, ty=hz+1-H*.22;
    // the crater breathes: a glow that swells and fades; smoke rolls up from it
    v3glow(g,vx,ty,H*.12,v3rgba(P.lava,.9),.25+night*.3+.15*Math.sin(t*1.3));
    if(FX){ for(let i=0;i<9;i++){ const k=((t*.05+i/9)%1), sx=vx+Math.sin(k*4+i)*W*.01+k*W*.06, sy=ty-k*H*.25, rr=H*(.01+k*.04); g.fillStyle=v3rgba(mix(P.cloud,P.lava,(1-k)*.35*night+.05),.35*(1-k)); g.beginPath(); g.arc(sx,sy,rr,0,7); g.fill(); } }
    v3glitter(P,t,hz,sun);
    // steam lifting off the warm water in soft columns
    if(FX){ for(let i=0;i<12;i++){ const sx=W*(.22+((i*0.071)%0.72)), k=((t*.1+i*.29)%1), base=hz+H*(.04+((i*37)%30)/100), sy=base-k*H*.1, a=.11*Math.sin(k*Math.PI)*(1-P.night*.3); const sg=g.createLinearGradient(0,sy-H*.04,0,sy+H*.02); sg.addColorStop(0,v3rgba('#ffffff',0)); sg.addColorStop(.5,v3rgba(mix('#ffffff',P.farHaze,.3),a)); sg.addColorStop(1,v3rgba('#ffffff',0)); g.fillStyle=sg; g.beginPath(); g.ellipse(sx+Math.sin(t*.6+i+k*3)*W*.008,sy-H*.01,W*(.006+k*.012),H*(.022+k*.025),Math.sin(t*.4+i)*.15,0,7); g.fill(); } }
    // bubble rings popping on the surface
    for(let i=0;i<5;i++){ const k=((t*.5+i*.37)%1), bx=W*(.35+i*.12), by=hz+H*(.1+((i*41)%30)/100); g.strokeStyle=v3rgba(mix(P.wTop,'#ffffff',.5),.5*(1-k)); g.lineWidth=1; g.beginPath(); g.ellipse(bx,by,2+k*W*.012,1+k*H*.004,0,0,7); g.stroke(); }
    // embers drifting up everywhere, flickering
    g.save(); g.globalCompositeOperation='lighter'; const nE=FX?40:15; for(let i=0;i<nE;i++){ const sp=.4+((i*13)%10)/15, X=((i*89.3+Math.sin(t*.8+i)*W*.02)%W), Y=H-((t*H*.06*sp+i*57.7)%(H*1.05)), a=.4+.6*Math.abs(Math.sin(t*4+i*1.7)); g.fillStyle=v3rgba(i%3?P.lava2:P.lava,a*(.5+night*.5)); g.fillRect(X,Y,1.6,1.6); } g.restore();
    v3fishRing(P,t,hz,7.1,.4,.85);
  },
  fore(P,t){ // glowing moths flutter at the bottom right
    g.save(); g.globalCompositeOperation='lighter'; for(let i=0;i<4;i++){ const mx=W*(.82+i*.04)+Math.sin(t*1.3+i*2)*W*.02, my=H*(.82-i*.04)+Math.sin(t*2.1+i)*H*.02, fl=Math.abs(Math.sin(t*14+i)), s=H*.005;
      v3glow(g,mx,my,s*5,'rgba(255,200,120,.8)',.3+.2*P.night); g.fillStyle=v3rgba('#ffe0a0',.8); g.beginPath(); g.ellipse(mx-s*fl,my,s*1.2*fl+.4,s*.8,0,0,7); g.ellipse(mx+s*fl,my,s*1.2*fl+.4,s*.8,0,0,7); g.fill(); } g.restore();
  }
};

// standing on basalt columns: hexagonal tops at slightly different heights, hot cracks glowing between them,
// a stone lantern, a woven basket
function v3stonePlat(P,t,night,dockY){
  const PW=W*.19, N=c=>mix(c,'#050204',night*.3), lit=.4+night*.6, lx=PW-W*.01, ly=dockY-H*.07;
  v3glow(g,lx,ly,H*.17,'rgba('+homeLight('255,170,90')+',.85)',lit*.5*(.92+.08*Math.sin(t*5.7)));
  const cw=W*.032, cols=Math.ceil((PW+W*.03)/cw)+1;
  for(let i=0;i<cols;i++){ const cx=-W*.01+i*cw, top=dockY-H*.004+((i*7)%3)*H*.004-(i===cols-1?0:0), hx=cw*.5;
    // column body with facets
    g.fillStyle=N(i%2?'#3a2e30':'#2e2428'); g.fillRect(cx,top,cw,H-top); g.fillStyle=N('#4a3c3c'); g.fillRect(cx,top,cw*.35,H-top); g.fillStyle=N('#1e1618'); g.fillRect(cx+cw*.75,top,cw*.25,H-top);
    // hex top
    g.fillStyle=N('#5a4a48'); g.beginPath(); g.moveTo(cx,top); g.lineTo(cx+cw*.22,top-H*.007); g.lineTo(cx+cw*.78,top-H*.007); g.lineTo(cx+cw,top); g.lineTo(cx+cw*.78,top+H*.005); g.lineTo(cx+cw*.22,top+H*.005); g.closePath(); g.fill();
    g.strokeStyle=v3rgba(P.rim,.25); g.lineWidth=1; g.beginPath(); g.moveTo(cx+cw*.22,top-H*.007); g.lineTo(cx+cw*.78,top-H*.007); g.stroke();
    // a glowing crack in the seam
    if(i%2===0){ g.strokeStyle=v3rgba(P.lava,.5+.3*Math.sin(t*1.7+i)); g.lineWidth=1.4; g.beginPath(); g.moveTo(cx+cw,top+H*.01); g.lineTo(cx+cw+1,top+H*.04); g.lineTo(cx+cw-1,top+H*.07); g.stroke(); } }
  // stone lantern: base, post, firebox with a window, roof cap
  { const s=H*.012, bx=lx; g.fillStyle=N('#6a5a54'); g.fillRect(bx-s*1.2,dockY-H*.012,s*2.4,s*.7); g.fillRect(bx-s*.45,ly+s*1.6,s*.9,dockY-H*.012-(ly+s*1.6));
    g.fillRect(bx-s*1.1,ly-s*1.1,s*2.2,s*2.6); g.fillStyle=v3rgba('#ffb060',.6+lit*.4); g.fillRect(bx-s*.55,ly-s*.6,s*1.1,s*1.4);
    g.fillStyle=N('#5a4a44'); g.beginPath(); g.moveTo(bx-s*1.9,ly-s*1.1); g.lineTo(bx,ly-s*2.4); g.lineTo(bx+s*1.9,ly-s*1.1); g.closePath(); g.fill(); g.beginPath(); g.arc(bx,ly-s*2.5,s*.35,0,7); g.fill(); }
  // a woven basket by the angler
  { const bx=W*.152, s=H*.018, by=dockY-H*.006; g.fillStyle=N('#a07a48'); g.beginPath(); g.moveTo(bx,by); g.lineTo(bx+s*.15,by-s); g.lineTo(bx+s*1.15,by-s); g.lineTo(bx+s*1.3,by); g.closePath(); g.fill(); g.strokeStyle=N('#6a4a28'); g.lineWidth=.8; for(let k=1;k<4;k++){ g.beginPath(); g.moveTo(bx+s*.05,by-s*k/4); g.lineTo(bx+s*1.25,by-s*k/4); g.stroke(); } }
}
V3PLAT.stone=(P,t,night,dockY)=>v3stonePlat(P,t,night,dockY);

// =====================================================================
// STARFALL LAKE: a lake above the clouds, a sea of cloud tops at the horizon, a ringed planet, the Milky Way,
// floating islands with waterfalls, crystal spires, shooting stars that fall into the water, light wisps,
// and a constellation of a fish that slowly draws itself
// =====================================================================
V3PAL.starfall = {
  day:  {top:'#4a4aa8', mid:'#9a8ad8', bot:'#f0d8f0', glow:'#fff4ff', far:'#c8b8e8', farHaze:'#f0e0f8', cloudSea:'#f4ecfa', cloudSh:'#c8b8e0', isl:'#5a8a6a', islD:'#4a3a5a', wTop:'#c8b0f0', wMid:'#6a5ab0', wBot:'#1a1440', rim:'#fff0ff', cry:'#b88aff', cry2:'#7ae0ff', planet:'#f0b890', ring:'#e8d0ff', star:'#ffffff', cloud:'#ffffff', cloudLit:'#fff4ff', leaf:'#5a8a6a'},
  dusk: {top:'#1a1040', mid:'#7a3a8a', bot:'#ff9ab0', glow:'#ffd0e0', far:'#7a5a9a', farHaze:'#e8a0c0', cloudSea:'#f0b8c8', cloudSh:'#8a6a9a', isl:'#4a5a5a', islD:'#2e2440', wTop:'#e8a0d0', wMid:'#4a2a7a', wBot:'#0e0828', rim:'#ffd8f0', cry:'#c890ff', cry2:'#8ae8ff', planet:'#ffb080', ring:'#ffd0e8', star:'#ffffff', cloud:'#d890b0', cloudLit:'#ffd8e0', leaf:'#4a5a5a'},
  night:{top:'#04021a', mid:'#120a3a', bot:'#2a1a5a', glow:'#d8c8ff', far:'#1e1846', farHaze:'#3a2a6a', cloudSea:'#4a3e80', cloudSh:'#241c4a', isl:'#1e2a3a', islD:'#100c22', wTop:'#2a1e5a', wMid:'#100a30', wBot:'#020108', rim:'#c8b8ff', cry:'#a070ff', cry2:'#5ad8ff', planet:'#c89a80', ring:'#b8a0e8', star:'#ffffff', cloud:'#2a2050', cloudLit:'#5a4a90', leaf:'#1e2a3a'}
};
V3SCENES.starfall = {
  sky(P,t,hz){ const sa=.35+P.night*.65;
    // the Milky Way: soft clouds of light along a gentle arc, darker dust lanes, a dense dust of stars
    // (painted once into its own canvas per size and light level, then laid over the sky)
    { const key=W+'|'+H+'|'+Math.round(P.night*8)+'|'+Math.round(P.d*5); if(!this.mw||this.mw.key!==key){ const c=this.mw?this.mw.c:document.createElement('canvas'); c.width=Math.round(W*Math.min(DPR,2)); c.height=Math.round(hz*Math.min(DPR,2)); const m=c.getContext('2d'); m.setTransform(Math.min(DPR,2),0,0,Math.min(DPR,2),0,0); m.clearRect(0,0,W,hz);
        const r=v3rng(42), along=u=>[W*(u*1.15-.07), hz*(.92-u*.82)+Math.sin(u*3.2)*hz*.06], col=mix(P.ring,'#ffffff',.45);
        for(let i=0;i<46;i++){ const u=r(), [X,Y]=along(u), off=(r()-.5)*hz*.12, rad=hz*(.05+r()*.09), gr=m.createRadialGradient(X,Y+off,0,X,Y+off,rad); gr.addColorStop(0,v3rgba(i%5?col:mix(col,P.cry,.5),.09+r()*.07)); gr.addColorStop(1,v3rgba(col,0)); m.fillStyle=gr; m.fillRect(X-rad,Y+off-rad,rad*2,rad*2); }
        m.globalCompositeOperation='destination-out'; for(let i=0;i<14;i++){ const u=.1+r()*.8, [X,Y]=along(u), rad=hz*(.02+r()*.03), gr=m.createRadialGradient(X,Y,0,X,Y,rad); gr.addColorStop(0,'rgba(0,0,0,.45)'); gr.addColorStop(1,'rgba(0,0,0,0)'); m.fillStyle=gr; m.fillRect(X-rad*1.6,Y-rad,rad*3.2,rad*2); } m.globalCompositeOperation='source-over';
        m.fillStyle='#ffffff'; for(let i=0;i<340;i++){ const u=r(), [X,Y]=along(u), off=(r()+r()+r()-1.5)*hz*.09, s=r()*1.1+.35; m.globalAlpha=.3+r()*.6; m.fillRect(X,Y+off,s,s); } m.globalAlpha=1;
        this.mw={key,c}; }
      g.globalAlpha=.3+P.night*.7; g.drawImage(this.mw.c,0,0,W,hz); g.globalAlpha=1; }
    // the ringed planet, back half of the ring, the planet, then the front half
    sfPlanet(P,t,hz);
    // a constellation of a fish, always in the sky, its stars twinkling and its lines softly glowing
    starSignature(P,t,hz,sa); },/*SIGEND*/
  land(x,P,hz,cnv){
    // crystal spires rising from the far shores
    const cry=(cx,base,w,h,col)=>{ x.fillStyle=col; x.beginPath(); x.moveTo(cx-w,base); x.lineTo(cx-w*.8,base-h*.8); x.lineTo(cx,base-h); x.lineTo(cx+w*.8,base-h*.78); x.lineTo(cx+w,base); x.closePath(); x.fill(); x.fillStyle=v3rgba('#ffffff',.25); x.beginPath(); x.moveTo(cx,base-h); x.lineTo(cx-w*.8,base-h*.8); x.lineTo(cx-w*.3,base); x.lineTo(cx,base); x.closePath(); x.fill(); x.fillStyle=v3rgba('#000000',.18); x.beginPath(); x.moveTo(cx,base-h); x.lineTo(cx+w*.8,base-h*.78); x.lineTo(cx+w,base); x.lineTo(cx+w*.3,base); x.closePath(); x.fill(); };
    // the sea of cloud tops at the horizon: billows lit from above, shadowed below
    for(let L=0;L<2;L++){ const y=hz+1-L*H*.012, col=L?mix(P.cloudSea,P.farHaze,.4):P.cloudSea; x.fillStyle=col; x.beginPath(); x.moveTo(-5,hz+2); for(let i=0;i<=30;i++){ const X=W*i/30-L*W*.016, h=H*(.012+.012*Math.abs(Math.sin(i*1.9+L*2)))*(L?1.3:1); x.quadraticCurveTo(X-W/60,y-h*1.6,X,y-h*.6); } x.lineTo(W+5,hz+2); x.closePath(); x.fill(); }
    const cs=x.createLinearGradient(0,hz-H*.03,0,hz+1); cs.addColorStop(0,v3rgba(P.cloudSh,0)); cs.addColorStop(1,v3rgba(P.cloudSh,.5)); x.fillStyle=cs; x.fillRect(0,hz-H*.03,W,H*.031);
    for(const [cx,w,h,c] of [[.3,.008,.07,P.cry],[.33,.006,.05,P.cry2],[.36,.005,.035,P.cry],[.78,.01,.09,P.cry2],[.82,.007,.06,P.cry],[.86,.005,.04,P.cry2],[.9,.008,.075,P.cry]]) cry(W*cx,hz+1,W*w,H*h,mix(c,P.farHaze,.25));
    v3water(x,P,hz,cnv,.35);
  },
  live(P,t,hz,sun){ const FX=S.settings.effects, night=P.night, sa=.35+night*.65;
    // floating islands drift and bob: a mossy top that overhangs, a rocky underside tapering to a point with
    // hanging roots, a little crystal or tree on top, and a thin waterfall spilling into the clouds
    for(const [ix,iy,iw,ph,fall,top] of [[.42,.4,.06,0,1,'tree'],[.6,.24,.035,1.7,0,'cry'],[.92,.46,.045,3.1,1,'cry']]){ const X=W*ix+Math.sin(t*.13+ph)*W*.008, Y=hz*iy+Math.sin(t*.5+ph)*hz*.02, w=W*iw, h=w*1.15, rk=mix(P.islD,P.far,.25);
      g.fillStyle=rk; g.beginPath(); g.moveTo(X-w,Y); g.quadraticCurveTo(X-w*.95,Y+h*.25,X-w*.6,Y+h*.38); g.quadraticCurveTo(X-w*.35,Y+h*.62,X-w*.08,Y+h*.78); g.quadraticCurveTo(X+w*.02,Y+h*1.02,X+w*.12,Y+h*.74); g.quadraticCurveTo(X+w*.45,Y+h*.5,X+w*.7,Y+h*.32); g.quadraticCurveTo(X+w*.98,Y+h*.18,X+w,Y); g.closePath(); g.fill();
      g.save(); g.clip(); const ug=g.createLinearGradient(X-w,0,X+w,0); ug.addColorStop(0,v3rgba(P.rim,.16)); ug.addColorStop(.45,'rgba(0,0,0,0)'); ug.addColorStop(1,'rgba(0,0,0,.32)'); g.fillStyle=ug; g.fillRect(X-w,Y,w*2,h*1.1); g.strokeStyle=v3rgba('#000000',.2); g.lineWidth=1; for(let k=1;k<4;k++){ g.beginPath(); g.moveTo(X-w,Y+h*k*.18); g.quadraticCurveTo(X,Y+h*k*.2,X+w,Y+h*k*.16); g.stroke(); } g.restore();
      g.strokeStyle=v3rgba(mix(P.isl,P.islD,.5),.8); g.lineWidth=.9; g.beginPath(); for(let k=0;k<4;k++){ const rx=X+w*(-.55+k*.32), ry=Y+h*(.36+Math.abs(k-1.5)*-.06+.12); g.moveTo(rx,ry); g.quadraticCurveTo(rx+Math.sin(t*.8+k)*w*.04,ry+h*.15,rx+w*.03,ry+h*(.22+k%2*.1)); } g.stroke();
      g.fillStyle=P.isl; g.beginPath(); g.moveTo(X-w*1.05,Y+h*.02); g.quadraticCurveTo(X-w*.9,Y-h*.12,X,Y-h*.13); g.quadraticCurveTo(X+w*.9,Y-h*.12,X+w*1.05,Y+h*.02); for(let k=0;k<=8;k++){ const u=k/8, xx=X+w*(1.05-u*2.1), dd=h*(.04+((k*5)%3)*.03); g.lineTo(xx,Y+dd); } g.closePath(); g.fill();
      g.fillStyle=v3rgba(mix(P.isl,'#ffffff',.35),.6); g.beginPath(); g.moveTo(X-w*.8,Y-h*.06); g.quadraticCurveTo(X-w*.2,Y-h*.14,X+w*.3,Y-h*.1); g.quadraticCurveTo(X-w*.2,Y-h*.09,X-w*.8,Y-h*.06); g.fill();
      if(top==='tree'){ const tx=X-w*.3, ty=Y-h*.1; g.strokeStyle=mix('#6a4a3a',P.islD,.3+P.night*.4); g.lineWidth=Math.max(1.2,w*.05); g.beginPath(); g.moveTo(tx,ty); g.quadraticCurveTo(tx+w*.05,ty-h*.25,tx+w*.02,ty-h*.42); g.stroke(); g.fillStyle=mix(P.cry,P.isl,.35); for(const [dx,dy,rr] of [[0,-.48,.2],[-.14,-.4,.15],[.15,-.4,.16],[.02,-.6,.13]]){ g.beginPath(); g.arc(tx+w*dx,ty+h*dy,w*rr,0,7); g.fill(); } g.fillStyle=v3rgba('#ffffff',.25); g.beginPath(); g.arc(tx-w*.04,ty-h*.53,w*.07,0,7); g.fill(); }
      else { const tx=X+w*.2, ty=Y-h*.1; for(const [dx,hh,ww,c] of [[0,.45,.1,P.cry2],[-.14,.3,.07,P.cry],[.12,.25,.06,P.cry]]){ const cx2=tx+w*dx; g.fillStyle=c; g.beginPath(); g.moveTo(cx2-w*ww,ty); g.lineTo(cx2-w*ww*.7,ty-h*hh*.8); g.lineTo(cx2,ty-h*hh); g.lineTo(cx2+w*ww*.7,ty-h*hh*.78); g.lineTo(cx2+w*ww,ty); g.closePath(); g.fill(); g.fillStyle=v3rgba('#ffffff',.3); g.beginPath(); g.moveTo(cx2,ty-h*hh); g.lineTo(cx2-w*ww*.7,ty-h*hh*.8); g.lineTo(cx2-w*ww*.2,ty); g.lineTo(cx2,ty); g.closePath(); g.fill(); } v3glow(g,tx,ty-h*.25,w*.6,v3rgba(P.cry2,.7),.25+.25*P.night); }
      if(fall) (M33.falls=M33.falls||{})[ix]=[t+ph,X,Y,w,h]; }
    // crystals glint
    for(let i=0;i<5;i++){ const k=(t*.25+i*.31)%1, a=Math.max(0,Math.sin(k*Math.PI))**8; if(a<.05) continue; const gx=W*[.3,.33,.78,.82,.9][i], gy=hz-H*[.06,.04,.08,.05,.065][i]; g.fillStyle=v3rgba('#ffffff',a); g.fillRect(gx-H*.008,gy,H*.016,1); g.fillRect(gx,gy-H*.008,1,H*.016); }
    // the Milky Way and the planet's glow mirrored in the still water
    if(this.mw){ g.save(); g.beginPath(); g.rect(0,hz,W,H-hz); g.clip(); g.globalAlpha=.22*sa; g.translate(0,hz); g.scale(1,-.8); g.translate(0,-hz); g.drawImage(this.mw.c,0,0,W,hz); g.restore(); }
    v3glitter(P,t,hz,sun);
    // star glints scattered on the water
    g.fillStyle=P.star; for(let i=0;i<40;i++){ const X=(i*97.3)%W, Y=hz+H*.02+((i*61.7)%100)/100*(H-hz)*.9; g.globalAlpha=sa*.5*Math.abs(Math.sin(t*1.2+i*1.7)); g.fillRect(X,Y,1.3,1.3); } g.globalAlpha=1;
    // shooting stars: a streak falls, and where it meets the lake, a ring of light spreads
    { const per=6.5, k=(t%per)/per, n=Math.floor(t/per), r=v3rng(n*29+11), sx=W*(.35+r()*.55), ex=sx-W*(.08+r()*.08), ey=hz+H*(.08+r()*.2);
      if(k<.18){ const e=k/.18, cx=sx+(ex-sx)*e, cy=H*.05+(ey-H*.05)*e*e; const sg=g.createLinearGradient(cx,cy,cx+(sx-ex)*.25,cy-(ey-H*.05)*.25); sg.addColorStop(0,'rgba(255,255,255,.95)'); sg.addColorStop(1,'rgba(255,255,255,0)'); g.strokeStyle=sg; g.lineWidth=2; g.beginPath(); g.moveTo(cx,cy); g.lineTo(cx+(sx-ex)*.25,cy-(ey-H*.05)*.25); g.stroke(); v3glow(g,cx,cy,H*.02,'rgba(220,230,255,.9)',.7); }
      else if(k<.6){ const e=(k-.18)/.42; g.strokeStyle=v3rgba(P.cry2,.7*(1-e)); g.lineWidth=1.4; for(let j=0;j<2;j++){ const ee=Math.max(0,e-j*.15); g.beginPath(); g.ellipse(ex,ey,W*.004+ee*W*.05,H*.002+ee*H*.012,0,0,7); g.stroke(); } v3glow(g,ex,ey,H*.04,'rgba(160,230,255,.8)',.5*(1-e)); } }
    // light wisps drift through the air
    if(FX){ g.save(); g.globalCompositeOperation='lighter'; for(let i=0;i<7;i++){ const wx=W*((i*.137+t*.006*(1+i%3*.3))%1), wy=hz*(.55+((i*37)%40)/100)+Math.sin(t*.7+i*2)*hz*.05, a=.4+.3*Math.sin(t*2+i); v3glow(g,wx,wy,H*.012,v3rgba(i%2?P.cry2:P.cry,.9),a*.6); g.fillStyle=v3rgba('#ffffff',a); g.fillRect(wx-1,wy-1,2,2); } g.restore(); }
    v3fishRing(P,t,hz,7.5,.42,.86);
  },
  fore(P,t){ // a cluster of crystals growing in the bottom right corner, pulsing softly
    const b=H+2; for(const [cx,w,h,c,a] of [[.93,.012,.14,P.cry,-.15],[.955,.01,.1,P.cry2,.1],[.975,.014,.17,P.cry,.25],[.91,.007,.07,P.cry2,-.35],[.995,.01,.11,P.cry2,.4]]){ g.save(); g.translate(W*cx,b); g.rotate(a); const ww=W*w, hh=H*h;
      g.fillStyle=v3rgba(mix(c,P.wBot,.2+P.night*.1),.9); g.beginPath(); g.moveTo(-ww,0); g.lineTo(-ww*.8,-hh*.8); g.lineTo(0,-hh); g.lineTo(ww*.8,-hh*.78); g.lineTo(ww,0); g.closePath(); g.fill();
      g.fillStyle=v3rgba('#ffffff',.3); g.beginPath(); g.moveTo(0,-hh); g.lineTo(-ww*.8,-hh*.8); g.lineTo(-ww*.25,0); g.lineTo(0,0); g.closePath(); g.fill(); g.restore(); v3glow(g,W*cx,b-H*h*.5,H*h*.6,v3rgba(c,.6),.2+.12*Math.sin(t*1.5+cx*30)); }
  }
};

// a floating shard of amethyst: a faceted slab hanging over the lake, glowing edges, small crystals sprouting,
// and a lantern orb hovering at the end
function v3crystalPlat(P,t,night,dockY){
  const PW=W*.19, sa=.5+night*.5, ox=PW-W*.01, oy=dockY-H*.085+Math.sin(t*1.3)*H*.004;
  v3glow(g,ox,oy,H*.2,'rgba('+homeLight('190,160,255')+',.85)',.45*sa);
  const ed=PW+W*.012, pts=[[-2,dockY],[ed,dockY],[ed-W*.02,dockY+H*.08],[PW*.6,dockY+H*.17],[PW*.35,dockY+H*.24],[PW*.15,dockY+H*.15],[-2,dockY+H*.12]];
  const sg=g.createLinearGradient(0,dockY,0,dockY+H*.24); sg.addColorStop(0,mix(P.cry,'#ffffff',.15)); sg.addColorStop(1,mix(P.cry,P.wBot,.6)); g.fillStyle=sg; g.beginPath(); g.moveTo(pts[0][0],pts[0][1]); for(const p of pts) g.lineTo(p[0],p[1]); g.closePath(); g.fill();
  // facets
  g.fillStyle=v3rgba('#ffffff',.14); g.beginPath(); g.moveTo(PW*.3,dockY); g.lineTo(PW*.6,dockY+H*.17); g.lineTo(PW*.35,dockY+H*.24); g.lineTo(PW*.1,dockY); g.closePath(); g.fill();
  g.fillStyle=v3rgba('#000000',.16); g.beginPath(); g.moveTo(PW*.7,dockY); g.lineTo(ed,dockY); g.lineTo(ed-W*.02,dockY+H*.08); g.lineTo(PW*.6,dockY+H*.17); g.closePath(); g.fill();
  g.strokeStyle=v3rgba(P.cry2,.5+.2*Math.sin(t*2)); g.lineWidth=1.2; g.beginPath(); g.moveTo(pts[0][0],pts[0][1]); for(const p of pts) g.lineTo(p[0],p[1]); g.stroke();
  g.fillStyle=v3rgba('#ffffff',.55); g.fillRect(-2,dockY-1,ed,1.4);
  // motes dripping from the tip
  for(let k=0;k<3;k++){ const kk=((t*.5+k/3)%1); g.fillStyle=v3rgba(P.cry2,.7*(1-kk)); g.fillRect(PW*.35,dockY+H*.24+kk*H*.06,1.6,1.6); }
  // small crystals sprouting from the slab
  for(const [cx,h,c] of [[.02,.03,P.cry2],[.035,.02,P.cry],[.155,.022,P.cry2]]){ const X=W*cx, hh=H*h, ww=hh*.28; g.fillStyle=mix(c,'#ffffff',.1); g.beginPath(); g.moveTo(X-ww,dockY); g.lineTo(X-ww*.6,dockY-hh*.8); g.lineTo(X,dockY-hh); g.lineTo(X+ww*.6,dockY-hh*.8); g.lineTo(X+ww,dockY); g.closePath(); g.fill(); g.fillStyle=v3rgba('#ffffff',.3); g.beginPath(); g.moveTo(X,dockY-hh); g.lineTo(X-ww*.6,dockY-hh*.8); g.lineTo(X-ww*.2,dockY); g.lineTo(X,dockY); g.closePath(); g.fill(); }
  // the hovering lantern orb with a ring around it
  g.fillStyle=v3rgba('#f4ecff',.9); g.beginPath(); g.arc(ox,oy,H*.01,0,7); g.fill(); g.strokeStyle=v3rgba(P.cry2,.7); g.lineWidth=1; g.beginPath(); g.ellipse(ox,oy,H*.018,H*.005,Math.sin(t*.8)*.3,0,7); g.stroke();
}
V3PLAT.crystal=(P,t,night,dockY)=>v3crystalPlat(P,t,night,dockY);

// ---------- the Home tab's dock diorama, in the 0.3 look ----------
// Uses the current area's sky colours and its cached landscape, so the preview always matches where you fish.
function paintHome3(c){ const x=c.getContext('2d'), w=c.width, h=c.height, t=performance.now()/1000, P=v3palette.v; if(!P) return false;
  const hz=h*.5, dy=h*.66;
  const sg=x.createLinearGradient(0,0,0,hz); sg.addColorStop(0,P.top); sg.addColorStop(.55,P.mid); sg.addColorStop(1,P.bot); x.fillStyle=sg; x.fillRect(0,0,w,hz+1);
  if(P.night>.1){ const r=v3rng(9); x.fillStyle="#ffffff"; for(let i=0;i<70;i++){ x.globalAlpha=P.night*(.3+.6*Math.abs(Math.sin(t*.7+i))); const s=.8+r()*1.4; x.fillRect(r()*w,r()*hz*.8,s,s); } x.globalAlpha=1; }
  { const wg=x.createLinearGradient(0,hz,0,h); wg.addColorStop(0,P.wTop||"#6aa"); wg.addColorStop(.35,P.wMid||"#357"); wg.addColorStop(1,P.wBot||"#123"); x.fillStyle=wg; x.fillRect(0,hz,w,h-hz); }
  if(V3CACHE){ const src=V3CACHE.c, sH=src.height, sW=src.width, srcHz=HZ()*sH/H, top=srcHz-sH*.3, band=sH*.42; x.drawImage(src,0,Math.max(0,top),sW,band,0,hz-h*.5*(.3/.42)*1.4,w,h*.5*1.4); }
  else { const wg=x.createLinearGradient(0,hz,0,h); wg.addColorStop(0,P.wTop||'#6aa'); wg.addColorStop(1,P.wBot||'#123'); x.fillStyle=wg; x.fillRect(0,hz,w,h-hz); }
  // a soft vignette so the dock reads first
  const vg=x.createRadialGradient(w*.5,h*.62,h*.2,w*.5,h*.62,w*.7); vg.addColorStop(0,'rgba(0,0,0,0)'); vg.addColorStop(1,'rgba(4,8,18,.45)'); x.fillStyle=vg; x.fillRect(0,0,w,h);
  // the dock in the new style: top boards with seams, a beam with nails, mossy posts, a lit edge
  const wd=dockWood(), N=cl=>mix(cl,'#0a1020',P.night*.5), u=2.6, th=5.04*u, fh=7.56*u, x0=w*.03, x1=w*.95; // the same proportions as the dock on the water, at Home's zoom (the angler is drawn at 2.6)
  const posts=dockPosts5(x0,x1,9.24*u);
  drawDockStyle(x,{x0,x1,y:dy,th,fh,bottom:h,wd,N,rim:P.rim,t,posts,pw:9.24*u,wl:dy+31.5*u,wc:P.wMid});
  const items=dockView(), s=2.6, PP=dockPositions(items,(.46-HOME_X0)/(HOME_X1-HOME_X0),(.64-HOME_X0)/(HOME_X1-HOME_X0));
  if(items.includes('cottage')) drawDockItem(x,'cottage',w*.12,dy-th*.4,2.4*.9,t,P.night);
  items.forEach(id=>{ if(id==='cottage'||PP[id]==null) return; drawDockItem(x,id,w*(HOME_X0+PP[id]*(HOME_X1-HOME_X0)),dy-th*.4,s*dockItemScale(id),t,P.night); });
  drawAngler(x,w*.58,dy-th*.4,2.6,S.look,{t,night:P.night*.8}); homePetsDraw(x,w,dy-th*.4,t); /* pets in front of the angler */
  return true; }

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
// light rays, caustics, kelp and bubbles move every frame. Theme and sand colours come from the player's choices.
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
function v3Thumb(id){ if(V3THUMB[id]) return V3THUMB[id]; const SC=V3SCENES[id]; if(!SC) return null;
  const tw=420, th=140, TS=2, oW=W, oH=H, oD=DPR, c=document.createElement('canvas'); c.width=tw*TS; c.height=th*TS; const x=c.getContext('2d'); x.setTransform(TS,0,0,TS,0,0);  try{ W=tw; H=th; DPR=TS; const P=v3palette(id,0,0,0), hz=th*.7; const sg=x.createLinearGradient(0,0,0,hz); sg.addColorStop(0,P.top); sg.addColorStop(.55,P.mid); sg.addColorStop(1,P.bot); x.fillStyle=sg; x.fillRect(0,0,tw,hz+1);
    v3glow(x,tw*.62,hz*.45,th*.5,v3rgba(P.glow,.9),.5);
    if(id==='starfall'){ const r=v3rng(4); x.fillStyle='#ffffff'; for(let i=0;i<60;i++){ x.globalAlpha=.4+r()*.5; x.fillRect(r()*tw,r()*hz*.8,1,1); } x.globalAlpha=1; const px=tw*.2, py=hz*.38, R=th*.13; x.save(); x.translate(px,py); x.rotate(-.3); x.strokeStyle=v3rgba(P.ring,.7); x.lineWidth=R*.2; x.beginPath(); x.ellipse(0,0,R*2,R*.45,0,Math.PI,0); x.stroke(); x.fillStyle=P.planet; x.beginPath(); x.arc(0,0,R,0,7); x.fill(); x.beginPath(); x.ellipse(0,0,R*2,R*.45,0,0,Math.PI); x.stroke(); x.restore(); }
    if(id==='deep'){ for(let b=0;b<3;b++){ const y0=hz*(.06+b*.24), bh=hz*.18, bg=x.createLinearGradient(0,y0,0,y0+bh); bg.addColorStop(0,v3rgba(b%2?P.cl1:P.cl2,0)); bg.addColorStop(.5,v3rgba(b%2?P.cl1:P.cl2,.85)); bg.addColorStop(1,v3rgba(b%2?P.cl1:P.cl2,0)); x.fillStyle=bg; x.beginPath(); x.moveTo(0,y0+bh); for(let i=0;i<=12;i++){ const X=tw*i/12; x.lineTo(X,y0+bh*.2+Math.sin(i*1.7+b)*bh*.15); } x.lineTo(tw,y0+bh); x.closePath(); x.fill(); } x.strokeStyle='rgba(240,245,255,.9)'; x.lineWidth=1.6; x.beginPath(); x.moveTo(tw*.66,hz*.1); x.lineTo(tw*.63,hz*.4); x.lineTo(tw*.67,hz*.45); x.lineTo(tw*.62,hz*.85); x.stroke(); v3glow(x,tw*.64,hz*.4,th*.4,'rgba(220,230,255,.8)',.4); }
    SC.land(x,P,hz,c);
    if(id==='shelf'){ const sx=tw*.7, sy=hz, s=th*.012; x.fillStyle=P.ship; x.fillRect(sx-s*12,sy-s*3,s*24,s*3); x.fillStyle=P.sail; for(const mx of [-7,0,7]) for(let k=0;k<3;k++) x.fillRect(sx+mx*s-s*(4-k),sy-s*(8+k*5),s*(8-k*2),s*4); x.fillStyle=P.buoy; x.beginPath(); x.moveTo(tw*.45-4,hz+th*.12); x.lineTo(tw*.45+4,hz+th*.12); x.lineTo(tw*.45,hz+th*.12-10); x.fill(); }
    V3THUMB[id]=c.toDataURL('image/jpeg',.86); }
  catch(e){ V3THUMB[id]=null; console.warn('thumb '+id,e); }
  finally{ W=oW; H=oH; DPR=oD; v3palette.k=null; }
  return V3THUMB[id]; }
function v3WaterThumbs(P){ P.querySelectorAll('.loc .sw2').forEach((el,i)=>{ const L=LOCS[i]; if(!L) return; const u=v3Thumb(L.id); if(u){ el.style.background='url('+u+') center/cover'; el.classList.add('v3th'); } }); }
{ const _rm=renderMap; renderMap=function(P){ _rm(P); if(V3ON) v3WaterThumbs(P); }; }
