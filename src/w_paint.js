// =====================================================================
// PAINTED WATERS: one engine for every water made from ChatGPT's painting (docs/MAP_STANDARD.md › "The painted-map standard";
// 2026-11-24, first used by Willow Pond). Cherry Blossom (w_blossom.js) came first and keeps its own code; new painted waters plug in
// here with one configuration (w_<water>_paint.js), so each map is its pieces plus a few numbers, not new drawing code.
//  - The pieces: one atlas per water (land with see-through sky and water, the water, the clouds), the building and the chair as cut-outs.
//  - Light: the day painting relit per light step (blFaded) with the water's palette (pwShade), dusk warmed, dawn pinker, weather greyer.
//  - Water: the painted lake rippling in strips, the land mirrored at its own shoreline (column by column, smoothed), the game's glitter.
//  - Movement: clouds drift behind the land; chosen parts of the land lean from their foot (a tree, reeds); fireflies at night.
//  - The building and chair are placed from the angler (standing line 60% down, angler 12% across), lit like the land, glowing after dusk,
//    mirrored at their posts' waterline.
// A water's own V3SCENES hooks call pwOk(id) and hand over to pwLive / pwSky when its painting is loaded.
// =====================================================================
const PW={};
function pwMake(id,cfg){ const st=PW[id]||(PW[id]={}); st.cfg=cfg; st.img=new Image(); st.img.onload=()=>{ st.img.ok=1; V3CACHE=null; V3PREV=null; v3land.job=null; }; st.img.src=cfg.art; return st; }
const pwOk = id => !!(PW[id]&&PW[id].img&&PW[id].img.ok);
/* the painting on this screen: it covers the screen with its shoreline on the horizon, extra width cut on the left */
function pwMap(c,hz){ const s=Math.max(W/c.IW,(H-hz)/(c.IH-c.WL),hz/c.WL); return {s,ox:W-c.IW*s,oy:hz-c.WL*s}; }
/* the palette's colour over its daytime colour: how much darker and bluer this light is than day */
function pwShade(id,P,k){ const a=hex2rgb(rgb2hex(P[k])), b=hex2rgb(rgb2hex(V3PAL[id].day[k])); return a.map((v,i)=>Math.min(1,v/Math.max(8,b[i]))); }
/* light a painted piece already drawn on x (w x h), keeping its own outline (mask: the same picture again) */
function pwLight(x,P,id,w,h,mask,key){ const dawn=false /* one warm tint for dawn and dusk: switching tints at the clock's turn made the light jump (director, 2026-11-24: "dusk and dawn transitions don't look smooth") */, n=P.night, d=P.d, keep=()=>{ x.globalCompositeOperation='destination-in'; mask(); };
  if(n>.01||d>.01||P.gloom>.02){ x.globalCompositeOperation='destination-over'; x.fillStyle='#000'; x.fillRect(0,0,w,h); } /* an opaque ground first: a multiply over half-see-through edge pixels let the tint itself show as a pale ring at night */
  if(n>.01||d>.01){ x.globalCompositeOperation='multiply'; x.fillStyle=blRgb(pwShade(id,P,key||'far')); x.fillRect(0,0,w,h); keep(); }
  if(n>.05){ x.globalCompositeOperation='multiply'; x.fillStyle=blRgb([1-.3*n,1-.3*n,1-.12*n]); x.fillRect(0,0,w,h); keep(); } /* bright paint (a sunlit willow) still glowed at night: everything a little darker */
  if(d>.02){ x.globalCompositeOperation='soft-light'; x.fillStyle=dawn?'rgba(255,176,206,'+(.45*P.d)+')':'rgba(255,150,104,'+(.5*d)+')'; x.fillRect(0,0,w,h); keep(); }
  if(P.gloom>.02){ x.globalCompositeOperation='multiply'; x.fillStyle=blRgb([1,1,1].map(()=>1-.28*P.gloom)); x.fillRect(0,0,w,h); keep(); }
  x.globalCompositeOperation='source-over'; }
