
// =====================================================================
// 0.3 wardrobe drawing: shoes, neckwear, back pieces. All are drawn in the angler's own
// coordinates (feet on y = 0, facing right), so they fit every body type and pose.
// =====================================================================
function a3Grad(c,y0,y1,col,lit,shade){ const gr=c.createLinearGradient(0,y0,0,y1); gr.addColorStop(0,mix(col,'#fff4e2',lit==null?.16:lit)); gr.addColorStop(.6,col); gr.addColorStop(1,mix(col,'#000000',shade==null?.3:shade)); return gr; }
// a generic shoe profile: ankle top at -h, toe reaching bx+toe, rounded; returns nothing, fills with a lit gradient
function a3ShoeBody(c,bx,h,toe,col,round){ c.fillStyle=a3Grad(c,-h-.6,0,col); c.beginPath(); c.moveTo(bx-3,-h); c.quadraticCurveTo(bx+.4,-h-.5,bx+1.8,-Math.min(h,5.2)+.1);
  c.quadraticCurveTo(bx+toe+.4,-4*round,bx+toe,-1.1); c.quadraticCurveTo(bx+toe-.2,-.2,bx+toe-1,-.2); c.lineTo(bx-3.2,-.2); c.quadraticCurveTo(bx-3.8,-h*.5,bx-3,-h); c.fill(); }
