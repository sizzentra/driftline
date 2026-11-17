
// ---------- loop ----------
let last=performance.now();
function frame(now){ const dt=Math.min(.05,(now-last)/1000); last=now; update(dt); draw(now); if(S.tab==='aquarium') drawTank(now); hud(); requestAnimationFrame(frame); }
let lastBuffN=-1, lastShopSlot=Math.floor(Date.now()/1000/SHOP_LEN);
setInterval(()=>{ accrue(); const el=$('tankbank'); if(el) el.textContent=fmt(S.tankBank); const cb=$('collectbtn'); if(cb) cb.disabled=S.tankBank<1;
  const dl=$('dmleft'); if(dl){ dl.textContent=mmss(wxLeft()); if(wxLeft()>=WX_LEN-1 && S.tab==='cooler') renderPanel(); }
  const t=Date.now(); const ended=S.buffs.filter(b=>b.until<=t); if(ended.length){ S.buffs=S.buffs.filter(b=>b.until>t); toast('Boost ended: '+ended.map(b=>b.src).join(', ')); save(); }
  const bn=activeBuffs().length; if(bn!==lastBuffN){ lastBuffN=bn; lastHud=''; }
  const sl=$('shopleft'); const slot=Math.floor(t/1000/SHOP_LEN); if(sl) sl.textContent=mmss(Math.ceil(SHOP_LEN-(t/1000%SHOP_LEN))); if(slot!==lastShopSlot){ lastShopSlot=slot; if(S.tab==='style') renderPanel(); } }, 1000);
setInterval(()=>{ if(S.tank.length||S.buffs.length) save(); }, 30000);

// ---------- HUD / hint ----------
let lastHud='', lastWx='';
function hud(){
  const p=phase(), nf=nextFlip(), wx=weather(), wl=wxLeft(); const key=[S.money,S.lvl,S.xp,S.loc,S.cooler.length,tod(p),nf.s,wx.k,wl,G.st,ptsFree(),lastBuffN].join('|');
  setHint();
  if(key===lastHud) return; lastHud=key;
  $('money').textContent=fmtShort(S.money); $('money').title=fmt(S.money)+' coins'; $('lvl').textContent=S.lvl; $('xpfill').style.width=(S.xp/xpNeed(S.lvl)*100)+'%';
  $('locname').textContent=curLoc().name; $('tod').textContent=tod(p); $('todnext').textContent=nf.label+' '+mmss(nf.s);
  $('wx').textContent=wxName(wx.k); $('wxnext').textContent='Changes in '+mmss(wl); $('wxchip').title=wx.note; $('wx').style.color = wx.k==='Gilded'?'var(--gold)':wx.k==='Storm'?'#9fb4ff':'';
  if(wx.k!==lastWx){ if(lastWx) toast('Weather: '+wxName(wx.k)+'. '+wx.note); lastWx=wx.k; }
  $('coolerct').textContent=S.cooler.length+' / '+gv('cooler'); $('coolerct').style.color = S.cooler.length>=gv('cooler') ? 'var(--danger)' : '';
  const ab=activeBuffs(); $('buffct').textContent=ab.length?ab.length+' active':'None'; $('buffct').style.color=ab.length?'var(--kelp)':'var(--muted)'; $('buffchip').title=ab.length?ab.map(b=>b.src+': '+fmtB(b.k,b.v)).join('\n'):'Fish up junk, spin the wheel or catch a falling star for boosts';
  const T=$('tabs'); const dot=n=>n?'<span class="dot">'+n+'</span>':'';
  const lab=k=>T.querySelector('[data-tab="'+k+'"]'); const setT=(k,n)=>{ const b=lab(k); if(b) b.innerHTML=tabHTML(b.dataset.label)+dot(n); };
  setT('cooler',S.cooler.length); setT('bounties',S.bounties.filter(b=>bDone(b)).length+(S.daily?S.daily.tasks.filter(t=>!t.claimed&&taskHave(t)>=t.n).length:0)); setT('skills',ptsFree());
  setT('pass',S.pass?S.pass.lvl-S.pass.claimed:0); setT('paths',SPEC_TIERS.filter((T2,i)=>S.lvl>=T2.lvl&&!S.specs[i]).length);
}
let lastHint=''; const TOUCH=window.matchMedia&&matchMedia('(pointer:coarse)').matches;
function fmtShort(n){ n=Math.floor(n); if(n<100000) return fmt(n); if(n<1e6) return (n/1e3).toFixed(n<1e5?1:0)+'K'; if(n<1e9) return (n/1e6).toFixed(n<1e7?2:1)+'M';
  /* 0.3.6: trillions and beyond keep a short form (7.7 trillion used to read "7700.00B") */ const U=['B','T','Qa','Qi','Sx','Sp','Oc','No','Dc']; let i=0, v=n/1e9; while(v>=1000&&i<U.length-1){ v/=1000; i++; } return (v<10?v.toFixed(2):v<100?v.toFixed(1):v.toFixed(0))+U[i]; }
function setHint(){ let h='';
  switch(G.st){
    case 'idle': h = S.cooler.length>=gv('cooler') ? 'Cooler full. Open the <b>Cooler</b> tab to sell, or move fish to the <b>Aquarium</b>.' : G.hot ? 'A <b>hotspot</b> is rippling! Cast right into it for rarer fish.' : (V3ON && S.settings.castMode==='aim') ? (TOUCH ? '<b>Tap the water</b> where you want to cast.' : '<b>Click the water</b> where you want to cast (or hold Space for the power meter).') : TOUCH ? '<b>Touch and hold</b> the water to charge a cast, <b>let go</b> to throw.' : '<b>Hold</b> on the water (or Space) to charge a cast, <b>release</b> to throw.'; break;
    case 'charging': h='Release to cast. A <b>far cast</b> or a <b>hotspot</b> improves your odds.'; break;
    case 'flying': h='&nbsp;'; break;
    case 'waiting': h='Watch the bobber. Small twitches are nibbles: <b>wait for the big splash</b>.'; break;
    case 'bite': h='<b>Now!</b> Click or press Space to set the hook.'; break;
    case 'reeling': h=V3ON?'<b>Hold</b> to reel, or <b>draw circles</b> to crank. <b>Let go</b> when it runs, jumps, shakes or gets angry.':'<b>Hold</b> to reel. <b>Let go</b> when it runs, jumps, shakes or gets angry.'; break;
    case 'landing': h='Pulling it out…'; break;
    case 'result': h='Nice catch.'; break;
    case 'frenzy': h='<b>Tap the leaping fish!</b>'; break;
    case 'event': h='&nbsp;'; break;
  } if(!S.settings.hints) h='&nbsp;'; if(h!==lastHint){ $('hint').innerHTML=h; lastHint=h; } }
let toastT=0; function toast(m){ const el=$('toast'); el.textContent=m; el.classList.add('on'); clearTimeout(toastT); toastT=setTimeout(()=>el.classList.remove('on'),3200); }

// ---------- catch card ----------
function showCard(o){
  o.draw($('cardfish')); $('cardin').classList.toggle('shiny',!!o.shiny);
  $('cardrar').textContent=o.rar; $('cardrar').style.color=o.rarCol; $('cardname').textContent=o.name;
  $('cardnums').innerHTML=o.nums.map(n=>`<div><span>${esc(n[0])}</span><b${n[2]?' class="coin"':''}>${esc(n[1])}</b></div>`).join('');
  if(o.html) $('carddesc').innerHTML=o.desc; else $('carddesc').textContent=o.desc;
  $('cardbadges').innerHTML=o.badges.map(b=>`<span class="badge ${b[0]}">${esc(b[1])}</span>`).join(''); $('card').hidden=false; }
function hideCard(){ $('card').hidden=true; G.st='idle'; afterCard(); }
$('card').addEventListener('pointerdown',e=>{ e.stopPropagation(); hideCard(); });

