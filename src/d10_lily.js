
// =====================================================================
// Lily: an exclusive pet for Cam (gift code only), drawn from a photo of the
// real Lily: a fluffy tricolour mini Aussie. Warm brown-black coat with
// reddish sun-lit strands, rusty chestnut tan, creamy white. Asymmetric face:
// a white blaze from the crown, narrow between the eyes, into a white muzzle;
// a big tan cheek on her right, a stronger tan eyebrow on her left; big dark
// brown glossy eyes; a big black nose; wispy floppy ears; a huge white fluffy
// chest with a rusty fringe where the black meets the white. She sits facing
// you, like in the photo. Her own animations: head tilts, sniffing, giving
// paw, zoomies (with paw prints), belly-up rolls when petted, a "Boof!" when
// a fish is landed, and naps at night.
// =====================================================================
const LILY={seenPet:null, pets:0, rollT:-9999, boofT:-9999, lastSt:'', pose:'sit', hdx:0, hdy:0};
const LC={BK:'#1c1411', BK2:'#2b1e18', HI:'#5b3a27', HI2:'#7a4a2c', WH:'#efe8de', WH2:'#cfc5b9', WH3:'#b9aea2', TN:'#a5602f', TN2:'#c47b40', RIM:'#4a2a18', IRIS:'#2c180d', NOSE:'#0b0807', PK:'#f08a98'};
// Lily's face, looking at you, centred on (0,0), radius ~5.2.
// o: {eyes:'open'|'happy'|'closed', mouth:'smile'|'tongue'|'boof', ears:'out'|'perk'|'back', blink, sniff, t}
function lilyFace(c,h,o){ const {el,ci,ln}=h; const L=LC, t=o.t||0;
  const strand=(x1,y1,x2,y2,col,w)=>ln([x1,y1,x2,y2],col,w||.32);
  // ears: black, half-folded, long wispy fringe (her right one floppier)
  const ear=(s)=>{ if(o.ears==='perk'){ el(s*4.4,-3.8,1.9,3.3,L.BK,s*.45); strand(s*5.4,-6,s*6.2,-6.8,L.HI); }
    else if(o.ears==='back'){ el(s*5.1,.2,1.8,3.6,L.BK,s*1.25); }
    else { const fl=s<0?.15:0; el(s*4.8,-.8+fl*4,2,3.9,L.BK,s*(.9+fl)); el(s*5.9,2+fl*3,1.3,1.4,L.BK2); for(let i=0;i<3;i++) strand(s*(5.2+i*.5),2.4+fl*3+i*.3,s*(5.8+i*.7),3.8+fl*3+i*.5,i%2?L.HI:L.BK2,.4); el(s*3.6,1.6,.9,1.2,L.TN,s*.4); } };
  ear(-1); ear(1);
  // head: warm black, fluffy outline, reddish sun-lit strands
  ci(0,0,5.2,L.BK); el(0,2.6,4.8,3.2,L.BK);
  for(let i=0;i<8;i++){ const a=-Math.PI*.98+i*Math.PI*.14; el(Math.cos(a)*5,Math.sin(a)*5,1.1,.8,L.BK,a); }
  strand(-3.4,-2.6,-4.1,-1.2,L.HI); strand(3.6,-2.2,4.3,-.9,L.HI); strand(-2.8,-4,-3.6,-3.2,L.HI2,.25); strand(3,-4.1,3.9,-3.3,L.HI2,.25);
  strand(-1.4,-5,-1.8,-6.1+Math.sin(t*2)*.15,L.HI,.32); strand(.9,-5.2,1.3,-6.2+Math.sin(t*2+1)*.15,L.BK2,.34); strand(2.6,-4.6,3.2,-5.5,L.HI,.28); // flyaways
  // white blaze: from the crown (wider, leaning to her right), narrow between the eyes, into the muzzle
  c.fillStyle=L.WH; c.beginPath(); c.moveTo(-1.5,-5.1); c.quadraticCurveTo(0,-5.6,1,-5.1); c.lineTo(.45,-2.6); c.lineTo(.75,-.4); c.lineTo(-.75,-.4); c.lineTo(-.5,-2.6); c.closePath(); c.fill();
  strand(-.9,-4.9,-1.2,-4.2,L.WH2,.25);
  // tan: big cheek on her right (your left), smaller on her left; eyebrows (stronger on her left); jaw edges
  el(-3.1,1.2,1.5,1.9,L.TN,.35); el(3.4,2.6,.9,1,L.TN,-.3);
  // white muzzle, a little more white under her left eye, grey shading
  el(.15,2.2,3.7,2.7,L.WH); el(1.9,.6,1.5,1.3,L.WH); el(-1.6,.9,1,1,L.WH); el(0,4.4,2.6,1.6,L.WH); el(.2,3.6,2,1,L.WH2); el(2.6,1.4,.8,.7,"#e2dace");
  el(-2,-3.05,.62,.46,L.TN,.2); el(2.15,-3.15,.86,.6,L.TN2,-.2);
  // eyes: big, dark brown, glossy, with a warm rim
  if(o.eyes==='happy'){ c.strokeStyle=L.NOSE; c.lineWidth=.55; c.beginPath(); c.arc(-2,-.9,.95,Math.PI*1.1,Math.PI*1.9); c.stroke(); c.beginPath(); c.arc(2,-.9,.95,Math.PI*1.1,Math.PI*1.9); c.stroke(); }
  else if(o.eyes==='closed'||o.blink){ ln([-2.9,-1,-1.1,-.85],L.NOSE,.5); ln([1.1,-.85,2.9,-1],L.NOSE,.5); }
  else { for(const s of [-1,1]){ const ex=s*2; ci(ex,-1.1,1.3,L.RIM); ci(ex,-1.05,1.08,L.IRIS); ci(ex,-1,.62,'#0a0605'); }
    c.fillStyle='rgba(255,255,255,.92)'; c.beginPath(); c.arc(-1.6,-1.55,.38,0,7); c.arc(2.4,-1.55,.38,0,7); c.fill();
    c.fillStyle='rgba(255,255,255,.45)'; c.beginPath(); c.arc(-2.35,-.6,.18,0,7); c.arc(1.65,-.6,.18,0,7); c.fill(); }
  // big black glossy nose (wiggles when sniffing)
  const nw=o.sniff?Math.sin(t*30)*.18:0; el(.15+nw,1.05,1.65,1.15,L.NOSE); ci(-.45+nw,1.35,.32,'#000'); ci(.75+nw,1.35,.32,'#000');
  c.fillStyle='rgba(255,255,255,.4)'; c.beginPath(); c.ellipse(-.25+nw,.62,.55,.25,-.2,0,7); c.fill();
  // mouth
  if(o.mouth==='boof') el(.15,3.6,1.4,1.1,'#3a1a18');
  else { c.strokeStyle='#7a6058'; c.lineWidth=.3; c.beginPath(); c.arc(-.35,2.75,.5,.25,Math.PI*.8); c.moveTo(1.15,2.95); c.arc(.65,2.75,.5,.25,Math.PI*.8); c.stroke();
    if(o.mouth==='tongue') el(.15,4.1+Math.sin(t*14)*.15,.85,1.35,L.PK); }
  ci(-1.6,2.3,.12,L.WH3); ci(-1.9,2.7,.12,L.WH3); ci(1.9,2.3,.12,L.WH3); ci(2.2,2.7,.12,L.WH3); // whisker dots
}
function drawLily(c,t,h){ const {el,ci,rc,ln,blink}=h; const L=LC;
  const strand=(x1,y1,x2,y2,col,w)=>ln([x1,y1,x2,y2],col,w||.32);
  const now=performance.now(), pt=S.pet==='lily'?petT:(S.pet2==='lily'?petT2:-9999);
  if(LILY.seenPet===null) LILY.seenPet=pt; else if(pt!==LILY.seenPet){ LILY.seenPet=pt; LILY.pets++; if(LILY.pets%3===0) LILY.rollT=now; }
  if(G.st==='landing'&&LILY.lastSt!=='landing') LILY.boofT=now; LILY.lastSt=G.st;
  let petted=now-pt<2200, rolling=now-LILY.rollT<1900, boof=now-LILY.boofT<1600, watching=G.st==='reeling'||G.st==='bite'||G.st==='waiting';
  let sleep=PET_NIGHT>.55&&!petted&&!boof&&!watching&&!rolling;
  let busy=petted||boof||rolling||watching;
  let zc=t%28, zoom=!sleep&&!busy&&zc>20&&zc<21.8;
  let sniff=!zoom&&!busy&&(t%13)>10.6&&(t%13)<11.9, paw=!zoom&&!busy&&!sniff&&(t%17)>8&&(t%17)<9.4;
  let bigTilt=!sniff&&!paw&&(t%7)>5.3&&(t%7)<6.7;
  if(LILY.force){ const f=LILY.force; petted=f==="petted"; rolling=f==="roll"; boof=f==="boof"; watching=f==="watch"; sleep=f==="sleep"; zoom=f==="zoomR"||f==="zoomL"; sniff=f==="sniff"; paw=f==="paw"; bigTilt=f==="tilt"; busy=petted||boof||rolling||watching; if(zoom) zc=20+(f==="zoomR"?.06:.4)*1.8; if(rolling) LILY.rollT=now-500; if(boof) LILY.boofT=now-300; }
  const wag=petted||zoom||watching||boof||rolling||paw?24:9;
  LILY.hdx=0; LILY.hdy=0;
  const cape=LILY.lk&&LILY.lk.acc==='cape'?(LILY.lk.accCol||'#d8303a'):null, cw=Math.sin(t*3.2)*.8;
  const capeShape=(pts,col)=>{ c.fillStyle=col; c.beginPath(); c.moveTo(pts[0],pts[1]); for(let i=2;i<pts.length;i+=4) c.quadraticCurveTo(pts[i],pts[i+1],pts[i+2],pts[i+3]); c.closePath(); c.fill(); };
  if(rolling){ LILY.pose='roll'; const w=Math.sin(now/80), k=(now-LILY.rollT)/1900; // belly up for rubs
    LILY.head={x:10,y:-5.2,rot:2.2+w*.08,s:.92,flip:false}; LILY.neck=lilyFramePoint(LILY.head,0,6,true);
    if(cape){ capeShape([-9,-1.2, 1,2.2,12,-1, 11,-4.5,9,-6.5, 0,-4.6,-8,-6.5],cape); capeShape([-9,-1.2, 1,2.2,12,-1, 1,1.2,-9,-1.2],mix(cape,'#000000',.25)); }
    el(-9.2,-2.2,1.6,1.3,L.BK2,w*.3);
    el(0,-4.6,8.6,4.4,L.BK); el(.8,-6.6,6.2,2.9,L.WH); el(-4.6,-6,1.4,2,L.TN,.3); el(6,-6,1.4,2,L.TN,-.3); strand(-3,-7.4,-2.4,-8.6,L.WH2); strand(2,-7.8,2.6,-9,L.WH2);
    for(let i=0;i<4;i++){ const lx=-5+i*3.4, ly=-11.6+Math.sin(now/70+i*1.7)*1.1, kx=lx+(i%2?.9:-.9), front=i>=2; c.lineCap="round"; c.strokeStyle=front?L.WH:L.BK; c.lineWidth=3; c.beginPath(); c.moveTo(lx,-7); c.quadraticCurveTo(kx,-9.4,lx+.5,ly+1.2); c.stroke(); if(!front){ c.strokeStyle=L.WH; c.lineWidth=2.8; c.beginPath(); c.moveTo(kx*.5+lx*.5+.2,-9.9); c.lineTo(lx+.5,ly+1.2); c.stroke(); } el(lx+.5,ly,1.6,1.25,L.WH); el(lx+.5,ly+.3,.75,.5,L.PK); ci(lx-.4,ly-.7,.32,L.PK); ci(lx+.5,ly-.95,.32,L.PK); ci(lx+1.4,ly-.7,.32,L.PK); } c.lineCap="butt";
    c.save(); c.translate(10,-5.2); c.rotate(2.2+w*.08); c.scale(.92,.92); lilyFace(c,h,{eyes:'happy',mouth:'tongue',ears:'out',t}); c.restore();
    c.save(); for(let i=0;i<4;i++){ const a=i*1.6+k*4, r=9+k*4; c.globalAlpha=Math.max(0,.9-k)*(.6+.4*Math.sin(now/90+i)); c.fillStyle='#ffe58a'; const sx=2+Math.cos(a)*r, sy=-8+Math.sin(a)*r*.5; c.beginPath(); c.moveTo(sx,sy-1.2); c.lineTo(sx+.35,sy-.35); c.lineTo(sx+1.2,sy); c.lineTo(sx+.35,sy+.35); c.lineTo(sx,sy+1.2); c.lineTo(sx-.35,sy+.35); c.lineTo(sx-1.2,sy); c.lineTo(sx-.35,sy-.35); c.fill(); } c.restore();
    return; }
  if(sleep){ LILY.pose='sleep'; const br=Math.sin(t*1.6)*.3; // curled up napping, chin on her white paws
    LILY.head={x:8.6,y:-5.6,rot:.12,s:.85,flip:false}; LILY.neck=lilyFramePoint(LILY.head,0,6,true);
    // bob tail: a short fluffy stub at her rump (mini Aussies have no long tail)
    el(-8.6,-3.4,1.7,1.4,L.BK2,.2); strand(-9.6,-3.8,-10.3,-4.4,L.HI,.28);
    // curled body: one smooth, low loaf with a rounded haunch, the fur lying flat along her back (no tufts sticking up)
    el(-4.6,-3.9,4.4,3.7+br*.6,L.BK); el(.6,-4,8.4,3.9+br,L.BK); el(-1,-6.6,7.4,1.6,L.BK);
    strand(-6.8,-6.9,-3.6,-7.7,L.HI,.3); strand(-2.4,-8,1.2,-8.3,L.HI2,.26); strand(2.2,-7.9,5,-7.4,L.HI,.28); strand(-5.6,-3.4,-3.4,-5.4,L.HI,.26);
    // hind paw tucked under her side, peeking out white with a touch of tan
    el(-3.2,-.55,2.3,.85,L.WH); el(-4.4,-.9,.9,.5,L.TN);
    if(cape){ capeShape([-7.5,-6.2-br*.5, -1,-10.4-br,6,-7.6-br*.5, 6.4,-5,5.6,-2.8, -.5,-4.4,-6.8,-2.6],cape); capeShape([-6.8,-2.6, -.5,-4.4,5.6,-2.8, -.5,-3.2,-6.8,-2.6],mix(cape,'#000000',.3)); c.strokeStyle=mix(cape,'#ffffff',.3); c.lineWidth=.35; c.beginPath(); c.moveTo(-6.8,-3); c.quadraticCurveTo(-.5,-4.8,5.6,-3.2); c.stroke(); }
    // white chest, and both front paws stretched out under her chin
    el(5.4,-3.4,3.4,2.8,L.WH); el(3.4,-4.6,1.2,2,L.TN,.3);
    el(8.2,-1,3.4,1.05,L.WH); el(9,-.35,3,.9,L.WH2); el(11.2,-1.05,1.15,.85,L.WH); el(11.7,-.4,1.1,.8,L.WH); ln([10.9,-1.6,10.9,-.6],L.WH3,.2); ln([11.6,-1,11.6,-.1],L.WH3,.2);
    c.save(); c.translate(8.6,-5.6); c.rotate(.12); c.scale(.85,.85); lilyFace(c,h,{eyes:'closed',mouth:'smile',ears:'out',t}); c.restore();
    c.save(); for(let k=0;k<3;k++){ const ph=(t*.5+k/3)%1; c.globalAlpha=Math.sin(ph*Math.PI)*.9; c.fillStyle='#cfe6ff'; c.font='bold '+(3+ph*2.5)+'px system-ui'; c.fillText('z',12+ph*5,-12-ph*9); } c.restore();
    return; }
  if(zoom){ LILY.pose='zoom'; // running side-on, paw prints behind her
    const ph=(zc-20)/1.8, dx=Math.sin(ph*Math.PI*3)*11, flip=Math.cos(ph*Math.PI*3)<0;
    c.save(); for(let i=1;i<=5;i++){ const pp=ph-i*.05; if(pp<0) continue; const px=Math.sin(pp*Math.PI*3)*11; c.globalAlpha=.32-i*.05; c.fillStyle='#e8d8c8'; c.beginPath(); c.ellipse(px+(i%2?1.4:-1.4),.6,1,.5,0,0,7); c.fill(); } c.restore();
    const hop=Math.abs(Math.sin(t*18))*1.6, lg=Math.sin(t*22)*1.8;
    LILY.head={x:dx+(flip?-8.6:8.6),y:-hop-14.2,rot:-.1,s:1,flip}; LILY.neck=lilyFramePoint(LILY.head,0,6,true);
    c.save(); c.translate(dx,-hop); if(flip) c.scale(-1,1);
    if(cape){ const wv=Math.sin(t*16)*1.2; capeShape([5.5,-13.8, -3,-16.5+wv,-13.5,-11+wv, -12.6,-6.4+wv,-11.4,-5.6+wv, -3,-8,5,-9.6],cape); capeShape([5,-9.6, -3,-8,-11.4,-5.6+wv, -3,-9.4,5,-10.8],mix(cape,'#000000',.28)); }
    el(-9,-10,1.7,1.4,L.BK2,Math.sin(t*24)*.3);
    for(const [x,s] of [[-6,1],[-3.2,-1],[.6,1],[3.6,-1]]){ const xx=x+lg*s; rc(xx,-5,2.6,5,x<0?L.BK:L.WH); rc(xx,-2.4,2.6,1,L.TN); rc(xx,-1.4,2.6,1.6,L.WH); }
    el(-.5,-8.4,8.6,5,L.BK); el(-1,-11.6,7.6,1.7,L.BK); strand(-6.6,-12,-3.4,-12.9,L.HI,.3); strand(-2,-13.1,1.6,-13.3,L.HI2,.26); strand(2.4,-12.9,5.2,-12.3,L.HI,.28);
    el(4.2,-8.6,1.4,4.4,L.TN,-.2); el(5.8,-8.4,3.6,5,L.WH);
    c.save(); c.translate(8.6,-14.2); c.rotate(-.1); lilyFace(c,h,{eyes:'open',mouth:'tongue',ears:'back',blink,t}); c.restore();
    c.restore(); return; }
  // ---- sitting, facing you (like the photo) ----
  LILY.pose='sit';
  const hop = boof ? Math.max(0,Math.sin((now-LILY.boofT)/1600*Math.PI*3))*2.4 : petted ? Math.max(0,Math.sin(now/120))*.8 : 0, br=Math.sin(t*2.2)*.25;
  c.save(); c.translate(0,-hop);
  // a cape hangs from her shoulders behind her body, swaying
  if(cape){ capeShape([-1.8,-14.8, -6.4,-9+cw,-8.4,-1.2+cw*.6, -4,-1.6,1,-2.4, 3,-2.2,5,-2.4, 10,-1.6,14.4,-1.2-cw*.6, 12.4,-9-cw,7.8,-14.8, 3,-16,-1.8,-14.8],cape);
    capeShape([-8.4,-1.2+cw*.6, -4,-1.6,1,-2.4, -3,-5,-5.6,-8+cw],mix(cape,'#000000',.28)); capeShape([14.4,-1.2-cw*.6, 10,-1.6,5,-2.4, 9,-5,11.6,-8-cw],mix(cape,'#000000',.28)); }
  // bob tail: a short fluffy stub that wiggles (no long tail on a mini Aussie)
  const tw=Math.sin(t*wag)*.5; el(10.2,-2.9,1.7,1.4,L.BK2,tw*.5); strand(11.2,-3.6,11.8,-4.2+tw*.4,L.HI,.28);
  // haunches and hind paws
  el(-2.6,-3.6,4.4,3.8,L.BK); el(8.6,-3.6,4.4,3.8,L.BK); strand(-5.6,-5,-6.6,-4,L.HI); strand(11.6,-5,12.6,-4,L.HI);
  el(-5.4,-.7,2.1,1,L.WH); el(11.4,-.7,2.1,1,L.WH); el(-4.4,-1.6,1.2,.7,L.TN); el(10.4,-1.6,1.2,.7,L.TN);
  // shoulders: warm black with sun-lit strands
  el(3,-9.6,6.4,7.4+br,L.BK); for(let i=0;i<6;i++){ const a=Math.PI*(.95+i*.12); el(3+Math.cos(a)*6.3,-10+Math.sin(a)*7,1.2,.9,L.BK,a); }
  strand(-2.6,-11,-3.4,-9.4,L.HI); strand(-1.8,-13.4,-2.8,-12.4,L.HI2,.26); strand(8.6,-11,9.4,-9.4,L.HI); strand(7.8,-13.4,8.8,-12.4,L.HI2,.26);
  // rusty fringe where the black meets the white chest
  el(-.2,-8.4,.9,3.4,L.TN,.18); el(6.2,-8.4,.9,3.4,L.TN,-.18); strand(-.6,-10.6,-1,-8.6,L.HI2,.3); strand(6.6,-10.6,7,-8.6,L.HI2,.3);
  // big white fluffy chest, up to the chin, with soft grey shading and a scalloped edge
  el(3,-9.8,4.4,6.6+br,L.WH); el(3,-6.4,3.4,2.8,L.WH2); el(3,-7.2,3,2.4,L.WH);
  for(let i=0;i<5;i++) el(.6+i*1.2,-3.6+Math.abs(i-2)*-.4,.8,.9,L.WH);
  for(let i=0;i<5;i++) strand(1.2+i*.9,-12+i*.2,1.4+i*.9,-9.6+i*.3,L.WH2,.26);
  // front legs: white with a little tan at the elbows; one lifts to give paw
  const leg=(x,lift)=>{ if(lift){ c.save(); c.translate(5.6,-7.6); c.rotate(-.5+Math.sin(t*6)*.1); rc(-1.25,-5.2,2.5,5.6,L.WH); el(0,.2,1.5,1,L.WH); el(-.2,-1,.9,.6,L.TN2); el(0,-5.4,1.75,1.4,L.WH); el(0,-5.1,.85,.6,L.PK); ci(-.95,-6.2,.34,L.PK); ci(0,-6.55,.34,L.PK); ci(.95,-6.2,.34,L.PK); c.restore(); return; }
    rc(x,-6,2.4,6,L.WH); ln([x+.8,-.2,x+.8,-.9],L.WH3,.25); ln([x+1.6,-.2,x+1.6,-.9],L.WH3,.25); };
  leg(-.3,false); leg(3.9,paw);
  // head on top, looking at you, with her head tilt
  const hy=-17.4+(sniff?2.6:0)+(watching||boof?-.6:0), hx=3+(sniff?1.2:0), tilt=sniff?.28:petted?.14:boof?-.06:paw?-.2:bigTilt?-.48:-.15+Math.sin(t*1.3)*.06;
  LILY.hdx=hx-3; LILY.hdy=hy+17.4;
  LILY.head={x:hx,y:hy-hop,rot:tilt,s:1.14,flip:false}; LILY.neck={x:hx,y:hy-hop+6.6*1.14,rot:tilt*.35,s:1.14,flip:false};
  c.save(); c.translate(hx,hy); c.rotate(tilt); c.scale(1.14,1.14);
  lilyFace(c,h,{eyes:petted?'happy':'open', mouth:boof?'boof':(petted||watching||paw)?'tongue':'smile', ears:petted?'back':(watching||boof||bigTilt)?'perk':'out', blink, sniff, t});
  c.restore(); c.restore();
  if(boof){ const k=(now-LILY.boofT)/1600; c.save(); c.globalAlpha=Math.min(1,(1-k)*3); c.fillStyle='rgba(255,255,255,.95)'; c.beginPath(); c.ellipse(12,-27-hop,7.5,4.2,0,0,7); c.fill(); c.beginPath(); c.moveTo(9,-24); c.lineTo(8,-20.5); c.lineTo(11.5,-23.6); c.fill();
    c.fillStyle='#1b1513'; c.font='bold 4.6px system-ui'; c.textAlign='center'; c.fillText('Boof!',12,-25.4-hop); c.restore(); } }

