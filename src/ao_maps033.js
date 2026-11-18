// =====================================================================
// 0.3.3 map love: every water gets a signature of its own and no empty corners.
// Each scene keeps what it had; the pieces below are layered on top:
//   land  : still pieces (drawn once into the cached scenery, with their own soft reflection)
//   live  : things that move (drawn every frame, kept small and cheap)
//   fore  : foreground along the bottom edge, which the float never reaches (waterY is above ~0.84H there)
// =====================================================================
const M33={};
// wrap one scene hook: the original first, then ours
function m33wrap(id,hook,fn){ const S0=V3SCENES[id]; if(!S0) return; const old=S0[hook]; S0[hook]=function(){ if(old) old.apply(this,arguments); if(!(W>8&&H>8)||window.__noExtras) return; /* never draw extras on a zero-size canvas (some loops step by a fraction of W) */ try{ fn.apply(this,arguments); }catch(e){ if(!M33.err){ M33.err=1; console.error(e); } } }; }
// a soft mirror of whatever pathFn draws, just under the horizon
function m33reflect(x,hz,depth,alpha,col,pathFn){ x.save(); x.beginPath(); x.rect(0,hz,W,depth); x.clip(); x.translate(0,hz*2); x.scale(1,-1); x.globalAlpha=alpha; x.fillStyle=col; pathFn(); x.fill(); x.restore(); }
const m33dot=(c,x,y,r,col)=>{ c.fillStyle=col; c.beginPath(); c.arc(x,y,r,0,7); c.fill(); };

// ---------------------------------------------------------------------
// SALTMARSH COAST: a cliffed headland with a fishing village on the left, a sailboat on the horizon,
// a seal basking on a rock, and tide-pool rocks with weed and a starfish in front
// ---------------------------------------------------------------------
M33.headland=(c,hz)=>{ c.beginPath(); c.moveTo(-2,hz+1); c.lineTo(-2,hz-H*.072); c.bezierCurveTo(W*.05,hz-H*.086,W*.12,hz-H*.07,W*.18,hz-H*.064); c.bezierCurveTo(W*.21,hz-H*.062,W*.235,hz-H*.058,W*.246,hz-H*.05); c.lineTo(W*.252,hz-H*.03); c.lineTo(W*.262,hz-H*.016); c.lineTo(W*.27,hz+1); c.closePath(); };
M33.houses=[[.04,.016,'#d8483a'],[.062,.02,'#3a6f9a'],[.086,.017,'#c8853a'],[.132,.019,'#4f8a4a'],[.155,.016,'#d8483a'],[.176,.018,'#7a5a9a']];
m33wrap('coast','land',function(x,P,hz){
  const farC=mix(P.far,P.grass,.35), rock=mix(P.stone,P.far,.35);
  // the headland: grassy top, a cliff face with strata dropping to the sea
  x.fillStyle=farC; M33.headland(x,hz); x.fill();
  x.save(); M33.headland(x,hz); x.clip();
  x.fillStyle=rock; x.beginPath(); x.moveTo(W*.2,hz-H*.058); x.lineTo(W*.246,hz-H*.05); x.lineTo(W*.252,hz-H*.03); x.lineTo(W*.262,hz-H*.016); x.lineTo(W*.27,hz+1); x.lineTo(W*.21,hz+1); x.quadraticCurveTo(W*.225,hz-H*.03,W*.2,hz-H*.058); x.fill();
  x.strokeStyle=v3rgba(mix(P.stoneD,P.far,.3),.6); x.lineWidth=1; for(let k=0;k<4;k++){ const y=hz-H*(.045-k*.011); x.beginPath(); x.moveTo(W*.214+k*W*.004,y); x.lineTo(W*.26,y+H*.004); x.stroke(); }
  const hg=x.createLinearGradient(0,hz-H*.09,0,hz); hg.addColorStop(0,v3rgba(P.rim,.18)); hg.addColorStop(1,v3rgba(P.farHaze,.45)); x.fillStyle=hg; x.fillRect(0,hz-H*.09,W*.28,H*.09);
  x.restore();
  m33village(x,P,hz);
  m33reflect(x,hz,H*.07,.22,mix(farC,P.wMid,.5),()=>M33.headland(x,hz));
});
m33wrap('coast','live',function(P,t,hz){ const night=P.night, d=P.d, FX=S.settings.effects;
  // village windows light up after dusk, flickering now and then
  const lit=clamp(night*1.3+d*.8,0,1); if(lit>.05){ for(let i=0;i<M33.houses.length;i++){ const [hx,hh]=M33.houses[i], X=W*hx, base=m33groundY(hz,W*hx+H*.015)+H*.002, w=H*.03, h=H*hh, ph=((t/7+i*.37)%5), on=ph<4?1:Math.max(0,Math.abs(ph-4.5)*2-.0); /* a window goes dark for a while and fades back, never popping */ const a=lit*Math.min(1,on);
      if(a<.02) continue; g.fillStyle=v3rgba('#ffd27a',.55*a); g.fillRect(X+w*.18,base-h*.62,w*.2,h*.3); if(i%2) g.fillRect(X+w*.62,base-h*.62,w*.2,h*.3); v3glow(g,X+w*.4,base-h*.5,H*.02,'rgba(255,200,110,.9)',.18*a); } }
  // a sailboat crossing slowly along the horizon, rocking, its sail catching the light
  { const per=140, k=((t+40)%per)/per, bx=W*(-.08+k*1.16), by=hz+H*.01, s=H*.0042, rk=Math.sin(t*1.1)*.06;
    g.save(); g.translate(bx,by); g.rotate(rk); const hullC=mix('#7a3a2a',P.wMid,.25+night*.4), sailC=mix('#f8f2e4',P.top,night*.75);
    g.fillStyle=hullC; g.beginPath(); g.moveTo(-s*7,-s*.4); g.lineTo(s*7,-s*.4); g.lineTo(s*5,s*1.8); g.lineTo(-s*5.4,s*1.8); g.closePath(); g.fill();
    g.fillStyle=mix(P.wood||'#5a3a2a',P.wMid,.3); g.fillRect(-s*.4,-s*12,s*.6,s*11.6);
    g.fillStyle=sailC; g.beginPath(); g.moveTo(s*.4,-s*11.6); g.quadraticCurveTo(s*5.6,-s*6,s*5.2,-s*1.2); g.lineTo(s*.4,-s*1.2); g.closePath(); g.fill();
    g.beginPath(); g.moveTo(-s*.4,-s*10); g.quadraticCurveTo(-s*4,-s*5,-s*4.6,-s*1.4); g.lineTo(-s*.4,-s*1.4); g.closePath(); g.fill();
    g.fillStyle=v3rgba(P.rim,.35+d*.3); g.beginPath(); g.moveTo(s*.6,-s*11); g.quadraticCurveTo(s*3.2,-s*7,s*3,-s*2); g.lineTo(s*.6,-s*2); g.closePath(); g.fill();
    if(lit>.2) m33dot(g,s*.1,-s*12.2,s*.6,v3rgba('#ffe8a0',lit));
    g.restore(); g.save(); g.globalAlpha=.18; g.fillStyle=sailC; g.beginPath(); g.moveTo(bx+s*.4,by+s*3); g.lineTo(bx+s*4.6,by+s*3); g.lineTo(bx+s*.4,by+s*9); g.closePath(); g.fill(); g.restore(); }
  // a seal hauled out on a rock, lifting its head now and then; the swell foams round the rock
  { const rx=W*.62, ry=hz+H*.105, rw=W*.044, rh=H*.021, lift=Math.max(0,Math.sin(t*.55))**6;
    g.fillStyle=mix(P.stoneD,P.wMid,.25); g.beginPath(); g.moveTo(rx-rw,ry); g.quadraticCurveTo(rx-rw*.7,ry-rh*1.2,rx,ry-rh*1.3); g.quadraticCurveTo(rx+rw*.8,ry-rh*1.1,rx+rw,ry); g.closePath(); g.fill();
    g.fillStyle=v3rgba(P.rim,.25+d*.2); g.beginPath(); g.moveTo(rx-rw*.5,ry-rh*1.05); g.quadraticCurveTo(rx,ry-rh*1.35,rx+rw*.4,ry-rh*1.15); g.lineTo(rx+rw*.3,ry-rh*1); g.quadraticCurveTo(rx,ry-rh*1.15,rx-rw*.5,ry-rh*.9); g.fill();
    const sc=mix('#6a6a72',P.wBot,night*.5), sb=mix('#9a948a',P.wBot,night*.5), hx=rx+rw*.5, hy=ry-rh*1.55-lift*H*.006;
    g.fillStyle=sc; g.beginPath(); g.ellipse(rx-rw*.05,ry-rh*1.45,rw*.5,rh*.42,-.05,0,7); g.fill();
    g.beginPath(); g.ellipse(hx,hy,rw*.16,rh*.36,-.3-lift*.4,0,7); g.fill(); g.fillStyle=sb; g.beginPath(); g.ellipse(rx,ry-rh*1.3,rw*.36,rh*.18,0,0,7); g.fill();
    m33dot(g,hx+rw*.08,hy-rh*.12,Math.max(.6,rw*.025),'#14141a');
    g.beginPath(); g.moveTo(rx-rw*.55,ry-rh*1.5); g.lineTo(rx-rw*.78,ry-rh*1.85); g.lineTo(rx-rw*.72,ry-rh*1.3); g.fillStyle=sc; g.fill();
    if(FX){ const k=(t*.6)%1; g.strokeStyle=v3rgba(mix(P.wTop,'#ffffff',.7),.55*(1-k)); g.lineWidth=1.2; g.beginPath(); g.ellipse(rx,ry+1,rw*(1.05+k*.5),rh*(.35+k*.25),0,0,7); g.stroke(); } }
  // surf foaming along the foot of the cliff
  if(FX){ for(let i=0;i<9;i++){ const q=((t*.45+i*.11)%1), X=W*(.205+i*.007), y=hz+H*.002; g.fillStyle=v3rgba(mix(P.wTop,"#ffffff",.75),.55*Math.sin(q*Math.PI)); g.beginPath(); g.ellipse(X,y-q*H*.004,W*.004*(1+q),H*.0018,0,0,7); g.fill(); } }
});
m33wrap('coast','fore',function(P,t){ const b=H+2, sh=mix(P.stone,P.wBot,.2+P.night*.3), dk=mix(P.stoneD,P.wBot,.2+P.night*.3);
  // tide-pool rocks: two boulders, weed, a starfish, and the water washing in and out between them
  const X0=W*.54; for(const [ox,w,h] of [[0,.09,.1],[.09,.065,.07],[.15,.045,.045]]){ const x0=X0+W*ox, ww=W*w, hh=H*h; g.fillStyle=dk; g.beginPath(); g.moveTo(x0,b); g.quadraticCurveTo(x0+ww*.05,b-hh*.9,x0+ww*.45,b-hh); g.quadraticCurveTo(x0+ww*.95,b-hh*.85,x0+ww,b); g.closePath(); g.fill();
    g.fillStyle=sh; g.beginPath(); g.moveTo(x0+ww*.15,b-hh*.62); g.quadraticCurveTo(x0+ww*.42,b-hh*1.02,x0+ww*.8,b-hh*.7); g.quadraticCurveTo(x0+ww*.45,b-hh*.78,x0+ww*.15,b-hh*.62); g.fill(); }
  g.strokeStyle=mix('#4a7a3a',P.wBot,.2+P.night*.4); g.lineWidth=Math.max(1.2,H*.003); for(let i=0;i<6;i++){ const wx=X0+W*(.01+i*.012), sw=Math.sin(t*1.4+i)*H*.006; g.beginPath(); g.moveTo(wx,b-H*.01); g.quadraticCurveTo(wx+sw,b-H*.035,wx+sw*1.6,b-H*.05-((i*7)%3)*H*.006); g.stroke(); }
  { const sx=X0+W*.088, sy=b-H*.042, r=H*.011; g.fillStyle=mix('#e8703a',P.wBot,P.night*.5); g.beginPath(); for(let i=0;i<10;i++){ const a=-Math.PI/2+i*Math.PI/5, rr=i%2?r*.42:r; g.lineTo(sx+Math.cos(a)*rr,sy+Math.sin(a)*rr); } g.closePath(); g.fill(); }
  const k=.5+.5*Math.sin(t*.8); g.fillStyle=v3rgba(mix(P.wTop,'#ffffff',.6),.35+k*.2); g.beginPath(); g.ellipse(X0+W*.072,b-H*.006,W*.02*(.7+k*.3),H*.006,0,0,7); g.fill();
});

