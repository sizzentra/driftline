
// =====================================================================
// Driftline 0.3: the angler, rebuilt in the B2 style (preview only until 0.3 ships).
// Same skeleton anchors as before (head centre (0,-56), radius 7.5, feet at 0) so every
// hat (origin = head centre), beard and pair of glasses still fits exactly. Torso is a
// shaped path; shirt patterns and outfits are clipped to it, so everything follows the body.
// =====================================================================
let A3BELLY=0;
function a3TorsoPath(c,f){ c.beginPath(); const bb=A3BELLY*2.6;
  if(f){ c.moveTo(-7.2,-45.6); c.quadraticCurveTo(-7.9,-38.5,-6.3,-33.5); c.quadraticCurveTo(-8.4,-28.5,-7.7,-23.6); c.lineTo(7.7,-23.6); c.quadraticCurveTo(8.4+bb*1.6,-28.5,6.5+bb*.4,-33.5); c.quadraticCurveTo(8.8,-39,7.5,-45.6); c.quadraticCurveTo(0,-48,-7.2,-45.6); }
  else { c.moveTo(-7.7,-45.6); c.quadraticCurveTo(-8.9,-35,-7.5,-23.6); c.lineTo(7.6,-23.6); c.quadraticCurveTo(9.3+bb*2.2,-33,7.9,-45.6); c.quadraticCurveTo(0,-48.4,-7.7,-45.6); }
  c.closePath(); }
// a longer coat silhouette reaching hemY, flaring slightly
function a3CoatPath(c,f,hemY){ c.beginPath(); c.moveTo(f?-7.4:-7.9,-45.8); c.quadraticCurveTo(f?-8.2:-9.1,-36,-8.8,-26); c.lineTo(-9.8,hemY); c.quadraticCurveTo(0,hemY+1.6,9.8,hemY); c.lineTo(9+A3BELLY*1.6,-26); c.quadraticCurveTo((f?9:9.5)+A3BELLY*2.4,-34,f?7.7:8.1,-45.8); c.quadraticCurveTo(0,-48.6,f?-7.4:-7.9,-45.8); c.closePath(); }
function a3Shade(c,pathFn,D){ c.save(); pathFn(); c.clip(); const sg=c.createLinearGradient(-9,0,9,0); sg.addColorStop(0,'rgba(10,8,20,.28)'); sg.addColorStop(.45,'rgba(10,8,20,0)'); sg.addColorStop(.85,'rgba(255,230,190,0)'); sg.addColorStop(1,'rgba(255,225,185,.32)'); c.fillStyle=sg; c.fillRect(-11,-50,22,40); c.restore(); }
function a3Sleeve(lk,D,shirt){ const o=lk.outfit, oc=D(lk.outCol||'#d8a020');
  switch(o){ case 'raincoat': case 'hoodie': case 'puffer': case 'sweater': case 'cardigan': case 'captain': case 'lumberjack': return o==='captain'?D(lk.outCol||'#1a2a4a'):o==='lumberjack'?D(lk.outCol||'#b8342a'):oc;
    case 'wetsuit': return D('#1c1c26'); case 'spacesuit': return D('#e8ecf0'); case 'tidecoat': return D('#1a3a5a'); case 'bathrobe': return D(lk.outCol||'#f0e6f4'); case 'pajamas': return D(lk.outCol||'#7a9ad8'); default: return shirt; } }
function a3Legs(lk,D){ const o=lk.outfit; if(o==='wetsuit') return D('#1c1c26'); if(o==='spacesuit') return D('#e8ecf0'); if(o==='overalls') return D(lk.outCol||'#3a6f9a'); if(o==='pajamas') return D(lk.outCol||'#7a9ad8'); return D(lk.pants); }

// ---------- 0.3 angler body: rounded, lit limbs that bend, eased poses, a rim light from the sky ----------
// eased pose state for the angler on the water (other previews draw a still pose)
const A3={lean:0,crouch:0,stance:0,tilt:0,hx:9,hy:-35,lt:-1};
const A3OFF=new WeakMap();
// two-bone reach: joint between a and b with segment lengths l1, l2; pick the bend whose joint lies on the 'side' (+1 = larger y / lower, -1 = larger x / forward)
function a3IK(ax,ay,bx,by,l1,l2,side){ const dx=bx-ax, dy=by-ay, d=Math.max(.01,Math.min(Math.hypot(dx,dy),l1+l2-.02)), a=Math.atan2(dy,dx), k=Math.acos(clamp((l1*l1+d*d-l2*l2)/(2*l1*d),-1,1));
  const j1={x:ax+Math.cos(a+k)*l1,y:ay+Math.sin(a+k)*l1}, j2={x:ax+Math.cos(a-k)*l1,y:ay+Math.sin(a-k)*l1};
  return side>0 ? (j1.y>j2.y?j1:j2) : (j1.x>j2.x?j1:j2); }
// a tapered, rounded limb from p0 to p1 lit across its width (light from the upper front)
function a3Limb(c,p0,p1,w0,w1,col,lightA){ const dx=p1.x-p0.x, dy=p1.y-p0.y, L=Math.hypot(dx,dy)||1, nx=-dy/L, ny=dx/L;
  const lit=(nx*.55-ny*.83)>0?1:-1, mx=(p0.x+p1.x)/2, my=(p0.y+p1.y)/2, wm=(w0+w1)/4;
  const gr=c.createLinearGradient(mx-nx*wm*lit,my-ny*wm*lit,mx+nx*wm*lit,my+ny*wm*lit);
  gr.addColorStop(0,mix(col,'#0a0814',.34)); gr.addColorStop(.42,col); gr.addColorStop(.8,mix(col,'#fff2dc',.16*(lightA==null?1:lightA))); gr.addColorStop(1,mix(col,'#0a0814',.08));
  c.fillStyle=gr; c.beginPath(); c.moveTo(p0.x+nx*w0/2,p0.y+ny*w0/2); c.lineTo(p1.x+nx*w1/2,p1.y+ny*w1/2); c.lineTo(p1.x-nx*w1/2,p1.y-ny*w1/2); c.lineTo(p0.x-nx*w0/2,p0.y-ny*w0/2); c.closePath(); c.fill();
  c.beginPath(); c.arc(p0.x,p0.y,w0/2,0,7); c.fill(); c.beginPath(); c.arc(p1.x,p1.y,w1/2,0,7); c.fill(); }
// soft volume over a clipped body part: darker back edge, lit front, a touch of light on top, shade at the bottom
function a3Vol(c,pathFn,x0,x1,y0,y1,k){ k=k==null?1:k; c.save(); pathFn(); c.clip();
  const gx=c.createLinearGradient(x0,0,x1,0); gx.addColorStop(0,'rgba(8,6,20,'+(.36*k)+')'); gx.addColorStop(.32,'rgba(8,6,20,'+(.06*k)+')'); gx.addColorStop(.6,'rgba(255,240,215,0)'); gx.addColorStop(.86,'rgba(255,240,215,'+(.17*k)+')'); gx.addColorStop(1,'rgba(8,6,20,'+(.1*k)+')');
  c.fillStyle=gx; c.fillRect(x0-2,y0-2,x1-x0+4,y1-y0+4);
  const gy=c.createLinearGradient(0,y0,0,y1); gy.addColorStop(0,'rgba(255,246,230,'+(.13*k)+')'); gy.addColorStop(.22,'rgba(255,246,230,0)'); gy.addColorStop(.78,'rgba(8,6,20,0)'); gy.addColorStop(1,'rgba(8,6,20,'+(.24*k)+')');
  c.fillStyle=gy; c.fillRect(x0-2,y0-2,x1-x0+4,y1-y0+4); c.restore(); }

// the figure is painted into a small canvas of its own, then a rim light from the sky is laid along its back edge, then it is placed in the scene
function drawAngler3(c,x,y,s,lk,o={}){
  const live=o.t!=null && c===g && !o.forceSt;
  const m=c.getTransform(), ps=Math.max(.4,Math.hypot(m.a,m.b)*s), BX=40, BT=108, BB=18, w=Math.ceil(BX*2*ps), h=Math.ceil((BT+BB)*ps);
  if(w*h>5e6){ const r=a3Body(c,x,y,s,lk,o,live); return {x:r.hand.x,y:r.hand.y,back:r.back,fingers:()=>a3Fingers(c,r.hand,r.back,r.ra,s,r.sk,r.skD)}; }
  let O=A3OFF.get(c); if(!O){ O={a:document.createElement('canvas'),b:document.createElement('canvas')}; A3OFF.set(c,O); }
  if(O.a.width!==w||O.a.height!==h){ O.a.width=O.b.width=w; O.a.height=O.b.height=h; }
  const ax=O.a.getContext('2d'); ax.setTransform(1,0,0,1,0,0); ax.clearRect(0,0,w,h);
  const res=a3Body(ax,BX*ps,BT*ps,ps,lk,o,live);
  // rim light: the silhouette minus itself shifted toward the front leaves a thin edge on the back and top
  const night=o.night||0, rim=o.rim||(night>.3?'#a9bcff':'#ffe9c8'), d=clamp(1.15*ps,1,2.4), bx=O.b.getContext('2d');
  bx.setTransform(1,0,0,1,0,0); bx.globalCompositeOperation='copy'; bx.drawImage(O.a,0,0); bx.globalCompositeOperation='source-in'; bx.fillStyle=rim; bx.fillRect(0,0,w,h);
  bx.globalCompositeOperation='destination-out'; bx.drawImage(O.a,d,d*.8); bx.globalCompositeOperation='source-over';
  ax.globalCompositeOperation='source-atop'; ax.globalAlpha=.5+night*.2; ax.drawImage(O.b,0,0);
  // and a faint second edge on the front from the light off the water
  bx.globalCompositeOperation='copy'; bx.drawImage(O.a,0,0); bx.globalCompositeOperation='source-in'; bx.fillStyle=o.glow||'#fff6e0'; bx.fillRect(0,0,w,h);
  bx.globalCompositeOperation='destination-out'; bx.drawImage(O.a,-d*.8,d*.3); bx.globalCompositeOperation='source-over';
  ax.globalAlpha=.16; ax.drawImage(O.b,0,0); ax.globalAlpha=1; ax.globalCompositeOperation='source-over';
  c.drawImage(O.a,0,0,w,h,x-BX*s,y-BT*s,w/ps*s,h/ps*s);
  // map the hand positions back into the caller's space
  const map=p=>({x:x+(p.x-BX*ps)/ps*s,y:y+(p.y-BT*ps)/ps*s});
  return {x:map(res.hand).x,y:map(res.hand).y,back:map(res.back),fingers:()=>a3Fingers(c,map(res.hand),map(res.back),res.ra,s,res.sk,res.skD)}; }

