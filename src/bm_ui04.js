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
{ let lastD=0; const _dr=draw; draw=function(now){ if(MENU_OPEN&&now-lastD<250&&!resize.force) return; lastD=now; return _dr(now); }; }
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
      const rw=Math.round(b.reward*coinMult()*1);
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
/* once the tabs are pinned (the page has scrolled under them), a solid band fills the gap above and beside them so nothing shows around them */
#menuov #panel .bwx-nav.stuck{box-shadow:0 0 0 10px #0d1830,0 -24px 0 10px #0d1830,0 18px 14px -6px #02060fcc!important}
#menuov #panel .bwx-nav.stuck:not(.wd-top)::before{content:"";position:absolute;left:-10px;right:-10px;top:-24px;bottom:-10px;background:#0d1830;z-index:-1;pointer-events:auto} /* same band as a real layer, so a tap on it never reaches a hidden card underneath */
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
  addEventListener('resize',soon); const _rp=renderPanel; renderPanel=function(){ const r=_rp.apply(this,arguments); sync(); return r; }; }
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
{ const NAV='#menuov [data-sec],#menuov [data-sub],#menuov .sect-nav button,#menuov .mo-back,#menuov .mo-home';
  // Every finger is tracked on its own (fast taps with two thumbs overlap). While touch is in use, menu buttons are driven only by
  // finger lifts: the phone's own clicks on them are ignored, so a late click can never undo a newer tap. The one exception is a
  // touch that didn't act (the phone cancelled it, or the finger slid): its click is honoured, since nothing else acted for it.
  const downs=new Map(); let lastTouch=-1e9, spare=[], synth=false;
  document.addEventListener('pointerdown',e=>{ if(e.pointerType==='mouse') return; lastTouch=performance.now(); const el=e.target.closest&&e.target.closest(NAV); if(el&&!el.disabled) downs.set(e.pointerId,{el,x:e.clientX,y:e.clientY}); else downs.delete(e.pointerId); },true);
  const unacted=el=>{ const now=performance.now(); spare=spare.filter(s=>now-s.t<900); spare.push({el,t:now}); };
  document.addEventListener('pointercancel',e=>{ const d=downs.get(e.pointerId); downs.delete(e.pointerId); if(d) unacted(d.el); },true);
  document.addEventListener('pointerup',e=>{ if(e.pointerType==='mouse') return; lastTouch=performance.now(); const d=downs.get(e.pointerId); // a mouse never counts as touch (it used to, and swallowed every menu click on PC) downs.delete(e.pointerId); if(!d) return; if(Math.hypot(e.clientX-d.x,e.clientY-d.y)>18||!d.el.isConnected){ unacted(d.el); return; }
    // Back / Overview close the menu: what lay under the finger (a bait picker, a button on the water) must not get the phone's follow-up tap
    if(d.el.matches('.mo-back,.mo-home')){ const sh=document.createElement('div'); sh.style.cssText='position:fixed;inset:0;z-index:2147483647;background:transparent;touch-action:none'; const eat=ev=>{ ev.preventDefault(); ev.stopPropagation(); };
      ['pointerdown','pointerup','mousedown','mouseup','click','touchstart','touchend','contextmenu'].forEach(k=>sh.addEventListener(k,eat,{passive:false})); document.body.appendChild(sh); setTimeout(()=>sh.remove(),450); }
    synth=true; try{ d.el.click(); }finally{ synth=false; } },true);
  document.addEventListener('click',e=>{ if(synth) return; const now=performance.now(); if(now-lastTouch>1000) return; // mouse and keyboard keep normal clicks
    const el=e.target.closest&&e.target.closest(NAV); if(!el) return;
    spare=spare.filter(s=>now-s.t<900); const i=spare.findIndex(s=>s.el===el); if(i>=0){ spare.splice(i,1); return; } // a touch that didn't act: let its click through
    e.stopImmediatePropagation(); e.preventDefault(); },true);
  document.head.insertAdjacentHTML('beforeend',`<style>
/* bigger side buttons on short landscape screens, and no dead gap between them: each button's tap area reaches halfway into the gap */
@media (orientation:landscape) and (max-height:560px){
  body #menuov #tabs.secmode .secb,#menuov .mo-back,#menuov .mo-home{min-height:40px!important}
  body #menuov #tabs.secmode .secb::after{content:"";position:absolute;left:0;right:0;top:-3px;bottom:-3px}
}
</style>`); }
// iPhone: holding a finger on the water (hold to reel) brought up iOS's magnifier loupe over the game. Touches on the game's
// own drawing surfaces belong to the game: their default action is cancelled at touchstart, so iOS never starts its press-and-hold
// tools there. The game reads these surfaces through pointer events, which still arrive.
document.addEventListener('touchstart',e=>{ const t=e.target; if(t&&t.tagName==='CANVAS'&&(t.id==='cv'||t.id==='tankcv'||t.id==='homecv')&&e.cancelable) e.preventDefault(); },{passive:false});
document.head.insertAdjacentHTML('beforeend',`<style>#cv,#tankcv,#homecv{-webkit-user-select:none;user-select:none;-webkit-touch-callout:none;-webkit-tap-highlight-color:transparent}</style>`);
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
// =====================================================================
// PC header (director, 2026-11-17): on PC the fishing screen uses the same top row as the menu, in the same place, so opening
// and closing the menu only changes what is below it. Row 1: Driftline | the five categories | coins, search, settings.
// Row 2: level, where you fish, the goal, cooler, aquarium, Fish Log (the menu shows its page tabs on this row). The category
// bar under the water is gone on PC and the water reaches down to the bottom. Phones and tablets are unchanged.
// =====================================================================
{ const wrap=document.querySelector('.wrap'), hud=document.querySelector('.hud'), stage=$('stage');
  const PCH=document.createElement('div'); PCH.id='pchead';
  PCH.innerHTML=`<div class="pch-brand" aria-hidden="true"><svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12c3-4 7-5 10-5 3 0 5 2 7 5-2 3-4 5-7 5-3 0-7-1-10-5z"/><path d="M3 12l-1.5-3M3 12l-1.5 3"/><circle cx="16" cy="11" r=".9" fill="currentColor"/></svg><span>Driftline</span></div><div class="pch-cats"></div><div class="pch-tools"><span class="pch-coin" title="Coins"><span class="coin" id="pchcoin">0</span></span><button type="button" class="pch-tb" data-pch="search" aria-label="Search the menus" title="Search the menus">🔍</button><button type="button" class="pch-tb" data-pch="settings" aria-label="Settings" title="Settings">⚙</button></div>`;
  if(wrap&&hud) wrap.insertBefore(PCH,hud);
  const cats=PCH.querySelector('.pch-cats'), coin=PCH.querySelector('#pchcoin');
  PCH.querySelector('.pch-tools').addEventListener('click',e=>{ const b=e.target.closest('[data-pch]'); if(!b) return; e.stopPropagation(); try{ startAudio(); }catch(er){} const t=$(b.dataset.pch==='search'?'searchbtn':'settingsbtn'); if(t) t.click(); });
  const label=(full)=>CD.querySelectorAll('.cdb[data-cd]').forEach(b=>{ const sec=MENU_SECS.find(s=>s.id===b.dataset.cd), l=b.querySelector('.cdl'); if(sec&&l){ const t=full?sec.name:(sec.short||sec.name); if(l.textContent!==t) l.textContent=t; } });
  const on=()=>{ const b=document.body.classList; return b.contains('plat-pc')&&b.contains('pc-app')&&!b.contains('phone-app')&&!b.contains('phone-land')&&innerWidth>=800; };
  let was=null; const apply=()=>{ const v=on(); if(v===was) return; was=v; document.body.classList.toggle('pch-on',v);
    if(v){ if(CD.parentElement!==cats) cats.appendChild(CD); label(true); } else { if(CD.parentElement===cats&&stage) stage.after(CD); label(false); }
    try{ requestAnimationFrame(()=>resize()); }catch(e){} };
  const tick=()=>{ if(!was) return; try{ const v=fmtShort(S.money); if(coin.textContent!==v){ coin.textContent=v; PCH.querySelector('.pch-coin').title=fmt(S.money)+' coins'; } }catch(e){} };
  addEventListener('resize',()=>setTimeout(apply,30)); document.addEventListener('fullscreenchange',()=>setTimeout(apply,140));
  new MutationObserver(()=>apply()).observe(document.body,{attributes:true,attributeFilter:['class']});
  apply(); setTimeout(apply,80); setInterval(tick,400); tick(); }
document.head.insertAdjacentHTML('beforeend',`<style>
#pchead{display:none}
html body.pch-on.dl-fish .wrap{padding-left:4px!important;padding-right:4px!important;box-sizing:border-box}
html body.pch-on.dl-fish #pchead{display:grid;grid-template-columns:190px minmax(0,1fr) auto;column-gap:14px;align-items:stretch;height:46px;margin:2px 0 0;flex:0 0 auto}
body.pch-on #menuov .mo-back{width:190px;justify-content:flex-start;box-sizing:border-box}
#pchead .pch-brand{display:flex;align-items:center;gap:10px;padding:0 14px;border-radius:14px;border:1px solid #7fe3c433;background:linear-gradient(180deg,#132c3c,#0e2131);color:#dff7ef;font:800 16px var(--display,system-ui);letter-spacing:.01em;box-shadow:inset 0 1px 0 #ffffff12;user-select:none}
#pchead .pch-brand svg{color:#7fe3c4;flex:0 0 auto}
#pchead .pch-cats{margin-left:14px;min-width:0}
html body.pch-on #pchead #catdock{position:static!important;inset:auto!important;transform:none!important;display:grid!important;grid-template-columns:repeat(5,minmax(0,1fr));gap:4px;height:46px;width:100%;padding:0!important;margin:0!important;background:none!important;border:0!important;border-radius:0!important;box-shadow:none!important;-webkit-backdrop-filter:none!important;backdrop-filter:none!important;z-index:auto}
html body.pch-on #pchead #catdock > #menubtn,html body.pch-on #pchead #catdock > .cdmini{display:none!important}
html body.pch-on #pchead #catdock .cdb{position:relative!important;display:flex!important;flex-direction:row!important;align-items:center!important;justify-content:center!important;gap:8px!important;height:46px!important;min-width:0!important;padding:4px 10px!important;border-radius:16px!important;border:1px solid #26385180!important;background:linear-gradient(180deg,#16243a,#111c2e)!important;box-shadow:inset 0 1px 0 #ffffff12,inset 0 0 0 1px #ffffff06,0 4px 14px #02060f55!important;color:#a9bdd4!important;font:800 14px var(--display,system-ui)!important;transform:none!important;transition:border-color .15s,color .15s,background .15s!important}
html body.pch-on #pchead #catdock .cdb svg{width:22px;height:22px;color:#7f97b2;flex:0 0 auto}
html body.pch-on #pchead #catdock .cdb .cdl{white-space:nowrap;overflow:hidden;text-overflow:ellipsis;font-size:14px}
html body.pch-on #pchead #catdock .cdb:hover{color:#eef3f8!important;border-color:#5a7ea866!important}
html body.pch-on #pchead #catdock .cdb:hover svg{color:#7fe3c4}
html body.pch-on #pchead #catdock .cdb:active{transform:scale(.985)!important}
html body.pch-on #pchead #catdock .cddot{position:absolute!important;top:-7px!important;right:8px!important;left:auto!important;min-width:20px;height:20px;padding:0 6px;box-sizing:border-box;border-radius:999px;background:linear-gradient(180deg,#ffb36a,#ff7a4a)!important;color:#2a1206!important;font:800 12px/20px var(--display,system-ui)!important;text-align:center;box-shadow:0 0 10px #ff8a5c88,0 2px 6px #0008!important}
html body.pch-on #pchead #catdock .cdb.live::before{top:6px!important;left:8px!important}
#pchead .pch-tools{display:flex;align-items:center;gap:8px}
#pchead .pch-coin{display:inline-flex;align-items:center;min-height:40px;padding:0 12px;box-sizing:border-box;border-radius:12px;background:#0d1a2c;border:1px solid #26385180;font:800 15px var(--display,system-ui);white-space:nowrap;color:#eef3f8}
#pchead .pch-tb{width:42px;height:42px;border-radius:12px;border:1px solid #26385180;background:#111c2e;color:#dbe7f3;font-size:18px;cursor:pointer;transition:border-color .15s,color .15s;display:flex;align-items:center;justify-content:center;padding:0}
#pchead .pch-tb:hover{border-color:#5a7ea8aa;color:#fff}
#pchead .pch-tb:focus-visible,html body.pch-on #pchead #catdock .cdb:focus-visible{outline:2px solid var(--gold,#ffd36a);outline-offset:2px}
/* row 2: the info chips, the height and place of the menu's page tabs */
html body.pch-on.dl-fish .hud{display:flex!important;flex-wrap:nowrap!important;grid-template-columns:none!important;grid-template-areas:none!important;gap:8px!important;height:50px;margin:-2px 0 0!important;padding:0!important;flex:0 0 auto}
html body.pch-on.dl-fish .hud > *{height:50px!important;grid-area:auto!important}
html body.pch-on.dl-fish .hud > .st-coins,html body.pch-on.dl-fish .hud > .hudbtns,html body.pch-on.dl-fish .hud > .brand,html body.pch-on.dl-fish .hud > .st-buff,html body.pch-on.dl-fish .hud > .st-bait{display:none!important}
html body.pch-on.dl-fish .hud > .st-lvl{flex:0 0 190px!important;max-width:none!important;box-sizing:border-box}
html body.pch-on.dl-fish .hud > .stat.loc{flex:0 0 auto!important;max-width:none!important}
html body.pch-on.dl-fish .hud > #goalchip{flex:1 1 0!important;min-width:140px!important;max-width:none!important}
html body.pch-on.dl-fish .hud > .st-cool,html body.pch-on.dl-fish .hud > .st-aq,html body.pch-on.dl-fish .hud > .st-log{flex:0 0 auto!important;max-width:none!important;min-width:96px}
html body.pch-on.dl-fish .hud > .stat b{white-space:nowrap}
html body.pch-on.dl-fish #stage{margin-left:0!important;margin-right:0!important}
html body.pch-on.dl-fish .wrap > #catdock{display:none!important}
/* up to 1100 px the menu puts its categories on their own row under Back; the header does the same so both still line up */
@media (max-width:1100px){ html body.pch-on.dl-fish #pchead{grid-template-rows:46px 46px;row-gap:6px;height:auto} #pchead .pch-brand{grid-row:1;grid-column:1} #pchead .pch-tools{grid-row:1;grid-column:3} #pchead .pch-cats{grid-row:2;grid-column:1 / -1;margin-left:0} html body.pch-on.dl-fish .hud > .st-cool,html body.pch-on.dl-fish .hud > .st-aq,html body.pch-on.dl-fish .hud > .st-log{min-width:0} }
</style>`);
// PC: switching between the fishing screen and the menu keeps the top row perfectly still (it is the same row in both) and only
// fades what changes under it: the info chips or page tabs, and the water or the page. The menu sits on the same background.
document.head.insertAdjacentHTML('beforeend',`<style>
body.pch-on #menuov{background:radial-gradient(1400px 700px at 50% -15%,#1b2c4a 0%,#0e1830 45%,#0a1220 75%) #0a1220!important}
body.pch-on #menuov.mo-show{animation:none!important}
body.pch-on #menuov.mo-show #tabs .subbar{animation:pchIn .2s ease-out both} /* the page itself already fades in on PC (pagein) */
body.pch-on .wrap.wrapin{animation:none!important}
body.pch-on .wrap.wrapin > .hud,body.pch-on .wrap.wrapin > #stage{animation:pchIn .2s ease-out both}
@keyframes pchIn{from{opacity:0;transform:translateY(4px)}to{opacity:1;transform:none}}
@media (prefers-reduced-motion:reduce){body.pch-on #menuov.mo-show #tabs .subbar,body.pch-on #menuov.mo-show #panel,body.pch-on .wrap.wrapin > .hud,body.pch-on .wrap.wrapin > #stage{animation:none!important}}
</style>`);
// PC: the Dock preview was always drawn as a 900x360 picture and stretched across the wide full-screen card, so it looked soft.
// It now draws at the card's real size on screen (screen scaling included), with the same layout: the drawing still works in
// 900x360 units and is scaled up, so nothing moves. Dragging decorations keeps working (it reads the canvas size).
{ const _ph3=paintHome3;
  paintHome3=function(c){ if(!c||c.id!=='homecv') return _ph3(c); if(!document.body.classList.contains('pch-on')){ if(c.dataset.lw&&c.width!==+c.dataset.lw){ c.width=+c.dataset.lw; c.height=+c.dataset.lh; } return _ph3(c); }
    const lw=+c.dataset.lw||c.width, lh=+c.dataset.lh||c.height; c.dataset.lw=lw; c.dataset.lh=lh;
    const r=c.getBoundingClientRect(); if(!r.width) return _ph3(c);
    const k=Math.max(1,Math.min(3,r.width*Math.min(2,window.devicePixelRatio||1)/lw)), cw=Math.round(lw*k), ch=Math.round(lh*k);
    if(c.width!==cw||c.height!==ch){ c.width=cw; c.height=ch; }
    const x=c.getContext('2d'); const view={width:lw,height:lh,getContext:()=>{ x.setTransform(k,0,0,k,0,0); return x; }};
    try{ return _ph3(view); } finally{ x.setTransform(1,0,0,1,0,0); } }; }
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
    if(t-shown>500&&ts.length>10){ shown=t; const win=ts.slice(-120), avg=win.reduce((a,b)=>a+b,0)/win.length, worst=Math.max(...win); el.textContent=Math.round(1000/avg)+' fps · slowest '+worst.toFixed(1)+' ms'; }
    requestAnimationFrame(loop); };
  const sync=()=>{ const v=!!(S.settings&&S.settings.showFps); if(v===on) return; on=v; el.hidden=!v; ts=[]; lastT=0; if(v) requestAnimationFrame(loop); };
  setInterval(sync,700); sync(); }
