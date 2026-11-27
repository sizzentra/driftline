// =====================================================================
// PC full-HD round 4 (director, 2026-11-17, full screen 1920x1080): Cooler guide, Aquarium header, Fish Log rarity filter,
// Stats header picker, Customize rework, Challenges, Boardwalk, Oddities, Tackle shop split, header cleanup.
// Layout parts only act under body.pc-fhd (PC layout at 1800x950 and up); phones and smaller windows are untouched.
// =====================================================================
const FHD=()=>document.body.classList.contains('pc-fhd');
// every page tags the panel with its name, so full-HD styles can be scoped to one page (data-pg="skills" ...)
/* PC page steps (Clean Pages 4, batch 7): this file's and ui_round5's page touches run from the PC page engine (pages_pc.js) in the order
   they were added, instead of five renderPanel wrappers; pre steps run before the page is built (last added first, as the wrappers did) */
PC_STEPS.post.push(()=>{ try{ const P=$('panel'); if(P&&P.dataset.pg!==S.tab) P.dataset.pg=S.tab; }catch(e){ oops('pc/br_pc05:P',e); } });

// (the aquarium tank and every page animation then get the whole frame)
// (the aquarium tank and every page animation then get the whole frame; the Dock page still needs the scene: it shows it)
{ const _dr=draw; draw=function(now){ if(MENU_OPEN&&FHD()) return; return _dr.apply(this,arguments); }; }

// ---------- one tooltip in the game's own look for everything with a title in the full-HD menus and header ----------
{ const tip=document.createElement('div'); tip.id='dltip'; tip.hidden=true; document.body.appendChild(tip); let cur=null;
  const hide=()=>{ if(cur){ cur=null; tip.hidden=true; } };
  document.addEventListener('mouseover',e=>{ if(!FHD()) return; const el=e.target.closest&&e.target.closest('#menuov [title], #pchead [title], #menuov [data-tip2], #pchead [data-tip2]'); if(!el){ hide(); return; }
    if(el.title){ el.dataset.tip2=el.title; el.removeAttribute('title'); } const t=el.dataset.tip2; if(!t){ hide(); return; } if(cur===el) return; cur=el;
    tip.textContent=t; tip.hidden=false; const r=el.getBoundingClientRect(), tw=tip.offsetWidth, th=tip.offsetHeight;
    let x=Math.min(innerWidth-tw-10,Math.max(10,r.left+r.width/2-tw/2)), y=r.bottom+8; if(y+th>innerHeight-8) y=r.top-th-8; tip.style.transform=`translate(${Math.round(x/UIZ)}px,${Math.round(y/UIZ)}px)`; },{passive:true});
  document.addEventListener('mousedown',hide,true); addEventListener('scroll',hide,true); }
document.head.insertAdjacentHTML('beforeend',`<style>
#dltip{position:fixed;left:0;top:0;z-index:9999;max-width:300px;padding:9px 12px;border-radius:12px;background:#0b1626;border:1px solid #7fe3c4aa;color:#e6f2ff;font:700 12.5px/1.45 var(--display,system-ui);box-shadow:0 10px 28px #000b;pointer-events:none;white-space:normal}
body:not(.pc-fhd) #dltip{display:none}
</style>`);


// ---------- Aquarium: one compact header bar (title, a one-line note, the boosts, the earnings), the drag hint on the tank ----------
PC_STEPS.post.push(()=>{ try{ if(S.tab!=='aquarium'||!FHD()) return; const P=$('panel'), hd=P.querySelector(':scope > .dl-head'); if(!hd||P.querySelector('.aqh')) return;
      const bank=hd.querySelector('.bank'), badges=P.querySelector(':scope > .badges'), tank=P.querySelector(':scope > .tank'), hint=tank&&tank.nextElementSibling;
      const bar=document.createElement('div'); bar.className='aqh';
      bar.innerHTML=`<div class="aqh-t"><h2>Aquarium</h2><span>Visitors pay to see your fish, even while you are away. Every fish on display adds its boost.</span></div><div class="aqh-b"></div>`;
      if(badges){ badges.removeAttribute('style'); bar.querySelector('.aqh-b').appendChild(badges); }
      if(bank) bar.appendChild(bank);
      hd.replaceWith(bar);
      if(hint&&hint.tagName==='P'&&/Drag/.test(hint.textContent)){ hint.remove(); if(tank){ tank.style.position='relative'; tank.insertAdjacentHTML('beforeend','<span class="aq-drag">Drag a decoration along the sand to move it</span>'); } } }catch(e){ console.error(e); } });
