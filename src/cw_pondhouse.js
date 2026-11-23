// =====================================================================
// WILLOW POND: THE BOATHOUSE (overnight, 2026-11-23; director: "the Rockies is a reference for quality, not a layout to copy").
// Willow Pond's own building, not the Rockies box: a tall gable-end boathouse standing over the water, its boat bay open at the
// waterline with a canoe inside, a hay-loft style window in the gable, a cupola with a weathervane on the ridge, and a lower lean-to
// porch along its side that shades the angler. Parts: walls, roof, cupola, boat bay, windows, lantern, seat.
// =====================================================================
const PH = {
  /* the boathouse's geometry: the gable block at the screen's left (narrow on phones), the lean-to from it to the deck's end */
  geo(o){ const C=BH.cab(o,{h:1.1}), wh=C.wh, xa=Math.max(HF.x0(),0)-W*.006, gw=Math.min(wh*1.35,W*.085), xb=xa+gw, eave=o.dockY-wh*1.35, ridge=eave-gw*.62, lt=o.dockY-wh*1.08, lo=o.dockY-wh*.9;
    return {C,wh,xa,xb,gw,eave,ridge,lt,lo,x1:C.x1}; },
  /* fill a shape with a wall material by clipping a rectangle of it */
  mat(o,path,kind,c,x0,x1,top,bot){ const q=o.x; q.save(); path(); q.clip(); BH.walls(o,{x0,x1,wallTop:top,vx:x0},kind,c); q.restore(); },
  /* the lean-to: its back wall and roof, posts at its open front */
  leanTo(o,g,wallK,wc,roofK,rc){ const q=o.x, y=o.dockY, lit=HK.lit(o);
    PH.mat(o,()=>{ q.beginPath(); q.rect(g.xb,g.lt,g.x1-g.xb,y-g.lt); },wallK,wc,g.xb,g.x1,g.lt,y);
    const sh=q.createLinearGradient(0,g.lt,0,g.lt+H*.04); sh.addColorStop(0,'rgba(10,8,6,.4)'); sh.addColorStop(1,'rgba(10,8,6,0)'); q.fillStyle=sh; q.fillRect(g.xb,g.lt,g.x1-g.xb,H*.04); /* the roof's shadow on the back wall */
    for(const px of [g.xb+W*.006,(g.xb+g.x1)/2+W*.01,g.x1-W*.004]){ HK.rect(o,px-2.5,g.lo,5,y-g.lo,'#4a3426'); HK.rect(o,px-1.5,g.lo,1.2,y-g.lo,v3rgba('#d8b080',.4*lit+.1)); HK.rect(o,px-3.5,y-H*.004,7,H*.004,'#2e2016'); }
    const ov=W*.012, R0=g.x1+ov; q.fillStyle=HK.n(o,rc); q.beginPath(); q.moveTo(g.xb,g.lt-H*.012); q.lineTo(R0,g.lo-H*.012); q.lineTo(R0,g.lo); q.lineTo(g.xb,g.lt); q.closePath(); q.fill();
    q.strokeStyle=HK.n(o,HK.dk(rc,.3)); q.lineWidth=1; q.beginPath(); if(roofK==='tin'){ for(let X=g.xb+W*.006;X<R0;X+=W*.007){ const t=(X-g.xb)/(R0-g.xb), yt=g.lt-H*.012+(g.lo-g.lt)*t; q.moveTo(X,yt); q.lineTo(X,yt+H*.012); } } else { for(let X=g.xb+W*.005;X<R0;X+=W*.006){ const t=(X-g.xb)/(R0-g.xb), yt=g.lt-H*.012+(g.lo-g.lt)*t; q.moveTo(X,yt+H*.004); q.lineTo(X,yt+H*.012); } } q.stroke();
    HK.line(o,[g.xb,g.lt-H*.012,R0,g.lo-H*.012],v3rgba(o.P.rim||'#fff0d0',.35*lit),1); HK.rect(o,g.xb,g.lt-H*.012,W*.003,H*.016,HK.dk(rc,.4)); /* flashing against the gable block */
    o.low=Math.max(o.low==null?-1e9:o.low,g.lo-H*.012); },
  /* the gable block: walls down to the water, the gable end, the rakes of the roof, the boat bay */
  block(o,g,wallK,wc,roofK,rc,bay,bc){ const q=o.x, y=o.dockY, wl=o.wl, lit=HK.lit(o), mid=(g.xa+g.xb)/2;
    PH.mat(o,()=>{ q.beginPath(); q.moveTo(g.xa,wl); q.lineTo(g.xa,g.eave); q.lineTo(mid,g.ridge); q.lineTo(g.xb,g.eave); q.lineTo(g.xb,wl); q.closePath(); },wallK,wc,g.xa,g.xb,g.ridge,wl);
    HK.rect(o,g.xa,g.eave,g.xb-g.xa,H*.005,HK.dk(wc,.3)); HK.rect(o,g.xa,y-H*.004,g.xb-g.xa,H*.006,HK.dk(wc,.35)); /* a band at the eave and one at the deck's level */
    HK.rect(o,g.xb-W*.004,g.eave,W*.004,wl-g.eave,HK.lt(wc,.06)); HK.rect(o,g.xa,g.eave,W*.004,wl-g.eave,HK.lt(wc,.06)); /* corner boards */
    const ww=g.gw*.26, wy=g.eave+(g.ridge-g.eave)*.05; HK.rect(o,mid-ww/2-3,wy-ww*.9-3,ww+6,ww*.9+6,HK.dk(wc,.35)); HK.rect(o,mid-ww/2,wy-ww*.9,ww,ww*.9,'#2a3440'); HK.line(o,[mid,wy-ww*.9,mid,wy],HK.dk(wc,.35),1.2); HK.line(o,[mid-ww/2,wy-ww*.45,mid+ww/2,wy-ww*.45],HK.dk(wc,.35),1.2); o.lights.push({x:mid,y:wy-ww*.45,r:.08,a:.45,small:1,win:[ww,ww*.9]}); /* the loft window in the gable */
    /* the boat bay at the waterline: open with a canoe inside, two doors closed, or a sliding door half open */
    const bw=g.gw*.68, bx=mid-bw/2, bt=y+HK.fh()+H*.004, bh=wl-bt+H*.02;
    HK.rect(o,bx-4,bt-4,bw+8,4,HK.dk(bc,.3)); HK.rect(o,bx-4,bt-4,4,bh+4,HK.dk(bc,.3)); HK.rect(o,bx+bw,bt-4,4,bh+4,HK.dk(bc,.3));
    if(bay===0||bay===2){ const ig=q.createLinearGradient(0,bt,0,bt+bh); ig.addColorStop(0,HK.n(o,'#1a1410')); ig.addColorStop(1,HK.n(o,'#22323a')); q.fillStyle=ig; q.fillRect(bx,bt,bw,bh); /* the dark boathouse inside, water at the bottom */
      HK.rect(o,bx,wl-1,bw,1.5,v3rgba('#e8f4f0',.25*lit+.05)); const cx=mid, cy=wl-H*.003, L=bw*.42; q.fillStyle=HK.n(o,mix('#3a6a4a',bc,.15)); q.beginPath(); q.moveTo(cx-L,cy-H*.008); q.quadraticCurveTo(cx,cy+H*.01,cx+L,cy-H*.008); q.quadraticCurveTo(cx,cy-H*.002,cx-L,cy-H*.008); q.fill(); HK.rect(o,cx-L*.7,cy-H*.006,L*1.4,1.5,'#c8a070'); /* a canoe at its mooring */
      if(bay===2){ HK.rect(o,bx,bt,bw*.55,bh-H*.02,bc); for(let i=1;i<4;i++) HK.line(o,[bx+bw*.55*i/4,bt,bx+bw*.55*i/4,bt+bh-H*.02],HK.dk(bc,.3),.8); HK.rect(o,bx-2,bt-H*.008,bw+4,H*.004,'#3a3a40'); } } /* a sliding door on its rail */
    else { for(const [x0,w0] of [[bx,bw/2],[bx+bw/2,bw/2]]){ HK.rect(o,x0+.5,bt,w0-1,bh-H*.02,bc); for(let i=1;i<3;i++) HK.line(o,[x0+w0*i/3,bt,x0+w0*i/3,bt+bh-H*.02],HK.dk(bc,.3),.8); HK.line(o,[x0+1,bt+bh-H*.022,x0+w0-1,bt+1],HK.lt(bc,.1),Math.max(2,H*.003)); } }
    /* the roof seen end-on: two rakes with an overhang, the ridge */
    const ov=W*.008, rt=Math.max(4,H*.012); q.fillStyle=HK.n(o,rc); q.beginPath(); q.moveTo(g.xa-ov,g.eave+H*.006); q.lineTo(mid,g.ridge-rt); q.lineTo(g.xb+ov,g.eave+H*.006); q.lineTo(g.xb+ov-W*.003,g.eave+H*.006+rt*.7); q.lineTo(mid,g.ridge); q.lineTo(g.xa-ov+W*.003,g.eave+H*.006+rt*.7); q.closePath(); q.fill();
    q.strokeStyle=HK.n(o,HK.dk(rc,.35)); q.lineWidth=1; q.beginPath(); q.moveTo(g.xa-ov+W*.003,g.eave+H*.006+rt*.7); q.lineTo(mid,g.ridge); q.lineTo(g.xb+ov-W*.003,g.eave+H*.006+rt*.7); q.stroke(); HK.line(o,[g.xa-ov,g.eave+H*.006,mid,g.ridge-rt,g.xb+ov,g.eave+H*.006],v3rgba(o.P.rim||'#fff0d0',.4*lit),1); /* bargeboards */
    o.top=Math.min(o.top==null?y-H*.23:o.top,g.ridge-H*.06); },
  /* on the ridge: a cupola with a fish weathervane, a rooster weathervane on a post, or a little bell under a hood */
  cupola(o,g,s,c){ const mid=(g.xa+g.xb)/2, y0=g.ridge-H*.004, q=o.x;
    if(s===0){ const w=g.gw*.24, h=H*.03; HK.rect(o,mid-w/2,y0-h,w,h,c); HK.rect(o,mid-w*.32,y0-h*.85,w*.64,h*.5,'#2a3440'); for(let i=1;i<3;i++) HK.line(o,[mid-w*.32+w*.64*i/3,y0-h*.85,mid-w*.32+w*.64*i/3,y0-h*.35],HK.lt(c,.2),1); HK.poly(o,[mid-w*.65,y0-h,mid+w*.65,y0-h,mid,y0-h-w*.55],HK.dk(c,.35)); HK.line(o,[mid,y0-h-w*.55,mid,y0-h-w*.55-H*.022],'#2a2a2e',1.2); const vy=y0-h-w*.55-H*.018; q.fillStyle=HK.n(o,'#c8a050'); q.beginPath(); q.ellipse(mid,vy,W*.006,H*.0035,0,0,7); q.fill(); HK.poly(o,[mid+W*.006,vy,mid+W*.009,vy-H*.004,mid+W*.009,vy+H*.004],'#c8a050'); }
    if(s===1){ HK.line(o,[mid,y0,mid,y0-H*.04],'#2a2a2e',1.4); for(const [dx,lab] of [[-1,'W'],[1,'E']]) HK.line(o,[mid,y0-H*.028,mid+dx*W*.006,y0-H*.028],'#2a2a2e',1); const vy=y0-H*.04; HK.poly(o,[mid-W*.007,vy,mid+W*.004,vy,mid+W*.006,vy-H*.008,mid+W*.002,vy-H*.012,mid-W*.002,vy-H*.006],c); HK.poly(o,[mid-W*.007,vy,mid-W*.011,vy-H*.008,mid-W*.004,vy-H*.004],c); }
    if(s===2){ const w=g.gw*.2; HK.rect(o,mid-w/2,y0-H*.026,2,H*.026,c); HK.rect(o,mid+w/2-2,y0-H*.026,2,H*.026,c); HK.poly(o,[mid-w*.75,y0-H*.026,mid+w*.75,y0-H*.026,mid,y0-H*.042],HK.dk(c,.3)); q.fillStyle=HK.n(o,'#c8a050'); q.beginPath(); q.moveTo(mid-w*.25,y0-H*.006); q.quadraticCurveTo(mid,y0-H*.03,mid+w*.25,y0-H*.006); q.closePath(); q.fill(); } }
};
/* the ground around the boathouse, Willow Pond's own (director, 2026-11-23 night: "you're recycling the same ground around it"): a grassy
   slope off the left edge with a gravel path winding down to the deck, a split-rail fence along it, lupines and daisies in the grass, two
   pines and a young maple on the slope, and cattails and reeds standing in the shallows at its foot */
