
// =====================================================================
// Driftline 0.3 scene renderer, style B2 "Glow Diorama".
// Active only in the preview build (window.DL_PREVIEW) or with ?v3 in the URL.
// Areas move over one at a time (V3SCENES); the rest keep the old renderer.
// Speed: everything that doesn't move (mountains, shores, cabin, water base,
// reflections) is drawn once into an offscreen canvas and reused until the
// size or the light changes; only living things are drawn every frame.
// =====================================================================
const V3ON = !!window.DL_PREVIEW || /[?&]v3\b/.test(location.search);
function v3rng(seed){ let s=(seed>>>0)||1; return ()=>{ s^=s<<13; s>>>=0; s^=s>>>17; s^=s<<5; s>>>=0; return s/4294967296; }; }
function v3noise(seed){ const r=v3rng(seed), p=Array.from({length:128},()=>r()); return x=>{ const i=Math.floor(x), f=x-i, u=f*f*(3-2*f); const a=p[((i%128)+128)%128], b=p[(((i+1)%128)+128)%128]; return a+(b-a)*u; }; }
const v3s = x => x*x*(3-2*x); // smoothstep

// ---------- palettes: day / dusk / night, blended by the game's clock ----------
const V3PAL = { pond: {
  day:  {top:'#4f86c9', mid:'#93bfe6', bot:'#f3e4ca', glow:'#fff3cc', far:'#90a5c8', farHaze:'#c9d6e6', snow:'#f4f7fc', hill:'#5f8a6c', back:'#456f5c', front:'#2c4a3e', bank:'#4f7a52', wTop:'#a8cfdf', wMid:'#5c94aa', wBot:'#22485c', rim:'#fff1c6', cabin:'#6a5440', roof:'#3e302a', leaf:'#7fae5c', leafHi:'#dcefa0', cloud:'#ffffff', cloudLit:'#fff4dc'},
  dusk: {top:'#20285a', mid:'#a4517f', bot:'#ffc184', glow:'#ffd890', far:'#9a6a9e', farHaze:'#e08a98', snow:'#f6d6e4', hill:'#5a3f78', back:'#3c2e64', front:'#262048', bank:'#3a3060', wTop:'#f29b88', wMid:'#7a4f86', wBot:'#1a2044', rim:'#ffc08a', cabin:'#3c2c50', roof:'#241c40', leaf:'#4f5e46', leafHi:'#ffbf8a', cloud:'#c26a8e', cloudLit:'#ffc69c'},
  night:{top:'#05091a', mid:'#111a3c', bot:'#27306a', glow:'#c8d4ff', far:'#283058', farHaze:'#3a4478', snow:'#8e98c6', hill:'#1a2042', back:'#141a36', front:'#0c1126', bank:'#121a34', wTop:'#2a346c', wMid:'#131b40', wBot:'#04060e', rim:'#9fb4ff', cabin:'#1e1c32', roof:'#100e20', leaf:'#1c2838', leafHi:'#6f80c8', cloud:'#2a3058', cloudLit:'#5a66a0'}
}};
function v3palette(id,night,dusk,gloom){
  const key=id+'|'+Math.round(night*16)+'|'+Math.round(dusk*10)+'|'+Math.round(gloom*6);
  if(v3palette.k===key) return v3palette.v;
  const P=V3PAL[id], d=clamp(dusk,0,1)*(1-night*.45), o={key};
  for(const k in P.day){ let c=mix(P.day[k],P.night[k],night); if(d>0) c=mix(c,P.dusk[k],d); if(gloom>0) c=mix(c,'#59616b',gloom*.6); o[k]=c; }
  o.d=d; o.night=night; o.gloom=gloom; v3palette.k=key; v3palette.v=o; return o;
}