// fingers wrapped over the rod, drawn after the rod so the hands hold it
function a3Fingers(c,h1,h2,ra,s,sk,skD){ c.save();
  for(const [p,k] of [[h2,.92],[h1,1]]){ c.save(); c.translate(p.x,p.y); c.rotate(ra); c.scale(s*k,s*k);
    const gr=c.createLinearGradient(0,-2.2,0,2.4); gr.addColorStop(0,mix(sk,'#fff4e6',.18)); gr.addColorStop(1,skD); c.fillStyle=gr;
    c.beginPath(); c.moveTo(-1.9,-1.5); c.quadraticCurveTo(-2.2,1.8,-.6,2.4); c.lineTo(1.4,2.4); c.quadraticCurveTo(2.4,1.6,2,-1.5); c.quadraticCurveTo(0,-2.4,-1.9,-1.5); c.fill();
    c.strokeStyle='rgba(60,20,10,.35)'; c.lineWidth=.32; c.beginPath(); c.moveTo(-.6,-1.6); c.lineTo(-.7,2.2); c.moveTo(.7,-1.7); c.lineTo(.6,2.2); c.stroke();
    if(k===1){ c.fillStyle=sk; c.beginPath(); c.ellipse(.6,-2,1.6,.85,.15,0,7); c.fill(); }
    c.restore(); }
  c.restore(); }

