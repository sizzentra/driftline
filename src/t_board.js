
// =====================================================================
// 0.3 Boardwalk, redesigned in the game's own look: a painted night pier at the top, a wallet,
// three sections (Games, Prize counter, Counter specials) so nothing is a mile long, uniform game
// cards, and prizes that say exactly what they are and what they do.
// =====================================================================
let bwView='games';
function prizeInfo(p){ const id=p[0], nm=p[1].replace(/\s*\(.*\)\s*$/,''), tag=((p[1].match(/\(([^)]*)\)/)||[])[1]||'').toLowerCase();
  const pet=tag==='pet'?PETI[id]:null, rod=tag==='rod'?ROD_I[id]:null, hat=tag==='hat'?HATI[id]:null, dec=tag.includes('decor')&&DECORI?DECORI[id]:null;
  if(id==='golden'||id==='rainbow') return {cat:'Pet colour', d:'Recolours any of your pets in '+nm.toLowerCase().replace(' pet colour','')+'.'};
  if(pet) return {cat:'Pet', d:'A new pet to take fishing: '+fmtB(pet.k,pet.v)+' while it is your favourite.'};
  if(rod) return {cat:'Rod', d:(Object.keys(rod.st||{}).map(k=>statTxt(k,rod.st[k])).join(' · ')||'A new rod')+' · '+rod.slots+' attachment slot'+(rod.slots>1?'s':'')+'.'};
  if(hat) return {cat:'Hat', d:'A hat for your angler, only from the Boardwalk.'};
  if(id==='spacesuit') return {cat:'Outfit', d:'A full space suit for your angler.'};
  if(dec||id==='carousel') return {cat:'Aquarium decor', d:'A spinning carousel for your tank: +'+Math.round(((dec&&dec.b)||.04)*100)+'% aquarium income.'};
  if(id==='balloon'||id==='partyhat') return {cat:'Pet accessory', d:'Your pet wears it on the water and on your dock.'};
  if(id==='golden'||id==='rainbow') return {cat:'Pet colour', d:'Recolours any of your pets in '+nm.toLowerCase()+'.'};
  if(id==='scales10') return {cat:'Scales', d:'Scales level up your rods and buy rod attachments and special bait.'};
  if(id==='crate') return {cat:'Mystery crate', d:'Opens into clothes, lures, decor and now and then a pet.'};
  if(id==='myth') return {cat:'Bait', d:'Three Myth Bait: legendary fish are far more likely to bite.'};
  return {cat:'Prize', d:p[1]}; }
