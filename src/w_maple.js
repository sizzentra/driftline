// =====================================================================
// MAPLEWOOD HOLLOW (director, 2026-11-25: "we're missing a fall themed map... go with that concept"; it replaces Cherry Blossom Lake and
// keeps its id 'blossom', its fish, prices and place on the journey, so saves carry on untouched). Drawn in the game's own style, not painted.
// Its personality: a sleepy autumn hollow where the squirrels are up to something. Colours no other water leans on: burnt orange, burgundy,
// mustard, olive and a dusty teal lake under a cream-apricot sky (docs/MAP_THEMES.md, "3. Maplewood Hollow").
// Its pieces, back to front: hazy ridges dotted with autumn trees; olive hills; a red covered bridge over the creek that feeds the lake; a
// pumpkin patch with hay bales and a scarecrow holding a fishing rod (a crow keeps landing on it); big maples along the shore; a raked leaf
// pile by the right-hand maple with a rake leaning on it. Moving life: falling leaves that land and float, geese heading south, the
// squirrel's acorn routine (home in its tree at night), the crow, bats at night, morning mist, rising fish, glowing jack-o'-lanterns.
// The moment (every 45 s): a little leaf whirlwind spins across the water.
// The home is a treehouse in a giant maple over the deck (MH_* below): a cabin on the branches with a rope ladder, a bucket on a pulley,
// a stovepipe, windows that glow at night, pumpkins and a mustard Adirondack chair on the deck.
// =====================================================================
const ML_LEAF=['#c8642a','#a8361e','#7e2a3a','#d9a23a','#b8762a','#e08a2a']; /* burnt orange, rust, burgundy, mustard, amber, pumpkin */
const MLN = (P,c0,k) => mix(c0,P.wBot,P.night*(k==null?.6:k)); /* a colour in tonight's light */
/* a round autumn maple: a dark trunk with two limbs and a crown of mixed leaf colours */
function mlMaple(c,x,base,h,P,seed,cols){ const r=v3rng(seed), C=cols||[ML_LEAF[seed%ML_LEAF.length],ML_LEAF[(seed+2)%ML_LEAF.length]];
  v3leafTree(c,x,base,h,Object.assign({},P,{d:0}),seed,{leaf:MLN(P,C[0],.8),wide:.36+r()*.08}); /* no rim-light arc (it showed as a thin white line on every tree at dusk and night) */
  /* a second colour through the crown: fall trees are never one colour */
  const cy=base-h*.66, n=7; c.fillStyle=mix(MLN(P,C[1],.8),P.leafHi,.15+P.d*.1); c.beginPath();
  for(let i=0;i<n;i++){ const a=r()*Math.PI*2, d=Math.sqrt(r())*.8, bx=x+Math.cos(a)*h*.3*d, by=cy+Math.sin(a)*h*.24*d, br=h*(.05+r()*.05); c.moveTo(bx+br,by); c.arc(bx,by,br,0,7); } c.fill(); }
/* the red covered bridge over the creek mouth (a New England-style kissing bridge): stone abutments, board-and-batten sides, a dark
   portal, a grey shingle roof, a lantern by the portal that is lit at night (drawn live) */
const ML_BR={x:.655,w:.085};
function mlBridge(x,P,hz){ const x0=W*ML_BR.x, w=W*ML_BR.w, y=hz-H*.004, h=H*.04, N=c0=>MLN(P,c0,.68), red=N('#a8382a'), redD=N('#7a2420');
  /* the creek running out from between the hills under the bridge into the lake (the lake's water comes from somewhere) */
  x.fillStyle=mix(P.wTop,P.farHaze,.25); x.beginPath(); x.moveTo(x0+w*.32,hz+1); x.quadraticCurveTo(x0+w*.42,hz-H*.03,x0+w*.5,hz-H*.055); x.lineTo(x0+w*.56,hz-H*.055); x.quadraticCurveTo(x0+w*.6,hz-H*.03,x0+w*.72,hz+1); x.closePath(); x.fill();
  x.fillStyle=N('#8a8478'); x.fillRect(x0-w*.06,y-h*.18,w*.16,h*.3); x.fillRect(x0+w*.9,y-h*.18,w*.16,h*.3); /* stone abutments */
  x.fillStyle=v3rgba('#000000',.18); for(let k=0;k<3;k++){ x.fillRect(x0-w*.06,y-h*.18+k*h*.1,w*.16,1); x.fillRect(x0+w*.9,y-h*.18+k*h*.1,w*.16,1); }
  x.fillStyle=red; x.fillRect(x0,y-h,w,h*.82); x.fillStyle=redD; for(let k=1;k<14;k++) x.fillRect(x0+w*k/14,y-h,1,h*.82); /* battens */
  x.fillStyle=v3rgba('#000000',.25); x.fillRect(x0,y-h*.2,w,h*.04);
  x.fillStyle=N('#f2e8d8'); x.fillRect(x0+w*.2,y-h*.7,w*.6,h*.08); x.fillStyle=N('#3a2a22'); for(let k=0;k<5;k++) x.fillRect(x0+w*(.24+k*.11),y-h*.68,w*.05,h*.04); /* the name board */
  x.fillStyle=N('#5a5a5e'); x.beginPath(); x.moveTo(x0-w*.05,y-h*.96); x.lineTo(x0+w*.5,y-h*1.5); x.lineTo(x0+w*1.05,y-h*.96); x.closePath(); x.fill(); /* roof */
  x.strokeStyle=v3rgba(P.rim,.35+P.d*.4); x.lineWidth=1; x.beginPath(); x.moveTo(x0+w*.5,y-h*1.5); x.lineTo(x0+w*1.05,y-h*.96); x.stroke();
  x.fillStyle=N('#2a1c18'); x.fillRect(x0-1,y-h*.82,w*.07,h*.64); /* the portal's dark mouth, seen at its end */ }
