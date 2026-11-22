
// =====================================================================
// Driftline 0.3 scene renderer, style B2 "Glow Diorama".
// Since 0.3 this is the only renderer (V3ON is always true).
// Areas move over one at a time (V3SCENES); the rest keep the old renderer.
// Speed: everything that doesn't move (mountains, shores, cabin, water base,
// reflections) is drawn once into an offscreen canvas and reused until the
// size or the light changes; only living things are drawn every frame.
// =====================================================================
const V3ON = true; // 0.3: the new look is the game (kept as a flag so the older drawing code stays readable)
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
  // colors follow the clock in fine steps (cheap); o.key is a coarse light level that the cached scenery
  // follows, and each new level fades in over the old one (v3land), so light changes are smooth and rare
  const fq=document.body.classList.contains('pch-on')?[600,400,300]:[60,40,30]; /* PC: colors follow the clock almost continuously */
  const fk=id+'|'+Math.round(night*fq[0])+'|'+Math.round(dusk*fq[1])+'|'+Math.round(gloom*fq[2]);
  if(v3palette.k===fk) return v3palette.v;
  const P=V3PAL[id], d=clamp(dusk,0,1)*(1-night*.45), o={key:(()=>{ const s=v3steps(); return id+'|'+Math.round(night*s[0])+'|'+Math.round(dusk*s[1])+'|'+Math.round(gloom*s[2]); })()} /* 0.3.4: finer light steps, so each fade is smaller */;
  for(const k in P.day){ let c=mix(P.day[k],P.night[k],night); if(d>0) c=mix(c,P.dusk[k],d); if(gloom>0) c=mix(c,'#59616b',gloom*.6); o[k]=c; }
  o.d=d; o.night=night; o.gloom=gloom; v3palette.k=fk; v3palette.v=o; return o;
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
  const n=v3noise(o.seed), m=v3noise(o.seed+101), step=1.5/Math.min(DPR||1,2), raw=[];
  for(let X=0;X<=W+step;X+=step){ const f=X/W;
    let env=0; for(const [c0,a,w0] of o.massifs){ const d=Math.abs(f-c0)/w0; env=Math.max(env,a*Math.exp(-d*2.3)); }
    const r=.62*(1-Math.abs(2*n(f*3+1.3)-1))+.3*(1-Math.abs(2*n(f*7+5.1)-1))+.08*n(f*16+9.7); /* 0.3.3: less fine noise, softer crests */
    raw.push(o.amp*(.06+env*(.72+.28*r)+.05*r)); }
  // a light smoothing pass keeps crests crisp but never jagged
  const K=Math.max(3,Math.round(6/step)), cols=raw.map((h,i)=>{ let s=0,wsum=0; for(let j=-K;j<=K;j++){ const v=raw[Math.min(raw.length-1,Math.max(0,i+j))], w=1-Math.abs(j)/(K+1); s+=v*w; wsum+=w; } return o.base-s/wsum; }); /* a wide soft smoothing: natural, rounded ridges */
  const path=()=>{ c.beginPath(); c.moveTo(0,o.base); for(let i=0;i<cols.length;i++) c.lineTo(i*step,cols[i]); c.lineTo(W,o.base); c.closePath(); };
  const sk=Math.max(4,Math.round(8/step)), sl=i=>{ const a=cols[Math.max(0,i-sk)], b=cols[Math.min(cols.length-1,i+sk)]; return (b-a)/(2*sk*step); };
  // 8b: the slope shading is one left-to-right gradient over the whole range (a stop every ~3 px), not ~1,300 clipped column fills:
  // the same shading, but the graphics card paints one shape instead of spending ~170 ms of a light change on the columns
  const nc=cols.length, gs=Math.max(1,Math.round(3/step)), shade=(a,b)=>{ const lg=c.createLinearGradient(0,0,(nc-1)*step,0); for(let i=0;i<nc;i+=gs) lg.addColorStop(i/(nc-1),mix(a,b,clamp(.5+sl(i)*1.9,0,1))); return lg; };
  c.save(); path(); c.fillStyle=shade(o.shadow,o.light); c.fill(); c.clip();
  if(o.snow){ const dep=cols.map((y,i)=>{ if(y>=o.snowLine) return -1; const above=o.snowLine-y; return above*(.5+.45*m(i*step*.012))+above*.35*Math.max(0,m(i*step*.033+3)-.45); });
    c.beginPath(); for(let a=0;a<nc;a++){ if(dep[a]<0) continue; let b=a; while(b+1<nc&&dep[b+1]>=0) b++; /* one run of snow: along the crest, back along its lower edge */
      c.moveTo(a*step,cols[a]-1); for(let i=a;i<=b;i++) c.lineTo(i*step+step,cols[i]-1); for(let i=b;i>=a;i--) c.lineTo(i*step+step,cols[i]+dep[i]); c.lineTo(a*step,cols[a]+dep[a]); c.closePath(); a=b; }
    c.fillStyle=shade(mix(o.snow,'#8088bc',.4),o.snow); c.fill(); }
  const hg=c.createLinearGradient(0,o.base-o.amp,0,o.base); hg.addColorStop(0,v3rgba(o.haze,0)); hg.addColorStop(.55,v3rgba(o.haze,o.hazeA*.35)); hg.addColorStop(1,v3rgba(o.haze,o.hazeA)); c.fillStyle=hg; c.fillRect(0,o.base-o.amp,W,o.amp+1);
  c.restore();
}
function v3glow(c,x,y,r,col,a){ const gr=c.createRadialGradient(x,y,0,x,y,r); gr.addColorStop(0,col); gr.addColorStop(1,'rgba(0,0,0,0)'); c.save(); c.globalAlpha=a; c.fillStyle=gr; c.fillRect(x-r,y-r,r*2,r*2); c.restore(); }
function v3rgba(hex,a){ const v=hex2rgb(rgb2hex(hex)); return 'rgba('+v[0]+','+v[1]+','+v[2]+','+a+')'; }

