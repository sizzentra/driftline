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
/* the Rockies' layered limestone (director, 2026-11-23: "stratification in rocks/mountains", after Moraine Lake): beds of slightly different
   tone stacked up the face, tilted a little, each bed's top a broken ledge line with a lit lip; snow lies on the ledges below the snowfields.
   Draws inside the caller's clip; returns the bed tops so snow can settle on them */
function rkStrata(x,y0,y1,seed,o){ const r=v3rng(seed), tilt=o.tilt||0, beds=[], ph=seed*.37, off=X=>X*tilt+H*.006*Math.sin(X*.0032+ph)+H*.003*Math.sin(X*.011+ph*2); for(let y=y0;y<y1;){ const h=H*(.007+r()*.016); beds.push([y,h,r()]); y+=h; } /* the beds bend gently, as real strata do */
  const band=(yy,h)=>{ x.beginPath(); x.moveTo(-4,yy+off(-4)); for(let X=W/24;X<=W+4;X+=W/24) x.lineTo(X,yy+off(X)); for(let X=W+4;X>=-4;X-=W/24) x.lineTo(X,yy+h+off(X)); x.closePath(); };
  for(const [yy,h,v] of beds){ if(v<.3) x.fillStyle=o.dark; else if(v>.78) x.fillStyle=o.warm||o.light; else if(v>.6) x.fillStyle=o.light; else continue; x.save(); for(const [f,a] of [[0,.34],[.18,.33],[.36,.33]]){ x.globalAlpha=a; band(yy+h*f,h*(1-2*f)); x.fill(); } x.restore(); } /* each bed fades in and out at its edges, so the layers blend into one another (director, 2026-11-23: "doesn't look blended properly") */
  const seg=(X0,X1,yy,dy)=>{ x.moveTo(X0,yy+off(X0)+dy); for(let X=X0+W/48;X<X1;X+=W/48) x.lineTo(X,yy+off(X)+dy); x.lineTo(X1,yy+off(X1)+dy); };
  x.lineWidth=1; x.beginPath(); for(const [yy] of beds){ if(r()<.3) continue; let X=r()*W*.03; while(X<W){ const L=W*(.02+r()*.1); if(r()<.72) seg(X,X+L,yy,0); X+=L+W*(.004+r()*.02); } }
  x.save(); x.globalAlpha=.55; x.strokeStyle=o.line; x.stroke(); x.translate(0,-1); x.strokeStyle=o.ledge; x.stroke(); x.restore(); /* ledge lines: a shadowed bed joint with the lip of the bed above it lit */
  if(o.snowLedge){ const [sa,sb,sc]=o.snowLedge; x.save(); x.globalAlpha=.6; x.fillStyle=sc; for(const [yy] of beds){ if(yy<sa||yy>sb||r()<.5) continue; let X=r()*W*.05; while(X<W){ const L=W*(.006+r()*.025), th=Math.max(1.2,H*(.0012+r()*.0018)); if(r()<.35){ x.beginPath(); x.moveTo(X,yy+off(X)); x.lineTo(X+L,yy+off(X+L)); x.lineTo(X+L*.85,yy+off(X+L)+th); x.lineTo(X+L*.1,yy+off(X)+th); x.closePath(); x.fill(); } X+=L+W*(.01+r()*.04); } } x.restore(); } /* snow caught on the ledges, faded into the rock */
  return beds; }
function rkRange(x,R,base,o){ const ys=R.ys, N=ys.length, top=Math.min(...ys), tilt=o.tilt||-.012;
  x.fillStyle=o.rock; rkPath(x,R,base); x.fill(); x.save(); rkPath(x,R,base); x.clip();
  rkStrata(x,top,base,o.seed+11,{tilt,dark:o.bedDark,light:o.bedLight,warm:o.bedWarm,line:o.line,ledge:o.ledge,snowLedge:o.snow?[o.snowLine-H*.02,o.snowLine+H*.07,o.snow]:null});
  if(o.snow){ const sn=v3noise(o.seed+5), bh=H*.011, bot=ys.map((y,i)=>{ const line=o.snowLine+H*.025*sn(i*.03); if(y>=line) return y; return Math.max(y,y+(line-y)*(.55+.4*sn(i*.05+3))+H*.006*(sn(i*.35+9)-.5)); }); /* a ragged lower edge without hanging teeth or stair steps (director); the snow on the ledges below does the layering */
    x.fillStyle=o.snow; x.beginPath(); x.moveTo(R.at(0),ys[0]); for(let i=1;i<N;i++) x.lineTo(R.at(i),ys[i]); for(let i=N-1;i>=0;i--) x.lineTo(R.at(i),bot[i]); x.closePath(); x.fill();
    x.fillStyle=o.snowShade; x.beginPath(); for(let i=1;i<N;i++){ if(bot[i]>ys[i]+1&&Math.abs(bot[i]-bot[i-1])<1){ x.rect(R.at(i-1),bot[i]-1,R.step+.5,1.6); } } x.fill(); } /* a thin shadow under the snow's edge */
  /* shade: under every stretch where the ridge falls to the right, a face reaching down and back toward the summit */
  const sTop=Math.min(...ys), sg=x.createLinearGradient(0,sTop,0,base); sg.addColorStop(0,o.shade); sg.addColorStop(.6,o.shade); sg.addColorStop(1,'rgba(24,34,74,.06)'); /* the shade fades toward the foot, so its edges never run as lines to the bottom */
  x.fillStyle=sg; x.beginPath(); for(let i=1;i<N;i++){ if(!(ys[i]>ys[i-1])) continue; let j=i; while(j+1<N&&ys[j+1]>=ys[j]) j++; const pk=i-1, vy=ys[j], dx=(R.at(j)-R.at(pk)); if(vy-ys[pk]<H*.012||dx<W*.008){ i=j; continue; } /* only real faces cast shade: tiny steps made hair-thin shadows that ran down as lines (director) */
      x.moveTo(R.at(pk),ys[pk]); for(let k=pk;k<=j;k++) x.lineTo(R.at(k),ys[k]); x.quadraticCurveTo(R.at(j)+dx*.08,(vy+base)/2,R.at(j)-dx*.15,base); x.lineTo(R.at(pk)+dx*.28,base); x.quadraticCurveTo(R.at(pk)+dx*.05,(ys[pk]+base)/2,R.at(pk),ys[pk]); x.closePath(); i=j; } x.fill();
  if(o.glacier){ const G2=o.glacier, i0=Math.round((W*G2[0]-R.at(0))/R.step), i1=Math.round((W*G2[1]-R.at(0))/R.step), tongue=base-H*G2[2], ice=o.ice, blue=o.iceBlue; /* a glacier filling the saddle, its top the ridge itself, flowing down to a blue ice front */
    x.fillStyle=ice; x.beginPath(); x.moveTo(R.at(i0),ys[i0]); for(let i=i0;i<=i1;i++) x.lineTo(R.at(i),ys[i]+1); const mx=(R.at(i0)+R.at(i1))/2, hw=(R.at(i1)-R.at(i0))/2; x.quadraticCurveTo(mx+hw*.5,tongue-H*.03,mx+hw*.18,tongue); x.quadraticCurveTo(mx,tongue+H*.008,mx-hw*.2,tongue); x.quadraticCurveTo(mx-hw*.55,tongue-H*.04,R.at(i0),ys[i0]); x.closePath(); x.fill();
    x.fillStyle=blue; x.beginPath(); x.moveTo(mx-hw*.2,tongue); x.quadraticCurveTo(mx,tongue+H*.008,mx+hw*.18,tongue); x.lineTo(mx+hw*.17,tongue+H*.012); x.quadraticCurveTo(mx,tongue+H*.02,mx-hw*.19,tongue+H*.012); x.closePath(); x.fill();
    x.strokeStyle=v3rgba(blue,.55); x.lineWidth=1; for(let k=1;k<6;k++){ const yy=tongue-(tongue-Math.max(ys[i0],ys[i1]))*k/6, ww=hw*(.25+.12*k); x.beginPath(); x.moveTo(mx-ww,yy); x.quadraticCurveTo(mx,yy+H*.008,mx+ww,yy); x.stroke(); } }
  /* (the thin gully strokes are gone: they read as cracks or wires, director 2026-11-22) lit edges along the big ridges */
  x.strokeStyle=o.rim; x.lineWidth=Math.max(1,H*.0018); x.beginPath(); for(let i=1;i<N;i++){ if(ys[i]<ys[i-1]){ x.moveTo(R.at(i-1),ys[i-1]+.5); x.lineTo(R.at(i),ys[i]+.5); } } x.stroke();
  const hg=x.createLinearGradient(0,base-(base-Math.min(...ys))*.55,0,base); hg.addColorStop(0,v3rgba(o.haze,0)); hg.addColorStop(1,v3rgba(o.haze,o.hazeA)); x.fillStyle=hg; x.fillRect(0,base-H*.4,W,H*.4+1);
  x.restore(); }
