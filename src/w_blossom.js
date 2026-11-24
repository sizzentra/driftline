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
   land crossfades between its three lightings. The land is redrawn over the moving water so no water effect ever touches rocks or islands.
   The drawn scene below stays for the first frames while the picture loads. */
const BL_IW=1680, BL_IH=845, BL_WL=358, BL_WT=402, BL_WT0=325; /* the picture's size, its waterline row, the row below the islands and the torii's feet where water effects may start, the top row of the stored lake */
const BL_IMG=new Image(); BL_IMG.onload=()=>{ BL_IMG.ok=1; V3CACHE=null; V3PREV=null; v3land.job=null; }; BL_IMG.src=BLOSSOM_ART;
const BL_CLOUDS=[[387,38,578,130,0,2795],[1273,48,370,109,580,2795],[35,184,393,107,952,2795],[780,194,366,100,0,2927],[1087,138,190,43,368,2927],[196,72,158,33,560,2927]]; /* each cloud: where it sits in the sky (x, y, w, h) and where it is stored (x, y) */
const BL_TREE=[0,0,710,225]; /* the big cherry tree over the top left: drawn live so it can sway */
const BL_FALL=[1334,239,38,335]; /* the waterfall: centre x, top, width, foot */
const BL_FLOWERS=[[0,210,668,845,0],[650,730,712,782,2.9],[1100,1260,770,845,2.1],[1270,1345,700,800,1.4],[1560,1680,640,845,3.7]]; /* shore flowers and grass: x from-to, y from-to, phase */
/* the speeds and strengths of the motion, in one place for tuning (ChatGPT's animation notes, 2026-11-23: subtle, natural, never a moving wallpaper) */
const BL_MOTION={ripple:1.2, rippleSpeed:1, cloudSpeed:.0045, sway:1.6, flowers:2};
/* picture pixels to screen (X*s+ox, Y*s+oy): it always covers the screen with its waterline on the horizon; where it is wider than the screen
   the left side goes (the game's home stands there) and the torii on the right stays */
function blMap(hz){ const s=Math.max(W/BL_IW,(H-hz)/(BL_IH-BL_WL),hz/BL_WL); return {s,ox:W-BL_IW*s,oy:hz-BL_WL*s}; }
const blDawn = () => { const p=phase(); return p>.75||p<.2; }; /* the morning side of the clock (dawn and dusk share one palette) */
const blCalm = () => V3PAR.rm.matches; /* reduced motion: the scene holds still */
/* the palette's colour over its daytime colour, as a multiply colour (how much darker and bluer this light is than day) */
function blShade(P,k){ const a=hex2rgb(rgb2hex(P[k])), b=hex2rgb(rgb2hex(V3PAL.blossom.day[k])); return a.map((v,i)=>Math.min(1,v/Math.max(8,b[i]))); }
const blRgb = f => 'rgb('+f.map(v=>Math.round(v*255)).join(',')+')';
/* the land in this light: day, then shaded toward the light (so any petal gaps of the dusk and night paintings stay dark), then the dusk and
   night paintings over it; dawn borrows half the dusk painting with a cool pink light; weather greys it. Kept per light level. */
function blLand(P){ const dawn=blDawn(), key=P.key+'|'+dawn; let c=blLand.c; if(c&&c.key===key) return c.cv;
  c=blLand.c={key,cv:(c&&c.cv)||document.createElement('canvas')}; const cv=c.cv; cv.width=BL_IW; cv.height=BL_IH; const x=cv.getContext('2d'), n=P.night, d=P.d*(dawn?.55:1);
  const mask=()=>{ x.globalCompositeOperation='destination-in'; x.drawImage(BL_IMG,0,0,BL_IW,BL_IH,0,0,BL_IW,BL_IH); x.globalCompositeOperation='source-over'; };
  x.drawImage(BL_IMG,0,0,BL_IW,BL_IH,0,0,BL_IW,BL_IH);
  if(n>.01||d>.01){ const f=blShade(P,'far'); x.globalCompositeOperation='multiply'; x.fillStyle=blRgb(f); x.fillRect(0,0,BL_IW,BL_IH); mask(); }
  if(d>.01){ x.globalAlpha=Math.min(1,d); x.drawImage(BL_IMG,0,845,BL_IW,BL_IH,0,0,BL_IW,BL_IH); }
  if(n>.01){ x.globalAlpha=Math.min(1,n); x.drawImage(BL_IMG,0,1690,BL_IW,BL_IH,0,0,BL_IW,BL_IH); } x.globalAlpha=1;
  if(dawn&&P.d>.02){ x.globalCompositeOperation='soft-light'; x.fillStyle='rgba(255,176,206,'+(.45*P.d)+')'; x.fillRect(0,0,BL_IW,BL_IH); mask(); }
  if(P.gloom>.02){ x.globalCompositeOperation='multiply'; x.fillStyle=blRgb([1,1,1].map(()=>1-.28*P.gloom)); x.fillRect(0,0,BL_IW,BL_IH); mask(); }
  return cv; }
