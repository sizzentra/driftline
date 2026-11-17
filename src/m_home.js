
// =====================================================================
// 0.3 Home: dock decorations sized to the angler, and decorations you can drag to a new spot
// (on the dock in the Home tab, and in the aquarium tank). Positions are saved as a fraction across the dock/tank.
// =====================================================================
// target height of each decoration in angler units (the angler stands about 70 tall)
const DOCK_H={mug:7,books:9,tacklebox:10,plants:22,gnome:17,lantern:20,bunting:64,blanket:6,umbrella:76,chair:42,windchime:60,birdhouse:60,catbed:12,lights:64,radio:11,campfire:22,telescope:46,tideflag:80,shipwheel:46,minilight:58};
const DOCK_NAT={};
function dockNative(id){ if(DOCK_NAT[id]) return DOCK_NAT[id]; let v={h:40};
  try{ const o=document.createElement('canvas'); o.width=420; o.height=420; const x=o.getContext('2d'); drawDockItem(x,id,210,320,1,0,0); const d=x.getImageData(0,0,420,420).data; let top=420,bot=0,lf=420,rt=0;
    for(let y=0;y<420;y++) for(let X=0;X<420;X+=2) if(d[(y*420+X)*4+3]>24){ if(y<top) top=y; if(y>bot) bot=y; if(X<lf) lf=X; if(X>rt) rt=X; }
    if(bot>top) v={h:bot-top,w:Math.max(4,rt-lf)}; }catch(e){}
  return DOCK_NAT[id]=v; }
function dockItemScale(id){ return DOCK_H[id] ? DOCK_H[id]/dockNative(id).h : 1.35; }
// positions: saved fraction, else the even spread that keeps clear of the angler
function dockPositions(items,avoidA,avoidB){ const pos=(S.dock.pos=S.dock.pos||{}), free=items.filter(id=>id!=='cottage'), def=homeSlots(free.length,0,1,avoidA,avoidB);
  const out={}; free.forEach((id,i)=>{ out[id]=pos[id]!=null?clamp(pos[id],0,1):def[i]; }); return out; }
function aqPositions(ds){ const pos=(S.aq.pos=S.aq.pos||{}), out={}; ds.forEach((id,i)=>{ out[id]=pos[id]!=null?clamp(pos[id],.03,.97):(i+.5)/Math.max(ds.length,1); }); return out; }

// Home tab: drag a decoration along the dock
const HOME_X0=.06, HOME_X1=.9;
function homeDragSetup(){ const c=$('homecv'); if(!c||c.dataset.drag) return; c.dataset.drag='1'; c.style.cursor='grab'; c.style.touchAction='pan-y';
  let drag=null; const toX=e=>{ const r=c.getBoundingClientRect(); return (e.clientX-r.left)*(c.width/r.width); };
  c.addEventListener('pointerdown',e=>{ const x=toX(e), w=c.width, items=dockView(), P=dockPositions(items,(.46-HOME_X0)/(HOME_X1-HOME_X0),(.64-HOME_X0)/(HOME_X1-HOME_X0)); let best=null, bd=w*.06;
    for(const wh of ['1','2']){ if(wh==='2'&&!(S.pet2&&PETI[S.pet2])) continue; if(wh==='1'&&!S.pet) continue; const d=Math.abs(homePetX(wh,w)-x); if(d<bd){ bd=d; best='pet'+wh; } }
    for(const id in P){ const px=w*(HOME_X0+P[id]*(HOME_X1-HOME_X0)), d=Math.abs(px-x); if(d<bd){ bd=d; best=id; } }
    if(best){ drag=best; c.setPointerCapture(e.pointerId); c.style.cursor='grabbing'; e.preventDefault(); } });
  c.addEventListener('pointermove',e=>{ if(!drag) return; const w=c.width, v=clamp((toX(e)/w-HOME_X0)/(HOME_X1-HOME_X0),0,1); if(drag==='pet1') S.dock.petPos=v; else if(drag==='pet2') S.dock.pet2Pos=v; else S.dock.pos[drag]=v; paintHome(); });
  const end=()=>{ if(drag){ drag=null; c.style.cursor='grab'; save(); } }; c.addEventListener('pointerup',end); c.addEventListener('pointercancel',end); }

