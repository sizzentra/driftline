
// =====================================================================
// Driftline 0.3: the angler, rebuilt in the B2 style (preview only until 0.3 ships).
// Same skeleton anchors as before (head centre (0,-56), radius 7.5, feet at 0) so every
// hat (origin = head centre), beard and pair of glasses still fits exactly. Torso is a
// shaped path; shirt patterns and outfits are clipped to it, so everything follows the body.
// =====================================================================
function a3TorsoPath(c,f){ c.beginPath();
  if(f){ c.moveTo(-7.2,-45.6); c.quadraticCurveTo(-7.9,-38.5,-6.3,-33.5); c.quadraticCurveTo(-8.4,-28.5,-7.7,-23.6); c.lineTo(7.7,-23.6); c.quadraticCurveTo(8.4,-28.5,6.5,-33.5); c.quadraticCurveTo(8.8,-39,7.5,-45.6); c.quadraticCurveTo(0,-48,-7.2,-45.6); }
  else { c.moveTo(-7.7,-45.6); c.quadraticCurveTo(-8.9,-35,-7.5,-23.6); c.lineTo(7.6,-23.6); c.quadraticCurveTo(9.3,-35,7.9,-45.6); c.quadraticCurveTo(0,-48.4,-7.7,-45.6); }
  c.closePath(); }
// a longer coat silhouette reaching hemY, flaring slightly
function a3CoatPath(c,f,hemY){ c.beginPath(); c.moveTo(f?-7.4:-7.9,-45.8); c.quadraticCurveTo(f?-8.2:-9.1,-36,-8.8,-26); c.lineTo(-9.8,hemY); c.quadraticCurveTo(0,hemY+1.6,9.8,hemY); c.lineTo(9,-26); c.quadraticCurveTo(f?9:9.5,-36,f?7.7:8.1,-45.8); c.quadraticCurveTo(0,-48.6,f?-7.4:-7.9,-45.8); c.closePath(); }
function a3Shade(c,pathFn,D){ c.save(); pathFn(); c.clip(); const sg=c.createLinearGradient(-9,0,9,0); sg.addColorStop(0,'rgba(10,8,20,.28)'); sg.addColorStop(.45,'rgba(10,8,20,0)'); sg.addColorStop(.85,'rgba(255,230,190,0)'); sg.addColorStop(1,'rgba(255,225,185,.32)'); c.fillStyle=sg; c.fillRect(-11,-50,22,40); c.restore(); }
function a3Sleeve(lk,D,shirt){ const o=lk.outfit, oc=D(lk.outCol||'#d8a020');
  switch(o){ case 'raincoat': case 'hoodie': case 'puffer': case 'sweater': case 'cardigan': case 'captain': case 'lumberjack': return o==='captain'?D(lk.outCol||'#1a2a4a'):o==='lumberjack'?D(lk.outCol||'#b8342a'):oc;
    case 'wetsuit': return D('#1c1c26'); case 'spacesuit': return D('#e8ecf0'); case 'tidecoat': return D('#1a3a5a'); case 'bathrobe': return D(lk.outCol||'#f0e6f4'); case 'pajamas': return D(lk.outCol||'#7a9ad8'); default: return shirt; } }
function a3Legs(lk,D){ const o=lk.outfit; if(o==='wetsuit') return D('#1c1c26'); if(o==='spacesuit') return D('#e8ecf0'); if(o==='overalls') return D(lk.outCol||'#3a6f9a'); if(o==='pajamas') return D(lk.outCol||'#7a9ad8'); return D(lk.pants); }

