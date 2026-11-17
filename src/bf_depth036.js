// =====================================================================
// 0.3.6 depth of field: out-of-focus things close to the camera frame each water, the strongest cue that the
// scene is deep and not flat. Each map gets its own, in theme (reeds at the pond, a lava rock at Ember Springs...),
// kept to the corners away from the angler and the bobber, swaying gently. The blur is made by drawing small and
// scaling up (works in every browser, phones included) and cached, so it costs one image per frame.
// =====================================================================
const DOF_CACHE={};
const DOF_SETS={
 pond:   {br:'reeds'},
 river:  {br:'grass'},
 coast:  {br:'dune'},
 frost:  {br:'ice'},
 reef:   {br:'coral'},
 trench: {br:'kelp'},
 ember:  {br:'lavarock'},
 starfall:{br:'crystal'},
};
function dofDraw(x,kind,w,h,P,night){ const dk=mix(P.rockD||'#1a2028','#05080e',.35+night*.3), mid=mix(P.rock||P.far||'#2a3440','#05080e',.25+night*.3);
  x.lineCap='round'; x.lineJoin='round';
  if(kind==='reeds'||kind==='grass'||kind==='dune'){ const n=kind==='dune'?9:12; for(let i=0;i<n;i++){ const bx=w*(.2+i*.07), lean=(i%3-1)*w*.08+w*.06, top=h*(kind==='dune'?.45:.12)+((i*37)%5)*h*.06; x.strokeStyle=i%2?dk:mid; x.lineWidth=w*(kind==='dune'?.02:.026); x.beginPath(); x.moveTo(bx,h); x.quadraticCurveTo(bx+lean*.3,h*.6,bx+lean,top); x.stroke();
      if(kind==='reeds'&&i%4===1){ x.fillStyle=mix('#4a3020',dk,.4); x.beginPath(); x.ellipse(bx+lean*.92,top+h*.1,w*.025,h*.09,lean*.004,0,7); x.fill(); } } }
  else if(kind==='leaves'||kind==='snowbranch'){ x.strokeStyle=dk; x.lineWidth=w*.04; x.beginPath(); x.moveTo(w,h*.05); x.quadraticCurveTo(w*.6,h*.2,w*.12,h*.42); x.stroke(); x.lineWidth=w*.022; x.beginPath(); x.moveTo(w*.62,h*.2); x.quadraticCurveTo(w*.5,h*.5,w*.42,h*.7); x.stroke();
    for(let i=0;i<14;i++){ const u=i/14, px=w*(1-u*.85), py=h*(.06+u*.36)+((i*53)%7-3)*h*.02; if(kind==='leaves'){ x.fillStyle=i%2?dk:mid; x.beginPath(); x.ellipse(px,py+h*.05,w*.07,h*.035,.6+i*.3,0,7); x.fill(); } else { x.fillStyle=mix('#e8f0f8',P.far||'#888',.25+night*.5); x.beginPath(); x.ellipse(px,py-h*.01,w*.06,h*.022,-.1,0,7); x.fill(); } } }
  else if(kind==='ice'){ x.fillStyle=mix('#cfe4f2',dk,.45+night*.3); x.beginPath(); x.moveTo(w*.15,h); x.lineTo(w*.3,h*.42); x.lineTo(w*.55,h*.3); x.lineTo(w*.78,h*.5); x.lineTo(w,h*.38); x.lineTo(w,h); x.closePath(); x.fill(); x.fillStyle=v3rgba('#ffffff',.35*(1-night*.6)); x.beginPath(); x.moveTo(w*.32,h*.44); x.lineTo(w*.55,h*.32); x.lineTo(w*.5,h*.5); x.closePath(); x.fill(); }
  else if(kind==='coral'){ for(const [bx,c2] of [[.35,'#a04a5a'],[.62,'#c87a3a'],[.85,'#7a4a9a']]){ x.strokeStyle=mix(c2,dk,.55+night*.3); x.lineWidth=w*.05; x.beginPath(); x.moveTo(w*bx,h); x.lineTo(w*bx,h*.45); x.moveTo(w*bx,h*.7); x.quadraticCurveTo(w*(bx-.12),h*.55,w*(bx-.14),h*.3); x.moveTo(w*bx,h*.62); x.quadraticCurveTo(w*(bx+.1),h*.45,w*(bx+.12),h*.25); x.stroke(); } }
  else if(kind==='kelp'){ for(let i=0;i<5;i++){ const bx=w*(.3+i*.15); x.strokeStyle=mix('#2a5a3a',dk,.5+night*.3); x.lineWidth=w*.05; x.beginPath(); x.moveTo(bx,h); x.bezierCurveTo(bx-w*.1,h*.7,bx+w*.1,h*.4,bx-w*.04,h*.05+i*h*.06); x.stroke(); } }
  else if(kind==='lavarock'){ x.fillStyle=mix('#2a1c1a','#05030a',.2+night*.3); x.beginPath(); x.moveTo(w*.08,h); x.lineTo(w*.22,h*.55); x.lineTo(w*.4,h*.4); x.lineTo(w*.62,h*.48); x.lineTo(w*.8,h*.3); x.lineTo(w,h*.36); x.lineTo(w,h); x.closePath(); x.fill();
    x.strokeStyle=v3rgba('#ff8a3a',.85); x.lineWidth=w*.014; x.beginPath(); x.moveTo(w*.3,h*.62); x.lineTo(w*.42,h*.72); x.lineTo(w*.4,h*.9); x.moveTo(w*.7,h*.5); x.lineTo(w*.78,h*.66); x.lineTo(w*.9,h*.72); x.stroke(); }
  else if(kind==='crystal'){ for(const [bx,hh,cl] of [[.4,.62,'#b89aff'],[.58,.82,'#9a7ae8'],[.75,.5,'#d8c0ff'],[.9,.7,'#a888f0']]){ x.fillStyle=mix(cl,'#120a24',.35+night*.25); x.beginPath(); x.moveTo(w*(bx-.07),h); x.lineTo(w*(bx-.04),h*(1-hh)+h*.06); x.lineTo(w*bx,h*(1-hh)); x.lineTo(w*(bx+.04),h*(1-hh)+h*.06); x.lineTo(w*(bx+.07),h); x.closePath(); x.fill(); x.fillStyle=v3rgba('#ffffff',.25); x.beginPath(); x.moveTo(w*(bx-.02),h*(1-hh)+h*.08); x.lineTo(w*bx,h*(1-hh)+h*.02); x.lineTo(w*(bx+.005),h*.9); x.closePath(); x.fill(); } } }