function bwCard(icon,col,title,meta,body,foot){ return `<div class="bwx-card" style="--c:${col}"><div class="bwx-ch"><span class="bwx-ic">${icon}</span><div><h4>${title}</h4><div class="meta">${meta}</div></div></div><div class="bwx-cb">${body}</div>${foot?`<div class="bwx-cf">${foot}</div>`:''}</div>`; }
function bwGamesHTML(){ const tk=S.tokens, base=bestLoot(), nextIn=Math.max(0,Math.ceil((SPIN_EVERY-(Date.now()-S.wheelT))/60000));
  const crateRow=(k,name,desc)=>`<div class="bwx-row"><div style="min-width:0"><b>${name}</b>${tk[k]?` <span class="badge g">${tk[k]} free</span>`:''}<div class="meta">${desc}</div></div>${tk[k]?`<button class="btn sm" data-act="crate" data-k="${k}" data-free="1">Open free</button>`:`<button class="btn sm" data-act="crate" data-k="${k}" ${S.money>=crateCost(k)?'':'disabled'}>Open · <span class="coin">${fmtShort(crateCost(k))}</span></button>`}</div>`;
  const betBtn=f=>{ const amt=Math.min(Math.floor(S.money*f), base*60); return `<button class="btn alt sm" data-act="flip" data-k="${f}" ${amt>=10?'':'disabled'}>${Math.round(f*100)}% · <span class="coin">${fmtShort(Math.max(0,amt))}</span></button>`; };
  const ducks = duck ? duck.prizes.map((p,i)=>{ const open=duck.pick>=0; const lab=p.k==='crate'?'🎁':p.k==='wear'?'👕':p.k==='coins'?'🪙':'🎟'+p.n; return `<button class="duckb ${open?(i===duck.pick?'picked':'open'):''}" data-act="duckpick" data-i="${i}" ${open?'disabled':''} aria-label="Duck ${i+1}" style="animation-delay:${i*.3}s">${open?`<span>${lab}</span>`:'🦆'}</button>`; }).join('') : '';
  return `<div class="bwx-grid">
   ${bwCard('🎡','#ff8a5c','Lucky wheel','A free spin every hour, up to '+SPIN_BANK+' saved.'+(S.freeSpins<SPIN_BANK?' Next in '+nextIn+' min.':''),
     `<div class="wheelwrap"><div class="wheelring"><canvas id="wheelcv" width="520" height="520"></canvas></div>${WH.result?`<div class="val bwx-res">${esc(WH.result)}</div>`:''}</div>`,
     S.freeSpins>0?`<button class="btn" data-act="spin" data-k="free" ${WH.spinning?'disabled':''}>Free spin (${S.freeSpins} left)</button>`:`<button class="btn" data-act="spin" ${WH.spinning||S.money<wheelCost()?'disabled':''}>Spin · <span class="coin">${fmtShort(wheelCost())}</span></button>`)}
   ${bwCard('🎁','#b9a2ff','Mystery crates','Clothes, decor, lures and pets you can’t get anywhere else, plus Boardwalk-only wear.',
     crateRow('small','Small crate','Mostly clothes and lures. Sometimes decor or a pet.')+crateRow('big','Big crate','Clothes, Boardwalk-only wear, decor and the rarer pets.')+crateRow('legend','Legendary crate','The really good stuff.')+(crateRes?`<div class="reveal bwx-res"><canvas width="240" height="180" id="crateprev"></canvas><div class="val">${esc(crateRes.title)}</div></div>`:''),'')}
   ${bwCard('🦆','#5ad8e8','Duck pond','Pick a rubber duck. Every duck wins tickets, and a few hide a crate or something to wear.',
     duck?`<div class="ducks">${ducks}</div>${duck.pick>=0?`<div class="val bwx-res">${esc(duck.msg||'')}</div>`:''}`:'<div class="bwx-art">🦆 🦆 🦆</div>',
     `<button class="btn${duck&&duck.pick<0?' alt':''}" data-act="duckagain" ${S.money>=base&&!(duck&&duck.pick<0)?'':'disabled'}>${duck?'Play again':'Play'} · <span class="coin">${fmtShort(base)}</span></button>`)}
   ${bwCard('🃏','#7fe3c4','Higher or lower','Guess the next fish card. Every right guess grows the ticket pot by half. Cash out any time.',
     hilo&&!hilo.done?`<div class="hilocard"><b>${hilo.card}</b><span>${CARD_FISH[hilo.card]}</span></div><div class="val bwx-res">Pot 🎟 ${fmt(hilo.pot)} tickets · streak ${hilo.streak}</div>`:`${hilo&&hilo.done?`<div class="val bwx-res">${esc(hilo.msg)}</div>`:'<div class="bwx-art">🂠 🂡</div>'}`,
     hilo&&!hilo.done?`<button class="btn sm" data-act="hilo" data-k="hi">Higher ▲</button><button class="btn sm" data-act="hilo" data-k="lo">Lower ▼</button><button class="btn alt sm" data-act="hilocash" ${hilo.streak?'':'disabled'}>Cash out</button>`:`<button class="btn" data-act="hilostart" ${S.money>=base*2?'':'disabled'}>Deal · <span class="coin">${fmtShort(base*2)}</span></button>`)}
   ${bwCard('🪙','#ffd36a','Coin flip','Heads you double it, tails the Fishmonger keeps it. '+S.gstats.flips+' flips, '+S.gstats.flipWins+' won.',
     flipRes?`<div class="val bwx-res" style="color:${flipRes.win?'var(--gold)':'var(--muted)'}">${esc(flipRes.txt)}</div>`:'<div class="bwx-art">🪙</div>', betBtn(.1)+betBtn(.25)+betBtn(.5))}
   ${bwCard('🎫','#ff9ac0','Scratch card','Three of a kind wins: 🐟 30 · 🦀 60 · 🐚 120 tickets · 💎 a crate · 👑 Boardwalk-only wear.',
     scratch&&!scratch.done?`<div class="scratch">${scratch.cells.map((s,i)=>`<button data-act="scratch" data-i="${i}" class="${scratch.open[i]?'open':''}" aria-label="Scratch box ${i+1}">${scratch.open[i]?scratch.sym[s]:''}</button>`).join('')}</div>`
      :scratch&&scratch.done?`<div class="scratch">${scratch.cells.map(s=>`<button class="open" disabled>${scratch.sym[s]}</button>`).join('')}</div><div class="val bwx-res" style="color:${scratch.win>=0?'var(--gold)':'var(--muted)'}">${scratch.win>=0?'Winner! '+(scratch.txt||''):'No match this time.'}</div>`:'<div class="bwx-art">🎫</div>',
     scratch&&!scratch.done?'<button class="btn alt sm" data-act="scratchall">Reveal all</button>':`<button class="btn" data-act="buyscratch" ${S.money>=base*2?'':'disabled'}>Buy a card · <span class="coin">${fmtShort(base*2)}</span></button>`)}
   ${bwCard('🧸','#ff7ab0','Claw machine','Plushies, tickets and secrets. The claw is… mostly honest.',
     `<canvas id="clawcv" width="420" height="260" class="bwx-claw"></canvas>${claw?`<div class="val bwx-res" style="color:${claw.win?'var(--gold)':'var(--muted)'}">${esc(claw.txt)}</div>`:''}`,
     `<button class="btn" data-act="claw" ${S.money>=clawCost()?'':'disabled'}>Drop the claw · <span class="coin">${fmtShort(clawCost())}</span></button>`)}
  </div>`; }
