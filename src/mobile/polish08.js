// =====================================================================
// Phones and tablets, round 8 polish (director, 2026-11-18: "ensure things that appear in multiple locations for mobile don't occur
// in multiple places" (tabs, headers), "find easier access for the stats tab, it's a useful feature, make sure people have easy access").
//  - One place for each thing: Settings no longer has a "Save & codes" section repeating the Save tab right next to it. Its gift
//    code and its erase / backup tools move into Save > Save codes, with the save codes they belong with.
//  - Stats is one tap from the side rail: it moves into Collection (Aquarium, Trophy Room, Fish Log, Stats) instead of hiding
//    behind the settings gear; the gear keeps Settings and Save. Your Level in the top bar also opens Stats (teal: tap me).
// Android + iPhone + tablets.
// =====================================================================
const AFTER_EVERY=[]; /* steps run after every page draw, in order (Clean Pages 3; the wrapper is at the end of this file) */
/* Stats is its own section on the side panel (director, 2026-11-18); the list itself lives in bm_ui04.js since PC Reborn */
try{ if(typeof SECT==='object'&&SECT.settings==='Save & codes') delete SECT.settings; }catch(e){ oops('mobile/polish08:n1',e); }

/* the Level chip opens Stats */
{ const hook=()=>{ const lv=document.querySelector('.hud > .st-lvl'); if(!lv||lv.dataset.mbtap) return; lv.dataset.mbtap='1'; lv.setAttribute('role','button'); lv.tabIndex=0; lv.title='Your level and all your stats. Tap to open Stats.';
    lv.addEventListener('pointerdown',e=>{ if(MOB()) e.stopPropagation(); });
    lv.addEventListener('click',e=>{ if(!MOB()) return; e.stopPropagation(); e.preventDefault(); try{ startAudio(); }catch(er){ oops('mobile/polish08:startAudio',er); } openMenu('stats'); }); };
  setTimeout(hook,0); setTimeout(hook,1500); }

/* Settings: no "Save & codes" section; Save > Save codes gets the gift code and the erase / backup tools */
/* (Clean Pages 2026-11-21: finishing touches of the Settings and Save pages, run by the page engine) */
pageDone('settings',P=>{ { const nav=P.querySelector('.aq07-sheet > .bwx-nav, .bwx-nav.sect-nav'); const b=nav&&nav.querySelector('[data-sect="Save & codes"]');
      if(b){ const was=b.getAttribute('aria-selected')==='true'; b.remove(); const n=nav.querySelectorAll(':scope > button').length; nav.style.setProperty('grid-template-columns',`repeat(${n<=4?n:n<=6?3:4},minmax(0,1fr))`,'important');
        P.querySelectorAll('.pg08-body > .tile, .pg08-body > details').forEach(t=>{ if(/Move progress|Gift code|Danger zone/.test(t.textContent)&&!t.closest('.grid')) t.remove(); });
        if(was){ const f=nav.querySelector('[data-sect]'); if(f) f.click(); } } } });
pageDone('save',P=>{ if(!P.querySelector('#giftin')){ const host=[...P.querySelectorAll('.pg08-body > .grid, .pg08-body > *')].find(x=>/Your save code/.test(x.textContent));
      if(host){ host.insertAdjacentHTML('beforeend',`<div class="tile mb-gift"><b>🎁 Gift code</b><div class="meta">Got a gift code from a friend? Type it here.</div><div class="row" style="gap:8px;margin-top:8px;flex-wrap:nowrap"><input id="giftin" maxlength="24" placeholder="Gift code" autocapitalize="characters" style="flex:1;min-width:0;background:#0a161d;color:var(--ink);border:1px solid var(--line);border-radius:9px;padding:8px;text-transform:uppercase"><button class="btn sm" data-act="redeem">Redeem</button></div></div>`);
        try{ host.insertAdjacentHTML('beforeend',dangerHTML()); }catch(e){ oops('mobile/polish08:host.insertAdjacentHTML',e); } } }
  });

/* Rods (director, 2026-11-18: "Rod rack looks weird when you switch headers. Consider a rework for it to make a lot more sense and
   look cleaner"). The presets box sat outside the page's sections, so it showed on top of Your rod, Rod rack AND Attachments (the
   tab you picked was hidden under it). Now:
   - the presets live in Your rod, under the rod in your hands, and leave with it when you pick Rod rack or Attachments
   - each preset is one compact row: number + rod name + level / slots / attachments on the left, its buttons on the right
   - the preset in use shows a gold "In use" tag and only Clear (the old dead "Saved" button is gone: it follows every change anyway);
     the others show Use, Replace (save the rod in your hands over it) and Clear; an empty one shows "Save current rod" */
{ const _rph=rodPresetsHTML;
  rodPresetsHTML=function(){ if(!MOB()) return _rph.apply(this,arguments);
    const rows=[0,1,2].map(i=>{ const p=S.rodPresets[i], on=S.rodPreset===i, R=p&&ROD_I[p.rod];
      if(!R) return `<div class="rp-card rp8-row empty"><div class="rp8-info"><span class="rp-n">Preset ${i+1}</span><em>Empty</em></div><div class="rp8-acts"><button type="button" class="btn alt sm" data-rp="save:${i}">Save current rod</button></div></div>`;
      const atts=p.att.filter(a=>a&&ATT_I[a]).map(a=>ATT_I[a].name), lv=(S.rods.lvl&&S.rods.lvl[p.rod])||0;
      const meta=`Level ${lv} / 10 · ${R.slots} slot${R.slots>1?'s':''} · ${atts.length?esc(atts.join(', ')):'no attachments'}`;
      return `<div class="rp-card rp8-row${on?' on':''}"><div class="rp8-info"><span class="rp-n">Preset ${i+1}${on?' <span class="rp8-tag">In use</span>':''}</span><b>${esc(R.name)}</b><span class="rp-lv">${meta}</span></div><div class="rp8-acts">${on?'':`<button type="button" class="btn sm" data-rp="use:${i}">Use</button><button type="button" class="btn alt sm" data-rp="save:${i}" title="Save the rod in your hands (with its attachments) over this preset">Replace</button>`}<button type="button" class="btn alt sm" data-rp="clear:${i}">Clear</button></div></div>`; }).join('');
    return `<div class="rp-box rp8"><h5>Presets</h5><p class="meta rp8-why">Save a rod with its attachments, then switch to it in one tap. The preset in use follows every change you make.</p><div class="rp-list">${rows}</div></div>`; };
  /* 2026-11-19 (director: "Your rods ... should not carry over to the other 2 tabs"): the box was inserted by a second phone block
     after the page's tabs were built, and this block looked for a '.tile.rodnow' that the page no longer has, so the presets showed
     on all three tabs. One block now: the box goes right after the first node of the "Your rods" tab and is shown and hidden with it. */
  }