// aquarium: drag a decoration along the tank floor
function tankDragSetup(){ const c=$('tankcv'); if(!c||c.dataset.drag) return; c.dataset.drag='1'; c.style.touchAction='pan-y';
  let drag=null; const pt=e=>{ const r=c.getBoundingClientRect(); return {x:(e.clientX-r.left)/r.width, y:(e.clientY-r.top)/r.height}; };
  c.addEventListener('pointerdown',e=>{ const p=pt(e); if(p.y<.45) return; const ds=aqView().decor.filter(id=>id!=='duck'), P=aqPositions(ds); let best=null, bd=.07;
    for(const id in P){ const d=Math.abs(P[id]-p.x); if(d<bd){ bd=d; best=id; } } if(best){ drag=best; c.setPointerCapture(e.pointerId); c.style.cursor='grabbing'; e.preventDefault(); } });
  c.addEventListener('pointermove',e=>{ const p=pt(e); if(!drag){ c.style.cursor=p.y>.45?'grab':'default'; return; } S.aq.pos[drag]=clamp(p.x,.03,.97); });
  const end=()=>{ if(drag){ drag=null; c.style.cursor='grab'; save(); } }; c.addEventListener('pointerup',end); c.addEventListener('pointercancel',end); }
if(/[?&]test\b/.test(location.search)) window.__dockSizes=()=>Object.keys(DOCK_H).map(id=>[id,dockNative(id).h,+dockItemScale(id).toFixed(2)]);

