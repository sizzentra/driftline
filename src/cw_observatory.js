// =====================================================================
// STARFALL LAKE: THE STAR OBSERVATORY (overnight, 2026-11-23; its own design, MAP_THEMES › Starfall: astrolabes, constellation maps, Art
// Nouveau celestial posters, floating islands). A small round observatory of moonstone on a floating island of rock that drifts above the
// starry water: a domed roof (a faceted crystal dome, a silver dome with its slit open, or a dome grown over with star-blossoms) with a
// gold finial, a moon-shaped door, a frieze of tiny constellations; under the deck the island tapers to a point with crystals hanging from
// it and glowing roots. Parts: walls, dome, door, telescope, star lantern, seat.
// =====================================================================
const SO = {
  geo(o){ const C=BH.cab(o,{h:1,ratio:1.4}), wh=C.wh, x0=Math.max(HF.x0(),0)+W*.008, w=Math.min(wh*1.5,o.pw*.4), x1=x0+w; return {x0,x1,vx:x0,w,wh,wallTop:C.wallTop,mid:(x0+x1)/2,dt:C.wallTop-w*.48}; },
  walls(o,g,kind,c){ const q=o.x, y=o.dockY; BH.walls(o,{x0:g.x0,x1:g.x1,vx:g.x0,wallTop:g.wallTop},['stone','plaster','glass'][kind],c);
    HK.rect(o,g.x0,g.wallTop,g.w,H*.012,HK.dk(c,.15)); q.fillStyle=HK.n(o,'#f0d080'); for(let k=0;k<7;k++){ const sx=g.x0+g.w*(k+.5)/7, sy=g.wallTop+H*.006+((k*3)%2)*H*.002; q.beginPath(); q.arc(sx,sy,1.4,0,7); q.fill(); if(k<6){ q.strokeStyle=v3rgba('#f0d080',.5); q.lineWidth=.6; q.beginPath(); q.moveTo(sx,sy); q.lineTo(g.x0+g.w*(k+1.5)/7,g.wallTop+H*.006+(((k+1)*3)%2)*H*.002); q.stroke(); } } /* a frieze of tiny constellations */
    for(const e of [g.x0,g.x1-W*.005]) HK.rect(o,e,g.wallTop,W*.005,y-g.wallTop,HK.lt(c,.15)); },
  /* the dome: faceted crystal, silver with its slit open and the telescope tube showing, or grown over with star-blossoms; a gold finial */
  dome(o,g,kind,c){ const q=o.x, lit=HK.lit(o), r=g.w*.5+W*.006, cx=g.mid, base=g.wallTop+H*.002;
    q.fillStyle=HK.n(o,kind===0?v3rgba(c,.85):c); q.beginPath(); q.ellipse(cx,base,r,base-g.dt,0,Math.PI,0); q.closePath(); q.fill(); q.save(); q.clip();
    if(kind===0){ q.strokeStyle=v3rgba('#ffffff',.45); q.lineWidth=1; q.beginPath(); for(let k=1;k<6;k++){ const a=Math.PI*k/6; q.moveTo(cx,g.dt); q.lineTo(cx-Math.cos(a)*r,base); } q.moveTo(cx-r,base-(base-g.dt)*.45); q.lineTo(cx+r,base-(base-g.dt)*.45); q.stroke(); q.fillStyle=v3rgba('#ffffff',.25*lit+.1); q.beginPath(); q.ellipse(cx-r*.35,g.dt+(base-g.dt)*.35,r*.15,(base-g.dt)*.25,-.5,0,7); q.fill(); } /* crystal facets and a shine */
    if(kind===1){ q.fillStyle=HK.n(o,'#1a1440'); q.fillRect(cx+r*.08,g.dt-2,r*.18,base-g.dt+2); q.strokeStyle=HK.n(o,HK.dk(c,.25)); q.lineWidth=1; q.beginPath(); for(let k=1;k<5;k++){ q.moveTo(cx-r+2*r*k/5,base); q.quadraticCurveTo(cx-r+2*r*k/5,g.dt+(base-g.dt)*.2,cx,g.dt); } q.stroke(); } /* silver ribs, the open slit */
    if(kind===2){ for(let k=0;k<26;k++){ const a=Math.PI+Math.PI*((k*.381)%1), rr=r*(.4+((k*.618)%1)*.6), px=cx+Math.cos(a)*rr, py=base+Math.sin(a)*(base-g.dt)*rr/r; q.fillStyle=HK.n(o,k%3?'#f8c8e8':'#fff8ff'); for(let p=0;p<5;p++){ q.beginPath(); q.arc(px+Math.cos(p*1.256)*H*.004,py+Math.sin(p*1.256)*H*.004,H*.0028,0,7); q.fill(); } q.fillStyle=HK.n(o,'#f0d080'); q.beginPath(); q.arc(px,py,H*.0016,0,7); q.fill(); } } /* star-blossoms over it */
    q.restore(); if(kind===1){ HK.line(o,[cx+r*.17,g.dt+(base-g.dt)*.3,cx+r*.62,g.dt-H*.02],'#c8c8d8',Math.max(3,H*.007)); } /* the telescope tube through the slit */
    HK.line(o,[cx,g.dt,cx,g.dt-H*.022],'#f0d080',2); q.fillStyle=HK.n(o,'#f0d080'); q.beginPath(); for(let p=0;p<10;p++){ const a=-Math.PI/2+p*Math.PI/5, rr=p%2?H*.003:H*.007; q.lineTo(cx+Math.cos(a)*rr,g.dt-H*.026+Math.sin(a)*rr); } q.closePath(); q.fill(); /* a gold star finial */
    HK.rect(o,g.x0-W*.004,base-H*.003,g.w+W*.008,H*.006,'#c8c8d8');
    o.top=Math.min(o.top==null?o.dockY-H*.23:o.top,g.dt-H*.05); o.low=Math.max(o.low==null?-1e9:o.low,base); },
  /* a moon-shaped door: an arched opening with a crescent window */
  door(o,g,s,c){ const q=o.x, y=o.dockY, dx=g.x0+W*.012, dw=W*.02, dh=(y-g.wallTop)*.72, top=y-dh; q.fillStyle=HK.n(o,s===2?'#1a1440':c); q.beginPath(); q.moveTo(dx,y); q.lineTo(dx,top+dw/2); q.arc(dx+dw/2,top+dw/2,dw/2,Math.PI,0); q.lineTo(dx+dw,y); q.closePath(); q.fill();
    if(s===0){ q.fillStyle=HK.n(o,'#f0d080'); q.beginPath(); q.arc(dx+dw/2,top+dw*.6,dw*.22,0,7); q.fill(); q.fillStyle=HK.n(o,c); q.beginPath(); q.arc(dx+dw/2+dw*.1,top+dw*.55,dw*.2,0,7); q.fill(); } /* a crescent window */
    if(s===1) for(let k=0;k<3;k++) HK.circ(o,dx+dw/2,top+dw*.6+k*dh*.25,1.5,'#f0d080'); /* studded with stars */
    if(s===2) for(let k=0;k<5;k++) HK.line(o,[dx+dw*(k+.5)/5,top+dw*.3,dx+dw*(k+.5)/5,y],v3rgba('#b88aff',.8),1); /* a curtain of crystal beads */ },
  /* the floating island under the deck: a rock cone tapering to a point, crystals hanging, glowing roots, star-blossoms along its rim */
  ground(o){ const y=o.dockY, q=o.x, N=c0=>HK.n(o,c0), x0=HF.x0(), xe=o.pw+W*.01, top=y+HK.fh(), tip=y+H*.2, mx=(x0+xe)/2+W*.01;
    q.fillStyle=N('#4a3a5a'); q.beginPath(); q.moveTo(x0-W*.01,top); q.lineTo(xe,top); q.quadraticCurveTo(xe-W*.01,top+H*.06,mx+W*.04,tip-H*.03); q.lineTo(mx,tip); q.lineTo(mx-W*.05,tip-H*.05); q.quadraticCurveTo(x0,top+H*.07,x0-W*.01,top+H*.02); q.closePath(); q.fill();
    q.fillStyle=N('#5a4a6e'); q.beginPath(); q.moveTo(x0-W*.01,top); q.lineTo(xe,top); q.quadraticCurveTo(xe-W*.02,top+H*.03,mx,top+H*.05); q.quadraticCurveTo(x0+W*.02,top+H*.04,x0-W*.01,top+H*.01); q.closePath(); q.fill(); /* the lit upper rock */
    for(const [f,l] of [[.25,.05],[.45,.08],[.62,.06],[.8,.04]]){ const cx=x0+(xe-x0)*f, cy=top+H*.04; HK.poly(o,[cx-W*.005,cy,cx,cy+H*l,cx+W*.005,cy],v3rgba(f>.5?'#7ae0ff':'#b88aff',.85)); HK.line(o,[cx-W*.002,cy,cx,cy+H*l*.8],v3rgba('#ffffff',.5),1); } /* crystals hanging */
    q.strokeStyle=v3rgba('#7ae0ff',.5); q.lineWidth=1; q.beginPath(); for(let k=0;k<5;k++){ const rx=mx-W*.04+k*W*.02; q.moveTo(rx,tip-H*.05+Math.abs(k-2)*H*.01); q.quadraticCurveTo(rx+W*.006,tip+H*.01,rx-W*.004,tip+H*.04); } q.stroke(); /* glowing roots trailing below */ }
};
