// =====================================================================
// Brine Shelf: its whole scene in one file (Clean Scenes 5, 2026-11-22): the scene itself, then every piece drawn on top, in the
// order they draw (each hook: land = the cached still scenery, sky, live = moving things, fore = the bottom edge). Shared layers
// (weather, the float's wake, wind gusts, depth haze and motes) are added here by name, at their place in that order. Its colours stay
// in V3PAL (f_v3scene.js / f2_areas.js) and shared drawing helpers stay in their files.
// =====================================================================
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
m33wrap('shelf','land',function(x,P,hz){ const ic=mix(mix(P.far,'#4a6a5a',.45),P.farHaze,.2), x0=W*.3;
  x.fillStyle=ic; M33.island(x,hz); x.fill();
  // the sea arch at the island's end: sky shows through it
  x.save(); x.globalCompositeOperation='destination-out'; x.beginPath(); x.ellipse(x0+W*.122,hz-H*.004,W*.006,H*.014,0,Math.PI,0); x.rect(x0+W*.116,hz-H*.004,W*.012,H*.006); x.fill(); x.restore();
  x.fillStyle=v3rgba(P.rim,.2+P.d*.2); x.beginPath(); x.moveTo(x0+W*.03,hz-H*.04); x.quadraticCurveTo(x0+W*.06,hz-H*.05,x0+W*.09,hz-H*.04); x.lineTo(x0+W*.088,hz-H*.037); x.quadraticCurveTo(x0+W*.06,hz-H*.045,x0+W*.032,hz-H*.037); x.fill();
  // a few trees on the ridge
  x.fillStyle=mix(ic,'#1a2a30',.25); for(const [tx,th] of [[.035,.016],[.045,.02],[.062,.018],[.078,.014]]){ const X=x0+W*tx, base=hz-H*.044+Math.abs(tx-.06)*H*.25; x.beginPath(); x.moveTo(X-H*.005,base); x.lineTo(X,base-H*th); x.lineTo(X+H*.005,base); x.closePath(); x.fill(); }
  m33reflect(x,hz,H*.05,.2,mix(ic,P.wMid,.5),()=>M33.island(x,hz));
});
wx3SkyLayer('shelf');
m33wrap('shelf','live',function(P,t,hz){ const night=P.night, FX=S.settings.effects;
  // the whale: every 38 s it rolls up, blows a spout, and shows its tail as it dives
  { const per=38, k=(t%per)/per, wx=W*.78, wy=hz+H*.14, s=H*.006; if(k<.3){ const e=k/.3, up=Math.sin(e*Math.PI), wc=mix('#3a4a5a',P.wMid,.25+night*.4);
      g.save(); g.beginPath(); g.rect(0,0,W,wy); g.clip(); g.fillStyle=wc; g.beginPath(); g.ellipse(wx+(e-.5)*s*14,wy+s*4*(1-up),s*9,s*4*up+.1,0,Math.PI,0); g.fill(); g.fillStyle=v3rgba(P.rim,.25); g.beginPath(); g.ellipse(wx+(e-.5)*s*14,wy-s*3.2*up+s*4*(1-up),s*5,s*.7*up,0,0,7); g.fill(); g.restore();
      if(FX&&e>.15&&e<.75){ const sp=Math.sin((e-.15)/.6*Math.PI); for(let i=0;i<9;i++){ const a=-Math.PI/2+(i-4)*.16, rr=s*(5+sp*7); g.fillStyle=v3rgba('#ffffff',.5*sp); g.beginPath(); g.arc(wx+(e-.5)*s*14-s*3+Math.cos(a)*rr*.6,wy-s*2+Math.sin(a)*rr*1.4,s*(.7+.4*sp),0,7); g.fill(); } }
      g.strokeStyle=v3rgba(mix(P.wTop,'#ffffff',.6),.5*up); g.lineWidth=1.2; g.beginPath(); g.ellipse(wx,wy+1,s*12,s*1.4,0,0,7); g.stroke(); }
    else if(k<.4){ const e=(k-.3)/.1, up=Math.sin(e*Math.PI), wc=mix('#3a4a5a',P.wMid,.25+night*.4); g.save(); g.beginPath(); g.rect(0,0,W,wy+1); g.clip(); g.translate(wx+s*10,wy); g.fillStyle=wc; g.beginPath(); g.moveTo(-s*.8,0); g.lineTo(-s*.4,-s*7*up); g.quadraticCurveTo(-s*4,-s*10*up,-s*5.4,-s*8.6*up); g.quadraticCurveTo(-s*1.6,-s*8*up,0,-s*7.4*up); g.quadraticCurveTo(s*1.6,-s*8*up,s*5.4,-s*8.6*up); g.quadraticCurveTo(s*4,-s*10*up,s*.4,-s*7*up); g.lineTo(s*.8,0); g.closePath(); g.fill(); g.restore();
      if(FX){ g.fillStyle=v3rgba('#ffffff',.5*(1-e)); for(let i=0;i<6;i++) g.fillRect(wx+s*10+(i-3)*s*1.4,wy-s*(2+((i*5)%4))*up,1.4,2); } } }
  // drifting kelp mats, one with a gull riding it
  for(const [i,x0,y0,gull] of [[0,.42,.2,true],[1,.66,.31,false]]){ const x=W*((((x0+t*.0025*(i?1:-1))%1.2)+1.2)%1.2-.1), /* wraps well off screen */ y=hz+H*y0+Math.sin(t*1.1+i)*H*.003, w=W*.03, kc=mix('#5a6a2a',P.wMid,.3+night*.4);
    g.fillStyle=kc; g.beginPath(); g.ellipse(x,y,w,H*.006,0,0,7); g.fill(); g.strokeStyle=mix(kc,'#000000',.2); g.lineWidth=1; for(let k=0;k<5;k++){ g.beginPath(); g.moveTo(x-w*.8+k*w*.4,y); g.quadraticCurveTo(x-w*.6+k*w*.4,y-H*.004,x-w*.5+k*w*.4,y+H*.002); g.stroke(); } m33dot(g,x-w*.3,y-H*.002,H*.0028,mix('#b8a040',P.wMid,.3+night*.4));
    if(gull&&night<.75){ const gc=mix('#f4f4f2',P.top,night*.8), s=H*.005, bob=Math.sin(t*1.1)*H*.003; g.fillStyle=gc; g.beginPath(); g.ellipse(x+w*.2,y-s*1.4+bob,s*2,s*1.1,0,0,7); g.fill(); m33dot(g,x+w*.2+s*1.8,y-s*2.4+bob,s*.8,gc); g.fillStyle=mix('#8a8a94',P.top,night*.6); g.beginPath(); g.ellipse(x+w*.2-s*.4,y-s*1.6+bob,s*1.3,s*.6,-.1,0,7); g.fill(); g.fillStyle='#e8a030'; g.beginPath(); g.moveTo(x+w*.2+s*2.5,y-s*2.5+bob); g.lineTo(x+w*.2+s*3.4,y-s*2.3+bob); g.lineTo(x+w*.2+s*2.5,y-s*2.1+bob); g.fill(); } }
});
wx3WaterLayer('shelf');
l3wakeLayer('shelf');
depthHazeLayer('shelf');
m33wrap('shelf','live',function(P,t,hz){ m34cargo(P,t,hz); m34chop(P,t,hz,1); });
m33wrap('shelf','fore',function(P,t){ // a big swell rolling along the bottom edge, its crest feathering into spray
  const b=H+2, base=H*.955, SK=1+seaStormK()*1.2, foam=mix(P.wTop,'#ffffff',.75);
  const sg=g.createLinearGradient(0,base-H*.04,0,b); sg.addColorStop(0,v3rgba(mix(P.wMid,P.wTop,.45),.7)); sg.addColorStop(1,v3rgba(P.wMid,.25)); g.fillStyle=sg; g.beginPath(); g.moveTo(-8,b); for(let X=-8;X<=W+8;X+=10){ const y=base-Math.sin(X/W*7+t*.8)*H*.012*SK-Math.max(0,Math.sin(X/W*3.1-t*.35))*H*.02*SK; g.lineTo(X,y); } g.lineTo(W+8,b); g.closePath(); g.fill();
  g.strokeStyle=v3rgba(foam,.55); g.lineWidth=Math.max(1.4,H*.003); g.beginPath(); for(let X=-8;X<=W+8;X+=10){ const y=base-Math.sin(X/W*7+t*.8)*H*.012*SK-Math.max(0,Math.sin(X/W*3.1-t*.35))*H*.02*SK; X===-8?g.moveTo(X,y):g.lineTo(X,y); } g.stroke();
  if(S.settings.effects){ g.fillStyle=v3rgba(foam,.5); for(let i=0;i<14;i++){ const X=W*(((i*.071+t*.01)%1)), y=base-Math.sin(X/W*7+t*.8)*H*.012*SK-Math.max(0,Math.sin(X/W*3.1-t*.35))*H*.02*SK, k=(t*1.3+i*.37)%1; g.fillRect(X,y-k*H*.02,1.6,1.6); } }
});
depthMotesLayer('shelf');
