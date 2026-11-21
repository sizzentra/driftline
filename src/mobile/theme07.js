// =====================================================================
// Phones, round 7: ONE theme everywhere (director, 2026-11-18: "looking at the UI as a whole it doesn't seem to have a consistent
// theme on mobile"; picked direction "calm navy", mockup canvas row 2, Theme 1). Android + iPhone, upright and sideways.
// The rules, applied to every phone surface:
//  - one surface: every chip, button, tab and card sits on the same navy, the same thin light edge, the same corners
//    (chips/buttons 12 px, cards 14 px, big frames 16 px)
//  - one type pair: the display face (Bricolage) for everything you tap or scan (labels, values, tabs, buttons);
//    the reading face (Atkinson) only for sentences
//  - one icon style: thin line icons (the side panel's), never emoji, on the top bar, menu tools and page tabs
//  - color says what a thing does: teal label/icon = opens something; filled teal = an action (Rest, bait, Upgrade, Travel);
//    gold = where you are / what is chosen / coins ready
//  - side panel (sideways): compact (about 100 px instead of 150), still easy to hit
// Later files may not undo this: anything phone-look goes here or after it.
// =====================================================================
{
const ICO=(d)=>'url("data:image/svg+xml,'+encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">'+d+'</svg>')+'")';
const IC={
  search:'<circle cx="11" cy="11" r="6.5"/><path d="M20 20l-4.3-4.3"/>',
  settings:'<path d="M4 7h9M18 7h2M4 17h3M12 17h8"/><circle cx="15.5" cy="7" r="2.3"/><circle cx="9.5" cy="17" r="2.3"/>',
  cooler:'<rect x="3" y="8" width="18" height="12" rx="2"/><path d="M3 12.5h18M9 8V5h6v3"/>',
  map:'<path d="M3 6.5l6-2.5 6 2.5 6-2.5v13.5l-6 2.5-6-2.5-6 2.5z"/><path d="M9 4v13.5M15 6.5V20"/>',
  shop:'<path d="M14 3v10.5a4 4 0 1 1-8 0V12"/><path d="M14 3h3.5"/><path d="M6 12l-2 2"/>',
  rods:'<path d="M4 20L19 5"/><path d="M19 5c1.6 4 1.4 8.5-1 12"/><circle cx="18" cy="18" r="1.4"/><path d="M8 16l-2-2"/>',
  skills:'<path d="M12 3l2.6 5.6 6 .7-4.5 4.1 1.2 6L12 16.6l-5.3 2.8 1.2-6-4.5-4.1 6-.7z"/>',
  paths:'<circle cx="12" cy="12" r="9"/><path d="M15.5 8.5l-2 5-5 2 2-5z"/>',
  aquarium:'<rect x="3" y="4" width="18" height="16" rx="2.5"/><path d="M6.5 12c2-2.6 5.6-3 8-.6l2-1.6v4.4l-2-1.6c-2.4 2.4-6 2-8-.6z"/><path d="M3 17h18"/>',
  trophy:'<path d="M8 4h8v5a4 4 0 0 1-8 0z"/><path d="M8 6H5a3 3 0 0 0 3 4M16 6h3a3 3 0 0 1-3 4M12 13v4M8 20h8"/>',
  journal:'<path d="M5 5a2 2 0 0 1 2-2h12v15H7a2 2 0 0 0-2 2z"/><path d="M5 20a2 2 0 0 0 2 1h12v-3M9 7.5h6M9 11h4"/>',
  events:'<path d="M5 21V4M5 4h12l-2.2 4L17 12H5"/>',
  bounties:'<rect x="5" y="4" width="14" height="17" rx="2"/><path d="M9 4V2.5h6V4M9 10h6M9 14h6M9 18h3"/>',
  feats:'<circle cx="12" cy="15" r="5"/><path d="M8.5 3l3.5 7 3.5-7M12 13v4"/>',
  pass:'<path d="M2 15c3-3 5-3 8 0s5 3 8 0 3-2 4-2"/><path d="M2 9c3-3 5-3 8 0s5 3 8 0 3-2 4-2"/>',
  games:'<circle cx="12" cy="10" r="7"/><path d="M12 3v14M5 10h14M7 5l10 10M17 5L7 15M8.5 21l3.5-4 3.5 4"/>',
  home:'<path d="M3 11l9-7 9 7"/><path d="M5.5 9.5V20h13V9.5M10 20v-5.5h4V20"/>',
  style:'<path d="M8 4L3 7l2 4 3-1v10h8V10l3 1 2-4-5-3c-1 2-7 2-8 0z"/>',
  pets:'<circle cx="6" cy="11" r="1.8"/><circle cx="10" cy="6.5" r="1.8"/><circle cx="14" cy="6.5" r="1.8"/><circle cx="18" cy="11" r="1.8"/><path d="M8 17.5c0-3 2-5.5 4-5.5s4 2.5 4 5.5c0 2-2 2.5-4 2.5s-4-.5-4-2.5z"/>',
  stats:'<path d="M4 20V11M10 20V5M16 20v-7M2 20h20"/>',
  save:'<path d="M5 4h11l3 3v13H5z"/><path d="M8 4v5h7V4M8 20v-6h8v6"/>',
  dash:'<rect x="3" y="3" width="7.5" height="7.5" rx="2"/><rect x="13.5" y="3" width="7.5" height="7.5" rx="2"/><rect x="3" y="13.5" width="7.5" height="7.5" rx="2"/><rect x="13.5" y="13.5" width="7.5" height="7.5" rx="2"/>'
};
IC.waters=IC.map; IC.locs=IC.map;
const B=(s)=>s.split(',').map(x=>'html body.phone-app '+x.trim()+',html body.phone-land '+x.trim()).join(',');
const LAND=(s)=>s.split(',').map(x=>'html body.phone-land '+x.trim()).join(',');
const mask=(k)=>`-webkit-mask:${ICO(IC[k])} center/contain no-repeat;mask:${ICO(IC[k])} center/contain no-repeat`;
const subIcons=Object.keys(IC).map(k=>`${B(`#menuov .subbar .subp[data-sub="${k}"] .subi`)}{${mask(k)}}`).join('\n');

document.head.insertAdjacentHTML('beforeend',`<style id="th07">
:root{--th-surf:linear-gradient(180deg,#16263d,#111e31);--th-surf-flat:#13233a;--th-deep:#0c1626;--th-edge:#ffffff17;--th-edge2:#ffffff24;--th-ink:#7fe3c4;--th-dim:#9fb3c8;--th-gold:linear-gradient(180deg,#ffe08a,#f3b94e);--th-gold-b:#ffe6a3;--th-gold-ink:#2a1c05;--th-teal:linear-gradient(180deg,#1f8a86,#14666a);--th-teal-b:#7fe3c4;--th-r:12px}

/* ---------- top bar: every chip on the same navy; a chip you can tap has a teal label (and an arrow when there is room) ---------- */
${B('.hud > .stat,.hud > #goalchip,.hud > .hudbtns > button')}{background:var(--th-surf)!important;border:1px solid var(--th-edge)!important;border-radius:var(--th-r)!important;box-shadow:none!important;color:#fff!important}
${B('.hud > .stat .lbl,.hud > #goalchip .lbl,.hud > #goalchip > span:first-child')}{font-family:var(--display)!important;font-weight:700!important;letter-spacing:.6px!important;color:var(--th-dim)!important}
${B('.hud > .stat b,.hud > .stat .coin,.hud > #goalchip b')}{font-family:var(--display)!important;font-weight:800!important}
${B('.hud > .hud-link .lbl,.hud > button.stat .lbl,.hud > .hudx .lbl')}{color:var(--th-ink)!important}
${B('.hud > .hud-link:active,.hud > button.stat:active,.hud > .hudbtns > button:active')}{border-color:var(--th-ink)!important;background:#17304a!important}
/* coins ready in the aquarium: gold, the one chip that asks for attention */
${B('.hud > .st-aq.ready')}{background:var(--th-gold)!important;border-color:var(--th-gold-b)!important}
${B('.hud > .st-aq.ready *')}{color:var(--th-gold-ink)!important}
/* search and settings: line icons, never emoji */
${B('.hud > .hudbtns > #searchbtn > span,.hud > .hudbtns > #searchbtn .sbl')}{display:none!important}
${B('.hud > .hudbtns > #searchbtn,.hud > .hudbtns > #settingsbtn')}{font-size:0!important;color:var(--th-ink)!important;display:flex!important;align-items:center!important;justify-content:center!important;padding:0!important}
${B('.hud > .hudbtns > #searchbtn::before,.hud > .hudbtns > #settingsbtn::before')}{content:""!important;display:block;width:19px;height:19px;background:currentColor;font-size:0!important}
${B('.hud > .hudbtns > #searchbtn::before')}{${mask('search')}}
${B('.hud > .hudbtns > #settingsbtn::before')}{${mask('settings')}}
${B('.hud > .hudbtns > #settingsbtn.menu-on')}{background:var(--th-gold)!important;border-color:var(--th-gold-b)!important;color:var(--th-gold-ink)!important}
${LAND('.hud > .hudbtns > #searchbtn,.hud > .hudbtns > #settingsbtn')}{width:40px!important;min-width:40px!important;flex:0 0 40px!important}

/* ---------- on the water: actions are filled teal, notes are navy cards ---------- */
${B('#resttog')}{border-radius:var(--th-r)!important;font-family:var(--display)!important;font-weight:800!important;background:var(--th-teal)!important;border:1px solid var(--th-teal-b)!important;box-shadow:0 3px 10px #0007!important}
${B('#resttog[aria-pressed="true"]')}{background:var(--th-gold)!important;border-color:var(--th-gold-b)!important;color:var(--th-gold-ink)!important}

/* ---------- side panel, sideways: compact, same navy buttons, teal icons, the open one gold ---------- */
@media (orientation:landscape) and (max-height:560px){
  ${LAND('#catdock,#menuov .secbar')}{padding:5px!important;gap:5px!important;border-radius:16px!important;background:var(--th-deep)!important;border:1px solid var(--th-edge)!important;box-shadow:none!important}
  ${LAND('#catdock .cdb,#menuov .secbar .secb')}{width:112px!important;min-width:0!important;max-height:40px!important;min-height:30px!important;padding:0 7px!important;gap:6px!important;flex-direction:row!important;justify-content:flex-start!important;border-radius:var(--th-r)!important;background:var(--th-surf-flat)!important;border:1px solid var(--th-edge)!important;color:#e8f1fb!important;font:800 11.5px var(--display)!important;letter-spacing:0!important}
  ${LAND('#catdock .cdb svg,#menuov .secbar .secb svg')}{width:16px!important;height:16px!important;flex:0 0 16px;color:var(--th-ink)!important}
  ${LAND('#catdock .cdb .cdl,#menuov .secbar .secb span')}{white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
  ${LAND('#menuov .secbar .secb.on,#menuov .secbar .secb[aria-selected="true"]')}{background:var(--th-gold)!important;border-color:var(--th-gold-b)!important;color:var(--th-gold-ink)!important}
  ${LAND('#menuov .secbar .secb.on svg,#menuov .secbar .secb[aria-selected="true"] svg')}{color:var(--th-gold-ink)!important}
  html body.phone-land.dl-fish:not(.menu-open) #catdock .cdb[data-cd="fish"]{background:var(--th-gold)!important;border-color:var(--th-gold-b)!important;color:var(--th-gold-ink)!important}
  html body.phone-land.dl-fish:not(.menu-open) #catdock .cdb[data-cd="fish"] svg{color:var(--th-gold-ink)!important}
  ${LAND('#catdock .cdmini,#menuov .secbar .cdmini')}{width:112px!important;flex:0 0 26px!important;height:26px!important;border-radius:10px!important;background:transparent!important;border:1px solid var(--th-edge)!important;color:var(--th-dim)!important;font:700 10.5px var(--display)!important;padding:0 6px!important;white-space:nowrap!important;flex-direction:row!important;gap:5px!important}
  ${LAND('#catdock .cdmini svg,#menuov .secbar .cdmini svg')}{width:13px!important;height:13px!important}
  html body.phone-land.dock-mini #catdock .cdb,html body.phone-land.dock-mini #menuov .secbar .secb,html body.phone-land.dock-mini #catdock .cdmini,html body.phone-land.dock-mini #menuov .secbar .cdmini{width:40px!important;padding:0!important;justify-content:center!important}
  /* menu: Back is navigation, so it is a navy button with a teal arrow; it lines up with the side panel */
  ${LAND('#menuov .mo-back')}{width:112px!important;min-width:0!important;box-sizing:border-box;min-height:36px!important;padding:0 8px!important;border-radius:var(--th-r)!important;background:var(--th-surf-flat)!important;border:1px solid var(--th-edge)!important;color:#e8f1fb!important;font:800 12px var(--display)!important;justify-content:flex-start!important}
  html body.phone-land.dock-mini #menuov .mo-back{width:40px!important;padding:0!important;justify-content:center!important}
}
${B('#menuov .mo-back')}{background:var(--th-surf-flat)!important;border:1px solid var(--th-edge)!important;border-radius:var(--th-r)!important;color:#e8f1fb!important;box-shadow:none!important}
${B('#menuov .mo-back svg')}{color:var(--th-ink)!important}

/* ---------- menu tools (search, settings) and coins: same navy chips, line icons ---------- */
${B('#menuov .mo-tools .mo-tb')}{font-size:0!important;background:var(--th-surf)!important;border:1px solid var(--th-edge)!important;border-radius:var(--th-r)!important;box-shadow:none!important;color:var(--th-ink)!important;display:inline-flex!important;align-items:center;justify-content:center}
${B('#menuov .mo-tools .mo-tb::before')}{content:"";width:18px;height:18px;background:currentColor;display:block}
${B('#menuov .mo-tools .mo-tb[data-mo="search"]::before')}{${mask('search')}}
${B('#menuov .mo-tools .mo-tb[data-mo="settings"]::before')}{${mask('settings')}}
${B('#menuov .mo-tools .mo-tb.on')}{background:var(--th-gold)!important;border-color:var(--th-gold-b)!important;color:var(--th-gold-ink)!important}
${B('#menuov .mo-tools .mo-coin')}{background:var(--th-surf)!important;border:1px solid var(--th-edge)!important;border-radius:var(--th-r)!important;font-family:var(--display)!important;font-weight:800!important}

/* ---------- page tabs (Tackle / Rods / Skills / Paths...): line icons; upright they always fit the width, no sideways scroll ---------- */
${B('#menuov .subbar .subp')}{background:var(--th-surf-flat)!important;border:1px solid var(--th-edge)!important;border-radius:var(--th-r)!important;color:#e8f1fb!important;box-shadow:none!important;font-family:var(--display)!important;font-weight:800!important}
${B('#menuov .subbar .subp .subi')}{font-size:0!important;width:16px!important;height:16px!important;flex:0 0 16px;display:inline-block!important;background:var(--th-ink)}
${B('#menuov .subbar .subp.on')}{background:var(--th-gold)!important;border-color:var(--th-gold-b)!important;color:var(--th-gold-ink)!important}
${B('#menuov .subbar .subp.on .subi')}{background:var(--th-gold-ink)}
${subIcons}
html body.phone-app #menuov .subbar{display:grid!important;grid-auto-flow:column!important;grid-auto-columns:minmax(0,1fr)!important;gap:5px!important;overflow:visible!important;padding-right:0!important;mask-image:none!important;-webkit-mask-image:none!important}
html body.phone-app #menuov .subbar .subp{flex-direction:column!important;justify-content:center!important;align-items:center!important;gap:3px!important;min-width:0!important;width:auto!important;min-height:48px!important;padding:4px 2px!important;font-size:11px!important;line-height:1.1!important;white-space:nowrap;position:relative}
html body.phone-app #menuov .subbar .subp > span:not(.subi):not(.subdot){max-width:100%;overflow:hidden;text-overflow:ellipsis}
html body.phone-app #menuov .subbar .subp .subdot{position:absolute!important;top:3px!important;right:4px!important;margin:0!important}
html body.phone-app #menuov .subbar .subp .subi{width:18px!important;height:18px!important}

/* ---------- section tabs inside a page (Gear / Bait / Special lures...): one segmented bar, the shown one gold ---------- */
${B('#menuov .bwx-nav.sect-nav')}{background:var(--th-deep)!important;border:1px solid var(--th-edge)!important;border-radius:14px!important;padding:4px!important;gap:4px!important}
${B('#menuov .bwx-nav.sect-nav > button')}{border-radius:10px!important;font-family:var(--display)!important;font-weight:800!important;border:0!important;background:transparent!important;color:var(--th-dim)!important;box-shadow:none!important}
${B('#menuov .bwx-nav.sect-nav > [aria-selected="true"]')}{background:var(--th-gold)!important;color:var(--th-gold-ink)!important}

/* ---------- buttons and cards ---------- */
${B('#menuov .btn')}{border-radius:var(--th-r)!important;font-family:var(--display)!important;font-weight:800!important}
${B('#menuov .btn.alt:not(:disabled)')}{background:var(--th-surf-flat)!important;border-color:var(--th-edge2)!important;color:#e8f1fb!important}
${B('#menuov .btn:disabled:not(.mt-chosen)')}{background:#101b2c!important;border-color:var(--th-edge)!important;color:#7d8fa5!important;box-shadow:none!important}
${B('#menuov .tile')}{border-radius:14px!important;border:1px solid var(--th-edge)!important;background:var(--th-surf)!important}
${B('#menuov .tile.hunt-bar')}{border-color:var(--th-edge)!important}
${B('#menuov .chips button,#menuov .chips .chip')}{border-radius:10px!important;font-family:var(--display)!important;font-weight:700!important}
${B('#menuov #panel h2,#menuov #panel h3,#menuov #panel h4,#menuov #panel h5')}{font-family:var(--display)!important}
/* the Trophy Room keeps its wood (it is a room, not a card), framed like every other card */
${B('#menuov .tp-room')}{border-radius:14px!important;border:1px solid var(--th-edge2)!important}


/* ---------- bottom tab bar (upright): same navy, teal icons, the open one gold ---------- */
html body.phone-app #catdock .cdb svg{color:var(--th-ink)}
html body.phone-app #catdock .cdb{font-family:var(--display)!important}
</style>`);
}
// ---------- specificity fixes found in QC: the menu's side panel buttons had 28 px reserved on the right for the badge (labels were
// cut), and the gold Fishing button's label stayed light ----------
document.head.insertAdjacentHTML('beforeend',`<style>
@media (orientation:landscape) and (max-height:560px){
  html body.phone-land #menuov #tabs.secmode .secb,html body.phone-land #menuov #tabs .secbar .secb{padding:0 7px!important;gap:6px!important;font-size:11.5px!important;width:112px!important}
  html body.phone-land #menuov #tabs .secb .seci,html body.phone-land #menuov #tabs .secb .seci svg{width:16px!important;height:16px!important;flex:0 0 16px}
  html body.phone-land #menuov #tabs .secb .secl{white-space:nowrap;overflow:hidden;text-overflow:ellipsis;min-width:0}
  html body.phone-land #menuov #tabs .secb .secdot{position:absolute!important;top:-4px!important;right:-4px!important;left:auto!important;margin:0!important;z-index:3}
  html body.phone-land #menuov #tabs .secb{overflow:visible!important;z-index:1}
  html body.phone-land #catdock .cdb .cddot{position:absolute!important;top:-5px!important;right:-5px!important;left:auto!important;transform:none!important}
  html body.phone-land.dl-fish:not(.menu-open) #catdock .cdb[data-cd="fish"] *{color:#2a1c05!important}
  html body.phone-land #menuov #tabs .secb.on *,html body.phone-land #menuov #tabs .secb[aria-pressed="true"] *{color:#2a1c05!important}
}
</style>`);
// the bottom tab bar (upright) shows where you are, like the side panel does sideways: Fishing is gold while you are on the water
document.head.insertAdjacentHTML('beforeend',`<style>
html body.phone-app.dl-fish:not(.menu-open) #catdock .cdb[data-cd="fish"]{background:linear-gradient(180deg,#ffe08a,#f3b94e)!important;border-color:#ffe6a3!important;border-radius:12px!important}
html body.phone-app.dl-fish:not(.menu-open) #catdock .cdb[data-cd="fish"] *{color:#2a1c05!important}
</style>`);
// the goal / live-event line in the top bar always shows in full, like the water's name: on narrow phones it steps the font down
// a little until it fits (it changes every second during an event, so it only works when the text is actually too long)
{ const fitGoal=()=>{ const t=document.querySelector('#goalchip .gl-t'); if(!t||!MOB()) return; if(t.scrollWidth<=t.clientWidth+1&&!t.style.fontSize) return; t.style.removeProperty('font-size'); let fs=parseFloat(getComputedStyle(t).fontSize)||14, n=0; while(t.scrollWidth>t.clientWidth+1&&fs>10&&n++<10){ fs-=.5; t.style.setProperty('font-size',fs+'px','important'); } };
  const g=document.getElementById('goalchip'); if(g) new MutationObserver(()=>fitGoal()).observe(g,{childList:true,characterData:true,subtree:true}); addEventListener('resize',()=>setTimeout(fitGoal,80)); setTimeout(fitGoal,400); }
