// =====================================================================
// Phones and tablets, round 8 polish (director, 2026-11-18: "ensure things that appear in multiple locations for mobile don't occur
// in multiple places" (tabs, headers), "find easier access for the stats tab, it's a useful feature, make sure people have easy access").
//  - One place for each thing: Settings no longer has a "Save & codes" section repeating the Save tab right next to it. Its gift
//    code and its erase / backup tools move into Save > Save codes, with the save codes they belong with.
//  - Stats is one tap from the side rail: it moves into Collection (Aquarium, Trophy Room, Fish Log, Stats) instead of hiding
//    behind the settings gear; the gear keeps Settings and Save. Your Level in the top bar also opens Stats (teal: tap me).
// Android + iPhone + tablets.
// =====================================================================
/* Stats is its own button on the side panel, right under Collection (director, 2026-11-18: "stats deserves its own tab on the
   side panel for mobile. It makes no sense to be in collection") */
{ for(const s of MENU_SECS){ const k=s.tabs.indexOf('stats'); if(k>=0) s.tabs.splice(k,1); }
  if(!MENU_SECS.some(s=>s.id==='stats')){ const at=MENU_SECS.findIndex(s=>s.id==='coll');
    MENU_SECS.splice(at<0?MENU_SECS.length:at+1,0,{id:'stats', name:'Stats', short:'Stats', tabs:['stats'], icon:'<path d="M4 20h16"/><path d="M7 20v-6"/><path d="M12 20V8"/><path d="M17 20v-9"/><path d="M5.5 9.5 10 6l4 3 4.5-4"/>'}); }
  const i=MENU_MORE.tabs.indexOf('stats'); if(i>=0) MENU_MORE.tabs.splice(i,1);
  /* the side panel's buttons, rebuilt with the new list (same markup as bm_ui04; the click handler finds buttons by data-sec) */
  const T=$('tabs'), bar=T&&T.querySelector('.secbar');
  if(bar){ const svg=p=>`<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${p}</svg>`;
    bar.querySelectorAll(":scope > .secb").forEach(b=>b.remove()); bar.insertAdjacentHTML("afterbegin",MENU_SECS.map(s=>`<button type="button" class="secb" data-sec="${s.id}" aria-pressed="false" title="${esc(s.name)}"><span class="seci">${svg(s.icon)}</span><span class="secl"><span class="secfull">${s.name}</span><span class="secshort">${s.short}</span></span><span class="seclive" hidden>LIVE</span><span class="secdot" hidden></span></button>`).join('')); /* the Collapse panel button at the end stays */
    try{ menuSubKey=''; }catch(e){} }
  /* the side panel on the fishing screen (#catdock, built once by bm_ui04 when the game starts) gets the same sections as the menu's:
     Waters, Upgrades, Collection, Stats, Challenges, Customize, Prestige (it still showed the old list) */
  { const CDn=document.getElementById('catdock'); if(CDn){ const olds=[...CDn.querySelectorAll(':scope > .cdb')], ref=olds.length?olds[olds.length-1].nextSibling:null;
      const tpl=document.createElement('template'); tpl.innerHTML=MENU_SECS.map(s=>`<button type="button" class="cdb" data-cd="${s.id}" title="${esc(s.name)}" aria-label="${esc(s.name)}"><svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${s.icon}</svg><span class="cdl">${s.short}</span><span class="cddot" hidden></span></button>`).join('');
      CDn.insertBefore(tpl.content,ref); olds.forEach(b=>b.remove()); } }
  try{ if(typeof SECT==='object'&&SECT.settings==='Save & codes') delete SECT.settings; }catch(e){} }

/* the Level chip opens Stats */
{ const hook=()=>{ const lv=document.querySelector('.hud > .st-lvl'); if(!lv||lv.dataset.mbtap) return; lv.dataset.mbtap='1'; lv.setAttribute('role','button'); lv.tabIndex=0; lv.title='Your level and all your stats. Tap to open Stats.';
    lv.addEventListener('pointerdown',e=>{ if(MOB()) e.stopPropagation(); });
    lv.addEventListener('click',e=>{ if(!MOB()) return; e.stopPropagation(); e.preventDefault(); try{ startAudio(); }catch(er){} openMenu('stats'); }); };
  setTimeout(hook,0); setTimeout(hook,1500); }

