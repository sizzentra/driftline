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
// Android + iPhone (and tablets, which use the phone layouts). Every phone layer of the Home page is in this file (Clean Pages 2026-11-21).
// =====================================================================
let homeClassic=null, homeFitWatch=null; /* set below: the classic homes' look choices, the canvas size watcher */
// ---------- the classic homes (was home06.js; Clean Pages 2026-11-21) ----------
// Phones, round 6 critique: "Your home" on phones too (round 5 built it for PC only). Every water has a home (dock, pier,
// boat, trawler, raft, ice camp, beach, stone ledge, crystal shelf); the page offers only what works there: wood where the
// home has wood, the dock's style only at a dock, hull paint on boats, and the home's own light everywhere.
// Shared data and drawing: bu_home05.js.
{ const L=()=>LOCS.find(x=>x.id===S.loc)||LOCS[0];
  let lbl=null; const sync=()=>{ try{ const b=menuTabBtn('home'); if(!b) return; if(lbl==null) lbl=b.dataset.label; const want=MOB()?'🏠 Your home':lbl; if(b.dataset.label!==want){ b.dataset.label=want; menuSubKey=''; if(MENU_OPEN) menuSync(); } }catch(e){} };
  new MutationObserver(sync).observe(document.body,{attributes:true,attributeFilter:['class']}); setTimeout(sync,0); setTimeout(sync,900);
  /* the classic homes' look choices (wood, style, hull paint, light); run first in the Home page's one step below */
  homeClassic=P=>{ if(P.querySelector('.hm-phone')||P.querySelector(':scope > .hf-mark')) return; /* format homes have their own elements */
      const loc=L(), feats=HOME_FEATURES[loc.plat]||['light'], hname=HOME_NAMES[loc.plat]||'home', h5=[...P.querySelectorAll(':scope > h5')];
      const wood=h5.find(h=>/^Wood/i.test(h.textContent)), style=h5.find(h=>/style/i.test(h.textContent)), deco=h5.find(h=>/^Decorations/i.test(h.textContent));
      const hide=h=>{ if(!h) return; h.style.display='none'; const n=h.nextElementSibling; if(n&&n.classList.contains('chips')) n.style.display='none'; };
      if(!feats.includes('wood')) hide(wood); if(!feats.includes('style')) hide(style);
      let html='<div class="hm-phone">';
      if(feats.includes('hull')){ const cur=(S.dock&&S.dock.hull)||''; html+=`<h5>${esc(homePaintName(loc.plat))}</h5><div class="chips">${HOME_HULLS.map(([id,n,c])=>`<button type="button" class="chipb" data-home="hull:${id}" aria-pressed="${cur===id}"><span class="hm-sw" style="background:${c||'linear-gradient(135deg,#f2eee2,#9a2e24)'}"></span>${esc(n)}</button>`).join('')}</div>`; }
      { const cur=(S.dock&&S.dock.light)||''; html+=`<h5>Light</h5><div class="chips">${HOME_LIGHTS.map(([id,n,rgb])=>`<button type="button" class="chipb" data-home="light:${id}" aria-pressed="${cur===id}"><span class="hm-sw hm-glow" style="background:${rgb?'radial-gradient(circle,rgb('+rgb+') 0%,rgba('+rgb+',.35) 55%,transparent 72%)':'radial-gradient(circle,#ffd690 0%,#ffb85a55 55%,transparent 72%)'}"></span>${esc(n)}</button>`).join('')}</div>`; }
      html+=`<p class="hm-note">${feats.includes('style')?'The wood colors your dock; the style shapes it. ':feats.includes('wood')?'The wood colors the wooden parts of your '+esc(hname)+'. ':''}${feats.includes('hull')?esc(homePaintLine(loc.plat,hname)):''}The light recolors the ${loc.plat==='crystal'?'glow':loc.plat==='sand'?'torch':'lamp'} of your ${esc(hname)}. Free to change.</p></div>`;
      if(deco) deco.insertAdjacentHTML('beforebegin',html); else P.insertAdjacentHTML('beforeend',html);
      // the page switches between "Your home" and "Decorations": our block follows the home part, the sort row follows the decorations
      const hm=P.querySelector('.hm-phone'), tools=P.querySelector(':scope > .shoptools'), grid=P.querySelector(':scope > .grid'), dockbar=P.querySelector(':scope > .dockbar');
      const follow=()=>{ const homeOn=dockbar?dockbar.style.display!=='none':true; hm.style.display=homeOn?'':'none'; if(tools&&grid) tools.style.display=grid.style.display==='none'?'none':''; };
      follow(); const nv=P.querySelector(':scope > .bwx-nav'); if(nv) nv.addEventListener('click',()=>setTimeout(follow,0));
      // words: "home" instead of "dock" where the page talks about every water
      const intro=P.querySelector('.dl-head'); if(intro){ for(const n of intro.querySelectorAll('*')) if(n.children.length===0&&/Every water has its own dock/.test(n.textContent)) n.textContent='Every water has its own home: here it is your '+hname+'. Pick its look and its decorations: the cozier it gets, the better you fish here.'; }
      const nav=P.querySelector(':scope > .bwx-nav'); if(nav&&nav.firstElementChild&&/^Dock$/.test(nav.firstElementChild.textContent.trim())) nav.firstElementChild.textContent='Your '+hname; };
  document.addEventListener('click',e=>{ const b=e.target.closest&&e.target.closest('#panel [data-home]'); if(!b||!MOB()) return; e.stopPropagation(); const [k,id]=b.dataset.home.split(':');
    if(k==='light'&&homeLightOk(id)) S.dock.light=id; else if(k==='hull'&&homeHullOk(id)) S.dock.hull=id; else return;
    try{ sfx.coin(); }catch(er){} save(); renderPanel(); },true); }