function bwPrizesHTML(){ return `<p class="sub">Every game hands out tickets. Trade them here for things you can’t get anywhere else. Preview anything you can wear or place first.</p><div class="bwx-prizes">${PRIZES.map(p=>{ const owned=p[4]&&p[4](), info=prizeInfo(p), can=S.tickets>=p[2];
    return `<div class="bwx-prize ${owned?'own':''}"><canvas width="96" height="80" data-prize="${p[0]}"></canvas><div class="bwx-pt"><span class="bwx-cat">${info.cat}</span><b>${esc(p[1].replace(/\s*\(.*\)\s*$/,''))}</b><div class="meta">${esc(info.d)}</div></div>
     <div class="bwx-pf">${owned?'<span class="badge g">Owned</span>':`${PRIZE_PV[p[0]]?`<button class="btn alt sm" data-act="prizepv" data-k="${p[0]}">Preview</button>`:''}<button class="btn sm" data-act="prize" data-k="${p[0]}" ${can?'':'disabled'}>🎟 ${fmt(p[2])}</button>`}</div></div>`; }).join('')}</div>`; }
function bwSpecials2(){ const left=Math.ceil(BW_LEN-(Date.now()/1000%BW_LEN)), offers=bwOffers(), pool=bwPool(), owned=pool.filter(bwOwned).length;
  return `<p class="sub">Boardwalk-only wear, new stock in <b>${Math.floor(left/3600)}h ${Math.floor(left%3600/60)}m</b>. You own ${owned} of ${pool.length}. What you buy goes straight on, and stays in your Wardrobe.</p><div class="bwx-prizes">${offers.map(o=>{ const own=bwOwned(o);
    return `<div class="bwx-prize ${own?'own':''}"><canvas width="160" height="130" data-bw="${o.kind}:${o.id}"></canvas><div class="bwx-pt"><span class="bwx-cat">${o.kind==='shoe'?'Shoes':o.kind==='neck'?'Neckwear':o.kind==='back'?'Worn on your back':'Outfit'}</span><b>${esc(o.name)}</b><div class="meta">Only at the Boardwalk counter.</div></div>
     <div class="bwx-pf">${own?'<span class="badge g">Owned</span>':`<button class="btn sm" data-act="bwbuy" data-k="${o.kind}:${o.id}" ${S.tickets>=o.tix?'':'disabled'}>🎟 ${fmt(o.tix)}</button>`}</div></div>`; }).join('')}</div>`; }
