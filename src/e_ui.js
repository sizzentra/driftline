
// ---------- loop ----------
let last=performance.now();
function frame(now){ const dt=Math.min(.05,(now-last)/1000); last=now; try{ update(dt); draw(now); if(S.tab==='aquarium') drawTank(now); }catch(e){ if(!frame.err){ frame.err=1; console.error(e); } } hud(); requestAnimationFrame(frame); } /* 0.4.8.9.1: one failing frame never stops the game loop */
let lastBuffN=-1, lastShopSlot=Math.floor(Date.now()/1000/SHOP_LEN);
setInterval(()=>{ accrue(); const el=$('tankbank'); if(el){ const t=fmtShort(S.tankBank); if(el.textContent!==t){ el.textContent=t; el.title=fmt(S.tankBank)+' coins'; } } /* short form like the top bar, so big numbers never overflow (2026-11-19) */ const cb=$('collectbtn'); if(cb) cb.disabled=S.tankBank<1;
  const dl=$('dmleft'); if(dl){ dl.textContent=mmss(wxLeft()); if(wxLeft()>=WX_LEN-1 && S.tab==='cooler' && !(document.activeElement&&document.activeElement.tagName==='SELECT')) renderPanel(); } /* never redraw under an open menu (bug: the Sell rarity menu closed by itself, director 2026-11-23) */
  const t=Date.now(); const ended=S.buffs.filter(b=>b.until<=t); if(ended.length){ S.buffs=S.buffs.filter(b=>b.until>t); toast('Boost ended: '+ended.map(b=>b.src).join(', ')); save(); }
  const bn=activeBuffs().length; if(bn!==lastBuffN){ lastBuffN=bn; lastHud=''; }
  const sl=$('shopleft'); const slot=Math.floor(t/1000/SHOP_LEN); if(sl) sl.textContent=mmss(Math.ceil(SHOP_LEN-(t/1000%SHOP_LEN))); if(slot!==lastShopSlot){ lastShopSlot=slot; if(S.tab==='style') renderPanel(); } }, 1000);
setInterval(()=>{ if(S.tank.length||S.buffs.length) save(); }, 30000);

// ---------- HUD / hint ----------
let lastHud='';
function hud(){
  const p=phase(), nf=nextFlip(), wx=weather(), wl=wxLeft(); const key=[S.money,S.lvl,S.xp,S.loc,S.cooler.length,tod(p),nf.s,wx.k,wl,G.st,ptsFree(),lastBuffN].join('|');
  setHint();
  if(key===lastHud) return; lastHud=key;
  $('money').textContent=fmtShort(S.money); $('money').title=fmt(S.money)+' coins'; $('lvl').textContent=S.lvl; $('xpfill').style.width=(S.xp/xpNeed(S.lvl)*100)+'%';
  $('locname').textContent=curLoc().name; $('tod').textContent=tod(p); $('todnext').textContent=nf.label+' '+mmss(nf.s);
  $('wx').textContent=wxName(wx.k); $('wxnext').textContent='Changes in '+mmss(wl); $('wxchip').title=wx.note; $('wx').style.color = wx.k==='Gilded'?'var(--gold)':wx.k==='Storm'?'#9fb4ff':'';
  /* no weather notice on the fishing screen (director, 2026-11-21, TEXT_STANDARD: the scene chip and the badges already show it) */
  $('coolerct').textContent=S.cooler.length+' / '+gv('cooler'); $('coolerct').style.color = S.cooler.length>=gv('cooler') ? 'var(--danger)' : '';
  const ab=activeBuffs(); $('buffct').textContent=ab.length?ab.length+' active':'None'; $('buffct').style.color=ab.length?'var(--kelp)':'var(--muted)'; $('buffchip').title=ab.length?ab.map(b=>b.src+': '+fmtB(b.k,b.v)).join('\n'):'Fish up junk, spin the wheel or catch a falling star for boosts';
  const T=$('tabs'); const dot=n=>n?'<span class="dot">'+n+'</span>':'';
  const lab=k=>T.querySelector('[data-tab="'+k+'"]'); const setT=(k,n)=>{ const b=lab(k); if(!b) return; const h=tabHTML(b.dataset.label)+dot(n); if(b._tabH!==h){ b._tabH=h; b.innerHTML=h; } }; // only touch the button when its badge changed
  setT('cooler',S.cooler.length); setT('bounties',bountyReady()); setT('skills',ptsFree());
  setT('pass',S.pass?S.pass.lvl-S.pass.claimed:0); setT('quests',(typeof Q8==='object'&&Q8.goal().ready)?1:0); /* the Quests badge: 1 when your goal is ready (was its own timer) */ setT('paths',SPEC_TIERS.filter((T2,i)=>S.lvl>=T2.lvl&&!S.specs[i]).length);
}
let lastHint='';
function fmtShort(n){ n=Math.floor(n); if(n<100000) return fmt(n);
  // short forms round down like every other coin number (rounding to nearest showed 999,999 as "1000K")
  const tr=(v,d)=>{ const p=Math.pow(10,d); return (Math.floor(v*p+1e-6)/p).toFixed(d); };
  if(n<1e6) return tr(n/1e3,0)+'K'; if(n<1e9){ const v=n/1e6; return tr(v,v<10?2:1)+'M'; }
  /* 0.3.6: trillions and beyond keep a short form (7.7 trillion used to read "7700.00B") */ const U=['B','T','Qa','Qi','Sx','Sp','Oc','No','Dc']; let i=0, v=n/1e9; while(v>=1000&&i<U.length-1){ v/=1000; i++; } return tr(v,v<10?2:v<100?1:0)+U[i]; }
