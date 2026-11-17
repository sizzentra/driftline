
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
  if(P.shell){ el(0,by-ry*.15,rx*1.08,ry*1.32,P.shell); c.save(); c.beginPath(); c.ellipse(0,by-ry*.15,rx*1.08,ry*1.32,0,0,7); c.clip(); c.strokeStyle=k.D(P.shellLine); c.lineWidth=.35;
    for(const [cx2,cy2] of [[-3.4,-.6],[0,-1.4],[3.4,-.6],[-1.7,1.6],[1.7,1.6],[-5,1.2],[5,1.2]]){ c.beginPath(); for(let a=0;a<6;a++){ const ang=a*Math.PI/3+Math.PI/6; c.lineTo(cx2+Math.cos(ang)*1.7,by+cy2+Math.sin(ang)*1.4); } c.closePath(); c.stroke(); }
    c.restore(); el(0,by+ry*.95,rx*1.1,ry*.25,mix(P.shell,'#000000',.3)); c.strokeStyle='rgba(255,240,200,.35)'; c.lineWidth=.4; c.beginPath(); c.ellipse(0,by-ry*.15,rx,ry*1.24,0,-Math.PI*.85,-Math.PI*.2); c.stroke(); }
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
  pet3Ears(c,k,P.ears||'pointy',hr,P.earCol||main,P.earIn||'#e8a0a0',m,t,true,P); if(P.headBehind) P.headBehind(c,k,hr,t,m);
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
    case 'reptile': { const ww=w*.6; c.fillStyle=D(col); c.beginPath(); c.moveTo(x+.6,y-1.4); c.quadraticCurveTo(x-4,y-1+ww,x-9,-.6+ww*.5); c.quadraticCurveTo(x-4,y+1.4+ww,x+.6,y+1.4); c.closePath(); c.fill(); if(P.spikes){ c.fillStyle=D(P.spikes); for(let i=0;i<4;i++){ const f=i/4, sx2=x-1-f*7, sy2=y-1.2+f*(1.4)+ww*f*.5; c.beginPath(); c.moveTo(sx2-.6,sy2); c.lineTo(sx2,sy2-1.1); c.lineTo(sx2+.6,sy2); c.fill(); } } break; }
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
// 0.3.6: where the top of a pet's head really is, at a point across the head (in head radii from its centre). Pets with
// wide, flat or odd heads (frog, slime, crab, jellyfish...) don't match a circle, so a bow placed on the circle floated
// above them. Measured once per pet by drawing the pet alone off screen, then remembered.
const PET_TOP={};
function petTopK(id,xk,t){ /* a head turned upside down or on its side (the bat hanging asleep): the outline scan would find the perch, not the head, so use the head circle */ const F0=PET3_FR[id]; if(F0&&F0.head&&Math.cos(F0.head.rot||0)<.5) return null; const key=id+'|'+xk; if(key in PET_TOP) return PET_TOP[key]; PET_TOP[key]=null;
  try{ const S=320, cv=document.createElement('canvas'); cv.width=cv.height=S; const x=cv.getContext('2d',{willReadFrequently:true});
    const lk=Object.assign({},petLook(id),{acc:'none',hat:'none'}); drawPetStyled(x,id,S/2,S*.8,4,t||0,0,lk); const F=PET3_FR[id]; if(!F) return null;
    const hd=F.head, col=Math.round(hd.x+(hd.flip?-1:1)*xk*hd.r); if(col<1||col>S-2) return null; const d=x.getImageData(col-1,0,3,S).data;
    for(let y=0;y<S;y++){ if(d[(y*3+1)*4+3]>110){ PET_TOP[key]=(y-hd.y)/hd.r; break; } } }catch(e){}
  return PET_TOP[key]; }
function drawGear3(c,id,lk,t){ const F=PET3_FR[id]; if(!F) return false; const hd=F.head, nk=F.neck, col=lk.accCol||'#d8303a', dk=mix(col,'#000000',.3), lt=mix(col,'#ffffff',.35), front=hd.face==='front';
  c.save(); c.lineCap='round'; c.lineJoin='round';
  // neckwear (unit = neck radius)
  if(['bandana','scarf','bowtie','bell'].includes(lk.acc)){ c.save(); c.translate(nk.x,nk.y); c.rotate(nk.rot); c.scale(nk.r,nk.r);
    if(lk.acc==='bandana'){ c.fillStyle=col; c.beginPath(); c.moveTo(-.9,-.15); c.quadraticCurveTo(0,.12,.9,-.15); c.lineTo(.1,1.05); c.closePath(); c.fill(); c.fillStyle=lt; for(const [x,y] of [[-.4,.1],[.3,.15],[.05,.55]]){ c.beginPath(); c.arc(x,y,.07,0,7); c.fill(); } }
    if(lk.acc==='scarf'){ c.fillStyle=col; c.beginPath(); c.moveTo(-.95,-.25); c.quadraticCurveTo(0,.05,.95,-.25); c.lineTo(.95,.18); c.quadraticCurveTo(0,.5,-.95,.18); c.closePath(); c.fill(); c.beginPath(); c.moveTo(-.55,.25); c.lineTo(-.25,.25); c.lineTo(-.35,1.15); c.lineTo(-.6,1.1); c.closePath(); c.fill(); c.strokeStyle=dk; c.lineWidth=.06; c.beginPath(); c.moveTo(-.9,0); c.quadraticCurveTo(0,.3,.9,0); c.stroke(); }
    if(lk.acc==='bowtie'){ c.fillStyle=col; c.beginPath(); c.moveTo(.3,.1); c.lineTo(-.25,-.25); c.lineTo(-.25,.45); c.closePath(); c.moveTo(.3,.1); c.lineTo(.85,-.25); c.lineTo(.85,.45); c.closePath(); c.fill(); c.fillStyle=dk; c.beginPath(); c.arc(.3,.1,.13,0,7); c.fill(); }
    if(lk.acc==='bell'){ c.strokeStyle=col; c.lineWidth=.22; c.beginPath(); c.moveTo(-.9,-.15); c.quadraticCurveTo(0,.15,.9,-.15); c.stroke(); c.fillStyle='#ffcc33'; c.beginPath(); c.arc(.25,.28,.24,0,7); c.fill(); c.fillStyle='rgba(255,255,255,.7)'; c.beginPath(); c.arc(.18,.2,.07,0,7); c.fill(); }
    c.restore(); }
  if(lk.acc==='cape'&&Math.cos(nk.rot||0)>-.5){ c.save(); c.translate(nk.x,nk.y); c.rotate(nk.rot); c.scale(nk.r,nk.r); c.fillStyle='#e8c060'; c.beginPath(); c.arc(-.55,-.15,.14,0,7); c.fill(); c.restore(); }
  if(lk.acc==='balloon'){ const tx=nk.x-nk.r*.4, ty=nk.y, bx=tx-hd.r*2.4+Math.sin(t*1.5)*1.2, by=ty-hd.r*5.2, R=hd.r*1.05;
    c.strokeStyle='rgba(235,235,235,.9)'; c.lineWidth=.35; c.beginPath(); c.moveTo(tx,ty); c.quadraticCurveTo(tx-hd.r*1.8,ty-hd.r*2,bx,by+R); c.stroke();
    c.fillStyle='#ffd84a'; c.beginPath(); for(let i=0;i<10;i++){ const a=-Math.PI/2+i*Math.PI/5+Math.sin(t*1.2)*.08, rr=i%2?R*.46:R; c.lineTo(bx+Math.cos(a)*rr,by+Math.sin(a)*rr); } c.closePath(); c.fill(); }
  // head-worn (unit = head radius; face 'side' looks right, 'front' looks at you)
  c.save(); c.translate(hd.x,hd.y); if(hd.flip) c.scale(-1,1); c.rotate(hd.rot); const r=hd.r;
  const gx=hd.gx||.38, gy=hd.gy!=null?hd.gy:(front?-.18:-.2), gs=hd.gs||1;
  if(lk.acc==='glasses'){ if(front){ c.fillStyle='#14100e'; c.beginPath(); c.ellipse(-r*gx,r*gy,r*.3*gs,r*.22*gs,0,0,7); c.ellipse(r*gx,r*gy,r*.3*gs,r*.22*gs,0,0,7); c.fill(); c.strokeStyle='#14100e'; c.lineWidth=r*.08*gs; c.beginPath(); c.moveTo(-r*(gx-.28*gs),r*gy-r*.04); c.lineTo(r*(gx-.28*gs),r*gy-r*.04); c.stroke(); }
    else { c.fillStyle='#14100e'; c.beginPath(); c.ellipse(r*.32,r*gy,r*.3*gs,r*.24*gs,0,0,7); c.fill(); c.strokeStyle='#14100e'; c.lineWidth=r*.08*gs; c.beginPath(); c.moveTo(r*.05,r*gy-r*.04); c.lineTo(-r*.55,r*gy-r*.12); c.stroke(); }
    c.strokeStyle='rgba(205,215,235,.75)'; c.lineWidth=r*.05; c.beginPath(); if(front){ c.ellipse(-r*gx,r*gy,r*.3*gs,r*.22*gs,0,0,7); c.moveTo(r*gx+r*.3*gs,r*gy); c.ellipse(r*gx,r*gy,r*.3*gs,r*.22*gs,0,0,7); } else c.ellipse(r*.32,r*gy,r*.3*gs,r*.24*gs,0,0,7); c.stroke();
    c.fillStyle='rgba(255,255,255,.35)'; c.beginPath(); c.ellipse(front?-r*(gx+.07):r*.24,r*gy-r*.1,r*.09,r*.05,-.4,0,7); c.fill(); }
  if(lk.acc==='bow'){ const bxk=front?-.6:-.45, bt=petTopK(id,bxk,t); c.save(); c.translate(bxk*r,(bt==null?-.82:bt+.06)*r); c.rotate(-.3); c.fillStyle=col; c.beginPath(); c.moveTo(0,0); c.quadraticCurveTo(-r*.42,-r*.3,-r*.4,r*.02); c.quadraticCurveTo(-r*.38,r*.28,0,0); c.moveTo(0,0); c.quadraticCurveTo(r*.42,-r*.3,r*.4,r*.02); c.quadraticCurveTo(r*.38,r*.28,0,0); c.fill(); c.fillStyle=dk; c.beginPath(); c.arc(0,0,r*.1,0,7); c.fill(); c.restore(); }
  if(lk.acc==='flower'){ const fxk=front?.6:-.1, ft=petTopK(id,fxk,t), fx=fxk*r, fy=(ft==null?-.82:ft+.05)*r; c.fillStyle='#ff9ad0'; for(let i=0;i<5;i++){ c.beginPath(); c.ellipse(fx+Math.cos(i*1.257)*r*.15,fy+Math.sin(i*1.257)*r*.15,r*.12,r*.08,i*1.257,0,7); c.fill(); } c.fillStyle='#ffd84a'; c.beginPath(); c.arc(fx,fy,r*.08,0,7); c.fill(); }
  if(lk.hat && lk.hat!=='none'){ c.save(); c.translate(0,-r*.08); c.scale(r*1.02/7.5,r*1.02/7.5); drawHat(c,lk.hat,HATI[lk.hat]&&HATI[lk.hat].fixed?'#888888':(lk.hatCol||'#c8553a'),t); c.restore(); }
  if(lk.acc==='partyhat'){ c.save(); c.translate(r*.1,-r*.12); c.rotate(.22); c.scale(r*.9/7.5,r*.9/7.5); drawHat(c,'party',col,t); c.restore(); }
  c.restore(); c.restore(); return true; }

