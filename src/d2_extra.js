
// =====================================================================
// Extras: mastery & angler rank, aquarium decor, events & mini-games,
// boardwalk games, music & ambience, settings, extra pets
// =====================================================================
const bestLoot = () => Math.max(...S.unlocked.map(id=>LOCS[locIdx(id)].loot));

// ---------- mastery & angler rank ----------
const MASTERY = [3,10,30,100];
function mastery(id){ const j=S.journal[id]; if(!j) return 0; let n=0; for(const t of MASTERY) if(j.n>=t) n++; return n; }
function totalStars(){ let s=0; for(const id in S.journal) s+=mastery(id); return s; }
function anglerRank(){ return Math.floor(totalStars()/8); }
function checkRank(){ const r=anglerRank(); if(r<=S.rankClaimed) return ''; let coins=0, sm=0, bg=0, lg=0;
  for(let k=S.rankClaimed+1;k<=r;k++){ coins+=Math.round(300*Math.pow(k,1.7)); if(k%25===0) lg++; else if(k%5===0) bg++; else sm++; }
  S.rankClaimed=r; S.tokens.small+=sm; S.tokens.big+=bg; S.tokens.legend+=lg; earn(coins*coinMult());
  if(r>=15 && !S.rods.owned.includes('tides')){ S.rods.owned.push('tides'); setTimeout(()=>toast('Rank 15 reward: a mysterious rod appears in your Rods tab.'),1500); }
  const parts=[]; if(sm) parts.push(sm+' small crate'+(sm>1?'s':'')); if(bg) parts.push(bg+' big crate'+(bg>1?'s':'')); if(lg) parts.push('a LEGENDARY crate');
  return 'Angler rank '+r+'! +'+fmt(coins*coinMult())+' coins, '+parts.join(', '); }
const starStr = n => '★'.repeat(n)+'☆'.repeat(4-n);

// ---------- aquarium decor ----------
const THEMES = [['lagoon','Lagoon',0,'#0f4a63','#06202e'],['kelp','Kelp Forest',4000,'#1f5a3a','#082418'],['coral','Coral Pink',6000,'#7a3a5a','#2a0e22'],
  ['arctic','Arctic',8000,'#5a8aa8','#14304a'],['sunset','Sunset Shallows',10000,'#c86a4a','#3a1a3a'],['midnight','Midnight',12000,'#141a40','#05060f'],['abyss','Abyss Glow',30000,'#062a30','#000608']];
const SANDS = [['gold','Golden sand',0,'#c9b48a'],['white','White sand',1500,'#ece6d6'],['pebble','Pebbles',2000,'#8a8a80'],['pink','Pink sand',3000,'#e8b0c0'],['black','Volcanic',3000,'#3a3436']];
// id, name, price (0 = crates only), aquarium income bonus
const DECOR = [['kelp','Kelp Patch',800,.01],['duck','Floating Duck',1000,.02],['shell','Giant Shell',1200,.02],['anchor','Old Anchor',1800,.02],['coral','Coral Tree',2000,.02],
  ['castle','Sand Castle',2500,.03],['diver','Little Diver',3000,.03],['chest','Treasure Chest',4000,.03],['skull','Pirate Skull',5000,.03],['lantern','Sea Lantern',6000,.04],
  ['pineapple','Pineapple House',7000,.04],['moai','Stone Head',9000,.05],['volcano','Bubble Volcano',12000,.05],['ship','Sunken Ship',15000,.06],['sub','Tiny Submarine',20000,.06],
  ['neon','Neon Fish Sign',25000,.07],['crystal','Crystal Cave',0,.08],['goldcastle','Golden Castle',0,.1],['mermaid','Mermaid Statue',0,.12],
  ['bonsai','Underwater Bonsai',1500,.02],['pizza','Giant Pizza Slice',2200,.02],['chair','Tiny Office Chair',2800,.03],['couch','Tiny Couch',3500,.03],['gnomediver','Gnome in a Snorkel',4200,.03],
  ['toiletthrone','Porcelain Throne',4800,.03],['disco','Disco Ball',6500,.04],['tvfish','Tiny TV (fish channel)',8000,.04],['flamingofloat','Flamingo Float',5500,.04],['bigclam','Giant Clam',11000,.05],
  ['jellylamp','Jellyfish Lamp',14000,.05],['wreckcar','Sunken Car',18000,.06],['treasurepile','Gold Coin Pile',30000,.07],['carousel','Carousel',0,.08]].map(a=>({id:a[0],name:a[1],price:a[2],b:a[3]}));
const DECORI = Object.fromEntries(DECOR.map(d=>[d.id,d]));
const aqSlots = () => 6 + Math.floor(S.tankSlots/2) + (spec('curator')?2:0);
function decorBonus(){ let s=0; for(const id of (S.aq&&S.aq.decor)||[]) if(DECORI[id]) s+=DECORI[id].b; return s; }
let feedAnim=0;
function drawTankBack(c,w,h,t){ if(V3ON && v3TankBack(c,w,h,t)) return; const V=aqView(); const th=THEMES.find(x=>x[0]===V.theme)||THEMES[0], sd=SANDS.find(x=>x[0]===V.sand)||SANDS[0];
  const bg=c.createLinearGradient(0,0,0,h); bg.addColorStop(0,th[3]); bg.addColorStop(1,th[4]); c.fillStyle=bg; c.fillRect(0,0,w,h);
  for(let i=0;i<5;i++){ c.fillStyle='rgba(180,230,255,.05)'; c.beginPath(); const x=(i*w/4+Math.sin(t*.3+i)*30); c.moveTo(x,0); c.lineTo(x+40,0); c.lineTo(x-20,h); c.lineTo(x-70,h); c.fill(); }
  if(V.theme==='abyss'||V.theme==='midnight'){ for(let i=0;i<20;i++){ c.fillStyle='rgba(127,245,255,'+(.25+.25*Math.sin(t*2+i))+')'; c.beginPath(); c.arc((i*97+t*5)%w,(i*53)%h,1.5,0,7); c.fill(); } }
  c.fillStyle=sd[3]; c.beginPath(); c.moveTo(0,h); for(let x=0;x<=w;x+=20) c.lineTo(x,h-14-Math.sin(x*.04)*5); c.lineTo(w,h); c.fill();
  if(V.sand==='pebble'){ for(let i=0;i<40;i++){ c.fillStyle=['#a8a89a','#6a6a62','#c8c0b0'][i%3]; c.beginPath(); c.ellipse((i*37)%w,h-4-((i*13)%10),4,2.5,0,0,7); c.fill(); } }
  for(let i=0;i<7;i++){ const x=(i+.5)*w/7, hh=30+(i*17)%40; c.strokeStyle=i%2?'#3f8f5a':'#2f7a4c'; c.lineWidth=4; c.beginPath(); c.moveTo(x,h-10); c.quadraticCurveTo(x+Math.sin(t+i)*10,h-10-hh*.6,x+Math.sin(t*1.2+i)*6,h-10-hh); c.stroke(); }
  const ds=V.decor.filter(id=>id!=='duck'); ds.forEach((id,i)=>drawDecor(c,id,w*(i+.5)/Math.max(ds.length,1),h-8,h/230,t)); }
function drawTankFront(c,w,h,t){ if(V3ON) v3TankGlass(c,w,h,t); if(aqView().decor.includes("duck")) drawDecor(c,'duck',w*.8+Math.sin(t*.4)*w*.1,8,h/230,t);
  if(feedAnim && performance.now()-feedAnim<7000){ const k=(performance.now()-feedAnim)/1000; c.fillStyle='#d8a050'; for(let i=0;i<24;i++){ const x=w*(.3+((i*37)%40)/100), y=Math.min(h-16, k*30*(.6+((i*13)%10)/20)+((i*7)%20)); c.fillRect(x,y,3,3); } } }