document.head.insertAdjacentHTML('beforeend',`<style>
html body.phone-land #menuov #panel h2.rp8-dup,html body.phone-app #menuov #panel h2.rp8-dup{display:none!important}
html body.phone-land #menuov #panel .rp-box.rp8,html body.phone-app #menuov #panel .rp-box.rp8{margin:14px 0 4px!important;gap:6px!important}
html body.phone-land #menuov #panel .rp8 > h5,html body.phone-app #menuov #panel .rp8 > h5{margin:0!important}
html body.phone-land #menuov #panel .rp8 .rp8-why,html body.phone-app #menuov #panel .rp8 .rp8-why{margin:0 0 4px!important;font-size:12.5px!important;color:#9fb3c8!important}
html body.phone-land #menuov #panel .rp8 .rp-list,html body.phone-app #menuov #panel .rp8 .rp-list{gap:6px!important}
html body.phone-land #menuov #panel .rp8 .rp8-row,html body.phone-app #menuov #panel .rp8 .rp8-row{flex-direction:row!important;align-items:center!important;justify-content:space-between;gap:10px!important;padding:9px 12px!important;min-height:56px;box-sizing:border-box}
html body.phone-land #menuov #panel .rp8 .rp8-row.empty,html body.phone-app #menuov #panel .rp8 .rp8-row.empty{background:transparent!important}
html body.phone-land #menuov #panel .rp8 .rp8-info,html body.phone-app #menuov #panel .rp8 .rp8-info{display:flex;flex-direction:column;gap:1px;min-width:0;flex:1 1 auto}
html body.phone-land #menuov #panel .rp8 .rp8-info b,html body.phone-app #menuov #panel .rp8 .rp8-info b{font:800 14.5px var(--display,system-ui)!important;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
html body.phone-land #menuov #panel .rp8 .rp8-info .rp-lv,html body.phone-app #menuov #panel .rp8 .rp8-info .rp-lv{font-size:11.5px!important;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
html body.phone-land #menuov #panel .rp8 .rp8-info em,html body.phone-app #menuov #panel .rp8 .rp8-info em{font-size:13px}
html body.phone-land #menuov #panel .rp8 .rp-n,html body.phone-app #menuov #panel .rp8 .rp-n{display:flex;align-items:center;gap:6px}
html body.phone-land #menuov #panel .rp8 .rp8-tag,html body.phone-app #menuov #panel .rp8 .rp8-tag{padding:1px 7px;border-radius:999px;background:linear-gradient(180deg,#ffd36a,#f0b43c);color:#2a1a04;font:800 10px var(--display,system-ui);letter-spacing:.04em}
html body.phone-land #menuov #panel .rp8 .rp8-acts,html body.phone-app #menuov #panel .rp8 .rp8-acts{display:flex;gap:6px;flex:0 0 auto;align-items:center}
html body.phone-land .hud > .st-lvl[data-mbtap],html body.phone-app .hud > .st-lvl[data-mbtap]{background:linear-gradient(180deg,#197a76,#14666a)!important;border:1px solid #7fe3c4!important;box-shadow:0 3px 10px #0007!important;color:#fff!important;cursor:pointer}
html body.phone-land .hud > .st-lvl[data-mbtap] .lbl,html body.phone-app .hud > .st-lvl[data-mbtap] .lbl{color:#c8fff0!important}
html body.phone-land .hud > .st-lvl[data-mbtap]:active,html body.phone-app .hud > .st-lvl[data-mbtap]:active{transform:translateY(1px)}
</style>`);
/* Skills (director: "In skill tabs it doesn't make sense for each category to have a badge, just the skill points"): the category tabs
   carry no counts; your unspent skill points stay the one badge (the Skills tab and the side panel) */
pageDone('skills',P=>{ if(MOB()) P.querySelectorAll('.bwx-nav > button[data-sect] .sdot').forEach(d=>d.remove()); }); /* Clean Pages 2: a page step */
/* Skills: an XP bar next to your Level (director, 2026-11-18: "We could use a xp bar next to the Level that functions and looks neat
   in this tab"). Fills with your XP toward the next level and says how much ("120 / 400 XP"); it follows every catch live while the
   page is open (a light check twice a second, only on this page) and fills up in a short glide. */
{ const xpHTML=()=>{ const need=xpNeed(S.lvl), k=Math.max(0,Math.min(1,S.xp/need)); return `<span class="mb-xpbar" role="progressbar" aria-label="XP to level ${S.lvl+1}" aria-valuemin="0" aria-valuemax="${need}" aria-valuenow="${Math.floor(S.xp)}"><i style="width:${(k*100).toFixed(1)}%"></i></span><span class="mb-xpt">${fmt(Math.floor(S.xp))} / ${fmt(need)} XP</span>`; };
  let last='', tm=0;
  const paint=()=>{ const P=$('panel'); if(!MOB()||S.tab!=='skills'||!P){ clearInterval(tm); tm=0; return; } const cell=P.querySelector('.mb-lvcell'); if(!cell){ clearInterval(tm); tm=0; return; }
    const key=S.lvl+'|'+Math.floor(S.xp); if(key===last) return; last=key; const b=cell.querySelector('b'); if(b) b.textContent=S.lvl; const w=cell.querySelector('.mb-xp'); if(!w) return;
    const need=xpNeed(S.lvl), k=Math.max(0,Math.min(1,S.xp/need)), bar=w.querySelector('.mb-xpbar'); w.querySelector('i').style.width=(k*100).toFixed(1)+'%'; w.querySelector('.mb-xpt').textContent=fmt(Math.floor(S.xp))+' / '+fmt(need)+' XP'; bar.setAttribute('aria-valuenow',Math.floor(S.xp)); bar.setAttribute('aria-valuemax',need); bar.setAttribute('aria-label','XP to level '+(S.lvl+1)); };
  pageDone('skills',P=>{ if(!MOB()) return; const bank=P.querySelector('.pg08-bank'); if(!bank) return; /* Clean Pages 2: a page step, not a renderPanel layer */
      const cell=[...bank.children].find(c=>c.tagName==='DIV'&&/^Level\b/.test((c.querySelector('.sub')||{}).textContent||'')); if(!cell||cell.querySelector('.mb-xp')) return;
      cell.classList.add('mb-lvcell'); cell.title='Your XP toward the next level. Catches give XP; every level gives a skill point.'; cell.insertAdjacentHTML('beforeend',`<span class="mb-xp">${xpHTML()}</span>`); last=S.lvl+'|'+Math.floor(S.xp);
      if(!tm) tm=setInterval(paint,500); }); }