function dofSprite(id,slot,kind,w,h,P,night){ const key=id+'|'+slot+'|'+Math.round(w)+'x'+Math.round(h)+'|'+Math.round(night*6); let s=DOF_CACHE[key]; if(s) return s;
  // draw small, then scale up with smoothing: a soft, lens-like blur that works everywhere
  const k=.12, sw=Math.max(8,Math.round(w*k)), sh=Math.max(8,Math.round(h*k)), a=document.createElement('canvas'); a.width=sw; a.height=sh; const ax=a.getContext('2d'); ax.scale(k,k); dofDraw(ax,kind,w,h,P,night);
  const b=document.createElement('canvas'); b.width=Math.round(w*.5); b.height=Math.round(h*.5); const bx=b.getContext('2d'); bx.imageSmoothingEnabled=true; bx.imageSmoothingQuality='high'; bx.drawImage(a,0,0,b.width,b.height);
  s=DOF_CACHE[key]={cv:b}; const keys=Object.keys(DOF_CACHE); if(keys.length>40) delete DOF_CACHE[keys[0]]; return s; }
// 0.4 (director): the blurred foreground read as grey smears (Willow Pond's corner most of all); the scenes draw their own
// sharp foreground and the camera drift gives the depth, so the blurred layer is switched off on every water
const DOF_ON=false;
if(DOF_ON) for(const id in DOF_SETS){ m33wrap(id,'fore',function(P,t){ if(G.st==='result'&&false) return; const set=DOF_SETS[id], night=P.night||0, rm=V3PAR.rm.matches, sway=(rm?0:Math.sin(t*.6)*W*.004)-V3PAR.dx*1.3;
  g.save(); g.globalAlpha=.92; g.imageSmoothingEnabled=true;
  if(set.br){ const w=W*.26, h=H*.34, s=dofSprite(id,'br',set.br,w,h,P,night); g.drawImage(s.cv,W-w*.92+sway,H-h*.9,w,h); }
  if(set.tr){ const w=W*.3, h=H*.3, s=dofSprite(id,'tr',set.tr,w,h,P,night); g.drawImage(s.cv,W-w*.94+sway*1.2,-h*.12,w,h); }
  g.restore(); }); }

