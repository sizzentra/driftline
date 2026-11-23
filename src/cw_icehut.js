// =====================================================================
// FROSTBITE LAKE: THE ICE SHANTY (overnight, 2026-11-23; its own design, MAP_THEMES › Frostbite: Minnesota and Finnish ice-fishing houses).
// A small timber fish house standing on the ice on two sled skids (so it can be dragged off the lake in spring), seen from its long side:
// a steep gable roof under a thick cap of snow with icicles along the eaves, a stovepipe with smoke, a window glowing warm at night; around it
// the ice shelf with snowdrifts banked against the walls, footprints, a tip-up flag over its hole and a box sled.
// Parts: walls, roof, chimney, door, windows, gear, seat.
// =====================================================================
const FS = {
  geo(o){ const C=BH.cab(o,{h:1.15,ratio:1.6}), wh=C.wh, x0=Math.max(HF.x0(),0)+W*.004, w=Math.min(wh*1.7,o.pw*.4), x1=x0+w, sk=H*.012, wallTop=C.wallTop-sk, base=o.dockY-sk;
    return {x0,x1,vx:x0,w,wh,sk,base,wallTop,roofTop:wallTop-w*.3,mid:(x0+x1)/2}; },
  /* the skids under the floor: two runners with curled fronts, resting on the snow */
  skids(o,g){ const y=o.dockY, q=o.x; HK.rect(o,g.x0-W*.002,g.base,g.w+W*.004,g.sk*.45,'#4a3428'); q.strokeStyle=HK.n(o,'#3a2a20'); q.lineWidth=Math.max(3,g.sk*.5); q.lineCap='round'; q.beginPath(); q.moveTo(g.x0+W*.004,y-g.sk*.25); q.lineTo(g.x1+W*.004,y-g.sk*.25); q.quadraticCurveTo(g.x1+W*.014,y-g.sk*.25,g.x1+W*.014,y-g.sk*1.1); q.stroke(); q.lineCap='butt';
    for(const f of [.15,.5,.85]) HK.rect(o,g.x0+g.w*f-1.5,g.base,3,g.sk*.8,'#3a2a20'); },
  walls(o,g,kind,c){ BH.walls(o,{x0:g.x0,x1:g.x1,vx:g.x0,wallTop:g.wallTop},kind,c); const q=o.x; for(const e of [g.x0,g.x1-W*.004]) HK.rect(o,e,g.wallTop,W*.004,g.base-g.wallTop,HK.dk(c,.3)); /* corner boards */
    HK.rect(o,g.x0,g.base-H*.004,g.w,H*.004,HK.dk(c,.35)); },
  /* a steep gable roof seen from the long side: the near slope as a band, a thick snow cap with soft drifts and icicles along the eave */
  roof(o,g,kind,c){ const q=o.x, lit=HK.lit(o), ov=W*.01, eb=g.wallTop+H*.004, L=g.x0-ov, R=g.x1+ov, col=kind===2?mix('#c8b890',c,.4):c;
    q.fillStyle=HK.n(o,col); q.beginPath(); q.moveTo(L,eb); q.lineTo(L+W*.01,g.roofTop); q.lineTo(R-W*.01,g.roofTop); q.lineTo(R,eb); q.closePath(); q.fill();
    q.save(); q.clip(); q.strokeStyle=HK.n(o,HK.dk(col,.3)); q.lineWidth=1; q.beginPath();
    if(kind===0) for(let X=L;X<R;X+=W*.006){ q.moveTo(X,g.roofTop); q.lineTo(X,eb); } else if(kind===1) for(let Y=g.roofTop;Y<eb;Y+=H*.007){ q.moveTo(L,Y); q.lineTo(R,Y); } else { for(let X=L+W*.02;X<R;X+=W*.04){ q.moveTo(X,g.roofTop); q.lineTo(X,eb); } } q.stroke(); q.restore(); /* tin seams, shingle rows, canvas panels */
    const sy=g.roofTop, sd=(eb-g.roofTop)*1.75; q.fillStyle=HK.n(o,'#f6f8ff'); q.beginPath(); q.moveTo(L-W*.002,eb-sd*.35); q.lineTo(L+W*.01,sy-H*.012); for(let X=L+W*.01;X<=R-W*.01;X+=W*.01) q.lineTo(X,sy-H*.012-H*.004*Math.sin(X*.09)); q.lineTo(R-W*.01,sy-H*.012); q.lineTo(R+W*.002,eb-sd*.35); for(let X=R;X>=L;X-=W*.008) q.lineTo(X,eb-sd*.35+H*.006*Math.abs(Math.sin(X*.13))); q.closePath(); q.fill(); /* the snow cap */
    q.fillStyle=HK.n(o,'#b8c8e4'); q.fillRect(L,eb-sd*.35+H*.004,R-L,H*.003); q.fillStyle=v3rgba('#ffffff',.5*lit); q.fillRect(L+W*.01,sy-H*.012,R-L-W*.02,1.5);
    q.fillStyle=v3rgba('#e8f4ff',.85); for(let X=L+W*.004,i=0;X<R;X+=W*.007,i++){ const ih=H*(.006+((i*37)%7)*.002); q.beginPath(); q.moveTo(X-W*.0015,eb); q.lineTo(X+W*.0015,eb); q.lineTo(X,eb+ih); q.closePath(); q.fill(); } /* icicles */
    o.top=Math.min(o.top==null?o.dockY-H*.23:o.top,g.roofTop-H*.08); o.low=Math.max(o.low==null?-1e9:o.low,eb); },
  chimney(o,g,kind,c){ const px=g.x1-g.w*.22, top=g.roofTop-H*(kind===1?.05:.04); HK.rect(o,px-W*.003,top,W*.006,g.roofTop-top+H*.02,c); HK.rect(o,px-W*.0035,top+H*.01,W*.007,2,HK.dk(c,.3));
    if(kind===1){ HK.rect(o,px-W*.0045,top-H*.006,W*.009,H*.006,c); HK.poly(o,[px-W*.006,top-H*.006,px+W*.006,top-H*.006,px,top-H*.016],HK.dk(c,.2)); } /* a spark arrestor and rain cap */
    if(kind===2){ HK.rect(o,px-W*.003,top,W*.012,W*.006,c); HK.rect(o,px+W*.003,top-H*.02,W*.006,H*.02,c); } /* an elbow pipe */ },
  chimTop(g,kind){ const px=g.x1-g.w*.22; return kind===2?[px+W*.006,g.roofTop-H*.06]:[px,g.roofTop-H*(kind===1?.068:.044)]; },
  /* the ice around the shanty: drifts banked against the walls, footprints, a tip-up flag over its hole, a box sled */
  ground(o){ const y=o.dockY, q=o.x, N=c0=>HK.n(o,c0), g=FS.geo(o), r=v3rng(19);
    q.fillStyle=N('#f6f8ff'); q.beginPath(); q.moveTo(g.x0-W*.02,y); q.quadraticCurveTo(g.x0-W*.004,y-H*.03,g.x0+W*.012,y-H*.008); q.lineTo(g.x0+W*.012,y); q.closePath(); q.fill(); q.beginPath(); q.moveTo(g.x1-W*.006,y); q.quadraticCurveTo(g.x1+W*.002,y-H*.022,g.x1+W*.02,y); q.closePath(); q.fill(); /* drifts */
    q.fillStyle=N('#b8c4e4'); for(let i=0;i<9;i++){ const fx=g.x1+W*.04+i*(o.pw-g.x1-W*.05)/9, fy=y-H*.002+(i%2)*H*.002; q.beginPath(); q.ellipse(fx,fy,W*.003,H*.0015,0,0,7); q.fill(); } /* footprints to the hole */
    const hx=o.pw-W*.006; HK.ell(o,hx,y+H*.001,W*.008,H*.0025,'#1a2a4a'); HK.line(o,[hx+W*.004,y,hx+W*.004,y-H*.034],'#4a4440',1.4); HK.poly(o,[hx+W*.004,y-H*.034,hx+W*.016,y-H*.03,hx+W*.004,y-H*.024],'#d8383a'); HK.line(o,[hx-W*.006,y-H*.002,hx+W*.012,y-H*.002],'#5a4a3a',1.6); /* the tip-up over its hole, flag up */
    const sx=g.x1+W*.034, sc=HF.sc()*.8; HK.curve(o,sx-2*sc,y-.5*sc,sx+12*sc,y+.6*sc,sx+20*sc,y-4*sc,'#4a4440',1.4*sc); HK.block(o,sx,y-11*sc,17*sc,8*sc,'#b8383a'); for(let k=1;k<4;k++) HK.line(o,[sx+k*17*sc/4,y-11*sc,sx+k*17*sc/4,y-3*sc],'#7a2428',.8); HK.rect(o,sx,y-11.5*sc,17*sc,1.5*sc,'#f6f8ff'); /* the box sled, a little snow on its load */ }
};