/* side panel (director's screenshot: the Challenges count covered its label): counts sit on the corner of the icon, never over the name */
document.head.insertAdjacentHTML('beforeend',`<style>
html body.phone-land:not(.dock-mini) #menuov #tabs .secbar .secb .secdot{top:50%!important;right:2px!important;left:auto!important;transform:translateY(-50%)!important} html body.phone-land:not(.dock-mini) #menuov #tabs .secbar .secb:has(.secdot:not([hidden])){padding-right:22px!important;gap:4px!important} html body.phone-land:not(.dock-mini) #menuov #tabs .secbar .secb:has(.secdot:not([hidden])) .secl{min-width:0!important;overflow:hidden!important;font-size:11px!important}
html body.phone-land #menuov #panel.pg08 .pg08-bank > .mb-lvcell{max-width:none!important;flex:1 1 auto!important;align-items:center!important}
html body.phone-land #menuov #panel.pg08 .mb-xp,html body.phone-app #menuov #panel.pg08 .mb-xp{display:flex;align-items:center;gap:8px;min-width:0;flex:1 1 auto;margin-left:6px}
html body.phone-land #menuov #panel.pg08 .mb-xpbar,html body.phone-app #menuov #panel.pg08 .mb-xpbar{position:relative;flex:1 1 90px;max-width:200px;min-width:60px;height:8px;border-radius:999px;background:#0a161d;box-shadow:inset 0 0 0 1px #ffffff1a;overflow:hidden}
html body.phone-land #menuov #panel.pg08 .mb-xpbar > i,html body.phone-app #menuov #panel.pg08 .mb-xpbar > i{position:absolute;left:0;top:0;bottom:0;border-radius:999px;background:linear-gradient(90deg,#7fe3c4,#5fb4ff);box-shadow:0 0 8px #7fe3c466;transition:width .45s ease-out}
html body.phone-land #menuov #panel.pg08 .mb-xpt,html body.phone-app #menuov #panel.pg08 .mb-xpt{font:700 11px var(--display,system-ui);color:#9fb3c8;white-space:nowrap}
</style>`);
/* the side panel holds seven sections now (Prestige added): sideways each button is a little shorter so all of them and Collapse
   panel fit without scrolling, down to the smallest iPhones; the summary strip may take a second line when a value is long */
document.head.insertAdjacentHTML('beforeend',`<style>
@media (orientation:landscape) and (max-height:560px){
  html body.phone-land #menuov #tabs .secbar{gap:4px!important}
  html body.phone-land #menuov #tabs .secbar > .secb{min-height:34px!important;height:34px!important}
  html body.phone-land #menuov #panel.pg08 .pg08-bank{flex-wrap:wrap!important;row-gap:2px!important}
  html body.phone-land #menuov #panel.pg08 .pg08-bank > div{max-width:none!important}
}
</style>`);
/* Tasks page (Bounties; director: "Daily tasks, weekly quests, and bounties ... right now they all have a ton of duplicate
   information"): an old rule (bm_ui04: .tile.dtasks{display:grid!important}) kept the daily and weekly cards on screen in every tab,
   so each tab showed everything. Now each tab shows only its own part; the harbourmaster's intro (it is about the bounty board) shows
   on Bounties only; the cards drop their big "Daily tasks" / "Weekly quests" titles (the tab above names them) and keep their line
   about streaks, resets and progress */
document.head.insertAdjacentHTML('beforeend',`<style>
html body.phone-land #menuov #panel.pg08 .tile.dtasks[style*="display: none"],html body.phone-app #menuov #panel.pg08 .tile.dtasks[style*="display: none"]{display:none!important}
html body.phone-land #menuov #panel.pg08[data-pg-tab="bounties"]:not([data-pg-sec="Bounties"]) .pg08-body > .pg08-note,html body.phone-app #menuov #panel.pg08[data-pg-tab="bounties"]:not([data-pg-sec="Bounties"]) .pg08-body > .pg08-note{display:none!important}
html body.phone-land #menuov #panel.pg08[data-pg-tab="bounties"] .tile.dtasks > .row h4,html body.phone-app #menuov #panel.pg08[data-pg-tab="bounties"] .tile.dtasks > .row h4{display:none!important}
</style>`);
/* eight side-panel sections now (Quests first): on short phones each button is a little shorter again so all of them and Collapse
   panel still fit without scrolling (measured at 667x375) */
document.head.insertAdjacentHTML('beforeend',`<style>
@media (orientation:landscape) and (max-height:420px){
  html body.phone-land #menuov #tabs .secbar{gap:3px!important}
  html body.phone-land #menuov #tabs .secbar > .secb{min-height:31px!important;height:31px!important}
  html body.phone-land #catdock{gap:3px!important}
  html body.phone-land #catdock .cdb{min-height:31px!important;height:31px!important}
}
</style>`);
/* the frame-rate counter (Settings > Display) sits in the top-right corner of the water on phones: at the bottom it covered the
   fishing hint ("Touch and hold the water…") on narrower screens (director, 2026-11-18) */
document.head.insertAdjacentHTML('beforeend',`<style>html body.phone-land #fpsbox,html body.phone-app #fpsbox{top:44px!important;bottom:auto!important;right:10px!important;left:auto!important} /* below the streak chip, which d_draw paints on the water at y 12-36 (HOTFIX 0.4.8.6.1: it covered it) */</style>`);
/* PERFORMANCE: switching menu tabs (director, 2026-11-18: "seems to be a performance problem from switching upper tabs in ui menus").
   Measured (desktop CPU, a phone is several times slower): a switch averaged 18 ms, the Fish Log 45 ms, Oddities 39 ms, Pets 31 ms.
   - pictures: only the first 12 fish pictures are drawn at once; the rest are drawn as they come into view (they were all drawn on every
     switch, about 10 ms on the Fish Log). Same for the Oddities pictures (waters08).
   - the page-tab row is measured on the next frame instead of in the middle of the switch (it forced an extra layout pass). */
{ const _pf=paintFish, N=12; let io=null;
  const show=c=>{ if(!c.isConnected||!c.dataset.fishlazy) return; c.setAttribute('data-fish',c.dataset.fishlazy); c.removeAttribute('data-fishlazy'); try{ _pf(c.parentElement); }catch(e){ oops('mobile/polish08:_pf',e); } };
  paintFish=function(P){ if(!MOB()||!P||!P.querySelectorAll||typeof IntersectionObserver!=='function') return _pf.apply(this,arguments);
    const all=[...P.querySelectorAll('canvas[data-fish]')]; if(all.length<=N) return _pf.apply(this,arguments);
    if(!io) io=new IntersectionObserver(es=>es.forEach(e=>{ if(e.isIntersecting){ io.unobserve(e.target); show(e.target); } }),{rootMargin:'240px'});
    const later=all.slice(N); later.forEach(c=>{ c.dataset.fishlazy=c.getAttribute('data-fish'); c.removeAttribute('data-fish'); });
    const r=_pf.apply(this,arguments); later.forEach(c=>io.observe(c)); return r; };
  if(/[?&]test\b/.test(location.search)) window.__lazyFish=()=>{ document.querySelectorAll('canvas[data-fishlazy]').forEach(show); }; /* tests: draw them all */ }
{ const _mp=menuPillView; menuPillView=function(sb,p){ if(MOB()){ requestAnimationFrame(()=>{ try{ _mp(sb,p); }catch(e){ oops('mobile/polish08:_mp',e); } }); return; } return _mp.apply(this,arguments); }; }
/* speed: the chip / tab rows are scrolled to the chosen one on the next frame instead of in the middle of the switch (menuTidy2 measured
   every row right after the page was built: a forced layout pass of 3-7 ms per switch) */
{ const _mt=menuTidy2; let q=0;
  /* HOTFIX 0.4.8.6.1: the cheap part of the tidy-up (marking the page header .dl-head / .dl-headw / .dl-dup, no layout reads) must run
     at once: page layers that rebuild right after renderPanel (aquarium07 hides its old header by that mark) depend on it. Only the
     rest (scrolling chip rows, which measures) waits for the next frame. Same logic as bm_ui04 menuTidy2's first lines. */
  const quick=()=>{ if(!MENU_OPEN) return; const P=$('panel'); if(!P) return; const on=$('tabs')&&$('tabs').querySelector('.subp.on');
    const h=P.querySelector(':scope > h2, :scope > .row > div > h2'); if(h){ const lbl=on?on.textContent.replace(/[\d\s]+/g,' ').trim().toLowerCase():''; const t=h.textContent.replace(/\s+/g,' ').trim().toLowerCase(); h.classList.toggle('dl-dup', !!lbl&&!!t&&lbl.includes(t)); }
    const hr=P.querySelector(':scope > .row.spread'); if(hr&&hr.querySelector('h2')){ const wide=[...hr.children].slice(1).some(c=>c.matches('select,input,.fld')||c.querySelector('select,input,.fld')); hr.classList.toggle('dl-head',!wide); hr.classList.toggle('dl-headw',wide); } };
  menuTidy2=function(){ if(MOB()){ try{ quick(); }catch(e){ oops('mobile/polish08:quick',e); } if(!q) q=requestAnimationFrame(()=>{ q=0; try{ _mt(); }catch(e){ oops('mobile/polish08:_mt',e); } }); return; } return _mt.apply(this,arguments); }; try{ menuTidy=menuTidy2; }catch(e){ oops('mobile/polish08:menuTidy',e); } } /* the page switch calls the older alias menuTidy */