function a3Body(c,x,y,s,lk,o,live){
  const night=o.night||0, D=cl=>night?mix(cl,'#0a1018',night*.45):cl, t=o.t||0, f=lk.g==='f';
  const skin=SKINS[lk.skin]||SKINS[1], sk=D(skin), skD=D(mix(skin,'#5a2a1a',.24)), hairC=HAIRS[lk.hair]||HAIRS[1], hair=D(hairC), shirt=D(lk.shirt);
  const hs = !lk.hairStyle||lk.hairStyle==='auto' ? (f?'long':'short') : lk.hairStyle;
  const st=o.forceSt||(live?G.st:'idle');
  const mood = !live&&!o.forceSt ? 'calm' : st==='bite' ? 'surprised' : st==='reeling' ? 'focus' : (st==='landing'||(live&&G.lastCatchT&&performance.now()-G.lastCatchT<1800)) ? 'happy' : 'calm';
  const br=Math.sin(t*2.1)*.35, blink=((t+.7)%3.9)<.12;
  // ---- pose targets, eased on the water so states flow into each other
  const pw=st==='charging'?(o.pow!=null?o.pow:(G.power||0)):0, ten=o.ten!=null?o.ten:live?clamp((G.ten||0)/100,0,1):0;
  let lean = st==='charging'?-.15*pw : st==='flying'?.09 : st==='reeling'?-.06-ten*.07+(live&&G.run?Math.sin(t*11)*.015:0) : st==='landing'?-.05 : st==='bite'?.03 : 0;
  let crouch = st==='charging'?2.8*pw : st==='reeling'?1.1+ten*1.5 : st==='bite'?.9 : st==='landing'?.7 : st==='flying'?.3 : 0;
  let stance = st==='reeling'?1.5 : st==='charging'?1*pw : st==='flying'?.8 : 0;
  let tilt = st==='waiting'?.07 : st==='bite'?-.04 : st==='flying'?-.07 : st==='reeling'?.04 : 0;
  if(st==='idle'||st==='waiting'){ lean+=Math.sin(t*.7)*.012; tilt+=Math.sin(t*.45+1)*.03; crouch+=Math.max(0,Math.sin(t*.7))*.25; }
  if(o.sit){ lean=-.07+Math.sin(t*.5)*.012; crouch=0; stance=0; tilt=.07+Math.sin(t*.4)*.035; }
  let hx=o.hx==null?9:o.hx, hy=o.hy==null?-35:o.hy;
  if(live){ const dt=A3.lt<0?1:clamp(t-A3.lt,0,.1); A3.lt=t; const e=1-Math.exp(-dt*9), eh=1-Math.exp(-dt*24);
    A3.lean+=(lean-A3.lean)*e; A3.crouch+=(crouch-A3.crouch)*e; A3.stance+=(stance-A3.stance)*e; A3.tilt+=(tilt-A3.tilt)*e; A3.hx+=(hx-A3.hx)*eh; A3.hy+=(hy-A3.hy)*eh;
    lean=A3.lean; crouch=A3.crouch; stance=A3.stance; tilt=A3.tilt; hx=A3.hx; hy=A3.hy; }
  const B=BUILDI[lk.build]||BUILDI.average; A3BELLY=B.belly; A3LW=B.lw; A3SHOE=lk.shoes||"boots"; A3SHOECOL=lk.shoeCol||null; const lift=o.sit?24-o.sit.seat:crouch-24*(B.l-1);
  const ra=o.rodA!=null?o.rodA:-.72; // the rod's angle at the hand (screen space)
  // upper body space: crouch down, lean around the hips. Hands are given in final space so they meet the rod exactly.
  const lc=Math.cos(lean), ls=Math.sin(lean), hipY=-24+lift;
  const toUp=(px,py)=>{ const X=px, Y=py-lift+24; return {x:X*lc+Y*ls, y:-X*ls+Y*lc-24}; }; // world -> leaned upper-body coordinates
  const HW={x:hx,y:hy}, BW={x:hx-Math.cos(ra)*6.6,y:hy-Math.sin(ra)*6.6};
  const HH=toUp(HW.x,HW.y), BH=toUp(BW.x,BW.y);
  const legC=a3Legs(lk,D), legD=D(mix(a3Legs(lk,q=>q),'#000000',.22)), sleeve=a3Sleeve(lk,D,(lk.tone==="sleeves"&&lk.shirt2)?D(lk.shirt2):shirt), sleeveFab=a3SleeveLayers(lk,D), cuffC=D(mix(lk.pants||'#3a4a6a','#000000',.25));
  c.save(); c.translate(x,y); c.scale(s,s); c.lineCap='round'; c.lineJoin='round';
  // ---- legs: hip -> knee -> ankle, knees bend forward when the hips drop; boots stay planted
  const leg=(hipX,ankX,col,back)=>{ const hp={x:hipX+Math.sin(lean)*1.2,y:hipY}, an={x:ankX,y:-5}, kn=a3IK(hp.x,hp.y,an.x,an.y,9.58*B.l,9.58*B.l,-1);
    a3Limb(c,hp,kn,6.2*B.lw,5.2*B.lw,col,back?.5:1); a3Limb(c,kn,an,5.2*B.lw,4.4*B.lw,col,back?.5:1);
    if(lk.outfit==='pajamas'){ c.save(); c.globalAlpha*=.55; c.strokeStyle=D('#f4f0f8'); c.lineWidth=.8; for(const q of [-1.3,1.3]){ c.beginPath(); c.moveTo(hp.x+q,hp.y); c.lineTo(kn.x+q,kn.y); c.lineTo(an.x+q*.8,an.y); c.stroke(); } c.restore(); }
    c.strokeStyle='rgba(0,0,0,.16)'; c.lineWidth=.45; c.beginPath(); c.moveTo(kn.x-1.2,kn.y-1); c.quadraticCurveTo(kn.x+.4,kn.y+.6,kn.x+1.6,kn.y-.2); c.stroke();
    if(lk.outfit!=='wetsuit'&&lk.outfit!=='spacesuit'&&!SHOE_TALL.has(lk.shoes||'boots')){ c.fillStyle=back?D(mix(lk.pants||'#3a4a6a','#000000',.38)):cuffC; c.beginPath(); c.ellipse(an.x,-(SHOE_TOPY[lk.shoes||"boots"]||5)-.3,2.5*B.lw,.9,0,0,7); c.fill(); }
    return an; };
  const boot=(bx,dark)=>{ const bc=D(dark?'#24180f':'#33241a'), gr=c.createLinearGradient(0,-5.4,0,0); gr.addColorStop(0,mix(bc,'#fff0dc',.14)); gr.addColorStop(.6,bc); gr.addColorStop(1,mix(bc,'#000000',.35)); c.fillStyle=gr;
    c.beginPath(); c.moveTo(bx-3,-5.4); c.quadraticCurveTo(bx+.4,-6,bx+1.8,-5.1); c.quadraticCurveTo(bx+6.4,-4,bx+6,-1.1); c.quadraticCurveTo(bx+5.8,-.2,bx+5,-.2); c.lineTo(bx-3.2,-.2); c.quadraticCurveTo(bx-3.8,-2.8,bx-3,-5.4); c.fill();
    c.fillStyle=D('#140d08'); c.beginPath(); c.moveTo(bx-3.5,-1); c.lineTo(bx+5.9,-1); c.quadraticCurveTo(bx+6.2,0,bx+5.2,.25); c.lineTo(bx-3.4,.25); c.closePath(); c.fill();
    c.fillStyle=D('#c9a070'); c.beginPath(); c.arc(bx-.2,-4.3,.38,0,7); c.arc(bx+1.3,-3.9,.38,0,7); c.fill();
    c.fillStyle='rgba(255,236,210,'+(dark?.1:.24)+')'; c.beginPath(); c.ellipse(bx+3.6,-3.3,1.6,.6,-.35,0,7); c.fill(); };
  const aB=-3.6-stance, aF=3.2+stance*.8, shoe=lk.shoes||'boots';
  c.save(); c.translate(0,lift); c.translate(0,-24); c.rotate(lean); c.translate(0,24); a3Back(c,lk.back,D,lk.accCol,t,B.w,lean,st); c.restore();
  if(!o.sit){ leg(-3*B.w,aB,legD,true); a3Shoe(c,shoe,aB-.2,true,D,sk,t); leg(2.6*B.w,aF,legC,false); a3Shoe(c,shoe,aF-.2,false,D,sk,t); }
  else { // sitting: thighs forward from the hips, shins hanging over the dock edge (kicking gently) or down to the floor in front of the chair
    const hy0=-o.sit.seat, L1=9.4*B.l, L2=9.6*B.l;
    for(const [hx0,col,back,ph] of [[-2.4*B.w,legD,true,1.3],[1.8*B.w,legC,false,0]]){ const hp={x:hx0,y:hy0-1.2}, kn={x:hx0+L1,y:hy0-1.5+(back?.4:0)};
      const an=o.sit.hang?{x:kn.x+2+Math.sin(t*1.25+ph)*1.6,y:kn.y+L2}:{x:kn.x+1.2,y:-5};
      a3Limb(c,hp,kn,6.4*B.lw,5.4*B.lw,col,back?.5:1); a3Limb(c,kn,an,5.2*B.lw,4.4*B.lw,col,back?.5:1);
      c.save(); c.translate(an.x,an.y+5); c.rotate(o.sit.hang?.28+Math.sin(t*1.25+ph)*.08:0); a3Shoe(c,shoe,-.2,back,D,sk,t); c.restore(); } }
  // ---- upper body
  c.save(); c.translate(0,lift); c.translate(0,-24); c.rotate(lean); c.translate(0,24);
  const HD=(hairC2)=>{ const gr=c.createLinearGradient(-3,-66,4,-48); gr.addColorStop(0,D(mix(hairC2,'#ffffff',.28))); gr.addColorStop(.42,D(hairC2)); gr.addColorStop(1,D(mix(hairC2,'#000000',.34))); return gr; };
  const hairF=HD(hairC);
  // back hair (behind the upper body), follows the head tilt
  c.save(); c.translate(0,-50); c.rotate(tilt); c.scale(1.1,1.1); c.translate(0,50); { const hId=lk.hat||'none'; if(A3_HAT_FULL.has(hId)){ c.beginPath(); c.rect(0,0,0,0); c.clip(); } else if(!A3_HAT_OPEN.has(hId)){ c.beginPath(); c.rect(-30,-63.9,60,44); c.clip(); } }
  if(hs==='long'){ /* falls from the crown, hugs the back of the head and neck, and settles over the shoulder blades in soft, uneven tips */
    const sw=Math.sin(t*1.3)*.25+(live?-lean*2:0); c.fillStyle=hairF; c.beginPath(); c.moveTo(-6.4,-62.4); c.bezierCurveTo(-9.6,-60.6,-10.2,-55.6,-9.4,-51); c.bezierCurveTo(-8.8,-47.4,-9.4+sw,-44.4,-8.8+sw,-40.4); c.quadraticCurveTo(-8+sw,-41.4,-7.4+sw,-40.6); c.quadraticCurveTo(-6.8+sw,-41.6,-6.1+sw,-41.2); c.bezierCurveTo(-5.4,-43.6,-4,-45.4,-2.6,-46.4); c.lineTo(-2.4,-58); c.closePath(); c.fill();
    c.strokeStyle=D(mix(hairC,'#000000',.32)); c.lineWidth=.42; c.beginPath(); c.moveTo(-8,-58); c.bezierCurveTo(-9.2,-53,-8.2,-47,-8+sw,-41.6); c.moveTo(-5.6,-56.6); c.bezierCurveTo(-6.6,-52,-6,-47,-6.6+sw,-42); c.stroke();
    c.strokeStyle=D(mix(hairC,'#ffffff',.3)); c.lineWidth=.5; c.beginPath(); c.moveTo(-7.2,-59.4); c.bezierCurveTo(-9,-55,-8.8,-50.4,-8.4,-47); c.stroke(); }
  if(hs==='ponytail'){ const sw=Math.sin(t*1.6)*.12+(live?-lean*.8:0); c.save(); c.translate(-7.4,-58.5); c.rotate(.55+sw); c.fillStyle=hairF; c.beginPath(); c.moveTo(0,-.4); c.quadraticCurveTo(3.2,4,1.2,11.4); c.quadraticCurveTo(-3,6,0,-.4); c.fill(); c.strokeStyle=D(mix(hairC,'#000000',.3)); c.lineWidth=.4; c.beginPath(); c.moveTo(-.2,1.6); c.quadraticCurveTo(.4,6,.9,10.4); c.stroke(); c.fillStyle=D('#c8553a'); c.beginPath(); c.ellipse(0,.4,1.7,.9,.2,0,7); c.fill(); c.restore(); }
  if(hs==='bun'){ c.fillStyle=hairF; c.beginPath(); c.arc(-3.2,-65.2,3.6,0,7); c.fill(); c.strokeStyle=D(mix(hairC,'#000000',.3)); c.lineWidth=.4; c.beginPath(); c.arc(-3.2,-65.2,2,.4,3.4); c.stroke(); c.strokeStyle=D(mix(hairC,'#ffffff',.3)); c.lineWidth=.5; c.beginPath(); c.arc(-3.2,-65.2,2.6,3.6,4.6); c.stroke(); }
  c.restore();
  // back arm: shoulder -> elbow -> hand on the grip behind the front hand
  const shB={x:-1.4*B.w,y:-44}, elB=a3IK(shB.x,shB.y,BH.x,BH.y,7.8,7.6,1), slD=D(mix(sleeve,'#000000',.2));
  a3Limb(c,shB,elB,4.6*B.lw,4*B.lw,slD,.5); a3Limb(c,elB,BH,4*B.lw,3.4*B.lw,slD,.5); for(const sf of sleeveFab){ a3LimbFab(c,shB,elB,4.6*B.lw,4*B.lw,sf); a3LimbFab(c,elB,BH,4*B.lw,3.4*B.lw,sf); }
  c.fillStyle=skD; c.beginPath(); c.arc(BH.x,BH.y,2.15,0,7); c.fill();
  // torso (or coat), pattern clipped to the body, outfit, then volume
  const coat=['raincoat','captain','tidecoat','bathrobe'].includes(lk.outfit), hem={raincoat:-16,captain:-14.5,tidecoat:-16,bathrobe:-12}[lk.outfit];
  c.save(); c.translate(0,br*.3); c.scale(B.w,1);
  c.fillStyle=shirt; a3TorsoPath(c,f); c.fill();
  { c.save(); a3TorsoPath(c,f); c.clip(); drawTwoTone(c,lk,D,-10,-49,20,27); if(lk.pat&&lk.pat!=='none') drawPattern(c,lk.pat,shirt,-10,-49,20,27); c.restore(); }
  if(lk.outFab&&lk.outFab!=='none'&&outfitFabrics(lk.outfit).includes(lk.outFab)) a3FabricOutfit(c,lk,D,f,t); else drawOutfit3(c,lk,D,f,t);
  const bodyPath=()=>coat?a3CoatPath(c,f,hem):a3TorsoPath(c,f), out=lk.outfit;
  a3Vol(c,out==='puffer'?()=>{ c.beginPath(); c.moveTo(-5.4,-47.6); c.bezierCurveTo(-8.6,-46.8,-8.8,-40,-8.2,-34); c.bezierCurveTo(-7.8,-29,-8.4,-24,-8,-21.6); c.quadraticCurveTo(0,-20.6,8.2+A3BELLY*2,-21.6); c.bezierCurveTo(8.8+A3BELLY*2.6,-28,8.6+A3BELLY*2,-38,4.6,-47.6); c.quadraticCurveTo(-.6,-49,-5.4,-47.6); c.closePath(); }:bodyPath,-8.4,8.6,-48,coat?hem:-22.4,1);
  // soft shadow under the chin and where the front arm crosses the chest
  c.save(); bodyPath(); c.clip(); c.fillStyle='rgba(20,10,20,.22)'; c.beginPath(); c.ellipse(1.2,-46.2,4.6,2.2,0,0,7); c.fill();
  const elF0=a3IK(.8,-44,HH.x/B.w,HH.y,7.8,7.6,1); c.strokeStyle='rgba(10,6,20,.16)'; c.lineWidth=5.4; c.beginPath(); c.moveTo(.8,-43); c.lineTo(elF0.x+.4,elF0.y+1.4); c.stroke(); c.restore();
  // belt: only where the waist shows (shirt, vest, life jacket, tuxedo T-shirt); every jacket, sweater, coat or costume covers it
  if(['none','vest','lifejacket','tuxshirt'].includes(out||'none')){ const bg=c.createLinearGradient(0,-25.8,0,-23.2); bg.addColorStop(0,D('#5a4028')); bg.addColorStop(1,D('#2a1c10')); c.save(); a3TorsoPath(c,f); c.clip(); c.fillStyle=bg; c.beginPath(); c.moveTo(-9,-25.5); c.quadraticCurveTo(0,-26.1,9,-25.9); c.lineTo(9,-23.5); c.quadraticCurveTo(0,-23.8,-9,-23.2); c.closePath(); c.fill(); c.fillStyle=D('#3a2a1a'); c.fillRect(-3.6,-25.8,.7,2.6); c.restore();
    /* side view: the buckle sits at the front of the waist, seen almost edge-on */ const fx=sideFront(-24.6,f); c.fillStyle=D('#e2bc6a'); c.beginPath(); c.roundRect?c.roundRect(fx-1.7,-26.2,2,3.1,.5):c.rect(fx-1.7,-26.2,2,3.1); c.fill(); c.fillStyle=D('#3a2a1a'); c.fillRect(fx-1.2,-25.3,.9,1.3); c.fillStyle='rgba(255,255,230,.5)'; c.fillRect(fx-1.5,-26,1.6,.45); }
  c.restore();
  // ---- neck and head (the head tilts on the neck: looks down at the float, up while the cast flies)
  { const ng=c.createLinearGradient(-2.2,0,2.2,0); ng.addColorStop(0,skD); ng.addColorStop(.7,sk); ng.addColorStop(1,mix(sk,'#fff2e0',.12)); c.fillStyle=ng; c.beginPath(); c.moveTo(-2.1,-51); c.lineTo(-2.3,-45.6); c.quadraticCurveTo(0,-44.6,2.4,-45.6); c.lineTo(2.2,-51); c.closePath(); c.fill(); }
  a3Neck(c,lk.neck,D,lk.accCol,t,B.w,lean);
  const hatId=lk.hat||'none', hatFull=A3_HAT_FULL.has(hatId), hatCover=!hatFull&&!A3_HAT_OPEN.has(hatId);
  c.save(); c.translate(0,br*.2); c.translate(0,-50); c.rotate(tilt); c.scale(1.1,1.1); c.translate(0,50);
  c.fillStyle=sk; c.beginPath(); c.arc(0,-56,7.5,0,7); c.fill(); c.beginPath(); c.ellipse(1.9,-51.9,5.4,3.5,.1,0,7); c.fill();
  // head volume: lit from the upper front, shade wrapping the back and under the jaw
  c.save(); c.beginPath(); c.arc(0,-56,7.5,0,7); c.ellipse(1.9,-51.9,5.4,3.5,.1,0,7); c.clip();
  const hg=c.createRadialGradient(3.2,-59.4,.5,1,-56,10.2); hg.addColorStop(0,'rgba(255,246,232,.34)'); hg.addColorStop(.38,'rgba(255,246,232,0)'); hg.addColorStop(.72,'rgba(90,30,20,0)'); hg.addColorStop(1,'rgba(70,20,16,.4)'); c.fillStyle=hg; c.fillRect(-9,-65,19,18);
  c.fillStyle='rgba(110,40,28,.16)'; c.beginPath(); c.ellipse(-.6,-48.6,6,2.2,.1,0,7); c.fill(); c.restore();
  // ear
  c.fillStyle=sk; c.beginPath(); c.ellipse(-1.8,-55.4,1.8,2.3,0,0,7); c.fill(); c.fillStyle=skD; c.beginPath(); c.ellipse(-1.6,-55.3,.85,1.25,0,0,7); c.fill(); c.fillStyle='rgba(255,240,225,.3)'; c.beginPath(); c.ellipse(-2.4,-56.2,.5,.9,0,0,7); c.fill();
  // nose
  a3Nose(c,lk.nose,sk,skD);
  // blush
  if(lk.blush!=='off'){ c.fillStyle='rgba(240,120,110,'+(lk.blush==='soft'?.14:.3)+')'; c.beginPath(); c.ellipse(3.6,-53.6,1.8,1,0,0,7); c.fill(); }
  // eyes and brows
  const ex=4.4, ey=-57, browY=mood==='surprised'?-60.6:mood==='focus'?-59.4:-60;
  if(blink && mood!=='surprised'){ c.strokeStyle=D('#1a1410'); c.lineWidth=.6; c.beginPath(); c.moveTo(ex-1.1,ey+.2); c.quadraticCurveTo(ex,ey+.7,ex+1.1,ey+.2); c.stroke(); }
  else if(mood==='happy'){ c.strokeStyle=D('#1a1410'); c.lineWidth=.65; c.beginPath(); c.arc(ex,ey+.5,1.1,Math.PI*1.1,Math.PI*1.9); c.stroke(); }
  else { const big=mood==='surprised', ec=(EYES[lk.eye]||EYES[0])[0];
    if(s<3.2){ // small (on the water): a soft dark eye tinted by the eye colour, with a catchlight
      const er=big?1.15:1, eh=big?1.45:1.3; c.fillStyle=D(mix('#1a1410',ec,.3)); c.beginPath(); c.ellipse(ex,ey,er,eh,0,0,7); c.fill(); c.fillStyle='rgba(255,255,255,.92)'; c.beginPath(); c.arc(ex+.36,ey-.46,.38,0,7); c.fill(); }
    else { // close up (Wardrobe, Home): white of the eye, a coloured iris looking forward, pupil, catchlights and an upper lid
      const rx=big?1.35:1.22, ry=big?1.25:1.02;
      c.save(); c.beginPath(); c.ellipse(ex,ey,rx,ry,0,0,7); c.clip();
      c.fillStyle=D('#fbf7f2'); c.fillRect(ex-2,ey-2,4,4);
      const ix=ex+.34, iy=ey+.06, ir=big?.78:.84, ig=c.createRadialGradient(ix-.15,iy-.2,.05,ix,iy,ir); ig.addColorStop(0,D(mix(ec,'#ffffff',.3))); ig.addColorStop(.7,D(ec)); ig.addColorStop(1,D(mix(ec,'#000000',.45)));
      c.fillStyle=ig; c.beginPath(); c.arc(ix,iy,ir,0,7); c.fill(); c.fillStyle=D('#100c0a'); c.beginPath(); c.arc(ix+.06,iy+.04,ir*.46,0,7); c.fill();
      c.fillStyle='rgba(60,30,20,.16)'; c.fillRect(ex-2,ey-ry,4,ry*.55); c.restore();
      c.fillStyle='rgba(255,255,255,.95)'; c.beginPath(); c.arc(ix+.28,iy-.34,.22,0,7); c.fill(); c.fillStyle='rgba(255,255,255,.5)'; c.beginPath(); c.arc(ix-.24,iy+.3,.1,0,7); c.fill();
      c.strokeStyle=D('#2a1a12'); c.lineWidth=.32; c.lineCap='round'; c.beginPath(); c.ellipse(ex,ey,rx,ry,0,Math.PI*1.08,Math.PI*1.95); c.stroke();
      c.strokeStyle=D('rgba(90,40,30,.35)'); c.lineWidth=.18; c.beginPath(); c.ellipse(ex,ey+.05,rx*.95,ry,0,Math.PI*.15,Math.PI*.85); c.stroke(); } }
  if(f && !blink){ c.strokeStyle=D('#1a1410'); c.lineWidth=.32; c.beginPath(); c.moveTo(ex+.9,ey-.85); c.quadraticCurveTo(ex+1.4,ey-1.2,ex+1.75,ey-1.15); c.moveTo(ex+.5,ey-1.05); c.quadraticCurveTo(ex+.9,ey-1.55,ex+1.3,ey-1.6); c.stroke(); }
  // mouth
  c.strokeStyle=D('#7a2e24'); c.fillStyle=D('#7a2e24'); c.lineWidth=.6;
  if(mood==='happy'){ c.beginPath(); c.moveTo(3.8,-53.2); c.quadraticCurveTo(5.6,-50.6,7,-53.1); c.closePath(); c.fill(); c.fillStyle='#ffffff'; c.fillRect(4.3,-53.2,2.2,.5); }
  else if(mood==='surprised'){ c.beginPath(); c.ellipse(5.5,-52.6,.75,.95,0,0,7); c.fill(); }
  else if(mood==='focus'){ c.beginPath(); c.moveTo(4.4,-52.7); c.lineTo(6.4,-52.9); c.stroke(); }
  else a3Mouth(c,lk.mouth,D);
  const beardOn=lk.beard&&lk.beard!=='none'&&!A3_HAT_FULL.has(lk.hat||'none'); drawFace(c,beardOn?Object.assign({},lk,{beard:'none'}):lk,D,hair); const headM=c.getTransform(); /* the beard is drawn after the front arm: the face juts out in front of the shoulder */
  if(!hatFull){ c.save(); if(hatCover){ c.beginPath(); c.rect(-30,-63.9,60,44); c.clip(); } drawHair3(c,hs,hairF,hairC,D,t); c.restore(); }
  a3Brow(c,lk.brows,D(mix(hairC,'#000000',.15)),ex,browY+.4,mood); /* brows sit over the fringe so they always show */
  // hats sit above the eye line, so the face always reads (no hole is ever cut into a hat)
  // the hat goes on its own layer so it can be lit like the angler (light from the upper front, shade underneath), then laid on top
  { const HC=a3HatLayer(c), hx=HC.getContext('2d'); hx.setTransform(1,0,0,1,0,0); hx.clearRect(0,0,HC.width,HC.height); hx.setTransform(c.getTransform());
    hx.save(); hx.translate(0,-57.4); hx.lineCap='round'; hx.lineJoin='round'; drawHat(hx,lk.hat,D(lk.hatCol),t); hx.restore();
    if(hatId!=='none'){ hx.save(); hx.globalCompositeOperation='source-atop'; const g1=hx.createLinearGradient(-9,-74,9,-50); g1.addColorStop(0,'rgba(10,8,22,.34)'); g1.addColorStop(.45,'rgba(10,8,22,0)'); g1.addColorStop(.75,'rgba(255,244,226,.12)'); g1.addColorStop(1,'rgba(255,244,226,.22)'); hx.fillStyle=g1; hx.fillRect(-30,-100,60,60);
      const g2=hx.createLinearGradient(0,-60,0,-52); g2.addColorStop(0,'rgba(10,8,22,0)'); g2.addColorStop(1,'rgba(10,8,22,.28)'); hx.fillStyle=g2; hx.fillRect(-30,-60,60,10); hx.restore(); }
    c.save(); c.setTransform(1,0,0,1,0,0); c.drawImage(HC,0,0); c.restore(); }
  c.restore();
  // ---- front arm over the body: round shoulder, elbow that bends, hand on the rod
  const shF={x:.8*B.w,y:-44}, elF=a3IK(shF.x,shF.y,HH.x,HH.y,7.8,7.6,1);
  a3Limb(c,shF,elF,5*B.lw,4.3*B.lw,sleeve,1); a3Limb(c,elF,HH,4.3*B.lw,3.6*B.lw,sleeve,1); for(const sf of sleeveFab){ a3LimbFab(c,shF,elF,5*B.lw,4.3*B.lw,sf); a3LimbFab(c,elF,HH,4.3*B.lw,3.6*B.lw,sf); } a3OverArm(c,lk,D,B,t); if(beardOn){ c.save(); c.setTransform(headM); drawFace(c,Object.assign({},lk,{glasses:'none'}),D,hair); c.restore(); }
  if(!['wetsuit','spacesuit'].includes(lk.outfit)){ const d2=Math.hypot(HH.x-elF.x,HH.y-elF.y)||1, ux=(HH.x-elF.x)/d2, uy=(HH.y-elF.y)/d2; c.fillStyle=D(mix(sleeve==shirt?lk.shirt:sleeve,'#000000',.18)); c.beginPath(); c.ellipse(HH.x-ux*2.6,HH.y-uy*2.6,1.1,2,Math.atan2(uy,ux),0,7); c.fill(); }
  { const gr=c.createRadialGradient(HH.x+.6,HH.y-.9,.3,HH.x,HH.y,2.8); gr.addColorStop(0,mix(sk,'#fff4e6',.2)); gr.addColorStop(1,skD); c.fillStyle=gr; c.beginPath(); c.arc(HH.x,HH.y,2.45,0,7); c.fill(); }
  c.restore(); c.restore();
  // hand positions in this context's pixel space, for the rod and the finger overlay
  return {hand:{x:x+HW.x*s,y:y+HW.y*s}, back:{x:x+BW.x*s,y:y+BW.y*s}, ra, sk, skD}; }

