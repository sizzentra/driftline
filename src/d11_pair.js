
// =====================================================================
// Dax & Niko: an exclusive double pet for Zac (gift code only), the first pair in the game,
// drawn from a photo of the real dogs, two Chihuahua terrier mixes who sit side by side facing you.
//  Dax (left): smaller, black and a little scruffy, half-up ears whose tips fold forward, a greying
//   muzzle and chin, a small white blaze on his chest, warm brown eyes, a long thin tail.
//  Niko (right): cream with big upright ears (pink inside, his right tip folds a little), a white blaze
//   down to a white muzzle, a liver-pink nose, white chest and white paws.
// They count as ONE pet with the same bonus as Lily (+12% XP), so an exclusive is never stronger.
// Their own moments: Niko's ear twitches, Dax's head tilt and paw, nose boops with a little heart,
// a play bow together every third pet, Niko's "Yip!" when a fish lands, shivering in cold water,
// and napping curled up together at night.
// Faces are drawn in Lily's face units (eyes at +-2,-1.1) so every hat and accessory fits them too.
// =====================================================================
const PAIR={seenPet:null, pets:0, playT:-9999, yipT:-9999, lastSt:'', force:null, dax:{}, niko:{}};
const DXC={BK:'#151316', BK2:'#252226', HI:'#3d3944', WH:'#efebe5', GR:'#a8a29a', GR2:'#7a756f', TN:'#6b4a38', RIM:'#5a3a26', IRIS:'#3a2010', NOSE:'#09080a', PK:'#f08a98'};
const NKC={CR:'#e6c48c', CR2:'#cfa266', CR3:'#f2d9aa', WH:'#f7f1e7', WH2:'#e2d8c8', EAR:'#eca8a2', EAR2:'#d88c86', RIM:'#6a4228', IRIS:'#4a2a14', NOSE:'#7d4a42', PK:'#f08a98'};
function pairEyes(c,h,o,P,lookX){ const {ci,ln}=h;
  if(o.eyes==='happy'){ c.strokeStyle='#120c0a'; c.lineWidth=.55; for(const s of [-1,1]){ c.beginPath(); c.arc(s*2,-.9,.95,Math.PI*1.1,Math.PI*1.9); c.stroke(); } return; }
  if(o.eyes==='closed'||o.blink){ ln([-2.9,-1,-1.1,-.85],'#120c0a',.5); ln([1.1,-.85,2.9,-1],'#120c0a',.5); return; }
  const lx=lookX||0; for(const s of [-1,1]){ const ex=s*2; ci(ex,-1.1,1.25,P.RIM); ci(ex+lx*.25,-1.05,1.02,P.IRIS); ci(ex+lx*.35,-1,.58,'#070505'); }
  c.fillStyle='rgba(255,255,255,.92)'; c.beginPath(); c.arc(-1.6+lx*.3,-1.55,.36,0,7); c.arc(2.4+lx*.3,-1.55,.36,0,7); c.fill(); }
function pairMouth(c,h,o,tongue){ const {el}=h; c.strokeStyle='rgba(60,40,36,.8)'; c.lineWidth=.3; c.beginPath(); c.arc(-.4,2.75,.5,.25,Math.PI*.8); c.moveTo(1.1,2.95); c.arc(.6,2.75,.5,.25,Math.PI*.8); c.stroke();
  if(o.mouth==='tongue') el(.1,4+Math.sin((o.t||0)*14)*.15,.8,1.25,tongue); if(o.mouth==='yip') el(.1,3.5,1.25,1,'#3a1a18'); }