/* TROPHY ROOM fits one screen (director, 2026-11-18): a compact wall, each plaque just the fish and its name (about eight across);
   tap a plaque to see its details in a bar under the wall (rarity, weight, water, date) with To cooler. The intro line steps aside. */
pageDone('trophy',P=>{ try{ if(!MOB()) return; const room=P.querySelector('.tp-room'); if(!room||room.classList.contains('tp8')) return; /* Clean Pages 3: a page step */
      room.classList.add('tp8'); const emp=room.querySelector('.tp-empty'); if(emp&&!emp.querySelector('.tp8-wall')){ const g=emp.querySelector('.tp-ghost'); if(g) g.remove(); emp.insertAdjacentHTML('afterbegin','<div class="tp8-wall" aria-hidden="true"><div class="tp-plaque tp-ghost"></div><div class="tp-plaque tp-ghost"></div><div class="tp-plaque tp-ghost"></div></div>'); } /* empty room (director, 2026-11-19: "super small ui when empty"): a wall of three empty plaques fills the page */ const grid=room.querySelector('.tp-grid'); if(!grid) return;
      let bar=room.querySelector('.tp8-bar'); if(!bar){ bar=document.createElement('div'); bar.className='tp8-bar'; bar.innerHTML='<span class="meta">Tap a trophy to see it up close.</span>'; grid.after(bar); }
      grid.querySelectorAll('.tp-item').forEach((it,i)=>{ it.tabIndex=0; it.setAttribute('role','button');
        it.addEventListener('click',e=>{ if(e.target.closest('.tp-out')) return; grid.querySelectorAll('.tp-item.sel').forEach(x=>x.classList.remove('sel')); it.classList.add('sel');
          const nm=it.querySelector('.tp-plate b'), sub=it.querySelector('.tp-plate span'), meta=it.querySelector('.tp-meta'), out=it.querySelector('.tp-out');
          bar.innerHTML=`<div class="tp8-info"><b>${nm?nm.innerHTML:''}</b><span class="meta">${sub?sub.textContent:''}${meta?' · '+meta.textContent:''}</span></div>`; if(out){ const c=out.cloneNode(true); c.classList.add('tp8-out'); bar.appendChild(c); } }); });
    }catch(e){ console.error(e); } });
/* TIDE PASS: the "next Tide reward" is one slim row (small picture, name, what it is, levels to go) instead of a big card */
/* BOARDWALK: two wider game cards a row on phones (three narrow ones stretched each game to 360-560 px), game pictures capped */
/* "Waters" is called "Map" (director, 2026-11-18) */
{ const f=MENU_SECS.find(s=>s.id==='fish'); if(f){ f.name='Map'; f.short='Map'; }
  const b=$('tabs')&&$('tabs').querySelector(':scope > [data-tab="map"]'); if(b&&MOB()){ b.dataset.label='🗺️ Map'; for(const n of b.childNodes) if(n.nodeType===3&&/Waters/.test(n.textContent)) n.textContent=n.textContent.replace('Waters','Map'); }
  try{ SEARCH_IDX.forEach((e,i)=>{ if(e[1]==='map'&&e[0]==='Waters') SEARCH_IDX[i]=['Map (waters)',e[1],e[2],e[3]]; }); }catch(e){ oops('mobile/polish08:SEARCH_IDX.forEach',e); } }
