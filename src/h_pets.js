
// =====================================================================
// Driftline 0.3: pets redrawn in the B2 style (preview only until 0.3 ships).
// Shared rigs (four-legged side-on, sitting front-facing, birds) plus one-of-a-kind pets.
// Every rig reports frames: head {x,y,rot,r,flip,face}, neck {x,y,rot,r}, back {x,y,len,top}
// so every hat and accessory attaches to the body in every pose (drawGear3).
// Moods: idle, watch (while you fish), bite, petted, happy (catch landing), sleep (night).
// =====================================================================
let PET3_FORCE=null; const PET3_FR={};
function petMood3(id){ const now=performance.now();
  if(PET3_FORCE) return {petted:PET3_FORCE==='petted',watch:PET3_FORCE==='watch'||PET3_FORCE==='bite',bite:PET3_FORCE==='bite',happy:PET3_FORCE==='happy',sleep:PET3_FORCE==='sleep',now};
  const pt=id===S.pet?petT:(id===S.pet2?petT2:-9999), petted=now-pt<2200, watch=G.st==='waiting'||G.st==='bite'||G.st==='reeling', happy=G.st==='landing';
  return {petted,watch,bite:G.st==='bite',happy,sleep:PET_NIGHT>.55&&!petted&&!watch&&!happy,now}; }
// colour helper with night dimming; e/ci/ln/pth draw in the pet's local units
function pet3Kit(c,night){ const D=cl=>night?mix(cl,'#0a1018',night*.4):cl;
  return { D, el:(x,y,rx,ry,cl,r=0)=>{ c.fillStyle=D(cl); c.beginPath(); c.ellipse(x,y,Math.max(.01,rx),Math.max(.01,ry),r,0,7); c.fill(); },
    ci:(x,y,r,cl)=>{ c.fillStyle=D(cl); c.beginPath(); c.arc(x,y,Math.max(.01,r),0,7); c.fill(); },
    ln:(pts,cl,w)=>{ c.strokeStyle=D(cl); c.lineWidth=w; c.beginPath(); c.moveTo(pts[0],pts[1]); for(let i=2;i<pts.length;i+=2) c.lineTo(pts[i],pts[i+1]); c.stroke(); },
    qd:(x0,y0,cx,cy,x1,y1,cl,w)=>{ c.strokeStyle=D(cl); c.lineWidth=w; c.beginPath(); c.moveTo(x0,y0); c.quadraticCurveTo(cx,cy,x1,y1); c.stroke(); } }; }
// eyes: open (with highlight), blink, happy arc, closed line
function pet3Eye(c,k,x,y,r,mode,col){ if(mode==='closed'){ k.qd(x-r,y,x,y+r*.7,x+r,y,'#1a1210',r*.45); return; } if(mode==='happy'){ k.qd(x-r,y+r*.3,x,y-r*.9,x+r,y+r*.3,'#1a1210',r*.45); return; }
  k.el(x,y,r*.85,r,col||'#1a1210'); c.fillStyle='rgba(255,255,255,.9)'; c.beginPath(); c.arc(x+r*.3,y-r*.35,r*.32,0,7); c.fill(); }

