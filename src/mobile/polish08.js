// =====================================================================
// Phones and tablets, round 8 polish (director, 2026-11-18: "ensure things that appear in multiple locations for mobile don't occur
// in multiple places" (tabs, headers), "find easier access for the stats tab, it's a useful feature, make sure people have easy access").
//  - One place for each thing: Settings no longer has a "Save & codes" section repeating the Save tab right next to it. Its gift
//    code and its erase / backup tools move into Save > Save codes, with the save codes they belong with.
//  - Stats is one tap from the side rail: it moves into Collection (Aquarium, Trophy Room, Fish Log, Stats) instead of hiding
//    behind the settings gear; the gear keeps Settings and Save. Your Level in the top bar also opens Stats (teal: tap me).
// Android + iPhone + tablets.
// =====================================================================
{ const coll=MENU_SECS.find(s=>s.id==='coll'); if(coll&&!coll.tabs.includes('stats')) coll.tabs.push('stats');
  const i=MENU_MORE.tabs.indexOf('stats'); if(i>=0) MENU_MORE.tabs.splice(i,1);
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

document.head.insertAdjacentHTML('beforeend',`<style>
html body.phone-land .hud > .st-lvl[data-mbtap],html body.phone-app .hud > .st-lvl[data-mbtap]{background:linear-gradient(180deg,#1f8a86,#14666a)!important;border:1px solid #7fe3c4!important;box-shadow:0 3px 10px #0007!important;color:#fff!important;cursor:pointer}
html body.phone-land .hud > .st-lvl[data-mbtap] .lbl,html body.phone-app .hud > .st-lvl[data-mbtap] .lbl{color:#c8fff0!important}
html body.phone-land .hud > .st-lvl[data-mbtap]:active,html body.phone-app .hud > .st-lvl[data-mbtap]:active{transform:translateY(1px)}
</style>`);
