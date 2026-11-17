// =====================================================================
// 0.3.6 hats redrawn to fit the head. Every hat here is built from the real head outline (hat space: the head's centre
// is at (0,1.4), the head with hair is about 8 wide each way, the eye sits at (4.4,0.4), the face looks to +x), so
// nothing floats above the head, sticks out past it as a flat slab, or covers the eye:
//  - peaked hats (cap, propeller cap, 67 cap, captain's hat, tide cap) share one curved brim that grows out of the crown
//  - the headband wraps the forehead with its knot and tails attached at the back
//  - the headphone band runs from the ear cup up over the crown
//  - Santa hat and beanies have rounded, fitted cuffs; the straw boater has a woven crown seated on a woven brim
//  - the diving and space helmets sit on a curved shoulder collar
// The front-facing pet versions (HAT_TRIM_OFF) keep their own drawings.
// =====================================================================
const HAT036_HEAD={cx:0,cy:1.4,r:8};
function hat036HalfW(y,r){ const dy=y-HAT036_HEAD.cy, R=r||HAT036_HEAD.r; return Math.sqrt(Math.max(0,R*R-dy*dy)); }
function hat036Grad(c,x0,y0,x1,y1,stops){ const g=c.createLinearGradient(x0,y0,x1,y1); stops.forEach((s,i)=>g.addColorStop(i/(stops.length-1),s)); return g; }
// the peaked crown (six panels, seams, button) and the curved brim, shared by the peaked hats
function hat036Crown(c,col,o={}){ const dk=mix(col,'#000000',.32), lt=mix(col,'#ffffff',.22), dd=mix(col,'#000000',.5);
  const crown=()=>{ c.beginPath(); c.moveTo(-8.2,-.6); c.bezierCurveTo(-8.6,-6.4,-4.8,-10.2,.4,-10.1); c.bezierCurveTo(5.4,-10,8.4,-6.6,8.4,-1.8); c.lineTo(8.2,-.4); c.quadraticCurveTo(0,.6,-8.2,-.6); c.closePath(); };
  c.fillStyle=o.fill||hat036Grad(c,-8,-10,6,0,[dk,col,lt]); crown(); c.fill();
  c.save(); crown(); c.clip(); if(o.inside) o.inside();
  c.strokeStyle=v3rgba(dd,.5); c.lineWidth=.32; c.beginPath(); c.moveTo(.6,-10); c.quadraticCurveTo(3.2,-5,3.4,.2); c.moveTo(.4,-10); c.quadraticCurveTo(-3.6,-5.4,-4.6,0); c.stroke();
  c.strokeStyle=v3rgba(lt,.45); c.lineWidth=.2; c.setLineDash([.5,.45]); c.beginPath(); c.moveTo(1.1,-9.6); c.quadraticCurveTo(3.8,-5,4,0); c.stroke(); c.setLineDash([]);
  c.fillStyle='rgba(255,250,240,.14)'; c.beginPath(); c.ellipse(4.6,-6.4,3.2,2.2,-.5,0,7); c.fill();
  c.fillStyle='rgba(10,6,16,.18)'; c.beginPath(); c.ellipse(-7,-3,3.4,6,0,0,7); c.fill();
  c.fillStyle=dk; c.beginPath(); c.moveTo(-8.6,-1.2); c.quadraticCurveTo(0,-.2,8.6,-1.4); c.lineTo(8.6,1); c.lineTo(-8.6,1); c.closePath(); c.fill();
  c.restore();
  if(!o.noButton){ c.fillStyle=dk; c.beginPath(); c.ellipse(.4,-10.1,1.2,.65,0,0,7); c.fill(); c.fillStyle=v3rgba(lt,.6); c.beginPath(); c.ellipse(.2,-10.35,.6,.25,0,0,7); c.fill(); } }
