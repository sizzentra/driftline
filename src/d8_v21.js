
// =====================================================================
// Update 2.1 "More of Everything": more rods, attachments, decor, dock
// items, junk, relics, outfits, a 5th path, the claw machine, feats
// =====================================================================
// ---------- rods & attachments ----------
[['pondrod','Pondmaster','shop',3000,'pond',1,'#7ab86a',{bite:.1,trophy:.1},'A cheerful green rod for quiet ponds.'],
 ['reefrod','Reef Runner','shop',40000,'reef',2,'#ffb04a',{shiny:.3,bite:.15},'Painted like a tropical sunset.'],
 ['chillrod','Chill Rod','prize',0,'pond',2,'#9ad8ff',{calm:.3,bite:.1},'Just a chill rod. Fish relax around it.'],
 ['champrod','Champion’s Rod','feat',0,'pond',3,'#ffd84a',{rare:.3,sell:.15},'Awarded to derby champions. Shiny and smug.'],
 ['emberrod','Magma Rod','shop',2000000,'ember',3,'#ff5a1a',{rare:.4,tension:.25,reel:.2},'Forged in the springs. Warm to hold.'],
 ['starrod','Starcaster','shop',5000000,'starfall',3,'#c8a0ff',{rare:.55,hot:.5,cast:1.15},'Casts so far the line touches the stars.'],
].forEach(a=>{ const r={id:a[0],name:a[1],src:a[2],price:a[3],need:a[4],slots:a[5],col:a[6],st:a[7],d:a[8]}; RODS.push(r); ROD_I[r.id]=r; });
[['gears','Oiled Gears','reel',[.06,.12,.2],'A drop of oil. The reel purrs.'],
 ['logclip','Logbook Clip','xp',[.05,.1,.18],'Keeps notes on every catch. You learn faster.'],
 ['pricetag','Price Tag','sell',[.04,.08,.14],'Somehow fish sell for more with a tag on.'],
 ['tanknet','Aquarium Net','tank',[.08,.16,.28],'Catches them gently so they show off later.'],
].forEach(a=>{ const t={id:a[0],name:a[1],k:a[2],v:a[3],d:a[4]}; ATTS.push(t); ATT_I[t.id]=t; });

// ---------- aquarium decor, junk, relics, outfits ----------
[['starfish','Starfish Family',1600,.02],['gardenbench','Tiny Garden Bench',2400,.02],['duckarmy','Rubber Duck Army',3800,.03],['mushroomhouse','Mushroom House',9500,.05],['ufo','Crashed UFO',22000,.06]]
  .forEach(a=>{ const d={id:a[0],name:a[1],price:a[2],b:a[3]}; DECOR.push(d); DECORI[d.id]=d; });
[['rubberchicken','Rubber Chicken',0,{buff:['calm',.35,5]},'It squeaks. The fish are too confused to fight.'],
 ['vhs','VHS Tape',0,{buff:['xp',.3,5]},'“How to Fish, Vol. 2.” Rewound, thankfully.'],
 ['pizzabox','Pizza Box',0,{buff:['bite',.35,5]},'One slice left. The fish want it.'],
 ['fidget','Fidget Spinner',1,{buff:['reel',.3,5]},'Spin it. Your reel spins faster too.'],
 ['console','Retro Game Console',1,{c:2.5},'Still works. A collector took it off your hands.'],
 ['shades','Pineapple in Sunglasses',2,{c:4,buff:['sell',.25,5]},'A very cool pineapple. Everyone wants to buy from you now.'],
].forEach(a=>{ const j={id:a[0],name:a[1],t:a[2],e:a[3],q:a[4]}; JUNK.push(j); JUNKI[j.id]=j; });
RELICS.push({id:'derbyhorn',name:'Seashell Horn',cost:3,d:'Derby rivals score 10% less.'},{id:'luckyscale',name:'Lucky Scale',cost:4,d:'+20% Scales from every fish.'});
OUTFITS.push(['bathrobe','Fluffy bathrobe',3200,'shop'],['pajamas','Striped pajamas',2200,'shop'],['lumberjack','Lumberjack jacket',4200,'shop']);

// ---------- a fifth path ----------
SPEC_TIERS.push({lvl:25, name:'Waters', opts:[
  ['seafarer','Seafarer','Rare odds +20% on the open sea and in the deep.',''],
  ['freshwater','River Soul','Rare odds +20% in ponds, rivers and the frozen lake.',''],
  ['elemental','Elementalist','Fish from the springs, the sky lake and the ice are worth 15% more.','']]});