document.head.insertAdjacentHTML('beforeend',`<style>#fpsbox{position:absolute;right:10px;bottom:10px;z-index:5;padding:3px 8px;border-radius:8px;background:#06101ccc;border:1px solid #ffffff22;color:#9fe8c9;font:700 11px/1.3 ui-monospace,Consolas,monospace;pointer-events:none}#fpsbox[hidden]{display:none}</style>`);
// A water thumbnail is drawn on the game canvas; afterwards the game's own scenery picture is put back, so the next frame does not
// have to redraw the whole landscape (that cost a long frame per thumbnail, twice).
{ const _vt=v3Thumb; v3Thumb=function(id){ if(V3THUMB[id]) return V3THUMB[id]; const c=V3CACHE, p=V3PREV; try{ return _vt(id); } finally{ V3CACHE=c; V3PREV=p; v3palette.k=null; } }; }
// PC: a menu page that is a little taller than the screen scales itself down to fit it at once (director, 2026-11-17), down to
// 76% at most; a page that still does not fit scrolls the small rest. Pages that already fit stay at full size. Checked after every
// page or section change and window resize.
{ let q=0; const P=()=>$('panel');
  // one measurement at the current zoom gives the exact zoom that fits (the page's height scales with it), so the page is laid
  // out once or twice instead of up to four times (each pass cost ~17 ms on the biggest pages: that was menu lag in full screen).
  // Every page remembers its zoom (per section and window size) and starts from it, so reopening it usually needs no change at all.
  const ceil=new Map(), cache=new Map(), key=()=>{ const p=P(), on=p&&p.querySelector('.bwx-nav [aria-pressed="true"],.bwx-nav [aria-selected="true"],.bwx-nav .on,.fr-cat[aria-pressed="true"]'); return S.tab+'|'+((typeof SECT==='object'&&SECT[S.tab])||'')+'|'+(on?on.textContent.trim().slice(0,24):'')+'|'+innerWidth+'x'+innerHeight; }; /* per page, per section tab (sections that redraw the page too), per window size */
  const fit=()=>{ q=0; const p=P(); if(!p) return; const on=document.body.classList.contains('pch-on')&&MENU_OPEN;
    if(!on||document.body.classList.contains('pc-fhd')){ if(p.style.zoom) p.style.zoom=''; return; } /* full HD: one fixed size on every page (director, 2026-11-17: headers and sizes must never change between tabs; a zoom per page also moved buttons under the cursor right after a click) */
    if(p.classList.contains('fl-on')||p.classList.contains('aq-on')||p.classList.contains('od-on')||[...p.querySelectorAll('.pc-pn')].some(e=>e.offsetParent!==null)){ if(p.style.zoom) p.style.zoom=''; return; } // the Fish Log and the patch-notes reader size themselves to the screen
    const z0=+p.style.zoom||1, ch=p.clientHeight, sh=p.scrollHeight; if(!ch||!sh) return;
    // full HD (body.pc-fhd): a page with room to spare grows until it fills the screen (up to 125%), so it reads well from the chair;
    // its real content height is measured from its first box to its last (the page's own height never drops below the screen's)
    const big=document.body.classList.contains('pc-fhd'), MAXZ=big?1.25:1; let z;
    if(big){ const R=p.getBoundingClientRect(), cs=getComputedStyle(p); let top=Infinity, bot=-Infinity; for(const c of p.children){ if(c.offsetParent===null&&getComputedStyle(c).position!=='fixed') continue; const r=c.getBoundingClientRect(); if(!r.height) continue; top=Math.min(top,r.top); bot=Math.max(bot,r.bottom); }
      if(bot>top){ const pad=(parseFloat(cs.paddingTop)+parseFloat(cs.paddingBottom))*z0, need=bot-top+pad, avail=R.height; z=z0*avail/need-.004; } else z=1;
      if(sh>ch+2) ceil.set(key(),Math.min(ceil.get(key())||9,z0-.004)); /* this zoom overflowed: never grow back to it */
      z=Math.max(.76,Math.min(MAXZ,ceil.get(key())||9,z)); }
    else z=sh<=ch+2?Math.min(1,z0*ch/sh):Math.max(.76,z0*ch/sh-.003);
    if(Math.abs(z-1)<.004) z=1;
    if(Math.abs(z-z0)>.004){ p.style.zoom=z===1?'':String(+z.toFixed(3)); if(passes++<4) soon(); } cache.set(key(),z); };
  let passes=0; const pre=()=>{ passes=0; const p=P(); if(!p||!document.body.classList.contains('pch-on')) return; const z=cache.get(key()); if(z!==undefined) p.style.zoom=z===1?'':String(+z.toFixed(3)); };
  const soon=()=>{ if(!q) q=requestAnimationFrame(fit); };
  const _rp=renderPanel; renderPanel=function(){ try{ pre(); }catch(e){} const r=_rp.apply(this,arguments); soon(); return r; };
  document.addEventListener('click',e=>{ if(e.target.closest&&e.target.closest('#panel .sect-nav,#panel .bwx-nav,#panel details summary')) setTimeout(()=>{ passes=0; soon(); },30); },true);
  addEventListener('resize',()=>setTimeout(soon,60)); document.addEventListener('fullscreenchange',()=>setTimeout(soon,200));
  window.__pcfitSoon=()=>{ passes=0; soon(); }; // a page that changes its own content (a category picked) asks for a fresh fit
  if(/[?&]test\b/.test(location.search)) window.__pcfit=fit; }
document.head.insertAdjacentHTML('beforeend',`<style>
/* PC: the big Dock and aquarium previews no longer take the whole width and most of the screen height, so their pages fit at once */
body.pch-on #menuov #panel #homecv{width:min(100%,calc(min(46vh,600px)*2.5))!important;height:auto!important;aspect-ratio:900/360;display:block;margin:0 auto}
body.pch-on #menuov #panel .tile:has(> #homecv){background:linear-gradient(180deg,#0f2034,#0a1626)}
body.pch-on #menuov #panel #tankcv{height:min(34vh,420px)!important}
</style>`);
// =====================================================================
// PC: continuous day, night and weather (director, 2026-11-17: the light changes must be as smooth as the frame rate). The light
// follows the clock, so the scenery for 3 s from now can be drawn ahead of time, between frames; every frame blends from the
// current picture to that one by exactly how far the clock has moved. No steps, no pops, at any frame rate. If something else is
// changing the light right now (it does not match the clock), the stepped fade is used for that moment instead. Phones unchanged.
// =====================================================================
{ const POOL=[document.createElement('canvas'),document.createElement('canvas'),document.createElement('canvas')], D=3000;
  let A=null, B=null, base='', bq=0, fallbackUntil=0; const _ld=v3landDraw;
  const pcOn=()=>document.body.classList.contains('pch-on');
  const lightAt=ms=>{ const real=Date.now, off=ms-real(); Date.now=()=>real()+off;
    try{ const L=curLoc(), p=phase(), wx=weather(), night=nightness(p);
      const dusk=Math.max(0,1-Math.abs(p-.5)/.06)+Math.max(0,1-Math.min(Math.abs(p-1),p)/.06)*.7, wa=wxAmt();
      const gloom=(wx.k==='Storm'?.7:wx.k==='Rain'?.38:wx.k==='Fog'?.3:0)*wa+(L.id==='deep'?.1:0); return {night,dusk,gloom}; }
    finally{ Date.now=real; } };
  const buildAt=(L,ms,hz)=>{ const lt=lightAt(ms), keep=[V3CACHE,V3PREV,v3palette.k,v3palette.v];
    const tgt=POOL.find(c=>(!A||c!==A.c)&&(!B||c!==B.c));
    try{ const P=v3palette(L.id,lt.night,lt.dusk,lt.gloom); V3CACHE={c:tgt,base:'#pch',key:'#pch'}; V3PREV=null; v3land.now=true; const C=v3land(L,P,hz); return {c:C.c,ms}; }
    finally{ v3land.now=false; V3CACHE=keep[0]; V3PREV=keep[1]; v3palette.k=keep[2]; v3palette.v=keep[3]; } };
  v3landDraw=function(L,P,hz){ const now=Date.now(); if(!pcOn()||now<fallbackUntil){ A=B=null; base=''; return _ld.apply(this,arguments); }
    const b=L.id+'|'+W+'|'+H+'|'+DPR;
    if(b!==base||!A||now<A.ms-50||now>(B?B.ms:A.ms)+D*2){
      // does the clock explain the light on screen? (events and tests can set it by hand)
      const lt=lightAt(now), d=clamp(lt.dusk,0,1)*(1-lt.night*.45);
      if(Math.abs(lt.night-(P.night||0))>.03||Math.abs(d-(P.d||0))>.03||Math.abs(lt.gloom-(P.gloom||0))>.03){ fallbackUntil=now+4000; A=B=null; base=''; return _ld.apply(this,arguments); }
      base=b; clearTimeout(bq); bq=0; B=null; A=buildAt(L,now,hz); V3CACHE={key:'#pchA',base:b,c:A.c}; V3PREV=null; }
    if(B&&now>=B.ms){ A=B; B=null; V3CACHE={key:'#pchA',base:b,c:A.c}; }
    if(!B&&!bq){ const ms=A.ms+D; bq=setTimeout(()=>{ bq=0; try{ const L2=curLoc(); if(base!==L2.id+'|'+W+'|'+H+'|'+DPR||!A) return; B=buildAt(L2,ms,HZ()); }catch(e){} },0); }
    g.drawImage(A.c,0,0,W,H);
    if(B){ const a=clamp((now-A.ms)/(B.ms-A.ms),0,1); if(a>0){ g.globalAlpha=a; g.drawImage(B.c,0,0,W,H); g.globalAlpha=1; } } };
  if(/[?&]test\b/.test(location.search)) window.__pclight=()=>({on:pcOn()&&Date.now()>=fallbackUntil, A:A&&A.ms, B:B&&B.ms, fallback:Date.now()<fallbackUntil}); }
document.head.insertAdjacentHTML('beforeend',`<style>
/* PC: the count badges on the category tabs sit on the tab's top edge, fully inside the screen (they were cut off by 4 px);
   the menu's category badges move the same way so both header rows still match */
html body.pch-on #pchead #catdock .cddot{top:-3px!important}
body.pch-on #menuov #tabs.secmode .secdot{top:-3px!important}
/* phones upright: the goal keeps to one line, so the top bar never changes height (the water was not re-measured when it did) */
body.phone-app.dl-fish .hud > #goalchip .gl-t{white-space:nowrap!important;overflow:hidden!important;text-overflow:ellipsis!important;display:block;min-width:0}
</style>`);
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
// PC: patch notes made for a big screen (director, 2026-11-17: hard to read). A wide card on a dimmed game, each update split into
// titled section cards laid out side by side; lists without headings are grouped by what they are about (PC, Phones, iPhone,
// Menus, Everywhere) and the prefix is dropped. Phones keep the narrow card.
{ const _ph=patchHTML;
  const groups=p=>{ const out=[]; let cur=null; const hasH=p.items.some(i=>i.startsWith('## '));
    if(hasH){ for(const i of p.items){ if(i.startsWith('## ')){ cur={t:i.slice(3),items:[]}; out.push(cur); } else { if(!cur){ cur={t:'What changed',items:[]}; out.push(cur); } cur.items.push(i); } } return out; }
    const PRE=[['PC','PC'],['Phones','Phones'],['iPhone','iPhone'],['Menus on phones held sideways','Phones'],['Menus','Menus']], by={};
    for(const i of p.items){ const m=i.match(/^([A-Za-z ]+?):\s+(.*)$/); let g='Everywhere', txt=i; if(m){ const hit=PRE.find(([k])=>k===m[1]); if(hit){ g=hit[1]; txt=m[2].charAt(0).toUpperCase()+m[2].slice(1); } } (by[g]=by[g]||[]).push(txt); }
    return ['Everywhere','Menus','PC','Phones','iPhone'].filter(g=>by[g]).map(g=>({t:g,items:by[g]})); };
  // changes for every platform first, platform-only changes at the end (director, 2026-11-17)
  const PLAT=['PC','Phones','iPhone','Android','Tablets'], organized=p=>{ const gs=groups(p); return gs.filter(g=>!PLAT.includes(g.t)).concat(PLAT.flatMap(t=>gs.filter(g=>g.t===t))); };
  patchHTML=function(p){ if(!document.body.classList.contains('pch-on')){ const gs=organized(p); if(gs.length<2&&!p.items.some(i=>i.startsWith('## '))) return _ph(p); return _ph(Object.assign({},p,{items:gs.flatMap(g=>['## '+g.t].concat(g.items))})); }
    const gs=organized(p); return `<div class="pn-head"><div class="rar" style="color:var(--gold)">${p.label?esc(p.label):'Update '+esc(p.v)}</div><h3>${esc(p.name)}</h3></div><div class="pn-grid">${gs.map(g=>`<section class="pn-sec"><h4>${esc(g.t)}</h4><ul>${g.items.map(i=>`<li>${esc(i)}</li>`).join('')}</ul></section>`).join('')}</div>`; }; }
document.head.insertAdjacentHTML('beforeend',`<style>
body.pch-on #evcard{background:rgba(4,9,18,.66)!important}
body.pch-on #evin:has(.pn-grid){width:min(1080px,92vw)!important;max-width:none!important;max-height:86vh!important;padding:22px 26px!important;text-align:left}
body.pch-on #evin:has(.pn-grid) > .rar,body.pch-on #evin:has(.pn-grid) > h3,body.pch-on #evin:has(.pn-grid) > p.sub{text-align:center}
body.pch-on #evin .pn-head{text-align:center;margin:6px 0 10px}
body.pch-on #evin .pn-head h3{font-size:24px;margin:2px 0 0}
body.pch-on #evin .pn-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:12px;align-items:start}
body.pch-on #evin .pn-sec{background:#0e1a2c;border:1px solid #ffffff14;border-radius:14px;padding:12px 14px 10px}
body.pch-on #evin .pn-sec h4{margin:0 0 6px;font:800 12.5px var(--display,system-ui);letter-spacing:.07em;text-transform:uppercase;color:var(--gold,#ffd36a)}
body.pch-on #evin .pn-sec ul{margin:0;padding-left:18px;max-height:none!important;overflow:visible!important}
body.pch-on #evin .pn-sec li{font-size:14.5px;line-height:1.5;color:#dbe6f2;margin:0 0 6px}
body.pch-on #evin .pn-sec li:last-child{margin-bottom:0}
</style>`);
document.head.insertAdjacentHTML('beforeend',`<style>
body.pch-on #panel .featboard{display:grid;gap:10px;align-items:start;margin-top:4px}
body.pch-on #panel .fb-col{display:flex;flex-direction:column;gap:9px;min-width:0}


body.pch-on #panel .fb-cat{margin:0;background:linear-gradient(180deg,#132238,#0f1b2d);border:1px solid #ffffff14;border-radius:14px;padding:8px 10px 4px;box-shadow:inset 0 1px 0 #ffffff0d}
body.pch-on #panel .fb-cat header{display:flex;justify-content:space-between;align-items:baseline;margin:0 2px 6px;font:800 12.5px var(--display,system-ui);letter-spacing:.07em;text-transform:uppercase;color:var(--gold,#ffd36a)}
body.pch-on #panel .fb-cat header .fb-n{letter-spacing:0;color:#8fa6bf;font-weight:700}
body.pch-on #panel .fb-cat ul{list-style:none;margin:0;padding:0}
body.pch-on #panel .fb-row{display:grid;grid-template-columns:minmax(0,1fr) auto;column-gap:8px;row-gap:2px;padding:3px 4px 4px;border-top:1px solid #ffffff0a}
body.pch-on #panel .fb-row:first-child{border-top:0}
body.pch-on #panel .fb-name{font:700 13px var(--display,system-ui);color:#eef3f8;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
body.pch-on #panel .fb-cnt{font:700 12px var(--display,system-ui);color:#9fb2c8;white-space:nowrap}
body.pch-on #panel .fb-bar{display:block;height:3px;border-radius:4px;background:#ffffff14;overflow:hidden;align-self:center}
body.pch-on #panel .fb-bar b{display:block;height:100%;border-radius:4px;background:linear-gradient(90deg,#7fe3c4,#ffd36a)}
body.pch-on #panel .fb-rew{font-size:11.5px;color:#c9d7e8;white-space:nowrap;text-align:right}
body.pch-on #panel .fb-row.done{opacity:.55}
body.pch-on #panel .fb-row.done .fb-name{color:#7fe3c4}
body.pch-on #panel .fb-row.done .fb-bar b{background:#7fe3c4}
</style>`);
document.head.insertAdjacentHTML('beforeend',`<style>
/* PC: Next goal is as wide as its text needs (at most 460 px); cooler, aquarium and Fish Log sit together at the right */
html body.pch-on.dl-fish .hud > #goalchip{flex:0 1 auto!important;width:auto!important;max-width:460px!important;min-width:200px!important}
html body.pch-on.dl-fish .hud > .st-cool{margin-left:auto!important}
</style>`);
// =====================================================================
// PC: the Fish Log as one organized screen (director, 2026-11-17: "hunt on pc doesn't look good, we need a better fish log setup
// for pc"). Three columns: WATERS (every water with its progress, the Show filter under it) | the water's fish grouped by rarity |
// HUNTS + the picked fish's records. The hunt button on each card becomes a small target in its corner, so the grid stays calm.
// Built from the page the other platforms use (same buttons, same actions), so phones and tablets are unchanged.
// =====================================================================
{ const _rj=renderJournal;
  const fitH=()=>{}; // the columns take the page's height through CSS (flex), so nothing is measured
  renderJournal=function(P){ _rj(P); if(!document.body.classList.contains('pch-on')||innerWidth<1100) return; /* the three columns need room */ try{
    P.style.zoom=''; const kids=[...P.children]; const pick=f=>kids.find(f);
    const crumb=pick(c=>c.classList.contains('crumb')), head=pick(c=>c.classList.contains('dl-head')),
      water=pick(c=>c.classList.contains('chips')&&c.querySelector('[data-act="encloc"]')), show=pick(c=>c.classList.contains('logshow')), sec=pick(c=>c.classList.contains('jsec'));
    if(!water) return;
    const top=document.createElement('div'); top.className='fl-top';
    const sum=head&&head.querySelector('p.sub'); const ts=totalStars(), rk=anglerRank();
    top.innerHTML=`<div class="fl-rank" title="Catch a species 3, 10, 30 and 100 times for its stars. Each star adds +10% to that fish’s value. Every 8 stars is a new rank, with coins and a free Mystery Crate."><span class="rar">Angler rank ${rk}</span><b>${ts} ★</b><span class="meta">+${rk}% to every sale</span><span class="fl-rbar"><i style="width:${ts%8/8*100}%"></i></span><span class="meta">${ts%8} / 8 to rank ${rk+1}</span></div><div class="fl-sum">${Object.keys(S.journal).length} of ${SP.length} species found · ${fmt(S.stats.caught)} fish landed · ${S.stats.shiny} shiny · ${fmt(S.stats.earned)} coins earned</div>`;
    const wrap=document.createElement('div'); wrap.className='fl-pc';
    // left: waters
    const side=document.createElement('aside'); side.className='fl-side';
    side.insertAdjacentHTML('beforeend','<h5>Waters</h5>'); const wl=document.createElement('div'); wl.className='fl-waters';
    [...water.querySelectorAll('[data-act="encloc"]')].forEach(b=>{ const m=b.textContent.trim().match(/^(.*?)\s+(\d+)\/(\d+)$/); if(m){ const k=b.dataset.k, here=k===S.loc, done=+m[2]>=+m[3];
        const locked=k!=='junk'&&!S.unlocked.includes(k);
        b.className='fl-w'+(done?' done':'')+(locked?' locked':''); b.innerHTML=`<span class="fl-wn">${esc(m[1])}${here?' <em title="You are fishing here">●</em>':''}</span><span class="fl-wc">${locked?'🔒':m[2]+' / '+m[3]}</span><span class="fl-wb"><i style="width:${+m[2]/+m[3]*100}%"></i></span>`; }
      wl.appendChild(b); });
    side.appendChild(wl);
    if(show){ side.insertAdjacentHTML('beforeend','<h5>Show</h5>'); show.classList.add('fl-show'); side.appendChild(show); }
    if(sec){ sec.classList.add('fl-sec'); side.appendChild(sec); }
    // middle: the fish
    const main=document.createElement('section'); main.className='fl-main';
    const grid=P.querySelector('.jgrid'); const L=encLoc!=='junk'?LOCS[locIdx(encLoc)]:null;
    const mh=document.createElement('div'); mh.className='fl-mh';
    if(L){ const got=caughtAt(L.id), n=spAt(L.id).length; mh.innerHTML=`<div><h3>${esc(L.name)}</h3><span class="meta">${got} / ${n} found${S.setDone[L.id]?' · complete':` · find them all for <span class="coin">${fmt(L.bonus)}</span>`}${S.unlocked.includes(L.id)?'':' · water locked'}</span></div><span class="fl-mbar"><i style="width:${got/n*100}%"></i></span><div class="fl-leg">${[...new Set(spAt(L.id).map(x=>x.r))].sort((a,b)=>a-b).map(r=>{ const all=spAt(L.id).filter(x=>x.r===r), g=all.filter(x=>S.journal[x.id]).length; return `<span style="--rc:${RAR[r].c}"><i></i>${RAR[r].k} <b>${g}/${all.length}</b></span>`; }).join('')}</div>`; }
    else mh.innerHTML=`<div><h3>Oddities</h3><span class="meta">Things humanity dropped in the water. Some pay, some boost your fishing, some come with a pet or a hat.</span></div>`;
    main.appendChild(mh);
    const emp=P.querySelector('.empty'); if(emp) main.appendChild(emp);
    if(grid){ main.appendChild(grid);
      if(L){ // rarity headings: the grid is sorted by rarity already
        let last=-1; [...grid.children].forEach(cell=>{ const c=cell.matches('.jcard')?cell:cell.querySelector('.jcard'); const s=c&&SPI[c.dataset.k]; if(!s) return;
          if(s.r!==last){ last=s.r; cell.classList.add('fl-first'); cell.dataset.rk=RAR[s.r].k; }
          cell.style.setProperty('--rc',RAR[s.r].c);
          // the rarity shows as the colour stripe and the legend: the card keeps day/night and the bait hint on one short line
          const sm=[...c.querySelectorAll('small')], first=sm.find(x=>!x.classList.contains('loghint')&&!x.classList.contains('sh')&&x.textContent.indexOf(RAR[s.r].k)===0);
          if(first){ const rest=first.textContent.slice(RAR[s.r].k.length).replace(/^\s*·\s*/,''); const hint=c.querySelector('small.loghint');
            if(hint){ if(rest) hint.insertAdjacentText('afterbegin',(rest==='day'?'☀':rest==='night'?'☾':rest)+' '); first.remove(); } else if(rest) first.textContent=rest; else first.remove(); }
          c.title=(S.journal[s.id]?s.name:'Not caught yet')+' · '+RAR[s.r].k+(s.time!=='any'?' · '+(s.time==='night'?'night only':'day only'):''); }); } }
    // right: hunts + the picked fish
    const right=document.createElement('aside'); right.className='fl-right';
    const bar=P.querySelector('.hunt-bar'); if(bar) right.appendChild(bar);
    const det=P.querySelector('.tile.detail');
    if(det) right.appendChild(det);
    else if(L) right.insertAdjacentHTML('beforeend',`<div class="tile fl-pickhint"><b>Click a fish</b><span class="meta">See its records, size range, when it bites and your chance to catch it here. Fish you are missing can be hunted with the 🎯 in a card’s corner.</span></div>`);
    if(L) wrap.append(side,main,right); else { wrap.classList.add('fl-wide'); wrap.append(side,main); }
    // remove what is left of the old layout and put the new one in
    kids.forEach(c=>{ if(c!==crumb&&c.parentNode===P) c.remove(); });
    const ttl=document.createElement('h2'); ttl.className='dl-dup'; ttl.hidden=true; ttl.textContent='Fish Log'; // the page title the tidy pass looks for (else it would rename the fish card's heading)
    P.append(ttl,top,wrap); P.classList.add('fl-on');
    fitH(P); requestAnimationFrame(()=>fitH(P));
    const selCard=grid&&grid.querySelector('.jcard.sel'); if(selCard){ const r=selCard.getBoundingClientRect(), m=main.getBoundingClientRect(); if(r.bottom>m.bottom||r.top<m.top) selCard.scrollIntoView({block:'nearest'}); }
  }catch(e){ console.error(e); } };
  const _rp=renderPanel; renderPanel=function(){ const P=$('panel'); if(P) P.classList.remove('fl-on'); return _rp.apply(this,arguments); };
  addEventListener('resize',()=>setTimeout(()=>{ const P=$('panel'); if(P&&P.classList.contains('fl-on')) fitH(P); },80)); }