function pwBuildLand(st){ const c=st.cfg, I=st.img; return (x,P)=>{ x.drawImage(I,0,0,c.IW,c.IH,0,0,c.IW,c.IH); pwLight(x,P,st.id,c.IW,c.IH,()=>x.drawImage(I,0,0,c.IW,c.IH,0,0,c.IW,c.IH)); }; }
/* the lake: the painted water from row W0 down, shaded like the palette's water, warmer at dusk, a soft moonlit lift at night */
function pwBuildLake(st){ const c=st.cfg, I=st.img, h=c.IH-c.W0; return (x,P)=>{ x.drawImage(I,0,c.IH+c.W0,c.IW,h,0,0,c.IW,h); pwLight(x,P,st.id,c.IW,h,()=>x.drawImage(I,0,c.IH+c.W0,c.IW,h,0,0,c.IW,h),'wMid');
  if(P.night>.2){ const gr=x.createLinearGradient(0,0,0,h); gr.addColorStop(0,'rgba(150,170,230,'+(.12*P.night)+')'); gr.addColorStop(1,'rgba(150,170,230,0)'); x.fillStyle=gr; x.fillRect(0,0,c.IW,h); } }; }
/* each picture column's waterline: the lowest land within the shore band, smoothed hard (one pixel of wobble moves a reflection two) */
function pwShore(st){ if(st.shore) return st.shore; const c=st.cfg, b0=c.WL-c.band[0], b1=c.WL+c.band[1], cv0=document.createElement('canvas'); cv0.width=c.IW; cv0.height=b1-b0; const x=cv0.getContext('2d',{willReadFrequently:true}); x.drawImage(st.img,0,b0,c.IW,b1-b0,0,0,c.IW,b1-b0);
  const d=x.getImageData(0,0,c.IW,b1-b0).data, raw=new Float32Array(c.IW); for(let X=0;X<c.IW;X++){ let low=c.WL-b0; for(let y=b1-b0-1;y>=0;y--) if(d[(y*c.IW+X)*4+3]>200){ low=y; break; } raw[X]=b0+low; }
  const avg=(a,r)=>{ const o=new Float32Array(a.length); for(let X=0;X<a.length;X++){ let s=0,n=0; for(let k=Math.max(0,X-r);k<=Math.min(a.length-1,X+r);k++){ s+=a[k]; n++; } o[X]=s/n; } return o; };
  return (st.shore=avg(avg(raw,90),90)); }
/* the land mirrored at its waterline, column by column, fading with depth, a little darker and cooler, fainter at night (same rows as the lake) */
function pwBuildRefl(st,land){ const c=st.cfg, h=c.IH-c.W0, wl=pwShore(st); return (x,P)=>{ const L=land(); x.save();
  for(let X=0;X<c.IW;X+=2){ const w0=wl[X], R=Math.min(w0,c.reflH); x.save(); x.translate(0,(w0-c.W0)*2); x.scale(1,-1); x.drawImage(L,X,w0-R,2,R,X,w0-c.W0-R,2,R); x.restore(); }
  x.restore(); x.globalCompositeOperation='destination-in'; const gr=x.createLinearGradient(0,c.WL-c.W0,0,c.WL-c.W0+c.reflH); gr.addColorStop(0,'rgba(0,0,0,'+(.62*(1-P.night*.35))+')'); gr.addColorStop(1,'rgba(0,0,0,0)'); x.fillStyle=gr; x.fillRect(0,0,c.IW,h);
  x.globalCompositeOperation='source-atop'; x.fillStyle='rgba(16,40,72,.22)'; x.fillRect(0,0,c.IW,h); x.globalCompositeOperation='source-over'; }; }