/* the pumpkin patch: a field edge with hay bales, pumpkins, a split-rail fence and the scarecrow (the crow is drawn live) */
const ML_SC={x:.46};
function mlPatch(x,P,hz){ const N=c0=>MLN(P,c0,.66), y=hz-H*.002, r=v3rng(61);
  x.fillStyle=N('#8a7a3a'); x.beginPath(); x.moveTo(W*.37,hz+1); x.quadraticCurveTo(W*.45,hz-H*.024,W*.56,hz+1); x.closePath(); x.fill();
  x.strokeStyle=N('#6a4a30'); x.lineWidth=Math.max(1,H*.002); for(const [a,b] of [[.38,.44],[.5,.555]]){ x.beginPath(); x.moveTo(W*a,y-H*.012); x.lineTo(W*b,y-H*.016); x.moveTo(W*a,y-H*.006); x.lineTo(W*b,y-H*.008); x.stroke(); for(let k=0;k<=3;k++) { const X=W*(a+(b-a)*k/3); x.beginPath(); x.moveTo(X,y); x.lineTo(X,y-H*.018); x.stroke(); } }
  for(const [px,s] of [[.405,1],[.425,.8]]){ const X=W*px, bw=H*.03*s, bh=H*.02*s; x.fillStyle=N('#d8b050'); x.fillRect(X-bw/2,y-bh,bw,bh); x.fillStyle=N('#b08a30'); x.fillRect(X-bw/2,y-bh*.55,bw,1); x.fillRect(X-bw/2,y-bh*.25,bw,1); x.fillStyle=v3rgba(P.rim,.3*P.d); x.fillRect(X-bw/2,y-bh,bw,1); }
  for(let i=0;i<9;i++){ const X=W*(.435+r()*.1), s=H*(.004+r()*.003); x.fillStyle=N(i%4?'#e07a2a':'#d8a030'); x.beginPath(); x.ellipse(X,y-s*.7,s*1.25,s,0,0,7); x.fill(); x.fillStyle=N('#4a6a2a'); x.fillRect(X-.5,y-s*1.9,1.2,s*.6); }
  /* the scarecrow, fishing (it is very patient): a post, a crossbar, a plaid shirt, a straw hat and a bent stick rod with a line */
  const sx=W*ML_SC.x, s=H*.006; x.fillStyle=N('#6a4a30'); x.fillRect(sx-s*.3,y-s*9,s*.6,s*9); x.fillRect(sx-s*3,y-s*7,s*6,s*.5);
  x.fillStyle=N('#a8362a'); x.fillRect(sx-s*1.6,y-s*7.4,s*3.2,s*3.4); x.fillStyle=N('#5a2018'); x.fillRect(sx-s*1.6,y-s*6,s*3.2,s*.4); x.fillRect(sx-s*.2,y-s*7.4,s*.4,s*3.4);
  x.fillStyle=N('#3a4a6a'); x.fillRect(sx-s*1.2,y-s*4,s*2.4,s*1.6); x.fillStyle=N('#d8b050'); x.fillRect(sx-s*3,y-s*7.2,s*1.4,s*.8); x.fillRect(sx+s*1.6,y-s*7.2,s*1.4,s*.8); /* straw hands */
  x.fillStyle=N('#e8d8b0'); x.beginPath(); x.arc(sx,y-s*8.4,s*1.1,0,7); x.fill(); x.fillStyle=N('#2a1a10'); x.fillRect(sx-s*.5,y-s*8.6,s*.25,s*.25); x.fillRect(sx+s*.25,y-s*8.6,s*.25,s*.25);
  x.fillStyle=N('#c8a048'); x.beginPath(); x.ellipse(sx,y-s*9.3,s*2,s*.45,0,0,7); x.fill(); x.fillRect(sx-s*.9,y-s*10.4,s*1.8,s*1.1);
  x.strokeStyle=N('#5a3a22'); x.lineWidth=Math.max(1,s*.3); x.beginPath(); x.moveTo(sx+s*2.6,y-s*6.8); x.quadraticCurveTo(sx+s*5,y-s*10,sx+s*8,y-s*10.5); x.stroke();
  x.strokeStyle=v3rgba('#f4ecd8',.55); x.lineWidth=.8; x.beginPath(); x.moveTo(sx+s*8,y-s*10.5); x.lineTo(sx+s*8.6,hz+H*.012); x.stroke(); }
/* the leaf pile by the right-hand maple, with a rake leaning on the trunk (someone gave up halfway) */
function mlPile(x,P,hz){ const N=c0=>MLN(P,c0,.65), cx=W*.9, y=hz+H*.012, r=v3rng(83);
  x.fillStyle=P.bank; x.beginPath(); x.moveTo(W*.78,hz+2); x.quadraticCurveTo(W*.88,hz-H*.016,W*1.01,hz-H*.008); x.lineTo(W*1.01,hz+H*.034); x.quadraticCurveTo(W*.9,hz+H*.03,W*.78,hz+2); x.closePath(); x.fill();
  for(let i=0;i<40;i++){ const a=r(), X=cx-H*.05+a*H*.1, top=y-H*.03*Math.sin(a*Math.PI), Y=top+r()*(y-top); x.fillStyle=N(ML_LEAF[i%ML_LEAF.length]); x.beginPath(); x.ellipse(X,Y,H*.006,H*.003,r()*3,0,7); x.fill(); }
  x.strokeStyle=N('#8a6a42'); x.lineWidth=Math.max(1,H*.003); x.beginPath(); x.moveTo(W*.948,hz-H*.075); x.lineTo(W*.968,y); x.stroke();
  x.strokeStyle=N('#5a5a5e'); x.lineWidth=Math.max(1,H*.002); x.beginPath(); for(let k=0;k<6;k++){ x.moveTo(W*.958+k*H*.004,y-H*.004); x.lineTo(W*.96+k*H*.004,y+H*.004); } x.moveTo(W*.956,y-H*.004); x.lineTo(W*.98,y-H*.004); x.stroke(); }