document.head.insertAdjacentHTML('beforeend',`<style>
html body.phone-land #menuov #panel.pg08[data-pg-tab="trophy"] .pg08-body > .pg08-note,html body.phone-app #menuov #panel.pg08[data-pg-tab="trophy"] .pg08-body > .pg08-note{display:none!important}
#menuov #panel .tp-room.tp8 .tp-in{padding:8px!important}
#menuov #panel .tp-room.tp8 .tp-sort{margin:0 0 6px!important;gap:5px!important}
#menuov #panel .tp-room.tp8 .tp-sort .chipb{min-height:28px!important;height:28px!important;padding:0 10px!important;font-size:12px!important}
#menuov #panel .tp-room.tp8 .tp-grid{display:grid!important;grid-template-columns:repeat(auto-fill,minmax(84px,1fr))!important;gap:6px!important}
#menuov #panel .tp-room.tp8 .tp-item{padding:3px!important;gap:2px!important;min-height:0!important;cursor:pointer;border-radius:10px;outline:none}
#menuov #panel .tp-room.tp8 .tp-item.sel{box-shadow:0 0 0 2px #ffd36a}
#menuov #panel .tp-room.tp8 .tp-plaque{height:46px!important;min-height:0!important;padding:4px!important;margin:0!important;border-width:2px!important}
#menuov #panel .tp-room.tp8 .tp-plaque canvas{width:100%!important;height:100%!important;object-fit:contain}
#menuov #panel .tp-room.tp8 .tp-plate{padding:2px 4px!important;margin:0!important;min-height:0!important}
#menuov #panel .tp-room.tp8 .tp-plate b{font-size:10.5px!important;line-height:1.15!important;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;display:block}
#menuov #panel .tp-room.tp8 .tp-plate span,#menuov #panel .tp-room.tp8 .tp-item > .tp-meta,#menuov #panel .tp-room.tp8 .tp-item > .tp-out{display:none!important}
#menuov #panel .tp8-bar{display:flex;align-items:center;justify-content:space-between;gap:10px;margin-top:8px;padding:8px 10px;border-radius:10px;background:#0a161dcc;min-height:40px}
#menuov #panel .tp8-info{display:flex;flex-direction:column;min-width:0}
#menuov #panel .tp8-info b{font-size:13.5px;color:#fff}
#menuov #panel .tp8-info b *{color:inherit!important}
#menuov #panel .tp8-bar .tp8-out{flex:0 0 auto;display:inline-flex!important}
#menuov #panel .tile.pass-next{display:flex!important;flex-direction:row!important;align-items:center!important;gap:12px!important;padding:8px 12px!important;min-height:0!important}
#menuov #panel .tile.pass-next canvas{width:72px!important;height:54px!important;flex:0 0 72px}
#menuov #panel .tile.pass-next h3{font-size:15px!important;margin:0!important}
#menuov #panel .tile.pass-next .meta{margin:0!important;font-size:12px!important}
#menuov #panel .tile.pass-next .meta + .meta{display:inline!important}
html body.phone-land #menuov #panel.pg08[data-pg-tab="games"] .bwx-grid,html body.phone-app #menuov #panel.pg08[data-pg-tab="games"] .bwx-grid{grid-template-columns:repeat(auto-fill,minmax(320px,1fr))!important;gap:8px!important}
html body.phone-land #menuov #panel.pg08[data-pg-tab="games"] .bwx-cb canvas,html body.phone-app #menuov #panel.pg08[data-pg-tab="games"] .bwx-cb canvas{max-height:190px!important;width:auto!important;max-width:100%!important;margin:0 auto!important;display:block}
</style>`);
document.head.insertAdjacentHTML('beforeend',`<style>
#menuov #panel .tp-room.tp8 .tp-grid{grid-template-columns:repeat(auto-fill,minmax(66px,1fr))!important;gap:4px!important}
#menuov #panel .tp-room.tp8 .tp-plaque{height:36px!important}
#menuov #panel .tp-room.tp8 .tp-plate b{font-size:10px!important}
#menuov #panel .tp8-bar{margin-top:6px!important;padding:6px 10px!important}
html body.phone-land #menuov #panel.pg08[data-pg-tab="games"] .bwx-cb canvas,html body.phone-app #menuov #panel.pg08[data-pg-tab="games"] .bwx-cb canvas{max-height:150px!important}
html body.phone-land #menuov #panel.pg08[data-pg-tab="games"] .bwx-card,html body.phone-app #menuov #panel.pg08[data-pg-tab="games"] .bwx-card{min-height:0!important}
#menuov #panel .tile.pass-next canvas{width:60px!important;height:45px!important;flex:0 0 60px}
</style>`); /* round 8: tighter Trophy wall (about ten across), Boardwalk game pictures capped lower, smaller Tide Pass picture */
document.head.insertAdjacentHTML('beforeend',`<style>
#menuov #panel .tp-room.tp8 .tp-plaque{height:30px!important;padding:2px!important}
#menuov #panel .tp-room.tp8 .tp-plate{padding:1px 3px!important}
#menuov #panel .tp-room.tp8 .tp-in{padding:6px!important}
#menuov #panel .tp-room.tp8{margin:0!important}
html body.phone-land #menuov #panel.pg08[data-pg-tab="games"] .bwx-grid,html body.phone-app #menuov #panel.pg08[data-pg-tab="games"] .bwx-grid{align-items:start!important}
</style>`); /* Trophy plaques 30 px (24 trophies on one screen sideways); Boardwalk cards keep their own height instead of matching the taller one */
document.head.insertAdjacentHTML('beforeend',`<style>
#menuov #panel .tp-room.tp8 .tp-item{overflow:hidden!important;min-width:0!important}
#menuov #panel .tp-room.tp8 .tp-plate{width:100%!important;max-width:100%!important;box-sizing:border-box!important;margin:2px 0 0!important;transform:none!important;position:static!important;overflow:hidden!important;border-radius:4px!important}
#menuov #panel .tp-room.tp8 .tp-plate b{max-width:100%!important;text-align:center}
#menuov #panel .tp-room.tp8 .tp-sort{margin:0 0 4px!important}
#menuov #panel .tp8-bar{min-height:34px!important;padding:4px 10px!important;margin-top:4px!important}
</style>`); /* Trophy nameplates stay inside their plaque (a long name ends in …; the full name is in the bar when you tap it) */
document.head.insertAdjacentHTML('beforeend',`<style>#menuov #panel .tp-room.tp8 .tp-foot{display:none!important}</style>`); /* its "Room for N more" is in the strip */
/* EVENTS (director, 2026-11-18: "Events tab shows duplicates across the calendar, challenges and derby menus"): the intro line no longer
   tops every tab, the big "Challenges" / "Fishing Derby" headings (the tab names them) are gone, and Derby rewards no longer repeats
   "four minutes, one water, heaviest catch wins" (the derby card above says it). */
pageDone('events',P=>{ try{ if(!MOB()) return; /* Clean Pages 3: a page step */
      P.querySelectorAll('.tile').forEach(t=>{ const h=t.querySelector('h4,b'); if(h&&/^Derby rewards/.test(h.textContent.trim())){ const m=t.querySelector(':scope > .meta, :scope > div > .meta'); if(m&&/heaviest/i.test(m.textContent)) m.style.display='none'; } }); }catch(e){ oops('mobile/polish08:MOB',e); } });
/* FEATS (director: "Feats can definitely shrink in size overall when it comes to each card"): each card is two short lines and a thin
   bar (title + progress, then what to do + the reward), about half the height */
document.head.insertAdjacentHTML('beforeend',`<style>
html body.phone-land #menuov #panel.pg08[data-pg-tab="events"] .pg08-body > .pg08-note,html body.phone-app #menuov #panel.pg08[data-pg-tab="events"] .pg08-body > .pg08-note,html body.phone-land #menuov #panel.pg08[data-pg-tab="events"] .ev-h,html body.phone-app #menuov #panel.pg08[data-pg-tab="events"] .ev-h{display:none!important}
html body.phone-land #menuov #panel.pg08[data-pg-tab="feats"] .grid > .tile:not(.feat-cat):not([style*="display: none"]),html body.phone-app #menuov #panel.pg08[data-pg-tab="feats"] .grid > .tile:not(.feat-cat):not([style*="display: none"]){display:grid!important;grid-template-columns:minmax(0,1fr);grid-template-areas:"t" "m" "v";position:relative;align-items:center;gap:2px 8px!important;padding:6px 10px 9px!important;min-height:0!important}
#menuov #panel.pg08[data-pg-tab="feats"] .grid > .tile > .row.spread{grid-area:t;margin:0!important;gap:8px;flex-wrap:nowrap!important;min-width:0}
#menuov #panel.pg08[data-pg-tab="feats"] .grid > .tile > .row.spread h4{font-size:13.5px!important;margin:0!important;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;min-width:0}
#menuov #panel.pg08[data-pg-tab="feats"] .grid > .tile > .meta{grid-area:m;margin:0!important;font-size:11.5px!important;white-space:normal;overflow:visible;line-height:1.25;min-width:0}
#menuov #panel.pg08[data-pg-tab="feats"] .grid > .tile > .val{grid-area:v;margin:0!important;font-size:12px!important;white-space:normal;text-align:left;line-height:1.25;min-width:0}
#menuov #panel.pg08[data-pg-tab="feats"] .grid > .tile > .prog{position:absolute!important;left:10px;right:10px;bottom:4px;height:3px!important;margin:0!important}
#menuov #panel.pg08[data-pg-tab="feats"] .grid > .tile > .btn{grid-column:1 / -1}
</style>`);
document.head.insertAdjacentHTML('beforeend',`<style>#menuov #panel.pg08[data-pg-tab="feats"] .grid > .tile > .row.spread{min-height:0!important;height:auto!important;padding:0!important;align-items:center!important}#menuov #panel.pg08[data-pg-tab="feats"] .grid > .tile > .row.spread h4{line-height:1.2!important;white-space:normal!important;overflow:visible!important;text-overflow:clip!important;min-width:0!important}#menuov #panel.pg08[data-pg-tab="feats"] .grid > .tile > .row.spread .meta{font-size:11.5px!important;white-space:nowrap}</style>`); /* Feats title row: one line */
document.head.insertAdjacentHTML('beforeend',`<style>html body.phone-land #menuov #panel.pg08[data-pg-tab="feats"] .grid > .tile > .row.spread,html body.phone-app #menuov #panel.pg08[data-pg-tab="feats"] .grid > .tile > .row.spread{display:flex!important;flex-direction:row!important;justify-content:space-between!important;text-align:left!important}html body.phone-land #menuov #panel.pg08[data-pg-tab="feats"] .grid > .tile > .row.spread h4,html body.phone-app #menuov #panel.pg08[data-pg-tab="feats"] .grid > .tile > .row.spread h4{text-align:left!important}</style>`); /* Feats: title left, progress count right, on one line */

