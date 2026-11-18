// PC header down to 800 px wide (director, 2026-11-17: "the bar is back on the bottom for header categories" — a half-width
// window or browser zoom made the page narrower than 900 px, and the old layout came back). Under 1000 px it goes compact:
// icon-only tabs, the counters as icon + number (names on hover), the gear without its label. Crossing the width limit also
// re-checks the layout straight away.
try{ [800,1000,1320].forEach(w=>matchMedia('(min-width:'+w+'px)').addEventListener('change',()=>dispatchEvent(new Event('resize')))); }catch(e){}
document.head.insertAdjacentHTML('beforeend',`<style>
@media (max-width:1000px){
  html body.pch-on{--pcTabs:max(200px,min(700px,calc(100vw - 32px - 190px - 330px - 56px)))}
  html body.pch-on #pchead .pch-stats{gap:4px}
  html body.pch-on #pchead .pch-stats > .stat{padding:4px 8px!important;flex-direction:row!important;align-items:center;gap:5px}
  html body.pch-on #pchead .pch-stats > .stat .lbl{display:none!important}
  html body.pch-on #pchead .pch-stats > .st-cool::before{content:"🧊";font-size:13px}
  html body.pch-on #pchead .pch-stats > .st-aq::before{content:"🐠";font-size:13px}
  html body.pch-on #pchead .pch-stats > .st-log::before{content:"📖";font-size:13px}
  html body.pch-on #pchead [data-pch="settings"]::after,html body.pch-on #menuov [data-mo="settings"]::after{content:none!important;display:none!important}
  html body.pch-on #pchead [data-pch="settings"],html body.pch-on #menuov [data-mo="settings"]{width:42px!important;min-width:42px!important;padding:0!important;justify-content:center}
}
/* patch notes reader: a short update spreads across the card instead of sitting in one narrow box */
body.pch-on #evin .pnr-grid{grid-template-columns:repeat(auto-fit,minmax(270px,1fr))!important}
body.pch-on #evin .pnr-grid .pn-sec:only-child ul{columns:2 300px;column-gap:28px}
</style>`);
document.head.insertAdjacentHTML('beforeend',`<style>
@media (max-width:1000px){
  html body.pch-on{--pcTabs:max(176px,min(700px,calc(100vw - 32px - 190px - 400px - 56px)))}
  html body.pch-on #pchead .pch-tools{gap:4px!important}
  html body.pch-on #pchead .pch-stats > .stat{padding:4px 6px!important;gap:3px}
  html body.pch-on #pchead .pch-stats > .stat b{font-size:12.5px!important}
  html body.pch-on #pchead .pch-stats > .stat::before{font-size:11.5px!important}
  html body.pch-on #pchead .pch-tb,html body.pch-on #menuov .mo-tb{width:38px!important;min-width:38px!important}
  html body.pch-on #pchead #catdock,html body.pch-on #menuov #tabs .secbar{gap:3px!important}
  html body.pch-on #pchead #catdock .cdb,html body.pch-on #menuov #tabs.secmode .secb{padding-left:4px!important;padding-right:4px!important;min-width:0!important}
}
</style>`);
document.head.insertAdjacentHTML('beforeend',`<style>
/* a single update: the card is as tall as its notes (up to the same limit), not a fixed size */
body.pch-on #evin:has(.pnr.one){height:auto!important;max-height:min(760px,88vh)!important}
body.pch-on #evin .pnr.one .pnr-main{flex:0 1 auto}
</style>`);