/* one falling or floating leaf: a maple-ish shape (three points) turned by a */
/* (a pointed oval with a stem: at this size a many-pointed maple shape read as a star, 2026-11-25) */
function mlLeaf(x,y,s,a,col){ g.save(); g.translate(x,y); g.rotate(a); g.fillStyle=col; g.beginPath(); g.moveTo(0,-s); g.quadraticCurveTo(s*.85,-s*.25,0,s*.75); g.quadraticCurveTo(-s*.85,-s*.25,0,-s); g.fill();
  g.strokeStyle=mix(col,'#000000',.35); g.lineWidth=Math.max(.6,s*.14); g.beginPath(); g.moveTo(0,-s*.6); g.lineTo(0,s*1.05); g.stroke(); g.restore(); }
/* the treehouse maple's crown: clusters of small leaf blobs, each cluster mostly one colour, a shadow pass, the colour, then sunlit tops */
function mlCanopy(c,P,dockY){ const tx=MLH.trunk(), py=MLH.plat(dockY), r=v3rng(91), base=['#c8642a','#a8361e','#d9a23a','#b8542a','#7e2a3a','#e08a2a','#c8642a','#a8361e'];
  const CL=[[tx-W*.035,py-H*.5,1.15],[tx+W*.03,py-H*.44,1.2],[tx+W*.1,py-H*.38,1],[tx+W*.155,py-H*.26,.85],[tx-W*.005,py-H*.27,.95],[tx+W*.075,py-H*.22,.8],[tx+W*.09,py-H*.52,.95],[tx-W*.04,py-H*.36,1],
    [tx+W*.03,py-H*.32,1.1],[tx+W*.11,py-H*.27,.85],[tx+W*.055,py-H*.55,1],[tx+W*.13,py-H*.48,.9],[tx-W*.03,py-H*.22,.8]], B=[]; /* the last five fill the gaps, so the crown reads as one tree */
  base.push('#b8542a','#d9a23a','#a8361e','#c8642a','#7e2a3a');
  CL.forEach(([cx,cy,k],ci)=>{ for(let i=0;i<22;i++){ const a=r()*Math.PI*2, d=Math.sqrt(r()); B.push([cx+Math.cos(a)*H*.075*k*d,cy+Math.sin(a)*H*.06*k*d,H*(.012+r()*.012)*k,ci]); } });
  const pass=(fn,dx,dy,kk,filt)=>{ for(const [bx,by,br,ci] of B){ if(filt&&!filt(bx,by,ci)) continue; c.fillStyle=fn(ci); c.beginPath(); c.arc(bx+dx,by+dy,br*kk,0,7); c.fill(); } };
  pass(ci=>mix(MLN(P,base[ci],.8),'#1a0a08',.45),0,H*.008,1.15);
  pass(ci=>MLN(P,base[ci],.8),0,0,1);
  pass(ci=>mix(MLN(P,base[ci],.85),P.leafHi,.3+P.d*.15),-H*.004,-H*.006,.55,(bx,by,ci)=>by<CL[ci][1]-H*.01);
  /* a few leaves scattered at the crown's edge, so it never ends in a hard round line */
  for(let i=0;i<40;i++){ const [cx,cy,k]=CL[i%CL.length], a=r()*Math.PI*2, X=cx+Math.cos(a)*H*.085*k, Y=cy+Math.sin(a)*H*.07*k; c.fillStyle=MLN(P,base[i%base.length],.8); c.beginPath(); c.ellipse(X,Y,H*.005,H*.003,a,0,7); c.fill(); } }
/* the squirrel's routine by day (period 40 s): out of the right-hand maple, down to the leaf pile, digs to bury an acorn, sits up, runs back;
   at night it stays home in its tree (it never pops in or out: it always enters and leaves at the trunk) */
