// =====================================================================
// STONEBROOK RIVER: THE MILL HOUSE (overnight, 2026-11-23; its own design, not the Rockies box). A two-storey stone mill house standing
// over the mill race: a stone arch at its foot with the river running through, a big dormer on the roof with a hoist beam and a sack on
// its rope, a steep roof, a chimney with smoke, a loading door upstairs and windows below; around it a stone retaining wall with steps
// down to the water, ferns and foxgloves, a mossy boulder. Parts: walls, roof, dormer, chimney, door, windows, seat.
// =====================================================================
const MH = {
  geo(o){ const C=BH.cab(o,{h:1.75,ratio:1.75}), wh=C.wh, x0=Math.max(C.x0,Math.max(HF.x0(),0)-W*.004), x1=Math.min(C.x1-W*.035,x0+wh*1.6), roofTop=C.wallTop-(x1-x0)*.32;
    return {x0,x1,vx:Math.max(x0,0),wallTop:C.wallTop,roofTop,wh,mid:(x0+x1)/2}; },
  /* the walls down to the water with the race arch at the foot; a string course between the floors */
  walls(o,g,kind,c){ const q=o.x, y=o.dockY, wl=o.wl, lit=HK.lit(o); q.save(); q.beginPath(); q.rect(g.x0,g.wallTop,g.x1-g.x0,wl-g.wallTop); q.clip(); BH.walls(o,{x0:g.x0,x1:g.x1,wallTop:g.wallTop,vx:g.x0},kind,c); q.restore();
    const fl=g.wallTop+(y-g.wallTop)*.48; HK.rect(o,g.x0,fl,g.x1-g.x0,H*.006,HK.dk(mix('#8a8478',c,.3),.15)); HK.rect(o,g.x0,fl,g.x1-g.x0,1,v3rgba('#ffffff',.18*lit)); /* string course between the floors */
    for(const e of [g.x0,g.x1-W*.006]) for(let yy=g.wallTop;yy<wl;yy+=H*.02) HK.rect(o,e,yy,W*.006,H*.018,HK.lt(mix('#bab2a2',c,.3),.05)); /* quoins at the corners */
    const ax=g.mid, aw=(g.x1-g.x0)*.34, at=y+HK.fh()+H*.006, ab=wl; q.fillStyle=HK.n(o,'#1a1a1e'); q.beginPath(); q.moveTo(ax-aw,ab); q.lineTo(ax-aw,at+aw*.6); q.quadraticCurveTo(ax,at-aw*.4,ax+aw,at+aw*.6); q.lineTo(ax+aw,ab); q.closePath(); q.fill(); /* the race arch */
    q.strokeStyle=HK.n(o,mix('#bab2a2',c,.3)); q.lineWidth=Math.max(3,H*.006); q.beginPath(); q.moveTo(ax-aw,at+aw*.6); q.quadraticCurveTo(ax,at-aw*.4,ax+aw,at+aw*.6); q.stroke(); for(let k=0;k<7;k++){ const t=k/6, px=ax-aw+aw*2*t, py=at+aw*.6-(aw*1.0)*4*t*(1-t)*.95; HK.line(o,[px,py-H*.004,px+(t-.5)*W*.004,py+H*.008],HK.dk(mix('#8a8478',c,.3),.2),1); } /* voussoirs */
    const rg=q.createLinearGradient(0,wl-H*.01,0,ab); rg.addColorStop(0,HK.n(o,'#3a5a62')); rg.addColorStop(1,HK.n(o,'#1a2a30')); q.fillStyle=rg; q.fillRect(ax-aw+2,wl-H*.004,aw*2-4,ab-wl+H*.004); HK.rect(o,ax-aw+2,wl-H*.004,aw*2-4,1.5,v3rgba('#e8f4f0',.4*lit+.08)); }, /* the river running through */
  /* the steep roof's near slope above the wall, eaves overhanging */
  roof(o,g,kind,c){ BH.roof(o,{x0:g.x0,x1:g.x1,vx:g.vx,wallTop:g.wallTop,roofTop:g.roofTop},kind,c); },
  /* the big dormer rising from the roof: a hoist beam with a pulley and a sack on its rope, a dormer window, or a pigeon loft */
  dormer(o,g,s,c,wallK,wallC,roofK,roofC){ const q=o.x, dw=(g.x1-g.x0)*.32, dx=g.mid-dw/2+(g.x1-g.x0)*.12, top=g.roofTop+(g.wallTop-g.roofTop)*.05, bot=g.wallTop+H*.004, ov=W*.006;
    q.save(); q.beginPath(); q.rect(dx,top,dw,bot-top); q.clip(); BH.walls(o,{x0:dx,x1:dx+dw,wallTop:top,vx:dx},wallK,wallC); q.restore();
    HK.poly(o,[dx-ov,top+H*.004,dx+dw/2,top-dw*.45,dx+dw+ov,top+H*.004,dx+dw+ov,top+H*.012,dx+dw/2,top-dw*.45+H*.008,dx-ov,top+H*.012],roofC); /* its gable roof */
    const ow=dw*.5, ox=dx+dw/2-ow/2, oy=top+(bot-top)*.25, oh=(bot-top)*.6;
    if(s===0){ HK.rect(o,ox,oy,ow,oh,'#1a1410'); for(let i=1;i<3;i++) HK.line(o,[ox+ow*i/3,oy,ox+ow*i/3,oy+oh],c,1); const by=top-dw*.12; HK.rect(o,dx+dw/2-2,by,dw*.9,Math.max(3,H*.005),c); HK.circ(o,dx+dw*1.32,by+H*.006,Math.max(2,H*.004),'#3a3a40'); const ry=g.wallTop+(o.dockY-g.wallTop)*.42; HK.line(o,[dx+dw*1.32,by+H*.008,dx+dw*1.32,ry],'#c8a878',1.2); HK.ell(o,dx+dw*1.32,ry+H*.012,W*.006,H*.014,mix('#e8dcc0',c,.15)); HK.rect(o,dx+dw*1.32-W*.004,ry,W*.008,H*.003,'#c8a878'); } /* a loading door, the hoist beam, its pulley, a flour sack on the rope */
    if(s===1){ HK.rect(o,ox-2,oy-2,ow+4,oh+4,c); HK.rect(o,ox,oy,ow,oh,'#2a3440'); HK.line(o,[ox+ow/2,oy,ox+ow/2,oy+oh],c,1.2); HK.line(o,[ox,oy+oh/2,ox+ow,oy+oh/2],c,1.2); o.lights.push({x:ox+ow/2,y:oy+oh/2,r:.08,a:.45,small:1,win:[ow,oh]}); }
    if(s===2){ for(let k=0;k<3;k++){ const hx=dx+dw*(.18+k*.3); HK.rect(o,hx-W*.003,oy+oh*.4,W*.006,oh*.4,'#1a1410'); HK.rect(o,hx-W*.005,oy+oh*.8,W*.01,2,c); } HK.circ(o,dx+dw*.7,top-H*.004,H*.004,'#d8d8dc'); HK.circ(o,dx+dw*.76,top-H*.006,H*.003,'#d8d8dc'); } /* pigeon holes with two doves on the ridge */
    o.top=Math.min(o.top==null?o.dockY-H*.23:o.top,top-dw*.5); },
  chimney(o,g,kind,c){ BH.chimney(o,{x1:g.x0+W*.055,roofTop:g.roofTop+H*.01,wallTop:g.wallTop},kind,c); },
  chimTop(g,kind){ return BH.chimTop({x1:g.x0+W*.055,roofTop:g.roofTop+H*.01},kind); },
  /* the ground: a stone retaining wall along the bank with steps down to the water, ferns and foxgloves, a mossy boulder */
  ground(o){ const x=o.x, y=o.dockY, wl=o.wl, x0=HF.x0(), N=c0=>HK.n(o,c0), lit=HK.lit(o), r=v3rng(41), xe=o.pw+W*.03, wt=y+HK.fh();
    { const bt=X=>y-H*.05+(X-x0)/(xe-x0)*H*.05+H*.004*Math.sin(X*.05); x.fillStyle=N('#4a6a3e'); x.beginPath(); x.moveTo(x0,wt); for(let X=x0;X<=xe;X+=4) x.lineTo(X,bt(X)); x.lineTo(xe,wt); x.closePath(); x.fill(); x.strokeStyle=N('#6a9a5e'); x.lineWidth=1; x.beginPath(); for(let X=x0;X<xe;X+=W*.003){ x.moveTo(X,bt(X)+1); x.lineTo(X+(r()-.5)*2,bt(X)-H*(.003+r()*.006)); } x.stroke(); x.fillStyle=N('#3e6034'); for(let i=0;i<8;i++){ const X=x0+(xe-x0)*r(); x.beginPath(); x.ellipse(X,bt(X),W*.008,H*.01,0,Math.PI,0); x.fill(); } } /* a low grassy bank with shrubs behind the wall top */
    x.save(); x.beginPath(); x.rect(x0,wt,xe-x0,wl-wt); x.clip(); for(let yy=wt,row=0;yy<wl;yy+=H*.012,row++){ for(let X=x0-(row%2)*W*.006;X<xe;){ const sw=W*(.008+r()*.008); x.fillStyle=N(['#a8a090','#8e887c','#b4ab98','#7e786e'][Math.floor(r()*4)]); x.fillRect(X+1,yy+1,sw-2,H*.012-2); X+=sw; } } x.restore(); /* the retaining wall of dressed stone */
    const sx=o.pw-W*.02; for(let k=0;k<5;k++){ const sy=wt+(wl-wt)*k/5; HK.rect(o,sx-W*.01+k*W*.006,sy,W*.02,(wl-wt)/5,'#c8c0ae'); HK.rect(o,sx-W*.01+k*W*.006,sy,W*.02,1.2,v3rgba('#ffffff',.3*lit)); } /* steps down to the water */
    x.fillStyle=N('#5a7a3a'); for(let i=0;i<10;i++){ const X=x0+(xe-x0)*r(); x.beginPath(); x.ellipse(X,wt+(wl-wt)*r()*.4,W*.005,H*.003,0,0,7); x.fill(); } /* moss in the joints */
    for(let i=0;i<9;i++){ const X=x0+(o.pw-x0)*(.1+i*.1)+(r()-.5)*W*.01, b=wt; x.strokeStyle=N('#4a7a3a'); x.lineWidth=1.2; x.beginPath(); for(let k=-3;k<=3;k++){ x.moveTo(X,b); x.quadraticCurveTo(X+k*H*.004,b-H*.012,X+k*H*.007,b-H*.006); } x.stroke(); if(i%3===1){ x.beginPath(); x.moveTo(X+H*.004,b); x.lineTo(X+H*.004,b-H*.03); x.stroke(); for(let k=0;k<6;k++) HK.ell(o,X+H*.006,b-H*(.012+k*.003),H*.002,H*.0025,['#c86aa8','#d88ac0'][k%2]); } } /* ferns and foxgloves along the top */
    HK.ell(o,xe-W*.008,wl-H*.006,W*.014,H*.012,'#8a8478'); HK.ell(o,xe-W*.01,wl-H*.014,W*.01,H*.004,'#5a7a3a'); /* a mossy boulder at the water */
    HK.rect(o,x0,wl-1,xe-x0,1.5,v3rgba('#e8f4f0',.3*lit+.05)); }
};
