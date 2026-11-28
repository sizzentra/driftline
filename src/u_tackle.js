
// =====================================================================
// 0.3 Tackle shop: three short sections (Gear, Bait, Special lures) instead of one very long page,
// compact bait rows with clear effect chips, and the bait you are using shown up top.
// =====================================================================
let tackleView='gear';
function baitChips(b){ const c=[]; if(b.speed&&b.speed!==1) c.push('Bites +'+Math.round((b.speed-1)*100)+'%'); if(b.rare) c.push(b.rare<.35?'Slightly better odds':b.rare<.8?'Better odds':b.rare<1.3?'Great odds':'Best odds'); if(b.shiny) c.push('Shiny ×'+b.shiny);
  if(b.night) c.push('×'+b.night+' rare at night'); if(b.calm) c.push('Calmer fish'); if(b.trophy) c.push('Trophy +'+Math.round(b.trophy*100)+'%'); if(b.treasure) c.push('Junk ×'+b.treasure); if(b.legend) c.push('Legendary ×'+b.legend); if(b.beh) c.push(b.beh.map(k=>BEH[k].n).join(', ')+' ×1.9');
  if(b.loc) c.push('Best at '+LOCS[locIdx(b.loc)].name); if(b.sea) c.push('Sea waters ×1.5'); return c.map(t=>`<span class="badge k">${esc(t)}</span>`).join(''); }
function baitRow([k,b]){ const using=S.baitSel===k;
  const buy = b.junk ? '<span class="meta">Found in junk</span>' : b.scales ? `<button class="btn sm" data-act="buybait" data-k="${k}" ${S.scales>=b.scales?'':'disabled'}>Buy ${b.pack} · ${b.scales} Scales</button>`
    : `<button class="btn sm" data-act="buybait" data-k="${k}" ${S.money>=b.price?'':'disabled'}>Buy ${b.pack} · <span class="coin">${fmtShort(b.price)}</span></button><button class="btn alt sm" data-act="buybait" data-k="${k}" data-n="5" ${S.money>=b.price*4.5?'':'disabled'} title="10% off">×${b.pack*5} · <span class="coin">${fmtShort(b.price*4.5)}</span></button>`;
  return `<div class="tk-row ${using?'on':''}"><div class="tk-main"><div class="row" style="gap:8px;align-items:baseline"><b>${b.name}</b><span class="meta">You have ${S.bait[k]||0}</span>${using?'<span class="badge g">In use</span>':''}</div>
    <div class="meta">${esc(b.note)}</div><div class="badges" style="justify-content:flex-start;margin-top:4px">${baitChips(b)}</div></div>
    <div class="tk-acts">${buy}<button class="btn alt sm" data-act="usebait" data-k="${k}" ${S.bait[k]>0&&!using?'':'disabled'}>${using?'In use':'Use'}</button></div></div>`; }
/* C16 (director + Cam, 2026-11-20): bait in three groups (Everyday bait, Water baits, Favourite foods), each sorted by purchase price
   (coins first, then Scales), each group folds, and the page opens folded. One place for phones, PC windows and full-screen PC. */