/* HOTFIX 0.4.8.6.1 (director: "can't close patch notes"): the popup card lives inside #stage, which blocks finger panning
   (touch-action:none, for casting), so a long card (What's new after several updates) could not be scrolled by finger and its
   only button sat thousands of px down. Phones: while a card is open the stage allows panning, the card scrolls with the finger,
   and the closing button row stays pinned to the bottom of the card. */
document.head.insertAdjacentHTML('beforeend',`<style>
html body.phone-land.ev-open #stage,html body.phone-app.ev-open #stage{touch-action:pan-y!important}
html body.phone-land #evcard #evin,html body.phone-app #evcard #evin{touch-action:pan-y!important;-webkit-overflow-scrolling:touch}
html body.phone-land #evcard #evin > .row:last-child:has([data-ev="skip"]),html body.phone-app #evcard #evin > .row:last-child:has([data-ev="skip"]){position:sticky;bottom:-10px;z-index:2;background:linear-gradient(rgba(15,24,40,0),rgb(15,24,40) 14px);margin-bottom:-10px!important;padding:16px 0 10px}
</style>`);

/* Notices on the water (director, 2026-11-18: "Travelled to ... blocks other UI"): #toast sat at the top centre, in the same row as the
   weather chip and the streak chip (both painted on the water at y 12-36) and the fps counter (44-68). Phones: notices sit below those
   rows, in the sky, where nothing else lives. Notices over a menu keep their own place (#menuov > #toast). */
document.head.insertAdjacentHTML('beforeend',`<style>html body.phone-land #stage > #toast,html body.phone-app #stage > #toast{top:76px!important;bottom:auto!important;height:auto!important;max-width:calc(100% - 40px)}</style>`);

/* Opening a menu over an info card (patch notes, test notes: one closing button only) closes that card first (director, 2026-11-18:
   "Unlock all doesn't unlock all maps"): while #evcard was open the game counted as busy (G.st 'event'), so every Travel here was
   greyed out behind the menu with no reason given. Cards with choices (chests, frenzy offers) are left alone. */
{ const _om=openMenu; openMenu=function(){ try{ if(MOB()){ const ev=$('evcard'); if(ev&&!ev.hidden){ const bs=ev.querySelectorAll('button'), sk=ev.querySelector('[data-ev="skip"]'); if(sk&&bs.length===1) closeEvent(); } } }catch(e){ oops('mobile/polish08:MOB#2',e); } return _om.apply(this,arguments); }; }

/* Side-panel badges never cover the name (director, 2026-11-18: "Challenges at high values for badge cover its UI"): badges are 16 px
   now (MB_UI, frame07), so they end above the name; "99+" also gets tight padding and sits 1 px further into the corner, which keeps
   it clear of "Challenges" (the longest name) on the shortest rail (667x375, 32 px buttons). */
document.head.insertAdjacentHTML('beforeend',`<style>html body.phone-land #catdock .cdb .cddot[class],html body.phone-land #menuov .secb .secdot[class],html body.phone-app #catdock .cdb .cddot[class],html body.phone-app #menuov .secb .secdot[class]{padding:0 3px!important;letter-spacing:-.4px}html body.phone-land #catdock .cdb .cddot,html body.phone-app #catdock .cdb .cddot{right:-6px!important}</style>`);

/* The scenery-thumbnail fix, the dock decoration cache, glow dots, Starfall sky events and tinted pets moved to src/cd_efficiency.js (2026-11-19): they draw the same picture with less work, so every platform gets them. */


/* Light and weather transitions on phones (director, 2026-11-19: drops to 30-40 fps "and keeps fluctuating back up to 60", worst in
   weather). Every light step rebuilds the whole scenery picture (v3land: 10-30 ms on a desktop, several times that on a phone); with
   14 night / 9 dusk / 6 weather steps that was a stall about every 1.5 s through dusk, dawn and every weather fade (measured: 30-40% of
   frames over 8 ms during those transitions, every water). Phones now use 5 / 3 / 2 steps and a 5 s cross-fade between them, so the
   light still flows smoothly but the scenery is rebuilt about a fifth as often. PC keeps its own steps. */
{ const _st=v3steps, _fd=v3fade; v3steps=function(){ return (MOB()&&!document.body.classList.contains('pch-on'))?[5,3,2]:_st(); }; v3fade=function(){ return (MOB()&&!document.body.classList.contains('pch-on'))?5:_fd(); }; }

document.head.insertAdjacentHTML("beforeend",`<style>body.chal-live #catdock .cdb[data-cd="chal"] .cddot{display:none!important}</style>`); /* the side panel follows the same rule: LIVE or a count, not both (2026-11-19) */
/* Search on phones (director, 2026-11-19, Pixel 10 / Android 17: "pop ups for keyboard are very weird... can't see search results or what
   you're typing ever"): the box sat 12% down the screen with results up to 52% of the screen tall, so the keyboard covered both. On
   phones the box now sits at the top and its results only use the space the keyboard leaves (visualViewport). */
{ const ov=()=>document.getElementById('searchov'); const fit=()=>{ const o=ov(); if(!o||o.hidden||!MOB()) return; const vv=window.visualViewport; const h=vv?vv.height:innerHeight; o.style.setProperty('--sv-h',Math.max(160,Math.round(h))+'px'); };
  if(window.visualViewport){ visualViewport.addEventListener('resize',fit); visualViewport.addEventListener('scroll',fit); } document.addEventListener('focusin',e=>{ if(e.target&&e.target.id==='searchq') setTimeout(fit,50); });
  document.head.insertAdjacentHTML('beforeend',`<style>
body.phone-app #searchov,body.phone-land #searchov{padding:max(8px,env(safe-area-inset-top)) max(10px,env(safe-area-inset-right)) 0 max(10px,env(safe-area-inset-left))!important;align-items:flex-start}
body.phone-app #searchov .sv-in,body.phone-land #searchov .sv-in{max-height:calc(var(--sv-h,100vh) - 16px);padding:10px;gap:6px}
body.phone-app #searchres,body.phone-land #searchres{max-height:none!important;flex:1 1 auto;min-height:0}
</style>`); }
/* Aquarium bank (director, 2026-11-19, Android: "Earning and Ready Coins value run underneath each other when numbers get too big"): the
   number columns had a fixed width (62 px), so 12,345,678 spilled into the next cell. Every cell now takes its content's width, and
   when the row is too narrow for very large amounts the buttons move to a second line instead of spilling out (checked by __qa). */