// ---------- offscreen cache for the still parts ----------
let V3CACHE=null, V3PREV=null;
// light steps: PC (the PC header layout) gets twice as many smaller steps with a shorter fade, so dusk, dawn and weather flow
// smoothly; light changes are redrawn between frames, so the extra steps never make a frame late. Phones keep the original steps.
function v3steps(){ return document.body.classList.contains('pch-on')?[24,16,12]:[14,9,6]; }
function v3fade(){ return document.body.classList.contains('pch-on')?1.8:3.4; } // seconds a new light level takes to fade in
// 8b (director, 2026-11-21, option 20 of the light-change choices; the director's PC showed single frames of 291-329 ms at dawn and dusk):
// a new light level is painted ahead in slices. The land drawing is recorded (every canvas call, in order) and then replayed a few
// milliseconds per frame onto a spare picture; only when it is complete does it fade in. Same painting, same look, no long frame.
function v3rec(x){ const ops=[], stack=[]; let sh={};
  const ctx=new Proxy(x,{ get(t,k){ if(k==='canvas') return t.canvas; if(k in sh) return sh[k]; const v=t[k]; if(typeof v!=='function') return v;
      if(k==='save') return ()=>{ stack.push(Object.assign({},sh)); ops.push(['save',[]]); };
      if(k==='restore') return ()=>{ sh=stack.pop()||{}; ops.push(['restore',[]]); };
      if(/^create/.test(k)) return v.bind(t); /* gradients and patterns are made now and used at replay */
      if(k==='measureText') return s=>{ const f=t.font; if(sh.font) t.font=sh.font; const m=t.measureText(s); t.font=f; return m; };
      return (...a)=>{ ops.push([k,a.map(z=>Array.isArray(z)?z.slice():z)]); }; },
    set(t,k,v){ sh[k]=v; ops.push([0,k,v]); return true; } });
  return {ctx,ops}; }
const V3FLUSH=document.createElement('canvas'); V3FLUSH.width=V3FLUSH.height=1;
/* a slice is at most ~1,200 canvas calls and is handed to the graphics card at once (drawn into a 1-pixel canvas): the card paints a
   picture only when it is first used, so without this the whole picture landed on one frame however finely the calls were spread */
function v3play(J,ms){ const x=J.x, o=J.ops, t0=performance.now(), end=Math.min(o.length,J.i+1200); while(J.i<end){ for(let n=0;n<32&&J.i<end;n++){ const p=o[J.i++]; if(typeof p==='function') p(); else if(p[0]===0) x[p[1]]=p[2]; else x[p[0]].apply(x,p[1]); } if(performance.now()-t0>ms) break; }
  V3FLUSH.getContext('2d').drawImage(x.canvas,0,0,1,1); return J.i>=o.length; }
