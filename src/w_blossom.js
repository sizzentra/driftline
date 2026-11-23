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
/* THE PAINTED SCENERY (director, 2026-11-23: "make a 1:1 layout of cherry blossom map as this, and texture/detail it accordingly"; "i also like
   more cherry blossom trees like this one"): the director's picture itself is the scenery (src/w_blossom_art.js, cleaned of labels, house,
   angler and line). It fills the screen's width with its waterline on the game's horizon (the sky above it is cropped on wide screens); below
   it the lake goes on in its own deep blue. Light and weather tint it from the palette (the palette's colour over its daytime colour), dusk adds
   warmth, and at night stars, the moon and the pagoda's windows come out over it. The drawn scene below stays for the first frames while the
   picture loads. */
const BL_IW=1763, BL_IH=892, BL_WL=378, BL_WT=410; /* the picture's size, its waterline row, and the row below the islands and the torii's feet where water effects may start */
const BL_IMG=new Image(); BL_IMG.onload=()=>{ BL_IMG.ok=1; V3CACHE=null; V3PREV=null; v3land.job=null; }; BL_IMG.src=BLOSSOM_ART;
/* picture pixels to screen (X*s+ox, Y*s+oy): it always covers the screen with its waterline on the horizon; where it is wider than the screen
   the left side goes (the game's home stands there) and the torii on the right stays */
function blMap(hz){ const s=Math.max(W/BL_IW,(H-hz)/(BL_IH-BL_WL),hz/BL_WL); return {s,ox:W-BL_IW*s,oy:hz-BL_WL*s}; }
/* where the picture's sky is open: rows of open sky from the top in 20 px columns, measured from its pixels and cut off by the hills and
   Fuji's traced outline (director, 2026-11-23: "the stars also show over the mountain": Fuji's blue slopes had passed for sky), and 70 star
   spots in it */
const BL_SKYC=[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,23,142,75,73,71,69,48,59,34,24,54,48,65,52,141,69,75,142,100,80,78,67,20,77,96,89,81,73,64,55,45,34,27,30,30,31,27,58,67,76,86,95,104,32,70,62,50,56,53,31,31,42,148];
const BL_STARS=[[720,59],[998,56],[876,83],[1234,15],[887,88],[983,9],[978,15],[1482,42],[1541,21],[1656,40],[1734,14],[1653,98],[1573,46],[1032,64],[1478,27],[1721,72],[1552,40],[1243,22],[1578,22],[1016,46],[1224,56],[769,9],[937,26],[966,78],[1562,36],[1618,80],[1144,14],[1623,36],[1632,78],[1004,123],[804,19],[1190,6],[1240,66],[1508,69],[1114,89],[895,91],[1130,98],[942,14],[1511,60],[1084,54],[770,53],[1555,67],[1051,71],[789,15],[1043,36],[1053,28],[1139,17],[954,8],[1126,29],[723,6],[1707,81],[819,95],[1649,127],[1053,27],[769,6],[1015,36],[973,24],[896,121],[799,127],[1064,52],[998,126],[1146,29],[1557,79],[1225,70],[811,57],[812,38],[896,119],[823,52],[1020,86],[1751,16]];
function blSkyY(X){ return BL_SKYC[Math.max(0,Math.min(BL_SKYC.length-1,Math.round(X/20)))]; }
/* the painting follows the light: multiplied by the palette's colour over its daytime colour (far land and water), warmed at dusk and dawn */
function blTint(x,P,x0,y0,w,h){ const D=V3PAL.blossom.day, q=k=>{ const a=hex2rgb(rgb2hex(P[k])), b=hex2rgb(rgb2hex(D[k])); return a.map((v,i)=>Math.min(1,v/Math.max(8,b[i]))); }, A=q('far'), B=q('wMid'), f=A.map((v,i)=>(v+B[i])/2);
  if(f.some(v=>v<.995)){ x.globalCompositeOperation='multiply'; x.fillStyle='rgb('+f.map(v=>Math.round(v*255)).join(',')+')'; x.fillRect(x0,y0,w,h); }
  if(P.d>.02){ x.globalCompositeOperation='soft-light'; x.fillStyle='rgba(255,140,80,'+(.4*P.d)+')'; x.fillRect(x0,y0,w,h); } x.globalCompositeOperation='source-over'; }
