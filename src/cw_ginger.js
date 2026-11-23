// =====================================================================
// THE BUFFET: THE GINGERBREAD HOUSE (overnight, 2026-11-23; its own design, MAP_THEMES › The Buffet: gingerbread fairy tales, candy land,
// fine-dining jokes). A gingerbread house on a serving platter over a lake of soup, seen from its gable end: a steep roof under thick
// icing that drips over the eaves, gumdrops along the ridge, candy-cane corner posts, icing piping around the walls; beside it a giant fork
// standing in the soup with a cherry, and a dollop of whipped cream on the platter's edge.
// Parts: walls, roof, door, windows, trim, candle, seat.
// =====================================================================
const GB = {
  geo(o){ const C=BH.cab(o,{h:1.1,ratio:1.3}), wh=C.wh, x0=Math.max(HF.x0(),0)+W*.008, w=Math.min(wh*1.35,o.pw*.4), x1=x0+w; return {x0,x1,vx:x0,w,wh,wallTop:C.wallTop,pk:C.wallTop-w*.62,mid:(x0+x1)/2}; },
  walls(o,g,kind,c){ const q=o.x, y=o.dockY; q.save(); q.beginPath(); q.moveTo(g.x0,y); q.lineTo(g.x0,g.wallTop); q.lineTo(g.mid,g.pk); q.lineTo(g.x1,g.wallTop); q.lineTo(g.x1,y); q.closePath(); q.clip();
    q.fillStyle=HK.n(o,c); q.fillRect(g.x0,g.pk,g.w,y-g.pk); q.fillStyle=v3rgba('#000000',.08); for(let i=0;i<14;i++){ q.beginPath(); q.arc(g.x0+((i*.618)%1)*g.w,g.pk+((i*.377)%1)*(y-g.pk),1.2,0,7); q.fill(); } /* baked dough with a few freckles */
    if(kind===1){ q.strokeStyle=HK.n(o,HK.dk(c,.3)); q.lineWidth=1.5; q.beginPath(); for(let X=g.x0+g.w/4;X<g.x1;X+=g.w/4){ q.moveTo(X,g.pk); q.lineTo(X,y); } for(let Y=g.wallTop;Y<y;Y+=(y-g.wallTop)/3){ q.moveTo(g.x0,Y); q.lineTo(g.x1,Y); } q.stroke(); } /* a chocolate bar's squares */
    if(kind===2){ q.fillStyle=HK.n(o,HK.dk(c,.15)); for(let X=g.x0+W*.006;X<g.x1;X+=W*.012) for(let Y=g.wallTop+H*.01;Y<y;Y+=H*.02){ q.beginPath(); q.arc(X,Y,1.3,0,7); q.fill(); } } /* shortbread with fork pricks */
    q.restore(); q.strokeStyle=HK.n(o,'#fff6ee'); q.lineWidth=2.5; q.beginPath(); for(let X=g.x0;X<g.x1;X+=W*.006) q.lineTo(X,y-H*.012-H*.003*Math.sin(X*.8)); q.stroke(); /* icing piping along the base */
    for(const e of [g.x0,g.x1-W*.006]){ HK.rect(o,e,g.wallTop,W*.006,y-g.wallTop,'#fff6ee'); for(let Y=g.wallTop;Y<y;Y+=H*.012) HK.poly(o,[e,Y,e+W*.006,Y+H*.004,e+W*.006,Y+H*.008,e,Y+H*.004],'#d8303a'); } /* candy-cane corner posts */ },
  /* the roof: thick icing over the two slopes dripping past the eaves, gumdrops along the ridge; chocolate tiles or candy shingles under it */
  roof(o,g,kind,c){ const q=o.x, lit=HK.lit(o), ov=W*.014, L=g.x0-ov, R=g.x1+ov, eb=g.wallTop+ov*.9, th=Math.max(6,H*.016);
    const band=(col,t)=>{ q.strokeStyle=HK.n(o,col); q.lineWidth=t; q.lineJoin='round'; q.beginPath(); q.moveTo(L,eb); q.lineTo(g.mid,g.pk-th*.3); q.lineTo(R,eb); q.stroke(); q.lineJoin='miter'; };
    band(kind===1?'#5a3420':kind===2?'#f4a0b0':c,th*1.6); if(kind===2){ q.fillStyle=HK.n(o,'#a8e0c8'); for(let k=1;k<8;k++){ const u=k/8; q.beginPath(); q.arc(L+(g.mid-L)*u,eb+(g.pk-eb)*u,th*.35,0,7); q.fill(); q.beginPath(); q.arc(R-(R-g.mid)*u,eb+(g.pk-eb)*u,th*.35,0,7); q.fill(); } } /* candy shingles, or chocolate */
    q.fillStyle=HK.n(o,'#fff6ee'); for(const [a,b] of [[L,g.mid],[R,g.mid]]){ q.beginPath(); for(let u=0;u<=1.001;u+=.08){ const X=a+(b-a)*u, Y=eb+(g.pk-eb)*u-th*.7; q.lineTo(X,Y); } for(let u=1;u>=-.001;u-=.08){ const X=a+(b-a)*u, Y=eb+(g.pk-eb)*u+th*.1+(Math.sin(u*37)>.3?th*.9:0); q.lineTo(X,Y); } q.closePath(); q.fill(); } /* icing with drips */
    q.fillStyle=v3rgba('#ffffff',.5*lit); q.fillRect(L+(g.mid-L)*.2,eb+(g.pk-eb)*.2-th*.7,2,2);
    const gd=['#d8303a','#f0c020','#4ab04a','#a060d0','#ff8a3a']; for(let k=0;k<7;k++){ const u=(k+.5)/7, X=L+(R-L)*u, Y=X<g.mid?eb+(g.pk-eb)*((X-L)/(g.mid-L)):eb+(g.pk-eb)*((R-X)/(R-g.mid)); q.fillStyle=HK.n(o,gd[k%5]); q.beginPath(); q.ellipse(X,Y-th*.95,W*.003,H*.005,0,Math.PI,0); q.fill(); } /* gumdrops along the slopes */
    o.top=Math.min(o.top==null?o.dockY-H*.23:o.top,g.pk-H*.05); o.low=Math.max(o.low==null?-1e9:o.low,g.wallTop); },
  door(o,g,s,c){ const y=o.dockY, dw=g.w*.28, dx=g.mid-dw/2, dh=(y-g.wallTop)*.75, top=y-dh, q=o.x;
    if(s===0){ HK.rect(o,dx,top,dw,dh,c); q.strokeStyle=HK.n(o,HK.dk(c,.3)); q.lineWidth=1.2; q.beginPath(); for(let k=1;k<3;k++){ q.moveTo(dx+dw*k/3,top); q.lineTo(dx+dw*k/3,y); } for(let k=1;k<4;k++){ q.moveTo(dx,top+dh*k/4); q.lineTo(dx+dw,top+dh*k/4); } q.stroke(); } /* a chocolate bar */
    if(s===1){ q.fillStyle=HK.n(o,c); q.beginPath(); q.moveTo(dx,y); q.lineTo(dx,top+dw/2); q.arc(dx+dw/2,top+dw/2,dw/2,Math.PI,0); q.lineTo(dx+dw,y); q.closePath(); q.fill(); q.strokeStyle=HK.n(o,'#fff6ee'); q.lineWidth=3; q.stroke(); q.strokeStyle=HK.n(o,'#d8303a'); q.setLineDash([3,3]); q.stroke(); q.setLineDash([]); } /* an arch trimmed with candy cane */
    if(s===2){ HK.circ(o,dx+dw/2,y-dh*.45,dw*.55,c); for(let k=0;k<6;k++) HK.circ(o,dx+dw/2+Math.cos(k)*dw*.3,y-dh*.45+Math.sin(k*1.3)*dw*.3,1.5,'#5a3420'); } /* a round cookie with chocolate chips */
    HK.circ(o,dx+dw*.8,y-dh*.45,H*.003,'#f0c020'); },
  windows(o,g,s,c){ const cy=g.wallTop-(g.wallTop-g.pk)*.35, r=g.w*.1;
    if(s===0){ HK.circ(o,g.mid,cy,r+2,'#fff6ee'); HK.circ(o,g.mid,cy,r,'#d8303a'); for(let k=0;k<6;k++){ const a=k*Math.PI/3; HK.poly(o,[g.mid,cy,g.mid+Math.cos(a)*r,cy+Math.sin(a)*r,g.mid+Math.cos(a+.5)*r,cy+Math.sin(a+.5)*r],'#fff6ee'); } } /* a peppermint */
    if(s===1){ HK.rect(o,g.mid-r-2,cy-r-2,r*2+4,r*2+4,'#fff6ee'); HK.rect(o,g.mid-r,cy-r,r*2,r*2,v3rgba(c,.8)); HK.line(o,[g.mid,cy-r,g.mid,cy+r],'#fff6ee',2); HK.line(o,[g.mid-r,cy,g.mid+r,cy],'#fff6ee',2); o.lights.push({x:g.mid,y:cy,r:.07,a:.45,small:1,win:[r*2,r*2]}); } /* boiled-sugar glass */
    if(s===2){ HK.circ(o,g.mid,cy,r+2,'#fff6ee'); HK.circ(o,g.mid,cy,r,'#5a3420'); HK.line(o,[g.mid-r*.7,cy-r*.7,g.mid+r*.7,cy+r*.7],'#fff6ee',1.5); HK.line(o,[g.mid+r*.7,cy-r*.7,g.mid-r*.7,cy+r*.7],'#fff6ee',1.5); } /* iced lattice */ },
  /* around it: wafer posts into the soup, a giant fork standing in the soup with a cherry on a tine, a dollop of cream at the platter's edge */
  ground(o){ const y=o.dockY, wl=o.wl, q=o.x, N=c0=>HK.n(o,c0), fx=o.pw+W*.02;
    HK.rect(o,fx-W*.002,wl-H*.12,W*.004,H*.16,'#c8c8d0'); for(let k=0;k<4;k++) HK.rect(o,fx-W*.006+k*W*.004,wl-H*.17,W*.0018,H*.05,'#d8d8e0'); HK.rect(o,fx-W*.006,wl-H*.122,W*.014,H*.006,'#c8c8d0'); HK.circ(o,fx+W*.004,wl-H*.176,H*.008,'#c8102a'); HK.line(o,[fx+W*.004,wl-H*.184,fx+W*.008,wl-H*.2],'#4a7a2a',1.2); /* the giant fork */
    q.fillStyle=N('#fff6ee'); q.beginPath(); q.ellipse(o.pw-W*.012,y-H*.008,W*.012,H*.012,0,Math.PI,0); q.fill(); q.beginPath(); q.ellipse(o.pw-W*.012,y-H*.018,W*.006,H*.01,0,Math.PI,0); q.fill(); HK.line(o,[o.pw-W*.012,y-H*.028,o.pw-W*.009,y-H*.034],'#fff6ee',2); /* a dollop of whipped cream */ }
};
