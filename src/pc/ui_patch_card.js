// PC: patch notes made for a big screen (director, 2026-11-17: hard to read). A wide card on a dimmed game, each update split into
// titled section cards laid out side by side; lists without headings are grouped by what they are about (PC, Phones, iPhone,
// Menus, Everywhere) and the prefix is dropped. Phones keep the narrow card.
{ const _ph=patchHTML;
  const groups=p=>{ const out=[]; let cur=null; const hasH=p.items.some(i=>i.startsWith('## '));
    if(hasH){ for(const i of p.items){ if(i.startsWith('## ')){ cur={t:i.slice(3),items:[]}; out.push(cur); } else { if(!cur){ cur={t:'What changed',items:[]}; out.push(cur); } cur.items.push(i); } } return out; }
    const PRE=[['PC','PC'],['Phones','Phones'],['iPhone','iPhone'],['Menus on phones held sideways','Phones'],['Menus','Menus']], by={};
    for(const i of p.items){ const m=i.match(/^([A-Za-z ]+?):\s+(.*)$/); let g='Everywhere', txt=i; if(m){ const hit=PRE.find(([k])=>k===m[1]); if(hit){ g=hit[1]; txt=m[2].charAt(0).toUpperCase()+m[2].slice(1); } } (by[g]=by[g]||[]).push(txt); }
    return ['Everywhere','Menus','PC','Phones','iPhone'].filter(g=>by[g]).map(g=>({t:g,items:by[g]})); };
  // changes for every platform first, platform-only changes at the end (director, 2026-11-17)
  const PLAT=['PC','Phones','iPhone','Android','Tablets'], organized=p=>{ const gs=groups(p); return gs.filter(g=>!PLAT.includes(g.t)).concat(PLAT.flatMap(t=>gs.filter(g=>g.t===t))); };
  patchHTML=function(p){ if(!document.body.classList.contains('pch-on')){ const gs=organized(p); if(gs.length<2&&!p.items.some(i=>i.startsWith('## '))) return _ph(p); return _ph(Object.assign({},p,{items:gs.flatMap(g=>['## '+g.t].concat(g.items))})); }
    const gs=organized(p); return `<div class="pn-head"><div class="rar" style="color:var(--gold)">${p.label?esc(p.label):'Update '+esc(p.v)}</div><h3>${esc(p.name)}</h3></div><div class="pn-grid">${gs.map(g=>`<section class="pn-sec"><h4>${esc(g.t)}</h4><ul>${g.items.map(i=>`<li>${esc(i)}</li>`).join('')}</ul></section>`).join('')}</div>`; }; }
document.head.insertAdjacentHTML('beforeend',`<style>
body.pch-on #evcard{background:rgba(4,9,18,.66)!important}
body.pch-on #evin:has(.pn-grid){width:min(1080px,calc(92*var(--uvw,1vw)))!important;max-width:none!important;max-height:calc(86*var(--uvh,1vh))!important;padding:22px 26px!important;text-align:left}
body.pch-on #evin:has(.pn-grid) > .rar,body.pch-on #evin:has(.pn-grid) > h3,body.pch-on #evin:has(.pn-grid) > p.sub{text-align:center}
body.pch-on #evin .pn-head{text-align:center;margin:6px 0 10px}
body.pch-on #evin .pn-head h3{font-size:24px;margin:2px 0 0}
body.pch-on #evin .pn-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:12px;align-items:start}
body.pch-on #evin .pn-sec{background:#0e1a2c;border:1px solid #ffffff14;border-radius:14px;padding:12px 14px 10px}
body.pch-on #evin .pn-sec h4{margin:0 0 6px;font:800 12.5px var(--display,system-ui);letter-spacing:.07em;text-transform:uppercase;color:var(--gold,#ffd36a)}
body.pch-on #evin .pn-sec ul{margin:0;padding-left:18px;max-height:none!important;overflow:visible!important}
body.pch-on #evin .pn-sec li{font-size:14.5px;line-height:1.5;color:#dbe6f2;margin:0 0 6px}
body.pch-on #evin .pn-sec li:last-child{margin-bottom:0}
</style>`);
document.head.insertAdjacentHTML('beforeend',`<style>
body.pch-on #panel .featboard{display:grid;gap:10px;align-items:start;margin-top:4px}
body.pch-on #panel .fb-col{display:flex;flex-direction:column;gap:9px;min-width:0}


body.pch-on #panel .fb-cat{margin:0;background:linear-gradient(180deg,#132238,#0f1b2d);border:1px solid #ffffff14;border-radius:14px;padding:8px 10px 4px;box-shadow:inset 0 1px 0 #ffffff0d}
body.pch-on #panel .fb-cat header{display:flex;justify-content:space-between;align-items:baseline;margin:0 2px 6px;font:800 12.5px var(--display,system-ui);letter-spacing:.07em;text-transform:uppercase;color:var(--gold,#ffd36a)}
body.pch-on #panel .fb-cat header .fb-n{letter-spacing:0;color:#8fa6bf;font-weight:700}
body.pch-on #panel .fb-cat ul{list-style:none;margin:0;padding:0}
body.pch-on #panel .fb-row{display:grid;grid-template-columns:minmax(0,1fr) auto;column-gap:8px;row-gap:2px;padding:3px 4px 4px;border-top:1px solid #ffffff0a}
body.pch-on #panel .fb-row:first-child{border-top:0}
body.pch-on #panel .fb-name{font:700 13px var(--display,system-ui);color:#eef3f8;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
body.pch-on #panel .fb-cnt{font:700 12px var(--display,system-ui);color:#9fb2c8;white-space:nowrap}
body.pch-on #panel .fb-bar{display:block;height:3px;border-radius:4px;background:#ffffff14;overflow:hidden;align-self:center}
body.pch-on #panel .fb-bar b{display:block;height:100%;border-radius:4px;background:linear-gradient(90deg,#7fe3c4,#ffd36a)}
body.pch-on #panel .fb-rew{font-size:11.5px;color:#c9d7e8;white-space:nowrap;text-align:right}
body.pch-on #panel .fb-row.done{opacity:.55}
body.pch-on #panel .fb-row.done .fb-name{color:#7fe3c4}
body.pch-on #panel .fb-row.done .fb-bar b{background:#7fe3c4}
</style>`);
document.head.insertAdjacentHTML('beforeend',`<style>
/* PC: Next goal is as wide as its text needs (at most 460 px); cooler, aquarium and Fish Log sit together at the right */
html body.pch-on.dl-fish .hud > #goalchip{flex:0 1 auto!important;width:auto!important;max-width:460px!important;min-width:200px!important}
html body.pch-on.dl-fish .hud > .st-cool{margin-left:auto!important}
</style>`);
