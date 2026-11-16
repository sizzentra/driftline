
// =====================================================================
// 0.3 Wardrobe, reorganised: your angler stays in view on the left, and everything else lives in
// sections (Body, Clothes, Hats, Glasses, Shoes, Neck & back, Shop). The Shop has a tab per category
// with the whole catalogue, plus a Featured shelf that rotates. More glasses, outfits and colours too.
// =====================================================================
GLASSES.push(['aviator','Aviators',1800],['cateye','Cat-eye frames',2200],['starshades','Star shades',2600],['visor','Sport visor',1400],['reading','Half-moon readers',900],['wrap','Wraparound shades',2000],['tinted','Rose-tinted rounds',1600],['shutter','Shutter shades',3100]);
OUTFITS.push(['tracksuit','Tracksuit',2600,'shop'],['kimono','Kimono',5200,'shop'],['denim','Denim jacket',3400,'shop'],['sailor','Sailor suit',3800,'shop'],['aloha','Open aloha shirt',2200,'shop'],['suit','Sharp suit',8500,'shop']);
SHOP_COLS.push(['#ff6a4a','Coral',600],['#ffd0e0','Blush Pink',700],['#c8e86a','Lime',600],['#5a7a3a','Olive',500],['#3a4a8a','Navy',600],['#a8d8ff','Ice Blue',700],['#e8c8a0','Sand',500],['#6a3a2a','Chocolate',600],['#b8a0e8','Lavender',800],['#2ad8c8','Turquoise',900],['#f2a03a','Amber',700],['#e8e8f0','Silver Grey',800]);
const _drawFace_0 = drawFace;
drawFace = function(c,lk,D,hair){ const gl=lk.glasses||'none', ex=4.4, ey=-57, arm=(col)=>{ c.strokeStyle=col; c.lineWidth=.6; c.beginPath(); c.moveTo(ex-2.1,ey-.2); c.lineTo(-1,ey-.6); c.stroke(); };
  const NEW=['aviator','cateye','starshades','visor','reading','wrap','tinted','shutter']; if(!NEW.includes(gl)) return _drawFace_0(c,lk,D,hair);
  _drawFace_0(c,Object.assign({},lk,{glasses:'none'}),D,hair); c.save();
  switch(gl){
    case 'aviator': { const gr=c.createLinearGradient(0,ey-2,0,ey+2.4); gr.addColorStop(0,'rgba(60,40,20,.9)'); gr.addColorStop(1,'rgba(200,140,60,.75)'); c.fillStyle=gr; c.beginPath(); c.moveTo(ex-2.2,ey-1.4); c.lineTo(ex+2.4,ey-1.4); c.quadraticCurveTo(ex+2.4,ey+2.4,ex+.2,ey+2.2); c.quadraticCurveTo(ex-2.2,ey+2,ex-2.2,ey-1.4); c.fill(); c.strokeStyle=D('#c8a050'); c.lineWidth=.45; c.stroke(); arm(D('#c8a050')); break; }
    case 'cateye': c.fillStyle='rgba(20,10,30,.15)'; c.strokeStyle=D('#c8304a'); c.lineWidth=.9; c.beginPath(); c.moveTo(ex-2.2,ey+.2); c.quadraticCurveTo(ex-1.8,ey-1.6,ex+.4,ey-1.4); c.lineTo(ex+2.8,ey-2.4); c.quadraticCurveTo(ex+2.6,ey+1.8,ex,ey+1.6); c.quadraticCurveTo(ex-2.2,ey+1.6,ex-2.2,ey+.2); c.fill(); c.stroke(); arm(D('#c8304a')); break;
    case 'starshades': c.fillStyle=D('#ffd23a'); c.beginPath(); for(let i=0;i<10;i++){ const a=-Math.PI/2+i*Math.PI/5, r=i%2?1.1:2.6; c.lineTo(ex+.2+Math.cos(a)*r,ey+Math.sin(a)*r); } c.closePath(); c.fill(); c.fillStyle='rgba(40,20,0,.55)'; c.beginPath(); c.arc(ex+.2,ey+.1,.9,0,7); c.fill(); arm(D('#ffd23a')); break;
    case 'visor': c.fillStyle='rgba(90,200,255,.55)'; c.beginPath(); c.moveTo(-2,ey-1.6); c.lineTo(ex+3,ey-1.6); c.quadraticCurveTo(ex+3.6,ey+.6,ex+2.4,ey+1.4); c.lineTo(-2,ey+1.2); c.closePath(); c.fill(); c.strokeStyle=D('#f4f4f2'); c.lineWidth=.5; c.stroke(); c.fillStyle='rgba(255,255,255,.6)'; c.fillRect(ex-1,ey-1.2,2.4,.5); break;
    case 'reading': c.strokeStyle=D('#8a6a3a'); c.lineWidth=.6; c.beginPath(); c.moveTo(ex-2,ey+.4); c.lineTo(ex+2.2,ey+.4); c.arc(ex+.1,ey+.4,2.1,0,Math.PI); c.stroke(); arm(D('#8a6a3a')); c.strokeStyle='rgba(200,180,140,.6)'; c.beginPath(); c.moveTo(-1,ey); c.quadraticCurveTo(-2,ey+5,-1,ey+8); c.stroke(); break;
    case 'wrap': { const gr=c.createLinearGradient(ex-3,0,ex+3,0); gr.addColorStop(0,'#1a1a2a'); gr.addColorStop(.6,'#3a6ae8'); gr.addColorStop(1,'#ff5aa8'); c.fillStyle=gr; c.beginPath(); c.moveTo(-1.6,ey-1.2); c.quadraticCurveTo(ex,ey-2.2,ex+3,ey-1); c.quadraticCurveTo(ex+3.2,ey+1.2,ex+1.6,ey+1.6); c.quadraticCurveTo(ex-1,ey+1.4,-1.6,ey+.6); c.closePath(); c.fill(); break; }
    case 'tinted': c.fillStyle='rgba(255,110,150,.45)'; c.strokeStyle=D('#d8b048'); c.lineWidth=.55; c.beginPath(); c.arc(ex,ey,2,0,7); c.fill(); c.stroke(); arm(D('#d8b048')); break;
    case 'shutter': c.fillStyle=D('#f4f4f2'); c.fillRect(ex-2.4,ey-1.6,4.8,3.2); c.fillStyle=D('#1a1a1a'); for(let i=0;i<4;i++) c.fillRect(ex-2.4,ey-1.2+i*.8,4.8,.38); arm(D('#f4f4f2')); break;
  } c.restore(); };
