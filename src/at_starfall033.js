// =====================================================================
// 0.3.3 STARFALL SEA, the last water: a finale. Nebula clouds glowing behind the stars, a whale made of stars
// swimming slowly across the sky, a comet that crosses now and then, lanterns drifting up off the lake, and
// star-blossoms that open on the water. Everything eases in and out; nothing pops.
// =====================================================================
// on the lake: lanterns rising, star-blossoms opening and their light on the water

// ---------- mystical moments: every 18-40 s (the gap itself is random per cycle), one of five events plays ----------
function sfEvent(t){ let start=0, n=0; while(true){ const gap=18+((Math.sin(n*91.7)*43758.5)%1+1)%1*22; if(start+gap>t) break; start+=gap; n++; } const kind=Math.floor((((Math.sin(n*37.3)*12345.6)%1+1)%1)*5), into=t-start; return {kind,into,n}; }
const SF_DUR=7;
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
  /* the stroke never changes shape, so its ~160 pieces are drawn once into a stored picture (per size and color) and laid on with
     the breathing alpha; map standard rule 13, 2026-11-21: Starfall was the heaviest water, this was its biggest single cost */
  { const col=mix(P.cry2,'#ffffff',.35), sk=key+'|'+col+'|'+n, DP=Math.min(DPR||1,2); if(SIG.ck!==sk){ const pad=8, xs=pts.map(p=>p[0]), ys=pts.map(p=>p[1]), x0=Math.min(...xs)-pad, y0=Math.min(...ys)-pad, cw=Math.max(...xs)+pad-x0, chh=Math.max(...ys)+pad-y0;
      const c=SIG.cv||document.createElement('canvas'); c.width=Math.ceil(cw*DP); c.height=Math.ceil(chh*DP); const m=c.getContext('2d'); m.setTransform(DP,0,0,DP,-x0*DP,-y0*DP); m.lineCap='round'; m.lineJoin='round'; m.strokeStyle=v3rgba(col,.55);
      for(let i=1;i<=n;i++){ const [xa,ya,qa]=pts[i-1], [xb,yb,qb]=pts[i], d=Math.hypot(xb-xa,yb-ya)||1, pace=(qb-qa)/d*W*.07; m.lineWidth=Math.min(2.2,.7+pace*.9); m.beginPath(); m.moveTo(xa,ya); m.lineTo(xb,yb); m.stroke(); }
      SIG.cv=c; SIG.ck=sk; SIG.box=[x0,y0,cw,chh]; }
    g.globalAlpha=a; g.drawImage(SIG.cv,SIG.box[0],SIG.box[1],SIG.box[2],SIG.box[3]); g.globalAlpha=1; }
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
