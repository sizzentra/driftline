// =====================================================================
// 0.3.5 Trophy Room (placeholder name): a permanent home for any fish you choose. Fish kept here earn nothing
// and give no boosts, but they stay forever: a new voyage never touches them (S.vault is not part of the
// voyage reset). It lives in the Collection section. Later it can grow into a custom island of your own.
// =====================================================================
const VAULT_MAX=500; // generous; keeps saves and transfer codes a sensible size
function vaultList(){ if(!Array.isArray(S.vault)) S.vault=[]; return S.vault; }
vaultList();
/* a load makes sure the vault is a list: a step of migrate() in c_logic.js */

// the page button (hidden like the others; the Collection section shows it as a pill)
{ const T=$('tabs'), after=T&&T.querySelector(':scope > [data-tab="aquarium"]'); if(after&&!T.querySelector(':scope > [data-tab="trophy"]')) after.insertAdjacentHTML('afterend','<button role="tab" data-tab="trophy" aria-selected="false" data-label="🏛️ Trophy Room">🏛️ Trophy Room</button>'); }
{ const c=MENU_SECS.find(s=>s.id==='coll'); if(c&&!c.tabs.includes('trophy')) c.tabs.splice(1,0,'trophy'); }

function vaultKeep(f,from){ const V=vaultList(); if(V.length>=VAULT_MAX){ toast('The Trophy Room is full ('+VAULT_MAX+' fish). Take one out to make room.'); return false; }
  const e=Object.assign({},f); e.kept=Date.now(); if(!e.loc&&SPI[f.id]) e.loc=SPI[f.id].loc; V.push(e); sfx.catch&&tone(880,.12,'triangle',.05); tone(1320,.18,'sine',.035,0,.08);
  toast(SPI[f.id].name+' is mounted in the Trophy Room. It stays there forever, even on a new voyage.'); return true; }

const VAULT_SORTS=[['rar','Rarest'],['kg','Heaviest'],['new','Newest'],['water','By water']];
function vaultSorted(){ const V=vaultList().map((f,i)=>({f,i})), k=S.settings.vaultSort||'rar', sp=x=>SPI[x.f.id]||{r:0,name:'',loc:''};
  const by={rar:(a,b)=>sp(b).r-sp(a).r||(b.f.sh||0)-(a.f.sh||0)||b.f.kg-a.f.kg, kg:(a,b)=>b.f.kg-a.f.kg, new:(a,b)=>(b.f.kept||0)-(a.f.kept||0), water:(a,b)=>locIdx(sp(a).loc)-locIdx(sp(b).loc)||sp(b).r-sp(a).r||b.f.kg-a.f.kg};
  return V.sort(by[k]||by.rar); }
function vaultDate(t){ if(!t) return ''; try{ return new Date(t).toLocaleDateString(undefined,{day:'numeric',month:'short',year:'numeric'}); }catch(e){ return ''; } }

function renderTrophy(P){ const V=vaultList(), species=new Set(V.map(f=>f.id)).size, total=SP.length, cool=S.cooler.length<gv('cooler'), k=S.settings.vaultSort||'rar';
  const plaques=vaultSorted().map(({f,i})=>{ const sp=SPI[f.id]; if(!sp) return ''; const L=LOCS[locIdx(sp.loc)], gold=sp.r>=4, sh=f.sh===2?'prism':f.sh?'shiny':'';
    return `<div class="tp-item"><div class="tp-plaque ${gold?'gold':''} ${sh}"><canvas width="128" height="64" data-fish="${f.id}" data-sh="${f.sh||0}" data-pv="${f.pv||''}"></canvas>${sh?`<span class="tp-star" aria-hidden="true">${f.sh===2?'✦✦':'✦'}</span>`:''}</div>
      <div class="tp-plate"><b style="color:${gold?'#3a2206':'#2a1a08'}">${esc(sp.name)}</b><span>${RAR[sp.r].k} · ${kgStr(f.kg)}${nibFedTxt(f)}</span></div>
      <div class="tp-meta">${esc(L?L.name:'')}${f.kept?' · kept '+vaultDate(f.kept):''}</div>
      <button class="btn alt sm tp-out" data-vo="${i}" ${cool?'':'disabled'} title="${cool?'Move it back to your cooler':'Your cooler is full'}">To cooler</button></div>`; }).join('');
  P.innerHTML=`<div class="tp-room"><div class="tp-glow"></div><div class="tp-in">
    <div class="tp-head"><div><h2 class="tp-title">Trophy Room</h2><p class="tp-sub">A permanent home for the fish you love. Fish here earn nothing and give no boosts, but they stay forever: a new voyage never touches them.</p></div>
      <div class="tp-count"><b>${V.length}</b> mounted<span>${species} of ${total} species</span></div></div>
    ${V.length?`<div class="tp-sort" role="group" aria-label="Sort">${VAULT_SORTS.map(([id,n])=>`<button class="chipb" data-vs="${id}" aria-pressed="${k===id}">${n}</button>`).join('')}</div><div class="tp-grid">${plaques}</div>`
      :`<div class="tp-empty"><div class="tp-plaque tp-ghost"></div><p><b>No trophies yet.</b> Press <b>Keep</b> on any fish in your Cooler or Aquarium to mount it here for good.</p></div>`}
    <p class="tp-foot">${V.length>=VAULT_MAX?'The room is full. Take a fish out to make space.':`Room for ${VAULT_MAX-V.length} more.`}</p>
  </div></div>`;
  paintFish(P); try{ shineDecorate(P); }catch(e){} }