// the painted night pier at the top
function bwHero(cv){ if(!cv) return; const r=cv.getBoundingClientRect(), DP=Math.min(2,devicePixelRatio||1), w=Math.max(300,Math.round(r.width)), h=Math.round(r.height)||150; cv.width=w*DP; cv.height=h*DP; const x=cv.getContext('2d'); x.scale(DP,DP);
  const sk=x.createLinearGradient(0,0,0,h); sk.addColorStop(0,'#0b1230'); sk.addColorStop(.6,'#2a2050'); sk.addColorStop(1,'#4a2a5a'); x.fillStyle=sk; x.fillRect(0,0,w,h);
  const rr=v3rng(5); x.fillStyle='#fff'; for(let i=0;i<60;i++){ x.globalAlpha=.3+rr()*.6; const s=rr()*1.4+.4; x.fillRect(rr()*w,rr()*h*.55,s,s); } x.globalAlpha=1;
  // moon
  v3glow(x,w*.86,h*.24,h*.35,'rgba(255,240,210,.6)',.6); x.fillStyle='#fff3d6'; x.beginPath(); x.arc(w*.86,h*.24,h*.09,0,7); x.fill();
  const wy=h*.8; // water
  const wg=x.createLinearGradient(0,wy,0,h); wg.addColorStop(0,'#2a2a5a'); wg.addColorStop(1,'#0a1028'); x.fillStyle=wg; x.fillRect(0,wy,w,h-wy);
  // ferris wheel
  const fr=h*.33, fx=w*.15, fy=wy-fr-h*.07; x.strokeStyle='#1a1430'; x.lineWidth=3; x.beginPath(); x.moveTo(fx-fr*.6,wy); x.lineTo(fx,fy); x.lineTo(fx+fr*.6,wy); x.stroke();
  x.strokeStyle='#3a2a5a'; x.lineWidth=2; x.beginPath(); x.arc(fx,fy,fr,0,7); x.stroke(); for(let i=0;i<12;i++){ const a=i/12*Math.PI*2; x.beginPath(); x.moveTo(fx,fy); x.lineTo(fx+Math.cos(a)*fr,fy+Math.sin(a)*fr); x.stroke(); }
  const cols=['#ff8a5c','#ffd36a','#7fe3c4','#b9a2ff','#ff9ac0','#5ad8e8']; for(let i=0;i<24;i++){ const a=i/24*Math.PI*2, px=fx+Math.cos(a)*fr, py=fy+Math.sin(a)*fr; v3glow(x,px,py,6,cols[i%6],.7); x.fillStyle='#fff6e0'; x.beginPath(); x.arc(px,py,1.6,0,7); x.fill(); }
  for(let i=0;i<8;i++){ const a=i/8*Math.PI*2+.2, px=fx+Math.cos(a)*fr, py=fy+Math.sin(a)*fr; x.fillStyle=cols[i%6]; x.fillRect(px-4,py,8,7); }
  // the pier with lamp posts and a string of lights
  x.fillStyle='#2a1a24'; x.fillRect(0,wy-h*.05,w,h*.05); x.fillStyle='#1a1018'; for(let X=10;X<w;X+=46) x.fillRect(X,wy,5,h*.12);
  const posts=[]; for(let X=w*.38;X<w;X+=w*.14) posts.push(X); x.strokeStyle='#1a1018'; x.lineWidth=2; for(const X of posts){ x.beginPath(); x.moveTo(X,wy-h*.05); x.lineTo(X,wy-h*.42); x.stroke(); v3glow(x,X,wy-h*.44,h*.12,'rgba(255,200,120,.9)',.7); x.fillStyle='#ffe0a0'; x.beginPath(); x.arc(X,wy-h*.44,3,0,7); x.fill(); }
  for(let i=0;i<posts.length-1;i++){ const a=posts[i], b=posts[i+1], y0=wy-h*.42; for(let k=0;k<=8;k++){ const u=k/8, px=a+(b-a)*u, py=y0+Math.sin(u*Math.PI)*h*.08; v3glow(x,px,py,5,cols[(i*8+k)%6],.75); x.fillStyle='#fff'; x.beginPath(); x.arc(px,py,1.2,0,7); x.fill(); } }
  // stalls
  for(const [sx,c1,c2] of [[w*.45,'#ff8a5c','#ffe6d0'],[w*.66,'#7fe3c4','#e8fff6']]){ x.fillStyle='#24142a'; x.fillRect(sx,wy-h*.2,w*.12,h*.15); for(let k=0;k<6;k++){ x.fillStyle=k%2?c1:c2; x.beginPath(); x.moveTo(sx+k*w*.02,wy-h*.2); x.lineTo(sx+(k+1)*w*.02,wy-h*.2); x.lineTo(sx+(k+.5)*w*.02,wy-h*.15); x.closePath(); x.fill(); } v3glow(x,sx+w*.06,wy-h*.11,h*.12,'rgba(255,210,140,.7)',.5); }
  // reflections
  x.save(); x.globalAlpha=.25; for(let i=0;i<24;i++){ const a=i/24*Math.PI*2, px=fx+Math.cos(a)*fr; x.fillStyle=cols[i%6]; x.fillRect(px-2,wy+h*.04+Math.abs(Math.sin(a))*h*.08,4,1.5); } for(const X of posts){ x.fillStyle='#ffd08a'; x.fillRect(X-6,wy+h*.06,12,1.5); x.fillRect(X-4,wy+h*.1,8,1.5); } x.restore(); }
