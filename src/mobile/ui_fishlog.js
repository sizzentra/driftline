// Fish Log on phones: the water list is one sideways-scrolling row (the chosen water scrolled into view), not five rows
{ stepOn('menuTidy2', { after(){ try{ if(S.tab!=='journal') return; const row=$('panel').querySelector('.chips:has(> [data-act="encloc"])'); const on=row&&row.querySelector('[aria-pressed="true"]'); if(row&&on&&row.scrollWidth>row.clientWidth+2){ row.scrollLeft=Math.max(0,on.offsetLeft-row.clientWidth/2+on.offsetWidth/2); } }catch(e){ oops('mobile/ui_fishlog:querySelector',e); } } }); menuTidy=menuTidy2; }
document.head.insertAdjacentHTML('beforeend',`<style>
@container (max-width:760px){
  #menuov #panel .chips:has(> [data-act="encloc"]){flex-wrap:nowrap!important;overflow-x:auto;scrollbar-width:none;padding-bottom:2px;-webkit-mask-image:linear-gradient(90deg,#000 88%,transparent);mask-image:linear-gradient(90deg,#000 88%,transparent)}
  #menuov #panel .chips:has(> [data-act="encloc"])::-webkit-scrollbar{display:none}
  #menuov #panel .chips:has(> [data-act="encloc"]) > *{flex:0 0 auto}
  #menuov #panel .tile.hunt-bar p,#menuov #panel .tile.hunt-bar .meta{font-size:12px;line-height:1.35}
}
</style>`);
{ stepOn('menuTidy2', { after(){ try{ if(S.tab!=='journal') return; const t=[...$('panel').querySelectorAll(':scope > .tile')].find(x=>/Angler rank/i.test(x.textContent)); if(t) t.classList.add('jrank'); }catch(e){ oops('mobile/ui_fishlog:querySelectorAll',e); } } }); menuTidy=menuTidy2; }
document.head.insertAdjacentHTML('beforeend',`<style>
/* Bait in use: always one line */
#panel .tk-cur.tk-slim{flex-wrap:nowrap!important;white-space:nowrap}
#panel .tk-cur.tk-slim > *{min-width:0;overflow:hidden;text-overflow:ellipsis}
#panel .tk-cur.tk-slim > .btn{flex:0 0 auto;overflow:visible}
/* Fish Log rank card on narrow pages: the progress sits under the text instead of squeezing it */
@container (max-width:560px){
  #menuov #panel .tile.jrank{flex-wrap:wrap!important;gap:6px!important;margin-bottom:8px!important}
  #menuov #panel .tile.jrank > :first-child{flex:1 1 100%}
  #menuov #panel .tile.jrank > :last-child{flex:1 1 100%;min-width:0!important}
}
</style>`);
document.head.insertAdjacentHTML('beforeend',`<style>
/* sideways phones: the one row above the page is as slim as a tap allows */
@media (orientation:landscape) and (max-height:560px){
  body #menuov #tabs.secmode .subp{min-height:32px!important;padding:0 11px!important;font-size:12.5px!important}
  #menuov .mo-tb{width:34px!important;height:34px!important}
  #menuov .mo-coin{min-height:32px!important;padding:0 9px!important}
  #menuov .mo-back,body #menuov #tabs.secmode .secb{min-height:34px!important;height:34px}
  #menuov .mo-in{row-gap:4px!important;padding-top:max(5px,env(safe-area-inset-top))!important}
}
</style>`);
document.head.insertAdjacentHTML('beforeend',`<style>
@media (orientation:landscape) and (max-height:560px){
  #menuov #panel .bwx-nav:not(.wd-nav):not(.sect-nav){padding:3px!important;margin:6px 0!important;gap:4px}
  #menuov #panel .bwx-nav:not(.wd-nav):not(.sect-nav) > button{min-height:30px!important;height:30px;font-size:12.5px}
}
@media (max-width:700px) and (orientation:portrait){
  #menuov #panel .bwx-nav:not(.wd-nav) > button{min-height:34px!important}
}
</style>`);
