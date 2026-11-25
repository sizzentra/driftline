
// =====================================================================
// 0.3 less scrolling: long menus get sections you switch between (the same segmented bar as the
// Boardwalk). Applied after a menu is drawn, so every menu keeps working exactly as before; the
// section you picked is remembered per menu while the game is open.
// =====================================================================
const SECT={};
function sectionize(P,tab,groups,before){ groups=groups.filter(g=>g.nodes.length); if(groups.length<2) return;
  const cur=groups.some(g=>g.name===SECT[tab])?SECT[tab]:groups[0].name;
  const nav=document.createElement('div'); nav.className='bwx-nav sect-nav'; nav.setAttribute('role','tablist');
  nav.innerHTML=groups.map(g=>`<button role="tab" type="button" data-sect="${esc(g.name)}" aria-selected="${g.name===cur}">${esc(g.name)}${g.badge?` <span class="sdot">${g.badge}</span>`:''}</button>`).join('');
  const show=name=>{ for(const g of groups) for(const n of g.nodes) n.style.display = g.name===name ? '' : 'none'; nav.querySelectorAll('button').forEach(b=>b.setAttribute('aria-selected',String(b.dataset.sect===name))); };
  nav.addEventListener('click',e=>{ const b=e.target.closest('[data-sect]'); if(!b) return; e.stopPropagation(); SECT[tab]=b.dataset.sect; show(b.dataset.sect); });
  const anchor=before||groups[0].nodes[0]; anchor.parentNode.insertBefore(nav,anchor); show(cur); }
const kids=P=>[...P.children];
const hasH=(el,re)=>{ const h=el.matches&&el.matches('h2,h4,h5')?el:el.querySelector&&el.querySelector('h2,h4,h5'); return !!(h&&re.test(h.textContent)); };
function applySections(){ const P=$('panel'); if(!P) return; const tab=S.tab, K=kids(P);
  if(tab==='settings'){ const grid=K.find(c=>c.classList.contains('grid')); if(!grid) return; const tiles=[...grid.children], pick=re=>tiles.filter(t=>hasH(t,re));
    const save=K.filter(c=>c!==grid&&(c.classList.contains('tile')||c.tagName==='DETAILS'));
    // the chosen tiles sit alone in the grid, so let the grid show one wide column
    sectionize(P,tab,[{name:'Sound',nodes:pick(/^Sound/)},{name:'Controls',nodes:pick(/^Controls/)},{name:'Display',nodes:pick(/^(Display|PC)\b/)},{name:'Gameplay',nodes:pick(/^Gameplay/)},{name:'Patch notes',nodes:pick(/^Patch notes/)},{name:'Save & codes',nodes:save}],K.find(c=>c.classList.contains('tile')||c===grid));
    grid.classList.add('sect-one'); }
  else if(tab==='pets'){ const grid=K.find(c=>c.classList.contains('grid')), cust=K.filter(c=>c.classList.contains('tile')&&c!==grid); if(!grid) return; const T=[...grid.children], mine=T.filter(t=>t.querySelector('canvas[data-own="1"]')), more=T.filter(t=>!mine.includes(t));
    sectionize(P,tab,[{name:'Your pets · '+mine.length,nodes:mine},{name:'Find more · '+more.length,nodes:more},{name:'Customize',nodes:cust}],cust[0]||grid); }
  else if(tab==='feats'){ const grid=K.find(c=>c.classList.contains('grid')); if(!grid) return; const T=[...grid.children], todo=T.filter(t=>!t.classList.contains('done')), done=T.filter(t=>t.classList.contains('done'));
    sectionize(P,tab,[{name:'To do · '+todo.length,nodes:todo},{name:'Done · '+done.length,nodes:done}],grid); }
  else if(tab==='aquarium'){ const dec=K.find(c=>c.classList.contains('jsec')), view=K.filter(c=>c.classList.contains('tank')||(c.tagName==='P'&&/Drag a decoration/.test(c.textContent))), head=K.slice(0,2).concat(view), tank=K.filter(c=>!head.includes(c)&&c!==dec); sectionize(P,tab,[{name:'Your tank',nodes:tank},{name:'Decorate',nodes:dec?[dec]:[]}]); }
  else if(tab==='rods'){ const i1=K.findIndex(c=>c.tagName==='H2'&&/Rod rack/.test(c.textContent)), i2=K.findIndex(c=>c.tagName==='H2'&&/Attachments/.test(c.textContent)); if(i1<0||i2<0) return;
    sectionize(P,tab,[{name:'Your rods',nodes:K.slice(1,i1)},{name:'Rod rack',nodes:K.slice(i1,i2)},{name:'Attachments',nodes:K.slice(i2)}]); }
  else if(tab==='locs'||tab==='waters'||tab==='map'){ const grid=K.find(c=>c.classList.contains('grid')), js=K.filter(c=>c.classList.contains('jsec')); if(!grid||!js.length) return;
    sectionize(P,tab,[{name:'Waters',nodes:[grid]},...js.map(j=>({name:(j.querySelector('h2')||{}).textContent||'More',nodes:[j]}))]); } }