/* Settings: no "Save & codes" section; Save > Save codes gets the gift code and the erase / backup tools */
{ const _rp=renderPanel; renderPanel=function(){ const r=_rp.apply(this,arguments); try{ if(!MOB()) return r; const P=$('panel'); if(!P) return r;
    if(S.tab==='settings'){ const nav=P.querySelector('.aq07-sheet > .bwx-nav, .bwx-nav.sect-nav'); const b=nav&&nav.querySelector('[data-sect="Save & codes"]');
      if(b){ const was=b.getAttribute('aria-selected')==='true'; b.remove(); const n=nav.querySelectorAll(':scope > button').length; nav.style.setProperty('grid-template-columns',`repeat(${n<=4?n:n<=6?3:4},minmax(0,1fr))`,'important');
        P.querySelectorAll('.pg08-body > .tile, .pg08-body > details').forEach(t=>{ if(/Move progress|Gift code|Danger zone/.test(t.textContent)&&!t.closest('.grid')) t.remove(); });
        if(was){ const f=nav.querySelector('[data-sect]'); if(f) f.click(); } } }
    if(S.tab==='save'&&!P.querySelector('#giftin')){ const host=[...P.querySelectorAll('.pg08-body > .grid, .pg08-body > *')].find(x=>/Your save code/.test(x.textContent));
      if(host){ host.insertAdjacentHTML('beforeend',`<div class="tile mb-gift"><b>🎁 Gift code</b><div class="meta">Got a gift code from a friend? Type it here.</div><div class="row" style="gap:8px;margin-top:8px;flex-wrap:nowrap"><input id="giftin" maxlength="24" placeholder="Gift code" autocapitalize="characters" style="flex:1;min-width:0;background:#0a161d;color:var(--ink);border:1px solid var(--line);border-radius:9px;padding:8px;text-transform:uppercase"><button class="btn sm" data-act="redeem">Redeem</button></div></div>`);
        try{ host.insertAdjacentHTML('beforeend',dangerHTML()); }catch(e){} } }
  }catch(e){ console.error(e); } return r; }; }