// ---------- bounties ----------
// 0.3: every water keeps its own board of bounties, so progress (and rare bounties) stay with that water
const BOUNTIES_PER_WATER = 3;
const bountySlots = () => BOUNTIES_PER_WATER*S.unlocked.length;
let bLoc=null;
function makeBounty(L){ L=L||S.loc;
  if(Math.random()<.08){ const lp=SP.filter(s=>s.loc===L&&s.r===4); if(lp.length){ const sp=pick(lp); return {sp:sp.id, loc:L, type:'count', n:1, have:0, reward:Math.round(sp.base*3), legend:1}; } }
  const cap = Math.random()<.12 ? 3 : Math.random()<.3 ? 2 : 1;
  const pool=SP.filter(s=>s.loc===L && s.r <= cap); const sp = pick(pool.length?pool:SP.filter(s=>s.loc===L));
  if(Math.random()<.55){ const n = sp.r===0 ? 2+Math.floor(Math.random()*3) : sp.r>=3 ? 1 : 1+Math.floor(Math.random()*2); return {sp:sp.id, loc:L, type:'count', n, have:0, reward:Math.round(sp.base*n*2.4+20)}; }
  const kg = +(sp.min+(sp.max-sp.min)*rnd(.45,.7)).toFixed(sp.max<10?2:1); return {sp:sp.id, loc:L, type:'size', kg, have:0, reward:Math.round(sp.base*4+30)};
}
function bountyLoc(b){ if(b.loc) return b.loc; if(b.sp&&SPI[b.sp]) return SPI[b.sp].loc; return null; }
function fillBounties(){ for(const b of S.bounties){ if(!b.loc){ const l=bountyLoc(b); b.loc=l||S.loc; } }
  for(const L of S.unlocked){ let n=S.bounties.filter(b=>b.loc===L).length; while(n<BOUNTIES_PER_WATER){ S.bounties.push(makeBounty2(L)||makeBounty(L)); n++; } } }
function bDone(b){ return (b.type==='count'||b.type==='style') ? b.have>=b.n : b.have>=1; }
function checkBounties(sp,kg){ const done=[]; for(const b of S.bounties){ if(b.sp!==sp.id || bDone(b)) continue; if(b.type==='count'){ b.have++; } else if(kg>=b.kg){ b.have=1; } if(bDone(b)) done.push(b); } return done; }

// ---------- panels ----------
let confirmBox = null, encLoc = null, encSel = null;
function setTab(t){ if(S.tab!==t) confirmBox=null; S.tab=t; for(const b of $('tabs').children) b.setAttribute('aria-selected', b.dataset.tab===t?'true':'false'); renderPanel(); }
$('tabs').addEventListener('click',e=>{ const b=e.target.closest('[data-tab]'); if(b){ setTab(b.dataset.tab); save(); b.scrollIntoView({block:'nearest',inline:'nearest'}); } });
$('panel').addEventListener('click',e=>{ const b=e.target.closest('[data-tabgo]'); if(b){ setTab(b.dataset.tabgo); save(); } });
function renderPanel(){ const P=$('panel'); const fn={cooler:renderCooler, shop:renderShop, skills:renderSkills2, aquarium:renderAquarium, bounties:renderBounties, feats:renderFeats, journal:renderJournal, map:renderMap, style:renderStyle, pets:renderPets, save:renderSave, games:renderBoardwalk, settings:renderSettings, rods:renderRods, paths:renderPaths, home:renderHome, pass:renderPass}[S.tab]||renderCooler; fn(P); }
const tags = f => (f.sh===2?' <span class="sh" style="color:'+PRISM[f.pv||'rainbow'].c+'">✦✦ '+PRISM[f.pv||'rainbow'].n+' prismatic</span>':f.sh?' <span class="sh">✦ Shiny</span>':'')+(f.hy?' · <span class="sh">Hybrid</span>':'')+(f.tr?' · Trophy':'');
const aqTxt = f => { const L=aqBuffsOf(f), sp=SPI[f.id]; return L.length ? L.map(e=>fmtB(e.k,e.v)+(sp&&e.t!==sp.r?' ('+RAR[e.t].k+' boost)':'')).join(' + ') : 'no special effect'; };
function paintFish(P){ P.querySelectorAll('canvas[data-fish]').forEach(c=>fishCanvas(c,SPI[c.dataset.fish],c.dataset.known!=='0',+c.dataset.sh||0,c.dataset.pv||null)); }