document.head.insertAdjacentHTML('beforeend',`<style>
body.pc-fhd #panel .aqh{display:grid;grid-template-columns:auto minmax(0,1fr) auto;align-items:center;gap:22px;padding:12px 16px;border-radius:16px;background:#0e1a2c;border:1px solid #ffffff14}
body.pc-fhd #panel .aqh-t{display:flex;flex-direction:column;gap:2px;min-width:0;max-width:420px}
body.pc-fhd #panel .aqh-t h2{margin:0;font:800 22px var(--display,system-ui);color:#fff}
body.pc-fhd #panel .aqh-t span{font-size:12.5px;line-height:1.4;color:#9fb2c8}
body.pc-fhd #panel .aqh-b .badges{display:flex;flex-wrap:wrap;gap:6px;justify-content:center;margin:0!important}
body.pc-fhd #panel .aqh .bank{display:flex!important;align-items:center;gap:14px;margin:0!important;padding:8px 10px 8px 14px!important;border-radius:12px;background:#0a1424;border:1px solid #ffffff12;box-sizing:border-box;position:static!important}
body.pc-fhd #panel .aqh .bank > div{display:flex;flex-direction:column;line-height:1.2;white-space:nowrap}
body.pc-fhd #panel .aqh .bank .btn{margin:0!important;white-space:nowrap}
body.pc-fhd #panel .aq-drag{position:absolute;left:12px;bottom:10px;padding:4px 10px;border-radius:999px;background:#0008;color:#cfe0f2;font:700 11.5px var(--display,system-ui);pointer-events:none}
</style>`);

// ---------- Fish Log: the rarity row is a filter too (click a rarity to see only it, click it again for all) ----------
let flRar=null;
{ const _rj=renderJournal; renderJournal=function(P){ _rj(P); try{ if(!P.classList.contains('fl-on')) return; const leg=P.querySelector('.fl-mh .fl-leg'); if(!leg) return;
      if(flRar!=null&&!RAR[flRar]) flRar=null;
      leg.querySelectorAll(':scope > span').forEach(sp=>{ const rc=sp.style.getPropertyValue('--rc').trim(), i=RAR.findIndex(x=>String(x.c).toLowerCase()===rc.toLowerCase()); if(i<0) return;
        const b=document.createElement('button'); b.type='button'; b.className='fl-rb'; b.dataset.flr=i; b.setAttribute('aria-pressed',String(flRar===i)); b.style.setProperty('--rc',rc); b.innerHTML=sp.innerHTML; sp.replaceWith(b); });
      const show=P.querySelector('.fl-mh .fl-show2'); if(show){ const wrap=document.createElement('div'); wrap.className='fl-filters'; show.before(wrap); wrap.append(show,leg); show.insertAdjacentHTML('afterbegin','<span class="fl-fl">Show</span>'); leg.insertAdjacentHTML('afterbegin','<span class="fl-fl">Rarity</span>'); }
      const apply=()=>{ P.querySelectorAll('.fl-main .jcard[data-k]').forEach(c=>{ const s=SPI[c.dataset.k]; c.hidden=flRar!=null&&!!s&&s.r!==flRar; }); };
      apply(); leg.querySelectorAll('[data-flr]').forEach(b=>b.addEventListener('click',e=>{ e.stopPropagation(); const i=+b.dataset.flr; flRar=flRar===i?null:i; leg.querySelectorAll('[data-flr]').forEach(x=>x.setAttribute('aria-pressed',String(+x.dataset.flr===flRar))); apply(); })); }catch(e){ console.error(e); } }; }