function drawDecor(c,id,x,y,s,t=0){ c.save(); c.translate(x,y); c.scale(s,s); c.lineCap='round'; c.lineJoin='round';
  const R=(x,y,w,h,cl)=>{ c.fillStyle=cl; c.fillRect(x,y,w,h); }, Ci=(x,y,r,cl)=>{ c.fillStyle=cl; c.beginPath(); c.arc(x,y,r,0,7); c.fill(); }, E=(x,y,rx,ry,cl,r=0)=>{ c.fillStyle=cl; c.beginPath(); c.ellipse(x,y,rx,ry,r,0,7); c.fill(); };
  const P=(pts,cl)=>{ c.fillStyle=cl; c.beginPath(); c.moveTo(pts[0],pts[1]); for(let i=2;i<pts.length;i+=2) c.lineTo(pts[i],pts[i+1]); c.closePath(); c.fill(); };
  const bubbles=(bx,by)=>{ c.fillStyle='rgba(220,245,255,.5)'; for(let i=0;i<5;i++){ const k=((t*.6+i/5)%1); c.beginPath(); c.arc(bx+Math.sin(t*3+i)*3,by-k*120,2+k*2,0,7); c.fill(); } };
  switch(id){
    case 'kelp': for(let i=-2;i<=2;i++){ c.strokeStyle=i%2?'#3a9a5a':'#2a7a4a'; c.lineWidth=5; c.beginPath(); c.moveTo(i*8,0); c.quadraticCurveTo(i*8+Math.sin(t+i)*12,-50,i*8+Math.sin(t*1.3+i)*8,-90-Math.abs(i)*6); c.stroke(); } break;
    case 'duck': E(0,0,16,9,'#ffd23a'); Ci(12,-9,8,'#ffd23a'); P([19,-10,27,-8,19,-6],'#ff8a2a'); Ci(14,-11,1.6,'#111'); break;
    case 'shell': c.fillStyle='#f0a8b8'; c.beginPath(); c.moveTo(-30,0); c.quadraticCurveTo(-34,-40,0,-46); c.quadraticCurveTo(34,-40,30,0); c.closePath(); c.fill(); c.strokeStyle='#d07890'; c.lineWidth=2; for(let i=-3;i<=3;i++){ c.beginPath(); c.moveTo(0,-2); c.lineTo(i*9,-42+Math.abs(i)*4); c.stroke(); } Ci(0,-10,6,'#fff6e8'); break;
    case 'anchor': c.strokeStyle='#4a5058'; c.lineWidth=7; c.beginPath(); c.moveTo(0,-70); c.lineTo(0,-8); c.moveTo(-14,-56); c.lineTo(14,-56); c.stroke(); c.beginPath(); c.arc(0,-24,24,Math.PI*.15,Math.PI*.85); c.stroke(); c.lineWidth=5; c.beginPath(); c.arc(0,-76,7,0,7); c.stroke(); break;
    case 'coral': c.strokeStyle='#ff7a9a'; c.lineWidth=7; c.beginPath(); c.moveTo(0,0); c.lineTo(0,-34); c.lineTo(-18,-60); c.moveTo(0,-34); c.lineTo(16,-58); c.moveTo(-9,-46); c.lineTo(-26,-48); c.moveTo(8,-46); c.lineTo(22,-72); c.stroke(); for(const [px,py] of [[-18,-60],[16,-58],[-26,-48],[22,-72]]) Ci(px,py,5,'#ffb0c0'); break;
    case 'castle': R(-34,-40,68,40,'#d8c08a'); R(-40,-62,20,62,'#e0c890'); R(20,-62,20,62,'#e0c890'); for(const bx of [-40,-30,20,30]) R(bx,-68,8,8,'#e0c890'); R(-8,-22,16,22,'#6a5030'); P([-40,-62,-30,-80,-20,-62],'#c8553a'); P([20,-62,30,-80,40,-62],'#c8553a'); break;
    case 'diver': Ci(0,-48,14,'#c8963a'); c.globalAlpha=.6; Ci(3,-49,8,'#9ad0e8'); c.globalAlpha=1; R(-11,-36,22,26,'#3a5a7a'); R(-11,-10,8,10,'#2a2a2a'); R(3,-10,8,10,'#2a2a2a'); bubbles(0,-62); break;
    case 'chest': R(-30,-26,60,26,'#7a4a24'); c.fillStyle='#8a5a30'; c.beginPath(); c.moveTo(-30,-26); c.lineTo(-26,-50); c.lineTo(28,-44); c.lineTo(30,-26); c.fill(); R(-32,-28,64,5,'#ffc94d'); Ci(0,-30,14,'rgba(255,215,110,.35)'); Ci(-8,-30,4,'#ffc94d'); Ci(6,-31,4,'#ffc94d'); break;
    case 'skull': Ci(0,-26,22,'#ece6d6'); R(-12,-10,24,12,'#ece6d6'); Ci(-8,-28,6,'#1a1a1a'); Ci(8,-28,6,'#1a1a1a'); P([0,-20,-3,-14,3,-14],'#1a1a1a'); for(let i=-2;i<=2;i++) R(i*5-1,-6,2,6,'#1a1a1a'); break;
    case 'lantern': R(-3,-70,6,70,'#3a3a3a'); R(-10,-88,20,20,'#2a2a2a'); { const gr=c.createRadialGradient(0,-78,2,0,-78,46); gr.addColorStop(0,'rgba(255,220,120,.6)'); gr.addColorStop(1,'rgba(255,220,120,0)'); c.fillStyle=gr; c.fillRect(-46,-124,92,92); } R(-6,-84,12,12,'#ffe08a'); break;
    case 'pineapple': E(0,-34,26,34,'#f0a030'); c.strokeStyle='#c87a10'; c.lineWidth=2; for(let i=-3;i<=3;i++){ c.beginPath(); c.moveTo(i*8-12,-64); c.lineTo(i*8+12,-4); c.stroke(); } for(let i=-2;i<=2;i++){ P([i*6-4,-64,i*6+4,-64,i*9,-92-Math.abs(i)*-4],'#3a9a4a'); } R(-7,-22,14,22,'#6a3a1a'); Ci(10,-44,5,'#9ad0e8'); break;
    case 'moai': P([-20,0,20,0,18,-78,-18,-78],'#7a7a72'); R(-22,-82,44,10,'#6a6a62'); R(-16,-60,10,4,'#4a4a44'); R(6,-60,10,4,'#4a4a44'); P([-2,-56,4,-40,-6,-40],'#5a5a54'); R(-10,-28,20,4,'#4a4a44'); break;
    case 'volcano': P([-40,0,40,0,10,-60,-10,-60],'#6a4a3a'); P([-10,-60,10,-60,6,-52,-6,-52],'#ff7a2a'); bubbles(0,-60); break;
    case 'ship': c.save(); c.rotate(-.12); c.fillStyle='#5a3a20'; c.beginPath(); c.moveTo(-60,-30); c.lineTo(60,-30); c.lineTo(46,0); c.lineTo(-48,0); c.closePath(); c.fill(); R(-58,-34,116,5,'#7a5030'); R(-6,-92,5,62,'#4a3018'); P([-2,-88,30,-70,-2,-56],'rgba(230,220,200,.6)'); for(let i=0;i<4;i++) Ci(-36+i*22,-16,4,'#2a1a10'); c.restore(); break;
    case 'sub': E(0,-24,40,16,'#ffd23a'); R(-8,-48,16,14,'#ffd23a'); R(-2,-58,3,12,'#888'); for(let i=0;i<3;i++){ Ci(-18+i*16,-24,5,'#5aa9ff'); } P([-40,-24,-54,-36,-54,-12],'#e0b020'); break;
    case 'neon': R(-44,-60,88,40,'#1a1028'); R(-3,-20,6,20,'#333'); c.shadowColor='#ff5ab0'; c.shadowBlur=10; c.fillStyle='#ff7ac8'; c.font='800 22px system-ui'; c.textAlign='center'; c.fillText('FISH',0,-32); c.shadowBlur=0; break;
    case 'crystal': for(const [cx,ch,cw,cl] of [[-18,60,12,'#9a7aff'],[0,84,16,'#c0a8ff'],[18,54,12,'#7a5ae0'],[-30,34,9,'#b090ff'],[30,38,9,'#a080f0']]){ P([cx-cw,0,cx,-ch,cx+cw,0],cl); } { const gr=c.createRadialGradient(0,-40,2,0,-40,60); gr.addColorStop(0,'rgba(190,160,255,.35)'); gr.addColorStop(1,'rgba(190,160,255,0)'); c.fillStyle=gr; c.fillRect(-60,-100,120,100); } break;
    case 'goldcastle': R(-34,-40,68,40,'#ffcc33'); R(-40,-62,20,62,'#ffd84a'); R(20,-62,20,62,'#ffd84a'); for(const bx of [-40,-30,20,30]) R(bx,-68,8,8,'#ffd84a'); R(-8,-22,16,22,'#a07010'); P([-40,-62,-30,-82,-20,-62],'#d8303a'); P([20,-62,30,-82,40,-62],'#d8303a'); Ci(0,-48,4,'#5aa9ff'); break;
    case 'mermaid': R(-24,-6,48,6,'#8a9aa0'); c.fillStyle='#5ac8b0'; c.beginPath(); c.moveTo(-6,-6); c.quadraticCurveTo(-14,-30,-4,-50); c.lineTo(8,-50); c.quadraticCurveTo(10,-30,6,-6); c.fill(); P([-6,-6,-18,4,6,-6],'#5ac8b0'); R(-6,-66,12,16,'#e8c8a8'); Ci(1,-72,8,'#e8c8a8'); c.fillStyle='#d8503a'; c.beginPath(); c.arc(1,-74,9,Math.PI,0); c.fill(); R(-8,-74,4,20,'#d8503a'); break;
    default: drawDecorX(c,id,t,{R,Ci,E,P});
  }
  c.restore(); }

