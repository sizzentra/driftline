// phones held sideways: the top bar's seven chips share the width by what they hold, so the water name always fits
document.head.insertAdjacentHTML('beforeend',`<style>@media (orientation:landscape) and (max-height:560px){.hud{grid-template-columns:minmax(0,.9fr) minmax(0,.85fr) minmax(0,1.65fr) minmax(0,.8fr) minmax(0,.9fr) minmax(0,1fr) minmax(0,.95fr)!important}}</style>`);