function a3Sole(c,bx,toe,col,th){ c.fillStyle=col; c.beginPath(); c.moveTo(bx-3.5,-th); c.lineTo(bx+toe-.1,-th); c.quadraticCurveTo(bx+toe+.3,0,bx+toe-.8,.25); c.lineTo(bx-3.4,.25); c.closePath(); c.fill(); }
function a3Foot(c,bx,sk){ c.fillStyle=a3Grad(c,-4.6,0,sk,.12,.22); c.beginPath(); c.moveTo(bx-2.6,-4.8); c.lineTo(bx+1.2,-4.6); c.quadraticCurveTo(bx+5.6,-2.4,bx+5.2,-.6); c.lineTo(bx-2.8,-.6); c.closePath(); c.fill(); }
function a3Shoe(c,id,bx,dark,D,sk,t){ const k=dark?.82:1, S2=(cl)=>D(dark?mix(cl,'#000000',.25):cl), dot=(x,y,r,cl)=>{ c.fillStyle=cl; c.beginPath(); c.arc(x,y,r,0,7); c.fill(); };
  const shine=(x,y,rx)=>{ c.fillStyle='rgba(255,240,220,'+(dark?.1:.26)+')'; c.beginPath(); c.ellipse(x,y,rx,rx*.4,-.35,0,7); c.fill(); };
  switch(id){
    case 'sneakers': case 'glowkicks': { a3ShoeBody(c,bx,4.4,6,S2(id==='glowkicks'?'#2a2a3a':'#e8e8ee'),.8); c.fillStyle=S2(id==='glowkicks'?'#5ae8ff':'#d8443a'); c.beginPath(); c.moveTo(bx-1.6,-1.8); c.quadraticCurveTo(bx+1.6,-3.6,bx+4,-2.4); c.quadraticCurveTo(bx+1.6,-2.6,bx-1.6,-1.2); c.fill();
      a3Sole(c,bx,6.1,id==='glowkicks'?(dark?'#3ab8cc':'#7ff4ff'):S2('#f8f8fa'),1.3); c.strokeStyle=S2('#9a9aa8'); c.lineWidth=.35; c.beginPath(); c.moveTo(bx+.2,-4.4); c.lineTo(bx+1.4,-3.6); c.moveTo(bx+1,-4.6); c.lineTo(bx+2.2,-3.8); c.stroke();
      if(id==='glowkicks'){ c.save(); c.globalAlpha*=.35+.2*Math.sin(t*3); c.fillStyle='#7ff4ff'; c.beginPath(); c.ellipse(bx+1.4,.2,6,1.4,0,0,7); c.fill(); c.restore(); } shine(bx+3.6,-3.2,1.4); break; }
    case 'hightops': { a3ShoeBody(c,bx,7,6,S2('#2a4a8a'),.8); c.fillStyle=S2('#f4f4f2'); c.beginPath(); c.ellipse(bx+4.4,-1.6,1.9,1.4,0,0,7); c.fill(); a3Sole(c,bx,6.1,S2('#f4f4f2'),1.4); c.fillStyle=S2('#d8d8dc'); c.fillRect(bx-3.4,-1.2,9.4,.4); dot(bx-1.4,-5,.9,S2('#f4f4f2')); c.strokeStyle=S2('#f4f4f2'); c.lineWidth=.35; for(let i=0;i<3;i++){ c.beginPath(); c.moveTo(bx-.2,-6.4+i*1.4); c.lineTo(bx+1.2,-5.8+i*1.4); c.stroke(); } break; }
    case 'sandals': case 'socksand': case 'flipflops': { if(id==='socksand'){ c.fillStyle=a3Grad(c,-6,0,D('#f4f4f0'),.1,.18); c.beginPath(); c.moveTo(bx-2.8,-6.2); c.lineTo(bx+1.2,-6.2); c.lineTo(bx+1.4,-4.6); c.quadraticCurveTo(bx+5.6,-2.4,bx+5.2,-.6); c.lineTo(bx-2.8,-.6); c.closePath(); c.fill(); c.strokeStyle=D('#c8c8c4'); c.lineWidth=.3; c.beginPath(); c.moveTo(bx-2.8,-5.4); c.lineTo(bx+1.3,-5.4); c.stroke(); } else a3Foot(c,bx,sk);
      c.fillStyle=S2('#6a4428'); c.beginPath(); c.roundRect?c.roundRect(bx-3.4,-.9,9.4,1.1,.5):c.rect(bx-3.4,-.9,9.4,1.1); c.fill();
      c.strokeStyle=S2(id==='flipflops'?'#2a8ad8':'#8a5a34'); c.lineWidth=id==='flipflops'?.7:.9; c.beginPath(); if(id==='flipflops'){ c.moveTo(bx-1.4,-.8); c.quadraticCurveTo(bx+1,-3.6,bx+3.2,-2.2); c.lineTo(bx+3.6,-.8); } else { c.moveTo(bx-2.6,-3.4); c.lineTo(bx+1.2,-3.6); c.moveTo(bx+1.6,-3); c.lineTo(bx+3.4,-.9); c.moveTo(bx+3.8,-2); c.lineTo(bx+4.4,-.9); } c.stroke(); break; }
    case 'barefoot': { a3Foot(c,bx,sk); c.strokeStyle=D(mix(sk,'#5a2a1a',.3)); c.lineWidth=.3; c.beginPath(); for(let i=0;i<3;i++){ c.moveTo(bx+3.6+i*.5,-1.2); c.lineTo(bx+3.8+i*.5,-.6); } c.stroke(); break; }
    case 'wellies': { a3ShoeBody(c,bx,9,5.6,S2('#f2c230'),.8); a3Sole(c,bx,5.7,S2('#5a4220'),1.1); c.fillStyle=S2('#d8a818'); c.fillRect(bx-3.2,-9.2,5.4,1.2); c.fillStyle='rgba(255,255,240,'+(dark?.15:.4)+')'; c.fillRect(bx-1.8,-8,.7,6); shine(bx+3.4,-3,1.3); break; }
    case 'hiking': { a3ShoeBody(c,bx,6.2,5.8,S2('#6a4a2a'),.85); c.fillStyle=S2('#3a2a1a'); c.beginPath(); c.ellipse(bx+3.8,-1.8,2.2,1.3,0,0,7); c.fill(); a3Sole(c,bx,5.9,S2('#1a120a'),1.3); c.fillStyle=S2('#14100a'); for(let i=0;i<5;i++) c.fillRect(bx-3+i*1.9,.1,1,.5);
      c.strokeStyle=S2('#ff7a2a'); c.lineWidth=.4; for(let i=0;i<4;i++){ c.beginPath(); c.moveTo(bx-.6,-5.8+i*1.2); c.lineTo(bx+1,-5.2+i*1.2); c.stroke(); } c.fillStyle=S2('#a87a4a'); c.fillRect(bx-3.2,-6.6,5,1); break; }
    case 'cowboyb': { c.fillStyle=a3Grad(c,-9,0,S2('#8a5a2a')); c.beginPath(); c.moveTo(bx-3.2,-9); c.lineTo(bx+1.6,-9.4); c.lineTo(bx+1.6,-4.2); c.quadraticCurveTo(bx+6,-3.2,bx+7.4,-.6); c.lineTo(bx-1.4,-.6); c.lineTo(bx-3.4,-.6); c.closePath(); c.fill(); c.fillStyle=S2('#3a2414'); c.fillRect(bx-3.4,-1.4,2.2,1.6); c.fillRect(bx-1.2,-.7,8.6,.8);
      c.strokeStyle=S2('#e8c890'); c.lineWidth=.3; c.beginPath(); c.moveTo(bx-2,-8); c.quadraticCurveTo(bx-.6,-6,bx-1.6,-4); c.moveTo(bx+.2,-8); c.quadraticCurveTo(bx+1,-6,bx,-4.4); c.stroke(); shine(bx+4,-2.6,1.2); break; }
    case 'loafers': case 'brogues': { a3ShoeBody(c,bx,3.4,5.8,S2(id==='loafers'?'#4a2418':'#8a5428'),.6); a3Sole(c,bx,5.9,S2('#1a0e08'),.9); if(id==='loafers'){ c.fillStyle=S2('#2a140c'); c.fillRect(bx+.2,-3.2,2.6,.6); dot(bx+1.5,-2.9,.35,S2('#d8b060')); } else { c.fillStyle=S2('#4a2a12'); for(let i=0;i<6;i++) dot(bx+.6+i*.85,-2.6-Math.sin(i*.6)*.4,.18,S2('#3a1e0c')); }
      shine(bx+3.8,-2.4,1.4); break; }
    case 'clogs': { a3ShoeBody(c,bx,4.6,6,S2('#4ab89a'),1); a3Sole(c,bx,6.1,S2('#3a9a80'),1); for(let i=0;i<4;i++) dot(bx+1.4+i*1.1,-3.2+(i%2)*.8,.35,S2('#2a7a64')); c.strokeStyle=S2('#3a9a80'); c.lineWidth=.6; c.beginPath(); c.arc(bx-1.6,-3,1.4,Math.PI*.6,Math.PI*1.6); c.stroke(); break; }
    case 'slippers': { c.fillStyle=a3Grad(c,-5.6,0,S2('#f4e8f0'),.1,.2); c.beginPath(); c.ellipse(bx+1.6,-2.4,5,2.8,0,0,7); c.fill(); c.fillStyle=S2('#f4e8f0'); c.beginPath(); c.ellipse(bx+3,-6,.9,2.6,-.3,0,7); c.ellipse(bx+4.6,-5.6,.9,2.4,.25,0,7); c.fill(); c.fillStyle=S2('#f0a8c0'); c.beginPath(); c.ellipse(bx+3,-6,.4,1.6,-.3,0,7); c.ellipse(bx+4.6,-5.6,.4,1.4,.25,0,7); c.fill();
      dot(bx+5.2,-3,.4,S2('#2a1a1a')); dot(bx+6.4,-2,.5,S2('#f08aa8')); break; }
    case 'flippers': { a3Foot(c,bx,sk); c.fillStyle=a3Grad(c,-3,0,S2('#2ad8a8'),.2,.3); c.beginPath(); c.moveTo(bx-1,-3.2); c.lineTo(bx+3,-3); c.lineTo(bx+11,-1.8); c.quadraticCurveTo(bx+12,-.6,bx+11,0); c.lineTo(bx-2.6,0); c.quadraticCurveTo(bx-3,-2,bx-1,-3.2); c.fill(); c.strokeStyle=S2('#1aa880'); c.lineWidth=.35; c.beginPath(); c.moveTo(bx+4,-1.6); c.lineTo(bx+10.6,-1.1); c.moveTo(bx+4,-.8); c.lineTo(bx+10.6,-.5); c.stroke(); break; }
    case 'moonboots': case 'astrob': { const col=id==='astrob'?'#e8ecf0':'#c8443a'; c.fillStyle=a3Grad(c,-8,0,S2(col),.2,.28); c.beginPath(); c.moveTo(bx-4,-7.6); c.quadraticCurveTo(bx-.4,-8.6,bx+2.6,-7.6); c.quadraticCurveTo(bx+7.4,-5,bx+6.8,-1); c.quadraticCurveTo(bx+6,0,bx+4,0); c.lineTo(bx-4,0); c.quadraticCurveTo(bx-5,-4,bx-4,-7.6); c.fill();
      a3Sole(c,bx-.5,7,S2(id==='astrob'?'#7a8490':'#f4f4f2'),1.4); c.strokeStyle=S2(id==='astrob'?'#a8b0b8':'#a82a24'); c.lineWidth=.45; for(const yy of [-5.6,-3.6]){ c.beginPath(); c.moveTo(bx-4.2,yy); c.quadraticCurveTo(bx+1,yy+.6,bx+5.6,yy+.4); c.stroke(); } if(id==='astrob'){ c.fillStyle=S2('#d8603a'); c.fillRect(bx-3.6,-7.4,6,1); } shine(bx+3.2,-5,1.6); break; }
    case 'snowboots': { a3ShoeBody(c,bx,7.4,5.8,S2('#5a3a24'),.85); a3Sole(c,bx,5.9,S2('#1a120a'),1.4); c.fillStyle=S2('#f2ece0'); for(let i=0;i<6;i++) dot(bx-2.8+i*1,-7.4+Math.sin(i*2)*.3,1,S2('#f2ece0')); c.fillStyle=S2('#d8cfc0'); for(let i=0;i<5;i++) dot(bx-2.3+i*1,-6.7,.5,S2('#d8cfc0')); break; }
    case 'combat': case 'pirateb': { const col=id==='combat'?'#1e1e22':'#18121a'; a3ShoeBody(c,bx,id==='pirateb'?9.4:7.6,5.8,S2(col),.85); a3Sole(c,bx,5.9,S2('#08080a'),1.5);
      if(id==='combat'){ c.strokeStyle=S2('#6a6a72'); c.lineWidth=.35; for(let i=0;i<5;i++){ c.beginPath(); c.moveTo(bx-.4,-7.2+i*1.2); c.lineTo(bx+1.2,-6.6+i*1.2); c.stroke(); } }
      else { c.fillStyle=a3Grad(c,-11,-7.6,S2('#2a1e26'),.2,.3); c.beginPath(); c.moveTo(bx-4,-11); c.lineTo(bx+2.6,-11.2); c.lineTo(bx+2,-7.6); c.lineTo(bx-3.6,-7.6); c.closePath(); c.fill(); c.fillStyle=S2('#d8b048'); c.fillRect(bx-1.6,-5,2.4,1.8); c.fillStyle=S2(col); c.fillRect(bx-1,-4.5,1.2,.8); }
      shine(bx+3.6,-3,1.4); break; }
    case 'rollers': { a3ShoeBody(c,bx,6.6,5.6,S2('#f4f0ec'),.85); c.fillStyle=S2('#e04a8a'); c.fillRect(bx-3.2,-6.8,5,1.2); c.fillStyle=S2('#9a9aa8'); c.fillRect(bx-3.4,-1.2,9.4,1.2); for(const wx of [-2,.4,2.8,5.2]){ dot(bx+wx,.6,1.1,S2('#ffd84a')); dot(bx+wx,.6,.4,S2('#a88a2a')); } c.fillStyle=S2('#e04a8a'); c.beginPath(); c.ellipse(bx+6.4,-.6,.8,.6,0,0,7); c.fill(); break; }
    case 'geta': { a3Foot(c,bx,sk); c.fillStyle=a3Grad(c,-2.4,0,S2('#c8945a'),.15,.3); c.fillRect(bx-3.4,-2.2,9.4,1.2); c.fillStyle=S2('#8a5a2a'); c.fillRect(bx-2.4,-1,1.4,1.2); c.fillRect(bx+3.2,-1,1.4,1.2); c.strokeStyle=S2('#c8343a'); c.lineWidth=.7; c.beginPath(); c.moveTo(bx-1.6,-2.2); c.quadraticCurveTo(bx+1,-4.4,bx+3,-2.2); c.stroke(); break; }
    case 'heeled': { c.fillStyle=a3Grad(c,-9,0,S2('#5a1a2a')); c.beginPath(); c.moveTo(bx-3,-8.6); c.lineTo(bx+1.6,-8.8); c.lineTo(bx+1.6,-4.4); c.quadraticCurveTo(bx+5.6,-2.4,bx+6.6,-.4); c.lineTo(bx+1,-.4); c.quadraticCurveTo(bx-1,-2.2,bx-2.2,-2); c.lineTo(bx-3.2,-2.4); c.closePath(); c.fill();
      c.fillStyle=S2('#1a0a10'); c.fillRect(bx-3,-2.4,1,2.6); c.fillRect(bx+1,-.6,5.8,.8); shine(bx+3.6,-2.6,1.2); break; }
    case 'ducky': { c.fillStyle=a3Grad(c,-3,0,S2('#ff9a2a'),.2,.25); c.beginPath(); c.moveTo(bx-2.4,-3.6); c.lineTo(bx+1,-3.4); c.lineTo(bx+7.6,-1.6); c.lineTo(bx+6.4,-.6); c.lineTo(bx+7.8,0); c.lineTo(bx-2.8,0); c.closePath(); c.fill(); c.strokeStyle=S2('#d8781a'); c.lineWidth=.4; c.beginPath(); c.moveTo(bx+1.6,-1.6); c.lineTo(bx+6.6,-.9); c.moveTo(bx+1.6,-.6); c.lineTo(bx+6.6,-.3); c.stroke();
      c.fillStyle=S2('#ff9a2a'); c.fillRect(bx-1.4,-6,2.4,2.6); break; }
    case 'fishfeet': { c.fillStyle=a3Grad(c,-5,0,S2('#5ab8d8'),.25,.3); c.beginPath(); c.moveTo(bx-3.6,-2.6); c.quadraticCurveTo(bx+1,-6,bx+6,-2.6); c.quadraticCurveTo(bx+7,-1,bx+6,0); c.lineTo(bx-3.6,0); c.closePath(); c.fill();
      c.fillStyle=S2('#3a8ab8'); c.beginPath(); c.moveTo(bx-3.4,-2.4); c.lineTo(bx-6,-4.4); c.lineTo(bx-5.4,-1.2); c.lineTo(bx-6,.4); c.closePath(); c.fill(); dot(bx+4.4,-2.6,.75,S2('#ffffff')); dot(bx+4.6,-2.6,.35,S2('#14141a'));
      c.strokeStyle=S2('#3a8ab8'); c.lineWidth=.3; for(let i=0;i<3;i++){ c.beginPath(); c.arc(bx+.4+i*1.4,-2,1,Math.PI*1.2,Math.PI*1.8); c.stroke(); } break; }
    case 'clownshoes': { c.fillStyle=a3Grad(c,-6,0,S2('#e0302a'),.25,.3); c.beginPath(); c.moveTo(bx-3,-5.4); c.lineTo(bx+1.6,-5.2); c.quadraticCurveTo(bx+5,-6.4,bx+9,-4.4); c.quadraticCurveTo(bx+11,-2,bx+9.4,0); c.lineTo(bx-3.2,0); c.closePath(); c.fill(); a3Sole(c,bx,10,S2('#ffd84a'),.9);
      dot(bx+.6,-5.2,.8,S2('#ffd84a')); shine(bx+6.4,-3.6,2.2); break; }
    default: { // work boots
      const bc=S2('#33241a'); c.fillStyle=a3Grad(c,-6,0,bc,.14,.35);
      c.beginPath(); c.moveTo(bx-3,-5.4); c.quadraticCurveTo(bx+.4,-6,bx+1.8,-5.1); c.quadraticCurveTo(bx+6.4,-4,bx+6,-1.1); c.quadraticCurveTo(bx+5.8,-.2,bx+5,-.2); c.lineTo(bx-3.2,-.2); c.quadraticCurveTo(bx-3.8,-2.8,bx-3,-5.4); c.fill();
      a3Sole(c,bx,6,D('#140d08'),1); dot(bx-.2,-4.3,.38,D('#c9a070')); dot(bx+1.3,-3.9,.38,D('#c9a070')); shine(bx+3.6,-3.3,1.6); }
  } }

