// =====================================================================
// Phones and tablets, round 8: QUESTS (director, 2026-11-18: "goal shouldn't be on the top header ... rework goal into its own side
// panel tab called Quests which should feature objectives, tutorials, and help to the fisher. Organize that part flawlessly, make sure
// there's a lot to learn there, and also direction to find!").
// A side-panel section (first in the list) with one page in four parts:
//  - GOALS: your next goal (what to do, how close you are, a Show me button that takes you there), anything waiting to be claimed,
//    a live event if one is on, and your journey through the waters to Set sail again.
//  - LEARN: short lessons in seven groups, from casting to prestige. Each opens in place, says what it is and how to use it, and has
//    a Take me there button. Lessons you have read get a tick; the strip counts them.
//  - FIND: where everything lives ("Side panel > Upgrades > Rods"), with a filter box and a Go button on every line.
//  - HELP: the questions players ask most, answered plainly, each with the button that fixes it.
// Every number in the lessons comes from the game's own rules (the same text the game uses elsewhere). Android + iPhone + tablets.
// =====================================================================
/* The Quests page itself (lessons, Find, Help, goals, Show me) is shared since PC Reborn: src/cw_pages08.js. What stays here is how phones show it. */
document.head.insertAdjacentHTML('beforeend',`<style>
html body.phone-land #menuov #panel.pg08[data-pg-tab="quests"] .q8-sec > h2,html body.phone-app #menuov #panel.pg08[data-pg-tab="quests"] .q8-sec > h2{display:none!important}
</style>`);
/* line icons for the new pages' tabs at the top of the menu (the theme masks an icon per page; a page without one showed a square) */
{ const ico=d=>'url("data:image/svg+xml,'+encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">'+d+'</svg>')+'")';
  const I8={ bait:'<path d="M12 3v9a4 4 0 1 1-8 0v-1"/><path d="M12 3h3"/><path d="M4 11l-2 2"/><path d="M15 14c2-1 4 0 5 2"/>', quests:'<circle cx="12" cy="12" r="8.5"/><path d="m15.5 8.5-2.2 4.8-4.8 2.2 2.2-4.8z"/>', oddities:'<path d="M8 3h6v8l5 3.5V20H6.5L5 18v-4.5L8 11z"/><path d="M8 7h6M5.5 16h13"/>', prestige:'<circle cx="12" cy="13" r="6.5"/><path d="M9.2 10.6a3.4 3.4 0 0 1 3-1.8"/><path d="M12 3.5v2M6.2 5.6l1.3 1.5M17.8 5.6l-1.3 1.5"/>' };
  document.head.insertAdjacentHTML('beforeend','<style>'+Object.keys(I8).map(k=>`html body.phone-app #menuov .subbar .subp[data-sub="${k}"] .subi,html body.phone-land #menuov .subbar .subp[data-sub="${k}"] .subi{-webkit-mask:${ico(I8[k])} center/contain no-repeat;mask:${ico(I8[k])} center/contain no-repeat}`).join('\n')+'</style>'); }
/* SEARCH (director, 2026-11-18: "the search menu doesn't work properly and is at the top menu of all side panel full UIs. It only needs
   to be at the front of the upper panel"):
   - search lives on the fishing screen's top bar only; the menus' top row no longer repeats it
   - picking a page from the empty-search map now opens it (it only switched the page behind the scenes when no menu was open)
   - the map starts with the Top bar pages (Cooler, Aquarium, Bait, Fish Log, Tasks); results say "Top bar" / "Settings" instead
     of "Menu"; the same result never shows twice */
{ const TOP={cooler:1,aquarium:1,bait:1,journal:1,bounties:1};
  const where=t=>{ if(TOP[t]) return 'Top bar'; try{ const s=menuSecOf(t); if(s) return s.id==='more'?'Settings':s.name; }catch(e){ oops('mobile/quests08:menuSecOf',e); } return t==='settings'||t==='save'?'Settings':''; };
  const _sf=searchFind; searchFind=function(q){ const r=_sf.apply(this,arguments); if(!MOB()) return r; const seen=new Set(); return r.filter(e=>{ const k=e[0]+'|'+e[1]; if(seen.has(k)) return false; seen.add(k); return true; }); };
  const res=$('searchres'), ov=$('searchov');
  if(res&&ov){ new MutationObserver(()=>{ if(!MOB()) return;
      const map=res.querySelector('.sv-map'); if(map&&!map.querySelector('.sv8-top')) map.insertAdjacentHTML('afterbegin',`<div class="sv-sec sv8-top"><div class="sv-sec-h">Top bar</div>${Object.keys(TOP).map(t=>`<button type="button" class="sv-r sv-p" data-tab="${t}"><b>${esc((menuTabLabel(t)||[])[1]||t)}</b><span class="meta">${esc((typeof PAGE_DESC==='object'&&PAGE_DESC[t])||'')}</span></button>`).join('')}</div>`);
      res.querySelectorAll('.sv-r[data-i] .meta').forEach(m=>{ if(m.dataset.sv8) return; m.dataset.sv8='1'; const b=m.closest('.sv-r'), name=(b.querySelector('b')||{}).textContent||''; const e=SEARCH_IDX.find(x=>x[0]===name); if(e){ const w=where(e[1]); if(w) m.textContent=w; } });
    }).observe(res,{childList:true,subtree:true});
    ov.addEventListener('click',e=>{ if(!MOB()) return; const b=e.target.closest('.sv-p'); if(!b) return; e.stopImmediatePropagation(); e.stopPropagation(); ov.hidden=true; try{ if(MENU_OPEN){ setTab(b.dataset.tab); save(); } else openMenu(b.dataset.tab); }catch(er){ try{ openMenu(b.dataset.tab); }catch(e2){ oops('mobile/quests08:openMenu',e2); } } },true); }
  document.head.insertAdjacentHTML('beforeend','<style>html body.phone-land #menuov .mo-tb[title^="Search"],html body.phone-app #menuov .mo-tb[title^="Search"]{display:none!important}</style>'); }
