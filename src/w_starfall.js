// =====================================================================
// Starfall Lake: its whole scene in one file (Clean Scenes 5, 2026-11-22): the scene itself, then every piece drawn on top, in the
// order they draw (each hook: land = the cached still scenery, sky, live = moving things, fore = the bottom edge). Shared layers
// (weather, the float's wake, wind gusts, depth haze and motes) are added here by name, at their place in that order. Its colours stay
// in V3PAL (f_v3scene.js / f2_areas.js) and shared drawing helpers stay in their files.
// =====================================================================
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
wx3SkyLayer('starfall');
m33wrap('starfall','sky',function(P,t,hz){ const night=P.night, vis=.35+night*.65;
  // nebula clouds: soft color pools that breathe slowly
  g.save(); g.globalCompositeOperation='lighter';
  for(const [x,y,r,col,ph] of [[.2,.32,.3,'255,120,200',0],[.55,.18,.36,'120,140,255',1.7],[.82,.36,.26,'120,230,255',3.1],[.4,.5,.22,'200,120,255',4.4]]){ const a=(.05+.025*Math.sin(t*.12+ph))*vis, X=W*x+Math.sin(t*.02+ph)*W*.01, Y=hz*y, R=H*r;
    const gr=g.createRadialGradient(X,Y,0,X,Y,R); gr.addColorStop(0,'rgba('+col+','+a+')'); gr.addColorStop(.6,'rgba('+col+','+(a*.4)+')'); gr.addColorStop(1,'rgba('+col+',0)'); g.fillStyle=gr; g.fillRect(X-R,Y-R,R*2,R*2); }
  g.restore();
  // the star whale: a constellation that swims across the sky in ~90 s, its tail and fins flexing
  { const per=90, q=(t%per)/per, a=Math.sin(q*Math.PI), X=W*(-.15+q*1.3), /* swims head-first (its head points right) */ Y=hz*(.42+Math.sin(q*Math.PI*2)*.06), s=H*.016, fl=Math.sin(t*.9);
    const pts=[[6,0],[4.6,-1.4],[2.4,-2],[0,-2],[-2.4,-1.6],[-4.4,-.9],[-6.4,-.2],[-7.6,-1.6+fl*.6],[-7.8,1.2+fl*.6],[-6.4,.4],[-4.4,1.1],[-2,1.6],[1,1.7],[3.6,1.2],[5.4,.6]];
    const fin=[[1,1.7],[-.4,3.4+fl*.4],[-1.8,1.7]], P2=([u,v])=>[X+u*s,Y+v*s];
    g.save(); g.globalAlpha=a*vis; const outl=()=>{ g.beginPath(); pts.forEach((p,i)=>{ const [x,y]=P2(p); i?g.lineTo(x,y):g.moveTo(x,y); }); g.closePath(); fin.forEach((p,i)=>{ const [x,y]=P2(p); i?g.lineTo(x,y):g.moveTo(x,y); }); };
    g.globalCompositeOperation='lighter'; outl(); g.strokeStyle='rgba(150,180,255,.1)'; g.lineWidth=10; g.stroke(); g.strokeStyle='rgba(170,195,255,.16)'; g.lineWidth=5; g.stroke(); g.strokeStyle='rgba(215,225,255,.45)'; g.lineWidth=1.2; g.stroke(); g.globalCompositeOperation='source-over';
    g.fillStyle='#ffffff'; pts.concat(fin).forEach((p,i)=>{ const [x,y]=P2(p), tw=.6+.4*Math.sin(t*2+i*1.3); v3glow(g,x,y,s*.9,'rgba(200,215,255,.9)',.45*a*vis*tw); g.globalAlpha=a*vis*tw; g.beginPath(); g.arc(x,y,i%4===0?1.8:1.1,0,7); g.fill(); });
    const [ex,ey]=P2([4.4,-.6]); g.globalAlpha=a*vis; g.beginPath(); g.arc(ex,ey,1.6,0,7); g.fill(); v3glow(g,X,Y,s*9,'rgba(150,170,255,.8)',.12*a*vis); g.restore();
    // a spout of stardust now and then
    const sq=(t%15)/15; if(sq<.2){ const e=sq/.2; for(let i=0;i<8;i++){ const ang=-Math.PI/2+(i-3.5)*.22, r=s*(1+e*4); g.fillStyle='rgba(230,235,255,'+(.7*(1-e)*a*vis)+')'; g.fillRect(X+3*s+Math.cos(ang)*r*.5,Y-2*s+Math.sin(ang)*r*1.4,1.4,1.4); } } }
  // a comet: rarely, a long soft tail crossing high and slow
  { const per=70, q=(t%per)/per; if(q<.3){ const e=q/.3, a=Math.sin(e*Math.PI), X=W*(-.1+e*1.2), Y=hz*(.12+e*.1), L=W*.12;
      const gr=g.createLinearGradient(X,Y,X-L,Y-L*.18); gr.addColorStop(0,'rgba(255,255,255,'+(.8*a*vis)+')'); gr.addColorStop(1,'rgba(180,200,255,0)'); g.strokeStyle=gr; g.lineWidth=2.4; g.beginPath(); g.moveTo(X,Y); g.lineTo(X-L,Y-L*.18); g.stroke(); v3glow(g,X,Y,H*.02,'rgba(230,240,255,.9)',.5*a*vis); } }
});
m33wrap('starfall','sky',function(P,t,hz){ const E=sfEvent(t); if(E.into>SF_DUR) return; const q=E.into/SF_DUR, a=Math.sin(q*Math.PI);
  if(E.kind===3){ // sky veil: a shimmering curtain unfurls high in the sky
    g.save(); g.globalCompositeOperation='lighter'; const cols=['160,120,255','90,220,255','255,140,220']; for(let b=0;b<3;b++){ const y0=hz*(.16+b*.07); for(let X=0;X<=W;X+=Math.max(4,W/90)){ const reveal=Math.min(1,Math.max(0,(q*1.6-X/W*.6)*2)), dy=Math.sin(X*.01+t*.6+b)*hz*.04, h=hz*(.1+.05*Math.sin(X*.02+t+b)); const al=.12*a*reveal*(.6+.4*Math.sin(X*.04+t*2)); g.fillStyle='rgba('+cols[b]+','+al+')'; g.fillRect(X,y0+dy-h,Math.max(4,W/90)+1,h); } } g.restore(); }
  if(E.kind===0){ // starfall shower: shooting stars raining into the lake
    for(let i=0;i<22;i++){ const st=i*.03, e=(q-st)/.35; if(e<0||e>1) continue; const x0=W*(.12+((i*.173)%.84)), X=x0+e*W*.08, Y=hz*.05+e*(hz*.95), L=H*.06; const gr=g.createLinearGradient(X,Y,X-L*.5,Y-L); gr.addColorStop(0,'rgba(255,255,255,'+(.9*(1-e*.3))+')'); gr.addColorStop(1,'rgba(200,190,255,0)'); g.strokeStyle=gr; g.lineWidth=2.2; g.beginPath(); g.moveTo(X,Y); g.lineTo(X-L*.5,Y-L); g.stroke(); } } });
