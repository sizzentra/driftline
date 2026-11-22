// =====================================================================
// PC: the Fish Log as one organized screen (director, 2026-11-17: "hunt on pc doesn't look good, we need a better fish log setup
// for pc"). Three columns: WATERS (every water with its progress, the Show filter under it) | the water's fish grouped by rarity |
// HUNTS + the picked fish's records. The hunt button on each card becomes a small target in its corner, so the grid stays calm.
// Built from the page the other platforms use (same buttons, same actions), so phones and tablets are unchanged.
// =====================================================================
{ const _rj=renderJournal;
  renderJournal=function(P){ _rj(P); if(!document.body.classList.contains('pch-on')||innerWidth<1100) return; /* the three columns need room */ try{
    P.style.zoom=''; const kids=[...P.children]; const pick=f=>kids.find(f);
    const crumb=pick(c=>c.classList.contains('crumb')), head=pick(c=>c.classList.contains('dl-head')),
      water=pick(c=>c.classList.contains('chips')&&c.querySelector('[data-act="encloc"]')), show=pick(c=>c.classList.contains('logshow')), sec=pick(c=>c.classList.contains('jsec'));
    if(!water) return;
    const top=document.createElement('div'); top.className='fl-top';
    const sum=head&&head.querySelector('p.sub'); const ts=totalStars(), rk=anglerRank();
    top.innerHTML=`<div class="fl-rank" title="Catch a species 3, 10, 30 and 100 times for its stars. Each star adds +10% to that fish’s value. Every 8 stars is a new rank, with coins and a free Mystery Crate."><span class="rar">Angler rank ${rk}</span><b>${ts} ★</b><span class="meta">+${rk}% to every sale</span><span class="fl-rbar"><i style="width:${ts%8/8*100}%"></i></span><span class="meta">${ts%8} / 8 to rank ${rk+1}</span></div><div class="fl-sum">${Object.keys(S.journal).length} of ${SP.length} species found · ${fmt(S.stats.caught)} fish landed · ${S.stats.shiny} shiny · ${fmt(S.stats.earned)} coins earned</div>`;
    const wrap=document.createElement('div'); wrap.className='fl-pc';
    // left: waters
    const side=document.createElement('aside'); side.className='fl-side';
    side.insertAdjacentHTML('beforeend','<h5>Waters</h5>'); const wl=document.createElement('div'); wl.className='fl-waters';
    [...water.querySelectorAll('[data-act="encloc"]')].forEach(b=>{ const m=b.textContent.trim().match(/^(.*?)\s+(\d+)\/(\d+)$/); if(m){ const k=b.dataset.k, here=k===S.loc, done=+m[2]>=+m[3];
        const locked=k!=='junk'&&!S.unlocked.includes(k);
        b.className='fl-w'+(done?' done':'')+(locked?' locked':''); b.innerHTML=`<span class="fl-wn">${esc(m[1])}${here?' <em title="You are fishing here">●</em>':''}</span><span class="fl-wc">${locked?'🔒':m[2]+' / '+m[3]}</span><span class="fl-wb"><i style="width:${+m[2]/+m[3]*100}%"></i></span>`; }
      wl.appendChild(b); });
    side.appendChild(wl);
    if(show){ side.insertAdjacentHTML('beforeend','<h5>Show</h5>'); show.classList.add('fl-show'); side.appendChild(show); }
    if(sec){ sec.classList.add('fl-sec'); side.appendChild(sec); }
    // middle: the fish
    const main=document.createElement('section'); main.className='fl-main';
    const grid=P.querySelector('.jgrid'); const L=encLoc!=='junk'?LOCS[locIdx(encLoc)]:null;
    const mh=document.createElement('div'); mh.className='fl-mh';
    if(L){ const got=caughtAt(L.id), n=spAt(L.id).length; mh.innerHTML=`<div><h3>${esc(L.name)}</h3><span class="meta">${got} / ${n} found${S.setDone[L.id]?' · complete':` · find them all for <span class="coin">${fmt(L.bonus)}</span>`}${S.unlocked.includes(L.id)?'':' · water locked'}</span></div><span class="fl-mbar"><i style="width:${got/n*100}%"></i></span><div class="fl-leg">${[...new Set(spAt(L.id).map(x=>x.r))].sort((a,b)=>a-b).map(r=>{ const all=spAt(L.id).filter(x=>x.r===r), g=all.filter(x=>S.journal[x.id]).length; return `<span style="--rc:${RAR[r].c}"><i></i>${RAR[r].k} <b>${g}/${all.length}</b></span>`; }).join('')}</div>`; }
    else mh.innerHTML=`<div><h3>Oddities</h3><span class="meta">Things humanity dropped in the water. Some pay, some boost your fishing, some come with a pet or a hat.</span></div>`;
    main.appendChild(mh);
    const emp=P.querySelector('.empty'); if(emp) main.appendChild(emp);
    if(grid){ main.appendChild(grid);
      if(L){ // rarity headings: the grid is sorted by rarity already
        let last=-1; [...grid.children].forEach(cell=>{ const c=cell.matches('.jcard')?cell:cell.querySelector('.jcard'); const s=c&&SPI[c.dataset.k]; if(!s) return;
          if(s.r!==last){ last=s.r; cell.classList.add('fl-first'); cell.dataset.rk=RAR[s.r].k; }
          cell.style.setProperty('--rc',RAR[s.r].c);
          // the rarity shows as the color stripe and the legend: the card keeps day/night and the bait hint on one short line
          const sm=[...c.querySelectorAll('small')], first=sm.find(x=>!x.classList.contains('loghint')&&!x.classList.contains('sh')&&x.textContent.indexOf(RAR[s.r].k)===0);
          if(first){ const rest=first.textContent.slice(RAR[s.r].k.length).replace(/^\s*·\s*/,''); const hint=c.querySelector('small.loghint');
            if(hint){ if(rest) hint.insertAdjacentText('afterbegin',(rest==='day'?'☀':rest==='night'?'☾':rest)+' '); first.remove(); } else if(rest) first.textContent=rest; else first.remove(); }
          c.title=(S.journal[s.id]?s.name:'Not caught yet')+' · '+RAR[s.r].k+(s.time!=='any'?' · '+(s.time==='night'?'night only':'day only'):''); }); } }
    // right: hunts + the picked fish
    const right=document.createElement('aside'); right.className='fl-right';
    const bar=P.querySelector('.hunt-bar'); if(bar) right.appendChild(bar);
    const det=P.querySelector('.tile.detail');
    if(det) right.appendChild(det);
    else if(L) right.insertAdjacentHTML('beforeend',`<div class="tile fl-pickhint"><b>Click a fish</b><span class="meta">See its records, size range, when it bites and your chance to catch it here. Fish you are missing can be hunted with the 🎯 in a card’s corner.</span></div>`);
    if(L) wrap.append(side,main,right); else { wrap.classList.add('fl-wide'); wrap.append(side,main); }
    // remove what is left of the old layout and put the new one in
    kids.forEach(c=>{ if(c!==crumb&&c.parentNode===P) c.remove(); });
    const ttl=document.createElement('h2'); ttl.className='dl-dup'; ttl.hidden=true; ttl.textContent='Fish Log'; // the page title the tidy pass looks for (else it would rename the fish card's heading)
    P.append(ttl,top,wrap); P.classList.add('fl-on');
    const selCard=grid&&grid.querySelector('.jcard.sel'); if(selCard){ const r=selCard.getBoundingClientRect(), m=main.getBoundingClientRect(); if(r.bottom>m.bottom||r.top<m.top) selCard.scrollIntoView({block:'nearest'}); }
  }catch(e){ console.error(e); } };
  PC_STEPS.pre.push(()=>{ const P=$('panel'); if(P) P.classList.remove('fl-on'); });}