/* the settings button is a gear again (director, 2026-11-18: "settings logo should go back to being a gear, it makes way more sense") */
{ const g='<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>';
  const u='url("data:image/svg+xml,'+encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">'+g+'</svg>')+'")';
  document.head.insertAdjacentHTML('beforeend',`<style>html body.phone-land .hud > .hudbtns > #settingsbtn::before,html body.phone-app .hud > .hudbtns > #settingsbtn::before,html body.phone-land #menuov .mo-tools .mo-tb:not([data-mo="search"])::before,html body.phone-app #menuov .mo-tools .mo-tb:not([data-mo="search"])::before{-webkit-mask:${u} center/contain no-repeat!important;mask:${u} center/contain no-repeat!important}</style>`); }
/* test builds: window.__searchQC() opens every search entry the way a tap does and checks it lands on its page (and section), then
   opens every page from the empty-search map. Part of every final QC (director, 2026-11-18). Returns {checked, bad[]}. */
if(/[?&]test\b/.test(location.search)) window.__searchQC=async()=>{ const w=ms=>new Promise(r=>setTimeout(r,ms)), bad=[]; let n=0; const ov=$('searchov'), q=$('searchq');
  const open=()=>{ try{ closeMenu(); }catch(e){ oops('mobile/quests08:closeMenu',e); } const b=$('searchbtn'); if(b) b.click(); };
  for(const e of SEARCH_IDX.slice()){ open(); await w(120); q.value=e[0].replace(/[^A-Za-z0-9 ]+/g,' ').replace(/ +/g,' ').trim(); /* typed like a player: words, no punctuation */ q.dispatchEvent(new Event('input',{bubbles:true})); await w(80);
    const btn=[...ov.querySelectorAll('.sv-r[data-i]')].find(x=>(x.querySelector('b')||{}).textContent===e[0]); if(!btn){ bad.push('not found: '+e[0]); continue; }
    if(/^(|Menu)$/.test(((btn.querySelector('.meta')||{}).textContent||'').trim())) bad.push('no location: '+e[0]);
    btn.click(); await w(260); n++; if(S.tab!==e[1]||!MENU_OPEN){ bad.push(e[0]+' -> '+S.tab+(MENU_OPEN?'':' (menu closed)')); continue; }
    if(typeof e[2]==='string'){ const s=$('panel').querySelector('.bwx-nav [aria-selected="true"]'), has=[...$('panel').querySelectorAll('.bwx-nav [data-sect]')].some(x=>x.dataset.sect.startsWith(e[2])); /* a section this save doesn't have (e.g. Find more when every pet is owned) is not a fault */ if(s&&has&&!s.textContent.trim().startsWith(e[2])&&!s.dataset.sect?.startsWith(e[2])) bad.push(e[0]+' section '+s.textContent.trim()); } }
  open(); await w(150); q.value=''; q.dispatchEvent(new Event('input',{bubbles:true})); await w(150); const tabs=[...ov.querySelectorAll('.sv-p')].map(b=>b.dataset.tab);
  for(const t of tabs){ open(); await w(120); q.value=''; q.dispatchEvent(new Event('input',{bubbles:true})); await w(100); const b=[...ov.querySelectorAll('.sv-p')].find(x=>x.dataset.tab===t); if(!b){ bad.push('map missing '+t); continue; } b.click(); await w(260); n++; if(S.tab!==t||!MENU_OPEN) bad.push('map '+t+' -> '+S.tab+(MENU_OPEN?'':' (menu closed)')); }
  try{ closeMenu(); }catch(e){ oops('mobile/quests08:closeMenu#2',e); } ov.hidden=true; return {checked:n, mapPages:tabs.length, bad}; };
/* search entries on phones: no keyboard shortcuts (touch screens); Save & codes lives in Save now */
try{ for(let i=SEARCH_IDX.length-1;i>=0;i--){ const e=SEARCH_IDX[i]; if(e[1]==='__keys'||e[0]==='Keyboard shortcuts'){ if(typeof MOB==='function') SEARCH_IDX.splice(i,1); continue; }
    if(e[1]==='settings'&&/Save & codes/.test(e[2]||'')) SEARCH_IDX[i]=['Save codes and gift codes','save','Save codes',e[3]+' gift']; } }catch(e){ oops('mobile/quests08:SEARCH_IDX.splice',e); }
/* section names that carry a count ("Find more · 30") still match a plain name from search, Quests or a link ("Find more"); search sets
   the section before it opens the page, so it opens right there */
{ const _sz=sectionize; sectionize=function(P,tab,groups,before){ try{ const s=SECT[tab]; if(s&&groups&&!groups.some(g=>g.name===s)){ const g=groups.find(g=>g.nodes&&g.nodes.length&&String(g.name).startsWith(s)); if(g) SECT[tab]=g.name; } }catch(e){ oops('mobile/quests08:groups.some',e); } return _sz.apply(this,arguments); };
  const _sg=searchGo; searchGo=function(e){ try{ if(MOB()&&e&&typeof e[2]==='string') SECT[e[1]]=e[2]; }catch(er){ oops('mobile/quests08:MOB',er); } return _sg.apply(this,arguments); }; }
