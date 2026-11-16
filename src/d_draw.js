
// ---------- drawing: creatures ----------
function drawFish(c,x,y,L,col,belly,h=.38,wag=0,flip=false,o={}){
  c.save(); c.translate(x,y); if(flip) c.scale(-1,1); const H2=L*h; const w=Math.sin(wag)*L*.04; const a0=c.globalAlpha;
  c.fillStyle=col; c.beginPath(); c.moveTo(-L*.4,0); c.lineTo(-L*.62,-Math.max(H2*.6,L*.12)+w); c.lineTo(-L*.55,w*.5); c.lineTo(-L*.62,Math.max(H2*.6,L*.12)+w); c.closePath(); c.fill();
  c.beginPath(); if(o.shark){ c.moveTo(L*.5,H2*.05); c.quadraticCurveTo(L*.3,-H2*.55,-L*.1,-H2*.5); c.quadraticCurveTo(-L*.42,-H2*.3,-L*.44,0); c.quadraticCurveTo(-L*.3,H2*.5,0,H2*.5); c.quadraticCurveTo(L*.35,H2*.45,L*.5,H2*.05); }
  else c.ellipse(0,0,L*.46,H2*.5,0,0,Math.PI*2); c.fill();
  c.save(); c.clip(); c.fillStyle=belly; c.beginPath(); c.ellipse(L*.02,H2*.36,L*.46,H2*.3,0,0,Math.PI*2); c.fill();
  if(o.pat===1){ c.fillStyle='rgba(10,20,25,.28)'; for(let i=-3;i<=3;i++){ c.fillRect(i*L*.11-L*.025,-H2,L*.05,H2*2); } }
  if(o.pat===2){ c.fillStyle = lum(col)>170 ? belly : 'rgba(10,20,25,.3)'; for(let i=0;i<9;i++){ c.beginPath(); c.arc(-L*.3+((i*37)%60)/100*L*.7, -H2*.3+((i*53)%50)/100*H2*.6, Math.max(1,L*.03),0,7); c.fill(); } }
  c.restore();
  c.fillStyle=col; c.globalAlpha=a0*.9; c.beginPath();
  if(o.shark){ c.moveTo(-L*.12,-H2*.42); c.lineTo(-L*.02,-H2*.5-L*.2); c.lineTo(L*.1,-H2*.44); }
  else { c.moveTo(-L*.14,-H2*.44); c.quadraticCurveTo(L*.02,-H2*.5-L*.13,L*.16,-H2*.42); }
  c.closePath(); c.fill(); c.globalAlpha=a0;
  c.fillStyle='#0b1418'; c.beginPath(); c.arc(L*.31,-H2*.08,Math.max(1.4,L*.032),0,7); c.fill(); c.fillStyle='#fff'; c.beginPath(); c.arc(L*.32,-H2*.11,Math.max(.6,L*.012),0,7); c.fill();
  c.restore();
}
function drawCreature(c,sp,x,y,L,o={}){
  let col=sp.col, belly=sp.belly; if(o.shiny){ col=mix(col,'#ffd36a',.45); belly=mix(belly,'#fff6d6',.5); } if(o.sil){ col=belly=o.sil; }
  const wag=o.wag||0, pat=o.sil?0:sp.pat;
  if(sp.shape==='f'||sp.shape==='e'||sp.shape==='s'){ if(!o.sil && MEME_X[sp.id]) memeBehind(c,sp,x,y,L,o); drawFish(c,x,y,L,col,belly,sp.h,wag,o.flip,{shark:sp.shape==='s',pat}); if(!o.sil && MEME_X[sp.id]) memeExtra(c,sp,x,y,L,o); return; }
  c.save(); c.translate(x,y); if(o.flip) c.scale(-1,1); const a0=c.globalAlpha; const eye=(ex,ey,r)=>{ c.fillStyle=o.sil||'#0b1418'; c.beginPath(); c.arc(ex,ey,r,0,7); c.fill(); if(!o.sil){ c.fillStyle='#fff'; c.beginPath(); c.arc(ex+r*.3,ey-r*.3,r*.35,0,7); c.fill(); } };
  if(sp.shape==='p'){ const r=L*.3; c.strokeStyle=col; c.lineWidth=Math.max(1,L*.025); c.beginPath(); for(let i=0;i<14;i++){ const a=i/14*Math.PI*2; c.moveTo(Math.cos(a)*r,Math.sin(a)*r*.9); c.lineTo(Math.cos(a)*r*1.25,Math.sin(a)*r*1.15); } c.stroke();
    c.fillStyle=col; c.beginPath(); c.moveTo(-r*.9,0); c.lineTo(-r*1.5,-r*.5+Math.sin(wag)*2); c.lineTo(-r*1.5,r*.5+Math.sin(wag)*2); c.fill();
    c.beginPath(); c.ellipse(0,0,r,r*.9,0,0,7); c.fill(); c.save(); c.clip(); c.fillStyle=belly; c.beginPath(); c.ellipse(0,r*.55,r,r*.5,0,0,7); c.fill();
    if(pat===2){ c.fillStyle='rgba(10,20,25,.3)'; for(let i=0;i<8;i++){ c.beginPath(); c.arc(-r*.6+((i*37)%100)/100*r*1.2,-r*.6+((i*53)%60)/100*r,Math.max(1,r*.09),0,7); c.fill(); } }
    if(pat===1){ c.fillStyle='rgba(10,20,25,.25)'; for(let i=-2;i<=2;i++) c.fillRect(i*r*.4-r*.07,-r,r*.14,r*2); } c.restore(); eye(r*.45,-r*.2,Math.max(1.5,r*.16)); }
  else if(sp.shape==='q'){ const m=L*.5; c.fillStyle=col; c.beginPath(); c.moveTo(-m*.95,0); c.quadraticCurveTo(-m*.3,-L*.2,m*.25,-L*.12); c.lineTo(m*.25,L*.12); c.quadraticCurveTo(-m*.3,L*.2,-m*.95,0); c.fill();
    c.beginPath(); c.moveTo(-m*.9,0); c.lineTo(-m*1.15,-L*.12); c.lineTo(-m*.6,-L*.06); c.moveTo(-m*.9,0); c.lineTo(-m*1.15,L*.12); c.lineTo(-m*.6,L*.06); c.fill();
    c.strokeStyle=col; c.lineWidth=Math.max(1,L*.035); c.lineCap='round'; for(let i=0;i<5;i++){ const yy=(i-2)*L*.045; c.beginPath(); c.moveTo(m*.2,yy); c.quadraticCurveTo(m*.6,yy+Math.sin(wag+i)*L*.06,m*.95,yy*1.6+Math.sin(wag*1.3+i)*L*.05); c.stroke(); }
    c.fillStyle=belly; c.globalAlpha*=.6; c.beginPath(); c.ellipse(-m*.3,L*.05,m*.45,L*.05,0,0,7); c.fill(); c.globalAlpha=a0; eye(m*.12,-L*.03,Math.max(1.4,L*.045)); }
  else if(sp.shape==='r'){ const wd=L*.42, hd=L*.32; c.strokeStyle=col; c.lineWidth=Math.max(1,L*.02); c.beginPath(); c.moveTo(-wd*.6,0); c.quadraticCurveTo(-L*.6,Math.sin(wag)*4,-L*.75,Math.sin(wag*1.2)*6); c.stroke();
    c.fillStyle=col; c.beginPath(); c.moveTo(wd*.7,0); c.quadraticCurveTo(wd*.2,-hd*1.4+Math.sin(wag)*3,-wd*.6,0); c.quadraticCurveTo(wd*.2,hd*1.4-Math.sin(wag)*3,wd*.7,0); c.fill();
    c.save(); c.clip(); if(pat===2){ c.fillStyle=belly; for(let i=0;i<10;i++){ c.beginPath(); c.arc(-wd*.4+((i*37)%100)/100*wd,-hd+((i*53)%100)/100*hd*2,Math.max(1,L*.025),0,7); c.fill(); } } c.restore();
    eye(wd*.35,-hd*.18,Math.max(1.2,L*.03)); eye(wd*.35,hd*.18,Math.max(1.2,L*.03)); }
  else if(sp.shape==='j'){ const r=L*.3; c.strokeStyle=belly; c.lineWidth=Math.max(1,L*.02); for(let i=0;i<6;i++){ const xx=-r*.8+i*r*.32; c.beginPath(); c.moveTo(xx,0); c.quadraticCurveTo(xx+Math.sin(wag+i)*5,r*.9,xx+Math.sin(wag*1.2+i)*4,r*1.6); c.stroke(); }
    c.fillStyle=col; c.globalAlpha*=.85; c.beginPath(); c.arc(0,0,r,Math.PI,0); c.quadraticCurveTo(0,r*.35,-r,0); c.fill(); c.fillStyle=belly; c.beginPath(); c.arc(0,-r*.1,r*.45,Math.PI,0); c.fill(); c.globalAlpha=a0; }
  else if(sp.shape==='c'){ const r=L*.24; c.strokeStyle=col; c.lineWidth=Math.max(1.2,L*.03); c.lineCap='round';
    for(let i=0;i<3;i++){ for(const sd of [-1,1]){ c.beginPath(); c.moveTo(sd*r*.6,r*.2); c.lineTo(sd*r*(1.2+i*.15),r*(.5+i*.1)); c.lineTo(sd*r*(1.4+i*.2),r*(1+i*.12)+Math.sin(wag+i)*2); c.stroke(); } }
    for(const sd of [-1,1]){ c.beginPath(); c.moveTo(sd*r*.7,-r*.2); c.lineTo(sd*r*1.3,-r*.7); c.stroke(); c.fillStyle=col; c.beginPath(); c.ellipse(sd*r*1.45,-r*.95,r*.42,r*.3,sd*.6,0,7); c.fill(); }
    c.fillStyle=col; c.beginPath(); c.ellipse(0,0,r,r*.62,0,0,7); c.fill(); c.fillStyle=belly; c.globalAlpha*=.5; c.beginPath(); c.ellipse(0,r*.25,r*.8,r*.3,0,0,7); c.fill(); c.globalAlpha=a0;
    c.beginPath(); c.moveTo(-r*.25,-r*.5); c.lineTo(-r*.3,-r*.9); c.moveTo(r*.25,-r*.5); c.lineTo(r*.3,-r*.9); c.stroke(); eye(-r*.3,-r*.95,Math.max(1.2,r*.13)); eye(r*.3,-r*.95,Math.max(1.2,r*.13)); }
  c.restore();
}
function sparkles(c,w,h,n=7){ c.save(); c.fillStyle='#ffe9a8'; for(let i=0;i<n;i++){ const x=w*(.15+((i*37)%70)/100), y=h*(.15+((i*53)%70)/100), s=Math.max(3,w*.02)*(1+(i%3)*.4);
  c.beginPath(); c.moveTo(x,y-s); c.lineTo(x+s*.28,y-s*.28); c.lineTo(x+s,y); c.lineTo(x+s*.28,y+s*.28); c.lineTo(x,y+s); c.lineTo(x-s*.28,y+s*.28); c.lineTo(x-s,y); c.lineTo(x-s*.28,y-s*.28); c.closePath(); c.fill(); } c.restore(); }
function fishCanvas(cnv, sp, known=true, shiny=false){ const c=cnv.getContext('2d'); const w=cnv.width, h=cnv.height; c.clearRect(0,0,w,h); const L=w*.66;
  if(!known){ drawCreature(c,sp,w*.52,h*.52,L,{sil:'#1d3a44'}); return; }
  if(shiny){ const gr=c.createRadialGradient(w/2,h/2,0,w/2,h/2,w*.5); gr.addColorStop(0,'rgba(255,201,77,.35)'); gr.addColorStop(1,'rgba(255,201,77,0)'); c.fillStyle=gr; c.fillRect(0,0,w,h); }
  if(sp.r===5){ const gr=c.createRadialGradient(w/2,h/2,0,w/2,h/2,w*.5); gr.addColorStop(0,'rgba(255,106,213,.4)'); gr.addColorStop(.6,'rgba(106,255,234,.12)'); gr.addColorStop(1,'rgba(0,0,0,0)'); c.fillStyle=gr; c.fillRect(0,0,w,h); }
  drawCreature(c,sp,w*.52,h*.52,L,{shiny}); if(shiny||sp.r===5) sparkles(c,w,h,sp.r===5?10:7); }