// Niko's face: cream, big upright ears, white blaze into a white muzzle, liver nose
function nikoFace(c,h,o){ const {el,ci}=h, N=NKC, t=o.t||0, tw=o.twitch?Math.sin(t*40)*.18:0;
  const ear=(s)=>{ let tipX=s*5.9, tipY=-10.6, rot=0; if(o.ears==='back'){ tipX=s*8.4; tipY=-6.6; } else if(o.ears==='perk'){ tipX=s*5.2; tipY=-11.6; }
    if(s>0) rot=tw; c.save(); c.translate(s*3.4,-3.2); c.rotate(rot); c.translate(-s*3.4,3.2);
    c.fillStyle=N.CR2; c.beginPath(); c.moveTo(s*1.4,-3.9); c.quadraticCurveTo(s*3.6,-7.6,tipX,tipY); c.quadraticCurveTo(s*6.6,-6.2,s*5.1,-1.8); c.closePath(); c.fill();
    c.fillStyle=N.EAR; c.beginPath(); c.moveTo(s*2.3,-3.8); c.quadraticCurveTo(s*3.9,-6.9,tipX*.92,tipY*.88); c.quadraticCurveTo(s*5.6,-5.8,s*4.5,-2.4); c.closePath(); c.fill();
    c.fillStyle=N.EAR2; c.beginPath(); c.moveTo(s*3.2,-3.6); c.quadraticCurveTo(s*4.1,-5.8,tipX*.84,tipY*.8); c.lineTo(s*4.2,-3); c.closePath(); c.fill();
    if(s<0&&o.ears!=='back'){ c.fillStyle=N.CR2; c.beginPath(); c.moveTo(tipX,tipY); c.quadraticCurveTo(tipX-1.6,tipY+.6,tipX-1.3,tipY+1.9); c.quadraticCurveTo(tipX-.2,tipY+1.4,tipX+.7,tipY+1.4); c.closePath(); c.fill(); } // his folded tip
    c.restore(); };
  ear(-1); ear(1);
  el(0,-.2,4.9,4.6,N.CR); el(-2.9,1.5,2.1,2,N.CR); el(2.9,1.5,2.1,2,N.CR); el(0,-3.1,3.8,1.6,N.CR2); el(0,-2.6,3.2,1.2,N.CR);
  c.fillStyle=N.WH; c.beginPath(); c.moveTo(-.55,-3.9); c.quadraticCurveTo(0,-4.3,.55,-3.9); c.lineTo(.7,-1.4); c.quadraticCurveTo(1.4,-.2,2.3,1); c.lineTo(-2.3,1); c.quadraticCurveTo(-1.4,-.2,-.7,-1.4); c.closePath(); c.fill();
  el(0,2.3,2.8,2.1,N.WH); el(0,3.9,1.8,1.1,N.WH); el(0,3.1,2.1,.8,N.WH2);
  pairEyes(c,h,o,N,o.look);
  el(0,1.15,1.2,.88,N.NOSE); ci(-.4,1.4,.25,'#4a2a26'); ci(.4,1.4,.25,'#4a2a26'); c.fillStyle='rgba(255,255,255,.4)'; c.beginPath(); c.ellipse(-.3,.8,.45,.2,-.2,0,7); c.fill();
  pairMouth(c,h,o,N.PK); }
// Dax's face: black and scruffy, half-up ears with forward-folded tips, a greying muzzle and chin
function daxFace(c,h,o){ const {el,ci,ln}=h, D=DXC, t=o.t||0;
  const ear=(s)=>{ let up=-6.8, fold=1; if(o.ears==='perk'){ up=-7.8; fold=.7; } else if(o.ears==='back'){ up=-4.6; fold=1.3; }
    c.fillStyle=D.BK; c.beginPath(); c.moveTo(s*2,-3.6); c.quadraticCurveTo(s*3.6,up-.4,s*4.9,up); c.quadraticCurveTo(s*5.8,-3.6,s*5,-1.6); c.closePath(); c.fill();
    c.fillStyle=D.BK2; c.beginPath(); c.moveTo(s*4.2,up+.6); c.quadraticCurveTo(s*5.9,up+.2,s*(6.4+fold*.4),up+2.4*fold); c.quadraticCurveTo(s*5.6,up+2.2,s*4.6,up+1.7); c.closePath(); c.fill(); // the folded tip
    ln([s*3.2,-4.6,s*4,up+.8],D.HI,.3); };
  ear(-1); ear(1);
  el(0,-.1,4.8,4.5,D.BK); el(-2.8,1.4,2,1.9,D.BK); el(2.8,1.4,2,1.9,D.BK);
  for(const [x,y,r] of [[-4.9,1.2,.5],[-5.1,2.2,.4],[4.9,1.2,.5],[5.1,2.2,.4],[-.5,-4.6,.45],[.6,-4.7,.4]]) el(x,y,r*1.6,r,D.BK,x>0?.5:-.5); // soft scruffy tufts
  el(-2.1,-2.55,1.1,.35,D.BK2,.1); el(2.1,-2.55,1.1,.35,D.BK2,-.1); c.fillStyle='rgba(120,115,130,.16)'; c.beginPath(); c.ellipse(-1.2,-3.9,1.1,.35,-.2,0,7); c.ellipse(1.3,-3.9,1.1,.35,.2,0,7); c.fill(); // soft brows and a sheen
  el(0,2.3,2.9,2.2,D.BK2); el(0,2.1,1.8,1.1,'#2e2a2e'); el(0,3.9,1.7,.95,D.GR2); el(0,4.15,1.25,.7,D.GR); // a long muzzle with a greying chin
  pairEyes(c,h,o,D,o.look);
  el(0,1.25,1.2,.86,D.NOSE); c.fillStyle='rgba(255,255,255,.35)'; c.beginPath(); c.ellipse(-.3,.85,.45,.2,-.2,0,7); c.fill();
  pairMouth(c,h,o,D.PK); }
