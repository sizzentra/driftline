// =====================================================================
// 0.3.6 decorations sit in the world: every decoration gets a soft contact shadow sized to its real footprint,
// and still decorations are drawn from a cached, already-lit sprite (the lighting used to be rebuilt every frame
// for every decoration, which cost the aquarium frame time). Decorations that move (bubbles, flickers, sparkles)
// are detected automatically and keep drawing live. Sprites are trimmed to the item, so phones stay light.
// =====================================================================
const DEC036={probe:{}, spr:{}, n:0};
const _drawDecor_036=drawDecor;
function decProbe(id){ let p=DEC036.probe[id]; if(p) return p;
  const W=320, H=360, ox=160, oy=320, cv=document.createElement('canvas'); cv.width=W; cv.height=H; const x=cv.getContext('2d',{willReadFrequently:true});
  const shot=t=>{ x.setTransform(1,0,0,1,0,0); x.clearRect(0,0,W,H); try{ _drawDecor_036(x,id,ox,oy,1,t); }catch(e){ oops('be_decor036:_drawDecor_036',e); } return x.getImageData(0,0,W,H).data; };
  const a=shot(1.13), b=shot(2.71); let diff=0, minx=W, maxx=-1, miny=H, maxy=-1, fx0=W, fx1=-1;
  for(let yy=0;yy<H;yy+=2) for(let xx=0;xx<W;xx+=2){ const i=(yy*W+xx)*4, al=a[i+3]; if(al>10){ if(xx<minx)minx=xx; if(xx>maxx)maxx=xx; if(yy<miny)miny=yy; if(yy>maxy)maxy=yy; if(yy>oy-22&&yy<oy+6){ if(xx<fx0)fx0=xx; if(xx>fx1)fx1=xx; } }
    diff+=Math.abs(al-b[i+3])+Math.abs(a[i]-b[i]); }
  const moving=diff>4000;
  if(maxx<0){ minx=ox-40; maxx=ox+40; miny=oy-80; maxy=oy; }
  if(fx1<0){ fx0=minx+(maxx-minx)*.15; fx1=maxx-(maxx-minx)*.15; }
  p=DEC036.probe[id]={moving, bx0:minx-ox-6, by0:miny-oy-6, bx1:maxx-ox+6, by1:Math.max(maxy-oy+6,10), fw:Math.max(16,fx1-fx0), fc:(fx0+fx1)/2-ox};
  return p; }
// measuring a decoration takes a few milliseconds, so it happens in idle time, one at a time (never a hitch);
// until then the decoration simply draws live
const DEC_Q=[], DEC_QS=new Set();
function decQueue(id){ if(DEC036.probe[id]||DEC_QS.has(id)) return; DEC_QS.add(id); DEC_Q.push(id); if(DEC_Q.length===1) decIdle(); }
function decIdle(){ const run=()=>{ const id=DEC_Q.shift(); if(id){ decProbe(id); DEC_QS.delete(id); } if(DEC_Q.length) decIdle(); };
  if(window.requestIdleCallback) requestIdleCallback(run,{timeout:600}); else setTimeout(run,60); }
drawDecor = function(c,id,x,y,s,t){ if(!(s>0)) return _drawDecor_036(c,id,x,y,s,t);
  const p=DEC036.probe[id]; if(!p){ decQueue(id); return _drawDecor_036(c,id,x,y,s,t); }
  // contact shadow on the sand
  c.save(); const rx=p.fw*.55*s, ry=Math.max(2,6*s), sx=x+p.fc*s, sy=y+1.5*s, g=c.createRadialGradient(sx,sy,0,sx,sy,rx); g.addColorStop(0,'rgba(0,10,22,.34)'); g.addColorStop(.6,'rgba(0,10,22,.16)'); g.addColorStop(1,'rgba(0,10,22,0)'); c.fillStyle=g; c.beginPath(); c.ellipse(sx,sy,rx,ry,0,0,7); c.fill(); c.restore();
  if(p.moving) return _drawDecor_036(c,id,x,y,s,t);
  const m=c.getTransform?c.getTransform():null; if(!m||m.b||m.c) return _drawDecor_036(c,id,x,y,s,t);
  const eff=Math.abs(m.a)*s, q=Math.max(.2,Math.round(eff*10)/10), key=id+'|'+q; let sp=DEC036.spr[key];
  if(!sp){ const w=Math.ceil((p.bx1-p.bx0)*q), h=Math.ceil((p.by1-p.by0)*q); if(w<2||h<2||w*h>4e6) return _drawDecor_036(c,id,x,y,s,t);
    const cv=document.createElement('canvas'); cv.width=w; cv.height=h; const x2=cv.getContext('2d'); x2.setTransform(q,0,0,q,-p.bx0*q,-p.by0*q); try{ _drawDecor_036(x2,id,0,0,1,1.13); }catch(e){ oops('be_decor036:_drawDecor_036#2',e); } x2.setTransform(1,0,0,1,0,0); defineSprite(cv,{d:Math.max(1,Math.round(q*1.6))});
    sp=DEC036.spr[key]={cv}; if(++DEC036.n>70){ DEC036.spr={}; DEC036.n=1; DEC036.spr[key]=sp; } }
  c.drawImage(sp.cv,x+p.bx0*s,y+p.by0*s,(p.bx1-p.bx0)*s,(p.by1-p.by0)*s); };
if(/[?&]test\b/.test(location.search)) window.__decProbe=()=>Object.fromEntries(Object.entries(DEC036.probe).map(([k,v])=>[k,v.moving?'live':'cached']));
// QC (test mode only): decorations drawn through the real cached path (measured first, so the finished sprites show)
if(/[?&]test\b/.test(location.search)) window.__decorReal=async(ids,save,sc=1.15)=>{ ids.forEach(id=>decProbe(id)); const cols=8, cw=170, ch=190, cv=document.createElement('canvas'); cv.width=cols*cw; cv.height=Math.ceil(ids.length/cols)*ch; const x=cv.getContext('2d');
  x.fillStyle='#123848'; x.fillRect(0,0,cv.width,cv.height); x.fillStyle='#c8b080'; for(let r=0;r<cv.height/ch;r++) x.fillRect(0,r*ch+ch-24,cv.width,24);
  ids.forEach((id,i)=>drawDecor(x,id,(i%cols)*cw+cw/2,Math.floor(i/cols)*ch+ch-24,sc,1.13)); x.fillStyle='#fff'; x.font='11px system-ui'; ids.forEach((id,i)=>x.fillText(id,(i%cols)*cw+6,Math.floor(i/cols)*ch+ch-8));
  return __post(save||'decreal',cv.toDataURL()); };
