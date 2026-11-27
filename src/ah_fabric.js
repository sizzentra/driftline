
// =====================================================================
// 0.3 fabrics: shirt "patterns" become fabrics, how the material looks (denim, knit, corduroy...),
// always in your own colors. Shirts take any fabric; an outfit only offers the fabrics that suit it
// (none at all for costumes, rubber or printed pieces). Shirts can also be two-tone.
// =====================================================================
const FABRICS=[['none','Smooth cotton',0],['linen','Linen',600],['pinstripe','Pinstripe',900],['canvas','Canvas',1000],['denim','Denim',1200],['corduroy','Corduroy',1400],
  ['knit','Knit',1600],['flannel','Flannel',1800],['tweed','Tweed',2000],['quilted','Quilted',2400],['silk','Silk',3000],['velvet','Velvet',3500],['leather','Leather',4000],['sequin','Sequins',6000]];
// which fabrics suit each outfit (outfits not listed have no fabric option)
const OUTFIT_FABRICS={ vest:['linen','canvas','denim','corduroy','tweed','quilted','leather'], hoodie:['knit','flannel','corduroy','velvet'], overalls:['denim','canvas','corduroy','linen'],
  puffer:['quilted','silk','canvas'], captain:['tweed','velvet','pinstripe','linen','leather'], cardigan:['knit','tweed','flannel','velvet'], sweater:['knit','tweed','flannel','velvet'],
  apron:['canvas','linen','denim','leather'], bathrobe:['velvet','silk','flannel','knit'], lumberjack:['tweed','corduroy','canvas'], tracksuit:['velvet','silk'],
  kimono:['silk','linen','velvet'], sailor:['linen','canvas'], suit:['pinstripe','tweed','velvet','linen','silk','sequin'] };
const TONES=[['none','One color'],['yoke','Shoulders'],['sleeves','Sleeves'],['band','Chest band'],['half','Lower half'],['fade','Fade']];
const outfitFabrics = o => OUTFIT_FABRICS[o]||[];
// old shirt designs: flannel and pinstripe are fabrics now, the rest are refunded once
const OLD_PAT_PRICE={stripes:1200,polka:1500,camo:2500,hawaii:3500,fishprint:5000,flames:8000,tux:12000,checker:1400,zigzag:1600,hearts:1700,stars:2000,waves:2200,plaid:2400,fishbones:2800,leopard:3200,tiedye:3800,pixel:4400,sunset:5200,galaxy:7500,sixseven:6700};
PATTERNS.length=0; for(const f of FABRICS) PATTERNS.push(f);
function fabricMigrate(m){ if(!m||m.fabV) return 0; m.fabV=1; let back=0; const o=m.owned||{}; o.pats=(o.pats||[]).filter(id=>{ if(OLD_PAT_PRICE[id]){ back+=OLD_PAT_PRICE[id]; return false; } return true; });
  if(!o.pats.includes('none')) o.pats.unshift('none'); const lk=m.look||{};
  if(OLD_PAT_PRICE[lk.pat]) lk.pat='none';
  if(lk.patOn==='outfit'){ if(lk.pat!=='none' && outfitFabrics(lk.outfit).includes(lk.pat)) lk.outFab=lk.pat; lk.pat='none'; } delete lk.patOn;
  if(back){ m.money=(m.money||0)+back; m.fabRefund=back; } return back; }
/* every load runs fabricMigrate: a step of migrate() in c_logic.js */
if(typeof S!=='undefined' && S) fabricMigrate(S);