document.head.insertAdjacentHTML('beforeend',`<style>html body.phone-land #menuov #panel .aq07-bank:has(#tankbank),html body.phone-app #menuov #panel .aq07-bank:has(#tankbank){display:flex!important;flex-wrap:wrap!important;align-items:center;column-gap:6px!important;row-gap:4px!important}html body.phone-land #menuov #panel .aq07-bank:has(#tankbank) > *,html body.phone-app #menuov #panel .aq07-bank:has(#tankbank) > *{flex:0 0 auto!important}</style>`);
/* Reeling on phones (director, 2026-11-19: "when you're reeling in fish, too much ui covers the screen"): during a fight the bottom
   hint repeats what the fight banner already says, and Rest does nothing mid-fight, so both fade away while a fish is on the line and
   come back when it ends. The hint stays for the first 5 catches, while a new player is still learning the controls. */
{ let on=false; const _fr=frame; frame=function(now){ const want=MOB()&&G.st==='reeling'&&(S.stats.caught||0)>=5; if(want!==on){ on=want; document.body.classList.toggle('dl-reel',on); } return _fr.apply(this,arguments); };
  document.head.insertAdjacentHTML('beforeend',`<style>
body.phone-app #hint,body.phone-land #hint,body.phone-app #resttog,body.phone-land #resttog{transition:opacity .25s}
body.dl-reel #hint,body.dl-reel #resttog{opacity:0!important;pointer-events:none!important}
</style>`); }
document.head.insertAdjacentHTML('beforeend',`<style>
#menuov #panel .pg08-body:has(> .tp-room.tp8 .tp-empty){display:flex;flex-direction:column}
#menuov #panel .tp-room.tp8:has(.tp-empty){flex:1 1 auto;display:flex;flex-direction:column}
#menuov #panel .tp-room.tp8:has(.tp-empty) .tp-in{flex:1 1 auto;display:flex;flex-direction:column}
#menuov #panel .tp-room.tp8 .tp-empty{flex:1 1 auto;flex-direction:column;justify-content:center;text-align:center;gap:16px!important;padding:12px 0!important}
#menuov #panel .tp-room.tp8 .tp-empty p{max-width:52ch;margin:0 auto}
#menuov #panel .tp8-wall{display:flex;justify-content:center;gap:clamp(10px,3vw,28px);width:100%}
#menuov #panel .tp8-wall .tp-ghost{flex:0 1 150px;height:92px;margin:0!important}
</style>`);
/* No name twice (director, 2026-11-19: "Your tank" and "Your boat" stood as the tab AND as the heading right under it; standard:
   "No name is shown twice on one screen"). After every page draw and tab switch, the first visible heading of the shown part loses
   a leading repeat of the selected tab's name ("Your tank · holds 24 fish" → "holds 24 fish"), or hides when nothing else is left. */
{ const dedupe=()=>{ if(!MOB()) return; const P=$('panel'); if(!P) return; const sel=document.querySelector('#menuov .sect-nav [aria-selected="true"]'); if(!sel) return; const N=tabShownName(sel); if(!N) return;
    const body=P.querySelector('.pg08-body')||P; const h=[...body.querySelectorAll('h2,h3,h4,h5')].find(x=>x.offsetParent!==null); if(!h||h.dataset.dupDone===N) return;
    const t=h.textContent.trim(); if(t===N){ h.classList.add('dl-dupname'); h.dataset.dupDone=N; return; }
    if(t.startsWith(N+' ·')||t.startsWith(N+' -')){ const w=document.createTreeWalker(h,NodeFilter.SHOW_TEXT), texts=[]; let n; while(n=w.nextNode()) if(n.textContent.trim()) texts.push(n); const f=texts[0]; if(!f) return; if(f.textContent.trim()===N){ f.textContent=''; if(texts[1]) texts[1].textContent=texts[1].textContent.replace(/^\s*[·-]\s*/,''); } else f.textContent=f.textContent.replace(N,'').replace(/^\s*[·-]\s*/,''); const g=texts.find(x=>x.textContent.trim()); if(g) g.textContent=g.textContent.replace(/^(\s*)(\S)/,(m,s,c)=>s+c.toUpperCase()); h.dataset.dupDone=N; } };
  /* after every other renderPanel step (later files wrap it again and add their headings after this one runs) */
  AFTER_EVERY.push(()=>queueMicrotask(()=>{ try{ dedupe(); }catch(e){ oops('mobile/polish08:dedupe',e); } })); /* after every other renderPanel step: run by the one wrapper at the end of this file */
  /* twice after a tab switch: the page engine can show the new tab after the first run, which left "Decorate" under the Decorate tab until the next redraw (and then the list jumped up 35 px, found by __snapQC) */
  document.addEventListener('click',e=>{ if(e.target.closest&&e.target.closest('#menuov .sect-nav [data-sect]')){ const run=()=>{ try{ dedupe(); }catch(er){ oops('mobile/polish08:dedupe#2',er); } }; setTimeout(run,0); setTimeout(()=>setTimeout(run,0),0); } },true); /* the second pass queues behind the page engine's own zero-delay switch */
  PHONE_DEDUPE=dedupe; document.head.insertAdjacentHTML('beforeend','<style>#menuov #panel .dl-dupname{display:none!important}</style>'); }
var PHONE_DEDUPE;
/* Menu rail height (director, 2026-11-19, iPhone screenshots: the rail ended after "Quests"): its height came only from being stretched
   to its grid row, with buttons sized from 0. Chrome never shows the problem, Safari did. The rail now also asks for the full row
   height itself, and its buttons size from their content (ui_modern06), so it never depends on one mechanism. */
document.head.insertAdjacentHTML('beforeend','<style>html body.phone-land #menuov #tabs .secbar{height:100%!important}</style>');
/* Safety net (2026-11-19, the same screenshots again, from 0.4.8.7): the CSS above can't be checked on a real iPhone from here, so
   after every page render and every turn the rail is also measured: if it stops well short of the bottom of the menu or cuts its
   buttons off, it gets its height in pixels. Whatever Safari does with percentages, the rail reaches the bottom. */
{ const fit=()=>{ try{ if(!MOB()||!MENU_OPEN) return; const bar=document.querySelector('#menuov #tabs .secbar'), box=document.querySelector('#menuov .mo-in'); if(!bar||!box||bar.offsetParent===null) return;
      if(getComputedStyle(bar).position==='fixed') return; /* the narrow layout's bottom bar sizes itself */
      const r=bar.getBoundingClientRect(), b=box.getBoundingClientRect(), want=Math.floor(b.bottom-r.top-6);
      if(want>120&&(b.bottom-r.bottom>24||bar.scrollHeight>bar.clientHeight+1)) bar.style.setProperty('height',want+'px','important'); }catch(e){ oops('mobile/polish08:MOB#3',e); } };
  const later=()=>{ requestAnimationFrame(fit); setTimeout(fit,120); };
  AFTER_EVERY.push(later);
  addEventListener('resize',()=>{ const bar=document.querySelector('#menuov #tabs .secbar'); if(bar) bar.style.removeProperty('height'); later(); });
  if(/[?&]test\b/.test(location.search)) window.__fitRail=fit; }