// ---------- neckwear (upper-body space, neck at (0,-46)); w = shoulder width scale ----------
function a3Neck(c,id,D,col,t,w,lean){ if(!id||id==='none') return; const ac=D(col||'#c8553a'), dk=D(mix(col||'#c8553a','#000000',.28)), lt=D(mix(col||'#c8553a','#ffffff',.25)), dot=(x,y,r,cl)=>{ c.fillStyle=cl; c.beginPath(); c.arc(x,y,r,0,7); c.fill(); };
  const wrap=(cl,cl2)=>{ c.fillStyle=a3Grad(c,-48.4,-44,cl,.2,.3); c.beginPath(); c.ellipse(.4,-46.2,5.6*w,2.3,0,0,7); c.fill(); if(cl2){ c.strokeStyle=cl2; c.lineWidth=.5; c.beginPath(); c.ellipse(.4,-46.2,5.6*w,2.3,0,.2,Math.PI-.2); c.stroke(); } };
  const sway=Math.sin(t*1.8)*.6-(lean||0)*6;
  switch(id){
    case 'scarf': case 'stripescarf': case 'longscarf': { const L=id==='longscarf'?18:9;
      c.fillStyle=a3Grad(c,-46,-46+L,ac,.15,.3); c.beginPath(); c.moveTo(1.6,-45.4); c.quadraticCurveTo(3.4+sway*.4,-45+L*.5,2.6+sway,-45.6+L); c.lineTo(5.6+sway,-46+L); c.quadraticCurveTo(5.4+sway*.4,-45+L*.5,4.4,-45.6); c.closePath(); c.fill();
      if(id==='longscarf'){ c.beginPath(); c.moveTo(-3,-45.4); c.quadraticCurveTo(-8-sway,-40,-11-sway*1.5,-34); c.lineTo(-8.4-sway*1.5,-33.2); c.quadraticCurveTo(-6-sway,-39,-1,-44.8); c.fill(); }
      c.strokeStyle=D('#f4ece0'); c.lineWidth=.35; c.beginPath(); for(let i=0;i<4;i++){ c.moveTo(2.8+sway+i*.8,-45.6+L); c.lineTo(2.8+sway+i*.8,-44.2+L); } c.stroke();
      wrap(ac); if(id!=='scarf'){ c.save(); c.beginPath(); c.ellipse(.4,-46.2,5.6*w,2.3,0,0,7); c.moveTo(1.6,-45.4); c.lineTo(2.6+sway,-45.6+L); c.lineTo(5.6+sway,-46+L); c.lineTo(4.4,-45.6); c.clip(); c.fillStyle=D('#f4ece0'); for(let y=-48;y<-44+L;y+=2.4) c.fillRect(-8,y,16,1); c.restore(); } break; }
    case 'cowl': wrap(ac,dk); c.fillStyle=a3Grad(c,-50,-46,ac,.2,.2); c.beginPath(); c.ellipse(.4,-47.6,4.6*w,1.8,0,0,7); c.fill(); c.strokeStyle=dk; c.lineWidth=.3; for(let i=-4;i<=4;i+=1.3){ c.beginPath(); c.moveTo(i*w,-48.6); c.lineTo(i*w*1.1,-44.6); c.stroke(); } break;
    case 'bandana': { c.fillStyle=a3Grad(c,-47,-39,ac,.15,.3); c.beginPath(); c.moveTo(-4.6*w,-46.6); c.lineTo(5*w,-46.6); c.lineTo(.8,-39.4); c.closePath(); c.fill(); for(let i=0;i<5;i++) dot(-2+i*1.2,-45.4+(i%2)*1.2,.3,D('#f4f0e8')); break; }
    // (2026-11-17) the bow tie, tie, pendants, medal, whistle and fish are drawn on the chest front over the arm (a3NeckFront in
    // ak_side.js); here only what wraps the back of the neck is drawn, so nothing can show twice when the arm moves
    case 'bowtie': case 'tie': case 'medal': case 'whistle': case 'fishneck': break;
    case 'lei': { const cs=['#ff6a8a','#ffd84a','#ff9a3a','#e86ad8']; for(let i=0;i<11;i++){ const a=Math.PI*(.05+i*.09), x=Math.cos(a)*5.6*w, y=-46+Math.sin(a)*4.6; dot(x,y,1.25,D(cs[i%4])); dot(x,y,.4,D('#fff4c0')); } break; }
    case 'shells': case 'pearls': case 'goldchain': { const big=id==='goldchain'; c.strokeStyle=D(big?'#e8b830':'#d8c8a0'); c.lineWidth=big?1:.4; c.beginPath(); c.ellipse(.4,-45.4,5*w,big?5.4:4.2,0,.15,Math.PI-.15); c.stroke();
      if(id==='pearls') for(let i=0;i<9;i++){ const a=Math.PI*(.1+i*.1); dot(.4+Math.cos(a)*5*w,-45.4+Math.sin(a)*4.2,.6,D('#f8f4ee')); }
      break; }
    case 'ascot': wrap(ac); c.fillStyle=a3Grad(c,-46,-39,ac,.2,.3); c.beginPath(); c.moveTo(-.6,-45.6); c.quadraticCurveTo(-1.8,-41.6,.6,-39.4); c.quadraticCurveTo(2.8,-41.6,1.8,-45.6); c.closePath(); c.fill(); dot(.6,-43,.4,D('#ffd84a')); break;
    case 'boa': { const cs=[ac,lt,ac]; for(let i=0;i<16;i++){ const a=Math.PI*(-.05+i*.075), x=Math.cos(a)*5.8*w, y=-46.2+Math.sin(a)*3.6+(i>12?(i-12)*1.4:0); dot(x+(i>12?sway*.3:0),y,1.6,cs[i%3]); } break; }
  } }