// ---------- drawing: alpha overlays only, so a fabric works on any color and on both halves of a two-tone shirt
function fabricRng(s){ return ()=>{ s=(s*16807)%2147483647; return s/2147483647; }; }
function drawFabric(c,id,base,x,y,w,h){ const D=a=>'rgba(0,0,0,'+a+')', L=a=>'rgba(255,255,255,'+a+')', R=fabricRng(7+Math.round(x*3+y));
  switch(id){
    case 'linen': c.fillStyle=L(.07); for(let yy=y;yy<y+h;yy+=.9) c.fillRect(x,yy,w,.35); c.fillStyle=D(.06); for(let xx=x;xx<x+w;xx+=.9) c.fillRect(xx,y,.3,h); break;
    case 'canvas': c.fillStyle=D(.1); for(let yy=y,r=0;yy<y+h;yy+=1.2,r++) for(let xx=x+(r%2)*.6;xx<x+w;xx+=1.2) c.fillRect(xx,yy,.6,.6); c.fillStyle=L(.05); c.fillRect(x,y,w,h); break;
    case 'denim': c.strokeStyle=D(.16); c.lineWidth=.35; for(let k=-h;k<w;k+=1.05){ c.beginPath(); c.moveTo(x+k,y+h); c.lineTo(x+k+h,y); c.stroke(); } c.fillStyle=L(.05); for(let i=0;i<60;i++) c.fillRect(x+R()*w,y+R()*h,.4,.4);
      c.strokeStyle='rgba(230,170,80,.7)'; c.lineWidth=.3; c.setLineDash([.7,.5]); c.beginPath(); c.moveTo(x,y+h-1.4); c.lineTo(x+w,y+h-1.4); c.stroke(); c.setLineDash([]); break;
    case 'corduroy': for(let xx=x;xx<x+w;xx+=1.1){ c.fillStyle=L(.12); c.fillRect(xx,y,.45,h); c.fillStyle=D(.14); c.fillRect(xx+.55,y,.35,h); } break;
    case 'knit': c.strokeStyle=D(.18); c.lineWidth=.32; for(let xx=x+.6;xx<x+w;xx+=1.8) for(let yy=y+.6;yy<y+h;yy+=1.2){ c.beginPath(); c.moveTo(xx-.6,yy-.4); c.lineTo(xx,yy+.3); c.lineTo(xx+.6,yy-.4); c.stroke(); }
      c.fillStyle=L(.06); for(let xx=x;xx<x+w;xx+=3.6) c.fillRect(xx,y,.5,h); break;
    case 'flannel': c.fillStyle=D(.2); for(let xx=x;xx<x+w;xx+=5) c.fillRect(xx,y,2.2,h); for(let yy=y;yy<y+h;yy+=5) c.fillRect(x,yy,w,2.2); c.fillStyle=L(.14); for(let xx=x+3.3;xx<x+w;xx+=5) c.fillRect(xx,y,.4,h); for(let yy=y+3.3;yy<y+h;yy+=5) c.fillRect(x,yy,w,.4); break;
    case 'pinstripe': c.fillStyle=L(.4); for(let xx=x+1;xx<x+w;xx+=2.4) c.fillRect(xx,y,.22,h); break;
    case 'tweed': for(let i=0;i<380;i++){ const v=R(); c.fillStyle=v<.45?D(.24):v<.9?L(.2):(R()<.5?'rgba(200,120,60,.35)':'rgba(90,140,200,.3)'); c.fillRect(x+R()*w,y+R()*h,.5+R()*.4,.3); } break;
    case 'quilted': c.strokeStyle=L(.28); c.lineWidth=.3; c.setLineDash([.6,.4]); for(let k=-h;k<w+h;k+=3.2){ c.beginPath(); c.moveTo(x+k,y); c.lineTo(x+k+h,y+h); c.stroke(); c.beginPath(); c.moveTo(x+k,y+h); c.lineTo(x+k+h,y); c.stroke(); } c.setLineDash([]);
      for(let k=0;k<w;k+=3.2) for(let j=0;j<h;j+=3.2){ c.fillStyle=L(.06); c.beginPath(); c.arc(x+k+1.6,y+j+1.2,.9,0,7); c.fill(); } break;
    case 'silk': { const g=c.createLinearGradient(x,y,x+w,y+h); g.addColorStop(0,L(0)); g.addColorStop(.38,L(.28)); g.addColorStop(.5,L(.06)); g.addColorStop(.7,L(.2)); g.addColorStop(1,D(.12)); c.fillStyle=g; c.fillRect(x,y,w,h); } break;
    case 'velvet': { const g=c.createLinearGradient(x,0,x+w,0); g.addColorStop(0,D(.32)); g.addColorStop(.45,L(.1)); g.addColorStop(.6,D(.04)); g.addColorStop(1,D(.34)); c.fillStyle=g; c.fillRect(x,y,w,h); c.fillStyle=D(.1); c.fillRect(x,y,w,h); } break;
    case 'leather': { c.fillStyle=D(.12); c.fillRect(x,y,w,h); const g=c.createLinearGradient(x,y,x+w*.7,y+h*.6); g.addColorStop(0,L(0)); g.addColorStop(.5,L(.22)); g.addColorStop(1,L(0)); c.fillStyle=g; c.fillRect(x,y,w,h);
      c.strokeStyle=D(.3); c.lineWidth=.3; c.beginPath(); c.moveTo(x+w*.5,y); c.lineTo(x+w*.5,y+h); c.stroke(); c.strokeStyle=L(.25); c.setLineDash([.5,.5]); c.beginPath(); c.moveTo(x+w*.5+.6,y); c.lineTo(x+w*.5+.6,y+h); c.stroke(); c.setLineDash([]); } break;
    case 'sequin': for(let yy=y+.5,r=0;yy<y+h;yy+=1.1,r++) for(let xx=x+(r%2)*.55;xx<x+w;xx+=1.1){ const v=R(); c.fillStyle=v>.85?L(.9):v>.5?L(.3):D(.12); c.beginPath(); c.arc(xx,yy,.42,0,7); c.fill(); } break;
  } }