// ---------------------------------------------------------------------
// FOUR-LEGGED RIG (side-on, facing right)
// ---------------------------------------------------------------------
function rigQuad(c,P,t,night,lk,m,id){
  const k=pet3Kit(c,night), {el,ci,ln,qd}=k, s=P.size||1; c.save(); c.scale(s,s);
  const br=Math.sin(t*2.2)*.18, sleep=m.sleep, rx=P.bodyRx||8, ry=P.bodyRy||4.4, lh=sleep?0:(P.legH||5), lw=P.legW||2.2, hr=P.headR||4.3;
  const by=-(lh+ry)+(sleep?ry*.12:0), main=P.main, dark=P.dark||mix(main,'#000000',.35), belly=P.belly||mix(main,'#ffffff',.35), farC=mix(main,'#000000',.22);
  const wag=(m.petted||m.happy)?22:m.watch?14:7, blink=((t+(P.blinkOff||0))%4.2)<.13;
  // head placement: on a neck (long for llamas, deer, horses), dropped onto the paws when sleeping, turned to the water when watching
  const nl=P.neck||0; let hx=rx*.92+hr*.45+(nl*.35), hy=by-ry*.75-hr*.35-nl, hrot=0;
  if(sleep){ hx=rx*.9+hr*.55; hy=-hr*.92; hrot=.12; } else if(m.watch){ hrot=.1; hx+=.4; } else if(m.petted){ hrot=-.12; } else hrot=Math.sin(t*.9+(P.blinkOff||0))*.04;
  const eyeMode=sleep?'closed':(m.petted||m.happy)?'happy':blink?'closed':'open';
  // cape lies over the back, under the head
  const cape=lk&&lk.acc==='cape'?(lk.accCol||'#d8303a'):null;
  // tail (behind the body)
  const tx=-rx*.92, ty=by-ry*.25, tw=Math.sin(t*wag)*.45;
  pet3Tail(c,k,P.tail||'wag',tx,ty,tw,P.tailCol||main,P,sleep,s);
  // far legs, body, belly, near legs
  const legP=(lx,col,pc)=>{ const top=by+ry*.15, w0=lw*1.08, w1=lw*.82; c.fillStyle=k.D(col); c.beginPath(); c.moveTo(lx-w0/2,top); c.lineTo(lx+w0/2,top); c.quadraticCurveTo(lx+w1/2+.15,-lh*.5,lx+w1/2,-.8); c.lineTo(lx-w1/2,-.8); c.quadraticCurveTo(lx-w1/2-.2,-lh*.5,lx-w0/2,top); c.closePath(); c.fill(); el(lx+.3,-.62,lw*.62,.66,pc); };
  if(!sleep){ for(const lx of [-rx*.62,rx*.5]) legP(lx,farC,mix(P.paw||mix(main,"#000000",.2),"#000000",.15)); }
  el(0,by+br*.2,rx,ry+br,main); { c.save(); c.beginPath(); c.ellipse(0,by+br*.2,rx,ry+br,0,0,7); c.clip(); const vg=c.createLinearGradient(0,by-ry,0,by+ry); vg.addColorStop(0,"rgba(255,240,220,.16)"); vg.addColorStop(.55,"rgba(0,0,0,0)"); vg.addColorStop(1,"rgba(20,10,30,.22)"); c.fillStyle=vg; c.fillRect(-rx,by-ry-1,rx*2,ry*2+2); c.restore(); }
  if(P.wool){ for(let i=0;i<11;i++){ const a=Math.PI*(1.02+i*.098); ci(Math.cos(a)*rx*.92,by+Math.sin(a)*ry*.95,ry*.42,mix(main,'#ffffff',.08)); } for(let i=0;i<5;i++) ci(-rx*.7+i*rx*.35,by+ry*.62,ry*.38,main); }
  el(rx*.15,by+ry*.48,rx*.72,ry*.42,belly);
  if(P.mark) pet3Mark(c,k,P.mark,0,by,rx,ry,P,t);
  if(!sleep){ for(const lx of [-rx*.42,rx*.7]) legP(lx,main,P.paw||mix(main,"#000000",.2)); }
  else { el(rx*.8,-.55,lw*.9,.6,P.paw||dark); el(rx*.45,-.5,lw*.85,.55,P.paw||dark); }
  // cape over the back
  if(cape){ const f0=c.filter; c.filter='none'; const wv=Math.sin(t*3.4)*.5; c.fillStyle=k.D(cape); c.beginPath(); c.moveTo(rx*.55,by-ry*.95); c.quadraticCurveTo(-rx*.2,by-ry*1.25,-rx*.95,by-ry*.55+wv); c.lineTo(-rx*.8,by+ry*.2+wv); c.quadraticCurveTo(-rx*.1,by-ry*.2,rx*.5,by-ry*.4); c.closePath(); c.fill(); c.fillStyle=k.D(mix(cape,'#000000',.28)); c.beginPath(); c.moveTo(-rx*.95,by-ry*.55+wv); c.lineTo(-rx*.8,by+ry*.2+wv); c.lineTo(-rx*.62,by-ry*.1); c.closePath(); c.fill(); c.filter=f0; }
  // rim light along the top of the back
  c.strokeStyle='rgba(255,226,180,.28)'; c.lineWidth=.45; c.beginPath(); c.ellipse(0,by+br*.2,rx*.96,(ry+br)*.96,0,-Math.PI*.85,-Math.PI*.18); c.stroke();
  // neck
  if(!sleep){ c.fillStyle=k.D(main); c.beginPath(); c.moveTo(rx*.48,by-ry*.55); c.quadraticCurveTo(hx-hr*.9,hy+hr*.2,hx-hr*.35,hy+hr*.55); c.lineTo(hx+hr*.2,hy+hr*.7); c.quadraticCurveTo(rx*.95,by,rx*.98,by+ry*.2); c.closePath(); c.fill();
    if(P.mane){ const mc=P.mane; for(let i=0;i<7;i++){ const f=i/6, x0=rx*.45+(hx-hr*.6-rx*.45)*f, y0=by-ry*.62+(hy-hr*.55-(by-ry*.62))*f; k.qd(x0,y0,x0-1.6,y0+1.2,x0-1.1+Math.sin(t*1.4+i)*.25,y0+3.2,mc,1.25); } k.qd(hx-hr*.45,hy-hr*.85,hx+hr*.1,hy-hr*.75,hx+hr*.25,hy-hr*.25,mc,1.1); } }
  // head
  c.save(); c.translate(hx,hy); c.rotate(hrot);
  pet3Ears(c,k,P.ears||'pointy',hr,P.earCol||main,P.earIn||'#e8a0a0',m,t,true,P);
  ci(0,0,hr,main); if(P.headCol) ci(0,0,hr*.98,P.headCol);
  const sl=P.snout||{l:2.4,w:1.7}, sx=hr*.72, sy=hr*.28; el(sx,sy,sl.l,sl.w,sl.col||belly);
  if(P.snoutPig){ el(sx+sl.l*.85,sy,sl.w*.55,sl.w*.75,P.snoutPig); ci(sx+sl.l*.85,sy-sl.w*.25,.28,'#3a1a1a'); ci(sx+sl.l*.85,sy+sl.w*.25,.28,'#3a1a1a'); }
  else { el(sx+sl.l*.82,sy-sl.w*.3,sl.w*.42,sl.w*.32,P.nose||'#1a1416'); c.fillStyle='rgba(255,255,255,.35)'; c.beginPath(); c.arc(sx+sl.l*.78,sy-sl.w*.45,sl.w*.1,0,7); c.fill(); }
  if(P.faceMark) pet3Face(c,k,P.faceMark,hr,P);
  const ex=hr*.28, ey=-hr*.22, er=hr*.2*(P.eyeSize||1);
  pet3Eye(c,k,ex,ey,er,eyeMode,P.eyeCol);
  if(m.petted||m.happy) el(ex-hr*.05,ey+er*1.9,er*1.1,er*.55,'#ff9a9a');
  if(m.petted||m.happy) el(sx+sl.l*.5,sy+sl.w*.85,sl.w*.32,sl.w*.55,'#ff8a9a'); else qd(sx+sl.l*.15,sy+sl.w*.55,sx+sl.l*.45,sy+sl.w*.85,sx+sl.l*.7,sy+sl.w*.5,mix(main,'#000000',.5),.32);
  if(P.horn) pet3Horn(c,k,P.horn,hr,m);
  pet3Ears(c,k,P.ears||'pointy',hr,P.earCol||main,P.earIn||'#e8a0a0',m,t,false,P);
  c.restore();
  if(P.extras) P.extras(c,k,{rx,ry,by,hx,hy,hr,lh,sleep,t,m});
  c.restore();
  // frames (in the pet's local space, size applied)
  PET3_FR[id]={head:{x:hx*s,y:hy*s,rot:hrot,r:hr*s,face:'side'},neck:{x:(rx*.8+(hx-rx*.8)*.45)*s,y:(hy+hr*.95)*s,rot:hrot*.4-.35,r:hr*.8*s,face:'side'},back:{x:0,y:(by-ry)*s,len:rx*s}};
  if(sleep) pet3Zz(c,(hx+hr)*s,(hy-hr*1.6)*s,t);
}
function pet3Zz(c,x,y,t){ c.save(); for(let i=0;i<3;i++){ const ph=(t*.5+i/3)%1; c.globalAlpha=Math.sin(ph*Math.PI)*.85; c.fillStyle='#cfe6ff'; c.font='bold '+(2.6+ph*2.2)+'px system-ui'; c.fillText('z',x+ph*4,y-ph*8); } c.restore(); }
function pet3Tail(c,k,type,x,y,w,col,P,sleep,s){ const {el,ci,qd}=k, D=k.D;
  switch(type){
    case 'fluffy': c.save(); c.translate(x,y); c.rotate(-.7+w); el(-2.2,0,3.2,1.9,col); el(-4.4,-.2,1.5,1.2,P.tailTip||mix(col,'#ffffff',.25)); c.restore(); break;
    case 'bushy': c.save(); c.translate(x,y); c.rotate(-1.15+w*.5); el(-3.5,0,4.8,2.6,col); el(-7,0,1.8,1.6,P.tailTip||'#f4ece0'); c.restore(); break;
    case 'curl': c.strokeStyle=D(col); c.lineWidth=1.6; c.beginPath(); c.arc(x-.6,y-1.6,1.5,Math.PI*.4+w,Math.PI*2.1+w); c.stroke(); break;
    case 'thin': qd(x,y,x-4,y-1+w*3,x-4.6,y-6+w*2,col,1.1); break;
    case 'stub': el(x-.6,y-.6,1.3,1,col); break;
    case 'flat': c.save(); c.translate(x,y+1.4); c.rotate(.25+w*.2); el(-2.6,0,3,1.2,col); c.strokeStyle='rgba(0,0,0,.25)'; c.lineWidth=.25; for(let i=0;i<4;i++){ c.beginPath(); c.moveTo(-4.4+i*1.2,-.9); c.lineTo(-4.4+i*1.2,.9); c.stroke(); } c.restore(); break;
    case 'ringed': c.save(); c.translate(x,y); c.rotate(-.9+w*.5); el(-3,0,3.6,1.7,col); for(let i=0;i<3;i++) el(-1.6-i*1.5,0,.45,1.6,P.ring||'#2a1a14'); c.restore(); break;
    case 'tuft': qd(x,y,x-2.2,y+1.2,x-2.6,y+3.8+w,col,.9); el(x-2.6,y+4.4+w,.9,1.5,P.tailTip||mix(col,'#000000',.3)); break;
    case 'horse': c.save(); c.translate(x,y); c.rotate(.5+w*.3); for(let i=0;i<5;i++) qd(0,0,-2,1.5+i*.4,-1.4+i*.3,6.5,P.mane||mix(col,'#000000',.3),1); c.restore(); break;
    default: qd(x,y,x-3.2,y-1.2+w*2,x-4.6,y-4.2+w*3,col,1.6); ci(x-4.6,y-4.2+w*3,.85,col); }
}
function pet3Ears(c,k,type,hr,col,inn,m,t,back,P){ const {el,ci}=k, D=k.D; const tw=(Math.sin(t*.7+(P.blinkOff||0)*3)>.97)?.25:0, perk=m.watch?-.15:0, flop=m.petted?.35:0;
  if(type==='pointy'){ const ear=(ox,dk)=>{ c.save(); c.translate(ox,-hr*.62); c.rotate(-.15+perk+flop+tw); c.fillStyle=D(dk?mix(col,'#000000',.25):col); c.beginPath(); c.moveTo(-hr*.32,0); c.lineTo(hr*.02,-hr*.85); c.lineTo(hr*.36,0); c.closePath(); c.fill(); if(!dk){ c.fillStyle=D(inn); c.beginPath(); c.moveTo(-hr*.16,-.05); c.lineTo(hr*.02,-hr*.55); c.lineTo(hr*.2,-.05); c.closePath(); c.fill(); } c.restore(); };
    if(back) ear(-hr*.3,true); else ear(hr*.05,false); return; }
  if(type==='floppy'){ if(back) return; c.save(); c.translate(-hr*.2,-hr*.45); c.rotate(.5+flop*.5+tw); el(0,hr*.45,hr*.36,hr*.7,P.earCol||mix(col,'#000000',.25)); c.restore(); return; }
  if(type==='round'){ el(back?-hr*.45:hr*.05,-hr*.78,hr*.34,hr*.32,back?mix(col,'#000000',.25):col); if(!back) el(hr*.05,-hr*.76,hr*.18,hr*.16,inn); return; }
  if(type==='long'){ const L=P.earLen||1; const ear=(ox,dk)=>{ c.save(); c.translate(ox,-hr*.7); c.rotate(-.2+perk+flop*1.4+tw+(L<1?.25:0)); el(0,-hr*.85*L,hr*.3*(L<1?.9:1),hr*.95*L,dk?mix(col,'#000000',.25):col); if(!dk) el(0,-hr*.8*L,hr*.14,hr*.7*L,inn); c.restore(); }; if(back) ear(-hr*.35,true); else ear(hr*.0,false); return; }
  if(type==='tiny'){ if(back) return; el(-hr*.15,-hr*.86,hr*.2,hr*.16,col); return; }
  if(type==='side'){ if(back) return; c.save(); c.translate(-hr*.35,-hr*.3); c.rotate(-.9+flop+tw); el(0,0,hr*.55,hr*.24,col); el(0,0,hr*.32,hr*.12,inn); c.restore(); return; }
}
function pet3Horn(c,k,h,hr,m){ const {D}=k;
  if(h==='goat'){ c.strokeStyle=D('#c8b8a0'); c.lineWidth=hr*.18; c.beginPath(); c.arc(-hr*.25,-hr*.75,hr*.5,Math.PI*1.1,Math.PI*1.95); c.stroke(); }
  if(h==='antlers'){ c.strokeStyle=D('#8a6a3a'); c.lineWidth=hr*.12; c.lineCap='round'; c.beginPath(); c.moveTo(-hr*.1,-hr*.85); c.lineTo(-hr*.3,-hr*1.9); c.moveTo(-hr*.22,-hr*1.4); c.lineTo(-hr*.75,-hr*1.75); c.moveTo(-hr*.28,-hr*1.75); c.lineTo(hr*.12,-hr*2.15); c.stroke(); }
  if(h==='uni'){ c.fillStyle=D('#ffd86a'); c.beginPath(); c.moveTo(hr*.2,-hr*.78); c.lineTo(hr*.9,-hr*2.1); c.lineTo(hr*.55,-hr*.62); c.closePath(); c.fill(); c.strokeStyle=D('#d8a830'); c.lineWidth=.25; for(let i=1;i<4;i++){ c.beginPath(); c.moveTo(hr*(.27+i*.11),-hr*(.85+i*.3)); c.lineTo(hr*(.5+i*.06),-hr*(.78+i*.28)); c.stroke(); } }
  if(h==='cow'){ c.fillStyle=D('#e8dcc0'); c.beginPath(); c.moveTo(-hr*.2,-hr*.75); c.quadraticCurveTo(-hr*.3,-hr*1.25,hr*.05,-hr*1.3); c.lineTo(hr*.02,-hr*.85); c.closePath(); c.fill(); }
}
function pet3Mark(c,k,mk,x0,by,rx,ry,P,t){ const {el,ci,D}=k; c.save(); c.beginPath(); c.ellipse(0,by,rx,ry,0,0,7); c.clip();
  if(mk==='spots'){ for(const [sx,sy,sr] of [[-4,-.8,1.8],[1.6,-1.6,1.4],[4.6,.4,1.2],[-1.2,1.4,1.1]]) el(sx,by+sy,sr*1.3,sr,P.accent||'#1c1414',.4); }
  if(mk==='stripes'){ c.strokeStyle=D(P.accent||'#2a1a10'); c.lineWidth=.8; for(let i=-3;i<=3;i++){ c.beginPath(); c.moveTo(i*2.4-.8,by-ry); c.quadraticCurveTo(i*2.4+.6,by-ry*.2,i*2.4-.2,by+ry*.3); c.stroke(); } }
  if(mk==='saddle'){ el(-.5,by-ry*.55,rx*.8,ry*.55,P.accent||mix(P.main,'#000000',.3)); }
  if(mk==='spines'){ c.restore(); c.save(); c.fillStyle=D(P.accent||'#5a4030'); c.beginPath(); for(let i=0;i<14;i++){ const a=Math.PI*(1.05+i*.064); const x1=Math.cos(a)*rx, y1=by+Math.sin(a)*ry; c.moveTo(x1-.8,y1+.4); c.lineTo(Math.cos(a)*(rx+2.4),by+Math.sin(a)*(ry+2.6)); c.lineTo(x1+.8,y1+.4); } c.fill(); }
  c.restore(); }
