// =====================================================================
// PC full-HD round 4 (director, 2026-11-17, full screen 1920x1080): Cooler guide, Aquarium header, Fish Log rarity filter,
// Stats header picker, Customize rework, Challenges, Boardwalk, Oddities, Tackle shop split, header cleanup.
// Layout parts only act under body.pc-fhd (PC layout at 1800x950 and up); phones and smaller windows are untouched.
// =====================================================================
const FHD=()=>document.body.classList.contains('pc-fhd');
// every page tags the panel with its name, so full-HD styles can be scoped to one page (data-pg="skills" ...)
{ const _rp=renderPanel; renderPanel=function(){ const r=_rp.apply(this,arguments); try{ const P=$('panel'); if(P&&P.dataset.pg!==S.tab) P.dataset.pg=S.tab; }catch(e){} return r; }; }

// ---------- smooth menus: the fishing scene is hidden behind a full-HD menu, so it is not drawn while one is open ----------
// (the aquarium tank and every page animation then get the whole frame; the Dock page still needs the scene: it shows it)
{ const _dr=draw; draw=function(now){ if(MENU_OPEN&&FHD()&&S.tab!=='home') return; return _dr.apply(this,arguments); }; }

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

// ---------- Cooler: a short guide instead of tooltips; the Sell all fields line up ----------
{ const _rp=renderPanel; renderPanel=function(){ const r=_rp.apply(this,arguments); try{ if(S.tab!=='cooler'||!FHD()) return r; const P=$('panel'), side=P.querySelector('.fc-side'); if(!side) return r;
      P.querySelectorAll('.fhd-cool .fishrow [title], .fc-side [title]').forEach(e=>e.removeAttribute('title'));
      if(!side.querySelector('.fc-help')){ const h=document.createElement('div'); h.className='fc-help';
        h.innerHTML=`<div><b>🏛️ Keep</b><span>Mounts the fish in the Trophy Room for good. No income, but it is never lost on a new voyage.</span></div><div><b>🐠 To aquarium</b><span>Puts it on display: it earns coins every hour, even while you are away, and gives its boost.</span></div><div><b>🪙 Sell</b><span>Coins right now. Sell all sells everything that matches the choices below.</span></div>`;
        const cap=side.querySelector('.fc-cap'); if(cap) cap.after(h); else side.prepend(h); } }catch(e){ console.error(e); } return r; }; }
document.head.insertAdjacentHTML('beforeend',`<style>
body.pc-fhd #panel .fc-help{display:grid;gap:8px;padding:12px 14px;border-radius:14px;background:#0a1424;border:1px solid #ffffff10}
body.pc-fhd #panel .fc-help > div{display:grid;grid-template-columns:118px minmax(0,1fr);gap:10px;align-items:baseline;font-size:12.5px;line-height:1.45}
body.pc-fhd #panel .fc-help b{font:800 13px var(--display,system-ui);color:#fff;white-space:nowrap}
body.pc-fhd #panel .fc-help span{color:#a9bccf}
body.pc-fhd #panel .fc-side .sellf .fld{grid-template-columns:118px minmax(0,1fr)!important;width:100%!important;align-self:stretch!important;box-sizing:border-box}
body.pc-fhd #panel .fc-side .sellf .fld > :not(.fld-l){justify-self:stretch!important;max-width:100%!important;min-width:0!important}
body.pc-fhd #panel .fhd-cool{grid-template-columns:minmax(0,1fr) 440px!important}
body.pc-fhd #panel .fc-side .sellf .fld-l{justify-self:start!important;text-align:left!important;font:800 12px var(--display,system-ui)!important;letter-spacing:.06em;text-transform:uppercase;color:#8fa6bf!important;margin:0!important}
body.pc-fhd #panel .fc-side .sellf select,body.pc-fhd #panel .fc-side .sellf .sellp,body.pc-fhd #panel .fc-side .sellf .sellp input,body.pc-fhd #panel .fc-side .sellf .sellsh{width:100%!important;height:38px!important;box-sizing:border-box!important;margin:0!important}
body.pc-fhd #panel .fc-side .sellf .sellp{display:block!important}
body.pc-fhd #panel .fc-side .sellf .sellsh{display:flex!important;align-items:center;justify-content:flex-start!important;gap:8px;padding:0 12px!important;border-radius:10px!important}
</style>`);

// ---------- Aquarium: one compact header bar (title, a one-line note, the boosts, the earnings), the drag hint on the tank ----------
{ const _rp=renderPanel; renderPanel=function(){ const r=_rp.apply(this,arguments); try{ if(S.tab!=='aquarium'||!FHD()) return r; const P=$('panel'), hd=P.querySelector(':scope > .dl-head'); if(!hd||P.querySelector('.aqh')) return r;
      const bank=hd.querySelector('.bank'), badges=P.querySelector(':scope > .badges'), tank=P.querySelector(':scope > .tank'), hint=tank&&tank.nextElementSibling;
      const bar=document.createElement('div'); bar.className='aqh';
      bar.innerHTML=`<div class="aqh-t"><h2>Aquarium</h2><span>Visitors pay to see your fish, even while you are away. Every fish on display adds its boost.</span></div><div class="aqh-b"></div>`;
      if(badges){ badges.removeAttribute('style'); bar.querySelector('.aqh-b').appendChild(badges); }
      if(bank) bar.appendChild(bank);
      hd.replaceWith(bar);
      if(hint&&hint.tagName==='P'&&/Drag/.test(hint.textContent)){ hint.remove(); if(tank){ tank.style.position='relative'; tank.insertAdjacentHTML('beforeend','<span class="aq-drag">Drag a decoration along the sand to move it</span>'); } } }catch(e){ console.error(e); } return r; }; }
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
      t.innerHTML=`<span class="st-pl">Shown on your header</span>${HDR_STATS.map(([k,n,f])=>{ let v=''; try{ v=f(); }catch(e){} return `<button type="button" data-hs="${k}" aria-pressed="${k===cur}"><b>${n}</b><span>${esc(v)}</span></button>`; }).join('')}`;
      const all=P.querySelector('.st-all'); if(all) all.before(t);
      t.querySelectorAll('[data-hs]').forEach(b=>b.addEventListener('click',e=>{ e.stopPropagation(); S.settings.hdrStat=b.dataset.hs; save(); t.querySelectorAll('[data-hs]').forEach(x=>x.setAttribute('aria-pressed',String(x===b))); try{ const sv=document.querySelector('.st-stats .pcs-sv'); if(sv) sv.textContent=hdrStatText(); }catch(er){} })); }catch(e){ console.error(e); } }; }
document.head.insertAdjacentHTML('beforeend',`<style>
body.pc-fhd #panel.st-on .st-pick{display:flex;align-items:center;gap:8px;margin:0 0 14px;padding:10px 12px;border-radius:14px;background:#0e1a2c;border:1px solid #ffffff14;flex-wrap:wrap}
body.pc-fhd #panel.st-on .st-pl{font:800 12px var(--display,system-ui);letter-spacing:.07em;text-transform:uppercase;color:#ffd36a;margin-right:6px}
body.pc-fhd #panel.st-on .st-pick button{display:flex;flex-direction:column;align-items:flex-start;gap:1px;padding:6px 12px;border-radius:10px;border:1px solid #ffffff18;background:#0a1424;color:#dbe6f2;cursor:pointer;font:inherit}
body.pc-fhd #panel.st-on .st-pick button b{font:800 12px var(--display,system-ui);color:#cfe0f2}
body.pc-fhd #panel.st-on .st-pick button span{font-size:11.5px;color:#8fa6bf}
body.pc-fhd #panel.st-on .st-pick button:hover{border-color:#7fe3c4aa}
body.pc-fhd #panel.st-on .st-pick button[aria-pressed="true"]{background:linear-gradient(180deg,#1f8a86,#14666a);border-color:#7fe3c4}
body.pc-fhd #panel.st-on .st-pick button[aria-pressed="true"] b,body.pc-fhd #panel.st-on .st-pick button[aria-pressed="true"] span{color:#fff}
/* Skills: no unexplained counts beside the column titles (your skill points sit at the top right) */
body.pc-fhd #panel[data-pg="skills"] .fhd-h .sdot{display:none!important}
</style>`);

