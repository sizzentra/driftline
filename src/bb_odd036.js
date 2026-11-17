// =====================================================================
// 0.3.6: fourteen more oddities, bringing the collection to 100.
// Format: [id, name, tier 0-3, effect {c: coins (× best catch), buff: [kind, amount, minutes]}, note]
// Drawings use the shared helpers so unfound ones show as proper silhouettes in the Fish Log.
// =====================================================================
[['flipflop','Single Flip-Flop',0,{c:.3},'The left one. The right one is living its best life somewhere sunny.'],
 ['traffic','Traffic Cone',0,{c:.4},'Nobody knows how these get everywhere. Not even the lake.'],
 ['controller','Game Controller',0,{buff:['reel',.3,5]},'The A button is worn smooth. Your reeling thumb feels stronger.'],
 ['teacup','Floral Teacup',0,{buff:['calm',.3,5]},'Still has a tea stain. Very calming.'],
 ['clock','Alarm Clock',0,{buff:['bite',.3,5]},'Rings every morning. The fish are awake now.'],
 ['boombox','Boombox',1,{c:1.5,buff:['hot',.3,5]},'It still plays one song. The fish gather to listen.'],
 ['telescope','Brass Spyglass',1,{buff:['rare',.25,5]},'Look through it and the deep water seems closer.'],
 ['lantern','Ship Lantern',1,{c:2},'The glass is cracked but the brass is beautiful.'],
 ['camera','Old Camera',1,{c:1.2,buff:['shiny',.3,5]},'One photo left on the roll. It is of a shiny fish.'],
 ['ducktrophy','Duck Trophy',1,{c:1.8,buff:['trophy',.3,5]},'"Best Quack 2009". A proud moment for someone.'],
 ['scarab','Golden Scarab',2,{c:5},'An old brooch that glitters like it has a secret.'],
 ['music','Music Box',2,{c:3,buff:['xp',.35,5]},'Wind it up. A little tune about the sea.'],
 ['geode','Split Geode',2,{c:4,buff:['sell',.25,5]},'Purple crystals inside. Collectors love these.'],
 ['kraken','Kraken Figurehead',3,{c:14,buff:['rare',.4,8]},'Carved from a sunken ship’s bow. Its eyes follow you.'],
].forEach(a=>{ if(JUNKI[a[0]]) return; const j={id:a[0],name:a[1],t:a[2],e:a[3],q:a[4]}; JUNK.push(j); JUNKI[j.id]=j; });

