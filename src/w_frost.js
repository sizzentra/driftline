// =====================================================================
// Frostbite Lake: its whole scene in one file (Clean Scenes 5, 2026-11-22): the scene itself, then every piece drawn on top, in the
// order they draw (each hook: land = the cached still scenery, sky, live = moving things, fore = the bottom edge). Shared layers
// (weather, the float's wake, wind gusts, depth haze and motes) are added here by name, at their place in that order. Its colours stay
// in V3PAL (f_v3scene.js / f2_areas.js) and shared drawing helpers stay in their files.
// =====================================================================
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
m33wrap('frost','land',function(x,P,hz){ const ib=hz+H*.018;
  for(const [tx,col] of [[.36,'#d8703a'],[.42,'#4f8a6a']]){ const X=W*tx, w=H*.034, h=H*.028; x.fillStyle=mix(col,P.farHaze,.15+P.night*.5); x.beginPath(); x.moveTo(X-w,ib); x.lineTo(X,ib-h); x.lineTo(X+w,ib); x.closePath(); x.fill();
    x.fillStyle='rgba(0,0,0,.22)'; x.beginPath(); x.moveTo(X,ib-h); x.lineTo(X+w,ib); x.lineTo(X+w*.1,ib); x.closePath(); x.fill(); x.fillStyle=mix('#1a1a2a',P.farHaze,.3); x.beginPath(); x.moveTo(X-w*.18,ib); x.lineTo(X,ib-h*.45); x.lineTo(X+w*.18,ib); x.closePath(); x.fill();
    x.fillStyle=P.snow; x.beginPath(); x.ellipse(X,ib,w*1.2,H*.003,0,Math.PI,0); x.fill(); }
  { const X=W*.475, b=ib, r=H*.008; x.fillStyle=P.snow; m33dot(x,X,b-r,r*1.1,P.snow); m33dot(x,X,b-r*2.6,r*.8,P.snow); m33dot(x,X,b-r*3.8,r*.6,P.snow); x.fillStyle=mix('#e8703a',P.farHaze,.2); x.fillRect(X+r*.4,b-r*3.9,r*.7,r*.25); x.strokeStyle=mix('#5a3a2a',P.farHaze,.3); x.lineWidth=1; x.beginPath(); x.moveTo(X-r*.7,b-r*2.6); x.lineTo(X-r*1.8,b-r*3.3); x.stroke(); x.fillStyle=mix('#c8343a',P.farHaze,.2); x.fillRect(X-r*.8,b-r*3.3,r*1.6,r*.35); }
});
wx3SkyLayer('frost');
m33wrap('frost','live',function(P,t,hz){ const ib=hz+H*.018, FX=S.settings.effects;
  // tip-up flags: one pops up now and then (a fish!) and goes down again
  for(let i=0;i<3;i++){ const X=W*(.31+i*.07), q=((t+i*7)%17), raw=q<.3?q/.3:q<2.2?1:q<2.5?1-(q-2.2)/.3:0, u=raw*raw*(3-2*raw), up=u>.5, h=H*.018; /* the flag swings up and back down smoothly */ g.strokeStyle=mix('#5a4a3a',P.farHaze,.3); g.lineWidth=1; g.beginPath(); g.moveTo(X,ib); g.lineTo(X+h*.8*(1-u),ib-h*(.3+.7*u)); g.stroke();
    g.fillStyle=mix('#ff5a3a',P.farHaze,P.night*.5); { const tx=X+h*.8*(1-u), ty=ib-h*(.3+.7*u); g.beginPath(); g.moveTo(tx,ty); g.lineTo(tx+h*.5,ty+h*.15); g.lineTo(tx,ty+h*.3); g.closePath(); g.fill(); } m33dot(g,X,ib,1.2,mix('#1a2a3a',P.farHaze,.3)); }
  if(FX){ const X=W*.42+H*.01; for(let i=0;i<5;i++){ const k=((t*.15+i/5)%1); g.fillStyle=v3rgba(mix('#e8e8f0',P.farHaze,.3),.35*(1-k)); g.beginPath(); g.arc(X+k*W*.02,ib-H*.03-k*H*.06,H*(.003+k*.008),0,7); g.fill(); } }
  const lit=clamp(P.night*1.3+P.d*.8,0,1); if(lit>.1){ v3glow(g,W*.36,ib-H*.01,H*.03,'rgba(255,190,110,.9)',.4*lit); v3glow(g,W*.42,ib-H*.01,H*.025,'rgba(255,190,110,.9)',.3*lit); }
});
wx3WaterLayer('frost');
l3wakeLayer('frost');
l3gustLayer('frost');
m33wrap('frost','live',function(P,t,hz){ const FX=S.settings.effects, night=P.night;
  if(FX){ g.fillStyle=v3rgba(mix(P.snow,'#ffffff',.3),.4); for(let i=0,n=gfxHigh()?40:24;i<n;i++){ const x=W*((l3hash(i)+t*.05*(1+i%4*.3))%1.1)-W*.05, y=hz+H*(.01+l3hash(i+3)*.025)+Math.sin(t*3+i)*1.2; g.fillRect(x,y,3+i%3,1); } }
  { const per=30, q=(t%per)/per; if(q<.3){ const e=q/.3, up=l3s(Math.min(1,e/.2))*l3s(Math.min(1,(1-e)/.2)), x=W*.55, y=hz+H*.2, s=H*.008, sc=mix('#5a6a78',P.wBot,night*.5);
      g.save(); g.beginPath(); g.rect(0,0,W,y); g.clip(); g.fillStyle=sc; g.beginPath(); g.ellipse(x,y+s*2*(1-up),s*1.4,s*2*up+.1,0,0,7); g.fill(); g.fillStyle='#10141a'; g.beginPath(); g.arc(x+s*.6,y-s*1.1*up+s*2*(1-up),s*.25*up,0,7); g.fill(); g.restore();
      g.strokeStyle=v3rgba('#ffffff',.4*up); g.lineWidth=1; g.beginPath(); g.ellipse(x,y+1,s*(2.4+Math.sin(t*2)*.3),s*.6,0,0,7); g.stroke(); } }
});
depthHazeLayer('frost');
depthMotesLayer('frost');