document.head.insertAdjacentHTML('beforeend',`<style>
body.pch-on #panel.fl-on{overflow:hidden!important;display:flex!important;flex-direction:column!important}
body.pch-on #panel.fl-on > *{flex:0 0 auto}
body.pch-on #panel.fl-on > .fl-pc{flex:1 1 0;min-height:0}
body.pch-on #panel .fl-top{display:flex;align-items:center;gap:18px;margin:2px 0 10px;flex-wrap:wrap}
body.pch-on #panel .fl-rank{display:flex;align-items:center;gap:10px;padding:6px 12px;border-radius:12px;background:#0e1a2c;border:1px solid #ffffff14;cursor:help}
body.pch-on #panel .fl-rank .rar{color:var(--gold,#ffd36a)}
body.pch-on #panel .fl-rank b{font:800 15px var(--display,system-ui);color:#ffe6a8}
body.pch-on #panel .fl-rbar,body.pch-on #panel .fl-mbar,body.pch-on #panel .fl-wb{display:block;height:4px;border-radius:4px;background:#ffffff14;overflow:hidden}
body.pch-on #panel .fl-rbar{width:90px}
body.pch-on #panel .fl-rbar i,body.pch-on #panel .fl-mbar i,body.pch-on #panel .fl-wb i{display:block;height:100%;border-radius:4px;background:linear-gradient(90deg,#7fe3c4,#ffd36a)}
body.pch-on #panel .fl-sum{flex:1;min-width:0;font-size:12.5px;color:#9fb2c8;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
body.pch-on #panel .fl-pc{display:grid;grid-template-columns:210px minmax(0,1fr) 320px;gap:14px;min-height:0}
body.pch-on #panel .fl-pc.fl-wide{grid-template-columns:210px minmax(0,1fr)}
body.pch-on #menuov #panel .fl-wide .fl-main .jgrid{row-gap:5px!important;padding-top:0}
@media (min-width:1700px) and (min-height:1000px){ body.pch-on #menuov #panel .fl-pc:not(.fl-wide) .fl-main .jgrid{grid-template-columns:repeat(auto-fill,minmax(108px,1fr))!important;row-gap:14px!important} body.pch-on #panel .fl-pc:not(.fl-wide) .fl-main .jcard canvas{max-height:58px} body.pch-on #panel .fl-pc:not(.fl-wide) .fl-main .jcard b{font-size:13px!important} body.pch-on #panel .fl-pc:not(.fl-wide) .fl-main .jcard small{font-size:11px!important} body.pch-on #panel .fl-pc{grid-template-columns:230px minmax(0,1fr) 360px} body.pch-on #panel .fl-pc.fl-wide{grid-template-columns:230px minmax(0,1fr)} }
body.pch-on #panel .fl-wide .fl-main .jcard canvas{max-height:32px}
body.pch-on #panel .fl-pc > *{min-height:0;overflow:auto;scrollbar-width:thin;scrollbar-color:#ffffff22 transparent}
body.pch-on #panel .fl-pc h5{margin:4px 2px 6px;font:800 11.5px var(--display,system-ui);letter-spacing:.08em;text-transform:uppercase;color:#8fa6bf}
body.pch-on #panel .fl-side h5:not(:first-child){margin-top:14px}
body.pch-on #panel .fl-waters{display:flex;flex-direction:column;gap:3px}
body.pch-on #panel .fl-w{display:grid;grid-template-columns:minmax(0,1fr) auto;row-gap:4px;column-gap:8px;align-items:center;text-align:left;padding:7px 10px 8px;border-radius:10px;border:1px solid transparent;background:#ffffff06;color:#dbe6f2;cursor:pointer;font:700 13px var(--display,system-ui)}
body.pch-on #panel .fl-w:hover{background:#ffffff10;border-color:#ffffff1c}
body.pch-on #panel .fl-w[aria-pressed="true"]{background:#1d3150;border-color:#7fb8ff66;color:#fff;box-shadow:inset 3px 0 0 #7fb8ff}
body.pch-on #panel .fl-w .fl-wn{white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
body.pch-on #panel .fl-w .fl-wn em{font-style:normal;color:#7fe3c4;font-size:10px;vertical-align:1px}
body.pch-on #panel .fl-w .fl-wc{font-size:11.5px;color:#9fb2c8;font-variant-numeric:tabular-nums}
body.pch-on #panel .fl-w .fl-wb{grid-column:1 / -1}
body.pch-on #panel .fl-w.done .fl-wc{color:#7fe3c4}
body.pch-on #panel .fl-w.locked{opacity:.55}
body.pch-on #panel .fl-show{display:flex!important;flex-direction:column;flex-wrap:nowrap!important;gap:3px;margin:0!important}
body.pch-on #panel .fl-show .chipb{justify-content:flex-start;text-align:left;width:100%;border-radius:10px}
body.pch-on #panel .fl-sec{margin-top:14px;font-size:11.5px;line-height:1.5}
body.pch-on #panel .fl-main{display:flex;flex-direction:column;gap:8px;padding-right:4px}
body.pch-on #panel .fl-mh{display:grid;grid-template-columns:minmax(0,1fr);gap:6px;position:sticky;top:0;z-index:3;background:linear-gradient(#0b1626 85%,#0b162600);padding-bottom:8px}
body.pch-on #panel .fl-mh h3{display:inline-block;margin:0 12px 0 0!important;vertical-align:-2px;font:800 19px var(--display,system-ui);color:#fff}
body.pch-on #menuov #panel .fl-main .jgrid{grid-template-columns:repeat(auto-fill,minmax(80px,1fr))!important;gap:11px 5px!important;margin:0!important}
body.pch-on #panel .fl-rh{grid-column:1 / -1;display:flex;align-items:center;gap:8px;margin:6px 2px 0;font:800 12px var(--display,system-ui);letter-spacing:.07em;text-transform:uppercase}
body.pch-on #panel .fl-rh:first-child{margin-top:0}
body.pch-on #panel .fl-rh i{width:8px;height:8px;border-radius:50%}
body.pch-on #panel .fl-rh .meta{letter-spacing:0;text-transform:none}
body.pch-on #panel .fl-main .jcell,body.pch-on #panel .fl-main .jgrid > .jcard{position:relative}
body.pch-on #panel .fl-main .jcard{padding:5px 4px 6px!important;gap:1px!important;min-height:0!important;box-shadow:inset 0 3px 0 color-mix(in srgb,var(--rc,#ffffff) 75%,transparent)}
body.pch-on #panel .fl-main .fl-first::after{content:attr(data-rk);position:absolute;left:5px;top:-7px;z-index:2;padding:0 5px;border-radius:5px;background:var(--rc);color:#08111d;font:900 8.5px/13px var(--display,system-ui);letter-spacing:.06em;text-transform:uppercase;pointer-events:none}
body.pch-on #panel .fl-main .jgrid{padding-top:7px}
body.pch-on #panel .fl-leg{display:flex;flex-wrap:wrap;gap:4px 14px;font-size:11.5px;color:#9fb2c8}
body.pch-on #panel .fl-leg span{display:inline-flex;align-items:center;gap:5px}
body.pch-on #panel .fl-leg i{width:9px;height:9px;border-radius:3px;background:var(--rc)}
body.pch-on #panel .fl-leg b{color:#e6eef7;font-weight:700}
body.pch-on #panel .fl-main .jcard canvas{width:100%!important;height:auto!important;aspect-ratio:2/1;max-height:38px;object-fit:contain}
body.pch-on #panel .fl-main .jcard b{font-size:12px!important;line-height:1.2;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:100%}
body.pch-on #panel .fl-main .jcard small{font-size:10.5px!important;line-height:1.25;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:100%}
body.pch-on #panel .fl-main .jcard.sel{outline:2px solid #ffd36a;outline-offset:-1px}
body.pch-on #panel .fl-main .jcard .hunt-tag{top:4px;left:4px;font-size:8.5px;padding:1px 5px}
/* the hunt toggle: a small target in the card's top right corner (shown on hover, always shown while hunting) */
body.pch-on #panel .fl-main .hunt-t{position:absolute;top:4px;right:4px;z-index:2;margin:0;width:26px;height:26px;min-height:0!important;padding:0;border-radius:50%;display:grid;place-items:center;font-size:0;background:#06101ccc;border:1px solid #ffffff26;opacity:0;transition:opacity .12s}
body.pch-on #panel .fl-main .hunt-t::before{content:"🎯";font-size:13px}
body.pch-on #panel .fl-main .jcell:hover .hunt-t,body.pch-on #panel .fl-main .hunt-t:focus-visible,body.pch-on #panel .fl-main .hunt-t.on{opacity:1}
body.pch-on #panel .fl-main .hunt-t.on{background:#ffb36a;border-color:#ffb36a}
body.pch-on #panel .fl-main .hunt-t:hover{border-color:#ffb36a;background:#2a1a0c}
body.pch-on #panel .fl-main .hunt-t.on:hover{background:#ffc78a}
body.pch-on #panel .fl-right{display:flex;flex-direction:column;gap:10px}
body.pch-on #panel .fl-right .hunt-bar{margin:0!important}
body.pch-on #panel .fl-right .hunt-bar .meta{font-size:12px;line-height:1.45}
body.pch-on #panel .fl-right .tile.detail{margin:0!important;display:flex!important;flex-direction:column!important;gap:6px;padding:12px!important}
body.pch-on #panel .fl-right .tile.detail canvas{width:100%!important;height:auto!important;max-width:none!important;aspect-ratio:2/1}
body.pch-on #panel .fl-right .tile.detail h2{font-size:19px;margin:2px 0}
body.pch-on #panel .fl-right .tile.detail .kv{grid-template-columns:1fr 1fr!important;gap:4px 10px!important;font-size:12px}
body.pch-on #panel .fl-right .tile.detail .sub{font-size:12px}
body.pch-on #panel .fl-pickhint{display:flex;flex-direction:column;gap:6px;padding:14px!important;border-style:dashed!important}
body.pch-on #panel .fl-pickhint b{font:800 14px var(--display,system-ui)}
</style>`);
document.head.insertAdjacentHTML('beforeend',`<style>
/* PC: Set sail again: the voyage card on the left, the milestones beside it in two columns (it was squeezed into two narrow
   grid cells, one word per line) */
body.pch-on #panel .grid:has(> .tile .voy-list){grid-template-columns:minmax(300px,380px) minmax(0,1fr)!important;align-items:start}
body.pch-on #panel .tile .voy-list{display:grid!important;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px}
body.pch-on #panel .voy-stats{grid-template-columns:repeat(3,minmax(0,1fr))}
</style>`);
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
// PC, Pets > Find more: headings over the pets you can adopt and the ones still to find; they follow the section tabs
{ const _rp=renderPanel; renderPanel=function(){ const r=_rp.apply(this,arguments); try{ if(S.tab==='pets'&&document.body.classList.contains('pch-on')){ const P=$('panel'), g=P.querySelector(':scope > .grid'); if(!g) return r;
      const add=(sel,txt)=>{ const list=[...g.querySelectorAll(':scope > '+sel)]; if(!list.length) return; const h=document.createElement('div'); h.className='pet-h'; h.dataset.for=sel; h.innerHTML=`<span>${txt}</span><span class="meta">${list.length}</span>`; g.insertBefore(h,list[0]); };
      add('.pet-sale','Adopt'); add('.pet-hid','Still to find');
      const sync=()=>g.querySelectorAll('.pet-h').forEach(h=>{ const n=[...g.querySelectorAll(':scope > '+h.dataset.for)].filter(t=>t.style.display!=='none').length; h.style.display=n?'':'none'; h.querySelector('.meta').textContent=n; });
      sync(); const nav=P.querySelector('.sect-nav'); if(nav) nav.addEventListener('click',()=>setTimeout(sync,0)); } }catch(e){} return r; }; }
document.head.insertAdjacentHTML('beforeend',`<style>
body.pch-on #panel .grid > .pet-h{grid-column:1 / -1;display:flex;align-items:baseline;gap:8px;margin:6px 2px -2px;font:800 12.5px var(--display,system-ui);letter-spacing:.07em;text-transform:uppercase;color:#cfe0f2}
body.pch-on #panel .grid > .pet-h:first-child{margin-top:0}
body.pch-on #panel .grid > .pet-h .meta{letter-spacing:0}
body.pch-on #panel .tile.pet-hid canvas{align-self:center}
</style>`);
document.head.insertAdjacentHTML('beforeend',`<style>
/* the pet filter belongs to "Your pets": the page hides it on the other tabs, and the one-row phone style must not show it again */
#menuov #panel .chips.pet-filter[style*="display: none"],#menuov #panel .chips.pet-filter[style*="display:none"]{display:none!important}
</style>`);
// =====================================================================
// PC quality of life (director, 2026-11-17: "on pc there's no exit button?", "a settings rework for pc where pc has exclusive
// controls and options. Nothing new, just QOL", "gold got moved? I liked it next to level").
// - Coins are back next to Level on the info row; the header keeps the same width so it still lines up with the menu's row.
// - A full screen button beside search, in the header and in the menus (Exit full screen when you are in it), and the F key.
// - Settings on PC: Sound, Controls, Display, Gameplay and a PC group on one page ("General"), patch notes and save as before.
// Phones and tablets are unchanged.
// =====================================================================
const pcFs={ api:()=>!!document.fullscreenElement,
  // full screen by F11 (browser menu) cannot be left from the page: it fills the screen without the fullscreen API
  f11:()=>!document.fullscreenElement&&innerHeight>=screen.height-2&&innerWidth>=screen.width-2,
  on(){ return this.api()||this.f11(); },
  toggle(){ const d=document; try{ if(d.fullscreenElement){ d.exitFullscreen(); return; } if(this.f11()){ toast('Press F11 to leave full screen.'); return; } const p=d.documentElement.requestFullscreen&&d.documentElement.requestFullscreen(); if(p&&p.catch) p.catch(()=>toast('This browser did not allow full screen.')); }catch(e){} } };
{ const ICON_IN='<svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/></svg>',
    ICON_OUT='<svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 4v5H4M15 4v5h5M9 20v-5H4M15 20v-5h5"/></svg>';
  const mk=cls=>{ const b=document.createElement('button'); b.type='button'; b.className=cls+' pc-fsb'; b.addEventListener('click',e=>{ e.stopPropagation(); e.preventDefault(); pcFs.toggle(); setTimeout(sync,250); },true); return b; };
  const bs=[]; const add=(host,cls)=>{ if(!host) return; const b=mk(cls); const ref=host.querySelector('[data-pch="search"],[data-mo="search"]'); host.insertBefore(b,ref||null); bs.push(b); };
  const sync=()=>{ const on=pcFs.on(); bs.forEach(b=>{ b.innerHTML=on?ICON_OUT:ICON_IN; const t=on?'Exit full screen (Esc or F)':'Full screen (F)'; b.title=t; b.setAttribute('aria-label',t); b.setAttribute('aria-pressed',on); });
    document.querySelectorAll('#panel [data-act="fullscreen"]').forEach(x=>{ x.textContent=on?'Exit full screen':'Full screen'; const m=x.closest('.toggle')&&x.closest('.toggle').querySelector('.meta'); if(m&&m.dataset.pcfs) m.textContent=on?(pcFs.api()?'You are in full screen. Esc also leaves it.':'Full screen from the browser: press F11 to leave it.'):'Fill the whole screen with the game. F does it too.'; }); };
  const init=()=>{ add(document.querySelector('#pchead .pch-tools'),'pch-tb'); add(document.querySelector('#menuov .mo-tools'),'mo-tb'); sync(); };
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',init); else init();
  document.addEventListener('fullscreenchange',()=>setTimeout(sync,60)); addEventListener('resize',()=>setTimeout(sync,120));
  window.pcFsSync=sync;
  // F: full screen on PC (not while typing)
  addEventListener('keydown',e=>{ if((e.key!=='f'&&e.key!=='F')||e.ctrlKey||e.metaKey||e.altKey||e.repeat) return; if(!document.body.classList.contains('pch-on')) return; const t=(document.activeElement&&document.activeElement.tagName)||''; if(/INPUT|TEXTAREA|SELECT/.test(t)) return; const sov=$('searchov'); if(sov&&!sov.hidden) return; e.preventDefault(); pcFs.toggle(); setTimeout(sync,250); });
  // the shortcut list: current section names, and F
  try{ const k=KEYS.find(x=>x[0]==='1 - 5'); if(k) k[1]='Open a section (Fishing, Upgrades, Collections, Challenges, Customization)'; if(!KEYS.some(x=>x[0]==='F')) KEYS.splice(KEYS.findIndex(x=>x[0]==='M')+1,0,['F','Full screen on or off (PC)']); }catch(e){} }
// Settings on PC
{ const _rs=renderSettings; renderSettings=function(P){ _rs(P); if(!document.body.classList.contains('pch-on')) return; try{ const grid=P.querySelector(':scope > .grid'); if(!grid) return; const s=S.settings;
    // the full screen and frame rate rows move from Display into the PC group
    const disp=[...grid.children].find(t=>/^Display/.test((t.querySelector('h4')||{}).textContent||'')); let fpsRow=null;
    if(disp){ disp.querySelectorAll('.toggle').forEach(r=>{ if(r.querySelector('[data-act="fullscreen"]')) r.remove(); else if(r.querySelector('[data-k="showFps"]')) fpsRow=r; }); if(fpsRow) fpsRow.remove(); }
    let auto=true; try{ auto=localStorage.getItem('dl-fs-auto')!=='0'; }catch(e){}
    const t=document.createElement('div'); t.className='tile pc-set'; t.innerHTML=`<h4>PC</h4>
      <div class="toggle"><div><b>Full screen</b><div class="meta" data-pcfs="1"></div></div><button class="btn sm" data-act="fullscreen" type="button">Full screen</button></div>
      <div class="toggle"><div><b>Back to full screen</b><div class="meta">If you leave the game in full screen, it goes back to full screen the next time you play.</div></div><button class="btn ${auto?'':'alt'} sm" data-pcauto="1" type="button" aria-pressed="${auto}">${auto?'On':'Off'}</button></div>
      ${fpsRow?fpsRow.outerHTML:''}
      <h5>Keyboard</h5><div class="pc-keys">${KEYS.map(k=>`<div><kbd>${esc(k[0])}</kbd><span>${esc(k[1])}</span></div>`).join('')}</div>`;
    grid.appendChild(t);
    const ab=t.querySelector('[data-pcauto]'); ab.addEventListener('click',e=>{ e.stopPropagation(); let v=true; try{ v=localStorage.getItem('dl-fs-auto')==='0'; localStorage.setItem('dl-fs-auto',v?'1':'0'); }catch(er){} ab.textContent=v?'On':'Off'; ab.classList.toggle('alt',!v); ab.setAttribute('aria-pressed',v); });
    if(window.pcFsSync) pcFsSync(); }catch(e){ console.error(e); } };
  // one "General" page on PC instead of a tab per small group
  const _as=applySections; applySections=function(){ _as(); try{ if(S.tab!=='settings'||!document.body.classList.contains('pch-on')) return; const P=$('panel'); const old=P.querySelector(':scope > .sect-nav'); if(old) old.remove();
      const K=[...P.children], grid=K.find(c=>c.classList.contains('grid')); if(!grid) return; const tiles=[...grid.children], h=(t,re)=>re.test((t.querySelector('h4')||{}).textContent||'');
      const general=tiles.filter(t=>!h(t,/^Patch notes/)), notes=tiles.filter(t=>h(t,/^Patch notes/)), save=K.filter(c=>c!==grid&&(c.classList.contains('tile')||c.tagName==='DETAILS'));
      if(SECT.settings&&!['General','Patch notes','Save & codes'].includes(SECT.settings)) SECT.settings='General';
      sectionize(P,'settings',[{name:'General',nodes:general},{name:'Patch notes',nodes:notes},{name:'Save & codes',nodes:save}],K.find(c=>c.classList.contains('tile')||c===grid));
      const sync=()=>{ const on=(P.querySelector('.sect-nav [aria-selected="true"]')||{}).textContent==='General'; grid.classList.toggle('sect-one',!on); grid.classList.toggle('pc-setgrid',on); };
      sync(); const nav=P.querySelector('.sect-nav'); if(nav) nav.addEventListener('click',()=>setTimeout(sync,0)); }catch(e){ console.error(e); } }; }
