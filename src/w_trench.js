// =====================================================================
// Moonlit Trench: its whole scene in one file (Clean Scenes 5, 2026-11-22): the scene itself, then every piece drawn on top, in the
// order they draw (each hook: land = the cached still scenery, sky, live = moving things, fore = the bottom edge). Shared layers
// (weather, the float's wake, wind gusts, depth haze and motes) are added here by name, at their place in that order. Its colours stay
// in V3PAL (f_v3scene.js / f2_areas.js) and shared drawing helpers stay in their files.
// =====================================================================
V3SCENES.trench = {
  land(x,P,hz,cnv){
    // sea stacks: far and hazy, then nearer and darker
    for(const [sx,sw,sh,sd] of [[.36,.03,.1,1],[.42,.02,.07,2],[.78,.035,.12,3]]) v3stack(x,W*sx,hz+1,W*sw,H*sh,Object.assign({},P,{rock:mix(P.rock,P.farHaze,.45),rockD:mix(P.rockD,P.farHaze,.45)}),sd);
    for(const [sx,sw,sh,sd] of [[.9,.05,.22,4],[.97,.03,.15,5],[.55,.025,.06,6]]) v3stack(x,W*sx,hz+1,W*sw,H*sh,P,sd);
    // the mast of a sunken ship, leaning out of the water, a torn sail, a crow's nest
    { const mx=W*.66, my=hz+H*.06, tx=mx-W*.03, ty=hz-H*.16; x.strokeStyle=P.wood; x.lineWidth=Math.max(2.4,W*.004); x.beginPath(); x.moveTo(mx,my); x.lineTo(tx,ty); x.stroke();
      const yd=(u)=>[mx+(tx-mx)*u,my+(ty-my)*u]; const [a1,b1]=yd(.55), [a2,b2]=yd(.85); x.lineWidth=Math.max(1.6,W*.0025); x.beginPath(); x.moveTo(a1-W*.035,b1+H*.008); x.lineTo(a1+W*.03,b1-H*.006); x.moveTo(a2-W*.022,b2+H*.004); x.lineTo(a2+W*.02,b2-H*.004); x.stroke();
      x.fillStyle=v3rgba(mix(mix('#c8c0a8',P.farHaze,.5),P.rock,P.night*.7),.7); x.beginPath(); x.moveTo(a1-W*.03,b1+H*.008); x.lineTo(a1+W*.025,b1-H*.005); x.lineTo(a1+W*.02,b1+H*.03); x.lineTo(a1+W*.005,b1+H*.022); x.lineTo(a1-W*.006,b1+H*.04); x.lineTo(a1-W*.02,b1+H*.026); x.closePath(); x.fill();
      x.fillStyle=P.wood; x.fillRect(tx-W*.008,ty+H*.01,W*.016,H*.012); x.strokeStyle=v3rgba(P.wood,.8); x.lineWidth=.8; x.beginPath(); x.moveTo(tx,ty); x.lineTo(mx+W*.06,my-H*.01); x.moveTo(a2,b2); x.lineTo(mx-W*.07,my-H*.005); x.stroke(); }
    v3water(x,P,hz,cnv,.22);
    // the dark middle: a deep, wide shadow in the water that drinks the light
    const dg=x.createRadialGradient(W*.55,hz+H*.3,0,W*.55,hz+H*.3,W*.42); dg.addColorStop(0,'rgba(0,0,0,.6)'); dg.addColorStop(.55,'rgba(0,0,0,.3)'); dg.addColorStop(1,'rgba(0,0,0,0)'); x.fillStyle=dg; x.save(); x.beginPath(); x.rect(0,hz+H*.03,W,H); x.clip(); x.scale(1,1); x.fillRect(0,hz,W,H-hz); x.restore();
  },
  live(P,t,hz,sun){ const FX=S.settings.effects, night=P.night, glowA=.55+night*.45;
    v3glitter(P,t,hz,sun); v3mist(P,t,hz,.22);
    g.save(); g.globalCompositeOperation='lighter';
    // plankton trails: glowing motes drifting along slow curves
    if(FX){ for(let tr=0;tr<5;tr++){ const y0=hz+H*(.12+tr*.13), col=tr%2?P.bio2:P.bio; for(let i=0;i<22;i++){ const u=((t*.03+i/22+tr*.17)%1), X=W*(-.05+u*1.1), Y=y0+Math.sin(u*9+tr*2+t*.4)*H*.03, a=Math.sin(u*Math.PI)*(.25+.35*Math.abs(Math.sin(t*2+i)))*glowA;
      g.fillStyle=v3rgba(col,a); g.beginPath(); g.arc(X,Y,1+((i*7)%3)*.5,0,7); g.fill(); } } }
    // jellyfish drifting under the surface, pulsing
    for(let j=0;j<5;j++){ const per=40+j*9, k=((t+j*13)%per)/per, jx=W*(.3+((j*0.17)%0.65))+Math.sin(t*.2+j)*W*.03, jy=H*(1.05-k*.75), d=(jy-hz)/(H-hz); if(jy<hz+H*.08) continue; const s=H*(.008+d*.022), pulse=1+.15*Math.sin(t*2.4+j*1.3), col=j%2?P.bio2:P.bio, a=glowA*(.25+d*.4);
      v3glow(g,jx,jy,s*4,v3rgba(col,.8),a*.5);
      g.fillStyle=v3rgba(col,a*.6); g.beginPath(); g.ellipse(jx,jy,s*pulse,s*.7/pulse,0,Math.PI,0); g.fill();
      g.strokeStyle=v3rgba(col,a*.5); g.lineWidth=1; g.beginPath(); for(let tn=0;tn<4;tn++){ const tx=jx-s*.6+tn*s*.4; g.moveTo(tx,jy); g.quadraticCurveTo(tx+Math.sin(t*1.8+tn+j)*s*.4,jy+s*1.2,tx+Math.sin(t*1.3+tn)*s*.3,jy+s*2.4); } g.stroke(); }
    g.restore();
    // eyes in the deep: now and then, something down there opens its eyes, looks, and closes them
    { const per=29, k=(t%per)/per; if(k<.3){ const n=Math.floor(t/per), r=m34rng(n*17+3), NP=1+Math.floor(r()*3.2); /* 0.3.4: one to four pairs, each its own size, place, color and timing */
      for(let pi=0;pi<Math.min(4,NP);pi++){ const st=r()*.1, e=(k-st)/(.13+r()*.07); const ex=W*(.3+r()*.62), ey=hz+H*(.2+r()*.22), s=H*(.005+r()*.01)*(.7+(ey-hz)/H*1.4), cols=[['#e8ff9a','220,255,140'],['#b8fff4','150,255,240'],['#ffd27a','255,200,110'],['#ff9a8a','255,130,110']], cl=cols[Math.floor(r()*4)], gap=2.4+r()*1.6, blink=r()<.5?.55:-1; if(e<0||e>1) continue;
        let open=Math.min(1,Math.sin(e*Math.PI)*1.8); if(blink>0&&Math.abs(e-blink)<.04) open*=.1; const look=Math.sin(e*6+pi)*s*.3;
        for(const sd of [-1,1]){ v3glow(g,ex+sd*s*gap,ey,s*4,'rgba('+cl[1]+',.9)',.3*open); g.fillStyle=v3rgba(cl[0],.85*open); g.beginPath(); g.ellipse(ex+sd*s*gap,ey,s*1.4,s*.9*open,0,0,7); g.fill(); g.fillStyle='rgba(0,0,0,.9)'; g.beginPath(); g.ellipse(ex+sd*s*gap+look,ey,s*.25,s*.7*open,0,0,7); g.fill(); } } } }
    v3fishRing(P,t,hz,9.1,.3,.85);
  },
  fore(P,t){ // drifting kelp fronds rising into the bottom corner, faintly glowing at their tips
    const b=H+2; for(let i=0;i<5;i++){ const fx=W*(.9+i*.022), h=H*(.14+((i*7)%3)*.04), sw=Math.sin(t*.7+i*1.3)*H*.02; g.strokeStyle=mix('#1e3a2a',P.wBot,.3+P.night*.3); g.lineWidth=Math.max(2,H*.006); g.beginPath(); g.moveTo(fx,b); g.bezierCurveTo(fx+sw,b-h*.35,fx-sw,b-h*.7,fx+sw*.5,b-h); g.stroke();
      g.fillStyle=v3rgba(P.bio,.25+.2*Math.sin(t*2+i)); g.beginPath(); g.arc(fx+sw*.5,b-h,2,0,7); g.fill(); }
  }
};
wx3SkyLayer('trench');
m33wrap('trench','live',function(P,t,hz){ if(!S.settings.effects) return; const bio=P.bio||'#5af0d8', bio2=P.bio2||'#8a7aff';
  for(let r=0,R=gfxHigh()?4:3;r<R;r++){ const y0=hz+H*(.12+r*.11); for(let i=0,n=gfxHigh()?48:34;i<n;i++){ const u=i/n, x=((u*W*1.2+t*W*(.006+r*.003))%(W*1.2))-W*.1, y=y0+Math.sin(u*9+t*.6+r)*H*.012, near=Math.hypot(x-G.bob.x,y-G.bob.y)<H*.08?1:0, a=(.18+.25*Math.max(0,Math.sin(t*1.7+i*.9+r)))*(1+near*1.5);
      g.fillStyle=v3rgba(r%2?bio2:bio,Math.min(.9,a)); g.fillRect(x,y,1.6+near,1.6+near); } }
});
wx3WaterLayer('trench');
l3wakeLayer('trench');
l3gustLayer('trench');
m33wrap('trench','live',function(P,t,hz){ const FX=S.settings.effects, bio=P.bio||'#5af0d8';
  for(let i=0;i<4;i++){ const y=hz+H*(.005+i*.012), x=((i*.37+t*.004*(1+i*.3))%1.6)*W-W*.3, w=W*.5; const fg=g.createRadialGradient(x+w/2,y,0,x+w/2,y,w*.5); fg.addColorStop(0,'rgba(170,210,215,.16)'); fg.addColorStop(1,'rgba(170,210,215,0)'); g.save(); g.translate(0,y); g.scale(1,.1); g.translate(0,-y); g.fillStyle=fg; g.fillRect(x,y-w*.5,w,w); g.restore(); }
  if(FX){ g.fillStyle=v3rgba(bio,.5); for(let i=0,n=gfxHigh()?30:18;i<n;i++){ const y=hz+H*.04+Math.pow((i*.137)%1,1.3)*(H-hz)*.8, u=(y-hz)/(H-hz), x=(((i*97.3)%1000)/1000*W+t*W*.01)%W, a=Math.max(0,Math.sin(t*1.3+i*1.7)); if(a<.3) continue; g.globalAlpha=a*.7; g.fillRect(x,y,W*(.01+u*.02),1.2); } g.globalAlpha=1; }
  { const lx=W*.66, ly=hz-H*.03+Math.sin(t*1.1)*H*.003, p=.7+.3*Math.sin(t*3.1)*Math.sin(t*1.7); v3glow(g,lx,ly,H*.05,'rgba(255,210,140,.9)',.35*p); g.fillStyle='rgba(255,226,170,'+(.6+.3*p)+')'; g.fillRect(lx-1.6,ly-2.4,3.2,4); if(typeof v3lanternReflect==='function') v3lanternReflect(lx,hz+2,.5*p,t,'255,210,140'); }
  { const per=60, q=(t%per)/per; if(q<.25){ const e=q/.25, a=Math.sin(e*Math.PI)*.22, x=W*(1.1-e*1.3), y=hz+H*.3, s=H*.06; g.save(); g.globalAlpha=a; g.fillStyle='#000000'; g.beginPath(); g.ellipse(x,y,s*2.6,s*.5,0,0,7); g.fill(); g.beginPath(); g.moveTo(x+s*2.4,y); g.lineTo(x+s*3.6,y-s*.5); g.lineTo(x+s*3.4,y); g.lineTo(x+s*3.6,y+s*.5); g.closePath(); g.fill(); g.restore(); } }
});
depthHazeLayer('trench');
depthMotesLayer('trench');