// ---------------------------------------------------------------------
// OPEN SHELF: a far island with a sea arch, a whale that surfaces and blows, drifting kelp with a
// gull riding it, and a big swell rolling in along the bottom
// ---------------------------------------------------------------------
M33.island=(c,hz)=>{ const x0=W*.3; c.beginPath(); c.moveTo(x0,hz+1); c.bezierCurveTo(x0+W*.015,hz-H*.02,x0+W*.03,hz-H*.042,x0+W*.06,hz-H*.046); c.bezierCurveTo(x0+W*.085,hz-H*.048,x0+W*.1,hz-H*.03,x0+W*.11,hz-H*.024); c.lineTo(x0+W*.118,hz-H*.024); c.bezierCurveTo(x0+W*.124,hz-H*.03,x0+W*.13,hz-H*.03,x0+W*.134,hz-H*.022); c.lineTo(x0+W*.14,hz+1); c.closePath(); };
m33wrap('shelf','land',function(x,P,hz){ const ic=mix(mix(P.far,'#4a6a5a',.45),P.farHaze,.2), x0=W*.3;
  x.fillStyle=ic; M33.island(x,hz); x.fill();
  // the sea arch at the island's end: sky shows through it
  x.save(); x.globalCompositeOperation='destination-out'; x.beginPath(); x.ellipse(x0+W*.122,hz-H*.004,W*.006,H*.014,0,Math.PI,0); x.rect(x0+W*.116,hz-H*.004,W*.012,H*.006); x.fill(); x.restore();
  x.fillStyle=v3rgba(P.rim,.2+P.d*.2); x.beginPath(); x.moveTo(x0+W*.03,hz-H*.04); x.quadraticCurveTo(x0+W*.06,hz-H*.05,x0+W*.09,hz-H*.04); x.lineTo(x0+W*.088,hz-H*.037); x.quadraticCurveTo(x0+W*.06,hz-H*.045,x0+W*.032,hz-H*.037); x.fill();
  // a few trees on the ridge
  x.fillStyle=mix(ic,'#1a2a30',.25); for(const [tx,th] of [[.035,.016],[.045,.02],[.062,.018],[.078,.014]]){ const X=x0+W*tx, base=hz-H*.044+Math.abs(tx-.06)*H*.25; x.beginPath(); x.moveTo(X-H*.005,base); x.lineTo(X,base-H*th); x.lineTo(X+H*.005,base); x.closePath(); x.fill(); }
  m33reflect(x,hz,H*.05,.2,mix(ic,P.wMid,.5),()=>M33.island(x,hz));
});
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
m33wrap('shelf','fore',function(P,t){ // a big swell rolling along the bottom edge, its crest feathering into spray
  const b=H+2, base=H*.955, SK=1+seaStormK()*1.2, foam=mix(P.wTop,'#ffffff',.75);
  const sg=g.createLinearGradient(0,base-H*.04,0,b); sg.addColorStop(0,v3rgba(mix(P.wMid,P.wTop,.45),.7)); sg.addColorStop(1,v3rgba(P.wMid,.25)); g.fillStyle=sg; g.beginPath(); g.moveTo(-8,b); for(let X=-8;X<=W+8;X+=10){ const y=base-Math.sin(X/W*7+t*.8)*H*.012*SK-Math.max(0,Math.sin(X/W*3.1-t*.35))*H*.02*SK; g.lineTo(X,y); } g.lineTo(W+8,b); g.closePath(); g.fill();
  g.strokeStyle=v3rgba(foam,.55); g.lineWidth=Math.max(1.4,H*.003); g.beginPath(); for(let X=-8;X<=W+8;X+=10){ const y=base-Math.sin(X/W*7+t*.8)*H*.012*SK-Math.max(0,Math.sin(X/W*3.1-t*.35))*H*.02*SK; X===-8?g.moveTo(X,y):g.lineTo(X,y); } g.stroke();
  if(S.settings.effects){ g.fillStyle=v3rgba(foam,.5); for(let i=0;i<14;i++){ const X=W*(((i*.071+t*.01)%1)), y=base-Math.sin(X/W*7+t*.8)*H*.012*SK-Math.max(0,Math.sin(X/W*3.1-t*.35))*H*.02*SK, k=(t*1.3+i*.37)%1; g.fillRect(X,y-k*H*.02,1.6,1.6); } }
});

