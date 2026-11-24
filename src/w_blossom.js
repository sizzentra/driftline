// =====================================================================
// Cherry Blossom Lake: its whole scene in one file (Clean Scenes 5, 2026-11-22): the scene, then its extra life and its own moment
// (WA_MORE). Its colours (WA_PAL) and the newer waters' shared drawing helpers stay in cn_waterart.js.
// =====================================================================
/* the director's reference layout (2026-11-23 morning, docs/reference/blossom_director_ref.png): blue mountain ridges and forested hills in
   front of Fuji, a waterfall from a rocky cliff with a pavilion on top, a red arched bridge, a fenced stone path with lanterns along the left
   shore, the torii on a rocky islet */
function blossomForest(x,P,hz){ const N=c0=>mix(c0,P.farHaze,.15), r=v3rng(57);
  for(const [col,base,amp,seed] of [[mix('#4a6a9a',P.farHaze,.3),hz-H*.075,H*.05,3],[mix('#3a6458',P.farHaze,.2),hz-H*.05,H*.04,7],[mix('#2a5240',P.farHaze,.1),hz-H*.03,H*.03,11]]){ x.fillStyle=N(col); x.beginPath(); x.moveTo(0,hz); for(let X=0;X<=W;X+=8) x.lineTo(X,base-amp*(.5+.5*Math.sin(X/W*6.3+seed))*(.6+.4*Math.sin(X/W*15+seed*2))); x.lineTo(W,hz); x.closePath(); x.fill(); } /* rounded blue ridges */
  for(const [row,col,sz] of [[0,'#2e5a48',.03],[1,'#24503e',.036],[2,'#1e4634',.042]]){ x.fillStyle=N(mix(col,P.farHaze,.3-row*.1)); for(let X=-4;X<W+8;X+=W*.004){ const b=hz-H*(.05-row*.02)-H*.012*Math.sin(X/W*9+row*2), h=H*sz*(.6+r()*.6); x.beginPath(); x.moveTo(X-h*.28,b); x.lineTo(X,b-h); x.lineTo(X+h*.28,b); x.closePath(); x.fill(); } } /* two rows of conifers along the hills */ }
function blossomFalls(x,P,hz){ const N=c0=>mix(c0,P.farHaze,.15), fx=W*.7, top=hz-H*.15, cw=W*.075;
  x.fillStyle=N('#2e5a44'); x.beginPath(); x.moveTo(fx-cw,hz); x.bezierCurveTo(fx-cw*.9,top+H*.03,fx-cw*.5,top,fx-W*.008,top+H*.004); x.lineTo(fx+W*.01,top+H*.006); x.bezierCurveTo(fx+cw*.5,top+H*.01,fx+cw*.8,top+H*.04,fx+cw,hz); x.closePath(); x.fill();
  x.fillStyle=N('#6e6e76'); x.beginPath(); x.moveTo(fx-W*.022,hz); x.quadraticCurveTo(fx-W*.024,top+H*.03,fx-W*.01,top+H*.006); x.lineTo(fx+W*.012,top+H*.008); x.quadraticCurveTo(fx+W*.026,top+H*.04,fx+W*.024,hz); x.closePath(); x.fill(); x.fillStyle=N('#5a5a62'); for(let k=0;k<5;k++){ x.fillRect(fx-W*.022+k*W*.002,top+H*(.03+k*.02),W*.008,H*.004); x.fillRect(fx+W*.012-k*W*.001,top+H*(.035+k*.02),W*.01,H*.004); } /* the rock face around the fall, under a forested cliff */ x.fillStyle=N('#3a5a3a'); for(let k=0;k<5;k++){ x.beginPath(); x.ellipse(fx-cw*.7+k*cw*.35,top+H*(.012+(k%2)*.03),cw*.1,H*.006,0,0,7); x.fill(); } /* rock ledges with moss */ x.fillStyle=N('#2a5a3a'); for(let k=0;k<14;k++){ const tx=fx-cw*.9+k*cw*.13, tb=top+H*.012+Math.abs(k-7)*H*.008, th=H*(.02+(k%3)*.006); if(Math.abs(tx-fx)<W*.012) continue; x.beginPath(); x.moveTo(tx-th*.3,tb); x.lineTo(tx,tb-th); x.lineTo(tx+th*.3,tb); x.closePath(); x.fill(); } /* trees on the cliff */
  x.fillStyle=N('#e8f0f4'); x.fillRect(fx-W*.01,top+H*.006,W*.02,hz-top-H*.006); x.fillStyle=v3rgba('#c8dce8',.6); x.fillRect(fx-W*.01,top+H*.006,W*.004,hz-top-H*.006); x.fillStyle=v3rgba('#ffffff',.9); x.beginPath(); x.ellipse(fx,hz-H*.002,W*.016,H*.006,0,0,7); x.fill(); /* the fall and its foam */
  const px=fx-W*.012, pb=top+H*.004; x.fillStyle=N('#a8322a'); x.fillRect(px-W*.008,pb-H*.022,W*.0025,H*.022); x.fillRect(px+W*.006,pb-H*.022,W*.0025,H*.022); x.fillStyle=N('#2a2426'); x.beginPath(); x.moveTo(px-W*.016,pb-H*.02); x.quadraticCurveTo(px,pb-H*.028,px+W*.016,pb-H*.02); x.lineTo(px+W*.008,pb-H*.032); x.lineTo(px-W*.008,pb-H*.032); x.closePath(); x.fill(); x.fillRect(px-W*.002,pb-H*.038,W*.004,H*.006); /* the little pavilion on the cliff */ }
function blossomShore(x,P,hz){ const N=c0=>mix(c0,'#0e1630',P.night*.72), r=v3rng(31); /* rocky islets along the far shore under the cherries, as in the director's picture */
  for(const [a,b] of [[.24,.37],[.6,.67],[.84,1.01]]){ for(let i=0;i<10;i++){ const X=W*(a+(b-a)*r()), s=1+r()*1.1; x.fillStyle=N(['#8a8a90','#9a9aa2','#6e6e78'][i%3]); x.beginPath(); x.ellipse(X,hz+H*.008,W*.014*s,H*.018*s,0,Math.PI,0); x.fill(); x.fillStyle=v3rgba('#ffffff',.18*(1-P.night)); x.beginPath(); x.ellipse(X-W*.003*s,hz+H*.002-H*.006*s,W*.004*s,H*.003*s,0,0,7); x.fill(); } x.fillStyle=N('#4a8a3a'); x.beginPath(); x.ellipse(W*(a+b)/2,hz-H*.004,W*(b-a)*.45,H*.012,0,Math.PI,0); x.fill(); x.fillStyle=v3rgba('#ffffff',.25); x.fillRect(W*a,hz+H*.007,W*(b-a),1); } }
