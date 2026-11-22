// =====================================================================
// Phones: Your home, organised like the Aquarium (same aq07-* layout and MB_UI checks, so the two pages always match).
//  - The live close-up of the home fills the page, with where you are as a small label and Options / Hide on its corner.
//  - Options opens the home's 6 features as tabs (docs/HOME_STANDARD.md); closed, the view takes the whole space (remembered on this device).
//  - The view's canvas is carried through every re-render (no blink).
// Android + iPhone (and tablets, which use the phone layouts). Every phone layer of the Home page is in this file.
// =====================================================================
let homeFitWatch=null; /* set below: the canvas size watcher */
/* the Home tab is called "Your home" in the phone menu */
{ let lbl=null; const sync=()=>{ try{ const b=menuTabBtn('home'); if(!b) return; if(lbl==null) lbl=b.dataset.label; const want=MOB()?'🏠 Your home':lbl; if(b.dataset.label!==want){ b.dataset.label=want; menuSubKey=''; if(MENU_OPEN) menuSync(); } }catch(e){} };
  new MutationObserver(sync).observe(document.body,{attributes:true,attributeFilter:['class']}); setTimeout(sync,0); setTimeout(sync,900); }
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
        /* no strip under the view (director, 2026-11-21: it ate space and said little): where you are is a small label on the view, and
           Options / Hide sits on the view's corner */
        stage.appendChild(h('div','dk08-where',`${esc(LOCS[locIdx(S.loc)].name)}<span> · ${esc(sp.hname)}</span>`));
        const bar=h('div','aq07-bar dk08-ov'); stage.appendChild(bar);
        mkTog(P,bar,land,'Show the parts of your '+sp.hname,'Hide the parts and see your whole '+sp.hname);
        const sheet=h('div','aq07-sheet'), body=h('div','aq07-body'), sec=h('div','aq07-sec dk08-sec-home'); stage.after(sheet); sheet.appendChild(nav); sheet.appendChild(body); body.appendChild(sec);
        P.querySelectorAll(':scope > [data-hel]').forEach(el=>sec.appendChild(el));
        [...P.children].forEach(ch=>{ if(ch!==stage&&ch!==bar&&ch!==sheet&&!ch.classList.contains('crumb')&&!ch.classList.contains('hf-mark')) ch.remove(); });
        nav.addEventListener('click',()=>{ body.scrollTop=0; });
        if(!RO&&window.ResizeObserver) RO=new ResizeObserver(()=>{ const k=$('homecv'); if(k&&MOB()&&S.tab==='home') fit(k); });
        if(RO){ RO.disconnect(); RO.observe(tile); } fit(cv); } };
  /* the live view is carried through every re-render, so it never blinks */
  const _rp=renderPanel; renderPanel=function(){ const on=MOB()&&S.tab==='home', keep=on?$('homecv'):null; const r=_rp.apply(this,arguments); const P=$('panel'); if(!P) return r;
    if(!on){ P.classList.remove('dk08'); return r; }
    try{ homeLayout(P); }catch(e){ console.error(e); }
    try{ if(keep){ const fresh=$('homecv'); if(fresh&&fresh!==keep){ fresh.replaceWith(keep); keep.removeAttribute('style'); } } }catch(e){}
    try{ if(homeFitWatch) homeFitWatch(); }catch(e){}
    return r; };
  /* turning the phone while the Dock is open rebuilds it for the new layout */
  let rt=0; addEventListener('resize',()=>{ clearTimeout(rt); rt=setTimeout(()=>{ try{ const P=$('panel'); if(!MOB()||S.tab!=='home'||!P.classList.contains('dk08')) return; const l=document.body.classList.contains('phone-land')?'1':'0'; if(P.dataset.dkLand!==l) renderPanel(); }catch(e){} },160); }); }
