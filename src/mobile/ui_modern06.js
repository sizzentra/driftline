// =====================================================================
// Phones, round 6 (director: "both phones get the modern PC look: teal = click me, gold = open now, the same navy panels and
// card style"). Same color decisions as PC, laid out for phones (Android + iPhone):
//  - anything you can tap that opens something is teal (header chips with a page behind them, Rest, Bait, buttons)
//  - what is open or chosen right now is gold (the page tab you are on, the chosen filter, the bottom tab already did this)
//  - plain information stays on navy (coins, level, the goal, cards)
// =====================================================================
document.head.insertAdjacentHTML('beforeend',`<style>
:root{--mt-teal:linear-gradient(180deg,#197a76,#14666a);--mt-teal-b:#7fe3c4;--mt-gold:linear-gradient(180deg,#ffe08a,#f3b94e);--mt-gold-b:#ffe6a3;--mt-navy:#0e1a2c}
/* header: chips that open a page */
body.phone-app .hud .hud-link,body.phone-app .hud button.stat,body.phone-app .hud .stat.opt,
body.phone-land .hud .hud-link,body.phone-land .hud button.stat,body.phone-land .hud .stat.opt{background:var(--mt-teal)!important;border-color:var(--mt-teal-b)!important;box-shadow:inset 0 1px 0 #ffffff40,0 2px 0 #0b3a3c!important;color:#fff!important}
body.phone-app .hud .hud-link .lbl,body.phone-app .hud button.stat .lbl,body.phone-app .hud .stat.opt .lbl,
body.phone-land .hud .hud-link .lbl,body.phone-land .hud button.stat .lbl,body.phone-land .hud .stat.opt .lbl{color:#c8fff0!important}
/* the aquarium chip turns gold when coins are ready to collect */
body.phone-app .hud .st-aq.ready,body.phone-land .hud .st-aq.ready{background:var(--mt-gold)!important;border-color:var(--mt-gold-b)!important;color:#2a1c05!important;box-shadow:inset 0 1px 0 #fff6,0 2px 0 #8a5b12!important}
body.phone-app .hud .st-aq.ready *,body.phone-land .hud .st-aq.ready *{color:#2a1c05!important}
body.phone-app .hud button.st-aq.ready .lbl,body.phone-land .hud button.st-aq.ready .lbl{color:#5a3a08!important}
/* settings and search */
body.phone-app .hudbtns > button,body.phone-land .hudbtns > button{background:var(--mt-teal)!important;border:1px solid var(--mt-teal-b)!important;box-shadow:inset 0 1px 0 #ffffff40,0 2px 0 #0b3a3c!important}
/* Rest and Bait on the fishing screen */
body.phone-app #resttog,body.phone-land #resttog{background:var(--mt-teal)!important;border:1px solid var(--mt-teal-b)!important;color:#fff!important;box-shadow:inset 0 1px 0 #ffffff40,0 2px 0 #0b3a3c,0 4px 10px #0007!important}
/* page tabs inside a menu: teal outline, the open one gold */
body.phone-app #menuov .subbar .subp,body.phone-land #menuov .subbar .subp{background:var(--mt-navy)!important;border-color:#7fe3c466!important;color:#dff7ef!important}
body.phone-app #menuov .subbar .subp.on,body.phone-land #menuov .subbar .subp.on{background:var(--mt-gold)!important;border-color:var(--mt-gold-b)!important;color:#2a1c05!important;box-shadow:inset 0 1px 0 #fff6,0 2px 0 #8a5b12!important}
/* section tabs inside a page (Your rod / Rod rack / Attachments and the like): the one shown is gold */
body.phone-app #menuov .bwx-nav > [aria-selected="true"],body.phone-land #menuov .bwx-nav > [aria-selected="true"]{background:var(--mt-gold)!important;border-color:var(--mt-gold-b)!important;color:#2a1c05!important;box-shadow:inset 0 1px 0 #fff6,0 2px 0 #8a5b12!important}
body.phone-app #menuov .mo-tools .mo-tb,body.phone-land #menuov .mo-tools .mo-tb{background:var(--mt-teal)!important;border:1px solid var(--mt-teal-b)!important}
/* buttons: teal; the quieter kind stays navy with a teal edge */
body.phone-app #menuov .btn:not(.alt):not(:disabled),body.phone-land #menuov .btn:not(.alt):not(:disabled){background:var(--mt-teal)!important;border-color:var(--mt-teal-b)!important;color:#fff!important;box-shadow:inset 0 1px 0 #ffffff40,0 2px 0 #0b3a3c!important}
body.phone-app #menuov .btn.alt:not(:disabled),body.phone-land #menuov .btn.alt:not(:disabled){background:var(--mt-navy)!important;border-color:#7fe3c466!important;color:#dff7ef!important}
/* chosen filters and toggles: gold */
body.phone-app #menuov .chips [aria-pressed="true"],body.phone-app #menuov .chips .on,body.phone-land #menuov .chips [aria-pressed="true"],body.phone-land #menuov .chips .on{background:var(--mt-gold)!important;border-color:var(--mt-gold-b)!important;color:#2a1c05!important}
/* cards: one navy card style */
body.phone-app #menuov .tile,body.phone-land #menuov .tile{background:linear-gradient(180deg,#132238,#0e1a2c)!important;border-radius:14px}
</style>`);

