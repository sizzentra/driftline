// =====================================================================
// Phones and tablets, round 8: Waters and Prestige (director, 2026-11-18: "Fix Set Sail again page with modern adjustments, areas are
// stretched out and not properly adjusted to fill the space available, Waters section should snap you back to your current water than
// the top of the list" / "consider adding set sail again to its own tab on the mobile side panel under customize under a new Prestige
// category, bringing Pearl relics with it" / "with the space free then cleanup waters and make it look neater and add some QOL").
//  - PRESTIGE: a new side-panel button under Customize. Its page has two sections, Set sail again (voyages, Legacy, milestones) and
//    Pearl relics; the strip on top shows your Wisdom Pearls, which voyage you are on and the bonus your pearls give.
//  - WATERS keeps only the waters. Each one is a compact card: its picture, name, depth and fish strength, a bar of the species you have
//    found there, and one button. The water you are at says "You are here" (no dead button), locked waters show what they still need,
//    and while a line is out the Travel buttons say why they wait. The flavour line moves to the card's long-press text.
//  - Opening Waters takes you to the water you are at, not the top of the list.
// Android + iPhone + tablets. (PC keeps its Waters page with all three sections.)
// =====================================================================
{ /* the Prestige tab: a hidden tab button (the menus find pages through these) + its place on the side panel */
  const T=$('tabs'); if(T&&!T.querySelector(':scope > [data-tab="prestige"]')){ const b=document.createElement('button'); b.setAttribute('role','tab'); b.type='button'; b.dataset.tab='prestige'; b.dataset.label='🌟 Prestige'; b.setAttribute('aria-selected','false'); b.hidden=true; b.textContent='🌟 Prestige'; const sb=T.querySelector('.secbar'); if(sb) T.insertBefore(b,sb); else T.appendChild(b); }
  if(!MENU_SECS.some(s=>s.id==='prestige')){ const at=MENU_SECS.findIndex(s=>s.id==='cust'); MENU_SECS.splice(at<0?MENU_SECS.length:at+1,0,{id:'prestige', name:'Prestige', short:'Prestige', tabs:['prestige'], icon:'<circle cx="12" cy="13" r="6.5"/><path d="M9.2 10.6a3.4 3.4 0 0 1 3-1.8"/><path d="M12 3.5v2M6.2 5.6l1.3 1.5M17.8 5.6l-1.3 1.5"/>'}); }
  try{ SEARCH_IDX.forEach(e=>{ if(e[1]==='map'&&/^(Set sail again|Pearl relics)/.test(e[0])) e[1]='prestige'; }); }catch(e){}
  try{ PAGE_DESC.prestige='Set sail again for Wisdom Pearls, and trade pearls for permanent relics'; }catch(e){}
}
/* the Prestige page is drawn through the game's normal page drawing (so the side panel, the tabs and every page helper update as   usual): the game draws unknown pages with renderCooler, which draws Prestige here when Prestige is the page */{ const _rc=renderCooler; renderCooler=function(P){ if(MOB()&&S.tab==='prestige'&&P){ P.innerHTML='<div class="row spread"><div><h2 class="dl-dup">Prestige</h2></div></div>'+renderVoyage()+relicHTML(); return; } return _rc.apply(this,arguments); }; }
{ let lastTab='';
  const _rp=renderPanel; renderPanel=function(){ const P=$('panel'), mob=MOB(), opened=S.tab!==lastTab; lastTab=S.tab;
    const r=_rp.apply(this,arguments); if(!mob||S.tab!=='map'||!P) return r;
    try{ /* Waters: the voyage and relic sections live in Prestige now */
      P.querySelectorAll(':scope > .jsec').forEach(j=>{ const h=j.querySelector('h2'); if(h&&/^(Set sail again|Pearl relics)/.test(h.textContent.trim())) j.remove(); });
      P.querySelectorAll(':scope > .sect-nav').forEach(n=>n.remove());
      const grid=P.querySelector(':scope > .grid'); if(!grid) return r; grid.classList.add('wt8-grid');
      for(const card of grid.querySelectorAll(':scope > .tile.loc')){ const h4=card.querySelector('h4'), L=h4&&LOCS.find(l=>l.name===h4.textContent.trim()); if(!L) continue;
        const metas=[...card.querySelectorAll(':scope > .meta')], blurb=metas[0], req=metas.find(m=>/fish caught at/.test(m.textContent)), btn=card.querySelector(':scope > button'), th=card.querySelector(':scope > .sw2');
        const sps=spAt(L.id), got=caughtAt(L.id), here=S.loc===L.id, open=S.unlocked.includes(L.id);
        card.title=(blurb?blurb.textContent.trim():''); card.classList.add('wt8');
        const info=document.createElement('div'); info.className='wt8-info';
        info.innerHTML=`<div class="wt8-top"><h4>${esc(L.name)}</h4></div><div class="meta wt8-sub">Depth ${esc(L.depth)}</div>${strStandHTML(sps)}<div class="wt8-sp"><span class="wt8-bar"><i style="width:${(got/sps.length*100).toFixed(1)}%"></i></span><span class="meta" title="Species found here">${got}/${sps.length} fish</span></div>`;
        if(req&&!open){ req.classList.add('wt8-req'); info.appendChild(req); }
        if(here) info.insertAdjacentHTML('beforeend','<span class="wt8-here">You are here</span>');
        if(btn&&!here){ btn.classList.add('wt8-btn'); if(open&&btn.disabled) btn.title='Reel in your line first'; info.appendChild(btn); }
        [...card.children].forEach(c=>{ if(c!==th) c.remove(); }); card.appendChild(info); }
      if(opened){ /* opening Waters: go to the water you are at */ setTimeout(()=>{ const c=grid.querySelector('.tile.loc.here'), body=c&&c.closest('.aq07-body,.pg08-body'); if(c&&body){ const top=c.getBoundingClientRect().top-body.getBoundingClientRect().top+body.scrollTop-8; body.scrollTop=Math.max(0,top); } },0); }
    }catch(e){ console.error(e); } return r; }; }
