// =====================================================================
// CIRCUIT LAKE: THE CAPSULE POD (overnight, 2026-11-23; its own design, MAP_THEMES › Circuit Lake: Tokyo and Hong Kong neon streets, retro-
// future art, vending machines, friendly robots). A rounded capsule home hovering on its pad over the neon lake, seen from the side: a pill-
// shaped shell with a big round window glowing from inside, a neon sign on the roof, an antenna with a blinking tip, cables looping down to the
// thrusters, a glowing vending machine beside it; or a noodle stall with a cloth curtain and paper lanterns, or an arcade booth with a screen.
// The pad, thrusters, trim and light keep their ids; the pod and sign are new (the old canopy id is retired).
// =====================================================================
const CP = {
  geo(o){ const C=BH.cab(o,{h:1.05,ratio:1.6}), wh=C.wh, x0=Math.max(HF.x0(),0)+W*.008, w=Math.min(wh*1.7,o.pw*.44), x1=x0+w; return {x0,x1,w,wh,top:C.wallTop-H*.01,mid:(x0+x1)/2}; },
  pod(o,s,c){ const q=o.x, g=CP.geo(o), y=o.dockY, lit=HK.lit(o), r=(y-g.top)*.48;
    if(s===0){ const gr=q.createLinearGradient(0,g.top,0,y); gr.addColorStop(0,HK.n(o,HK.lt(c,.25))); gr.addColorStop(1,HK.n(o,HK.dk(c,.25))); q.fillStyle=gr; q.beginPath(); q.moveTo(g.x0+r,g.top); q.lineTo(g.x1-r,g.top); q.arc(g.x1-r,g.top+r,r,-Math.PI/2,Math.PI/2); q.lineTo(g.x0+r,y); q.arc(g.x0+r,g.top+r,r,Math.PI/2,Math.PI*1.5); q.closePath(); q.fill(); /* the pill-shaped shell */
      q.strokeStyle=v3rgba('#3ae8ff',.8); q.lineWidth=2; q.beginPath(); q.moveTo(g.x0+r,y-H*.006); q.lineTo(g.x1-r,y-H*.006); q.stroke(); q.strokeStyle=v3rgba('#ffffff',.35*lit+.1); q.lineWidth=1.5; q.beginPath(); q.moveTo(g.x0+r,g.top+2); q.lineTo(g.x1-r,g.top+2); q.stroke(); /* an LED strip, a chrome highlight */
      const wx=g.mid+g.w*.12, wy=g.top+r, wr=r*.62; HK.circ(o,wx,wy,wr+3,'#3a3e4a'); HK.circ(o,wx,wy,wr,'#2a1a4a'); o.lights.push({x:wx,y:wy,r:.1,a:.55,small:1,win:[wr*1.4,wr*1.4]}); HK.rect(o,g.x0+r*.4,g.top+r*.5,W*.014,y-g.top-r*.5-H*.008,'#1a1c22'); HK.rect(o,g.x0+r*.4+W*.002,g.top+r*.6,W*.01,H*.004,'#ff4ab8'); } /* a round window glowing from inside, a sliding door with a pink light */
    if(s===1){ HK.rect(o,g.x0,g.top+H*.02,g.w,y-g.top-H*.02,'#2a1c22'); HK.rect(o,g.x0-W*.006,g.top,g.w+W*.012,H*.022,c); for(let X=g.x0,k=0;X<g.x1;X+=W*.012,k++) HK.rect(o,X,g.top+H*.022,W*.011,(y-g.top)*.45,k%2?'#e84a4a':'#f0e8d4'); for(let k=0;k<4;k++){ const lx=g.x0+g.w*(k+.5)/4; HK.ell(o,lx,g.top+H*.035,W*.005,H*.01,'#ff6a3a'); } HK.rect(o,g.x0,y-H*.03,g.w,H*.03,'#5a3a2a'); o.lights.push({x:g.mid,y:g.top+H*.04,r:.1,a:.5}); } /* a noodle stall: cloth curtain strips, red lanterns, a counter */
    if(s===2){ HK.rect(o,g.x0,g.top,g.w,y-g.top,'#1a1c22'); HK.rect(o,g.x0+g.w*.15,g.top+H*.02,g.w*.7,(y-g.top)*.45,v3rgba(c,.85)); for(let k=0;k<5;k++) HK.rect(o,g.x0+g.w*(.2+k*.12),g.top+H*.03+(k%2)*H*.01,g.w*.06,H*.008,'#7aff4a'); HK.rect(o,g.x0+g.w*.2,y-H*.035,g.w*.6,H*.012,'#3a3e4a'); HK.circ(o,g.x0+g.w*.35,y-H*.04,H*.004,'#ff4ab8'); HK.circ(o,g.x0+g.w*.45,y-H*.04,H*.004,'#3ae8ff'); o.lights.push({x:g.mid,y:g.top+H*.05,r:.1,a:.5,win:[g.w*.7,(y-g.top)*.45]}); } /* an arcade booth with its screen and buttons */
    HK.line(o,[g.x1-g.w*.2,g.top,g.x1-g.w*.2,g.top-H*.05],'#c8ccd8',1.5); HK.circ(o,g.x1-g.w*.2,g.top-H*.05,H*.004,'#ff4a4a'); /* an antenna (its tip blinks in front) */
    const vx=g.x1+W*.008; HK.rect(o,vx,y-H*.07,W*.022,H*.07,'#c8ccd8'); HK.rect(o,vx+W*.002,y-H*.066,W*.018,H*.04,v3rgba('#3ae8ff',.7)); for(let k=0;k<6;k++) HK.rect(o,vx+W*.004+(k%3)*W*.005,y-H*.062+Math.floor(k/3)*H*.018,W*.003,H*.01,['#ff4ab8','#7aff4a','#f0c84a'][k%3]); HK.rect(o,vx+W*.004,y-H*.02,W*.014,H*.008,'#1a1c22'); o.lights.push({x:vx+W*.011,y:y-H*.046,r:.08,a:.45,small:1}); /* a glowing vending machine */
    o.top=Math.min(o.top==null?y-H*.23:o.top,g.top-H*.08); },
  /* the neon sign on the roof */
  sign(o,s,c){ const q=o.x, g=CP.geo(o), sy=g.top-H*.035, txt=['NOODLES','OPEN 24/7','RAMEN ♥'][s]; HK.rect(o,g.x0+g.w*.1,sy-H*.004,g.w*.55,H*.03,'#1a1c22'); HK.line(o,[g.x0+g.w*.2,sy+H*.026,g.x0+g.w*.2,g.top],'#3a3e4a',1.5); HK.line(o,[g.x0+g.w*.55,sy+H*.026,g.x0+g.w*.55,g.top],'#3a3e4a',1.5);
    q.fillStyle=HK.n(o,c); q.font='bold '+Math.round(H*.018)+'px sans-serif'; q.fillText(txt,g.x0+g.w*.13,sy+H*.02); o.lights.push({x:g.x0+g.w*.37,y:sy+H*.012,r:.12,a:.5,small:1}); }
};
