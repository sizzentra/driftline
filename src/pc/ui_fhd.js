// =====================================================================
// PC full HD (director, 2026-11-17: "give ALL pc menus optimization... save this window size's changes exclusive to this
// resolution"). body.pc-fhd = the PC layout on a screen of at least 1800 x 950 (a 1080p monitor in full screen). Everything
// written for it below is scoped to that class, so laptops, smaller windows and phones keep their own layouts.
// =====================================================================
{ const apply=()=>{ const b=document.body.classList, v=b.contains('pch-on')&&innerWidth/UIZ>=1800&&innerHeight/UIZ>=950; if(v!==b.contains('pc-fhd')) b.toggle('pc-fhd',v); };
  addEventListener('resize',()=>setTimeout(apply,40)); new MutationObserver(apply).observe(document.body,{attributes:true,attributeFilter:['class']}); apply(); }
// PC Reborn (2026-11-21): Skills, Save, Rods, Feats, Cooler and Stats use the shared page engine (src/cx_pages.js) like the phones;
// their PC-only full-HD layouts (side-by-side boards, the rod pair, the cooler side panel, Stats on one screen) were removed.
// full HD Tackle > Gear: the six upgrades in two rows of three, so the cards are wide and readable instead of one thin strip
PC_STEPS.post.push(()=>{ try{ if(S.tab==='shop'&&document.body.classList.contains('pc-fhd')){ const g=$('panel').querySelector(':scope > .grid'); if(g&&g.querySelectorAll(':scope > .tile').length===6) g.classList.add('fhd-gear'); } }catch(e){ oops('pc/ui_fhd:classList.contains',e); } });
document.head.insertAdjacentHTML('beforeend',`<style>
body.pc-fhd #menuov #panel > .grid.fhd-gear{grid-template-columns:repeat(3,minmax(0,1fr))!important;gap:16px!important}
body.pc-fhd #menuov #panel > .grid.fhd-gear > .tile{padding:16px 18px!important;gap:8px!important}
</style>`);
document.head.insertAdjacentHTML('beforeend',`<style>
/* full HD Cooler (and any fish list): fish as cards in two columns, so name, value and buttons sit together; bigger fish */
body.pc-fhd #menuov #panel .list:has(> .fishrow):not([style*="display: none"]){display:grid!important;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}
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
    try{ menuSubKey=''; if(MENU_OPEN) menuSync(); }catch(e){ oops('pc/ui_fhd:menuSync',e); } };
  // a page reached from a header button has no section: its name shows as the one page tab, so the row is never empty
  const _ms=menuSync; menuSync=function(){ _ms.apply(this,arguments); try{ if(!pc()) return; const T=$('tabs'), sb=T&&T.querySelector('.subbar'); if(!sb) return;
      if((!menuSecOf(S.tab)&&S.tab!==DASH)||(menuSecOf(S.tab)||{}).id==='more'){ menuSubKey='solo|'+S.tab; sb.innerHTML=''; sb.hidden=true; } /* the lit header button (or the lit gear) already says where you are */
      document.querySelectorAll('.pch-stats > .stat').forEach(b=>b.classList.toggle('on',MENU_OPEN&&b.dataset.page===S.tab)); }catch(e){ oops('pc/ui_fhd:pc',e); } };
  // header buttons: icon + label + value, the look of a button; Stats joins them
  const ICON={cooler:'<path d="M4 9h16v10a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 4 19z"/><path d="M3 9l1.6-4h14.8L21 9"/><path d="M10 13h4"/>',
    aquarium:'<rect x="3" y="4.5" width="18" height="15" rx="2.5"/><path d="M7 12.5c1.6-2 4.2-2.4 6-.5l1.6-1.2v3.4L13 13c-1.8 1.9-4.4 1.5-6-.5z"/><path d="M3 17c3 .7 5 .7 9 0s6-.7 9 0"/>',
    journal:'<path d="M5 4.5h10.5A3.5 3.5 0 0 1 19 8v11.5H8.5A3.5 3.5 0 0 1 5 16z"/><path d="M5 16a3 3 0 0 1 3-3h11"/><path d="M9 8h6"/>',
    stats:'<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>', home:'<path d="M3.5 11.5 12 4.5l8.5 7"/><path d="M6 10v9.5h12V10"/><path d="M10 19.5v-5h4v5"/>', bounties:'<rect x="5" y="4" width="14" height="16.5" rx="2"/><path d="M9 9h6M9 13h6M9 17h3"/>'};
  const svg=k=>`<svg class="pcs-ic" viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICON[k]}</svg>`;
  let statsBtn=null; const decorate=()=>{ const box=document.querySelector('.pch-stats'); if(!box) return false;
    const map=[[$('coolerct')&&$('coolerct').closest('.stat'),'cooler'],[document.querySelector('.stat.st-aq'),'aquarium'],[document.querySelector('.stat.st-log'),'journal']];
    for(const [el,k] of map){ if(!el||el.dataset.page) continue; el.dataset.page=k; el.insertAdjacentHTML('afterbegin',svg(k)); }
    if(!statsBtn){ statsBtn=document.createElement('div'); statsBtn.className='stat st-stats hudx hud-link'; statsBtn.dataset.page='stats'; statsBtn.setAttribute('role','button'); statsBtn.tabIndex=0; statsBtn.title='Stats: your total sale multiplier and everything else that shapes your fishing (click to open)';
      statsBtn.innerHTML=svg('stats')+'<span class="lbl">Stats</span><b class="pcs-sv"></b>';
      const go=e=>{ e.preventDefault(); e.stopPropagation(); try{ startAudio(); }catch(er){ oops('pc/ui_fhd:startAudio',er); } openMenu('stats'); };
      ['pointerdown','mousedown'].forEach(ev=>statsBtn.addEventListener(ev,e=>e.stopPropagation(),{passive:true}));
      statsBtn.addEventListener('click',go); statsBtn.addEventListener('keydown',e=>{ if(e.key==='Enter'||e.key===' ') go(e); }); }
    if(statsBtn.parentElement!==box) box.appendChild(statsBtn);
    /* PC Reborn (director, 2026-11-21): Tasks joins the header, like the phones' top bar (the Home chip went with homes, 2026-11-24) */
    for(const [k,lbl,tip,after] of [['bounties','Tasks','Daily tasks, weekly quests and bounties. Click to open them.','journal']]){ let b=box.querySelector(':scope > [data-page="'+k+'"]'); if(!b){ b=document.createElement('div'); b.className='stat hudx hud-link st-'+k; b.dataset.page=k; b.setAttribute('role','button'); b.tabIndex=0; b.title=tip; b.innerHTML=svg(k)+'<span class="lbl">'+lbl+'</span><b class="pcs-v"></b>'; const go=e=>{ e.preventDefault(); e.stopPropagation(); try{ startAudio(); }catch(er){ oops('pc/ui_fhd:startAudio#2',er); } openMenu(k); }; ['pointerdown','mousedown'].forEach(ev=>b.addEventListener(ev,e=>e.stopPropagation(),{passive:true})); b.addEventListener('click',go); b.addEventListener('keydown',e=>{ if(e.key==='Enter'||e.key===' ') go(e); }); } const ref=box.querySelector(':scope > [data-page="'+after+'"]'); if(ref&&b.previousElementSibling!==ref) ref.after(b); }
    return true; };
  const tick=()=>{ try{ if(statsBtn){ const v=hdrStatText(); /* the stat picked on the Stats page (sale price by default) */ const b=statsBtn.querySelector('.pcs-sv'); if(b.textContent!==v) b.textContent=v; }
    const set=(k,v,ready)=>{ const c=document.querySelector('.pch-stats > [data-page="'+k+'"]'); if(!c) return; const b=c.querySelector('.pcs-v'); if(b&&b.textContent!==v) b.textContent=v; c.classList.toggle('ready',!!ready); };
    try{ const d=ensureDaily(), n=bountyReady(); set('bounties',n?n+' ready':d.tasks.filter(t=>t.claimed).length+'/'+d.tasks.length+' done',n>0); }catch(e){ oops('pc/ui_fhd:ensureDaily',e); } }catch(e){ oops('pc/ui_fhd:hdrStatText',e); } };
  setInterval(tick,1500);
  // in the menus the same buttons stay in the top row (the header itself is covered by the menu)
  const place=()=>{ const box=document.querySelector('.pch-stats'), tools=document.querySelector('#menuov .mo-tools'), ph=document.querySelector('#pchead .pch-tools'); if(!box||!tools||!ph) return;
    const inMenu=false; /* the header stays visible in menus now, with its buttons in place */ if(inMenu&&box.parentElement!==tools) tools.insertBefore(box,tools.querySelector('.mo-coin')||tools.firstChild); else if(!inMenu&&box.parentElement!==ph) ph.prepend(box); };
  { const _om=openMenu, _cm=closeMenu; openMenu=function(){ const r=_om.apply(this,arguments); try{ place(); }catch(e){ oops('pc/ui_fhd:place',e); } return r; }; closeMenu=function(){ const r=_cm.apply(this,arguments); try{ place(); }catch(e){ oops('pc/ui_fhd:place#2',e); } return r; }; } // move the buttons at once, not a moment later
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
html body.pch-on{--pcTabs:min(700px,calc(calc(100*var(--uvw,1vw)) - 32px - 190px - 720px - 56px))}
@media (max-width:1580px){
  html body.pch-on{--pcTabs:max(200px,min(700px,calc(calc(100*var(--uvw,1vw)) - 32px - 190px - 600px - 56px)))}
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
{ const _sz=sectionize; sectionize=function(P,tab,groups,before){ if(document.body.classList.contains('pch-on')&&groups){ const ren={home:{Dock:'Your dock'}}[tab]; if(ren){ groups=groups.map(g=>ren[g.name]?Object.assign({},g,{name:ren[g.name]}):g); if(SECT[tab]&&ren[SECT[tab]]) SECT[tab]=ren[SECT[tab]]; } } return _sz.call(this,P,tab,groups,before); }; }
// PC Settings: the volume sliders and the on/off switches both said "Music" and "Nature sounds"; the switches say what they do
{ const _rs=renderSettings; renderSettings=function(P){ _rs(P); if(!document.body.classList.contains('pch-on')) return; try{ P.querySelectorAll('.toggle b').forEach(b=>{ const t=b.textContent.trim(); if(t==='Music') b.textContent='Play music'; else if(t==='Nature sounds') b.textContent='Play nature sounds'; }); }catch(e){ oops('pc/ui_fhd:P.querySelectorAll',e); } }; }
document.head.insertAdjacentHTML('beforeend',`<style>
/* narrower PC windows: the right side (four header buttons + tools) must always fit */
@media (max-width:1580px){
  html body.pch-on{--pcTabs:max(180px,min(700px,calc(calc(100*var(--uvw,1vw)) - 32px - 190px - 690px - 70px)))}
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
  html body.pch-on{--pcTabs:max(170px,min(700px,calc(calc(100*var(--uvw,1vw)) - 32px - 150px - 690px - 70px)))}
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
  html body.pch-on{--pcTabs:max(170px,min(700px,calc(calc(100*var(--uvw,1vw)) - 32px - 150px - 420px - 56px)))}
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
  const _ms=menuSync; menuSync=function(){ _ms.apply(this,arguments); try{ lit(); }catch(e){ oops('pc/ui_fhd:lit',e); } };
  const _cm=closeMenu; closeMenu=function(){ const r=_cm.apply(this,arguments); try{ lit(); }catch(e){ oops('pc/ui_fhd:lit#2',e); } return r; };
  // a lit button closes the menu (captured first, so the button's own "open" does not run)
  document.addEventListener('click',e=>{ if(!pc()||!MENU_OPEN) return; const b=e.target.closest&&e.target.closest('#pchead .pch-stats > .stat.on, #pchead #catdock .cdb.on, #pchead [data-pch="settings"].on'); if(!b) return; e.preventDefault(); e.stopImmediatePropagation(); try{ closeMenu(); }catch(er){ oops('pc/ui_fhd:closeMenu',er); } },true); }
