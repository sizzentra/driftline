// =====================================================================
// 0.3.3 weather that changes the world. Every weather type now touches three layers:
//   sky   (behind the land: rainbow arc, aurora curtains, blood moon, golden sun rays, storm scud)
//   water (rain rings, whitecaps, reflections of the rainbow, aurora and moon, golden glitter, fog wisps)
//   top   (fog banks drifting across, lightning bolts, the blood moon's red vignette)
// Everything is multiplied by WXA (the weather's fade in/out, 0..1), so it builds up and dies away
// smoothly; nothing switches on or off in one frame.
// =====================================================================
const WX3={};
function wx3sun(hz){ const p=phase(), sa=((p+.05)%1), up=sa<.55, k=up?sa/.55:(sa-.55)/.45; return {x:W*(.1+.8*k), y:hz-Math.sin(k*Math.PI)*hz*.8+10, up}; }
function wx3k(){ try{ return weather().k; }catch(e){ return 'Clear'; } }
const wx3A=()=>typeof WXA==='number'?WXA:1;

// ---------- sky layer: hooked into every scene's sky step (drawn before the cached land) ----------
function wx3Sky(P,t,hz){ const k=wx3k(), a=wx3A(); if(a<.01) return; const night=P.night||0;
  if(k==='Rainbow'){ const A=a*(1-night*.85)*.36; if(A>.01){ const cx=W*.62, cy=hz+H*.28, R=H*.66, cols=['#ff4a4a','#ff9a3a','#ffe04a','#5ad86a','#4aa8ff','#5a5aff','#b05aff'], bw=H*.012;
      g.save(); g.beginPath(); g.rect(0,0,W,hz); g.clip(); g.lineWidth=bw*1.2; for(let i=0;i<7;i++){ g.globalAlpha=A*(i===0||i===6?.7:1); g.strokeStyle=cols[i]; g.beginPath(); g.arc(cx,cy,R-i*bw,Math.PI*1.04,Math.PI*1.96); g.stroke(); }
      g.globalAlpha=A*.35; g.strokeStyle='#ffffff'; g.lineWidth=bw*6; g.beginPath(); g.arc(cx,cy,R-bw*10,Math.PI*1.06,Math.PI*1.94); g.stroke(); g.restore(); } }
  if(k==="Aurora"){ const A=a*(.55+.45*night);
    // the curtains are drawn into a small offscreen picture (half resolution, about 20 refreshes a second: they move slowly
    // and are soft, so nobody can tell) and added to the sky in one step. Drawing ~240 additive strips straight onto a
    // full-density screen every frame tripled the scene's cost on phones (2026-11-17 QC).
    const AU=wx3Sky.au||(wx3Sky.au={c:document.createElement('canvas'),t:-1,w:0,h:0}), q=.5, cw=Math.max(8,Math.ceil(W*q)), chh=Math.max(8,Math.ceil(hz*.62*q));
    if(AU.w!==cw||AU.h!==chh||Math.abs(t-AU.t)>.05){ if(AU.w!==cw||AU.h!==chh){ AU.c.width=cw; AU.c.height=chh; AU.w=cw; AU.h=chh; }
      AU.t=t; const o=AU.c.getContext('2d'); o.setTransform(1,0,0,1,0,0); o.clearRect(0,0,cw,chh); o.setTransform(q,0,0,q,0,0); o.globalCompositeOperation='lighter';
      const cs=['90,255,170','150,110,255','90,220,255'], sw=Math.max(4,W/80);
      for(let b=0;b<3;b++){ const y0=hz*(.18+b*.11);
        // one shared gradient per ribbon (light at the curtain's foot, fading up); each strip just moves and dims it
        const gr=o.createLinearGradient(0,y0+hz*.08,0,y0-hz*.24); gr.addColorStop(0,'rgba('+cs[b]+',0)'); gr.addColorStop(.25,'rgba('+cs[b]+',1)'); gr.addColorStop(1,'rgba('+cs[b]+',0)'); o.fillStyle=gr;
        for(let X=0;X<=W;X+=sw){ const dy=Math.sin(X*.006+t*.25+b*1.7)*hz*.06+Math.sin(X*.017+t*.5)*hz*.02; o.globalAlpha=.16+.12*Math.sin(X*.03+t*1.3+b*2); o.save(); o.translate(0,dy); o.fillRect(X,y0-hz*.24,sw+1,hz*.32); o.restore(); } } }
    g.save(); g.globalCompositeOperation='lighter'; g.globalAlpha=A; g.drawImage(AU.c,0,0,cw/q,chh/q); g.restore(); }
  if(k==='Blood Moon'){ const tint=g.createLinearGradient(0,0,0,hz); tint.addColorStop(0,'rgba(60,0,12,'+(.35*a)+')'); tint.addColorStop(1,'rgba(150,20,30,'+(.25*a)+')'); g.fillStyle=tint; g.fillRect(0,0,W,hz+1);
    const mx=W*.78, my=hz*.32, r=H*.06; v3glow(g,mx,my,r*5,'rgba(255,60,50,.9)',.35*a); g.save(); g.globalAlpha=a; const mg=g.createRadialGradient(mx-r*.3,my-r*.3,r*.1,mx,my,r); mg.addColorStop(0,'#ff8a6a'); mg.addColorStop(.7,'#d8302a'); mg.addColorStop(1,'#8a1018'); g.fillStyle=mg; g.beginPath(); g.arc(mx,my,r,0,7); g.fill();
    g.fillStyle='rgba(90,10,16,.35)'; for(const [dx,dy,rr] of [[-.3,-.1,.22],[.25,.2,.16],[.05,-.35,.12]]){ g.beginPath(); g.arc(mx+dx*r,my+dy*r,rr*r,0,7); g.fill(); } g.restore(); }
  if(k==='Gilded'){ const s=wx3sun(hz), A=a*(1-night*.8)*.14; if(s.up&&A>.01){ g.save(); g.globalCompositeOperation='lighter'; for(let i=0;i<7;i++){ const ang=Math.PI*.15+i*Math.PI*.1+Math.sin(t*.12+i)*.03, L=H*1.2, w=.05+(i%3)*.02; g.fillStyle='rgba(255,210,120,'+(A*(.6+.4*Math.sin(t*.6+i*1.7)))+')'; g.beginPath(); g.moveTo(s.x,s.y); g.lineTo(s.x+Math.cos(ang-w)*L,s.y+Math.sin(ang-w)*L); g.lineTo(s.x+Math.cos(ang+w)*L,s.y+Math.sin(ang+w)*L); g.closePath(); g.fill(); } g.restore(); } }
  if(k==='Storm'||k==='Rain'){ const A=a*(k==='Storm'?.55:.32); g.fillStyle=k==='Storm'?'rgba(40,46,56,'+A+')':'rgba(70,78,90,'+A+')';
    for(let i=0;i<6;i++){ const sp=k==='Storm'?.025:.012, cw=W*(.22+(i%3)*.08), cx=((i*.31+t*sp*(1+i%2*.4))%1.4)*W-W*.2, cy=hz*(.12+(i%3)*.14); g.beginPath(); g.ellipse(cx,cy,cw*.5,hz*.05,0,0,7); g.ellipse(cx+cw*.25,cy+hz*.02,cw*.35,hz*.045,0,0,7); g.ellipse(cx-cw*.28,cy+hz*.025,cw*.3,hz*.04,0,0,7); g.fill(); } }
}
for(const id in V3SCENES) m33wrap(id,'sky',function(P,t,hz){ wx3Sky(P,t,hz); });