m33wrap('starfall','live',function(P,t,hz){ const F=M33.falls; if(!F) return; for(const k in F){ const [tt,X,Y,w,h]=F[k], fx=X+w*1.02, fy=Y+h*.03;
  // the source: a spring pool on the island, a stream across the grass, and the water spilling over the lip
  { // a small pond set into the grass near the edge, brimming over its lip into the fall
    const px=X+w*.62, py=Y-h*.06, pw=w*.34, ph=h*.05, wc=mix(P.wTop,'#c8e4ff',.5);
    g.fillStyle=mix(P.islD,'#000000',.2); g.beginPath(); g.ellipse(px,py+ph*.25,pw*1.12,ph*1.25,0,0,7); g.fill(); // its bank
    g.fillStyle=v3rgba(wc,.95); g.beginPath(); g.ellipse(px,py,pw,ph,0,0,7); g.fill();
    g.fillStyle=v3rgba(mix(P.isl,'#000000',.35),.5); g.beginPath(); g.ellipse(px,py-ph*.25,pw*.98,ph*.55,0,Math.PI,0); g.fill(); // the far bank reflected
    g.fillStyle='rgba(255,255,255,'+(.4+.25*Math.sin(tt*1.6))+')'; g.beginPath(); g.ellipse(px-pw*.3,py+ph*.15,pw*.3,ph*.18,0,0,7); g.fill();
    for(let k=0;k<2;k++){ const q=((tt*.5+k*.5)%1); g.strokeStyle='rgba(235,245,255,'+(.5*(1-q))+')'; g.lineWidth=.8; g.beginPath(); g.ellipse(px+pw*.1,py,pw*(.15+q*.5),ph*(.15+q*.5),0,0,7); g.stroke(); }
    // the overflow: water slipping over the lip toward the edge, then the brink of the fall
    g.strokeStyle=v3rgba(wc,.95); g.lineCap='round'; g.lineWidth=Math.max(1.6,w*.06); g.beginPath(); g.moveTo(px+pw*.85,py+ph*.2); g.quadraticCurveTo(X+w*.96,Y-h*.035,fx,fy); g.stroke();
    g.strokeStyle='rgba(255,255,255,.7)'; g.lineWidth=.8; for(let q=0;q<3;q++){ const u=((tt*.8+q/3)%1), sx=px+pw*.85+(fx-px-pw*.85)*u, sy=py+ph*.2+(fy-py-ph*.2)*u*u; g.beginPath(); g.moveTo(sx,sy); g.lineTo(sx+w*.04,sy+h*.005); g.stroke(); }
    g.fillStyle='rgba(235,245,255,.85)'; g.beginPath(); g.ellipse(fx-w*.005,fy,w*.05,h*.022,.4,0,7); g.fill(); }
  m33fall(tt,fx,fy,w,hz);
  g.save(); g.globalAlpha=.18; const rg=g.createLinearGradient(0,hz+H*.012,0,hz+H*.08); rg.addColorStop(0,'rgba(240,236,255,.9)'); rg.addColorStop(1,'rgba(240,236,255,0)'); g.fillStyle=rg; g.fillRect(fx-Math.max(1.4,w*.06),hz+H*.014,Math.max(2.8,w*.12),H*.066); g.restore(); } });