document.head.insertAdjacentHTML('beforeend',`<style>
html body.phone-app #menuov #panel.dk08 .aq07-stage > .dk08-view,html body.phone-land #menuov #panel.dk08 .aq07-stage > .dk08-view{flex:1 1 auto;min-height:0;margin:0!important;padding:0!important;border-radius:16px;overflow:hidden;display:block}
html body.phone-app #menuov #panel.dk08 .dk08-view > canvas,html body.phone-land #menuov #panel.dk08 .dk08-view > canvas{width:100%!important;height:100%!important;display:block;touch-action:pan-y}
html body.phone-app #menuov #panel.dk08 .aq07-stage,html body.phone-land #menuov #panel.dk08 .aq07-stage{position:relative}
html body.phone-app #menuov:has(#panel.dk08) .mo-tools > .mo-coin,html body.phone-land #menuov:has(#panel.dk08) .mo-tools > .mo-coin{display:none} html body.phone-app #menuov:has(#panel.dk08) [data-mo="settings"],html body.phone-land #menuov:has(#panel.dk08) [data-mo="settings"]{visibility:hidden;width:0!important;min-width:0!important;padding:0!important;margin:0!important;border:0!important;overflow:hidden}
html body.phone-land #menuov:has(#panel.dk08) .mo-in > .mo-body{grid-area:1 / 1 / 3 / 3} /* the Home page fills the top strip too (director, 2026-11-22: the hidden coins and settings left a blank band); Back stays in the rail column */
html body.phone-app #menuov #panel.dk08 .chips.mb-swrow:not([style*="display: none"]),html body.phone-land #menuov #panel.dk08 .chips.mb-swrow:not([style*="display: none"]){display:grid!important;grid-template-columns:repeat(8,max-content);gap:8px!important;justify-content:start;container-type:inline-size} html body.phone-app #menuov #panel.dk08 .chips.mb-swrow > .mb-swatch,html body.phone-land #menuov #panel.dk08 .chips.mb-swrow > .mb-swatch{--sw:32px;width:var(--sw)!important;min-width:0!important;height:var(--sw)!important;min-height:var(--sw)!important;max-height:var(--sw)!important;padding:3px!important;box-sizing:border-box!important;flex:none!important} @supports (width:1cqw){ html body.phone-app #menuov #panel.dk08 .chips.mb-swrow > .mb-swatch,html body.phone-land #menuov #panel.dk08 .chips.mb-swrow > .mb-swatch{--sw:min(32px,calc((100cqw - 56px) / 8))} } @media (max-width:760px){ html body.phone-app #menuov #panel.dk08 .chips.mb-swrow:not([style*="display: none"]),html body.phone-land #menuov #panel.dk08 .chips.mb-swrow:not([style*="display: none"]){gap:4px!important} @supports (width:1cqw){ html body.phone-app #menuov #panel.dk08 .chips.mb-swrow > .mb-swatch,html body.phone-land #menuov #panel.dk08 .chips.mb-swrow > .mb-swatch{--sw:min(32px,calc((100cqw - 28px) / 8))} } } /* small phones (iPhone SE): a tighter gap keeps the circles about 25 px, big enough to tap */ /* 16 colors = 2 rows of 8 real circles like the old canopy colors (director, 2026-11-22): width and height come from one number, so Safari can never stretch them into ovals; they shrink together only when the row is narrower than 8 full circles */
html body.phone-app #menuov #panel.dk08 .mb-swatch > .hm-sw,html body.phone-land #menuov #panel.dk08 .mb-swatch > .hm-sw{box-shadow:inset 0 0 0 1.5px rgba(255,255,255,.4)} /* a faint light ring: the darkest colors stay visible on the dark page (accessibility review, 2026-11-22) */
html body.phone-app #menuov #panel.dk08 .dk08-where,html body.phone-land #menuov #panel.dk08 .dk08-where{position:absolute;left:8px;top:8px;z-index:2;max-width:calc(100% - 16px);padding:3px 10px;border-radius:999px;background:#050e14b8;color:#eaf3fa;font:800 11px var(--display);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;pointer-events:none}
html body.phone-app #menuov #panel.dk08 .dk08-where span,html body.phone-land #menuov #panel.dk08 .dk08-where span{color:#9fb2c8;font-weight:700}
html body.phone-app #menuov #panel.dk08 .aq07-bar.dk08-ov,html body.phone-land #menuov #panel.dk08 .aq07-bar.dk08-ov{position:absolute!important;right:8px;bottom:8px;left:auto!important;top:auto!important;z-index:2;width:auto!important;min-height:0!important;margin:0!important;padding:0!important;background:none!important;border:0!important;box-shadow:none!important}
html body.phone-app #menuov #panel.dk08 .dk08-hint,html body.phone-land #menuov #panel.dk08 .dk08-hint{position:absolute;left:50%;bottom:8px;transform:translateX(-50%);margin:0;padding:3px 10px;border-radius:999px;background:#050e14b0;color:#cfe0ee;font:700 10.5px var(--display);white-space:nowrap;pointer-events:none}
</style>`);
/* ---------- the close-up is copied from the live scene right after each draw (the real home, its colours, the sky, weather and time of day) ---------- */
function DK_SCENE_OK(now){ if(S.tab!=='home'||!MOB()) return false; const c=$('homecv'); if(!c||!c.isConnected||!c.closest('.dk08-view')) return false;
  /* round 8 (director: "Home preview is very choppy and low fps"): a steady pace like the aquarium tank, every display frame on 60 Hz
     screens and exactly every other frame on 120 Hz screens (the old "at least 32 ms" rule dropped frames on timing jitter), and the
     preview is copied in the same frame the scene is drawn (it used to have its own unsynced 30-a-second timer, so many copies showed
     a frame that had not changed) */
  const S0=DK_SCENE_OK, d=now-(S0.raw||0); S0.raw=now; if(d>2&&d<60) S0.ema=(S0.ema||16.7)*.92+d*.08;
  if((S0.ema||16.7)<11||(S0.cost||0)>9){ S0.odd=!S0.odd; /* 120 Hz screen, or a phone that needs more than ~9 ms for the scene: a steady every other frame */ if(S0.odd) return false; } else S0.odd=false; S0.drew=now; S0.drewAt=performance.now(); return true; }
{ const crop=c=>hfFrame(c,(typeof MB_STATUS_B==='number'?MB_STATUS_B:40)+4); /* framed on the home, below the weather label and boost timers drawn on the water */
  const live=()=>typeof cv!=='undefined'&&cv&&cv.width>40&&W>40&&H>40;
  const _ph=paintHome; paintHome=function(){ const c=$('homecv'); if(!c||!MOB()||!c.closest('.dk08-view')||!live()) return _ph.apply(this,arguments);
    if(!paintHome.now&&performance.now()-(DK_SCENE_OK.drewAt||0)<150) return; /* the live scene copies itself right after each draw (below) */
    const r=c.getBoundingClientRect(); if(r.width<20||r.height<20) return; const k=Math.min(2,window.devicePixelRatio||1), w=Math.round(r.width*k), hh=Math.round(r.height*k);
    if(c.width!==w||c.height!==hh){ c.width=w; c.height=hh; } const b=crop(c); hfCloseup(c,b); /* drawn sharp at the close-up's own size */
    };
  { const _dr=draw; draw=function(now){ const a=performance.now(), r=_dr.apply(this,arguments); if(DK_SCENE_OK.drew===now&&now){ DK_SCENE_OK.cost=(DK_SCENE_OK.cost||6)*.85+(performance.now()-a)*.15; DK_SCENE_OK.drew=-1; paintHome.now=true; try{ paintHome(); }catch(e){} paintHome.now=false; } return r; }; } /* copy the frame just drawn */
  /* the canvas follows the view's size (sharp at any size) */
  const _fitRO=window.ResizeObserver?new ResizeObserver(()=>{ try{ if(S.tab==='home'&&MOB()) paintHome(); }catch(e){} }):null;
  homeFitWatch=()=>{ const c=$('homecv'); if(_fitRO&&c&&c.parentElement){ _fitRO.disconnect(); _fitRO.observe(c.parentElement); } }; }