function drawHair3(c,hs,hair,hairC,D,t){
  const dk=D(mix(hairC,'#000000',.3)), lt=D(mix(hairC,'#ffffff',.25));
  const cap=(fr)=>{ c.fillStyle=hair; c.beginPath(); c.arc(0,-57,7.95,Math.PI*.98,Math.PI*1.99); c.quadraticCurveTo(7.6,-59.4,6.4,-60.2); c.quadraticCurveTo(4.2,-58.8,1.6,-59.6); c.quadraticCurveTo(-1.6,-59,-2.6,-56.4); c.lineTo(-2.8,-52.6); c.lineTo(-6.6,-53.4); c.closePath(); c.fill();
    c.strokeStyle=lt; c.lineWidth=.6; c.beginPath(); c.arc(0,-57.4,6.4,Math.PI*1.25,Math.PI*1.6); c.stroke(); };
  switch(hs){
    case 'short': cap(); break;
    case 'long': cap(); c.fillStyle=hair; c.beginPath(); c.moveTo(-2.6,-57); c.bezierCurveTo(-3.5,-53,-3.1,-49.6,-4,-46.1); c.quadraticCurveTo(-4.7,-47.3,-5.3,-46.5); c.quadraticCurveTo(-5.8,-47.6,-6.3,-47.4); c.bezierCurveTo(-6.9,-50.4,-7,-53.4,-6.6,-56); c.closePath(); c.fill();
      c.strokeStyle=dk; c.lineWidth=.35; c.beginPath(); c.moveTo(-4.4,-55); c.bezierCurveTo(-4.8,-52,-4.6,-49.6,-4.9,-47.4); c.stroke(); c.strokeStyle=lt; c.lineWidth=.4; c.beginPath(); c.moveTo(-3.4,-55.6); c.bezierCurveTo(-3.8,-53,-3.7,-50.6,-4.1,-48.4); c.stroke(); break;
    case 'ponytail': case 'bun': cap(); c.fillStyle=hair; c.fillRect(-7.2,-60,1.4,1); break;
    case 'buzz': c.save(); c.globalAlpha*=.8; c.fillStyle=hair; c.beginPath(); c.arc(0,-56.6,7.85,Math.PI*1.02,Math.PI*1.97); c.quadraticCurveTo(4,-59.6,0,-59.4); c.quadraticCurveTo(-2.4,-58.6,-2.6,-55); c.lineTo(-6.8,-54.6); c.closePath(); c.fill(); c.restore(); break;
    case 'curly': c.fillStyle=hair; /* curls stop above the brow: the face stays clear */ for(let i=0;i<9;i++){ const a=Math.PI*(1.0+i*.098); c.beginPath(); c.arc(Math.cos(a)*7.2,-57+Math.sin(a)*7,2.6,0,7); c.fill(); } c.beginPath(); c.arc(-6.6,-53.4,2.4,0,7); c.arc(-4.6,-55,2.2,0,7); c.fill(); c.beginPath(); c.arc(4.4,-61.6,1.7,0,7); c.fill(); c.beginPath(); c.arc(6.1,-60.8,1.3,0,7); c.fill();
      c.strokeStyle=lt; c.lineWidth=.45; for(let i=0;i<6;i++){ const a=Math.PI*(1.1+i*.15); c.beginPath(); c.arc(Math.cos(a)*7.2,-57+Math.sin(a)*7,1.4,Math.PI*1.1,Math.PI*1.8); c.stroke(); } break;
    case 'spiky': cap(); c.fillStyle=hair; c.beginPath(); for(let i=0;i<6;i++){ const x0=-7+i*2.7; c.moveTo(x0-1.7,-61.6); c.lineTo(x0+.6,-68.2+((i*5)%3)); c.lineTo(x0+1.7,-61.6); } c.fill(); c.strokeStyle=lt; c.lineWidth=.4; c.beginPath(); for(let i=0;i<6;i++){ const x0=-7+i*2.7; c.moveTo(x0,-62); c.lineTo(x0+.5,-66.6+((i*5)%3)); } c.stroke(); break;
    case 'bald': c.fillStyle='rgba(255,255,255,.22)'; c.beginPath(); c.ellipse(2,-61.4,2.6,1.1,-.3,0,7); c.fill(); break;
    default: cap();
  }
}

