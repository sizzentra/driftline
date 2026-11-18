// =====================================================================
// Phones, round 8: the Dock (Your home) is organised exactly like the aquarium (director, 2026-11-18: "I want the dock reworked
// and organized exactly like the aquarium. Make sure it functions, runs well and supports all mobile versions").
// It uses the aquarium's own layout and styles (the same aq07-* classes and the same MB_UI checks), so the two pages always match:
//  - The live dock view fills the page. Under it, one strip: Cozy level, Bonus, Decorations placed, and the Options button.
//  - Options opens a panel with two tabs, Your <home> and Decorations (upright under the view, sideways on the right); closed, the
//    view takes the whole space. The choice is remembered on this device.
//  - Your <home>: a heading row, then sub-headings: Wood, Dock style, Light (and Hull paint on boats), Your docks (other waters:
//    copy a layout or travel). Only what works at this water is shown.
//  - Decorations: small cards like Decorate. Tap a card to try it (owned cards place / remove); while trying, the Buy / Stop bar
//    takes the strip's place, exactly like the aquarium.
//  - The view's canvas is carried through every re-render (no blink) and keeps the dock's zoom whatever the shape of the screen.
// Android + iPhone (and tablets, which use the phone layouts).
// =====================================================================
{ let DK_OPEN=true; try{ DK_OPEN=localStorage.getItem('dl-dk-open')!=='0'; }catch(e){}
  const saveOpen=()=>{ try{ localStorage.setItem('dl-dk-open',DK_OPEN?'1':'0'); }catch(e){} };
  const h=(tag,cls,html)=>{ const e=document.createElement(tag); if(cls) e.className=cls; if(html!=null) e.innerHTML=html; return e; };
  let RO=null; const fit=c=>{ const v=c&&c.parentElement; if(!v) return; const r=v.getBoundingClientRect(); if(r.width<40||r.height<40) return; const H2=Math.max(200,Math.min(1600,Math.round(900*r.height/r.width)));
    if(c.width!==900||c.height!==H2){ c.width=900; c.height=H2; try{ paintHome(); }catch(e){} } };
  const _rp=renderPanel; renderPanel=function(){ const r=_rp.apply(this,arguments); try{ const P=$('panel'); const on=MOB()&&S.tab==='home'; if(!on){ P.classList.remove('dk08'); return r; }
      const cv=P.querySelector('#homecv'), tile=cv&&cv.closest('.tile'), nav=P.querySelector(':scope > .sect-nav'); if(!tile||!nav) return r;
      const loc=LOCS[locIdx(S.loc)]||LOCS[0], feats=HOME_FEATURES[loc.plat]||['light'], hname=HOME_NAMES[loc.plat]||'home', Hn=hname.charAt(0).toUpperCase()+hname.slice(1);
      const land=document.body.classList.contains('phone-land'); P.dataset.dkLand=land?'1':'0';
      P.classList.add('aq07','dk08'); P.classList.toggle('aq07-open',DK_OPEN);
      const kids=[...P.children].filter(c=>!c.classList.contains('crumb')&&c!==nav&&c!==tile);
      const head=kids.find(c=>c.classList.contains('dl-head')), pv=kids.find(c=>c.classList.contains('pvbar')), hint=kids.find(c=>c.tagName==='P'&&/Drag/.test(c.textContent));
      const dockbar=kids.find(c=>c.classList.contains('dockbar')), hm=kids.find(c=>c.classList.contains('hm-phone'));
      const h5s=kids.filter(c=>c.tagName==='H5'), wood=h5s.find(x=>/^Wood/i.test(x.textContent)), style=h5s.find(x=>/style/i.test(x.textContent)), decoH=h5s.find(x=>/^Decorations/i.test(x.textContent));
      const tools=kids.find(c=>c.classList.contains('shoptools')), grid=kids.find(c=>c.classList.contains('grid')&&c.querySelector('canvas[data-dock]'));
      const after=x=>x&&x.nextElementSibling&&x.nextElementSibling.classList.contains('chips')?x.nextElementSibling:null;
      // the view (the live dock) and the strip under it
      const stage=h('div','aq07-stage'); tile.before(stage); tile.classList.add('dk08-view'); tile.removeAttribute('style'); stage.appendChild(tile); cv.removeAttribute('style'); homeDragSetup();
      if(hint){ hint.className='dk08-hint'; hint.textContent='Drag decorations and pets to move them'; stage.appendChild(hint); }
      const bar=h('div','aq07-bar'); stage.after(bar);
      const c=cozy(), cb=cozyBonus(), bank=h('div','aq07-bank dk08-bank',`<div><span class="sub">Cozy · ${esc(cozyName())}</span><b>${c} ♥</b></div><div><span class="sub">Bonus</span><b>+${cb}% XP</b></div><div><span class="sub">Placed</span><b>${S.dock.decor.length} / ${DOCK_SLOTS}</b></div>`);
      bar.appendChild(bank);
      const tog=h('button','aq07-tog'); tog.type='button'; const paintTog=()=>{ tog.setAttribute('aria-expanded',String(DK_OPEN)); tog.title=DK_OPEN?'Hide the options and see the whole '+hname:'Show Your '+hname+' and Decorations';
        tog.innerHTML=`<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="${land?(DK_OPEN?'M9 6l6 6-6 6':'M15 6l-6 6 6 6'):(DK_OPEN?'M6 9l6 6 6-6':'M6 15l6-6 6 6')}"/></svg><span>${DK_OPEN?'Hide':'Options'}</span>`; };
      paintTog(); bar.appendChild(tog);
      tog.addEventListener('click',e=>{ e.preventDefault(); e.stopPropagation(); DK_OPEN=!DK_OPEN; saveOpen(); P.classList.toggle("aq07-open",DK_OPEN); paintTog(); fit($("homecv")); });
      if(pv){ pv.classList.add('aq07-try'); const nm=pv.querySelector('b'), lbl=pv.querySelector('span'); if(lbl&&nm) lbl.innerHTML='Trying: <b>'+nm.innerHTML+'</b>'; bar.prepend(pv); bar.classList.add('aq07-trying-on'); }
      // the panel: two tabs over one scrolling body
      const sheet=h('div','aq07-sheet'), body=h('div','aq07-body'); bar.after(sheet); sheet.appendChild(nav); sheet.appendChild(body);
      const move=(sec,el)=>{ if(!el) return; el.style.display=''; sec.appendChild(el); };
      // Your <home>: heading row, then sub-headings (only what works at this water)
      const secH=h('div','aq07-sec dk08-sec-home'); body.appendChild(secH);
      secH.appendChild(h('div','row spread aq07-h',`<h2>Your ${esc(hname)}</h2>`));
      secH.appendChild(h('p','aq07-note','Every water has its own '+esc(hname)+'. The cozier it is, the better you fish here.'));
      if(feats.includes("wood")){ const wc=after(wood); move(secH,wood); move(secH,wc); } else { if(wood) wood.remove(); const n=after(wood); if(n) n.remove(); }
      if(feats.includes('style')){ const sc=after(style); move(secH,style); move(secH,sc); } else { const sc=after(style); if(style) style.remove(); if(sc) sc.remove(); }
      if(hm){ move(secH,hm); }
      if(dockbar){ const lab=dockbar.querySelector('.dock-h > .meta'); if(lab) lab.remove(); secH.appendChild(h('h5',null,'Your docks')); move(secH,dockbar); }
      // Decorations: small cards, tap to try / place
      const secD=h('div','aq07-sec dk08-sec-deco'); body.appendChild(secD);
      secD.appendChild(h('div','row spread aq07-h','<h2>Decorations</h2>'));
      if(decoH){ decoH.textContent=S.dock.decor.length+' of '+DOCK_SLOTS+' spots used'; move(secD,decoH); } move(secD,tools); move(secD,grid);
      if(grid){ grid.classList.add('aq07-dgrid'); grid.removeAttribute('style');
        grid.querySelectorAll(':scope > .tile').forEach(t=>{ const cvs=t.querySelector('canvas[data-dock]'); if(!cvs) return; const id=cvs.dataset.dock, d=DOCKI[id]||DOCK_DECOR.find(x=>x.id===id)||{}, own=S.dock.owned.includes(id), placed=S.dock.decor.includes(id), hidden=!own&&d.src!=='shop';
          const pvB=t.querySelector('[data-act="dockpv"]'), useB=t.querySelector('[data-act="dockdecor"]'), trying=DOCK_PV&&DOCK_PV.kind==='decor'&&DOCK_PV.id===id;
          t.classList.toggle('aq07-trying',!!trying); t.classList.toggle('aq07-placed',placed); t.removeAttribute('style');
          const st=h('span','aq07-st', own?(placed?'On your '+esc(hname)+' · tap to remove':'Owned · tap to place'):hidden?'A Tide Pass reward':(trying?'Trying · buy below the view':'<span class="coin">'+fmt(d.price||0)+'</span> · tap to try')); t.appendChild(st);
          t.querySelectorAll(':scope > .row, :scope > .btn').forEach(x=>x.classList.add('aq07-hide')); t.querySelectorAll(':scope > .meta').forEach(m=>{ if(/Tide Pass/.test(m.textContent)) m.classList.add('aq07-hide'); });
          if((own&&useB)||(!own&&pvB)){ t.setAttribute('role','button'); t.tabIndex=0; t.addEventListener('click',e=>{ if(e.target.closest('button')) return; if(own) useB.click(); else if(!trying) pvB.click(); }); } }); }
      if(head) head.remove(); [...P.children].forEach(ch=>{ if(ch!==stage&&ch!==bar&&ch!==sheet&&!ch.classList.contains('crumb')) ch.remove(); });
      // the tabs: Your <home> / Decorations (the page remembers the last one)
      const b0=nav.querySelector('[data-sect]'); if(b0&&b0.dataset.sect!=='Decorations') b0.textContent='Your '+hname;
      const showSec=()=>{ const sel=nav.querySelector('[data-sect][aria-selected="true"]'); const isD=!!sel&&sel.dataset.sect==='Decorations'; secH.classList.toggle('aq07-off',isD); secD.classList.toggle('aq07-off',!isD); };
      nav.addEventListener('click',e=>{ const b=e.target.closest('[data-sect]'); if(!b) return; e.stopImmediatePropagation(); e.preventDefault(); try{ SECT.home=b.dataset.sect; }catch(er){}
        nav.querySelectorAll('[data-sect]').forEach(x=>x.setAttribute('aria-selected',String(x===b))); showSec(); body.scrollTop=0; },true);
      showSec();
      // the view keeps the dock's zoom whatever the shape of the space (no stretching)
      if(!RO&&window.ResizeObserver) RO=new ResizeObserver(()=>{ const k=$('homecv'); if(k&&MOB()&&S.tab==='home') fit(k); });
      if(RO){ RO.disconnect(); RO.observe(tile); } fit(cv);
    }catch(e){ console.error(e); } return r; };
  /* the live view is carried through every re-render, so it never blinks */
  const _rp2=renderPanel; renderPanel=function(){ const keep=(MOB()&&S.tab==='home')?$('homecv'):null; const r=_rp2.apply(this,arguments);
    try{ if(keep){ const fresh=$('homecv'); if(fresh&&fresh!==keep){ fresh.replaceWith(keep); keep.removeAttribute('style'); } } }catch(e){} return r; };
  /* turning the phone while the Dock is open rebuilds it for the new layout */
  let rt=0; addEventListener('resize',()=>{ clearTimeout(rt); rt=setTimeout(()=>{ try{ const P=$('panel'); if(!MOB()||S.tab!=='home'||!P.classList.contains('dk08')) return; const l=document.body.classList.contains('phone-land')?'1':'0'; if(P.dataset.dkLand!==l) renderPanel(); }catch(e){} },160); }); }