function v3prep(c){ const DL=(typeof gfxHigh==="function"&&gfxHigh())?DPR:Math.min(DPR,2), cw=Math.round(W*DL), ch=Math.round(H*DL); if(c.width!==cw||c.height!==ch){ c.width=cw; c.height=ch; }
  const x=c.getContext('2d'); x.setTransform(DL,0,0,DL,0,0); x.clearRect(0,0,W,H); return x; } /* still scenery at most 2x: sharp on every phone, far less to repaint */
function v3land(L,P,hz){
  const key=L.id+'|'+W+'|'+H+'|'+DPR+'|'+P.key, base=L.id+'|'+W+'|'+H+'|'+DPR;
  if(V3CACHE && V3CACHE.key===key){ v3land.job=null; return V3CACHE; } /* back to the light on screen: a half-painted next picture is dropped */
  // only the light changed (same place and size): keep the old picture to fade from; otherwise start clean
  const same=V3CACHE && V3CACHE.base===base;
  // a light change is painted ahead in slices (above) while the current picture stays; a new water or a new size is drawn at once
  if(same&&!v3land.now){ const J=v3land.job;
    if(J&&J.base===base){ if(v3play(J,4)){ v3land.job=null; V3PREV={c:V3CACHE.c,t0:performance.now()}; V3CACHE={key:J.key,base,c:J.c}; } return V3CACHE; }
    if(V3PREV&&V3PREV.t0>0) return V3CACHE; /* the last light level is still fading in: its picture is not free yet */
    const c=(V3PREV&&V3PREV.c)||document.createElement('canvas'), x=v3prep(c), R=v3rec(x); V3SCENES[L.id].land(R.ctx,P,hz,c);
    v3land.job={key,base,c,x,ops:R.ops,i:0}; return V3CACHE; }
  v3land.job=null;
  const old=V3CACHE, c=(same?V3PREV&&V3PREV.c:(old&&old.c))||document.createElement('canvas'), x=v3prep(c);
  // v3land.rec (PC's look-ahead picture): record now, replay in slices by the caller (C.ops)
  const R=v3land.rec?v3rec(x):null; V3SCENES[L.id].land(R?R.ctx:x,P,hz,c);
  V3PREV=same?{c:old.c,t0:performance.now()}:null;
  V3CACHE={key,base,c}; if(R){ V3CACHE.x=x; V3CACHE.ops=R.ops; V3CACHE.i=0; } return V3CACHE;
}
// the cached scenery, with the previous light level fading out on top while a new one comes in
function v3landDraw(L,P,hz){ const C=v3land(L,P,hz); g.drawImage(C.c,0,0,W,H);
  if(V3PREV){ const k=(performance.now()-V3PREV.t0)/1000/v3fade(); if(k>=1) V3PREV.t0=-1e12; else { g.globalAlpha=1-v3s(k); g.drawImage(V3PREV.c,0,0,W,H); g.globalAlpha=1; } } }

// =====================================================================
// WILLOW POND
// =====================================================================

// the lantern's reflection: short soft streaks that wobble and thin out with depth, never a solid block
// a soft oval pool of lantern light on a deck (rgb as 'r,g,b')
/* an owl flying left, side on (map standard: drawn from the side): body, short tail, round head in front, the near wing rising and falling */
function v3owlFly(ox,oy,s,t,body,wing,head,eye){ const f=Math.sin(t*4.2)*.35; g.save(); g.translate(ox,oy); g.fillStyle=body; g.beginPath(); g.ellipse(0,0,s*1.5,s*.6,0,0,7); g.fill(); g.beginPath(); g.moveTo(s*1.3,-s*.1); g.lineTo(s*2.1,-s*.25); g.lineTo(s*2.1,s*.2); g.lineTo(s*1.3,s*.25); g.fill();
  g.fillStyle=head; g.beginPath(); g.arc(-s*1.45,-s*.25,s*.6,0,7); g.fill(); g.fillStyle=eye; g.fillRect(-s*1.85,-s*.38,1.6,1.6);
  g.fillStyle=wing; g.beginPath(); g.moveTo(-s*.7,-s*.35); g.quadraticCurveTo(-s*.2,-s*(1.2+2.2*f),s*1.4,-s*(.6+2.6*f)); g.quadraticCurveTo(s*.6,-s*.3,s*.8,-s*.2); g.closePath(); g.fill(); g.restore(); }