document.head.insertAdjacentHTML('beforeend',`<style>
.pc-fsb{display:none!important}
html body.pch-on .pc-fsb{display:inline-grid!important;place-items:center}
html body.pch-on .pc-fsb svg{display:block}
/* coins next to Level again on PC; the header keeps the menu row's width so the two rows still line up */
/* (coins sit with Level in the header corner, see below) */

/* Settings, General page */
body.pch-on #menuov #panel .grid.pc-setgrid{grid-template-columns:repeat(3,minmax(0,1fr))!important;align-items:start;gap:12px!important}
body.pch-on #panel .pc-set .pc-keys{display:grid;grid-template-columns:auto minmax(0,1fr);gap:5px 10px;align-items:center;margin-top:4px}
body.pch-on #panel .pc-set .pc-keys > div{display:contents}
body.pch-on #panel .pc-set kbd{display:inline-block;min-width:46px;text-align:center;padding:2px 7px;border-radius:7px;background:#ffffff14;border:1px solid #ffffff2a;border-bottom-width:2px;font:800 11.5px ui-monospace,Consolas,monospace;color:#fff}
body.pch-on #panel .pc-set .pc-keys span{font-size:12.5px;color:#cfdcea}
</style>`);
// PC Settings, General: three balanced columns (Sound | Controls + Gameplay | Display + PC) instead of rows with gaps
{ const _as=applySections; applySections=function(){ _as(); try{ if(S.tab!=='settings'||!document.body.classList.contains('pch-on')) return; const g=$('panel').querySelector(':scope > .grid.pc-setgrid, :scope > .grid'); if(!g||g.querySelector(':scope > .pc-col')) return;
      const tiles=[...g.children], by=re=>tiles.find(t=>re.test((t.querySelector('h4')||{}).textContent||''));
      const plan=[[/^Sound/],[/^Controls/,/^Gameplay/],[/^Display/,/^PC$/]]; const cols=plan.map(res=>{ const c=document.createElement('div'); c.className='pc-col'; res.forEach(re=>{ const t=by(re); if(t) c.appendChild(t); }); return c; });
      if(cols.some(c=>c.children.length)) g.prepend(...cols); }catch(e){ console.error(e); } }; }
document.head.insertAdjacentHTML('beforeend',`<style>
body.pch-on #panel .grid > .pc-col{display:flex;flex-direction:column;gap:12px;min-width:0}
body.pch-on #panel .grid.sect-one > .pc-col{display:none}
</style>`);
// =====================================================================
// PC: one header row (director, 2026-11-17: "make this header super clean; if 1 row is possible, that's the dream, allowing the
// fishing scene to get larger"; "level and money as close to the fishing scene as possible").
//   [ Level · Coins ] [ Fishing  Upgrades  Collections  Challenges  Customization ]        [ Cooler  Aquarium  Fish Log ] [ ⛶ 🔍 ⚙ ]
// - The left block is as wide as "Back to fishing" in the menus, and the section tabs have the same fixed width and position in
//   both, so nothing moves when a menu opens.
// - What belongs to the water sits on the water: one badge in its top-left corner with where you fish, the day and weather, and
//   your next goal (the weather chip the canvas drew there is replaced by it on PC).
// - The info row is gone on PC, so the water gets its height. Every chip keeps its own clicks and live updates (they are moved,
//   not copied) and goes back to the info row on every other layout.
// =====================================================================
{ const pc=()=>document.body.classList.contains('pch-on');
  let scene=null, wx=null, stats=null, built=false;
  const marks=new Map(); // element -> comment that marks its home in the info row
  const park=(el,host,before)=>{ if(!el||!host) return; if(!marks.has(el)){ const c=document.createComment('pc-home'); el.parentNode.insertBefore(c,el); marks.set(el,c); } if(el.parentElement!==host||(before!==undefined&&el.nextSibling!==before)) host.insertBefore(el,before||null); };
  const home=el=>{ const c=marks.get(el); if(c&&c.parentNode&&el.previousSibling!==c) c.parentNode.insertBefore(el,c.nextSibling); };
  const parts=()=>{ const st=id=>{ const e=$(id); return e&&e.closest('.stat'); }; return { lv:st('lvl'), co:st('money'), cool:st('coolerct'), aq:document.querySelector('.stat.st-aq'), log:document.querySelector('.stat.st-log'), loc:document.querySelector('.stat.loc'), goal:$('goalchip') }; };
  const build=()=>{ if(built) return true; const tools=document.querySelector('#pchead .pch-tools'), stg=$('stage'); if(!tools||!stg) return false;
    stats=document.createElement('div'); stats.className='pch-stats'; tools.prepend(stats);
    // the strip directly above the water (director, 2026-11-17: nothing may cover the fishing scene)
    scene=document.createElement('div'); scene.id='pcscene'; scene.innerHTML='<div class="pcs-wx"><span class="lbl"></span><b></b></div><span class="pcs-gap"></span><span class="pcs-boosts"></span><span class="pcs-streak"></span>'; wx=scene.firstChild; stg.parentNode.insertBefore(scene,stg);
    built=true; return true; };
  const apply=()=>{ if(!build()) return; const p=parts(), br=document.querySelector('#pchead .pch-brand');
    if(pc()){ if(br){ br.classList.add('pch-me'); br.removeAttribute('aria-hidden'); park(p.lv,br); park(p.co,br); }
      park(p.cool,stats); park(p.aq,stats); park(p.log,stats);
      park(p.loc,scene,wx); park(p.goal,scene,scene.querySelector('.pcs-gap')); park($('resttog'),scene); tick(); }
    else [p.lv,p.co,p.cool,p.aq,p.log,p.loc,p.goal,$('hint'),$('resttog')].forEach(e=>e&&home(e)); };
  // the day and weather ("Day · Rain  bites +35% · 0:58"), boosts and streak, as the canvas drew them on the water
  const tick=()=>{ if(!built||!pc()) return; try{ const w=weather(), tag=WX_TAG[w.k], l=tod(phase())+' · '+wxName(w.k), v=(tag?tag+' · ':'changes in ')+mmss(wxLeft());
      const a=wx.firstChild, b=wx.lastChild; if(a.textContent!==l) a.textContent=l; if(b.textContent!==v) b.textContent=v; wx.classList.toggle('special',!!tag); wx.classList.toggle('gilded',w.k==='Gilded');
      const sk=scene.querySelector('.pcs-streak'), st=S.streak>=2?'Streak '+S.streak+' · +'+Math.round(Math.min(streakCap(),.05*S.streak)*100)+'% XP':''; if(sk.textContent!==st) sk.textContent=st; sk.classList.toggle('hot',S.streak>=10);
      const bo=scene.querySelector('.pcs-boosts'), now=Date.now(), bt=S.settings.boostsOnScreen?activeBuffs().slice(0,3).map(x=>fmtB(x.k,x.v)+' '+mmss(Math.ceil((x.until-now)/1000))).join('   '):''; if(bo.textContent!==bt) bo.textContent=bt; }catch(e){} };
  setInterval(tick,1000);
  const _sc=drawSceneChip; drawSceneChip=function(){ if(pc()) return; return _sc.apply(this,arguments); };
  const init=()=>{ apply(); new MutationObserver(apply).observe(document.body,{attributes:true,attributeFilter:['class']}); setTimeout(apply,300); setTimeout(apply,1200); addEventListener('resize',()=>setTimeout(apply,200)); };
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',init); else init(); }
document.head.insertAdjacentHTML('beforeend',`<style>
/* the tabs' width, shared by the header and the menus: as wide as fits between the left block and the right block, at most 700 */
html body.pch-on{--pcTabs:min(700px,calc(100vw - 32px - 190px - 500px - 56px))}
html body.pch-on.dl-fish .hud{display:none!important}
html body.pch-on.dl-fish #pchead{grid-template-columns:190px calc(var(--pcTabs) + 14px) minmax(0,1fr) auto!important;column-gap:14px!important;grid-template-rows:46px!important;height:46px!important}
html body.pch-on #pchead .pch-brand{grid-column:1!important;grid-row:1!important}
html body.pch-on #pchead .pch-cats{grid-column:2!important;grid-row:1!important;margin-left:14px!important}
html body.pch-on #pchead .pch-tools{grid-column:4!important;grid-row:1!important}
html body.pch-on #pchead .pch-coin{display:none!important}
html body.pch-on #menuov .mo-in{grid-template-columns:190px 0 var(--pcTabs) minmax(0,1fr) auto!important;grid-template-areas:"back home secs . tools" "sub sub sub sub sub" "body body body body body"!important}
/* left block: Level and coins */
html body.pch-on #pchead .pch-brand.pch-me{display:grid!important;grid-template-columns:minmax(0,1.1fr) minmax(0,1fr);padding:0;overflow:hidden;cursor:default}
html body.pch-on #pchead .pch-me > *:not(.stat){display:none}
html body.pch-on #pchead .pch-me > .stat{display:flex!important;flex-direction:column;justify-content:center;gap:3px;min-width:0;padding:4px 12px;margin:0;border:0!important;border-radius:0!important;background:none!important;box-shadow:none!important;flex:none!important;max-width:none!important;height:auto!important}
html body.pch-on #pchead .pch-me > .stat + .stat{border-left:1px solid #7fe3c42a!important}
html body.pch-on #pchead .pch-me .st-lvl .lbl{display:flex;align-items:baseline;gap:6px}
html body.pch-on #pchead .pch-me #lvl{font-size:15px!important;color:#fff}
html body.pch-on #pchead .pch-me #money{font-size:15px}
/* right block: cooler, aquarium, Fish Log as compact counters */
html body.pch-on #pchead .pch-stats{display:flex;gap:6px;height:46px}
html body.pch-on #pchead .pch-stats > .stat{display:flex!important;flex-direction:column;justify-content:center;gap:2px;height:46px!important;box-sizing:border-box;padding:4px 12px!important;margin:0!important;min-width:0!important;max-width:none!important;flex:0 0 auto!important;border-radius:14px!important}
html body.pch-on #pchead .pch-stats > .stat b{font-size:14px;white-space:nowrap}
/* the strip directly above the water: one line, nothing on the picture itself */
html body:not(.pch-on) #pcscene,html body.pch-on:not(.dl-fish) #pcscene{display:none}
html body.pch-on.dl-fish #pcscene{display:flex;align-items:center;gap:4px;height:30px;margin:6px 0 4px;padding:0 4px;flex:0 0 auto;min-width:0;overflow:hidden}
html body.pch-on #pcscene > *{flex:0 1 auto;min-width:0}
html body.pch-on #pcscene > .stat,html body.pch-on #pcscene > #goalchip,html body.pch-on #pcscene > .pcs-wx{position:static!important;inset:auto!important;transform:none!important;display:flex!important;flex-direction:row!important;align-items:baseline!important;gap:7px!important;margin:0!important;padding:4px 10px!important;width:auto!important;height:auto!important;max-width:none!important;border:0!important;border-radius:9px!important;background:none!important;box-shadow:none!important}
html body.pch-on #pcscene > .pcs-wx{border-left:1px solid #ffffff14!important;border-right:1px solid #ffffff14!important;border-radius:0!important}
html body.pch-on #pcscene > .hud-link:hover,html body.pch-on #pcscene > #goalchip:hover{background:#ffffff0d!important}
html body.pch-on #pcscene .lbl{font-size:10px;letter-spacing:.08em;text-transform:uppercase;color:#8ea4b9;white-space:nowrap}
html body.pch-on #pcscene b{font-size:13px;color:#eef4f8;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
html body.pch-on #pcscene .pcs-wx.special b{color:#bfe8ff}
html body.pch-on #pcscene .pcs-wx.gilded b{color:#ffc94d}
html body.pch-on #pcscene #goalchip > .gl-s{display:none!important}
html body.pch-on #pcscene #goalchip > .gl-k{font-size:10px;letter-spacing:.08em;text-transform:uppercase;color:#8ea4b9;white-space:nowrap}
html body.pch-on #pcscene #goalchip > .gl-t{font-size:13px;font-weight:800;color:#eef4f8;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
html body.pch-on #pcscene #goalchip > .gl-bar{position:static!important;display:inline-block!important;width:46px;height:4px;border-radius:4px;background:#ffffff1a;overflow:hidden;align-self:center;margin:0!important}
html body.pch-on #pcscene #goalchip > .gl-bar b{display:block;height:100%;background:linear-gradient(90deg,#7fe3c4,#ffd36a)}
html body.pch-on #pcscene .pcs-gap{flex:1 1 auto}
html body.pch-on #pcscene > #hint{position:static!important;inset:auto!important;transform:none!important;margin:0 8px!important;padding:0!important;background:none!important;border:0!important;box-shadow:none!important;font-size:12px!important;color:#8ea4b9!important;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:none!important;flex:0 1 auto;opacity:1!important}
html body.pch-on #pcscene .pcs-boosts{font-size:12px;font-weight:700;color:#7fc8a9;white-space:nowrap;flex:0 0 auto}
html body.pch-on #pcscene .pcs-streak{font-size:12px;font-weight:800;color:#e6efe8;white-space:nowrap;flex:0 0 auto}
html body.pch-on #pcscene .pcs-streak.hot{color:#ffc94d}
html body.pch-on #pcscene .pcs-boosts:empty,html body.pch-on #pcscene .pcs-streak:empty{display:none}
html body.pch-on #pcscene > #resttog{position:static!important;inset:auto!important;transform:none!important;margin:0 0 0 6px!important;flex:0 0 auto}
/* narrower PC windows: icon-only section tabs (names on hover) in both rows, and a tighter right block */
@media (max-width:1320px){
  html body.pch-on{--pcTabs:max(240px,min(700px,calc(100vw - 32px - 190px - 480px - 56px)))}
  html body.pch-on #pchead #catdock .cdl,html body.pch-on #menuov #tabs .secl{display:none!important}
  html body.pch-on #pchead #catdock .cdb,html body.pch-on #menuov #tabs .secb{padding:4px 6px!important}
  html body.pch-on #pchead .pch-stats > .stat{padding:4px 9px!important}
}
</style>`);
document.head.insertAdjacentHTML('beforeend',`<style>
html body.pch-on #pcscene > #goalchip{position:relative!important;inset:auto!important;transform:none!important;left:auto!important;top:auto!important}
/* short section names on PC (Collection, Customize) in both rows, with room for icon, name and badge */
html body.pch-on #menuov #tabs.secmode .secb .secfull{display:none!important}
html body.pch-on #menuov #tabs.secmode .secb .secshort{display:inline!important}
html body.pch-on #pchead #catdock .cdb,html body.pch-on #menuov #tabs.secmode .secb{gap:6px!important;padding-left:8px!important;padding-right:8px!important}
</style>`);
{ const shortNames=()=>{ if(!document.body.classList.contains('pch-on')) return; document.querySelectorAll('#pchead #catdock .cdb[data-cd]').forEach(b=>{ const sec=MENU_SECS.find(s=>s.id===b.dataset.cd), l=b.querySelector('.cdl'); if(sec&&l){ const t=sec.short||sec.name; if(l.textContent!==t) l.textContent=t; b.title=sec.name; } }); };
  new MutationObserver(()=>setTimeout(shortNames,0)).observe(document.body,{attributes:true,attributeFilter:['class']}); addEventListener('resize',()=>setTimeout(shortNames,60)); setTimeout(shortNames,200); }
// iPhone Home Screen app (director, 2026-11-17, screenshot): opened sideways, the whole game sat ~55 points too low, below an
// empty band. iOS can keep the safe-area numbers of the other orientation after launching or turning the phone, so the layout
// left room for a notch that isn't there (and, the other way round, upright could sit under the notch). Two fixes:
// 1. Sideways, an iPhone never needs room at the top (the status bar is hidden), so that layout no longer reads the top inset.
// 2. After a launch or a turn, iOS is made to read the safe areas again (the viewport setting is re-applied and styles refreshed).
document.head.insertAdjacentHTML('beforeend',`<style>
html body.phone-land.dl-fish{padding-top:6px!important}
html body.phone-land #menuov .mo-in{padding-top:5px!important}
html body.phone-land #menuov > #toast{top:60px!important}
html body.phone-land #menuov #panel .wd-prev{height:calc(100dvh - 150px)!important}
html body.phone-land .dlprev{top:4px!important}
</style>`);
{ const ios=/iP(hone|od|ad)/.test(navigator.userAgent)||(navigator.platform==='MacIntel'&&navigator.maxTouchPoints>1);
  if(ios){ const vp=document.querySelector('meta[name=viewport]'); let q=0;
    const refresh=()=>{ try{ if(vp){ const c=vp.getAttribute('content'); vp.setAttribute('content',c+' '); vp.setAttribute('content',c); }
        const r=document.documentElement; r.classList.add('sa-recalc'); void r.offsetHeight; r.classList.remove('sa-recalc'); try{ resize(); }catch(e){} }catch(e){} };
    const soon=()=>{ clearTimeout(q); [80,400,1000].forEach(ms=>setTimeout(refresh,ms)); };
    addEventListener('orientationchange',soon); addEventListener('resize',soon); addEventListener('pageshow',soon); document.addEventListener('visibilitychange',()=>{ if(!document.hidden) soon(); });
    soon(); }
  document.head.insertAdjacentHTML('beforeend','<style>html.sa-recalc body{padding-bottom:calc(env(safe-area-inset-bottom) + 0.01px)}</style>'); }
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
// =====================================================================
// PC patch notes, as a reader (director, 2026-11-17, hotfix: "pc patch notes look garbage"). One card of a fixed size: the
// title and "Let's fish!" on top, the updates you missed listed on the left (newest first; click one to read it), and the
// chosen update on the right with its sections in balanced columns (no holes; platform sections last). Only the notes scroll,
// and only when an update is long. A single update gets the same card without the list. Phones keep their own card.
// =====================================================================
{ const _sw=showWhatsNew, _sp=showPatchNotes;
  const pc=()=>document.body.classList.contains('pch-on');
  // short sections side by side; long ones (more than 5 points) full width below, their points flowing in columns
  const body=p=>{ const d=document.createElement('div'); d.innerHTML=patchHTML(p); const g=d.querySelector('.pn-grid'); if(g){ g.classList.add('pnr-grid'); const secs=[...g.children]; secs.filter(s=>s.querySelectorAll('li').length>5).forEach(s=>{ s.classList.add('wide'); g.appendChild(s); }); } return d.innerHTML; };
  const open=(list,title,sub,after)=>{ G.st='event'; let cur=0;
    const rail=list.length>1?`<nav class="pnr-rail">${list.map((p,i)=>`<button type="button" class="pnr-it" data-i="${i}" aria-pressed="${i===0}"><span class="pnr-v">${p.label?esc(p.label):'Update '+esc(p.v)}</span><b>${esc(p.name)}</b>${i===0?'<span class="pnr-new">Newest</span>':''}</button>`).join('')}</nav>`:'';
    $('evin').innerHTML=`<div class="pnr${list.length>1?'':' one'}"><header class="pnr-top"><div><div class="rar" style="color:var(--gold)">${title}</div><h3>${sub}</h3></div><button class="btn" data-ev="skip">Let’s fish!</button></header><div class="pnr-main">${rail}<article class="pnr-body">${body(list[0])}</article></div></div>`;
    const art=$('evin').querySelector('.pnr-body');
    $('evin').querySelectorAll('.pnr-it').forEach(b=>b.addEventListener('click',e=>{ e.stopPropagation(); const i=+b.dataset.i; if(i===cur) return; cur=i; art.innerHTML=body(list[i]); art.scrollTop=0; $('evin').querySelectorAll('.pnr-it').forEach(x=>x.setAttribute('aria-pressed',String(+x.dataset.i===i))); }));
    $('evcard').hidden=false; if(after) setTimeout(()=>toast(after),400); };
  showWhatsNew=function(seen,after){ if(!pc()) return _sw.apply(this,arguments); const all=missedPatches(seen); if(all.length<=1) return showPatchNotes(PATCHES[0],after);
    const list=all.slice(0,20); open(list,`${all.length} updates since you last played`,'What’s new',after); };
  showPatchNotes=function(p=PATCHES[0],after){ if(!pc()) return _sp.apply(this,arguments); open([p],p.label?esc(p.label):'Update '+esc(p.v),esc(p.name),after); }; }
document.head.insertAdjacentHTML('beforeend',`<style>
body.pch-on #evin:has(.pnr){width:min(1180px,94vw)!important;max-width:none!important;height:min(760px,88vh)!important;max-height:none!important;padding:0!important;overflow:hidden!important;text-align:left;display:flex;flex-direction:column}
body.pch-on #evin .pnr{display:flex;flex-direction:column;height:100%;min-height:0}
body.pch-on #evin .pnr-top{display:flex;align-items:center;justify-content:space-between;gap:16px;padding:16px 22px 14px;border-bottom:1px solid #ffffff14;flex:0 0 auto}
body.pch-on #evin .pnr-top h3{margin:2px 0 0;font-size:24px}
body.pch-on #evin .pnr-top .btn{flex:0 0 auto;padding:9px 20px}
body.pch-on #evin .pnr-main{display:grid;grid-template-columns:240px minmax(0,1fr);flex:1 1 auto;min-height:0}
body.pch-on #evin .pnr.one .pnr-main{grid-template-columns:minmax(0,1fr)}
body.pch-on #evin .pnr-rail{display:flex;flex-direction:column;gap:4px;padding:12px;border-right:1px solid #ffffff14;overflow:auto;min-height:0}
body.pch-on #evin .pnr-it{display:grid;grid-template-columns:minmax(0,1fr) auto;row-gap:2px;align-items:center;text-align:left;padding:9px 12px;border-radius:11px;border:1px solid transparent;background:none;color:#cfdcea;cursor:pointer;font:inherit}
body.pch-on #evin .pnr-it:hover{background:#ffffff0b}
body.pch-on #evin .pnr-it[aria-pressed="true"]{background:#1d3150;border-color:#7fb8ff55;color:#fff;box-shadow:inset 3px 0 0 #7fb8ff}
body.pch-on #evin .pnr-it .pnr-v{grid-column:1;font:800 10.5px var(--display,system-ui);letter-spacing:.07em;text-transform:uppercase;color:var(--gold,#ffd36a)}
body.pch-on #evin .pnr-it b{grid-column:1;font-size:14px;font-weight:800;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
body.pch-on #evin .pnr-it .pnr-new{grid-column:2;grid-row:1 / 3;font-size:10px;font-weight:800;padding:2px 7px;border-radius:999px;background:#7fe3c422;color:#7fe3c4}
body.pch-on #evin .pnr-body{overflow:auto;min-height:0;padding:16px 22px 20px;scrollbar-width:thin}
body.pch-on #evin .pnr-body .pn-head{text-align:left;margin:0 0 12px}
body.pch-on #evin .pnr-body .pn-head h3{font-size:20px}
body.pch-on #evin .pnr-grid{display:grid!important;grid-template-columns:repeat(auto-fill,minmax(270px,1fr))!important;gap:14px!important;align-items:stretch!important}
body.pch-on #evin .pnr-grid .pn-sec.wide{grid-column:1 / -1}
body.pch-on #evin .pnr-grid .pn-sec.wide ul{columns:3 260px;column-gap:28px}
body.pch-on #evin .pnr-grid .pn-sec li{font-size:14px;line-height:1.5;break-inside:avoid}
</style>`);
document.head.insertAdjacentHTML('beforeend',`<style>
body.pch-on #evin .pnr.one .pnr-body .pn-head{display:none}
/* the tip line never shows as an empty bubble, and hides while a card (patch notes, events) is open over the water */
#hint:empty{display:none!important}
body.ev-open #hint{visibility:hidden!important}
</style>`);
// PC header down to 800 px wide (director, 2026-11-17: "the bar is back on the bottom for header categories" — a half-width
// window or browser zoom made the page narrower than 900 px, and the old layout came back). Under 1000 px it goes compact:
// icon-only tabs, the counters as icon + number (names on hover), the gear without its label. Crossing the width limit also
// re-checks the layout straight away.
try{ [800,1000,1320].forEach(w=>matchMedia('(min-width:'+w+'px)').addEventListener('change',()=>dispatchEvent(new Event('resize')))); }catch(e){}
document.head.insertAdjacentHTML('beforeend',`<style>
@media (max-width:1000px){
  html body.pch-on{--pcTabs:max(200px,min(700px,calc(100vw - 32px - 190px - 330px - 56px)))}
  html body.pch-on #pchead .pch-stats{gap:4px}
  html body.pch-on #pchead .pch-stats > .stat{padding:4px 8px!important;flex-direction:row!important;align-items:center;gap:5px}
  html body.pch-on #pchead .pch-stats > .stat .lbl{display:none!important}
  html body.pch-on #pchead .pch-stats > .st-cool::before{content:"🧊";font-size:13px}
  html body.pch-on #pchead .pch-stats > .st-aq::before{content:"🐠";font-size:13px}
  html body.pch-on #pchead .pch-stats > .st-log::before{content:"📖";font-size:13px}
  html body.pch-on #pchead [data-pch="settings"]::after,html body.pch-on #menuov [data-mo="settings"]::after{content:none!important;display:none!important}
  html body.pch-on #pchead [data-pch="settings"],html body.pch-on #menuov [data-mo="settings"]{width:42px!important;min-width:42px!important;padding:0!important;justify-content:center}
}
/* patch notes reader: a short update spreads across the card instead of sitting in one narrow box */
body.pch-on #evin .pnr-grid{grid-template-columns:repeat(auto-fit,minmax(270px,1fr))!important}
body.pch-on #evin .pnr-grid .pn-sec:only-child ul{columns:2 300px;column-gap:28px}
</style>`);
document.head.insertAdjacentHTML('beforeend',`<style>
@media (max-width:1000px){
  html body.pch-on{--pcTabs:max(176px,min(700px,calc(100vw - 32px - 190px - 400px - 56px)))}
  html body.pch-on #pchead .pch-tools{gap:4px!important}
  html body.pch-on #pchead .pch-stats > .stat{padding:4px 6px!important;gap:3px}
  html body.pch-on #pchead .pch-stats > .stat b{font-size:12.5px!important}
  html body.pch-on #pchead .pch-stats > .stat::before{font-size:11.5px!important}
  html body.pch-on #pchead .pch-tb,html body.pch-on #menuov .mo-tb{width:38px!important;min-width:38px!important}
  html body.pch-on #pchead #catdock,html body.pch-on #menuov #tabs .secbar{gap:3px!important}
  html body.pch-on #pchead #catdock .cdb,html body.pch-on #menuov #tabs.secmode .secb{padding-left:4px!important;padding-right:4px!important;min-width:0!important}
}
</style>`);
document.head.insertAdjacentHTML('beforeend',`<style>
/* a single update: the card is as tall as its notes (up to the same limit), not a fixed size */
body.pch-on #evin:has(.pnr.one){height:auto!important;max-height:min(760px,88vh)!important}
body.pch-on #evin .pnr.one .pnr-main{flex:0 1 auto}
</style>`);
// =====================================================================
// PC, Settings > Patch notes, as a reader (director, 2026-11-17: "way too hard to read"): every update listed on the left
// (newest first, gift notes on top), the chosen one on the right in section boxes at normal size. The tab fills the page and
// scrolls inside itself, so the page no longer shrinks to fit 40 updates. Phones keep their list.
// =====================================================================
{ let pick=null; const _rs=renderSettings;
  const listAll=()=>(S.owned.pets.includes('lily')?[LILY_PATCH]:[]).concat(S.owned.pets.includes('daxniko')?[PAIR_PATCH]:[]).concat(PATCHES);
  const body=p=>{ const d=document.createElement('div'); d.innerHTML=patchHTML(p); const g=d.querySelector('.pn-grid'); if(g){ g.classList.add('pnr-grid'); [...g.children].filter(s=>s.querySelectorAll('li').length>5).forEach(s=>{ s.classList.add('wide'); g.appendChild(s); }); } return d.innerHTML; };
  renderSettings=function(P){ _rs(P); if(!document.body.classList.contains('pch-on')) return; try{
    const tile=[...P.querySelectorAll('.tile')].find(t=>/^Patch notes/.test((t.querySelector('h4')||{}).textContent||'')); if(!tile) return;
    const all=listAll(); if(!pick||!all.some(p=>p.v===pick)) pick=PATCHES[0].v;
    tile.classList.add('pc-pn'); tile.innerHTML=`<h4 class="pcpn-h">Patch notes</h4><div class="pcpn-rail"><div class="meta">You’re on Driftline ${esc(GAME_VERSION)}</div>${all.map(p=>`<button type="button" class="pnr-it" data-v="${esc(p.v)}" aria-pressed="${p.v===pick}"><span class="pnr-v">${p.label?esc(p.label):'Update '+esc(p.v)}</span><b>${esc(p.name)}</b>${p===PATCHES[0]?'<span class="pnr-new">Latest</span>':''}</button>`).join('')}</div><article class="pcpn-body"></article>`;
    const art=tile.querySelector('.pcpn-body'); const show=v=>{ const p=all.find(x=>x.v===v)||PATCHES[0]; pick=p.v; art.innerHTML=body(p); art.scrollTop=0; tile.querySelectorAll('.pnr-it').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.v===pick))); };
    tile.querySelectorAll('.pnr-it').forEach(b=>b.addEventListener('click',e=>{ e.stopPropagation(); show(b.dataset.v); }));
    show(pick); }catch(e){ console.error(e); } }; }