function pairFrame(x,y,rot,s,flip){ return {x,y,rot,s,flip:!!flip}; }
// one dog sitting facing you; ox = its centre on the dock
function nikoSit(c,h,ox,o){ const {el,rc,ln}=h, N=NKC, t=o.t, br=Math.sin(t*2.1)*.22, hop=o.hop||0;
  c.save(); c.translate(ox+(o.jit||0),-hop);
  ln([3.6,-1.2,6.6,-.7,8.4,-2.4+Math.sin(t*(o.wag||8))*.9],N.CR2,1);  // thin tail curled at his side
  el(-3.2,-3,3.1,3,N.CR); el(3.2,-3,3.1,3,N.CR); el(-4.3,-.55,1.7,.75,N.WH); el(4.3,-.55,1.7,.75,N.WH);
  el(0,-8.4,4.3,6.6+br,N.CR); el(-2.6,-9.6,1.6,4.6,N.CR2,.15); el(2.6,-9.6,1.6,4.6,N.CR2,-.15);
  el(0,-9,2.9,5.2+br,N.WH); el(0,-5.6,2.2,1.8,N.WH2);
  const leg=(x,lift)=>{ if(lift){ c.save(); c.translate(x+.8,-7); c.rotate(-.55+Math.sin(t*6)*.1); rc(-.8,-5,1.6,5.4,N.CR3); el(0,-5.2,1.1,.9,N.WH); c.restore(); return; } rc(x,-6.2,1.6,6.2,N.CR3); rc(x,-2,1.6,2,N.WH); el(x+.8,-.35,1.15,.6,N.WH); };
  leg(-2.1,false); leg(.5,!!o.paw);
  const hx=(o.hx||0), hy=-15.8+(o.hy||0), rot=o.rot||0, s=.9;
  PAIR.niko.head=pairFrame(ox+hx+(o.jit||0),hy-hop,rot,s); PAIR.niko.neck=pairFrame(ox+hx+(o.jit||0),hy-hop+5.6,rot*.35,s);
  c.save(); c.translate(hx,hy); c.rotate(rot); c.scale(s,s); nikoFace(c,h,o.face); c.restore(); c.restore(); }