// every place that drew a pattern now draws a fabric
function drawPattern(c,pat,base,x,y,w,h){ drawFabric(c,pat,base,x,y,w,h); };
if(typeof drawPatternX==='function') drawPatternX = function(c,pat,base,x,y,w,h){ drawFabric(c,pat,base,x,y,w,h); };
// two-tone: the second color on part of the shirt (drawn before the fabric, inside the torso clip)
function drawTwoTone(c,lk,D,x,y,w,h){ const t=lk.tone; if(!t||t==='none'||t==='sleeves'||!lk.shirt2) return; c.fillStyle=D(lk.shirt2);
  if(t==='yoke'){ c.beginPath(); c.moveTo(x,y); c.lineTo(x+w,y); c.lineTo(x+w,y+h*.3); c.quadraticCurveTo(x+w/2,y+h*.38,x,y+h*.3); c.closePath(); c.fill(); }
  else if(t==='band') c.fillRect(x,y+h*.36,w,h*.16);
  else if(t==='half') c.fillRect(x,y+h*.52,w,h*.5);
  else if(t==='fade'){ const col=D(lk.shirt2), g=c.createLinearGradient(0,y+h*.2,0,y+h*.95); g.addColorStop(0,fabRGBA(col,0)); g.addColorStop(1,fabRGBA(col,1)); c.fillStyle=g; c.fillRect(x,y,w,h); } }
function fabRGBA(col,a){ col=String(col).trim(); let r=0,g=0,b=0; if(col[0]==='#'){ let h=col.slice(1); if(h.length===3) h=h.split('').map(x=>x+x).join(''); r=parseInt(h.slice(0,2),16); g=parseInt(h.slice(2,4),16); b=parseInt(h.slice(4,6),16); }
  else { const m=col.match(/[\d.]+/g)||[0,0,0]; [r,g,b]=m.map(Number); } return 'rgba('+r+','+g+','+b+','+a+')'; }