// ---------- back pieces (behind the upper body; shoulders around (-6,-45)); drawn in upper-body space ----------
function a3Back(c,id,D,col,t,w,lean,st){ if(!id||id==='none') return; const ac=D(col||'#c8553a'), dk=D(mix(col||'#c8553a','#000000',.3)), lt=D(mix(col||'#c8553a','#ffffff',.25)), dot=(x,y,r,cl)=>{ c.fillStyle=cl; c.beginPath(); c.arc(x,y,r,0,7); c.fill(); };
  const wind=Math.sin(t*1.7)*1.2+Math.sin(t*3.1)*.4+(lean||0)*-12, bx=-7.4*w;
  const strap=(cl)=>{ c.strokeStyle=cl; c.lineWidth=1.2; c.beginPath(); c.moveTo(-3.4*w,-46.4); c.quadraticCurveTo(1*w,-44,1.6*w,-36); c.stroke(); };
  const capeShape=(len,ragged)=>{ c.beginPath(); c.moveTo(-6.6*w,-46.4); c.quadraticCurveTo(-11*w-wind*.4,-46+len*.4,-14*w-wind,-46+len); if(ragged){ for(let i=0;i<5;i++) c.lineTo(-14*w-wind+i*2.2*w+((i%2)?1:0),-46+len+((i%2)?-2.4:.6)); } else c.quadraticCurveTo(-8*w-wind*.6,-44+len,-2*w,-46+len*.92); c.lineTo(1*w,-46+len*.6); c.lineTo(4*w,-46.6); c.closePath(); };
  switch(id){
    case 'cape': case 'royalcape': case 'tatteredcape': case 'starcape': { const len=id==='royalcape'?42:id==='tatteredcape'?34:36, cl=id==='starcape'?D('#1a1a4a'):id==='tatteredcape'?D(mix(col||'#5a4a3a','#2a2a2a',.4)):ac;
      const gr=c.createLinearGradient(-14*w,0,2*w,0); gr.addColorStop(0,mix(cl,'#000000',.35)); gr.addColorStop(.6,cl); gr.addColorStop(1,mix(cl,'#fff2dc',.12)); c.fillStyle=gr; capeShape(len,id==='tatteredcape'); c.fill();
      if(id==='royalcape'){ c.fillStyle=D('#f4f0ea'); c.beginPath(); c.ellipse(-1*w,-46.6,7.6*w,2.4,0,0,7); c.fill(); for(let i=0;i<6;i++) dot(-6*w+i*2.2*w,-46.2,.35,D('#1a1a1a')); }
      if(id==='starcape'){ c.save(); capeShape(len,false); c.clip(); for(let i=0;i<22;i++){ const x=-15*w+((i*37)%17), y=-44+((i*23)%len); c.globalAlpha=.5+.5*Math.sin(t*2+i); dot(x,y,.35+(i%3)*.15,'#fff8d0'); } c.restore(); c.globalAlpha=1; }
      c.strokeStyle='rgba(0,0,0,.18)'; c.lineWidth=.5; for(let k=1;k<4;k++){ c.beginPath(); c.moveTo(-6*w+k*2*w,-45); c.quadraticCurveTo(-8*w-wind*.4+k*2*w,-46+len*.5,-11*w-wind*.8+k*2.6*w,-47+len); c.stroke(); } break; }
    case 'backpack': case 'tacklepack': case 'plushpack': { const cl=id==='tacklepack'?D('#3a6a3a'):id==='plushpack'?D('#8ad0e8'):ac;
      if(id==='plushpack'){ c.fillStyle=a3Grad(c,-46,-28,cl,.25,.3); c.beginPath(); c.ellipse(bx-1.4,-37,4.6,8.6,.1,0,7); c.fill(); c.beginPath(); c.moveTo(bx-1,-29); c.lineTo(bx-4,-25); c.lineTo(bx+2,-25.6); c.closePath(); c.fill(); dot(bx-.4,-42,1,'#ffffff'); dot(bx-.2,-42,.5,'#14141a'); c.fillStyle=D('#ff9ab0'); c.beginPath(); c.ellipse(bx+1.2,-39.6,.9,.5,0,0,7); c.fill(); }
      else { c.fillStyle=a3Grad(c,-46,-28,cl,.2,.32); c.beginPath(); c.roundRect?c.roundRect(bx-5.6,-45.6,7,17.6,2.4):c.rect(bx-5.6,-45.6,7,17.6); c.fill(); c.fillStyle=mix(cl,'#000000',.2); c.beginPath(); c.roundRect?c.roundRect(bx-6.2,-37,5.6,7,1.6):c.rect(bx-6.2,-37,5.6,7); c.fill();
        c.strokeStyle=D('#d8d0b8'); c.lineWidth=.35; c.beginPath(); c.moveTo(bx-6,-36.4); c.lineTo(bx-.8,-36.4); c.stroke(); if(id==='tacklepack'){ c.fillStyle=D('#d8b048'); c.fillRect(bx-4.8,-43,3,1); for(let i=0;i<3;i++) dot(bx-5+i*1.4,-32,.45,D(['#ff5a3a','#ffd84a','#5ad8ff'][i])); } }
      strap(D(mix(id==='plushpack'?'#5aa8c8':col||'#c8553a','#000000',.35))); break; }
    case 'creel': c.fillStyle=a3Grad(c,-40,-26,D('#c8a060'),.2,.35); c.beginPath(); c.roundRect?c.roundRect(bx-5.4,-38,7.4,11,1.6):c.rect(bx-5.4,-38,7.4,11); c.fill(); c.strokeStyle=D('#8a6a3a'); c.lineWidth=.35; for(let y=-36.5;y<-27;y+=1.4){ c.beginPath(); c.moveTo(bx-5.2,y); c.lineTo(bx+1.8,y); c.stroke(); } c.fillStyle=D('#6a4a2a'); c.fillRect(bx-5.8,-38.6,8.2,1.4); c.strokeStyle=D('#4a3018'); c.lineWidth=.9; c.beginPath(); c.moveTo(bx+1.6,-38); c.lineTo(3*w,-46); c.stroke(); break;
    case 'netback': c.strokeStyle=D('#8a6a3a'); c.lineWidth=1.1; c.beginPath(); c.moveTo(-1*w,-30); c.lineTo(-9*w,-55); c.stroke(); c.strokeStyle=D('#3a3a3a'); c.lineWidth=.7; c.beginPath(); c.ellipse(-10.4*w,-59,3.6,2.6,-.5,0,7); c.stroke(); c.save(); c.globalAlpha*=.55; c.lineWidth=.25; c.strokeStyle=D('#d8d8d0'); for(let i=-3;i<=3;i++){ c.beginPath(); c.moveTo(-10.4*w+i,-61.4); c.lineTo(-11*w+i*.6,-55); c.stroke(); } c.restore(); break;
    case 'scuba': c.fillStyle=a3Grad(c,-48,-26,D('#e8c030'),.35,.3); c.beginPath(); c.roundRect?c.roundRect(bx-4.6,-46,5.4,19,2.6):c.rect(bx-4.6,-46,5.4,19); c.fill(); c.fillStyle=D('#3a3a44'); c.fillRect(bx-3.2,-48.4,2.6,2.6); c.strokeStyle=D('#2a2a30'); c.lineWidth=.8; c.beginPath(); c.moveTo(bx-1.8,-48); c.quadraticCurveTo(-2,-54,3,-50); c.stroke(); strap(D('#2a2a30')); break;
    case 'jetpack': { for(const dx of [-3.8,-.4]){ c.fillStyle=a3Grad(c,-46,-30,D('#b8c0c8'),.4,.35); c.beginPath(); c.roundRect?c.roundRect(bx+dx-2,-45,3.4,14,1.6):c.rect(bx+dx-2,-45,3.4,14); c.fill(); c.fillStyle=D('#5a6068'); c.fillRect(bx+dx-1.6,-31.4,2.6,1.4);
        const fl=3+Math.sin(t*30+dx)*1.2; c.save(); c.globalAlpha*=.85; const gr=c.createLinearGradient(0,-30,0,-30+fl*1.6); gr.addColorStop(0,'#fff6c0'); gr.addColorStop(.4,'#ff9a3a'); gr.addColorStop(1,'rgba(255,80,40,0)'); c.fillStyle=gr; c.beginPath(); c.moveTo(bx+dx-1.4,-30); c.lineTo(bx+dx-.3,-30+fl*1.6); c.lineTo(bx+dx+.8,-30); c.fill(); c.restore(); } strap(D('#3a3a44')); break; }
    case 'angelwings': case 'butterfly': case 'batwings': case 'dragonwings': { const flap=Math.sin(t*(id==='butterfly'?5:2.2))*.12;
      c.save(); c.translate(-4*w,-42); c.rotate(-.15+flap);
      for(const [sc,al] of [[.82,.7],[1,1]]){ c.save(); c.scale(sc,sc); c.globalAlpha*=al;
        if(id==='angelwings'){ c.fillStyle=a3Grad(c,-16,6,D('#fafaff'),.1,.2); for(let i=0;i<5;i++){ c.beginPath(); c.ellipse(-6-i*2.2,-6+i*2.6,6-i*.6,2.2,-.7+i*.15,0,7); c.fill(); } c.strokeStyle=D('#d8dcf0'); c.lineWidth=.3; for(let i=0;i<5;i++){ c.beginPath(); c.moveTo(-2-i*2,-4+i*2.6); c.lineTo(-10-i*2.2,-6+i*2.6); c.stroke(); } }
        else if(id==='butterfly'){ const gr=c.createRadialGradient(-6,-6,1,-6,-6,10); gr.addColorStop(0,lt); gr.addColorStop(.7,ac); gr.addColorStop(1,dk); c.fillStyle=gr; c.beginPath(); c.ellipse(-7,-7,7,5,-.6,0,7); c.fill(); c.beginPath(); c.ellipse(-6,3,4.6,3.6,.5,0,7); c.fill(); dot(-8,-8,1.4,D('#fff4d0')); dot(-6,3,1,D('#fff4d0')); }
        else { const cl=id==='batwings'?D('#2a1a2a'):D(col||'#3a8a4a'); c.fillStyle=a3Grad(c,-16,6,cl,.15,.35); c.beginPath(); c.moveTo(0,0); c.lineTo(-4,-12); c.lineTo(-16,-10); c.quadraticCurveTo(-14,-6,-15,-2); c.quadraticCurveTo(-12,-3,-11,1); c.quadraticCurveTo(-8,-1,-6,3); c.quadraticCurveTo(-3,1,0,4); c.closePath(); c.fill();
          c.strokeStyle=mix(cl,'#000000',.35); c.lineWidth=.5; c.beginPath(); c.moveTo(-4,-12); c.lineTo(-15,-2); c.moveTo(-4,-12); c.lineTo(-11,1); c.moveTo(-4,-12); c.lineTo(-6,3); c.stroke(); if(id==='dragonwings') dot(-4,-12,.8,D('#e8e0c0')); }
        c.restore(); }
      c.restore(); break; }
    case 'sharkfin': c.fillStyle=a3Grad(c,-58,-38,D('#7a8a9a'),.3,.3); c.beginPath(); c.moveTo(-7*w,-38); c.quadraticCurveTo(-9*w,-50,-14*w,-58); c.quadraticCurveTo(-7*w,-52,-2*w,-42); c.closePath(); c.fill(); strap(D('#3a4450')); break;
    case 'turtleshell': { c.fillStyle=a3Grad(c,-48,-24,D('#4a7a3a'),.25,.35); c.beginPath(); c.ellipse(bx-1.4,-36,5.4,11.6,0,0,7); c.fill(); c.strokeStyle=D('#2a4a20'); c.lineWidth=.5; c.beginPath(); for(const y of [-42,-36,-30]){ c.moveTo(bx-6,y); c.lineTo(bx+3,y); } c.moveTo(bx-1.4,-47); c.lineTo(bx-1.4,-25); c.stroke(); c.fillStyle=D('#d8c070'); c.beginPath(); c.ellipse(bx+3.2,-36,1,10.6,0,0,7); c.fill(); break; }
    case 'rodquiver': c.fillStyle=a3Grad(c,-46,-28,D('#6a4a2a'),.2,.35); c.beginPath(); c.roundRect?c.roundRect(bx-3.4,-46,4,18,1.6):c.rect(bx-3.4,-46,4,18); c.fill(); for(const [dx,cl] of [[-2.6,'#d9c7a0'],[-1.4,'#3a3a3a'],[-.2,'#c84a3a']]){ c.strokeStyle=D(cl); c.lineWidth=.6; c.beginPath(); c.moveTo(bx+dx,-46); c.lineTo(bx+dx-4,-66); c.stroke(); } strap(D('#4a3018')); break;
    case 'lanternpole': { c.strokeStyle=D('#6a4a2a'); c.lineWidth=1; c.beginPath(); c.moveTo(-2*w,-28); c.lineTo(-8*w,-64); c.quadraticCurveTo(-11*w,-67,-13*w,-64); c.stroke(); const lx=-13*w, ly=-60.6+Math.sin(t*2)*.4; c.strokeStyle=D('#3a3a3a'); c.lineWidth=.3; c.beginPath(); c.moveTo(lx,-64); c.lineTo(lx,ly-2); c.stroke();
      if(typeof v3glow==='function') v3glow(c,lx,ly,7,'rgba(255,200,120,.8)',.45+.1*Math.sin(t*3)); c.fillStyle='#ffe0a0'; c.beginPath(); c.roundRect?c.roundRect(lx-1.4,ly-2,2.8,3.6,.8):c.rect(lx-1.4,ly-2,2.8,3.6); c.fill(); c.fillStyle=D('#3a3a3a'); c.fillRect(lx-1.7,ly-2.4,3.4,.6); c.fillRect(lx-1.7,ly+1.4,3.4,.6); break; }
    case 'guitar': { c.save(); c.translate(bx,-36); c.rotate(.55); c.fillStyle=a3Grad(c,-8,8,D('#c8783a'),.25,.35); c.beginPath(); c.ellipse(0,4,4.2,4.6,0,0,7); c.ellipse(0,-2.4,3.2,3.4,0,0,7); c.fill(); dot(0,1,1.3,D('#2a1a10')); c.fillStyle=D('#5a3a1a'); c.fillRect(-.6,-16,1.2,12); c.fillRect(-1,-18,2,2.4); c.restore(); strap(D('#2a2a2a')); break; }
    case 'flagpole': { c.strokeStyle=D('#a8a8b0'); c.lineWidth=.7; c.beginPath(); c.moveTo(-4*w,-28); c.lineTo(-7*w,-72); c.stroke(); c.fillStyle=ac; c.beginPath(); c.moveTo(-7*w,-72); for(let i=0;i<=8;i++) c.lineTo(-7*w-i*1.4,-72+Math.sin(t*4-i*.8)*.8+i*.1); for(let i=8;i>=0;i--) c.lineTo(-7*w-i*1.4,-66.4+Math.sin(t*4-i*.8)*.8+i*.1); c.closePath(); c.fill(); c.fillStyle=D('#f4f0e8'); c.beginPath(); c.arc(-12*w,-69,1.3,0,7); c.fill(); break; }
  } }

