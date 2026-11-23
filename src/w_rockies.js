// =====================================================================
// Rocky Mountains: its whole scene in one file (Clean Scenes 5, 2026-11-22): the scene, then its extra life and its own moment
// (WA_MORE). Its colours (WA_PAL) and the newer waters' shared drawing helpers stay in cn_waterart.js.
// =====================================================================
/* ---------- Canadian Rockies, one-water rework (director, 2026-11-22 night: "maximum effort"; analysis in docs/reviews/rockies.md) ----------
   After Lake Louise and Moraine Lake: a jagged row of far peaks with snowfields, couloirs and a hanging glacier; two dark forested
   mountainsides framing the lake; scree fans; a shore of spruce with larches at the tree line; a canoe dock with red canoes.
   Light comes from the left: every face that turns right (the ridge falling away to the right) is in shade, and the shade is laid over
   rock and snow alike, so the lighting holds together. */
/* a jagged ridgeline: peaks shaped by an envelope, roughened by ridged noise that is strongest near the summits */
function rkRidge(seed,peaks,base,rough){ const n=v3noise(seed), m=v3noise(seed+77), step=3, ys=[];
  for(let X=-6;X<=W+6;X+=step){ const f=X/W; let env=0; for(const [px,h,w] of peaks){ const d=Math.abs(f-px)/w; if(d<1) env=Math.max(env,h*Math.pow(1-d,1.35)); }
    const r=(1-Math.abs(2*n(f*9+.3)-1))*.6+(1-Math.abs(2*n(f*23+4.1)-1))*.3+m(f*61+2)*.1, jag=(1-Math.abs(2*m(f*80+9)-1))-.5; ys.push(base-H*(env*(.8+rough*.3*r)+env*rough*.06*jag+.01)); } /* the high-frequency ridged term makes crags and notches along every ridge */
  return {ys,step,x0:-6,at:i=>-6+i*step}; }