document.head.insertAdjacentHTML('beforeend',`<style>
body.pch-on #panel .fl-filters{display:flex;flex-direction:column;gap:6px;margin-top:6px}
body.pch-on #panel .fl-filters > div{display:flex!important;flex-wrap:wrap;align-items:center;gap:6px;margin:0!important}
body.pch-on #panel .fl-fl{width:54px;font:800 11px var(--display,system-ui);letter-spacing:.08em;text-transform:uppercase;color:#8fa6bf}
body.pch-on #panel .fl-filters .fl-leg .fl-rb,body.pch-on #panel .fl-filters .fl-show2 .chipb{display:inline-flex!important;align-items:center;gap:6px;height:30px;padding:0 12px!important;border-radius:999px!important;border:1px solid #ffffff1c!important;background:#0e1a2c!important;color:#dbe6f2!important;font:700 12.5px var(--display,system-ui)!important;cursor:pointer;width:auto!important;box-sizing:border-box;margin:0!important}
body.pch-on #panel .fl-filters .fl-rb i{width:9px;height:9px;border-radius:50%;background:var(--rc);display:inline-block}
body.pch-on #panel .fl-filters .fl-rb b{color:#9fb2c8;font-weight:700}
body.pch-on #panel .fl-filters .fl-rb:hover,body.pch-on #panel .fl-filters .fl-show2 .chipb:hover{border-color:#7fb8ff88!important}
body.pch-on #panel .fl-filters .fl-rb[aria-pressed="true"]{background:color-mix(in srgb,var(--rc) 24%,#0e1a2c)!important;border-color:var(--rc)!important;color:#fff!important}
body.pch-on #panel .fl-filters .fl-rb[aria-pressed="true"] b{color:#fff}
body.pch-on #panel .fl-filters .fl-show2 .chipb[aria-pressed="true"]{background:#1d3150!important;border-color:#7fb8ff!important;color:#fff!important}
</style>`);

// ---------- Stats: you pick what the header's Stats button shows ----------
const HDR_STATS=[
  ['sales','Sale price',()=>'Sales ×'+sellMult().toFixed(2)],
  ['bite','Bite speed',()=>'Bites ×'+biteSpeed(false).toFixed(2)],
  ['legend','Legendary odds',()=>'Legendary '+fmtOdds(catchOdds().legend)],
  ['shiny','Shiny chance',()=>'Shiny '+(shinyChance(false)*100).toFixed(2)+'%'],
  ['caught','Fish caught',()=>fmt(S.stats.caught||0)+' caught'],
  ['earned','Coins earned',()=>fmt(S.stats.earned||0)+' earned'],
  ['played','Time played',()=>playTimeStr(S.stats.playS||0)]];
function hdrStatText(){ const k=S.settings&&S.settings.hdrStat, e=HDR_STATS.find(x=>x[0]===k)||HDR_STATS[0]; try{ return e[2](); }catch(er){ return HDR_STATS[0][2](); } }
{ const _rs=renderStats; renderStats=function(P){ _rs(P); try{ if(!P.classList.contains('st-on')) return; const cur=(S.settings&&S.settings.hdrStat)||'sales';
      const t=document.createElement('div'); t.className='st-pick';
      t.innerHTML=`<span class="st-pl">Shown on your header</span>${HDR_STATS.map(([k,n,f])=>{ let v=''; try{ v=f(); }catch(e){ oops('pc/br_pc05:f',e); } return `<button type="button" data-hs="${k}" aria-pressed="${k===cur}"><b>${n}</b><span>${esc(v)}</span></button>`; }).join('')}`;
      const all=P.querySelector('.st-all'); if(all) all.before(t);
      t.querySelectorAll('[data-hs]').forEach(b=>b.addEventListener('click',e=>{ e.stopPropagation(); S.settings.hdrStat=b.dataset.hs; save(); t.querySelectorAll('[data-hs]').forEach(x=>x.setAttribute('aria-pressed',String(x===b))); try{ const sv=document.querySelector('.st-stats .pcs-sv'); if(sv) sv.textContent=hdrStatText(); }catch(er){ oops('pc/br_pc05:document.querySelector',er); } })); }catch(e){ console.error(e); } }; }