/* a forested mountainside framing the lake: layered rock with snow on its ledges above the tree line, then dense spruce canopy, a scree fan */
function rkShoulder(x,P,hz,side,nk){ const L=side<0, w=W*.36, top=H*.25, R=v3rng(L?31:57), pts=[]; for(let i=0;i<=40;i++){ const u=i/40, X=L?u*w:W-u*w, hh=top*Math.pow(1-u,1.15)*(1+.06*Math.sin(u*17+(L?1:4)))+H*.012*(1-u); pts.push([X,hz-hh]); }
  const path=()=>{ x.beginPath(); x.moveTo(L?-2:W+2,hz+1); for(const [X,Y] of pts) x.lineTo(X,Y); x.lineTo(L?w:W-w,hz+1); x.closePath(); };
  const rock=mix(mix('#7a7680',P.far,.35),'#141a30',nk), forest=mix(mix('#24402e',P.back,.3),'#0a1410',nk*.9), forestL=mix(mix('#3a5e40',P.back,.3),'#0e1a14',nk*.9);
  x.fillStyle=rock; path(); x.fill(); x.save(); path(); x.clip();
  const tl=(X)=>hz-H*(.12+.025*Math.sin(X*.013+(L?0:2))); /* the tree line */
  rkStrata(x,hz-top-H*.03,hz,L?131:157,{tilt:L?.03:-.03,dark:'rgba(24,28,52,'+(.16+nk*.06)+')',light:v3rgba('#ffffff',.08*(1-nk)),warm:v3rgba('#d8a070',.12*(1-nk)),line:'rgba(20,22,40,.45)',ledge:v3rgba('#fff4e0',.2*(1-nk)),snowLedge:[hz-top-H*.03,hz-top+H*.07,mix(mix('#eef2fa',P.farHaze,.2),'#2a3450',nk)]}); /* the same layered limestone as the peaks, with snow on its upper ledges (director: "you textured the other mountains properly, why not these?"; the snow streaks read as triangles) */
  x.fillStyle=forest; x.beginPath(); x.moveTo(L?-2:W+2,hz+1); for(let X=L?-2:W+2;L?X<=w:X>=W-w;X+=L?6:-6) x.lineTo(X,tl(X)); x.lineTo(L?w:W-w,hz+1); x.closePath(); x.fill();
  for(let row=0;row<26;row++){ const v=row/26; for(let i=0;i<34;i++){ const X=L?R()*w:W-R()*w, Y=tl(X)+(hz-tl(X))*(v+R()*.04), s=H*(.006+v*.012)*(.7+R()*.6); x.fillStyle=R()<.5?forest:forestL; x.beginPath(); x.moveTo(X,Y-s*2.2); x.lineTo(X+s*.8,Y); x.lineTo(X-s*.8,Y); x.closePath(); x.fill(); } } /* the spruce canopy, bigger toward the shore */
  for(let i=0;i<9;i++){ const X=L?w*(.15+R()*.6):W-w*(.15+R()*.6), Y=tl(X)+(hz-tl(X))*(.2+R()*.5); x.fillStyle=mix(mix('#c89a3a',P.back,.25),'#141a10',nk); x.beginPath(); x.moveTo(X,Y-H*.016); x.lineTo(X+H*.005,Y); x.lineTo(X-H*.005,Y); x.closePath(); x.fill(); } /* larches near the top of the forest */
  x.fillStyle=v3rgba('#000000',.18+nk*.2); x.beginPath(); for(const [X,Y] of pts) x.lineTo(X+side*-W*.02,Y+H*.02); x.lineTo(L?w:W-w,hz); x.lineTo(L?w*.7:W-w*.7,hz); x.closePath(); x.fill(); /* the face turned away from the light */
  x.restore();
  const fx=L?w*.92:W-w*.92; x.fillStyle=mix(mix('#a8a4a0',P.far,.25),'#141a30',nk); x.beginPath(); x.moveTo(fx-W*.03,hz+1); x.lineTo(fx-W*.004,hz-H*.03); x.lineTo(fx+W*.004,hz-H*.03); x.lineTo(fx+W*.035,hz+1); x.closePath(); x.fill(); /* a scree fan at its foot */ }
/* a spruce as the Rockies grow them (director, 2026-11-23: "these trees need more details or clarity"): a narrow spire, tiers of drooping
   branches that widen toward the ground with ragged tips, a short trunk below, the side away from the light in shade and the lit tips rimmed */