// ---------- previews for the shop / wardrobe: draw one piece large ----------
function wearPreview(cx,kind,id,w,h){ const lk=Object.assign({},S.look,{hat:'none'}); if(kind==='shoe'){ cx.save(); cx.translate(w*.38,h*.78); cx.scale(w/18,w/18); a3Shoe(cx,id,0,false,q=>q,SKINS[lk.skin]||SKINS[1],performance.now()/1000); cx.restore(); return; }
  lk[kind==='neck'?'neck':'back']=id; if(kind==='neck'){ const s=h/34; drawAngler(cx,w*.46,h*.5+50*s,s,lk,{}); } else { const s=h/62; drawAngler(cx,w*.62,h*.5+38*s,s,lk,{}); } }

// ---------- undiscovered things: a soft mystery mark that gives nothing away (fish, oddities, pets, decor, rods) ----------
function mysteryThumb(c,w,h,seed){ const cx=w/2, cy=h/2, r=Math.min(w,h)*.34, k=((seed||'').length*7)%5;
  c.save(); const gr=c.createRadialGradient(cx,cy-r*.3,r*.1,cx,cy,r*1.25); gr.addColorStop(0,'rgba(90,130,170,.38)'); gr.addColorStop(.7,'rgba(30,52,78,.32)'); gr.addColorStop(1,'rgba(20,34,52,0)'); c.fillStyle=gr; c.beginPath(); c.ellipse(cx,cy,r*1.25,r,0,0,7); c.fill();
  c.strokeStyle='rgba(160,200,230,.22)'; c.lineWidth=Math.max(1,r*.05); for(let i=0;i<2;i++){ c.beginPath(); c.ellipse(cx,cy+r*.55,r*(.6+i*.35),r*(.14+i*.08),0,0,7); c.stroke(); }
  c.fillStyle='rgba(205,225,245,.5)'; c.font='700 '+Math.round(r*1.15)+'px system-ui, sans-serif'; c.textAlign='center'; c.textBaseline='middle'; c.fillText('?',cx,cy-r*.05);
  c.fillStyle='rgba(230,245,255,.55)'; for(let i=0;i<3;i++){ const a=i*2.1+k, d=r*(.9+.1*i); c.beginPath(); c.arc(cx+Math.cos(a)*d,cy+Math.sin(a)*d*.7,Math.max(.8,r*.04),0,7); c.fill(); }
  c.restore(); }