// ---------- extra pets ----------
function drawPetX(c,id,t,h){ const {el,ci,rc,ln,eye,blink}=h;
  switch(id){
    case 'rabbit': el(0,-6,7,5,'#d8c8b8'); ci(6,-11,4,'#d8c8b8'); el(5,-18,1.5,5,'#d8c8b8',.2); el(8,-18,1.5,5,'#d8c8b8',.4); el(5.5,-18,.7,3.5,'#f0b0b8',.2); ci(-7,-7,2.5,'#fff'); if(!blink) eye(7.5,-12); ci(10,-10.5,.8,'#e88a9a'); break;
    case 'hamster': el(0,-5,7,5.5,'#e0a860'); el(.5,-3.5,4.5,3.5,'#f8e8d0'); ci(-3,-10,1.8,'#e0a860'); ci(3,-10,1.8,'#e0a860'); if(!blink){ eye(2.5,-6.5,.8); eye(-1,-6.5,.8); } ci(1,-4.6,.7,'#d87a8a'); break;
    case 'chicken': rc(-1,-3,1,3,'#e8a020'); rc(2,-3,1,3,'#e8a020'); el(0,-8,6,5,'#f8f4ec'); ci(4,-14,3.4,'#f8f4ec'); c.fillStyle='#d8303a'; c.beginPath(); c.arc(4,-17.5,1.6,0,7); c.arc(2.5,-17,1.4,0,7); c.fill(); c.fillStyle='#e8a020'; c.beginPath(); c.moveTo(7,-14.5); c.lineTo(9.5,-13.5); c.lineTo(7,-12.5); c.fill(); eye(5,-14.8,.7); el(-5,-11,3,4,'#f0e8dc',-.5); break;
    case 'pig': rc(-6,-4,2.5,4,'#e8a0a8'); rc(4,-4,2.5,4,'#e8a0a8'); el(0,-8,8.5,5.5,'#f4b0b8'); ci(8,-10,4.2,'#f4b0b8'); el(11.5,-9.5,2,1.6,'#e88a96'); ci(11.2,-9.6,.5,'#a05060'); ci(12,-9.4,.5,'#a05060'); c.fillStyle='#e8a0a8'; c.beginPath(); c.moveTo(6,-14); c.lineTo(7,-16.5); c.lineTo(8.5,-13.5); c.fill(); eye(9,-11.2,.7); ln([-8,-9,-10,-11,-9,-12],'#e88a96',1.2); break;
    case 'hedgehog': c.fillStyle='#6a4a30'; c.beginPath(); for(let i=0;i<9;i++){ const a=Math.PI+i/8*Math.PI; c.moveTo(Math.cos(a)*5,-4+Math.sin(a)*4); c.lineTo(Math.cos(a)*10,-4+Math.sin(a)*8); c.lineTo(Math.cos(a+.2)*5,-4+Math.sin(a+.2)*4); } c.fill(); el(0,-4,7,4.5,'#7a5a3a'); el(6,-3.5,3.5,2.6,'#e8d0b0'); ci(9.4,-3.5,.8,'#111'); eye(6.5,-4.5,.6); break;
    case 'fox': ln([-7,-6,-13,-9,-15,-14],'#e07a2a',3.2); ci(-15,-14.5,1.6,'#fff'); rc(-5,-5,2,5,'#c86a20'); rc(3,-5,2,5,'#c86a20'); el(0,-8,7,4,'#e07a2a'); ci(7,-12,3.8,'#e07a2a'); c.fillStyle='#e07a2a'; c.beginPath(); c.moveTo(4.5,-14); c.lineTo(5,-19); c.lineTo(7,-15); c.moveTo(7.5,-15); c.lineTo(9.5,-19); c.lineTo(9.5,-14); c.fill(); el(9.5,-10.8,2.4,1.5,'#fff'); ci(11.6,-11,.7,'#111'); if(!blink) eye(8.2,-12.8,.7); break;
    case 'raccoon': ln([-7,-6,-12,-8,-14,-12],'#8a8a8a',3); for(let i=0;i<3;i++) ci(-9-i*2,-7-i*1.6,1,'#333'); el(0,-7,7,4.5,'#8a8a8a'); ci(7,-11,4,'#9a9a9a'); el(7.6,-11.6,3.4,1.4,'#222'); ci(7,-11.8,.7,'#fff'); ci(9,-11.8,.7,'#fff'); ci(10.5,-10,.8,'#111'); c.fillStyle='#8a8a8a'; c.beginPath(); c.moveTo(4.5,-13.5); c.lineTo(5,-17); c.lineTo(7,-14.5); c.fill(); break;
    case 'seal': el(0,-4.5,10,4.5,'#6a7480'); ci(9,-8,4,'#6a7480'); el(-10,-3,3.5,1.6,'#5a6470',-.4); el(3,-1,3,1.3,'#5a6470',.5); if(!blink){ eye(9.5,-9,.9); eye(11.5,-9,.9); } ci(12,-7,.8,'#222'); ln([12,-6.5,15,-6],'#ccc',.5); break;
    case 'redpanda': ln([-7,-6,-12,-7,-14,-11],'#c8502a',3.2); ln([-10,-6.6,-11,-7],'#f0e0c0',3.2); el(0,-7,7,4.2,'#c8502a'); ci(7,-11,4,'#c8502a'); ci(6,-14.5,1.6,'#f0e0c0'); ci(8.6,-14.5,1.6,'#f0e0c0'); el(8.6,-10,2.4,1.6,'#f8f0e0'); ci(10.6,-10.4,.6,'#111'); if(!blink) eye(8.2,-12,.7); break;
    case 'snail': c.fillStyle='#c8905a'; c.beginPath(); c.arc(-1,-6,6,0,7); c.fill(); c.strokeStyle='#8a5a2a'; c.lineWidth=1.2; c.beginPath(); for(let a=0;a<12;a+=.3){ const r=a*.45; c.lineTo(-1+Math.cos(a)*r,-6+Math.sin(a)*r); } c.stroke(); el(4,-1,7,1.8,'#a8c098'); ln([8,-2,9,-7],'#a8c098',.9); ln([9.5,-2,11,-6],'#a8c098',.9); ci(9,-7,.8,'#111'); ci(11,-6,.8,'#111'); break;
    case 'bat': { const f=Math.sin(t*10)*3; c.translate(0,-14+Math.sin(t*2)*2); el(0,0,3.5,4.5,'#4a3a5a'); c.fillStyle='#3a2a4a'; c.beginPath(); c.moveTo(-2,-1); c.lineTo(-11,-4-f); c.lineTo(-8,1); c.lineTo(-5,0); c.lineTo(-3,3); c.fill(); c.beginPath(); c.moveTo(2,-1); c.lineTo(11,-4-f); c.lineTo(8,1); c.lineTo(5,0); c.lineTo(3,3); c.fill(); ci(-1.2,-1.5,.7,'#ffe060'); ci(1.2,-1.5,.7,'#ffe060'); break; }
    case 'axopet': el(0,-4,8,3.6,'#ffb0d0'); el(8,-5,4,3.2,'#ffb0d0'); for(const [dx,dy] of [[5,-9],[7,-10],[9,-9]]) ln([dx,-7,dx-1,dy],'#ff6aa0',1.2); ln([-8,-4,-13,-3],'#ffb0d0',2); eye(9.5,-5.5,.7); ln([10,-3.2,11.5,-3.6],'#d05a80',.6); break;
    case 'flamingo': ln([0,-14,-1,0],'#f08aa0',1.2); ln([2,-14,2,-6,0,-4],'#f08aa0',1.2); el(0,-17,6,3.5,'#ff9ab0'); ln([4,-18,6,-26,8,-26],'#ff9ab0',2.4); ci(8.5,-27,2.4,'#ff9ab0'); c.fillStyle='#2a2a2a'; c.beginPath(); c.moveTo(10,-27); c.lineTo(12.5,-25); c.lineTo(10,-25.5); c.fill(); eye(8.6,-27.6,.6); break;
    case 'pelican': rc(-2,-4,1.4,4,'#e8a020'); rc(2,-4,1.4,4,'#e8a020'); el(0,-10,6.5,6,'#f4f4ee'); ci(3,-18,3.4,'#f4f4ee'); c.fillStyle='#f0b030'; c.beginPath(); c.moveTo(5,-18.5); c.lineTo(15,-16); c.quadraticCurveTo(10,-11,5,-15); c.fill(); eye(3.5,-19,.7); break;
    case 'panda': el(0,-7,8,5.5,'#f4f4f2'); el(-2,-7,4,5.5,'#1a1a1a'); ci(7,-12,4.4,'#f4f4f2'); ci(4.5,-15.5,1.8,'#1a1a1a'); ci(9.5,-15.5,1.8,'#1a1a1a'); el(8.2,-12.5,1.6,1.2,'#1a1a1a'); ci(8.2,-12.6,.5,'#fff'); ci(10.5,-11,.7,'#111'); rc(-6,-3,3,3,'#1a1a1a'); rc(3,-3,3,3,'#1a1a1a'); break;
    case 'koala': el(0,-7,6,6,'#9aa0a8'); ci(1,-15,4.5,'#9aa0a8'); ci(-3,-17.5,2.6,'#9aa0a8'); ci(5,-17.5,2.6,'#9aa0a8'); ci(-3,-17.5,1.4,'#e8d8d8'); ci(5,-17.5,1.4,'#e8d8d8'); el(1.6,-14,1.5,2,'#333'); if(blink){ ln([-1,-16,0,-16],'#111',.6); ln([2.5,-16,3.5,-16],'#111',.6); } else { eye(-.4,-16,.6); eye(3,-16,.6); } break;
    case 'monkey': ln([-5,-6,-10,-4,-11,-10,-8,-11],'#7a4a2a',1.6); el(0,-7,5,6,'#7a4a2a'); ci(1,-15,4,'#7a4a2a'); el(2,-14.5,3,2.6,'#e8c8a0'); ci(-3,-15,1.8,'#e8c8a0'); ci(5,-15,1.8,'#e8c8a0'); eye(1,-15.4,.6); eye(3.2,-15.4,.6); break;
    case 'polarbear': el(0,-7,9,5.5,'#f4f6f8'); ci(8,-11,4.6,'#f4f6f8'); ci(5.5,-15,1.6,'#f4f6f8'); el(11,-10,2.4,1.8,'#e8ecf0'); ci(12.6,-10.4,.8,'#111'); eye(8.8,-12.4,.7); rc(-7,-3,3,3,'#e8ecf0'); rc(4,-3,3,3,'#e8ecf0'); break;
    case 'octopus': for(let i=0;i<6;i++){ ln([-5+i*2,-4,-7+i*2.8+Math.sin(t*3+i)*1.5,1],'#c84a8a',2); } el(0,-9,6.5,6,'#e05a9a'); if(!blink){ ci(-2,-9,1.6,'#fff'); ci(2.5,-9,1.6,'#fff'); eye(-1.8,-9,.8); eye(2.7,-9,.8); } break;
    case 'ghost': { c.translate(0,Math.sin(t*2)*2-4); c.globalAlpha*=.85; c.fillStyle='#f4f6ff'; c.beginPath(); c.arc(0,-10,7,Math.PI,0); c.lineTo(7,0); for(let i=0;i<4;i++) c.lineTo(7-(i+.5)*3.5,(i%2?0:-2.5)); c.lineTo(-7,0); c.fill(); c.globalAlpha/=.85; eye(-2.4,-11,1); eye(2.4,-11,1); el(0,-7.5,1.4,1.8,'#333'); break; }
    case 'robot': rc(-5,-3,2.5,3,'#6a7480'); rc(2.5,-3,2.5,3,'#6a7480'); rc(-6,-12,12,9,'#9aa8b8'); rc(-5,-20,10,8,'#b8c4d0'); ln([0,-20,0,-24],'#6a7480',1); ci(0,-25,1.4,Math.sin(t*4)>0?'#ff5a5a':'#5aff8a'); ci(-2.2,-16,1.3,'#5ad8ff'); ci(2.2,-16,1.3,'#5ad8ff'); rc(-3,-9,6,2,'#5a646c'); break;
    case 'slime': { const sq=1+Math.sin(t*3)*.08; c.scale(1/sq,sq); c.globalAlpha*=.9; c.fillStyle='#6ae08a'; c.beginPath(); c.moveTo(-8,0); c.quadraticCurveTo(-8,-12,0,-12); c.quadraticCurveTo(8,-12,8,0); c.closePath(); c.fill(); c.globalAlpha/=.9; ci(-2.5,-6,1.2,'#111'); ci(2.5,-6,1.2,'#111'); ci(-4,-9,1.4,'rgba(255,255,255,.7)'); break; }
    case 'dragon': { const f=Math.sin(t*6)*2; ln([-7,-7,-13,-6,-16,-10],'#c83a3a',2.4); c.fillStyle='#e05a3a'; c.beginPath(); c.moveTo(-2,-11); c.lineTo(-9,-20-f); c.lineTo(-4,-13); c.fill(); c.beginPath(); c.moveTo(1,-11); c.lineTo(-2,-21-f); c.lineTo(3,-12); c.fill(); el(0,-7,7,4.6,'#e05a3a'); el(.5,-5,4,2,'#ffc070'); ci(7,-12,4,'#e05a3a'); el(10.5,-11,2.6,1.8,'#e05a3a'); ln([5,-15,4,-18],'#ffc070',1.2); ln([7.5,-15.5,7.5,-18.5],'#ffc070',1.2); if(!blink) eye(8,-13,.8); rc(-5,-3,2,3,'#c83a3a'); rc(3,-3,2,3,'#c83a3a'); if(Math.sin(t*1.3)>.92){ ci(14,-11,1.4,'#ffb040'); ci(16,-12,1,'#ffe060'); } break; }
    default: drawPetY(c,id,t,h); break;
    case 'unicorn': ln([-9,-16,-14,-12,-13,-6],'#c8a0ff',2.4); for(const lx of [-7,-3,4,8]) rc(lx-1,-12,2.4,12,'#f4f0ff'); el(0,-15,10,5.5,'#f8f6ff'); c.fillStyle='#f8f6ff'; c.beginPath(); c.moveTo(6,-17); c.lineTo(10,-27); c.lineTo(14,-25); c.lineTo(10,-14); c.fill(); el(13,-26,4,2.6,'#f8f6ff',.4); c.fillStyle='#ffd84a'; c.beginPath(); c.moveTo(13,-28.5); c.lineTo(16,-35); c.lineTo(14.6,-28); c.fill(); ln([8,-21,10,-28],'#ff9ad8',2); ln([7,-19,9,-25],'#9ad8ff',1.6); eye(13.5,-27,.7); if(Math.sin(t*2)>.6){ ci(-12,-20,1,'#ffe9a8'); ci(17,-31,1,'#ffe9a8'); } break;
  }
}