function pet3Face(c,k,fm,hr,P){ const {el,ci}=k;
  if(fm==='mask'){ el(hr*.28,-hr*.2,hr*.42,hr*.28,P.accent||'#2a2a2a',-.1); }
  if(fm==='blaze'){ k.qd(hr*.5,-hr*.88,hr*.98,-hr*.55,hr*1.2,hr*.08,'#f6f0e6',hr*.2); }
  if(fm==='patch'){ el(hr*.28,-hr*.2,hr*.3,hr*.36,'#1c1c1c',-.4); }
  if(fm==='cheeks'){ el(hr*.45,hr*.35,hr*.4,hr*.32,'#f4ece0'); }
  if(fm==='tigerface'){ c.strokeStyle=k.D('#2a1a10'); c.lineWidth=.35; c.beginPath(); c.moveTo(-hr*.2,-hr*.9); c.lineTo(-hr*.05,-hr*.55); c.moveTo(hr*.15,-hr*.95); c.lineTo(hr*.2,-hr*.6); c.moveTo(-hr*.7,-hr*.2); c.lineTo(-hr*.35,-hr*.15); c.stroke(); }
}

// ---------------------------------------------------------------------
// gear for every rig, drawn in the pet's head / neck / back frames
// ---------------------------------------------------------------------
function drawGear3(c,id,lk,t){ const F=PET3_FR[id]; if(!F) return false; const hd=F.head, nk=F.neck, col=lk.accCol||'#d8303a', dk=mix(col,'#000000',.3), lt=mix(col,'#ffffff',.35), front=hd.face==='front';
  c.save(); c.lineCap='round'; c.lineJoin='round';
  // neckwear (unit = neck radius)
  if(['bandana','scarf','bowtie','bell'].includes(lk.acc)){ c.save(); c.translate(nk.x,nk.y); c.rotate(nk.rot); c.scale(nk.r,nk.r);
    if(lk.acc==='bandana'){ c.fillStyle=col; c.beginPath(); c.moveTo(-.9,-.15); c.quadraticCurveTo(0,.12,.9,-.15); c.lineTo(.1,1.05); c.closePath(); c.fill(); c.fillStyle=lt; for(const [x,y] of [[-.4,.1],[.3,.15],[.05,.55]]){ c.beginPath(); c.arc(x,y,.07,0,7); c.fill(); } }
    if(lk.acc==='scarf'){ c.fillStyle=col; c.beginPath(); c.moveTo(-.95,-.25); c.quadraticCurveTo(0,.05,.95,-.25); c.lineTo(.95,.18); c.quadraticCurveTo(0,.5,-.95,.18); c.closePath(); c.fill(); c.beginPath(); c.moveTo(-.55,.25); c.lineTo(-.25,.25); c.lineTo(-.35,1.15); c.lineTo(-.6,1.1); c.closePath(); c.fill(); c.strokeStyle=dk; c.lineWidth=.06; c.beginPath(); c.moveTo(-.9,0); c.quadraticCurveTo(0,.3,.9,0); c.stroke(); }
    if(lk.acc==='bowtie'){ c.fillStyle=col; c.beginPath(); c.moveTo(.3,.1); c.lineTo(-.25,-.25); c.lineTo(-.25,.45); c.closePath(); c.moveTo(.3,.1); c.lineTo(.85,-.25); c.lineTo(.85,.45); c.closePath(); c.fill(); c.fillStyle=dk; c.beginPath(); c.arc(.3,.1,.13,0,7); c.fill(); }
    if(lk.acc==='bell'){ c.strokeStyle=col; c.lineWidth=.22; c.beginPath(); c.moveTo(-.9,-.15); c.quadraticCurveTo(0,.15,.9,-.15); c.stroke(); c.fillStyle='#ffcc33'; c.beginPath(); c.arc(.25,.28,.24,0,7); c.fill(); c.fillStyle='rgba(255,255,255,.7)'; c.beginPath(); c.arc(.18,.2,.07,0,7); c.fill(); }
    c.restore(); }
  if(lk.acc==='cape'){ c.save(); c.translate(nk.x,nk.y); c.rotate(nk.rot); c.scale(nk.r,nk.r); c.fillStyle='#e8c060'; c.beginPath(); c.arc(-.55,-.15,.14,0,7); c.fill(); c.restore(); }
  if(lk.acc==='balloon'){ const tx=nk.x-nk.r*.4, ty=nk.y, bx=tx-hd.r*2.4+Math.sin(t*1.5)*1.2, by=ty-hd.r*5.2, R=hd.r*1.05;
    c.strokeStyle='rgba(235,235,235,.9)'; c.lineWidth=.35; c.beginPath(); c.moveTo(tx,ty); c.quadraticCurveTo(tx-hd.r*1.8,ty-hd.r*2,bx,by+R); c.stroke();
    c.fillStyle='#ffd84a'; c.beginPath(); for(let i=0;i<10;i++){ const a=-Math.PI/2+i*Math.PI/5+Math.sin(t*1.2)*.08, rr=i%2?R*.46:R; c.lineTo(bx+Math.cos(a)*rr,by+Math.sin(a)*rr); } c.closePath(); c.fill(); }
  // head-worn (unit = head radius; face 'side' looks right, 'front' looks at you)
  c.save(); c.translate(hd.x,hd.y); if(hd.flip) c.scale(-1,1); c.rotate(hd.rot); const r=hd.r;
  if(lk.acc==='glasses'){ if(front){ c.fillStyle='#14100e'; c.beginPath(); c.ellipse(-r*.38,-r*.18,r*.3,r*.22,0,0,7); c.ellipse(r*.38,-r*.18,r*.3,r*.22,0,0,7); c.fill(); c.strokeStyle='#14100e'; c.lineWidth=r*.08; c.beginPath(); c.moveTo(-r*.1,-r*.22); c.lineTo(r*.1,-r*.22); c.stroke(); }
    else { c.fillStyle='#14100e'; c.beginPath(); c.ellipse(r*.32,-r*.2,r*.3,r*.24,0,0,7); c.fill(); c.strokeStyle='#14100e'; c.lineWidth=r*.08; c.beginPath(); c.moveTo(r*.05,-r*.24); c.lineTo(-r*.55,-r*.32); c.stroke(); }
    c.fillStyle='rgba(255,255,255,.35)'; c.beginPath(); c.ellipse(front?-r*.45:r*.24,-r*.28,r*.09,r*.05,-.4,0,7); c.fill(); }
  if(lk.acc==='bow'){ c.save(); c.translate(front?-r*.6:-r*.45,-r*.82); c.rotate(-.3); c.fillStyle=col; c.beginPath(); c.moveTo(0,0); c.quadraticCurveTo(-r*.42,-r*.3,-r*.4,r*.02); c.quadraticCurveTo(-r*.38,r*.28,0,0); c.moveTo(0,0); c.quadraticCurveTo(r*.42,-r*.3,r*.4,r*.02); c.quadraticCurveTo(r*.38,r*.28,0,0); c.fill(); c.fillStyle=dk; c.beginPath(); c.arc(0,0,r*.1,0,7); c.fill(); c.restore(); }
  if(lk.acc==='flower'){ const fx=front?r*.6:-r*.1, fy=-r*.82; c.fillStyle='#ff9ad0'; for(let i=0;i<5;i++){ c.beginPath(); c.ellipse(fx+Math.cos(i*1.257)*r*.15,fy+Math.sin(i*1.257)*r*.15,r*.12,r*.08,i*1.257,0,7); c.fill(); } c.fillStyle='#ffd84a'; c.beginPath(); c.arc(fx,fy,r*.08,0,7); c.fill(); }
  if(lk.hat && lk.hat!=='none'){ c.save(); c.translate(0,-r*.08); c.scale(r*1.02/7.5,r*1.02/7.5); drawHat(c,lk.hat,HATI[lk.hat]&&HATI[lk.hat].fixed?'#888888':(lk.hatCol||'#c8553a'),t); c.restore(); }
  if(lk.acc==='partyhat'){ c.save(); c.translate(r*.1,-r*.12); c.rotate(.22); c.scale(r*.9/7.5,r*.9/7.5); drawHat(c,'party',col,t); c.restore(); }
  c.restore(); c.restore(); return true; }