function blossomIsland(x,P,hz){ const N=c0=>mix(c0,'#0e1630',P.night*.72), a=W*.48, b=W*.6, y=hz+H*.012; x.fillStyle=N('#4a7a3a'); x.beginPath(); x.moveTo(a,y); x.quadraticCurveTo((a+b)/2,hz-H*.012,b,y); x.closePath(); x.fill(); for(let i=0;i<9;i++){ x.fillStyle=N(i%2?'#7a756c':'#8e887c'); x.beginPath(); x.ellipse(a+(b-a)*i/8,y,W*.006,H*.005,0,Math.PI,0); x.fill(); } x.fillStyle=v3rgba('#ffffff',.25); x.fillRect(a,y+1,b-a,1); } /* the little island past the bridge */
function blossomBridge(x,P,hz){ const a=W*.38, b=W*.48, y=hz+H*.012, h=H*.035, red=mix('#c8382a',P.wBot,P.night*.55), N=c0=>mix(c0,P.wBot,P.night*.5);
  x.strokeStyle=red; x.lineWidth=Math.max(3,H*.006); x.beginPath(); x.moveTo(a,y); x.quadraticCurveTo((a+b)/2,y-h*2,b,y); x.stroke(); x.lineWidth=Math.max(2,H*.003); x.beginPath(); x.moveTo(a,y-h*.5); x.quadraticCurveTo((a+b)/2,y-h*2.5,b,y-h*.5); x.stroke();
  x.fillStyle=red; for(let k=0;k<=8;k++){ const u=k/8, px=a+(b-a)*u, py=y-h*2*2*u*(1-u)*1; x.fillRect(px-1.5,py-h*.5,3,h*.5); } x.fillStyle=N('#5a3a2a'); x.fillRect(a-2,y,4,H*.012); x.fillRect(b-2,y,4,H*.012); x.fillRect((a+b)/2-2,y-h*.6,4,h*.6+H*.012);
  x.strokeStyle=v3rgba(red,.3); x.lineWidth=2; x.beginPath(); x.moveTo(a,y+H*.006); x.quadraticCurveTo((a+b)/2,y+h*1.8,b,y+H*.006); x.stroke(); /* its reflection */ }
/* THE LAYERED PAINTING (director, 2026-11-23: the Cherry Blossom painting split into layers by ChatGPT so the sky, clouds and water can live):
   the land by day, at dusk and at night (keyed to see-through sky and water), the lake water, its reflections and six clouds, all in
   src/w_blossom_art.js (made from art/blossom_layers/). The game's own sky shows through the land (its colours for dawn, day, dusk and night,
   stars, sun and moon), the painted clouds drift in it behind the mountains, the lake ripples under the land with its reflections, and the
   land crossfades between its three lightings. Everything painted is drawn every frame by live() (land() leaves the stored scenery empty),
   so the light changes in fine, overlapping fades instead of the stored scenery's few big steps (director, 2026-11-23: "the image gets blurry
   during dusk and dawn transitions, and the transitions don't happen in a smooth manner"). The drawn scene stays while the picture loads. */
const BL_IW=1680, BL_IH=845, BL_WL=358, BL_WT=402, BL_WT0=325; /* the picture's size, its waterline row, the row below the islands and the torii's feet where water effects may start, the top row of the stored lake */
const BL_IMG=new Image(); BL_IMG.onload=()=>{ BL_IMG.ok=1; V3CACHE=null; V3PREV=null; v3land.job=null; }; BL_IMG.src=BLOSSOM_ART;
const BL_CLOUDS=[[387,38,578,130,0,2795],[1273,48,370,109,580,2795],[35,184,393,107,952,2795],[780,194,366,100,0,2927],[1087,138,190,43,368,2927],[196,72,158,33,560,2927]]; /* each cloud: where it sits in the sky (x, y, w, h) and where it is stored (x, y) */
const BL_TREE=[0,0,710,225]; /* the big cherry tree over the top left: it sways */
const BL_FALL=[1310,236,48,110]; /* the painted waterfall's box: x, y, w, h */
const BL_FLOWERS=[[0,210,668,845,0],[650,730,712,782,2.9],[1100,1260,770,845,2.1],[1270,1345,700,800,1.4],[1560,1680,640,845,3.7]]; /* shore flowers and grass: x from-to, y from-to, phase */
/* REFLECTIONS made from the land itself (director, 2026-11-23: ChatGPT's painted reflections were "just off in general"): every column of the
   picture is mirrored at its own waterline, so each reflection sits exactly under what it mirrors and follows the light of the land.
   The far shore mirrors at a smoothed shoreline; what stands out in front of it (the island, the torii's feet) mirrors at its own base as a
   whole (BL_REFL_OBJ, measured on this painting). The waterlines are worked out once from the painting's outline. */
const BL_REFL_FLAT=[[640,910,362]]; /* the bridge mirrors at one fixed line: the waterline of its posts */
const BL_REFL_OBJ=[[838,908,44,1,1],[880,1140,205,1,1],[1445,1605,205,1,1]]; /* x from-to, how tall, soft left side, soft right side: under the bridge's right end only the island's rocks (their bottom 44 rows) mirror, column by column at their own waterline and partly see-through, while the bridge above keeps the water's; then the rest of the island; the torii */ /* what stands out in front of the far shore and mirrors at its own base: the island, the torii (measured: island waterline about row 383, the torii's stones 396; the far shore and the bridge over it about 360-366; the island starts after the bridge ends at 895, so the whole bridge mirrors at the water under it) */
function blShore(){ if(blShore.v) return blShore.v; const c=document.createElement('canvas'); c.width=BL_IW; c.height=140; const x=c.getContext('2d'); x.drawImage(BL_IMG,0,280,BL_IW,140,0,0,BL_IW,140); const a=x.getImageData(0,0,BL_IW,140).data, IW=BL_IW;
  const cont=new Float32Array(IW); for(let X=0;X<IW;X++){ let y0=BL_WL; for(let y=138;y>=0;y--){ if(a[(y*IW+X)*4+3]>128){ y0=280+y; break; } } cont[X]=y0; } /* the lowest land in each column between rows 280 and 420 */
  const med=(X,r,keep)=>{ const w=[]; for(let k=Math.max(0,X-r);k<Math.min(IW,X+r+1);k++) if(keep(cont[k])) w.push(cont[k]); if(!w.length) return null; w.sort((p,q)=>p-q); return w[w.length>>1]; };
  const shoreY=y=>y>=352&&y<=372; /* real far-shore waterlines only: not the island (378-384), the torii's stones (396), the gap under the bridge (332) or the waterfall's foam (347) */
  const far=new Float32Array(IW); for(let X=0;X<IW;X++){ let v=med(X,40,shoreY); if(v==null) v=med(X,160,shoreY); far[X]=v==null?363:v; } /* the far shore's waterline: the usual level nearby, ignoring the island, the torii's feet and the gap under the bridge */
  const box=(src,r)=>{ const o=new Float32Array(IW); for(let X=0;X<IW;X++){ let s=0,n=0; for(let k=Math.max(0,X-r);k<Math.min(IW,X+r+1);k++){ s+=src[k]; n++; } o[X]=s/n; } return o; };
  for(const [a,b,y] of BL_REFL_FLAT) for(let X=a;X<b;X++) far[X]=y;
  const fs=box(box(far,90),90); for(const [a,b,y] of BL_REFL_FLAT) for(let X=a;X<b;X++) fs[X]=y; /* smoothed hard, so no reflection jogs (a 1 px step in the mirror line moves the reflection 2 px: director, 2026-11-23, "this clearly doesn't line up") */
  const near=BL_REFL_OBJ.map(([x0,x1,h,fl,fr])=>{ const v=[]; for(let k=x0;k<x1;k++) v.push(cont[k]); v.sort((p,q)=>p-q); return [x0,x1-x0,Math.round(v[Math.floor(v.length*.9)]),h,fl,fr,h<=60?cont.slice(x0,x1):null]; }); /* a low strip (rocks) mirrors column by column at its own waterline */
  const runs=[]; for(let X=0;X<IW;){ const ax=Math.round(fs[X]); let e=X+1; while(e<IW&&Math.round(fs[e])===ax) e++; runs.push([X,e-X,ax]); X=e; }
  return blShore.v={runs,near}; }
/* the reflections for this light, drawn onto the lake (image coordinates, half size): the far shore, then the objects in front over it, each
   fading toward its far end; darker and bluer than the land, fainter at night */
