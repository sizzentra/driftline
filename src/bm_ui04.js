// =====================================================================
// 0.4 "Fifty Fathoms" UI: two modes.
//  Fishing mode: the water, the 5 menu categories, and a dashboard of small live cards (cooler, bounties, aquarium,
//    events, hunts, progress, gear) that act right there. The dashboard is drawn inside #panel, so every button reuses
//    the game's own actions (sell all, claim, collect, feed) with their checks, saving and refresh.
//  Menu mode: one full-screen screen with the category tabs, the page pills and the page. Opening a page from anywhere
//    (a category, a link, the goal chip, search, settings) opens it; Back to fishing, Esc or the phone's back gesture
//    closes it. While it is open the line waits: fishing is paused, never reset. Clocks (events, aquarium) keep running.
//  S.tab==='dash' means fishing mode, so every old "if(S.tab==='x')" check stays correct.
// Also: Home is now the Dock, and every water has its own dock layout (decorations, wood, style, spots).
// =====================================================================
const DASH='dash';
const DOCK_KEYS=['wood','decor','style','pos','petPos','pet2Pos'];

// ---------- the 5 categories (the menus read MENU_SECS, so changing it in place changes every menu) ----------
const SEC_ICONS={
  fish:'<path d="M4 12c3-4.5 9-5.5 13-1l3-2.5v7L17 13c-4 4.5-10 3.5-13-1z"/><circle cx="8.5" cy="11.4" r=".9" fill="currentColor" stroke="none"/>',
  up:'<path d="M12 20V7"/><path d="M6.5 12.5 12 7l5.5 5.5"/><path d="M5 4h14"/>',
  coll:'<rect x="3.5" y="5" width="17" height="14" rx="2.5"/><path d="M7 13c1.8-2.4 4.8-2.9 7-.6l1.8-1.4v4l-1.8-1.4c-2.2 2.3-5.2 1.8-7-.6z"/><path d="M3.5 16.5c3 .8 5 .8 8 0s5-.8 9 0"/>',
  chal:'<path d="M8 4h8v5a4 4 0 0 1-8 0z"/><path d="M8 6H5a3 3 0 0 0 3 4M16 6h3a3 3 0 0 1-3 4"/><path d="M12 13v3M9 20h6M10 16h4v4h-4z"/>',
  cust:'<path d="M14.5 4.5 19.5 9.5 10 19H5v-5z"/><path d="M12.5 6.5l5 5"/>'};
MENU_SECS.splice(0,MENU_SECS.length,
  {id:'fish', name:'Fishing',       short:'Fishing',    tabs:['cooler','map'],                             icon:SEC_ICONS.fish},
  {id:'up',   name:'Upgrades',      short:'Upgrades',   tabs:['shop','rods','skills','paths'],             icon:SEC_ICONS.up},
  {id:'coll', name:'Collections',   short:'Collection', tabs:['aquarium','trophy','journal'],              icon:SEC_ICONS.coll},
  {id:'chal', name:'Challenges',    short:'Challenges', tabs:['events','bounties','feats','pass','games'], icon:SEC_ICONS.chal},
  {id:'cust', name:'Customization', short:'Customize',  tabs:['home','style','pets'],                      icon:SEC_ICONS.cust});
// Home is the Dock now
{ const b=menuTabBtn('home'); if(b){ b.dataset.label='⚓ Dock'; for(const n of b.childNodes) if(n.nodeType===3&&n.textContent.includes('Home')) n.textContent=n.textContent.replace(/🏡\s*Home/,'⚓ Dock'); } }
PAGE_DESC.home='Your dock at each water: wood, style and decorations';
SEARCH_IDX.forEach((e,i)=>{ if(e[1]==='home'&&/^Home/.test(e[0])) SEARCH_IDX[i]=[e[0].replace(/^Home: dock/,'Dock: wood and style').replace(/^Home:/,'Dock:'),e[1],e[2],e[3]+' home'] });
KEYS[0][1]='Open a category (Fishing, Upgrades, Collections, Challenges, Customization)';
KEYS.forEach((k,i)=>{ if(k[0]==='Esc') KEYS[i]=['Esc','Close the menu, a card or the search']; if(k[0]==='M') KEYS[i]=['M','Hide or show the dashboard (bigger water)']; });
// rebuild the category row with the new categories (the click handler finds them by data-sec)
(function(){ const T=$('tabs'), bar=T&&T.querySelector('.secbar'); if(!bar) return;
  const svg=p=>`<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${p}</svg>`;
  bar.setAttribute('aria-label','Menu categories');
  bar.innerHTML=MENU_SECS.map(s=>`<button type="button" class="secb" data-sec="${s.id}" aria-pressed="false" title="${esc(s.name)}"><span class="seci">${svg(s.icon)}</span><span class="secl"><span class="secfull">${s.name}</span><span class="secshort">${s.short}</span></span><span class="seclive" hidden>LIVE</span><span class="secdot" hidden></span></button>`).join('');
  menuSubKey=''; })();

// ---------- per-water docks ----------
function dockCopy(d){ d=d||{}; return {wood:d.wood||'oak', decor:Array.isArray(d.decor)?d.decor.filter(x=>typeof x==='string'&&DOCKI[x]).slice(0,DOCK_SLOTS):[], style:typeof d.style==='string'?d.style:'plank',
  pos:(d.pos&&typeof d.pos==='object')?Object.fromEntries(Object.entries(d.pos).filter(([k,v])=>typeof v==='number'&&isFinite(v))):{}, petPos:typeof d.petPos==='number'?d.petPos:null, pet2Pos:typeof d.pet2Pos==='number'?d.pet2Pos:null}; }
function dockApply(L){ const D=dockCopy(L); for(const k of DOCK_KEYS) S.dock[k]=D[k]; }
// keep S.dock (what the game draws and edits) showing the dock of the water you are at
function dockSync(){ if(!S||!S.dock) return; if(!S.docks||typeof S.docks!=='object'||Array.isArray(S.docks)) S.docks={};
  const here=S.loc; if(S.dockAt===here&&S.docks[here]) return;
  if(S.dockAt&&LOCS.some(L=>L.id===S.dockAt)) S.docks[S.dockAt]=dockCopy(S.dock); // store the dock you are leaving
  if(S.docks[here]) dockApply(S.docks[here]); // its own layout
  S.docks[here]=dockCopy(S.dock); // a water you never fished at starts with a copy of the dock you arrive with
  S.dockAt=here; DOCK_PV=null; }
