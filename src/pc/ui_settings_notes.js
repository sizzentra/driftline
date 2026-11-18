// =====================================================================
// PC, Settings > Patch notes, as a reader (director, 2026-11-17: "way too hard to read"): every update listed on the left
// (newest first, gift notes on top), the chosen one on the right in section boxes at normal size. The tab fills the page and
// scrolls inside itself, so the page no longer shrinks to fit 40 updates. Phones keep their list.
// =====================================================================
{ let pick=null; const _rs=renderSettings;
  const listAll=()=>(S.owned.pets.includes('lily')?[LILY_PATCH]:[]).concat(S.owned.pets.includes('daxniko')?[PAIR_PATCH]:[]).concat(PATCHES);
  const body=p=>{ const d=document.createElement('div'); d.innerHTML=patchHTML(p); const g=d.querySelector('.pn-grid'); if(g){ g.classList.add('pnr-grid'); [...g.children].filter(s=>s.querySelectorAll('li').length>5).forEach(s=>{ s.classList.add('wide'); g.appendChild(s); }); } return d.innerHTML; };
  renderSettings=function(P){ _rs(P); if(!document.body.classList.contains('pch-on')) return; try{
    const tile=[...P.querySelectorAll('.tile')].find(t=>/^Patch notes/.test((t.querySelector('h4')||{}).textContent||'')); if(!tile) return;
    const all=listAll(); if(!pick||!all.some(p=>p.v===pick)) pick=PATCHES[0].v;
    tile.classList.add('pc-pn'); tile.innerHTML=`<h4 class="pcpn-h">Patch notes</h4><div class="pcpn-rail"><div class="meta">You’re on Driftline ${esc(GAME_VERSION)}</div>${all.map(p=>`<button type="button" class="pnr-it" data-v="${esc(p.v)}" aria-pressed="${p.v===pick}"><span class="pnr-v">${p.label?esc(p.label):'Update '+esc(p.v)}</span><b>${esc(p.name)}</b>${p===PATCHES[0]?'<span class="pnr-new">Latest</span>':''}</button>`).join('')}</div><article class="pcpn-body"></article>`;
    const art=tile.querySelector('.pcpn-body'); const show=v=>{ const p=all.find(x=>x.v===v)||PATCHES[0]; pick=p.v; art.innerHTML=body(p); art.scrollTop=0; tile.querySelectorAll('.pnr-it').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.v===pick))); };
    tile.querySelectorAll('.pnr-it').forEach(b=>b.addEventListener('click',e=>{ e.stopPropagation(); show(b.dataset.v); }));
    show(pick); }catch(e){ console.error(e); } }; }
document.head.insertAdjacentHTML('beforeend',`<style>
body.pch-on #panel .tile.pc-pn{display:grid!important;grid-template-columns:260px minmax(0,1fr);gap:0;padding:0!important;height:calc(100vh - 226px);min-height:420px;overflow:hidden}
body.pch-on #panel .pc-pn .pcpn-rail{display:flex;flex-direction:column;gap:3px;padding:12px;border-right:1px solid #ffffff14;overflow:auto;min-height:0;scrollbar-width:thin}
body.pch-on #panel .pc-pn .pcpn-rail > .meta{margin:0 4px 8px}
body.pch-on #panel .pc-pn .pnr-it{display:grid;grid-template-columns:minmax(0,1fr) auto;row-gap:2px;align-items:center;text-align:left;padding:8px 11px;border-radius:10px;border:1px solid transparent;background:none;color:#cfdcea;cursor:pointer;font:inherit;flex:0 0 auto}
body.pch-on #panel .pc-pn .pnr-it:hover{background:#ffffff0b}
body.pch-on #panel .pc-pn .pnr-it[aria-pressed="true"]{background:#1d3150;border-color:#7fb8ff55;color:#fff;box-shadow:inset 3px 0 0 #7fb8ff}
body.pch-on #panel .pc-pn .pnr-v{grid-column:1;font:800 10.5px var(--display,system-ui);letter-spacing:.07em;text-transform:uppercase;color:var(--gold,#ffd36a)}
body.pch-on #panel .pc-pn .pnr-it b{grid-column:1;font-size:14px;font-weight:800;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
body.pch-on #panel .pc-pn .pnr-new{grid-column:2;grid-row:1 / 3;font-size:10px;font-weight:800;padding:2px 7px;border-radius:999px;background:#7fe3c422;color:#7fe3c4}
body.pch-on #panel .pc-pn .pcpn-body{overflow:auto;min-height:0;padding:16px 22px 20px;scrollbar-width:thin}
body.pch-on #panel .pc-pn .pn-head{text-align:left;margin:0 0 12px}
body.pch-on #panel .pc-pn .pn-head h3{font-size:22px;margin:2px 0 0}
body.pch-on #panel .pc-pn .pnr-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:14px;align-items:stretch}
body.pch-on #panel .pc-pn .pn-sec{background:#0e1a2c;border:1px solid #ffffff14;border-radius:14px;padding:12px 14px 10px}
body.pch-on #panel .pc-pn .pn-sec h4{margin:0 0 6px;font:800 12.5px var(--display,system-ui);letter-spacing:.07em;text-transform:uppercase;color:var(--gold,#ffd36a)}
body.pch-on #panel .pc-pn .pn-sec ul{margin:0;padding-left:18px}
body.pch-on #panel .pc-pn .pn-sec li{font-size:14.5px;line-height:1.55;color:#dbe6f2;margin:0 0 6px;break-inside:avoid}
body.pch-on #panel .pc-pn .pn-sec.wide{grid-column:1 / -1}
body.pch-on #panel .pc-pn .pn-sec.wide ul{columns:2 320px;column-gap:30px}
body.pch-on #panel .pc-pn .pn-sec:only-child ul{columns:2 320px;column-gap:30px}
</style>`);
document.head.insertAdjacentHTML('beforeend',`<style>body.pch-on #panel .pc-pn .pcpn-h{display:none}</style>`);
document.head.insertAdjacentHTML('beforeend',`<style>
/* PC: the goal sits in the strip above the water now: no see-through blur behind it (it cost work every frame for nothing) */
html body.pch-on #pcscene #goalchip{-webkit-backdrop-filter:none!important;backdrop-filter:none!important}
</style>`);
document.head.insertAdjacentHTML('beforeend',`<style>
/* PC: the page tabs' entrance is played by script now (no forced layout), so the class-based copy is switched off */
body.pch-on #menuov.mo-show #tabs .subbar{animation:none!important}
</style>`);
