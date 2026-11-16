
// =====================================================================
// Update 1.5 looks: outfits, glasses, beards, hairstyles, new hats,
// meme-fish flourishes, new pets, new aquarium decor
// =====================================================================
const OUTFITS = [['none','Just the shirt',0,'start'],['vest','Fishing vest',0,'start'],['lifejacket','Life jacket',1500,'shop'],['hoodie','Hoodie',2000,'shop'],['raincoat','Raincoat',2500,'shop'],
  ['overalls','Overalls',3000,'shop'],['puffer','Puffer jacket',6000,'shop'],['wetsuit','Wetsuit',9000,'shop'],['captain','Captain’s coat',15000,'shop'],['spacesuit','Space suit',0,'prize']];
const GLASSES = [['none','No glasses',0],['round','Round glasses',0],['nerd','Thick frames',600],['sunglasses','Sunglasses',800],['threed','3D glasses',1200],['heart','Heart shades',1500],['goggles','Ski goggles',2500],['monocle','Monocle',3000],['pixel','Pixel shades',6700]];
const BEARDS = [['none','Clean shaven'],['stubble','Stubble'],['mustache','Moustache'],['beard','Beard'],['longbeard','Wizard beard']];
const HAIRSTYLES = [['auto','Classic'],['short','Short'],['buzz','Buzz cut'],['long','Long'],['ponytail','Ponytail'],['bun','Bun'],['curly','Curly'],['spiky','Spiky'],['bald','Bald']];
function drawHair(c,hs,hair){ c.fillStyle=hair;
  switch(hs){
    case 'short': c.beginPath(); c.arc(0,-57,7.9,Math.PI,Math.PI*2); c.fill(); c.fillRect(-7.9,-58,4.5,5); break;
    case 'long': c.beginPath(); c.arc(0,-57,7.9,Math.PI*.92,Math.PI*2.04); c.fill(); c.beginPath(); c.ellipse(-9.5,-50,2.6,6,.35,0,7); c.fill(); break;
    case 'ponytail': c.beginPath(); c.arc(0,-57,7.9,Math.PI*.95,Math.PI*2.02); c.fill(); c.beginPath(); c.ellipse(-10.5,-54,2.4,6.5,.6,0,7); c.fill(); break;
    case 'bun': c.beginPath(); c.arc(0,-57,7.9,Math.PI*.95,Math.PI*2.02); c.fill(); c.beginPath(); c.arc(-3,-65.5,3.4,0,7); c.fill(); break;
    case 'buzz': c.globalAlpha*=.75; c.beginPath(); c.arc(0,-56.5,7.8,Math.PI*1.02,Math.PI*1.98); c.fill(); c.globalAlpha/=.75; break;
    case 'curly': for(let i=0;i<9;i++){ const a=Math.PI*(1+i/8); c.beginPath(); c.arc(Math.cos(a)*7,-57+Math.sin(a)*7,2.5,0,7); c.fill(); } c.beginPath(); c.arc(-7,-53,2.4,0,7); c.fill(); break;
    case 'spiky': c.beginPath(); c.arc(0,-57,7.6,Math.PI,Math.PI*2); c.fill(); c.beginPath(); for(let i=0;i<6;i++){ const x=-7+i*2.8; c.moveTo(x-1.6,-61); c.lineTo(x+.3,-67-((i*5)%3)); c.lineTo(x+1.6,-61); } c.fill(); break;
    case 'bald': break;
    default: c.beginPath(); c.arc(0,-57,7.9,Math.PI,Math.PI*2); c.fill(); c.fillRect(-7.9,-58,4.5,5);
  } }