// ---------- gift code ----------
const LILY_PATCH = {v:'Lily', label:'A gift for Cam 🐾', name:'Lily has joined you!', items:[
  'Lily is here, drawn from a photo of the real Lily: her warm black coat, white blaze, rusty tan eyebrows and cheeks, big brown eyes, floppy ears and that huge fluffy white chest. One of a kind and only for you: nobody else can get her.',
  'She sits facing you on the dock, just like in her photo.',
  'She’s now your ★ favourite and gives +12% XP, a little more than any shop pup.',
  'Watch for her famous head tilt when she’s curious, and her sniffing around the dock.',
  'Pet her and her ears go back, her eyes go happy and her tongue comes out. Every third pet, she rolls over for belly rubs (with sparkles).',
  'She gives you her paw, and every now and then she gets the zoomies (watch for the little paw prints).',
  'She perks up and watches the water while you fish, and boofs when you land one.',
  'At night she curls up and naps beside you. She’s wide awake again the moment you pet her.',
  'Dress her up like any pet in the Pets tab: colours, accessories and hats.' ]};
function redeemGift(code){ code=String(code||'').toUpperCase().replace(/[^A-Z0-9]/g,'');
  if(!code){ toast('Type a gift code first.'); return 'skip'; }
  if(btoa(code)==='TElMWVBBV1M='){
    if(S.owned.pets.includes('lily')){ toast('Lily is already with you. She says hi.'); return 'skip'; }
    S.owned.pets.push('lily'); petLook('lily').name='Lily'; setFav('lily'); setTab('pets'); sfx.shiny(); save();
    setTimeout(()=>showPatchNotes(LILY_PATCH),250); return 'render'; }
  toast('That gift code didn’t work. Check the spelling.'); return 'skip'; }

