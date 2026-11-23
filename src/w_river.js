// =====================================================================
// Stonebrook River: its whole scene in one file (Clean Scenes 5, 2026-11-22): the scene itself, then every piece drawn on top, in the
// order they draw (each hook: land = the cached still scenery, sky, live = moving things, fore = the bottom edge). Shared layers
// (weather, the float's wake, wind gusts, depth haze and motes) are added here by name, at their place in that order. Its colours stay
// in V3PAL (f_v3scene.js / f2_areas.js) and shared drawing helpers stay in their files.
// =====================================================================
V3SCENES.river = {
  land(x,P,hz,cnv){
    // distant rolling hills, layered with haze
    v3hillBand(x,hz+1,[[0,.1*H],[.18,.15*H],[.36,.11*H],[.55,.16*H],[.74,.12*H],[.92,.15*H],[1,.13*H]],mix(P.far,P.farHaze,.25));
    const hg=x.createLinearGradient(0,hz-.16*H,0,hz); hg.addColorStop(0,v3rgba(P.farHaze,0)); hg.addColorStop(1,v3rgba(P.farHaze,.45)); x.fillStyle=hg; x.fillRect(0,hz-.16*H,W,.16*H);
    riverVillage(x,P,hz);
    x.save(); v3hillBand(x,hz+1,[[0,.07*H],[.2,.05*H],[.4,.075*H],[.6,.045*H],[.8,.07*H],[1,.06*H]],P.hill); x.clip();
    /* map redo (director, 2026-11-22: "the hills don't look right", every water's hills alike): the near hills are farmland, a patchwork of
       fields in slightly different greens and wheat, split by dark hedgerows with little round shrubs along them */
    { const fr=v3rng(83), cols=[mix(P.hill,'#ffffff',.08),mix(P.hill,'#000000',.08),mix(P.hill,'#d8c08a',.35),mix(P.hill,P.leaf,.4)], hedge=mix(P.hill,'#14200e',.45);
      let X=-W*.02; while(X<W){ const w=W*(.05+fr()*.07), sl=W*(.01+fr()*.02); x.fillStyle=cols[Math.floor(fr()*4)]; x.beginPath(); x.moveTo(X,hz+2); x.lineTo(X+sl,hz-H*.09); x.lineTo(X+w+sl,hz-H*.09); x.lineTo(X+w,hz+2); x.closePath(); x.fill();
        x.strokeStyle=hedge; x.lineWidth=Math.max(1.2,H*.0025); x.beginPath(); x.moveTo(X,hz+2); x.lineTo(X+sl,hz-H*.09); x.stroke(); x.fillStyle=hedge; for(let k=0;k<4;k++){ const u=fr(); x.beginPath(); x.arc(X+sl*u,hz+2-(H*.092)*u,H*.0035,0,7); x.fill(); } X+=w; }
      x.strokeStyle=hedge; x.lineWidth=Math.max(1,H*.002); x.beginPath(); x.moveTo(0,hz-H*.022); x.bezierCurveTo(W*.3,hz-H*.03,W*.6,hz-H*.015,W,hz-H*.026); x.stroke(); }
    x.restore();
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
      x.save(); x.beginPath(); arches(x); x.clip();
      /* map redo (director, 2026-11-22: "the wrong background" and "a strange green" in the openings): no painted sky any more; the real hill
         and village behind show through, with the river running on upstream along the bottom of each opening */
      { const wy=hz-ar*.22, wg=x.createLinearGradient(0,wy,0,hz+1); wg.addColorStop(0,mix(P.wTop,P.farHaze,.45)); wg.addColorStop(1,P.wTop); x.fillStyle=wg; x.fillRect(x0,wy,x1-x0,hz-wy+2);
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
    /* a fly fisher wading mid-river in chest waders (overnight, 2026-11-23: Stonebrook's own expansion, its fly-fishing culture): he false-casts,
       the line rolling out in a loop behind and in front of him, and lays it on the water; his rings spread where he stands; at night he has
       gone home */
    if(night<.6){ const fx=W*.64, fy=hz+H*.07, s=H*.0048, N=c0=>mix(c0,P.wMid,night*.6), cyc=(t%7)/7, rodA=cyc<.5?-1.1+Math.sin(cyc*2*Math.PI)*.8:-.35, a=1-night/.6; g.save(); g.globalAlpha=a;
      g.strokeStyle=v3rgba(mix(P.wTop,'#ffffff',.6),.45); g.lineWidth=1; for(let k=0;k<2;k++){ const q=((t*.5+k*.5)%1); g.beginPath(); g.ellipse(fx,fy,s*(3+q*6),s*(.6+q*1.2),0,0,7); g.stroke(); }
      g.fillStyle=N('#4a5a3a'); g.beginPath(); g.ellipse(fx,fy-s*1.6,s*1.5,s*2.2,0,0,7); g.fill(); g.fillStyle=N('#6a4a32'); g.fillRect(fx-s*1.4,fy-s*3.6,s*2.8,s*.6); g.fillStyle=N('#c8987a'); g.beginPath(); g.arc(fx,fy-s*4.6,s*.8,0,7); g.fill(); g.fillStyle=N('#5a5040'); g.fillRect(fx-s*1.3,fy-s*5.4,s*2.6,s*.5); g.fillRect(fx-s*.7,fy-s*6,s*1.4,s*.7); /* waders, vest, face, a felt hat */
      const hx=fx+s*.8, hy=fy-s*3, tx=hx+Math.cos(rodA)*s*9, ty=hy+Math.sin(rodA)*s*9; g.strokeStyle=N('#3a2a1a'); g.lineWidth=Math.max(1,s*.25); g.beginPath(); g.moveTo(hx,hy); g.lineTo(tx,ty); g.stroke(); /* the fly rod */
      g.strokeStyle=v3rgba('#f4f0e0',.7); g.lineWidth=1; g.beginPath(); g.moveTo(tx,ty); if(cyc<.5){ const lx=tx+(cyc<.25?-1:1)*s*14*Math.sin(cyc*4*Math.PI), ly=ty-s*3; g.quadraticCurveTo((tx+lx)/2,ly-s*4,lx,ly); g.quadraticCurveTo(lx+s*2,ly+s*2,lx-s,ly+s*3); } else { g.quadraticCurveTo(tx+s*8,ty+s*3,tx+s*18,fy); } g.stroke(); g.restore(); } /* the loop of the false cast, then the line laid on the water */
    // the mill window glows after dusk
    const lit=clamp(night*1.2+d*.8,0,1), mx=W*.88, mb=hz-H*.005, mw=rvH()*.13, mh=rvH()*.08;
    if(lit>.05){ for(const wx of [mx+mw*.12,mx-mw*.3]){ v3glow(g,wx+mw*.07,mb-mh*.74,mh*.6,'rgba(255,200,110,.9)',lit*.45); g.fillStyle=v3rgba('#ffcf7a',.3+lit*.7); g.fillRect(wx,mb-mh*.85,mw*.14,mh*.22); } }
    // the waterwheel (reworked in round 6, see cc_river06.js)
    riverWheel(P,t,hz,mx,mb,mw,mh,FX);
    v3glitter(P,t,hz,sun);
    v3mist(P,t,hz,.12*(1-night)*(1-d)+.16*d+.08*night);
    // fast current lines flowing right to left at many depths
    g.strokeStyle=v3rgba(mix(P.wTop,'#ffffff',.55),.28); g.lineWidth=1;
    /* never across the jetty or the moored rowboat (director, 2026-11-22: "water running through them") */
    const jx=W*.79, jl=rvH()*.034; g.save(); g.beginPath(); g.rect(0,hz,W,H); g.rect(jx-W*.026/2-rvH()*.0038*22,hz-2,W*.026+rvH()*.0038*22+4,jl+rvH()*.03); g.clip('evenodd');
    for(let r0=0;r0<12;r0++){ const y=hz+H*.025+Math.pow(r0/12,1.4)*(H-hz)*.95, sp=W*(.06+r0*.012), len=W*(.02+r0*.006), spd=W*(.05+r0*.01);
      g.beginPath(); for(let X=W+sp-((t*spd+r0*71)%sp);X>-len;X-=sp){ const yy=y+Math.sin(X*.03+r0)*1.2; g.moveTo(X,yy); g.lineTo(X+len,yy+.4); } g.stroke(); }
    g.restore();
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
    { const hx=W*.955, hy=hz+H*.022 /* in the shallows at the reeds, close to the bank (director asked whether it made sense out in the river) */, s=H*.0016, dip=((t%11)>9.6)?Math.sin(((t%11)-9.6)/1.4*Math.PI):0, hc=mix('#8a94a4',P.front,night*.6);
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
wx3SkyLayer('river');
m33wrap('river','live',function(P,t,hz){ const night=P.night, FX=S.settings.effects;
  for(let i=0;i<2;i++){ const per=24, k=((t+i*2.5)%per)/per; if(k>.32) continue; const e=k/.32, up=Math.sin(e*Math.PI), x=W*(.25+i*.035)+e*W*.035, y=hz+H*(.17+i*.012) /* clear water between the dock and the first rock (they swam through it at .36-.44) */, s=H*.005, oc=mix('#5a3a24',P.wMid,.2+night*.5);
    g.save(); g.beginPath(); g.rect(0,0,W,y); g.clip(); g.fillStyle=oc; g.beginPath(); g.ellipse(x,y+s*2*(1-up),s*1.6,s*2.6*up+.1,.2,0,7); g.fill(); g.beginPath(); g.ellipse(x+s*.6,y-s*2.4*up+s*2*(1-up),s*1.5,s*1.2*up+.1,0,0,7); g.fill(); g.fillStyle=mix('#c8a880',P.wMid,.2+night*.5); g.beginPath(); g.ellipse(x+s*1.2,y-s*2*up+s*2*(1-up),s*.8,s*.6*up+.05,0,0,7); g.fill(); m33dot(g,x+s*1.1,y-s*2.9*up+s*2*(1-up),s*.28*up,'#14100c'); g.restore();
    if(FX){ g.strokeStyle=v3rgba(mix(P.wTop,'#ffffff',.6),.5*up); g.lineWidth=1; g.beginPath(); g.ellipse(x,y+1,s*(2.6+e*4),s*(.6+e*.8),0,0,7); g.stroke(); } }
});
m33wrap('river','live',function(P,t,hz){ const lc=['#d8a03a','#c8603a','#8aa84a'];
  for(let i=0,n=gfxHigh()?9:6;i<n;i++){ const lane=hz+H*(.2+(i%6)*.1+(i>5?.05:0)), sp=.012+i*.004, x=W*(1.15-(((i*.29+t*sp)%1.3)+1.3)%1.3) /* downstream is left (director, 2026-11-22) */, y=lane+Math.sin(t*.9+i*2)*H*.006, s=H*(.006+(i%3)*.0015), r=t*.4+i;
    g.save(); g.translate(x,y); g.rotate(r); g.fillStyle=mix(lc[i%3],P.wMid,.2+P.night*.5); g.beginPath(); g.moveTo(-s*1.4,0); g.quadraticCurveTo(0,-s,s*1.4,0); g.quadraticCurveTo(0,s,-s*1.4,0); g.fill(); g.strokeStyle=v3rgba('#000000',.2); g.lineWidth=.6; g.beginPath(); g.moveTo(-s*1.2,0); g.lineTo(s*1.2,0); g.stroke(); g.restore();
    g.strokeStyle=v3rgba(mix(P.wTop,'#ffffff',.5),.25); g.lineWidth=.8; g.beginPath(); g.ellipse(x,y+1,s*2.2,s*.5,0,0,7); g.stroke(); } });
wx3WaterLayer('river');
l3wakeLayer('river');
l3gustLayer('river');
m33wrap('river','live',function(P,t,hz){ if(!S.settings.effects) return; const foam=mix(P.wTop,'#ffffff',.7); g.strokeStyle=v3rgba(foam,.4); g.lineWidth=1;
  for(const [rx,ry] of [[.43,.21],[.6,.45],[.82,.43]]){ for(let k=0;k<3;k++){ const q=((t*.5+k/3)%1), x=W*rx-q*W*.06-W*.02, y=hz+H*ry-H*.004+Math.sin(q*6+k)*H*.004; g.globalAlpha=.6*(1-q); g.beginPath(); g.moveTo(x,y); g.lineTo(x+W*.02,y+H*.002); g.stroke(); } } g.globalAlpha=1; });
depthHazeLayer('river');
m33wrap('river','live',function(P,t,hz){ const night=P.night, d=P.d, lit=clamp(night*1.2+d*.7,0,1), hh=rvH()*.017, hw=rvH()*.024;
  if(lit>.05){ g.fillStyle=v3rgba('#ffcf7a',.25+lit*.7); for(const [fx,dy,big] of RV_HOUSES){ const bx=W*fx, by=rvBaseY(hz,dy), w=hw*(big?1.15:.9), h=hh*(big?1.05:.9), on=(Math.sin(fx*91)+1)/2<.75+lit*.25;
      if(!on) continue; g.fillRect(bx-w*.3,by-h*.62,w*.14,h*.26); if(big) g.fillRect(bx+w*.05,by-h*.62,w*.14,h*.26); }
    const cx=W*RV_CHURCH, by=rvBaseY(hz,RV_CHURCH_DY); v3glow(g,cx-hw*1.5*.18,by-hh*2.1*.72,hw*.9,'rgba(255,210,130,.9)',lit*.35); }
  // chimney smoke drifting downstream (left) by day and dusk
  if(S.settings.effects&&night<.7){ for(const [fx,dy,big] of RV_HOUSES){ if(!big) continue; const w=hw*1.15, h=hh*1.05, sx=W*fx+w*.31, sy=rvBaseY(hz,dy)-h-h*.95;
      for(let k=0;k<4;k++){ const q=((t*.12+k/4+fx*7)%1); g.fillStyle=v3rgba(mix('#e8e8ee',P.farHaze,.3),.28*(1-q)*(1-night)); g.beginPath(); g.arc(sx-q*rvH()*.03,sy-q*rvH()*.035,rvH()*(.003+q*.006),0,7); g.fill(); } } }
});
depthMotesLayer('river');