/* the lake in this light: the painted water with its reflections (fainter at night and softer at dusk), shaded like the palette's water, warmed
   at dusk, pink at dawn, catching the sky's horizon colour near the far shore. Half size (it is soft and always rippling). */
function blLake(P){ const dawn=blDawn(), key=P.key+'|'+dawn; let c=blLake.c; if(c&&c.key===key) return c.cv;
  c=blLake.c={key,cv:(c&&c.cv)||document.createElement('canvas')}; const cv=c.cv; cv.width=840; cv.height=260; const x=cv.getContext('2d'), n=P.night;
  x.drawImage(BL_IMG,0,2535,840,260,0,0,840,260); x.globalAlpha=(.95-.45*n)*(1-.3*P.d); x.drawImage(BL_IMG,840,2535,840,260,0,0,840,260); x.globalAlpha=1;
  const f=blShade(P,'wMid'); if(f.some(v=>v<.995)){ x.globalCompositeOperation='multiply'; x.fillStyle=blRgb(f); x.fillRect(0,0,840,260); }
  if(n>.05){ x.globalCompositeOperation='screen'; x.fillStyle='rgba(70,92,150,'+(.24*n)+')'; x.fillRect(0,0,840,260); /* a soft moonlit lift, so the reflections still show */ x.globalCompositeOperation='saturation'; x.fillStyle='rgba(128,128,128,'+(.35*n)+')'; x.fillRect(0,0,840,260); }
  if(P.d>.02){ x.globalCompositeOperation='soft-light'; x.fillStyle=dawn?'rgba(255,180,210,'+(.45*P.d)+')':'rgba(255,140,90,'+(.45*P.d)+')'; x.fillRect(0,0,840,260); }
  x.globalCompositeOperation='soft-light'; const sg=x.createLinearGradient(0,0,0,150); sg.addColorStop(0,v3rgba(P.bot,.55)); sg.addColorStop(1,v3rgba(P.bot,0)); x.fillStyle=sg; x.fillRect(0,0,840,150); /* the sky's colour on the far water */
  if(P.gloom>.02){ x.globalCompositeOperation='multiply'; x.fillStyle=blRgb([1,1,1].map(()=>1-.3*P.gloom)); x.fillRect(0,0,840,260); }
  x.globalCompositeOperation='source-over'; return cv; }
/* the clouds in this light: white by day, pink at dawn, peach at dusk, slate blue at night, grey in bad weather */
function blCloudArt(P){ const dawn=blDawn(), key=P.key+'|'+dawn; let c=blCloudArt.c; if(c&&c.key===key) return c.cv;
  c=blCloudArt.c={key,cv:(c&&c.cv)||document.createElement('canvas')}; const cv=c.cv; cv.width=BL_IW; cv.height=232; const x=cv.getContext('2d');
  x.drawImage(BL_IMG,0,2795,BL_IW,232,0,0,BL_IW,232); let col=mix('#ffffff',dawn?'#ffc8d8':'#ffb08c',Math.min(1,P.d*1.2)); col=mix(col,'#4a5482',P.night); col=mix(col,'#9aa0aa',P.gloom*.7);
  x.globalCompositeOperation='multiply'; x.fillStyle=col; x.fillRect(0,0,BL_IW,232); x.globalCompositeOperation='destination-in'; x.drawImage(BL_IMG,0,2795,BL_IW,232,0,0,BL_IW,232); x.globalCompositeOperation='source-over'; return cv; }
