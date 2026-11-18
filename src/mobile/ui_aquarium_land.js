// Aquarium on sideways phones and tablets: the tank comes straight under the earnings bar, so the whole tank is on screen
// (with the side panel collapsed it fills the width); the boosts and the description follow it (director, 2026-11-17)
document.head.insertAdjacentHTML('beforeend',`<style>@media (orientation:landscape) and (max-height:560px){
 body #menuov #panel:has(> .tank){display:flex!important;flex-direction:column!important}
 #menuov #panel:has(> .tank) > *{order:6;flex:0 0 auto}
 #menuov #panel:has(> .tank) > .crumb{order:0}
 #menuov #panel:has(> .tank) > .dl-head{display:contents}
 #menuov #panel:has(> .tank) > .dl-head > .bank{order:1;margin:0 0 8px}
 #menuov #panel:has(> .tank) > .tank{order:2;margin-top:0}
 #menuov #panel:has(> .tank) > p.sub{order:3;margin:4px 0 0}
 #menuov #panel:has(> .tank) > .badges{order:4;margin-top:8px}
 #menuov #panel:has(> .tank) > .dl-head > :not(.bank){order:5;margin-top:6px}
}</style>`);