const isProtected = f => S.settings.protectRare && (f.sh || SPI[f.id].r>=3);
function renderCooler(P){
  const total=S.cooler.filter(f=>!sellKeep(f)).reduce((a,f)=>a+salePrice(f),0); const tankFree = S.tank.length < aqCap(); const dm=demandSp();
  P.innerHTML=`<div class="row spread"><div><h2>Cooler</h2><p class="sub">${S.cooler.length} of ${gv('cooler')} slots. Your bonuses add +${Math.round((sellMult()-1)*100)}% to every sale. Fish in the aquarium earn coins and give stacking boosts.</p></div>
  <button class="btn" data-act="sellall" ${total?'':'disabled'}>Sell ${sellFilterOn()?"matching":"all"}${S.cooler.some(sellKeep)?" (keeping "+S.cooler.filter(sellKeep).length+")":""} for <span class="coin">${fmt(total)}</span></button></div>
  <div class="tile" style="margin-top:10px;flex-direction:row;align-items:center;gap:12px"><canvas width="128" height="64" data-fish="${dm.id}" style="width:64px;height:32px"></canvas>
  <div style="min-width:0"><b>The fishmonger wants ${dm.name}</b> <span class="meta">(${LOCS[locIdx(dm.loc)].name})</span><div class="meta">Pays double for it until the weather changes (<span id="dmleft">${mmss(wxLeft())}</span>).</div></div></div>`+
  (S.cooler.length ? '<div class="list">'+S.cooler.map((f,i)=>{ const sp=SPI[f.id]; return `<div class="fishrow"><canvas width="128" height="64" data-fish="${f.id}" data-sh="${f.sh||0}" data-pv="${f.pv||''}"></canvas>
   <div class="nm"><span style="color:${RAR[sp.r].c}">${sp.name}</span><small>${RAR[sp.r].k} · ${kgStr(f.kg)}${tags(f)} · <span class="aq">Aquarium: ${aqTxt(f)}</span></small></div>
   <div class="val coin" ${dm.id===f.id?'style="color:var(--gold)" title="Fishmonger pays double"':''}>${fmt(salePrice(f))}${dm.id===f.id?' ×2':''}</div><div class="acts"><button class="btn alt sm" data-act="totank" data-i="${i}" ${tankFree?'':'disabled'} title="${tankFree?'Earns '+fmt(fishRate(f)*60)+' coins per hour':'Aquarium is full'}">To aquarium</button><button class="btn alt sm" data-act="sell" data-i="${i}">Sell</button></div></div>`; }).reverse().join('')+'</div>'
   : '<div class="empty">Nothing in the cooler yet. Cast a line and land your first fish.</div>');
  paintFish(P);
}
function renderShop(P){
  const gearTiles = Object.entries(GEAR).map(([k,G2])=>{ const lv=S.gear[k], max=G2.lv.length-1, next=lv<max?G2.cost[lv+1]:0;
    return `<div class="tile"><div class="row spread"><h4>${G2.name}</h4><span class="meta">Level ${lv+1} / ${max+1}</span></div>
    <div class="pips">${G2.lv.map((_,i)=>`<i class="${i<=lv?'on':''}"></i>`).join('')}</div>
    <div class="meta">${G2.what}</div>
    <div class="val">${G2.fmt(G2.lv[lv])}${lv<max?` <span class="meta">→ ${G2.fmt(G2.lv[lv+1])}</span>`:''}</div>
    ${lv<max?`<button class="btn" data-act="buygear" data-k="${k}" ${S.money>=next?'':'disabled'}>Upgrade · <span class="coin">${fmt(next)}</span></button>`:'<button class="btn alt" disabled>Maxed out</button>'}</div>`; }).join('');
  const baitTile = ([k,b]) => `<div class="tile"><div class="row spread"><h4>${b.name}</h4><span class="meta">You have ${S.bait[k]}</span></div>
    <div class="meta">${b.note} Bites ${Math.round((b.speed-1)*100)}% faster.</div>
    <div class="row">${b.junk?'':b.scales?`<button class="btn" data-act="buybait" data-k="${k}" ${S.scales>=b.scales?'':'disabled'}>Buy ${b.pack} · ${b.scales} Scales</button>`:`<button class="btn" data-act="buybait" data-k="${k}" ${S.money>=b.price?'':'disabled'}>Buy ${b.pack} · <span class="coin">${fmt(b.price)}</span></button><button class="btn alt sm" data-act="buybait" data-k="${k}" data-n="5" ${S.money>=b.price*4.5?'':'disabled'} title="10% off">×${b.pack*5} · <span class="coin">${fmt(b.price*4.5)}</span></button>`}
    <button class="btn alt" data-act="usebait" data-k="${k}" ${S.bait[k]>0&&S.baitSel!==k?'':'disabled'}>${S.baitSel===k?'In use':'Use'}</button></div></div>`;
  const shopBait = Object.entries(BAIT).filter(([k,b])=>k!=='worm'&&!b.junk), junkBait=Object.entries(BAIT).filter(([k,b])=>b.junk);
  P.innerHTML=`<h2>Tackle shop</h2><p class="sub">Heavier fish need stronger line and a faster reel. Better bait brings rarer fish; one bait is used each time you set the hook.</p>
  <div class="grid">${gearTiles}</div><h2 style="margin-top:18px">Bait</h2><div class="grid">${shopBait.map(baitTile).join('')}</div>
  <h2 style="margin-top:18px">Special lures</h2><p class="sub">Can’t be bought. They come out of junk you fish up: cheese, disco balls, magnets, gold.</p><div class="grid">${junkBait.map(baitTile).join('')}</div>`;
}
function renderSkills(P){ const free=ptsFree(), cost=50*S.lvl;
  P.innerHTML=`<div class="row spread"><div><h2>Skills</h2><p class="sub">You get 1 skill point per angler level, plus bonus points from feats. ${ptsSpent()} of ${Object.values(PERKS).reduce((a,p)=>a+p.max,0)} ranks learned.</p></div>
  <div class="row"><div style="text-align:right"><div class="pts">${free}</div><div class="sub">points to spend</div></div>
  <button class="btn alt" data-act="respec" ${ptsSpent()&&S.money>=cost?'':'disabled'}>Reset skills · <span class="coin">${fmt(cost)}</span></button></div></div>
  <div class="grid">`+Object.entries(PERKS).map(([k,p])=>{ const r=pr(k); return `<div class="tile ${r>=p.max?'done':''}"><div class="row spread"><h4>${p.name}</h4><span class="meta">Rank ${r} / ${p.max}</span></div>
    <div class="pips">${Array.from({length:p.max},(_,i)=>`<i class="${i<r?'on':''}"></i>`).join('')}</div>
    <div class="meta">${p.d}</div><div class="val" style="font-size:14px">Each rank: ${p.per}</div>
    <button class="btn" data-act="perk" data-k="${k}" ${free>0&&r<p.max?'':'disabled'}>${r>=p.max?'Maxed':'Learn rank '+(r+1)}</button></div>`; }).join('')+'</div>';
}
function renderAquarium(P){ accrue(); const rate=tankRate(); const next=TANK_COST[S.tankSlots];
  const sums={}; for(const f of S.tank) for(const e of aqBuffsOf(f)) sums[e.k]=(sums[e.k]||0)+e.v;
  const chips=Object.entries(sums).map(([k,v])=>`<span class="badge k">${fmtB(k,Math.min(v,BONUS_CAP[k]||9))}</span>`).join('');
  P.innerHTML=`<div class="row spread"><div><h2>Aquarium</h2><p class="sub">Visitors pay to see your fish, even while you're away (up to 8 hours). Every fish gives a boost while on display, and boosts stack. Each fish rolls its own boost when caught: usually one that fits its rarity, now and then a much better (or weaker) one. Heavier fish give more, shiny fish double, and the strangest catches give the most.</p></div>
  <div class="bank"><div><div class="sub">Earning</div><b class="coin">${fmt(rate*60)}</b><span class="sub"> / hour</span></div><div><div class="sub">Ready to collect</div><b class="coin" id="tankbank">${fmt(S.tankBank)}</b></div>
  <button class="btn" id="collectbtn" data-act="collect" ${S.tankBank>=1?'':'disabled'}>Collect</button></div></div>
  <div class="badges" style="justify-content:flex-start;margin-top:8px">${chips||'<span class="sub">No boosts yet. Put a fish on display.</span>'}</div>
  <div class="tank"><canvas id="tankcv"></canvas></div>${S.aq.decor.length?`<p class="sub" style="margin-top:6px">Drag a decoration along the sand to move it.</p>`:""}
  <div class="row spread" style="margin-top:10px"><span class="sub">${S.tank.length} of ${aqCap()} spots used</span>
  ${next!=null?`<button class="btn alt" data-act="buytank" ${S.money>=next?'':'disabled'}>Increase tank size · <span class="coin">${fmt(next)}</span></button>`:'<span class="sub">Your tank is as big as it gets</span>'}</div>`+
  (S.tank.length ? '<div class="list">'+S.tank.map((f,i)=>{ const sp=SPI[f.id]; return `<div class="fishrow"><canvas width="128" height="64" data-fish="${f.id}" data-sh="${f.sh?1:0}"></canvas>
   <div class="nm"><span style="color:${RAR[sp.r].c}">${sp.name}</span><small>${RAR[sp.r].k} · ${kgStr(f.kg)}${tags(f)} · <span class="aq">${aqTxt(f)}</span></small></div>
   <div class="val"><span class="coin">${fmt(fishRate(f)*60)}</span><span class="sub"> / h</span></div><div class="acts"><button class="btn alt sm" data-act="untank" data-i="${i}" ${S.cooler.length<gv('cooler')?'':'disabled'}>Back to cooler</button></div></div>`; }).join('')+'</div>'
   : '<div class="empty">No fish on display yet. In the Cooler, press <b>To aquarium</b> on a fish you want to keep.</div>') + aqCustomHTML();
  paintFish(P); paintDecor(P);
}
function renderBounties(P){ fillBounties();
  P.innerHTML=dailyHTML()+`<h2>Bounties</h2><p class="sub">The harbourmaster pays extra for specific catches. Every water has its own board, and its bounties wait there until you finish them. Fish still go in your cooler.</p>
  <div class="chips" style="margin:6px 0 10px">${S.unlocked.slice().sort((a,b)=>locIdx(a)-locIdx(b)).map(L=>{ const n=S.bounties.filter(b=>b.loc===L&&bDone(b)).length; return `<button class="chipb" data-act="bloc" data-k="${L}" aria-pressed="${(bLoc||S.loc)===L}">${esc(LOCS[locIdx(L)].name)}${n?' · '+n+' ready':''}</button>`; }).join('')}</div><div class="grid">`+
  S.bounties.map((b,i)=>{ if(b.loc!==(S.unlocked.includes(bLoc)?bLoc:S.loc)) return ''; const bt=bountyText(b); if(bt){ const d=bDone(b), rw=Math.round(b.reward*coinMult()*(spec('collector')?.8:1));
      return `<div class="tile ${d?'done':''}"><span class="rar" style="color:var(--kelp)">${b.type==='shiny'?'Shiny hunt':b.type==='trophy'?'Trophy hunt':'Style hunt'}</span><h4>${esc(bt.what)}</h4><div class="meta">${bt.where} · ${b.type==='style'?Math.min(b.have,b.n)+' / '+b.n:(d?'Done':'Not yet')}</div>
       <div class="row spread"><span class="val"><span class="coin">${fmt(rw)}</span> + ${b.scales} Scales</span>${d?`<button class="btn" data-act="claim" data-i="${i}">Claim</button>`:`<button class="btn alt" data-act="reroll" data-i="${i}" ${S.money>=Math.ceil(b.reward*.1)?'':'disabled'}>Swap · <span class="coin">${fmt(Math.ceil(b.reward*.1))}</span></button>`}</div></div>`; }
    const sp=SPI[b.sp], d=bDone(b), L=LOCS[locIdx(sp.loc)];
    const what = b.type==='count' ? `Catch ${b.n} × ${sp.name}` : `Catch ${/^[aeiou]/i.test(sp.name)?"an":"a"} ${sp.name} of ${kgStr(b.kg)} or more`;
    const prog = b.type==='count' ? `${Math.min(b.have,b.n)} / ${b.n}` : (d?'Done':'Not yet');
    return `<div class="tile ${d||b.legend?'done':''}">${b.legend?'<span class="rar" style="color:var(--gold)">Legendary bounty</span>':''}<canvas width="220" height="90" data-fish="${sp.id}" data-known="${S.journal[sp.id]?1:0}" style="width:110px;height:45px"></canvas><h4>${S.journal[sp.id]||!b.legend?what:'Catch the legend of '+L.name}</h4>
    <div class="meta">${L.name}${sp.time!=='any'?' · '+(sp.time==='night'?'night only':'day only'):''} · ${RAR[sp.r].k} · ${prog}</div>
    <div class="row spread"><span class="val coin">${fmt(b.reward*coinMult())}</span>
    ${d?`<button class="btn" data-act="claim" data-i="${i}">Claim</button>`:`<button class="btn alt" data-act="reroll" data-i="${i}" ${S.money>=Math.ceil(b.reward*.1)?'':'disabled'}>Swap · <span class="coin">${fmt(Math.ceil(b.reward*.1))}</span></button>`}</div></div>`; }).join('')+'</div>';
  paintFish(P);
}
function renderFeats(P){ const done=FEATS.filter(f=>S.feats[f.id]).length;
  P.innerHTML=`<h2>Feats</h2><p class="sub">${done} of ${FEATS.length} done. Each pays coins, the bigger ones give bonus skill points, and two bring a new pet.</p><div class="grid">`+
  FEATS.map(f=>{ const [a,b]=f.p(), ok=!!S.feats[f.id]; return `<div class="tile ${ok?'done':''}"><div class="row spread"><h4>${f.name}</h4><span class="meta">${ok?'Done':fmt(Math.min(a,b))+' / '+fmt(b)}</span></div>
    <div class="meta">${f.d}</div><div class="prog"><i style="width:${Math.min(1,a/b)*100}%"></i></div>
    <div class="val" style="font-size:14px"><span class="coin">${fmt(f.coins)}</span>${f.pt?` · +${f.pt} skill point${f.pt>1?'s':''}`:''}${f.pet?' · pet: '+PETI[f.pet].name:''}</div></div>`; }).join('')+'</div>';
}
function renderJournal(P){
  const total=Object.keys(S.journal).length; if(!encLoc) encLoc=S.loc;
  const chips=[...LOCS.map(L=>[L.id,L.name+' '+caughtAt(L.id)+'/'+spAt(L.id).length]),['junk','Oddities '+nJunkKinds()+'/'+JUNK.length]].map(([k,n])=>`<button class="chipb" data-act="encloc" data-k="${k}" aria-pressed="${encLoc===k}">${n}</button>`).join('');
  let body='';
  if(encLoc==='junk'){
    body=`<p class="sub">Things humanity dropped in the water. Some pay, some boost your fishing, some come with a pet or a hat.</p><div class="jgrid">`+JUNK.map(J=>{ const n=S.junk[J.id]||0; return `<div class="jcard" style="cursor:default"><canvas width="200" height="100" data-junk="${J.id}" data-known="${n?1:0}"></canvas>
      <b style="color:${n?(J.t>=2?'var(--gold)':'var(--ink)'):'var(--muted)'}">${n?esc(J.name):'???'}</b><small>${['Junk','Odd junk','Rare find','Treasure'][J.t]}${n?' · ×'+n:''}</small></div>`; }).join('')+'</div>';
  } else {
    const L=LOCS[locIdx(encLoc)], list=spAt(L.id).slice().sort((a,b)=>a.r-b.r||a.base-b.base), got=caughtAt(L.id), open=S.unlocked.includes(L.id); const sel=encSel && SPI[encSel] && SPI[encSel].loc===L.id ? SPI[encSel] : null;
    let det='';
    if(sel){ const j=S.journal[sel.id], ae=aqBase(sel.id), B=BEH[sel.beh];
      det=`<div class="tile detail" style="margin-top:10px"><canvas width="440" height="220" data-fish="${sel.id}" data-known="${j?1:0}" data-sh="${j&&j.sh?1:0}"></canvas><div>
      <div class="rar" style="color:${RAR[sel.r].c}">${RAR[sel.r].k}${j&&j.pr?' · <span class="sh">✦✦ prismatic caught</span>':j&&j.sh?' · <span class="sh">✦ shiny caught</span>':''}${j&&j.tr?' · trophy caught':''}</div>
      <h2>${j?sel.name:'Not caught yet'}</h2><p class="sub">${j?sel.note:'Keep fishing '+L.name+(sel.time!=='any'?' at '+(sel.time==='night'?'night':'day'):'')+'.'}</p>
      <div class="kv" style="margin-top:8px"><div><span>Heaviest</span> ${j&&j.best?kgStr(j.best):'—'}</div><div><span>Smallest</span> ${j&&j.min!=null?kgStr(j.min):'—'}</div>${j&&j.hb!=null?`<div><span>Hybrid heaviest</span> <span class="sh">${kgStr(j.hb)}</span></div><div><span>Hybrid lightest</span> <span class="sh">${kgStr(j.hs)}</span></div>`:''}<div><span>Best sale value</span> ${j&&j.bv?'<span class="coin">'+fmt(j.bv)+'</span>':'—'}</div><div><span>Times caught</span> ${j?fmt(j.n):0}</div>
      <div><span>Size range</span> ${kgStr(sel.min)}–${kgStr(sel.max)}</div><div><span>Active</span> ${sel.time==='any'?'Day and night':sel.time==='night'?'Night only':'Day only'}</div><div><span>Strength</span> ${sel.str}</div>
      <div><span>Mastery</span> <span class="sh">${starStr(mastery(sel.id))}</span> +${mastery(sel.id)*10}%${mastery(sel.id)<4?` · next at ${MASTERY[mastery(sel.id)]}`:''}</div>
      <div><span>Fights like a</span> ${B.n.toLowerCase()}</div><div><span>Temper</span> ${'●'.repeat(Math.round(sel.aggr*5))+'○'.repeat(5-Math.round(sel.aggr*5))}</div><div><span>In the aquarium</span> ${ae?fmtB(ae.k,ae.v):'—'}</div>
      ${j&&j.first?`<div><span>First caught</span> ${new Date(j.first).toLocaleDateString()}</div>`:''}</div><p class="sub" style="margin-top:6px">${B.d}</p></div></div>`; }
    body=`<div class="row spread" style="margin-top:6px"><span class="sub">${got} / ${list.length} found${S.setDone[L.id]?' · complete':` · find them all for <span class="coin">${fmt(L.bonus)}</span>`}${open?'':' · water locked'}</span><span class="sub">Click a fish for its records</span></div>
      <div class="prog"><i style="width:${got/list.length*100}%"></i></div>${det}
      <div class="jgrid">${list.map(s=>{ const j=S.journal[s.id]; return `<button class="jcard ${encSel===s.id?'sel':''}" data-act="enc" data-k="${s.id}"><canvas width="200" height="100" data-fish="${s.id}" data-known="${j?1:0}" data-sh="${j&&j.sh?1:0}"></canvas>
        <b style="color:${j?RAR[s.r].c:'var(--muted)'}">${j?s.name:'???'}${j&&j.sh?' <span class="sh">✦</span>':''}</b><small>${RAR[s.r].k}${s.time!=='any'?' · '+(s.time==='night'?'night':'day'):''}</small>
        <small>${j?`Record ${kgStr(j.best||j.hb||0)}${j.tr?' 🏆':''}`:(open?'Not caught yet':'Locked')}</small>${j?`<small class="sh">${starStr(mastery(s.id))}</small>`:''}</button>`; }).join('')}</div>`;
  }
  const ts=totalStars(), rk=anglerRank();
  P.innerHTML=`<div class="tile" style="flex-direction:row;align-items:center;justify-content:space-between;gap:12px;margin-bottom:12px"><div><div class="rar" style="color:var(--gold)">Angler rank ${rk}</div><b>${ts} mastery stars</b> <span class="meta">· +${rk}% to every sale</span>
    <div class="meta">Catch a species 3, 10, 30 and 100 times for its stars. Each star adds +10% to that fish’s value. Every 8 stars is a new rank, with coins and a free Mystery Crate.</div></div>
    <div style="min-width:120px"><div class="meta">Next rank: ${ts%8} / 8 stars</div><div class="prog"><i style="width:${ts%8/8*100}%"></i></div></div></div>
  <div class="row spread"><div><h2>Encyclopedia</h2><p class="sub">${total} of ${SP.length} species found · ${fmt(S.stats.caught)} fish landed · ${S.stats.shiny} shiny · ${S.stats.treasure} junk · ${fmt(S.stats.earned)} coins earned · ${S.stats.snapped} lines snapped</p></div></div>
  <div class="chips" style="margin-top:10px">${chips}</div>${body}
  <div class="jsec"><span class="sub">Best streak ${S.stats.bestStreak} · ${S.stats.perfect} perfect hooks · ${S.stats.hot} hotspot catches · voyage ${S.tides+1}</span></div>`;
  paintFish(P); P.querySelectorAll('canvas[data-junk]').forEach(c=>{ const cx=c.getContext('2d'); cx.clearRect(0,0,c.width,c.height); if(c.dataset.known==='1') drawJunk(cx,c.width,c.height,c.dataset.junk,null); else mysteryThumb(cx,c.width,c.height,c.dataset.junk); });
}
function renderMap(P){
  P.innerHTML=`<h2>Waters</h2><p class="sub">Unlock new waters with coins once you have found ${LOCS[1].need} species in the one before. Each has ${spAt('pond').length} fish of its own, its own junk and treasure, and is tougher than the last.</p><div class="grid">`+
  LOCS.map((L,i)=>{ const open=S.unlocked.includes(L.id), here=S.loc===L.id; const prev=i?LOCS[i-1]:null; const met=!prev||caughtAt(prev.id)>=L.need; const sps=spAt(L.id);
    const btn = here ? '<button class="btn alt" disabled>Fishing here</button>' : open ? `<button class="btn" data-act="goto" data-k="${L.id}" ${G.st==='idle'?'':'disabled'}>Travel here</button>`
      : `<button class="btn" data-act="unlock" data-k="${L.id}" ${met&&S.money>=locCost(L)&&(!prev||S.unlocked.includes(prev.id))?'':'disabled'}>Unlock · <span class="coin">${fmt(locCost(L))}</span></button>`;
    return `<div class="tile loc ${here?'here':''}"><div class="sw2" style="background:linear-gradient(${L.sky[0]},${L.sky[1]} 48%,${L.water[0]} 52%,${L.water[1]})"></div>
    <h4>${L.name}</h4><div class="meta">${L.blurb}</div><div class="meta">Depth ${L.depth} · ${caughtAt(L.id)}/${sps.length} species · strength ${Math.min(...sps.map(s=>s.str))}–${Math.max(...sps.map(s=>s.str))}</div>
    ${!open&&prev?`<div class="meta" style="color:${met?'var(--kelp)':'var(--muted)'}">${met?'✓':'·'} ${Math.min(caughtAt(prev.id),L.need)} / ${L.need} species found at ${prev.name}</div>`:''}${btn}</div>`; }).join('')+'</div>'+renderVoyage()+relicHTML();
}
const canRetire = () => S.unlocked.includes('trench') && pearlsFor() > 0 && G.st==='idle';
function renderVoyage(){ const n=pearlsFor(), ok=canRetire();
  const box = confirmBox==='retire' ? `<div class="tile" style="border-color:var(--danger)"><h4>Set sail again?</h4>
    <div class="meta">You lose your coins, tackle, bait, cooler fish, bounties and every water except Willow Pond. You keep your level, skills, encyclopedia, feats, aquarium, pets, hats, clothes and Wisdom Pearls.</div>
    <div class="row"><button class="btn" data-act="retireok">Set sail with +${n} pearl${n===1?'':'s'}</button><button class="btn alt" data-act="cancel">Keep fishing</button></div></div>` : '';
  return `<div class="jsec"><h2>Set sail again</h2><p class="sub">Once you reach Hollow Trench you can start over from Willow Pond with Wisdom Pearls. Each pearl adds +25% to all coins and XP and a little to your rare odds, forever. Pearls are hard to earn: the more coins you earn in a voyage, the more you get. More coins earned this voyage means more pearls.</p>
  <div class="grid"><div class="tile"><div class="row spread"><h4>Voyage ${S.tides+1}</h4><span class="meta">${S.pearls} pearl${S.pearls===1?'':'s'} · +${Math.round((coinMult()-1)*100)}% now</span></div>
  <div class="meta">Coins earned this voyage: <span class="coin">${fmt(S.stats.runEarned)}</span>. Next pearl at <span class="coin">${fmt(Math.pow(n+1,2)*PEARL_DIV)}</span>. Boardwalk winnings count for at most a quarter of it.</div>
  <div class="val">Setting sail now gives +${n} pearl${n===1?'':'s'}</div>
  <button class="btn" data-act="retire" ${ok&&!confirmBox?'':'disabled'}>${S.unlocked.includes('trench')?(n?'Set sail again':'Earn more coins first'):'Reach Hollow Trench first'}</button></div>${box}</div></div>`; }