// the Trophy Room page, and Keep buttons on cooler and aquarium fish
const _renderPanel_tp=renderPanel;
renderPanel=function(){ if(S.tab==='trophy'){ const P=$('panel'); renderTrophy(P); try{ menuSync(); if(P.dataset.tab035!=='trophy'){ P.dataset.tab035='trophy'; pageIn(P); } }catch(e){} return; } return _renderPanel_tp.apply(this,arguments); };
function vaultButtons(P){ const add=(row,attr,i)=>{ const acts=row.querySelector('.acts'); if(!acts||acts.querySelector('[data-vk],[data-vt]')) return; acts.insertAdjacentHTML('afterbegin',`<button class="btn alt sm tp-keep" ${attr}="${i}" title="Mount it in the Trophy Room forever (no income or boosts, never lost on a new voyage)">🏛️ Keep</button>`); };
  if(S.tab==='cooler') P.querySelectorAll('.fishrow').forEach(row=>{ const ib=row.querySelector('[data-act="totank"][data-i]'); if(ib) add(row,'data-vk',ib.dataset.i); });
  if(S.tab==='aquarium') P.querySelectorAll('.fishrow').forEach(row=>{ const ib=row.querySelector('[data-act="untank"][data-i]'); if(ib) add(row,'data-vt',ib.dataset.i); }); }
const _renderPanel_tp2=renderPanel;
renderPanel=function(){ const r=_renderPanel_tp2.apply(this,arguments); try{ if(S.tab==='cooler'||S.tab==='aquarium') vaultButtons($('panel')); }catch(e){} return r; };

$('panel').addEventListener('click',e=>{ const b=e.target.closest('[data-vk],[data-vt],[data-vo],[data-vs]'); if(!b||b.disabled) return; e.stopPropagation();
  if(b.dataset.vs){ S.settings.vaultSort=b.dataset.vs; save(); renderPanel(); return; }
  if(b.dataset.vk!=null){ const f=S.cooler[+b.dataset.vk]; if(f&&vaultKeep(f)){ S.cooler.splice(+b.dataset.vk,1); } }
  else if(b.dataset.vt!=null){ const f=S.tank[+b.dataset.vt]; if(f){ accrue(); if(vaultKeep(f)) S.tank.splice(+b.dataset.vt,1); } }
  else if(b.dataset.vo!=null){ if(S.cooler.length>=gv('cooler')){ toast('Your cooler is full.'); return; } const V=vaultList(), f=V[+b.dataset.vo]; if(!f) return; V.splice(+b.dataset.vo,1); const c=Object.assign({},f); delete c.kept; S.cooler.push(c); toast(SPI[c.id].name+' is back in your cooler.'); }
  save(); renderPanel(); if(typeof refreshAll==='function') try{ refreshAll(); }catch(e){} },true);

if(/[?&]test\b/.test(location.search)) window.__vault=()=>vaultList();