const FRESH=['pond','river','frost'], SALT=['coast','shelf','deep','trench','reef'];
function specLocRare(loc){ return spec('seafarer') ? (SALT.includes(loc)?1.2:1) : spec('freshwater') ? (FRESH.includes(loc)?1.2:1) : 1; }
function specLocValue(loc){ return spec('elemental') ? (['ember','starfall','frost'].includes(loc)?1.15:1) : 1; }

// ---------- new skills' mastery effects ----------
Object.assign(MASTERY_FX,{
  weatherwise:'Clear skies count too: the bite bonus works in every weather.',
  naturalist:'Every new species also gives 5 Scales.',
  aquarist:'Shiny fish in the aquarium give triple boosts instead of double.',
  derbypro:'Derbies last 5 minutes instead of 4.',
  tidewalker:'Every 10th Tide Pass level gives an extra big Mystery Crate.',
  dozer:'Fish you catch while resting give full XP instead of 60%.',
  hybrid:'Hybrid chance doubles, to 2%.' });

// ---------- prizes ----------
PRIZES.push(['snowman','Little Snowman (pet)',2000,()=>{ S.owned.pets.push('snowman'); return 'a Little Snowman pet!'; },()=>S.owned.pets.includes('snowman')],
  ['chillrod','Chill Rod (rod)',2500,()=>{ S.rods.owned.push('chillrod'); return 'the Chill Rod'; },()=>S.rods.owned.includes('chillrod')],
  ['clawplush','Plush Crab Hat (hat)',800,()=>{ S.owned.hats.push('clawplush'); return 'a Plush Crab Hat'; },()=>S.owned.hats.includes('clawplush')]);
PRIZE_PV.clawplush=['hat','clawplush'];

// ---------- feats ----------
FEATS.push(
  {id:'rods8', name:'Rod collector', d:'Own 8 rods', p:()=>[S.rods.owned.length,8], coins:200000, pt:2},
  {id:'gold3', name:'Derby legend', d:'Win 3 gold medals', p:()=>[S.medals.gold,3], coins:80000, pt:2, rod:'champrod'},
  {id:'sp250', name:'Fish scholar', d:'Find 250 species', p:()=>[Object.keys(S.journal).length,250], coins:2000000, pt:3},
  {id:'claw10', name:'Claw master', d:'Win 10 claw machine prizes', p:()=>[S.gstats.claw||0,10], coins:20000, pt:1},
  {id:'atts10', name:'Fully kitted', d:'Own 10 different attachments', p:()=>[Object.keys(S.atts).length,10], coins:150000, pt:2},
  {id:'decor15', name:'Aquarium architect', d:'Own 15 aquarium decorations', p:()=>[S.aq.owned.filter(x=>DECORI[x]).length,15], coins:150000, pt:2},
  {id:'paths5', name:'Every road taken', d:'Choose all five Paths', p:()=>[Object.keys(S.specs).length,5], coins:500000, pt:3});

// ---------- claw machine ----------
let claw=null;
const CLAW_PRIZES = [['tickets','A handful of tickets',40],['tickets2','A big bag of tickets',14],['scales','A bag of Scales',14],['crate','A small Mystery Crate',8],['plush','A plush crab (hat)',4],['nothing','Slipped out of the claw!',20]];
function clawCost(){ return Math.round(bestLoot()*1.5); }
function playClaw(){ const tot=CLAW_PRIZES.reduce((a,p)=>a+p[2],0); let x=Math.random()*tot, p=CLAW_PRIZES[0]; for(const c of CLAW_PRIZES){ x-=c[2]; if(x<=0){ p=c; break; } } let txt=p[1];
  if(p[0]==='tickets') txt+=': +'+addTickets(rint(15,40))+' tickets'; if(p[0]==='tickets2') txt+=': +'+addTickets(rint(60,120))+' tickets'; if(p[0]==='scales'){ const n=rint(6,15); S.scales+=n; txt+=': +'+n+' Scales'; }
  if(p[0]==='crate') S.tokens.small++; if(p[0]==='plush'){ if(!S.owned.hats.includes('clawplush')){ S.owned.hats.push('clawplush'); } else { txt='Another plush crab! Swapped for 150 tickets'; addTickets(150); } }
  if(p[0]!=='nothing'){ S.gstats.claw=(S.gstats.claw||0)+1; sfx.coin(); } else sfx.lost(); claw={txt, t:performance.now(), win:p[0]!=='nothing'}; taskProgress('game',1); }