function hat036Brim(c,col,o={}){ const x0=o.x0||6.2, y0=o.y0||-2.2, L=o.len||8, lt=mix(col,'#ffffff',o.gloss?.35:.22), dd=mix(col,'#000000',.5), k=L/8;
  c.fillStyle=dd; c.beginPath(); c.moveTo(x0+.2,y0+.8); c.quadraticCurveTo(x0+4.8*k,y0-.0,x0+8*k,y0+2); c.quadraticCurveTo(x0+8.4*k,y0+2.7,x0+7.6*k,y0+3); c.quadraticCurveTo(x0+4.2*k,y0+2.4,x0+.4,y0+2.8); c.closePath(); c.fill();
  c.fillStyle=hat036Grad(c,x0,y0-.4,x0+8*k,y0+2.2,[mix(col,'#000000',.12),lt]);
  c.beginPath(); c.moveTo(x0,y0); c.quadraticCurveTo(x0+4.6*k,y0-1.1,x0+8*k,y0+1.6); c.quadraticCurveTo(x0+8.2*k,y0+2.1,x0+7.7*k,y0+2.3); c.quadraticCurveTo(x0+4.4*k,y0+1,x0+.2,y0+1.5); c.closePath(); c.fill();
  c.strokeStyle=v3rgba(lt,o.gloss?.75:.5); c.lineWidth=.22; c.beginPath(); c.moveTo(x0+.8,y0-.05); c.quadraticCurveTo(x0+4.6*k,y0-.9,x0+7.6*k,y0+1.45); c.stroke(); }