function setHint(){ let h='';
  switch(G.st){
    case 'idle': h = S.cooler.length>=gv('cooler') ? 'Cooler full. Sell in the <b>Cooler</b> or move fish to the <b>Aquarium</b>.' : G.hot ? 'A <b>hotspot</b>! Cast into it for rarer fish.' : (V3ON && S.settings.castMode==='aim') ? (PLAT.touch() ? '<b>Tap the water</b> to cast there.' : '<b>Click the water</b> to cast there (hold Space for power).') : PLAT.touch() ? '<b>Touch and hold</b> to charge, <b>let go</b> to cast.' : '<b>Hold</b> on the water (or Space) to charge, <b>release</b> to cast.'; break;
    case 'charging': h=(PLAT.touch()?'Let go':'Release')+' to cast. <b>Far casts</b> and <b>hotspots</b> bring better fish.'; break;
    case 'flying': h='&nbsp;'; break;
    case 'waiting': h='Twitches are nibbles. <b>Wait for the big splash.</b>'; break;
    case 'bite': h=PLAT.touch()?'<b>Now!</b> Tap to hook it.':'<b>Now!</b> Click or Space to hook it.'; break;
    case 'reeling': h=G.fish&&G.fish.kind!=='fish'?'<b>Reel</b> steadily. <b>Ease off</b> when it snags.':fishNew()?(V3ON?'<b>Hold</b> or <b>draw circles</b> to reel. <b>Short pulls</b> on runs and shakes.':'<b>Hold</b> to reel. <b>Short pulls</b> on runs and shakes, let go on <b>Careful…</b>'):V3ON?'<b>Hold</b> or <b>draw circles</b> to reel. <b>Let go</b> on runs, jumps, shakes and anger.':'<b>Hold</b> to reel. <b>Let go</b> when it runs, jumps, shakes or gets angry.'; break;
    case 'landing': h='Pulling it out…'; break;
    case 'result': h='Nice catch.'; break;
    case 'frenzy': h=PLAT.touch()?'<b>Tap the leaping fish!</b>':'<b>Click the leaping fish!</b>'; break;
    case 'event': h='&nbsp;'; break;
  } if(!S.settings.hints) h='&nbsp;'; if(h!==lastHint){ const el=$('hint'); el.innerHTML=h; el.style.visibility=h==='&nbsp;'?'hidden':''; lastHint=h; } } /* an empty hint keeps its space but draws no empty box (director, 2026-11-19: hints off left a blank circle) */
let toastT=0; function toast(m){ const el=$('toast'); el.textContent=m; el.classList.add('on'); clearTimeout(toastT); toastT=setTimeout(()=>el.classList.remove('on'),3200); }

// ---------- catch card ----------
function showCard(o){
  /* the last card's sparkle animation is let go first: it kept repainting a shiny or mythic fish over the next card's picture
     (batch 2: a Brass Spyglass card showed the fish caught before it). A fish card attaches its own again. */
  spkDrop($('cardfish')); o.draw($('cardfish')); $('cardin').classList.toggle('shiny',!!o.shiny);
  $('cardrar').textContent=o.rar; $('cardrar').style.color=o.rarCol; $('cardname').textContent=o.name;
  $('cardnums').innerHTML=o.nums.map(n=>`<div><span>${esc(n[0])}</span><b${n[2]?' class="coin"':''}>${esc(n[1])}</b></div>`).join('');
  if(o.html) $('carddesc').innerHTML=o.desc; else $('carddesc').textContent=o.desc;
  $('cardbadges').innerHTML=o.badges.map(b=>`<span class="badge ${b[0]}">${esc(b[1])}</span>`).join('');
  /* the line at the bottom, every time (it stayed on an oddity's "dismiss" for every later fish) */ const tp=$('cardin').querySelector('.tap'); if(tp) tp.textContent=PLAT.touch()?'Tap to keep fishing':'Click or press Space to keep fishing'; $('card').hidden=false; }
function hideCard(){ $('card').hidden=true; G.st='idle'; afterCard(); }
$('card').addEventListener('pointerdown',e=>{ e.stopPropagation(); hideCard(); });

// ---------- bounties ----------
// 0.3: every water keeps its own board of bounties, so progress (and rare bounties) stay with that water
const BOUNTIES_PER_WATER = 3;
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
/* pictures a page redraw threw away are released at once (2026-11-20, #151): iPhone Safari keeps a removed picture's memory until it
   gets round to cleaning up, and opening pages again and again ran it out of memory. Each redraw releases the pictures the last one
   removed (also right after it, once the page is idle); only pictures no longer on the page are touched. */
var rpOld=null, rpT=0; /* var: a page drawn while the game is still loading must not hit a not-yet-defined name (#130) */
function rpRelease(){ clearTimeout(rpT); if(rpOld) for(const c of rpOld) if(!c.isConnected&&c.width){ c.width=0; c.height=0; } rpOld=null; }
/* F6 slice 3: the one renderPanel. It runs the page steps (panelStep, d2_extra.js) around the draw: each step's "before" from the last
   added to the first, the draw, each "after" (then "always") from the first added to the last; a "before" that answers 'drawn' has
   drawn the page itself, so everything added before it is skipped. Exactly the order the old wrappers ran in. */
function panelRun(i){ if(i<0) return panelDraw(); const s=panelStep.list[i]; let t; if(s.before){ t=s.before(); if(t==='drawn') return; }
  if(s.always){ try{ panelRun(i-1); if(s.after) s.after(t); } finally{ s.always(t); } } else { panelRun(i-1); if(s.after) s.after(t); } }
