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
KEYS.forEach((k,i)=>{ if(k[0]==='Esc') KEYS[i]=['Esc','Close the menu, a card or the search']; if(k[0]==='M') KEYS[i]=['M','Open or close the menu']; });
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
  <button type="button" class="mo-home" data-mo="home" aria-label="Overview" title="Overview: your cooler, bounties, aquarium, events and more"><svg viewBox="0 0 24 24" width="19" height="19" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3.5" y="3.5" width="7" height="7" rx="1.6"/><rect x="13.5" y="3.5" width="7" height="7" rx="1.6"/><rect x="3.5" y="13.5" width="7" height="7" rx="1.6"/><rect x="13.5" y="13.5" width="7" height="7" rx="1.6"/></svg><span class="mo-hl">Overview</span><span class="mo-hdot" hidden></span></button>
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
  const h=MO.querySelector('.mo-home'); if(h){ const on=S.tab===DASH; h.classList.toggle('on',on); h.setAttribute('aria-pressed',on?'true':'false'); } }
MO.addEventListener('click',e=>{ const b=e.target.closest('[data-mo]'); if(!b) return; e.stopPropagation(); const m=b.dataset.mo;
  if(m==='close') closeMenu(); else if(m==='home'){ if(S.tab!==DASH){ setTab(DASH); save(); } } else if(m==='search'){ const s=$('searchbtn'); if(s) s.click(); } else if(m==='settings'){ const mt=MENU_MORE.tabs, last=menuLast().more; setTab(S.tab!=='settings'&&mt.includes(last)&&menuSecOf(S.tab)!==MENU_MORE?last:'settings'); save(); } });