// ---------- drawing: junk ----------
function drawJunk(c,w,h,id,sil){ drawJunkAt(c,id,w/2,h/2,Math.min(w,h)/220,sil); }
function drawJunkAt(c,id,x,y,s,sil){
  c.save(); c.translate(x,y); c.scale(s,s); c.lineJoin='round'; c.lineCap='round';
  const F=col=>sil||col; const R=(x,y,w,h,col)=>{ c.fillStyle=F(col); c.fillRect(x,y,w,h); }; const Ci=(x,y,r,col)=>{ c.fillStyle=F(col); c.beginPath(); c.arc(x,y,r,0,7); c.fill(); };
  const E=(x,y,rx,ry,col,rot=0)=>{ c.fillStyle=F(col); c.beginPath(); c.ellipse(x,y,rx,ry,rot,0,7); c.fill(); };
  const P=(pts,col)=>{ c.fillStyle=F(col); c.beginPath(); c.moveTo(pts[0],pts[1]); for(let i=2;i<pts.length;i+=2) c.lineTo(pts[i],pts[i+1]); c.closePath(); c.fill(); };
  const Ln=(pts,col,lw)=>{ c.strokeStyle=F(col); c.lineWidth=lw; c.beginPath(); c.moveTo(pts[0],pts[1]); for(let i=2;i<pts.length;i+=2) c.lineTo(pts[i],pts[i+1]); c.stroke(); };
  const Ring=(x,y,r,col,lw)=>{ c.strokeStyle=F(col); c.lineWidth=lw; c.beginPath(); c.arc(x,y,r,0,7); c.stroke(); };
  switch(id){
    case 'phone': R(-32,-62,64,124,'#222'); R(-25,-50,50,92,'#5aa9ff'); R(-18,-40,16,16,'#ff6a3d'); R(2,-40,16,16,'#7fc8a9'); R(-18,-18,16,16,'#ffc94d'); Ci(0,52,5,'#444'); break;
    case 'magazine': c.rotate(-.12); R(-60,-78,120,156,'#e05a6a'); R(-50,-68,100,22,'#fff'); R(-44,-30,88,70,'#f6c9a0'); E(-20,60,26,12,'#a8404e'); E(30,-20,18,10,'#c04a5a'); break;
    case 'tire': Ring(0,0,52,'#1e1e1e',34); Ring(0,0,52,'#333',2); for(let i=0;i<16;i++){ const a=i/16*Math.PI*2; Ln([Math.cos(a)*38,Math.sin(a)*38,Math.cos(a)*68,Math.sin(a)*68],'#2c2c2c',4); } break;
    case 'toilet': E(0,10,74,52,'#f2f2f0'); E(0,14,46,30,'#d8dde0'); R(-60,-62,120,26,'#e8e8e6'); break;
    case 'toaster': R(-70,-30,140,90,'#c8ced4'); R(-70,-30,140,10,'#e8eef2'); R(-44,-58,24,34,'#d8a060'); R(18,-50,24,26,'#d8a060'); R(-50,-30,30,6,'#333'); R(14,-30,30,6,'#333'); R(74,0,12,20,'#333'); break;
    case 'bottle': c.rotate(-.4); c.globalAlpha=.85; E(0,0,70,34,'#4f8f6a'); R(60,-12,40,24,'#4f8f6a'); c.globalAlpha=1; R(98,-10,14,20,'#b58b5a'); R(-36,-12,64,22,'#efe3c6'); break;
    case 'boot': P([-50,-70,10,-70,14,10,70,30,74,60,-56,60],'#6b4a2e'); R(-58,52,134,12,'#3a2818'); Ci(-20,-72,12,'#5aa04a'); Ci(4,-72,12,'#5aa04a'); Ci(-20,-74,5,'#111'); Ci(4,-74,5,'#111'); break;
    case 'dentures': E(0,-14,70,30,'#e88a9a'); E(0,18,64,26,'#e88a9a'); for(let i=-4;i<=4;i++){ R(i*14-6,-16,12,16,'#fffdf4'); R(i*13-5,4,11,14,'#fffdf4'); } break;
    case 'banana': c.strokeStyle=F('#f4d03a'); c.lineWidth=34; c.beginPath(); c.arc(0,-60,90,Math.PI*.25,Math.PI*.75); c.stroke(); Ci(-62,4,8,'#6b4a2e'); R(-14,22,10,10,'#333'); R(6,22,10,10,'#333'); R(-4,34,10,10,'#333'); break;
    case 'bicycle': Ring(-55,25,38,'#333',6); Ring(55,25,38,'#333',6); Ln([-55,25,-10,-25,40,-25,55,25],'#c8553a',7); Ln([-10,-25,0,25,-55,25],'#c8553a',7); Ln([0,25,40,-25],'#c8553a',7); Ln([40,-25,45,-45,60,-45],'#333',5); R(-22,-34,26,8,'#222'); break;
    case 'tv': R(-80,-55,160,115,'#6b4a2e'); R(-66,-44,100,88,'#7a9aa8'); Ci(56,-20,8,'#c8a060'); Ci(56,8,8,'#c8a060'); Ln([-10,-55,-40,-90],'#888',3); Ln([10,-55,40,-90],'#888',3); E(-30,-20,20,10,'#a8c8d8'); break;
    case 'duck': E(-6,20,62,40,'#ffd23a'); Ci(36,-26,30,'#ffd23a'); P([62,-28,92,-22,62,-14],'#ff8a2a'); Ci(44,-34,5,'#111'); E(-14,14,30,16,'#f0b820',-.3); break;
    case 'gnome': P([-30,-20,30,-20,0,-90],'#d8473a'); Ci(0,-12,20,'#f6d0b0'); P([-28,-6,28,-6,0,50],'#f4f4f4'); R(-36,40,72,40,'#3a6fca'); Ci(8,-16,3,'#111'); Ci(0,-4,6,'#e8a088'); break;
    case 'bowling': Ci(0,0,70,'#2a3a8a'); Ci(-14,-26,9,'#111'); Ci(12,-30,9,'#111'); Ci(-2,-4,9,'#111'); E(-30,-36,18,8,'#5a6aca',-.5); break;
    case 'sax': c.strokeStyle=F('#d8a84a'); c.lineWidth=20; c.beginPath(); c.moveTo(-10,-80); c.lineTo(-10,30); c.quadraticCurveTo(-10,70,30,60); c.quadraticCurveTo(60,50,56,10); c.stroke(); E(56,0,24,12,'#d8a84a'); for(let i=0;i<5;i++) Ci(4,-50+i*20,4,'#8a6a2a'); Ln([-10,-80,10,-96],'#333',6); break;
    case 'hotsauce': R(-30,-30,60,100,'#d8303a'); R(-14,-60,28,32,'#d8303a'); R(-16,-82,32,24,'#3a8a3a'); R(-26,-6,52,40,'#f4e8d0'); P([0,22,-12,8,-4,-2,0,6,4,-4,12,8],'#ff8a2a'); break;
    case 'energy': R(-34,-70,68,140,'#2ad06a'); E(0,-70,34,6,'#bbb'); E(0,70,34,6,'#999'); P([6,-44,-16,4,0,4,-8,44,16,-6,0,-6],'#111'); break;
    case 'fortune': c.fillStyle=F('#e0b060'); c.beginPath(); c.moveTo(-70,10); c.quadraticCurveTo(0,-90,70,10); c.quadraticCurveTo(0,-20,-70,10); c.fill(); R(-10,-6,90,18,'#fffdf4'); R(0,0,60,3,'#c8553a'); break;
    case 'lottery': c.rotate(-.08); R(-80,-45,160,90,'#f4ecc8'); R(-80,-45,160,18,'#c8553a'); for(let i=0;i<6;i++) Ci(-60+i*24,12,9,i%2?'#5aa9ff':'#ffc94d'); R(-60,32,120,4,'#aaa'); break;
    case 'laptop': P([-80,30,80,30,95,52,-95,52],'#9aa2aa'); R(-70,-60,140,90,'#4a5258'); R(-62,-52,124,74,'#2a6a9a'); E(20,-20,22,14,'#5aa9ff'); break;
    case 'sink': P([-80,-20,80,-20,62,40,-62,40],'#c8d0d8'); E(0,-20,80,14,'#e0e6ea'); E(0,-18,60,9,'#8a949c'); Ln([40,-26,40,-66,10,-66,10,-50],'#a8b0b8',10); break;
    case 'cheese': P([-80,40,80,40,80,-10,-80,30],'#f8d84a'); P([-80,30,80,-10,60,-40],'#ffe680'); Ci(-30,26,8,'#d8b830'); Ci(20,18,10,'#d8b830'); Ci(50,28,6,'#d8b830'); break;
    case 'cart': c.strokeStyle=F('#aab'); c.lineWidth=4; for(let i=0;i<7;i++){ c.beginPath(); c.moveTo(-70+i*20,-40); c.lineTo(-60+i*17,30); c.stroke(); } Ln([-80,-40,70,-40,58,30,-62,30,-80,-40],'#aab',5); Ln([70,-40,90,-60],'#aab',5); Ci(-50,50,10,'#333'); Ci(40,50,10,'#333'); Ln([-62,30,-56,40,48,40],'#aab',5); break;
    case 'mannequin': R(-6,40,12,40,'#8a7a6a'); R(-30,76,60,8,'#6a5a4a'); E(0,-10,40,52,'#e8d0b0'); E(0,44,24,10,'#d8c0a0'); break;
    case 'chest': R(-80,-20,160,80,'#6b4423'); c.fillStyle=F('#875a30'); c.beginPath(); c.moveTo(-80,-20); c.quadraticCurveTo(0,-90,80,-20); c.closePath(); c.fill(); R(-84,-24,168,8,'#ffc94d'); R(-12,-30,24,34,'#ffc94d'); R(-4,-14,8,10,'#3a2410'); break;
    case 'skateboard': c.rotate(-.15); E(0,0,96,16,'#c8553a'); R(-70,-4,140,6,'#ffc94d'); Ci(-56,22,10,'#f4f4f4'); Ci(56,22,10,'#f4f4f4'); break;
    case 'washer': R(-60,-74,120,148,'#eef2f4'); R(-60,-74,120,24,'#d0d8dc'); Ci(0,14,42,'#9aa4aa'); Ci(0,14,32,'#5a8aaa'); E(-10,4,12,8,'#8ac0e0'); Ci(36,-62,5,'#5a5a5a'); break;
    case 'grenade': E(0,10,46,60,'#4a6a3a'); for(let i=-2;i<=2;i++) R(-46,i*20,92,3,'#3a5a2a'); R(-14,-60,28,16,'#888'); Ln([10,-56,46,-40,48,10],'#999',7); Ring(-22,-62,12,'#bbb',4); break;
    case 'safe': R(-70,-70,140,140,'#5a6068'); R(-58,-58,116,116,'#6a7078'); Ci(0,0,30,'#c8c8c8'); Ci(0,0,6,'#333'); R(40,-10,14,20,'#888'); for(let i=0;i<8;i++){ const a=i/8*Math.PI*2; Ln([Math.cos(a)*20,Math.sin(a)*20,Math.cos(a)*28,Math.sin(a)*28],'#333',2); } break;
    case 'chain': for(let i=0;i<9;i++){ const a=Math.PI*.1+i/8*Math.PI*.8; c.strokeStyle=F('#ffc94d'); c.lineWidth=7; c.beginPath(); c.ellipse(Math.cos(a)*70,Math.sin(a)*50-30,12,8,a,0,7); c.stroke(); } Ci(0,28,16,'#ffc94d'); break;
    case 'dadtrophy': R(-40,50,80,20,'#6b4423'); R(-10,20,20,30,'#ffc94d'); c.fillStyle=F('#ffc94d'); c.beginPath(); c.moveTo(-50,-60); c.lineTo(50,-60); c.quadraticCurveTo(50,30,0,26); c.quadraticCurveTo(-50,30,-50,-60); c.fill(); Ring(-56,-30,18,'#ffc94d',7); Ring(56,-30,18,'#ffc94d',7);
      if(!sil){ c.fillStyle='#6b4423'; c.font='800 20px system-ui'; c.textAlign='center'; c.fillText('#1 DAD',0,-20); } break;
    case 'map': c.rotate(.06); R(-85,-60,170,120,'#e8d4a0'); c.setLineDash([8,8]); Ln([-60,30,-20,0,10,20,50,-20],'#8a5a2a',4); c.setLineDash([]); Ln([40,-30,60,-10],'#d8303a',7); Ln([60,-30,40,-10],'#d8303a',7); E(-50,-30,18,10,'#9ac08a'); break;
    case 'lavalamp': P([-20,-80,20,-80,40,40,-40,40],'#9a3ad8'); E(0,-30,14,20,'#ff8a3a'); E(10,10,16,14,'#ff8a3a'); E(-8,-58,8,10,'#ff8a3a'); P([-40,40,40,40,30,80,-30,80],'#aab'); P([-20,-80,20,-80,12,-96,-12,-96],'#aab'); break;
    case 'discoball': Ci(0,0,66,'#b8c0c8'); c.save(); c.beginPath(); c.arc(0,0,66,0,7); c.clip(); for(let i=-70;i<70;i+=14) for(let j=-70;j<70;j+=14) R(i+1,j+1,12,12,((i+j)/14)%3===0?'#e8f0ff':((i*j)%5===0?'#8a96a0':'#cdd6de')); c.restore(); Ln([0,-66,0,-96],'#888',3); if(!sil) sparkles(c,180,180,4); break;
    case 'fridge': R(-50,-90,100,180,'#eef2f4'); R(-50,-28,100,4,'#c8d0d4'); R(30,-76,6,36,'#aab'); R(30,-12,6,50,'#aab'); R(-34,-76,40,26,'#2a3a4a'); R(-30,-72,14,8,'#5aa9ff'); break;
    case 'snowglobe': R(-50,40,100,30,'#6b4423'); c.globalAlpha=.6; Ci(0,-10,58,'#cfe8f8'); c.globalAlpha=1; E(0,30,46,10,'#fff'); R(-6,4,12,26,'#3a6f9a'); Ci(0,-4,7,'#f6d0b0'); for(let i=0;i<10;i++) Ci(-40+((i*37)%80),-50+((i*53)%60),3,'#fff'); break;
    case 'doll': P([-40,70,40,70,20,0,-20,0],'#a83a5a'); Ci(0,-30,32,'#f0e0d0'); E(0,-58,34,14,'#4a2a1a'); Ln([-18,-38,-6,-26],'#111',4); Ln([-6,-38,-18,-26],'#111',4); Ln([6,-38,18,-26],'#111',4); Ln([18,-38,6,-26],'#111',4); Ln([-10,-12,10,-12],'#a83a5a',3); break;
    case 'coin': Ci(0,0,66,'#d8a83a'); Ci(0,0,56,'#ffc94d'); E(6,-4,22,30,'#d8a83a'); Ci(-8,-22,10,'#d8a83a'); for(let i=0;i<20;i++){ const a=i/20*Math.PI*2; Ci(Math.cos(a)*61,Math.sin(a)*61,2.5,'#b8862a'); } break;
    case 'magnet': c.strokeStyle=F('#d8303a'); c.lineWidth=36; c.beginPath(); c.arc(0,-10,44,Math.PI,0,true); c.stroke(); R(-62,-12,36,40,'#d8303a'); R(26,-12,36,40,'#d8303a'); R(-62,26,36,24,'#d0d8e0'); R(26,26,36,24,'#d0d8e0'); break;
    case 'carrier': R(-80,-50,160,110,'#8a96a0'); E(0,-50,80,14,'#9aa6b0'); R(40,-30,30,70,'#5a646c'); for(let i=0;i<4;i++) Ln([44+i*7,-28,44+i*7,38],'#333',3); Ci(50,0,4,'#7fff7a'); Ci(62,0,4,'#7fff7a'); R(-30,-74,60,10,'#5a646c'); break;
    case 'birdcage': c.strokeStyle=F('#c8a050'); c.lineWidth=4; for(let i=-4;i<=4;i++){ c.beginPath(); c.moveTo(i*16,70); c.quadraticCurveTo(i*14,-70,0,-80); c.stroke(); } R(-74,66,148,10,'#c8a050'); Ring(0,-86,8,'#c8a050',4); E(0,20,16,26,'#e03a3a'); Ci(4,-10,12,'#e03a3a'); P([14,-12,26,-6,14,-2],'#ffc94d'); E(-10,26,10,18,'#3a7ae0',.3); break;
    case 'egg': E(0,6,52,68,'#f0e8d0'); for(let i=0;i<12;i++) Ci(-34+((i*37)%70),-40+((i*53)%90),5,'#8a7a5a'); Ln([-40,-10,-20,-24,0,-10,20,-26,44,-8],'#5a4a3a',4); break;
    case 'cone': P([-24,-80,24,-80,60,60,-60,60],'#ff7a1a'); P([-38,-20,38,-20,46,10,-46,10],'#f4f4f4'); R(-80,60,160,20,'#e06a10'); E(0,-80,24,6,'#ff9a4a'); break;
    case 'ring': Ring(0,24,48,'#ffc94d',14); P([0,-74,30,-44,0,-20,-30,-44],'#cfefff'); P([0,-74,30,-44,0,-44],'#eaffff'); if(!sil) sparkles(c,120,120,3); break;
    case 'astro': Ci(0,0,74,'#e8ecf0'); E(14,-4,48,42,'#1a2a3a'); E(-2,-18,16,10,'#5a7aa0',-.4); R(-74,40,148,30,'#d0d6dc'); Ci(-50,-30,6,'#d8303a'); break;
    case 'crown': P([-70,40,-80,-40,-40,0,0,-60,40,0,80,-40,70,40],'#ffcc33'); R(-70,30,140,20,'#e8b020'); Ci(0,40,8,'#d8303a'); Ci(-40,40,6,'#3a7ae0'); Ci(40,40,6,'#3a7ae0'); Ci(0,-60,7,'#ffcc33'); break;
    case 'goldtoilet': E(0,10,74,52,'#ffcc33'); E(0,14,46,30,'#e8b020'); R(-60,-62,120,26,'#ffd84a'); if(!sil) sparkles(c,160,160,4); break;
    case 'goldlure': E(0,0,60,22,'#ffcc33'); P([-56,0,-86,-20,-86,20],'#ffcc33'); Ci(40,-4,6,'#111'); Ln([10,22,10,46,22,40],'#bbb',4); Ln([-30,22,-30,46,-18,40],'#bbb',4); R(56,-3,20,6,'#bbb'); break;
    case 'pearl': E(0,30,95,34,'#d9c3a5'); { const gr=c.createRadialGradient(-12,-10,4,0,0,48); gr.addColorStop(0,'#ffffff'); gr.addColorStop(1,'#bcd7e6'); c.fillStyle=sil||gr; c.beginPath(); c.arc(0,0,46,0,7); c.fill(); } break;
    case 'saddle': c.fillStyle=F('#7a3a1a'); c.beginPath(); c.moveTo(-80,-10); c.quadraticCurveTo(-40,-60,0,-20); c.quadraticCurveTo(40,-60,80,-10); c.quadraticCurveTo(60,40,0,30); c.quadraticCurveTo(-60,40,-80,-10); c.fill(); R(-6,20,12,50,'#5a2a10'); Ring(0,74,10,'#bbb',4); Ci(50,-30,8,'#ffc94d'); break;
    case 'trident': Ln([0,90,0,-40],'#8a6a4a',10); Ln([-36,-80,-36,-40,36,-40,36,-80],'#a87a4a',9); Ln([0,-40,0,-94],'#a87a4a',9); P([-36,-94,-44,-74,-28,-74],'#a87a4a'); P([36,-94,28,-74,44,-74],'#a87a4a'); P([0,-108,-8,-88,8,-88],'#a87a4a'); break;
    case 'piano': R(-90,-70,180,130,'#3a2010'); R(-84,-10,168,30,'#f4f4f0'); for(let i=0;i<14;i++){ if(i%7!==2&&i%7!==6) R(-80+i*12,-10,7,18,'#111'); } R(-90,60,16,20,'#3a2010'); R(74,60,16,20,'#3a2010'); R(-70,-60,140,36,'#4a2a18'); break;
    default: Ci(0,0,60,'#888');
  }
  c.restore();
}