const HAT036={
  cap(c,col){ hat036Crown(c,col); hat036Brim(c,col); },
  propeller(c,col,t){ hat036Crown(c,col,{noButton:1}); hat036Brim(c,col);
    c.fillStyle='#8a8f96'; c.fillRect(-.05,-13.6,.9,3.7); c.fillStyle='#c8ccd2'; c.fillRect(.05,-13.6,.3,3.6);
    const a=t*9, sp=Math.cos(a); for(const [s,cl] of [[1,'#e8483e'],[-1,'#3e8ae8']]){ const w=4.6*sp*s; c.fillStyle=cl; c.beginPath(); c.ellipse(.4+w/2,-13.8,Math.abs(w/2)+.15,.75,0,0,7); c.fill(); }
    c.fillStyle='#5a5f66'; c.beginPath(); c.arc(.4,-13.8,.6,0,7); c.fill(); },
  sixsevencap(c,col){ hat036Crown(c,col,{inside:()=>{ c.fillStyle='#ffffff'; c.font='bold 5.2px system-ui,sans-serif'; c.textAlign='center'; c.textBaseline='middle'; c.save(); c.translate(2.6,-4.6); c.rotate(-.08); c.fillText('67',0,0); c.restore(); }}); hat036Brim(c,col); },
  captain(c,col){ const navy='#1c2a48', gold='#e8c050';
    // band, then the white top that tilts forward over it, then the glossy visor and the gold cord and badge
    c.fillStyle=hat036Grad(c,0,-5,0,-.4,['#2a3a5e',navy]); c.beginPath(); c.moveTo(-8,-.6); c.lineTo(-8.1,-4.6); c.quadraticCurveTo(0,-5.4,8.2,-4.9); c.lineTo(8.4,-1.2); c.quadraticCurveTo(0,.2,-8,-.6); c.closePath(); c.fill();
    c.fillStyle=hat036Grad(c,-9,-9,9,-4,['#d8dce2','#ffffff','#eef0f2']); c.beginPath(); c.moveTo(-8.6,-4.4); c.bezierCurveTo(-10.2,-8.8,-2,-10.4,3.2,-9.9); c.bezierCurveTo(8.6,-9.4,11.2,-7.2,9.8,-5.2); c.quadraticCurveTo(.4,-3.8,-8.6,-4.4); c.closePath(); c.fill();
    c.strokeStyle='rgba(120,130,150,.45)'; c.lineWidth=.3; c.beginPath(); c.moveTo(-8.4,-4.6); c.quadraticCurveTo(.4,-4.1,9.6,-5.3); c.stroke();
    hat036Brim(c,'#14161c',{x0:6.4,y0:-1.6,len:7,gloss:1});
    c.strokeStyle=gold; c.lineWidth=.55; c.beginPath(); c.moveTo(-7.8,-1.8); c.quadraticCurveTo(0,-1.6,8.2,-2.4); c.stroke();
    c.fillStyle=gold; c.beginPath(); c.ellipse(5.4,-3.2,1.25,1,0,0,7); c.fill(); c.fillStyle='#fff3c0'; c.beginPath(); c.ellipse(5.1,-3.5,.45,.3,0,0,7); c.fill(); },
  tidecap(c,col){ const band='#2a8fb0';
    c.fillStyle=hat036Grad(c,0,-5,0,-.4,['#3aa8c8',band]); c.beginPath(); c.moveTo(-8,-.6); c.lineTo(-8.1,-4.6); c.quadraticCurveTo(0,-5.4,8.2,-4.9); c.lineTo(8.4,-1.2); c.quadraticCurveTo(0,.2,-8,-.6); c.closePath(); c.fill();
    c.strokeStyle='rgba(255,255,255,.9)'; c.lineWidth=.55; c.beginPath(); for(let x=-7.6;x<=8;x+=.4){ const y=-2.8+Math.sin(x*1.1)*.55; x<=-7.5?c.moveTo(x,y):c.lineTo(x,y); } c.stroke();
    c.fillStyle=hat036Grad(c,-9,-9,9,-4,['#dfe3e6','#ffffff','#f2f4f2']); c.beginPath(); c.moveTo(-8.4,-4.4); c.bezierCurveTo(-9.6,-8.6,-2,-9.8,3,-9.4); c.bezierCurveTo(8,-9,10.2,-7,9.4,-5.1); c.quadraticCurveTo(.4,-3.9,-8.4,-4.4); c.closePath(); c.fill();
    hat036Brim(c,'#1a2a3a',{x0:6.4,y0:-1.6,len:7,gloss:1}); },
  headband(c,col){ const lt=mix(col,'#ffffff',.3), dk=mix(col,'#000000',.3), yt=-3.6, yb=-1.2, wt=hat036HalfW(yt,8.15), wb=hat036HalfW(yb,8.15);
    // tails and knot at the back first (behind the band)
    c.fillStyle=dk; c.beginPath(); c.moveTo(-wb+.4,yb-1.6); c.quadraticCurveTo(-wb-2.4,yb+.4,-wb-3.4,yb+3.6); c.lineTo(-wb-2.2,yb+3.9); c.quadraticCurveTo(-wb-1.4,yb+1.2,-wb+.9,yb-.6); c.closePath(); c.fill();
    c.fillStyle=col; c.beginPath(); c.moveTo(-wb+.5,yb-1.8); c.quadraticCurveTo(-wb-3.4,yb-1.6,-wb-4.4,yb+1.8); c.lineTo(-wb-3.3,yb+2.3); c.quadraticCurveTo(-wb-2.2,yb-.2,-wb+.8,yb-.9); c.closePath(); c.fill();
    c.fillStyle=hat036Grad(c,0,yt-.6,0,yb,[lt,col,dk]); c.beginPath(); c.moveTo(-wt,yt); c.quadraticCurveTo(0,yt-.7,wt,yt-.1); c.lineTo(wb,yb-.1); c.quadraticCurveTo(0,yb-.5,-wb,yb); c.closePath(); c.fill();
    c.strokeStyle=v3rgba(lt,.75); c.lineWidth=.35; c.beginPath(); c.moveTo(-wt+.4,yt+.8); c.quadraticCurveTo(0,yt+.15,wt-.3,yt+.75); c.stroke();
    c.fillStyle=dk; c.beginPath(); c.ellipse(-wb+.5,(yt+yb)/2,1,1.35,0,0,7); c.fill(); },
  headphones(c,col){ const dk=mix(col,'#000000',.35), lt=mix(col,'#ffffff',.25), EX=-2.75, EY=2.1, top=HAT036_HEAD.cy-hat036HalfW(EX+.4,8.2);
    // the band rises from the cup and runs over the crown; its padded top sits on the hair
    c.strokeStyle=dk; c.lineCap='round'; c.lineWidth=1.7; c.beginPath(); c.moveTo(EX+.1,EY-2.4); c.quadraticCurveTo(EX-.9,(EY+top)/2,EX+.4,top-.5); c.stroke();
    c.strokeStyle=v3rgba(lt,.8); c.lineWidth=.45; c.beginPath(); c.moveTo(EX-.35,EY-2.6); c.quadraticCurveTo(EX-1.3,(EY+top)/2,EX-.05,top-.7); c.stroke();
    c.fillStyle=hat036Grad(c,0,top-1.6,0,top+.4,[lt,col]); c.beginPath(); c.ellipse(EX+.45,top-.55,1.55,1.05,-.15,0,7); c.fill();
    c.fillStyle=dk; c.beginPath(); c.ellipse(EX,EY,2.7,3.3,-.1,0,7); c.fill();
    c.fillStyle=hat036Grad(c,EX-2,EY-3,EX+2,EY+3,[lt,col]); c.beginPath(); c.ellipse(EX-.35,EY,2.15,2.8,-.1,0,7); c.fill();
    c.fillStyle='rgba(255,255,255,.3)'; c.beginPath(); c.ellipse(EX-1,EY-1.2,.7,1,-.3,0,7); c.fill(); c.lineCap='butt'; },
  santa(c,col){ const dk=mix(col,'#000000',.3), lt=mix(col,'#ffffff',.18), fur='#f6f3ee', furD='#d8d2ca';
    c.fillStyle=hat036Grad(c,-6,-12,8,-2,[dk,col,lt]); c.beginPath(); c.moveTo(-8,-2.6); c.bezierCurveTo(-8.4,-9.6,-1,-13.6,6,-13.2); c.quadraticCurveTo(10.4,-12.4,11.6,-7.6); c.quadraticCurveTo(9.6,-10.4,6.6,-9.6); c.quadraticCurveTo(8.2,-6,8.4,-2.8); c.closePath(); c.fill();
    c.fillStyle='rgba(20,0,0,.16)'; c.beginPath(); c.moveTo(6.6,-9.6); c.quadraticCurveTo(9.6,-10.4,11.6,-7.6); c.quadraticCurveTo(9.2,-9,6.9,-8.8); c.closePath(); c.fill();
    const band=()=>{ c.beginPath(); const yt=-4.4, yb=-.4; c.moveTo(-8.7,yb); for(let i=0;i<=12;i++){ const x=-8.7+i*17.6/12; c.lineTo(x,yt+Math.sin(i*1.9)*.35); } c.lineTo(8.9,yb); for(let i=12;i>=0;i--){ const x=-8.7+i*17.6/12; c.lineTo(x,yb+Math.sin(i*2.3)*.3); } c.closePath(); };
    c.fillStyle=hat036Grad(c,0,-4.6,0,-.2,[fur,fur,furD]); band(); c.fill();
    c.fillStyle='rgba(255,255,255,.6)'; for(let i=0;i<9;i++){ c.beginPath(); c.arc(-7.6+i*1.95,-3.4+(i%2)*.7,.5,0,7); c.fill(); }
    c.fillStyle=hat036Grad(c,10,-9,13,-5,[fur,furD]); c.beginPath(); c.arc(11.7,-7,1.9,0,7); c.fill(); c.fillStyle='rgba(255,255,255,.7)'; c.beginPath(); c.arc(11.2,-7.6,.7,0,7); c.fill(); },
  beanie(c,col){ hat036Beanie(c,col,false); },
  cozybeanie(c,col){ hat036Beanie(c,col,true); },
  straw(c,col){ const s1='#e8cc88', s2='#c9a85e', s3='#a8884a';
    // woven brim (a flat ellipse seen almost edge on), then the crown seated on it with its ribbon
    c.fillStyle=s3; c.beginPath(); c.ellipse(.4,-2.6,13.4,2.3,0,0,7); c.fill();
    c.fillStyle=hat036Grad(c,0,-4.8,0,-1.2,['#f0d896',s1,s2]); c.beginPath(); c.ellipse(.4,-3.1,13.2,1.95,0,0,7); c.fill();
    c.strokeStyle='rgba(140,104,40,.35)'; c.lineWidth=.22; for(const k of [.55,.75,.92]){ c.beginPath(); c.ellipse(.4,-3.1,13.2*k,1.95*k,0,0,7); c.stroke(); }
    const crown=()=>{ c.beginPath(); c.moveTo(-6.5,-3.2); c.lineTo(-6.1,-9.2); c.quadraticCurveTo(-6,-10.2,-4.9,-10.3); c.lineTo(5.1,-10.1); c.quadraticCurveTo(6.2,-10,6.3,-9); c.lineTo(6.8,-3.2); c.quadraticCurveTo(.2,-2.4,-6.5,-3.2); c.closePath(); };
    c.fillStyle=hat036Grad(c,-6,0,7,0,[s2,s1,'#f2dc9e']); crown(); c.fill();
    c.save(); crown(); c.clip(); c.strokeStyle='rgba(140,104,40,.3)'; c.lineWidth=.25; for(let x=-6;x<7;x+=.9){ c.beginPath(); c.moveTo(x,-10.4); c.lineTo(x+.25,-2.6); c.stroke(); }
      c.fillStyle=col; c.beginPath(); c.moveTo(-6.6,-4.2); c.quadraticCurveTo(.2,-3.4,6.9,-4.3); c.lineTo(6.8,-6.3); c.quadraticCurveTo(.2,-5.6,-6.5,-6.2); c.closePath(); c.fill();
      c.fillStyle='rgba(255,255,255,.18)'; c.fillRect(-7,-6.3,14,.6); c.restore();
    c.fillStyle='rgba(255,246,220,.5)'; c.beginPath(); c.ellipse(-.2,-10.2,5.2,.45,0,0,7); c.fill(); },
};
function hat036Beanie(c,col,cozy){ const dk=mix(col,'#000000',.3), lt=mix(col,'#ffffff',.3);
  const dome=()=>{ c.beginPath(); c.moveTo(-8.2,-2.2); c.bezierCurveTo(-8.6,-8.4,-3.8,-11.2,.2,-11.1); c.bezierCurveTo(4.6,-11,8.8,-8.2,8.4,-2.2); c.closePath(); };
  c.fillStyle=hat036Grad(c,-8,-11,7,-2,[dk,col,lt]); dome(); c.fill();
  c.save(); dome(); c.clip(); c.strokeStyle=v3rgba(dk,.35); c.lineWidth=.3; for(let i=-6;i<=6;i++){ c.beginPath(); c.moveTo(i*1.25,-2); c.quadraticCurveTo(i*1.05,-7,i*.35,-11.2); c.stroke(); } c.restore();
  // a fitted, rounded cuff (it used to be a flat bar sticking out past the head)
  const cuff=()=>{ c.beginPath(); if(c.roundRect) c.roundRect(-8.7,-4.6,17.6,4.5,1.8); else c.rect(-8.7,-4.6,17.6,4.5); };
  c.fillStyle=hat036Grad(c,0,-4.6,0,0,[mix(col,'#ffffff',.08),mix(col,'#000000',.12)]); cuff(); c.fill();
  c.save(); cuff(); c.clip(); c.strokeStyle=v3rgba(cozy?lt:dk,cozy?.55:.4); c.lineWidth=cozy?.55:.3; for(let x=-8.2;x<9;x+=cozy?1.6:.9){ c.beginPath(); c.moveTo(x,-4.6); c.lineTo(x,0); c.stroke(); } c.fillStyle='rgba(255,255,255,.14)'; c.fillRect(-9,-4.6,18,1.1); c.restore();
  // pompom made of soft tufts
  const px=.2, py=-11.4, pr=cozy?2.9:2.5; c.fillStyle=lt; for(let i=0;i<9;i++){ const a=i/9*Math.PI*2; c.beginPath(); c.arc(px+Math.cos(a)*pr*.55,py+Math.sin(a)*pr*.55,pr*.62,0,7); c.fill(); }
  c.fillStyle=mix(lt,'#ffffff',.4); c.beginPath(); c.arc(px-.6,py-.8,pr*.45,0,7); c.fill(); }