// ---------- shared drawing pieces ----------
// a pine: trunk + 4 overlapping tiers with gently curved sides, optional rim light on the sun side
function v3pine(c,x,base,h,col,rim,rimA){
  const w=h*.42; c.fillStyle=col; c.fillRect(x-h*.025,base-h*.12,h*.05,h*.14);
  for(let i=0;i<4;i++){ const ty=base-h*.12-i*h*.2, tw=w*(1-i*.2), top=ty-h*.36;
    c.beginPath(); c.moveTo(x,top); c.quadraticCurveTo(x-tw*.35,ty-h*.12,x-tw/2,ty); c.quadraticCurveTo(x,ty-h*.05,x+tw/2,ty); c.quadraticCurveTo(x+tw*.35,ty-h*.12,x,top); c.fill();
    if(rim&&rimA>0){ c.save(); c.globalAlpha=rimA; c.strokeStyle=rim; c.lineWidth=Math.max(.8,h*.025); c.beginPath(); c.moveTo(x+tw*.04,top+h*.03); c.quadraticCurveTo(x+tw*.35,ty-h*.12,x+tw/2,ty); c.stroke(); c.restore(); } }
}
// a mountain range: ridged fractal crests shaped into a few massifs, every column shaded by its slope
// (faces turned to the light are lighter), snow that runs down into the gullies, haze at the foot
function v3range(c,o){
  const n=v3noise(o.seed), m=v3noise(o.seed+101), step=W>900?2:1.5, raw=[];
  for(let X=0;X<=W+step;X+=step){ const f=X/W;
    let env=0; for(const [c0,a,w0] of o.massifs){ const d=Math.abs(f-c0)/w0; env=Math.max(env,a*Math.exp(-d*2.3)); }
    const r=.55*(1-Math.abs(2*n(f*3+1.3)-1))+.3*(1-Math.abs(2*n(f*7+5.1)-1))+.15*n(f*16+9.7);
    raw.push(o.amp*(.06+env*(.72+.28*r)+.05*r)); }
  // a light smoothing pass keeps crests crisp but never jagged
  const cols=raw.map((h,i)=>o.base-((raw[i-1]??h)+h*2+(raw[i+1]??h))/4);
  const path=()=>{ c.beginPath(); c.moveTo(0,o.base); for(let i=0;i<cols.length;i++) c.lineTo(i*step,cols[i]); c.lineTo(W,o.base); c.closePath(); };
  const sl=i=>{ const a=cols[Math.max(0,i-4)], b=cols[Math.min(cols.length-1,i+4)]; return (b-a)/(8*step); };
  c.save(); path(); c.clip();
  for(let i=0;i<cols.length;i++){ const lit=clamp(.5+sl(i)*1.9,0,1);
    c.fillStyle=mix(o.shadow,o.light,lit); c.fillRect(i*step,cols[i],step+.6,o.base-cols[i]+1); }
  if(o.snow){ for(let i=0;i<cols.length;i++){ if(cols[i]>=o.snowLine) continue; const above=o.snowLine-cols[i];
      const depth=above*(.5+.45*m(i*step*.012))+above*.35*Math.max(0,m(i*step*.033+3)-.45);
      const lit=clamp(.5+sl(i)*1.9,0,1); c.fillStyle=mix(mix(o.snow,'#8088bc',.4),o.snow,lit); c.fillRect(i*step,cols[i],step+.6,depth); } }
  const hg=c.createLinearGradient(0,o.base-o.amp,0,o.base); hg.addColorStop(0,v3rgba(o.haze,0)); hg.addColorStop(.55,v3rgba(o.haze,o.hazeA*.35)); hg.addColorStop(1,v3rgba(o.haze,o.hazeA)); c.fillStyle=hg; c.fillRect(0,o.base-o.amp,W,o.amp+1);
  c.restore();
}
function v3glow(c,x,y,r,col,a){ const gr=c.createRadialGradient(x,y,0,x,y,r); gr.addColorStop(0,col); gr.addColorStop(1,'rgba(0,0,0,0)'); c.save(); c.globalAlpha=a; c.fillStyle=gr; c.fillRect(x-r,y-r,r*2,r*2); c.restore(); }
function v3rgba(hex,a){ const v=hex2rgb(rgb2hex(hex)); return 'rgba('+v[0]+','+v[1]+','+v[2]+','+a+')'; }

// ---------- offscreen cache for the still parts ----------
let V3CACHE=null;
function v3land(L,P,hz){
  const key=L.id+'|'+W+'|'+H+'|'+DPR+'|'+P.key;
  if(V3CACHE && V3CACHE.key===key) return V3CACHE.c;
  const c=(V3CACHE&&V3CACHE.c)||document.createElement('canvas'); c.width=Math.round(W*DPR); c.height=Math.round(H*DPR);
  const x=c.getContext('2d'); x.setTransform(DPR,0,0,DPR,0,0); x.clearRect(0,0,W,H);
  V3SCENES[L.id].land(x,P,hz,c);
  V3CACHE={key,c}; return c;
}