// ---------- wardrobe ----------
function shopOffers(){ const slot=Math.floor(Date.now()/1000/SHOP_LEN);
  const pool=[...SHOP_COLS.map(c=>({kind:'col',id:c[0],name:c[1],price:c[2]})), ...PATTERNS.filter(p=>p[2]).map(p=>({kind:'pat',id:p[0],name:p[1]+' fabric',price:p[2]})), ...HATS.filter(h=>h.src==='shop').map(h=>({kind:'hat',id:h.id,name:h.name,price:h.price})),
    ...OUTFITS.filter(o=>o[3]==='shop').map(o=>({kind:'out',id:o[0],name:o[1],price:o[2]})), ...GLASSES.filter(g2=>g2[2]).map(g2=>({kind:'gls',id:g2[0],name:g2[1],price:g2[2]})),
    ...SHOES.filter(x=>x[3]==='shop').map(x=>({kind:'shoe',id:x[0],name:x[1],price:x[2]})), ...NECKS.filter(x=>x[3]==='shop').map(x=>({kind:'neck',id:x[0],name:x[1],price:x[2]})), ...BACKS.filter(x=>x[3]==='shop').map(x=>({kind:'back',id:x[0],name:x[1],price:x[2]}))];
  const out=[], idx=[...pool.keys()]; let h=hashStr('shop'+slot); while(out.length<8&&idx.length){ h=Math.imul(h^(h>>>13),1597334677)>>>0; out.push(pool[idx.splice(h%idx.length,1)[0]]); } return out.sort((a,b)=>a.price-b.price); }