function mlSquirrel(P,t,hz){ if(P.night>.6) return; const per=40, q=(t%per)/per; if(q>.6) return; const x0=W*.94, x1=W*.86, y=hz+H*.006, s=H*.0055, N=c0=>mix(c0,P.front,P.night*.5+.05);
  let x, dir, pose; if(q<.12){ const e=q/.12; x=x0+(x1-x0)*e; dir=-1; pose='run'; } else if(q<.3){ x=x1; dir=-1; pose='dig'; } else if(q<.46){ x=x1; dir=1; pose='sit'; } else { const e=(q-.46)/.14; x=x1+(x0-x1)*e; dir=1; pose='run'; }
  g.save(); g.translate(x,y); g.scale(dir,1); const hop=pose==='run'?Math.abs(Math.sin(t*14))*s*1.2:0, dig=pose==='dig'?Math.sin(t*20)*s*.4:0; g.translate(0,-hop);
  g.fillStyle=N('#9a5a2a'); g.beginPath(); if(pose==='sit'){ g.ellipse(0,-s*2.2,s*1.1,s*1.9,-.15,0,7); } else g.ellipse(0,-s*1.1,s*2,s*1,pose==='dig'?.35:0,0,7); g.fill(); /* body */
  const hx=pose==='sit'?s*.5:s*1.8, hy=pose==='sit'?-s*4.2:(pose==='dig'?-s*.5:-s*1.7); g.beginPath(); g.arc(hx,hy,s*.85,0,7); g.fill(); g.beginPath(); g.moveTo(hx-s*.3,hy-s*.6); g.lineTo(hx-s*.1,hy-s*1.4); g.lineTo(hx+s*.3,hy-s*.6); g.fill(); /* head and ear */
  g.fillStyle=N('#b8723a'); g.beginPath(); g.moveTo(-s*1.6,-s*1); g.quadraticCurveTo(-s*4.2,-s*2.5,-s*2.6,-s*5.2); g.quadraticCurveTo(-s*1.6,-s*3.4,-s*.8,-s*1.4); g.closePath(); g.fill(); /* the bushy tail */
  g.fillStyle='#1a120c'; g.fillRect(hx+s*.25,hy-s*.25,Math.max(1,s*.3),Math.max(1,s*.3));
  if(pose==='dig'){ g.fillStyle=N('#6a4a2a'); for(let k=0;k<3;k++){ const u=((t*3+k/3)%1); g.fillRect(s*2.2+u*s*3,-s*u*3+dig,s*.4,s*.4); } }
  if(pose==='sit'){ g.fillStyle=N('#7a4a22'); g.beginPath(); g.ellipse(s*1.4,-s*3,s*.45,s*.55,0,0,7); g.fill(); } /* holding the next acorn */
  g.restore(); }
/* the leaf whirlwind (the moment, every 45 s for 7 s): a tight spinning column of leaves crossing the water from right to left */
const ML_GUST={per:45,from:2,to:9};
function mlGust(P,t,hz){ const q=t%ML_GUST.per; if(q<ML_GUST.from||q>ML_GUST.to) return; const e=(q-ML_GUST.from)/(ML_GUST.to-ML_GUST.from), cx=W*(.95-e*.6), base=hz+H*.12, top=hz-H*.14, fade=Math.min(1,e*6,(1-e)*6);
  g.save(); g.globalAlpha=fade; g.strokeStyle=v3rgba('#ffffff',.18); g.lineWidth=1; g.beginPath(); g.ellipse(cx,base,H*.05,H*.008,0,0,7); g.stroke();
  for(let i=0;i<46;i++){ const u=i/46, y=base-(base-top)*u, rr=H*(.012+.05*u), a=t*7+i*1.9, X=cx+Math.cos(a)*rr+Math.sin(t*2+u*4)*H*.01, Y=y+Math.sin(a)*rr*.25;
    mlLeaf(X,Y,H*(.006+.004*Math.sin(i)),a,MLN(P,ML_LEAF[i%ML_LEAF.length],.55)); }
  g.restore(); }
