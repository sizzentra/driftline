// =====================================================================
// Phones: the aquarium (Android + iPhone; PC keeps its own layout). Round 7e (director, 2026-11-18: "the aquarium itself is too
// condensed on mobile. Merge Your tank and Add fish into one, thorough, with the headers exactly like Decorate. The aquarium needs a
// panel to open and close these options, allowing a seamless full screen or close to full screen view").
//  - The tank fills the aquarium screen. Under it, one strip: Earnings, Ready to collect, Collect, Feed, and the Options button.
//  - Options opens a panel with two tabs, Your tank and Decorate (upright under the tank, sideways on the right); closed, the tank
//    takes the whole space. The choice is remembered on this phone.
//  - Your tank is one section laid out like Decorate: a heading row (Your tank + Increase tank size, like Decorate + Feed), then
//    sub-headings: Boosts, On display (your fish), Add from your Cooler (the fish you can put on display, with To aquarium).
//  - Decorate: tap a card to try it (owned cards place / remove), the Buy / Stop bar takes the strip's place while you try, and a
//    tried decoration lands in the most open spot of the sand.
//  - The tank's canvas is carried through every re-render, so it never blinks or restarts; turning the phone rebuilds the layout.
// =====================================================================
{ let AQ_OPEN=true; try{ AQ_OPEN=localStorage.getItem('dl-aq-open')!=='0'; }catch(e){}
  const saveOpen=()=>{ try{ localStorage.setItem('dl-aq-open',AQ_OPEN?'1':'0'); }catch(e){} };
  const h=(tag,cls,html)=>{ const e=document.createElement(tag); if(cls) e.className=cls; if(html!=null) e.innerHTML=html; return e; };
  const addRows=()=>{ const full=S.tank.length>=aqCap(); const rows=S.cooler.map((f,i)=>({f,i})).reverse();
    if(!rows.length) return `<div class="empty">Your Cooler is empty. Fish you catch can go on display from here.</div>`;
    return (full?`<p class="aq07-note">The tank is full (${S.tank.length} of ${aqCap()}). Make room or buy a bigger tank to add more.</p>`:'')+`<div class="list aq07-addlist">`+rows.map(({f,i})=>{ const sp=SPI[f.id];
      return `<div class="fishrow"><canvas width="128" height="64" data-fish="${f.id}" data-sh="${f.sh||0}" data-pv="${f.pv||''}"></canvas><div class="nm"><span style="color:${RAR[sp.r].c}">${esc(sp.name)}</span><small>${RAR[sp.r].k} · ${kgStr(f.kg)} · ${fmt(fishRate(f)*60)} / hour · ${esc(aqTxt(f))}</small></div><div class="acts"><button class="btn sm" data-act="totank" data-i="${i}" ${full?'disabled':''}>To aquarium</button></div></div>`; }).join('')+`</div>`; };
  /* Clean Pages (2026-11-21): every phone layer of the Aquarium page lives in this file and runs as one step (the one renderPanel
     wrapper at the bottom of this block), in the order the old separate layers ran: the header card (was pages06.js), the layout,
     Decorate, the live tank canvas carried over, then the Tank cell and the tank size line (was polish08.js). */
  // the header card: a one-line note, the boosts and the earnings together, the long explanation behind "How the aquarium works"
  const aqHeader=P=>{ if(P.querySelector('.mb-aqh')) return; const hd=P.querySelector(':scope > .dl-head'), badges=P.querySelector(':scope > .badges');
      if(hd){ hd.classList.add('mb-aqh'); const sub=hd.querySelector('p.sub'); if(sub){ const full=sub.textContent; sub.textContent='Visitors pay to see your fish, even while you are away. Every fish on display adds its boost.'; sub.insertAdjacentHTML('afterend',`<details class="mb-more"><summary>How the aquarium works</summary><p>${esc(full)}</p><p>Increase your tank size for more fish, more buffs, and more income!</p></details>`); }
        if(badges){ badges.removeAttribute('style'); badges.classList.add('mb-aqb'); hd.appendChild(badges); } } };
  const aqLayout=P=>{
      const tank=P.querySelector(':scope > .tank'), nav=P.querySelector(':scope > .sect-nav'), bank=P.querySelector('.bank'); if(!tank||!nav) return;
      const land=document.body.classList.contains('phone-land'); P.dataset.aqLand=land?'1':'0'; P.classList.toggle('aq07-open',AQ_OPEN);
      const kids=[...P.children].filter(c=>!c.classList.contains('crumb')&&c!==tank&&c!==nav);
      const deco=kids.find(c=>c.classList.contains('jsec')), head=kids.find(c=>c.classList.contains('dl-head')||c.classList.contains('mb-aqh'));
      const spots=kids.find(c=>c!==deco&&c!==head&&c.classList.contains('row')&&/spots used/.test(c.textContent));
      const fishList=kids.find(c=>c!==deco&&(c.classList.contains('list')||c.classList.contains('empty')));
      const dragHint=kids.find(c=>c.tagName==='P'&&/Drag a decoration/.test(c.textContent));
      // stage (the tank) and the strip under it
      const stage=h('div','aq07-stage'); tank.before(stage); stage.appendChild(tank);
      const bar=h('div','aq07-bar'); stage.after(bar); if(bank){ bank.classList.add("aq07-bank"); bar.appendChild(bank); bank.querySelectorAll(".sub").forEach(s=>{ const tx=s.textContent.trim(); if(/^Ready to collect/.test(tx)) s.textContent="Ready"; else if(tx==="/ hour") s.textContent="/h"; }); } /* the short label fits next to the Options button */
      const tog=h('button','aq07-tog'); tog.type='button'; const paintTog=()=>{ tog.setAttribute('aria-expanded',String(AQ_OPEN)); tog.title=AQ_OPEN?'Hide the options and see the whole tank':'Show Your tank and Decorate';
        tog.innerHTML=`<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="${land?(AQ_OPEN?'M9 6l6 6-6 6':'M15 6l-6 6 6 6'):(AQ_OPEN?'M6 9l6 6 6-6':'M6 15l6-6 6 6')}"/></svg><span>${AQ_OPEN?'Hide':'Options'}</span>`; };
      paintTog(); bar.appendChild(tog);
      tog.addEventListener('click',e=>{ e.preventDefault(); e.stopPropagation(); AQ_OPEN=!AQ_OPEN; saveOpen(); P.classList.toggle('aq07-open',AQ_OPEN); paintTog(); });
      // the panel: two tabs (Your tank, Decorate) over one scrolling body
      const sheet=h('div','aq07-sheet'), body=h('div','aq07-body'); bar.after(sheet); sheet.appendChild(nav); sheet.appendChild(body);
      // Your tank, laid out like Decorate: heading row, then sub-headings
      const secT=h('div','aq07-sec aq07-sec-tank'); body.appendChild(secT);
      const buy=spots&&spots.querySelector('button'); const hr=h('div','row spread aq07-h','<h2>Your tank</h2>'); if(buy) hr.appendChild(buy); secT.appendChild(hr);
      if(head){ head.classList.add('aq07-boosts'); secT.appendChild(h('h5',null,'Boosts')); secT.appendChild(head); }
      const used=(spots&&(spots.textContent.match(/\d+\s+of\s+\d+\s+spots used/)||[])[0])||(S.tank.length+' of '+aqCap()+' spots used');
      secT.appendChild(h('h5',null,'On display · '+used)); if(dragHint) secT.appendChild(dragHint); if(fishList) secT.appendChild(fishList);
      secT.appendChild(h('h5',null,'Add from your Cooler · '+S.cooler.length+' fish')); const add=h('div','aq07-add',addRows()); secT.appendChild(add);
      if(spots) spots.remove();
      // Decorate keeps its own section
      const secD=h('div','aq07-sec aq07-sec-deco'); body.appendChild(secD); if(deco) secD.appendChild(deco);
      // the tabs: two now (Add fish lives inside Your tank)
      const showSec=()=>{ const sel=nav.querySelector('[data-sect][aria-selected="true"]'); const isD=!!sel&&sel.dataset.sect==='Decorate'; secT.classList.toggle('aq07-off',isD); secD.classList.toggle('aq07-off',!isD); };
      nav.querySelectorAll('[data-sect]').forEach(b=>b.addEventListener('click',()=>setTimeout(()=>{ showSec(); body.scrollTop=0; },0)));
      showSec(); paintFish(add); };
  // ---------- Decorate on phones: tap to try, the try-on bar in the strip, a tried decoration in the most open spot, small cards ----------
  const bestGap=()=>{ const placed=S.aq.decor.filter(id=>!(AQ_PV&&AQ_PV.id===id)); const ps=aqPositions(placed); const xs=Object.values(ps).sort((a,b)=>a-b); const pts=[.03,...xs,.97]; let best=.5, gap=-1; for(let i=0;i<pts.length-1;i++){ const g=pts[i+1]-pts[i]; if(g>gap){ gap=g; best=(pts[i]+pts[i+1])/2; } } return Math.min(.95,Math.max(.05,best)); };
  const aqTryPlace=()=>{ if(AQ_PV&&AQ_PV.kind==='decor'&&!S.aq.owned.includes(AQ_PV.id)){ S.aq.pos=S.aq.pos||{}; if(S.aq.pos[AQ_PV.id]==null){ const now=aqPositions(S.aq.decor); S.aq.decor.forEach(id=>{ if(S.aq.pos[id]==null) S.aq.pos[id]=now[id]; }); S.aq.pos[AQ_PV.id]=bestGap(); } /* placed decorations keep their spots while one is tried */ } };
  const aqDecorate=P=>{ if(!P.classList.contains('aq07')) return;
      const cv=$('tankcv'); if(cv) cv.scrollIntoView=function(){}; /* the tank is always on screen here: no jump */
      const bar=P.querySelector('.aq07-bar'), pv=P.querySelector('.pvbar:not(.pvhint)');
      if(bar&&pv){ pv.classList.add('aq07-try'); const nm=pv.querySelector('b'), lbl=pv.querySelector('span'); if(lbl&&nm) lbl.innerHTML='Trying: <b>'+nm.innerHTML+'</b>'; bar.prepend(pv); bar.classList.add('aq07-trying-on'); }
      const grid=[...P.querySelectorAll('.jsec .grid')].find(g=>g.querySelector('canvas[data-decor]')); if(grid){ grid.classList.add('aq07-dgrid');
        grid.querySelectorAll(':scope > .tile').forEach(t=>{ const c=t.querySelector('canvas[data-decor]'); if(!c) return; const id=c.dataset.decor, own=S.aq.owned.includes(id), placed=S.aq.decor.includes(id), d=DECORI[id];
          const pvB=t.querySelector('[data-act="aqpv"]'), useB=t.querySelector('[data-act="decor"]'); const trying=AQ_PV&&AQ_PV.kind==='decor'&&AQ_PV.id===id;
          t.classList.toggle('aq07-trying',!!trying); t.classList.toggle('aq07-placed',placed);
          const st=document.createElement('span'); st.className='aq07-st'; st.innerHTML= own?(placed?((S.aq.hid||[]).includes(id)?'Hidden · bonus still counts · tap to remove':'In your tank · tap to remove'):'Owned · tap to place'):(d&&d.price?(trying?'Trying · buy below the tank':'<span class="coin">'+fmt(d.price)+'</span> · tap to try'):'Crates and prizes only'); t.appendChild(st);
          t.querySelectorAll(':scope > .row, :scope > .btn').forEach(x=>x.classList.add('aq07-hide'));
          if(own&&useB||(!own&&pvB)){ t.setAttribute('role','button'); t.tabIndex=0; t.addEventListener('click',e=>{ if(e.target.closest('button')) return; if(own) useB.click(); else if(!trying) pvB.click(); }); } }); } };
  // the tank size (director, 2026-11-18: "Tank doesn't show tank size, upgrade lacks proper description"): a Tank cell in the strip,
  // "holds N fish" on Your tank's heading, and the upgrade says what you get and what it costs
  const aqTankSize=P=>{ if(!P.classList.contains('aq07')) return;
    const cap=aqCap(), n=S.tank.length, bank=P.querySelector('.aq07-bank');
    if(bank&&!bank.querySelector('.mb-tankcell')){ const cells=[...bank.children].filter(c=>c.tagName==='DIV'); const last=cells[cells.length-1];
      const cell=document.createElement('div'); cell.className='mb-tankcell'; cell.title='Fish on display / how many your tank holds';
      cell.innerHTML=`<div class="sub">Tank</div><b>${n} / ${cap}</b>`; if(last) last.after(cell); else bank.prepend(cell); }
    const hr=P.querySelector('.aq07-sec-tank > .aq07-h'); if(hr&&!hr.querySelector('.mb-tankcap')){ const h2=hr.querySelector('h2'); if(h2) h2.insertAdjacentHTML('beforeend',` <span class="mb-tankcap">· holds ${cap} fish</span>`);
      const buy=hr.querySelector('[data-act="buytank"]'); const cost=TANK_COST[S.tankSlots];
      if(buy&&cost!=null){ S.tankSlots++; const nx=aqCap(); S.tankSlots--;
        buy.innerHTML=`Expand Tank · <span class="coin">${fmt(cost)}</span>`; /* C17 (director + Cam, 2026-11-20) */ buy.title='A bigger tank: '+cap+' → '+nx+' fish';
        hr.insertAdjacentHTML('afterend',`<p class="meta mb-tankwhy">Next expansion: ${nx} fish${S.money<cost?` · you need <span class="coin">${fmt(cost-S.money)}</span> more`:''}</p>`); }
      else if(cost==null) hr.insertAdjacentHTML('afterend',`<p class="meta mb-tankwhy">Your tank is as big as it gets: ${cap} fish.</p>`); } };
  // the one step: the tank's live canvas is carried through every re-render, so it never blinks or restarts
  const _rp=renderPanel; renderPanel=function(){ const aq=MOB()&&S.tab==='aquarium', keep=aq?$('tankcv'):null;
    if(aq) try{ aqTryPlace(); }catch(e){}
    const r=_rp.apply(this,arguments); const P=$('panel'); if(!P) return r;
    try{ P.classList.toggle('aq07',aq); }catch(e){}
    if(aq){ for(const step of [aqHeader,aqLayout,aqDecorate]) try{ step(P); }catch(e){ console.error(e); }
      try{ if(keep){ const fresh=$('tankcv'); if(fresh&&fresh!==keep){ fresh.replaceWith(keep); keep.scrollIntoView=function(){}; } } }catch(e){}
      try{ aqTankSize(P); }catch(e){ console.error(e); } }
    return r; };
  /* turning the phone while the aquarium is open rebuilds it for the new layout (checked after the resize settles) */
  let rt=0; addEventListener('resize',()=>{ clearTimeout(rt); rt=setTimeout(()=>{ try{ const P=$('panel'); if(!MOB()||S.tab!=='aquarium'||!P.classList.contains('aq07')) return; const l=document.body.classList.contains('phone-land')?'1':'0'; if(P.dataset.aqLand!==l) renderPanel(); }catch(e){} },160); }); }

