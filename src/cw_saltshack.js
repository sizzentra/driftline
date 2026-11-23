// =====================================================================
// SALTMARSH COAST: THE LOBSTER SHACK (overnight, 2026-11-23; its own design, MAP_THEMES › Saltmarsh: Maine and Cornwall lobster shacks).
// A tall, narrow saltbox shack at the end of a long weathered pier, seen from its gable end: a short steep slope on the sea side and a long
// slope running down toward the shore, a stovepipe, a lantern on a bracket; buoys hung on its wall, lobster pots stacked on the deck or a
// net drying on a pole. Around it the pier itself: tall tarred pilings with cross bracing, barnacles and weed at the tide line, a ladder
// down to the water with a dory tied to it, and a tall mooring piling at the pier's end where a gull stands.
// Parts: siding, roof, door, windows, gear, lamp, seat.
// =====================================================================
const SS = {
  geo(o){ const C=BH.cab(o,{h:1.45,ratio:1.3}), wh=C.wh, x0=Math.max(HF.x0(),0)-W*.004, w=Math.min(wh*1.9,o.pw*.46), x1=x0+w, rx=x0+w*.7, ry=C.wallTop-w*.34, lt=C.wallTop+wh*.3;
    return {x0,x1,vx:Math.max(x0,0),wallTop:C.wallTop,rx,ry,lt,wh,w}; },
  /* the gable-end wall up to the roof line (a saltbox: the shore-side wall is lower) */
  walls(o,g,kind,c){ const q=o.x, y=o.dockY; q.save(); q.beginPath(); q.moveTo(g.x0,y); q.lineTo(g.x0,g.lt); q.lineTo(g.rx,g.ry); q.lineTo(g.x1,g.wallTop); q.lineTo(g.x1,y); q.closePath(); q.clip(); BH.walls(o,{x0:g.x0,x1:g.x1,vx:g.x0,wallTop:g.ry},kind,c); q.restore();
    HK.rect(o,g.x1-W*.003,g.wallTop,W*.003,y-g.wallTop,HK.dk(c,.3)); HK.rect(o,g.x0,y-H*.006,g.w,H*.006,HK.dk(c,.35)); /* corner board and sill */ },
  /* the roof: two slopes with overhang, its material along them; a stovepipe through the long slope */
  roof(o,g,kind,c){ const q=o.x, lit=HK.lit(o), ov=W*.012, th=Math.max(5,H*.012), L=[g.x0-ov,g.lt+ov*(g.lt-g.ry)/(g.rx-g.x0)], R=[g.x1+ov*.8,g.wallTop+ov*.8*(g.wallTop-g.ry)/(g.x1-g.rx)], col=kind===2?mix('#8a9aa0',c,.6):c;
    const px=g.x0+(g.rx-g.x0)*.35, py=g.lt+(g.ry-g.lt)*.35; HK.rect(o,px-W*.003,py-H*.06,W*.006,H*.07,'#2a2a2e'); HK.rect(o,px-W*.0045,py-H*.064,W*.009,H*.006,'#3a3a40'); /* the stovepipe */
    q.fillStyle=HK.n(o,col); q.beginPath(); q.moveTo(L[0],L[1]); q.lineTo(g.rx,g.ry-th*.6); q.lineTo(R[0],R[1]); q.lineTo(R[0],R[1]+th); q.lineTo(g.rx,g.ry+th*.6); q.lineTo(L[0],L[1]+th); q.closePath(); q.fill();
    q.save(); q.clip(); q.strokeStyle=HK.n(o,HK.dk(col,.3)); q.lineWidth=1; q.beginPath();
    if(kind===2){ for(let X=L[0];X<R[0];X+=W*.006){ q.moveTo(X,g.ry-th*2); q.lineTo(X,g.lt+th*3); } } /* tin: standing seams */
    else { const st=kind===1?W*.004:W*.007; for(let X=L[0];X<R[0];X+=st){ q.moveTo(X,g.ry-th*2); q.lineTo(X+st*.3,g.lt+th*3); } } q.stroke(); q.restore(); /* asphalt tabs or cedar shakes */
    HK.line(o,[L[0],L[1],g.rx,g.ry-th*.6,R[0],R[1]],v3rgba(o.P.rim||'#fff0d0',.45*lit),1.2); HK.line(o,[L[0],L[1]+th,g.rx,g.ry+th*.6,R[0],R[1]+th],v3rgba('#000000',.3),1);
    o.top=Math.min(o.top==null?o.dockY-H*.23:o.top,g.ry-H*.08); o.low=Math.max(o.low==null?-1e9:o.low,g.wallTop); },
  /* fishing gear: buoys hung on the wall, lobster pots stacked on the deck, or a net drying on a pole */
  gear(o,g,s,c){ const y=o.dockY, q=o.x;
    if(s===0){ const cols=[c,'#e8c04a','#f4f0e6','#c8483a','#3aa0a8','#e8c04a']; for(let i=0;i<6;i++){ const bx=g.x1-g.w*(.05+(i%3)*.055), by=g.wallTop+(y-g.wallTop)*(.16+Math.floor(i/3)*.22); HK.line(o,[bx,by-H*.012,bx,by-H*.004],'#c8a878',1); HK.ell(o,bx,by+H*.006,W*.0045,H*.011,cols[i]); HK.rect(o,bx-W*.0045,by+H*.004,W*.009,H*.003,'#f4f0e6'); } }
    if(s===1){ const bx=g.x1+W*.006; for(let r=0;r<3;r++) for(let k=0;k<3-r;k++){ const px=bx+k*W*.02+r*W*.01, py=y-(r+1)*H*.022, pw=W*.019, ph=H*.021; HK.rect(o,px,py,pw,ph,HK.dk(c,.05)); q.strokeStyle=HK.n(o,'#2e2a28'); q.lineWidth=1; q.beginPath(); for(let m=1;m<5;m++){ q.moveTo(px+pw*m/5,py); q.lineTo(px+pw*m/5,py+ph); } q.moveTo(px,py+ph/2); q.lineTo(px+pw,py+ph/2); q.stroke(); HK.rect(o,px,py,pw,1.5,HK.lt(c,.2)); } } /* wooden lobster pots, stacked */
    if(s===2){ const nx=g.x1+W*.03, top=y-H*.13; HK.rect(o,nx-1.5,top,3,y-top,'#6a5440'); HK.rect(o,nx-W*.012,top,W*.024,2,'#6a5440'); q.fillStyle=v3rgba(c,.55); q.beginPath(); q.moveTo(nx-W*.012,top); q.quadraticCurveTo(nx-W*.016,top+H*.06,nx-W*.006,y-H*.012); q.lineTo(nx+W*.006,y-H*.012); q.quadraticCurveTo(nx+W*.016,top+H*.06,nx+W*.012,top); q.closePath(); q.fill(); q.strokeStyle=HK.n(o,HK.dk(c,.3)); q.lineWidth=.6; q.beginPath(); for(let k=1;k<6;k++){ q.moveTo(nx-W*.012+k*W*.004,top); q.lineTo(nx-W*.008+k*W*.0025,y-H*.012); } q.stroke(); HK.ell(o,nx-W*.009,top+H*.05,W*.003,H*.004,'#e8c04a'); HK.ell(o,nx+W*.009,top+H*.07,W*.003,H*.004,'#e8c04a'); } /* a net drying on its pole, with floats */ },
  /* the pier around the home: tall tarred pilings with cross bracing, barnacles and weed at the tide line, a ladder to the water with a dory
     tied to it, a tall mooring piling at the end with a gull on top */
  ground(o){ const x=o.x, y=o.dockY, wl=o.wl, x0=HF.x0(), N=c0=>HK.n(o,c0), lit=HK.lit(o), under=y+HK.fh(), n=6, xs=[...Array(n+1)].map((_,i)=>x0+(o.pw-x0)*(.02+.96*i/n)), pw=Math.max(6,W*.009);
    for(let i=0;i<n;i++){ const a=xs[i], b=xs[i+1]; x.strokeStyle=N('#3a3230'); x.lineWidth=Math.max(2,H*.004); x.beginPath(); x.moveTo(a,under+H*.004); x.lineTo(b,wl-H*.01); x.moveTo(b,under+H*.004); x.lineTo(a,wl-H*.01); x.stroke(); } /* cross bracing */
    for(const px of xs){ const g2=x.createLinearGradient(px-pw/2,0,px+pw/2,0); g2.addColorStop(0,N('#2a2422')); g2.addColorStop(.4,N('#4a403a')); g2.addColorStop(1,N('#1e1a18')); x.fillStyle=g2; x.fillRect(px-pw/2,under,pw,H-under);
      x.fillStyle=N('#d8d4c8'); for(let k=0;k<6;k++) x.fillRect(px-pw/2+(k%3)*pw/3,wl-H*.012+Math.floor(k/3)*H*.005,pw/4,H*.003); /* barnacles */
      x.fillStyle=N('#3a5a2a'); x.fillRect(px-pw/2,wl-H*.004,pw,H*.01); x.beginPath(); x.moveTo(px-pw/2,wl+H*.006); x.lineTo(px-pw/2-2,wl+H*.02); x.lineTo(px,wl+H*.008); x.lineTo(px+pw/2+2,wl+H*.022); x.lineTo(px+pw/2,wl+H*.006); x.closePath(); x.fill(); } /* weed at the tide line */
    const lx=o.pw-W*.012; x.strokeStyle=N('#6a5a4a'); x.lineWidth=2; x.beginPath(); x.moveTo(lx-W*.004,y); x.lineTo(lx-W*.004,wl+H*.01); x.moveTo(lx+W*.004,y); x.lineTo(lx+W*.004,wl+H*.01); for(let yy=y+H*.012;yy<wl;yy+=H*.014){ x.moveTo(lx-W*.004,yy); x.lineTo(lx+W*.004,yy); } x.stroke(); /* the ladder */
    const dx=o.pw+W*.01, dy=wl+H*.006, dw=W*.07; x.fillStyle=N('#3a6a7a'); x.beginPath(); x.moveTo(dx,dy-H*.014); x.lineTo(dx+dw,dy-H*.026); x.quadraticCurveTo(dx+dw*.92,dy+H*.01,dx+dw*.72,dy+H*.012); x.lineTo(dx+dw*.14,dy+H*.012); x.closePath(); x.fill(); x.fillStyle=N('#e8e0d0'); x.fillRect(dx,dy-H*.016,dw*.98,H*.004); x.strokeStyle=N('#c8a878'); x.lineWidth=1; x.beginPath(); x.moveTo(lx,y+H*.03); x.quadraticCurveTo(dx-W*.004,dy-H*.004,dx+W*.002,dy-H*.014); x.stroke(); /* a dory tied to the ladder */
    const mx=o.pw+W*.002, mt=y-H*.07; x.fillStyle=N('#3a3230'); x.fillRect(mx-pw*.6,mt,pw*1.2,y-mt); x.fillStyle=v3rgba('#ffffff',.12*lit); x.fillRect(mx-pw*.6,mt,2,y-mt); HK.ell(o,mx,mt-H*.008,W*.006,H*.006,'#f4f4f0'); HK.ell(o,mx+W*.005,mt-H*.012,W*.003,H*.003,'#f4f4f0'); HK.line(o,[mx+W*.007,mt-H*.012,mx+W*.01,mt-H*.011],'#e8a040',1.5); HK.line(o,[mx-W*.004,mt-H*.007,mx-W*.009,mt-H*.005],'#8a8a90',1.5); HK.line(o,[mx-W*.001,mt-H*.003,mx-W*.001,mt],'#e8a040',1); /* a tall mooring piling with a gull on top */ }
};