renderBoardwalk = function(P){ accrueSpins();
  P.innerHTML=`<div class="bwx"><div class="bwx-hero"><canvas id="bwhero"></canvas><div class="bwx-ht"><h2>The Boardwalk</h2><p>Games, prizes and treasures on the old pier. Coins and tickets only.</p></div></div>
   <div class="bwx-wallet"><span><b class="coin">${fmtShort(S.money)}</b></span><span><b>🎟 ${fmt(S.tickets)}</b> tickets</span><span><b style="color:var(--kelp)">${fmt(S.scales)}</b> Scales</span>${S.freeSpins>0?`<span class="badge g">${S.freeSpins} free spin${S.freeSpins>1?'s':''}</span>`:''}</div>
   <div class="bwx-nav" role="tablist">${[['games','Games'],['prizes','Prize counter'],['specials','Counter specials']].map(([k,n])=>`<button role="tab" data-act="bwview" data-k="${k}" aria-selected="${bwView===k}">${n}</button>`).join('')}</div>
   <div class="bwx-view">${bwView==='prizes'?bwPrizesHTML():bwView==='specials'?bwSpecials2():bwGamesHTML()}</div></div>`;
  bwHero($('bwhero'));
  if(bwView==='games'){ paintClaw(); drawWheel(); const cp=$('crateprev'); if(cp&&crateRes){ const x=cp.getContext('2d'); const k=crateRes.kind;
    if(k==='pet') drawPetStyled(x,crateRes.id,120,160,crateRes.id==='unicorn'?3.4:5,0); else if(k==='decor') drawDecor(x,crateRes.id,120,170,1.6,0); else if(k==='hat') hatPreview(x,240,180,crateRes.id,S.look.hatCol,true);
    else if(k==='rod'){ x.save(); x.scale(1.8,1.8); v3Rod(x,{x:16,y:80},{x:118,y:16},66,50,ROD_I[crateRes.id],0,0,false); x.restore(); }
    else if(k==='col'){ x.fillStyle=crateRes.id; x.beginPath(); x.arc(120,90,50,0,7); x.fill(); } else if(k==='wear') bwDrawWear(x,240,180,crateRes.wear); else drawJunk(x,240,180,k==='lure'?'goldlure':'chest'); } }
  if(bwView==='prizes'){ paintPrizes(P);
    // prizes added in later updates: draw them from the real pet, rod and hat art instead of the generic token
    P.querySelectorAll('canvas[data-prize]').forEach(c=>{ const id=c.dataset.prize, p=PRIZES.find(q=>q[0]===id); if(!p) return; const tag=((p[1].match(/\(([^)]*)\)/)||[])[1]||'').toLowerCase(), x=c.getContext('2d');
      if(tag==='pet'&&PETI[id]&&!['teddy'].includes(id)){ x.clearRect(0,0,c.width,c.height); drawPetStyled(x,id,48,72,2.6,0); }
      else if(tag==='rod'&&ROD_I[id]){ x.clearRect(0,0,c.width,c.height); v3Rod(x,{x:10,y:66},{x:88,y:12},44,44,ROD_I[id],0,0,false); }
      else if(tag==='hat'&&HATI[id]){ x.clearRect(0,0,c.width,c.height); hatPreview(x,96,80,id,S.look.hatCol); } }); }
  if(bwView==='specials') P.querySelectorAll('canvas[data-bw]').forEach(c=>{ const [kind,id]=c.dataset.bw.split(':'), x=c.getContext('2d'); x.clearRect(0,0,c.width,c.height); if(kind==='out') drawAngler(x,80,124,1.45,Object.assign({},S.look,{outfit:id,hat:'none'}),{}); else wearPreview(x,kind,id,160,130); }); };