const ownedOffer = o => o.kind==='shoe'?S.owned.shoes.includes(o.id):o.kind==='neck'?S.owned.necks.includes(o.id):o.kind==='back'?S.owned.backs.includes(o.id):o.kind==='col'?S.owned.cols.includes(o.id):o.kind==='pat'?S.owned.pats.includes(o.id):o.kind==='out'?S.owned.outfits.includes(o.id):o.kind==='gls'?S.owned.glasses.includes(o.id):S.owned.hats.includes(o.id);
function renderStyle(P){ const lk=S.look, cols=[...FREE_COLS,...S.owned.cols];
  const sw=(k,list)=>`<div class="chips">${list.map(cl=>`<button class="sw" data-act="look" data-k="${k}" data-v="${cl}" aria-pressed="${lk[k]===cl}" style="background:${cl}" title="${cl}"></button>`).join('')}</div>`;
  const pats=PATTERNS.filter(p=>S.owned.pats.includes(p[0])).map(p=>`<button class="chipb" data-act="look" data-k="pat" data-v="${p[0]}" aria-pressed="${lk.pat===p[0]}">${p[1]}</button>`).join('');
  const hats=HATS.filter(h=>S.owned.hats.includes(h.id)).map(h=>`<button class="hatb" data-act="look" data-k="hat" data-v="${h.id}" aria-pressed="${lk.hat===h.id}"><canvas width="112" height="112" data-hat="${h.id}"></canvas>${esc(h.name)}</button>`).join('');
  const offers=shopOffers().map(o=>{ const own=ownedOffer(o); return `<div class="tile offer" style="flex-direction:row;align-items:center;gap:10px"><canvas width="128" height="128" data-offer="${o.kind}:${o.id}"></canvas>
    <div style="min-width:0;flex:1"><h4>${esc(o.name)}</h4><div class="meta">${o.kind==='col'?'Colour for shirts, trousers and hats':o.kind==='pat'?'Fabric for shirts and some outfits':o.kind==='shoe'?'Shoes':o.kind==='neck'?'Neckwear':o.kind==='back'?'Worn on your back':o.kind==='out'?'Outfit':o.kind==='gls'?'Glasses':'Hat'}</div>
    ${own?'<button class="btn alt sm" disabled>Owned</button>':`<div class="row" style="gap:4px"><button class="btn alt sm" data-act="tryon" data-k="${o.kind}:${o.id}">${PREVIEW&&PREVIEW.kind===o.kind&&PREVIEW.id===o.id?'Wearing it':'Try on'}</button><button class="btn sm" data-act="buyoffer" data-k="${o.kind}:${o.id}" ${S.money>=o.price?'':'disabled'}>Buy · <span class="coin">${fmt(o.price)}</span></button></div>`}</div></div>`; }).join('');
  const fishHats=HATS.filter(h=>h.src==='fish'), gotFish=fishHats.filter(h=>S.owned.hats.includes(h.id)).length;
  P.innerHTML=`<h2>Wardrobe</h2><p class="sub">Dress your angler. New colours, fabrics and hats rotate through the clothing shop, and rare hats can be fished out of the water (${gotFish} of ${fishHats.length} found).</p>
  <div class="stylewrap"><div class="preview">${previewBarHTML()}<canvas id="lookcv" width="520" height="560"></canvas></div><div>
    <h5>Body</h5><div class="chips"><button class="chipb" data-act="look" data-k="g" data-v="m" aria-pressed="${lk.g==='m'}">Man</button><button class="chipb" data-act="look" data-k="g" data-v="f" aria-pressed="${lk.g==='f'}">Woman</button></div>
    <h5>Build</h5><div class="chips">${BUILDS.map(([k,n])=>`<button class="chipb" data-act="look" data-k="build" data-v="${k}" aria-pressed="${(lk.build||'average')===k}">${n}</button>`).join('')}</div>
    <h5>Skin</h5>${sw('skin',SKINS.map((_,i)=>i)).replace(/data-v="(\d)"([^>]*)style="background:\d"/g,(m,i,mid)=>`data-v="${i}"${mid}style="background:${SKINS[i]}"`).replace(/aria-pressed="(true|false)"/g,(m)=>m)}
    <h5>Hair</h5>${sw('hair',HAIRS.map((_,i)=>i)).replace(/data-v="(\d)"([^>]*)style="background:\d"/g,(m,i,mid)=>`data-v="${i}"${mid}style="background:${HAIRS[i]}"`)}
    <h5>Eyes</h5><div class="chips">${EYES.map(([cl,n],i)=>`<button class="sw" data-act="look" data-k="eye" data-v="${i}" aria-pressed="${(lk.eye|0)===i}" style="background:${cl}" title="${n}"></button>`).join('')}</div>
    <h5>Hairstyle</h5><div class="chips">${HAIRSTYLES.map(([k,n])=>`<button class="chipb" data-act="look" data-k="hairStyle" data-v="${k}" aria-pressed="${(lk.hairStyle||'auto')===k}">${n}</button>`).join('')}</div>
    <h5>Facial hair</h5><div class="chips">${BEARDS.map(([k,n])=>`<button class="chipb" data-act="look" data-k="beard" data-v="${k}" aria-pressed="${(lk.beard||'none')===k}">${n}</button>`).join('')}</div>
    <h5>Glasses</h5><div class="chips">${GLASSES.filter(x=>S.owned.glasses.includes(x[0])).map(([k,n])=>`<button class="chipb" data-act="look" data-k="glasses" data-v="${k}" aria-pressed="${(lk.glasses||'none')===k}">${n}</button>`).join('')}</div>
    <h5>Shirt colour</h5>${sw('shirt',cols)}<h5>Shirt fabric</h5><div class="chips">${pats}</div>
    <h5>Outfit</h5><div class="chips">${OUTFITS.filter(x=>S.owned.outfits.includes(x[0])).map(([k,n])=>`<button class="chipb" data-act="look" data-k="outfit" data-v="${k}" aria-pressed="${(lk.outfit||'none')===k}">${n}</button>`).join('')}</div>
    ${lk.outfit&&lk.outfit!=='none'&&lk.outfit!=='spacesuit'?'<h5>Outfit colour</h5>'+sw('outCol',cols):''}
    <h5>Trousers</h5>${sw('pants',cols)}
    <h5>Shoes</h5><div class="chips">${SHOES.filter(x=>S.owned.shoes.includes(x[0])).map(([k,n])=>`<button class="chipb" data-act="look" data-k="shoes" data-v="${k}" aria-pressed="${(lk.shoes||'boots')===k}">${n}</button>`).join('')}</div>
    <h5>Neckwear</h5><div class="chips">${NECKS.filter(x=>S.owned.necks.includes(x[0])).map(([k,n])=>`<button class="chipb" data-act="look" data-k="neck" data-v="${k}" aria-pressed="${(lk.neck||'none')===k}">${n}</button>`).join('')}</div>
    <h5>On your back</h5><div class="chips">${BACKS.filter(x=>S.owned.backs.includes(x[0])).map(([k,n])=>`<button class="chipb" data-act="look" data-k="back" data-v="${k}" aria-pressed="${(lk.back||'none')===k}">${n}</button>`).join('')}</div>
    ${(lk.neck&&lk.neck!=='none')||(lk.back&&lk.back!=='none')?'<h5>Accessory colour</h5>'+sw('accCol',cols):''}
    <h5>Hat</h5><div class="hatgrid">${hats}</div>
    <h5>Hat colour ${HATI[lk.hat]&&HATI[lk.hat].fixed?'<span style="text-transform:none;letter-spacing:0">(this hat keeps its own colours)</span>':''}</h5>${sw('hatCol',cols)}
  </div></div>
  <div class="jsec"><div class="row spread"><h2>Clothing shop</h2><span class="sub">New stock in <b id="shopleft">${mmss(Math.ceil(SHOP_LEN-(Date.now()/1000%SHOP_LEN)))}</b></span></div><div class="grid">${offers}</div></div>`;
  P.querySelectorAll('.sw[data-k="skin"],.sw[data-k="hair"],.sw[data-k="eye"]').forEach(b=>{ b.setAttribute('aria-pressed', String(String(lk[b.dataset.k])===b.dataset.v)); });
  drawLookPreview();
  P.querySelectorAll('canvas[data-hat]').forEach(c=>{ const cx=c.getContext('2d'); cx.clearRect(0,0,c.width,c.height); hatPreview(cx,c.width,c.height,c.dataset.hat,lk.hatCol); });
  P.querySelectorAll('canvas[data-offer]').forEach(c=>{ const [kind,id]=c.dataset.offer.split(':'); const cx=c.getContext('2d'); cx.clearRect(0,0,128,128);
    if(kind==='col'){ cx.fillStyle=id; cx.beginPath(); cx.arc(64,64,42,0,7); cx.fill(); cx.strokeStyle='#23434e'; cx.lineWidth=3; cx.stroke(); }
    else if(kind==='pat'){ cx.save(); cx.translate(64,20); cx.scale(4,4); cx.fillStyle=lk.shirt; cx.beginPath(); cx.moveTo(-9,0); cx.lineTo(9,0); cx.lineTo(8,24); cx.lineTo(-8,24); cx.closePath(); cx.fill(); cx.clip(); drawPattern(cx,id,lk.shirt,-10,-1,20,26); cx.restore(); }
    else if(kind==='shoe'||kind==='neck'||kind==='back') wearPreview(cx,kind,id,128,128);
    else if(kind==='out') drawAngler(cx,64,124,1.75,Object.assign({},lk,{outfit:id,hat:'none'}),{});
    else if(kind==='gls'){ cx.save(); cx.translate(64,150); cx.scale(2.4,2.4); drawAngler(cx,0,0,1,Object.assign({},lk,{glasses:id,hat:'none'}),{}); cx.restore(); }
    else hatPreview(cx,128,128,id,lk.hatCol); });
}
function drawLookPreview(){ const c=$('lookcv'); if(!c) return; const cx=c.getContext('2d'); cx.clearRect(0,0,c.width,c.height);
  if(V3ON) v3Pedestal(cx,250,470,215,performance.now()/1000); else { cx.fillStyle='#6b4a2e'; cx.fillRect(0,470,520,22); cx.fillStyle='#4a3220'; cx.fillRect(60,492,20,70); cx.fillRect(420,492,20,70); cx.fillStyle='#7c5838'; for(let x=0;x<520;x+=40) cx.fillRect(x,470,3,22); }
  { const big=S.pet==='horse'||S.pet==='cow', s=6.4; drawPetStyled(cx,S.pet,Math.max(big?120:70,300-(big?44:31)*s),470,s*(big?.85:1),performance.now()/1000); } drawAngler(cx,300,470,6.4,previewLook(),{t:performance.now()/1000}); }