const _drawJunkZ_036 = drawJunkZ;
drawJunkZ = function(c,id,R,Ci,E,P,Ln){ switch(id){
  case 'flipflop': E(0,4,30,64,'#3ab8d8',-.25); E(0,4,22,56,'#5ad0e8',-.25); Ln([-4,-30,-22,10],'#f8f0e0',6); Ln([-4,-30,16,8],'#f8f0e0',6); Ci(-4,-30,6,'#e8e0d0'); break;
  case 'traffic': P([-50,50,50,50,40,36,-40,36],'#2a2a30'); P([-36,36,36,36,10,-62,-10,-62],'#f8782a'); P([-26,6,26,6,20,-18,-20,-18],'#f8f8f0'); P([-16,-32,16,-32,12,-46,-12,-46],'#f8f8f0'); break;
  case 'controller': E(-30,6,30,26,'#3a3a44'); E(30,6,30,26,'#3a3a44'); R(-30,-16,60,40,'#3a3a44'); R(-44,0,22,7,'#1a1a20'); R(-36,-8,7,22,'#1a1a20'); Ci(30,-6,6,'#e8483a'); Ci(42,6,6,'#4ac860'); Ci(18,6,6,'#3a8ae8'); Ci(30,18,6,'#f4d23a'); break;
  case 'teacup': E(0,40,52,10,'#f4f0e8'); P([-44,-20,44,-20,30,34,-30,34],'#f8f4ee'); E(0,-20,44,10,'#e8dcc8'); E(0,-20,36,7,'#8a5a2a'); Ln([44,-6,62,0,58,22,34,22],'#f8f4ee',8); Ci(-18,6,7,'#e86a8a'); Ci(4,12,6,'#e86a8a'); Ci(20,2,6,'#7ac870'); break;
  case 'clock': Ci(-30,-44,16,'#c8302a'); Ci(30,-44,16,'#c8302a'); Ci(0,0,50,'#c8302a'); Ci(0,0,40,'#f8f4ea'); Ln([0,0,0,-28],'#2a2a30',5); Ln([0,0,20,8],'#2a2a30',5); Ln([-30,46,-40,60],'#2a2a30',7); Ln([30,46,40,60],'#2a2a30',7); break;
  case 'boombox': R(-70,-30,140,70,'#5a5a64'); R(-60,-56,120,10,'#3a3a44'); R(-60,-56,8,30,'#3a3a44'); R(52,-56,8,30,'#3a3a44'); Ci(-38,10,24,'#2a2a30'); Ci(-38,10,12,'#7a7a84'); Ci(38,10,24,'#2a2a30'); Ci(38,10,12,'#7a7a84'); R(-14,-20,28,14,'#8ad8f8'); break;
  case 'telescope': P([-70,10,40,-30,46,-14,-64,26],'#c8963a'); P([30,-26,70,-40,74,-26,36,-12],'#e8b850'); E(-68,18,8,10,'#5a3a1a'); Ln([-10,0,-20,50],'#7a5a3a',6); Ln([-10,0,14,48],'#7a5a3a',6); break;
  case 'lantern': R(-6,-74,12,14,'#2a2a30'); P([-40,-58,40,-58,30,-44,-30,-44],'#c8963a'); R(-30,-44,60,80,'rgba(255,220,140,.75)'); Ci(0,0,14,'#ffd060'); Ln([-30,-44,-30,36],'#c8963a',6); Ln([30,-44,30,36],'#c8963a',6); P([-40,36,40,36,34,50,-34,50],'#c8963a'); break;
  case 'camera': R(-64,-34,128,74,'#2a2a30'); R(-30,-48,40,16,'#2a2a30'); Ci(0,4,30,'#5a5a64'); Ci(0,4,20,'#1a1a24'); Ci(-6,-2,6,'#8ab8e8'); R(34,-26,20,10,'#e8e4dc'); break;
  case 'ducktrophy': R(-34,44,68,14,'#3a2a1a'); R(-10,20,20,24,'#d8b048'); E(0,0,40,24,'#e8c058'); Ci(26,-24,18,'#e8c058'); P([40,-26,60,-20,40,-14],'#c8963a'); Ci(30,-30,3,'#5a3a1a'); break;
  case 'scarab': E(0,6,44,52,'#c8963a'); E(0,6,36,44,'#e8c058'); Ln([0,-38,0,50],'#a87a28',4); Ci(0,-48,14,'#c8963a'); Ci(-14,-10,7,'#3a8ae8'); Ci(14,-10,7,'#3a8ae8'); Ci(0,22,8,'#e8483a'); Ln([-40,-20,-64,-34],'#c8963a',5); Ln([40,-20,64,-34],'#c8963a',5); break;
  case 'music': R(-56,-10,112,56,'#8a5a2a'); P([-56,-10,56,-10,40,-46,-40,-46],'#a8703a'); R(-44,2,88,32,'#6a4020'); Ci(0,18,10,'#e8c058'); Ln([56,10,74,10,74,-6],'#c8963a',6); Ci(-26,-30,5,'#e8c058'); Ci(-6,-34,5,'#e8c058'); break;
  case 'geode': E(0,0,58,50,'#7a6a5a'); E(0,0,44,36,'#4a2a6a'); P([-30,0,-14,-26,0,-6,14,-30,30,0,14,26,0,8,-14,28],'#a86ad8'); P([-10,-4,0,-18,10,-4,0,10],'#e0b8ff'); break;
  case 'kraken': { for(let i=0;i<5;i++){ const x0=-32+i*16, dir=i<2?-1:i>2?1:(i%2?1:-1); for(let k=0;k<=12;k++){ const u=k/12, x=x0+dir*Math.sin(u*Math.PI*.9)*16, y=18+u*50; Ci(x,y,7-u*4.6,'#4a6a5a'); } Ci(x0+dir*2,66,3,'#4a6a5a'); }
    E(0,-16,40,46,'#5a7a6a'); E(-8,-36,14,8,'#6a8a7a',-.4); Ci(-14,-22,9,'#f8e070'); Ci(14,-22,9,'#f8e070'); E(-14,-22,2.4,6,'#1a1a1a'); E(14,-22,2.4,6,'#1a1a1a'); P([-50,20,50,20,40,30,-40,30],'#8a5a2a'); break; }
  default: _drawJunkZ_036(c,id,R,Ci,E,P,Ln); } };
