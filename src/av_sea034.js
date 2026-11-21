// =====================================================================
// 0.3.4 open sea (feedback from Cam): Brine Shelf gets a cargo ship that slips out from behind the island
// (with a soft far-off horn), flying fish instead of the dolphins, and a gentle bell on the buoy; Midnight Deep
// gets ghost ships far out on the horizon; storms on both make the water properly choppy, with rain squalls
// that smear the view, and rain finally has a sound.
// =====================================================================

// how stormy the open sea is right now: 0 calm .. 1 full storm (rain counts for a little), fades with the weather
function m34rng(seed){ const r=v3rng(seed*7919+101); r(); r(); r(); return r; } // the first draws of a small seed are not random enough
function seaStormK(){ const k=wx3k(), a=wx3A(); return (k==='Storm'?1:k==='Rain'?.42:0)*a; }

// ---------- sounds ----------
function m34ambOK(){ return typeof AC!=='undefined'&&AC&&MUS&&MUS.n&&S.settings.ambient&&S.settings.master; }
function m34horn(){ if(!m34ambOK()) return; try{ const t=AC.currentTime+.05, f=AC.createBiquadFilter(); f.type='lowpass'; f.frequency.value=320; f.connect(BUS.amb); if(MUS.n.wet) f.connect(MUS.n.wet);
  // one long low blast, two notes a fifth apart, swelling in and dying away like it is miles off
  for(const [hz,v] of [[92,.012],[138,.007]]){ const o=AC.createOscillator(), gn=AC.createGain(); o.type='sawtooth'; o.frequency.value=hz; gn.gain.setValueAtTime(0,t); gn.gain.linearRampToValueAtTime(v,t+.5); gn.gain.setValueAtTime(v,t+1.9); gn.gain.exponentialRampToValueAtTime(.0001,t+3.4); o.connect(gn); gn.connect(f); o.start(t); o.stop(t+3.5); } }catch(e){} }
function m34bell(){ if(!m34ambOK()) return; try{ const t=AC.currentTime+.05, outs=MUS.n.wet?[BUS.amb,MUS.n.wet]:[BUS.amb], b=520+Math.random()*30;
  // a soft bell: a few inharmonic partials, the high ones fading first
  mv('sine',b,t,3.2,.011,.004,outs); mv('sine',b*2.76,t,1.6,.004,.003,outs); mv('sine',b*5.4,t,.7,.0018,.002,outs); }catch(e){} }
const _musicTick_034=musicTick;
musicTick=function(){ _musicTick_034(); if(!AC||!MUS.n) return; const n=MUS.n, now=AC.currentTime;
  // rain on the water: a soft hiss that swells with the weather (heavier out on the deep sea)
  if(!n.rain){ try{ n.rain=AC.createBufferSource(); n.rain.buffer=noiseBuf(3,false); n.rain.loop=true; const hp=AC.createBiquadFilter(); hp.type='highpass'; hp.frequency.value=900; const lp=AC.createBiquadFilter(); lp.type='lowpass'; lp.frequency.value=6500; n.raing=AC.createGain(); n.raing.gain.value=0; n.rain.connect(hp); hp.connect(lp); lp.connect(n.raing); n.raing.connect(BUS.amb); n.rain.start(); }catch(e){ n.rain=1; } }
  if(n.raing){ const k=wx3k(), a=wx3A(), L=S.loc, sea=L==='deep'?1.5:['shelf','coast','reef','trench'].includes(L)?1.15:1; n.raing.gain.setTargetAtTime((k==='Storm'?.05:k==='Rain'?.028:0)*a*sea, now, 1.2); }
  if(S.settings.ambient&&S.loc==='shelf'&&Math.random()<.0055) m34bell(); };

