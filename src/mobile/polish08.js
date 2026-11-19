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

document.head.insertAdjacentHTML('beforeend',`<style>
html body.phone-app #menuov #panel.aq07 .aq07-bank,html body.phone-land #menuov #panel.aq07 .aq07-bank{grid-template-columns:minmax(0,1fr) minmax(0,1fr) minmax(0,.8fr) auto auto!important}
html body.phone-app #menuov #panel.aq07 .aq07-bank .mb-tankcell b,html body.phone-land #menuov #panel.aq07 .aq07-bank .mb-tankcell b{font:800 14px var(--display)!important;color:var(--ink)}
@media (orientation:landscape) and (max-height:560px) and (max-width:760px){ html body.phone-land #menuov #panel.aq07 .aq07-bank{grid-template-columns:repeat(3,minmax(0,1fr))!important} }
html body.phone-app #menuov #panel.aq07 .mb-tankcap,html body.phone-land #menuov #panel.aq07 .mb-tankcap{font:700 13px var(--display);color:#9fb3c8;white-space:nowrap}
html body.phone-app #menuov #panel.aq07 .mb-tankwhy,html body.phone-land #menuov #panel.aq07 .mb-tankwhy{margin:2px 0 8px!important;font-size:12.5px!important;line-height:1.4;color:#b8c8d6}
html body.phone-land .hud > .st-lvl[data-mbtap],html body.phone-app .hud > .st-lvl[data-mbtap]{background:linear-gradient(180deg,#1f8a86,#14666a)!important;border:1px solid #7fe3c4!important;box-shadow:0 3px 10px #0007!important;color:#fff!important;cursor:pointer}
html body.phone-land .hud > .st-lvl[data-mbtap] .lbl,html body.phone-app .hud > .st-lvl[data-mbtap] .lbl{color:#c8fff0!important}
html body.phone-land .hud > .st-lvl[data-mbtap]:active,html body.phone-app .hud > .st-lvl[data-mbtap]:active{transform:translateY(1px)}
</style>`);
