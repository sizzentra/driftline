
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
function v3rock(c,x,y,w,h,P,col,wet,seed){ const base=col||P.stone||'#8a8a8a', r=v3rng(seed||Math.round(x*7+y*13)), n=9, pts=[];
  for(let i=0;i<n;i++){ const a=Math.PI+i/(n-1)*Math.PI, k=.82+r()*.3; pts.push([x+Math.cos(a)*w*k,y+Math.sin(a)*h*1.7*k]); }
  const shape=()=>{ c.beginPath(); c.moveTo(x-w,y); for(let i=0;i<n;i++){ const [px,py]=pts[i], [qx,qy]=pts[(i+1)%n]; c.quadraticCurveTo(px,py,(px+qx)/2,(py+qy)/2); } c.lineTo(x+w,y); c.quadraticCurveTo(x,y+h*.5,x-w,y); c.closePath(); };
  c.fillStyle=base; shape(); c.fill(); c.save(); shape(); c.clip();
  const sg=c.createLinearGradient(x-w,0,x+w,0); sg.addColorStop(0,'rgba(15,12,25,.35)'); sg.addColorStop(.55,'rgba(0,0,0,0)'); sg.addColorStop(1,v3rgba(P.rim,.25)); c.fillStyle=sg; c.fillRect(x-w,y-h*2,w*2,h*3);
  c.fillStyle=v3rgba(P.rim,.22); c.beginPath(); c.moveTo(x-w*.2,y-h*1.45); c.quadraticCurveTo(x+w*.4,y-h*1.6,x+w*.7,y-h*.7); c.quadraticCurveTo(x+w*.2,y-h*1.0,x-w*.2,y-h*1.45); c.fill();
  c.fillStyle=mix(P.leaf||'#5a8a4a','#000000',.2); for(let i=0;i<5;i++){ c.beginPath(); c.ellipse(x-w*.6+r()*w*1.1,y-h*(.2+r()*1.1),w*.07,h*.08,0,0,7); c.fill(); }
  if(wet){ c.fillStyle='rgba(10,20,30,.35)'; c.fillRect(x-w,y-h*.35,w*2,h); } c.restore(); }
// smooth rolling hill band through given points (fractions of W, heights in px above baseY)
function v3hillBand(c,baseY,pts,col){ c.fillStyle=col; c.beginPath(); c.moveTo(0,baseY+2); c.lineTo(0,baseY-pts[0][1]);
  for(let i=1;i<pts.length;i++){ const [x0,h0]=pts[i-1], [x1,h1]=pts[i], mx=(x0+x1)/2*W; c.quadraticCurveTo(x0*W,baseY-h0,mx,baseY-(h0+h1)/2); }
  const [xl,hl]=pts[pts.length-1]; c.lineTo(xl*W,baseY-hl); c.lineTo(W,baseY-hl); c.lineTo(W,baseY+2); c.closePath(); c.fill(); }