function dockStore(){ try{ dockSync(); if(S.dockAt) S.docks[S.dockAt]=dockCopy(S.dock); }catch(e){} }
{ const _save04=save; save=function(){ dockStore(); return _save04.apply(this,arguments); }; }
{ const _mig04=migrate; migrate=function(o){ const st=_mig04(o); try{ if(!st.docks||typeof st.docks!=='object'||Array.isArray(st.docks)) st.docks={};
    for(const k of Object.keys(st.docks)){ if(!LOCS.some(L=>L.id===k)) delete st.docks[k]; else st.docks[k]=dockCopy(st.docks[k]); }
    if(st.dockAt&&!LOCS.some(L=>L.id===st.dockAt)) st.dockAt=null; }catch(e){} return st; }; }
let dockCopyAsk=null;
function dockSummary(id){ const d=id===S.dockAt?S.dock:(S.docks&&S.docks[id]); if(!d) return null; let c=d.wood&&d.wood!=='oak'?1:0; for(const x of d.decor||[]) if(DOCKI[x]) c+=DOCKI[x].cozy; return {cozy:c, n:(d.decor||[]).length}; }
// the Dock page: which water you are editing, and every other water's dock
{ const _rh=renderHome; renderHome=function(P){ dockSync(); _rh(P); try{ const L=LOCS[locIdx(S.loc)], h=P.querySelector('h2'); if(h) h.textContent='Dock';
    const sub=h&&h.parentElement.querySelector('.sub'); if(sub) sub.textContent='Every water has its own dock. Pick the wood, the style and the decorations for this one: the cozier it gets, the better you fish here.';
    const all=S.unlocked.slice().sort((a,b)=>locIdx(a)-locIdx(b)); if(dockPick&&(dockPick===S.loc||!all.includes(dockPick))) dockPick=null;
    const pk=dockPick, ps=pk&&dockSummary(pk), pn=pk&&LOCS[locIdx(pk)].name, ask=dockCopyAsk===pk;
    const box=document.createElement('div'); box.className='dockbar';
    box.innerHTML=`<div class="dock-h"><span class="meta">Your docks</span>${all.map(id=>{ const s=dockSummary(id), here=id===S.loc;
        return `<button type="button" class="dock-c${here?' here':''}" data-act="dockpick" data-k="${id}" aria-pressed="${here||pk===id}" ${here?'aria-current="true"':''}><b>${esc(LOCS[locIdx(id)].name)}</b><span>${here?'editing':s?s.cozy+' ♥':'new'}</span></button>`; }).join('')}</div>
      ${pk?`<div class="dock-pick"><span class="meta"><b>${esc(pn)}</b>: ${ps?ps.n+' decoration'+(ps.n===1?'':'s')+' · '+ps.cozy+' ♥ cozy':'not built yet. It starts as a copy of the dock you arrive with.'}</span><span class="row" style="gap:6px;flex-wrap:wrap">${ps?`<button class="btn alt sm ${ask?'warn':''}" data-act="dockcopy" data-k="${pk}">${ask?'Tap again: replace the '+esc(L.name)+' dock':'Copy its layout here'}</button>`:''}<button class="btn sm" data-act="goto" data-k="${pk}" ${G.st==='idle'?'':'disabled title="Reel in first"'}>Travel there</button></span></div>`
        :`<div class="dock-pick"><span class="meta">You are editing the dock at <b>${esc(L.name)}</b>.${all.length>1?' Pick another water to copy its layout here or travel to it.':' Unlock more waters for more docks.'}</span></div>`}`;
    const cv=P.querySelector('#homecv'), tile=cv&&cv.closest('.tile'), hint=tile&&tile.nextElementSibling; if(hint&&hint.tagName==='P'&&/Drag/.test(hint.textContent)) hint.after(box); else if(tile) tile.after(box); else { const row=h?h.closest('.row'):null; if(row&&row.parentElement===P) row.after(box); else P.prepend(box); } }catch(e){} }; }
let dockPick=null;

// ---------- menu mode ----------
let MENU_OPEN=false, menuHist=false, dashPress=false;
const holdTab=[]; // where #tabs, #panel and #toast live in fishing mode
function menuEls(){ return {T:$('tabs'), P:$('panel'), toast:$('toast'), stage:$('stage')}; }
(function(){ const {T,P}=menuEls(); if(!T||!P) return; const a=document.createComment('tabs-home'), b=document.createComment('panel-home'); T.parentNode.insertBefore(a,T); P.parentNode.insertBefore(b,P); holdTab.push(a,b); })();
const MO=document.createElement('div'); MO.id='menuov'; MO.hidden=true; MO.setAttribute('role','dialog'); MO.setAttribute('aria-modal','true'); MO.setAttribute('aria-label','Menu');
MO.innerHTML=`<div class="mo-in"><div class="mo-top">
  <button type="button" class="mo-back" data-mo="close" aria-label="Back to fishing (Esc)" title="Back to fishing (Esc)"><svg class="mo-bi" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 5l-7 7 7 7"/></svg><svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${SEC_ICONS.fish}</svg><span class="mo-bl">Back to fishing</span></button>
  <div class="mo-title" aria-live="polite"></div>
  <div class="mo-tools"><span class="mo-pause" hidden title="Your line waits while a menu is open">⏸ <span>Line waiting</span></span><span class="mo-coin" title="Your coins"><span class="coin" id="mocoin">0</span></span><button type="button" class="mo-tb" data-mo="search" aria-label="Search the menus" title="Search (/)">🔍</button><button type="button" class="mo-tb" data-mo="settings" aria-label="Settings, stats and save" title="Settings, stats and save">⚙</button></div>
  </div><div class="mo-nav"></div><div class="mo-body"></div></div>`;
document.body.appendChild(MO);
function menuMount(){ const {T,P,toast}=menuEls(); MO.querySelector('.mo-nav').appendChild(T); MO.querySelector('.mo-body').appendChild(P); if(toast) MO.appendChild(toast);
  G.hold=false; try{ spaceDown=false; }catch(e){} MO.hidden=false; MO.classList.remove('mo-show'); void MO.offsetWidth; MO.classList.add('mo-show');
  document.body.classList.add('menu-open'); document.documentElement.classList.add('menu-open');
  if(!menuHist){ try{ history.pushState({dlmenu:1},''); menuHist=true; }catch(e){} }
  const sb=T.querySelector('.secb.on')||MO.querySelector('.mo-back'); try{ (document.activeElement&&document.activeElement.blur)&&document.activeElement.blur(); sb&&sb.focus({preventScroll:true}); }catch(e){} }
