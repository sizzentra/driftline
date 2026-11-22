
// =====================================================================
// 0.3 decorations: every dock and aquarium decoration is lit like the angler (soft light from above,
// shade underneath, a rim along the top edge; underwater ones get a cool caustic tint), the plainest
// ones are redrawn, and decorations matter more (cozy cap 40 with a sale bonus, aquarium decor ×2).
// =====================================================================
const LIT_POOL={a:null,b:null};
function litDraw(c,bx0,by0,bx1,by1,fn,o){ const m=c.getTransform(), sc=Math.hypot(m.a,m.b), pw=Math.ceil((bx1-bx0)*sc), ph=Math.ceil((by1-by0)*sc);
  if(!(pw>2&&ph>2)||pw*ph>6e6||m.b||m.c){ fn(c); return; }
  if(!LIT_POOL.a){ LIT_POOL.a=document.createElement('canvas'); LIT_POOL.b=document.createElement('canvas'); }
  const A=LIT_POOL.a, Bc=LIT_POOL.b; if(A.width<pw||A.height<ph){ A.width=Bc.width=Math.max(A.width,pw); A.height=Bc.height=Math.max(A.height,ph); }
  const ax=A.getContext('2d'); ax.setTransform(1,0,0,1,0,0); ax.clearRect(0,0,pw+2,ph+2); ax.setTransform(sc,0,0,sc,-bx0*sc,-by0*sc); fn(ax);
  ax.setTransform(1,0,0,1,0,0); ax.globalCompositeOperation='source-atop';
  const g1=ax.createLinearGradient(0,0,0,ph); g1.addColorStop(0,o.top); g1.addColorStop(.45,'rgba(0,0,0,0)'); g1.addColorStop(1,o.bottom); ax.fillStyle=g1; ax.fillRect(0,0,pw,ph);
  const g2=ax.createLinearGradient(0,0,pw,0); g2.addColorStop(0,'rgba(8,8,20,.16)'); g2.addColorStop(.5,'rgba(0,0,0,0)'); g2.addColorStop(1,'rgba(255,245,225,.08)'); ax.fillStyle=g2; ax.fillRect(0,0,pw,ph);
  // rim: the silhouette minus itself shifted down-left leaves a thin bright edge on the top and right
  const bx=Bc.getContext('2d'), d=Math.max(1,Math.min(2.2,sc*.9)); bx.setTransform(1,0,0,1,0,0); bx.clearRect(0,0,pw+2,ph+2); bx.globalCompositeOperation='source-over'; bx.drawImage(A,0,0,pw,ph,0,0,pw,ph);
  bx.globalCompositeOperation='source-in'; bx.fillStyle=o.rim; bx.fillRect(0,0,pw,ph); bx.globalCompositeOperation='destination-out'; bx.drawImage(A,0,0,pw,ph,-d,d,pw,ph); bx.globalCompositeOperation='source-over';
  ax.globalAlpha=o.rimA; ax.drawImage(Bc,0,0,pw,ph,0,0,pw,ph); ax.globalAlpha=1; ax.globalCompositeOperation='source-over';
  c.save(); c.setTransform(1,0,0,1,0,0); c.drawImage(A,0,0,pw,ph,m.a*bx0+m.e,m.d*by0+m.f,pw,ph); c.restore(); }

const _drawDecor_0 = drawDecor;
drawDecor = function(c,id,x,y,s,t){ litDraw(c,x-140*s,y-290*s,x+140*s,y+24*s,lc=>{ if(!decorNew(lc,id,x,y,s,t||0)) _drawDecor_0(lc,id,x,y,s,t); },{top:'rgba(225,250,255,.14)', bottom:'rgba(0,12,30,.2)', rim:'#d8f6ff', rimA:.38}); };
function decorNew(c,id,x,y,s,t){ const dot=(px,py,r,cl)=>{ c.fillStyle=cl; c.beginPath(); c.arc(px,py,r,0,7); c.fill(); };
  if(id==='treasurepile'){ c.save(); c.translate(x,y); c.scale(s,s); const g=c.createLinearGradient(0,-60,0,0); g.addColorStop(0,'#ffe27a'); g.addColorStop(1,'#b8861e'); c.fillStyle=g; c.beginPath(); c.moveTo(-78,0); c.quadraticCurveTo(-30,-62,4,-58); c.quadraticCurveTo(46,-52,80,0); c.closePath(); c.fill();
    for(let i=0;i<26;i++){ const a=(i*37)%100/100, px=-62+a*124, py=-6-Math.sin(a*Math.PI)*((i*13)%46)-4; dot(px,py,7,'#e8b830'); dot(px,py,4.6,'#ffd86a'); c.fillStyle='rgba(150,100,20,.6)'; c.fillRect(px-.8,py-3,1.6,6); }
    for(const [gx,gy,cl] of [[-24,-32,'#e8304a'],[18,-40,'#3a8ae8'],[40,-18,'#3ad87a'],[-48,-12,'#b86ae8']]){ c.fillStyle=cl; c.beginPath(); c.moveTo(gx,gy-8); c.lineTo(gx+6,gy); c.lineTo(gx,gy+8); c.lineTo(gx-6,gy); c.closePath(); c.fill(); c.fillStyle='rgba(255,255,255,.55)'; c.fillRect(gx-2,gy-4,2.2,3); }
    c.fillStyle='rgba(255,255,240,'+(.5+.5*Math.sin(t*3))+')'; c.fillRect(10,-50,3,3); c.fillRect(-36,-24,2.4,2.4); c.restore(); return true; }
  if(id==='duckarmy'){ c.save(); c.translate(x,y); c.scale(s,s); for(let i=0;i<5;i++){ const dx=-46+i*23, dy=-14-Math.abs(Math.sin(t*2+i))*3; dot(dx,dy,11,'#ffd23a'); c.fillStyle='#ffd23a'; c.beginPath(); c.ellipse(dx-2,dy+5,15,9,0,0,7); c.fill(); dot(dx+7,dy-10,7,'#ffd23a'); c.fillStyle='#ff8a2a'; c.beginPath(); c.moveTo(dx+13,dy-11); c.lineTo(dx+20,dy-9); c.lineTo(dx+13,dy-7); c.fill(); dot(dx+9,dy-12,1.4,'#1a1a1a'); c.fillStyle='rgba(200,150,20,.45)'; c.beginPath(); c.ellipse(dx-4,dy+3,7,4,-.3,0,7); c.fill(); } c.restore(); return true; }
  return false; }

// ---------- decorations matter more ----------
for(const d of DECOR) d.b=+(d.b*2).toFixed(3);
if(/[?&]test\b/.test(location.search)) window.__decorSheet=(t=1,only,sc=.9)=>{ const cols=only?only.length:8, cw=150*sc/.9, ch=170*sc/.9, ids=only||DECOR.map(d=>d.id||d[0]), cv=document.createElement('canvas'); cv.width=cols*cw; cv.height=Math.ceil(ids.length/cols)*ch; const c=cv.getContext('2d');
  c.fillStyle='#0e3a52'; c.fillRect(0,0,cv.width,cv.height); ids.forEach((id,i)=>{ const x=(i%cols)*cw+cw/2, y=Math.floor(i/cols)*ch+ch-26; c.fillStyle='#c8b080'; c.fillRect(x-cw/2+4,y,cw-8,20); drawDecor(c,id,x,y,sc,t); c.fillStyle='#fff'; c.font='11px sans-serif'; c.textAlign='center'; c.fillText(id,x,y+15); }); return cv.toDataURL(); };