function drawAngler3(c,x,y,s,lk,o={}){
  const night=o.night||0, D=cl=>night?mix(cl,'#0a1018',night*.45):cl, t=o.t||0, f=lk.g==='f';
  const skin=SKINS[lk.skin]||SKINS[1], sk=D(skin), skD=D(mix(skin,'#5a2a1a',.22)), hairC=HAIRS[lk.hair]||HAIRS[1], hair=D(hairC), shirt=D(lk.shirt);
  const hs = !lk.hairStyle||lk.hairStyle==='auto' ? (f?'long':'short') : lk.hairStyle;
  const scene=(o.t!=null && c===g)||!!o.forceSt; const st=o.forceSt||(scene?G.st:'idle');
  const mood = !scene ? 'calm' : st==='bite' ? 'surprised' : st==='reeling' ? 'focus' : (st==='landing'||(G.lastCatchT&&performance.now()-G.lastCatchT<1800)) ? 'happy' : 'calm';
  const br=Math.sin(t*2.1)*.35, blink=((t+.7)%3.9)<.12;
  const hx=o.hx==null?9:o.hx, hy=o.hy==null?-35:o.hy;
  const legC=a3Legs(lk,D), sleeve=a3Sleeve(lk,D,shirt), cuffC=D(mix(lk.pants||'#3a4a6a','#000000',.25));
  c.save(); c.translate(x,y); c.scale(s,s); c.lineCap='round'; c.lineJoin='round';
  // ---- legs: back leg darker, knees, crease, cuffs; boots with soles and laces
  const leg=(hx0,ax,col)=>{ c.fillStyle=col; c.beginPath(); c.moveTo(hx0-3.1,-24.4); c.lineTo(hx0+3.1,-24.4); c.quadraticCurveTo(ax+3.1,-14,ax+2.5,-4.6); c.lineTo(ax-2.5,-4.6); c.quadraticCurveTo(ax-3.2,-14,hx0-3.1,-24.4); c.closePath(); c.fill();
    if(lk.outfit==='pajamas'){ c.save(); c.clip(); c.fillStyle=D('#f4f0f8'); for(let xx=hx0-4;xx<hx0+5;xx+=2.4) c.fillRect(xx,-25,.9,21); c.restore(); }
    c.strokeStyle='rgba(0,0,0,.18)'; c.lineWidth=.45; c.beginPath(); c.moveTo(ax+.6,-21); c.quadraticCurveTo(ax+1.1,-13,ax+.8,-6); c.stroke(); };
  leg(-3,-3.6,D(mix(a3Legs(lk,x=>x),'#000000',.2))); leg(2.6,3.1,legC);
  if(lk.outfit!=='wetsuit'&&lk.outfit!=='spacesuit'){ c.fillStyle=cuffC; c.fillRect(-6.1,-6,5,1.6); c.fillRect(.6,-6,5,1.6); }
  const boot=(bx,dark)=>{ const bc=D(dark?'#22170f':'#2e2015'); c.fillStyle=bc; c.beginPath(); c.moveTo(bx-3.2,-5); c.lineTo(bx+1.6,-5); c.quadraticCurveTo(bx+6.2,-3.6,bx+5.8,-.4); c.lineTo(bx-3.4,-.4); c.closePath(); c.fill();
    c.fillStyle=D('#120c08'); c.fillRect(bx-3.6,-.9,9.6,1); c.fillStyle=D('#c9a070'); c.fillRect(bx-.6,-4.4,.7,.7); c.fillRect(bx+1.2,-4,.7,.7); c.fillStyle='rgba(255,230,200,.18)'; c.beginPath(); c.ellipse(bx+3.4,-3.2,1.4,.6,-.3,0,7); c.fill(); };
  boot(-3.8,true); boot(2.6,false);
  // ---- upper body leans around the hips (charging, cast, fight, landing); both hands stay on the rod
  const pw=st==='charging'?(o.pow!=null?o.pow:(G.power||0)):0, ten=o.ten!=null?o.ten:scene?clamp((G.ten||0)/100,0,1):0;
  const lean=!scene?0: st==='charging'?-.14*pw : st==='flying'?.08 : st==='reeling'?-.06-ten*.06+(G.run?Math.sin(t*11)*.015:0) : st==='landing'?-.05 : 0;
  const lc=Math.cos(lean), ls=Math.sin(lean), toBody=(px,py)=>{ const dy=py+24; return {x:px*lc+dy*ls, y:-px*ls+dy*lc-24}; };
  const HH=toBody(hx,hy), BH=toBody(hx-5.5,hy+4.6);
  c.save(); c.translate(0,-24); c.rotate(lean); c.translate(0,24);
  // ---- back hair (behind the upper body)
  if(hs==='long'){ c.fillStyle=hair; c.beginPath(); c.moveTo(-7.4,-60); c.quadraticCurveTo(-12.4,-50,-9.6,-42.5); c.quadraticCurveTo(-6,-41.6,-2.4,-43.6); c.lineTo(-2.4,-58); c.closePath(); c.fill(); c.strokeStyle=D(mix(hairC,'#000000',.3)); c.lineWidth=.45; c.beginPath(); c.moveTo(-8.6,-56); c.quadraticCurveTo(-10.6,-50,-8.8,-44); c.moveTo(-6,-55); c.quadraticCurveTo(-7.4,-50,-6,-44.5); c.stroke(); }
  if(hs==='ponytail'){ const sw=Math.sin(t*1.6)*.12; c.save(); c.translate(-7.4,-58.5); c.rotate(.55+sw); c.fillStyle=hair; c.beginPath(); c.ellipse(0,5.2,2.4,6.2,0,0,7); c.fill(); c.strokeStyle=D(mix(hairC,'#000000',.3)); c.lineWidth=.4; c.beginPath(); c.moveTo(-.6,1.6); c.quadraticCurveTo(-1,6,0,10.4); c.stroke(); c.fillStyle=D('#c8553a'); c.fillRect(-1.5,-.4,3,1.6); c.restore(); }
  if(hs==='bun'){ c.fillStyle=hair; c.beginPath(); c.arc(-3.2,-65.2,3.5,0,7); c.fill(); c.strokeStyle=D(mix(hairC,'#000000',.3)); c.lineWidth=.4; c.beginPath(); c.arc(-3.2,-65.2,2,.4,3.4); c.stroke(); }
  // ---- back arm (behind the body), hand on the reel below the front hand
  const bh=BH;
  c.strokeStyle=D(mix(sleeve,'#000000',.18)); c.lineWidth=4.2; c.beginPath(); c.moveTo(-3.6,-43.6); c.quadraticCurveTo(-3.2,-34.5,bh.x-1.4,bh.y+.6); c.stroke();
  c.fillStyle=skD; c.beginPath(); c.arc(bh.x,bh.y,2.1,0,7); c.fill();
  // ---- torso (or coat), pattern clipped to the body, outfit, shading
  const coat=['raincoat','captain','tidecoat','bathrobe'].includes(lk.outfit), hem={raincoat:-16,captain:-14.5,tidecoat:-16,bathrobe:-12}[lk.outfit];
  c.save(); c.translate(0,br*.3);
  c.fillStyle=shirt; a3TorsoPath(c,f); c.fill();
  if(lk.pat&&lk.pat!=='none'){ c.save(); a3TorsoPath(c,f); c.clip(); drawPattern(c,lk.pat,shirt,-10,-49,20,27); c.restore(); }
  drawOutfit3(c,lk,D,f,t);
  a3Shade(c,()=>coat?a3CoatPath(c,f,hem):a3TorsoPath(c,f),D);
  // belt (hidden under long coats and full suits)
  if(!coat&&!['wetsuit','spacesuit','overalls','puffer','bathrobe','pajamas','apron'].includes(lk.outfit)){ c.fillStyle=D('#3a2a1a'); c.fillRect(-7.6,-25.6,15.3,2.3); c.fillStyle=D('#d8b060'); c.fillRect(1.2,-25.9,3,2.9); c.fillStyle=D('#3a2a1a'); c.fillRect(2,-25.1,1.4,1.3); }
  c.restore();
  // ---- neck and head
  c.fillStyle=skD; c.fillRect(-1.9,-50.2,4,5.4); c.fillStyle=sk; c.fillRect(-.6,-50.2,2.7,5);
  c.save(); c.translate(0,br*.2);
  c.fillStyle=sk; c.beginPath(); c.arc(0,-56,7.5,0,7); c.fill(); c.beginPath(); c.ellipse(1.9,-51.9,5.4,3.5,.1,0,7); c.fill();
  c.fillStyle='rgba(120,50,30,.12)'; c.beginPath(); c.arc(-1.2,-55,6.6,Math.PI*.55,Math.PI*1.25); c.fill();
  c.fillStyle='rgba(255,235,210,.28)'; c.beginPath(); c.arc(1.4,-57.6,5.8,-1.2,.35); c.lineTo(1.4,-57.6); c.fill();
  // ear
  c.fillStyle=sk; c.beginPath(); c.ellipse(-1.8,-55.4,1.8,2.3,0,0,7); c.fill(); c.fillStyle=skD; c.beginPath(); c.ellipse(-1.6,-55.3,.85,1.25,0,0,7); c.fill();
  // nose
  c.fillStyle=sk; c.beginPath(); c.ellipse(7.5,-55.4,1.45,1.25,0,0,7); c.fill(); c.strokeStyle=skD; c.lineWidth=.45; c.beginPath(); c.arc(7.3,-55.1,1.1,-.2,1.8); c.stroke();
  // blush
  c.fillStyle='rgba(240,120,110,.28)'; c.beginPath(); c.ellipse(3.6,-53.6,1.8,1,0,0,7); c.fill();
  // eyes and brows
  const ex=4.4, ey=-57, browY=mood==='surprised'?-60.6:mood==='focus'?-59.4:-60;
  if(blink && mood!=='surprised'){ c.strokeStyle=D('#1a1410'); c.lineWidth=.6; c.beginPath(); c.moveTo(ex-1.1,ey+.2); c.quadraticCurveTo(ex,ey+.7,ex+1.1,ey+.2); c.stroke(); }
  else if(mood==='happy'){ c.strokeStyle=D('#1a1410'); c.lineWidth=.65; c.beginPath(); c.arc(ex,ey+.5,1.1,Math.PI*1.1,Math.PI*1.9); c.stroke(); }
  else { c.fillStyle=D('#1a1410'); c.beginPath(); c.ellipse(ex,ey,mood==='surprised'?1.15:1,mood==='surprised'?1.45:1.3,0,0,7); c.fill(); c.fillStyle='rgba(255,255,255,.9)'; c.beginPath(); c.arc(ex+.35,ey-.45,.38,0,7); c.fill(); }
  if(f && !blink){ c.strokeStyle=D('#1a1410'); c.lineWidth=.55; c.beginPath(); c.moveTo(ex+.8,ey-.9); c.lineTo(ex+1.6,ey-1.6); c.stroke(); }
  c.strokeStyle=D(mix(hairC,'#000000',.15)); c.lineWidth=.75; c.beginPath(); c.moveTo(ex-1.5,browY+.25); c.quadraticCurveTo(ex,browY-(mood==='focus'?-.2:.45),ex+1.6,browY+.15); c.stroke();
  // mouth
  c.strokeStyle=D('#7a2e24'); c.fillStyle=D('#7a2e24'); c.lineWidth=.6;
  if(mood==='happy'){ c.beginPath(); c.moveTo(3.8,-53.2); c.quadraticCurveTo(5.6,-50.6,7,-53.1); c.closePath(); c.fill(); c.fillStyle='#ffffff'; c.fillRect(4.3,-53.2,2.2,.5); }
  else if(mood==='surprised'){ c.beginPath(); c.ellipse(5.5,-52.6,.75,.95,0,0,7); c.fill(); }
  else if(mood==='focus'){ c.beginPath(); c.moveTo(4.4,-52.7); c.lineTo(6.4,-52.9); c.stroke(); }
  else { c.beginPath(); c.moveTo(4.1,-53); c.quadraticCurveTo(5.4,-52,6.7,-53.1); c.stroke(); }
  // beard and glasses (same anchors as before, so they fit)
  drawFace(c,lk,D,hair);
  // front hair
  drawHair3(c,hs,hair,hairC,D,t);
  // hat (origin = head centre)
  c.save(); c.translate(0,-56); drawHat(c,lk.hat,D(lk.hatCol),t); c.restore();
  c.restore();
  // ---- front arm over the body: shoulder, elbow, hand on the rod
  const hx2=HH.x, hy2=HH.y, el={x:(3.6+hx2)/2+2.2, y:(-43.4+hy2)/2+2.6};
  c.strokeStyle=sleeve; c.lineWidth=4.5; c.beginPath(); c.moveTo(3.6,-43.6); c.quadraticCurveTo(el.x,el.y,hx2-1.2,hy2+.4); c.stroke();
  c.strokeStyle='rgba(255,230,190,.25)'; c.lineWidth=1; c.beginPath(); c.moveTo(4.8,-43); c.quadraticCurveTo(el.x+1.2,el.y-.6,hx2-.8,hy2-.9); c.stroke();
  c.fillStyle=sk; c.beginPath(); c.arc(hx2,hy2,2.4,0,7); c.fill(); c.fillStyle=skD; c.beginPath(); c.ellipse(hx2+1.5,hy2-1.3,.9,.6,-.6,0,7); c.fill();
  c.restore(); c.restore();
}

