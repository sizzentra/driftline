// =====================================================================
// Phones: the Cooler page (Android + iPhone; every phone layer of the Cooler in one place, Clean Pages 2026-11-21: moved here from
// waters08.js; the help box that pages06.js built and this page hid is gone). The shared Keep buttons come from ax_trophy035.js.
// =====================================================================
/* Cooler (director: "very large, the filter takes up way too much space, consider a rework"):
   - the Sell all filter is one slim line: "Sell all:" then rarity, max price and a Shinies switch
   - the fishmonger's wish is a one-line banner
   - no intro line (every row already shows what a fish earns in the tank; the buttons explain themselves on long-press)
   - fish sit two a row on wider phones */
{ const _rp=renderPanel; renderPanel=function(){ const r=_rp.apply(this,arguments); try{ if(!MOB()||S.tab!=='cooler') return r; const P=$('panel'); if(!P) return r;
      const t=P.querySelector('.sellf .fld-title'); if(t) t.textContent='Sell all:';
      const inp=P.querySelector('.sellf [data-sp]'); if(inp) inp.placeholder='Max price';
      const sh=P.querySelector('.sellf [data-ssh]'); if(sh&&!sh.dataset.mb8){ sh.dataset.mb8='1'; sh.innerHTML='<span class="ssh-star" aria-hidden="true">✦</span> Shinies'; } const hy=P.querySelector('.sellf [data-shy]'); if(hy&&!hy.dataset.mb8){ hy.dataset.mb8='1'; hy.innerHTML='<span class="ssh-star" aria-hidden="true">×</span> Hybrids'; }
      const dm=[...P.querySelectorAll('.tile')].find(x=>/fishmonger wants/i.test(x.textContent)); if(dm) dm.classList.add('cl8-dm');
    }catch(e){ console.error(e); } return r; }; }
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
html body.phone-land #menuov #panel.pg08[data-pg-tab="cooler"] .pg08-body > .list,html body.phone-app #menuov #panel.pg08[data-pg-tab="cooler"] .pg08-body > .list{display:grid!important;grid-template-columns:repeat(auto-fill,minmax(330px,1fr))!important;gap:6px!important}
</style>`);