// ---------- Brine Shelf: a container ship slips out from behind the island and steams off to the right ----------
function m34cargo(P,t,hz){ const per=150, k=(t%per)/per; if(k>.62) return; const q=k/.62, night=P.night||0;
  const cyc=Math.floor(t/per), s=H*.0036, x=W*(.395+q*.75), y=hz+s*.6, haze=.45+night*.25, fogA=wx3k()==='Fog'?1-.75*wx3A():1;
  if(cyc!==m34cargo.c&&k>.2&&k<.25){ m34cargo.c=cyc; if(S.loc==='shelf') m34horn(); }
  const N=c=>mix(mix(c,P.farHaze||P.far,haze),'#0a1020',night*.5);
  g.save(); g.globalAlpha=fogA; g.beginPath(); g.rect(W*.4385,0,W,hz+s*2); g.clip(); g.translate(x,y+Math.sin(t*.6)*s*.15);
  // hull: long and low, a raked bow on the right, a red band at the waterline
  g.fillStyle=N('#2c3442'); g.beginPath(); g.moveTo(-s*30,-s*2.6); g.lineTo(s*31,-s*2.6); g.lineTo(s*34,-s*3.4); g.lineTo(s*30,0); g.lineTo(-s*29,0); g.closePath(); g.fill();
  g.fillStyle=N('#7a3030'); g.fillRect(-s*29,-s*.7,s*59,s*.7);
  // containers in stacks of muted colors
  const cc=['#a0523a','#3a6a8a','#c8a040','#5a7a5a','#8a4a6a','#4a5a7a'];
  for(let i=0;i<9;i++){ const h=2+((i*7)%3); for(let j=0;j<h;j++){ g.fillStyle=N(cc[(i*3+j*5)%cc.length]); g.fillRect(-s*20+i*s*5.2,-s*2.6-(j+1)*s*1.3,s*4.8,s*1.2); } }
  // the bridge and funnel at the stern (left, it heads right)
  g.fillStyle=N('#e8e4da'); g.fillRect(-s*28,-s*9.5,s*6,s*6.9); g.fillRect(-s*29,-s*9.5,s*8,s*.9);
  g.fillStyle=N('#2c3442'); g.fillRect(-s*27,-s*8.4,s*4.4,s*.7);
  g.fillStyle=N('#b03a2a'); g.fillRect(-s*25.6,-s*12,s*2.2,s*2.6);
  if(night>.35){ g.fillStyle='rgba(255,220,150,.9)'; for(let i=0;i<4;i++) g.fillRect(-s*27.3+i*s*1.3,-s*8.3,s*.6,s*.5); g.fillStyle=(t%1.8)<.9?'rgba(255,255,240,.95)':'rgba(255,255,240,.3)'; g.fillRect(s*30.5,-s*6,s*.6,s*.6); }
  g.restore();
  // smoke drifting back from the funnel
  if(S.settings.effects) for(let i=0;i<6;i++){ const e=((t*.12+i/6)%1), sx=x-s*24.5-e*s*22, sy=y-s*12.5-e*s*7; if(sx<W*.44) continue; g.fillStyle=v3rgba(mix('#c8c8c8',P.farHaze||P.far,.5),.22*(1-e)*fogA); g.beginPath(); g.arc(sx,sy,s*(1.2+e*3.2),0,7); g.fill(); }
  // a faint wake line behind it
  g.strokeStyle=v3rgba(mix(P.wTop,'#ffffff',.6),.3*fogA); g.lineWidth=1; g.beginPath(); g.moveTo(Math.max(W*.44,x-s*60),y+s*.4); g.lineTo(x-s*29,y+s*.3); g.stroke(); }