Object.assign(MEME_OUT,{
  tracksuit(c,lk,D,f){ const col=D(lk.outCol&&lk.outCol!=='#d8a020'?lk.outCol:'#2a5ad8'), st=D('#f4f4f2'); c.save(); a3TorsoPath(c,f); c.clip(); c.fillStyle=col; c.fillRect(-11,-50,22,30); c.fillStyle=st; c.fillRect(-10,-50,1.4,30); c.fillRect(8.6,-50,1.4,30); c.fillStyle=D(mix(lk.outCol||'#2a5ad8','#000000',.3)); c.fillRect(.2,-46,.8,22); c.restore(); c.fillStyle=col; c.beginPath(); c.ellipse(.6,-46.6,6,1.8,0,0,7); c.fill(); },
  kimono(c,lk,D,f){ const col=D(lk.outCol&&lk.outCol!=='#d8a020'?lk.outCol:'#c8304a'), dk=D(mix(lk.outCol||'#c8304a','#000000',.3)); c.fillStyle=col; a3CoatPath(c,f,-13); c.fill(); c.save(); a3CoatPath(c,f,-13); c.clip(); c.fillStyle='rgba(255,240,220,.25)'; for(let i=0;i<10;i++){ const x=-9+((i*7)%18), y=-44+((i*11)%28); c.beginPath(); c.arc(x,y,1.1,0,7); c.arc(x+1.4,y+.4,.8,0,7); c.fill(); } c.restore();
    c.fillStyle=D('#f4ecd8'); c.beginPath(); c.moveTo(-5,-47); c.lineTo(2,-33); c.lineTo(3.6,-33); c.lineTo(-3,-47.4); c.closePath(); c.fill(); c.fillStyle=dk; c.fillRect(-9.6,-30,19.4,3.4); c.fillStyle=D('#ffd23a'); c.fillRect(-9.6,-29,19.4,.8); },
  denim(c,lk,D,f){ const col=D(lk.outCol&&lk.outCol!=='#d8a020'?lk.outCol:'#4a6a9a'), dk=D(mix(lk.outCol||'#4a6a9a','#000000',.28)); c.save(); a3TorsoPath(c,f); c.clip(); c.fillStyle=col; c.beginPath(); c.moveTo(-11,-50); c.lineTo(-1.6,-50); c.lineTo(-1,-22); c.lineTo(-11,-22); c.closePath(); c.moveTo(11,-50); c.lineTo(3,-50); c.lineTo(2.4,-22); c.lineTo(11,-22); c.closePath(); c.fill();
    c.strokeStyle=D('#e8b060'); c.lineWidth=.3; c.setLineDash([.6,.5]); c.beginPath(); c.moveTo(-8,-40); c.lineTo(-2,-40); c.moveTo(3,-40); c.lineTo(9,-40); c.moveTo(-1.4,-48); c.lineTo(-1,-24); c.stroke(); c.setLineDash([]); c.fillStyle=dk; c.fillRect(-10,-25,20,2.6); c.restore(); c.fillStyle=dk; c.beginPath(); c.moveTo(-6,-47.4); c.lineTo(-1.6,-42); c.lineTo(-1.4,-47.8); c.closePath(); c.moveTo(6.4,-47.4); c.lineTo(2.8,-42); c.lineTo(2.6,-47.8); c.closePath(); c.fill(); },
  sailor(c,lk,D,f){ const w=D('#f4f4f2'), n=D('#1a2a5a'); c.save(); a3TorsoPath(c,f); c.clip(); c.fillStyle=w; c.fillRect(-11,-50,22,30); c.restore(); c.fillStyle=n; c.beginPath(); c.moveTo(-7.6,-46.8); c.lineTo(.4,-38); c.lineTo(8,-46.8); c.lineTo(8,-48.6); c.lineTo(-7.6,-48.6); c.closePath(); c.fill(); c.strokeStyle=w; c.lineWidth=.4; c.beginPath(); c.moveTo(-6,-47); c.lineTo(.4,-40); c.lineTo(6.6,-47); c.stroke(); c.fillStyle=D('#d8302a'); c.beginPath(); c.moveTo(.4,-38.6); c.lineTo(-1.2,-35); c.lineTo(.4,-36); c.lineTo(2,-35); c.closePath(); c.fill(); },
  aloha(c,lk,D,f){ const col=D(lk.outCol&&lk.outCol!=='#d8a020'?lk.outCol:'#2ab8a8'); c.save(); a3TorsoPath(c,f); c.clip(); c.fillStyle=col; c.beginPath(); c.moveTo(-11,-50); c.lineTo(-1,-50); c.lineTo(.2,-22); c.lineTo(-11,-22); c.closePath(); c.moveTo(11,-50); c.lineTo(3,-50); c.lineTo(1.8,-22); c.lineTo(11,-22); c.closePath(); c.fill();
    const fl=['#ff7a9a','#ffd23a','#ffffff']; for(let i=0;i<14;i++){ const x=-10+((i*9)%20), y=-48+((i*7)%26); if(x>-1&&x<3) continue; c.fillStyle=D(fl[i%3]); for(let p=0;p<5;p++){ const a=p*1.26; c.beginPath(); c.arc(x+Math.cos(a)*.8,y+Math.sin(a)*.8,.6,0,7); c.fill(); } } c.restore(); },
  suit(c,lk,D,f){ const col=D(lk.outCol&&lk.outCol!=='#d8a020'?lk.outCol:'#2a2a34'), dk=D(mix(lk.outCol||'#2a2a34','#000000',.3)); c.fillStyle=D('#f4f4f2'); c.save(); a3TorsoPath(c,f); c.clip(); c.fillRect(-11,-50,22,30); c.restore(); c.fillStyle=col; a3CoatPath(c,f,-20); c.fill();
    c.fillStyle=D('#f4f4f2'); c.beginPath(); c.moveTo(-3.6,-47); c.lineTo(.6,-34); c.lineTo(4.6,-47); c.closePath(); c.fill(); c.fillStyle=D('#c8302a'); c.beginPath(); c.moveTo(.2,-45.4); c.lineTo(1.2,-45.4); c.lineTo(1.4,-36); c.lineTo(.6,-34.8); c.lineTo(-.1,-36); c.closePath(); c.fill(); c.fillStyle=dk; c.beginPath(); c.moveTo(-4.2,-47); c.lineTo(-1.6,-39); c.lineTo(-3.2,-38); c.lineTo(-5.4,-46); c.closePath(); c.moveTo(5.2,-47); c.lineTo(2.8,-39); c.lineTo(4.4,-38); c.lineTo(6.4,-46); c.closePath(); c.fill();
    c.fillStyle=D('#c8c8d0'); c.beginPath(); c.arc(.8,-28,.5,0,7); c.arc(.8,-24.5,.5,0,7); c.fill(); } });