function menuUnmount(){ const {T,P,toast,stage}=menuEls(); const [a,b]=holdTab; if(a) a.parentNode.insertBefore(T,a); if(b) b.parentNode.insertBefore(P,b); if(toast&&stage) stage.insertBefore(toast,$('card')&&$('card').parentNode===stage?$('card'):null);
  MO.hidden=true; document.body.classList.remove('menu-open'); document.documentElement.classList.remove('menu-open');
  const w=document.querySelector('.wrap'); if(w){ w.classList.remove('wrapin'); void w.offsetWidth; w.classList.add('wrapin'); }
  try{ document.activeElement&&document.activeElement.blur&&document.activeElement.blur(); }catch(e){}
 }
function menuMode(){ const open=S.tab!==DASH; if(open===MENU_OPEN) return; MENU_OPEN=open; if(open) menuMount(); else { menuUnmount(); if(menuHist){ menuHist=false; try{ history.back(); }catch(e){} } } }
addEventListener('popstate',()=>{ if(menuHist){ menuHist=false; if(MENU_OPEN){ S.settings.pageLast=S.tab; setTab(DASH); save(); } } });
function openMenu(t){ setTab(t||S.settings.pageLast||'cooler'); save(); }
function closeMenu(){ if(S.tab===DASH) return; S.settings.pageLast=S.tab; setTab(DASH); save(); }
{ const _st=setTab; setTab=function(t){ if(!t) t=DASH; if(t!==DASH) S.settings.pageLast=t; _st(t); menuMode(); menuHead(); }; }
function menuHead(){ if(!MENU_OPEN) return; const sec=menuSecOf(S.tab), t=MO.querySelector('.mo-title'), nm=sec?(sec.id==='more'?'Settings':(sec.short||sec.name)):'';
  if(t.textContent!==nm) t.textContent=nm; const pz=MO.querySelector('.mo-pause'), busy=!['idle','rest','result','event'].includes(G.st); if(pz.hidden===busy) pz.hidden=!busy; }
MO.addEventListener('click',e=>{ const b=e.target.closest('[data-mo]'); if(!b) return; e.stopPropagation(); const m=b.dataset.mo;
  if(m==='close') closeMenu(); else if(m==='search'){ const s=$('searchbtn'); if(s) s.click(); } else if(m==='settings'){ const mt=MENU_MORE.tabs, last=menuLast().more; setTab(S.tab!=='settings'&&mt.includes(last)&&menuSecOf(S.tab)!==MENU_MORE?last:'settings'); save(); } });
// Esc closes the menu (the search box, a confirmation or a card handle Esc themselves first)
addEventListener('keydown',e=>{ if(e.key!=='Escape'||!MENU_OPEN) return; const sov=$('searchov'); if(sov&&!sov.hidden) return; const tag=(document.activeElement&&document.activeElement.tagName)||'';
  if(/INPUT|TEXTAREA|SELECT/.test(tag)){ document.activeElement.blur(); return; } e.preventDefault(); e.stopImmediatePropagation(); closeMenu(); },true);
// Space belongs to the page while a menu is open (buttons, scrolling), never to the rod behind it
addEventListener('keydown',e=>{ if(MENU_OPEN&&e.code==='Space') e.stopImmediatePropagation(); },true);
addEventListener('keyup',e=>{ if(MENU_OPEN&&e.code==='Space') e.stopImmediatePropagation(); },true);
// the line waits while a menu is open (rest mode keeps fishing by itself); the water draws a few times a second behind it
{ const _up=update; update=function(dt){ if(S.dockAt!==S.loc) dockSync(); if(MENU_OPEN){ if(G.st==='rest') restTick(dt); return; } return _up(dt); }; }
{ let lastD=0; const _dr=draw; draw=function(now){ if(MENU_OPEN&&now-lastD<250) return; lastD=now; return _dr(now); }; }
// a full cooler: show it on the dashboard instead of throwing you into a menu
{ const _sc=startCharge; startCharge=function(){ if(!MENU_OPEN&&S.cooler.length>=gv('cooler')){ toast(quip('full')+' Sell your catch or move fish to the aquarium.'); dashFlash('cooler'); return; } return _sc.apply(this,arguments); }; }
// keep the category row honest in fishing mode (nothing is "open") and mark live events
{ const _ms=menuSync; menuSync=function(){ _ms(); try{ const T=$('tabs'), live=!!(S.chal||liveScheds().length);
    T.querySelectorAll('.secb').forEach(b=>{ const l=b.querySelector('.seclive'); if(l){ const on=b.dataset.sec==='chal'&&live; if(l.hidden===on) l.hidden=!on; } });
    const sbtn=$('settingsbtn'); if(sbtn&&!MENU_OPEN) sbtn.classList.remove('menu-on'); const mset=MO.querySelector('[data-mo="settings"]'); if(mset) mset.classList.toggle('on',menuSecOf(S.tab)===MENU_MORE); }catch(e){} }; }

// ---------- the dashboard ----------
const DW_ORDER=['cooler','bounty','aq','event','hunt','prog','gear'];
function dashCol(){ const s=S.settings; if(!s.dashCol||typeof s.dashCol!=='object') s.dashCol={}; return s.dashCol; }
function dwBox(id,o){ const col=!!dashCol()[id];
  return `<section class="dw${o.wide?' wide':''}${o.state?' '+o.state:''}${col?' col':''}" data-w="${id}" aria-label="${esc(o.title)}"><button type="button" class="dwh" data-act="dcol" data-k="${id}" aria-expanded="${!col}"><span class="dwi" aria-hidden="true">${o.icon}</span><span class="dwt">${esc(o.title)}</span><span class="dws">${o.sum||''}</span><span class="dwc" aria-hidden="true"></span></button>${col?'':`<div class="dwb">${o.body}</div>`}</section>`; }
