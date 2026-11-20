// PC, Pets > Find more: headings over the pets you can adopt and the ones still to find; they follow the section tabs
{ const _rp=renderPanel; renderPanel=function(){ const r=_rp.apply(this,arguments); try{ if(S.tab==='pets'&&document.body.classList.contains('pch-on')){ const P=$('panel'), g=P.querySelector(':scope > .grid'); if(!g) return r;
      const add=(sel,txt)=>{ const list=[...g.querySelectorAll(':scope > '+sel)]; if(!list.length) return; const h=document.createElement('div'); h.className='pet-h'; h.dataset.for=sel; h.innerHTML=`<span>${txt}</span><span class="meta">${list.length}</span>`; g.insertBefore(h,list[0]); };
      add('.pet-sale','Adopt'); add('.pet-hid','Still to find');
      const sync=()=>g.querySelectorAll('.pet-h').forEach(h=>{ const n=[...g.querySelectorAll(':scope > '+h.dataset.for)].filter(t=>t.style.display!=='none').length; h.style.display=n?'':'none'; h.querySelector('.meta').textContent=n; });
      sync(); const nav=P.querySelector('.sect-nav'); if(nav) nav.addEventListener('click',()=>setTimeout(sync,0)); } }catch(e){} return r; }; }
/* PC: the shop cards are compact and the pets still to find are short wide rows (moved here from bm_ui04.js on 2026-11-19).
   The rows' display:grid skips tiles a page tab hid: a forced display kept "Still to find" on Your pets and Customize at 1440×900 (0.4.8.9.4 hotfix). */
document.head.insertAdjacentHTML('beforeend',`<style>
body.pch-on #menuov #panel > .grid:has(> .pet-hid),body.pch-on #menuov #panel > .grid:has(> .pet-sale){grid-template-columns:repeat(auto-fill,minmax(124px,1fr))!important;gap:8px!important}
body.pch-on #panel .tile.pet-sale{padding:8px 9px!important;gap:3px!important}
body.pch-on #panel .tile.pet-sale canvas{width:96px!important;height:56px!important}
body.pch-on #panel .tile.pet-sale h4{font-size:13.5px!important;margin:0!important}
body.pch-on #panel .tile.pet-sale .meta{font-size:11px!important;line-height:1.35;display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden}
body.pch-on #panel .tile.pet-sale .btn{padding:5px 8px!important;font-size:12px!important;min-height:0!important}
body.pch-on #panel .tile.pet-hid{grid-column:span 2;grid-template-columns:52px minmax(0,1fr);grid-template-rows:auto auto;column-gap:10px;row-gap:1px;align-items:center;padding:7px 10px!important;opacity:.85}
body.pch-on #panel .tile.pet-hid:not([style*="display: none"]):not([style*="display:none"]){display:grid!important}
body.pch-on #panel .tile.pet-hid canvas{grid-row:1 / 3;width:52px!important;height:30px!important}
body.pch-on #panel .tile.pet-hid h4{display:none}
body.pch-on #panel .tile.pet-hid > .meta{font-size:11.5px!important;line-height:1.3;margin:0!important}
body.pch-on #panel .tile.pet-hid > span.meta{color:#9fb2c8}
body.pch-on #panel .grid > .pet-h{grid-column:1 / -1;display:flex;align-items:baseline;gap:8px;margin:6px 2px -2px;font:800 12.5px var(--display,system-ui);letter-spacing:.07em;text-transform:uppercase;color:#cfe0f2}
body.pch-on #panel .grid > .pet-h:first-child{margin-top:0}
body.pch-on #panel .grid > .pet-h .meta{letter-spacing:0}
body.pch-on #panel .tile.pet-hid canvas{align-self:center}
</style>`);
document.head.insertAdjacentHTML('beforeend',`<style>
/* the pet filter belongs to "Your pets": the page hides it on the other tabs, and the one-row phone style must not show it again */
#menuov #panel .chips.pet-filter[style*="display: none"],#menuov #panel .chips.pet-filter[style*="display:none"]{display:none!important}
</style>`);
