// =====================================================================
// Willow Pond: its whole scene in one file (Clean Scenes 5, 2026-11-22): the scene itself, then every piece drawn on top, in the
// order they draw (each hook: land = the cached still scenery, sky, live = moving things, fore = the bottom edge). Shared layers
// (weather, the float's wake, wind gusts, depth haze and motes) are added here by name, at their place in that order. Its colours stay
// in V3PAL (f_v3scene.js / f2_areas.js) and shared drawing helpers stay in their files.
// =====================================================================
/* a swimming bird's wake (director, 2026-11-22: "no realistic wake, just a sideways V"): ripples shed behind it every so often that drift
   back, widen and fade, inside a faint V that opens out behind; the bird swims left, so the wake trails to its right */
function pondWake(px,py,s,t,P,seed){ const wc=mix(P.wTop,'#ffffff',.6);
  for(let k=0;k<4;k++){ const u=((t*.9+k/4+seed*.37)%1), cx=px+s*(1.1+u*6), rx=s*(.45+u*2.2), ry=s*(.12+u*.32);
    g.strokeStyle=v3rgba(wc,.32*(1-u)); g.lineWidth=1; g.beginPath(); g.ellipse(cx,py+s*.42,rx,ry,0,0,Math.PI*2); g.stroke(); }
  const L=s*7, sp=s*1.1; g.strokeStyle=v3rgba(wc,.18); g.beginPath(); g.moveTo(px+s*1.1,py+s*.36); g.quadraticCurveTo(px+L*.5,py+s*.36-sp*.4,px+L,py+s*.36-sp); g.moveTo(px+s*1.1,py+s*.5); g.quadraticCurveTo(px+L*.5,py+s*.5+sp*.4,px+L,py+s*.5+sp); g.stroke(); }