// ---------- outfits, shaped to the body ----------
function drawOutfit3(c,lk,D,f,t){ const o=lk.outfit||'none'; if(o==='none') return; const base=lk.outCol, oc=D(base||'#d8a020');
  const dk=v=>D(mix(base||v,'#000000',.22)), lt2=v=>D(mix(base||v,'#ffffff',.3));
  const torso=()=>a3TorsoPath(c,f), clipT=fn=>{ c.save(); torso(); c.clip(); fn(); c.restore(); };
  const R=(x,y,w,h,cl)=>{ c.fillStyle=cl; c.fillRect(x,y,w,h); };
  const pocket=(x,y,w,h,cl,fl)=>{ R(x,y,w,h,cl); R(x-.2,y-.2,w+.4,1.2,fl); c.fillStyle=D('#d8c090'); c.beginPath(); c.arc(x+w/2,y+.5,.32,0,7); c.fill(); };
  switch(o){
    case 'vest': { const col=D(base||'#6a7a4a'), d2=dk('#6a7a4a'); clipT(()=>{ c.fillStyle=col; c.beginPath(); c.moveTo(-10,-50); c.lineTo(-1.4,-50); c.lineTo(-2,-22); c.lineTo(-10,-22); c.closePath(); c.moveTo(10,-50); c.lineTo(2.6,-50); c.lineTo(2.2,-22); c.lineTo(10,-22); c.closePath(); c.fill();
        pocket(-7.2,-38.5,4,4,d2,D(mix(base||'#6a7a4a','#000000',.35))); pocket(3.4,-38.5,4,4,d2,D(mix(base||'#6a7a4a','#000000',.35))); pocket(-7.2,-31,4,3.6,d2,D(mix(base||'#6a7a4a','#000000',.35))); pocket(3.4,-31,4,3.6,d2,D(mix(base||'#6a7a4a','#000000',.35)));
        c.strokeStyle=D('#e8d8a0'); c.lineWidth=.35; c.setLineDash([.8,.7]); c.beginPath(); c.moveTo(-1.8,-45); c.lineTo(-2.2,-23); c.moveTo(2.8,-45); c.lineTo(2.4,-23); c.stroke(); c.setLineDash([]); c.fillStyle=D('#c8c8d0'); c.beginPath(); c.arc(5.4,-41.2,.9,0,7); c.fill(); }); break; }
    case 'lifejacket': { const col=D(base||'#ff7a2a'); clipT(()=>{ c.fillStyle=col; c.beginPath(); c.moveTo(-10,-50); c.lineTo(-1.2,-50); c.quadraticCurveTo(-2.6,-36,-1.4,-23); c.lineTo(-10,-23); c.closePath(); c.moveTo(10,-50); c.lineTo(2.2,-50); c.quadraticCurveTo(3.6,-36,2.4,-23); c.lineTo(10,-23); c.closePath(); c.fill();
        c.strokeStyle=D(mix(base||'#ff7a2a','#000000',.25)); c.lineWidth=.5; for(const yy of [-41,-35,-29]){ c.beginPath(); c.moveTo(-9,yy); c.quadraticCurveTo(-5,yy+1,-1.8,yy); c.moveTo(2.8,yy); c.quadraticCurveTo(6,yy+1,9,yy); c.stroke(); }
        R(-10,-34.4,20,1.8,D('#262630')); R(-10,-28.6,20,1.8,D('#262630')); R(-.6,-35,2.4,3,D('#c8c8d0')); R(-.6,-29.2,2.4,3,D('#c8c8d0')); c.fillStyle='rgba(255,255,255,.75)'; R(5.6,-44,2.6,.9,c.fillStyle); }); break; }
    case 'hoodie': { const col=oc; clipT(()=>{ R(-10,-50,20,28,col); R(-4.4,-33,9,6,dk('#d8a020')); c.strokeStyle=dk('#d8a020'); c.lineWidth=.4; c.beginPath(); c.moveTo(-4.4,-27.2); c.lineTo(4.6,-27.2); c.stroke(); R(-10,-24.8,20,1.4,dk('#d8a020')); });
      c.fillStyle=col; c.beginPath(); c.ellipse(-4.6,-47.4,4.6,2.8,-.25,0,7); c.fill(); c.fillStyle=dk('#d8a020'); c.beginPath(); c.ellipse(-4,-47.2,3,1.6,-.25,0,7); c.fill();
      c.strokeStyle=D('#f4f0e8'); c.lineWidth=.5; c.beginPath(); c.moveTo(1.4,-46); c.lineTo(1.8,-39.6); c.moveTo(3.4,-46); c.lineTo(3.8,-40.4); c.stroke(); c.fillStyle=D('#f4f0e8'); c.beginPath(); c.arc(1.8,-39.4,.4,0,7); c.arc(3.8,-40.2,.4,0,7); c.fill(); break; }
    case 'raincoat': { const col=D(base||'#f2c230'); c.fillStyle=col; a3CoatPath(c,f,-16); c.fill(); c.strokeStyle=dk('#f2c230'); c.lineWidth=.55; c.beginPath(); c.moveTo(.4,-45); c.lineTo(.6,-16.4); c.stroke();
      for(let i=0;i<4;i++){ c.fillStyle=D('#3a3a44'); c.beginPath(); c.arc(1.9,-41.5+i*6.2,.6,0,7); c.fill(); }
      pocket(-7.6,-28,4.2,4.4,dk('#f2c230'),D(mix(base||'#f2c230','#000000',.32))); pocket(3.8,-28,4.2,4.4,dk('#f2c230'),D(mix(base||'#f2c230','#000000',.32)));
      c.fillStyle=col; c.beginPath(); c.moveTo(-6.4,-47.2); c.lineTo(.2,-42.6); c.lineTo(6.6,-47.2); c.lineTo(5.4,-49.4); c.lineTo(-5.2,-49.4); c.closePath(); c.fill(); c.strokeStyle=dk('#f2c230'); c.beginPath(); c.moveTo(-6.4,-47.2); c.lineTo(.2,-42.6); c.lineTo(6.6,-47.2); c.stroke(); break; }
    case 'overalls': { const den=D(base||'#3a6f9a'), d2=dk('#3a6f9a'); clipT(()=>{ R(-10,-26,20,4,den); c.fillStyle=den; c.beginPath(); c.moveTo(-5.2,-38); c.lineTo(5.4,-38); c.lineTo(6,-23); c.lineTo(-5.8,-23); c.closePath(); c.fill(); R(-2.2,-34.6,4.6,3.6,d2);
        c.strokeStyle=D('#e8c060'); c.lineWidth=.32; c.setLineDash([.7,.6]); c.strokeRect(-2.2,-34.6,4.6,3.6); c.setLineDash([]); });
      c.strokeStyle=den; c.lineWidth=1.8; c.beginPath(); c.moveTo(-4.6,-38); c.lineTo(-5.6,-46.2); c.moveTo(4.8,-38); c.lineTo(5.2,-46.4); c.stroke(); c.fillStyle=D('#f2cf5a'); c.beginPath(); c.arc(-4.5,-38.4,.8,0,7); c.arc(4.7,-38.4,.8,0,7); c.fill(); break; }
    case 'puffer': { const col=oc, d2=dk('#d8a020'); c.fillStyle=col; c.beginPath(); c.moveTo(-9.6,-46.2); c.quadraticCurveTo(-10.6,-34,-9.6,-21.6); c.quadraticCurveTo(0,-20.4,9.8,-21.6); c.quadraticCurveTo(10.8,-34,9.8,-46.2); c.quadraticCurveTo(0,-49,-9.6,-46.2); c.fill();
      c.strokeStyle=d2; c.lineWidth=.6; for(let yy=-41.5;yy<-22;yy+=4.6){ c.beginPath(); c.moveTo(-10,yy); c.quadraticCurveTo(0,yy+1.4,10.2,yy); c.stroke(); } R(.1,-46.6,.8,25,D('#e8e8ee')); c.fillStyle=col; c.beginPath(); c.ellipse(.4,-46.8,7.4,2.2,0,0,7); c.fill(); c.strokeStyle=d2; c.beginPath(); c.ellipse(.4,-46.8,7.4,2.2,0,0,Math.PI); c.stroke(); break; }
    case 'wetsuit': { const w=D('#1c1c26'); clipT(()=>{ R(-10,-50,20,28,w); R(-10,-41,20,1.8,oc); R(-10,-25.8,20,1.4,oc); }); c.fillStyle=oc; c.fillRect(-6.1,-12.6,5,1.4); c.fillRect(.6,-12.6,5,1.4); R(.5,-47,.8,9,D('#8a8a9a')); break; }
    case 'captain': { const n=D(base||'#1a2a4a'); c.fillStyle=n; a3CoatPath(c,f,-14.5); c.fill(); c.strokeStyle=D(mix(base||'#1a2a4a','#ffffff',.15)); c.lineWidth=.5; c.beginPath(); c.moveTo(-.4,-44); c.lineTo(-.6,-15); c.stroke();
      for(let i=0;i<4;i++){ c.fillStyle=D('#f2c84a'); c.beginPath(); c.arc(-2.4,-41+i*5.8,.65,0,7); c.arc(2.4,-41+i*5.8,.65,0,7); c.fill(); }
      c.fillStyle=D('#f2c84a'); c.fillRect(4.6,-46.6,4.4,1.6); for(let k=0;k<4;k++) c.fillRect(5+k*1.05,-45,.5,1.8); c.fillStyle=n; c.beginPath(); c.moveTo(-6,-47.4); c.lineTo(0,-42.4); c.lineTo(6.2,-47.4); c.lineTo(5,-49.2); c.lineTo(-4.8,-49.2); c.closePath(); c.fill(); c.fillStyle=D('#f4f4f2'); c.beginPath(); c.moveTo(-2,-47.6); c.lineTo(0,-44); c.lineTo(2.2,-47.6); c.closePath(); c.fill(); break; }
    case 'spacesuit': { const s2=D('#e8ecf0'); clipT(()=>{ R(-10,-50,20,28,s2); R(-10,-27,20,1.8,D('#d8603a')); }); R(-4.2,-40.4,8.4,6,D('#5a6a7a')); R(-3.4,-39.4,2.2,2,D('#ff5a4a')); R(.4,-39.4,2.2,2,D('#5aff9a')); R(-3.4,-36.6,6,.8,D('#9ad8ff'));
      c.strokeStyle=D('#b8c0c8'); c.lineWidth=.4; c.beginPath(); c.moveTo(-7,-14); c.lineTo(-1.4,-14); c.moveTo(.6,-14); c.lineTo(6.2,-14); c.stroke(); c.fillStyle=D('#c8d0d8'); c.beginPath(); c.ellipse(0,-46.6,7,1.8,0,0,7); c.fill(); break; }
    case 'cardigan': { const col=oc; clipT(()=>{ c.fillStyle=col; c.beginPath(); c.moveTo(-10,-50); c.lineTo(-1.6,-50); c.lineTo(-.6,-22); c.lineTo(-10,-22); c.closePath(); c.moveTo(10,-50); c.lineTo(3.2,-50); c.lineTo(1.6,-22); c.lineTo(10,-22); c.closePath(); c.fill(); R(-10,-24.6,20,2.2,dk('#d8a020'));
        c.strokeStyle=dk('#d8a020'); c.lineWidth=.3; for(let xx=-9;xx<10;xx+=1.2){ c.beginPath(); c.moveTo(xx,-24.6); c.lineTo(xx,-22.4); c.stroke(); } });
      for(let i=0;i<4;i++){ c.fillStyle=D('#f4ecd8'); c.beginPath(); c.arc(-.2+i*.25,-41+i*4.8,.55,0,7); c.fill(); } pocket(3.6,-31,3.8,3.4,dk('#d8a020'),dk('#d8a020')); break; }
    case 'sweater': { const col=oc, l3=lt2('#d8a020'); clipT(()=>{ R(-10,-50,20,28,col); c.fillStyle=l3; c.beginPath(); for(let xx=-9;xx<10;xx+=3){ c.moveTo(xx,-38.4); c.lineTo(xx+1.5,-36.6); c.lineTo(xx+3,-38.4); c.lineTo(xx+1.5,-40.2); } c.fill();
        c.fillStyle=dk('#d8a020'); c.fillRect(-10,-24.9,20,2.6); c.strokeStyle=D(mix(base||'#d8a020','#000000',.32)); c.lineWidth=.3; for(let xx=-9;xx<10;xx+=1.1){ c.beginPath(); c.moveTo(xx,-24.9); c.lineTo(xx,-22.4); c.stroke(); }
        c.strokeStyle='rgba(0,0,0,.08)'; c.lineWidth=.35; for(let xx=-9;xx<10;xx+=1.6){ c.beginPath(); c.moveTo(xx,-48); c.lineTo(xx,-41); c.moveTo(xx,-35); c.lineTo(xx,-25); c.stroke(); } });
      c.fillStyle=dk('#d8a020'); c.beginPath(); c.ellipse(.6,-46.4,6.4,1.8,0,0,7); c.fill(); break; }
    case 'apron': { const col=D(base||'#e8e0d0'); c.fillStyle=col; c.beginPath(); c.moveTo(-5,-41); c.lineTo(5.6,-41); c.lineTo(6.6,-18); c.quadraticCurveTo(.6,-17,-5.6,-18); c.closePath(); c.fill();
      c.strokeStyle=col; c.lineWidth=.9; c.beginPath(); c.moveTo(-4.4,-41); c.lineTo(-2.2,-47.4); c.moveTo(5,-41); c.lineTo(3,-47.6); c.stroke(); pocket(-2.2,-33.6,5,3.8,dk('#e8e0d0'),dk('#e8e0d0')); c.strokeStyle=dk('#e8e0d0'); c.lineWidth=.5; c.beginPath(); c.moveTo(-7.6,-26.4); c.lineTo(-5.4,-26.4); c.moveTo(6.4,-26.4); c.lineTo(8.2,-26.4); c.stroke(); break; }
    case 'tidecoat': { const n=D('#1a3a5a'); c.fillStyle=n; a3CoatPath(c,f,-16); c.fill(); const glow=D('#5ad8e8'); c.strokeStyle=glow; c.lineWidth=1.1; c.beginPath(); for(let xx=-9.6;xx<=9.6;xx+=.6) c.lineTo(xx,-21.4+Math.sin(xx*.9+t*2)*1.1); c.stroke();
      c.lineWidth=.7; c.beginPath(); c.moveTo(.2,-45.6); c.lineTo(.4,-22.6); c.stroke(); c.save(); c.globalAlpha*=.35; c.lineWidth=2.4; c.beginPath(); for(let xx=-9.6;xx<=9.6;xx+=.6) c.lineTo(xx,-21.4+Math.sin(xx*.9+t*2)*1.1); c.stroke(); c.restore();
      c.fillStyle=n; c.beginPath(); c.moveTo(-6.2,-47.2); c.lineTo(.2,-42.8); c.lineTo(6.4,-47.2); c.lineTo(5.2,-49.4); c.lineTo(-5,-49.4); c.closePath(); c.fill(); break; }
    case 'bathrobe': { const col=D(base||'#f0e6f4'), d2=dk('#f0e6f4'); c.fillStyle=col; a3CoatPath(c,f,-12); c.fill();
      c.fillStyle=d2; c.beginPath(); c.moveTo(-5.4,-47); c.quadraticCurveTo(-1,-40,1.4,-33); c.lineTo(3,-33); c.quadraticCurveTo(1.6,-41,6.4,-47); c.lineTo(3.8,-47.6); c.quadraticCurveTo(1.6,-42,1.6,-37); c.quadraticCurveTo(-1.6,-42,-2.6,-47.6); c.closePath(); c.fill();
      R(-9,-29.4,18.6,2.2,d2); c.strokeStyle=d2; c.lineWidth=1; c.beginPath(); c.moveTo(4.4,-28.4); c.lineTo(5.6,-23); c.moveTo(5,-28.4); c.lineTo(7,-24); c.stroke();
      c.fillStyle='rgba(255,255,255,.25)'; for(let i=0;i<14;i++){ c.beginPath(); c.arc(-8+((i*7)%17),-44+((i*11)%30),.5,0,7); c.fill(); } break; }
    case 'pajamas': { const col=D(base||'#7a9ad8'), l3=D('#f4f0f8'); clipT(()=>{ R(-10,-50,20,28,col); c.fillStyle=l3; for(let xx=-9;xx<10;xx+=2.4) c.fillRect(xx,-50,.9,28); });
      for(let i=0;i<4;i++){ c.fillStyle=l3; c.beginPath(); c.arc(1.2,-42+i*5,.5,0,7); c.fill(); } c.fillStyle=col; c.beginPath(); c.moveTo(-5.6,-47.2); c.lineTo(.6,-43.2); c.lineTo(6,-47.2); c.lineTo(5,-48.8); c.lineTo(-4.8,-48.8); c.closePath(); c.fill(); break; }
    case 'lumberjack': { const col=D(base||'#b8342a'), d2=D('#1c1416'); clipT(()=>{ R(-10,-50,20,28,col); c.fillStyle=d2; c.globalAlpha*=.75; for(let xx=-10;xx<10;xx+=4.4) c.fillRect(xx,-50,2,28); for(let yy=-50;yy<-22;yy+=4.4) c.fillRect(-10,yy,20,2); c.globalAlpha/=.75;
        c.fillStyle=d2; for(let xx=-10;xx<10;xx+=4.4) for(let yy=-50;yy<-22;yy+=4.4) c.fillRect(xx,yy,2,2); });
      pocket(-7,-40,4,3.6,col,d2); pocket(3.4,-40,4,3.6,col,d2); c.strokeStyle=d2; c.lineWidth=.5; c.beginPath(); c.moveTo(.6,-45.6); c.lineTo(.8,-23.4); c.stroke(); c.fillStyle=col; c.beginPath(); c.moveTo(-6,-47.2); c.lineTo(.6,-43.6); c.lineTo(6.6,-47.2); c.lineTo(5.4,-49); c.lineTo(-4.8,-49); c.closePath(); c.fill(); break; }
  }
}