// ---------- Tide Pass wear: sea glass, foam and living water ----------
const _a3Shoe_0=a3Shoe, _a3Neck_0=a3Neck, _a3Back_0=a3Back;
a3Shoe=function(c,id,bx,dark,D,sk,t){ if(id!=='tidetreads') return _a3Shoe_0(c,id,bx,dark,D,sk,t);
  a3ShoeBody(c,bx,6.4,5.8,D(dark?'#1a5a6a':'#2a8a9a'),.85); a3Sole(c,bx,5.9,D('#0e2e3a'),1.2);
  c.strokeStyle=D('#bffcf0'); c.lineWidth=.6; c.beginPath(); for(let x=-3;x<=5.6;x+=.5) c.lineTo(bx+x,-3.6+Math.sin(x*1.6+t*3)*.5); c.stroke();
  c.save(); c.globalAlpha*=.35+.15*Math.sin(t*2.4); c.fillStyle='#8af4e8'; c.beginPath(); c.ellipse(bx+1.4,.1,5.6,1.1,0,0,7); c.fill(); c.restore(); };
a3Neck=function(c,id,D,col,t,w,lean){ if(id!=='tidescarf') return _a3Neck_0(c,id,D,col,t,w,lean); const sw=Math.sin(t*1.8)*.8-(lean||0)*6, ac=D('#2a8aa8'), fo=D('#e8fbff');
  c.fillStyle=a3Grad(c,-48,-30,ac,.25,.3); c.beginPath(); c.moveTo(-3,-45.6); c.quadraticCurveTo(-9-sw,-40,-13-sw*1.6,-31); c.lineTo(-10.6-sw*1.6,-30); c.quadraticCurveTo(-7-sw,-39,-1,-45); c.fill();
  c.beginPath(); c.ellipse(.4,-46.2,5.6*w,2.3,0,0,7); c.fill(); c.strokeStyle=fo; c.lineWidth=.6; c.beginPath(); for(let x=-5;x<=6;x+=.5) c.lineTo(x*w,-46.4+Math.sin(x*1.4+t*3)*.5); c.stroke();
  c.fillStyle=fo; for(let i=0;i<4;i++){ c.beginPath(); c.arc(-11-sw*1.6+i*.8,-30.4+i*.3,.6,0,7); c.fill(); } };
a3Back=function(c,id,D,col,t,w,lean,st){
  if(id==='tidecape'){ const wind=Math.sin(t*1.7)*1.2+(lean||0)*-12, len=36, gr=c.createLinearGradient(-14*w,0,2*w,0); gr.addColorStop(0,D('#0a2a4a')); gr.addColorStop(.6,D('#1a5a8a')); gr.addColorStop(1,D('#3a9ac8')); c.fillStyle=gr;
    c.beginPath(); c.moveTo(-6.6*w,-46.4); c.quadraticCurveTo(-11*w-wind*.4,-46+len*.4,-14*w-wind,-46+len); for(let i=0;i<=8;i++) c.lineTo(-14*w-wind+i*2*w,-46+len+Math.sin(i*1.3+t*3)*1.4); c.lineTo(1*w,-46+len*.6); c.lineTo(4*w,-46.6); c.closePath(); c.fill();
    c.save(); c.clip(); c.strokeStyle=D('#bffcf0'); c.globalAlpha*=.55; c.lineWidth=.6; for(let r=0;r<5;r++){ c.beginPath(); for(let x=-16;x<=4;x+=.6) c.lineTo(x*w,-40+r*7+Math.sin(x*.8+t*2+r)*1.2); c.stroke(); } c.restore();
    c.fillStyle=D('#e8fbff'); for(let i=0;i<8;i++){ c.beginPath(); c.arc(-14*w-wind+i*2*w,-46+len+Math.sin(i*1.3+t*3)*1.4,.7,0,7); c.fill(); } return; }
  if(id==='shellpack'){ const bx=-7.4*w; c.fillStyle=a3Grad(c,-48,-28,D('#f2b8a0'),.3,.3); c.beginPath(); c.moveTo(bx-1.6,-28); for(let i=0;i<=8;i++){ const a=Math.PI*(1+i/8); c.lineTo(bx-1.6+Math.cos(a)*6.4,-36+Math.sin(a)*9); } c.closePath(); c.fill();
    c.strokeStyle=D('#c87a68'); c.lineWidth=.5; c.beginPath(); for(let i=1;i<8;i++){ const a=Math.PI*(1+i/8); c.moveTo(bx-1.6,-28); c.lineTo(bx-1.6+Math.cos(a)*6.4,-36+Math.sin(a)*9); } c.stroke(); c.fillStyle=D('#e89a88'); c.fillRect(bx-4,-29,5,2);
    c.strokeStyle=D('#8a5a48'); c.lineWidth=1.2; c.beginPath(); c.moveTo(-3.4*w,-46.4); c.quadraticCurveTo(1*w,-44,1.6*w,-36); c.stroke(); return; }
  if(id==='tidewings'){ const flap=Math.sin(t*2)*.1; c.save(); c.translate(-4*w,-42); c.rotate(-.15+flap);
    for(const [sc,al] of [[.8,.5],[1,.85]]){ c.save(); c.scale(sc,sc); c.globalAlpha*=al; const gr=c.createLinearGradient(-16,-14,0,6); gr.addColorStop(0,'rgba(190,252,240,.9)'); gr.addColorStop(1,'rgba(40,140,200,.55)'); c.fillStyle=gr;
      c.beginPath(); c.moveTo(0,0); c.quadraticCurveTo(-6,-16,-17,-13); c.quadraticCurveTo(-13,-8,-16,-4); c.quadraticCurveTo(-11,-4,-12,1); c.quadraticCurveTo(-7,0,-7,4); c.quadraticCurveTo(-3,2,0,4); c.closePath(); c.fill();
      c.strokeStyle='rgba(235,255,255,.8)'; c.lineWidth=.5; c.beginPath(); for(let r=0;r<3;r++){ for(let x=-15;x<=-1;x+=.6) c.lineTo(x,-10+r*4+Math.sin(x*.9+t*3+r)*.7); c.moveTo(-15,-6+r*4); } c.stroke(); c.restore(); }
    c.fillStyle='rgba(235,255,255,.85)'; for(let i=0;i<5;i++){ const k=((t*.6+i/5)%1); c.beginPath(); c.arc(-14+k*4,-12+k*16,.6*(1-k),0,7); c.fill(); } c.restore(); return; }
  return _a3Back_0(c,id,D,col,t,w,lean,st); };