// ---------- scene chip (time & weather, shown on narrow screens) ----------
function drawSceneChip(p,wx){ if(W>=700) return; const nf=nextFlip(); const txt=tod(p)+' · '+wxName(wx.k)+' · '+mmss(wxLeft()); g.font='700 11px system-ui'; const tw=g.measureText(txt).width; g.fillStyle='rgba(5,14,20,.6)'; rr(10,10,tw+16,20,10); g.fill(); g.fillStyle=wx.k==='Gilded'?'#ffc94d':'#e6efe8'; g.textAlign='left'; g.fillText(txt,18,24); }

// ---------- random events & mini-games ----------
let pendingEvent=null, catchesSinceEvent=0;
function afterCard(){ catchesSinceEvent++; if(pendingEvent){ const ev=pendingEvent; pendingEvent=null; openEvent(ev); return; }
  if(S.stats.caught>=5 && catchesSinceEvent>=6 && Math.random()<.12){ catchesSinceEvent=0; openEvent(Math.random()<.55?'frenzy':'chests'); } }
function openEvent(kind){ const box=$('evin'); G.st='event';
  if(kind==='frenzy'){ box.innerHTML=`<div class="rar" style="color:var(--gold)">Mini-game</div><h3>Fish frenzy!</h3><p class="sub">A shoal is leaping out of the water. Tap as many fish as you can in 10 seconds. Every fish is worth coins.</p><div class="row" style="justify-content:center;margin-top:12px"><button class="btn" data-ev="frenzy">Let’s go!</button><button class="btn alt" data-ev="skip">Not now</button></div>`; }
  else { box.innerHTML=`<div class="rar" style="color:var(--gold)">Mini-game</div><h3>Three chests washed up</h3><p class="sub">Only one holds the big prize. Pick one.</p><div class="chests">${[0,1,2].map(i=>`<button data-ev="chest" data-i="${i}" aria-label="Chest ${i+1}"><canvas width="192" height="144" data-chest></canvas></button>`).join('')}</div><div class="row" style="justify-content:center"><button class="btn alt" data-ev="skip">Leave them</button></div>`;
    box.querySelectorAll('canvas[data-chest]').forEach(c=>{ const cx=c.getContext('2d'); drawJunk(cx,c.width,c.height,'chest'); }); }
  $('evcard').hidden=false; sfx.hot(); }
function closeEvent(){ $('evcard').hidden=true; if(G.st==='event') G.st='idle'; }
$('evcard').addEventListener('click',e=>{ const b=e.target.closest('[data-ev]'); if(!b) return; const ev=b.dataset.ev; startAudio();
  if(ev==='skip'){ closeEvent(); return; }
  if(ev==='frenzy'){ closeEvent(); G.st='frenzy'; G.fz={t:0,dur:10,next:0,jumpers:[],caught:0}; toast('Tap the leaping fish!'); return; }
  if(ev==='chest'){ const L=curLoc(); const base=bestLoot(); const prizes=[{k:'big',txt:'',run:()=>{ const c=earn(base*rnd(6,10)*coinMult()); return '+'+fmt(c)+' coins!'; }},
      {k:'lure',run:()=>{ const opts=Object.keys(BAIT).filter(k=>k!=='worm'&&!BAIT[k].junk); const k=pick(opts); S.bait[k]+=6; return '6 '+BAIT[k].name; }},
      {k:'boost',run:()=>{ const fo=pick(FORTUNES); addBuff(fo[1],fo[2],10,'Lucky chest'); return 'Boost: '+fmtB(fo[1],fo[2])+' for 10 min'; }}];
    for(let i=prizes.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [prizes[i],prizes[j]]=[prizes[j],prizes[i]]; }
    const pickI=+b.dataset.i; const won=prizes[pickI].run(); S.gstats.chests++; sfx.coin(); sfx.catch(prizes[pickI].k==='big'?4:2);
    const labels=prizes.map(p=>p.k==='big'?'Big coin prize':p.k==='lure'?'Lure pack':'Lucky boost');
    $('evin').innerHTML=`<h3>${prizes[pickI].k==='big'?'Jackpot!':'Not bad!'}</h3><p class="sub">You got: <b>${esc(won)}</b></p><div class="badges" style="margin:10px 0">${labels.map((l,i)=>`<span class="badge ${i===pickI?'g':''}">Chest ${i+1}: ${l}</span>`).join('')}</div><button class="btn" data-ev="skip">Keep fishing</button>`;
    renderBait(); checkFeats(); save(); lastHud=''; return; } });
function updateEvents(dt){
  if(G.st==='frenzy' && G.fz){ const fz=G.fz; fz.t+=dt; fz.next-=dt; if(fz.next<=0 && fz.t<fz.dur-.8){ fz.next=rnd(.25,.5); const pool=SP.filter(s=>s.loc===S.loc&&s.r<=1); /* 0.3.2: about one in nine leapers is shiny: worth 5 fish, quicker, and on a trickier path */ const sh=Math.random()<.11, pat=sh?pick(['skip','zig','high']):(Math.random()<.25?pick(['skip','zig']):'arc'); fz.jumpers.push({p:rnd(.15,.98), t:0, dur:sh?rnd(.8,1.15):rnd(1.1,1.7), h:rnd(.1,.24), sp:pick(pool), hit:0, sh, pat}); }
    for(const j of fz.jumpers) j.t+=dt; fz.jumpers=fz.jumpers.filter(j=>j.t<j.dur && !(j.hit && j.t-j.hit>.4));
    if(fz.t>=fz.dur){ const each=bestLoot()*.25, shN=fz.sh||0; const coins=earn((fz.caught+shN*4)*each*coinMult()); S.gstats.frenzy++; S.gstats.frenzyFish+=fz.caught; G.st='idle'; G.fz=null; sfx.catch(fz.caught>=10?4:2);
      toast('Frenzy over: '+fz.caught+' fish'+(shN?' ('+shN+' shiny!)':'')+', +'+fmt(coins)+' coins'); checkFeats(); save(); lastHud=''; } }
  if(G.star){ G.star.t+=dt; if(G.star.t>G.star.dur) G.star=null; }
  else if(nightness(phase())>.7 && (G.st==='idle'||G.st==='waiting') && Math.random()<dt/80){ G.star={x0:rnd(.3,.9)*W, y0:rnd(.04,.16)*H, t:0, dur:2.8}; }
}
function jumperPos(j){ const k=j.t/j.dur, bx=castX(j.p), wy=waterY(bx), hh=H*j.h;
  if(j.pat==='skip'){ const hop=k<.42?k/.42:(k-.42)/.58, ht=k<.42?.5:1; return {x:bx+(k-.5)*56, y:wy-Math.sin(hop*Math.PI)*hh*ht, k}; }
  if(j.pat==='zig') return {x:bx+(k-.5)*24+Math.sin(k*Math.PI*3)*22, y:wy-Math.sin(k*Math.PI)*hh*1.1, k};
  if(j.pat==='high') return {x:bx+(k-.5)*48, y:wy-Math.sin(k*Math.PI)*hh*1.6, k};
  return {x:bx+(k-.5)*30, y:wy-Math.sin(k*Math.PI)*hh, k}; }
function starPos(){ const s=G.star, k=s.t/s.dur; return {x:s.x0-k*W*.35, y:s.y0+k*H*.12, k}; }
function canvasXY(e){ const r=cv.getBoundingClientRect(); return {x:e.clientX-r.left, y:e.clientY-r.top}; }
function frenzyHit(e){ if(!e||!G.fz) return; const m=canvasXY(e); let best=null, bd=38*38; for(const j of G.fz.jumpers){ if(j.hit) continue; const p=jumperPos(j); const d=(p.x-m.x)**2+(p.y-m.y)**2; if(d<bd){ bd=d; best=j; } }
  if(best){ best.hit=best.t; G.fz.caught++; if(best.sh){ G.fz.sh=(G.fz.sh||0)+1; sfx.shiny(); } const p=jumperPos(best); splash(p.x,p.y,best.sh?18:10); tone(900+G.fz.caught*30,.08,'triangle',.06); } }
function starHit(e){ if(!e||!G.star) return false; const m=canvasXY(e), p=starPos(); if((p.x-m.x)**2+(p.y-m.y)**2>44*44) return false;
  const fo=pick(FORTUNES); addBuff(fo[1],fo[2],10,'Falling star'); S.gstats.stars++; G.star=null; sfx.shiny(); toast('You caught a falling star! Your wish: '+fmtB(fo[1],fo[2])+' for 10 min'); checkFeats(); save(); lastHud=''; return true; }
function drawEvents(t){ drawWeatherX(t,weather(),HZ());
  if(G.star){ const p=starPos(); const a=Math.sin(p.k*Math.PI); const gr=g.createLinearGradient(p.x,p.y,p.x+70,p.y-24); gr.addColorStop(0,'rgba(255,245,200,'+a+')'); gr.addColorStop(1,'rgba(255,245,200,0)'); g.strokeStyle=gr; g.lineWidth=3; g.beginPath(); g.moveTo(p.x,p.y); g.lineTo(p.x+70,p.y-24); g.stroke(); g.fillStyle='rgba(255,250,220,'+a+')'; g.beginPath(); g.arc(p.x,p.y,3.5,0,7); g.fill(); }
  if(G.st==='frenzy' && G.fz){ for(const j of G.fz.jumpers){ const p=jumperPos(j); g.save(); g.translate(p.x,p.y); if(j.hit){ g.globalAlpha=Math.max(0,1-(j.t-j.hit)/.4); g.fillStyle='#ffc94d'; g.font='800 '+(j.sh?20:16)+'px system-ui'; g.textAlign='center'; g.fillText(j.sh?'+5 ✦':'+1',0,-14-(j.t-j.hit)*40); }
      else { if(j.sh){ v3glow(g,0,0,30,'rgba(255,224,120,.95)',.55+.25*Math.sin(t*14)); } g.rotate(-Math.cos(p.k*Math.PI)*.9); drawCreature(g,j.sp,0,0,j.sh?34:30,{wag:t*(j.sh?28:20),flip:true,shiny:j.sh}); } g.restore(); } } }