// ---------- test-mode contact sheet (only with ?test): every outfit x a spread of looks ----------
if(/[?&]test\b/.test(location.search)){
  window.__anglerSheet=(opts={})=>{
    const looks=opts.looks||[{g:'m',hairStyle:'short',skin:1,hair:1},{g:'f',hairStyle:'long',skin:0,hair:3,glasses:'round'},{g:'m',hairStyle:'buzz',skin:3,hair:0,beard:'beard',glasses:'sunglasses',hat:'cap'},{g:'f',hairStyle:'ponytail',skin:2,hair:5,hat:'bucket'},{g:'m',hairStyle:'curly',skin:4,hair:0,beard:'mustache',glasses:'nerd'},{g:'f',hairStyle:'bun',skin:1,hair:2,glasses:'heart'},{g:'m',hairStyle:'spiky',skin:0,hair:4,glasses:'goggles'},{g:'m',hairStyle:'bald',skin:2,hair:4,beard:'longbeard',glasses:'monocle',hat:'straw'}];
    const outs=(opts.outfits||OUTFITS.map(o=>o[0])).slice(opts.from||0,opts.to||99), cw=opts.cell||150, ch=Math.round(cw*(opts.face?1:1.4)), sc=opts.face?cw/22:ch/82;
    const o=document.createElement('canvas'); o.width=cw*looks.length; o.height=ch*outs.length; const x=o.getContext('2d');
    outs.forEach((out,r)=>looks.forEach((lk0,cI)=>{ const lk=Object.assign({},S.look,{shirt:'#4f86c9',pants:'#3a4a6a',pat:opts.pat||'none',outfit:out,outCol:undefined,hat:'none',glasses:'none',beard:'none'},lk0);
      x.save(); x.beginPath(); x.rect(cI*cw,r*ch,cw,ch); x.clip(); x.fillStyle=(r+cI)%2?'#2e3858':'#283150'; x.fillRect(cI*cw,r*ch,cw,ch);
      drawAngler3(x,cI*cw+cw*(opts.face?.42:.42),r*ch+(opts.face?ch*.5+56*sc:ch*.94),sc,lk,{t:1.3,hx:9,hy:-35}); x.restore(); x.fillStyle='#cfd8ff'; x.font='9px system-ui'; x.fillText(out+' · '+lk0.g+' '+lk0.hairStyle,cI*cw+3,r*ch+10); }));
    window.__post(opts.save||'angler',o.toDataURL()); return outs.length; };
}
if(/[?&]test\b/.test(location.search)){
  window.__poseSheet=(opts={})=>{ const poses=[['idle',{}],['charging',{pow:.5}],['charging',{pow:1}],['flying',{}],['bite',{}],['reeling',{ten:.2}],['reeling',{ten:1}],['landing',{}]];
    const looks=opts.looks||[{g:'m',hairStyle:'short',outfit:'vest',hat:'bucket'},{g:'f',hairStyle:'long',outfit:'raincoat'},{g:'m',hairStyle:'curly',outfit:'captain',beard:'beard',glasses:'round',hat:'cap'}];
    const cw=150, ch=200, sc=ch/84, o=document.createElement('canvas'); o.width=cw*poses.length; o.height=ch*looks.length; const x=o.getContext('2d');
    looks.forEach((lk0,r)=>poses.forEach(([st,ov],cI)=>{ const lk=Object.assign({},S.look,{shirt:'#4f86c9',pants:'#3a4a6a',pat:'none',outCol:undefined,hat:'none',glasses:'none',beard:'none',outfit:'none'},lk0);
      const hx=st==='charging'?7-ov.pow*3:9, hy=st==='charging'?-38-ov.pow*3:st==='reeling'?-34:-35;
      x.save(); x.beginPath(); x.rect(cI*cw,r*ch,cw,ch); x.clip(); x.fillStyle=(r+cI)%2?'#2e3858':'#283150'; x.fillRect(cI*cw,r*ch,cw,ch);
      drawAngler3(x,cI*cw+cw*.4,r*ch+ch*.95,sc,lk,Object.assign({t:1.3,hx,hy,forceSt:st},ov));
      x.strokeStyle='#d9c7a0'; x.lineWidth=2; x.beginPath(); x.moveTo(cI*cw+cw*.4+hx*sc,r*ch+ch*.95+hy*sc); x.lineTo(cI*cw+cw*.95,r*ch+ch*.1); x.stroke(); x.restore();
      x.fillStyle='#cfd8ff'; x.font='10px system-ui'; x.fillText(st+(ov.pow!=null?' '+ov.pow:'')+(ov.ten!=null?' '+ov.ten:''),cI*cw+3,r*ch+11); }));
    window.__post(opts.save||'poses',o.toDataURL()); return 'ok'; };
}