// ---------------------------------------------------------------------
// MIDNIGHT DEEP: a far rock pillar taking the spray, a cargo ship pitching on the horizon with its
// lights on, lightning you can actually see, and whitecaps on every crest
// ---------------------------------------------------------------------
M33.pillar=(c,hz)=>{ const x0=W*.33; c.beginPath(); c.moveTo(x0,hz+1); c.lineTo(x0+W*.004,hz-H*.05); c.lineTo(x0+W*.012,hz-H*.062); c.lineTo(x0+W*.022,hz-H*.056); c.lineTo(x0+W*.028,hz-H*.03); c.lineTo(x0+W*.034,hz+1); c.closePath(); };
m33wrap('deep','land',function(x,P,hz){ const pc=mix(P.far,'#1a2028',.25); x.fillStyle=pc; M33.pillar(x,hz); x.fill(); x.fillStyle=v3rgba(P.rim,.15); x.fillRect(W*.335,hz-H*.05,W*.004,H*.045); m33reflect(x,hz,H*.04,.18,mix(pc,P.wMid,.5),()=>M33.pillar(x,hz)); });
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
m33wrap('deep','fore',function(P,t){ const b=H+2, base=H*.95, SK=1+seaStormK()*1.4, c=mix(P.wMid,P.wBot,.3);
  const dg=g.createLinearGradient(0,base-H*.04,0,b); dg.addColorStop(0,v3rgba(c,.75)); dg.addColorStop(1,v3rgba(c,.3)); g.fillStyle=dg; g.beginPath(); g.moveTo(-8,b); for(let X=-8;X<=W+8;X+=10) g.lineTo(X,base-Math.abs(Math.sin(X/W*5-t*(.9+SK*.15)))*H*.03*SK); g.lineTo(W+8,b); g.closePath(); g.fill();
  g.strokeStyle='rgba(232,240,244,.6)'; g.lineWidth=Math.max(1.4,H*.003); g.beginPath(); for(let X=-8;X<=W+8;X+=10){ const y=base-Math.abs(Math.sin(X/W*5-t*(.9+SK*.15)))*H*.03*SK; X===-8?g.moveTo(X,y):g.lineTo(X,y); } g.stroke();
});