/* the ripple: a smooth sideways shift per screen row, stronger toward you and in storms */
const pwRipple = (P,t,M,c) => { const w0=M.oy+c.WL*M.s, Hh=Math.max(1,H-w0), A=BL_MOTION; return (y,iy)=>{ const k=clamp((y-w0)/Hh,0,1), T=t*A.rippleSpeed; return (Math.sin(T*1.1+iy*.11)*(.35+k*1.4)+Math.sin(T*.63+iy*.047+1.7)*.5+Math.sin(T*1.9+iy*.31)*.25*k)*M.s*A.ripple*(1+.9*P.gloom); }; };
function pwLive(id,P,t,hz,sun){ const st=PW[id], c=st.cfg; st.id=id; const M=pwMap(c,hz), s=M.s, calm=blCalm(), hi=gfxHigh(), h=c.IH-c.W0;
  const land=()=>blFaded('pw:'+id+':land',P,c.IW,c.IH,pwBuildLand(st)), ld=land(), lk=blFaded('pw:'+id+':lake',P,c.IW,h,pwBuildLake(st));
  const rip=calm?()=>0:pwRipple(P,t,M,c), st2=hi?2:3;
  blRows(lk,M,1,1,c.W0,0,c.W0,c.IW,h,st2,rip);
  if(c.reflect!==false){ const rf=blFaded('pw:'+id+':refl',P,c.IW,h,pwBuildRefl(st,land)); blRows(rf,M,1,1,c.W0,0,c.W0,c.IW,h,st2,rip); }
  const wt=Math.max(hz,M.oy+c.WT*s);
  if(c.waves&&!calm) pwWaves(P,t,M,c,lk,wt);
  pwSunPath(P,t,M,sun,wt,calm); v3glitter(P,t,wt,sun);
  if(c.rain!==false){ const wx=weather(), rain=(wx.k==='Rain'?1:wx.k==='Storm'?1.7:0)*(typeof wxAmt==='function'?wxAmt():1); /* rain rings, under the land (off where the shared weather layer draws them) */
    if(rain>.02){ g.lineWidth=1; for(let i=0,n=Math.round(50*rain);i<n;i++){ const per=1.3+(i%5)*.25, T=t+i*.41, q=(T%per)/per, r=v3rng(Math.floor(T/per)*31+i*7); r(); const iy=c.WT+10+Math.pow(r(),.8)*(c.IH-c.WT-30), k=(iy-c.WL)/(c.IH-c.WL), X=M.ox+r()*c.IW*s, Y=M.oy+iy*s, R=(2+k*9)*s*(.4+q);
      g.strokeStyle='rgba(225,238,255,'+(.4*(1-q))+')'; g.beginPath(); g.ellipse(X,Y,R,R*.32,0,0,7); g.stroke(); } } }
  if(c.mist&&P.night<.9){ const a=(.22+.2*P.d)*(1-P.night*.7); for(let i=0;i<3;i++){ const yy=M.oy+(c.WL-6+i*7)*s, xx=((t*(4+i*2)*s+i*400*s)%(W*1.6))-W*.3, gr=g.createLinearGradient(0,yy-10*s,0,yy+10*s); gr.addColorStop(0,'rgba(255,255,255,0)'); gr.addColorStop(.5,'rgba(255,255,255,'+a+')'); gr.addColorStop(1,'rgba(255,255,255,0)'); g.fillStyle=gr; g.fillRect(xx,yy-10*s,W*.9,20*s); } } /* morning mist drifting low over the far water */
  /* the land over the moving water and in front of the sky; the swaying parts are left out here and drawn leaning, a few pixels bigger than their gap */
  const sway=hi&&!calm&&c.sway, cut=(x0,y0,w,h2)=>g.rect(M.ox+x0*s,M.oy+y0*s,w*s,h2*s);
  g.save(); g.beginPath(); g.rect(-W,-H,W*3,H*3); if(sway) for(const [x0,y0,w,h2] of c.sway) cut(x0,y0,w,h2); g.clip('evenodd'); g.drawImage(ld,M.ox,M.oy,c.IW*s,c.IH*s); g.restore();
  if(sway) for(const [x0,y0,w,h2,amp,ph] of c.sway){ const a=Math.max(0,x0-3), b=Math.min(c.IW,x0+w+3); blLean(ld,M,a,Math.max(0,y0-3),b-a,Math.min(c.IH,y0+h2)-Math.max(0,y0-3),(Math.sin(t*.9+ph)+.35*Math.sin(t*.37+ph*2))*amp*s); }
  if(c.life) c.life(P,t,M); }
