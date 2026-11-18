// =====================================================================
// Phones, round 6 (director: "both phones get the modern PC look: teal = click me, gold = open now, the same navy panels and
// card style"). Same colour decisions as PC, laid out for phones (Android + iPhone):
//  - anything you can tap that opens something is teal (header chips with a page behind them, Rest, Bait, buttons)
//  - what is open or chosen right now is gold (the page tab you are on, the chosen filter, the bottom tab already did this)
//  - plain information stays on navy (coins, level, the goal, cards)
// =====================================================================
document.head.insertAdjacentHTML('beforeend',`<style>
:root{--mt-teal:linear-gradient(180deg,#1f8a86,#14666a);--mt-teal-b:#7fe3c4;--mt-gold:linear-gradient(180deg,#ffe08a,#f3b94e);--mt-gold-b:#ffe6a3;--mt-navy:#0e1a2c}
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
body.phone-app #resttog,body.phone-app #baitqk,body.phone-land #resttog,body.phone-land #baitqk{background:var(--mt-teal)!important;border:1px solid var(--mt-teal-b)!important;color:#fff!important;box-shadow:inset 0 1px 0 #ffffff40,0 2px 0 #0b3a3c,0 4px 10px #0007!important}
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

// ---------- Bait list on phones: everyday bait and water baits each get a heading (the order itself is shared data), and the
// "Bait in use" row wraps instead of cutting its words ----------
{ const _rp=renderPanel; renderPanel=function(){ const r=_rp.apply(this,arguments); try{ if(!MOB()) return r; const P=$('panel'); const cards=[...P.querySelectorAll('.tk-row')]; if(!cards.length||P.querySelector('.mb-sec')) return r;
    const water=new Set(Object.values(BAIT).filter(b=>b.loc&&!b.junk).map(b=>b.name)), isW=c=>{ const b=c.querySelector('.tk-main b'); return !!b&&water.has(b.textContent.trim()); };
    const fw=cards.find(isW), fe=cards.find(c=>!isW(c)&&!!c.querySelector('.tk-main b')); if(!fw||!fe) return r;
    fe.insertAdjacentHTML('beforebegin','<h3 class="mb-sec">Everyday bait<span>Works at every water</span></h3>'); fw.insertAdjacentHTML('beforebegin','<h3 class="mb-sec">Water baits<span>Each one is best at its own water</span></h3>'); }catch(e){ console.error(e); } return r; }; }
document.head.insertAdjacentHTML('beforeend',`<style>
body.phone-app #panel .mb-sec,body.phone-land #panel .mb-sec{display:flex;flex-wrap:wrap;align-items:baseline;gap:4px 8px;margin:14px 2px 6px;font:800 15px var(--display,system-ui);color:#fff}
body.phone-app #panel .mb-sec span,body.phone-land #panel .mb-sec span{font:600 12px system-ui;color:#9fb2c8}
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
{ const _rp=renderPanel; renderPanel=function(){ const r=_rp.apply(this,arguments); try{ if(MOB()&&S.tab==='pets') $('panel').querySelectorAll('.tile .btn:disabled').forEach(b=>{ if(/^★\s*Favourite$/.test(b.textContent.trim())) b.classList.add('mt-chosen'); }); }catch(e){} return r; }; }
document.head.insertAdjacentHTML('beforeend',`<style>
body.phone-app #panel .btn.mt-chosen,body.phone-land #panel .btn.mt-chosen{background:var(--mt-gold)!important;border-color:var(--mt-gold-b)!important;color:#2a1c05!important;opacity:1!important}
</style>`);
