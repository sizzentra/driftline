// =====================================================================
// Cherry Blossom Lake: its whole scene in one file (Clean Scenes 5, 2026-11-22): the scene, then its extra life and its own moment
// (WA_MORE). Its colours (WA_PAL) and the newer waters' shared drawing helpers stay in cn_waterart.js.
// =====================================================================
/* map redo (director, 2026-11-22: "cherry blossoms are a huge part of Japanese culture… giant cherry blossom trees with big, lush masses of
   blossom"; Mount Fuji stays as the backdrop): a giant cherry, a thick dark trunk splitting into spreading limbs, each limb ending in a
   billowing cloud of blossom built from many overlapping puffs (shadowed underneath, light on top), with a few petals already fallen */
function blossomGiant(x,cx,base,h,P,seed,flip){ const r=v3rng(seed), N=c0=>mix(c0,'#1a1a3a',P.night*.55), bark=N('#3a2622'), barkL=N('#5a3a2e'), sh=N('#d27a9e'), mid=N('#f2a6c2'), lt=N('#ffd6e6'), hi=N('#fff0f6'), f=flip?-1:1;
  const limbs=[[-.42,.78,.28],[-.15,.98,.3],[.18,.92,.3],[.46,.7,.26],[.05,.62,.22]].map(([dx,dy,rr])=>({x:cx+f*dx*h,y:base-dy*h,r:rr*h}));
  x.fillStyle=bark; x.beginPath(); x.moveTo(cx-h*.07,base); x.bezierCurveTo(cx-h*.04,base-h*.2,cx-h*.06,base-h*.38,cx-h*.02*f,base-h*.5); x.lineTo(cx+h*.04*f,base-h*.5); x.bezierCurveTo(cx+h*.05,base-h*.36,cx+h*.04,base-h*.18,cx+h*.08,base); x.closePath(); x.fill();
  x.strokeStyle=bark; x.lineCap='round'; for(const L of limbs){ x.lineWidth=Math.max(2,h*.035); x.beginPath(); x.moveTo(cx,base-h*.46); x.quadraticCurveTo((cx+L.x)/2,base-h*.6,L.x,L.y+L.r*.3); x.stroke(); }
  x.strokeStyle=barkL; x.lineWidth=Math.max(1,h*.008); x.beginPath(); x.moveTo(cx+h*.03,base); x.bezierCurveTo(cx+h*.02,base-h*.2,cx+h*.03,base-h*.36,cx+h*.02*f,base-h*.48); x.stroke(); x.lineCap='butt';
  const puffs=(col,k,dy,n)=>{ x.fillStyle=col; x.beginPath(); for(const L of limbs) for(let i=0;i<n;i++){ const a=r()*6.283, d=Math.sqrt(r())*L.r, px=L.x+Math.cos(a)*d*1.15, py=L.y+Math.sin(a)*d*.7+dy*h, rr=L.r*(.28+r()*.22)*k; x.moveTo(px+rr,py); x.arc(px,py,rr,0,7); } x.fill(); };
  puffs(sh,1.05,.03,16); puffs(mid,.95,0,18); puffs(lt,.7,-.025,14); puffs(hi,.38,-.045,9);
  x.fillStyle=mid; for(let i=0;i<22;i++){ const px=cx+(r()-.5)*h*1.3, py=base+r()*H*.006; x.beginPath(); x.ellipse(px,py,h*.008,h*.004,0,0,7); x.fill(); } }