document.head.insertAdjacentHTML('beforeend',`<style>
body.pc-fhd #panel.st-on .st-pick{display:flex;align-items:center;gap:8px;margin:0 0 14px;padding:10px 12px;border-radius:14px;background:#0e1a2c;border:1px solid #ffffff14;flex-wrap:wrap}
body.pc-fhd #panel.st-on .st-pl{font:800 12px var(--display,system-ui);letter-spacing:.07em;text-transform:uppercase;color:#ffd36a;margin-right:6px}
body.pc-fhd #panel.st-on .st-pick button{display:flex;flex-direction:column;align-items:flex-start;gap:1px;padding:6px 12px;border-radius:10px;border:1px solid #ffffff18;background:#0a1424;color:#dbe6f2;cursor:pointer;font:inherit}
body.pc-fhd #panel.st-on .st-pick button b{font:800 12px var(--display,system-ui);color:#cfe0f2}
body.pc-fhd #panel.st-on .st-pick button span{font-size:11.5px;color:#8fa6bf}
body.pc-fhd #panel.st-on .st-pick button:hover{border-color:#7fe3c4aa}
body.pc-fhd #panel.st-on .st-pick button[aria-pressed="true"]{background:linear-gradient(180deg,#197a76,#14666a);border-color:#7fe3c4}
body.pc-fhd #panel.st-on .st-pick button[aria-pressed="true"] b,body.pc-fhd #panel.st-on .st-pick button[aria-pressed="true"] span{color:#fff}
/* Skills: no unexplained counts beside the column titles (your skill points sit at the top right) */
body.pc-fhd #panel[data-pg="skills"] .fhd-h .sdot{display:none!important}
</style>`);


// =====================================================================
// Wardrobe (full HD): the categories are a fixed rail on the left (the header never changes size), your angler stands big in
// the middle, and the options sit on the right in tidy cards that scroll on their own. Things still to find are one short
// strip at the end of their card instead of a wall of "???".
// =====================================================================
{ const _rs=renderStyle; renderStyle=function(P){ _rs(P); try{ if(!FHD()) return; const wrap=P.querySelector('.stylewrap.wd'), main=P.querySelector('.wd-main'), prev=P.querySelector('.wd-prev'), nav=main&&main.querySelector('.wd-nav'); if(!wrap||!main||!nav) return;
      const h2=P.querySelector(':scope > h2'); if(h2) h2.hidden=true;
      const opts=document.createElement('div'); opts.className='wdx-opts';
      let card=null; const kids=[...main.children].filter(c=>c!==nav);
      for(const c of kids){ if(c.tagName==='H5'){ card=document.createElement('section'); card.className='wdx-card'; opts.appendChild(card); card.appendChild(c); continue; }
        if(c.classList.contains('wd-locked')&&card){ card.appendChild(c); continue; }
        if(!card){ card=document.createElement('section'); card.className='wdx-card'; opts.appendChild(card); } card.appendChild(c); }
      nav.classList.add('wdx-rail'); const rail=document.createElement('aside'); rail.className='wdx-side'; rail.innerHTML='<h5>Wardrobe</h5>'; rail.appendChild(nav);
      const x=document.createElement('div'); x.className='wdx'; x.append(rail,prev,opts); wrap.replaceWith(x); P.classList.add('wdx-on'); }catch(e){ console.error(e); } }; }
