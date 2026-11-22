// =====================================================================
// PC round 5 (director, 2026-11-18): Rods slots, Skills rows, Your home, Fish Log labels / Now / hunts.
// =====================================================================

// ---------- Rods: every attachment slot is one compact picker, so rods with 2 or 3 slots show all of them ----------
// (each slot used to list every attachment in a tall column, which pushed slots 2 and 3 out of sight)
PC_STEPS.post.push(()=>{ try{ if(S.tab!=='rods'||!FHD()) return; /* a PC page step (pages_pc.js runs them) */ const P=$('panel');
      P.querySelectorAll('.slotrow').forEach(row=>{ if(row.querySelector('select')) return; const chips=row.querySelector('.chips'); if(!chips) return; const btns=[...chips.querySelectorAll('[data-act="rodatt"]')];
        const sel=document.createElement('select'); sel.className='rd-sel'; sel.setAttribute('aria-label',(row.querySelector('b')||{}).textContent||'Attachment slot');
        btns.forEach(b=>{ const o=document.createElement('option'); o.value=b.dataset.k; o.textContent=b.textContent.replace(/\s+/g,' ').trim(); if(b.getAttribute('aria-pressed')==='true') o.selected=true; sel.appendChild(o); });
        sel.addEventListener('change',e=>{ e.stopPropagation(); const b=btns.find(x=>x.dataset.k===sel.value); if(b) b.click(); });
        chips.hidden=true; chips.style.display='none'; row.appendChild(sel); });
      const att=P.querySelector('.fhd-you'); if(att) att.classList.add('rd-slots'); }catch(e){ console.error(e); } });

// ---------- Your home: the page and its tab are called "Your home" on PC (every water has one, not only a dock) ----------
{ let lbl=null; const sync=()=>{ const b=menuTabBtn('home'); if(!b) return; if(lbl==null) lbl=b.dataset.label; const want=FHD()?'🏠 Your home':lbl; if(b.dataset.label!==want){ b.dataset.label=want; try{ menuSubKey=''; if(MENU_OPEN) menuSync(); }catch(e){} } };
  new MutationObserver(sync).observe(document.body,{attributes:true,attributeFilter:['class']}); setTimeout(sync,0); setTimeout(sync,900); }

// ---------- Fish Log: clear Day / Night tags (not ☀ ☾), a live "Now", and hunt slots with real information ----------
{ const tags=P=>{ P.querySelectorAll('.fl-main .jcard small.loghint').forEach(h=>{ const t=h.firstChild; if(t&&t.nodeType===3){ const m=/^\s*(☀|☾)\s*/.exec(t.textContent); if(m){ t.textContent=t.textContent.slice(m[0].length); h.insertAdjacentHTML('afterbegin',m[1]==='☀'?'<span class="lt day">Day</span>':'<span class="lt night">Night</span>'); } } }); };
  const biteText=s=>{ if(s.time==='any') return 'Bites day and night'; const ok=timeOk(s,phase()); return (s.time==='night'?'Bites at night':'Bites by day')+(ok?' · biting now':' · not now'); };
  const slots=P=>{ const bar=P.querySelector('.fl-right .hunt-bar'); if(!bar) return; const L=encLoc!=='junk'?LOCS[locIdx(encLoc)]:null; if(!L||!S.unlocked.includes(L.id)) return; const hs=huntsAt(L.id);
    const slot=i=>{ const id=hs[i], s=id&&SPI[id]; if(!s) return `<div class="hs-slot hs-empty"><span>Empty slot</span><em>Click 🎯 on any fish to hunt it</em></div>`;
      const j=S.journal[s.id], ch=huntChance(s), ok=timeOk(s,phase()), n=ch>0?Math.max(1,Math.round(1/ch)):0, B=BEH[s.beh];
      return `<button type="button" class="hs-slot on" data-huntsel="${s.id}" style="--rc:${RAR[s.r].c}"><canvas width="120" height="64" data-fish="${s.id}" data-known="${j?1:0}" data-sh="0"></canvas><span class="hs-tx"><b>${j?esc(s.name):'Unknown '+RAR[s.r].k.toLowerCase()+' fish'}</b><span class="hs-r">${RAR[s.r].k}${B?' · '+esc(B.n):''}</span><span class="hs-m">${esc(biteText(s))}</span><span class="hs-m">${ok&&n?'About 1 in '+fmt(n)+' catches here right now':'No chance until it bites'} · ${huntMult(s)}× while hunted</span><span class="hs-m ${j?(j.sh?'got':''):''}">${j?(j.sh?'✦ Shiny found: hunt runs until you stop it':'Shiny hunt: ends when you land it shiny'):'Missing: ends when you catch it'}</span></span></button>`; };
    bar.innerHTML=`<div class="hs-head"><span class="rar">Hunts</span><b>${hs.length} / ${HUNT_MAX}</b><span class="meta">at ${esc(L.name)}</span></div><div class="hs-slots">${[...Array(HUNT_MAX)].map((_,i)=>slot(i)).join('')}</div><div class="meta hs-help">Missing fish turn up ${HUNT_MULT}× as often while hunted, fish you have found ${HUNT_MULT_FOUND}× (a shiny hunt).</div>`;
    bar.querySelectorAll('canvas[data-fish]').forEach(c=>{ const cx=c.getContext('2d'); cx.clearRect(0,0,c.width,c.height); if(c.dataset.known==='1'){ try{ paintFish(c.parentElement); }catch(e){} } else mysteryThumb(cx,c.width,c.height,c.dataset.fish); });
    bar.querySelectorAll('[data-huntsel]').forEach(b=>b.onclick=e=>{ e.stopPropagation(); encSel=b.dataset.huntsel; renderPanel(); }); };
  const _rj=renderJournal; renderJournal=function(P){ _rj(P); try{ if(!P.classList.contains('fl-on')) return; tags(P); slots(P); }catch(e){ console.error(e); } };
  // "Now" follows the clock: when a fish of the shown water starts or stops biting (day turns to night, fog rolls in), the page
  // refreshes itself (one cheap check every 2 s, only while the Fish Log is open)
  let sig=''; setInterval(()=>{ try{ if(!MENU_OPEN||S.tab!=='journal'||!FHD()||encLoc==='junk') { sig=''; return; } const p=phase(), s2=encLoc+':'+spAt(encLoc).map(s=>timeOk(s,p)?1:0).join(''); if(sig&&s2!==sig) renderPanel(); sig=s2; }catch(e){} },2000); }