document.head.insertAdjacentHTML('beforeend',`<style>
html body.pch-on #menuov{top:var(--pcTop,66px)!important;height:calc(calc(100*var(--uvh,1vh)) - var(--pcTop,66px))!important;height:calc(calc(100*var(--uvh,1vh)) - var(--pcTop,66px))!important;background:#0a1220!important}
html body.pch-on.menu-open #pchead{visibility:visible!important}
html body.pch-on #menuov .mo-in{grid-template-columns:auto minmax(0,1fr)!important;grid-template-rows:auto minmax(0,1fr)!important;grid-template-areas:"back sub" "body body"!important;padding-top:0!important;row-gap:8px!important}
html body.pch-on #menuov #tabs .secbar,html body.pch-on #menuov .mo-tools{display:none!important}
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
// PC Reborn (2026-11-21): the Aquarium uses the phones' tabs (Your tank, Decorate) under the tank; its PC side-by-side layout was removed.
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
// URGENT FIX (director, 2026-11-18: "QR and code saves no longer generate on PC: Send and Get progress show no 6-digit code, no QR
// and no box to type a code"). On PC the Send / Get progress section lives in Settings > Save & codes, but it was only redrawn on
// the Save page (refreshXfer checked S.tab==='save'), so pressing Send made the code and updated the status line but never drew the
// code, the QR or the code box. It is redrawn in Settings too now. PC only.
{ const _rx=refreshXfer; refreshXfer=function(){ if(document.body.classList.contains('pch-on')&&S.tab==='settings'){ try{ renderPanel(); }catch(e){ console.error(e); } return; } return _rx.apply(this,arguments); }; }
/* 0.4.9 QC: Waters cards had their Travel/Unlock buttons at different heights in one row; the button now sits at the bottom of every card */
document.head.insertAdjacentHTML('beforeend','<style>#panel .grid>.tile.loc{display:flex;flex-direction:column}#panel .grid>.tile.loc>.btn{margin-top:auto}#panel .grid>.tile.loc>.meta:last-of-type{margin-bottom:6px}</style>');