function rkPath(x,R,base){ x.beginPath(); x.moveTo(R.at(0),base); for(let i=0;i<R.ys.length;i++) x.lineTo(R.at(i),R.ys[i]); x.lineTo(R.at(R.ys.length-1),base); x.closePath(); }
/* one mountain layer: rock, snow above a ragged snow line with couloir fingers, shade on right-facing faces, spur lines, haze at the foot */
function rkRange(x,R,base,o){ const ys=R.ys, N=ys.length;
  x.fillStyle=o.rock; rkPath(x,R,base); x.fill(); x.save(); rkPath(x,R,base); x.clip();
if(o.snow){ const sn=v3noise(o.seed+5), bot=ys.map((y,i)=>{ const line=o.snowLine+H*.02*sn(i*.05); if(y>=line) return y; const dep=(line-y)*(.5+.5*sn(i*.11+3)); return y+dep+(i%9<2?dep*.6*sn(i*.4+7):0); }); /* fingers of snow run down the couloirs */    x.fillStyle=o.snow; x.beginPath(); x.moveTo(R.at(0),ys[0]); for(let i=1;i<N;i++) x.lineTo(R.at(i),ys[i]); for(let i=N-1;i>=0;i--) x.lineTo(R.at(i),bot[i]); x.closePath(); x.fill(); }
  /* shade: under every stretch where the ridge falls to the right, a face reaching down and back toward the summit */
  x.fillStyle=o.shade; x.beginPath(); for(let i=1;i<N;i++){ if(!(ys[i]>ys[i-1])) continue; let j=i; while(j+1<N&&ys[j+1]>=ys[j]) j++; const pk=i-1, vy=ys[j], dx=(R.at(j)-R.at(pk));
      x.moveTo(R.at(pk),ys[pk]); for(let k=pk;k<=j;k++) x.lineTo(R.at(k),ys[k]); x.lineTo(R.at(j)-dx*.15,base); x.lineTo(R.at(pk)+dx*.28,base); x.closePath(); i=j; } x.fill();
  /* the Rockies' limestone layering: short broken bed lines tilted a little, faint, never stripes across the whole mountain */
  { const rr=v3rng(o.seed+11), top=Math.min(...ys); x.strokeStyle=o.line; x.lineWidth=1; x.globalAlpha=.45; x.beginPath(); for(let y=top+H*.012;y<base;y+=H*(.009+rr()*.006)){ let X=rr()*W*.05; while(X<W){ const L=W*(.01+rr()*.04); if(rr()<.55){ x.moveTo(X,y); x.lineTo(X+L,y-L*.12); } X+=L+W*(.005+rr()*.03); } } x.stroke(); x.globalAlpha=1; }
  if(o.glacier){ const G2=o.glacier, i0=Math.round((W*G2[0]-R.at(0))/R.step), i1=Math.round((W*G2[1]-R.at(0))/R.step), tongue=base-H*G2[2], ice=o.ice, blue=o.iceBlue; /* a glacier filling the saddle, its top the ridge itself, flowing down to a blue ice front */
    x.fillStyle=ice; x.beginPath(); x.moveTo(R.at(i0),ys[i0]); for(let i=i0;i<=i1;i++) x.lineTo(R.at(i),ys[i]+1); const mx=(R.at(i0)+R.at(i1))/2, hw=(R.at(i1)-R.at(i0))/2; x.quadraticCurveTo(mx+hw*.5,tongue-H*.03,mx+hw*.18,tongue); x.quadraticCurveTo(mx,tongue+H*.008,mx-hw*.2,tongue); x.quadraticCurveTo(mx-hw*.55,tongue-H*.04,R.at(i0),ys[i0]); x.closePath(); x.fill();
    x.fillStyle=blue; x.beginPath(); x.moveTo(mx-hw*.2,tongue); x.quadraticCurveTo(mx,tongue+H*.008,mx+hw*.18,tongue); x.lineTo(mx+hw*.17,tongue+H*.012); x.quadraticCurveTo(mx,tongue+H*.02,mx-hw*.19,tongue+H*.012); x.closePath(); x.fill();
    x.strokeStyle=v3rgba(blue,.55); x.lineWidth=1; for(let k=1;k<6;k++){ const yy=tongue-(tongue-Math.max(ys[i0],ys[i1]))*k/6, ww=hw*(.25+.12*k); x.beginPath(); x.moveTo(mx-ww,yy); x.quadraticCurveTo(mx,yy+H*.008,mx+ww,yy); x.stroke(); } }
  /* spurs and couloirs: thin dark lines falling from the notches, lit edges along the big ridges */
  x.strokeStyle=o.line; x.lineWidth=Math.max(1,H*.0016); x.beginPath(); for(let i=2;i<N-2;i++){ if(ys[i]>ys[i-2]&&ys[i]>ys[i+2]&&(i%9===0)){ const X=R.at(i), y=ys[i], L=(base-y)*(.18+.18*((i*37)%10)/10); x.moveTo(X,y); x.quadraticCurveTo(X+L*.08,y+L*.5,X-L*.05,y+L); } } x.stroke();
  x.strokeStyle=o.rim; x.lineWidth=Math.max(1,H*.0018); x.beginPath(); for(let i=1;i<N;i++){ if(ys[i]<ys[i-1]){ x.moveTo(R.at(i-1),ys[i-1]+.5); x.lineTo(R.at(i),ys[i]+.5); } } x.stroke();
  const hg=x.createLinearGradient(0,base-(base-Math.min(...ys))*.55,0,base); hg.addColorStop(0,v3rgba(o.haze,0)); hg.addColorStop(1,v3rgba(o.haze,o.hazeA)); x.fillStyle=hg; x.fillRect(0,base-H*.4,W,H*.4+1);
  x.restore(); }
