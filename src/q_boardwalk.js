
// =====================================================================
// 0.3 Boardwalk: meme outfits, and a Counter Specials shelf that restocks every 3 hours with
// Boardwalk-only wear (shoes, neckwear, back pieces, outfits) for tickets.
// =====================================================================
OUTFITS.push(['fishsuit','Fish costume',9000,'bw'],['hotdog','Hot dog suit',6700,'bw'],['tuxshirt','Tuxedo T-shirt',4200,'bw'],['clownsuit','Clown suit',5500,'bw']);
const MEME_OUT = {
  fishsuit(c,lk,D,f,t){ const col=D(lk.outCol&&lk.outCol!=='#d8a020'?lk.outCol:'#3aa8a0'), dk=D(mix(col,'#000000',.3)), bel=D('#f4ecd8');
    c.fillStyle=col; a3CoatPath(c,f,-15); c.fill(); c.save(); a3CoatPath(c,f,-15); c.clip();
    c.fillStyle=bel; c.beginPath(); c.ellipse(4,-30,5,13,0,0,7); c.fill(); c.strokeStyle=v3rgba(dk,.6); c.lineWidth=.45; for(let y=-46;y<-16;y+=3) for(let x=-10+((y/3)&1)*1.5;x<10;x+=3){ c.beginPath(); c.arc(x,y,1.5,Math.PI*.15,Math.PI*.85); c.stroke(); } c.restore();
    c.fillStyle=dk; c.beginPath(); c.moveTo(-6,-46); c.quadraticCurveTo(-9,-54+Math.sin(t*3),-3,-52); c.quadraticCurveTo(-2,-49,-1,-47); c.closePath(); c.fill();
    c.beginPath(); c.moveTo(-9,-22); c.lineTo(-13,-17+Math.sin(t*4)); c.lineTo(-9,-18); c.closePath(); c.fill(); },
  hotdog(c,lk,D,f,t){ const bun=D('#d8a05a'), bunD=D('#b07a3a'), saus=D('#c8442a'), mus=D('#f2d23a');
    c.fillStyle=bun; c.beginPath(); c.roundRect?c.roundRect(-11,-52,6,40,3):c.rect(-11,-52,6,40); c.fill(); c.fillStyle=bunD; c.fillRect(-11,-30,6,1);
    c.fillStyle=saus; c.beginPath(); c.roundRect?c.roundRect(-6.5,-55,11,45,5):c.rect(-6.5,-55,11,45); c.fill(); c.fillStyle='rgba(255,255,255,.18)'; c.fillRect(-4,-52,1.5,38);
    c.strokeStyle=mus; c.lineWidth=1.3; c.beginPath(); for(let y=-50;y<-14;y+=3) c.lineTo(-3+((y/3)&1)*4,y); c.stroke();
    c.fillStyle=bun; c.beginPath(); c.roundRect?c.roundRect(4,-52,7,40,3):c.rect(4,-52,7,40); c.fill(); c.fillStyle='rgba(255,240,210,.35)'; c.fillRect(8,-49,1.2,34); },
  tuxshirt(c,lk,D,f,t){ const w=D('#f4f4f2'), k=D('#1a1a20'); c.save(); a3TorsoPath(c,f); c.clip(); c.fillStyle=w; c.fillRect(-11,-50,22,30);
    c.fillStyle=k; c.beginPath(); c.moveTo(-7,-46); c.lineTo(-.4,-30); c.lineTo(-7,-24); c.closePath(); c.moveTo(8,-46); c.lineTo(1.4,-30); c.lineTo(8,-24); c.closePath(); c.fill();
    c.beginPath(); c.moveTo(.5,-44); c.lineTo(-2,-45.6); c.lineTo(-2,-42.4); c.closePath(); c.moveTo(.5,-44); c.lineTo(3,-45.6); c.lineTo(3,-42.4); c.closePath(); c.fill();
    for(let i=0;i<3;i++){ c.beginPath(); c.arc(.5,-39+i*4,.5,0,7); c.fill(); } c.restore(); },
  clownsuit(c,lk,D,f,t){ const col=D(lk.outCol&&lk.outCol!=='#d8a020'?lk.outCol:'#e8483a'); c.fillStyle=col; a3CoatPath(c,f,-14); c.fill(); c.save(); a3CoatPath(c,f,-14); c.clip();
    const cs=['#ffd84a','#5ad8ff','#7aff8a','#ffffff']; for(let i=0;i<24;i++){ c.fillStyle=D(cs[i%4]); c.beginPath(); c.arc(-9+((i*7)%19),-46+((i*11)%30),1.2,0,7); c.fill(); } c.restore();
    for(let i=0;i<3;i++){ c.fillStyle=D(['#ffffff','#ffd84a','#5ad8ff'][i]); c.beginPath(); c.arc(6.4,-40+i*6,1.4,0,7) /* pom-poms on the front edge (side view) */; c.fill(); }
    c.fillStyle=D('#f4f4f2'); for(let i=0;i<7;i++){ c.beginPath(); c.ellipse(-6+i*2,-46.4,1.6,1.1,0,0,7); c.fill(); } } };