function drawFace(c,lk,D,hair){ const b=lk.beard||'none', gl=lk.glasses||'none';
  if(b==='stubble'){ c.fillStyle=hair; c.globalAlpha*=.35; c.beginPath(); c.arc(1.5,-53,6,Math.PI*.05,Math.PI*.95); c.fill(); c.globalAlpha/=.35; }
  if(b==='mustache'){ c.fillStyle=hair; c.beginPath(); c.ellipse(5.4,-53.6,2.6,1,0,0,7); c.fill(); }
  if(b==='beard'||b==='longbeard'){ c.fillStyle=hair; c.beginPath(); c.moveTo(-3,-55); c.quadraticCurveTo(-2,b==='longbeard'?-40:-48,4,b==='longbeard'?-41:-48.5); c.quadraticCurveTo(8.5,-50,7.6,-54); c.lineTo(6,-53); c.quadraticCurveTo(4,-51.5,2,-53); c.closePath(); c.fill(); c.beginPath(); c.ellipse(5.4,-53.6,2.6,1,0,0,7); c.fill(); }
  const ex=4.4, ey=-57; c.lineWidth=.9;
  switch(gl){
    case 'round': c.strokeStyle=D('#2a2a2a'); c.beginPath(); c.arc(ex,ey,2.1,0,7); c.stroke(); c.beginPath(); c.moveTo(ex-2.1,ey); c.lineTo(-1,ey-.5); c.stroke(); break;
    case 'nerd': c.strokeStyle=D('#111'); c.lineWidth=1.4; c.strokeRect(ex-2.2,ey-1.8,4.4,3.4); c.beginPath(); c.moveTo(ex-2.2,ey); c.lineTo(-1,ey-.5); c.stroke(); break;
    case 'sunglasses': c.fillStyle='#111'; c.beginPath(); c.ellipse(ex+.3,ey+.2,2.6,1.8,0,0,7); c.fill(); c.strokeStyle='#111'; c.beginPath(); c.moveTo(ex-2.2,ey); c.lineTo(-1,ey-.5); c.stroke(); c.fillStyle='rgba(255,255,255,.4)'; c.fillRect(ex-.6,ey-.9,1.2,.6); break;
    case 'threed': c.fillStyle='#ff3a4a'; c.fillRect(ex-2.4,ey-1.4,2.3,2.8); c.fillStyle='#3ab0ff'; c.fillRect(ex+.1,ey-1.4,2.3,2.8); c.strokeStyle='#f4f4f4'; c.lineWidth=.6; c.strokeRect(ex-2.4,ey-1.4,4.8,2.8); break;
    case 'heart': c.fillStyle='#ff4a8a'; c.beginPath(); c.moveTo(ex,ey+1.8); c.bezierCurveTo(ex-3.4,ey-.4,ex-1.4,ey-3,ex,ey-1); c.bezierCurveTo(ex+1.4,ey-3,ex+3.4,ey-.4,ex,ey+1.8); c.fill(); break;
    case 'goggles': c.fillStyle='#2a2a2a'; c.fillRect(-7.6,ey-1.2,15,2.4); c.fillStyle='#ff9a2a'; c.beginPath(); c.ellipse(ex+.6,ey,3,2,0,0,7); c.fill(); c.fillStyle='rgba(255,255,255,.5)'; c.fillRect(ex,ey-1,1.4,.6); break;
    case 'monocle': c.strokeStyle='#ffcc33'; c.lineWidth=.8; c.beginPath(); c.arc(ex,ey,2.2,0,7); c.stroke(); c.beginPath(); c.moveTo(ex,ey+2.2); c.quadraticCurveTo(ex-1,ey+6,ex-3,ey+8); c.stroke(); break;
    case 'pixel': c.fillStyle='#111'; c.fillRect(ex-3,ey-1.4,6,1.4); c.fillRect(ex-2.4,ey,2,1.2); c.fillRect(ex+.6,ey,2,1.2); c.fillRect(-1,ey-1.4,2,1); c.fillStyle='#fff'; c.fillRect(ex-1.8,ey,.7,.6); c.fillRect(ex+1.2,ey,.7,.6); break;
  } }
function sleeveCol(lk,D){ const o=lk.outfit; if(o==='raincoat'||o==='hoodie'||o==='puffer') return D(lk.outCol||'#d8a020'); if(o==='wetsuit') return D('#1a1a22'); if(o==='captain') return D(lk.outCol||'#1a2a4a'); if(o==='spacesuit') return D('#e8ecf0'); return null; }
function drawOutfit(c,lk,D){ const o=lk.outfit||'none'; if(o==='none') return; const oc=D(lk.outCol||'#d8a020'); const R=(x,y,w,h,cl)=>{ c.fillStyle=cl; c.fillRect(x,y,w,h); };
  switch(o){
    case 'vest': { const pk=D(mix(lk.outCol||'#6a7a4a','#000000',.2)); R(-8,-46,5,22,oc); R(3,-46,5,22,oc); R(-7.5,-38,4,4,pk); R(3.5,-38,4,4,pk); R(-7.5,-31,4,4,pk); R(3.5,-31,4,4,pk); break; }
    case 'lifejacket': R(-8.5,-46,6,21,oc); R(2.5,-46,6,21,oc); R(-8.5,-36,17,2,D('#2a2a2a')); R(-8.5,-30,17,2,D('#2a2a2a')); R(-1,-37,2,4,D('#c8c8c8')); break;
    case 'raincoat': c.fillStyle=oc; c.beginPath(); c.moveTo(-8.6,-46); c.lineTo(8.6,-46); c.lineTo(9.5,-18); c.lineTo(-9.5,-18); c.closePath(); c.fill(); R(-.4,-44,.8,25,D(mix(lk.outCol||'#d8a020','#000000',.25))); for(let i=0;i<4;i++) R(1,-42+i*6,1.4,1.4,D('#333')); c.fillStyle=oc; c.beginPath(); c.moveTo(-6,-47); c.lineTo(0,-43); c.lineTo(6,-47); c.lineTo(5,-49); c.lineTo(-5,-49); c.fill(); break;
    case 'hoodie': c.fillStyle=oc; c.beginPath(); c.moveTo(-8.4,-46); c.lineTo(8.4,-46); c.lineTo(8,-22); c.lineTo(-8,-22); c.closePath(); c.fill(); c.beginPath(); c.ellipse(-4,-47.5,5,3,-.3,0,7); c.fill(); R(-4,-32,8,5,D(mix(lk.outCol||'#d8a020','#000000',.2))); c.strokeStyle=D('#f4f4f4'); c.lineWidth=.6; c.beginPath(); c.moveTo(1,-45); c.lineTo(1.4,-39); c.moveTo(3,-45); c.lineTo(3.4,-40); c.stroke(); break;
    case 'overalls': { const den=oc; R(-7,-22,6,18,den); R(1,-22,6,18,den); R(-7,-25,14,5,den); R(-5,-36,10,12,den); R(-6,-46,2,11,den); R(4,-46,2,11,den); R(-5,-37,1.6,1.6,D('#ffcc33')); R(3.4,-37,1.6,1.6,D('#ffcc33')); R(-2,-32,4,3,D(mix(lk.outCol||'#3a6f9a','#000000',.25))); break; }
    case 'puffer': c.fillStyle=oc; c.beginPath(); c.moveTo(-9.5,-46); c.lineTo(9.5,-46); c.lineTo(9.5,-21); c.lineTo(-9.5,-21); c.closePath(); c.fill(); c.strokeStyle=D(mix(lk.outCol||'#d8a020','#000000',.25)); c.lineWidth=.8; for(let y=-41;y<-21;y+=5){ c.beginPath(); c.moveTo(-9.5,y); c.lineTo(9.5,y); c.stroke(); } R(-.4,-46,.8,25,D('#ddd')); break;
    case 'wetsuit': { const w=D('#1a1a22'); R(-8,-46,16,24,w); R(-7,-25,14,5,w); R(-7,-22,6,18,w); R(1,-22,6,18,w); R(-8,-40,16,2,oc); R(-7,-12,6,1.6,oc); R(1,-12,6,1.6,oc); break; }
    case 'captain': { const n=oc; c.fillStyle=n; c.beginPath(); c.moveTo(-8.8,-46); c.lineTo(8.8,-46); c.lineTo(9.6,-16); c.lineTo(-9.6,-16); c.closePath(); c.fill(); for(let i=0;i<4;i++){ R(-3,-42+i*6,1.6,1.6,D('#ffcc33')); R(1.6,-42+i*6,1.6,1.6,D('#ffcc33')); } R(5,-46,4,1.6,D('#ffcc33')); R(5,-43.6,4,1.6,D('#ffcc33')); break; }
    case 'spacesuit': { const s=D('#e8ecf0'); R(-8.6,-46,17.2,25,s); R(-7.5,-25,15,5,s); R(-7.5,-22,6.6,18,s); R(.9,-22,6.6,18,s); R(-4,-40,8,6,D('#5a6a7a')); R(-3,-39,2,2,D('#ff4a4a')); R(.5,-39,2,2,D('#4aff8a')); R(-8.6,-27,17.2,2,D('#c8553a')); break; }
  } }

