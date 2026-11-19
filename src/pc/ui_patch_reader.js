// =====================================================================
// PC patch notes, as a reader (director, 2026-11-17, hotfix: "pc patch notes look garbage"). One card of a fixed size: the
// title and "Let's fish!" on top, the updates you missed listed on the left (newest first; click one to read it), and the
// chosen update on the right with its sections in balanced columns (no holes; platform sections last). Only the notes scroll,
// and only when an update is long. A single update gets the same card without the list. Phones keep their own card.
// =====================================================================
{ const _sw=showWhatsNew, _sp=showPatchNotes;
  const pc=()=>document.body.classList.contains('pch-on');
  // short sections side by side; long ones (more than 5 points) full width below, their points flowing in columns
  const body=p=>{ const d=document.createElement('div'); d.innerHTML=patchHTML(p); const g=d.querySelector('.pn-grid'); if(g){ g.classList.add('pnr-grid'); const secs=[...g.children]; secs.filter(s=>s.querySelectorAll('li').length>5).forEach(s=>{ s.classList.add('wide'); g.appendChild(s); }); } return d.innerHTML; };
  const open=(list,title,sub,after)=>{ G.st='event'; let cur=0;
    const rail=list.length>1?`<nav class="pnr-rail">${list.map((p,i)=>`<button type="button" class="pnr-it" data-i="${i}" aria-pressed="${i===0}"><span class="pnr-v">${p.label?esc(p.label):'Update '+esc(p.v)}</span><b>${esc(p.name)}</b>${i===0?'<span class="pnr-new">Newest</span>':''}</button>`).join('')}</nav>`:'';
    $('evin').innerHTML=`<div class="pnr${list.length>1?'':' one'}"><header class="pnr-top"><div><div class="rar" style="color:var(--gold)">${title}</div><h3>${sub}</h3></div><button class="btn" data-ev="skip">Let’s fish!</button></header><div class="pnr-main">${rail}<article class="pnr-body">${body(list[0])}</article></div></div>`;
    const art=$('evin').querySelector('.pnr-body');
    $('evin').querySelectorAll('.pnr-it').forEach(b=>b.addEventListener('click',e=>{ e.stopPropagation(); const i=+b.dataset.i; if(i===cur) return; cur=i; art.innerHTML=body(list[i]); art.scrollTop=0; $('evin').querySelectorAll('.pnr-it').forEach(x=>x.setAttribute('aria-pressed',String(+x.dataset.i===i))); }));
    $('evcard').hidden=false; if(after) setTimeout(()=>toast(after),400); };
  showWhatsNew=function(seen,after){ if(!pc()) return _sw.apply(this,arguments); const all=missedPatches(seen); if(all.length<=1) return showPatchNotes(PATCHES[0],after);
    const list=all.slice(0,20); open(list,`${all.length} updates since you last played`,'What’s new',after); };
  showPatchNotes=function(p=PATCHES[0],after){ if(!pc()) return _sp.apply(this,arguments); open([p],p.label?esc(p.label):'Update '+esc(p.v),esc(p.name),after); }; }
document.head.insertAdjacentHTML('beforeend',`<style>
body.pch-on #evin:has(.pnr){width:min(1180px,calc(94*var(--uvw,1vw)))!important;max-width:none!important;height:min(760px,calc(88*var(--uvh,1vh)))!important;max-height:none!important;padding:0!important;overflow:hidden!important;text-align:left;display:flex;flex-direction:column}
body.pch-on #evin .pnr{display:flex;flex-direction:column;height:100%;min-height:0}
body.pch-on #evin .pnr-top{display:flex;align-items:center;justify-content:space-between;gap:16px;padding:16px 22px 14px;border-bottom:1px solid #ffffff14;flex:0 0 auto}
body.pch-on #evin .pnr-top h3{margin:2px 0 0;font-size:24px}
body.pch-on #evin .pnr-top .btn{flex:0 0 auto;padding:9px 20px}
body.pch-on #evin .pnr-main{display:grid;grid-template-columns:240px minmax(0,1fr);flex:1 1 auto;min-height:0}
body.pch-on #evin .pnr.one .pnr-main{grid-template-columns:minmax(0,1fr)}
body.pch-on #evin .pnr-rail{display:flex;flex-direction:column;gap:4px;padding:12px;border-right:1px solid #ffffff14;overflow:auto;min-height:0}
body.pch-on #evin .pnr-it{display:grid;grid-template-columns:minmax(0,1fr) auto;row-gap:2px;align-items:center;text-align:left;padding:9px 12px;border-radius:11px;border:1px solid transparent;background:none;color:#cfdcea;cursor:pointer;font:inherit}
body.pch-on #evin .pnr-it:hover{background:#ffffff0b}
body.pch-on #evin .pnr-it[aria-pressed="true"]{background:#1d3150;border-color:#7fb8ff55;color:#fff;box-shadow:inset 3px 0 0 #7fb8ff}
body.pch-on #evin .pnr-it .pnr-v{grid-column:1;font:800 10.5px var(--display,system-ui);letter-spacing:.07em;text-transform:uppercase;color:var(--gold,#ffd36a)}
body.pch-on #evin .pnr-it b{grid-column:1;font-size:14px;font-weight:800;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
body.pch-on #evin .pnr-it .pnr-new{grid-column:2;grid-row:1 / 3;font-size:10px;font-weight:800;padding:2px 7px;border-radius:999px;background:#7fe3c422;color:#7fe3c4}
body.pch-on #evin .pnr-body{overflow:auto;min-height:0;padding:16px 22px 20px;scrollbar-width:thin}
body.pch-on #evin .pnr-body .pn-head{text-align:left;margin:0 0 12px}
body.pch-on #evin .pnr-body .pn-head h3{font-size:20px}
body.pch-on #evin .pnr-grid{display:grid!important;grid-template-columns:repeat(auto-fill,minmax(270px,1fr))!important;gap:14px!important;align-items:stretch!important}
body.pch-on #evin .pnr-grid .pn-sec.wide{grid-column:1 / -1}
body.pch-on #evin .pnr-grid .pn-sec.wide ul{columns:3 260px;column-gap:28px}
body.pch-on #evin .pnr-grid .pn-sec li{font-size:14px;line-height:1.5;break-inside:avoid}
</style>`);
document.head.insertAdjacentHTML('beforeend',`<style>
body.pch-on #evin .pnr.one .pnr-body .pn-head{display:none}
/* the tip line never shows as an empty bubble, and hides while a card (patch notes, events) is open over the water */
#hint:empty{display:none!important}
body.ev-open #hint{visibility:hidden!important}
</style>`);