// ---------- Bait list on phones: the "Bait in use" row wraps instead of cutting its words (the groups, headings and folding are shared: u_tackle.js) ----------
document.head.insertAdjacentHTML('beforeend',`<style>
body.phone-app #panel .tk-cur.tk-slim,body.phone-land #panel .tk-cur.tk-slim{flex-wrap:wrap!important;row-gap:6px}
body.phone-app #panel .tk-cur.tk-slim > *,body.phone-land #panel .tk-cur.tk-slim > *{white-space:nowrap;overflow:visible!important;text-overflow:clip!important;max-width:none!important}
body.phone-app #panel .tk-cur.tk-slim > .btn,body.phone-land #panel .tk-cur.tk-slim > .btn{margin-left:0!important;flex:1 0 100%}
</style>`);

// ---------- critique fixes (round 6): bigger fish pictures in lists, card buttons lined up, the current water in gold ----------
document.head.insertAdjacentHTML('beforeend',`<style>
/* fish pictures in the Cooler and Aquarium lists: 72 px instead of 48, so the fish (and its shine) can be seen */
body.phone-app #panel .fishrow,body.phone-land #panel .fishrow{grid-template-columns:72px minmax(0,1fr) auto!important}
body.phone-app #panel .fishrow > canvas,body.phone-land #panel .fishrow > canvas{width:72px!important;height:36px!important}
/* every card's button sits at the bottom, so the buttons in a row of cards line up (Skills, Tackle, Waters...) */
body.phone-app #panel .grid > .tile > .btn:last-child,body.phone-land #panel .grid > .tile > .btn:last-child,
body.phone-app #panel .grid > .tile > .row:last-child:has(> .btn),body.phone-land #panel .grid > .tile > .row:last-child:has(> .btn){margin-top:auto!important}
/* the water you are at: its button is gold ("you are here"), not a greyed-out button */
body.phone-app #panel .tile.loc.here .btn:disabled,body.phone-land #panel .tile.loc.here .btn:disabled{background:var(--mt-gold)!important;border-color:var(--mt-gold-b)!important;color:#2a1c05!important;opacity:1!important}
</style>`);
// Market Rush: the same clear money bag as PC (the small coin emoji read as a plain yellow dot)
{ const m=SCHED.find(e=>e.id==='market'); if(m) m.icon='💰'; }
document.head.insertAdjacentHTML('beforeend',`<style>
/* Feats: the count always sits under the name, and the bar and reward sit at the bottom, so cards side by side line up */
body.phone-app #panel .tile[data-cat] > .row.spread,body.phone-land #panel .tile[data-cat] > .row.spread{flex-direction:column!important;align-items:flex-start!important;gap:2px!important}
body.phone-app #panel .tile[data-cat] > .prog,body.phone-land #panel .tile[data-cat] > .prog{margin-top:auto!important}
</style>`);
document.head.insertAdjacentHTML('beforeend',`<style>
/* the settings button is gold while Settings, Stats or Save is open */
body.phone-app #menuov .mo-tools .mo-tb.on,body.phone-land #menuov .mo-tools .mo-tb.on{background:var(--mt-gold)!important;border-color:var(--mt-gold-b)!important;color:#2a1c05!important}
</style>`);
// Pets: your favourite's "★ Favourite" reads as chosen (gold), not as a greyed-out button
pageDone('pets',P=>{ if(MOB()) P.querySelectorAll('.tile .btn:disabled').forEach(b=>{ if(/^★\s*Favourite$/.test(b.textContent.trim())) b.classList.add('mt-chosen'); }); }); /* Clean Pages 2: a page step, not a renderPanel layer */
document.head.insertAdjacentHTML('beforeend',`<style>
body.phone-app #panel .btn.mt-chosen,body.phone-land #panel .btn.mt-chosen{background:var(--mt-gold)!important;border-color:var(--mt-gold-b)!important;color:#2a1c05!important;opacity:1!important}
</style>`);