V3SCENES.blossom={
  land(x,P,hz,cnv){
    /* far ridges, hazy, dotted with round autumn treetops (no mountains: a hollow is low and soft) */
    { const ridge=(seed,base,amp,col,step,th,mute)=>{ const n=v3noise(seed), yAt=f=>base-amp*(.55+.3*n(f*2.3+.4)+.15*n(f*6.1+2)), r=v3rng(seed+5);
        x.fillStyle=col; x.beginPath(); x.moveTo(0,hz+1); for(let X=0;X<=W+4;X+=4) x.lineTo(X,yAt(X/W)); x.lineTo(W,hz+1); x.closePath(); x.fill();
        for(let X=-W*.005;X<W*1.01;X+=W*step*(.6+r()*.8)){ const y=yAt(X/W)+H*.006, h=H*th*(.7+r()*.6); x.fillStyle=mix(MLN(P,ML_LEAF[Math.floor(r()*6)],.82),col,mute); x.beginPath(); x.ellipse(X,y-h*.4,h*.45,h*.48,0,0,7); x.fill(); } };
      ridge(13,hz+1,.12*H,mix(P.far,P.farHaze,.35),.0075,.03,.62);
      ridge(41,hz+1,.07*H,mix(P.far,P.hill,.55),.009,.036,.4); }
    wa.hills(x,hz,P.hill,[[0,.03],[.12,.045],[.28,.028],[.4,.036],[.55,.024],[.7,.04],[.86,.03],[1,.042]]);
    /* a few dark spruces among the colour, so the reds and golds have something to glow against */
    for(const [fx,fh] of [[.315,.06],[.335,.05],[.585,.055],[.6,.07],[.765,.06]]) v3pine(x,W*fx,hz+1,H*fh,MLN(P,'#2e3a2a',.5),P.rim,P.d*.25);
    mlBridge(x,P,hz); mlPatch(x,P,hz);
    /* the big maples along the near shore, each its own mix of colours; open water in the middle of the lake */
    for(const [fx,fh,sd] of [[.21,.12,3],[.26,.09,8],[.31,.1,14],[.55,.085,21],[.6,.11,27],[.76,.1,33],[.81,.075,39]]) mlMaple(x,W*fx,hz+2,H*fh,P,sd);
    v3bushes(x,W*.18,W*.34,hz+3,H*.018,P,45,{leaf:MLN(P,'#8a5a2a',.65)}); v3bushes(x,W*.52,W*.64,hz+3,H*.016,P,49,{leaf:MLN(P,'#7e3a2a',.65)});
    mlPile(x,P,hz);
    mlMaple(x,W*.93,hz-H*.006,H*.2,P,57,['#a8361e','#d9a23a']); /* the squirrel's maple on the right bank: a hollow in the trunk is its home */
    x.fillStyle=MLN(P,'#1e1410',.3); x.beginPath(); x.ellipse(W*.93,hz-H*.06,H*.006,H*.009,0,0,7); x.fill();
    v3reeds(x,W*.78,W*.86,hz+H*.02,H*.03,MLN(P,'#a8823a',.6),51); v3reeds(x,W*.16,W*.3,hz+3,H*.022,MLN(P,'#8a6a3a',.6),59);
    v3water(x,P,hz,cnv,.36);
  },
  live(P,t,hz,sun){ const FX=S.settings.effects, night=P.night, d=P.d, hi=gfxHigh();
    v3glitter(P,t,hz,sun);
    v3mist(P,t,hz,.2*d+.1*night+.12*(1-night)*(phase()>.75||phase()<.3?1:0)); /* autumn mornings are misty too */
    v3fishRing(P,t,hz,6.7,.35,.8);
    /* lights after dark: the bridge lantern and the jack-o'-lanterns in the pumpkin patch, flickering */
    const lit=clamp(night*1.2+d*.6,0,1); if(lit>.05){ const fl=k=>.85+.15*Math.sin(t*6.3+k)*Math.sin(t*2.9+k*2);
      const bx=W*ML_BR.x-W*.004, by=hz-H*.03; v3glow(g,bx,by,H*.03,'rgba(255,200,120,.9)',lit*.8*fl(1)); g.fillStyle=v3rgba('#ffd890',lit); g.fillRect(bx-1,by-1.5,2,3);
      for(const [px,k] of [[.44,2],[.52,3]]){ const X=W*px, Y=hz-H*.006; v3glow(g,X,Y,H*.02,'rgba(255,150,60,.9)',lit*.7*fl(k)); g.fillStyle=v3rgba('#ffb040',.8*lit); g.fillRect(X-1.5,Y-1,3,1.5); } }
    /* floating leaves on the lake, drifting slowly with the breeze, larger toward you */
    for(let i=0,n=hi?26:16;i<n;i++){ const y=hz+H*(.02+((i*.377)%1)*.36), k=(y-hz)/(H-hz), xx=((W*((i*.618)%1)+t*W*(.004+(i%3)*.002)*(1+k))%(W*1.05))-W*.02, s=H*(.003+k*.012);
      g.save(); g.translate(xx,y+Math.sin(t*.8+i)*k*1.5); g.scale(1,.45); mlLeaf(0,0,s,i*.7+Math.sin(t*.3+i)*.2,MLN(P,ML_LEAF[i%6],.55)); g.restore(); }
    /* geese heading south in a V by day (right to left, high, every 52 s) */
    if(night<.5){ const per=52, q=(t%per)/per; if(q<.45){ const e=q/.45, lx=W*(1.08-e*1.2), ly=hz*(.3+.05*Math.sin(e*3)); for(let i=0;i<7;i++){ const row=Math.ceil(i/2), side=i%2?1:-1; waGoose(lx+row*H*.03,ly+side*row*H*.014,H*.0045,-1,P,t,i,true); } } }
    /* the crow: perches on the scarecrow's hat, then flaps off over the field and comes back (it never vanishes mid-air) */
    { const per=24, q=(t%per)/per, sx=W*ML_SC.x, sy=hz-H*.002-H*.006*10.6, s=H*.004, N=c0=>mix(c0,P.front,night*.4); let x=sx, y=sy, fly=false;
      if(q>.55){ const e=(q-.55)/.45; fly=true; x=sx+Math.sin(e*Math.PI*2)*W*.06; y=sy-Math.sin(e*Math.PI)*H*.06; }
      g.fillStyle=N('#1a1a22'); g.beginPath(); g.ellipse(x,y-s,s*1.4,s*.8,0,0,7); g.fill(); g.beginPath(); g.arc(x+s*1.2,y-s*1.5,s*.6,0,7); g.fill(); g.fillStyle=N('#3a3a30'); g.beginPath(); g.moveTo(x+s*1.7,y-s*1.5); g.lineTo(x+s*2.4,y-s*1.3); g.lineTo(x+s*1.7,y-s*1.2); g.fill();
      if(fly){ const f=Math.sin(t*12); g.fillStyle=N('#1a1a22'); g.beginPath(); g.moveTo(x-s*.4,y-s); g.lineTo(x-s*.2,y-s-s*2.4*f); g.lineTo(x+s*.6,y-s); g.fill(); } }
    mlSquirrel(P,t,hz);
    /* bats at night, flitting in loops over the trees */
    if(FX&&night>.45){ g.fillStyle=v3rgba('#120c14',.85*Math.min(1,(night-.45)*4)); for(let i=0;i<4;i++){ const a=t*(.7+i*.13)+i*2, X=W*(.3+i*.15)+Math.cos(a)*W*.05, Y=hz*(.55+i*.06)+Math.sin(a*1.7)*H*.04, s=H*.006, f=Math.sin(t*16+i);
      g.beginPath(); g.moveTo(X,Y); g.quadraticCurveTo(X-s,Y-s*1.4*f,X-s*2,Y-s*.2); g.quadraticCurveTo(X-s,Y+s*.2,X,Y+s*.3); g.quadraticCurveTo(X+s,Y+s*.2,X+s*2,Y-s*.2); g.quadraticCurveTo(X+s,Y-s*1.4*f,X,Y); g.fill(); } }
    /* leaves falling from the trees: flutter down, land on the water and float off (never popping in or out) */
    if(FX){ for(let i=0,n=hi?16:10;i<n;i++){ const per=12+(i%5)*1.6, q=((t+i*2.3)%per)/per, sx=W*(((i*.271)%1)*.9+.05), wy=hz+H*(.02+((i*.53)%1)*.3), fall=Math.min(1,q/.45), y=hz-H*.16+(wy-hz+H*.16)*v3s(fall), xx=sx-q*W*.07+Math.sin(t*1.7+i)*W*.01*(1-fall), a=q<.88?1:(1-q)/.12;
      g.save(); g.globalAlpha=a; if(fall>=1){ g.translate(xx,y); g.scale(1,.45); mlLeaf(0,0,H*.006,i,MLN(P,ML_LEAF[i%6],.55)); } else mlLeaf(xx,y,H*.006,t*(1.6+i%3*.5)+i,MLN(P,ML_LEAF[i%6],.55)); g.restore(); } }
    mlGust(P,t,hz);
  },
  fore(P,t){
    /* rust-coloured cattails in the bottom-right corner, swaying, rim lit at dusk, with a few leaves caught at their feet */
    const base=H+2, x0=W*.93;
    for(let i=0;i<8;i++){ const x=x0+i*W*.009, h=H*(.09+((i*13)%5)*.02), sw=Math.sin(t*1.1+i*.6)*H*.008;
      g.strokeStyle=mix('#6a6a2a',P.front,.3+P.night*.45); g.lineWidth=Math.max(1.4,H*.006); g.beginPath(); g.moveTo(x,base); g.quadraticCurveTo(x+sw*.4,base-h*.6,x+sw,base-h); g.stroke();
      if(i%3===0){ g.fillStyle=mix('#7a3a1e',P.front,P.night*.5); g.beginPath(); g.ellipse(x+sw,base-h-H*.012,H*.0065,H*.022,sw*.02,0,7); g.fill(); g.fillStyle=v3rgba(P.rim,.4*P.d); g.fillRect(x+sw+H*.002,base-h-H*.028,1,H*.02); } }
    for(let i=0;i<5;i++){ g.save(); g.translate(W*(.935+i*.013),H-H*.01-(i%2)*H*.006); g.scale(1,.5); mlLeaf(0,0,H*.012,i*1.3,MLN(P,ML_LEAF[(i+1)%6],.5)); g.restore(); }
  }
};
wx3SkyLayer('blossom');
wx3WaterLayer('blossom');
l3wakeLayer('blossom');
depthHazeLayer('blossom');
depthMotesLayer('blossom');

