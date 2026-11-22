// =====================================================================
// Animal Farm: its whole scene in one file (Clean Scenes 5, 2026-11-22): the scene, then its extra life and its own moment
// (WA_MORE). Its colours (WA_PAL) and the newer waters' shared drawing helpers stay in cn_waterart.js.
// =====================================================================
V3SCENES.farm={
  land(x,P,hz,cnv){
    wa.hills(x,hz,mix(P.hill,P.farHaze,.35),[[0,.06],[.2,.09],[.45,.05],[.7,.08],[1,.05]]); wa.hills(x,hz,P.hill,[[0,.03],[.3,.05],[.6,.025],[1,.04]]);
    // the red barn, the silo and a windmill tower (its blades turn in the live layer)
    { const bx=W*.62, bb=hz-H*.02, bw=H*.12, bh=H*.07, red=P.cabin; x.fillStyle=red; x.fillRect(bx,bb-bh,bw,bh); x.beginPath(); x.moveTo(bx-bw*.06,bb-bh); x.lineTo(bx+bw*.5,bb-bh-H*.04); x.lineTo(bx+bw*1.06,bb-bh); x.closePath(); x.fill();
      x.strokeStyle=mix('#ffffff',red,P.night*.6); x.lineWidth=Math.max(1,H*.003); x.strokeRect(bx+bw*.35,bb-bh*.7,bw*.3,bh*.7); x.beginPath(); x.moveTo(bx+bw*.35,bb-bh*.7); x.lineTo(bx+bw*.65,bb); x.moveTo(bx+bw*.65,bb-bh*.7); x.lineTo(bx+bw*.35,bb); x.stroke();
      x.fillStyle=mix('#c8c8d0',P.farHaze,P.night*.5); x.fillRect(bx+bw*1.1,bb-bh*1.5,bw*.28,bh*1.5); x.beginPath(); x.arc(bx+bw*1.24,bb-bh*1.5,bw*.14,Math.PI,0); x.fill();
      x.fillStyle=mix('#8a7a6a',P.farHaze,P.night*.4); x.beginPath(); x.moveTo(W*.86,bb); x.lineTo(W*.875,bb-H*.12); x.lineTo(W*.89,bb); x.closePath(); x.fill(); }
    // fence and hay bales
    x.fillStyle=mix('#d8c8a8',P.hill,.2+P.night*.5); for(let i=0;i<16;i++) x.fillRect(W*(.05+i*.028),hz-H*.03,2,H*.018); x.fillRect(W*.05,hz-H*.026,W*.42,1.5); x.fillRect(W*.05,hz-H*.02,W*.42,1.5);
    for(const px of [.2,.26,.48]){ x.fillStyle=mix('#e8c860',P.hill,P.night*.5); x.beginPath(); x.ellipse(W*px,hz-H*.012,H*.016,H*.012,0,0,7); x.fill(); }
    waMore('farm','shore',x,P,hz); v3water(x,P,hz,cnv,.36); },
  live(P,t,hz,sun){ waMore('farm','live',null,P,hz,t); v3glitter(P,t,hz,sun); const cx=W*.875, cy=hz-H*.02-H*.12, L=H*.05, a=t*.9; g.strokeStyle=mix('#f0e8d8','#303040',P.night*.6); g.lineWidth=Math.max(1.5,H*.004);
    for(let i=0;i<4;i++){ const an=a+i*Math.PI/2; g.beginPath(); g.moveTo(cx,cy); g.lineTo(cx+Math.cos(an)*L,cy+Math.sin(an)*L); g.stroke(); }
    if(S.settings.effects&&P.night<.6) for(let i=0;i<3;i++){ const q=((t*.05+i*.33)%1), x=W*(-.05+q*1.1), y=hz*(.25+i*.1), f=Math.sin(t*6+i)*.6, s=H*.006; g.strokeStyle='rgba(40,40,50,.7)'; g.lineWidth=1.2; g.beginPath(); g.moveTo(x-s*2,y-s*f); g.quadraticCurveTo(x-s,y-s,x,y); g.quadraticCurveTo(x+s,y-s,x+s*2,y-s*f); g.stroke(); } },
  fore(P,t){ g.save(); for(let i=0;i<3;i++){ const x=W*(.9+i*.04), y=H*(.62+i*.06), sw=Math.sin(t*.9+i)*3; g.strokeStyle=mix('#3a7a2a',P.top,P.night*.5); g.lineWidth=H*.006; g.beginPath(); g.moveTo(x,H); g.lineTo(x+sw,y); g.stroke();
    g.fillStyle=mix('#f8c820',P.top,P.night*.6); for(let k=0;k<10;k++){ const an=k/10*Math.PI*2; g.beginPath(); g.ellipse(x+sw+Math.cos(an)*H*.022,y+Math.sin(an)*H*.022,H*.014,H*.006,an,0,7); g.fill(); } g.fillStyle=mix('#5a3a1a',P.top,P.night*.5); g.beginPath(); g.arc(x+sw,y,H*.016,0,7); g.fill(); } g.restore(); }
};
WA_MORE.farm={
    shore(x,P,hz){ const road=mix('#d8c090',P.hill,.3+P.night*.5); x.strokeStyle=road; x.lineWidth=H*.006; x.beginPath(); x.moveTo(0,hz-H*.034); x.bezierCurveTo(W*.3,hz-H*.044,W*.6,hz-H*.03,W,hz-H*.04); x.stroke();
      for(const [px,sh,d] of [[.12,0,1],[.18,1,1],[.22,1,-1],[.33,0,-1],[.4,1,1],[.53,0,1],[.95,1,-1]]){ x.save(); x.translate(W*px,hz-H*.012); x.scale(d,1); waCow(x,0,0,H*.0042,P,!!sh); x.restore(); } },
    live(x,P,hz,t){ const FX=S.settings.effects;
      /* map standard (2026-11-21), life after dark: fireflies over the field by the fence, and a barn owl gliding low over the fields now and then */
      if(FX&&P.night>.3) for(let i=0;i<10;i++){ const fx=W*(.06+((i*.137)%.42))+Math.sin(t*.6+i)*W*.008, fy=hz-H*(.03+((i*7)%5)*.006)+Math.sin(t*.8+i*2)*H*.006, a=P.night*(.5+.5*Math.sin(t*2.6+i*1.9)); v3glow(g,fx,fy,H*.01,'rgba(220,255,140,.9)',a*.55); }
      if(P.night>.5){ const q=(t%34)/34; if(q<.4){ const e=q/.4, ox=W*(1.06-e*1.14), oy=hz-H*(.19+.03*Math.sin(e*Math.PI*2)), s=H*.0065; v3owlFly(ox,oy,s,t,mix('#e8dcc0',P.hill,.45),mix('#d8c8a0',P.hill,.4),mix('#fff8ec',P.hill,.3),'#1a1410'); } }
      for(let i=0;i<2;i++){ const ph=t*.02+i*2.6, y=hz+H*(.05+i*.05); waDuck(W*(.5+.25*Math.sin(ph)),y,H*(.006+waK(y,hz)*.012),Math.cos(ph)>=0?1:-1,P,t,i,false); }
      { const q=(t%55)/55; if(q<.4){ const e=q/.4, tx=W*(-.05+e*1.1), ty=hz-H*.038-Math.sin(e*3.1)*H*.004, s=H*.0045, N=c0=>mix(c0,P.hill,P.night*.55); g.fillStyle=N('#2a8a3a'); g.fillRect(tx-s*2,ty-s*2.2,s*3.2,s*1.4); g.fillRect(tx-s*.4,ty-s*4,s*1.6,s*1.9); g.fillStyle=N('#bfe0f0'); g.fillRect(tx-s*.1,ty-s*3.7,s*1,s*1); g.fillStyle=N('#1a1a1a'); g.beginPath(); g.arc(tx-s*1.2,ty-s*.9,s*1.1,0,7); g.moveTo(tx+s*1.6,ty-s*.6); g.arc(tx+s*1,ty-s*.6,s*.6,0,7); g.fill(); if(S.settings.effects){ g.fillStyle='rgba(90,90,90,.35)'; g.beginPath(); g.arc(tx+s*1.5,ty-s*5-((t*2)%1)*s*2,s*.6,0,7); g.fill(); } } } } };
