// =====================================================================
// Menus on short landscape screens (phones held sideways): the categories become a rail down the left, so the page
// gets the whole height under one slim row (the page's own tabs and the coin / search / settings buttons).
// =====================================================================
document.head.insertAdjacentHTML('beforeend',`<style>
@media (orientation:landscape) and (max-height:560px){
  #menuov .mo-in{grid-template-columns:clamp(132px,18vw,176px) minmax(0,1fr) auto!important;grid-template-rows:auto auto minmax(0,1fr)!important;grid-template-areas:"back sub tools" "home body body" "secs body body"!important;column-gap:12px!important;row-gap:5px!important;padding-top:max(6px,env(safe-area-inset-top))!important}
  #menuov .mo-back,#menuov .mo-home{width:100%;box-sizing:border-box;justify-content:flex-start;min-height:36px!important;padding:0 10px!important;border-radius:12px;align-self:start}
  #menuov .mo-home .mo-hl{display:inline!important;font-size:13px}
  body #menuov #tabs.secmode .secbar{grid-area:secs;display:flex!important;flex-direction:column;align-self:stretch;gap:4px;overflow-y:auto;overscroll-behavior:contain;scrollbar-width:none;padding:2px 0 10px!important;margin:0!important;min-height:0;background:none!important;border:0!important;box-shadow:none!important}
  body #menuov #tabs.secmode .secbar::-webkit-scrollbar{display:none}
  body #menuov #tabs.secmode .secb{flex:0 0 auto;flex-direction:row!important;justify-content:flex-start;gap:9px!important;min-height:36px!important;padding:0 10px!important;font-size:13px!important;border-radius:12px!important}
  body #menuov #tabs.secmode .secb .seci svg{width:18px;height:18px}
  body #menuov #tabs.secmode .secb .secfull{display:inline!important}body #menuov #tabs.secmode .secb .secshort{display:none!important}
  body #menuov #tabs.secmode .secdot{top:50%!important;right:8px!important;transform:translateY(-50%)}
  body #menuov #tabs.secmode .secb .seclive{top:50%!important;left:auto!important;right:8px;transform:translateY(-50%)}
  body #menuov #tabs.secmode .subbar{grid-area:sub;align-self:center;padding:0!important;gap:6px!important;margin:0!important}
  body #menuov #tabs.secmode .subp{min-height:34px!important;padding:0 12px!important;font-size:13px!important}
  body #menuov #panel{padding-top:2px!important}
  body #menuov #panel > h2:first-child,body #menuov #panel h2{font-size:18px!important;margin:0 0 3px!important;line-height:1.2}
  body #menuov #panel p.sub{font-size:12px!important;margin:0 0 8px!important;line-height:1.35}
}
</style>`);