[['cassette','Mixtape',0,{buff:['xp',.25,5]},'"Fishing Bangers Vol. 3". Someone made this with love.'],
 ['snorkel','Snorkel Mask',0,{c:.4},'Fogged up, but it has seen the bottom of the lake.'],
 ['yoyo','Glow Yo-yo',1,{buff:['reel',.35,5]},'Walk the dog. Reel the fish. Same wrist.'],
 ['horseshoe','Lucky Horseshoe',1,{buff:['shiny',.35,5]},'Hang it the right way up and luck pours in.'],
 ['mermaidcomb','Mermaid’s Comb',2,{c:4.5,buff:['calm',.35,5]},'Mother-of-pearl, with a single long green hair caught in it.'],
 ['shipbell','Sunken Ship’s Bell',3,{c:12,buff:['treasure',.5,8]},'Engraved with a ship’s name nobody can find on any chart.'],
].forEach(a=>{ if(JUNKI[a[0]]) return; const j={id:a[0],name:a[1],t:a[2],e:a[3],q:a[4]}; JUNK.push(j); JUNKI[j.id]=j; });
const _drawJunkZ_036b = drawJunkZ;
drawJunkZ = function(c,id,R,Ci,E,P,Ln){ switch(id){
  case 'cassette': R(-70,-40,140,84,'#2a2a30'); R(-56,-28,112,40,'#f0d8a0'); Ci(-28,-8,13,'#3a3a44'); Ci(28,-8,13,'#3a3a44'); Ci(-28,-8,5,'#f0d8a0'); Ci(28,-8,5,'#f0d8a0'); P([-40,44,40,44,30,24,-30,24],'#4a4a54'); break;
  case 'snorkel': E(-10,0,58,38,'#2a7ab8'); E(-10,0,46,28,'rgba(190,230,255,.75)'); R(52,-70,14,80,'#f8d23a'); E(59,-72,10,6,'#f8d23a'); R(-74,-8,16,16,'#1a4a7a'); break;
  case 'yoyo': Ln([0,-80,0,-24],'#e8e4dc',3); Ci(0,8,40,'#7af0a8'); Ci(0,8,28,'#4ac880'); Ci(0,8,8,'#e8f8ee'); break;
  case 'horseshoe': Ln([-34,50,-40,0,-26,-40,0,-52,26,-40,40,0,34,50],'#9aa0a8',18); for(const [x,y] of [[-38,30],[-36,-14],[-14,-46],[14,-46],[36,-14],[38,30]]) Ci(x,y,3.5,'#3a3a44'); break;
  case 'mermaidcomb': P([-60,-10,60,-10,52,-34,-52,-34],'#e8dcf0'); for(let i=0;i<12;i++) R(-54+i*9.6,-10,5,46,'#d8c8e8'); E(0,-28,26,10,'#f0e8ff'); Ln([20,20,40,40,30,64],'#4ac880',2); break;
  case 'shipbell': { R(-6,-72,12,16,'#5a4a2a'); const prof=k=>{ const pts=[]; for(let i=0;i<=16;i++){ const u=i/16, y=-58+u*98, w=(10+28*Math.pow(u,1.6)+16*Math.pow(u,6))*k; pts.push(w,y); } return pts; }; const side=k=>{ const a=prof(k), out=[]; for(let i=0;i<a.length;i+=2) out.push(a[i],a[i+1]); for(let i=a.length-2;i>=0;i-=2) out.push(-a[i],a[i+1]); return out; };
    P(side(1),'#c8963a'); P(side(.62).map((v,i)=>i%2?v+4:v),'#e8b850'); R(-56,38,112,8,'#a87a28'); Ci(0,52,9,'#7a5a1a'); break; }
  default: _drawJunkZ_036b(c,id,R,Ci,E,P,Ln); } };