// water base: gradient, mirrored reflection of the land, calm bands, a bright waterline
function v3water(x,P,hz,cnv,reflA=.38){ const wg=x.createLinearGradient(0,hz,0,H); wg.addColorStop(0,P.wTop); wg.addColorStop(.32,P.wMid); wg.addColorStop(1,P.wBot); x.fillStyle=wg; x.fillRect(0,hz,W,H-hz);
  x.save(); x.globalAlpha=reflA; x.beginPath(); x.rect(0,hz,W,H*.3); x.clip(); x.translate(0,hz); x.scale(1,-.72); x.translate(0,-hz); x.drawImage(cnv,0,0,cnv.width,Math.round(hz*DPR),0,0,W,hz); x.restore();
  const rb=x.createLinearGradient(0,hz,0,hz+H*.3); rb.addColorStop(0,v3rgba(P.wTop,0)); rb.addColorStop(1,v3rgba(P.wMid,1)); x.fillStyle=rb; x.fillRect(0,hz,W,H*.3);
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
    { const x0=W*.42, x1=W*.76, top=hz-H*.07, dh=H*.02, n=3, span=(x1-x0)/n;
      x.save(); x.beginPath(); x.rect(x0,top,x1-x0,hz-top+1); for(let i=0;i<n;i++){ const ax=x0+span*(i+.5), ar=span*.38; x.moveTo(ax+ar,hz+1); x.arc(ax,hz+1-ar*.2,ar,0,Math.PI,true); x.closePath(); }
      x.fillStyle=P.stone; x.fill('evenodd');
      x.clip('evenodd'); x.strokeStyle=v3rgba(P.stoneD,.6); x.lineWidth=.8; for(let yy=top+dh*1.4;yy<hz;yy+=H*.012){ x.beginPath(); x.moveTo(x0,yy); x.lineTo(x1,yy); x.stroke(); }
      for(let yy=top+dh*1.4,row=0;yy<hz;yy+=H*.012,row++) for(let xx=x0+(row%2)*W*.012;xx<x1;xx+=W*.024){ x.beginPath(); x.moveTo(xx,yy); x.lineTo(xx,yy+H*.012); x.stroke(); }
      x.fillStyle='rgba(0,0,0,.18)'; x.fillRect(x0,top,(x1-x0)*.3,hz-top); x.restore();
      x.fillStyle=P.stoneD; x.fillRect(x0-W*.006,top-dh,(x1-x0)+W*.012,dh); x.fillStyle=v3rgba(P.rim,.4+P.d*.3); x.fillRect(x0-W*.006,top-dh,(x1-x0)+W*.012,1.2);
      for(let i=0;i<=8;i++){ x.fillStyle=P.stoneD; x.fillRect(x0+i*(x1-x0)/8-1,top-dh*2,2.2,dh); } x.fillRect(x0-W*.006,top-dh*2.2,(x1-x0)+W*.012,1.4);
      for(let i=0;i<n;i++){ const ax=x0+span*(i+.5), ar=span*.38; x.strokeStyle=v3rgba(P.stoneD,.9); x.lineWidth=1.4; x.beginPath(); x.arc(ax,hz+1-ar*.2,ar,Math.PI,0); x.stroke(); } }
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
      g.restore(); if(FX){ g.fillStyle=v3rgba(mix(P.wTop,'#ffffff',.6),.6); for(let i=0;i<5;i++){ const k=((t*1.4+i/5)%1); g.fillRect(wx-R*.6+i*R*.3,wy+R*.2+k*R*.9,1.2,2.2); } g.strokeStyle=v3rgba('#ffffff',.5); g.lineWidth=1; g.beginPath(); g.ellipse(wx,mb+2,R*1.1,R*.18,0,0,7); g.stroke(); } }
    v3glitter(P,t,hz,sun);
    v3mist(P,t,hz,.12*(1-night)*(1-d)+.16*d+.08*night);
    // fast current lines flowing right to left at many depths
    g.strokeStyle=v3rgba(mix(P.wTop,'#ffffff',.55),.28); g.lineWidth=1;
    for(let r0=0;r0<12;r0++){ const y=hz+H*.025+Math.pow(r0/12,1.4)*(H-hz)*.95, sp=W*(.06+r0*.012), len=W*(.02+r0*.006), spd=W*(.05+r0*.01);
      g.beginPath(); for(let X=W+sp-((t*spd+r0*71)%sp);X>-len;X-=sp){ const yy=y+Math.sin(X*.03+r0)*1.2; g.moveTo(X,yy); g.lineTo(X+len,yy+.4); } g.stroke(); }
    // river rocks with foam churning around them (kept off the casting line)
    for(const [rx,ry,rw,sd] of [[.43,.62,.028,1],[.82,.88,.04,2],[.6,.95,.034,3]]){ const X=W*rx, Y=H*ry, w=W*rw; v3rock(g,X,Y,w,w*.4,P,null,true,sd);
      // foam collar at the waterline, pushed up on the upstream (right) side, and a wake trailing downstream (left)
      g.strokeStyle=v3rgba('#ffffff',.55); g.lineWidth=Math.max(1.2,w*.06); g.setLineDash([w*.18,w*.1]); g.lineDashOffset=-t*w*.8; g.beginPath(); g.ellipse(X,Y+w*.04,w*1.08,w*.16,0,0,7); g.stroke(); g.setLineDash([]);
      g.fillStyle=v3rgba('#ffffff',.7); g.beginPath(); g.ellipse(X+w*.95,Y,w*.22,w*.1,0,0,7); g.fill();
      g.fillStyle=v3rgba('#ffffff',.45); for(let i=0;i<6;i++){ const k=((t*.9+i/6)%1), fx=X-w*1.1-k*w*2.6, fy=Y+w*.08+Math.sin(k*6+i)*w*.08; g.globalAlpha=1-k; g.beginPath(); g.ellipse(fx,fy,w*.1*(1-k*.5),w*.035,0,0,7); g.fill(); } g.globalAlpha=1;
      g.strokeStyle=v3rgba('#ffffff',.3); g.lineWidth=1; g.beginPath(); g.moveTo(X-w*1.05,Y+w*.12); g.quadraticCurveTo(X-w*2,Y+w*.3,X-w*3,Y+w*.2); g.moveTo(X-w*1.05,Y-w*.04); g.quadraticCurveTo(X-w*2,Y-w*.15,X-w*3,Y-w*.05); g.stroke(); }
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
