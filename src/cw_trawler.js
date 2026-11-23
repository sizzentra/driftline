// =====================================================================
// MIDNIGHT DEEP: THE TRAWLER (overnight, 2026-11-23; its own design, MAP_THEMES › Midnight Deep: North Atlantic and Bering Sea trawlers).
// The working stern of a steel trawler rolling in heavy swell, seen from the side: a deep, blunt hull with a high bulwark pierced by freeing
// ports, rust streaks running from them, old tyres hung as fenders, a towering wheelhouse forward with a row of dark windows and a radar or
// antenna mast; on the work deck a net drum wound with green net and orange floats, a stern gantry with a trawl door hanging, or stacked crab
// pots. The ids are the old trawler's, so saved choices still fit. Parts: hull, wheelhouse, trawl gear, mast, floodlight, seat.
// =====================================================================
const MT = {
  geo(o){ const xs=o.pw+W*.008, x0=Math.min(HF.x0(),0)-W*.02, y=o.dockY, wl=o.wl, bw=H*.034; return {x0,xs,y,wl,bw,len:xs-x0,h0:Math.max(HF.x0(),0)+W*.006}; },
  hull(o,kind,c){ const q=o.x, g=MT.geo(o), lit=HK.lit(o), y=g.y, wl=g.wl, top=y-g.bw, bot=wl+H*.03;
    q.save(); q.beginPath(); q.moveTo(g.x0,top-H*.01); q.lineTo(g.xs-W*.01,top); q.lineTo(g.xs,top+H*.01); q.lineTo(g.xs-W*.006,bot); q.lineTo(g.x0,bot+H*.01); q.closePath();
    q.fillStyle=HK.n(o,kind===2?'#5a4030':c); q.fill(); q.clip();
    if(kind===2){ q.strokeStyle=HK.n(o,'#3a2a1c'); q.lineWidth=1; q.beginPath(); for(let Y=top+H*.01;Y<y;Y+=H*.008){ q.moveTo(g.x0,Y); q.lineTo(g.xs,Y); } q.stroke(); q.fillStyle=HK.n(o,c); q.fillRect(g.x0,y,g.len,bot-y); } /* a wooden bulwark on a steel hull */
    q.fillStyle=HK.n(o,'#8a2a22'); q.fillRect(g.x0,wl-H*.006,g.len+W*.01,H*.04); q.fillStyle=HK.n(o,HK.lt(c,.1)); q.fillRect(g.x0,y-H*.003,g.len,H*.004); /* red antifouling, the deck line */
    const rs=kind===1?.55:.25; for(let X=g.x0+W*.02;X<g.xs-W*.01;X+=W*.03){ HK.rect(o,X,top+H*.012,W*.012,H*.01,'#1a1c20'); const rg=q.createLinearGradient(0,top+H*.022,0,wl); rg.addColorStop(0,v3rgba('#8a4a2a',rs+.15)); rg.addColorStop(1,v3rgba('#8a4a2a',0)); q.fillStyle=rg; q.fillRect(X+W*.003,top+H*.022,W*.005,wl-top-H*.03); } /* freeing ports and rust streaks */
    q.fillStyle=v3rgba(o.P.wMid||'#2a4256',.6); q.fillRect(g.x0-2,wl,g.len+W*.02,H*.05); q.restore();
    HK.rect(o,g.x0,top-H*.012,g.len-W*.01,H*.005,HK.dk(c,.3)); /* bulwark cap */
    for(let X=g.x0+W*.05;X<g.xs-W*.02;X+=W*.06){ HK.line(o,[X,top-H*.008,X,y+H*.012],'#2a2a2e',1); HK.ell(o,X,y+H*.026,W*.008,H*.014,'#1a1a1c'); HK.ell(o,X,y+H*.026,W*.004,H*.007,'#3a3a3e'); } /* old tyres hung as fenders */
    q.fillStyle=HK.n(o,'#f4eccc'); q.font='bold '+Math.round(H*.012)+'px sans-serif'; q.fillText('NORTHERN STAR  KR-114',g.xs-W*.15,(y+wl)/2+H*.012);
    o.low=Math.max(o.low==null?-1e9:o.low,y-H*.004); },
  /* the wheelhouse forward: a towering boxy house with a row of dark raked windows, a low pilothouse, or an open helm with a spray screen */
  house(o,s,c){ const g=MT.geo(o), y=g.y-g.bw, a=g.h0, q=o.x;
    if(s===0){ const ht=y-H*.14, b=a+W*.09; HK.block(o,a-W*.02,ht,b-a+W*.02,y-ht,c); HK.rect(o,a-W*.02,ht-H*.008,b-a+W*.03,H*.008,HK.dk(c,.3)); for(let k=0;k<4;k++){ HK.poly(o,[a-W*.014+k*W*.026,ht+H*.012,a+W*.006+k*W*.026,ht+H*.012,a+W*.008+k*W*.026,ht+H*.04,a-W*.012+k*W*.026,ht+H*.04],'#1a2028'); } HK.rect(o,a+W*.03,ht+H*.06,W*.016,y-ht-H*.06,HK.dk(c,.25)); HK.circ(o,a+W*.06,ht+H*.08,H*.008,'#1a2028'); o.top=Math.min(o.top==null?g.y-H*.23:o.top,ht-H*.02); }
    if(s===1){ const ht=y-H*.08, b=a+W*.1; HK.block(o,a-W*.02,ht,b-a+W*.02,y-ht,c); for(let k=0;k<3;k++) HK.rect(o,a-W*.01+k*W*.032,ht+H*.014,W*.02,H*.022,'#1a2028'); HK.rect(o,a-W*.02,ht-H*.006,b-a+W*.03,H*.006,HK.dk(c,.3)); }
    if(s===2){ HK.rect(o,a,y-H*.05,W*.05,H*.006,c); HK.poly(o,[a,y-H*.05,a+W*.012,y-H*.08,a+W*.05,y-H*.08,a+W*.05,y-H*.05],v3rgba('#9ab0c0',.5)); { q.strokeStyle=HK.n(o,'#2a2e34'); q.lineWidth=2; q.beginPath(); q.arc(a+W*.03,y-H*.03,H*.012,0,7); q.stroke(); } } },
  gear(o,s,c){ const g=MT.geo(o), y=g.y-g.bw*.3, x=g.h0+W*.095, q=o.x;
    if(s===0){ const r=H*.03; HK.rect(o,x-W*.002,y-r*2.2,W*.004,r*2.2,'#3a424c'); HK.rect(o,x+W*.04,y-r*2.2,W*.004,r*2.2,'#3a424c'); q.fillStyle=HK.n(o,c); q.beginPath(); q.ellipse(x+W*.021,y-r*1.4,W*.02,r,0,0,7); q.fill(); q.strokeStyle=HK.n(o,HK.dk(c,.3)); q.lineWidth=1; q.beginPath(); for(let k=-3;k<=3;k++){ q.moveTo(x+W*.004,y-r*1.4+k*r*.28); q.lineTo(x+W*.038,y-r*1.4+k*r*.28); } q.stroke(); for(let k=0;k<5;k++) HK.circ(o,x+W*.006+k*W*.0075,y-r*(1.4+.6*Math.sin(k)),H*.004,'#e85a2a'); } /* the net drum wound with net and floats */
    if(s===1){ const gx=g.xs-W*.03, gt=y-H*.2; HK.line(o,[gx-W*.03,y,gx-W*.01,gt],'#f0782a',3); HK.line(o,[gx+W*.004,y,gx-W*.006,gt],'#f0782a',3); HK.line(o,[gx-W*.012,gt,gx+W*.01,gt+H*.006],'#f0782a',3); HK.line(o,[gx+W*.008,gt+H*.006,gx+W*.008,gt+H*.07],'#8a8a8a',1); HK.poly(o,[gx,gt+H*.07,gx+W*.016,gt+H*.07,gx+W*.014,gt+H*.11,gx+W*.002,gt+H*.11],c); HK.rect(o,gx+W*.004,gt+H*.08,W*.008,H*.004,'#1a1c20'); o.top=Math.min(o.top==null?g.y-H*.23:o.top,gt-H*.02); } /* the stern gantry with a trawl door hanging */
    if(s===2) for(let r=0;r<3;r++) for(let k=0;k<3-r;k++){ const px=x+k*W*.022+r*W*.011, py=y-(r+1)*H*.024; HK.rect(o,px,py,W*.02,H*.022,'#3a424c'); q.strokeStyle=HK.n(o,c); q.lineWidth=1; q.beginPath(); for(let m=1;m<4;m++){ q.moveTo(px+W*.005*m,py); q.lineTo(px+W*.005*m,py+H*.022); } q.moveTo(px,py+H*.011); q.lineTo(px+W*.02,py+H*.011); q.stroke(); } /* steel crab pots, stacked */ },
  mast(o,s,c){ if(!s) return; const g=MT.geo(o), a=g.h0+W*.03, base=g.y-g.bw-H*.14, top=base-H*.12;
    HK.rect(o,a-1.5,top,3,base-top,c); if(s===1){ HK.line(o,[a,top+H*.02,a+W*.08,g.y-g.bw-H*.02],c,2); HK.line(o,[a,top,a+W*.08,g.y-g.bw-H*.02],'#8a8a8a',.8); } if(s===2){ HK.rect(o,a-W*.012,top+H*.01,W*.024,H*.006,'#2a2e34'); HK.rect(o,a-W*.004,top-H*.006,W*.008,H*.006,c); } if(s===3){ for(let k=0;k<3;k++) HK.line(o,[a-W*.006+k*W*.006,top-H*.04+k*H*.01,a-W*.006+k*W*.006,top],'#8a8a8a',1); HK.rect(o,a-W*.01,top+H*.02,W*.02,H*.003,c); }
    o.top=Math.min(o.top==null?g.y-H*.23:o.top,top-H*.05); }
};