// ---------------------------------------------------------------------
// pet definitions: four-legged pets (more rigs follow)
// ---------------------------------------------------------------------
const PET3 = {
  dog:     {rig:'quad', main:'#a8743e', belly:'#e8c89a', ears:'floppy', earCol:'#7a4f26', tail:'wag', snout:{l:2.6,w:1.8,col:'#d8b080'}, blinkOff:.3},
  puppy:   {rig:'quad', main:'#e8b868', belly:'#f8e2b0', ears:'floppy', earCol:'#c8903e', tail:'fluffy', snout:{l:2.2,w:1.7,col:'#f8e2b0'}, size:.9, headR:4.6, blinkOff:1.1},
  corgi:   {rig:'quad', main:'#d8883a', belly:'#f8f0e4', ears:'pointy', earIn:'#f0c0a8', tail:'stub', legH:3, bodyRx:8.6, faceMark:'blaze', snout:{l:2.4,w:1.7,col:'#f8f0e4'}, blinkOff:.7},
  shiba:   {rig:'quad', main:'#d8843a', belly:'#f8ecd8', ears:'pointy', earIn:'#f8d8c0', tail:'curl', faceMark:'cheeks', snout:{l:2.3,w:1.7,col:'#f8ecd8'}, blinkOff:2},
  cat:     {rig:'quad', main:'#8a8a94', belly:'#c8c8d0', ears:'pointy', earIn:'#e8b0b8', tail:'thin', legH:4.2, bodyRx:7.4, headR:4, snout:{l:1.4,w:1.2,col:'#c8c8d0'}, nose:'#d87a8a', eyeCol:'#4a8a3a', mark:'stripes', accent:'#6a6a74', blinkOff:1.6},
  kitten:  {rig:'quad', main:'#f0a860', belly:'#f8e0c0', ears:'pointy', earIn:'#f8c0b0', tail:'thin', legH:3.6, bodyRx:6.4, bodyRy:3.8, headR:4.2, size:.9, snout:{l:1.3,w:1.1,col:'#f8e0c0'}, nose:'#e88a9a', eyeCol:'#3a6aa8', eyeSize:1.15, blinkOff:.2},
  fox:     {rig:'quad', main:'#e0702a', belly:'#f8ecdc', ears:'pointy', earCol:'#e0702a', earIn:'#3a2418', tail:'bushy', snout:{l:2.8,w:1.4,col:'#f8ecdc'}, paw:'#2a1a14', faceMark:'cheeks', blinkOff:2.4},
  raccoon: {rig:'quad', main:'#8a8a8e', belly:'#c8c4c0', ears:'round', earIn:'#4a4a4e', tail:'ringed', ring:'#2a2a2e', snout:{l:2,w:1.4,col:'#e8e4e0'}, faceMark:'mask', accent:'#2a2a2e', legH:3.6, blinkOff:1.3},
  redpanda:{rig:'quad', main:'#c8502a', belly:'#3a2018', ears:'round', earIn:'#f4ece0', tail:'ringed', ring:'#7a2a14', snout:{l:1.8,w:1.4,col:'#f4ece0'}, faceMark:'cheeks', paw:'#2a1410', legH:3.6, blinkOff:.9},
  tiger:   {rig:'quad', main:'#e8822a', belly:'#f8ecdc', ears:'round', earIn:'#f8ecdc', tail:'ringed', ring:'#2a1a10', snout:{l:2,w:1.6,col:'#f8ecdc'}, nose:'#d8706a', mark:'stripes', accent:'#2a1a10', faceMark:'tigerface', headR:4.6, blinkOff:2.8},
  rabbit:  {rig:'quad', main:'#e8dcd0', belly:'#f8f4f0', ears:'long', earIn:'#f0b8c0', tail:'stub', tailCol:'#ffffff', legH:2.6, bodyRx:6.6, bodyRy:4.6, headR:3.9, snout:{l:1.3,w:1.2,col:'#f8f4f0'}, nose:'#e88a9a', blinkOff:.5},
  hamster: {rig:'quad', main:'#e0a868', belly:'#f8ecdc', ears:'round', earIn:'#f0b8b0', tail:'stub', legH:1.6, bodyRx:5.4, bodyRy:4.2, headR:3.8, size:.85, snout:{l:1.2,w:1.2,col:'#f8ecdc'}, nose:'#e88a9a', faceMark:'cheeks', blinkOff:1.9},
  hedgehog:{rig:'quad', main:'#c8a07a', belly:'#f0dcc0', ears:'tiny', tail:'stub', legH:1.8, bodyRx:6.4, bodyRy:4, headR:3.4, mark:'spines', accent:'#5a4030', snout:{l:2.2,w:1.2,col:'#f0dcc0'}, blinkOff:.4},
  pig:     {rig:'quad', main:'#f4b0b8', belly:'#f8d0d4', ears:'floppy', earCol:'#e898a2', tail:'curl', snout:{l:1.2,w:1.6,col:'#f4b0b8'}, snoutPig:'#e890a0', legH:3.4, bodyRx:8.2, bodyRy:5, blinkOff:2.2},
  capybara:{rig:'quad', main:'#a0764a', belly:'#b88a5e', ears:'tiny', tail:'stub', legH:3, bodyRx:8.6, bodyRy:5, headR:4.4, snout:{l:3,w:2.2,col:'#8a6440'}, nose:'#3a2418', blinkOff:1, extras:(c,k,f)=>{ if(f.sleep) return; k.ci(f.hx-f.hr*.1,f.hy-f.hr*1.2,f.hr*.55,'#ff9a3a'); k.el(f.hx-f.hr*.05,f.hy-f.hr*1.7,f.hr*.15,f.hr*.1,'#4a8a3a'); }},
  goat:    {rig:'quad', main:'#f0ece4', belly:'#ffffff', ears:'side', earIn:'#e8c0b8', tail:'stub', horn:'goat', snout:{l:2.4,w:1.4,col:'#f8f4ee'}, nose:'#8a7a70', legH:5.6, legW:1.8, blinkOff:.6, extras:(c,k,f)=>{ if(f.sleep) return; k.el(f.hx+f.hr*1.1,f.hy+f.hr*1.15,f.hr*.16,f.hr*.4,'#e8e0d4'); }},
  sheep:   {rig:'quad', main:'#f4f0ea', belly:'#f4f0ea', wool:true, ears:'side', earCol:'#2a2a2e', earIn:'#4a4a4e', headCol:'#2a2a2e', tail:'stub', snout:{l:1.8,w:1.5,col:'#3a3a3e'}, nose:'#1a1a1e', legH:4, legW:1.6, paw:'#1a1a1e', bodyRx:8, bodyRy:5, eyeCol:'#f4f0ea', blinkOff:1.4},
  llama:   {rig:'quad', main:'#f0e2c8', belly:'#f8f0e0', ears:'long', earLen:.55, earIn:'#d8c0a0', tail:'fluffy', neck:5, legH:6, legW:1.8, snout:{l:2.2,w:1.6,col:'#f8f0e0'}, nose:'#6a5040', blinkOff:2.6},
  alpaca:  {rig:'quad', main:'#e8d0b0', belly:'#f4e4cc', wool:true, ears:'long', earLen:.5, earIn:'#c8a888', tail:'fluffy', neck:4, legH:5, legW:1.8, snout:{l:1.8,w:1.5,col:'#f4e4cc'}, nose:'#6a5040', blinkOff:.15},
  deer:    {rig:'quad', main:'#b8763e', belly:'#f0dcc0', ears:'side', earIn:'#e8c0a0', tail:'stub', tailCol:'#f8f0e8', horn:'antlers', neck:2.4, legH:6.4, legW:1.5, snout:{l:2.4,w:1.4,col:'#d8a878'}, mark:'spots', accent:'#f4e8d8', blinkOff:1.8},
  horse:   {rig:'quad', main:'#8a5a32', belly:'#a06a3e', ears:'pointy', earIn:'#5a3a20', tail:'horse', mane:'#2a1a10', neck:3.4, legH:7, legW:2, bodyRx:9.4, bodyRy:5, headR:4, snout:{l:3.4,w:2,col:'#a06a3e'}, nose:'#3a2418', faceMark:'blaze', size:.95, blinkOff:.8},
  unicorn: {rig:'quad', main:'#f8f4fa', belly:'#ffffff', ears:'pointy', earIn:'#f8c8e0', tail:'horse', mane:'#c89aff', horn:'uni', neck:3, legH:6.6, legW:1.9, bodyRx:9, bodyRy:4.8, headR:4, snout:{l:3,w:1.9,col:'#ffffff'}, nose:'#d8b0c8', size:.95, blinkOff:2.1},
  cow:     {rig:'quad', main:'#f8f6f2', belly:'#f8f6f2', ears:'side', earIn:'#f0b8b8', tail:'tuft', tailTip:'#1c1414', horn:'cow', mark:'spots', accent:'#1c1414', legH:5.4, bodyRx:9.6, bodyRy:5.4, headR:4.4, snout:{l:2,w:2.2,col:'#f4b8b8'}, nose:'#c88a8a', size:.95, blinkOff:1.2},
  polarbear:{rig:'quad', main:'#f4f6f8', belly:'#ffffff', ears:'round', earIn:'#d8dce4', tail:'stub', legH:3.8, legW:2.6, bodyRx:8.4, bodyRy:5, headR:4.4, snout:{l:2.2,w:1.8,col:'#ffffff'}, nose:'#1c1c22', blinkOff:2.9},
};
// every pet without its own entry yet keeps the old drawing until its rig is done
function drawPet3(c,id,x,y,s,t,night,lk){ const P=PET3[id]; if(!P) return false; c.save(); c.translate(x,y); c.scale(s,s); const m=petMood3(id);
  if(P.rig==='quad') rigQuad(c,P,t,night,lk,m,id);
  c.restore(); const F=PET3_FR[id]; if(F){ for(const kk of ['head','neck']){ F[kk].x=F[kk].x*s+x; F[kk].y=F[kk].y*s+y; F[kk].r*=s; } F.back.x=F.back.x*s+x; F.back.y=F.back.y*s+y; } return true; }