// ---------- dock styles (0.3): the shape of your dock, not just its colour. Used on the water and in Home. ----------
const DOCK_STYLES=[['plank','Classic planks',0],['boardwalk','Boardwalk with rail',4000],['bamboo','Bamboo',6000],['driftwood','Driftwood logs',7500],['stone','Stone jetty',9000],['pontoon','Floating pontoon',12000]];
const dockStyleCur=()=> (DOCK_PV&&DOCK_PV.kind==='style')?DOCK_PV.id:((S.dock&&S.dock.style)||'plank');
// c: context, o: {x0,x1,y (deck top line), th (deck thickness), fh (front beam), bottom, wd (wood colour), N (night tint), rim, t, posts:[x], pw (post width)}
function drawDockStyle0(c,o){ const st=dockStyleCur(), {x0,x1,y,th,fh,bottom,N,t}=o; let wd=o.wd; const W2=x1-x0;
  const top=N(mix(wd,'#ffffff',.1)), face=N(mix(wd,'#000000',.22)), dark=N(mix(wd,'#000000',.45));
  const plankDeck=()=>{ c.fillStyle=top; c.fillRect(x0,y-th,W2,th); c.fillStyle=N(mix(wd,'#000000',.12)); for(let X=x0+W2*.06;X<x1;X+=W2*.12) c.fillRect(X,y-th,1,th); c.fillStyle=face; c.fillRect(x0,y,W2,fh);
    c.fillStyle=N('#2a1a14'); for(let X=x0+W2*.06;X<x1;X+=W2*.25){ c.fillRect(X,y+fh*.25,1.6,1.6); c.fillRect(X,y+fh*.65,1.6,1.6); } };
  const woodPosts=(crooked)=>{ for(const [i,px] of o.posts.entries()){ const lean=crooked?Math.sin(i*2.3)*o.pw*.6:0; c.fillStyle=dark; c.beginPath(); c.moveTo(px,y); c.lineTo(px+o.pw,y); c.lineTo(px+o.pw+lean,bottom); c.lineTo(px+lean,bottom); c.closePath(); c.fill();
    c.fillStyle=N(mix(wd,'#000000',.3)); c.fillRect(px,y,o.pw*.35,bottom-y); c.fillStyle=N('#3f6a4a'); c.fillRect(px,y+(bottom-y)*.55,o.pw,(bottom-y)*.08); } };
  if(st==='stone'){ const s1=N('#8a8e96'), s2=N('#6a6e78'), s3=N('#a8acb4'); c.fillStyle=N('#5a5e68'); c.fillRect(x0,y,W2,bottom-y);
    const bh=Math.max(5,fh*.6); for(let r=0,Y=y;Y<bottom;r++,Y+=bh){ const off=(r%2)*W2*.06; for(let X=x0-off;X<x1;X+=W2*.12){ c.fillStyle=(r+Math.round(X))%3?s1:s2; c.fillRect(Math.max(x0,X)+1,Y+1,Math.min(W2*.12,x1-Math.max(x0,X))-2,bh-2); } }
    const g2=c.createLinearGradient(0,y,0,bottom); g2.addColorStop(0,'rgba(0,0,0,0)'); g2.addColorStop(1,'rgba(4,10,20,.55)'); c.fillStyle=g2; c.fillRect(x0,y,W2,bottom-y); c.fillStyle=N('#4f7a4a'); c.fillRect(x0,y+(bottom-y)*.55,W2,3);
    c.fillStyle=s3; c.fillRect(x0-2,y-th,W2+4,th); c.fillStyle=N('#7a7e88'); for(let X=x0+W2*.1;X<x1;X+=W2*.2) c.fillRect(X,y-th,1,th); }
  else if(st==='bamboo'){ const b1=N('#d2be72'), b2=N('#a89448'), b3=N('#e8d898'); for(const px of o.posts){ c.fillStyle=b2; c.fillRect(px,y,o.pw,bottom-y); c.fillStyle=b3; c.fillRect(px+o.pw*.2,y,o.pw*.2,bottom-y); c.fillStyle=N('#7a6a30'); for(let Y=y+12;Y<bottom;Y+=16) c.fillRect(px-1,Y,o.pw+2,2); }
    c.fillStyle=b1; c.fillRect(x0,y-th,W2,th); c.fillStyle=b2; for(let X=x0;X<x1;X+=Math.max(4,th*.9)) c.fillRect(X,y-th,1,th);
    for(let k=0;k<2;k++){ const Y=y+k*fh*.5; c.fillStyle=k?b2:b1; c.beginPath(); c.roundRect?c.roundRect(x0,Y,W2,fh*.5,fh*.25):c.rect(x0,Y,W2,fh*.5); c.fill(); c.fillStyle=b3; c.fillRect(x0,Y+1,W2,1.2); c.fillStyle=N('#7a6a30'); for(let X=x0+W2*.15;X<x1;X+=W2*.22) c.fillRect(X,Y,2,fh*.5); }
    c.strokeStyle=N('#5a4a2a'); c.lineWidth=1.2; for(const px of o.posts){ c.beginPath(); c.moveTo(px-2,y+fh*.2); c.lineTo(px+o.pw+2,y+fh*.55); c.moveTo(px+o.pw+2,y+fh*.2); c.lineTo(px-2,y+fh*.55); c.stroke(); } }
  else if(st==='pontoon'){ const bob=Math.sin((t||0)*1.4)*1.2; for(const px of o.posts){ const bw=o.pw*3.2, bx=px-bw*.3, by=y+fh+bob; c.fillStyle=N('#3a6a9a'); c.beginPath(); c.roundRect?c.roundRect(bx,by,bw,fh*1.3,fh*.6):c.rect(bx,by,bw,fh*1.3); c.fill(); c.fillStyle=N('#5a8aba'); c.fillRect(bx+bw*.15,by+2,bw*.7,1.5); c.fillStyle=N('#c8d0d8'); c.fillRect(bx+bw*.45,by,1.5,fh*1.3); }
    c.save(); c.translate(0,bob); plankDeck(); c.restore(); c.strokeStyle='rgba(235,245,255,.3)'; c.lineWidth=1; c.beginPath(); c.ellipse((x0+x1)/2,y+fh*2.2+bob,W2*.55,3,0,0,7); c.stroke(); }
  else if(st==='driftwood'){ wd=mix(wd,'#9a8a78',.5); woodPosts(true); const L1=N(mix(wd,'#ffffff',.08)), L2=N(mix(wd,'#000000',.2));
    for(let k=0;k<2;k++){ const Y=y+k*fh*.55-th*.2; c.fillStyle=k?L2:L1; c.beginPath(); c.roundRect?c.roundRect(x0-2,Y,W2+4,fh*.55,fh*.27):c.rect(x0-2,Y,W2+4,fh*.55); c.fill(); c.fillStyle=N(mix(wd,'#000000',.4)); c.beginPath(); c.ellipse(x1+1,Y+fh*.27,fh*.22,fh*.25,0,0,7); c.fill(); c.strokeStyle=N(mix(wd,'#ffffff',.25)); c.lineWidth=.6; c.beginPath(); c.ellipse(x1+1,Y+fh*.27,fh*.1,fh*.12,0,0,7); c.stroke(); }
    c.fillStyle=L1; c.beginPath(); c.moveTo(x0,y-th); for(let X=x0;X<=x1;X+=W2/10) c.lineTo(X,y-th+Math.sin(X*.3)*1.2); c.lineTo(x1,y); c.lineTo(x0,y); c.closePath(); c.fill(); }
  else { woodPosts(false); plankDeck();
    if(st==='boardwalk'){ const rh=Math.max(14,fh*2.4); c.fillStyle=dark; for(const px of o.posts) c.fillRect(px+o.pw*.2,y-th-rh,o.pw*.6,rh); c.strokeStyle=N('#c9a070'); c.lineWidth=1.6; c.beginPath(); for(let i=0;i<o.posts.length-1;i++){ const a=o.posts[i]+o.pw*.5, b2=o.posts[i+1]+o.pw*.5, yy=y-th-rh*.75; c.moveTo(a,yy); c.quadraticCurveTo((a+b2)/2,yy+5,b2,yy); } c.stroke(); } }
  if(o.rim){ c.fillStyle=v3rgba(o.rim,.45); c.fillRect(x0,y-th,W2,1); } c.fillStyle='rgba(0,0,0,.28)'; c.fillRect(x0,y+fh,W2,2);
  // the water comes up to just under the deck: the posts below the waterline sit in the water, tinted by it
  if(false){ const wl=o.wl, g3=c.createLinearGradient(0,wl,0,bottom); g3.addColorStop(0,v3rgba(o.wc,.55)); g3.addColorStop(.35,v3rgba(o.wc,.82)); g3.addColorStop(1,v3rgba(o.wc,.92)); c.fillStyle=g3; c.fillRect(x0-6,wl,W2+12,bottom-wl);
    c.strokeStyle='rgba(235,248,255,.35)'; c.lineWidth=1; const ph=(t||0)*1.6; for(const px of (o.posts||[])){ const cx=px+o.pw*.5; c.beginPath(); c.ellipse(cx,wl+1,o.pw*(1.1+.12*Math.sin(ph+px)),Math.max(1.2,o.pw*.22),0,0,7); c.stroke(); }
    c.fillStyle='rgba(235,248,255,.18)'; c.fillRect(x0-6,wl,W2+12,1); } }