function v3lightPool(x,y,R,rgb,a){ if(a<.01) return; g.save(); g.translate(x,y); g.scale(1,.3); const pg=g.createRadialGradient(0,0,0,0,0,R); pg.addColorStop(0,'rgba('+rgb+','+a+')'); pg.addColorStop(.6,'rgba('+rgb+','+(a*.33)+')'); pg.addColorStop(1,'rgba('+rgb+',0)'); g.fillStyle=pg; g.beginPath(); g.arc(0,0,R,0,7); g.fill(); g.restore(); }
function v3lanternReflect(x,y0,lit,t,rgb){ if(lit<.05) return; const L=H*.13, sc=clamp(H/420,.7,1.25); rgb=rgb||'255,210,130';
  for(let i=0;i<9;i++){ const k=i/8, y=y0+k*L, w=(7-k*4.5)*sc*(1+.25*Math.sin(t*2.1+i*1.7)), dx=Math.sin(t*1.3+i*2.3)*2*sc*k, a=lit*.28*(1-k)*(.65+.35*Math.sin(t*3+i));
    g.fillStyle='rgba('+rgb+','+a+')'; g.beginPath(); g.ellipse(x+dx,y,w,Math.max(.6,.75*sc),0,0,7); g.fill(); } }
// =====================================================================
// the dock for areas with a wooden dock (pond first): grain, nails, moss,
// rope, a bucket, and a lantern whose light sits BEHIND its pole and housing
// =====================================================================

const V3SCENES = {}; /* every water's scene and drawing is in its own file: src/w_<id>.js (Clean Scenes 5, 2026-11-22) */