PC_STEPS.pre.push(()=>{ const P=$('panel'); if(P) P.classList.remove('wdx-on'); });
document.head.insertAdjacentHTML('beforeend',`<style>
html body.pc-fhd #menuov #panel.wdx-on{display:flex!important;flex-direction:column!important;overflow:hidden!important}
html body.pc-fhd #menuov #panel.wdx-on > .wdx{flex:1 1 0;min-height:0}
body.pc-fhd #panel .wdx{display:grid;grid-template-columns:210px 520px minmax(0,1fr);gap:14px;min-height:0}
body.pc-fhd #panel .wdx > *{min-height:0}
body.pc-fhd #panel .wdx-side{display:flex;flex-direction:column;gap:6px;padding:12px;border-radius:16px;background:#0e1a2c;border:1px solid #ffffff14}
body.pc-fhd #panel .wdx-side h5{margin:2px 4px 6px!important;font:800 11.5px var(--display,system-ui)!important;letter-spacing:.08em;text-transform:uppercase;color:#8fa6bf!important}
body.pc-fhd #panel .wdx-rail{display:flex!important;flex-direction:column!important;gap:4px!important;grid-template-columns:none!important;margin:0!important;position:static!important;background:none!important;padding:0!important;border:0!important;box-shadow:none!important}
body.pc-fhd #panel .wdx-rail button{display:flex!important;flex-direction:row!important;align-items:center!important;justify-content:flex-start!important;gap:10px!important;height:44px!important;padding:0 12px!important;border-radius:10px!important;border:1px solid transparent!important;background:#ffffff06!important;color:#dbe6f2!important;font:700 14px var(--display,system-ui)!important;width:100%!important;flex:0 0 auto!important;min-height:0!important}
body.pc-fhd #panel .wdx-rail button .wi{font-size:18px!important}
body.pc-fhd #panel .wdx-rail button .wl{font-size:14px!important}
body.pc-fhd #panel .wdx-rail button:hover{background:#ffffff10!important}
body.pc-fhd #panel .wdx-rail button[aria-selected="true"]{background:#1d3150!important;border-color:#7fb8ff66!important;color:#fff!important;box-shadow:inset 3px 0 0 #7fb8ff!important}
body.pc-fhd #panel .wdx .wd-prev{position:relative!important;top:0!important;display:flex;flex-direction:column;gap:8px;padding:12px;border-radius:16px;background:radial-gradient(circle at 50% 40%,#1d2f4c,#0b1424);border:1px solid #ffffff14;margin:0!important;max-width:none!important}
body.pc-fhd #panel .wdx .wd-prev canvas{flex:1 1 0;min-height:0;width:100%!important;height:100%!important;object-fit:contain}
body.pc-fhd #panel .wdx-opts{overflow:auto;scrollbar-width:thin;display:flex;flex-direction:column;gap:12px;padding-right:4px}
body.pc-fhd #panel .wdx-card{padding:14px 16px;border-radius:16px;background:#0e1a2c;border:1px solid #ffffff14;display:flex;flex-direction:column;gap:8px}
body.pc-fhd #panel .wdx-card > h5{margin:0!important;font:800 12px var(--display,system-ui)!important;letter-spacing:.08em;text-transform:uppercase;color:#ffd36a!important}
body.pc-fhd #panel .wdx-card .chips{margin:0!important;gap:6px!important}
body.pc-fhd #panel .wdx-card .chipb{height:34px;padding:0 14px!important;border-radius:10px!important}
body.pc-fhd #panel .wdx-card .sw{width:34px!important;height:34px!important;border-radius:10px!important}
body.pc-fhd #panel .wdx-card .hatgrid,body.pc-fhd #panel .wdx-card .wd-thumbs{display:grid!important;grid-template-columns:repeat(auto-fill,minmax(112px,1fr))!important;gap:8px!important}
body.pc-fhd #panel .wdx-card .hatb,body.pc-fhd #panel .wdx-card .wd-th{border-radius:12px!important;padding:8px!important;min-height:0!important}
body.pc-fhd #panel .wdx-card .wd-locked{display:flex;flex-direction:column;gap:6px;padding-top:8px;border-top:1px dashed #ffffff18}
body.pc-fhd #panel .wdx-card .wd-locked .wd-thumbs{grid-template-columns:repeat(auto-fill,minmax(96px,1fr))!important}
body.pc-fhd #panel .wdx-card .wd-locked .wd-th{opacity:.7}
body.pc-fhd #panel .wdx-card .wd-locked .wd-th canvas{width:44px!important;height:44px!important}
body.pc-fhd #panel .wdx-card .wd-locked .wd-th small{font-size:10.5px;line-height:1.3;color:#8ea4b9}
body.pc-fhd #panel .wdx-card .wd-items{grid-template-columns:repeat(auto-fill,minmax(180px,1fr))!important}
</style>`);


// PC Reborn (2026-11-21): the sections, the Bait page and the Tackle name are shared with the phones (bm_ui04.js, cw_pages08.js); the
// old PC-only layout (Fishing: Travel + Bait, Equipment, Boardwalk as its own header button, the PC Bait page) was removed.


// PC Reborn (2026-11-21): Events, Tide Pass and Boardwalk use the shared page engine (strip, tabs, one body) like the phones; their
// PC-only full-HD layouts (Events on one screen, the forecast on Travel, the pass with weekly goals, the Boardwalk banner) were removed.

