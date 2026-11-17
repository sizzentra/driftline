// =====================================================================
// EMBER SPRINGS rebuilt (0.3.3): a natural lava-rock shelf to stand on, a real travertine hillside, a basalt headland
// =====================================================================
// the shelf: one weathered slab of dark basalt with a worn flat top, soft joints, a warm crust, ferns in the cracks,
// a glowing seam and a little steam vent, standing in the warm water (the part under the surface fades into it)
function v3stonePlat2(P,t,night,dockY){ const PW=W*.19, ed=PW+W*.014, N=c=>mix(c,'#050204',night*.3), lit=.4+night*.6, lx=PW-W*.012, ly=dockY-H*.07, wl=dockY+H*.07, rock=N('#3a2e2c'), rockL=N('#5a4844'), rockD=N('#1e1616');
  v3glow(g,lx,ly,H*.17,'rgba(255,170,90,.85)',lit*.45*(.92+.08*Math.sin(t*5.7)));
  const body=()=>{ g.beginPath(); g.moveTo(-2,dockY-H*.004); g.lineTo(ed-W*.03,dockY-H*.006); g.quadraticCurveTo(ed-W*.008,dockY-H*.004,ed,dockY+H*.02); g.quadraticCurveTo(ed+W*.006,dockY+H*.06,ed-W*.004,wl+H*.01); g.lineTo(ed-W*.01,H+2); g.lineTo(-2,H+2); g.closePath(); };
  const bg=g.createLinearGradient(0,dockY,0,H); bg.addColorStop(0,rock); bg.addColorStop(.35,mix(rock,rockD,.4)); bg.addColorStop(1,rockD); g.fillStyle=bg; body(); g.fill();
  g.save(); body(); g.clip();
  for(let i=0;i<9;i++){ const x0=W*(.012+i*.022)+Math.sin(i*2.3)*W*.004; g.strokeStyle=v3rgba(mix(rockD,'#000000',.3),.5); g.lineWidth=Math.max(1,H*.0022); g.beginPath(); g.moveTo(x0,dockY+H*.006); g.lineTo(x0+Math.sin(i)*W*.003,dockY+H*.06); g.lineTo(x0-Math.sin(i*1.7)*W*.003,H); g.stroke(); g.fillStyle=v3rgba(rockL,.12); g.fillRect(x0+1,dockY+H*.006,W*.006,H); }
  const r=v3rng(37); g.fillStyle=v3rgba(rockD,.6); for(let i=0;i<40;i++){ g.beginPath(); g.arc(r()*ed,dockY+H*(.02+r()*.2),H*(.0015+r()*.003),0,7); g.fill(); }
  const wg=g.createLinearGradient(0,wl,0,H); wg.addColorStop(0,v3rgba(P.wMid,.35)); wg.addColorStop(1,v3rgba(P.wBot,.75)); g.fillStyle=wg; g.fillRect(-2,wl,ed+4,H-wl);
  g.restore();
  g.fillStyle=rockL; g.beginPath(); g.moveTo(-2,dockY-H*.004); g.lineTo(ed-W*.03,dockY-H*.006); g.quadraticCurveTo(ed-W*.008,dockY-H*.004,ed-W*.004,dockY+H*.008); g.lineTo(-2,dockY+H*.006); g.closePath(); g.fill();
  g.fillStyle=v3rgba(P.rim,.4); g.fillRect(-2,dockY-H*.006,ed-W*.03,1.2);
  for(const [cx,cw,col] of [[.03,.03,'#a86a3a'],[.11,.02,'#c8b04a'],[.16,.018,'#a86a3a']]){ g.fillStyle=v3rgba(N(col),.45); g.beginPath(); g.ellipse(W*cx,dockY,W*cw,H*.004,0,0,7); g.fill(); }
  const sp=.55+.45*Math.sin(t*1.4); g.strokeStyle=v3rgba(P.lava,.55+.35*sp); g.lineWidth=Math.max(1.2,H*.0025); g.beginPath(); g.moveTo(W*.09,dockY+H*.006); g.lineTo(W*.094,dockY+H*.03); g.lineTo(W*.088,dockY+H*.05); g.lineTo(W*.092,wl); g.stroke(); v3glow(g,W*.091,dockY+H*.03,H*.03,v3rgba(P.lava,.9),.15*sp);
  if(S.settings.effects){ for(let k=0;k<4;k++){ const q=((t*.18+k/4)%1); g.fillStyle=v3rgba('#f0e8e0',.2*(1-q)); g.beginPath(); g.arc(W*.09+Math.sin(q*5+k)*W*.004,dockY-q*H*.06,H*(.004+q*.01),0,7); g.fill(); } }
  g.strokeStyle=N('#4a6a3a'); g.lineWidth=1; for(const [fx,fl] of [[.005,.03],[.17,.025]]){ for(let k=0;k<4;k++){ const a=-Math.PI/2+(k-1.5)*.4+Math.sin(t*.8+k)*.04; g.beginPath(); g.moveTo(W*fx,dockY); g.quadraticCurveTo(W*fx+Math.cos(a)*H*fl*.5,dockY+Math.sin(a)*H*fl*.6,W*fx+Math.cos(a)*H*fl,dockY+Math.sin(a)*H*fl*.9); g.stroke(); } }
  g.strokeStyle=v3rgba(mix(P.wTop,'#ffffff',.5),.5); g.lineWidth=1; g.beginPath(); for(let X=-2;X<=ed+W*.01;X+=4) g.lineTo(X,wl+Math.sin(X*.1+t*1.6)*1.2); g.stroke();
  { const s=H*.012, bx=lx; g.fillStyle=N('#6a5a54'); g.fillRect(bx-s*1.2,dockY-H*.012,s*2.4,s*.7); g.fillRect(bx-s*.45,ly+s*1.6,s*.9,dockY-H*.012-(ly+s*1.6)); g.fillRect(bx-s*1.1,ly-s*1.1,s*2.2,s*2.6); g.fillStyle=v3rgba('#ffb060',.6+lit*.4); g.fillRect(bx-s*.55,ly-s*.6,s*1.1,s*1.4);
    g.fillStyle=N('#5a4a44'); g.beginPath(); g.moveTo(bx-s*1.9,ly-s*1.1); g.lineTo(bx,ly-s*2.4); g.lineTo(bx+s*1.9,ly-s*1.1); g.closePath(); g.fill(); g.beginPath(); g.arc(bx,ly-s*2.5,s*.35,0,7); g.fill(); }
  { const bx=W*.152, s=H*.018, by=dockY-H*.006; g.fillStyle=N('#a07a48'); g.beginPath(); g.moveTo(bx,by); g.lineTo(bx+s*.15,by-s); g.lineTo(bx+s*1.15,by-s); g.lineTo(bx+s*1.3,by); g.closePath(); g.fill(); } }