const _drawOutfit3_0 = drawOutfit3;
drawOutfit3 = function(c,lk,D,f,t){ const m=MEME_OUT[lk.outfit]; if(m) return m(c,lk,D,f,t); return _drawOutfit3_0(c,lk,D,f,t); };
const _a3Sleeve_0 = a3Sleeve;
a3Sleeve = function(lk,D,shirt){ if(lk.outfit==='fishsuit') return D(lk.outCol&&lk.outCol!=='#d8a020'?lk.outCol:'#3aa8a0'); if(lk.outfit==='hotdog') return D('#d8a05a'); if(lk.outfit==='clownsuit') return D(lk.outCol&&lk.outCol!=='#d8a020'?lk.outCol:'#e8483a'); if(lk.outfit==='tuxshirt') return D('#f4f4f2'); return _a3Sleeve_0(lk,D,shirt); };

// ---------- Counter Specials: 6 Boardwalk-only pieces, restocking every 3 hours ----------
const BW_LEN = 3*3600;
function bwPool(){ return [...SHOES.filter(x=>x[3]==='bw').map(x=>({kind:'shoe',id:x[0],name:x[1],price:x[2]})), ...NECKS.filter(x=>x[3]==='bw').map(x=>({kind:'neck',id:x[0],name:x[1],price:x[2]})),
  ...BACKS.filter(x=>x[3]==='bw').map(x=>({kind:'back',id:x[0],name:x[1],price:x[2]})), ...OUTFITS.filter(x=>x[3]==='bw').map(x=>({kind:'out',id:x[0],name:x[1],price:x[2]}))].map(o=>Object.assign(o,{tix:Math.max(40,Math.round(o.price/12/5)*5)})); }
function bwOffers(){ const slot=Math.floor(Date.now()/1000/BW_LEN), pool=bwPool(), idx=[...pool.keys()], out=[]; let h=hashStr('bw'+slot);
  while(out.length<6&&idx.length){ h=Math.imul(h^(h>>>13),1597334677)>>>0; out.push(pool[idx.splice(h%idx.length,1)[0]]); } return out.sort((a,b)=>a.tix-b.tix); }
const bwOwned = o => o.kind==='shoe'?S.owned.shoes.includes(o.id):o.kind==='neck'?S.owned.necks.includes(o.id):o.kind==='back'?S.owned.backs.includes(o.id):S.owned.outfits.includes(o.id);
function bwSpecialsHTML(){ const left=Math.ceil(BW_LEN-(Date.now()/1000%BW_LEN)), offers=bwOffers(), owned=bwPool().filter(bwOwned).length;
  return `<div class="tile bwt" style="--c:#ff7ad8;margin-top:12px"><div class="row spread"><div><h4>Counter specials</h4><div class="meta">Boardwalk-only wear, new stock in <b>${Math.floor(left/3600)}h ${Math.floor(left%3600/60)}m</b>. You own ${owned} of ${bwPool().length}.</div></div><b>🎟 ${fmt(S.tickets)}</b></div>
   <div class="grid" style="grid-template-columns:repeat(auto-fill,minmax(200px,1fr))">${offers.map(o=>{ const own=bwOwned(o); return `<div class="row spread prize"><span class="row" style="gap:8px;flex-wrap:nowrap"><canvas width="112" height="112" data-bw="${o.kind}:${o.id}" style="width:56px;height:56px;cursor:default;flex:0 0 auto"></canvas><span>${esc(o.name)}<br><span class="meta">${o.kind==='shoe'?'Shoes':o.kind==='neck'?'Neckwear':o.kind==='back'?'On your back':'Outfit'}</span></span></span>
     ${own?'<span class="badge g">Owned</span>':`<button class="btn sm" data-act="bwbuy" data-k="${o.kind}:${o.id}" ${S.tickets>=o.tix?'':'disabled'}>🎟 ${o.tix}</button>`}</div>`; }).join('')}</div></div>`; }
const _renderBoardwalk_0 = renderBoardwalk;
renderBoardwalk = function(P){ _renderBoardwalk_0(P); P.insertAdjacentHTML('beforeend',bwSpecialsHTML());
  P.querySelectorAll('canvas[data-bw]').forEach(c=>{ const [kind,id]=c.dataset.bw.split(':'), x=c.getContext('2d'); x.clearRect(0,0,c.width,c.height); if(kind==='out') drawAngler(x,56,108,1.25,Object.assign({},S.look,{outfit:id,hat:'none'}),{}); else wearPreview(x,kind,id,112,112); }); };
const _extraAct2_0 = extraAct2;
extraAct2 = function(b){ if(b.dataset.act==='bwbuy'){ const [kind,id]=b.dataset.k.split(':'), o=bwOffers().find(x=>x.kind===kind&&x.id===id); if(!o||bwOwned(o)||S.tickets<o.tix) return 'skip';
    S.tickets-=o.tix; if(kind==='shoe'){ S.owned.shoes.push(id); S.look.shoes=id; } else if(kind==='neck'){ S.owned.necks.push(id); S.look.neck=id; } else if(kind==='back'){ S.owned.backs.push(id); S.look.back=id; } else { S.owned.outfits.push(id); S.look.outfit=id; }
    sfx.coin(); toast('You got the '+o.name+'! You are wearing it now (change it in the Wardrobe).'); save(); return 'render'; }
  return _extraAct2_0(b); };