// ---------- new hats ----------
function drawHatX(c,id,col,t,h){ const {dk,lt,el,ci,poly,dome}=h; const f=cl=>{ c.fillStyle=cl; };
  switch(id){
    case 'catears': poly([-7,-5,-5,-14,-1,-7],col); poly([7,-5,5,-14,1,-7],col); poly([-6,-6,-5,-11.5,-2.5,-7],'#ffb0c8'); poly([6,-6,5,-11.5,2.5,-7],'#ffb0c8'); break;
    case 'bunnyears': el(-3,-15,1.8,7,col,-.15); el(3,-15,1.8,7,col,.15); el(-3,-14.5,.9,5,'#ffb0c8',-.15); el(3,-14.5,.9,5,'#ffb0c8',.15); f(col); c.fillRect(-6,-8.5,12,2); break;
    case 'headphones': c.strokeStyle=dk; c.lineWidth=1.8; c.beginPath(); c.arc(0,-1,8.6,Math.PI*1.05,Math.PI*1.95); c.stroke(); el(-7.8,-1,2.4,3.4,col); el(7.8,-1,2.4,3.4,col); break;
    case 'bandanahead': dome(8.1,-2.5,col); f(dk); c.fillRect(-8.3,-4,16.6,1.6); poly([-7,-3,-12,-1,-11,1],col); for(let i=0;i<4;i++) ci(-4+i*2.6,-6.5,.6,lt); break;
    case 'witch': el(0,-4,13,2.6,col); f(col); c.beginPath(); c.moveTo(-6.5,-5); c.lineTo(6.5,-5); c.lineTo(3,-14); c.quadraticCurveTo(1,-22,7,-24); c.quadraticCurveTo(-1,-21,-2,-14); c.closePath(); c.fill(); f('#a07aff'); c.fillRect(-6.5,-7.5,13,2); break;
    case 'mushroom': f(col); c.beginPath(); c.ellipse(0,-6,12,7,0,Math.PI,0); c.fill(); for(const [x,y,r] of [[-6,-9,1.8],[0,-11,2],[6,-8.5,1.6],[-2,-7,1.2],[4,-6.8,1]]) ci(x,y,r,'#fff6ec'); break;
    case 'tiara': f('#e8ecf4'); c.beginPath(); c.moveTo(-6,-6); c.lineTo(-4,-9); c.lineTo(-2,-7); c.lineTo(0,-12); c.lineTo(2,-7); c.lineTo(4,-9); c.lineTo(6,-6); c.closePath(); c.fill(); ci(0,-9.5,1.2,col); ci(-4,-7.5,.7,'#9ad8ff'); ci(4,-7.5,.7,'#9ad8ff'); break;
    case 'pumpkin': ci(0,-1,10.5,'#ff8a1a'); f('#e06a10'); for(const dx of [-5,0,5]){ c.beginPath(); c.ellipse(dx,-1,2.6,10,0,0,7); c.fill(); } ci(0,-1,9,'#ff9a2a'); poly([-5,-4,-2,-4,-3.5,-7],'#2a1a10'); poly([2,-4,5,-4,3.5,-7],'#2a1a10'); poly([-5,1,5,1,3,4,0,2.5,-3,4],'#2a1a10'); f('#3a8a3a'); c.fillRect(-1,-13,2,3.5); break;
    case 'knight': ci(0,-1,10,'#9aa0a8'); f('#7a8088'); c.fillRect(-10,-2,20,2.2); f('#2a2a2a'); c.fillRect(1,-1,9,1.4); c.fillRect(1,2,9,1.4); f(col); c.beginPath(); c.moveTo(-2,-11); c.quadraticCurveTo(-10,-20,-12,-10); c.quadraticCurveTo(-6,-14,-2,-9); c.fill(); break;
    case 'duckonhead': el(-1,-11,7,4.5,'#ffd23a'); ci(4,-16,3.6,'#ffd23a'); poly([7,-16.5,10.5,-15.5,7,-14.5],'#ff8a2a'); ci(5,-17,.8,'#111'); el(-3,-11,3,2,'#f0c020',-.3); break;
    case 'fishbowl': c.globalAlpha*=.35; ci(0,0,13,'#9ad8ff'); c.globalAlpha/=.35; c.strokeStyle='rgba(220,245,255,.8)'; c.lineWidth=1; c.beginPath(); c.arc(0,0,13,0,7); c.stroke(); drawFish(c,-5+Math.sin(t)*3,-8,7,'#ff8a2a','#ffd08a',.45,t*8,Math.cos(t)<0,{}); c.fillStyle='rgba(220,245,255,.6)'; c.beginPath(); c.arc(6,-9+(-t*6%10),1,0,7); c.fill(); break;
    case 'sixsevencap': dome(8,-1,col); f(dk); c.fillRect(5,-2.2,8.5,2.4); f('#fff'); c.font='800 6px system-ui'; c.textAlign='center'; c.fillText('67',0,-3.2); break;
    case 'carnival': el(0,-5,11,2,'#d8303a'); f('#d8303a'); c.fillRect(-6.5,-21,13,16); f('#fff'); for(let i=0;i<3;i++) c.fillRect(-6.5+i*4.4,-21,2.2,16); f('#ffcc33'); c.fillRect(-6.5,-9.5,13,2.5); ci(4,-23,1.6,'#ffcc33'); break;
  } }

