// =====================================================================
// AMAZON RAINFOREST: THE PALAFITO (overnight, 2026-11-23; its own design, MAP_THEMES › Amazon: river stilt villages, palafitos).
// A stilt house high above the river on lashed hardwood poles, seen from the side: a very steep, tall A-frame roof of palm thatch whose
// eaves hang low over half-height walls, an open gap under the eave for air, a loft vent at the peak; the stilts tied with vine at their
// cross-braces, a notched log ladder down to the water, giant Victoria lily pads with upturned rims around the poles, and the buttress roots
// of a huge rainforest tree on the left. Parts: walls, roof, door, river gear, lamp, seat.
// =====================================================================
const AP = {
  geo(o){ const C=BH.cab(o,{h:.8,ratio:1.6}), wh=C.wh, x0=Math.max(HF.x0(),0)+W*.012, w=Math.min(wh*2.2,o.pw*.46), x1=x0+w; return {x0,x1,vx:x0,w,wh,wallTop:C.wallTop,peak:C.wallTop-w*.75,mid:(x0+x1)/2}; },
  walls(o,g,kind,c){ const gap=H*.012; BH.walls(o,{x0:g.x0,x1:g.x1,vx:g.x0,wallTop:g.wallTop+gap},kind,c); HK.rect(o,g.x0,g.wallTop,g.w,gap,'#1a140e'); for(let k=0;k<=4;k++) HK.rect(o,g.x0+g.w*k/4-W*.002,g.wallTop,W*.004,o.dockY-g.wallTop,'#4a3420'); /* the air gap under the eave, posts */ },
  /* the steep A-frame thatch: thick, ragged eaves hanging low, rows of palm, a ridge cap and a vent at the peak */
  roof(o,g,kind,c){ const q=o.x, lit=HK.lit(o), ov=W*.022, eb=g.wallTop+H*.026, L=g.x0-ov, R=g.x1+ov, col=kind===2?'#3a8a3a':c;
    q.fillStyle=HK.n(o,col); q.beginPath(); q.moveTo(L,eb); q.lineTo(g.mid,g.peak); q.lineTo(R,eb); q.closePath(); q.fill(); q.save(); q.clip();
    if(kind===2){ for(let k=0;k<9;k++){ const yy=g.peak+(eb-g.peak)*(k+.5)/9, hw=(R-L)/2*((yy-g.peak)/(eb-g.peak)); for(let X=g.mid-hw;X<g.mid+hw;X+=W*.016){ q.fillStyle=HK.n(o,(k+Math.round(X))%2?'#2e6a32':'#4a9a3a'); q.beginPath(); q.ellipse(X,yy,W*.012,H*.012,(X<g.mid?-.5:.5),0,7); q.fill(); } } } /* layered giant leaves */
    else { for(let k=0;k<10;k++){ const yy=g.peak+(eb-g.peak)*(k+1)/10; q.fillStyle=HK.n(o,k%2?HK.dk(col,.14):HK.lt(col,.06)); q.fillRect(L,yy-H*.005,R-L,H*.005); } q.strokeStyle=HK.n(o,HK.dk(col,.3)); q.lineWidth=1; q.beginPath(); for(let X=L;X<R;X+=W*.004){ q.moveTo(g.mid+(X-g.mid)*.05,g.peak); q.lineTo(X,eb); } q.stroke(); } q.restore(); /* palm rows and straw */
    q.fillStyle=HK.n(o,HK.dk(col,.1)); q.beginPath(); q.moveTo(L-W*.004,eb-H*.008); for(let X=L-W*.004;X<=R+W*.004;X+=W*.004) q.lineTo(X,eb+H*(.004+.008*Math.abs(Math.sin(X*.53)))); q.lineTo(R+W*.004,eb-H*.008); q.closePath(); q.fill(); /* ragged eave */
    HK.poly(o,[g.mid-W*.008,g.peak+H*.03,g.mid,g.peak+H*.012,g.mid+W*.008,g.peak+H*.03],'#1a140e'); HK.line(o,[g.mid-W*.012,g.peak+H*.016,g.mid,g.peak-H*.004,g.mid+W*.012,g.peak+H*.016],HK.dk(col,.3),3); /* loft vent and ridge cap */
    HK.line(o,[L,eb,g.mid,g.peak],v3rgba(o.P.rim||'#fff0d0',.35*lit),1.2);
    o.top=Math.min(o.top==null?o.dockY-H*.23:o.top,g.peak-H*.03); o.low=Math.max(o.low==null?-1e9:o.low,eb+H*.01); },
  /* below and around: tall lashed stilts with cross braces, a notched log ladder, giant lily pads, a dugout tied up, buttress roots on the left */
  ground(o){ const y=o.dockY, wl=o.wl, q=o.x, N=c0=>HK.n(o,c0), x0=HF.x0(), under=y+HK.fh(), n=5, xs=[...Array(n+1)].map((_,i)=>x0+(o.pw-x0)*(.04+.92*i/n)), pw=Math.max(5,W*.008);
    const tx=Math.max(x0,0)-W*.02; q.fillStyle=N('#5a4630'); q.beginPath(); q.moveTo(tx-W*.02,wl+H*.02); q.quadraticCurveTo(tx+W*.03,wl-H*.004,tx+W*.05,wl+H*.012); q.quadraticCurveTo(tx+W*.03,y-H*.02,tx+W*.02,y-H*.25); q.lineTo(tx-W*.02,y-H*.25); q.closePath(); q.fill(); q.strokeStyle=N('#3a2a1c'); q.lineWidth=1.5; q.beginPath(); for(let k=0;k<4;k++){ q.moveTo(tx+W*.004*k,y-H*.22); q.quadraticCurveTo(tx+W*.012+k*W*.006,y,tx+W*(.02+k*.008),wl+H*.01); } q.stroke(); q.fillStyle=N('#4a7a2a'); for(let k=0;k<6;k++){ q.beginPath(); q.ellipse(tx+W*(.006+k*.006),y-H*(.05+k*.03),W*.006,H*.004,.6,0,7); q.fill(); } /* buttress roots of a giant tree with moss */
    for(let i=0;i<n;i++){ q.strokeStyle=N('#4a3420'); q.lineWidth=Math.max(2,H*.004); q.beginPath(); q.moveTo(xs[i],under+H*.01); q.lineTo(xs[i+1],wl-H*.01); q.stroke(); const mx=(xs[i]+xs[i+1])/2, my=(under+wl)/2; HK.rect(o,mx-2,my-2,4,4,'#5a6a2a'); }
    for(const px of xs){ q.fillStyle=N('#6a4a30'); q.fillRect(px-pw/2,under,pw,H-under); q.fillStyle=v3rgba('#000000',.25); q.fillRect(px+pw*.2,under,pw*.3,H-under); for(const ly of [under+H*.006,wl-H*.012]){ q.fillStyle=N('#5a6a2a'); q.fillRect(px-pw*.65,ly,pw*1.3,H*.005); } q.fillStyle=N('#3a5a2a'); q.fillRect(px-pw/2,wl-H*.004,pw,H*.006); } /* stilts lashed with vine, a green tide mark */
    const lx=o.pw-W*.008; q.fillStyle=N('#7a5a3e'); q.save(); q.translate(lx,y); q.rotate(.12); q.fillRect(-W*.004,0,W*.008,wl-y+H*.02); q.fillStyle=N('#3a2a1c'); for(let yy=H*.012;yy<wl-y;yy+=H*.016) q.fillRect(-W*.004,yy,W*.008,H*.004); q.restore(); /* a notched log ladder */
    for(const [f,s] of [[.2,1],[.55,.8],[1.12,1.1]]){ const cx=x0+(o.pw-x0)*f, cy=wl+H*.012*s; q.fillStyle=N('#3a7a2a'); q.beginPath(); q.ellipse(cx,cy,W*.03*s,H*.008*s,0,0,7); q.fill(); q.strokeStyle=N('#a8402a'); q.lineWidth=Math.max(2,H*.004*s); q.beginPath(); q.ellipse(cx,cy-H*.002,W*.03*s,H*.008*s,0,Math.PI,0); q.stroke(); } /* giant Victoria lily pads with their red upturned rims */ }
};