function paintClaw(){ const c=$('clawcv'); if(!c) return; const x=c.getContext('2d'), w=c.width, h=c.height; x.clearRect(0,0,w,h);
  x.fillStyle='#24384a'; x.fillRect(0,0,w,h); x.fillStyle='rgba(255,255,255,.06)'; x.fillRect(16,10,8,h-20);
  const cols=['#ff9ad0','#7fc8a9','#ffd84a','#5aa9ff','#c38bff','#ff7a5a']; for(let i=0;i<16;i++){ const px=30+((i*53)%(w-60)), py=h-24-((i*29)%60); x.fillStyle=cols[i%6]; x.beginPath(); x.arc(px,py,14,0,7); x.fill(); x.fillStyle='#1a1a1a'; x.beginPath(); x.arc(px-4,py-3,1.6,0,7); x.arc(px+4,py-3,1.6,0,7); x.fill(); }
  const k=claw?Math.min(1,(performance.now()-claw.t)/900):0, cx=w*.5, cy=30+Math.sin(k*Math.PI)*110; x.strokeStyle='#c8c8c8'; x.lineWidth=3; x.beginPath(); x.moveTo(cx,0); x.lineTo(cx,cy); x.stroke();
  x.beginPath(); x.moveTo(cx,cy); x.lineTo(cx-14,cy+16); x.moveTo(cx,cy); x.lineTo(cx+14,cy+16); x.stroke(); if(claw&&claw.win&&k>.5){ x.fillStyle='#ff9ad0'; x.beginPath(); x.arc(cx,cy+20,12,0,7); x.fill(); }
  if(claw && k<1) requestAnimationFrame(paintClaw); }

// ---------- actions ----------
function extraAct6(b){ if(b.dataset.act==='claw'){ const c=clawCost(); if(S.money<c) return 'skip'; S.money-=c; playClaw(); return 'render'; } return undefined; }