// ---------------------------------------------------------------------
// FROSTBITE LAKE: an ice-fishing camp on the far ice (two tents, tip-up flags, a snowman), smoke from a
// tent stove, and the ice shelf you stand on gets layers, trapped bubbles and a fish frozen in the ice
// ---------------------------------------------------------------------
m33wrap('frost','land',function(x,P,hz){ const ib=hz+H*.018;
  for(const [tx,col] of [[.36,'#d8703a'],[.42,'#4f8a6a']]){ const X=W*tx, w=H*.034, h=H*.028; x.fillStyle=mix(col,P.farHaze,.15+P.night*.5); x.beginPath(); x.moveTo(X-w,ib); x.lineTo(X,ib-h); x.lineTo(X+w,ib); x.closePath(); x.fill();
    x.fillStyle='rgba(0,0,0,.22)'; x.beginPath(); x.moveTo(X,ib-h); x.lineTo(X+w,ib); x.lineTo(X+w*.1,ib); x.closePath(); x.fill(); x.fillStyle=mix('#1a1a2a',P.farHaze,.3); x.beginPath(); x.moveTo(X-w*.18,ib); x.lineTo(X,ib-h*.45); x.lineTo(X+w*.18,ib); x.closePath(); x.fill();
    x.fillStyle=P.snow; x.beginPath(); x.ellipse(X,ib,w*1.2,H*.003,0,Math.PI,0); x.fill(); }
  { const X=W*.475, b=ib, r=H*.008; x.fillStyle=P.snow; m33dot(x,X,b-r,r*1.1,P.snow); m33dot(x,X,b-r*2.6,r*.8,P.snow); m33dot(x,X,b-r*3.8,r*.6,P.snow); x.fillStyle=mix('#e8703a',P.farHaze,.2); x.fillRect(X+r*.4,b-r*3.9,r*.7,r*.25); x.strokeStyle=mix('#5a3a2a',P.farHaze,.3); x.lineWidth=1; x.beginPath(); x.moveTo(X-r*.7,b-r*2.6); x.lineTo(X-r*1.8,b-r*3.3); x.stroke(); x.fillStyle=mix('#c8343a',P.farHaze,.2); x.fillRect(X-r*.8,b-r*3.3,r*1.6,r*.35); }
});
m33wrap('frost','live',function(P,t,hz){ const ib=hz+H*.018, FX=S.settings.effects;
  // tip-up flags: one pops up now and then (a fish!) and goes down again
  for(let i=0;i<3;i++){ const X=W*(.31+i*.07), q=((t+i*7)%17), raw=q<.3?q/.3:q<2.2?1:q<2.5?1-(q-2.2)/.3:0, u=raw*raw*(3-2*raw), up=u>.5, h=H*.018; /* the flag swings up and back down smoothly */ g.strokeStyle=mix('#5a4a3a',P.farHaze,.3); g.lineWidth=1; g.beginPath(); g.moveTo(X,ib); g.lineTo(X+h*.8*(1-u),ib-h*(.3+.7*u)); g.stroke();
    g.fillStyle=mix('#ff5a3a',P.farHaze,P.night*.5); { const tx=X+h*.8*(1-u), ty=ib-h*(.3+.7*u); g.beginPath(); g.moveTo(tx,ty); g.lineTo(tx+h*.5,ty+h*.15); g.lineTo(tx,ty+h*.3); g.closePath(); g.fill(); } m33dot(g,X,ib,1.2,mix('#1a2a3a',P.farHaze,.3)); }
  if(FX){ const X=W*.42+H*.01; for(let i=0;i<5;i++){ const k=((t*.15+i/5)%1); g.fillStyle=v3rgba(mix('#e8e8f0',P.farHaze,.3),.35*(1-k)); g.beginPath(); g.arc(X+k*W*.02,ib-H*.03-k*H*.06,H*(.003+k*.008),0,7); g.fill(); } }
  const lit=clamp(P.night*1.3+P.d*.8,0,1); if(lit>.1){ v3glow(g,W*.36,ib-H*.01,H*.03,'rgba(255,190,110,.9)',.4*lit); v3glow(g,W*.42,ib-H*.01,H*.025,'rgba(255,190,110,.9)',.3*lit); }
});
// the ice shelf you stand on: layered blues, trapped bubbles and a fish frozen mid-swim
const _v3icePlat_33 = v3icePlat;
v3icePlat = function(P,t,night,dockY){ _v3icePlat_33(P,t,night,dockY); if(!(W>8&&H>8)) return;
  const PW=W*.19, ed=PW+W*.012, path=()=>{ g.beginPath(); g.moveTo(-2,dockY+H*.01); g.lineTo(ed-W*.01,dockY+H*.01); g.lineTo(ed,dockY+H*.02); g.lineTo(ed+W*.006,H*.78); g.lineTo(ed-W*.004,H+2); g.lineTo(-2,H+2); g.closePath(); }, N=c=>mix(c,'#0a1020',night*.4);
  g.save(); path(); g.clip();
  for(let k=0;k<4;k++){ const y=dockY+H*(.06+k*.07); g.fillStyle=v3rgba(k%2?P.iceD:mix(P.ice,'#ffffff',.3),.16); g.beginPath(); g.moveTo(-2,y); g.quadraticCurveTo(PW*.5,y+H*.012*Math.sin(k*2.1),ed+W*.01,y-H*.004); g.lineTo(ed+W*.01,y+H*.03); g.quadraticCurveTo(PW*.5,y+H*.04,-2,y+H*.028); g.closePath(); g.fill(); }
  const r=v3rng(19); g.strokeStyle=v3rgba('#ffffff',.35); g.lineWidth=.8; for(let i=0;i<16;i++){ const bx=r()*PW, by=dockY+H*(.04+r()*.3), br=1+r()*2.4; g.beginPath(); g.arc(bx,by,br,0,7); g.stroke(); }
  // the frozen fish, slightly blurred by the ice
  { const fx=PW*.42, fy=dockY+H*.17, s=H*.022; g.save(); g.globalAlpha=.55; g.translate(fx,fy); g.rotate(-.12); g.fillStyle=N('#5a7a9a'); g.beginPath(); g.ellipse(0,0,s*1.6,s*.6,0,0,7); g.fill(); g.beginPath(); g.moveTo(-s*1.4,0); g.lineTo(-s*2.3,-s*.6); g.lineTo(-s*2.3,s*.6); g.closePath(); g.fill(); g.fillStyle=N('#c8d8e8'); g.beginPath(); g.ellipse(s*.2,s*.2,s*1.1,s*.25,0,0,7); g.fill(); m33dot(g,s*1.05,-s*.12,s*.14,'#1a2030'); g.restore();
    g.fillStyle=v3rgba('#ffffff',.18); g.beginPath(); g.ellipse(fx,fy,s*2.8,s*1.2,-.12,0,7); g.fill(); }
  // a hairline crack running down from the lip
  g.strokeStyle=v3rgba('#ffffff',.4); g.lineWidth=.9; g.beginPath(); let X=PW*.7, Y=dockY+H*.01; g.moveTo(X,Y); for(let k=0;k<6;k++){ X+=(r()-.5)*W*.02; Y+=H*.03; g.lineTo(X,Y); } g.stroke();
  g.restore(); };
V3PLAT.ice=(P,t,night,dockY)=>v3icePlat(P,t,night,dockY);

// ---------------------------------------------------------------------
// EMBER SPRINGS: steaming lava islets with glowing cracks out on the lake, bubbling vents, and warm
// pumice stones bobbing in the foreground
// ---------------------------------------------------------------------
M33.islets=[[.38,.1,.05,.018],[.86,.19,.065,.024],[.6,.33,.04,.016]];
M33.islet=(c,hz,i)=>{ const [ix,iy,iw,ih]=M33.islets[i], X=W*ix, Y=hz+H*iy, w=W*iw, h=H*ih; c.beginPath(); c.moveTo(X-w,Y); c.lineTo(X-w*.7,Y-h*.7); c.lineTo(X-w*.3,Y-h); c.lineTo(X+w*.1,Y-h*.8); c.lineTo(X+w*.5,Y-h*1.05); c.lineTo(X+w*.85,Y-h*.5); c.lineTo(X+w,Y); c.closePath(); };
m33wrap('ember','land',function(x,P,hz){ for(let i=0;i<M33.islets.length;i++){ const [ix,iy,iw,ih]=M33.islets[i], X=W*ix, Y=hz+H*iy, w=W*iw, h=H*ih;
    x.fillStyle=mix(P.rockD,P.wMid,.15); M33.islet(x,hz,i); x.fill(); x.fillStyle=v3rgba(P.rim,.2); x.beginPath(); x.moveTo(X-w*.3,Y-h); x.lineTo(X+w*.1,Y-h*.8); x.lineTo(X+w*.5,Y-h*1.05); x.lineTo(X+w*.45,Y-h*.9); x.lineTo(X+w*.1,Y-h*.68); x.lineTo(X-w*.3,Y-h*.86); x.closePath(); x.fill();
    x.save(); x.beginPath(); x.rect(0,Y,W,h*1.4); x.clip(); x.translate(0,Y*2); x.scale(1,-1); x.globalAlpha=.25; x.fillStyle=mix(P.rockD,P.wMid,.4); M33.islet(x,hz,i); x.fill(); x.restore(); } });