// ---------- meme fish flourishes ----------
const MEME_X = {sixseven:1, skibidi:1, sigmashark:1, tralala:1, aurafarmer:1, maincharacter:1, thisisfine:1, pastryfish:1, bingchilling:1, stonks:1, npcfish:1, touchgrass:1, ohiocarp:1, fanumtax:1};
function memeBehind(c,sp,x,y,L,o){ const H2=L*sp.h, t=performance.now()/1000; c.save(); c.translate(x,y); if(o.flip) c.scale(-1,1);
  if(sp.id==='aurafarmer'){ const gr=c.createRadialGradient(0,0,L*.1,0,0,L*.75); gr.addColorStop(0,'rgba(160,230,255,.55)'); gr.addColorStop(1,'rgba(160,230,255,0)'); c.fillStyle=gr; c.fillRect(-L,-L,L*2,L*2); }
  if(sp.id==='pastryfish'){ const cols=['#ff4a4a','#ffa04a','#ffe04a','#4ae04a','#4aa0ff','#a04aff']; cols.forEach((cl,i)=>{ c.fillStyle=cl; c.fillRect(-L*1.25,-H2*.45+i*H2*.15+Math.sin(t*6+i)*.8,L*.75,H2*.15); }); }
  if(sp.id==='thisisfine'){ for(let i=0;i<5;i++){ const fx=-L*.5+i*L*.25, fh=L*(.25+.1*Math.sin(t*9+i*2)); c.fillStyle='#ff7a1a'; c.beginPath(); c.moveTo(fx-L*.08,H2*.6); c.quadraticCurveTo(fx,H2*.6-fh*1.6,fx+L*.08,H2*.6); c.fill(); c.fillStyle='#ffd04a'; c.beginPath(); c.moveTo(fx-L*.04,H2*.6); c.quadraticCurveTo(fx,H2*.6-fh,fx+L*.04,H2*.6); c.fill(); } }
  c.restore(); }
