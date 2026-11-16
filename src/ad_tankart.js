
// =====================================================================
// 0.3 decoration overhaul, part 2: tank decorations with more detail and a little life.
// Tank decor space: sand at y=0, the tank is about 230 units tall.
// =====================================================================
const TANK_ART={
  bigclam(c,t){ const op=.25+.25*(1+Math.sin(t*.6)); const sh=(y0,y1,a,b)=>{ const g=c.createLinearGradient(0,y0,0,y1); g.addColorStop(0,a); g.addColorStop(1,b); return g; };
    c.fillStyle=sh(-26,0,'#e0c0f0','#9a70b8'); c.beginPath(); c.ellipse(0,-10,36,12,0,0,Math.PI); c.ellipse(0,-10,36,5,0,Math.PI,0,true); c.fill();
    if(typeof v3glow==='function') v3glow(c,0,-16,30,'rgba(240,240,255,.9)',.25+op*.5); c.fillStyle='#ffffff'; c.beginPath(); c.arc(0,-16,8,0,7); c.fill(); c.fillStyle='rgba(200,220,255,.8)'; c.beginPath(); c.arc(-2.4,-18.4,2.6,0,7); c.fill();
    c.save(); c.translate(-34,-12); c.rotate(-op); c.fillStyle=sh(-24,0,'#f0d8ff','#b890d0'); c.beginPath(); c.moveTo(0,0); c.quadraticCurveTo(34,-34,68,0); c.closePath(); c.fill(); c.strokeStyle='rgba(120,80,150,.45)'; c.lineWidth=1.6;
    for(let i=1;i<6;i++){ const x=i*11.3; c.beginPath(); c.moveTo(34,-2); c.lineTo(x,-(x*(68-x))/68*.95); c.stroke(); } c.restore(); },
  coral(c,t){ const br=(x,y,a,len,w,d)=>{ if(d>3||len<6) return; const sw=Math.sin(t*1.2+d+x*.05)*.06, x2=x+Math.cos(a+sw)*len, y2=y+Math.sin(a+sw)*len; c.strokeStyle=d%2?'#ff8aa8':'#ff6a8a'; c.lineWidth=w; c.lineCap='round'; c.beginPath(); c.moveTo(x,y); c.lineTo(x2,y2); c.stroke();
      if(d>=2){ c.fillStyle='#ffd0dc'; c.beginPath(); c.arc(x2,y2,w*.7,0,7); c.fill(); } br(x2,y2,a-.45,len*.72,w*.75,d+1); br(x2,y2,a+.4,len*.68,w*.75,d+1); };
    br(0,0,-Math.PI/2,32,9,0); },
  chest(c,t){ const R=(x,y,w,h,cl)=>{ c.fillStyle=cl; c.fillRect(x,y,w,h); }; R(-32,-28,64,28,'#7a4a24'); R(-32,-28,64,4,'#5a3416'); for(const x of [-26,-2,22]) R(x,-28,4,28,'#c8963a'); const op=.35+.12*Math.sin(t*.8);
    if(typeof v3glow==='function') v3glow(c,0,-34,34,'rgba(255,215,110,.9)',.5); c.fillStyle='#ffd23a'; for(let i=0;i<9;i++){ c.beginPath(); c.arc(-22+i*5.5,-29-Math.sin(i*1.7)*3,3.4,0,7); c.fill(); }
    c.fillStyle='#e83a4a'; c.beginPath(); c.moveTo(-6,-36); c.lineTo(-3,-32); c.lineTo(-6,-28); c.lineTo(-9,-32); c.closePath(); c.fill();
    c.save(); c.translate(-32,-28); c.rotate(-op); c.fillStyle='#8a5a30'; c.beginPath(); c.moveTo(0,0); c.lineTo(0,-6); c.quadraticCurveTo(32,-24,64,-6); c.lineTo(64,0); c.closePath(); c.fill(); c.fillStyle='#c8963a'; c.fillRect(6,-14,4,14); c.fillRect(54,-12,4,12); c.restore();
    c.fillStyle='rgba(255,250,220,'+(.5+.5*Math.sin(t*3))+')'; c.fillRect(8,-40,3,3); c.fillRect(-14,-44,2.4,2.4); },
  castle(c,t){ const R=(x,y,w,h,cl)=>{ c.fillStyle=cl; c.fillRect(x,y,w,h); }; R(-34,-42,68,42,'#d8c08a'); R(-42,-66,22,66,'#e4cc96'); R(20,-66,22,66,'#e4cc96'); for(const bx of [-42,-31,20,31]) R(bx,-72,9,8,'#e4cc96');
    c.strokeStyle='rgba(140,110,60,.35)'; c.lineWidth=1; for(let y=-60;y<0;y+=8){ c.beginPath(); c.moveTo(-42,y); c.lineTo(42,y); c.stroke(); } c.fillStyle='#5a3a20'; c.beginPath(); c.moveTo(-9,0); c.lineTo(-9,-16); c.arc(0,-16,9,Math.PI,0); c.lineTo(9,0); c.fill();
    R(-35,-52,6,9,'#3a2a20'); R(29,-52,6,9,'#3a2a20'); for(const fx of [-31,31]){ R(fx-.8,-92,1.6,22,'#6a5a4a'); c.fillStyle='#d8302a'; c.beginPath(); c.moveTo(fx+.8,-92); for(let i=0;i<=6;i++) c.lineTo(fx+.8+i*2.4,-92+Math.sin(t*3-i)*1.2+i*.2); for(let i=6;i>=0;i--) c.lineTo(fx+.8+i*2.4,-85+Math.sin(t*3-i)*1.2+i*.2); c.fill(); } },
  anchor(c,t){ c.strokeStyle='#5a6068'; c.lineWidth=7; c.lineCap='round'; c.beginPath(); c.moveTo(0,-72); c.lineTo(0,-10); c.moveTo(-15,-58); c.lineTo(15,-58); c.stroke(); c.beginPath(); c.arc(0,-26,24,Math.PI*.12,Math.PI*.88); c.stroke();
    c.fillStyle='#5a6068'; for(const s of [-1,1]){ c.beginPath(); c.moveTo(s*24,-18); c.lineTo(s*30,-26); c.lineTo(s*18,-24); c.closePath(); c.fill(); } c.strokeStyle='#5a6068'; c.lineWidth=4; c.beginPath(); c.arc(0,-78,6,0,7); c.stroke();
    c.strokeStyle='#c8a060'; c.lineWidth=2.4; for(let i=0;i<5;i++){ c.beginPath(); c.moveTo(-5,-50+i*5); c.lineTo(5,-47+i*5); c.stroke(); } c.fillStyle='rgba(160,90,40,.35)'; for(let i=0;i<8;i++){ c.beginPath(); c.arc(-3+((i*7)%9),-66+i*7,1.6,0,7); c.fill(); } },
  shell(c,t){ const g=c.createLinearGradient(0,-48,0,0); g.addColorStop(0,'#ffd0dc'); g.addColorStop(1,'#e08aa0'); c.fillStyle=g; c.beginPath(); c.moveTo(-34,0); for(let i=1;i<=8;i++){ const a=Math.PI*(1+i/8), am=a-Math.PI/16; c.quadraticCurveTo(Math.cos(am)*40,Math.sin(am)*48,Math.cos(a)*34,Math.sin(a)*42); } c.closePath(); c.fill();
    c.strokeStyle='rgba(180,90,110,.5)'; c.lineWidth=1.6; for(let i=1;i<8;i++){ const a=Math.PI*(1+i/8); c.beginPath(); c.moveTo(0,-2); c.lineTo(Math.cos(a)*33,Math.sin(a)*40); c.stroke(); } c.fillStyle='#e8a0b4'; c.fillRect(-9,-4,18,6); c.fillStyle='rgba(255,255,255,.35)'; c.beginPath(); c.ellipse(-10,-30,8,3,-.6,0,7); c.fill(); },
  starfish(c,t){ for(const [sx,sy,cl,s,ph] of [[-18,-8,'#ff7a5a',1.2,0],[10,-6,'#ffb04a',.95,1],[0,-17,'#ff9ad0',.7,2]]){ c.save(); c.translate(sx,sy); c.scale(s,s); c.rotate(Math.sin(t*.3+ph)*.05); c.fillStyle=cl; c.beginPath(); for(let i=0;i<10;i++){ const a=-Math.PI/2+i*Math.PI/5, r=i%2?4.4:12; c.lineTo(Math.cos(a)*r,Math.sin(a)*r); } c.closePath(); c.fill();
    c.fillStyle='rgba(255,255,255,.55)'; for(let i=0;i<5;i++){ const a=-Math.PI/2+i*Math.PI*2/5; for(let k=1;k<4;k++){ c.beginPath(); c.arc(Math.cos(a)*k*2.8,Math.sin(a)*k*2.8,.8,0,7); c.fill(); } } c.restore(); } },
  couch(c,t){ const RR=(x,y,w,h,r,cl)=>{ c.fillStyle=cl; c.beginPath(); c.roundRect?c.roundRect(x,y,w,h,r):c.rect(x,y,w,h); c.fill(); }; RR(-46,-52,92,26,8,'#b8452a'); RR(-44,-30,88,22,6,'#c8553a'); RR(-52,-42,14,34,6,'#a83a22'); RR(38,-42,14,34,6,'#a83a22');
    for(const x of [-42,-14,14]) RR(x,-34,28,10,4,'#d8664a'); c.fillStyle='#5a3020'; c.fillRect(-42,-8,6,8); c.fillRect(36,-8,6,8); c.fillStyle='#ffd84a'; c.beginPath(); c.arc(-24,-40,7,0,7); c.fill(); c.fillStyle='#3a8ae8'; c.beginPath(); c.arc(22,-40,6,0,7); c.fill(); },
  gardenbench(c,t){ const RR=(x,y,w,h,r,cl)=>{ c.fillStyle=cl; c.beginPath(); c.roundRect?c.roundRect(x,y,w,h,r):c.rect(x,y,w,h); c.fill(); }; for(const y of [-34,-26]) RR(-30,y,60,5,2,'#a8744a'); for(const y of [-18,-13]) RR(-32,y,64,4,2,'#a8744a');
    c.fillStyle='#3a3a3a'; for(const x of [-26,22]) c.fillRect(x,-36,3,36); c.fillRect(-28,-11,57,2); },
  skull(c,t){ c.fillStyle='#ece6d6'; c.beginPath(); c.arc(0,-28,22,0,7); c.fill(); c.beginPath(); if(c.roundRect) c.roundRect(-13,-14,26,14,3); else c.rect(-13,-14,26,14); c.fill(); c.fillStyle='#1a1a1a'; c.beginPath(); c.ellipse(-8,-28,6,7,0,0,7); c.ellipse(8,-28,6,7,0,0,7); c.fill(); c.beginPath(); c.moveTo(0,-20); c.lineTo(-3,-14); c.lineTo(3,-14); c.fill();
    for(let i=-2;i<=2;i++) c.fillRect(i*5-1,-8,2,8); c.fillStyle='rgba(120,160,90,.6)'; c.beginPath(); c.ellipse(-12,-44,8,4,-.4,0,7); c.fill(); c.strokeStyle='#4a8a4a'; c.lineWidth=1.6; c.beginPath(); c.moveTo(-14,-46); c.quadraticCurveTo(-20+Math.sin(t)*2,-60,-16,-72); c.stroke();
    if(typeof v3glow==='function'){ v3glow(c,-8,-28,7,'rgba(120,255,200,.8)',.25+.2*Math.sin(t*2)); v3glow(c,8,-28,7,'rgba(120,255,200,.8)',.25+.2*Math.sin(t*2+1)); } },
};
const _decorNew_0 = decorNew;
decorNew = function(c,id,x,y,s,t){ const f=TANK_ART[id]; if(f){ c.save(); c.translate(x,y); c.scale(s,s); f(c,t||0); c.restore(); return true; } return _decorNew_0(c,id,x,y,s,t); };
