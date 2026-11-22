// =====================================================================
// Florida Keys: its whole scene in one file (Clean Scenes 5, 2026-11-22): the scene, then its extra life and its own moment
// (WA_MORE). Its colours (WA_PAL) and the newer waters' shared drawing helpers stay in cn_waterart.js.
// =====================================================================
V3SCENES.keys={
  land(x,P,hz,cnv){
    for(const [ix,iw,ih] of [[.12,.12,.012],[.46,.08,.01],[.86,.14,.016]]){ x.fillStyle=mix(P.isl,P.farHaze,.35); x.beginPath(); x.ellipse(W*ix,hz,W*iw,H*ih,0,Math.PI,0); x.fill(); }
    for(const [px,hh,l] of [[.06,.08,.2],[.1,.1,-.15],[.82,.09,.1],[.9,.11,-.1]]) v3palm(x,W*px,hz-H*.008,H*hh,l,P,Math.round(px*100));
    // Cam's list #3: beaches along the keys (a pale sand line at the foot of each island, seen from the side)
    for(const [ix,iw] of [[.12,.12],[.46,.08],[.86,.14]]){ x.fillStyle=mix(P.sand,P.farHaze,.2+P.night*.45); x.beginPath(); x.ellipse(W*ix,hz,W*iw*1.04,H*.0045,0,Math.PI,0); x.fill(); }
    // Cam's list #3: the long road bridge between the keys, bigger: a flat concrete deck on piers with a hump in the middle for boats,
    // a guard rail along it; traffic drives along it (live layer below). Side view: deck, rail and piers, no top-down road
    { const N=c0=>mix(c0,P.farHaze,.28+P.night*.35), dk=H*.011, x0=W*.04, x1=W*.96;
      x.fillStyle=N('#8a8e94'); for(let i=0;i<=46;i++){ const px=x0+(x1-x0)*i/46, top=keysDeck(px,hz)+dk; x.fillRect(px-H*.0025,top,H*.005,hz-top); } /* piers down to the water */
      x.fillStyle=N('#dcdad4'); x.beginPath(); x.moveTo(x0,keysDeck(x0,hz)); for(let i=1;i<=60;i++){ const px=x0+(x1-x0)*i/60; x.lineTo(px,keysDeck(px,hz)); } for(let i=60;i>=0;i--){ const px=x0+(x1-x0)*i/60; x.lineTo(px,keysDeck(px,hz)+dk); } x.closePath(); x.fill();
      x.strokeStyle=N('#f4f2ee'); x.lineWidth=Math.max(1,H*.0016); x.beginPath(); for(let i=0;i<=60;i++){ const px=x0+(x1-x0)*i/60, py=keysDeck(px,hz)-H*.0035; i?x.lineTo(px,py):x.moveTo(px,py); } x.stroke(); /* the guard rail */
      x.fillStyle=N('#6a6e74'); x.fillRect(x0,keysDeck(x0,hz)+dk-H*.0015,x1-x0,H*.0015); }
    waMore('keys','shore',x,P,hz); v3water(x,P,hz,cnv,.3);
    // seagrass beds and sand patches seen through the shallow water
    { const r=v3rng(17); for(let i=0;i<14;i++){ const px=W*r(), py=hz+H*(.12+r()*.8), s=H*(.03+r()*.05); x.fillStyle=v3rgba(i%3?mix(P.sand,P.wMid,.5):mix('#3a7a4a',P.wMid,.5),.35); x.beginPath(); x.ellipse(px,py,s*2.2,s*.5,0,0,7); x.fill(); } } },
  live(P,t,hz,sun){ waMore('keys','live',null,P,hz,t); v3glitter(P,t,hz,sun); if(!S.settings.effects) return;
    // gulls
    if(P.night<.5) for(let i=0;i<3;i++){ const q=((t*.04+i*.33)%1), x=W*(-.05+q*1.1), y=hz*(.3+i*.12)+Math.sin(t+i)*6, f=Math.sin(t*5+i)*.6, s=H*.008; g.strokeStyle='rgba(250,250,250,.9)'; g.lineWidth=1.3; g.beginPath(); g.moveTo(x-s*2,y-s*f); g.quadraticCurveTo(x-s,y-s,x,y); g.quadraticCurveTo(x+s,y-s,x+s*2,y-s*f); g.stroke(); }
    // a pelican diving now and then
    { const per=16, q=(t%per)/per; if(q<.25){ const e=q/.25, x=W*.62, y=hz*.4+e*e*(hz*.62); g.fillStyle='rgba(120,110,100,.9)'; g.beginPath(); g.ellipse(x,y,H*.006,H*.016,.2,0,7); g.fill(); } else if(q<.32){ v3fxSplash&&0; const k=(q-.25)/.07; g.strokeStyle='rgba(255,255,255,'+(1-k)+')'; g.lineWidth=1.4; g.beginPath(); g.ellipse(W*.62,hz+2,H*.01+k*H*.03,H*.004+k*H*.008,0,0,7); g.stroke(); } } },
  fore(P,t){ g.save(); g.strokeStyle=mix('#4a3a2a',P.top,P.night*.4); g.lineWidth=H*.008; g.lineCap='round'; for(let i=0;i<6;i++){ const x0=W*(.9+i*.02); g.beginPath(); g.moveTo(x0,H); g.quadraticCurveTo(x0-W*.02,H*.86,x0+W*.01,H*.78-i*H*.01); g.stroke(); }
    g.fillStyle=mix('#2a6a3a',P.top,P.night*.5); for(let i=0;i<9;i++){ g.beginPath(); g.ellipse(W*(.9+((i*13)%7)*.014),H*(.72+((i*7)%5)*.012),W*.018,H*.01,(i-4)*.3,0,7); g.fill(); } g.restore(); }
};
WA_MORE.keys={
    shore(x,P,hz){ const N=c0=>mix(c0,P.farHaze,.3+P.night*.4);
      for(const [ix,iw] of [[.12,.12],[.86,.14]]){ x.fillStyle=N('#1e5a34'); for(let i=0;i<9;i++){ const u=i/8; x.beginPath(); x.ellipse(W*(ix-iw*.8+u*iw*1.6),hz-H*.008,W*.012,H*.008,0,Math.PI,0); x.fill(); } }
      const lx=W*.885, lb=hz-H*.014, lh=H*.085, lw=H*.012; for(let i=0;i<5;i++){ x.fillStyle=N(i%2?'#c8302a':'#f4f0ea'); x.beginPath(); x.moveTo(lx-lw*(1-i*.08),lb-i*lh/5); x.lineTo(lx-lw*(1-(i+1)*.08),lb-(i+1)*lh/5); x.lineTo(lx+lw*(1-(i+1)*.08),lb-(i+1)*lh/5); x.lineTo(lx+lw*(1-i*.08),lb-i*lh/5); x.fill(); }
      x.fillStyle=N('#2a2a30'); x.fillRect(lx-lw*.75,lb-lh-H*.004,lw*1.5,H*.004); x.fillStyle=P.night>.3?'#fff0b0':N('#cfe8f0'); x.fillRect(lx-lw*.5,lb-lh-H*.016,lw,H*.012); x.fillStyle=N('#2a2a30'); x.beginPath(); x.moveTo(lx-lw*.7,lb-lh-H*.016); x.lineTo(lx,lb-lh-H*.026); x.lineTo(lx+lw*.7,lb-lh-H*.016); x.fill(); },
    live(x,P,hz,t){ const FX=S.settings.effects;
      /* Cam's list #3: traffic on the bridge, both ways (cars and minivans, now and then a box truck or a semi); each fades in and out at the
         bridge's ends behind the keys' trees, never popping up in the open */
      { const x0=W*.04, x1=W*.96, span=x1-x0, KINDS=['car','van','car','box','car','semi','car','van'], COLS=['#c8302a','#2a5a9a','#f0f0ec','#1f6a4a','#d8a020','#3a3a42','#8a2a6a','#e86a2a'];
        for(let i=0;i<8;i++){ const dir=i%2?-1:1, v=W*(.018+((i*37)%11)*.0016)*(KINDS[i]==='semi'||KINDS[i]==='box'?.8:1), per=span/v+4+(i%3)*3, q=((t+i*9.3)%per)*v/span;
          if(q>1) continue; const px=dir>0?x0+q*span:x1-q*span, a=Math.min(1,Math.min(px-x0,x1-px)/(W*.05)); if(a<=0) continue; keysVehicle(px,keysDeck(px,hz)-(dir>0?H*.0012:0),dir,KINDS[i],COLS[i],P,a); } }
      /* Cam's list #3: a speedboat now and then, and sport-fishing boats ripping by on the far water */
      { const runs=[[41,'speed',-1,.034,7],[57,'sport',1,.044,9.5],[73,'speed',1,.05,6]]; for(const [per,kind,dir,dy,dur] of runs){ const q=(t%per); if(q>dur) continue; const e=q/dur, px=dir>0?W*(-.08+e*1.16):W*(1.08-e*1.16); keysFastBoat(px,hz+H*dy,H*(kind==='sport'?.0085:.0072),dir,kind,P,t); } }
      /* Cam's list #3: a school of fish under the water, deep in the foreground on the right, clear of the line and the fishing area */
      if(FX){ const cx=W*(.7+.18*Math.sin(t*.05)), cy=H*(.84+.03*Math.sin(t*.09)), dirx=Math.cos(t*.05)>=0?1:-1; g.save(); g.fillStyle='rgba(20,60,70,'+(.22-P.night*.1)+')';
        for(let i=0;i<14;i++){ const a=i*2.4, r=H*(.012+.004*(i%4)), fx=cx+Math.cos(a+t*.6)*r*2.6, fy=cy+Math.sin(a*1.3+t*.5)*r*.9, s=H*.0065; g.beginPath(); g.ellipse(fx,fy,s*1.6,s*.55,0,0,7); g.fill(); g.beginPath(); g.moveTo(fx-dirx*s*1.5,fy); g.lineTo(fx-dirx*s*2.4,fy-s*.6); g.lineTo(fx-dirx*s*2.4,fy+s*.6); g.fill(); } g.restore(); }
      { const q=((t*.006)%1), sx=W*(.25+.5*(.5+.5*Math.sin(q*Math.PI*2))), sy=hz+H*.035, s=H*.012, N=c0=>mix(c0,P.wMid,P.night*.55); g.fillStyle=N('#f4f0ea'); g.beginPath(); g.moveTo(sx-s*1.6,sy); g.lineTo(sx+s*1.6,sy); g.lineTo(sx+s*1.2,sy+s*.5); g.lineTo(sx-s*1.2,sy+s*.5); g.fill(); g.beginPath(); g.moveTo(sx,sy-s*.1); g.lineTo(sx,sy-s*3.2); g.lineTo(sx+s*1.5,sy-s*.3); g.fill(); g.fillStyle=N('#e8e0d0'); g.beginPath(); g.moveTo(sx-s*.15,sy-s*.2); g.lineTo(sx-s*.15,sy-s*2.6); g.lineTo(sx-s*1.3,sy-s*.3); g.fill(); }
      if(P.night>.3){ const lx=W*.885, ly=hz-H*.014-H*.085-H*.01, a=t*.8, len=W*.35; for(const d of [0,Math.PI]){ const an=a+d, dx=Math.cos(an); if(dx*dx<.02) continue; const gr=g.createLinearGradient(lx,ly,lx+dx*len,ly); gr.addColorStop(0,'rgba(255,240,180,'+(.35*P.night)+')'); gr.addColorStop(1,'rgba(255,240,180,0)'); g.fillStyle=gr; g.beginPath(); g.moveTo(lx,ly); g.lineTo(lx+dx*len,ly-H*.03*Math.abs(dx)); g.lineTo(lx+dx*len,ly+H*.03*Math.abs(dx)); g.closePath(); g.fill(); } }
      if(FX){ const q=(t%29)/29; if(q<.12){ const e=q/.12; for(let i=0;i<2;i++){ const ee=e-i*.18; if(ee<0||ee>1) continue; const y=hz+H*.1, s=H*.01; waLeaper(W*(.58+i*.03),y,s,ee,mix('#7a8ea0',P.wMid,P.night*.5)); if(ee<.12||ee>.88) waRing(W*.58+(ee<.5?-1:1)*s*7+i*W*.03,y,s,ee<.5?ee/.12:(ee-.88)/.12,.8); } } } } };