const dwBar=(p,c)=>`<div class="dwbar"><i style="width:${Math.max(0,Math.min(1,p))*100}%${c?';background:'+c:''}"></i></div>`;
const cd=(ms,txt)=>`<span data-cd="${Date.now()+Math.max(0,ms)}" data-live>${txt||mmss(Math.max(0,Math.ceil(ms/1000)))}</span>`;
const DW={
  cooler(){ const cap=gv('cooler'), n=S.cooler.length, sell=S.cooler.filter(f=>!sellKeep(f)), val=sell.reduce((a,f)=>a+salePrice(f),0), kept=n-sell.length, full=n>=cap;
    return dwBox('cooler',{icon:'🧊', title:'Cooler', state:full?'warn':'', sum:`${n} / ${cap}`, body:
      `${dwBar(n/cap, full?'linear-gradient(90deg,#ff9a6a,#ff6a4a)':'')}<div class="dwrow"><span class="meta">${n?`Worth <span class="coin">${fmtShort(val)}</span>${kept?' · '+kept+' kept':''}`:'Empty: cast a line'}${full?' · <b class="dwwarn">Full</b>':''}</span></div>
       <div class="dwacts"><button class="btn sm" data-act="sellall" ${sell.length?'':'disabled'}>Sell all${sell.length?' · <span class="coin">'+fmtShort(val)+'</span>':''}</button><button class="btn alt sm" data-tabgo="cooler">Open</button></div>`}); },
  bounty(){ fillBounties(); const here=S.bounties.map((b,i)=>[b,i]).filter(([b])=>b.loc===S.loc), ready=S.bounties.filter(bDone).length, readyHere=here.filter(([b])=>bDone(b)).length, away=ready-readyHere;
    const row=([b,i])=>{ const d=bDone(b), bt=bountyText(b); let what, p=d?1:0, pt;
      if(bt){ what=bt.what; if(b.type==='style'){ p=Math.min(1,b.have/b.n); pt=Math.min(b.have,b.n)+' / '+b.n; } }
      else { const sp=SPI[b.sp]; if(!sp) return ''; what=b.legend&&!S.journal[sp.id]?'Catch the legend of '+LOCS[locIdx(sp.loc)].name:b.type==='count'?`Catch ${b.n} × ${sp.name}`:`Catch a ${sp.name} of ${kgStr(b.kg)} or more`; if(b.type==='count'){ p=Math.min(1,b.have/b.n); pt=Math.min(b.have,b.n)+' / '+b.n; } }
      const rw=Math.round(b.reward*coinMult()*(spec('collector')?.8:1));
      return `<div class="dwq${d?' done':''}"><div class="dwqt"><b>${esc(what)}</b><span class="meta"><span class="coin">${fmtShort(rw)}</span>${b.scales?' + '+b.scales+' Scales':''}${pt?' · '+pt:d?'':' · not yet'}</span>${pt&&!d?dwBar(p):''}</div>${d?`<button class="btn sm" data-act="claim" data-i="${i}">Claim</button>`:''}</div>`; };
    return dwBox('bounty',{icon:'📜', title:'Bounties', wide:true, state:ready?'ready':'', sum:ready?`${ready} ready`:`${here.length} here`, body:
      (here.length?here.slice(0,3).map(row).join(''):'<div class="meta">No bounties at this water right now.</div>')+
      `<div class="dwacts">${away?`<span class="meta">${away} ready at other waters</span>`:''}<button class="btn alt sm" data-tabgo="bounties">All bounties</button></div>`}); },
  aq(){ const r=tankRate()*60, n=S.tank.length, left=Math.max(0,3600000-(Date.now()-(S.fedT||0)));
    if(!n&&S.tankBank<1) return dwBox('aq',{icon:'🐠', title:'Aquarium', sum:'0 / h', body:`<div class="meta">Put fish on display and they earn coins while you play, even when you are away.</div><div class="dwacts"><button class="btn alt sm" data-tabgo="aquarium">Open</button></div>`});
    return dwBox('aq',{icon:'🐠', title:'Aquarium', state:S.tankBank>=1?'ready':'', sum:`<span class="coin">${fmtShort(r)}</span> / h`, body:
      `<div class="dwrow"><span class="meta">${n} / ${aqCap()} fish · waiting</span><b class="dwbig coin" id="tankbank" data-live>${fmt(S.tankBank)}</b></div>
       <div class="dwacts"><button class="btn sm" id="collectbtn" data-act="collect" ${S.tankBank<1?'disabled':''}>Collect</button>${n?`<button class="btn alt sm" data-act="feed" ${left?'disabled':''} title="Feeding gives +25% aquarium income for 30 minutes">${left?'Fed · '+cd(left,Math.ceil(left/60000)+' min'):'Feed fish'}</button>`:''}<button class="btn alt sm" data-tabgo="aquarium">Open</button></div>`}); },
  event(){ const c=S.chal, lives=liveScheds(), ready=menuDot('events'); let body='', sum='', state='';
    if(c){ const C=CHAL[c.id], left=Math.max(0,c.until-Date.now()), here=S.loc===c.loc; state='ready live';
      const best=C.ranked?Math.max(...c.rivals.map(r=>r[1])):0;
      sum=cd(left)+' left';
      body+=`<div class="dwq"><div class="dwqt"><b>${C.icon} ${esc(C.name)}${here?'':' · at '+esc(LOCS[locIdx(c.loc)].name)}</b><span class="meta">${C.ranked?(c.best?'Your best '+c.best.toFixed(2)+' kg · place '+chalPlace(c):'No fish weighed yet')+' · to beat '+best.toFixed(2)+' kg':esc(C.rule(c))+': '+c.prog+' / '+c.need}</span>${dwBar(C.ranked?Math.min(1,(c.best||0)/best):c.prog/c.need,'linear-gradient(90deg,#7fe3c4,#ffd36a)')}</div></div>`; }
    for(const e of lives){ const l=schedLeft(e); state=state||'live'; if(!sum) sum=e.icon+' live';
      body+=`<div class="dwq"><div class="dwqt"><b>${e.icon} ${esc(e.name)} <span class="dwlive">LIVE</span></b><span class="meta">${esc(e.what)} · ${cd(l)} left</span>${dwBar(l/(e.len*MIN),e.col)}</div></div>`; }
    if(!lives.length){ const nx=SCHED.map(e=>[e,schedNext(e)]).sort((a,b)=>a[1]-b[1])[0]; if(nx){ body+=`<div class="dwrow"><span class="meta">Next: ${nx[0].icon} ${esc(nx[0].name)} in ${cd(nx[1])}</span></div>`; if(!sum) sum='next in '+cd(nx[1]); } }
    if(!c&&ready) body+=`<div class="dwrow"><span class="meta">${ready} challenge${ready===1?'':'s'} ready to start</span></div>`;
    return dwBox('event',{icon:'📅', title:'Events', wide:true, state:state||(ready?'ready':''), sum, body:body+`<div class="dwacts"><button class="btn ${!c&&ready?'':'alt'} sm" data-tabgo="events">${c?'Challenge':ready?'Start a challenge':'Calendar'}</button></div>`}); },
  hunt(){ const hs=huntsAt(S.loc).filter(id=>SPI[id]), can=Object.values(SPI).some(s=>s.loc===S.loc&&huntable(s)&&!hs.includes(s.id)); if(!hs.length&&!can) return '';
    const L=LOCS[locIdx(S.loc)];
    return dwBox('hunt',{icon:'🎯', title:'Hunts', sum:`${hs.length} / ${HUNT_MAX}`, body:(hs.length?`<div class="dwchips">${hs.map(id=>{ const s=SPI[id], ok=timeOk(s,phase()); return `<span class="dwchip" title="${ok?'Can bite now':'Bites only at '+(s.time==='night'?'night':'day')}"><i style="background:${RAR[s.r].c}"></i>${esc(huntLabel(s))}<span class="meta">${ok?fmtOdds(huntChance(s)):'waits for '+(s.time==='night'?'night':'day')}</span></span>`; }).join('')}</div>`
        :`<div class="meta">Pick up to ${HUNT_MAX} fish you are still missing at ${esc(L.name)}: each turns up ${HUNT_MULT}× as often.</div>`)+`<div class="dwacts"><button class="btn alt sm" data-act="dhunts">${hs.length?'Manage':'Pick fish'}</button></div>`}); },
  prog(){ const need=xpNeed(S.lvl), ups=Object.keys(GEAR).filter(k=>{ const c=GEAR[k].cost[S.gear[k]+1]; return c!=null&&S.money>=c; }).length, pts=ptsFree();
    return dwBox('prog',{icon:'⭐', title:'Level '+S.lvl, state:ups||pts?'ready':'', sum:Math.floor(S.xp/need*100)+'%', body:
      `${dwBar(S.xp/need,'linear-gradient(90deg,#7fe3c4,#5fb4ff)')}<div class="dwrow"><span class="meta">${fmt(Math.floor(S.xp))} / ${fmt(need)} XP to level ${S.lvl+1}</span></div>
       ${ups||pts?`<div class="dwacts">${ups?`<button class="btn sm" data-tabgo="shop">${ups} upgrade${ups===1?'':'s'} you can afford</button>`:''}${pts?`<button class="btn sm" data-tabgo="skills">${pts} skill point${pts===1?'':'s'}</button>`:''}</div>`:''}`}); },
  gear(){ const r=rod(), bt=BAIT[S.baitSel]||BAIT.worm, bs=Object.keys(BK).map(k=>[k,rodBonus(k)]).filter(([,v])=>v>0).slice(0,3).map(([k,v])=>fmtB(k,v));
    return dwBox('gear',{icon:'🎣', title:'Equipment', sum:esc(r.name), body:
      `<div class="dwrow"><span class="meta"><b>${esc(r.name)}</b>${bs.length?' · '+bs.join(', '):''}</span></div><div class="dwrow"><span class="meta">Bait: <b>${esc(bt.name)}</b>${S.baitSel==='worm'?' (free)':' · '+S.bait[S.baitSel]+' left'}</span></div>
       <div class="dwacts"><button class="btn alt sm" data-act="dbait">Change bait</button><button class="btn alt sm" data-tabgo="rods">Rods</button></div>`}); }
};
function dashHTML(id){ try{ return DW[id](); }catch(e){ return ''; } }
// things waiting in pages the cards do not cover (feats, the pass, the boardwalk...)
function dashWaiting(){ const skip=new Set(['cooler','bounties','aquarium','events']); const out=[];
  for(const s of MENU_SECS) for(const t of s.tabs){ if(skip.has(t)) continue; const n=menuDot(t); if(n) out.push(`<button class="dwpill" type="button" data-tabgo="${t}"><span aria-hidden="true">${menuTabLabel(t)[0]}</span>${esc(menuTabLabel(t)[1])}<b>${n>99?'99+':n}</b></button>`); }
  return out.length?`<div class="dwwait" data-w="wait"><span class="meta">Waiting for you</span>${out.join('')}</div>`:''; }