// =====================================================================
// Dock (full HD): the preview IS your spot at this water, drawn by the game itself (the dock, pier, ice ledge, beach, boat,
// trawler, raft, stone or crystal platform this water really has, its sky, weather and time of day, with your decorations and
// pets exactly where they stand while you fish). Below it, like the aquarium: "Your dock" (wood, style) and "Decorations"
// side by side, each scrolling on its own; the cozy level sits with the decorations that make it. Your other docks sit
// beside the preview.
// =====================================================================
const DK_CROP=()=>{ const c=$('homecv'); if(!c) return null; if(HOMEF[S.loc]) return hfFrame(c,0); /* format homes: framed on the home */ const sw=Math.min(W,W*.62), sh=sw*c.height/c.width, dy=H*.6, L=LOCS[locIdx(S.loc)], f=(L&&(L.plat==='boat'||L.plat==='trawler'||L.plat==='raft'))?.55:.64; /* boats sit lower: their hull shows too */ return {sx:0, sy:Math.max(0,Math.min(H-sh,dy-sh*f)), sw, sh}; };
{ const _ph=paintHome; paintHome=function(){ const c=$('homecv'); if(!c||!FHD()||!MENU_OPEN||!c.closest('.dk-top')) return _ph.apply(this,arguments);
    const r=c.getBoundingClientRect(), w=Math.round(r.width*(devicePixelRatio||1)), h=Math.round(r.height*(devicePixelRatio||1)); if(w<20||h<20) return;
    if(c.width!==w||c.height!==h){ c.width=w; c.height=h; }
    const k=DK_CROP(); if(HOMEF[S.loc]&&hfCloseup(c,k)) return; /* format homes: drawn sharp at the close-up's own size */ const d=cv.width/W, x=c.getContext('2d'); x.imageSmoothingEnabled=true; x.imageSmoothingQuality='low'; /* 'high' cost ~6 ms per refresh (laggy); 'low' ~0.3 ms and looks the same at this scale */
    x.drawImage(cv,k.sx*d,k.sy*d,k.sw*d,k.sh*d,0,0,w,h); };
  // drag decorations and pets along the real dock (positions are the same fractions the game uses)
  document.addEventListener('pointerdown',e=>{ const c=e.target; if(!c||c.id!=='homecv'||!FHD()||!c.closest('.dk-top')||HOMEF[S.loc]) return; /* format homes: nothing to drag */ e.stopImmediatePropagation(); e.preventDefault();
    const k=DK_CROP(), r=c.getBoundingClientRect(), gx=ev=>k.sx+(ev.clientX-r.left)/r.width*k.sw, X0=W*.008, SPAN=W*.17, frac=v=>clamp((v-X0)/SPAN,0,1);
    const sc=clamp(H/420,.7,1.25), ax=W*.12, items=dockView(), P=dockPositions(items,(ax-40*sc-X0)/(W*.178-X0),(ax+12*sc-X0)/(W*.178-X0));
    const x0=gx(e); let best=null, bd=W*.012;
    for(const id in P){ const d=Math.abs(X0+P[id]*SPAN-x0); if(d<bd){ bd=d; best=id; } }
    for(const wh of ['1','2']){ if(wh==='1'&&!S.pet) continue; if(wh==='2'&&!(S.pet2&&PETI[S.pet2])) continue; const pos=S.dock[wh==='2'?'pet2Pos':'petPos']; if(pos==null) continue; const d=Math.abs(scenePetX(pos)-x0); if(d<bd){ bd=d; best='pet'+wh; } }
    if(!best) return; c.setPointerCapture(e.pointerId); c.style.cursor='grabbing';
    const mv=ev=>{ const v=frac(gx(ev)); if(best==='pet1') S.dock.petPos=v; else if(best==='pet2') S.dock.pet2Pos=v; else S.dock.pos[best]=v; };
    const up=()=>{ c.removeEventListener('pointermove',mv); c.removeEventListener('pointerup',up); c.removeEventListener('pointercancel',up); c.style.cursor='grab'; save(); };
    c.addEventListener('pointermove',mv); c.addEventListener('pointerup',up); c.addEventListener('pointercancel',up); },true);
  const _rp=renderPanel; renderPanel=function(){ const r=_rp.apply(this,arguments); try{ if(S.tab!=='home'||!FHD()) return r; const P=$('panel'); if(P.querySelector('.dk-top')) return r;
      /* a home in the home format (docs/HOME_STANDARD.md): the close-up of the home on top, its 5 elements as tabs underneath */
      if(P.querySelector(':scope > .hf-mark')){ const sp=hfSpec(S.loc), L=LOCS[locIdx(S.loc)], c=P.querySelector('#homecv'), tile=c&&c.closest('.tile'), nav=P.querySelector(':scope > .sect-nav'); if(!tile||!nav) return r;
        const top=document.createElement('div'); top.className='dk-top'; const view=document.createElement('div'); view.className='dk-view'; c.style.cssText=''; view.appendChild(c);
        view.insertAdjacentHTML('beforeend',`<span class="dk-where">${esc(L.name)} · ${esc(sp.name)}</span>`);
        const side=document.createElement('aside'); side.className='dk-side'; side.innerHTML=`<h3>Your ${esc(sp.hname)}</h3><p class="meta">${sp.els.length} parts to make it yours, a style and a color each, and all of it free. Every water keeps its own home.</p>`;
        top.append(view,side);
        const col=document.createElement('section'); col.className='dk-col'; col.innerHTML=`<header class="fhd-h"><span>Parts of your ${esc(sp.hname)}</span></header><div class="dk-body"></div>`; const body=col.querySelector('.dk-body'); body.appendChild(nav);
        P.querySelectorAll(':scope > [data-hel]').forEach(el=>body.appendChild(el));
        const split=document.createElement('div'); split.className='dk-split dk-hf'; split.appendChild(col);
        [...P.children].forEach(ch=>{ if(!ch.classList.contains('crumb')&&!ch.classList.contains('hf-mark')) ch.remove(); });
        P.prepend(top); top.after(split); P.classList.add('dk-on','dk-hfp'); requestAnimationFrame(()=>{ try{ paintHome(); }catch(e){} }); return r; }
      const tile=P.querySelector('#homecv')&&P.querySelector('#homecv').closest('.tile'), bar=P.querySelector(':scope > .dockbar'), cozy=P.querySelector('.dl-head .tile'), h5=[...P.querySelectorAll(':scope > h5')];
      if(!tile||h5.length<3) return r;
      const L=LOCS[locIdx(S.loc)], plat={dock:'a dock',pier:'a long pier',ice:'an ice ledge',sand:'a beach',boat:'a boat',trawler:'a trawler',raft:'a raft',stone:'a stone ledge',crystal:'a crystal shelf'}[L.plat]||'a dock';
      const top=document.createElement('div'); top.className='dk-top';
      const view=document.createElement('div'); view.className='dk-view'; const c=tile.querySelector('#homecv'); c.style.cssText=''; view.appendChild(c);
      view.insertAdjacentHTML('beforeend',`<span class="dk-where">${esc(L.name)} · you fish from ${plat}</span><span class="dk-drag">Drag decorations and pets to move them</span>`);
      const side=document.createElement('aside'); side.className='dk-side'; side.innerHTML='<h3>Your homes</h3><p class="meta">Every water has its own home: a dock, a pier, a boat, an ice camp and more. You are editing this one; pick another water to copy its decorations here, or travel there.</p>';
      if(bar){ const list=bar.querySelector('.dock-h'); if(list){ const sp=list.querySelector(':scope > .meta'); if(sp) sp.remove(); list.classList.add('dk-list'); side.appendChild(list); } const pk=bar.querySelector('.dock-pick'); if(pk){ if(!S.dockPickShow&&!pk.querySelector('button')) pk.remove(); else side.appendChild(pk); } bar.remove(); }
      top.append(view,side);
      const col=(title,extra)=>{ const s=document.createElement('section'); s.className='dk-col'; s.innerHTML=`<header class="fhd-h"><span>${title}</span>${extra||''}</header><div class="dk-body"></div>`; return s; };
      const cz=cozy?cozy.textContent:''; const czLvl=(cozy&&cozy.querySelector('.rar'))?cozy.querySelector('.rar').textContent.replace(/^Cozy level:\s*/,''):''; const czN=cozy&&cozy.querySelector('b')?cozy.querySelector('b').textContent:''; const czFx=cozy&&cozy.querySelector('.meta')?cozy.querySelector('.meta').textContent.replace(/^·\s*/,''):''; const czW=cozy&&cozy.querySelector('.prog i')?cozy.querySelector('.prog i').style.width:'0%';
      // Your home: only what works at this water (director, 2026-11-18): wood where the home has wood, the dock's shape only
      // at a dock, the hull paint on boats, and the home's own light everywhere
      const feats=HOME_FEATURES[L.plat]||['light'], hname=HOME_NAMES[L.plat]||'home';
      const left=col('Your '+hname), right=col(h5[2].textContent.replace(/\s+/g,' ').trim());
      const lb=left.querySelector('.dk-body'), rb=right.querySelector('.dk-body');
      const sec=(h,cls)=>{ const box=document.createElement('div'); box.className='dk-sec '+cls; const n=h.nextElementSibling; h.style.display=''; box.appendChild(h); return {box,n}; };
      { const s1=sec(h5[0],'dk-woods'); if(s1.n&&s1.n.classList.contains('chips')){ s1.n.style.display=''; s1.box.appendChild(s1.n); } if(feats.includes('wood')) lb.appendChild(s1.box); else if(s1.n) s1.n.remove(); }
      { const s2=sec(h5[1],'dk-styles'); if(s2.n&&s2.n.classList.contains('chips')){ s2.n.style.display=''; s2.box.appendChild(s2.n); } if(feats.includes('style')) lb.appendChild(s2.box); else if(s2.n) s2.n.remove(); }
      if(feats.includes('hull')){ const cur=(S.dock&&S.dock.hull)||''; lb.insertAdjacentHTML('beforeend',`<div class="dk-sec dk-hulls"><h5>${esc(homePaintName(L.plat))}</h5><div class="chips">${HOME_HULLS.map(([id,n,c])=>`<button type="button" class="chipb" data-home="hull:${id}" aria-pressed="${cur===id}"><span class="hm-sw" style="background:${c||'linear-gradient(135deg,#f2eee2,#9a2e24)'}"></span>${esc(n)}</button>`).join('')}</div></div>`); }
      { const cur=(S.dock&&S.dock.light)||''; lb.insertAdjacentHTML('beforeend',`<div class="dk-sec dk-lights"><h5>Light</h5><div class="chips">${HOME_LIGHTS.map(([id,n,rgb])=>`<button type="button" class="chipb" data-home="light:${id}" aria-pressed="${cur===id}"><span class="hm-sw hm-glow" style="background:${rgb?'radial-gradient(circle,rgb('+rgb+') 0%,rgba('+rgb+',.35) 55%,transparent 72%)':'radial-gradient(circle,#ffd690 0%,#ffb85a55 55%,transparent 72%)'}"></span>${esc(n)}</button>`).join('')}</div></div>`); }
      lb.insertAdjacentHTML('beforeend',`<p class="dk-note">${feats.includes('style')?'The wood colors your dock; the style shapes it. ':feats.includes('wood')?'The wood colors the wooden parts of your '+esc(hname)+'. ':''}${feats.includes('hull')?esc(homePaintLine(L.plat,hname)):''}The light recolors the ${L.plat==='crystal'?'glow':L.plat==='sand'?'torch':'lamp'} of your ${esc(hname)}. Free to change.</p>`);
      // decorations: the cozy level and the sort and filter controls stay pinned above the list, which scrolls under them
      const tools=P.querySelector(':scope > .shoptools'), grid=P.querySelector(':scope > .grid'); h5[2].remove();
      const pin=document.createElement('div'); pin.className='dk-pin'; pin.innerHTML=`<span class="dk-cozy"><b>${esc(czN)}</b><span>${esc(czLvl)}</span><i><b style="width:${czW}"></b></i>${czFx?`<em>${esc(czFx)}</em>`:''}</span>`; if(tools) pin.appendChild(tools);
      right.insertBefore(pin,rb); if(grid){ grid.classList.add('dk-grid'); rb.appendChild(grid); }
      const split=document.createElement('div'); split.className='dk-split'; split.append(left,right);
      [...P.children].forEach(ch=>{ if(ch.classList.contains('crumb')||ch.classList.contains('dl-head')||ch.classList.contains('sect-nav')||(ch.tagName==='P'&&/Drag/.test(ch.textContent))) ch.remove(); });
      tile.remove(); P.prepend(top); top.after(split); P.classList.add('dk-on');
      requestAnimationFrame(()=>{ try{ paintHome(); }catch(e){} }); }catch(e){ console.error(e); } return r; };
  const _rp2=renderPanel; renderPanel=function(){ const P=$('panel'); if(P) P.classList.remove('dk-on','dk-hfp'); return _rp2.apply(this,arguments); }; }