// ---------------------------------------------------------------------
// 0.3.6 photographic finish for every water. (1) Surface grain baked into the cached scenery once per light level:
// flat painted shapes pick up a fine stone/foliage texture, the biggest single step away from the "flat drawing"
// look, at zero cost per frame. (2) A lens vignette and a soft horizon haze drawn over the scene (one cached image).
// ---------------------------------------------------------------------
const FIN036={grain:null, vig:null};
function finGrain(){ if(FIN036.grain) return FIN036.grain; const n=160, c=document.createElement('canvas'); c.width=c.height=n; const x=c.getContext('2d'), im=x.createImageData(n,n), d=im.data; let s=91;
  const r=()=>{ s=(s*16807)%2147483647; return s/2147483647; };
  for(let i=0;i<n*n;i++){ const v=r(), lum=v<.5?0:255, a=Math.abs(v-.5)*2; d[i*4]=d[i*4+1]=d[i*4+2]=lum; d[i*4+3]=Math.round(a*a*44); }
  x.putImageData(im,0,0); return FIN036.grain=c; }
const _v3land_036=v3land;
v3land=function(L,P,hz){ const before=V3CACHE&&V3CACHE.key, C=_v3land_036(L,P,hz);
  if(C.key!==before && !C.fin){ C.fin=1; try{ const x=C.c.getContext('2d'); x.save(); x.setTransform(1,0,0,1,0,0); x.globalCompositeOperation='source-atop';
    const k=Math.max(1,Math.round(C.c.width/1400)); const hzq=Math.round(hz*C.c.height/H)+2; x.globalAlpha=.42; x.fillStyle=x.createPattern(finGrain(),'repeat'); if(k>1&&x.fillStyle.setTransform) x.fillStyle.setTransform(new DOMMatrix().scale(k,k)); x.fillRect(0,0,C.c.width,hzq);
    // light falls from above: the tops of things lighter, the ground near the camera darker
    x.globalAlpha=1; const hzp=hz*C.c.height/H, lg=x.createLinearGradient(0,0,0,C.c.height); lg.addColorStop(0,'rgba(255,248,235,.06)'); lg.addColorStop(Math.min(.98,hzp/C.c.height),'rgba(255,248,235,0)'); lg.addColorStop(1,'rgba(0,4,12,.16)'); x.fillStyle=lg; x.fillRect(0,0,C.c.width,C.c.height);
    x.restore(); }catch(e){} }
  return C; };
function finVignette(){ const key=W+'x'+H; if(FIN036.vig&&FIN036.vig.key===key) return FIN036.vig.c;
  const c=document.createElement('canvas'), q=Math.min(1,600/Math.max(W,H)); c.width=Math.max(8,Math.round(W*q)); c.height=Math.max(8,Math.round(H*q)); const x=c.getContext('2d'), w=c.width, h=c.height, R=Math.hypot(w,h)/2;
  const rg=x.createRadialGradient(w*.5,h*.46,R*.42,w*.5,h*.5,R*1.02); rg.addColorStop(0,'rgba(2,4,12,0)'); rg.addColorStop(.6,'rgba(2,4,12,.16)'); rg.addColorStop(1,'rgba(2,4,12,.42)'); x.fillStyle=rg; x.fillRect(0,0,w,h);
  FIN036.vig={key,c}; return c; }
const _v3Fore_036=v3Fore;
v3Fore=function(L,t,night){ const r=_v3Fore_036(L,t,night); if(r&&!window.__noVig){ g.save(); g.imageSmoothingEnabled=true; g.drawImage(finVignette(),0,0,W,H); g.restore(); } return r; };