document.head.insertAdjacentHTML('beforeend',`<style>
body.pch-on #panel .tile.pc-pn{display:grid!important;grid-template-columns:260px minmax(0,1fr);gap:0;padding:0!important;height:calc(100vh - 226px);min-height:420px;overflow:hidden}
body.pch-on #panel .pc-pn .pcpn-rail{display:flex;flex-direction:column;gap:3px;padding:12px;border-right:1px solid #ffffff14;overflow:auto;min-height:0;scrollbar-width:thin}
body.pch-on #panel .pc-pn .pcpn-rail > .meta{margin:0 4px 8px}
body.pch-on #panel .pc-pn .pnr-it{display:grid;grid-template-columns:minmax(0,1fr) auto;row-gap:2px;align-items:center;text-align:left;padding:8px 11px;border-radius:10px;border:1px solid transparent;background:none;color:#cfdcea;cursor:pointer;font:inherit;flex:0 0 auto}
body.pch-on #panel .pc-pn .pnr-it:hover{background:#ffffff0b}
body.pch-on #panel .pc-pn .pnr-it[aria-pressed="true"]{background:#1d3150;border-color:#7fb8ff55;color:#fff;box-shadow:inset 3px 0 0 #7fb8ff}
body.pch-on #panel .pc-pn .pnr-v{grid-column:1;font:800 10.5px var(--display,system-ui);letter-spacing:.07em;text-transform:uppercase;color:var(--gold,#ffd36a)}
body.pch-on #panel .pc-pn .pnr-it b{grid-column:1;font-size:14px;font-weight:800;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
body.pch-on #panel .pc-pn .pnr-new{grid-column:2;grid-row:1 / 3;font-size:10px;font-weight:800;padding:2px 7px;border-radius:999px;background:#7fe3c422;color:#7fe3c4}
body.pch-on #panel .pc-pn .pcpn-body{overflow:auto;min-height:0;padding:16px 22px 20px;scrollbar-width:thin}
body.pch-on #panel .pc-pn .pn-head{text-align:left;margin:0 0 12px}
body.pch-on #panel .pc-pn .pn-head h3{font-size:22px;margin:2px 0 0}
body.pch-on #panel .pc-pn .pnr-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:14px;align-items:stretch}
body.pch-on #panel .pc-pn .pn-sec{background:#0e1a2c;border:1px solid #ffffff14;border-radius:14px;padding:12px 14px 10px}
body.pch-on #panel .pc-pn .pn-sec h4{margin:0 0 6px;font:800 12.5px var(--display,system-ui);letter-spacing:.07em;text-transform:uppercase;color:var(--gold,#ffd36a)}
body.pch-on #panel .pc-pn .pn-sec ul{margin:0;padding-left:18px}
body.pch-on #panel .pc-pn .pn-sec li{font-size:14.5px;line-height:1.55;color:#dbe6f2;margin:0 0 6px;break-inside:avoid}
body.pch-on #panel .pc-pn .pn-sec.wide{grid-column:1 / -1}
body.pch-on #panel .pc-pn .pn-sec.wide ul{columns:2 320px;column-gap:30px}
body.pch-on #panel .pc-pn .pn-sec:only-child ul{columns:2 320px;column-gap:30px}
</style>`);
document.head.insertAdjacentHTML('beforeend',`<style>body.pch-on #panel .pc-pn .pcpn-h{display:none}</style>`);
document.head.insertAdjacentHTML('beforeend',`<style>
/* PC: the goal sits in the strip above the water now: no see-through blur behind it (it cost work every frame for nothing) */
html body.pch-on #pcscene #goalchip{-webkit-backdrop-filter:none!important;backdrop-filter:none!important}
</style>`);
document.head.insertAdjacentHTML('beforeend',`<style>
/* PC: the page tabs' entrance is played by script now (no forced layout), so the class-based copy is switched off */
body.pch-on #menuov.mo-show #tabs .subbar{animation:none!important}
</style>`);
// =====================================================================
// PC full HD (director, 2026-11-17: "give ALL pc menus optimization... save this window size's changes exclusive to this
// resolution"). body.pc-fhd = the PC layout on a screen of at least 1800 x 950 (a 1080p monitor in full screen). Everything
// written for it below is scoped to that class, so laptops, smaller windows and phones keep their own layouts.
// =====================================================================
{ const apply=()=>{ const b=document.body.classList, v=b.contains('pch-on')&&innerWidth>=1800&&innerHeight>=950; if(v!==b.contains('pc-fhd')) b.toggle('pc-fhd',v); };
  addEventListener('resize',()=>setTimeout(apply,40)); new MutationObserver(apply).observe(document.body,{attributes:true,attributeFilter:['class']}); apply(); }
// PC full HD: pages whose sections are small show them all side by side, each under its own heading, instead of one section
// at a time behind tabs (director, 2026-11-17: Skills showed five little cards in a corner of an empty screen).
{ const ALL=new Set(['skills','save']); const _sz=sectionize;
  sectionize=function(P,tab,groups,before){ const gs=(groups||[]).filter(g=>g.nodes.length);
    if(!document.body.classList.contains('pc-fhd')||!ALL.has(tab)||gs.length<2) return _sz.apply(this,arguments);
    const anchor=before||gs[0].nodes[0], mark=document.createComment('fhd'); anchor.parentNode.insertBefore(mark,anchor); /* mark the spot before anything moves */ const board=document.createElement('div'); board.className='fhd-board fhd-'+tab; board.style.setProperty('--n',gs.length);
    for(const g of gs){ const col=document.createElement('section'); col.className='fhd-col';
      const par=g.nodes[0].parentNode, inGrid=par&&par!==P&&par.classList.contains('grid');
      col.innerHTML=`<header class="fhd-h"><span>${esc(g.name)}</span>${g.badge?`<span class="sdot">${g.badge}</span>`:''}</header>`;
      const body=document.createElement('div'); body.className='fhd-body'+(inGrid?' '+[...par.classList].join(' '):''); col.appendChild(body);
      for(const n of g.nodes){ n.style.display=''; body.appendChild(n); } board.appendChild(col); }
    mark.parentNode?mark.parentNode.replaceChild(board,mark):P.appendChild(board);
    // a grid left empty by the move goes away
    P.querySelectorAll(':scope > .grid').forEach(gr=>{ if(!gr.children.length) gr.remove(); }); }; }
document.head.insertAdjacentHTML('beforeend',`<style>
body.pc-fhd #panel .fhd-board{display:grid;grid-template-columns:repeat(var(--n),minmax(0,1fr));gap:16px;align-items:start;margin-top:8px}
body.pc-fhd #panel .fhd-col{display:flex;flex-direction:column;gap:10px;min-width:0}
body.pc-fhd #panel .fhd-h{display:flex;align-items:center;gap:8px;padding:0 4px 6px;border-bottom:1px solid #ffffff1c;font:800 13px var(--display,system-ui);letter-spacing:.08em;text-transform:uppercase;color:#cfe0f2}
body.pc-fhd #panel .fhd-body{display:flex!important;flex-direction:column!important;gap:10px!important;margin:0!important;grid-template-columns:none!important}
body.pc-fhd #panel .fhd-body > *{width:auto!important;margin:0!important}
</style>`);
document.head.insertAdjacentHTML('beforeend',`<style>
/* full HD Feats reader */
body.pc-fhd #panel .featrd{display:grid;grid-template-columns:270px minmax(0,1fr);gap:22px;align-items:start;margin-top:6px}
body.pc-fhd #panel .fr-rail{display:flex;flex-direction:column;gap:4px;padding:12px;border-radius:16px;background:#0c1626;border:1px solid #ffffff12}
body.pc-fhd #panel .fr-total{padding:4px 8px 12px;margin-bottom:4px;border-bottom:1px solid #ffffff14;font-size:13px;color:#9fb2c8;display:grid;gap:6px}
body.pc-fhd #panel .fr-total b{font:800 20px var(--display,system-ui);color:#fff}
body.pc-fhd #panel .fr-cat{display:grid;grid-template-columns:minmax(0,1fr) auto;row-gap:6px;align-items:center;text-align:left;padding:9px 12px 10px;border-radius:11px;border:1px solid transparent;background:none;color:#dbe6f2;cursor:pointer;font:700 14px var(--display,system-ui)}
body.pc-fhd #panel .fr-cat:hover{background:#ffffff0b}
body.pc-fhd #panel .fr-cat[aria-pressed="true"]{background:#1d3150;border-color:#7fb8ff55;color:#fff;box-shadow:inset 3px 0 0 #7fb8ff}
body.pc-fhd #panel .fr-cat .fr-bar{grid-column:1 / -1}
body.pc-fhd #panel .fr-n{font:700 12.5px var(--display,system-ui);color:#9fb2c8;letter-spacing:0;text-transform:none}
body.pc-fhd #panel .fr-bar{display:block;height:5px;border-radius:5px;background:#ffffff14;overflow:hidden}
body.pc-fhd #panel .fr-bar b{display:block;height:100%;border-radius:5px;background:linear-gradient(90deg,#7fe3c4,#ffd36a)}
body.pc-fhd #panel .fr-main h3{margin:2px 2px 14px;font:800 22px var(--display,system-ui);color:#fff;display:flex;align-items:baseline;gap:12px}
body.pc-fhd #panel .fr-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:14px}
body.pc-fhd #panel .fr-card{display:flex;flex-direction:column;gap:8px;padding:14px 16px;border-radius:14px;background:#0e1a2c;border:1px solid #ffffff14}
body.pc-fhd #panel .fr-card header{display:flex;justify-content:space-between;align-items:baseline;gap:10px}
body.pc-fhd #panel .fr-card header b{font:800 16px var(--display,system-ui);color:#fff}
body.pc-fhd #panel .fr-card .fr-cnt{font:800 13px var(--display,system-ui);color:#cfe0f2;white-space:nowrap}
body.pc-fhd #panel .fr-card p{margin:0;font-size:13.5px;line-height:1.45;color:#a9bccf;flex:1}
body.pc-fhd #panel .fr-card .fr-bar{height:7px}
body.pc-fhd #panel .fr-card .fr-rew{font-size:13px;color:#dbe6f2}
body.pc-fhd #panel .fr-card.done{opacity:.6}
body.pc-fhd #panel .fr-card.done header b{color:#7fe3c4}
body.pc-fhd #panel .fr-card.done .fr-bar b{background:#7fe3c4}
</style>`);
// full HD Rods: "Your rod" and its attachments side by side on one tab (they belong together), the rod rack on the other
{ const _sz=sectionize;
  sectionize=function(P,tab,groups,before){ if(tab!=='rods'||!document.body.classList.contains('pc-fhd')) return _sz.apply(this,arguments);
    const gs=(groups||[]).filter(g=>g.nodes.length), you=gs.find(g=>/Your rod/i.test(g.name)), att=gs.find(g=>/Attach/i.test(g.name)), rest=gs.filter(g=>g!==you&&g!==att);
    if(!you||!att) return _sz.apply(this,arguments);
    const anchor=before||you.nodes[0], mark=document.createComment('fhd'); anchor.parentNode.insertBefore(mark,anchor);
    const pair=document.createElement('div'); pair.className='fhd-rodpair';
    const mk=(g,cls)=>{ const col=document.createElement('section'); col.className='fhd-col '+cls; col.innerHTML=`<header class="fhd-h"><span>${esc(g.name)}</span></header>`; const par=g.nodes[0].parentNode, inGrid=par&&par!==P&&par.classList.contains('grid'); const body=document.createElement('div'); body.className='fhd-body2'+(inGrid?' '+[...par.classList].join(' '):''); for(const n of g.nodes){ n.style.display=''; body.appendChild(n); } col.appendChild(body); return col; };
    pair.append(mk(you,'fhd-you'),mk(att,'fhd-att')); mark.parentNode.replaceChild(pair,mark);
    P.querySelectorAll(':scope > .grid').forEach(gr=>{ if(!gr.children.length) gr.remove(); });
    return _sz.call(this,P,tab,[{name:you.name,nodes:[pair]}].concat(rest),pair); }; }