// diving and space helmets: the same helmets, on a curved shoulder collar
function hat036Collar(c,cl,dk,rivets){ c.fillStyle=cl; c.beginPath(); c.moveTo(-12.2,11.6); c.quadraticCurveTo(-11.4,7.6,-7.6,7.1); c.quadraticCurveTo(0,6.4,7.8,7.1); c.quadraticCurveTo(11.8,7.6,12.6,11.6); c.closePath(); c.fill();
  c.fillStyle='rgba(255,255,255,.28)'; c.beginPath(); c.moveTo(-10.6,8.6); c.quadraticCurveTo(0,6.9,10.8,8.6); c.quadraticCurveTo(0,7.6,-10.6,9.2); c.closePath(); c.fill();
  if(rivets){ c.fillStyle=dk; for(let i=0;i<7;i++){ const u=i/6, x=-9.6+u*19.4, y=8.9-Math.sin(u*Math.PI)*1.1; c.beginPath(); c.arc(x,y,.42,0,7); c.fill(); } } }
HAT036.diver=function(c){ c.save(); const sh=(a,b)=>hat036Grad(c,-10,-10,8,10,[a,b]);
  hat036Collar(c,'#b8863a','#6a4410',true);
  c.fillStyle=sh('#e8b860','#8a5a1a'); c.beginPath(); c.arc(-.4,.4,11.2,0,7); c.moveTo(10,.4); c.arc(5.2,.4,4.8,0,7,true); c.fill('evenodd');
  c.fillStyle='rgba(150,210,235,.26)'; c.beginPath(); c.arc(5.2,.4,4.8,0,7); c.fill(); c.fillStyle='rgba(255,255,255,.45)'; c.beginPath(); c.ellipse(6.6,-2.2,1.6,.8,-.6,0,7); c.fill();
  c.strokeStyle='#6a4410'; c.lineWidth=1.3; c.beginPath(); c.arc(5.2,.4,4.8,0,7); c.stroke(); c.fillStyle='#5a3a10'; for(let i=0;i<6;i++){ const a=i/6*Math.PI*2; c.beginPath(); c.arc(5.2+Math.cos(a)*4.8,.4+Math.sin(a)*4.8,.45,0,7); c.fill(); }
  c.fillStyle='#2a4a5a'; c.beginPath(); c.arc(-5,-1.6,2.4,0,7); c.fill(); c.strokeStyle='#6a4410'; c.lineWidth=.8; c.stroke();
  c.fillStyle='#c8963a'; c.beginPath(); if(c.roundRect) c.roundRect(-2.2,-12.8,3,2.6,.6); else c.rect(-2.2,-12.8,3,2.6); c.fill();
  c.fillStyle='rgba(255,255,255,.3)'; c.beginPath(); c.ellipse(-4,-7,4,1.6,-.5,0,7); c.fill(); c.restore(); };