document.head.insertAdjacentHTML('beforeend',`<style>
html body.phone-land #menuov #panel.pg08 .pg08-body .grid.wt8-grid:not(.sect-one),html body.phone-app #menuov #panel.pg08 .pg08-body .grid.wt8-grid:not(.sect-one){grid-template-columns:repeat(auto-fill,minmax(280px,1fr))!important;gap:8px!important}
html body.phone-land #menuov #panel.pg08 .tile.loc.wt8,html body.phone-app #menuov #panel.pg08 .tile.loc.wt8{display:flex!important;flex-direction:row!important;align-items:stretch!important;gap:10px!important;padding:8px!important;min-height:0!important}
html body.phone-land #menuov #panel.pg08 .tile.loc.wt8 > .sw2,html body.phone-app #menuov #panel.pg08 .tile.loc.wt8 > .sw2{flex:0 0 96px!important;width:96px!important;height:auto!important;min-height:64px;margin:0!important;border-radius:9px!important;background-size:cover!important;background-position:center!important}
html body.phone-land #menuov #panel.pg08 .tile.loc.wt8.here,html body.phone-app #menuov #panel.pg08 .tile.loc.wt8.here{border-color:#7fe3c4!important;box-shadow:0 0 0 1px #7fe3c4 inset!important}
html body.phone-land #menuov #panel.pg08 .wt8-info,html body.phone-app #menuov #panel.pg08 .wt8-info{display:flex;flex-direction:column;gap:3px;min-width:0;flex:1 1 auto}
html body.phone-land #menuov #panel.pg08 .wt8-top,html body.phone-app #menuov #panel.pg08 .wt8-top{display:flex;align-items:center;gap:8px;min-width:0}
html body.phone-land #menuov #panel.pg08 .wt8-top h4,html body.phone-app #menuov #panel.pg08 .wt8-top h4{margin:0!important;font-size:14.5px!important;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;min-width:0}
html body.phone-land #menuov #panel.pg08 .wt8-here,html body.phone-app #menuov #panel.pg08 .wt8-here{margin-top:auto;display:flex;align-items:center;justify-content:center;min-height:36px;border-radius:12px;border:1px solid #7fe3c4;background:#7fe3c41a;color:#bff5e3;font:800 13px var(--display,system-ui)}
html body.phone-land #menuov #panel.pg08 .wt8-sub,html body.phone-app #menuov #panel.pg08 .wt8-sub{font-size:11.5px!important;line-height:1.3!important;margin:0!important;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
html body.phone-land #menuov #panel.pg08 .wt8-sp,html body.phone-app #menuov #panel.pg08 .wt8-sp{display:flex;align-items:center;gap:8px}
html body.phone-land #menuov #panel.pg08 .wt8-sp .meta,html body.phone-app #menuov #panel.pg08 .wt8-sp .meta{font-size:11px!important;white-space:nowrap;margin:0!important}
html body.phone-land #menuov #panel.pg08 .wt8-bar,html body.phone-app #menuov #panel.pg08 .wt8-bar{position:relative;flex:1 1 auto;height:6px;border-radius:999px;background:#0a161d;box-shadow:inset 0 0 0 1px #ffffff14;overflow:hidden}
html body.phone-land #menuov #panel.pg08 .wt8-bar > i,html body.phone-app #menuov #panel.pg08 .wt8-bar > i{position:absolute;left:0;top:0;bottom:0;border-radius:999px;background:linear-gradient(90deg,#7fe3c4,#5fb4ff)}
html body.phone-land #menuov #panel.pg08 .wt8-req,html body.phone-app #menuov #panel.pg08 .wt8-req{font-size:11px!important;margin:0!important}
html body.phone-land #menuov #panel.pg08 .wt8-btn,html body.phone-app #menuov #panel.pg08 .wt8-btn{margin-top:auto!important;width:100%!important}
html body.phone-land #menuov #panel.pg08[data-pg-tab="prestige"] .jsec > h2,html body.phone-app #menuov #panel.pg08[data-pg-tab="prestige"] .jsec > h2{display:none!important}
</style>`);
/* the side panel's first section is "Catch" (director: "consider renaming Fishing"): it holds your Cooler and the Waters, your catch
   and where you catch it; "Fishing" said nothing about what is inside */
{ const f=MENU_SECS.find(s=>s.id==='fish'); if(f){ f.name='Catch'; f.short='Catch'; } }
/* Prestige's cards (Voyage, milestones, relics) need room for their numbers: at least 300 px each */
document.head.insertAdjacentHTML('beforeend',`<style>
html body.phone-land #menuov #panel.pg08[data-pg-tab="prestige"] .pg08-body .grid:not(.sect-one),html body.phone-app #menuov #panel.pg08[data-pg-tab="prestige"] .pg08-body .grid:not(.sect-one){grid-template-columns:repeat(auto-fill,minmax(300px,1fr))!important}
</style>`);
/* Collection holds the Aquarium and the Trophy Room (director: "fish tab needs to be removed from Collection ... it has its own clear
   ui on the top header already"): the Fish Log opens from its own chip in the top bar */
{ const c=MENU_SECS.find(s=>s.id==='coll'); if(c) c.tabs=c.tabs.filter(t=>t!=='journal'); }
/* the Cooler opens from its chip in the top bar only (director: "it should also only appear from clicking the top panel"); the side
   panel's first section then holds just the Waters, so it is called Waters, with a map icon */
{ const f=MENU_SECS.find(s=>s.id==='fish'); if(f){ f.tabs=f.tabs.filter(t=>t!=='cooler'); f.name='Map'; f.short='Map'; /* director: rename Waters to Map */ f.icon='<path d="M9 4.5 3.5 6.5v13l5.5-2 6 2 5.5-2v-13l-5.5 2z"/><path d="M9 4.5v13M15 6.5v13"/>'; } }
/* Cooler (director: "very large, the filter takes up way too much space, consider a rework"):
   - the Sell all filter is one slim line: "Sell all:" then rarity, max price and a Shinies switch
   - the fishmonger's wish is a one-line banner
   - no intro line or help box (every row already shows what a fish earns in the tank; the buttons explain themselves on long-press)
   - fish sit two a row on wider phones */
{ const _rp=renderPanel; renderPanel=function(){ const r=_rp.apply(this,arguments); try{ if(!MOB()||S.tab!=='cooler') return r; const P=$('panel'); if(!P) return r;
      const t=P.querySelector('.sellf .fld-title'); if(t) t.textContent='Sell all:';
      const inp=P.querySelector('.sellf [data-sp]'); if(inp) inp.placeholder='Max price';
      const sh=P.querySelector('.sellf [data-ssh]'); if(sh&&!sh.dataset.mb8){ sh.dataset.mb8='1'; sh.innerHTML='<span class="ssh-star" aria-hidden="true">✦</span> Shinies'; }
      const dm=[...P.querySelectorAll('.tile')].find(x=>/fishmonger wants/i.test(x.textContent)); if(dm) dm.classList.add('cl8-dm');
    }catch(e){ console.error(e); } return r; }; }
