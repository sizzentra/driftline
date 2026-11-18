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