// ---------- Lily's gear: every hat and accessory is drawn in her head (or neck) frame for the pose
// she is in, so it moves, tilts and flips with her and never disappears. Her face looks at you, so
// glasses, bows and flowers are placed for a front-facing face. The cape is drawn inside drawLily,
// behind her body (or over her back while she sleeps).
function lilyFramePoint(f,px,py,asFrame){ const s=f.s, cr=Math.cos(f.rot), sr=Math.sin(f.rot); let x=(px*cr-py*sr)*s, y=(px*sr+py*cr)*s; if(f.flip) x=-x;
  const p={x:f.x+x,y:f.y+y}; return asFrame?{x:p.x,y:p.y,rot:f.rot,s:f.s,flip:f.flip}:p; }
function lilyApply(c,f){ c.translate(f.x,f.y); if(f.flip) c.scale(-1,1); c.rotate(f.rot); c.scale(f.s,f.s); }
function drawLilyGear(c,lk,t){
  const hd=LILY.head, nk=LILY.neck; if(!hd||!nk) return; const col=lk.accCol||'#d8303a', dk=mix(col,'#000000',.3), lt=mix(col,'#ffffff',.35);
  c.save(); c.lineCap='round'; c.lineJoin='round';
  // neckwear (neck frame)
  if(['bandana','scarf','bowtie','bell','cape'].includes(lk.acc)){ c.save(); lilyApply(c,nk);
    if(lk.acc==='bandana'){ c.fillStyle=col; c.beginPath(); c.moveTo(-3.5,-.6); c.quadraticCurveTo(0,.4,3.5,-.6); c.lineTo(.4,3.6); c.quadraticCurveTo(0,4,-.4,3.6); c.closePath(); c.fill(); c.fillStyle=lt; for(const [x,y] of [[-1.6,.4],[1.2,.6],[0,1.9],[-.4,.2],[.8,2.8]]){ c.beginPath(); c.arc(x,y,.28,0,7); c.fill(); } c.fillStyle=dk; c.beginPath(); c.ellipse(-3.3,-.5,.7,.5,0,0,7); c.fill(); }
    if(lk.acc==='scarf'){ c.fillStyle=col; c.beginPath(); c.moveTo(-3.7,-1); c.quadraticCurveTo(0,.2,3.7,-1); c.lineTo(3.7,.6); c.quadraticCurveTo(0,1.8,-3.7,.6); c.closePath(); c.fill(); c.beginPath(); c.moveTo(1.2,.8); c.lineTo(3,.7); c.lineTo(2.6,4.6); c.lineTo(1.6,4.4); c.closePath(); c.fill(); c.strokeStyle=dk; c.lineWidth=.3; c.beginPath(); c.moveTo(-3.4,.1); c.quadraticCurveTo(0,1.2,3.4,.1); c.moveTo(1.7,3.9); c.lineTo(2.6,4); c.stroke(); }
    if(lk.acc==='bowtie'){ c.fillStyle=col; c.beginPath(); c.moveTo(0,.4); c.lineTo(-2,-.8); c.quadraticCurveTo(-2.4,.4,-2,1.6); c.closePath(); c.moveTo(0,.4); c.lineTo(2,-.8); c.quadraticCurveTo(2.4,.4,2,1.6); c.closePath(); c.fill(); c.fillStyle=dk; c.beginPath(); c.ellipse(0,.4,.55,.65,0,0,7); c.fill(); }
    if(lk.acc==='bell'){ c.strokeStyle=col; c.lineWidth=.9; c.beginPath(); c.moveTo(-3.6,-.6); c.quadraticCurveTo(0,.6,3.6,-.6); c.stroke(); c.fillStyle='#ffcc33'; c.beginPath(); c.arc(0,1.1,.9,0,7); c.fill(); c.fillStyle='#b8860b'; c.fillRect(-.12,1.2,.24,.6); c.fillStyle='rgba(255,255,255,.7)'; c.beginPath(); c.arc(-.3,.8,.25,0,7); c.fill(); }
    if(lk.acc==='cape'){ c.fillStyle='#e8c060'; c.beginPath(); c.arc(-2.4,-.5,.55,0,7); c.arc(2.4,-.5,.55,0,7); c.fill(); c.strokeStyle=col; c.lineWidth=.6; c.beginPath(); c.moveTo(-2.4,-.5); c.quadraticCurveTo(0,.3,2.4,-.5); c.stroke(); }
    c.restore(); }
  // the star balloon is tied to her collar and floats upright, whatever her pose
  if(lk.acc==="balloon"){ const back=nk.flip?1:-1, tie=lilyFramePoint(nk,3.2*back*(nk.flip?-1:1),.4), bx=tie.x+back*10+Math.sin(t*1.5)*1.2, by=tie.y-19+Math.sin(t*1.1)*.6;
    c.strokeStyle="rgba(235,235,235,.9)"; c.lineWidth=.35; c.beginPath(); c.moveTo(tie.x,tie.y); c.quadraticCurveTo(tie.x+back*8,tie.y-6,bx,by+4.6); c.stroke();
    c.fillStyle='#ffd84a'; c.beginPath(); for(let i=0;i<10;i++){ const a=-Math.PI/2+i*Math.PI/5+Math.sin(t*1.2)*.08, rr=i%2?2.2:4.8; c.lineTo(bx+Math.cos(a)*rr,by+Math.sin(a)*rr); } c.closePath(); c.fill(); c.fillStyle='rgba(255,255,255,.55)'; c.beginPath(); c.ellipse(bx-1.2,by-1.4,.9,.5,-.5,0,7); c.fill(); }
  // head-worn items (head frame)
  c.save(); lilyApply(c,hd);
  if(lk.acc==='glasses'){ c.fillStyle='#14100e'; c.beginPath(); c.ellipse(-2,-1.15,1.55,1.15,0,0,7); c.ellipse(2,-1.15,1.55,1.15,0,0,7); c.fill(); c.strokeStyle='#14100e'; c.lineWidth=.45; c.beginPath(); c.moveTo(-.5,-1.4); c.quadraticCurveTo(0,-1.8,.5,-1.4); c.moveTo(-3.5,-1.3); c.lineTo(-4.6,-1.8); c.moveTo(3.5,-1.3); c.lineTo(4.6,-1.8); c.stroke(); c.fillStyle='rgba(255,255,255,.35)'; c.beginPath(); c.ellipse(-2.5,-1.6,.5,.28,-.4,0,7); c.ellipse(1.5,-1.6,.5,.28,-.4,0,7); c.fill(); }
  if(lk.acc==='bow'){ c.save(); c.translate(-3.7,-3.7); c.rotate(-.35); c.fillStyle=col; c.beginPath(); c.moveTo(0,0); c.quadraticCurveTo(-2.2,-1.6,-2.1,.1); c.quadraticCurveTo(-2,1.5,0,0); c.moveTo(0,0); c.quadraticCurveTo(2.2,-1.6,2.1,.1); c.quadraticCurveTo(2,1.5,0,0); c.fill(); c.fillStyle=dk; c.beginPath(); c.arc(0,0,.55,0,7); c.fill(); c.restore(); }
  if(lk.acc==='flower'){ const fx=3.7, fy=-3.8; c.fillStyle='#ff9ad0'; for(let i=0;i<5;i++){ c.beginPath(); c.ellipse(fx+Math.cos(i*1.257)*.75,fy+Math.sin(i*1.257)*.75,.62,.42,i*1.257,0,7); c.fill(); } c.fillStyle='#ffd84a'; c.beginPath(); c.arc(fx,fy,.42,0,7); c.fill(); }
  if(lk.hat && lk.hat!=="none"){ c.save(); c.translate(0,-.4); c.scale(.75,.75); drawHat(c,lk.hat,HATI[lk.hat]&&HATI[lk.hat].fixed?"#888888":(lk.hatCol||"#c8553a"),t); c.restore(); }
  if(lk.acc==="partyhat"){ c.save(); c.translate(.6,-.6); c.rotate(.22); c.scale(.66,.66); drawHat(c,"party",col,t); c.restore(); }
  c.restore(); c.restore();
}

