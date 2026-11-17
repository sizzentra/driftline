// =====================================================================
// 0.3.3 STARFALL SEA, the last water: a finale. Nebula clouds glowing behind the stars, a whale made of stars
// swimming slowly across the sky, a comet that crosses now and then, lanterns drifting up off the lake, and
// star-blossoms that open on the water. Everything eases in and out; nothing pops.
// =====================================================================
const SF3={};
m33wrap('starfall','sky',function(P,t,hz){ const night=P.night, vis=.35+night*.65;
  // nebula clouds: soft colour pools that breathe slowly
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
// on the lake: lanterns rising, star-blossoms opening and their light on the water
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

// ---------- mystical moments: every 18-40 s (the gap itself is random per cycle), one of five events plays ----------
function sfEvent(t){ let start=0, n=0; while(true){ const gap=18+((Math.sin(n*91.7)*43758.5)%1+1)%1*22; if(start+gap>t) break; start+=gap; n++; } const kind=Math.floor((((Math.sin(n*37.3)*12345.6)%1+1)%1)*5), into=t-start; return {kind,into,n}; }
const SF_DUR=7;
m33wrap('starfall','sky',function(P,t,hz){ const E=sfEvent(t); if(E.into>SF_DUR) return; const q=E.into/SF_DUR, a=Math.sin(q*Math.PI);
  if(E.kind===3){ // sky veil: a shimmering curtain unfurls high in the sky
    g.save(); g.globalCompositeOperation='lighter'; const cols=['160,120,255','90,220,255','255,140,220']; for(let b=0;b<3;b++){ const y0=hz*(.16+b*.07); for(let X=0;X<=W;X+=Math.max(4,W/90)){ const reveal=Math.min(1,Math.max(0,(q*1.6-X/W*.6)*2)), dy=Math.sin(X*.01+t*.6+b)*hz*.04, h=hz*(.1+.05*Math.sin(X*.02+t+b)); const al=.12*a*reveal*(.6+.4*Math.sin(X*.04+t*2)); g.fillStyle='rgba('+cols[b]+','+al+')'; g.fillRect(X,y0+dy-h,Math.max(4,W/90)+1,h); } } g.restore(); }
  if(E.kind===0){ // starfall shower: shooting stars raining into the lake
    for(let i=0;i<22;i++){ const st=i*.03, e=(q-st)/.35; if(e<0||e>1) continue; const x0=W*(.12+((i*.173)%.84)), X=x0+e*W*.08, Y=hz*.05+e*(hz*.95), L=H*.06; const gr=g.createLinearGradient(X,Y,X-L*.5,Y-L); gr.addColorStop(0,'rgba(255,255,255,'+(.9*(1-e*.3))+')'); gr.addColorStop(1,'rgba(200,190,255,0)'); g.strokeStyle=gr; g.lineWidth=2.2; g.beginPath(); g.moveTo(X,Y); g.lineTo(X-L*.5,Y-L); g.stroke(); } } });
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
// test: draw the frame at the moment a given event is halfway through
if(/[?&]test\b/.test(location.search)) window.__sfDraw=(kind,frac=.5)=>{ for(let t=100;t<20000;t+=.5){ const E=sfEvent(t); if(E.kind===kind&&Math.abs(E.into-SF_DUR*frac)<.3){ draw(t*1000); return t; } } return -1; };
// the leaping fish is one of Starfall's own species, chosen once
let SF_SP=null; function SF_FISH(){ if(!SF_SP){ const pool=SP.filter(s=>s.loc==='starfall'&&s.r>=2); SF_SP=pool[0]||SP.find(s=>s.loc==='starfall')||SP[0]; } return SF_SP; }
if(/[?&]test\b/.test(location.search)) window.__drawAt=tt=>draw(tt*1000);

// ---------- the fish constellation, drawn like a signature: one continuous flowing stroke through every star,
// quick on the straight runs and slowing into each turn, thicker where the pen slows, with a glowing pen tip;
// stars light as the pen passes them, the eye is dotted last, then it all glows a moment and fades ----------
const SIG={pts:null,key:''};
function starSignature(P,t,hz,sa){ const per=26, k=(t%per)/per, cx=W*.74, cy=hz*.2, sx=W*.07, sy=hz*.07, key=W+'|'+H+'|'+hz;
  const body=[[-1,0],[-.55,-.62],[.1,-.78],[.62,-.45],[1.15,-.85],[1,0],[1.15,.85],[.62,.45],[.1,.78],[-.55,.62],[-1,0]], eye=[-.55,-.18];
  if(SIG.key!==key){ // a smooth Catmull-Rom path through the stars, sampled finely, with "pen speed" slowed at the corners
    const C=body.map(p=>[cx+p[0]*sx,cy+p[1]*sy]), out=[]; for(let i=0;i<C.length-1;i++){ const p0=C[Math.max(0,i-1)], p1=C[i], p2=C[i+1], p3=C[Math.min(C.length-1,i+2)];
      for(let s=0;s<16;s++){ const u=s/16, u2=u*u, u3=u2*u; const f=(a,b,c,d)=>.5*((2*b)+(-a+c)*u+(2*a-5*b+4*c-d)*u2+(-a+3*b-3*c+d)*u3); out.push([f(p0[0],p1[0],p2[0],p3[0]),f(p0[1],p1[1],p2[1],p3[1]),i+u]); } }
    out.push([...C[C.length-1],C.length-1]);
    // time per sample: longer near each star (the pen slows into the turn), so progress feels hand-drawn
    let acc=0; const T=out.map((p,i)=>{ const near=Math.abs(p[2]-Math.round(p[2])); const d=i?Math.hypot(p[0]-out[i-1][0],p[1]-out[i-1][1]):0; acc+=d*(1+2.2*Math.exp(-near*near*40)); return acc; });
    SIG.pts=out.map((p,i)=>[p[0],p[1],T[i]/acc]); SIG.C=C; SIG.key=key; }
  const pts=SIG.pts, draw=1, dotK=1, fade=.78+.22*Math.sin(t*.35), a=fade*sa; /* always there, softly breathing (no drawing) */ if(a<.02) return;
  let n=0; while(n<pts.length-1&&pts[n+1][2]<=draw) n++;
  g.save(); g.lineCap='round'; g.lineJoin='round';
  // glow under the stroke, then the stroke itself with width following the pen's pace
  g.globalCompositeOperation='lighter'; g.strokeStyle=v3rgba(P.cry2,.12*a); g.lineWidth=7; g.beginPath(); for(let i=0;i<=n;i++){ const [x,y]=pts[i]; i?g.lineTo(x,y):g.moveTo(x,y); } g.stroke(); g.globalCompositeOperation='source-over';
  for(let i=1;i<=n;i++){ const [x0,y0,q0]=pts[i-1], [x1,y1,q1]=pts[i], d=Math.hypot(x1-x0,y1-y0)||1, pace=(q1-q0)/d*W*.07, w=Math.min(2.2,.7+pace*.9)*(i>n-6?1:1); g.strokeStyle=v3rgba(mix(P.cry2,'#ffffff',.35),.55*a); g.lineWidth=w; g.beginPath(); g.moveTo(x0,y0); g.lineTo(x1,y1); g.stroke(); }
  // stars light as the pen passes them
  SIG.C.forEach((p,i)=>{ const reached=pts.findIndex(q=>Math.round(q[0])===Math.round(p[0])&&Math.round(q[1])===Math.round(p[1])), at=reached>=0?pts[reached][2]:i/(SIG.C.length-1), fi=Math.min(1,Math.max(0,(draw-at)/.05)); if(fi<=0) return; const ai=a*v3s(fi)*(.65+.35*Math.sin(t*1.6+i*1.9)); v3glow(g,p[0],p[1],H*.026,'rgba(200,240,255,.9)',.7*ai); g.fillStyle=v3rgba('#ffffff',ai); g.beginPath(); g.arc(p[0],p[1],1.3*fi,0,7); g.fill(); });
  // the pen tip while signing
  if(draw<1){ const [x,y]=pts[n]; v3glow(g,x,y,H*.03,'rgba(225,245,255,.95)',.9*a); g.fillStyle=v3rgba('#ffffff',a); g.beginPath(); g.arc(x,y,1.7,0,7); g.fill(); }
  // the eye dotted last, with a little flare, then a brief glow over the whole figure
  if(dotK>0){ const X=cx+eye[0]*sx, Y=cy+eye[1]*sy; v3glow(g,X,Y,H*.03*(1+(1-dotK)),'rgba(230,248,255,.95)',.8*a*dotK); g.fillStyle=v3rgba('#ffffff',a*dotK); g.beginPath(); g.arc(X,Y,1.5,0,7); g.fill();
    const fl=0; if(fl>0) v3glow(g,cx+sx*.05,cy,sx*1.4,'rgba(170,220,255,.8)',.18*fl*a); }
  g.restore(); }

// ---------- the ringed planet, with more love: a soft atmosphere, curved cloud bands and a slow storm, a night side
// and a lit rim, a ring of several bands with a gap that casts its shadow on the planet, and two small moons that
// orbit it (passing behind and in front) ----------
function sfPlanet(P,t,hz){ const px=W*(W<600?.24:.2), py=hz*(W<600?.5:.32), R=H*(W<600?.055:.07), tilt=-.3, pl=P.planet, ring=P.ring;
  v3glow(g,px,py,R*2.2,v3rgba(mix(pl,'#ffffff',.3),.8),.22);
  const rings=[[2.25,.06,.35],[2.05,.09,.6],[1.82,.05,.25],[1.62,.1,.55]]; // radius, width, alpha (the 1.82 band is the faint gap)
  const ringHalf=(front)=>{ g.save(); g.translate(px,py); g.rotate(tilt); for(const [rr,w,a] of rings){ g.strokeStyle=v3rgba(rr===1.82?mix(ring,P.top,.5):ring,a*(front?1:.75)); g.lineWidth=R*w*1.6; g.beginPath(); g.ellipse(0,0,R*rr,R*rr*.22,0,front?0:Math.PI,front?Math.PI:Math.PI*2); g.stroke(); }
    if(front){ g.strokeStyle='rgba(255,255,255,.28)'; g.lineWidth=R*.03; g.beginPath(); g.ellipse(0,0,R*2.12,R*2.12*.22,0,Math.PI*.15,Math.PI*.7); g.stroke(); } g.restore(); };
  const moon=(i)=>{ const per=[46,71][i], a=t/per*Math.PI*2+i*2, ox=Math.cos(a)*R*(2.9+i*.7), oy=Math.sin(a)*R*(2.9+i*.7)*.22, cs=Math.cos(tilt), sn=Math.sin(tilt); return {x:px+ox*cs-oy*sn, y:py+ox*sn+oy*cs, front:Math.sin(a)>0, r:R*(.14+i*.06)}; };
  const drawMoon=m=>{ const mg=g.createRadialGradient(m.x-m.r*.4,m.y-m.r*.4,m.r*.1,m.x,m.y,m.r); mg.addColorStop(0,'#f4ecf8'); mg.addColorStop(1,mix('#a89ab8',P.top,.3)); g.fillStyle=mg; g.beginPath(); g.arc(m.x,m.y,m.r,0,7); g.fill(); };
  const ms=[moon(0),moon(1)]; ms.filter(m=>!m.front).forEach(drawMoon);
  ringHalf(false);
  g.save(); g.translate(px,py); g.rotate(tilt);
  const pg=g.createRadialGradient(-R*.4,-R*.45,R*.08,0,0,R); pg.addColorStop(0,mix(pl,'#ffffff',.4)); pg.addColorStop(.65,pl); pg.addColorStop(1,mix(pl,P.top,.45)); g.fillStyle=pg; g.beginPath(); g.arc(0,0,R,0,7); g.fill();
  g.save(); g.beginPath(); g.arc(0,0,R,0,7); g.clip();
  // curved cloud bands drifting at slightly different speeds
  for(let k=0;k<7;k++){ const y=-R*.85+k*R*.27, dr=Math.sin(t*.04*(1+k*.15)+k)*R*.05; g.fillStyle=v3rgba(k%2?mix(pl,'#8a4a3a',.45):mix(pl,'#fff0e0',.35),k%2?.32:.22); g.beginPath(); g.moveTo(-R,y+dr); g.quadraticCurveTo(0,y+R*.06+dr,R,y+dr); g.lineTo(R,y+R*.1+dr); g.quadraticCurveTo(0,y+R*.16+dr,-R,y+R*.1+dr); g.closePath(); g.fill(); }
  // a slow storm spot
  { const sx=((t*.006)%2-1)*R*1.2, sy=R*.22; g.fillStyle=v3rgba(mix(pl,'#c84a3a',.45),.55); g.beginPath(); g.ellipse(sx,sy,R*.17,R*.08,0,0,7); g.fill(); g.fillStyle=v3rgba(mix(pl,'#fff0e0',.4),.4); g.beginPath(); g.ellipse(sx-R*.03,sy-R*.02,R*.08,R*.03,0,0,7); g.fill(); }
  // the ring's shadow across the planet, and the night side
  g.fillStyle='rgba(20,10,40,.28)'; g.beginPath(); g.ellipse(0,R*.18,R*1.9,R*.07,0,0,7); g.fill();
  const ng=g.createLinearGradient(-R,-R,R*1.1,R*.9); ng.addColorStop(0,'rgba(0,0,0,0)'); ng.addColorStop(.55,'rgba(0,0,0,0)'); ng.addColorStop(1,v3rgba(P.top,.6)); g.fillStyle=ng; g.fillRect(-R,-R,R*2,R*2);
  g.restore();
  g.strokeStyle=v3rgba(mix(pl,'#ffffff',.6),.4); g.lineWidth=R*.04; g.beginPath(); g.arc(0,0,R*.98,Math.PI*1.05,Math.PI*1.65); g.stroke();
  g.restore();
  ringHalf(true);
  ms.filter(m=>m.front).forEach(drawMoon); }