/* the clouds drift behind the land, the big ones slowest, tinted for the time of day */
function pwBuildClouds(st){ const c=st.cfg, I=st.img; return (x,P)=>{ x.drawImage(I,0,c.IH*2,c.IW,c.CB,0,0,c.IW,c.CB); let col=mix('#ffffff','#ffb89a',Math.min(1,P.d*1.2)); col=mix(col,'#4a5482',P.night); col=mix(col,'#9aa0aa',P.gloom*.7);
  x.globalCompositeOperation='multiply'; x.fillStyle=col; x.fillRect(0,0,c.IW,c.CB); x.globalCompositeOperation='destination-in'; x.drawImage(I,0,c.IH*2,c.IW,c.CB,0,0,c.IW,c.CB); x.globalCompositeOperation='source-over'; }; }
function pwSky(id,P,t,hz){ const st=PW[id], c=st.cfg; st.id=id; const M=pwMap(c,hz), s=M.s, cl=blFaded('pw:'+id+':clouds',P,c.IW,c.CB,pwBuildClouds(st)), calm=blCalm(); g.globalAlpha=(1-.25*P.night)*(1-P.gloom*.2);
  c.clouds.forEach(([x0,y0,w,h],i)=>{ const sw=w*s, v=calm?0:W*BL_MOTION.cloudSpeed*(1.25-.55*Math.min(1,w/560))*(i%2?1:.82), span=W+sw*2, X=(((M.ox+x0*s+sw+t*v)%span)+span)%span-sw; g.drawImage(cl,Math.max(0,x0),y0,w,h,X,M.oy+y0*s,sw,h*s); }); g.globalAlpha=1; }
/* fireflies after dusk, over the shores, the reeds and the near water, each wandering on its own slow loop and blinking (shared by painted waters) */
function pwFireflies(P,t,M,n){ const a0=clamp((P.night-.3)/.35,0,1); if(a0<=0) return; for(let i=0;i<n;i++){ const ph=i*2.39, r1=(i*.618)%1, r2=(i*.371)%1, x=W*(.02+r1*.96)+Math.sin(t*(.25+r2*.3)+ph)*W*.04+Math.sin(t*1.3+ph*2)*W*.006, y=H*(.36+r2*.58)+Math.sin(t*(.35+r1*.25)+ph*1.3)*H*.035, f=Math.max(0,Math.sin(t*(1.4+r2)+ph*3)); if(f<.05) continue; const R=H*(.006+r1*.008); v3glow(g,x,y,R*2.6,'rgba(210,255,140,.9)',a0*f*.75); g.fillStyle='rgba(245,255,200,'+(a0*f)+')'; g.beginPath(); g.arc(x,y,Math.max(.8,R*.35),0,7); g.fill(); } }
/* the sun's or the moon's path of light on the water: shimmering dashes straight under it, widening toward you, warm by day and at dusk, silver at night */
function pwSunPath(P,t,M,sun,wt,calm){ if(!sun||!(sun.vis>.03)||sun.x<-W*.1||sun.x>W*1.1) return; const night=!sun.up, col=night?'215,228,255':hex2rgb(rgb2hex(mix(P.glow||'#fff3cc','#ffffff',.3))).join(','), A=sun.vis*(night?.55:.38)*(1-P.gloom*.8);
  if(A<.02) return; g.save(); g.globalCompositeOperation='screen'; const n=gfxHigh()?46:28, span=H-wt;
  for(let i=0;i<n;i++){ const q=i/n, y=wt+Math.pow(q,1.25)*span, k=(y-wt)/span, w=(W*.012+k*W*.07)*(.5+.5*Math.abs(Math.sin(i*1.7+t*(calm?0:1.1)))), x=sun.x+(calm?0:Math.sin(t*1.6+i*.9)*W*.006*(1+k*3)), a=A*(1-k*.55)*(.45+.55*Math.abs(Math.sin(t*(calm?0:2.3)+i*2.1)));
    g.fillStyle='rgba('+col+','+a+')'; g.fillRect(x-w/2,y,w,Math.max(1,(1+k*2.5)*M.s*2)); }
  g.restore(); }
