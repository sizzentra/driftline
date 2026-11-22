// =====================================================================
// Midnight Deep: its whole scene in one file (Clean Scenes 5, 2026-11-22): the scene itself, then every piece drawn on top, in the
// order they draw (each hook: land = the cached still scenery, sky, live = moving things, fore = the bottom edge). Shared layers
// (weather, the float's wake, wind gusts, depth haze and motes) are added here by name, at their place in that order. Its colours stay
// in V3PAL (f_v3scene.js / f2_areas.js) and shared drawing helpers stay in their files.
// =====================================================================
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
    { const per=23, k=(t%per)/per; if(k<.22){ const e=k/.22, up=Math.sin(e*Math.PI), wx=W*.7, wy=hz+H*.16, s=H*.024, wc=mix('#26303a',P.wMid,.12+P.night*.3);
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
m33wrap('deep','land',function(x,P,hz){ const pc=mix(P.far,'#1a2028',.25); x.fillStyle=pc; M33.pillar(x,hz); x.fill(); x.fillStyle=v3rgba(P.rim,.15); x.fillRect(W*.335,hz-H*.05,W*.004,H*.045); m33reflect(x,hz,H*.04,.18,mix(pc,P.wMid,.5),()=>M33.pillar(x,hz)); });
wx3SkyLayer('deep');
m33wrap('deep','live',function(P,t,hz){ const FX=S.settings.effects, fl=this.flash?this.flash(t):0;
  // spray bursting up the pillar now and then
  if(FX){ const k=(t%5.5)/5.5; if(k<.35){ const e=k/.35; for(let i=0;i<10;i++){ const a=-Math.PI/2+(i-4.5)*.22; g.fillStyle=v3rgba('#e8f0f4',.55*(1-e)); g.beginPath(); g.arc(W*.347+Math.cos(a)*W*.02*e,hz-H*.01+Math.sin(a)*H*.06*e,H*.003*(1+e),0,7); g.fill(); } } }
  // a cargo ship far off, pitching on the swell, deck lights and a mast light
  { const sx=W*.68, sy=hz+H*.004, s=H*.004, p=Math.sin(t*.7)*.08, hc=mix('#2a2e36',P.far,.3);
    g.save(); g.translate(sx,sy); g.rotate(p); g.fillStyle=hc; g.beginPath(); g.moveTo(-s*14,-s*2); g.lineTo(s*15,-s*2); g.lineTo(s*12,s*1.6); g.lineTo(-s*12,s*1.6); g.closePath(); g.fill();
    g.fillRect(s*5,-s*7,s*7,s*5); g.fillRect(-s*10,-s*4.6,s*13,s*2.6); g.fillRect(s*8,-s*11,s*.8,s*4);
    g.fillStyle='rgba(255,220,140,.85)'; for(let i=0;i<4;i++) g.fillRect(s*5.8+i*s*1.6,-s*5.8,s*.8,s*.8); m33dot(g,s*8.4,-s*11.4,s*.6,(t%1.6)<.8?'rgba(255,80,60,.95)':'rgba(255,80,60,.25)');
    g.restore(); v3glow(g,sx+s*8,sy-s*5,H*.02,'rgba(255,210,140,.9)',.25); }
  // lightning you can see: a forked bolt from the cloud base while the sky flashes
  if(fl>.25){ const seed=Math.floor(t/23), r=v3rng(seed*7+3), bx=W*(.45+r()*.4); g.strokeStyle='rgba(240,245,255,'+Math.min(1,fl*1.2)+')'; g.lineWidth=Math.max(1.4,H*.003); g.beginPath(); let X=bx, Y=hz*.18; g.moveTo(X,Y); const pts=[]; for(let i=0;i<7;i++){ X+=(r()-.5)*W*.03; Y+=hz*.12; g.lineTo(X,Y); pts.push([X,Y]); } g.stroke();
    g.lineWidth=Math.max(.8,H*.0016); g.beginPath(); const [fx,fy]=pts[2]; g.moveTo(fx,fy); g.lineTo(fx+W*.02,fy+hz*.1); g.lineTo(fx+W*.028,fy+hz*.18); g.stroke(); v3glow(g,bx,hz*.5,hz*.5,'rgba(220,230,255,.9)',fl*.3); }
  // whitecaps: short foam streaks riding the crests, drifting with the wind
  if(FX){ g.fillStyle=v3rgba('#e8f0f4',.45); for(let i=0;i<26;i++){ const r=((i*97.3)%1000)/1000, y=hz+H*.03+Math.pow((i*.137)%1,1.4)*(H-hz)*.9, u=(y-hz)/(H-hz), x=((r*W+t*W*(.02+u*.03))%(W*1.1))-W*.05, l=W*(.01+u*.025), a=.5+.5*Math.sin(t*2+i); g.globalAlpha=a*.8; g.fillRect(x,y,l,Math.max(1,u*2.4)); } g.globalAlpha=1; }
});
wx3WaterLayer('deep');
l3wakeLayer('deep');
m33wrap('deep','live',function(P,t,hz){ if(!S.settings.effects) return; for(let i=0;i<8;i++){ const q=((t*.7+i*.13)%1); if(q>.3) continue; const x=W*l3hash(i+Math.floor(t*.7+i*.13)), y=hz+H*(.06+l3hash(i*3)*.5), e=q/.3; g.fillStyle='rgba(225,235,240,'+(.45*(1-e))+')'; for(let k=0;k<5;k++) g.fillRect(x+e*W*.03+k*3,y-Math.sin(e*Math.PI)*H*.012-k,1.4,1.4); } });
depthHazeLayer('deep');
m33wrap('deep','live',function(P,t,hz){ m34ghost(P,t,hz); m34chop(P,t,hz,1.5); });
m33wrap('deep','fore',function(P,t){ const b=H+2, base=H*.95, SK=1+seaStormK()*1.4, c=mix(P.wMid,P.wBot,.3);
  const dg=g.createLinearGradient(0,base-H*.04,0,b); dg.addColorStop(0,v3rgba(c,.75)); dg.addColorStop(1,v3rgba(c,.3)); g.fillStyle=dg; g.beginPath(); g.moveTo(-8,b); for(let X=-8;X<=W+8;X+=10) g.lineTo(X,base-Math.abs(Math.sin(X/W*5-t*(.9+SK*.15)))*H*.03*SK); g.lineTo(W+8,b); g.closePath(); g.fill();
  g.strokeStyle='rgba(232,240,244,.6)'; g.lineWidth=Math.max(1.4,H*.003); g.beginPath(); for(let X=-8;X<=W+8;X+=10){ const y=base-Math.abs(Math.sin(X/W*5-t*(.9+SK*.15)))*H*.03*SK; X===-8?g.moveTo(X,y):g.lineTo(X,y); } g.stroke();
});
depthMotesLayer('deep');
