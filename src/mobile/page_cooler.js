// =====================================================================
// Phones: the Cooler page (Android + iPhone; every phone layer of the Cooler in one place, Clean Pages 2026-11-21: moved here from
// waters08.js; the help box that pages06.js built and this page hid is gone). The shared Keep buttons come from ax_trophy035.js.
// =====================================================================
/* Cooler (director: "very large, the filter takes up way too much space, consider a rework"):
   - the Sell all filter is one slim line: "Sell all:" then rarity, max price and a Shinies switch
   - the fishmonger's wish is a one-line banner
   - no intro line (every row already shows what a fish earns in the tank; the buttons explain themselves on long-press)
   - fish sit two a row on wider phones */
panelStep({ after(){ try{ if(!MOB()||S.tab!=='cooler') return; const P=$('panel'); if(!P) return;
      const t=P.querySelector('.sellf .fld-title'); if(t) t.textContent='Sell all:';
      const inp=P.querySelector('.sellf [data-sp]'); if(inp) inp.placeholder='Max price';
      const sh=P.querySelector('.sellf [data-ssh]'); if(sh&&!sh.dataset.mb8){ sh.dataset.mb8='1'; sh.innerHTML='<span class="ssh-star" aria-hidden="true">✦</span> Shinies'; } const hy=P.querySelector('.sellf [data-shy]'); if(hy&&!hy.dataset.mb8){ hy.dataset.mb8='1'; hy.innerHTML='<span class="ssh-star" aria-hidden="true">×</span> Hybrids'; }
      const dm=[...P.querySelectorAll('.tile')].find(x=>/fishmonger wants/i.test(x.textContent)); if(dm) dm.classList.add('cl8-dm');
    }catch(e){ console.error(e); } } });
document.head.insertAdjacentHTML('beforeend',`<style>
html body.phone-land #menuov #panel.pg08[data-pg-tab="cooler"] .pg08-body > .pg08-note,html body.phone-app #menuov #panel.pg08[data-pg-tab="cooler"] .pg08-body > .pg08-note{display:none!important}
html body.phone-land #menuov #panel.pg08[data-pg-tab="cooler"] .sellf,html body.phone-app #menuov #panel.pg08[data-pg-tab="cooler"] .sellf{display:flex!important;flex-direction:row!important;align-items:center!important;flex-wrap:wrap!important;gap:6px 8px!important;padding:6px 10px!important;margin:0 0 8px!important;min-height:0!important}
html body.phone-land #menuov #panel.pg08[data-pg-tab="cooler"] .sellf .fld-title,html body.phone-app #menuov #panel.pg08[data-pg-tab="cooler"] .sellf .fld-title{font:800 12px var(--display,system-ui)!important;margin:0!important;white-space:nowrap;color:#cfe0ee;flex:0 0 auto!important;width:auto!important;display:block!important}
html body.phone-land #menuov #panel.pg08[data-pg-tab="cooler"] .sellf .fld,html body.phone-app #menuov #panel.pg08[data-pg-tab="cooler"] .sellf .fld{display:flex!important;flex-direction:row!important;align-items:center!important;margin:0!important;padding:0!important;gap:0!important;min-width:0}
html body.phone-land #menuov #panel.pg08[data-pg-tab="cooler"] .sellf .fld-l,html body.phone-app #menuov #panel.pg08[data-pg-tab="cooler"] .sellf .fld-l{display:none!important}
html body.phone-land #menuov #panel.pg08[data-pg-tab="cooler"] .sellf select,html body.phone-land #menuov #panel.pg08[data-pg-tab="cooler"] .sellf input,html body.phone-land #menuov #panel.pg08[data-pg-tab="cooler"] .sellf .chipb,html body.phone-app #menuov #panel.pg08[data-pg-tab="cooler"] .sellf select,html body.phone-app #menuov #panel.pg08[data-pg-tab="cooler"] .sellf input,html body.phone-app #menuov #panel.pg08[data-pg-tab="cooler"] .sellf .chipb{height:32px!important;min-height:32px!important;margin:0!important;font-size:12.5px!important}
html body.phone-land #menuov #panel.pg08[data-pg-tab="cooler"] .sellf input,html body.phone-app #menuov #panel.pg08[data-pg-tab="cooler"] .sellf input{width:96px!important}
html body.phone-land #menuov #panel.pg08[data-pg-tab="cooler"] .tile.cl8-dm,html body.phone-app #menuov #panel.pg08[data-pg-tab="cooler"] .tile.cl8-dm{padding:6px 10px!important;margin:0 0 8px!important;gap:10px!important;min-height:0!important}
html body.phone-land #menuov #panel.pg08[data-pg-tab="cooler"] .tile.cl8-dm .meta,html body.phone-app #menuov #panel.pg08[data-pg-tab="cooler"] .tile.cl8-dm .meta{font-size:11.5px!important}
html body.phone-land #menuov #panel.pg08[data-pg-tab="cooler"] .pg08-body > .list,html body.phone-app #menuov #panel.pg08[data-pg-tab="cooler"] .pg08-body > .list{display:grid!important;grid-template-columns:repeat(auto-fill,minmax(min(410px,100%),1fr))!important;gap:6px!important}
/* qc 270 (director's iPhone, 2026-11-28: "mobile doesnt even fit anywyas and sidescrolls ... overlaps too"): a card was allowed to be 330 px wide, but its five buttons need about 400, so on an
   iPhone 16 Pro Max (the page is about 690 wide there) two cards sat side by side, the buttons ran out of each card over the next one and the page scrolled sideways. A card is now at least
   410 px (or the whole width, where the page is narrower than that), so that phone shows one column, and the page cannot scroll sideways. */
html body.phone-land #menuov #panel.pg08[data-pg-tab="cooler"] .pg08-body,html body.phone-app #menuov #panel.pg08[data-pg-tab="cooler"] .pg08-body{overflow-x:hidden}
html body.phone-land #menuov #panel.pg08[data-pg-tab="cooler"] .pg08-body > .list > .fishrow,html body.phone-app #menuov #panel.pg08[data-pg-tab="cooler"] .pg08-body > .list > .fishrow{min-width:0;max-width:100%}
</style>`);
/* Phones: the Cooler upgrade (coolerUpHTML, e_ui.js) sits at the end of the "Sell all:" row, where there is room. In the summary strip, where
   the page engine puts it and where PC keeps it, it pushed Scrap all onto a second line and the fish list down (seen 2026-11-27). */
pageDone('cooler',P=>{ const bank=P.querySelector('.pg08-bank'), b=bank&&bank.querySelector(':scope > .cool-up'), row=P.querySelector('.sellf'); if(!b||!row) return;
  row.appendChild(b); b.style.marginLeft='auto'; const t=b.firstChild; if(t&&t.nodeType===3&&/^Upgrade to /.test(t.textContent)){ b.setAttribute('aria-label',b.textContent.replace(/\s+/g,' ').trim()); t.textContent=t.textContent.replace('Upgrade to ','↑ '); } /* a short label, so it fits beside the filters on one line */ bank.style.gridTemplateColumns=bank.style.gridTemplateColumns.replace(/repeat\((\d+),\s*auto\)/,(m,n)=>n>1?'repeat('+(n-1)+', auto)':''); });