document.head.insertAdjacentHTML('beforeend',`<style>
.tp-room{position:relative;border-radius:18px;overflow:hidden;border:2px solid #5a3a20;background:repeating-linear-gradient(90deg,#3c2615 0 86px,#2f1d10 86px 89px),#3a2414;box-shadow:inset 0 0 90px #000a,0 10px 30px #02060f88;margin-top:4px}
.tp-glow{position:absolute;inset:0;pointer-events:none;background:radial-gradient(ellipse 70% 38% at 50% 0%,#ffd99633,transparent 70%),linear-gradient(180deg,transparent 70%,#00000055)}
.tp-in{position:relative;padding:18px 20px 14px;display:flex;flex-direction:column;gap:14px}
.tp-head{display:flex;gap:14px;align-items:flex-end;flex-wrap:wrap}.tp-head>div:first-child{flex:1 1 280px;min-width:0}
.tp-title{margin:0;font-family:'Cormorant Garamond',Georgia,'Times New Roman',serif;font-weight:700;font-size:34px;letter-spacing:.02em;color:#f6dca6;text-shadow:0 2px 0 #1a0e06,0 0 22px #ffcf7a33}
.tp-sub{margin:2px 0 0;color:#e1c79e;font-size:13.5px;line-height:1.4;max-width:62ch}
.tp-count{display:flex;flex-direction:column;align-items:flex-end;background:linear-gradient(180deg,#f0d48c,#b98a3c);color:#2a1a08;border-radius:8px;padding:6px 12px;box-shadow:0 2px 0 #5a3a12,inset 0 1px 0 #fff4c8aa;font-size:13px;font-weight:800}
.tp-count b{font-size:20px;line-height:1}.tp-count span{font-size:11px;font-weight:700;opacity:.8}
.tp-sort{display:flex;gap:6px;flex-wrap:wrap}
.tp-sort .chipb{background:#2a1a0ecc;border-color:#7a5430;color:#e8d2aa}.tp-sort .chipb[aria-pressed="true"]{border-color:#f0d48c;color:#fff1cc;box-shadow:0 0 0 1px #f0d48c55,0 0 14px #f0d48c33}
.tp-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(170px,1fr));gap:20px 16px}
.tp-item{display:flex;flex-direction:column;align-items:center;gap:7px;position:relative}
.tp-item::before{content:"";position:absolute;top:-14px;left:50%;width:150px;height:110px;transform:translateX(-50%);background:radial-gradient(ellipse at 50% 0%,#ffdca033,transparent 70%);pointer-events:none}
.tp-plaque{position:relative;width:100%;max-width:190px;height:104px;border-radius:50%/46%;background:radial-gradient(ellipse at 38% 28%,#946238,#4a2c16 72%);border:2px solid #24130a;box-shadow:0 9px 14px #000a,inset 0 2px 0 #ffdcae40,inset 0 -6px 12px #0006;display:flex;align-items:center;justify-content:center}
.tp-plaque::after{content:"";position:absolute;inset:7px;border-radius:50%/46%;border:1px solid #c89a6a33;pointer-events:none}
.tp-plaque.gold{border:3px solid #e2b860;box-shadow:0 9px 14px #000a,0 0 18px #ffcf6a33,inset 0 2px 0 #ffdcae40}
.tp-plaque canvas{width:128px;height:64px;filter:drop-shadow(0 3px 2px #0008)}
.tp-star{position:absolute;top:8px;right:18px;color:#fff3c0;font-size:15px;text-shadow:0 0 8px #ffd36acc;animation:tptw 2.4s ease-in-out infinite}
.tp-plaque.prism .tp-star{color:#ffd6f6;text-shadow:0 0 8px #ff9ae6cc}
@keyframes tptw{0%,100%{opacity:.55;transform:scale(.9)}50%{opacity:1;transform:scale(1.15)}}
.tp-plate{background:linear-gradient(180deg,#f2d68e,#b98a3e);border-radius:4px;padding:4px 12px 5px;text-align:center;box-shadow:0 2px 0 #5a3a12,inset 0 1px 0 #fff6d0bb;min-width:130px;max-width:100%;box-sizing:border-box}
.tp-plate b{display:block;font-family:'Cormorant Garamond',Georgia,serif;font-size:16px;line-height:1.15}
.tp-plate span{display:block;font-size:10.5px;font-weight:800;color:#3a2610;letter-spacing:.02em}
.tp-meta{font-size:11px;color:#d8bf98;text-align:center}
.tp-out{opacity:.85}.tp-item:hover .tp-out{opacity:1}
.tp-empty{display:flex;align-items:center;gap:18px;flex-wrap:wrap;padding:8px 0}.tp-empty p{margin:0;color:#ecd6ae;max-width:46ch;line-height:1.45}
.tp-ghost{width:170px;max-width:170px;background:transparent;border:2px dashed #f6dca666;box-shadow:none}
.tp-foot{margin:0;font-size:11.5px;color:#cdb38c;text-align:right}
.tp-keep{white-space:nowrap}
@media (max-width:520px){.tp-in{padding:14px 12px 12px}.tp-title{font-size:28px}.tp-grid{grid-template-columns:repeat(2,minmax(0,1fr));gap:16px 10px}.tp-plaque{height:88px}.tp-plaque canvas{width:104px;height:52px}.tp-plate{min-width:0;width:100%;padding:3px 6px}.tp-plate b{font-size:14px}}
@media (prefers-reduced-motion:reduce){.tp-star{animation:none}}
</style>`);