/* Aquarium (director, 2026-11-18: "Tank doesn't show tank size, upgrade lacks proper description"):
   - the strip under the tank gets a Tank cell: fish on display / how many it holds
   - Your tank's heading says how many fish it holds, and the upgrade says what you get ("Room for 8 fish") with a line explaining
     it: how many more fish, what that means for earnings and boosts, and the price */
{ const _rp=renderPanel; renderPanel=function(){ const r=_rp.apply(this,arguments); try{ if(!MOB()||S.tab!=='aquarium') return r; const P=$('panel'); if(!P||!P.classList.contains('aq07')) return r;
    const cap=aqCap(), n=S.tank.length, bank=P.querySelector('.aq07-bank');
    if(bank&&!bank.querySelector('.mb-tankcell')){ const cells=[...bank.children].filter(c=>c.tagName==='DIV'); const last=cells[cells.length-1];
      const cell=document.createElement('div'); cell.className='mb-tankcell'; cell.title='Fish on display / how many your tank holds';
      cell.innerHTML=`<div class="sub">Tank</div><b>${n} / ${cap}</b>`; if(last) last.after(cell); else bank.prepend(cell); }
    const hr=P.querySelector('.aq07-sec-tank > .aq07-h'); if(hr&&!hr.querySelector('.mb-tankcap')){ const h2=hr.querySelector('h2'); if(h2) h2.insertAdjacentHTML('beforeend',` <span class="mb-tankcap">· holds ${cap} fish</span>`);
      const buy=hr.querySelector('[data-act="buytank"]'); const cost=TANK_COST[S.tankSlots];
      if(buy&&cost!=null){ S.tankSlots++; const nx=aqCap(); S.tankSlots--; const more=nx-cap;
        buy.innerHTML=`Room for ${nx} fish · <span class="coin">${fmt(cost)}</span>`; buy.title='A bigger tank: '+cap+' → '+nx+' fish';
        hr.insertAdjacentHTML('afterend',`<p class="meta mb-tankwhy">A bigger tank holds <b>${more} more fish</b> (${cap} → ${nx}). Every fish on display earns coins from visitors and adds its boost, so more room means more coins and stronger boosts.${S.money<cost?` You need <span class="coin">${fmt(cost-S.money)}</span> more.`:''}</p>`); }
      else if(cost==null) hr.insertAdjacentHTML('afterend',`<p class="meta mb-tankwhy">Your tank is as big as it gets: ${cap} fish.</p>`); }
  }catch(e){ console.error(e); } return r; }; }

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
  const _rp=renderPanel; renderPanel=function(){ const r=_rp.apply(this,arguments); try{ if(!MOB()||S.tab!=='rods') return r; const P=$('panel'); const box=P&&P.querySelector('.rp-box'), now=P&&P.querySelector('.tile.rodnow'); if(!box||!now) return r;
      P.querySelectorAll('h2').forEach(h=>{ if(/^(Rod rack|Attachments)$/.test(h.textContent.trim())) h.classList.add('rp8-dup'); }); /* the tab above already names it */
      now.after(box); const sync=()=>{ box.style.display=now.style.display; }; sync(); new MutationObserver(sync).observe(now,{attributes:true,attributeFilter:['style']}); /* shown and hidden with Your rod */
    }catch(e){ console.error(e); } return r; }; }

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
html body.phone-app #menuov #panel.aq07 .aq07-bank:has(.mb-tankcell),html body.phone-land #menuov #panel.aq07 .aq07-bank:has(.mb-tankcell){grid-template-columns:minmax(0,1fr) minmax(0,1fr) minmax(0,.8fr) auto auto!important}
html body.phone-app #menuov #panel.aq07 .aq07-bank .mb-tankcell b,html body.phone-land #menuov #panel.aq07 .aq07-bank .mb-tankcell b{font:800 14px var(--display)!important;color:var(--ink)}
@media (orientation:landscape) and (max-height:560px) and (max-width:760px){ html body.phone-land #menuov #panel.aq07 .aq07-bank:has(.mb-tankcell){grid-template-columns:repeat(6,minmax(0,1fr))!important} html body.phone-land #menuov #panel.aq07 .aq07-bank:has(.mb-tankcell) > div{grid-column:span 2} html body.phone-land #menuov #panel.aq07 .aq07-bank:has(.mb-tankcell) > .btn{grid-column:span 3} }
html body.phone-app #menuov #panel.aq07 .mb-tankcap,html body.phone-land #menuov #panel.aq07 .mb-tankcap{font:700 13px var(--display);color:#9fb3c8;white-space:nowrap}
html body.phone-app #menuov #panel.aq07 .mb-tankwhy,html body.phone-land #menuov #panel.aq07 .mb-tankwhy{margin:2px 0 8px!important;font-size:12.5px!important;line-height:1.4;color:#b8c8d6}
html body.phone-land .hud > .st-lvl[data-mbtap],html body.phone-app .hud > .st-lvl[data-mbtap]{background:linear-gradient(180deg,#1f8a86,#14666a)!important;border:1px solid #7fe3c4!important;box-shadow:0 3px 10px #0007!important;color:#fff!important;cursor:pointer}
html body.phone-land .hud > .st-lvl[data-mbtap] .lbl,html body.phone-app .hud > .st-lvl[data-mbtap] .lbl{color:#c8fff0!important}
html body.phone-land .hud > .st-lvl[data-mbtap]:active,html body.phone-app .hud > .st-lvl[data-mbtap]:active{transform:translateY(1px)}
</style>`);
/* Skills (director: "In skill tabs it doesn't make sense for each category to have a badge, just the skill points"): the category tabs
   carry no counts; your unspent skill points stay the one badge (the Skills tab and the side panel) */
{ const _rp=renderPanel; renderPanel=function(){ const r=_rp.apply(this,arguments); try{ if(MOB()&&S.tab==='skills') document.querySelectorAll('#panel .bwx-nav > button[data-sect] .sdot').forEach(d=>d.remove()); }catch(e){} return r; }; }
/* Skills: an XP bar next to your Level (director, 2026-11-18: "We could use a xp bar next to the Level that functions and looks neat
   in this tab"). Fills with your XP toward the next level and says how much ("120 / 400 XP"); it follows every catch live while the
   page is open (a light check twice a second, only on this page) and fills up in a short glide. */
{ const xpHTML=()=>{ const need=xpNeed(S.lvl), k=Math.max(0,Math.min(1,S.xp/need)); return `<span class="mb-xpbar" role="progressbar" aria-label="XP to level ${S.lvl+1}" aria-valuemin="0" aria-valuemax="${need}" aria-valuenow="${Math.floor(S.xp)}"><i style="width:${(k*100).toFixed(1)}%"></i></span><span class="mb-xpt">${fmt(Math.floor(S.xp))} / ${fmt(need)} XP</span>`; };
  let last='', tm=0;
  const paint=()=>{ const P=$('panel'); if(!MOB()||S.tab!=='skills'||!P){ clearInterval(tm); tm=0; return; } const cell=P.querySelector('.mb-lvcell'); if(!cell){ clearInterval(tm); tm=0; return; }
    const key=S.lvl+'|'+Math.floor(S.xp); if(key===last) return; last=key; const b=cell.querySelector('b'); if(b) b.textContent=S.lvl; const w=cell.querySelector('.mb-xp'); if(!w) return;
    const need=xpNeed(S.lvl), k=Math.max(0,Math.min(1,S.xp/need)), bar=w.querySelector('.mb-xpbar'); w.querySelector('i').style.width=(k*100).toFixed(1)+'%'; w.querySelector('.mb-xpt').textContent=fmt(Math.floor(S.xp))+' / '+fmt(need)+' XP'; bar.setAttribute('aria-valuenow',Math.floor(S.xp)); bar.setAttribute('aria-valuemax',need); bar.setAttribute('aria-label','XP to level '+(S.lvl+1)); };
  const _rp=renderPanel; renderPanel=function(){ const r=_rp.apply(this,arguments); try{ if(!MOB()||S.tab!=='skills') return r; const P=$('panel'); const bank=P&&P.querySelector('.pg08-bank'); if(!bank) return r;
      const cell=[...bank.children].find(c=>c.tagName==='DIV'&&/^Level\b/.test((c.querySelector('.sub')||{}).textContent||'')); if(!cell||cell.querySelector('.mb-xp')) return r;
      cell.classList.add('mb-lvcell'); cell.title='Your XP toward the next level. Catches give XP; every level gives a skill point.'; cell.insertAdjacentHTML('beforeend',`<span class="mb-xp">${xpHTML()}</span>`); last=S.lvl+'|'+Math.floor(S.xp);
      if(!tm) tm=setInterval(paint,500); }catch(e){ console.error(e); } return r; }; }

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
document.head.insertAdjacentHTML('beforeend',`<style>html body.phone-land #fpsbox,html body.phone-app #fpsbox{top:10px!important;bottom:auto!important;right:10px!important}</style>`);