V3PLAT.stone=(P,t,night,dockY)=>v3stonePlat2(P,t,night,dockY);

// the travertine hillside: a soft hill with creamy terraces stepping down it, turquoise pools on each step, scrub on top
function embHillY(hz,X){ const segs=[[[-2,hz-H*.135],[W*.06,hz-H*.15],[W*.14,hz-H*.12],[W*.22,hz-H*.06]],[[W*.22,hz-H*.06],[W*.28,hz-H*.03],[W*.33,hz-H*.008],[W*.37,hz+1]]];
  for(const s of segs){ let px=null,py=null; for(let i=0;i<=30;i++){ const u=i/30,v=1-u, xx=v*v*v*s[0][0]+3*v*v*u*s[1][0]+3*v*u*u*s[2][0]+u*u*u*s[3][0], yy=v*v*v*s[0][1]+3*v*v*u*s[1][1]+3*v*u*u*s[2][1]+u*u*u*s[3][1]; if(px!==null&&X>=px&&X<=xx) return py+(yy-py)*(X-px)/(xx-px||1); px=xx; py=yy; } } return hz; }
m33wrap('ember','land',function(x,P,hz){ const hill=()=>{ x.beginPath(); x.moveTo(-2,hz+1); x.lineTo(-2,hz-H*.135); x.bezierCurveTo(W*.06,hz-H*.15,W*.14,hz-H*.12,W*.22,hz-H*.06); x.bezierCurveTo(W*.28,hz-H*.03,W*.33,hz-H*.008,W*.37,hz+1); x.closePath(); };
  const ground=mix(mix(P.terr,'#6a5a3a',.4),P.farHaze,.12), cream=mix(mix('#efe4d2',P.terr,.25),P.rockD,P.night*.6), creamD=mix(cream,'#8a7a64',.35), pool=mix(P.pool,P.wMid,.15+P.night*.35);
  const hg=x.createLinearGradient(0,hz-H*.15,0,hz); hg.addColorStop(0,mix(ground,P.rim,.12)); hg.addColorStop(1,mix(ground,'#000000',.25)); x.fillStyle=hg; hill(); x.fill();
  x.save(); hill(); x.clip();
  // modelled ground: the sun side of each fold lit, the far side in shade, so the hill has real shape
  { const lg=x.createLinearGradient(-2,0,W*.37,0); lg.addColorStop(0,v3rgba(P.rim,.18)); lg.addColorStop(.5,v3rgba(P.rim,0)); lg.addColorStop(1,v3rgba('#000000',.18)); x.fillStyle=lg; x.fillRect(-2,hz-H*.16,W*.4,H*.17);
    for(let k=0;k<4;k++){ const cx=W*(.04+k*.08), top=embHillY(hz,cx); const fg=x.createLinearGradient(cx-W*.03,0,cx+W*.03,0); fg.addColorStop(0,v3rgba(P.rim,.1)); fg.addColorStop(.5,v3rgba(P.rim,0)); fg.addColorStop(1,v3rgba('#000000',.14)); x.fillStyle=fg; x.beginPath(); x.moveTo(cx-W*.03,top+H*.01); x.quadraticCurveTo(cx,top+H*.002,cx+W*.035,top+H*.012); x.lineTo(cx+W*.02,hz); x.lineTo(cx-W*.04,hz); x.closePath(); x.fill(); }
    // rock outcrops with a lit top edge and a shadow below
    const rr=v3rng(53); for(let i=0;i<10;i++){ const X=W*(.02+rr()*.3), y=embHillY(hz,X)+H*(.01+rr()*.05), s=H*(.004+rr()*.005); x.fillStyle=v3rgba('#000000',.22); x.beginPath(); x.ellipse(X+s*.4,y+s*.5,s*1.5,s*.5,0,0,7); x.fill(); x.fillStyle=mix(P.rock,P.terr,.3); x.beginPath(); x.ellipse(X,y,s*1.3,s*.8,0,Math.PI,0); x.fill(); x.fillStyle=v3rgba(P.rim,.3); x.beginPath(); x.ellipse(X-s*.3,y-s*.5,s*.6,s*.2,0,0,7); x.fill(); } }
  x.restore();
  // a thin rim of light along the ridge line
  x.strokeStyle=v3rgba(P.rim,.35); x.lineWidth=Math.max(1,H*.002); x.beginPath(); x.moveTo(-2,hz-H*.135); x.bezierCurveTo(W*.06,hz-H*.15,W*.14,hz-H*.12,W*.22,hz-H*.06); x.stroke();
  const sc=mix('#5a4636',P.farHaze,.15+P.night*.5); /* 0.3.6: dry, scorched scrub */ x.fillStyle=sc; for(let i=0;i<20;i++){ const X=W*(.005+i*.011), y=embHillY(hz,X); x.beginPath(); x.arc(X,y,H*(.003+((i*7)%3)*.0015),Math.PI,0); x.fill(); }
  for(const tx of [.05,.13]){ const X=W*tx, y=embHillY(hz,X); x.strokeStyle=mix('#3a2a20',P.farHaze,.2); x.lineWidth=Math.max(1.2,H*.0025); x.beginPath(); x.moveTo(X,y); x.quadraticCurveTo(X+H*.008,y-H*.02,X+H*.004,y-H*.035); x.stroke(); x.beginPath(); x.moveTo(X+H*.006,y-H*.024); x.lineTo(X-H*.008,y-H*.034); x.moveTo(X+H*.005,y-H*.03); x.lineTo(X+H*.016,y-H*.042); x.moveTo(X+H*.004,y-H*.035); x.lineTo(X+H*.002,y-H*.046); x.stroke(); } }); /* 0.3.6: bare, burnt trees: nothing grows green beside a volcano */

