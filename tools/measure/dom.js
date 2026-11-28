/* The structure of one page as the PC build draws it (set PAGE below): tags, classes and short text, fish rows cut to the first two. For reading a page before changing it. */
const PAGE='cooler'; openMenu(PAGE); const P=$('panel');
const walk=(el,d)=>{ if(d>7) return ''; let out=''; let rows=0; for(const c of el.children){ if(c.classList.contains('fishrow')&&++rows>2) continue; const t=[...c.childNodes].filter(n=>n.nodeType===3).map(n=>n.textContent.trim()).join(' ').slice(0,40);
    out+='  '.repeat(d)+c.tagName.toLowerCase()+(c.id?'#'+c.id:'')+(c.className&&typeof c.className==='string'?'.'+c.className.trim().split(/\s+/).join('.'):'')+(c.dataset.act?'[act='+c.dataset.act+(c.dataset.k?':'+c.dataset.k:'')+']':'')+(t?' "'+t+'"':'')+'\n'+walk(c,d+1); } return out; };
return JSON.stringify({panel:P.className, tab:P.dataset.pgTab||'', tree:walk(P,0)});