document.head.insertAdjacentHTML('beforeend',`<style>
html body.phone-land #menuov #panel.pg08[data-pg-tab="cooler"] .pg08-body > .pg08-note,html body.phone-land #menuov #panel.pg08[data-pg-tab="cooler"] .mb-help,html body.phone-app #menuov #panel.pg08[data-pg-tab="cooler"] .pg08-body > .pg08-note,html body.phone-app #menuov #panel.pg08[data-pg-tab="cooler"] .mb-help{display:none!important}
html body.phone-land #menuov #panel.pg08[data-pg-tab="cooler"] .sellf,html body.phone-app #menuov #panel.pg08[data-pg-tab="cooler"] .sellf{display:flex!important;flex-direction:row!important;align-items:center!important;flex-wrap:wrap!important;gap:6px 8px!important;padding:6px 10px!important;margin:0 0 8px!important;min-height:0!important}
html body.phone-land #menuov #panel.pg08[data-pg-tab="cooler"] .sellf .fld-title,html body.phone-app #menuov #panel.pg08[data-pg-tab="cooler"] .sellf .fld-title{font:800 12px var(--display,system-ui)!important;margin:0!important;white-space:nowrap;color:#cfe0ee;flex:0 0 auto!important;width:auto!important;display:block!important}
html body.phone-land #menuov #panel.pg08[data-pg-tab="cooler"] .sellf .fld,html body.phone-app #menuov #panel.pg08[data-pg-tab="cooler"] .sellf .fld{display:flex!important;flex-direction:row!important;align-items:center!important;margin:0!important;padding:0!important;gap:0!important;min-width:0}
html body.phone-land #menuov #panel.pg08[data-pg-tab="cooler"] .sellf .fld-l,html body.phone-app #menuov #panel.pg08[data-pg-tab="cooler"] .sellf .fld-l{display:none!important}
html body.phone-land #menuov #panel.pg08[data-pg-tab="cooler"] .sellf select,html body.phone-land #menuov #panel.pg08[data-pg-tab="cooler"] .sellf input,html body.phone-land #menuov #panel.pg08[data-pg-tab="cooler"] .sellf .chipb,html body.phone-app #menuov #panel.pg08[data-pg-tab="cooler"] .sellf select,html body.phone-app #menuov #panel.pg08[data-pg-tab="cooler"] .sellf input,html body.phone-app #menuov #panel.pg08[data-pg-tab="cooler"] .sellf .chipb{height:32px!important;min-height:32px!important;margin:0!important;font-size:12.5px!important}
html body.phone-land #menuov #panel.pg08[data-pg-tab="cooler"] .sellf input,html body.phone-app #menuov #panel.pg08[data-pg-tab="cooler"] .sellf input{width:96px!important}
html body.phone-land #menuov #panel.pg08[data-pg-tab="cooler"] .tile.cl8-dm,html body.phone-app #menuov #panel.pg08[data-pg-tab="cooler"] .tile.cl8-dm{padding:6px 10px!important;margin:0 0 8px!important;gap:10px!important;min-height:0!important}
html body.phone-land #menuov #panel.pg08[data-pg-tab="cooler"] .tile.cl8-dm .meta,html body.phone-app #menuov #panel.pg08[data-pg-tab="cooler"] .tile.cl8-dm .meta{font-size:11.5px!important}
html body.phone-land #menuov #panel.pg08[data-pg-tab="cooler"] .pg08-body > .list,html body.phone-app #menuov #panel.pg08[data-pg-tab="cooler"] .pg08-body > .list{display:grid!important;grid-template-columns:repeat(auto-fill,minmax(330px,1fr))!important;gap:6px!important}
</style>`);
/* Customize holds the Wardrobe and Pets; Home opens from its chip in the top bar (next to the Aquarium) */
{ const c=MENU_SECS.find(s=>s.id==='cust'); if(c) c.tabs=c.tabs.filter(t=>t!=='home'); }
/* ODDITIES: its own page in Collection (director, 2026-11-18: "oddities belong in collection, as its own location inside"), and the
   Fish Log is fish only. FISH LOG: the waters (and the Show choices) wrap into neat rows instead of one long sideways-scrolling strip
   with arrows ("mobile fish log has side scrolling and it doesn't look good at all"). */
{ const T=$('tabs'); if(T&&!T.querySelector(':scope > [data-tab="oddities"]')){ const b=document.createElement('button'); b.setAttribute('role','tab'); b.type='button'; b.dataset.tab='oddities'; b.dataset.label='👢 Oddities'; b.setAttribute('aria-selected','false'); b.hidden=true; b.textContent='👢 Oddities'; const sb=T.querySelector('.secbar'); if(sb) T.insertBefore(b,sb); else T.appendChild(b); }
  const c=MENU_SECS.find(s=>s.id==='coll'); if(c&&!c.tabs.includes('oddities')) c.tabs.push('oddities');
  try{ SEARCH_IDX.push(['Oddities','oddities',null,'oddities junk treasure rare finds boot can found things']); }catch(e){}
  try{ PAGE_DESC.oddities='Junk, odd finds and treasure you have pulled from the water'; }catch(e){}
  const _rc=renderCooler; renderCooler=function(P){ if(MOB()&&S.tab==='oddities'&&P){
      /* two tabs (director: "oddities include treasures but they aren't separated"): Oddities (junk, odd junk, rare finds) and Treasures */
      const card=J=>{ const n=S.junk[J.id]||0; return `<div class="jcard" style="cursor:default" ${n?'data-odd="'+J.id+'"':''}><canvas width="200" height="100" data-junk="${J.id}" data-known="${n?1:0}"></canvas><b style="color:${n?(J.t>=2?'var(--gold)':'var(--ink)'):'var(--muted)'}">${n?esc(J.name):'???'}</b><small>${n?['Junk','Odd junk','Rare find','Treasure'][J.t]+' · ×'+n:'Not found yet'}</small></div>`; };
      const odd=JUNK.filter(J=>J.t<3).sort((a,b)=>a.t-b.t), tr=JUNK.filter(J=>J.t>=3);
      P.innerHTML=`<div class="row spread"><div><h2 class="dl-dup">Oddities</h2><p class="sub">Things humanity dropped in the water. Some pay, some boost your fishing, some come with a pet or a hat.</p></div></div>`+
        `<div class="jsec od8" data-od8="Oddities"><h2>Oddities</h2><p class="meta">Junk, odd junk and rare finds: everyday things the water gives back, from rarest last.</p><div class="jgrid">${odd.map(card).join('')}</div></div>`+
        `<div class="jsec od8" data-od8="Treasures"><h2>Treasures</h2><p class="meta">The rarest things in the water. Special lures in Tackle pull up more of them.</p><div class="jgrid">${tr.map(card).join('')}</div></div>`;
      P.querySelectorAll('canvas[data-junk]').forEach(cv=>{ const cx=cv.getContext('2d'); cx.clearRect(0,0,cv.width,cv.height); if(cv.dataset.known==='1') drawJunk(cx,cv.width,cv.height,cv.dataset.junk,null); else mysteryThumb(cx,cv.width,cv.height,cv.dataset.junk); }); return; }
    return _rc.apply(this,arguments); };
  const _rj=renderJournal; renderJournal=function(P){ if(MOB()&&encLoc==='junk') encLoc=S.loc; const r=_rj.apply(this,arguments); try{ if(MOB()) P.querySelectorAll('[data-act="encloc"][data-k="junk"]').forEach(b=>b.remove()); }catch(e){} return r; }; }
