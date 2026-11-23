// =====================================================================
// Corporate Pond: its whole scene in one file (Clean Scenes 5, 2026-11-22): the scene, then its extra life and its own moment
// (WA_MORE). Its colours (WA_PAL) and the newer waters' shared drawing helpers stay in cn_waterart.js.
// =====================================================================
V3SCENES.corporate={
  land(x,P,hz,cnv){ const r=v3rng(9);
    /* map redo (Claude's review: "a flat wall of identical grey blocks"): every tower its own silhouette, stepped setbacks, a spire, a
       slanted crown, a round top or a water tank on the roof, glass bands on some; one landmark tower carries the fish company's sign */
    for(let layer=0;layer<2;layer++) for(let i=0;i<14;i++){ const bw=W*(.04+r()*.04), bx=W*(i/13)-bw/2+(r()-.5)*W*.03, bh=H*(layer?(.08+r()*.14):(.1+r()*.2)), col=layer?mix(P.front,'#9ab0c8',.3*(1-P.night)):mix(P.far,P.farHaze,.4), kind=Math.floor(r()*5), top=hz-bh;
      x.fillStyle=col; x.fillRect(bx,top,bw,bh);
      if(kind===1){ x.fillRect(bx+bw*.15,top-bh*.18,bw*.7,bh*.18); x.fillRect(bx+bw*.3,top-bh*.3,bw*.4,bh*.12); }
      if(kind===2){ x.beginPath(); x.moveTo(bx,top); x.lineTo(bx+bw/2,top-bh*.22); x.lineTo(bx+bw,top); x.closePath(); x.fill(); x.fillRect(bx+bw/2-1,top-bh*.38,2,bh*.16); }
      if(kind===3){ x.beginPath(); x.moveTo(bx,top); x.lineTo(bx+bw,top-bh*.14); x.lineTo(bx+bw,top); x.closePath(); x.fill(); }
      if(kind===4){ x.beginPath(); x.arc(bx+bw/2,top,bw/2,Math.PI,0); x.fill(); }
      if(kind===0&&layer){ x.fillRect(bx+bw*.6,top-H*.012,bw*.22,H*.012); x.fillRect(bx+bw*.62,top-H*.016,bw*.18,H*.004); }
      x.fillStyle=v3rgba(layer?'#cfe0f0':'#e0ecf8',.12*(1-P.night)); x.fillRect(bx+bw*.55,top,bw*.45,bh);
      if(layer&&r()<.4){ x.fillStyle=v3rgba('#9ad0f0',.18*(1-P.night*.7)); for(let gy=top+H*.006;gy<hz-4;gy+=H*.018) x.fillRect(bx,gy,bw,H*.006); }
      if(layer){ const lit=P.night>.3; for(let wy=top+4;wy<hz-4;wy+=6) for(let wx=bx+3;wx<bx+bw-3;wx+=5) if(r()<(lit?.45:.15)){ x.fillStyle=lit?'rgba(255,224,150,.85)':'rgba(220,235,250,.35)'; x.fillRect(wx,wy,2.4,3); } } }
    { const lx=W*.56, lw=W*.06, lh=H*.27, top=hz-lh; x.fillStyle=mix(mix(P.front,'#3a4a5a',.4),'#0a0e18',P.night*.3); x.fillRect(lx,top,lw,lh); x.beginPath(); x.moveTo(lx,top); x.lineTo(lx+lw*.5,top-H*.03); x.lineTo(lx+lw,top); x.closePath(); x.fill();
      const sg=mix('#5ad8ff','#ffffff',.2), sy=top+H*.02; x.fillStyle=v3rgba(sg,.85); x.beginPath(); x.ellipse(lx+lw*.42,sy,lw*.22,H*.008,0,0,7); x.fill(); x.beginPath(); x.moveTo(lx+lw*.62,sy); x.lineTo(lx+lw*.8,sy-H*.008); x.lineTo(lx+lw*.8,sy+H*.008); x.closePath(); x.fill(); x.fillStyle='#ffffff'; x.fillRect(lx+lw*.26,sy-1,2,2); }
    x.fillStyle=mix('#1a2028',P.front,.3); x.fillRect(0,hz-H*.03,W,H*.012); /* the ticker band (text drawn live) */
    v3water(x,P,hz,cnv,.45); },
  live(P,t,hz,sun){ waMore('corporate','live',null,P,hz,t); v3glitter(P,t,hz,sun); const y=hz-H*.03, txt='DRFT ▲2.4%  KOI ▼0.8%  TUNA ▲11.2%  CARP ▲0.3%  BASS ▼1.9%  SNAPR ▲4.0%  EEL ▲6.6%  ', fs=Math.max(8,H*.011);
    g.save(); g.beginPath(); g.rect(0,y,W,H*.012); g.clip(); g.font='700 '+fs+'px system-ui'; g.textBaseline='middle'; const tw=g.measureText(txt).width||1, off=-(t*40)%tw; for(let k=0;off+k*tw<W;k++){ let xx=off+k*tw; for(const part of txt.split('  ')){ g.fillStyle=/▼/.test(part)?'#ff6a5a':'#5aff8a'; g.fillText(part,xx,y+H*.006); xx+=g.measureText(part+'  ').width; } } g.restore(); },
  fore(P,t){ g.save(); const x=W*.95, b=H-H*.035; /* the pot stands on a concrete planter ledge along the waterfront (it floated in the water) */ g.fillStyle=mix('#a8acb4',P.top,P.night*.5); g.fillRect(W*.86,b,W*.15,H*.04); g.fillStyle=mix('#c8ccd4',P.top,P.night*.5); g.fillRect(W*.86,b,W*.15,H*.006); g.fillStyle=mix('#d8d8dc',P.top,P.night*.5); g.beginPath(); g.moveTo(x-H*.04,b); g.lineTo(x-H*.032,b-H*.07); g.lineTo(x+H*.032,b-H*.07); g.lineTo(x+H*.04,b); g.fill();
    g.fillStyle=mix('#3a8a4a',P.top,P.night*.5); for(let i=0;i<7;i++){ const a=-Math.PI/2+(i-3)*.32+Math.sin(t*.6+i)*.04; g.beginPath(); g.ellipse(x+Math.cos(a)*H*.06,b-H*.07+Math.sin(a)*H*.06,H*.05,H*.012,a,0,7); g.fill(); } g.restore(); }
};
WA_MORE.corporate={
    live(x,P,hz,t){ const FX=S.settings.effects, fx=W*.62, fy=hz+H*.13;
      /* map standard (2026-11-21), life by day: pigeons strut along the top of the ticker band, pecking, now and then turning round */
      if(P.night<.6) for(let i=0;i<3;i++){ const s=H*.0065, seg=Math.floor(t*.12+i*1.7), r=v3rng(seg*17+i), dir=r()<.5?1:-1, px=W*(.18+i*.27)+Math.sin(t*.12+i*1.7)*W*.03, py=hz-H*.03, peck=Math.max(0,Math.sin(t*3+i*2))>.85?s*.5:0, N=c0=>mix(c0,P.front,.2+P.night*.5);
        g.save(); g.translate(px,py); g.scale(dir,1); g.fillStyle=N('#5e6474'); g.beginPath(); g.ellipse(0,-s*1.1,s*1.3,s*.75,-.15,0,7); g.fill(); g.beginPath(); g.moveTo(-s*1.1,-s*1); g.lineTo(-s*2,-s*.8); g.lineTo(-s*1.1,-s*.6); g.fill();
        g.fillStyle=N('#3e4456'); g.beginPath(); g.arc(s*1.05,-s*1.75+peck,s*.48,0,7); g.fill(); g.fillStyle=N('#e8b080'); g.fillRect(s*1.45,-s*1.75+peck,s*.4,1.2); g.fillStyle=N('#5a8a7a'); g.fillRect(s*.6,-s*1.45+peck*.5,s*.6,s*.3);
        g.strokeStyle=N('#d07060'); g.lineWidth=1; g.beginPath(); g.moveTo(-s*.2,-s*.4); g.lineTo(-s*.2,0); g.moveTo(s*.3,-s*.4); g.lineTo(s*.3,0); g.stroke(); g.restore(); }
      g.fillStyle=mix('#c8ccd4',P.wMid,.2+P.night*.5); g.beginPath(); g.ellipse(fx,fy,H*.03,H*.008,0,0,7); g.fill();
      if(FX){ g.fillStyle='rgba(230,245,255,.7)'; for(let i=0;i<16;i++){ const q=((t*.9+i/16)%1), a=(i/16-.5)*1.4, px=fx+Math.sin(a)*q*H*.05, py=fy-Math.sin(q*Math.PI)*H*.06*(1-Math.abs(a)*.4); g.fillRect(px,py,1.6,1.6); } }
      { const q=(t%25)/25; if(q<.3){ const e=q/.3, px=W*(.2+e*.55), py=hz*.35+e*hz*.5+Math.sin(e*12)*H*.012, s=H*.014; g.save(); g.translate(px,py); g.rotate(.25+Math.cos(e*12)*.25); g.fillStyle='#f8f8f4'; g.beginPath(); g.moveTo(s*1.6,0); g.lineTo(-s,-s*.6); g.lineTo(-s*.6,0); g.lineTo(-s,s*.4); g.closePath(); g.fill(); g.restore(); } }
      { const q=(t%53)/53; if(q<.35){ const e=q/.35, px=W*(1.05-e*1.15), py=hz*.22, s=H*.006; g.fillStyle=P.night>.5?'#1a1e28':'#3a404a'; g.beginPath(); g.ellipse(px,py,s*2,s*.9,0,0,7); g.fill(); g.fillRect(px,py-s*.2,s*3.4,s*.35); g.strokeStyle=g.fillStyle; g.lineWidth=1; const r=Math.sin(t*40)*s*3; g.beginPath(); g.moveTo(px-r,py-s*1.3); g.lineTo(px+r,py-s*1.3); g.stroke(); if(P.night>.3){ g.fillStyle=Math.sin(t*6)>0?'#ff4040':'#40ff60'; g.fillRect(px+s*3.2,py-s*.3,1.5,1.5); } } } } };