// the basalt headland: tall hexagonal columns of varied height, each with a lit facet, a shaded facet and a tilted
// cap; talus at the foot, green on top
m33wrap('ember','land',function(x,P,hz){ const x0=W*.79, rock=mix(P.rock,'#2a2422',.2), lit=mix(P.rock,P.rim,.25), dark=mix(P.rockD,'#000000',.25);
  // a smooth rounded headland: one soft silhouette, columns only as gentle vertical shading on its face
  const head=()=>{ x.beginPath(); x.moveTo(x0-W*.03,hz+1); x.bezierCurveTo(x0-W*.01,hz-H*.03,x0+W*.02,hz-H*.09,x0+W*.07,hz-H*.11); x.bezierCurveTo(x0+W*.12,hz-H*.125,x0+W*.18,hz-H*.12,W+4,hz-H*.115); x.lineTo(W+4,hz+1); x.closePath(); };
  const hg=x.createLinearGradient(x0,0,W,0); hg.addColorStop(0,lit); hg.addColorStop(.35,rock); hg.addColorStop(1,dark); x.fillStyle=hg; head(); x.fill();
  x.save(); head(); x.clip();
  const vg=x.createLinearGradient(0,hz-H*.13,0,hz); vg.addColorStop(0,'rgba(0,0,0,0)'); vg.addColorStop(1,v3rgba(dark,.45)); x.fillStyle=vg; x.fillRect(x0-W*.03,hz-H*.13,W*.25,H*.13);
  x.restore();
  // a soft cap of grass and scrub over the top, and a skirt of rounded boulders at the foot
  // grass along the exact top edge of the headland, with tufts poking up and a lit fringe
  const gc=mix('#3e3430',P.farHaze,.15+P.night*.5); /* 0.3.6: scorched, ashy grass (no green at a volcano) */ x.save(); head(); x.clip(); x.strokeStyle=gc; x.lineWidth=H*.012; x.lineJoin='round'; x.beginPath(); x.moveTo(x0-W*.01,hz-H*.03); x.bezierCurveTo(x0-W*.01+W*.0,hz-H*.03,x0+W*.02,hz-H*.09,x0+W*.07,hz-H*.11); x.bezierCurveTo(x0+W*.12,hz-H*.125,x0+W*.18,hz-H*.12,W+4,hz-H*.115); x.stroke(); x.restore();
  for(let i=0;i<26;i++){ const X=x0+W*.03+i*W*.0065; const yt=X<x0+W*.07?hz-H*(.03+.08*((X-x0)/(W*.07))):hz-H*(.11+.012*Math.sin(Math.min(1,(X-x0-W*.07)/(W*.14))*Math.PI*.6)); x.strokeStyle=gc; x.lineWidth=1; x.beginPath(); x.moveTo(X,yt+1); x.lineTo(X+(i%3-1)*1.2,yt-H*(.006+(i%4)*.002)); x.stroke(); }
  const r=v3rng(29); for(let i=0;i<12;i++){ const X=x0-W*.02+r()*W*.2, s=H*(.004+r()*.006); x.fillStyle=r()<.5?rock:mix(rock,dark,.5); x.beginPath(); x.ellipse(X,hz-s*.3,s*1.3,s*.8,0,Math.PI,0); x.fill(); }
  const hz2=x.createLinearGradient(0,hz-H*.03,0,hz); hz2.addColorStop(0,v3rgba(P.farHaze,0)); hz2.addColorStop(1,v3rgba(P.farHaze,.3)); x.fillStyle=hz2; x.fillRect(x0-W*.03,hz-H*.03,W*.25,H*.03); });


