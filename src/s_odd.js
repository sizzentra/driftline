
// =====================================================================
// 0.3 oddities: twenty new things humanity dropped in the water, from a lone sock to a megalodon tooth.
// =====================================================================
[['sock','Lone Sock',0,{c:.2},'Its partner is out there somewhere. Probably in a dryer.'],
 ['rubberduck','Lost Rubber Duck',0,{buff:['calm',.3,5]},'It has seen things. The fish trust it.'],
 ['umbrella','Inside-out Umbrella',0,{c:.4},'A gust took it. The lake gave it back.'],
 ['dentures','False Teeth',0,{c:.3},'Someone is having a very quiet dinner tonight.'],
 ['keyboard','Soggy Keyboard',0,{buff:['xp',.25,5]},'The W key still works. Mostly.'],
 ['gnomehead','Garden Gnome Head',0,{c:.5},'Just the head. I am not asking where the rest is.'],
 ['snowglobe','Snow Globe',1,{c:2},'There is a tiny lake inside, with a tiny angler. Spooky.'],
 ['trophycup','Bowling Trophy',1,{c:1.6,buff:['trophy',.3,5]},'"Third place, 1994". Big fish energy.'],
 ['puzzlecube','Puzzle Cube',1,{buff:['reel',.3,5]},'Solved already. Your hands feel quicker.'],
 ['lavalamp','Lava Lamp',1,{c:1.5,buff:['bite',.3,5]},'The blobs drift like fish. The fish come to look.'],
 ['plush67','Plush 67',1,{c:6.7},'Six. Seven. It squeaks when you squeeze it. A collector paid on the spot.'],
 ['compass','Brass Compass',2,{c:2,buff:['rare',.3,5]},'It does not point north. It points at rare fish.'],
 ['pocketwatch','Gold Pocket Watch',2,{c:5},'Stopped at 3:07. Still worth a fortune.'],
 ['crystalball','Crystal Ball',2,{buff:['shiny',.5,5]},'You see glitter in your near future.'],
 ['mapscrap','Treasure Map Scrap',2,{c:2,scales:8},'An X, a skull, and a coffee stain. Classic.'],
 ['shipbottle','Ship in a Bottle',2,{c:4},'How did they get it in there? How did it get in here?'],
 ['goldbar','Gold Bar',3,{c:14},'Heavy, shiny, and very much not mine. Take your coins.'],
 ['goblet','Jeweled Goblet',3,{c:10},'Fit for a king. Or a very fancy fishmonger.'],
 ['ancientcoin','Ancient Coin',3,{c:8,scales:6},'A face nobody remembers on a coin everybody wants.'],
 ['megtooth','Megalodon Tooth',3,{c:12,scales:10},'Bigger than your hand. Let us not think about the mouth it came from.'],
].forEach(a=>{ const j={id:a[0],name:a[1],t:a[2],e:a[3],q:a[4]}; JUNK.push(j); JUNKI[j.id]=j; });
const _drawJunkZ_0 = drawJunkZ;
drawJunkZ = function(c,id,R,Ci,E,P,Ln){ const T=(txt,x,y,sz,col)=>{ c.fillStyle=col; c.font='800 '+sz+'px system-ui'; c.textAlign='center'; c.fillText(txt,x,y); };
  switch(id){
    case 'sock': P([-20,-60,20,-60,24,20,50,34,48,56,-6,54,-24,30],'#e8e4dc'); R(-20,-60,40,12,'#c8553a'); R(-22,-30,44,6,'#3a6f9a'); break;
    case 'rubberduck': E(0,18,52,32,'#ffd23a'); Ci(28,-22,24,'#ffd23a'); P([48,-22,70,-14,48,-8],'#ff8a2a'); Ci(34,-28,4,'#111'); E(-12,12,22,12,'#f2c018'); break;
    case 'umbrella': P([-60,-10,-40,-50,0,-62,40,-50,60,-10,30,-30,0,-20,-30,-30],'#3a6f9a'); R(-3,-20,6,70,'#555'); c.strokeStyle='#555'; c.lineWidth=6; c.beginPath(); c.arc(-12,50,12,0,Math.PI); c.stroke(); break;
    case 'dentures': E(0,-10,56,22,'#e88a8a'); E(0,22,56,22,'#e88a8a'); for(let i=0;i<7;i++){ R(-42+i*12,-6,10,14,'#f8f4ee'); R(-42+i*12,6,10,14,'#f8f4ee'); } break;
    case 'keyboard': R(-80,-26,160,56,'#2a2a30'); for(let r=0;r<3;r++) for(let k=0;k<9;k++) R(-72+k*16,-18+r*16,13,12,'#4a4a52'); R(-40,22,80,6,'#4a4a52'); E(30,30,20,6,'rgba(120,200,255,.4)'); break;
    case 'gnomehead': P([-26,0,0,-70,26,0],'#c8302a'); E(0,10,28,22,'#f2c8a0'); Ci(0,12,8,'#e8a080'); P([-28,16,0,64,28,16],'#f4f4f2'); Ci(-10,2,3,'#222'); Ci(10,2,3,'#222'); break;
    case 'snowglobe': R(-40,30,80,22,'#7a4a2a'); Ci(0,-8,44,'rgba(200,230,255,.55)'); E(0,24,34,8,'#f4f8ff'); P([-14,20,0,-10,14,20],'#2f6a4a'); for(let i=0;i<10;i++) Ci(-30+((i*13)%60),-40+((i*17)%50),2.5,'#ffffff'); Ci(-16,-26,8,'rgba(255,255,255,.4)'); break;
    case 'trophycup': R(-30,40,60,16,'#3a2a1a'); R(-8,10,16,30,'#d8b048'); P([-36,-50,36,-50,22,10,-22,10],'#e8c058'); c.strokeStyle='#d8b048'; c.lineWidth=7; c.beginPath(); c.arc(-38,-30,14,Math.PI*.5,Math.PI*1.5); c.moveTo(38,-44); c.arc(38,-30,14,-Math.PI*.5,Math.PI*.5); c.stroke(); Ci(0,-26,10,'#2a2a30'); break;
    case 'puzzlecube': { const cs=['#e8483a','#3a8ae8','#f4d23a','#4ac860','#f4f4f2','#ff8a2a']; for(let r=0;r<3;r++) for(let k=0;k<3;k++) R(-42+k*28,-42+r*28,25,25,cs[(r*3+k)%6]); break; }
    case 'lavalamp': P([-16,-60,16,-60,30,30,-30,30],'rgba(255,120,200,.6)'); R(-30,30,60,26,'#5a4a6a'); R(-16,-70,32,10,'#5a4a6a'); E(4,-20,10,14,'#ffb03a'); E(-6,10,12,10,'#ffb03a'); Ci(8,-46,6,'#ffb03a'); break;
    case 'plush67': E(0,10,44,50,'#5ad8ff'); T('6',-14,22,40,'#1a3a5a'); T('7',16,22,40,'#1a3a5a'); Ci(-14,-24,5,'#111'); Ci(14,-24,5,'#111'); E(-48,10,10,20,'#5ad8ff'); E(48,10,10,20,'#5ad8ff'); break;
    case 'compass': Ci(0,0,52,'#c8963a'); Ci(0,0,44,'#f4ecd8'); P([0,-38,8,0,0,38,-8,0],'#c8302a'); P([0,0,8,0,0,38,-8,0],'#3a3a44'); Ci(0,0,5,'#c8963a'); R(-8,-62,16,12,'#c8963a'); break;
    case 'pocketwatch': c.strokeStyle='#d8b048'; c.lineWidth=5; c.beginPath(); c.moveTo(0,-56); c.quadraticCurveTo(40,-80,70,-60); c.stroke(); Ci(0,0,50,'#e8c058'); Ci(0,0,42,'#f8f4e8'); c.strokeStyle='#2a2a30'; c.lineWidth=4; c.beginPath(); c.moveTo(0,0); c.lineTo(0,-30); c.moveTo(0,0); c.lineTo(18,8); c.stroke(); Ci(0,-54,8,'#d8b048'); break;
    case 'crystalball': R(-36,38,72,18,'#5a3a2a'); Ci(0,-6,46,'rgba(150,120,255,.75)'); Ci(-6,-12,30,'rgba(220,200,255,.4)'); Ci(-18,-26,9,'rgba(255,255,255,.75)'); Ci(12,4,4,'#fff6c0'); break;
    case 'mapscrap': P([-70,-40,60,-50,70,40,-60,48],'#e8d8a8'); c.strokeStyle='#8a5a2a'; c.lineWidth=4; c.setLineDash([8,8]); c.beginPath(); c.moveTo(-50,30); c.quadraticCurveTo(-10,-30,30,10); c.stroke(); c.setLineDash([]); T('✕',36,20,30,'#c8302a'); E(-30,-20,16,10,'rgba(120,80,40,.35)'); break;
    case 'shipbottle': E(0,10,74,30,'rgba(200,240,230,.45)'); R(70,-2,22,22,'#8a5a2a'); P([-40,26,30,26,20,36,-30,36],'#6a3a1a'); P([-4,24,-4,-26,30,20],'#f4f0e8'); P([-10,24,-10,-10,-34,22],'#f4f0e8'); E(0,36,60,6,'#3a7ab0'); break;
    case 'goldbar': P([-60,30,60,30,40,-20,-40,-20],'#e8b830'); P([-40,-20,40,-20,30,-34,-30,-34],'#ffe080'); c.fillStyle='#a87a18'; c.font='800 16px system-ui'; c.textAlign='center'; c.fillText('999.9',0,10); break;
    case 'goblet': R(-26,44,52,12,'#d8b048'); R(-6,4,12,40,'#d8b048'); P([-40,-50,40,-50,26,6,-26,6],'#e8c058'); Ci(-14,-26,7,'#e8302a'); Ci(14,-26,7,'#3a8ae8'); Ci(0,-12,7,'#4ac860'); break;
    case 'ancientcoin': Ci(0,0,52,'#c8963a'); Ci(0,0,44,'#e8b850'); E(4,-4,16,22,'#b8862a'); E(-6,-18,10,6,'#b8862a'); for(let i=0;i<14;i++){ const a=i/14*Math.PI*2; Ci(Math.cos(a)*48,Math.sin(a)*48,2.5,'#8a6a1a'); } break;
    case 'megtooth': P([-46,40,0,-66,46,40,0,30],'#f0e8d0'); P([-46,40,0,30,46,40,30,54,-30,54],'#8a7a5a'); for(let i=0;i<6;i++){ c.fillStyle='rgba(120,100,70,.35)'; c.fillRect(-40+i*8,30-i*14,4,8); } break;
    default: _drawJunkZ_0(c,id,R,Ci,E,P,Ln); } };