// collapsed side panel (director's screenshot 2026-11-18): in menus the full-width rule above outranked the collapsed one, so the
// buttons stayed 112 px wide inside the 40 px column and were cut off at the screen edge. Collapsed = icon-only squares, centred.
document.head.insertAdjacentHTML('beforeend',`<style>
@media (orientation:landscape) and (max-height:560px){
  html body.phone-land.dock-mini #menuov #tabs.secmode .secb,html body.phone-land.dock-mini #menuov #tabs .secbar .secb,
  html body.phone-land.dock-mini #catdock .cdb{width:44px!important;min-width:44px!important;padding:0!important;justify-content:center!important;gap:0!important}
  html body.phone-land.dock-mini #menuov #tabs .secb .secl,html body.phone-land.dock-mini #catdock .cdb .cdl{display:none!important}
  html body.phone-land.dock-mini #menuov #tabs .secb .seci,html body.phone-land.dock-mini #menuov #tabs .secb .seci svg,html body.phone-land.dock-mini #catdock .cdb svg{width:18px!important;height:18px!important;margin:0!important}
  html body.phone-land.dock-mini #menuov .mo-back,html body.phone-land.dock-mini #menuov #tabs .cdmini,html body.phone-land.dock-mini #catdock .cdmini{width:44px!important;min-width:44px!important;padding:0!important;justify-content:center!important}
  html body.phone-land.dock-mini #menuov .mo-back span:not(.mo-bi),html body.phone-land.dock-mini #menuov #tabs .cdmini .cdml,html body.phone-land.dock-mini #catdock .cdmini .cdml{display:none!important}
}
</style>`);
// ---------- round 7b (director: "it's hard to tell what's clickable; clicking bait is obvious, the whole top panel doesn't look
// clickable"; "the main scene UI appears in multiple places"):
//  - every top-bar chip that opens something now looks like a button: teal outline, a lighter raised surface, a small arrow after its
//    label and a pressed state. Plain information (coins, level) is flat text with no box, so the difference is obvious at a glance.
//  - upright, the chip drawn on the water no longer repeats the water's name (the top bar shows it); it keeps time and weather. ----------
{ const B=(s)=>s.split(',').map(x=>'html body.phone-app '+x.trim()+',html body.phone-land '+x.trim()).join(',');
document.head.insertAdjacentHTML('beforeend',`<style>
${B('.hud > .hud-link,.hud > button.stat,.hud > #goalchip,.hud > .hudbtns > button')}{background:linear-gradient(180deg,#1b3550,#13263b)!important;border:1px solid #7fe3c48c!important;box-shadow:inset 0 1px 0 #ffffff1f,0 2px 0 #06101c!important}
${B('.hud > .hud-link:active,.hud > button.stat:active,.hud > #goalchip:active,.hud > .hudbtns > button:active')}{transform:translateY(1px);box-shadow:inset 0 1px 0 #ffffff14!important;border-color:#7fe3c4!important}
${B('.hud > .hud-link .lbl,.hud > button.stat .lbl,.hud > #goalchip .gl-k')}{color:#7fe3c4!important}
${B('.hud > .hud-link .lbl::after,.hud > button.stat .lbl::after,.hud > #goalchip .gl-k::after')}{content:" ›";font-weight:900;letter-spacing:0}
${B('.hud > .st-aq.ready')}{border-color:#ffe6a3!important}
${B('.hud > .st-aq.ready .lbl')}{color:#5a3a08!important}
${B('.hud > .st-coins,.hud > .st-lvl')}{background:transparent!important;border-color:transparent!important;box-shadow:none!important}
</style>`); }
{ const _dsc=drawSceneChip; drawSceneChip=function(p,wx){ if(!document.body.classList.contains('phone-app')) return _dsc.apply(this,arguments);
    const tag=WX_TAG[wx.k]; const txt=tod(p)+' · '+wxName(wx.k)+(tag?' ('+tag+')':'')+' · '+mmss(wxLeft()); const col=wx.k==='Gilded'?'#ffc94d':tag?'#bfe8ff':'#e6efe8';
    g.textAlign='left'; g.font='700 11px "Bricolage Grotesque", system-ui'; const tw=g.measureText(txt).width; g.fillStyle='rgba(5,14,20,.62)'; rr(10,10,tw+18,22,11); g.fill(); g.fillStyle=col; g.fillText(txt,19,25); }; }