function blPainted(x,P,hz){ const m=blMap(hz); x.drawImage(BL_IMG,0,0,BL_IW,BL_IH,m.ox,m.oy,BL_IW*m.s,BL_IH*m.s); blTint(x,P,0,0,W,H); }
/* the lily clusters in front of the home, cut from the picture (stored under it, rows 894+), drawn over the home's posts so they float on top
   (director, 2026-11-23); kept as a small tinted picture per light level */
function blLilyLayer(P,M){ const key=P.key+'|'+W+'|'+H; let c=blLilyLayer.c; if(c&&c.key===key) return c;
  const d=Math.min(DPR,2), w=710*M.s, h=92*M.s; c=blLilyLayer.c={key,cv:(c&&c.cv)||document.createElement('canvas'),x:M.ox,y:M.oy+626*M.s,w,h}; c.cv.width=Math.ceil(w*d); c.cv.height=Math.ceil(h*d);
  const sp=blLilyLayer.sp||(blLilyLayer.sp=document.createElement('canvas')); sp.width=c.cv.width; sp.height=c.cv.height; const p=sp.getContext('2d'); p.setTransform(d*M.s,0,0,d*M.s,0,0); p.drawImage(BL_IMG,0,894,310,86,0,2,310,86); p.drawImage(BL_IMG,320,894,250,84,455,4,250,84); /* both clusters, untinted */
  const q=c.cv.getContext('2d'); q.drawImage(sp,0,0); blTint(q,P,0,0,c.cv.width,c.cv.height); q.globalCompositeOperation='destination-in'; q.drawImage(sp,0,0); q.globalCompositeOperation='source-over'; return c; } /* tinted, then cut back to the lilies' own shapes in one pass */
/* the painting comes alive (director, 2026-11-23: "make it feel more alive", "more realistic animations for the water fall and water"): parts
   of the stored picture are redrawn in thin strips, each shifted a little, so the lake's reflections ripple, the big cherry tree sways and the
   shore flowers nod; on top, life: koi in the clear shallows, birds, butterflies, dragonflies, a jumping fish, glints, fireflies at night */
const BL_FLOWERS=[[0,250,690,892,0],[380,600,820,892,1.3],[1150,1290,780,892,2.1],[1320,1460,740,892,2.9],[1620,1763,650,892,3.7]]; /* shore flower beds: x from-to, y from-to, phase */
function blStrips(C,d,x0,y0,w,h,st,fn){ for(let y=y0;y<y0+h;y+=st){ const off=fn(y); if(Math.abs(off)<.05) continue; g.drawImage(C,x0*d,y*d,w*d,st*d,x0+off,y,w,st); } }
function blMotion(t,M,wt){ const C=V3CACHE&&V3CACHE.c; if(!C) return; const d=C.width/W, s=M.s, X=v=>M.ox+v*s, Y=v=>M.oy+v*s, hi=gfxHigh();
  const r0=wt, r1=Math.min(H,Y(600)); if(r1>r0) blStrips(C,d,0,r0,W,r1-r0,hi?2:3,y=>{ const k=(y-r0)/(r1-r0); return (Math.sin(t*1.4+y*.13)*(.5+k*1.6)+Math.sin(t*.7+y*.05)*.4)*s; }); /* the reflections ripple, more toward you */
  if(!hi) return;
  const ty0=Math.max(0,Y(0)), ty1=Y(240); if(X(720)>0&&ty1>ty0) blStrips(C,d,0,ty0,X(720),ty1-ty0,3,y=>Math.sin(t*.9+y*.012)*1.6*s*(1-(y-Y(0))/(ty1-Y(0)))); /* the big tree sways, its tips most */
  for(const [a,b,top,bot,ph] of BL_FLOWERS){ const x0=X(a), w=(b-a)*s, y0=Y(top), y1=Math.min(H,Y(bot)); if(x0+w<0||x0>W||y1<=y0) continue; blStrips(C,d,x0,y0,w,y1-y0,3,y=>Math.sin(t*1.5+ph+y*.02)*2*s*(1-(y-y0)/(y1-y0))); } } /* the flowers nod, heads more than roots */