function drawFrenzyHUD(t){ const fz=G.fz; if(!fz) return; const left=Math.max(0,fz.dur-fz.t); const txt='Fish frenzy  ·  '+fz.caught+' caught  ·  '+left.toFixed(1)+' s'; g.font='800 15px "Bricolage Grotesque", system-ui'; const tw=g.measureText(txt).width;
  g.fillStyle='rgba(5,14,20,.78)'; rr(W/2-tw/2-14,12,tw+28,30,15); g.fill(); g.fillStyle='#ffc94d'; g.textAlign='center'; g.fillText(txt,W/2,32); }

// ---------- boardwalk: wheel, crates, coin flip, scratch card ----------
const WHEEL = [['Coins ×2',22,'#3a6f9a'],['Seashell',16,'#6a7680'],['Lure pack',14,'#4f8a4a'],['Coins ×6',12,'#7a4a9a'],['Lucky boost',12,'#2a8aa8'],['Small crate',10,'#c8553a'],['Big crate',4,'#d87aa0'],['JACKPOT ×40',2,'#d8a020']];
const WHEEL_FREE_MS = 4*3600*1000;
const wheelCost = () => Math.round(bestLoot()*3);
const crateCost = k => Math.round(bestLoot()*({small:5,big:25,legend:120}[k]));
let WH={angle:0, spinning:false, result:''}, crateRes=null, flipRes=null, scratch=null;
function drawWheel(){ const c=$('wheelcv'); if(!c) return; const x=c.getContext('2d'), w=c.width, r=w/2-14; x.clearRect(0,0,w,w); x.save(); x.translate(w/2,w/2);
  const tot=WHEEL.reduce((a,s)=>a+s[1],0); let a0=WH.angle; for(const s of WHEEL){ const a1=a0+s[1]/tot*Math.PI*2; x.fillStyle=s[2]; x.beginPath(); x.moveTo(0,0); x.arc(0,0,r,a0,a1); x.closePath(); x.fill(); x.strokeStyle='#0a161d'; x.lineWidth=3; x.stroke();
    x.save(); x.rotate((a0+a1)/2); x.fillStyle='#fff'; x.font='700 '+(w/24|0)+'px system-ui'; x.textAlign='right'; x.fillText(s[0],r-12,6); x.restore(); a0=a1; }
  x.fillStyle='#0a161d'; x.beginPath(); x.arc(0,0,w*.08,0,7); x.fill(); x.fillStyle='#ffc94d'; x.beginPath(); x.arc(0,0,w*.05,0,7); x.fill(); x.restore();
  x.fillStyle='#ff6a3d'; x.beginPath(); x.moveTo(w/2-16,4); x.lineTo(w/2+16,4); x.lineTo(w/2,34); x.closePath(); x.fill(); }
function spinWheel(paid){ if(WH.spinning) return; const tot=WHEEL.reduce((a,s)=>a+s[1],0); let x=Math.random()*tot, idx=0; for(let i=0;i<WHEEL.length;i++){ x-=WHEEL[i][1]; if(x<=0){ idx=i; break; } }
  let start=0; for(let i=0;i<idx;i++) start+=WHEEL[i][1]/tot*Math.PI*2; const mid=start+WHEEL[idx][1]/tot*Math.PI*2*rnd(.2,.8);
  const target = -Math.PI/2 - mid; const from=WH.angle; let to=target; while(to<from+Math.PI*8) to+=Math.PI*2;
  WH.spinning=true; WH.result=''; const t0=performance.now(), dur=3800; let lastTick=0;
  const step=()=>{ const k=Math.min(1,(performance.now()-t0)/dur), e=1-Math.pow(1-k,3.4); WH.angle=from+(to-from)*e; drawWheel(); const seg=Math.floor(WH.angle/(Math.PI/6)); if(seg!==lastTick){ lastTick=seg; tone(1500,.02,'square',.02); }
    if(k<1) (window.requestAnimationFrame||setTimeout)(step,16); else { WH.spinning=false; WH.angle%=Math.PI*2; WH.result=wheelPrize(idx); S.gstats.spins++; checkFeats(); save(); lastHud=''; if(S.tab==='games') renderPanel(); } };
  step(); }
function wheelPrize(i){ const base=bestLoot(); sfx.coin();
  switch(i){
    case 0: return '+'+fmt(bwEarn(base*2*coinMult()))+' coins';
    case 1: addTickets(10); return quip('seashell')+' (+10 tickets)';
    case 2: { const opts=Object.keys(BAIT).filter(k=>k!=='worm'&&!BAIT[k].junk); const k=pick(opts); S.bait[k]+=8; renderBait(); return '8 '+BAIT[k].name; }
    case 3: return '+'+fmt(bwEarn(base*6*coinMult()))+' coins';
    case 4: { const fo=pick(FORTUNES); addBuff(fo[1],fo[2],15,'Lucky wheel'); return 'Boost: '+fmtB(fo[1],fo[2])+' for 15 min'; }
    case 5: S.tokens.small++; return 'A small Mystery Crate (open it below)';
    case 6: S.tokens.big++; return 'A BIG Mystery Crate (open it below)';
    default: sfx.shiny(); return 'JACKPOT! +'+fmt(bwEarn(base*40*coinMult()))+' coins';
  } }
function openCrate(k){ const base=bestLoot(); const r=Math.random(); let res={title:'',draw:null};
  const petPool=tier=>PETS.filter(p=>p.src==='crate' && p.price<=tier && !S.owned.pets.includes(p.id));
  const cosmetic=()=>{ const pool=[...SHOP_COLS.filter(c=>!S.owned.cols.includes(c[0])).map(c=>['col',c[0],c[1]]), ...PATTERNS.filter(p=>p[2]&&!S.owned.pats.includes(p[0])).map(p=>['pat',p[0],p[1]+' fabric']), ...HATS.filter(h=>h.src==='shop'&&!S.owned.hats.includes(h.id)).map(h=>['hat',h.id,h.name])]; if(!pool.length) return null;
    const it=pick(pool); if(it[0]==='col') S.owned.cols.push(it[1]); else if(it[0]==='pat') S.owned.pats.push(it[1]); else S.owned.hats.push(it[1]); return {title:'New '+(it[0]==='hat'?'hat':'clothing')+': '+it[2], kind:it[0], id:it[1]}; };
  const decor=(rare)=>{ const pool=DECOR.filter(d=>!S.aq.owned.includes(d.id) && (rare ? true : d.price>0)); if(!pool.length) return null; const d=rare && pool.some(x=>!x.price) && Math.random()<.6 ? pick(pool.filter(x=>!x.price)) : pick(pool); S.aq.owned.push(d.id); return {title:'Aquarium decor: '+d.name+' (+'+Math.round(d.b*100)+'% income)', kind:'decor', id:d.id}; };
  const pet=(tier,legendBias)=>{ let pool=petPool(tier); if(legendBias){ const top=pool.filter(p=>p.price===3); if(top.length && Math.random()<.35) pool=top; } if(!pool.length) return null; const p=pick(pool); S.owned.pets.push(p.id); return {title:'New pet: '+p.name+'!', kind:'pet', id:p.id}; };
  const coins=(a,b)=>({title:'+'+fmt(earn(base*rnd(a,b)*coinMult()))+' coins', kind:'coins'});
  const lure=()=>{ const opts=Object.keys(BAIT).filter(x=>x!=='worm'); const kk=pick(opts); const n=BAIT[kk].junk?4:10; S.bait[kk]+=n; renderBait(); return {title:n+' '+BAIT[kk].name, kind:'lure'}; };
  if(k==='small') res = r<.4?coins(2,9) : r<.62?lure() : r<.8?(cosmetic()||coins(3,8)) : r<.92?(decor(false)||coins(3,8)) : (pet(1)||coins(6,12));
  else if(k==='big') res = r<.25?coins(15,45) : r<.45?(cosmetic()||coins(15,40)) : r<.65?(decor(false)||coins(15,40)) : r<.92?(pet(2)||coins(25,50)) : (decor(true)||coins(25,50));
  else res = (r<.1 && grantRod('golden')) || (r<.45?(pet(3,true)||coins(150,300)) : r<.75?(decor(true)||coins(150,300)) : coins(100,300));
  S.gstats.crates++; sfx.catch(k==='legend'?4:k==='big'?3:2); if(res.kind==='pet'||res.kind==='decor') sfx.shiny(); crateRes=Object.assign({crate:k},res); }
function newScratch(){ const sym=['🐟','🦀','🐚','💎','👑'], prize=[2,4,8,20,60], ws=[50,25,15,8,2]; const win=Math.random()<.35; let w=-1; if(win){ let x=Math.random()*100; w=0; for(let i=0;i<5;i++){ x-=ws[i]; if(x<=0){ w=i; break; } } }
  const cells=[]; if(win) cells.push(w,w,w); const cnt=[0,0,0,0,0]; if(win) cnt[w]=3; while(cells.length<9){ const s=Math.floor(Math.random()*5); if(s===w || cnt[s]>=2) continue; cnt[s]++; cells.push(s); }
  for(let i=cells.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [cells[i],cells[j]]=[cells[j],cells[i]]; }
  scratch={cells, open:Array(9).fill(false), win:w, prize:w>=0?Math.round(bestLoot()*prize[w]*coinMult()):0, done:false, sym}; }
