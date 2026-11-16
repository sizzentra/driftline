
// =====================================================================
// 0.3 less scrolling: long menus get sections you switch between (the same segmented bar as the
// Boardwalk). Applied after a menu is drawn, so every menu keeps working exactly as before; the
// section you picked is remembered per menu while the game is open.
// =====================================================================
const SECT={};
function sectionize(P,tab,groups,before){ groups=groups.filter(g=>g.nodes.length); if(groups.length<2) return;
  const cur=groups.some(g=>g.name===SECT[tab])?SECT[tab]:groups[0].name;
  const nav=document.createElement('div'); nav.className='bwx-nav sect-nav'; nav.setAttribute('role','tablist');
  nav.innerHTML=groups.map(g=>`<button role="tab" type="button" data-sect="${esc(g.name)}" aria-selected="${g.name===cur}">${esc(g.name)}${g.badge?` <span class="badge g">${g.badge}</span>`:''}</button>`).join('');
  const show=name=>{ for(const g of groups) for(const n of g.nodes) n.style.display = g.name===name ? '' : 'none'; nav.querySelectorAll('button').forEach(b=>b.setAttribute('aria-selected',String(b.dataset.sect===name))); };
  nav.addEventListener('click',e=>{ const b=e.target.closest('[data-sect]'); if(!b) return; e.stopPropagation(); SECT[tab]=b.dataset.sect; show(b.dataset.sect); });
  const anchor=before||groups[0].nodes[0]; anchor.parentNode.insertBefore(nav,anchor); show(cur); }
const kids=P=>[...P.children];
const hasH=(el,re)=>{ const h=el.matches&&el.matches('h2,h4,h5')?el:el.querySelector&&el.querySelector('h2,h4,h5'); return !!(h&&re.test(h.textContent)); };
function applySections(){ const P=$('panel'); if(!P) return; const tab=S.tab, K=kids(P);
  if(tab==='settings'){ const grid=K.find(c=>c.classList.contains('grid')); if(!grid) return; const tiles=[...grid.children], pick=re=>tiles.filter(t=>hasH(t,re));
    const save=K.filter(c=>c!==grid&&(c.classList.contains('tile')||c.tagName==='DETAILS'));
    // the chosen tiles sit alone in the grid, so let the grid show one wide column
    sectionize(P,tab,[{name:'Sound',nodes:pick(/^Sound/)},{name:'Controls',nodes:pick(/^Controls/)},{name:'Display',nodes:pick(/^Display/)},{name:'Gameplay',nodes:pick(/^Gameplay/)},{name:'Patch notes',nodes:pick(/^Patch notes/)},{name:'Save & codes',nodes:save}],K.find(c=>c.classList.contains('tile')||c===grid));
    grid.classList.add('sect-one'); }
  else if(tab==='pets'){ const grid=K.find(c=>c.classList.contains('grid')), cust=K.filter(c=>c.classList.contains('tile')&&c!==grid); if(!grid) return; const T=[...grid.children], mine=T.filter(t=>t.querySelector('canvas[data-own="1"]')), more=T.filter(t=>!mine.includes(t));
    sectionize(P,tab,[{name:'Your pets · '+mine.length,nodes:mine},{name:'Find more · '+more.length,nodes:more},{name:'Customize',nodes:cust}],cust[0]||grid); }
  else if(tab==='feats'){ const grid=K.find(c=>c.classList.contains('grid')); if(!grid) return; const T=[...grid.children], todo=T.filter(t=>!t.classList.contains('done')), done=T.filter(t=>t.classList.contains('done'));
    sectionize(P,tab,[{name:'To do · '+todo.length,nodes:todo},{name:'Done · '+done.length,nodes:done}],grid); }
  else if(tab==='aquarium'){ const dec=K.find(c=>c.classList.contains('jsec')), head=K.slice(0,2), tank=K.filter(c=>!head.includes(c)&&c!==dec); sectionize(P,tab,[{name:'Your tank',nodes:tank},{name:'Decorate',nodes:dec?[dec]:[]}]); }
  else if(tab==='home'){ const i=K.findIndex(c=>c.tagName==='H5'&&/Decorations/.test(c.textContent)); if(i<0) return; const head=K.findIndex(c=>c.classList.contains('row')); const dock=K.slice(head+1,i).filter(c=>!c.classList.contains('pvbar')); sectionize(P,tab,[{name:'Dock',nodes:dock},{name:'Decorations',nodes:K.slice(i)}]); }
  else if(tab==='rods'){ const i1=K.findIndex(c=>c.tagName==='H2'&&/Rod rack/.test(c.textContent)), i2=K.findIndex(c=>c.tagName==='H2'&&/Attachments/.test(c.textContent)); if(i1<0||i2<0) return;
    sectionize(P,tab,[{name:'Your rod',nodes:K.slice(1,i1)},{name:'Rod rack',nodes:K.slice(i1,i2)},{name:'Attachments',nodes:K.slice(i2)}]); }
  else if(tab==='locs'||tab==='waters'||tab==='map'){ const grid=K.find(c=>c.classList.contains('grid')), js=K.filter(c=>c.classList.contains('jsec')); if(!grid||!js.length) return;
    sectionize(P,tab,[{name:'Waters',nodes:[grid]},...js.map(j=>({name:(j.querySelector('h2')||{}).textContent||'More',nodes:[j]}))]); } }
const _renderPanel_0 = renderPanel;
renderPanel = function(){ _renderPanel_0(); try{ applySections(); }catch(e){} };
document.head.insertAdjacentHTML('beforeend',`<style>.sect-nav{margin:10px 0 12px;flex-wrap:wrap} .sect-nav button{min-width:90px} #panel .grid.sect-one{grid-template-columns:minmax(0,1fr)}</style>`);
