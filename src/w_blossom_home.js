// =====================================================================
// CHERRY BLOSSOM LAKE: THE PAINTED TEA HOUSE AND CHAIR (director, 2026-11-24: homes are fixed, no customisation; ChatGPT paints, Claude places).
// The tea house and the chair are ChatGPT's paintings (art/blossom_home/), cut out in w_blossom_home_art.js. They replace the code-drawn
// tea house (cw_teahouse.js stays as the stand-in while the pictures load, or if the painted scenery is missing).
//  - Placed from the angler: the deck's surface sits on the game's standing line, the standing angler in front of the shoji door, the chair on
//    the open deck to the right; one scale for house, chair and angler (1 angler height = 248 px of the original painting).
//  - Lit like the painting's land: the multiply colours come from the painting's own day, dusk and night versions near the shore, faded in
//    over the light steps like the land (blFaded); the shoji panes glow warm after dusk, the lantern lights up.
//  - Its reflection is built here from the house itself (director, 2026-11-24: Claude does reflections, ChatGPT paints none).
// =====================================================================
const BLH_IMG=new Image(), BLH_GLOW=new Image(), BLH_CHAIR=new Image();
for(const [im,src] of [[BLH_IMG,BLH_ART],[BLH_GLOW,BLH_GLOWART],[BLH_CHAIR,BLH_CHAIRART]]){ im.onload=()=>{ im.ok=1; }; im.src=src; }
/* coordinates in the stored pictures (house 1100x601, chair 294x300): the deck's surface, the post bottoms (the waterline), where the angler
   stands and sits, the lantern, the window centres, the posts */
const BLH={deck:456, post:598, stand:730, sit:972, lantern:[851,271], lanternR:52, windows:[[199,307],[403,309],[650,322]], posts:[73,270,460,654,847,1048], postW:36,
  k:.3694 /* screen px per stored px at angler scale 1 */, chairK:.1062, chairSit:137, chairFoot:300, seatUnits:17};
const blHomeOk = () => BLH_IMG.ok&&BLH_GLOW.ok&&BLH_CHAIR.ok&&typeof BL_IMG!=='undefined'&&BL_IMG.ok;
const blHomeAt = () => { const sc=HF.sc(), k=BLH.k*sc; return {sc,k,x0:W*.12-BLH.stand*k}; };
/* how the painting's land changes from day to dusk and to night near the shore (per colour channel), measured once from its three versions */
function blLandRatio(){ if(blLandRatio.v) return blLandRatio.v; const c=document.createElement('canvas'); c.width=84; c.height=60; const x=c.getContext('2d',{willReadFrequently:true}), avg=oy=>{ x.clearRect(0,0,84,60); x.drawImage(BL_IMG,0,oy+500,700,345,0,0,84,60); const d=x.getImageData(0,0,84,60).data, s=[0,0,0]; let n=0; for(let i=0;i<d.length;i+=4) if(d[i+3]>200){ s[0]+=d[i]; s[1]+=d[i+1]; s[2]+=d[i+2]; n++; } return s.map(v=>v/Math.max(1,n)); };
  const day=avg(0), dusk=avg(845), night=avg(1690), r=a=>a.map((v,i)=>Math.min(1.1,v/Math.max(8,day[i])));
  return (blLandRatio.v={dusk:r(dusk),night:r(night)}); }
/* a painted piece in this light: the same steps as the land (shade toward the light, the dusk and night colours, dawn pink, weather grey) */
function blHomeBuild(x,P,img,glow){ const w=img.width, h=img.height, dawn=blDawn(), n=P.night, d=P.d*(dawn?.55:1), R=blLandRatio(), sF=blShade(P,'far');
  const m=[0,1,2].map(i=>((1-Math.min(1,d))*(n>.01||d>.01?sF[i]:1)+Math.min(1,d)*R.dusk[i])*(1-Math.min(1,n))+Math.min(1,n)*R.night[i]);
  x.drawImage(img,0,0); x.globalCompositeOperation='multiply'; x.fillStyle=blRgb(m.map(v=>Math.min(1,v)*(1-.28*P.gloom))); x.fillRect(0,0,w,h);
  if(dawn&&P.d>.02){ x.globalCompositeOperation='soft-light'; x.fillStyle='rgba(255,176,206,'+(.45*P.d)+')'; x.fillRect(0,0,w,h); }
  x.globalCompositeOperation='destination-in'; x.drawImage(img,0,0); x.globalCompositeOperation='source-over';
  const gl=clamp((n-.2)/.5,0,1); if(glow&&gl>0){ x.globalAlpha=gl*.95; x.drawImage(glow,0,0); x.globalAlpha=1; } }