if(/[?&]test\b/.test(location.search)) window.__junkN=()=>JUNK.length;
if(/[?&]test\b/.test(location.search)) window.__oddSheet=(ids,save)=>{ const cols=7, cv=document.createElement('canvas'); const rows=Math.ceil(ids.length/cols); cv.width=cols*150; cv.height=rows*2*130; const x=cv.getContext('2d'); x.fillStyle='#1c3a4a'; x.fillRect(0,0,cv.width,cv.height);
  ids.forEach((id,i)=>{ const cx=(i%cols)*150+75, cy=Math.floor(i/cols)*130+60; drawJunkAt(x,id,cx,cy,.55,null); drawJunkAt(x,id,cx,cy+rows*130,.55,'#0a1a24'); x.fillStyle='#fff'; x.font='10px sans-serif'; x.textAlign='center'; x.fillText(id,cx,cy+58); }); __post(save,cv.toDataURL()); return ids.length; };

// ---------- lighting for every oddity, everywhere: shading from the top-left, a soft highlight, darker lower
// edges and a real drop shadow that follows its outline. Rendered once per size into a cached sprite, so it costs
// nothing per frame (oddities on the line, the catch card, the Fish Log). Silhouettes (unfound) stay flat.
const ODD_SPR={}; let ODD_SPR_N=0;
const _drawJunkAt_036 = drawJunkAt;
const ODD_LIVE={discoball:1,ring:1,goldtoilet:1}; /* these twinkle, so they are drawn live (with the shadow) instead of cached */
drawJunkAt = function(c,id,x,y,s,sil){ if(!s) return _drawJunkAt_036(c,id,x,y,s,sil); if(sil) return oddSil(c,id,x,y,s,sil); if(ODD_LIVE[id]){ c.save(); c.shadowColor='rgba(0,0,0,.35)'; c.shadowBlur=8*s; c.shadowOffsetY=5*s; _drawJunkAt_036(c,id,x,y,s,null); c.restore(); return; }
  const m=c.getTransform?c.getTransform():{a:1}, eff=Math.max(.05,Math.abs(m.a||1)*s), q=Math.max(.1,Math.round(eff*20)/20), key=id+'|'+q;
  let spr=ODD_SPR[key];
  if(!spr){ const S=Math.ceil(300*q), cv=document.createElement('canvas'); cv.width=S; cv.height=S; const x2=cv.getContext('2d');
    _drawJunkAt_036(x2,id,S/2,S/2,q,null);
    x2.globalCompositeOperation='source-atop';
    const lg=x2.createLinearGradient(S*.2,S*.15,S*.8,S*.85); lg.addColorStop(0,'rgba(255,250,235,.26)'); lg.addColorStop(.45,'rgba(255,255,255,0)'); lg.addColorStop(1,'rgba(10,14,24,.34)'); x2.fillStyle=lg; x2.fillRect(0,0,S,S);
    const rg=x2.createRadialGradient(S*.38,S*.32,0,S*.38,S*.32,S*.3); rg.addColorStop(0,'rgba(255,255,255,.2)'); rg.addColorStop(1,'rgba(255,255,255,0)'); x2.fillStyle=rg; x2.fillRect(0,0,S,S); x2.globalCompositeOperation="source-over"; defineSprite(cv,{d:Math.max(1,Math.round(S/90)),ao:.12});
    spr=ODD_SPR[key]={cv,S}; if(++ODD_SPR_N>240){ for(const k in ODD_SPR){ delete ODD_SPR[k]; } ODD_SPR_N=0; ODD_SPR[key]=spr; } }
  const d=spr.S/q*s; c.save(); c.shadowColor='rgba(0,0,0,.38)'; c.shadowBlur=Math.max(2,10*s*(m.a||1)); c.shadowOffsetY=Math.max(1,6*s*(m.a||1));
  c.drawImage(spr.cv,x-d/2,y-d/2,d,d); c.restore(); };