// ---------- the Menu button on the water (fishing mode) ----------
const MB=document.createElement('button'); MB.id='menubtn'; MB.type='button'; MB.setAttribute('aria-label','Open the menu (M)'); MB.title='Menu (M)';
MB.innerHTML='<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3.5" y="3.5" width="7" height="7" rx="1.6"/><rect x="13.5" y="3.5" width="7" height="7" rx="1.6"/><rect x="3.5" y="13.5" width="7" height="7" rx="1.6"/><rect x="13.5" y="13.5" width="7" height="7" rx="1.6"/></svg><span class="mbl">Menu</span><span class="mbdot" hidden></span>';
$('stage').appendChild(MB); ['pointerdown','touchstart','mousedown'].forEach(ev=>MB.addEventListener(ev,e=>e.stopPropagation(),{passive:true}));
MB.addEventListener('click',e=>{ e.stopPropagation(); try{ startAudio(); }catch(er){} openMenu(DASH); });
// what is waiting: the menu badges plus the Overview's ready cards (a full cooler, a finished bounty, coins in the aquarium)
// how many things are waiting (a page with something new counts once, however big its own number is)
function waitingCount(){ let n=0; try{ for(const s of MENU_SECS) for(const t of s.tabs) if(menuDot(t)) n++; if(S.cooler.length>=gv('cooler')) n++; if(S.tankBank>=1&&S.tank.length) n++; }catch(e){} return n; }
setInterval(()=>{ const n=waitingCount(), d=MB.querySelector('.mbdot'), t=n>99?'99+':String(n); const al='Open the menu (M)'+(n?', '+n+' thing'+(n===1?'':'s')+' waiting':''); if(MB.getAttribute('aria-label')!==al){ MB.setAttribute('aria-label',al); MB.title=al; } if(n){ if(d.textContent!==t) d.textContent=t; d.hidden=false; } else d.hidden=true;
  const hd=MO.querySelector('.mo-hdot'); if(hd){ const r=(S.cooler.length>=gv('cooler')?1:0)+(S.tankBank>=1&&S.tank.length?1:0)+S.bounties.filter(bDone).length; if(r){ hd.textContent=r; hd.hidden=false; } else hd.hidden=true; } },1000);
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
{ let lastD=0; const _dr=draw; draw=function(now){ if(MENU_OPEN&&now-lastD<250) return; lastD=now; return _dr(now); }; }
// a full cooler: show it on the dashboard instead of throwing you into a menu
// a full cooler when you try to cast: the game opens the Cooler page (in the full-screen menu)
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
      else { const sp=SPI[b.sp]; if(!sp) return ''; what=b.legend&&!S.journal[sp.id]?'Catch the legend of '+LOCS[locIdx(sp.loc)].name:b.type==='count'?`Catch ${b.n} × ${sp.name}`:`Catch ${/^[aeiou]/i.test(sp.name)?"an":"a"} ${sp.name} of ${kgStr(b.kg)} or more`; if(b.type==='count'){ p=Math.min(1,b.have/b.n); pt=Math.min(b.have,b.n)+' / '+b.n; } }
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
// phones held sideways: the top bar's seven chips share the width by what they hold, so the water name always fits
document.head.insertAdjacentHTML('beforeend',`<style>@media (orientation:landscape) and (max-height:560px){.hud{grid-template-columns:minmax(0,.9fr) minmax(0,.85fr) minmax(0,1.65fr) minmax(0,.8fr) minmax(0,.9fr) minmax(0,1fr) minmax(0,.95fr)!important}}</style>`);
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
#menubtn{position:absolute;right:12px;bottom:12px;z-index:6;display:inline-flex;align-items:center;gap:8px;min-height:48px;padding:0 18px 0 14px;border-radius:15px;border:1px solid #ffd36a99;background:linear-gradient(180deg,#24395cee,#15233ef2);color:#fff3cf;font:800 15px var(--display,system-ui);letter-spacing:.01em;cursor:pointer;box-shadow:0 8px 22px #02060fcc,0 0 18px #ffd36a2a;transition:transform .12s,box-shadow .18s,border-color .18s;touch-action:manipulation;-webkit-tap-highlight-color:transparent}
#menubtn:hover{border-color:var(--gold,#ffd36a);box-shadow:0 8px 22px #02060fcc,0 0 26px #ffd36a55;transform:translateY(-1px)}
#menubtn:active{transform:scale(.97)}
#menubtn:focus-visible{outline:2px solid var(--gold,#ffd36a);outline-offset:3px}
#menubtn .mbdot{position:absolute;top:-8px;right:-7px;min-width:21px;height:21px;padding:0 6px;box-sizing:border-box;border-radius:999px;background:linear-gradient(180deg,#ffb36a,#ff7a4a);color:#2a1206;font:800 12px/21px var(--display,system-ui);text-align:center;box-shadow:0 0 10px #ff8a5c88,0 2px 6px #0008}
#menubtn .mbdot[hidden]{display:none}
body.card-open #menubtn{opacity:0;pointer-events:none}
@media (max-height:560px){#menubtn{min-height:42px;right:10px;bottom:10px;font-size:14px;padding:0 15px 0 12px}}
@media (max-width:420px){#menubtn{right:10px;bottom:10px}}
.dlprev{right:auto!important;left:50%!important;bottom:4px!important;transform:translateX(-50%);opacity:.8}
/* ---------- the full-screen menu: no pinned bars, every part is a row of one screen-tall grid (works under Safari's toolbars) ---------- */
#menuov{inset:auto!important;top:0!important;left:0!important;right:0!important;height:100vh;height:100dvh}
#menuov .mo-in{grid-template-columns:auto auto minmax(0,1fr) auto!important;grid-template-rows:auto auto minmax(0,1fr)!important;grid-template-areas:"back home secs tools" "sub sub sub sub" "body body body body"!important}
#menuov .mo-title{display:none!important}
#menuov .mo-home{grid-area:home;align-self:center;position:relative;display:inline-flex;align-items:center;gap:7px;min-height:46px;padding:0 14px;border-radius:14px;border:1px solid var(--line,#26385180);background:var(--glass,#111c2e);color:#bcd0e4;font:800 14px var(--display,system-ui);cursor:pointer;transition:background .15s,border-color .15s,color .15s}
#menuov .mo-home:hover{border-color:#5a7ea8aa;color:#eef3f8}
#menuov .mo-home.on{background:linear-gradient(180deg,#ffe08a,#f2b84e);border-color:#ffe7a6;color:#2a1806}
#menuov .mo-home:focus-visible{outline:2px solid var(--gold,#ffd36a);outline-offset:2px}
#menuov .mo-hdot{position:absolute;top:-7px;right:-6px;min-width:19px;height:19px;padding:0 5px;box-sizing:border-box;border-radius:999px;background:linear-gradient(180deg,#ffb36a,#ff7a4a);color:#2a1206;font:800 11px/19px var(--display,system-ui);text-align:center}
#menuov .mo-hdot[hidden]{display:none}
@media (max-width:1100px){#menuov .mo-in{grid-template-rows:auto auto auto minmax(0,1fr)!important;grid-template-areas:"back home . tools" "secs secs secs secs" "sub sub sub sub" "body body body body"!important}}
@media (max-width:640px){#menuov .mo-home{min-height:42px;padding:0 11px}#menuov .mo-home .mo-hl{font-size:13px}}
@media (max-width:460px){#menuov .mo-home .mo-hl{display:none}#menuov .mo-home{padding:0 11px}#menuov .mo-tools{gap:6px}#menuov .mo-tb{width:38px;height:38px}#menuov .mo-coin{padding:0 9px}}
#menuov .mo-in{overflow:hidden}
/* phones held upright: the categories are the bottom row of the same grid (thumb reach), never a pinned bar */
@media (max-width:700px) and (orientation:portrait){
  #menuov .mo-in{grid-template-rows:auto auto minmax(0,1fr) auto!important;grid-template-areas:"back home . tools" "sub sub sub sub" "body body body body" "secs secs secs secs"!important;row-gap:4px!important}
  body #menuov #tabs.secmode .secbar{position:static!important;top:auto!important;bottom:auto!important;left:auto!important;right:auto!important;transform:none!important;margin:0 calc(-1 * max(10px,env(safe-area-inset-right))) 0 calc(-1 * max(10px,env(safe-area-inset-left)));padding:6px max(8px,env(safe-area-inset-right)) calc(6px + env(safe-area-inset-bottom)) max(8px,env(safe-area-inset-left))!important}
  body #menuov #panel{padding-bottom:16px!important}
}
@media (orientation:landscape) and (max-height:560px){#menuov .mo-in{grid-template-rows:auto auto minmax(0,1fr)!important;grid-template-areas:"back home secs tools" "sub sub sub sub" "body body body body"!important}#menuov .mo-home{min-height:38px;padding:0 10px}#menuov .mo-home .mo-hl{display:none}}
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

// =====================================================================
// Menus on short landscape screens (phones held sideways): the categories become a rail down the left, so the page
// gets the whole height under one slim row (the page's own tabs and the coin / search / settings buttons).
// =====================================================================
document.head.insertAdjacentHTML('beforeend',`<style>
@media (orientation:landscape) and (max-height:560px){
  #menuov .mo-in{grid-template-columns:clamp(132px,18vw,176px) minmax(0,1fr) auto!important;grid-template-rows:auto auto minmax(0,1fr)!important;grid-template-areas:"back sub tools" "home body body" "secs body body"!important;column-gap:12px!important;row-gap:5px!important;padding-top:max(6px,env(safe-area-inset-top))!important}
  #menuov .mo-back,#menuov .mo-home{width:100%;box-sizing:border-box;justify-content:flex-start;min-height:36px!important;padding:0 10px!important;border-radius:12px;align-self:start}
  #menuov .mo-home .mo-hl{display:inline!important;font-size:13px}
  body #menuov #tabs.secmode .secbar{grid-area:secs;display:flex!important;flex-direction:column;align-self:stretch;gap:4px;overflow-y:auto;overscroll-behavior:contain;scrollbar-width:none;padding:2px 0 10px!important;margin:0!important;min-height:0;background:none!important;border:0!important;box-shadow:none!important}
  body #menuov #tabs.secmode .secbar::-webkit-scrollbar{display:none}
  body #menuov #tabs.secmode .secb{flex:0 0 auto;flex-direction:row!important;justify-content:flex-start;gap:9px!important;min-height:36px!important;padding:0 10px!important;font-size:13px!important;border-radius:12px!important}
  body #menuov #tabs.secmode .secb .seci svg{width:18px;height:18px}
  body #menuov #tabs.secmode .secb .secfull{display:inline!important}body #menuov #tabs.secmode .secb .secshort{display:none!important}
  body #menuov #tabs.secmode .secdot{top:50%!important;right:8px!important;transform:translateY(-50%)}
  body #menuov #tabs.secmode .secb .seclive{top:50%!important;left:auto!important;right:8px;transform:translateY(-50%)}
  body #menuov #tabs.secmode .subbar{grid-area:sub;align-self:center;padding:0!important;gap:6px!important;margin:0!important}
  body #menuov #tabs.secmode .subp{min-height:34px!important;padding:0 12px!important;font-size:13px!important}
  body #menuov #panel{padding-top:2px!important}
  body #menuov #panel > h2:first-child,body #menuov #panel h2{font-size:18px!important;margin:0 0 3px!important;line-height:1.2}
  body #menuov #panel p.sub{font-size:12px!important;margin:0 0 8px!important;line-height:1.35}
}
</style>`);
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
  #menuov .mo-back,#menuov .mo-home{padding:0 8px!important}
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
  #menuov .mo-back,#menuov .mo-home{justify-content:center;padding:0!important;font-size:0!important}
  #menuov .mo-back::after{content:none!important}
  #menuov .mo-back svg:not(.mo-bi){display:none!important}
  #menuov .mo-home .mo-hl{display:none!important}
  body #menuov #tabs.secmode .secb{justify-content:center;padding:0!important;position:relative}
  body #menuov #tabs.secmode .secb .secl{display:none!important}
  body #menuov #tabs.secmode .secb .seci svg{width:20px;height:20px}
  body #menuov #tabs.secmode .secb .secdot{position:absolute!important;top:-4px!important;right:-4px!important;left:auto!important;transform:none!important;min-width:17px;height:17px;font-size:10px;line-height:17px;margin:0!important}
  body #menuov #tabs.secmode .secb .seclive{position:absolute!important;top:3px!important;left:4px!important;right:auto!important;margin:0!important}
  #menuov .mo-hdot{top:-5px!important;right:-5px!important}
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
$('stage').appendChild(CD); CD.prepend(MB); MB.querySelector('svg').setAttribute('width','20');
['pointerdown','touchstart','mousedown'].forEach(ev=>CD.addEventListener(ev,e=>e.stopPropagation(),{passive:true}));
CD.addEventListener('click',e=>{ const b=e.target.closest('[data-cd]'); if(!b) return; e.stopPropagation(); try{ startAudio(); }catch(er){} const sec=MENU_SECS.find(s=>s.id===b.dataset.cd); if(!sec) return; const list=menuTabsIn(sec), last=menuLast()[sec.id]; openMenu(list.includes(last)?last:list[0]); });
setInterval(()=>{ if(MENU_OPEN) return; for(const b of CD.querySelectorAll('.cdb')){ const sec=MENU_SECS.find(s=>s.id===b.dataset.cd), n=sec.tabs.reduce((a,t)=>a+menuDot(t),0), d=b.querySelector('.cddot'), t=n>99?'99+':String(n); if(n){ if(d.textContent!==t) d.textContent=t; d.hidden=false; } else d.hidden=true;
  if(sec.id==='chal'){ const live=!!(S.chal||liveScheds().length); b.classList.toggle('live',live); } } },1000);
document.head.insertAdjacentHTML('beforeend',`<style>
#catdock{position:absolute;z-index:6;left:50%;bottom:10px;transform:translateX(-50%);display:flex;gap:3px;padding:4px;border-radius:17px;background:linear-gradient(180deg,#152540e0,#0c1628ec);border:1px solid #ffffff1c;box-shadow:0 10px 26px #02060fb3;-webkit-backdrop-filter:blur(6px);backdrop-filter:blur(6px)}
#catdock .cdb,#catdock #menubtn{position:relative!important;inset:auto!important;transform:none;display:flex!important;flex-direction:column;align-items:center;justify-content:center;gap:2px;min-width:64px;height:48px!important;min-height:0!important;padding:0 6px!important;margin:0;border-radius:13px;border:1px solid transparent;background:transparent;color:#c9d7e8;font:800 11px/1.1 var(--display,system-ui);letter-spacing:.01em;cursor:pointer;box-shadow:none!important;touch-action:manipulation;-webkit-tap-highlight-color:transparent;transition:background .15s,color .15s,border-color .15s}
#catdock .cdb:hover{background:#ffffff10;color:#fff}
#catdock .cdb:active,#catdock #menubtn:active{transform:scale(.95)}
#catdock #menubtn{border-color:#ffd36a77;background:linear-gradient(180deg,#2a3f63,#1a2a48);color:#fff1c8}
#catdock #menubtn:hover{border-color:var(--gold,#ffd36a)}
#catdock .cdb:focus-visible,#catdock #menubtn:focus-visible{outline:2px solid var(--gold,#ffd36a);outline-offset:1px}
#catdock .cdl,#catdock .mbl{white-space:nowrap}
#catdock .cddot,#catdock .mbdot{position:absolute!important;top:-6px!important;right:calc(50% - 25px)!important;left:auto!important;min-width:18px!important;height:18px!important;padding:0 5px!important;box-sizing:border-box;border-radius:999px;background:linear-gradient(180deg,#ffb36a,#ff7a4a);color:#2a1206;font:800 10.5px/18px var(--display,system-ui)!important;text-align:center;box-shadow:0 0 8px #ff8a5c88}
#catdock .cddot[hidden],#catdock .mbdot[hidden]{display:none!important}
#catdock .cdb.live::before{content:"";position:absolute;top:5px;left:calc(50% - 21px);width:8px;height:8px;border-radius:50%;background:#ff5a6a;box-shadow:0 0 8px #ff5a6a;animation:livepulse 1.6s ease-in-out infinite}
body.card-open #catdock{opacity:0;pointer-events:none}
/* the tip line and the Rest button sit clear of the bar */
body.dl-fish .wrap > #hint,body.dl-fish #stage > #hint{bottom:70px!important}
/* PC and tablets: icon and name side by side */
@media (min-width:701px) and (min-height:561px){
  #catdock .cdb,#catdock #menubtn{flex-direction:row;gap:7px;height:42px!important;padding:0 12px!important;font-size:13px;min-width:0}
  #catdock .cddot,#catdock .mbdot{top:-7px!important;right:-6px!important}
  #catdock .cdb.live::before{top:4px;left:4px}
  body.dl-fish .wrap > #hint,body.dl-fish #stage > #hint{bottom:66px!important}
}
/* phones held upright: the bar spans the bottom of the water, Rest sits just above it */
@media (max-width:700px) and (orientation:portrait){
  #catdock{left:6px;right:6px;bottom:6px;transform:none;justify-content:space-between;gap:2px;padding:3px;border-radius:15px}
  #catdock .cdb,#catdock #menubtn{flex:1 1 0;min-width:0;padding:0 1px!important;height:50px!important;font-size:10.5px}
  #catdock .cdl,#catdock .mbl{overflow:hidden;text-overflow:ellipsis;max-width:100%}
  body.dl-fish .resttog{bottom:66px!important;left:8px!important}
  body.dl-fish .wrap > #hint,body.dl-fish #stage > #hint{bottom:104px!important}
}
/* phones held sideways: a compact bar in the bottom middle, Rest on the left of the same row */
@media (orientation:landscape) and (max-height:560px){
  #catdock{bottom:6px;padding:3px;gap:2px;border-radius:14px}
  #catdock .cdb,#catdock #menubtn{min-width:58px;height:42px!important;font-size:10px;padding:0 4px!important}
  #catdock svg{width:18px;height:18px}
  body.dl-fish .resttog{bottom:12px!important}
  body.dl-fish .wrap > #hint,body.dl-fish #stage > #hint{bottom:56px!important}
}
@media (max-width:360px) and (orientation:portrait){ #catdock .cdb,#catdock #menubtn{font-size:9.5px} }
</style>`);
document.head.insertAdjacentHTML('beforeend',`<style>
@media (max-width:700px) and (orientation:portrait){ #catdock .cdb,#catdock #menubtn{font-size:9.5px;letter-spacing:0} #catdock svg{width:21px;height:21px} }
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
@media (max-width:379px) and (orientation:portrait){ #catdock{left:4px;right:4px;gap:1px;padding:3px 2px} #catdock .cdb,#catdock #menubtn{font-size:9px!important;letter-spacing:-.15px!important} }
</style>`);
document.head.insertAdjacentHTML('beforeend',`<style>
@media (min-width:701px) and (max-width:1099px) and (min-height:561px){
  #catdock .cdb,#catdock #menubtn{flex-direction:column;gap:2px;height:48px!important;padding:0 6px!important;font-size:11px;min-width:64px}
  #catdock .cddot,#catdock .mbdot{top:-6px!important;right:calc(50% - 25px)!important}
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

// =====================================================================
// Phones held sideways: the categories live in a rail on the RIGHT, both on the water and in the menu, so the thumb
// finds them in the same place; the page scroll never rubber-bands past its top.
// =====================================================================
document.head.insertAdjacentHTML('beforeend',`<style>
#menuov #panel{overscroll-behavior:contain;overscroll-behavior-y:none}
@media (orientation:landscape) and (max-height:560px){
  /* on the water: a slim rail down the right edge, growing up from the bottom corner */
  #catdock{left:auto!important;right:6px!important;top:auto!important;bottom:6px!important;transform:none!important;flex-direction:column;gap:2px;padding:3px;border-radius:14px}
  #catdock .cdb,#catdock #menubtn{flex-direction:row!important;justify-content:flex-start;gap:7px!important;width:112px;min-width:0!important;height:31px!important;padding:0 9px!important;font-size:11px!important;border-radius:10px}
  #catdock svg{width:17px!important;height:17px!important;flex:0 0 auto}
  #catdock .cddot,#catdock .mbdot{top:50%!important;right:6px!important;transform:translateY(-50%);min-width:17px!important;height:17px!important;line-height:17px!important;font-size:10px!important}
  #catdock .cdb.live::before{top:4px!important;left:4px!important;width:7px;height:7px}
  body.dl-fish .wrap > #hint,body.dl-fish #stage > #hint{bottom:10px!important;left:calc(50% - 62px)!important;max-width:calc(100% - 330px)!important}
  body.dl-fish .resttog{bottom:8px!important}
  .dlprev{bottom:calc(10px + env(safe-area-inset-bottom))!important;right:calc(140px + env(safe-area-inset-right))!important}
  /* in the menu: the icon rail on the right, the page tabs and coin / search / settings above the page */
  #menuov .mo-in{grid-template-columns:auto minmax(0,1fr) 52px!important;grid-template-areas:"tools sub back" "body body home" "body body secs"!important}
  #menuov .mo-tools{justify-self:start}
}
</style>`);
document.head.insertAdjacentHTML('beforeend',`<style>
@media (orientation:landscape) and (max-height:560px){
  #catdock .cdb,#catdock #menubtn{width:134px;padding:0 28px 0 9px!important}
  body.dl-fish .wrap > #hint,body.dl-fish #stage > #hint{left:calc(50% - 72px)!important;max-width:calc(100% - 350px)!important}
  .dlprev{right:calc(160px + env(safe-area-inset-right))!important}
}
</style>`);
// Fish Log on phones: the water list is one sideways-scrolling row (the chosen water scrolled into view), not five rows
{ const _t2=menuTidy2; menuTidy2=function(){ _t2(); try{ if(S.tab!=='journal') return; const row=$('panel').querySelector('.chips:has(> [data-act="encloc"])'); const on=row&&row.querySelector('[aria-pressed="true"]'); if(row&&on&&row.scrollWidth>row.clientWidth+2){ row.scrollLeft=Math.max(0,on.offsetLeft-row.clientWidth/2+on.offsetWidth/2); } }catch(e){} }; menuTidy=menuTidy2; }
document.head.insertAdjacentHTML('beforeend',`<style>
@container (max-width:760px){
  #menuov #panel .chips:has(> [data-act="encloc"]){flex-wrap:nowrap!important;overflow-x:auto;scrollbar-width:none;padding-bottom:2px;-webkit-mask-image:linear-gradient(90deg,#000 88%,transparent);mask-image:linear-gradient(90deg,#000 88%,transparent)}
  #menuov #panel .chips:has(> [data-act="encloc"])::-webkit-scrollbar{display:none}
  #menuov #panel .chips:has(> [data-act="encloc"]) > *{flex:0 0 auto}
  #menuov #panel .tile.hunt-bar p,#menuov #panel .tile.hunt-bar .meta{font-size:12px;line-height:1.35}
}
</style>`);
{ const _t3=menuTidy2; menuTidy2=function(){ _t3(); try{ if(S.tab!=='journal') return; const t=[...$('panel').querySelectorAll(':scope > .tile')].find(x=>/Angler rank/i.test(x.textContent)); if(t) t.classList.add('jrank'); }catch(e){} }; menuTidy=menuTidy2; }
document.head.insertAdjacentHTML('beforeend',`<style>
/* Bait in use: always one line */
#panel .tk-cur.tk-slim{flex-wrap:nowrap!important;white-space:nowrap}
#panel .tk-cur.tk-slim > *{min-width:0;overflow:hidden;text-overflow:ellipsis}
#panel .tk-cur.tk-slim > .btn{flex:0 0 auto;overflow:visible}
/* Fish Log rank card on narrow pages: the progress sits under the text instead of squeezing it */
@container (max-width:560px){
  #menuov #panel .tile.jrank{flex-wrap:wrap!important;gap:6px!important;margin-bottom:8px!important}
  #menuov #panel .tile.jrank > :first-child{flex:1 1 100%}
  #menuov #panel .tile.jrank > :last-child{flex:1 1 100%;min-width:0!important}
}
</style>`);
document.head.insertAdjacentHTML('beforeend',`<style>
/* sideways phones: the one row above the page is as slim as a tap allows */
@media (orientation:landscape) and (max-height:560px){
  body #menuov #tabs.secmode .subp{min-height:32px!important;padding:0 11px!important;font-size:12.5px!important}
  #menuov .mo-tb{width:34px!important;height:34px!important}
  #menuov .mo-coin{min-height:32px!important;padding:0 9px!important}
  #menuov .mo-back,#menuov .mo-home,body #menuov #tabs.secmode .secb{min-height:34px!important;height:34px}
  #menuov .mo-in{row-gap:4px!important;padding-top:max(5px,env(safe-area-inset-top))!important}
}
</style>`);
document.head.insertAdjacentHTML('beforeend',`<style>
@media (orientation:landscape) and (max-height:560px){
  #menuov #panel .bwx-nav:not(.wd-nav):not(.sect-nav){padding:3px!important;margin:6px 0!important;gap:4px}
  #menuov #panel .bwx-nav:not(.wd-nav):not(.sect-nav) > button{min-height:30px!important;height:30px;font-size:12.5px}
}
@media (max-width:700px) and (orientation:portrait){
  #menuov #panel .bwx-nav:not(.wd-nav) > button{min-height:34px!important}
}
</style>`);
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
// phones: the cooler count without spaces ("140/140") so the biggest cooler still fits its chip
{ const c=$('coolerct'); if(c&&window.MutationObserver){ const fix=()=>{ const bc=document.body.classList; if(!(bc.contains('phone-app')||bc.contains('phone-land'))) return; const t=c.textContent; if(/\s\/\s/.test(t)) c.textContent=t.replace(/\s*\/\s*/,'/'); }; new MutationObserver(fix).observe(c,{childList:true,characterData:true,subtree:true}); fix(); addEventListener('resize',()=>setTimeout(fix,60)); } }
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
// sideways phones: the menu rail shows each name next to its icon (it matches the rail on the water)
document.head.insertAdjacentHTML('beforeend',`<style>
@media (orientation:landscape) and (max-height:560px){
  #menuov .mo-in{grid-template-columns:auto minmax(0,1fr) 136px!important}
  #menuov .mo-back,#menuov .mo-home{justify-content:flex-start!important;gap:7px!important;padding:0 9px!important;font-size:12px!important}
  #menuov .mo-back::after{content:"Back"!important;font-size:12px!important}
  #menuov .mo-home .mo-hl{display:inline!important;font-size:12px!important}
  #menuov .mo-hdot{top:50%!important;right:6px!important;transform:translateY(-50%)}
  body #menuov #tabs.secmode .secb{justify-content:flex-start!important;gap:7px!important;padding:0 28px 0 9px!important;font-size:12px!important}
  body #menuov #tabs.secmode .secb .secl{display:inline!important;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
  body #menuov #tabs.secmode .secb .secfull{display:none!important}body #menuov #tabs.secmode .secb .secshort{display:inline!important}
  body #menuov #tabs.secmode .secb .seci svg{width:17px;height:17px}
  body #menuov #tabs.secmode .secb .secdot{top:50%!important;right:5px!important;transform:translateY(-50%)!important}
  body #menuov #tabs.secmode .secb .seclive{top:4px!important;left:4px!important}
}
</style>`);

// =====================================================================
// No Overview page (director, 2026-11-17): the Menu button, M and keys open the page you used last; the categories
// carry their own counts. 'dash' stays only as the internal "menu closed / fishing" state.
// =====================================================================
function menuLastPage(){ const ok=t=>!!t&&t!==DASH&&(MENU_SECS.some(s=>s.tabs.includes(t))||MENU_MORE.tabs.includes(t)); const l=S.settings&&S.settings.lastPage; return ok(l)?l:'cooler'; }
{ const _st05=setTab; setTab=function(t){ if(t&&t!==DASH){ try{ S.settings.lastPage=t; }catch(e){} } return _st05.apply(this,arguments); }; }
openMenu=function(t){ if(!t||t===DASH) t=menuLastPage(); MENU_WANT=true; setTab(t); save(); };
{ const h=MO.querySelector('.mo-home'); if(h) h.remove(); }
MB.setAttribute('aria-label','Open the menu (M)'); MB.title='Menu (M): opens the page you used last';
document.head.insertAdjacentHTML('beforeend','<style>#menuov .mo-home{display:none!important}</style>');

// =====================================================================
// QC pass fixes (2026-11-17, round 2)
// =====================================================================
{ const _t6=menuTidy2; menuTidy2=function(){ _t6(); try{ const P=$('panel');
    // Skills: the "Looking for specialisations? Open Paths" pointer is redundant (Paths is the tab right beside it)
    if(S.tab==='skills'){ const t=[...P.querySelectorAll(':scope > .tile')].find(x=>/Looking for specialisations/i.test(x.textContent)); if(t) t.remove(); }
    // Bounties: the three daily tasks sit side by side when there is room
    if(S.tab==='bounties'){ const t=[...P.querySelectorAll(':scope > .tile')].find(x=>{ const h=x.querySelector('h4'); return h&&/Daily tasks/i.test(h.textContent); }); if(t) t.classList.add('dtasks'); }
  }catch(e){} }; menuTidy=menuTidy2; }
document.head.insertAdjacentHTML('beforeend',`<style>
/* a page header's number or controls sit beside the text when they fit, and start on the left when they wrap */
#menuov #panel > .row.dl-head{justify-content:space-between!important}
#menuov #panel > .row.dl-head > :not(:first-child){margin-left:0!important}
/* Events calendar and daily tasks: side by side on wide enough pages */
@container (min-width:560px){
  #menuov #panel .ev-cal{display:grid!important;grid-template-columns:repeat(auto-fill,minmax(230px,1fr));column-gap:14px}
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
  #menuov #panel .bwx-nav.sect-nav{flex-wrap:nowrap!important;overflow-x:auto!important;scrollbar-width:none;display:flex!important;-webkit-mask-image:linear-gradient(90deg,#000 90%,transparent);mask-image:linear-gradient(90deg,#000 90%,transparent)}
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
  #menuov #panel .dock-h:has(> .dock-c),#menuov #panel .chips.pet-filter{display:flex!important;flex-wrap:nowrap!important;overflow-x:auto;scrollbar-width:none;gap:5px;-webkit-mask-image:linear-gradient(90deg,#000 88%,transparent);mask-image:linear-gradient(90deg,#000 88%,transparent)}
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
MB.remove();
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
@media (orientation:landscape) and (max-height:560px){ #menuov #panel .wd-prev{top:46px!important;height:calc(100dvh - 150px - env(safe-area-inset-top))!important} }
@media (min-width:600px){ #menuov #panel .stylewrap.wd .wd-prev{top:52px!important} }
</style>`);
// landscape phones: the wardrobe's section tabs stay on one line (Shop used to wrap onto a row of its own); on the
// narrowest screens the row scrolls sideways instead of squeezing the labels
document.head.insertAdjacentHTML('beforeend',`<style>@media (max-height:560px) and (orientation:landscape){
 #menuov #panel > .wd-nav.wd-top{flex-wrap:nowrap!important;overflow-x:auto!important;overflow-y:hidden!important;scrollbar-width:none;overscroll-behavior-x:contain}
 #menuov #panel > .wd-nav.wd-top::-webkit-scrollbar{display:none}
 #menuov #panel > .wd-nav.wd-top > button{flex:1 0 auto!important}
}</style>`);
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
      const lt='Bait'+(n!=null?' · '+fmtShort(n):''); if(lbl.textContent!==lt) lbl.textContent=lt;
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
// Boardwalk prize counter and counter specials on phones: two cards a row with a shorter picture (one tall card a row
// wasted most of the screen; 2026-11-17 QC)
document.head.insertAdjacentHTML('beforeend',`<style>@media (max-width:560px){
 #menuov #panel .bwx-prizes{grid-template-columns:repeat(2,minmax(0,1fr))!important;gap:8px}
 #menuov #panel .bwx-prize{padding:9px;gap:6px;border-radius:14px}
 #menuov #panel .bwx-prize canvas{height:78px}
 #menuov #panel .bwx-pt b{font-size:13.5px;line-height:1.2}
 #menuov #panel .bwx-pt .meta{font-size:11.5px;line-height:1.3}
 #menuov #panel .bwx-pf{flex-wrap:wrap;justify-content:stretch;gap:5px}
 #menuov #panel .bwx-pf .btn{flex:1 1 auto;min-width:0;padding-left:6px;padding-right:6px}
}</style>`);
// Aquarium on sideways phones and tablets: the tank comes straight under the earnings bar, so the whole tank is on screen
// (with the side panel collapsed it fills the width); the boosts and the description follow it (director, 2026-11-17)
document.head.insertAdjacentHTML('beforeend',`<style>@media (orientation:landscape) and (max-height:560px){
 body #menuov #panel:has(> .tank){display:flex!important;flex-direction:column!important}
 #menuov #panel:has(> .tank) > *{order:6;flex:0 0 auto}
 #menuov #panel:has(> .tank) > .crumb{order:0}
 #menuov #panel:has(> .tank) > .dl-head{display:contents}
 #menuov #panel:has(> .tank) > .dl-head > .bank{order:1;margin:0 0 8px}
 #menuov #panel:has(> .tank) > .tank{order:2;margin-top:0}
 #menuov #panel:has(> .tank) > p.sub{order:3;margin:4px 0 0}
 #menuov #panel:has(> .tank) > .badges{order:4;margin-top:8px}
 #menuov #panel:has(> .tank) > .dl-head > :not(.bank){order:5;margin-top:6px}
}</style>`);
// heavy fog is drawn behind the dock, the angler and the pets (it used to be laid over them, washing out your own angler);
// the far shore and the middle distance still fade into it, and a light veil stays over the near water (2026-11-17)
{ let FOG_EARLY=false; const _dwx=drawWeatherX, _vp=v3Platform;
  drawWeatherX=function(t,wx,hz){ if(wx&&wx.k==='Fog'&&!FOG_EARLY) return; return _dwx.apply(this,arguments); };
  v3Platform=function(L,t,night,dockY,pb){ try{ const wx=weather(); if(wx.k==='Fog'){ FOG_EARLY=true; _dwx(t,wx,HZ()); } }catch(e){} finally{ FOG_EARLY=false; } return _vp.apply(this,arguments); }; }
// ---------- touch: no bouncing past the top bars, no long-press menus, no text selection, no zoom (director, 2026-11-17) ----------
// 1. Pulling a list past its top or bottom never drags the page (iPhone Safari rubber-bands the whole page otherwise, sliding
//    pages under the top panels). A drag is let through only to a box that can still scroll that way; sideways drags (tab rows,
//    sliders) are untouched.
{ let lx=0, ly=0; document.addEventListener('touchstart',e=>{ if(e.touches.length===1){ lx=e.touches[0].clientX; ly=e.touches[0].clientY; } },{passive:true});
  document.addEventListener('touchmove',e=>{ if(e.touches.length!==1) return; const tx=e.touches[0].clientX, ty=e.touches[0].clientY, dx=tx-lx, dy=ty-ly; lx=tx; ly=ty;
    if(Math.abs(dx)>Math.abs(dy)) return; if(!dy) return;
    for(let n=e.target; n&&n!==document.documentElement; n=n.parentElement){ if(n.nodeType!==1) continue; const oy=getComputedStyle(n).overflowY;
      if((oy==='auto'||oy==='scroll')&&n.scrollHeight>n.clientHeight+1){ if((dy>0&&n.scrollTop>0)||(dy<0&&n.scrollTop+n.clientHeight<n.scrollHeight-1)) return; break; } }
    if(e.cancelable) e.preventDefault(); },{passive:false}); }
// 2. No long-press callout (copy / share / look up), no text selection and no image dragging anywhere in the game, except in
//    text fields (pet names, save codes); no pinch or double-tap zoom.
document.head.insertAdjacentHTML('beforeend',`<style>
html,body{overscroll-behavior:none;touch-action:manipulation}
body,body *{-webkit-touch-callout:none;-webkit-user-select:none;user-select:none;-webkit-user-drag:none}
body input,body textarea,body select,body [contenteditable="true"]{-webkit-touch-callout:default;-webkit-user-select:text;user-select:text}
img,canvas,svg{-webkit-user-drag:none}
</style>`);
document.addEventListener('contextmenu',e=>{ if(!e.target.closest('input,textarea,[contenteditable="true"]')) e.preventDefault(); });
document.addEventListener('selectstart',e=>{ if(!e.target.closest||!e.target.closest('input,textarea,[contenteditable="true"]')) e.preventDefault(); });
for(const ev of ['gesturestart','gesturechange']) document.addEventListener(ev,e=>e.preventDefault(),{passive:false});
document.addEventListener('dblclick',e=>{ if(!e.target.closest('input,textarea')) e.preventDefault(); },{passive:false});
