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
document.head.insertAdjacentHTML('beforeend',`<style>html body.phone-land #fpsbox,html body.phone-app #fpsbox{top:44px!important;bottom:auto!important;right:10px!important;left:auto!important} /* below the streak chip, which d_draw paints on the water at y 12-36 (HOTFIX 0.4.8.6.1: it covered it) */</style>`);
/* PERFORMANCE: switching menu tabs (director, 2026-11-18: "seems to be a performance problem from switching upper tabs in ui menus").
   Measured (desktop CPU, a phone is several times slower): a switch averaged 18 ms, the Fish Log 45 ms, Oddities 39 ms, Pets 31 ms.
   - pictures: only the first 12 fish pictures are drawn at once; the rest are drawn as they come into view (they were all drawn on every
     switch, about 10 ms on the Fish Log). Same for the Oddities pictures (waters08).
   - the page-tab row is measured on the next frame instead of in the middle of the switch (it forced an extra layout pass). */
{ const _pf=paintFish, N=12; let io=null;
  const show=c=>{ if(!c.isConnected||!c.dataset.fishlazy) return; c.setAttribute('data-fish',c.dataset.fishlazy); c.removeAttribute('data-fishlazy'); try{ _pf(c.parentElement); }catch(e){} };
  paintFish=function(P){ if(!MOB()||!P||!P.querySelectorAll||typeof IntersectionObserver!=='function') return _pf.apply(this,arguments);
    const all=[...P.querySelectorAll('canvas[data-fish]')]; if(all.length<=N) return _pf.apply(this,arguments);
    if(!io) io=new IntersectionObserver(es=>es.forEach(e=>{ if(e.isIntersecting){ io.unobserve(e.target); show(e.target); } }),{rootMargin:'240px'});
    const later=all.slice(N); later.forEach(c=>{ c.dataset.fishlazy=c.getAttribute('data-fish'); c.removeAttribute('data-fish'); });
    const r=_pf.apply(this,arguments); later.forEach(c=>io.observe(c)); return r; };
  if(/[?&]test\b/.test(location.search)) window.__lazyFish=()=>{ document.querySelectorAll('canvas[data-fishlazy]').forEach(show); }; /* tests: draw them all */ }
{ const _mp=menuPillView; menuPillView=function(sb,p){ if(MOB()){ requestAnimationFrame(()=>{ try{ _mp(sb,p); }catch(e){} }); return; } return _mp.apply(this,arguments); }; }
/* speed: the chip / tab rows are scrolled to the chosen one on the next frame instead of in the middle of the switch (menuTidy2 measured
   every row right after the page was built: a forced layout pass of 3-7 ms per switch) */
{ const _mt=menuTidy2; let q=0;
  /* HOTFIX 0.4.8.6.1: the cheap part of the tidy-up (marking the page header .dl-head / .dl-headw / .dl-dup, no layout reads) must run
     at once: page layers that rebuild right after renderPanel (aquarium07 hides its old header by that mark) depend on it. Only the
     rest (scrolling chip rows, which measures) waits for the next frame. Same logic as bm_ui04 menuTidy2's first lines. */
  const quick=()=>{ if(!MENU_OPEN) return; const P=$('panel'); if(!P) return; const on=$('tabs')&&$('tabs').querySelector('.subp.on');
    const h=P.querySelector(':scope > h2, :scope > .row > div > h2'); if(h){ const lbl=on?on.textContent.replace(/[\d\s]+/g,' ').trim().toLowerCase():''; const t=h.textContent.replace(/\s+/g,' ').trim().toLowerCase(); h.classList.toggle('dl-dup', !!lbl&&!!t&&lbl.includes(t)); }
    const hr=P.querySelector(':scope > .row.spread'); if(hr&&hr.querySelector('h2')){ const wide=[...hr.children].slice(1).some(c=>c.matches('select,input,.fld')||c.querySelector('select,input,.fld')); hr.classList.toggle('dl-head',!wide); hr.classList.toggle('dl-headw',wide); } };
  menuTidy2=function(){ if(MOB()){ try{ quick(); }catch(e){} if(!q) q=requestAnimationFrame(()=>{ q=0; try{ _mt(); }catch(e){} }); return; } return _mt.apply(this,arguments); }; try{ menuTidy=menuTidy2; }catch(e){} } /* the page switch calls the older alias menuTidy */