// ---------- 0.3 rods: a tapered blank with a grip, reel, guides and a look of its own for every rod ----------
function v3Rod(c,hand,tip,mx,my,rod,night,t,reeling){ const id=rod?rod.id:'bamboo', col=rod?rod.col:'#d9c7a0', N=c2=>mix(c2,'#1a1820',night*.4), n=12, pts=[];
  for(let i=0;i<=n;i++){ const u=i/n, x=(1-u)*(1-u)*hand.x+2*u*(1-u)*mx+u*u*tip.x, y=(1-u)*(1-u)*hand.y+2*u*(1-u)*my+u*u*tip.y; pts.push([x,y]); }
  const base=id==='scrap'?'#8a5a3a':col, dark=mix(base,'#000000',.35), lite=mix(base,'#ffffff',.35);
  // the grip behind the hand (cork, or rod-specific)
  const g0=pts[0], ga=Math.atan2(pts[1][1]-g0[1],pts[1][0]-g0[0]); c.save(); c.translate(g0[0],g0[1]); c.rotate(ga);
  c.fillStyle=N(id==='golden'?'#c8961e':id==='abyssrod'?'#24102e':id==='carbon'?'#1a1a1a':'#b8875a'); c.fillRect(-9,-2.4,13,4.8); if(id!=='carbon'&&id!=='abyssrod'){ c.fillStyle=N('#8a5f3a'); for(let k=-8;k<4;k+=3) c.fillRect(k,-2.4,1,4.8); }
  c.fillStyle=N('#2a2a30'); c.fillRect(-11,-2,2.4,4); c.restore();
  // the tapered blank, segment by segment
  c.lineCap='round'; for(let i=0;i<n;i++){ const u=i/n, w=3.2-u*2.3; let cl=base;
    if(id==='bamboo'&&i%3===2) cl=dark; if(id==='fibre') cl=i%4===3?'#d8383a':base; if(id==='spine') cl=i%2?mix(base,'#ffffff',.25):base;
    if(id==='tides') cl=mix(base,'#bffcf0',.5+.5*Math.sin(t*3-i*.8)); if(id==='golden') cl=mix(base,'#fff4b0',Math.max(0,Math.sin(t*2-i*.5))*.6);
    c.strokeStyle=N(cl); c.lineWidth=Math.max(.9,w); c.beginPath(); c.moveTo(pts[i][0],pts[i][1]); c.lineTo(pts[i+1][0],pts[i+1][1]); c.stroke(); }
  // a light edge along the top of the blank
  c.strokeStyle=v3rgba(lite,id==='carbon'?.5:.35); c.lineWidth=.8; c.beginPath(); c.moveTo(pts[1][0],pts[1][1]-1); for(let i=2;i<=n-2;i++) c.lineTo(pts[i][0],pts[i][1]-1); c.stroke();
  // wraps and guides
  for(const i of [3,6,9,11]){ const [x,y]=pts[i]; c.fillStyle=N(id==='carbon'?'#d8b048':id==='fibre'?'#d8383a':mix(base,'#000000',.5)); c.fillRect(x-1.4,y-1.6,2.8,3.2); c.strokeStyle=N('#c8ccd4'); c.lineWidth=.8; c.beginPath(); c.arc(x,y+2.2,1.3,0,7); c.stroke(); }
  // signature touches
  if(id==='frostrod'){ c.fillStyle='rgba(230,248,255,.85)'; for(let i=2;i<n;i+=2){ const [x,y]=pts[i]; c.fillRect(x-.6,y-2.6,1.2,1.2); } const [x,y]=pts[n]; c.beginPath(); c.moveTo(x,y-3); c.lineTo(x+1.6,y); c.lineTo(x,y+3); c.lineTo(x-1.6,y); c.fill(); }
  if(id==='coralrod'){ c.fillStyle=N('#ffb0c0'); for(const i of [2,5,8]){ const [x,y]=pts[i]; c.beginPath(); c.arc(x+1,y-2.4,1.3,0,7); c.arc(x-1.6,y-2,1,0,7); c.fill(); } }
  if(id==='stormrod'&&Math.sin(t*1.7)>.85){ c.strokeStyle='rgba(220,235,255,.9)'; c.lineWidth=.9; c.beginPath(); c.moveTo(pts[4][0],pts[4][1]-3); c.lineTo(pts[6][0]+2,pts[6][1]-6); c.lineTo(pts[7][0],pts[7][1]-3); c.lineTo(pts[9][0]+2,pts[9][1]-6); c.stroke(); }
  if(id==='abyssrod'){ for(const i of [2,4,6,8,10]){ const [x,y]=pts[i]; v3glow(c,x,y,5,'rgba(190,120,255,.9)',.35+.25*Math.sin(t*2+i)); c.fillStyle='#e0c0ff'; c.fillRect(x-.6,y-.6,1.2,1.2); } }
  if(id==='scrap'){ c.fillStyle=N('#c8c0a0'); const [x,y]=pts[5]; c.fillRect(x-2.5,y-2.4,5,4.8); c.fillStyle=v3rgba('#a0602a',.6); for(const i of [3,7,10]){ const [x2,y2]=pts[i]; c.beginPath(); c.arc(x2,y2,1.2,0,7); c.fill(); } }
  if(id==='spine'){ c.fillStyle=N(mix(base,'#ffffff',.4)); for(let i=1;i<n;i++){ const [x,y]=pts[i]; c.beginPath(); c.moveTo(x-1,y-1.5); c.lineTo(x,y-4.2+i*.15); c.lineTo(x+1,y-1.5); c.fill(); } }
  // the reel under the grip: a spool that spins while you reel
  { const [x,y]=pts[1], r=3.6; c.fillStyle=N('#3a3a44'); c.fillRect(x-1,y,2,3); c.fillStyle=N(id==='golden'?'#e8b830':id==='carbon'?'#c8c8d0':'#8a8a96'); c.beginPath(); c.arc(x,y+5.4,r,0,7); c.fill();
    c.strokeStyle=N('#2a2a30'); c.lineWidth=.9; c.beginPath(); c.arc(x,y+5.4,r,0,7); c.stroke(); const a=reeling?t*16:0; c.beginPath(); c.moveTo(x,y+5.4); c.lineTo(x+Math.cos(a)*r*1.5,y+5.4+Math.sin(a)*r*1.5); c.stroke(); c.fillStyle=N('#2a2a30'); c.beginPath(); c.arc(x+Math.cos(a)*r*1.5,y+5.4+Math.sin(a)*r*1.5,1.1,0,7); c.fill(); }
  c.lineCap='butt'; }