function daxSit(c,h,ox,o){ const {el,rc,ln}=h, D=DXC, t=o.t, br=Math.sin(t*2.3+1)*.2, hop=o.hop||0;
  c.save(); c.translate(ox+(o.jit||0),-hop);
  c.strokeStyle=D.BK; c.lineWidth=.9; c.lineCap='round'; c.beginPath(); c.moveTo(-3,-1.2); c.quadraticCurveTo(-7,-.2,-10.4,-1.2+Math.sin(t*(o.wag||8))*.8); c.stroke(); // long thin tail on the ground
  el(-3,-2.7,2.9,2.8,D.BK); el(3,-2.7,2.9,2.8,D.BK); el(1.7,-1.9,.8,.6,D.TN); el(-4,-.5,1.5,.7,D.BK2); el(4,-.5,1.5,.7,D.BK2);
  el(0,-7.4,3.9,5.8+br,D.BK); ln([-2.6,-10.6,-3.4,-9],D.HI,.35); ln([2.6,-10.6,3.4,-9],D.HI,.35); ln([-1.6,-6,-2.2,-4.6],D.HI,.3);
  el(.3,-9.2,.95,1.5,D.WH); el(.2,-8.1,.5,.7,D.WH); // the small white blaze on his chest
  const leg=(x,lift)=>{ if(lift){ c.save(); c.translate(x+.75,-6.4); c.rotate(-.6+Math.sin(t*6)*.1); rc(-.75,-4.6,1.5,5,D.BK); el(0,-4.8,1,.85,D.BK2); el(0,-4.6,.5,.35,'#3a2a2c'); c.restore(); return; } rc(x,-5.6,1.5,5.6,D.BK); el(x+.75,-.35,1.05,.6,D.BK2); };
  leg(-1.9,!!o.paw); leg(.5,false);
  const hx=(o.hx||0), hy=-14.4+(o.hy||0), rot=o.rot||0, s=.88;
  PAIR.dax.head=pairFrame(ox+hx+(o.jit||0),hy-hop,rot,s); PAIR.dax.neck=pairFrame(ox+hx+(o.jit||0),hy-hop+5.4,rot*.35,s);
  c.save(); c.translate(hx,hy); c.rotate(rot); c.scale(s,s); daxFace(c,h,o.face); c.restore(); c.restore(); }
// a cape behind a sitting dog's shoulders
function pairCape(c,ox,top,w,col,t){ const sw=Math.sin(t*3.2)*.6; c.fillStyle=col; c.beginPath(); c.moveTo(ox-w*.45,top); c.quadraticCurveTo(ox-w-.6,top+5+sw,ox-w-.4,-1.2+sw*.5); c.lineTo(ox+w+.4,-1.2-sw*.5); c.quadraticCurveTo(ox+w+.6,top+5-sw,ox+w*.45,top); c.closePath(); c.fill();
  c.fillStyle=mix(col,'#000000',.28); c.beginPath(); c.moveTo(ox-w-.4,-1.2+sw*.5); c.lineTo(ox+w+.4,-1.2-sw*.5); c.lineTo(ox+w*.6,-2.6); c.lineTo(ox-w*.6,-2.6); c.closePath(); c.fill(); }