function blReflect(x,P,land){ const {runs,near}=blShore(), mk=n=>blReflect[n]||(blReflect[n]=document.createElement('canvas')), R=mk('r'), T=mk('t'), K=mk('k'), LT=mk('l');
  LT.width=BL_IW; LT.height=BL_IH; const lt=LT.getContext('2d'); lt.drawImage(land,0,0); { const [tx,ty,tw,th]=BL_TREE, e=70; lt.globalCompositeOperation='destination-out'; lt.fillStyle='#000'; lt.fillRect(tx,ty,tw-e,th-e*.5); const hg=lt.createLinearGradient(tx+tw-e,0,tx+tw,0); hg.addColorStop(0,'#000'); hg.addColorStop(1,'rgba(0,0,0,0)'); lt.fillStyle=hg; lt.fillRect(tx+tw-e,ty,e,th-e*.5); const vg=lt.createLinearGradient(0,ty+th-e*.5,0,ty+th); vg.addColorStop(0,'#000'); vg.addColorStop(1,'rgba(0,0,0,0)'); lt.fillStyle=vg; lt.fillRect(tx,ty+th-e*.5,tw-e,e*.5); lt.globalCompositeOperation='source-over'; } /* the big cherry tree is in front of the lake, not on its shore: it is not mirrored */
  const ctx=c=>{ c.width=BL_IW; c.height=BL_IH-BL_WT0; const r=c.getContext('2d'); r.setTransform(1,0,0,1,0,-BL_WT0); return r; }, r=ctx(R), t=ctx(T), k=ctx(K);
  const flip=(q,x0,w,ax,len)=>{ const top=Math.max(0,ax-len); q.save(); q.beginPath(); q.rect(x0,ax,w,len); q.clip(); q.translate(0,ax*2); q.scale(1,-1); q.drawImage(LT,x0,top,w,ax-top,x0,top,w,ax-top); q.restore(); };
  for(const [x0,w,ax] of runs) flip(r,x0,w,ax,BL_IH-ax); /* the far shore */
  const F=28; for(const [x0,w,ax,NL,fl,fr,col] of near){ if(col){ for(let i=0;i<w;i++){ const cx=x0+i, ay=Math.round(col[i]), e=.55*Math.min(1,fl?i/F:1,fr?(w-1-i)/F:1); /* the rocks' reflection lets the bridge's show through, so the arch stays whole */ flip(t,cx,1,ay,NL); const vg=k.createLinearGradient(0,ay,0,ay+NL); vg.addColorStop(0,'rgba(0,0,0,'+e+')'); vg.addColorStop(.6,'rgba(0,0,0,'+e+')'); vg.addColorStop(1,'rgba(0,0,0,0)'); k.fillStyle=vg; k.fillRect(cx,ay,1,NL); } continue; } flip(t,x0,w,ax,NL); /* each object in front at its own base, blended in with soft sides and a soft far end */
    const hg=k.createLinearGradient(x0,0,x0+w,0), f=Math.min(.45,F/w); hg.addColorStop(0,fl?'rgba(0,0,0,0)':'#000'); hg.addColorStop(f,'#000'); hg.addColorStop(1-f,'#000'); hg.addColorStop(1,fr?'rgba(0,0,0,0)':'#000'); k.fillStyle=hg; k.fillRect(x0,ax,w,NL);
    k.globalCompositeOperation='destination-out'; const vg=k.createLinearGradient(0,ax+NL*.6,0,ax+NL); vg.addColorStop(0,'rgba(0,0,0,0)'); vg.addColorStop(1,'rgba(0,0,0,1)'); k.fillStyle=vg; k.fillRect(x0,ax+NL*.6,w,NL*.4); k.globalCompositeOperation='source-over'; }
  for(const q of [r,t,k]) q.setTransform(1,0,0,1,0,0);
  t.globalCompositeOperation='destination-in'; t.drawImage(K,0,0); r.globalCompositeOperation='destination-out'; r.drawImage(K,0,0); r.globalCompositeOperation='source-over'; r.drawImage(T,0,0);
  { const Mk=mk('m'); Mk.width=840; Mk.height=(BL_IH-BL_WT0)/2; Mk.getContext('2d').drawImage(R,0,0,840,Mk.height); } /* the full shape of the land's reflection, before it fades with depth: the sky's reflection (blSkyRefl) never shows through it (director, 2026-11-23: "cloud reflection doesn't go behind mountains") */
  r.globalCompositeOperation='destination-in'; const fg=r.createLinearGradient(0,0,0,BL_IH-BL_WT0); fg.addColorStop(0,'rgba(0,0,0,1)'); fg.addColorStop(.45,'rgba(0,0,0,.6)'); fg.addColorStop(1,'rgba(0,0,0,.18)'); r.fillStyle=fg; r.fillRect(0,0,BL_IW,BL_IH-BL_WT0); /* fading with depth */
  r.globalCompositeOperation='source-atop'; r.fillStyle='rgba(24,44,78,.22)'; r.fillRect(0,0,BL_IW,BL_IH-BL_WT0); r.globalCompositeOperation='source-over'; /* water darkens and cools a reflection */
  const ra=(.85-.35*P.night)*(1-.2*P.gloom); x.globalAlpha=ra; x.drawImage(R,0,0); x.globalAlpha=1;
  }
/* the speeds and strengths of the motion, in one place for tuning (ChatGPT's animation notes, 2026-11-23: subtle, natural, never a moving wallpaper) */
const BL_MOTION={ripple:1.4, rippleSpeed:1, cloudSpeed:.0045, sway:1.6, flowers:2, fall:1, fade:1.3, steps:32};
/* picture pixels to screen (X*s+ox, Y*s+oy): it always covers the screen with its waterline on the horizon; where it is wider than the screen
   the left side goes (the game's home stands there) and the torii on the right stays */
function blMap(hz){ const s=Math.max(W/BL_IW,(H-hz)/(BL_IH-BL_WL),hz/BL_WL); return {s,ox:W-BL_IW*s,oy:hz-BL_WL*s}; }
const blDawn = () => { const p=phase(); return p>.75||p<.2; }; /* the morning side of the clock (dawn and dusk share one palette) */
const blCalm = () => V3PAR.rm.matches; /* reduced motion: the scene holds still */
const blKey = P => { const n=BL_MOTION.steps; return Math.round(P.night*n)+'|'+Math.round(P.d*n)+'|'+Math.round(P.gloom*n/2)+'|'+(blDawn()?1:0); }; /* the light level the painted layers are built for */
/* the palette's colour over its daytime colour, as a multiply colour (how much darker and bluer this light is than day) */
function blShade(P,k){ const a=hex2rgb(rgb2hex(P[k])), b=hex2rgb(rgb2hex(V3PAL.blossom.day[k])); return a.map((v,i)=>Math.min(1,v/Math.max(8,b[i]))); }
const blRgb = f => 'rgb('+f.map(v=>Math.round(v*255)).join(',')+')';
/* a painted layer for the light on screen, built when the light level changes and faded in over the last one (never a jump) */
function blFaded(slot,P,w,h,build){ const S=blFaded[slot]||(blFaded[slot]={}), key=blKey(P), now=performance.now(), away=now-(S.used||-1e9)>500; S.used=now;
  if(S.key!==key){ const cv=S.free||document.createElement('canvas'); S.free=null; if(S.cur){ if(S.prev) S.free=S.prev; if(away){ S.free=S.free||S.cur; S.prev=null; } else { S.prev=S.cur; S.t0=now; } } cv.width=w; cv.height=h; build(cv.getContext('2d'),P); S.cur=cv; S.key=key; } /* back after a while (a new arrival, or another screen): the right light at once; fades only while you watch */
  else if(away&&S.prev){ S.free=S.free||S.prev; S.prev=null; }
  if(!S.prev) return S.cur; const k=(now-S.t0)/1000/BL_MOTION.fade; if(k>=1){ S.free=S.free||S.prev; S.prev=null; return S.cur; }
  const m=S.mix||(S.mix=document.createElement('canvas')); if(m.width!==w||m.height!==h){ m.width=w; m.height=h; } const x=m.getContext('2d'); x.clearRect(0,0,w,h); x.drawImage(S.prev,0,0); x.globalAlpha=v3s(k); x.drawImage(S.cur,0,0); x.globalAlpha=1; return m; }