function drawHair3(c,hs,hair,hairC,D,t){
  const dk=D(mix(hairC,'#000000',.3)), lt=D(mix(hairC,'#ffffff',.25));
  const cap=(fr)=>{ c.fillStyle=hair; c.beginPath(); c.arc(0,-57,7.95,Math.PI*.98,Math.PI*1.99); c.quadraticCurveTo(7.6,-59.4,6.4,-60.2); c.quadraticCurveTo(4.2,-58.8,1.6,-59.6); c.quadraticCurveTo(-1.6,-59,-2.6,-56.4); c.lineTo(-2.8,-52.6); c.lineTo(-6.6,-53.4); c.closePath(); c.fill();
    c.strokeStyle=lt; c.lineWidth=.6; c.beginPath(); c.arc(0,-57.4,6.4,Math.PI*1.25,Math.PI*1.6); c.stroke(); };
  switch(hs){
    case 'short': cap(); break;
    case 'long': cap(); c.fillStyle=hair; c.beginPath(); c.moveTo(-2.8,-56); c.quadraticCurveTo(-4.6,-50,-3.4,-46); c.lineTo(-5.8,-46.6); c.quadraticCurveTo(-7,-51,-6.6,-55); c.closePath(); c.fill(); break;
    case 'ponytail': case 'bun': cap(); c.fillStyle=hair; c.fillRect(-7.2,-60,1.4,1); break;
    case 'buzz': c.save(); c.globalAlpha*=.8; c.fillStyle=hair; c.beginPath(); c.arc(0,-56.6,7.85,Math.PI*1.02,Math.PI*1.97); c.quadraticCurveTo(4,-59.6,0,-59.4); c.quadraticCurveTo(-2.4,-58.6,-2.6,-55); c.lineTo(-6.8,-54.6); c.closePath(); c.fill(); c.restore(); break;
    case 'curly': c.fillStyle=hair; for(let i=0;i<10;i++){ const a=Math.PI*(1.02+i*.11); c.beginPath(); c.arc(Math.cos(a)*7.2,-57+Math.sin(a)*7,2.6,0,7); c.fill(); } c.beginPath(); c.arc(-6.6,-53.4,2.4,0,7); c.arc(-4.6,-55,2.2,0,7); c.fill();
      c.strokeStyle=lt; c.lineWidth=.45; for(let i=0;i<6;i++){ const a=Math.PI*(1.1+i*.15); c.beginPath(); c.arc(Math.cos(a)*7.2,-57+Math.sin(a)*7,1.4,Math.PI*1.1,Math.PI*1.8); c.stroke(); } break;
    case 'spiky': cap(); c.fillStyle=hair; c.beginPath(); for(let i=0;i<6;i++){ const x0=-7+i*2.7; c.moveTo(x0-1.7,-61.6); c.lineTo(x0+.6,-68.2+((i*5)%3)); c.lineTo(x0+1.7,-61.6); } c.fill(); c.strokeStyle=lt; c.lineWidth=.4; c.beginPath(); for(let i=0;i<6;i++){ const x0=-7+i*2.7; c.moveTo(x0,-62); c.lineTo(x0+.5,-66.6+((i*5)%3)); } c.stroke(); break;
    case 'bald': c.fillStyle='rgba(255,255,255,.22)'; c.beginPath(); c.ellipse(2,-61.4,2.6,1.1,-.3,0,7); c.fill(); break;
    default: cap();
  }
}