wx3WaterLayer('starfall');
l3wakeLayer('starfall');
l3gustLayer('starfall');
m33wrap('starfall','live',function(P,t,hz){ if(!S.settings.effects) return; for(let i=0,n=gfxHigh()?18:10;i<n;i++){ const q=((t*.2+i*.17)%1), x=W*[.3,.33,.78,.82,.9][i%5]+(l3hash(i)-.5)*W*.02, y=hz-H*.02-q*H*.12; g.fillStyle=v3rgba(i%2?(P.cry2||'#8ae8ff'):(P.cry||'#c890ff'),.7*Math.sin(q*Math.PI)); g.fillRect(x,y,1.5,1.5); } });
depthHazeLayer('starfall');
m33wrap('starfall','live',function(P,t,hz){ const FX=S.settings.effects;
  // lanterns: released near the far shore, drifting up and fading among the stars
  for(let i=0,n=gfxHigh()?9:6;i<n;i++){ const per=24+i*3, q=((t+i*5.3)%per)/per, x0=W*(.32+((i*.137)%.6)), x=x0+Math.sin(t*.3+i)*W*.012+q*W*.03, y=hz+H*.02-q*(hz*.9), a=Math.min(1,q/.08)*Math.min(1,(1-q)/.3), s=H*(.008-q*.004);
    v3glow(g,x,y,s*8,'rgba(255,200,120,.9)',.55*a); g.fillStyle='rgba(255,214,150,'+(.9*a)+')'; g.beginPath(); g.moveTo(x-s*.7,y-s); g.lineTo(x+s*.7,y-s); g.lineTo(x+s*.55,y+s); g.lineTo(x-s*.55,y+s); g.closePath(); g.fill(); g.fillStyle='rgba(255,250,220,'+a+')'; g.fillRect(x-s*.25,y+s*.2,s*.5,s*.6);
    if(q<.08){ g.save(); g.globalAlpha=.3*(1-q/.08); g.fillStyle='rgba(255,200,120,1)'; g.beginPath(); g.ellipse(x0,hz+H*.022,s*2,s*.4,0,0,7); g.fill(); g.restore(); } }
  // star-blossoms: little flowers of light that open on the surface, glow, and close again
  for(let i=0;i<7;i++){ const per=9+i*1.3, q=((t+i*2.1)%per)/per; if(q>.7) continue; const e=Math.sin(q/.7*Math.PI), x=W*(.3+((i*.21)%.65)), y=hz+H*(.08+((i*37)%30)/100), s=H*(.004+e*.006);
    g.save(); g.globalCompositeOperation='lighter'; v3glow(g,x,y,s*3,'rgba(190,170,255,.9)',.35*e); for(let k=0;k<6;k++){ const a=k/6*Math.PI*2+t*.2; g.fillStyle='rgba(220,210,255,'+(.7*e)+')'; g.beginPath(); g.ellipse(x+Math.cos(a)*s*.9,y+Math.sin(a)*s*.35,s*.6,s*.25,a,0,7); g.fill(); } g.fillStyle='rgba(255,255,255,'+e+')'; g.fillRect(x-1,y-.5,2,1); g.restore();
    if(FX){ g.strokeStyle='rgba(220,210,255,'+(.3*e)+')'; g.lineWidth=1; g.beginPath(); g.ellipse(x,y+1,s*(2+q*4),s*(.5+q),0,0,7); g.stroke(); } }
});
m33wrap('starfall','live',function(P,t,hz){ const E=sfEvent(t); if(E.into>SF_DUR) return; const q=E.into/SF_DUR, a=Math.sin(q*Math.PI);
  if(E.kind===0){ for(let i=0;i<22;i++){ const st=i*.03+.35, e=(q-st)/.3; if(e<0||e>1) continue; const X=W*(.12+((i*.173)%.84))+W*.08, Y=hz+H*.01; g.strokeStyle='rgba(220,210,255,'+(.6*(1-e))+')'; g.lineWidth=1.2; g.beginPath(); g.ellipse(X,Y,H*(.01+e*.06),H*(.003+e*.012),0,0,7); g.stroke(); v3glow(g,X,Y,H*.03,'rgba(220,210,255,.9)',.3*(1-e)); } }
  if(E.kind===1){ // crystal resonance: light runs through the crystals from left to right, rings spread over the lake
    const xs=[.3,.33,.36,.78,.82,.86,.9]; for(let i=0;i<xs.length;i++){ const e=Math.max(0,Math.min(1,(q*1.4-i*.08)*3)), b=Math.sin(e*Math.PI); if(b<=0) continue; const X=W*xs[i], Y=hz-H*.03; v3glow(g,X,Y,H*.1,'rgba(150,230,255,.95)',.85*b); g.fillStyle='rgba(220,250,255,'+(.8*b)+')'; g.fillRect(X-1,Y-H*.05,2,H*.05); g.strokeStyle='rgba(170,230,255,'+(.5*b)+')'; g.lineWidth=1.2; g.beginPath(); g.ellipse(X,hz+H*.01,H*(.02+e*.1),H*(.005+e*.02),0,0,7); g.stroke(); } }
  if(E.kind===2){ // a luminous fish leaps: it breaks the surface with a real splash, arcs head-first, re-enters with spray and rings
    const sp=SF_FISH(), x0=W*.46, x1=W*.7, wy=hz+H*.13, peak=H*.17, len=H*.07, lq=Math.min(1,Math.max(0,(q-.15)/.6)), X=x0+(x1-x0)*lq, Y=wy-Math.sin(lq*Math.PI)*peak, dydx=-Math.cos(lq*Math.PI)*peak*Math.PI/(x1-x0), ang=Math.atan(dydx);
    // a dark shape gathering under the surface before the leap, and sinking after
    if(q<.15||q>.75){ const e=q<.15?q/.15:(1-q)/.25, sx=q<.15?x0:x1; g.save(); g.globalAlpha=.3*e; g.translate(sx,wy+H*.012); g.scale(1,.4); drawCreature(g,sp,0,0,len,{sil:'#0a0820',wag:t*10}); g.restore(); }
    if(lq>0&&lq<1){ g.save(); g.beginPath(); g.rect(0,0,W,wy+1); g.clip(); v3glow(g,X,Y,len*1.2,'rgba(170,200,255,.9)',.35); g.translate(X,Y); g.rotate(ang); drawCreature(g,sp,0,0,len,{wag:t*14,shiny:true}); g.restore();
      // droplets streaming off its tail
      for(let i=1;i<8;i++){ const qq=Math.max(0,lq-i*.025), x=x0+(x1-x0)*qq, y=wy-Math.sin(qq*Math.PI)*peak+i*1.5; g.fillStyle='rgba(225,235,255,'+(.6*(1-i/8))+')'; g.beginPath(); g.ellipse(x,y,1.1,1.6,0,0,7); g.fill(); }
      // its reflection on the lake
      g.save(); g.globalAlpha=.18*(1-Math.sin(lq*Math.PI)*.5); g.translate(X,wy*2-Y); g.scale(1,-1); g.rotate(ang); drawCreature(g,sp,0,0,len,{wag:t*14}); g.restore(); }
    // splash crowns and spreading rings where it leaves and where it lands
    for(const [st,sx] of [[.15,x0],[.75,x1]]){ const e=(q-st)/.2; if(e>0&&e<1){ for(let i=0;i<11;i++){ const a=-Math.PI/2+(i-5)*.26, v=1-Math.pow(1-e,2), r=len*(.25+v*.7); g.fillStyle='rgba(230,238,255,'+(.8*(1-e))+')'; g.beginPath(); g.arc(sx+Math.cos(a)*r*.7,wy+Math.sin(a)*r*1.3*(1-e*.4)+e*e*len*.4,1.4,0,7); g.fill(); }
      for(let k=0;k<3;k++){ const ee=Math.min(1,e*1.2-k*.15); if(ee<=0) continue; g.strokeStyle='rgba(210,220,255,'+(.5*(1-ee))+')'; g.lineWidth=1.2; g.beginPath(); g.ellipse(sx,wy+1,len*(.3+ee*1.4),len*(.08+ee*.3),0,0,7); g.stroke(); } } } }
  if(E.kind===4){ // firefly swarm: motes of light swirl up from the lake and scatter into the night
    g.save(); g.globalCompositeOperation='lighter'; for(let i=0;i<64;i++){ const ph=i*.157, r=W*(.03+q*.18)*(.4+((i*7)%10)/10), ang=ph*6.28+t*(.6+(i%3)*.2), X=W*.55+Math.cos(ang)*r, Y=hz+H*.12-q*H*.3+Math.sin(ang*1.3)*r*.35; g.fillStyle='rgba(255,240,170,'+(a*(.6+.4*Math.sin(t*6+i)))+')'; g.beginPath(); g.arc(X,Y,2,0,7); g.fill(); v3glow(g,X,Y,6,'rgba(255,230,150,.8)',.25*a); g.beginPath(); g.fill(); } g.restore(); }
});
depthMotesLayer('starfall');
