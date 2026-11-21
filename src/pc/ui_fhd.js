// =====================================================================
// PC full HD (director, 2026-11-17: "give ALL pc menus optimization... save this window size's changes exclusive to this
// resolution"). body.pc-fhd = the PC layout on a screen of at least 1800 x 950 (a 1080p monitor in full screen). Everything
// written for it below is scoped to that class, so laptops, smaller windows and phones keep their own layouts.
// =====================================================================
{ const apply=()=>{ const b=document.body.classList, v=b.contains('pch-on')&&innerWidth/UIZ>=1800&&innerHeight/UIZ>=950; if(v!==b.contains('pc-fhd')) b.toggle('pc-fhd',v); };
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
/* C13: the empty preview slot shows on PC (pets, Your home, aquarium), so starting a preview never pushes the options down; phones hold the option in place by scrolling instead */
body #panel .pvbar.pvhint{display:flex}
body #panel .pt-right{scrollbar-gutter:stable} /* C13: a scrollbar appearing (a hat color row made the column scroll) rewrapped the text above and moved the options 7 px */
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
body.pc-fhd #panel .fhd-rodpair .fhd-you .fhd-body2 > *{flex-shrink:0} /* 0.4.8.9.5 hotfix: the column squeezed the In your hands card to the screen and its hidden overflow cut off the attachment slot; the column scrolls instead */
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
  const _ms=menuSync; menuSync=function(){ _ms.apply(this,arguments); try{ lit(); }catch(e){} };
  const _cm=closeMenu; closeMenu=function(){ const r=_cm.apply(this,arguments); try{ lit(); }catch(e){} return r; };
  // a lit button closes the menu (captured first, so the button's own "open" does not run)
  document.addEventListener('click',e=>{ if(!pc()||!MENU_OPEN) return; const b=e.target.closest&&e.target.closest('#pchead .pch-stats > .stat.on, #pchead #catdock .cdb.on, #pchead [data-pch="settings"].on'); if(!b) return; e.preventDefault(); e.stopImmediatePropagation(); try{ closeMenu(); }catch(er){} },true); }
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
      { const sb=P.querySelector(':scope > .cool-sort'); if(sb) main.appendChild(sb); } /* C14: the sort bar sits under the heading */ if(list) main.appendChild(list); if(!n) main.insertAdjacentHTML('beforeend','<div class="fc-empty">Your cooler is empty. Catch something!</div>');
      const side=document.createElement('aside'); side.className='fc-side';
      side.innerHTML=`<div class="fc-cap"><div class="fc-capt"><b>Cooler</b><span>${n} / ${cap}</span></div><i class="fc-bar${n>=cap?' full':''}"><b style="width:${Math.min(100,n/cap*100)}%"></b></i></div>`;
      if(sub){ sub.classList.add('fc-sub'); side.appendChild(sub); }
      if(sellf) side.appendChild(sellf); if(btn){ btn.classList.add('fc-sell'); side.appendChild(btn); } { const sc=hdr.querySelector('[data-act="scrapall"]'); if(sc){ sc.classList.add('fc-sell'); side.appendChild(sc); } } /* Cam's list #7: Scrap all under Sell all, the same size */
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
body.pc-fhd #menuov #panel.aq-on #tankcv{height:calc(36*var(--uvh,1vh))!important}
body.pc-fhd #panel.aq-on > p.sub{font-size:12px}
body.pc-fhd #panel .aq-split{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:16px}
body.pc-fhd #panel .aq-col{display:flex;flex-direction:column;min-height:0;border-radius:16px;background:#0c1626;border:1px solid #ffffff14;padding:12px 14px}
body.pc-fhd #panel .aq-col > .fhd-h{flex:0 0 auto;margin-bottom:10px}
body.pc-fhd #panel .aq-body{flex:1 1 0;min-height:0;overflow:auto;scrollbar-width:thin;padding-right:6px;display:flex;flex-direction:column;gap:10px}
body.pc-fhd #menuov #panel .aq-body .list:has(> .fishrow){grid-template-columns:1fr!important;gap:8px!important}
body.pc-fhd #panel .aq-body .jsec{display:block!important;margin:0!important}
</style>`);
document.head.insertAdjacentHTML('beforeend',`<style>
/* the four header buttons: color says "clickable" (director, 2026-11-17: no shapes, navy on navy blended in): a teal fill with a
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
  const TIERS=['Junk','Odd junk','Rare find','Treasure','Not found yet']; /* [2] rarity stays hidden until found */
  const REWARD=e=>e.pet?['A new pet','pet']:e.hat?['A hat','hat']:e.rod?['A rod','rod']:e.lure?['Special lures','lure']:e.scales?['Scales','scales']:e.special?['Something special','special']:e.buff?['A boost','buff']:['Coins','coins'];
  let tier='all', sel=null;
  const render=P=>{ P.style.zoom=''; const items=JUNK.map(J=>({id:J.id,name:J.name,t:S.junk[J.id]?J.t:4,e:J.e||{},q:J.q||'',n:S.junk[J.id]||0}));
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
    <aside class="od-right">${it?`<div class="tile od-det"><canvas width="360" height="200" data-junk="${it.id}" data-known="${it.n?1:0}"></canvas><div class="rar">${TIERS[it.t]}</div><h3>${it.n?esc(it.name):'Not found yet'}</h3>${it.n?`<p class="od-q">${esc(it.q)}</p>`:'<p class="od-q">Keep fishing: it can turn up at any water.</p>'}<div class="kv">${it.n?oddKV(it.id):""}<div><span>Reward</span> ${REWARD(it.e)[0]}</div><div><span>Times found</span> ${it.n}</div></div></div>`
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
body.pch-on #panel .od-card b{font-size:12.5px;line-height:1.2;white-space:normal;overflow-wrap:anywhere;max-width:100%;text-align:center} /* 0.4.9 QC: names wrap to a second line instead of being cut at small windows */
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
// URGENT FIX (director, 2026-11-18: "QR and code saves no longer generate on PC: Send and Get progress show no 6-digit code, no QR
// and no box to type a code"). On PC the Send / Get progress section lives in Settings > Save & codes, but it was only redrawn on
// the Save page (refreshXfer checked S.tab==='save'), so pressing Send made the code and updated the status line but never drew the
// code, the QR or the code box. It is redrawn in Settings too now. PC only.
{ const _rx=refreshXfer; refreshXfer=function(){ if(document.body.classList.contains('pch-on')&&S.tab==='settings'){ try{ renderPanel(); }catch(e){ console.error(e); } return; } return _rx.apply(this,arguments); }; }
/* 0.4.9 QC: Waters cards had their Travel/Unlock buttons at different heights in one row; the button now sits at the bottom of every card */
document.head.insertAdjacentHTML('beforeend','<style>#panel .grid>.tile.loc{display:flex;flex-direction:column}#panel .grid>.tile.loc>.btn{margin-top:auto}#panel .grid>.tile.loc>.meta:last-of-type{margin-bottom:6px}</style>');