/* TROPHY ROOM fits one screen (director, 2026-11-18): a compact wall, each plaque just the fish and its name (about eight across);
   tap a plaque to see its details in a bar under the wall (rarity, weight, water, date) with To cooler. The intro line steps aside. */
{ const _rp=renderPanel; renderPanel=function(){ const r=_rp.apply(this,arguments); try{ if(!MOB()||S.tab!=='trophy') return r; const P=$('panel'), room=P.querySelector('.tp-room'); if(!room||room.classList.contains('tp8')) return r;
      room.classList.add('tp8'); const grid=room.querySelector('.tp-grid'); if(!grid) return r;
      let bar=room.querySelector('.tp8-bar'); if(!bar){ bar=document.createElement('div'); bar.className='tp8-bar'; bar.innerHTML='<span class="meta">Tap a trophy to see it up close.</span>'; grid.after(bar); }
      grid.querySelectorAll('.tp-item').forEach((it,i)=>{ it.tabIndex=0; it.setAttribute('role','button');
        it.addEventListener('click',e=>{ if(e.target.closest('.tp-out')) return; grid.querySelectorAll('.tp-item.sel').forEach(x=>x.classList.remove('sel')); it.classList.add('sel');
          const nm=it.querySelector('.tp-plate b'), sub=it.querySelector('.tp-plate span'), meta=it.querySelector('.tp-meta'), out=it.querySelector('.tp-out');
          bar.innerHTML=`<div class="tp8-info"><b>${nm?nm.innerHTML:''}</b><span class="meta">${sub?sub.textContent:''}${meta?' · '+meta.textContent:''}</span></div>`; if(out){ const c=out.cloneNode(true); c.classList.add('tp8-out'); bar.appendChild(c); } }); });
    }catch(e){ console.error(e); } return r; }; }
/* TIDE PASS: the "next Tide reward" is one slim row (small picture, name, what it is, levels to go) instead of a big card */
/* BOARDWALK: two wider game cards a row on phones (three narrow ones stretched each game to 360-560 px), game pictures capped */
/* "Waters" is called "Map" (director, 2026-11-18) */
{ const f=MENU_SECS.find(s=>s.id==='fish'); if(f){ f.name='Map'; f.short='Map'; }
  const b=$('tabs')&&$('tabs').querySelector(':scope > [data-tab="map"]'); if(b&&MOB()){ b.dataset.label='🗺️ Map'; for(const n of b.childNodes) if(n.nodeType===3&&/Waters/.test(n.textContent)) n.textContent=n.textContent.replace('Waters','Map'); }
  try{ SEARCH_IDX.forEach((e,i)=>{ if(e[1]==='map'&&e[0]==='Waters') SEARCH_IDX[i]=['Map (waters)',e[1],e[2],e[3]]; }); }catch(e){} }
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
{ const _rp=renderPanel; renderPanel=function(){ const r=_rp.apply(this,arguments); try{ if(!MOB()||S.tab!=='events') return r; const P=$('panel');
      P.querySelectorAll('.tile').forEach(t=>{ const h=t.querySelector('h4,b'); if(h&&/^Derby rewards/.test(h.textContent.trim())){ const m=t.querySelector(':scope > .meta, :scope > div > .meta'); if(m&&/heaviest/i.test(m.textContent)) m.style.display='none'; } }); }catch(e){} return r; }; }
/* FEATS (director: "Feats can definitely shrink in size overall when it comes to each card"): each card is two short lines and a thin
   bar (title + progress, then what to do + the reward), about half the height */
document.head.insertAdjacentHTML('beforeend',`<style>
html body.phone-land #menuov #panel.pg08[data-pg-tab="events"] .pg08-body > .pg08-note,html body.phone-app #menuov #panel.pg08[data-pg-tab="events"] .pg08-body > .pg08-note,html body.phone-land #menuov #panel.pg08[data-pg-tab="events"] .ev-h,html body.phone-app #menuov #panel.pg08[data-pg-tab="events"] .ev-h{display:none!important}
html body.phone-land #menuov #panel.pg08[data-pg-tab="feats"] .grid > .tile:not(.feat-cat),html body.phone-app #menuov #panel.pg08[data-pg-tab="feats"] .grid > .tile:not(.feat-cat){display:grid!important;grid-template-columns:minmax(0,1fr);grid-template-areas:"t" "m" "v";position:relative;align-items:center;gap:2px 8px!important;padding:6px 10px 9px!important;min-height:0!important}
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
{ const _om=openMenu; openMenu=function(){ try{ if(MOB()){ const ev=$('evcard'); if(ev&&!ev.hidden){ const bs=ev.querySelectorAll('button'), sk=ev.querySelector('[data-ev="skip"]'); if(sk&&bs.length===1) closeEvent(); } } }catch(e){} return _om.apply(this,arguments); }; }

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