document.head.insertAdjacentHTML('beforeend',`<style>
html body.phone-app #menuov #panel.dk08 .aq07-stage > .dk08-view,html body.phone-land #menuov #panel.dk08 .aq07-stage > .dk08-view{flex:1 1 auto;min-height:0;margin:0!important;padding:0!important;border-radius:16px;overflow:hidden;display:block}
html body.phone-app #menuov #panel.dk08 .dk08-view > canvas,html body.phone-land #menuov #panel.dk08 .dk08-view > canvas{width:100%!important;height:100%!important;display:block;touch-action:pan-y}
html body.phone-app #menuov #panel.dk08 .dk08-hint,html body.phone-land #menuov #panel.dk08 .dk08-hint{position:absolute;left:50%;bottom:8px;transform:translateX(-50%);margin:0;padding:3px 10px;border-radius:999px;background:#050e14b0;color:#cfe0ee;font:700 10.5px var(--display);white-space:nowrap;pointer-events:none}
html body.phone-app #menuov #panel.dk08 .dk08-bank,html body.phone-land #menuov #panel.dk08 .dk08-bank{grid-template-columns:repeat(3,minmax(0,1fr))!important}
html body.phone-app #menuov #panel.dk08 .dk08-bank b,html body.phone-land #menuov #panel.dk08 .dk08-bank b{display:block;font:800 14px var(--display)!important;color:#fff;overflow:hidden;text-overflow:ellipsis}
html body.phone-app #menuov #panel.dk08 .dockbar,html body.phone-land #menuov #panel.dk08 .dockbar{margin:0!important}
html body.phone-app #menuov #panel.dk08 .hm-phone > h5:first-child,html body.phone-land #menuov #panel.dk08 .hm-phone > h5:first-child{margin-top:14px!important}
@media (orientation:landscape) and (max-height:560px) and (max-width:760px){ html body.phone-land #menuov #panel.dk08 .dk08-bank{grid-template-columns:repeat(3,minmax(0,1fr))!important} }
</style>`);