document.head.insertAdjacentHTML('beforeend',`<style>
/* ---- layout: the page itself does not scroll; the tank grows, the panel's body scrolls ---- */
html body.phone-app #menuov #panel.aq07,html body.phone-land #menuov #panel.aq07{display:flex!important;flex-direction:column!important;overflow:hidden!important;gap:8px;padding-bottom:6px!important}
html body.phone-app #menuov #panel.aq07 > *,html body.phone-land #menuov #panel.aq07 > *{order:0!important;min-width:0}
html body.phone-app #menuov #panel.aq07 > .crumb,html body.phone-land #menuov #panel.aq07 > .crumb{display:none!important}
html body.phone-app #menuov #panel.aq07 .aq07-stage,html body.phone-land #menuov #panel.aq07 .aq07-stage{flex:1 1 auto;min-height:0;display:flex;position:relative}
html body.phone-app #menuov #panel.aq07 .aq07-stage > .tank,html body.phone-land #menuov #panel.aq07 .aq07-stage > .tank{flex:1 1 auto;height:auto!important;max-height:none!important;min-height:0;margin:0!important;border-radius:16px;overflow:hidden}
html body.phone-app #menuov #panel.aq07 .aq07-stage > .tank > canvas,html body.phone-land #menuov #panel.aq07 .aq07-stage > .tank > canvas{width:100%!important;height:100%!important;max-height:none!important;aspect-ratio:auto!important;min-height:0!important;display:block}
html body.phone-app #menuov #panel.aq07 .aq07-sheet,html body.phone-land #menuov #panel.aq07 .aq07-sheet{display:none;flex-direction:column;min-height:0;gap:8px}
html body.phone-app #menuov #panel.aq07.aq07-open .aq07-sheet,html body.phone-land #menuov #panel.aq07.aq07-open .aq07-sheet{display:flex}
html body.phone-app #menuov #panel.aq07 .aq07-body,html body.phone-land #menuov #panel.aq07 .aq07-body{flex:1 1 auto;min-height:0;overflow-y:auto;overscroll-behavior:contain;-webkit-overflow-scrolling:touch;padding:0 2px 10px}
/* upright: open = the tank on top (about 40% of the space), the panel under the strip; closed = the tank takes it all */
html body.phone-app #menuov #panel.aq07.aq07-open .aq07-stage{flex:0 0 40%}
html body.phone-app #menuov #panel.aq07.aq07-open .aq07-sheet{flex:1 1 0}
/* sideways: the tank and the strip on the left, the panel on the right; closed = the tank takes the whole width */
@media (orientation:landscape) and (max-height:560px){
  html body.phone-land #menuov #panel.aq07{display:grid!important;grid-template-columns:minmax(0,1fr);grid-template-rows:minmax(0,1fr) auto;column-gap:10px;row-gap:6px}
  html body.phone-land #menuov #panel.aq07.aq07-open{grid-template-columns:minmax(0,1.15fr) minmax(0,1fr)}
  html body.phone-land #menuov #panel.aq07 .aq07-stage{grid-column:1;grid-row:1}
  html body.phone-land #menuov #panel.aq07 .aq07-bar{grid-column:1;grid-row:2}
  html body.phone-land #menuov #panel.aq07 .aq07-sheet{grid-column:2;grid-row:1 / span 2;height:100%}
}
/* ---- the strip: earnings, collect, feed, and the Options button ---- */
html body.phone-app #menuov #panel.aq07 .aq07-bar,html body.phone-land #menuov #panel.aq07 .aq07-bar{display:flex;align-items:stretch;gap:6px;flex:0 0 auto}
html body.phone-app #menuov #panel.aq07 .aq07-bank,html body.phone-land #menuov #panel.aq07 .aq07-bank{flex:1 1 auto;display:grid!important;grid-template-columns:minmax(0,1fr) minmax(0,1fr) auto auto;align-items:center;gap:6px!important;margin:0!important;padding:6px 8px!important;border-radius:12px!important;background:linear-gradient(180deg,#16263d,#111e31)!important;border:1px solid #ffffff17!important;min-width:0;box-sizing:border-box}
html body.phone-app #menuov #panel.aq07 .aq07-bank > div,html body.phone-land #menuov #panel.aq07 .aq07-bank > div{min-width:0;line-height:1.15;white-space:nowrap;overflow:hidden}
html body.phone-app #menuov #panel.aq07 .aq07-bank .sub,html body.phone-land #menuov #panel.aq07 .aq07-bank .sub{font:700 10px var(--display)!important;color:#9fb3c8!important;margin:0!important;letter-spacing:.3px}
html body.phone-app #menuov #panel.aq07 .aq07-bank b.coin,html body.phone-land #menuov #panel.aq07 .aq07-bank b.coin{font:800 14px var(--display)!important}
html body.phone-app #menuov #panel.aq07 .aq07-bank .btn,html body.phone-land #menuov #panel.aq07 .aq07-bank .btn{min-height:34px!important;padding:0 10px!important;margin:0!important;font-size:12.5px!important;white-space:nowrap}
html body.phone-app #menuov #panel.aq07 #collectbtn:not(:disabled),html body.phone-land #menuov #panel.aq07 #collectbtn:not(:disabled){background:linear-gradient(180deg,#ffe08a,#f3b94e)!important;border-color:#ffe6a3!important;color:#2a1c05!important}
html body.phone-app #menuov #panel.aq07 .aq07-tog,html body.phone-land #menuov #panel.aq07 .aq07-tog{flex:0 0 auto;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:1px;min-width:58px;padding:0 6px;border-radius:12px;border:1px solid #7fe3c4;background:linear-gradient(180deg,#197a76,#14666a);color:#fff;font:800 11px var(--display);cursor:pointer;box-shadow:0 3px 10px #0007}
html body.phone-app #menuov #panel.aq07.aq07-open .aq07-tog,html body.phone-land #menuov #panel.aq07.aq07-open .aq07-tog{background:#13233a;border-color:#ffffff24;color:#c8fff0;box-shadow:none}
html body.phone-app #menuov #panel.aq07 .aq07-bar.aq07-trying-on > .aq07-bank,html body.phone-land #menuov #panel.aq07 .aq07-bar.aq07-trying-on > .aq07-bank{display:none!important}
/* ---- the panel: tabs and sections ---- */
html body.phone-app #menuov #panel.aq07 .aq07-sheet > .sect-nav,html body.phone-land #menuov #panel.aq07 .aq07-sheet > .sect-nav{display:grid!important;grid-template-columns:repeat(2,minmax(0,1fr))!important;grid-auto-flow:row!important;margin:0!important;position:static!important;box-shadow:none!important;flex:0 0 auto}
html body.phone-app #menuov #panel.aq07 .sect-nav.stuck::before,html body.phone-land #menuov #panel.aq07 .sect-nav.stuck::before{display:none!important}
html body.phone-app #menuov #panel.aq07 .sect-nav > button,html body.phone-land #menuov #panel.aq07 .sect-nav > button{min-width:0!important;width:auto!important}
html body.phone-app #menuov #panel.aq07 .aq07-off,html body.phone-land #menuov #panel.aq07 .aq07-off{display:none!important}
html body.phone-app #menuov #panel.aq07 .aq07-hide,html body.phone-land #menuov #panel.aq07 .aq07-hide{display:none!important}
html body.phone-app #menuov #panel.aq07 .aq07-sec > *,html body.phone-land #menuov #panel.aq07 .aq07-sec > *{margin-top:0}
html body.phone-app #menuov #panel.aq07 .aq07-sec h5,html body.phone-land #menuov #panel.aq07 .aq07-sec h5{margin:14px 0 8px!important}
html body.phone-app #menuov #panel.aq07 .aq07-sec-tank > .aq07-h,html body.phone-land #menuov #panel.aq07 .aq07-sec-tank > .aq07-h{display:flex;align-items:center;justify-content:space-between;gap:8px;flex-wrap:wrap;margin:4px 0 0!important}
html body.phone-app #menuov #panel.aq07 .aq07-sec-tank > .aq07-h h2,html body.phone-land #menuov #panel.aq07 .aq07-sec-tank > .aq07-h h2{margin:0!important}
html body.phone-app #menuov #panel.aq07 .aq07-boosts,html body.phone-land #menuov #panel.aq07 .aq07-boosts{margin:0!important}
html body.phone-app #menuov #panel.aq07 .aq07-note,html body.phone-land #menuov #panel.aq07 .aq07-note{margin:0 2px 8px;font-size:12.5px;color:#b9cadb}
/* ---- Decorate: try-on bar and small cards ---- */
html body.phone-app #menuov #panel.aq07 .aq07-try,html body.phone-land #menuov #panel.aq07 .aq07-try{flex:1 1 auto;display:flex!important;align-items:center;justify-content:space-between;gap:8px;margin:0!important;padding:6px 8px!important;border-radius:12px!important;background:linear-gradient(180deg,#2a2410,#1b1708)!important;border:1px solid #ffd36a88!important;color:#fff3cf;font:700 12.5px var(--display)!important;position:static!important;min-width:0}
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
/* narrow sideways phones: the strip's numbers and buttons take two short rows */
@media (orientation:landscape) and (max-height:560px) and (max-width:760px){
  html body.phone-land #menuov #panel.aq07 .aq07-bank{grid-template-columns:minmax(0,1fr) minmax(0,1fr)!important;row-gap:4px!important}
  html body.phone-land #menuov #panel.aq07 .aq07-bank .btn{width:100%;min-height:30px!important}
}
</style>`);
document.head.insertAdjacentHTML('beforeend',`<style>
/* ---- the header card and the tank size (moved here from pages06.js and polish08.js, Clean Pages 2026-11-21) ---- */
body.phone-app #panel .mb-more,body.phone-land #panel .mb-more{border-radius:12px;background:#0a1424;border:1px solid #ffffff12;padding:0}
body.phone-app #panel .mb-more > summary,body.phone-land #panel .mb-more > summary{list-style:none;cursor:pointer;padding:9px 12px;font:700 13px var(--display,system-ui);color:#7fe3c4;display:flex;align-items:center;gap:8px}
body.phone-app #panel .mb-more > summary::-webkit-details-marker,body.phone-land #panel .mb-more > summary::-webkit-details-marker{display:none}
body.phone-app #panel .mb-more > summary::before,body.phone-land #panel .mb-more > summary::before{content:'›';display:inline-block;transition:transform .15s;font-size:16px;line-height:1}
body.phone-app #panel .mb-more[open] > summary::before,body.phone-land #panel .mb-more[open] > summary::before{transform:rotate(90deg)}
body.phone-app #panel .mb-more p,body.phone-land #panel .mb-more p{margin:0 12px 10px;font-size:12.5px;line-height:1.45;color:#a9bccf}
body.phone-app #panel .mb-aqh,body.phone-land #panel .mb-aqh{display:flex!important;flex-direction:column;align-items:stretch!important;justify-content:flex-start!important;height:auto!important;min-height:0!important;gap:10px;padding:12px 14px;border-radius:16px;background:linear-gradient(180deg,#132238,#0e1a2c);border:1px solid #ffffff14;margin-bottom:10px}
body.phone-app #panel .mb-aqh p.sub,body.phone-land #panel .mb-aqh p.sub{margin:0;font-size:13px;line-height:1.4;color:#b9cadb}
body.phone-app #panel .mb-aqh .bank,body.phone-land #panel .mb-aqh .bank{margin:0!important;width:100%;box-sizing:border-box}
body.phone-app #panel .mb-aqb,body.phone-land #panel .mb-aqb{margin:0!important;display:flex;flex-wrap:wrap;gap:6px}
body.phone-app #panel .mb-aqh > *,body.phone-land #panel .mb-aqh > *{flex:0 0 auto!important;height:auto!important;min-height:0!important}
html body.phone-app #menuov #panel.aq07 .aq07-bank:has(.mb-tankcell),html body.phone-land #menuov #panel.aq07 .aq07-bank:has(.mb-tankcell){grid-template-columns:minmax(0,1fr) minmax(0,1fr) minmax(0,.8fr) auto auto!important}
html body.phone-app #menuov #panel.aq07 .aq07-bank .mb-tankcell b,html body.phone-land #menuov #panel.aq07 .aq07-bank .mb-tankcell b{font:800 14px var(--display)!important;color:var(--ink)}
@media (orientation:landscape) and (max-height:560px) and (max-width:760px){ html body.phone-land #menuov #panel.aq07 .aq07-bank:has(.mb-tankcell){grid-template-columns:repeat(6,minmax(0,1fr))!important} html body.phone-land #menuov #panel.aq07 .aq07-bank:has(.mb-tankcell) > div{grid-column:span 2} html body.phone-land #menuov #panel.aq07 .aq07-bank:has(.mb-tankcell) > .btn{grid-column:span 3} }
html body.phone-app #menuov #panel.aq07 .mb-tankcap,html body.phone-land #menuov #panel.aq07 .mb-tankcap{font:700 13px var(--display);color:#9fb3c8;white-space:nowrap}
html body.phone-app #menuov #panel.aq07 .mb-tankwhy,html body.phone-land #menuov #panel.aq07 .mb-tankwhy{margin:2px 0 8px!important;font-size:12.5px!important;line-height:1.4;color:#b8c8d6}
</style>`);