document.head.insertAdjacentHTML('beforeend',`<style>
/* Rods */
body.pc-fhd #panel .rd-slots .slotrow{display:grid!important;grid-template-columns:64px minmax(0,1fr);align-items:center;gap:10px;margin:6px 0!important}
body.pc-fhd #panel .rd-slots .slotrow > b{font:800 12px var(--display,system-ui);letter-spacing:.06em;text-transform:uppercase;color:#8fa6bf}
body.pc-fhd #panel .rd-sel{width:100%;height:38px;padding:0 10px;border-radius:10px;border:1px solid #7fe3c466;background:#0a1424;color:#e6f2ff;font:700 13px var(--display,system-ui);cursor:pointer}
body.pc-fhd #panel .rd-sel:hover{border-color:#7fe3c4}
/* Skills: one shared grid, so cards line up in rows */
html body.pc-fhd #menuov #panel .fhd-skills.sk-rows{display:grid!important;grid-template-columns:repeat(5,minmax(0,1fr))!important;grid-template-rows:auto repeat(var(--rows),auto)!important;column-gap:14px!important;row-gap:10px!important;align-items:stretch!important}
html body.pc-fhd #menuov #panel .fhd-skills.sk-rows > .fhd-col{display:grid!important;grid-row:1 / span calc(var(--rows) + 1)!important;grid-template-rows:subgrid!important;row-gap:10px!important;min-height:0}
html body.pc-fhd #menuov #panel .fhd-skills.sk-rows .fhd-body{display:contents!important}
html body.pc-fhd #menuov #panel .fhd-skills.sk-rows .fhd-body > .tile{display:flex!important;flex-direction:column!important;margin:0!important;height:auto!important}
html body.pc-fhd #menuov #panel .fhd-skills.sk-rows .fhd-body > .tile > .btn:last-child,html body.pc-fhd #menuov #panel .fhd-skills.sk-rows .fhd-body > .tile > :last-child{margin-top:auto!important}
/* Your home */
body.pc-fhd #panel .dk-col > .dk-pin{display:flex;flex-direction:column;gap:8px;padding:10px 16px 12px;border-bottom:1px solid #ffffff10;background:#0e1a2c;flex:0 0 auto}
body.pc-fhd #panel .dk-pin .dk-cozy{margin:0!important;display:grid!important;grid-template-columns:auto auto 120px minmax(0,1fr);align-items:center;gap:10px}
body.pc-fhd #panel .dk-pin .dk-cozy em{font-style:normal;font-size:12px;color:#cfb3c2;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
body.pc-fhd #panel .dk-pin .shoptools{margin:0!important}
body.pc-fhd #panel .hm-sw{display:inline-block;width:20px;height:20px;border-radius:6px;flex:0 0 auto;box-shadow:inset 0 0 0 1px #ffffff30}
body.pc-fhd #panel .hm-glow{border-radius:50%;background-color:#0a1424!important}
body.pc-fhd #panel .dk-hulls .chipb,body.pc-fhd #panel .dk-lights .chipb{flex-direction:row!important;align-items:center!important;gap:8px!important;min-height:40px;justify-content:flex-start!important}
/* Bait: auto-restock */
body.pc-fhd #panel .bt-auto{display:flex;align-items:center;gap:10px;width:100%;margin-top:4px;padding:8px 12px;border-radius:12px;border:1px solid #ffffff22;background:#0a1424;color:#dbe6f2;text-align:left;cursor:pointer;font:inherit}
body.pc-fhd #panel .bt-auto i{width:36px;height:20px;border-radius:999px;background:#33465e;position:relative;flex:0 0 auto}
body.pc-fhd #panel .bt-auto i::after{content:"";position:absolute;left:3px;top:3px;width:14px;height:14px;border-radius:50%;background:#cfdcea;transition:left .15s}
body.pc-fhd #panel .bt-auto[aria-pressed="true"]{border-color:#7fe3c4}
body.pc-fhd #panel .bt-auto[aria-pressed="true"] i{background:#1f8a86} body.pc-fhd #panel .bt-auto[aria-pressed="true"] i::after{left:19px;background:#fff}
body.pc-fhd #panel .bt-auto span{display:flex;flex-direction:column} body.pc-fhd #panel .bt-auto b{font:800 13px var(--display,system-ui)} body.pc-fhd #panel .bt-auto small{font-size:11.5px;color:#9fb2c8}
/* Fish Log */
body.pch-on #panel .fl-fl{width:auto!important;min-width:60px;white-space:nowrap;line-height:30px;overflow:visible}
body.pch-on #panel .jcard .lt{display:inline-block;margin-right:4px;padding:0 5px;border-radius:5px;font:800 9.5px/15px var(--display,system-ui);letter-spacing:.04em;text-transform:uppercase;vertical-align:1px}
body.pch-on #panel .jcard .lt.day{background:#ffd36a26;color:#ffd36a}
body.pch-on #panel .jcard .lt.night{background:#9fb4ff26;color:#b9c8ff}
body.pc-fhd #panel .hs-slot.on{grid-template-columns:96px minmax(0,1fr)!important;align-items:center;padding:8px 10px!important}
body.pc-fhd #panel .hs-slot.on canvas{width:96px;height:52px;border-radius:8px;background:#0a1424}
body.pc-fhd #panel .hs-tx{display:flex;flex-direction:column;gap:1px;min-width:0}
body.pc-fhd #panel .hs-tx b{font:800 13.5px var(--display,system-ui);color:#ffe2c4;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
body.pc-fhd #panel .hs-r{font:800 11.5px var(--display,system-ui);color:var(--rc)}
body.pc-fhd #panel .hs-m{font-size:11.5px;color:#d9c3a8;line-height:1.35}
body.pc-fhd #panel .hs-m.got{color:#7fe3c4}
body.pc-fhd #panel .hs-empty{display:flex!important;flex-direction:column;gap:2px}
</style>`);
document.head.insertAdjacentHTML('beforeend',`<style>
html body.pc-fhd #menuov #panel .fhd-skills.sk-rows .fhd-body > .tile{padding:8px 12px!important;gap:3px!important}
html body.pc-fhd #menuov #panel .fhd-skills.sk-rows .fhd-body > .tile .btn{padding:7px 10px!important;min-height:0!important;font-size:13px!important}
html body.pc-fhd #menuov #panel .fhd-skills.sk-rows,html body.pc-fhd #menuov #panel .fhd-skills.sk-rows > .fhd-col{row-gap:6px!important}
</style>`);
document.head.insertAdjacentHTML('beforeend',`<style>
body.pch-on #panel .fl-main .jcard small.loghint{white-space:normal!important;overflow:visible!important;text-overflow:clip!important;line-height:1.35!important;text-align:center}
</style>`);