const _renderPanel_0 = renderPanel;
renderPanel = function(){ _renderPanel_0(); try{ applySections(); }catch(e){} };
document.head.insertAdjacentHTML('beforeend',`<style>.sect-nav{margin:10px 0 12px;flex-wrap:wrap} .sect-nav button{min-width:90px} #panel .grid.sect-one{grid-template-columns:minmax(0,1fr)!important}</style>`);
// denser layouts for the longest lists (0.3 QC): patch notes scroll inside their box, pets/feats/decor/bait use tighter grids
document.head.insertAdjacentHTML('beforeend',`<style>
#panel .grid.sect-one details[open] > ul{max-height:calc(52*var(--uvh,1vh));overflow:auto;padding-right:6px}
body.v3 #panel .grid:has(> .tile canvas[data-pet]){grid-template-columns:repeat(auto-fill,minmax(180px,1fr));gap:8px}
body.v3 #panel .grid:has(> .tile canvas[data-pet]) > .tile{padding:10px;gap:4px}
body.v3 #panel .grid:has(> .tile .prog) > .tile{padding:10px 12px;gap:4px}
body.v3 #panel .grid:has(> .tile .prog){grid-template-columns:repeat(auto-fill,minmax(230px,1fr));gap:8px}
#panel .tk-list{display:grid;grid-template-columns:repeat(auto-fill,minmax(min(100%,420px),1fr));gap:8px}
</style>`);
// pets: filter by bonus type; feats: closest first, the rest behind "Show all"
let petFilter='all', featsAll=false;
const _applySections_0 = applySections;
applySections = function(){ _applySections_0(); const P=$('panel'); if(!P) return;
  if(S.tab==='pets'){ const grid=[...P.children].find(c=>c.classList.contains('grid')); if(!grid) return; const T=[...grid.children].filter(t=>t.querySelector('canvas[data-own="1"]')); if(T.length<8) return;
    const kOf=t=>{ const id=(t.querySelector('canvas[data-pet]')||{}).dataset; return id&&PETI[id.pet]?PETI[id.pet].k:'other'; };
    T.sort((a,b)=>{ const fa=a.classList.contains('done')?0:1, fb=b.classList.contains('done')?0:1; return fa-fb; }).forEach(t=>grid.appendChild(t)); [...grid.children].filter(t=>!T.includes(t)).forEach(t=>grid.appendChild(t));
    const kinds=[...new Set(T.map(kOf))]; const bar=document.createElement('div'); bar.className='chips pet-filter'; bar.style.margin='0 0 10px';
    bar.innerHTML=['all',...kinds].map(k=>`<button class="chipb" type="button" data-pf="${k}" aria-pressed="${petFilter===k}">${k==='all'?'All':(BK[k]?BK[k][0].toUpperCase()+BK[k].slice(1):k)} <span class="meta">${k==='all'?T.length:T.filter(t=>kOf(t)===k).length}</span></button>`).join('');
    let petsAll=document.body.classList.contains('pc-fhd'); /* full HD: every pet at once */ const pmore=document.createElement('button'); pmore.className='btn alt'; pmore.type='button'; pmore.style.cssText='margin:10px auto 0;display:none'; pmore.addEventListener('click',e=>{ e.stopPropagation(); petsAll=true; apply(); }); grid.after(pmore);
    const apply=()=>{ let n=0; for(const t of T){ let show=petFilter==='all'||kOf(t)===petFilter||t.classList.contains('done'); if(show&&petFilter==='all'&&!petsAll){ n++; if(n>16) show=false; } t.style.display=show?'':'none'; } pmore.style.display=petFilter==='all'&&!petsAll&&T.length>16&&bar.style.display!=='none'?'block':'none'; pmore.textContent='Show all '+T.length; bar.querySelectorAll('[data-pf]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.pf===petFilter))); };
    bar.addEventListener('click',e=>{ const b=e.target.closest('[data-pf]'); if(!b) return; e.stopPropagation(); petFilter=b.dataset.pf; apply(); });
    grid.parentNode.insertBefore(bar,grid); const sync=()=>{ const vis=P.querySelector('.sect-nav [aria-selected="true"]'); bar.style.display=vis&&/Your pets/.test(vis.textContent)?'':'none'; if(bar.style.display!=='none') apply(); else pmore.style.display='none'; };
    P.querySelector('.sect-nav')&&P.querySelector('.sect-nav').addEventListener('click',()=>setTimeout(sync,0)); sync(); }
  if(S.tab==='feats'){ const grid=[...P.children].find(c=>c.classList.contains('grid')); if(!grid) return; const todo=[...grid.children].filter(t=>!t.classList.contains('done'));
    const prog=t=>{ const i=t.querySelector('.prog i'); return i?parseFloat(i.style.width)||0:0; }; todo.sort((a,b)=>prog(b)-prog(a)); todo.forEach(t=>grid.insertBefore(t,grid.firstChild?null:null)); const rest=[...grid.children].filter(t=>t.classList.contains('done')); todo.concat(rest).forEach(t=>grid.appendChild(t));
    const LIMIT=18; if(todo.length<=LIMIT) return; const more=document.createElement('button'); more.className='btn alt'; more.type='button'; more.style.margin='10px auto 0'; more.style.display='block';
    const apply=()=>{ const onTodo=/To do/.test((P.querySelector('.sect-nav [aria-selected="true"]')||{}).textContent||''); todo.forEach((t,i)=>{ if(onTodo) t.style.display=(featsAll||i<LIMIT)?'':'none'; }); more.style.display=onTodo&&!featsAll?'block':'none'; more.textContent='Show all '+todo.length; };
    more.addEventListener('click',e=>{ e.stopPropagation(); featsAll=true; apply(); }); grid.after(more); P.querySelector('.sect-nav')&&P.querySelector('.sect-nav').addEventListener('click',()=>setTimeout(apply,0)); apply(); } };
document.head.insertAdjacentHTML('beforeend',`<style>.tint-dot{display:inline-block;width:11px;height:11px;border-radius:50%;margin-right:6px;vertical-align:-1px;box-shadow:inset 0 0 0 1px #0004}</style>`);
// ---------- Skills in sections, Save tidied into sections, one Settings entry (the button at the top) ----------
const PERK_GROUPS=[['Catching',['patience','caster','reader','secondbite','nightowl','weatherwise']],['Rare finds',['lucky','trophy','hybrid','scavenger','gourmet']],['Fighting',['steady','strong','softtouch','reflex','grappler','snagwise']],['Coins & XP',['haggler','streaker','naturalist','tidewalker','derbypro']],['Aquarium & pets',['keeper','aquarist','petpal','dozer','nibbler','prismkeeper']]];
const _applySections_1 = applySections;
applySections = function(){ _applySections_1(); const P=$('panel'); if(!P) return;
  if(S.tab==='skills'){ const grid=[...P.children].find(c=>c.classList.contains('grid')); if(!grid) return; const T=[...grid.children]; const idOf=t=>{ const b=t.querySelector('[data-act="perk"]'); return b?b.dataset.k:''; };
    const groups=PERK_GROUPS.map(([n,ids])=>{ const nodes=T.filter(t=>ids.includes(idOf(t))); const free=nodes.filter(t=>{ const b=t.querySelector('[data-act="perk"]'); return b&&!b.disabled; }).length; return {name:n,nodes,badge:free}; });
    const known=new Set(PERK_GROUPS.flatMap(g=>g[1])), other=T.filter(t=>!known.has(idOf(t))); if(other.length) groups.push({name:'Other',nodes:other});
    grid.classList.add('skill-grid'); sectionize(P,'skills',groups,grid); }
  if(S.tab==='save'){ const K=[...P.children], grid=K.find(c=>c.classList.contains('grid')); if(!grid) return; const head=K.slice(0,2), link=K.filter(c=>!head.includes(c)&&c!==grid&&c.tagName!=='P');
    const tiles=[...grid.children], code=tiles.filter(t=>/save code/i.test((t.querySelector('h4')||{}).textContent||'')), app=tiles.filter(t=>!code.includes(t));
    sectionize(P,'save',[{name:'Move to another device',nodes:link},{name:'Save codes',nodes:code},{name:'App',nodes:app}],link[0]||grid); grid.classList.add('sect-one'); } };
{ const st=document.querySelector('#tabs [data-tab="settings"]'); if(st) st.remove(); }
document.head.insertAdjacentHTML('beforeend',`<style>body.v3 #panel .grid.skill-grid{grid-template-columns:repeat(auto-fill,minmax(230px,1fr));gap:8px} body.v3 #panel .grid.skill-grid > .tile{padding:10px 12px;gap:5px}</style>`);
// Pets > Customize: preview beside the options when there is room, stacked when the menu column is narrow (phones, landscape).
document.head.insertAdjacentHTML('beforeend',`<style>#panel{container-type:inline-size}.stylewrap.petwrap{grid-template-columns:200px minmax(0,1fr)}.stylewrap.petwrap>*{min-width:0}@container (max-width:520px){.stylewrap.petwrap{grid-template-columns:minmax(0,1fr)}.stylewrap.petwrap>.preview{max-width:240px;width:100%;margin:0 auto}}</style>`);
// Your rods: one compact row per attachment slot (the chips already name each attachment and its effect)
document.head.insertAdjacentHTML('beforeend',`<style>.slotrow{display:grid;grid-template-columns:52px 1fr;gap:8px;align-items:center;padding:7px 0;border-top:1px solid var(--line)}.slotrow:first-of-type{border-top:0}.slotrow>b{font-size:12px;color:var(--muted);text-transform:uppercase;letter-spacing:.04em}.slotrow .chips{margin:0}@media (max-width:480px){.slotrow{grid-template-columns:1fr;gap:4px}}</style>`);
// Wardrobe: stack the preview above the options whenever the menu column is narrow (phones sideways, small windows)
document.head.insertAdjacentHTML('beforeend',`<style>@container (max-width:560px){.stylewrap.wd{grid-template-columns:minmax(0,1fr)!important}.stylewrap.wd>*{min-width:0}.wd-prev{position:relative!important;top:auto!important;max-width:260px;width:100%;margin:0 auto}}</style>`);