// ---------- outfits, shaped to the body ----------
function drawOutfit3(c,lk,D,f,t){ const o=lk.outfit||'none'; if(o==='none') return; const base=lk.outCol, oc=D(base||'#d8a020');
  const dk=v=>D(mix(base||v,'#000000',.22)), lt2=v=>D(mix(base||v,'#ffffff',.3));
  const torso=()=>a3TorsoPath(c,f), clipT=fn=>{ c.save(); torso(); c.clip(); fn(); c.restore(); };
  const R=(x,y,w,h,cl)=>{ c.fillStyle=cl; c.fillRect(x,y,w,h); };
  const pocket=(x,y,w,h,cl,fl)=>{ R(x,y,w,h,cl); R(x-.2,y-.2,w+.4,1.2,fl); c.fillStyle=D('#d8c090'); c.beginPath(); c.arc(x+w/2,y+.5,.32,0,7); c.fill(); };
  switch(o){
    case 'vest': { const col=D(base||'#6a7a4a'), d2=dk('#6a7a4a'); clipT(()=>{ c.fillStyle=col; c.beginPath(); c.moveTo(-10,-50); c.lineTo(-1.4,-50); c.lineTo(-2,-22); c.lineTo(-10,-22); c.closePath(); c.moveTo(10,-50); c.lineTo(2.6,-50); c.lineTo(2.2,-22); c.lineTo(10,-22); c.closePath(); c.fill();
        pocket(-7.2,-38.5,4,4,d2,D(mix(base||'#6a7a4a','#000000',.35))); pocket(3.4,-38.5,4,4,d2,D(mix(base||'#6a7a4a','#000000',.35))); pocket(-7.2,-31,4,3.6,d2,D(mix(base||'#6a7a4a','#000000',.35))); pocket(3.4,-31,4,3.6,d2,D(mix(base||'#6a7a4a','#000000',.35)));
        c.strokeStyle=D('#e8d8a0'); c.lineWidth=.35; c.setLineDash([.8,.7]); c.beginPath(); c.moveTo(-1.8,-45); c.lineTo(-2.2,-23); c.moveTo(2.8,-45); c.lineTo(2.4,-23); c.stroke(); c.setLineDash([]); c.fillStyle=D('#c8c8d0'); c.beginPath(); c.arc(5.4,-41.2,.9,0,7); c.fill(); }); break; }
    case 'lifejacket': { const col=D(base||'#ff7a2a'); clipT(()=>{ c.fillStyle=col; c.beginPath(); c.moveTo(-10,-50); c.lineTo(-1.2,-50); c.quadraticCurveTo(-2.6,-36,-1.4,-23); c.lineTo(-10,-23); c.closePath(); c.moveTo(10,-50); c.lineTo(2.2,-50); c.quadraticCurveTo(3.6,-36,2.4,-23); c.lineTo(10,-23); c.closePath(); c.fill();
        c.strokeStyle=D(mix(base||'#ff7a2a','#000000',.25)); c.lineWidth=.5; for(const yy of [-41,-35,-29]){ c.beginPath(); c.moveTo(-9,yy); c.quadraticCurveTo(-5,yy+1,-1.8,yy); c.moveTo(2.8,yy); c.quadraticCurveTo(6,yy+1,9,yy); c.stroke(); }
        R(-10,-34.4,20,1.8,D('#262630')); R(-10,-28.6,20,1.8,D('#262630')); R(-.6,-35,2.4,3,D('#c8c8d0')); R(-.6,-29.2,2.4,3,D('#c8c8d0')); c.fillStyle='rgba(255,255,255,.75)'; R(5.6,-44,2.6,.9,c.fillStyle); }); break; }
    case 'hoodie': { const col=oc; clipT(()=>{ R(-10,-50,20,28,col); R(-4.4,-33,9,6,dk('#d8a020')); c.strokeStyle=dk('#d8a020'); c.lineWidth=.4; c.beginPath(); c.moveTo(-4.4,-27.2); c.lineTo(4.6,-27.2); c.stroke(); R(-10,-24.8,20,1.4,dk('#d8a020')); });
      c.fillStyle=col; c.beginPath(); c.ellipse(-4.6,-47.4,4.6,2.8,-.25,0,7); c.fill(); c.fillStyle=dk('#d8a020'); c.beginPath(); c.ellipse(-4,-47.2,3,1.6,-.25,0,7); c.fill();
      c.strokeStyle=D('#f4f0e8'); c.lineWidth=.5; c.beginPath(); c.moveTo(1.4,-46); c.lineTo(1.8,-39.6); c.moveTo(3.4,-46); c.lineTo(3.8,-40.4); c.stroke(); c.fillStyle=D('#f4f0e8'); c.beginPath(); c.arc(1.8,-39.4,.4,0,7); c.arc(3.8,-40.2,.4,0,7); c.fill(); break; }
    case 'raincoat': { const col=D(base||'#f2c230'); c.fillStyle=col; a3CoatPath(c,f,-16); c.fill(); c.strokeStyle=dk('#f2c230'); c.lineWidth=.55; c.beginPath(); c.moveTo(.4,-45); c.lineTo(.6,-16.4); c.stroke();
      for(let i=0;i<4;i++){ c.fillStyle=D('#3a3a44'); c.beginPath(); c.arc(1.9,-41.5+i*6.2,.6,0,7); c.fill(); }
      pocket(-7.6,-28,4.2,4.4,dk('#f2c230'),D(mix(base||'#f2c230','#000000',.32))); pocket(3.8,-28,4.2,4.4,dk('#f2c230'),D(mix(base||'#f2c230','#000000',.32)));
      c.fillStyle=col; c.beginPath(); c.moveTo(-6.4,-47.2); c.lineTo(.2,-42.6); c.lineTo(6.6,-47.2); c.lineTo(5.4,-49.4); c.lineTo(-5.2,-49.4); c.closePath(); c.fill(); c.strokeStyle=dk('#f2c230'); c.beginPath(); c.moveTo(-6.4,-47.2); c.lineTo(.2,-42.6); c.lineTo(6.6,-47.2); c.stroke(); break; }
    case 'overalls': { const den=D(base||'#3a6f9a'), d2=dk('#3a6f9a'); clipT(()=>{ R(-10,-26,20,4,den); c.fillStyle=den; c.beginPath(); c.moveTo(-5.2,-38); c.lineTo(5.4,-38); c.lineTo(6,-23); c.lineTo(-5.8,-23); c.closePath(); c.fill(); R(-2.2,-34.6,4.6,3.6,d2);
        c.strokeStyle=D('#e8c060'); c.lineWidth=.32; c.setLineDash([.7,.6]); c.strokeRect(-2.2,-34.6,4.6,3.6); c.setLineDash([]); });
      c.strokeStyle=den; c.lineWidth=1.8; c.beginPath(); c.moveTo(-4.6,-38); c.lineTo(-5.6,-46.2); c.moveTo(4.8,-38); c.lineTo(5.2,-46.4); c.stroke(); c.fillStyle=D('#f2cf5a'); c.beginPath(); c.arc(-4.5,-38.4,.8,0,7); c.arc(4.7,-38.4,.8,0,7); c.fill(); break; }
    case 'puffer': { const col=oc, d2=dk('#d8a020'); c.fillStyle=col; c.beginPath(); c.moveTo(-9.6,-46.2); c.quadraticCurveTo(-10.6,-34,-9.6,-21.6); c.quadraticCurveTo(0,-20.4,9.8,-21.6); c.quadraticCurveTo(10.8,-34,9.8,-46.2); c.quadraticCurveTo(0,-49,-9.6,-46.2); c.fill();
      c.strokeStyle=d2; c.lineWidth=.6; for(let yy=-41.5;yy<-22;yy+=4.6){ c.beginPath(); c.moveTo(-10,yy); c.quadraticCurveTo(0,yy+1.4,10.2,yy); c.stroke(); } R(.1,-46.6,.8,25,D('#e8e8ee')); c.fillStyle=col; c.beginPath(); c.ellipse(.4,-46.8,7.4,2.2,0,0,7); c.fill(); c.strokeStyle=d2; c.beginPath(); c.ellipse(.4,-46.8,7.4,2.2,0,0,Math.PI); c.stroke(); break; }
    case 'wetsuit': { const w=D('#1c1c26'); clipT(()=>{ R(-10,-50,20,28,w); R(-10,-41,20,1.8,oc); R(-10,-25.8,20,1.4,oc); }); c.fillStyle=oc; c.fillRect(-6.1,-12.6,5,1.4); c.fillRect(.6,-12.6,5,1.4); R(.5,-47,.8,9,D('#8a8a9a')); break; }
    case 'captain': { const n=D(base||'#1a2a4a'); c.fillStyle=n; a3CoatPath(c,f,-14.5); c.fill(); c.strokeStyle=D(mix(base||'#1a2a4a','#ffffff',.15)); c.lineWidth=.5; c.beginPath(); c.moveTo(-.4,-44); c.lineTo(-.6,-15); c.stroke();
      for(let i=0;i<4;i++){ c.fillStyle=D('#f2c84a'); c.beginPath(); c.arc(-2.4,-41+i*5.8,.65,0,7); c.arc(2.4,-41+i*5.8,.65,0,7); c.fill(); }
      c.fillStyle=D('#f2c84a'); c.fillRect(4.6,-46.6,4.4,1.6); for(let k=0;k<4;k++) c.fillRect(5+k*1.05,-45,.5,1.8); c.fillStyle=n; c.beginPath(); c.moveTo(-6,-47.4); c.lineTo(0,-42.4); c.lineTo(6.2,-47.4); c.lineTo(5,-49.2); c.lineTo(-4.8,-49.2); c.closePath(); c.fill(); c.fillStyle=D('#f4f4f2'); c.beginPath(); c.moveTo(-2,-47.6); c.lineTo(0,-44); c.lineTo(2.2,-47.6); c.closePath(); c.fill(); break; }
    case 'spacesuit': { const s2=D('#e8ecf0'); clipT(()=>{ R(-10,-50,20,28,s2); R(-10,-27,20,1.8,D('#d8603a')); }); R(-4.2,-40.4,8.4,6,D('#5a6a7a')); R(-3.4,-39.4,2.2,2,D('#ff5a4a')); R(.4,-39.4,2.2,2,D('#5aff9a')); R(-3.4,-36.6,6,.8,D('#9ad8ff'));
      c.strokeStyle=D('#b8c0c8'); c.lineWidth=.4; c.beginPath(); c.moveTo(-7,-14); c.lineTo(-1.4,-14); c.moveTo(.6,-14); c.lineTo(6.2,-14); c.stroke(); c.fillStyle=D('#c8d0d8'); c.beginPath(); c.ellipse(0,-46.6,7,1.8,0,0,7); c.fill(); break; }
    case 'cardigan': { const col=oc; clipT(()=>{ c.fillStyle=col; c.beginPath(); c.moveTo(-10,-50); c.lineTo(-1.6,-50); c.lineTo(-.6,-22); c.lineTo(-10,-22); c.closePath(); c.moveTo(10,-50); c.lineTo(3.2,-50); c.lineTo(1.6,-22); c.lineTo(10,-22); c.closePath(); c.fill(); R(-10,-24.6,20,2.2,dk('#d8a020'));
        c.strokeStyle=dk('#d8a020'); c.lineWidth=.3; for(let xx=-9;xx<10;xx+=1.2){ c.beginPath(); c.moveTo(xx,-24.6); c.lineTo(xx,-22.4); c.stroke(); } });
      for(let i=0;i<4;i++){ c.fillStyle=D('#f4ecd8'); c.beginPath(); c.arc(-.2+i*.25,-41+i*4.8,.55,0,7); c.fill(); } pocket(3.6,-31,3.8,3.4,dk('#d8a020'),dk('#d8a020')); break; }
    case 'sweater': { const col=oc, l3=lt2('#d8a020'); clipT(()=>{ R(-10,-50,20,28,col); c.fillStyle=l3; c.beginPath(); for(let xx=-9;xx<10;xx+=3){ c.moveTo(xx,-38.4); c.lineTo(xx+1.5,-36.6); c.lineTo(xx+3,-38.4); c.lineTo(xx+1.5,-40.2); } c.fill();
        c.fillStyle=dk('#d8a020'); c.fillRect(-10,-24.9,20,2.6); c.strokeStyle=D(mix(base||'#d8a020','#000000',.32)); c.lineWidth=.3; for(let xx=-9;xx<10;xx+=1.1){ c.beginPath(); c.moveTo(xx,-24.9); c.lineTo(xx,-22.4); c.stroke(); }
        c.strokeStyle='rgba(0,0,0,.08)'; c.lineWidth=.35; for(let xx=-9;xx<10;xx+=1.6){ c.beginPath(); c.moveTo(xx,-48); c.lineTo(xx,-41); c.moveTo(xx,-35); c.lineTo(xx,-25); c.stroke(); } });
      c.fillStyle=dk('#d8a020'); c.beginPath(); c.ellipse(.6,-46.4,6.4,1.8,0,0,7); c.fill(); break; }
    case 'apron': { const col=D(base||'#e8e0d0'); c.fillStyle=col; c.beginPath(); c.moveTo(-5,-41); c.lineTo(5.6,-41); c.lineTo(6.6,-18); c.quadraticCurveTo(.6,-17,-5.6,-18); c.closePath(); c.fill();
      c.strokeStyle=col; c.lineWidth=.9; c.beginPath(); c.moveTo(-4.4,-41); c.lineTo(-2.2,-47.4); c.moveTo(5,-41); c.lineTo(3,-47.6); c.stroke(); pocket(-2.2,-33.6,5,3.8,dk('#e8e0d0'),dk('#e8e0d0')); c.strokeStyle=dk('#e8e0d0'); c.lineWidth=.5; c.beginPath(); c.moveTo(-7.6,-26.4); c.lineTo(-5.4,-26.4); c.moveTo(6.4,-26.4); c.lineTo(8.2,-26.4); c.stroke(); break; }
    case 'tidecoat': { const n=D('#1a3a5a'); c.fillStyle=n; a3CoatPath(c,f,-16); c.fill(); const glow=D('#5ad8e8'); c.strokeStyle=glow; c.lineWidth=1.1; c.beginPath(); for(let xx=-9.6;xx<=9.6;xx+=.6) c.lineTo(xx,-21.4+Math.sin(xx*.9+t*2)*1.1); c.stroke();
      c.lineWidth=.7; c.beginPath(); c.moveTo(.2,-45.6); c.lineTo(.4,-22.6); c.stroke(); c.save(); c.globalAlpha*=.35; c.lineWidth=2.4; c.beginPath(); for(let xx=-9.6;xx<=9.6;xx+=.6) c.lineTo(xx,-21.4+Math.sin(xx*.9+t*2)*1.1); c.stroke(); c.restore();
      c.fillStyle=n; c.beginPath(); c.moveTo(-6.2,-47.2); c.lineTo(.2,-42.8); c.lineTo(6.4,-47.2); c.lineTo(5.2,-49.4); c.lineTo(-5,-49.4); c.closePath(); c.fill(); break; }
    case 'bathrobe': { const col=D(base||'#f0e6f4'), d2=dk('#f0e6f4'); c.fillStyle=col; a3CoatPath(c,f,-12); c.fill();
      c.fillStyle=d2; c.beginPath(); c.moveTo(-5.4,-47); c.quadraticCurveTo(-1,-40,1.4,-33); c.lineTo(3,-33); c.quadraticCurveTo(1.6,-41,6.4,-47); c.lineTo(3.8,-47.6); c.quadraticCurveTo(1.6,-42,1.6,-37); c.quadraticCurveTo(-1.6,-42,-2.6,-47.6); c.closePath(); c.fill();
      R(-9,-29.4,18.6,2.2,d2); c.strokeStyle=d2; c.lineWidth=1; c.beginPath(); c.moveTo(4.4,-28.4); c.lineTo(5.6,-23); c.moveTo(5,-28.4); c.lineTo(7,-24); c.stroke();
      c.fillStyle='rgba(255,255,255,.25)'; for(let i=0;i<14;i++){ c.beginPath(); c.arc(-8+((i*7)%17),-44+((i*11)%30),.5,0,7); c.fill(); } break; }
    case 'pajamas': { const col=D(base||'#7a9ad8'), l3=D('#f4f0f8'); clipT(()=>{ R(-10,-50,20,28,col); c.fillStyle=l3; for(let xx=-9;xx<10;xx+=2.4) c.fillRect(xx,-50,.9,28); });
      for(let i=0;i<4;i++){ c.fillStyle=l3; c.beginPath(); c.arc(1.2,-42+i*5,.5,0,7); c.fill(); } c.fillStyle=col; c.beginPath(); c.moveTo(-5.6,-47.2); c.lineTo(.6,-43.2); c.lineTo(6,-47.2); c.lineTo(5,-48.8); c.lineTo(-4.8,-48.8); c.closePath(); c.fill(); break; }
    case 'lumberjack': { const col=D(base||'#b8342a'), d2=D('#1c1416'); clipT(()=>{ R(-10,-50,20,28,col); c.fillStyle=d2; c.globalAlpha*=.75; for(let xx=-10;xx<10;xx+=4.4) c.fillRect(xx,-50,2,28); for(let yy=-50;yy<-22;yy+=4.4) c.fillRect(-10,yy,20,2); c.globalAlpha/=.75;
        c.fillStyle=d2; for(let xx=-10;xx<10;xx+=4.4) for(let yy=-50;yy<-22;yy+=4.4) c.fillRect(xx,yy,2,2); });
      pocket(-7,-40,4,3.6,col,d2); pocket(3.4,-40,4,3.6,col,d2); c.strokeStyle=d2; c.lineWidth=.5; c.beginPath(); c.moveTo(.6,-45.6); c.lineTo(.8,-23.4); c.stroke(); c.fillStyle=col; c.beginPath(); c.moveTo(-6,-47.2); c.lineTo(.6,-43.6); c.lineTo(6.6,-47.2); c.lineTo(5.4,-49); c.lineTo(-4.8,-49); c.closePath(); c.fill(); break; }
  }
}

