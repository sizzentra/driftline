// =====================================================================
// CORPORATE POND: THE GLASS PAVILION (overnight, 2026-11-23; its own design, MAP_THEMES › Corporate Pond: business-park plazas, mid-century
// modern, office humour). A small modernist glass office standing on steel columns in the reflecting pool, seen from the side: a thin flat
// roof slab cantilevering past the glass, steel mullions, the office visible inside (a desk with a glowing monitor, a ficus and a water
// cooler, or a whiteboard covered in charts), a company logo on the slab's edge; around it a concrete plaza edge with a planter and a coffee
// cup left on the deck. Parts: walls, roof, inside, partition, lamp, seat.
// =====================================================================
const CO = {
  geo(o){ const C=BH.cab(o,{h:1.05,ratio:2}), wh=C.wh, x0=Math.max(HF.x0(),0)+W*.006, w=Math.min(wh*2.1,o.pw*.5), x1=x0+w; return {x0,x1,vx:x0,w,wh,wallTop:C.wallTop,mid:(x0+x1)/2}; },
  walls(o,g,kind,c){ const q=o.x, y=o.dockY, lit=HK.lit(o), top=g.wallTop;
    if(kind===2){ HK.rect(o,g.x0,top,g.w*.3,y-top,'#9a9a98'); for(let k=1;k<5;k++) HK.rect(o,g.x0,top+(y-top)*k/5,g.w*.3,1,'#7a7a78'); }
    const ga=kind===2?g.x0+g.w*.3:g.x0, gl=q.createLinearGradient(0,top,0,y); gl.addColorStop(0,HK.n(o,v3rgba(c,kind===1?.85:.55))); gl.addColorStop(1,HK.n(o,v3rgba(HK.dk(c,.3),kind===1?.9:.6))); q.fillStyle=gl; q.fillRect(ga,top,g.x1-ga,y-top);
    q.fillStyle=v3rgba('#ffffff',.2*lit); q.beginPath(); q.moveTo(ga+g.w*.1,top); q.lineTo(ga+g.w*.2,top); q.lineTo(ga+g.w*.05,y); q.lineTo(ga,y); q.lineTo(ga,y-(y-top)*.3); q.closePath(); q.fill(); /* a sheen across the glass */
    const n=Math.round((g.x1-ga)/(W*.03)); for(let k=0;k<=n;k++) HK.rect(o,ga+(g.x1-ga)*k/n-1.5,top,3,y-top,'#5a6470'); HK.rect(o,ga,top+(y-top)*.55,g.x1-ga,2,'#5a6470'); /* steel mullions and a transom */ },
  /* the inside, seen through the glass: a desk with a glowing monitor and an office chair, a ficus and a water cooler, or a whiteboard of charts */
  inside(o,g,s,c){ const y=o.dockY, top=g.wallTop, a=g.x0+g.w*.45;
    if(s===0){ HK.rect(o,a,y-H*.03,g.w*.3,H*.004,'#8a6a4a'); HK.rect(o,a+g.w*.02,y-H*.03,2,H*.03,'#5a6470'); HK.rect(o,a+g.w*.27,y-H*.03,2,H*.03,'#5a6470'); HK.rect(o,a+g.w*.1,y-H*.058,g.w*.12,H*.026,'#1a1c20'); HK.rect(o,a+g.w*.11,y-H*.055,g.w*.1,H*.02,v3rgba(c,.9)); HK.rect(o,a+g.w*.155,y-H*.032,3,H*.002,'#1a1c20'); o.lights.push({x:a+g.w*.16,y:y-H*.045,r:.06,a:.4,small:1}); } /* the desk and its monitor */
    if(s===1){ const fx=a+g.w*.05; HK.rect(o,fx-W*.005,y-H*.016,W*.01,H*.016,'#c8c8c4'); for(let k=0;k<9;k++) HK.ell(o,fx+(k%3-1)*W*.005,y-H*(.03+Math.floor(k/3)*.012),W*.005,H*.007,k%2?'#4a8a4a':'#3a7a3a'); const wx=a+g.w*.3; HK.rect(o,wx,y-H*.03,W*.01,H*.03,'#f4f6f8'); HK.ell(o,wx+W*.005,y-H*.04,W*.006,H*.012,v3rgba(c,.8)); } /* a ficus and the water cooler */
    if(s===2){ const bx=a, bw=g.w*.4, by=top+(y-top)*.15, bh=(y-top)*.35; HK.rect(o,bx-2,by-2,bw+4,bh+4,'#a8b0b8'); HK.rect(o,bx,by,bw,bh,'#f4f6f8'); HK.line(o,[bx+bw*.1,by+bh*.8,bx+bw*.3,by+bh*.6,bx+bw*.5,by+bh*.7,bx+bw*.8,by+bh*.2],c,1.5); HK.line(o,[bx+bw*.74,by+bh*.2,bx+bw*.8,by+bh*.2,bx+bw*.8,by+bh*.28],c,1.5); HK.rect(o,bx+bw*.85,by+bh*.55,bw*.1,bh*.25,'#f4d040'); } /* a whiteboard: line going up and a sticky note */ },
  /* the roof: a thin flat slab cantilevering past the glass, plain, planted, or with solar panels; the company logo on its edge */
  roof(o,g,kind,c){ const q=o.x, lit=HK.lit(o), L=g.x0-W*.01, R=g.x1+W*.03, t=Math.max(5,H*.014), y0=g.wallTop-t;
    HK.rect(o,L,y0,R-L,t,c); HK.rect(o,L,y0,R-L,1.5,v3rgba('#ffffff',.3*lit)); HK.rect(o,L,y0+t,R-L,2,v3rgba('#000000',.3));
    if(kind===1){ for(let X=L;X<R;X+=W*.006) HK.ell(o,X,y0,W*.005,H*.006,X%2?'#4a8a4a':'#5a9a4a'); } /* a green roof */
    if(kind===2) for(let k=0;k<4;k++){ const px=L+W*.01+k*(R-L-W*.02)/4; HK.poly(o,[px,y0,px+W*.02,y0-H*.016,px+W*.024,y0-H*.012,px+W*.004,y0+1],'#1e2e4a'); HK.line(o,[px+W*.005,y0-H*.002,px+W*.021,y0-H*.012],'#4a6a88',1); } /* solar panels */
    q.fillStyle=HK.n(o,'#f4f6f8'); q.font='bold '+Math.round(t*.8)+'px sans-serif'; q.fillText('SYNERGY',g.x0+g.w*.1,y0+t*.8); HK.circ(o,g.x0+g.w*.05,y0+t*.5,t*.35,'#f4d040'); /* the logo */
    o.top=Math.min(o.top==null?o.dockY-H*.23:o.top,y0-H*.04); o.low=Math.max(o.low==null?-1e9:o.low,y0+t); },
  /* the plaza edge: a concrete coping and a planter with clipped shrubs, steel columns into the pool, a coffee cup left on the deck */
  ground(o){ const y=o.dockY, wl=o.wl, q=o.x, N=c0=>HK.n(o,c0), x0=HF.x0(), under=y+HK.fh();
    for(let i=0;i<=5;i++){ const px=x0+(o.pw-x0)*(.04+.92*i/5); q.fillStyle=N('#5a6470'); q.fillRect(px-W*.003,under,W*.006,H-under); q.fillStyle=v3rgba('#ffffff',.2); q.fillRect(px-W*.003,under,1.5,H-under); }
    q.fillStyle=v3rgba(o.P.wMid||'#4a6a88',.5); q.fillRect(x0,wl,o.pw-x0+W*.02,H-wl); /* the columns under the water */
    const g=CO.geo(o), px=g.x1+W*.035; HK.rect(o,px,y-H*.022,W*.03,H*.022,'#9a9a98'); HK.rect(o,px,y-H*.022,W*.03,2,'#c8c8c4'); for(let k=0;k<3;k++) HK.ell(o,px+W*(.006+k*.009),y-H*.028,W*.006,H*.009,'#3a7a3a'); /* a planter with clipped box shrubs */
    HK.rect(o,o.pw-W*.012,y-H*.012,W*.006,H*.012,'#f4f6f8'); HK.rect(o,o.pw-W*.012,y-H*.009,W*.006,H*.004,'#8a5a3a'); /* a coffee cup */ }
};