m33wrap('ember','live',function(P,t,hz){ const FX=S.settings.effects, lava=P.lava||'#ff7a2a';
  for(let i=0;i<M33.islets.length;i++){ const [ix,iy,iw,ih]=M33.islets[i], X=W*ix, Y=hz+H*iy, w=W*iw, h=H*ih, p=.55+.45*Math.sin(t*1.2+i*2);
    g.strokeStyle=v3rgba(lava,.5+.4*p); g.lineWidth=Math.max(1,H*.0024); g.beginPath(); g.moveTo(X-w*.5,Y-h*.4); g.lineTo(X-w*.2,Y-h*.6); g.lineTo(X+w*.05,Y-h*.45); g.lineTo(X+w*.3,Y-h*.7); g.moveTo(X-w*.2,Y-h*.6); g.lineTo(X-w*.25,Y-h*.2); g.stroke();
    v3glow(g,X,Y-h*.5,w*.9,'rgba(255,130,50,.85)',.18*p);
    if(FX){ for(let k=0;k<5;k++){ const q=((t*.18+k/5+i*.3)%1), sx=X-w*.1+Math.sin(q*5+k)*w*.2+q*w*.3, sy=Y-h-q*H*.07, rr=H*(.004+q*.012); g.fillStyle=v3rgba(mix('#f0e8e0',P.farHaze,.3),.32*(1-q)); g.beginPath(); g.arc(sx,sy,rr,0,7); g.fill(); }
      const k=(t*.5+i*.31)%1; g.strokeStyle=v3rgba(mix(P.wTop,'#ffffff',.4),.4*(1-k)); g.lineWidth=1; g.beginPath(); g.ellipse(X,Y+1,w*(1+k*.5),H*(.004+k*.004),0,0,7); g.stroke(); } }
  // a bubbling vent out in open water
  if(FX){ const vx=W*.5, vy=hz+H*.22; for(let k=0;k<4;k++){ const q=((t*.8+k/4)%1); g.fillStyle=v3rgba(mix(P.wTop,'#ffffff',.5),.5*(1-q)); g.beginPath(); g.arc(vx+Math.sin(k*2.3)*W*.008,vy-q*H*.006,H*(.002+q*.003),0,7); g.fill(); } const k=(t*.4)%1; g.strokeStyle=v3rgba(lava,.3*(1-k)); g.beginPath(); g.ellipse(vx,vy,W*.012*(1+k*2),H*.003*(1+k*2),0,0,7); g.stroke(); }
});
m33wrap('ember','fore',function(P,t){ const b=H, c=mix(P.rock,P.wBot,.2);
  for(let i=0;i<5;i++){ const q=((i*.13+t*.004)%1), x=W*(.4+q*.4), fade=Math.min(1,q/.12,(1-q)/.12); if(fade<=0) continue; g.globalAlpha=fade; /* stones drift in and out softly */ const y=b-H*(.02+((i*7)%3)*.008)+Math.sin(t*1.2+i)*H*.003, r=H*(.008+((i*5)%3)*.003); g.fillStyle=c; g.beginPath(); g.ellipse(x,y,r*1.4,r,0,0,7); g.fill(); g.fillStyle=v3rgba(P.rim,.22); g.beginPath(); g.ellipse(x-r*.3,y-r*.4,r*.6,r*.3,0,0,7); g.fill(); m33dot(g,x+r*.4,y,r*.15,'rgba(0,0,0,.3)'); g.globalAlpha=1; }
});

// ---------------------------------------------------------------------
// STONEBROOK RIVER: a pair of otters that pop up and play (the moored rowboat now sits at the mill jetty, cc_river06.js)
// ---------------------------------------------------------------------
m33wrap('river','live',function(P,t,hz){ const night=P.night, FX=S.settings.effects;
  for(let i=0;i<2;i++){ const per=19, k=((t+i*2.5)%per)/per; if(k>.32) continue; const e=k/.32, up=Math.sin(e*Math.PI), x=W*(.25+i*.035)+e*W*.035, y=hz+H*(.17+i*.012) /* clear water between the dock and the first rock (they swam through it at .36-.44) */, s=H*.005, oc=mix('#5a3a24',P.wMid,.2+night*.5);
    g.save(); g.beginPath(); g.rect(0,0,W,y); g.clip(); g.fillStyle=oc; g.beginPath(); g.ellipse(x,y+s*2*(1-up),s*1.6,s*2.6*up+.1,.2,0,7); g.fill(); g.beginPath(); g.ellipse(x+s*.6,y-s*2.4*up+s*2*(1-up),s*1.5,s*1.2*up+.1,0,0,7); g.fill(); g.fillStyle=mix('#c8a880',P.wMid,.2+night*.5); g.beginPath(); g.ellipse(x+s*1.2,y-s*2*up+s*2*(1-up),s*.8,s*.6*up+.05,0,0,7); g.fill(); m33dot(g,x+s*1.1,y-s*2.9*up+s*2*(1-up),s*.28*up,'#14100c'); g.restore();
    if(FX){ g.strokeStyle=v3rgba(mix(P.wTop,'#ffffff',.6),.5*up); g.lineWidth=1; g.beginPath(); g.ellipse(x,y+1,s*(2.6+e*4),s*(.6+e*.8),0,0,7); g.stroke(); } }
});

// ---------------------------------------------------------------------
// MOONLIT TRENCH: drifting ribbons of glowing plankton that brighten where your float stirs the water
// ---------------------------------------------------------------------
m33wrap('trench','live',function(P,t,hz){ if(!S.settings.effects) return; const bio=P.bio||'#5af0d8', bio2=P.bio2||'#8a7aff';
  for(let r=0,R=gfxHigh()?4:3;r<R;r++){ const y0=hz+H*(.12+r*.11); for(let i=0,n=gfxHigh()?48:34;i<n;i++){ const u=i/n, x=((u*W*1.2+t*W*(.006+r*.003))%(W*1.2))-W*.1, y=y0+Math.sin(u*9+t*.6+r)*H*.012, near=Math.hypot(x-G.bob.x,y-G.bob.y)<H*.08?1:0, a=(.18+.25*Math.max(0,Math.sin(t*1.7+i*.9+r)))*(1+near*1.5);
      g.fillStyle=v3rgba(r%2?bio2:bio,Math.min(.9,a)); g.fillRect(x,y,1.6+near,1.6+near); } }
});