// ---------- Brine Shelf: a little school of flying fish gliding over the swell ----------
function m34flyfish(P,t,hz,foam,night){ const per=17, k=(t%per)/per; if(k>.34) return; const cyc=Math.floor(t/per), r=m34rng(cyc*31+7), dir=r()<.5?-1:1, bx=W*(.36+r()*.32), by=hz+H*(.16+r()*.1), FX=S.settings.effects;
  const body=mix('#c8d8e8',P.wMid,night*.55), back=mix('#3a5a7a',P.wMid,night*.55), wing=mix('#dce8f4',P.wMid,night*.5);
  for(let i=0;i<4;i++){ const st=i*.035, q=(k-st)/.24; if(q<-.02||q>1.25) continue; const s=H*.0042*(1+(by-hz)/H*1.2), x0=bx+(i*.37%1-.5)*W*.12+i*W*.03*dir, y0=by+((i*.61)%1-.5)*H*.035, span=W*(.13+i*.012);
    const ql=clamp(q,0,1), x=x0+span*ql*dir, lift=Math.pow(Math.sin(ql*Math.PI),.55)*H*.018, y=y0-lift;
    if(q>=0&&q<=1){ // its shadow skims the water under it
      g.fillStyle=v3rgba(P.wBot,.22); g.beginPath(); g.ellipse(x,y0+s*.6,s*2.4,s*.4,0,0,7); g.fill();
      const ang=-Math.cos(ql*Math.PI)*.35*dir; g.save(); g.translate(x,y); g.scale(dir,1); g.rotate(ang*dir);
      g.fillStyle=v3rgba(wing,.75); g.beginPath(); g.moveTo(-s*.2,-s*.1); g.lineTo(-s*1.8,-s*2.2); g.lineTo(s*.9,-s*.3); g.closePath(); g.fill(); // the far wing
      g.fillStyle=body; g.beginPath(); g.ellipse(0,0,s*2.1,s*.55,0,0,7); g.fill(); g.fillStyle=back; g.beginPath(); g.ellipse(-s*.1,-s*.2,s*1.8,s*.25,0,0,7); g.fill();
      g.fillStyle=body; g.beginPath(); g.moveTo(-s*1.9,0); g.lineTo(-s*3,-s*.8); g.lineTo(-s*2.5,0); g.lineTo(-s*3.1,s*.7); g.closePath(); g.fill(); // forked tail
      g.fillStyle=v3rgba(wing,.9); g.beginPath(); g.moveTo(s*.1,0); g.lineTo(-s*1.4,-s*2.6); g.lineTo(s*1.3,-s*.2); g.closePath(); g.fill(); // the near wing
      m33dot(g,s*1.5,-s*.12,Math.max(.6,s*.18),'#101820'); g.restore(); }
    // a little splash where it leaves and where it lands, then rings
    if(FX) for(const [sx,q0] of [[x0,0],[x0+span*dir,1]]){ const e=(q-q0)/.22+ (q0?0:.5); if(e>0&&e<1){ g.fillStyle=v3rgba(foam,.7*(1-e)); for(let j=0;j<4;j++){ const a=-Math.PI/2+(j-1.5)*.5, rr=s*(.8+e*2); g.beginPath(); g.arc(sx+Math.cos(a)*rr,y0+Math.sin(a)*rr*1.4,Math.max(.8,s*.22),0,7); g.fill(); }
      g.strokeStyle=v3rgba(foam,.45*(1-e)); g.lineWidth=1; g.beginPath(); g.ellipse(sx,y0+1,s*(1+e*4),s*(.3+e*.9),0,0,7); g.stroke(); } } } }

// ---------- Midnight Deep: now and then a ghost ship drifts along the far horizon, and fades ----------
function m34ghost(P,t,hz){ const per=105, k=(t%per)/per, cyc=Math.floor(t/per), r=m34rng(cyc*17+3); if(r()<.25) return; // most nights, not every time
  const vis=k<.5?Math.sin(k/.5*Math.PI):0; if(vis<.01) return; const night=P.night||0, fl=.82+.18*Math.sin(t*7.3)*Math.sin(t*2.1), A=vis*(.14+night*.18)*fl*(1-.5*seaStormK()), x=W*(.41+r()*.08+k*.12), y=hz+H*.003, s=H*(.0032+r()*.0014), col=mix('#bfe8d8',P.far,.25);
  g.save(); g.globalAlpha=A; g.translate(x+Math.sin(t*1.7)*s*.4,y); g.fillStyle=col; g.strokeStyle=col; g.lineWidth=Math.max(.8,s*.3);
  // hull: low bow on the right, a tall stern castle on the left
  g.beginPath(); g.moveTo(-s*13,-s*6); g.lineTo(-s*9,-s*6); g.lineTo(-s*8,-s*3); g.lineTo(s*9,-s*3); g.lineTo(s*13,-s*4.6); g.quadraticCurveTo(s*10,0,s*6,s*.6); g.lineTo(-s*10,s*.6); g.quadraticCurveTo(-s*13,-s*2,-s*13,-s*6); g.closePath(); g.fill();
  // three masts with torn sails
  for(const [mx,mh,sw] of [[-s*5,s*20,s*6],[s*1.5,s*24,s*7],[s*7.5,s*16,s*5]]){ g.beginPath(); g.moveTo(mx,-s*3); g.lineTo(mx,-s*3-mh); g.stroke();
    for(let j=0;j<2;j++){ const top=-s*3-mh*(.92-j*.42), bot=top+mh*.34; g.beginPath(); g.moveTo(mx-sw/2,top); g.lineTo(mx+sw/2,top); g.lineTo(mx+sw/2,bot-s*.6); for(let z=4;z>=0;z--){ g.lineTo(mx-sw/2+sw*z/4,bot-((z+j)%2?s*1.8:0)); } g.closePath(); g.globalAlpha=A*.7; g.fill(); g.globalAlpha=A; } }
  // a cold lantern at the stern
  g.restore(); v3glow(g,x-s*12,y-s*6.5,s*5,'rgba(150,255,210,.9)',A*1.6);
  // its faint reflection
  g.save(); g.globalAlpha=A*.35; g.fillStyle=col; g.fillRect(x-s*12,y+s*1,s*24,s*.6); g.fillRect(x-s*8,y+s*2.4,s*16,s*.5); g.restore(); }