const _a3Sleeve_1 = a3Sleeve;
a3Sleeve = function(lk,D,shirt){ const oc=lk.outCol&&lk.outCol!=='#d8a020'?lk.outCol:null; const m={tracksuit:oc||'#2a5ad8',kimono:oc||'#c8304a',denim:oc||'#4a6a9a',sailor:'#f4f4f2',aloha:oc||'#2ab8a8',suit:oc||'#2a2a34'}; if(m[lk.outfit]) return D(m[lk.outfit]); return _a3Sleeve_1(lk,D,shirt); };

// ---------- the Wardrobe screen ----------
let wSec='body', wShop='featured';
const W_CATS=[['featured','Featured'],['hat','Hats'],['gls','Glasses'],['out','Outfits'],['pat','Patterns'],['col','Colours'],['shoe','Shoes'],['neck','Neckwear'],['back','Back']];
function wCatalog(kind){ switch(kind){
  case 'hat': return HATS.filter(x=>x.src==='shop').map(x=>({kind,id:x.id,name:x.name,price:x.price}));
  case 'gls': return GLASSES.filter(x=>x[2]).map(x=>({kind,id:x[0],name:x[1],price:x[2]}));
  case 'out': return OUTFITS.filter(x=>x[3]==='shop').map(x=>({kind,id:x[0],name:x[1],price:x[2]}));
  case 'pat': return PATTERNS.filter(x=>x[2]).map(x=>({kind,id:x[0],name:x[1]+' shirt',price:x[2]}));
  case 'col': return SHOP_COLS.map(x=>({kind,id:x[0],name:x[1],price:x[2]}));
  case 'shoe': return SHOES.filter(x=>x[3]==='shop').map(x=>({kind,id:x[0],name:x[1],price:x[2]}));
  case 'neck': return NECKS.filter(x=>x[3]==='shop').map(x=>({kind,id:x[0],name:x[1],price:x[2]}));
  case 'back': return BACKS.filter(x=>x[3]==='shop').map(x=>({kind,id:x[0],name:x[1],price:x[2]})); }
  return []; }
