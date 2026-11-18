// =====================================================================
// Phones held sideways: the categories live in a rail on the RIGHT, both on the water and in the menu, so the thumb
// finds them in the same place; the page scroll never rubber-bands past its top.
// =====================================================================
document.head.insertAdjacentHTML('beforeend',`<style>
#menuov #panel{overscroll-behavior:contain;overscroll-behavior-y:none}
@media (orientation:landscape) and (max-height:560px){
  /* on the water: a slim rail down the right edge, growing up from the bottom corner */
  #catdock{left:auto!important;right:6px!important;top:auto!important;bottom:6px!important;transform:none!important;flex-direction:column;gap:2px;padding:3px;border-radius:14px}
  #catdock .cdb,#catdock #menubtn{flex-direction:row!important;justify-content:flex-start;gap:7px!important;width:112px;min-width:0!important;height:31px!important;padding:0 9px!important;font-size:11px!important;border-radius:10px}
  #catdock svg{width:17px!important;height:17px!important;flex:0 0 auto}
  #catdock .cddot,#catdock .mbdot{top:50%!important;right:6px!important;transform:translateY(-50%);min-width:17px!important;height:17px!important;line-height:17px!important;font-size:10px!important}
  #catdock .cdb.live::before{top:4px!important;left:4px!important;width:7px;height:7px}
  body.dl-fish .wrap > #hint,body.dl-fish #stage > #hint{bottom:10px!important;left:calc(50% - 62px)!important;max-width:calc(100% - 330px)!important}
  body.dl-fish .resttog{bottom:8px!important}
  .dlprev{bottom:calc(10px + env(safe-area-inset-bottom))!important;right:calc(140px + env(safe-area-inset-right))!important}
  /* in the menu: the icon rail on the right, the page tabs and coin / search / settings above the page */
  #menuov .mo-in{grid-template-columns:auto minmax(0,1fr) 52px!important;grid-template-areas:"tools sub back" "body body home" "body body secs"!important}
  #menuov .mo-tools{justify-self:start}
}
</style>`);
document.head.insertAdjacentHTML('beforeend',`<style>
@media (orientation:landscape) and (max-height:560px){
  #catdock .cdb,#catdock #menubtn{width:134px;padding:0 28px 0 9px!important}
  body.dl-fish .wrap > #hint,body.dl-fish #stage > #hint{left:calc(50% - 72px)!important;max-width:calc(100% - 350px)!important}
  .dlprev{right:calc(160px + env(safe-area-inset-right))!important}
}
</style>`);