// upright the top-bar chips are narrow: the teal outline alone marks them (the arrow only shows sideways, where there is room)
document.head.insertAdjacentHTML('beforeend',`<style>
html body.phone-app .hud > .hud-link .lbl::after,html body.phone-app .hud > button.stat .lbl::after,html body.phone-app .hud > #goalchip .gl-k::after{content:none!important}
</style>`);
document.head.insertAdjacentHTML('beforeend',`<style>
html body.phone-app .hud > .stat .lbl,html body.phone-app .hud > #goalchip .gl-k{letter-spacing:.15px!important}
</style>`);
document.head.insertAdjacentHTML('beforeend',`<style>
@media (orientation:landscape) and (max-height:560px) and (max-width:760px){
  html body.phone-land .hud > .hud-link .lbl::after,html body.phone-land .hud > button.stat .lbl::after,html body.phone-land .hud > #goalchip .gl-k::after{content:none!important}
  html body.phone-land .hud > .stat .lbl,html body.phone-land .hud > #goalchip .gl-k{letter-spacing:.15px!important}
}
</style>`);
// ---------- round 7c (director: "the top panel still has buttons that don't look clickable; not sure why they don't match the way
// Bait looks"): every top-bar chip you can tap now uses exactly the Bait button's look (the same teal fill, mint edge, white text and
// shadow), so "teal button = tap me" means the same thing on the water and in the top bar. Coins and level stay plain text; the
// Aquarium chip turns gold when coins are ready to collect. ----------
document.head.insertAdjacentHTML('beforeend',`<style>
html body.phone-app .hud > .hud-link,html body.phone-app .hud > button.stat,html body.phone-app .hud > #goalchip,html body.phone-app .hud > .hudbtns > button,
html body.phone-land .hud > .hud-link,html body.phone-land .hud > button.stat,html body.phone-land .hud > #goalchip,html body.phone-land .hud > .hudbtns > button{background:linear-gradient(180deg,#1f8a86,#14666a)!important;border:1px solid #7fe3c4!important;box-shadow:0 3px 10px #0007!important;color:#fff!important}
html body.phone-app .hud > .hud-link .lbl,html body.phone-app .hud > button.stat .lbl,html body.phone-app .hud > #goalchip .gl-k,
html body.phone-land .hud > .hud-link .lbl,html body.phone-land .hud > button.stat .lbl,html body.phone-land .hud > #goalchip .gl-k{color:#c8fff0!important}
html body.phone-app .hud > .hud-link b,html body.phone-app .hud > button.stat b,html body.phone-app .hud > #goalchip .gl-t,
html body.phone-land .hud > .hud-link b,html body.phone-land .hud > button.stat b,html body.phone-land .hud > #goalchip .gl-t{color:#fff!important}
html body.phone-app .hud > .hudbtns > button,html body.phone-land .hud > .hudbtns > button{color:#fff!important}
html body.phone-app .hud > .hud-link:active,html body.phone-app .hud > button.stat:active,html body.phone-app .hud > #goalchip:active,html body.phone-app .hud > .hudbtns > button:active,
html body.phone-land .hud > .hud-link:active,html body.phone-land .hud > button.stat:active,html body.phone-land .hud > #goalchip:active,html body.phone-land .hud > .hudbtns > button:active{filter:brightness(1.12);transform:translateY(1px)}
html body.phone-app .hud > .st-aq.ready,html body.phone-land .hud > .st-aq.ready{background:linear-gradient(180deg,#ffe08a,#f3b94e)!important;border-color:#ffe6a3!important}
html body.phone-app .hud > .st-aq.ready *,html body.phone-land .hud > .st-aq.ready *{color:#2a1c05!important}
</style>`);
// a full cooler still warns: its count (set to the danger color inline by e_ui.js) shows in warm gold, readable on the teal button
document.head.insertAdjacentHTML('beforeend',`<style>
html body.phone-app .hud #coolerct[style*="danger"],html body.phone-land .hud #coolerct[style*="danger"]{color:#ffd36a!important;text-shadow:0 0 6px #ffb34766}
</style>`);
// ---------- round 7g (director, 2026-11-18, screenshots: "the side panel needs to remain in the same place when entering full screen on
// mobile, it shifts slightly"). Sideways, opening a menu moved the side panel 26 px left and 8 px up and changed its frame (the menu used
// a 16 px screen edge, a 136 px column and a 36 px top row; the water uses 8 px, a 124 px frame and starts the panel at the same height
// as the water). The menu now uses the water's exact geometry: the same frame, padding, gaps and button positions, with Back in the
// header row directly above the panel. Collapsed (icon-only) panels match too. ----------
document.head.insertAdjacentHTML('beforeend',`<style>
@media (orientation:landscape) and (max-height:560px){
  html body.phone-land #menuov .mo-in{grid-template-columns:auto minmax(0,1fr) 124px!important;grid-template-rows:40px minmax(0,1fr)!important;padding-right:8px!important;row-gap:4px!important}
  html body.phone-land.dock-mini #menuov .mo-in{grid-template-columns:auto minmax(0,1fr) 56px!important}
  html body.phone-land #menuov #tabs .secbar,html body.phone-land #menuov .secbar{box-sizing:border-box!important;width:124px!important;margin:0 0 6px!important;padding:5px!important;gap:5px!important;border:1px solid #ffffff17!important;align-self:stretch!important;justify-content:flex-start!important}
  html body.phone-land.dock-mini #menuov #tabs .secbar,html body.phone-land.dock-mini #menuov .secbar{width:56px!important}
  html body.phone-land #menuov #tabs .secbar .secb{margin:0!important}
  html body.phone-land #menuov #tabs .secbar .cdmini{margin:2px 0 0!important} /* the water's collapse button sits 2 px lower too */
  html body.phone-land #menuov .mo-back{width:112px!important;margin:0 0 0 6px!important;align-self:center!important;min-height:36px!important;height:36px!important}
  html body.phone-land.dock-mini #menuov .mo-back{width:44px!important;margin:0 0 0 6px!important}
}
</style>`);
document.head.insertAdjacentHTML('beforeend',`<style>
@media (orientation:landscape) and (max-height:560px){
  /* collapsed: an older rule made the water's icon buttons 46 px (menus 44), so the collapsed panel moved 2 px; both are 44 now */
  html body.phone-land.dock-mini.dl-fish .wrap > #catdock .cdb,html body.phone-land.dock-mini .wrap > #catdock .cdb{width:44px!important;min-width:44px!important}
}
</style>`);