function memeExtra(c,sp,x,y,L,o){ const H2=L*sp.h, t=performance.now()/1000, ex=L*.31, ey=-H2*.08; c.save(); c.translate(x,y); if(o.flip) c.scale(-1,1);
  const txt=(s,tx,ty,size,cl)=>{ c.save(); c.translate(tx,ty); if(o.flip) c.scale(-1,1); c.fillStyle=cl; c.font='800 '+size+'px system-ui'; c.textAlign='center'; c.fillText(s,0,0); c.restore(); };
  switch(sp.id){
    case 'sixseven': { const a=Math.sin(t*9)*L*.05; const hands=[[-L*.06,a],[L*.16,-a]];
      for(const [hx,ph] of hands){ const hy=-H2*.5-L*.06+ph; c.strokeStyle='#e8b98f'; c.lineWidth=Math.max(1.6,L*.04); c.lineCap='round'; c.beginPath(); c.moveTo(hx,-H2*.3); c.lineTo(hx,hy); c.stroke(); c.fillStyle='#e8b98f'; c.beginPath(); c.ellipse(hx,hy,Math.max(2,L*.06),Math.max(1.6,L*.045),0,0,7); c.fill(); }
      txt('6',hands[0][0]-L*.13,-H2*.45+a,Math.max(8,L*.16),'#ffd84a'); txt('7',hands[1][0]+L*.13,-H2*.45-a,Math.max(8,L*.16),'#ffd84a'); break; }
    case 'skibidi': c.fillStyle='#f4f4f2'; c.beginPath(); c.ellipse(L*.05,H2*.45,L*.5,H2*.42,0,0,Math.PI); c.fill(); c.strokeStyle='#d8dce0'; c.lineWidth=Math.max(1,L*.03); c.beginPath(); c.ellipse(L*.05,H2*.42,L*.52,H2*.16,0,0,7); c.stroke(); c.fillStyle='#e8ecee'; c.fillRect(-L*.62,-H2*.2,L*.16,H2*.8); break;
    case 'sigmashark': c.fillStyle='#0a0a0a'; c.fillRect(ex-L*.07,ey-L*.03,L*.16,L*.06); c.fillRect(ex-L*.22,ey-L*.015,L*.15,L*.02); break;
    case 'tralala': for(const sx of [-L*.08,L*.14]){ c.fillStyle='#f4f4f4'; c.beginPath(); c.ellipse(sx,H2*.55,L*.09,L*.045,0,0,7); c.fill(); c.fillStyle='#3a7aff'; c.fillRect(sx-L*.07,H2*.53,L*.12,L*.022); c.fillStyle='#ff4a4a'; c.fillRect(sx-L*.09,H2*.58,L*.18,L*.015); } break;
    case 'aurafarmer': txt('+1000 aura',0,-H2*.75-L*.05*Math.abs(Math.sin(t*2)),Math.max(6,L*.11),'rgba(200,240,255,.9)'); break;
    case 'maincharacter': c.fillStyle='#ffcc33'; c.beginPath(); const cx=L*.06, cy=-H2*.5; c.moveTo(cx-L*.1,cy); c.lineTo(cx-L*.12,cy-L*.12); c.lineTo(cx-L*.05,cy-L*.06); c.lineTo(cx,cy-L*.15); c.lineTo(cx+L*.05,cy-L*.06); c.lineTo(cx+L*.12,cy-L*.12); c.lineTo(cx+L*.1,cy); c.closePath(); c.fill(); break;
    case 'bingchilling': { const bx=L*.52, by=L*.02; c.fillStyle='#d8a050'; c.beginPath(); c.moveTo(bx-L*.05,by); c.lineTo(bx+L*.05,by); c.lineTo(bx,by+L*.15); c.fill(); c.fillStyle='#ffd0e0'; c.beginPath(); c.arc(bx,by-L*.02,L*.06,0,7); c.fill(); break; }
    case 'stonks': c.strokeStyle='#4aff6a'; c.lineWidth=Math.max(1.4,L*.035); c.beginPath(); c.moveTo(-L*.3,-H2*.6); c.lineTo(-L*.1,-H2*.75); c.lineTo(0,-H2*.68); c.lineTo(L*.25,-H2*.95); c.stroke(); c.fillStyle='#4aff6a'; c.beginPath(); c.moveTo(L*.3,-H2*1.0); c.lineTo(L*.18,-H2*.98); c.lineTo(L*.27,-H2*.86); c.fill(); break;
    case 'npcfish': c.fillStyle='rgba(240,244,248,.9)'; c.beginPath(); c.ellipse(L*.35,-H2*.95,L*.17,L*.09,0,0,7); c.fill(); c.beginPath(); c.moveTo(L*.28,-H2*.85); c.lineTo(L*.32,-H2*.7); c.lineTo(L*.36,-H2*.86); c.fill(); txt('...',L*.35,-H2*.92,Math.max(6,L*.1),'#333'); break;
    case 'touchgrass': c.strokeStyle='#4ac04a'; c.lineWidth=Math.max(1,L*.02); for(let i=0;i<4;i++){ c.beginPath(); c.moveTo(L*.44,H2*.05); c.lineTo(L*.52+i*L*.02,-H2*.2-i*L*.02); c.stroke(); } break;
    case 'ohiocarp': txt('?',-L*.1,-H2*.7-Math.sin(t*3)*L*.04,Math.max(7,L*.15),'#ffd84a'); txt('?',L*.15,-H2*.85-Math.cos(t*3)*L*.04,Math.max(6,L*.12),'#ffd84a'); break;
    case 'fanumtax': c.strokeStyle='#e88a9a'; c.lineWidth=Math.max(1.2,L*.03); c.beginPath(); c.moveTo(L*.45,H2*.02); c.quadraticCurveTo(L*.55,H2*.25+Math.sin(t*6)*L*.03,L*.5,H2*.4); c.stroke(); break;
  }
  c.restore(); }

