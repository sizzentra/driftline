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
const DOCK_KEYS=['wood','decor','style','pos','petPos','pet2Pos','light','hull'];

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
KEYS.forEach((k,i)=>{ if(k[0]==='Esc') KEYS[i]=['Esc','Close the menu, a card or the search']; if(k[0]==='M') KEYS[i]=['M','Open or close the menu']; });
// rebuild the category row with the new categories (the click handler finds them by data-sec)
(function(){ const T=$('tabs'), bar=T&&T.querySelector('.secbar'); if(!bar) return;
  const svg=p=>`<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${p}</svg>`;
  bar.setAttribute('aria-label','Menu categories');
  bar.innerHTML=MENU_SECS.map(s=>`<button type="button" class="secb" data-sec="${s.id}" aria-pressed="false" title="${esc(s.name)}"><span class="seci">${svg(s.icon)}</span><span class="secl"><span class="secfull">${s.name}</span><span class="secshort">${s.short}</span></span><span class="seclive" hidden>LIVE</span><span class="secdot" hidden></span></button>`).join('');
  menuSubKey=''; })();

// ---------- per-water docks ----------
function dockCopy(d){ d=d||{}; return {wood:d.wood||'oak', decor:Array.isArray(d.decor)?d.decor.filter(x=>typeof x==='string'&&DOCKI[x]).slice(0,DOCK_SLOTS):[], style:typeof d.style==='string'?d.style:'plank',
  pos:(d.pos&&typeof d.pos==='object')?Object.fromEntries(Object.entries(d.pos).filter(([k,v])=>typeof v==='number'&&isFinite(v))):{}, petPos:typeof d.petPos==='number'?d.petPos:null, pet2Pos:typeof d.pet2Pos==='number'?d.pet2Pos:null, ...(d.light&&homeLightOk(d.light)?{light:d.light}:{}), ...(d.hull&&homeHullOk(d.hull)?{hull:d.hull}:{})}; }
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
function rodsClean(st){ try{ const r=st.rods; if(!r) return; r.owned=uniq(['bamboo',...(r.owned||[]).filter(x=>ROD_I[x])]); if(!r.owned.includes(r.eq)) r.eq='bamboo'; }catch(e){} }
function perksClean(st){ const keep=S; try{ S=st; if(ptsFree()<0) st.perks={}; }catch(e){} finally{ S=keep; } } // more ranks than points (a damaged save): refund them
rodsClean(S); perksClean(S);
{ const _mig04=migrate; migrate=function(o){ const st=_mig04(o); rodsClean(st); perksClean(st); try{ if(!st.docks||typeof st.docks!=='object'||Array.isArray(st.docks)) st.docks={};
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
  G.hold=false; try{ spaceDown=false; }catch(e){} MO.hidden=false; if(document.body.classList.contains('pch-on')){ MO.classList.add('mo-show'); try{ const sb=MO.querySelector('#tabs .subbar'); if(sb&&sb.animate&&!matchMedia('(prefers-reduced-motion:reduce)').matches) sb.animate([{opacity:0,transform:'translateY(4px)'},{opacity:1,transform:'none'}],{duration:200,easing:'ease-out'}); }catch(e){} } else { MO.classList.remove('mo-show'); void MO.offsetWidth; MO.classList.add('mo-show'); }
  document.body.classList.add('menu-open'); document.documentElement.classList.add('menu-open');
  if(!menuHist){ try{ history.pushState({dlmenu:1},''); menuHist=true; }catch(e){} }
  const sb=T.querySelector('.secb.on')||MO.querySelector('.mo-back'); try{ (document.activeElement&&document.activeElement.blur)&&document.activeElement.blur(); sb&&sb.focus({preventScroll:true}); }catch(e){} }
function menuUnmount(){ const {T,P,toast,stage}=menuEls(); const [a,b]=holdTab; if(a) a.parentNode.insertBefore(T,a); if(b) b.parentNode.insertBefore(P,b); if(toast&&stage) stage.insertBefore(toast,$('card')&&$('card').parentNode===stage?$('card'):null);
  MO.hidden=true; document.body.classList.remove('menu-open'); document.documentElement.classList.remove('menu-open');
  const w=document.querySelector('.wrap'); if(w){ w.classList.remove('wrapin'); void w.offsetWidth; w.classList.add('wrapin'); }
  try{ document.activeElement&&document.activeElement.blur&&document.activeElement.blur(); }catch(e){}
 }
// Two modes. MENU_WANT says which one the player asked for; S.tab is the page shown inside the menu ('dash' = Overview).
// Any page opened from anywhere (a link, the goal chip, search, settings, a full cooler) opens the menu; refreshing the
// page after an action never does. Closing the menu always returns to the Overview, so the menu opens on it next time.
let MENU_WANT=false;
function menuMode(){ const open=MENU_WANT; if(open===MENU_OPEN) return; MENU_OPEN=open; if(open) menuMount(); else { menuUnmount(); if(menuHist){ menuHist=false; try{ history.back(); }catch(e){} } } }
addEventListener('popstate',()=>{ if(menuHist){ menuHist=false; if(MENU_OPEN) closeMenu(); } });
function openMenu(t){ MENU_WANT=true; setTab(t||DASH); save(); }
function closeMenu(){ if(!MENU_OPEN&&!MENU_WANT) return; MENU_WANT=false; setTab(DASH); save(); }
function toggleMenu(){ if(MENU_OPEN) closeMenu(); else openMenu(DASH); }
{ const _st=setTab; setTab=function(t){ if(!t) t=DASH; if(t!==DASH) MENU_WANT=true; menuMode(); _st(t); menuHead(); }; }
function menuHead(){ if(!MENU_OPEN) return; const sec=menuSecOf(S.tab), t=MO.querySelector('.mo-title'), nm=S.tab===DASH?'Overview':sec?(sec.id==='more'?'Settings':(sec.short||sec.name)):'';
  if(t.textContent!==nm) t.textContent=nm; const pz=MO.querySelector('.mo-pause'), busy=!['idle','rest','result','event'].includes(G.st); if(pz.hidden===busy) pz.hidden=!busy;
  }
MO.addEventListener('click',e=>{ const b=e.target.closest('[data-mo]'); if(!b) return; e.stopPropagation(); const m=b.dataset.mo;
  if(m==='close') closeMenu(); else if(m==='home'){ if(S.tab!==DASH){ setTab(DASH); save(); } } else if(m==='search'){ const s=$('searchbtn'); if(s) s.click(); } else if(m==='settings'){ const mt=MENU_MORE.tabs, last=menuLast().more; setTab(S.tab!=='settings'&&mt.includes(last)&&menuSecOf(S.tab)!==MENU_MORE?last:'settings'); save(); } });
// M opens and closes the menu (it used to fold the side menus away)
addEventListener('keydown',e=>{ if((e.key!=='m'&&e.key!=='M')||e.ctrlKey||e.metaKey||e.altKey) return; const t=(document.activeElement&&document.activeElement.tagName)||''; if(/INPUT|TEXTAREA|SELECT/.test(t)) return; const sov=$('searchov'); if(sov&&!sov.hidden) return; e.preventDefault(); e.stopImmediatePropagation(); toggleMenu(); },true);
// Esc closes the menu (the search box, a confirmation or a card handle Esc themselves first)
addEventListener('keydown',e=>{ if(e.key!=='Escape'||!MENU_OPEN) return; const sov=$('searchov'); if(sov&&!sov.hidden) return; const tag=(document.activeElement&&document.activeElement.tagName)||'';
  if(/INPUT|TEXTAREA|SELECT/.test(tag)){ document.activeElement.blur(); return; } e.preventDefault(); e.stopImmediatePropagation(); closeMenu(); },true);
// Space belongs to the page while a menu is open (buttons, scrolling), never to the rod behind it
addEventListener('keydown',e=>{ if(MENU_OPEN&&e.code==='Space') e.stopImmediatePropagation(); },true);
addEventListener('keyup',e=>{ if(MENU_OPEN&&e.code==='Space') e.stopImmediatePropagation(); },true);
// the line waits while a menu is open (rest mode keeps fishing by itself); the water draws a few times a second behind it
{ const _up=update; update=function(dt){ if(S.dockAt!==S.loc) dockSync(); if(MENU_OPEN){ if(G.st==='rest') restTick(dt); return; } return _up(dt); }; }
{ let lastD=0; const _dr=draw; draw=function(now){ if(MENU_OPEN&&now-lastD<250&&!resize.force) return; lastD=now; return _dr(now); }; }
// a full cooler: show it on the dashboard instead of throwing you into a menu
// a full cooler when you try to cast: the game opens the Cooler page (in the full-screen menu)
// keep the category row honest in fishing mode (nothing is "open") and mark live events
{ const _ms=menuSync; menuSync=function(){ _ms(); try{ const T=$('tabs'), live=!!(S.chal||liveScheds().length);
    T.querySelectorAll('.secb').forEach(b=>{ const l=b.querySelector('.seclive'); if(l){ const on=b.dataset.sec==='chal'&&live; if(l.hidden===on) l.hidden=!on; } }); if(document.body.classList.contains('chal-live')!==live) document.body.classList.toggle('chal-live',live); /* while LIVE shows, the Challenges count hides (director, 2026-11-19: not both) */
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
      else { const sp=SPI[b.sp]; if(!sp) return ''; what=b.legend&&!S.journal[sp.id]?'Catch the legend of '+LOCS[locIdx(sp.loc)].name:b.type==='count'?`Catch ${b.n} × ${sp.name}`:`Catch ${/^[aeiou]/i.test(sp.name)?"an":"a"} ${sp.name} of ${kgStr(b.kg)} or more`; if(b.type==='count'){ p=Math.min(1,b.have/b.n); pt=Math.min(b.have,b.n)+' / '+b.n; } }
      const rw=Math.round(b.reward*coinMult()*1);
      return `<div class="dwq${d?' done':''}"><div class="dwqt"><b>${esc(what)}</b><span class="meta"><span class="coin">${fmtShort(rw)}</span>${b.scales?' + '+b.scales+' Scales':''}${pt?' · '+pt:d?'':' · not yet'}</span>${pt&&!d?dwBar(p):''}</div>${d?`<button class="btn sm" data-act="claim" data-i="${i}">Claim</button>`:''}</div>`; };
    return dwBox('bounty',{icon:'📜', title:'Bounties', wide:true, state:ready?'ready':'', sum:ready?`${ready} ready`:`${here.length} here`, body:
      (here.length?here.slice(0,3).map(row).join(''):'<div class="meta">No bounties at this water right now.</div>')+
      `<div class="dwacts">${away?`<span class="meta">${away} ready at other waters</span>`:''}<button class="btn alt sm" data-tabgo="bounties">All bounties</button></div>`}); },
  aq(){ const r=tankRate()*60, n=S.tank.length, left=Math.max(0,3600000-(Date.now()-(S.fedT||0)));
    if(!n&&S.tankBank<1) return dwBox('aq',{icon:'🐠', title:'Aquarium', sum:'0 / h', body:`<div class="meta">Put fish on display and they earn coins while you play, even when you are away.</div><div class="dwacts"><button class="btn alt sm" data-tabgo="aquarium">Open</button></div>`});
    return dwBox('aq',{icon:'🐠', title:'Aquarium', state:S.tankBank>=1?'ready':'', sum:`<span class="coin">${fmtShort(r)}</span> / h`, body:
      `<div class="dwrow"><span class="meta">${n} / ${aqCap()} fish · waiting</span><b class="dwbig coin" id="tankbank" data-live>${fmtShort(S.tankBank)}</b></div>
       <div class="dwacts"><button class="btn sm" id="collectbtn" data-act="collect" ${S.tankBank<1?'disabled':''}>Collect</button>${n?`<button class="btn alt sm" data-act="feed" ${left?'disabled':''} title="Feeding gives +25% aquarium income for 30 minutes">${left?'Fed · '+cd(left,Math.ceil(left/60000)+' min'):'Feed fish'}</button>`:''}<button class="btn alt sm" data-tabgo="aquarium">Open</button></div>`}); },
  event(){ const c=S.chal, lives=liveScheds(), ready=menuDot('events'); let body='', sum='', state='';
    if(c){ const C=CHAL[c.id], left=Math.max(0,c.until-Date.now()), here=S.loc===c.loc; state='ready live';
      const best=C.ranked?Math.max(...c.rivals.map(r=>r[1])):0;
      sum=cd(left)+' left';
      body+=`<div class="dwq"><div class="dwqt"><b>${C.icon} ${esc(C.name)}${here?'':' · at '+esc(LOCS[locIdx(c.loc)].name)}</b><span class="meta">${C.ranked?(c.best?'Your best '+wFix(c.best,2)+' · place '+chalPlace(c):'No fish weighed yet')+' · to beat '+wFix(best,2):esc(C.rule(c))+': '+c.prog+' / '+c.need}</span>${dwBar(C.ranked?Math.min(1,(c.best||0)/best):c.prog/c.need,'linear-gradient(90deg,#7fe3c4,#ffd36a)')}</div></div>`; }
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
  gear(){ const r=rod(), bt=BAIT[S.baitSel]||BAIT.worm, bs=Object.keys(BK).map(k=>[k,rodBonus(k)]).filter(([,v])=>v>0).map(([k,v])=>fmtB(k,v)).concat(Object.entries(r.st).filter(([k])=>!BK[k]).map(([k,v])=>statTxt(k,v))).slice(0,3);
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
function dashTick(){ if(!MENU_OPEN||S.tab!==DASH||document.hidden) return; const P=$('panel'), D=P&&P.querySelector('.dash'); if(!D) return;
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
{ const _rp=renderPanel; renderPanel=function(){ dockSync(); if(S.tab===DASH){ const P=$('panel'); if(P&&MENU_OPEN){ renderDash(P); P.dataset.tab035=DASH; } try{ menuSync(); }catch(e){} return; } const r=_rp.apply(this,arguments); try{ menuHead(); }catch(e){} return r; }; }
setInterval(()=>{ if(MENU_OPEN){ const c=$('mocoin'), v=fmtShort(S.money); if(c&&c.textContent!==v){ c.textContent=v; c.title=fmt(S.money)+' coins'; } menuHead(); } },250);
// start in fishing mode; the last page opens again from its category
{ if(S.tab&&S.tab!==DASH) S.settings.pageLast=S.tab; S.tab=DASH; }

if(/[?&]test\b/.test(location.search)) window.__ui={open:openMenu, close:closeMenu, isOpen:()=>MENU_OPEN, dash:()=>[...document.querySelectorAll('#panel .dash > [data-w]')].map(e=>e.dataset.w), dockSync, dockSummary};

document.head.insertAdjacentHTML('beforeend',`<style>
body.chal-live .secb[data-sec="chal"] .secdot{display:none!important}
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
#menuov .mo-in{width:100%;max-width:none;height:100%;box-sizing:border-box;display:grid;grid-template-columns:auto minmax(0,1fr) auto;grid-template-rows:auto auto minmax(0,1fr);grid-template-areas:"back secs tools" "sub sub sub" "body body body";column-gap:14px;row-gap:6px;padding:max(12px,env(safe-area-inset-top)) max(16px,env(safe-area-inset-right)) 0 max(16px,env(safe-area-inset-left))}
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
@media (max-width:640px){#menuov .mo-in{column-gap:8px;padding-left:max(10px,env(safe-area-inset-left));padding-right:max(10px,env(safe-area-inset-right))}#menuov .mo-back{min-height:42px;padding:0 12px 0 10px}#menuov .mo-back .mo-bl,#menuov .mo-back svg:not(.mo-bi){display:none}#menuov .mo-back::after{content:"Back";font-size:13px}#menuov .mo-tb{width:38px;height:38px}#menuov .mo-coin{min-height:36px;padding:0 9px;font-size:13px}#menuov .mo-pause span{display:none}}
/* phones held upright: the categories stay docked along the bottom edge, in menus too */
@media (max-width:700px) and (orientation:portrait){#menuov .mo-in{grid-template-areas:"back title tools" "sub sub sub" "body body body"}body #menuov #panel{padding-bottom:calc(92px + env(safe-area-inset-bottom))}#menuov > #toast{top:calc(60px + env(safe-area-inset-top))}}
/* phones held sideways: one compact row */
@media (orientation:landscape) and (max-height:560px){#menuov .mo-in{grid-template-areas:"back secs tools" "sub sub sub" "body body body";row-gap:2px;padding-top:max(6px,env(safe-area-inset-top))}#menuov .mo-title{display:none}#menuov .mo-back{min-height:38px}#menuov .mo-back .mo-bl,#menuov .mo-back svg:not(.mo-bi){display:none}#menuov .mo-back::after{content:"Back";font-size:12px}#menuov .mo-tb{width:36px;height:36px}#menuov .mo-coin{min-height:34px;font-size:12px}#menuov .mo-pause{display:none}}
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
// the old "hide menus" toggle is gone (fishing is always full screen); its search entry goes too
for(let i=SEARCH_IDX.length-1;i>=0;i--) if(SEARCH_IDX[i][0]==='Hide menus') SEARCH_IDX.splice(i,1);
// the Dock page measures each decoration's drawing the first time it opens (about 90 ms); do it in idle moments after load instead
(function(){ const ids=Object.keys(typeof DOCK_H==='object'?DOCK_H:{}); let i=0; const idle=window.requestIdleCallback||(f=>setTimeout(()=>f({timeRemaining:()=>8}),200));
  const step=dl=>{ while(i<ids.length&&dl.timeRemaining()>4){ try{ dockNative(ids[i]); }catch(e){} i++; } if(i<ids.length) idle(step,{timeout:3000}); };
  setTimeout(()=>idle(step,{timeout:3000}),4000); })();
// a save that could not be read was kept aside at load: say so once
if(window.__dlUnreadable) setTimeout(()=>toast('Your saved game could not be read, so a new one started. The old file was kept on this device.'),1800);
// save codes and the account copy carry the current dock exactly as it is right now
{ const _mc=makeCode; makeCode=function(){ dockStore(); return _mc.apply(this,arguments); }; const _pc=pushCloud; pushCloud=function(){ dockStore(); return _pc.apply(this,arguments); }; }
//@layer mobile mobile/ui_topbar_land.js
// =====================================================================
// Fishing mode = the water fills the screen (the top bar stays above it). Every layout (PC wide, PC stacked, tablet,
// phone upright, phone sideways) uses the same column: top bar, then the water down to the bottom edge. The menus,
// the Overview and every page live in the full-screen menu, one tap away on the Menu button.
// =====================================================================
document.body.classList.add('dl-fish'); document.documentElement.classList.add('dl-fish');
try{ document.body.classList.remove('side-off'); localStorage.setItem('driftline-side-off','0'); }catch(e){} // the old "hide menus" switch has nothing left to hide
{ const _sho04=stageHOverride; stageHOverride=function(W,H){ try{ const w=document.querySelector('.wrap'), st=$('stage'); if(w&&st&&document.body.classList.contains('dl-fish')){ const h=Math.round(w.getBoundingClientRect().bottom-st.getBoundingClientRect().top); if(h>140) return h; } }catch(e){} return _sho04(W,H); }; }
addEventListener('orientationchange',()=>setTimeout(()=>{ try{ resize(); }catch(e){} },300));
if(window.visualViewport) visualViewport.addEventListener('resize',()=>{ clearTimeout(window.__dlvv); window.__dlvv=setTimeout(()=>{ try{ resize(); }catch(e){} },120); });
// the water's chip says where you are too (the top bar on phones has no room for the name of the water)
// phones held upright: two lines (the water, then time · weather · effect · time left) so it never runs into the streak chip
drawSceneChip=function(p,wx){ const tag=WX_TAG[wx.k], nm=curLoc().name; const big=W>=700; const bc=document.body.classList, phone=bc.contains('phone-app')||bc.contains('phone-land');
  const rest=tod(p)+' · '+wxName(wx.k)+(tag?' ('+tag+')':'')+' · '+mmss(wxLeft()); const col=wx.k==='Gilded'?'#ffc94d':tag?'#bfe8ff':'#e6efe8'; g.textAlign='left';
  if(bc.contains('phone-app')){ g.font='800 11.5px system-ui'; const t1=g.measureText(nm).width; g.font='700 11px system-ui'; const t2=g.measureText(rest).width; g.fillStyle='rgba(5,14,20,.62)'; rr(10,10,Math.max(t1,t2)+18,36,11); g.fill();
    g.fillStyle='#ffffff'; g.font='800 11.5px system-ui'; g.fillText(nm,19,24); g.fillStyle=col; g.font='700 11px system-ui'; g.fillText(rest,19,39); return; }
  const txt=rest; g.font='700 '+(big?12:11)+'px system-ui'; const tw=g.measureText(txt).width, h=big?22:20; g.fillStyle='rgba(5,14,20,.62)'; rr(10,10,tw+(big?20:16),h,h/2); g.fill(); g.fillStyle=col; g.fillText(txt,big?20:18,big?25:24); };
// (the goal chip now lives in the top bar)
document.head.insertAdjacentHTML('beforeend',`<style>
/* ---------- fishing mode: one column, the water to the bottom edge ---------- */
html.dl-fish{height:100%;overflow:hidden}
html body.dl-fish{height:100vh;height:100dvh;box-sizing:border-box;overflow:hidden;overscroll-behavior:none;margin:0;padding:max(10px,env(safe-area-inset-top)) max(12px,env(safe-area-inset-right)) max(10px,env(safe-area-inset-bottom)) max(12px,env(safe-area-inset-left))!important}
@media (max-width:700px),(max-height:560px){html body.dl-fish{padding:max(6px,env(safe-area-inset-top)) max(8px,env(safe-area-inset-right)) max(6px,env(safe-area-inset-bottom)) max(8px,env(safe-area-inset-left))!important}}
body.dl-fish .wrap{display:flex!important;flex-direction:column!important;gap:8px!important;height:100%!important;max-width:none!important;width:100%!important;grid-template-columns:none!important;grid-template-rows:none!important;overflow:hidden;position:relative;column-gap:0!important}
@media (max-height:560px){body.dl-fish .wrap{gap:5px!important}}
body.dl-fish .wrap > .hud{flex:0 0 auto;grid-column:auto!important;grid-row:auto!important;margin:0!important}
body.dl-fish .wrap > #stage{flex:1 1 0!important;min-height:0!important;width:100%!important;max-width:none!important;grid-column:auto!important;grid-row:auto!important;align-self:stretch!important;margin:0!important;position:relative}
body.dl-fish .wrap > #tabs,body.dl-fish .wrap > #panel{display:none!important}
body.dl-fish .sidetog,body.dl-fish #towater{display:none!important}
/* the tip line sits on the water, above the buttons */
body.dl-fish .wrap > #hint,body.dl-fish #stage > #hint{position:absolute!important;left:50%;bottom:72px;transform:translateX(-50%);z-index:3;margin:0!important;max-width:calc(100% - 28px);width:max-content;padding:5px 12px;border-radius:12px;background:#0a1220b8;border:1px solid #ffffff1a;color:#dbe7f3;font-size:12px;line-height:1.3;text-align:center;pointer-events:none;display:block}
body.dl-fish .wrap > #hint:empty,body.dl-fish #stage > #hint:empty{display:none}
body.dl-fish.card-open #hint{opacity:0}
@media (max-height:560px){body.dl-fish .wrap > #hint,body.dl-fish #stage > #hint{bottom:58px;font-size:11px}}
/* phones: a one-row top bar (coins, level, cooler, bait); the name of the water is on the water, search and settings are in the menu */
body.phone-app.dl-fish .hud{grid-template-columns:minmax(0,1.05fr) minmax(0,1fr) minmax(0,.8fr) minmax(0,1.15fr)!important;gap:5px!important}
body.phone-app.dl-fish .hud > .stat.loc,body.phone-app.dl-fish .hud > #buffchip,body.phone-app.dl-fish .hud > .hudbtns{display:none!important}
@media (orientation:landscape) and (max-height:560px){
  body.dl-fish .hud{grid-template-columns:minmax(0,.95fr) minmax(0,.9fr) minmax(0,1.6fr) minmax(0,.8fr) minmax(0,1.05fr)!important}
  body.dl-fish .hud > #buffchip,body.dl-fish .hud > .hudbtns{display:none!important}
}
/* ---------- the Menu button ---------- */
.dlprev{right:auto!important;left:50%!important;bottom:4px!important;transform:translateX(-50%);opacity:.8}
/* ---------- the full-screen menu: no pinned bars, every part is a row of one screen-tall grid (works under Safari's toolbars) ---------- */
#menuov{inset:auto!important;top:0!important;left:0!important;right:0!important;height:100vh;height:100dvh}
#menuov .mo-in{grid-template-columns:auto auto minmax(0,1fr) auto!important;grid-template-rows:auto auto minmax(0,1fr)!important;grid-template-areas:"back home secs tools" "sub sub sub sub" "body body body body"!important}
#menuov .mo-title{display:none!important}
@media (max-width:1100px){#menuov .mo-in{grid-template-rows:auto auto auto minmax(0,1fr)!important;grid-template-areas:"back home . tools" "secs secs secs secs" "sub sub sub sub" "body body body body"!important}}
@media (max-width:460px){#menuov .mo-tools{gap:6px}#menuov .mo-tb{width:38px;height:38px}#menuov .mo-coin{padding:0 9px}}
#menuov .mo-in{overflow:hidden}
/* phones held upright: the categories are the bottom row of the same grid (thumb reach), never a pinned bar */
@media (max-width:700px) and (orientation:portrait){
  #menuov .mo-in{grid-template-rows:auto auto minmax(0,1fr) auto!important;grid-template-areas:"back home . tools" "sub sub sub sub" "body body body body" "secs secs secs secs"!important;row-gap:4px!important}
  body #menuov #tabs.secmode .secbar{position:static!important;top:auto!important;bottom:auto!important;left:auto!important;right:auto!important;transform:none!important;margin:0 calc(-1 * max(10px,env(safe-area-inset-right))) 0 calc(-1 * max(10px,env(safe-area-inset-left)));padding:6px max(8px,env(safe-area-inset-right)) calc(6px + env(safe-area-inset-bottom)) max(8px,env(safe-area-inset-left))!important}
  body #menuov #panel{padding-bottom:16px!important}
}
@media (orientation:landscape) and (max-height:560px){#menuov .mo-in{grid-template-rows:auto auto minmax(0,1fr)!important;grid-template-areas:"back home secs tools" "sub sub sub sub" "body body body body"!important}}
/* the Overview inside the menu: cards across the full width */
#menuov #panel .dash{grid-template-columns:repeat(auto-fill,minmax(min(100%,300px),1fr))}
@container (min-width:640px){#menuov #panel .dash .dw.wide{grid-column:span 2}}
</style>`);

// =====================================================================
// The goal / Live chip moves off the water into the top bar, right after "Fishing at", and the top bar chips size to
// what they hold: the short numbers stay compact, the water and the goal take the room that is left.
// =====================================================================
(function(){ const hud=document.querySelector('.hud'), gc=$('goalchip'), loc=hud&&hud.querySelector('.stat.loc'); if(!hud||!gc||!loc) return;
  loc.after(gc); gc.classList.add('hudgoal');
  const tag=(id,c)=>{ const e=$(id); const s=e&&e.closest('.stat'); if(s) s.classList.add(c); };
  tag('money','st-coins'); tag('lvl','st-lvl'); tag('coolerct','st-cool'); tag('buffct','st-buff'); tag('bait','st-bait'); })();
document.head.insertAdjacentHTML('beforeend',`<style>
.hud > #goalchip{position:relative!important;left:auto;top:auto!important;z-index:auto;display:flex;flex-direction:column;justify-content:center;gap:0;max-width:none;min-width:0;padding:4px 11px 5px;border-radius:10px;border:1px solid var(--line);background:var(--panel);box-shadow:none;-webkit-backdrop-filter:none;backdrop-filter:none;overflow:hidden;text-align:left}
.hud > #goalchip .gl-k{font-size:11px;letter-spacing:.08em;white-space:nowrap;line-height:1.2}
.hud > #goalchip .gl-t{font-family:var(--display);font-size:14px;line-height:1.25;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.hud > #goalchip .gl-s{display:none!important}
.hud > #goalchip .gl-bar{position:absolute;left:0;right:0;bottom:0;height:3px;margin:0;border-radius:0;background:#ffffff12}
.hud > #goalchip .gl-bar b{border-radius:0}
.hud > #goalchip.live{border-color:#7fe3c466}
.hud > #goalchip.ready{border-color:#ffd36a99;box-shadow:0 0 12px #ffd36a26}
/* wide screens: compact number chips, the water and the goal share what is left */
@media (min-width:701px){
  body.dl-fish .hud{gap:6px!important}
  body.dl-fish .hud > *{flex:0 1 auto!important}
  body.dl-fish .hud > .st-coins{flex:.3 1 104px!important;min-width:84px}
  body.dl-fish .hud > .st-lvl{flex:.3 1 112px!important;min-width:92px}
  body.dl-fish .hud > .stat.loc{flex:0 0 auto!important;max-width:none;min-width:128px}
  body.dl-fish .hud > #goalchip{flex:1.5 1 230px!important;max-width:440px;min-width:150px}
  body.dl-fish .hud > .st-cool{flex:.3 1 84px!important;min-width:70px}
  body.dl-fish .hud > .st-buff{flex:.3 1 96px!important;min-width:76px}
  body.dl-fish .hud > .st-bait{flex:.4 1 150px!important;min-width:124px}
  body.dl-fish .hud > .hudbtns,body.dl-fish .hud > .brand{flex:0 0 auto!important}
}
@media (min-width:701px) and (max-width:1099px){
  body.dl-fish .hud > .st-buff{display:none!important}
  body.dl-fish .hud > .stat.loc{min-width:112px;padding-right:10px!important}
  body.dl-fish .hud > #goalchip{min-width:120px}
}
/* phones held upright: the goal is a slim full-width row under the four chips */
body.phone-app.dl-fish .hud > #goalchip{grid-column:1 / -1;order:9;height:30px!important;flex-direction:row;align-items:center;justify-content:flex-start;gap:9px;padding:0 10px 2px}
body.phone-app.dl-fish .hud > #goalchip .gl-k{font-size:9.5px;flex:0 0 auto}
body.phone-app.dl-fish .hud > #goalchip .gl-t{font-size:12.5px;flex:1 1 auto;min-width:0}
/* phones held sideways: one row of six */
@media (orientation:landscape) and (max-height:560px){
  body.dl-fish .hud{grid-template-columns:minmax(70px,.7fr) minmax(66px,.7fr) max-content minmax(0,1.9fr) minmax(64px,.55fr) minmax(92px,.85fr)!important}
  body.dl-fish .hud > #goalchip{padding:2px 8px 4px}
  body.dl-fish .hud > #goalchip .gl-k{font-size:9px}
  body.dl-fish .hud > #goalchip .gl-t{font-size:12px}
}
</style>`);
document.head.insertAdjacentHTML('beforeend',`<style>
/* tablets and narrow windows (701-899 px): two rows, the numbers on top, the water and the goal side by side under them */
@media (min-width:701px) and (max-width:899px) and (min-height:561px){
  body.dl-fish .hud{display:grid!important;grid-template-columns:minmax(0,1fr) minmax(0,1fr) minmax(0,.8fr) minmax(0,1.25fr) auto!important;grid-template-areas:"coins lvl cool bait btns" "loc loc goal goal goal"!important;gap:6px!important}
  body.dl-fish .hud > *{height:44px!important;min-width:0!important;max-width:none!important}
  body.dl-fish .hud > .st-coins{grid-area:coins}body.dl-fish .hud > .st-lvl{grid-area:lvl}body.dl-fish .hud > .st-cool{grid-area:cool}body.dl-fish .hud > .st-bait{grid-area:bait}body.dl-fish .hud > .hudbtns{grid-area:btns}
  body.dl-fish .hud > .stat.loc{grid-area:loc}body.dl-fish .hud > #goalchip{grid-area:goal}
}
</style>`);
document.head.insertAdjacentHTML('beforeend',`<style>
/* very wide screens: every chip stops growing at a sensible width; any room left sits before the buttons on the right */
@media (min-width:900px){
  body.dl-fish .hud > .st-coins{max-width:150px}body.dl-fish .hud > .st-lvl{max-width:170px}
  body.dl-fish .hud > .stat.loc{flex:.6 0 auto!important;max-width:320px}body.dl-fish .hud > #goalchip{max-width:520px}
  body.dl-fish .hud > .st-cool{max-width:120px}body.dl-fish .hud > .st-buff{max-width:140px}body.dl-fish .hud > .st-bait{max-width:220px}
  body.dl-fish .hud > .hudbtns{margin-left:auto}
}
</style>`);
// the water redraws at its new size whenever its box changes (window resize, rotation, the top bar changing height),
// not only on the window's resize event
if(window.ResizeObserver){ const st=$("stage"); let tmr=0, lw=0, lh=0;
  new ResizeObserver(es=>{ const r=es[0].contentRect, w=Math.round(r.width), h=Math.round(r.height); if(Math.abs(w-lw)<2&&Math.abs(h-lh)<2) return; lw=w; lh=h; clearTimeout(tmr); tmr=setTimeout(()=>{ try{ resize(); }catch(e){} },30); }).observe(st); }
// a goal too long for one line wraps onto two compact lines (the label runs in front of it) instead of being cut
{ const gc=$('goalchip'); if(gc){ const fit=()=>{ const t=gc.querySelector('.gl-t'); gc.classList.remove('long'); if(t&&gc.closest('.hud')&&t.scrollWidth>t.clientWidth+1) gc.classList.add('long'); };
  new MutationObserver(fit).observe(gc,{childList:true}); addEventListener('resize',()=>setTimeout(fit,80)); addEventListener('orientationchange',()=>setTimeout(fit,350)); setTimeout(fit,100);
  if(/[?&]test\b/.test(location.search)) window.__fitGoal=fit; } }
document.head.insertAdjacentHTML('beforeend',`<style>
.hud > #goalchip.long{display:-webkit-box!important;-webkit-box-orient:vertical;-webkit-line-clamp:2;line-clamp:2;overflow:hidden;padding:7px 10px 0!important;line-height:1.16}
.hud > #goalchip.long .gl-k{display:inline;margin-right:6px;font-size:9.5px;line-height:1.16}
.hud > #goalchip.long .gl-t{display:inline;white-space:normal;font-size:12.5px;line-height:1.16}
@media (min-width:701px) and (max-width:899px) and (min-height:561px){.hud > #goalchip.long{padding-top:5px!important}}
body.phone-app.dl-fish .hud > #goalchip.long{height:auto!important;min-height:30px;padding:5px 10px 6px!important}
@media (orientation:landscape) and (max-height:560px){.hud > #goalchip.long{padding:4px 8px 0!important;line-height:1.1}.hud > #goalchip.long .gl-k{font-size:8.5px}.hud > #goalchip.long .gl-t{font-size:11px;line-height:1.1}}
</style>`);
document.head.insertAdjacentHTML('beforeend',`<style>
/* the level bar always stays inside its chip */
body.dl-fish .hud .xpbar{min-width:0!important;width:auto!important;max-width:100%!important;align-self:stretch}
@media (orientation:landscape) and (max-height:560px){.hud > #goalchip.long .gl-t{font-size:10.5px}}
</style>`);

//@layer mobile mobile/ui_menu_land.js
// In the menu the highlighted tab already names the page, so a page title that only repeats it is hidden (more room
// for the page itself). The wardrobe's own tabs (Body, Clothes, Hats...) move up into that row across the full width.
{ const _rp2=renderPanel; renderPanel=function(){ _rp2.apply(this,arguments); try{ menuTidy(); }catch(e){} }; }
function menuTidy(){ if(!MENU_OPEN) return; const P=$('panel'); if(!P) return; const on=$('tabs')&&$('tabs').querySelector('.subp.on');
  const h=P.querySelector(':scope > h2'); if(h){ const lbl=on?on.textContent.replace(/\s+/g,' ').trim().toLowerCase():''; const t=h.textContent.replace(/\s+/g,' ').trim().toLowerCase(); h.classList.toggle('dl-dup', !!lbl&&(t===lbl||lbl.endsWith(' '+t)||lbl.includes(t))); }
  const nav=P.querySelector('.stylewrap.wd .wd-nav'), wrap=P.querySelector('.stylewrap.wd'); if(nav&&wrap){ nav.classList.add('wd-top'); wrap.before(nav); } }
document.head.insertAdjacentHTML('beforeend',`<style>
#menuov #panel > h2.dl-dup{display:none!important}
#menuov #panel > .wd-nav.wd-top{display:flex!important;flex-wrap:nowrap;gap:6px;overflow-x:auto;scrollbar-width:none;margin:0 0 10px;padding:1px;grid-template-columns:none!important}
#menuov #panel > .wd-nav.wd-top::-webkit-scrollbar{display:none}
#menuov #panel > .wd-nav.wd-top button{flex:1 0 auto;flex-direction:row!important;gap:6px!important;min-height:36px!important;height:36px;padding:0 12px!important;border-radius:11px;white-space:nowrap}
#menuov #panel > .wd-nav.wd-top .wl{white-space:nowrap!important;line-height:1!important;font-size:13px}
#menuov #panel > .wd-nav.wd-top .wl br{display:none}
@media (orientation:landscape) and (max-height:560px){
  #menuov #panel > .wd-nav.wd-top{margin-bottom:8px}
  #menuov #panel > .wd-nav.wd-top button{min-height:32px!important;height:32px;padding:0 10px!important}
  #menuov #panel .stylewrap.wd{grid-template-columns:auto minmax(0,1fr)!important;gap:14px;align-items:start}
  #menuov #panel .wd-prev{position:sticky!important;top:0;height:calc(100dvh - 104px - env(safe-area-inset-top));max-height:420px;min-height:170px;margin:0!important;max-width:none!important;aspect-ratio:298/321;width:auto!important}
  #menuov #panel .wd-prev canvas{width:100%!important;height:100%!important;display:block}
}
</style>`);
// pages that redraw themselves (not through renderPanel) get the same tidy-up: watch the page for new content
function menuTidy2(){ if(!MENU_OPEN) return; const P=$('panel'); if(!P) return; const on=$('tabs')&&$('tabs').querySelector('.subp.on');
  const h=P.querySelector(':scope > h2, :scope > .row > div > h2'); if(h){ const lbl=on?on.textContent.replace(/[\d\s]+/g,' ').trim().toLowerCase():''; const t=h.textContent.replace(/\s+/g,' ').trim().toLowerCase(); h.classList.toggle('dl-dup', !!lbl&&!!t&&lbl.includes(t)); }
  const hr=P.querySelector(":scope > .row.spread"); if(hr&&hr.querySelector("h2")){ const wide=[...hr.children].slice(1).some(c=>c.matches("select,input,.fld")||c.querySelector("select,input,.fld")); hr.classList.toggle("dl-head",!wide); hr.classList.toggle("dl-headw",wide); }
  const nav=P.querySelector('.stylewrap.wd .wd-nav'), wrap=P.querySelector('.stylewrap.wd'); if(nav&&wrap&&nav.nextElementSibling!==wrap){ nav.classList.add('wd-top'); wrap.before(nav); } }
menuTidy=menuTidy2;
{ const P=$('panel'); if(P&&window.MutationObserver){ let q=false; new MutationObserver(()=>{ if(q) return; q=true; queueMicrotask(()=>{ q=false; try{ menuTidy2(); }catch(e){} }); }).observe(P,{childList:true}); } }
document.head.insertAdjacentHTML('beforeend',`<style>
#menuov #panel h2.dl-dup{display:none!important}
/* a page header keeps its number (Scales, skill points...) beside the description instead of on a line of its own */
#menuov #panel > .row.dl-head{flex-wrap:wrap!important;align-items:flex-start;gap:8px 14px}
#menuov #panel > .row.dl-head > :first-child{flex:1 1 300px;min-width:0}
#menuov #panel > .row.dl-head > :not(:first-child){flex:0 1 auto;min-width:0;margin-left:auto}
@media (orientation:landscape) and (max-height:560px){
  #menuov #panel .pts{font-size:26px!important;line-height:1.05}
  #menuov #panel > .row.dl-head .sub{margin-top:0}
}
@media (max-width:560px){#menuov #panel > .row.dl-head{flex-wrap:wrap!important}}
</style>`);
document.head.insertAdjacentHTML('beforeend',`<style>
@media (orientation:landscape) and (max-height:560px){
  body #menuov #tabs.secmode .secb .seclive,body #menuov #tabs.secmode .secb .secdot{position:static!important;transform:none!important;flex:0 0 auto;margin-left:auto}
  body #menuov #tabs.secmode .secb .seclive ~ .secdot{margin-left:5px}
  body #menuov #tabs.secmode .secb .secl{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
}
</style>`);
document.head.insertAdjacentHTML('beforeend',`<style>
@media (orientation:landscape) and (max-height:560px){
  #menuov .mo-in{grid-template-columns:clamp(140px,20vw,196px) minmax(0,1fr) auto!important}
  body #menuov #tabs.secmode .secb .seclive{height:15px;line-height:15px;padding:0 4px;font-size:8px}
  #menuov #panel .bwx-hero{height:92px!important;min-height:0!important;overflow:hidden}
  #menuov #panel .bwx-hero canvas{width:100%!important;height:100%!important;object-fit:cover;object-position:50% 30%}
}
/* narrow sideways phones: LIVE becomes a small pulsing dot so the category name always fits */
@media (orientation:landscape) and (max-height:560px) and (max-width:820px){
  body #menuov #tabs.secmode .secb .seclive{width:9px;height:9px;padding:0;border-radius:50%;font-size:0;line-height:0}
}
</style>`);
document.head.insertAdjacentHTML('beforeend',`<style>
@media (orientation:landscape) and (max-height:560px){ #menuov .mo-in{grid-template-columns:clamp(160px,20vw,196px) minmax(0,1fr) auto!important} }
@media (orientation:landscape) and (max-height:560px) and (max-width:820px){
  body #menuov #tabs.secmode .secb{gap:7px!important;padding:0 8px!important;font-size:12.5px!important}
  body #menuov #tabs.secmode .secb .secfull{display:none!important}body #menuov #tabs.secmode .secb .secshort{display:inline!important}
  #menuov .mo-back{padding:0 8px!important}
}
</style>`);
document.head.insertAdjacentHTML('beforeend',`<style>
/* a page's own section tabs stay one slim row (scrolls sideways if it has to) */
@media (orientation:landscape) and (max-height:560px){
  #menuov #panel .bwx-nav.sect-nav{display:flex!important;flex-wrap:nowrap!important;overflow-x:auto;scrollbar-width:none;gap:4px;padding:3px!important;margin:8px 0!important;grid-template-columns:none!important}
  #menuov #panel .bwx-nav.sect-nav::-webkit-scrollbar{display:none}
  #menuov #panel .bwx-nav.sect-nav > button{flex:1 0 auto;min-height:32px!important;height:32px;padding:0 12px!important;white-space:nowrap;font-size:13px}
  #menuov #panel > .tile:not(:last-child){margin-top:8px!important}
}
</style>`);
document.head.insertAdjacentHTML('beforeend',`<style>
@media (orientation:landscape) and (max-height:560px){
  #menuov .mo-in{grid-template-columns:clamp(170px,20vw,196px) minmax(0,1fr) auto!important}
  body #menuov #tabs.secmode .secb .seclive{width:9px!important;height:9px!important;padding:0!important;border-radius:50%;font-size:0!important;line-height:0!important}
}
</style>`);
document.head.insertAdjacentHTML('beforeend',`<style>
@media (orientation:landscape) and (max-height:560px){
  #menuov .mo-in{grid-template-columns:clamp(176px,20vw,196px) minmax(0,1fr) auto!important}
  body #menuov #tabs.secmode .secb{gap:7px!important;padding:0 8px!important;font-size:12.5px!important}
  /* section tabs and wardrobe tabs wrap onto a second slim row instead of hiding options off the edge */
  #menuov #panel .bwx-nav.sect-nav,#menuov #panel > .wd-nav.wd-top{flex-wrap:wrap!important;overflow:visible!important}
  #menuov #panel .bwx-nav.sect-nav > button,#menuov #panel > .wd-nav.wd-top button{flex:1 1 auto!important;padding:0 9px!important}
  #menuov #panel > .wd-nav.wd-top{gap:4px!important}
}
</style>`);
document.head.insertAdjacentHTML('beforeend',`<style>
@media (max-width:600px) and (orientation:portrait){
  #menuov #panel > .wd-nav.wd-top{display:grid!important;grid-template-columns:repeat(7,minmax(0,1fr))!important;gap:3px!important;overflow:visible!important}
  #menuov #panel > .wd-nav.wd-top button{flex-direction:column!important;gap:2px!important;height:auto!important;min-height:50px!important;padding:4px 1px!important;min-width:0}
  #menuov #panel > .wd-nav.wd-top .wl{white-space:normal!important;font-size:10px!important;line-height:1.1!important;text-align:center}
}
</style>`);

// =====================================================================
// Compact menus: one shared density layer for every page in the full-screen menu. Cards, grids, headings and gaps
// are tighter, grids fit more columns, and the narrower the page the tighter it gets. Tap targets stay >= 40 px.
// =====================================================================
document.head.insertAdjacentHTML('beforeend',`<style>
#menuov #panel{padding-bottom:12px!important}
#menuov #panel .grid:not([class*=" "]){grid-template-columns:repeat(auto-fill,minmax(min(100%,210px),1fr));gap:8px;margin-top:8px}
#menuov #panel .tile{padding:9px 11px;gap:4px;border-radius:11px}
#menuov #panel .tile h4{font-size:15px;line-height:1.25}
#menuov #panel .tile .meta{font-size:12.5px;line-height:1.35}
#menuov #panel h5{margin:10px 0 5px;font-size:12.5px}
#menuov #panel h3{margin:10px 0 6px}
#menuov #panel .sub{margin-top:1px}
@media (pointer:coarse){ body.v3 #menuov .btn{min-height:40px} body.v3 #menuov .btn.sm,body.v3 #menuov .chipb{min-height:36px} }
@container (max-width:620px){
  #menuov #panel .grid:not([class*=" "]){grid-template-columns:repeat(auto-fill,minmax(min(100%,190px),1fr));gap:6px}
  #menuov #panel .tile{padding:8px 10px;gap:3px}
  #menuov #panel .tile h4{font-size:14.5px}
  #menuov #panel h5{margin:8px 0 4px}
}
</style>`);
document.head.insertAdjacentHTML('beforeend',`<style>
/* more per row everywhere: these grids fit as many columns as their width allows */
#menuov #panel .jgrid{grid-template-columns:repeat(auto-fill,minmax(108px,1fr))!important;gap:6px!important}
#menuov #panel .jcard{padding:6px 2px!important}
#menuov #panel .bwx-grid{grid-template-columns:repeat(auto-fill,minmax(min(100%,215px),1fr))!important;gap:8px!important}
#menuov #panel .ev-grid,#menuov #panel .skill-grid{grid-template-columns:repeat(auto-fill,minmax(min(100%,215px),1fr))!important;gap:8px!important}
#menuov #panel[data-tab035="pets"] .grid{grid-template-columns:repeat(auto-fill,minmax(min(100%,170px),1fr))!important}
/* stats: cards of different heights flow into columns like a newspaper (no gaps under short cards) */
#menuov #panel .st-grid{display:block!important;columns:250px;column-gap:8px}
#menuov #panel .st-grid > *{break-inside:avoid;margin:0 0 8px!important;display:flex}
@media (orientation:landscape) and (max-height:560px){
  #menuov #panel .bwx-cb canvas{max-height:150px!important;width:auto!important;max-width:100%}
  #menuov #panel .wheelwrap,#menuov #panel .wheelring{max-width:150px;max-height:150px;margin:0 auto}
  #menuov #panel .sw2.v3th{height:62px!important;min-height:0!important}
  #menuov #panel .sw2.v3th canvas,#menuov #panel .sw2.v3th img{height:100%!important;object-fit:cover}
}
</style>`);
document.head.insertAdjacentHTML('beforeend',`<style>#menuov #panel .st-row{padding:4px 0}#menuov #panel .st-row small{line-height:1.2}</style>`);
document.head.insertAdjacentHTML('beforeend',`<style>
/* filter chips: a little slimmer everywhere in the menu */
#menuov #panel .chips{gap:5px}
#menuov #panel .chipb{padding:3px 10px;font-size:12.5px}
/* Fish Log on narrower pages: the Hunt button becomes a round target on the card's corner (one row less per fish) */
@container (max-width:760px){
  #menuov #panel .jcell{position:relative}
  #menuov #panel .jcell > .hunt-t{position:absolute;top:4px;right:4px;margin:0!important;width:32px;height:32px;min-height:32px;padding:0!important;border-radius:50%;font-size:0!important;display:grid;place-items:center;z-index:2;background:#0b1626d9}
  #menuov #panel .jcell > .hunt-t::before{content:"🎯";font-size:15px;line-height:1}
  #menuov #panel .jcell > .hunt-t.on{background:#ffb36a}
}
</style>`);
document.head.insertAdjacentHTML('beforeend',`<style>
/* the smallest sideways phones: an icon rail (names on long-press / hover), so pages get the width */
@media (orientation:landscape) and (max-height:560px){
  #menuov .mo-in{grid-template-columns:52px minmax(0,1fr) auto!important;column-gap:10px!important}
  #menuov .mo-back{justify-content:center;padding:0!important;font-size:0!important}
  #menuov .mo-back::after{content:none!important}
  #menuov .mo-back svg:not(.mo-bi){display:none!important}
  body #menuov #tabs.secmode .secb{justify-content:center;padding:0!important;position:relative}
  body #menuov #tabs.secmode .secb .secl{display:none!important}
  body #menuov #tabs.secmode .secb .seci svg{width:20px;height:20px}
  body #menuov #tabs.secmode .secb .secdot{position:absolute!important;top:-4px!important;right:-4px!important;left:auto!important;transform:none!important;min-width:17px;height:17px;font-size:10px;line-height:17px;margin:0!important}
  body #menuov #tabs.secmode .secb .seclive{position:absolute!important;top:3px!important;left:4px!important;right:auto!important;margin:0!important}
}
</style>`);
document.head.insertAdjacentHTML('beforeend',`<style>
/* upright phones: two cards per row instead of one wherever a card still reads well at half width */
@container (max-width:520px){
  #menuov #panel .grid:not([class*=" "]){grid-template-columns:repeat(auto-fill,minmax(min(100%,156px),1fr))}
  #menuov #panel .ev-grid,#menuov #panel .skill-grid,#menuov #panel .bwx-grid{grid-template-columns:repeat(auto-fill,minmax(min(100%,156px),1fr))!important}
  #menuov #panel[data-tab035="pets"] .grid{grid-template-columns:repeat(auto-fill,minmax(min(100%,140px),1fr))!important}
  #menuov #panel .sw2.v3th{height:70px!important;min-height:0!important}
  #menuov #panel .sw2.v3th canvas,#menuov #panel .sw2.v3th img{height:100%!important;object-fit:cover}
  #menuov #panel .tile .btn{white-space:normal;line-height:1.2}
}
</style>`);
document.head.insertAdjacentHTML('beforeend',`<style>
@container (max-width:520px){ #menuov #panel .bwx-grid{grid-template-columns:repeat(auto-fill,minmax(min(100%,172px),1fr))!important} }
#menuov #panel .bwx-card .btn{white-space:normal;line-height:1.2}
</style>`);
document.head.insertAdjacentHTML('beforeend',`<style>@container (max-width:520px){ #menuov #panel .bwx-grid{grid-template-columns:minmax(0,1fr)!important} }</style>`);

// =====================================================================
// The category bar on the water: Menu (the Overview) plus the five categories, one tap from fishing into any part of
// the menu. Each category opens the page you last used in it and shows how many things are waiting there.
// =====================================================================
const CD=document.createElement('nav'); CD.id='catdock'; CD.setAttribute('aria-label','Menu categories');
CD.innerHTML=MENU_SECS.map(s=>`<button type="button" class="cdb" data-cd="${s.id}" title="${esc(s.name)}" aria-label="${esc(s.name)}"><svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${s.icon}</svg><span class="cdl">${s.short}</span><span class="cddot" hidden></span></button>`).join('');
$('stage').appendChild(CD);
['pointerdown','touchstart','mousedown'].forEach(ev=>CD.addEventListener(ev,e=>e.stopPropagation(),{passive:true}));
CD.addEventListener('click',e=>{ const b=e.target.closest('[data-cd]'); if(!b) return; e.stopPropagation(); try{ startAudio(); }catch(er){} const sec=MENU_SECS.find(s=>s.id===b.dataset.cd); if(!sec) return; const list=menuTabsIn(sec), last=menuLast()[sec.id]; openMenu(list.includes(last)?last:list[0]); });
setInterval(()=>{ if(MENU_OPEN) return; for(const b of CD.querySelectorAll('.cdb')){ const sec=MENU_SECS.find(s=>s.id===b.dataset.cd), n=sec.tabs.reduce((a,t)=>a+menuDot(t),0), d=b.querySelector('.cddot'), t=n>99?'99+':String(n); if(n){ if(d.textContent!==t) d.textContent=t; d.hidden=false; } else d.hidden=true;
  if(sec.id==='chal'){ const live=!!(S.chal||liveScheds().length); b.classList.toggle('live',live); } } },1000);
document.head.insertAdjacentHTML('beforeend',`<style>
#catdock{position:absolute;z-index:6;left:50%;bottom:10px;transform:translateX(-50%);display:flex;gap:3px;padding:4px;border-radius:17px;background:linear-gradient(180deg,#152540e0,#0c1628ec);border:1px solid #ffffff1c;box-shadow:0 10px 26px #02060fb3;-webkit-backdrop-filter:blur(6px);backdrop-filter:blur(6px)}
#catdock .cdb{position:relative!important;inset:auto!important;transform:none;display:flex!important;flex-direction:column;align-items:center;justify-content:center;gap:2px;min-width:64px;height:48px!important;min-height:0!important;padding:0 6px!important;margin:0;border-radius:13px;border:1px solid transparent;background:transparent;color:#c9d7e8;font:800 11px/1.1 var(--display,system-ui);letter-spacing:.01em;cursor:pointer;box-shadow:none!important;touch-action:manipulation;-webkit-tap-highlight-color:transparent;transition:background .15s,color .15s,border-color .15s}
#catdock .cdb:hover{background:#ffffff10;color:#fff}
#catdock .cdb:active{transform:scale(.95)}
#catdock .cdb:focus-visible{outline:2px solid var(--gold,#ffd36a);outline-offset:1px}
#catdock .cdl,#catdock .mbl{white-space:nowrap}
#catdock .cddot{position:absolute!important;top:-6px!important;right:calc(50% - 25px)!important;left:auto!important;min-width:18px!important;height:18px!important;padding:0 5px!important;box-sizing:border-box;border-radius:999px;background:linear-gradient(180deg,#ffb36a,#ff7a4a);color:#2a1206;font:800 10.5px/18px var(--display,system-ui)!important;text-align:center;box-shadow:0 0 8px #ff8a5c88}
#catdock .cddot[hidden]{display:none!important}
#catdock .cdb.live::before{content:"";position:absolute;top:5px;left:calc(50% - 21px);width:8px;height:8px;border-radius:50%;background:#ff5a6a;box-shadow:0 0 8px #ff5a6a;animation:livepulse 1.6s ease-in-out infinite}
body.card-open #catdock{opacity:0;pointer-events:none}
/* the tip line and the Rest button sit clear of the bar */
body.dl-fish .wrap > #hint,body.dl-fish #stage > #hint{bottom:70px!important}
/* PC and tablets: icon and name side by side */
@media (min-width:701px) and (min-height:561px){
  #catdock .cdb{flex-direction:row;gap:7px;height:42px!important;padding:0 12px!important;font-size:13px;min-width:0}
  #catdock .cddot{top:-7px!important;right:-6px!important}
  #catdock .cdb.live::before{top:4px;left:4px}
  body.dl-fish .wrap > #hint,body.dl-fish #stage > #hint{bottom:66px!important}
}
/* phones held upright: the bar spans the bottom of the water, Rest sits just above it */
@media (max-width:700px) and (orientation:portrait){
  #catdock{left:6px;right:6px;bottom:6px;transform:none;justify-content:space-between;gap:2px;padding:3px;border-radius:15px}
  #catdock .cdb{flex:1 1 0;min-width:0;padding:0 1px!important;height:50px!important;font-size:10.5px}
  #catdock .cdl,#catdock .mbl{overflow:hidden;text-overflow:ellipsis;max-width:100%}
  body.dl-fish .resttog{bottom:66px!important;left:8px!important}
  body.dl-fish .wrap > #hint,body.dl-fish #stage > #hint{bottom:104px!important}
}
/* phones held sideways: a compact bar in the bottom middle, Rest on the left of the same row */
@media (orientation:landscape) and (max-height:560px){
  #catdock{bottom:6px;padding:3px;gap:2px;border-radius:14px}
  #catdock .cdb{min-width:58px;height:42px!important;font-size:10px;padding:0 4px!important}
  #catdock svg{width:18px;height:18px}
  body.dl-fish .resttog{bottom:12px!important}
  body.dl-fish .wrap > #hint,body.dl-fish #stage > #hint{bottom:56px!important}
}
@media (max-width:360px) and (orientation:portrait){ #catdock .cdb{font-size:9.5px} }
</style>`);
document.head.insertAdjacentHTML('beforeend',`<style>
@media (max-width:700px) and (orientation:portrait){ #catdock .cdb{font-size:9.5px;letter-spacing:0} #catdock svg{width:21px;height:21px} }
/* the preview badge (preview builds only) sits at the top middle of the water, clear of the bar */
.dlprev{top:calc(env(safe-area-inset-top) + 4px)!important;bottom:auto!important;left:50%!important;right:auto!important;transform:translateX(-50%)!important;opacity:.7}
</style>`);
document.head.insertAdjacentHTML('beforeend',`<style>
.dlprev{top:auto!important;bottom:calc(70px + env(safe-area-inset-bottom))!important;left:auto!important;right:calc(14px + env(safe-area-inset-right))!important;transform:none!important;font-size:10px!important;padding:2px 8px!important;opacity:.65}
@media (max-width:700px) and (orientation:portrait){ .dlprev{bottom:calc(72px + env(safe-area-inset-bottom))!important} }
@media (orientation:landscape) and (max-height:560px){ .dlprev{bottom:calc(58px + env(safe-area-inset-bottom))!important} }
</style>`);
document.head.insertAdjacentHTML('beforeend',`<style>@media (orientation:landscape) and (max-height:560px){ #menuov .mo-in{grid-template-columns:52px minmax(0,1fr) auto!important;column-gap:10px!important} }</style>`);
document.head.insertAdjacentHTML('beforeend',`<style>
/* notices inside the menu: a compact pill at the bottom, never over the page's content */
#menuov > #toast{top:auto!important;bottom:calc(14px + env(safe-area-inset-bottom))!important;left:50%!important;right:auto!important;transform:translateX(-50%)!important;max-width:min(480px,calc(100% - 40px))!important;width:max-content;font-size:13px!important;line-height:1.3!important;padding:8px 14px!important;border-radius:12px!important}
@media (max-width:700px) and (orientation:portrait){ #menuov > #toast{bottom:calc(76px + env(safe-area-inset-bottom))!important} }
@media (orientation:landscape) and (max-height:560px){ #menuov > #toast{font-size:12px!important;padding:6px 12px!important;max-width:min(420px,60%)!important} }
/* phones: slimmer chips, shorter page intros, a slimmer category bar */
@media (max-width:700px),(max-height:560px){
  body.v3 #menuov .chipb{min-height:32px!important}
  #menuov #panel .chipb{padding:2px 10px;font-size:12.5px}
  #menuov #panel p.sub,#menuov #panel > .row.dl-head .sub{font-size:12.5px!important;line-height:1.35}
}
@media (max-width:700px) and (orientation:portrait){
  body #menuov #tabs.secmode .secb{min-height:46px!important}
  body #menuov #panel{padding-bottom:12px!important}
}
</style>`);
document.head.insertAdjacentHTML('beforeend',`<style>
body.dl-fish .wrap > #hint,body.dl-fish #stage > #hint{bottom:72px!important}
@media (min-width:701px) and (min-height:561px){ body.dl-fish .wrap > #hint,body.dl-fish #stage > #hint{bottom:70px!important} }
@media (max-width:700px) and (orientation:portrait){ body.dl-fish .wrap > #hint,body.dl-fish #stage > #hint{bottom:114px!important} }
@media (orientation:landscape) and (max-height:560px){ body.dl-fish .wrap > #hint,body.dl-fish #stage > #hint{bottom:64px!important} }
@media (max-width:379px) and (orientation:portrait){ #catdock{left:4px;right:4px;gap:1px;padding:3px 2px} #catdock .cdb{font-size:9px!important;letter-spacing:-.15px!important} }
</style>`);
document.head.insertAdjacentHTML('beforeend',`<style>
@media (min-width:701px) and (max-width:1099px) and (min-height:561px){
  #catdock .cdb{flex-direction:column;gap:2px;height:48px!important;padding:0 6px!important;font-size:11px;min-width:64px}
  #catdock .cddot{top:-6px!important;right:calc(50% - 25px)!important}
  #catdock .cdb.live::before{top:5px;left:calc(50% - 21px)}
}
</style>`);
// a page header with controls (the Cooler's sell filters) uses the whole width: the text, then the controls and the button side by side
document.head.insertAdjacentHTML('beforeend',`<style>
#menuov #panel > .row.dl-headw{flex-wrap:wrap!important;align-items:flex-end;gap:8px}
#menuov #panel > .row.dl-headw > :first-child{flex:1 1 100%;min-width:0}
#menuov #panel > .row.dl-headw > :not(:first-child){flex:1 1 auto;min-width:0;margin:0!important}
#menuov #panel > .row.dl-headw > .btn{flex:0 0 auto}
#menuov #panel .sellf{padding:8px 10px!important;gap:6px 10px!important}
#menuov #panel .sellf .fld-title{width:100%;margin:0!important}
</style>`);
// "Bait in use" belongs to the bait: it shows only under Bait and Special lures, as one slim line under those tabs
{ const _rs04=renderShop; renderShop=function(P){ _rs04(P); try{ const cur=P.querySelector('.tk-cur'); if(!cur) return; if(tackleView!=='bait'&&tackleView!=='lures'){ cur.remove(); return; } const nav=[...P.children].find(c=>c.classList.contains('bwx-nav')); if(nav) nav.after(cur); cur.classList.add('tk-slim'); }catch(e){} }; }
document.head.insertAdjacentHTML('beforeend',`<style>
#panel .tk-cur.tk-slim{margin:0 0 8px!important;padding:6px 10px!important;gap:4px 8px!important;min-height:0;font-size:13px}
#panel .tk-cur.tk-slim .meta{font-size:12px}
#panel .tk-cur.tk-slim .btn{margin-left:auto}
body.v3 #menuov #panel .tk-cur.tk-slim .btn{min-height:32px!important;padding:4px 10px}
</style>`);

//@layer mobile mobile/ui_rail.js
//@layer mobile mobile/ui_fishlog.js
// the menu page never rubber-bands past its top or bottom (an older rule with a stronger selector kept "contain")
document.head.insertAdjacentHTML('beforeend','<style>body #menuov #panel{overscroll-behavior:none!important}</style>');
// (the touch guard that used to sit here is replaced by the page-wide one at the end of this file, which also leaves
//  sideways swipes alone and covers the top bars)

// =====================================================================
// Two more chips in the top bar while fishing: Aquarium (income per hour; gold when coins are waiting) and Fish Log
// (species found). Each opens its page. Sized per layout so nothing moves or gets cut.
// =====================================================================
(function(){ const hud=document.querySelector('.hud'), cool=$('coolerct'); if(!hud||!cool) return; const after=cool.closest('.stat');
  const mk=(cls,lbl,go,title)=>{ const b=document.createElement('button'); b.type='button'; b.className='stat hudx '+cls; b.dataset.go=go; b.title=title; b.innerHTML='<span class="lbl">'+lbl+'</span><b>–</b>'; return b; };
  const aq=mk('st-aq','Aquarium','aquarium','Aquarium: coins per hour (tap to open)'), lg=mk('st-log','Fish Log','journal','Fish Log: species found (tap to open)');
  after.after(aq); aq.after(lg);
  [aq,lg].forEach(b=>{ ['pointerdown','touchstart','mousedown'].forEach(ev=>b.addEventListener(ev,e=>e.stopPropagation(),{passive:true})); b.addEventListener('click',e=>{ e.stopPropagation(); try{ startAudio(); }catch(er){} openMenu(b.dataset.go); }); });
  const tick=()=>{ try{ const r=Math.floor(tankRate()*60), ready=S.tankBank>=1&&S.tank.length>0; const at=fmtShort(r)+'/h'; const av=aq.querySelector('b'); if(av.textContent!==at) av.textContent=at; aq.classList.toggle('ready',ready); aq.title=ready?'Aquarium: '+fmt(Math.floor(S.tankBank))+' coins waiting (tap to collect)':'Aquarium: '+fmt(r)+' coins per hour (tap to open)';
    const got=SP.filter(s=>S.journal[s.id]).length, lt=got+'/'+SP.length, lv=lg.querySelector('b'); if(lv.textContent!==lt) lv.textContent=lt; }catch(e){} };
  tick(); setInterval(tick,1500); })();
document.head.insertAdjacentHTML('beforeend',`<style>
.hud > .hudx{font:inherit;color:inherit;text-align:left;cursor:pointer;touch-action:manipulation;-webkit-tap-highlight-color:transparent}
.hud > .hudx:hover{border-color:#5a7ea8aa}
.hud > .st-aq.ready{border-color:#ffd36a99;box-shadow:0 0 12px #ffd36a2e}
.hud > .st-aq.ready b{color:var(--gold,#ffd36a)}
/* wide screens */
@media (min-width:701px){
  body.dl-fish .hud > .st-aq{flex:.3 1 96px!important;min-width:78px;max-width:140px}
  body.dl-fish .hud > .st-log{flex:.3 1 96px!important;min-width:78px;max-width:140px}
}
@media (min-width:701px) and (max-width:1099px){ body.dl-fish .hud > .hudx .lbl{font-size:9.5px;letter-spacing:0} body.dl-fish .hud > #goalchip{min-width:110px} }
/* tablets / narrow windows (two rows): the water, the goal, aquarium and log share the second row */
@media (min-width:701px) and (max-width:899px) and (min-height:561px){
  body.dl-fish .hud{grid-template-columns:minmax(0,1fr) minmax(0,1fr) minmax(0,.8fr) minmax(0,1.25fr) auto!important;grid-template-areas:"coins lvl cool bait btns" "loc goal goal aq lg"!important}
  body.dl-fish .hud > .st-aq{grid-area:aq}body.dl-fish .hud > .st-log{grid-area:lg}
}
/* phones upright: coins, level, cooler, aquarium, bait on top; the Fish Log rides on the right of the goal row */
body.phone-app.dl-fish .hud{grid-template-columns:minmax(0,1fr) minmax(0,.95fr) minmax(0,.72fr) minmax(0,.95fr) minmax(0,1.2fr)!important}
body.phone-app.dl-fish .hud > #goalchip{grid-column:1 / 5!important}
body.phone-app.dl-fish .hud > .st-log{grid-column:5;order:10;height:30px!important;flex-direction:row;align-items:center;justify-content:center;gap:4px;padding:0 6px!important}
body.phone-app.dl-fish .hud > .st-log .lbl{display:none}
body.phone-app.dl-fish .hud > .st-log b::before{content:"📖 ";font-size:11px}
body.phone-app.dl-fish .hud > .st-log b{font-size:12.5px}
body.phone-app.dl-fish .hud > .stat{padding-left:7px!important;padding-right:5px!important}
body.phone-app.dl-fish .hud > .stat .lbl{font-size:9px;letter-spacing:.04em}
body.phone-app.dl-fish .hud > .stat b{font-size:14px}
/* phones sideways: compact chips; below 800 px wide the Fish Log is left to the goal and the menu */
@media (orientation:landscape) and (max-height:560px){
  body.dl-fish .hud{grid-template-columns:minmax(66px,.8fr) minmax(62px,.7fr) max-content minmax(0,1.9fr) minmax(54px,.55fr) minmax(60px,.65fr) minmax(60px,.65fr) minmax(88px,.85fr)!important}
  body.dl-fish .hud > .stat{padding-left:7px!important;padding-right:5px!important}
  body.dl-fish .hud > .stat .lbl{font-size:8.5px!important;letter-spacing:.03em}
  body.dl-fish .hud > .stat b{font-size:12.5px!important}
}
@media (orientation:landscape) and (max-height:560px) and (max-width:799px){
  body.dl-fish .hud{grid-template-columns:minmax(64px,.8fr) minmax(60px,.7fr) max-content minmax(0,1.9fr) minmax(52px,.55fr) minmax(58px,.65fr) minmax(86px,.85fr)!important}
  body.dl-fish .hud > .st-log{display:none!important}
}
</style>`);
document.head.insertAdjacentHTML('beforeend',`<style>
body.phone-app.dl-fish .hud{grid-template-columns:minmax(0,1.05fr) minmax(0,.82fr) minmax(0,.78fr) minmax(0,1fr) minmax(0,1.05fr)!important;gap:4px!important}
body.phone-app.dl-fish .hud > .stat b{font-size:13px!important}
body.phone-app.dl-fish .hud > .stat{padding-left:6px!important;padding-right:4px!important}
body.phone-app.dl-fish .hud .coin::before{margin-right:3px}
@media (max-width:379px){ body.phone-app.dl-fish .hud > .stat b{font-size:12px!important} body.phone-app.dl-fish .hud > .stat .lbl{font-size:8.5px!important} body.phone-app.dl-fish .hud > .stat{padding-left:5px!important;padding-right:3px!important} }
</style>`);
//@layer mobile mobile/ui_cooler_count.js
document.head.insertAdjacentHTML('beforeend',`<style>
body.phone-app.dl-fish .hud{grid-template-columns:minmax(0,1.06fr) minmax(0,.9fr) minmax(0,.9fr) minmax(0,1fr) minmax(0,1.16fr)!important}
</style>`);
document.head.insertAdjacentHTML('beforeend',`<style>
/* ===== top bar, final sizing (every value, even the biggest, fits; nothing jumps) ===== */
/* PCs 1100 px and wider: one row; the number chips are as wide as they need, the goal takes the rest */
@media (min-width:1100px) and (min-height:561px){
  html body.dl-fish .hud{display:flex!important;flex-wrap:nowrap!important}
  html body.dl-fish .hud > .st-coins{flex:0 0 auto!important;min-width:104px;max-width:none}
  html body.dl-fish .hud > .st-lvl{flex:0 0 120px!important;max-width:none}
  html body.dl-fish .hud > .stat.loc{flex:0 0 auto!important;max-width:none}
  html body.dl-fish .hud > #goalchip{flex:1 1 0!important;min-width:120px;max-width:520px}
  html body.dl-fish .hud > .st-cool{flex:0 0 auto!important;min-width:84px;max-width:none}
  html body.dl-fish .hud > .st-aq{flex:0 0 auto!important;min-width:100px;max-width:none}
  html body.dl-fish .hud > .st-log{flex:0 0 auto!important;min-width:90px;max-width:none}
  html body.dl-fish .hud > .st-buff{flex:0 0 auto!important;min-width:90px;max-width:none}
  html body.dl-fish .hud > .st-bait{flex:0 1 160px!important;min-width:124px;max-width:200px}
  html body.dl-fish .hud > .stat b{white-space:nowrap}
}
@media (min-width:1100px) and (max-width:1599px) and (min-height:561px){
  html body.dl-fish .hud > .brand,html body.dl-fish .hud > .st-buff{display:none!important}
  html body.dl-fish .hud #searchbtn .sbl{display:none}
  html body.dl-fish .hud #settingsbtn{font-size:0!important;width:48px;padding:0!important}
  html body.dl-fish .hud #settingsbtn::before{content:"⚙";font-size:19px}
}
/* tablets and windows 701-1099 px: two rows - the numbers on top, the water and the goal under them */
@media (min-width:701px) and (max-width:1099px) and (min-height:561px){
  html body.dl-fish .hud{display:grid!important;grid-template-columns:minmax(0,1fr) minmax(0,.95fr) minmax(0,.85fr) minmax(0,1fr) minmax(0,.9fr) minmax(0,1.3fr) auto!important;grid-template-areas:"coins lvl cool aq lg bait btns" "loc loc goal goal goal goal goal"!important;gap:6px!important}
  html body.dl-fish .hud > *{height:44px!important;min-width:0!important;max-width:none!important;flex:none!important}
  html body.dl-fish .hud > .brand,html body.dl-fish .hud > .st-buff{display:none!important}
  html body.dl-fish .hud > .st-coins{grid-area:coins}html body.dl-fish .hud > .st-lvl{grid-area:lvl}html body.dl-fish .hud > .st-cool{grid-area:cool}html body.dl-fish .hud > .st-aq{grid-area:aq}html body.dl-fish .hud > .st-log{grid-area:lg}html body.dl-fish .hud > .st-bait{grid-area:bait}html body.dl-fish .hud > .hudbtns{grid-area:btns}html body.dl-fish .hud > .stat.loc{grid-area:loc}html body.dl-fish .hud > #goalchip{grid-area:goal}
  html body.dl-fish .hud > .stat b{font-size:15px!important}
  html body.dl-fish .hud > .stat{padding-left:8px!important;padding-right:6px!important}
}
/* phones sideways: one fixed grid sized for the biggest values */
@media (orientation:landscape) and (max-height:560px){
  html body.dl-fish .hud{display:grid!important;grid-template-columns:76px 64px max-content minmax(0,1fr) 62px 72px 62px 88px!important;gap:5px!important}
  html body.dl-fish .hud > *{min-width:0!important;max-width:none!important;flex:none!important}
  html body.dl-fish .hud > .brand,html body.dl-fish .hud > .st-buff,html body.dl-fish .hud > .hudbtns{display:none!important}
  html body.dl-fish .hud > .stat b{font-size:12.5px!important}
  html body.dl-fish .hud > .stat .lbl{font-size:8.5px!important}
  html body.dl-fish .hud > .stat{padding-left:6px!important;padding-right:4px!important}
}
@media (orientation:landscape) and (max-height:560px) and (max-width:799px){
  html body.dl-fish .hud{grid-template-columns:76px 62px max-content minmax(0,1fr) 62px 72px 86px!important}
  html body.dl-fish .hud > .st-log{display:none!important}
}
</style>`);
//@layer mobile mobile/ui_rail_names.js
// =====================================================================
// No Overview page (director, 2026-11-17): the Menu button, M and keys open the page you used last; the categories
// carry their own counts. 'dash' stays only as the internal "menu closed / fishing" state.
// =====================================================================
function menuLastPage(){ const ok=t=>!!t&&t!==DASH&&(MENU_SECS.some(s=>s.tabs.includes(t))||MENU_MORE.tabs.includes(t)); const l=S.settings&&S.settings.lastPage; return ok(l)?l:'cooler'; }
{ const _st05=setTab; setTab=function(t){ if(t&&t!==DASH){ try{ S.settings.lastPage=t; }catch(e){} } return _st05.apply(this,arguments); }; }
openMenu=function(t){ if(!t||t===DASH) t=menuLastPage(); MENU_WANT=true; setTab(t); save(); };

// =====================================================================
// QC pass fixes (2026-11-17, round 2)
// =====================================================================
{ const _t6=menuTidy2; menuTidy2=function(){ _t6(); try{ const P=$('panel');
    // Bounties: the three daily tasks sit side by side when there is room
    if(S.tab==='bounties'){ const t=[...P.querySelectorAll(':scope > .tile')].find(x=>{ const h=x.querySelector('h4'); return h&&/Daily tasks/i.test(h.textContent); }); if(t) t.classList.add('dtasks'); }
  }catch(e){} }; menuTidy=menuTidy2; }
document.head.insertAdjacentHTML('beforeend',`<style>
/* a page header's number or controls sit beside the text when they fit, and start on the left when they wrap */
#menuov #panel > .row.dl-head{justify-content:space-between!important}
#menuov #panel > .row.dl-head > :not(:first-child){margin-left:0!important}
/* Events calendar and daily tasks: side by side on wide enough pages */
@container (min-width:560px){
  #menuov #panel .tile.ev-cal{display:grid; /* no !important: it overrode the page tabs hiding the calendar (director, 2026-11-19: Events tabs showed the same things) */ grid-template-columns:repeat(auto-fill,minmax(230px,1fr));column-gap:14px}
  #menuov #panel .ev-cal > :not(.ev-cal-row){grid-column:1 / -1}
  #menuov #panel .ev-cal > .ev-cal-row{border-top:1px solid var(--line)!important}
  #menuov #panel .tile.dtasks{display:grid!important;grid-template-columns:repeat(auto-fill,minmax(210px,1fr));gap:6px 12px}
  #menuov #panel .tile.dtasks > .row{grid-column:1 / -1}
  #menuov #panel .tile.dtasks > .toggle{flex-wrap:wrap;align-content:flex-start;border-top:1px solid var(--line);padding-top:6px}
}
/* sideways phones: no empty slot where the Overview button was */
@media (orientation:landscape) and (max-height:560px){
  #menuov .mo-in{grid-template-rows:auto minmax(0,1fr)!important;grid-template-areas:"tools sub back" "body body secs"!important}
}
</style>`);
{ const _t7=menuTidy2; menuTidy2=function(){ _t7(); try{ const P=$('panel');
    if(S.tab==='paths') P.querySelectorAll('.tile .grid').forEach(g=>g.classList.add('pathgrid'));
    if(S.tab==='rods'){ const t=[...P.querySelectorAll('.tile')].find(x=>/in your hands/i.test(x.textContent)); if(t) t.classList.add('rodnow'); }
  }catch(e){} }; menuTidy=menuTidy2; }
document.head.insertAdjacentHTML('beforeend',`<style>
/* disabled buttons stay readable (they say what is not possible yet) */
#menuov .btn:disabled,#menuov .btn[disabled]{opacity:.55!important;filter:saturate(.35)}
/* Paths: the three choices of a fork side by side */
#menuov #panel .grid.pathgrid{grid-template-columns:repeat(3,minmax(0,1fr))!important;gap:6px!important}
@container (max-width:560px){
  #menuov #panel .grid.pathgrid > .tile{padding:7px 8px!important}
  #menuov #panel .grid.pathgrid h4{font-size:13px!important}
  #menuov #panel .grid.pathgrid .meta,#menuov #panel .grid.pathgrid div{font-size:11.5px;line-height:1.3}
  /* Aquarium: earnings on one line, the two buttons on the next */
  #menuov #panel .bank{display:grid!important;grid-template-columns:1fr 1fr;gap:6px 10px;align-items:center;width:100%}
  #menuov #panel .bank > .btn{width:100%}
  /* Rods: level and upgrade side by side under the rod */
  #menuov #panel .rodnow > .row.spread > :last-child{display:flex;align-items:center;justify-content:space-between;gap:8px;width:100%;text-align:left!important}
  /* section tabs: one row that scrolls sideways */
  #menuov #panel .bwx-nav.sect-nav{flex-wrap:nowrap!important;overflow-x:auto!important;scrollbar-width:none;display:flex!important}
  /* fade on the right edge drawn as a layer, not a mask: a mask would also clip the band that covers the gap above the tabs */
  #menuov #panel .bwx-nav.sect-nav::after{content:"";position:sticky;right:0;flex:0 0 26px;margin-left:-26px;align-self:stretch;background:linear-gradient(90deg,#0d183000,#0d1830);pointer-events:none;border-radius:0 14px 14px 0}
  #menuov #panel .bwx-nav.sect-nav::before{content:none!important} /* an absolute layer inside a sideways scroller would make it scroll; the shadow band still covers the gap */
  #menuov #panel .bwx-nav.sect-nav::-webkit-scrollbar{display:none}
  #menuov #panel .bwx-nav.sect-nav > button{flex:0 0 auto!important;white-space:nowrap}
  /* Bounties: the water list scrolls sideways like the Fish Log's */
  #menuov #panel .chips:has(> [data-act="bloc"]){flex-wrap:nowrap!important;overflow-x:auto;scrollbar-width:none;-webkit-mask-image:linear-gradient(90deg,#000 88%,transparent);mask-image:linear-gradient(90deg,#000 88%,transparent)}
  #menuov #panel .chips:has(> [data-act="bloc"])::-webkit-scrollbar{display:none}
  #menuov #panel .chips:has(> [data-act="bloc"]) > *{flex:0 0 auto}
  #menuov #panel .tp-ghost{transform:scale(.75);transform-origin:left center}
}
</style>`);
{ const _t8=menuTidy2; menuTidy2=function(){ _t8(); try{ $('panel').querySelectorAll('.chips,.bwx-nav.sect-nav,.wd-nav.wd-top').forEach(row=>{ if(row.scrollWidth<=row.clientWidth+2) return; const on=row.querySelector('[aria-pressed="true"],[aria-selected="true"]'); if(on) row.scrollLeft=Math.max(0,on.offsetLeft-row.clientWidth/2+on.offsetWidth/2); }); }catch(e){} }; menuTidy=menuTidy2; }
document.head.insertAdjacentHTML('beforeend','<style>body.v3 .btn:disabled,body.v3 .btn[disabled]{color:#aebfd3!important;text-shadow:none!important}#menuov .btn:disabled,#menuov .btn[disabled]{opacity:.7!important}</style>');
document.head.insertAdjacentHTML('beforeend',`<style>
@container (max-width:560px){
  /* Tide Pass: the next reward picture beside its text */
  #menuov #panel .tile.pass-next{flex-direction:row!important;align-items:center;gap:10px}
  #menuov #panel .tile.pass-next > canvas{width:104px!important;height:78px!important;flex:0 0 auto}
  /* a wrapped header block (Tide Pass level, cozy level) uses the full width */
  #menuov #panel > .row.dl-head > :not(:first-child){flex:1 1 auto}
  /* Docks and pet filters: one row that scrolls sideways */
  #menuov #panel .dock-h:has(> .dock-c):not([style*="display: none"]),#menuov #panel .chips.pet-filter:not([style*="display: none"]){display:flex!important;flex-wrap:nowrap!important;overflow-x:auto;scrollbar-width:none;gap:5px;-webkit-mask-image:linear-gradient(90deg,#000 88%,transparent);mask-image:linear-gradient(90deg,#000 88%,transparent)}
  #menuov #panel .dock-h:has(> .dock-c)::-webkit-scrollbar,#menuov #panel .chips.pet-filter::-webkit-scrollbar{display:none}
  #menuov #panel .dock-h > *,#menuov #panel .chips.pet-filter > *{flex:0 0 auto}
}
</style>`);
// buttons inside a settings-style row (switches, daily task Claim) had a dark background with dark text: make them readable
document.head.insertAdjacentHTML('beforeend',`<style>
body.v3 .toggle button.btn{color:#dfe8f2!important;border:1px solid #3a587888!important;text-shadow:none}
body.v3 .toggle button.btn[aria-pressed="true"]{color:#ffe7a6!important;border-color:#ffd36a99!important;box-shadow:0 0 10px #ffd36a26}
body.v3 .toggle button.btn[aria-pressed="false"]{color:#9fb2c8!important}
body.v3 .toggle button.btn[data-act="taskclaim"]:not(:disabled){background:linear-gradient(180deg,var(--buoy2,#ff9a6a),var(--buoy,#ff6a3d) 55%,#f0683c)!important;color:#1d0d06!important;border-color:transparent!important}
</style>`);
document.head.insertAdjacentHTML('beforeend',`<style>
/* one clear look for anything not possible yet: dark slate with readable muted text (was faded orange, unreadable) */
body.v3 .btn:disabled,body.v3 .btn[disabled],body.v3 #menuov .btn:disabled{background:linear-gradient(180deg,#26324a,#1e2838)!important;color:#a9b9cc!important;border:1px solid #3a4a62!important;box-shadow:none!important;filter:none!important;opacity:1!important;text-shadow:none!important;cursor:not-allowed}
body.v3 .btn:disabled .coin,body.v3 .btn[disabled] .coin{color:#a9b9cc!important}
</style>`);

// =====================================================================
// The category bar never covers the water (director, 2026-11-17): it is its own part of the screen, a column to the
// right of the water on sideways phones and a bar under the water everywhere else. Only Rest and the tip stay on it.
// =====================================================================
{ const wrap=document.querySelector('.wrap'), st=$('stage'); if(wrap&&st&&CD){ st.after(CD); }
  const hint=$('hint'); const keepHint=()=>{ if(hint&&st&&hint.parentElement!==st) st.appendChild(hint); }; keepHint(); addEventListener('resize',()=>setTimeout(keepHint,120)); setTimeout(keepHint,400);
  // the picture is exactly the water's box (the bar below or beside it is not part of the water)
  const _sho06=stageHOverride; stageHOverride=function(W,H){ try{ if(document.body.classList.contains('dl-fish')){ const h=Math.round(st.clientHeight); if(h>140) return h; } }catch(e){} return _sho06(W,H); }; }
document.head.insertAdjacentHTML('beforeend',`<style>
html body.dl-fish .wrap > #catdock{position:relative!important;inset:auto!important;left:auto!important;right:auto!important;top:auto!important;bottom:auto!important;transform:none!important;z-index:2;flex:0 0 auto;margin:0;box-shadow:none;-webkit-backdrop-filter:none;backdrop-filter:none;background:linear-gradient(180deg,#14223a,#0f1a2e);border:1px solid var(--line,#26385180)}
/* on the water: Rest bottom left, the tip just above it in the middle */
body.dl-fish .resttog{bottom:10px!important;left:10px!important}
body.dl-fish #stage > #hint,body.dl-fish .wrap > #hint{bottom:56px!important;left:50%!important;transform:translateX(-50%)!important;max-width:calc(100% - 28px)!important}
/* PC and tablets: a bar under the water, centred */
@media (min-width:701px) and (min-height:561px){ html body.dl-fish .wrap > #catdock{align-self:center;border-radius:16px} }
/* phones upright: a full-width bar under the water */
@media (max-width:700px) and (orientation:portrait){ html body.dl-fish .wrap > #catdock{align-self:stretch;width:auto;border-radius:15px;padding:3px} }
/* phones sideways: the water on the left, the categories in their own column on the right */
@media (orientation:landscape) and (max-height:560px){
  html body.dl-fish .wrap{display:grid!important;grid-template-columns:minmax(0,1fr) auto!important;grid-template-rows:auto minmax(0,1fr)!important;column-gap:6px!important;row-gap:5px!important}
  html body.dl-fish .wrap > .hud{grid-column:1 / -1!important;grid-row:1!important}
  html body.dl-fish .wrap > #stage{grid-column:1!important;grid-row:2!important;min-height:0!important;height:auto!important}
  html body.dl-fish .wrap > #catdock{grid-column:2;grid-row:2;align-self:stretch;flex-direction:column!important;justify-content:space-evenly;gap:2px;padding:4px;border-radius:14px}
  body.dl-fish #stage > #hint,body.dl-fish .wrap > #hint{bottom:12px!important;left:calc(50% + 40px)!important;max-width:calc(100% - 120px)!important}
  .dlprev{right:calc(150px + env(safe-area-inset-right))!important;bottom:calc(14px + env(safe-area-inset-bottom))!important}
}
@media (max-width:700px) and (orientation:portrait){ .dlprev{bottom:calc(76px + env(safe-area-inset-bottom))!important} }
@media (min-width:701px) and (min-height:561px){ .dlprev{bottom:calc(74px + env(safe-area-inset-bottom))!important} }
</style>`);

// =====================================================================
// No Menu button (director, 2026-11-17): the five categories are the way into the menu; M still toggles it on a keyboard.
// The landscape side panels fold to icons and back (one setting for the water's panel and the menu's rail).
// Page tabs (Wardrobe tabs, section tabs) stay pinned while a page scrolls.
// =====================================================================
{ const mini=()=>!!(S.settings&&S.settings.dockMini); const apply=()=>{ document.body.classList.toggle('dock-mini',mini()); document.querySelectorAll('.cdmini').forEach(b=>{ b.setAttribute('aria-pressed',String(mini())); const t=mini()?'Expand panel':'Collapse panel'; b.title=t; b.setAttribute('aria-label',t); const l=b.querySelector('.cdml'); if(l&&l.textContent!==t) l.textContent=t; }); };
  const mk=()=>{ const b=document.createElement('button'); b.type='button'; b.className='cdmini'; b.innerHTML='<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 6l6 6-6 6"/></svg><span class="cdml">Collapse panel</span>';
    ['pointerdown','touchstart','mousedown'].forEach(ev=>b.addEventListener(ev,e=>e.stopPropagation(),{passive:true})); b.addEventListener('click',e=>{ e.stopPropagation(); S.settings.dockMini=!mini(); apply(); save(); dispatchEvent(new Event('resize')); }); return b; };
  CD.prepend(mk()); const sb=$('tabs')&&$('tabs').querySelector('.secbar'); if(sb) sb.appendChild(mk()); apply(); }
document.head.insertAdjacentHTML('beforeend',`<style>
body .cdmini,body #menuov #tabs .secbar > .cdmini{display:none!important} /* only landscape phones have side panels to fold */
@media (orientation:landscape) and (max-height:560px){
  body .cdmini,body #menuov #tabs .secbar > .cdmini{display:flex!important}
  .cdmini{display:flex;align-items:center;justify-content:flex-start;gap:6px;flex:0 0 auto;height:26px;padding:0 9px;border-radius:9px;border:1px solid #ffffff14;background:#ffffff08;color:#9fb2c8;font:700 10.5px var(--display,system-ui);cursor:pointer;touch-action:manipulation}
  .cdmini:hover{color:#fff;border-color:#ffffff30}
  .cdmini svg{transition:transform .2s}
  body.dock-mini .cdmini{justify-content:center;padding:0}
  body.dock-mini .cdmini svg{transform:rotate(180deg)}
  body.dock-mini .cdmini .cdml{display:none}
  body #menuov #tabs.secmode .secbar > .cdmini{margin-top:auto;width:100%}
  /* folded: icons only, the water and the pages get the room */
  body.dock-mini.dl-fish .wrap > #catdock .cdb{width:46px!important;padding:0!important;justify-content:center!important}
  body.dock-mini.dl-fish .wrap > #catdock .cdl{display:none!important}
  body.dock-mini.dl-fish .wrap > #catdock .cddot{top:-4px!important;right:-4px!important;transform:none!important}
  body.dock-mini.dl-fish .wrap > #catdock .cdb.live::before{top:3px!important;left:3px!important}
  body.dock-mini #menuov .mo-in{grid-template-columns:auto minmax(0,1fr) 52px!important}
  body.dock-mini #menuov .mo-back{justify-content:center!important;padding:0!important;font-size:0!important}
  body.dock-mini #menuov .mo-back::after{content:none!important}
  body.dock-mini #menuov #tabs.secmode .secb{justify-content:center!important;padding:0!important}
  body.dock-mini #menuov #tabs.secmode .secb .secl{display:none!important}
  body.dock-mini #menuov #tabs.secmode .secb .secdot{position:absolute!important;top:-4px!important;right:-4px!important;transform:none!important}
  body.dock-mini.dl-fish .wrap > #stage > #hint{left:50%!important;max-width:calc(100% - 28px)!important}
  body.dock-mini .dlprev{right:calc(66px + env(safe-area-inset-right))!important}
}
/* page tabs stay pinned at the top of the page while it scrolls */
#menuov #panel > .wd-nav.wd-top,#menuov #panel > .bwx-nav,#menuov #panel .bwx-nav.sect-nav{position:sticky!important;top:0;z-index:6;background:#0d1830!important;box-shadow:0 6px 12px -6px #02060fcc}
/* once the tabs are pinned (the page has scrolled under them), a solid band fills the gap above and beside them so nothing shows around them */
#menuov #panel .bwx-nav.stuck{box-shadow:0 0 0 10px #0d1830,0 -24px 0 10px #0d1830,0 18px 14px -6px #02060fcc!important}
#menuov #panel .bwx-nav.stuck:not(.wd-top)::before{content:"";position:absolute;left:-10px;right:-10px;top:-24px;bottom:-10px;background:#0d1830;z-index:-1;pointer-events:auto} /* same band as a real layer, so a tap on it never reaches a hidden card underneath */
@media (orientation:landscape) and (max-height:560px){ #menuov #panel .wd-prev{top:46px!important;height:calc(100dvh - 150px - env(safe-area-inset-top))!important} }
@media (min-width:600px){ #menuov #panel .stylewrap.wd .wd-prev{top:52px!important} }
</style>`);
//@layer mobile mobile/ui_wardrobe_land.js
// ---------- top bar bait chip: the whole name always fits (2026-11-17) ----------
// The closed picker used to show "Name (count)" in a ~55 px chip, so most names were cut off at every size. Now the count
// sits on the label line ("BAIT · 12", with the picker arrow) and the name gets its own line: the full name, its text a
// little smaller if needed, and a short form only when even that can't fit. The real picker still covers the whole chip,
// so a tap opens the phone's own list with every bait and count.
{ const sel=$('bait'), chip=sel&&sel.closest('.stat'), lbl=chip&&chip.querySelector('.lbl');
  if(chip&&lbl){
    const SHORT={worm:'Worms',bread:'Bread',cricket:'Crickets',crawler:'Crawlers',corn:'Corn',minnows:'Minnows',glitter:'Glitter',deepjig:'Deep Jigs',berries:'Berries',goldchum:'Gold Chum',lavaworm:'Lava',stardust:'Stardust',mythbait:'Myth',spinner:'Spinner',glow:'Glow',icefly:'Ice Flies',chum:'Chum',shrimp:'Shrimp',squid:'Squid',stinky:'Cheese',disco:'Disco',magnet:'Magnet',golden:'Golden'};
    const nm=document.createElement('b'); nm.className='bnm'; nm.setAttribute('aria-hidden','true'); sel.after(nm); chip.classList.add('bait-x');
    const paint=()=>{ try{ const k=BAIT[S.baitSel]?S.baitSel:'worm', b=BAIT[k], n=k==='worm'?null:(S.bait[k]||0);
      const lt='Bait'+(n!=null?' · '+(n>=1e6?fmtShort(n):n>=1000?Math.floor(n/1000)+'K':n):''); // compact so the biggest stash still fits if(lbl.textContent!==lt) lbl.textContent=lt;
      const t=b.name+(n!=null?' ('+fmt(n)+' left)':''); if(chip.title!==t+'. Tap to change bait') chip.title=t+'. Tap to change bait';
      // measured on the real text (letter spacing and the loaded font included); redone only when the bait or the width changes
      const avail=nm.clientWidth, key=k+'|'+avail+'|'+(document.fonts?document.fonts.status:''); if(avail>0&&nm._fitKey===key) return; nm._fitKey=avail>0?key:'';
      let best=null; const fits=(s,fs)=>{ nm.textContent=s; nm.style.fontSize=fs+'px'; return nm.scrollWidth<=nm.clientWidth+.5; };
      if(avail>0){ for(const s of [b.name, SHORT[k]||b.name]){ for(let fs=15;fs>=11;fs--){ if(fits(s,fs)){ best=[s,fs]; break; } } if(best) break; } }
      if(!best) best=[SHORT[k]||b.name,11];
      if(nm.textContent!==best[0]) nm.textContent=best[0]; const f=best[1]+'px'; if(nm.style.fontSize!==f) nm.style.fontSize=f; }catch(e){} };
    { const _rb=renderBait; renderBait=function(){ const r=_rb.apply(this,arguments); paint(); return r; }; }
    sel.addEventListener('change',()=>setTimeout(paint,0)); addEventListener('resize',()=>requestAnimationFrame(paint));
    if(window.ResizeObserver) new ResizeObserver(()=>paint()).observe(chip);
    if(document.fonts&&document.fonts.ready) document.fonts.ready.then(paint);
    paint();
    if(/[?&]test\b/.test(location.search)) window.__baitChip=paint;
  } }
document.head.insertAdjacentHTML('beforeend',`<style>
.hud .stat.bait-x{position:relative;min-width:0}
.hud .stat.bait-x > #bait{position:absolute!important;inset:0!important;width:100%!important;height:100%!important;max-width:none!important;margin:0!important;padding:0!important;opacity:0!important;z-index:2;cursor:pointer;font-size:16px!important}
.hud .stat.bait-x > .lbl{display:block;padding-right:12px;background:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='9' height='6'%3E%3Cpath d='M1 1l3.5 3.5L8 1' fill='none' stroke='%23c9d7e8' stroke-width='1.6' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E") no-repeat right center;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:100%;box-sizing:border-box}
.hud .stat.bait-x > .bnm{display:block;min-width:0;max-width:100%;overflow:hidden;white-space:nowrap;text-overflow:ellipsis;font:700 15px/22px var(--display,"Bricolage Grotesque"),"Segoe UI",system-ui,sans-serif;color:#eef3f8}
.hud .stat.bait-x:focus-within{outline:2px solid var(--gold,#ffd36a);outline-offset:2px}
.hud .stat.bait-x:hover{border-color:#ffffff30}
</style>`);
// the cast power bar sits just above the hint bubble at the bottom of the water (it used to be drawn underneath it,
// hidden by the "Release to cast" hint on tablets and sideways phones; director, 2026-11-17)
function castBarY(){ let y=H-34; try{ const h=$('hint'), cv=$('cv'); if(h&&cv&&h.offsetParent&&h.textContent.trim()&&+getComputedStyle(h).opacity>.05){ const hr=h.getBoundingClientRect(), cr=cv.getBoundingClientRect();
    if(cr.height>0&&hr.height>0&&hr.bottom>cr.top&&hr.top<cr.bottom){ const top=(hr.top-cr.top)*H/cr.height; if(top>H*.4) y=Math.min(y,top-26); } } }catch(e){} return y; }
if(/[?&]test\b/.test(location.search)) window.__castBarY=()=>({y:castBarY(), H});
//@layer mobile mobile/ui_boardwalk.js
//@layer mobile mobile/ui_aquarium_land.js
// heavy fog is drawn behind the dock, the angler and the pets (it used to be laid over them, washing out your own angler);
// the far shore and the middle distance still fade into it, and a light veil stays over the near water (2026-11-17)
{ let FOG_EARLY=false; const _dwx=drawWeatherX, _vp=v3Platform;
  drawWeatherX=function(t,wx,hz){ if(wx&&wx.k==='Fog'&&!FOG_EARLY) return; return _dwx.apply(this,arguments); };
  v3Platform=function(L,t,night,dockY,pb){ try{ const wx=weather(); if(wx.k==='Fog'){ FOG_EARLY=true; _dwx(t,wx,HZ()); } }catch(e){} finally{ FOG_EARLY=false; } return _vp.apply(this,arguments); }; }
// ---------- touch: no bouncing past the top bars, no long-press menus, no text selection, no zoom (director, 2026-11-17) ----------
// 1. Pulling a list past its top or bottom never drags the page (iPhone Safari rubber-bands the whole page otherwise, sliding
//    pages under the top panels). A drag is let through only to a box that can still scroll that way; sideways drags (tab rows,
//    sliders) are untouched.
{ let lx=0, ly=0, sx=0, sy=0; document.addEventListener('touchstart',e=>{ if(e.touches.length===1){ sx=lx=e.touches[0].clientX; sy=ly=e.touches[0].clientY; } },{passive:true});
  document.addEventListener('touchmove',e=>{ if(e.touches.length!==1) return; const tx=e.touches[0].clientX, ty=e.touches[0].clientY, dx=tx-lx, dy=ty-ly; lx=tx; ly=ty; if(Math.hypot(tx-sx,ty-sy)<10) return; // a tap that wobbles a little stays a tap: only clear drags are looked at
    if(Math.abs(dx)>Math.abs(dy)) return; if(!dy) return;
    for(let n=e.target; n&&n!==document.documentElement; n=n.parentElement){ if(n.nodeType!==1) continue; const oy=getComputedStyle(n).overflowY;
      if((oy==='auto'||oy==='scroll')&&n.scrollHeight>n.clientHeight+1){ if((dy>0&&n.scrollTop>0)||(dy<0&&n.scrollTop+n.clientHeight<n.scrollHeight-1)) return; break; } }
    if(e.cancelable) e.preventDefault(); },{passive:false}); }
// 2. No long-press callout (copy / share / look up), no text selection and no image dragging anywhere in the game, except in
//    text fields (pet names, save codes); no pinch or double-tap zoom.
document.head.insertAdjacentHTML('beforeend',`<style>
html,body{overscroll-behavior:none;touch-action:manipulation}
/* every control answers a tap at once: no phone waits to see whether a double tap (zoom) follows */
button,a,summary,label,select,input,[data-act],[data-tab],[role="button"],[role="tab"]{touch-action:manipulation;-webkit-tap-highlight-color:transparent}
/* touch screens switch pages instantly: no entrance animation on every card (desktop keeps it) */@media not ((hover:hover) and (pointer:fine)){ body.v3 #panel.pin > *{animation:none!important} }
body,body *{-webkit-touch-callout:none;-webkit-user-select:none;user-select:none;-webkit-user-drag:none}
body input,body textarea,body select,body [contenteditable="true"]{-webkit-touch-callout:default;-webkit-user-select:text;user-select:text}
img,canvas,svg{-webkit-user-drag:none}
</style>`);
document.addEventListener('contextmenu',e=>{ if(!e.target.closest('input,textarea,[contenteditable="true"]')) e.preventDefault(); });
document.addEventListener('selectstart',e=>{ if(!e.target.closest||!e.target.closest('input,textarea,[contenteditable="true"]')) e.preventDefault(); });
for(const ev of ['gesturestart','gesturechange']) document.addEventListener(ev,e=>e.preventDefault(),{passive:false});
document.addEventListener('dblclick',e=>{ if(!e.target.closest('input,textarea')) e.preventDefault(); },{passive:false});
// pinned page tabs: a tap on the band that covers the gap around them never reaches a card hidden underneath
document.addEventListener('click',e=>{ const P=document.querySelector('#menuov #panel'); if(!P||!e.target.closest||!P.contains(e.target)) return;
  for(const v of P.querySelectorAll(':scope > .bwx-nav')){ if(v.contains(e.target)) return; const r=v.getBoundingClientRect(), pr=P.getBoundingClientRect();
    if(!v.classList.contains('stuck')||r.height<8) continue; // only while the tabs are pinned
    if(e.clientY>=pr.top&&e.clientY<=r.bottom+10){ e.preventDefault(); e.stopPropagation(); return; } } },true);
// Menu pictures that never change (fish in the Fish Log and aquarium lists, dock decorations) are drawn once and reused.
// Redrawing dozens of them on every page switch made tapping between pages slow on phones.
{ const KEEP=new Map(), keep=(k,w,h,paint)=>{ let o=KEEP.get(k); if(!o){ o=document.createElement('canvas'); o.width=w; o.height=h; paint(o); if(KEEP.size>800) KEEP.clear(); KEEP.set(k,o); } return o; };
  paintFish=function(P){ P.querySelectorAll('canvas[data-fish]').forEach(c=>{ const sp=SPI[c.dataset.fish]; if(!sp) return; const known=c.dataset.known!=='0', sh=+c.dataset.sh||0, pv=c.dataset.pv||null;
    const o=keep(['f',sp.id,known?1:0,sh,pv,c.width,c.height,V3ON?1:0].join('|'),c.width,c.height,o=>fishCanvas(o,sp,known,sh,pv)); const x=c.getContext('2d'); x.clearRect(0,0,c.width,c.height); x.drawImage(o,0,0); }); };
  const _dt=dockThumb;
  dockThumb=function(x,id,w,h,night){ const m=x.getTransform&&x.getTransform(); if(!m||m.a!==1||m.d!==1||m.b||m.c||m.e||m.f) return _dt.apply(this,arguments); // only plain, unscaled canvases are kept
    x.drawImage(keep(['d',id,w,h,night||0].join('|'),w,h,o=>_dt(o.getContext('2d'),id,w,h,night)),0,0); };
  paintDecor=function(P){ P.querySelectorAll('canvas[data-decor]').forEach(c=>{ const id=c.dataset.decor, D=DECORI[id]; if(!D) return; const myst=c.dataset.own!=='1'&&!D.price;
    const o=keep(['a',id,myst?1:0,c.width,c.height,V3ON?1:0].join('|'),c.width,c.height,o=>{ const x=o.getContext('2d'); if(myst) mysteryThumb(x,o.width,o.height,id); else drawDecor(x,id,80,id==='duck'?70:112,1,0); }); const x=c.getContext('2d'); x.clearRect(0,0,c.width,c.height); x.drawImage(o,0,0); }); };
  // measure every decoration's size in spare moments after load, so the first visit to the Dock doesn't pay for it
  const idle=f=>window.requestIdleCallback?requestIdleCallback(f,{timeout:4000}):setTimeout(f,200);
  setTimeout(()=>{ const ids=DOCK_DECOR.map(d=>d.id); const step=()=>{ const id=ids.shift(); if(!id) return; try{ dockNative(id); }catch(e){} idle(step); }; idle(step); },1000); }
// Tapping fast between sections and pages: the first tap switches at once (highlight and page together); taps that arrive
// while a page is still being built only remember where you want to go, and that one page is built on the next frame.
// The save that remembers your last page waits until the tapping stops instead of writing on every tap.
{ const T=$('tabs'); let busyUntil=0, want=null, reveal=false, raf=0, saveT=0;
  const go=(t,rv)=>{ if(t&&S.tab!==t){ setTab(t); clearTimeout(saveT); saveT=setTimeout(()=>{ try{ save(); }catch(e){} },700); } else menuSync(); if(rv) try{ menuReveal(); }catch(e){} };
  if(T) T.addEventListener('click',e=>{ const sb=e.target.closest('[data-sec]'), pb=e.target.closest('[data-sub]'); if(!sb&&!pb) return; e.stopImmediatePropagation(); e.stopPropagation(); try{ startAudio&&startAudio(); }catch(er){}
    let t; if(sb){ const sec=MENU_SECS.find(s=>s.id===sb.dataset.sec); if(!sec) return; const list=menuTabsIn(sec), last=menuLast()[sec.id]; t=list.includes(last)?last:list[0]; }
    else { t=pb.dataset.sub; try{ pb.scrollIntoView({block:'nearest',inline:'nearest'}); }catch(er){} }

    if(e.timeStamp>=busyUntil&&!raf){ go(t,!!sb); busyUntil=performance.now(); return; } // the tap came while nothing was being built: switch right now
    want=t; reveal=reveal||!!sb; if(!raf) raf=requestAnimationFrame(()=>{ raf=0; const w=want, rv=reveal; want=null; reveal=false; go(w,rv); busyUntil=performance.now(); }); },true);
  addEventListener('pagehide',()=>{ if(saveT){ clearTimeout(saveT); try{ save(); }catch(e){} } }); }
// the page tabs count as pinned only once the page has scrolled under them (that's when the cover band shows)
{ const P=$('panel'); let q=0;
  const sync=()=>{ q=0; if(!P) return; const pr=P.getBoundingClientRect(), pad=parseFloat(getComputedStyle(P).paddingTop)||0;
    for(const v of P.querySelectorAll(':scope > .bwx-nav')){ const on=P.scrollTop>0&&v.getBoundingClientRect().top-pr.top-pad<=1.5; if(v.classList.contains('stuck')!==on) v.classList.toggle('stuck',on); } };
  const soon=()=>{ if(!q) q=requestAnimationFrame(sync); };
  if(P){ P.addEventListener('scroll',soon,{passive:true}); P.addEventListener('click',soon); }
  addEventListener('resize',soon); const _rp=renderPanel; renderPanel=function(){ const r=_rp.apply(this,arguments); if(PLAT.quietTabSwitch()) soon(); else sync(); return r; }; } /* phones (round 8 speed): checked on the next frame, not mid-switch */
// Touch screens: no hover effects. A phone counts a tap as "hovering" first, so hover looks (a blue glow, a lift) showed
// before the button acted, and iPhone sometimes treated the first tap as only a hover. Every :hover rule is switched off there.
if(matchMedia('(hover: none)').matches){ const strip=list=>{ for(let i=list.cssRules.length-1;i>=0;i--){ const r=list.cssRules[i];
      if(r.selectorText!==undefined){ if(!r.selectorText.includes(':hover')) continue; const keep=r.selectorText.split(',').filter(s=>!s.includes(':hover')); if(keep.length) r.selectorText=keep.join(','); else list.deleteRule(i); }
      else if(r.cssRules) strip(r); } };
  const all=()=>{ for(const s of document.styleSheets){ if(s._noHover) continue; try{ strip(s); s._noHover=true; }catch(e){} } };
  all(); setTimeout(all,0); addEventListener('load',all);
  new MutationObserver(ms=>{ if(ms.some(m=>[...m.addedNodes].some(n=>n.tagName==='STYLE'||n.tagName==='LINK'))) all(); }).observe(document.head,{childList:true}); }
// Menu navigation on touch screens acts when the finger lifts (if it stayed put), instead of waiting for the phone to decide
// the touch was a click; that decision sometimes failed on iPhone and needed a second tap. The phone's own click that follows is ignored.
{ const NAV='#menuov [data-sec],#menuov [data-sub],#menuov .sect-nav button,#menuov .mo-back,.hud > .hud-link,.hud > .hudx,.hud #goalchip,.hud .hudbtns > button'; // top-bar chips too (director 2026-11-18: tapping Fishing at sometimes did nothing on iPhone)
  // Every finger is tracked on its own (fast taps with two thumbs overlap). While touch is in use, menu buttons are driven only by
  // finger lifts: the phone's own clicks on them are ignored, so a late click can never undo a newer tap. The one exception is a
  // touch that didn't act (the phone cancelled it, or the finger slid): its click is honoured, since nothing else acted for it.
  const downs=new Map(); let lastTouch=-1e9, spare=[], synth=false;
  document.addEventListener('pointerdown',e=>{ if(e.pointerType==='mouse') return; lastTouch=performance.now(); const el=e.target.closest&&e.target.closest(NAV); if(el&&!el.disabled) downs.set(e.pointerId,{el,x:e.clientX,y:e.clientY}); else downs.delete(e.pointerId); },true);
  const unacted=el=>{ const now=performance.now(); spare=spare.filter(s=>now-s.t<900); spare.push({el,t:now}); };
  document.addEventListener('pointercancel',e=>{ const d=downs.get(e.pointerId); downs.delete(e.pointerId); if(d) unacted(d.el); },true);
  document.addEventListener('pointerup',e=>{ if(e.pointerType==='mouse') return; lastTouch=performance.now(); const d=downs.get(e.pointerId); /* a mouse never counts as touch (it used to, and swallowed every menu click on PC). This note was a // comment mid-line until 2026-11-18, which silently disabled everything after it on this line: the finger was never forgotten, untracked lifts threw an error, and a slid or redrawn tap was neither skipped nor handed to the phone's own click (taps "did nothing at times") */ downs.delete(e.pointerId); if(!d) return; if(Math.hypot(e.clientX-d.x,e.clientY-d.y)>18){ unacted(d.el); return; }
    // the button was redrawn while the finger was down (live countdowns, a page refresh): tap the button that is under the finger now
    if(!d.el.isConnected){ const n=document.elementFromPoint(e.clientX,e.clientY), el2=n&&n.closest&&n.closest(NAV); if(!el2||el2.disabled){ unacted(d.el); return; } d.el=el2; }
    // Back / Overview close the menu: what lay under the finger (a bait picker, a button on the water) must not get the phone's follow-up tap
    if(d.el.matches('.mo-back')){ const sh=document.createElement('div'); sh.style.cssText='position:fixed;inset:0;z-index:2147483647;background:transparent;touch-action:none'; const eat=ev=>{ ev.preventDefault(); ev.stopPropagation(); };
      ['pointerdown','pointerup','mousedown','mouseup','click','touchstart','touchend','contextmenu'].forEach(k=>sh.addEventListener(k,eat,{passive:false})); document.body.appendChild(sh); setTimeout(()=>sh.remove(),450); }
    synth=true; try{ d.el.click(); }finally{ synth=false; } },true);
  document.addEventListener('click',e=>{ if(synth) return; const now=performance.now(); if(now-lastTouch>1000) return; // mouse and keyboard keep normal clicks
    const el=e.target.closest&&e.target.closest(NAV); if(!el) return;
    spare=spare.filter(s=>now-s.t<900); const i=spare.findIndex(s=>s.el===el); if(i>=0){ spare.splice(i,1); return; } // a touch that didn't act: let its click through
    e.stopImmediatePropagation(); e.preventDefault(); },true);
  document.head.insertAdjacentHTML('beforeend',`<style>
/* bigger side buttons on short landscape screens, and no dead gap between them: each button's tap area reaches halfway into the gap */
@media (orientation:landscape) and (max-height:560px){
  body #menuov #tabs.secmode .secb,#menuov .mo-back{min-height:40px!important}
  body #menuov #tabs.secmode .secb::after{content:"";position:absolute;left:0;right:0;top:-3px;bottom:-3px}
}
</style>`); }
//@layer ios ios/touch_loupe.js
// Top bar (director, 2026-11-17): every chip that has a page opens it. Fishing at opens Waters (quick water changes), Cooler opens
// the Cooler, like Aquarium and Fish Log. Bait is not on the top bar any more: it is chosen on the Bait list in Tackle, which shows the
// bait in use. Its place goes to a Settings gear (phones had none). Fish Log stays on sideways phones at every width.
{ const cool=$('coolerct'), cc=cool&&cool.closest('.stat'), loc=document.querySelector('.hud > .stat.loc');
  const link=(el,go,title)=>{ if(!el) return; el.classList.add('hudx','hud-link'); el.setAttribute('role','button'); el.tabIndex=0; el.title=title;
    ['pointerdown','touchstart','mousedown'].forEach(ev=>el.addEventListener(ev,e=>e.stopPropagation(),{passive:true}));
    const act=e=>{ e.preventDefault(); e.stopPropagation(); try{ startAudio(); }catch(er){} go(); };
    el.addEventListener('click',act); el.addEventListener('keydown',e=>{ if(e.key==='Enter'||e.key===' ') act(e); }); };
  link(loc,()=>openMenu('map'),'Fishing at: tap to choose a water');
  link(cc,()=>openMenu('cooler'),'Cooler: fish you are carrying (tap to open)');
  const sel=$('bait'); if(sel){ sel.tabIndex=-1; sel.setAttribute('aria-hidden','true'); } }
document.head.insertAdjacentHTML('beforeend',`<style>
.hud > .hud-link{cursor:pointer}
.hud > .hud-link:focus-visible{outline:2px solid var(--gold,#ffd36a);outline-offset:2px}
html body .hud > .st-bait{display:none!important}
/* phones upright: coins, level, cooler, aquarium, Fish Log and a gear on top; where you fish and the goal underneath */
body.phone-app.dl-fish .hud{grid-template-columns:minmax(0,1.04fr) minmax(0,1fr) minmax(0,.9fr) minmax(0,1fr) minmax(0,1fr) 32px!important;gap:4px!important}
body.phone-app.dl-fish .hud > .st-log{grid-column:5!important;grid-row:1!important;order:0!important;height:auto!important;flex-direction:column!important;align-items:flex-start!important;justify-content:center!important;gap:0!important;padding-left:6px!important;padding-right:4px!important}
body.phone-app.dl-fish .hud > .st-log .lbl{display:block!important}
body.phone-app.dl-fish .hud > .st-log b::before{content:none!important}
body.phone-app.dl-fish .hud > .hudbtns{display:contents!important}
body.phone-app.dl-fish .hud > .hudbtns > #settingsbtn{grid-column:6;grid-row:1;width:100%;min-width:0;height:100%;padding:0!important}
body.phone-app.dl-fish .hud > .hudbtns > #searchbtn{display:flex!important;grid-column:6;grid-row:2;width:100%;min-width:0;height:30px!important;padding:0!important;align-items:center;justify-content:center;font-size:15px}
body.phone-app.dl-fish .hud > .hudbtns > #searchbtn .sbl{display:none!important}
body.phone-app.dl-fish .hud > .stat.loc{display:flex!important;grid-column:1 / 3!important;grid-row:2!important;height:30px!important;flex-direction:row!important;align-items:center!important;gap:5px!important;min-width:0;overflow:hidden}
body.phone-app.dl-fish .hud > .stat.loc .lbl{display:none!important}
body.phone-app.dl-fish .hud > .stat.loc b{font-size:12.5px!important;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;min-width:0}
body.phone-app.dl-fish .hud > .stat.loc b::before{content:"📍 ";font-size:11px}
body.phone-app.dl-fish .hud > #goalchip{grid-column:3 / 6!important;grid-row:2!important}
/* phones sideways: one row, Fish Log at every width, a gear at the end */
@media (orientation:landscape) and (max-height:560px){
  html body.dl-fish .hud{grid-template-columns:72px 60px max-content minmax(0,1fr) 58px 70px 64px 40px 40px!important;gap:5px!important}
  html body.dl-fish .hud > .st-log{display:flex!important}
  html body.dl-fish .hud > .hudbtns{display:contents!important}
  html body.dl-fish .hud > .hudbtns > #searchbtn{display:flex!important;width:100%;min-width:0;padding:0!important;height:100%;align-items:center;justify-content:center;font-size:16px}
  html body.dl-fish .hud > .hudbtns > #searchbtn .sbl{display:none!important}
  html body.dl-fish .hud > .hudbtns > #settingsbtn{width:100%;min-width:0;padding:0!important;height:100%}
}
@media (orientation:landscape) and (max-height:560px) and (max-width:799px){
  html body.dl-fish .hud{grid-template-columns:66px 60px max-content minmax(0,1fr) 54px 64px 58px 36px 36px!important;gap:4px!important}
  html body.dl-fish .hud > .st-log{display:flex!important}
}
/* tablets and windows 701-1099 px (two rows): the bait cell is gone */
@media (min-width:701px) and (max-width:1099px) and (min-height:561px){
  html body.dl-fish .hud{grid-template-columns:minmax(0,1fr) minmax(0,.95fr) minmax(0,.85fr) minmax(0,1fr) minmax(0,.9fr) auto!important;grid-template-areas:"coins lvl cool aq lg btns" "loc loc goal goal goal goal"!important}
}
</style>`);
//@layer pc pc/ui_header_row.js
//@layer pc pc/ui_menu_still.js
//@layer pc pc/ui_dock_sharp.js
// Settings is labelled wherever there is room (director, 2026-11-17): "⚙ Settings" on sideways phones (the goal gives up the room)
// and on PC, where the fishing header and the menu header use the very same button so both rows still line up. Phones held
// upright keep the gear alone: their top row has no room left for a word.
document.head.insertAdjacentHTML('beforeend',`<style>
@media (orientation:landscape) and (max-height:560px){
  html body.dl-fish .hud{grid-template-columns:72px 60px max-content minmax(0,1fr) 58px 70px 64px 40px max-content!important}
  html body.dl-fish .hud > .hudbtns > #settingsbtn{font-size:12.5px!important;font-weight:800;padding:0 12px!important;gap:6px;white-space:nowrap;width:auto!important}
  html body.dl-fish .hud > .hudbtns > #settingsbtn::before{content:none!important}
  html body.dl-fish .hud > #goalchip .gl-t{white-space:nowrap!important;overflow:hidden!important;text-overflow:ellipsis!important;display:block;min-width:0}
}
@media (orientation:landscape) and (max-height:560px) and (max-width:799px){
  html body.dl-fish .hud{grid-template-columns:66px 60px max-content minmax(0,1fr) 54px 64px 58px 36px max-content!important}
  html body.dl-fish .hud > .hudbtns > #settingsbtn{padding:0 10px!important}
}
#pchead .pch-tb[data-pch="settings"],body.pch-on #menuov .mo-tb[data-mo="settings"]{width:auto!important;padding:0 14px 0 12px!important;display:inline-flex!important;align-items:center;gap:7px;font:800 14px var(--display,system-ui)!important;white-space:nowrap}
#pchead .pch-tb[data-pch="settings"]::before,body.pch-on #menuov .mo-tb[data-mo="settings"]::before{content:"⚙";font-size:18px;line-height:1}
#pchead .pch-tb[data-pch="settings"]::after,body.pch-on #menuov .mo-tb[data-mo="settings"]::after{content:"Settings"}
#pchead .pch-tb[data-pch="settings"],body.pch-on #menuov .mo-tb[data-mo="settings"]{font-size:0!important}
#pchead .pch-tb[data-pch="settings"]::after,body.pch-on #menuov .mo-tb[data-mo="settings"]::after{font-size:14px}
</style>`);
document.head.insertAdjacentHTML('beforeend',`<style>
/* the smallest sideways phones (about 667 px): a tighter Settings button and a capped water name keep the goal readable */
@media (orientation:landscape) and (max-height:560px) and (max-width:700px){
  html body.dl-fish .hud > .hudbtns > #settingsbtn{padding:0 8px!important;font-size:11.5px!important}
  html body.dl-fish .hud > .stat.loc{max-width:92px!important;overflow:hidden}
  html body.dl-fish .hud > .stat.loc b{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;display:block;min-width:0}
}
</style>`);
// The Dock preview is live (director, 2026-11-17): it used to be drawn only when the page was built or something was dragged,
// so the time of day and the animations stood still and jumped ahead on every redraw (e.g. tapping a water chip). It now redraws
// about 30 times a second while the Dock page is on screen, and stops as soon as you leave it or the game is hidden.
{ let live=false, last=0;
  const step=now=>{ const c=$('homecv'); if(!c||!c.isConnected||S.tab!=='home'||document.hidden||!c.getClientRects().length){ live=false; return; }
    if(now-last>=32){ last=now; try{ paintHome(); }catch(e){} } requestAnimationFrame(step); };
  const start=()=>{ if(live||S.tab!=='home') return; live=true; last=0; requestAnimationFrame(step); };
  const _rp=renderPanel; renderPanel=function(){ const r=_rp.apply(this,arguments); try{ start(); }catch(e){} return r; };
  document.addEventListener('visibilitychange',()=>{ if(!document.hidden) start(); }); }
// Settings > Display > Frame rate: frames per second and the slowest recent frame, in the corner of the water
{ const el=document.createElement('div'); el.id='fpsbox'; el.hidden=true; const st=$('stage'); if(st) st.appendChild(el);
  let on=false, ts=[], lastT=0, shown=0;
  const loop=t=>{ if(!on) return; if(lastT) ts.push(t-lastT); lastT=t; if(ts.length>240) ts.shift();
    if(t-shown>500&&ts.length>10){ shown=t; const win=ts.slice(-120), avg=win.reduce((a,b)=>a+b,0)/win.length, worst=Math.max(...win); { const mt=PLAT.fpsText?PLAT.fpsText(Math.round(1000/avg)):null; el.textContent=mt||(Math.round(1000/avg)+' fps · slowest '+worst.toFixed(1)+' ms'); } } /* phones: frames actually drawn (settings08) */
    requestAnimationFrame(loop); };
  const sync=()=>{ const v=!!(S.settings&&S.settings.showFps); if(v===on) return; on=v; el.hidden=!v; ts=[]; lastT=0; if(v) requestAnimationFrame(loop); };
  setInterval(sync,700); sync(); }
document.head.insertAdjacentHTML('beforeend',`<style>#fpsbox{position:absolute;right:10px;bottom:10px;z-index:5;padding:3px 8px;border-radius:8px;background:#06101ccc;border:1px solid #ffffff22;color:#9fe8c9;font:700 11px/1.3 ui-monospace,Consolas,monospace;pointer-events:none}#fpsbox[hidden]{display:none}</style>`);
// A water thumbnail is drawn on the game canvas; afterwards the game's own scenery picture is put back, so the next frame does not
// have to redraw the whole landscape (that cost a long frame per thumbnail, twice).
{ const _vt=v3Thumb; v3Thumb=function(id){ if(V3THUMB[id]) return V3THUMB[id]; const c=V3CACHE, p=V3PREV; try{ return _vt(id); } finally{ V3CACHE=c; V3PREV=p; v3palette.k=null; } }; }
//@layer pc pc/ui_fit.js
//@layer pc pc/scene_light.js
// opening or closing the menu changes the layout under the water: measure the water again on the next frame (does not depend on
// the browser's size watcher, which some browsers deliver late)
{ const _mm=menuMode; menuMode=function(){ const was=MENU_OPEN, r=_mm.apply(this,arguments); if(was!==MENU_OPEN) requestAnimationFrame(()=>{ try{ resize(); }catch(e){} }); return r; }; }
// Feats, organized (director, 2026-11-17: hard to read, not organized): grouped under labelled headings with "x of y done",
// closest to finishing first inside each group. PC shows every feat at once (no "Show all" button).
{ const CATS=[['Catching',['c10','c100','c500','c2000','c5000','perfect25','hot10','hot100','frenzy5','frenzy100','snap10','snap50','storm','trench','star1']],
    ['Collection',['sp10','sp20','sp50','sp100','sp160','spall','shiny','shiny10','shiny50','trophy','trophy50','junk20','junkall','loot5','loot25']],
    ['Legends & myths',['leg','leg5','leg12','legall','myth1','myth3','mythall']],
    ['Pets',['pet50','bond10','pets3','petsall']],
    ['Waters',[]],
    ['Aquarium & home',['tank6','tank12','decor5','decor15','cozy15','dock8']],
    ['Style',['hats5','hats15','hatsall','style5']],
    ['Gear',['rods4','rods8','rod10','atts10','buff4']],
    ['Boardwalk & events',['derby1','derby10','gold3','claw10','crates10']],
    ['Progress',['rich','rich1m','rich10m','rank5','rank20','rank50','demand10','tasks10','tasks100','streak10','streak30','pass25','pass50','tide1','tide3','paths5']]];
  CATS[1][1].push('sp250'); FEAT_CATS_REF=CATS; /* shared with the category completion bonuses (br_pc05.js) */
  const catOf=f=>{ if(/^Master of /.test(f.name)) return 'Waters'; const c=CATS.find(([,ids])=>ids.includes(f.id)); return c?c[0]:'More'; };
  const order=CATS.map(c=>c[0]).concat('More');
  // PC: every feat on one screen - a card per group laid out in columns, one compact line per feat (name, progress, bar, reward;
  // the description on hover); finished feats stay in their group with a tick
  const board=(P,info)=>{ let fb=P.querySelector('.featboard'); if(fb) fb.remove(); fb=document.createElement('div'); fb.className='featboard';
    for(const cat of order){ const list=info.filter(x=>x.cat===cat).sort((a,b)=>(a.done-b.done)||(b.p-a.p)); if(!list.length) continue; const nd=list.filter(x=>x.done).length;
      fb.insertAdjacentHTML('beforeend',`<section class="fb-cat"><header><span>${esc(cat)}</span><span class="fb-n">${nd} / ${list.length}</span></header><ul>${list.map(x=>{ const t=x.t, metas=[...t.querySelectorAll(':scope > .meta')], desc=metas[0]?metas[0].textContent:'', cnt=(t.querySelector('.row .meta')||{}).textContent||'', val=t.querySelector('.val'), rew=val?val.innerHTML:'';
        return `<li class="fb-row${x.done?' done':''}" title="${esc(desc)}"><span class="fb-name">${x.done?'✓ ':''}${esc((t.querySelector('h4')||{}).textContent||'')}</span><span class="fb-cnt">${x.done?'Done':esc(cnt)}</span><i class="fb-bar"><b style="width:${Math.min(100,x.p)}%"></b></i><span class="fb-rew">${rew}</span></li>`; }).join('')}</ul></section>`); }
    const nav=P.querySelector('.sect-nav'), grid=[...P.children].find(c=>c.classList.contains('grid')), more=grid&&grid.nextElementSibling;
    if(nav) nav.style.display='none'; if(grid) grid.style.display='none'; if(more&&more.tagName==='BUTTON') more.style.display='none';
    (grid||P.lastChild).after(fb);
    // columns filled by hand: each group card goes into the shortest column (the browser's own balancing left columns empty)
    const w=innerWidth-32, n=w>=1300?5:w>=1000?4:3 /* the page is the window minus its margins: no measuring right after building it */, cols=[...Array(n)].map(()=>{ const d=document.createElement('div'); d.className='fb-col'; return d; }), h=new Array(n).fill(0);
    const secs=[...fb.children], size=s=>s.querySelectorAll('.fb-row').length+2.2, pos=new Map(secs.map((s,i)=>[s,i]));
    secs.slice().sort((a,b)=>size(b)-size(a)).forEach(sec=>{ const i=h.indexOf(Math.min(...h)); cols[i].appendChild(sec); h[i]+=size(sec); }); /* biggest groups first: even columns */
    cols.forEach(c=>[...c.children].sort((a,b)=>pos.get(a)-pos.get(b)).forEach(s=>c.appendChild(s))); /* each column keeps the usual group order */
    cols.forEach(c=>fb.appendChild(c)); fb.style.gridTemplateColumns='repeat('+n+',minmax(0,1fr))'; };
  // full HD: a reader. Categories on the left (count + progress), the chosen category's feats as readable cards on the right
  // (director, 2026-11-17: the five-column board was cramped and hard to read on a 1080p screen in full screen)
  let featCat=null;
  const reader=(P,info)=>{ P.querySelector('.featboard')?.remove(); P.querySelector('.featrd')?.remove();
    const cats=order.map(cat=>{ const list=info.filter(x=>x.cat===cat).sort((a,b)=>(a.done-b.done)||(b.p-a.p)); return {cat,list,nd:list.filter(x=>x.done).length}; }).filter(c=>c.list.length);
    if(!featCat||!cats.some(c=>c.cat===featCat)) featCat=(cats.find(c=>c.nd<c.list.length)||cats[0]).cat;
    const total=info.length, done=info.filter(x=>x.done).length;
    const card=x=>{ const t=x.t, metas=[...t.querySelectorAll(':scope > .meta')], desc=metas[0]?metas[0].textContent:'', cnt=(t.querySelector('.row .meta')||{}).textContent||'', val=t.querySelector('.val'), rew=val?val.innerHTML:'';
      return `<article class="fr-card${x.done?' done':''}"><header><b>${x.done?'✓ ':''}${esc((t.querySelector('h4')||{}).textContent||'')}</b><span class="fr-cnt">${x.done?'Done':esc(cnt)}</span></header><p>${esc(desc)}</p><i class="fr-bar"><b style="width:${Math.min(100,x.p)}%"></b></i><div class="fr-rew">${rew}</div></article>`; };
    const fr=document.createElement('div'); fr.className='featrd';
    fr.innerHTML=`<nav class="fr-rail"><div class="fr-total"><b>${done}</b> of ${total} done<i class="fr-bar"><b style="width:${done/total*100}%"></b></i></div>${cats.map(c=>`<button type="button" class="fr-cat" data-cat="${esc(c.cat)}" aria-pressed="${c.cat===featCat}"><span>${esc(c.cat)}</span><span class="fr-n">${c.nd} / ${c.list.length}</span><i class="fr-bar"><b style="width:${c.nd/c.list.length*100}%"></b></i></button>`).join('')}</nav><section class="fr-main"></section>`;
    const main=fr.querySelector('.fr-main'); const show=cat=>{ featCat=cat; const c=cats.find(x=>x.cat===cat); main.innerHTML=`<h3>${esc(cat)} <span class="fr-n">${c.nd} of ${c.list.length} done</span></h3><div class="fr-grid">${c.list.map(card).join('')}</div>`; fr.querySelectorAll('.fr-cat').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.cat===cat))); };
    fr.querySelectorAll('.fr-cat').forEach(b=>b.addEventListener('click',e=>{ e.stopPropagation(); show(b.dataset.cat); try{ window.__pcfitSoon&&__pcfitSoon(); }catch(er){} }));
    const nav=P.querySelector('.sect-nav'), grid=[...P.children].find(c=>c.classList.contains('grid')), more=grid&&grid.nextElementSibling;
    if(nav) nav.style.display='none'; if(grid) grid.style.display='none'; if(more&&more.tagName==='BUTTON') more.style.display='none';
    (grid||P.lastChild).after(fr); show(featCat); };
  const organize=P=>{ const grid=[...P.children].find(c=>c.classList.contains('grid')); if(!grid) return;
    const byName={}; FEATS.forEach(f=>byName[f.name]=f);
    const tiles=[...grid.children].filter(t=>t.classList.contains('tile')); const prog=t=>{ const i=t.querySelector('.prog i'); return i?parseFloat(i.style.width)||0:(t.classList.contains('done')?100:0); };
    const info=tiles.map(t=>{ const nm=(t.querySelector('h4')||{}).textContent||'', f=byName[nm.trim()]; return {t,cat:f?catOf(f):'More',done:t.classList.contains('done'),p:prog(t)}; });
    if(document.body.classList.contains('pc-fhd')){ reader(P,info); return; }
    if(document.body.classList.contains('pch-on')){ board(P,info); return; }
    grid.querySelectorAll('.feat-cat').forEach(h=>h.remove());
    for(const cat of order){ const list=info.filter(x=>x.cat===cat).sort((a,b)=>(a.done-b.done)||(b.p-a.p)); if(!list.length) continue;
      const h=document.createElement('div'); h.className='feat-cat'; h.dataset.cat=cat; const nd=list.filter(x=>x.done).length;
      h.innerHTML=`<span>${esc(cat)}</span><span class="meta">${nd} of ${list.length} done</span>`; grid.appendChild(h); list.forEach(x=>{ x.t.dataset.cat=cat; grid.appendChild(x.t); }); }
    const sync=()=>grid.querySelectorAll('.feat-cat').forEach(h=>{ const any=[...grid.querySelectorAll('.tile[data-cat="'+CSS.escape(h.dataset.cat)+'"]')].some(t=>t.style.display!=='none'); h.style.display=any?'':'none'; });
    sync(); const nav=P.querySelector('.sect-nav'); if(nav) nav.addEventListener('click',()=>setTimeout(sync,0)); const more=grid.nextElementSibling; if(more&&more.tagName==='BUTTON') more.addEventListener('click',()=>setTimeout(sync,0)); };
  const _rp=renderPanel; renderPanel=function(){ if(S.tab==='feats'&&document.body.classList.contains('pch-on')) featsAll=true; const r=_rp.apply(this,arguments); try{ if(S.tab==='feats') organize($('panel')); }catch(e){} return r; }; }
document.head.insertAdjacentHTML('beforeend',`<style>
#panel .grid > .feat-cat{grid-column:1 / -1;display:flex;align-items:baseline;gap:10px;margin:10px 2px 0;padding-bottom:4px;border-bottom:1px solid #ffffff14;font:800 13px var(--display,system-ui);letter-spacing:.06em;text-transform:uppercase;color:#cfe0f2}
#panel .grid > .feat-cat:first-child{margin-top:0}
#panel .grid > .feat-cat .meta{text-transform:none;letter-spacing:0;font-weight:700;color:#8fa6bf}
</style>`);
//@layer pc pc/ui_patch_card.js
//@layer pc pc/ui_fishlog.js
// Pets > Find more: the "Show pets that boost" label stayed above a filter that is hidden on that tab (all platforms).
// PC: the shop cards are compact and the pets still to discover become short wide rows, so the page fits the screen.
{ const _rp=renderPanel; renderPanel=function(){ const r=_rp.apply(this,arguments); try{ if(S.tab==='pets'){ const g=$('panel').querySelector(':scope > .grid'); if(g) [...g.children].forEach(t=>{ if(!t.classList.contains('tile')) return; const h=t.querySelector('h4'); if(h&&h.textContent.trim()==='???') t.classList.add('pet-hid'); else if(t.querySelector('[data-act="buypet"]')) t.classList.add('pet-sale'); }); } }catch(e){} return r; }; }
document.head.insertAdjacentHTML('beforeend',`<style>
#menuov #panel .ctl-l:has(+ .chips[style*="display: none"]),#menuov #panel .ctl-l:has(+ .chips[hidden]){display:none!important}
body.pch-on #menuov #panel > .grid:has(> .pet-hid),body.pch-on #menuov #panel > .grid:has(> .pet-sale){grid-template-columns:repeat(auto-fill,minmax(124px,1fr))!important;gap:8px!important}
body.pch-on #panel .tile.pet-sale{padding:8px 9px!important;gap:3px!important}
body.pch-on #panel .tile.pet-sale canvas{width:96px!important;height:56px!important}
body.pch-on #panel .tile.pet-sale h4{font-size:13.5px!important;margin:0!important}
body.pch-on #panel .tile.pet-sale .meta{font-size:11px!important;line-height:1.35;display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden}
body.pch-on #panel .tile.pet-sale .btn{padding:5px 8px!important;font-size:12px!important;min-height:0!important}
body.pch-on #panel .tile.pet-hid{grid-column:span 2;display:grid!important;grid-template-columns:52px minmax(0,1fr);grid-template-rows:auto auto;column-gap:10px;row-gap:1px;align-items:center;padding:7px 10px!important;opacity:.85}
body.pch-on #panel .tile.pet-hid canvas{grid-row:1 / 3;width:52px!important;height:30px!important}
body.pch-on #panel .tile.pet-hid h4{display:none}
body.pch-on #panel .tile.pet-hid > .meta{font-size:11.5px!important;line-height:1.3;margin:0!important}
body.pch-on #panel .tile.pet-hid > span.meta{color:#9fb2c8}
</style>`);
//@layer pc pc/ui_pets_find.js
//@layer pc pc/ui_settings.js
//@layer pc pc/ui_header.js
//@layer ios ios/ui_homescreen.js
// No rainbows at night (director, 2026-11-17: "no nighttime rainbows pls yuck"): the rainbow is drawn only in daylight and fades
// out fully as dusk falls (it hung on at 15% before). The weather and its bonus stay: a day here lasts 6 minutes and a weather 4,
// so every Rainbow spell runs into some night and swapping them out would remove rainbows altogether.
{
  // Fog's tag says what it does: night fish come out by day (at night there is nothing extra to say)
  try{ Object.defineProperty(WX_TAG,'Fog',{configurable:true,enumerable:true,get(){ try{ return nightness(phase())>.5?'':'night fish out by day'; }catch(e){ return 'night fish out by day'; } }}); }catch(e){} }
// =====================================================================
// Weather that fits the time of day (director, 2026-11-17: "no nighttime rainbows", "all weather needs to be time appropriate").
// Rainbow and Gilded light happen only by day, Aurora and Blood Moon only at night; rain, storm, fog, the spawning run and clear
// skies can happen any time. A day here lasts 6 minutes and a weather spell 4, so a spell that needs the other time of day waits
// for it (or ends when it passes) and the sky is clear in between. The weather is worked out as stretches of time, so what you
// see, its bonus, its countdown, its fade in and out and the forecast always agree. These spells now only run for part of their
// slot, so they are drawn twice as often, which keeps their share of the day about the same.
// =====================================================================
{ const RULE={'Rainbow':'day','Gilded':'day','Aurora':'night','Blood Moon':'night'};
  const W=k=>WEATHERS.find(w=>w.k===k), CLEAR=W('Clear');
  // twice the draws for the time-bound spells, taken from Clear (the weights still add up to 100)
  try{ const add={Rainbow:3,Gilded:6,Aurora:4,'Blood Moon':3}; let took=0; for(const k in add){ const w=W(k); if(w){ w.w+=add[k]; took+=add[k]; } } if(CLEAR) CLEAR.w-=took; }catch(e){}
  const slotW=weatherAt; // the raw schedule: one roll every WX_LEN seconds
  const night=t=>nightness((((t%CYCLE)+CYCLE)%CYCLE)/CYCLE)>.5;
  const kindAt=t=>{ const w=slotW(Math.floor(t/WX_LEN)), r=RULE[w.k]; return !r||(r==='night')===night(t)?w:CLEAR; };
  // the stretch of time around t with the same weather: [start, end)
  let memo=null; const STEP=2;
  const seg=t=>{ if(memo&&t>=memo.start&&t<memo.end) return memo; const w=kindAt(t); let a=Math.floor(t), b=Math.floor(t)+1;
    for(let i=0;i<600&&kindAt(a-STEP).k===w.k;i++) a-=STEP; for(let i=0;i<600&&kindAt(b).k===w.k;i++) b+=STEP;
    while(a>0&&kindAt(a-1).k===w.k) a--; while(b>a&&kindAt(b-1).k!==w.k) b--; // tighten to the second
    return memo={w,start:a,end:b}; };
  const now=()=>Date.now()/1000;
  weather=function(){ return seg(now()).w; };
  wxLeft=function(){ return Math.max(1,Math.ceil(seg(now()).end-now())); };
  wxAmt=function(){ const t=now(), s=seg(t); let a=1; if(kindAt(s.start-1).k!==s.w.k) a=Math.min(a,(t-s.start)/WX_FADE); if(kindAt(s.end).k!==s.w.k) a=Math.min(a,(s.end-t)/WX_FADE); return clamp(a,0,1); };
  // the forecast: the next stretches, as they will really happen
  wxForecast=function(n=6){ const t0=now(); let s=seg(t0); const out=[]; for(let i=0;out.length<n&&i<40;i++){ const nx=seg(s.end); if(!nx||nx.end<=s.end) break; out.push({k:nx.w.k,note:nx.w.note,at:nx.start-t0,len:nx.end-nx.start}); s=nx; } memo=null; return out; };
  // the raw slot schedule as seen at the start of each slot (used by the "starts in under a minute" heads-up)
  weatherAt=function(slot){ return kindAt(slot*WX_LEN+1); };
  if(/[?&]test\b/.test(location.search)) window.__wxTime={kindAt,seg,night,RULE}; }
//@layer pc pc/ui_patch_reader.js
//@layer pc pc/ui_header_narrow.js
//@layer pc pc/ui_settings_notes.js
//@layer pc pc/ui_fhd.js