// ---------- test-mode contact sheet (only with ?test): every outfit x a spread of looks ----------
if(/[?&]test\b/.test(location.search)){
  window.__anglerSheet=(opts={})=>{
    const looks=opts.looks||[{g:'m',hairStyle:'short',skin:1,hair:1},{g:'f',hairStyle:'long',skin:0,hair:3,glasses:'round'},{g:'m',hairStyle:'buzz',skin:3,hair:0,beard:'beard',glasses:'sunglasses',hat:'cap'},{g:'f',hairStyle:'ponytail',skin:2,hair:5,hat:'bucket'},{g:'m',hairStyle:'curly',skin:4,hair:0,beard:'mustache',glasses:'nerd'},{g:'f',hairStyle:'bun',skin:1,hair:2,glasses:'heart'},{g:'m',hairStyle:'spiky',skin:0,hair:4,glasses:'goggles'},{g:'m',hairStyle:'bald',skin:2,hair:4,beard:'longbeard',glasses:'monocle',hat:'straw'}];
    const outs=(opts.outfits||OUTFITS.map(o=>o[0])).slice(opts.from||0,opts.to||99), cw=opts.cell||150, ch=Math.round(cw*(opts.face?1:1.4)), sc=opts.face?cw/22:ch/82;
    const o=document.createElement('canvas'); o.width=cw*looks.length; o.height=ch*outs.length; const x=o.getContext('2d');
    outs.forEach((out,r)=>looks.forEach((lk0,cI)=>{ const lk=Object.assign({},S.look,{shirt:'#4f86c9',pants:'#3a4a6a',pat:opts.pat||'none',outfit:out,outCol:undefined,hat:'none',glasses:'none',beard:'none'},lk0);
      x.save(); x.beginPath(); x.rect(cI*cw,r*ch,cw,ch); x.clip(); x.fillStyle=(r+cI)%2?'#2e3858':'#283150'; x.fillRect(cI*cw,r*ch,cw,ch);
      drawAngler3(x,cI*cw+cw*(opts.face?.42:.42),r*ch+(opts.face?ch*.5+56*sc:ch*.94),sc,lk,{t:1.3,hx:9,hy:-35}); x.restore(); x.fillStyle='#cfd8ff'; x.font='9px system-ui'; x.fillText(out+' · '+lk0.g+' '+lk0.hairStyle,cI*cw+3,r*ch+10); }));
    window.__post(opts.save||'angler',o.toDataURL()); return outs.length; };
}
if(/[?&]test\b/.test(location.search)){
  window.__poseSheet=(opts={})=>{ const poses=[['idle',{}],['charging',{pow:.5}],['charging',{pow:1}],['flying',{}],['bite',{}],['reeling',{ten:.2}],['reeling',{ten:1}],['landing',{}]];
    const looks=opts.looks||[{g:'m',hairStyle:'short',outfit:'vest',hat:'bucket'},{g:'f',hairStyle:'long',outfit:'raincoat'},{g:'m',hairStyle:'curly',outfit:'captain',beard:'beard',glasses:'round',hat:'cap'}];
    const cw=150, ch=200, sc=ch/84, o=document.createElement('canvas'); o.width=cw*poses.length; o.height=ch*looks.length; const x=o.getContext('2d');
    looks.forEach((lk0,r)=>poses.forEach(([st,ov],cI)=>{ const lk=Object.assign({},S.look,{shirt:'#4f86c9',pants:'#3a4a6a',pat:'none',outCol:undefined,hat:'none',glasses:'none',beard:'none',outfit:'none'},lk0);
      const hx=st==='charging'?7-ov.pow*3:9, hy=st==='charging'?-38-ov.pow*3:st==='reeling'?-34:-35;
      x.save(); x.beginPath(); x.rect(cI*cw,r*ch,cw,ch); x.clip(); x.fillStyle=(r+cI)%2?'#2e3858':'#283150'; x.fillRect(cI*cw,r*ch,cw,ch);
      drawAngler3(x,cI*cw+cw*.4,r*ch+ch*.95,sc,lk,Object.assign({t:1.3,hx,hy,forceSt:st},ov));
      x.strokeStyle='#d9c7a0'; x.lineWidth=2; x.beginPath(); x.moveTo(cI*cw+cw*.4+hx*sc,r*ch+ch*.95+hy*sc); x.lineTo(cI*cw+cw*.95,r*ch+ch*.1); x.stroke(); x.restore();
      x.fillStyle='#cfd8ff'; x.font='10px system-ui'; x.fillText(st+(ov.pow!=null?' '+ov.pow:'')+(ov.ten!=null?' '+ov.ten:''),cI*cw+3,r*ch+11); }));
    window.__post(opts.save||'poses',o.toDataURL()); return 'ok'; };
}