/* the reflection: the lit house mirrored at its posts' waterline, in rippling strips, fading with depth and fainter at night */
function blHomeRefl(C,x0,wl,k,t,n){ const ht=Math.min(H-wl,(BLH.post-200)*k), st=Math.max(3,Math.round(H/150)), calm=blCalm(); if(ht<=0) return; g.save();
  for(let yy=0;yy<ht;yy+=st){ const a=.55*Math.pow(1-yy/ht,1.1)*(1-n*.3); if(a<.01) break; const off=calm?0:Math.sin(t*1.3+yy*.13)*(.5+yy/ht*2.6)*BL_MOTION.ripple, sy=BLH.post-(yy+st)/k;
    if(sy<0) break; g.globalAlpha=a; g.drawImage(C,0,sy,C.width,st/k,x0+off,wl+yy,C.width*k,st); }
  g.restore(); }
/* where the posts meet the water: a faint bright contact line and a small ripple drifting downstream */
function blHomeRings(x0,wl,k,t,n){ const a0=.3-n*.12; g.lineWidth=1; for(let i=0;i<BLH.posts.length;i++){ const px=x0+BLH.posts[i]*k, w=BLH.postW*k*.7;
  g.strokeStyle=v3rgba('#ffffff',a0); g.beginPath(); g.moveTo(px-w,wl+.5); g.lineTo(px+w,wl+.5); g.stroke();
  const q=((t*.35+i*.37)%1); g.strokeStyle=v3rgba('#ffffff',a0*(1-q)*.8); g.beginPath(); g.moveTo(px+w+q*w*3,wl+2+q*2); g.lineTo(px+w*2+q*w*4,wl+2+q*2); g.stroke(); } }
/* the whole painted home, drawn where the code home would be (before the angler); false while the pictures load */
function blHomeDraw(t,night,dockY,P){ if(!blHomeOk()||!P) return false; const {sc,k,x0}=blHomeAt(), y0=dockY-BLH.deck*k, wl=y0+BLH.post*k-1;
  const C=blFaded('blh',P,BLH_IMG.width,BLH_IMG.height,(x,p)=>blHomeBuild(x,p,BLH_IMG,BLH_GLOW)), CH=blFaded('blhc',P,BLH_CHAIR.width,BLH_CHAIR.height,(x,p)=>blHomeBuild(x,p,BLH_CHAIR,null));
  blHomeRefl(C,x0,wl,k,t,P.night); blHomeRings(x0,wl,k,t,P.night);
  g.drawImage(C,x0,y0,C.width*k,C.height*k);
  const ck=BLH.chairK*sc, cx=HF.seatX()+3*sc-BLH.chairSit*ck; g.drawImage(CH,cx,dockY-BLH.chairFoot*ck,CH.width*ck,CH.height*ck);
  const gl=clamp((P.night-.2)/.5,0,1)*(1-P.gloom*.3); if(gl>.02){ const fl=.9+Math.sin(t*2.3)*.06+Math.sin(t*5.1)*.03, [lx,ly]=BLH.lantern, X=x0+lx*k, Y=y0+ly*k;
    g.save(); g.globalCompositeOperation='screen'; const lg=g.createRadialGradient(X,Y,0,X,Y,BLH.lanternR*k); lg.addColorStop(0,'rgba(255,214,150,'+(.85*gl*fl)+')'); lg.addColorStop(.7,'rgba(255,170,90,'+(.45*gl*fl)+')'); lg.addColorStop(1,'rgba(255,150,80,0)');
    g.fillStyle=lg; g.beginPath(); g.ellipse(X,Y,BLH.lanternR*k*.82,BLH.lanternR*k,0,0,7); g.fill(); g.restore(); /* the paper itself lit from inside */
    v3glow(g,X,Y,H*.1,'rgba(255,200,150,.85)',gl*.9*fl); v3lightPool(X-W*.01,dockY-1,W*.075,'255,200,150',.28*gl); v3lanternReflect(X,wl,gl,t,'255,200,150');
    for(const [wx,wy] of BLH.windows) v3glow(g,x0+wx*k,y0+wy*k,H*.05,'rgba(255,196,130,.8)',gl*.3); }
  return true; }
/* the tea house's seat is the painted chair: the angler sits at its seat height, on the open deck */
HOMEF.blossom.seatX=()=>{ if(!blHomeOk()) return HF.pw()-W*.028; const {k,x0,sc}=blHomeAt(); return x0+BLH.sit*k-3*sc; };
HOMEF.blossom.seatH=HOMEF.blossom.seatH.map(()=>BLH.seatUnits);
HOMEF.blossom.draw=blHomeDraw;
{ const fr=HOMEF.blossom.front; HOMEF.blossom.front=(n,cx)=>{ if(!blHomeOk()) fr(n,cx); }; } /* the painted deck has no rail in front of the angler */