// ---------- hats redrawn for the side-view angler (0.3): helmets show a window or visor at the front so the face
// still shows, and the ushanka's flap sits over the ear instead of the face. Hat space: head centre (0,0), radius 7.5, facing right.
const _drawHat_0 = drawHat;
drawHat = function(c,id,col,t=0){ const sh=(x0,y0,x1,y1,a,b)=>{ const g=c.createLinearGradient(x0,y0,x1,y1); g.addColorStop(0,a); g.addColorStop(1,b); return g; };
  switch(id){
    case 'diver': { c.save(); c.fillStyle=sh(-10,-10,8,10,'#e8b860','#8a5a1a'); c.beginPath(); c.arc(-.4,.4,11.2,0,7); c.moveTo(10,.4); c.arc(5.2,.4,4.8,0,7,true); c.fill('evenodd');
      c.fillStyle='rgba(150,210,235,.26)'; c.beginPath(); c.arc(5.2,.4,4.8,0,7); c.fill(); c.fillStyle='rgba(255,255,255,.45)'; c.beginPath(); c.ellipse(6.6,-2.2,1.6,.8,-.6,0,7); c.fill();
      c.strokeStyle='#6a4410'; c.lineWidth=1.3; c.beginPath(); c.arc(5.2,.4,4.8,0,7); c.stroke(); c.fillStyle='#5a3a10'; for(let i=0;i<6;i++){ const a=i/6*Math.PI*2; c.beginPath(); c.arc(5.2+Math.cos(a)*4.8,.4+Math.sin(a)*4.8,.45,0,7); c.fill(); }
      c.fillStyle='#2a4a5a'; c.beginPath(); c.arc(-5,-1.6,2.4,0,7); c.fill(); c.strokeStyle='#6a4410'; c.lineWidth=.8; c.stroke(); c.fillStyle='#c8963a'; c.fillRect(-2.2,-12.6,3,2.4); c.fillRect(-11.6,6,23,3.4); c.fillStyle='#6a4410'; for(let x=-10;x<12;x+=3.6){ c.beginPath(); c.arc(x,7.7,.45,0,7); c.fill(); }
      c.fillStyle='rgba(255,255,255,.3)'; c.beginPath(); c.ellipse(-4,-7,4,1.6,-.5,0,7); c.fill(); c.restore(); return; }
    case 'astro': { c.save(); c.fillStyle=sh(-10,-10,8,10,'#ffffff','#b8c0c8'); c.beginPath(); c.arc(-.4,.2,11.4,0,7); c.moveTo(11.2,.2); c.ellipse(5,0,6.2,6.8,0,0,7,true); c.fill('evenodd');
      c.fillStyle='rgba(220,170,60,.42)'; c.beginPath(); c.ellipse(5,0,6.2,6.8,0,0,7); c.fill(); c.strokeStyle='#9aa4ae'; c.lineWidth=1; c.stroke(); c.fillStyle='rgba(255,255,255,.55)'; c.beginPath(); c.ellipse(6.6,-3.4,2.4,1,-.6,0,7); c.fill();
      c.fillStyle='#c8d0d8'; c.beginPath(); c.arc(-3.4,1,2.6,0,7); c.fill(); c.fillStyle='#8a949e'; c.beginPath(); c.arc(-3.4,1,1.2,0,7); c.fill(); c.fillStyle='#e8303a'; c.beginPath(); c.arc(-8.4,-4.6,.9,0,7); c.fill(); c.fillStyle='#d8dde2'; c.fillRect(-11.4,8,22.4,3); c.restore(); return; }
    case 'knight': { c.save(); c.fillStyle=sh(-10,-10,8,10,'#d8dde4','#6a7078'); c.beginPath(); c.moveTo(-1,-10.4); c.arc(-1,0,10.4,-Math.PI/2,Math.PI/2,true); c.lineTo(6,10.4); c.quadraticCurveTo(10.4,6,9.6,0); c.quadraticCurveTo(10,-6,7,-8.6); c.quadraticCurveTo(3,-11,-1,-10.4); c.fill();
      c.fillStyle='#1a1c22'; c.fillRect(3,-1.4,6.8,1.3); c.fillRect(3.6,1.2,6,.9); for(let i=0;i<4;i++){ c.beginPath(); c.arc(6+i*.9,4.6,.32,0,7); c.fill(); } c.strokeStyle='rgba(0,0,0,.3)'; c.lineWidth=.5; c.beginPath(); c.moveTo(-1,-10); c.lineTo(-1,10); c.stroke();
      c.fillStyle=col; c.beginPath(); c.moveTo(-2,-10); c.quadraticCurveTo(-9,-19,-13,-10); c.quadraticCurveTo(-7,-14,-2,-8.6); c.fill(); c.fillStyle='rgba(255,255,255,.35)'; c.beginPath(); c.ellipse(1,-6,3.4,1.2,-.4,0,7); c.fill(); c.restore(); return; }
    case 'pumpkin': { c.save(); c.fillStyle=sh(-10,-10,8,10,'#ffb04a','#c85a10'); c.beginPath(); c.ellipse(0,-.4,10.8,10.2,0,0,7); c.fill(); c.strokeStyle='rgba(150,60,10,.45)'; c.lineWidth=.7; for(const k of [-.6,-.2,.2,.6]){ c.beginPath(); c.ellipse(0,-.4,10.8*Math.abs(k),10.2,0,-Math.PI/2,Math.PI/2,k<0); c.stroke(); }
      c.fillStyle='#ffd23a'; c.beginPath(); c.moveTo(4.6,-4); c.lineTo(8,-3.4); c.lineTo(6,-.4); c.closePath(); c.fill(); c.beginPath(); c.moveTo(3.6,3); c.lineTo(9.4,2.4); c.lineTo(8.6,4.6); c.lineTo(7.2,3.8); c.lineTo(6,5.4); c.lineTo(4.6,4.2); c.closePath(); c.fill();
      c.fillStyle='#3a6a2a'; c.beginPath(); c.moveTo(-1,-10); c.quadraticCurveTo(0,-13.4,2,-13.6); c.lineTo(2,-12.4); c.quadraticCurveTo(.6,-12,1,-9.8); c.closePath(); c.fill(); c.restore(); return; }
    case 'ushanka': { const dk=mix(col,'#000000',.3), lt=mix(col,'#ffffff',.3); c.save(); c.fillStyle=sh(-8,-10,8,-2,lt,col); c.beginPath(); c.arc(0,-1.6,8.8,Math.PI,0); c.closePath(); c.fill();
      c.fillStyle=lt; c.beginPath(); c.roundRect?c.roundRect(-9.2,-4.4,18.8,3.6,1.8):c.rect(-9.2,-4.4,18.8,3.6); c.fill(); c.fillStyle=col; c.beginPath(); c.roundRect?c.roundRect(-5,-2.2,5,9.6,2.2):c.rect(-5,-2.2,5,9.6); c.fill();
      c.strokeStyle=dk; c.lineWidth=.35; for(let i=0;i<9;i++){ c.beginPath(); c.moveTo(-8.6+i*2,-4.2); c.lineTo(-8.2+i*2,-1); c.stroke(); } for(let i=0;i<4;i++){ c.beginPath(); c.moveTo(-4.4+i*1.2,-1.6); c.lineTo(-4.2+i*1.2,6.8); c.stroke(); }
      c.strokeStyle='#5a4a3a'; c.lineWidth=.4; c.beginPath(); c.moveTo(-2.4,7.4); c.quadraticCurveTo(-2.8,9.4,-1.4,10.4); c.stroke(); c.restore(); return; }
  }
  return _drawHat_0(c,id,col,t); };