document.head.insertAdjacentHTML('beforeend',`<style>
html body.phone-land #menuov #panel.pg08[data-pg-tab="journal"] .chips,html body.phone-app #menuov #panel.pg08[data-pg-tab="journal"] .chips{flex-wrap:wrap!important;overflow:visible!important;-webkit-mask:none!important;mask:none!important;padding:0!important;gap:6px!important}
html body.phone-land #menuov #panel.pg08[data-pg-tab="journal"] .sc-arrow,html body.phone-app #menuov #panel.pg08[data-pg-tab="journal"] .sc-arrow{display:none!important}
html body.phone-land #menuov #panel.pg08[data-pg-tab="journal"] .chips > .chipb,html body.phone-app #menuov #panel.pg08[data-pg-tab="journal"] .chips > .chipb{flex:0 0 auto!important}
</style>`);
document.head.insertAdjacentHTML('beforeend',`<style>html body.phone-land #menuov #panel.pg08[data-pg-tab="oddities"] .od8 > h2,html body.phone-app #menuov #panel.pg08[data-pg-tab="oddities"] .od8 > h2{display:none!important} #menuov #panel .od8 > .meta{margin:0 0 8px!important}</style>`); /* the tab names each part */
/* BAIT: its own page, opened only from Bait in the top bar (director, 2026-11-18: "Bait shouldn't appear in upgrades side panel tab
   either. It needs its own only openable from the top panel. Bring special lures with it and organize it appropriately. Add easier
   access to switching bait too"). Three tabs:
   - Switch (opens first): the bait in use, auto-restock, and every bait and lure you own as big tap-to-use buttons with how many are left
   - Buy bait: the everyday and better baits, as in Tackle before
   - Special lures: the lures found in junk
   Tackle (Upgrades) keeps its Gear. */
{ const T=$('tabs'); if(T&&!T.querySelector(':scope > [data-tab="bait"]')){ const b=document.createElement('button'); b.setAttribute('role','tab'); b.type='button'; b.dataset.tab='bait'; b.dataset.label='🪱 Bait'; b.setAttribute('aria-selected','false'); b.hidden=true; b.textContent='🪱 Bait'; const sb=T.querySelector('.secbar'); if(sb) T.insertBefore(b,sb); else T.appendChild(b); }
  try{ SEARCH_IDX.forEach(e=>{ if(e[1]==='shop'&&Array.isArray(e[2])&&e[2][1]==='bait'){ e[0]='Bait'; e[1]='bait'; e[2]='Buy bait'; } else if(e[1]==='shop'&&Array.isArray(e[2])&&e[2][1]==='lures'){ e[0]='Bait: special lures'; e[1]='bait'; e[2]='Special lures'; } }); SEARCH_IDX.push(['Switch bait','bait','Switch','switch change bait use bait lure']); }catch(e){}
  try{ PAGE_DESC.bait='Switch bait, buy more, and use the special lures you found'; }catch(e){}
  const isLure=k=>!!(BAIT[k]&&('junk' in BAIT[k]));
  const take=(P,view,keep)=>{ const was=tackleView; tackleView=view; try{ renderShop(P); }finally{ tackleView=was; } const f=document.createDocumentFragment(); [...P.children].filter(keep).forEach(c=>f.appendChild(c)); return f; };
  const _rc=renderCooler; renderCooler=function(P){ if(!(MOB()&&S.tab==='bait'&&P)) return _rc.apply(this,arguments);
    const buy=take(P,'bait',c=>c.classList.contains('tk-list')), cur=take(P,'bait',c=>c.classList.contains('tk-cur')), lures=take(P,'lures',c=>c.classList.contains('tk-list')||(c.tagName==='P'&&c.classList.contains('sub')&&/bought|junk/i.test(c.textContent)));
    const own=Object.keys(BAIT).filter(k=>k==='worm'||(S.bait[k]||0)>0);
    /* each button: the name and how many are left on one line, then the bait's own short description (director: "show a brief
       description of the bait choices, simple and neat"); "Found as junk." is left off lures (they sit under their own heading) */
    const btn=k=>{ const B=BAIT[k], n=S.bait[k]||0, on=S.baitSel===k, d=String(B.note||'').replace(/^Found as junk\.\s*/,''); return `<button type="button" class="bt8-b${on?' on':''}${isLure(k)?' lure':''}" data-act="usebait" data-k="${k}" aria-pressed="${on}" title="${esc(B.name)}: ${esc(d)}"><span class="bt8-top"><b>${esc(B.name)}</b><span class="bt8-n">${k==='worm'?'Endless':'× '+n}</span></span><span class="bt8-d">${esc(d)}</span></button>`; };
    P.innerHTML=`<div class="row spread"><div><h2 class="dl-dup">Bait</h2><p class="sub">Better bait brings rarer fish; one bait is used each time you set the hook. Worms never run out.</p></div></div>`+
      `<div class="jsec bt8" data-bt8="Switch"><h2>Switch</h2><div class="bt8-cur"></div><h5>Your bait</h5><div class="bt8-grid">${own.filter(k=>!isLure(k)).map(btn).join('')}</div>${own.some(isLure)?`<h5>Your special lures</h5><div class="bt8-grid">${own.filter(isLure).map(btn).join('')}</div>`:''}</div>`+
      `<div class="jsec bt8" data-bt8="Buy bait"><h2>Buy bait</h2></div><div class="jsec bt8" data-bt8="Special lures"><h2>Special lures</h2></div>`;
    /* the "Bait in use" card keeps the same height whichever bait is on (Cam's Pixel, 2026-11-20: Worms has no "Switch to worms" button,
       so picking Crickets made the card 36 px taller and every bait button below jumped): an invisible stand-in holds the button's place */
    { const t=cur.querySelector&&cur.querySelector('.tk-cur'); if(t&&!t.querySelector('[data-act="usebait"]')) t.insertAdjacentHTML('beforeend','<button type="button" class="btn alt sm" tabindex="-1" aria-hidden="true" style="visibility:hidden">Switch to worms</button>'); }
    P.querySelector('.bt8-cur').appendChild(cur); P.querySelector('[data-bt8="Buy bait"]').appendChild(buy); P.querySelector('[data-bt8="Special lures"]').appendChild(lures); };
  /* Tackle on phones: Gear only (bait and lures live on the Bait page) */
  const _rp=renderPanel; renderPanel=function(){ if(MOB()&&S.tab==='shop'){ try{ tackleView='gear'; }catch(e){} } const r=_rp.apply(this,arguments); try{ if(MOB()&&S.tab==='shop'){ const P=$('panel'); P.querySelectorAll('[data-act="tackleview"]').forEach(b=>{ if(b.dataset.k!=='gear') b.remove(); }); P.querySelectorAll(':scope > .bwx-nav').forEach(n=>{ if(n.querySelectorAll('button').length<2) n.remove(); }); } }catch(e){ console.error(e); } return r; }; }