// ---------------------------------------------------------------------
// pet definitions: four-legged pets (more rigs follow)
// ---------------------------------------------------------------------

// ---------------------------------------------------------------------
// SITTING RIG (front-facing, like Lily): bears, otters, monkeys, the owl...
// ---------------------------------------------------------------------
function rigSit(c,P,t,night,lk,m,id){
  const k=pet3Kit(c,night), {el,ci,qd}=k, s=P.size||1; c.save(); c.scale(s,s);
  const br=Math.sin(t*2)*.2, sleep=m.sleep, main=P.main, belly=P.belly||mix(main,'#ffffff',.4), dark=P.dark||mix(main,'#000000',.3), blink=((t+(P.blinkOff||0))%4.4)<.13;
  const hr=P.headR||5, by=-6.4, hop=m.petted?Math.max(0,Math.sin(m.now/120))*.6:0;
  let hx=(m.watch?.7:0), hy=-15.4-(sleep?-2.6:0)-hop, hrot=sleep?.28:m.watch?.08:m.petted?-.1:Math.sin(t*.8+(P.blinkOff||0))*.05;
  const eyeMode=sleep?'closed':(m.petted||m.happy)?'happy':blink?'closed':'open';
  const cape=lk&&lk.acc==='cape'?(lk.accCol||'#d8303a'):null;
  c.save(); c.translate(0,-hop);
  if(cape){ const f0=c.filter; c.filter='none'; const cw=Math.sin(t*3.2)*.6; c.fillStyle=k.D(cape); c.beginPath(); c.moveTo(-4.6,-11.6); c.quadraticCurveTo(-8.4,-6+cw,-8.6,-.6); c.quadraticCurveTo(0,1.2,8.6,-.6); c.quadraticCurveTo(8.4,-6-cw,4.6,-11.6); c.closePath(); c.fill(); c.filter=f0; }
  if(P.tail) pet3SitTail(c,k,P.tail,P,t,m);
  // body, belly, feet, arms
  el(0,by+br*.15,6.2,6.6+br,main); el(0,by+1,4.4,4.8,belly);
  { c.save(); c.beginPath(); c.ellipse(0,by+br*.15,6.2,6.6+br,0,0,7); c.clip(); const vg=c.createLinearGradient(-6,0,6,0); vg.addColorStop(0,'rgba(20,10,30,.18)'); vg.addColorStop(.5,'rgba(0,0,0,0)'); vg.addColorStop(1,'rgba(255,235,210,.14)'); c.fillStyle=vg; c.fillRect(-7,by-7,14,14); c.restore(); }
  el(-3.2,-.9,2.4,1.3,P.feet||dark); el(3.2,-.9,2.4,1.3,P.feet||dark);
  const armY=sleep?-6.2:-7.4, armA=sleep?.9:m.petted?-.5:.35;
  c.save(); c.translate(-5,armY); c.rotate(armA); el(0,1.6,1.5,2.6,P.arms||dark); c.restore();
  c.save(); c.translate(5,armY); c.rotate(-armA); el(0,1.6,1.5,2.6,P.arms||dark); c.restore();
  if(P.holds&&!sleep) P.holds(c,k,t);
  if(P.bodyExtra) P.bodyExtra(c,k,{by,t,m});
  // head
  c.save(); c.translate(hx,hy); c.rotate(hrot);
  pet3SitEars(c,k,P.ears||'round',hr,P.earCol||main,P.earIn||belly,m,t,P);
  ci(0,0,hr,main);
  if(P.faceCol) el(0,hr*.25,hr*.72,hr*.62,P.faceCol);
  if(P.patches){ el(-hr*.38,-hr*.12,hr*.3,hr*.36,P.patches,.5); el(hr*.38,-hr*.12,hr*.3,hr*.36,P.patches,-.5); }
  const er=hr*.16*(P.eyeSize||1), eyx=hr*(P.eyeGap||.36), eyy=-hr*.12;
  if(P.owlEyes){ ci(-eyx,eyy,er*1.9,'#f8f0d8'); ci(eyx,eyy,er*1.9,'#f8f0d8'); }
  if(P.eyeRing&&eyeMode==='open'){ ci(-eyx,eyy,er*1.3,P.eyeRing); ci(eyx,eyy,er*1.3,P.eyeRing); }
  pet3Eye(c,k,-eyx,eyy,er,eyeMode,P.eyeCol); pet3Eye(c,k,eyx,eyy,er,eyeMode,P.eyeCol);
  if(P.beak){ c.fillStyle=k.D(P.beak); c.beginPath(); c.moveTo(-hr*.14,hr*.12); c.lineTo(hr*.14,hr*.12); c.lineTo(0,hr*.42); c.closePath(); c.fill(); }
  else { el(0,hr*.2,hr*.36,hr*.24,P.muzzle||belly); el(0,hr*.1,hr*.14,hr*.1,P.nose||'#2a1a16'); if(m.petted||m.happy) el(0,hr*.42,hr*.1,hr*.14,'#ff8a9a'); else qd(-hr*.12,hr*.32,0,hr*.42,hr*.12,hr*.32,'#3a2420',.3); }
  if(m.petted||m.happy){ el(-hr*.52,hr*.18,hr*.14,hr*.08,'#ff9a9a'); el(hr*.52,hr*.18,hr*.14,hr*.08,'#ff9a9a'); }
  if(P.headExtra) P.headExtra(c,k,{hr,t,m});
  c.restore(); c.restore(); c.restore();
  PET3_FR[id]={head:{x:hx*s,y:(hy-hop)*s,rot:hrot,r:hr*s,face:'front'},neck:{x:hx*.5*s,y:(hy+hr*.95-hop)*s,rot:hrot*.3,r:hr*.78*s,face:'front'},back:{x:0,y:-12*s,len:5*s}};
  if(sleep) pet3Zz(c,(hr+2)*s,(hy-hr)*s,t);
}
function pet3SitEars(c,k,type,hr,col,inn,m,t,P){ const {el}=k; const flop=m.petted?.25:0;
  if(type==='round'){ for(const sd of [-1,1]){ el(sd*hr*.72,-hr*.72,hr*.34,hr*.32,col); el(sd*hr*.72,-hr*.7,hr*.18,hr*.16,inn); } }
  if(type==='big'){ for(const sd of [-1,1]){ el(sd*hr*.92,-hr*.35,hr*.5,hr*.48,col); el(sd*hr*.92,-hr*.33,hr*.3,hr*.28,inn); } }
  if(type==='tiny'){ for(const sd of [-1,1]) el(sd*hr*.62,-hr*.82,hr*.18,hr*.14,col); }
  if(type==='side'){ for(const sd of [-1,1]){ el(sd*hr*.98,-hr*.05,hr*.26,hr*.3,col); el(sd*hr*.98,-hr*.05,hr*.14,hr*.18,inn); } }
  if(type==='tufts'){ for(const sd of [-1,1]){ c.fillStyle=k.D(col); c.beginPath(); c.moveTo(sd*hr*.45,-hr*.82); c.lineTo(sd*hr*.82,-hr*1.32); c.lineTo(sd*hr*.88,-hr*.6); c.closePath(); c.fill(); } }
  if(type==='pointy'){ for(const sd of [-1,1]){ c.save(); c.translate(sd*hr*.55,-hr*.7); c.rotate(sd*(.25+flop)); c.fillStyle=k.D(col); c.beginPath(); c.moveTo(-hr*.25,0); c.lineTo(0,-hr*.7); c.lineTo(hr*.25,0); c.closePath(); c.fill(); c.restore(); } }
}
function pet3SitTail(c,k,type,P,t,m){ const {el,qd}=k, w=Math.sin(t*((m.petted||m.happy)?18:5))*.25;
  if(type==='bushy'){ c.save(); c.translate(4.5,-3); c.rotate(.25+w*.4); el(2.6,-5,3.2,6.4,P.tailCol||P.main); el(2.6,-5,1.8,4.6,mix(P.tailCol||P.main,'#ffffff',.18)); c.restore(); }
  if(type==='flat'){ c.save(); c.translate(3.5,-.8); c.rotate(-.15+w*.2); el(3.2,0,3.4,1.4,'#5a4030'); c.restore(); }
  if(type==='curly'){ c.strokeStyle=k.D(P.tailCol||P.main); c.lineWidth=1.3; c.beginPath(); c.moveTo(4.4,-2.4); c.quadraticCurveTo(9,-3,8.6,-7+w*3); c.arc(7.6,-7+w*3,1,0,Math.PI*1.5); c.stroke(); }
  if(type==='otter'){ c.save(); c.translate(3.8,-1); c.rotate(.15+w*.3); el(3,0,3.4,1.3,P.tailCol||P.main); c.restore(); }
}
// ---------------------------------------------------------------------
// BIRD RIG (side-on, facing right)
// ---------------------------------------------------------------------
function rigBird(c,P,t,night,lk,m,id){
  const k=pet3Kit(c,night), {el,ci,qd}=k, s=P.size||1; c.save(); c.scale(s,s);
  const sleep=m.sleep, main=P.main, belly=P.belly||mix(main,'#ffffff',.35), wing=P.wing||mix(main,'#000000',.15), blink=((t+(P.blinkOff||0))%4)<.12;
  const up=P.upright, lh=sleep?0:(P.legH||3), fluff=m.petted?1.08:1, bob=Math.sin(t*2.4)*.2;
  const brx=(P.bodyRx||5.4)*fluff, bry=(P.bodyRy||4.2)*fluff, by=-(lh+bry)+(sleep?.4:0)+bob, brot=up?0:-.12;
  const nl=P.neck||0;
  let hx=up?brx*.15:brx*.82, hy=by-bry*(up?1.05:.85)-(P.headR||3.1)*.55-nl, hrot=m.watch?.12:m.petted?-.1:Math.sin(t*.9+(P.blinkOff||0))*.06, hr=P.headR||3.1;
  if(sleep){ hx=brx*.25; hy=by-bry*.75; hrot=-.6; }
  const cape=lk&&lk.acc==='cape'?(lk.accCol||'#d8303a'):null;
  // tail feathers
  { const tl=P.tailLen||3.4, tc=P.tailCol||wing; c.save(); c.translate(-brx*.86,by-bry*.1); c.rotate((up?.9:.2)+Math.sin(t*3)*.05); for(let i=-1;i<=1;i++){ c.save(); c.rotate(i*.28); k.el(-tl*.55,0,tl*.62,tl*.2,i===0?tc:mix(tc,'#000000',.15)); c.restore(); } c.restore(); }
  // legs
  if(!sleep){ for(const lx of [-1,1.2]){ k.ln([lx,by+bry*.8,lx+.2,-.6],P.legs||'#e8902a',.55); k.ln([lx-.6,-.4,lx+1.4,-.4],P.legs||'#e8902a',.5); } }
  // upright birds wear the cape hanging behind the back
  if(cape&&up){ const f0=c.filter; c.filter='none'; const wv=Math.sin(t*3.2)*.4; c.fillStyle=k.D(cape); c.beginPath(); c.moveTo(brx*.2,by-bry*.85); c.quadraticCurveTo(-brx*1.3,by-bry*.4,-brx*1.25+wv,by+bry*.95); c.lineTo(-brx*.2,by+bry*.9); c.quadraticCurveTo(-brx*.6,by,brx*.2,by-bry*.55); c.closePath(); c.fill(); c.filter=f0; }
  // body
  el(0,by,brx,bry,main,brot); el(brx*.2,by+bry*.3,brx*.7,bry*.62,belly,brot);
  { c.save(); c.beginPath(); c.ellipse(0,by,brx,bry,brot,0,7); c.clip(); const vg=c.createLinearGradient(0,by-bry,0,by+bry); vg.addColorStop(0,'rgba(255,240,220,.18)'); vg.addColorStop(.6,'rgba(0,0,0,0)'); vg.addColorStop(1,'rgba(20,10,30,.2)'); c.fillStyle=vg; c.fillRect(-brx,by-bry,brx*2,bry*2); c.restore(); }
  // wing (flaps when happy)
  const flap=(m.happy||m.petted)?Math.sin(t*16)*.35:0;
  if(P.flipper){ c.save(); c.translate(brx*.1,by-bry*.2); c.rotate(.35+flap); el(0,bry*.45,brx*.3,bry*.62,wing); c.restore(); }
  else { c.save(); c.translate(-brx*.05,by-bry*.25); c.rotate(.12-flap); el(-brx*.15,0,brx*.68,bry*.5,wing,-.15); c.strokeStyle='rgba(0,0,0,.15)'; c.lineWidth=.3; for(let i=0;i<3;i++){ c.beginPath(); c.moveTo(-brx*.6+i*brx*.25,bry*.1); c.lineTo(-brx*.75+i*brx*.25,bry*.45); c.stroke(); } c.restore(); }
  if(cape&&!up){ const f0=c.filter; c.filter='none'; const wv=Math.sin(t*3.4)*.4; c.fillStyle=k.D(cape); c.beginPath(); c.moveTo(brx*.45,by-bry*.85); c.quadraticCurveTo(-brx*.3,by-bry*1.1,-brx*.95,by-bry*.2+wv); c.lineTo(-brx*.7,by+bry*.4+wv); c.quadraticCurveTo(0,by,brx*.4,by-bry*.3); c.closePath(); c.fill(); c.filter=f0; }
  // neck + head
  if(nl>0&&!sleep){ c.strokeStyle=k.D(main); c.lineWidth=hr*.9; c.beginPath(); c.moveTo(brx*.6,by-bry*.5); c.quadraticCurveTo(brx*1.3,by-bry-nl*.4,hx-hr*.2,hy+hr*.5); c.stroke(); }
  c.save(); c.translate(hx,hy); c.rotate(hrot);
  if(P.crest) P.crest(c,k,hr,t,m);
  if(P.headGlow) P.headGlow(c,k,hr,t);
  ci(0,0,hr,P.headCol||main); if(P.cheek) el(hr*.3,hr*.25,hr*.4,hr*.32,P.cheek);
  if(!sleep) pet3Beak(c,k,P.beak||'duck',hr,P.beakCol||'#f0a030',m);
  pet3Eye(c,k,hr*.3,-hr*.2,hr*.2*(P.eyeSize||1),sleep?'closed':(m.petted||m.happy)?'happy':blink?'closed':'open',P.eyeCol);
  if(P.headExtra) P.headExtra(c,k,hr,t,m);
  c.restore(); c.restore();
  PET3_FR[id]={head:{x:hx*s,y:hy*s,rot:hrot,r:hr*s,face:'side'},neck:{x:(hx-hr*.1)*s,y:(hy+hr*.95)*s,rot:hrot*.4-.2,r:hr*.75*s,face:'side'},back:{x:0,y:(by-bry)*s,len:brx*s}};
  if(sleep) pet3Zz(c,(hx+hr*1.6)*s,(hy-hr)*s,t);
}
function pet3Beak(c,k,type,hr,col,m){ const {D}=k; c.fillStyle=D(col); const open=m.happy?.25:0;
  if(type==='duck'){ c.beginPath(); c.ellipse(hr*1.15,hr*.22,hr*.62,hr*.22,0,0,7); c.fill(); }
  if(type==='cone'){ c.beginPath(); c.moveTo(hr*.8,-hr*.05); c.lineTo(hr*1.55,hr*.2); c.lineTo(hr*.8,hr*.45); c.closePath(); c.fill(); }
  if(type==='hook'){ c.beginPath(); c.moveTo(hr*.75,-hr*.25); c.quadraticCurveTo(hr*1.7,-hr*.25,hr*1.35,hr*.55); c.quadraticCurveTo(hr*1.1,hr*.25,hr*.8,hr*.4); c.closePath(); c.fill(); }
  if(type==='long'){ c.beginPath(); c.moveTo(hr*.7,-hr*.1); c.lineTo(hr*3.2,hr*.15); c.lineTo(hr*.75,hr*.32); c.closePath(); c.fill(); c.fillStyle=D(mix(col,'#ffffff',.25)); c.beginPath(); c.moveTo(hr*.85,hr*.3); c.quadraticCurveTo(hr*2,hr*1.3,hr*2.9,hr*.22); c.closePath(); c.fill(); }
  if(type==='puffin'){ c.beginPath(); c.moveTo(hr*.75,-hr*.4); c.quadraticCurveTo(hr*1.7,-hr*.2,hr*1.6,hr*.3); c.lineTo(hr*.75,hr*.5); c.closePath(); c.fill(); c.fillStyle=D('#3a5a8a'); c.beginPath(); c.moveTo(hr*.78,-hr*.38); c.lineTo(hr*1.02,-hr*.32); c.lineTo(hr*1.02,hr*.46); c.lineTo(hr*.78,hr*.48); c.closePath(); c.fill(); }
  if(type==='flamingo'){ c.beginPath(); c.moveTo(hr*.75,-hr*.15); c.lineTo(hr*1.5,hr*.05); c.quadraticCurveTo(hr*1.7,hr*.7,hr*1.3,hr*.9); c.lineTo(hr*1.2,hr*.4); c.lineTo(hr*.75,hr*.35); c.closePath(); c.fill(); c.fillStyle=D('#1c1416'); c.beginPath(); c.moveTo(hr*1.35,hr*.4); c.quadraticCurveTo(hr*1.7,hr*.7,hr*1.3,hr*.9); c.lineTo(hr*1.2,hr*.45); c.closePath(); c.fill(); }
}