document.head.insertAdjacentHTML('beforeend',`<style>
body.pc-fhd #panel .fhd-rodpair{display:grid;grid-template-columns:minmax(0,.9fr) minmax(0,1.5fr);gap:18px;align-items:start}
body.pc-fhd #panel .fhd-rodpair .fhd-body2{margin:0!important}
body.pc-fhd #panel .fhd-rodpair .fhd-att .fhd-body2{display:block!important}
body.pc-fhd #panel .fhd-rodpair .fhd-att .fhd-body2 .grid{grid-template-columns:repeat(3,minmax(0,1fr))!important;gap:10px!important}
body.pc-fhd #panel .fhd-rodpair .fhd-att .fhd-body2 > h2,body.pc-fhd #panel .fhd-rodpair .fhd-att .fhd-body2 > h3{display:none}
body.pc-fhd #panel .fhd-rodpair .fhd-you .fhd-body2{display:flex!important;flex-direction:column;gap:10px}
</style>`);
document.head.insertAdjacentHTML('beforeend',`<style>
/* full HD Wardrobe: a bigger character on the left, the options flowing in three columns instead of short rows down one side */
body.pc-fhd #menuov #panel .stylewrap.wd{grid-template-columns:minmax(420px,32%) minmax(0,1fr)!important;column-gap:28px!important;align-items:start}
body.pc-fhd #menuov #panel .stylewrap.wd .wd-prev{width:100%!important;max-width:none!important;height:auto!important;max-height:none!important;aspect-ratio:auto}
body.pc-fhd #menuov #panel .stylewrap.wd .wd-prev canvas{width:100%!important;height:auto!important}
body.pc-fhd #menuov #panel .stylewrap.wd .wd-main{columns:3 320px;column-gap:30px;display:block!important}
body.pc-fhd #menuov #panel .stylewrap.wd .wd-main > *{break-inside:avoid}
body.pc-fhd #menuov #panel .stylewrap.wd .wd-main > h5{break-after:avoid;margin-top:14px}
body.pc-fhd #menuov #panel .stylewrap.wd .wd-main > h5:first-child{margin-top:0}
</style>`);
// full HD Tackle > Gear: the six upgrades in two rows of three, so the cards are wide and readable instead of one thin strip
{ const _rp=renderPanel; renderPanel=function(){ const r=_rp.apply(this,arguments); try{ if(S.tab==='shop'&&document.body.classList.contains('pc-fhd')){ const g=$('panel').querySelector(':scope > .grid'); if(g&&g.querySelectorAll(':scope > .tile').length===6) g.classList.add('fhd-gear'); } }catch(e){} return r; }; }
document.head.insertAdjacentHTML('beforeend',`<style>
body.pc-fhd #menuov #panel > .grid.fhd-gear{grid-template-columns:repeat(3,minmax(0,1fr))!important;gap:16px!important}
body.pc-fhd #menuov #panel > .grid.fhd-gear > .tile{padding:16px 18px!important;gap:8px!important}
</style>`);
document.head.insertAdjacentHTML('beforeend',`<style>
/* full HD Cooler (and any fish list): fish as cards in two columns, so name, value and buttons sit together; bigger fish */
body.pc-fhd #menuov #panel .list:has(> .fishrow){display:grid!important;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}
body.pc-fhd #menuov #panel .list > .fishrow{border:1px solid #ffffff14;border-radius:14px;background:#0e1a2c;padding:10px 14px!important;margin:0!important;gap:14px}
body.pc-fhd #menuov #panel .list > .fishrow{grid-template-columns:96px minmax(0,1fr) auto auto!important}
body.pc-fhd #menuov #panel .list > .fishrow canvas{width:96px!important;height:48px!important}
body.pc-fhd #menuov #panel .list > .fishrow .nm b{font-size:16px}
</style>`);
document.head.insertAdjacentHTML('beforeend',`<style>
/* the patch-notes reader stays hidden on the other Settings tabs (its layout rule must not override the tab's "hidden") */
body.pch-on #panel .tile.pc-pn[style*="display: none"],body.pch-on #panel .tile.pc-pn[style*="display:none"]{display:none!important}
</style>`);
// =====================================================================
// PC: every page in exactly one place (director, 2026-11-17: "Settings should just open settings. Why is stats hidden there?
// Clicking aquarium opens the aquarium, why is it also somewhere else?"). Their choices:
// - Cooler, Aquarium and Fish Log open from their header buttons only; they leave the section tabs (Fishing = Waters,
//   Collection = Trophy Room).
// - Stats gets its own header button next to them.
// - The gear opens Settings only; the Save page's content lives in Settings > Save & codes (it duplicated "Move progress").
// - The header buttons have an icon and look like buttons; in the menus they stay in the top row, the open one lit.
// Phones and tablets keep their sections as they are.
// =====================================================================
{ const pc=()=>document.body.classList.contains('pch-on');
  const ORIG=MENU_SECS.map(s=>[s,s.tabs.slice()]), MORE0=MENU_MORE.tabs.slice(), SOLO=['cooler','aquarium','journal','stats'];
  let mode=null; const applyIA=()=>{ const on=pc(); if(on===mode) return; mode=on;
    for(const [s,tabs] of ORIG) s.tabs.splice(0,s.tabs.length,...(on?tabs.filter(t=>!SOLO.includes(t)):tabs));
    MENU_MORE.tabs.splice(0,MENU_MORE.tabs.length,...(on?['settings']:MORE0));
    try{ menuSubKey=''; if(MENU_OPEN) menuSync(); }catch(e){} };
  // a page reached from a header button has no section: its name shows as the one page tab, so the row is never empty
  const _ms=menuSync; menuSync=function(){ _ms.apply(this,arguments); try{ if(!pc()) return; const T=$('tabs'), sb=T&&T.querySelector('.subbar'); if(!sb) return;
      if((!menuSecOf(S.tab)&&S.tab!==DASH)||(menuSecOf(S.tab)||{}).id==='more'){ menuSubKey='solo|'+S.tab; sb.innerHTML=''; sb.hidden=true; } /* the lit header button (or the lit gear) already says where you are */
      document.querySelectorAll('.pch-stats > .stat').forEach(b=>b.classList.toggle('on',MENU_OPEN&&b.dataset.page===S.tab)); }catch(e){} };
  // header buttons: icon + label + value, the look of a button; Stats joins them
  const ICON={cooler:'<path d="M4 9h16v10a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 4 19z"/><path d="M3 9l1.6-4h14.8L21 9"/><path d="M10 13h4"/>',
    aquarium:'<rect x="3" y="4.5" width="18" height="15" rx="2.5"/><path d="M7 12.5c1.6-2 4.2-2.4 6-.5l1.6-1.2v3.4L13 13c-1.8 1.9-4.4 1.5-6-.5z"/><path d="M3 17c3 .7 5 .7 9 0s6-.7 9 0"/>',
    journal:'<path d="M5 4.5h10.5A3.5 3.5 0 0 1 19 8v11.5H8.5A3.5 3.5 0 0 1 5 16z"/><path d="M5 16a3 3 0 0 1 3-3h11"/><path d="M9 8h6"/>',
    stats:'<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>'};
  const svg=k=>`<svg class="pcs-ic" viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICON[k]}</svg>`;
  let statsBtn=null; const decorate=()=>{ const box=document.querySelector('.pch-stats'); if(!box) return false;
    const map=[[$('coolerct')&&$('coolerct').closest('.stat'),'cooler'],[document.querySelector('.stat.st-aq'),'aquarium'],[document.querySelector('.stat.st-log'),'journal']];
    for(const [el,k] of map){ if(!el||el.dataset.page) continue; el.dataset.page=k; el.insertAdjacentHTML('afterbegin',svg(k)); }
    if(!statsBtn){ statsBtn=document.createElement('div'); statsBtn.className='stat st-stats hudx hud-link'; statsBtn.dataset.page='stats'; statsBtn.setAttribute('role','button'); statsBtn.tabIndex=0; statsBtn.title='Stats: your total sale multiplier and everything else that shapes your fishing (click to open)';
      statsBtn.innerHTML=svg('stats')+'<span class="lbl">Stats</span><b class="pcs-sv"></b>';
      const go=e=>{ e.preventDefault(); e.stopPropagation(); try{ startAudio(); }catch(er){} openMenu('stats'); };
      ['pointerdown','mousedown'].forEach(ev=>statsBtn.addEventListener(ev,e=>e.stopPropagation(),{passive:true}));
      statsBtn.addEventListener('click',go); statsBtn.addEventListener('keydown',e=>{ if(e.key==='Enter'||e.key===' ') go(e); }); }
    if(statsBtn.parentElement!==box) box.appendChild(statsBtn); return true; };
  const tick=()=>{ try{ if(statsBtn){ const v=hdrStatText(); /* the stat picked on the Stats page (sale price by default) */ const b=statsBtn.querySelector('.pcs-sv'); if(b.textContent!==v) b.textContent=v; } }catch(e){} };
  setInterval(tick,1500);
  // in the menus the same buttons stay in the top row (the header itself is covered by the menu)
  const place=()=>{ const box=document.querySelector('.pch-stats'), tools=document.querySelector('#menuov .mo-tools'), ph=document.querySelector('#pchead .pch-tools'); if(!box||!tools||!ph) return;
    const inMenu=false; /* the header stays visible in menus now, with its buttons in place */ if(inMenu&&box.parentElement!==tools) tools.insertBefore(box,tools.querySelector('.mo-coin')||tools.firstChild); else if(!inMenu&&box.parentElement!==ph) ph.prepend(box); };
  { const _om=openMenu, _cm=closeMenu; openMenu=function(){ const r=_om.apply(this,arguments); try{ place(); }catch(e){} return r; }; closeMenu=function(){ const r=_cm.apply(this,arguments); try{ place(); }catch(e){} return r; }; } // move the buttons at once, not a moment later
  const init=()=>{ applyIA(); decorate(); tick(); place();
    new MutationObserver(()=>{ applyIA(); if(!statsBtn) decorate(); place(); }).observe(document.body,{attributes:true,attributeFilter:['class']}); setTimeout(()=>{ decorate(); place(); },600); };
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',init); else init();
  // Settings > Save & codes on PC: the Save page's content (move progress, your save code, load a code, the app), the gift code
  // and the reset; the duplicate "Move progress" tile goes
  const _rs=renderSettings; renderSettings=function(P){ _rs(P); if(!pc()) return; try{
      const mv=[...P.children].find(c=>c.classList.contains('tile')&&/Move progress/.test(c.textContent)); if(mv) mv.remove();
      const box=document.createElement('div'); box.className='tile pc-save'; const gift=[...P.children].find(c=>c.classList.contains('tile')&&/Gift code/.test(c.textContent));
      P.insertBefore(box,gift||P.querySelector(':scope > details')||null); renderSave(box);
      box.querySelectorAll(':scope > h2, :scope > p.sub').forEach(e=>e.remove()); box.insertAdjacentHTML('afterbegin','<h4>Save and move progress</h4>'); }catch(e){ console.error(e); } }; }
document.head.insertAdjacentHTML('beforeend',`<style>
/* the header buttons: icon, label, value; they look like buttons and light up while their page is open */
html body.pch-on #pchead .pch-stats > .stat,html body.pch-on #menuov .pch-stats > .stat{display:grid!important;height:46px!important;box-sizing:border-box;padding:4px 12px!important;margin:0!important;min-width:0!important;max-width:none!important;flex:0 0 auto!important;border-radius:14px!important;grid-template-columns:auto auto;grid-template-rows:auto auto;column-gap:9px;row-gap:1px;align-items:center;cursor:pointer;border:1px solid #ffffff22!important;background:linear-gradient(180deg,#172a42,#10203a)!important;box-shadow:inset 0 1px 0 #ffffff12,0 2px 6px #0006!important;transition:background .15s,border-color .15s,transform .1s}
html body.pch-on .pch-stats > .stat:hover{border-color:#7fb8ff88!important;background:linear-gradient(180deg,#1c3352,#132744)!important}
html body.pch-on .pch-stats > .stat:active{transform:translateY(1px)}
html body.pch-on .pch-stats > .stat.on{border-color:#ffd36a!important;background:linear-gradient(180deg,#3a3016,#2a230f)!important;box-shadow:inset 0 0 0 1px #ffd36a55!important}
html body.pch-on .pch-stats > .stat:focus-visible{outline:2px solid #ffd36a;outline-offset:2px}
html body.pch-on .pch-stats .pcs-ic{grid-row:1 / 3;color:#9fd0ff}
html body.pch-on .pch-stats > .stat.on .pcs-ic{color:#ffd36a}
html body.pch-on .pch-stats > .stat .lbl{grid-column:2;line-height:1.1}
html body.pch-on .pch-stats > .stat b{grid-column:2;line-height:1.15}
html body.pch-on .pch-stats > .st-stats .pcs-sv{font-size:13px!important;color:#e6eef7}
/* in the menu's top row */
html body.pch-on #menuov .mo-tools > .pch-stats{display:flex;gap:6px;height:46px;margin-right:6px}
/* hide the game header behind an open menu (it was covered anyway, and drawing it cost time) */
html body.pch-on.menu-open #pchead{visibility:hidden}
/* tabs' width now leaves room for four header buttons */
html body.pch-on{--pcTabs:min(700px,calc(100vw - 32px - 190px - 720px - 56px))}
@media (max-width:1580px){
  html body.pch-on{--pcTabs:max(200px,min(700px,calc(100vw - 32px - 190px - 600px - 56px)))}
  html body.pch-on #pchead #catdock .cdl,html body.pch-on #menuov #tabs .secl{display:none!important}
  html body.pch-on .pch-stats > .stat .lbl{display:none!important}
  html body.pch-on .pch-stats > .stat{padding:4px 9px!important}
}
</style>`);
document.head.insertAdjacentHTML('beforeend',`<style>
html body.pch-on .pch-stats > .stat::before{content:none!important;display:none!important}
html body.pch-on #pchead .pch-stats > .stat.on,html body.pch-on #menuov .pch-stats > .stat.on{border-color:#ffd36a!important}
</style>`);
// PC: no name shown twice on one screen (director, 2026-11-17: "stuff is in multiple places")
// - a section tab never repeats its page's name: Waters > "Travel", Dock > "Your dock"
{ const _sz=sectionize; sectionize=function(P,tab,groups,before){ if(document.body.classList.contains('pch-on')&&groups){ const ren={map:{Waters:'Travel'},home:{Dock:'Your dock'}}[tab]; if(ren){ groups=groups.map(g=>ren[g.name]?Object.assign({},g,{name:ren[g.name]}):g); if(SECT[tab]&&ren[SECT[tab]]) SECT[tab]=ren[SECT[tab]]; } } return _sz.call(this,P,tab,groups,before); }; }
// - Feats on full HD: the rail already shows the total and each category's count
{ const _rp=renderPanel; renderPanel=function(){ const r=_rp.apply(this,arguments); try{ if(S.tab==='feats'&&document.body.classList.contains('pc-fhd')){ const P=$('panel'); const sub=P.querySelector(':scope > p.sub, :scope > .row p.sub'); if(sub&&P.querySelector('.featrd')) sub.style.display='none'; } }catch(e){} return r; }; }
document.head.insertAdjacentHTML('beforeend',`<style>
/* - Rods: the "Your rod" tab already names that column */
body.pc-fhd #panel .fhd-rodpair .fhd-you > .fhd-h{display:none}
/* - Trophy Room and Boardwalk: their page tab already carries the name; Boardwalk's wallet repeated your coins */
body.pch-on #panel h2.tp-title{display:none}
body.pch-on #panel .bwx-ht > h2{display:none}
body.pch-on #panel .bwx-wallet > span:has(> b.coin){display:none}
/* - Feats: the category title keeps the name; its count is on the rail */
body.pc-fhd #panel .fr-main h3 .fr-n{display:none}
</style>`);
// PC Settings: the volume sliders and the on/off switches both said "Music" and "Nature sounds"; the switches say what they do
{ const _rs=renderSettings; renderSettings=function(P){ _rs(P); if(!document.body.classList.contains('pch-on')) return; try{ P.querySelectorAll('.toggle b').forEach(b=>{ const t=b.textContent.trim(); if(t==='Music') b.textContent='Play music'; else if(t==='Nature sounds') b.textContent='Play nature sounds'; }); }catch(e){} }; }
document.head.insertAdjacentHTML('beforeend',`<style>
/* narrower PC windows: the right side (four header buttons + tools) must always fit */
@media (max-width:1580px){
  html body.pch-on{--pcTabs:max(180px,min(700px,calc(100vw - 32px - 190px - 690px - 70px)))}
  html body.pch-on #pchead [data-pch="settings"]::after,html body.pch-on #menuov [data-mo="settings"]::after{content:none!important;display:none!important}
  html body.pch-on #pchead [data-pch="settings"],html body.pch-on #menuov [data-mo="settings"]{width:42px!important;min-width:42px!important;padding:0!important;justify-content:center}
  html body.pch-on #pchead .pch-stats > .stat,html body.pch-on #menuov .pch-stats > .stat{padding:4px 9px!important;column-gap:7px}
  html body.pch-on .pch-stats > .stat b{font-size:13px!important}
}
@media (max-width:1200px){
  html body.pch-on .pch-stats > .st-stats .pcs-sv{display:none!important}
  html body.pch-on .pch-stats > .stat .pcs-ic{width:19px;height:19px}
}
</style>`);
document.head.insertAdjacentHTML('beforeend',`<style>
@media (max-width:1100px){
  html body.pch-on{--pcTabs:max(170px,min(700px,calc(100vw - 32px - 150px - 690px - 70px)))}
  html body.pch-on.dl-fish #pchead{grid-template-columns:150px calc(var(--pcTabs) + 14px) minmax(0,1fr) auto!important}
  html body.pch-on #menuov .mo-in{grid-template-columns:150px 0 var(--pcTabs) minmax(0,1fr) auto!important}
  html body.pch-on #menuov .mo-back{font-size:12.5px!important;padding-left:10px!important;padding-right:10px!important;gap:6px!important}
  html body.pch-on #pchead .pch-me > .stat{padding:4px 8px!important}
  html body.pch-on #pchead .pch-me #lvl,html body.pch-on #pchead .pch-me #money{font-size:13.5px!important}
}
</style>`);
document.head.insertAdjacentHTML('beforeend',`<style>@media (max-width:1100px){ html body.pch-on #menuov .mo-back{width:150px!important;min-width:0!important;max-width:150px!important;box-sizing:border-box;white-space:nowrap;overflow:hidden} }</style>`);
document.head.insertAdjacentHTML('beforeend',`<style>
/* very small PC windows: the four header buttons become icons (name and number on hover) so the row always fits */
@media (max-width:980px){
  html body.pch-on .pch-stats > .stat .lbl,html body.pch-on .pch-stats > .stat b{display:none!important}
  html body.pch-on #pchead .pch-stats > .stat,html body.pch-on #menuov .pch-stats > .stat{width:42px;padding:0!important;display:grid!important;place-items:center;grid-template-columns:1fr!important}
  html body.pch-on .pch-stats .pcs-ic{grid-row:auto!important}
  html body.pch-on{--pcTabs:max(170px,min(700px,calc(100vw - 32px - 150px - 420px - 56px)))}
}
</style>`);
document.head.insertAdjacentHTML('beforeend',`<style>@media (max-width:980px){ html body.pch-on #menuov .mo-tools .pc-fsb{display:none!important} }</style>`);
document.head.insertAdjacentHTML('beforeend',`<style>
/* small PC windows: the strip above the water keeps where you fish, the weather and the goal readable */
@media (max-width:980px){ html body.pch-on #pcscene .pcs-streak{display:none!important} html body.pch-on #pcscene > .pcs-wx > .lbl{display:none!important} html body.pch-on #pcscene > .stat.loc > .lbl{display:none!important} }
</style>`);
// =====================================================================
// PC: the menus open below the game header, which never moves (director, 2026-11-17: "when clicking the cooler tab from the
// fishing scene, or other tabs, the fullscreen ui shifts, which isn't correct"). The header's section tabs, its four buttons
// and its tools work in the menus too and light up for what is open; clicking a lit one again closes the menu, so every one
// of them is an obvious on/off toggle. "Back to fishing" leads the second row, beside the page tabs.
// =====================================================================
{ const pc=()=>document.body.classList.contains('pch-on');
  const setTop=()=>{ const ph=document.getElementById('pchead'); if(!ph||!pc()) return; const b=Math.round(ph.getBoundingClientRect().bottom); if(b>0) document.documentElement.style.setProperty('--pcTop',(b+8)+'px'); };
  addEventListener('resize',()=>setTimeout(setTop,60)); new MutationObserver(()=>setTimeout(setTop,0)).observe(document.body,{attributes:true,attributeFilter:['class']}); setTimeout(setTop,300);
  const lit=()=>{ if(!pc()) return; const sec=MENU_OPEN?menuSecOf(S.tab):null;
    document.querySelectorAll('#pchead #catdock .cdb[data-cd]').forEach(b=>{ const on=!!sec&&b.dataset.cd===sec.id; b.classList.toggle('on',on); b.setAttribute('aria-pressed',on); });
    const g=document.querySelector('#pchead [data-pch="settings"]'); if(g) g.classList.toggle('on',MENU_OPEN&&!!sec&&sec.id==='more');
    document.querySelectorAll('.pch-stats > .stat').forEach(b=>b.classList.toggle('on',MENU_OPEN&&b.dataset.page===S.tab)); };
  const _ms=menuSync; menuSync=function(){ _ms.apply(this,arguments); try{ lit(); }catch(e){} };
  const _cm=closeMenu; closeMenu=function(){ const r=_cm.apply(this,arguments); try{ lit(); }catch(e){} return r; };
  // a lit button closes the menu (captured first, so the button's own "open" does not run)
  document.addEventListener('click',e=>{ if(!pc()||!MENU_OPEN) return; const b=e.target.closest&&e.target.closest('#pchead .pch-stats > .stat.on, #pchead #catdock .cdb.on, #pchead [data-pch="settings"].on'); if(!b) return; e.preventDefault(); e.stopImmediatePropagation(); try{ closeMenu(); }catch(er){} },true); }