document.head.insertAdjacentHTML('beforeend',`<style>
body.phone-app #panel .hm-phone h5,body.phone-land #panel .hm-phone h5{margin:14px 0 6px}
body.phone-app #panel .hm-sw,body.phone-land #panel .hm-sw{display:inline-block;width:12px;height:12px;border-radius:4px;margin-right:6px;vertical-align:-2px;box-shadow:inset 0 0 0 1px #ffffff33}
body.phone-app #panel .hm-glow,body.phone-land #panel .hm-glow{border-radius:50%;width:14px;height:14px;box-shadow:none}
body.phone-app #panel .hm-note,body.phone-land #panel .hm-note{margin:8px 2px 4px;font-size:12.5px;color:#9fb2c8;line-height:1.45}
</style>`);
{ let DK_OPEN=true; try{ DK_OPEN=localStorage.getItem('dl-dk-open')!=='0'; }catch(e){}
  const saveOpen=()=>{ try{ localStorage.setItem('dl-dk-open',DK_OPEN?'1':'0'); }catch(e){} };
  const h=(tag,cls,html)=>{ const e=document.createElement(tag); if(cls) e.className=cls; if(html!=null) e.innerHTML=html; return e; };
  /* the strip's Options / Hide button (opens and closes the panel; remembered on this device) */
  const mkTog=(P,bar,land,showT,hideT)=>{ const tog=h('button','aq07-tog'); tog.type='button'; const paintTog=()=>{ tog.setAttribute('aria-expanded',String(DK_OPEN)); tog.title=DK_OPEN?hideT:showT;
      tog.innerHTML=`<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="${land?(DK_OPEN?'M9 6l6 6-6 6':'M15 6l-6 6 6 6'):(DK_OPEN?'M6 9l6 6 6-6':'M6 15l6-6 6 6')}"/></svg><span>${DK_OPEN?'Hide':'Options'}</span>`; };
    paintTog(); bar.appendChild(tog);
    tog.addEventListener('click',e=>{ e.preventDefault(); e.stopPropagation(); DK_OPEN=!DK_OPEN; saveOpen(); P.classList.toggle("aq07-open",DK_OPEN); paintTog(); fit($("homecv")); }); };
  let RO=null; const fit=c=>{ const v=c&&c.parentElement; if(!v) return; if(typeof cv!=='undefined'&&cv&&cv.width>40&&W>40){ try{ paintHome(); }catch(e){} return; } /* live scene view: paintHome sizes the canvas itself */ const r=v.getBoundingClientRect(); if(r.width<40||r.height<40) return; const H2=Math.max(200,Math.min(1600,Math.round(900*r.height/r.width)));
    if(c.width!==900||c.height!==H2){ c.width=900; c.height=H2; try{ paintHome(); }catch(e){} } };
  const homeLayout=P=>{
      const cv=P.querySelector('#homecv'), tile=cv&&cv.closest('.tile'), nav=P.querySelector(':scope > .sect-nav'); if(!tile||!nav) return;
      /* a home in the home format (docs/HOME_STANDARD.md): the close-up of the home, a strip, and its 5 elements as the tabs */
      if(P.querySelector(':scope > .hf-mark')){ const sp=hfSpec(S.loc), land=document.body.classList.contains('phone-land'); P.dataset.dkLand=land?'1':'0';
        P.classList.add('aq07','dk08'); P.classList.toggle('aq07-open',DK_OPEN);
        const stage=h('div','aq07-stage'); tile.before(stage); tile.classList.add('dk08-view'); tile.removeAttribute('style'); stage.appendChild(tile); cv.removeAttribute('style');
        const bar=h('div','aq07-bar'); stage.after(bar);
        bar.appendChild(h('div','aq07-bank dk08-bank',`<div><span class="sub">Your home</span><b>${esc(sp.name)}</b></div><div><span class="sub">Parts</span><b>${sp.els.length} to change</b></div><div><span class="sub">Cost</span><b>All free</b></div>`));
        mkTog(P,bar,land,'Show the parts of your '+sp.hname,'Hide the parts and see your whole '+sp.hname);
        const sheet=h('div','aq07-sheet'), body=h('div','aq07-body'), sec=h('div','aq07-sec dk08-sec-home'); bar.after(sheet); sheet.appendChild(nav); sheet.appendChild(body); body.appendChild(sec);
        P.querySelectorAll(':scope > [data-hel]').forEach(el=>sec.appendChild(el));
        [...P.children].forEach(ch=>{ if(ch!==stage&&ch!==bar&&ch!==sheet&&!ch.classList.contains('crumb')&&!ch.classList.contains('hf-mark')) ch.remove(); });
        nav.addEventListener('click',()=>{ body.scrollTop=0; });
        if(!RO&&window.ResizeObserver) RO=new ResizeObserver(()=>{ const k=$('homecv'); if(k&&MOB()&&S.tab==='home') fit(k); });
        if(RO){ RO.disconnect(); RO.observe(tile); } fit(cv); return; }
      const loc=LOCS[locIdx(S.loc)]||LOCS[0], feats=HOME_FEATURES[loc.plat]||['light'], hname=HOME_NAMES[loc.plat]||'home', Hn=hname.charAt(0).toUpperCase()+hname.slice(1);
      const land=document.body.classList.contains('phone-land'); P.dataset.dkLand=land?'1':'0';
      P.classList.add('aq07','dk08'); P.classList.toggle('aq07-open',DK_OPEN);
      const kids=[...P.children].filter(c=>!c.classList.contains('crumb')&&c!==nav&&c!==tile);
      const head=kids.find(c=>c.classList.contains('dl-head')), pv=kids.find(c=>c.classList.contains('pvbar')&&!c.classList.contains('pvhint')), hint=kids.find(c=>c.tagName==='P'&&/Drag/.test(c.textContent));
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
      mkTog(P,bar,land,'Show Your '+hname+' and Decorations','Hide the options and see the whole '+hname);
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
      if(dockbar){ const lab=dockbar.querySelector('.dock-h > .meta'); if(lab) lab.remove(); secH.appendChild(h('h5',null,'Your homes')); move(secH,dockbar); }
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
      if(RO){ RO.disconnect(); RO.observe(tile); } fit(cv); };
  /* the live view is carried through every re-render, so it never blinks */
  /* Clean Pages (2026-11-21): the Home page's one step, in the order its old separate layers ran: the classic homes' look choices
     (was home06.js), the layout, the live view carried over, then the canvas size watcher */
  const _rp=renderPanel; renderPanel=function(){ const on=MOB()&&S.tab==='home', keep=on?$('homecv'):null; const r=_rp.apply(this,arguments); const P=$('panel'); if(!P) return r;
    if(!on){ P.classList.remove('dk08'); return r; }
    try{ homeClassic(P); }catch(e){ console.error(e); }
    try{ homeLayout(P); }catch(e){ console.error(e); }
    try{ if(keep){ const fresh=$('homecv'); if(fresh&&fresh!==keep){ fresh.replaceWith(keep); keep.removeAttribute('style'); } } }catch(e){}
    try{ if(homeFitWatch) homeFitWatch(); }catch(e){}
    return r; };
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
@media (orientation:landscape) and (max-height:560px) and (max-width:760px){ html body.phone-land #menuov #panel.dk08 .dk08-bank{grid-template-columns:repeat(2,minmax(0,1fr))!important;row-gap:4px!important} html body.phone-land #menuov #panel.dk08 .dk08-bank > div:first-child{grid-column:1 / -1} } /* narrow phones: Cozy (its name can be long) gets its own line, Bonus and Placed share the next */
</style>`);
/* ---------- Your home shows the REAL home of every water (director, 2026-11-18: "make sure the home works for ALL maps, in each way
   that applies to them"). The phone view used to draw a generic wooden dock everywhere (wrong at a boat, trawler, raft, ice camp,
   beach, stone ledge or crystal shelf). Now, like PC, it shows the live scene of the water you are at, framed on your angler and
   home: the right home, its hull paint, light, wood, decorations and pets, the sky, weather and time of day. While the page is
   open the scene keeps drawing 30 times a second (the rest of the time menus pause it, as before); dragging decorations and pets
   moves them to the exact spots the game uses. Falls back to the drawn view if the scene is not available. ---------- */
function DK_SCENE_OK(now){ if(S.tab!=='home'||!MOB()) return false; const c=$('homecv'); if(!c||!c.isConnected||!c.closest('.dk08-view')) return false;
  /* round 8 (director: "Home preview is very choppy and low fps"): a steady pace like the aquarium tank, every display frame on 60 Hz
     screens and exactly every other frame on 120 Hz screens (the old "at least 32 ms" rule dropped frames on timing jitter), and the
     preview is copied in the same frame the scene is drawn (it used to have its own unsynced 30-a-second timer, so many copies showed
     a frame that had not changed) */
  const S0=DK_SCENE_OK, d=now-(S0.raw||0); S0.raw=now; if(d>2&&d<60) S0.ema=(S0.ema||16.7)*.92+d*.08;
  if((S0.ema||16.7)<11||(S0.cost||0)>9){ S0.odd=!S0.odd; /* 120 Hz screen, or a phone that needs more than ~9 ms for the scene: a steady every other frame */ if(S0.odd) return false; } else S0.odd=false; S0.drew=now; S0.drewAt=performance.now(); return true; }
{ const crop=c=>{ const L=LOCS[locIdx(S.loc)], f=(L&&(L.plat==='boat'||L.plat==='trawler'||L.plat==='raft'))?.55:.64; const top=(typeof MB_STATUS_B==='number'?MB_STATUS_B:40)+4; /* below the weather label and boost timers drawn on the water */ if(HOMEF[S.loc]) return hfFrame(c,top); /* format homes: framed on the home */ let sw=Math.min(W,W*.62), sh=sw*c.height/c.width; if(sh>H-top){ sh=H-top; sw=Math.min(W,sh*c.width/c.height); } return {sx:0, sy:Math.max(top,Math.min(H-sh,H*.6-sh*f)), sw, sh}; };
  const live=()=>typeof cv!=='undefined'&&cv&&cv.width>40&&W>40&&H>40;
  const _ph=paintHome; paintHome=function(){ const c=$('homecv'); if(!c||!MOB()||!c.closest('.dk08-view')||!live()) return _ph.apply(this,arguments);
    if(!paintHome.now&&performance.now()-(DK_SCENE_OK.drewAt||0)<150) return; /* the live scene copies itself right after each draw (below) */
    const r=c.getBoundingClientRect(); if(r.width<20||r.height<20) return; const k=Math.min(2,window.devicePixelRatio||1), w=Math.round(r.width*k), hh=Math.round(r.height*k);
    if(c.width!==w||c.height!==hh){ c.width=w; c.height=hh; } const b=crop(c); if(HOMEF[S.loc]&&hfCloseup(c,b)) return; /* format homes: drawn sharp at the close-up's own size */ const d=cv.width/W, x=c.getContext('2d'); x.imageSmoothingEnabled=true; x.imageSmoothingQuality='low';
    x.drawImage(cv,b.sx*d,b.sy*d,b.sw*d,b.sh*d,0,0,w,hh); };
  { const _dr=draw; draw=function(now){ const a=performance.now(), r=_dr.apply(this,arguments); if(DK_SCENE_OK.drew===now&&now){ DK_SCENE_OK.cost=(DK_SCENE_OK.cost||6)*.85+(performance.now()-a)*.15; DK_SCENE_OK.drew=-1; paintHome.now=true; try{ paintHome(); }catch(e){} paintHome.now=false; } return r; }; } /* copy the frame just drawn */
  /* drag decorations and pets along the real home (the same fractions the game uses) */
  document.addEventListener('pointerdown',e=>{ const c=e.target; if(!c||c.id!=='homecv'||!MOB()||!c.closest('.dk08-view')||!live()||HOMEF[S.loc]) return; /* format homes: nothing to drag */ e.stopImmediatePropagation(); e.preventDefault();
    const b=crop(c), r=c.getBoundingClientRect(), gx=ev=>b.sx+(ev.clientX-r.left)/r.width*b.sw, X0=W*.008, SPAN=W*.17, frac=v=>clamp((v-X0)/SPAN,0,1);
    const sc=clamp(H/420,.7,1.25), ax=W*.12, items=dockView(), P=dockPositions(items,(ax-40*sc-X0)/(W*.178-X0),(ax+12*sc-X0)/(W*.178-X0));
    const x0=gx(e); let best=null, bd=W*.02;
    for(const id in P){ const dd=Math.abs(X0+P[id]*SPAN-x0); if(dd<bd){ bd=dd; best=id; } }
    for(const wh of ['1','2']){ if(wh==='1'&&!S.pet) continue; if(wh==='2'&&!(S.pet2&&PETI[S.pet2])) continue; const pos=S.dock[wh==='2'?'pet2Pos':'petPos']; if(pos==null) continue; const dd=Math.abs(scenePetX(pos)-x0); if(dd<bd){ bd=dd; best='pet'+wh; } }
    if(!best) return; try{ c.setPointerCapture(e.pointerId); }catch(er){}
    const mv=ev=>{ const v=frac(gx(ev)); if(best==='pet1') S.dock.petPos=v; else if(best==='pet2') S.dock.pet2Pos=v; else { S.dock.pos=S.dock.pos||{}; S.dock.pos[best]=v; } };
    const up=()=>{ c.removeEventListener('pointermove',mv); c.removeEventListener('pointerup',up); c.removeEventListener('pointercancel',up); save(); };
    c.addEventListener('pointermove',mv); c.addEventListener('pointerup',up); c.addEventListener('pointercancel',up); },true);
  /* the canvas follows the view's size (sharp at any size) */
  const _fitRO=window.ResizeObserver?new ResizeObserver(()=>{ try{ if(S.tab==='home'&&MOB()) paintHome(); }catch(e){} }):null;
  homeFitWatch=()=>{ const c=$('homecv'); if(_fitRO&&c&&c.parentElement){ _fitRO.disconnect(); _fitRO.observe(c.parentElement); } }; }
/* 0.4.9: the cozy name shortens with "…" so a two-digit cozy never pushes out of its cell (cozy can reach 60 with the Homebody path) */
document.head.insertAdjacentHTML('beforeend','<style>#panel .dk08-bank > div{min-width:0}#panel .dk08-bank > div > .sub{display:block;max-width:100%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}</style>');
