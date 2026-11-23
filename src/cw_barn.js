// =====================================================================
// ANIMAL FARM: THE RED BARN (overnight, 2026-11-23; its own design, MAP_THEMES › Animal Farm: Midwest red barns, county fairs, picture books).
// A red barn at the pond's edge, seen from its gable end: a gambrel roof (two slopes on each side, the barn shape everyone knows) with white
// trim, a hayloft door near the peak with a hay hoist beam and a bundle of hay, big white X-braced doors below; around it a grassy bank with
// a hay stack and sunflowers, the dock running out from the barn on fence-post supports.
// Parts: walls, roof (gambrel), hayloft, doors, fence, lantern, seat.
// =====================================================================
const AB = {
  geo(o){ const C=BH.cab(o,{h:1.25,ratio:1.4}), wh=C.wh, x0=Math.max(HF.x0(),0)+W*.004, w=Math.min(wh*1.35,o.pw*.42), x1=x0+w, k1=C.wallTop-w*.2, pk=C.wallTop-w*.42; return {x0,x1,vx:x0,w,wh,wallTop:C.wallTop,k1,pk,mid:(x0+x1)/2}; },
  pts(g,ov){ const a=g.x0-ov, b=g.x1+ov; return [a,g.wallTop+ov*.6, g.x0+g.w*.1,g.k1, g.mid,g.pk, g.x1-g.w*.1,g.k1, b,g.wallTop+ov*.6]; },
  /* the gable-end wall up to the gambrel line, white trim along it and at the corners */
  walls(o,g,kind,c){ const q=o.x, y=o.dockY, p=AB.pts(g,0); q.save(); q.beginPath(); q.moveTo(g.x0,y); for(let i=0;i<p.length;i+=2) q.lineTo(p[i],p[i+1]); q.lineTo(g.x1,y); q.closePath(); q.clip(); BH.walls(o,{x0:g.x0,x1:g.x1,vx:g.x0,wallTop:g.pk},['batten','batten','clapboard'][kind],kind===1?mix('#8a6a4a',c,.4):c); q.restore();
    for(const e of [g.x0,g.x1-W*.005]) HK.rect(o,e,g.wallTop,W*.005,y-g.wallTop,'#f4f0e6'); },
  /* the gambrel roof's edge: a broad band following the two-pitch outline, shingles, tin or rusty tin */
  roof(o,g,kind,c){ const q=o.x, lit=HK.lit(o), ov=W*.012, th=Math.max(5,H*.012), p=AB.pts(g,ov), col=kind===2?mix('#a8683a',c,.4):c;
    q.strokeStyle=HK.n(o,col); q.lineWidth=th; q.lineJoin='round'; q.beginPath(); q.moveTo(p[0],p[1]); for(let i=2;i<p.length;i+=2) q.lineTo(p[i],p[i+1]); q.stroke(); q.lineJoin='miter';
    q.strokeStyle=HK.n(o,'#f4f0e6'); q.lineWidth=2; q.beginPath(); const p2=AB.pts(g,ov*.3); q.moveTo(p2[0],p2[1]+th*.55); for(let i=2;i<p2.length;i+=2) q.lineTo(p2[i],p2[i+1]+th*.55); q.stroke(); /* white trim under the eaves */
    q.strokeStyle=v3rgba(o.P.rim||'#fff0d0',.35*lit); q.lineWidth=1; q.beginPath(); q.moveTo(p[0],p[1]-th*.5); q.lineTo(p[2],p[3]-th*.5); q.lineTo(p[4],p[5]-th*.5); q.stroke();
    if(kind===2){ q.fillStyle=v3rgba('#8a4a2a',.6); for(let k=0;k<6;k++){ const u=(k+.5)/6, i=u<.5?0:4, f=(u<.5?u*2:(u-.5)*2); q.fillRect(p[i]+(p[i+4]-p[i])*f*.5,p[i+1]+(p[i+5]-p[i+1])*f*.5-2,3,4); } } /* rust spots */
    o.top=Math.min(o.top==null?o.dockY-H*.23:o.top,g.pk-H*.04); o.low=Math.max(o.low==null?-1e9:o.low,g.wallTop); },
  /* the hayloft: an open loft door with hay and a hoist beam with a pulley and a bundle on its rope, closed X-braced loft doors, or a round window */
  loft(o,g,s,c){ const lw=g.w*.26, lx=g.mid-lw/2, ly=g.k1+H*.008, lh=(g.wallTop-g.k1)*.8+H*.02;
    if(s===0){ HK.rect(o,lx-2,ly-2,lw+4,lh+4,'#f4f0e6'); HK.rect(o,lx,ly,lw,lh,'#2a1a10'); HK.poly(o,[lx,ly+lh,lx+lw*.2,ly+lh*.55,lx+lw*.5,ly+lh*.45,lx+lw*.85,ly+lh*.6,lx+lw,ly+lh],'#e0c060'); const by=g.pk+H*.004; HK.rect(o,g.mid-W*.002,by,W*.004,ly-by,c); HK.rect(o,g.mid-W*.002,by,g.w*.32,W*.004,c); const hx=g.mid+g.w*.3; HK.circ(o,hx,by+H*.006,H*.004,'#3a3a40'); HK.line(o,[hx,by+H*.008,hx,ly+lh*.6],'#c8a878',1); HK.ell(o,hx,ly+lh*.75,W*.006,H*.01,'#d8b46a'); }
    if(s===1){ HK.rect(o,lx-2,ly-2,lw+4,lh+4,'#f4f0e6'); HK.rect(o,lx,ly,lw,lh,c); HK.line(o,[lx,ly,lx+lw,ly+lh],'#f4f0e6',2); HK.line(o,[lx+lw,ly,lx,ly+lh],'#f4f0e6',2); HK.line(o,[g.mid,ly,g.mid,ly+lh],'#f4f0e6',1.5); }
    if(s===2){ HK.circ(o,g.mid,ly+lh*.5,lw*.38+2,'#f4f0e6'); HK.circ(o,g.mid,ly+lh*.5,lw*.38,'#2a3440'); HK.line(o,[g.mid-lw*.38,ly+lh*.5,g.mid+lw*.38,ly+lh*.5],'#f4f0e6',1.2); HK.line(o,[g.mid,ly+lh*.5-lw*.38,g.mid,ly+lh*.5+lw*.38],'#f4f0e6',1.2); o.lights.push({x:g.mid,y:ly+lh*.5,r:.08,a:.45,small:1}); } },
  /* the big doors: white X-braced sliding doors on a track, a Dutch door, or doors rolled open showing hay inside */
  doors(o,g,s,c){ const y=o.dockY, dw=g.w*.6, dx=g.mid-dw/2, dh=(y-g.wallTop)*.82, top=y-dh;
    HK.rect(o,dx-W*.006,top-H*.008,dw+W*.012,H*.004,'#3a3a40');
    if(s===0) for(const a of [dx,dx+dw/2]){ HK.rect(o,a,top,dw/2,dh,c); HK.line(o,[a+2,top+2,a+dw/2-2,y-2],'#f4f0e6',2.5); HK.line(o,[a+dw/2-2,top+2,a+2,y-2],'#f4f0e6',2.5); HK.line(o,[a,top,a+dw/2,top,a+dw/2,y,a,y,a,top],'#f4f0e6',2.5); }
    if(s===1){ const w2=dw*.45; HK.rect(o,g.mid-w2/2,top,w2,dh,c); HK.line(o,[g.mid-w2/2,top+dh*.5,g.mid+w2/2,top+dh*.5],'#f4f0e6',2); HK.line(o,[g.mid-w2/2,top,g.mid+w2/2,top,g.mid+w2/2,y,g.mid-w2/2,y,g.mid-w2/2,top],'#f4f0e6',2); }
    if(s===2){ HK.rect(o,dx,top,dw,dh,'#1a120c'); HK.block(o,dx+dw*.15,y-dh*.35,dw*.35,dh*.35,'#d8b46a'); HK.block(o,dx+dw*.5,y-dh*.25,dw*.3,dh*.25,'#e0c060'); for(const a of [dx-dw*.32,dx+dw+dw*.02]){ HK.rect(o,a,top,dw*.3,dh,c); HK.line(o,[a,top,a+dw*.3,y],'#f4f0e6',2); } } /* doors rolled open, hay bales inside */ },
  /* the bank: grass sloping up behind, a hay stack, sunflowers */
  ground(o){ const x=o.x, y=o.dockY, N=c0=>HK.n(o,c0), x0=HF.x0(), xe=o.pw-W*.02, top=X=>y-H*.1+(X-x0)/(xe-x0)*H*.1;
    x.fillStyle=N('#4a8a3a'); x.beginPath(); x.moveTo(x0,y); for(let X=x0;X<=xe;X+=4) x.lineTo(X,top(X)); x.lineTo(xe,y); x.closePath(); x.fill(); x.fillStyle=N('#6aaa4a'); x.beginPath(); x.moveTo(x0,y); for(let X=x0;X<=xe;X+=4) x.lineTo(X,top(X)+H*.008); x.lineTo(xe,y); x.closePath(); x.fill();
    const g=AB.geo(o), hx=g.x1+W*.006; x.fillStyle=N('#d8b46a'); x.beginPath(); x.ellipse(hx+W*.016,y-H*.002,W*.018,H*.036,0,Math.PI,0); x.fill(); x.strokeStyle=N('#b8943a'); x.lineWidth=1; x.beginPath(); for(let k=-3;k<=3;k++){ x.moveTo(hx+W*.016+k*W*.004,y-H*.03+Math.abs(k)*H*.006); x.lineTo(hx+W*.016+k*W*.005,y); } x.stroke(); /* a hay stack */
    for(let k=0;k<3;k++){ const sx=hx+W*.04+k*W*.012, sh=H*(.05+k%2*.012); HK.line(o,[sx,y,sx,y-sh],'#4a7a2a',1.5); HK.ell(o,sx-W*.004,y-sh*.5,W*.004,H*.003,'#4a7a2a'); for(let p=0;p<8;p++){ const a=p*Math.PI/4; HK.ell(o,sx+Math.cos(a)*H*.007,y-sh+Math.sin(a)*H*.007,H*.004,H*.004,'#f0c020'); } HK.circ(o,sx,y-sh,H*.005,'#5a3a1a'); } /* sunflowers */ }
};
