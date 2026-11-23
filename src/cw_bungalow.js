// =====================================================================
// CORAL SHALLOWS: THE OVERWATER BUNGALOW (overnight, 2026-11-23; its own design, MAP_THEMES › Coral: Maldives and Pacific overwater huts).
// A small hut raised high on palm stilts over the shallows, seen from the side: a tall, steep thatched hip roof with a thick shaggy fringe
// and a little gablet vent at the top, woven walls, a ladder down into the water; around it the sandbar showing through the clear water with
// coral heads and a starfish, and a coconut palm leaning out over the roof from the shore behind.
// Parts: walls, roof (thatch), door, windows, gear, torch, seat.
// =====================================================================
const RB = {
  geo(o){ const C=BH.cab(o,{h:1.05,ratio:1.5}), wh=C.wh, x0=Math.max(HF.x0(),0)+W*.006, w=Math.min(wh*1.6,o.pw*.42), x1=x0+w;
    return {x0,x1,vx:x0,w,wh,wallTop:C.wallTop,roofTop:C.wallTop-wh*1.05,mid:(x0+x1)/2}; },
  walls(o,g,kind,c){ BH.walls(o,{x0:g.x0,x1:g.x1,vx:g.x0,wallTop:g.wallTop},kind,c); for(const e of [g.x0,g.x1-W*.004]) HK.rect(o,e,g.wallTop,W*.004,o.dockY-g.wallTop,'#7a5a3a'); },
  /* the thatch: a tall hip roof with rounded shoulders, rows of straw, a shaggy fringe hanging past the walls, a gablet vent at the top */
  roof(o,g,kind,c){ const q=o.x, lit=HK.lit(o), ov=W*.02, eb=g.wallTop+H*.014, L=g.x0-ov, R=g.x1+ov, top=g.roofTop, col=c;
    const path=()=>{ q.beginPath(); q.moveTo(L,eb); q.quadraticCurveTo(L+(R-L)*.12,top+(eb-top)*.35,g.mid-(R-L)*.1,top+H*.01); q.lineTo(g.mid+(R-L)*.1,top+H*.01); q.quadraticCurveTo(R-(R-L)*.12,top+(eb-top)*.35,R,eb); q.closePath(); };
    q.fillStyle=HK.n(o,col); path(); q.fill(); q.save(); path(); q.clip();
    const rows=kind===1?9:6; for(let k=0;k<rows;k++){ const yy=top+(eb-top)*(k+1)/rows; q.fillStyle=HK.n(o,k%2?HK.dk(col,.12):HK.lt(col,.05)); q.fillRect(L,yy-H*.004,R-L,H*.004); }
    q.strokeStyle=HK.n(o,HK.dk(col,.3)); q.lineWidth=1; q.beginPath(); const st=kind===2?W*.008:W*.0035; for(let X=L;X<R;X+=st){ q.moveTo(X,top); q.lineTo(X+(X-g.mid)*.06,eb); } q.stroke(); q.restore(); /* straw, or palm-leaf shingles */
    q.fillStyle=HK.n(o,HK.dk(col,.08)); q.beginPath(); q.moveTo(L-W*.003,eb-H*.006); for(let X=L-W*.003;X<=R+W*.003;X+=W*.004) q.lineTo(X,eb+H*(.006+.006*Math.abs(Math.sin(X*.7)))); q.lineTo(R+W*.003,eb-H*.006); q.closePath(); q.fill(); /* the shaggy fringe */
    const vx=g.mid, vw=(R-L)*.1; HK.poly(o,[vx-vw,top+H*.012,vx,top-H*.03,vx+vw,top+H*.012],HK.dk(col,.2)); HK.poly(o,[vx-vw*.5,top+H*.008,vx,top-H*.012,vx+vw*.5,top+H*.008],'#3a2a1a'); HK.line(o,[vx,top-H*.03,vx,top-H*.045],'#7a5a3a',2); /* gablet vent and finial */
    HK.line(o,[L,eb,L+(R-L)*.12,top+(eb-top)*.35],v3rgba(o.P.rim||'#fff0d0',.35*lit),1.2);
    o.top=Math.min(o.top==null?o.dockY-H*.23:o.top,top-H*.06); o.low=Math.max(o.low==null?-1e9:o.low,eb+H*.01); },
  /* the shallows around it: sand showing through the clear water under the hut, coral heads and a starfish, the ladder down, a leaning palm */
  ground(o){ const y=o.dockY, wl=o.wl, q=o.x, N=c0=>HK.n(o,c0), x0=HF.x0(), xe=o.pw+W*.04, g=RB.geo(o), sb=wl+H*.07;
    q.fillStyle=v3rgba(N('#f4e2b0'),.45); q.beginPath(); q.moveTo(x0,H); q.lineTo(x0,sb); q.quadraticCurveTo((x0+xe)/2,sb-H*.015,xe,sb+H*.03); q.lineTo(xe+W*.04,H); q.closePath(); q.fill(); /* the sandbar under the water */
    for(const [f,cl,s] of [[.3,'#ff7a6a',1],[.62,'#c86ad8',.8],[.95,'#ffb84a',1.1]]){ const cx=x0+(xe-x0)*f, cy=sb+H*.01; q.fillStyle=v3rgba(N(cl),.55); for(let k=0;k<5;k++){ q.beginPath(); q.arc(cx+(k-2)*W*.004*s,cy-H*.006*s*(1-Math.abs(k-2)/3),H*.008*s,0,7); q.fill(); } } /* coral heads */
    HK.poly(o,[xe-W*.03,sb+H*.016,xe-W*.027,sb+H*.008,xe-W*.024,sb+H*.016,xe-W*.032,sb+H*.011,xe-W*.022,sb+H*.011],v3rgba('#ff8a5a',.7)); /* a starfish */
    const lx=o.pw-W*.01; q.strokeStyle=N('#7a5a3a'); q.lineWidth=2; q.beginPath(); q.moveTo(lx-W*.004,y); q.lineTo(lx-W*.004,wl+H*.03); q.moveTo(lx+W*.004,y); q.lineTo(lx+W*.004,wl+H*.03); for(let yy=y+H*.014;yy<wl+H*.02;yy+=H*.016){ q.moveTo(lx-W*.004,yy); q.lineTo(lx+W*.004,yy); } q.stroke(); /* the ladder into the water */
    const px=x0-W*.03, pb=y+H*.2, tx=g.x1+W*.02, ty=g.roofTop-H*.06; q.strokeStyle=N('#8a6a4a'); q.lineCap='round'; q.lineWidth=Math.max(5,H*.012); q.beginPath(); q.moveTo(px,pb-H*.2); q.quadraticCurveTo(px+W*.01,ty+H*.02,tx,ty); q.stroke(); q.lineCap='butt';
    for(let i=0;i<7;i++){ const a=-Math.PI*.95+i*Math.PI/6.5, L2=W*(.032+(i%2)*.008); q.strokeStyle=N(i%2?'#3a9a4a':'#22703a'); q.lineWidth=Math.max(3,H*.006); q.beginPath(); q.moveTo(tx,ty); q.quadraticCurveTo(tx+Math.cos(a)*L2*.6,ty+Math.sin(a)*L2*.6-H*.02,tx+Math.cos(a)*L2,ty+Math.sin(a)*L2*.5+H*.03); q.stroke(); } HK.circ(o,tx-W*.002,ty+H*.008,H*.006,'#6a4a2a'); HK.circ(o,tx+W*.004,ty+H*.01,H*.005,'#7a5a2a'); /* a coconut palm leaning out over the roof, fronds and coconuts */ }
};
