// =====================================================================
// 0.3.1 sort and filter for the decoration shops (aquarium and Home).
// A small bar above the aquarium's decorations: sort by price, name or bonus, show all / owned / for sale,
// and in the aquarium pick a bonus kind. It only reorders and hides the tiles that are already there,
// so it is instant; your choice is remembered on this device.
// =====================================================================
const SHOPT=(()=>{ let o={aq:{sort:'price',show:'all',kind:'all'},home:{sort:'price',show:'all'}}; try{ const v=JSON.parse(localStorage.getItem('dl-shoptools')||'null'); if(v&&v.aq&&v.home) o=Object.assign(o,v); }catch(e){} return o; })();
function shoptSave(){ try{ localStorage.setItem('dl-shoptools',JSON.stringify(SHOPT)); }catch(e){} }
function shopTools(){ const P=$('panel'); if(!P) return;
  const aqTile=P.querySelector('canvas[data-decor]');
  if(aqTile) shopToolsFor(aqTile.closest('.grid'),'aq'); }
function shopItem(tile){ const cv=tile.querySelector('canvas[data-decor]'); if(!cv) return null; const id=cv.dataset.decor, d=DECORI[id]; if(!d) return null; const own=S.aq.owned.includes(id);
  return {id,d,own,name:d.name,price:+d.price||0,forSale:!own&&(+d.price>0),bonus:decorVal(d),kind:decorKind(id)}; }
function shopToolsFor(grid,which){ if(!grid||!grid.isConnected||!grid.parentNode) return; /* 0.4.9 QC: a filter chip that outlived a redraw no longer throws */ const st=SHOPT[which], tiles=[...grid.children].filter(t=>t.classList.contains('tile'));
  const items=tiles.map(t=>({t,it:shopItem(t)})).filter(x=>x.it);
  // aquarium tiles say what kind of bonus they give
  if(which==='aq') for(const {t,it} of items){ const m=t.querySelector('.meta'); if(m&&/income$/.test(m.textContent.trim())) m.innerHTML=`+${Math.round(it.bonus*100)}% ${DECOR_KIND_NAME[it.kind]}`; if(!t.querySelector('.dkind')){ const b=document.createElement('span'); b.className='dkind k-'+it.kind; b.textContent=DECOR_KIND_SHORT[it.kind]; t.insertBefore(b,t.firstChild); } }
  let bar=grid.previousElementSibling; if(!bar||!bar.classList||!bar.classList.contains('shoptools')){ bar=document.createElement('div'); bar.className='shoptools'; grid.parentNode.insertBefore(bar,grid); }
  const chip=(grp,v,label,cur)=>`<button type="button" class="chipb" data-st="${grp}" data-v="${v}" aria-pressed="${cur===v}">${label}</button>`;
  const sorts=[['price','Price: low to high'],['pricehi','Price: high to low'],['name','Name A to Z'],['bonus','Bonus: biggest first']];
  bar.innerHTML=`<label class="st-sort">Sort <select data-st="sort">${sorts.map(([v,n])=>`<option value="${v}" ${st.sort===v?'selected':''}>${n}</option>`).join('')}</select></label>
    <div class="chips">${chip('show','all','All',st.show)}${chip('show','owned','Owned',st.show)}${chip('show','sale','For sale',st.show)}</div>
    ${which==='aq'?`<div class="chips">${chip('kind','all','Any bonus',st.kind)}${chip('kind','income','Income',st.kind)}${chip('kind','boost','Fish buffs',st.kind)}${chip('kind','show','Showpiece',st.kind)}</div>`:''}`;
  bar.querySelector('select').onchange=e=>{ st.sort=e.target.value; shoptSave(); shopToolsFor(grid,which); };
  bar.querySelectorAll('button[data-st]').forEach(b=>b.onclick=()=>{ st[b.dataset.st]=b.dataset.v; shoptSave(); shopToolsFor(grid,which); });
  const cmp={ price:(a,b)=>(a.price||1e15)-(b.price||1e15)||a.name.localeCompare(b.name), pricehi:(a,b)=>(b.price||-1)-(a.price||-1)||a.name.localeCompare(b.name), name:(a,b)=>a.name.localeCompare(b.name), bonus:(a,b)=>b.bonus-a.bonus||a.name.localeCompare(b.name) }[st.sort]||((a,b)=>0);
  items.sort((A,B)=>cmp(A.it,B.it)).forEach(({t})=>grid.appendChild(t));
  let shown=0; for(const {t,it} of items){ const ok=(st.show==='all'||(st.show==='owned'?it.own:it.forSale))&&(which!=='aq'||st.kind==='all'||it.kind===st.kind); t.style.display=ok?'':'none'; if(ok) shown++; }
  let none=grid.querySelector('.st-none'); if(!shown){ if(!none){ none=document.createElement('p'); none.className='meta st-none'; none.style.gridColumn='1/-1'; grid.appendChild(none); } none.textContent='Nothing here with these filters.'; } else if(none) none.remove(); }
const _renderPanel_st = renderPanel;
renderPanel = function(){ const r=_renderPanel_st.apply(this,arguments); try{ shopTools(); }catch(e){ console.error(e); } return r; };
document.head.insertAdjacentHTML('beforeend',`<style>
.shoptools{display:flex;flex-wrap:wrap;gap:8px 14px;align-items:center;margin:4px 0 10px}.shoptools .chips{margin:0}
.st-sort{display:flex;align-items:center;gap:6px;font-size:13px;opacity:.9}.st-sort select{font:inherit;font-size:13px;padding:5px 8px;border-radius:10px;border:1px solid rgba(255,255,255,.18);background:rgba(10,24,36,.6);color:inherit}
.dkind{align-self:center;font-size:10.5px;font-weight:700;letter-spacing:.03em;padding:2px 8px;border-radius:999px;background:rgba(255,215,110,.16);color:#ffd36a}
.dkind.k-boost{background:rgba(110,200,255,.16);color:#8fd4ff}.dkind.k-show{background:rgba(255,130,220,.16);color:#ff9ae0}
</style>`);
