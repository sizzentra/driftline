// =====================================================================
// Phones, round 7: the aquarium, built for phones (director, 2026-11-18: "think of a custom version for aquarium; it feels hard to
// use and navigate; it feels hard to actually see what you're doing and multitask"). Layout A from the mockup canvas ("pinned tank").
//  - The tank stays on screen: upright it is pinned at the top with the earnings strip and the tabs under it, and only the list
//    scrolls; sideways the tank, earnings and tabs are a pinned left column and the lists scroll on the right. So every change
//    (a new fish, a water colour, a decoration) is seen the moment it is made.
//  - Earnings, Collect and Feed are one compact strip under the tank.
//  - A third tab, "Add fish", lists the fish in your Cooler with "To aquarium", so the tank can be filled without leaving the page.
// Android + iPhone only; PC keeps its own aquarium layout.
// =====================================================================
{ let AQ_ADD=false;
  const addHTML=()=>{ const full=S.tank.length>=aqCap(); const rows=S.cooler.map((f,i)=>({f,i})).reverse();
    if(!rows.length) return `<div class="aq07-add"><div class="empty">Your Cooler is empty. Fish you catch can go on display from here.</div></div>`;
    return `<div class="aq07-add"><p class="aq07-note">${full?'The tank is full ('+S.tank.length+' of '+aqCap()+'). Make room or buy a bigger tank to add more.':'Tap <b>To aquarium</b> to put a fish on display. It starts earning right away.'}</p><div class="list">`+rows.map(({f,i})=>{ const sp=SPI[f.id];
      return `<div class="fishrow"><canvas width="128" height="64" data-fish="${f.id}" data-sh="${f.sh||0}" data-pv="${f.pv||''}"></canvas><div class="nm"><span style="color:${RAR[sp.r].c}">${esc(sp.name)}</span><small>${RAR[sp.r].k} · ${kgStr(f.kg)} · ${fmt(fishRate(f)*60)} / hour · ${esc(aqTxt(f))}</small></div><div class="acts"><button class="btn sm" data-act="totank" data-i="${i}" ${full?'disabled':''}>To aquarium</button></div></div>`; }).join('')+`</div></div>`; };
  const _rp=renderPanel; renderPanel=function(){ const r=_rp.apply(this,arguments); try{ const P=$('panel'); const on=MOB()&&S.tab==='aquarium'; P.classList.toggle('aq07',on); if(!on){ AQ_ADD=false; return r; }
      const tank=P.querySelector(':scope > .tank'), nav=P.querySelector(':scope > .sect-nav'), bank=P.querySelector('.bank'); if(!tank||!nav) return r;
      const pin=document.createElement('div'); pin.className='aq07-pin'; tank.before(pin); pin.appendChild(tank); if(bank){ bank.classList.add('aq07-bank'); pin.appendChild(bank); } pin.appendChild(nav);
      const head=P.querySelector(':scope > .mb-aqh, :scope > .dl-head'); if(head&&MOB()&&!document.body.classList.contains('phone-land')) pin.after(head); /* upright: the tank comes first, the explanation under it */
      const addB=document.createElement('button'); addB.type='button'; addB.className='aq07-addtab'; addB.setAttribute('role','tab'); addB.setAttribute('aria-selected',AQ_ADD?'true':'false'); addB.innerHTML='Add fish'+(S.cooler.length?' <span class="aq07-n">'+S.cooler.length+'</span>':''); nav.appendChild(addB);
      addB.addEventListener('click',e=>{ e.preventDefault(); e.stopPropagation(); if(AQ_ADD) return; AQ_ADD=true; renderPanel(); try{ $('panel').scrollTop=0; }catch(er){} });
      nav.querySelectorAll('[data-sect]').forEach(b=>b.addEventListener('click',()=>{ if(!AQ_ADD) return; AQ_ADD=false; setTimeout(()=>{ try{ renderPanel(); }catch(er){} },0); },true)); /* the section switch only toggles visibility, so leaving Add fish rebuilds the page */
      if(AQ_ADD){ nav.querySelectorAll('[data-sect]').forEach(b=>b.setAttribute('aria-selected','false')); [...P.children].forEach(c=>{ if(c!==pin&&!c.classList.contains('crumb')) c.style.display='none'; }); pin.insertAdjacentHTML('afterend',addHTML()); paintFish(P); }
      /* everything after the pinned block goes into one column (sideways it is the right-hand column next to the pinned tank) */
      const side=document.createElement('div'); side.className='aq07-side'; [...P.children].filter(c=>c!==pin&&!c.classList.contains('crumb')).forEach(c=>side.appendChild(c)); pin.after(side);
    }catch(e){ console.error(e); } return r; }; }