// ---------- water layer: hooked into every scene's live step (after the land, before the dock and angler) ----------
function wx3Water(P,t,hz){ const k=wx3k(), a=wx3A(); if(a<.01) return; const night=P.night||0, FX=S.settings.effects, foam=mix(P.wTop||'#a8cfdf','#ffffff',.7);
  if((k==='Rain'||k==='Storm')&&FX){ const NM=Math.round((k==="Storm"?46:28)*gfxK()), N=Math.ceil(NM*a); g.strokeStyle=v3rgba(foam,.45); g.lineWidth=1;
    for(let i=0;i<N;i++){ const per=.55+(i%5)*.07, ph=(t/per+i*.618)%1, cyc=Math.floor(t/per+i*.618), r1=((Math.sin((cyc+i)*12.9898)*43758.5)%1+1)%1, r2=((Math.sin((cyc+i)*78.233)*12345.6)%1+1)%1;
      const y=hz+H*.02+Math.pow(r2,1.3)*(H-hz)*.95, u=(y-hz)/(H-hz), x=r1*W, rr=(1.5+ph*7)*(.4+u*1.2); g.globalAlpha=(1-ph)*.9*clamp(NM*a-i,0,1); /* each new ring fades in as the rain builds */ g.beginPath(); g.ellipse(x,y,rr,rr*.3,0,0,7); g.stroke(); }
    g.globalAlpha=1;
    const dg=g.createLinearGradient(0,hz,0,H); dg.addColorStop(0,'rgba(20,28,40,'+(a*(k==='Storm'?.22:.1))+')'); dg.addColorStop(1,'rgba(10,14,22,'+(a*(k==='Storm'?.3:.14))+')'); g.fillStyle=dg; g.fillRect(0,hz,W,H-hz);
    const mg=g.createLinearGradient(0,hz-H*.03,0,hz+H*.05); mg.addColorStop(0,'rgba(190,200,210,0)'); mg.addColorStop(.5,'rgba(190,200,210,'+(a*.22)+')'); mg.addColorStop(1,'rgba(190,200,210,0)'); g.fillStyle=mg; g.fillRect(0,hz-H*.03,W,H*.08); }
  if(k==='Storm'&&FX){ g.fillStyle=v3rgba('#e8f0f4',.4*a); for(let i=0,n=Math.round(20*gfxK());i<n;i++){ const y=hz+H*.03+Math.pow((i*.137)%1,1.4)*(H-hz)*.9, u=(y-hz)/(H-hz), x=((((i*97.3)%1000)/1000*W+t*W*(.03+u*.04))%(W*1.1))-W*.05, l=W*(.012+u*.03); g.globalAlpha=a*(.4+.4*Math.sin(t*2+i)); g.fillRect(x,y,l,Math.max(1,u*2.4)); } g.globalAlpha=1; }
  if(k==='Rainbow'){ const A=a*(1-night*.85)*.13; if(A>.01){ const cx=W*.62, cy=hz-H*.28+hz*0, R=H*.66, cols=['#ff4a4a','#ff9a3a','#ffe04a','#5ad86a','#4aa8ff','#5a5aff','#b05aff'], bw=H*.012; g.save(); g.beginPath(); g.rect(0,hz,W,H*.22); g.clip(); g.translate(0,hz*2); g.scale(1,-1); g.lineWidth=bw*1.2; for(let i=0;i<7;i++){ g.globalAlpha=A; g.strokeStyle=cols[i]; g.beginPath(); g.arc(cx,hz+H*.28,R-i*bw,Math.PI*1.04,Math.PI*1.96); g.stroke(); } g.restore(); }
    if(FX){ g.fillStyle='rgba(255,250,230,'+(.6*a*(1-night))+')'; for(let i=0;i<10;i++){ const x=W*((i*.173+t*.01)%1), y=hz+H*(.03+((i*37)%10)/40); if(Math.sin(t*3+i*2)>.6) g.fillRect(x,y,1.6,1.6); } } }
  if(k==="Aurora"){ const A=a*(.5+.5*night); g.save(); g.globalCompositeOperation='lighter'; for(let i=0;i<14;i++){ const x=W*((i*.071+Math.sin(t*.2+i)*.01)%1), y=hz+H*(.01+((i*13)%9)/80), cl=i%3===1?'150,110,255':'90,255,170'; g.fillStyle='rgba('+cl+','+(A*(.12+.1*Math.sin(t*1.5+i)))+')'; g.fillRect(x,y,W*(.03+(i%4)*.01),1.6); } g.restore(); }
  if(k==='Blood Moon'){ const mx=W*.78; g.save(); g.globalCompositeOperation='lighter'; for(let i=0;i<10;i++){ const y=hz+H*(.012+i*i*.006), w=W*(.012+i*.004)*(1+.2*Math.sin(t*2+i)); g.fillStyle='rgba(255,60,50,'+(a*.22*(1-i/10))+')'; g.fillRect(mx-w/2+Math.sin(t*1.3+i)*3,y,w,Math.max(1,H*.003)); } g.restore();
    const rg=g.createLinearGradient(0,hz,0,H); rg.addColorStop(0,'rgba(120,10,20,'+(a*.18)+')'); rg.addColorStop(1,'rgba(40,0,8,'+(a*.25)+')'); g.fillStyle=rg; g.fillRect(0,hz,W,H-hz); }
  if(k==='Gilded'){ const A=a*(1-night*.7); g.fillStyle='rgba(255,215,120,'+(A*.07)+')'; g.fillRect(0,hz,W,H-hz); if(FX){ for(let i=0;i<22;i++){ const x=W*((i*.113+t*.004*(1+i%3))%1), y=hz+H*(.02+((i*41)%30)/60), tw=Math.sin(t*4+i*1.7); if(tw>.3){ g.fillStyle='rgba(255,226,140,'+(A*.8*tw)+')'; g.fillRect(x,y,2+tw*2,1.4); } } } }
  if(k==='Fog'){ for(let i=0;i<5;i++){ const y=hz+H*(.01+i*.035), x=((i*.37+t*.006*(1+i*.3))%1.6)*W-W*.3, w=W*(.5+(i%2)*.2); const fg=g.createRadialGradient(x+w/2,y,0,x+w/2,y,w*.5); fg.addColorStop(0,'rgba(215,222,228,'+(a*.28)+')'); fg.addColorStop(1,'rgba(215,222,228,0)'); g.save(); g.translate(0,y); g.scale(1,.12); g.translate(0,-y); g.fillStyle=fg; g.fillRect(x,y-w*.5,w,w); g.restore(); } }
  if(k==='Spawning Run'&&FX){ g.strokeStyle=v3rgba(foam,.5); g.lineWidth=1; for(let i=0;i<12;i++){ const per=1.3+(i%4)*.3, ph=(t/per+i*.37)%1, cyc=Math.floor(t/per+i*.37), r1=((Math.sin((cyc+i*3)*12.9898)*43758.5)%1+1)%1, r2=((Math.sin((cyc+i*3)*78.233)*12345.6)%1+1)%1, y=hz+H*.04+r2*(H-hz)*.6, x=W*(.3+r1*.65), rr=3+ph*14; g.globalAlpha=a*(1-ph); g.beginPath(); g.ellipse(x,y,rr,rr*.3,0,0,7); g.stroke(); } g.globalAlpha=1; }
}
for(const id in V3SCENES) m33wrap(id,'live',function(P,t,hz){ wx3Water(P,t,hz); });

