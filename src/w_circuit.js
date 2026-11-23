// =====================================================================
// Circuit Lake: its whole scene in one file (Clean Scenes 5, 2026-11-22): the scene, then its extra life and its own moment
// (WA_MORE). Its colours (WA_PAL) and the newer waters' shared drawing helpers stay in cn_waterart.js.
// =====================================================================
V3SCENES.circuit={
  sky(P,t,hz){ const r=H*.06, x=W*.8, y=hz*.3; g.save(); g.globalAlpha=.55+.15*Math.sin(t*2); g.strokeStyle='#ff6ad8'; g.lineWidth=1.5; g.beginPath(); g.arc(x,y,r,0,7); g.stroke(); for(let i=-3;i<=3;i++){ g.beginPath(); g.moveTo(x-Math.sqrt(Math.max(0,r*r-(i*r/4)**2)),y+i*r/4); g.lineTo(x+Math.sqrt(Math.max(0,r*r-(i*r/4)**2)),y+i*r/4); g.globalAlpha=.25; g.stroke(); } g.restore(); },
  land(x,P,hz,cnv){ const r=v3rng(31), neon=['#3af0ff','#ff3ab8','#b8ff3a','#ffd03a'];
    /* map redo (Claude's review: "a wall of identical towers"): stepped tops, antenna masts with blinking-light caps, pyramid crowns and one
       twin-spire landmark, outlined in neon; a few towers carry glowing vertical signs */
    for(let i=0;i<22;i++){ const bw=W*(.03+r()*.035), bx=W*(i/21)-bw/2, bh=H*(.06+r()*.2), kind=Math.floor(r()*4), top=hz-bh, nc=neon[i%4]; x.fillStyle=mix('#140a24',P.far,.3); x.fillRect(bx,top,bw,bh);
      x.beginPath(); if(kind===1){ x.rect(bx+bw*.2,top-bh*.12,bw*.6,bh*.12); x.rect(bx+bw*.35,top-bh*.2,bw*.3,bh*.08); } if(kind===2){ x.moveTo(bx,top); x.lineTo(bx+bw/2,top-bh*.18); x.lineTo(bx+bw,top); } x.fill(); if(kind===3){ x.fillRect(bx+bw/2-1,top-bh*.3,2,bh*.3); x.fillStyle=v3rgba('#ff4a6a',.9); x.fillRect(bx+bw/2-1.5,top-bh*.3-2,3,3); }
      x.strokeStyle=v3rgba(nc,.55); x.lineWidth=1; x.strokeRect(bx+.5,top+.5,bw-1,bh-1);
      if(r()<.25){ x.fillStyle=v3rgba(neon[(i+1)%4],.75); x.fillRect(bx+bw*.15,top+bh*.15,bw*.18,bh*.5); }
      for(let wy=top+4;wy<hz-3;wy+=5) for(let wx=bx+2;wx<bx+bw-2;wx+=4) if(r()<.3){ x.fillStyle=v3rgba(neon[(i+wy|0)%4],.6); x.fillRect(wx,wy,2,2); } }
    { const lx=W*.44, lw=W*.05, lh=H*.3, top=hz-lh; x.fillStyle=mix('#1a0e30',P.far,.25); for(const dx of [0,lw*.62]){ x.fillRect(lx+dx,top,lw*.38,lh); x.beginPath(); x.moveTo(lx+dx,top); x.lineTo(lx+dx+lw*.19,top-H*.07); x.lineTo(lx+dx+lw*.38,top); x.closePath(); x.fill(); }
      x.fillRect(lx,top+lh*.35,lw,H*.01); x.strokeStyle=v3rgba('#3af0ff',.8); x.lineWidth=1.4; for(const dx of [0,lw*.62]){ x.beginPath(); x.moveTo(lx+dx,hz); x.lineTo(lx+dx,top); x.lineTo(lx+dx+lw*.19,top-H*.07); x.lineTo(lx+dx+lw*.38,top); x.lineTo(lx+dx+lw*.38,hz); x.stroke(); } }
    v3water(x,P,hz,cnv,.5);
    x.strokeStyle='rgba(58,240,255,.18)'; x.lineWidth=1; for(let i=0;i<12;i++){ const y=hz+(H-hz)*Math.pow(i/12,1.6); x.beginPath(); x.moveTo(0,y); x.lineTo(W,y); x.stroke(); } for(let i=-10;i<=10;i++){ x.beginPath(); x.moveTo(W/2+i*W*.02,hz); x.lineTo(W/2+i*W*.12,H); x.stroke(); } },
  live(P,t,hz,sun){ waMore('circuit','live',null,P,hz,t); if(!S.settings.effects) return; const neon=['#3af0ff','#ff3ab8','#b8ff3a'];
    for(let i=0;i<4;i++){ const q=((t*(.08+i*.02)+i*.25)%1), x=W*(-.05+q*1.1)*(i%2?1:-1)+(i%2?0:W), y=hz*(.45+i*.1); g.fillStyle=neon[i%3]; g.fillRect(x,y,6,2); v3glow(g,x+3,y+1,10,'rgba(255,255,255,.8)',.25); }
    for(let i=0;i<3;i++){ const on=Math.sin(t*(3+i)+i*2)>-.3; if(!on) continue; const x=W*(.15+i*.3), y=hz-H*(.12+i*.03); g.fillStyle=neon[i]; g.globalAlpha=.85; g.fillRect(x,y,W*.04,H*.008); g.globalAlpha=1; v3glow(g,x+W*.02,y,H*.04,'rgba(255,120,220,.6)',.25); } },
  fore(){ /* the two neon arcs cut off at the right edge are gone (Claude's review) */ },
};
WA_MORE.circuit={
    live(x,P,hz,t){ if(!S.settings.effects) return; const neon=['#3af0ff','#ff3ab8','#b8ff3a'];
      for(let i=0;i<14;i++){ const cx=W*((i*.0731+.03)%1), sp=.25+(i%4)*.08, q=((t*sp+i*.37)%1), y0=q*hz*1.1; for(let j=0;j<6;j++){ const y=y0-j*H*.018; if(y<0||y>hz) continue; g.fillStyle=v3rgba(neon[i%3],(1-j/6)*.5); g.fillRect(cx,y,2,H*.008); } }
      { const a=t*.35, cx=W*.3+Math.cos(a)*W*.08, cy=hz*.45+Math.sin(a*1.3)*hz*.06; for(let i=0;i<5;i++){ const dx=cx+(i-2)*H*.025, dy=cy+Math.abs(i-2)*H*.01; g.fillStyle='#1a1a2a'; g.fillRect(dx-3,dy-1,6,2); g.fillStyle=(Math.sin(t*5+i)>0)?'#ff4060':'#40ff80'; g.fillRect(dx-.8,dy+1,1.6,1.6); } }
      { const q=t%31; if(q<.4){ const r=v3rng(Math.floor(t*20)); for(let i=0;i<7;i++){ const y=r()*H, h=H*(.008+r()*.03); g.fillStyle=v3rgba(neon[i%3],.18+r()*.2); g.fillRect((r()-.5)*W*.06,y,W,h); } g.fillStyle='rgba(255,255,255,.06)'; g.fillRect(0,0,W,H); } } } };