document.head.insertAdjacentHTML('beforeend',`<style>
/* the pinned block: tank, earnings strip, tabs */
html body.phone-app #menuov #panel.aq07 > .aq07-pin,html body.phone-land #menuov #panel.aq07 > .aq07-pin{position:sticky;top:0;z-index:6;display:flex;flex-direction:column;gap:8px;background:#0b1626;padding:0 0 8px;box-shadow:0 10px 12px -10px #000c}
html body.phone-app #menuov #panel.aq07 .aq07-pin > .tank,html body.phone-land #menuov #panel.aq07 .aq07-pin > .tank{margin:0!important;border-radius:14px;overflow:hidden}
html body.phone-app #menuov #panel.aq07 .aq07-bank,html body.phone-land #menuov #panel.aq07 .aq07-bank{display:grid!important;grid-template-columns:minmax(0,1fr) minmax(0,1fr) auto auto;align-items:center;gap:8px!important;margin:0!important;padding:7px 9px!important;border-radius:12px!important;background:linear-gradient(180deg,#16263d,#111e31)!important;border:1px solid #ffffff17!important;width:100%;box-sizing:border-box}
html body.phone-app #menuov #panel.aq07 .aq07-bank > div,html body.phone-land #menuov #panel.aq07 .aq07-bank > div{min-width:0;line-height:1.15;white-space:nowrap}
html body.phone-app #menuov #panel.aq07 .aq07-bank .sub,html body.phone-land #menuov #panel.aq07 .aq07-bank .sub{font:700 10px var(--display)!important;color:#9fb3c8!important;margin:0!important;letter-spacing:.3px}
html body.phone-app #menuov #panel.aq07 .aq07-bank b.coin,html body.phone-land #menuov #panel.aq07 .aq07-bank b.coin{font:800 15px var(--display)!important}
html body.phone-app #menuov #panel.aq07 .aq07-bank .btn,html body.phone-land #menuov #panel.aq07 .aq07-bank .btn{min-height:36px!important;padding:0 11px!important;margin:0!important;font-size:13px!important;white-space:nowrap}
html body.phone-app #menuov #panel.aq07 #collectbtn:not(:disabled),html body.phone-land #menuov #panel.aq07 #collectbtn:not(:disabled){background:linear-gradient(180deg,#ffe08a,#f3b94e)!important;border-color:#ffe6a3!important;color:#2a1c05!important}
html body.phone-app #menuov #panel.aq07 .aq07-pin > .sect-nav,html body.phone-land #menuov #panel.aq07 .aq07-pin > .sect-nav{display:grid!important;grid-auto-flow:column;grid-auto-columns:minmax(0,1fr);margin:0!important}
html body.phone-app #menuov #panel.aq07 .aq07-addtab,html body.phone-land #menuov #panel.aq07 .aq07-addtab{border:0;border-radius:10px;background:transparent;color:#9fb3c8;font:800 13px var(--display);min-height:36px;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:6px}
html body.phone-app #menuov #panel.aq07 .aq07-addtab[aria-selected="true"],html body.phone-land #menuov #panel.aq07 .aq07-addtab[aria-selected="true"]{background:linear-gradient(180deg,#ffe08a,#f3b94e);color:#2a1c05}
html body.phone-app #menuov #panel.aq07 .aq07-n,html body.phone-land #menuov #panel.aq07 .aq07-n{min-width:18px;height:18px;padding:0 5px;box-sizing:border-box;border-radius:999px;background:#7fe3c4;color:#06231f;font:800 11px var(--display);display:inline-flex;align-items:center;justify-content:center}
html body.phone-app #menuov #panel.aq07 .aq07-note,html body.phone-land #menuov #panel.aq07 .aq07-note{margin:4px 2px 8px;font-size:12.5px;color:#b9cadb}
/* sideways: the tank, earnings and tabs are a pinned left column, everything else scrolls on the right */
@media (orientation:landscape) and (max-height:560px){
  html body.phone-land #menuov #panel.aq07{display:grid!important;grid-template-columns:minmax(0,1.1fr) minmax(0,1fr);column-gap:12px;align-items:start;align-content:start}
  html body.phone-land #menuov #panel.aq07 > *{order:0!important;min-width:0}
  html body.phone-land #menuov #panel.aq07 > .crumb{display:none!important}
  html body.phone-land #menuov #panel.aq07 > .aq07-pin{grid-column:1;grid-row:1;box-shadow:none;padding:0}
  html body.phone-land #menuov #panel.aq07 > .aq07-side{grid-column:2;grid-row:1}
  html body.phone-land #menuov #panel.aq07 > .aq07-side > *:first-child{margin-top:0!important}
  html body.phone-land #menuov #panel.aq07 .aq07-bank{grid-template-columns:minmax(0,1fr) minmax(0,1fr)}
  html body.phone-land #menuov #panel.aq07 .aq07-bank .btn{width:100%}
}
</style>`);
