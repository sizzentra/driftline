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
/* Prestige, Oddities and Bait pages are shared since PC Reborn (src/cw_pages08.js); the sections live in bm_ui04.js. Phones' own layout stays here. */
{ let lastTab='';
  const _rp=renderPanel; renderPanel=function(){ const P=$('panel'), mob=MOB(), opened=S.tab!==lastTab; lastTab=S.tab;
    const r=_rp.apply(this,arguments); if(!mob||S.tab!=='map'||!P) return r;
    try{ /* Waters: the voyage and relic sections live in Prestige now */
      P.querySelectorAll(':scope > .sect-nav').forEach(n=>n.remove());
      const grid=P.querySelector(':scope > .grid'); if(!grid) return r; grid.classList.add('wt8-grid');
      for(const card of grid.querySelectorAll(':scope > .tile.loc')){ const h4=card.querySelector('h4'), L=h4&&LOCS.find(l=>l.name===h4.textContent.trim()); if(!L) continue;
        const metas=[...card.querySelectorAll(':scope > .meta')], blurb=metas[0], req=metas.find(m=>/fish caught at/.test(m.textContent)), btn=card.querySelector(':scope > button'), th=card.querySelector(':scope > .sw2');
        const sps=spAt(L.id), got=caughtAt(L.id), here=S.loc===L.id, open=S.unlocked.includes(L.id);
        card.title=(blurb?blurb.textContent.trim():''); card.classList.add('wt8');
        const info=document.createElement('div'); info.className='wt8-info';
        info.innerHTML=`<div class="wt8-top"><h4>${esc(L.name)}</h4></div><div class="meta wt8-sub">Depth ${esc(depthStr(L.depth))}</div>${strStandHTML(sps)}<div class="wt8-sp"><span class="wt8-bar"><i style="width:${(got/sps.length*100).toFixed(1)}%"></i></span><span class="meta" title="Species found here">${got}/${sps.length} fish</span></div>`;
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
/* Prestige's cards (Voyage, milestones, relics) need room for their numbers: at least 300 px each */
document.head.insertAdjacentHTML('beforeend',`<style>
html body.phone-land #menuov #panel.pg08[data-pg-tab="prestige"] .pg08-body .grid:not(.sect-one),html body.phone-app #menuov #panel.pg08[data-pg-tab="prestige"] .pg08-body .grid:not(.sect-one){grid-template-columns:repeat(auto-fill,minmax(300px,1fr))!important}
</style>`);
/* ODDITIES: its own page in Collection (director, 2026-11-18: "oddities belong in collection, as its own location inside"), and the
   Fish Log is fish only. FISH LOG: the waters (and the Show choices) wrap into neat rows instead of one long sideways-scrolling strip
   with arrows ("mobile fish log has side scrolling and it doesn't look good at all"). */
{
  const _rj=renderJournal; renderJournal=function(P){ if(MOB()&&encLoc==='junk') encLoc=S.loc; const r=_rj.apply(this,arguments); try{ if(MOB()) P.querySelectorAll('[data-act="encloc"][data-k="junk"]').forEach(b=>b.remove()); }catch(e){} return r; }; }
document.head.insertAdjacentHTML('beforeend',`<style>
html body.phone-land #menuov #panel.pg08[data-pg-tab="journal"] .chips,html body.phone-app #menuov #panel.pg08[data-pg-tab="journal"] .chips{flex-wrap:wrap!important;overflow:visible!important;-webkit-mask:none!important;mask:none!important;padding:0!important;gap:6px!important}
html body.phone-land #menuov #panel.pg08[data-pg-tab="journal"] .sc-arrow,html body.phone-app #menuov #panel.pg08[data-pg-tab="journal"] .sc-arrow{display:none!important}
html body.phone-land #menuov #panel.pg08[data-pg-tab="journal"] .chips > .chipb,html body.phone-app #menuov #panel.pg08[data-pg-tab="journal"] .chips > .chipb{flex:0 0 auto!important}
</style>`);
document.head.insertAdjacentHTML('beforeend',`<style>html body.phone-land #menuov #panel.pg08[data-pg-tab="oddities"] .od8 > h2,html body.phone-app #menuov #panel.pg08[data-pg-tab="oddities"] .od8 > h2{display:none!important} #menuov #panel .od8 > .meta{margin:0 0 8px!important}</style>`); /* the tab names each part */
document.head.insertAdjacentHTML('beforeend',`<style>
html body.phone-land #menuov #panel.pg08[data-pg-tab="bait"] .bt8 > h2,html body.phone-app #menuov #panel.pg08[data-pg-tab="bait"] .bt8 > h2{display:none!important}
</style>`);