// ---------- drawing: hats, outfits, angler, pets ----------
function drawHat(c,id,col,t=0){
  const dk=mix(col,'#000000',.3), lt=mix(col,'#ffffff',.35); const f=(cl)=>{ c.fillStyle=cl; }; const el=(x,y,rx,ry,cl,r=0)=>{ f(cl); c.beginPath(); c.ellipse(x,y,rx,ry,r,0,7); c.fill(); };
  const ci=(x,y,r,cl)=>{ f(cl); c.beginPath(); c.arc(x,y,r,0,7); c.fill(); }; const poly=(pts,cl)=>{ f(cl); c.beginPath(); c.moveTo(pts[0],pts[1]); for(let i=2;i<pts.length;i+=2) c.lineTo(pts[i],pts[i+1]); c.closePath(); c.fill(); };
  const dome=(r,y,cl)=>{ f(cl); c.beginPath(); c.arc(0,y,r,Math.PI,0); c.closePath(); c.fill(); };
  switch(id){
    case 'none': break;
    case 'cap': dome(8,-1,col); f(lt); c.beginPath(); c.arc(0,-1,8,Math.PI*1.5,0); c.lineTo(0,-1); c.fill(); f(dk); c.fillRect(5,-2.2,8.5,2.4); ci(0,-9,1.2,dk); break;
    case 'bucket': poly([-8,-2,-6,-10,6,-10,8,-2],col); el(0,-2,11.5,2.6,dk); break;
    case 'beanie': dome(8.3,-2,col); f(dk); c.fillRect(-8.6,-4,17.2,3.6); ci(0,-11.5,2.7,lt); break;
    case 'party': poly([-6,-5,6,-5,1,-21],col); f(lt); c.fillRect(-4,-10,8,1.5); c.fillRect(-2.5,-15,5,1.4); ci(1,-21.5,2,'#ffffff'); break;
    case 'straw': el(0,-4,14.5,3,'#e2c27a'); f('#e8cc88'); c.fillRect(-6,-11,12,7.5); f(col); c.fillRect(-6,-6,12,2); break;
    case 'sailor': f('#f4f4f2'); c.beginPath(); c.moveTo(-8.5,-3); c.lineTo(-7.5,-9); c.quadraticCurveTo(0,-11.5,7.5,-9); c.lineTo(8.5,-3); c.fill(); f(col); c.fillRect(-8.6,-5.5,17.2,2.6); break;
    case 'beret': el(-1,-7,9.6,4,col,-.15); f(dk); c.fillRect(-.7,-12.5,1.4,2.5); break;
    case 'hardhat': dome(8.6,-3,col); f(col); c.fillRect(-10,-3.6,21,2.2); f(lt); c.fillRect(-1,-11.5,2,8); break;
    case 'cowboy': f(dk); c.beginPath(); c.moveTo(-15,-4); c.quadraticCurveTo(0,-1,15,-5.5); c.lineTo(14,-7); c.quadraticCurveTo(0,-4,-14,-6); c.closePath(); c.fill();
      f(col); c.beginPath(); c.moveTo(-7,-5); c.lineTo(-6,-14); c.quadraticCurveTo(0,-10.5,6,-14); c.lineTo(7,-5); c.closePath(); c.fill(); f(dk); c.fillRect(-7,-7.5,14,2); break;
    case 'bowler': f(col); c.beginPath(); c.arc(0,-6,7,Math.PI,0); c.fill(); c.fillRect(-7,-6,14,2); el(0,-4,10.5,2,col); f(lt); c.fillRect(-7,-7,14,1.5); break;
    case 'ushanka': f(col); c.fillRect(-9,-13,18,10); c.fillRect(-10,-6,4.5,10); c.fillRect(5.5,-6,4.5,10); f(lt); c.fillRect(-9.5,-6.5,19,3); el(0,-13,9,2.5,lt); break;
    case 'sombrero': el(0,-4,22,4,col); f(lt); c.beginPath(); c.moveTo(-7,-5); c.quadraticCurveTo(-6,-17,0,-17); c.quadraticCurveTo(6,-17,7,-5); c.fill(); c.strokeStyle=dk; c.lineWidth=1.3; c.beginPath(); for(let i=0;i<7;i++){ c.lineTo(-6+i*2,i%2?-8:-6); } c.stroke(); break;
    case 'tophat': el(0,-5,11,2,col); f(col); c.fillRect(-6.5,-22,13,17); f('#8a2a2a'); c.fillRect(-6.5,-9.5,13,2.5); break;
    case 'captain': f('#111'); c.fillRect(3,-3.2,9,2.2); f('#f4f4f4'); c.fillRect(-7,-9,14,6); el(0,-9,10,3.5,'#f4f4f4'); f(col); c.fillRect(-7,-4.6,14,2.2); ci(4,-6.5,1.7,'#ffc94d'); break;
    case 'propeller': dome(8,-1,col); f(lt); c.beginPath(); c.arc(0,-1,8,Math.PI*1.33,Math.PI*1.66); c.lineTo(0,-1); c.fill(); f(dk); c.fillRect(5,-2.2,8,2.2); f('#555'); c.fillRect(-.6,-14,1.2,6);
      c.save(); c.translate(0,-14); c.scale(Math.cos(t*14),1); el(-4.5,0,4.5,1.5,'#ff5a5a'); el(4.5,0,4.5,1.5,'#5aa9ff'); c.restore(); break;
    case 'pirate': f(col); c.beginPath(); c.moveTo(-13,-3); c.quadraticCurveTo(-9,-15,0,-13); c.quadraticCurveTo(9,-15,13,-3); c.quadraticCurveTo(0,-8,-13,-3); c.fill(); c.strokeStyle='#ffc94d'; c.lineWidth=1; c.stroke(); ci(0,-9,2,'#f4f4f4'); break;
    case 'viking': dome(8.4,-2,col); f('#7a5a3a'); c.fillRect(-8.6,-3.6,17.2,2.6); f('#f0e8d0');
      for(const sd of [-1,1]){ c.beginPath(); c.moveTo(sd*6,-6); c.quadraticCurveTo(sd*13.5,-7,sd*12,-16); c.quadraticCurveTo(sd*10,-9,sd*5,-8.5); c.fill(); } break;
    case 'wizard': el(0,-4,12,2.5,col); f(col); c.beginPath(); c.moveTo(-7,-5); c.lineTo(7,-5); c.quadraticCurveTo(3,-14,-6,-23); c.quadraticCurveTo(-3,-14,-7,-5); c.fill(); ci(1,-10,1.2,'#ffe066'); ci(-2,-15,.9,'#ffe066'); ci(3,-7,.8,'#ffe066'); break;
    case 'chef': f('#ffffff'); c.fillRect(-7,-10,14,7); ci(-5,-12,4,'#ffffff'); ci(0,-14.5,5,'#ffffff'); ci(5,-12,4,'#ffffff'); f('#e4e8ec'); c.fillRect(-7,-5,14,2); break;
    case 'fez': poly([-6,-3,-5,-12,5,-12,6,-3],col); c.strokeStyle='#111'; c.lineWidth=1; c.beginPath(); c.moveTo(0,-12); c.lineTo(-6,-7); c.stroke(); ci(-6,-6.5,1.3,'#111'); break;
    case 'diver': ci(0,0.5,12.5,'#c8963a'); c.globalAlpha*=.6; ci(2,-.5,7.5,'#9ad0e8'); c.globalAlpha/=.6; c.strokeStyle='#8a6420'; c.lineWidth=1.5; c.beginPath(); c.arc(2,-.5,7.5,0,7); c.stroke(); ci(-9,-5,1.3,'#5a4010'); ci(-9,5,1.3,'#5a4010'); ci(10,8,1.3,'#5a4010'); break;
    case 'fishhat': drawFish(c,0,-11.5,20,col,lt,.42,t*6,false,{}); break;
    case 'antlers': c.strokeStyle='#8a6a3a'; c.lineWidth=1.8; c.lineCap='round'; for(const sd of [-1,1]){ c.beginPath(); c.moveTo(sd*3,-6); c.lineTo(sd*7,-18); c.moveTo(sd*5,-12); c.lineTo(sd*10,-14); c.moveTo(sd*6,-15.5); c.lineTo(sd*3.5,-20); c.stroke(); } break;
    case 'jester': f(col); c.beginPath(); c.moveTo(-8,-2); c.quadraticCurveTo(-10,-14,-16,-10); c.quadraticCurveTo(-8,-10,0,-5); c.closePath(); c.fill(); f(lt); c.beginPath(); c.moveTo(8,-2); c.quadraticCurveTo(10,-14,16,-10); c.quadraticCurveTo(8,-10,0,-5); c.closePath(); c.fill(); ci(-16,-10,1.8,'#ffc94d'); ci(16,-10,1.8,'#ffc94d'); f(dk); c.fillRect(-8.5,-4,17,2.5); break;
    case 'grad': f(col); c.fillRect(-6,-8,12,5); poly([-11,-9,3,-12.5,11,-8.5,-3,-5.5],col); c.strokeStyle='#ffc94d'; c.lineWidth=1.2; c.beginPath(); c.moveTo(0,-9); c.lineTo(-8,-3); c.stroke(); ci(-8,-2.5,1.3,'#ffc94d'); break;
    case 'flower': for(let i=0;i<7;i++){ const a=Math.PI+i/6*Math.PI; const x=Math.cos(a)*8, y=-1+Math.sin(a)*8; ci(x+1,y+1,1.6,'#4f8a4a'); ci(x,y,2.1,['#ff7ab0','#ffd84a','#ffffff','#9ad0ff'][i%4]); ci(x,y,.8,'#ffb000'); } break;
    case 'santa': f(col); c.beginPath(); c.moveTo(-8,-3); c.quadraticCurveTo(-4,-16,6,-15); c.quadraticCurveTo(12,-14,13,-7); c.lineTo(9,-9); c.quadraticCurveTo(4,-11,8,-3); c.closePath(); c.fill(); f('#ffffff'); c.fillRect(-9,-4.5,18,3); ci(13,-7,2.4,'#ffffff'); break;
    case 'halo': c.strokeStyle='#ffe066'; c.lineWidth=1.8; c.shadowColor='#ffe066'; c.shadowBlur=6; c.beginPath(); c.ellipse(0,-14+Math.sin(t*2),8,2.2,0,0,7); c.stroke(); c.shadowBlur=0; break;
    case 'froghat': dome(8.6,-2,'#5aa04a'); ci(-4,-10,2.8,'#5aa04a'); ci(4,-10,2.8,'#5aa04a'); ci(-4,-10.5,1.8,'#ffffff'); ci(4,-10.5,1.8,'#ffffff'); ci(-3.5,-10.5,.9,'#111'); ci(4.5,-10.5,.9,'#111'); break;
    case 'mohawk': f(col); c.beginPath(); for(let i=0;i<6;i++){ const x=-6+i*2.4; c.moveTo(x-1.4,-6.5); c.lineTo(x+.4,-15-((i*7)%4)); c.lineTo(x+1.4,-6.5); } c.fill(); break;
    case 'cone': poly([-7,-3,7,-3,0,-21],'#ff7a1a'); f('#ffffff'); c.fillRect(-4,-11,8,2.5); f('#e06a10'); c.fillRect(-9,-4,18,2.5); break;
    case 'astro': ci(0,0,12.5,'#e8ecf0'); el(3,-1,7.5,6.5,'#1a2a3a'); el(1,-4,2.5,1.5,'#6a8ab0',-.5); ci(-9,4,1.3,'#d8303a'); break;
    case 'crown': poly([-7,-4,-8,-13,-4,-8,0,-15,4,-8,8,-13,7,-4],'#ffcc33'); ci(0,-6,1.3,'#d8303a'); ci(-4,-6,1,'#3a7ae0'); ci(4,-6,1,'#3a7ae0'); break;
    default: drawHatX(c,id,col,t,{dk,lt,el,ci,poly,dome});
  }
}
function drawPattern(c,pat,base,x,y,w,h){
  switch(pat){
    case 'stripes': c.fillStyle='rgba(255,255,255,.75)'; for(let yy=y+2;yy<y+h;yy+=4.5) c.fillRect(x,yy,w,1.6); break;
    case 'flannel': c.fillStyle='rgba(0,0,0,.28)'; for(let xx=x;xx<x+w;xx+=5) c.fillRect(xx,y,2,h); for(let yy=y;yy<y+h;yy+=5) c.fillRect(x,yy,w,2); c.fillStyle='rgba(255,255,255,.18)'; for(let xx=x+3;xx<x+w;xx+=10) c.fillRect(xx,y,1,h); break;
    case 'polka': c.fillStyle='rgba(255,255,255,.85)'; for(let yy=y+2;yy<y+h;yy+=5) for(let xx=x+((yy/5|0)%2?2:4.5);xx<x+w;xx+=5){ c.beginPath(); c.arc(xx,yy,1.1,0,7); c.fill(); } break;
    case 'camo': [['#4a5a2a',3,4],['#7a6a3a',12,10],['#2a3a1a',6,18],['#5a6a3a',14,22],['#3a2a1a',2,12]].forEach(([cl,dx,dy])=>{ c.fillStyle=cl; c.beginPath(); c.ellipse(x+dx,y+dy,4,2.6,dx,0,7); c.fill(); }); break;
    case 'hawaii': for(let i=0;i<7;i++){ const xx=x+((i*37)%100)/100*w, yy=y+((i*53)%100)/100*h; c.fillStyle='#3a8a4a'; c.beginPath(); c.ellipse(xx+2,yy+1,2.4,1,.6,0,7); c.fill(); c.fillStyle=['#ff6a8a','#ffd84a','#ffffff'][i%3]; c.beginPath(); c.arc(xx,yy,1.6,0,7); c.fill(); } break;
    case 'fishprint': for(let i=0;i<6;i++){ const xx=x+2+((i*41)%90)/100*w, yy=y+3+((i*57)%85)/100*h; drawFish(c,xx,yy,6,'rgba(255,255,255,.8)','rgba(255,255,255,.8)',.4,0,i%2===1,{}); } break;
    case 'flames': c.fillStyle='#ff7a1a'; c.beginPath(); c.moveTo(x,y+h); for(let i=0;i<=6;i++){ const xx=x+i*w/6; c.lineTo(xx-1.5,y+h-9-((i*5)%5)); c.lineTo(xx+1.5,y+h-3); } c.lineTo(x+w,y+h); c.fill(); c.fillStyle='#ffd84a'; c.beginPath(); c.moveTo(x,y+h); for(let i=0;i<=6;i++){ const xx=x+i*w/6; c.lineTo(xx,y+h-5-((i*3)%3)); c.lineTo(xx+1.5,y+h-1); } c.lineTo(x+w,y+h); c.fill(); break;
    case 'tux': c.fillStyle='#f4f4f2'; c.beginPath(); c.moveTo(x+w/2-3.5,y); c.lineTo(x+w/2+3.5,y); c.lineTo(x+w/2+1.5,y+h); c.lineTo(x+w/2-1.5,y+h); c.fill(); c.fillStyle='#c8303a'; c.beginPath(); c.moveTo(x+w/2-3,y+1); c.lineTo(x+w/2+3,y+3.5); c.lineTo(x+w/2+3,y+1); c.lineTo(x+w/2-3,y+3.5); c.fill(); break;
  }
}
function drawAngler(c,x,y,s,lk,o={}){
  const night=o.night||0, D=cl=>night?mix(cl,'#0a1018',night*.45):cl; const sk=D(SKINS[lk.skin]||SKINS[1]), hair=D(HAIRS[lk.hair]||HAIRS[1]), shirt=D(lk.shirt);
  c.save(); c.translate(x,y); c.scale(s,s); c.lineCap='round';
  const hs = !lk.hairStyle||lk.hairStyle==='auto' ? (lk.g==='f'?'long':'short') : lk.hairStyle;
  if(hs==='long'){ c.fillStyle=hair; c.beginPath(); c.moveTo(-7.5,-60); c.quadraticCurveTo(-12,-48,-9,-41); c.lineTo(-2,-43); c.lineTo(-2,-58); c.fill(); }
  c.fillStyle=D('#2b2019'); c.fillRect(-8,-4,7,4); c.fillRect(1,-4,8.5,4);
  c.fillStyle=D(lk.pants); c.fillRect(-7,-22,6,18); c.fillRect(1,-22,6,18); c.fillRect(-7,-25,14,5);
  c.fillStyle=shirt; c.beginPath(); if(lk.g==='f'){ c.moveTo(-7,-46); c.lineTo(7,-46); c.lineTo(5,-35); c.lineTo(8,-23); c.lineTo(-8,-23); c.lineTo(-5,-35); } else { c.moveTo(-8,-46); c.lineTo(8,-46); c.lineTo(7.5,-23); c.lineTo(-7.5,-23); } c.closePath(); c.fill();
  c.save(); c.clip(); drawPattern(c,lk.pat,shirt,-9,-47,18,25); c.restore(); drawOutfit(c,lk,D);
  c.fillStyle=D('#3a2a1a'); c.fillRect(-7.5,-25,15,2.2); c.fillStyle=D('#c8a050'); c.fillRect(-1.5,-25,3,2.2);
  c.fillStyle=sk; c.fillRect(-2,-50,4,5); c.beginPath(); c.arc(0,-56,7.5,0,7); c.fill();
  drawHair(c,hs,hair);
  c.fillStyle=D(mix(SKINS[lk.skin]||SKINS[1],'#000000',.18)); c.beginPath(); c.arc(-2,-55,1.7,0,7); c.fill();
  c.fillStyle=D('#1a1410'); c.beginPath(); c.arc(4.2,-57,1.15,0,7); c.fill(); if(lk.g==='f'){ c.strokeStyle=D('#1a1410'); c.lineWidth=.7; c.beginPath(); c.moveTo(4.5,-58.2); c.lineTo(5.6,-59.4); c.stroke(); }
  c.fillStyle=sk; c.beginPath(); c.arc(7.4,-55,1.4,0,7); c.fill(); c.strokeStyle=D('#8a3a2a'); c.lineWidth=.8; c.beginPath(); c.moveTo(4,-52.4); c.lineTo(6.2,-52.8); c.stroke();
  drawFace(c,lk,D,hair);
  const hx=o.hx==null?9:o.hx, hy=o.hy==null?-35:o.hy; c.strokeStyle=sleeveCol(lk,D)||shirt; c.lineWidth=4.6; c.beginPath(); c.moveTo(2,-43); c.quadraticCurveTo(hx-3,-44,hx,hy); c.stroke();
  c.fillStyle=sk; c.beginPath(); c.arc(hx,hy,2.4,0,7); c.fill();
  c.save(); c.translate(0,-56); drawHat(c,lk.hat,D(lk.hatCol),o.t||0); c.restore();
  c.restore();
}
function drawPet(c,id,x,y,s,t,night=0,lk=null){
  const D=cl=>night?mix(cl,'#0a1018',night*.4):cl; c.save(); c.translate(x,y); c.scale(s,s); c.lineCap='round';
  const el=(x,y,rx,ry,cl,r=0)=>{ c.fillStyle=D(cl); c.beginPath(); c.ellipse(x,y,rx,ry,r,0,7); c.fill(); }; const ci=(x,y,r,cl)=>{ c.fillStyle=D(cl); c.beginPath(); c.arc(x,y,r,0,7); c.fill(); };
  const rc=(x,y,w,h,cl)=>{ c.fillStyle=D(cl); c.fillRect(x,y,w,h); }; const ln=(pts,cl,lw)=>{ c.strokeStyle=D(cl); c.lineWidth=lw; c.beginPath(); c.moveTo(pts[0],pts[1]); for(let i=2;i<pts.length;i+=2) c.lineTo(pts[i],pts[i+1]); c.stroke(); };
  const eye=(x,y,r=.9)=>ci(x,y,r,'#111'); const blink = (t%4)<.12;
  switch(id){
    case 'dog': ln([-8,-9,-12,-14+Math.sin(t*9)*2.5],'#8a5a2a',2); rc(-7,-6,2.5,6,'#8a5a2a'); rc(4,-6,2.5,6,'#8a5a2a'); el(0,-8,8,4.5,'#a0703a'); ci(8,-13,4.2,'#a0703a'); el(11.5,-12,2.8,1.9,'#c8925a'); ci(13.8,-12.5,.9,'#111'); el(6.5,-14,1.6,3.2,'#6a4220',.3); if(!blink) eye(9,-14.3); break;
    case 'cat': ln([-4,-2,-9,-4,-8,-11],'#7a7a82',2); el(0,-6,5,6,'#8a8a92'); ci(1,-14,4,'#8a8a92'); c.fillStyle=D('#8a8a92'); c.beginPath(); c.moveTo(-2.5,-16); c.lineTo(-2,-20.5); c.lineTo(.5,-17.5); c.moveTo(2,-17.5); c.lineTo(4.5,-20.5); c.lineTo(4.8,-15.5); c.fill(); if(!blink){ ci(2.5,-14.5,.9,'#7ad05a'); ci(-.3,-14.5,.9,'#7ad05a'); } break;
    case 'frog': { const hop=Math.pow(Math.max(0,Math.sin(t*1.4)),10)*7; c.translate(0,-hop); el(0,-4,6.5,4.2,'#5aa04a'); el(5,-1,3,1.5,'#4a8a3a'); ci(-2.5,-8.5,2.4,'#5aa04a'); ci(2.5,-8.5,2.4,'#5aa04a'); ci(-2.5,-8.7,1.4,'#fff'); ci(2.5,-8.7,1.4,'#fff'); eye(-2.2,-8.7,.7); eye(2.8,-8.7,.7); break; }
    case 'duck': el(0,-5,6.5,4.2,'#f8d84a'); ci(5,-11,3.3,'#f8d84a'); c.fillStyle=D('#ff8a2a'); c.beginPath(); c.moveTo(7.5,-11.5); c.lineTo(11,-10.5); c.lineTo(7.5,-9.5); c.fill(); el(-1.5,-5.5,3.5,2,'#e8c030',-.3); eye(5.8,-12); break;
    case 'goat': rc(-6,-6,2,6,'#d8d0c8'); rc(4,-6,2,6,'#d8d0c8'); el(0,-9,8,4.5,'#f0ece4'); ci(8.5,-14,3.6,'#f0ece4'); ln([7,-17,4,-20,2,-18],'#8a7a6a',1.5); ln([10.5,-11,10,-8],'#d8d0c8',1.6); eye(9.5,-14.8); ln([-8,-10,-10,-12],'#f0ece4',2); break;
    case 'turtle': { const pk=Math.sin(t*.8)>0?1:0; ci(7+pk,-3,2.3,'#7aa05a'); c.fillStyle=D('#3a7a3a'); c.beginPath(); c.arc(0,-2,7,Math.PI,0); c.fill(); ln([-3,-6,0,-8,3,-6],'#2a5a2a',.9); ln([-6,-2,6,-2],'#2a5a2a',.9); if(pk) eye(8,-3.5,.7); break; }
    case 'sheep': rc(-5,-5,1.8,5,'#222'); rc(3.5,-5,1.8,5,'#222'); for(const [dx,dy] of [[-5,-9],[0,-11],[5,-9],[-3,-6],[3,-6],[0,-7]]) ci(dx,dy,3.5,'#f6f4ee'); el(8,-10,2.6,3.3,'#222'); eye(8.8,-10.8,.6); break;
    case 'otter': el(0,-9,4.5,8,'#7a4a2a'); el(.5,-8,2.8,5.5,'#b88a5a'); ci(0,-18,3.7,'#7a4a2a'); ci(1.6,-17.5,1.5,'#b88a5a'); eye(1.2,-19); eye(-1,-19); el(2,-9,2.6,2,'#e8d8c8'); break;
    case 'owl': el(0,-9,5.5,8,'#8a6a4a'); el(0,-7,3.6,5,'#c8a880'); c.fillStyle=D('#8a6a4a'); c.beginPath(); c.moveTo(-5,-15); c.lineTo(-4,-19); c.lineTo(-2,-16); c.moveTo(2,-16); c.lineTo(4,-19); c.lineTo(5,-15); c.fill();
      if(blink){ ln([-3.5,-13,-1,-13],'#111',.8); ln([1,-13,3.5,-13],'#111',.8); } else { ci(-2.2,-13,2,'#fff'); ci(2.2,-13,2,'#fff'); eye(-2,-13,1); eye(2.4,-13,1); } c.fillStyle=D('#e8a020'); c.beginPath(); c.moveTo(-.8,-11); c.lineTo(.8,-11); c.lineTo(0,-9); c.fill(); break;
    case 'llama': rc(-6,-8,2,8,'#e0d0b0'); rc(3,-8,2,8,'#e0d0b0'); el(-1,-12,7,4.5,'#f0e4c8'); rc(3,-27,4,16,'#f0e4c8'); el(6.5,-27,4,2.6,'#f0e4c8'); rc(3.5,-32,1.4,4,'#e0d0b0'); rc(5.5,-32,1.4,4,'#e0d0b0'); eye(7,-28); break;
    case 'capybara': el(0,-6,9,5.5,'#8a5a3a'); el(8,-9,4.6,3.6,'#8a5a3a'); el(11.5,-8.5,1.8,2,'#6a4228'); ci(5.5,-12.4,1.2,'#6a4228'); eye(9,-10.2,.8); ci(8,-14,2.4,'#ff9a2a'); rc(7.6,-16.8,.8,1.2,'#3a8a3a'); break;
    case 'parrot': ln([-1,-4,-5,4],'#3a7ae0',2.5); el(0,-8,3.6,6,'#e03a3a'); ci(1,-15,3,'#e03a3a'); c.fillStyle=D('#ffc94d'); c.beginPath(); c.moveTo(3.5,-16); c.quadraticCurveTo(6.5,-15,4,-12.5); c.lineTo(3.2,-14); c.fill(); el(-1,-8,2,4.5,'#3a9a5a',.3); eye(2,-15.8,.8); ln([-1,-2,-1,0],'#888',1.2); ln([1,-2,1,0],'#888',1.2); break;
    case 'lizard': ln([-6,-2,-12,-1,-15,-4+Math.sin(t*2)],'#5ab03a',2); el(0,-2.5,7,2.6,'#6ac04a'); el(8,-3,3.2,2.2,'#6ac04a'); ln([-3,-1,-5,1],'#5ab03a',1.2); ln([3,-1,5,1],'#5ab03a',1.2); eye(9,-3.8,.7); if(Math.sin(t*3)>.9) ln([11,-2.6,13.5,-2.4],'#ff5a6a',.7); break;
    case 'horse': ln([-13,-26,-17,-14],'#3a2410',3); for(const lx of [-10,-6,6,10]) rc(lx-1.5,-18,3,18,'#6a3a1a'); el(0,-23,13,7,'#7a4a2a'); c.fillStyle=D('#7a4a2a'); c.beginPath(); c.moveTo(8,-26); c.lineTo(13,-40); c.lineTo(18,-38); c.lineTo(13,-22); c.fill();
      el(17,-38,6,3.4,'#7a4a2a',.4); ln([10,-30,13,-40],'#3a2410',2.5); eye(17,-40); rc(12.5,-44,1.6,4,'#6a3a1a'); break;
    case 'penguin': c.rotate(Math.sin(t*3)*.06); el(0,-9,5,9,'#1a1a22'); el(.8,-8,3.3,7,'#f4f4f4'); ci(.5,-17,3.6,'#1a1a22'); c.fillStyle=D('#ff9a2a'); c.beginPath(); c.moveTo(3.5,-17.5); c.lineTo(6.5,-17); c.lineTo(3.5,-16); c.fill(); eye(2,-18,.7); el(-1.5,-.5,2,1,'#ff9a2a'); el(2.5,-.5,2,1,'#ff9a2a'); break;
    case 'crab': c.translate(Math.sin(t*1.2)*2,0); for(const sd of [-1,1]){ ln([sd*3,-2,sd*7,-1,sd*8,1],'#c8402a',1.2); ln([sd*3,-4,sd*6,-7],'#c8402a',1.4); el(sd*7,-8,2.4,1.7,'#d8503a',sd*.5); } el(0,-3.5,5.5,3.2,'#d8503a'); ln([-1.5,-6,-2,-9],'#c8402a',.8); ln([1.5,-6,2,-9],'#c8402a',.8); eye(-2,-9.3,.8); eye(2,-9.3,.8); break;
    default: drawPetX(c,id,t,{el,ci,rc,ln,eye,blink,D});
  }
  if(lk) drawPetGear(c,id,lk,t);
  c.restore();
}
function hatPreview(c,w,h,id,col,big){ const s=h/(big?44:40); c.save(); c.translate(w/2,h*.64); c.scale(s,s); const lk=S.look;
  c.fillStyle=SKINS[lk.skin]||SKINS[1]; c.beginPath(); c.arc(0,0,7.5,0,7); c.fill(); c.fillStyle=HAIRS[lk.hair]||HAIRS[1]; c.beginPath(); c.arc(0,-1,7.9,Math.PI,Math.PI*2); c.fill();
  c.fillStyle='#1a1410'; c.beginPath(); c.arc(4.2,-1,1.1,0,7); c.fill(); c.fillStyle=lk.shirt; c.fillRect(-8,8,16,6);
  drawHat(c,id,HATI[id]&&HATI[id].fixed?'#888888':col,performance.now()/1000); c.restore(); if(big) sparkles(c,w,h,5); }