HAT036.astro=function(c){ c.save(); const sh=(a,b)=>hat036Grad(c,-10,-10,8,10,[a,b]);
  hat036Collar(c,'#d0d6dc','#8a949e',false);
  c.fillStyle=sh('#ffffff','#b8c0c8'); c.beginPath(); c.arc(-.4,.2,11.4,0,7); c.moveTo(11.2,.2); c.ellipse(5,0,6.2,6.8,0,0,7,true); c.fill('evenodd');
  c.fillStyle='rgba(220,170,60,.42)'; c.beginPath(); c.ellipse(5,0,6.2,6.8,0,0,7); c.fill(); c.strokeStyle='#9aa4ae'; c.lineWidth=1; c.stroke(); c.fillStyle='rgba(255,255,255,.55)'; c.beginPath(); c.ellipse(6.6,-3.4,2.4,1,-.6,0,7); c.fill();
  c.fillStyle='#c8d0d8'; c.beginPath(); c.arc(-3.4,1,2.6,0,7); c.fill(); c.fillStyle='#8a949e'; c.beginPath(); c.arc(-3.4,1,1.2,0,7); c.fill(); c.fillStyle='#e8303a'; c.beginPath(); c.arc(-8.4,-4.6,.9,0,7); c.fill(); c.restore(); };