// ---------- storms at sea: steep short chop, foam streaks, and squalls that smear the view ----------
function m34chop(P,t,hz,mult){ const st=seaStormK()*mult; if(st<.02) return; const FX=S.settings.effects, foam=mix(P.wTop||'#a8cfdf','#ffffff',.7), N=Math.round((FX?70:30)*Math.min(1.6,st)*gfxK());
  // 2026-11-18 (director: storms drop frames, most on the open sea): every wave used to be two separate fills and a stroke, each
  // with its own color string (about 360 fills a frame). The waves now go into a few shared shapes: one fill for all the shadow
  // sides, one for all the lit faces, and the foam crests in three strengths and three widths. Same picture, a handful of draws.
  const st1=Math.min(1,st), cShade=v3rgba(P.wBot,.3*st1), cLit=v3rgba(mix(P.wTop,P.wMid,.3),.5*st1);
  const shade=new Path2D(), lit=new Path2D(), foamP=[0,1,2].map(()=>[0,1,2].map(()=>new Path2D())), foamN=[[0,0,0],[0,0,0],[0,0,0]];
  for(let i=0;i<N;i++){ const r1=((Math.sin(i*12.9898)*43758.5453)%1+1)%1, r2=((Math.sin(i*78.233+4.1)*24634.6345)%1+1)%1, y=hz+H*.015+Math.pow(r2,1.5)*(H-hz)*.95, u=(y-hz)/(H-hz), l=W*(.006+u*.03), x=((r1*W+t*W*(.04+u*.09))%(W*1.12))-W*.06, hb=Math.sin(t*(2.6+(i%5)*.4)+i*1.7), h=l*(.12+.1*hb)*Math.min(1.4,st);
    if(h<=0) continue; shade.moveTo(x-l*.6,y+h*.4); shade.quadraticCurveTo(x,y+h*1.3,x+l*.6,y+h*.4); shade.closePath();
    lit.moveTo(x-l*.6,y+h*.4); lit.quadraticCurveTo(x-l*.1,y-h,x+l*.5,y+h*.3); lit.closePath();
    if(hb>.35){ const a=Math.min(2,Math.floor((hb-.35)/.65*3)), wq=Math.min(2,Math.floor(u*3)); const fp=foamP[a][wq]; foamN[a][wq]++; fp.moveTo(x-l*.3,y-h*.45); fp.quadraticCurveTo(x-l*.05,y-h*.9,x+l*.3,y-h*.2); } }
  g.fillStyle=cShade; g.fill(shade); g.fillStyle=cLit; g.fill(lit);
  for(let a=0;a<3;a++) for(let wq=0;wq<3;wq++){ if(!foamN[a][wq]) continue; g.strokeStyle=v3rgba(foam,((a+.5)/3*.65)*.9*st1); g.lineWidth=Math.max(1,((wq+.5)/3)*2.2); g.stroke(foamP[a][wq]); }
  if(!FX) return;
  // rain squalls: grey curtains sweeping across, hiding the horizon as they pass
  const SQ=mult>1.2?4:3; for(let i=0;i<SQ;i++){ const sp=.012+i*.004, cx=(((i*.37+t*sp)%1.5)-.25)*W, cw=W*(.14+i*.05), A=.16*Math.min(1.2,st)*(.7+.3*Math.sin(t*.4+i));
    const gr=g.createLinearGradient(cx-cw,0,cx+cw,0); gr.addColorStop(0,'rgba(150,160,172,0)'); gr.addColorStop(.5,'rgba(150,160,172,'+A+')'); gr.addColorStop(1,'rgba(150,160,172,0)'); g.fillStyle=gr;
    g.beginPath(); g.moveTo(cx-cw+W*.04,0); g.lineTo(cx+cw+W*.04,0); g.lineTo(cx+cw-W*.02,hz+H*.06); g.lineTo(cx-cw-W*.02,hz+H*.06); g.closePath(); g.fill(); }
  // the horizon itself goes soft
  const hg=g.createLinearGradient(0,hz-H*.06,0,hz+H*.07); hg.addColorStop(0,'rgba(140,150,162,0)'); hg.addColorStop(.5,'rgba(140,150,162,'+(.32*Math.min(1,st))+')'); hg.addColorStop(1,'rgba(140,150,162,0)'); g.fillStyle=hg; g.fillRect(0,hz-H*.06,W,H*.13); }

