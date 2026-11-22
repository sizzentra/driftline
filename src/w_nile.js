// =====================================================================
// The Nile: its whole scene in one file (Clean Scenes 5, 2026-11-22): the scene, then its extra life and its own moment
// (WA_MORE). Its colours (WA_PAL) and the newer waters' shared drawing helpers stay in cn_waterart.js.
// =====================================================================
V3SCENES.nile={
  land(x,P,hz,cnv){
    wa.hills(x,hz,mix(P.sand,P.farHaze,.35),[[0,.03],[.25,.05],[.5,.03],[.75,.045],[1,.03]]);
    // pyramids and the sphinx
    for(const [px,s] of [[.24,.16],[.34,.11],[.42,.07]]){ const b=hz-H*.01, h=H*s; x.fillStyle=mix(P.sand,P.farHaze,.15); x.beginPath(); x.moveTo(W*px-h,b); x.lineTo(W*px,b-h); x.lineTo(W*px+h,b); x.closePath(); x.fill(); x.fillStyle=mix(P.sandD,P.farHaze,.15); x.beginPath(); x.moveTo(W*px,b-h); x.lineTo(W*px+h,b); x.lineTo(W*px+h*.25,b); x.closePath(); x.fill(); }
    { const sx=W*.6, sb=hz-H*.008, s=H*.02; x.fillStyle=mix(P.sandD,P.farHaze,.2); x.fillRect(sx-s*3,sb-s*1.1,s*4.4,s*1.1); x.beginPath(); x.moveTo(sx+s*.6,sb-s*1.1); x.lineTo(sx+s*.9,sb-s*2.6); x.lineTo(sx+s*1.9,sb-s*2.4); x.lineTo(sx+s*1.9,sb-s*1.1); x.closePath(); x.fill(); x.fillRect(sx+s*1.4,sb-s*.6,s*1.6,s*.6); }
    for(const [px,hh,l] of [[.07,.1,.12],[.12,.08,-.1],[.78,.09,.1],[.9,.11,-.12]]) v3palm(x,W*px,hz-H*.006,H*hh,l,P,Math.round(px*100)+7);
    v3reeds(x,W*.68,W*.76,hz+H*.005,H*.035,mix('#6a8a3a',P.front,P.night*.5),73);
    waMore('nile','shore',x,P,hz); v3water(x,P,hz,cnv,.36); waMore('nile','water',x,P,hz); },
  live(P,t,hz,sun){ waMore('nile','live',null,P,hz,t); v3glitter(P,t,hz,sun);
    // a felucca sailing slowly across
    { const per=80, q=(t%per)/per, x=W*(-.1+q*1.2), y=hz+H*.03, s=H*.03; g.fillStyle=mix('#5a3a2a','#202030',P.night*.6); g.beginPath(); g.moveTo(x-s*1.2,y); g.lineTo(x+s*1.2,y); g.lineTo(x+s*.9,y+s*.3); g.lineTo(x-s*.9,y+s*.3); g.closePath(); g.fill();
      g.fillStyle=mix('#f8f0e0','#6a6a80',P.night*.6); g.beginPath(); g.moveTo(x,y-s*.05); g.lineTo(x-s*.2,y-s*2.2); g.lineTo(x+s*1.1,y-s*.4); g.closePath(); g.fill(); }
    if(S.settings.effects&&P.night<.4){ g.save(); g.globalAlpha=.05; g.fillStyle='#fff8e0'; for(let i=0;i<3;i++){ const y=hz-H*(.01+i*.012)+Math.sin(t*2+i)*1.5; g.fillRect(0,y,W,H*.004); } g.restore(); } },
  fore(P,t){ v3reeds(g,W*.88,W,H*1.01,H*.2,mix('#4a7a2a',P.top,P.night*.5),91,{sway:Math.sin(t*.8)*.04}); }
};
WA_MORE.nile={
    shore(x,P,hz){ const N=c0=>mix(c0,P.farHaze,.2+P.night*.4); x.fillStyle=N('#d8b878'); x.beginPath(); x.moveTo(W*.505,hz-H*.006); x.lineTo(W*.509,hz-H*.075); x.lineTo(W*.512,hz-H*.082); x.lineTo(W*.515,hz-H*.075); x.lineTo(W*.519,hz-H*.006); x.fill(); x.fillStyle=N('#b89858'); x.fillRect(W*.513,hz-H*.075,W*.006,H*.069); },
    water(x,P,hz){ const r=v3rng(19); for(const [cx,cy,n] of [[.66,.04,4],[.74,.07,3],[.4,.18,3]]) for(let i=0;i<n;i++){ const yy=hz+H*cy+(r()-.5)*H*.015, s=H*(.008+waK(yy,hz)*.04)*(.7+r()*.4); waLily(x,W*cx+(r()-.5)*W*.05,yy,s,P,700+i+Math.round(cx*100),r()<.5?(r()<.5?'#8ab8ff':'#fff8f0'):null); } },
    live(x,P,hz,t){ const FX=S.settings.effects, N=c0=>mix(c0,P.farHaze,P.night*.6);
      /* map standard (2026-11-21), life after dark: fruit bats flit over the palms, darting and turning */
      if(P.night>.4) for(let i=0;i<4;i++){ const seg=Math.floor(t*.5+i*2.3), k=(t*.5+i*2.3)-seg, r1=v3rng(seg*7+i), r0=v3rng((seg-1)*7+i), ax=W*(.15+r1()*.7), ay=hz*(.45+r1()*.4), bx=W*(.15+r0()*.7), by=hz*(.45+r0()*.4), e=k*k*(3-2*k), x0=bx+(ax-bx)*e, y0=by+(ay-by)*e, s=H*.005, f=Math.sin(t*16+i*2);
        g.fillStyle=v3rgba('#141018',P.night); g.beginPath(); g.moveTo(x0,y0); g.quadraticCurveTo(x0-s*1.2,y0-s*1.6*f,x0-s*2.6,y0-s*.6*f); g.lineTo(x0-s*1.4,y0+s*.3); g.lineTo(x0,y0+s*.5); g.lineTo(x0+s*1.4,y0+s*.3); g.lineTo(x0+s*2.6,y0-s*.6*f); g.quadraticCurveTo(x0+s*1.2,y0-s*1.6*f,x0,y0); g.fill(); }
      { const per=110, q=(t%per)/per, base=W*(1.08-q*1.25); for(let i=0;i<4;i++){ const cx=base+i*H*.035, cy=hz-H*.027, s=H*.0035, st=Math.sin(t*3+i)*s*.5; g.fillStyle=N('#a07a4a'); g.strokeStyle=g.fillStyle; g.lineWidth=Math.max(1,s*.5); g.beginPath(); g.moveTo(cx-s*1.5,cy); g.lineTo(cx-s*1.5+st,cy+s*3.4); g.moveTo(cx+s*1.4,cy); g.lineTo(cx+s*1.4-st,cy+s*3.4); g.stroke(); g.beginPath(); g.ellipse(cx,cy-s*.4,s*2.2,s*1.2,0,0,7); g.fill(); g.beginPath(); g.ellipse(cx,cy-s*1.5,s*.9,s*.8,0,0,7); g.fill(); g.beginPath(); g.moveTo(cx-s*2,cy-s*.6); g.quadraticCurveTo(cx-s*3.4,cy-s*2.5,cx-s*3.2,cy-s*3.2); g.lineTo(cx-s*3.8,cy-s*3.2); g.quadraticCurveTo(cx-s*3,cy-s*1.6,cx-s*1.6,cy); g.fill(); if(i===0){ g.fillStyle=N('#f4f0e8'); g.fillRect(cx-s*.4,cy-s*3.8,s*.9,s*1.8); } } }
      if(FX&&P.night<.5) for(let i=0;i<3;i++){ const q=((t*.03+i*.3)%1), bx=W*(-.05+q*1.1), by=hz*(.3+i*.08)+Math.sin(t+i)*5, f=Math.sin(t*5+i)*.6, s=H*.007; g.strokeStyle='rgba(250,250,250,.9)'; g.lineWidth=1.3; g.beginPath(); g.moveTo(bx-s*2,by-s*f); g.quadraticCurveTo(bx-s,by-s,bx,by); g.quadraticCurveTo(bx+s,by-s,bx+s*2,by-s*f); g.stroke(); g.strokeStyle='#1a1a1a'; g.beginPath(); g.moveTo(bx,by); g.quadraticCurveTo(bx+s*1.2,by+s*.2,bx+s*1.6,by+s*.8); g.stroke(); }
      { const q=(t%21)/21; if(q<.25){ const e=q/.25, up=Math.min(1,Math.sin(e*Math.PI)*1.6), y=hz+H*.09, s=H*.006, cx=W*.46+e*W*.04, col=mix('#4a5a3a',P.wMid,.25+P.night*.5); g.save(); g.beginPath(); g.rect(0,0,W,y); g.clip(); g.fillStyle=col; g.beginPath(); g.ellipse(cx,y+s*(1-up)*1.5,s*4,s*.7*up+.05,0,Math.PI,0); g.fill(); for(const ox of [-1.6,-1.1]){ g.beginPath(); g.arc(cx+ox*s*2,y-s*.5*up+s*(1-up),s*.45,0,7); g.fill(); g.fillStyle='#e8d040'; g.fillRect(cx+ox*s*2-.6,y-s*.6*up+s*(1-up),1.3,1.3); g.fillStyle=col; } for(let i=0;i<5;i++){ g.beginPath(); g.arc(cx+s*(.6+i*.8),y-s*.3*up+s*(1-up),s*.25,0,7); g.fill(); } g.restore(); if(FX) waRing(cx,y+1,s*2,e,.4); } } } };
