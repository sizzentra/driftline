// PC, Pets > Find more: headings over the pets you can adopt and the ones still to find; they follow the section tabs
{ const _rp=renderPanel; renderPanel=function(){ const r=_rp.apply(this,arguments); try{ if(S.tab==='pets'&&document.body.classList.contains('pch-on')){ const P=$('panel'), g=P.querySelector(':scope > .grid'); if(!g) return r;
      const add=(sel,txt)=>{ const list=[...g.querySelectorAll(':scope > '+sel)]; if(!list.length) return; const h=document.createElement('div'); h.className='pet-h'; h.dataset.for=sel; h.innerHTML=`<span>${txt}</span><span class="meta">${list.length}</span>`; g.insertBefore(h,list[0]); };
      add('.pet-sale','Adopt'); add('.pet-hid','Still to find');
      const sync=()=>g.querySelectorAll('.pet-h').forEach(h=>{ const n=[...g.querySelectorAll(':scope > '+h.dataset.for)].filter(t=>t.style.display!=='none').length; h.style.display=n?'':'none'; h.querySelector('.meta').textContent=n; });
      sync(); const nav=P.querySelector('.sect-nav'); if(nav) nav.addEventListener('click',()=>setTimeout(sync,0)); } }catch(e){} return r; }; }
document.head.insertAdjacentHTML('beforeend',`<style>
body.pch-on #panel .grid > .pet-h{grid-column:1 / -1;display:flex;align-items:baseline;gap:8px;margin:6px 2px -2px;font:800 12.5px var(--display,system-ui);letter-spacing:.07em;text-transform:uppercase;color:#cfe0f2}
body.pch-on #panel .grid > .pet-h:first-child{margin-top:0}
body.pch-on #panel .grid > .pet-h .meta{letter-spacing:0}
body.pch-on #panel .tile.pet-hid canvas{align-self:center}
</style>`);
document.head.insertAdjacentHTML('beforeend',`<style>
/* the pet filter belongs to "Your pets": the page hides it on the other tabs, and the one-row phone style must not show it again */
#menuov #panel .chips.pet-filter[style*="display: none"],#menuov #panel .chips.pet-filter[style*="display:none"]{display:none!important}
</style>`);