// ---------- pets ----------
function renderPets(P){ const pp=PETI[S.pet];
  P.innerHTML=`<h2>Pets</h2><p class="sub">Two pets can come fishing with you. Your <b style="color:#ffc94d">★ favourite</b> is always by your side, gives its full bonus and bonds twice as fast. Your <b>companion</b> tags along for half its bonus, a little more as you bond. Some pets are sold here, some are hiding in junk you fish up, and a few join you after big feats. ${S.owned.pets.filter(id=>PETI[id].src!=="gift").length} of ${PETS.filter(p=>p.src!=="gift").length} found.</p>
  ${petCustomHTML()}
  <div class="grid">`+PETS.filter(p=>p.src!=='gift'||S.owned.pets.includes(p.id)).map(p=>{ const own=S.owned.pets.includes(p.id), here=S.pet===p.id, comp=S.pet2===p.id; const val=p.v*(1+.1*pr('petpal'));
    const act = here ? '<button class="btn alt" disabled>★ Favourite</button>'
      : comp ? `<div class="row" style="gap:6px;flex-wrap:wrap"><button class="btn sm" data-act="pet" data-k="${p.id}">★ Make favourite</button><button class="btn sm alt" data-act="pet2off">Send home</button></div>`
      : own ? `<div class="row" style="gap:6px;flex-wrap:wrap"><button class="btn sm" data-act="pet" data-k="${p.id}">★ Favourite</button><button class="btn sm alt" data-act="pet2" data-k="${p.id}">Companion</button></div>`
      : p.src==='shop' ? `<button class="btn" data-act="buypet" data-k="${p.id}" ${S.money>=p.price?'':'disabled'}>Adopt · <span class="coin">${fmt(p.price)}</span></button>` : `<span class="meta">How to get it: ${esc(petHint(p))}</span>`;
    return `<div class="tile ${here||comp?'done':''}"><canvas width="240" height="140" data-pet="${p.id}" data-own="${own?1:0}" style="width:120px;height:70px;cursor:default"></canvas><h4>${own?esc(petName(p.id)):p.src==='shop'?p.name:'???'}${own&&bondLevel(p.id)?` <span class="meta" style="color:#ff6a9a">♥${bondLevel(p.id)}</span>`:''}</h4>
      <div class="meta">${own||p.src==='shop'?esc(p.d)+' ':''}<span class="aq">${fmtB(p.k,val)}</span></div>${act}</div>`; }).join('')+'</div>';
  paintPetCustom();
  P.querySelectorAll('canvas[data-pet]').forEach(c=>{ const cx=c.getContext('2d'); cx.clearRect(0,0,c.width,c.height); const bigp=c.dataset.pet==='horse'||c.dataset.pet==='cow'; if(c.dataset.own==='1') drawPetStyled(cx,c.dataset.pet,120,128,bigp?2.6:4.4,0); else if(PETI[c.dataset.pet].src==='shop') drawPet(cx,c.dataset.pet,120,128,bigp?2.6:4.4,0);
    else mysteryThumb(cx,c.width,c.height,c.dataset.pet); });
}