if(/[?&]test\b/.test(location.search)) window.__rodSheet=(save)=>{ const o=document.createElement('canvas'); o.width=4*220; o.height=3*150; const x=o.getContext('2d'); x.fillStyle='#4a7a90'; x.fillRect(0,0,o.width,o.height);
  RODS.forEach((r,i)=>{ const ox=(i%4)*220, oy=Math.floor(i/4)*150; x.save(); x.translate(ox,oy); x.scale(1.6,1.6); v3Rod(x,{x:20,y:70},{x:125,y:12},70,30,r,0,performance.now()/1000,i%2===0); x.restore(); x.fillStyle='#fff'; x.font='11px sans-serif'; x.fillText(r.id,ox+6,oy+144); });
  if(save) __post(save,o.toDataURL()); return RODS.length; };
// rod pictures for the Rods tab, drawn once per rod with the same code as in the game
const ROD_IMG3={};
function rodImg3(id,lvl){ if(!ROD_IMG3[id]){ const o=document.createElement('canvas'); o.width=240; o.height=80; const x=o.getContext('2d'); x.scale(2,2); v3Rod(x,{x:16,y:33},{x:114,y:6},64,22,ROD_I[id],0,0,false); ROD_IMG3[id]=o.toDataURL(); }
  return `<span style="position:relative;display:inline-block;width:120px;height:40px;flex:0 0 auto"><img src="${ROD_IMG3[id]}" width="120" height="40" alt="" style="display:block">${lvl?`<b style="position:absolute;right:0;bottom:-2px;font-size:11px;color:#ffd36a">Lv ${lvl}</b>`:''}</span>`; }
if(/[?&]test\b/.test(location.search)) window.__hatSheet=(opts={})=>{ const ids=opts.ids||HATS.map(h=>h[0]||h.id).slice(opts.from||0,opts.to||999), cols=opts.cols||10, cw=opts.cell||110, ch=cw, sc=cw/26;
  const o=document.createElement('canvas'); o.width=cols*cw; o.height=Math.ceil(ids.length/cols)*ch; const x=o.getContext('2d');
  ids.forEach((id,i)=>{ const cx=(i%cols)*cw, cy=Math.floor(i/cols)*ch; x.save(); x.beginPath(); x.rect(cx,cy,cw,ch); x.clip(); x.fillStyle=i%2?'#2e3858':'#283150'; x.fillRect(cx,cy,cw,ch);
    const lk=Object.assign({},S.look,{hat:id,outfit:'none',glasses:'none',beard:'none',g:opts.pair?(i%2?'f':'m'):(i%2?'f':'m'),hairStyle:opts.hair?opts.hair[i%opts.hair.length]:(i%2?'long':'short')}); drawAngler3(x,cx+cw*.45,cy+ch*.64+56*sc,sc,lk,{t:1.3,hx:9,hy:-35}); x.restore(); x.fillStyle="#cfd8ff"; x.font="9px system-ui"; x.fillText(id,cx+3,cy+10); });
  window.__lastSheet=o; if(!opts.nosave) window.__post(opts.save||'hats',o.toDataURL()); return ids.length; };
// hats that leave the top of the head free (hair shows fully) and helmets that hide all hair
const A3_HAT_OPEN=new Set(['none','headphones','headband','halo','flower','catears','bunnyears','antlers','tiara','crown']);
const A3_HAT_FULL=new Set(['diver','astro','fishbowl','knight','pumpkin']);
const A3HAT=new WeakMap();
function a3HatLayer(c){ let H=A3HAT.get(c.canvas); if(!H){ H=document.createElement('canvas'); A3HAT.set(c.canvas,H); } if(H.width!==c.canvas.width||H.height!==c.canvas.height){ H.width=c.canvas.width; H.height=c.canvas.height; } return H; }
// test: lowest point a hat reaches over the eye (hat units, eye centre at y=+0.4, eye top at -0.95)
if(/[?&]test\b/.test(location.search)) window.__hatBottom=(id)=>{ const k=40, o=document.createElement('canvas'); o.width=40*k; o.height=40*k; const x=o.getContext('2d'); x.translate(20*k,30*k); x.scale(k,k); drawHat(x,id,'#c8553a',1.3);
  const d=x.getImageData(0,0,o.width,o.height).data; let best=-99; for(let px=Math.round((20+3.15)*k);px<=Math.round((20+5.95)*k);px++) for(let py=o.height-1;py>=0;py--){ if(d[(py*o.width+px)*4+3]>40){ best=Math.max(best,py/k-30); break; } } return +best.toFixed(2); };
if(/[?&]test\b/.test(location.search)) window.__hatBase=(id,a=-3,b=3)=>{ const k=40, o=document.createElement('canvas'); o.width=60*k; o.height=60*k; const x=o.getContext('2d'); x.translate(30*k,40*k); x.scale(k,k); drawHat(x,id,'#c8553a',1.3);
  const d=x.getImageData(0,0,o.width,o.height).data; let best=-99; for(let px=Math.round((30+a)*k);px<=Math.round((30+b)*k);px++) for(let py=o.height-1;py>=0;py--){ if(d[(py*o.width+px)*4+3]>40){ best=Math.max(best,py/k-40); break; } } return +best.toFixed(2); };
if(/[?&]test\b/.test(location.search)) window.__lookSheet=(looks,opts={})=>{ const cols=opts.cols||7, cw=opts.cell||160, ch=Math.round(cw*1.5), sc=cw/(opts.k||48); const o=document.createElement('canvas'); o.width=cols*cw; o.height=Math.ceil(looks.length/cols)*ch; const x=o.getContext('2d');
  looks.forEach((l,i)=>{ const cx=(i%cols)*cw, cy=Math.floor(i/cols)*ch; x.save(); x.beginPath(); x.rect(cx,cy,cw,ch); x.clip(); x.fillStyle=i%2?'#2e3858':'#283150'; x.fillRect(cx,cy,cw,ch); drawAngler3(x,cx+cw*(opts.ax||.48),cy+(opts.up?ch*.5+(opts.up)*sc:ch*.93),sc,Object.assign({},S.look,l),Object.assign({t:1.3},opts.o||{})); x.restore(); x.fillStyle='#cfd8ff'; x.font='10px system-ui'; x.fillText(l.label||'',cx+3,cy+11); });
  window.__post(opts.save||'looks',o.toDataURL()); return looks.length; };