/* waves that travel: the painted lake drawn again drifting slowly sideways and toward you at low strength, so its wave pattern moves instead of only rippling,
   plus soft light crests rolling in from the far shore */
function pwWaves(P,t,M,c,lk,wt){ const s=M.s, h=c.IH-c.W0, dx=((t*9)%c.IW), Y0=M.oy+c.W0*s, Hh=h*s; g.save(); g.beginPath(); g.rect(0,wt,W,H-wt); g.clip(); g.globalAlpha=.28;
  for(const ox of [-dx,c.IW-dx]) g.drawImage(lk,0,0,c.IW,h,M.ox+ox*s,Y0+Math.sin(t*.5)*2*s,c.IW*s,Hh);
  g.globalAlpha=1; g.globalCompositeOperation='screen'; const light=(1-P.night*.6)*(1-P.gloom*.5);
  for(let i=0;i<9;i++){ const q=((t*.045+i/9)%1), y=wt+Math.pow(q,1.7)*(H-wt), k=(y-wt)/(H-wt), a=.09*light*Math.sin(q*Math.PI); if(a<.005) continue; const gr=g.createLinearGradient(0,y-2-k*6,0,y+2+k*6); gr.addColorStop(0,'rgba(255,255,255,0)'); gr.addColorStop(.5,'rgba(235,245,255,'+a+')'); gr.addColorStop(1,'rgba(255,255,255,0)'); g.fillStyle=gr; g.fillRect(0,y-2-k*6,W,4+k*12); }
  g.restore(); }

// ---------- the painted building and chair (placed from the angler) ----------
function pwHomeMake(id,cfg){ const st=PW[id]||(PW[id]={}); st.home=cfg; for(const [k,src] of [['hImg',cfg.house],['hGlow',cfg.glow],['hChair',cfg.chair]]){ const im=new Image(); im.onload=()=>{ im.ok=1; }; im.src=src; st[k]=im; }
  const sp=HOMEF[id]; sp.seatX=()=>{ if(!pwHomeOk(id)) return HF.pw()-W*.028; const {k,x0,sc}=pwHomeAt(id); return x0+cfg.sit*k-3*sc; }; sp.seatH=sp.seatH.map(()=>cfg.seatUnits); sp.draw=(t,night,dockY,P)=>pwHomeDraw(id,t,night,dockY,P);
  const fr=sp.front; sp.front=fr?(n,cx)=>{ if(!pwHomeOk(id)) fr(n,cx); }:null; }