const BAIT_GROUPS=[['Everyday bait','Works at every water'],['Water baits','Each one is best at its own water'],['Favourite foods','Every fish loves one food and dislikes one: the Fish Log shows which']];
const baitGrp=b=>b.junk?3:b.food?2:b.loc?1:0, baitCost=b=>b.scales?1e15+b.scales:(b.price||0);
const baitSorted=list=>list.slice().sort((x,y)=>baitGrp(x[1])-baitGrp(y[1])||baitCost(x[1])-baitCost(y[1]));
let baitFold=[true,true,true];
const baitFoldHead=(g,n,open)=>`<button type="button" class="bt-fold" data-act="baitfold" data-k="${g}" aria-expanded="${open}"><span class="bt-fold-t">${BAIT_GROUPS[g][0]} <em>${n}</em></span><span class="bt-fold-s">${BAIT_GROUPS[g][1]}</span></button>`;
function baitGroupsHTML(list){ const L=baitSorted(list); return '<div class="tk-list tk-groups">'+[0,1,2].map(g=>{ const rows=L.filter(e=>baitGrp(e[1])===g); if(!rows.length) return ''; const open=!baitFold[g]; return baitFoldHead(g,rows.length,open)+(open?`<div class="tk-list">${rows.map(baitRow).join('')}</div>`:''); }).join('')+'</div>'; } /* one wrapper: the phone Bait page copies the shop's .tk-list */
{ const _st=setTab; setTab=function(t){ if(t!==S.tab) baitFold=[true,true,true]; return _st.apply(this,arguments); }; } /* every visit opens folded */
actOn('baitfold', function(b){ const g=+b.dataset.k; if(g>=0&&g<3) baitFold[g]=!baitFold[g]; return 'render'; }); /* F6 slice 3: a second line here folded the groups again on "tackleview bait", but the tackleview action below always answered first, so it never ran (qc 262); removed with the chain, nothing changes */
function renderShop(P){ const shopBait=Object.entries(BAIT).filter(([k,b])=>k!=='worm'&&!b.junk), junkBait=Object.entries(BAIT).filter(([k,b])=>b.junk), cur=BAIT[S.baitSel]||BAIT.worm;
  const gearTiles = Object.entries(GEAR).filter(([k])=>k!=='cooler').map(([k,G2])=>{ /* the Cooler upgrade lives on the Cooler page (coolerUpHTML, e_ui.js) */ const lv=S.gear[k], max=G2.lv.length-1, next=lv<max?G2.cost[lv+1]:0;
    return `<div class="tile"><div class="row spread"><h4>${G2.name}</h4><span class="meta">Level ${lv} / ${max}</span></div><div class="pips">${G2.lv.slice(1).map((_,i)=>`<i class="${i<lv?"on":""}"></i>`).join('')}</div>
    <div class="meta">${G2.what}</div><div class="val">${G2.fmt(G2.lv[lv])}${lv<max?` <span class="meta">→ ${G2.fmt(G2.lv[lv+1])}</span>`:''}</div>
    ${lv<max?`<button class="btn" data-act="buygear" data-k="${k}" ${S.money>=next?'':'disabled'}>Upgrade · <span class="coin">${fmt(next)}</span></button>`:'<button class="btn alt" disabled>Maxed out</button>'}</div>`; }).join('');
  const owned=junkBait.filter(([k])=>S.bait[k]>0).length;
  P.innerHTML=`<h2>Tackle shop</h2><p class="sub">Stronger line and a faster reel land heavier fish. Better bait brings rarer fish; one bait is used each time you set the hook.</p>
   <div class="tile tk-cur"><span class="meta">Bait in use</span><b>${cur.name}</b>${S.baitSel!=='worm'?`<span class="meta">${S.bait[S.baitSel]||0} left</span><button class="btn alt sm" data-act="usebait" data-k="worm">Switch to worms</button>`:'<span class="meta">Free and endless</span>'}</div>
   <div class="bwx-nav" role="tablist">${[['gear','Gear'],['bait','Bait · '+shopBait.length],['lures','Special lures · '+owned+'/'+junkBait.length]].map(([k,n])=>`<button role="tab" data-act="tackleview" data-k="${k}" aria-selected="${tackleView===k}">${n}</button>`).join('')}</div>
   ${tackleView==='bait'?baitGroupsHTML(shopBait)
    :tackleView==='lures'?`<p class="sub">These can’t be bought. They come out of junk you fish up: cheese, disco balls, magnets, gold.</p><div class="tk-list">${junkBait.map(baitRow).join('')}</div>`
    :`<div class="grid">${gearTiles}</div>`}`; };
actOn('tackleview', function(b){ tackleView=b.dataset.k; return 'render'; });
document.head.insertAdjacentHTML('beforeend',`<style>
#panel .tk-cur{display:flex;flex-direction:row;align-items:center;gap:10px;flex-wrap:wrap;margin:10px 0}
.tk-list{display:flex;flex-direction:column;gap:8px}
.bt-fold{display:grid;grid-template-columns:minmax(0,1fr) auto;align-items:center;gap:2px 10px;width:100%;margin:10px 0 6px;padding:10px 12px;border-radius:12px;background:var(--glass,#16243a);border:1px solid var(--line);color:#fff;text-align:left;cursor:pointer;font:inherit}
.bt-fold::after{content:"Show";grid-column:2;grid-row:1 / span 2;font:700 12px system-ui;color:#7fe3c4}.bt-fold[aria-expanded="true"]::after{content:"Hide";color:#9fb2c8}
.bt-fold-t{font:800 15px var(--display,system-ui)}.bt-fold-t em{font-style:normal;font-weight:700;font-size:12px;color:#9fb2c8;margin-left:4px}.bt-fold-s{grid-column:1;font:600 12px system-ui;color:#9fb2c8}
.tk-row{display:flex;gap:12px;align-items:center;justify-content:space-between;padding:10px 12px;border-radius:14px;background:var(--glass,#16243a);border:1px solid var(--line);box-shadow:inset 0 1px 0 #ffffff10}
.tk-row.on{border-color:#ffd36a66;box-shadow:inset 0 1px 0 #ffffff10,0 0 18px #ffd36a1a}
.tk-main{min-width:0;flex:1}
.tk-main b{color:#fff}
.tk-acts{display:flex;gap:6px;flex-wrap:wrap;justify-content:flex-end;flex:0 0 auto}
@media (max-width:620px){ .tk-row{flex-direction:column;align-items:stretch} .tk-acts{justify-content:flex-start} }
</style>`);
document.head.insertAdjacentHTML('beforeend',`<style>#panel .pass-next{display:flex;flex-direction:row;gap:14px;align-items:center;margin:10px 0;border-color:#b9a2ff66;box-shadow:inset 0 1px 0 #ffffff12,0 0 22px #b9a2ff1f}
#panel .pass-next canvas{width:160px;height:120px;flex:0 0 auto;border-radius:12px;background:radial-gradient(circle at 50% 60%,#24365a,#101a2c)}
@media (max-width:520px){ #panel .pass-next{flex-direction:column;align-items:flex-start} }</style>`);
