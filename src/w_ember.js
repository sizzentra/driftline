// =====================================================================
// Ember Springs: its whole scene in one file (Clean Scenes 5, 2026-11-22): the scene itself, then every piece drawn on top, in the
// order they draw (each hook: land = the cached still scenery, sky, live = moving things, fore = the bottom edge). Shared layers
// (weather, the float's wake, wind gusts, depth haze and motes) are added here by name, at their place in that order. Its colours stay
// in V3PAL (f_v3scene.js / f2_areas.js) and shared drawing helpers stay in their files.
// =====================================================================
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
    // the moment, every 45 s: a geyser at the foot of the hill bubbles, erupts (a little higher or lower each time), then falls back as drifting steam
    { const per=45, q=t%per, n=Math.floor(t/per), hk=.75+v3rng(n*31+7)()*.5, gx=W*.29, gb=embHillY(hz,gx)+H*.004;
      if(q<12){ const up=q<2?0:q<4?(q-2)/2:q<9?1:Math.max(0,1-(q-9)/2), hh=H*.2*hk*up*(1+.06*Math.sin(t*9));
        if(q<2.5){ for(let i=0;i<4;i++){ const k=((t*3+i*.25)%1); g.fillStyle=v3rgba('#ffffff',.5*(1-k)); g.beginPath(); g.arc(gx+(i-1.5)*H*.006,gb-k*H*.012,H*.003,0,7); g.fill(); } }
        if(hh>1){ const cg=g.createLinearGradient(0,gb-hh,0,gb); cg.addColorStop(0,'rgba(255,255,255,0)'); cg.addColorStop(.25,v3rgba(mix('#ffffff',P.farHaze,.2),.75)); cg.addColorStop(1,v3rgba(mix('#e8f4f8',P.pool,.3),.9)); g.fillStyle=cg;
          g.beginPath(); g.moveTo(gx-H*.006,gb); g.quadraticCurveTo(gx-H*.004,gb-hh*.6,gx-H*.014,gb-hh); g.quadraticCurveTo(gx,gb-hh*1.08,gx+H*.014,gb-hh); g.quadraticCurveTo(gx+H*.004,gb-hh*.6,gx+H*.006,gb); g.closePath(); g.fill();
          if(FX) for(let i=0;i<10;i++){ const k=((t*.9+i*.1)%1), sd=i%2?1:-1, dx=sd*k*H*(.02+i%3*.008), dy=-hh*(1-k)+k*k*hh*.3; g.fillStyle=v3rgba('#ffffff',.6*(1-k)); g.fillRect(gx+dx,gb+dy,1.6,1.6); } }
        if(q>4&&FX){ for(let i=0;i<4;i++){ const k=Math.min(1,(q-4)/8), sx=gx+W*.02*k+i*H*.01, sy=gb-H*.2*hk*Math.min(1,up+.3)-i*H*.01; v3glow(g,sx,sy,H*(.02+k*.03),v3rgba(mix('#ffffff',P.farHaze,.3),.8),.25*(1-k)); } }
        g.strokeStyle=v3rgba(mix('#ffffff',P.farHaze,.3),.35*up); g.lineWidth=1; g.beginPath(); g.ellipse(gx,gb,H*.012+up*H*.006,H*.002,0,0,7); g.stroke(); } }
    // ravens riding the warm air over the valley by day: slow circles, wings held out
    if(night<.6){ for(let i=0;i<2;i++){ const a=t*.35+i*Math.PI, rx=W*(.46+i*.05)+Math.cos(a)*W*.05, ry=hz*(.42+i*.06)+Math.sin(a)*hz*.05*.4, s=H*.006, f=Math.sin(t*3+i)*.3; g.fillStyle=v3rgba('#141014',1-night); g.beginPath(); g.moveTo(rx-s*2.4,ry-s*f); g.quadraticCurveTo(rx-s*1,ry-s*.6,rx,ry); g.quadraticCurveTo(rx+s*1,ry-s*.6,rx+s*2.4,ry-s*f); g.quadraticCurveTo(rx+s,ry+s*.2,rx,ry+s*.4); g.quadraticCurveTo(rx-s,ry+s*.2,rx-s*2.4,ry-s*f); g.fill(); } }
  },
  fore(P,t){ // glowing moths flutter at the bottom right
    g.save(); g.globalCompositeOperation='lighter'; for(let i=0;i<4;i++){ const mx=W*(.82+i*.04)+Math.sin(t*1.3+i*2)*W*.02, my=H*(.82-i*.04)+Math.sin(t*2.1+i)*H*.02, fl=Math.abs(Math.sin(t*14+i)), s=H*.005;
      v3glow(g,mx,my,s*5,'rgba(255,200,120,.8)',.3+.2*P.night); g.fillStyle=v3rgba('#ffe0a0',.8); g.beginPath(); g.ellipse(mx-s*fl,my,s*1.2*fl+.4,s*.8,0,0,7); g.ellipse(mx+s*fl,my,s*1.2*fl+.4,s*.8,0,0,7); g.fill(); } g.restore();
  }
};
V3SCENES.ember.noClouds=true; /* no flat clouds: feathered ash plumes instead (sky hook below) */
m33wrap('ember','land',function(x,P,hz){ for(let i=0;i<M33.islets.length;i++){ const [ix,iy,iw,ih]=M33.islets[i], X=W*ix, Y=hz+H*iy, w=W*iw, h=H*ih;
    x.fillStyle=mix(P.rockD,P.wMid,.15); M33.islet(x,hz,i); x.fill(); x.fillStyle=v3rgba(P.rim,.2); x.beginPath(); x.moveTo(X-w*.3,Y-h); x.lineTo(X+w*.1,Y-h*.8); x.lineTo(X+w*.5,Y-h*1.05); x.lineTo(X+w*.45,Y-h*.9); x.lineTo(X+w*.1,Y-h*.68); x.lineTo(X-w*.3,Y-h*.86); x.closePath(); x.fill();
    x.save(); x.beginPath(); x.rect(0,Y,W,h*1.4); x.clip(); x.translate(0,Y*2); x.scale(1,-1); x.globalAlpha=.25; x.fillStyle=mix(P.rockD,P.wMid,.4); M33.islet(x,hz,i); x.fill(); x.restore(); } });