// ---------- the home: the treehouse in the giant maple ----------
/* everything in the scene's units, placed from the angler (who stands at W*.12 on the deck at dockY): the trunk stands in the water behind
   the deck's left end, the cabin sits on a platform in the branches above the angler's head, the canopy runs off the top-left corner */
const MLH = { trunk:()=>W*.045, plat:dockY=>dockY-H*.2, cab0:()=>W*.03, cab1:()=>W*.125 };
function mlHomePaint(x,P,dockY){ const N=c0=>MLN(P,c0,.55), wl=HF.wl(dockY), pw=HF.pw(), tx=MLH.trunk(), py=MLH.plat(dockY), c0=MLH.cab0(), c1=MLH.cab1(), cw=c1-c0, ch=H*.085, bark=N('#5a3a26'), barkD=N('#3a2418'), wood=N('#b07a48'), woodD=N('#7a5030');
  /* the trunk, from the water up into the crown, flaring at its foot, with bark lines and a rim of light */
  const tw=H*.05; x.fillStyle=bark; x.beginPath(); x.moveTo(tx-tw*.75,wl+H*.01); x.quadraticCurveTo(tx-tw*.45,dockY-H*.05,tx-tw*.4,py-H*.08); x.lineTo(tx-tw*.3,0); x.lineTo(tx+tw*.35,0); x.lineTo(tx+tw*.45,py-H*.08); x.quadraticCurveTo(tx+tw*.5,dockY-H*.05,tx+tw*.8,wl+H*.01); x.closePath(); x.fill();
  x.strokeStyle=barkD; x.lineWidth=1; for(let k=0;k<6;k++){ const X=tx-tw*.3+k*tw*.12; x.beginPath(); x.moveTo(X,wl); x.bezierCurveTo(X+2,dockY-H*.1,X-2,py,X+1,0); x.stroke(); }
  x.fillStyle=v3rgba(P.rim,.15+P.d*.3); x.fillRect(tx+tw*.25,0,1.5,wl-H*.01);
  /* two big limbs holding the platform, and branches up into the crown */
  x.strokeStyle=bark; x.lineCap='round'; x.lineWidth=H*.016; x.beginPath(); x.moveTo(tx,py+H*.01); x.quadraticCurveTo(tx+W*.04,py+H*.02,c1+W*.012,py-H*.002); x.stroke();
  x.lineWidth=H*.011; x.beginPath(); x.moveTo(tx,py-H*.06); x.quadraticCurveTo(tx+W*.06,py-H*.11,c1+W*.03,py-H*.17); x.moveTo(tx,py-H*.1); x.quadraticCurveTo(tx-W*.02,py-H*.16,-W*.01,py-H*.22); x.stroke(); x.lineCap='butt';
  /* the platform: beams on the limbs, plank floor, a short rail */
  x.fillStyle=woodD; x.fillRect(c0-W*.012,py,cw+W*.03,H*.012); x.fillStyle=wood; x.fillRect(c0-W*.014,py-H*.004,cw+W*.034,H*.006);
  x.strokeStyle=woodD; x.lineWidth=Math.max(1,H*.003); x.beginPath(); x.moveTo(c1+W*.016,py); x.lineTo(c1+W*.016,py-H*.026); x.lineTo(c1-W*.002,py-H*.026); x.stroke();
  x.beginPath(); x.moveTo(c1+W*.004,py+H*.012); x.lineTo(tx+tw*.2,py+H*.06); x.stroke(); /* a brace back to the trunk */
  /* the cabin: board walls in faded barn red, a steep shingle roof in burgundy, a round window and a square one, a little door */
  const wy=py-ch, red=N('#9a4a32'); x.fillStyle=red; x.fillRect(c0,wy,cw,ch); x.fillStyle=N('#7a3624'); for(let k=1;k<10;k++) x.fillRect(c0+cw*k/10,wy,1,ch);
  x.fillStyle=v3rgba('#000000',.2); x.fillRect(c0+cw*.62,wy,cw*.38,ch);
  x.fillStyle=N('#5a2030'); x.beginPath(); x.moveTo(c0-W*.012,wy+H*.003); x.lineTo(c0+cw*.5,wy-H*.07); x.lineTo(c1+W*.012,wy+H*.003); x.closePath(); x.fill();
  x.fillStyle=N('#4a1826'); for(let k=1;k<5;k++){ const yy=wy-H*.07+k*H*.0146, half=(cw*.5+W*.012)*k/5; x.fillRect(c0+cw*.5-half,yy,half*2,1); }
  x.strokeStyle=v3rgba(P.rim,.35+P.d*.4); x.lineWidth=1; x.beginPath(); x.moveTo(c0+cw*.5,wy-H*.07); x.lineTo(c1+W*.012,wy+H*.003); x.stroke();
  x.fillStyle=N('#4a3a30'); x.fillRect(c0+cw*.72,wy-H*.085,W*.006,H*.04); x.fillStyle=N('#2a2420'); x.fillRect(c0+cw*.72-1,wy-H*.088,W*.006+2,H*.006); /* the stovepipe */
  x.fillStyle=woodD; x.fillRect(c1-cw*.3,py-ch*.62,cw*.2,ch*.62); x.fillStyle=N('#e8b04a'); x.fillRect(c1-cw*.14,py-ch*.32,2,2); /* the door and its knob */
  x.strokeStyle=N('#8a6a42'); x.lineWidth=Math.max(1,H*.0025); x.beginPath(); x.moveTo(c0+cw*.5,wy-H*.07); x.lineTo(c0+cw*.5,wy-H*.11); x.stroke(); x.fillStyle=N('#d9a23a'); x.beginPath(); x.moveTo(c0+cw*.5,wy-H*.11); x.lineTo(c0+cw*.5+W*.016,wy-H*.1); x.lineTo(c0+cw*.5,wy-H*.09); x.closePath(); x.fill(); /* a pennant */
  /* the rope ladder from the platform down to the deck, beside the trunk */
  const lx=tx+tw*.75; x.strokeStyle=N('#c8a878'); x.lineWidth=Math.max(1,H*.002); x.beginPath(); x.moveTo(lx,py); x.lineTo(lx+W*.002,dockY); x.moveTo(lx+W*.012,py); x.lineTo(lx+W*.014,dockY); x.stroke();
  x.strokeStyle=wood; x.lineWidth=Math.max(1,H*.003); for(let k=1;k<9;k++){ const yy=py+(dockY-py)*k/9; x.beginPath(); x.moveTo(lx,yy); x.lineTo(lx+W*.013,yy); x.stroke(); }
  /* the deck: planks on posts standing in the water (their ripples are drawn live), dark under-edge */
  const posts=[]; x.fillStyle=woodD; for(let k=0;k<5;k++){ const X=W*.03+k*(pw-W*.04)/4, w=H*.012; posts.push(X); const gr=x.createLinearGradient(0,dockY,0,wl+H*.06); gr.addColorStop(0,woodD); gr.addColorStop(.6,mix(woodD,P.wMid,.5)); gr.addColorStop(1,v3rgba(P.wMid,0)); x.fillStyle=gr; x.fillRect(X-w/2,dockY,w,wl+H*.06-dockY); }
  x.fillStyle=wood; x.fillRect(-4,dockY,pw+4,H*.012); x.fillStyle=woodD; for(let X=-4;X<pw;X+=H*.03) x.fillRect(X,dockY,1,H*.012); x.fillStyle=v3rgba('#000000',.3); x.fillRect(-4,dockY+H*.012,pw+4,H*.004); x.fillStyle=v3rgba(P.rim,.2+P.d*.3); x.fillRect(-4,dockY,pw+4,1);
  /* pumpkins on the deck by the ladder: one carved (its face glows at night, drawn live), two plain */
  for(const [px,s,col] of [[.075,1,'#e07a2a'],[.09,.7,'#d8a030'],[.02,.8,'#c8642a']]){ const X=W*px, r=H*.011*s; x.fillStyle=N(col); x.beginPath(); x.ellipse(X,dockY-r*.8,r*1.25,r*.85,0,0,7); x.fill(); x.fillStyle=N(mix(col,'#000000',.25)); x.fillRect(X-.5,dockY-r*1.6,1,r*1.5); x.fillStyle=N('#4a6a2a'); x.fillRect(X-1,dockY-r*1.9,2,r*.5); }
  /* the mustard Adirondack chair at the seat: slanted back slats, wide arms, legs on the deck */
  const sx=HF.seatX(), sc=HF.sc(), sh=MLH_SEAT*sc, seat=N('#d9a23a'), seatD=N('#a8781a'); x.fillStyle=seatD; x.fillRect(sx-6*sc,dockY-sh,1.6*sc,sh); x.fillRect(sx+7*sc,dockY-sh*.9,1.6*sc,sh*.9);
  x.fillStyle=seat; x.fillRect(sx-7*sc,dockY-sh-1.6*sc,16*sc,2.4*sc); x.fillRect(sx-8*sc,dockY-sh-9*sc,17*sc,1.6*sc); /* seat and arm */
  for(let k=0;k<4;k++){ x.save(); x.translate(sx-7*sc+k*1.6*sc,dockY-sh); x.rotate(-.35); x.fillRect(0,-17*sc,1.4*sc,17*sc); x.restore(); } /* the back slats */
  return {posts,wl}; }