// ---------- 0.3 rods: a tapered blank with a grip, reel, guides and a look of its own for every rod ----------
function v3Rod(c,hand,tip,mx,my,rod,night,t,reeling){ const id=rod?rod.id:'bamboo', col=rod?rod.col:'#d9c7a0', N=c2=>mix(c2,'#1a1820',night*.4), n=12, pts=[];
  for(let i=0;i<=n;i++){ const u=i/n, x=(1-u)*(1-u)*hand.x+2*u*(1-u)*mx+u*u*tip.x, y=(1-u)*(1-u)*hand.y+2*u*(1-u)*my+u*u*tip.y; pts.push([x,y]); }
  const base=id==='scrap'?'#8a5a3a':col, dark=mix(base,'#000000',.35), lite=mix(base,'#ffffff',.35);
  // the grip behind the hand (cork, or rod-specific)
  const g0=pts[0], ga=Math.atan2(pts[1][1]-g0[1],pts[1][0]-g0[0]); c.save(); c.translate(g0[0],g0[1]); c.rotate(ga);
  c.fillStyle=N(id==='golden'?'#c8961e':id==='abyssrod'?'#24102e':id==='carbon'?'#1a1a1a':'#b8875a'); c.fillRect(-9,-2.4,13,4.8); if(id!=='carbon'&&id!=='abyssrod'){ c.fillStyle=N('#8a5f3a'); for(let k=-8;k<4;k+=3) c.fillRect(k,-2.4,1,4.8); }
  c.fillStyle=N('#2a2a30'); c.fillRect(-11,-2,2.4,4); c.restore();
  // the tapered blank, segment by segment
  c.lineCap='round'; for(let i=0;i<n;i++){ const u=i/n, w=3.2-u*2.3; let cl=base;
    if(id==='bamboo'&&i%3===2) cl=dark; if(id==='fibre') cl=i%4===3?'#d8383a':base; if(id==='spine') cl=i%2?mix(base,'#ffffff',.25):base;
    if(id==='tides') cl=mix(base,'#bffcf0',.5+.5*Math.sin(t*3-i*.8)); if(id==='golden') cl=mix(base,'#fff4b0',Math.max(0,Math.sin(t*2-i*.5))*.6);
    c.strokeStyle=N(cl); c.lineWidth=Math.max(.9,w); c.beginPath(); c.moveTo(pts[i][0],pts[i][1]); c.lineTo(pts[i+1][0],pts[i+1][1]); c.stroke(); }
  // a light edge along the top of the blank
  c.strokeStyle=v3rgba(lite,id==='carbon'?.5:.35); c.lineWidth=.8; c.beginPath(); c.moveTo(pts[1][0],pts[1][1]-1); for(let i=2;i<=n-2;i++) c.lineTo(pts[i][0],pts[i][1]-1); c.stroke();
  // wraps and guides
  for(const i of [3,6,9,11]){ const [x,y]=pts[i]; c.fillStyle=N(id==='carbon'?'#d8b048':id==='fibre'?'#d8383a':mix(base,'#000000',.5)); c.fillRect(x-1.4,y-1.6,2.8,3.2); c.strokeStyle=N('#c8ccd4'); c.lineWidth=.8; c.beginPath(); c.arc(x,y+2.2,1.3,0,7); c.stroke(); }
  // signature touches
  if(id==='frostrod'){ c.fillStyle='rgba(230,248,255,.85)'; for(let i=2;i<n;i+=2){ const [x,y]=pts[i]; c.fillRect(x-.6,y-2.6,1.2,1.2); } const [x,y]=pts[n]; c.beginPath(); c.moveTo(x,y-3); c.lineTo(x+1.6,y); c.lineTo(x,y+3); c.lineTo(x-1.6,y); c.fill(); }
  if(id==='coralrod'){ c.fillStyle=N('#ffb0c0'); for(const i of [2,5,8]){ const [x,y]=pts[i]; c.beginPath(); c.arc(x+1,y-2.4,1.3,0,7); c.arc(x-1.6,y-2,1,0,7); c.fill(); } }
  if(id==='stormrod'&&Math.sin(t*1.7)>.85){ c.strokeStyle='rgba(220,235,255,.9)'; c.lineWidth=.9; c.beginPath(); c.moveTo(pts[4][0],pts[4][1]-3); c.lineTo(pts[6][0]+2,pts[6][1]-6); c.lineTo(pts[7][0],pts[7][1]-3); c.lineTo(pts[9][0]+2,pts[9][1]-6); c.stroke(); }
  if(id==='abyssrod'){ for(const i of [2,4,6,8,10]){ const [x,y]=pts[i]; v3glow(c,x,y,5,'rgba(190,120,255,.9)',.35+.25*Math.sin(t*2+i)); c.fillStyle='#e0c0ff'; c.fillRect(x-.6,y-.6,1.2,1.2); } }
  if(id==='scrap'){ c.fillStyle=N('#c8c0a0'); const [x,y]=pts[5]; c.fillRect(x-2.5,y-2.4,5,4.8); c.fillStyle=v3rgba('#a0602a',.6); for(const i of [3,7,10]){ const [x2,y2]=pts[i]; c.beginPath(); c.arc(x2,y2,1.2,0,7); c.fill(); } }
  if(id==='spine'){ c.fillStyle=N(mix(base,'#ffffff',.4)); for(let i=1;i<n;i++){ const [x,y]=pts[i]; c.beginPath(); c.moveTo(x-1,y-1.5); c.lineTo(x,y-4.2+i*.15); c.lineTo(x+1,y-1.5); c.fill(); } }
  // the reel under the grip: a spool that spins while you reel
  { const [x,y]=pts[1], r=3.6; c.fillStyle=N('#3a3a44'); c.fillRect(x-1,y,2,3); c.fillStyle=N(id==='golden'?'#e8b830':id==='carbon'?'#c8c8d0':'#8a8a96'); c.beginPath(); c.arc(x,y+5.4,r,0,7); c.fill();
    c.strokeStyle=N('#2a2a30'); c.lineWidth=.9; c.beginPath(); c.arc(x,y+5.4,r,0,7); c.stroke(); const a=reeling?t*16:0; c.beginPath(); c.moveTo(x,y+5.4); c.lineTo(x+Math.cos(a)*r*1.5,y+5.4+Math.sin(a)*r*1.5); c.stroke(); c.fillStyle=N('#2a2a30'); c.beginPath(); c.arc(x+Math.cos(a)*r*1.5,y+5.4+Math.sin(a)*r*1.5,1.1,0,7); c.fill(); }
  c.lineCap='butt'; }