// ---------- top layer (over everything, under the HUD): replaces the old flat overlays ----------
const _drawWeatherX0_33 = drawWeatherX0;
drawWeatherX0 = function(t,wx,hz){ const k=wx.k;
  if(k==='Spawning Run') return _drawWeatherX0_33(t,wx,hz); // the leaping fish (the boil rings are on the water layer)
  if(k==='Blood Moon'){ const vg=g.createRadialGradient(W/2,H*.55,H*.25,W/2,H*.55,W*.75); vg.addColorStop(0,'rgba(80,0,10,0)'); vg.addColorStop(1,'rgba(80,0,10,.35)'); g.fillStyle=vg; g.fillRect(0,0,W,H); }
  if(k==='Fog'){ for(let i=0;i<3;i++){ const y=H*(.35+i*.2), x=((i*.43+t*.01*(1+i*.4))%1.8)*W-W*.4, w=W*.9; const fg=g.createRadialGradient(x+w/2,y,0,x+w/2,y,w*.5); fg.addColorStop(0,'rgba(220,226,232,.2)'); fg.addColorStop(1,'rgba(220,226,232,0)'); g.save(); g.translate(0,y); g.scale(1,.3); g.translate(0,-y); g.fillStyle=fg; g.fillRect(x,y-w*.5,w,w); g.restore(); } }
  if(k==='Storm'&&G.flash>.25&&S.loc!=='deep'){ const seed=Math.floor(performance.now()/9000), r=v3rng(seed*13+5), bx=W*(.4+r()*.5); g.strokeStyle='rgba(240,245,255,'+Math.min(1,G.flash*1.2)+')'; g.lineWidth=Math.max(1.4,H*.003); g.beginPath(); let X=bx, Y=0; g.moveTo(X,Y); const pts=[]; for(let i=0;i<7;i++){ X+=(r()-.5)*W*.035; Y+=hz*.14; g.lineTo(X,Y); pts.push([X,Y]); } g.stroke(); g.lineWidth=Math.max(.8,H*.0016); const [fx,fy]=pts[2]; g.beginPath(); g.moveTo(fx,fy); g.lineTo(fx+W*.025,fy+hz*.12); g.lineTo(fx+W*.03,fy+hz*.2); g.stroke(); }
};