function dockStyleChipsHTML(){ const cur=dockStyleCur(); S.dock.styles=S.dock.styles||['plank'];
  return `<h5>Dock style</h5><div class="chips">${DOCK_STYLES.map(([k,n,p])=>{ const own=S.dock.styles.includes(k)||!p; return `<button class="chipb" data-act="${own?'dockstyle':'dockpv'}" data-k="${own?k:'style:'+k}" aria-pressed="${cur===k}">${n}${own?'':' · '+fmt(p)}</button>`; }).join('')}</div>`; }
// the dock stands in the water: everything above the waterline is solid, the part below shows faintly through the water
function drawDockStyle(c,o){ if(!o.wl||dockStyleCur()==='pontoon') return drawDockStyle0(c,o); const wl=o.wl;
  c.save(); c.beginPath(); c.rect(-1e4,-1e4,3e4,1e4+wl); c.clip(); drawDockStyle0(c,o); c.restore();
  c.save(); c.beginPath(); c.rect(-1e4,wl,3e4,1e4); c.clip(); c.globalAlpha*=.2; drawDockStyle0(c,o); c.restore();
  c.save(); c.strokeStyle='rgba(235,248,255,.38)'; c.lineWidth=1; const ph=(o.t||0)*1.6;
  if(dockStyleCur()==='stone'){ c.fillStyle='rgba(235,248,255,.22)'; c.fillRect(o.x0,wl,o.x1-o.x0,1.2); }
  else for(const px of (o.posts||[])){ const cx=px+o.pw*.5, rx=o.pw*(1.15+.12*Math.sin(ph+px)), ry=Math.max(1.2,o.pw*.22);
    // the near half of the ring passes in front of the post; the far half goes behind it (hidden where the post stands)
    c.beginPath(); c.ellipse(cx,wl+1,rx,ry,0,0,Math.PI); c.stroke();
    c.save(); c.beginPath(); c.rect(cx-rx-4,wl-ry-4,rx-o.pw*.5+4,ry*2+8); c.rect(px+o.pw,wl-ry-4,rx-o.pw*.5+4,ry*2+8); c.clip(); c.beginPath(); c.ellipse(cx,wl+1,rx,ry,0,Math.PI,Math.PI*2); c.stroke(); c.restore(); }
  c.restore(); }
// pets on the dock: each pet can be dragged to its own spot in Home (saved as a 0..1 position along the dock)
const petBig = id => id==='horse'||id==='cow';
function homePetX(wh,w){ const pos=S.dock[wh==='2'?'pet2Pos':'petPos']; if(pos!=null) return w*(HOME_X0+pos*(HOME_X1-HOME_X0));
  const px=w*.58-(petBig(S.pet)?44:31)*2.6; return wh==='2' ? px-(petBig(S.pet)?22:15)*2.6-(petBig(S.pet2)?36:26)*2.6 : px; }
function homePetsDraw(x,w,y,t){ if(S.pet2&&PETI[S.pet2]) drawPetStyled(x,S.pet2,homePetX('2',w),y,2.6*.9*(petBig(S.pet2)?.85:1),t); if(S.pet) drawPetStyled(x,S.pet,homePetX('1',w),y,2.6*(petBig(S.pet)?.85:1),t); }
// the same spots on the water (the dock there runs from W*.008 to W*.178)
function scenePetX(pos){ return W*.008+pos*(W*.17); }
// five evenly spaced support posts under every dock (the water scene and Home always match)
function dockPosts5(x0,x1,pw){ const a=x0+(x1-x0)*.04, b=x1-(x1-x0)*.04-pw; return [0,1,2,3,4].map(i=>a+i*(b-a)/4); }