if(/[?&]test\b/.test(location.search)){
  window.__pet3Sheet=(opts={})=>{ const ids=(opts.ids||Object.keys(PET3)); const moods=opts.moods||['idle','watch','petted','sleep'];
    const cols=opts.cols||[['none','none'],['bandana','none'],['bow','none'],['scarf','none'],['bell','none'],['glasses','none'],['cape','none'],['balloon','none'],['partyhat','none'],['none','cap'],['none','bucket'],['none','straw']];
    const cw=opts.cell||120, ch=Math.round(cw*.9); const o=document.createElement('canvas'); const rows=[]; ids.forEach(id=>moods.forEach(md=>rows.push([id,md])));
    o.width=cw*cols.length; o.height=ch*rows.length; const x=o.getContext('2d'); const t=1.7;
    rows.forEach(([id,md],r)=>cols.forEach(([acc,hat],cI)=>{ PET3_FORCE=md==='idle'?'none':md; const lk=Object.assign({},petLook(id),{acc,accCol:'#d8303a',hat,hatCol:'#3f7a6a',tint:'none'});
      x.save(); x.beginPath(); x.rect(cI*cw,r*ch,cw,ch); x.clip(); x.fillStyle=(r+cI)%2?'#2e3858':'#283150'; x.fillRect(cI*cw,r*ch,cw,ch);
      drawPetStyled(x,id,cI*cw+cw*.42,r*ch+ch*.86,3.1*cw/120,t,0,lk); x.restore(); x.fillStyle='#cfd8ff'; x.font='9px system-ui'; x.fillText(id+' '+md+' '+acc+(hat!=='none'?' '+hat:''),cI*cw+3,r*ch+10); }));
    PET3_FORCE=null; window.__post(opts.save||'pet3',o.toDataURL()); return rows.length; };
}