document.head.insertAdjacentHTML('beforeend',`<style>
body.pch-on #menuov #panel.fl-on{overflow:hidden!important;display:flex!important;flex-direction:column!important} /* #menuov added 2026-11-19: "body #menuov #panel{display:block!important}" outranked this, so the columns were never fitted (1440x900 cut 133 px off with no scroll) */
body.pch-on #panel.fl-on > *{flex:0 0 auto}
body.pch-on #panel.fl-on > .fl-pc{flex:1 1 0;min-height:0}
body.pch-on #panel .fl-top{display:flex;align-items:center;gap:18px;margin:2px 0 10px;flex-wrap:wrap}
body.pch-on #panel .fl-rank{display:flex;align-items:center;gap:10px;padding:6px 12px;border-radius:12px;background:#0e1a2c;border:1px solid #ffffff14;cursor:help}
body.pch-on #panel .fl-rank .rar{color:var(--gold,#ffd36a)}
body.pch-on #panel .fl-rank b{font:800 15px var(--display,system-ui);color:#ffe6a8}
body.pch-on #panel .fl-rbar,body.pch-on #panel .fl-mbar,body.pch-on #panel .fl-wb{display:block;height:4px;border-radius:4px;background:#ffffff14;overflow:hidden}
body.pch-on #panel .fl-rbar{width:90px}
body.pch-on #panel .fl-rbar i,body.pch-on #panel .fl-mbar i,body.pch-on #panel .fl-wb i{display:block;height:100%;border-radius:4px;background:linear-gradient(90deg,#7fe3c4,#ffd36a)}
body.pch-on #panel .fl-sum{flex:1;min-width:0;font-size:12.5px;color:#9fb2c8;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
body.pch-on #panel .fl-pc{display:grid;grid-template-columns:210px minmax(0,1fr) 320px;gap:14px;min-height:0}
body.pch-on #panel .fl-pc.fl-wide{grid-template-columns:210px minmax(0,1fr)}
body.pch-on #menuov #panel .fl-wide .fl-main .jgrid{row-gap:5px!important;padding-top:0}
@media (min-width:1700px) and (min-height:1000px){ body.pch-on #menuov #panel .fl-pc:not(.fl-wide) .fl-main .jgrid{grid-template-columns:repeat(auto-fill,minmax(108px,1fr))!important;row-gap:14px!important} body.pch-on #panel .fl-pc:not(.fl-wide) .fl-main .jcard canvas{max-height:58px} body.pch-on #panel .fl-pc:not(.fl-wide) .fl-main .jcard b{font-size:13px!important} body.pch-on #panel .fl-pc:not(.fl-wide) .fl-main .jcard small{font-size:11px!important} body.pch-on #panel .fl-pc{grid-template-columns:230px minmax(0,1fr) 360px} body.pch-on #panel .fl-pc.fl-wide{grid-template-columns:230px minmax(0,1fr)} }
body.pch-on #panel .fl-wide .fl-main .jcard canvas{max-height:32px}
body.pch-on #panel .fl-pc > *{min-height:0;overflow:auto;scrollbar-width:thin;scrollbar-color:#ffffff22 transparent}
body.pch-on #panel .fl-pc h5{margin:4px 2px 6px;font:800 11.5px var(--display,system-ui);letter-spacing:.08em;text-transform:uppercase;color:#8fa6bf}
body.pch-on #panel .fl-side h5:not(:first-child){margin-top:14px}
body.pch-on #panel .fl-waters{display:flex;flex-direction:column;gap:3px}
body.pch-on #panel .fl-w{display:grid;grid-template-columns:minmax(0,1fr) auto;row-gap:4px;column-gap:8px;align-items:center;text-align:left;padding:7px 10px 8px;border-radius:10px;border:1px solid transparent;background:#ffffff06;color:#dbe6f2;cursor:pointer;font:700 13px var(--display,system-ui)}
body.pch-on #panel .fl-w:hover{background:#ffffff10;border-color:#ffffff1c}
body.pch-on #panel .fl-w[aria-pressed="true"]{background:#1d3150;border-color:#7fb8ff66;color:#fff;box-shadow:inset 3px 0 0 #7fb8ff}
body.pch-on #panel .fl-w .fl-wn{white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
body.pch-on #panel .fl-w .fl-wn em{font-style:normal;color:#7fe3c4;font-size:10px;vertical-align:1px}
body.pch-on #panel .fl-w .fl-wc{font-size:11.5px;color:#9fb2c8;font-variant-numeric:tabular-nums}
body.pch-on #panel .fl-w .fl-wb{grid-column:1 / -1}
body.pch-on #panel .fl-w.done .fl-wc{color:#7fe3c4}
body.pch-on #panel .fl-w.locked{opacity:.55}
body.pch-on #panel .fl-show{display:flex!important;flex-direction:column;flex-wrap:nowrap!important;gap:3px;margin:0!important}
body.pch-on #panel .fl-show .chipb{justify-content:flex-start;text-align:left;width:100%;border-radius:10px}
body.pch-on #panel .fl-sec{margin-top:14px;font-size:11.5px;line-height:1.5}
body.pch-on #panel .fl-main{display:flex;flex-direction:column;gap:8px;padding-right:4px}
body.pch-on #panel .fl-mh{display:grid;grid-template-columns:minmax(0,1fr);gap:6px;position:sticky;top:0;z-index:3;background:linear-gradient(#0b1626 85%,#0b162600);padding-bottom:8px}
body.pch-on #panel .fl-mh h3{display:inline-block;margin:0 12px 0 0!important;vertical-align:-2px;font:800 19px var(--display,system-ui);color:#fff}
body.pch-on #menuov #panel .fl-main .jgrid{grid-template-columns:repeat(auto-fill,minmax(80px,1fr))!important;gap:11px 5px!important;margin:0!important}
body.pch-on #panel .fl-rh{grid-column:1 / -1;display:flex;align-items:center;gap:8px;margin:6px 2px 0;font:800 12px var(--display,system-ui);letter-spacing:.07em;text-transform:uppercase}
body.pch-on #panel .fl-rh:first-child{margin-top:0}
body.pch-on #panel .fl-rh i{width:8px;height:8px;border-radius:50%}
body.pch-on #panel .fl-rh .meta{letter-spacing:0;text-transform:none}
body.pch-on #panel .fl-main .jcell,body.pch-on #panel .fl-main .jgrid > .jcard{position:relative}
body.pch-on #panel .fl-main .jcard{padding:5px 4px 6px!important;gap:1px!important;min-height:0!important;box-shadow:inset 0 3px 0 color-mix(in srgb,var(--rc,#ffffff) 75%,transparent)}
body.pch-on #panel .fl-main .fl-first::after{content:attr(data-rk);position:absolute;left:5px;top:-7px;z-index:2;padding:0 5px;border-radius:5px;background:var(--rc);color:#08111d;font:900 8.5px/13px var(--display,system-ui);letter-spacing:.06em;text-transform:uppercase;pointer-events:none}
body.pch-on #panel .fl-main .jgrid{padding-top:7px}
body.pch-on #panel .fl-leg{display:flex;flex-wrap:wrap;gap:4px 14px;font-size:11.5px;color:#9fb2c8}
body.pch-on #panel .fl-leg span{display:inline-flex;align-items:center;gap:5px}
body.pch-on #panel .fl-leg i{width:9px;height:9px;border-radius:3px;background:var(--rc)}
body.pch-on #panel .fl-leg b{color:#e6eef7;font-weight:700}
body.pch-on #panel .fl-main .jcard canvas{width:100%!important;height:auto!important;aspect-ratio:2/1;max-height:38px;object-fit:contain}
body.pch-on #panel .fl-main .jcard b{font-size:12px!important;line-height:1.2;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:100%}
body.pch-on #panel .fl-main .jcard small{font-size:10.5px!important;line-height:1.25;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:100%}
body.pch-on #panel .fl-main .jcard.sel{outline:2px solid #ffd36a;outline-offset:-1px}
body.pch-on #panel .fl-main .jcard .hunt-tag{top:4px;left:4px;font-size:8.5px;padding:1px 5px}
/* the hunt toggle: a small target in the card's top right corner (shown on hover, always shown while hunting) */
body.pch-on #panel .fl-main .hunt-t{position:absolute;top:4px;right:4px;z-index:2;margin:0;width:26px;height:26px;min-height:0!important;padding:0;border-radius:50%;display:grid;place-items:center;font-size:0;background:#06101ccc;border:1px solid #ffffff26;opacity:0;transition:opacity .12s}
body.pch-on #panel .fl-main .hunt-t::before{content:"🎯";font-size:13px}
body.pch-on #panel .fl-main .jcell:hover .hunt-t,body.pch-on #panel .fl-main .hunt-t:focus-visible,body.pch-on #panel .fl-main .hunt-t.on{opacity:1}
body.pch-on #panel .fl-main .hunt-t.on{background:#ffb36a;border-color:#ffb36a}
body.pch-on #panel .fl-main .hunt-t:hover{border-color:#ffb36a;background:#2a1a0c}
body.pch-on #panel .fl-main .hunt-t.on:hover{background:#ffc78a}
body.pch-on #panel .fl-right{display:flex;flex-direction:column;gap:10px}
body.pch-on #panel .fl-right .hunt-bar{margin:0!important}
body.pch-on #panel .fl-right .hunt-bar .meta{font-size:12px;line-height:1.45}
body.pch-on #panel .fl-right .tile.detail{margin:0!important;display:flex!important;flex-direction:column!important;gap:6px;padding:12px!important}
body.pch-on #panel .fl-right .tile.detail canvas{width:100%!important;height:auto!important;max-width:none!important;aspect-ratio:2/1}
body.pch-on #panel .fl-right .tile.detail h2{font-size:19px;margin:2px 0}
body.pch-on #panel .fl-right .tile.detail .kv{grid-template-columns:1fr 1fr!important;gap:4px 10px!important;font-size:12px}
body.pch-on #panel .fl-right .tile.detail .sub{font-size:12px}
body.pch-on #panel .fl-pickhint{display:flex;flex-direction:column;gap:6px;padding:14px!important;border-style:dashed!important}
body.pch-on #panel .fl-pickhint b{font:800 14px var(--display,system-ui)}
</style>`);
document.head.insertAdjacentHTML('beforeend',`<style>
/* PC: Set sail again: the voyage card on the left, the milestones beside it in two columns (it was squeezed into two narrow
   grid cells, one word per line) */
body.pch-on #panel .grid:has(> .tile .voy-list){grid-template-columns:minmax(300px,380px) minmax(0,1fr)!important;align-items:start}
body.pch-on #panel .tile.voy-boons .voy-list{display:grid!important;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px} /* Boons only: the milestones tile sits in the narrow column, and two columns there squeezed each milestone to a word per line (2026-11-20) */
body.pch-on #panel .voy-stats{grid-template-columns:repeat(3,minmax(0,1fr))}
</style>`);