function renderGames(P){ const free=Date.now()-S.wheelT>=WHEEL_FREE_MS, wait=Math.ceil((WHEEL_FREE_MS-(Date.now()-S.wheelT))/1000); const tk=S.tokens; const base=bestLoot();
  const crateRow=(k,name,desc)=>`<div class="row spread" style="padding:6px 0;border-bottom:1px solid var(--line)"><div style="min-width:0"><b>${name}</b>${tk[k]?` <span class="badge g">${tk[k]} free</span>`:''}<div class="meta">${desc}</div></div>
    ${tk[k]?`<button class="btn sm" data-act="crate" data-k="${k}" data-free="1">Open free</button>`:`<button class="btn sm" data-act="crate" data-k="${k}" ${S.money>=crateCost(k)?'':'disabled'}>Open · <span class="coin">${fmt(crateCost(k))}</span></button>`}</div>`;
  const betBtn=f=>{ const amt=Math.min(Math.floor(S.money*f), base*60); return `<button class="btn alt sm" data-act="flip" data-k="${f}" ${amt>=10?'':'disabled'}>Bet ${Math.round(f*100)}% · <span class="coin">${fmt(Math.max(0,amt))}</span></button>`; };
  P.innerHTML=`<h2>Boardwalk</h2><p class="sub">Games of chance on the pier, for coins only. Prices grow with the best water you’ve unlocked. Angler ranks hand out free crates.</p>
  <div class="grid">
   <div class="tile"><h4>Lucky wheel</h4><div class="wheelwrap"><canvas id="wheelcv" width="520" height="520"></canvas>
     ${free?`<button class="btn" data-act="spin" data-k="free" ${WH.spinning?'disabled':''}>Free spin!</button>`:`<button class="btn" data-act="spin" ${WH.spinning||S.money<wheelCost()?'disabled':''}>Spin · <span class="coin">${fmt(wheelCost())}</span></button><span class="meta">Next free spin in ${Math.floor(wait/3600)?Math.floor(wait/3600)+' h ':''}${Math.ceil(wait%3600/60)} min</span>`}
     ${WH.result?`<div class="val" style="text-align:center">${esc(WH.result)}</div>`:''}</div></div>
   <div class="tile"><h4>Mystery crates</h4><div class="meta">Coins, lures, clothes, aquarium decor, and pets you can’t get anywhere else.</div>
     ${crateRow('small','Small crate','Mostly coins and lures. Sometimes a pet.')}${crateRow('big','Big crate','Clothes, decor, and the rarer pets.')}${crateRow('legend','Legendary crate','Dragons, unicorns, crystal caves.')}
     ${crateRes?`<div class="reveal" style="text-align:center;margin-top:8px"><canvas width="240" height="180" id="crateprev"></canvas><div class="val">${esc(crateRes.title)}</div></div>`:''}</div>
   <div class="tile"><h4>Coin flip with the Fishmonger</h4><div class="meta">Heads you double it, tails he keeps it. A fair coin, he swears.</div>
     <div class="row">${betBtn(.1)}${betBtn(.25)}${betBtn(.5)}</div>${flipRes?`<div class="val" style="font-size:18px;color:${flipRes.win?'var(--gold)':'var(--muted)'}">${esc(flipRes.txt)}</div>`:''}
     <div class="meta">${S.gstats.flips} flips · ${S.gstats.flipWins} won</div></div>
   <div class="tile"><h4>Scratch card</h4><div class="meta">Find three of the same: 🐟 ×2 · 🦀 ×4 · 🐚 ×8 · 💎 ×20 · 👑 ×60 (times ${fmt(base)} coins).</div>
     ${scratch&&!scratch.done?`<div class="scratch">${scratch.cells.map((s,i)=>`<button data-act="scratch" data-i="${i}" class="${scratch.open[i]?'open':''}" aria-label="Scratch box ${i+1}">${scratch.open[i]?scratch.sym[s]:''}</button>`).join('')}</div><div class="row" style="justify-content:center"><button class="btn alt sm" data-act="scratchall">Reveal all</button></div>`
      :`${scratch&&scratch.done?`<div class="scratch">${scratch.cells.map(s=>`<button class="open" disabled>${scratch.sym[s]}</button>`).join('')}</div><div class="val" style="text-align:center;color:${scratch.win>=0?'var(--gold)':'var(--muted)'}">${scratch.win>=0?'Winner! +'+fmt(scratch.prize)+' coins':'No match this time.'}</div>`:''}
      <button class="btn" data-act="buyscratch" ${S.money>=base*2?'':'disabled'}>Buy a card · <span class="coin">${fmt(base*2)}</span></button>`}</div>
  </div>`;
  drawWheel(); const cp=$('crateprev'); if(cp&&crateRes){ const x=cp.getContext('2d'); const k=crateRes.kind;
    if(k==='pet') drawPet(x,crateRes.id,120,160,crateRes.id==='unicorn'?3.4:5,0); else if(k==='decor') drawDecor(x,crateRes.id,120,170,1.6,0); else if(k==='hat') hatPreview(x,240,180,crateRes.id,S.look.hatCol,true);
    else if(k==='col'){ x.fillStyle=crateRes.id; x.beginPath(); x.arc(120,90,50,0,7); x.fill(); } else drawJunk(x,240,180,k==='lure'?'goldlure':'chest'); } }
function settleScratch(){ if(!scratch||scratch.done) return; scratch.done=true; S.gstats.scratch++; if(scratch.win>=0){ bwEarn(scratch.prize); S.gstats.scratchWins++; sfx.catch(scratch.win>=3?4:2); } else sfx.lost(); }

// ---------- settings ----------
function renderSettings(P){ const s=S.settings; const sl=(k,label)=>`<div class="setrow"><label for="set_${k}">${label}</label><input id="set_${k}" type="range" min="0" max="100" value="${Math.round(s[k]*100)}" data-set="${k}"><span class="meta" id="setv_${k}">${Math.round(s[k]*100)}%</span></div>`;
  const tg=(k,label,desc)=>`<div class="toggle"><div><b>${label}</b><div class="meta">${desc}</div></div><button class="btn ${s[k]?'':'alt'} sm" data-act="tog" data-k="${k}" aria-pressed="${!!s[k]}">${s[k]?'On':'Off'}</button></div>`;
  const styles=V3ON?MUS_NAMES:[['auto','Follow the time of day'],['lofi','Cozy lo-fi'],['acoustic','Harbour acoustic'],['night','Dreamy night']];
  P.innerHTML=`<h2>Settings</h2><p class="sub">Everything here is saved on this device.</p>
  <div class="tile" style="margin-top:10px;flex-direction:row;align-items:center;justify-content:space-between;gap:10px;flex-wrap:wrap"><div><b>📲 Move progress</b><div class="meta">Send your progress between phone and PC with a 6-digit code, or use save codes.</div></div><button class="btn sm" data-tabgo="save">Open</button></div>
  <div class="tile" style="margin-top:10px"><b>🎁 Gift code</b><div class="meta">Got a gift code from a friend? Type it here.</div><div class="row" style="gap:8px;margin-top:8px;flex-wrap:nowrap"><input id="giftin" maxlength="24" placeholder="Gift code" autocapitalize="characters" style="flex:1;min-width:0;background:#0a161d;color:var(--ink);border:1px solid var(--line);border-radius:9px;padding:8px;text-transform:uppercase"><button class="btn sm" data-act="redeem">Redeem</button></div></div>
  <div class="grid" style="grid-template-columns:repeat(auto-fill,minmax(300px,1fr))">
   <div class="tile"><h4>Sound</h4>${sl('master','Master volume')}${sl('music','Music')}${sl('sfx','Sound effects')}${sl('amb','Nature sounds')}
     ${tg('musicOn','Music','Calm music that plays while you fish.')}${tg('ambient','Nature sounds','Waves, birds, crickets and wind for each water.')}
     <h5>Music style</h5><div class="chips">${styles.map(([k,n])=>`<button class="chipb" data-act="mstyle" data-k="${k}" aria-pressed="${s.style===k}">${n}</button>`).join('')}</div></div>
   ${V3ON?`<div class="tile"><h4>Controls</h4><h5>Casting</h5><div class="chips"><button class="chipb" data-act="castmode" data-k="meter" aria-pressed="${s.castMode!=='aim'}">Power meter</button><button class="chipb" data-act="castmode" data-k="aim" aria-pressed="${s.castMode==='aim'}">Tap to aim</button></div><div class="meta" style="margin-top:6px">${s.castMode==='aim'?'Tap the spot on the water you want. The line lands close to it, never quite perfect.':'Hold to fill the meter, let go at the right moment.'}</div>${tg('vibrate','Vibration','Phones buzz on a bite, when the line is close to snapping, and on a catch.')}<div class="meta" style="margin-top:6px">Reel by <b>holding</b>, by <b>drawing circles</b> on the water like a crank, or with the <b>mouse wheel</b>. Controllers work too: <b>A</b> casts and reels, the <b>right trigger</b> reels with pressure.</div></div>`:''}
   <div class="tile"><h4>Display</h4>${tg('effects','Weather effects','Rain, snow, lightning flashes and sparkles.')}${tg('boostsOnScreen','Boost timers on screen','Show active boosts in the corner of the water.')}${tg('hints','Hints','The help line under the water.')}
     <div class="toggle"><div><b>Full screen</b><div class="meta">Fill the whole screen with the game.</div></div><button class="btn alt sm" data-act="fullscreen">Toggle</button></div></div>
   <div class="tile"><h4>Gameplay</h4>${tg('protectRare','Protect rare fish','“Sell all” keeps Epic, Legendary and shiny fish in your cooler.')}${tg('minigames','Mini-games','Now and then a mini-game pops up between catches. Turn this off and they never will.')}
     </div>
   <div class="tile"><h4>Patch notes</h4><div class="meta">You’re on Driftline ${GAME_VERSION}.</div>${allPatchesHTML()}</div>
  </div>${dangerHTML()}`; }
$('panel').addEventListener('input',e=>{ const el=e.target.closest('[data-set]'); if(!el) return; const k=el.dataset.set; S.settings[k]=(+el.value)/100; const v=$('setv_'+k); if(v) v.textContent=el.value+'%'; startAudio(); applyVolumes(); });
$('panel').addEventListener('change',e=>{ if(e.target.closest('[data-set]')) save(); });