// ---------- drawing: the scene ----------
let stars=null, drops=null, flakes=null;
function nightness(p){ let n=0; if(p>=.45&&p<.55) n=(p-.45)/.1; else if(p>=.55&&p<.95) n=1; else if(p>=.95) n=1-(p-.95)/.1; else if(p<.05) n=1-(p+.05)/.1; return clamp(n,0,1); }
function tree(x,y,h,col,snow){ g.fillStyle=col; g.beginPath(); g.moveTo(x,y-h); g.lineTo(x-h*.32,y); g.lineTo(x+h*.32,y); g.fill(); if(snow){ g.fillStyle='#f4f8fa'; g.beginPath(); g.moveTo(x,y-h); g.lineTo(x-h*.12,y-h*.62); g.lineTo(x+h*.12,y-h*.62); g.fill(); } }
function drawFar(L,t,night,hz,wx){
  const N=cl=>mix(cl,'#0a1220',night*.7);
  if(L.amp>0){ g.fillStyle=N(L.hill); g.beginPath(); g.moveTo(0,hz+1);
    for(let x=0;x<=W;x+=8){ const y=hz - (Math.sin(x/W*L.freq*Math.PI+1)*.5+.5)*H*L.amp - Math.sin(x/W*L.freq*7.3)*H*L.amp*.25 - H*.012; g.lineTo(x,y); } g.lineTo(W,hz+1); g.closePath(); g.fill(); }
  const sy = x => hz - (Math.sin(x/W*L.freq*Math.PI+1)*.5+.5)*H*L.amp - Math.sin(x/W*L.freq*7.3)*H*L.amp*.25 - H*.012;
  if(L.id==='pond'){ for(const fx of [.36,.52,.93]){ const x=W*fx, y=sy(x)+2, r=H*.045; g.fillStyle=N('#3f6e3a'); g.beginPath(); g.ellipse(x,y-r*.6,r*1.2,r,0,Math.PI,0); g.fill(); g.strokeStyle=N('#4f7e45'); g.lineWidth=1.5; g.beginPath(); for(let i=-5;i<=5;i++){ g.moveTo(x+i*r*.22,y-r*.7); g.quadraticCurveTo(x+i*r*.26,y-r*.2,x+i*r*.24+Math.sin(t+i)*1.5,y+2); } g.stroke(); }
    const bx=W*.78, by=sy(W*.78)+3; g.fillStyle=N('#7a5a3a'); g.fillRect(bx-18,by-16,36,16); g.fillStyle=N('#5a3a2a'); g.beginPath(); g.moveTo(bx-22,by-16); g.lineTo(bx,by-28); g.lineTo(bx+22,by-16); g.fill(); g.fillStyle=night>.4?'#ffd88a':N('#2a2018'); g.fillRect(bx-4,by-11,8,7); }
  else if(L.id==='river'){ for(let i=0;i<16;i++){ const x=W*(i/15), y=sy(x)+3; tree(x+((i*29)%17),y,H*(.05+((i*13)%5)*.008),N('#24402e')); }
    const bx=W*.6, by=hz; g.strokeStyle=N('#8a8478'); g.lineWidth=6; g.beginPath(); g.arc(bx,by+6,H*.05,Math.PI,0); g.stroke(); g.beginPath(); g.arc(bx+H*.1,by+6,H*.05,Math.PI,0); g.stroke(); g.fillStyle=N('#8a8478'); g.fillRect(bx-H*.06,by-H*.055,H*.22,4); }
  else if(L.id==='coast'){ const lx=W*.87, ly=sy(lx)+2, lh=H*.13; g.fillStyle=N('#f0ece4'); g.beginPath(); g.moveTo(lx-7,ly); g.lineTo(lx-4,ly-lh); g.lineTo(lx+4,ly-lh); g.lineTo(lx+7,ly); g.fill();
    g.fillStyle=N('#c8403a'); for(let i=0;i<3;i++) g.fillRect(lx-6+i*.6,ly-lh*(.2+i*.28),12-i*1.2,lh*.12); g.fillStyle=N('#333'); g.fillRect(lx-5,ly-lh-8,10,8); g.fillStyle=night>.3?'#fff2a8':'#d8d0a0'; g.fillRect(lx-3,ly-lh-6,6,4);
    if(night>.3){ const a=t*1.2; g.fillStyle='rgba(255,240,170,'+(.18*night)+')'; g.beginPath(); g.moveTo(lx,ly-lh-4); const dx=Math.cos(a)*W*.5; g.lineTo(lx+dx,ly-lh-4-H*.05); g.lineTo(lx+dx,ly-lh-4+H*.05); g.fill(); } }
  else if(L.id==='frost'){ for(let i=0;i<18;i++){ const x=W*(i/17)+((i*31)%13), y=sy(x)+3; tree(x,y,H*(.05+((i*7)%5)*.009),N('#2a4a3e'),true); }
    const hx=W*.68, hy=sy(W*.68)+3; g.fillStyle=N('#a04a3a'); g.fillRect(hx-10,hy-12,20,12); g.fillStyle=N('#e8eef2'); g.beginPath(); g.moveTo(hx-13,hy-12); g.lineTo(hx,hy-20); g.lineTo(hx+13,hy-12); g.fill(); g.fillStyle=night>.3?'#ffd88a':N('#3a2a20'); g.fillRect(hx-3,hy-9,6,5);
    g.fillStyle='rgba(220,226,232,.5)'; for(let i=0;i<4;i++){ const k=((t*.25+i/4)%1); g.beginPath(); g.arc(hx+6+k*10,hy-22-k*26,2+k*5,0,7); g.globalAlpha=(1-k)*.6; g.fill(); } g.globalAlpha=1; }
  else if(L.id==='reef'){ const ix=W*.8, iy=hz+2; g.fillStyle=N('#e8d8a8'); g.beginPath(); g.ellipse(ix,iy,W*.09,H*.018,0,Math.PI,0); g.fill(); g.fillStyle=N('#3e8f4e'); g.beginPath(); g.ellipse(ix-W*.02,iy-H*.012,W*.05,H*.02,0,Math.PI,0); g.fill();
    for(const [px,ph] of [[ix+W*.03,H*.09],[ix-W*.04,H*.07]]){ g.strokeStyle=N('#7a5a3a'); g.lineWidth=3; g.beginPath(); g.moveTo(px,iy-2); g.quadraticCurveTo(px+6,iy-ph*.5,px+3,iy-ph); g.stroke(); g.strokeStyle=N('#2f7a3e'); g.lineWidth=2.5; for(let i=0;i<5;i++){ const a=-Math.PI*.1-i*Math.PI*.2; g.beginPath(); g.moveTo(px+3,iy-ph); g.quadraticCurveTo(px+3+Math.cos(a)*10,iy-ph+Math.sin(a)*6-4,px+3+Math.cos(a)*18,iy-ph+Math.sin(a)*12+6); g.stroke(); } }
    const sx=((t*6)%(W*1.2))-W*.1, syy=hz-2; g.fillStyle=N('#f4f0e8'); g.beginPath(); g.moveTo(sx,syy-22); g.lineTo(sx,syy-3); g.lineTo(sx+14,syy-3); g.fill(); g.fillStyle=N('#6a4a2a'); g.fillRect(sx-8,syy-3,26,4); }
  else if(L.id==='shelf'){ g.fillStyle=mix('#2a3a4c','#05080f',night); g.fillRect(W*.78,hz-10,26,6); g.beginPath(); g.moveTo(W*.78+8,hz-10); g.lineTo(W*.78+12,hz-26); g.lineTo(W*.78+20,hz-10); g.fill();
    if(night>.3){ g.fillStyle='#ffcf6a'; g.fillRect(W*.78+11,hz-28,2,2); }
    const cx=((t*4)%(W*1.4))-W*.2; g.fillStyle=mix('#3a4652','#05080f',night); g.fillRect(cx,hz-7,60,6); g.fillRect(cx+40,hz-15,14,8); for(let i=0;i<4;i++){ g.fillStyle=['#c8553a','#3a6f9a','#e0c050','#4f8a4a'][i]; g.globalAlpha=1-night*.7; g.fillRect(cx+4+i*9,hz-12,8,5); } g.globalAlpha=1; }
  else if(L.id==='deep'){ const ox=W*.72; g.fillStyle=mix('#3a4652','#05080f',night); g.fillRect(ox,hz-6,34,5); g.fillRect(ox+6,hz-14,12,8); g.fillRect(ox+11,hz-26,2,12); if(night>.2){ g.fillStyle=Math.sin(t*2)>0?'#ff5a5a':'#5aff8a'; g.fillRect(ox+10,hz-28,4,3); }
    const sp=(t%23); if(sp<3){ const k=sp/3, wx2=W*.5; g.fillStyle='rgba(230,240,250,'+(.7*(1-k))+')'; for(let i=0;i<8;i++){ g.beginPath(); g.arc(wx2+Math.sin(i)*k*14,hz-4-k*30*Math.abs(Math.cos(i*.7)),2+k*3,0,7); g.fill(); } g.fillStyle=mix('#1a2a3a','#05080f',night); g.beginPath(); g.ellipse(wx2,hz+2,18,4,0,Math.PI,0); g.fill(); } }
  else { g.strokeStyle=mix('#2b3b48','#0a0f16',night); g.lineWidth=2; g.beginPath(); g.moveTo(W*.7,hz); g.lineTo(W*.7,hz-30); g.moveTo(W*.7-10,hz-18); g.lineTo(W*.7+10,hz-18); g.stroke(); if(night>.3){ g.fillStyle='#ff5b6e'; g.globalAlpha=(Math.sin(t*3)>.6)?1:.2; g.fillRect(W*.7-2,hz-33,4,4); g.globalAlpha=1; }
    const vx=W*.42; g.fillStyle='#0c141c'; g.fillRect(vx,hz-8,70,7); g.fillRect(vx+10,hz-18,26,10); g.fillRect(vx+50,hz-24,3,16); g.fillStyle='#ffe08a'; for(let i=0;i<4;i++) g.fillRect(vx+13+i*6,hz-15,3,3);
    const tc=t%37; if(tc<6){ const k=Math.sin(tc/6*Math.PI); g.strokeStyle='rgba(20,10,20,.85)'; g.lineWidth=5; g.beginPath(); g.moveTo(W*.88,hz+3); g.quadraticCurveTo(W*.88+10,hz-k*40,W*.88-6+Math.sin(t*2)*6,hz-k*60); g.stroke(); } }
}
function drawWaterDeco(L,t,night,hz){
  const N=cl=>mix(cl,'#0a1220',night*.6);
  if(L.id==='pond'){ for(const [fx,fy,r] of [[.45,.62,9],[.6,.55,7],[.74,.7,11],[.86,.58,6],[.38,.8,12],[.95,.76,9]]){ const x=W*fx, y=H*fy; g.fillStyle=N('#3e7a3a'); g.beginPath(); g.ellipse(x,y,r*1.6,r*.45,0,.3,Math.PI*2-.1); g.lineTo(x,y); g.fill(); if(r>8){ g.fillStyle=N('#ffb0d0'); g.beginPath(); g.arc(x-2,y-2,2.6,0,7); g.fill(); } }
    if(night<.5){ const dx=((t*10)%(W*1.3))-W*.15, dy=hz+H*.05; g.fillStyle='#f4f4f0'; g.beginPath(); g.ellipse(dx,dy,8,4,0,0,7); g.fill(); g.fillStyle='#3a7a4a'; g.beginPath(); g.arc(dx+7,dy-5,3.5,0,7); g.fill(); g.fillStyle='#ff9a2a'; g.fillRect(dx+10,dy-5,4,2); }
    if(night>.3){ for(let i=0;i<14;i++){ const x=(i*97+Math.sin(t*.7+i)*30)%W, y=hz-10+((i*41)%60)+Math.sin(t*1.3+i)*8; g.fillStyle='rgba(230,255,140,'+(night*(.4+.6*Math.max(0,Math.sin(t*3+i*2))))+')'; g.beginPath(); g.arc(x,y,1.6,0,7); g.fill(); } } }
  else if(L.id==='river'){ for(const [fx,fy,r] of [[.5,.6,10],[.68,.75,14],[.82,.56,8],[.42,.85,12]]){ const x=W*fx, y=H*fy; g.fillStyle=N('#6a6a62'); g.beginPath(); g.ellipse(x,y,r,r*.5,0,Math.PI,0); g.fill(); g.strokeStyle='rgba(255,255,255,.35)'; g.lineWidth=1.2; g.beginPath(); g.ellipse(x+Math.sin(t*3)*1.5,y,r*1.4,r*.3,0,0,7); g.stroke(); }
    if(night<.6){ for(let i=0;i<3;i++){ const bx=((t*25+i*170)%(W+80))-40, by=H*.12+i*14+Math.sin(t*2+i)*4; g.strokeStyle='#2a2a2a'; g.lineWidth=1.4; g.beginPath(); g.moveTo(bx-5,by-3); g.lineTo(bx,by); g.lineTo(bx+5,by-3); g.stroke(); } } }
  else if(L.id==='coast'){ for(const [fx,fy,cl] of [[.62,.58,'#ff5a3a'],[.88,.66,'#ffd84a']]){ const x=W*fx, y=H*fy+Math.sin(t*1.5+fx*9)*2; g.fillStyle=N(cl); g.beginPath(); g.moveTo(x-5,y); g.lineTo(x,y-14); g.lineTo(x+5,y); g.fill(); g.fillStyle=N('#f4f4f4'); g.fillRect(x-5,y-1,10,3); if(night>.3){ g.fillStyle='rgba(255,240,170,'+(Math.sin(t*2+fx*5)>.3?.9:.1)+')'; g.fillRect(x-1.5,y-17,3,3); } }
    for(let i=0;i<4;i++){ const bx=((t*(20+i*6)+i*230)%(W+80))-40, by=H*.1+((i*31)%40)+Math.sin(t*3+i)*5; g.strokeStyle=night>.5?'#8a9aa8':'#f4f4f4'; g.lineWidth=1.6; g.beginPath(); g.moveTo(bx-6,by-2+Math.sin(t*8+i)*2); g.quadraticCurveTo(bx-3,by-4,bx,by); g.quadraticCurveTo(bx+3,by-4,bx+6,by-2+Math.sin(t*8+i)*2); g.stroke(); } }
  else if(L.id==='frost'){ for(let i=0;i<7;i++){ const x=((W*(.3+i*.11)+t*(3+i%3))%(W*.8))+W*.25, y=hz+H*.04+((i*53)%100)/100*(H*.38), w2=18+((i*29)%30); g.fillStyle=N('#e8f2f8'); g.beginPath(); g.moveTo(x-w2,y); g.lineTo(x-w2*.6,y-4); g.lineTo(x+w2*.7,y-3); g.lineTo(x+w2,y+1); g.lineTo(x-w2*.3,y+3); g.fill(); g.fillStyle=N('#a8c8d8'); g.fillRect(x-w2*.9,y+1,w2*1.8,2); } }
  else if(L.id==='reef'){ for(let i=0;i<12;i++){ const x=W*(.3+i*.06)+((i*17)%20), y=H*(.8+((i*13)%10)/100), r=6+((i*7)%10); g.globalAlpha=.4; g.fillStyle=['#ff7a9a','#ffb04a','#c87aff','#7affd0'][i%4]; g.beginPath(); g.arc(x,y,r,Math.PI,0); g.fill(); g.fillRect(x-1.5,y,3,r); } g.globalAlpha=1;
    const tx=((t*12)%(W*1.2))-W*.1, ty=H*.7+Math.sin(t*.8)*6; g.globalAlpha=.55; g.fillStyle='#3a7a4a'; g.beginPath(); g.ellipse(tx,ty,12,7,0,0,7); g.fill(); g.fillStyle='#6aa05a'; g.beginPath(); g.arc(tx+13,ty-1,3.5,0,7); g.fill(); g.fillRect(tx-4,ty-9+Math.sin(t*3)*2,8,3); g.fillRect(tx-4,ty+6-Math.sin(t*3)*2,8,3); g.globalAlpha=1;
    for(let i=0;i<9;i++){ const fx=((t*30+i*16)%(W*1.3))-W*.15, fy=H*.62+Math.sin(t+i*.5)*8+i*2; g.fillStyle='rgba(255,220,90,.6)'; g.beginPath(); g.ellipse(fx,fy,3,1.5,0,0,7); g.fill(); } }
  else if(L.id==='shelf'){ const dp=t%14; if(dp<1.6){ const k=dp/1.6, x0=W*.55; const x=x0+k*W*.12, y=hz+H*.12-Math.sin(k*Math.PI)*H*.08; g.save(); g.translate(x,y); g.rotate((k-.5)*1.6); g.fillStyle='#5a7088'; g.beginPath(); g.ellipse(0,0,16,5,0,0,7); g.fill(); g.beginPath(); g.moveTo(-2,-4); g.lineTo(2,-10); g.lineTo(5,-4); g.fill(); g.beginPath(); g.moveTo(-14,0); g.lineTo(-20,-5); g.lineTo(-20,5); g.fill(); g.restore(); if(k>.85) splash(x,hz+H*.12,1); } }
  else if(L.id==='deep'){ const fx=((t*18)%(W*1.4))-W*.2, fy=H*.66; if(Math.sin(t*.13)>.3){ g.fillStyle=N('#3a4a5a'); g.beginPath(); g.moveTo(fx,fy); g.lineTo(fx+6,fy-16); g.lineTo(fx+14,fy); g.fill(); g.strokeStyle='rgba(255,255,255,.35)'; g.beginPath(); g.moveTo(fx-12,fy+1); g.lineTo(fx+16,fy+1); g.stroke(); } }
  else if(L.id==='trench'){ for(let i=0;i<16;i++){ const xx=(i*137.5+t*6)%W, yy=hz+30+((i*71)%(H-hz-40)); g.fillStyle='rgba(127,245,255,'+((.15+night*.4)*(.5+.5*Math.sin(t*2+i)))+')'; g.beginPath(); g.arc(xx,yy,1.6,0,7); g.fill(); }
    for(let i=0;i<3;i++){ const jx=W*(.4+i*.22)+Math.sin(t*.3+i)*20, jy=H*(.68+i*.06)+Math.sin(t*.9+i)*6; g.globalAlpha=.35+.25*Math.sin(t*2+i); g.fillStyle=['#ff6ad8','#6affea','#b08aff'][i]; g.beginPath(); g.arc(jx,jy,7,Math.PI,0); g.fill(); g.strokeStyle=g.fillStyle; g.lineWidth=1; for(let k=-2;k<=2;k++){ g.beginPath(); g.moveTo(jx+k*2.5,jy); g.quadraticCurveTo(jx+k*2.5+Math.sin(t*2+k)*3,jy+8,jx+k*2,jy+14); g.stroke(); } } g.globalAlpha=1; }
}
function drawPlatform(L,t,night,dockY,pb){
  const N=(cl,k=.6)=>mix(cl,'#0a1018',night*k), PW=W*.19;
  switch(L.plat){
    case 'dock': case 'pier': { const tall=L.plat==='pier'; g.fillStyle=N('#6b4a2e'); g.fillRect(-2,dockY,PW,10); g.fillStyle=N('#4a3220'); for(let i=0;i<3;i++) g.fillRect(W*.02+i*W*.075,dockY+10,7,H-dockY);
      g.fillStyle=N('#7c5838'); for(let x=0;x<PW;x+=18) g.fillRect(x,dockY,1.5,10);
      if(tall){ g.strokeStyle=N('#c8b08a'); g.lineWidth=1.5; g.beginPath(); g.moveTo(0,dockY-16); for(let i=0;i<4;i++){ const px=i*PW/3; g.lineTo(px,dockY-16); } g.stroke(); g.fillStyle=N('#4a3220'); for(let i=0;i<4;i++) g.fillRect(i*PW/3-2,dockY-20,4,20); }
      else { const lx=PW-6; g.fillStyle=N('#3a2a1a'); g.fillRect(lx,dockY-34,3,34); g.fillStyle=night>.3?'#ffd88a':N('#555'); g.fillRect(lx-3,dockY-42,9,8); if(night>.3){ const gr=g.createRadialGradient(lx+1.5,dockY-38,2,lx+1.5,dockY-38,40); gr.addColorStop(0,'rgba(255,216,138,.35)'); gr.addColorStop(1,'rgba(255,216,138,0)'); g.fillStyle=gr; g.fillRect(lx-40,dockY-78,82,80); } }
      g.fillStyle=N('#8a8a8a'); g.fillRect(W*.155,dockY-9,9,9); g.fillStyle=N('#6a6a6a'); g.fillRect(W*.155,dockY-9,9,2); break; }
    case 'ice': { g.fillStyle=N('#e6f0f6',.5); g.beginPath(); g.moveTo(-2,dockY); g.lineTo(PW+6,dockY); g.lineTo(PW+16,H); g.lineTo(-2,H); g.fill(); g.fillStyle=N('#b8d4e4',.5); g.beginPath(); g.moveTo(PW+6,dockY); g.lineTo(PW+16,H); g.lineTo(PW+4,H); g.lineTo(PW-2,dockY+6); g.fill();
      g.fillStyle=N('#ffffff',.5); g.fillRect(-2,dockY-3,PW+8,4); g.fillStyle=N('#2a4a5a'); g.beginPath(); g.ellipse(W*.05,dockY+12,12,3,0,0,7); g.fill(); g.fillStyle=N('#c8553a'); g.fillRect(W*.155,dockY-11,10,11); g.fillStyle=N('#a03a2a'); g.fillRect(W*.155,dockY-11,10,2); break; }
    case 'sand': { g.fillStyle=N('#e8d29a',.5); g.beginPath(); g.moveTo(-2,dockY); g.quadraticCurveTo(PW*.7,dockY-4,PW+10,dockY+10); g.quadraticCurveTo(PW+30,H*.8,PW+50,H); g.lineTo(-2,H); g.fill(); g.fillStyle=N('#d4bc80',.5); for(let i=0;i<14;i++) g.fillRect(((i*37)%100)/100*PW,dockY+8+((i*53)%60)/100*(H-dockY),2,1.5);
      g.fillStyle=N('#ff8a5a'); g.save(); g.translate(W*.17,dockY+20); g.beginPath(); for(let i=0;i<5;i++){ const a=i/5*Math.PI*2-Math.PI/2; g.lineTo(Math.cos(a)*6,Math.sin(a)*6); g.lineTo(Math.cos(a+.63)*2.4,Math.sin(a+.63)*2.4); } g.fill(); g.restore();
      const px=W*.035; g.strokeStyle=N('#8a6a3a'); g.lineWidth=5; g.beginPath(); g.moveTo(px,dockY); g.quadraticCurveTo(px-6,dockY-H*.18,px+8,dockY-H*.3); g.stroke(); g.strokeStyle=N('#3a8a4a'); g.lineWidth=3;
      for(let i=0;i<6;i++){ const a=-.3-i*.5+Math.sin(t*.8+i)*.05; g.beginPath(); g.moveTo(px+8,dockY-H*.3); g.quadraticCurveTo(px+8+Math.cos(a)*16,dockY-H*.3+Math.sin(a)*10-6,px+8+Math.cos(a)*30,dockY-H*.3+Math.sin(a)*18+10); g.stroke(); } break; }
    case 'boat': case 'trawler': case 'raft': { const y=dockY+pb, tr=L.plat==='trawler', raft=L.plat==='raft'; const hull = raft?'#2a3038':tr?'#8a3a2a':'#f0f0ea', stripe = raft?'#ffc94d':tr?'#2a2a2a':'#3a6f9a';
      g.fillStyle=N(hull); g.beginPath(); g.moveTo(-10,y); g.lineTo(PW+12,y); g.quadraticCurveTo(PW+4,y+H*.1,PW-20,y+H*.13); g.lineTo(-10,y+H*.13); g.fill(); g.fillStyle=N(stripe); g.fillRect(-10,y+5,PW+18,4);
      g.strokeStyle=N(raft?'#ffc94d':'#c8d0d8'); g.lineWidth=1.5; g.beginPath(); g.moveTo(-10,y-14); g.lineTo(PW+8,y-14); for(let i=0;i<5;i++){ const px=i*(PW+8)/4; g.moveTo(px,y); g.lineTo(px,y-14); } g.stroke();
      const cw=tr?W*.07:W*.05; g.fillStyle=N(raft?'#3a4048':tr?'#e8e0d0':'#e8e8e2'); g.fillRect(-10,y-(tr?52:40),cw+10,tr?52:40); g.fillStyle=night>.3?'#ffe08a':N('#5a8aa8'); g.fillRect(4,y-(tr?44:32),cw-12,10);
      if(tr||raft){ g.fillStyle=N('#5a5a5a'); g.fillRect(cw*.4,y-(tr?90:70),3,tr?40:32); g.fillStyle=night>.2?(raft?'#ffffff':'#ff5a5a'):N('#666'); g.fillRect(cw*.4-2,y-(tr?94:74),7,5);
        if(night>.2||raft){ const gr=g.createRadialGradient(cw*.4+1,y-(tr?92:72),2,cw*.4+1,y-(tr?92:72),raft?90:30); gr.addColorStop(0,raft?'rgba(255,255,230,.25)':'rgba(255,90,90,.3)'); gr.addColorStop(1,'rgba(0,0,0,0)'); g.fillStyle=gr; g.fillRect(cw*.4-90,y-182,182,182); } }
      if(tr){ g.strokeStyle=N('#6a7a6a'); g.lineWidth=1; for(let i=0;i<5;i++){ g.beginPath(); g.moveTo(cw+4+i*5,y-2); g.lineTo(cw+10+i*4,y-20); g.stroke(); } }
      g.fillStyle='rgba(255,255,255,.25)'; g.fillRect(PW-20,y+H*.12,40+Math.sin(t*2)*6,2); break; }
  }
}
function drawFore(L,t,night){
  const N=cl=>mix(cl,'#0a1220',night*.6);
  if(L.id==='pond'||L.id==='river'){ g.strokeStyle=N(L.id==='pond'?'#4a7a3a':'#5a7a4a'); g.lineWidth=2; for(let i=0;i<9;i++){ const x=W*.93+i*W*.009, h=H*(.09+((i*13)%5)*.02); g.beginPath(); g.moveTo(x,H); g.quadraticCurveTo(x+Math.sin(t+i)*3,H-h*.6,x+Math.sin(t*1.2+i)*5,H-h); g.stroke(); if(L.id==='pond'&&i%3===0){ g.fillStyle=N('#6a4a2a'); g.fillRect(x+Math.sin(t*1.2+i)*5-2,H-h-10,4,11); } }
    if(L.id==='river'){ g.fillStyle=N('#5a5a54'); g.beginPath(); g.ellipse(W*.86,H+6,40,18,0,Math.PI,0); g.fill(); } }
  else if(L.id==='coast'){ g.strokeStyle=N('#a89a5a'); g.lineWidth=1.5; for(let i=0;i<12;i++){ const x=W*.9+i*W*.008, h=H*(.06+((i*7)%4)*.015); g.beginPath(); g.moveTo(x,H); g.quadraticCurveTo(x+Math.sin(t*1.5+i)*4,H-h*.5,x+6+Math.sin(t*1.5+i)*6,H-h); g.stroke(); } }
  else if(L.id==='frost'){ g.fillStyle=N('#eef4f8'); g.beginPath(); g.ellipse(W*.95,H+8,W*.1,H*.06,0,Math.PI,0); g.fill(); }
}
function drawHotspot(t){ const hs=G.hot; if(!hs) return; const fade=Math.min(1,hs.t/1.2, (hs.life-hs.t)/2); const x=castX(hs.p), y=waterY(x), R=W*.045*(1-.3*(x-W*.3)/(W*.6));
  for(let i=0;i<3;i++){ const k=((t*.7+i/3)%1); g.strokeStyle='rgba(255,215,110,'+(fade*(1-k)*.85)+')'; g.lineWidth=1.6; g.beginPath(); g.ellipse(x,y,R*(.25+k),R*(.25+k)*.3,0,0,7); g.stroke(); }
  g.fillStyle='rgba(255,233,168,'+(fade*.8)+')'; for(let i=0;i<5;i++){ const a=t*1.5+i*1.26; g.fillRect(x+Math.cos(a)*R*.6,y+Math.sin(a)*R*.18-3-Math.abs(Math.sin(t*3+i))*5,2,2); } }