function rkSpruce(x,X,base,h,col,rim,rimA,seed){ const r=v3rng(seed||1), n=6+(seed|0)%3, w=h*.22, tiers=[];
  for(let k=0;k<n;k++){ const u=(k+1)/n, yT=base-h+h*.9*k/n, yB=base-h+h*.9*u+h*.025, wb=w*(.16+.84*Math.pow(u,.9))*(.85+r()*.3); tiers.push([yT,yB,wb]); }
  const half=(sg)=>{ for(const [yT,yB,wb] of (sg>0?tiers:tiers.slice().reverse())){ const a=[X+sg*wb*.32,yT+(yB-yT)*.55], b=[X+sg*wb,yB], c=[X+sg*wb*.55,yB-(yB-yT)*.2]; if(sg>0){ x.lineTo(a[0],a[1]); x.lineTo(b[0],b[1]); x.lineTo(c[0],c[1]); } else { x.lineTo(c[0],c[1]); x.lineTo(b[0],b[1]); x.lineTo(a[0],a[1]); } } };
  x.fillStyle=mix(col,'#1a1008',.55); x.fillRect(X-Math.max(.8,h*.012),base-h*.1,Math.max(1.6,h*.024),h*.1); /* the trunk */
  x.fillStyle=col; x.beginPath(); x.moveTo(X,base-h); half(1); x.lineTo(X+w*.16,base-h*.08); x.lineTo(X-w*.16,base-h*.08); half(-1); x.closePath(); x.fill();
  x.fillStyle='rgba(0,0,0,.16)'; x.beginPath(); x.moveTo(X,base-h); half(1); x.lineTo(X+w*.16,base-h*.08); x.lineTo(X,base-h*.08); x.closePath(); x.fill(); /* the shaded half */
  if(rimA>0){ x.strokeStyle=v3rgba(rim||'#fff0d0',rimA); x.lineWidth=1; x.beginPath(); for(const [yT,yB,wb] of tiers){ x.moveTo(X-wb*.32,yT+(yB-yT)*.55); x.lineTo(X-wb,yB); } x.stroke(); } } /* light on the tips of the lit side */
/* the lake floor (director, 2026-11-23: "the lake floor needs more rocks and visibility, especially closer to the camera… very clear waters",
   after the stones of Lake Louise): rounded stones in tan, rust, grey and cream, small and lost in the turquoise far out, big and clear near
   you, each with its shadow and a lit top. Built once per screen size into its own picture and laid into the scenery (it would otherwise be
   repainted at every light step); at night it fades into the dark water */
let rkBedC=null;
function rkLakebed(x,P,hz){ const DL=Math.min(DPR||1,2), key=W+'x'+H+':'+hz+':'+DL;
  if(!rkBedC||rkBedC.key!==key){ const y0=hz+H*.16, c=document.createElement('canvas'); c.width=Math.ceil(W*DL); c.height=Math.ceil((H-y0)*DL); const q=c.getContext('2d'); q.scale(DL,DL); q.translate(0,-y0);
    const r=v3rng(73), lake='#2a8a96', cols=['#b8a078','#a86a48','#8e8c86','#d4c8a8','#8a8a62','#6e6a64','#c49a6a','#9a8a7a'];
    const sb=q.createLinearGradient(0,y0,0,H); sb.addColorStop(0,'rgba(200,184,144,0)'); sb.addColorStop(1,'rgba(200,184,144,.3)'); q.fillStyle=sb; q.fillRect(0,y0,W,H-y0); /* a pale bed between the stones, clearer toward you */
    for(let y=y0;y<H+H*.06;){ const k=clamp((y-hz)/(H-hz),0,1), s=H*(.0045+.052*Math.pow(k,1.8)), ry=s*.55, tint=.93-k*.55, al=.12+k*.6;
      for(let X=-s+r()*s;X<W+s;X+=s*(1.5+r()*.9)){ const sx=X, sy=y+(r()-.5)*ry*.7, rx=s*(.7+r()*.6), rr=rx*(.5+r()*.2), base=mix(cols[Math.floor(r()*cols.length)],lake,tint), pts=[];
        for(let i=0;i<9;i++){ const a=i/9*Math.PI*2, j=.86+r()*.22; pts.push([sx+Math.cos(a)*rx*j,sy+Math.sin(a)*rr*j]); }
        q.fillStyle=v3rgba(mix('#0a2a30',lake,tint*.5),al*.45); q.beginPath(); q.ellipse(sx+rx*.08,sy+rr*.35,rx*1.02,rr*.8,0,0,7); q.fill(); /* its shadow on the bed */
        q.fillStyle=v3rgba(base,al); q.beginPath(); { const md=(a,b)=>[(a[0]+b[0])/2,(a[1]+b[1])/2], m0=md(pts[8],pts[0]); q.moveTo(m0[0],m0[1]); for(let i=0;i<9;i++){ const p=pts[i], mm=md(p,pts[(i+1)%9]); q.quadraticCurveTo(p[0],p[1],mm[0],mm[1]); } } q.closePath(); q.fill(); /* rounded, water-worn */
        q.fillStyle=v3rgba(mix(base,'#000000',.3),al*.6); q.beginPath(); q.ellipse(sx+rx*.15,sy+rr*.3,rx*.8,rr*.55,0,0,Math.PI); q.fill(); /* the underside in shade */
        q.fillStyle=v3rgba(mix(base,'#fffaf0',.45),al*.55); q.beginPath(); q.ellipse(sx-rx*.22,sy-rr*.35,rx*.42,rr*.22,-.15,0,7); q.fill(); } /* the lit top */
      y+=ry*1.2; }
    const sh=q.createLinearGradient(0,y0,0,H); sh.addColorStop(0,v3rgba(lake,.6)); sh.addColorStop(.4,v3rgba(lake,.25)); sh.addColorStop(1,v3rgba(lake,.1)); q.fillStyle=sh; q.fillRect(0,y0,W,H-y0); q.globalCompositeOperation='destination-in'; { const fm=q.createLinearGradient(0,y0,0,y0+H*.24); fm.addColorStop(0,'rgba(0,0,0,0)'); fm.addColorStop(1,'rgba(0,0,0,1)'); q.fillStyle=fm; q.fillRect(0,y0,W,H-y0); } q.globalCompositeOperation='source-over'; /* it fades in from the deep water, no edge */ /* the water over it, deeper and greener far out */
    rkBedC={key,c,y0}; }
  x.save(); x.globalAlpha=1-P.night*.82; x.drawImage(rkBedC.c,0,rkBedC.y0,W,H-rkBedC.y0); x.restore(); }
/* the beaver dam and its lodge by the waterfall, kept as one small picture and drawn after the water's glitter, so the sparkle never runs
   across the sticks (director, 2026-11-23: "the water effects collide with it") */
