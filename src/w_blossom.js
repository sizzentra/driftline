// =====================================================================
// Cherry Blossom Lake: its whole scene in one file (Clean Scenes 5, 2026-11-22): the scene, then its extra life and its own moment
// (WA_MORE). Its colours (WA_PAL) and the newer waters' shared drawing helpers stay in cn_waterart.js.
// =====================================================================
V3SCENES.blossom={
  land(x,P,hz,cnv){
    waFuji(x,P,hz);
    v3range(x,{seed:12, base:hz+1, amp:.2*H, massifs:[[.04,.95,.09],[.2,.6,.07],[.82,.62,.08],[.97,1,.08]], light:mix(P.far,P.hill,.35), shadow:mix(P.far,'#1a1030',.35), haze:P.farHaze, snow:null, hazeA:.5});
    wa.hills(x,hz,mix(P.hill,P.farHaze,.35),[[0,.05],[.12,.07],[.3,.045],[.5,.035],[.7,.05],[.88,.07],[1,.055]]);
    for(let i=0;i<16;i++) waCherry(x,W*(.02+i*.065)+((i*29)%7-3)*3,hz-H*.03,H*.035,P,200+i,{leaf:mix(P.leaf,P.farHaze,.35)});
    wa.hills(x,hz,P.hill,[[0,.03],[.15,.04],[.3,.025],[.5,.03],[.7,.025],[.85,.04],[1,.03]]);
    waPagoda(x,W*.14,hz-H*.022,H*.0072,P);
    for(const [px,hh,wp,deep] of [[.03,.1,0,0],[.25,.085,1,0],[.36,.11,0,1],[.47,.075,0,0],[.6,.1,1,1],[.7,.08,0,0],[.9,.115,0,1],[.98,.08,1,0]]) waCherry(x,W*px,hz-H*.008,H*hh,P,300+Math.round(px*100),{weep:wp,leaf:deep?mix(P.leaf,'#d8507a',.35):P.leaf});
    for(const px of WA_TORO) waToro(x,W*px,hz-H*.006,H*.0055,P);
    v3water(x,P,hz,cnv,.38);
    // the red torii standing in the shallows on the right
    { const gx=W*.78, gb=hz+H*.03, gh=H*.12, gw=H*.11, red=mix('#d8382a',P.wBot,P.night*.6); x.fillStyle=red; x.fillRect(gx-gw*.4,gb-gh,gh*.07,gh); x.fillRect(gx+gw*.4-gh*.07,gb-gh,gh*.07,gh);
      x.fillRect(gx-gw*.5,gb-gh*.78,gw,gh*.07); x.beginPath(); x.moveTo(gx-gw*.66,gb-gh*.98); x.quadraticCurveTo(gx,gb-gh*.9,gx+gw*.66,gb-gh*.98); x.lineTo(gx+gw*.6,gb-gh*.88); x.quadraticCurveTo(gx,gb-gh*.82,gx-gw*.6,gb-gh*.88); x.closePath(); x.fill();
      x.fillStyle=mix('#1a1a1a',P.wBot,P.night*.5); x.fillRect(gx-gw*.62,gb-gh*1.02,gw*1.24,gh*.05);
      x.fillStyle=v3rgba(red,.25); x.fillRect(gx-gw*.4,gb,gh*.07,gh*.5); x.fillRect(gx+gw*.4-gh*.07,gb,gh*.07,gh*.5); }
    // water lilies near the shores, bigger toward you
    { const r=v3rng(41); for(const [cx,cy,n] of [[.42,.05,4],[.55,.09,3],[.88,.13,5],[.33,.24,4],[.66,.36,4],[.95,.5,3]]) for(let i=0;i<n;i++){ const yy=hz+H*cy+(r()-.5)*H*.02, k=(yy-hz)/(H-hz), s=H*(.008+k*.04)*(.7+r()*.5), fl=r()<.35?(r()<.5?'#f4a8c4':'#fff4f8'):null; waLily(x,W*cx+(r()-.5)*W*.06*(1+k*2),yy,s,P,500+i+Math.round(cx*100),fl); } } },
  live(P,t,hz,sun){ const FX=S.settings.effects; v3glitter(P,t,hz,sun);
    // petals resting on the lake, drifting slowly with the breeze (smaller and flatter toward the far shore)
    for(let i=0,n=gfxHigh()?30:18;i<n;i++){ const y=hz+H*(.015+((i*.377)%1)*.75), k=(y-hz)/(H-hz), x=((W*((i*.618)%1)+t*W*(.003+(i%3)*.0015)*(1+k))%(W*1.05))-W*.02, s=1+k*3.2;
      g.fillStyle=i%3?'rgba(255,196,214,.85)':'rgba(255,236,244,.9)'; g.beginPath(); g.ellipse(x,y+Math.sin(t*.8+i)*k*1.5,s,s*.42,(i%5)*.3,0,7); g.fill(); }
    if(FX) for(let i=0,n=gfxHigh()?22:12;i<n;i++){ const per=9+(i%5), q=((t+i*1.7)%per)/per, x=W*(((i*.137)+q*.25)%1), y=H*.05+q*H*.85+Math.sin(t*1.3+i)*6; if(y>H*.97) continue; wa.petal(g,x,y,2.6,t*2+i,i%3?'rgba(255,190,210,.85)':'rgba(255,230,240,.9)'); }
    // ducks paddling (they replaced the koi), turning at the ends of their lap
    for(let i=0;i<3;i++){ const ph=t*.022+i*2.1, y=hz+H*(.05+i*.045), k=(y-hz)/(H-hz); waDuck(W*(.55+.3*Math.sin(ph)),y,H*(.006+k*.012),Math.cos(ph)>=0?1:-1,P,t,i,i===1); }
    // the stone lanterns glow at night and paper lanterns drift on the lake
    if(P.night>.3){ for(const px of WA_TORO) v3glow(g,W*px,hz-H*.006-H*.018,H*.025,'rgba(255,190,110,.9)',.6*P.night);
      for(let i=0;i<5;i++){ const q=((t*.01+i*.2)%1), x=W*(.25+q*.7), y=hz+H*(.04+i*.035)+Math.sin(t*.8+i)*2, s=H*.006*(1+(y-hz)/(H-hz)*3); v3glow(g,x,y,s*5,'rgba(255,180,120,.9)',.5*P.night); g.fillStyle='rgba(255,210,150,'+P.night+')'; g.fillRect(x-s*.6,y-s,s*1.2,s*1.2); g.fillStyle=v3rgba('#ffc890',.25*P.night); g.fillRect(x-s*.4,y+s*.4,s*.8,s*3); } }
    // now and then a gust carries a swirl of petals across the lake
    if(FX){ const q=t%47; if(q<7){ const e=q/7; for(let i=0;i<36;i++){ const u=i/36, x=-W*.1+(e*1.4-u*.35)*W*1.1, y=hz*.55+Math.sin(u*9+t*2)*H*.08+u*H*.25; if(x<-10||x>W+10) continue; wa.petal(g,x,y,2.4,t*4+i,i%3?'rgba(255,190,210,.9)':'rgba(255,236,244,.95)'); } } } },
  fore(P,t){ const sw=Math.sin(t*.6)*.03; g.save(); g.translate(W,0); g.rotate(sw); g.strokeStyle=mix('#4a3022',P.top,P.night*.4); g.lineWidth=H*.012; g.lineCap='round'; g.beginPath(); g.moveTo(0,H*.05); g.quadraticCurveTo(-W*.08,H*.06,-W*.16,H*.14); g.stroke();
    for(let i=0;i<14;i++){ const u=i/13, px=-W*.16*u, py=H*.05+H*.09*u*u; g.fillStyle=i%2?'rgba(255,190,214,.95)':'rgba(255,224,236,.95)'; g.beginPath(); g.arc(px+((i*7)%5-2)*2,py+((i*11)%5-2)*2,H*.012,0,7); g.fill(); } g.restore(); }
};
