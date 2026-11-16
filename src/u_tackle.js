
// =====================================================================
// 0.3 Tackle shop: three short sections (Gear, Bait, Special lures) instead of one very long page,
// compact bait rows with clear effect chips, and the bait you are using shown up top.
// =====================================================================
let tackleView='gear';
function baitChips(b){ const c=[]; if(b.speed&&b.speed!==1) c.push('Bites +'+Math.round((b.speed-1)*100)+'%'); if(b.rare) c.push('Rare odds +'+Math.round(b.rare*100)+'%'); if(b.shiny) c.push('Shiny ×'+b.shiny);
  if(b.night) c.push('×'+b.night+' rare at night'); if(b.calm) c.push('Calmer fish'); if(b.trophy) c.push('Trophy +'+Math.round(b.trophy*100)+'%'); if(b.treasure) c.push('Junk ×'+b.treasure); if(b.legend) c.push('Legendary ×'+b.legend); if(b.beh) c.push(b.beh.map(k=>BEH[k].n).join(', ')+' ×2.5');
  if(b.loc) c.push('Best at '+LOCS[locIdx(b.loc)].name); if(b.sea) c.push('Sea waters ×1.5'); return c.map(t=>`<span class="badge k">${esc(t)}</span>`).join(''); }
function baitRow([k,b]){ const using=S.baitSel===k;
  const buy = b.junk ? '<span class="meta">Found in junk</span>' : b.scales ? `<button class="btn sm" data-act="buybait" data-k="${k}" ${S.scales>=b.scales?'':'disabled'}>Buy ${b.pack} · ${b.scales} Scales</button>`
    : `<button class="btn sm" data-act="buybait" data-k="${k}" ${S.money>=b.price?'':'disabled'}>Buy ${b.pack} · <span class="coin">${fmtShort(b.price)}</span></button><button class="btn alt sm" data-act="buybait" data-k="${k}" data-n="5" ${S.money>=b.price*4.5?'':'disabled'} title="10% off">×${b.pack*5} · <span class="coin">${fmtShort(b.price*4.5)}</span></button>`;
  return `<div class="tk-row ${using?'on':''}"><div class="tk-main"><div class="row" style="gap:8px;align-items:baseline"><b>${b.name}</b><span class="meta">You have ${S.bait[k]||0}</span>${using?'<span class="badge g">In use</span>':''}</div>
    <div class="meta">${esc(b.note)}</div><div class="badges" style="justify-content:flex-start;margin-top:4px">${baitChips(b)}</div></div>
    <div class="tk-acts">${buy}<button class="btn alt sm" data-act="usebait" data-k="${k}" ${S.bait[k]>0&&!using?'':'disabled'}>${using?'In use':'Use'}</button></div></div>`; }
renderShop = function(P){ const shopBait=Object.entries(BAIT).filter(([k,b])=>k!=='worm'&&!b.junk), junkBait=Object.entries(BAIT).filter(([k,b])=>b.junk), cur=BAIT[S.baitSel]||BAIT.worm;
  const gearTiles = Object.entries(GEAR).map(([k,G2])=>{ const lv=S.gear[k], max=G2.lv.length-1, next=lv<max?G2.cost[lv+1]:0;
    return `<div class="tile"><div class="row spread"><h4>${G2.name}</h4><span class="meta">Level ${lv+1} / ${max+1}</span></div><div class="pips">${G2.lv.map((_,i)=>`<i class="${i<=lv?'on':''}"></i>`).join('')}</div>
    <div class="meta">${G2.what}</div><div class="val">${G2.fmt(G2.lv[lv])}${lv<max?` <span class="meta">→ ${G2.fmt(G2.lv[lv+1])}</span>`:''}</div>
    ${lv<max?`<button class="btn" data-act="buygear" data-k="${k}" ${S.money>=next?'':'disabled'}>Upgrade · <span class="coin">${fmt(next)}</span></button>`:'<button class="btn alt" disabled>Maxed out</button>'}</div>`; }).join('');
  const owned=junkBait.filter(([k])=>S.bait[k]>0).length;
  P.innerHTML=`<h2>Tackle shop</h2><p class="sub">Stronger line and a faster reel land heavier fish. Better bait brings rarer fish; one bait is used each time you set the hook.</p>
   <div class="tile tk-cur"><span class="meta">Bait in use</span><b>${cur.name}</b>${S.baitSel!=='worm'?`<span class="meta">${S.bait[S.baitSel]||0} left</span><button class="btn alt sm" data-act="usebait" data-k="worm">Switch to worms</button>`:'<span class="meta">Free and endless</span>'}</div>
   <div class="bwx-nav" role="tablist">${[['gear','Gear'],['bait','Bait · '+shopBait.length],['lures','Special lures · '+owned+'/'+junkBait.length]].map(([k,n])=>`<button role="tab" data-act="tackleview" data-k="${k}" aria-selected="${tackleView===k}">${n}</button>`).join('')}</div>
   ${tackleView==='bait'?`<div class="tk-list">${shopBait.map(baitRow).join('')}</div>`
    :tackleView==='lures'?`<p class="sub">These can’t be bought. They come out of junk you fish up: cheese, disco balls, magnets, gold.</p><div class="tk-list">${junkBait.map(baitRow).join('')}</div>`
    :`<div class="grid">${gearTiles}</div>`}`; };
const _extraAct2_2 = extraAct2;
extraAct2 = function(b){ if(b.dataset.act==='tackleview'){ tackleView=b.dataset.k; return 'render'; } return _extraAct2_2(b); };
document.head.insertAdjacentHTML('beforeend',`<style>
#panel .tk-cur{display:flex;flex-direction:row;align-items:center;gap:10px;flex-wrap:wrap;margin:10px 0}
.tk-list{display:flex;flex-direction:column;gap:8px}
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
