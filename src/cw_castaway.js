// =====================================================================
// HOLLOW TRENCH: THE CASTAWAY RAFT (overnight, 2026-11-23; its own design, MAP_THEMES › Hollow Trench: castaway rafts, wreck salvage,
// bioluminescence). A raft of tarred barrels and salvaged planks lashed with frayed rope, floating over the abyss; its shelter the wrecked
// lifeboat of a lost ship turned upside down on props (clinker strakes, a keel, a half-worn name), or a sailcloth tent over an oar, or a
// crooked plank shack with a ship's porthole; glowing growth on the barrels below the waterline.
// Parts: raft, shelter, mast, salvage, lantern, seat. Raft, mast, salvage and lantern keep the old ids; the shelter is a new id.
// =====================================================================
const TR = {
  geo(o){ const x0=Math.max(HF.x0(),0)+W*.004, xe=o.pw+W*.006, y=o.dockY, wl=o.wl; return {x0,xe,y,wl,len:xe-x0}; },
  /* the raft: barrels under the deck, half sunk, with bands and glowing growth; planks or a door on top, rope lashings */
  raft(o,kind,c){ const q=o.x, g=TR.geo(o), y=g.y, wl=g.wl, th=HK.th(), lit=HK.lit(o);
    const nb=Math.max(3,Math.round(g.len/(W*.04))); for(let i=0;i<nb;i++){ const bx=g.x0+g.len*(i+.5)/nb, br=Math.min(W*.016,H*.03); for(let cy=wl;cy>y+th;cy-=br*1.7){ q.fillStyle=HK.n(o,cy===wl?'#4a3a2a':'#5a4632'); q.beginPath(); q.ellipse(bx,cy,br,br*.9,0,0,7); q.fill(); for(const k of [-.55,.55]) HK.rect(o,bx+br*k-1,cy-br*.9,2.5,br*1.8,'#5a5a5a'); } /* barrels stacked from the deck down into the water */ q.fillStyle=v3rgba('#5afff0',.35+.25*(1-lit)); for(let m=0;m<4;m++){ q.beginPath(); q.arc(bx+(m-1.5)*br*.4,wl+br*.5,H*.0025,0,7); q.fill(); } }
    q.fillStyle=v3rgba(o.P.wMid||'#123a44',.6); q.fillRect(g.x0-W*.01,wl+H*.002,g.len+W*.02,H*.03); /* the barrels' lower halves seen through the black water */
    if(kind===2){ HK.rect(o,g.x0,y-th*.2,g.len,th*1.2,c); HK.rect(o,g.x0+g.len*.15,y+th*.1,g.len*.25,th*.4,HK.dk(c,.3)); HK.rect(o,g.x0+g.len*.6,y+th*.1,g.len*.25,th*.4,HK.dk(c,.3)); HK.circ(o,g.x0+g.len*.08,y+th*.4,H*.003,'#a8884a'); } /* an old cabin door, its panels and knob */
    else { const pw=kind===1?W*.02:W*.012; for(let X=g.x0,i=0;X<g.xe;X+=pw,i++) HK.rect(o,X,y-th*.2+(i%3)*1,pw-1.5,th*1.2,i%2?c:HK.dk(c,.12)); }
    for(let X=g.x0+W*.03;X<g.xe;X+=W*.06){ HK.line(o,[X,y-th*.3,X+W*.004,wl-H*.004],'#9a8868',1.4); } HK.rect(o,g.x0,y-th*.3,g.len,1.2,v3rgba('#ffffff',.1*lit)); /* rope lashings */
    o.low=Math.max(o.low==null?-1e9:o.low,y-H*.004); },
  /* the shelter */
  shelter(o,s,c){ const q=o.x, g=TR.geo(o), y=g.y, a=g.x0+W*.004, w=Math.min(g.len*.5,W*.11), b=a+w, top=y-H*.09;
    if(s===0){ for(const px of [a+w*.12,a+w*.88]) HK.rect(o,px-1.5,top+H*.02,3,y-top-H*.02,'#3a3028'); q.fillStyle=HK.n(o,'#1a1410'); q.fillRect(a+w*.1,top+H*.03,w*.8,y-top-H*.03);
      q.fillStyle=HK.n(o,c); q.beginPath(); q.moveTo(a-W*.008,top+H*.035); q.quadraticCurveTo(a-W*.004,top-H*.01,a+w*.2,top-H*.016); q.lineTo(b-w*.15,top-H*.016); q.quadraticCurveTo(b+W*.012,top-H*.012,b+W*.014,top+H*.035); q.closePath(); q.fill(); /* the upturned lifeboat */
      q.strokeStyle=HK.n(o,HK.dk(c,.3)); q.lineWidth=1; q.beginPath(); for(let k=1;k<4;k++){ const yy=top-H*.016+k*H*.012; q.moveTo(a-W*.004+k*W*.001,yy); q.lineTo(b+W*.01-k*W*.001,yy); } q.stroke(); HK.rect(o,a+w*.15,top-H*.022,w*.75,H*.006,'#3a3028'); /* clinker strakes and the keel */
      q.fillStyle=HK.n(o,v3rgba('#f0e8d8',.5)); q.font='bold '+Math.round(H*.009)+'px sans-serif'; q.fillText('..ANTIS',a+w*.35,top+H*.024); o.top=Math.min(o.top==null?y-H*.23:o.top,top-H*.04); }
    if(s===1){ const ox=a+w*.5, ot=y-H*.11; HK.line(o,[ox,y,ox,ot],'#6a5a48',2); q.fillStyle=HK.n(o,c); q.beginPath(); q.moveTo(a-W*.004,y); q.lineTo(ox,ot+H*.004); q.lineTo(b+W*.004,y); q.closePath(); q.fill(); q.strokeStyle=HK.n(o,HK.dk(c,.25)); q.lineWidth=1; q.beginPath(); q.moveTo(a+w*.3,y-H*.02); q.lineTo(a+w*.4,y-H*.06); q.moveTo(b-w*.25,y-H*.01); q.lineTo(b-w*.32,y-H*.05); q.stroke(); HK.poly(o,[ox-W*.006,y,ox,y-H*.05,ox+W*.006,y],'#1a1410'); HK.rect(o,ox-W*.004,ot-H*.012,W*.008,H*.012,'#6a5a48'); } /* sailcloth over an oar, patched seams, the oar's blade up top */
    if(s===2){ q.save(); for(let k=0;k<5;k++){ const px=a+k*w/5; HK.rect(o,px,top+(k%2)*H*.004,w/5-1,y-top-(k%2)*H*.004,k%2?c:HK.dk(c,.15)); } q.restore(); HK.poly(o,[a-W*.006,top+H*.006,b+W*.008,top-H*.006,b+W*.008,top+H*.002,a-W*.006,top+H*.014],'#3a3028'); HK.circ(o,a+w*.62,top+H*.04,H*.012,'#a8884a'); HK.circ(o,a+w*.62,top+H*.04,H*.008,'#1a2a30'); HK.rect(o,a+w*.15,top+H*.03,w*.2,y-top-H*.03,'#1a1410'); } /* a crooked plank shack with a ship's porthole */ }
};