const MLH_SEAT=13; /* the Adirondack chair's seat height in angler units (the muskoka chair's height) */
function mlHomeDraw(t,night,dockY,P){ if(!P) return false; const DL=Math.min(DPR||1,2), key=[W,H,DL,dockY,Math.round(night*24),Math.round(P.d*12),Math.round(P.gloom*6),P.rim].join('|');
  let C=mlHomeDraw.c; if(!C||C.key!==key){ C=mlHomeDraw.c=mlHomeDraw.c||{cv:document.createElement('canvas')}; C.key=key; C.cv.width=Math.ceil(W*.3*DL); C.cv.height=Math.ceil(H*DL); const x=C.cv.getContext('2d'); x.setTransform(DL,0,0,DL,0,0); x.clearRect(0,0,W*.3,H); C.info=mlHomePaint(x,P,dockY);
    C.can=C.can||document.createElement('canvas'); const ph=MLH.plat(dockY); C.can.width=Math.ceil(W*.3*DL); C.can.height=Math.ceil(ph*DL); const y=C.can.getContext('2d'); y.setTransform(DL,0,0,DL,0,0); y.clearRect(0,0,W*.3,ph); mlCanopy(y,P,dockY); }
  const {posts,wl}=C.info, pw=HF.pw(), a0=.26-night*.1;
  /* the water going past each post: a contact line and short ripples drifting away (drawn first, so the posts cover their start) */
  g.lineWidth=1; for(const px of posts){ g.strokeStyle='rgba(255,255,255,'+a0+')'; g.beginPath(); g.moveTo(px-H*.008,wl); g.lineTo(px+H*.008,wl); g.stroke();
    const u=((t*.32+px*.0137)%1+1)%1; g.strokeStyle='rgba(255,255,255,'+(a0*(1-u)*.9)+')'; g.beginPath(); g.moveTo(px+H*.008+u*H*.04,wl+H*.003); g.lineTo(px+H*.02+u*H*.05,wl+H*.003); g.stroke(); }
  g.drawImage(C.cv,0,0,W*.3,H);
  /* the canopy over the top-left: a stored picture (built with the home's light), swaying a little in the breeze */
  { const K=C.can, sw=V3PAR.rm.matches?0:(Math.sin(t*.8)+.35*Math.sin(t*.37+1.2))*H*.003; g.drawImage(K,sw,0,W*.3,K.height/(K.width/(W*.3))); }
  /* after dark: the windows and the carved pumpkin glow, smoke rises from the stovepipe */
  const lit=clamp(night*1.2+P.d*.7,0,1), py=MLH.plat(dockY), c0=MLH.cab0(), c1=MLH.cab1(), cw=c1-c0, ch=H*.085, wy=py-ch;
  const win=[[c0+cw*.22,wy+ch*.35,H*.012,true],[c0+cw*.48,wy+ch*.38,H*.016,false]];
  for(const [X,Y,s,round] of win){ g.fillStyle=lit>.05?v3rgba('#ffcf7a',.3+lit*.7):mix(P.wTop,'#3a2a22',.5); g.beginPath(); if(round) g.arc(X,Y,s,0,7); else g.rect(X-s,Y-s*.8,s*2,s*1.6); g.fill();
    g.strokeStyle=MLN(P,'#4a2a1a',.4); g.lineWidth=Math.max(1,H*.002); g.beginPath(); if(round) g.arc(X,Y,s,0,7); else g.rect(X-s,Y-s*.8,s*2,s*1.6); g.moveTo(X-s,Y); g.lineTo(X+s,Y); g.moveTo(X,Y-s*.8); g.lineTo(X,Y+s*.8); g.stroke();
    if(lit>.05) v3glow(g,X,Y,H*.05,'rgba(255,200,110,.9)',lit*.45*(.94+.06*Math.sin(t*3.1+X))); }
  if(lit>.05){ const X=W*.075, Y=dockY-H*.009, fl=.85+.15*Math.sin(t*6.1)*Math.sin(t*2.3); v3glow(g,X,Y,H*.05,'rgba(255,150,60,.9)',lit*.6*fl); g.fillStyle=v3rgba('#ffc050',lit*fl);
    g.beginPath(); g.moveTo(X-H*.008,Y-H*.004); g.lineTo(X-H*.004,Y-H*.008); g.lineTo(X-H*.002,Y-H*.004); g.moveTo(X+H*.008,Y-H*.004); g.lineTo(X+H*.004,Y-H*.008); g.lineTo(X+H*.002,Y-H*.004); g.fill(); g.fillRect(X-H*.007,Y,H*.014,H*.003);
    v3lightPool(X,dockY-1,W*.06,'255,160,70',.25*lit); v3lanternReflect(X,HF.wl(dockY),lit,t,'255,170,80'); }
  if(S.settings.effects){ const sx=c0+cw*.72+W*.003, sy=wy-H*.088, sc=mix(P.farHaze,'#ffffff',.4); for(let i=0;i<5;i++){ const k=((t*.12+i/5)%1); v3glow(g,sx+Math.sin(k*4+i)*H*.006+k*H*.03,sy-k*H*.09,H*(.007+k*.025),v3rgba(sc,.9),.4*(1-k)*(k<.08?k/.08:1)); } }
  return true; }
HOMEF.blossom={ name:'Treehouse', hname:'treehouse', fixed:true /* it draws itself */, seatH:MLH_SEAT, seatX:()=>HF.pw()-W*.03, draw:mlHomeDraw, front:null, smoke:null };