document.head.insertAdjacentHTML('beforeend',`<style>
html body.pc-fhd #menuov #panel.dk-on{display:flex!important;flex-direction:column!important;overflow:hidden!important;gap:14px}
html body.pc-fhd #menuov #panel.dk-on > *{flex:0 0 auto}
html body.pc-fhd #menuov #panel.dk-on > .dk-split{flex:1 1 0;min-height:0}
body.pc-fhd #panel .dk-top{display:grid;grid-template-columns:minmax(0,1fr) 380px;gap:14px;height:calc(40*var(--uvh,1vh));min-height:300px}
body.pc-fhd #panel .dk-view{position:relative;border-radius:16px;overflow:hidden;border:1px solid #ffffff18;background:#08111e}
html body.pc-fhd #menuov #panel .dk-view #homecv{position:absolute;inset:0;width:100%!important;height:100%!important;max-width:none!important;max-height:none!important;margin:0!important;aspect-ratio:auto!important;cursor:grab;touch-action:none;display:block}
body.pc-fhd #panel .dk-where{position:absolute;left:12px;top:10px;padding:5px 12px;border-radius:999px;background:#0009;color:#fff;font:800 12.5px var(--display,system-ui);pointer-events:none}
body.pc-fhd #panel .dk-drag{position:absolute;left:12px;bottom:10px;padding:4px 10px;border-radius:999px;background:#0008;color:#cfe0f2;font:700 11.5px var(--display,system-ui);pointer-events:none}
body.pc-fhd #panel .dk-side{display:flex;flex-direction:column;gap:8px;padding:14px;border-radius:16px;background:#0e1a2c;border:1px solid #ffffff14;min-height:0;overflow:auto;scrollbar-width:thin}
body.pc-fhd #panel .dk-side h3{margin:0;font:800 18px var(--display,system-ui);color:#fff}
body.pc-fhd #panel .dk-side > .meta{margin:0 0 4px;font-size:12px;line-height:1.45}
body.pc-fhd #panel .dk-list{display:flex!important;flex-direction:column!important;gap:4px!important;margin:0!important;overflow:visible!important}
body.pc-fhd #panel .dk-list .dock-c{display:flex!important;justify-content:space-between;align-items:center;width:100%!important;padding:8px 12px!important;border-radius:10px!important;border:1px solid transparent!important;background:#ffffff06!important;color:#dbe6f2!important;font:700 13px var(--display,system-ui)!important;min-height:0!important}
body.pc-fhd #panel .dk-list .dock-c span{font-size:12px;color:#9fb2c8}
body.pc-fhd #panel .dk-list .dock-c:hover{background:#ffffff10!important}
body.pc-fhd #panel .dk-list .dock-c.here{background:#1d3150!important;border-color:#7fb8ff66!important;box-shadow:inset 3px 0 0 #7fb8ff}
body.pc-fhd #panel .dk-list .dock-c.here span{color:#7fe3c4}
body.pc-fhd #panel .dk-side .dock-pick{display:flex;flex-direction:column;gap:8px;margin:4px 0 0!important;padding:10px;border-radius:12px;background:#0a1424}
body.pc-fhd #panel .dk-split{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1.6fr);gap:14px;min-height:0}
body.pc-fhd #panel .dk-split.dk-hf{grid-template-columns:minmax(0,1fr)}
body.pc-fhd #panel.dk-hfp .dk-top{height:calc(56*var(--uvh,1vh))}
body.pc-fhd #panel .dk-col{display:flex;flex-direction:column;min-height:0;border-radius:16px;background:#0e1a2c;border:1px solid #ffffff14;overflow:hidden}
body.pc-fhd #panel .dk-col > .fhd-h{display:flex;align-items:center;gap:14px;padding:12px 16px;margin:0!important;border-bottom:1px solid #ffffff10;font:800 15px var(--display,system-ui);color:#fff}
body.pc-fhd #panel .dk-body{flex:1 1 0;min-height:0;overflow:auto;padding:14px 16px;scrollbar-width:thin;display:flex;flex-direction:column;gap:14px}
body.pc-fhd #panel .dk-cozy{margin-left:auto;display:flex;align-items:center;gap:8px;font-size:12.5px;color:#ffb3cf}
body.pc-fhd #panel .dk-cozy > b{font:800 15px var(--display,system-ui);color:#ff9ac0}
body.pc-fhd #panel .dk-cozy i{display:block;width:110px;height:6px;border-radius:6px;background:#ffffff14;overflow:hidden}
body.pc-fhd #panel .dk-cozy i b{display:block;height:100%;background:linear-gradient(90deg,#ff9ac0,#ffd36a)}
body.pc-fhd #panel .dk-czfx{margin:0;font-size:12.5px;color:#cfb3c2}
body.pc-fhd #panel .dk-note{margin:0;font-size:12px;line-height:1.45;color:#8ea4b9}
body.pc-fhd #panel .dk-sec h5{margin:0 0 8px!important;font:800 11.5px var(--display,system-ui)!important;letter-spacing:.08em;text-transform:uppercase;color:#8fa6bf!important}
body.pc-fhd #panel .dk-sec .chips{display:grid!important;grid-template-columns:repeat(auto-fill,minmax(120px,1fr));gap:8px!important;margin:0!important}
body.pc-fhd #panel .dk-sec .chipb{display:flex!important;flex-direction:column;align-items:stretch;gap:6px;width:auto!important;height:auto!important;padding:8px!important;border-radius:12px!important;border:1px solid #ffffff18!important;background:#0a1424!important;color:#dbe6f2!important;font:700 12.5px var(--display,system-ui)!important;text-align:left;white-space:normal!important;line-height:1.3}
body.pc-fhd #panel .dk-woods .chipb > span:first-child{display:block!important;width:100%!important;height:30px!important;margin:0!important;border-radius:8px!important;box-shadow:inset 0 -6px 0 #0003,inset 0 1px 0 #fff3}
body.pc-fhd #panel .dk-styles .chipb{min-height:52px;justify-content:center}
body.pc-fhd #panel .dk-sec .chipb:hover{border-color:#7fb8ff88!important}
body.pc-fhd #panel .dk-sec .chipb[aria-pressed="true"]{border-color:#7fe3c4!important;background:#123a3a!important;color:#fff!important;box-shadow:0 0 0 1px #7fe3c4}
body.pc-fhd #panel .dk-col .shoptools{margin:0!important}
body.pc-fhd #panel .dk-grid{display:grid!important;grid-template-columns:repeat(auto-fill,minmax(150px,1fr))!important;gap:10px!important;margin:0!important}
body.pc-fhd #panel .dk-grid > .tile{padding:10px!important;border-radius:12px!important;background:#0a1424!important;border:1px solid #ffffff12!important;margin:0!important}
body.pc-fhd #panel .dk-grid > .tile.done{border-color:#7fe3c455!important}
body.pc-fhd #panel .dk-grid > .tile canvas{width:96px!important;height:72px!important}
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
{ const _rp=renderPanel; renderPanel=function(){ const P=$('panel'); if(P) P.classList.remove('wdx-on'); return _rp.apply(this,arguments); }; }
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

// =====================================================================
// Pets (full HD), in the Fish Log's shape: what each pet boosts on the left (with how many you have), every pet as an even
// card in the middle, the picked pet on the right: favourite or companion, how to get it, and dressing it up.
// =====================================================================
let petFilt='all', petSel=null;
{ const BOOST=k=>{ const n=BK[k]||k; return n[0].toUpperCase()+n.slice(1); };
  const paintCv=c=>{ const cx=c.getContext('2d'); cx.clearRect(0,0,c.width,c.height); const id=c.dataset.pet, big=id==='horse'||id==='cow', s=(big?2.6:4.4)*c.width/240;
    if(c.dataset.own==='1') drawPetStyled(cx,id,c.width/2,c.height*.91,s,0); else if(PETI[id].src==='shop') drawPet(cx,id,c.width/2,c.height*.91,s,0); else mysteryThumb(cx,c.width,c.height,id); };
  const render=P=>{ const list=PETS.filter(p=>p.src!=='gift'||S.owned.pets.includes(p.id)), own=id=>S.owned.pets.includes(id);
    const kinds=[...new Set(list.map(p=>p.k))].filter(Boolean).sort((a,b)=>BOOST(a).localeCompare(BOOST(b)));
    const nOwn=list.filter(p=>own(p.id)).length;
    const shown=list.filter(p=>petFilt==='all'?true:petFilt==='mine'?own(p.id):petFilt==='find'?!own(p.id):p.k===petFilt);
    if(petSel&&!PETI[petSel]) petSel=null; if(!petSel) petSel=S.pet||(list[0]&&list[0].id);
    const p=PETI[petSel], o=own(petSel), fav=S.pet===petSel, comp=S.pet2===petSel, val=p?p.v*(1+.1*pr('petpal')):0;
    const row=(k,name,f,n)=>`<button type="button" class="fl-w${f===n&&n?' done':''}" data-pf="${k}" aria-pressed="${petFilt===k}"><span class="fl-wn">${name}</span><span class="fl-wc">${f} / ${n}</span><span class="fl-wb"><i style="width:${n?f/n*100:0}%"></i></span></button>`;
    let det='';
    if(p){ const head=`<div class="pt-h"><h3>${fav?'<span class="pt-star">★</span> ':''}${o?esc(petName(petSel)):p.src==='shop'?esc(p.name):'???'}</h3><span class="pt-b">${esc(BOOST(p.k))} <b>${fmtB(p.k,val)}</b></span></div>`;
      if(o&&(fav||comp)){ PET_EDIT=petSel; det=`<div class="pt-role"><span class="${fav?'on':''}">${fav?'★ Your favourite: full bonus, bonds twice as fast':'Your companion: '+Math.round(compShare()*100)+'% of its bonus'}</span>${fav?(S.pet2?'':''):`<span class="row" style="gap:6px"><button class="btn sm" data-act="pet" data-k="${petSel}">★ Make favourite</button><button class="btn sm alt" data-act="pet2off">Send home</button></span>`}</div>${petCustomHTML()}`; }
      else if(o) det=`${head}<canvas class="pt-big" width="400" height="240" data-pet="${petSel}" data-own="1"></canvas><p class="pt-d">${esc(p.d)}</p><div class="pt-acts"><button class="btn" data-act="pet" data-k="${petSel}">★ Make favourite</button><button class="btn alt" data-act="pet2" data-k="${petSel}">Bring as companion</button></div><p class="pt-note">Your favourite and your companion come fishing with you, and those two can be dressed up here.</p>`;
      else if(p.src==='shop') det=`${head}<canvas class="pt-big" width="400" height="240" data-pet="${petSel}" data-own="0"></canvas><p class="pt-d">${esc(p.d)}</p><div class="pt-acts"><button class="btn" data-act="buypet" data-k="${petSel}" ${S.money>=p.price?'':'disabled'}>Adopt · <span class="coin">${fmt(p.price)}</span></button></div>`;
      else det=`${head}<canvas class="pt-big" width="400" height="240" data-pet="${petSel}" data-own="0"></canvas><p class="pt-d">Not found yet.</p><div class="pt-how"><b>How to get it</b><span>${esc(petHint(p))}</span></div>`; }
    P.innerHTML=`<h2 class="dl-dup" hidden>Pets</h2><div class="pt-pc">
      <aside class="pt-side"><h5>Pets</h5>${row('all','All pets',nOwn,list.length)}<button type="button" class="fl-w" data-pf="mine" aria-pressed="${petFilt==='mine'}"><span class="fl-wn">Yours</span><span class="fl-wc">${nOwn}</span></button><button type="button" class="fl-w" data-pf="find" aria-pressed="${petFilt==='find'}"><span class="fl-wn">Still to find</span><span class="fl-wc">${list.length-nOwn}</span></button>
        <h5>What they boost</h5>${kinds.map(k=>{ const l=list.filter(x=>x.k===k); return row(k,BOOST(k),l.filter(x=>own(x.id)).length,l.length); }).join('')}
        <p class="od-note">Two pets come fishing with you: your favourite gives its full bonus, your companion part of it. Pet them in the picture to bond.</p></aside>
      <section class="pt-main"><div class="pt-grid">${shown.map(x=>{ const ow=own(x.id), f=S.pet===x.id, c=S.pet2===x.id, v=x.v*(1+.1*pr('petpal'));
        return `<button type="button" class="pt-card${ow?'':' unk'}${x.id===petSel?' sel':''}${f||c?' with':''}" data-ps="${x.id}"><canvas width="240" height="140" data-pet="${x.id}" data-own="${ow?1:0}"></canvas>${f?'<i class="pt-tag">★ Favourite</i>':c?'<i class="pt-tag c">Companion</i>':''}<b>${ow?esc(petName(x.id)):x.src==='shop'?esc(x.name):'???'}</b><small>${fmtB(x.k,v)}</small>${!ow&&x.src==='shop'?`<em><span class="coin">${fmtShort(x.price)}</span></em>`:''}</button>`; }).join('')||'<div class="fc-empty">Nothing here yet.</div>'}</div></section>
      <aside class="pt-right"><div class="tile pt-det">${det}</div></aside></div>`;
    P.querySelectorAll('canvas[data-pet]').forEach(paintCv); try{ if($('petcv')) paintPetCustom(); }catch(e){}
    P.querySelectorAll('[data-pf]').forEach(b=>b.addEventListener('click',e=>{ e.stopPropagation(); petFilt=b.dataset.pf; render(P); }));
    P.querySelectorAll('[data-ps]').forEach(b=>b.addEventListener('click',e=>{ e.stopPropagation(); petSel=b.dataset.ps; PET_PV=null; render(P); }));
    P.classList.add('pt-on'); };
  const _rp=renderPanel; renderPanel=function(){ const P=$('panel'); if(P) P.classList.remove('pt-on'); if(S.tab==='pets'&&FHD()){ render(P); try{ menuSync(); if(P.dataset.tab035!=='pets'){ P.dataset.tab035='pets'; pageIn(P); } P.dataset.pg='pets'; }catch(e){} return; } return _rp.apply(this,arguments); }; }
document.head.insertAdjacentHTML('beforeend',`<style>
html body.pc-fhd #menuov #panel.pt-on{display:flex!important;flex-direction:column!important;overflow:hidden!important}
html body.pc-fhd #menuov #panel.pt-on > .pt-pc{flex:1 1 0;min-height:0}
body.pc-fhd #panel .pt-pc{display:grid;grid-template-columns:240px minmax(0,1fr) 420px;gap:14px;min-height:0}
body.pc-fhd #panel .pt-pc > *{min-height:0;overflow:auto;scrollbar-width:thin}
body.pc-fhd #panel .pt-side{display:flex;flex-direction:column;gap:4px}
body.pc-fhd #panel .pt-side h5{margin:8px 2px 6px;font:800 11.5px var(--display,system-ui);letter-spacing:.08em;text-transform:uppercase;color:#8fa6bf}
body.pc-fhd #panel .pt-side h5:first-child{margin-top:2px}
body.pc-fhd #panel .pt-pc .fl-w{display:grid;grid-template-columns:minmax(0,1fr) auto;row-gap:4px;column-gap:8px;align-items:center;text-align:left;padding:8px 10px 9px;border-radius:10px;border:1px solid transparent;background:#ffffff06;color:#dbe6f2;cursor:pointer;font:700 13.5px var(--display,system-ui)}
body.pc-fhd #panel .pt-pc .fl-w:hover{background:#ffffff10}
body.pc-fhd #panel .pt-pc .fl-w[aria-pressed="true"]{background:#1d3150;border-color:#7fb8ff66;color:#fff;box-shadow:inset 3px 0 0 #7fb8ff}
body.pc-fhd #panel .pt-pc .fl-wc{font-size:12px;color:#9fb2c8}
body.pc-fhd #panel .pt-pc .fl-w.done .fl-wc{color:#7fe3c4}
body.pc-fhd #panel .pt-pc .fl-wb{grid-column:1 / -1;display:block;height:5px;border-radius:5px;background:#ffffff14;overflow:hidden}
body.pc-fhd #panel .pt-pc .fl-wb i{display:block;height:100%;border-radius:5px;background:linear-gradient(90deg,#7fe3c4,#ffd36a)}
body.pc-fhd #panel .pt-side .od-note{margin:12px 4px 0;font-size:12px;line-height:1.5;color:#8ea4b9}
body.pc-fhd #panel .pt-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:10px}
body.pc-fhd #panel .pt-card{position:relative;display:flex;flex-direction:column;align-items:center;gap:3px;padding:10px 8px;border-radius:14px;border:1px solid #ffffff14;background:#0e1a2c;color:#dbe6f2;cursor:pointer;min-width:0;font:inherit}
body.pc-fhd #panel .pt-card:hover{border-color:#7fb8ff88}
body.pc-fhd #panel .pt-card.sel{outline:2px solid #ffd36a;outline-offset:-1px}
body.pc-fhd #panel .pt-card.with{background:linear-gradient(180deg,#1b2a1f,#0e1a2c)}
body.pc-fhd #panel .pt-card canvas{width:100%;height:auto;max-height:76px;object-fit:contain}
body.pc-fhd #panel .pt-card b{font:800 13px var(--display,system-ui);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:100%;color:#fff}
body.pc-fhd #panel .pt-card.unk b{color:#7f93a8}
body.pc-fhd #panel .pt-card small{font-size:11.5px;color:#7fe3c4;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:100%}
body.pc-fhd #panel .pt-card em{font-style:normal;font-size:11.5px;color:#ffd36a}
body.pc-fhd #panel .pt-tag{position:absolute;top:6px;left:6px;font-style:normal;font:800 10px var(--display,system-ui);padding:2px 7px;border-radius:999px;background:#ffd36a;color:#2a1c05}
body.pc-fhd #panel .pt-tag.c{background:#7fe3c4;color:#06261f}
body.pc-fhd #panel .pt-det{display:flex;flex-direction:column;gap:10px;padding:14px!important;margin:0!important}
body.pc-fhd #panel .pt-h{display:flex;flex-direction:column;gap:2px}
body.pc-fhd #panel .pt-h h3{margin:0;font:800 20px var(--display,system-ui);color:#fff}
body.pc-fhd #panel .pt-star{color:#ffc94d}
body.pc-fhd #panel .pt-b{font-size:13px;color:#9fb2c8} body.pc-fhd #panel .pt-b b{color:#7fe3c4}
body.pc-fhd #panel .pt-big{width:100%;height:auto;border-radius:12px;background:radial-gradient(circle at 50% 60%,#24365a,#101a2c)}
body.pc-fhd #panel .pt-d{margin:0;font-size:13.5px;line-height:1.5;color:#cfdcea}
body.pc-fhd #panel .pt-acts{display:flex;gap:8px;flex-wrap:wrap}
body.pc-fhd #panel .pt-note{margin:0;font-size:12px;color:#8ea4b9;line-height:1.45}
body.pc-fhd #panel .pt-how{display:flex;flex-direction:column;gap:4px;padding:10px 12px;border-radius:12px;background:#0a1424;font-size:13px;color:#cfdcea}
body.pc-fhd #panel .pt-how b{font:800 12px var(--display,system-ui);letter-spacing:.06em;text-transform:uppercase;color:#ffd36a}
body.pc-fhd #panel .pt-role{display:flex;flex-direction:column;gap:8px;font:700 13px var(--display,system-ui);color:#cfe0f2}
body.pc-fhd #panel .pt-role .on{color:#ffd36a}
body.pc-fhd #panel .pt-det > .tile{margin:0!important;padding:0!important;background:none!important;border:0!important;box-shadow:none!important}
body.pc-fhd #panel .pt-det .petwrap{display:flex!important;flex-direction:column!important;gap:10px}
body.pc-fhd #panel .pt-det .petwrap .preview{width:100%!important;max-width:none!important}
body.pc-fhd #panel .pt-det #petcv{width:100%!important;height:auto!important;border-radius:12px}
body.pc-fhd #panel .pt-det h5{margin:6px 0 4px!important;font:800 11.5px var(--display,system-ui)!important;letter-spacing:.08em;text-transform:uppercase;color:#ffd36a!important}
body.pc-fhd #panel .pt-det .chips{gap:6px!important;margin:0!important}
</style>`);

// =====================================================================
// Where things live on full-HD PC (director, 2026-11-17: "the tackle shop shouldn't exist", "move bait to the fishing tab",
// "Gear needs to be renamed", "Challenges feels too full... what gets its own place on the top header"):
//   Fishing: Travel, Bait          Upgrades: Equipment (was the tackle shop's Gear), Rods, Skills, Paths
//   Challenges: Events, Bounties, Feats, Tide Pass          Boardwalk: its own button in the header
// Special lures are part of Bait now (bounties hand them out too). Phones and smaller windows keep the old layout.
// =====================================================================
const BOARD_SEC={id:'board', name:'Boardwalk', short:'Boardwalk', tabs:['games'], icon:'<path d="M3 18h18"/><path d="M5 18V9l7-5 7 5v9"/><circle cx="12" cy="11.5" r="2.6"/><path d="M12 8.9v5.2M9.4 11.5h5.2"/>'};
{ const T=$('tabs'); if(T&&!T.querySelector(':scope > [data-tab="bait"]')){ const sh=T.querySelector(':scope > [data-tab="shop"]'); (sh||T.lastElementChild).insertAdjacentHTML('afterend','<button role="tab" data-tab="bait" aria-selected="false" data-label="🪱 Bait">🪱 Bait</button>'); }
  try{ PAGE_DESC.bait='Choose your bait: faster bites, rarer fish, and special lures'; }catch(e){}
  let on=null; const shopBtn=()=>menuTabBtn('shop'); let shopLbl=null;
  const sync=()=>{ const v=FHD(); const changed=v!==on; on=v;
    const fish=MENU_SECS.find(s=>s.id==='fish'), chal=MENU_SECS.find(s=>s.id==='chal');
    if(fish){ const i=fish.tabs.indexOf('bait'); if(v&&i<0) fish.tabs.push('bait'); if(!v&&i>=0) fish.tabs.splice(i,1); }
    if(chal){ const i=chal.tabs.indexOf('games'); if(v&&i>=0) chal.tabs.splice(i,1); if(!v&&i<0) chal.tabs.push('games'); }
    const CD=$('catdock'), bi=MENU_SECS.indexOf(BOARD_SEC);
    if(v){ if(bi<0) MENU_SECS.push(BOARD_SEC); if(CD&&!CD.querySelector('[data-cd="board"]')){ const ref=CD.querySelector('[data-cd="cust"]'); const html=`<button type="button" class="cdb" data-cd="board" title="Boardwalk" aria-label="Boardwalk"><svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${BOARD_SEC.icon}</svg><span class="cdl">Boardwalk</span><span class="cddot" hidden></span></button>`; if(ref) ref.insertAdjacentHTML('beforebegin',html); else CD.insertAdjacentHTML('beforeend',html); } }
    else { const b=CD&&CD.querySelector('[data-cd="board"]'); if(b) b.remove(); if(bi>=0) MENU_SECS.splice(bi,1); }
    const sb=shopBtn(); if(sb){ if(shopLbl==null) shopLbl=sb.dataset.label; sb.dataset.label=v?'🧰 Equipment':shopLbl; }
    if(changed) try{ menuSubKey=''; if(MENU_OPEN){ if(!v&&S.tab==='bait') setTab('shop'); else menuSync(); } }catch(e){} };
  new MutationObserver(sync).observe(document.body,{attributes:true,attributeFilter:['class']}); setTimeout(sync,0); setTimeout(sync,900);
  // a section with a single page needs no page row (the lit header button already says where you are)
  const _ms=menuSync; menuSync=function(){ try{ sync(); }catch(e){} _ms.apply(this,arguments); try{ if(!FHD()) return; const sec=menuSecOf(S.tab), sb=$('tabs')&&$('tabs').querySelector('.subbar'); if(sec&&sb&&menuTabsIn(sec).length===1){ sb.innerHTML=''; sb.hidden=true; menuSubKey='one|'+S.tab; } }catch(e){} }; }

// ---------- Bait: its own page in Fishing. What bait does, the one you use, and every bait as an even card ----------
let baitFilt='all';
{ const odds=k=>{ try{ return catchOdds({bait:k}).epic; }catch(e){ return null; } };
  const render=P=>{ const cur=BAIT[S.baitSel]||BAIT.worm, base=odds('worm'), all=Object.entries(BAIT).filter(([k])=>k!=='worm');
    const here=([k,b])=>b.loc===S.loc, shown=all.filter(e=>baitFilt==='all'?!e[1].junk:baitFilt==='special'?e[1].junk:baitFilt==='mine'?S.bait[e[0]]>0:here(e));
    const card=([k,b])=>{ const using=S.baitSel===k, o=odds(k), have=S.bait[k]||0;
      const buy=b.junk?'<span class="bt-src">Found in oddities and bounty rewards</span>':b.scales?`<button class="btn sm" data-act="buybait" data-k="${k}" ${S.scales>=b.scales?'':'disabled'}>Buy ${b.pack} · ${b.scales} Scales</button>`
        :`<button class="btn sm" data-act="buybait" data-k="${k}" ${S.money>=b.price?'':'disabled'}>Buy ${b.pack} · <span class="coin">${fmtShort(b.price)}</span></button><button class="btn alt sm" data-act="buybait" data-k="${k}" data-n="5" ${S.money>=b.price*4.5?'':'disabled'}>×${b.pack*5} · <span class="coin">${fmtShort(b.price*4.5)}</span></button>`;
      return `<div class="bt-card${using?' on':''}${b.junk?' sp':''}"><div class="bt-h"><b>${esc(b.name)}</b>${using?'<span class="badge g">In use</span>':b.junk?'<span class="badge">Special</span>':''}<span class="bt-have">${have} owned</span></div>
        <p>${esc(String(b.note||'').replace(/^Found as junk\.\s*/,''))}</p><div class="badges">${baitChips(b)}</div>
        ${o!=null?`<div class="bt-odds">Epic or better here: <b>${fmtOdds(o)}</b>${base!=null?` <span>(worms ${fmtOdds(base)})</span>`:''}</div>`:''}
        <div class="bt-acts">${buy}<button class="btn alt sm" data-act="usebait" data-k="${k}" ${have>0&&!using?'':'disabled'}>${using?'In use':'Use'}</button></div></div>`; };
    const nHere=all.filter(here).length, nSp=all.filter(e=>e[1].junk).length, nMine=all.filter(e=>S.bait[e[0]]>0).length;
    P.innerHTML=`<h2 class="dl-dup" hidden>Bait</h2><div class="bt-top"><div class="bt-cur"><span class="bt-k">Bait in use</span><b>${esc(cur.name)}</b><span class="bt-n">${S.baitSel==='worm'?'Free and endless':(S.bait[S.baitSel]||0)+' left'}</span><div class="badges">${baitChips(cur)}</div>${S.baitSel!=='worm'?'<button class="btn alt sm" data-act="usebait" data-k="worm">Switch to worms</button>':''}<button type="button" class="bt-auto" data-act="autobait" aria-pressed="${!!S.settings.autoBait}"><i></i><span><b>Auto-restock ${S.settings.autoBait?'on':'off'}</b><small>When your bait runs out, one more pack is bought if you have the coins</small></span></button></div>
      <div class="bt-why"><b>How bait works</b><span>One bait is used each time you set the hook; worms are free and never run out. Better bait brings faster bites and rarer fish, and some bait is best at one water. Special lures can’t be bought: they come from oddities you fish up and from bounty rewards.</span></div></div>
      <div class="bt-filt">${[['all','For sale',all.filter(e=>!e[1].junk).length],['here','Best here',nHere],['mine','Yours',nMine],['special','Special lures',nSp]].map(([k,n,c])=>`<button type="button" data-btf="${k}" aria-pressed="${baitFilt===k}">${n} <b>${c}</b></button>`).join('')}</div>
      ${!shown.length?'<div class="bt-grid"><div class="fc-empty">Nothing here yet.</div></div>':(()=>{ /* round 6: water baits as their own group, in the order the waters unlock */ const wat=shown.filter(e=>e[1].loc&&!e[1].junk), food=shown.filter(e=>e[1].food), rest=shown.filter(e=>!(e[1].loc&&!e[1].junk)&&!e[1].food); /* 0.4.9: favourite foods are a group of their own */
        const groups=[[0,rest],[1,wat],[2,food]].filter(g=>g[1].length); /* C16: shared groups, price order and folding (u_tackle.js) */
        if(groups.length<2) return '<div class="bt-grid">'+baitSorted(shown).map(card).join('')+'</div>'; return '<div class="bt-groups">'+groups.map(([g,l])=>{ const open=baitFilt!=='all'||!baitFold[g]; return baitFoldHead(g,l.length,open)+(open?'<div class="bt-grid">'+baitSorted(l).map(card).join('')+'</div>':''); }).join('')+'</div>'; })()}`;
    P.querySelectorAll('[data-btf]').forEach(b=>b.addEventListener('click',e=>{ e.stopPropagation(); baitFilt=b.dataset.btf; render(P); }));
    P.classList.add('bt-on'); };
  const _rp=renderPanel; renderPanel=function(){ const P=$('panel'); if(P) P.classList.remove('bt-on'); if(S.tab==='bait'){ if(!FHD()){ S.tab='shop'; tackleView='bait'; return _rp.apply(this,arguments); } render(P); try{ menuSync(); if(P.dataset.tab035!=='bait'){ P.dataset.tab035='bait'; pageIn(P); } P.dataset.pg='bait'; }catch(e){} return; } return _rp.apply(this,arguments); }; }
document.head.insertAdjacentHTML('beforeend',`<style>
html body.pc-fhd #menuov #panel.bt-on{display:flex!important;flex-direction:column!important;overflow:hidden!important;gap:12px}
html body.pc-fhd #menuov #panel.bt-on > *{flex:0 0 auto}
html body.pc-fhd #menuov #panel.bt-on > .bt-grid{flex:1 1 0;min-height:0;overflow:auto;scrollbar-width:thin;align-content:start}
body.pc-fhd #panel .bt-top{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1.3fr);gap:14px}
body.pc-fhd #panel .bt-cur,body.pc-fhd #panel .bt-why{display:flex;flex-direction:column;gap:6px;padding:14px 16px;border-radius:16px;background:#0e1a2c;border:1px solid #ffffff14}
body.pc-fhd #panel .bt-cur{background:linear-gradient(180deg,#123a3a,#0e1a2c);border-color:#7fe3c466;flex-direction:row;flex-wrap:wrap;align-items:center;column-gap:14px}
body.pc-fhd #panel .bt-k{width:100%;font:800 11.5px var(--display,system-ui);letter-spacing:.08em;text-transform:uppercase;color:#7fe3c4}
body.pc-fhd #panel .bt-cur > b{font:800 24px var(--display,system-ui);color:#fff}
body.pc-fhd #panel .bt-n{font:700 14px var(--display,system-ui);color:#cfe0f2}
body.pc-fhd #panel .bt-cur .badges{margin:0!important;justify-content:flex-start}
body.pc-fhd #panel .bt-why b{font:800 13px var(--display,system-ui);color:#ffd36a}
body.pc-fhd #panel .bt-why span{font-size:13px;line-height:1.5;color:#a9bccf}
body.pc-fhd #panel .bt-filt{display:flex;gap:8px}
body.pc-fhd #panel .bt-filt button{height:34px;padding:0 14px;border-radius:999px;border:1px solid #ffffff1c;background:#0e1a2c;color:#dbe6f2;font:700 13px var(--display,system-ui);cursor:pointer}
body.pc-fhd #panel .bt-filt button b{color:#8fa6bf;margin-left:4px}
body.pc-fhd #panel .bt-filt button[aria-pressed="true"]{background:#1d3150;border-color:#7fb8ff;color:#fff}
body.pc-fhd #panel .bt-filt button[aria-pressed="true"] b{color:#fff}
body.pc-fhd #panel .bt-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(330px,1fr));gap:12px}
body.pc-fhd #panel .bt-card{display:flex;flex-direction:column;gap:8px;padding:14px;border-radius:14px;background:#0e1a2c;border:1px solid #ffffff14}
body.pc-fhd #panel .bt-card.on{border-color:#7fe3c4;box-shadow:0 0 0 1px #7fe3c4}
body.pc-fhd #panel .bt-card.sp{background:linear-gradient(180deg,#2a2210,#0e1a2c);border-color:#ffd36a44}
body.pc-fhd #panel .bt-h{display:flex;align-items:center;gap:8px}
body.pc-fhd #panel .bt-h b{font:800 16px var(--display,system-ui);color:#fff}
body.pc-fhd #panel .bt-have{margin-left:auto;font-size:12px;color:#9fb2c8}
body.pc-fhd #panel .bt-card p{margin:0;font-size:13px;line-height:1.45;color:#cfdcea}
body.pc-fhd #panel .bt-card .badges{margin:0!important;justify-content:flex-start}
body.pc-fhd #panel .bt-odds{font-size:12.5px;color:#9fb2c8} body.pc-fhd #panel .bt-odds b{color:#c79bff} body.pc-fhd #panel .bt-odds span{color:#6f859b}
body.pc-fhd #panel .bt-acts{display:flex;gap:6px;flex-wrap:wrap;margin-top:auto;align-items:center}
body.pc-fhd #panel .bt-src{font-size:12px;color:#ffd36a;margin-right:auto}
</style>`);

// ---------- Equipment (the tackle shop's gear): one clear page of upgrades ----------
{ const _rs=renderShop; renderShop=function(P){ if(!FHD()) return _rs(P); const keep=tackleView; tackleView='gear'; _rs(P); tackleView=keep; try{
      const h=P.querySelector('h2'); if(h) h.textContent='Equipment'; const sub=P.querySelector('p.sub'); if(sub) sub.textContent='Upgrades for your tackle, paid in coins and kept forever: longer casts, a faster reel, stronger line, a quicker hook, a bigger cooler and a fish finder. Bait has its own page under Fishing.';
      P.querySelectorAll(':scope > .tk-cur, :scope > .bwx-nav').forEach(e=>e.remove()); const g=P.querySelector(':scope > .grid'); if(g) g.classList.add('eq-grid'); }catch(e){ console.error(e); } }; }
document.head.insertAdjacentHTML('beforeend',`<style>
body.pc-fhd #panel .eq-grid{display:grid!important;grid-template-columns:repeat(3,minmax(0,1fr))!important;gap:14px!important}
body.pc-fhd #panel .eq-grid > .tile{padding:18px!important;gap:10px!important;margin:0!important}
body.pc-fhd #panel .eq-grid > .tile h4{font:800 18px var(--display,system-ui)!important}
body.pc-fhd #panel .eq-grid > .tile .val{font-size:16px!important}
</style>`);

// ---------- Rods: your rod, the rod rack and the attachments side by side (no switching), with what levels and Scales do ----------
{ const _rp=renderPanel; renderPanel=function(){ const r=_rp.apply(this,arguments); try{ if(S.tab!=='rods'||!FHD()) return r; const P=$('panel'), pair=P.querySelector('.fhd-rodpair'); if(!pair||pair.querySelector('.fhd-rack')) return r;
      const h=[...P.querySelectorAll(':scope > h2')].find(x=>x.style.display==='none'||x.hidden), grid=P.querySelector(':scope > .grid');
      const rack=document.createElement('section'); rack.className='fhd-col fhd-rack'; rack.innerHTML='<header class="fhd-h"><span>Rod rack</span></header><div class="fhd-body2"></div>';
      if(grid){ grid.style.display=''; grid.classList.add('rk-grid'); rack.querySelector('.fhd-body2').appendChild(grid); } if(h) h.remove();
      const you=pair.querySelector('.fhd-you'); pair.insertBefore(rack,you?you.nextSibling:pair.firstChild);
      const L=rodLvl(); if(you&&!you.querySelector('.rd-help')) you.querySelector('.fhd-body2').insertAdjacentHTML('beforeend',`<div class="rd-help"><b>Rod levels</b><span>Every level adds +3% reel speed, −2% line tension and +2% rare odds to this rod, up to level 10. You are at ${L} / 10.</span><b>Scales</b><span>You have ${fmt(S.scales)}. Scales come from rare, shiny and trophy-size fish, bounties, weekly goals and the Tide Pass, and are only spent on rods and attachments.</span></div>`);
      P.querySelectorAll(':scope > .sect-nav').forEach(e=>e.remove()); P.classList.add('rd-on'); }catch(e){ console.error(e); } return r; };
  const _rp2=renderPanel; renderPanel=function(){ const P=$('panel'); if(P) P.classList.remove('rd-on'); return _rp2.apply(this,arguments); }; }
document.head.insertAdjacentHTML('beforeend',`<style>
html body.pc-fhd #menuov #panel.rd-on{display:flex!important;flex-direction:column!important;overflow:hidden!important}
html body.pc-fhd #menuov #panel.rd-on > *{flex:0 0 auto}
html body.pc-fhd #menuov #panel.rd-on > .fhd-rodpair{flex:1 1 0;min-height:0}
html body.pc-fhd #menuov #panel.rd-on .fhd-rodpair{display:grid!important;grid-template-columns:400px minmax(0,1.2fr) minmax(0,1fr)!important;gap:14px!important;align-items:stretch!important}
html body.pc-fhd #menuov #panel.rd-on .fhd-col{display:flex!important;flex-direction:column;min-height:0;border-radius:16px;background:#0e1a2c;border:1px solid #ffffff14;overflow:hidden}
html body.pc-fhd #menuov #panel.rd-on .fhd-col > .fhd-h{padding:12px 16px;margin:0!important;border-bottom:1px solid #ffffff10;font:800 15px var(--display,system-ui)}
html body.pc-fhd #menuov #panel.rd-on .fhd-body2{flex:1 1 0;min-height:0;overflow:auto;padding:12px 14px;scrollbar-width:thin}
body.pc-fhd #panel .rk-grid{display:grid!important;grid-template-columns:repeat(auto-fill,minmax(200px,1fr))!important;gap:10px!important;margin:0!important}
body.pc-fhd #panel .rk-grid > .tile{margin:0!important;padding:12px!important;background:#0a1424!important}
body.pc-fhd #panel .rd-help{display:grid;gap:4px;margin-top:12px;padding:12px 14px;border-radius:12px;background:#0a1424;border:1px solid #ffffff10;font-size:12.5px;line-height:1.5;color:#a9bccf}
body.pc-fhd #panel .rd-help b{font:800 12px var(--display,system-ui);letter-spacing:.06em;text-transform:uppercase;color:#ffd36a;margin-top:4px}
</style>`);

// ---------- Events: one even screen (the calendar, the six challenges, the derby); the weather forecast moved to Travel ----------
{ const _re=renderPanel; renderPanel=function(){ const rr=_re.apply(this,arguments), P=$('panel'); try{ if(S.tab!=='events') P.classList.remove('ev-on'); if(!FHD()||S.tab!=='events'||P.querySelector('.ev-derby')) return rr; const wx=P.querySelector('.wxf'); if(wx) wx.remove(); P.querySelectorAll(':scope > .crumb').forEach(e=>e.remove());
      const hs=[...P.querySelectorAll(':scope > h3.ev-h')], derbyH=hs[1], bwt=P.querySelector(':scope > .tile.bwt'), rew=bwt&&bwt.nextElementSibling;
      if(derbyH&&bwt&&rew){ const row=document.createElement('div'); row.className='ev-derby'; derbyH.after(row); row.append(bwt,rew); }
      P.classList.add('ev-on'); }catch(e){ console.error(e); } return rr; }; }
document.head.insertAdjacentHTML('beforeend',`<style>
html body.pc-fhd #menuov #panel.ev-on > p.sub{margin:2px 0 8px!important}
html body.pc-fhd #menuov #panel.ev-on .ev-cal{margin:0 0 6px!important}
html body.pc-fhd #menuov #panel.ev-on .ev-cal{display:grid!important;grid-template-columns:repeat(3,minmax(0,1fr));column-gap:14px;row-gap:6px}
html body.pc-fhd #menuov #panel.ev-on .ev-cal > h4,body.pc-fhd #panel.ev-on .ev-cal > .meta{grid-column:1 / -1}
html body.pc-fhd #menuov #panel.ev-on .ev-cal-row{min-height:64px;margin:0!important;padding:10px 12px!important;border-radius:12px;background:#0a1424;border:1px solid #ffffff10}
html body.pc-fhd #menuov #panel.ev-on .ev-grid{display:grid!important;grid-template-columns:repeat(6,minmax(0,1fr))!important;gap:12px!important;align-items:stretch}
html body.pc-fhd #menuov #panel.ev-on .ev-ch{display:flex!important;flex-direction:column!important;margin:0!important;padding:14px!important}
html body.pc-fhd #menuov #panel.ev-on .ev-ch > :last-child{margin-top:auto!important}
html body.pc-fhd #menuov #panel.ev-on .ev-derby{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:14px;align-items:stretch}
html body.pc-fhd #menuov #panel.ev-on .ev-derby > .tile{margin:0!important}
</style>`);
// the forecast on Travel (plan where to fish), kept live
{ const _rp=renderPanel; renderPanel=function(){ const r=_rp.apply(this,arguments); try{ if(S.tab!=='map'||!FHD()) return r; const P=$('panel'); if(P.querySelector('.wxf')) return r; P.insertAdjacentHTML('afterbegin',forecastHTML()); const w=P.querySelector('.wxf'); if(w){ w.classList.add('wxf-top'); w.removeAttribute('style'); } }catch(e){ console.error(e); } return r; };
  setInterval(()=>{ if(S.tab!=='map'||!MENU_OPEN||!FHD()) return; const box=document.querySelector('#panel .wxf'); if(!box) return; const cur=Math.floor(Date.now()/1000/WX_LEN); if(box.dataset.slot&&+box.dataset.slot!==cur){ box.outerHTML=forecastHTML(); const w=document.querySelector('#panel .wxf'); if(w){ w.classList.add('wxf-top'); w.removeAttribute('style'); w.dataset.slot=cur; } return; } box.dataset.slot=cur;
    const l=box.querySelector('[data-wxl]'); if(l) l.textContent=mmss(wxLeft())+' left'; const f=wxForecast(5); box.querySelectorAll('.wxf-row:not(.on) .badge').forEach((b,i)=>{ if(f[i]) b.textContent='in '+mmss(Math.max(0,Math.round(f[i].at))); }); },1000); }
document.head.insertAdjacentHTML('beforeend',`<style>
html body.pc-fhd #menuov #panel .wxf-top{display:grid!important;grid-template-columns:repeat(6,minmax(0,1fr));gap:10px;margin:0 0 14px!important;padding:14px 16px!important}
html body.pc-fhd #menuov #panel .wxf-top > h4{grid-column:1 / 3;margin:0!important}
html body.pc-fhd #menuov #panel .wxf-top > .meta{grid-column:3 / -1;align-self:center;text-align:right;margin:0!important}
html body.pc-fhd #menuov #panel .wxf-top .wxf-row{display:grid!important;grid-template-rows:auto 1fr auto;gap:4px;height:112px;box-sizing:border-box;margin:0!important;padding:10px 12px!important;border-radius:12px;background:#0a1424;border:1px solid #ffffff10;overflow:hidden}
html body.pc-fhd #menuov #panel .wxf-top .wxf-row.on{background:linear-gradient(180deg,#123a3a,#0a1424);border-color:#7fe3c466}
html body.pc-fhd #menuov #panel .wxf-top .wxf-row.sp{border-color:#ffd36a66}
html body.pc-fhd #menuov #panel .wxf-top .wxf-row b{font:800 14px var(--display,system-ui);color:#fff}
html body.pc-fhd #menuov #panel .wxf-top .wxf-row .meta{font-size:12px;line-height:1.35;display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden}
html body.pc-fhd #menuov #panel .wxf-top .wxf-row .badge{justify-self:start}
</style>`);

// ---------- the header: every category button in the same teal "you can click me" style as Cooler / Aquarium / Fish Log / Stats ----------
document.head.insertAdjacentHTML('beforeend',`<style>
html body.pc-fhd #pchead #catdock{gap:6px!important;background:none!important;border:0!important;box-shadow:none!important;padding:0!important}
html body.pc-fhd #pchead #catdock .cdb{flex-direction:row!important;gap:8px!important;height:42px!important;min-width:0!important;padding:0 16px!important;border-radius:12px!important;background:linear-gradient(180deg,#1f8a86,#14666a)!important;border:1px solid #7fe3c4!important;color:#fff!important;box-shadow:inset 0 1px 0 #ffffff33,0 3px 0 #0b3a3a,0 4px 10px #0008!important}
html body.pc-fhd #pchead #catdock .cdb .cdl{font:800 14px var(--display,system-ui)!important;color:#fff!important}
html body.pc-fhd #pchead #catdock .cdb svg{color:#e6fff6!important}
html body.pc-fhd #pchead #catdock .cdb:hover{background:linear-gradient(180deg,#26a39e,#187a7e)!important;box-shadow:inset 0 1px 0 #ffffff40,0 3px 0 #0b3a3a,0 0 0 3px #7fe3c433,0 4px 12px #000a!important}
html body.pc-fhd #pchead #catdock .cdb.on{background:linear-gradient(180deg,#ffe08a,#f3b94e)!important;border-color:#ffe6a3!important;box-shadow:inset 0 1px 0 #fff6,0 2px 0 #8a5b12,0 0 0 3px #ffd36a44!important}
html body.pc-fhd #pchead #catdock .cdb.on .cdl,html body.pc-fhd #pchead #catdock .cdb.on svg{color:#2a1c05!important}
html body.pc-fhd #pchead #catdock .cdb .cddot{top:-2px!important;right:-6px!important} /* the frame (.wrap, overflow hidden) starts 2 px above the header: -6 cut the circle (director, 2026-11-19) */
</style>`);
document.head.insertAdjacentHTML('beforeend',`<style>
html body.pc-fhd #pchead{grid-template-columns:auto minmax(0,1fr) auto!important;column-gap:16px!important}
html body.pc-fhd #pchead .pch-cats{width:auto!important;justify-self:center!important;min-width:0}
html body.pc-fhd #pchead .pch-cats #catdock{width:auto!important;position:static!important;transform:none!important}
html body.pc-fhd #pchead #catdock .cdb{padding:0 14px!important}
</style>`);
document.head.insertAdjacentHTML('beforeend',`<style>
html body.pch-on.pc-fhd.dl-fish #pchead{grid-template-columns:190px auto minmax(0,1fr) auto!important}
html body.pch-on.pc-fhd #pchead #catdock{grid-template-columns:repeat(6,auto)!important;width:auto!important;gap:6px!important}
</style>`);

// =====================================================================
// Tide Pass (full HD): your level and next reward on the left, the reward road in the middle, and this week's Tide goals on
// the right (the four weekly quests moved here from Bounties: they fill the pass, so this is where they belong).
// =====================================================================
const psLayout=P=>{ try{ if(!FHD()||P.querySelector('.ps-pc')) return; const hd=P.querySelector(':scope > .dl-head'), next=P.querySelector(':scope > .pass-next'), track=P.querySelector(':scope > .passtrack'), foot=[...P.querySelectorAll(':scope > p.sub')].pop();
      if(!hd||!track) return; const lvl=hd.querySelector('.tile');
      const L=document.createElement('aside'); L.className='ps-left'; if(lvl) L.appendChild(lvl); if(next) L.appendChild(next);
      L.insertAdjacentHTML('beforeend',`<div class="tile ps-how"><h4>How it fills</h4><span>Every fish you land adds Tide Pass XP: rarer fish add more, shiny ×2, trophy ×1.5. Tide goals, daily tasks, derbies and some bounties add extra.</span><span>Each level gives a reward; after level 50 every level is a bonus crate.</span></div>`);
      const M=document.createElement('section'); M.className='ps-mid'; M.innerHTML='<header class="fhd-h"><span>Reward road</span></header>'; M.appendChild(track);
      const R=document.createElement('aside'); R.className='ps-right'; R.innerHTML=`<header class="fhd-h"><span>This week’s Tide goals</span></header><p class="meta">Four bigger goals every week. Each pays coins, Scales and Tide Pass XP, and finishing all four opens a Mystery Crate.</p>${weeklyHTML()}`; { const w=R.querySelector('.wq'); if(w){ const h=w.querySelector('h4'); if(h) h.remove(); const m=w.querySelector(':scope > .meta'); if(m) m.remove(); } }
      const g=document.createElement('div'); g.className='ps-pc'; g.append(L,M,R);
      [...P.children].forEach(c=>{ if(c.classList.contains('crumb')||c===hd||c===foot) c.remove(); }); P.prepend(g); P.classList.add('ps-on'); }catch(e){ console.error(e); } };
{ const _rp=renderPanel; renderPanel=function(){ const P=$('panel'); if(P) P.classList.remove('ps-on'); const r=_rp.apply(this,arguments); if(S.tab==='pass') psLayout(P); return r; }; }
document.head.insertAdjacentHTML('beforeend',`<style>
html body.pc-fhd #menuov #panel.ps-on{display:flex!important;flex-direction:column!important;overflow:hidden!important}
html body.pc-fhd #menuov #panel.ps-on > .ps-pc{flex:1 1 0;min-height:0}
body.pc-fhd #panel .ps-pc{display:grid;grid-template-columns:380px minmax(0,1fr) 440px;gap:14px;min-height:0}
body.pc-fhd #panel .ps-pc > *{min-height:0;overflow:auto;scrollbar-width:thin}
body.pc-fhd #panel .ps-left{display:flex;flex-direction:column;gap:12px}
body.pc-fhd #panel .ps-left > .tile{margin:0!important;min-width:0!important}
body.pc-fhd #panel .ps-how{display:flex;flex-direction:column;gap:6px;font-size:13px;line-height:1.5;color:#a9bccf}
body.pc-fhd #panel .ps-how h4{margin:0;color:#ffd36a}
body.pc-fhd #panel .ps-mid,body.pc-fhd #panel .ps-right{padding:0 14px 14px;border-radius:16px;background:#0e1a2c;border:1px solid #ffffff14}
body.pc-fhd #panel .ps-mid > .fhd-h,body.pc-fhd #panel .ps-right > .fhd-h{position:sticky;top:0;z-index:2;margin:0 -14px 10px!important;padding:12px 16px;background:#0e1a2c;border-bottom:1px solid #ffffff10;font:800 15px var(--display,system-ui);color:#fff}
body.pc-fhd #panel .ps-mid .passtrack{display:grid!important;grid-template-columns:repeat(auto-fill,minmax(150px,1fr))!important;gap:10px!important;margin:0!important;overflow:visible!important}
body.pc-fhd #panel .ps-right > .meta{margin:0 0 10px;font-size:12.5px;line-height:1.5}
body.pc-fhd #panel .ps-right .wq{margin:0!important;padding:0!important;background:none!important;border:0!important;box-shadow:none!important}
body.pc-fhd #panel .ps-right .wq > h4,body.pc-fhd #panel .ps-right .wq > .meta:first-of-type{display:none}
body.pc-fhd #panel .ps-right .wq .row,body.pc-fhd #panel .ps-right .wq .wq-q{display:flex!important;flex-direction:column;align-items:stretch!important;gap:6px}
</style>`);

// =====================================================================
// Boardwalk (full HD): a slim banner with the tabs and your tickets inside the picture, then the games as even cards that
// fill the screen. The banner is drawn at its real size, so it stays sharp.
// =====================================================================
{ const _rp=renderPanel; renderPanel=function(){ const r=_rp.apply(this,arguments); try{ const P=$('panel'); P.classList.remove('bw-on'); if(S.tab!=='games'||!FHD()) return r; const hero=P.querySelector('.bwx-hero'); if(!hero||hero.querySelector('.bwx-nav')) return r;
      const wal=P.querySelector('.bwx-wallet'), nav=P.querySelector('.bwx > .bwx-nav'); if(wal) hero.appendChild(wal); if(nav) hero.appendChild(nav); P.querySelectorAll(':scope > .crumb').forEach(e=>e.remove());
      P.classList.add('bw-on'); requestAnimationFrame(()=>{ try{ bwHero($('bwhero')); }catch(e){} }); }catch(e){ console.error(e); } return r; }; }
document.head.insertAdjacentHTML('beforeend',`<style>
html body.pc-fhd #menuov #panel.bw-on{display:flex!important;flex-direction:column!important;overflow:hidden!important}
html body.pc-fhd #menuov #panel.bw-on > .bwx{flex:1 1 0;min-height:0;display:flex!important;flex-direction:column!important;gap:12px!important}
html body.pc-fhd #menuov #panel.bw-on .bwx-hero{position:relative!important;height:132px!important;min-height:0!important;flex:0 0 auto;border-radius:16px;overflow:hidden;margin:0!important}
html body.pc-fhd #menuov #panel.bw-on #bwhero{position:absolute;inset:0;width:100%!important;height:100%!important}
html body.pc-fhd #menuov #panel.bw-on .bwx-ht{position:absolute!important;left:18px;top:14px;margin:0!important;padding:0!important;background:none!important}
html body.pc-fhd #menuov #panel.bw-on .bwx-ht h2{margin:0;font:800 24px var(--display,system-ui);color:#fff;text-shadow:0 2px 8px #000c;display:block!important}
html body.pc-fhd #menuov #panel.bw-on .bwx-ht p{margin:2px 0 0;font-size:13px;color:#dfe9f5;text-shadow:0 1px 6px #000c}
html body.pc-fhd #menuov #panel.bw-on .bwx-hero .bwx-wallet{position:absolute!important;right:14px;top:14px;margin:0!important;display:flex;gap:8px;flex-wrap:nowrap}
html body.pc-fhd #menuov #panel.bw-on .bwx-hero .bwx-wallet > span{padding:5px 12px;border-radius:999px;background:#0b1626d9;border:1px solid #ffffff22;font:700 13px var(--display,system-ui);color:#fff;white-space:nowrap}
html body.pc-fhd #menuov #panel.bw-on .bwx-hero .bwx-nav{position:absolute!important;left:18px;bottom:12px;margin:0!important;display:flex!important;gap:6px;width:auto!important;background:none!important;border:0!important;padding:0!important}
html body.pc-fhd #menuov #panel.bw-on .bwx-hero .bwx-nav button{height:36px;padding:0 18px!important;border-radius:999px!important;background:#0b1626d9!important;border:1px solid #ffffff2a!important;color:#fff!important;font:800 13.5px var(--display,system-ui)!important;flex:0 0 auto!important}
html body.pc-fhd #menuov #panel.bw-on .bwx-hero .bwx-nav button[aria-selected="true"]{background:linear-gradient(180deg,#ffe08a,#f3b94e)!important;border-color:#ffe6a3!important;color:#2a1c05!important}
html body.pc-fhd #menuov #panel.bw-on .bwx-view{flex:1 1 0;min-height:0;overflow:auto;scrollbar-width:thin}
html body.pc-fhd #menuov #panel.bw-on .bwx-grid{display:grid!important;grid-template-columns:repeat(7,minmax(0,1fr))!important;gap:12px!important;min-height:100%;align-items:stretch!important} /* min-height, not height: a row grows with its cards and the view scrolls (2026-11-20: a fixed height squeezed the cards and hid the chests button under Counter specials) */
html body.pc-fhd #menuov #panel.bw-on .bwx-card{display:flex!important;flex-direction:column!important;margin:0!important;padding:14px!important}
html body.pc-fhd #menuov #panel.bw-on .bwx-cb{flex:1 1 auto;display:flex;flex-direction:column;justify-content:center}
html body.pc-fhd #menuov #panel.bw-on .bwx-cf{margin-top:auto}
</style>`);

// =====================================================================
// Oddities, round 2 (director, 2026-11-17: "takes up too much space... organize by rarity... don't give away what each
// oddity hides... add a small description... All oddities is way too large a screen"): one tier at a time (no wall of
// 100), smaller cards, an unfound oddity shows only "???" and its tier, and the details tell its little story.
// =====================================================================
{ const T=['Junk','Odd junk','Rare find','Treasure','Not found yet'], TC=['#b9c6c3','#8fd0ff','#c79bff','#ffd36a','#7a8a9a']; /* [2] rarity stays hidden until found */
  const BLURB=['Everyday flotsam. Somebody lost it, you found it.','Strange little things the water spits out now and then.','Rare finds: odd, old and worth a story.','Treasure. The water gives these up only once in a long while.','Oddities you have not found yet. Find one to learn its rarity, where it turns up and how often.'];
  const REW=e=>e.pet?'A new pet':e.hat?'A hat to wear':e.rod?'A new rod':e.lure?'Special lures':e.scales?'Scales':e.special?'Something special':e.buff?'A timed boost':'Coins';
  let tier=null, sel=null;
  const render=P=>{ const items=JUNK.map(J=>({id:J.id,name:J.name,t:S.junk[J.id]?J.t:4,e:J.e||{},q:J.q||'',n:S.junk[J.id]||0})), found=items.filter(x=>x.n).length;
    const tiers=T.map((nm,i)=>{ const l=items.filter(x=>x.t===i); return {i,nm,l,f:l.filter(x=>x.n).length}; });
    if(tier==null||!tiers[tier]) tier=(tiers.find(t=>t.f<t.l.length)||tiers[0]).i;
    const cur=tiers[tier]; if(!sel||!items.some(x=>x.id===sel&&x.t===tier)){ const f=cur.l.find(x=>x.n); sel=f?f.id:null; } const it=sel&&items.find(x=>x.id===sel);
    const pets=items.filter(x=>x.e.pet), hats=items.filter(x=>x.e.hat);
    P.innerHTML=`<h2 class="dl-dup" hidden>Oddities</h2><div class="od-pc od2">
      <aside class="od-side"><div class="od-tot"><b>${found}</b> of ${items.length} found<i class="od-bar"><b style="width:${found/items.length*100}%"></b></i></div><h5>Tiers</h5>
        ${tiers.map(t=>`<button type="button" class="fl-w${t.f===t.l.length?' done':''}" data-odt="${t.i}" aria-pressed="${t.i===tier}" style="--tc:${TC[t.i]}"><span class="fl-wn"><i class="od-dot"></i>${t.nm}</span><span class="fl-wc">${t.f} / ${t.l.length}</span><span class="fl-wb"><i style="width:${t.f/t.l.length*100}%"></i></span></button>`).join('')}
        <div class="od-hunt"><span>🐾 Pets hiding in oddities <b>${pets.filter(x=>x.n).length} / ${pets.length}</b></span><span>🎩 Hats hiding in oddities <b>${hats.filter(x=>x.n).length} / ${hats.length}</b></span></div>
        <p class="od-note">Oddities come up now and then while you fish, at every water. The rarer the tier, the rarer the find.</p></aside>
      <section class="od-main"><header class="od-th" style="--tc:${TC[tier]}"><b>${cur.nm}</b><span>${cur.f} of ${cur.l.length} found</span><em>${BLURB[tier]}</em></header>
        <div class="od-grid">${cur.l.map(x=>`<button type="button" class="od-card${x.n?'':' unk'}${x.id===sel?' sel':''}" data-odk="${x.id}" style="--tc:${TC[tier]}"><canvas width="160" height="90" data-junk="${x.id}" data-known="${x.n?1:0}"></canvas><b>${x.n?esc(x.name):'???'}</b>${x.n>1?`<small>×${x.n}</small>`:''}</button>`).join('')}</div></section>
      <aside class="od-right">${it?`<div class="tile od-det"><canvas width="360" height="200" data-junk="${it.id}" data-known="${it.n?1:0}"></canvas><div class="rar" style="color:${TC[tier]}">${T[tier]}</div><h3>${it.n?esc(it.name):'Not found yet'}</h3>
          <p class="od-q">${it.n?esc(it.q||BLURB[tier]):'Nobody knows what this one is until it turns up on your line. It can come up at any water.'}</p>
          ${it.n?`<div class="kv"><div><span>What it gave you</span> ${REW(it.e)}</div><div><span>Times found</span> ${it.n}</div>${oddKV(it.id)}</div>`:''}</div>`
        :`<div class="tile fl-pickhint"><b>Pick an oddity</b><span class="meta">Found ones tell their little story and what they gave you. Unfound ones stay a mystery until they turn up.</span></div>`}</aside></div>`;
    P.querySelectorAll('canvas[data-junk]').forEach(c=>{ const cx=c.getContext('2d'); cx.clearRect(0,0,c.width,c.height); if(c.dataset.known==='1') drawJunk(cx,c.width,c.height,c.dataset.junk,null); else mysteryThumb(cx,c.width,c.height,c.dataset.junk); });
    P.querySelectorAll('[data-odt]').forEach(b=>b.addEventListener('click',e=>{ e.stopPropagation(); tier=+b.dataset.odt; sel=null; render(P); }));
    P.querySelectorAll('[data-odk]').forEach(b=>b.addEventListener('click',e=>{ e.stopPropagation(); sel=b.dataset.odk===sel?null:b.dataset.odk; render(P); }));
    P.classList.add('od-on'); };
  const _rp=renderPanel; renderPanel=function(){ const P=$('panel'); if(S.tab==='oddities'&&FHD()){ P.classList.remove('od-on'); render(P); try{ menuSync(); if(P.dataset.tab035!=='oddities'){ P.dataset.tab035='oddities'; pageIn(P); } P.dataset.pg='oddities'; }catch(e){} return; } return _rp.apply(this,arguments); }; }
document.head.insertAdjacentHTML('beforeend',`<style>
html body.pc-fhd #menuov #panel.od-on > .od-pc.od2{flex:1 1 0;min-height:0}
html body.pc-fhd #menuov #panel .od2{grid-template-columns:250px minmax(0,1fr) 360px!important}
body.pc-fhd #panel .od2 .od-tot{display:flex;flex-direction:column;gap:6px;padding:4px 4px 10px;font-size:13px;color:#9fb2c8}
body.pc-fhd #panel .od2 .od-tot > b{font:800 26px var(--display,system-ui);color:#fff}
body.pc-fhd #panel .od2 .od-tot .od-bar{width:100%}
body.pc-fhd #panel .od2 .od-dot{display:inline-block;width:9px;height:9px;border-radius:50%;background:var(--tc);margin-right:8px}
body.pc-fhd #panel .od2 .fl-w[aria-pressed="true"]{box-shadow:inset 3px 0 0 var(--tc)!important;border-color:color-mix(in srgb,var(--tc) 50%,transparent)!important}
body.pc-fhd #panel .od2 .od-hunt{display:flex;flex-direction:column;gap:6px;margin-top:12px;padding:10px 12px;border-radius:12px;background:#0a1424;font-size:12.5px;color:#cfdcea}
body.pc-fhd #panel .od2 .od-hunt b{color:#ffd36a}
body.pc-fhd #panel .od2 .od-th{display:grid;grid-template-columns:auto auto 1fr;align-items:baseline;gap:12px;margin:0 0 12px;padding:10px 14px;border-radius:12px;background:#0e1a2c;border:1px solid #ffffff14;box-shadow:inset 3px 0 0 var(--tc)}
body.pc-fhd #panel .od2 .od-th b{font:800 18px var(--display,system-ui);color:#fff}
body.pc-fhd #panel .od2 .od-th span{font-size:13px;color:#9fb2c8}
body.pc-fhd #panel .od2 .od-th em{font-style:italic;font-size:12.5px;color:#8ea4b9;text-align:right}
body.pc-fhd #panel .od2 .od-grid{grid-template-columns:repeat(auto-fill,minmax(104px,1fr))!important;gap:8px!important}
body.pc-fhd #panel .od2 .od-card{padding:8px 6px!important;box-shadow:inset 0 3px 0 color-mix(in srgb,var(--tc) 70%,transparent)!important}
body.pc-fhd #panel .od2 .od-card canvas{max-height:46px!important}
body.pc-fhd #panel .od2 .od-card small{color:#7fe3c4!important}
</style>`);

// ---------- Bounties on full HD: the weekly goals live on the Tide Pass page here, so Bounties doesn't repeat them ----------
{ const _rp=renderPanel; renderPanel=function(){ const r=_rp.apply(this,arguments); try{ if(S.tab==='bounties'&&FHD()){ const wq=$('panel').querySelector(':scope > .tile.wq'); if(wq) wq.remove(); } }catch(e){} return r; }; }

// ---------- Feats: every category shows the boost it gives when finished; all rail rows the same height ----------
{ const deco=P=>{ try{ P.querySelectorAll('.fr-cat[data-cat]').forEach(b=>{ if(b.querySelector('.fr-bonus')) return; const t=featBonusText(b.dataset.cat); if(!t) return; b.insertAdjacentHTML('beforeend',`<small class="fr-bonus${featCatDone(b.dataset.cat)?' got':''}">${featCatDone(b.dataset.cat)?'✓ ':'Finish all: '}${esc(t)}</small>`); });
      const h=P.querySelector('.fr-main h3'), cur=P.querySelector('.fr-cat[aria-pressed="true"]'); if(h&&cur&&!P.querySelector('.fr-main .fr-goal')){ const t=featBonusText(cur.dataset.cat); if(t) h.insertAdjacentHTML('afterend',`<div class="fr-goal${featCatDone(cur.dataset.cat)?' got':''}">${featCatDone(cur.dataset.cat)?'Category complete: ':'Finish every feat here for '}<b>${esc(t)}</b></div>`); } }catch(e){} };
  const _rpf=renderPanel; renderPanel=function(){ const r=_rpf.apply(this,arguments); if(S.tab==='feats') deco($('panel')); return r; };
  document.addEventListener('click',e=>{ if(e.target.closest&&e.target.closest('#panel .fr-cat')) setTimeout(()=>deco($('panel')),0); },true); }
document.head.insertAdjacentHTML('beforeend',`<style>
html body.pc-fhd #menuov #panel .fr-cat{height:64px!important;box-sizing:border-box!important;align-content:center!important;row-gap:3px!important;padding:8px 12px!important}
html body.pc-fhd #menuov #panel .fr-cat .fr-bonus{grid-column:1 / -1;font:700 11px var(--display,system-ui);color:#8fa6bf;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
html body.pc-fhd #menuov #panel .fr-cat .fr-bonus.got{color:#7fe3c4}
html body.pc-fhd #menuov #panel .fr-goal{margin:0 0 12px;padding:10px 14px;border-radius:12px;background:#ffd36a14;border:1px solid #ffd36a44;color:#ffe9b0;font:700 13px var(--display,system-ui)}
html body.pc-fhd #menuov #panel .fr-goal b{color:#ffd36a}
html body.pc-fhd #menuov #panel .fr-goal.got{background:#7fe3c414;border-color:#7fe3c455;color:#bff3e2} html body.pc-fhd #menuov #panel .fr-goal.got b{color:#7fe3c4}
</style>`);