/* a piece of the land (picture pixels x0, y0, w, h) drawn leaning from its foot, its top shifted amp screen pixels: one smooth skew, no seams */
function blLean(C,M,x0,y0,w,h,amp){ const s=M.s; g.save(); g.translate(M.ox+x0*s,M.oy+(y0+h)*s); if(amp) g.transform(1,0,-amp/(h*s),1,0,0); g.drawImage(C,x0,y0,w,h,0,-h*s,w*s,h*s); g.restore(); }
/* rows of a stored picture redrawn on screen in thin strips, each shifted sideways by fn(screen y): ripples, sway and nodding. The picture's
   pixel (X, Y) is at (X*kx, (Y-oy0)*ky) in C; x0, y0, w, h are picture pixels; st is the strip height on screen. */
function blRows(C,M,kx,ky,oy0,x0,y0,w,h,st,fn){ const s=M.s, X0=M.ox+x0*s, Y0=Math.max(0,M.oy+y0*s), Y1=Math.min(H,M.oy+(y0+h)*s), cy=C.height;
  for(let y=Y0;y<Y1;y+=st){ const iy=(y-M.oy)/s, sy=(iy-oy0)*ky, sh=st/s*ky; if(sy<0||sy>=cy) continue; g.drawImage(C,x0*kx,sy,w*kx,Math.min(sh,cy-sy),X0+fn(y,iy),y,w*s,st); } }
function blKoi(x,y,L,dir,t,i,a){ const w=Math.sin(t*4)*.18; g.save(); g.translate(x,y); g.scale(dir,1); g.globalAlpha=a; g.fillStyle=['#f2742e','#f4f0e8','#e8a030','#f05a3a'][i%4]; g.beginPath(); g.ellipse(0,0,L*.5,L*.17,0,0,7); g.fill();
  g.beginPath(); g.moveTo(-L*.42,0); g.quadraticCurveTo(-L*.62,-L*(.2+w),-L*.78,-L*(.18+w)); g.quadraticCurveTo(-L*.66,0,-L*.78,L*(.18-w)); g.quadraticCurveTo(-L*.62,L*(.2-w),-L*.42,0); g.fill(); /* the tail, waving */
  g.fillStyle=i%2?'#e84a2a':'#ffffff'; g.beginPath(); g.ellipse(L*.1,-L*.03,L*.16,L*.08,0,0,7); g.fill(); g.beginPath(); g.ellipse(-L*.18,L*.02,L*.1,L*.06,0,0,7); g.fill(); /* its patches */
  g.fillStyle=v3rgba('#ffffff',.5); g.beginPath(); g.ellipse(L*.05,L*.14,L*.12,L*.04,.5,0,7); g.ellipse(L*.05,-L*.14,L*.12,L*.04,-.5,0,7); g.fill(); g.restore(); g.globalAlpha=1; } /* fins */
/* life in the water, drawn under the land (koi, glints, a leaping fish), and life in the air over it (butterflies, dragonflies, birds, fireflies) */
function blWaterLife(P,t,M,wt,sun){ const s=M.s, X=v=>M.ox+v*s, Y=v=>M.oy+v*s;
  for(let i=0;i<4;i++){ const per=46+i*9, q=((t+i*17)%per)/per, dir=i%2?1:-1, px=dir>0?-80+q*(BL_IW+160):BL_IW+80-q*(BL_IW+160), x=X(px), y=Y(610+i*16+Math.sin(t*.5+i*2)*8), L=(26+i*3)*s; if(x>-L*3&&x<W+L*3) blKoi(x,y,L,dir,t+i,i,.72*(1-P.night*.5)); } /* koi under the clear water */
  if(gfxHigh()&&sun.vis>.1) for(let i=0;i<22;i++){ const per=2.6+(i%5)*.5, q=((t+i*.83)%per)/per, r=v3rng(Math.floor((t+i*.83)/per)*7+i*101), x=X(300+r()*1330), y=Y(410+r()*260); if(y<wt) continue; g.fillStyle=v3rgba('#ffffff',Math.sin(q*Math.PI)*.7*sun.vis); g.fillRect(x-3*s,y,6*s,Math.max(1,s)); } /* glints on the water */
  { const per=21, q=(t%per)/per, r=v3rng(Math.floor(t/per)*31+7), fx=X(570+r()*860), fy=Y(430+r()*150), L=14*s; /* now and then a fish leaps, and its rings spread */
    if(q<.06){ const e=q/.06; g.save(); g.translate(fx+(e-.5)*L*2,fy-Math.sin(e*Math.PI)*L*1.4); g.rotate((e-.5)*2.2); g.fillStyle=v3rgba(mix('#c8d0d8','#2a3048',P.night*.6),.9); g.beginPath(); g.ellipse(0,0,L*.5,L*.16,0,0,7); g.fill(); g.beginPath(); g.moveTo(-L*.45,0); g.lineTo(-L*.72,-L*.16); g.lineTo(-L*.72,L*.16); g.fill(); g.restore(); }
    if(q>.02&&q<.22){ const e=(q-.02)/.2; g.strokeStyle=v3rgba('#ffffff',.55*(1-e)); g.lineWidth=1.2; for(const sx of [fx-L,fx+L]){ g.beginPath(); g.ellipse(sx,fy,4*s+e*30*s,1.5*s+e*7*s,0,0,7); g.stroke(); } } } }