function renderDash(P){ const keep=P.scrollTop; P.innerHTML=`<div class="dash" aria-label="Fishing dashboard">${dashWaiting()}${DW_ORDER.map(dashHTML).join('')}</div>`; P.scrollTop=keep; dashCache(P); }
// live updates: only the cards whose content changed are redrawn (countdowns and the aquarium total tick in place)
const dwStrip=h=>h.replace(/(data-live[^>]*>)[^<]*/g,'$1').replace(/data-cd="\d+"/g,'');
const dwLast={};
function dashCache(P){ for(const id of DW_ORDER) dwLast[id]=null; P.querySelectorAll('.dash > [data-w]').forEach(el=>dwLast[el.dataset.w]=dwStrip(el.outerHTML)); }
function dashTick(){ if(MENU_OPEN||S.tab!==DASH||document.hidden) return; const P=$('panel'), D=P&&P.querySelector('.dash'); if(!D) return;
  const now=Date.now(); D.querySelectorAll('[data-cd]').forEach(el=>{ const ms=+el.dataset.cd-now; if(el.id!=='tankbank'){ const t=/min$/.test(el.textContent)?Math.max(1,Math.ceil(ms/60000))+' min':mmss(Math.max(0,Math.ceil(ms/1000))); if(el.textContent!==t) el.textContent=t; } });
  if(dashPress) return;
  const want=[dashWaiting(),...DW_ORDER.map(dashHTML)].filter(Boolean), ids=want.map(h=>(h.match(/data-w="(\w+)"/)||[])[1]), have=[...D.children].map(el=>el.dataset.w);
  if(ids.join()!==have.join()){ renderDash(P); return; } // a card appeared or went away
  want.forEach((h,i)=>{ const s=dwStrip(h); if(dwLast[ids[i]]!==s){ const el=D.children[i]; const tmp=document.createElement('div'); tmp.innerHTML=h; const n=tmp.firstElementChild; el.replaceWith(n); dwLast[ids[i]]=s; } }); }