V3SCENES.blossom={
  land(x,P,hz,cnv){
    waFuji(x,P,hz);
    /* no recycled mountain range: Fuji alone behind hazy hills thick with distant blossom (a cherry blossom forest) */
    wa.hills(x,hz,mix(P.hill,P.farHaze,.35),[[0,.05],[.12,.07],[.3,.045],[.5,.035],[.7,.05],[.88,.07],[1,.055]]);
    for(let i=0;i<30;i++) waCherry(x,W*(.01+i*.034)+((i*29)%7-3)*3,hz-H*(.028+((i*13)%5)*.004),H*(.03+((i*7)%4)*.006),P,200+i,{leaf:mix(i%3?'#f4b8cc':'#ffd8e6',P.farHaze,.4)});
    waPagoda(x,W*.575,hz-H*.04,H*.0042,Object.assign({},P,{farHaze:mix(P.farHaze,'#ffffff',.2)})); /* a second, distant pagoda on the far hill (director: sad it was the only one) */
    wa.hills(x,hz,P.hill,[[0,.03],[.15,.04],[.3,.025],[.5,.03],[.7,.025],[.85,.04],[1,.03]]);
    waPagoda(x,W*.14,hz-H*.022,H*.0072,P);
    for(const [px,hh,wp,deep] of [[.03,.1,0,0],[.25,.085,1,0],[.47,.075,0,0],[.7,.08,0,0],[.98,.08,1,0]]) waCherry(x,W*px,hz-H*.008,H*hh,P,300+Math.round(px*100),{weep:wp,leaf:deep?mix(P.leaf,'#d8507a',.35):P.leaf});
    for(const px of WA_TORO) waToro(x,W*px,hz-H*.006,H*.0055,P);
    blossomGiant(x,W*.4,hz+1,H*.3,P,71,false); blossomGiant(x,W*.88,hz+1,H*.36,P,73,true); /* the two giants: the focus of the lake */
    v3water(x,P,hz,cnv,.38);
    // the red torii standing in the shallows on the right
    /* director, 2026-11-22: "the sign in the water doesn't read as anything": larger, true proportions (thick pillars on black feet, the
       tie beam running past the pillars, a name tablet between the beams, the black-capped top beam sweeping up at both ends) */
    { const gx=W*.7, gb=hz+H*.045, gh=H*.19, gw=H*.17, red=mix('#d8382a',P.wBot,P.night*.6), blk=mix('#1a1a1a',P.wBot,P.night*.5); x.fillStyle=red; x.fillRect(gx-gw*.4,gb-gh,gh*.075,gh); x.fillRect(gx+gw*.4-gh*.075,gb-gh,gh*.075,gh);
      x.fillStyle=blk; x.fillRect(gx-gw*.4-1,gb-gh*.08,gh*.075+2,gh*.08); x.fillRect(gx+gw*.4-gh*.075-1,gb-gh*.08,gh*.075+2,gh*.08);
      x.fillStyle=red; x.fillRect(gx-gw*.04,gb-gh*.9,gw*.08,gh*.14); x.fillStyle=blk; x.fillRect(gx-gw*.03,gb-gh*.88,gw*.06,gh*.1); x.fillStyle=red;
      x.fillRect(gx-gw*.5,gb-gh*.78,gw,gh*.07); x.beginPath(); x.moveTo(gx-gw*.66,gb-gh*.98); x.quadraticCurveTo(gx,gb-gh*.9,gx+gw*.66,gb-gh*.98); x.lineTo(gx+gw*.6,gb-gh*.88); x.quadraticCurveTo(gx,gb-gh*.82,gx-gw*.6,gb-gh*.88); x.closePath(); x.fill();
      x.fillStyle=mix('#1a1a1a',P.wBot,P.night*.5); x.fillRect(gx-gw*.62,gb-gh*1.02,gw*1.24,gh*.05);
      x.fillStyle=v3rgba(red,.25); x.fillRect(gx-gw*.4,gb,gh*.07,gh*.5); x.fillRect(gx+gw*.4-gh*.07,gb,gh*.07,gh*.5); }
    // water lilies near the shores, bigger toward you
    /* side by side with a little water between them, never on top of each other (director: they covered each other) */
    { const r=v3rng(41); for(const [cx,cy,n] of [[.42,.05,4],[.55,.09,3],[.88,.13,4],[.33,.24,3],[.6,.36,3],[.92,.5,2]]){ const k=cy*H/(H-hz), s0=H*(.008+k*.04); let px=W*cx-s0*1.5*(n-1);
      for(let i=0;i<n;i++){ const s=s0*(.75+r()*.35), yy=hz+H*cy+(i%2?1:-1)*s0*.35, fl=r()<.35?(r()<.5?'#f4a8c4':'#fff4f8'):null; waLily(x,px,yy,s,P,500+i+Math.round(cx*100),fl); px+=s0*3.1; } } } },
  live(P,t,hz,sun){ const FX=S.settings.effects; v3glitter(P,t,hz,sun);
    // petals resting on the lake, drifting slowly with the breeze (smaller and flatter toward the far shore)
    for(let i=0,n=gfxHigh()?30:18;i<n;i++){ const y=hz+H*(.015+((i*.377)%1)*.75), k=(y-hz)/(H-hz), x=((W*((i*.618)%1)+t*W*(.003+(i%3)*.0015)*(1+k))%(W*1.05))-W*.02, s=1+k*3.2;
      g.fillStyle=i%3?'rgba(255,196,214,.85)':'rgba(255,236,244,.9)'; g.beginPath(); g.ellipse(x,y+Math.sin(t*.8+i)*k*1.5,s,s*.42,(i%5)*.3,0,7); g.fill(); }
    if(FX) for(let i=0,n=gfxHigh()?22:12;i<n;i++){ const per=9+(i%5), q=((t+i*1.7)%per)/per, x=W*(((i*.137)+q*.25)%1), y=H*.05+q*H*.85+Math.sin(t*1.3+i)*6; if(y>H*.97) continue; wa.petal(g,x,y,2.6,t*2+i,i%3?'rgba(255,190,210,.85)':'rgba(255,230,240,.9)'); }
    // ducks paddling (they replaced the koi), turning at the ends of their lap
    /* director, 2026-11-22 ("the duck comes out of nowhere"): a pair swims the whole way across, in from beyond one edge and out past the
       other, then later back the other way, with a real wake */
    { const per=80, q=(t%per)/per, lap=Math.floor(t/per)%2, dir=lap?1:-1; if(q<.6){ const e=q/.6; for(let i=0;i<2;i++){ const y=hz+H*(.07+i*.02), k=(y-hz)/(H-hz), s=H*(.006+k*.012), xx=lap?W*(-.06+e*1.12)-i*s*3:W*(1.06-e*1.12)+i*s*3;
      g.save(); if(dir>0){ g.translate(xx,0); g.scale(-1,1); g.translate(-xx,0); } pondWake(xx+s*.4,y-s*.2,s,t,P,i); g.restore(); waDuck(xx,y,s,dir,P,t,i,i===1); } } }
    // the stone lanterns glow at night and paper lanterns drift on the lake
    if(P.night>.3){ for(const px of WA_TORO) v3glow(g,W*px,hz-H*.006-H*.018,H*.025,'rgba(255,190,110,.9)',.6*P.night);
      for(let i=0;i<5;i++){ const q=((t*.01+i*.2)%1), x=W*(-.05+q*1.1) /* in from beyond the left edge and out past the right, never popping up mid-lake (director) */, y=hz+H*(.04+i*.035)+Math.sin(t*.8+i)*2, s=H*.006*(1+(y-hz)/(H-hz)*3); v3glow(g,x,y,s*5,'rgba(255,180,120,.9)',.5*P.night); g.fillStyle='rgba(255,210,150,'+P.night+')'; g.fillRect(x-s*.6,y-s,s*1.2,s*1.2); g.fillStyle=v3rgba('#ffc890',.25*P.night); g.fillRect(x-s*.4,y+s*.4,s*.8,s*3); } }
    // now and then a gust carries a swirl of petals across the lake
    if(FX){ const q=t%47; if(q<7){ const e=q/7; for(let i=0;i<36;i++){ const u=i/36, x=-W*.1+(e*1.4-u*.35)*W*1.1, y=hz*.55+Math.sin(u*9+t*2)*H*.08+u*H*.25; if(x<-10||x>W+10) continue; wa.petal(g,x,y,2.4,t*4+i,i%3?'rgba(255,190,210,.9)':'rgba(255,236,244,.95)'); } } } },
  fore(){ /* the bare branch in the top corner is gone (director: it came from nowhere); the giant cherries frame the lake now */ }
};