const DAX_X=-4.6, NIKO_X=6.6;
function drawPair(c,t,h){ const {el,ln}=h;
  const now=performance.now(), pt=S.pet==='daxniko'?petT:(S.pet2==='daxniko'?petT2:-9999);
  if(PAIR.seenPet===null) PAIR.seenPet=pt; else if(pt!==PAIR.seenPet){ PAIR.seenPet=pt; PAIR.pets++; if(PAIR.pets%3===0) PAIR.playT=now; }
  if(G.st==='landing'&&PAIR.lastSt!=='landing') PAIR.yipT=now; PAIR.lastSt=G.st;
  let petted=now-pt<2200, play=now-PAIR.playT<2400, yip=now-PAIR.yipT<1600, watching=G.st==='reeling'||G.st==='bite'||G.st==='waiting';
  let sleep=PET_NIGHT>.55&&!petted&&!yip&&!watching&&!play;
  const busy=()=>petted||yip||play||watching;
  let boop=!sleep&&!busy()&&(t%23)>15&&(t%23)<17.2, paw=!sleep&&!busy()&&!boop&&(t%19)>8&&(t%19)<9.6, tilt=!boop&&!paw&&(t%7)>5.2&&(t%7)<6.6, twitch=(t%9)>7.6&&(t%9)<8.1;
  let cold=false; try{ cold=curLoc().id==='frost'; }catch(e){} let shiver=cold&&!sleep&&!busy()&&(t%11)>6&&(t%11)<8.5;
  if(PAIR.force){ const f=PAIR.force; petted=f==='petted'; play=f==='play'; yip=f==='yip'; watching=f==='watch'; sleep=f==='sleep'; boop=f==='boop'; paw=f==='paw'; tilt=f==='tilt'; twitch=f==='twitch'; shiver=f==='shiver'; if(play) PAIR.playT=now-700; if(yip) PAIR.yipT=now-300; }
  const lk=PAIR.lk||{}, cape=lk.acc==='cape'?(lk.accCol||'#d8303a'):null, blink=h.blink;
  if(sleep){ // curled up together: Niko's cream loaf behind, Dax tucked in front of him
    const br=Math.sin(t*1.6)*.3;
    el(9.6,-3.4,6.4,3.6+br,NKC.CR); el(4.6,-3.2,3.2,2.8,NKC.CR); el(11.8,-1.2,2.4,.8,NKC.WH); ln([15.6,-2.2,16.8,-.6,14.6,.2],NKC.CR2,.9);
    if(cape){ c.fillStyle=cape; c.beginPath(); c.ellipse(9.6,-5.4-br*.4,5.2,1.6,0,0,7); c.fill(); }
    PAIR.niko.head=pairFrame(4.4,-6.2,-.1,.78); PAIR.niko.neck=pairFrame(4.4,-2,-.04,.78);
    c.save(); c.translate(4.4,-6.2); c.rotate(-.1); c.scale(.78,.78); nikoFace(c,h,{eyes:'closed',mouth:'smile',ears:'back',t}); c.restore();
    el(-2,-2.7,5.4,2.9+br*.8,DXC.BK); el(-6.4,-2.5,2.6,2.4,DXC.BK); ln([2.6,-.8,5.4,-.4,7.4,-1.2],DXC.BK,.8); ln([-4,-5,-1,-5.6],DXC.HI,.3); ln([.4,-5.4,2.4,-5],DXC.HI,.28);
    if(cape){ c.fillStyle=mix(cape,'#000000',.1); c.beginPath(); c.ellipse(-2,-4.6-br*.3,4.4,1.4,0,0,7); c.fill(); }
    el(-8.6,-.7,2.2,.75,DXC.BK2);
    PAIR.dax.head=pairFrame(-6.6,-4.6,.12,.7); PAIR.dax.neck=pairFrame(-6.6,-.8,.05,.7);
    c.save(); c.translate(-6.6,-4.6); c.rotate(.12); c.scale(.7,.7); daxFace(c,h,{eyes:'closed',mouth:'smile',ears:'back',t}); c.restore();
    c.save(); for(let k=0;k<3;k++){ const ph=(t*.5+k/3)%1; c.globalAlpha=Math.sin(ph*Math.PI)*.9; c.fillStyle='#cfe6ff'; c.font='bold '+(3+ph*2.5)+'px system-ui'; c.fillText('z',8+ph*5,-11-ph*9); } c.restore();
    return; }
  if(play){ // a play bow together: chests down, rumps up, tails going, little paw prints
    const k=(now-PAIR.playT)/2400, b=Math.abs(Math.sin(k*Math.PI*6))*1.4;
    c.save(); for(let i=0;i<6;i++){ c.globalAlpha=.28; c.fillStyle='#e8d8c8'; c.beginPath(); c.ellipse(-8+i*3.4,.7,.9,.45,0,0,7); c.fill(); } c.restore();
    c.save(); c.translate(0,-b); el(DAX_X-1.6,-6.6,3,3,DXC.BK); ln([DAX_X-3.4,-8,DAX_X-6.4,-11+Math.sin(t*24)*1.6],DXC.BK,.9); el(DAX_X+.6,-3.4,3.8,2.6,DXC.BK); el(DAX_X+1.4,-.6,3,.8,DXC.BK2); el(DAX_X+.9,-3.6,.8,1.6,DXC.WH);
    PAIR.dax.head=pairFrame(DAX_X+.9,-6.4-b,.3,.8); PAIR.dax.neck=pairFrame(DAX_X+.9,-2.4-b,.1,.8);
    c.save(); c.translate(DAX_X+.9,-6.4); c.rotate(.3); c.scale(.8,.8); daxFace(c,h,{eyes:'happy',mouth:'tongue',ears:'perk',t,look:1}); c.restore(); c.restore();
    c.save(); c.translate(0,-Math.abs(Math.sin(k*Math.PI*6+1.4))*1.4); el(NIKO_X+1.8,-7.2,3.2,3.2,NKC.CR); ln([NIKO_X+3.8,-8.6,NIKO_X+7,-11.6+Math.sin(t*24+1)*1.6],NKC.CR2,1); el(NIKO_X-.6,-3.6,4,2.7,NKC.CR); el(NIKO_X-1.4,-.6,3.2,.8,NKC.WH); el(NIKO_X-.8,-3.6,2.2,1.8,NKC.WH);
    const nb=-Math.abs(Math.sin(k*Math.PI*6+1.4))*1.4; PAIR.niko.head=pairFrame(NIKO_X-.6,-7+nb,-.3,.86); PAIR.niko.neck=pairFrame(NIKO_X-.6,-2.6+nb,-.1,.86);
    c.save(); c.translate(NIKO_X-.6,-7); c.rotate(-.3); c.scale(.86,.86); nikoFace(c,h,{eyes:'happy',mouth:'tongue',ears:'perk',t,look:-1}); c.restore(); c.restore();
    c.save(); c.globalAlpha=Math.max(0,1-k)*.9; c.fillStyle='#ff8ab8'; const hy=-17-k*6; c.beginPath(); c.moveTo(1,hy+1.6); c.bezierCurveTo(-1.6,hy,-.8,hy-1.8,1,hy-.6); c.bezierCurveTo(2.8,hy-1.8,3.6,hy,1,hy+1.6); c.fill(); c.restore();
    return; }
  // sitting side by side, facing you, like in their photo
  if(cape){ pairCape(c,DAX_X,-12,3.6,cape,t); pairCape(c,NIKO_X,-14,4,cape,t); }
  const wag=petted||yip||watching||boop?22:8, jit=shiver?Math.sin(t*60)*.28:0, yk=(now-PAIR.yipT)/1600;
  const look=watching?1:0;
  const dHop=yip?Math.max(0,Math.sin(yk*Math.PI*3))*2.2:petted?Math.max(0,Math.sin(now/120))*.7:0;
  const nHop=petted?Math.max(0,Math.sin(now/120+1))*.7:0;
  daxSit(c,h,DAX_X,{t,wag,jit,hop:dHop,paw,hx:boop?1.6:0,hy:boop?.6:0,rot:boop?.32:tilt?-.42:petted?.14:-.1+Math.sin(t*1.3)*.05,
    face:{eyes:petted?'happy':'open',mouth:(petted||watching||paw||yip)?'tongue':'smile',ears:petted?'back':(watching||yip||tilt)?'perk':'out',blink,t,look}});
  nikoSit(c,h,NIKO_X,{t,wag,jit:jit*.8,hop:nHop,hx:boop?-1.2:0,hy:boop?.5:0,rot:boop?-.26:petted?-.12:.06+Math.sin(t*1.1+1)*.05,
    face:{eyes:petted?'happy':'open',mouth:yip?'yip':(petted||watching)?'tongue':'smile',ears:petted?'back':(watching||yip)?'perk':'up',twitch,blink,t,look}});
  if(boop){ const k=PAIR.force?.45:((t%23)-15)/2.2; c.save(); c.globalAlpha=Math.sin(Math.min(1,k)*Math.PI)*.95; c.fillStyle='#ff8ab8'; const hy=-21-k*4, hx=1.2; c.beginPath(); c.moveTo(hx,hy+1.4); c.bezierCurveTo(hx-1.5,hy,hx-.8,hy-1.6,hx,hy-.5); c.bezierCurveTo(hx+.8,hy-1.6,hx+1.5,hy,hx,hy+1.4); c.fill(); c.restore(); }
  if(yip){ c.save(); c.globalAlpha=Math.min(1,(1-yk)*3); c.fillStyle='rgba(255,255,255,.95)'; c.beginPath(); c.ellipse(13,-27,6.4,3.8,0,0,7); c.fill(); c.beginPath(); c.moveTo(10.4,-24.4); c.lineTo(9,-21); c.lineTo(12.6,-24); c.fill();
    c.fillStyle='#1b1513'; c.font='bold 4.4px system-ui'; c.textAlign='center'; c.fillText('Yip!',13,-25.6); c.restore(); } }