// ---------------------------------------------------------------------
// STARFALL SEA: the crystal you stand on gets inner facets, glowing veins, a fringe of moss and
// little shards hanging beneath it that sway and glint
// ---------------------------------------------------------------------
// the underside of the crystal slab at x (the bottom outline of the same points the slab uses)
function m33crystalEdge(X,PW,ed,dockY){ const B=[[-2,dockY+H*.12],[PW*.15,dockY+H*.15],[PW*.35,dockY+H*.24],[PW*.6,dockY+H*.17],[ed-W*.02,dockY+H*.08],[ed,dockY]]; for(let i=0;i<B.length-1;i++){ const [x0,y0]=B[i],[x1,y1]=B[i+1]; if(X>=x0&&X<=x1) return y0+(y1-y0)*(X-x0)/(x1-x0); } return dockY; }
const _v3crystalPlat_33 = v3crystalPlat;
v3crystalPlat = function(P,t,night,dockY){ if(!(W>8&&H>8)) return _v3crystalPlat_33(P,t,night,dockY); const PW=W*.19, ed=PW+W*.012, sa=.5+night*.5;
  // hanging shards first, so the slab sits over their roots
  for(const [hx,len,ph] of [[.2,.07,0],[.45,.1,1.3],[.75,.06,2.1],[.6,.045,3]]){ const X=PW*hx, top=m33crystalEdge(X,PW,ed,dockY)-H*.012, L=H*len, sw=Math.sin(t*.9+ph)*.04; g.save(); g.translate(X,top); g.rotate(sw); const cg=g.createLinearGradient(0,0,0,L); cg.addColorStop(0,mix(P.cry,'#ffffff',.2)); cg.addColorStop(1,v3rgba(P.cry2,.4)); g.fillStyle=cg; g.beginPath(); g.moveTo(-L*.12,0); g.lineTo(L*.12,0); g.lineTo(0,L); g.closePath(); g.fill(); g.fillStyle=v3rgba('#ffffff',.35); g.beginPath(); g.moveTo(-L*.04,0); g.lineTo(L*.02,0); g.lineTo(0,L*.8); g.closePath(); g.fill(); g.restore(); if(((t*.7+ph)%3)<.25) m33dot(g,X,top+L,1.6,v3rgba('#ffffff',.9)); }
  _v3crystalPlat_33(P,t,night,dockY);
  const pts=[[-2,dockY],[ed,dockY],[ed-W*.02,dockY+H*.08],[PW*.6,dockY+H*.17],[PW*.35,dockY+H*.24],[PW*.15,dockY+H*.15],[-2,dockY+H*.12]], path=()=>{ g.beginPath(); g.moveTo(pts[0][0],pts[0][1]); for(const p of pts) g.lineTo(p[0],p[1]); g.closePath(); };
  g.save(); path(); g.clip();
  // inner facets catching the light at different angles
  for(const [a,b2,c2,al] of [[[PW*.1,dockY],[PW*.25,dockY+H*.1],[-2,dockY+H*.08],.1],[[PW*.45,dockY],[PW*.5,dockY+H*.12],[PW*.3,dockY+H*.06],.12],[[ed-W*.02,dockY+H*.08],[PW*.72,dockY+H*.06],[PW*.6,dockY+H*.17],.08]]){ g.fillStyle=v3rgba('#ffffff',al); g.beginPath(); g.moveTo(a[0],a[1]); g.lineTo(b2[0],b2[1]); g.lineTo(c2[0],c2[1]); g.closePath(); g.fill(); }
  // glowing veins that pulse slowly
  const p=.5+.5*Math.sin(t*1.4); g.strokeStyle=v3rgba(P.cry2,.35+.35*p*sa); g.lineWidth=Math.max(1,H*.0022); g.beginPath(); g.moveTo(PW*.05,dockY+H*.03); g.lineTo(PW*.22,dockY+H*.08); g.lineTo(PW*.35,dockY+H*.2); g.moveTo(PW*.22,dockY+H*.08); g.lineTo(PW*.5,dockY+H*.07); g.lineTo(PW*.62,dockY+H*.14); g.moveTo(PW*.5,dockY+H*.07); g.lineTo(PW*.8,dockY+H*.03); g.stroke();
  g.restore(); v3glow(g,PW*.35,dockY+H*.12,H*.12,'rgba(150,230,255,.8)',.08+.08*p*sa);
  // a fringe of starlit moss along the top edge
  g.fillStyle=mix(P.isl||'#5a8a6a',P.wBot,night*.4); g.beginPath(); g.moveTo(-2,dockY+1); for(let X=0;X<=ed;X+=W*.006) g.lineTo(X,dockY+H*(.004+.004*Math.abs(Math.sin(X*.3)))); g.lineTo(ed,dockY+1); g.closePath(); g.fill();
};
V3PLAT.crystal=(P,t,night,dockY)=>v3crystalPlat(P,t,night,dockY);
// river leaves carried down the current, turning slowly, wrapping well off screen so they never pop
m33wrap('river','live',function(P,t,hz){ const lc=['#d8a03a','#c8603a','#8aa84a'];
  for(let i=0,n=gfxHigh()?9:6;i<n;i++){ const lane=hz+H*(.2+(i%6)*.1+(i>5?.05:0)), sp=.012+i*.004, x=W*((((i*.29+t*sp)%1.3)+1.3)%1.3-.15), y=lane+Math.sin(t*.9+i*2)*H*.006, s=H*(.006+(i%3)*.0015), r=t*.4+i;
    g.save(); g.translate(x,y); g.rotate(r); g.fillStyle=mix(lc[i%3],P.wMid,.2+P.night*.5); g.beginPath(); g.moveTo(-s*1.4,0); g.quadraticCurveTo(0,-s,s*1.4,0); g.quadraticCurveTo(0,s,-s*1.4,0); g.fill(); g.strokeStyle=v3rgba('#000000',.2); g.lineWidth=.6; g.beginPath(); g.moveTo(-s*1.2,0); g.lineTo(s*1.2,0); g.stroke(); g.restore();
    g.strokeStyle=v3rgba(mix(P.wTop,'#ffffff',.5),.25); g.lineWidth=.8; g.beginPath(); g.ellipse(x,y+1,s*2.2,s*.5,0,0,7); g.stroke(); } });

// ---------------------------------------------------------------------
// Brine Shelf dolphins, redone: each one shows first as a shadow just under the surface, breaks the water
// (only the part above the waterline is drawn), follows its arc nose-first, and re-enters with a splash;
// rings spread where it left and where it went back in. Nothing appears out of thin air.
// ---------------------------------------------------------------------
function m33dolphin(c,s,col,belly){ c.fillStyle=col; c.beginPath(); c.moveTo(-s*3.5,0); c.quadraticCurveTo(-s*1,-s*1.8,s*2.6,-s*.4); c.lineTo(s*3.8,-s*.2); c.lineTo(s*2.6,s*.3); c.quadraticCurveTo(0,s*1.2,-s*3.5,0); c.fill();
  c.beginPath(); c.moveTo(-s*.4,-s*1.1); c.lineTo(-s*1.4,-s*2.4); c.lineTo(s*.6,-s*1.2); c.fill(); c.beginPath(); c.moveTo(-s*3.3,0); c.lineTo(-s*4.6,-s*1); c.lineTo(-s*4.2,0); c.lineTo(-s*4.6,s*1); c.closePath(); c.fill();
  c.fillStyle=belly; c.beginPath(); c.moveTo(-s*2.5,s*.3); c.quadraticCurveTo(0,s*1.1,s*2.4,s*.3); c.quadraticCurveTo(0,s*.5,-s*2.5,s*.3); c.fill(); }
