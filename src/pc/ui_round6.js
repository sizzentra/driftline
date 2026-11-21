// =====================================================================
// PC round 6 (director's list, docs/NEXT_ROUND6.md): steady countdowns and bars, no hint dot, a clear Market Rush icon.
// =====================================================================

// ---------- countdowns never move anything (items 4 and 7): every digit is the same width on PC, countdown badges and the
// strip's live chip have a fixed size, so only the words change ----------
document.head.insertAdjacentHTML('beforeend',`<style>
html body.pch-on{font-variant-numeric:tabular-nums}
html body.pch-on [data-evleft],html body.pch-on [data-wxl],html body.pch-on #shopleft{display:inline-block;min-width:7.2ch;text-align:center;white-space:nowrap;box-sizing:border-box}
html body.pch-on #pcscene > #goalchip{flex:0 0 auto!important;width:360px!important;min-width:360px!important;max-width:360px!important;overflow:hidden}
html body.pch-on #pcscene > #goalchip > *{white-space:nowrap;overflow:hidden;text-overflow:ellipsis;min-width:0}
html body.pch-on #pcscene > .pcs-wx{flex:0 0 auto!important;min-width:250px}
html body.pch-on #pcscene > .stat{flex:0 0 auto!important}
@media (max-width:1300px){ html body.pch-on #pcscene > #goalchip{width:280px!important;min-width:280px!important;max-width:280px!important} html body.pch-on #pcscene > .pcs-wx{min-width:200px} }
</style>`);

// ---------- with hints switched off (or nothing to say) the hint bubble disappears instead of leaving a dark dot (item 10) ----------
{ const h=$('hint'); if(h){ const sync=()=>{ const empty=!h.textContent.replace(/ /g,' ').trim(); if(h.classList.contains('dl-empty')!==empty) h.classList.toggle('dl-empty',empty); };
    new MutationObserver(sync).observe(h,{childList:true,characterData:true,subtree:true}); sync(); } }
document.head.insertAdjacentHTML('beforeend',`<style>html body.pch-on #hint.dl-empty{visibility:hidden!important}</style>`);

// ---------- Market Rush: a money bag Windows always draws clearly, instead of the small coin emoji (item 11) ----------
{ const m=SCHED.find(e=>e.id==='market'); if(m) m.icon='💰'; }

// ---------- Bait on the fishing screen (item 15): a chip in the strip under the header shows the bait you use and opens Bait ----------
{ let chip=null; const name=()=>{ const b=BAIT[S.baitSel]||BAIT.worm; return b.name+(S.baitSel!=='worm'?' · '+(S.bait[S.baitSel]||0):''); };
  const place=()=>{ const row=document.getElementById('pcscene'); if(!row) return; if(!chip){ chip=document.createElement('button'); chip.type='button'; chip.className='stat pcs-bait'; chip.innerHTML='<span class="lbl">Bait</span><b></b>';
      chip.addEventListener('click',e=>{ e.stopPropagation(); try{ startAudio(); }catch(er){} openMenu('bait'); }); }
    const wx=row.querySelector('.pcs-wx'); if(chip.parentElement!==row) (wx?wx.after(chip):row.appendChild(chip)); const t=name(), b=chip.querySelector('b'); if(b.textContent!==t) b.textContent=t; };
  setInterval(()=>{ try{ if(FHD()||document.body.classList.contains('pch-on')) place(); }catch(e){} },1000); setTimeout(place,900); }
document.head.insertAdjacentHTML('beforeend',`<style>
html body.pch-on #pcscene > .pcs-bait{display:grid!important;grid-template-rows:auto auto;align-content:center;flex:0 0 auto!important;max-width:220px;padding:0 12px!important;border-radius:10px;border:1px solid #7fe3c455;background:#0e1a2c;color:#e6f2ff;cursor:pointer;text-align:left}
html body.pch-on #pcscene > .pcs-bait .lbl{font:800 10px var(--display,system-ui);letter-spacing:.08em;text-transform:uppercase;color:#8ea4b9}
html body.pch-on #pcscene > .pcs-bait b{font:800 13px var(--display,system-ui);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
html body.pch-on #pcscene > .pcs-bait:hover{border-color:#7fe3c4;background:#123a3a}
html body:not(.pch-on) .pcs-bait{display:none!important}
</style>`);