function blKoi(x,y,L,dir,t,i,a){ const w=Math.sin(t*4)*.18; g.save(); g.translate(x,y); g.scale(dir,1); g.globalAlpha=a; g.fillStyle=['#f2742e','#f4f0e8','#e8a030','#f05a3a'][i%4]; g.beginPath(); g.ellipse(0,0,L*.5,L*.17,0,0,7); g.fill();
  g.beginPath(); g.moveTo(-L*.42,0); g.quadraticCurveTo(-L*.62,-L*(.2+w),-L*.78,-L*(.18+w)); g.quadraticCurveTo(-L*.66,0,-L*.78,L*(.18-w)); g.quadraticCurveTo(-L*.62,L*(.2-w),-L*.42,0); g.fill(); /* the tail, waving */
  g.fillStyle=i%2?'#e84a2a':'#ffffff'; g.beginPath(); g.ellipse(L*.1,-L*.03,L*.16,L*.08,0,0,7); g.fill(); g.beginPath(); g.ellipse(-L*.18,L*.02,L*.1,L*.06,0,0,7); g.fill(); /* its patches */
  g.fillStyle=v3rgba('#ffffff',.5); g.beginPath(); g.ellipse(L*.05,L*.14,L*.12,L*.04,.5,0,7); g.ellipse(L*.05,-L*.14,L*.12,L*.04,-.5,0,7); g.fill(); g.restore(); g.globalAlpha=1; } /* fins */