// ---------- save codes ----------
let pendingLoad=null;
async function makeCode(){ const json=JSON.stringify(S);
  try{ if(window.CompressionStream){ const st=new Blob([json]).stream().pipeThrough(new CompressionStream('deflate-raw')); const buf=new Uint8Array(await new Response(st).arrayBuffer()); let bin=''; for(let i=0;i<buf.length;i+=0x8000) bin+=String.fromCharCode.apply(null,buf.subarray(i,i+0x8000)); return 'DL1:'+btoa(bin); } }catch(e){}
  return 'DL0:'+btoa(unescape(encodeURIComponent(json))); }
async function readCode(code){ code=String(code).trim().replace(/\s+/g,''); const tag=code.slice(0,4), bin=atob(code.slice(4));
  if(tag==='DL1:'){ const u=Uint8Array.from(bin,ch=>ch.charCodeAt(0)); const st=new Blob([u]).stream().pipeThrough(new DecompressionStream('deflate-raw')); return JSON.parse(await new Response(st).text()); }
  if(tag==='DL0:') return JSON.parse(decodeURIComponent(escape(bin))); throw new Error('not a Driftline code'); }
function renderSave(P){ const isApp=window.matchMedia && matchMedia('(display-mode: standalone)').matches;
  P.innerHTML=`<h2>Save and load</h2><p class="sub">Your progress saves by itself on this device. Moving to another phone or computer? Use Send and Get progress below with a 6-digit code. The save code underneath is a backup.</p>${linkHTML()}
  <div class="grid"><div class="tile"><h4>Your save code</h4><div class="meta">Level ${S.lvl} · ${fmt(S.money)} coins · ${Object.keys(S.journal).length} species · last saved ${S.savedAt?new Date(S.savedAt).toLocaleString():'never'}</div>
    <textarea id="savecode" readonly rows="4" aria-label="Your save code">Making your code…</textarea><div class="row"><button class="btn" data-act="copysave">Copy save code</button></div></div>
  <div class="tile"><h4>Load a save code</h4><div class="meta">Paste a code from another device. It replaces the progress on this one.</div><textarea id="loadcode" rows="4" placeholder="Paste a code that starts with DL" aria-label="Save code to load"></textarea>
    ${pendingLoad?`<div class="meta" style="color:var(--danger)">Replace this device’s progress with level ${pendingLoad.lvl}, ${fmt(pendingLoad.money||0)} coins, ${Object.keys(pendingLoad.journal||{}).length} species?</div><div class="row"><button class="btn" data-act="loadok" style="background:var(--danger)">Replace progress</button><button class="btn alt" data-act="cancel">Cancel</button></div>`
    :`<div class="row"><button class="btn alt" data-act="loadsave">Load code</button></div>`}</div>
  ${window.DL_DESKTOP?'<div class="tile"><h4>Desktop app</h4><div class="meta">You’re playing the Driftline desktop app. It updates itself and keeps your progress on this PC.</div></div>':''}
  ${window.DL_VERSION&&!window.DL_DESKTOP?'<div class="tile"><h4>Windows desktop app</h4><div class="meta">A real program with its own window and Start-menu icon. Updates itself.</div><a class="btn" href="download/Driftline-Setup.zip" download style="text-decoration:none;text-align:center">Download for Windows</a><div class="meta">Unzip it and run <b>Driftline.exe</b>. If Windows shows “protected your PC”, click <b>More info</b>, then <b>Run anyway</b>. Your browser progress doesn’t carry over automatically: copy a save code here and load it in the app.</div></div>':''}
  ${window.DL_VERSION&&!window.DL_DESKTOP?'':'<!--'}<div class="tile"><h4>Install as an app</h4><div class="meta">${isApp?'You are playing the installed app. It updates itself when a new version is out.':'Get a home-screen icon, full-screen play and offline fishing. It updates itself.'}</div>
    ${isApp?'':window.__dlInstallPrompt?'<button class="btn" data-act="install">Install Driftline</button>':'<div class="meta">iPhone: Share, then <b>Add to Home Screen</b>. Android, Windows or Mac in Chrome or Edge: the install icon in the address bar, or the menu, then <b>Install</b>.</div>'}</div>${window.DL_VERSION&&!window.DL_DESKTOP?'':'-->'}</div>
  ${window.DL_VERSION?`<p class="sub" style="margin-top:10px">Version ${esc(window.DL_VERSION)}</p>`:''}`;
  makeCode().then(c=>{ const t=$('savecode'); if(t) t.value=c; }); paintLink(); }