setInterval(dashTick,500);
{ const P=$('panel'); P.addEventListener('pointerdown',()=>{ if(S.tab===DASH) dashPress=true; }); addEventListener('pointerup',()=>{ dashPress=false; }); addEventListener('pointercancel',()=>{ dashPress=false; }); }
function dashFlash(id){ const el=document.querySelector('#panel .dash [data-w="'+id+'"]'); if(!el) return; if(dashCol()[id]){ delete dashCol()[id]; renderPanel(); return dashFlash(id); } el.classList.remove('flash'); void el.offsetWidth; el.classList.add('flash'); try{ el.scrollIntoView({block:'nearest',behavior:'smooth'}); }catch(e){} }
// dashboard actions that are not already game actions
{ const _xa=extraAct2; extraAct2=function(b){ const a=b.dataset.act, k=b.dataset.k;
    if(a==='dcol'){ const c=dashCol(); if(c[k]) delete c[k]; else c[k]=1; return 'render'; }
    if(a==='dhunts'){ encLoc=S.loc; encSel=null; S.settings.logShow='hunt'; setTab('journal'); save(); return 'skip'; }
    if(a==='dbait'){ searchGo(['','shop',['tackleview','bait']]); return 'skip'; }
    if(a==='dockcopy'){ if(!S.docks||!S.docks[k]||k===S.loc) return 'skip'; if(dockCopyAsk!==k){ dockCopyAsk=k; renderPanel(); return 'skip'; } dockCopyAsk=null; dockStore(); dockApply(S.docks[k]); S.docks[S.loc]=dockCopy(S.dock); toast('Copied the '+LOCS[locIdx(k)].name+' dock here'); return 'render'; }
    if(a==='dockpick'){ dockCopyAsk=null; dockPick=(k===S.loc||dockPick===k)?null:k; renderPanel(); return 'skip'; }
    if(a!=='dockcopy') dockCopyAsk=null;
    return _xa(b); }; }
// the panel shows the dashboard in fishing mode, the page otherwise
{ const _rp=renderPanel; renderPanel=function(){ dockSync(); if(S.tab===DASH){ const P=$('panel'); if(P){ renderDash(P); P.dataset.tab035=DASH; } try{ menuSync(); }catch(e){} return; } const r=_rp.apply(this,arguments); try{ menuHead(); }catch(e){} return r; }; }
setInterval(()=>{ if(MENU_OPEN){ const c=$('mocoin'), v=fmtShort(S.money); if(c&&c.textContent!==v){ c.textContent=v; c.title=fmt(S.money)+' coins'; } menuHead(); } },250);
// start in fishing mode; the last page opens again from its category
{ if(S.tab&&S.tab!==DASH) S.settings.pageLast=S.tab; S.tab=DASH; }

if(/[?&]test\b/.test(location.search)) window.__ui={open:openMenu, close:closeMenu, isOpen:()=>MENU_OPEN, dash:()=>[...document.querySelectorAll('#panel .dash > [data-w]')].map(e=>e.dataset.w), dockSync, dockSummary};

