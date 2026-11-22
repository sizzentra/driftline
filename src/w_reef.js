// =====================================================================
// Coral Shallows: its whole scene in one file (Clean Scenes 5, 2026-11-22): the scene itself, then every piece drawn on top, in the
// order they draw (each hook: land = the cached still scenery, sky, live = moving things, fore = the bottom edge). Shared layers
// (weather, the float's wake, wind gusts, depth haze and motes) are added here by name, at their place in that order. Its colours stay
// in V3PAL (f_v3scene.js / f2_areas.js) and shared drawing helpers stay in their files.
// =====================================================================
V3SCENES.reef = {
  land(x,P,hz,cnv){
    // far volcanic islands on the horizon
    for(const [ix,iw,ih] of [[.1,.11,.06],[.24,.06,.035],[.5,.05,.025]]){ x.fillStyle=mix(P.isl,P.farHaze,.5); x.beginPath(); x.moveTo(W*(ix-iw),hz+1); x.quadraticCurveTo(W*(ix-iw*.4),hz-H*ih*1.2,W*ix,hz-H*ih); x.quadraticCurveTo(W*(ix+iw*.4),hz-H*ih*1.1,W*(ix+iw),hz+1); x.closePath(); x.fill(); }
    // the sandy spit on the right with palms, hammock and the hut on stilts
    x.fillStyle=P.sand; x.beginPath(); x.moveTo(W*.6,hz+1); x.quadraticCurveTo(W*.72,hz-H*.016,W*.84,hz-H*.02); x.quadraticCurveTo(W*.94,hz-H*.026,W,hz-H*.02); x.lineTo(W,hz+1); x.closePath(); x.fill();
    x.fillStyle=mix(P.sand,P.wTop,.4); x.fillRect(W*.6,hz-1,W*.4,2);
    for(let i=0;i<14;i++){ x.fillStyle=mix(P.frondD,P.farHaze,.15); const bx=W*(.66+i*.024); x.beginPath(); x.ellipse(bx,hz-H*.014-Math.sin(i*1.3)*H*.003,W*.016,H*.012,0,Math.PI,0); x.fill(); }
    // the stilt hut out over the shallows
    { const hx=W*.57, hb=hz-H*.002, hw=H*.07, hh=H*.035, deck=hb-H*.024;
      x.strokeStyle=mix(P.trunk,'#000000',.35); x.lineWidth=Math.max(1.4,H*.004); for(const sx of [-.45,-.15,.15,.45]){ x.beginPath(); x.moveTo(hx+hw*sx,hb+H*.004); x.lineTo(hx+hw*sx,deck); x.stroke(); }
      x.fillStyle=mix(P.trunk,'#000000',.2); x.fillRect(hx-hw*.62,deck-H*.004,hw*1.24,H*.005);
      x.fillStyle=P.hut; x.fillRect(hx-hw/2,deck-hh,hw,hh); x.fillStyle=mix(P.hut,'#000000',.25); for(let k=1;k<6;k++) x.fillRect(hx-hw/2+k*hw/6,deck-hh,1,hh);
      x.fillStyle='rgba(0,0,0,.2)'; x.fillRect(hx+hw*.1,deck-hh,hw*.4,hh);
      x.fillStyle=mix(P.hut,'#000000',.5); x.fillRect(hx-hw*.3,deck-hh*.75,hw*.16,hh*.3); x.fillRect(hx+hw*.12,deck-hh*.75,hw*.16,hh*.3);
      x.fillStyle=P.thatch; x.beginPath(); x.moveTo(hx-hw*.75,deck-hh+H*.004); x.lineTo(hx,deck-hh-H*.05); x.lineTo(hx+hw*.75,deck-hh+H*.004); x.closePath(); x.fill();
      x.strokeStyle=mix(P.thatch,'#000000',.2); x.lineWidth=.8; for(let k=0;k<10;k++){ const u=k/9; x.beginPath(); x.moveTo(hx,deck-hh-H*.048); x.lineTo(hx-hw*.75+u*hw*1.5,deck-hh+H*.004); x.stroke(); }
      x.fillStyle=mix(P.thatch,'#000000',.12); for(let k=0;k<12;k++){ x.beginPath(); x.moveTo(hx-hw*.75+k*hw*.125,deck-hh+H*.003); x.lineTo(hx-hw*.69+k*hw*.125,deck-hh+H*.01); x.lineTo(hx-hw*.63+k*hw*.125,deck-hh+H*.003); x.fill(); }
      x.strokeStyle=mix(P.trunk,'#000000',.2); x.lineWidth=1; x.beginPath(); x.moveTo(hx+hw*.62,deck-H*.004); x.lineTo(hx+hw*1.3,hz-H*.016); x.stroke(); }
    // palms and the hammock slung between two of them
    v3palm(x,W*.74,hz-H*.016,H*.16,.18,P,3); v3palm(x,W*.83,hz-H*.02,H*.19,-.1,P,5); v3palm(x,W*.93,hz-H*.024,H*.15,.12,P,9);
    { const a=[W*.74+H*.16*.18*.75,hz-H*.016-H*.075], b=[W*.83-H*.19*.1*.65,hz-H*.02-H*.08]; x.strokeStyle=mix('#f0e0c0',P.trunk,.2); x.lineWidth=1; x.beginPath(); x.moveTo(a[0],a[1]); x.lineTo(a[0]+W*.012,a[1]+H*.02); x.moveTo(b[0],b[1]); x.lineTo(b[0]-W*.012,b[1]+H*.02); x.stroke();
      const hg=x.createLinearGradient(0,a[1],0,a[1]+H*.035); hg.addColorStop(0,mix('#e8604a',P.night>.5?'#303048':'#e8604a',P.night)); hg.addColorStop(1,mix('#f0c050',P.night>.5?'#303048':'#f0c050',P.night)); x.fillStyle=hg;
      x.beginPath(); x.moveTo(a[0]+W*.012,a[1]+H*.02); x.quadraticCurveTo((a[0]+b[0])/2,a[1]+H*.05,b[0]-W*.012,b[1]+H*.02); x.quadraticCurveTo((a[0]+b[0])/2,a[1]+H*.036,a[0]+W*.012,a[1]+H*.02); x.fill(); }
    v3water(x,P,hz,cnv,.3);
    // the reef below the surface: pale sand, then a few reef patches (rock mounds crowded with brain coral,
    // staghorn, sea fans, tube sponges and anemones), all seen through water that thickens with distance
    { const r=v3rng(88), top=hz+H*.09, corals=[P.coral,P.coral2,P.coral3];
      const sb=x.createLinearGradient(0,top,0,H); sb.addColorStop(0,v3rgba(mix(P.sand,P.wMid,.6),.0)); sb.addColorStop(.5,v3rgba(mix(P.sand,P.wMid,.5),.35)); sb.addColorStop(1,v3rgba(mix(P.sand,P.wMid,.35),.5)); x.fillStyle=sb; x.fillRect(0,top,W,H-top);
      for(const [px,py,ps] of [[.42,.52,.8],[.7,.6,1],[.92,.48,.7],[.55,.86,1.25],[.86,.9,1.15],[.33,.78,.9]]){
        const cx=W*px, cy=H*py; if(cy<hz+H*.08) continue; const k=clamp((cy-hz)/(H-hz),0,1), sc=H*.075*ps*(.5+k*.7), fade=.55-k*.3, rr=v3rng(Math.round(px*100+py*7));
        // rock base mound
        x.fillStyle=mix(mix(mix('#a8957a',P.wBot,P.night*.75),P.wMid,fade+.08),P.sand,.12); x.beginPath(); x.moveTo(cx-sc*2.3,cy); x.quadraticCurveTo(cx-sc*1.6,cy-sc*.55,cx-sc*.6,cy-sc*.5); x.quadraticCurveTo(cx,cy-sc*.75,cx+sc*.8,cy-sc*.45); x.quadraticCurveTo(cx+sc*1.8,cy-sc*.4,cx+sc*2.3,cy); x.closePath(); x.fill();
        x.fillStyle=v3rgba(P.wBot,.25); x.beginPath(); x.ellipse(cx,cy+sc*.05,sc*2.3,sc*.18,0,0,7); x.fill();
        const items=[]; for(let i=0;i<11;i++) items.push([cx+(rr()-.5)*sc*3.6,cy-sc*.1-rr()*sc*.4,i%5,rr()]); items.sort((a,b)=>a[1]-b[1]);
        for(const [ix,iy,kind,q] of items){ const s=sc*(.35+q*.35), col=mix(corals[(kind+Math.floor(q*3))%3],P.wMid,fade); x.fillStyle=col; x.strokeStyle=col;
          if(kind===0){ // brain coral: a dome with winding grooves
            x.beginPath(); x.ellipse(ix,iy,s*.9,s*.62,0,Math.PI,0); x.closePath(); x.fill(); x.strokeStyle=v3rgba(mix(col,'#000000',.35),.6); x.lineWidth=Math.max(.6,s*.05); x.beginPath(); for(let g2=0;g2<3;g2++){ const yy=iy-s*(.12+g2*.16); x.moveTo(ix-s*.7+g2*s*.12,yy); for(let k2=0;k2<5;k2++) x.quadraticCurveTo(ix-s*.55+g2*s*.12+k2*s*.25,yy-s*.08*(k2%2?1:-1),ix-s*.45+g2*s*.12+k2*s*.25,yy); } x.stroke();
            x.fillStyle=v3rgba(P.rim,.18); x.beginPath(); x.ellipse(ix-s*.25,iy-s*.42,s*.35,s*.1,-.2,0,7); x.fill(); }
          else if(kind===1){ // staghorn: forking branches with pale tips
            x.lineCap='round'; const br=(bx,by,a,len,dp)=>{ const ex=bx+Math.cos(a)*len, ey=by+Math.sin(a)*len; x.lineWidth=Math.max(1,s*.13*(1-dp*.25)); x.beginPath(); x.moveTo(bx,by); x.lineTo(ex,ey); x.stroke(); if(dp<2){ br(ex,ey,a-.45,len*.68,dp+1); br(ex,ey,a+.4,len*.7,dp+1); } else { x.fillStyle=mix(col,'#ffffff',.35); x.beginPath(); x.arc(ex,ey,Math.max(.8,s*.06),0,7); x.fill(); x.fillStyle=col; } };
            br(ix,iy,-Math.PI/2-.3,s*.45,0); br(ix,iy,-Math.PI/2+.35,s*.4,0); x.lineCap='butt'; }
          else if(kind===2){ // sea fan: a lacy fan on a short stalk
            x.globalAlpha=.8; x.beginPath(); x.moveTo(ix,iy); x.quadraticCurveTo(ix-s*1.1,iy-s*.9,ix-s*.35,iy-s*1.5); x.quadraticCurveTo(ix+s*.2,iy-s*1.7,ix+s*.7,iy-s*1.25); x.quadraticCurveTo(ix+s*1.05,iy-s*.7,ix,iy); x.fill(); x.globalAlpha=1;
            x.strokeStyle=v3rgba(mix(col,'#ffffff',.3),.5); x.lineWidth=.7; x.beginPath(); for(let b2=0;b2<6;b2++){ const a=-Math.PI*.82+b2*.23; x.moveTo(ix,iy); x.quadraticCurveTo(ix+Math.cos(a)*s*.6,iy+Math.sin(a)*s*.7,ix+Math.cos(a)*s*1.2,iy+Math.sin(a)*s*1.45); } x.stroke(); }
          else if(kind===3){ // tube sponges: a cluster of upright tubes with dark mouths
            for(let tb=0;tb<3;tb++){ const tx2=ix+(tb-1)*s*.32, th2=s*(.7+((tb*7)%3)*.25); x.fillStyle=col; x.fillRect(tx2-s*.12,iy-th2,s*.24,th2); x.fillStyle=mix(col,'#000000',.45); x.beginPath(); x.ellipse(tx2,iy-th2,s*.12,s*.05,0,0,7); x.fill(); x.fillStyle=v3rgba(P.rim,.15); x.fillRect(tx2-s*.1,iy-th2,s*.05,th2); } }
          else { // anemone: soft tentacles in a tuft
            x.lineCap='round'; x.lineWidth=Math.max(1,s*.09); x.beginPath(); for(let tn=0;tn<7;tn++){ const a=-Math.PI/2+(tn-3)*.28; x.moveTo(ix,iy); x.quadraticCurveTo(ix+Math.cos(a)*s*.3,iy+Math.sin(a)*s*.45,ix+Math.cos(a)*s*.55+Math.sin(tn)*s*.1,iy+Math.sin(a)*s*.65); } x.stroke(); x.lineCap='butt'; } } }
      // the water column over everything, thicker with distance
      const tg=x.createLinearGradient(0,top,0,H); tg.addColorStop(0,v3rgba(P.wMid,.5)); tg.addColorStop(.45,v3rgba(P.wMid,.15)); tg.addColorStop(1,v3rgba(P.wBot,.22)); x.fillStyle=tg; x.fillRect(0,top-H*.05,W,H-top+H*.05); }
  },
  live(P,t,hz,sun){ const FX=S.settings.effects, night=P.night, d=P.d;
    v3glitter(P,t,hz,sun);
    // caustics: a wobbling web of light on the sandy bottom, finer far away and bolder close up
    const ca=(1-night*.85)*(1-P.gloom)*(.13+.06*(1-d)); if(FX&&ca>.03){ g.save(); g.globalCompositeOperation='lighter'; g.lineJoin='round';
      const nR=15, nC=30, y0=hz+H*.035, pt=(r,c)=>{ const k=Math.pow(r/nR,1.35), y=y0+k*(H-y0+H*.05), ch=(H-y0)/nR*(.5+k*1.2), cw=W*1.1/nC; return [-W*.05+c*cw+Math.sin(t*1.05+c*1.7+r*2.3)*cw*.34+Math.sin(c*3.1+r*1.9)*cw*.2, y+Math.cos(t*.85+c*2.1+r*1.3)*ch*.3]; };
      const line=(get,n)=>{ let p0=get(0); g.moveTo(p0[0],p0[1]); for(let i=1;i<n;i++){ const p1=get(i), p2=get(Math.min(n-1,i+1)); g.quadraticCurveTo(p1[0],p1[1],(p1[0]+p2[0])/2,(p1[1]+p2[1])/2); } };
      for(let r=0;r<=nR;r++){ const k=r/nR, fade=Math.min(1,k*3.2); /* rows fade in with distance: no hard top edge */ g.strokeStyle=v3rgba(mix(P.wTop,'#ffffff',.7),ca*(.35+k*.65)*fade*fade); g.lineWidth=.6+k*1.8; g.beginPath(); line(c=>pt(r,c),nC+1); g.stroke(); }
      const vg=g.createLinearGradient(0,y0,0,y0+(H-y0)*.4); vg.addColorStop(0,v3rgba(mix(P.wTop,'#ffffff',.7),0)); vg.addColorStop(1,v3rgba(mix(P.wTop,'#ffffff',.7),ca*.75)); for(let c=0;c<=nC;c++){ g.strokeStyle=vg; g.lineWidth=1.1; g.beginPath(); line(r=>pt(r,c),nR+1); g.stroke(); }
      g.restore(); }
    // the sea turtle surfaces now and then for a breath, then glides back down
    { const per=19, k=(t%per)/per; if(k<.32){ const e=k/.32, up=Math.sin(e*Math.PI), tx=W*(.62-e*.12), ty=hz+H*.2+(1-up)*H*.03, s=H*.007, tc=mix('#6a8a4a',P.wMid,Math.min(1,(1-up)*.6+night*.55));
        g.globalAlpha=.35+up*.65; g.fillStyle=mix(tc,'#c8b878',.3); for(const [fx,fy,ro] of [[-1.6,.6,.6+Math.sin(t*3)*.4],[1.4,.7,-.6-Math.sin(t*3)*.4]]){ g.save(); g.translate(tx+fx*s,ty+fy*s); g.rotate(ro); g.beginPath(); g.ellipse(0,s*.8,s*.5,s*1.4,0,0,7); g.fill(); g.restore(); }
        g.fillStyle=tc; g.beginPath(); g.ellipse(tx,ty,s*2.6,s*1.6,0,0,7); g.fill(); g.strokeStyle=v3rgba(mix(tc,'#000000',.4),.7); g.lineWidth=.8; g.beginPath(); g.moveTo(tx-s*1.5,ty); g.lineTo(tx+s*1.5,ty); g.moveTo(tx,ty-s*1.4); g.lineTo(tx,ty+s*1.4); g.stroke();
        g.fillStyle=mix(tc,'#c8b878',.35); g.beginPath(); g.ellipse(tx-s*3,ty-s*.2-up*s*.6,s*.9,s*.75,0,0,7); g.fill(); g.fillStyle='#1a1a1a'; g.fillRect(tx-s*3.4,ty-s*.5-up*s*.6,s*.35,s*.35); g.globalAlpha=1;
        if(up>.7){ g.strokeStyle=v3rgba('#ffffff',(up-.7)*1.6); g.lineWidth=1; g.beginPath(); g.ellipse(tx-s*.5,ty,s*4*(1.5-up*.5),s*1.2,0,0,7); g.stroke(); } } }
    // parrots flit between the palms
    if(night<.6){ const per=17, k=(t%per)/per; if(k<.25){ const e=k/.25; for(let i=0;i<2;i++){ const px=W*(.95-e*.35-i*.02), py=hz-H*(.12+Math.sin(e*Math.PI)*.08)-i*H*.012, s=H*.005, fl=Math.sin(t*16+i*2);
        g.fillStyle=i?'#3a8ae8':'#e83a3a'; g.beginPath(); g.ellipse(px,py,s*1.8,s*.8,-.1,0,7); g.fill(); g.fillStyle=i?'#f0d040':'#3aa8e8'; g.beginPath(); g.moveTo(px-s*.2,py); g.lineTo(px+s*.6,py-s*2.4*fl); g.lineTo(px+s*1.2,py); g.fill();
        g.fillStyle=i?'#3a8ae8':'#e83a3a'; g.beginPath(); g.moveTo(px+s*1.6,py); g.lineTo(px+s*3.4,py+s*.6); g.lineTo(px+s*1.6,py+s*.4); g.fill(); g.fillStyle='#f0e0a0'; g.beginPath(); g.moveTo(px-s*1.8,py-s*.2); g.lineTo(px-s*2.4,py+s*.2); g.lineTo(px-s*1.7,py+s*.3); g.fill(); } } }
    // a small school of fish darts across the reef
    if(FX){ const per=11, k=(t%per)/per, sx=W*(1.1-k*1.4), sy=hz+H*.34+Math.sin(t*.7)*H*.02; g.fillStyle=v3rgba(mix('#ffd84a',P.wMid,.45),.7*(1-night*.7)); for(let i=0;i<7;i++){ const fx=sx+(i%4)*W*.012+Math.sin(t*3+i)*2, fy=sy+Math.floor(i/4)*H*.012+(i%2)*H*.006; g.beginPath(); g.ellipse(fx,fy,H*.006,H*.0025,0,0,7); g.fill(); g.beginPath(); g.moveTo(fx+H*.005,fy); g.lineTo(fx+H*.009,fy-H*.003); g.lineTo(fx+H*.009,fy+H*.003); g.fill(); } }
    v3fishRing(P,t,hz,6.7,.42,.85);
  },
  fore(P,t){ // a palm frond reaching in from the top right corner, swaying
    const sw=Math.sin(t*.8)*.04+Math.sin(t*1.9)*.015, ox=W+H*.02, oy=-H*.04, L=H*.34, a=Math.PI*.72+sw, ex=ox+Math.cos(a)*L, ey=oy+Math.sin(a)*L, cx=ox+Math.cos(a-.25)*L*.5, cy=oy+Math.sin(a-.25)*L*.5;
    g.strokeStyle=mix(P.frondD,'#000000',.2); g.lineWidth=Math.max(2,H*.006); g.beginPath(); g.moveTo(ox,oy); g.quadraticCurveTo(cx,cy,ex,ey); g.stroke();
    for(let k=1;k<16;k++){ const u=k/16, mx=(1-u)*(1-u)*ox+2*u*(1-u)*cx+u*u*ex, my=(1-u)*(1-u)*oy+2*u*(1-u)*cy+u*u*ey, ll=H*.07*(1-u*.55), wob=Math.sin(t*2.2+k)*.06;
      for(const sd of [-1,1]){ const aa=a+sd*(1.1+wob)+.35; g.fillStyle=k%2?P.frond:P.frondD; g.beginPath(); g.moveTo(mx,my); g.quadraticCurveTo(mx+Math.cos(aa)*ll*.5+sd*2,my+Math.sin(aa)*ll*.5,mx+Math.cos(aa)*ll,my+Math.sin(aa)*ll+ll*.25); g.quadraticCurveTo(mx+Math.cos(aa)*ll*.4,my+Math.sin(aa)*ll*.4+ll*.2,mx,my+H*.004); g.fill(); } }
  }
};
wx3SkyLayer('reef');
wx3WaterLayer('reef');
l3wakeLayer('reef');
m33wrap('reef','live',function(P,t,hz){ const night=P.night, FX=S.settings.effects, foam=mix(P.wTop,'#ffffff',.8);
  // surf on the outer reef line: white water rising and falling in sets
  { const y=hz+H*.012; for(let i=0,n=gfxHigh()?40:26;i<n;i++){ const x=W*(.28+i/n*.7), set=Math.max(0,Math.sin(t*.7+i*.35)), h=H*.006*set; if(set<.15) continue; g.fillStyle=v3rgba(foam,.6*set); g.beginPath(); g.ellipse(x,y-h*.4,W*.01,Math.max(.6,h),0,0,7); g.fill(); }
    g.strokeStyle=v3rgba(foam,.35); g.lineWidth=1; g.beginPath(); for(let X=W*.27;X<=W;X+=8){ const yy=y+H*.004+Math.sin(X*.05+t*1.4)*.8; X<=W*.27?g.moveTo(X,yy):g.lineTo(X,yy); } g.stroke(); }
  // a gannet: circles, folds its wings and plunges, a splash, then flies off
  if(night<.7){ const per=24, q=(t%per)/per, bx=W*.68, sy=hz*.4, s=H*.006, wc=mix('#f4f4f0',P.top,night*.8);
    if(q<.4){ const a=q/.4*Math.PI*2, x=bx+Math.cos(a)*W*.06, y=sy+Math.sin(a)*hz*.05, fl=Math.sin(t*6)*.6; g.strokeStyle=wc; g.lineWidth=Math.max(1,s*.45); g.beginPath(); g.moveTo(x-s*3,y-s*fl); g.quadraticCurveTo(x-s*1.4,y-s*.8,x,y); g.quadraticCurveTo(x+s*1.4,y-s*.8,x+s*3,y-s*fl); g.stroke(); }
    else if(q<.5){ const e=(q-.4)/.1, x=bx+W*.06, y=sy+(hz+H*.06-sy)*e*e; g.fillStyle=wc; g.beginPath(); g.moveTo(x,y+s*2.4); g.lineTo(x-s*.7,y-s*1.4); g.lineTo(x+s*.7,y-s*1.4); g.closePath(); g.fill(); }
    else if(q<.62&&FX){ const e=(q-.5)/.12, x=bx+W*.06, y=hz+H*.06; for(let j=0;j<9;j++){ const ang=-Math.PI/2+(j-4)*.3, r=s*(1+e*5); g.fillStyle=v3rgba(foam,.8*(1-e)); g.beginPath(); g.arc(x+Math.cos(ang)*r,y+Math.sin(ang)*r*1.6,1.3,0,7); g.fill(); } g.strokeStyle=v3rgba(foam,.6*(1-e)); g.beginPath(); g.ellipse(x,y,s*(2+e*7),s*(.5+e*1.6),0,0,7); g.stroke(); } }
  // a ray gliding over the sand, its wings rippling
  { const per=48, q=(t%per)/per, a=l3s(Math.min(1,q/.1))*l3s(Math.min(1,(1-q)/.1)), x=W*(1.05-q*.85), y=hz+H*(.42+Math.sin(q*6)*.03), s=H*.012, fl=Math.sin(t*2.4)*.25;
    g.save(); g.globalAlpha=.32*a; g.fillStyle=mix(P.wBot,'#000000',.2); g.beginPath(); g.moveTo(x-s*1.4,y); g.quadraticCurveTo(x,y-s*(1.4+fl),x+s*1.6,y); g.quadraticCurveTo(x,y+s*(1.4-fl),x-s*1.4,y); g.fill(); g.lineWidth=1; g.strokeStyle=g.fillStyle; g.beginPath(); g.moveTo(x+s*1.4,y); g.lineTo(x+s*3.4,y+Math.sin(t*2)*s*.3); g.stroke(); g.restore(); }
  // a bait ball: a dark shoal swirling just under the surface, flashing silver as it turns
  { const cx=W*.5+Math.sin(t*.07)*W*.12, cy=hz+H*.26, R=H*.04; for(let i=0,n=gfxHigh()?40:24;i<n;i++){ const a=t*.9+i*.7, r=R*(.4+l3hash(i)*.6), x=cx+Math.cos(a)*r*1.6, y=cy+Math.sin(a)*r*.5, fl=Math.sin(a*2+t*3)>.85; g.fillStyle=fl?v3rgba('#e8f4ff',.7):v3rgba(mix(P.wBot,'#000000',.2),.35); g.fillRect(x,y,2.4,1); } }
});
depthHazeLayer('reef');
depthMotesLayer('reef');