// handles panel buttons added by the extras; returns 'skip' to avoid a full re-render
function extraAct(b){ const k=b.dataset.k, i=+b.dataset.i;
  const r2=extraAct2(b); if(r2!==undefined) return r2==='render' ? undefined : r2;
  const r3=extraAct3(b); if(r3!==undefined) return r3==='render' ? undefined : r3;
  const r4=extraAct4(b); if(r4!==undefined) return r4==='render' ? undefined : r4;
  const r5=extraAct5(b); if(r5!==undefined) return r5==='render' ? undefined : r5;
  const r6=extraAct6(b); if(r6!==undefined) return r6==='render' ? undefined : r6;
  const r7=extraAct7(b); if(r7!==undefined) return r7==='render' ? undefined : r7;
  if(['aqtheme','aqsand','decor'].includes(b.dataset.act)) AQ_PV=null;
  switch(b.dataset.act){
    case 'tog': S.settings[k]=!S.settings[k]; applyVolumes(); if(k==='musicOn'||k==='ambient') startAudio(); return;
    case 'mstyle': S.settings.style=k; return;
    case 'castmode': S.settings.castMode=k==='aim'?'aim':'meter'; return;
    case 'fullscreen': { const d=document; try{ if(d.fullscreenElement) d.exitFullscreen(); else d.documentElement.requestFullscreen(); }catch(e){} return 'skip'; }
    case 'spin': { if(WH.spinning) return 'skip'; accrueSpins(); const freeSpin=k==='free' && S.freeSpins>0; if(!freeSpin){ const c=wheelCost(); if(S.money<c) return 'skip'; S.money-=c; } else { if(S.freeSpins>=SPIN_BANK) S.wheelT=Date.now(); S.freeSpins--; } b.disabled=true; taskProgress('game',1); spinWheel(!freeSpin); lastHud=''; return 'skip'; }
    case 'crate': { if(b.dataset.free){ if(S.tokens[k]<=0) return; S.tokens[k]--; } else { const c=crateCost(k); if(S.money<c) return; S.money-=c; } openCrate(k); addTickets({small:8,big:25,legend:80}[k]); taskProgress('game',1); return; }
    case 'flip': { const amt=Math.min(Math.floor(S.money*(+k)), bestLoot()*60); if(amt<10) return; S.money-=amt; S.gstats.flips++; addTickets(2+(+k)*20); taskProgress('game',1); flipRes={txt:'The coin spins…'}; renderPanel(); tone(1200,.05,'square',.03);
      setTimeout(()=>{ const win=Math.random()<.5; if(win){ S.money+=amt*2; S.stats.earned+=amt; S.gstats.flipWins++; sfx.coin(); } else sfx.lost(); flipRes={win, txt: win?'Heads! You win '+fmt(amt)+' coins':'Tails. The Fishmonger pockets '+fmt(amt)+' coins'}; checkFeats(); save(); lastHud=''; if(S.tab==='games') renderPanel(); }, 900); return 'skip'; }
    case 'buyscratch': { const c=bestLoot()*2; if(S.money<c) return; S.money-=c; newScratch(); addTickets(6); taskProgress('game',1); return; }
    case 'scratch': { if(!scratch||scratch.done) return; scratch.open[i]=true; tone(2000+Math.random()*500,.03,'square',.02); const opened=scratch.cells.filter((s,j)=>scratch.open[j]);
      const cnt={}; opened.forEach(s=>cnt[s]=(cnt[s]||0)+1); if(Object.values(cnt).some(n=>n>=3) || scratch.open.every(x=>x)) settleScratch(); return; }
    case 'scratchall': if(scratch){ scratch.open.fill(true); settleScratch(); } return;
    case 'feed': { if(Date.now()-S.fedT<3600000) return; S.fedT=Date.now(); addBuff('tank',.25,30,'Fed fish'); feedAnim=performance.now(); sfx.coin(); toast('Your fish are happy: +25% aquarium income for 30 min'); return; }
    case 'aqtheme': { const th=THEMES.find(x=>x[0]===k); if(!th) return; if(!S.aq.owned.includes(k)){ if(S.money<th[2]) return; S.money-=th[2]; S.aq.owned.push(k); sfx.coin(); } S.aq.theme=k; return; }
    case 'aqsand': { const sd=SANDS.find(x=>x[0]===k); if(!sd) return; if(!S.aq.owned.includes(k)){ if(S.money<sd[2]) return; S.money-=sd[2]; S.aq.owned.push(k); sfx.coin(); } S.aq.sand=k; return; }
    case 'decor': { const d=DECORI[k]; if(!d) return; if(!S.aq.owned.includes(k)){ if(!d.price||S.money<d.price) return; S.money-=d.price; S.aq.owned.push(k); sfx.coin(); }
      if(S.aq.decor.includes(k)) S.aq.decor=S.aq.decor.filter(x=>x!==k); else if(S.aq.decor.length<aqSlots()) S.aq.decor.push(k); else toast('All decoration spots are used. Remove one first, or build more tanks.'); return; }
  }
  return 'skip'; }
function aqCustomHTML(){ const fedLeft=Math.max(0,3600000-(Date.now()-S.fedT));
  const chip=(act,list,cur)=>list.map(x=>{ const own=S.aq.owned.includes(x[0]); const pvk=act==='aqtheme'?'theme':'sand'; const pv=AQ_PV&&AQ_PV.kind===pvk&&AQ_PV.id===x[0]; return `<button class="chipb" data-act="${own?act:'aqpv'}" data-k="${own?x[0]:pvk+':'+x[0]}" aria-pressed="${cur===x[0]||pv}" title="${own?'':'Preview first, then buy'}"><span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:${x[3]};margin-right:6px;vertical-align:-1px"></span>${x[1]}${own?'':' · '+fmt(x[2])}</button>`; }).join('');
  return `<div class="jsec">${aqPvBarHTML()}<div class="row spread"><h2>Decorate</h2><button class="btn ${fedLeft?'alt':''} sm" data-act="feed" ${fedLeft?'disabled':''}>${fedLeft?'Fed. Hungry again in '+Math.ceil(fedLeft/60000)+' min':'Feed your fish (+25% income, 30 min)'}</button></div>
   <h5>Water</h5><div class="chips">${chip('aqtheme',THEMES,S.aq.theme)}</div><h5>Floor</h5><div class="chips">${chip('aqsand',SANDS,S.aq.sand)}</div>
   <h5>Decorations · ${S.aq.decor.length} of ${aqSlots()} spots used · +${Math.round(decorBonus()*100)}% aquarium income</h5><div class="grid" style="grid-template-columns:repeat(auto-fill,minmax(150px,1fr))">${DECOR.map(d=>{ const own=S.aq.owned.includes(d.id), placed=S.aq.decor.includes(d.id);
     return `<div class="tile ${placed?'done':''}" style="align-items:center;text-align:center;gap:4px"><canvas width="160" height="120" data-decor="${d.id}" data-own="${own?1:0}" style="width:80px;height:60px;cursor:default"></canvas><b style="font-size:14px">${own||d.price?d.name:'???'}</b><span class="meta">+${Math.round(d.b*100)}% income</span>
     ${own?`<button class="btn ${placed?'alt':''} sm" data-act="decor" data-k="${d.id}">${placed?'Remove':'Place'}</button>`:d.price?`<div class="row" style="justify-content:center;gap:4px"><button class="btn alt sm" data-act="aqpv" data-k="decor:${d.id}">Preview</button><button class="btn sm" data-act="decor" data-k="${d.id}" ${S.money>=d.price?'':'disabled'}>Buy · <span class="coin">${fmt(d.price)}</span></button></div>`:'<span class="meta">Mystery crates or prizes only</span>'}</div>`; }).join('')}</div></div>`; }
function paintDecor(P){ P.querySelectorAll('canvas[data-decor]').forEach(c=>{ const x=c.getContext('2d'); x.clearRect(0,0,c.width,c.height); if(c.dataset.own!=='1'&&!DECORI[c.dataset.decor].price) mysteryThumb(x,c.width,c.height,c.dataset.decor); else drawDecor(x,c.dataset.decor,80,c.dataset.decor==='duck'?70:112,1,0); }); }

// ---------- music & ambience (all generated live, nothing to download) ----------
const MUS={started:false, next:0, step:0, bar:0, idx:4, style:null, timer:null, n:null};
const mtof = m => 440*Math.pow(2,(m-69)/12);
const STYLES = {
  lofi:    {bpm:72, swing:.16, drums:true,  key:60, progs:[[[48,[0,4,7,11,14]],[45,[0,3,7,10,14]],[41,[0,4,7,11,14]],[43,[0,4,7,9,14]]],[[41,[0,4,7,11]],[40,[0,3,7,10]],[38,[0,3,7,10,14]],[43,[0,4,7,10]]]], mel:.3},
  acoustic:{bpm:86, swing:.06, drums:false, key:67, progs:[[[43,[0,4,7,14]],[40,[0,3,7,10]],[36,[0,4,7,11]],[38,[0,4,7,10]]],[[36,[0,4,7,11]],[43,[0,4,7,14]],[40,[0,3,7,10]],[38,[0,5,7]]]], mel:.24},
  night:   {bpm:58, swing:0,   drums:false, key:60, progs:[[[50,[0,3,7,10,14]],[43,[0,4,7,10,14]],[48,[0,4,7,11,14]],[45,[0,3,7,10,14]]],[[41,[0,4,7,11,14]],[43,[0,4,7,9,14]],[45,[0,3,7,10]],[40,[0,3,7,10]]]], mel:.18},
};
const PENT=[0,2,4,7,9];
function curStyle(){ if(V3ON) return curStyle3(); const s=S.settings.style; if(s!=='auto') return s; const t=tod(); return t==='Day'?'lofi':t==='Dawn'?'acoustic':'night'; }
function noiseBuf(sec,brown){ const n=AC.sampleRate*sec, b=AC.createBuffer(1,n,AC.sampleRate), d=b.getChannelData(0); let last=0; for(let i=0;i<n;i++){ const w=Math.random()*2-1; if(brown){ last=(last+.02*w)/1.02; d[i]=last*3.5; } else d[i]=w; } return b; }
function startAudio(){ const a=ac(); if(!a||MUS.started) return; MUS.started=true;
  const n={}; n.dry=AC.createGain(); n.dry.gain.value=.9; n.dry.connect(BUS.music);
  n.rev=AC.createConvolver(); const len=AC.sampleRate*2.8, ir=AC.createBuffer(2,len,AC.sampleRate); for(let ch=0;ch<2;ch++){ const d=ir.getChannelData(ch); for(let i=0;i<len;i++) d[i]=(Math.random()*2-1)*Math.pow(1-i/len,2.6); } n.rev.buffer=ir;
  n.wet=AC.createGain(); n.wet.gain.value=.45; n.wet.connect(n.rev); n.rev.connect(BUS.music);
  n.dl=AC.createDelay(2); n.dl.delayTime.value=.42; n.fb=AC.createGain(); n.fb.gain.value=.32; n.dlf=AC.createBiquadFilter(); n.dlf.type='lowpass'; n.dlf.frequency.value=1800; n.dl.connect(n.dlf); n.dlf.connect(n.fb); n.fb.connect(n.dl); n.dlf.connect(n.wet); n.dlf.connect(BUS.music); n.dls=AC.createGain(); n.dls.gain.value=.5; n.dls.connect(n.dl);
  n.white=noiseBuf(1,false);
  // vinyl crackle for lo-fi
  const vb=AC.createBuffer(1,AC.sampleRate*3,AC.sampleRate), vd=vb.getChannelData(0); for(let i=0;i<vd.length;i++) vd[i]=(Math.random()<.00035?(Math.random()*2-1)*.8:0); n.vin=AC.createBufferSource(); n.vin.buffer=vb; n.vin.loop=true; n.ving=AC.createGain(); n.ving.gain.value=0; const vf=AC.createBiquadFilter(); vf.type='bandpass'; vf.frequency.value=2500; n.vin.connect(vf); vf.connect(n.ving); n.ving.connect(BUS.music); n.vin.start();
  // ambience: waves / stream, wind
  n.wave=AC.createBufferSource(); n.wave.buffer=noiseBuf(6,true); n.wave.loop=true; n.wavef=AC.createBiquadFilter(); n.wavef.type='lowpass'; n.wavef.frequency.value=600; n.waveg=AC.createGain(); n.waveg.gain.value=.05;
  n.lfo=AC.createOscillator(); n.lfo.frequency.value=.08; n.lfog=AC.createGain(); n.lfog.gain.value=.04; n.lfo.connect(n.lfog); n.lfog.connect(n.waveg.gain); n.lfo.start();
  n.wave.connect(n.wavef); n.wavef.connect(n.waveg); n.waveg.connect(BUS.amb); n.wave.start();
  n.wind=AC.createBufferSource(); n.wind.buffer=noiseBuf(4,false); n.wind.loop=true; n.windf=AC.createBiquadFilter(); n.windf.type='bandpass'; n.windf.frequency.value=500; n.windf.Q.value=.7; n.windg=AC.createGain(); n.windg.gain.value=0; n.wind.connect(n.windf); n.windf.connect(n.windg); n.windg.connect(BUS.amb); n.wind.start();
  MUS.n=n; MUS.next=AC.currentTime+.3; MUS.timer=setInterval(musicTick,80); }
