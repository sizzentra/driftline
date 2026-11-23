// =====================================================================
// EMBER SPRINGS: THE BASALT BATHHOUSE (overnight, 2026-11-23; its own design, MAP_THEMES › Ember Springs: Iceland's basalt and geothermal
// baths, onsen stone, forge ironwork). A low bathhouse of dark basalt standing on a bed of hexagonal basalt columns rising out of the hot
// water, seen from the side: a curved barrel-vault roof of corrugated iron (or copper, or slate), round windows that glow orange, a vent pipe
// letting off steam, a heavy door; beside it the steaming pool. Parts: walls, roof (vault), door, hot pool, lantern, seat.
// =====================================================================
const EB = {
  geo(o){ const C=BH.cab(o,{h:.95,ratio:2}), wh=C.wh, x0=Math.max(HF.x0(),0)+W*.006, w=Math.min(wh*2.2,o.pw*.5), x1=x0+w; return {x0,x1,vx:x0,w,wh,wallTop:C.wallTop,vt:C.wallTop-w*.36,mid:(x0+x1)/2}; },
  walls(o,g,kind,c){ BH.walls(o,{x0:g.x0,x1:g.x1,vx:g.x0,wallTop:g.wallTop},['stone','plaster','batten'][kind],c); HK.rect(o,g.x0,g.wallTop,g.w,H*.006,'#3a3436'); for(const e of [g.x0,g.x1-W*.005]) HK.rect(o,e,g.wallTop,W*.005,o.dockY-g.wallTop,'#2a2024');
    for(let k=0;k<2;k++){ const cx=g.x0+g.w*(.5+k*.25), cy=g.wallTop+(o.dockY-g.wallTop)*.4, r=H*.016; HK.circ(o,cx,cy,r+2,'#5a4a44'); HK.circ(o,cx,cy,r,'#2a1a18'); o.lights.push({x:cx,y:cy,r:.08,a:.5,small:1}); } /* round windows in iron rims, glowing at night */ },
  /* the barrel vault: a half-round roof seen end-on along the long side, ribbed corrugations, an iron eave band */
  roof(o,g,kind,c){ const q=o.x, lit=HK.lit(o), ov=W*.012, L=g.x0-ov, R=g.x1+ov, eb=g.wallTop+H*.004, col=kind===1?mix('#b8683a',c,.5):c;
    q.fillStyle=HK.n(o,col); q.beginPath(); q.moveTo(L,eb); q.bezierCurveTo(L,g.vt-H*.01,R,g.vt-H*.01,R,eb); q.closePath(); q.fill(); q.save(); q.clip();
    q.strokeStyle=HK.n(o,HK.dk(col,.3)); q.lineWidth=1; q.beginPath(); if(kind===2){ for(let Y=g.vt;Y<eb;Y+=H*.006){ q.moveTo(L,Y); q.lineTo(R,Y); } } else for(let X=L;X<R;X+=W*.004){ q.moveTo(X,g.vt-H*.02); q.lineTo(X,eb); } q.stroke();
    if(kind===1){ q.fillStyle=v3rgba('#5ab8a0',.25); q.fillRect(L,g.vt,R-L,(eb-g.vt)*.4); } q.restore(); /* copper with a verdigris bloom on top */
    q.strokeStyle=v3rgba(o.P.rim||'#ffd0a0',.4*lit); q.lineWidth=1.5; q.beginPath(); q.moveTo(L,eb); q.bezierCurveTo(L,g.vt-H*.01,(L+R)/2,g.vt-H*.012,(L+R)/2,g.vt+H*.004); q.stroke(); HK.rect(o,L,eb-H*.004,R-L,H*.006,'#2a2024');
    const px=g.x1-g.w*.25, pt=g.vt-H*.03; HK.rect(o,px-W*.003,pt,W*.006,(g.vt+eb)/2-pt,'#5a4a44'); HK.rect(o,px-W*.0045,pt-H*.004,W*.009,H*.004,'#3a3436'); /* the steam vent */
    o.top=Math.min(o.top==null?o.dockY-H*.23:o.top,pt-H*.08); o.low=Math.max(o.low==null?-1e9:o.low,eb); },
  ventTop(g){ return [g.x1-g.w*.25,g.vt-H*.034]; },
  /* the steaming pool beside the bathhouse: a stone bath, a cedar tub or a lava-rock ring, its water turquoise */
  pool(o,g,s,c){ const x=g.x1+W*.012, y=o.dockY, w=W*.05, q=o.x;
    if(s===0){ HK.block(o,x,y-H*.024,w,H*.024,'#4a3a3a'); for(let k=0;k<4;k++) HK.rect(o,x+k*w/4,y-H*.024,1,H*.024,'#2a2024'); }
    if(s===1){ HK.poly(o,[x,y-H*.026,x+w,y-H*.026,x+w-W*.003,y,x+W*.003,y],'#9a6a42'); for(const yy of [y-H*.02,y-H*.008]) HK.rect(o,x+W*.001,yy,w-W*.002,H*.003,'#3a3436'); }
    if(s===2) for(let k=0;k<6;k++) HK.ell(o,x+w*(k+.5)/6,y-H*.01-(k%2)*H*.004,w/10,H*.012,k%2?'#2a2024':'#4a3a3a');
    HK.ell(o,x+w/2,y-H*.024,w*.42,H*.004,s===2?'#ffc04a':c); for(let i=0;i<4;i++) HK.circ(o,x+w*(.2+i*.2),y-H*.04-(i%2)*H*.012,H*.008,v3rgba('#f0e8e4',.2)); },
  /* under it: hexagonal basalt columns rising from the hot water, stepped tops, a mineral crust at the waterline */
  ground(o){ const y=o.dockY, wl=o.wl, q=o.x, N=c0=>HK.n(o,c0), x0=HF.x0(), xe=o.pw+W*.02, cw=W*.014, r=v3rng(29);
    for(let X=x0,i=0;X<xe;X+=cw,i++){ const top=y+HK.fh()-(i%3)*H*.004; q.fillStyle=N(i%2?'#3a2e30':'#2a2024'); q.fillRect(X,top,cw-1,H-top); q.fillStyle=N('#4a3a3a'); q.fillRect(X,top,cw-1,H*.004); q.fillStyle=v3rgba('#000000',.25); q.fillRect(X+cw*.6,top,cw*.3,H-top); } /* the columns */
    q.fillStyle=N('#c8b890'); for(let X=x0;X<xe;X+=W*.006) q.fillRect(X,wl-H*.004+r()*H*.003,W*.004,H*.003); /* mineral crust */
    q.fillStyle=v3rgba(o.P.wMid||'#8a5a5a',.55); q.fillRect(x0,wl,xe-x0+W*.03,H-wl); /* the columns below the waterline seen through the water */
    for(let k=0;k<3;k++){ const sx=xe-W*.01+k*W*.006; q.fillStyle=N('#2a2024'); q.fillRect(sx,y+HK.fh()+k*H*.02,W*.006,H-y); } /* columns stepping down past the deck's end */ }
};
