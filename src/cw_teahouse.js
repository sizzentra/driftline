// =====================================================================
// CHERRY BLOSSOM LAKE: THE TEA HOUSE (overnight, 2026-11-23; its own design, inspired by the director's reference picture
// docs/reference/blossom_director_ref.png; matched to it on the director's word, 2026-11-23 morning). A tea house over the water: a low, wide hip roof
// of dark grey kawara tiles with a heavy ridge, shoji walls and round windows that glow at night between dark posts, paper lanterns
// under the eaves, a veranda deck with a thick rope railing in front; around it a mossy bank with a bamboo fence, a stone lantern and
// azaleas, and a big cherry tree framing the top-left corner over the roof. Parts: walls, roof, lanterns, rail, door, windows, seat.
// =====================================================================
const TH = {
  geo(o){ const C=BH.cab(o,{h:1.12,ratio:2.4}); return Object.assign({},C,{roofTop:C.wallTop-C.wh*.5}); },
  /* the roof, as in the director's reference: a low, wide hip roof of dark grey kawara tiles seen from the long side, deep eaves, rows of
     round tiles, a heavy ridge with raised end tiles, the eave corners lifting a touch */
  roof(o,g,kind,c){ const q=o.x, lit=HK.lit(o), ov=W*.03, L=g.x0-ov, R=g.x1+ov, eb=g.wallTop+H*.012, ry=g.roofTop, rL=g.x0+(g.x1-g.x0)*.14, rR=g.x1-(g.x1-g.x0)*.06, col=kind===1?mix('#7a4a2e',c,.5):kind===2?mix('#5a9a8a',c,.5):c;
    const path=()=>{ q.beginPath(); q.moveTo(L-W*.004,eb-H*.008); q.quadraticCurveTo(L+(rL-L)*.55,eb-(eb-ry)*.25,rL,ry); q.lineTo(rR,ry); q.quadraticCurveTo(R-(R-rR)*.55,eb-(eb-ry)*.25,R+W*.004,eb-H*.008); q.lineTo(R,eb); q.lineTo(L,eb); q.closePath(); };
    q.fillStyle=HK.n(o,col); path(); q.fill(); q.save(); path(); q.clip();
    for(let k=0;k<9;k++){ const yy=ry+(eb-ry)*(k+1)/9; q.fillStyle=HK.n(o,HK.dk(col,.25)); q.fillRect(L-W*.01,yy-H*.0025,R-L+W*.02,H*.0025); q.fillStyle=v3rgba('#ffffff',(.06+.05*(k%2))*lit); q.fillRect(L-W*.01,yy-H*.0045,R-L+W*.02,H*.0015); } /* courses of tiles, each lit along its top */
    if(kind!==1){ q.strokeStyle=HK.n(o,HK.dk(col,.3)); q.lineWidth=1; q.beginPath(); for(let X=L;X<R;X+=W*.006){ q.moveTo(X,ry); q.lineTo(X+(X-(L+R)/2)*.04,eb); } q.stroke(); } /* the rows of round tiles running down */
    q.restore();
    HK.rect(o,rL-W*.004,ry-H*.012,rR-rL+W*.008,H*.014,HK.dk(col,.2)); HK.rect(o,rL-W*.004,ry-H*.012,rR-rL+W*.008,H*.003,v3rgba('#ffffff',.12*lit)); for(const ex of [rL-W*.006,rR+W*.006]){ HK.poly(o,[ex-W*.006,ry+H*.002,ex-W*.004,ry-H*.02,ex+W*.004,ry-H*.02,ex+W*.006,ry+H*.002],HK.dk(col,.3)); } /* the ridge and its raised end tiles */
    HK.rect(o,L,eb-H*.004,R-L,H*.006,HK.dk(col,.4)); HK.line(o,[L-W*.004,eb-H*.008,L+(rL-L)*.55,eb-(eb-ry)*.25,rL,ry],v3rgba(o.P.rim||'#fff0d0',.35*lit),1.2); /* eave edge, rim light */
    HK.rect(o,g.x0,g.wallTop,g.x1-g.x0,H*.012,v3rgba('#000000',.35)); /* the deep eave's shadow on the wall */
    o.top=Math.min(o.top==null?o.dockY-H*.23:o.top,ry-H*.04); o.low=Math.max(o.low==null?-1e9:o.low,eb); },
  /* the walls between dark posts */
  walls(o,g,kind,c,postC){ BH.walls(o,g,['shoji','plaster','bamboo'][kind],c); const n=Math.max(3,Math.round((g.x1-g.x0)/(W*.04))); for(let i=0;i<=n;i++){ const px=g.x0+(g.x1-g.x0)*i/n; HK.rect(o,px-W*.002,g.wallTop,W*.004,o.dockY-g.wallTop,postC); } HK.rect(o,g.x0,o.dockY-H*.008,g.x1-g.x0,H*.008,postC); },
  /* paper lanterns hung under the eaves, a row of small ones, or a stone lantern on the deck */
  lanterns(o,g,s,c){ const q=o.x, y=g.wallTop+H*.012;
    if(s===0||s===1){ const xs=s===0?[g.vx+W*.03,g.x1-W*.012]:[...Array(7)].map((_,i)=>Math.max(g.x0,0)+(g.x1-Math.max(g.x0,0))*(i+.5)/7), r=s===0?1:.6; let L=null; for(const lx of xs){ HK.line(o,[lx,g.wallTop+H*.004,lx,y],'#2a2024',1); HK.ell(o,lx,y+H*.014*r,W*.006*r,H*.014*r,v3rgba(mix('#fff0d0',c,.5),.92)); for(let k=-1;k<=1;k++) HK.line(o,[lx-W*.006*r,y+H*.014*r+k*H*.005*r,lx+W*.006*r,y+H*.014*r+k*H*.005*r],v3rgba(HK.dk(c,.3),.4),.6); HK.rect(o,lx-W*.003*r,y-1,W*.006*r,2,'#2a2024'); HK.rect(o,lx-W*.003*r,y+H*.027*r,W*.006*r,2,'#2a2024'); L={x:lx,y:y+H*.014*r,r:.13*r,a:.75}; } return L; }
    return BH.lantern(o,g,'stone',c); },
  /* the rope railing along the veranda's front (front layer, in front of the angler): posts with thick rope swags, a bamboo rail, or none */
  rail(night,cx,s,c){ if(s===2) return; const q=cx||g, y=HF.dockY(), C=TH.geo({pw:HF.pw(),dockY:y}), x0=Math.max(C.x0,-W*.01), x1=HF.pw()-W*.006, rh=H*.036, N=c0=>mix(c0,'#0a1020',night*.55), n=6, xs=[...Array(n+1)].map((_,i)=>x0+(x1-x0)*i/n);
    q.fillStyle=N(mix('#6a4a32',c,.4)); for(const px of xs){ q.fillRect(px-2.5,y-rh,5,rh); q.fillStyle=N(HK.lt(mix('#6a4a32',c,.4),.15)); q.fillRect(px-3,y-rh-2,6,3); q.fillStyle=N(mix('#6a4a32',c,.4)); }
    if(s===0){ q.strokeStyle=N('#d8c08a'); q.lineWidth=Math.max(2.5,H*.005); q.beginPath(); for(let i=0;i<n;i++){ q.moveTo(xs[i],y-rh*.82); q.quadraticCurveTo((xs[i]+xs[i+1])/2,y-rh*.4,xs[i+1],y-rh*.82); } q.stroke(); q.strokeStyle=N('#a8905a'); q.lineWidth=1; q.stroke(); }
    else { q.fillStyle=N(mix('#b8b06a',c,.3)); q.fillRect(x0,y-rh*.86,x1-x0,Math.max(3,H*.005)); q.fillRect(x0,y-rh*.46,x1-x0,Math.max(3,H*.005)); q.fillStyle=N('#7a7a4a'); for(let X=x0;X<x1;X+=W*.03){ q.fillRect(X,y-rh*.86,1.2,Math.max(3,H*.005)); q.fillRect(X+W*.015,y-rh*.46,1.2,Math.max(3,H*.005)); } } },
  /* the big cherry tree over the house (front layer), as in the director's reference: a thick dark trunk at the left edge, limbs reaching out
     over the roof, and heavy clouds of blossom spilling over them, darker pink underneath and pale on top, a few sprays hanging lower */
  tree(night,cx){ const q=cx||g, C=TH.geo({pw:HF.pw(),dockY:HF.dockY()}), N=c0=>mix(c0,'#141a30',night*.5), x0=Math.max(HF.x0(),0)-W*.01, ty=C.roofTop-H*.04, r=v3rng(83), y=HF.dockY();
    q.fillStyle=N('#3a2622'); q.beginPath(); q.moveTo(x0-W*.006,y+H*.06); q.bezierCurveTo(x0+W*.03,C.wallTop,x0+W*.006,ty,x0+W*.028,ty-H*.12); q.lineTo(x0+W*.002,ty-H*.16); q.bezierCurveTo(x0-W*.004,ty,x0+W*.006,C.wallTop,x0-W*.03,y+H*.06); q.closePath(); q.fill(); q.strokeStyle=N('#5a3a2e'); q.lineWidth=1.2; q.beginPath(); q.moveTo(x0+W*.012,y); q.bezierCurveTo(x0+W*.02,C.wallTop,x0+W*.008,ty,x0+W*.02,ty-H*.12); q.stroke(); /* the trunk */
    const limbs=[[.02,-.13,.2,-.16,.008],[.02,-.12,.16,-.07,.007],[.015,-.14,.08,-.22,.006],[.03,-.06,.24,-.02,.005]]; q.strokeStyle=N('#3a2622'); q.lineCap='round'; for(const [ax,ay,bx,by,wd] of limbs){ q.lineWidth=H*wd*1.6; q.beginPath(); q.moveTo(x0+W*ax,ty+H*ay); q.quadraticCurveTo(x0+W*(ax+bx)*.5,ty+H*Math.min(ay,by)-H*.03,x0+W*bx,ty+H*by); q.stroke(); } q.lineCap='butt';
    const cl=[[.0,-.2,.07],[.07,-.22,.08],[.15,-.19,.075],[.22,-.12,.06],[.11,-.13,.06],[.04,-.1,.055],[.18,-.05,.05],[.25,-.03,.04]], tones=[['#d27a9e',1,.03],['#f2a6c2',.9,0],['#ffc8dc',.62,-.02],['#fff0f6',.32,-.035]];
    for(const [col,k,dy] of tones){ q.fillStyle=N(col); q.beginPath(); for(const [cx2,cy2,rr] of cl){ for(let i=0;i<26;i++){ const a=r()*6.283, d=Math.sqrt(r())*W*rr, px=x0+W*cx2+Math.cos(a)*d, py=ty+H*cy2+Math.sin(a)*d*.55+dy*H, s=W*rr*(.13+r()*.12)*k; q.moveTo(px+s,py); q.arc(px,py,s,0,7); } } q.fill(); }
    q.fillStyle=N('#f4a8c4'); for(let i=0;i<9;i++){ const sx=x0+W*(.06+i*.025), sy=ty-H*.02+(i%3)*H*.012; for(let k=0;k<5;k++){ q.beginPath(); q.arc(sx+(k%2)*W*.002,sy+k*H*.008,H*.004,0,7); q.fill(); } } /* sprays hanging lower */ },
  /* the ground: a mossy bank behind with a bamboo fence along a stone path, a stone lantern, azalea bushes, mossy rocks at the water */
  ground(o){ const x=o.x, y=o.dockY, wl=o.wl, x0=HF.x0(), N=c0=>HK.n(o,c0), lit=HK.lit(o), r=v3rng(61), xe=o.pw+W*.03, top=X=>Math.min(y-H*.13+(X-x0)/(xe-x0)*H*.1,y-H*.03); /* the bank stops at the deck: the tea house stands over the water */
    x.fillStyle=N('#4a6a3a'); x.beginPath(); x.moveTo(x0,y); for(let X=x0;X<=xe;X+=4) x.lineTo(X,top(X)); x.lineTo(xe,wl); x.quadraticCurveTo(xe-W*.02,wl,o.pw-W*.03,y); x.closePath(); x.fill(); x.fillStyle=N('#5a7a42'); x.beginPath(); x.moveTo(x0,y); for(let X=x0;X<=xe;X+=4) x.lineTo(X,top(X)+H*.012); x.lineTo(xe,wl); x.quadraticCurveTo(xe-W*.02,wl,o.pw-W*.025,y); x.closePath(); x.fill(); /* the bank's end slopes down into the water past the deck */
    const py=X=>top(X)+H*.02; x.strokeStyle=N('#a8a090'); x.lineWidth=H*.008; x.beginPath(); x.moveTo(x0,py(x0)); x.lineTo(xe,py(xe)); x.stroke(); for(let X=x0;X<xe;X+=W*.012) HK.ell(o,X,py(X),W*.005,H*.003,'#bab2a2'); /* the stone path */
    x.strokeStyle=N('#a89a5a'); x.lineWidth=Math.max(1.5,H*.0026); for(let X=x0;X<xe;X+=W*.004){ x.beginPath(); x.moveTo(X,py(X)-H*.004); x.lineTo(X,py(X)-H*.026); x.stroke(); } x.strokeStyle=N('#6a5a3a'); x.lineWidth=2; x.beginPath(); for(const h of [.008,.02]){ x.moveTo(x0,py(x0)-H*h); x.lineTo(xe,py(xe)-H*h); } x.stroke(); /* a bamboo fence along it */
    for(let i=0;i<6;i++){ const X=x0+(xe-x0)*(.1+i*.16), Y=top(X)+H*.024+r()*H*.004; x.fillStyle=N(i%2?'#d8487a':'#e86a98'); x.beginPath(); x.ellipse(X,Y,W*.012,H*.012,0,Math.PI,0); x.fill(); x.fillStyle=N('#4a6a3a'); x.beginPath(); x.ellipse(X,Y+H*.002,W*.012,H*.004,0,0,Math.PI); x.fill(); } /* azaleas in bloom */
    for(const [f,s] of [[.94,1],[1,1.3]]){ const X=x0+(xe-x0)*f; HK.ell(o,X,wl-H*.006,W*.012*s,H*.012*s,'#8a8a84'); HK.ell(o,X-W*.002,wl-H*.015*s,W*.008*s,H*.003,'#5a7a3a'); } /* mossy rocks where the bank meets the water */
    HK.rect(o,o.pw-W*.03,wl-1,xe-o.pw+W*.03,1.5,v3rgba('#e8f4f0',.3*lit+.05)); }
};