m33wrap('ember','land',function(x,P,hz){ const vx=W*.62, vb=hz+1, vw=W*.26, vh=H*.22, cw=vw*.16, ty=vb-vh, r=v3rng(91);
  x.save(); embCone(x,hz); x.clip();
  // ash and lava strata following the slope
  for(let k=1;k<6;k++){ const y=ty+vh*k*.17; x.strokeStyle=v3rgba(k%2?P.rockD:mix(P.rock,'#8a6a5a',.3),.35); x.lineWidth=Math.max(1,H*.003); x.beginPath(); x.moveTo(vx-vw,y+vh*.1); x.quadraticCurveTo(vx,y-vh*.05,vx+vw,y+vh*.12); x.stroke(); }
  // crags: small faceted rocks, lit on the left (sun) and dark on the right
  for(let i=0;i<0;i++){ const u=r(), v=r(), y=ty+vh*(.08+v*.9), half=cw+(vw-cw)*((y-ty)/vh)*.95, X=vx+(u*2-1)*half, s=H*(.003+r()*.006), lit=X<vx; x.fillStyle=v3rgba(lit?mix(P.rock,P.rim,.35):P.rockD,.7); x.beginPath(); x.moveTo(X-s,y); x.lineTo(X-s*.3,y-s*1.2); x.lineTo(X+s*.8,y-s*.5); x.lineTo(X+s,y); x.closePath(); x.fill(); }
  // gullies of loose scree
  x.strokeStyle=v3rgba(mix(P.rockD,'#000000',.2),.5); x.lineWidth=1; for(let k=0;k<12;k++){ const a=-.9+k*.16+(r()-.5)*.05; x.beginPath(); x.moveTo(vx+a*cw,ty+vh*.05); x.bezierCurveTo(vx+a*vw*.25,vb-vh*.6,vx+a*vw*.6+(r()-.5)*W*.01,vb-vh*.3,vx+a*vw*.95,vb); x.stroke(); }
  x.restore();
  // a parasitic cone on the left flank
  { const px=vx-vw*.55, pb=vb, pw=W*.04, ph=H*.045; x.fillStyle=mix(P.rock,P.rockD,.3); x.beginPath(); x.moveTo(px-pw,pb); x.quadraticCurveTo(px-pw*.3,pb-ph*.7,px-pw*.18,pb-ph); x.lineTo(px+pw*.18,pb-ph); x.quadraticCurveTo(px+pw*.3,pb-ph*.7,px+pw,pb); x.closePath(); x.fill(); x.fillStyle=v3rgba(P.rim,.15); x.beginPath(); x.moveTo(px-pw,pb); x.quadraticCurveTo(px-pw*.3,pb-ph*.7,px-pw*.18,pb-ph); x.lineTo(px,pb-ph); x.lineTo(px-pw*.2,pb); x.closePath(); x.fill(); x.fillStyle=mix(P.lava2||'#ffd06a',P.rockD,.4); x.beginPath(); x.ellipse(px,pb-ph,pw*.17,ph*.06,0,0,7); x.fill(); }
  // a cooled lava field spreading from the volcano's right foot into the lake: dark crusted lobes with seams
  { const fx=vx+vw*.35; x.fillStyle=mix(P.rockD,'#000000',.25); x.beginPath(); x.moveTo(fx-W*.06,vb); for(let i=0;i<=10;i++){ const X=fx-W*.06+i*W*.016, Y=vb+H*(.004+Math.abs(Math.sin(i*1.7))*.01); x.lineTo(X,Y); } x.lineTo(fx+W*.1,vb); x.closePath(); x.fill();
    x.strokeStyle=v3rgba(P.lava||'#ff7a2a',.55); x.lineWidth=1; for(let i=0;i<6;i++){ const X=fx-W*.045+i*W*.025; x.beginPath(); x.moveTo(X,vb); x.lineTo(X+W*.006,vb+H*.006); x.lineTo(X+W*.002,vb+H*.011); x.stroke(); } }
  // the far hills: rock outcrops and scraggly scrub along the ridge, a few dead trees
  for(let i=0;i<26;i++){ const X=W*(r()*.32), base=hz-H*(.02+.06*Math.max(0,1-Math.abs(X/W-.12)/.2))*(.7+r()*.3); x.fillStyle=v3rgba(mix(P.rockD,'#1a1410',.3),.6); x.beginPath(); x.arc(X,base,H*(.002+r()*.004),Math.PI,0); x.fill(); }
  for(const [tx,th] of [[.86,.05],[.91,.06],[.97,.045]]){ const X=W*tx, base=hz-H*(.06+.02*Math.sin(tx*30)); x.strokeStyle=mix('#2a1e1a',P.farHaze,.15); x.lineWidth=Math.max(1,H*.002); x.beginPath(); x.moveTo(X,base); x.lineTo(X,base-H*th); x.moveTo(X,base-H*th*.6); x.lineTo(X-H*th*.25,base-H*th*.85); x.moveTo(X,base-H*th*.45); x.lineTo(X+H*th*.22,base-H*th*.7); x.stroke(); }
});
m33wrap('ember','land',function(x,P,hz){ const hill=()=>{ x.beginPath(); x.moveTo(-2,hz+1); x.lineTo(-2,hz-H*.135); x.bezierCurveTo(W*.06,hz-H*.15,W*.14,hz-H*.12,W*.22,hz-H*.06); x.bezierCurveTo(W*.28,hz-H*.03,W*.33,hz-H*.008,W*.37,hz+1); x.closePath(); };
  const ground=mix(mix(P.terr,'#6a5a3a',.4),P.farHaze,.12), cream=mix(mix('#efe4d2',P.terr,.25),P.rockD,P.night*.6), creamD=mix(cream,'#8a7a64',.35), pool=mix(P.pool,P.wMid,.15+P.night*.35);
  const hg=x.createLinearGradient(0,hz-H*.15,0,hz); hg.addColorStop(0,mix(ground,P.rim,.12)); hg.addColorStop(1,mix(ground,'#000000',.25)); x.fillStyle=hg; hill(); x.fill();
  x.save(); hill(); x.clip();
  // modelled ground: the sun side of each fold lit, the far side in shade, so the hill has real shape
  { const lg=x.createLinearGradient(-2,0,W*.37,0); lg.addColorStop(0,v3rgba(P.rim,.18)); lg.addColorStop(.5,v3rgba(P.rim,0)); lg.addColorStop(1,v3rgba('#000000',.18)); x.fillStyle=lg; x.fillRect(-2,hz-H*.16,W*.4,H*.17);
    for(let k=0;k<4;k++){ const cx=W*(.04+k*.08), top=embHillY(hz,cx); const fg=x.createLinearGradient(cx-W*.03,0,cx+W*.03,0); fg.addColorStop(0,v3rgba(P.rim,.1)); fg.addColorStop(.5,v3rgba(P.rim,0)); fg.addColorStop(1,v3rgba('#000000',.14)); x.fillStyle=fg; x.beginPath(); x.moveTo(cx-W*.03,top+H*.01); x.quadraticCurveTo(cx,top+H*.002,cx+W*.035,top+H*.012); x.lineTo(cx+W*.02,hz); x.lineTo(cx-W*.04,hz); x.closePath(); x.fill(); }
    // rock outcrops with a lit top edge and a shadow below
    const rr=v3rng(53); for(let i=0;i<10;i++){ const X=W*(.02+rr()*.3), y=embHillY(hz,X)+H*(.01+rr()*.05), s=H*(.004+rr()*.005); x.fillStyle=v3rgba('#000000',.22); x.beginPath(); x.ellipse(X+s*.4,y+s*.5,s*1.5,s*.5,0,0,7); x.fill(); x.fillStyle=mix(P.rock,P.terr,.3); x.beginPath(); x.ellipse(X,y,s*1.3,s*.8,0,Math.PI,0); x.fill(); x.fillStyle=v3rgba(P.rim,.3); x.beginPath(); x.ellipse(X-s*.3,y-s*.5,s*.6,s*.2,0,0,7); x.fill(); } }
  x.restore();
  // a thin rim of light along the ridge line
  x.strokeStyle=v3rgba(P.rim,.35); x.lineWidth=Math.max(1,H*.002); x.beginPath(); x.moveTo(-2,hz-H*.135); x.bezierCurveTo(W*.06,hz-H*.15,W*.14,hz-H*.12,W*.22,hz-H*.06); x.stroke();
  const sc=mix('#5a4636',P.farHaze,.15+P.night*.5); /* 0.3.6: dry, scorched scrub */ x.fillStyle=sc; for(let i=0;i<20;i++){ const X=W*(.005+i*.011), y=embHillY(hz,X); x.beginPath(); x.arc(X,y,H*(.003+((i*7)%3)*.0015),Math.PI,0); x.fill(); }
  for(const tx of [.05,.13]){ const X=W*tx, y=embHillY(hz,X); x.strokeStyle=mix('#3a2a20',P.farHaze,.2); x.lineWidth=Math.max(1.2,H*.0025); x.beginPath(); x.moveTo(X,y); x.quadraticCurveTo(X+H*.008,y-H*.02,X+H*.004,y-H*.035); x.stroke(); x.beginPath(); x.moveTo(X+H*.006,y-H*.024); x.lineTo(X-H*.008,y-H*.034); x.moveTo(X+H*.005,y-H*.03); x.lineTo(X+H*.016,y-H*.042); x.moveTo(X+H*.004,y-H*.035); x.lineTo(X+H*.002,y-H*.046); x.stroke(); } }); /* 0.3.6: bare, burnt trees: nothing grows green beside a volcano */