function draw(now){
  const L=curLoc(), p=phase(), t=now/1000, hz=HZ(), wx=weather(); const night=nightness(p);
  const dusk = Math.max(0, 1-Math.abs(p-.5)/.06) + Math.max(0,1-Math.min(Math.abs(p-1),p)/.06)*.7;
  const gloom = (wx.k==='Storm' ? .55 : wx.k==='Rain' ? .3 : wx.k==='Fog' ? .15 : 0) + (L.id==='deep'?.1:0);
  const sg=g.createLinearGradient(0,0,0,hz);
  let top=mix(L.sky[0],'#0b1430',night), bot=mix(L.sky[1],'#24305a',night); if(dusk>0) bot=mix(bot,'#f2875a',clamp(dusk,0,1)*.8);
  if(gloom){ top=mix(top,'#3a4652',gloom); bot=mix(bot,'#59636c',gloom); } if(wx.k==='Gilded') bot=mix(bot,'#ffcf6a',.35);
  sg.addColorStop(0,top); sg.addColorStop(1,bot); g.fillStyle=sg; g.fillRect(0,0,W,hz+1);
  if(night>.05 && gloom<.5){ if(!stars||stars.w!==W){ stars={w:W,a:Array.from({length:70},()=>[Math.random()*W,Math.random()*hz*.9,Math.random()])}; } g.fillStyle='#fff';
    for(const s of stars.a){ g.globalAlpha=night*(1-gloom)*(.35+.65*Math.abs(Math.sin(t*.8+s[2]*9))); g.fillRect(s[0],s[1],1.4,1.4); } g.globalAlpha=1; }
  if(L.id==='frost' && night>.2){ for(let b=0;b<3;b++){ g.strokeStyle=['rgba(90,255,170,','rgba(160,120,255,','rgba(90,220,255,'][b]+(night*.22)+')'; g.lineWidth=14-b*3; g.beginPath(); for(let x=0;x<=W;x+=12){ const y=hz*(.25+b*.12)+Math.sin(x*.008+t*.4+b)*hz*.08+Math.sin(x*.02+t*.7)*6; x?g.lineTo(x,y):g.moveTo(x,y); } g.stroke(); } }
  const sa = ((p+.05)%1); const sunUp = sa < .55; const k = sunUp ? sa/.55 : (sa-.55)/.45;
  const bx = W*(.1+.8*k), by = hz - Math.sin(k*Math.PI)*hz*.8 + 10;
  g.fillStyle = sunUp ? (wx.k==='Gilded'?'#ffe08a':'#fff1c9') : (L.id==='trench'?'#ffb0a0':'#e8eef5'); g.globalAlpha = (sunUp ? 1-night*.2 : .9)*(1-gloom*.85); g.beginPath(); g.arc(bx,by,sunUp?16:11,0,7); g.fill(); g.globalAlpha=1;
  if(gloom>.08){ g.fillStyle='rgba(40,48,56,'+(gloom*.8)+')'; for(let i=0;i<6;i++){ const cx=((i*W/5)+t*8*(1+i%3))%(W+200)-100, cy=hz*(.12+.1*(i%3)); g.beginPath(); g.ellipse(cx,cy,90,22,0,0,7); g.ellipse(cx+50,cy+8,70,18,0,0,7); g.fill(); } }
  else { g.fillStyle='rgba(255,255,255,'+(.5-night*.4)+')'; for(let i=0;i<3;i++){ const cx=((i*W/2.5)+t*5)%(W+160)-80, cy=hz*(.18+.12*i); g.beginPath(); g.ellipse(cx,cy,34,9,0,0,7); g.ellipse(cx+22,cy-5,22,8,0,0,7); g.fill(); } }
  drawFar(L,t,night,hz,wx);
  const wg=g.createLinearGradient(0,hz,0,H); wg.addColorStop(0,mix(mix(L.water[0],'#10243e',night*.8),'#3b4750',gloom*.6)); wg.addColorStop(1,mix(L.water[1],'#02060c',night*.6)); g.fillStyle=wg; g.fillRect(0,hz,W,H-hz);
  g.fillStyle = sunUp ? '#fff1c955' : '#e8eef544'; g.globalAlpha=1-gloom*.85; for(let i=0;i<8;i++){ const yy=hz+6+i*i*3.2; if(yy>H) break; const w2=18+i*6+Math.sin(t*2+i)*6; g.fillRect(bx-w2/2,yy,w2,2); } g.globalAlpha=1;
  const swell = (wx.k==='Storm'?2.2:1)*(L.id==='deep'?1.8:L.id==='shelf'?1.3:1);
  g.strokeStyle='rgba(255,255,255,'+(.10-night*.04+gloom*.05)+')'; g.lineWidth=1;
  for(let r=0;r<14;r++){ const y = hz + Math.pow(r/14,1.6)*(H-hz) + 4; const sp=10+r*5, len=8+r*4, spd=(8+r*2)*swell*(L.id==='river'?2:1); g.beginPath();
    for(let x=-sp*2 + ((t*spd+r*37)%(sp*2)); x<W; x+=sp*2){ const yy=y+Math.sin(x*.05+t*1.5+r)*1.5*swell; g.moveTo(x,yy); g.lineTo(x+len,yy); } g.stroke(); }
  drawWaterDeco(L,t,night,hz);
  drawHotspot(t);
  if(G.st==='reeling' && G.fish){ const f=G.fish; const len = f.kind!=='fish' ? 26 : 30 + Math.min(60, Math.sqrt(f.kg||1)*8);
    if(G.ev==='jump' && f.kind==='fish'){ const k=1-G.evDur/.85; const jx=G.bob.x+len*.2, jy=G.bob.y-Math.sin(k*Math.PI)*H*.13; g.save(); g.translate(jx,jy); g.rotate(-Math.cos(k*Math.PI)*.9); drawCreature(g,f.sp,0,0,len,{shiny:f.shiny,wag:t*20,flip:true}); g.restore(); }
    else { g.globalAlpha=.35; if(f.kind!=='fish'){ g.fillStyle='#06121a'; g.fillRect(G.bob.x-12,G.bob.y+8,24,14); } else drawCreature(g,f.sp,G.bob.x + (G.run?Math.sin(t*9)*10:Math.sin(t*2)*6)+len*.4, G.bob.y + 14, len, {sil:'#06121a', wag:t*12, flip:true}); g.globalAlpha=1; } }
  const dockY=H*.6, pb = (L.plat==='boat'||L.plat==='trawler'||L.plat==='raft') ? Math.sin(t*1.1)*2.5*(L.plat==='trawler'?1.6:1) : 0;
  drawPlatform(L,t,night,dockY,pb);
  const sc=clamp(H/420,.7,1.25), ax=W*.12, ay=dockY+pb;
  drawPetScene(ax,ay,sc,t,night);
  let hx=9, hy=-35; if(G.st==='reeling'&&G.hold){ hx=9+Math.cos(t*14)*2.2; hy=-34+Math.sin(t*14)*2.2; } if(G.st==='charging'){ hx=7-G.power*3; hy=-38-G.power*3; }
  drawAngler(g,ax,ay,sc,S.look,{night:night*.8,hx,hy,t});
  const hand={x:ax+hx*sc,y:ay+hy*sc}; const tip=TIP(); let tx=tip.x, ty=tip.y+pb;
  if(G.st==='charging'){ tx -= G.power*W*.05; ty += G.power*H*.06; }
  if(G.st==='reeling'){ const bend = clamp(G.ten/100,0,1); tx += bend*W*.03; ty += bend*H*.08 + (G.run?Math.sin(t*25)*1.5:0); }
  if(G.st==='landing'){ ty += H*.04*(1-G.land.t/G.land.dur); }
  g.strokeStyle=mix(ROD_I[S.rods.eq]?ROD_I[S.rods.eq].col:'#d9c7a0','#2a2620',night*.4); g.lineWidth=2.5; g.beginPath(); g.moveTo(hand.x,hand.y); g.quadraticCurveTo((hand.x+tx)/2, (hand.y+ty)/2 - 6 + (G.st==='reeling'?G.ten*.08:0), tx, ty); g.stroke();
  g.fillStyle='#2a2a2a'; g.beginPath(); g.arc(hand.x+3,hand.y-2,3,0,7); g.fill();
  let lp=null;
  if(G.st==='landing'){ const k=G.land.t/G.land.dur, e=1-Math.pow(1-k,2.2); const ex=W*.2, ey=H*.24; const lx=G.land.x0+(ex-G.land.x0)*e, ly=G.land.y0+(ey-G.land.y0)*e - Math.sin(k*Math.PI)*H*.16; lp={x:lx,y:ly,k}; }
  if(G.st==='flying'||G.st==='waiting'||G.st==='bite'||G.st==='reeling'){ const sag = G.st==='reeling' ? (1-clamp(G.ten/100,0,1))*30 : 30;
    g.strokeStyle='rgba(235,240,235,.75)'; g.lineWidth=1; g.beginPath(); g.moveTo(tx,ty); g.quadraticCurveTo((tx+G.bob.x)/2,Math.max(ty,G.bob.y)+sag-20,G.bob.x,G.bob.y); g.stroke(); }
  else if(lp){ g.strokeStyle='rgba(235,240,235,.75)'; g.lineWidth=1; g.beginPath(); g.moveTo(tx,ty); g.lineTo(lp.x,lp.y-8); g.stroke(); }
  else { g.strokeStyle='rgba(235,240,235,.6)'; g.lineWidth=1; g.beginPath(); g.moveTo(tx,ty); g.lineTo(tx,ty+H*.06); g.stroke(); G.bob.x=tx; G.bob.y=ty+H*.06; }
  if(!lp){ let dip=0; if(G.st==='waiting'){ dip = Math.sin(t*2.2)*1.2 + (G.nibOn>0 ? Math.sin(G.nibOn*30)*3 : 0); } if(G.st==='bite') dip = 7; if(G.st==='reeling') dip = 3 + (G.run?3:0);
    const onWater = G.st==='waiting'||G.st==='bite'||G.st==='reeling';
    const br = onWater ? clamp(6.5*(1-.4*clamp((G.bob.x-W*.3)/(W*.6),0,1)),3,7) : 5; const bx2=G.bob.x, by2=G.bob.y+dip;
    if(G.st==='waiting'||G.st==='bite'){ g.strokeStyle=G.inHot?'rgba(255,215,110,.6)':'rgba(255,255,255,.25)'; g.beginPath(); g.ellipse(G.bob.x,G.bob.y+2,br*2.2+Math.sin(t*3),br*.7,0,0,7); g.stroke(); }
    g.fillStyle='#f4f1ea'; g.beginPath(); g.arc(bx2,by2+br*.35,br,0,Math.PI); g.fill(); g.fillStyle='#ff6a3d'; g.beginPath(); g.arc(bx2,by2,br,Math.PI,0); g.fill(); }
  else { const f=G.fish, k=lp.k, sz=(f&&f.kind==='fish') ? clamp(30+Math.sqrt(f.kg)*7,30,90)*(.7+.5*k) : 46*(.7+.5*k);
    g.save(); g.translate(lp.x,lp.y+sz*.15); g.rotate(Math.sin(t*22)*.35*(1-k*.5)-.4*(1-k));
    if(f && f.kind==='fish') drawCreature(g,f.sp,0,0,sz,{shiny:f.shiny,wag:t*26,flip:true});
    else if(f && f.kind==='junk') drawJunkAt(g,f.item.id,0,0,sz/150);
    else if(f && f.kind==='hat'){ g.scale(sz/30,sz/30); drawHat(g,f.hat.id,f.hat.fixed?'#888888':S.look.hatCol,t); }
    g.restore(); if(f && (f.shiny||f.kind==='hat')){ g.fillStyle='rgba(255,233,168,.9)'; for(let i=0;i<5;i++){ const a=t*4+i*1.25; g.fillRect(lp.x+Math.cos(a)*sz*.6,lp.y+Math.sin(a)*sz*.4,2.5,2.5); } } }
  g.fillStyle='rgba(225,240,240,.85)'; for(const q of G.parts){ g.globalAlpha=Math.max(0,1-q.t/q.life); g.fillRect(q.x,q.y,2,2); } g.globalAlpha=1;
  drawFore(L,t,night);
  drawEvents(t);
  const FX=S.settings.effects;
  if(FX && (wx.k==='Rain'||wx.k==='Storm')){ const n = wx.k==='Storm'?140:80; if(!drops||drops.length!==n) drops=Array.from({length:n},()=>[Math.random(),Math.random(),.6+Math.random()*.6]);
    g.strokeStyle='rgba(200,220,235,.35)'; g.lineWidth=1; g.beginPath(); const slant = wx.k==='Storm'? 10 : 4;
    for(const d of drops){ const x=((d[0]*W + t*slant*20*d[2])%W), y=((d[1]*H + t*700*d[2])%H); g.moveTo(x,y); g.lineTo(x-slant,y+14); } g.stroke(); }
  if(FX && L.id==='frost'){ if(!flakes) flakes=Array.from({length:70},()=>[Math.random(),Math.random(),.5+Math.random()]); g.fillStyle='rgba(255,255,255,.8)';
    for(const f of flakes){ const x=((f[0]*W + Math.sin(t*.8+f[1]*9)*20 + t*8*f[2])%W+W)%W, y=((f[1]*H + t*30*f[2])%H); g.fillRect(x,y,1.6*f[2],1.6*f[2]); } }
  if(wx.k==='Fog'){ const fg=g.createLinearGradient(0,hz-60,0,H); fg.addColorStop(0,'rgba(210,220,225,0)'); fg.addColorStop(.25,'rgba(210,220,225,.38)'); fg.addColorStop(1,'rgba(210,220,225,.12)'); g.fillStyle=fg; g.fillRect(0,0,W,H); }
  if(FX && wx.k==='Gilded'){ for(let i=0;i<24;i++){ const x=(i*97.3+t*12*(1+i%4))%W, y=hz*.3+((i*53.7+Math.sin(t+i)*20)%(H*.6)); g.fillStyle='rgba(255,215,120,'+(.35+.35*Math.sin(t*3+i))+')'; g.fillRect(x,y,2,2); } }
  if(FX && G.flash>0){ g.fillStyle='rgba(235,240,255,'+(G.flash*.45)+')'; g.fillRect(0,0,W,H); }
  // overlays
  if(G.st==='charging'){ const bw=Math.min(240,W*.4), bxx=(W-bw)/2, byy=H-34; g.fillStyle='rgba(5,14,20,.7)'; rr(bxx-4,byy-4,bw+8,22,8); g.fill();
    const grd=g.createLinearGradient(bxx,0,bxx+bw,0); grd.addColorStop(0,'#7fc8a9'); grd.addColorStop(.8,'#ffc94d'); grd.addColorStop(1,'#ff6a3d'); g.fillStyle=grd; rr(bxx,byy,bw*G.power,14,5); g.fill();
    g.strokeStyle='rgba(255,255,255,.5)'; g.beginPath(); g.moveTo(bxx+bw*farAt(),byy-2); g.lineTo(bxx+bw*farAt(),byy+16); g.stroke();
    const inHot = G.hot && Math.abs(G.power-G.hot.p)<=G.hot.r;
    g.fillStyle=inHot?'#ffc94d':'#e6efe8'; g.font='700 12px system-ui'; g.textAlign='center'; g.fillText(inHot?'Over the hotspot: release!':G.power>farAt()?'Far cast: better fish':'Cast power', W/2, byy-9);
    const x=castX(G.power); g.strokeStyle=inHot?'rgba(255,201,77,.95)':'rgba(255,106,61,.6)'; g.setLineDash([4,4]); g.beginPath(); g.ellipse(x,waterY(x),10,3,0,0,7); g.stroke(); g.setLineDash([]); }
  if(G.st==='bite'){ const s=1+Math.sin(t*20)*.08; const pf=G.pend, fl=S.gear.finder; let col='#ffc94d', lab='';
    if(fl>=1 && pf){ col = pf.kind==='fish' ? RAR[pf.sp.r].c : pf.kind==='hat' ? '#ffc94d' : '#c8b8a0'; if(fl>=3) lab = pf.kind==='fish' ? (fl>=5?pf.sp.name:RAR[pf.sp.r].k) : pf.kind==='hat'?'Something wearable':'Junk'; }
    g.save(); g.translate(G.bob.x,G.bob.y-34); g.scale(s,s); g.fillStyle=col; g.font='800 34px "Bricolage Grotesque", system-ui'; g.textAlign='center'; g.fillText('!',0,0); g.restore();
    const left=clamp((G.biteEnd-G.waitT)/hookWin(),0,1); g.fillStyle='rgba(255,201,77,.9)'; rr(G.bob.x-20,G.bob.y-26,40*left,4,2); g.fill();
    if(lab){ g.font='700 12px system-ui'; g.textAlign='center'; const tw=g.measureText(lab).width; g.fillStyle='rgba(5,14,20,.75)'; rr(G.bob.x-tw/2-7,G.bob.y-72,tw+14,18,9); g.fill(); g.fillStyle=col; g.fillText(lab,G.bob.x,G.bob.y-59); } }
  if(G.st==='reeling') drawFightHUD(t);
  else if(G.st==='frenzy') drawFrenzyHUD(t);
  else { drawSceneChip(p,wx);
    if(S.streak>=2){ const txt='Streak '+S.streak+'  ·  +'+Math.round(Math.min(streakCap(),.05*S.streak)*100)+'% XP'; g.font='700 12px system-ui'; const tw=g.measureText(txt).width;
    g.fillStyle='rgba(5,14,20,.7)'; rr(W-tw-34,12,tw+20,24,12); g.fill(); g.fillStyle=S.streak>=10?'#ffc94d':'#e6efe8'; g.textAlign='left'; g.fillText(txt,W-tw-24,28); }
    if(G.st!=='charging' && S.settings.boostsOnScreen){ const bs=activeBuffs().slice(0,4); g.font='700 11px system-ui'; g.textAlign='left'; let yy=H-12; const now2=Date.now();
      for(const b of bs){ const txt=fmtB(b.k,b.v)+'  '+mmss(Math.ceil((b.until-now2)/1000)); const tw=g.measureText(txt).width; g.fillStyle='rgba(5,14,20,.7)'; rr(10,yy-15,tw+16,20,10); g.fill(); g.fillStyle='#7fc8a9'; g.fillText(txt,18,yy-1); yy-=24; } } }
}
function rr(x,y,w,h,r){ g.beginPath(); g.roundRect ? g.roundRect(x,y,Math.max(0,w),h,r) : g.rect(x,y,Math.max(0,w),h); }
function drawFightHUD(t){
  const x=W-30, y0=H*.12, y1=H*.84, h=y1-y0, ten=clamp(G.ten/100,0,1);
  g.fillStyle='rgba(5,14,20,.75)'; rr(x-8,y0-26,26,h+44,9); g.fill();
  g.fillStyle='rgba(255,84,104,.18)'; g.fillRect(x-2,y0,14,h*.2);
  const c = ten>.8 ? '#ff5468' : ten>.55 ? '#ffc94d' : '#7fc8a9'; g.fillStyle=c; const shake = ten>.85 ? Math.sin(t*60)*1.5 : 0;
  g.fillRect(x-2+shake,y1-h*ten,14,h*ten);
  g.fillStyle='#e6efe8'; g.font='700 10px system-ui'; g.textAlign='center'; g.fillText('LINE',x+5,y0-12);
  const px=14, py=14, pw=Math.min(260,W*.46); g.fillStyle='rgba(5,14,20,.75)'; rr(px,py,pw,72,10); g.fill();
  const msg = G.ev==='jump' ? 'It jumped! Let go!' : G.ev==='shake' ? 'Head shake! Ease off' : G.run ? 'It’s running! Ease off' : G.temper>1.7&&G.hold ? 'It’s getting angry! Let go a moment' : G.hold ? 'Reeling…' : 'Hold to reel';
  g.fillStyle = (G.ev||G.run||G.temper>1.7) ? '#ffc94d' : '#e6efe8'; g.textAlign='left'; g.font='800 15px "Bricolage Grotesque", system-ui'; g.fillText(msg, px+10, py+20);
  g.font='700 12px system-ui'; g.fillStyle='#8aa5a2'; g.fillText(Math.max(0,G.d).toFixed(1)+' m out', px+10, py+38);
  const bw=pw*.5-50; g.fillText('Fight', px+pw*.5, py+38); g.fillStyle='#0a161d'; rr(px+pw*.5+44,py+30,bw,7,3); g.fill(); g.fillStyle='#ff6a3d'; rr(px+pw*.5+44,py+30,bw*G.sta,7,3); g.fill();
  g.fillStyle='#8aa5a2'; g.fillText(BEH[G.fish.beh]?BEH[G.fish.beh].n:'', px+10, py+56); g.fillText('Temper', px+pw*.5, py+56); g.fillStyle='#0a161d'; rr(px+pw*.5+44,py+48,bw,7,3); g.fill(); g.fillStyle=G.temper>1.7?'#ff5468':'#c38bff'; rr(px+pw*.5+44,py+48,bw*clamp(G.temper/3,0,1),7,3); g.fill();
  const lim = clamp(G.d/G.maxOut,0,1); g.fillStyle='#0a161d'; rr(px+10,py+63,pw-20,4,2); g.fill(); g.fillStyle = lim>.8?'#ff5468':'#5aa9ff'; rr(px+10,py+63,(pw-20)*lim,4,2); g.fill();
}
function drawTank(now){ const cnv=$('tankcv'); if(!cnv) return; const r=cnv.getBoundingClientRect(); const w=r.width, h=r.height; if(!w) return;
  if(cnv.width!==Math.round(w*DPR)){ cnv.width=Math.round(w*DPR); cnv.height=Math.round(h*DPR); }
  const c=cnv.getContext('2d'); c.setTransform(DPR,0,0,DPR,0,0); const t=now/1000;
  drawTankBack(c,w,h,t);
  S.tank.forEach((f,i)=>{ const sp=SPI[f.id]; const rel=clamp((f.kg-sp.min)/(sp.max-sp.min),0,1); const L=26+rel*16+sp.r*5; const spd=.18+(i*.071)%.25;
    const ph=t*spd+i*1.9; const x=w*(.5+.42*Math.sin(ph)); const dir=Math.cos(ph)>=0; const y=h*(.16+((i*.137)%0.6))+Math.sin(t*1.3+i)*6;
    drawCreature(c,sp,x,y,L,{shiny:!!f.sh,wag:t*8+i,flip:!dir}); });
  c.fillStyle='rgba(220,245,255,.35)'; for(let i=0;i<12;i++){ const x=(i*73)%w+Math.sin(t+i)*4, y=h-((t*30+i*40)%h); c.beginPath(); c.arc(x,y,1.5+(i%3),0,7); c.fill(); }
  drawTankFront(c,w,h,t);
}
