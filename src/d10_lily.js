
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
  const petted=now-pt<2200, rolling=now-LILY.rollT<1900, boof=now-LILY.boofT<1600, watching=G.st==='reeling'||G.st==='bite'||G.st==='waiting';
  const sleep=PET_NIGHT>.55&&!petted&&!boof&&!watching&&!rolling;
  const busy=petted||boof||rolling||watching;
  const zc=t%28, zoom=!sleep&&!busy&&zc>20&&zc<21.8;
  const sniff=!zoom&&!busy&&(t%13)>10.6&&(t%13)<11.9, paw=!zoom&&!busy&&!sniff&&(t%17)>8&&(t%17)<9.4;
  const bigTilt=!sniff&&!paw&&(t%7)>5.3&&(t%7)<6.7;
  const wag=petted||zoom||watching||boof||rolling||paw?24:9;
  LILY.hdx=0; LILY.hdy=0;
  if(rolling){ LILY.pose='roll'; const w=Math.sin(now/80), k=(now-LILY.rollT)/1900; // belly up for rubs
    el(-9.5,-2.2,2.6,1.6,L.BK2,.2+w*.4);
    el(0,-4.6,8.6,4.4,L.BK); el(.8,-6.6,6.2,2.9,L.WH); el(-4.6,-6,1.4,2,L.TN,.3); el(6,-6,1.4,2,L.TN,-.3); strand(-3,-7.4,-2.4,-8.6,L.WH2); strand(2,-7.8,2.6,-9,L.WH2);
    for(let i=0;i<4;i++){ const lx=-5+i*3.4, ly=-11.4+Math.sin(now/70+i*1.7)*1.2; ln([lx,-7,lx+.6,ly],i<2?L.BK:L.WH,2.4); ci(lx+.6,ly+1.4,.9,L.TN); ci(lx+.6,ly,1.3,L.WH); }
    c.save(); c.translate(10,-5.2); c.rotate(2.2+w*.08); c.scale(.92,.92); lilyFace(c,h,{eyes:'happy',mouth:'tongue',ears:'out',t}); c.restore();
    c.save(); for(let i=0;i<4;i++){ const a=i*1.6+k*4, r=9+k*4; c.globalAlpha=Math.max(0,.9-k)*(.6+.4*Math.sin(now/90+i)); c.fillStyle='#ffe58a'; const sx=2+Math.cos(a)*r, sy=-8+Math.sin(a)*r*.5; c.beginPath(); c.moveTo(sx,sy-1.2); c.lineTo(sx+.35,sy-.35); c.lineTo(sx+1.2,sy); c.lineTo(sx+.35,sy+.35); c.lineTo(sx,sy+1.2); c.lineTo(sx-.35,sy+.35); c.lineTo(sx-1.2,sy); c.lineTo(sx-.35,sy-.35); c.fill(); } c.restore();
    return; }
  if(sleep){ LILY.pose='sleep'; const br=Math.sin(t*1.6)*.3; // curled up napping, chin on her white paws
    el(-6,-1.6,3.6,1.6,L.BK2,.1);
    el(0,-4.2,9,4.2+br,L.BK); for(let i=0;i<5;i++){ el(-7+i*3.4,-8+Math.sin(i)*.4+br*.5,1.4,1,L.BK); strand(-7+i*3.4,-8.6,-7.6+i*3.4,-9.6,L.HI); }
    el(5.4,-3.4,3.4,2.8,L.WH); el(3.4,-4.6,1.2,2,L.TN,.3); rc(6,-1.6,4.4,1.6,L.WH); ci(10.6,-.8,.8,L.WH2);
    c.save(); c.translate(8.6,-5.6); c.rotate(.12); c.scale(.85,.85); lilyFace(c,h,{eyes:'closed',mouth:'smile',ears:'out',t}); c.restore();
    c.save(); for(let k=0;k<3;k++){ const ph=(t*.5+k/3)%1; c.globalAlpha=Math.sin(ph*Math.PI)*.9; c.fillStyle='#cfe6ff'; c.font='bold '+(3+ph*2.5)+'px system-ui'; c.fillText('z',12+ph*5,-12-ph*9); } c.restore();
    return; }
  if(zoom){ LILY.pose='zoom'; // running side-on, paw prints behind her
    const ph=(zc-20)/1.8, dx=Math.sin(ph*Math.PI*3)*11, flip=Math.cos(ph*Math.PI*3)<0;
    c.save(); for(let i=1;i<=5;i++){ const pp=ph-i*.05; if(pp<0) continue; const px=Math.sin(pp*Math.PI*3)*11; c.globalAlpha=.32-i*.05; c.fillStyle='#e8d8c8'; c.beginPath(); c.ellipse(px+(i%2?1.4:-1.4),.6,1,.5,0,0,7); c.fill(); } c.restore();
    const hop=Math.abs(Math.sin(t*18))*1.6, lg=Math.sin(t*22)*1.8;
    c.save(); c.translate(dx,-hop); if(flip) c.scale(-1,1);
    el(-9.2,-10,3,2.2,L.BK2,-.6+Math.sin(t*24)*.4);
    for(const [x,s] of [[-6,1],[-3.2,-1],[.6,1],[3.6,-1]]){ const xx=x+lg*s; rc(xx,-5,2.6,5,x<0?L.BK:L.WH); rc(xx,-2.4,2.6,1,L.TN); rc(xx,-1.4,2.6,1.6,L.WH); }
    el(-.5,-8.4,8.6,5,L.BK); for(let i=0;i<5;i++){ el(-7+i*3.4,-12.6,1.6,1.1,L.BK); strand(-7+i*3.4,-13.2,-7.8+i*3.4,-14.4,L.HI); }
    el(4.2,-8.6,1.4,4.4,L.TN,-.2); el(5.8,-8.4,3.6,5,L.WH);
    c.save(); c.translate(8.6,-14.2); c.rotate(-.1); lilyFace(c,h,{eyes:'open',mouth:'tongue',ears:'back',blink,t}); c.restore();
    c.restore(); return; }
  // ---- sitting, facing you (like the photo) ----
  LILY.pose='sit';
  const hop = boof ? Math.max(0,Math.sin((now-LILY.boofT)/1600*Math.PI*3))*2.4 : petted ? Math.max(0,Math.sin(now/120))*.8 : 0, br=Math.sin(t*2.2)*.25;
  c.save(); c.translate(0,-hop);
  // fluffy tail tuft wagging behind her
  const tw=Math.sin(t*wag)*.5; el(10.6,-2.6,3,1.7,L.BK2,-.5+tw); strand(12.4,-3.4,13.6,-4.4+tw,L.HI);
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
  const leg=(x,lift)=>{ if(lift){ c.save(); c.translate(x+1.2,-6); c.rotate(-1.15+Math.sin(t*6)*.12); rc(-1.2,0,2.4,5.2,L.WH); el(0,0,1.3,.9,L.TN); ln([-.6,5,-.6,4.4],L.WH3,.25); ln([.6,5,.6,4.4],L.WH3,.25); c.restore(); return; }
    rc(x,-6,2.4,6,L.WH); ln([x+.8,-.2,x+.8,-.9],L.WH3,.25); ln([x+1.6,-.2,x+1.6,-.9],L.WH3,.25); };
  leg(-.3,false); leg(3.9,paw);
  // head on top, looking at you, with her head tilt
  const hy=-17.4+(sniff?2.6:0)+(watching||boof?-.6:0), hx=3+(sniff?1.2:0), tilt=sniff?.28:petted?.14:boof?-.06:paw?-.2:bigTilt?-.48:-.15+Math.sin(t*1.3)*.06;
  LILY.hdx=hx-3; LILY.hdy=hy+17.4;
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
  if(btoa(code)==='TElMWVBBV1M='){ // LILYPAWS
    if(S.owned.pets.includes('lily')){ toast('Lily is already with you. She says hi.'); return 'skip'; }
    S.owned.pets.push('lily'); petLook('lily').name='Lily'; setFav('lily'); setTab('pets'); sfx.shiny(); save();
    setTimeout(()=>showPatchNotes(LILY_PATCH),250); return 'render'; }
  toast('That gift code didn’t work. Check the spelling.'); return 'skip'; }