// =====================================================================
// Waters tab pictures, 1:1: a still frame of the real scene (sky, scenery, life, the place you stand, foreground),
// rendered on the game canvas at a fixed daytime moment in clear weather and copied out. The next game frame
// redraws over it, so it is never seen. Rendered once per session.
// =====================================================================
var THUMB_CLEAR=false;
const _wx3k_th = wx3k; wx3k = function(){ return THUMB_CLEAR?'Clear':_wx3k_th(); };
v3Thumb = function(id){ if(V3THUMB[id]) return V3THUMB[id]; const L=LOCS.find(l=>l.id===id); if(!L||!V3SCENES[id]||!(W>40&&H>40)) return null;
  const oWXA=WXA; try{ THUMB_CLEAR=true; WXA=0; v3palette.k=null; const hz=HZ(), t=(function(){ let tt=42; if(typeof sfEvent==="function") while(sfEvent(tt).into<=SF_DUR+1) tt+=1.7; return tt; })(), p=.3, /* a calm moment between events */ gloom=id==='deep'?.1:0;
    g.save(); g.setTransform(DPR,0,0,DPR,0,0); g.clearRect(0,0,W,H);
    v3Scene(L,t,p,0,0,gloom,hz,{k:'Clear'}); v3Platform(L,t,0,H*.6,0); v3Fore(L,t,0); g.restore();
    const tw=840, th=Math.round(840*H/W), c=document.createElement('canvas'); c.width=tw; c.height=th; c.getContext('2d').drawImage(cv,0,0,cv.width,cv.height,0,0,tw,th);
    V3THUMB[id]=c.toDataURL('image/jpeg',.86); }
  catch(e){ V3THUMB[id]=null; console.warn('thumb '+id,e); }
  finally{ THUMB_CLEAR=false; WXA=oWXA; v3palette.k=null; }
  return V3THUMB[id]; };