// their gear: the same hat and accessory on both (matching!), each in its own head and neck frame;
// the star balloon is tied to Niko only, so there is never a tangle
function drawPairGear(c,lk,t){ const keep=[LILY.head,LILY.neck];
  for(const d of [PAIR.dax,PAIR.niko]){ if(!d.head||!d.neck) continue; LILY.head=d.head; LILY.neck=d.neck; drawLilyGear(c,(lk.acc==='balloon'&&d!==PAIR.niko)?Object.assign({},lk,{acc:'none'}):lk,t); }
  LILY.head=keep[0]; LILY.neck=keep[1]; }
// ---------- gift ----------
const PAIR_PATCH = {v:'DaxNiko', label:'A gift for Zac 🐾', name:'Dax & Niko have joined you!', items:[
  'Dax and Niko are here, drawn from a photo of the real pair: Dax with his black scruffy coat, folded ear tips, greying muzzle and little white chest blaze, and Niko with his cream coat, big pink-lined ears, white blaze and white paws.',
  'They are the first double pet in Driftline: one of a kind and only for you. Nobody else can get them.',
  'They sit side by side on the dock facing you, just like in their photo, and count as one pet: they are your ★ favourite and give +12% XP together.',
  'Watch Niko’s ear twitch, Dax’s head tilt, and the moment they boop noses (look for the little heart).',
  'Pet them and their ears go back and their tongues come out. Every third pet, they do a play bow together.',
  'Dax gives you his paw now and then. When you land a fish, Niko yips and Dax hops.',
  'They perk up and watch the water while you fish. On cold water they shiver a little (they are Chihuahuas, after all).',
  'At night they curl up and nap together.',
  'Dress them up in the Pets tab: colours, accessories and hats. They always match.' ]};
