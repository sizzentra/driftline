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
const BL_IW=1578, BL_IH=691, BL_WL=392; /* the picture's size and its waterline row */
const BL_IMG=new Image(); BL_IMG.onload=()=>{ BL_IMG.ok=1; V3CACHE=null; V3PREV=null; v3land.job=null; }; BL_IMG.src=BLOSSOM_ART;
function blMap(hz){ const s=W/BL_IW; return {s,oy:hz-BL_WL*s}; } /* picture pixels to screen: X*s, oy+Y*s */
/* the sky's outline in picture pixels (where stars may show) and its painted clouds (where they may not) */
const BL_SKY=[[640,196],[760,192],[860,212],[1000,156],[1100,102],[1170,86],[1250,88],[1330,126],[1440,176],[1480,190],[1578,186]];
const BL_CLOUDS=[[660,960,78,134],[580,840,126,192],[440,570,152,196],[1400,1578,80,205],[860,1110,192,228]];
function blSkyY(X){ for(let i=1;i<BL_SKY.length;i++){ const [a,ay]=BL_SKY[i-1], [b,by]=BL_SKY[i]; if(X<=b) return ay+(by-ay)*(X-a)/(b-a); } return 186; }
function blPainted(x,P,hz){ const m=blMap(hz), s=m.s, ih=BL_IH*s, bot=m.oy+ih, top=Math.max(0,m.oy);
  x.drawImage(BL_IMG,0,m.oy,W,ih);
  if(m.oy>0){ const f=x.createLinearGradient(0,m.oy,0,m.oy+H*.05); f.addColorStop(0,V3PAL.blossom.day.top); f.addColorStop(1,v3rgba(V3PAL.blossom.day.top,0)); x.fillStyle=f; x.fillRect(0,m.oy,W,H*.05); } /* tall windows: the picture's top melts into the sky */
  if(bot<H){ const f=x.createLinearGradient(0,bot-H*.03,0,H); f.addColorStop(0,'rgba(21,70,104,0)'); f.addColorStop(Math.min(.5,H*.03/(H-bot+H*.03)),'rgb(21,70,104)'); f.addColorStop(1,'rgb(12,38,66)'); x.fillStyle=f; x.fillRect(0,bot-H*.03,W,H-bot+H*.03); } /* the near lake below the picture */
  const D=V3PAL.blossom.day, q=k=>{ const a=hex2rgb(rgb2hex(P[k])), b=hex2rgb(rgb2hex(D[k])); return a.map((v,i)=>Math.min(1,v/Math.max(8,b[i]))); }, A=q('far'), B=q('wMid'), f=A.map((v,i)=>(v+B[i])/2);
  if(f.some(v=>v<.995)){ x.globalCompositeOperation='multiply'; x.fillStyle='rgb('+f.map(v=>Math.round(v*255)).join(',')+')'; x.fillRect(0,top,W,H-top); x.globalCompositeOperation='source-over'; } /* light and weather */
  if(P.d>.02){ x.globalCompositeOperation='soft-light'; x.fillStyle='rgba(255,140,80,'+(.4*P.d)+')'; x.fillRect(0,top,W,H-top); x.globalCompositeOperation='source-over'; } /* dusk and dawn warmth */ }
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
  live(P,t,hz,sun){ const FX=S.settings.effects, PT=BL_IMG.ok, M=blMap(hz); v3glitter(P,t,hz,sun);
    if(PT&&P.night>.05){ const k=P.night*(1-P.gloom); if(!blMap.st){ const r=v3rng(9), a=[]; while(a.length<70){ const X=660+r()*918, Y=r()*190; if(Y>blSkyY(X)-10||BL_CLOUDS.some(c=>X>c[0]&&X<c[1]&&Y>c[2]&&Y<c[3])) continue; a.push([X,Y,r()*7,.6+r()*1.1]); } blMap.st=a; } /* stars in the painted sky, never on a mountain or a cloud */
      g.fillStyle='#ffffff'; for(const s of blMap.st){ const y=M.oy+s[1]*M.s; if(y<0) continue; g.globalAlpha=k*(.3+.7*Math.abs(Math.sin(t*.7+s[2]))); g.fillRect(s[0]*M.s,y,s[3],s[3]); } g.globalAlpha=1;
      if(!sun.up&&sun.vis>.05&&(sun.y-M.oy)/M.s<blSkyY(sun.x/M.s)-20){ v3glow(g,sun.x,sun.y,H*.12,'rgba(220,230,255,.6)',sun.vis*.5); g.save(); g.globalAlpha=sun.vis; g.beginPath(); g.arc(sun.x,sun.y,H*.03,0,7); g.clip(); g.fillStyle='#fff4dc'; g.beginPath(); g.arc(sun.x,sun.y,H*.03,0,7); g.moveTo(sun.x+H*.041,sun.y-H*.009); g.arc(sun.x+H*.013,sun.y-H*.009,H*.028,0,7); g.fill('evenodd'); g.restore(); } /* the moon, which the picture's sky would hide */
      for(const wy of [212,232,252]) v3glow(g,1293*M.s,M.oy+wy*M.s,H*.02,'rgba(255,200,120,.9)',.7*P.night); } /* the pagoda's windows */
    // petals resting on the lake, drifting slowly with the breeze (smaller and flatter toward the far shore)
    for(let i=0,n=gfxHigh()?30:18;i<n;i++){ const y=hz+H*(.015+((i*.377)%1)*.75), k=(y-hz)/(H-hz), x=((W*((i*.618)%1)+t*W*(.003+(i%3)*.0015)*(1+k))%(W*1.05))-W*.02, s=1+k*3.2;
      g.fillStyle=i%3?'rgba(255,196,214,.85)':'rgba(255,236,244,.9)'; g.beginPath(); g.ellipse(x,y+Math.sin(t*.8+i)*k*1.5,s,s*.42,(i%5)*.3,0,7); g.fill(); }
    if(FX) for(let i=0,n=gfxHigh()?22:12;i<n;i++){ const per=9+(i%5), q=((t+i*1.7)%per)/per, x=W*(((i*.137)+q*.25)%1), y=H*.05+q*H*.85+Math.sin(t*1.3+i)*6; if(y>H*.97) continue; wa.petal(g,x,y,2.6,t*2+i,i%3?'rgba(255,190,210,.85)':'rgba(255,230,240,.9)'); }
    // ducks paddling, turning at the ends of their lap (the koi are back as shadows under the near water, from the director's reference)
    /* director, 2026-11-22 ("the duck comes out of nowhere"): a pair swims the whole way across, in from beyond one edge and out past the
       other, then later back the other way, with a real wake */
    { const per=80, q=(t%per)/per, lap=Math.floor(t/per)%2, dir=lap?1:-1; if(q<.6){ const e=q/.6; for(let i=0;i<2;i++){ const y=hz+H*(.07+i*.02), k=(y-hz)/(H-hz), s=H*(.006+k*.012), xx=lap?W*(-.06+e*1.12)-i*s*3:W*(1.06-e*1.12)+i*s*3;
      g.save(); if(dir>0){ g.translate(xx,0); g.scale(-1,1); g.translate(-xx,0); } pondWake(xx+s*.4,y-s*.2,s,t,P,i); g.restore(); waDuck(xx,y,s,dir,P,t,i,i===1); } } }
    // the waterfall falls (streaks running down it) and koi shadows glide slowly under the near water (the director's reference has both)
    { const fx=PT?1242*M.s:W*.7, top=PT?M.oy+286*M.s:hz-H*.144, bt=PT?M.oy+370*M.s:hz, fw=PT?34*M.s:W*.018; g.fillStyle=v3rgba('#ffffff',.6*(1-P.night*.65)); for(let i=0;i<7;i++){ const q=((t*.9+i/7)%1), yy=top+q*(bt-top); g.fillRect(fx-fw/2+i*fw/7,yy,1.5,H*.016); } }
    for(let i=0;i<4;i++){ const per=70+i*13, q=((t+i*29)%per)/per, dir=i%2?1:-1, y=H*(.7+i*.055), s=H*(.012+i*.002), xx=dir>0?W*(-.08+q*1.16):W*(1.08-q*1.16), wig=Math.sin(t*3+i)*s*.15; g.fillStyle=v3rgba('#1a2a40',.22); g.beginPath(); g.ellipse(xx,y,s*1.6,s*.45,wig*.02,0,7); g.fill(); g.beginPath(); g.moveTo(xx-dir*s*1.5,y); g.lineTo(xx-dir*s*2.3,y-s*.45+wig); g.lineTo(xx-dir*s*2.3,y+s*.45+wig); g.closePath(); g.fill(); }
    // the stone lanterns glow at night and paper lanterns drift on the lake
    if(P.night>.3){ if(!PT) for(const px of WA_TORO) v3glow(g,W*px,hz-H*.006-H*.018,H*.025,'rgba(255,190,110,.9)',.6*P.night); 
      for(let i=0;i<5;i++){ const q=((t*.01+i*.2)%1), x=W*(-.05+q*1.1) /* in from beyond the left edge and out past the right, never popping up mid-lake (director) */, y=hz+H*(.04+i*.035)+Math.sin(t*.8+i)*2, s=H*.006*(1+(y-hz)/(H-hz)*3); v3glow(g,x,y,s*5,'rgba(255,180,120,.9)',.5*P.night); g.fillStyle='rgba(255,210,150,'+P.night+')'; g.fillRect(x-s*.6,y-s,s*1.2,s*1.2); g.fillStyle=v3rgba('#ffc890',.25*P.night); g.fillRect(x-s*.4,y+s*.4,s*.8,s*3); } }
    // now and then a gust carries a swirl of petals across the lake
    if(FX){ const q=t%47; if(q<7){ const e=q/7; for(let i=0;i<64;i++){ const u=i/64, x=-W*.1+(e*1.4-u*.16)*W*1.1+Math.cos(u*13+t*3)*W*.02, y=hz*.95+Math.sin(u*13+t*3)*H*.04+u*H*.08; /* a tight swirl, so it reads as one gust */ /* low over the water, where it shows: over the giant pink trees it vanished (map QC) */ if(x<-10||x>W+10) continue; wa.petal(g,x,y,3.8,t*4+i,i%3?'rgba(255,200,220,.95)':'rgba(255,244,250,1)'); } } } },
  fore(){ /* nothing in front: the director's picture keeps the near water open */ },
};
