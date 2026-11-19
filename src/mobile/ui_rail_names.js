// sideways phones: the menu rail shows each name next to its icon (it matches the rail on the water)
document.head.insertAdjacentHTML('beforeend',`<style>
@media (orientation:landscape) and (max-height:560px){
  #menuov .mo-in{grid-template-columns:auto minmax(0,1fr) 136px!important}
  #menuov .mo-back{justify-content:flex-start!important;gap:7px!important;padding:0 9px!important;font-size:12px!important}
  #menuov .mo-back::after{content:"Back"!important;font-size:12px!important}
  body #menuov #tabs.secmode .secb{justify-content:flex-start!important;gap:7px!important;padding:0 28px 0 9px!important;font-size:12px!important}
  body #menuov #tabs.secmode .secb .secl{display:inline!important;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
  body #menuov #tabs.secmode .secb .secfull{display:none!important}body #menuov #tabs.secmode .secb .secshort{display:inline!important}
  body #menuov #tabs.secmode .secb .seci svg{width:17px;height:17px}
  body #menuov #tabs.secmode .secb .secdot{top:50%!important;right:5px!important;transform:translateY(-50%)!important}
  body #menuov #tabs.secmode .secb .seclive{top:4px!important;left:4px!important}
}
</style>`);

