// =====================================================================
// THE NILE: THE REED BOAT (overnight, 2026-11-23; its own design, MAP_THEMES › The Nile: tomb paintings of papyrus boats, feluccas, the sun
// barque). A boat floating on the river, seen from the side as in Egyptian paintings: a crescent hull of papyrus bundles whose ends sweep up
// high and finish in papyrus flower heads, rope lashings every few hands, a steering oar hung at the stern; a wooden felucca with a low hull,
// or a gilded barque with lotus finials and a painted eye. Its sail, cabin, cargo and lamp keep their old ids, so saved choices still fit.
// =====================================================================
const NB = {
  geo(o){ const x0=Math.max(HF.x0(),0)+W*.03, xb=o.pw+W*.02, y=o.dockY, wl=o.wl; return {x0,xb,y,wl,len:xb-x0}; },
  hull(o,kind,c){ const q=o.x, g=NB.geo(o), y=g.y, wl=g.wl, lit=HK.lit(o), bot=wl+H*.012, up=kind===1?H*.03:H*.03, col=kind===2?'#d8a830':c;
    const top=X=>{ const u=(X-g.x0)/g.len, e=Math.min(u,1-u); return y-up*Math.pow(Math.max(0,1-e/.18),2.2)*(u<.5?1.15:1); };
    q.save(); q.beginPath(); q.moveTo(g.x0-W*.012,top(g.x0)); for(let X=g.x0;X<=g.xb;X+=4) q.lineTo(X,top(X)); q.lineTo(g.xb+W*.012,top(g.xb)); q.quadraticCurveTo(g.xb,bot,g.xb-g.len*.2,bot); q.lineTo(g.x0+g.len*.2,bot); q.quadraticCurveTo(g.x0,bot,g.x0-W*.012,top(g.x0)); q.closePath();
    const hg=q.createLinearGradient(0,y-up,0,bot); hg.addColorStop(0,HK.n(o,HK.lt(col,.12))); hg.addColorStop(1,HK.n(o,HK.dk(col,.25))); q.fillStyle=hg; q.fill(); q.clip();
    if(kind===1){ q.strokeStyle=HK.n(o,HK.dk(col,.3)); q.lineWidth=1; q.beginPath(); for(let Y=y;Y<bot;Y+=H*.01){ q.moveTo(g.x0-W*.02,Y); q.lineTo(g.xb+W*.02,Y); } q.stroke(); } /* felucca planks */
    else { q.strokeStyle=HK.n(o,HK.dk(col,.2)); q.lineWidth=1; for(let k=1;k<6;k++){ q.beginPath(); for(let X=g.x0-W*.012;X<=g.xb+W*.012;X+=4){ const t=top(Math.min(Math.max(X,g.x0),g.xb)); q.lineTo(X,t+(bot-t)*k/6); } q.stroke(); } /* the reed bundles */
      q.fillStyle=HK.n(o,kind===2?'#2a5aa8':'#8a6a3a'); for(let X=g.x0+W*.01;X<g.xb;X+=W*.022) q.fillRect(X,y-up,W*.003,bot-y+up); } /* rope lashings, or lapis bands on the barque */
    q.fillStyle=v3rgba(o.P.wMid||'#2a7a80',.55); q.fillRect(g.x0-W*.03,wl,g.len+W*.06,H*.03); q.restore();
    if(kind!==1){ for(const [bx,d] of [[g.x0+W*.004,-1],[g.xb-W*.004,1]]){ const by=top(d<0?g.x0:g.xb)+H*.01, tx=bx+d*W*.03, ty=y-H*.11, wb=H*.03; q.fillStyle=HK.n(o,col); q.beginPath(); q.moveTo(bx-d*wb*.3,by+wb*.6); q.quadraticCurveTo(bx+d*W*.02,by+wb*.2,tx,ty); q.quadraticCurveTo(bx+d*W*.004,by-wb*.6,bx-d*wb*.6,by-wb*.2); q.closePath(); q.fill(); q.strokeStyle=HK.n(o,HK.dk(col,.25)); q.lineWidth=1; q.stroke(); for(let k=1;k<4;k++){ const u=k/4; HK.line(o,[bx+(tx-bx)*u-W*.004,by+(ty-by)*u*.9+H*.004,bx+(tx-bx)*u+W*.004,by+(ty-by)*u*.9-H*.002],kind===2?'#2a5aa8':'#8a6a3a',2); }
      q.fillStyle=HK.n(o,kind===2?'#f0c84a':'#6a9a4a'); q.beginPath(); q.moveTo(tx,ty); for(let k=0;k<=6;k++){ const a=-Math.PI/2+d*(-.9+k*.3); q.lineTo(tx+Math.cos(a)*H*.02+d*H*.004,ty+Math.sin(a)*H*.02); } q.closePath(); q.fill(); } } /* slim upswept horns, lashed, ending in papyrus flower heads (gold lotus on the barque) */
    if(kind===2){ const ex=g.xb-g.len*.12, ey=top(ex)+H*.025; HK.ell(o,ex,ey,W*.008,H*.006,'#f0e8d4'); HK.circ(o,ex,ey,H*.004,'#1a1410'); HK.line(o,[ex-W*.008,ey-H*.008,ex+W*.008,ey-H*.008],'#1a1410',1.5); HK.line(o,[ex-W*.002,ey+H*.006,ex-W*.004,ey+H*.016],'#1a1410',1.5); } /* the painted eye on the barque's bow */
    const sx=g.x0+W*.01; HK.line(o,[sx,y-H*.05,sx-W*.03,wl+H*.03],'#5a3a22',Math.max(2.5,H*.005)); HK.poly(o,[sx-W*.026,wl,sx-W*.036,wl+H*.035,sx-W*.03,wl+H*.04,sx-W*.022,wl+H*.008],'#7a5a3a'); HK.line(o,[sx,y-H*.05,sx,y],'#5a3a22',2); /* the steering oar at the stern */
    o.top=Math.min(o.top==null?y-H*.23:o.top,y-H*.15); o.low=Math.max(o.low==null?-1e9:o.low,y-H*.004); },
  /* the cabin: a linen awning on two lotus columns, a little temple pylon, or a striped tent */
  cabin(o,s,c){ const g=NB.geo(o), y=g.y, a=g.x0+g.len*.18, b=a+g.len*.3, top=y-H*.1, q=o.x; if(!s) return;
    if(s===1){ for(const px of [a+W*.004,b-W*.004]){ HK.rect(o,px-W*.003,top,W*.006,y-top,'#ece0c4'); HK.poly(o,[px-W*.008,top,px+W*.008,top,px+W*.004,top+H*.014,px-W*.004,top+H*.014],'#6a9a4a'); for(let k=0;k<3;k++) HK.rect(o,px-W*.003,top+H*(.03+k*.015),W*.006,H*.003,'#2a5aa8'); } HK.rect(o,a-W*.006,top-H*.008,b-a+W*.012,H*.01,c); for(let X=a;X<b;X+=W*.01) HK.poly(o,[X,top+H*.002,X+W*.005,top+H*.012,X+W*.01,top+H*.002],c); o.low=Math.max(o.low==null?-1e9:o.low,top); } /* a linen awning on lotus columns with lapis bands, scalloped edge */
    if(s===2){ HK.poly(o,[a,y,a+W*.004,top-H*.02,b-W*.004,top-H*.02,b,y],c); HK.rect(o,a-W*.002,top-H*.028,b-a+W*.004,H*.008,HK.dk(c,.2)); HK.rect(o,(a+b)/2-W*.008,y-H*.05,W*.016,H*.05,'#1a1410'); HK.circ(o,(a+b)/2,top-H*.008,H*.008,'#f0c84a'); for(let k=0;k<4;k++) HK.rect(o,a+W*.006,top+k*H*.018,W*.004,H*.008,'#2a5aa8'); } /* a little temple pylon with a sun disc */
    if(s===3){ q.fillStyle=HK.n(o,c); q.beginPath(); q.moveTo(a,y); q.lineTo((a+b)/2,top-H*.01); q.lineTo(b,y); q.closePath(); q.fill(); q.save(); q.clip(); for(let X=a,k=0;X<b;X+=W*.008,k++) if(k%2) HK.rect(o,X,top-H*.02,W*.008,y-top+H*.02,'#2a5aa8'); q.restore(); } /* a striped tent */ }
};