// ---------- drawings for the new things ----------
function drawPetZ(c,id,t,h){ const {el,ci,rc,ln,eye,blink}=h;
  switch(id){
    case 'lily': drawLily(c,t,h); break;
    case 'daxniko': drawPair(c,t,h); break;
    case 'puppy': ln([-8,-8,-12,-12+Math.sin(t*12)*2.5],'#e0b060',2.4); rc(-6,-5,2.4,5,'#e0b060'); rc(4,-5,2.4,5,'#e0b060'); el(0,-8,8,4.6,'#f0c070'); ci(8,-13,4.4,'#f0c070'); el(11.6,-12,2.8,2,'#f8dca0'); ci(13.8,-12.4,1,'#2a1a10'); el(6,-12,1.8,3.6,'#d8a050',.2); if(!blink) eye(9,-14.4,.9); ln([12,-10,12.6,-8.4],'#ff7a8a',1.2); break;
    case 'kitten': ln([-4,-2,-8,-5,-7,-10],'#e8a060',1.6); el(0,-5,4,4.8,'#f0b070'); ci(1,-11,3.4,'#f0b070'); c.fillStyle='#f0b070'; c.beginPath(); c.moveTo(-1.5,-13); c.lineTo(-1.2,-16.5); c.lineTo(.8,-14); c.moveTo(1.8,-14); c.lineTo(3.8,-16.5); c.lineTo(4,-12.6); c.fill(); if(!blink){ ci(2.4,-11.4,.9,'#4a8a3a'); ci(-.2,-11.4,.9,'#4a8a3a'); } break;
    case 'fireflyjar': rc(-5,-14,10,14,'rgba(200,230,255,.25)'); rc(-5.5,-16,11,2.5,'#8a6a4a'); for(let i=0;i<4;i++){ const fx=Math.sin(t*2+i*1.7)*3, fy=-7+Math.cos(t*1.6+i)*4; c.fillStyle='rgba(230,255,140,'+(.6+.4*Math.sin(t*5+i))+')'; c.beginPath(); c.arc(fx,fy,1.1,0,7); c.fill(); } break;
    case 'puffin': el(0,-8,4.4,7,'#1a1a1a'); el(1,-7,3,5.4,'#f4f4f4'); ci(1,-15,3.4,'#1a1a1a'); el(2,-14.4,2.4,2,'#f4f4f4'); c.fillStyle='#ff7a2a'; c.beginPath(); c.moveTo(3.6,-16); c.lineTo(7.4,-14.6); c.lineTo(3.6,-13); c.fill(); eye(2.4,-15.2,.7); el(-1,-.6,2,1,'#ff7a2a'); el(2.6,-.6,2,1,'#ff7a2a'); break;
    case 'alpaca': rc(-6,-8,2,8,'#f4ecdc'); rc(3,-8,2,8,'#f4ecdc'); for(const [dx,dy] of [[-4,-13],[0,-14],[4,-13],[-2,-10],[2,-10]]) ci(dx,dy,3.4,'#fff8ec'); rc(3,-26,4,13,'#fff8ec'); ci(5,-27,3.8,'#fff8ec'); ci(5,-30,2.6,'#fff8ec'); rc(3,-33,1.4,3,'#e8dccb'); rc(6,-33,1.4,3,'#e8dccb'); eye(6.6,-27.4); el(8,-25.4,1.4,1,'#d8c8b8'); break;
    case 'mole': el(0,-4,7,4.5,'#4a3a3a'); el(6,-4,3,2.4,'#5a4848'); ci(8.6,-4.4,1.6,'#ff9ab0'); el(-3,-.5,2.6,1.2,'#ffb0c0'); el(4,-.5,2.6,1.2,'#ffb0c0'); ln([6,-6.2,7,-6.2],'#111',.6); break;
    case 'mushroombuddy': rc(-3,-8,6,8,'#f4ecdc'); c.fillStyle='#d8403a'; c.beginPath(); c.ellipse(0,-9,8,6,0,Math.PI,0); c.fill(); for(const [x,y] of [[-4,-11],[1,-13],[4,-10]]) ci(x,y,1.3,'#fff'); if(!blink){ eye(-1.2,-5,.6); eye(1.4,-5,.6); } ln([-.6,-3,1,-3],'#a05050',.5); break;
    case 'frogprince': { el(0,-4,6.5,4.2,'#5aa04a'); ci(-2.5,-8.5,2.4,'#5aa04a'); ci(2.5,-8.5,2.4,'#5aa04a'); ci(-2.5,-8.7,1.4,'#fff'); ci(2.5,-8.7,1.4,'#fff'); eye(-2.2,-8.7,.7); eye(2.8,-8.7,.7); c.fillStyle='#ffcc33'; c.beginPath(); c.moveTo(-3,-11); c.lineTo(-3.4,-14.5); c.lineTo(-1.5,-12.5); c.lineTo(0,-15); c.lineTo(1.5,-12.5); c.lineTo(3.4,-14.5); c.lineTo(3,-11); c.fill(); break; }
    case 'babywhale': { c.translate(0,Math.sin(t*1.2)); el(0,-6,10,6,'#4a7ab8'); el(1,-3.5,7,3,'#c8e0f0'); c.fillStyle='#4a7ab8'; c.beginPath(); c.moveTo(-9,-6); c.lineTo(-15,-11); c.lineTo(-14,-6); c.lineTo(-15,-1); c.closePath(); c.fill(); eye(6,-7.5,.8); if(Math.sin(t*.8)>.6){ c.fillStyle='rgba(200,230,255,.7)'; for(let i=0;i<3;i++){ c.beginPath(); c.arc(2+(i-1)*2,-14-i*1.5,1.2,0,7); c.fill(); } } break; }
    case 'snowman': ci(0,-5,5.5,'#f4f8fc'); ci(0,-13,4,'#f4f8fc'); eye(-1.4,-14,.6); eye(1.4,-14,.6); c.fillStyle='#ff8a2a'; c.beginPath(); c.moveTo(.4,-13); c.lineTo(4.4,-12.4); c.lineTo(.4,-12); c.fill(); rc(-4,-10,8,1.6,'#d8403a'); rc(2,-10,1.6,4,'#d8403a'); ci(0,-6,.6,'#333'); ci(0,-3.6,.6,'#333'); ln([-5,-8,-9,-11],'#6a4a2a',.8); ln([5,-8,9,-11],'#6a4a2a',.8); break;
  } }
