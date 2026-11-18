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
      /* round 7b (director: "the aquarium should be bigger without ruining the menu sizes"): only the tank (and upright the tabs) is
         pinned; the earnings strip heads the scrolling column, which gives its height to the tank */
      const pin=document.createElement("div"); pin.className="aq07-pin"; tank.before(pin); pin.appendChild(tank); if(bank){ bank.classList.add("aq07-bank"); pin.appendChild(bank); } pin.appendChild(nav); /* round 7c (director): Feed and Collect sit right under the tank again */
      const head=P.querySelector(':scope > .mb-aqh, :scope > .dl-head'); if(head&&!document.body.classList.contains('phone-land')) pin.after(head); /* upright: the tank comes first, the explanation under it */
      const addB=document.createElement('button'); addB.type='button'; addB.className='aq07-addtab'; addB.setAttribute('role','tab'); addB.setAttribute('aria-selected',AQ_ADD?'true':'false'); addB.innerHTML='Add fish'+(S.cooler.length?' <span class="aq07-n">'+S.cooler.length+'</span>':''); nav.appendChild(addB);
      /* everything after the pinned block goes into one column (sideways it is the right-hand column next to the pinned tank) */
      const side=document.createElement('div'); side.className='aq07-side'; [...P.children].filter(c=>c!==pin&&!c.classList.contains('crumb')).forEach(c=>side.appendChild(c)); pin.after(side);
      if(document.body.classList.contains('phone-land')) side.prepend(nav); /* sideways the tabs head the right column */
      /* Add fish is built hidden with the page and switched by visibility like the other two tabs (it used to rebuild the whole page,
         about 40 ms, and restart the tank) */
      const tmp=document.createElement('div'); tmp.innerHTML=addHTML(); const add=tmp.firstElementChild; if(nav.parentNode===side) nav.after(add); else side.prepend(add); let painted=false;
      const show=on=>{ AQ_ADD=on; addB.setAttribute('aria-selected',on?'true':'false'); add.classList.toggle('aq07-off',!on); [...side.children].forEach(c=>{ if(c!==add&&c!==nav&&c!==bank) c.classList.toggle('aq07-off',on); }); if(on){ nav.querySelectorAll('[data-sect]').forEach(b=>b.setAttribute('aria-selected','false')); if(!painted){ painted=true; paintFish(add); } } };
      addB.addEventListener('click',e=>{ e.preventDefault(); e.stopPropagation(); if(!AQ_ADD){ show(true); try{ P.scrollTop=0; }catch(er){} } });
      nav.querySelectorAll('[data-sect]').forEach(b=>b.addEventListener('click',()=>{ if(AQ_ADD) show(false); },true));
      show(AQ_ADD);
      P.dataset.aqLand=document.body.classList.contains('phone-land')?'1':'0'; /* which layout this page was built for */
    }catch(e){ console.error(e); } return r; };
  /* turning the phone while the aquarium is open rebuilds it for the new layout (checked after the resize settles, against the layout
     the page was built for, so the very first turn counts too) */
  let rt=0; addEventListener('resize',()=>{ clearTimeout(rt); rt=setTimeout(()=>{ try{ const P=$('panel'); if(!MOB()||S.tab!=='aquarium'||!P.classList.contains('aq07')) return; const l=document.body.classList.contains('phone-land')?'1':'0'; if(P.dataset.aqLand!==l) renderPanel(); }catch(e){} },160); }); }
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
  html body.phone-land #menuov #panel.aq07 .aq07-bank{padding:6px 8px!important;gap:6px!important}
  html body.phone-land #menuov #panel.aq07 .aq07-bank .btn{min-height:34px!important;padding:0 9px!important;font-size:12.5px!important}
  html body.phone-land #menuov #panel.aq07 .aq07-bank b.coin{font-size:14px!important}
  /* the tank never grows taller than the space left above the earnings strip */
  html body.phone-land #menuov #panel.aq07 .aq07-pin > .tank{max-height:calc(100dvh - 160px - env(safe-area-inset-top) - env(safe-area-inset-bottom))}
  html body.phone-land #menuov #panel.aq07 .aq07-side > .sect-nav{position:sticky;top:0;z-index:4;margin:0 0 8px!important;display:grid!important;grid-auto-flow:column;grid-auto-columns:minmax(0,1fr);box-shadow:0 8px 10px -8px #000c}
}
</style>`);
// narrow sideways phones (iPhone SE and similar, about 667 px wide): the earnings strip takes two short rows (numbers, then buttons)
// and the tabs use a smaller label, so nothing squeezes together
document.head.insertAdjacentHTML('beforeend',`<style>
@media (orientation:landscape) and (max-height:560px) and (max-width:760px){
  html body.phone-land #menuov #panel.aq07 .aq07-bank{grid-template-columns:minmax(0,1fr) minmax(0,1fr)!important;row-gap:5px!important}
  html body.phone-land #menuov #panel.aq07 .aq07-bank .btn{width:100%;min-height:30px!important}
  html body.phone-land #menuov #panel.aq07 .aq07-pin > .tank{max-height:calc(100dvh - 190px - env(safe-area-inset-top) - env(safe-area-inset-bottom))}
  html body.phone-land #menuov #panel.aq07 .aq07-side > .sect-nav > button{font-size:11.5px!important;padding:0 2px!important;min-height:32px!important;white-space:nowrap}
}
</style>`);
// an older rule gives section bars a fixed column count and each tab a minimum width; here the bar is exactly as many equal
// columns as it has tabs (3), so they never overlap
document.head.insertAdjacentHTML('beforeend',`<style>
html body.phone-app #menuov #panel.aq07 .sect-nav,html body.phone-land #menuov #panel.aq07 .sect-nav{grid-template-columns:repeat(3,minmax(0,1fr))!important;grid-auto-flow:row!important}
html body.phone-app #menuov #panel.aq07 .sect-nav > button,html body.phone-land #menuov #panel.aq07 .sect-nav > button{min-width:0!important;width:auto!important;overflow:hidden;text-overflow:ellipsis}
</style>`);
// ---------- Decorate on phones (director, 2026-11-18: "customizing the aquarium is hard and clunky, and when you choose preview it
// starts bad"). What was wrong: the "Previewing... Buy / Stop" bar sat at the top of the Decorate list, already scrolled away, so after
// tapping Preview you could not see what you were trying or how to buy it; the game also scrolled the tank into view, which made the
// page jump; and a previewed decoration was dropped at the far end, often on top of one you already own. Now:
//  - tap any card to try it in the tank (owned cards place / remove); the try-on bar is pinned under the tank with Buy and Stop
//  - a decoration you try lands in the most open spot of the sand (and keeps that spot if you buy it)
//  - cards are smaller (three per row) with the price or state on the card, so the whole collection is a short scroll
{ const bestGap=()=>{ const placed=S.aq.decor.filter(id=>!(AQ_PV&&AQ_PV.id===id)); const ps=aqPositions(placed); const xs=Object.values(ps).sort((a,b)=>a-b); const pts=[.03,...xs,.97]; let best=.5, gap=-1; for(let i=0;i<pts.length-1;i++){ const g=pts[i+1]-pts[i]; if(g>gap){ gap=g; best=(pts[i]+pts[i+1])/2; } } return Math.min(.95,Math.max(.05,best)); };
  const _rp=renderPanel; renderPanel=function(){
    try{ if(MOB()&&S.tab==='aquarium'&&AQ_PV&&AQ_PV.kind==='decor'&&!S.aq.owned.includes(AQ_PV.id)){ S.aq.pos=S.aq.pos||{}; if(S.aq.pos[AQ_PV.id]==null){ const now=aqPositions(S.aq.decor); S.aq.decor.forEach(id=>{ if(S.aq.pos[id]==null) S.aq.pos[id]=now[id]; }); S.aq.pos[AQ_PV.id]=bestGap(); } /* placed decorations keep their spots while one is tried */ } }catch(e){}
    const r=_rp.apply(this,arguments); try{ const P=$('panel'); if(!MOB()||S.tab!=='aquarium'||!P.classList.contains('aq07')) return r;
      const cv=$('tankcv'); if(cv) cv.scrollIntoView=function(){}; /* the tank is always on screen here: no jump */
      const pin=P.querySelector('.aq07-pin'), bar=P.querySelector('.pvbar'), bank=pin&&pin.querySelector('.aq07-bank');
      if(pin&&bar){ bar.classList.add('aq07-try'); const nm=bar.querySelector('b'); const lbl=bar.querySelector('span'); if(lbl&&nm) lbl.innerHTML='Trying: <b>'+nm.innerHTML+'</b>'; if(bank) bank.after(bar); else pin.querySelector('.tank').after(bar); if(bank) bank.classList.add('aq07-hide'); }
      const grid=[...P.querySelectorAll('.jsec .grid')].find(g=>g.querySelector('canvas[data-decor]')); if(grid){ grid.classList.add('aq07-dgrid');
        grid.querySelectorAll(':scope > .tile').forEach(t=>{ const c=t.querySelector('canvas[data-decor]'); if(!c) return; const id=c.dataset.decor, own=S.aq.owned.includes(id), placed=S.aq.decor.includes(id), d=DECORI[id];
          const pvB=t.querySelector('[data-act="aqpv"]'), useB=t.querySelector('[data-act="decor"]'); const trying=AQ_PV&&AQ_PV.kind==='decor'&&AQ_PV.id===id;
          t.classList.toggle('aq07-trying',!!trying); t.classList.toggle('aq07-placed',placed);
          const st=document.createElement('span'); st.className='aq07-st'; st.innerHTML= own?(placed?'In your tank · tap to remove':'Owned · tap to place'):(d&&d.price?(trying?'Trying · buy below':'<span class="coin">'+fmt(d.price)+'</span> · tap to try'):'Crates and prizes only'); t.appendChild(st);
          t.querySelectorAll(':scope > .row, :scope > .btn').forEach(x=>x.classList.add('aq07-hide'));
          if(own&&useB||(!own&&pvB)){ t.setAttribute('role','button'); t.tabIndex=0; t.addEventListener('click',e=>{ if(e.target.closest('button')) return; (own?useB:(trying?null:pvB))&&(own?useB:pvB).click(); }); } }); }
      /* water and floor swatches: the one being tried is marked too, and owned ones say so */
    }catch(e){ console.error(e); } return r; }; }
document.head.insertAdjacentHTML('beforeend',`<style>
html body.phone-app #menuov #panel.aq07 .aq07-hide,html body.phone-land #menuov #panel.aq07 .aq07-hide{display:none!important}
html body.phone-app #menuov #panel.aq07 .aq07-try,html body.phone-land #menuov #panel.aq07 .aq07-try{display:flex!important;align-items:center;justify-content:space-between;gap:8px;margin:0!important;padding:7px 9px!important;border-radius:12px!important;background:linear-gradient(180deg,#2a2410,#1b1708)!important;border:1px solid #ffd36a88!important;color:#fff3cf;font:700 12.5px var(--display)!important;position:static!important}
html body.phone-app #menuov #panel.aq07 .aq07-try > span:first-child,html body.phone-land #menuov #panel.aq07 .aq07-try > span:first-child{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
html body.phone-app #menuov #panel.aq07 .aq07-try .row,html body.phone-land #menuov #panel.aq07 .aq07-try .row{display:flex;gap:6px;flex:0 0 auto;margin:0}
html body.phone-app #menuov #panel.aq07 .aq07-try .btn,html body.phone-land #menuov #panel.aq07 .aq07-try .btn{min-height:34px!important;padding:0 10px!important;font-size:12.5px!important;white-space:nowrap}
html body.phone-app #menuov #panel.aq07 .aq07-try .btn:not(.alt):not(:disabled),html body.phone-land #menuov #panel.aq07 .aq07-try .btn:not(.alt):not(:disabled){background:linear-gradient(180deg,#ffe08a,#f3b94e)!important;border-color:#ffe6a3!important;color:#2a1c05!important}
html body.phone-app #menuov #panel.aq07 .aq07-dgrid,html body.phone-land #menuov #panel.aq07 .aq07-dgrid{grid-template-columns:repeat(3,minmax(0,1fr))!important;gap:6px!important}
html body.phone-app #menuov #panel.aq07 .aq07-dgrid > .tile,html body.phone-land #menuov #panel.aq07 .aq07-dgrid > .tile{padding:6px 4px 7px!important;gap:2px!important;cursor:pointer;min-width:0}
html body.phone-app #menuov #panel.aq07 .aq07-dgrid > .tile canvas,html body.phone-land #menuov #panel.aq07 .aq07-dgrid > .tile canvas{width:60px!important;height:45px!important}
html body.phone-app #menuov #panel.aq07 .aq07-dgrid > .tile > b,html body.phone-land #menuov #panel.aq07 .aq07-dgrid > .tile > b{font-size:12px!important;line-height:1.15;max-width:100%;white-space:normal;overflow-wrap:anywhere}
html body.phone-app #menuov #panel.aq07 .aq07-dgrid > .tile .meta,html body.phone-land #menuov #panel.aq07 .aq07-dgrid > .tile .meta{font-size:10.5px!important;line-height:1.2}
html body.phone-app #menuov #panel.aq07 .aq07-st,html body.phone-land #menuov #panel.aq07 .aq07-st{font:700 10.5px var(--display);color:#7fe3c4;line-height:1.2}
html body.phone-app #menuov #panel.aq07 .aq07-placed,html body.phone-land #menuov #panel.aq07 .aq07-placed{border-color:#7fe3c488!important}
html body.phone-app #menuov #panel.aq07 .aq07-trying,html body.phone-land #menuov #panel.aq07 .aq07-trying{border-color:#ffd36a!important;box-shadow:0 0 0 1px #ffd36a inset!important}
html body.phone-app #menuov #panel.aq07 .aq07-trying .aq07-st,html body.phone-land #menuov #panel.aq07 .aq07-trying .aq07-st{color:#ffd36a}
@media (orientation:landscape) and (max-height:560px){ html body.phone-land #menuov #panel.aq07 .aq07-dgrid{grid-template-columns:repeat(2,minmax(0,1fr))!important} }
</style>`);
// the shared "stuck section bar" band (bm_ui04: a 24 px block above the bar) covered the try-on bar; inside the pinned block the tabs
// are already pinned, so they get no band of their own
document.head.insertAdjacentHTML('beforeend',`<style>
html body.phone-app #menuov #panel.aq07 .aq07-pin > .sect-nav,html body.phone-land #menuov #panel.aq07 .aq07-pin > .sect-nav{position:static!important;box-shadow:none!important}
html body.phone-app #menuov #panel.aq07 .sect-nav.stuck::before,html body.phone-land #menuov #panel.aq07 .sect-nav.stuck::before{display:none!important}
html body.phone-land #menuov #panel.aq07 .aq07-side > .sect-nav.stuck{box-shadow:0 0 0 6px #0b1626,0 10px 10px -6px #000c!important}
</style>`);
// ---------- the tank keeps running through every re-render (director: "each sub menu in aquarium lags the preview"): trying, placing,
// buying or adding a fish rebuilds the page, which used to throw the tank's canvas away (it came back blank at a default size and
// redrew from scratch). The live canvas is now carried into the new page, so the tank never blinks or restarts. ----------
{ const _rp=renderPanel; renderPanel=function(){ const keep=(MOB()&&S.tab==='aquarium')?$('tankcv'):null; const r=_rp.apply(this,arguments);
    try{ if(keep){ const fresh=$('tankcv'); if(fresh&&fresh!==keep){ fresh.replaceWith(keep); keep.scrollIntoView=function(){}; } } }catch(e){} return r; }; }
document.head.insertAdjacentHTML('beforeend',`<style>
html body.phone-app #menuov #panel.aq07 .aq07-off,html body.phone-land #menuov #panel.aq07 .aq07-off{display:none!important}
html body.phone-app #menuov #panel.aq07 .aq07-side > .aq07-bank,html body.phone-land #menuov #panel.aq07 .aq07-side > .aq07-bank{margin:0 0 10px!important}
/* bigger tank: upright it takes the room the earnings strip had (about 36% of the screen height); sideways it fills the whole left column */
html body.phone-app #menuov #panel.aq07 .aq07-pin > .tank{height:clamp(220px,37dvh,340px)!important;max-height:none!important}
html body.phone-app #menuov #panel.aq07 .aq07-pin > .tank > canvas,html body.phone-land #menuov #panel.aq07 .aq07-pin > .tank > canvas{width:100%!important;height:100%!important;display:block}
@media (orientation:landscape) and (max-height:560px){
  html body.phone-land #menuov #panel.aq07 .aq07-pin{gap:6px}
  html body.phone-land #menuov #panel.aq07 .aq07-pin > .tank{height:calc(100dvh - 66px - env(safe-area-inset-top) - env(safe-area-inset-bottom))!important;max-height:none!important}
  html body.phone-land #menuov #panel.aq07 .aq07-pin:has(> .aq07-try) > .tank{height:calc(100dvh - 124px - env(safe-area-inset-top) - env(safe-area-inset-bottom))!important}
}
</style>`);
// ---------- round 7c (director, screenshot 2026-11-18): "move Feed under the aquarium preview and make sure the preview fits properly".
// The drawing stopped ~80 px short of the tank's bottom on phones: an older rule (".tank canvas") caps the canvas at 62% of the screen
// height with a 16:9 shape, so inside the taller box it could not grow. Here the canvas always fills the tank exactly, and the tank is
// sized to the space left above the earnings strip. ----------
document.head.insertAdjacentHTML('beforeend',`<style>
html body.phone-app #menuov #panel.aq07 .aq07-pin > .tank > canvas,html body.phone-land #menuov #panel.aq07 .aq07-pin > .tank > canvas{max-height:none!important;aspect-ratio:auto!important;min-height:0!important}
html body.phone-app #menuov #panel.aq07 .aq07-pin > .tank{height:clamp(200px,31dvh,300px)!important}
html body.phone-app #menuov #panel.aq07 .aq07-pin > .aq07-bank,html body.phone-land #menuov #panel.aq07 .aq07-pin > .aq07-bank{margin:0!important}
@media (orientation:landscape) and (max-height:560px){
  html body.phone-land #menuov #panel.aq07 .aq07-pin > .tank{height:calc(100dvh - 120px - env(safe-area-inset-top) - env(safe-area-inset-bottom))!important}
  html body.phone-land #menuov #panel.aq07 .aq07-pin:has(> .aq07-try) > .tank{height:calc(100dvh - 124px - env(safe-area-inset-top) - env(safe-area-inset-bottom))!important}
}
@media (orientation:landscape) and (max-height:560px) and (max-width:760px){
  html body.phone-land #menuov #panel.aq07 .aq07-pin > .tank{height:calc(100dvh - 150px - env(safe-area-inset-top) - env(safe-area-inset-bottom))!important}
}
</style>`);