const _drawHat_036=drawHat;
drawHat=function(c,id,col,t=0){ const f=HAT036[id]; if(!f||(typeof HAT_TRIM_OFF!=='undefined'&&HAT_TRIM_OFF)) return _drawHat_036(c,id,col,t);
  c.save(); c.lineCap='round'; c.lineJoin='round'; try{ f(c,col,t); }catch(e){ c.restore(); return _drawHat_036(c,id,col,t); } c.restore(); };
// QC (test mode only): every wearable, pet, decoration and junk id, read from the game's own lists
if(/[?&]test\b/.test(location.search)) window.__lists=()=>{ const id=x=>Array.isArray(x)?x[0]:(x&&x.id); const L={hats:HATS,outfits:OUTFITS,glasses:GLASSES,shoes:SHOES,necks:NECKS,backs:BACKS,beards:BEARDS,pets:PETS,decor:DECOR,junk:JUNK};
  const o={}; for(const k in L) o[k]=L[k].map(id).filter(Boolean); return o; };
// heart shades get an arm to the ear like every other pair (they sat on the face like a sticker)
const _drawFace_036=drawFace;
drawFace=function(c,lk,D,hair){ _drawFace_036(c,lk,D,hair); if(lk&&lk.glasses==='heart'){ const ex=4.4, ey=-57; c.save(); c.strokeStyle=D?D('#c82a68'):'#c82a68'; c.lineWidth=.5; c.lineCap='round'; c.beginPath(); c.moveTo(ex-2.1,ey-.5); c.quadraticCurveTo(1,ey-.9,-1.3,ey+.9); c.stroke(); c.restore(); } };