let rkDamC=null;
function rkDams(P,hz){ const DL=Math.min(DPR||1,2), key=W+'x'+H+':'+hz+':'+DL+':'+Math.round(P.night*24)+':'+P.wBot, ox=W*(WA_FALL.x-.06), oy=hz-H*.035, cw=W*.2, ch=H*.08;
  if(!rkDamC||rkDamC.key!==key){ const c=document.createElement('canvas'); c.width=Math.ceil(cw*DL); c.height=Math.ceil(ch*DL); const q=c.getContext('2d'); q.scale(DL,DL); q.translate(-ox,-oy);
    waBeaverDam(q,W*(WA_FALL.x-.045),W*(WA_FALL.x+.075),hz+H*.006,P,5);
    const lx=W*(WA_FALL.x+.06), ly=hz+H*.012; q.fillStyle=mix('#5a3e24',P.wBot,.2+P.night*.5); q.beginPath(); q.ellipse(lx,ly,H*.03,H*.024,0,Math.PI,0); q.fill(); waBeaverDam(q,lx-H*.03,lx+H*.03,ly-H*.004,P,9);
    rkDamC={key,c}; }
  g.drawImage(rkDamC.c,ox,oy,cw,ch); }
const rkCan={n:0,dir:1}; /* the canoeist's heading: home as the night deepens, out again at dawn */
/* the otter's corner (director, 2026-11-23: "move it to the bottom left of the fishing scene, give its paths more dynamic, and give it
   scenery/greenery to interact with"): a mossy fallen spruce half in the water, two boulders and a bed of sedges near you. A river otter swims in
   from off the left edge, dives by the log and glides under the clear water with a trail of bubbles, surfaces with a crayfish and eats it
   floating on its back, climbs onto the boulder to groom and shake off, slides back in, weaves through the sedges (which part around it) and
   swims off the edge again. It never appears or vanishes in view: it enters and leaves off-screen or under the water, with ripples and splashes */
function rkOtterNook(P,t){ const nk=P.night, N=c0=>mix(c0,'#0c1420',nk*.55), wy=H*.935, FX=S.settings.effects, per=52, q=(t%per)/per;
  /* the path: [time, x (of W), y (of H), pose, heading] keyframes; poses: s swim, d dive, u under water, b on its back, r on the rock */
  const K=[[0,-.06,.95,'s',1],[.1,.12,.93,'s',1],[.15,.17,.925,'d',1],[.17,.19,.93,'u',1],[.27,.31,.955,'u',1],[.29,.33,.95,'s',1],[.31,.33,.95,'b',1],[.47,.36,.945,'b',1],[.5,.37,.95,'s',1],[.55,.385,.955,'s',1],[.57,.39,.94,'r',1],[.72,.39,.94,'r',-1],[.75,.36,.95,'s',-1],[.86,.24,.965,'s',-1],[.9,.2,.96,'u',-1],[1,-.08,.97,'u',-1]];
  let i=0; while(i<K.length-2&&q>K[i+1][0]) i++; const A=K[i], B=K[i+1], u=clamp((q-A[0])/(B[0]-A[0]),0,1), e=u*u*(3-2*u), ox=W*(A[1]+(B[1]-A[1])*e), oy=H*(A[2]+(B[2]-A[2])*e), pose=A[3], dir=A[4], s=H*.005*(oy/H/.94);
  /* the boulder it climbs and the log, drawn first; the sedges after the otter where it passes behind them */
  const rx=W*.39, ry=H*.955; v3rock(g,W*.07,H+H*.01,W*.06,H*.05,P,null,true,41); v3rock(g,rx,ry+H*.03,W*.035,H*.045,P,null,true,42);
  g.fillStyle=N('#4f6a34'); g.beginPath(); g.ellipse(rx-W*.004,ry-H*.01,W*.018,H*.006,-.1,Math.PI,0); g.fill(); /* moss on the boulder */
  { const lx0=W*.1, ly0=H*.985, lx1=W*.26, ly1=H*.955, lw=H*.016; g.strokeStyle=N('#5a4630'); g.lineWidth=lw; g.lineCap='round'; g.beginPath(); g.moveTo(lx0,ly0); g.lineTo(lx1,ly1); g.stroke(); g.strokeStyle=N('#7a6244'); g.lineWidth=lw*.35; g.beginPath(); g.moveTo(lx0,ly0-lw*.25); g.lineTo(lx1,ly1-lw*.25); g.stroke();
    g.strokeStyle=N('#4a3a28'); g.lineWidth=Math.max(1.5,lw*.25); g.beginPath(); g.moveTo(W*.16,H*.974); g.lineTo(W*.17,H*.95); g.moveTo(W*.22,H*.963); g.lineTo(W*.235,H*.94); g.stroke(); g.lineCap='butt'; rkLogMoss(g,N,lx0,ly0,lx1,ly1,lw);
    g.strokeStyle=v3rgba('#e8f4f0',.25*(1-nk)); g.lineWidth=1; g.beginPath(); g.ellipse((lx0+lx1)/2,(ly0+ly1)/2+lw*.5,W*.085,H*.006,-.19,0,Math.PI); g.stroke(); } /* a fallen spruce, bark and peeled wood, two snapped branches, moss, the water line along it */
  const ot=()=>rkOtterDraw(ox,oy,s,pose,dir,t,N);
  if(pose==='u'){ g.save(); g.globalAlpha=.32; ot(); g.restore(); if(FX) for(let k=0;k<4;k++){ const bq=((t*1.6+k*.25)%1); g.strokeStyle=v3rgba('#e8f8ff',.5*(1-bq)); g.lineWidth=1; g.beginPath(); g.arc(ox-dir*s*(4+k*3),oy-s*2-bq*s*8,s*.5,0,7); g.stroke(); } } /* seen gliding under the clear water, bubbles rising behind */
  else if(pose==='r') ot();
  else { g.save(); g.beginPath(); g.rect(0,0,W,oy); g.clip(); ot(); g.restore(); g.save(); g.beginPath(); g.rect(0,oy,W,H-oy+2); g.clip(); g.globalAlpha=.35; ot(); g.restore(); /* above the water line in full, below it seen through the water */
    g.strokeStyle=v3rgba('#e8f4f0',.45*(1-nk*.5)); g.lineWidth=1; g.beginPath(); g.ellipse(ox,oy,s*(pose==='b'?7:5),s*.9,0,0,7); g.stroke(); if(pose==='s'){ g.beginPath(); g.moveTo(ox-dir*s*3,oy); g.lineTo(ox-dir*s*13,oy-s*2.2); g.moveTo(ox-dir*s*3,oy+s*.4); g.lineTo(ox-dir*s*13,oy+s*2.6); g.stroke(); } } /* its ring and V-wake */
  /* splashes where it dives, surfaces, climbs out and slides in */
  if(FX) for(const [t0,x0,y0] of [[.15,.17,.925],[.29,.33,.95],[.57,.385,.955],[.72,.385,.955]]){ const d=q-t0; if(d>=0&&d<.035){ const k=d/.035; g.strokeStyle=v3rgba('#ffffff',.7*(1-k)); g.lineWidth=1.3; g.beginPath(); g.ellipse(W*x0,H*y0,s*(3+k*12),s*(.8+k*2.5),0,0,7); g.stroke(); g.fillStyle=v3rgba('#ffffff',.8*(1-k)); for(let j=0;j<6;j++){ const a=-Math.PI*(.15+j*.14); g.fillRect(W*x0+Math.cos(a)*s*6*k,H*y0+Math.sin(a)*s*7*Math.sin(k*Math.PI),1.8,1.8); } } }
  if(pose==='r'&&FX&&q<.62){ g.fillStyle=v3rgba('#e8f8ff',.6); for(let j=0;j<3;j++){ const dq=((t*2+j*.33)%1); g.fillRect(ox+(j-1)*s*2,oy+s*2+dq*s*6,1.2,1.6); } } /* drips as it climbs out */
  /* the sedges: a clump near you that bends with the breeze and parts around the otter as it swims through */
  for(let j=0;j<16;j++){ const bx=W*(.27+j*.0085)+Math.sin(j*3.7)*W*.004, by=H*(.975+((j*7)%3)*.008), hh=H*(.06+((j*5)%4)*.012), d=(bx-ox)/(s*14), push=Math.abs(oy-by)<H*.05&&Math.abs(d)<1&&pose!=='r'?(1-Math.abs(d))*Math.sign(d||1)*hh*.35:0, sw=Math.sin(t*1.2+j*.9)*H*.004+push;
    g.strokeStyle=N(j%3?'#4a6a34':'#5e7e3c'); g.lineWidth=Math.max(1.2,H*.0028); g.beginPath(); g.moveTo(bx,by); g.quadraticCurveTo(bx+sw*.3,by-hh*.6,bx+sw,by-hh); g.stroke(); if(j%4===1){ g.fillStyle=N('#6a4a2a'); g.beginPath(); g.ellipse(bx+sw*.95,by-hh*.92,H*.0025,H*.009,0,0,7); g.fill(); } } }