document.head.insertAdjacentHTML('beforeend',`<style>
html body.pch-on #menuov{top:var(--pcTop,66px)!important;height:calc(100vh - var(--pcTop,66px))!important;height:calc(100dvh - var(--pcTop,66px))!important;background:#0a1220!important}
html body.pch-on.menu-open #pchead{visibility:visible!important}
html body.pch-on #menuov .mo-in{grid-template-columns:auto minmax(0,1fr)!important;grid-template-rows:auto minmax(0,1fr)!important;grid-template-areas:"back sub" "body body"!important;padding-top:0!important;row-gap:8px!important}
html body.pch-on #menuov #tabs .secbar,html body.pch-on #menuov .mo-tools,html body.pch-on #menuov .mo-home{display:none!important}
html body.pch-on #menuov .mo-back{grid-area:back;width:auto!important;max-width:none!important;height:40px;align-self:center}
html body.pch-on #menuov #tabs{grid-area:sub;min-width:0}
html body.pch-on #menuov #tabs .subbar{min-height:40px}
/* lit section tab and gear in the header */
html body.pch-on #pchead #catdock .cdb.on{background:linear-gradient(180deg,#ffe08a,#f3b94e)!important;color:#2a1c05!important;border-color:#ffe6a3!important}
html body.pch-on #pchead #catdock .cdb.on svg{color:#2a1c05!important}
html body.pch-on #pchead [data-pch="settings"].on{background:linear-gradient(180deg,#ffe08a,#f3b94e)!important;color:#2a1c05!important;border-color:#ffe6a3!important}
/* the four header buttons: raised, bright edge, a chevron that turns into a close mark while their page is open */
html body.pch-on #pchead .pch-stats > .stat{grid-template-columns:auto auto 14px!important;background:linear-gradient(180deg,#24456a,#173252)!important;border:1px solid #7fb8ff66!important;box-shadow:inset 0 1px 0 #ffffff26,0 3px 0 #0b1a2e,0 4px 10px #0008!important}
html body.pch-on #pchead .pch-stats > .stat:hover{background:linear-gradient(180deg,#2c5480,#1d3c61)!important;border-color:#a8d2ff!important;box-shadow:inset 0 1px 0 #ffffff33,0 3px 0 #0b1a2e,0 0 0 3px #7fb8ff33,0 4px 12px #000a!important}
html body.pch-on #pchead .pch-stats > .stat:active{transform:translateY(2px);box-shadow:inset 0 1px 0 #ffffff1a,0 1px 0 #0b1a2e!important}
html body.pch-on #pchead .pch-stats > .stat::after{content:"›";grid-column:3;grid-row:1 / 3;font:900 18px/1 system-ui;color:#a8d2ff;justify-self:end;opacity:.85}
html body.pch-on #pchead .pch-stats > .stat.on{background:linear-gradient(180deg,#ffe08a,#f3b94e)!important;border-color:#ffe6a3!important;box-shadow:inset 0 1px 0 #fff6,0 2px 0 #8a5b12,0 0 0 3px #ffd36a44!important}
html body.pch-on #pchead .pch-stats > .stat.on .lbl,html body.pch-on #pchead .pch-stats > .stat.on b,html body.pch-on #pchead .pch-stats > .stat.on .pcs-ic{color:#2a1c05!important}
html body.pch-on #pchead .pch-stats > .stat.on::after{content:"✕";font-size:12px;color:#2a1c05;opacity:1}
@media (max-width:980px){ html body.pch-on #pchead .pch-stats > .stat::after{display:none} }
</style>`);
// =====================================================================
// PC full HD Cooler (director, 2026-11-17: "needs better spaced out UI... utilize space properly, so many empty gaps"):
// your fish fill the main area as cards; one panel on the right holds the cooler's space, what "Sell all" sells, the Sell all
// button and the Fishmonger's request.
// =====================================================================
{ const _rp=renderPanel; renderPanel=function(){ const r=_rp.apply(this,arguments); try{ if(S.tab!=='cooler'||!document.body.classList.contains('pc-fhd')) return r;
      const P=$('panel'), hdr=P.querySelector(':scope > .dl-headw'); if(!hdr||P.querySelector('.fhd-cool')) return r;
      const sub=hdr.querySelector('p.sub'), sellf=hdr.querySelector('.sellf'), btn=hdr.querySelector('[data-act="sellall"]'), demand=P.querySelector(':scope > .tile'), list=P.querySelector(':scope > .list, :scope > .empty');
      const n=S.cooler.length, cap=gv('cooler');
      const wrap=document.createElement('div'); wrap.className='fhd-cool';
      const main=document.createElement('section'); main.className='fc-main'; main.innerHTML=`<h3>Your fish <span class="fc-n">${n} of ${cap}</span></h3>`;
      if(list) main.appendChild(list); if(!n) main.insertAdjacentHTML('beforeend','<div class="fc-empty">Your cooler is empty. Catch something!</div>');
      const side=document.createElement('aside'); side.className='fc-side';
      side.innerHTML=`<div class="fc-cap"><div class="fc-capt"><b>Cooler</b><span>${n} / ${cap}</span></div><i class="fc-bar${n>=cap?' full':''}"><b style="width:${Math.min(100,n/cap*100)}%"></b></i></div>`;
      if(sub){ sub.classList.add('fc-sub'); side.appendChild(sub); }
      if(sellf) side.appendChild(sellf); if(btn){ btn.classList.add('fc-sell'); side.appendChild(btn); }
      if(demand){ demand.removeAttribute('style'); demand.classList.add('fc-demand'); side.appendChild(demand); }
      wrap.append(main,side); hdr.replaceWith(wrap); }catch(e){ console.error(e); } return r; }; }
document.head.insertAdjacentHTML('beforeend',`<style>
body.pc-fhd #panel .fhd-cool{display:grid;grid-template-columns:minmax(0,1fr) 400px;gap:22px;align-items:start;margin-top:4px}
body.pc-fhd #panel .fc-main h3{margin:2px 2px 12px;font:800 20px var(--display,system-ui);color:#fff;display:flex;align-items:baseline;gap:12px}
body.pc-fhd #panel .fc-n{font:700 14px var(--display,system-ui);color:#9fb2c8}
body.pc-fhd #menuov #panel .fhd-cool .list:has(> .fishrow){grid-template-columns:repeat(auto-fill,minmax(440px,1fr))!important;gap:12px!important}
body.pc-fhd #panel .fc-empty{padding:40px;text-align:center;color:#9fb2c8;border:1px dashed #ffffff22;border-radius:16px}
body.pc-fhd #panel .fc-side{position:sticky;top:0;display:flex;flex-direction:column;gap:14px;padding:18px;border-radius:18px;background:#0e1a2c;border:1px solid #ffffff14}
body.pc-fhd #panel .fc-capt{display:flex;justify-content:space-between;align-items:baseline;margin-bottom:8px}
body.pc-fhd #panel .fc-capt b{font:800 20px var(--display,system-ui);color:#fff}
body.pc-fhd #panel .fc-capt span{font:800 16px var(--display,system-ui);color:#cfe0f2}
body.pc-fhd #panel .fc-bar{display:block;height:8px;border-radius:8px;background:#ffffff14;overflow:hidden}
body.pc-fhd #panel .fc-bar b{display:block;height:100%;background:linear-gradient(90deg,#7fe3c4,#ffd36a)}
body.pc-fhd #panel .fc-bar.full b{background:linear-gradient(90deg,#ff8a6a,#ff5468)}
body.pc-fhd #panel .fc-sub{margin:0;font-size:13px;line-height:1.5;color:#a9bccf}
body.pc-fhd #panel .fc-side .sellf{display:flex!important;flex-direction:column!important;gap:10px!important;padding:14px!important;border-radius:14px;background:#0a1424;border:1px solid #ffffff10;margin:0!important;width:auto!important}
body.pc-fhd #panel .fc-side .sellf .fld{display:grid!important;grid-template-columns:110px minmax(0,1fr);align-items:center;gap:10px;width:auto!important;margin:0!important}
body.pc-fhd #panel .fc-side .sellf .fld-title{font:800 12px var(--display,system-ui);letter-spacing:.07em;text-transform:uppercase;color:#cfe0f2}
body.pc-fhd #panel .fc-side .sellf select,body.pc-fhd #panel .fc-side .sellf input{width:100%!important}
body.pc-fhd #panel .fc-side .fc-sell{width:100%;padding:14px!important;font-size:16px!important}
body.pc-fhd #panel .fc-side .fc-demand{margin:0!important;display:grid!important;grid-template-columns:64px minmax(0,1fr);gap:12px;align-items:center;padding:12px!important}
</style>`);
document.head.insertAdjacentHTML('beforeend',`<style>
/* full HD fish cards: picture, name and value on top, the buttons on a row of their own (the name was squeezed to one word per line) */
body.pc-fhd #menuov #panel .list > .fishrow{grid-template-columns:96px minmax(0,1fr) auto!important;grid-template-areas:"pic nm val" "pic acts acts"!important;row-gap:8px!important;align-items:center}
body.pc-fhd #menuov #panel .list > .fishrow > canvas{grid-area:pic}
body.pc-fhd #menuov #panel .list > .fishrow > .nm{grid-area:nm;min-width:0}
body.pc-fhd #menuov #panel .list > .fishrow > .val{grid-area:val;text-align:right}
body.pc-fhd #menuov #panel .list > .fishrow > .acts{grid-area:acts;display:flex!important;gap:8px;justify-content:flex-start}
body.pc-fhd #menuov #panel .list > .fishrow > .acts > *{flex:1 1 0}
</style>`);
// =====================================================================
// PC full HD Aquarium (director, 2026-11-17): "Your tank" and "Decorate" combined on one screen, side by side, each in its own
// box that scrolls by itself (switching tabs changed the page's size, and hid half of what matters); a taller tank; a one-line
// description; the earnings box contained in the header.
// =====================================================================
{ const _sz=sectionize; sectionize=function(P,tab,groups,before){ if(tab!=='aquarium'||!document.body.classList.contains('pc-fhd')) return _sz.apply(this,arguments);
    const gs=(groups||[]).filter(g=>g.nodes.length); if(gs.length<2) return _sz.apply(this,arguments);
    const anchor=before||gs[0].nodes[0], mark=document.createComment('aq'); anchor.parentNode.insertBefore(mark,anchor);
    const split=document.createElement('div'); split.className='aq-split';
    for(const g of gs){ const col=document.createElement('section'); col.className='aq-col'; col.innerHTML=`<header class="fhd-h"><span>${esc(g.name)}</span></header>`; const body=document.createElement('div'); body.className='aq-body'; for(const n of g.nodes){ n.style.display=''; body.appendChild(n); } col.appendChild(body); split.appendChild(col); }
    mark.parentNode.replaceChild(split,mark); P.classList.add('aq-on'); }; }
{ const _rp=renderPanel; renderPanel=function(){ const P=$('panel'); if(P) P.classList.remove('aq-on'); const r=_rp.apply(this,arguments); try{ if(S.tab==='aquarium'&&document.body.classList.contains('pc-fhd')){ const sub=P.querySelector(':scope > .dl-head p.sub'); if(sub){ sub.title=sub.textContent; sub.classList.add('aq-sub'); } } }catch(e){} return r; }; }
document.head.insertAdjacentHTML('beforeend',`<style>
body.pc-fhd #panel.aq-on{display:flex!important;flex-direction:column!important;overflow:hidden!important;gap:8px}
body.pc-fhd #panel.aq-on > *{flex:0 0 auto;margin-top:0!important;margin-bottom:0!important}
body.pc-fhd #panel.aq-on > .aq-split{flex:1 1 0;min-height:0}
body.pc-fhd #panel.aq-on > .dl-head{display:grid!important;grid-template-columns:minmax(0,1fr) auto;align-items:center;gap:20px}
body.pc-fhd #panel .aq-sub{margin:2px 0 0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:100%;cursor:help}
body.pc-fhd #panel.aq-on .bank{display:flex!important;align-items:center;gap:14px;padding:10px 14px!important;border-radius:14px;background:#0e1a2c;border:1px solid #ffffff1c;box-sizing:border-box;max-width:100%;flex-wrap:nowrap}
body.pc-fhd #panel.aq-on .bank > *{min-width:0;flex:0 0 auto}
body.pc-fhd #menuov #panel.aq-on #tankcv{height:36vh!important}
body.pc-fhd #panel.aq-on > p.sub{font-size:12px}
body.pc-fhd #panel .aq-split{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:16px}
body.pc-fhd #panel .aq-col{display:flex;flex-direction:column;min-height:0;border-radius:16px;background:#0c1626;border:1px solid #ffffff14;padding:12px 14px}
body.pc-fhd #panel .aq-col > .fhd-h{flex:0 0 auto;margin-bottom:10px}
body.pc-fhd #panel .aq-body{flex:1 1 0;min-height:0;overflow:auto;scrollbar-width:thin;padding-right:6px;display:flex;flex-direction:column;gap:10px}
body.pc-fhd #menuov #panel .aq-body .list:has(> .fishrow){grid-template-columns:1fr!important;gap:8px!important}
body.pc-fhd #panel .aq-body .jsec{display:block!important;margin:0!important}
</style>`);
document.head.insertAdjacentHTML('beforeend',`<style>
/* the four header buttons: colour says "clickable" (director, 2026-11-17: no shapes, navy on navy blended in): a teal fill with a
   bright edge, brighter on hover, gold while open */
html body.pch-on #pchead .pch-stats > .stat::after{content:none!important;display:none!important}
html body.pch-on #pchead .pch-stats > .stat{grid-template-columns:auto auto!important;background:linear-gradient(180deg,#1f8a86,#14666a)!important;border:1px solid #7fe3c4!important;box-shadow:inset 0 1px 0 #ffffff40,0 3px 0 #0b3a3c,0 4px 10px #0008!important}
html body.pch-on #pchead .pch-stats > .stat .lbl{color:#c8fff0!important}
html body.pch-on #pchead .pch-stats > .stat b{color:#ffffff!important}
html body.pch-on #pchead .pch-stats > .stat .pcs-ic{color:#e6fff8!important}
html body.pch-on #pchead .pch-stats > .stat:hover{background:linear-gradient(180deg,#27a39d,#197a7b)!important;border-color:#b8fff0!important;box-shadow:inset 0 1px 0 #ffffff55,0 3px 0 #0b3a3c,0 0 0 3px #7fe3c440,0 4px 12px #000a!important}
html body.pch-on #pchead .pch-stats > .stat.on{background:linear-gradient(180deg,#ffe08a,#f3b94e)!important;border-color:#ffe6a3!important;box-shadow:inset 0 1px 0 #fff6,0 2px 0 #8a5b12,0 0 0 3px #ffd36a44!important}
html body.pch-on #pchead .pch-stats > .stat.on .lbl,html body.pch-on #pchead .pch-stats > .stat.on b,html body.pch-on #pchead .pch-stats > .stat.on .pcs-ic{color:#2a1c05!important}
</style>`);
document.head.insertAdjacentHTML('beforeend',`<style>
html body.pc-fhd #menuov #panel.aq-on{display:flex!important;flex-direction:column!important;overflow:hidden!important;gap:8px}
html body.pc-fhd #menuov #panel.aq-on > *{flex:0 0 auto}
html body.pc-fhd #menuov #panel.aq-on > .aq-split{flex:1 1 0;min-height:0}
</style>`);
document.head.insertAdjacentHTML('beforeend',`<style>
html body.pc-fhd #menuov #panel .aq-body .list:has(> .fishrow){grid-template-columns:repeat(2,minmax(0,1fr))!important}
html body.pc-fhd #menuov #panel .aq-body .jsec > h2:first-child,html body.pc-fhd #menuov #panel .aq-body .jsec > h3:first-child,html body.pc-fhd #menuov #panel .aq-body .jsec > .row:first-child h2{display:none!important}
</style>`);
document.head.insertAdjacentHTML('beforeend',`<style>html body.pc-fhd #menuov #panel .aq-body .jsec > .row:first-child > :first-child{display:none!important}</style>`);
// =====================================================================
// PC Fish Log, round 2 (director, 2026-11-17): hunting clearer (three slots, a strong glow on hunted fish), a Normal / Shiny
// switch in the details, the Show filter in the fish column's header styled like the rarity row, and the hunt target's
// tooltip in the game's own look.
// =====================================================================
{ let shinyView=false; const _rj=renderJournal;
  renderJournal=function(P){ _rj(P); if(!P.classList.contains('fl-on')) return; try{
      const L=encLoc!=='junk'?LOCS[locIdx(encLoc)]:null;
      // Show filter -> the fish column's header, next to the rarity row
      const show=P.querySelector('.fl-show'), mh=P.querySelector('.fl-mh'); if(show&&mh){ show.previousElementSibling&&show.previousElementSibling.tagName==='H5'&&show.previousElementSibling.remove(); show.classList.add('fl-show2'); mh.appendChild(show); }
      // hunt slots
      const bar=P.querySelector('.fl-right .hunt-bar'); if(bar&&L&&S.unlocked.includes(L.id)){ const hs=huntsAt(L.id);
        const slots=[...Array(HUNT_MAX)].map((_,i)=>{ const id=hs[i], s=id&&SPI[id]; return s?`<button type="button" class="hs-slot on" data-huntsel="${id}" style="--rc:${RAR[s.r].c}"><i></i><span>${esc(huntLabel(s))}</span><em>2× as often</em></button>`:`<div class="hs-slot"><span>Empty slot</span><em>Hover a missing fish and click 🎯</em></div>`; }).join('');
        bar.innerHTML=`<div class="hs-head"><span class="rar">Hunts</span><b>${hs.length} / ${HUNT_MAX}</b><span class="meta">at ${esc(L.name)}</span></div><div class="hs-slots">${slots}</div><div class="meta hs-help">A hunted fish turns up twice as often whenever it can bite. Catching it ends the hunt.</div>`;
        bar.querySelectorAll('[data-huntsel]').forEach(b=>b.onclick=e=>{ e.stopPropagation(); encSel=b.dataset.huntsel; renderPanel(); }); }
      // themed tooltips on the hunt targets
      P.querySelectorAll('.fl-main .hunt-t').forEach(t=>{ if(t.title){ t.dataset.tip=t.title; t.removeAttribute('title'); } });
      // Normal / Shiny in the details
      const det=P.querySelector('.fl-right .tile.detail'), sel=encSel&&SPI[encSel];
      if(det&&sel){ const caught=!!S.journal[sel.id], cv=det.querySelector('canvas[data-fish]');
        const sw=document.createElement('div'); sw.className='fl-shsw'; sw.innerHTML=`<button type="button" data-v="0" aria-pressed="${!shinyView}">Normal</button><button type="button" data-v="1" aria-pressed="${shinyView}" ${caught?'':'disabled title="Catch it first"'}>✦ Shiny</button>`;
        if(cv){ cv.after(sw); if(caught){ cv.dataset.sh=shinyView?'1':'0'; paintFish(det); } }
        sw.querySelectorAll('button').forEach(b=>b.addEventListener('click',e=>{ e.stopPropagation(); if(b.disabled) return; shinyView=b.dataset.v==='1'; sw.querySelectorAll('button').forEach(x=>x.setAttribute('aria-pressed',String(x===b))); if(cv){ cv.dataset.sh=shinyView?'1':'0'; paintFish(det); } })); }
    }catch(e){ console.error(e); } }; }