const W_KIND_NAME={hat:'Hat',gls:'Glasses',out:'Outfit',pat:'Shirt pattern',col:'Colour for shirts, trousers and hats',shoe:'Shoes',neck:'Neckwear',back:'Worn on your back'};
function wThumb(cx,kind,id,w,h){ cx.clearRect(0,0,w,h); const lk=S.look;
  if(kind==='col'){ const s=h/64; cx.save(); cx.translate(w/2,h*.2); cx.scale(s*1.6,s*1.6); cx.fillStyle=id; cx.beginPath(); cx.moveTo(-11,0); cx.lineTo(-5,-3); cx.lineTo(5,-3); cx.lineTo(11,0); cx.lineTo(14,8); cx.lineTo(9,10); cx.lineTo(8,26); cx.lineTo(-8,26); cx.lineTo(-9,10); cx.lineTo(-14,8); cx.closePath(); cx.fill(); cx.fillStyle='rgba(255,255,255,.18)'; cx.fillRect(-8,0,4,26); cx.restore(); }
  else if(kind==='pat'){ cx.save(); cx.translate(w/2,h*.16); cx.scale(h/32,h/32); cx.fillStyle=lk.shirt; cx.beginPath(); cx.moveTo(-9,0); cx.lineTo(9,0); cx.lineTo(8,24); cx.lineTo(-8,24); cx.closePath(); cx.fill(); cx.clip(); drawPattern(cx,id,lk.shirt,-10,-1,20,26); cx.restore(); }
  else if(kind==='out') drawAngler(cx,w/2,h*.97,h/80,Object.assign({},lk,{outfit:id,hat:'none'}),{});
  else if(kind==='gls'){ const s=h/22; drawAngler(cx,w*.4,h*.5+56*s,s,Object.assign({},lk,{glasses:id,hat:'none'}),{}); }
  else if(kind==='hat') hatPreview(cx,w,h,id,lk.hatCol);
  else wearPreview(cx,kind,id,w,h); }