/* the land in this light: day, then shaded toward the light (so any petal gaps of the dusk and night paintings stay dark), then the dusk and
   night paintings over it; dawn borrows half the dusk painting with a cool pink light; weather greys it */
function blBuildLand(x,P){ const dawn=blDawn(), n=P.night, d=P.d*(dawn?.55:1), mask=()=>{ x.globalCompositeOperation='destination-in'; x.drawImage(BL_IMG,0,0,BL_IW,BL_IH,0,0,BL_IW,BL_IH); x.globalCompositeOperation='source-over'; };
  x.drawImage(BL_IMG,0,0,BL_IW,BL_IH,0,0,BL_IW,BL_IH);
  if(n>.01||d>.01){ x.globalCompositeOperation='multiply'; x.fillStyle=blRgb(blShade(P,'far')); x.fillRect(0,0,BL_IW,BL_IH); mask(); }
  if(d>.01){ x.globalAlpha=Math.min(1,d); x.drawImage(BL_IMG,0,845,BL_IW,BL_IH,0,0,BL_IW,BL_IH); }
  if(n>.01){ x.globalAlpha=Math.min(1,n); x.drawImage(BL_IMG,0,1690,BL_IW,BL_IH,0,0,BL_IW,BL_IH); } x.globalAlpha=1;
  if(dawn&&P.d>.02){ x.globalCompositeOperation='soft-light'; x.fillStyle='rgba(255,176,206,'+(.45*P.d)+')'; x.fillRect(0,0,BL_IW,BL_IH); mask(); }
  if(P.gloom>.02){ x.globalCompositeOperation='multiply'; x.fillStyle=blRgb([1,1,1].map(()=>1-.28*P.gloom)); x.fillRect(0,0,BL_IW,BL_IH); mask(); } }
/* the lake in this light: the painted water shaded like the palette's water, a soft
   moonlit lift at night, warmed at dusk, pink at dawn, catching the sky's horizon colour near the far shore. Half size (soft, always rippling). */
function blBuildLake(x,P){ const dawn=blDawn(), n=P.night;
  x.drawImage(BL_IMG,0,2535,840,260,0,0,BL_IW,BL_IH-BL_WT0); /* full size, so the reflections drawn on it stay sharp on big screens */
  const f=blShade(P,'wMid'); if(f.some(v=>v<.995)){ x.globalCompositeOperation='multiply'; x.fillStyle=blRgb(f); x.fillRect(0,0,BL_IW,BL_IH-BL_WT0); }
  if(n>.05){ x.globalCompositeOperation='screen'; x.fillStyle='rgba(70,92,150,'+(.24*n)+')'; x.fillRect(0,0,BL_IW,BL_IH-BL_WT0); x.globalCompositeOperation='saturation'; x.fillStyle='rgba(128,128,128,'+(.35*n)+')'; x.fillRect(0,0,BL_IW,BL_IH-BL_WT0); }
  if(P.d>.02){ x.globalCompositeOperation='soft-light'; x.fillStyle=dawn?'rgba(255,180,210,'+(.45*P.d)+')':'rgba(255,140,90,'+(.45*P.d)+')'; x.fillRect(0,0,BL_IW,BL_IH-BL_WT0); }
  x.globalCompositeOperation='soft-light'; const sg=x.createLinearGradient(0,0,0,300); sg.addColorStop(0,v3rgba(P.bot,.55)); sg.addColorStop(1,v3rgba(P.bot,0)); x.fillStyle=sg; x.fillRect(0,0,BL_IW,300); /* the sky's colour on the far water */
  if(P.gloom>.02){ x.globalCompositeOperation='multiply'; x.fillStyle=blRgb([1,1,1].map(()=>1-.3*P.gloom)); x.fillRect(0,0,BL_IW,BL_IH-BL_WT0); }
  x.globalCompositeOperation='source-over'; const L=blFaded.land&&blFaded.land.cur; if(L) blReflect(x,P,L); } /* then the land's own reflections, already in this light */
/* the clouds in this light: white by day, pink at dawn, peach at dusk, slate blue at night, grey in bad weather */
function blBuildClouds(x,P){ const dawn=blDawn(); x.drawImage(BL_IMG,0,2795,BL_IW,232,0,0,BL_IW,232); let col=mix('#ffffff',dawn?'#ffc8d8':'#ffb08c',Math.min(1,P.d*1.2)); col=mix(col,'#4a5482',P.night); col=mix(col,'#9aa0aa',P.gloom*.7);
  x.globalCompositeOperation='multiply'; x.fillStyle=col; x.fillRect(0,0,BL_IW,232); x.globalCompositeOperation='destination-in'; x.drawImage(BL_IMG,0,2795,BL_IW,232,0,0,BL_IW,232); x.globalCompositeOperation='source-over'; }
/* rows of a stored picture redrawn on screen in thin strips, each shifted sideways by fn(screen y): the ripples. The picture's pixel (X, Y)
   is at (X*kx, (Y-oy0)*ky) in C; x0, y0, w, h are picture pixels; st is the strip height on screen. */
function blRows(C,M,kx,ky,oy0,x0,y0,w,h,st,fn){ const s=M.s, X0=M.ox+x0*s, Y0=Math.max(0,Math.floor(M.oy+y0*s)), Y1=Math.min(H,M.oy+(y0+h)*s), cy=C.height;
  for(let y=Y0;y<Y1;y+=st){ const iy=(y-M.oy)/s, sy=(iy-oy0)*ky, sh=st/s*ky; if(sy<0||sy>=cy) continue; g.drawImage(C,x0*kx,sy,w*kx,Math.min(sh,cy-sy),X0+fn(y,iy),y,w*s,st); } }
/* a piece of the land (picture pixels x0, y0, w, h) drawn leaning from its foot, its top shifted amp screen pixels: one smooth skew, no seams */
function blLean(C,M,x0,y0,w,h,amp){ const s=M.s; g.save(); g.translate(M.ox+x0*s,M.oy+(y0+h)*s); if(amp) g.transform(1,0,-amp/(h*s),1,0,0); g.drawImage(C,x0,y0,w,h,0,-h*s,w*s,h*s); g.restore(); }
/* the waterfall flows (director, 2026-11-23: the moving pieces showed each time they looped, and stuck up above the lip): a seamless streak
   texture scrolls down at two speeds, cut to the painted falling water's own shape, so nothing ever shows outside it or repeats a visible piece */
function blFallMask(){ if(blFallMask.c) return blFallMask.c; const [fx,fy,fw,fh]=BL_FALL, c=document.createElement('canvas'); c.width=fw; c.height=fh; const x=c.getContext('2d'); x.drawImage(BL_IMG,fx,fy,fw,fh,0,0,fw,fh);
  const D=x.getImageData(0,0,fw,fh), d=D.data; for(let i=0;i<d.length;i+=4){ const r=d[i],gg=d[i+1],b=d[i+2], wet=b>150&&b>=r+8&&gg>140||(r>200&&gg>200&&b>200); d[i]=d[i+1]=d[i+2]=255; d[i+3]=wet?255:0; } x.putImageData(D,0,0); return blFallMask.c=c; }
function blFallTex(){ if(blFallTex.c) return blFallTex.c; const c=document.createElement('canvas'); c.width=48; c.height=128; const x=c.getContext('2d'), r=v3rng(77);
  for(let i=0;i<46;i++){ const sx=r()*48, sy=r()*128, len=10+r()*36, w=.6+r()*1.6, a=.25+r()*.5; x.fillStyle='rgba(255,255,255,'+a+')'; for(const o of [-128,0,128]) x.fillRect(sx,sy+o,w,len); } return blFallTex.c=c; } /* drawn three times a tile apart, so it repeats without a seam */