const pwHomeOk = id => { const st=PW[id]; return !!(st&&st.hImg&&st.hImg.ok&&st.hGlow.ok&&st.hChair.ok&&pwOk(id)); };
const pwHomeAt = id => { const c=PW[id].home, sc=HF.sc(), k=c.k*sc; return {sc,k,x0:W*.12-c.stand*k}; };
function pwHomeBuild(id,img,glow){ return (x,P)=>{ const w=img.width, h=img.height; x.drawImage(img,0,0); pwLight(x,P,id,w,h,()=>x.drawImage(img,0,0)); const gl=clamp((P.night-.2)/.5,0,1); if(glow&&gl>0){ x.globalAlpha=gl*.95; x.drawImage(glow,0,0); x.globalAlpha=1; } }; }
function pwHomeDraw(id,t,night,dockY,P){ if(!pwHomeOk(id)||!P) return false; const st=PW[id], c=st.home, {sc,k,x0}=pwHomeAt(id), y0=dockY-c.deck*k, wl=y0+c.post*k-1, I=st.hImg, CHI=st.hChair;
  const C=blFaded('pwh:'+id,P,I.width,I.height,pwHomeBuild(id,I,st.hGlow)), CH=blFaded('pwc:'+id,P,CHI.width,CHI.height,pwHomeBuild(id,CHI,null));
  if(c.reflect!==false){ const ht=Math.min(H-wl,(c.post-c.reflTop)*k), stp=Math.max(3,Math.round(H/150)), calm=blCalm(); if(ht>0){ g.save(); for(let yy=0;yy<ht;yy+=stp){ const a=.55*Math.pow(1-yy/ht,1.1)*(1-P.night*.3); if(a<.01) break; const off=calm?0:Math.sin(t*1.3+yy*.13)*(.5+yy/ht*2.6)*BL_MOTION.ripple, sy=c.post-(yy+stp)/k; if(sy<0) break; g.globalAlpha=a; g.drawImage(C,0,sy,C.width,stp/k,x0+off,wl+yy,C.width*k,stp); } g.restore(); } } /* its reflection, mirrored at the posts' waterline */
  { const a0=.3-P.night*.12; g.lineWidth=1; c.posts.forEach((px0,i)=>{ const px=x0+px0*k, w=c.postW*k*.7, q=((t*.35+i*.37)%1); g.strokeStyle=v3rgba('#ffffff',a0); g.beginPath(); g.moveTo(px-w,wl+.5); g.lineTo(px+w,wl+.5); g.stroke(); g.strokeStyle=v3rgba('#ffffff',a0*(1-q)*.8); g.beginPath(); g.moveTo(px+w+q*w*3,wl+2+q*2); g.lineTo(px+w*2+q*w*4,wl+2+q*2); g.stroke(); }); } /* where the posts meet the water */
  g.drawImage(C,x0,y0,C.width*k,C.height*k);
  const ck=c.chairK*sc, cx=HOMEF[id].seatX()+3*sc-c.chairSit*ck; g.drawImage(CH,cx,dockY-c.chairFoot*ck,CH.width*ck,CH.height*ck);
  const gl=clamp((P.night-.2)/.5,0,1)*(1-P.gloom*.3); if(gl>.02){ const fl=.9+Math.sin(t*2.3)*.06+Math.sin(t*5.1)*.03;
    for(const [lx,ly,lr] of c.lanterns){ const X=x0+lx*k, Y=y0+ly*k; g.save(); g.globalCompositeOperation='screen'; const lg=g.createRadialGradient(X,Y,0,X,Y,lr*k); lg.addColorStop(0,'rgba(255,214,150,'+(.85*gl*fl)+')'); lg.addColorStop(.7,'rgba(255,170,90,'+(.45*gl*fl)+')'); lg.addColorStop(1,'rgba(255,150,80,0)'); g.fillStyle=lg; g.beginPath(); g.arc(X,Y,lr*k,0,7); g.fill(); g.restore();
      v3glow(g,X,Y,H*.08,'rgba(255,200,150,.85)',gl*.85*fl); v3lightPool(X-W*.01,dockY-1,W*.07,'255,200,150',.26*gl); v3lanternReflect(X,wl,gl,t,'255,200,150'); }
    for(const [wx,wy] of c.windows) v3glow(g,x0+wx*k,y0+wy*k,H*.05,'rgba(255,196,130,.8)',gl*.3); }
  return true; }