function wOwned(kind,id){ const o=S.owned; return kind==='col'?o.cols.includes(id):kind==='pat'?o.pats.includes(id):kind==='out'?o.outfits.includes(id):kind==='gls'?o.glasses.includes(id):kind==='hat'?o.hats.includes(id):kind==='shoe'?o.shoes.includes(id):kind==='neck'?o.necks.includes(id):o.backs.includes(id); }
function wItemCard(it,feat){ const own=wOwned(it.kind,it.id), trying=PREVIEW&&PREVIEW.kind===it.kind&&PREVIEW.id===it.id;
  return `<div class="wd-item ${own?'own':''} ${feat?'feat':''}"><canvas width="120" height="120" data-wthumb="${it.kind}:${it.id}"></canvas><div class="wd-it"><b>${esc(it.name)}</b><span class="meta">${W_KIND_NAME[it.kind]}</span></div>
    <div class="wd-ia">${own?'<span class="badge g">Owned</span>':`<button class="btn alt sm" data-act="wtry" data-k="${it.kind}:${it.id}">${trying?'Wearing it':'Try on'}</button><button class="btn sm" data-act="wbuy" data-k="${it.kind}:${it.id}" ${S.money>=it.price?'':'disabled'}><span class="coin">${fmtShort(it.price)}</span></button>`}</div></div>`; }