function blLife(P,t,M,wt,sun){ const s=M.s, X=v=>M.ox+v*s, Y=v=>M.oy+v*s, day=1-P.night;
  for(let i=0;i<4;i++){ const per=46+i*9, q=((t+i*17)%per)/per, dir=i%2?1:-1, px=dir>0?-80+q*(BL_IW+160):BL_IW+80-q*(BL_IW+160), x=X(px), y=Y(712+i*13+Math.sin(t*.5+i*2)*8), L=(26+i*3)*s; if(x>-L*3&&x<W+L*3) blKoi(x,y,L,dir,t+i,i,.72*(1-P.night*.5)); } /* koi under the clear water */
  if(gfxHigh()&&sun.vis>.1) for(let i=0;i<22;i++){ const per=2.6+(i%5)*.5, q=((t+i*.83)%per)/per, r=v3rng(Math.floor((t+i*.83)/per)*7+i*101), x=X(300+r()*1400), y=Y(430+r()*300); if(y<wt) continue; g.fillStyle=v3rgba('#ffffff',Math.sin(q*Math.PI)*.7*sun.vis); g.fillRect(x-3*s,y,6*s,Math.max(1,s)); } /* glints on the water */
  { const per=21, q=(t%per)/per, r=v3rng(Math.floor(t/per)*31+7), fx=X(600+r()*900), fy=Y(470+r()*150), L=14*s; /* now and then a fish leaps, and its rings spread */
    if(q<.06){ const e=q/.06; g.save(); g.translate(fx+(e-.5)*L*2,fy-Math.sin(e*Math.PI)*L*1.4); g.rotate((e-.5)*2.2); g.fillStyle=v3rgba(mix('#c8d0d8','#2a3048',P.night*.6),.9); g.beginPath(); g.ellipse(0,0,L*.5,L*.16,0,0,7); g.fill(); g.beginPath(); g.moveTo(-L*.45,0); g.lineTo(-L*.72,-L*.16); g.lineTo(-L*.72,L*.16); g.fill(); g.restore(); }
    if(q>.02&&q<.22){ const e=(q-.02)/.2; g.strokeStyle=v3rgba('#ffffff',.55*(1-e)); g.lineWidth=1.2; for(const sx of [fx-L,fx+L]){ g.beginPath(); g.ellipse(sx,fy,4*s+e*30*s,1.5*s+e*7*s,0,0,7); g.stroke(); } } }
  if(day>.2){ for(const [cx,cy,c,ph] of [[120,720,'#fff6c8',0],[1700,690,'#ffffff',2],[1210,800,'#ffd2e4',4]]){ const a=t*.6+ph, x=X(cx+Math.sin(a)*60+Math.sin(a*2.3)*20), y=Y(cy+Math.cos(a*1.3)*30-20), f=Math.abs(Math.sin(t*14+ph)), w=6*s; /* butterflies over the shore flowers */
      g.globalAlpha=day; g.fillStyle=c; g.beginPath(); g.ellipse(x-w*.5,y,w*.6*f+.5,w*.45,-.4,0,7); g.ellipse(x+w*.5,y,w*.6*f+.5,w*.45,.4,0,7); g.fill(); g.fillStyle='#3a2a2a'; g.fillRect(x-.6,y-w*.4,1.2,w*.8); g.globalAlpha=1; }
    for(let i=0;i<2;i++){ const T=t/3+i*1.7, seg=Math.floor(T), u=T-seg, pt=n=>{ const r=v3rng(n*13+i*977); return [500+r()*900,440+r()*160]; }, A=pt(seg), B=pt(seg+1), e=u<.35?Math.sqrt(u/.35):1, x=X(A[0]+(B[0]-A[0])*e), y=Y(A[1]+(B[1]-A[1])*e)+Math.sin(t*9+i)*1.2, L=11*s, dir=B[0]>A[0]?1:-1, fl=.5+.5*Math.sin(t*60+i); /* dragonflies dart, then hover */
      g.globalAlpha=day; g.fillStyle=v3rgba('#e8f4ff',.35+.25*fl); g.beginPath(); g.ellipse(x-dir*L*.05,y-L*.12,L*.32,L*.08,-.3*dir,0,7); g.ellipse(x+dir*L*.12,y-L*.12,L*.3,L*.07,.3*dir,0,7); g.fill(); g.strokeStyle='#2a7a8a'; g.lineWidth=Math.max(1.2,1.6*s); g.beginPath(); g.moveTo(x-dir*L*.55,y); g.lineTo(x+dir*L*.35,y); g.stroke(); g.fillStyle='#1a4a5a'; g.beginPath(); g.arc(x+dir*L*.38,y,L*.08,0,7); g.fill(); g.globalAlpha=1; } }
  if(day>.15){ const q=(t%58)/58; if(q<.5){ const e=q/.5; g.strokeStyle=v3rgba('#2a2a3a',.75*day); g.lineWidth=Math.max(1,1.4*s); for(let i=0;i<5;i++){ const x=W*(1.08-e*1.25)+i*16*s+(i%2)*6*s, y=Y(70+i*7+(i%2)*5)+Math.sin(t*2+i)*2, f=Math.sin(t*10+i*1.3), w=7*s; /* a small flock crosses the sky */
      g.beginPath(); g.moveTo(x-w,y-f*w*.5); g.quadraticCurveTo(x-w*.4,y-w*.3,x,y); g.quadraticCurveTo(x+w*.4,y-w*.3,x+w,y-f*w*.5); g.stroke(); } } }
  if(P.night>.4) for(let i=0;i<16;i++){ const k=i%5, x=X([120,300,1700,1200,560][k]+Math.sin(t*.4+i*2.1)*70), y=Y([720,820,700,800,840][k]-30+Math.sin(t*.55+i*1.3)*40), a=(P.night-.4)/.6*(.5+.5*Math.sin(t*2.6+i*1.9)); if(a>.05) v3glow(g,x,y,5*s+3,'rgba(220,255,140,.9)',a); } } /* fireflies by the shore at night */
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
    if(BL_IMG.ok){ blPainted(x,P,hz); return; }
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
  live(P,t,hz,sun){ const FX=S.settings.effects, PT=BL_IMG.ok, M=blMap(hz), wt=PT?Math.max(hz,M.oy+BL_WT*M.s):hz; if(PT) blMotion(t,M,wt); v3glitter(P,t,wt,sun); /* water effects start below the painted islands (director: "some water effects appear on land") */
    if(PT&&P.night>.05){ const k=P.night*(1-P.gloom); g.fillStyle='#ffffff'; BL_STARS.forEach((s,i)=>{ const x=M.ox+s[0]*M.s, y=M.oy+s[1]*M.s; if(y<0||x<0||x>W) return; g.globalAlpha=k*(.3+.7*Math.abs(Math.sin(t*.7+i*1.7))); const z=1+(i%3)*.5; g.fillRect(x,y,z,z); }); g.globalAlpha=1; /* stars only in the picture's open sky */
      if(!sun.up&&sun.vis>.05&&(sun.y-M.oy)/M.s<blSkyY((sun.x-M.ox)/M.s)){ g.save(); g.beginPath(); g.moveTo(M.ox,M.oy-H); BL_SKYC.forEach((v,i)=>g.lineTo(M.ox+i*20*M.s,M.oy+v*M.s)); g.lineTo(M.ox+BL_IW*M.s,M.oy-H); g.closePath(); g.clip(); /* only the open sky: behind the mountains and the tree */
        v3glow(g,sun.x,sun.y,H*.12,'rgba(220,230,255,.6)',sun.vis*.5); g.globalAlpha=sun.vis; g.beginPath(); g.arc(sun.x,sun.y,H*.03,0,7); g.clip(); g.fillStyle='#fff4dc'; g.beginPath(); g.arc(sun.x,sun.y,H*.03,0,7); g.moveTo(sun.x+H*.041,sun.y-H*.009); g.arc(sun.x+H*.013,sun.y-H*.009,H*.028,0,7); g.fill('evenodd'); g.restore(); } /* the moon, which the picture's sky would hide */
      for(const wy of [178,196,213,232]) v3glow(g,M.ox+1460*M.s,M.oy+wy*M.s,H*.016,'rgba(255,200,120,.9)',.7*P.night); } /* the pagoda's windows */
    // petals resting on the lake, drifting slowly with the breeze (smaller and flatter toward the far shore)
    for(let i=0,n=gfxHigh()?30:18;i<n;i++){ const y=wt+H*(.015+((i*.377)%1)*.75), k=(y-hz)/(H-hz), x=((W*((i*.618)%1)+t*W*(.003+(i%3)*.0015)*(1+k))%(W*1.05))-W*.02, s=1+k*3.2;
      g.fillStyle=i%3?'rgba(255,196,214,.85)':'rgba(255,236,244,.9)'; g.beginPath(); g.ellipse(x,y+Math.sin(t*.8+i)*k*1.5,s,s*.42,(i%5)*.3,0,7); g.fill(); }
    if(FX) for(let i=0,n=gfxHigh()?22:12;i<n;i++){ const per=9+(i%5), q=((t+i*1.7)%per)/per, x=W*(((i*.137)+q*.25)%1), y=H*.05+q*H*.85+Math.sin(t*1.3+i)*6; if(y>H*.97) continue; wa.petal(g,x,y,2.6,t*2+i,i%3?'rgba(255,190,210,.85)':'rgba(255,230,240,.9)'); }
    // ducks paddling, turning at the ends of their lap (the koi are back as shadows under the near water, from the director's reference)
    /* director, 2026-11-22 ("the duck comes out of nowhere"): a pair swims the whole way across, in from beyond one edge and out past the
       other, then later back the other way, with a real wake */
    { const per=80, q=(t%per)/per, lap=Math.floor(t/per)%2, dir=lap?1:-1; if(q<.6){ const e=q/.6; for(let i=0;i<2;i++){ const y=hz+H*(.07+i*.02), k=(y-hz)/(H-hz), s=H*(.006+k*.012), xx=lap?W*(-.06+e*1.12)-i*s*3:W*(1.06-e*1.12)+i*s*3;
      g.save(); if(dir>0){ g.translate(xx,0); g.scale(-1,1); g.translate(-xx,0); } pondWake(xx+s*.4,y-s*.2,s,t,P,i); g.restore(); waDuck(xx,y,s,dir,P,t,i,i===1); } } }
    // the waterfall falls (streaks running down it) and koi shadows glide slowly under the near water (the director's reference has both)
    /* the waterfall (director, 2026-11-23: "needs a more realistic animation"): water sheets sliding down and speeding up as they fall, each its own
       width, brightness and pace, foam boiling out at the foot and a drifting mist */
    if(PT){ const fx=M.ox+1399*M.s, top=M.oy+252*M.s, bt=M.oy+346*M.s, fw=38*M.s, dim=1-P.night*.6, hh=bt-top; g.save(); g.beginPath(); g.rect(fx-fw/2,top,fw,hh); g.clip();
      { const C=V3CACHE&&V3CACHE.c; if(C){ const d=C.width/W, b0=top+hh*.06, bh=hh*.86, off=(t*hh*.85)%bh; for(const [o2,a] of [[off-bh,1],[off,1],[off-bh*.5,.45],[off+bh*.5,.45]]){ g.globalAlpha=a; g.drawImage(C,(fx-fw/2)*d,b0*d,fw*d,bh*d,fx-fw/2,b0+o2,fw,bh); } g.globalAlpha=1; } } /* the painted falling water itself flows down */
      for(let i=0;i<16;i++){ const lane=((i*7)%16)/16, sp=.55+((i*5)%7)*.07, q=((t*sp+i*.37)%1), e=q*q, yy=top+e*hh*1.25-hh*.15, len=hh*(.08+e*.22), w=fw*(.04+((i*3)%5)*.012), a=(.25+((i*11)%5)*.08)*dim*(1-q*.4);
        g.fillStyle=v3rgba('#ffffff',a); g.fillRect(fx-fw/2+lane*fw,yy,w,len); g.fillStyle=v3rgba('#cfe8ff',a*.6); g.fillRect(fx-fw/2+lane*fw+w,yy+len*.2,w*.6,len*.7); }
      g.restore();
      for(let i=0;i<9;i++){ const q=((t*.5+i/9)%1), dx=(i%2?1:-1)*(.2+q*.9)*fw*.8*(.5+((i*3)%4)*.18), r=fw*(.12+q*.3); g.fillStyle=v3rgba('#ffffff',(.45*(1-q))*dim); g.beginPath(); g.ellipse(fx+dx*.6,bt-r*.2-q*fw*.15,r,r*.55,0,0,7); g.fill(); } /* foam boiling out at the foot */
      v3glow(g,fx,bt-fw*.1,fw*1.4,'rgba(235,245,255,.8)',(.25+.08*Math.sin(t*1.7))*dim); } /* and its mist */
    else { const fx=W*.7, top=hz-H*.144, bt=hz, fw=W*.018; g.fillStyle=v3rgba('#ffffff',.6*(1-P.night*.65)); for(let i=0;i<7;i++){ const q=((t*.9+i/7)%1), yy=top+q*(bt-top); g.fillRect(fx-fw/2+i*fw/7,yy,1.5,H*.016); } }
    if(!PT) for(let i=0;i<4;i++){ const per=70+i*13, q=((t+i*29)%per)/per, dir=i%2?1:-1, y=H*(.7+i*.055), s=H*(.012+i*.002), xx=dir>0?W*(-.08+q*1.16):W*(1.08-q*1.16), wig=Math.sin(t*3+i)*s*.15; g.fillStyle=v3rgba('#1a2a40',.22); g.beginPath(); g.ellipse(xx,y,s*1.6,s*.45,wig*.02,0,7); g.fill(); g.beginPath(); g.moveTo(xx-dir*s*1.5,y); g.lineTo(xx-dir*s*2.3,y-s*.45+wig); g.lineTo(xx-dir*s*2.3,y+s*.45+wig); g.closePath(); g.fill(); }
    // the stone lanterns glow at night and paper lanterns drift on the lake
    if(P.night>.3){ if(!PT) for(const px of WA_TORO) v3glow(g,W*px,hz-H*.006-H*.018,H*.025,'rgba(255,190,110,.9)',.6*P.night);
      for(let i=0;i<5;i++){ const q=((t*.01+i*.2)%1), x=W*(-.05+q*1.1) /* in from beyond the left edge and out past the right, never popping up mid-lake (director) */, y=wt+H*(.03+i*.04)+Math.sin(t*.8+i)*2, s=H*.005*(1+(y-hz)/(H-hz)*2.2); blToro(x,y,s,Math.min(1,(P.night-.3)/.3),t,i); } }
    if(PT) blLife(P,t,M,wt,sun);
    // now and then a gust carries a swirl of petals across the lake
    if(FX){ const q=t%47; if(q<7){ const e=q/7; for(let i=0;i<120;i++){ const u=i/120, x=-W*.1+(e*1.4-u*.16)*W*1.1+Math.cos(u*13+t*3)*W*.02, y=hz*.95+Math.sin(u*13+t*3)*H*.04+u*H*.08; /* a tight swirl, so it reads as one gust */ /* low over the water, where it shows: over the giant pink trees it vanished (map QC) */ if(x<-10||x>W+10) continue; wa.petal(g,x,y,5.2,t*4+i,i%3?'rgba(255,186,212,.9)':'rgba(255,214,230,.9)'); } } } }, /* pink, so the swirl never reads as little white fish */
  fore(P){ if(!BL_IMG.ok||!P) return; const hz=HZ(), M=blMap(hz), c=blLilyLayer(P,M); g.save(); const px=V3PAR.dx; if(px){ const os=1+V3PAR.amp*2.4/W; g.translate(W/2+px,hz); g.scale(os,os); g.translate(-W/2,-hz); } g.drawImage(c.cv,c.x,c.y,c.w,c.h); g.restore(); }, /* the lilies float over the home's posts, moving with the painting */
};