document.head.insertAdjacentHTML('beforeend',`<style>
/* Show filter as a segmented row in the header */
body.pch-on #panel .fl-mh .fl-show2{display:flex!important;flex-direction:row!important;flex-wrap:wrap;gap:6px;margin:2px 0 0!important}
body.pch-on #panel .fl-mh .fl-show2 .chipb{width:auto!important;padding:5px 12px!important;border-radius:999px!important;font-size:12.5px!important}
body.pch-on #panel .fl-mh .fl-show2 .chipb[aria-pressed="true"]{background:#1d3150!important;border-color:#7fb8ff!important;color:#fff!important}
/* hunt slots */
body.pch-on #panel .fl-right .hunt-bar{display:flex;flex-direction:column;gap:10px;padding:14px!important}
body.pch-on #panel .hs-head{display:flex;align-items:baseline;gap:10px}
body.pch-on #panel .hs-head .rar{color:#ffb36a}
body.pch-on #panel .hs-head b{font:800 18px var(--display,system-ui);color:#ffe2c4}
body.pch-on #panel .hs-slots{display:grid;gap:8px}
body.pch-on #panel .hs-slot{display:grid;grid-template-columns:12px minmax(0,1fr) auto;align-items:center;gap:10px;padding:10px 12px;border-radius:12px;border:1px dashed #ffffff26;background:#0a1424;color:#8ea4b9;font:700 13px var(--display,system-ui);text-align:left}
body.pch-on #panel .hs-slot:not(.on){grid-template-columns:minmax(0,1fr)}
body.pch-on #panel .hs-slot em{font-style:normal;font-size:11.5px;font-weight:600;color:#6f859b}
body.pch-on #panel .hs-slot.on{border:1px solid #ffb36a;background:linear-gradient(180deg,#3a2410,#26180a);color:#ffe2c4;cursor:pointer;box-shadow:0 0 14px #ffb36a33}
body.pch-on #panel .hs-slot.on i{width:10px;height:10px;border-radius:50%;background:var(--rc)}
body.pch-on #panel .hs-slot.on em{color:#ffb36a}
body.pch-on #panel .hs-help{font-size:12px!important}
/* hunted fish stand out in the grid */
body.pch-on #panel .fl-main .jcard.hunted{border-color:#ffb36a!important;box-shadow:0 0 0 2px #ffb36a,0 0 22px #ffb36a66!important;background:linear-gradient(180deg,#2a1c10,#141d2c)!important}
body.pch-on #panel .fl-main .jcard .hunt-tag{background:#ffb36a;color:#2a1406;font-size:9px;top:auto;bottom:-1px;left:50%;transform:translateX(-50%);border-radius:6px 6px 0 0;padding:1px 8px}
/* the hunt target's tooltip in the game's look */
body.pch-on #panel .fl-main .hunt-t[data-tip]:hover::after{content:attr(data-tip);position:absolute;right:-6px;top:30px;z-index:20;width:190px;padding:8px 10px;border-radius:10px;background:#0b1626;border:1px solid #ffb36a;color:#ffe2c4;font:700 12px/1.35 var(--display,system-ui);text-align:left;box-shadow:0 8px 20px #000a;pointer-events:none;white-space:normal}
/* Normal / Shiny switch */
body.pch-on #panel .fl-shsw{display:flex;gap:0;align-self:center;border:1px solid #ffffff22;border-radius:999px;overflow:hidden;margin:2px 0 4px}
body.pch-on #panel .fl-shsw button{padding:6px 16px;background:#0a1424;color:#cfdcea;border:0;font:800 12.5px var(--display,system-ui);cursor:pointer}
body.pch-on #panel .fl-shsw button[aria-pressed="true"]{background:#1d3150;color:#fff}
body.pch-on #panel .fl-shsw button[data-v="1"][aria-pressed="true"]{background:linear-gradient(180deg,#ffe08a,#f3b94e);color:#2a1c05}
body.pch-on #panel .fl-shsw button:disabled{opacity:.45;cursor:not-allowed}
</style>`);
// =====================================================================
// PC: Oddities as their own page in Collection (director, 2026-11-17: "needs its own location in the collection category, and
// needs to take parts of the successful parts of the fish log for motivation"). Fish Log style: the four tiers on the left
// with their progress, every oddity in the middle, the picked one's story and reward on the right; the top shows how many pets
// and hats still hide in oddities. An unfound oddity shows what kind of reward it hides, never what it is.
// On phones Oddities stay inside the Fish Log, as before.
// =====================================================================
{ const T=$('tabs'), after=T&&T.querySelector(':scope > [data-tab="trophy"]'); if(after&&!T.querySelector(':scope > [data-tab="oddities"]')) after.insertAdjacentHTML('afterend','<button role="tab" data-tab="oddities" aria-selected="false" data-label="🧸 Oddities">🧸 Oddities</button>');
  const pc=()=>document.body.classList.contains('pch-on');
  const sync=()=>{ const c=MENU_SECS.find(s=>s.id==='coll'); if(!c) return; const has=c.tabs.includes('oddities'); if(pc()&&!has) c.tabs.push('oddities'); else if(!pc()&&has) c.tabs.splice(c.tabs.indexOf('oddities'),1); try{ menuSubKey=''; if(MENU_OPEN) menuSync(); }catch(e){} };
  new MutationObserver(sync).observe(document.body,{attributes:true,attributeFilter:['class']}); setTimeout(sync,0); setTimeout(sync,800);
  try{ PAGE_DESC.oddities='Everything you fished up that isn’t a fish'; }catch(e){}
  const TIERS=['Junk','Odd junk','Rare find','Treasure'];
  const REWARD=e=>e.pet?['A new pet','pet']:e.hat?['A hat','hat']:e.rod?['A rod','rod']:e.lure?['Special lures','lure']:e.scales?['Scales','scales']:e.special?['Something special','special']:e.buff?['A boost','buff']:['Coins','coins'];
  let tier='all', sel=null;
  const render=P=>{ P.style.zoom=''; const items=JUNK.map(J=>({id:J.id,name:J.name,t:J.t,e:J.e||{},q:J.q||'',n:S.junk[J.id]||0}));
    const found=items.filter(x=>x.n).length, pets=items.filter(x=>x.e.pet), hats=items.filter(x=>x.e.hat);
    const tiers=TIERS.map((nm,i)=>{ const l=items.filter(x=>x.t===i); return {i,nm,l,f:l.filter(x=>x.n).length}; });
    const shown=tier==='all'?items:items.filter(x=>x.t===+tier);
    if(!sel||!items.some(x=>x.id===sel)) sel=null;
    const it=sel&&items.find(x=>x.id===sel);
    P.innerHTML=`<h2 class="dl-dup" hidden>Oddities</h2>
    <div class="od-top"><div class="od-count"><b>${found}</b> of ${items.length} oddities found<i class="od-bar"><b style="width:${found/items.length*100}%"></b></i></div>
      <div class="od-hint"><span>🐾 Pets hiding in oddities: <b>${pets.filter(x=>x.n).length} / ${pets.length}</b> found</span><span>🎩 Hats: <b>${hats.filter(x=>x.n).length} / ${hats.length}</b></span></div></div>
    <div class="od-pc"><aside class="od-side"><h5>Tiers</h5>
      <button type="button" class="fl-w" data-odt="all" aria-pressed="${tier==='all'}"><span class="fl-wn">All oddities</span><span class="fl-wc">${found} / ${items.length}</span><span class="fl-wb"><i style="width:${found/items.length*100}%"></i></span></button>
      ${tiers.map(t=>`<button type="button" class="fl-w${t.f===t.l.length?' done':''}" data-odt="${t.i}" aria-pressed="${String(tier)===String(t.i)}"><span class="fl-wn">${t.nm}</span><span class="fl-wc">${t.f} / ${t.l.length}</span><span class="fl-wb"><i style="width:${t.f/t.l.length*100}%"></i></span></button>`).join('')}
      <p class="od-note">Oddities come up now and then while you fish, at every water. The rarer the tier, the rarer the find.</p></aside>
    <section class="od-main"><div class="od-grid">${shown.map(x=>`<button type="button" class="od-card t${x.t}${x.n?'':' unk'}${x.id===sel?' sel':''}" data-odk="${x.id}" title="${x.n?esc(x.name):'Not found yet'} · ${TIERS[x.t]}"><canvas width="160" height="90" data-junk="${x.id}" data-known="${x.n?1:0}"></canvas><b>${x.n?esc(x.name):'???'}</b><small>${x.n?'×'+x.n:'Hides: '+REWARD(x.e)[0].toLowerCase()}</small></button>`).join('')}</div></section>
    <aside class="od-right">${it?`<div class="tile od-det"><canvas width="360" height="200" data-junk="${it.id}" data-known="${it.n?1:0}"></canvas><div class="rar">${TIERS[it.t]}</div><h3>${it.n?esc(it.name):'Not found yet'}</h3>${it.n?`<p class="od-q">${esc(it.q)}</p>`:'<p class="od-q">Keep fishing: it can turn up at any water.</p>'}<div class="kv"><div><span>Reward</span> ${REWARD(it.e)[0]}</div><div><span>Times found</span> ${it.n}</div></div></div>`
      :`<div class="tile fl-pickhint"><b>Click an oddity</b><span class="meta">See what it is, what it gave you and how often you found it. Unfound ones show what kind of reward they hide.</span></div>`}</aside></div>`;
    P.querySelectorAll('canvas[data-junk]').forEach(c=>{ const cx=c.getContext('2d'); cx.clearRect(0,0,c.width,c.height); if(c.dataset.known==='1') drawJunk(cx,c.width,c.height,c.dataset.junk,null); else mysteryThumb(cx,c.width,c.height,c.dataset.junk); });
    P.querySelectorAll('[data-odt]').forEach(b=>b.addEventListener('click',e=>{ e.stopPropagation(); tier=b.dataset.odt; render(P); }));
    P.querySelectorAll('[data-odk]').forEach(b=>b.addEventListener('click',e=>{ e.stopPropagation(); sel=b.dataset.odk===sel?null:b.dataset.odk; render(P); }));
    P.classList.add('od-on'); };
  const _rp=renderPanel; renderPanel=function(){ const P=$('panel'); if(P) P.classList.remove('od-on'); if(S.tab==='oddities'){ render(P); try{ menuSync(); if(P.dataset.tab035!=='oddities'){ P.dataset.tab035='oddities'; pageIn(P); } }catch(e){} return; } return _rp.apply(this,arguments); }; }
document.head.insertAdjacentHTML('beforeend',`<style>
html body.pch-on #menuov #panel.od-on{display:flex!important;flex-direction:column!important;overflow:hidden!important;gap:10px}
html body.pch-on #menuov #panel.od-on > *{flex:0 0 auto}
html body.pch-on #menuov #panel.od-on > .od-pc{flex:1 1 0;min-height:0}
body.pch-on #panel .od-top{display:flex;align-items:center;gap:22px;flex-wrap:wrap}
body.pch-on #panel .od-count{display:flex;align-items:center;gap:12px;font-size:14px;color:#9fb2c8}
body.pch-on #panel .od-count > b{font:800 22px var(--display,system-ui);color:#fff}
body.pch-on #panel .od-bar,body.pch-on #panel .od-pc .fl-wb{display:block;height:5px;border-radius:5px;background:#ffffff14;overflow:hidden}
body.pch-on #panel .od-bar{width:180px}
body.pch-on #panel .od-bar b,body.pch-on #panel .od-pc .fl-wb i{display:block;height:100%;border-radius:5px;background:linear-gradient(90deg,#7fe3c4,#ffd36a)}
body.pch-on #panel .od-hint{display:flex;gap:18px;font-size:13.5px;color:#cfdcea}
body.pch-on #panel .od-hint b{color:#ffd36a}
body.pch-on #panel .od-pc{display:grid;grid-template-columns:230px minmax(0,1fr) 340px;gap:14px;min-height:0}
body.pch-on #panel .od-pc > *{min-height:0;overflow:auto;scrollbar-width:thin}
body.pch-on #panel .od-side{display:flex;flex-direction:column;gap:4px}
body.pch-on #panel .od-side h5{margin:2px 2px 6px;font:800 11.5px var(--display,system-ui);letter-spacing:.08em;text-transform:uppercase;color:#8fa6bf}
body.pch-on #panel .od-pc .fl-w{display:grid;grid-template-columns:minmax(0,1fr) auto;row-gap:4px;column-gap:8px;align-items:center;text-align:left;padding:8px 10px 9px;border-radius:10px;border:1px solid transparent;background:#ffffff06;color:#dbe6f2;cursor:pointer;font:700 13.5px var(--display,system-ui)}
body.pch-on #panel .od-pc .fl-w:hover{background:#ffffff10}
body.pch-on #panel .od-pc .fl-w[aria-pressed="true"]{background:#1d3150;border-color:#7fb8ff66;color:#fff;box-shadow:inset 3px 0 0 #7fb8ff}
body.pch-on #panel .od-pc .fl-wc{font-size:12px;color:#9fb2c8}
body.pch-on #panel .od-pc .fl-w.done .fl-wc{color:#7fe3c4}
body.pch-on #panel .od-pc .fl-wb{grid-column:1 / -1}
body.pch-on #panel .od-note{margin:12px 4px 0;font-size:12px;line-height:1.5;color:#8ea4b9}
body.pch-on #panel .od-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(118px,1fr));gap:8px}
body.pch-on #panel .od-card{position:relative;display:flex;flex-direction:column;align-items:center;gap:2px;padding:8px 6px;border-radius:12px;border:1px solid #ffffff14;background:#0e1a2c;color:#dbe6f2;cursor:pointer;min-width:0}
body.pch-on #panel .od-card:hover{border-color:#7fb8ff88}
body.pch-on #panel .od-card.sel{outline:2px solid #ffd36a;outline-offset:-1px}
body.pch-on #panel .od-card canvas{width:100%;height:auto;max-height:54px;object-fit:contain}
body.pch-on #panel .od-card b{font-size:12.5px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:100%}
body.pch-on #panel .od-card small{font-size:11px;color:#9fb2c8;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:100%}
body.pch-on #panel .od-card.unk b{color:#7f93a8}
body.pch-on #panel .od-card.t1{box-shadow:inset 0 3px 0 #8fd0ff99}
body.pch-on #panel .od-card.t2{box-shadow:inset 0 3px 0 #c79bffaa}
body.pch-on #panel .od-card.t3{box-shadow:inset 0 3px 0 #ffd36acc}
body.pch-on #panel .od-det{display:flex;flex-direction:column;gap:8px;padding:14px!important}
body.pch-on #panel .od-det canvas{width:100%;height:auto}
body.pch-on #panel .od-det h3{margin:0;font:800 20px var(--display,system-ui);color:#fff}
body.pch-on #panel .od-det .rar{color:var(--gold,#ffd36a)}
body.pch-on #panel .od-q{margin:0;font-size:13.5px;line-height:1.5;color:#cfdcea;font-style:italic}
body.pch-on #panel .od-det .kv{display:grid;grid-template-columns:1fr 1fr;gap:6px 12px;font-size:13px}
/* the Fish Log's water list no longer carries Oddities on PC: they have their own page */
body.pch-on #panel .fl-w[data-k="junk"]{display:none!important}
body.pch-on #panel .fl-mh .ctl-l{display:none!important}
</style>`);
// =====================================================================
// Full-HD PC: Stats on one screen (director, 2026-11-17: "Stats takes up so much space and looks un even. Shoot for a combined
// full screen containing all current 3 tabs"). Four even columns: Catching + Fighting | Coins & XP + Right now + Time played |
// where every bonus comes from | your gear. Every column ends at the same line. Other sizes keep the three tabs.
// =====================================================================
{ const _rs=renderStats;
  renderStats=function(P){ if(!document.body.classList.contains('pc-fhd')){ P.classList.remove('st-on'); return _rs(P); }
    const keep=statSec, H={}; for(const k of ['overview','bonuses','gear']){ statSec=k; H[k]=statsHTML(); } statSec=keep;
    const tmp=document.createElement('div'), tiles=k=>{ tmp.innerHTML=H[k]; return [...tmp.querySelectorAll('.tile')].map(t=>t.outerHTML); };
    const ov=tiles('overview'); // [Time played, Catching, Fighting, Coins & XP, Right now]
    const gear=tiles('gear');
    tmp.innerHTML=H.bonuses; const tbl=tmp.querySelector('.st-table-wrap');
    P.innerHTML=`<h2 class="dl-dup" hidden>Stats</h2><div class="st-all">
      <div class="st-col">${ov[1]||''}${ov[2]||''}</div>
      <div class="st-col">${ov[3]||''}${ov[4]||''}${ov[0]||''}</div>
      <div class="st-col"><div class="tile st-bon"><h4>Where your bonuses come from</h4><p class="meta">Boosts: timed buffs from oddities and tasks. Aquarium: the fish on display. Pets: favourite and companion. Rod: its level and attachments.</p>${tbl?tbl.outerHTML:''}</div></div>
      <div class="st-col">${gear.join('')}${window.DL_PREVIEW?testerHTML():''}</div></div>`;
    P.classList.add('st-on'); };
  const _rp=renderPanel; renderPanel=function(){ const P=$('panel'); if(P&&S.tab!=='stats') P.classList.remove('st-on'); return _rp.apply(this,arguments); }; }
document.head.insertAdjacentHTML('beforeend',`<style>
body.pc-fhd #panel.st-on .st-all{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr) minmax(0,1.45fr) minmax(0,1fr);gap:14px;align-items:stretch}
body.pc-fhd #panel.st-on .st-col{display:flex;flex-direction:column;gap:14px;min-width:0}
body.pc-fhd #panel.st-on .st-col > .tile{margin:0!important;padding:14px 16px!important}
body.pc-fhd #panel.st-on .st-col > .tile:last-child{flex:1 1 auto}
body.pc-fhd #panel.st-on .tile h4{margin:0 0 6px;font:800 13px var(--display,system-ui);letter-spacing:.07em;text-transform:uppercase;color:#ffd36a}
body.pc-fhd #panel.st-on .st-row{padding:5px 0;font-size:13.5px}
body.pc-fhd #panel.st-on .st-bon .meta{margin:0 0 8px;font-size:12px;line-height:1.45}
body.pc-fhd #panel.st-on .st-table-wrap{border:0;border-radius:10px}
body.pc-fhd #panel.st-on .st-table{background:transparent;font-size:13px}
body.pc-fhd #panel.st-on .st-table th,body.pc-fhd #panel.st-on .st-table td{padding:7px 5px} body.pc-fhd #panel.st-on .st-table thead th{font-size:10.5px;letter-spacing:.02em} body.pc-fhd #panel.st-on .st-table-wrap{overflow:visible}
body.pc-fhd #panel.st-on .st-test{margin-top:0!important;flex:0 0 auto!important}
</style>`);
