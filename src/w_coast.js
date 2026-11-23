// =====================================================================
// Saltmarsh Coast: its whole scene in one file (Clean Scenes 5, 2026-11-22): the scene itself, then every piece drawn on top, in the
// order they draw (each hook: land = the cached still scenery, sky, live = moving things, fore = the bottom edge). Shared layers
// (weather, the float's wake, wind gusts, depth haze and motes) are added here by name, at their place in that order. Its colours stay
// in V3PAL (f_v3scene.js / f2_areas.js) and shared drawing helpers stay in their files.
// =====================================================================
V3SCENES.coast = {
  land(x,P,hz,cnv){
    // the open sea runs to the horizon on the left; low dunes and a rocky headland rise on the right
    const sh=x.createLinearGradient(0,hz-H*.02,0,hz); sh.addColorStop(0,v3rgba(P.farHaze,0)); sh.addColorStop(1,v3rgba(P.farHaze,.6)); x.fillStyle=sh; x.fillRect(0,hz-H*.02,W,H*.02);
    // a distant dune line far left, barely there
    x.fillStyle=mix(P.far,P.farHaze,.4); x.beginPath(); x.moveTo(0,hz+1); x.lineTo(0,hz-H*.022); x.quadraticCurveTo(W*.06,hz-H*.032,W*.12,hz-H*.012); x.quadraticCurveTo(W*.16,hz-H*.004,W*.2,hz+1); x.closePath(); x.fill();
    // dunes on the right, two layers, with grass fringes
    v3hillBand(x,hz+1,[[.5,0],[.56,.012*H],[.64,.04*H],[.72,.03*H],[.8,.055*H],[.9,.05*H],[1,.06*H]],mix(P.sandD,P.farHaze,.3));
    x.save(); x.beginPath(); x.rect(W*.5,0,W*.5,H); x.clip();
    const dg=x.createLinearGradient(0,hz-H*.04,0,hz); dg.addColorStop(0,mix(P.sand,P.rim,.25)); dg.addColorStop(1,mix(P.sand,P.sandD,.6)); v3hillBand(x,hz+1,[[.52,0],[.6,.008*H],[.68,.026*H],[.76,.018*H],[.84,.034*H],[.93,.03*H],[1,.036*H]],dg);
    x.restore();
    const r=v3rng(71); x.strokeStyle=P.grass; x.lineWidth=1;
    for(let i=0;i<90;i++){ const gx=W*(.6+r()*.4), top=hz-H*(.008+.028*Math.max(0,(gx/W-.58)/.42))*(.7+r()*.3), gh=H*(.006+r()*.008); x.beginPath(); for(let k=0;k<3;k++){ x.moveTo(gx+k*1.2,top+gh*.2); x.quadraticCurveTo(gx+k*1.2-gh*.2,top-gh*.5,gx+k*1.2-gh*.6+k*.6,top-gh); } x.stroke(); }
    // a weathered fence line running over the dunes
    x.strokeStyle=mix(P.wood,P.farHaze,.3); x.lineWidth=1.2; for(let i=0;i<9;i++){ const fx=W*(.62+i*.022), fy=hz-H*(.012+i*.0022); x.beginPath(); x.moveTo(fx,fy); x.lineTo(fx+.6,fy-H*.012); x.stroke(); }
    x.beginPath(); x.moveTo(W*.62,hz-H*.02); x.quadraticCurveTo(W*.71,hz-H*.026,W*.8,hz-H*.036); x.stroke();
    // the rocky headland with the lighthouse
    { const lx=W*.86, base=hz-H*.03;
      for(const [ox,rh,rw,sd] of [[-.06,.03,.05,11],[.04,.035,.06,12],[-.01,.024,.045,13],[.07,.028,.035,14]]) v3rock(x,lx+W*ox,hz+H*.004,W*rw,H*rh,P,null,false,sd);
      const bw=H*.032, tw=H*.022, th=H*.2, ty=base-th;
      const tower=()=>{ x.beginPath(); x.moveTo(lx-bw,base); x.lineTo(lx-tw,ty); x.lineTo(lx+tw,ty); x.lineTo(lx+bw,base); x.closePath(); };
      x.fillStyle=P.lh; tower(); x.fill(); x.save(); tower(); x.clip();
      x.fillStyle=P.lhS; for(let i=0;i<3;i++){ const y0=base-th*(.18+i*.28); x.fillRect(lx-bw,y0-th*.12,bw*2,th*.12); }
      const tg=x.createLinearGradient(lx-bw,0,lx+bw,0); tg.addColorStop(0,'rgba(20,15,40,.38)'); tg.addColorStop(.45,'rgba(0,0,0,0)'); tg.addColorStop(.85,v3rgba(P.rim,.22)); tg.addColorStop(1,'rgba(20,15,40,.1)'); x.fillStyle=tg; x.fillRect(lx-bw,ty,bw*2,th);
      x.fillStyle='rgba(20,20,40,.5)'; x.fillRect(lx-tw*.18,base-th*.62,tw*.36,th*.06); x.fillRect(lx-tw*.2,base-th*.32,tw*.4,th*.07); x.restore();
      // the door and a little keeper's cottage beside it
      x.fillStyle=mix(P.lhS,'#000000',.4); x.beginPath(); x.moveTo(lx-bw*.25,base); x.lineTo(lx-bw*.25,base-th*.08); x.arc(lx,base-th*.08,bw*.25,Math.PI,0); x.lineTo(lx+bw*.25,base); x.fill();
      x.fillStyle=mix(P.lh,P.sandD,.25); x.fillRect(lx+bw*.9,base-H*.022,H*.04,H*.022); x.fillStyle=P.lhS; x.beginPath(); x.moveTo(lx+bw*.8,base-H*.021); x.lineTo(lx+bw*.9+H*.02,base-H*.036); x.lineTo(lx+bw*1.0+H*.04,base-H*.021); x.closePath(); x.fill();
      // gallery, lantern room frame, dome
      x.fillStyle=mix(P.stoneD,'#000000',.3); x.fillRect(lx-tw*1.45,ty-H*.004,tw*2.9,H*.005); x.fillRect(lx-tw*1.45,ty-H*.012,tw*2.9,1.2); for(let i=0;i<7;i++) x.fillRect(lx-tw*1.45+i*tw*2.9/6-.6,ty-H*.012,1.2,H*.008);
      x.fillStyle=mix(P.stoneD,'#000000',.4); x.fillRect(lx-tw*.8,ty-H*.032,1.6,H*.028); x.fillRect(lx+tw*.8-1.6,ty-H*.032,1.6,H*.028); x.fillRect(lx-1,ty-H*.032,2,H*.028);
      x.fillStyle=P.lhS; x.beginPath(); x.moveTo(lx-tw*1.05,ty-H*.031); x.quadraticCurveTo(lx,ty-H*.06,lx+tw*1.05,ty-H*.031); x.closePath(); x.fill();
      x.fillStyle=mix(P.stoneD,'#000000',.4); x.fillRect(lx-.8,ty-H*.066,1.6,H*.012); x.beginPath(); x.arc(lx,ty-H*.067,1.6,0,7); x.fill(); }
    v3water(x,P,hz,cnv,.3);
  },
  live(P,t,hz,sun){ const FX=S.settings.effects, night=P.night, d=P.d;
    // the lighthouse lamp; after dusk its beam sweeps round, flaring when it faces you
    { const lx=W*.86, ly=hz-H*.03-H*.2-H*.018, lit=clamp(night*1.4+d*1.1,0,1);
      if(lit>.04){ const a=t*.7, face=Math.cos(a), dir=Math.sin(a)>0?1:-1, len=W*(.35+.25*Math.abs(Math.sin(a)));
        /* 0.3.3: no hard beam; a layered soft glow that swells as the turning lamp faces you, and a shimmer on the water */
        const sw=.5+.5*face, soft=sw*sw;
        v3glow(g,lx,ly,H*.3,'rgba(255,226,160,.9)',lit*(.08+.1*soft)); v3glow(g,lx,ly,H*(.1+.04*soft),'rgba(255,236,180,.95)',lit*(.32+.3*soft)); v3glow(g,lx,ly,H*.035,'rgba(255,250,225,1)',lit*(.6+.35*soft));
        if(typeof v3lanternReflect==='function') v3lanternReflect(lx,hz+2,lit*(.55+.35*soft),t,'255,226,160');
        g.fillStyle=v3rgba('#fff6d0',.5+lit*.5); g.fillRect(lx-H*.012,ly-H*.008,H*.024,H*.016); }
      else { g.fillStyle=v3rgba(mix(P.farHaze,'#ffffff',.4),.7); g.fillRect(lx-H*.012,ly-H*.008,H*.024,H*.016); g.fillStyle=v3rgba(P.rim,.6); g.fillRect(lx+H*.003,ly-H*.007,H*.004,H*.014); } }
    v3glitter(P,t,hz,sun);
    // the surf where the sea meets the dunes, breathing in and out
    { const sw=Math.sin(t*.9)*W*.006; g.fillStyle=v3rgba(mix(P.wTop,'#ffffff',.7),.55); g.beginPath(); g.moveTo(W*.5,hz+1); for(let i=0;i<=20;i++){ const u=i/20, X=W*(.5+u*.5)+sw*u; g.lineTo(X,hz+1.5+Math.sin(u*25+t*2)*.8+u*H*.004); } g.lineTo(W,hz); g.closePath(); g.fill(); }
    // rolling swells, each with a lit face and a foamy crest, coming in toward you
    const foam=mix(P.wTop,'#ffffff',.78), N=7;
    for(let r0=0;r0<N;r0++){ const u=((t*.035+r0/N)%1), y=hz+H*.02+Math.pow(u,1.5)*(H-hz)*1.02, amp=1+u*H*.012, a=Math.sin(u*Math.PI), sp=W*(.18-u*.06), off=r0*137;
      if(a<.05) continue;
      g.fillStyle=v3rgba(P.wTop,.22*a); g.beginPath(); g.moveTo(0,y+amp*2);
      for(let X=0;X<=W+8;X+=8){ const yy=y-amp*(.6+.4*Math.sin((X+off)/sp*Math.PI*2+t*.6)); g.lineTo(X,yy); } g.lineTo(W,y+amp*2.5); g.closePath(); g.fill();
      g.strokeStyle=v3rgba(foam,.5*a); g.lineWidth=Math.max(1,u*2.2); g.beginPath();
      for(let X=0;X<=W;X+=6){ const yy=y-amp*(.6+.4*Math.sin((X+off)/sp*Math.PI*2+t*.6)), on=V3CN((X+off)*.012+r0*3.1)>.42; if(on){ g.moveTo(X,yy); g.lineTo(X+6,yy-.2); } } g.stroke();
      if(FX&&u>.35){ g.fillStyle=v3rgba(foam,.35*a); for(let i=0;i<10;i++){ const fx=((i*173+off)%W), fy=y+amp*(1.2+((i*31)%7)*.25); g.fillRect(fx,fy,2+u*3,1); } } }
    // gulls glide on the wind
    if(night<.7){ for(let i=0;i<3;i++){ const per=24+i*7, k=((t+i*9)%per)/per, gx=W*(1.1-k*1.3), gy=hz*(.35+i*.14)+Math.sin(t*.8+i)*hz*.03, s=H*(.006+i*.0015), fl=Math.sin(t*(3+i)+i)*.7;
        g.strokeStyle=v3rgba(mix('#ffffff',P.top,night*.8),.9); g.lineWidth=Math.max(1,s*.5); g.beginPath(); g.moveTo(gx-s*2.2,gy-s*fl*.8); g.quadraticCurveTo(gx-s,gy-s*(.4+fl*.6),gx,gy); g.quadraticCurveTo(gx+s,gy-s*(.4+fl*.6),gx+s*2.2,gy-s*fl*.8); g.stroke(); } }
    v3fishRing(P,t,hz,7.3,.42,.85);
    // a bell buoy offshore (overnight 2026-11-23, MAP_THEMES: "a far-off bell buoy"): a red float with a little tower and bell, rocking on the swell; its light blinks at night
    { const bx=W*.4, by=hz+H*.04, s=H*.011, a=Math.sin(t*1.1)*.18, N=c0=>mix(c0,P.wMid,night*.55); g.save(); g.translate(bx,by+Math.sin(t*1.1+1)*s*.15); g.rotate(a);
      g.fillStyle=N('#c8483a'); g.beginPath(); g.moveTo(-s*1.1,0); g.lineTo(s*1.1,0); g.lineTo(s*.8,s*.55); g.lineTo(-s*.8,s*.55); g.closePath(); g.fill(); g.fillStyle=N('#f4f0e6'); g.fillRect(-s*1.1,-s*.12,s*2.2,s*.18);
      g.strokeStyle=N('#3a3a40'); g.lineWidth=Math.max(1,s*.12); g.beginPath(); g.moveTo(-s*.6,0); g.lineTo(-s*.2,-s*2); g.lineTo(s*.2,-s*2); g.lineTo(s*.6,0); g.moveTo(-s*.4,-s); g.lineTo(s*.4,-s); g.stroke(); g.fillStyle=N('#b8902a'); g.beginPath(); g.arc(0,-s*1.35,s*.32,Math.PI,0); g.fill();
      if(night>.3&&(t%3)<.5) v3glow(g,0,-s*2.2,s*2.5,'rgba(255,90,70,.9)',night); g.restore();
      g.fillStyle=v3rgba('#ffffff',.25*(1-night*.5)); g.fillRect(bx-s*1.4,by+s*.5,s*2.8,1.2); }
    // the moment, every 42 s (map standard, 2026-11-21): a pod of porpoises rolls past out on the far water, backs and fins arcing up
    // and under, each a little apart; the pod is three or four strong and takes its own line each time
    { const per=42, q=t%per, n=Math.floor(t/per); if(q<9){ const r=v3rng(n*53+9), np=3+(r()<.5?1:0), yy=hz+H*(.022+r()*.012) /* far out, beyond the seal's rock, so nothing pops up beside it (director) */, col=mix('#3a4652',P.wMid,.25+night*.5), s=H*.011*(1+(yy-hz)/H*2);
      for(let i=0;i<np;i++){ const e=(q-i*.55)/9; if(e<0||e>1) continue; const cx=W*(.95-e*.5)+i*s*3, k=((q*.9+i*.37)%1.6)/1.6, up=k<.5?Math.sin(k/.5*Math.PI):0, by=yy+i*H*.004;
        if(up>.02){ g.save(); g.beginPath(); g.rect(0,0,W,by); g.clip(); g.fillStyle=col; g.beginPath(); g.ellipse(cx,by+s*(1.2-up*1.6),s*2.6,s*1.1,0,Math.PI,0); g.fill();
          g.beginPath(); g.moveTo(cx-s*.2,by-s*(up*1.6-1.2)-s*.9); g.lineTo(cx+s*.5,by-s*(up*1.6-1.2)-s*1.9); g.lineTo(cx+s*.9,by-s*(up*1.6-1.2)-s*.9); g.fill(); g.restore(); }
        if(FX&&k<.62){ const kk=k/.62; g.strokeStyle=v3rgba(mix(P.wTop,'#ffffff',.6),.45*(1-kk)); g.lineWidth=1; g.beginPath(); g.ellipse(cx,by,s*(2+kk*3),s*(.35+kk*.4),0,0,7); g.stroke(); } } } }
  },
  fore(P,t){ // a sandy corner with marram grass bending in the wind
    const b=H+2, wind=Math.sin(t*1.3)*.5+Math.sin(t*2.9)*.2;
    g.fillStyle=mix(P.sand,P.wBot,.15); g.beginPath(); g.moveTo(W*.84,b); g.quadraticCurveTo(W*.92,b-H*.05,W+2,b-H*.07); g.lineTo(W+2,b); g.closePath(); g.fill();
    g.fillStyle=v3rgba(P.rim,.2); g.beginPath(); g.moveTo(W*.87,b-H*.012); g.quadraticCurveTo(W*.93,b-H*.052,W+2,b-H*.068); g.lineTo(W+2,b-H*.06); g.quadraticCurveTo(W*.93,b-H*.044,W*.87,b-H*.012); g.fill();
    for(let i=0;i<16;i++){ const fx=W*(.88+i*.0075), fy=b-H*(.02+i*.0028), h=H*(.06+((i*7)%5)*.012), bend=(wind+.6)*h*.35+Math.sin(t*3+i)*h*.04;
      g.strokeStyle=mix(i%3?P.grass:mix(P.grass,P.sand,.4),P.wBot,.1+P.night*.3); g.lineWidth=Math.max(1,H*.0025); g.beginPath(); g.moveTo(fx,fy); g.quadraticCurveTo(fx-bend*.3,fy-h*.6,fx-bend,fy-h); g.stroke(); }
  }
};
m33wrap('coast','land',function(x,P,hz){
  const farC=mix(P.far,P.grass,.35), rock=mix(P.stone,P.far,.35);
  // the headland: grassy top, a cliff face with strata dropping to the sea
  x.fillStyle=farC; M33.headland(x,hz); x.fill();
  x.save(); M33.headland(x,hz); x.clip();
  x.fillStyle=rock; x.beginPath(); x.moveTo(W*.2,hz-H*.058); x.lineTo(W*.246,hz-H*.05); x.lineTo(W*.252,hz-H*.03); x.lineTo(W*.262,hz-H*.016); x.lineTo(W*.27,hz+1); x.lineTo(W*.21,hz+1); x.quadraticCurveTo(W*.225,hz-H*.03,W*.2,hz-H*.058); x.fill();
  x.strokeStyle=v3rgba(mix(P.stoneD,P.far,.3),.6); x.lineWidth=1; for(let k=0;k<4;k++){ const y=hz-H*(.045-k*.011); x.beginPath(); x.moveTo(W*.214+k*W*.004,y); x.lineTo(W*.26,y+H*.004); x.stroke(); }
  const hg=x.createLinearGradient(0,hz-H*.09,0,hz); hg.addColorStop(0,v3rgba(P.rim,.18)); hg.addColorStop(1,v3rgba(P.farHaze,.45)); x.fillStyle=hg; x.fillRect(0,hz-H*.09,W*.28,H*.09);
  x.restore();
  /* map redo (director, 2026-11-22: "great buildings slapped onto some garbage", the land needs depth and love): terraced fields held
     by dry-stone walls with gorse along them, a footpath zig-zagging down, and a stone harbour wall at the water with two fishing boats */
  { const st=mix('#9a948a',P.far,.15), stD=mix('#5a564e',P.far,.15), fr=v3rng(97); x.save(); M33.headland(x,hz); x.clip();
    for(const [k,y0] of [[0,.062],[1,.045],[2,.03]]){ const yy=f=>hz-H*(y0-.006*Math.sin(f*7+k)); x.fillStyle=mix(farC,k%2?'#d8c890':'#6a8a4a',.18); x.beginPath(); x.moveTo(0,yy(0)); for(let X=0;X<=W*.27;X+=W*.01) x.lineTo(X,yy(X/W)); x.lineTo(W*.27,yy(.27)+H*.016); x.lineTo(0,yy(0)+H*.016); x.closePath(); x.fill();
      x.strokeStyle=stD; x.lineWidth=Math.max(1.5,H*.003); x.beginPath(); x.moveTo(0,yy(0)); for(let X=0;X<=W*.27;X+=W*.01) x.lineTo(X,yy(X/W)); x.stroke();
      x.fillStyle=st; for(let X=W*.004;X<W*.26;X+=W*.007) x.fillRect(X,yy(X/W)-1.2,W*.005,1.2);
      x.fillStyle=mix('#d8b830',P.far,.3); for(let i=0;i<9;i++){ const X=fr()*W*.25; x.beginPath(); x.arc(X,yy(X/W)-H*.003,H*.003,0,7); x.fill(); } }
    x.strokeStyle=mix('#e0d4b0',P.far,.3); x.lineWidth=Math.max(1.2,H*.0025); x.beginPath(); x.moveTo(W*.16,hz-H*.068); x.lineTo(W*.1,hz-H*.05); x.lineTo(W*.17,hz-H*.034); x.lineTo(W*.11,hz-H*.018); x.lineTo(W*.15,hz-H*.006); x.stroke();
    x.restore();
    const qt=hz-H*.016; x.fillStyle=st; x.fillRect(-2,qt,W*.22,hz+1-qt); x.strokeStyle=stD; x.lineWidth=.8; x.beginPath(); for(let yy=qt+H*.004,row=0;yy<hz;yy+=H*.004,row++){ x.moveTo(0,yy); x.lineTo(W*.22,yy); for(let X=(row%2)*W*.004;X<W*.22;X+=W*.008){ x.moveTo(X,yy-H*.004); x.lineTo(X,yy); } } x.stroke();
    x.fillStyle=v3rgba(P.rim,.35); x.fillRect(-2,qt,W*.22,1); for(const bx of [.05,.13]){ x.fillStyle=stD; x.fillRect(W*bx,qt-H*.004,H*.004,H*.004); }
    for(const [bx,col] of [[.07,'#c8503a'],[.15,'#3a7a9a']]){ const s=H*.0045, by=hz-H*.001, hc=mix(col,P.far,.2); x.fillStyle=hc; x.beginPath(); x.moveTo(W*bx-s*7,by-s*1.6); x.lineTo(W*bx+s*7,by-s*1.6); x.quadraticCurveTo(W*bx+s*6,by+s*1.2,W*bx+s*3,by+s*1.4); x.lineTo(W*bx-s*4,by+s*1.4); x.quadraticCurveTo(W*bx-s*6.5,by+s*1,W*bx-s*7,by-s*1.6); x.fill();
      x.fillStyle=mix('#f0ead8',P.far,.2); x.fillRect(W*bx-s*7,by-s*1.9,s*14,s*.5); x.fillStyle=stD; x.fillRect(W*bx-s*.4,by-s*9,s*.8,s*7.5); x.strokeStyle=v3rgba(mix('#d8c49a',P.far,.3),.8); x.lineWidth=.8; x.beginPath(); x.moveTo(W*bx-s*7,by-s*1.6); x.lineTo(W*bx-s*9,qt); x.stroke(); } }
  /* the lighthouse side (director: "empty, bland and boring"): a row of striped beach huts on the dunes, a band of wet sand at the water,
     a rowboat pulled up on the beach and a stack of lobster pots */
  { const fr=v3rng(61), sand=mix(P.sandD||P.sand||'#c8b080',P.far,.15);
    x.fillStyle=v3rgba(mix(sand,'#3a3020',.35),.55); x.beginPath(); x.moveTo(W*.5,hz+1); x.quadraticCurveTo(W*.65,hz-H*.004,W*.78,hz-H*.003); x.lineTo(W*.78,hz+1); x.closePath(); x.fill();
    const cols=['#c8503a','#3a7a9a','#e0b040','#5a9a6a','#f0ead8'];
    for(let i=0;i<5;i++){ const hx=W*(.55+i*.028), hb=hz-H*(.009+.004*Math.sin(i)), hw=W*.016, hh=H*.022, c0=mix(cols[i],P.far,.2);
      x.fillStyle=mix('#f4efe6',P.far,.2); x.fillRect(hx-hw/2,hb-hh,hw,hh); x.fillStyle=c0; for(let k=0;k<4;k++) if(k%2===0) x.fillRect(hx-hw/2+k*hw/4,hb-hh,hw/4,hh);
      x.fillStyle=mix(c0,'#000000',.25); x.beginPath(); x.moveTo(hx-hw*.62,hb-hh); x.lineTo(hx,hb-hh-H*.012); x.lineTo(hx+hw*.62,hb-hh); x.closePath(); x.fill(); x.fillStyle=mix('#3a2a20',P.far,.3); x.fillRect(hx-hw*.15,hb-hh*.6,hw*.3,hh*.6); }
    { const s=H*.005, bx=W*.7, by=hz-H*.002, hc=mix('#e8e0cc',P.far,.2); x.save(); x.translate(bx,by); x.rotate(-.12); x.fillStyle=hc; x.beginPath(); x.moveTo(-s*6,-s*1.4); x.lineTo(s*6,-s*1.4); x.quadraticCurveTo(s*5,s*1.2,s*2,s*1.3); x.lineTo(-s*3,s*1.3); x.quadraticCurveTo(-s*5.6,s*.9,-s*6,-s*1.4); x.fill(); x.fillStyle=mix('#3a7a9a',P.far,.2); x.fillRect(-s*6,-s*1.6,s*12,s*.5); x.restore(); }
    for(const [px,py] of [[.735,0],[.745,0],[.74,-1]]){ const s=H*.004, X=W*px, Y=hz-H*.004+py*s*2.2; x.strokeStyle=mix('#8a6a4a',P.far,.3); x.lineWidth=.8; x.strokeRect(X-s*1.4,Y-s*2,s*2.8,s*2); x.beginPath(); x.moveTo(X-s*1.4,Y-s); x.lineTo(X+s*1.4,Y-s); x.stroke(); } }
  m33village(x,P,hz);
  m33reflect(x,hz,H*.07,.22,mix(farC,P.wMid,.5),()=>M33.headland(x,hz));
});
wx3SkyLayer('coast');
m33wrap('coast','live',function(P,t,hz){ const night=P.night, d=P.d, FX=S.settings.effects;
  // village windows light up after dusk, flickering now and then
  const lit=clamp(night*1.3+d*.8,0,1); if(lit>.05){ for(let i=0;i<M33.houses.length;i++){ const [hx,hh]=M33.houses[i], X=W*hx, base=m33groundY(hz,W*hx+H*.015)+H*.002, w=H*.03, h=H*hh, ph=((t/7+i*.37)%5), on=ph<4?1:Math.max(0,Math.abs(ph-4.5)*2-.0); /* a window goes dark for a while and fades back, never popping */ const a=lit*Math.min(1,on);
      if(a<.02) continue; g.fillStyle=v3rgba('#ffd27a',.55*a); g.fillRect(X+w*.18,base-h*.62,w*.2,h*.3); if(i%2) g.fillRect(X+w*.62,base-h*.62,w*.2,h*.3); v3glow(g,X+w*.4,base-h*.5,H*.02,'rgba(255,200,110,.9)',.18*a); } }
  // a sailboat crossing slowly along the horizon, rocking, its sail catching the light
  { const per=140, k=((t+40)%per)/per, bx=W*(-.08+k*1.16), by=hz+H*.01, s=H*.0042, rk=Math.sin(t*1.1)*.06;
    g.save(); g.translate(bx,by); g.rotate(rk); const hullC=mix('#7a3a2a',P.wMid,.25+night*.4), sailC=mix('#f8f2e4',P.top,night*.75);
    g.fillStyle=hullC; g.beginPath(); g.moveTo(-s*7,-s*.4); g.lineTo(s*7,-s*.4); g.lineTo(s*5,s*1.8); g.lineTo(-s*5.4,s*1.8); g.closePath(); g.fill();
    g.fillStyle=mix(P.wood||'#5a3a2a',P.wMid,.3); g.fillRect(-s*.4,-s*12,s*.6,s*11.6);
    g.fillStyle=sailC; g.beginPath(); g.moveTo(s*.4,-s*11.6); g.quadraticCurveTo(s*5.6,-s*6,s*5.2,-s*1.2); g.lineTo(s*.4,-s*1.2); g.closePath(); g.fill();
    g.beginPath(); g.moveTo(-s*.4,-s*10); g.quadraticCurveTo(-s*4,-s*5,-s*4.6,-s*1.4); g.lineTo(-s*.4,-s*1.4); g.closePath(); g.fill();
    g.fillStyle=v3rgba(P.rim,.35+d*.3); g.beginPath(); g.moveTo(s*.6,-s*11); g.quadraticCurveTo(s*3.2,-s*7,s*3,-s*2); g.lineTo(s*.6,-s*2); g.closePath(); g.fill();
    if(lit>.2) m33dot(g,s*.1,-s*12.2,s*.6,v3rgba('#ffe8a0',lit));
    g.restore(); g.save(); g.globalAlpha=.18; g.fillStyle=sailC; g.beginPath(); g.moveTo(bx+s*.4,by+s*3); g.lineTo(bx+s*4.6,by+s*3); g.lineTo(bx+s*.4,by+s*9); g.closePath(); g.fill(); g.restore(); }
  // a seal hauled out on a rock, lifting its head now and then; the swell foams round the rock
  { const rx=W*.62, ry=hz+H*.105, rw=W*.044, rh=H*.021, lift=Math.max(0,Math.sin(t*.55))**6;
    g.fillStyle=mix(P.stoneD,P.wMid,.25); g.beginPath(); g.moveTo(rx-rw,ry); g.quadraticCurveTo(rx-rw*.7,ry-rh*1.2,rx,ry-rh*1.3); g.quadraticCurveTo(rx+rw*.8,ry-rh*1.1,rx+rw,ry); g.closePath(); g.fill();
    g.fillStyle=v3rgba(P.rim,.25+d*.2); g.beginPath(); g.moveTo(rx-rw*.5,ry-rh*1.05); g.quadraticCurveTo(rx,ry-rh*1.35,rx+rw*.4,ry-rh*1.15); g.lineTo(rx+rw*.3,ry-rh*1); g.quadraticCurveTo(rx,ry-rh*1.15,rx-rw*.5,ry-rh*.9); g.fill();
    const sc=mix('#6a6a72',P.wBot,night*.5), sb=mix('#9a948a',P.wBot,night*.5), hx=rx+rw*.5, hy=ry-rh*1.55-lift*H*.006;
    // round 6 (director: "the most realism"): a real harbour seal: a tapered body with rear flippers, a round head with a snout
    // on a neck that lifts, a fore flipper, a lighter belly, spots, whiskers and a wet glint
    const sd=mix(sc,'#000000',.25), neckY=ry-rh*1.72-lift*H*.004;
    g.fillStyle=sc; g.beginPath(); g.moveTo(rx-rw*.56,ry-rh*1.36); g.quadraticCurveTo(rx-rw*.34,ry-rh*1.98,rx+rw*.05,ry-rh*1.9); g.quadraticCurveTo(rx+rw*.3,ry-rh*1.86,hx-rw*.06,neckY); g.lineTo(hx+rw*.02,hy+rh*.2); g.quadraticCurveTo(rx+rw*.4,ry-rh*1.22,rx+rw*.1,ry-rh*1.2); g.quadraticCurveTo(rx-rw*.3,ry-rh*1.16,rx-rw*.56,ry-rh*1.36); g.closePath(); g.fill();
    g.fillStyle=sb; g.beginPath(); g.ellipse(rx-rw*.02,ry-rh*1.27,rw*.34,rh*.12,0,0,7); g.fill();
    g.fillStyle=sd; for(const [sx,sy,sr] of [[-.25,-1.74,.03],[-.05,-1.8,.025],[.12,-1.72,.022],[-.36,-1.6,.02]]){ g.beginPath(); g.ellipse(rx+rw*sx,ry+rh*sy,rw*sr*1.4,rw*sr,0,0,7); g.fill(); }
    g.fillStyle=sd; g.beginPath(); g.moveTo(rx-rw*.54,ry-rh*1.38); g.lineTo(rx-rw*.74,ry-rh*1.62); g.quadraticCurveTo(rx-rw*.7,ry-rh*1.42,rx-rw*.76,ry-rh*1.2); g.closePath(); g.fill();
    g.beginPath(); g.ellipse(rx+rw*.16,ry-rh*1.3,rw*.09,rh*.09,.6,0,7); g.fill();
    g.fillStyle=sc; g.beginPath(); g.ellipse(hx,hy,rw*.15,rh*.34,-.15-lift*.35,0,7); g.fill(); g.beginPath(); g.ellipse(hx+rw*.13,hy+rh*.1,rw*.09,rh*.19,.1,0,7); g.fill();
    m33dot(g,hx+rw*.215,hy+rh*.06,Math.max(.5,rw*.018),'#141418');
    m33dot(g,hx+rw*.06,hy-rh*.1,Math.max(.6,rw*.026),'#101014'); m33dot(g,hx+rw*.07,hy-rh*.14,Math.max(.25,rw*.009),v3rgba('#ffffff',.8));
    g.strokeStyle=v3rgba(mix(sb,'#ffffff',.4),.55); g.lineWidth=Math.max(.4,rw*.008); g.beginPath(); for(const k of [-.06,0,.06]){ g.moveTo(hx+rw*.17,hy+rh*(.14+k)); g.lineTo(hx+rw*.3,hy+rh*(.1+k*2.2)); } g.stroke();
    g.fillStyle=v3rgba(P.rim,.22+d*.15); g.beginPath(); g.ellipse(rx-rw*.12,ry-rh*1.86,rw*.2,rh*.05,-.08,0,7); g.fill();
    if(FX){ const k=(t*.6)%1; g.strokeStyle=v3rgba(mix(P.wTop,'#ffffff',.7),.55*(1-k)); g.lineWidth=1.2; g.beginPath(); g.ellipse(rx,ry+1,rw*(1.05+k*.5),rh*(.35+k*.25),0,0,7); g.stroke(); } }
  // surf foaming along the foot of the cliff
  if(FX){ for(let i=0;i<9;i++){ const q=((t*.45+i*.11)%1), X=W*(.205+i*.007), y=hz+H*.002; g.fillStyle=v3rgba(mix(P.wTop,"#ffffff",.75),.55*Math.sin(q*Math.PI)); g.beginPath(); g.ellipse(X,y-q*H*.004,W*.004*(1+q),H*.0018,0,0,7); g.fill(); } }
});
wx3WaterLayer('coast');
l3wakeLayer('coast');
m33wrap('coast','live',function(P,t,hz){ if(P.night>.7) return; for(let i=0;i<3;i++){ const x=W*(.5+((t*.02+i*.07)%.2)) /* on the open sand only, never across the lighthouse rocks (director) */, run=Math.sin(t*2+i)>0, y=hz-H*.003, s=H*.0035, bc=mix('#8a7a64',P.sandD,.3);
  g.fillStyle=bc; g.beginPath(); g.ellipse(x,y-s*1.4,s*1.4,s*.8,0,0,7); g.fill(); g.beginPath(); g.arc(x+s*1.2,y-s*2,s*.55,0,7); g.fill(); g.strokeStyle='#2a241c'; g.lineWidth=.6; g.beginPath(); g.moveTo(x+s*1.6,y-s*2); g.lineTo(x+s*2.6,y-s*1.8); g.moveTo(x,y-s*.8); g.lineTo(x+(run?Math.sin(t*20+i)*s*.6:0),y); g.stroke(); } });