// ---------- new pets ----------
function drawPetY(c,id,t,h){ const {el,ci,rc,ln,eye,blink}=h;
  switch(id){
    case 'corgi': ln([-8,-7,-10,-9+Math.sin(t*10)],'#e0903a',2); rc(-6,-3,2.2,3,'#e0903a'); rc(4,-3,2.2,3,'#e0903a'); el(0,-6,8,4,'#e0903a'); el(1,-4.5,5,2.2,'#fff4e8'); ci(8,-10.5,4,'#e0903a'); c.fillStyle='#e0903a'; c.beginPath(); c.moveTo(5.5,-13); c.lineTo(5.5,-19); c.lineTo(8.5,-14); c.moveTo(8.5,-14); c.lineTo(11,-19); c.lineTo(11,-13); c.fill(); el(10.5,-9.4,2.4,1.6,'#fff4e8'); ci(12.6,-9.8,.8,'#111'); if(!blink) eye(9,-11.5,.8); break;
    case 'shiba': c.strokeStyle='#d8903a'; c.lineWidth=2.4; c.beginPath(); c.arc(-8,-10,3,Math.PI*.2,Math.PI*1.7); c.stroke(); rc(-6,-5,2,5,'#d8903a'); rc(4,-5,2,5,'#d8903a'); el(0,-8,7,4,'#d8903a'); el(.5,-6.5,4.5,2,'#fff4e8'); ci(7,-12,4,'#d8903a'); c.fillStyle='#d8903a'; c.beginPath(); c.moveTo(4.5,-14); c.lineTo(5,-18.5); c.lineTo(7,-15); c.moveTo(7.5,-15); c.lineTo(9.5,-18.5); c.lineTo(9.5,-14); c.fill(); el(9,-10.5,2.6,1.8,'#fff4e8'); ci(11.4,-11,.7,'#111'); if(!blink){ ln([7,-12.6,8.4,-12.6],'#111',.7); } break;
    case 'goose': rc(-1,-3,1,3,'#ff9a2a'); rc(2,-3,1,3,'#ff9a2a'); el(0,-8,6.5,4.5,'#f4f4f2'); ln([3,-10,5,-16,5.5,-19],'#f4f4f2',2.6); ci(6,-20,2.6,'#f4f4f2'); c.fillStyle='#ff9a2a'; c.beginPath(); c.moveTo(8,-20.5); c.lineTo(11,-19.5); c.lineTo(8,-18.5); c.fill(); eye(6.6,-20.8,.6); el(-3,-9,3.4,2,'#e0e0dc',-.3); if(Math.sin(t*.7)>.97){ c.fillStyle='#fff'; c.font='800 5px system-ui'; c.fillText('HONK',8,-25); } break;
    case 'squirrel': el(-6,-12,3.6,7.5,'#c86a2a',.3); el(0,-6,4,5.5,'#d8783a'); el(.6,-5,2.2,3.4,'#f8e0c0'); ci(3,-12.5,3.4,'#d8783a'); c.fillStyle='#d8783a'; c.beginPath(); c.moveTo(1.6,-15); c.lineTo(2,-18); c.lineTo(3.6,-15.4); c.fill(); if(!blink) eye(4.4,-13.2,.7); ci(4.2,-8,1.2,'#8a5a2a'); break;
    case 'beaver': el(-9,-2,4,1.6,'#5a4030'); el(0,-6,7,5,'#8a5a3a'); ci(7,-9,4,'#8a5a3a'); el(9.5,-8.2,2.2,1.6,'#a8784a'); rc(9,-6.8,1.6,1.8,'#fff'); ci(10.8,-8.8,.7,'#222'); if(!blink) eye(7.8,-10.4,.7); ci(5,-12.4,1,'#7a4a2a'); break;
    case 'cow': for(const lx of [-8,-4,5,9]) rc(lx-1.2,-10,2.4,10,'#f4f2ec'); el(0,-15,11,6,'#f4f2ec'); el(-4,-16,3.4,2.4,'#1a1a1a'); el(4,-13,2.6,2,'#1a1a1a'); el(11,-17,4.5,4,'#f4f2ec'); el(13.6,-15,2.6,2,'#f0b0b8'); ln([9,-20.5,8,-23],'#d8c8a0',1.2); ln([12,-20.8,13,-23.2],'#d8c8a0',1.2); if(!blink) eye(11.6,-18.4,.8); ln([-11,-16,-13,-11],'#f4f2ec',1.2); break;
    case 'sloth': el(0,-7,5.5,6.5,'#8a7a6a'); ci(1,-14,4.2,'#8a7a6a'); el(1.6,-13.8,3.2,2.6,'#d8c8b0'); ln([-1.5,-14.4,.5,-13.8],'#2a2018',1.4); ln([2.6,-13.8,4.6,-14.4],'#2a2018',1.4); ci(1.8,-12.2,.8,'#2a2018'); ln([-4,-9,-7,-4],'#8a7a6a',2.2); ln([4,-9,7,-5],'#8a7a6a',2.2); if(Math.sin(t*.5)>.9){ c.fillStyle='#fff'; c.font='700 4px system-ui'; c.fillText('z',6,-19); } break;
    case 'deer': for(const lx of [-6,-3,4,7]) rc(lx-.8,-10,1.6,10,'#b8844a'); el(0,-12,8,4.5,'#c8945a'); for(const [sx,sy] of [[-3,-13],[0,-14],[3,-12.5]]) ci(sx,sy,.9,'#f4e8d8'); ln([6,-14,8,-18],'#c8945a',2.4); ci(9,-19,3.6,'#c8945a'); el(11.4,-18.4,1.8,1.4,'#a87440'); ci(12.6,-18.6,.6,'#222'); el(7,-22,1.2,2.4,'#c8945a',-.4); ln([9,-22,8,-26,6.5,-27],'#8a6a3a',.9); ln([10,-22,11,-26,12.5,-27],'#8a6a3a',.9); if(!blink) eye(9.6,-19.6,.7); break;
    case 'jelly': { const bob=Math.sin(t*1.5)*2; c.translate(0,bob); c.strokeStyle='rgba(220,245,255,.6)'; c.lineWidth=.7; c.beginPath(); c.arc(0,-11,10,0,7); c.stroke(); c.fillStyle='rgba(180,220,255,.15)'; c.fill(); c.strokeStyle='#ffb0e0'; c.lineWidth=.9; for(let i=-2;i<=2;i++){ c.beginPath(); c.moveTo(i*2,-11); c.quadraticCurveTo(i*2+Math.sin(t*3+i)*2,-6,i*2+Math.sin(t*2+i),-3); c.stroke(); } c.fillStyle='#ff9ad8'; c.beginPath(); c.arc(0,-12,5,Math.PI,0); c.fill(); eye(-1.6,-13,.6); eye(1.6,-13,.6); break; }
    case 'tiger': ln([-8,-7,-12,-9,-13,-13],'#e8822a',2); rc(-6,-4,2.2,4,'#e8822a'); rc(4,-4,2.2,4,'#e8822a'); el(0,-7,8,4.6,'#e8822a'); for(let i=-2;i<=2;i++) ln([i*3,-11,i*3+1,-8],'#2a1a10',1); ci(8,-12,4.2,'#e8822a'); el(10,-10.6,2.4,1.6,'#fff4e8'); ln([6.5,-15.5,7,-13.5],'#2a1a10',.8); ln([9,-16,9,-14],'#2a1a10',.8); c.fillStyle='#e8822a'; c.beginPath(); c.arc(5.5,-15.5,1.4,0,7); c.arc(10,-15.8,1.4,0,7); c.fill(); ci(12,-11,.7,'#111'); if(!blink) eye(9,-12.8,.7); break;
    case 'phoenix': { const f=Math.sin(t*6); for(let i=0;i<4;i++){ c.fillStyle=['#ff4a2a','#ff8a2a','#ffc84a','#ff6a3a'][i]; c.beginPath(); c.moveTo(-3,-10); c.quadraticCurveTo(-10-i*2,-6+i*2+f,-14-i,-2+i*3); c.quadraticCurveTo(-7,-8,-3,-7); c.fill(); }
      c.fillStyle='#ff6a2a'; c.beginPath(); c.moveTo(-1,-14); c.lineTo(-7,-22-f*2); c.lineTo(-1,-17); c.fill(); el(0,-12,4,6,'#ff5a2a'); ci(5,-17,3.6,'#ff7a2a'); c.fillStyle='#ffd84a'; c.beginPath(); c.moveTo(8,-17.5); c.lineTo(11,-16.5); c.lineTo(8,-15.5); c.fill(); eye(6,-17.8,.7); ln([5,-20,4,-23],'#ffd84a',1); ln([6,-20.4,6.5,-23.6],'#ffd84a',1); break; }
    case 'narwhal': { c.translate(0,Math.sin(t*1.2)); el(0,-5,9,4.5,'#7a9ab8'); el(1,-3.2,6,2.4,'#d8e4f0'); c.fillStyle='#6a8aa8'; c.beginPath(); c.moveTo(-8,-5); c.lineTo(-13,-9); c.lineTo(-12,-5); c.lineTo(-13,-1); c.closePath(); c.fill(); c.strokeStyle='#f4ecd8'; c.lineWidth=1.4; c.beginPath(); c.moveTo(8,-7); c.lineTo(17,-12); c.stroke(); c.strokeStyle='#c8b898'; c.lineWidth=.5; for(let i=0;i<4;i++){ c.beginPath(); c.moveTo(9+i*2,-8-i*1.1); c.lineTo(10+i*2,-7-i*1.1); c.stroke(); } eye(6,-6.5,.7); break; }
    case 'teddy': el(0,-7,6,6.5,'#a8743a'); el(0,-5.5,3.6,4,'#d8a868'); ci(0,-15,5,'#a8743a'); ci(-4,-19,2,'#a8743a'); ci(4,-19,2,'#a8743a'); ci(-4,-19,1,'#d8a868'); ci(4,-19,1,'#d8a868'); el(.6,-13.4,2.4,1.8,'#d8a868'); ci(.8,-14,.8,'#2a1a10'); eye(-1.8,-16,.7); eye(2.4,-16,.7); c.fillStyle='#d8303a'; c.beginPath(); c.moveTo(0,-10); c.lineTo(-2.6,-11.4); c.lineTo(-2.6,-8.6); c.closePath(); c.moveTo(0,-10); c.lineTo(2.6,-11.4); c.lineTo(2.6,-8.6); c.closePath(); c.fill(); ln([-5,-6,-8,-3],'#a8743a',2.4); ln([5,-6,8,-3],'#a8743a',2.4); break;
  } }