// silhouettes (unfound oddities) are one solid shape: drawn, then filled with the silhouette colour, so text or
// hard-coded colours inside a drawing can never give the item away
function oddSil(c,id,x,y,s,col){ const m=c.getTransform?c.getTransform():{a:1}, eff=Math.max(.05,Math.abs(m.a||1)*s), q=Math.max(.1,Math.round(eff*20)/20), key='sil|'+id+'|'+q+'|'+col;
  let spr=ODD_SPR[key]; if(!spr){ const S=Math.ceil(300*q), cv=document.createElement('canvas'); cv.width=S; cv.height=S; const x2=cv.getContext('2d'); _drawJunkAt_036(x2,id,S/2,S/2,q,col); x2.globalCompositeOperation='source-in'; x2.fillStyle=col; x2.fillRect(0,0,S,S); spr=ODD_SPR[key]={cv,S}; ODD_SPR_N++; }
  const d=spr.S/q*s; c.drawImage(spr.cv,x-d/2,y-d/2,d,d); }
// 0.3.6: the Rusty Old Rod and the Lost Tackle Box had no drawing (they showed a plain grey circle)
const _drawJunkZ_036c = drawJunkZ;
drawJunkZ = function(c,id,R,Ci,E,P,Ln){ switch(id){
  case 'oldrod': Ln([88,-84,90,-26],'#d8d4c8',1.6); Ln([90,-26,90,-14,84,-9,79,-15],'#a8a8b0',3);
    Ln([-60,52,16,-22],'#7a4a2c',9); Ln([16,-22,88,-84],'#9a6a44',5); for(const [x,y] of [[-6,-4],[30,-34],[60,-60],[84,-80]]){ Ci(x,y,4.5,'#5a5a5a'); Ci(x,y,2,'#2a3a4a'); }
    for(const [x,y,r] of [[-30,24,4],[4,-10,3],[44,-46,3]]) Ci(x,y,r,'#a0522d');
    Ln([-90,80,-60,52],'#c8a070',16); Ln([-86,76,-64,56],'#d8b888',4);
    Ci(-46,62,17,'#5a4a3e'); Ci(-46,62,10,'#7a6a5a'); Ci(-46,62,3.5,'#3a2a22'); Ln([-46,62,-30,74],'#3a2a20',4); Ci(-30,74,4.5,'#2a1e16'); break;
  case 'tackbox': P([-72,-8,72,-8,64,-34,-64,-34],'#4a7a5a'); R(-70,-8,140,66,'#3a6a4a'); R(-70,-8,140,6,'#5a8a6a'); R(-70,50,140,8,'#2a5038');
    Ln([-26,-34,-26,-52,26,-52,26,-34],'#22302a',8); R(-9,-14,18,13,'#c8a040'); R(-5,-10,10,4,'#8a6a20');
    P([-50,-8,-44,-20,-38,-8],'#ff7a3a'); P([30,-8,36,-18,42,-8],'#f8d23a'); Ln([-44,-20,-44,-26,-40,-28],'#b8b8c0',2.5);
    E(46,58,15,6,'#ff8a3a'); Ci(56,56,2.2,'#1a1a1a'); Ln([30,60,24,70,30,74],'#b8b8c0',2.5); break;
  default: _drawJunkZ_036c(c,id,R,Ci,E,P,Ln); } };