function blFall(M,P,t){ const [fx,fy,fw,fh]=BL_FALL, s=M.s, dim=1-P.night*.6, T=blFall.c||(blFall.c=document.createElement('canvas')); T.width=fw*2; T.height=fh*2; const x=T.getContext('2d'), tex=blFallTex(), sp=BL_MOTION.fall;
  for(const [v,a,sc] of [[70,.55,1],[120,.4,.75]]){ const off=((t*v*sp)%(128*sc)); x.globalAlpha=a; x.save(); x.scale(sc,sc); x.fillStyle=x.createPattern(tex,'repeat'); x.translate(0,off/sc); x.fillRect(0,-128,fw*2/sc,fh*2/sc+128); x.restore(); } x.globalAlpha=1;
  x.globalCompositeOperation='destination-in'; x.drawImage(blFallMask(),0,0,fw*2,fh*2); x.globalCompositeOperation='source-over';
  g.globalAlpha=dim; g.drawImage(T,M.ox+fx*s,M.oy+fy*s,fw*s,fh*s); g.globalAlpha=1;
  const cx=M.ox+(fx+fw*.5)*s, bt=M.oy+(fy+fh*.9)*s, w=fw*.8*s;
  for(let i=0;i<9;i++){ const q=((t*.5+i/9)%1), dx=(i%2?1:-1)*(.2+q*.9)*w*.8*(.5+((i*3)%4)*.18), r=w*(.12+q*.3); g.fillStyle=v3rgba('#ffffff',(.4*(1-q))*dim); g.beginPath(); g.ellipse(cx+dx*.6,bt-r*.2-q*w*.15,r,r*.55,0,0,7); g.fill(); } /* foam boiling out at the foot */
  v3glow(g,cx,bt-w*.1,w*1.4,'rgba(235,245,255,.8)',(.22+.06*Math.sin(t*1.7))*dim); } /* and its mist */
/* life in the water, drawn under the land (glints), and life in the air over it (butterflies, dragonflies, birds, fireflies); no koi and
   no leaping fish (director, 2026-11-23: "the koi fish needs to be removed", "i dont want fish jumping on this map") */
function blWaterLife(P,t,M,wt,sun){ const s=M.s, X=v=>M.ox+v*s, Y=v=>M.oy+v*s;
  if(gfxHigh()&&sun.vis>.1) for(let i=0;i<22;i++){ const per=2.6+(i%5)*.5, q=((t+i*.83)%per)/per, r=v3rng(Math.floor((t+i*.83)/per)*7+i*101), x=X(300+r()*1330), y=Y(410+r()*260); if(y<wt) continue; g.fillStyle=v3rgba('#ffffff',Math.sin(q*Math.PI)*.7*sun.vis); g.fillRect(x-3*s,y,6*s,Math.max(1,s)); } /* glints on the water */ }
function blAirLife(P,t,M){ const s=M.s, X=v=>M.ox+v*s, Y=v=>M.oy+v*s, day=1-P.night;
  if(day>.2){ for(const [cx,cy,c,ph] of [[110,690,'#fff6c8',0],[1640,680,'#ffffff',2],[1180,775,'#ffd2e4',4]]){ const a=t*.6+ph, x=X(cx+Math.sin(a)*60+Math.sin(a*2.3)*20), y=Y(cy+Math.cos(a*1.3)*30-20), f=Math.abs(Math.sin(t*14+ph)), w=6*s; /* butterflies over the shore flowers */
      g.globalAlpha=day; g.fillStyle=c; g.beginPath(); g.ellipse(x-w*.5,y,w*.6*f+.5,w*.45,-.4,0,7); g.ellipse(x+w*.5,y,w*.6*f+.5,w*.45,.4,0,7); g.fill(); g.fillStyle='#3a2a2a'; g.fillRect(x-.6,y-w*.4,1.2,w*.8); g.globalAlpha=1; }
    for(let i=0;i<2;i++){ const T=t/3+i*1.7, seg=Math.floor(T), u=T-seg, pt=n=>{ const r=v3rng(n*13+i*977); return [480+r()*860,420+r()*150]; }, A=pt(seg), B=pt(seg+1), e=u<.35?Math.sqrt(u/.35):1, x=X(A[0]+(B[0]-A[0])*e), y=Y(A[1]+(B[1]-A[1])*e)+Math.sin(t*9+i)*1.2, L=11*s, dir=B[0]>A[0]?1:-1, fl=.5+.5*Math.sin(t*60+i); /* dragonflies dart, then hover */
      g.globalAlpha=day; g.fillStyle=v3rgba('#e8f4ff',.35+.25*fl); g.beginPath(); g.ellipse(x-dir*L*.05,y-L*.12,L*.32,L*.08,-.3*dir,0,7); g.ellipse(x+dir*L*.12,y-L*.12,L*.3,L*.07,.3*dir,0,7); g.fill(); g.strokeStyle='#2a7a8a'; g.lineWidth=Math.max(1.2,1.6*s); g.beginPath(); g.moveTo(x-dir*L*.55,y); g.lineTo(x+dir*L*.35,y); g.stroke(); g.fillStyle='#1a4a5a'; g.beginPath(); g.arc(x+dir*L*.38,y,L*.08,0,7); g.fill(); g.globalAlpha=1; } }
  if(P.night>.4) for(let i=0;i<16;i++){ const k=i%5, x=X([110,290,1620,1170,540][k]+Math.sin(t*.4+i*2.1)*70), y=Y([690,780,670,770,800][k]-30+Math.sin(t*.55+i*1.3)*40), a=(P.night-.4)/.6*(.5+.5*Math.sin(t*2.6+i*1.9)); if(a>.05) v3glow(g,x,y,5*s+3,'rgba(220,255,140,.9)',a); } } /* fireflies by the shore at night */
/* where each painted cloud is on screen now: drifting, the big ones slowest, each at its own pace (shared by the sky and its reflection) */
function blCloudAt(i,t,M,calm){ const [sx,sy,w,h]=BL_CLOUDS[i], s=M.s, sw=w*s, sh=h*s, v=calm?0:W*BL_MOTION.cloudSpeed*(1.25-.55*w/578)*(i%2?1:.82), span=W+sw*2; return [(((M.ox+sx*s+sw+t*v)%span)+span)%span-sw, M.oy+sy*s+(calm?0:Math.sin(t*.05+i*1.7)*s*1.5), sw, sh]; }
/* a small flock crosses the sky behind the big cherry tree and the hills (director, 2026-11-23: "birds appear over the tree when they need to appear behind it") */
function blBirds(P,t,M){ const day=1-P.night, s=M.s; if(day<=.15) return; const q=(t%58)/58; if(q>=.5) return; const e=q/.5; g.strokeStyle=v3rgba('#2a2a3a',.75*day); g.lineWidth=Math.max(1,1.4*s);
  for(let i=0;i<5;i++){ const x=W*(1.08-e*1.25)+i*16*s+(i%2)*6*s, y=M.oy+(70+i*7+(i%2)*5)*s+Math.sin(t*2+i)*2, f=Math.sin(t*10+i*1.3), w=7*s; g.beginPath(); g.moveTo(x-w,y-f*w*.5); g.quadraticCurveTo(x-w*.4,y-w*.3,x,y); g.quadraticCurveTo(x+w*.4,y-w*.3,x+w,y-f*w*.5); g.stroke(); } }
/* SKY LANTERNS at night (director, 2026-11-23: "white paper lanterns, and they need to float in the sky, not in the water"): white paper lanterns
   lit warm from inside cross from beyond the left edge to beyond the right, climbing on a diagonal; near ones bigger and faster, far ones small and slow;
   all in front of the hills (none behind the mountains) and behind the big tree, with a soft glow; the lake mirrors each one. Positions in picture pixels. */