// ---------- more hats redrawn for the side view (0.3 round 4) ----------
const _drawHat_1 = drawHat;
drawHat = function(c,id,col,t=0){ const dk=mix(col,'#000000',.3), lt=mix(col,'#ffffff',.3), F=cl=>{ c.fillStyle=cl; }, sh=(y0,y1,a,b)=>{ const g=c.createLinearGradient(0,y0,0,y1); g.addColorStop(0,a); g.addColorStop(1,b); return g; };
  switch(id){
    case 'bucket': { c.save(); c.fillStyle=sh(-12,-3,lt,col); c.beginPath(); c.moveTo(-8.2,-3.4); c.quadraticCurveTo(-8.6,-11.6,0,-12); c.quadraticCurveTo(8.8,-11.6,8.6,-3.4); c.closePath(); c.fill();
      F(dk); c.fillRect(-8.4,-5.4,17,1.8); c.fillStyle=sh(-4,1.4,col,dk); c.beginPath(); c.moveTo(-11.8,.8); c.quadraticCurveTo(-9.6,-3.6,0,-3.8); c.quadraticCurveTo(10,-3.6,12.8,.6); c.quadraticCurveTo(12.6,1.8,11.6,1.6); c.quadraticCurveTo(0,-1.2,-10.8,1.8); c.quadraticCurveTo(-12.2,1.8,-11.8,.8); c.fill();
      c.strokeStyle=mix(col,'#ffffff',.2); c.lineWidth=.3; c.setLineDash([.7,.6]); c.beginPath(); c.moveTo(-10.6,.4); c.quadraticCurveTo(0,-2.6,11.4,.2); c.moveTo(-7.6,-8); c.quadraticCurveTo(0,-10.6,7.8,-8); c.stroke(); c.setLineDash([]); c.restore(); return; }
    case 'pirate': { const blk='#1e1a20'; c.save(); c.fillStyle=sh(-12,-2,'#3a343e',blk); c.beginPath(); c.ellipse(0,-6,7.6,5.4,0,Math.PI,0); c.fill();
      c.beginPath(); c.moveTo(-13,-1.4); c.quadraticCurveTo(-12.6,-8,-10,-11.6); c.quadraticCurveTo(-6,-6.6,0,-6.4); c.quadraticCurveTo(6.6,-6.6,11.2,-12.6); c.quadraticCurveTo(14.4,-8,13.8,-1.2); c.quadraticCurveTo(0,1.8,-13,-1.4); c.fillStyle=blk; c.fill();
      c.strokeStyle='#e8c050'; c.lineWidth=.8; c.beginPath(); c.moveTo(-13,-1.4); c.quadraticCurveTo(-12.6,-8,-10,-11.6); c.quadraticCurveTo(-6,-6.6,0,-6.4); c.quadraticCurveTo(6.6,-6.6,11.2,-12.6); c.quadraticCurveTo(14.4,-8,13.8,-1.2); c.stroke();
      F('#f4f0e6'); c.beginPath(); c.arc(1,-3.8,1.6,0,7); c.fill(); c.fillRect(-.1,-2.6,2.2,1.1); F('#1a1a1a'); c.fillRect(.3,-4.2,.6,.6); c.fillRect(1.3,-4.2,.6,.6); c.restore(); return; }
    case 'mushroom': { c.save(); F('#f2e6cc'); c.beginPath(); c.ellipse(0,-1.4,11.6,2.3,0,0,7); c.fill(); c.strokeStyle='#c8b490'; c.lineWidth=.3; for(let x=-10;x<=10;x+=1.4){ c.beginPath(); c.moveTo(x,-1.6); c.lineTo(x*1.03,-.2); c.stroke(); }
      c.fillStyle=sh(-14,-1,'#ff5a4a','#b8241e'); c.beginPath(); c.moveTo(-12.4,-1.6); c.bezierCurveTo(-12,-12.6,12,-12.6,12.4,-1.6); c.quadraticCurveTo(0,-3.2,-12.4,-1.6); c.fill();
      F('#fffaf0'); for(const [x,y,r] of [[-6,-7.6,1.6],[-1,-10.2,1.3],[4.4,-8.4,1.8],[8.8,-4.6,1.1],[-9.6,-4,1],[1.6,-5.4,.9]]){ c.beginPath(); c.arc(x,y,r,0,7); c.fill(); } c.fillStyle='rgba(255,255,255,.3)'; c.beginPath(); c.ellipse(3,-9.4,4,1.2,-.3,0,7); c.fill(); c.restore(); return; }
    case 'beret': { c.save(); F(dk); c.fillRect(-7.6,-4.4,15.6,1.8); c.fillStyle=sh(-11,-3,lt,col); c.beginPath(); c.ellipse(1.6,-6.6,10.2,3.8,-.12,0,7); c.fill(); F(dk); c.beginPath(); c.arc(0,-10.2,.8,0,7); c.fill(); c.strokeStyle=dk; c.lineWidth=.6; c.beginPath(); c.moveTo(0,-10); c.lineTo(.4,-11.6); c.stroke(); c.restore(); return; }
    case 'sombrero': { c.save(); c.fillStyle=sh(-4,1,lt,dk); c.beginPath(); c.ellipse(.5,-2.6,17.6,2.8,0,0,7); c.fill(); c.fillStyle=sh(-15,-3,lt,col); c.beginPath(); c.moveTo(-6.2,-3.2); c.quadraticCurveTo(-6.6,-15,0,-15.2); c.quadraticCurveTo(6.8,-15,6.4,-3.2); c.closePath(); c.fill();
      c.strokeStyle='#d8302a'; c.lineWidth=.9; c.beginPath(); for(let i=0;i<=8;i++) c.lineTo(-6+i*1.5,-6+(i%2?-1.4:0)); c.stroke(); c.strokeStyle='#2a8a4a'; c.lineWidth=.6; c.beginPath(); c.ellipse(.5,-2.8,16,2.2,0,0,7); c.stroke(); c.restore(); return; }
    case 'sailor': { c.save(); c.fillStyle=sh(-10,-3,'#ffffff','#d8dce4'); c.beginPath(); c.moveTo(-8.2,-3.6); c.quadraticCurveTo(-8.6,-10.6,0,-10.4); c.quadraticCurveTo(8.8,-10.6,8.6,-3.6); c.closePath(); c.fill(); F('#1a2a5a'); c.fillRect(-8.4,-4.6,17,2.2);
      c.fillStyle='#1a2a5a'; c.beginPath(); c.moveTo(-8,-3.6); c.lineTo(-10.6,1.6); c.lineTo(-9.4,1.8); c.lineTo(-7,-2.6); c.closePath(); c.fill(); c.restore(); return; }
  }
  return _drawHat_1(c,id,col,t); };

// ---------- facial hair redrawn for the side view ----------
const _drawFace_1 = drawFace;
drawFace = function(c,lk,D,hair){ const b=lk.beard||'none'; if(!['stubble','mustache','beard','longbeard'].includes(b)) return _drawFace_1(c,lk,D,hair);
  const hairD=D(mix(HAIRS[lk.hair]||'#2a1d14','#000000',.25)), hairL=D(mix(HAIRS[lk.hair]||'#2a1d14','#ffffff',.18));
  const jaw=()=>{ c.beginPath(); c.moveTo(-2.6,-55.6); c.quadraticCurveTo(-2.2,-50.4,1.6,-48.6); c.quadraticCurveTo(5,-47.8,7.4,-49.4); c.quadraticCurveTo(8.6,-51,8,-52.6); c.lineTo(3.4,-52.9); c.quadraticCurveTo(1.6,-53.4,.4,-55.2); c.closePath(); };
  const stache=()=>{ c.fillStyle=hair; c.beginPath(); c.moveTo(4,-53.3); c.quadraticCurveTo(6,-54.4,8.2,-53.6); c.quadraticCurveTo(8.8,-52.8,8.2,-52.5); c.quadraticCurveTo(6.2,-53.2,4.4,-52.4); c.quadraticCurveTo(3.4,-52.6,4,-53.3); c.fill(); c.strokeStyle=hairL; c.lineWidth=.22; c.beginPath(); c.moveTo(5,-53.5); c.lineTo(7.4,-53.4); c.stroke(); };
  c.save();
  if(b==='stubble'){ jaw(); c.save(); c.clip(); c.fillStyle=v3rgba(rgb2hex(hair)||'#2a1d14',.16); c.fillRect(-4,-57,14,10); c.fillStyle=v3rgba(rgb2hex(hair)||'#2a1d14',.55); for(let y=-55.4;y<-48;y+=.55) for(let x=-2.6+((y*10|0)%2)*.27;x<8.4;x+=.55){ const j=Math.sin(x*12.9+y*7.3); c.fillRect(x+j*.12,y+j*.1,.16,.16); } c.restore();
    c.fillStyle=v3rgba(rgb2hex(hair)||'#2a1d14',.45); for(let x=4.2;x<8;x+=.4) for(let y=-53.7;y<-52.7;y+=.4) c.fillRect(x,y,.15,.15); }
  else { jaw(); const g=c.createLinearGradient(0,-56,0,-46); g.addColorStop(0,hairL); g.addColorStop(1,hairD);
    if(b==='beard'){ c.fillStyle=g; c.fill(); }
    if(b==='longbeard'){ c.fillStyle=g; c.beginPath(); c.moveTo(-2.6,-55.6); c.quadraticCurveTo(-3.4,-48,-.6,-43.4); c.quadraticCurveTo(2.6,-38.4,5.4,-37.6); c.quadraticCurveTo(5,-41,7,-44.6); c.quadraticCurveTo(8.8,-48.6,8,-52.6); c.lineTo(3.4,-52.9); c.quadraticCurveTo(1.6,-53.4,.4,-55.2); c.closePath(); c.fill();
      c.strokeStyle=hairD; c.lineWidth=.3; for(let i=0;i<5;i++){ c.beginPath(); c.moveTo(-1+i*1.6,-50.6); c.quadraticCurveTo(-.4+i*1.4,-46,1+i*.9,-41+i*.6); c.stroke(); } }
    if(b!=='mustache'){ c.fillStyle=D('#7a2e24'); c.beginPath(); c.ellipse(5.8,-52.1,1.1,.45,0,0,7); c.globalAlpha*=.0; c.fill(); c.globalAlpha=1; c.strokeStyle=hairD; c.lineWidth=.25; for(let i=0;i<6;i++){ c.beginPath(); c.moveTo(-1.6+i*1.4,-54.4+i*.3); c.lineTo(-1.2+i*1.5,-51.6+i*.2); c.stroke(); } }
    stache(); }
  c.restore();
  return _drawFace_1(c,Object.assign({},lk,{beard:'none'}),D,hair); };
