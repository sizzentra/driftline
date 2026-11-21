// =====================================================================
// Phones and tablets, round 8: the fish fight is easy to watch (director, 2026-11-18: "right now the fish fight is too hard to watch on
// top of watching your line breaking on mobile. Fix that too").
// Before: the fish was a faint shadow, the line meter a tall bar at the far right edge and the fight info a panel in the top-left
// corner, so your eyes jumped across the whole screen while the line could snap. Now everything is where the action is:
//  - a TENSION RING around the fish: it fills with the line's tension, green / yellow / red, and shakes and glows near breaking
//  - the instruction right above it ("Hold to reel", "It's running! Ease off", "It jumped! Let go!"), in big clear letters
//  - a small card under it: how far out the fish is, its Fight and Temper, and how much line is out
//  - a soft light under the fish so its shape stands out on any water, day or night
// The card and the words stay inside the water and clear of the corner buttons wherever the fish swims. Same game rules.
// =====================================================================
{ const _df=drawFightHUD;
  drawFightHUD=function(t){ if(!MOB()||!G.fish||!G.bob) return _df.apply(this,arguments);
    const ten=clamp(G.ten/100,0,1), danger=ten>.8, warn=ten>.55, col=danger?'#ff5468':warn?'#ffc94d':'#7fe3c4';
    const r=clamp(H*.085,24,44), shake=ten>.85?Math.sin(t*60)*2:0;
    const cx=clamp(G.bob.x+14+shake, r+10, W-r-10), cy=clamp(G.bob.y+12, r+56, H-r-70);
    g.save();
    /* soft light under the fish */
    const gl=g.createRadialGradient(cx,cy,2,cx,cy,r*1.25); gl.addColorStop(0,'rgba(200,240,255,.28)'); gl.addColorStop(1,'rgba(200,240,255,0)'); g.fillStyle=gl; g.beginPath(); g.arc(cx,cy,r*1.25,0,7); g.fill();
    /* the tension ring */
    g.lineCap='round'; g.lineWidth=Math.max(5,r*.2);
    g.strokeStyle='rgba(5,14,20,.55)'; g.beginPath(); g.arc(cx,cy,r,0,7); g.stroke();
    /* the danger glow: a soft wider ring underneath instead of shadowBlur (director, 2026-11-18: Android drops during actions; a
       glow shadow is one of the slowest things a phone graphics chip draws, and it pulsed every frame of a tense fight) */
    if(danger){ const a0=-Math.PI/2, a1=-Math.PI/2+Math.PI*2*Math.max(.02,ten), lw=g.lineWidth, pulse=.5+.5*Math.sin(t*14); g.strokeStyle='rgba(255,84,104,'+(.18+.12*pulse)+')'; g.lineWidth=lw+8+pulse*5; g.beginPath(); g.arc(cx,cy,r,a0,a1); g.stroke(); g.strokeStyle='rgba(255,84,104,'+(.28+.12*pulse)+')'; g.lineWidth=lw+3; g.beginPath(); g.arc(cx,cy,r,a0,a1); g.stroke(); g.lineWidth=lw; }
    g.strokeStyle=col; g.beginPath(); g.arc(cx,cy,r,-Math.PI/2,-Math.PI/2+Math.PI*2*Math.max(.02,ten)); g.stroke();
    g.fillStyle='rgba(255,84,104,.35)'; g.beginPath(); g.arc(cx,cy,r+g.lineWidth*.5+2,-Math.PI/2+Math.PI*2*.8,-Math.PI/2+Math.PI*2,false); g.arc(cx,cy,r+g.lineWidth*.5+5,-Math.PI/2+Math.PI*2,-Math.PI/2+Math.PI*2*.8,true); g.fill(); /* the red zone: snapping risk */
    /* the instruction, right above */
    const odd = G.fish&&G.fish.kind!=='fish', msg = odd ? (G.ev==='snag' ? 'Snagged!' : danger ? 'Ease off!' : 'Dead Weight') : G.swT>0 ? 'Second wind!' : G.ev==='windup' ? 'It’s jumping!' : G.ev==='jump' ? 'Let go!' : G.ev==='shake' ? 'Head shake!' : G.run ? 'It’s running!' : G.temper>1.7&&G.hold ? 'Careful!' : danger ? 'Ease off!' : G.hold ? 'Reeling…' : 'Hold to reel';
    const alert = !!(G.ev||G.run||G.temper>1.7||G.swT>0||danger);
    g.font='800 '+(W<700?15:17)+'px "Bricolage Grotesque", system-ui'; g.textAlign='center'; g.textBaseline='alphabetic';
    const mw=g.measureText(msg).width+22, mx=clamp(cx,mw/2+8,W-mw/2-8), my=Math.max(48,cy-r-16);
    g.fillStyle=alert?'rgba(40,24,6,.82)':'rgba(5,14,20,.78)'; rr(mx-mw/2,my-19,mw,27,13.5); g.fill();
    if(alert){ g.strokeStyle='#ffc94d99'; g.lineWidth=1.5; rr(mx-mw/2,my-19,mw,27,13.5); g.stroke(); }
    g.fillStyle=alert?'#ffd36a':'#ffffff'; g.fillText(msg,mx,my);
    /* the card: distance, fight, temper, line out */
    const cw=164, ch=46, below=cy+r+12, kx=clamp(cx-cw/2,8,W-cw-8), ky=below+ch<=H-62?below:Math.max(8,my-19-ch-8);
    g.fillStyle='rgba(5,14,20,.8)'; rr(kx,ky,cw,ch,10); g.fill();
    g.textAlign='left'; g.font='800 12px system-ui'; g.fillStyle='#e6efe8'; g.fillText(Math.max(0,G.d).toFixed(1)+' m',kx+9,ky+17);
    g.font='700 10px system-ui'; g.fillStyle='#8aa5a2'; g.fillText('Fight',kx+62,ky+13); g.fillText('Temper',kx+62,ky+29);
    const bx=kx+104, bw=cw-114; g.fillStyle='#0a161d'; rr(bx,ky+7,bw,6,3); g.fill(); rr(bx,ky+23,bw,6,3); g.fill();
    g.fillStyle='#ff6a3d'; rr(bx,ky+7,Math.max(2,bw*clamp(G.sta,0,1)),6,3); g.fill();
    g.fillStyle=G.temper>1.7?'#ff5468':'#c38bff'; rr(bx,ky+23,Math.max(2,bw*clamp(G.temper/3,0,1)),6,3); g.fill();
    const lim=clamp(G.d/G.maxOut,0,1); g.fillStyle='#0a161d'; rr(kx+9,ky+36,cw-18,4,2); g.fill(); g.fillStyle=lim>.8?'#ff5468':'#5aa9ff'; rr(kx+9,ky+36,Math.max(2,(cw-18)*lim),4,2); g.fill();
    g.font='700 10px system-ui'; g.fillStyle='#8aa5a2'; g.fillText((BEH[G.fish.beh]?BEH[G.fish.beh].n:'').slice(0,10),kx+9,ky+30);
    g.restore(); }; }