/* moss along the top of the fallen log */
function rkLogMoss(c,N,x0,y0,x1,y1,lw){ c.fillStyle=N('#5a7a3a'); for(let i=0;i<7;i++){ const u=.08+i*.13, X=x0+(x1-x0)*u, Y=y0+(y1-y0)*u-lw*.45; c.beginPath(); c.ellipse(X,Y,lw*1.1,lw*.35,-.19,Math.PI,0); c.fill(); } }
/* a river otter from the side, s per unit, facing dir: long sleek body, small round head with ears, whiskers and a pale throat, short legs,
   a thick tapering tail. Poses: s swimming (low in the water, head up), d diving (arched, tail flicking up), u under water (stretched out),
   b floating on its back eating, r on the rock (sitting up, grooming) */
function rkOtterDraw(x,y,s,pose,dir,t,N){ const fur=N('#5a3a22'), furL=N('#7a5434'), thr=N('#c8aa88'), dk=N('#1c120c');
  g.save(); g.translate(x,y); g.scale(dir,1);
  if(pose==='r'){ const gr=Math.sin(t*5)>0, hb=Math.sin(t*3)*s*.6; g.translate(0,-s*3); g.fillStyle=fur; g.beginPath(); g.moveTo(-s*7,s*3); g.quadraticCurveTo(-s*11,s*2.5,-s*13,s*3.4); g.lineTo(-s*6,s*3.8); g.fill(); /* the tail along the rock */
    g.beginPath(); g.ellipse(-s*1,-s*1,s*3.4,s*5.4,-.25,0,7); g.fill(); g.fillStyle=thr; g.beginPath(); g.ellipse(s*.8,-s*2,s*1.6,s*3.2,-.25,0,7); g.fill(); /* sitting up, the pale chest */
    g.fillStyle=fur; g.beginPath(); g.ellipse(s*1.6,-s*7.2+hb,s*2.6,s*2.2,0,0,7); g.fill(); g.beginPath(); g.ellipse(s*3.6,-s*6.8+hb,s*1.4,s*1.1,0,0,7); g.fill(); g.fillStyle=thr; g.beginPath(); g.ellipse(s*3.4,-s*6.2+hb,s*1.1,s*.7,0,0,7); g.fill();
    g.fillStyle=dk; g.beginPath(); g.arc(s*4.8,-s*7+hb,s*.45,0,7); g.fill(); g.beginPath(); g.arc(s*2.6,-s*7.8+hb,s*.32,0,7); g.fill(); g.fillStyle=fur; g.beginPath(); g.arc(s*.6,-s*8.9+hb,s*.6,0,7); g.fill();
    g.strokeStyle=v3rgba('#e8e0d0',.6); g.lineWidth=.6; g.beginPath(); g.moveTo(s*4.4,-s*6.6+hb); g.lineTo(s*6.4,-s*6.9+hb); g.moveTo(s*4.4,-s*6.4+hb); g.lineTo(s*6.2,-s*6+hb); g.stroke();
    g.fillStyle=furL; g.beginPath(); g.ellipse(s*(gr?2.6:2),-s*(gr?5.2:3.4),s*.8,s*1.6,gr?-.9:-.3,0,7); g.fill(); g.restore(); return; } /* a forepaw up to the face while it grooms */
  if(pose==='b'){ const bob=Math.sin(t*2.2)*s*.3, chew=Math.sin(t*9)*s*.25; g.translate(0,bob); g.fillStyle=fur; g.beginPath(); g.ellipse(0,0,s*7,s*2,0,Math.PI,0); g.fill(); g.fillStyle=thr; g.beginPath(); g.ellipse(s*1,-s*.6,s*4.6,s*1.3,0,Math.PI,0); g.fill(); /* floating belly up */
    g.fillStyle=fur; g.beginPath(); g.ellipse(s*7.6,-s*1.2,s*2.4,s*1.9,.3,0,7); g.fill(); g.fillStyle=thr; g.beginPath(); g.ellipse(s*8.6,-s*.6,s*1.2,s*.8,.3,0,7); g.fill(); g.fillStyle=dk; g.beginPath(); g.arc(s*9.8,-s*1+chew,s*.42,0,7); g.fill(); g.beginPath(); g.arc(s*8,-s*2.2,s*.3,0,7); g.fill();
    g.fillStyle=N('#b8483a'); g.beginPath(); g.ellipse(s*5.6,-s*2.6+chew,s*1.4,s*.6,-.4,0,7); g.fill(); g.fillStyle=furL; g.beginPath(); g.ellipse(s*5,-s*1.9,s*.7,s*1.2,-.6,0,7); g.fill(); g.beginPath(); g.ellipse(s*6.4,-s*1.9,s*.7,s*1.2,-.2,0,7); g.fill(); /* a crayfish held in both forepaws */
    g.fillStyle=fur; g.beginPath(); g.moveTo(-s*6.5,-s*.4); g.quadraticCurveTo(-s*10,-s*1.6,-s*13,-s*.8); g.lineTo(-s*6.5,s*.2); g.fill(); g.restore(); return; }
  const arch=pose==='d'?1:0, ang=pose==='d'?.55:pose==='u'?.06*Math.sin(t*3):0, kick=Math.sin(t*(pose==='u'?7:5))*s*.5; g.rotate(arch?ang:ang);
  g.fillStyle=fur; g.beginPath(); g.moveTo(-s*7,-s*.2); g.quadraticCurveTo(-s*11,-s*(arch?3:.4)+kick*.4,-s*15,-s*(arch?5:.2)+kick); g.quadraticCurveTo(-s*11,s*(arch?-1:1.1),-s*7,s*1.3); g.fill(); /* the thick tapering tail */
  g.beginPath(); g.ellipse(0,s*.3,s*7.8,s*(arch?2.6:2.2),0,0,7); g.fill(); g.fillStyle=furL; g.beginPath(); g.ellipse(-s*.5,-s*.9,s*6.4,s*.8,0,0,7); g.fill(); /* the body, light along the wet back */
  g.fillStyle=fur; g.beginPath(); g.ellipse(s*7.4,-s*.9,s*2.7,s*2.1,0,0,7); g.fill(); g.beginPath(); g.ellipse(s*9.6,-s*.6,s*1.5,s*1.1,0,0,7); g.fill(); g.fillStyle=thr; g.beginPath(); g.ellipse(s*8.4,s*.4,s*1.8,s*.9,0,0,7); g.fill(); /* the round head, muzzle and pale throat */
  g.fillStyle=dk; g.beginPath(); g.arc(s*10.9,-s*.8,s*.45,0,7); g.fill(); g.beginPath(); g.arc(s*8.4,-s*1.6,s*.32,0,7); g.fill(); g.fillStyle=fur; g.beginPath(); g.arc(s*6.4,-s*2.7,s*.6,0,7); g.fill(); /* nose, eye, ear */
  g.strokeStyle=v3rgba('#e8e0d0',.55); g.lineWidth=.6; g.beginPath(); g.moveTo(s*10.4,-s*.3); g.lineTo(s*12.6,-s*.6); g.moveTo(s*10.4,-s*.1); g.lineTo(s*12.4,s*.4); g.stroke(); /* whiskers */
  g.fillStyle=furL; for(const lx of [s*4,-s*4]){ g.beginPath(); g.ellipse(lx+kick*.6,s*2.2,s*.9,s*1.4,.4,0,7); g.fill(); } /* paddling feet */
  g.restore(); }
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
      rkRange(x,far,hz+1,{seed:21,bedDark:'rgba(30,34,62,'+(.1+nk*.05)+')',bedLight:v3rgba('#ffffff',.06*(1-nk)),bedWarm:v3rgba('#d8a880',.08*(1-nk)),ledge:v3rgba('#fff4e0',.12*(1-nk)),snowShade:'rgba(40,50,96,.22)',rock:mix(mix(P.far,'#aab0c4',.25),'#1a2240',nk),snow:snowFar,snowLine:hz-H*.17,shade,line:v3rgba(mix(P.far,'#2a3050',.5),.45),rim:v3rgba(P.rim||'#fff0d0',.25*(1-nk)),haze:P.farHaze,hazeA:.62});
      const near=rkRidge(44,[[.44,.31,.15],[.505,.26,.05],[.56,.3,.05],[.62,.38,.12],[.67,.33,.045],[.79,.33,.12],[.74,.3,.05],[.85,.27,.06]],hz+1,1.15);
      rkRange(x,near,hz+1,{seed:44,bedDark:'rgba(24,28,52,'+(.22+nk*.06)+')',bedLight:v3rgba('#ffffff',.12*(1-nk)),bedWarm:v3rgba('#d8a070',.17*(1-nk)),ledge:v3rgba('#fff4e0',.3*(1-nk)),snowShade:'rgba(40,50,96,.3)',glacier:[.665,.765,.13],ice:mix(mix('#e8f4ff',P.farHaze,.08),'#2a3a68',nk),iceBlue:mix('#6aaed8','#1a2a58',nk),rock:mix(mix(P.far,'#8a8a98',.4),'#141a30',nk),snow,snowLine:hz-H*.2,shade,line:v3rgba('#1a1e30',.55),rim:v3rgba(P.rim||'#fff0d0',.4*(1-nk)),haze:P.farHaze,hazeA:.45});
      /* forest at the foot of the peaks across the valley floor, hazier with distance, so the mountains rise out of trees, not bare ground */
      { const R2=v3rng(88), fc=mix(mix('#2e4a38',P.farHaze,.35),'#0c1618',nk), fc2=mix(mix('#3e5e48',P.farHaze,.35),'#101c1c',nk), topY=X=>hz-H*(.03+.012*Math.sin(X*.011)+.008*Math.sin(X*.037));
        x.fillStyle=fc; x.beginPath(); x.moveTo(W*.2,hz+1); for(let X=W*.2;X<=W*.82;X+=6) x.lineTo(X,topY(X)+H*.004); x.lineTo(W*.82,hz+1); x.closePath(); x.fill();
        for(let i=0;i<520;i++){ const X=W*(.2+R2()*.62), Y=topY(X)+(hz-topY(X))*R2(), s=H*(.004+R2()*.005); x.fillStyle=R2()<.5?fc:fc2; x.beginPath(); x.moveTo(X,Y-s*2.3); x.lineTo(X+s*.8,Y); x.lineTo(X-s*.8,Y); x.closePath(); x.fill(); } }
      rkShoulder(x,P,hz,-1,nk); rkShoulder(x,P,hz,1,nk); }
    /* the far shore (director, 2026-11-23: "the land by the water needs more greenery, it looks like a beach"; "the shoreline looks way too
       large"): a thin grassy bank with willow and alder shrubs, a few granite boulders at the water and a dark wet edge */
    { const r=v3rng(64), nk=P.night*.6, g1=mix(mix('#3e5e34',P.back,.25),'#0c1614',nk), g2=mix(mix('#5a7a40',P.back,.25),'#101a14',nk), g3=mix(mix('#2e4a2c',P.back,.25),'#0a1210',nk), gr=mix(mix('#8a8680',P.far,.3),'#141a28',nk), bank=X=>hz-H*(.005+.0025*Math.sin(X*.02)+.0015*Math.sin(X*.071));
      x.fillStyle=g1; x.beginPath(); x.moveTo(-2,hz+1); for(let X=-2;X<=W+2;X+=8) x.lineTo(X,bank(X)); x.lineTo(W+2,hz+1); x.closePath(); x.fill();
      for(let i=0;i<90;i++){ const X=r()*W, s=H*(.0028+r()*.004), Y=bank(X)+s*.4; x.fillStyle=r()<.5?g2:g3; x.beginPath(); x.ellipse(X,Y,s*1.7,s*1.1,0,Math.PI,0); x.fill(); } /* shrubs along the bank */
      x.strokeStyle=g2; x.lineWidth=1; x.beginPath(); for(let X=0;X<W;X+=W*.004){ const Y=bank(X); x.moveTo(X,Y+1); x.lineTo(X+(r()-.5)*2,Y-H*(.002+r()*.003)); } x.stroke(); /* grass */
      for(let i=0;i<16;i++){ const X=r()*W, s=H*(.0025+r()*.0035); x.fillStyle=gr; x.beginPath(); x.ellipse(X,hz,s*1.5,s,0,Math.PI,0); x.fill(); x.fillStyle=v3rgba('#ffffff',.14*(1-P.night)); x.beginPath(); x.ellipse(X-s*.4,hz-s*.55,s*.5,s*.18,0,0,7); x.fill(); } /* granite boulders at the water */
      x.fillStyle=v3rgba('#141c16',.4); x.fillRect(0,hz-1,W,2); }
    // the cliff the river falls over
    { const fx=W*WA_FALL.x, ft=hz-H*WA_FALL.top; const rk=mix(mix('#6a6468',P.far,.25),'#0a1020',P.night*.6), rkD=mix(rk,'#000000',.3), rkL=mix(rk,'#ffffff',.18);
      const cliff=()=>{ x.beginPath(); x.moveTo(fx-W*.055,hz+1); x.bezierCurveTo(fx-W*.06,ft+H*.03,fx-W*.04,ft+H*.004,fx-W*.012,ft); x.lineTo(fx+W*.012,ft+H*.001); x.bezierCurveTo(fx+W*.04,ft+H*.004,fx+W*.06,ft+H*.03,fx+W*.065,hz+1); x.closePath(); };
      x.fillStyle=rk; cliff(); x.fill(); x.save(); cliff(); x.clip(); rkStrata(x,ft,hz,61,{tilt:-.02,dark:'rgba(20,24,40,.2)',light:v3rgba('#ffffff',.08*(1-P.night)),warm:v3rgba('#c89a70',.1*(1-P.night)),line:'rgba(16,18,30,.5)',ledge:v3rgba('#fff4e0',.18*(1-P.night))});
      x.fillStyle=v3rgba('#000000',.22); x.beginPath(); x.moveTo(fx+W*.012,ft); x.bezierCurveTo(fx+W*.04,ft+H*.004,fx+W*.06,ft+H*.03,fx+W*.065,hz+1); x.lineTo(fx+W*.02,hz+1); x.closePath(); x.fill(); x.restore(); /* the same layered rock as the mountains, its right side in shade (the floating light and moss ovals are gone: director) */
      x.strokeStyle=rkD; x.lineWidth=1; x.beginPath(); x.moveTo(fx-W*.035,ft+H*.02); x.lineTo(fx-W*.03,ft+H*.05); x.lineTo(fx-W*.034,ft+H*.07); x.moveTo(fx+W*.03,ft+H*.03); x.lineTo(fx+W*.036,ft+H*.06); x.stroke(); /* joints */
      for(const [ox,hh] of [[-.042,.035],[-.03,.026],[.028,.03],[.042,.022]]){ const X=fx+W*ox, Y=ft+H*(.002+Math.abs(ox)*.12); rkSpruce(x,X,Y,H*hh,mix(mix('#24402e',P.back,.3),'#0a1410',P.night*.9),P.rim,.2*(1-P.night),Math.round(ox*1000)+60); } } /* spruces rooted on the cliff top */
    /* the shore forest (director: no recycled look): uneven spruce of very different heights with golden larches among them, never one even row */
    { const r=v3rng(23); for(let row=0;row<2;row++) for(let i=0;i<30;i++){ const px=W*(i/29)+(r()-.5)*W*.02, base=hz-H*(.004+row*.004), h=H*(.035+r()*.07)*(row?1.15:1); if(row&&((px>W*.34&&px<W*.62)||(px>W*.76&&px<W*.86))) continue;
      const larch=r()<.22, col=larch?mix('#c89a3a',P.front,.25+P.night*.5):(row?P.front:mix(P.back,P.farHaze,.3)); rkSpruce(x,px,base,h*(larch?.85:1),col,P.rim,.25*(1-P.night),row*40+i+1); } } /* spruce with drooping tiers of branches, a trunk and a lit side (director: the trees need more detail) */
    for(const [px,hh] of [[.26,.06],[.31,.05],[.55,.065],[.68,.055],[.93,.06]]) waBirch(x,W*px,hz-H*.006,H*hh,P,Math.round(px*1000));
    // fireweed along the shore
    { const r=v3rng(12); for(let i=0;i<30;i++){ const px=W*(.2+r()*.75), hh=H*(.008+r()*.01); if(px>W*.76&&px<W*.88) continue; x.strokeStyle=mix('#4a6a3a',P.front,P.night*.5); x.lineWidth=1; x.beginPath(); x.moveTo(px,hz); x.lineTo(px,hz-hh); x.stroke(); x.fillStyle=mix('#d8508a',P.front,.15+P.night*.55); x.fillRect(px-1,hz-hh,2,hh*.55); } }
    waCabin(x,W*.3,hz-H*.004,H*.0058,P); /* out on the far shore in full view (behind the lodge it was hidden, director) */