function blAirLife(P,t,M){ const s=M.s, X=v=>M.ox+v*s, Y=v=>M.oy+v*s, day=1-P.night;
  if(day>.2){ for(const [cx,cy,c,ph] of [[110,690,'#fff6c8',0],[1640,680,'#ffffff',2],[1180,775,'#ffd2e4',4]]){ const a=t*.6+ph, x=X(cx+Math.sin(a)*60+Math.sin(a*2.3)*20), y=Y(cy+Math.cos(a*1.3)*30-20), f=Math.abs(Math.sin(t*14+ph)), w=6*s; /* butterflies over the shore flowers */
      g.globalAlpha=day; g.fillStyle=c; g.beginPath(); g.ellipse(x-w*.5,y,w*.6*f+.5,w*.45,-.4,0,7); g.ellipse(x+w*.5,y,w*.6*f+.5,w*.45,.4,0,7); g.fill(); g.fillStyle='#3a2a2a'; g.fillRect(x-.6,y-w*.4,1.2,w*.8); g.globalAlpha=1; }
    for(let i=0;i<2;i++){ const T=t/3+i*1.7, seg=Math.floor(T), u=T-seg, pt=n=>{ const r=v3rng(n*13+i*977); return [480+r()*860,420+r()*150]; }, A=pt(seg), B=pt(seg+1), e=u<.35?Math.sqrt(u/.35):1, x=X(A[0]+(B[0]-A[0])*e), y=Y(A[1]+(B[1]-A[1])*e)+Math.sin(t*9+i)*1.2, L=11*s, dir=B[0]>A[0]?1:-1, fl=.5+.5*Math.sin(t*60+i); /* dragonflies dart, then hover */
      g.globalAlpha=day; g.fillStyle=v3rgba('#e8f4ff',.35+.25*fl); g.beginPath(); g.ellipse(x-dir*L*.05,y-L*.12,L*.32,L*.08,-.3*dir,0,7); g.ellipse(x+dir*L*.12,y-L*.12,L*.3,L*.07,.3*dir,0,7); g.fill(); g.strokeStyle='#2a7a8a'; g.lineWidth=Math.max(1.2,1.6*s); g.beginPath(); g.moveTo(x-dir*L*.55,y); g.lineTo(x+dir*L*.35,y); g.stroke(); g.fillStyle='#1a4a5a'; g.beginPath(); g.arc(x+dir*L*.38,y,L*.08,0,7); g.fill(); g.globalAlpha=1; } }
  if(day>.15){ const q=(t%58)/58; if(q<.5){ const e=q/.5; g.strokeStyle=v3rgba('#2a2a3a',.75*day); g.lineWidth=Math.max(1,1.4*s); for(let i=0;i<5;i++){ const x=W*(1.08-e*1.25)+i*16*s+(i%2)*6*s, y=Y(70+i*7+(i%2)*5)+Math.sin(t*2+i)*2, f=Math.sin(t*10+i*1.3), w=7*s; /* a small flock crosses the sky */
      g.beginPath(); g.moveTo(x-w,y-f*w*.5); g.quadraticCurveTo(x-w*.4,y-w*.3,x,y); g.quadraticCurveTo(x+w*.4,y-w*.3,x+w,y-f*w*.5); g.stroke(); } } }
  if(P.night>.4) for(let i=0;i<16;i++){ const k=i%5, x=X([110,290,1620,1170,540][k]+Math.sin(t*.4+i*2.1)*70), y=Y([690,780,670,770,800][k]-30+Math.sin(t*.55+i*1.3)*40), a=(P.night-.4)/.6*(.5+.5*Math.sin(t*2.6+i*1.9)); if(a>.05) v3glow(g,x,y,5*s+3,'rgba(220,255,140,.9)',a); } } /* fireflies by the shore at night */