// an outfit's fabric: the outfit is drawn on a small layer around the angler and the fabric only lands on its pixels,
// so vests, aprons and open coats are textured exactly where the garment is
const A3FAB={c:null};
function a3FabricOutfit(c,lk,D,f,t){ const m=c.getTransform(), P=[[-18,-68],[18,-68],[-18,10],[18,10]].map(([x,y])=>[m.a*x+m.c*y+m.e, m.b*x+m.d*y+m.f]);
  const x0=Math.floor(Math.min(...P.map(p=>p[0]))), y0=Math.floor(Math.min(...P.map(p=>p[1]))), w=Math.ceil(Math.max(...P.map(p=>p[0])))-x0, h=Math.ceil(Math.max(...P.map(p=>p[1])))-y0;
  if(!(w>0&&h>0&&w<3000&&h<3000)){ drawOutfit3(c,lk,D,f,t); return; }
  let L=A3FAB.c; if(!L){ L=A3FAB.c=document.createElement('canvas'); } if(L.width<w||L.height<h){ L.width=Math.max(L.width,w); L.height=Math.max(L.height,h); }
  const ox=L.getContext('2d'); ox.setTransform(1,0,0,1,0,0); ox.clearRect(0,0,w,h); ox.setTransform(m.a,m.b,m.c,m.d,m.e-x0,m.f-y0); ox.globalAlpha=1;
  drawOutfit3(ox,lk,D,f,t); ox.save(); ox.globalCompositeOperation='source-atop'; drawFabric(ox,lk.outFab,null,-18,-68,36,78); ox.restore();
  c.save(); c.setTransform(1,0,0,1,0,0); c.drawImage(L,0,0,w,h,x0,y0,w,h); c.restore(); }
// Wardrobe: the outfit's fabric choice, only for outfits that suit fabrics, and only fabrics that suit that outfit
function wOutfitFabricHTML(lk){ const o=lk.outfit||'none', ok=outfitFabrics(o); if(!ok.length) return '';
  const name=(OUTFITS.find(x=>x[0]===o)||[0,'outfit'])[1], mine=ok.filter(id=>S.owned.pats.includes(id)), names=id=>(FABRICS.find(f=>f[0]===id)||[0,id])[1];
  const chips=wChips('outFab',[['none','Plain'],...mine.map(id=>[id,names(id)])],(lk.outFab&&ok.includes(lk.outFab))?lk.outFab:'none');
  const missing=ok.filter(id=>!mine.includes(id)).map(names);
  return `<h5>${esc(name)} fabric</h5>${chips}${missing.length?`<p class="meta" style="margin:4px 0 0">Also suits it: ${esc(missing.join(', '))} (in the clothing shop).</p>`:''}`; }
// fabric on a sleeve segment, running along the arm
function a3LimbFab(c,p0,p1,w0,w1,fab){ const dx=p1.x-p0.x, dy=p1.y-p0.y, L=Math.hypot(dx,dy)||1, nx=-dy/L, ny=dx/L, w=Math.max(w0,w1);
  c.save(); c.beginPath(); c.moveTo(p0.x+nx*w0/2,p0.y+ny*w0/2); c.lineTo(p1.x+nx*w1/2,p1.y+ny*w1/2); c.lineTo(p1.x-nx*w1/2,p1.y-ny*w1/2); c.lineTo(p0.x-nx*w0/2,p0.y-ny*w0/2); c.closePath();
  c.moveTo(p0.x+w0/2,p0.y); c.arc(p0.x,p0.y,w0/2,0,7); c.moveTo(p1.x+w1/2,p1.y); c.arc(p1.x,p1.y,w1/2,0,7); c.clip('nonzero');
  c.translate(p0.x,p0.y); c.rotate(Math.atan2(dy,dx)-Math.PI/2); drawFabric(c,fab,null,-w/2-1,-w/2,w+2,L+w); c.restore(); }