// ---------- test-mode contact sheet (only with ?test): Lily in every pose with every accessory ----------
if(/[?&]test\b/.test(location.search)){
  window.__lilySheet=(opts={})=>{
    const poses=opts.poses||['sit','tilt','sniff','paw','petted','boof','watch','zoomR','zoomL','roll','sleep'];
    const accs=opts.accs||['none','bandana','bow','bowtie','scarf','bell','flower','glasses','cape','balloon','partyhat'];
    const hat=opts.hat||'none', cw=opts.cell||120, ch=Math.round(cw*1.05), sc=cw/34;
    const o=document.createElement('canvas'); o.width=cw*poses.length; o.height=ch*accs.length; const x=o.getContext('2d');
    x.fillStyle='#2a3350'; x.fillRect(0,0,o.width,o.height); const t=performance.now()/1000;
    if(opts.hats==='all') opts.hats=HATS.map(h=>h.id).filter(h=>h!=='none').slice(opts.from||0,opts.to||999); const rows=opts.hats||accs; if(opts.hats){ o.height=ch*rows.length; x.fillStyle='#2a3350'; x.fillRect(0,0,o.width,o.height); }
    rows.forEach((a,r)=>poses.forEach((p,cI)=>{ LILY.force=p; const lk=Object.assign({},petLook('lily'),opts.hats?{acc:'none',hat:a,hatCol:'#3f7a6a'}:{acc:a,accCol:'#d8303a',hat:hat,hatCol:'#3f7a6a'});
      x.save(); x.beginPath(); x.rect(cI*cw,r*ch,cw,ch); x.clip(); x.fillStyle=(r+cI)%2?'#2e3858':'#283150'; x.fillRect(cI*cw,r*ch,cw,ch);
      drawPetStyled(x,'lily',cI*cw+cw*.42,r*ch+ch*.84,sc,t,0,lk); x.restore();
      x.fillStyle='#cfd8ff'; x.font='10px system-ui'; x.fillText(p+' / '+a,cI*cw+4,r*ch+12); }));
    LILY.force=null; if(opts.save){ window.__post(opts.save,o.toDataURL()); return 'saved'; } document.getElementById('dbg')?.remove(); const im=document.createElement('img'); im.src=o.toDataURL(); im.id='dbg'; im.style.cssText='position:fixed;left:0;top:0;z-index:99999;width:'+(opts.w||o.width)+'px'; document.body.appendChild(im); return [o.width,o.height];
  };
}
if(/[?&]test\b/.test(location.search)){
  // every pet (rows) x every accessory + a hat (columns)
  window.__petSheet=(opts={})=>{ const ids=PETS.map(p=>p.id).filter(i=>i!=='lily').slice(opts.from||0,opts.to||999);
    const cols=opts.cols||[['none','none'],['bandana','none'],['bow','none'],['bowtie','none'],['scarf','none'],['bell','none'],['flower','none'],['glasses','none'],['cape','none'],['balloon','none'],['partyhat','none'],['none','cap'],['none','straw']];
    const cw=opts.cell||110, ch=Math.round(cw*.9); const o=document.createElement('canvas'); o.width=cw*cols.length; o.height=ch*ids.length; const x=o.getContext('2d'); const t=performance.now()/1000;
    ids.forEach((id,r)=>cols.forEach(([acc,hat],cI)=>{ const big=id==='horse'||id==='cow'; const lk=Object.assign({},petLook(id),{acc,accCol:'#d8303a',hat,hatCol:'#3f7a6a'});
      x.save(); x.beginPath(); x.rect(cI*cw,r*ch,cw,ch); x.clip(); x.fillStyle=(r+cI)%2?'#2e3858':'#283150'; x.fillRect(cI*cw,r*ch,cw,ch);
      drawPetStyled(x,id,cI*cw+cw*.45,r*ch+ch*.82,(big?2.1:3.3)*cw/110,t,0,lk); x.restore(); x.fillStyle='#cfd8ff'; x.font='9px system-ui'; x.fillText(id+' '+acc+(hat!=='none'?' '+hat:''),cI*cw+3,r*ch+10); }));
    window.__post(opts.save||'pets',o.toDataURL()); return ids.length; };
}