/* a forested mountainside framing the lake: rock and snow above the tree line, then dense spruce canopy, avalanche paths, a scree fan */
function rkShoulder(x,P,hz,side,nk){ const L=side<0, w=W*.36, top=H*.25, R=v3rng(L?31:57), pts=[]; for(let i=0;i<=40;i++){ const u=i/40, X=L?u*w:W-u*w, hh=top*Math.pow(1-u,1.15)*(1+.06*Math.sin(u*17+(L?1:4)))+H*.012*(1-u); pts.push([X,hz-hh]); }
  const path=()=>{ x.beginPath(); x.moveTo(L?-2:W+2,hz+1); for(const [X,Y] of pts) x.lineTo(X,Y); x.lineTo(L?w:W-w,hz+1); x.closePath(); };
  const rock=mix(mix('#7a7680',P.far,.35),'#141a30',nk), forest=mix(mix('#24402e',P.back,.3),'#0a1410',nk*.9), forestL=mix(mix('#3a5e40',P.back,.3),'#0e1a14',nk*.9);
  x.fillStyle=rock; path(); x.fill(); x.save(); path(); x.clip();
  const tl=(X)=>hz-H*(.12+.025*Math.sin(X*.013+(L?0:2))); /* the tree line */
  x.fillStyle=forest; x.beginPath(); x.moveTo(L?-2:W+2,hz+1); for(let X=L?-2:W+2;L?X<=w:X>=W-w;X+=L?6:-6) x.lineTo(X,tl(X)); x.lineTo(L?w:W-w,hz+1); x.closePath(); x.fill();
  x.fillStyle=v3rgba(mix(mix('#e8eef8',P.farHaze,.2),'#2a3450',nk),.85); for(let i=0;i<6;i++){ const X=L?w*(.05+i*.07+R()*.03):W-w*(.05+i*.07+R()*.03), Y0=tl(X)-H*(.035+R()*.05), len=H*(.025+R()*.03), wd=W*(.004+R()*.004), bend=(R()-.5)*wd*1.5; x.beginPath(); x.moveTo(X-wd,Y0); x.quadraticCurveTo(X-wd*.4+bend,Y0+len*.5,X+bend*.5,Y0+len); x.quadraticCurveTo(X+wd*.4+bend,Y0+len*.5,X+wd,Y0); x.quadraticCurveTo(X,Y0-H*.003,X-wd,Y0); x.fill(); } /* snow lying in the gullies above the trees: soft tapering streaks down the slope (ovals, then zigzags, read wrong) */
  for(let k=0;k<3;k++){ const X=L?w*(.2+k*.22):W-w*(.2+k*.22), Y=tl(X); x.fillStyle=mix(forestL,'#8aa870',.35); x.beginPath(); x.moveTo(X-W*.003,Y); x.lineTo(X+W*.003,Y); x.lineTo(X+W*.014*side*-.2+W*.01,hz); x.lineTo(X-W*.01,hz); x.closePath(); x.fill(); } /* avalanche paths */
  for(let row=0;row<26;row++){ const v=row/26; for(let i=0;i<34;i++){ const X=L?R()*w:W-R()*w, Y=tl(X)+(hz-tl(X))*(v+R()*.04), s=H*(.006+v*.012)*(.7+R()*.6); x.fillStyle=R()<.5?forest:forestL; x.beginPath(); x.moveTo(X,Y-s*2.2); x.lineTo(X+s*.8,Y); x.lineTo(X-s*.8,Y); x.closePath(); x.fill(); } } /* the spruce canopy, bigger toward the shore */
  for(let i=0;i<9;i++){ const X=L?w*(.15+R()*.6):W-w*(.15+R()*.6), Y=tl(X)+(hz-tl(X))*(.2+R()*.5); x.fillStyle=mix(mix('#c89a3a',P.back,.25),'#141a10',nk); x.beginPath(); x.moveTo(X,Y-H*.016); x.lineTo(X+H*.005,Y); x.lineTo(X-H*.005,Y); x.closePath(); x.fill(); } /* larches near the top of the forest */
  x.fillStyle=v3rgba('#000000',.18+nk*.2); x.beginPath(); for(const [X,Y] of pts) x.lineTo(X+side*-W*.02,Y+H*.02); x.lineTo(L?w:W-w,hz); x.lineTo(L?w*.7:W-w*.7,hz); x.closePath(); x.fill(); /* the face turned away from the light */
  x.restore();
  const fx=L?w*.92:W-w*.92; x.fillStyle=mix(mix('#a8a4a0',P.far,.25),'#141a30',nk); x.beginPath(); x.moveTo(fx-W*.03,hz+1); x.lineTo(fx-W*.004,hz-H*.03); x.lineTo(fx+W*.004,hz-H*.03); x.lineTo(fx+W*.035,hz+1); x.closePath(); x.fill(); /* a scree fan at its foot */ }