/* a toro nagashi, the floating paper lantern of Japanese summer evenings (director, 2026-11-23: "these torches look bad and need to be more of a
   lantern symbolic of japan culture"): a wooden float, a square paper box lit from inside with a dark frame and a small roof, its glow and a
   trembling reflection */
function blToro(x,y,s,a,t,i){ if(a<.02) return; v3glow(g,x,y-s*1.1,s*4.5,'rgba(255,176,96,.9)',.55*a); v3lanternReflect(x,y+s*.3,a*.9,t+i,'255,190,120');
  g.globalAlpha=a; g.fillStyle='#3a2416'; g.fillRect(x-s*1.25,y-s*.3,s*2.5,s*.35); g.fillStyle='#5a3a24'; g.fillRect(x-s*1.25,y-s*.3,s*2.5,s*.08); /* the float */
  const pg=g.createLinearGradient(0,y-s*2.1,0,y-s*.3); pg.addColorStop(0,'#ffe2a8'); pg.addColorStop(.6,'#ffc070'); pg.addColorStop(1,'#f08a3a'); g.fillStyle=pg; g.fillRect(x-s*.85,y-s*2.1,s*1.7,s*1.8); /* the paper, lit */
  g.fillStyle='rgba(255,250,230,.55)'; g.fillRect(x-s*.45,y-s*1.9,s*.9,s*1.3); g.fillStyle='#2a1a10'; for(const dx of [-.85,-.08,.7]) g.fillRect(x+dx*s,y-s*2.1,s*.15,s*1.8); g.fillRect(x-s*.85,y-s*1.25,s*1.7,s*.1); /* frame and middle rail */
  g.fillRect(x-s*1.05,y-s*2.3,s*2.1,s*.22); g.fillRect(x-s*.7,y-s*2.45,s*1.4,s*.16); g.globalAlpha=1; } /* the small roof */