const BL_LANTERNS=10;
function blLanterns(P,t){ const a0=clamp((P.night-.3)/.3,0,1)*(1-P.gloom*.7), out=[]; if(a0<=0) return out; const n=gfxHigh()?BL_LANTERNS:6;
  for(let i=0;i<n;i++){ const base=70+(i*13)%23, r0=v3rng(i*991+5), zc=r0()<.35?.95+r0()*.3:.35+r0()*.5, per=base/(.55+.45*zc), T=t+((i*.618)%1)*per+i*3.1, /* spread evenly along the way, never bunched (director: "too cluttered") */ cyc=Math.floor(T/per), q=(T%per)/per, r=v3rng(cyc*53+i*7);
    const z=clamp(zc+(r()-.5)*.1,.3,1.25), y0=300+r()*80, rise=230+170*z+r()*80; /* from beyond the left edge to beyond the right, climbing on a diagonal (director, 2026-11-23) */
    const x=-90+q*(BL_IW+180), y=y0-q*rise+Math.sin(T*.5+i)*6*z, a=.8*a0*Math.min(1,(y+120)/80)*(.85+.15*Math.sin(t*3.1+i*2.3)); if(a<=.01) continue;
    out.push({x,y,z,a,sw:Math.sin(T*.8+i)*.07}); } return out; }
/* one lantern, drawn once as a stored picture (its glow, the paper wider at the top lit warm from the flame, the flame at the opening) and
   reused for every lantern at its size: cheap at night */
function blLanternArt(){ if(blLanternArt.c) return blLanternArt.c; const c=document.createElement('canvas'); c.width=128; c.height=160; const x=c.getContext('2d'), h=48, w=h*.62, cx=64, cy=78;
  const gl=x.createRadialGradient(cx,cy+h*.1,0,cx,cy+h*.1,62); gl.addColorStop(0,'rgba(255,200,120,.28)'); gl.addColorStop(.45,'rgba(255,180,100,.08)'); /* a dimmer glow (director, 2026-11-23) */ gl.addColorStop(1,'rgba(255,170,90,0)'); x.fillStyle=gl; x.fillRect(0,0,128,160);
  x.translate(cx,cy); const pg=x.createRadialGradient(0,h*.35,h*.05,0,h*.1,h*.85); pg.addColorStop(0,'#fffaf0'); pg.addColorStop(.3,'#ffe6b0'); pg.addColorStop(.7,'#fbefdc'); pg.addColorStop(1,'#efe4d2'); x.fillStyle=pg;
  x.beginPath(); x.moveTo(-w*.42,h*.5); x.quadraticCurveTo(-w*.6,-h*.1,-w*.5,-h*.4); x.quadraticCurveTo(0,-h*.62,w*.5,-h*.4); x.quadraticCurveTo(w*.6,-h*.1,w*.42,h*.5); x.closePath(); x.fill();
  x.strokeStyle='rgba(210,170,120,.35)'; x.lineWidth=1; for(const u of [-.22,0,.22]){ x.beginPath(); x.moveTo(u*w,-h*.5); x.lineTo(u*w*.85,h*.5); x.stroke(); } /* the paper's seams */
  x.fillStyle='rgba(255,165,60,.95)'; x.beginPath(); x.ellipse(0,h*.46,w*.2,h*.06,0,0,7); x.fill(); return blLanternArt.c=c; }
function blLantern(x,y,h,a,sw){ if(a<.02) return; const k=h/48, c=blLanternArt(); g.save(); g.translate(x,y); if(sw) g.rotate(sw); g.globalAlpha=a; g.drawImage(c,-64*k,-78*k,128*k,160*k); g.restore(); g.globalAlpha=1; }
/* the sky in the lake (director, 2026-11-23: "could we do the clouds as well? and the moon/sun?"; then "no sun reflection"): the clouds, the moon's path of light
   and the lanterns, mirrored at the waterline, only where the land's own reflection is not (it stands in front), gently wobbling. A small
   picture redrawn each frame (half size) and laid over the water in a few rippling bands: cheap. */
function blSkyRefl(P,t,M,sun,lan){ const S=blSkyRefl.c||(blSkyRefl.c=document.createElement('canvas')), w=840, h=(BL_IH-BL_WT0)/2; if(S.width!==w){ S.width=w; S.height=h; } const x=S.getContext('2d'), s=M.s, ax=BL_WL, calm=blCalm(), cl=blFaded.clouds&&blFaded.clouds.cur;
  x.setTransform(1,0,0,1,0,0); x.clearRect(0,0,w,h); x.setTransform(.5,0,0,.5,0,-BL_WT0*.5);
  if(cl){ x.save(); x.translate(0,ax*2); x.scale(1,-1); x.globalAlpha=.5*(1-.3*P.night); for(let i=0;i<BL_CLOUDS.length;i++){ const [cx,cy,sw,sh]=blCloudAt(i,t,M,calm), [,,cw,ch,qx,qy]=BL_CLOUDS[i]; x.drawImage(cl,qx,qy-2795,cw,ch,(cx-M.ox)/s,(cy-M.oy)/s,sw/s,sh/s); } x.restore(); }
  if(sun.vis>.05&&!sun.up){ const sx=(sun.x-M.ox)/s, A=sun.vis*.6; /* the moon's path of light (no sun reflection: director, 2026-11-23) */
    for(let k=0;k<22;k++){ const y=ax+8+k*k*1.05, wd=(18+k*4.5)*(.55+.45*Math.sin(t*1.7+k*1.9)), a=A*(1-k/24); if(y>BL_IH) break; x.fillStyle='rgba(225,235,255,'+a+')'; x.fillRect(sx-wd/2+Math.sin(t*1.1+k*2.3)*6,y,wd,2.5+k*.18); } }
  const lr=()=>{ const art=blLanternArt(); for(const L of lan){ const k=22*L.z/48, ry=ax*2-L.y; x.save(); x.translate(L.x,ry); x.scale(1,-1); x.globalAlpha=.4*L.a; x.drawImage(art,-64*k,-78*k,128*k,160*k); x.restore(); } x.globalAlpha=1; }; /* each lantern mirrored as a lantern */
  const m=blReflect.m; x.setTransform(1,0,0,1,0,0); if(m){ x.globalCompositeOperation='destination-out'; x.drawImage(m,0,0,w,h); x.globalCompositeOperation='source-over'; }
  x.setTransform(.5,0,0,.5,0,-BL_WT0*.5); lr(); x.setTransform(1,0,0,1,0,0); /* the lanterns' reflections in front of the hills' reflections, like the lanterns in front of the hills */
  const top=M.oy+BL_WT0*s, n=14, bh=h/n; for(let b=0;b<n;b++){ const off=calm?0:Math.sin(t*1.2+b*1.9)*s*(1+2*b/n), y0=Math.round(top+b*bh*2*s), y1=Math.round(top+(b+1)*bh*2*s); g.drawImage(S,0,b*bh,w,bh,M.ox+off,y0,BL_IW*s,y1-y0); } } /* bands meet exactly: overlapping them by half a pixel drew white lines (director, 2026-11-23) */