V3SCENES.rockies={
  sky(P,t,hz){ const gl=P.gloom||0; if(P.night<.2||gl>.45) return; const a=(P.night-.2)/.8*(1-gl);
    if(!waStarsC||waStarsC.w!==W||waStarsC.h!==hz){ const r=v3rng(91); waStarsC={w:W,h:hz,a:Array.from({length:240},()=>{ const u=r(), band=r()<.45; const x=band?u*W:r()*W, y=band?(hz*.08+u*hz*.6+(r()-.5)*hz*.18):r()*hz*.8; return [x,y,r(),r()<.07]; })}; }
    for(let i=0;i<7;i++){ const u=i/6; v3glow(g,W*(.05+u*.9),hz*(.12+u*.55),H*.14,'rgba(210,215,255,.9)',.07*a); }
    g.fillStyle='#ffffff'; for(const s of waStarsC.a){ g.globalAlpha=a*(.3+.7*Math.abs(Math.sin(t*.9+s[2]*17))); const z=s[3]?1.7:.9; g.fillRect(s[0],s[1],z,z); } g.globalAlpha=1; },
  land(x,P,hz,cnv){
    /* the mountains (one-water rework, docs/reviews/rockies.md): a far row of jagged peaks, a nearer massif with a hanging glacier, and two
       forested mountainsides framing the lake; snow takes the dusk rose, everything dims to navy at night */
    { const nk=P.night*.6, snow=mix(mix(P.snow||'#f8fbff','#ffb8a8',P.d*.45),'#3a4a78',nk), snowFar=mix(snow,P.farHaze,.35), shade='rgba(24,34,74,'+(.34+nk*.2)+')';
      const far=rkRidge(21,[[.1,.2,.14],[.24,.27,.1],[.36,.22,.09],[.5,.3,.12],[.6,.24,.08],[.72,.29,.11],[.84,.25,.1],[.96,.21,.12]],hz+1,.9);
      rkRange(x,far,hz+1,{seed:21,rock:mix(mix(P.far,'#aab0c4',.25),'#1a2240',nk),snow:snowFar,snowLine:hz-H*.17,shade,line:v3rgba(mix(P.far,'#2a3050',.5),.45),rim:v3rgba(P.rim||'#fff0d0',.25*(1-nk)),haze:P.farHaze,hazeA:.62});
      const near=rkRidge(44,[[.44,.31,.15],[.505,.26,.05],[.56,.3,.05],[.62,.38,.12],[.67,.33,.045],[.79,.33,.12],[.74,.3,.05],[.85,.27,.06]],hz+1,1.15);
      rkRange(x,near,hz+1,{seed:44,glacier:[.665,.765,.13],ice:mix(mix('#e8f4ff',P.farHaze,.08),'#2a3a68',nk),iceBlue:mix('#6aaed8','#1a2a58',nk),rock:mix(mix(P.far,'#8a8a98',.4),'#141a30',nk),snow,snowLine:hz-H*.2,shade,line:v3rgba('#1a1e30',.55),rim:v3rgba(P.rim||'#fff0d0',.4*(1-nk)),haze:P.farHaze,hazeA:.45});
      /* forest at the foot of the peaks across the valley floor, hazier with distance, so the mountains rise out of trees, not bare ground */
      { const R2=v3rng(88), fc=mix(mix('#2e4a38',P.farHaze,.35),'#0c1618',nk), fc2=mix(mix('#3e5e48',P.farHaze,.35),'#101c1c',nk), topY=X=>hz-H*(.03+.012*Math.sin(X*.011)+.008*Math.sin(X*.037));
        x.fillStyle=fc; x.beginPath(); x.moveTo(W*.2,hz+1); for(let X=W*.2;X<=W*.82;X+=6) x.lineTo(X,topY(X)+H*.004); x.lineTo(W*.82,hz+1); x.closePath(); x.fill();
        for(let i=0;i<520;i++){ const X=W*(.2+R2()*.62), Y=topY(X)+(hz-topY(X))*R2(), s=H*(.004+R2()*.005); x.fillStyle=R2()<.5?fc:fc2; x.beginPath(); x.moveTo(X,Y-s*2.3); x.lineTo(X+s*.8,Y); x.lineTo(X-s*.8,Y); x.closePath(); x.fill(); } }
      rkShoulder(x,P,hz,-1,nk); rkShoulder(x,P,hz,1,nk); }
    // the Canadian Shield: low rounded pink-grey granite in front of the Rockies
    { const r=v3rng(64), rock=mix(mix('#b8968e',P.far,.35),P.farHaze,.15+P.night*.3); for(let i=0;i<10;i++){ const cx=W*(i/9)+(r()-.5)*W*.05, w=W*(.06+r()*.05), h=H*(.02+r()*.022), b=hz+1;
      x.fillStyle=rock; x.beginPath(); x.moveTo(cx-w,b); x.bezierCurveTo(cx-w*.7,b-h*1.15,cx+w*.5,b-h*1.3,cx+w,b); x.closePath(); x.fill();
      x.fillStyle=v3rgba('#ffffff',.16*(1-P.night)); x.beginPath(); x.ellipse(cx-w*.15,b-h*.75,w*.45,h*.18,-.08,0,7); x.fill(); x.strokeStyle=v3rgba('#3a2a2a',.22); x.lineWidth=1; x.beginPath(); x.moveTo(cx-w*.3,b-h*.5); x.lineTo(cx+w*.1,b-h*.2); x.stroke(); } }
    // the cliff the river falls over
    { const fx=W*WA_FALL.x, ft=hz-H*WA_FALL.top; const rk=mix(mix('#6a6468',P.far,.25),'#0a1020',P.night*.6), rkD=mix(rk,'#000000',.3), rkL=mix(rk,'#ffffff',.18);
      x.fillStyle=rk; x.beginPath(); x.moveTo(fx-W*.055,hz+1); x.bezierCurveTo(fx-W*.06,ft+H*.03,fx-W*.04,ft+H*.004,fx-W*.012,ft); x.lineTo(fx+W*.012,ft+H*.001); x.bezierCurveTo(fx+W*.04,ft+H*.004,fx+W*.06,ft+H*.03,fx+W*.065,hz+1); x.closePath(); x.fill();
      x.fillStyle=rkL; x.beginPath(); x.ellipse(fx-W*.03,ft+H*.012,W*.02,H*.005,-.1,0,7); x.ellipse(fx+W*.035,ft+H*.03,W*.018,H*.004,.1,0,7); x.fill();
      x.strokeStyle=rkD; x.lineWidth=1; x.beginPath(); x.moveTo(fx-W*.035,ft+H*.02); x.lineTo(fx-W*.025,ft+H*.05); x.moveTo(fx+W*.03,ft+H*.04); x.lineTo(fx+W*.045,ft+H*.065); x.moveTo(fx-W*.045,ft+H*.045); x.lineTo(fx-W*.05,hz); x.stroke();
      x.fillStyle=mix('#4a6a3a','#0a1020',P.night*.6); x.beginPath(); x.ellipse(fx-W*.03,ft+H*.004,W*.022,H*.005,0,Math.PI,0); x.ellipse(fx+W*.032,ft+H*.006,W*.022,H*.005,0,Math.PI,0); x.fill(); }
    /* the shore forest (director: no recycled look): uneven spruce of very different heights with golden larches among them, never one even row */
    { const r=v3rng(23); for(let row=0;row<2;row++) for(let i=0;i<30;i++){ const px=W*(i/29)+(r()-.5)*W*.02, base=hz-H*(.004+row*.004), h=H*(.035+r()*.07)*(row?1.15:1); if(row&&((px>W*.34&&px<W*.62)||(px>W*.76&&px<W*.86))) continue;
      const larch=r()<.22, col=larch?mix('#c89a3a',P.front,.25+P.night*.5):(row?P.front:mix(P.back,P.farHaze,.3)); v3pine(x,px,base,h*(larch?.85:1),col,P.rim,.25*(1-P.night)); } }
    for(const [px,hh] of [[.26,.06],[.31,.05],[.55,.065],[.68,.055],[.93,.06]]) waBirch(x,W*px,hz-H*.006,H*hh,P,Math.round(px*1000));
    // fireweed along the shore
    { const r=v3rng(12); for(let i=0;i<30;i++){ const px=W*(.2+r()*.75), hh=H*(.008+r()*.01); if(px>W*.76&&px<W*.88) continue; x.strokeStyle=mix('#4a6a3a',P.front,P.night*.5); x.lineWidth=1; x.beginPath(); x.moveTo(px,hz); x.lineTo(px,hz-hh); x.stroke(); x.fillStyle=mix('#d8508a',P.front,.15+P.night*.55); x.fillRect(px-1,hz-hh,2,hh*.55); } }
    waCabin(x,W*.04,hz-H*.004,H*.0058,P);
/* the canoe dock (Moraine Lake): a short timber dock on posts with red canoes tied along it, one green */    { const dx=W*.555, dw=W*.06, dy=hz+H*.006, nk=P.night*.55, wood=mix('#6a5040',P.front,nk), woodL=mix('#8a6a50',P.front,nk); x.fillStyle=wood; for(let i=0;i<=4;i++) x.fillRect(dx+dw*i/4-1,dy,2.2,H*.012); x.fillStyle=woodL; x.fillRect(dx-W*.004,dy-H*.004,dw+W*.008,H*.004); x.fillStyle=v3rgba('#000000',.25); x.fillRect(dx-W*.004,dy,dw+W*.008,1);      for(const [k,col] of [[0,'#c83a2a'],[1,'#c83a2a'],[2,'#3a6a4a'],[3,'#c83a2a']]){ const cx=dx+W*.004+k*W*.015, cy=dy+H*(.009+(k%2)*.004), L=W*.013, hc=mix(col,P.front,nk); x.fillStyle=hc; x.beginPath(); x.moveTo(cx-L*.5,cy-H*.004); x.quadraticCurveTo(cx,cy+H*.005,cx+L*.5,cy-H*.004); x.quadraticCurveTo(cx,cy-H*.001,cx-L*.5,cy-H*.004); x.fill(); x.fillStyle=v3rgba('#ffffff',.25*(1-nk)); x.fillRect(cx-L*.35,cy-H*.003,L*.7,1); } }
    v3water(x,P,hz,cnv,.42);
    // crystal-clear water: rocks and weeds on the bottom, clearer toward you
    { const r=v3rng(73); for(let i=0;i<30;i++){ const yy=hz+H*(.07+r()*.9), k=(yy-hz)/(H-hz), s=H*(.008+k*.05)*(.6+r()*.7), xx=W*r(), a=.1+k*.3; if(xx<W*.22&&k>.12) continue;
        x.fillStyle=v3rgba(mix('#8a8270',P.wBot,.45),a); x.beginPath(); x.ellipse(xx,yy,s,s*.42,0,0,7); x.fill(); x.fillStyle=v3rgba(mix('#c8c0a8',P.wMid,.4),a*.6); x.beginPath(); x.ellipse(xx-s*.2,yy-s*.12,s*.55,s*.16,0,0,7); x.fill(); }
      x.lineCap='round'; for(let i=0;i<22;i++){ const yy=hz+H*(.1+r()*.85), k=(yy-hz)/(H-hz), hh=H*(.01+k*.06), xx=W*r(); if(xx<W*.22&&k>.12) continue; x.strokeStyle=v3rgba(mix('#4a8a4a',P.wMid,.35),.12+k*.28); x.lineWidth=Math.max(.8,k*3);
        for(let j=0;j<4;j++){ const ox=(j-1.5)*hh*.18; x.beginPath(); x.moveTo(xx+ox,yy); x.quadraticCurveTo(xx+ox+hh*.2,yy-hh*.5,xx+ox-hh*.05,yy-hh*(.7+j%2*.3)); x.stroke(); } } x.lineCap='butt'; }
    waBeaverDam(x,W*(WA_FALL.x-.045),W*(WA_FALL.x+.075),hz+H*.006,P,5);
    { const lx=W*(WA_FALL.x+.06), ly=hz+H*.012; x.fillStyle=mix('#5a3e24',P.wBot,.2+P.night*.5); x.beginPath(); x.ellipse(lx,ly,H*.03,H*.024,0,Math.PI,0); x.fill(); waBeaverDam(x,lx-H*.03,lx+H*.03,ly-H*.004,P,9); } },
  live(P,t,hz,sun){ v3glitter(P,t,hz,sun); const FX=S.settings.effects, fx=W*WA_FALL.x, ft=hz-H*WA_FALL.top;
    // the waterfall pours and foams onto the dam
    g.fillStyle=v3rgba(mix('#ffffff',P.wTop,.25),.8-P.night*.3); g.beginPath(); g.moveTo(fx-W*.006,ft); g.lineTo(fx+W*.006,ft); g.lineTo(fx+W*.01,hz+H*.004); g.lineTo(fx-W*.01,hz+H*.004); g.closePath(); g.fill();
    if(FX){ g.strokeStyle='rgba(255,255,255,.75)'; g.lineWidth=1; for(let i=0;i<6;i++){ const xx=fx-W*.005+i*W*.002, q=((t*1.4+i*.37)%1), y=ft+q*(hz-ft); g.beginPath(); g.moveTo(xx,y); g.lineTo(xx,y+H*.015); g.stroke(); }
      for(let i=0;i<5;i++){ const q=((t*.4+i*.2)%1); g.fillStyle='rgba(240,250,255,'+(.3*(1-q))+')'; g.beginPath(); g.arc(fx+(i-2)*W*.006,hz-q*H*.025,H*(.006+q*.012),0,7); g.fill(); } }
    // chimney smoke
    if(FX) for(let i=0;i<5;i++){ const q=((t*.15+i*.2)%1), sx=W*.04+H*.0058*12*.74+H*.0058*.8+q*H*.03, sy=hz-H*.06-q*H*.08; g.fillStyle='rgba(220,226,234,'+(.25*(1-q))+')'; g.beginPath(); g.arc(sx,sy,H*(.006+q*.012),0,7); g.fill(); }
    waFlag(W*.135,hz-H*.006-H*.0105*4.6,H*.0105,P,t);
    // beavers: one swims out from the lodge and slaps its tail before diving; one gnaws on the dam
    { const per=26, q=(t%per)/per; if(q<.62){ const e=q/.62, bx=W*(WA_FALL.x+.05)-e*W*.22, by=hz+H*.035, s=H*.0045, oc=mix('#5a3a22',P.wMid,.15+P.night*.5);
        g.fillStyle=oc; g.beginPath(); g.ellipse(bx,by,s*2.2,s*.9,0,Math.PI,0); g.fill(); g.beginPath(); g.ellipse(bx-s*1.8,by-s*.5,s*1,s*.8,0,0,7); g.fill(); m33dot(g,bx-s*2.2,by-s*.7,s*.18,'#140c08');
        g.strokeStyle=v3rgba(mix(P.wTop,'#ffffff',.6),.5); g.lineWidth=1; g.beginPath(); g.moveTo(bx+s*2,by); g.lineTo(bx+s*7,by-s*1.2); g.moveTo(bx+s*2,by+s*.3); g.lineTo(bx+s*7,by+s*1.6); g.stroke(); }
      else if(q<.7){ const k=(q-.62)/.08, bx=W*(WA_FALL.x+.05)-W*.22, by=hz+H*.035, s=H*.0045; if(k<.3){ g.fillStyle=mix('#3a2614',P.wMid,P.night*.5); g.beginPath(); g.ellipse(bx+s,by-s*k*6,s*1.6,s*.6,-.4,0,7); g.fill(); }
        g.strokeStyle='rgba(255,255,255,'+(1-k)+')'; g.lineWidth=1.3; g.beginPath(); g.ellipse(bx,by,s*(2+k*8),s*(.6+k*2),0,0,7); g.stroke(); if(FX) for(let i=0;i<5;i++){ g.fillStyle='rgba(255,255,255,'+(.8*(1-k))+')'; g.fillRect(bx+(i-2)*s*1.4,by-s*(2+Math.sin(i*1.7)*1.5)*Math.sin(k*Math.PI)*3,1.6,1.6); } } }
    { const bx=W*(WA_FALL.x+.012), by=hz-H*.008, s=H*.004, ch=Math.sin(t*9)*.25*(Math.sin(t*.7)>0?1:0), oc=mix('#5a3a22',P.front,P.night*.5); g.fillStyle=oc; g.beginPath(); g.ellipse(bx,by,s*1.8,s*1.4,0,0,7); g.fill(); g.beginPath(); g.ellipse(bx+s*1.6,by-s*.6+ch*s,s*.9,s*.75,.2,0,7); g.fill(); g.fillStyle=mix('#3a2614',P.front,P.night*.5); g.beginPath(); g.ellipse(bx-s*2.2,by+s*.9,s*1.3,s*.4,.3,0,7); g.fill(); m33dot(g,bx+s*1.9,by-s*.9+ch*s,s*.16,'#140c08'); }
    waMoose(W*.42,hz-H*.004,H*.0034,P,t);
    // Canada geese: a pair swimming near the far shore, and now and then a V flying over
    for(let i=0;i<2;i++){ const ph=t*.015+i*.5, y=hz+H*(.02+i*.012); waGoose(W*(.58+.08*Math.sin(ph))+i*H*.03,y,H*.0045,Math.cos(ph)>=0?1:-1,P,t,i,false); }
    if(FX){ const per=37, q=(t%per)/per; if(q<.45){ const e=q/.45, lx=W*(1.1-e*1.3), ly=hz*.32+Math.sin(e*3)*hz*.04; for(let i=0;i<7;i++){ const row=Math.ceil(i/2), side=i%2?1:-1; waGoose(lx+row*H*.03,ly+side*row*H*.016,H*.0035,-1,P,t,i,true); } } }
    waCanoe(W*(.5+.1*Math.sin(t*.012)),hz+H*.075,H*.0045,P,t);
    v3mist(P,t,hz,.14+P.night*.06); },
  fore(P,t){ /* the near shore corner: two granite boulders with lichen and moss and a clump of fireweed swaying (one-water rework: the big flat corner pine was a dark silhouette) */ const b=H+2, N=c0=>mix(c0,P.top,P.night*.45); v3rock(g,W*.94,b-H*.03,W*.07,H*.075,P); v3rock(g,W*.995,b-H*.06,W*.05,H*.06,P); g.fillStyle=N('#5a7a3a'); g.beginPath(); g.ellipse(W*.93,b-H*.085,W*.03,H*.008,-.1,0,7); g.fill(); g.fillStyle=v3rgba(N('#d8d0a0'),.6); for(let i=0;i<6;i++){ g.beginPath(); g.arc(W*(.92+i*.009),b-H*(.06+(i%3)*.01),H*.0025,0,7); g.fill(); }
    for(let i=0;i<8;i++){ const x0=W*(.885+i*.008), sw=Math.sin(t*1.1+i)*H*.005, h=H*(.09+((i*7)%4)*.015); g.strokeStyle=N('#4a6a3a'); g.lineWidth=Math.max(1.2,H*.003); g.beginPath(); g.moveTo(x0,b); g.quadraticCurveTo(x0+sw*.4,b-h*.6,x0+sw,b-h); g.stroke(); g.fillStyle=N('#d8508a'); for(let k=0;k<5;k++){ g.beginPath(); g.ellipse(x0+sw*(1-k*.08),b-h+k*H*.009,H*.004,H*.0045,0,0,7); g.fill(); } } }
};
