// PC: switching between the fishing screen and the menu keeps the top row perfectly still (it is the same row in both) and only
// fades what changes under it: the info chips or page tabs, and the water or the page. The menu sits on the same background.
document.head.insertAdjacentHTML('beforeend',`<style>
body.pch-on #menuov{background:radial-gradient(1400px 700px at 50% -15%,#1b2c4a 0%,#0e1830 45%,#0a1220 75%) #0a1220!important}
body.pch-on #menuov.mo-show{animation:none!important}
body.pch-on #menuov.mo-show #tabs .subbar{animation:pchIn .2s ease-out both} /* the page itself already fades in on PC (pagein) */
body.pch-on .wrap.wrapin{animation:none!important}
body.pch-on .wrap.wrapin > .hud,body.pch-on .wrap.wrapin > #stage{animation:pchIn .2s ease-out both}
@keyframes pchIn{from{opacity:0;transform:translateY(4px)}to{opacity:1;transform:none}}
@media (prefers-reduced-motion:reduce){body.pch-on #menuov.mo-show #tabs .subbar,body.pch-on #menuov.mo-show #panel,body.pch-on .wrap.wrapin > .hud,body.pch-on .wrap.wrapin > #stage{animation:none!important}}
</style>`);