function renderPanel(){ panelRun((panelStep.list||[]).length-1); }
function panelDraw(){ const P=$('panel'); rpRelease(); rpOld=[...P.getElementsByTagName('canvas')]; rpT=setTimeout(rpRelease,0); const fn={cooler:renderCooler, shop:renderShop, skills:renderSkills2, aquarium:renderAquarium, bounties:renderBounties, feats:renderFeats, journal:renderJournal, map:renderMap, style:renderStyle, pets:renderPets, save:renderSave, games:renderBoardwalk, settings:renderSettings, rods:renderRods, paths:renderPaths, pass:renderPass}[S.tab]||renderCooler; fn(P); }
const tags = f => (f.sh===2?' <span class="sh" style="color:'+PRISM[f.pv||'rainbow'].c+'">✦✦ '+PRISM[f.pv||'rainbow'].n+' prismatic</span>':f.sh?' <span class="sh">✦ Shiny</span>':'')+(f.hy?' · <span class="sh">Hybrid</span>':'')+(f.tr?' · Trophy':'');
const aqTxt = f => { const L=aqNet(f), sp=SPI[f.id]; return L.length ? L.map(e=>fmtB(e.k,e.v)+(sp&&e.t!==sp.r?' ('+RAR[e.t].k+' boost)':'')).join(' + ') : 'no special effect'; };

/* (isProtected went into sellKeep, src/au_fix034.js: the cooler's choices win over Protect rare fish) */
/* C14 (director + Cam, 2026-11-20): sort the cooler by most/least recent, sell value, aquarium bonus or species. Most recent after
   every restart (kept in memory only), otherwise it remembers the last choice. Rows keep their real cooler index for the buttons. */
let coolSort='recent'; const COOL_SORTS=[['recent','Newest'],['old','Oldest'],['rarity','Rarity'],['value','Sell value'],['aq','Aquarium bonus'],['species','Species']]; /* Rarity: Cam's list #8 */
function coolOrder(){ const L=S.cooler.map((f,i)=>({f,i})); const nm=x=>(SPI[x.f.id]||{}).name||'';
  if(coolSort==='old') return L; if(coolSort==='value') return L.sort((a,b)=>salePrice(b.f)-salePrice(a.f)); if(coolSort==='aq') return L.sort((a,b)=>fishRate(b.f)-fishRate(a.f)); if(coolSort==='species') return L.sort((a,b)=>nm(a).localeCompare(nm(b))||b.i-a.i); if(coolSort==='rarity'){ const rk=x=>(SPI[x.f.id]||{r:-1}).r*10+(x.f.sh?(x.f.sh===2?2:1):0); return L.sort((a,b)=>rk(b)-rk(a)||salePrice(b.f)-salePrice(a.f)); } return L.reverse(); }