/* the canoe dock (Moraine Lake): a short timber dock on posts with red canoes tied along it, one green */    { const dx=W*.555, dw=W*.06, dy=hz+H*.006, nk=P.night*.55, wood=mix('#6a5040',P.front,nk), woodL=mix('#8a6a50',P.front,nk); x.fillStyle=wood; for(let i=0;i<=4;i++) x.fillRect(dx+dw*i/4-1,dy,2.2,H*.012); x.fillStyle=woodL; x.fillRect(dx-W*.004,dy-H*.004,dw+W*.008,H*.004); x.fillStyle=v3rgba('#000000',.25); x.fillRect(dx-W*.004,dy,dw+W*.008,1);      for(const [k,col] of [[0,'#c83a2a'],[1,'#c83a2a'],[2,'#3a6a4a'],[3,'#c83a2a']]){ const cx=dx+W*.004+k*W*.015, cy=dy+H*(.009+(k%2)*.004), L=W*.013, hc=mix(col,P.front,nk); x.fillStyle=hc; x.beginPath(); x.moveTo(cx-L*.5,cy-H*.004); x.quadraticCurveTo(cx,cy+H*.005,cx+L*.5,cy-H*.004); x.quadraticCurveTo(cx,cy-H*.001,cx-L*.5,cy-H*.004); x.fill(); x.fillStyle=v3rgba('#ffffff',.25*(1-nk)); x.fillRect(cx-L*.35,cy-H*.003,L*.7,1); } }
    v3water(x,P,hz,cnv,.42);
    rkLakebed(x,P,hz); /* the clear lake's stony floor (director, 2026-11-23: "very clear waters", after Lake Louise) */ },
  live(P,t,hz,sun){ v3glitter(P,t,hz,sun); rkDams(P,hz); /* drawn over the glitter, so the water's sparkle never runs across the dam (director) */ const FX=S.settings.effects, fx=W*WA_FALL.x, ft=hz-H*WA_FALL.top;
    // the waterfall pours and foams onto the dam
    g.fillStyle=v3rgba(mix('#ffffff',P.wTop,.25),.8-P.night*.3); g.beginPath(); g.moveTo(fx-W*.006,ft); g.lineTo(fx+W*.006,ft); g.lineTo(fx+W*.01,hz+H*.004); g.lineTo(fx-W*.01,hz+H*.004); g.closePath(); g.fill();
    if(FX){ g.strokeStyle='rgba(255,255,255,.75)'; g.lineWidth=1; for(let i=0;i<6;i++){ const xx=fx-W*.005+i*W*.002, q=((t*1.4+i*.37)%1), y=ft+q*(hz-ft); g.beginPath(); g.moveTo(xx,y); g.lineTo(xx,y+H*.015); g.stroke(); }
      for(let i=0;i<5;i++){ const q=((t*.4+i*.2)%1); g.fillStyle='rgba(240,250,255,'+(.3*(1-q))+')'; g.beginPath(); g.arc(fx+(i-2)*W*.006,hz-q*H*.025,H*(.006+q*.012),0,7); g.fill(); } }
    // chimney smoke
    if(FX) for(let i=0;i<5;i++){ const q=((t*.15+i*.2)%1), sx=W*.3+H*.0058*12*.74+H*.0058*.8+q*H*.03, sy=hz-H*.077-q*H*.08; g.fillStyle='rgba(220,226,234,'+(.25*(1-q))+')'; g.beginPath(); g.arc(sx,sy,H*(.006+q*.012),0,7); g.fill(); }
    waFlag(W*.37,hz-H*.006-H*.0105*4.6,H*.0105,P,t);
    // a beaver gnaws on its dam (the swimmer moved to the near corner as the otter: rkOtterNook, director 2026-11-23)
    { const bx=W*(WA_FALL.x+.012), by=hz-H*.008, s=H*.004, ch=Math.sin(t*9)*.25*(Math.sin(t*.7)>0?1:0), oc=mix('#5a3a22',P.front,P.night*.5); g.fillStyle=oc; g.beginPath(); g.ellipse(bx,by,s*1.8,s*1.4,0,0,7); g.fill(); g.beginPath(); g.ellipse(bx+s*1.6,by-s*.6+ch*s,s*.9,s*.75,.2,0,7); g.fill(); g.fillStyle=mix('#3a2614',P.front,P.night*.5); g.beginPath(); g.ellipse(bx-s*2.2,by+s*.9,s*1.3,s*.4,.3,0,7); g.fill(); m33dot(g,bx+s*1.9,by-s*.9+ch*s,s*.16,'#140c08'); }
    waMoose(W*.42,hz-H*.004,H*.0034,P,t);
    // Canada geese: a pair swimming near the far shore, and now and then a V flying over
    for(let i=0;i<2;i++){ const ph=t*.015+i*.5, y=hz+H*(.02+i*.012); waGoose(W*(.58+.08*Math.sin(ph))+i*H*.03,y,H*.0045,Math.cos(ph)>=0?1:-1,P,t,i,false); }
    if(FX){ const per=37, q=(t%per)/per; if(q<.45){ const e=q/.45, lx=W*(1.1-e*1.3), ly=hz*.32+Math.sin(e*3)*hz*.04; for(let i=0;i<7;i++){ const row=Math.ceil(i/2), side=i%2?1:-1; waGoose(lx+row*H*.03,ly+side*row*H*.016,H*.0035,-1,P,t,i,true); } } }
    /* the canoeist fishes by day and paddles home to the cabin as night falls, then his canoe lies pulled up on the shore beside it until he
       paddles out again at dawn (director, 2026-11-23: "at night time, the kayak guy fishing should go back to his cabin") */
    { const n=P.night, k=clamp((n-.25)/.4,0,1), e=k*k*(3-2*k); if(n>rkCan.n+1e-4) rkCan.dir=-1; else if(n<rkCan.n-1e-4) rkCan.dir=1; rkCan.n=n;
      const fx=W*(.5+.1*Math.sin(t*.012)), fy=hz+H*.075, hx=W*.345, hy=hz+H*.01, s0=H*.0045;
      if(k<=0) waCanoe(fx,fy,s0,P,t,0,1); else if(k<1) waCanoe(fx+(hx-fx)*e,fy+(hy-fy)*e,s0*(1-e*.5),P,t,1,rkCan.dir); else waCanoe(hx,hz-H*.002,s0*.5,P,t,2,1); }
    v3mist(P,t,hz,.14+P.night*.06); },
  fore(P,t){ rkOtterNook(P,t); /* the near shore corner: two granite boulders with lichen and moss and a clump of fireweed swaying (one-water rework: the big flat corner pine was a dark silhouette) */ const b=H+2, N=c0=>mix(c0,P.top,P.night*.45); v3rock(g,W*.94,b-H*.03,W*.07,H*.075,P); v3rock(g,W*.995,b-H*.06,W*.05,H*.06,P); g.fillStyle=N('#5a7a3a'); g.beginPath(); g.ellipse(W*.93,b-H*.085,W*.03,H*.008,-.1,0,7); g.fill(); g.fillStyle=v3rgba(N('#d8d0a0'),.6); for(let i=0;i<6;i++){ g.beginPath(); g.arc(W*(.92+i*.009),b-H*(.06+(i%3)*.01),H*.0025,0,7); g.fill(); }
    for(let i=0;i<8;i++){ const x0=W*(.885+i*.008), sw=Math.sin(t*1.1+i)*H*.005, h=H*(.09+((i*7)%4)*.015); g.strokeStyle=N('#4a6a3a'); g.lineWidth=Math.max(1.2,H*.003); g.beginPath(); g.moveTo(x0,b); g.quadraticCurveTo(x0+sw*.4,b-h*.6,x0+sw,b-h); g.stroke(); g.fillStyle=N('#d8508a'); for(let k=0;k<5;k++){ g.beginPath(); g.ellipse(x0+sw*(1-k*.08),b-h+k*H*.009,H*.004,H*.0045,0,0,7); g.fill(); } } }
};