document.head.insertAdjacentHTML('beforeend',`<style>
/* ---------- category labels ---------- */
#tabs.secmode .secb .secshort{display:none}
@media (max-width:520px){#tabs.secmode .secb .secfull{display:none}#tabs.secmode .secb .secshort{display:inline}}
body.pc-wide:not(.menu-open) #tabs.secmode .secb .secfull{display:none}body.pc-wide:not(.menu-open) #tabs.secmode .secb .secshort{display:inline}
@media (orientation:landscape) and (max-height:560px){#tabs.secmode .secb .secfull{display:none}#tabs.secmode .secb .secshort{display:inline}}
#tabs.secmode .secb .seclive{position:absolute;top:-7px;left:8px;padding:0 5px;height:16px;border-radius:6px;background:#ff5a6a;color:#fff;font:800 9px/16px var(--display,system-ui);letter-spacing:.06em;box-shadow:0 0 10px #ff5a6a88;animation:livepulse 1.6s ease-in-out infinite}
#tabs.secmode .secb .seclive[hidden]{display:none}
@media (max-width:860px){#tabs.secmode .secb .seclive{left:calc(50% - 38px);top:-4px}}
@keyframes livepulse{50%{box-shadow:0 0 2px #ff5a6a44}}
@media (prefers-reduced-motion:reduce){#tabs.secmode .secb .seclive{animation:none}}
/* ---------- the full-screen menu ---------- */
#menuov{position:fixed;inset:0;z-index:45;display:flex;justify-content:center;background:radial-gradient(120% 70% at 50% -10%,#16284a 0%,#0a1322 55%,#070d18 100%);color:var(--ink,#eef3f8);overscroll-behavior:contain}
#menuov[hidden]{display:none}
#menuov.mo-show{animation:moFade .18s ease-out}
@keyframes moFade{from{opacity:0}to{opacity:1}}
#menuov .mo-in{width:100%;max-width:1280px;height:100%;box-sizing:border-box;display:grid;grid-template-columns:auto minmax(0,1fr) auto;grid-template-rows:auto auto minmax(0,1fr);grid-template-areas:"back secs tools" "sub sub sub" "body body body";column-gap:14px;row-gap:6px;padding:max(12px,env(safe-area-inset-top)) max(16px,env(safe-area-inset-right)) 0 max(16px,env(safe-area-inset-left))}
#menuov .mo-top,#menuov .mo-nav,body #menuov #tabs.secmode{display:contents!important}
#menuov .mo-back{grid-area:back;align-self:center;display:inline-flex;align-items:center;gap:8px;min-height:46px;padding:0 16px 0 12px;border-radius:14px;border:1px solid #7fe3c455;background:linear-gradient(180deg,#173a4a,#10283a);color:#dff8ee;font:800 14px var(--display,system-ui);cursor:pointer;box-shadow:0 4px 14px #02060f66;transition:border-color .15s,box-shadow .15s,transform .12s}
#menuov .mo-back:hover{border-color:#7fe3c4;box-shadow:0 4px 14px #02060f66,0 0 16px #7fe3c433;transform:translateY(-1px)}
#menuov .mo-back .mo-bi{flex:0 0 auto}
#menuov .mo-title{grid-area:title;display:none;align-self:center;min-width:0;font:800 17px var(--display,system-ui);color:#fff3cf;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
#menuov .mo-tools{grid-area:tools;align-self:center;display:flex;align-items:center;gap:8px}
#menuov .mo-coin{display:inline-flex;align-items:center;min-height:40px;padding:0 12px;border-radius:12px;background:#0d1a2c;border:1px solid var(--line,#26385180);font:800 15px var(--display,system-ui);white-space:nowrap}
#menuov .mo-pause{display:inline-flex;align-items:center;gap:4px;min-height:32px;padding:0 10px;border-radius:999px;background:#7fe3c418;border:1px solid #7fe3c455;color:#bff3e2;font:700 12px var(--display,system-ui);white-space:nowrap}
#menuov .mo-pause[hidden]{display:none}
#menuov .mo-tb{width:42px;height:42px;border-radius:12px;border:1px solid var(--line,#26385180);background:#111c2e;color:#dbe7f3;font-size:18px;cursor:pointer;transition:border-color .15s,color .15s}
#menuov .mo-tb:hover,#menuov .mo-tb.on{border-color:var(--gold,#ffd36a);color:#ffd36a}
#menuov .mo-back:focus-visible,#menuov .mo-tb:focus-visible{outline:2px solid var(--gold,#ffd36a);outline-offset:2px}
body #menuov #tabs.secmode .secbar{grid-area:secs;align-self:center;min-width:0}
body #menuov #tabs.secmode .subbar{grid-area:sub;padding:4px 2px 6px}
#menuov .mo-body{grid-area:body;min-height:0;display:flex;flex-direction:column}
body #menuov #panel{display:block!important;flex:1 1 auto;min-height:0;max-height:none;height:auto;margin:0;overflow-y:auto;overflow-x:hidden;overscroll-behavior:contain;-webkit-overflow-scrolling:touch;padding:4px 4px calc(24px + env(safe-area-inset-bottom));border-radius:0;background:transparent;border:0;box-shadow:none;scrollbar-width:thin;scrollbar-color:#3a5070 transparent}
#menuov #panel > .crumb{display:none}
#menuov > #toast{position:fixed;top:calc(74px + env(safe-area-inset-top));z-index:60}
@media (min-width:861px){body #menuov #tabs.secmode .secb{flex-direction:row;gap:8px;font-size:14px;min-height:46px;padding:4px 10px}body #menuov #tabs.secmode .secdot{right:8px}}
@media (max-width:1100px){#menuov .mo-in{grid-template-areas:"back title tools" "secs secs secs" "sub sub sub" "body body body"}}
@media (max-width:640px){#menuov .mo-in{column-gap:8px;padding-left:max(10px,env(safe-area-inset-left));padding-right:max(10px,env(safe-area-inset-right))}#menuov .mo-back{min-height:42px;padding:0 12px 0 10px}#menuov .mo-back .mo-bl,#menuov .mo-back svg:not(.mo-bi){display:none}#menuov .mo-back::after{content:"Fishing";font-size:13px}#menuov .mo-tb{width:38px;height:38px}#menuov .mo-coin{min-height:36px;padding:0 9px;font-size:13px}#menuov .mo-pause span{display:none}}
/* phones held upright: the categories stay docked along the bottom edge, in menus too */
@media (max-width:700px) and (orientation:portrait){#menuov .mo-in{grid-template-areas:"back title tools" "sub sub sub" "body body body"}body #menuov #panel{padding-bottom:calc(92px + env(safe-area-inset-bottom))}#menuov > #toast{top:calc(60px + env(safe-area-inset-top))}}
/* phones held sideways: one compact row */
@media (orientation:landscape) and (max-height:560px){#menuov .mo-in{grid-template-areas:"back secs tools" "sub sub sub" "body body body";row-gap:2px;padding-top:max(6px,env(safe-area-inset-top))}#menuov .mo-title{display:none}#menuov .mo-back{min-height:38px}#menuov .mo-back .mo-bl,#menuov .mo-back svg:not(.mo-bi){display:none}#menuov .mo-back::after{content:"Fishing";font-size:12px}#menuov .mo-tb{width:36px;height:36px}#menuov .mo-coin{min-height:34px;font-size:12px}#menuov .mo-pause{display:none}}
html.menu-open,body.menu-open{overflow:hidden!important}
body.menu-open #towater,body.menu-open .dlprev{display:none!important}
.wrap.wrapin{animation:wrapin .2s ease-out}
@keyframes wrapin{from{opacity:.55}to{opacity:1}}
@media (prefers-reduced-motion:reduce){#menuov.mo-show,.wrap.wrapin{animation:none}}
#searchov{z-index:70!important}
/* ---------- the dashboard ---------- */
#panel .dash{display:grid;grid-template-columns:repeat(auto-fill,minmax(250px,1fr));grid-auto-flow:row dense;gap:10px;align-items:start}
#panel .dash .dw.wide{grid-column:1 / -1}
@media (min-width:1500px){body.pc-wide #panel .dash .dw.wide{grid-column:auto}}
#panel .dw{position:relative;min-width:0;border-radius:16px;border:1px solid var(--line,#26385180);background:var(--glass,#111c2e);box-shadow:var(--lit,none),0 4px 14px #02060f44;transition:border-color .2s,box-shadow .2s}
#panel .dw.ready{border-color:#ffd36a77;box-shadow:var(--lit,none),0 0 0 1px #ffd36a22,0 0 20px #ffd36a1c}
#panel .dw.live{border-color:#7fe3c477}
#panel .dw.warn{border-color:#ff8a5caa;box-shadow:var(--lit,none),0 0 18px #ff8a5c26}
#panel .dw.flash{animation:dwflash .9s ease}
@keyframes dwflash{30%{box-shadow:0 0 0 2px #ff8a5c,0 0 26px #ff8a5c88}}
#panel .dwh{display:flex;align-items:center;gap:8px;width:100%;min-height:44px;padding:8px 12px;border:0;background:transparent;color:inherit;font:inherit;text-align:left;cursor:pointer;border-radius:16px}
#panel .dwh:hover .dwt{color:#fff}
#panel .dwh:focus-visible{outline:2px solid var(--gold,#ffd36a);outline-offset:-2px}
#panel .dwi{font-size:17px;line-height:1;width:22px;text-align:center;flex:0 0 auto}
#panel .dwt{font:800 14px var(--display,system-ui);color:#e8eff7;letter-spacing:.01em;white-space:nowrap}
#panel .dws{margin-left:auto;font:700 12.5px var(--display,system-ui);color:#a9bdd4;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;min-width:0}
#panel .dw.ready .dws{color:#ffe08a}#panel .dw.warn .dws{color:#ffb39a}
#panel .dwc{width:8px;height:8px;border-right:2px solid #7f97b2;border-bottom:2px solid #7f97b2;transform:rotate(45deg);margin:0 2px 3px 4px;flex:0 0 auto;transition:transform .2s}
#panel .dw.col .dwc{transform:rotate(-45deg);margin-bottom:0}
#panel .dwb{padding:0 12px 11px;display:flex;flex-direction:column;gap:7px}
#panel .dwrow{display:flex;align-items:baseline;justify-content:space-between;gap:8px;min-width:0}
#panel .dwrow .meta{min-width:0}
#panel .dwbig{font:800 20px var(--display,system-ui);white-space:nowrap}
#panel .dwwarn{color:#ffb39a}
#panel .dwacts{display:flex;flex-wrap:wrap;align-items:center;justify-content:flex-end;gap:6px}
#panel .dwacts > .meta{margin-right:auto}
#panel .dwacts .btn{min-height:34px}
#panel .dwbar{height:6px;border-radius:6px;background:#ffffff12;overflow:hidden}
#panel .dwbar i{display:block;height:100%;border-radius:6px;background:linear-gradient(90deg,#ffd36a,#f2a84e);transition:width .4s ease}
#panel .dwq{display:flex;align-items:center;gap:10px;padding:7px 9px;border-radius:12px;background:#ffffff07;border:1px solid #ffffff10}
#panel .dwq.done{background:#ffd36a12;border-color:#ffd36a44}
#panel .dwqt{flex:1;min-width:0;display:flex;flex-direction:column;gap:3px}
#panel .dwqt b{font-size:13px;line-height:1.25;color:#eef3f8}
#panel .dwlive{display:inline-block;margin-left:4px;padding:0 5px;border-radius:5px;background:#ff5a6a;color:#fff;font:800 9px/15px var(--display,system-ui);letter-spacing:.06em;vertical-align:1px}
#panel .dwchips{display:flex;flex-wrap:wrap;gap:6px}
#panel .dwchip{display:inline-flex;align-items:center;gap:6px;padding:4px 10px;border-radius:999px;border:1px solid #ffb36a55;background:#ffb36a12;color:#ffe2c4;font-weight:700;font-size:12px}
#panel .dwchip i{width:8px;height:8px;border-radius:50%;flex:0 0 auto}
#panel .dwchip .meta{font-size:11px}
#panel .dwwait{grid-column:1 / -1;display:flex;flex-wrap:wrap;align-items:center;gap:6px}
#panel .dwwait > .meta{font:800 11px var(--display,system-ui);letter-spacing:.08em;text-transform:uppercase;margin-right:2px}
#panel .dwpill{display:inline-flex;align-items:center;gap:6px;min-height:32px;padding:0 6px 0 11px;border-radius:999px;border:1px solid #ffd36a55;background:#ffd36a14;color:#fff3cf;font:700 12.5px var(--display,system-ui);cursor:pointer;transition:background .15s,border-color .15s}
#panel .dwpill:hover{background:#ffd36a26;border-color:#ffd36a}
#panel .dwpill b{min-width:20px;height:20px;padding:0 6px;box-sizing:border-box;border-radius:999px;background:linear-gradient(180deg,#ffb36a,#ff7a4a);color:#2a1206;font:800 11px/20px var(--display,system-ui);text-align:center}
body.phone-app #panel .dash{grid-template-columns:minmax(0,1fr);gap:7px}
body.phone-app #panel .dwh{min-height:40px;padding:6px 10px}
body.phone-app #panel .dwb{padding:0 10px 9px;gap:6px}
@media (orientation:landscape) and (max-height:560px){#panel .dash{grid-template-columns:minmax(0,1fr);gap:7px}#panel .dwh{min-height:38px;padding:5px 10px}#panel .dwb{padding:0 10px 8px}}
/* ---------- the Dock page ---------- */
#panel .dockbar{margin:8px 0 6px;display:flex;flex-direction:column;gap:8px}
#panel .dock-h{display:flex;flex-wrap:wrap;align-items:center;gap:6px}
#panel .dock-h > .meta{font:800 11px var(--display,system-ui);letter-spacing:.08em;text-transform:uppercase;margin-right:2px}
#panel .dock-c{display:inline-flex;align-items:baseline;gap:6px;min-height:34px;padding:0 12px;border-radius:999px;border:1px solid var(--line,#26385180);background:#111c2ecc;color:#bcd0e4;font:700 12.5px var(--display,system-ui);cursor:pointer;transition:border-color .15s,background .15s}
#panel .dock-c span{font-weight:600;font-size:11px;color:#8aa0b8}
#panel .dock-c:hover{border-color:#5a7ea8aa;color:#eef3f8}
#panel .dock-c[aria-pressed="true"]{border-color:var(--gold,#ffd36a);color:#fff3cf;background:linear-gradient(180deg,#2a3a56,#1c2a42)}
#panel .dock-c.here span{color:#7fe3c4}
#panel .dock-pick{display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:8px;padding:8px 11px;border-radius:12px;background:#ffffff07;border:1px solid #ffffff12}
#panel .dock-pick .btn.warn{border-color:#ff8a5c;color:#ffd2c0}
/* tablets and small windows: the water name gets the room it needs in the top bar */
@media (max-width:980px){body:not(.phone-app) .hud .stat.loc{flex-grow:2;min-width:0}body:not(.phone-app) .hud > .stat:not(.loc){min-width:0}}
</style>`);
// the water's edge toggle now hides the dashboard (the menus open full screen anyway)
(function(){ const b=$('sidetog'); if(!b) return; const lab=()=>{ const off=document.body.classList.contains('side-off'), t=off?'Show the dashboard':'Bigger water: hide the dashboard'; b.title=t; b.setAttribute('aria-label',t); };
  b.addEventListener('click',()=>setTimeout(lab,0)); lab();
  SEARCH_IDX.forEach((e,i)=>{ if(e[0]==='Hide menus') SEARCH_IDX[i]=['Bigger water: hide the dashboard','settings',null,'hide menus dashboard collapse full water bigger screen']; }); })();