const _redeemGift_pair = redeemGift;
redeemGift = function(code){ const k=String(code||'').toUpperCase().replace(/[^A-Z0-9]/g,'');
  if(k && btoa(k)==='WkFDU1BVUFM='){
    if(S.owned.pets.includes('daxniko')){ toast('Dax and Niko are already with you. They say hi.'); return 'skip'; }
    S.owned.pets.push('daxniko'); petLook('daxniko').name='Dax & Niko'; setFav('daxniko'); setTab('pets'); sfx.shiny(); save();
    setTimeout(()=>showPatchNotes(PAIR_PATCH),250); return 'render'; }
  return _redeemGift_pair(code); };
// test sheet: the pair in every moment, with accessories or hats
if(/[?&]test\b/.test(location.search)){
  window.__pairSheet=(opts={})=>{ const poses=opts.poses||['sit','tilt','boop','paw','twitch','petted','yip','watch','shiver','play','sleep'];
    const accs=opts.accs||['none','bandana','bow','bowtie','scarf','bell','flower','glasses','cape','balloon','partyhat'];
    const cw=opts.cell||150, ch=Math.round(cw*.8), sc=cw/42; const rows=opts.hats||accs; const o=document.createElement('canvas'); o.width=cw*poses.length; o.height=ch*rows.length; const x=o.getContext('2d'); const t=performance.now()/1000;
    rows.forEach((a,r)=>poses.forEach((p,cI)=>{ PAIR.force=p; const lk=Object.assign({},petLook('daxniko'),opts.hats?{acc:'none',hat:a,hatCol:'#3f7a6a'}:{acc:a,accCol:'#d8303a',hat:opts.hat||'none',hatCol:'#3f7a6a'});
      x.save(); x.beginPath(); x.rect(cI*cw,r*ch,cw,ch); x.clip(); x.fillStyle=(r+cI)%2?'#2e3858':'#283150'; x.fillRect(cI*cw,r*ch,cw,ch); drawPetStyled(x,'daxniko',cI*cw+cw*.46,r*ch+ch*.88,sc,t,0,lk); x.restore();
      x.fillStyle='#cfd8ff'; x.font='10px system-ui'; x.fillText(p+' / '+a,cI*cw+4,r*ch+12); }));
    PAIR.force=null; window.__post(opts.save||'pair',o.toDataURL()); return rows.length*poses.length; };
}