V3SCENES.blossom={
  land(x,P,hz,cnv){
    if(BL_IMG.ok){ const M=blMap(hz), s=M.s, [tx,ty,tw,th]=BL_TREE; x.drawImage(blLake(P),0,0,840,260,M.ox,M.oy+BL_WT0*s,BL_IW*s,(BL_IH-BL_WT0)*s); /* the still lake (live() ripples it) */
      x.save(); x.beginPath(); x.rect(-W,-H,W*3,H*3); x.rect(M.ox+tx*s,M.oy+ty*s,tw*s,th*s); x.clip('evenodd'); x.drawImage(blLand(P),M.ox,M.oy,BL_IW*s,BL_IH*s); x.restore(); return; } /* the land, less the big tree (live() draws it, swaying); the sky stays see-through for the game's sky, sun, moon, stars and the painted clouds */
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
  live(P,t,hz,sun){ const FX=S.settings.effects, PT=BL_IMG.ok, M=blMap(hz), s=M.s, wt=PT?Math.max(hz,M.oy+BL_WT*s):hz, calm=blCalm(), hi=gfxHigh(), A=BL_MOTION, lk=PT?blLake(P):null, ld=PT?blLand(P):null;
    if(PT){ if(calm) g.drawImage(lk,0,(BL_WL-8-BL_WT0)*.5,840,(BL_IH-BL_WL+8)*.5,M.ox,M.oy+(BL_WL-8)*s,BL_IW*s,(BL_IH-BL_WL+8)*s);
      else { const w0=M.oy+BL_WL*s, Hh=Math.max(1,H-w0); blRows(lk,M,.5,.5,BL_WT0,0,BL_WL-8,BL_IW,BL_IH-BL_WL+8,hi?2:3,(y,iy)=>{ const k=clamp((y-w0)/Hh,0,1), T=t*A.rippleSpeed; return (Math.sin(T*1.1+iy*.11)*(.35+k*1.4)+Math.sin(T*.63+iy*.047+1.7)*.5+Math.sin(T*1.9+iy*.31)*.25*k)*s*A.ripple; }); } } /* the lake and its reflections ripple, slow and uneven, more toward you */
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
    // paper lanterns drift on the lake at night (and the stone lanterns glow in the drawn scene)
    if(P.night>.3){ if(!PT) for(const px of WA_TORO) v3glow(g,W*px,hz-H*.006-H*.018,H*.025,'rgba(255,190,110,.9)',.6*P.night);
      for(let i=0;i<5;i++){ const q=((t*.01+i*.2)%1), x=W*(-.05+q*1.1) /* in from beyond the left edge and out past the right, never popping up mid-lake (director) */, y=wt+H*(.03+i*.04)+Math.sin(t*.8+i)*2, s2=H*.005*(1+(y-hz)/(H-hz)*2.2); blToro(x,y,s2,Math.min(1,(P.night-.3)/.3),t,i); } }
    if(PT){ blWaterLife(P,t,M,wt,sun);
      const nod=hi&&!calm; g.save(); if(nod){ g.beginPath(); g.rect(-W,-H,W*3,H*3); for(const [a,b,top,bot] of BL_FLOWERS) g.rect(M.ox+a*s,M.oy+top*s,(b-a)*s,(bot-top)*s); g.clip('evenodd'); }
      g.drawImage(ld,0,BL_WL-8,BL_IW,BL_IH-BL_WL+8,M.ox,M.oy+(BL_WL-8)*s,BL_IW*s,(BL_IH-BL_WL+8)*s); g.restore(); /* the land again over the moving water: islands, rocks and shore flowers stay solid */
      if(nod) for(const [a,b,top,bot,ph] of BL_FLOWERS) blLean(ld,M,a,top,b-a,bot-top,(Math.sin(t*1.5+ph)+.4*Math.sin(t*.55+ph*2))*A.flowers*s); /* the flowers nod, heads more than roots */
      { const [tx,ty,tw,th]=BL_TREE; blLean(ld,M,tx,ty,tw,th,nod?(Math.sin(t*.9)+.35*Math.sin(t*.37+1.2))*A.sway*s:0); } /* the big tree sways, its tips most, its trunk not at all */
      /* the waterfall (director, 2026-11-23: "needs a more realistic animation"): the painted falling water flows down, with water sheets sliding
         and speeding up as they fall, foam boiling out at the foot and a drifting mist */
      { const [cx,ft,cw,fb]=BL_FALL, fx=M.ox+cx*s, top=M.oy+ft*s, bt=M.oy+fb*s, fw=cw*s, dim=1-P.night*.6, hh=bt-top; g.save(); g.beginPath(); g.rect(fx-fw/2,top,fw,hh); g.clip();
        { const b0=ft+(fb-ft)*.06, bh=(fb-ft)*.86, off=(t*hh*.85)%(bh*s); for(const [o2,a] of [[off-bh*s,1],[off,1],[off-bh*s*.5,.45],[off+bh*s*.5,.45]]){ g.globalAlpha=a; g.drawImage(ld,cx-cw/2,b0,cw,bh,fx-fw/2,M.oy+b0*s+o2,fw,bh*s); } g.globalAlpha=1; }
        for(let i=0;i<16;i++){ const lane=((i*7)%16)/16, sp=.55+((i*5)%7)*.07, q=((t*sp+i*.37)%1), e=q*q, yy=top+e*hh*1.25-hh*.15, len=hh*(.08+e*.22), w=fw*(.04+((i*3)%5)*.012), a=(.25+((i*11)%5)*.08)*dim*(1-q*.4);
          g.fillStyle=v3rgba('#ffffff',a); g.fillRect(fx-fw/2+lane*fw,yy,w,len); g.fillStyle=v3rgba('#cfe8ff',a*.6); g.fillRect(fx-fw/2+lane*fw+w,yy+len*.2,w*.6,len*.7); }
        g.restore();
        for(let i=0;i<9;i++){ const q=((t*.5+i/9)%1), dx=(i%2?1:-1)*(.2+q*.9)*fw*.8*(.5+((i*3)%4)*.18), r=fw*(.12+q*.3); g.fillStyle=v3rgba('#ffffff',(.45*(1-q))*dim); g.beginPath(); g.ellipse(fx+dx*.6,bt-r*.2-q*fw*.15,r,r*.55,0,0,7); g.fill(); }
        v3glow(g,fx,bt-fw*.1,fw*1.4,'rgba(235,245,255,.8)',(.25+.08*Math.sin(t*1.7))*dim); }
      if(P.night>.05) for(const wy of [170,186,204,220]) v3glow(g,M.ox+1390*s,M.oy+wy*s,H*.016,'rgba(255,200,120,.9)',.7*P.night); /* the pagoda's windows */
      blAirLife(P,t,M); }
    else { const fx=W*.7, top=hz-H*.144, bt=hz, fw=W*.018; g.fillStyle=v3rgba('#ffffff',.6*(1-P.night*.65)); for(let i=0;i<7;i++){ const q=((t*.9+i/7)%1), yy=top+q*(bt-top); g.fillRect(fx-fw/2+i*fw/7,yy,1.5,H*.016); } }
    if(FX) for(let i=0,n=gfxHigh()?22:12;i<n;i++){ const per=9+(i%5), q=((t+i*1.7)%per)/per, x=W*(((i*.137)+q*.25)%1), y=H*.05+q*H*.85+Math.sin(t*1.3+i)*6; if(y>H*.97) continue; wa.petal(g,x,y,2.6,t*2+i,i%3?'rgba(255,190,210,.85)':'rgba(255,230,240,.9)'); } /* petals falling from the trees */
    // now and then a gust carries a swirl of petals across the lake
    if(FX){ const q=t%47; if(q<7){ const e=q/7; for(let i=0;i<120;i++){ const u=i/120, x=-W*.1+(e*1.4-u*.16)*W*1.1+Math.cos(u*13+t*3)*W*.02, y=hz*.95+Math.sin(u*13+t*3)*H*.04+u*H*.08; /* a tight swirl, so it reads as one gust */ /* low over the water, where it shows: over the giant pink trees it vanished (map QC) */ if(x<-10||x>W+10) continue; wa.petal(g,x,y,5.2,t*4+i,i%3?'rgba(255,186,212,.9)':'rgba(255,214,230,.9)'); } } } }, /* pink, so the swirl never reads as little white fish */
  /* the painted clouds drift behind the land, the big ones slowest, each at its own pace, coloured for the time of day */
  get noClouds(){ return !!BL_IMG.ok; },
  sky(P,t,hz){ if(!BL_IMG.ok) return; const M=blMap(hz), s=M.s, c=blCloudArt(P), calm=blCalm(); g.globalAlpha=(1-.25*P.night)*(1-P.gloom*.2);
    BL_CLOUDS.forEach(([sx,sy,w,h,ax,ay],i)=>{ const sw=w*s, sh=h*s, v=calm?0:W*BL_MOTION.cloudSpeed*(1.25-.55*w/578)*(i%2?1:.82), span=W+sw*2, x=(((M.ox+sx*s+sw+t*v)%span)+span)%span-sw, y=M.oy+sy*s+(calm?0:Math.sin(t*.05+i*1.7)*s*1.5); g.drawImage(c,ax,ay-2795,w,h,x,y,sw,sh); }); g.globalAlpha=1; },
  /* dawn is cooler and pinker than dusk (they share one palette) */
  skyBack(P,t,hz){ if(!BL_IMG.ok||!blDawn()||P.d<.02) return; const gr=g.createLinearGradient(0,0,0,hz); gr.addColorStop(0,'rgba(190,170,230,0)'); gr.addColorStop(.55,'rgba(255,190,215,'+(.28*P.d)+')'); gr.addColorStop(1,'rgba(255,214,200,'+(.5*P.d)+')'); g.fillStyle=gr; g.fillRect(-W,0,W*3,hz+1); },
};