V3SCENES.blossom={
  land(x,P,hz,cnv){
    if(BL_IMG.ok) return; /* the layered painting is drawn every frame by live() (smooth light changes), so the stored scenery stays empty and the game's sky shows through */
    waFuji(x,P,hz);
    /* no recycled mountain range: Fuji alone behind hazy hills thick with distant blossom (a cherry blossom forest) */
    blossomForest(x,P,hz); blossomFalls(x,P,hz); /* the reference layout: ridges, forested hills, the waterfall and its pavilion */
    for(let i=0;i<30;i++) waCherry(x,W*(.01+i*.034)+((i*29)%7-3)*3,hz-H*(.028+((i*13)%5)*.004),H*(.03+((i*7)%4)*.006),P,200+i,{leaf:mix(i%3?'#f4b8cc':'#ffd8e6',P.farHaze,.4)});
    wa.hills(x,hz,P.hill,[[0,.03],[.15,.04],[.3,.025],[.5,.03],[.7,.025],[.85,.04],[1,.03]]);
    waPagoda(x,W*.735,hz-H*.13,H*.006,P); /* the pagoda on the hill above the waterfall, as in the director's picture */
    for(const [px,hh,wp,deep] of [[.27,.07,0,0],[.33,.065,0,1],[.51,.08,0,0],[.56,.07,0,1],[.63,.06,0,0],[.87,.085,0,0],[.92,.09,1,0],[.97,.085,0,1]]) waCherry(x,W*px,hz-H*.008,H*hh,P,300+Math.round(px*100),{weep:wp,leaf:deep?mix(P.leaf,'#d8507a',.35):P.leaf});
    for(const px of WA_TORO) waToro(x,W*px,hz-H*.006,H*.0055,P);
    /* (no giant cherry on the right: the director's picture has a row of cherries on the right shore and the big tree over the house) */
    v3water(x,P,hz,cnv,.38);
    blossomShore(x,P,hz); blossomIsland(x,P,hz); blossomBridge(x,P,hz); /* rocky islets along the far shore, the island and the bridge stand in front of the water */
    // the red torii standing in the shallows on the right
    /* director, 2026-11-22: "the sign in the water doesn't read as anything": larger, true proportions (thick pillars on black feet, the
       tie beam running past the pillars, a name tablet between the beams, the black-capped top beam sweeping up at both ends) */
    { const gx=W*.82, gb=hz+H*.06, gh=H*.21, gw=H*.19; { x.fillStyle=mix('#6e6a62',P.wBot,P.night*.5); for(const [dx,rw,rh] of [[-.6,.5,.3],[0,.9,.45],[.65,.55,.32],[-.25,.4,.25]]){ x.beginPath(); x.ellipse(gx+dx*gw,gb+H*.004,gw*rw*.5,gh*rh*.15,0,Math.PI,0); x.fill(); } x.fillStyle=mix('#4a7a3a',P.wBot,P.night*.5); x.beginPath(); x.ellipse(gx,gb-gh*.06,gw*.35,gh*.025,0,Math.PI,0); x.fill(); } /* the rocky islet it stands on */ const _t=0, red=mix('#d8382a',P.wBot,P.night*.6), blk=mix('#1a1a1a',P.wBot,P.night*.5); x.fillStyle=red; x.fillRect(gx-gw*.4,gb-gh,gh*.075,gh); x.fillRect(gx+gw*.4-gh*.075,gb-gh,gh*.075,gh);
      x.fillStyle=blk; x.fillRect(gx-gw*.4-1,gb-gh*.08,gh*.075+2,gh*.08); x.fillRect(gx+gw*.4-gh*.075-1,gb-gh*.08,gh*.075+2,gh*.08);
      x.fillStyle=red; x.fillRect(gx-gw*.04,gb-gh*.9,gw*.08,gh*.14); x.fillStyle=blk; x.fillRect(gx-gw*.03,gb-gh*.88,gw*.06,gh*.1); x.fillStyle=red;
      x.fillRect(gx-gw*.5,gb-gh*.78,gw,gh*.07); x.beginPath(); x.moveTo(gx-gw*.66,gb-gh*.98); x.quadraticCurveTo(gx,gb-gh*.9,gx+gw*.66,gb-gh*.98); x.lineTo(gx+gw*.6,gb-gh*.88); x.quadraticCurveTo(gx,gb-gh*.82,gx-gw*.6,gb-gh*.88); x.closePath(); x.fill();
      x.fillStyle=mix('#1a1a1a',P.wBot,P.night*.5); x.fillRect(gx-gw*.62,gb-gh*1.02,gw*1.24,gh*.05);
      x.fillStyle=v3rgba(red,.25); x.fillRect(gx-gw*.4,gb,gh*.07,gh*.5); x.fillRect(gx+gw*.4-gh*.07,gb,gh*.07,gh*.5); }
    // water lilies near the shores, bigger toward you
    /* side by side with a little water between them, never on top of each other (director: they covered each other) */
    { const r=v3rng(41); for(const [cx,cy,n] of [[.42,.06,3],[.62,.1,2],[.7,.3,3],[.74,.44,4],[.34,.48,4]]){ const k=cy*H/(H-hz), s0=H*(.008+k*.04); let px=W*cx-s0*1.5*(n-1);
      for(let i=0;i<n;i++){ const s=s0*(.75+r()*.35), yy=hz+H*cy+(i%2?1:-1)*s0*.35, fl=r()<.75?(r()<.85?'#f4a0c0':'#fff4f8'):null; waLily(x,px,yy,s,P,500+i+Math.round(cx*100),fl); px+=s0*3.1; } } } },
  live(P,t,hz,sun){ const FX=S.settings.effects, PT=BL_IMG.ok, M=blMap(hz), s=M.s, wt=PT?Math.max(hz,M.oy+BL_WT*s):hz, calm=blCalm(), hi=gfxHigh(), A=BL_MOTION;
    const ld=PT?blFaded('land',P,BL_IW,BL_IH,blBuildLand):null, lk=PT?blFaded('lake',P,BL_IW,BL_IH-BL_WT0,blBuildLake):null;
    if(PT){ if(calm) g.drawImage(lk,0,0,BL_IW,BL_IH-BL_WT0,M.ox,M.oy+BL_WT0*s,BL_IW*s,(BL_IH-BL_WT0)*s);
      else { const w0=M.oy+BL_WL*s, Hh=Math.max(1,H-w0); blRows(lk,M,1,1,BL_WT0,0,BL_WT0,BL_IW,BL_IH-BL_WT0,hi?2:3,(y,iy)=>{ const k=clamp((y-w0)/Hh,0,1), T=t*A.rippleSpeed; return (Math.sin(T*1.1+iy*.11)*(.35+k*1.4)+Math.sin(T*.63+iy*.047+1.7)*.5+Math.sin(T*1.9+iy*.31)*.25*k)*s*A.ripple*(1+.9*P.gloom); }); } } /* the lake and its reflections ripple, slow and uneven, more toward you, and more in rain and storms (Cam) */
    if(PT) blSkyRefl(P,t,M,sun,blLanterns.list||[]);
    if(PT){ const wx=weather(), rain=(wx.k==='Rain'?1:wx.k==='Storm'?1.7:0)*(typeof wxAmt==='function'?wxAmt():1); /* rain rings on the water (Cam: "rain does not cause ripples on water"); drawn under the land, so never on rocks or islands */
      if(rain>.02) for(let i=0,n=Math.round(60*rain);i<n;i++){ const per=1.3+(i%5)*.25, T=t+i*.41, q=(T%per)/per, r=v3rng(Math.floor(T/per)*31+i*7), _r0=r(), iy=BL_WL+14+Math.pow(r(),.8)*(BL_IH-BL_WL-40), /* the first number from a seed runs small: skipped, so the rings cover the whole lake */ k=(iy-BL_WL)/(BL_IH-BL_WL), x0=M.ox+(40+r()*1600)*s, y0=M.oy+iy*s, rr=(2+q*(10+28*k))*s, a=(1-q)*(.6+.4*k), lw=Math.max(1.2,s*(.8+1.2*k)); for(const [f2,al] of [[1,1],[.55,.6]]){ g.lineWidth=lw+1.2; g.strokeStyle='rgba(15,35,65,'+(.3*a*al)+')'; g.beginPath(); g.ellipse(x0,y0+.6,rr*f2,rr*f2*.32,0,0,7); g.stroke(); g.lineWidth=lw; g.strokeStyle='rgba(235,245,255,'+(.85*a*al)+')'; g.beginPath(); g.ellipse(x0,y0,rr*f2,rr*f2*.32,0,0,7); g.stroke(); } } /* a light ring on a darker edge, and a smaller ring inside, so the rings read on bright and dark water (director: "rain ripples don't show up") */ }
    v3glitter(P,t,wt,sun); /* water effects start below the painted islands (director: "some water effects appear on land") */
    // petals resting on the lake, drifting slowly with the breeze (smaller and flatter toward the far shore)
    for(let i=0,n=gfxHigh()?30:18;i<n;i++){ const y=wt+H*(.015+((i*.377)%1)*.75), k=(y-hz)/(H-hz), x=((W*((i*.618)%1)+t*W*(.003+(i%3)*.0015)*(1+k))%(W*1.05))-W*.02, s2=1+k*3.2;
      g.fillStyle=i%3?'rgba(255,196,214,.85)':'rgba(255,236,244,.9)'; g.beginPath(); g.ellipse(x,y+Math.sin(t*.8+i)*k*1.5,s2,s2*.42,(i%5)*.3,0,7); g.fill(); }
    // ducks paddling, turning at the ends of their lap
    /* director, 2026-11-22 ("the duck comes out of nowhere"): a pair swims the whole way across, in from beyond one edge and out past the
       other, then later back the other way, with a real wake */
    { const per=80, q=(t%per)/per, lap=Math.floor(t/per)%2, dir=lap?1:-1; if(q<.6){ const e=q/.6; for(let i=0;i<2;i++){ const y=hz+H*(.07+i*.02), k=(y-hz)/(H-hz), s2=H*(.006+k*.012), xx=lap?W*(-.06+e*1.12)-i*s2*3:W*(1.06-e*1.12)+i*s2*3;
      g.save(); if(dir>0){ g.translate(xx,0); g.scale(-1,1); g.translate(-xx,0); } pondWake(xx+s2*.4,y-s2*.2,s2,t,P,i); g.restore(); waDuck(xx,y,s2,dir,P,t,i,i===1); } } }
    if(!PT) for(let i=0;i<4;i++){ const per=70+i*13, q=((t+i*29)%per)/per, dir=i%2?1:-1, y=H*(.7+i*.055), s2=H*(.012+i*.002), xx=dir>0?W*(-.08+q*1.16):W*(1.08-q*1.16), wig=Math.sin(t*3+i)*s2*.15; g.fillStyle=v3rgba('#1a2a40',.22); g.beginPath(); g.ellipse(xx,y,s2*1.6,s2*.45,wig*.02,0,7); g.fill(); g.beginPath(); g.moveTo(xx-dir*s2*1.5,y); g.lineTo(xx-dir*s2*2.3,y-s2*.45+wig); g.lineTo(xx-dir*s2*2.3,y+s2*.45+wig); g.closePath(); g.fill(); }
    if(!PT&&P.night>.3) for(const px of WA_TORO) v3glow(g,W*px,hz-H*.006-H*.018,H*.025,'rgba(255,190,110,.9)',.6*P.night); /* the drawn scene's stone lanterns glow at night (the floating lanterns are gone: sky lanterns now rise in the sky, director, 2026-11-23) */
    if(PT){ blWaterLife(P,t,M,wt,sun);
      /* the land over the moving water and in front of the sky: the swaying tree and the nodding flowers are left out here and drawn leaning,
         each a few pixels bigger than its gap so no seam can show (director, 2026-11-23: "a weird line in this mountain") */
      const nod=hi&&!calm, cut=(x0,y0,w,h)=>g.rect(M.ox+x0*s,M.oy+y0*s,w*s,h*s), [tx,ty,tw,th]=BL_TREE;
      g.save(); g.beginPath(); g.rect(-W,-H,W*3,H*3); cut(tx,ty,tw,th); if(nod) for(const [a,b,top,bot] of BL_FLOWERS) cut(a,top,b-a,bot-top); g.clip('evenodd'); g.drawImage(ld,M.ox,M.oy,BL_IW*s,BL_IH*s); g.restore();
      if(nod) for(const [a,b,top,bot,ph] of BL_FLOWERS){ const x0=Math.max(0,a-3), y0=top-3, x1=Math.min(BL_IW,b+3), y1=Math.min(BL_IH,bot); blLean(ld,M,x0,y0,x1-x0,y1-y0,(Math.sin(t*1.5+ph)+.4*Math.sin(t*.55+ph*2))*A.flowers*s); } /* the flowers nod, heads more than roots */
      for(const L of (blLanterns.list||[])) blLantern(M.ox+L.x*s,M.oy+L.y*s,22*L.z*s,L.a,L.sw); /* every sky lantern flies in front of the hills and behind the big tree, entering from the left edge (director, 2026-11-23) */
      blLean(ld,M,tx,ty,Math.min(BL_IW,tw+4),th+4,nod?(Math.sin(t*.9)+.35*Math.sin(t*.37+1.2))*A.sway*s:0); /* the big tree sways, its tips most, its trunk not at all */
      blFall(M,P,t);
      if(P.night>.05) for(const wy of [170,186,204,220]) v3glow(g,M.ox+1390*s,M.oy+wy*s,H*.016,'rgba(255,200,120,.9)',.7*P.night); /* the pagoda's windows */
      blAirLife(P,t,M); }
    else { const fx=W*.7, top=hz-H*.144, bt=hz, fw=W*.018; g.fillStyle=v3rgba('#ffffff',.6*(1-P.night*.65)); for(let i=0;i<7;i++){ const q=((t*.9+i/7)%1), yy=top+q*(bt-top); g.fillRect(fx-fw/2+i*fw/7,yy,1.5,H*.016); } }
    if(FX) for(let i=0,n=gfxHigh()?22:12;i<n;i++){ const per=9+(i%5), q=((t+i*1.7)%per)/per, x=W*(((i*.137)+q*.25)%1), y=H*.05+q*H*.85+Math.sin(t*1.3+i)*6; if(y>H*.97) continue; wa.petal(g,x,y,2.6,t*2+i,i%3?'rgba(255,190,210,.85)':'rgba(255,230,240,.9)'); } }, /* petals falling from the trees (the petal gust is gone: director, 2026-11-23, no moment for now) */
  /* the painted clouds drift behind the land, the big ones slowest, each at its own pace, coloured for the time of day */
  get noClouds(){ return !!BL_IMG.ok; },
  sky(P,t,hz){ if(!BL_IMG.ok) return; const M=blMap(hz), s=M.s, c=blFaded('clouds',P,BL_IW,232,blBuildClouds), calm=blCalm(); g.globalAlpha=(1-.25*P.night)*(1-P.gloom*.2);
    BL_CLOUDS.forEach(([,,w,h,ax,ay],i)=>{ const [x,y,sw,sh]=blCloudAt(i,t,M,calm); g.drawImage(c,ax,ay-2795,w,h,x,y,sw,sh); }); g.globalAlpha=1;
    blBirds(P,t,M); /* behind the tree and the hills */
    const lan=blLanterns.list=blLanterns(P,t); }, /* (the sky lanterns are drawn in live(), in front of the hills: director, "none of them should be behind the mountains") */
  /* dawn is cooler and pinker than dusk (they share one palette) */
  skyBack(P,t,hz){ if(!BL_IMG.ok||!blDawn()||P.d<.02) return; const gr=g.createLinearGradient(0,0,0,hz); gr.addColorStop(0,'rgba(190,170,230,0)'); gr.addColorStop(.55,'rgba(255,190,215,'+(.28*P.d)+')'); gr.addColorStop(1,'rgba(255,214,200,'+(.5*P.d)+')'); g.fillStyle=gr; g.fillRect(-W,0,W*3,hz+1); },
};