/* the name a page tab shows (its own text, without a badge); data-sect can differ ("Dock" shows as "Your boat") */
function tabShownName(b){ return b?([...b.childNodes].filter(n=>n.nodeType===3).map(n=>n.textContent).join('').trim()||b.textContent.trim()):''; }
/* Doubled Settings (director, 2026-11-19, iPhone screenshot): inside Settings the gear button lit up gold next to the gold Settings
   tab, two lit "Settings" in one row. The gear only takes you to this section, so while you are in it the gear steps aside; the
   tabs (Settings, Save) say where you are. */
document.head.insertAdjacentHTML('beforeend','<style>body.phone-app #menuov .mo-tools [data-mo="settings"].on,body.phone-land #menuov .mo-tools [data-mo="settings"].on{display:none!important}</style>');
/* Narrow windows (split-screen; phones themselves are landscape-only), 2026-11-19, the director: "test what is best yourself and execute
   it": the side panel becomes a bottom bar of 8 buttons about 41 px wide. Measured at 360 px: even 8 px text (too small to read) cut
   "Challenges" and "Customize", so the bar shows icons only there; every button keeps its name as its label (title / aria-label),
   and the section you are in stays gold. */
document.head.insertAdjacentHTML('beforeend','<style>html body.phone-app #catdock .cdb .cdl{display:none!important}html body.phone-app #catdock .cdb{justify-content:center!important;align-items:center!important}html body.phone-app #catdock .cdb svg{width:22px!important;height:22px!important}</style>');
/* the menu's bar matches the bar on the water in narrow windows: all 8 sections visible without sideways scrolling, icons only, and
   count badges sit inside the button's top right corner (they poked into the next button and were clipped by the bar) */
document.head.insertAdjacentHTML('beforeend',`<style>
html body.phone-app #menuov #tabs .secbar{display:flex!important;flex-wrap:nowrap!important;overflow:visible!important}
html body.phone-app #menuov .secbar .secb{flex:1 1 0!important;min-width:0!important;width:auto!important;justify-content:center!important;padding:0!important}
html body.phone-app #menuov .secbar .secb .secl,html body.phone-app #menuov .secbar .secb .seclive{display:none!important}
html body.phone-app #menuov .secbar .secb .secdot[class],html body.phone-app #catdock .cdb .cddot[class]{top:2px!important;right:2px!important;transform:none!important}
</style>`);
/* Top bar with a long bait (2026-11-19, QA at 667 wide with "Glitter Jigs · 238"): every chip keeps its full width (frame07), so a
   long bait name pushed Search and Settings off the screen once Tasks and Live had already stepped aside. The Bait chip is the one
   that gives way: it shortens its name with "…" only when the bar runs out of room. */
document.head.insertAdjacentHTML('beforeend','<style>html body.phone-land .hud > #mbbait.stat,html body.phone-app .hud > #mbbait.stat{min-width:0!important;flex:0 1 auto!important}html body.phone-land .hud > #mbbait.stat > b,html body.phone-app .hud > #mbbait.stat > b{display:block;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}</style>');
/* C15 (director + Cam, 2026-11-20): on phones, a button beside Settings switches between the Aquarium and the Cooler while you are in
   either one (shown only on those two pages). */
{ const swapSync=()=>{ try{ if(!MOB()) return; const tools=document.querySelector('#menuov .mo-tools'); if(!tools) return;
    let b=tools.querySelector('.mo-swap'); if(!b){ b=document.createElement('button'); b.type='button'; b.className='mo-tb mo-swap';
      b.addEventListener('click',e=>{ e.stopPropagation(); openMenu(S.tab==='cooler'?'aquarium':'cooler'); }); const set=tools.querySelector('[data-mo="settings"]'); if(set) set.after(b); else tools.appendChild(b); }
    const on=S.tab==='cooler'||S.tab==='aquarium'; b.hidden=!on; if(on){ const to=S.tab==='cooler'?'Aquarium':'Cooler'; b.textContent=(to==='Aquarium'?'🐠 ':'🧊 ')+to; b.setAttribute('aria-label','Switch to the '+to); } }catch(e){ oops('mobile/polish08:MOB#4',e); } };
  /* kept in step with every page change: menu changes and page draws (2026-11-20: opening the Fish Log from a fish left the Cooler switch showing) */
  const _ms=menuSync; menuSync=function(){ const r=_ms.apply(this,arguments); swapSync(); return r; }; AFTER_EVERY.push(swapSync);
  /* Clean Pages 3: the steps that follow every page draw (names not repeated, the rail fitted, the Cooler switch) have one owner: this wrapper runs them in their old order */
  const _rp=renderPanel; renderPanel=function(){ const r=_rp.apply(this,arguments); for(const fn of AFTER_EVERY){ try{ fn(); }catch(e){ oops('mobile/polish08:fn',e); } } return r; }; }
document.head.insertAdjacentHTML('beforeend','<style>html body.phone-land #menuov .mo-tools > .mo-tb.mo-swap,html body.phone-app #menuov .mo-tools > .mo-tb.mo-swap{width:auto!important;min-width:0!important;padding:0 12px!important;font:800 13px var(--display,system-ui)!important;font-size:13px!important;color:#dbe7f3!important;white-space:nowrap}html body.phone-land #menuov .mo-tools > .mo-tb.mo-swap[hidden],html body.phone-app #menuov .mo-tools > .mo-tb.mo-swap[hidden]{display:none!important}html body.phone-land #menuov .mo-tools > .mo-tb.mo-swap::before,html body.phone-app #menuov .mo-tools > .mo-tb.mo-swap::before,html body.phone-land #menuov .mo-tools > .mo-tb.mo-swap::after,html body.phone-app #menuov .mo-tools > .mo-tb.mo-swap::after{content:none!important;display:none!important}</style>');
/* C12 (director + Cam, 2026-11-20): a chosen color keeps its own color and gets a gold box around it (the general "chosen chip" gold
   used to fill the whole swatch, so you couldn't see which color you had) */
document.head.insertAdjacentHTML('beforeend','<style>html body.phone-app #menuov .chips .sw[aria-pressed="true"],html body.phone-land #menuov .chips .sw[aria-pressed="true"]{background:var(--swc)!important;border-color:transparent!important;box-shadow:0 0 0 2px #0b1626,0 0 0 4px #ffd36a!important}</style>');
pageDone('games',P=>{ /* Fishmonger's Gamble with an empty cooler: the card's idle picture, like the other game cards (batch 2; the rest is in ui_boardwalk.js) */
  const c=[...P.querySelectorAll('.bwx-card')].find(x=>/Gamble/.test(x.textContent)); const m=c&&[...c.querySelectorAll('.meta')].find(x=>/cooler is empty/i.test(x.textContent));
  if(m&&!c.querySelector('.bwx-art')) m.insertAdjacentHTML('beforebegin','<div class="bwx-art" aria-hidden="true">🐟 ⚖️ 💰</div>'); });