depthHazeLayer('coast');
m33wrap('coast','fore',function(P,t){ const b=H+2, sh=mix(P.stone,P.wBot,.2+P.night*.3), dk=mix(P.stoneD,P.wBot,.2+P.night*.3);
  // tide-pool rocks: two boulders, weed, a starfish, and the water washing in and out between them
  const X0=W*.54; for(const [ox,w,h] of [[0,.09,.1],[.09,.065,.07],[.15,.045,.045]]){ const x0=X0+W*ox, ww=W*w, hh=H*h; g.fillStyle=dk; g.beginPath(); g.moveTo(x0,b); g.quadraticCurveTo(x0+ww*.05,b-hh*.9,x0+ww*.45,b-hh); g.quadraticCurveTo(x0+ww*.95,b-hh*.85,x0+ww,b); g.closePath(); g.fill();
    g.fillStyle=sh; g.beginPath(); g.moveTo(x0+ww*.15,b-hh*.62); g.quadraticCurveTo(x0+ww*.42,b-hh*1.02,x0+ww*.8,b-hh*.7); g.quadraticCurveTo(x0+ww*.45,b-hh*.78,x0+ww*.15,b-hh*.62); g.fill(); }
  g.strokeStyle=mix('#4a7a3a',P.wBot,.2+P.night*.4); g.lineWidth=Math.max(1.2,H*.003); for(let i=0;i<6;i++){ const wx=X0+W*(.01+i*.012), sw=Math.sin(t*1.4+i)*H*.006; g.beginPath(); g.moveTo(wx,b-H*.01); g.quadraticCurveTo(wx+sw,b-H*.035,wx+sw*1.6,b-H*.05-((i*7)%3)*H*.006); g.stroke(); }
  { const sx=X0+W*.088, sy=b-H*.042, r=H*.011; g.fillStyle=mix('#e8703a',P.wBot,P.night*.5); g.beginPath(); for(let i=0;i<10;i++){ const a=-Math.PI/2+i*Math.PI/5, rr=i%2?r*.42:r; g.lineTo(sx+Math.cos(a)*rr,sy+Math.sin(a)*rr); } g.closePath(); g.fill(); }
  const k=.5+.5*Math.sin(t*.8); g.fillStyle=v3rgba(mix(P.wTop,'#ffffff',.6),.35+k*.2); g.beginPath(); g.ellipse(X0+W*.072,b-H*.006,W*.02*(.7+k*.3),H*.006,0,0,7); g.fill();
});
depthMotesLayer('coast');