m33wrap('shelf','live',function(P,t,hz){ m34cargo(P,t,hz); m34chop(P,t,hz,1); });
m33wrap('deep','live',function(P,t,hz){ m34ghost(P,t,hz); m34chop(P,t,hz,1.5); });
if(/[?&]test\b/.test(location.search)) window.__m34=(t)=>{ const per=105,cyc=Math.floor(t/per),r=m34rng(cyc*17+3); return {skip:r(),k:(t%per)/per,storm:seaStormK(),wx:wx3k(),A:wx3A()}; };

// ---------- Ember Springs: the lava visibly flows (moving streams down every vein), the crater throws glowing
// bombs now and then, and where the long vein meets the lake it hisses steam and lights the water ----------
function m34veins(hz){ const vx=W*.62, vb=hz+1, vw=W*.26, vh=H*.22, cw=vw*.16, ty=vb-vh, out=[];
  for(const [a,len,sd] of [[-.35,.75,1],[.1,.55,2],[.42,.85,3]]){ const r=v3rng(sd); let X=vx+a*cw, Y=ty+vh*.02; const pts=[[X,Y]]; for(let k=0;k<8;k++){ Y+=vh*len/8; X+=a*vw*.07+(r()-.5)*vw*.04; pts.push([X,Y]); } out.push(pts); } return out; }
m33wrap('ember','live',function(P,t,hz){ const FX=S.settings.effects, night=P.night||0, lava=P.lava||'#ff7a2a', lava2=P.lava2||'#ffd06a', V=m34veins(hz), vx=W*.62, ty=hz+1-H*.22, hi=gfxHigh&&gfxHigh();
  g.save(); g.globalCompositeOperation='lighter'; g.lineCap='round'; g.lineJoin='round';
  V.forEach((pts,vi)=>{ const path=()=>{ g.beginPath(); g.moveTo(pts[0][0],pts[0][1]); for(const p of pts) g.lineTo(p[0],p[1]); };
    // a soft heat glow along the whole vein that swells and settles
    g.strokeStyle=v3rgba(lava,.12+.07*Math.sin(t*1.3+vi*2)+night*.08); g.lineWidth=Math.max(5,H*.012); path(); g.stroke();
    // bright streams sliding downhill
    const d=Math.max(3,H*.008); g.setLineDash([d*1.2,d*2.4]); g.lineDashOffset=-t*H*.02*(1+vi*.15); g.strokeStyle=v3rgba(lava2,.55+.25*night); g.lineWidth=Math.max(1.2,H*.0026); path(); g.stroke();
    if(hi){ g.setLineDash([d*.5,d*4.1]); g.lineDashOffset=-t*H*.031-vi*7; g.strokeStyle='rgba(255,250,210,.6)'; g.lineWidth=Math.max(.8,H*.0014); path(); g.stroke(); }
    g.setLineDash([]); });
  // the crater simmers, and every few seconds lobs a glowing bomb or two that arcs down the slope
  v3glow(g,vx,ty+H*.006,W*.05,v3rgba(lava2,.9),.18+.1*Math.sin(t*2.3)+night*.15);
  if(FX){ const per=6.5, cyc=Math.floor(t/per), k=(t%per)/per, r=m34rng(cyc*11+5), nb=1+Math.floor(r()*2.5); for(let b=0;b<nb;b++){ const st=r()*.15, q=(k-st)/.4; if(q<0||q>1) continue; const dir=r()<.5?-1:1, vxb=W*(.012+r()*.03)*dir, up=H*(.05+r()*.05);
      const bx=vx+r()*W*.01*dir+vxb*q, by=ty-up*Math.sin(q*Math.PI*.9)+q*q*H*.05; for(let tr=4;tr>=0;tr--){ const qq=Math.max(0,q-tr*.025), tx=vx+vxb*qq, tyy=ty-up*Math.sin(qq*Math.PI*.9)+qq*qq*H*.05; g.fillStyle=v3rgba(tr?lava:lava2,(1-tr/5)*.8*(1-q*.5)); g.beginPath(); g.arc(tx,tyy,Math.max(.8,H*.003*(1-tr*.15)),0,7); g.fill(); }
      v3glow(g,bx,by,H*.015,v3rgba(lava2,.9),.5*(1-q)); } }
  g.restore();
  // each vein ends in a glowing, slowly advancing lava front
  V.forEach((pts,vi)=>{ const e=pts[8]; v3glow(g,e[0],e[1],H*.02,v3rgba(lava2,.9),.25+.12*Math.sin(t*1.9+vi)+night*.15); }); });