// ---------- the header: every category button in the same teal "you can click me" style as Cooler / Aquarium / Fish Log / Stats ----------
document.head.insertAdjacentHTML('beforeend',`<style>
html body.pc-fhd #pchead #catdock{gap:6px!important;background:none!important;border:0!important;box-shadow:none!important;padding:0!important}
html body.pc-fhd #pchead #catdock .cdb{flex-direction:row!important;gap:8px!important;height:42px!important;min-width:0!important;padding:0 16px!important;border-radius:12px!important;background:linear-gradient(180deg,#197a76,#14666a)!important;border:1px solid #7fe3c4!important;color:#fff!important;box-shadow:inset 0 1px 0 #ffffff33,0 3px 0 #0b3a3a,0 4px 10px #0008!important}
html body.pc-fhd #pchead #catdock .cdb .cdl{font:800 14px var(--display,system-ui)!important;color:#fff!important}
html body.pc-fhd #pchead #catdock .cdb svg{color:#e6fff6!important}
html body.pc-fhd #pchead #catdock .cdb:hover{background:linear-gradient(180deg,#26a39e,#187a7e)!important;box-shadow:inset 0 1px 0 #ffffff40,0 3px 0 #0b3a3a,0 0 0 3px #7fe3c433,0 4px 12px #000a!important}
html body.pc-fhd #pchead #catdock .cdb.on{background:linear-gradient(180deg,#ffe08a,#f3b94e)!important;border-color:#ffe6a3!important;box-shadow:inset 0 1px 0 #fff6,0 2px 0 #8a5b12,0 0 0 3px #ffd36a44!important}
html body.pc-fhd #pchead #catdock .cdb.on .cdl,html body.pc-fhd #pchead #catdock .cdb.on svg{color:#2a1c05!important}
html body.pc-fhd #pchead #catdock .cdb .cddot{top:-2px!important;right:-6px!important} /* the frame (.wrap, overflow hidden) starts 2 px above the header: -6 cut the circle (director, 2026-11-19) */
</style>`);
document.head.insertAdjacentHTML('beforeend',`<style>
html body.pc-fhd #pchead{grid-template-columns:auto minmax(0,1fr) auto!important;column-gap:16px!important}
html body.pc-fhd #pchead .pch-cats{width:100%!important;justify-self:stretch!important;min-width:0}
html body.pc-fhd #pchead .pch-cats #catdock{width:100%!important;position:static!important;transform:none!important}
html body.pc-fhd #pchead #catdock .cdb{padding:0 14px!important}
</style>`);
document.head.insertAdjacentHTML('beforeend',`<style>
html body.pch-on.pc-fhd.dl-fish #pchead{grid-template-columns:190px minmax(0,1fr) auto!important} /* PC Reborn: the sections fill the space between your coins and the header chips */
html body.pch-on.pc-fhd #pchead #catdock{grid-template-columns:none!important;grid-auto-flow:column!important;grid-auto-columns:minmax(0,1fr)!important;width:100%!important;gap:6px!important;container-type:inline-size}
html body.pch-on.pc-fhd #pchead #catdock .cdb{flex-direction:column!important;gap:1px!important;padding:2px 4px!important} /* icon over its name: all 7 names fit (PC Reborn) */
html body.pch-on.pc-fhd #pchead #catdock .cdb svg{width:19px;height:19px}
html body.pch-on.pc-fhd #pchead #catdock .cdb .cdl{font-size:13px;line-height:1.1}
@container (max-width:560px){ html body.pch-on #pchead #catdock .cdb .cdl{display:none} }
@media (max-width:1580px){ html body.pch-on.dl-fish #pchead{grid-template-columns:auto minmax(0,1fr) auto!important} html body.pch-on #pchead .pch-cats,html body.pch-on #pchead .pch-cats #catdock{width:100%!important;min-width:0} html body.pch-on #pchead #catdock{grid-template-columns:none!important;grid-auto-flow:column!important;grid-auto-columns:minmax(0,1fr)!important;container-type:inline-size} html body.pch-on #pchead{column-gap:8px!important} html body.pch-on #pchead .pch-stats{gap:4px!important} html body.pch-on #pchead .pch-stats > .stat{padding:4px 7px!important} html body.pch-on #pchead .pch-tools{gap:4px!important} } /* 1440 wide: the two new chips fit too */
</style>`);


// PC Reborn (2026-11-21): Oddities and Bounties use the shared pages with their tabs (cw_pages08.js, pages_pc.js), like the phones.