// ---------------------------------------------------------------------
// ONE-OF-A-KIND PETS (custom drawings with the same frames and moods)
// ---------------------------------------------------------------------
function p3fr(id,s,head,neck){ PET3_FR[id]={head:Object.assign({rot:0,face:'front'},head,{x:head.x*s,y:head.y*s,r:head.r*s}),neck:Object.assign({rot:0,face:head.face||'front'},neck,{x:neck.x*s,y:neck.y*s,r:neck.r*s}),back:{x:0,y:head.y*s,len:4*s}}; }
function p3eyes(c,k,m,t,xs,y,r,col,off){ const blink=((t+(off||0))%4.3)<.13, mode=m.sleep?'closed':(m.petted||m.happy)?'happy':blink?'closed':'open'; for(const x of xs) pet3Eye(c,k,x,y,r,mode,col); return mode; }
function p3cheeks(c,k,m,xs,y,r){ if(m.petted||m.happy) for(const x of xs) k.el(x,y,r,r*.55,'#ff9aa8'); }
function p3cape(c,k,lk,pts){ if(!(lk&&lk.acc==='cape')) return; const f0=c.filter; c.filter='none'; c.fillStyle=k.D(lk.accCol||'#d8303a'); c.beginPath(); c.moveTo(pts[0],pts[1]); for(let i=2;i<pts.length;i+=4) c.quadraticCurveTo(pts[i],pts[i+1],pts[i+2],pts[i+3]); c.closePath(); c.fill(); c.filter=f0; }
function p3mouth(c,k,m,x,y,w){ if(m.petted||m.happy){ k.el(x,y+w*.15,w*.45,w*.4,'#7a2a3a'); k.el(x,y+w*.3,w*.25,w*.18,'#ff8a9a'); } else k.qd(x-w*.5,y,x,y+w*.45,x+w*.5,y,'#3a2420',w*.16); }