PH.ground = function(o){ const x=o.x, y=o.dockY, wl=o.wl, x0=HF.x0(), xe=o.pw+W*.03, N=c0=>HK.n(o,c0), lit=HK.lit(o), r=v3rng(37), top0=y-H*.22;
  const topY=X=>{ const u=clamp((X-x0)/(xe-x0),0,1); return wl-(wl-top0)*Math.pow(1-u,1.4)+H*.006*Math.sin(X*.03)*(1-u); };
  const shape=()=>{ x.beginPath(); x.moveTo(x0,wl+H*.004); for(let X=x0;X<=xe;X+=4) x.lineTo(X,Math.min(wl,topY(X))); x.lineTo(xe,wl+H*.004); x.closePath(); };
  const gg=x.createLinearGradient(0,top0,0,wl); gg.addColorStop(0,N('#6a9a52')); gg.addColorStop(1,N('#3e6a3a')); x.fillStyle=gg; shape(); x.fill(); x.save(); shape(); x.clip(); /* summer grass, sunlit at the top */
  const path=X=>topY(X)+(wl-topY(X))*.35+H*.01*Math.sin(X*.02); x.strokeStyle=N('#c8b48a'); x.lineCap='round'; x.lineWidth=H*.016; x.beginPath(); for(let X=x0;X<=o.pw;X+=6){ const Y=path(X); X===x0?x.moveTo(X,Y):x.lineTo(X,Y); } x.stroke(); x.strokeStyle=N('#a8946a'); x.lineWidth=H*.004; x.stroke(); x.fillStyle=N('#9a8a6a'); for(let i=0;i<40;i++){ const X=x0+(o.pw-x0)*r(); x.fillRect(X,path(X)+(r()-.5)*H*.012,1.5,1.5); } x.lineCap='butt'; /* the gravel path down to the deck */
  x.strokeStyle=N('#5a8a42'); x.lineWidth=1; x.beginPath(); for(let i=0;i<260;i++){ const X=x0+(xe-x0)*r(), Y=topY(X)+(wl-topY(X))*r(); x.moveTo(X,Y); x.lineTo(X+(r()-.5)*2,Y-H*(.003+r()*.006)); } x.stroke();
  for(let i=0;i<22;i++){ const X=x0+(xe-x0)*r(), Y=topY(X)+(wl-topY(X))*(.15+r()*.75); if(Math.abs(Y-path(X))<H*.012) continue; if(i%3===0){ x.strokeStyle=N('#4a7a3a'); x.beginPath(); x.moveTo(X,Y); x.lineTo(X,Y-H*.016); x.stroke(); for(let k=0;k<5;k++) HK.circ(o,X,Y-H*(.008+k*.0022),H*.0018,['#8a6ac8','#c87ab8','#6a7ad8'][i%3]); } else rkFlower(x,X,Y-H*.003,H*.0024,N(i%2?'#f4f0f0':'#f0d040'),N('#f0c040')); } x.restore(); /* lupines and daisies */
  { const fy=X=>path(X)-H*.004; x.strokeStyle=N('#8a6a4a'); x.lineWidth=Math.max(2,H*.003); const xs=[]; for(let X=x0+W*.01;X<o.pw-W*.03;X+=W*.03) xs.push(X); for(const X of xs){ x.beginPath(); x.moveTo(X,fy(X)); x.lineTo(X,fy(X)-H*.026); x.stroke(); } x.lineWidth=Math.max(1.5,H*.0024); x.beginPath(); for(let i=0;i+1<xs.length;i++){ for(const h of [.018,.009]){ x.moveTo(xs[i],fy(xs[i])-H*h); x.lineTo(xs[i+1],fy(xs[i+1])-H*h); } } x.stroke(); } /* the split-rail fence along the path */
  for(const [f,h,k] of [[.06,.17,0],[.2,.13,1]]){ const X=x0+(xe-x0)*f; rkSpruce(x,X,topY(X)+H*.004,H*h,N(k?'#456f5c':'#2c4a3e'),o.P.rim,.25*lit,30+k); }
  { const X=x0+(xe-x0)*.34, b=topY(X)+H*.004; x.fillStyle=N('#5a4030'); x.fillRect(X-1.5,b-H*.06,3,H*.06); x.fillStyle=N('#7aa04a'); for(let k=0;k<5;k++){ x.beginPath(); x.ellipse(X+(k-2)*H*.008,b-H*(.065+.008*Math.sin(k*1.7)),H*.014,H*.012,0,0,7); x.fill(); } } /* a young maple */
  for(let i=0;i<14;i++){ const X=o.pw-W*.02+i*W*.0035+(r()-.5)*W*.002, hh=H*(.03+r()*.025), sw=0; x.strokeStyle=N(i%3?'#4a6e34':'#5e7e3c'); x.lineWidth=Math.max(1.2,H*.0024); x.beginPath(); x.moveTo(X,wl+H*.002); x.quadraticCurveTo(X+sw,wl-hh*.5,X+(i%2?1:-1)*H*.002,wl-hh); x.stroke(); if(i%4===1){ x.fillStyle=N('#6a4028'); x.beginPath(); x.ellipse(X,wl-hh-H*.004,H*.0028,H*.008,0,0,7); x.fill(); } }
  x.strokeStyle=v3rgba('#e8f4f0',.3*lit+.05); x.lineWidth=1; x.beginPath(); x.ellipse(o.pw+W*.005,wl+H*.002,W*.03,H*.003,0,0,Math.PI); x.stroke(); }; /* cattails and reeds in the shallows, a ring where they stand in the water */