m33wrap('ember','land',function(x,P,hz){ const x0=W*.79, rock=mix(P.rock,'#2a2422',.2), lit=mix(P.rock,P.rim,.25), dark=mix(P.rockD,'#000000',.25);
  // a smooth rounded headland: one soft silhouette, columns only as gentle vertical shading on its face
  const head=()=>{ x.beginPath(); x.moveTo(x0-W*.03,hz+1); x.bezierCurveTo(x0-W*.01,hz-H*.03,x0+W*.02,hz-H*.09,x0+W*.07,hz-H*.11); x.bezierCurveTo(x0+W*.12,hz-H*.125,x0+W*.18,hz-H*.12,W+4,hz-H*.115); x.lineTo(W+4,hz+1); x.closePath(); };
  const hg=x.createLinearGradient(x0,0,W,0); hg.addColorStop(0,lit); hg.addColorStop(.35,rock); hg.addColorStop(1,dark); x.fillStyle=hg; head(); x.fill();
  x.save(); head(); x.clip();
  const vg=x.createLinearGradient(0,hz-H*.13,0,hz); vg.addColorStop(0,'rgba(0,0,0,0)'); vg.addColorStop(1,v3rgba(dark,.45)); x.fillStyle=vg; x.fillRect(x0-W*.03,hz-H*.13,W*.25,H*.13);
  x.restore();
  // a soft cap of grass and scrub over the top, and a skirt of rounded boulders at the foot
  // grass along the exact top edge of the headland, with tufts poking up and a lit fringe
  const gc=mix('#3e3430',P.farHaze,.15+P.night*.5); /* 0.3.6: scorched, ashy grass (no green at a volcano) */ x.save(); head(); x.clip(); x.strokeStyle=gc; x.lineWidth=H*.012; x.lineJoin='round'; x.beginPath(); x.moveTo(x0-W*.01,hz-H*.03); x.bezierCurveTo(x0-W*.01+W*.0,hz-H*.03,x0+W*.02,hz-H*.09,x0+W*.07,hz-H*.11); x.bezierCurveTo(x0+W*.12,hz-H*.125,x0+W*.18,hz-H*.12,W+4,hz-H*.115); x.stroke(); x.restore();
  for(let i=0;i<26;i++){ const X=x0+W*.03+i*W*.0065; const yt=X<x0+W*.07?hz-H*(.03+.08*((X-x0)/(W*.07))):hz-H*(.11+.012*Math.sin(Math.min(1,(X-x0-W*.07)/(W*.14))*Math.PI*.6)); x.strokeStyle=gc; x.lineWidth=1; x.beginPath(); x.moveTo(X,yt+1); x.lineTo(X+(i%3-1)*1.2,yt-H*(.006+(i%4)*.002)); x.stroke(); }
  const r=v3rng(29); for(let i=0;i<12;i++){ const X=x0-W*.02+r()*W*.2, s=H*(.004+r()*.006); x.fillStyle=r()<.5?rock:mix(rock,dark,.5); x.beginPath(); x.ellipse(X,hz-s*.3,s*1.3,s*.8,0,Math.PI,0); x.fill(); }
  const hz2=x.createLinearGradient(0,hz-H*.03,0,hz); hz2.addColorStop(0,v3rgba(P.farHaze,0)); hz2.addColorStop(1,v3rgba(P.farHaze,.3)); x.fillStyle=hz2; x.fillRect(x0-W*.03,hz-H*.03,W*.25,H*.03); });