const PET3_CUSTOM = {
  frog(c,P,t,night,lk,m,id,frogPrince){ const k=pet3Kit(c,night), {el,ci}=k; const hop=m.petted?Math.max(0,Math.sin(m.now/110))*2.2:Math.pow(Math.max(0,Math.sin(t*1.3)),12)*1.6, g0=frogPrince?'#4aa04a':'#5ab04a', bel='#d8ecb0';
    c.save(); c.translate(0,-hop); p3cape(c,k,lk,[-4,-7,-8,-3,-7.6,-.4, 0,.8,7.6,-.4, 8,-3,4,-7]);
    el(-4.6,-1.2,3.2,1.6,g0); el(4.6,-1.2,3.2,1.6,g0); el(0,-4.4,6,4.6,g0); el(0,-3.2,4.2,3,bel);
    el(-2.6,-1,1.4,.8,mix(g0,'#000000',.15)); el(2.6,-1,1.4,.8,mix(g0,'#000000',.15));
    const ey=-8.6; ci(-2.6,ey,2.2,g0); ci(2.6,ey,2.2,g0); ci(-2.6,ey,1.45,'#f8f8f0'); ci(2.6,ey,1.45,'#f8f8f0');
    const mode=p3eyes(c,k,m,t,[-2.5,2.5],ey,.95,'#1a1410',P.blinkOff);
    if(m.sleep){ el(-2.6,ey,1.5,.9,g0); el(2.6,ey,1.5,.9,g0); k.qd(-3.6,ey+.2,-2.6,ey+.9,-1.6,ey+.2,'#1a1410',.35); k.qd(1.6,ey+.2,2.6,ey+.9,3.6,ey+.2,'#1a1410',.35); }
    k.qd(-2.4,-5.6,0,m.petted||m.happy?-4.2:-4.9,2.4,-5.6,'#2a4a24',.4); p3cheeks(c,k,m,[-4,4],-5.6,.8);
    if(frogPrince&&!(lk&&lk.hat&&lk.hat!=='none')){ c.fillStyle=k.D('#f4c83a'); c.beginPath(); c.moveTo(-1.8,-10.6); c.lineTo(-1.8,-12.6); c.lineTo(-.9,-11.6); c.lineTo(0,-13); c.lineTo(.9,-11.6); c.lineTo(1.8,-12.6); c.lineTo(1.8,-10.6); c.closePath(); c.fill(); ci(0,-12.9,.3,'#e83a5a'); }
    c.restore(); p3fr(id,P.size||1,{x:0,y:-9.6-hop,r:5.8,gy:.17,gx:.43},{x:0,y:-3.6-hop,r:3.8});
    if(m.sleep) pet3Zz(c,5,-12,t); },
  frogprince(c,P,t,night,lk,m,id){ PET3_CUSTOM.frog(c,P,t,night,lk,m,id,true); },
  crab(c,P,t,night,lk,m,id){ const k=pet3Kit(c,night), {el,ci}=k, red='#e8543a', dk='#b83a28', sx=m.sleep?0:Math.sin(t*1.2)*.8, claw=m.petted||m.happy?Math.sin(t*10)*.3:Math.sin(t*2)*.1;
    c.save(); c.translate(sx,0); for(const sd of [-1,1]) for(let i=0;i<3;i++){ k.qd(sd*3.4,-2.6+i*.5,sd*(5.6+i*.4),-3.4+i*.6,sd*(6.4+i*.6),-.4,dk,.6); }
    p3cape(c,k,lk,[-3.6,-5.6,-6.4,-3.4,-6,-1, 0,0,6,-1, 6.4,-3.4,3.6,-5.6]);
    el(0,-3.6,5.2,3.2,red); el(0,-4.4,4.2,1.8,mix(red,'#ffffff',.18)); for(const x of [-1.6,0,1.6]) ci(x,-5.6,.32,mix(red,'#ffffff',.35));
    for(const sd of [-1,1]){ c.save(); c.translate(sd*5,-4.4); c.rotate(sd*(-.5-claw)); el(0,-1.6,1.5,1.9,red); el(sd*.5,-3,.9,1.1,red); c.fillStyle=k.D('#2a1a1a'); c.beginPath(); c.moveTo(0,-3.2); c.lineTo(sd*.4,-2.2); c.lineTo(0,-1.6); c.fill(); c.restore(); }
    k.ln([-1.4,-6.2,-1.6,-8.2],dk,.45); k.ln([1.4,-6.2,1.6,-8.2],dk,.45); ci(-1.6,-8.6,1.05,'#f8f8f0'); ci(1.6,-8.6,1.05,'#f8f8f0');
    p3eyes(c,k,m,t,[-1.6,1.6],-8.6,.6,'#1a1410',P.blinkOff); p3mouth(c,k,m,0,-3.2,1.3); p3cheeks(c,k,m,[-2.8,2.8],-3.8,.6);
    c.restore(); p3fr(id,P.size||1,{x:sx,y:-8.6,r:3.2,gy:0,gx:.5},{x:sx,y:-2.6,r:3.6}); if(m.sleep) pet3Zz(c,4,-10,t); },
  octopus(c,P,t,night,lk,m,id){ const k=pet3Kit(c,night), {el,ci}=k, pk='#e86a9a', dk='#c84a7a';
    for(let i=0;i<6;i++){ const x=-4.5+i*1.8, w=Math.sin(t*2+i)*(m.petted?1.4:.7); k.qd(x,-3.4,x+w,-1.6,x-.6+w*1.4,-.2,i%2?dk:pk,1.3); ci(x-.6+w*1.4,-.2,.65,i%2?dk:pk); }
    p3cape(c,k,lk,[-3.6,-7,-7,-4,-6.6,-1, 0,0,6.6,-1, 7,-4,3.6,-7]);
    el(0,-7.6,5.2,5.2,pk); el(-1.6,-10,1.6,1,mix(pk,'#ffffff',.3),-.4); for(const [x,y] of [[2.6,-9],[3.2,-6.8],[-3.2,-6]]) ci(x,y,.42,dk);
    ci(-1.9,-7.2,1.3,'#f8f8f0'); ci(1.9,-7.2,1.3,'#f8f8f0'); p3eyes(c,k,m,t,[-1.8,1.8],-7.1,.82,'#1a1410',P.blinkOff); p3mouth(c,k,m,0,-4.8,1.3); p3cheeks(c,k,m,[-3.3,3.3],-5.4,.7);
    p3fr(id,P.size||1,{x:0,y:-9.4,r:4.6,gy:.5},{x:0,y:-3.4,r:4}); if(m.sleep) pet3Zz(c,5,-13,t); },
  jelly(c,P,t,night,lk,m,id){ const k=pet3Kit(c,night), {el,ci}=k, fl=Math.sin(t*2.4)*.8, hy=-11-fl, gl=m.petted?.5:.3;
    const gr=c.createRadialGradient(0,hy,1,0,hy,9); gr.addColorStop(0,'rgba(190,150,255,'+gl+')'); gr.addColorStop(1,'rgba(190,150,255,0)'); c.fillStyle=gr; c.fillRect(-9,hy-9,18,18);
    for(let i=0;i<5;i++){ const x=-3+i*1.5; k.qd(x,hy+2,x+Math.sin(t*3+i)*1.2,hy+5,x+Math.sin(t*2+i)*.8,hy+9-Math.abs(i-2)*.8,'#c8a8ff',.45); }
    c.save(); c.globalAlpha*=.9; c.fillStyle=k.D('#b896f4'); c.beginPath(); c.arc(0,hy+1.6,5,Math.PI,0); c.quadraticCurveTo(4,hy+3.2,2.5,hy+2.4); c.quadraticCurveTo(1.2,hy+3.4,0,hy+2.4); c.quadraticCurveTo(-1.2,hy+3.4,-2.5,hy+2.4); c.quadraticCurveTo(-4,hy+3.2,-5,hy+1.6); c.fill(); c.restore();
    el(-1.4,hy-1.6,1.6,.8,'#e8dcff',-.3); p3eyes(c,k,m,t,[-1.6,1.6],hy+.2,.62,'#2a1a3a',P.blinkOff); p3mouth(c,k,m,0,hy+1.4,1); p3cheeks(c,k,m,[-3,3],hy+1,.55);
    p3fr(id,P.size||1,{x:0,y:hy-1.4,r:4.6,gy:.35},{x:0,y:hy+2.6,r:3.6}); if(m.sleep) pet3Zz(c,5,hy-4,t); },
  tub(c,k,t){ // a little wooden tub of water for the sea pets
    k.el(0,-.6,7.4,1.4,'#5a3a28'); c.fillStyle=k.D('#8a5a3a'); c.beginPath(); c.moveTo(-7,-5.2); c.lineTo(7,-5.2); c.lineTo(6.2,-.6); c.lineTo(-6.2,-.6); c.closePath(); c.fill(); c.fillStyle=k.D('#6a4430'); c.fillRect(-7,-4.2,14,.7); c.fillRect(-6.4,-1.8,12.8,.7);
    k.el(0,-5.2,7,1.3,'#5aa8c8'); c.strokeStyle='rgba(255,255,255,.6)'; c.lineWidth=.3; c.beginPath(); c.ellipse(Math.sin(t)*2,-5.2,2.2,.5,0,0,7); c.stroke(); },
  babywhale(c,P,t,night,lk,m,id,narwhal){ const k=pet3Kit(c,night), {el,ci}=k, bob=Math.sin(t*1.6)*.4, col=narwhal?'#7a9ab8':'#5a7ab8', bel=narwhal?'#e8eef4':'#c8dcf0';
    PET3_CUSTOM.tub(c,k,t); c.save(); c.beginPath(); c.rect(-12,-30,24,25.2); c.clip(); const by=-6.4+bob;
    p3cape(c,k,lk,[-1,-10+bob,-6,-10+bob,-8,-6+bob, -4,-5.8+bob,-1,-7.4+bob]);
    el(0,by,5.8,4,col); el(.6,by+1.6,4.6,2,bel); c.save(); c.translate(-5.4,by-1.4); c.rotate(-.5+Math.sin(t*3)*.2); el(-1.2,0,1.8,.8,col); el(-.6,-1,1.2,.6,col,-.8); c.restore();
    if(narwhal){ c.fillStyle=k.D('#f4ead0'); c.beginPath(); c.moveTo(4.4,by-2.4); c.lineTo(9.6,by-6.4); c.lineTo(4.9,by-1.6); c.closePath(); c.fill(); c.strokeStyle=k.D('#c8b890'); c.lineWidth=.2; for(let i=1;i<4;i++){ c.beginPath(); c.moveTo(4.6+i*1.3,by-2.4-i); c.lineTo(5.2+i*1.3,by-1.9-i); c.stroke(); } }
    else if(!m.sleep){ for(let i=0;i<3;i++){ const ph=(t*.8+i/3)%1; c.globalAlpha=1-ph; ci(1.4+Math.sin(i)*.6,by-4.4-ph*5,.45+ph*.4,'#cde8f8'); c.globalAlpha=1; } }
    p3eyes(c,k,m,t,[2.6],by-.8,.62,'#1a1a2a',P.blinkOff); p3mouth(c,k,m,4.2,by+.8,1); p3cheeks(c,k,m,[2.4],by+.4,.6);
    c.restore(); p3fr(id,P.size||1,{x:1.8,y:by-1,r:3.8,face:'side'},{x:2.6,y:by+2,r:3});
    if(m.sleep) pet3Zz(c,5,-12,t); },
  narwhal(c,P,t,night,lk,m,id){ PET3_CUSTOM.babywhale(c,P,t,night,lk,m,id,true); },
  seal(c,P,t,night,lk,m,id){ const k=pet3Kit(c,night), {el,ci}=k, gr='#9aa4b0', dk='#7a848e', lift=m.petted?Math.max(0,Math.sin(m.now/120))*.8:0, hy=-8.6-lift;
    c.save(); c.translate(-6.6,-1.4); c.rotate(.15+Math.sin(t*2)*.1); el(-1.4,0,2,.9,dk,-.4); el(-1.4,.6,2,.9,dk,.4); c.restore();
    p3cape(c,k,lk,[1.6,-7.6,-4,-6.4,-7,-2.6, -3,-2,1.6,-4.6]);
    el(-.4,-3.4,6.6,3.4,gr); el(.6,-2.2,5,1.8,mix(gr,'#ffffff',.3)); for(const [x,y] of [[-3,-4.8],[-1,-5.4],[-4.6,-3.6]]) ci(x,y,.32,dk);
    el(4.4,-6,2.6,3.4,gr,.35); ci(5.6,hy,3.4,gr); el(7.4,hy+.9,1.6,1.1,mix(gr,'#ffffff',.35));
    c.save(); c.translate(3.4,-2); c.rotate(m.petted?-.9+Math.sin(t*12)*.4:-.25); el(0,1.2,.9,2,dk); c.restore();
    ci(8.6,hy+.4,.5,'#2a2a32'); for(const sd of [-1,1]) k.ln([8,hy+1.2,9.6,hy+.9+sd*.6],'#e8e8ec',.12);
    p3eyes(c,k,m,t,[6.2],hy-.6,.7,'#141418',P.blinkOff); p3cheeks(c,k,m,[6.6],hy+1.2,.6);
    p3fr(id,P.size||1,{x:5.6,y:hy,r:3.4,face:'side'},{x:5,y:hy+3.2,r:2.8,face:'side'}); if(m.sleep) pet3Zz(c,9,hy-4,t); },
  ghost(c,P,t,night,lk,m,id){ const k=pet3Kit(c,night), {el,ci}=k, fl=Math.sin(t*1.8)*1, hy=-12-fl;
    const gr=c.createRadialGradient(0,hy+2,1,0,hy+2,9); gr.addColorStop(0,'rgba(220,235,255,.35)'); gr.addColorStop(1,'rgba(220,235,255,0)'); c.fillStyle=gr; c.fillRect(-9,hy-7,18,18);
    p3cape(c,k,lk,[-3.6,hy+1,-7,hy+4,-6.4,hy+8, 0,hy+9,6.4,hy+8, 7,hy+4,3.6,hy+1]);
    c.fillStyle=k.D('#f4f8ff'); c.beginPath(); c.arc(0,hy,4.8,Math.PI,0); c.lineTo(4.8,hy+6.4); for(let i=0;i<4;i++){ const x=4.8-i*2.4, w=Math.sin(t*4+i)*.4; c.quadraticCurveTo(x-.6,hy+7.8+w,x-1.2,hy+6.6); c.quadraticCurveTo(x-1.8,hy+5.6,x-2.4,hy+6.6+w*.5); } c.closePath(); c.fill();
    c.save(); c.globalAlpha*=.12; c.fillStyle='#6070a0'; c.beginPath(); c.ellipse(-2.6,hy+2,1.6,4.6,0,0,7); c.fill(); c.restore();
    el(0,1.2,3.6,.6,'rgba(0,0,0,.18)'); p3eyes(c,k,m,t,[-1.6,1.6],hy-.6,.85,'#2a2a3a',P.blinkOff); p3mouth(c,k,m,0,hy+1.4,1.2); p3cheeks(c,k,m,[-2.9,2.9],hy+.9,.6);
    p3fr(id,P.size||1,{x:0,y:hy-1.3,r:4.6,gy:.15},{x:0,y:hy+3,r:4}); if(m.sleep) pet3Zz(c,5,hy-5,t); },
  robot(c,P,t,night,lk,m,id){ const k=pet3Kit(c,night), {el,ci}=k, bob=Math.abs(Math.sin(t*3))*.3, hy=-12.4-bob, mt='#a8b4c4', dk='#6a7484';
    el(-2.6,-.6,2,1,dk); el(2.6,-.6,2,1,dk); c.fillStyle=k.D(dk); c.fillRect(-3.2,-3,1.4,2.6); c.fillRect(1.8,-3,1.4,2.6);
    p3cape(c,k,lk,[-3.4,-8.2,-6.6,-5,-6,-1.6, 0,-1,6,-1.6, 6.6,-5,3.4,-8.2]);
    c.fillStyle=k.D(mt); c.beginPath(); c.roundRect?c.roundRect(-4,-8.4,8,5.8,1.2):c.rect(-4,-8.4,8,5.8); c.fill(); c.fillStyle=k.D('#3a4454'); c.fillRect(-2.4,-7.2,4.8,2.4); for(let i=0;i<3;i++){ c.fillStyle=['#5aff8a','#ffd84a','#ff5a5a'][i]; c.globalAlpha=(Math.sin(t*4+i*2)>0)?1:.3; c.fillRect(-1.9+i*1.5,-6.4,.9,.9); } c.globalAlpha=1;
    for(const sd of [-1,1]){ c.save(); c.translate(sd*4.4,-7.2); c.rotate(sd*(m.petted?-1.6+Math.sin(t*10)*.3:.3)); c.fillStyle=k.D(dk); c.fillRect(-.5,0,1,3); ci(0,3.2,.8,mt); c.restore(); }
    c.fillStyle=k.D(mt); c.beginPath(); c.roundRect?c.roundRect(-4.4,hy-3.4,8.8,6.6,1.8):c.rect(-4.4,hy-3.4,8.8,6.6); c.fill(); c.fillStyle=k.D('#2a3242'); c.beginPath(); c.roundRect?c.roundRect(-3.4,hy-2.4,6.8,4.4,1.2):c.rect(-3.4,hy-2.4,6.8,4.4); c.fill();
    k.ln([0,hy-3.4,0,hy-5.6],dk,.4); const ant=(Math.sin(t*3)>0)?'#ff5a5a':'#ff9a8a'; ci(0,hy-5.9,.6,ant);
    const eyeC='#6ae8ff', mode=m.sleep?'closed':(m.petted||m.happy)?'happy':(((t+(P.blinkOff||0))%4.3)<.13)?'closed':'open';
    if(mode==='open'){ for(const x of [-1.4,1.4]){ c.fillStyle=eyeC; c.beginPath(); c.roundRect?c.roundRect(x-.6,hy-1.2,1.2,1.6,.4):c.rect(x-.6,hy-1.2,1.2,1.6); c.fill(); } } else { for(const x of [-1.4,1.4]) k.qd(x-.7,mode==='happy'?hy:hy-.2,x,mode==='happy'?hy-1:hy+.3,x+.7,mode==='happy'?hy:hy-.2,eyeC,.4); }
    k.qd(-.9,hy+1,0,hy+(m.petted?1.8:1.4),.9,hy+1,eyeC,.3);
    p3fr(id,P.size||1,{x:0,y:hy,r:4.4},{x:0,y:-8.2,r:3.6}); if(m.sleep) pet3Zz(c,5,hy-5,t); },
  slime(c,P,t,night,lk,m,id){ const k=pet3Kit(c,night), {el,ci}=k, sq=1+Math.sin(t*3)*.07*(m.petted?2:1), h=6*sq, w=6.4/sq, col='#6ad870';
    p3cape(c,k,lk,[-3.4,-h,-7,-h*.5,-6.6,-.6, 0,.2,6.6,-.6, 7,-h*.5,3.4,-h]);
    c.save(); c.globalAlpha*=.92; c.fillStyle=k.D(col); c.beginPath(); c.moveTo(-w,-.2); c.quadraticCurveTo(-w*1.05,-h*1.15,0,-h*1.25); c.quadraticCurveTo(w*1.05,-h*1.15,w,-.2); c.closePath(); c.fill(); c.restore();
    el(-w*.4,-h*.9,w*.25,h*.12,'#d8ffd0',-.3); el(w*.3,-h*.3,.5,.5,mix(col,'#ffffff',.4)); el(0,.1,w*.9,.5,'rgba(0,0,0,.18)');
    p3eyes(c,k,m,t,[-1.8,1.8],-h*.62,.8,'#1a3a1a',P.blinkOff); p3mouth(c,k,m,0,-h*.35,1.3); p3cheeks(c,k,m,[-3.2,3.2],-h*.42,.6);
    p3fr(id,P.size||1,{x:0,y:-h*.98,r:4.6,gy:h*.36/4.6},{x:0,y:-h*.25,r:4.6}); if(m.sleep) pet3Zz(c,5,-h-3,t); },
  snail(c,P,t,night,lk,m,id){ const k=pet3Kit(c,night), {el,ci}=k, sl=m.sleep?0:Math.sin(t*.8)*.6, body='#d8c8a0';
    c.fillStyle=k.D(body); c.beginPath(); c.moveTo(-6,-.2); c.quadraticCurveTo(0,-1.8,5.4,-1.4); c.quadraticCurveTo(7.2,-1.6,7.6,-4.6); c.quadraticCurveTo(6,-6.2,4.6,-3.2); c.quadraticCurveTo(0,-2.6,-6,-.2); c.fill();
    if(!m.sleep){ k.ln([6.4,-5.2,6.6+sl,-8.4],body,.5); k.ln([7.4,-4.6,8.4+sl,-7.4],body,.5); ci(6.6+sl,-8.6,.6,body); ci(8.4+sl,-7.6,.6,body); }
    p3cape(c,k,lk,[1.6,-7.6,-2,-9,-4.6,-5, -2,-3.4,1.6,-4]);
    ci(-.6,-4.6,4.4,'#c87a4a'); c.strokeStyle=k.D('#8a4a2a'); c.lineWidth=.5; c.beginPath(); for(let a=0;a<12;a+=.3){ const r=4-a*.31; c.lineTo(-.6+Math.cos(a)*r,-4.6+Math.sin(a)*r); } c.stroke(); el(-1.8,-7,1.4,.6,'#e8a878',-.4);
    if(m.sleep){ k.qd(6.2,-3.6,6.8,-3,7.4,-3.6,'#3a2a1a',.3); } else { p3eyes(c,k,m,t,[6.6+sl,8.4+sl],-8.6,.38,'#1a1410',P.blinkOff); } p3cheeks(c,k,m,[6.4],-3.4,.5);
    p3fr(id,P.size||1,{x:7.4,y:-8.2,r:2.6,face:'side',gs:1.25},{x:6,y:-2.6,r:2,face:'side'}); if(m.sleep) pet3Zz(c,8,-8,t); },
  fireflyjar(c,P,t,night,lk,m,id){ const k=pet3Kit(c,night), {el,ci}=k, glow=.45+.25*Math.sin(t*2.2)+(m.petted?.25:0);
    const gr=c.createRadialGradient(0,-6,1,0,-6,10); gr.addColorStop(0,'rgba(240,255,150,'+(glow*.7)+')'); gr.addColorStop(1,'rgba(240,255,150,0)'); c.fillStyle=gr; c.fillRect(-10,-16,20,20);
    c.save(); c.globalAlpha*=.35; c.fillStyle='#d8f0ff'; c.beginPath(); c.moveTo(-4.4,-11); c.quadraticCurveTo(-5.4,-6,-4.6,-.4); c.lineTo(4.6,-.4); c.quadraticCurveTo(5.4,-6,4.4,-11); c.closePath(); c.fill(); c.restore();
    c.strokeStyle='rgba(255,255,255,.55)'; c.lineWidth=.35; c.beginPath(); c.moveTo(-3.6,-9.6); c.quadraticCurveTo(-4.3,-6,-3.8,-1.6); c.stroke();
    for(let i=0;i<5;i++){ const fx=Math.sin(t*1.4+i*1.7)*3, fy=-5.6+Math.cos(t*1.1+i*2.3)*3.6, a=.5+.5*Math.sin(t*5+i); c.fillStyle='rgba(240,255,150,'+a+')'; c.beginPath(); c.arc(fx,fy,.55,0,7); c.fill(); }
    p3cape(c,k,lk,[-4.4,-11,-6.6,-7,-6,-1, -4.6,-1,-4.6,-9]);
    el(0,-11.4,4.8,1.1,'#8a5a3a'); c.fillStyle=k.D('#a86a40'); c.fillRect(-4.6,-13,9.2,1.8); c.strokeStyle=k.D('#c8b088'); c.lineWidth=.3; c.beginPath(); c.moveTo(-4.8,-12.2); c.lineTo(4.8,-12.2); c.stroke();
    const mode=p3eyes(c,k,m,t,[-1.5,1.5],-6.2,.55,'#2a3a1a',P.blinkOff); p3mouth(c,k,m,0,-4.8,1);
    p3fr(id,P.size||1,{x:0,y:-14.2,r:4.6,gy:8/4.6,gx:.33},{x:0,y:-10.8,r:4.4}); if(m.sleep) pet3Zz(c,5,-15,t); },
  mushroombuddy(c,P,t,night,lk,m,id){ const k=pet3Kit(c,night), {el,ci}=k, sw=Math.sin(t*1.5)*.06+(m.petted?Math.sin(t*12)*.08:0);
    c.save(); c.rotate(sw); p3cape(c,k,lk,[-2.8,-7.4,-6,-4.4,-5.4,-.6, 0,.2,5.4,-.6, 6,-4.4,2.8,-7.4]);
    el(-1.6,-.5,1.4,.7,'#e8d8c0'); el(1.6,-.5,1.4,.7,'#e8d8c0');
    c.fillStyle=k.D('#f4e8d4'); c.beginPath(); c.moveTo(-3,-.6); c.quadraticCurveTo(-3.6,-5,-2.6,-7.8); c.lineTo(2.6,-7.8); c.quadraticCurveTo(3.6,-5,3,-.6); c.closePath(); c.fill();
    c.fillStyle=k.D('#e8503a'); c.beginPath(); c.moveTo(-6.4,-7.4); c.quadraticCurveTo(-6.2,-14.6,0,-14.8); c.quadraticCurveTo(6.2,-14.6,6.4,-7.4); c.quadraticCurveTo(0,-8.6,-6.4,-7.4); c.fill();
    for(const [x,y,r] of [[-3.2,-11,1.1],[1,-13,.9],[3.6,-10,1],[-.6,-10,.7]]) ci(x,y,r,'#fbf4ec');
    p3eyes(c,k,m,t,[-1.2,1.2],-4.6,.55,'#2a1a14',P.blinkOff); p3mouth(c,k,m,0,-3,1); p3cheeks(c,k,m,[-2.2,2.2],-3.6,.5);
    c.restore(); p3fr(id,P.size||1,{x:0,y:-9.6,r:5.6,gy:5/5.6,gx:.22,gs:.55},{x:0,y:-6.6,r:3.4}); if(m.sleep) pet3Zz(c,5,-15,t); },
  snowman(c,P,t,night,lk,m,id){ const k=pet3Kit(c,night), {el,ci}=k, wob=Math.sin(t*1.4)*.04+(m.petted?Math.sin(t*10)*.06:0);
    c.save(); c.rotate(wob); p3cape(c,k,lk,[-3.4,-9,-7,-5,-6.4,-1, 0,0,6.4,-1, 7,-5,3.4,-9]);
    ci(0,-4,4.4,'#f4f8fc'); ci(0,-10.4,3.4,'#f8fbff'); el(-1.4,-11.4,1.2,.7,'#ffffff',-.4);
    for(const y of [-5.6,-3.6,-1.6]) ci(0,y,.42,'#3a3a44'); for(const sd of [-1,1]) k.ln([sd*3.4,-8,sd*6.4,-10.4+(m.petted?Math.sin(t*10)*1.2:0)],'#7a5a3a',.45);
    c.fillStyle=k.D('#f08a2a'); c.beginPath(); c.moveTo(.2,-10.2); c.lineTo(2.8,-9.8); c.lineTo(.2,-9.4); c.closePath(); c.fill();
    p3eyes(c,k,m,t,[-1.1,1.1],-11.2,.45,'#2a2a34',P.blinkOff); if(m.petted||m.happy) k.qd(-1,-8.8,0,-8.1,1,-8.8,'#2a2a34',.3); else for(const x of [-1,-.35,.35,1]) ci(x,-8.7+Math.abs(x)*.25,.18,'#2a2a34'); p3cheeks(c,k,m,[-2.2,2.2],-9.6,.5);
    c.restore(); p3fr(id,P.size||1,{x:0,y:-10.6,r:3.6},{x:0,y:-7.6,r:2.8}); if(m.sleep) pet3Zz(c,4,-14,t); },
  bat(c,P,t,night,lk,m,id){ const k=pet3Kit(c,night), {el,ci}=k, fl=Math.sin(t*(m.petted?14:7)), hy=-13+Math.sin(t*2)*1, wcol='#4a3a5a';
    if(m.sleep){ // hangs upside down from a little perch while asleep
      // hanging upside down from a little twig, wrapped in its wings, head at the bottom
      const sw=Math.sin(t*1.2)*.05; k.ln([-3.4,-21.2,3.4,-21.2],'#8a6a4a',.7); c.save(); c.translate(0,-21); c.rotate(sw); c.translate(0,21);
      k.ln([-.7,-21,-.8,-19.6],'#2a1a30',.4); k.ln([.7,-21,.8,-19.6],'#2a1a30',.4);
      el(0,-16.2,3,4.2,'#5a4a6e'); c.strokeStyle=k.D('#8a78a8'); c.lineWidth=.35; c.beginPath(); c.ellipse(0,-16.2,3,4.2,0,-Math.PI*.9,-Math.PI*.1); c.stroke(); c.beginPath(); c.moveTo(-.2,-19.8); c.quadraticCurveTo(.6,-16,-.2,-12.6); c.stroke();
      ci(0,-11.6,2.5,'#3e2e52'); for(const sd of [-1,1]){ c.fillStyle=k.D('#3e2e52'); c.beginPath(); c.moveTo(sd*1.1,-10); c.lineTo(sd*2.3,-7.9); c.lineTo(sd*2.4,-10.6); c.closePath(); c.fill(); }
      k.qd(-1.6,-11.9,-1.05,-12.5,-.5,-11.9,'#c8b8e8',.3); k.qd(.5,-11.9,1.05,-12.5,1.6,-11.9,'#c8b8e8',.3); c.restore();
      p3fr(id,P.size||1,{x:0,y:-11.6,r:2.5,rot:Math.PI},{x:0,y:-13.8,r:2.2,rot:Math.PI}); pet3Zz(c,4,-14,t); return; }
    for(const sd of [-1,1]){ c.save(); c.translate(sd*2.4,hy+1); c.scale(sd,1); c.rotate(-fl*.35); c.fillStyle=k.D(wcol); c.beginPath(); c.moveTo(0,-1); c.quadraticCurveTo(4,-5,7.4,-2.6); c.quadraticCurveTo(6.4,-1,6.6,.6); c.quadraticCurveTo(5.2,-.4,4.6,1.4); c.quadraticCurveTo(3.4,.2,2.6,1.8); c.quadraticCurveTo(1.4,.4,0,1.2); c.closePath(); c.fill(); c.restore(); }
    p3cape(c,k,lk,[-2,hy+1,-4,hy+4,-3,hy+7, 0,hy+7.4,3,hy+7, 4,hy+4,2,hy+1]);
    el(0,hy+2.6,2.4,3,'#3a2a48'); ci(0,hy-1.2,2.9,'#3a2a48'); for(const sd of [-1,1]){ c.fillStyle=k.D('#3a2a48'); c.beginPath(); c.moveTo(sd*1.2,hy-3.4); c.lineTo(sd*2.6,hy-5.8); c.lineTo(sd*2.8,hy-2.6); c.closePath(); c.fill(); }
    ci(-1.1,hy-1.4,.8,'#f8e8a0'); ci(1.1,hy-1.4,.8,'#f8e8a0'); p3eyes(c,k,m,t,[-1.1,1.1],hy-1.4,.48,'#1a1018',P.blinkOff); c.fillStyle='#ffffff'; c.beginPath(); c.moveTo(-.6,hy); c.lineTo(-.35,hy+.6); c.lineTo(-.1,hy); c.moveTo(.1,hy); c.lineTo(.35,hy+.6); c.lineTo(.6,hy); c.fill(); p3cheeks(c,k,m,[-1.9,1.9],hy-.4,.45);
    p3fr(id,P.size||1,{x:0,y:hy-1.2,r:2.9},{x:0,y:hy+1.2,r:2.4}); },
};
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
  // ---- sitting pets (front-facing) ----
  otter:   {rig:'sit', main:'#8a5a3a', belly:'#d8b890', faceCol:'#d8b890', ears:'tiny', tail:'otter', muzzle:'#e8d0b0', blinkOff:.4, holds:(c,k,t)=>{ k.el(0,-8.4,1.8,1.3,'#f4a0b0'); c.strokeStyle=k.D('#d87a8a'); c.lineWidth=.25; for(let i=-2;i<=2;i++){ c.beginPath(); c.moveTo(0,-7.4); c.lineTo(i*.7,-9.4); c.stroke(); } }},
  panda:   {rig:'sit', main:'#f6f6f2', belly:'#ffffff', patches:'#1c1c1c', ears:'round', earCol:'#1c1c1c', earIn:'#1c1c1c', arms:'#1c1c1c', feet:'#1c1c1c', muzzle:'#ffffff', eyeRing:'#f6f6f2', blinkOff:1.2, holds:(c,k,t)=>{ c.save(); c.translate(4.6,-9); c.rotate(-.35); k.el(0,0,.55,3.4,'#7ab84a'); k.el(0,-1.2,.62,.18,'#5a9a3a'); k.el(.9,-2.2,1.1,.4,'#8ac85a',-.6); c.restore(); }},
  koala:   {rig:'sit', main:'#9a9aa6', belly:'#d8d8e0', ears:'big', earIn:'#eeeef2', muzzle:'#9a9aa6', nose:'#2a2a32', size:1, blinkOff:2.1, headExtra:(c,k,f)=>{ k.el(0,f.hr*.1,f.hr*.2,f.hr*.26,'#2a2a32'); }},
  monkey:  {rig:'sit', main:'#7a4a2a', belly:'#e8c098', faceCol:'#e8c098', ears:'side', earIn:'#e8c098', tail:'curly', muzzle:'#f0d0a8', blinkOff:.8},
  sloth:   {rig:'sit', main:'#a8906a', belly:'#c8b08a', faceCol:'#e8d8b8', patches:'#5a4632', ears:'tiny', earCol:'#a8906a', muzzle:'#e8d8b8', eyeCol:'#1a1210', blinkOff:3.1, headExtra:(c,k,f)=>{ if(f.m.sleep) return; k.qd(-f.hr*.55,-f.hr*.3,-f.hr*.36,-f.hr*.42,-f.hr*.18,-f.hr*.3,'#5a4632',f.hr*.08); k.qd(f.hr*.18,-f.hr*.3,f.hr*.36,-f.hr*.42,f.hr*.55,-f.hr*.3,'#5a4632',f.hr*.08); }},
  teddy:   {rig:'sit', main:'#b8784a', belly:'#e8c89a', ears:'round', earIn:'#e8c89a', muzzle:'#e8c89a', blinkOff:1.6, bodyExtra:(c,k,f)=>{ k.el(1.4,f.by+1.4,1.1,.95,'#e85a6a'); c.strokeStyle=k.D('#7a4a2a'); c.lineWidth=.22; c.setLineDash([.35,.3]); c.beginPath(); c.moveTo(0,f.by-5.6); c.lineTo(0,f.by+5.4); c.stroke(); c.setLineDash([]); }},
  squirrel:{rig:'sit', main:'#c8783a', belly:'#f4e4d0', ears:'pointy', earIn:'#f4c8b0', tail:'bushy', tailCol:'#c8783a', muzzle:'#f4e4d0', size:.88, blinkOff:2.6, holds:(c,k,t)=>{ k.el(0,-8.6,1.3,1.5,'#a86a2a'); k.el(0,-9.9,1.5,.7,'#6a4220'); k.ln([0,-10.4,.2,-11],'#4a2a14',.3); }},
  beaver:  {rig:'sit', main:'#8a5a32', belly:'#b88a5a', ears:'tiny', tail:'flat', muzzle:'#c89a6a', blinkOff:.2, headExtra:(c,k,f)=>{ if(f.m.sleep) return; c.fillStyle=k.D('#f8f4ec'); c.fillRect(-f.hr*.12,f.hr*.34,f.hr*.24,f.hr*.26); c.strokeStyle=k.D('#c8c0b0'); c.lineWidth=.15; c.beginPath(); c.moveTo(0,f.hr*.34); c.lineTo(0,f.hr*.6); c.stroke(); }},
  mole:    {rig:'sit', main:'#4a3c42', belly:'#5a4c52', ears:'tiny', earCol:'#4a3c42', muzzle:'#5a4c52', nose:'#f0909e', eyeSize:.55, feet:'#f0a0ae', arms:'#f0a0ae', size:.9, blinkOff:1.9, headExtra:(c,k,f)=>{ k.el(0,f.hr*.12,f.hr*.22,f.hr*.16,'#f0909e'); }},
  owl:     {rig:'sit', main:'#9a7a5a', belly:'#e8d8b8', faceCol:'#e8dcc4', ears:'tufts', earCol:'#7a5a3a', beak:'#e8a030', owlEyes:true, eyeSize:1.2, eyeGap:.4, arms:'#7a5a3a', feet:'#e8a030', blinkOff:.9, bodyExtra:(c,k,f)=>{ c.strokeStyle=k.D('#c8b090'); c.lineWidth=.3; for(let i=0;i<3;i++) for(let j=-1;j<=1;j++){ c.beginPath(); c.arc(j*1.6,f.by-1+i*1.6,.5,.2,Math.PI-.2); c.stroke(); } }},
  // ---- birds (side-on) ----
  duck:    {rig:'bird', main:'#f8d84a', belly:'#fbe68a', wing:'#e8c030', beak:'duck', beakCol:'#f09030', legs:'#f09030', headR:3.2, blinkOff:.3},
  goose:   {rig:'bird', main:'#f4f4f0', belly:'#ffffff', wing:'#d8d8dc', beak:'cone', beakCol:'#f08a30', legs:'#f08a30', neck:3.4, headR:2.7, bodyRx:5.8, size:1.05, blinkOff:1.4},
  chicken: {rig:'bird', main:'#f6f2ec', belly:'#ffffff', wing:'#e0d8cc', tailCol:'#c8bca8', beak:'cone', beakCol:'#f0b030', legs:'#f0b030', blinkOff:2.2, crest:(c,k,hr)=>{ for(let i=0;i<3;i++) k.ci(-hr*.2+i*hr*.32,-hr*.95-Math.sin(i*1.4)*hr*.12,hr*.24,'#e83a3a'); }, headExtra:(c,k,hr)=>{ k.el(hr*.85,hr*.65,hr*.15,hr*.28,'#e83a3a'); }},
  parrot:  {rig:'bird', main:'#3ab84a', belly:'#f8d83a', wing:'#2a5ac8', tailCol:'#e83a3a', tailLen:5, headCol:'#e8443a', beak:'hook', beakCol:'#f4f0e8', legs:'#8a8a90', cheek:'#f8f4ee', blinkOff:.7},
  flamingo:{rig:'bird', main:'#f8a0b8', belly:'#fbc0d0', wing:'#f08aa6', tailCol:'#e8708a', beak:'flamingo', beakCol:'#f8e8e0', legs:'#f080a0', legH:9, neck:5, headR:2.4, bodyRx:5, blinkOff:1.9},
  pelican: {rig:'bird', main:'#f4f4f0', belly:'#ffffff', wing:'#c8c8cc', beak:'long', beakCol:'#f0b040', legs:'#f0a040', neck:2, headR:2.8, size:1.05, blinkOff:2.7},
  puffin:  {rig:'bird', main:'#1c1c22', belly:'#f8f8f8', wing:'#2a2a32', cheek:'#f4f4f4', beak:'puffin', beakCol:'#f06030', legs:'#f06030', upright:true, bodyRx:4.2, bodyRy:5.4, legH:2, headR:3, eyeCol:'#1a1210', blinkOff:1.1},
  penguin: {rig:'bird', main:'#1c1c28', belly:'#f8f8f8', wing:'#1c1c28', beak:'cone', beakCol:'#f0a030', legs:'#f0a030', upright:true, flipper:true, bodyRx:4.4, bodyRy:6.2, legH:1.2, headR:3.2, cheek:'#f8f8f8', blinkOff:2.4},
  phoenix: {rig:'bird', main:'#ff6a2a', belly:'#ffc84a', wing:'#ff3a2a', tailCol:'#ffd84a', tailLen:6.5, beak:'hook', beakCol:'#ffd84a', legs:'#c8602a', blinkOff:.5, crest:(c,k,hr,t)=>{ for(let i=0;i<3;i++){ const f=Math.sin(t*6+i)*.2; c.fillStyle=k.D(['#ffd84a','#ff9a2a','#ff5a2a'][i]); c.beginPath(); c.moveTo(-hr*.3+i*hr*.25,-hr*.7); c.quadraticCurveTo(-hr*.9+i*hr*.3,-hr*1.6+f,-hr*.4+i*hr*.4,-hr*2.1-i*hr*.2); c.quadraticCurveTo(-hr*.2+i*hr*.3,-hr*1.2,hr*.1+i*hr*.2,-hr*.75); c.fill(); } }, headGlow:(c,k,hr,t)=>{ const gr=c.createRadialGradient(0,0,hr*.5,0,0,hr*2.2); gr.addColorStop(0,'rgba(255,200,90,'+(.28+.12*Math.sin(t*4))+')'); gr.addColorStop(1,'rgba(255,160,60,0)'); c.fillStyle=gr; c.fillRect(-hr*2.2,-hr*2.2,hr*4.4,hr*4.4); }},
  // ---- low-slung reptiles on the four-legged rig ----
  turtle:  {rig:'quad', main:'#7ab05a', belly:'#c8d88a', shell:'#5a8a3a', shellLine:'#3a6a2a', ears:'none', tail:'stub', legH:2, legW:2, bodyRx:6.4, bodyRy:3.4, headR:2.7, snout:{l:.9,w:1,col:'#86bc66'}, nose:'#2a3a20', blinkOff:1.7},
  lizard:  {rig:'quad', main:'#4ab8a0', belly:'#a8e8c8', ears:'none', tail:'reptile', legH:1.5, legW:1.3, bodyRx:5.8, bodyRy:2.4, headR:2.5, snout:{l:2,w:1.2,col:'#5ac8b0'}, nose:'#2a4a40', mark:'spots', accent:'#2a8a7a', eyeCol:'#5a3a10', blinkOff:2.3},
  axopet:  {rig:'quad', main:'#f4a8c0', belly:'#f8c8d8', ears:'none', tail:'reptile', legH:1.4, legW:1.3, bodyRx:5.4, bodyRy:2.6, headR:3.2, snout:{l:1.1,w:1.3,col:'#f8c0d0'}, nose:'#d87a9a', blinkOff:.6,
    // three frilly gill fronds fanning up and back from behind the head (far side darker), gently waving
    headBehind:(c,k,hr,t)=>{ for(const far of [1,0]) for(let i=0;i<3;i++){ const a=-2.55+i*.48+Math.sin(t*2+i)*.06+(far?.18:0); c.save(); c.translate(-hr*(far?.15:.45),-hr*(far?.45:.25)); c.rotate(a); const col=far?'#d8506a':'#e8607a';
      k.el(hr*.7,0,hr*.72,hr*.17,col); for(let j=0;j<4;j++) k.el(hr*(.35+j*.3),hr*.17,hr*.1,hr*.07,far?'#e8708a':'#f48aa2'); k.el(hr*1.35,0,hr*.16,hr*.14,col); c.restore(); } }},
  dragon:  {rig:'quad', main:'#6a9a4a', belly:'#e8d888', ears:'pointy', earIn:'#e8d888', tail:'reptile', spikes:'#e8a83a', legH:3.4, bodyRx:7, bodyRy:3.8, headR:3.8, snout:{l:2.6,w:1.6,col:'#7aaa5a'}, nose:'#2a3a20', horn:'goat', eyeCol:'#5a2a00', blinkOff:2.9,
    extras:(c,k,f)=>{ const fl=Math.sin(f.t*(f.m.petted||f.m.happy?12:3))*.25; c.save(); c.translate(-.6,f.by-f.ry*.6); c.rotate(-.5-fl); c.fillStyle=k.D('#4a7a3a'); c.beginPath(); c.moveTo(0,0); c.quadraticCurveTo(-2,-6,-6.4,-6.8); c.quadraticCurveTo(-5.4,-4.6,-5.8,-3); c.quadraticCurveTo(-4,-3.8,-3.6,-1.8); c.quadraticCurveTo(-2,-2.4,0,0); c.fill(); c.strokeStyle=k.D('#8aba6a'); c.lineWidth=.3; c.beginPath(); c.moveTo(0,0); c.lineTo(-6,-6.4); c.moveTo(-1,-.6); c.lineTo(-5.6,-3.2); c.stroke(); c.restore();
      if(!f.sleep && (f.t%6)<.9){ const p=(f.t%6)/.9; for(let i=0;i<3;i++){ c.save(); c.globalAlpha=(1-p)*.6; k.ci(f.hx+f.hr*1.6+p*4+i*.8,f.hy+f.hr*.1-p*2-i*.6,.6+p*.8,'#d8d8e0'); c.restore(); } } }},
  // ---- one-of-a-kind pets ----
  frog:{rig:'custom', draw:PET3_CUSTOM.frog}, frogprince:{rig:'custom', draw:PET3_CUSTOM.frogprince}, crab:{rig:'custom', draw:PET3_CUSTOM.crab},
  octopus:{rig:'custom', draw:PET3_CUSTOM.octopus}, jelly:{rig:'custom', draw:PET3_CUSTOM.jelly}, babywhale:{rig:'custom', draw:PET3_CUSTOM.babywhale},
  narwhal:{rig:'custom', draw:PET3_CUSTOM.narwhal}, seal:{rig:'custom', draw:PET3_CUSTOM.seal}, ghost:{rig:'custom', draw:PET3_CUSTOM.ghost},
  robot:{rig:'custom', draw:PET3_CUSTOM.robot}, slime:{rig:'custom', draw:PET3_CUSTOM.slime}, snail:{rig:'custom', draw:PET3_CUSTOM.snail},
  fireflyjar:{rig:'custom', draw:PET3_CUSTOM.fireflyjar}, mushroombuddy:{rig:'custom', draw:PET3_CUSTOM.mushroombuddy}, snowman:{rig:'custom', draw:PET3_CUSTOM.snowman},
  bat:{rig:'custom', draw:PET3_CUSTOM.bat},
};
// every pet without its own entry yet keeps the old drawing until its rig is done
function drawPet3(c,id,x,y,s,t,night,lk){ const P=PET3[id]; if(!P) return false; c.save(); c.translate(x,y); c.scale(s,s); const m=petMood3(id);
  if(P.rig==='quad') rigQuad(c,P,t,night,lk,m,id); else if(P.rig==='sit') rigSit(c,P,t,night,lk,m,id); else if(P.rig==='bird') rigBird(c,P,t,night,lk,m,id); else if(P.rig==='custom') P.draw(c,P,t,night,lk,m,id);
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