function wChips(k,list,cur,label){ return `<div class="chips">${list.map(([v,n])=>`<button class="chipb" data-act="look" data-k="${k}" data-v="${v}" aria-pressed="${String(cur)===String(v)}">${esc(n)}</button>`).join('')}</div>`; }
function wSw(k,list,cur){ return `<div class="chips">${list.map(([v,cl,n])=>`<button class="sw" data-act="look" data-k="${k}" data-v="${v}" aria-pressed="${String(cur)===String(v)}" style="background:${cl}" title="${esc(n||cl)}"></button>`).join('')}</div>`; }
function wThumbGrid(k,kind,items,cur){ return `<div class="wd-thumbs">${items.map(([id,n])=>`<button class="wd-th" data-act="look" data-k="${k}" data-v="${id}" aria-pressed="${cur===id}"><canvas width="96" height="96" data-wthumb="${kind}:${id}"></canvas><span>${esc(n)}</span></button>`).join('')}</div>`; }
renderStyle = function(P){ const lk=S.look, cols=[...FREE_COLS,...S.owned.cols].map(c=>[c,c]);
  const secs=[['body','Body'],['clothes','Clothes'],['hats','Hats'],['glasses','Glasses'],['shoes','Shoes'],['neckback','Neck & back'],['shop','Shop']];
  let body='';
  if(wSec==='body') body=`<h5>Body</h5>${wChips('g',[['m','Man'],['f','Woman']],lk.g)}<h5>Build</h5>${wChips('build',BUILDS.map(b=>[b[0],b[1]]),lk.build||'average')}
    <h5>Skin</h5>${wSw('skin',SKINS.map((c,i)=>[i,c]),lk.skin)}<h5>Eyes</h5>${wSw('eye',EYES.map((e,i)=>[i,e[0],e[1]]),lk.eye|0)}<h5>Hair colour</h5>${wSw('hair',HAIRS.map((c,i)=>[i,c]),lk.hair)}
    <h5>Hairstyle</h5>${wChips('hairStyle',HAIRSTYLES,lk.hairStyle||'auto')}<h5>Facial hair</h5>${wChips('beard',BEARDS,lk.beard||'none')}`;
  if(wSec==='clothes') body=`<h5>Shirt colour</h5>${wSw('shirt',cols,lk.shirt)}<h5>Shirt pattern</h5>${wChips('pat',PATTERNS.filter(p=>S.owned.pats.includes(p[0])).map(p=>[p[0],p[1]]),lk.pat)}
    <h5>Outfit</h5>${wThumbGrid('outfit','out',OUTFITS.filter(x=>S.owned.outfits.includes(x[0])).map(x=>[x[0],x[1]]),lk.outfit||'none')}
    ${lk.outfit&&lk.outfit!=='none'&&lk.outfit!=='spacesuit'?'<h5>Outfit colour</h5>'+wSw('outCol',cols,lk.outCol):''}<h5>Trousers</h5>${wSw('pants',cols,lk.pants)}`;
  if(wSec==='hats') body=`<h5>Hat</h5><div class="hatgrid">${HATS.filter(h=>S.owned.hats.includes(h.id)).map(h=>`<button class="hatb" data-act="look" data-k="hat" data-v="${h.id}" aria-pressed="${lk.hat===h.id}"><canvas width="112" height="112" data-hat="${h.id}"></canvas>${esc(h.name)}</button>`).join('')}</div>
    <h5>Hat colour ${HATI[lk.hat]&&HATI[lk.hat].fixed?'<span style="text-transform:none;letter-spacing:0">(this hat keeps its own colours)</span>':''}</h5>${wSw('hatCol',cols,lk.hatCol)}`;
  if(wSec==='glasses') body=`<h5>Glasses</h5>${wThumbGrid('glasses','gls',GLASSES.filter(x=>S.owned.glasses.includes(x[0])).map(x=>[x[0],x[1]]),lk.glasses||'none')}`;
  if(wSec==='shoes') body=`<h5>Shoes</h5>${wThumbGrid('shoes','shoe',SHOES.filter(x=>S.owned.shoes.includes(x[0])).map(x=>[x[0],x[1]]),lk.shoes||'boots')}`;
  if(wSec==='neckback') body=`<h5>Neckwear</h5>${wThumbGrid('neck','neck',NECKS.filter(x=>S.owned.necks.includes(x[0])).map(x=>[x[0],x[1]]),lk.neck||'none')}
    <h5>On your back</h5>${wThumbGrid('back','back',BACKS.filter(x=>S.owned.backs.includes(x[0])).map(x=>[x[0],x[1]]),lk.back||'none')}
    ${(lk.neck&&lk.neck!=='none')||(lk.back&&lk.back!=='none')?'<h5>Accessory colour</h5>'+wSw('accCol',cols,lk.accCol):''}`;
  if(wSec==='shop'){ const list=wShop==='featured'?shopOffers():wCatalog(wShop).sort((a,b)=>wOwned(a.kind,a.id)-wOwned(b.kind,b.id)||a.price-b.price);
    const counts=Object.fromEntries(W_CATS.filter(c=>c[0]!=='featured').map(([k])=>{ const a=wCatalog(k); return [k,a.filter(i=>!wOwned(i.kind,i.id)).length]; }));
    body=`<div class="chips wd-cats">${W_CATS.map(([k,n])=>`<button class="chipb" data-act="wshop" data-k="${k}" aria-pressed="${wShop===k}">${n}${k!=='featured'?` <span class="meta">${counts[k]}</span>`:''}</button>`).join('')}</div>
      <p class="sub">${wShop==='featured'?`A changing selection of things you don’t own yet. New stock in <b id="shopleft">${mmss(Math.ceil(SHOP_LEN-(Date.now()/1000%SHOP_LEN)))}</b>.`:`Every ${W_CATS.find(c=>c[0]===wShop)[1].toLowerCase()} the shop sells, cheapest first. Try anything on before you buy.`}</p>
      <div class="wd-items">${list.length?list.map((it,i)=>wItemCard(it,wShop==='featured'&&it.feat)).join(''):'<div class="empty">You own everything here. Nice.</div>'}</div>`; }
  P.innerHTML=`<h2>Wardrobe</h2><div class="stylewrap wd"><div class="preview wd-prev">${previewBarHTML()}<canvas id="lookcv" width="520" height="560"></canvas></div><div class="wd-main">
    <div class="bwx-nav wd-nav" role="tablist">${secs.map(([k,n])=>`<button role="tab" data-act="wsec" data-k="${k}" aria-selected="${wSec===k}">${n}</button>`).join('')}</div>${body}</div></div>`;
  drawLookPreview();
  P.querySelectorAll('canvas[data-hat]').forEach(c=>{ const cx=c.getContext('2d'); cx.clearRect(0,0,c.width,c.height); hatPreview(cx,c.width,c.height,c.dataset.hat,lk.hatCol); });
  P.querySelectorAll('canvas[data-wthumb]').forEach(c=>{ const [kind,id]=c.dataset.wthumb.split(':'); if(id==='none'){ const cx=c.getContext('2d'); cx.clearRect(0,0,c.width,c.height); cx.fillStyle='rgba(200,220,240,.4)'; cx.font='700 '+Math.round(c.height*.3)+'px system-ui'; cx.textAlign='center'; cx.fillText('—',c.width/2,c.height*.6); return; } wThumb(c.getContext('2d'),kind,id,c.width,c.height); }); };