wx3SkyLayer('ember');
m33wrap('ember','sky',function(P,t,hz){ const vx=W*.62, ty=hz+1-H*.22, night=P.night;
  // ash plumes: long soft streams leaving the crater and drifting downwind, built from overlapping feathered puffs
  for(let s=0;s<3;s++){ for(let i=0;i<14;i++){ const k=((t*.012+i/14+s*.31)%1), x=vx+k*W*(.55+s*.12)-W*.02, y=ty-H*(.05+s*.04)-Math.sqrt(k)*H*(.12+s*.05)+Math.sin(k*5+s+t*.1)*H*.015, r=H*(.025+k*.07)*(1-s*.15), a=(.3-s*.06)*Math.sin(k*Math.PI)*(1-night*.3);
      const gr=g.createRadialGradient(x,y,0,x,y,r); const col=mix(mix('#6a5a58',P.cloud||'#8a7a78',.4),P.lava||'#ff7a2a',night*.12); gr.addColorStop(0,v3rgba(col,a)); gr.addColorStop(1,v3rgba(col,0)); g.fillStyle=gr; g.fillRect(x-r,y-r,r*2,r*2); } } });
m33wrap('ember','live',function(P,t,hz){ const FX=S.settings.effects, lava=P.lava||'#ff7a2a';
  for(let i=0;i<M33.islets.length;i++){ const [ix,iy,iw,ih]=M33.islets[i], X=W*ix, Y=hz+H*iy, w=W*iw, h=H*ih, p=.55+.45*Math.sin(t*1.2+i*2);
    g.strokeStyle=v3rgba(lava,.5+.4*p); g.lineWidth=Math.max(1,H*.0024); g.beginPath(); g.moveTo(X-w*.5,Y-h*.4); g.lineTo(X-w*.2,Y-h*.6); g.lineTo(X+w*.05,Y-h*.45); g.lineTo(X+w*.3,Y-h*.7); g.moveTo(X-w*.2,Y-h*.6); g.lineTo(X-w*.25,Y-h*.2); g.stroke();
    v3glow(g,X,Y-h*.5,w*.9,'rgba(255,130,50,.85)',.18*p);
    if(FX){ for(let k=0;k<5;k++){ const q=((t*.18+k/5+i*.3)%1), sx=X-w*.1+Math.sin(q*5+k)*w*.2+q*w*.3, sy=Y-h-q*H*.07, rr=H*(.004+q*.012); g.fillStyle=v3rgba(mix('#f0e8e0',P.farHaze,.3),.32*(1-q)); g.beginPath(); g.arc(sx,sy,rr,0,7); g.fill(); }
      const k=(t*.5+i*.31)%1; g.strokeStyle=v3rgba(mix(P.wTop,'#ffffff',.4),.4*(1-k)); g.lineWidth=1; g.beginPath(); g.ellipse(X,Y+1,w*(1+k*.5),H*(.004+k*.004),0,0,7); g.stroke(); } }
  // a bubbling vent out in open water
  if(FX){ const vx=W*.5, vy=hz+H*.22; for(let k=0;k<4;k++){ const q=((t*.8+k/4)%1); g.fillStyle=v3rgba(mix(P.wTop,'#ffffff',.5),.5*(1-q)); g.beginPath(); g.arc(vx+Math.sin(k*2.3)*W*.008,vy-q*H*.006,H*(.002+q*.003),0,7); g.fill(); } const k=(t*.4)%1; g.strokeStyle=v3rgba(lava,.3*(1-k)); g.beginPath(); g.ellipse(vx,vy,W*.012*(1+k*2),H*.003*(1+k*2),0,0,7); g.stroke(); }
});
wx3WaterLayer('ember');
l3wakeLayer('ember');
l3gustLayer('ember');
m33wrap('ember','live',function(P,t,hz){ const FX=S.settings.effects, lava=P.lava||'#ff7a2a';
  if(FX){ g.fillStyle='rgba(60,50,48,.45)'; for(let i=0,n=gfxHigh()?24:14;i<n;i++){ const x=W*((l3hash(i)+t*.004*(1+i%3))%1), y=(l3hash(i+7)*hz*1.2+t*H*.006*(1+i%2))%(H*.9); g.fillRect(x+Math.sin(t+i)*4,y,1.4,1.4); } }
  { const p=.5+.5*Math.sin(t*.6); g.fillStyle=v3rgba(lava,.05+.04*p); g.fillRect(0,hz,W,H*.25); }
});
m33wrap('ember','live',function(P,t,hz){ const vx=W*.62, vb=hz+1, vw=W*.26, vh=H*.22, cw=vw*.16, ty=vb-vh, lava=P.lava||'#ff7a2a', lava2=P.lava2||'#ffd06a';
  // pulses of fresh lava running down each vein (same paths as the land's veins)
  g.save(); g.globalCompositeOperation='lighter'; for(const [a,len,sd] of [[-.35,.75,1],[.1,.55,2],[.42,.85,3]]){ const r=v3rng(sd); let X=vx+a*cw, Y=ty+vh*.02; const pts=[[X,Y]]; for(let k=0;k<8;k++){ Y+=vh*len/8; X+=a*vw*.07+(r()-.5)*vw*.04; pts.push([X,Y]); }
    for(let p=0;p<2;p++){ const q=((t*.08+sd*.31+p*.5)%1), f=q*8, i=Math.min(7,Math.floor(f)), u=f-i, px=pts[i][0]+(pts[i+1][0]-pts[i][0])*u, py=pts[i][1]+(pts[i+1][1]-pts[i][1])*u; v3glow(g,px,py,H*.018,v3rgba(lava2,.9),.5*Math.sin(q*Math.PI)); } }
  g.restore();
  // the lava field's seams and the parasitic cone breathe
  const p=.5+.5*Math.sin(t*1.1); v3glow(g,vx+vw*.35,vb+H*.006,W*.06,v3rgba(lava,.8),.12+.08*p);
  if(S.settings.effects){ const px=vx-vw*.55, pyy=vb-H*.045; for(let k=0;k<4;k++){ const q=((t*.12+k/4)%1); g.fillStyle=v3rgba('#e8e0d8',.22*(1-q)); g.beginPath(); g.arc(px+q*W*.012,pyy-q*H*.05,H*(.004+q*.01),0,7); g.fill(); } }
});
depthHazeLayer('ember');
m33wrap('ember','live',function(P,t,hz){ const FX=S.settings.effects, night=P.night||0, lava=P.lava||'#ff7a2a', lava2=P.lava2||'#ffd06a', V=m34veins(hz), vx=W*.62, ty=hz+1-H*.22, hi=gfxHigh&&gfxHigh();
  g.save(); g.globalCompositeOperation='lighter'; g.lineCap='round'; g.lineJoin='round';
  V.forEach((pts,vi)=>{ const path=()=>{ g.beginPath(); g.moveTo(pts[0][0],pts[0][1]); for(const p of pts) g.lineTo(p[0],p[1]); };
    // a soft heat glow along the whole vein that swells and settles
    g.strokeStyle=v3rgba(lava,.12+.07*Math.sin(t*1.3+vi*2)+night*.08); g.lineWidth=Math.max(5,H*.012); path(); g.stroke();
    // bright streams sliding downhill
    const d=Math.max(3,H*.008); g.setLineDash([d*1.2,d*2.4]); g.lineDashOffset=-t*H*.02*(1+vi*.15); g.strokeStyle=v3rgba(lava2,.55+.25*night); g.lineWidth=Math.max(1.2,H*.0026); path(); g.stroke();
    if(hi){ g.setLineDash([d*.5,d*4.1]); g.lineDashOffset=-t*H*.031-vi*7; g.strokeStyle='rgba(255,250,210,.6)'; g.lineWidth=Math.max(.8,H*.0014); path(); g.stroke(); }
    g.setLineDash([]); });
  // the crater simmers, and every few seconds lobs a glowing bomb or two that arcs down the slope
  v3glow(g,vx,ty+H*.006,W*.05,v3rgba(lava2,.9),.18+.1*Math.sin(t*2.3)+night*.15);
  if(FX){ const per=6.5, cyc=Math.floor(t/per), k=(t%per)/per, r=m34rng(cyc*11+5), nb=1+Math.floor(r()*2.5); for(let b=0;b<nb;b++){ const st=r()*.15, q=(k-st)/.4; if(q<0||q>1) continue; const dir=r()<.5?-1:1, vxb=W*(.012+r()*.03)*dir, up=H*(.05+r()*.05);
      const bx=vx+r()*W*.01*dir+vxb*q, by=ty-up*Math.sin(q*Math.PI*.9)+q*q*H*.05; for(let tr=4;tr>=0;tr--){ const qq=Math.max(0,q-tr*.025), tx=vx+vxb*qq, tyy=ty-up*Math.sin(qq*Math.PI*.9)+qq*qq*H*.05; g.fillStyle=v3rgba(tr?lava:lava2,(1-tr/5)*.8*(1-q*.5)); g.beginPath(); g.arc(tx,tyy,Math.max(.8,H*.003*(1-tr*.15)),0,7); g.fill(); }
      v3glow(g,bx,by,H*.015,v3rgba(lava2,.9),.5*(1-q)); } }
  g.restore();
  // each vein ends in a glowing, slowly advancing lava front
  V.forEach((pts,vi)=>{ const e=pts[8]; v3glow(g,e[0],e[1],H*.02,v3rgba(lava2,.9),.25+.12*Math.sin(t*1.9+vi)+night*.15); }); });
m33wrap('ember','fore',function(P,t){ const b=H, c=mix(P.rock,P.wBot,.2);
  for(let i=0;i<5;i++){ const q=((i*.13+t*.004)%1), x=W*(.4+q*.4), fade=Math.min(1,q/.12,(1-q)/.12); if(fade<=0) continue; g.globalAlpha=fade; /* stones drift in and out softly */ const y=b-H*(.02+((i*7)%3)*.008)+Math.sin(t*1.2+i)*H*.003, r=H*(.008+((i*5)%3)*.003); g.fillStyle=c; g.beginPath(); g.ellipse(x,y,r*1.4,r,0,0,7); g.fill(); g.fillStyle=v3rgba(P.rim,.22); g.beginPath(); g.ellipse(x-r*.3,y-r*.4,r*.6,r*.3,0,0,7); g.fill(); m33dot(g,x+r*.4,y,r*.15,'rgba(0,0,0,.3)'); g.globalAlpha=1; }
});
depthMotesLayer('ember');