if(/[?&]test\b/.test(location.search)) window.__rodSheet=(save)=>{ const o=document.createElement('canvas'); o.width=4*220; o.height=3*150; const x=o.getContext('2d'); x.fillStyle='#4a7a90'; x.fillRect(0,0,o.width,o.height);
  RODS.forEach((r,i)=>{ const ox=(i%4)*220, oy=Math.floor(i/4)*150; x.save(); x.translate(ox,oy); x.scale(1.6,1.6); v3Rod(x,{x:20,y:70},{x:125,y:12},70,30,r,0,performance.now()/1000,i%2===0); x.restore(); x.fillStyle='#fff'; x.font='11px sans-serif'; x.fillText(r.id,ox+6,oy+144); });
  if(save) __post(save,o.toDataURL()); return RODS.length; };
// rod pictures for the Rods tab, drawn once per rod with the same code as in the game
const ROD_IMG3={};
function rodImg3(id,lvl){ if(!ROD_IMG3[id]){ const o=document.createElement('canvas'); o.width=240; o.height=80; const x=o.getContext('2d'); x.scale(2,2); v3Rod(x,{x:16,y:33},{x:114,y:6},64,22,ROD_I[id],0,0,false); ROD_IMG3[id]=o.toDataURL(); }
  return `<span style="position:relative;display:inline-block;width:120px;height:40px;flex:0 0 auto"><img src="${ROD_IMG3[id]}" width="120" height="40" alt="" style="display:block">${lvl?`<b style="position:absolute;right:0;bottom:-2px;font-size:11px;color:#ffd36a">Lv ${lvl}</b>`:''}</span>`; }