document.head.insertAdjacentHTML('beforeend',`<style>
html body.phone-land #menuov #panel.pg08[data-pg-tab="bait"] .bt8 > h2,html body.phone-app #menuov #panel.pg08[data-pg-tab="bait"] .bt8 > h2{display:none!important}
#menuov #panel .bt8-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(140px,1fr));gap:6px;margin:0 0 6px}
#menuov #panel .bt8-b{display:flex;flex-direction:column;align-items:flex-start;gap:2px;min-height:48px;padding:7px 11px;border-radius:12px;border:1px solid #ffffff1c;background:linear-gradient(180deg,#16263d,#111e31);color:#e8f1fb;text-align:left;cursor:pointer;font:inherit}
#menuov #panel .bt8-b b{font:800 13.5px var(--display,system-ui);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:100%}
#menuov #panel .bt8-b span{font-size:11.5px;color:#9fb3c8}
#menuov #panel .bt8-b.lure span{color:#c9a6ff}
#menuov #panel .bt8-b.on{background:linear-gradient(180deg,#ffd36a,#f0b43c);border-color:#ffd36a;color:#2a1a04}
#menuov #panel .bt8-b.on span{color:#5a3a08}
#menuov #panel .bt8-b:active{transform:translateY(1px)}
#menuov #panel .bt8-cur > .tile{margin:0 0 8px!important}
</style>`);
document.head.insertAdjacentHTML('beforeend',`<style>
#menuov #panel .bt8-grid{grid-template-columns:repeat(auto-fill,minmax(190px,1fr))!important}
#menuov #panel .bt8-b{gap:3px!important;min-height:58px!important;justify-content:flex-start}
#menuov #panel .bt8-top{display:flex;align-items:baseline;justify-content:space-between;gap:8px;width:100%;min-width:0}
#menuov #panel .bt8-top b{min-width:0}
#menuov #panel .bt8-b .bt8-n{flex:0 0 auto;font:700 11px var(--display,system-ui);color:#9fb3c8}
#menuov #panel .bt8-b .bt8-d{display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;font-size:11.5px;line-height:1.3;color:#b8c8d6;text-align:left}
#menuov #panel .bt8-b.lure .bt8-d{color:#d3bdf5}
#menuov #panel .bt8-b.on .bt8-n,#menuov #panel .bt8-b.on .bt8-d{color:#4a3006}
</style>`); /* the Switch buttons: name + count, then a two-line description */
/* Oddities pictures: the first 12 are drawn at once, the rest as they come into view (100 pictures took about 10 ms per switch) */
{ const _rc=renderCooler; renderCooler=function(P){ if(!(MOB()&&S.tab==='oddities'&&P&&typeof IntersectionObserver==='function')) return _rc.apply(this,arguments);
    const _dj=drawJunk, _mt=mysteryThumb; let k=0; const later=[];
    drawJunk=function(cx){ if(k++<12) return _dj.apply(this,arguments); later.push([_dj,this,[...arguments]]); };
    mysteryThumb=function(cx){ if(k++<12) return _mt.apply(this,arguments); later.push([_mt,this,[...arguments]]); };
    try{ _rc.apply(this,arguments); }finally{ drawJunk=_dj; mysteryThumb=_mt; }
    const io=new IntersectionObserver(es=>es.forEach(e=>{ if(!e.isIntersecting) return; io.unobserve(e.target); const j=later.find(x=>x[2][0]&&x[2][0].canvas===e.target); if(j) try{ j[0].apply(j[1],j[2]); }catch(er){} }),{rootMargin:'240px'});
    later.forEach(x=>{ const c=x[2][0]&&x[2][0].canvas; if(c) io.observe(c); }); }; }
{ const b=$('tabs')&&$('tabs').querySelector(':scope > [data-tab="map"]'); if(b&&MOB()){ b.dataset.label='🗺️ Map'; for(const n of b.childNodes) if(n.nodeType===3&&/Waters/.test(n.textContent)) n.textContent=n.textContent.replace('Waters','Map'); } } /* the page tab says Map too */
