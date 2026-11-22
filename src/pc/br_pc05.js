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
      /* a home in the home format (docs/HOME_STANDARD.md): the close-up of the home on top, its 6 features as tabs underneath */
      if(P.querySelector(':scope > .hf-mark')){ const sp=hfSpec(S.loc), L=LOCS[locIdx(S.loc)], c=P.querySelector('#homecv'), tile=c&&c.closest('.tile'), nav=P.querySelector(':scope > .sect-nav'); if(!tile||!nav) return r;
        const top=document.createElement('div'); top.className='dk-top'; const view=document.createElement('div'); view.className='dk-view'; c.style.cssText=''; view.appendChild(c);
        view.insertAdjacentHTML('beforeend',`<span class="dk-where">${esc(L.name)} · ${esc(sp.name)}</span>`);
        /* no side box and no "Parts of your …" heading (director, 2026-11-21): the home view and its features share the page side by side */
        top.append(view); top.classList.add("dk-top1");
        const col=document.createElement('section'); col.className='dk-col'; col.innerHTML='<div class="dk-body"></div>'; const body=col.querySelector('.dk-body'); body.appendChild(nav);
        P.querySelectorAll(':scope > [data-hel]').forEach(el=>body.appendChild(el)); body.querySelectorAll('.chips').forEach(row=>{ const on=row.querySelector('.hf-col[aria-pressed="true"]'), hd=row.previousElementSibling; if(on&&hd&&hd.tagName==='H5') hd.innerHTML='Color <span class="dk-cn">· '+esc(on.title)+'</span>'; }); /* the chosen colour's name in the heading, like the phones */
        top.append(col); /* the same layout as phones held sideways (director: same on PC and phones, PC just has more room): the home on the left, its features on the right */
        [...P.children].forEach(ch=>{ if(!ch.classList.contains('crumb')&&!ch.classList.contains('hf-mark')) ch.remove(); });
        P.prepend(top); P.classList.add('dk-on','dk-hfp'); requestAnimationFrame(()=>{ try{ paintHome(); }catch(e){} }); return r; }
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
html body.pc-fhd #menuov #panel.dk-on > .dk-top.dk-top1{grid-template-columns:minmax(0,1.15fr) minmax(440px,1fr);height:auto;flex:1 1 0;min-height:0} body.pc-fhd #panel .dk-top1 > .dk-col{min-height:0;overflow:auto;scrollbar-width:thin} /* format homes: the home view left, its features right (batch 5) */
body.pc-fhd #panel.dk-hfp .chips:has(.hf-col){display:flex;flex-wrap:wrap;gap:10px;max-width:460px} body.pc-fhd #panel.dk-hfp .hf-col{width:48px!important;height:48px!important;min-width:0!important;padding:0!important;border-radius:50%!important;font-size:0!important;color:transparent!important;justify-content:center;align-items:center;overflow:hidden} body.pc-fhd #panel.dk-hfp .hf-col .hm-sw{width:34px;height:34px;border-radius:50%;margin:0;box-shadow:inset 0 0 0 1px #ffffff33} body.pc-fhd #panel.dk-hfp .hf-col[aria-pressed="true"]{box-shadow:0 0 0 3px var(--gold,#ffd36a)} body.pc-fhd #panel .dk-cn{color:var(--gold,#ffd36a);text-transform:none;letter-spacing:0} /* colours look like the phones: round swatches, the name in the heading (director) */
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


// PC Reborn (2026-11-21): the sections, the Bait page and the Tackle name are shared with the phones (bm_ui04.js, cw_pages08.js); the
// old PC-only layout (Fishing: Travel + Bait, Equipment, Boardwalk as its own header button, the PC Bait page) was removed.


// PC Reborn (2026-11-21): Events, Tide Pass and Boardwalk use the shared page engine (strip, tabs, one body) like the phones; their
// PC-only full-HD layouts (Events on one screen, the forecast on Travel, the pass with weekly goals, the Boardwalk banner) were removed.

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
