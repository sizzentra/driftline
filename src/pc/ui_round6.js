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
