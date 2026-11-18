// landscape phones: the wardrobe's section tabs stay on one line (Shop used to wrap onto a row of its own); on the
// narrowest screens the row scrolls sideways instead of squeezing the labels
document.head.insertAdjacentHTML('beforeend',`<style>@media (max-height:560px) and (orientation:landscape){
 #menuov #panel > .wd-nav.wd-top{flex-wrap:nowrap!important;overflow-x:auto!important;overflow-y:hidden!important;scrollbar-width:none;overscroll-behavior-x:contain}
 #menuov #panel > .wd-nav.wd-top::-webkit-scrollbar{display:none}
 #menuov #panel > .wd-nav.wd-top > button{flex:1 0 auto!important}
}</style>`);