// ---------- new aquarium decor ----------
function drawDecorX(c,id,t,h){ const {R,Ci,E,P}=h;
  switch(id){
    case 'bonsai': R(-20,-10,40,10,'#6a4a3a'); c.strokeStyle='#5a3a2a'; c.lineWidth=6; c.beginPath(); c.moveTo(0,-10); c.quadraticCurveTo(-10,-30,6,-44); c.stroke(); for(const [x,y,r] of [[-14,-40,12],[8,-50,14],[18,-36,10],[-2,-58,9]]) Ci(x,y,r,'#3a8a4a'); break;
    case 'pizza': P([-34,0,34,0,0,-70],'#f0c060'); P([-30,-3,30,-3,0,-62],'#ff7a3a'); for(const [x,y] of [[-8,-14],[8,-20],[0,-36],[-4,-50]]) Ci(x,y,5,'#c8302a'); R(-36,-4,72,6,'#d89040'); break;
    case 'chair': R(-18,-30,36,8,'#2a2a3a'); R(-16,-62,32,30,'#3a3a4a'); R(-3,-22,6,14,'#888'); for(const a of [-1,0,1]){ c.strokeStyle='#888'; c.lineWidth=3; c.beginPath(); c.moveTo(0,-8); c.lineTo(a*18,-2); c.stroke(); Ci(a*18,-1,3,'#222'); } break;
    case 'couch': R(-44,-30,88,22,'#c8553a'); R(-44,-50,88,22,'#b8452a'); R(-50,-40,12,32,'#a83a22'); R(38,-40,12,32,'#a83a22'); R(-40,-8,6,8,'#5a3020'); R(34,-8,6,8,'#5a3020'); Ci(-16,-36,8,'#ffd84a'); break;
    case 'gnomediver': P([-14,-44,14,-44,0,-80],'#d8473a'); Ci(0,-36,12,'#f6d0b0'); P([-12,-30,12,-30,0,-6],'#f4f4f4'); R(-16,-6,32,6,'#3a6fca'); E(2,-40,10,6,'rgba(154,216,255,.6)'); c.strokeStyle='#ffcc33'; c.lineWidth=3; c.beginPath(); c.moveTo(10,-44); c.lineTo(16,-70); c.stroke(); break;
    case 'toiletthrone': E(0,-18,28,14,'#f4f4f2'); E(0,-20,18,8,'#c8d8e0'); R(-24,-60,48,30,'#f4f4f2'); R(-10,-16,20,16,'#e8e8e6'); P([-16,-60,-12,-74,-6,-64,0,-78,6,-64,12,-74,16,-60],'#ffcc33'); break;
    case 'disco': R(-1,-110,2,30,'#888'); c.save(); c.translate(0,-62); c.rotate(t*.6); Ci(0,0,22,'#b8c0c8'); for(let i=-22;i<22;i+=7) for(let j=-22;j<22;j+=7) if(i*i+j*j<440){ c.fillStyle=((i+j)/7|0)%2?'#e8f0ff':'#8a96a0'; c.fillRect(i,j,6,6); } c.restore(); for(let i=0;i<5;i++){ const a=t*2+i*1.26; c.fillStyle=['rgba(255,90,170,.5)','rgba(90,200,255,.5)','rgba(255,220,90,.5)'][i%3]; c.beginPath(); c.arc(Math.cos(a)*50,-62+Math.sin(a)*30,4,0,7); c.fill(); } break;
    case 'tvfish': R(-30,-50,60,44,'#6b4a2e'); R(-24,-44,40,32,'#4a8ab8'); drawFish(c,-4+Math.sin(t)*8,-28,18,'#ff8a2a','#ffd08a',.4,t*8,Math.cos(t)<0,{}); R(-6,-6,12,6,'#5a3a20'); R(20,-38,4,4,'#c8a060'); R(20,-28,4,4,'#c8a060'); break;
    case 'flamingofloat': c.save(); c.translate(0,-30+Math.sin(t*1.2)*3); E(0,0,30,9,'#ff9ab0'); E(0,0,18,5,'#ffd0dc'); c.strokeStyle='#ff9ab0'; c.lineWidth=7; c.beginPath(); c.moveTo(22,-2); c.quadraticCurveTo(34,-30,22,-40); c.stroke(); Ci(24,-42,7,'#ff9ab0'); P([30,-43,40,-38,30,-38],'#2a2a2a'); c.restore(); break;
    case 'bigclam': E(0,-12,34,14,'#c8a0d8'); c.save(); c.translate(0,-14); c.rotate(-.5-Math.abs(Math.sin(t*.5))*.2); E(0,-10,32,14,'#d8b0e8'); c.restore(); Ci(0,-16,8,'#ffffff'); Ci(-2,-18,3,'#e8f0ff'); break;
    case 'jellylamp': R(-14,-8,28,8,'#4a4a5a'); c.globalAlpha=.75; E(0,-40,20,26,'#7a5aff'); c.globalAlpha=1; for(let i=0;i<3;i++){ const k=((t*.3+i/3)%1); c.fillStyle='#ff9ad8'; c.beginPath(); c.arc(Math.sin(t+i)*8,-16-k*44,5,Math.PI,0); c.fill(); } break;
    case 'wreckcar': c.save(); c.rotate(.06); R(-52,-30,104,24,'#4a7a9a'); P([-30,-30,-18,-52,24,-52,38,-30],'#3a6a8a'); R(-14,-48,16,16,'rgba(154,216,255,.5)'); R(6,-48,14,16,'rgba(154,216,255,.5)'); Ci(-30,-6,11,'#222'); Ci(30,-6,11,'#222'); E(-10,-30,10,3,'#8a6a4a'); c.restore(); break;
    case 'treasurepile': for(let i=0;i<34;i++){ const x=-40+((i*37)%80), y=-((i*13)%28)-4; Ci(x,y,6,i%5?'#ffcc33':'#e8b020'); } Ci(10,-30,6,'#5aa9ff'); Ci(-18,-22,5,'#ff5a7a'); break;
    case 'carousel': R(-3,-96,6,96,'#ffcc33'); P([-44,-90,44,-90,0,-118],'#d8303a'); for(let i=0;i<4;i++) R(-44+i*22,-90,11,6,'#fff'); c.save(); c.translate(0,-50); for(let i=0;i<3;i++){ const a=t*.8+i*2.09; const x=Math.cos(a)*30, s=.75+.25*Math.sin(a); c.strokeStyle='#ffcc33'; c.lineWidth=2; c.beginPath(); c.moveTo(x,-40); c.lineTo(x,10); c.stroke(); c.save(); c.translate(x,Math.sin(t*2+i)*6); c.scale(s,s); E(0,0,13,7,['#ffffff','#ff9ad0','#9ad8ff'][i]); Ci(11,-8,5,['#ffffff','#ff9ad0','#9ad8ff'][i]); c.restore(); } c.restore(); R(-48,-6,96,6,'#d8303a'); break;
  } }
