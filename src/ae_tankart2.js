
// =====================================================================
// 0.3 decoration overhaul, part 3: the older tank pieces get the same care (shading, detail, a little life).
// Same space as TANK_ART: sand at y=0, footprints match the old drawings so placement stays the same.
// =====================================================================
(function(){
  const lg=(c,x0,y0,x1,y1,st)=>{ const g=c.createLinearGradient(x0,y0,x1,y1); st.forEach((s,i)=>g.addColorStop(i/(st.length-1),s)); return g; };
  const RR=(c,x,y,w,h,r,f)=>{ c.fillStyle=f; c.beginPath(); if(c.roundRect) c.roundRect(x,y,w,h,r); else c.rect(x,y,w,h); c.fill(); };
  const glow=(c,x,y,r,col,a)=>{ if(typeof v3glow==='function') v3glow(c,x,y,r,col,a); };
  const bubbles=(c,t,x,y,n,h,sp)=>{ c.strokeStyle='rgba(225,245,255,.7)'; c.lineWidth=1.2; for(let i=0;i<n;i++){ const k=(t*sp+i/n)%1; c.globalAlpha=1-k; c.beginPath(); c.arc(x+Math.sin(k*8+i*2)*4,y-k*h,1.4+k*2.4,0,7); c.stroke(); } c.globalAlpha=1; };
  Object.assign(TANK_ART,{
    volcano(c,t){ c.fillStyle=lg(c,-44,0,44,0,['#4a2a1c','#94583a','#6a3a26','#3e2216']); c.beginPath(); c.moveTo(-46,0); c.quadraticCurveTo(-26,-26,-11,-62); c.lineTo(11,-62); c.quadraticCurveTo(26,-26,46,0); c.closePath(); c.fill();
      c.strokeStyle='rgba(30,14,8,.35)'; c.lineWidth=2; for(const [a,b] of [[-7,-28],[5,24],[-1,-4]]){ c.beginPath(); c.moveTo(a,-60); c.quadraticCurveTo((a+b)/2+3,-30,b,0); c.stroke(); }
      c.fillStyle='#6a7a4a'; for(const [x,y,r] of [[-30,-6,4],[-24,-4,3],[28,-5,4],[34,-3,3]]){ c.beginPath(); c.arc(x,y,r,Math.PI,0); c.fill(); }
      const gl=.6+.4*Math.sin(t*2.2); glow(c,0,-63,24,'rgba(255,140,40,.95)',.45*gl);
      c.fillStyle='#ff8a1e'; c.beginPath(); c.ellipse(0,-62,11,3.4,0,0,7); c.fill();
      c.fillStyle='#ffa83a'; c.beginPath(); c.moveTo(-9,-62); c.quadraticCurveTo(-13,-50,-17,-42+1.5*Math.sin(t)); c.quadraticCurveTo(-14,-40,-12,-44); c.quadraticCurveTo(-9,-52,-4,-61); c.closePath(); c.fill();
      c.beginPath(); c.moveTo(5,-61); c.quadraticCurveTo(9,-54,11,-49+1.2*Math.sin(t+1)); c.quadraticCurveTo(13,-48,13,-51); c.quadraticCurveTo(11,-57,9,-62); c.closePath(); c.fill();
      bubbles(c,t,0,-66,5,90,.35); },
    goldcastle(c,t){ const gold=(x0,x1)=>lg(c,x0,0,x1,0,['#c8901a','#ffe27a','#e8b636','#b07a12']);
      c.fillStyle=gold(-26,26); c.fillRect(-26,-42,52,42); for(let i=0;i<5;i++){ c.fillRect(-26+i*11.5,-48,7,6); }
      c.strokeStyle='rgba(150,100,10,.35)'; c.lineWidth=1; for(let y=-36;y<0;y+=7){ c.beginPath(); c.moveTo(-26,y); c.lineTo(26,y); c.stroke(); }
      for(const s of [-1,1]){ const x=s*31; c.fillStyle=gold(x-11,x+11); c.fillRect(x-11,-64,22,64); c.strokeStyle='rgba(150,100,10,.35)'; for(let y=-56;y<0;y+=7){ c.beginPath(); c.moveTo(x-11,y); c.lineTo(x+11,y); c.stroke(); }
        c.fillStyle='#d83a3a'; c.beginPath(); c.moveTo(x-14,-64); c.lineTo(x,-90); c.lineTo(x+14,-64); c.closePath(); c.fill(); c.fillStyle='#a82626'; c.beginPath(); c.moveTo(x,-90); c.lineTo(x+14,-64); c.lineTo(x,-64); c.closePath(); c.fill();
        c.fillStyle='#ffe27a'; c.beginPath(); c.arc(x,-91,2.2,0,7); c.fill();
        glow(c,x,-46,9,'rgba(255,240,170,.9)',.35+.15*Math.sin(t*1.5+s)); c.fillStyle='#3a2a10'; c.beginPath(); c.moveTo(x-3.5,-40); c.lineTo(x-3.5,-48); c.arc(x,-48,3.5,Math.PI,0); c.lineTo(x+3.5,-40); c.fill(); c.fillStyle='rgba(255,230,140,.85)'; c.fillRect(x-2,-46,4,5); }
      c.fillStyle='#4a3010'; c.beginPath(); c.moveTo(-9,0); c.lineTo(-9,-15); c.arc(0,-15,9,Math.PI,0); c.lineTo(9,0); c.fill(); c.strokeStyle='#ffe27a'; c.lineWidth=2; c.beginPath(); c.moveTo(-9,0); c.lineTo(-9,-15); c.arc(0,-15,9,Math.PI,0); c.lineTo(9,0); c.stroke();
      c.fillStyle='#3a8ae8'; c.beginPath(); c.arc(0,-31,3.4,0,7); c.fill(); c.fillStyle='rgba(255,255,255,.7)'; c.beginPath(); c.arc(-1,-32,1.1,0,7); c.fill();
      const fx=-31; c.fillStyle='#6a5a4a'; c.fillRect(fx-.7,-108,1.4,18); c.fillStyle='#3a8ae8'; c.beginPath(); c.moveTo(fx+.7,-108); for(let i=0;i<=5;i++) c.lineTo(fx+.7+i*2.6,-108+Math.sin(t*3-i)*1.1); for(let i=5;i>=0;i--) c.lineTo(fx+.7+i*2.6,-101+Math.sin(t*3-i)*1.1); c.fill(); },
    jellylamp(c,t){ c.fillStyle=lg(c,-14,0,14,0,['#2e2e3a','#6a6a80','#3a3a4a']); c.beginPath(); c.moveTo(-15,0); c.lineTo(-11,-12); c.lineTo(11,-12); c.lineTo(15,0); c.closePath(); c.fill(); c.beginPath(); c.moveTo(-7,-70); c.lineTo(7,-70); c.lineTo(5,-76); c.lineTo(-5,-76); c.closePath(); c.fill();
      const glass=()=>{ c.beginPath(); c.moveTo(-11,-12); c.quadraticCurveTo(-19,-40,-7,-70); c.lineTo(7,-70); c.quadraticCurveTo(19,-40,11,-12); c.closePath(); };
      glow(c,0,-42,40,'rgba(170,120,255,.9)',.32+.12*Math.sin(t*1.3)); glass(); c.fillStyle=lg(c,0,-70,0,-12,['rgba(120,90,255,.75)','rgba(90,60,220,.85)']); c.fill();
      c.save(); glass(); c.clip(); for(let i=0;i<2;i++){ const k=(t*.12+i*.5)%1, y=-18-k*48, x=Math.sin(t*.7+i*3)*4, pu=1+.18*Math.sin(t*2.4+i);
        c.fillStyle='rgba(255,170,220,.9)'; c.beginPath(); c.ellipse(x,y,6*pu,4.2/pu,0,Math.PI,0); c.fill(); c.strokeStyle='rgba(255,190,230,.75)'; c.lineWidth=1; for(let j=-2;j<=2;j++){ c.beginPath(); c.moveTo(x+j*2.2,y); c.quadraticCurveTo(x+j*2.2+Math.sin(t*3+j)*1.6,y+5,x+j*2,y+9); c.stroke(); } } c.restore();
      c.fillStyle='rgba(255,255,255,.28)'; c.beginPath(); c.ellipse(-8,-40,1.8,16,.12,0,7); c.fill(); },
    diver(c,t){ RR(c,-11,-8,9,8,2,'#3a3a40'); RR(c,2,-8,9,8,2,'#3a3a40');
      RR(c,-12,-34,24,28,7,lg(c,-12,0,12,0,['#3a5a72','#5a82a0','#344e64'])); c.fillStyle='#8a5a2a'; c.fillRect(-12,-18,24,4); c.fillStyle='#d8b050'; c.fillRect(-2,-18,4,4);
      for(const s of [-1,1]){ RR(c,s*12-(s<0?6:0),-32,6,16,3,'#4a6a84'); c.fillStyle='#2a2a30'; c.beginPath(); c.arc(s*15,-15,3,0,7); c.fill(); }
      const hg=c.createRadialGradient(-5,-50,2,0,-44,16); hg.addColorStop(0,'#ffe8a0'); hg.addColorStop(.5,'#d8a040'); hg.addColorStop(1,'#8a5a1a'); c.fillStyle=hg; c.beginPath(); c.arc(0,-46,14,0,7); c.fill();
      RR(c,-13,-35,26,5,2,'#b07a2a'); c.fillStyle='#6a4a1a'; for(const x of [-10,-3.5,3.5,10]){ c.beginPath(); c.arc(x,-32.5,1.1,0,7); c.fill(); }
      c.fillStyle='#c8963a'; c.beginPath(); c.arc(0,-46,7.5,0,7); c.fill(); const pg=c.createRadialGradient(-2,-48,1,0,-46,6.5); pg.addColorStop(0,'#bfe8ff'); pg.addColorStop(1,'#3a6a8a'); c.fillStyle=pg; c.beginPath(); c.arc(0,-46,6,0,7); c.fill(); c.fillStyle='rgba(255,255,255,.6)'; c.beginPath(); c.arc(-2,-48,1.6,0,7); c.fill();
      c.strokeStyle='#5a5a60'; c.lineWidth=2.4; c.beginPath(); c.moveTo(10,-55); c.quadraticCurveTo(22,-66,18+Math.sin(t*.8)*2,-80); c.stroke();
      bubbles(c,t,-6,-60,4,80,.4); },
    toiletthrone(c,t){ const por=(x0,x1)=>lg(c,x0,0,x1,0,['#cfd6da','#ffffff','#e4e8ea','#b8c0c4']);
      RR(c,-23,-66,46,30,6,por(-23,23)); c.fillStyle='#d8b040'; c.fillRect(-23,-58,46,3);
      c.fillStyle=lg(c,0,-86,0,-66,['#ffe27a','#e0a828']); c.beginPath(); c.moveTo(-17,-66); c.lineTo(-17,-78); c.lineTo(-10,-71); c.lineTo(-5,-84); c.lineTo(0,-72); c.lineTo(5,-84); c.lineTo(10,-71); c.lineTo(17,-78); c.lineTo(17,-66); c.closePath(); c.fill();
      for(const [x,y,cl] of [[-5,-84,'#e83a4a'],[5,-84,'#3a8ae8'],[0,-70,'#3ad87a']]){ c.fillStyle=cl; c.beginPath(); c.arc(x,y,2,0,7); c.fill(); }
      c.fillStyle='#d8b040'; RR(c,14,-52,8,3,1.5,'#d8b040');
      RR(c,-10,-18,20,18,4,por(-10,10)); c.fillStyle=por(-28,28); c.beginPath(); c.ellipse(0,-22,28,13,0,0,Math.PI); c.lineTo(-28,-22); c.fill();
      c.fillStyle='#f4f6f7'; c.beginPath(); c.ellipse(0,-23,28,8,0,0,7); c.fill(); c.fillStyle=lg(c,0,-28,0,-18,['#5aa8d0','#9ad8f0']); c.beginPath(); c.ellipse(0,-23,19,5,0,0,7); c.fill();
      c.fillStyle='rgba(255,255,255,.5)'; c.beginPath(); c.ellipse(-12,-58,6,2,0,0,7); c.fill(); },
    mushroomhouse(c,t){ c.fillStyle=lg(c,-16,0,16,0,['#d8c8a0','#fff4dc','#d0bc90']); c.beginPath(); c.moveTo(-15,0); c.quadraticCurveTo(-18,-20,-13,-34); c.lineTo(13,-34); c.quadraticCurveTo(18,-20,15,0); c.closePath(); c.fill();
      c.fillStyle='#7a4a24'; c.beginPath(); c.moveTo(-5,0); c.lineTo(-5,-11); c.arc(0,-11,5,Math.PI,0); c.lineTo(5,0); c.fill(); c.fillStyle='#e8b040'; c.beginPath(); c.arc(3,-6,1,0,7); c.fill();
      glow(c,8,-22,8,'rgba(255,220,130,.9)',.35+.15*Math.sin(t*1.7)); c.fillStyle='#ffd88a'; c.beginPath(); c.arc(8,-22,3.4,0,7); c.fill(); c.strokeStyle='#7a4a24'; c.lineWidth=1.2; c.beginPath(); c.arc(8,-22,3.4,0,7); c.moveTo(4.6,-22); c.lineTo(11.4,-22); c.moveTo(8,-25.4); c.lineTo(8,-18.6); c.stroke();
      c.fillStyle='#e8d8c0'; c.beginPath(); c.ellipse(0,-34,30,5,0,0,7); c.fill(); c.strokeStyle='rgba(150,120,90,.5)'; c.lineWidth=1; for(let i=-6;i<=6;i++){ c.beginPath(); c.moveTo(i*4.4,-33); c.lineTo(i*3,-36); c.stroke(); }
      const cg=c.createRadialGradient(-10,-56,3,0,-44,36); cg.addColorStop(0,'#ff6a5a'); cg.addColorStop(.6,'#d8302a'); cg.addColorStop(1,'#9a1a18'); c.fillStyle=cg; c.beginPath(); c.moveTo(-34,-34); c.quadraticCurveTo(-34,-68,0,-70); c.quadraticCurveTo(34,-68,34,-34); c.quadraticCurveTo(0,-40,-34,-34); c.fill();
      c.fillStyle='#fff4ec'; for(const [x,y,rx,ry] of [[-18,-50,5,3.6],[0,-60,6,4],[17,-48,5,3.4],[-4,-44,3.4,2.4],[26,-38,2.6,2]]){ c.beginPath(); c.ellipse(x,y,rx,ry,0,0,7); c.fill(); }
      c.fillStyle='#6a5a4a'; c.fillRect(18,-74,6,10); c.strokeStyle='rgba(225,240,255,.5)'; bubbles(c,t,21,-76,3,50,.3); },
    pizza(c,t){ c.fillStyle=lg(c,-36,0,36,0,['#e8a838','#ffd060','#e8a838']); c.beginPath(); c.moveTo(0,-74); c.lineTo(-34,-8); c.lineTo(34,-8); c.closePath(); c.fill();
      c.fillStyle='#ffe07a'; c.beginPath(); c.moveTo(-14,-34); c.quadraticCurveTo(-15,-26,-13,-22); c.quadraticCurveTo(-11,-26,-11,-34); c.fill(); c.beginPath(); c.moveTo(12,-30); c.quadraticCurveTo(13,-20,15,-16); c.quadraticCurveTo(17,-22,16,-30); c.fill();
      for(const [x,y,r] of [[0,-50,6],[-14,-24,7],[13,-22,6.4],[-3,-28,4.4]]){ c.fillStyle='#b8302a'; c.beginPath(); c.arc(x,y,r,0,7); c.fill(); c.fillStyle='#d8483a'; c.beginPath(); c.arc(x-r*.2,y-r*.2,r*.7,0,7); c.fill(); c.fillStyle='rgba(255,220,200,.6)'; c.beginPath(); c.arc(x-r*.35,y-r*.35,r*.2,0,7); c.fill(); }
      c.fillStyle='#3a8a3a'; for(const [x,y,a] of [[6,-38,.6],[-8,-44,-.5]]){ c.beginPath(); c.ellipse(x,y,4,2,a,0,7); c.fill(); }
      RR(c,-37,-12,74,12,6,lg(c,0,-12,0,0,['#e0a050','#b06a28'])); c.fillStyle='rgba(255,230,170,.5)'; for(let i=0;i<6;i++){ c.beginPath(); c.ellipse(-28+i*11,-8,3,1.2,0,0,7); c.fill(); } },
    gardenbench(c,t){ c.save(); c.scale(1.4,1.4); const wood=['#8a5a32','#b8804e','#8a5a32'];
      for(const y of [-36,-29]) RR(c,-30,y,60,5,2,lg(c,0,y,0,y+5,wood)); for(const y of [-18,-13]) RR(c,-32,y,64,4,2,lg(c,0,y,0,y+4,wood));
      c.strokeStyle='rgba(70,40,20,.35)'; c.lineWidth=.7; for(const y of [-34,-27,-16]){ c.beginPath(); c.moveTo(-26,y); c.quadraticCurveTo(0,y+.8,26,y); c.stroke(); }
      c.strokeStyle='#2e2e32'; c.lineWidth=2.6; c.lineCap='round'; for(const s of [-1,1]){ const x=s*27; c.beginPath(); c.moveTo(x,0); c.lineTo(x,-38); c.stroke(); c.beginPath(); c.moveTo(x,-12); c.quadraticCurveTo(x+s*7,-14,x+s*6,-22); c.arc(x+s*3.5,-22,2.5,0,s>0?Math.PI:-Math.PI,s<0); c.stroke(); }
      c.lineWidth=1.6; c.beginPath(); c.moveTo(-27,-6); c.lineTo(27,-6); c.stroke(); c.restore(); },
  });
})();