// ---------- entry points called from draw() ----------
// the camera drifts slowly side to side (two slow waves, never a loop you notice); off for reduced motion
const V3PAR={dx:0,amp:0,rm:matchMedia('(prefers-reduced-motion:reduce)')};
function v3par(t){ V3PAR.amp=W*.008; if(V3PAR.rm.matches||window.__noPar){ V3PAR.dx=0; return 0; } return V3PAR.dx=V3PAR.amp*(Math.sin(t*.105)*.68+Math.sin(t*.043+1.3)*.32); }
function v3Scene(L,t,p,night,dusk,gloom,hz,wx){
  if(!V3ON || !V3SCENES[L.id]) return false;
  const P=v3palette(L.id,night,dusk,gloom), SC=V3SCENES[L.id];
  // a scene can tilt the whole world gently (the swell seen from a rocking boat)
  const tl=SC.tilt?SC.tilt(t):0; if(tl){ g.save(); g.translate(W/2,hz); g.rotate(tl); g.scale(1.04,1.04); g.translate(-W/2,-hz); }
  // sky
  const sg=g.createLinearGradient(0,0,0,hz); sg.addColorStop(0,P.top); sg.addColorStop(.55,P.mid); sg.addColorStop(1,P.bot); g.fillStyle=sg; g.fillRect(0,0,W,hz+1);
  if(wx&&wx.k==='Gilded'){ const gg=g.createLinearGradient(0,0,0,hz); gg.addColorStop(0,'rgba(255,200,90,0)'); gg.addColorStop(1,'rgba(255,196,90,'+(.26*(1-night*.65)*WXA)+')'); g.fillStyle=gg; g.fillRect(0,0,W,hz+1); }
  // 0.3.6 parallax: a slow camera drift; the sky moves least, the land and water more, the out-of-focus foreground most
  const px=v3par(t); g.save(); g.translate(px*.35,0);
  // stars (twinkling) after dusk
  if(night>.05 && gloom<.5 && !SC.overcast){ if(!v3Scene.st||v3Scene.st.w!==W){ const r=v3rng(3); v3Scene.st={w:W,a:Array.from({length:90},()=>[r()*W,r()*hz*.85,r(),.6+r()*1.1])}; }
    g.fillStyle='#ffffff'; for(const s of v3Scene.st.a){ g.globalAlpha=night*(1-gloom)*(.3+.7*Math.abs(Math.sin(t*.7+s[2]*11))); g.fillRect(s[0],s[1],s[3],s[3]); } g.globalAlpha=1; }
  // sun or moon on the game's clock (same path as before)
  const sa=((p+.05)%1), up=sa<.55, k=up?sa/.55:(sa-.55)/.45, sx=W*(.1+.8*k), sy=hz-Math.sin(k*Math.PI)*hz*.8+10;
  const vis=(1-gloom*.85)*(up?1:clamp(night*1.2,0,1))*(1-(SC.overcast||0));
  if(up){ v3glow(g,sx,sy,H*.42,v3rgba(P.glow,.9),vis*(.55+P.d*.4)); g.fillStyle=mix(P.glow,'#ffffff',.5); g.globalAlpha=vis; g.beginPath(); g.arc(sx,sy,H*.045,0,7); g.fill(); g.globalAlpha=1; }
  else if(vis>.05){ v3glow(g,sx,sy,H*.12,'rgba(220,230,255,.6)',vis*.5); g.save(); g.globalAlpha=vis; g.beginPath(); g.arc(sx,sy,H*.03,0,7); g.clip(); g.fillStyle='#fff4dc'; g.beginPath(); g.arc(sx,sy,H*.03,0,Math.PI*2); g.moveTo(sx+H*.013+H*.028,sy-H*.009); g.arc(sx+H*.013,sy-H*.009,H*.028,0,Math.PI*2); g.fill('evenodd'); g.restore(); }
  if(!up&&typeof wx3BloodMoonDisc==='function'&&wx3k()==='Blood Moon'&&wx3A()>.01) wx3BloodMoonDisc(sx,sy,wx3A()); // the blood moon is the moon (2026-11-17)
  // soft clouds: a bumpy top made of overlapping puffs, a flat base, lighter on top, lit underside; drifting
  for(let i=0;i<(SC.noClouds?0:3);i++){ const cw=W*(.16+i*.05), cx=((t*(2.2+i)+i*W*.45)%(W+cw*2))-cw, cy=hz*(.3+i*.17), chh=hz*(.09-i*.015);
    const cg=g.createLinearGradient(0,cy-chh,0,cy); cg.addColorStop(0,v3rgba(mix(P.cloud,'#ffffff',.25),.85*(1-gloom*.3))); cg.addColorStop(1,v3rgba(P.cloud,.8*(1-gloom*.3)));
    g.save(); g.beginPath(); g.rect(cx-cw*.2,cy-chh*2,cw*1.4,chh*2); g.clip(); g.fillStyle=cg; g.beginPath();
    for(const [f,rw,rh] of [[.14,.16,.38],[.3,.2,.7],[.5,.24,.95],[.68,.19,.66],[.84,.15,.42],[.42,.3,.4],[.7,.28,.3]]) g.ellipse(cx+cw*f,cy-chh*rh*.35,cw*rw,chh*rh*.75,0,0,7);
    g.fill(); g.restore();
    g.fillStyle=v3rgba(P.cloudLit,.75*(1-gloom*.5)); g.beginPath(); g.moveTo(cx+cw*.05,cy); g.quadraticCurveTo(cx+cw*.5,cy+chh*.16,cx+cw*.95,cy); g.quadraticCurveTo(cx+cw*.5,cy-chh*.12,cx+cw*.05,cy); g.fill(); }
  if(SC.sky) SC.sky(P,t,hz);
  g.restore();
  // the still land and water, from the cache (scaled a hair so the drift never shows an edge)
  g.save(); if(px){ const os=1+V3PAR.amp*2.4/W; g.translate(W/2+px,hz); g.scale(os,os); g.translate(-W/2,-hz); }
  v3landDraw(L,P,hz);
  SC.live(P,t,hz,{x:sx+px*.35-px,y:sy,up,vis:up?vis*(sy<hz?1:0):vis*.6});
  g.restore();
  if(tl) g.restore();
  return true;
}
function v3Platform(L,t,night,dockY,pb){ const P=v3palette.v; if(!HOMEF[L.id]||!P) return false; hfDraw(L,t,night,dockY,pb,P); return true; } /* every water has a home in the home format (batch 5; the old platform drawers are gone) */
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
  window.__v3st=()=>({cache:V3CACHE&&V3CACHE.key, prev:V3PREV&&V3PREV.t0});
  window.__landCost=(n=5)=>{ let mx=0; for(let i=0;i<n;i++){ if(V3CACHE) V3CACHE.key=""; v3palette.k=null; v3land.now=true; const t0=performance.now(); try{ draw(performance.now()); } finally{ v3land.now=false; } mx=Math.max(mx,performance.now()-t0); } return +mx.toFixed(2); };
  window.__drawCost=(n=30)=>{ const t0=performance.now(); for(let i=0;i<n;i++) draw(performance.now()); return +((performance.now()-t0)/n).toFixed(2); };
  window.__setWeather=k=>{ for(let i=0;i<3000;i++){ window.__off+=137000; if(weather().k===k) return k; } return 'none'; };
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