// =====================================================================
// WILLOW POND
// =====================================================================
const V3POND = {
  // still parts: mountains, hills, pine shores, cabin, willow bank, water base, reflections
  land(x,P,hz,cnv){
    // two mountain ranges: a tall far one with snow, a lower nearer one for depth
    v3range(x,{seed:11, base:hz+1, amp:.215*H, massifs:[[.29,1,.12],[.41,.78,.08],[.6,.55,.1],[.71,.92,.1],[.86,.62,.09]], light:mix(P.far,'#ffffff',.18), shadow:mix(P.far,'#1a1030',.32), haze:P.farHaze, snow:P.snow, snowLine:hz-.12*H, hazeA:.6});
    v3range(x,{seed:37, base:hz+1, amp:.085*H, massifs:[[.12,.8,.14],[.5,.6,.16],[.83,.75,.13]], light:mix(P.far,P.hill,.55), shadow:mix(mix(P.far,P.hill,.55),'#100a24',.3), haze:P.farHaze, snow:null, hazeA:.45});
    // mid hills: wide smooth curves
    x.fillStyle=P.hill; x.beginPath(); x.moveTo(0,hz+1); x.lineTo(0,hz-.035*H); x.bezierCurveTo(W*.16,hz-.07*H,W*.3,hz-.05*H,W*.42,hz-.028*H); x.bezierCurveTo(W*.55,hz-.06*H,W*.7,hz-.055*H,W*.84,hz-.03*H); x.bezierCurveTo(W*.92,hz-.045*H,W*.97,hz-.04*H,W,hz-.036*H); x.lineTo(W,hz+1); x.closePath(); x.fill();
    // back pine rows (hazier), thick on the shores, open in the middle of the lake
    const r=v3rng(7);
    const rowB=(x0,x1,h0,h1)=>{ for(let X=x0;X<x1;X+=W*.011){ const h=H*(h0+(h1-h0)*r()); v3pine(x,X+r()*W*.006,hz+1,h,P.back,P.rim,P.d*.25); } };
    rowB(-W*.01,W*.42,.045,.075); rowB(W*.72,W*1.01,.04,.07);
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
    // grassy bank on the right where the willow stands
    x.fillStyle=P.bank; x.beginPath(); x.moveTo(W*.8,hz+2); x.quadraticCurveTo(W*.88,hz-.012*H,W*1.01,hz-.004*H); x.lineTo(W*1.01,hz+.03*H); x.quadraticCurveTo(W*.9,hz+.028*H,W*.8,hz+2); x.closePath(); x.fill();
    // ---- water ----
    const wg=x.createLinearGradient(0,hz,0,H); wg.addColorStop(0,P.wTop); wg.addColorStop(.32,P.wMid); wg.addColorStop(1,P.wBot); x.fillStyle=wg; x.fillRect(0,hz,W,H-hz);
    // reflection: the land above, mirrored and squashed, then broken into calm bands
    x.save(); x.globalAlpha=.38; x.beginPath(); x.rect(0,hz,W,H*.3); x.clip(); x.translate(0,hz); x.scale(1,-.72); x.translate(0,-hz);
    x.drawImage(cnv,0,0,cnv.width,Math.round(hz*DPR),0,0,W,hz); x.restore();
    const rb=x.createLinearGradient(0,hz,0,hz+H*.3); rb.addColorStop(0,v3rgba(P.wTop,0)); rb.addColorStop(1,v3rgba(P.wMid,1)); x.fillStyle=rb; x.fillRect(0,hz,W,H*.3);
    x.fillStyle=v3rgba(P.wTop,.35); for(let i=0;i<9;i++){ const y=hz+3+i*i*1.6; x.fillRect(0,y,W,1); }
    // the waterline: a thin bright edge where shore meets water
    x.fillStyle=v3rgba(P.rim,.28+P.d*.2); x.fillRect(0,hz,W,1.2);
  },

  // living parts, every frame
  live(P,t,hz,sun){
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
    // drifting mist bands at dusk and night
    if(FX){ const ma=.18*d+.1*night; if(ma>.02){ for(let i=0;i<2;i++){ const mx=((t*(6+i*3)+i*W*.4)%(W*1.6))-W*.3, my=hz+H*(.02+i*.05), mw=W*.7; const mg=g.createLinearGradient(mx,0,mx+mw,0); const mc=mix(P.farHaze,'#ffffff',.4); mg.addColorStop(0,v3rgba(mc,0)); mg.addColorStop(.5,v3rgba(mc,ma)); mg.addColorStop(1,v3rgba(mc,0)); g.fillStyle=mg; g.fillRect(mx,my,mw,H*.025); } } }
    // gentle wave glints
    g.strokeStyle=v3rgba(mix(P.wTop,'#ffffff',.5),.22); g.lineWidth=1;
    for(let r0=0;r0<9;r0++){ const y=hz+H*.03+Math.pow(r0/9,1.5)*(H-hz)*.95; const sp=W*(.08+r0*.02), len=W*(.012+r0*.004); g.beginPath(); for(let X=((t*(5+r0*2)+r0*53)%sp)-sp;X<W;X+=sp){ const yy=y+Math.sin(X*.02+t+r0)*1; g.moveTo(X,yy); g.quadraticCurveTo(X+len/2,yy-1.2,X+len,yy); } g.stroke(); }
    // the willow: trunk on the bank, drooping strands swaying in the breeze
    this.willow(P,t,hz);
    // ducks gliding across, leaving a wake
    { const k=((t/70)%1), dx=W*(1.05-k*1.15), dy=hz+H*.045; for(let i=0;i<2;i++){ const px=dx+i*W*.03, py=dy+i*H*.006, s=H*.012;
        g.strokeStyle=v3rgba(mix(P.wTop,'#ffffff',.6),.35); g.lineWidth=1; g.beginPath(); g.moveTo(px+s*1.2,py+s*.6); g.lineTo(px+s*4,py+s*.2); g.moveTo(px+s*1.2,py+s*.7); g.lineTo(px+s*4,py+s*1.3); g.stroke();
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
  },

  willow(P,t,hz){
    const u=H/500, bx=W*.905, by=hz+H*.012, th=H*.115, wood=mix(P.cabin,'#000000',.2), rimA=.3+P.d*.4;
    const leafD=mix(P.leaf,'#000000',.38), leafM=P.leaf, leafL=mix(P.leaf,P.leafHi,.16+P.d*.1);
    const ccx=bx-H*.004, ccy=by-th-H*.03, rx=H*.105, ry=H*.055, sway=Math.sin(t*.7)*H*.007;
    // trunk with root flare and a lit edge, visible under the crown
    g.fillStyle=wood; g.beginPath(); g.moveTo(bx-H*.022,by); g.bezierCurveTo(bx-H*.01,by-H*.01,bx-H*.014,by-th*.6,bx-H*.008,by-th-H*.01); g.lineTo(bx+H*.009,by-th-H*.01); g.bezierCurveTo(bx+H*.01,by-th*.6,bx+H*.008,by-H*.012,bx+H*.024,by); g.closePath(); g.fill();
    g.strokeStyle=v3rgba(P.rim,rimA); g.lineWidth=1; g.beginPath(); g.moveTo(bx+H*.022,by); g.bezierCurveTo(bx+H*.008,by-H*.012,bx+H*.009,by-th*.6,bx+H*.008,by-th); g.stroke();
    g.strokeStyle=wood; g.lineCap='round'; g.lineWidth=Math.max(1.4,H*.006); g.beginPath(); g.moveTo(bx,by-th); g.quadraticCurveTo(bx-H*.03,by-th-H*.02,bx-H*.07,by-th-H*.01); g.moveTo(bx,by-th); g.quadraticCurveTo(bx+H*.03,by-th-H*.025,bx+H*.065,by-th-H*.005); g.stroke();
    // crown: many small leaf clusters filling a dome, dark below, lighter and rim-lit on top right
    const r=v3rng(53);
    const dome=(n,col,lift,rad,a0=Math.PI,a1=Math.PI)=>{ g.fillStyle=col; g.beginPath(); for(let i=0;i<n;i++){ const a=a0+r()*a1, d=Math.sqrt(r()); const px=ccx+Math.cos(a)*rx*d, py=ccy+Math.sin(a)*ry*d-lift; const cr=H*rad*(.7+r()*.6); g.moveTo(px+cr,py); g.arc(px,py,cr,0,7); } g.fill(); };
    dome(70,leafD,0,.016); dome(46,leafM,H*.008,.013); dome(14,leafL,H*.012,.009,Math.PI*1.5,Math.PI*.45);
    // fronds: spring out from the crown edge, then fall; fine slanted leaves along each
    const fr=v3rng(61), layers=[[],[],[]];
    for(let i=0;i<64;i++){ const a=Math.PI*(1.04+fr()*.92), sx=ccx+Math.cos(a)*rx*.92, sy=ccy+Math.sin(a)*ry*.6, ox=Math.cos(a);
      const len=(by-sy)*(.72+fr()*.28), ph=fr()*6.3, sw=sway*(.6+Math.abs(ox))+Math.sin(t*1.15+ph)*H*.003;
      layers[i%3].push([sx,sy,ox,len,sw]); }
    const bez=(p0,p1,p2,p3,k)=>{ const m=1-k; return m*m*m*p0+3*m*m*k*p1+3*m*k*k*p2+k*k*k*p3; };
    [[leafD,0],[leafM,1],[leafL,2]].forEach(([col,li])=>{
      g.strokeStyle=col; g.lineWidth=Math.max(.8,u*1.1); g.beginPath();
      for(const [sx,sy,ox,len,sw] of layers[li]){
        const x1=sx+ox*H*.03, y1=sy-H*.012, x2=sx+ox*H*.045+sw*.4, y2=sy+len*.35, x3=sx+ox*H*.04+sw, y3=Math.min(sy+len,hz+H*.02);
        g.moveTo(sx,sy); g.bezierCurveTo(x1,y1,x2,y2,x3,y3);
        for(let k=.12;k<1;k+=.07){ const px=bez(sx,x1,x2,x3,k), py=bez(sy,y1,y2,y3,k), side=(Math.round(k*100)%2)?1:-1, ll=u*(3.4-k*1.4);
          g.moveTo(px,py); g.lineTo(px+side*ll*.55,py+ll); } }
      g.stroke(); });
    g.lineCap='butt';
    // warm rim along the top right of the crown
    g.strokeStyle=v3rgba(P.rim,rimA); g.lineWidth=1.3; g.beginPath(); g.ellipse(ccx,ccy-H*.012,rx*.9,ry*.95,0,-Math.PI*.42,-.08); g.stroke();
    // soft reflection in the water
    g.save(); g.globalAlpha=.16; g.fillStyle=leafM; g.beginPath(); g.ellipse(bx,hz+H*.06,rx*1.05,H*.045,0,0,7); g.fill(); g.restore();
  },

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

  fore(P,t){
    // cattails and reeds in the bottom-right corner, swaying, rim lit at dusk
    const base=H+2, x0=W*.925;
    for(let i=0;i<9;i++){ const x=x0+i*W*.0085, h=H*(.1+((i*13)%5)*.022), sw=Math.sin(t*1.1+i*.6)*H*.008;
      g.strokeStyle=mix('#3d6a3a',P.front,.35+P.night*.4); g.lineWidth=Math.max(1.4,H*.006); g.beginPath(); g.moveTo(x,base); g.quadraticCurveTo(x+sw*.4,base-h*.6,x+sw,base-h); g.stroke();
      if(i%3===0){ g.fillStyle=mix('#6a4028',P.front,P.night*.5); g.beginPath(); g.ellipse(x+sw,base-h-H*.012,H*.0065,H*.022,sw*.02,0,7); g.fill(); g.fillStyle=v3rgba(P.rim,.4*P.d); g.fillRect(x+sw+H*.002,base-h-H*.028,1,H*.02); } }
  }
};

// =====================================================================
// the dock for areas with a wooden dock (pond first): grain, nails, moss,
// rope, a bucket, and a lantern whose light sits BEHIND its pole and housing
// =====================================================================
function v3dock(P,t,night,dockY){
  const PW=W*.19, wd=dockWood(), N=c=>mix(c,'#0a1020',night*.55);
  const top=N(mix(wd,'#ffffff',.1)), face=N(mix(wd,'#000000',.22)), dark=N(mix(wd,'#000000',.45));
  const lit=clamp(night*1.2+P.d*.9,0,1), lx=PW-W*.008, ly=dockY-H*.1;
  // lantern light first, so the pole and housing are drawn over it
  if(lit>.05){ v3glow(g,lx,ly,H*.2,'rgba(255,200,110,.85)',lit*.6*(.93+.07*Math.sin(t*7.1)*Math.sin(t*3.3)));
    const pg=g.createRadialGradient(lx-W*.02,dockY,0,lx-W*.02,dockY,W*.09); pg.addColorStop(0,'rgba(255,190,110,'+(.32*lit)+')'); pg.addColorStop(1,'rgba(255,190,110,0)'); g.fillStyle=pg; g.fillRect(lx-W*.12,dockY-H*.03,W*.2,H*.06); }
  // posts with a moss band and their reflections
  const pw=Math.max(5,W*.011);
  for(let i=0;i<3;i++){ const px=W*.02+i*W*.075; g.fillStyle=dark; g.fillRect(px,dockY,pw,H-dockY); g.fillStyle=N(mix(wd,'#000000',.3)); g.fillRect(px,dockY,pw*.35,H-dockY);
    g.fillStyle=N('#3f6a4a'); g.fillRect(px,dockY+(H-dockY)*.55,pw,(H-dockY)*.08); g.fillStyle=N('#4f8a5a'); g.fillRect(px,dockY+(H-dockY)*.55,pw,1.5); }
  // rope wrapped around the last post
  { const px=W*.02+2*W*.075; g.strokeStyle=N('#c9a070'); g.lineWidth=1.6; for(let k=0;k<3;k++){ g.beginPath(); g.moveTo(px-1,dockY+H*.025+k*3.2); g.lineTo(px+pw+1,dockY+H*.03+k*3.2); g.stroke(); } }
  // deck: top boards with seams, a front beam with grain and nails, a lit edge
  const th=Math.max(4,H*.012), fh=Math.max(6,H*.018);
  g.fillStyle=top; g.fillRect(-2,dockY-th,PW+2,th);
  g.fillStyle=N(mix(wd,'#000000',.12)); for(let X=W*.012;X<PW;X+=W*.024) g.fillRect(X,dockY-th,1,th);
  g.fillStyle=face; g.fillRect(-2,dockY,PW+2,fh);
  g.strokeStyle=N(mix(wd,'#000000',.38)); g.lineWidth=.8; g.beginPath(); for(let k=0;k<2;k++){ const y=dockY+fh*(.35+k*.32); for(let X=0;X<PW;X+=W*.05){ g.moveTo(X,y); g.quadraticCurveTo(X+W*.012,y+(k?-1:1),X+W*.03,y); } } g.stroke();
  g.fillStyle=N('#2a1a14'); for(let X=W*.012;X<PW;X+=W*.048){ g.fillRect(X,dockY+fh*.25,1.6,1.6); g.fillRect(X,dockY+fh*.65,1.6,1.6); }
  g.fillStyle=v3rgba(P.rim,.45+P.d*.25); g.fillRect(-2,dockY-th,PW+2,1);
  g.fillStyle='rgba(0,0,0,.28)'; g.fillRect(-2,dockY+fh,PW+2,2);
  // bucket (the old grey box), now a little tin pail with a handle
  { const bx=W*.155, s=H*.024; g.fillStyle=N('#8f93a8'); g.beginPath(); g.moveTo(bx,dockY-th); g.lineTo(bx+s*.12,dockY-th-s); g.lineTo(bx+s*.88,dockY-th-s); g.lineTo(bx+s,dockY-th); g.closePath(); g.fill();
    g.fillStyle=N('#c4c8da'); g.fillRect(bx+s*.1,dockY-th-s,s*.8,1.4); g.strokeStyle=N('#c4c8da'); g.lineWidth=1; g.beginPath(); g.arc(bx+s*.5,dockY-th-s,s*.42,Math.PI,0); g.stroke(); }
  // lantern post and housing, drawn over the light
  const pX=lx-1.5; g.fillStyle=N('#2c2232'); g.fillRect(pX,ly+H*.022,3,dockY-th-(ly+H*.022)); g.fillRect(pX-3,dockY-th-2,9,2);
  const hw=H*.022, hh=H*.032;
  g.fillStyle=lit>.05?v3rgba('#ffd27a',.35+lit*.6):N('#6a6a78'); g.fillRect(lx-hw/2,ly-hh/2,hw,hh);
  if(lit>.05){ const fl=1+Math.sin(t*13)*.08+Math.sin(t*7.7)*.06; g.fillStyle='#fff2c4'; g.beginPath(); g.ellipse(lx,ly+hh*.08,hw*.16,hh*.22*fl,0,0,7); g.fill(); }
  g.strokeStyle=N('#2c2232'); g.lineWidth=1.4; g.strokeRect(lx-hw/2,ly-hh/2,hw,hh); g.beginPath(); g.moveTo(lx,ly-hh/2); g.lineTo(lx,ly+hh/2); g.stroke();
  g.fillStyle=N('#2c2232'); g.beginPath(); g.moveTo(lx-hw*.7,ly-hh/2); g.lineTo(lx,ly-hh*.95); g.lineTo(lx+hw*.7,ly-hh/2); g.closePath(); g.fill(); g.fillRect(lx-hw*.55,ly+hh/2,hw*1.1,2);
  g.strokeStyle=N('#2c2232'); g.lineWidth=1.2; g.beginPath(); g.arc(lx,ly-hh*1.05,2.2,0,7); g.stroke();
}

const V3SCENES = { pond: V3POND };
const V3PLAT = { dock:(P,t,night,dockY)=>v3dock(P,t,night,dockY) };

// ---------- entry points called from draw() ----------
function v3Scene(L,t,p,night,dusk,gloom,hz,wx){
  if(!V3ON || !V3SCENES[L.id]) return false;
  const P=v3palette(L.id,night,dusk,gloom), SC=V3SCENES[L.id];
  // sky
  const sg=g.createLinearGradient(0,0,0,hz); sg.addColorStop(0,P.top); sg.addColorStop(.55,P.mid); sg.addColorStop(1,P.bot); g.fillStyle=sg; g.fillRect(0,0,W,hz+1);
  // stars (twinkling) after dusk
  if(night>.05 && gloom<.5){ if(!v3Scene.st||v3Scene.st.w!==W){ const r=v3rng(3); v3Scene.st={w:W,a:Array.from({length:90},()=>[r()*W,r()*hz*.85,r(),.6+r()*1.1])}; }
    g.fillStyle='#ffffff'; for(const s of v3Scene.st.a){ g.globalAlpha=night*(1-gloom)*(.3+.7*Math.abs(Math.sin(t*.7+s[2]*11))); g.fillRect(s[0],s[1],s[3],s[3]); } g.globalAlpha=1; }
  // sun or moon on the game's clock (same path as before)
  const sa=((p+.05)%1), up=sa<.55, k=up?sa/.55:(sa-.55)/.45, sx=W*(.1+.8*k), sy=hz-Math.sin(k*Math.PI)*hz*.8+10;
  const vis=(1-gloom*.85)*(up?1:clamp(night*1.2,0,1));
  if(up){ v3glow(g,sx,sy,H*.42,v3rgba(P.glow,.9),vis*(.55+P.d*.4)); g.fillStyle=mix(P.glow,'#ffffff',.5); g.globalAlpha=vis; g.beginPath(); g.arc(sx,sy,H*.045,0,7); g.fill(); g.globalAlpha=1; }
  else if(vis>.05){ v3glow(g,sx,sy,H*.12,'rgba(220,230,255,.6)',vis*.5); g.save(); g.globalAlpha=vis; g.beginPath(); g.arc(sx,sy,H*.03,0,7); g.clip(); g.fillStyle='#fff4dc'; g.beginPath(); g.arc(sx,sy,H*.03,0,Math.PI*2); g.moveTo(sx+H*.013+H*.028,sy-H*.009); g.arc(sx+H*.013,sy-H*.009,H*.028,0,Math.PI*2); g.fill('evenodd'); g.restore(); }
  // soft clouds: a bumpy top made of overlapping puffs, a flat base, lighter on top, lit underside; drifting
  for(let i=0;i<3;i++){ const cw=W*(.16+i*.05), cx=((t*(2.2+i)+i*W*.45)%(W+cw*2))-cw, cy=hz*(.3+i*.17), chh=hz*(.09-i*.015);
    const cg=g.createLinearGradient(0,cy-chh,0,cy); cg.addColorStop(0,v3rgba(mix(P.cloud,'#ffffff',.25),.85*(1-gloom*.3))); cg.addColorStop(1,v3rgba(P.cloud,.8*(1-gloom*.3)));
    g.save(); g.beginPath(); g.rect(cx-cw*.2,cy-chh*2,cw*1.4,chh*2); g.clip(); g.fillStyle=cg; g.beginPath();
    for(const [f,rw,rh] of [[.14,.16,.38],[.3,.2,.7],[.5,.24,.95],[.68,.19,.66],[.84,.15,.42],[.42,.3,.4],[.7,.28,.3]]) g.ellipse(cx+cw*f,cy-chh*rh*.35,cw*rw,chh*rh*.75,0,0,7);
    g.fill(); g.restore();
    g.fillStyle=v3rgba(P.cloudLit,.75*(1-gloom*.5)); g.beginPath(); g.moveTo(cx+cw*.05,cy); g.quadraticCurveTo(cx+cw*.5,cy+chh*.16,cx+cw*.95,cy); g.quadraticCurveTo(cx+cw*.5,cy-chh*.12,cx+cw*.05,cy); g.fill(); }
  // the still land and water, from the cache
  g.drawImage(v3land(L,P,hz),0,0,W,H);
  SC.live(P,t,hz,{x:sx,y:sy,up,vis:up?vis*(sy<hz?1:0):vis*.6});
  return true;
}
function v3Platform(L,t,night,dockY,pb){
  const fn=V3PLAT[L.plat]; if(!V3ON || !V3SCENES[L.id] || !fn) return false;
  const P=v3palette.v; if(!P) return false; fn(P,t,night,dockY,pb,L); return true;
}
function v3Fore(L,t,night){
  if(!V3ON || !V3SCENES[L.id] || !V3SCENES[L.id].fore) return false;
  V3SCENES[L.id].fore(v3palette.v||v3palette(L.id,night,0,0),t); return true;
}

// ---------- test-mode helpers (only with ?test): control the clock, crop and enlarge the canvas ----------
if(/[?&]test\b/.test(location.search)){
  window.__realNow=Date.now.bind(Date); window.__off=0; Date.now=()=>window.__realNow()+window.__off;
  window.__setPhase=async ph=>{ const cur=(window.__realNow()/1000%360)/360, base=((ph-cur+1)%1)*360000; for(let k=0;k<80;k++){ window.__off=base+k*360000; if(weather().k==='Clear') return 'Clear'; } return 'no clear'; };
  window.__crop=(x,y,w,h,s=2)=>{ document.getElementById('dbg')?.remove(); const d=cv.width/cv.getBoundingClientRect().width, o=document.createElement('canvas'); o.width=w*s; o.height=h*s; o.getContext('2d').drawImage(cv,x*d,y*d,w*d,h*d,0,0,w*s,h*s); const im=document.createElement('img'); im.src=o.toDataURL(); im.id='dbg'; im.style.cssText='position:fixed;left:0;top:0;z-index:99999;background:#000;width:'+(w*s)+'px'; document.body.appendChild(im); return [o.width,o.height]; };
  window.__go=id=>{ S.loc=id; if(!S.unlocked.includes(id)) S.unlocked.push(id); };
  window.__post=(name,url)=>fetch('/shot/'+name,{method:'POST',body:url});
  window.__snap=(name,x=0,y=0,w=W,h=H,s=2)=>{ const d=cv.width/cv.getBoundingClientRect().width, o=document.createElement('canvas'); o.width=w*s; o.height=h*s; o.getContext('2d').drawImage(cv,x*d,y*d,w*d,h*d,0,0,w*s,h*s); return __post(name,o.toDataURL()); };
}

// ---------- water effects for the fishing moments (all areas, preview) ----------
// rings and droplets live on the water (drawn under the dock and angler); a rare catch gets a sparkle burst on top
const V3FX={rings:[],drops:[],prev:'idle',splT:0,last:0,rare:0};
function v3fxSplash(x,y,n,pow){ const rn=Math.min(3,1+Math.floor(n/8)); for(let i=0;i<rn;i++) V3FX.rings.push({x,y,t:-i*.14,life:1.3+pow,r0:2,r1:14+pow*26});
  for(let i=0;i<n;i++){ const a=-Math.PI*(.12+.76*Math.random()), sp=(50+Math.random()*90)*(.55+pow); V3FX.drops.push({x:x+(Math.random()-.5)*4,y,vx:Math.cos(a)*sp*.55,vy:Math.sin(a)*sp,t:0,life:.55+Math.random()*.45,r:.7+Math.random()*1.3}); }
  if(V3FX.drops.length>160) V3FX.drops.splice(0,V3FX.drops.length-160); }
function v3Fx(t){ if(!V3ON) return; const dt=Math.min(.05,Math.max(0,t-(V3FX.last||t))); V3FX.last=t; const st=G.st, pv=V3FX.prev, sc=clamp(H/420,.7,1.25);
  if(st==='waiting'&&pv==='flying') v3fxSplash(G.bob.x,G.bob.y,9,.25);
  if(st==='bite'&&pv!=='bite') v3fxSplash(G.bob.x,G.bob.y,7,.2);
  if(st==='reeling'){ V3FX.splT-=dt; if(V3FX.splT<=0){ const ten=clamp((G.ten||0)/100,0,1); v3fxSplash(G.bob.x+(Math.random()-.5)*12,G.bob.y+3,2+Math.round(ten*6),.1+ten*.35); V3FX.splT=.16+(1-ten)*.4+(G.run?-.06:0); } }
  if(st==='landing'&&pv!=='landing'&&G.land){ v3fxSplash(G.land.x0,G.land.y0,22,.65); const f=G.fish; if(f&&(f.shiny||f.kind==='hat'||(f.kind==='fish'&&f.sp&&f.sp.r>=3))) V3FX.rare=performance.now(); }
  V3FX.prev=st;
  for(let i=V3FX.rings.length-1;i>=0;i--){ const r=V3FX.rings[i]; r.t+=dt; if(r.t>r.life){ V3FX.rings.splice(i,1); continue; } if(r.t<0) continue; const k=r.t/r.life, rad=(r.r0+(r.r1-r.r0)*Math.sqrt(k))*sc;
    g.strokeStyle='rgba(236,246,255,'+(.6*(1-k))+')'; g.lineWidth=1.3*(1-k*.5); g.beginPath(); g.ellipse(r.x,r.y+2,rad,rad*.3,0,0,7); g.stroke(); }
  for(let i=V3FX.drops.length-1;i>=0;i--){ const d=V3FX.drops[i]; d.t+=dt; if(d.t>d.life){ V3FX.drops.splice(i,1); continue; } d.vy+=330*dt; d.x+=d.vx*dt*sc; d.y+=d.vy*dt*sc; const a=1-d.t/d.life;
    g.fillStyle='rgba(232,245,255,'+(.85*a)+')'; g.beginPath(); g.ellipse(d.x,d.y,d.r*sc,d.r*1.35*sc,Math.atan2(d.vy,d.vx)+Math.PI/2,0,7); g.fill(); }
}
function v3FxTop(){ if(!V3ON||!V3FX.rare) return; const k=(performance.now()-V3FX.rare)/1700; if(k>1){ V3FX.rare=0; return; }
  const cx=W*.2, cy=H*.24, sc=clamp(H/420,.7,1.25);
  for(let i=0;i<10;i++){ const a=i/10*Math.PI*2+k*1.2, rr=(14+k*46)*sc, x=cx+Math.cos(a)*rr, y=cy+Math.sin(a)*rr*.75, s=(3.2-k*2)*sc, al=Math.min(1,(1-k)*1.8);
    g.fillStyle='rgba(255,226,140,'+al+')'; g.beginPath(); g.moveTo(x,y-s*1.6); g.quadraticCurveTo(x,y,x+s*1.6,y); g.quadraticCurveTo(x,y,x,y+s*1.6); g.quadraticCurveTo(x,y,x-s*1.6,y); g.quadraticCurveTo(x,y,x,y-s*1.6); g.fill(); }
}