const _extraAct2_1 = extraAct2;
extraAct2 = function(b){ if(b.dataset.act==='bwview'){ bwView=b.dataset.k; return 'render'; } return _extraAct2_1(b); };
document.head.insertAdjacentHTML('beforeend',`<style>
.bwx-hero{position:relative;height:170px;border-radius:18px;overflow:hidden;border:1px solid #5a4a8a66;box-shadow:0 10px 30px #02060f99, inset 0 1px 0 #ffffff14}
.bwx-hero canvas{position:absolute;inset:0;width:100%;height:100%;cursor:default}
.bwx-ht{position:absolute;left:0;right:0;bottom:0;padding:14px 18px;background:linear-gradient(0deg,#0a0c1ee6,#0a0c1e00)}
.bwx-ht h2{margin:0;font-size:26px;color:#fff;text-shadow:0 2px 10px #000a,0 0 18px #ffb36a55}
.bwx-ht p{margin:2px 0 0;color:#d8cff0;font-size:13px}
.bwx-wallet{display:flex;flex-wrap:wrap;gap:8px;margin:10px 0}
.bwx-wallet>span{padding:6px 12px;border-radius:999px;background:var(--glass,#16243a);border:1px solid var(--line);box-shadow:var(--lit);font-size:13px;color:var(--muted)}
.bwx-wallet>span b{color:var(--ink)}
.bwx-nav{display:flex;gap:6px;padding:4px;border-radius:14px;background:#0a1220;border:1px solid var(--line);margin-bottom:12px}
.bwx-nav button{flex:1;border:0;border-radius:10px;padding:9px 6px;background:transparent;color:var(--muted);font:600 13px system-ui;cursor:pointer}
.bwx-nav button[aria-selected="true"]{background:linear-gradient(180deg,#2a3a5e,#1c2a46);color:#fff;box-shadow:inset 0 1px 0 #ffffff1a,0 0 0 1px #ffd36a33,0 0 16px #ffd36a1a}
.bwx-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(250px,1fr));gap:12px}
.bwx-card{display:flex;flex-direction:column;gap:10px;padding:14px;border-radius:16px;background:linear-gradient(180deg,color-mix(in srgb,var(--c) 10%,#16243a),#111c2e 90px);border:1px solid color-mix(in srgb,var(--c) 30%,#26385180);box-shadow:inset 0 1px 0 #ffffff12,0 6px 18px #02060f66}
.bwx-ch{display:flex;gap:10px;align-items:flex-start}
.bwx-ch h4{margin:0 0 2px;color:#fff}
.bwx-ic{flex:0 0 auto;width:42px;height:42px;border-radius:12px;display:grid;place-items:center;font-size:22px;background:radial-gradient(circle at 35% 30%,color-mix(in srgb,var(--c) 45%,#1a2a44),color-mix(in srgb,var(--c) 15%,#0e1830));box-shadow:0 0 16px color-mix(in srgb,var(--c) 35%,transparent),inset 0 1px 0 #ffffff26}
.bwx-cb{flex:1;display:flex;flex-direction:column;justify-content:center;gap:8px;min-height:96px}
.bwx-cf{display:flex;flex-wrap:wrap;gap:6px;justify-content:center}
.bwx-art{text-align:center;font-size:40px;opacity:.85;filter:drop-shadow(0 0 12px color-mix(in srgb,var(--c) 50%,transparent))}
.bwx-res{text-align:center}
.bwx-row{display:flex;justify-content:space-between;align-items:center;gap:8px;padding:7px 0;border-bottom:1px solid #ffffff10}
.bwx-row:last-of-type{border-bottom:0}
.bwx-card .wheelring{width:min(232px,100%);aspect-ratio:1;box-sizing:border-box;margin:0 auto;box-shadow:0 0 0 3px #ffd36a,0 0 24px #ffd36a44}
.bwx-card .wheelwrap canvas{width:100%;height:100%;display:block}
.bwx-card .ducks{background:linear-gradient(#1f6a88,#123e58)}
.bwx-card .hilocard{border-color:#7fe3c4}
.bwx-claw{width:100%;height:auto;border-radius:12px;cursor:default;background:#1a2a3a}
.bwx-prizes{display:grid;grid-template-columns:repeat(auto-fill,minmax(230px,1fr));gap:10px}
.bwx-prize{display:flex;flex-direction:column;gap:8px;padding:12px;border-radius:16px;background:var(--glass,#16243a);border:1px solid var(--line);box-shadow:inset 0 1px 0 #ffffff12,0 6px 18px #02060f55}
.bwx-prize.own{border-color:#ffd36a55}
.bwx-prize canvas{width:100%;height:110px;object-fit:contain;border-radius:12px;background:radial-gradient(circle at 50% 60%,#24365a,#101a2c);cursor:default}
.bwx-pt b{display:block;color:#fff;font-size:15px;margin:2px 0}
.bwx-cat{display:inline-block;font-size:10.5px;letter-spacing:.08em;text-transform:uppercase;color:#ffd36a}
.bwx-pf{display:flex;gap:6px;justify-content:flex-end;margin-top:auto}
@media (max-width:520px){ .bwx-hero{height:130px} .bwx-ht h2{font-size:21px} .bwx-nav button{font-size:12px;padding:8px 2px} .bwx-grid,.bwx-prizes{grid-template-columns:1fr} }
</style>`);
