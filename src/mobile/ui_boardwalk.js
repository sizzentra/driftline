// Boardwalk prize counter and counter specials on phones: two cards a row with a shorter picture (one tall card a row
// wasted most of the screen; 2026-11-17 QC)
document.head.insertAdjacentHTML('beforeend',`<style>@media (max-width:560px){
 #menuov #panel .bwx-prizes{grid-template-columns:repeat(2,minmax(0,1fr))!important;gap:8px}
 #menuov #panel .bwx-prize{padding:9px;gap:6px;border-radius:14px}
 #menuov #panel .bwx-prize canvas{height:78px}
 #menuov #panel .bwx-pt b{font-size:13.5px;line-height:1.2}
 #menuov #panel .bwx-pt .meta{font-size:11.5px;line-height:1.3}
 #menuov #panel .bwx-pf{flex-wrap:wrap;justify-content:stretch;gap:5px}
 #menuov #panel .bwx-pf .btn{flex:1 1 auto;min-width:0;padding-left:6px;padding-right:6px}
}</style>`);
// Fishmonger's Gamble on phones (batch 2, 2026-11-21): after a play the result line pushed the fish buttons down until the card
// was taller than the screen, and the centred line sat over left-aligned buttons. The buttons now sit two to a row (never more than
// two rows: a long name wraps inside its button, never cut), the result line lines up with them, and an empty cooler shows the card's idle picture.
document.head.insertAdjacentHTML('beforeend',`<style>
html body.phone-land #menuov #panel .bwx-gl,html body.phone-app #menuov #panel .bwx-gl{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:6px}
html body.phone-land #menuov #panel .bwx-gl .btn,html body.phone-app #menuov #panel .bwx-gl .btn{min-width:0;display:flex;align-items:center;justify-content:center;gap:4px;height:auto!important;min-height:34px;padding-top:4px!important;padding-bottom:4px!important} /* a long name wraps: the button grows with it (extreme save: two lines spilled over the button below) */
html body.phone-land #menuov #panel .bwx-gl .gn,html body.phone-app #menuov #panel .bwx-gl .gn{min-width:0;white-space:normal;line-height:1.15;text-align:left;overflow-wrap:anywhere} /* names wrap, never cut (TEXT_STANDARD) */
html body.phone-land #menuov #panel .bwx-gl .coin,html body.phone-app #menuov #panel .bwx-gl .coin{flex:0 0 auto}
html body.phone-land #menuov #panel .bwx-res:has(+ .bwx-gl),html body.phone-app #menuov #panel .bwx-res:has(+ .bwx-gl){text-align:left}
</style>`);