const sortBar=(act,cur,list,what)=>`<div class="cool-sort" role="group" aria-label="Sort the ${what}"><span class="meta">Sort</span>${list.map(([k,n])=>`<button type="button" class="chip${cur===k?' on':''}" data-act="${act}" data-k="${k}" aria-pressed="${cur===k}">${n}</button>`).join('')}</div>`;
const coolSortBar=()=>S.cooler.length<2?'':sortBar('coolsort',coolSort,COOL_SORTS,'cooler');
/* Cam, round 5: the Aquarium sorts like the Cooler (kept in memory; first shown in the order fish were added) */
let tankSort='old'; const TANK_SORTS=[['old','Oldest'],['recent','Newest'],['rarity','Rarity'],['income','Income'],['species','Species']];
function tankListOrder(){ const L=S.tank.map((f,i)=>({f,i})), nm=x=>(SPI[x.f.id]||{}).name||''; if(tankSort==='recent') return L.reverse(); if(tankSort==='income') return L.sort((a,b)=>fishRate(b.f)-fishRate(a.f)); if(tankSort==='species') return L.sort((a,b)=>nm(a).localeCompare(nm(b))||a.i-b.i); if(tankSort==='rarity'){ const rk=x=>(SPI[x.f.id]||{r:-1}).r*10+(x.f.sh?(x.f.sh===2?2:1):0); return L.sort((a,b)=>rk(b)-rk(a)||fishRate(b.f)-fishRate(a.f)); } return L; }
actOn('coolsort inspect tanksort', function(b){ if(b.dataset.act==='coolsort'){ if(COOL_SORTS.some(s=>s[0]===b.dataset.k)) coolSort=b.dataset.k; return 'render'; } if(b.dataset.act==='inspect') return inspectOpen(b.dataset.k,+b.dataset.i); if(b.dataset.act==='tanksort'){ if(TANK_SORTS.some(s=>s[0]===b.dataset.k)) tankSort=b.dataset.k; return 'render'; } });
document.head.insertAdjacentHTML('beforeend','<style>.cool-empty{display:flex;flex-direction:column;align-items:center;gap:8px;text-align:center;padding:22px 16px}.cool-empty .bwx-art{font-size:34px;line-height:1.1}.cool-empty .meta{max-width:420px}.cool-sort{display:flex;flex-wrap:wrap;align-items:center;gap:6px;margin:10px 0 2px}.cool-sort .chip{height:32px;padding:0 12px;border-radius:10px;border:1px solid var(--line);background:var(--glass,#16243a);color:#cfe0ee;font:700 12.5px var(--display,system-ui);cursor:pointer}.cool-sort .chip.on{background:linear-gradient(180deg,#ffe08a,#f3b94e);color:#2a1c05;border-color:#ffe6a3}</style>');function renderCooler(P){
  const total=S.cooler.filter(f=>!sellKeep(f)).reduce((a,f)=>a+salePrice(f),0); const tankFree = S.tank.length < aqCap(); const dm=demandSp();
  P.innerHTML=`<div class="row spread"><div><h2>Cooler</h2><p class="sub">${S.cooler.length} of ${gv('cooler')} slots. Your bonuses add +${Math.round((sellMult()-1)*100)}% to every sale. Fish in the aquarium earn coins and give stacking boosts.</p></div>
  <button class="btn" data-act="sellall" ${total?'':'disabled'}>Sell ${sellFilterOn()?"matching":"all"}${S.cooler.some(sellKeep)?" (keeping "+S.cooler.filter(sellKeep).length+")":""} for <span class="coin">${fmt(total)}</span></button></div>
  <div class="tile" style="margin-top:10px;flex-direction:row;align-items:center;gap:12px"><canvas width="128" height="64" data-fish="${dm.id}" style="width:64px;height:32px"></canvas>
  <div style="min-width:0"><b>The fishmonger wants ${dm.name}</b> <span class="meta">(${LOCS[locIdx(dm.loc)].name})</span><div class="meta">Pays double for it until the weather changes (<span id="dmleft" style="font-variant-numeric:tabular-nums;display:inline-block;min-width:2.6em">${mmss(wxLeft())}</span>).</div></div></div>`+
  (S.cooler.length ? coolSortBar()+'<div class="list">'+coolOrder().map(({f,i})=>{ const sp=SPI[f.id]; return `<div class="fishrow"><canvas width="128" height="64" data-fish="${f.id}" data-sh="${f.sh||0}" data-pv="${f.pv||''}"></canvas>
   <div class="nm"><span style="color:${RAR[sp.r].c}">${sp.name}</span><small>${RAR[sp.r].k} · ${kgStr(f.kg)}${tags(f)} · <span class="aq">Aquarium: ${aqTxt(f)}</span></small></div>
   <div class="val coin" ${dm.id===f.id?'style="color:var(--gold)" title="Fishmonger pays double"':''}>${fmt(salePrice(f))}${dm.id===f.id?' ×2':''}</div><div class="acts"><button class="btn alt sm" data-act="totank" data-i="${i}" ${tankFree?'':'disabled'} title="${tankFree?'Earns '+fmt(fishRate(f)*60)+' coins per hour':'Aquarium is full'}">To aquarium</button><button class="btn alt sm" data-act="sell" data-i="${i}">Sell</button>${nibScrapBtn(f,i)}${inspectBtn('cooler',i)}</div></div>`; }).join('')+'</div>'
   : '<div class="empty cool-empty"><div class="bwx-art" aria-hidden="true">🧊 🐟</div><b>Your cooler is empty</b><div class="meta">Fish you catch wait here. Sell them, scrap them for Nibbles or put them in the aquarium.</div><button class="btn" data-mo="close">Go fishing</button></div>'); /* batch 2: the empty page was mostly blank space */
  paintFish(P);
}
function renderAquarium(P){ accrue(); const rate=tankRate(); let AQS=null; const next=TANK_COST[S.tankSlots];
  const sums={}; for(const f of S.tank) for(const e of aqNet(f)) sums[e.k]=(sums[e.k]||0)+e.v;
  const chips=Object.entries(sums).map(([k,v])=>`<span class="badge k">${fmtB(k,Math.min(v,BONUS_CAP[k]||9))}</span>`).join('');
  P.innerHTML=`<div class="row spread"><div><h2>Aquarium</h2><p class="sub">Visitors pay to see your fish, even while you’re away (up to 8 hours). Every fish gives a boost while on display, and boosts stack. Each fish rolls its own boost when caught: usually one that fits its rarity, now and then a much better (or weaker) one. Heavier fish give more, shiny fish double, and the strangest catches give the most.</p></div>
  <div class="bank"><div><div class="sub">Earning</div><b class="coin" title="${fmt(rate*60)} coins an hour">${fmtShort(rate*60)}</b><span class="sub"> / hour</span></div><div><div class="sub">Ready to collect</div><b class="coin" id="tankbank" title="${fmt(S.tankBank)} coins">${fmtShort(S.tankBank)}</b></div>
  <button class="btn" id="collectbtn" data-act="collect" ${S.tankBank>=1?'':'disabled'}>Collect</button></div></div>
  <div class="badges" style="justify-content:flex-start;margin-top:8px">${chips||'<span class="sub">No boosts yet. Put a fish on display.</span>'}</div>
  <div class="tank"><canvas id="tankcv"></canvas></div>${S.aq.decor.length?`<p class="sub" style="margin-top:6px">Drag a decoration along the sand to move it.</p>`:""}
  <div class="row spread" style="margin-top:10px"><span class="sub">${S.tank.length} of ${aqCap()} spots used</span>
  ${next!=null?`<button class="btn alt" data-act="buytank" ${S.money>=next?'':'disabled'}>Increase tank size · <span class="coin">${fmt(next)}</span></button>`:'<span class="sub">Your tank is as big as it gets</span>'}</div>`+
  (S.tank.length ? (S.tank.length<2?'':sortBar('tanksort',tankSort,TANK_SORTS,'aquarium'))+'<div class="list">'+tankListOrder().map(({f,i})=>{ const sp=SPI[f.id]; return `<div class="fishrow"><canvas width="128" height="64" data-fish="${f.id}" data-sh="${f.sh||0}" data-pv="${f.pv||''}"></canvas>
   <div class="nm"><span style="color:${RAR[sp.r].c}">${sp.name}</span><small>${RAR[sp.r].k} · ${kgStr(f.kg)}${tags(f)} · <span class="aq">${aqTxt(f)}</span>${nibFedTxt(f)}</small></div>
   <div class="val"><span class="coin">${fmt((AQS||(AQS=aqShownRates()))[i])}</span><span class="sub"> / h</span></div><div class="acts">${nibFeedBtn(f,i)}<button class="btn alt sm" data-act="untank" data-i="${i}" ${S.cooler.length<gv('cooler')?'':'disabled'}>Back to cooler</button>${inspectBtn('tank',i)}</div></div>`; }).join('')+'</div>'
   : '<div class="empty">No fish on display yet. In the Cooler, press <b>To aquarium</b> on a fish you want to keep.</div>') + aqCustomHTML();
  paintFish(P); paintDecor(P);
}
function renderBounties(P){ fillBounties(); const ready=S.bounties.filter(b=>bDone(b)&&(!b.loc||S.unlocked.includes(b.loc))).length;
  P.innerHTML=dailyHTML()+`<h2>Bounties</h2><p class="sub">The harbourmaster pays extra for specific catches. Every water has its own board, and its bounties wait there until you finish them. Fish still go in your cooler.</p>
  <div class="chips" style="margin:6px 0 10px">${S.unlocked.slice().sort((a,b)=>locIdx(a)-locIdx(b)).map(L=>{ const n=S.bounties.filter(b=>b.loc===L&&bDone(b)).length; return `<button class="chipb" data-act="bloc" data-k="${L}" aria-pressed="${(bLoc||S.loc)===L}">${esc(LOCS[locIdx(L)].name)}${n?' · '+n+' ready':''}</button>`; }).join('')}</div>${ready>1?`<button class="btn" data-act="claimall" style="margin:0 0 10px">Claim all · ${ready} ready</button>`:''}<div class="grid">`+
  S.bounties.map((b,i)=>{ if(b.loc!==(S.unlocked.includes(bLoc)?bLoc:S.loc)) return ''; const bt=bountyText(b); if(bt){ const d=bDone(b), rw=Math.round(b.reward*coinMult()*1);
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
  const total=Object.keys(S.journal).length; if(!encLoc||(encLoc!=='junk'&&!LOCS[locIdx(encLoc)])) encLoc=S.loc; // a water that doesn't exist falls back to the current one
  const chips=[...LOCS.map(L=>[L.id,L.name+' '+caughtAt(L.id)+'/'+spAt(L.id).length]),['junk','Oddities '+nJunkKinds()+'/'+JUNK.length]].map(([k,n])=>`<button class="chipb" data-act="encloc" data-k="${k}" aria-pressed="${encLoc===k}">${n}</button>`).join('');
  let body='';
  if(encLoc==='junk'){
    body=`<p class="sub">Things humanity dropped in the water. Some pay, some boost your fishing, some come with a pet or a hat.</p><div class="jgrid">`+JUNK.map(J=>{ const n=S.junk[J.id]||0; return `<div class="jcard" style="cursor:default" ${n?'data-odd="'+J.id+'"':''}><canvas width="200" height="100" data-junk="${J.id}" data-known="${n?1:0}"></canvas>
      <b style="color:${n?(J.t>=2?'var(--gold)':'var(--ink)'):'var(--muted)'}">${n?esc(J.name):'???'}</b><small>${n?['Junk','Odd junk','Rare find','Treasure'][J.t]+' · ×'+n:'Not found yet'}</small></div>`; }).join('')+'</div>';
  } else {
    const L=LOCS[locIdx(encLoc)], list=spAt(L.id).slice().sort((a,b)=>a.r-b.r||a.base-b.base), got=caughtAt(L.id), open=S.unlocked.includes(L.id); const sel=encSel && SPI[encSel] && SPI[encSel].loc===L.id ? SPI[encSel] : null;
    let det='';
    if(sel){ const j=S.journal[sel.id], ae=aqBase(sel.id), B=BEH[sel.beh];
      det=`<div class="tile detail" style="margin-top:10px"><canvas width="440" height="220" data-fish="${sel.id}" data-known="${j?1:0}" data-sh="${j&&j.sh?1:0}"></canvas><div>
      <div class="rar" style="color:${RAR[sel.r].c}">${RAR[sel.r].k}${j&&j.pr?' · <span class="sh">✦✦ prismatic caught</span>':j&&j.sh?' · <span class="sh">✦ shiny caught</span>':''}${j&&j.tr?' · trophy caught':''}</div>
      <h2>${j?sel.name:'Not caught yet'}</h2><p class="sub">${j?sel.note:'Keep fishing '+L.name+(sel.time!=='any'?' at '+(sel.time==='night'?'night':'day'):'')+'.'}</p>
      <div class="kv" style="margin-top:8px">${j?`<div><span>Nibbles (${nibRarName(sel.id)})</span> ${nibOf(sel.id)}</div>`:''}${foodLine(sel,j)}<div><span>Heaviest</span> ${j&&j.best?kgStr(j.best):'—'}</div><div><span>Smallest</span> ${j&&j.min!=null?kgStr(j.min):'—'}</div>${j&&j.hb!=null?`<div><span>Hybrid heaviest</span> <span class="sh">${kgStr(j.hb)}</span></div><div><span>Hybrid lightest</span> <span class="sh">${kgStr(j.hs)}</span></div>`:''}<div><span>Best sale value</span> ${j&&j.bv?'<span class="coin">'+fmt(j.bv)+'</span>':'—'}</div><div><span>Times caught</span> ${j?fmt(j.n):0}</div>
      <div><span>Size range</span> ${kgStr(sel.min)}–${kgStr(sel.max)}</div><div><span>Active</span> ${sel.time==='any'?'Day and night':sel.time==='night'?'Night only':'Day only'}</div><div><span>Strength</span> ${strTxt(fishPull(sel))}${fishPull(sel)>anglerStr()?' · heavy for you':''}</div>
      <div><span>Mastery</span> <span class="sh">${starStr(mastery(sel.id))}</span> +${Math.round(mastery(sel.id)*masteryK()*100)}%${mastery(sel.id)<4?` · next at ${masteryT()[mastery(sel.id)]}`:''}</div>
      <div><span>Fights like a</span> ${B.n.toLowerCase()}</div><div><span>Temper</span> ${'●'.repeat(Math.round(sel.aggr*5))+'○'.repeat(5-Math.round(sel.aggr*5))}</div><div><span>In the aquarium</span> ${ae?fmtB(ae.k,ae.v):'—'}</div>
      ${j&&j.first?`<div><span>First caught</span> ${new Date(j.first).toLocaleDateString()}</div>`:''}</div><p class="sub" style="margin-top:6px">${B.d}</p></div></div>`; }
    body=`<div class="row spread" style="margin-top:6px"><span class="sub">${got} / ${list.length} found${S.setDone[L.id]?' · complete':` · find them all for <span class="coin">${fmt(L.bonus)}</span>`}${open?'':' · water locked'}</span><span class="sub">${PLAT.touch()?'Tap':'Click'} a fish for its records</span></div>
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
  P.innerHTML=`<h2>Waters</h2><p class="sub">${LOCS.every(L=>S.unlocked.includes(L.id))?`All ${LOCS.length} waters are open. Every one has`:`Open a new water with coins after catching ${unlockNeed()} fish at the water before it. Each voyage adds 10 more, up to 50. Every water has`} ${spAt("pond").length} fish of its own, its own junk and treasure${LOCS.every(L=>S.unlocked.includes(L.id))?"":", and is a little tougher than the last"}.</p><div class="grid">`+
  LOCS.map((L,i)=>{ const open=S.unlocked.includes(L.id), here=S.loc===L.id; const prev=i?LOCS[i-1]:null; const met=unlockMet(i); const sps=spAt(L.id);
    const btn = here ? '<button class="btn alt" disabled>Fishing here</button>' : open ? `<button class="btn" data-act="goto" data-k="${L.id}" ${G.st==='idle'||G.st==='rest'?'':'disabled title="Reel in your line first"'}>Travel here</button>`
      : L.eg&&!egCharted(L) ? `<button class="btn" disabled>Complete voyage ${egVoy(L)} to unlock</button>` /* Cam's list #12 */
      : `<button class="btn" data-act="unlock" data-k="${L.id}" ${met&&S.money>=locCost(L)&&locPrevOk(i)?'':'disabled'}>Unlock · <span class="coin">${fmt(locCost(L))}</span></button>`;
    const egHead=L.eg&&!(prev&&prev.eg)?`<div class="eg-head"><h3>End-game waters</h3><span class="meta">These open after later voyages (see Set sail again). Their fish are much tougher and worth much more.</span></div>`:"";
    return egHead+`<div class="tile loc ${here?"here":""}"><div class="sw2" style="background:linear-gradient(${L.sky[0]},${L.sky[1]} 48%,${L.water[0]} 52%,${L.water[1]})"></div>
    <h4>${L.name}</h4><div class="meta">${L.blurb}</div><div class="meta">Depth ${depthStr(L.depth)} · ${caughtAt(L.id)} of ${sps.length} caught</div>${strStandHTML(sps)}
    ${!open&&prev?`<div class="meta" style="color:${met?'var(--kelp)':'var(--muted)'}">${met?'✓':'·'} ${unlockLine(i)}</div>`:''}${btn}</div>`; }).join('')+'</div>'; /* Set sail again and Pearl relics live on the Prestige page (cw_pages08.js) */
}
const canRetire = () => S.unlocked.includes('trench') && pearlsFor() > 0 && G.st==='idle';

// ---------- wardrobe ----------
const ownedOffer = o => o.kind==='shoe'?S.owned.shoes.includes(o.id):o.kind==='neck'?S.owned.necks.includes(o.id):o.kind==='back'?S.owned.backs.includes(o.id):o.kind==='col'?S.owned.cols.includes(o.id):o.kind==='pat'?S.owned.pats.includes(o.id):o.kind==='out'?S.owned.outfits.includes(o.id):o.kind==='gls'?S.owned.glasses.includes(o.id):S.owned.hats.includes(o.id);
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
  // the first portraits are drawn at once, the rest in small batches right after (and any that scroll into view first are
  // drawn straight away): setting up 60+ fresh canvases in one go made the Pets page slow to open (2026-11-17 QC)
  const paint=c=>{ if(c.dataset.done) return; c.dataset.done=1; const cx=c.getContext('2d'); cx.clearRect(0,0,c.width,c.height); const bigp=c.dataset.pet==='horse'||c.dataset.pet==='cow'; if(c.dataset.own==='1') drawPetStyled(cx,c.dataset.pet,120,128,bigp?2.6:4.4,0); else if(PETI[c.dataset.pet].src==='shop') drawPet(cx,c.dataset.pet,120,128,bigp?2.6:4.4,0);
    else mysteryThumb(cx,c.width,c.height,c.dataset.pet); };
  const cvs=[...P.querySelectorAll('canvas[data-pet]')]; cvs.slice(0,8).forEach(paint);
  let io=null; if(window.IntersectionObserver){ io=new IntersectionObserver(es=>{ for(const e of es) if(e.isIntersecting){ io.unobserve(e.target); paint(e.target); } },{rootMargin:'300px 0px'}); cvs.slice(8).forEach(c=>io.observe(c)); }
  let i=8; const batch=()=>{ if(!cvs[0]||!cvs[0].isConnected){ if(io) io.disconnect(); return; } for(let n=0;n<6&&i<cvs.length;n++,i++) paint(cvs[i]); if(i<cvs.length) setTimeout(batch,16); else if(io) io.disconnect(); };
  if(cvs.length>8) setTimeout(batch,16);
}

// ---------- save codes ----------
let pendingLoad=null;
/* a valid save code takes you back to the fishing screen, where you confirm the load (director, 2026-11-23) */
function showLoadAsk(){ const old=$('loadask'); if(old) old.remove(); if(!pendingLoad) return; const o=pendingLoad, d=document.createElement('div'); d.id='loadask'; d.setAttribute('role','dialog'); d.setAttribute('aria-modal','true');
  d.style.cssText='position:fixed;inset:0;z-index:9000;display:flex;align-items:center;justify-content:center;background:rgba(4,10,18,.55);padding:16px';
  d.innerHTML=`<div style="max-width:420px;width:100%;background:#0f2233;color:#eef6fa;border-radius:16px;padding:18px 18px 14px;box-shadow:0 10px 40px #0008;border:1px solid #ffffff1f"><h3 style="margin:0 0 8px">Load this save?</h3><p style="margin:0 0 14px;line-height:1.45">It replaces this device’s progress with level ${o.lvl}, ${fmt(o.money||0)} coins and ${Object.keys(o.journal||{}).length} species.</p><div style="display:flex;gap:10px;justify-content:flex-end"><button type="button" class="btn alt" data-la="no">Cancel</button><button type="button" class="btn" data-la="yes">Load save</button></div></div>`;
  d.addEventListener('click',e=>{ const b=e.target.closest('[data-la]'); if(!b&&e.target!==d) return; if(b&&b.dataset.la==='yes'&&pendingLoad){ S=migrate(pendingLoad); pendingLoad=null; G.st='idle'; $('card').hidden=true; offlineIncome(); fillBounties(); save(); renderPanel(); toast('Progress loaded. Welcome back!'); } else pendingLoad=null; d.remove(); });
  document.body.appendChild(d); const y=d.querySelector('[data-la="yes"]'); if(y) y.focus(); }
async function makeCode(){ const json=JSON.stringify(S);
  try{ if(window.CompressionStream){ const st=new Blob([json]).stream().pipeThrough(new CompressionStream('deflate-raw')); const buf=new Uint8Array(await new Response(st).arrayBuffer()); let bin=''; for(let i=0;i<buf.length;i+=0x8000) bin+=String.fromCharCode.apply(null,buf.subarray(i,i+0x8000)); return 'DL1:'+btoa(bin); } }catch(e){ oops('e_ui:Blob',e); }
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
  ${window.DL_VERSION&&!window.DL_DESKTOP&&!window.DL_PREVIEW?'<div class="tile"><h4>Windows desktop app</h4><div class="meta">A real program with its own window and Start-menu icon. Updates itself.</div><a class="btn" href="download/Driftline-Setup.zip" download style="text-decoration:none;text-align:center">Download for Windows</a><div class="meta">Unzip the whole folder and run <b>Driftline.exe</b>. If Windows shows “protected your PC”, click <b>More info</b>, then <b>Run anyway</b>. Your browser progress doesn’t carry over automatically: copy a save code here and load it in the app.</div></div>':''}
  ${window.DL_VERSION&&!window.DL_DESKTOP?'':'<!--'}<div class="tile"><h4>Install as an app</h4><div class="meta">${isApp?'You are playing the installed app. It updates itself when a new version is out.':'Get a home-screen icon, full-screen play and offline fishing. It updates itself.'}</div>
    ${isApp?'':window.__dlInstallPrompt?'<button class="btn" data-act="install">Install Driftline</button>':'<div class="meta">iPhone: Share, then <b>Add to Home Screen</b>. Android, Windows or Mac in Chrome or Edge: the install icon in the address bar, or the menu, then <b>Install</b>.</div>'}</div>${window.DL_VERSION&&!window.DL_DESKTOP?'':'-->'}</div>
  ${window.DL_VERSION?`<p class="sub" style="margin-top:10px">Version ${esc(window.DL_VERSION)}</p>`:''}`;
  makeCode().then(c=>{ const t=$('savecode'); if(t) t.value=c; }); paintLink(); }

$('panel').addEventListener('click',e=>{ const b=e.target.closest('[data-act]'); if(!b||b.disabled) return; const k=b.dataset.k, i=+b.dataset.i;
  switch(b.dataset.act){
    case 'copysave': { const t=$('savecode'); if(!t||!t.value.startsWith('DL')) return; (navigator.clipboard?navigator.clipboard.writeText(t.value):Promise.reject()).then(()=>toast('Save code copied')).catch(()=>{ t.focus(); t.select(); toast('Press Ctrl+C (or long-press, Copy) to copy the code'); }); return; }
    case 'loadsave': { const v=codeFromAny(($('loadcode')||{}).value||''); readCode(v).then(o=>{ if(!o||typeof o!=='object'||!o.journal) throw 0; pendingLoad=o; closeMenu(); showLoadAsk(); }).catch(()=>toast('That code didn’t work. Copy the whole thing and try again.')); return; }
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
    case 'buygear': { const lv=S.gear[k], c=GEAR[k].cost[lv+1]; if(c==null||S.money<c) return; S.money-=c; S.gear[k]++; sfx.coin(); toast(GEAR[k].name+' upgraded to level '+S.gear[k]); break; }
    case 'buybait': { const bt=BAIT[k]; if(!bt||bt.junk||!(bt.pack>0)||!(bt.scales>0||bt.price>0)) return; if(bt.scales){ if(S.scales<bt.scales) return; S.scales-=bt.scales; S.bait[k]+=bt.pack; } else { const n=+b.dataset.n||1, cost=n>1?bt.price*4.5:bt.price; if(S.money<cost) return; S.money-=cost; S.bait[k]+=bt.pack*n; } if(S.baitSel==='worm') S.baitSel=k; sfx.coin(); toast('Bought '+bt.name); break; }
    case 'usebait': S.baitSel=k; break;
    case 'claim': { const bo=S.bounties[i]; if(!bo||!bDone(bo)) return; const paid=earn(bo.reward*coinMult()*(relic('seasoned')?1.3:1)); /* Bounty Ledger relic (Cam, round 5) */ if(bo.scales) S.scales+=bo.scales; S.bounties.splice(i,1); fillBounties(); sfx.coin(); toast('Bounty paid: '+fmt(paid)+' coins'+(bo.scales?' and '+bo.scales+' Scales':'')); break; }
    case 'retire': { if(!canRetire()) return; confirmBox='retire'; break; }
    case 'reset': confirmBox='reset'; break;
    case 'cancel': confirmBox=null; pendingLoad=null; break;
    case 'retireok': { if(!canRetire()) return; const n=pearlsFor(); S.pearls+=n; S.tides++; S.stats.bestLvl=Math.max(S.stats.bestLvl||0,S.lvl);
      Object.assign(S,{money:0, gear:fresh().gear, bait:relic('tacklebox')?S.bait:baitZero(), baitSel:relic('tacklebox')?S.baitSel:'worm', unlocked:['pond'], loc:'pond', cooler:[], bounties:[], setDone:{}, streak:0, voyCatch:{}, lvl:1, xp:0, perks:{}}); /* Cam, round 5: a new voyage starts at level 1; skills are handed back and only the points from feats and the Fish Log stay to spend */
      S.nib=nibHalve(); /* [19] half of every species' Nibbles expire on a new voyage */ S.stats.runEarned=0; S.stats.runBw=0; confirmBox=null; fillBounties(); sfx.catch(4); toast('You set sail again: +'+n+' Wisdom Pearl'+(n===1?'':'s')+' to spend ('+S.pearls+' in all) in the Pearl shop or on relics.'); break; }
    case 'resetok': { S=fresh(); S.savedAt=Date.now(); confirmBox=null; G.st='idle'; encLoc=null; encSel=null; fillBounties(); toast('Progress reset. A fresh start at Willow Pond.'); break; }
    case 'reroll': { const bo=S.bounties[i]; const c=Math.ceil(bo.reward*.1); if(S.money<c) return; S.money-=c; const L=bo.loc||S.loc; S.bounties[i]=makeBounty2(L)||makeBounty(L); break; }
    case 'unlock': { const i=locIdx(k), L=LOCS[i]; if(!L||S.unlocked.includes(k)||S.money<locCost(L)||!unlockMet(i)||!locPrevOk(i)) return; /* the requirement is checked here too, not only on the button */ S.money-=locCost(L); S.unlocked.push(k); if(L.eg){ if(!Array.isArray(S.egPaid)) S.egPaid=[]; if(!S.egPaid.includes(k)) S.egPaid.push(k); } S.loc=k; G.hot=null; fillBounties(); sfx.catch(2); toast('Welcome to '+L.name); break; }
    case 'goto': if(G.st==='rest'){ S.loc=k; G.hot=null; restCast(); toast('Travelled to '+LOCS[locIdx(k)].name+'. Still resting.'); break; } /* resting travels too and keeps resting (director, 2026-11-22: Travel did nothing while resting) */ if(G.st!=='idle'){ toast('Reel in your line first, then travel.'); return; } S.loc=k; G.hot=null; toast('Travelled to '+LOCS[locIdx(k)].name); break;
    case 'encloc': if(k==='junk'||LOCS[locIdx(k)]) encLoc=k; encSel=null; break;
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
offlineIncome(); fillBounties(); ensureDaily(); accrueSpins(); checkFeats(); refreshAll(); requestAnimationFrame(frame); resize.live=true; initCloud();
{ const gift=dailyLogin(); const veteran=S.stats.caught>0||S.savedAt; if(S.seenPatch!==GAME_VERSION){ const seen0=S.seenPatch; S.seenPatch=GAME_VERSION; if(veteran) setTimeout(()=>showWhatsNew(seen0,gift),700); else if(gift) setTimeout(()=>toast(gift),1200); } else if(gift) setTimeout(()=>toast(gift),1200); save(); }
if(!S.stats.caught && !S.savedAt) setTimeout(()=>toast('Hold on the water to cast your first line'),600);
})();
</script>