function m33dolphins(P,t,hz,foam,night){ const per=16, k=(t%per)/per, FX=S.settings.effects; if(k>.5) return;
  const col=mix('#6a7a8a',P.wMid,night*.5), belly=mix('#d8dce0',P.wMid,night*.5);
  for(let i=0;i<2;i++){ const base=hz+H*(.24+i*.05), s=H*.012, x0=W*(.44+i*.05), x1=x0+W*.16, span=x1-x0, lead=.12+i*.08;
    // phase: approach under water (shadow) -> leap -> re-enter -> rings
    const q=(k-i*.05)/.5; if(q<0||q>1) continue;
    if(q<lead){ const e=q/lead, a=Math.sin(e*Math.PI)*.22; g.save(); g.globalAlpha=a; g.translate(x0-W*.05+e*W*.05,base+s*1.6); g.scale(1,.45); m33dolphin(g,s,mix(P.wBot,'#000000',.2),mix(P.wBot,'#000000',.2)); g.restore(); continue; }
    const lq=(q-lead)/(.62-lead); // 0..1 through the leap
    if(lq<=1){ const x=x0+span*lq, arc=Math.sin(lq*Math.PI), y=base-arc*H*.055, slope=-Math.cos(lq*Math.PI)*H*.055*Math.PI/span, ang=Math.atan(slope);
      g.save(); g.beginPath(); g.rect(0,0,W,base+1); g.clip(); g.translate(x,y); g.rotate(ang); m33dolphin(g,s,col,belly); g.restore();
      // a soft darker band where the body passes through the surface
      if(arc<.35){ g.fillStyle=v3rgba(P.wBot,.25); g.beginPath(); g.ellipse(lq<.5?x0:x1,base+1,s*2.6,s*.5,0,0,7); g.fill(); }
      if(FX&&(lq<.16||lq>.84)){ const sx=lq<.5?x0:x1, e=lq<.5?lq/.16:(1-lq)/.16, pw=1-e; for(let j=0;j<7;j++){ const a=-Math.PI/2+(j-3)*.32, rr=s*(1.4+pw*2.4); g.fillStyle=v3rgba(foam,.75*(1-pw*.4)); g.beginPath(); g.arc(sx+Math.cos(a)*rr,base+Math.sin(a)*rr*1.3,Math.max(1,s*.18),0,7); g.fill(); } } }
    // rings spreading from both splash points
    for(const [sx,st] of [[x0,lead],[x1,.62]]){ const rq=(q-st)/.3; if(rq>0&&rq<1){ g.strokeStyle=v3rgba(foam,.5*(1-rq)); g.lineWidth=1.2; g.beginPath(); g.ellipse(sx,base+1,s*(1.5+rq*5),s*(.35+rq*1.1),0,0,7); g.stroke(); } } } }

// ---------- Starfall waterfalls: a ribbon that widens and shimmers as it falls, then lands properly in the cloud sea
// with billowing mist, droplets arcing out, spreading rings and a few glints
function m33fall(t,fx,fy,w,hz){ const FX=S.settings.effects, by=hz+H*.012, /* lands on the lake itself, in front of the cloud bank */ L=by-fy, w0=Math.max(1.4,w*.05), w1=w0*2.6;
  const fg=g.createLinearGradient(0,fy,0,by); fg.addColorStop(0,'rgba(255,255,255,.75)'); fg.addColorStop(.7,'rgba(235,240,255,.5)'); fg.addColorStop(1,'rgba(230,236,255,.15)');
  g.fillStyle=fg; g.beginPath(); g.moveTo(fx-w0/2,fy); g.lineTo(fx+w0/2,fy); g.quadraticCurveTo(fx+w0*.6,fy+L*.6,fx+w1/2,by); g.lineTo(fx-w1/2,by); g.quadraticCurveTo(fx-w0*.6,fy+L*.6,fx-w0/2,fy); g.closePath(); g.fill();
  // streaks flowing down the ribbon
  g.fillStyle='rgba(255,255,255,.55)'; for(let k=0;k<5;k++){ const q=((t*.9+k*.2)%1), y=fy+q*q*L, ww=w0+(w1-w0)*q; g.fillRect(fx-ww*.3+Math.sin(k*2.1)*ww*.2,y,Math.max(1,ww*.25),2+q*3); }
  // mist billowing up where it lands
  for(let k=0;k<6;k++){ const q=((t*.35+k/6)%1), mx=fx+Math.sin(k*1.9+t*.4)*w*.18*(.5+q), my=by-q*H*.05, r=H*(.012+q*.026); g.fillStyle="rgba(240,236,255,"+(.34*(1-q))+")"; g.beginPath(); g.arc(mx,my,r,0,7); g.fill(); }
  v3glow(g,fx,by,w*.6,'rgba(240,236,255,.9)',.25+.08*Math.sin(t*2.2));
  if(FX){ // droplets thrown out to both sides in little arcs
    g.fillStyle='rgba(255,255,255,.75)'; for(let k=0;k<10;k++){ const q=((t*1.4+k*.137)%1), sd=k%2?1:-1, dx=sd*(w*.06+q*w*(.16+(k%3)*.05)), dy=-Math.sin(q*Math.PI)*H*(.012+(k%4)*.004); g.globalAlpha=1-q; g.fillRect(fx+dx,by+dy,1.4,1.4); } g.globalAlpha=1;
    // rings spreading on the surface
    for(let k=0;k<3;k++){ const q=((t*.5+k/3)%1); g.strokeStyle='rgba(240,236,255,'+(.45*(1-q))+')'; g.lineWidth=1; g.beginPath(); g.ellipse(fx,by+1,w*(.08+q*.3),H*(.002+q*.006),0,0,7); g.stroke(); }
    // a glint now and then in the spray
    if(((t*.6)%1)<.12){ const gx=fx+Math.sin(t*3)*w*.1, gy=by-H*.012; g.fillStyle='rgba(255,255,255,.9)'; g.fillRect(gx-H*.006,gy,H*.012,1); g.fillRect(gx,gy-H*.006,1,H*.012); } } }

// ---------- Saltmarsh Coast village: the ground line of the headland (so houses stand on it), and the village itself ----------
function m33groundY(hz,X){ const segs=[[[-2,hz-H*.072],[W*.05,hz-H*.086],[W*.12,hz-H*.07],[W*.18,hz-H*.064]],[[W*.18,hz-H*.064],[W*.21,hz-H*.062],[W*.235,hz-H*.058],[W*.246,hz-H*.05]]];
  let px=null,py=null; for(const s of segs) for(let i=0;i<=24;i++){ const u=i/24, v=1-u, x=v*v*v*s[0][0]+3*v*v*u*s[1][0]+3*v*u*u*s[2][0]+u*u*u*s[3][0], y=v*v*v*s[0][1]+3*v*v*u*s[1][1]+3*v*u*u*s[2][1]+u*u*u*s[3][1];
    if(px!==null&&X>=px&&X<=x) return py+(y-py)*(X-px)/Math.max(.001,x-px); px=x; py=y; } return hz-H*.06; }