// outfits with a printed or woven design carry it down their sleeves too
const SLEEVE_DESIGN={ lumberjack:'sd_buffalo', pajamas:'sd_pjstripe', fishsuit:'sd_scales', aloha:'sd_flowers', kimono:'sd_kimono', bathrobe:'sd_dots', clownsuit:'sd_clown', denim:'denim', sweater:'knit', tracksuit:'sd_track' };
function a3SleeveLayers(lk,D){ const own=a3Sleeve(lk,D,null)===null, out=[];
  if(own){ if(lk.pat&&lk.pat!=='none') out.push(lk.pat); return out; }
  const d=SLEEVE_DESIGN[lk.outfit]; if(d) out.push(d);
  if(lk.outFab&&lk.outFab!=='none'&&outfitFabrics(lk.outfit).includes(lk.outFab)) out.push(lk.outFab); return out; }
const SLEEVE_DRAW={
  sd_buffalo(c,x,y,w,h){ c.fillStyle='rgba(10,8,8,.55)'; for(let yy=y;yy<y+h;yy+=4.4) c.fillRect(x,yy,w,2.2); c.fillStyle='rgba(10,8,8,.4)'; c.fillRect(x+w*.5-1.1,y,2.2,h); },
  sd_pjstripe(c,x,y,w,h){ c.fillStyle='rgba(255,255,255,.75)'; for(let xx=x+.8;xx<x+w;xx+=2.3) c.fillRect(xx,y,.9,h); },
  sd_scales(c,x,y,w,h){ c.strokeStyle='rgba(255,255,255,.4)'; c.lineWidth=.35; for(let yy=y+1,r=0;yy<y+h;yy+=1.6,r++) for(let xx=x+(r%2)*1.2;xx<x+w+1;xx+=2.4){ c.beginPath(); c.arc(xx,yy,1.2,0,Math.PI); c.stroke(); } },
  sd_flowers(c,x,y,w,h){ for(let i=0,yy=y+2;yy<y+h;yy+=4.2,i++){ const xx=x+w*(i%2?.3:.7); c.fillStyle=i%2?'#ff8ab8':'#ffffff'; for(let k=0;k<5;k++){ const a=k*1.2566; c.beginPath(); c.arc(xx+Math.cos(a)*.55,yy+Math.sin(a)*.55,.45,0,7); c.fill(); } c.fillStyle='#ffd84a'; c.beginPath(); c.arc(xx,yy,.3,0,7); c.fill(); } },
  sd_kimono(c,x,y,w,h){ for(let i=0,yy=y+2.5;yy<y+h;yy+=4.6,i++){ c.fillStyle='rgba(255,220,230,.55)'; c.beginPath(); c.arc(x+w*(i%2?.32:.68),yy,.9,0,7); c.fill(); } },
  sd_dots(c,x,y,w,h){ c.fillStyle='rgba(255,255,255,.35)'; for(let i=0,yy=y+2;yy<y+h;yy+=3.4,i++){ c.beginPath(); c.arc(x+w*(i%2?.3:.7),yy,.45,0,7); c.fill(); } },
  sd_clown(c,x,y,w,h){ const cl=['#ffd84a','#3ab8ff','#ffffff','#7ad84a']; for(let i=0,yy=y+1.6;yy<y+h;yy+=2.8,i++){ c.fillStyle=cl[i%4]; c.beginPath(); c.arc(x+w*(i%2?.3:.7),yy,.75,0,7); c.fill(); } },
  sd_track(c,x,y,w,h){ c.fillStyle='rgba(255,255,255,.85)'; c.fillRect(x+w-1.9,y,.55,h); c.fillRect(x+w-1.1,y,.55,h); },
};
const _drawFabric_0 = drawFabric;
drawFabric = function(c,id,base,x,y,w,h){ const f=SLEEVE_DRAW[id]; if(f) return f(c,x,y,w,h); return _drawFabric_0(c,id,base,x,y,w,h); };
// one message for players whose old shirt designs were refunded
setTimeout(()=>{ try{ if(S&&S.fabRefund){ toast('Shirt designs became fabrics. You got '+fmt(S.fabRefund)+' coins back for the designs you owned.'); delete S.fabRefund; save(); } }catch(e){} },2500);