// ---------- side panel when the phone is held sideways (director: "side panels need visual updates, proper symmetry expanded
// and condensed"): the same navy card and button style as the menu's side panel, buttons spread evenly, the open section gold,
// and the hide/show button always at the bottom (it was at the top on the water and at the bottom in menus) ----------
document.head.insertAdjacentHTML('beforeend',`<style>
@media (orientation:landscape) and (max-height:560px){
  body.phone-land #catdock{background:linear-gradient(180deg,#14243a,#0c1626)!important;border:1px solid #ffffff16!important;box-shadow:0 6px 18px #0008,inset 0 1px 0 #ffffff0d!important;border-radius:18px!important;padding:7px!important;gap:6px!important;justify-content:flex-start!important;align-items:stretch!important;box-sizing:border-box}
  body.phone-land #catdock .cdb{flex:1 1 0!important;max-height:46px!important;min-height:32px!important;height:auto!important;border-radius:12px!important;background:#0e1a2c!important;border:1px solid #7fe3c455!important;color:#dff7ef!important;box-shadow:none!important;position:relative;box-sizing:border-box;align-items:center!important}
  body.phone-land #catdock .cdb svg{color:#7fe3c4}
  body.phone-land.dl-fish:not(.menu-open) #catdock .cdb[data-cd="fish"]{background:var(--mt-gold)!important;border-color:var(--mt-gold-b)!important;color:#2a1c05!important}
  body.phone-land.dl-fish:not(.menu-open) #catdock .cdb[data-cd="fish"] svg{color:#2a1c05}
  body.phone-land #catdock .cdmini{order:99!important;flex:0 0 28px!important;height:28px!important;min-height:0!important;margin-top:2px!important;border-radius:10px!important;background:#0a1424!important;border:1px solid #ffffff1c!important;color:#9fb2c8!important;display:flex!important;align-items:center;justify-content:center;gap:6px;font-size:11px!important}
  body.phone-land.dock-mini #catdock .cdb{width:44px!important;justify-content:center!important;padding:0!important}
  body.phone-land.dock-mini #catdock .cddot{top:-5px!important;right:-5px!important;transform:none!important}
  body.phone-land.dock-mini #catdock .cdmini{width:44px!important}
}
</style>`);
document.head.insertAdjacentHTML('beforeend',`<style>
@media (orientation:landscape) and (max-height:560px){
  /* the menu's side panel: the same card as on the water, buttons spread evenly, hide/show at the bottom */
  body.phone-land #menuov .secbar{background:linear-gradient(180deg,#14243a,#0c1626)!important;border:1px solid #ffffff16!important;border-radius:18px!important;padding:7px!important;gap:6px!important;justify-content:flex-start!important;align-items:stretch!important;box-sizing:border-box;max-height:calc(100% - 6px)}
  body.phone-land #menuov .secbar .secb{flex:1 1 auto!important; /* content-based (was 1 1 0: when the rail was not stretched, as on the director’s iPhone, its natural height was just its padding and it cut off after Quests, 2026-11-19) */ max-height:46px!important;min-height:32px!important;height:auto!important;box-sizing:border-box}
  body.phone-land #menuov .secbar .cdmini{order:99!important;flex:0 0 28px!important;height:28px!important;min-height:0!important;margin-top:2px!important;border-radius:10px!important;background:#0a1424!important;border:1px solid #ffffff1c!important;color:#9fb2c8!important;display:flex!important;flex-direction:row!important;align-items:center!important;justify-content:center!important;gap:6px!important;font-size:11px!important;line-height:1!important;padding:0 8px!important}
  body.phone-land #menuov .secbar .cdmini svg{width:14px!important;height:14px!important;flex:0 0 auto}
  body.phone-land #catdock .cdb.live::before,body.phone-land #menuov .secbar .secb.live::before{top:5px!important;left:5px!important}
}
</style>`);

// ---------- the water's name in the header always shows in full: long names (Stonebrook River, Saltmarsh Coast) step the
// font down a little until they fit, instead of being cut with "…" ----------
{ const fit=()=>{ const b=document.getElementById('locname'); if(!b||!MOB()) return; b.style.removeProperty('font-size'); let fs=parseFloat(getComputedStyle(b).fontSize)||12.5, n=0; while(b.scrollWidth>b.clientWidth+1&&fs>9.5&&n++<8){ fs-=.5; b.style.setProperty('font-size',fs+'px','important'); } }; /* the phone style sets the size with !important */
  const b0=document.getElementById('locname'); if(b0) new MutationObserver(fit).observe(b0,{childList:true,characterData:true,subtree:true}); addEventListener('resize',()=>setTimeout(fit,60)); setTimeout(fit,300); setTimeout(fit,1500); }