function m33village(x,P,hz){ const wall=mix(P.lh,P.farHaze,.22), wallS=mix(wall,P.far,.35), dark=mix(P.stoneD,P.farHaze,.15), green=mix(P.grass,P.far,.3), greenD=mix(green,'#0a1a10',.3);
  // fields on the hillside in a few greens, divided by hedgerows (clipped to the headland)
  x.save(); M33.headland(x,hz); x.clip(); const fr=v3rng(83);
  // soft bands of pasture following the slope, a hedgerow of little bushes between them
  for(let k=0;k<3;k++){ x.fillStyle=v3rgba(mix(green,k%2?'#c8b85a':'#7aa84a',.25),.35); x.beginPath(); x.moveTo(0,hz); for(let X=0;X<=W*.27;X+=W*.006) x.lineTo(X,m33groundY(hz,Math.min(X,W*.246))+H*(.01+k*.016)); x.lineTo(W*.27,hz); x.closePath(); x.fill(); }
  x.fillStyle=v3rgba(greenD,.7); for(let X=W*.01;X<W*.2;X+=W*.007){ const y=m33groundY(hz,X)+H*.018; x.beginPath(); x.arc(X,y,H*.0022,0,7); x.fill(); } x.restore();
  // the cliff face: cracks, darker crevices and tufts of grass clinging to ledges
  x.strokeStyle=v3rgba(mix(P.stoneD,'#000000',.2),.55); x.lineWidth=.8; for(const [a,b] of [[.222,.05],[.236,.044],[.249,.036],[.257,.024]]){ x.beginPath(); x.moveTo(W*a,hz-H*b); x.lineTo(W*a+W*.003,hz-H*(b-.012)); x.lineTo(W*a-W*.001,hz-H*(b-.022)); x.stroke(); }
  x.fillStyle=green; for(const [a,b] of [[.226,.046],[.244,.034],[.254,.02]]){ x.beginPath(); x.ellipse(W*a,hz-H*b,W*.004,H*.002,0,0,7); x.fill(); }
  // a stone quay at the cliff foot with two little boats moored to it
  { const qx=W*.262, qy=hz; x.fillStyle=mix(P.stone,P.farHaze,.25); x.fillRect(qx,qy-H*.006,W*.03,H*.006); x.fillStyle=v3rgba(mix(P.stoneD,'#000000',.2),.6); x.fillRect(qx,qy-H*.0015,W*.03,H*.0015);
    for(const [bx,col] of [[.276,'#c8483a'],[.292,'#3a6f9a']]){ const X=W*bx, s=H*.0028, cc=mix(col,P.farHaze,.25); x.fillStyle=cc; x.beginPath(); x.moveTo(X-s*3,qy-s*.8); x.lineTo(X+s*3,qy-s*.8); x.lineTo(X+s*2,qy+s*.4); x.lineTo(X-s*2.2,qy+s*.4); x.closePath(); x.fill(); x.fillStyle=mix(P.wood||'#5a3a2a',P.farHaze,.3); x.fillRect(X-.4,qy-s*5.5,.8,s*4.8); } }
  // a footpath winding along the ridge
  x.strokeStyle=v3rgba(mix(P.sand,P.farHaze,.3),.8); x.lineWidth=Math.max(1,H*.0025); x.beginPath(); for(let X=W*.02;X<=W*.2;X+=W*.004){ const y=m33groundY(hz,X)+H*.006+Math.sin(X/W*40)*H*.0015; X===W*.02?x.moveTo(X,y):x.lineTo(X,y); } x.stroke();
  // trees and bushes behind and between the houses
  for(const [tx,s] of [[.025,1],[.074,.8],[.112,1.1],[.145,.9],[.192,1.05]]){ const X=W*tx, g0=m33groundY(hz,X), r=H*.009*s; x.fillStyle=greenD; x.fillRect(X-.6,g0-r*1.6,1.2,r*1.6); x.fillStyle=green; x.beginPath(); x.arc(X,g0-r*1.9,r,0,7); x.arc(X-r*.7,g0-r*1.4,r*.75,0,7); x.arc(X+r*.7,g0-r*1.45,r*.7,0,7); x.fill(); x.fillStyle=v3rgba(P.rim,.2); x.beginPath(); x.arc(X+r*.3,g0-r*2.2,r*.45,0,7); x.fill(); }
  for(const [hx,hh,rc] of M33.houses){ const X=W*hx, w=H*.03, h=H*hh, gl=m33groundY(hz,X), gr=m33groundY(hz,X+w), base=Math.max(gl,gr)+H*.002, top=base-h, roofC=mix(rc,P.farHaze,.25+P.night*.35);
    // walls planted in the ground (a little foundation where the slope drops), lit front and shaded side
    x.fillStyle=wall; x.fillRect(X,top,w,base-top+H*.004); x.fillStyle=wallS; x.fillRect(X+w*.72,top,w*.28,base-top+H*.004);
    // roof with a lit slope, a darker slope and a ridge line; a chimney
    x.fillStyle=roofC; x.beginPath(); x.moveTo(X-w*.14,top+.3); x.lineTo(X+w*.42,top-w*.44); x.lineTo(X+w*1.14,top+.3); x.closePath(); x.fill();
    x.fillStyle=mix(roofC,'#000000',.22); x.beginPath(); x.moveTo(X+w*.42,top-w*.44); x.lineTo(X+w*1.14,top+.3); x.lineTo(X+w*.7,top+.3); x.closePath(); x.fill();
    x.strokeStyle=mix(roofC,'#ffffff',.25); x.lineWidth=.7; x.beginPath(); x.moveTo(X-w*.1,top); x.lineTo(X+w*.42,top-w*.42); x.stroke();
    x.fillStyle=mix(wall,P.stoneD,.4); x.fillRect(X+w*.66,top-w*.36,w*.12,w*.26);
    // a door and framed windows
    x.fillStyle=mix(rc,'#2a1a14',.45); x.fillRect(X+w*.42,base-h*.5,w*.18,h*.5); x.fillStyle=v3rgba(dark,.8); x.fillRect(X+w*.12,base-h*.68,w*.18,h*.26); if(w*.82<w) x.fillRect(X+w*.7,base-h*.68,w*.16,h*.26);
    x.strokeStyle=v3rgba(wall,.9); x.lineWidth=.5; x.beginPath(); x.moveTo(X+w*.21,base-h*.68); x.lineTo(X+w*.21,base-h*.42); x.stroke();
    // grass tufts at the foot so the house sits in the ground
    x.fillStyle=green; x.beginPath(); x.ellipse(X+w*.5,base+H*.002,w*.7,H*.003,0,0,7); x.fill(); }
  // the chapel: tower, belfry opening, slate spire with a cross
  { const X=W*.108, w=H*.022, base=m33groundY(hz,X+w/2)+H*.002, top=base-H*.05; x.fillStyle=wall; x.fillRect(X,top,w,base-top+H*.003); x.fillStyle=wallS; x.fillRect(X+w*.7,top,w*.3,base-top+H*.003);
    x.fillStyle=v3rgba(dark,.8); x.beginPath(); x.moveTo(X+w*.3,top+H*.012); x.lineTo(X+w*.3,top+H*.006); x.arc(X+w*.5,top+H*.006,w*.2,Math.PI,0); x.lineTo(X+w*.7,top+H*.012); x.closePath(); x.fill();
    x.fillStyle=mix('#7a8494',P.farHaze,.25); x.beginPath(); x.moveTo(X-1,top); x.lineTo(X+w/2,top-H*.036); x.lineTo(X+w+1,top); x.closePath(); x.fill(); x.fillStyle=mix('#5a6474',P.farHaze,.25); x.beginPath(); x.moveTo(X+w/2,top-H*.036); x.lineTo(X+w+1,top); x.lineTo(X+w*.55,top); x.closePath(); x.fill();
    x.strokeStyle=mix(P.stoneD,P.farHaze,.2); x.lineWidth=.8; x.beginPath(); x.moveTo(X+w/2,top-H*.036); x.lineTo(X+w/2,top-H*.046); x.moveTo(X+w/2-1.6,top-H*.042); x.lineTo(X+w/2+1.6,top-H*.042); x.stroke();
    x.fillStyle=green; x.beginPath(); x.ellipse(X+w/2,base+H*.002,w*.8,H*.003,0,0,7); x.fill(); } }
// the Starfall waterfalls are drawn over the scenery so they visibly pour past the cloud bank into the lake
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