previewBarHTML = function(){ if(!PREVIEW) return ''; const p=PREVIEW;
  const buy = p.prize ? `<button class="btn sm" data-act="prize" data-k="${p.prize}" ${S.tickets>=p.price?'':'disabled'}>Get · 🎟 ${p.price}</button>` : `<button class="btn sm" data-act="wbuy" data-k="${p.kind}:${p.id}" ${S.money>=p.price?'':'disabled'}>Buy · <span class="coin">${fmt(p.price)}</span></button>`;
  return `<div class="pvbar"><span>Trying on: <b>${esc(p.name)}</b></span><span class="row">${buy}<button class="btn alt sm" data-act="tryoff">Take off</button></span></div>`; };
const _extraAct2_3 = extraAct2;
extraAct2 = function(b){ const a=b.dataset.act, k=b.dataset.k||'';
  if(a==='wsec'){ wSec=k; return 'render'; } if(a==='wshop'){ wShop=k; return 'render'; }
  if(a==='wtry'||a==='wbuy'){ const [kind,id]=k.split(':'); const it=wCatalog(kind).find(x=>x.id===id)||shopOffers().find(x=>x.kind===kind&&x.id===id); if(!it) return 'skip';
    if(a==='wtry'){ PREVIEW={kind,id,name:it.name,price:it.price}; return 'render'; }
    if(wOwned(kind,id)||S.money<it.price) return 'skip'; S.money-=it.price; S.stats.bought++; PREVIEW=null; const o=S.owned, L=S.look;
    if(kind==='col') o.cols.push(id); else if(kind==='pat'){ o.pats.push(id); L.pat=id; } else if(kind==='out'){ o.outfits.push(id); L.outfit=id; } else if(kind==='gls'){ o.glasses.push(id); L.glasses=id; } else if(kind==='hat'){ o.hats.push(id); L.hat=id; }
    else if(kind==='shoe'){ o.shoes.push(id); L.shoes=id; } else if(kind==='neck'){ o.necks.push(id); L.neck=id; } else { o.backs.push(id); L.back=id; }
    sfx.coin(); toast('Bought '+it.name+'. Looking sharp.'); save(); return 'render'; }
  return _extraAct2_3(b); };
document.head.insertAdjacentHTML('beforeend',`<style>
.stylewrap.wd{grid-template-columns:minmax(220px,300px) 1fr;align-items:start}
.wd-prev{position:sticky;top:8px}
.wd-nav{flex-wrap:wrap} .wd-nav button{min-width:84px}
.wd-cats .chipb .meta{font-size:11px;opacity:.8}
.wd-items{display:grid;grid-template-columns:repeat(auto-fill,minmax(170px,1fr));gap:10px}
.wd-item{display:flex;flex-direction:column;gap:6px;padding:10px;border-radius:14px;background:var(--glass,#16243a);border:1px solid var(--line);box-shadow:inset 0 1px 0 #ffffff10}
.wd-item.own{opacity:.75} .wd-item.feat{border-color:#ffd36a77;box-shadow:inset 0 1px 0 #ffffff14,0 0 20px #ffd36a1f}
.wd-item canvas{width:100%;height:96px;object-fit:contain;border-radius:10px;background:radial-gradient(circle at 50% 60%,#24365a,#101a2c);cursor:default}
.wd-it b{display:block;color:#fff;font-size:14px} .wd-ia{display:flex;gap:6px;flex-wrap:wrap;margin-top:auto}
.wd-thumbs{display:grid;grid-template-columns:repeat(auto-fill,minmax(88px,1fr));gap:8px}
.wd-th{display:flex;flex-direction:column;align-items:center;gap:4px;padding:6px;border-radius:12px;border:1px solid var(--line);background:var(--glass,#16243a);color:var(--ink);font:600 11.5px system-ui;cursor:pointer;text-align:center}
.wd-th canvas{width:64px;height:64px;cursor:pointer} .wd-th[aria-pressed="true"]{border-color:var(--gold);box-shadow:0 0 0 1px #ffd36a44,0 0 14px #ffd36a26}
@media (max-width:640px){ .stylewrap.wd{grid-template-columns:1fr} .wd-prev{position:relative;max-width:300px;margin:0 auto} .wd-items{grid-template-columns:repeat(auto-fill,minmax(140px,1fr))} }
</style>`);