V3SCENES.pond = {
  // still parts: mountains, hills, pine shores, cabin, willow bank, water base, reflections
  land(x,P,hz,cnv){ if(pwOk('pond')) return; /* the painted map draws every frame (w_paint.js), so the stored scenery stays empty */
    // director, 2026-11-22: no mountains at Willow Pond (and every water's mountains looked alike): two forested ridges instead, the far
    // one hazy and the nearer one darker, each a rolling hill line crowned with its own small pines and round treetops
    { const ridge=(seed,base,amp,col,treeC,step,th)=>{ const n=v3noise(seed), yAt=f=>base-amp*(.55+.3*n(f*2.3+.4)+.15*n(f*6.1+2)), r=v3rng(seed+5);
        x.fillStyle=col; x.beginPath(); x.moveTo(0,hz+1); for(let X=0;X<=W+4;X+=4) x.lineTo(X,yAt(X/W)); x.lineTo(W,hz+1); x.closePath(); x.fill();
        for(let X=-W*.005;X<W*1.01;X+=W*step*(.6+r()*.8)){ const y=yAt(X/W)+H*.004, h=H*th*(.7+r()*.6);
          if(r()<.62) v3pine(x,X,y,h,treeC,P.rim,P.d*.15); else { x.fillStyle=treeC; x.beginPath(); x.ellipse(X,y-h*.45,h*.42,h*.5,0,0,7); x.fill(); } } };
      ridge(11,hz+1,.13*H,mix(P.far,P.farHaze,.35),mix(P.far,P.back,.35),.0065,.028);
      ridge(37,hz+1,.075*H,mix(P.far,P.hill,.6),mix(P.back,P.hill,.3),.008,.036); }
    // mid hills: wide smooth curves
    x.fillStyle=P.hill; x.beginPath(); x.moveTo(0,hz+1); x.lineTo(0,hz-.035*H); x.bezierCurveTo(W*.16,hz-.07*H,W*.3,hz-.05*H,W*.42,hz-.028*H); x.bezierCurveTo(W*.55,hz-.06*H,W*.7,hz-.055*H,W*.84,hz-.03*H); x.bezierCurveTo(W*.92,hz-.045*H,W*.97,hz-.04*H,W,hz-.036*H); x.lineTo(W,hz+1); x.closePath(); x.fill();
    // back pine rows (hazier), thick on the shores, open in the middle of the lake
    const r=v3rng(7);
    const rowB=(x0,x1,h0,h1)=>{ for(let X=x0;X<x1;X+=W*.011){ const h=H*(h0+(h1-h0)*r()); v3pine(x,X+r()*W*.006,hz+1,h,P.back,P.rim,P.d*.25); } };
    rowB(-W*.01,W*.42,.045,.075); rowB(W*.72,W*1.01,.04,.07);
    // leafy trees and shrubs on the far hills, so the middle of the lake has a living shore too
    for(const [fx,fh,sd] of [[.445,.05,3],[.475,.036,5],[.53,.044,8],[.585,.032,9],[.63,.048,12],[.68,.038,14]]) v3leafTree(x,W*fx,hz+1,H*fh,P,sd,{leaf:mix(P.leaf,P.hill,.45)});
    v3bushes(x,W*.42,W*.74,hz+1.5,H*.016,P,21,{leaf:mix(P.leaf,P.hill,.5)});
    // log cabin on the left shore: log walls, stone chimney, porch roof, door; the window light is drawn live
    { const cx=W*.265, cw=H*.075, ch=H*.042, cb=hz+1, logs=mix(P.cabin,'#000000',.28);
      // stone chimney behind the roof line
      x.fillStyle=mix(P.far,P.cabin,.5); x.fillRect(cx+cw*.18,cb-ch-ch*.82,cw*.13,ch*.9);
      x.fillStyle=mix(P.far,'#000000',.25); for(let k=0;k<4;k++) x.fillRect(cx+cw*.18,cb-ch-ch*.82+k*ch*.2,cw*.13,1);
      x.fillStyle=P.cabin; x.fillRect(cx-cw/2,cb-ch,cw,ch);
      x.fillStyle=logs; for(let k=1;k<5;k++) x.fillRect(cx-cw/2,cb-ch+k*ch/5,cw,1);
      x.fillStyle='rgba(0,0,0,.2)'; x.fillRect(cx+cw*.12,cb-ch,cw*.38,ch);
      x.fillStyle=logs; x.fillRect(cx-cw/2-1.5,cb-ch,2.5,ch); x.fillRect(cx+cw/2-1,cb-ch,2.5,ch);
      // gable roof with an overhang and a lit ridge
      x.fillStyle=P.roof; x.beginPath(); x.moveTo(cx-cw*.66,cb-ch+1.5); x.lineTo(cx-cw*.04,cb-ch-ch*.78); x.lineTo(cx+cw*.04,cb-ch-ch*.78); x.lineTo(cx+cw*.66,cb-ch+1.5); x.closePath(); x.fill();
      x.strokeStyle=v3rgba(P.rim,.35+P.d*.4); x.lineWidth=1; x.beginPath(); x.moveTo(cx+cw*.04,cb-ch-ch*.77); x.lineTo(cx+cw*.64,cb-ch+1); x.stroke();
      // porch roof on posts and a door
      x.fillStyle=P.roof; x.fillRect(cx-cw*.62,cb-ch*.52,cw*.42,ch*.08);
      x.fillStyle=logs; x.fillRect(cx-cw*.6,cb-ch*.45,1.5,ch*.45); x.fillRect(cx-cw*.24,cb-ch*.45,1.5,ch*.45);
      x.fillStyle=mix(P.cabin,'#000000',.45); x.fillRect(cx+cw*.24,cb-ch*.64,cw*.14,ch*.64);
      x.fillStyle=mix(P.cabin,'#000000',.6); x.fillRect(cx-cw*.62,cb-1,cw*1.24,2); }
    // front pines framing the cabin, with rim light at dusk
    const r2=v3rng(19);
    for(const [fx,fh] of [[.02,.13],[.055,.105],[.09,.12],[.125,.09],[.16,.11],[.2,.085],[.33,.08],[.36,.1],[.395,.07]]) v3pine(x,W*fx,hz+2,H*fh*(.92+r2()*.16),P.front,P.rim,P.d*.55);
    for(const [fx,fh] of [[.76,.075],[.8,.095],[.97,.12],[.995,.1]]) v3pine(x,W*fx,hz+2,H*fh,P.front,P.rim,P.d*.55);
    // a few leafy trees among the front pines, shoreline shrubs and reeds
    v3leafTree(x,W*.24,hz+2,H*.075,P,31); v3leafTree(x,W*.43,hz+2,H*.06,P,33); v3leafTree(x,W*.72,hz+2,H*.07,P,37);
    v3bushes(x,-W*.01,W*.24,hz+3,H*.02,P,41); v3bushes(x,W*.3,W*.45,hz+3,H*.018,P,43); v3bushes(x,W*.7,W*.8,hz+3,H*.018,P,47);
    // grassy bank on the right where the willow stands
    x.fillStyle=P.bank; x.beginPath(); x.moveTo(W*.8,hz+2); x.quadraticCurveTo(W*.88,hz-.012*H,W*1.01,hz-.004*H); x.lineTo(W*1.01,hz+.03*H); x.quadraticCurveTo(W*.9,hz+.028*H,W*.8,hz+2); x.closePath(); x.fill();
    v3reeds(x,W*.8,W*1.01,hz+.02*H,H*.035,mix(P.bank,P.leafHi,.25),51); v3flowers(x,W*.82,W*1.0,hz+H*.004,hz+H*.026,['#f4e06a','#f49ac0','#ffffff','#b8a0ff'],53,26);
    v3reeds(x,-W*.01,W*.2,hz+3,H*.026,mix(P.leaf,P.front,.4),57); v3reeds(x,W*.33,W*.44,hz+3,H*.022,mix(P.leaf,P.front,.4),59);
    // ---- water ----
    const wg=x.createLinearGradient(0,hz,0,H); wg.addColorStop(0,P.wTop); wg.addColorStop(.32,P.wMid); wg.addColorStop(1,P.wBot); x.fillStyle=wg; x.fillRect(0,hz,W,H-hz);
    // reflection: the land above, mirrored and squashed, then broken into calm bands
    x.save(); x.globalAlpha=.38; x.beginPath(); x.rect(0,hz,W,H*.3); x.clip(); x.translate(0,hz); x.scale(1,-.72); x.translate(0,-hz);
    x.drawImage(cnv,0,0,cnv.width,Math.round(hz*DPR),0,0,W,hz); x.restore();
    /* 0.4: the band ends on exactly the water color beneath it (it ended on a flat color, leaving a straight seam) */ const rt=Math.min(1,(H*.3)/(H-hz)), rEnd=rt<=.32?mix(P.wTop,P.wMid,rt/.32):mix(P.wMid,P.wBot,(rt-.32)/.68);
    const rb=x.createLinearGradient(0,hz,0,hz+H*.3); rb.addColorStop(0,v3rgba(P.wTop,0)); rb.addColorStop(1,v3rgba(rEnd,1)); x.fillStyle=rb; x.fillRect(0,hz,W,H*.3);
    x.fillStyle=v3rgba(P.wTop,.35); for(let i=0;i<9;i++){ const y=hz+3+i*i*1.6; x.fillRect(0,y,W,1); }
    // the waterline: a thin bright edge where shore meets water
    x.fillStyle=v3rgba(P.rim,.28+P.d*.2); x.fillRect(0,hz,W,1.2);
    /* the cabin's own little jetty with its rowboat tied up (overnight, 2026-11-23: Willow Pond's own expansion): weathered planks on posts
       out over the water, a mooring line, an old wooden rowboat with its oars shipped */
    { const cx=W*.265, jx=cx+H*.04, jw=H*.07, jy=hz+H*.004, nk=P.night*.6, wood=mix(mix('#8a6a4a',P.cabin,.4),'#0a1020',nk), woodD=mix(wood,'#000000',.3);
      x.fillStyle=woodD; for(let i=0;i<=3;i++) x.fillRect(jx+jw*i/3-1,jy,2,H*.012); x.fillStyle=wood; x.fillRect(jx-1,jy-H*.003,jw+2,H*.003); x.fillStyle=v3rgba('#000000',.25); x.fillRect(jx,jy,jw,1);
      const bx=jx+jw*.6, by=jy+H*.012, L=H*.03; x.fillStyle=mix(mix('#6a4a32',P.cabin,.3),'#0a1020',nk); x.beginPath(); x.moveTo(bx-L,by-H*.004); x.quadraticCurveTo(bx-L*.2,by+H*.005,bx+L,by-H*.005); x.lineTo(bx+L*.85,by-H*.007); x.quadraticCurveTo(bx,by-H*.002,bx-L,by-H*.004); x.fill(); x.fillStyle=v3rgba('#ffffff',.18*(1-P.night)); x.fillRect(bx-L*.8,by-H*.005,L*1.6,1);
      x.strokeStyle=mix('#c8a878',P.cabin,.3); x.lineWidth=1; x.beginPath(); x.moveTo(bx+L*.9,by-H*.006); x.quadraticCurveTo(bx+L*1.1,by-H*.002,jx+jw,jy-H*.002); x.stroke(); x.strokeStyle=woodD; x.beginPath(); x.moveTo(bx-L*.5,by-H*.008); x.lineTo(bx+L*.4,by-H*.004); x.stroke(); }
  },

  // living parts, every frame
  get noClouds(){ return pwOk('pond'); },
  sky(P,t,hz){ if(pwOk('pond')) pwSky('pond',P,t,hz); },
  live(P,t,hz,sun){ if(pwOk('pond')) return pwLive('pond',P,t,hz,sun);
    const d=P.d, night=P.night, FX=S.settings.effects;
    // cabin window glow + chimney smoke
    const cx=W*.265, cw=H*.075, ch=H*.042, cb=hz+1, lit=clamp(night*1.2+d*.8,0,1);
    const wx0=cx-cw*.06, wy0=cb-ch*.74, ww=cw*.2, wh=ch*.36;
    g.fillStyle=mix(P.cabin,'#000000',.5); g.fillRect(wx0-1,wy0-1,ww+2,wh+2);
    if(lit>.05){ v3glow(g,wx0+ww/2,wy0+wh/2,ch*1.2,'rgba(255,200,110,.9)',lit*.5*(.92+.08*Math.sin(t*3.1))); g.fillStyle=v3rgba('#ffcf7a',.25+lit*.75); g.fillRect(wx0,wy0,ww,wh);
      g.fillStyle=v3rgba('#ffcf7a',lit*.3); g.fillRect(wx0+ww*.15,hz+3,ww*.7,ch*.7); }
    else { g.fillStyle=mix(P.wTop,P.cabin,.4); g.fillRect(wx0,wy0,ww,wh); }
    g.fillStyle=mix(P.cabin,'#000000',.5); g.fillRect(wx0+ww/2-.5,wy0,1,wh); g.fillRect(wx0,wy0+wh/2-.5,ww,1); g.fillRect(wx0-1.5,wy0+wh,ww+3,1.6);
    // soft smoke wisps rising and drifting
    if(FX){ const sx=cx+cw*.245, sy=cb-ch-ch*.82; const sc=mix(P.farHaze,'#ffffff',.45);
      for(let i=0;i<6;i++){ const k=((t*.12+i/6)%1), r=H*(.008+k*.03); v3glow(g,sx+Math.sin(k*4+i)*H*.006+k*H*.035,sy-k*H*.11,r,v3rgba(sc,.9),.45*(1-k)*(k<.08?k/.08:1)); } }
    // sun / moon glitter on the water
    if(sun.vis>.05){ const gx=clamp(sun.x,W*.05,W*.95); g.fillStyle=v3rgba(sun.up?P.glow:'#dfe6ff',.9*sun.vis);
      for(let i=0;i<10;i++){ const y=hz+3+i*i*2.1; if(y>H*.8) break; const w2=(W*.07-i*W*.005)*(.7+.3*Math.sin(t*2.3+i*1.7)); const off=Math.sin(t*1.3+i*2.1)*W*.006; g.globalAlpha=(.85-i*.07)*sun.vis*(.6+.4*Math.sin(t*3+i)); g.fillRect(gx-w2/2+off,y,w2,1.6+i*.15); }
      g.globalAlpha=1; }
    // drifting mist bands at dusk and night (with the water: everything drifts left, director 2026-11-22)
    if(FX){ const ma=.18*d+.1*night; if(ma>.02){ for(let i=0;i<2;i++){ const mx=W*1.3-((t*(6+i*3)+i*W*.4)%(W*1.6))-W*.3, my=hz+H*(.02+i*.05), mw=W*.7; const mg=g.createLinearGradient(mx,0,mx+mw,0); const mc=mix(P.farHaze,'#ffffff',.4); mg.addColorStop(0,v3rgba(mc,0)); mg.addColorStop(.5,v3rgba(mc,ma)); mg.addColorStop(1,v3rgba(mc,0)); g.fillStyle=mg; g.fillRect(mx,my,mw,H*.025); } } }
    // gentle wave glints
    g.strokeStyle=v3rgba(mix(P.wTop,'#ffffff',.5),.22); g.lineWidth=1;
    for(let r0=0;r0<9;r0++){ const y=hz+H*.03+Math.pow(r0/9,1.5)*(H-hz)*.95; const sp=W*(.08+r0*.02), len=W*(.012+r0*.004); g.beginPath(); for(let X=-((t*(5+r0*2)+r0*53)%sp);X<W;X+=sp){ const yy=y+Math.sin(X*.02+t+r0)*1; g.moveTo(X,yy); g.quadraticCurveTo(X+len/2,yy-1.2,X+len,yy); } g.stroke(); }
    // the willow: trunk on the bank, drooping strands swaying in the breeze
    this.willow(P,t,hz);
    { const ax=W*.872, ay=hz-H*.16, L=H*.13, sw=Math.sin(t*.9)*.05, ex=ax+Math.sin(sw)*L, ey=ay+Math.cos(sw)*L, nk=P.night*.6; g.strokeStyle=mix('#c8a878','#1a2030',nk); g.lineWidth=Math.max(1,H*.0016); g.beginPath(); g.moveTo(ax-H*.006,ay); g.lineTo(ex-H*.007,ey); g.moveTo(ax+H*.006,ay); g.lineTo(ex+H*.007,ey); g.stroke(); g.fillStyle=mix('#8a6a4a','#141a28',nk); g.fillRect(ex-H*.011,ey-H*.002,H*.022,H*.004); } /* a rope swing under the willow, stirring in the breeze (overnight, 2026-11-23: Willow Pond's own expansion) */
    // ducks gliding across, leaving a wake
    { const k=((t/70)%1), dx=W*(1.05-k*1.15), dy=hz+H*.045; for(let i=0;i<2;i++){ const px=dx+i*W*.03, py=dy+i*H*.006, s=H*.012;
        pondWake(px+s*.2,py,s,t,P,i);
        const bob=Math.sin(t*2+i)*.6; g.fillStyle=mix(P.cabin,'#8a6a4a',.5); g.beginPath(); g.ellipse(px+s*.8,py+bob,s*1.1,s*.5,0,0,7); g.fill();
        g.fillStyle=i?mix('#2f6a4a',P.front,night*.7):mix('#8a6a4a',P.front,night*.6); g.beginPath(); g.arc(px,py-s*.5+bob,s*.38,0,7); g.fill();
        g.fillStyle=mix('#f0b040',P.front,night*.6); g.beginPath(); g.moveTo(px-s*.35,py-s*.5+bob); g.lineTo(px-s*.75,py-s*.38+bob); g.lineTo(px-s*.33,py-s*.32+bob); g.fill();
        g.fillStyle=v3rgba(P.rim,.5*d); g.fillRect(px+s*.2,py-s*.45+bob,s*1.4,1); } }
    // a fish rises now and then: a ring spreading out
    { const per=7.3, k=(t%per)/per, i=Math.floor(t/per), rr2=v3rng(i*97+5)(), fx=W*(.45+rr2*.4), fy=hz+H*(.08+((i*37)%10)/10*.25);
      if(k<.55){ const e=k/.55; g.strokeStyle=v3rgba(mix(P.wTop,'#ffffff',.7),.6*(1-e)); g.lineWidth=1.2; g.beginPath(); g.ellipse(fx,fy,4+e*W*.03,1.5+e*H*.012,0,0,7); g.stroke(); g.beginPath(); g.ellipse(fx,fy,2+e*W*.018,1+e*H*.007,0,0,7); g.stroke(); } }
    // lily pads with veins; the bloom glows after sunset
    this.lilies(P,t,hz,lit);
    // fireflies (dusk, night) or dragonflies (day)
    if(FX){ if(lit>.15){ for(let i=0;i<12;i++){ const rr=v3rng(i*31+3); const bx=W*(.08+rr()*.6), by=hz-H*.02+rr()*H*.3; const fx=bx+Math.sin(t*.4+i*1.3)*W*.03, fy=by+Math.sin(t*.55+i*2.1)*H*.025; const a=lit*(.5+.5*Math.sin(t*2.2+i*1.9)); if(a<.05) continue; v3glow(g,fx,fy,H*.022,'rgba(255,240,150,.9)',a*.8); g.fillStyle=v3rgba('#fff6b8',a); g.fillRect(fx-1,fy-1,2,2); } }
      else if(night<.2){ for(let i=0;i<2;i++){ const k=t*.35+i*3.1, fx=W*(.42+.25*Math.sin(k)+i*.12), fy=hz+H*(.12+.06*Math.sin(k*1.7+i)), s=H*.012; g.strokeStyle='#2a8a8a'; g.lineWidth=1.6; g.beginPath(); g.moveTo(fx-s,fy); g.lineTo(fx+s,fy); g.stroke(); g.fillStyle='rgba(220,250,255,.5)'; const fl=Math.sin(t*40+i)*.4; g.beginPath(); g.ellipse(fx,fy-s*.4,s*.7,s*.22*(1+fl),-.3,0,7); g.ellipse(fx,fy+s*.4,s*.7,s*.22*(1-fl),.3,0,7); g.fill(); } } }
    // the moment, every 50 s (map standard, 2026-11-21): by day a mother duck leads her ducklings across the far water, in from behind
    // the willow and out past the cabin (three to five of them, a little different each time); at night a tawny owl glides low over the pond
    { const per=50, q=t%per, n=Math.floor(t/per), r=v3rng(n*41+3);
      if(night<.55){ if(q<26){ const e=q/26, nd=3+Math.floor(r()*3), yy=hz+H*(.05+r()*.02), s0=H*.011, N=c0=>mix(c0,P.front,night*.6);
        for(let i=0;i<=nd;i++){ const big=i===0, s=big?s0:s0*.55, px=W*(1.04-e*1.12)+i*s0*2.3+(big?0:s0*.8), py=yy+(big?0:s0*.15), bob=Math.sin(t*2.4+i*1.3)*s*.12; if(px<-s*4||px>W+s*4) continue;
          pondWake(px,py-s*.1,s,t,P,i+2);
          g.fillStyle=N(big?'#8a6a48':'#c8a850'); g.beginPath(); g.ellipse(px+s*.3,py+bob,s*1.05,s*.48,0,Math.PI,0); g.quadraticCurveTo(px+s*.3,py+bob+s*.35,px-s*.75,py+bob); g.fill(); g.beginPath(); g.moveTo(px+s*1.2,py+bob); g.lineTo(px+s*1.65,py+bob-s*.35); g.lineTo(px+s*1.2,py+bob-s*.2); g.fill();
          g.fillStyle=N(big?'#6a5038':'#d8b858'); g.beginPath(); g.arc(px-s*.55,py+bob-s*.62,s*.36,0,7); g.fill(); g.fillStyle=N('#e8a030'); g.beginPath(); g.moveTo(px-s*.85,py+bob-s*.66); g.lineTo(px-s*1.2,py+bob-s*.56); g.lineTo(px-s*.85,py+bob-s*.5); g.fill();
          g.fillStyle='#1a1410'; g.fillRect(px-s*.65,py+bob-s*.72,1.2,1.2); } } }
      else if(q<7){ const e=q/7, ox=W*(1.06-e*1.14), oy=hz-H*(.03+.05*Math.sin(e*Math.PI)), s=H*.007, N=c0=>mix(c0,P.front,.35); v3owlFly(ox,oy,s,t,N('#6a5440'),N('#8a7058'),N('#6a5440'),'#f0c040');
        if(oy>hz-H*.045){ g.fillStyle=v3rgba('#000000',.12); g.beginPath(); g.ellipse(ox,hz+H*.01,s*1.6,s*.25,0,0,7); g.fill(); } } }
  },

  willow(P,t,hz){ v3willow(P,t,hz); },

  lilies(P,t,hz,lit){
    const pads=[[.5,.78,.05],[.57,.84,.035],[.66,.72,.03],[.86,.9,.045]];
    for(const [px,py,ps] of pads){ const x0=W*px, y0=H*py, rx=W*ps, ry=rx*.32;
      g.fillStyle=mix('#3f7a5a',P.wBot,P.night*.6); g.beginPath(); g.ellipse(x0,y0,rx,ry,0,.25,Math.PI*2-.05); g.lineTo(x0,y0); g.closePath(); g.fill();
      g.strokeStyle=mix('#6fa880',P.wBot,P.night*.6); g.lineWidth=.8; g.beginPath(); for(let k=0;k<6;k++){ const a=.5+k*.95; g.moveTo(x0,y0); g.lineTo(x0+Math.cos(a)*rx*.85,y0+Math.sin(a)*ry*.85); } g.stroke();
      g.fillStyle=v3rgba(P.rim,.25*P.d); g.beginPath(); g.ellipse(x0+rx*.2,y0-ry*.4,rx*.5,ry*.25,0,0,7); g.fill(); }
    // the bloom on the big pad
    const bx=W*.5+W*.012, by=H*.78-H*.012, s=H*.016;
    if(lit>.05) v3glow(g,bx,by,s*4.5,'rgba(255,190,220,.9)',lit*(.55+.15*Math.sin(t*1.6)));
    g.fillStyle=mix('#ffb8d4',P.wBot,P.night*.25); for(let k=0;k<6;k++){ const a=-Math.PI/2+(k-2.5)*.42; g.beginPath(); g.ellipse(bx+Math.cos(a)*s*.55,by+Math.sin(a)*s*.45,s*.55,s*.24,a,0,7); g.fill(); }
    g.fillStyle='#ffe58a'; g.beginPath(); g.arc(bx,by,s*.22,0,7); g.fill();
  },

  fore(P,t){ if(pwOk('pond')) return;
    // cattails and reeds in the bottom-right corner, swaying, rim lit at dusk
    const base=H+2, x0=W*.925;
    for(let i=0;i<9;i++){ const x=x0+i*W*.0085, h=H*(.1+((i*13)%5)*.022), sw=Math.sin(t*1.1+i*.6)*H*.008;
      g.strokeStyle=mix('#3d6a3a',P.front,.35+P.night*.4); g.lineWidth=Math.max(1.4,H*.006); g.beginPath(); g.moveTo(x,base); g.quadraticCurveTo(x+sw*.4,base-h*.6,x+sw,base-h); g.stroke();
      if(i%3===0){ g.fillStyle=mix('#6a4028',P.front,P.night*.5); g.beginPath(); g.ellipse(x+sw,base-h-H*.012,H*.0065,H*.022,sw*.02,0,7); g.fill(); g.fillStyle=v3rgba(P.rim,.4*P.d); g.fillRect(x+sw+H*.002,base-h-H*.028,1,H*.02); } }
  }
};
wx3SkyLayer('pond');
wx3WaterLayer('pond');
l3wakeLayer('pond');
l3gustLayer('pond');
m33wrap('pond','live',function(P,t,hz){ if(pwOk('pond')) return; /* the code-drawn life belongs to the code-drawn scene */ const night=P.night, FX=S.settings.effects;
  // the frog: sits, then leaps in a little arc to the next pad (ripple where it lands)
  { const per=9, cyc=Math.floor(t/per), q=(t%per)/per, a=L3.pads[cyc%4], b=L3.pads[(cyc+1)%4], hop=q>.82?(q-.82)/.18:0, e=l3s(hop);
    const x=W*(a[0]+(b[0]-a[0])*e)+W*.008, y=H*(a[1]+(b[1]-a[1])*e)-H*.012-Math.sin(e*Math.PI)*H*.05, s=H*.0055, fc=mix('#5a9a3a',P.wBot,night*.55), dk=mix('#3a6a28',P.wBot,night*.55), belly=mix('#d8e8a0',P.wBot,night*.5);
    /* director, 2026-11-22 ("lacks detail, the hop doesn't look right"): a side-view frog, crouched with its hind legs folded while it sits;
       in the air the body stretches along the arc, hind legs kicked out straight behind and front legs reaching ahead */
    const air=hop>0&&hop<1, dir=b[0]>=a[0]?1:-1, ang=air?Math.atan2(-Math.cos(e*Math.PI)*.05*H*Math.PI,(b[0]-a[0])*W*dir+1e-3)*.6:-.25;
    g.save(); g.translate(x,y); g.scale(dir,1); g.rotate(ang);
    if(air){ g.strokeStyle=dk; g.lineWidth=s*.55; g.lineCap='round'; g.beginPath(); g.moveTo(-s*1.5,s*.2); g.lineTo(-s*3.4,s*.5); g.lineTo(-s*4.6,s*.3); g.moveTo(s*1.2,s*.5); g.lineTo(s*2.4,s*.9); g.stroke(); g.lineCap='butt'; }
    else { g.fillStyle=dk; g.beginPath(); g.ellipse(-s*1.1,s*.35,s*1.2,s*.7,-.3,0,7); g.fill(); g.fillRect(-s*1.6,s*.8,s*2.2,s*.35); /* folded thigh and foot */ g.fillRect(s*1,s*.3,s*.4,s*1); /* front leg */ }
    g.fillStyle=fc; g.beginPath(); g.ellipse(0,0,s*2*(air?1.15:1),s*1.15*(air?.85:1),0,0,7); g.fill();
    g.beginPath(); g.ellipse(s*1.6,-s*.35,s*1,s*.75,.2,0,7); g.fill(); /* head */
    g.fillStyle=belly; g.beginPath(); g.ellipse(s*.2,s*.6,s*1.5,s*.45,0,0,7); g.fill();
    g.fillStyle=dk; for(const [sx,sy] of [[-.8,-.5],[.2,-.7],[-.2,-.1]]) { g.beginPath(); g.arc(sx*s,sy*s,s*.22,0,7); g.fill(); } /* spots */
    g.fillStyle=fc; g.beginPath(); g.arc(s*1.7,-s*1,s*.5,0,7); g.fill(); g.fillStyle='#f0e070'; g.beginPath(); g.arc(s*1.8,-s*1.05,s*.32,0,7); g.fill(); g.fillStyle='#14140e'; g.fillRect(s*1.72,-s*1.15,s*.22,s*.22); /* eye */
    g.strokeStyle=dk; g.lineWidth=Math.max(.6,s*.12); g.beginPath(); g.moveTo(s*2.5,-s*.2); g.quadraticCurveTo(s*1.9,s*.05,s*1.2,-s*.1); g.stroke(); /* mouth */
    g.restore();
    if(FX&&q>.95){ const k=(q-.95)/.05; g.strokeStyle=v3rgba('#ffffff',.5*(1-k)); g.lineWidth=1; g.beginPath(); g.ellipse(W*b[0]+W*.008,H*b[1]-H*.008,s*(2+k*6),s*(.6+k*1.6),0,0,7); g.stroke(); } }
  // the deer (director, 2026-11-22: it stood in the water and vanished at random): it walks out from behind the willow onto the grass
  // bank, lowers its head to the water's edge to drink, and walks back behind the willow; it never fades in or out
  { const per=70, q=((t+20)%per)/per; if(q<.45){ const walk=q<.08?1-q/.08:q>.37?(q-.37)/.08:0, a=1, dip=Math.max(0,Math.sin((q-.08)/.29*Math.PI*3))*(q>.08&&q<.37?1:0), x=W*(.875+walk*.16), y=hz-H*.004, s=H*.006, dc=mix('#8a5a34',P.front,.35+night*.4);
      g.save(); g.translate(x,0); g.scale(q>.37?1:-1,1); g.translate(-x,0); /* faces where it walks: left to the water, right on the way back */ g.globalAlpha=a; g.fillStyle=dc; g.beginPath(); g.ellipse(x,y-s*3.4,s*3.2,s*1.5,0,0,7); g.fill(); for(const lx of [-2.2,-1.6,1.8,2.4]) g.fillRect(x+lx*s,y-s*2.4,s*.45,s*2.4);
      g.save(); g.translate(x+s*2.8,y-s*4.2); g.rotate(.4+dip*1.1); g.fillRect(-s*.45,-s*3,s*.9,s*3); g.beginPath(); g.ellipse(0,-s*3.3,s*1.1,s*.7,.5,0,7); g.fill(); g.strokeStyle=dc; g.lineWidth=s*.3; g.beginPath(); g.moveTo(-s*.3,-s*3.8); g.lineTo(-s*1,-s*5.2); g.moveTo(-s*.6,-s*4.6); g.lineTo(-s*1.6,-s*4.8); g.stroke(); g.restore();
      g.fillStyle=mix('#f4ead8',P.front,.4+night*.4); g.fillRect(x-s*3.3,y-s*4,s*.7,s*.7); g.restore();
      g.save(); g.globalAlpha=a*.25; g.fillStyle=dc; g.beginPath(); g.ellipse(x,y+s*2.2,s*3.2,s*1,0,0,7); g.fill(); g.restore(); } }
  // willow leaves drifting down, then floating and turning slowly on the water
  if(FX){ for(let i=0,n=gfxHigh()?8:5;i<n;i++){ const per=11+i*1.7, q=((t+i*3.1)%per)/per, sx=W*(.82+l3hash(i)*.12), wy=hz+H*(.04+l3hash(i+9)*.12), fall=Math.min(1,q/.35), x=sx-q*W*.08+Math.sin(t*1.6+i)*W*.006*(1-fall*.5), y=hz-H*.18+(wy-hz+H*.18)*l3s(fall), a=q<.9?1:(1-q)/.1;
      g.save(); g.globalAlpha=a; g.translate(x,y); g.rotate(t*(fall<1?2:.3)+i); g.fillStyle=mix(P.leafHi||'#cfe08a',P.wMid,night*.5); g.beginPath(); g.ellipse(0,0,H*.004,H*.0014,0,0,7); g.fill(); g.restore(); } }
  // dandelion seeds floating in the daylight
  if(FX&&night<.6){ g.fillStyle=v3rgba('#fffaf0',.7*(1-night)); for(let i=0,n=gfxHigh()?14:8;i<n;i++){ const x=W*((l3hash(i)+t*.006*(1+i%3))%1), y=hz*(.55+l3hash(i+4)*.4)+Math.sin(t*.8+i)*H*.02; g.beginPath(); g.arc(x,y,1.1,0,7); g.fill(); g.fillRect(x-.2,y,.4,2); } }
});
depthHazeLayer('pond');
depthMotesLayer('pond');