// Waters pictures are rendered in the background, one per idle moment after the game loads, so opening the Waters
// tab never freezes; any still missing when the tab opens fade in as they finish.
const THUMB_Q={busy:false};
function thumbIdle(fn){ (window.requestIdleCallback||((f)=>setTimeout(()=>f({timeRemaining:()=>16}),120)))(fn,{timeout:1500}); }
const THUMB_FAIL={};
function thumbNext(){ const id=LOCS.map(l=>l.id).find(id=>V3SCENES[id]&&!V3THUMB[id]&&(THUMB_FAIL[id]||0)<2); if(!id){ THUMB_Q.busy=false; return; } THUMB_Q.busy=true;
  thumbIdle(()=>{ if(G.st!=='idle'&&G.st!=='waiting'){ setTimeout(thumbNext,1500); return; } v3Thumb(id); if(!V3THUMB[id]) THUMB_FAIL[id]=(THUMB_FAIL[id]||0)+1; const i=LOCS.findIndex(l=>l.id===id), el=document.querySelectorAll('.loc .sw2')[i]; if(el&&V3THUMB[id]){ el.style.background='url('+V3THUMB[id]+') center/cover'; el.classList.add('v3th'); el.animate&&el.animate([{opacity:.3},{opacity:1}],{duration:400}); } setTimeout(thumbNext,60); }); }
setTimeout(thumbNext,3000);
v3WaterThumbs = function(P){ P.querySelectorAll('.loc .sw2').forEach((el,i)=>{ const L=LOCS[i]; if(!L) return; const u=V3THUMB[L.id]; if(u){ el.style.background='url('+u+') center/cover'; el.classList.add('v3th'); } }); if(!THUMB_Q.busy) thumbNext(); };
