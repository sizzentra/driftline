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
  walls(o,g,kind,c,postC){ BH.walls(o,g,['shoji','plaster','bamboo'][kind],c); if(kind===0){ const q=o.x, wg=q.createLinearGradient(0,g.wallTop,0,o.dockY); wg.addColorStop(0,v3rgba('#ffcf7a',.45)); wg.addColorStop(1,v3rgba('#ffb85a',.3)); q.fillStyle=wg; q.fillRect(g.x0,g.wallTop,g.x1-g.x0,o.dockY-g.wallTop); } /* shoji lit warm from inside, by day too (the director's picture) */ const n=Math.max(3,Math.round((g.x1-g.x0)/(W*.04))); for(let i=0;i<=n;i++){ const px=g.x0+(g.x1-g.x0)*i/n; HK.rect(o,px-W*.002,g.wallTop,W*.004,o.dockY-g.wallTop,postC); } HK.rect(o,g.x0,o.dockY-H*.008,g.x1-g.x0,H*.008,postC); },
  /* paper lanterns hung under the eaves, a row of small ones, or a stone lantern on the deck */
  lanterns(o,g,s,c){ const q=o.x, y=g.wallTop+H*.012;
    if(s===0||s===1){ const xs=s===0?[g.vx+W*.03,g.x1-W*.012]:[...Array(7)].map((_,i)=>Math.max(g.x0,0)+(g.x1-Math.max(g.x0,0))*(i+.5)/7), r=s===0?1.25:.6; let L=null; for(const lx of xs){ const cy=y+H*.02*r, rx=W*.0075*r, ry=H*.019*r;
        if(s===0){ HK.line(o,[lx-W*.012,g.wallTop+H*.002,lx,g.wallTop+H*.002],'#2a2024',2); } HK.line(o,[lx,g.wallTop+H*.002,lx,cy-ry],'#2a2024',1.2); /* hung from an iron bracket under the eave */
        const lg=q.createRadialGradient(lx,cy,0,lx,cy,ry*1.1); lg.addColorStop(0,'#fff2c8'); lg.addColorStop(.55,HK.lt(c,.25)); lg.addColorStop(1,HK.dk(c,.25)); q.fillStyle=lg; q.beginPath(); q.ellipse(lx,cy,rx,ry,0,0,7); q.fill(); /* a chochin: paper glowing warm from its candle, by day too */
        for(let k=-3;k<=3;k++){ const yy=cy+k*ry*.27, hw=rx*Math.sqrt(Math.max(0,1-(k*.27)**2)); HK.line(o,[lx-hw,yy,lx+hw,yy],v3rgba(HK.dk(c,.45),.55),.8); } /* its bamboo ribs */
        HK.rect(o,lx-rx*.55,cy-ry-H*.004*r,rx*1.1,H*.005*r,'#1e1618'); HK.rect(o,lx-rx*.55,cy+ry-H*.001,rx*1.1,H*.005*r,'#1e1618'); HK.line(o,[lx,cy+ry+H*.004*r,lx,cy+ry+H*.012*r],'#c8a040',1.2); /* black caps, a gold tassel */
        L={x:lx,y:cy,r:.16*r,a:.85}; } return L; }
    return BH.lantern(o,g,'stone',c); },
  /* the rope railing along the veranda's front (front layer, in front of the angler): posts with thick rope swags, a bamboo rail, or none */
  rail(night,cx,s,c){ if(s===2) return; const q=cx||g, y=HF.dockY(), C=TH.geo({pw:HF.pw(),dockY:y}), x0=Math.max(C.x0,-W*.01), x1=HF.pw()-W*.006, rh=H*.036, N=c0=>mix(c0,'#0a1020',night*.55), n=6, xs=[...Array(n+1)].map((_,i)=>x0+(x1-x0)*i/n);
    q.fillStyle=N(mix('#6a4a32',c,.4)); for(const px of xs){ q.fillRect(px-2.5,y-rh,5,rh); q.fillStyle=N(HK.lt(mix('#6a4a32',c,.4),.15)); q.fillRect(px-3,y-rh-2,6,3); q.fillStyle=N(mix('#6a4a32',c,.4)); }
    if(s===0){ q.strokeStyle=N('#d8c08a'); q.lineWidth=Math.max(2.5,H*.005); q.beginPath(); for(let i=0;i<n;i++){ q.moveTo(xs[i],y-rh*.82); q.quadraticCurveTo((xs[i]+xs[i+1])/2,y-rh*.4,xs[i+1],y-rh*.82); } q.stroke(); q.strokeStyle=N('#a8905a'); q.lineWidth=1; q.stroke(); }
    else { q.fillStyle=N(mix('#b8b06a',c,.3)); q.fillRect(x0,y-rh*.86,x1-x0,Math.max(3,H*.005)); q.fillRect(x0,y-rh*.46,x1-x0,Math.max(3,H*.005)); q.fillStyle=N('#7a7a4a'); for(let X=x0;X<x1;X+=W*.03){ q.fillRect(X,y-rh*.86,1.2,Math.max(3,H*.005)); q.fillRect(X+W*.015,y-rh*.46,1.2,Math.max(3,H*.005)); } } },
  /* the big cherry tree over the house (front layer), redrawn to the director's picture: a thick dark trunk at the left edge, limbs reaching
     far out over the roof and the water, and the blossom painted as thousands of small petals in four pinks (dark underneath, pale on top)
     with sprays hanging down; drawn once into a stored picture per size and light level, then just copied each frame */
  tree(night,cx){ const q=cx||g, y=HF.dockY(), C=TH.geo({pw:HF.pw(),dockY:y}), d=(typeof cv!=='undefined'&&cv&&W>0)?cv.width/W:1, nk=Math.round(night*12), key=[W,H,d,nk,HF.x0(),y].join('|'), ox=Math.max(HF.x0(),0)-W*.03, oy=0, ow=W*.42, oh=y+H*.08;
    let c=TH._tree; if(!c||c.key!==key){ c=TH._tree=c||{cv:document.createElement('canvas')}; c.key=key; c.cv.width=Math.ceil(ow*d); c.cv.height=Math.ceil(oh*d); const x=c.cv.getContext('2d'); x.setTransform(d,0,0,d,-ox*d,-oy*d); x.clearRect(ox,oy,ow,oh); TH.paintTree(x,night,C,y); }
    q.drawImage(c.cv,ox,oy,ow,oh); },
  paintTree(q,night,C,y){ const N=c0=>mix(c0,'#141a30',night*.5), x0=Math.max(HF.x0(),0)-W*.01, ty=C.roofTop-H*.05, r=v3rng(83);
    q.fillStyle=N('#3a2622'); q.beginPath(); q.moveTo(x0-W*.008,y+H*.07); q.bezierCurveTo(x0+W*.034,C.wallTop,x0+W*.004,ty,x0+W*.03,ty-H*.14); q.lineTo(x0,ty-H*.19); q.bezierCurveTo(x0-W*.008,ty,x0+W*.004,C.wallTop,x0-W*.036,y+H*.07); q.closePath(); q.fill(); q.strokeStyle=N('#5a3a2e'); q.lineWidth=1.2; q.beginPath(); q.moveTo(x0+W*.014,y); q.bezierCurveTo(x0+W*.022,C.wallTop,x0+W*.008,ty,x0+W*.022,ty-H*.13); q.stroke(); /* the trunk */
    const limbs=[[.02,-.15,.24,-.2,.009],[.02,-.13,.3,-.1,.008],[.015,-.16,.12,-.3,.007],[.03,-.08,.34,-.02,.006],[.18,-.17,.36,-.14,.004]]; q.strokeStyle=N('#3a2622'); q.lineCap='round'; for(const [ax,ay,bx,by,wd] of limbs){ q.lineWidth=H*wd*1.6; q.beginPath(); q.moveTo(x0+W*ax,ty+H*ay); q.quadraticCurveTo(x0+W*(ax+bx)*.5,ty+H*Math.min(ay,by)-H*.04,x0+W*bx,ty+H*by); q.stroke(); } q.lineCap='butt';
    const cl=[[.0,-.26,.07],[.07,-.3,.08],[.15,-.27,.08],[.23,-.22,.07],[.3,-.15,.06],[.11,-.17,.07],[.04,-.13,.06],[.2,-.1,.055],[.28,-.05,.05],[.35,-.06,.035],[.33,-.18,.04]];
    for(const [col,k,dy,n] of [['#c2668e',1,.02,70],['#e890b4',.9,.006,80],['#f6b4cc',.75,-.008,70],['#ffd6e6',.6,-.018,50],['#fff2f8',.4,-.026,26]]){ q.fillStyle=N(col); q.beginPath(); for(const [cx2,cy2,rr] of cl){ for(let i=0;i<n;i++){ const a=r()*6.283, dd=Math.sqrt(r())*W*rr, px=x0+W*cx2+Math.cos(a)*dd, py=ty+H*cy2+Math.sin(a)*dd*.5+dy*H, s=H*(.0035+r()*.004)*k*1.6; q.moveTo(px+s,py); q.arc(px,py,s,0,7); } } q.fill(); } /* thousands of petals, dark to pale */
    for(let i=0;i<10;i++){ const sx=x0+W*(.06+i*.03), sy=ty-H*.04+(i%4)*H*.02; for(let k=0;k<9;k++){ q.fillStyle=N(k%2?'#f6b4cc':'#e890b4'); q.beginPath(); q.arc(sx+(r()-.5)*W*.012,sy+k*H*.006+(r()-.5)*H*.006,H*(.0035+r()*.002),0,7); q.fill(); } } /* sprays hanging lower */ },
};