Object.assign(PET_HEAD,{lily:[3,-17.6,5.9],puppy:[8,-13,4.4],kitten:[1,-11,3.4],fireflyjar:[0,-15,5],puffin:[1,-15,3.4],alpaca:[5,-28,3.8],mole:[6,-4,3],mushroombuddy:[0,-12,5],frogprince:[0,-8.5,3.5],babywhale:[5,-8,5],snowman:[0,-13,4]});
function drawHatZ(c,id,col,t,h){ const {dk,lt,el,ci,poly,dome}=h; const f=cl=>{ c.fillStyle=cl; };
  switch(id){
    case 'aviator': dome(8.3,-1.5,'#8a5a2a'); f('#6a4220'); c.beginPath(); if(c.roundRect) c.roundRect(-5.2,-2.6,4.6,7.4,1.4); else c.rect(-5.2,-2.6,4.6,7.4); c.fill(); el(-2,-6,2.4,1.8,'#9ad0e8'); el(3,-6,2.4,1.8,'#9ad0e8'); c.strokeStyle='#3a3a3a'; c.lineWidth=.6; c.beginPath(); c.ellipse(-2,-6,2.4,1.8,0,0,7); c.ellipse(3,-6,2.4,1.8,0,0,7); c.stroke(); break;
    case 'headband': f(col); c.fillRect(-8,-6,16,2.6); poly([-8,-5,-12,-3,-11,-1],col); f(lt); c.fillRect(-8,-5.3,16,.6); break;
    case 'gnomehat': f(col); c.beginPath(); c.moveTo(-7.5,-3); c.lineTo(7.5,-3); c.quadraticCurveTo(3,-14,-2,-22); c.quadraticCurveTo(-5,-12,-7.5,-3); c.fill(); f(dk); c.fillRect(-8,-4.5,16,2); break;
    case 'flowerpot': poly([-7,-2,7,-2,5.5,-12,-5.5,-12],'#c8703a'); f('#a85a2a'); c.fillRect(-6.5,-13.5,13,2.5); c.strokeStyle='#3a9a4a'; c.lineWidth=1.2; c.beginPath(); c.moveTo(0,-13); c.lineTo(0,-20); c.stroke(); ci(0,-21,2.4,'#ff7ab0'); ci(0,-21,1,'#ffd84a'); el(-2.4,-17,2,1,'#3a9a4a',-.5); break;
    case 'tinfoil': poly([-8,-2,8,-2,0,-17],'#d0d6dc'); c.strokeStyle='#a8b0b8'; c.lineWidth=.6; for(let i=0;i<5;i++){ c.beginPath(); c.moveTo(-6+i*3,-3); c.lineTo(-1+i,-12); c.stroke(); } ci(0,-17,1.2,'#e8eef4'); break;
    case 'clawplush': el(0,-6,8,4.5,'#ff7a5a'); ci(-3,-10,1.8,'#ff7a5a'); ci(3,-10,1.8,'#ff7a5a'); ci(-3,-10.4,1,'#fff'); ci(3,-10.4,1,'#fff'); ci(-2.8,-10.4,.5,'#111'); ci(3.2,-10.4,.5,'#111'); el(-9,-6,2.6,1.8,'#ff7a5a',.6); el(9,-6,2.6,1.8,'#ff7a5a',-.6); break;
  } }
function drawOutfitZ(c,lk,D,oc,R){ switch(lk.outfit){
    case 'bathrobe': { c.fillStyle=oc; c.beginPath(); c.moveTo(-9,-46); c.lineTo(9,-46); c.lineTo(10,-12); c.lineTo(-10,-12); c.closePath(); c.fill(); c.fillStyle=D(mix(lk.outCol||'#d8a020','#ffffff',.3)); c.beginPath(); c.moveTo(-3,-46); c.lineTo(0,-34); c.lineTo(3,-46); c.fill(); R(-9,-26,18,2.2,D(mix(lk.outCol||'#d8a020','#000000',.2))); break; }
    case 'pajamas': { R(-8,-46,16,24,oc); R(-7,-25,14,5,oc); R(-7,-22,6,18,oc); R(1,-22,6,18,oc); c.fillStyle='rgba(255,255,255,.55)'; for(let x=-8;x<8;x+=3) c.fillRect(x,-46,1.2,42); for(let i=0;i<3;i++) R(-.6,-42+i*6,1.2,1.2,D('#ffffff')); break; }
    case 'lumberjack': { c.fillStyle=oc; c.beginPath(); c.moveTo(-8.8,-46); c.lineTo(8.8,-46); c.lineTo(9,-20); c.lineTo(-9,-20); c.closePath(); c.fill(); c.fillStyle='rgba(0,0,0,.35)'; for(let x=-8;x<9;x+=4) c.fillRect(x,-46,1.6,26); for(let y=-45;y<-20;y+=4) c.fillRect(-9,y,18,1.6); R(-.5,-46,1,26,D('#2a2a2a')); break; }
  } }