if(/[?&]test\b/.test(location.search)) window.__hatSheet=(opts={})=>{ const ids=HATS.map(h=>h[0]||h.id).slice(opts.from||0,opts.to||999), cols=opts.cols||10, cw=opts.cell||110, ch=cw, sc=cw/26;
  const o=document.createElement('canvas'); o.width=cols*cw; o.height=Math.ceil(ids.length/cols)*ch; const x=o.getContext('2d');
  ids.forEach((id,i)=>{ const cx=(i%cols)*cw, cy=Math.floor(i/cols)*ch; x.save(); x.beginPath(); x.rect(cx,cy,cw,ch); x.clip(); x.fillStyle=i%2?'#2e3858':'#283150'; x.fillRect(cx,cy,cw,ch);
    const lk=Object.assign({},S.look,{hat:id,outfit:'none',glasses:'none',beard:'none',g:i%2?'f':'m',hairStyle:i%2?'long':'short'}); drawAngler3(x,cx+cw*.45,cy+ch*.5+56*sc,sc,lk,{t:1.3,hx:9,hy:-35}); x.restore(); x.fillStyle='#cfd8ff'; x.font='9px system-ui'; x.fillText(id,cx+3,cy+10); });
  window.__post(opts.save||'hats',o.toDataURL()); return ids.length; };