$('panel').addEventListener('click',e=>{ const b=e.target.closest('[data-act]'); if(!b||b.disabled) return; const k=b.dataset.k, i=+b.dataset.i;
  switch(b.dataset.act){
    case 'copysave': { const t=$('savecode'); if(!t||!t.value.startsWith('DL')) return; (navigator.clipboard?navigator.clipboard.writeText(t.value):Promise.reject()).then(()=>toast('Save code copied')).catch(()=>{ t.focus(); t.select(); toast('Press Ctrl+C (or long-press, Copy) to copy the code'); }); return; }
    case 'loadsave': { const v=codeFromAny(($('loadcode')||{}).value||''); readCode(v).then(o=>{ if(!o||typeof o!=='object'||!o.journal) throw 0; pendingLoad=o; renderPanel(); }).catch(()=>toast('That code didn’t work. Copy the whole thing and try again.')); return; }
    case 'loadok': { if(!pendingLoad) return; S=migrate(pendingLoad); pendingLoad=null; G.st='idle'; $('card').hidden=true; S.tab='save'; offlineIncome(); fillBounties(); toast('Progress loaded. Welcome back!'); break; }
    case 'install': { const ip=window.__dlInstallPrompt; if(!ip) return; ip.prompt(); ip.userChoice.finally(()=>{ window.__dlInstallPrompt=null; renderPanel(); }); return; }
    case "sellall": { const sell=S.cooler.filter(f=>!sellKeep(f)); if(!sell.length) return; const tot=earn(sell.reduce((a,f)=>a+salePrice(f),0)); S.cooler=S.cooler.filter(f=>sellKeep(f)); sfx.coin(); toast('Sold '+sell.length+' fish for '+fmt(tot)+' coins'+(S.cooler.length?' (rare fish kept)':'')+'. '+quip('sell')); break; }
    case 'sell': { const f=S.cooler[i]; if(!f) return; earn(salePrice(f)); S.cooler.splice(i,1); sfx.coin(); break; }
    case 'totank': { if(S.tank.length>=aqCap()) return; const f=S.cooler[i]; if(!f) return; accrue(); S.tank.push(f); S.cooler.splice(i,1); toast(SPI[f.id].name+' is on display'+(aqEff(f)?': '+aqTxt(f):'')); break; }
    case 'untank': { if(S.cooler.length>=gv('cooler')) return; const f=S.tank[i]; if(!f) return; accrue(); S.cooler.push(f); S.tank.splice(i,1); break; }
    case 'collect': { accrue(); const c=Math.floor(S.tankBank); if(c<1) return; earn(c); S.tankBank-=c; sfx.coin(); toast('Collected '+fmt(c)+' coins'); break; }
    case 'buytank': { const c=TANK_COST[S.tankSlots]; if(c==null||S.money<c) return; S.money-=c; S.tankSlots++; sfx.coin(); toast('Your tank grew: room for '+aqCap()+' fish'); break; }
    case 'perk': { const p=PERKS[k]; if(!p||ptsFree()<=0||pr(k)>=p.max) return; S.perks[k]=pr(k)+1; sfx.coin(); toast(p.name+' rank '+S.perks[k]); break; }
    case 'respec': { const c=50*S.lvl; if(S.money<c) return; S.money-=c; S.perks={}; toast('Skills reset. Points refunded.'); break; }
    case 'buygear': { const lv=S.gear[k], c=GEAR[k].cost[lv+1]; if(c==null||S.money<c) return; S.money-=c; S.gear[k]++; sfx.coin(); toast(GEAR[k].name+' upgraded to level '+(S.gear[k]+1)); break; }
    case 'buybait': { const bt=BAIT[k]; if(!bt||bt.junk||!(bt.pack>0)||!(bt.scales>0||bt.price>0)) return; if(bt.scales){ if(S.scales<bt.scales) return; S.scales-=bt.scales; S.bait[k]+=bt.pack; } else { const n=+b.dataset.n||1, cost=n>1?bt.price*4.5:bt.price; if(S.money<cost) return; S.money-=cost; S.bait[k]+=bt.pack*n; } if(S.baitSel==='worm') S.baitSel=k; sfx.coin(); toast('Bought '+bt.name); break; }
    case 'usebait': S.baitSel=k; break;
    case 'claim': { const bo=S.bounties[i]; if(!bo||!bDone(bo)) return; const paid=earn(bo.reward*coinMult()*(spec('collector')?.8:1)); if(bo.scales) S.scales+=bo.scales; S.bounties.splice(i,1); fillBounties(); sfx.coin(); toast('Bounty paid: '+fmt(paid)+' coins'+(bo.scales?' and '+bo.scales+' Scales':'')); break; }
    case 'retire': { if(!canRetire()) return; confirmBox='retire'; break; }
    case 'reset': confirmBox='reset'; break;
    case 'cancel': confirmBox=null; pendingLoad=null; break;
    case 'retireok': { if(!canRetire()) return; const n=pearlsFor(); S.pearls+=n; S.tides++;
      Object.assign(S,{money:relic('headstart')?25000:0, gear:relic('seasoned')?Object.fromEntries(Object.keys(GEAR).map(k=>[k,Math.min(2,GEAR[k].lv.length-1)])):fresh().gear, bait:relic('tacklebox')?S.bait:baitZero(), baitSel:relic('tacklebox')?S.baitSel:'worm', unlocked:['pond'], loc:'pond', cooler:[], bounties:[], setDone:{}, streak:0});
      S.stats.runEarned=0; S.stats.runBw=0; confirmBox=null; fillBounties(); sfx.catch(4); toast('You set sail again with '+S.pearls+' Wisdom Pearls: +'+Math.round((coinMult()-1)*100)+'% coins and XP, and better rare odds'); break; }
    case 'resetok': { S=fresh(); S.savedAt=Date.now(); confirmBox=null; G.st='idle'; encLoc=null; encSel=null; fillBounties(); toast('Progress reset. A fresh start at Willow Pond.'); break; }
    case 'reroll': { const bo=S.bounties[i]; const c=Math.ceil(bo.reward*.1); if(S.money<c) return; S.money-=c; const L=bo.loc||S.loc; S.bounties[i]=makeBounty2(L)||makeBounty(L); break; }
    case 'unlock': { const L=LOCS[locIdx(k)]; if(S.money<locCost(L)) return; S.money-=locCost(L); S.unlocked.push(k); S.loc=k; G.hot=null; fillBounties(); sfx.catch(2); toast('Welcome to '+L.name); break; }
    case 'goto': if(G.st!=='idle') return; S.loc=k; G.hot=null; toast('Travelled to '+LOCS[locIdx(k)].name); break;
    case 'encloc': encLoc=k; encSel=null; break;
    case 'bloc': bLoc=k; break;
    case 'enc': encSel = encSel===k ? null : k; break;
    case 'look': { const v=b.dataset.v; if(k==='skin'||k==='hair'||k==='eye') S.look[k]=+v; else if(k==='shoes'){ if(S.owned.shoes.includes(v)) S.look.shoes=v; } else if(k==='neck'){ if(S.owned.necks.includes(v)) S.look.neck=v; } else if(k==='back'){ if(S.owned.backs.includes(v)) S.look.back=v; } else if(k==='build'){ if(BUILDI[v]) S.look.build=v; } else if(k==='hat'){ if(S.owned.hats.includes(v)) S.look.hat=v; } else if(k==='pat'){ if(S.owned.pats.includes(v)) S.look.pat=v; }
      else if(k==='glasses'){ if(S.owned.glasses.includes(v)) S.look.glasses=v; } else if(k==='outfit'){ if(S.owned.outfits.includes(v)) S.look.outfit=v; } else S.look[k]=v; break; }
    case 'buyoffer': { const [kind,id]=k.split(':'); const o=shopOffers().find(x=>x.kind===kind&&x.id===id); if(!o||ownedOffer(o)||S.money<o.price) return; S.money-=o.price; S.stats.bought++; PREVIEW=null;
      if(kind==='shoe'){ S.owned.shoes.push(id); S.look.shoes=id; } else if(kind==='neck'){ S.owned.necks.push(id); S.look.neck=id; } else if(kind==='back'){ S.owned.backs.push(id); S.look.back=id; } else if(kind==='col') S.owned.cols.push(id); else if(kind==='pat'){ S.owned.pats.push(id); S.look.pat=id; } else if(kind==='out'){ S.owned.outfits.push(id); S.look.outfit=id; } else if(kind==='gls'){ S.owned.glasses.push(id); S.look.glasses=id; } else { S.owned.hats.push(id); S.look.hat=id; } sfx.coin(); toast('Bought '+o.name+'. Looking sharp.'); break; }
    case 'pet': if(S.owned.pets.includes(k)){ setFav(k); } break;
    case 'buypet': { const p=PETI[k]; if(!p||p.src!=='shop'||S.owned.pets.includes(k)||S.money<p.price) return; S.money-=p.price; S.owned.pets.push(k); setFav(k); sfx.coin(); toast('You adopted a '+p.name.toLowerCase()+'!'); break; }
    default: { if(extraAct(b)==='skip') return; }
  }
  checkFeats(); save(); refreshAll(); });

function renderBait(){ const sel=$('bait'); sel.innerHTML=Object.entries(BAIT).filter(([k])=>k==='worm'||S.bait[k]>0||S.baitSel===k||!BAIT[k].junk).map(([k,b])=>`<option value="${k}" ${S.baitSel===k?'selected':''} ${k!=='worm'&&S.bait[k]<=0?'disabled':''}>${b.name}${k==='worm'?'':' ('+S.bait[k]+')'}</option>`).join(''); }
$('bait').addEventListener('change',e=>{ S.baitSel=e.target.value; e.target.blur(); save(); if(S.tab==='shop') renderPanel(); });
$('settingsbtn').addEventListener('click',e=>{ e.currentTarget.blur(); startAudio(); setTab('settings'); $('panel').scrollIntoView({behavior:'smooth',block:'start'}); });
function refreshAll(){ lastHud=''; renderBait(); setTab(S.tab||'cooler'); hud(); }

// ---------- boot ----------
offlineIncome(); fillBounties(); ensureDaily(); accrueSpins(); checkFeats(); refreshAll(); requestAnimationFrame(frame); initCloud();
{ const gift=dailyLogin(); const veteran=S.stats.caught>0||S.savedAt; if(S.seenPatch!==GAME_VERSION){ S.seenPatch=GAME_VERSION; if(veteran) setTimeout(()=>showPatchNotes(PATCHES[0],gift),700); else if(gift) setTimeout(()=>toast(gift),1200); } else if(gift) setTimeout(()=>toast(gift),1200); save(); }
if(!S.stats.caught && !S.savedAt) setTimeout(()=>toast('Hold on the water to cast your first line'),600);
})();
</script>