function drawDecorZ(c,id,t,h){ const {R,Ci,E,P}=h;
  switch(id){
    case 'starfish': for(const [sx,sy,cl,s] of [[-16,-6,'#ff7a5a',1],[8,-5,'#ffb04a',.8],[0,-14,'#ff9ad0',.6]]){ c.save(); c.translate(sx,sy); c.scale(s,s); c.fillStyle=cl; c.beginPath(); for(let i=0;i<10;i++){ const a=-Math.PI/2+i*Math.PI/5, r=i%2?5:13; c.lineTo(Math.cos(a)*r,Math.sin(a)*r); } c.fill(); c.restore(); } break;
    case 'gardenbench': R(-26,-18,52,5,'#8a5a3a'); R(-26,-32,52,4,'#8a5a3a'); R(-26,-26,52,4,'#8a5a3a'); R(-24,-14,4,14,'#3a3a3a'); R(20,-14,4,14,'#3a3a3a'); break;
    case 'duckarmy': for(let i=0;i<5;i++){ const dx=-28+i*14, dy=-6-Math.abs(Math.sin(t*3+i))*3; E(dx,dy,6,4,'#ffd23a'); Ci(dx+4,dy-5,3.2,'#ffd23a'); P([dx+6.5,dy-5.5,dx+10,dy-4.5,dx+6.5,dy-3.5],'#ff8a2a'); } break;
    case 'mushroomhouse': R(-12,-30,24,30,'#f4ecdc'); c.fillStyle='#d8403a'; c.beginPath(); c.ellipse(0,-32,30,20,0,Math.PI,0); c.fill(); for(const [x,y,r] of [[-14,-40,4],[4,-46,5],[16,-36,3.5]]) Ci(x,y,r,'#fff'); R(-5,-16,10,16,'#8a5a3a'); Ci(8,-22,3,'#ffe08a'); break;
    case 'ufo': c.save(); c.rotate(-.3); E(0,-14,30,9,'#a8b0b8'); c.fillStyle='rgba(154,216,255,.7)'; c.beginPath(); c.ellipse(0,-20,13,11,0,Math.PI,0); c.fill(); for(let i=0;i<5;i++) Ci(-20+i*10,-12,2,Math.sin(t*4+i)>0?'#5aff8a':'#ff5a8a'); c.restore(); c.fillStyle='rgba(200,255,200,.12)'; c.beginPath(); c.moveTo(-8,-10); c.lineTo(8,-10); c.lineTo(20,0); c.lineTo(-20,0); c.fill(); break;
  } }
function drawJunkZ(c,id,R,Ci,E,P,Ln){ switch(id){
    case 'rubberchicken': E(0,10,22,46,'#ffd23a',.9); Ci(36,-24,14,'#ffd23a'); P([48,-26,66,-20,48,-16],'#ff8a2a'); P([30,-36,34,-48,40,-36],'#ff4a4a'); Ci(40,-28,3,'#111'); break;
    case 'vhs': R(-70,-40,140,80,'#1a1a1a'); R(-50,-24,100,30,'#f4f0e8'); Ci(-26,18,12,'#444'); Ci(26,18,12,'#444'); R(-40,-18,80,6,'#c8553a'); break;
    case 'pizzabox': R(-70,-14,140,40,'#d8b07a'); R(-70,-20,140,8,'#c8a06a'); c.fillStyle='#c8302a'; c.font='800 20px system-ui'; c.textAlign='center'; c.fillText('PIZZA',0,12); break;
    case 'fidget': for(let i=0;i<3;i++){ const a=i*2.094; Ci(Math.cos(a)*36,Math.sin(a)*36,20,'#5aa9ff'); Ci(Math.cos(a)*36,Math.sin(a)*36,8,'#c8d0d8'); } Ci(0,0,16,'#3a7ad8'); Ci(0,0,7,'#c8d0d8'); break;
    case 'console': R(-60,-30,120,60,'#d8d4cc'); R(-44,-14,24,8,'#333'); R(-36,-22,8,24,'#333'); Ci(30,-6,7,'#c8302a'); Ci(46,6,7,'#c8302a'); R(-10,18,20,5,'#888'); break;
    case 'shades': E(0,20,36,48,'#f0b030'); for(let i=-2;i<=2;i++) P([i*10-6,-26,i*10+6,-26,i*12,-70],'#3a9a4a'); R(-32,0,26,14,'#111'); R(6,0,26,14,'#111'); R(-6,4,12,3,'#111'); break;
    default: Ci(0,0,60,'#888');
  } }