function mv(type,f,t,dur,peak,att,outs,det=0){ const o=AC.createOscillator(), gn=AC.createGain(); o.type=type; o.frequency.value=f; if(det) o.detune.value=det; gn.gain.setValueAtTime(0,t); gn.gain.linearRampToValueAtTime(peak,t+att); gn.gain.exponentialRampToValueAtTime(.0001,t+dur); o.connect(gn); outs.forEach(x=>gn.connect(x)); o.start(t); o.stop(t+dur+.05); return o; }
function nz(t,dur,peak,ftype,freq,out){ const s=AC.createBufferSource(); s.buffer=MUS.n.white; const f=AC.createBiquadFilter(); f.type=ftype; f.frequency.value=freq; const gn=AC.createGain(); gn.gain.setValueAtTime(peak,t); gn.gain.exponentialRampToValueAtTime(.0001,t+dur); s.connect(f); f.connect(gn); gn.connect(out); s.start(t); s.stop(t+dur+.02); }
function musicTick(){ if(!AC||!MUS.n) return; const n=MUS.n, now=AC.currentTime;
  // ambience follows the water and the time of day
  const L=curLoc(), night=nightness(phase()); const sea=['coast','shelf','deep','trench','reef'].includes(L.id);
  n.waveg.gain.setTargetAtTime(L.id==='river'?.07:sea?(L.id==='deep'?.13:.1):.035, now, 1); n.wavef.frequency.setTargetAtTime(L.id==='river'?1400:L.id==='trench'?300:600, now, 1); n.lfog.gain.setTargetAtTime(L.id==='river'?.01:.045, now, 1);
  n.windg.gain.setTargetAtTime(L.id==='frost'?.05:L.id==='deep'?.02:0, now, 1.5);
  if(S.settings.ambient){ const r=Math.random();
    if(night<.4 && ['pond','river','reef','coast'].includes(L.id) && r<.012){ const t=now+.05; for(let i=0;i<2+Math.floor(Math.random()*3);i++){ const o=mv('sine',2600+Math.random()*900,t+i*.11,.09,.025,.01,[BUS.amb]); o.frequency.exponentialRampToValueAtTime(3600+Math.random()*600,t+i*.11+.07); } }
    if(night>.6 && ['pond','river','reef'].includes(L.id) && r<.06){ const t=now+.05; for(let i=0;i<3;i++) mv('sine',4400+Math.random()*200,t+i*.045,.03,.01,.005,[BUS.amb]); }
    if(night<.5 && L.id==='coast' && r>.995){ const t=now+.05; for(let i=0;i<2;i++){ const o=mv('sawtooth',950,t+i*.25,.22,.012,.02,[BUS.amb]); o.frequency.exponentialRampToValueAtTime(600,t+i*.25+.2); } }
    if(L.id==='trench' && r>.996) mv('sine',1250,now+.05,2.5,.02,.01,[BUS.amb, n.wet]); }
  // music
  const stName=curStyle(), st=STYLES[stName]; if(!(stName==='lofi'&&S.settings.musicOn)) n.ving.gain.setTargetAtTime(0, now, .3); /* 0.4: the record crackle is no longer a constant layer, see below */
  if(!S.settings.musicOn){ MUS.next=Math.max(MUS.next,now+.1); return; }
  const stepLen=60/st.bpm/2;
  while(MUS.next<now+.6){ const t0=MUS.next, s=MUS.step%8; if(s===0){ MUS.bar++; MUS.style=stName; if(stName==='lofi'){ const Lb=st.progs.length*8, bi=MUS.bar%Lb, bl=stepLen*8; /* a little record crackle only where the track loops round, and once softly halfway */ if(bi===0||bi===Math.floor(Lb/2)){ const pk=bi===0?.14:.07, hold=bi===0?bl*1.5:bl*.6; n.ving.gain.cancelScheduledValues(t0); n.ving.gain.setValueAtTime(n.ving.gain.value,t0); n.ving.gain.linearRampToValueAtTime(pk,t0+bl*.25); n.ving.gain.setValueAtTime(pk,t0+hold); n.ving.gain.linearRampToValueAtTime(0,t0+hold+bl); } } }
    const prog=st.progs[Math.floor(MUS.bar/8)%st.progs.length], ch=prog[MUS.bar%4]; const root=ch[0], ivs=ch[1]; const t=t0+(s%2?st.swing*stepLen:0); const barLen=stepLen*8;
    if(V3ON && V3MUS[stName]){ V3MUS[stName](t,s,root,ivs,stepLen,n,MUS.bar); MUS.step++; MUS.next+=stepLen; continue; }
    if(s===0){ const lp=AC.createBiquadFilter(); lp.type='lowpass'; lp.frequency.value=stName==='night'?900:1100; lp.connect(n.dry); lp.connect(n.wet);
      ivs.slice(0,4).forEach((iv,k)=>{ const f=mtof(root+12+iv); mv('triangle',f,t,barLen+1.6,.022,1.3,[lp],-7); mv('triangle',f,t,barLen+1.6,.022,1.3,[lp],7); });
      if(stName!=='night') mv('sine',mtof(root-12),t,stepLen*3.5,.13,.02,[n.dry]); else mv('sine',mtof(root-12),t,barLen,.07,.4,[n.dry]); }
    if(stName!=='night' && s===4) mv('sine',mtof(root-12+(Math.random()<.5?7:12)),t,stepLen*3,.09,.02,[n.dry]);
    if(st.drums){ if(s===0||s===4||(s===5&&Math.random()<.3)){ const o=mv('sine',110,t,.32,.14,.005,[n.dry]); o.frequency.exponentialRampToValueAtTime(42,t+.14); }
      if(s===2||s===6) nz(t,.16,.035,'bandpass',1800,n.dry); if(s%2===1) nz(t,.04,.012,'highpass',6000,n.dry); }
    if(stName==='lofi' && (s===0||s===3||s===6) && Math.random()<.85){ const iv=ivs[(s/3|0)%ivs.length]; const f=mtof(root+24+iv); mv('sine',f,t,1.8,.045,.01,[n.dry,n.wet]); mv('sine',f*2,t,.5,.008,.005,[n.dry]); }
    if(stName==='acoustic'){ const seq=[0,1,2,3,2,1,2,3]; const iv=ivs[seq[s]%ivs.length]; const f=mtof(root+12+iv+(s>=4?12:0)); const o=AC.createOscillator(), fl=AC.createBiquadFilter(), gn=AC.createGain(); o.type='triangle'; o.frequency.value=f; fl.type='lowpass'; fl.frequency.setValueAtTime(3500,t); fl.frequency.exponentialRampToValueAtTime(600,t+.35); gn.gain.setValueAtTime(.055,t); gn.gain.exponentialRampToValueAtTime(.0001,t+1); o.connect(fl); fl.connect(gn); gn.connect(n.dry); gn.connect(n.wet); o.start(t); o.stop(t+1.05); }
    if(stName==='night' && Math.random()<.22){ const f=mtof(st.key+12+PENT[Math.floor(Math.random()*5)]+(Math.random()<.4?12:0)); mv('sine',f,t,3,.03,.01,[n.wet,n.dls]); mv('sine',f*2.76,t,1.1,.006,.005,[n.wet]); }
    // melody: a gentle pentatonic wander with rests
    const phraseRest=(MUS.bar%8)>=6; if(s%2===0 && Math.random()<(phraseRest?st.mel*.3:st.mel)){ MUS.idx=clamp(MUS.idx+pick([-2,-1,-1,0,1,1,2]),0,9); const m=st.key+PENT[MUS.idx%5]+12*Math.floor(MUS.idx/5)+(stName==='acoustic'?0:12);
      const o=mv('sine',mtof(m),t,stepLen*(Math.random()<.4?3:1.6),.04,.03,[n.dry,n.dls,n.wet]); const vib=AC.createOscillator(), vg=AC.createGain(); vib.frequency.value=5; vg.gain.value=mtof(m)*.004; vib.connect(vg); vg.connect(o.frequency); vib.start(t); vib.stop(t+stepLen*3.2); }
    MUS.step++; MUS.next+=stepLen; }
}
document.addEventListener('visibilitychange',()=>{ if(!AC) return; if(document.hidden) AC.suspend(); else if(MUS.started) AC.resume(); });
window.addEventListener('resize',()=>resize());
if(/[?&]test\b/.test(location.search)) window.__dl={openEvent, G, S:()=>S, MUS};
document.addEventListener('pointerdown',()=>startAudio(),{once:true});
document.addEventListener('keydown',()=>startAudio(),{once:true});
