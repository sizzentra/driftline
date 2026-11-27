// =====================================================================
// Inspect (Cam, round 5: "Inspect button on fish to see a Fish Card similar to what is seen when you fish up a fish - showing those
// additional details about that fish in particular. Added to cooler and Aquarium"). Shared by every platform.
//  - An Inspect button on every Cooler and Aquarium row (and the fish picture itself) opens a card shaped like the catch card:
//    the fish, its rarity line and name, weight / value / income, its tags (shiny, prismatic, hybrid, trophy), its aquarium boost,
//    Nibbles eaten, mastery and your record for the species, and its Fish Log note.
//  - Its own card, not the catch card: closing the catch card moves the fishing on (mini-games, quick sell), this one only closes.
// =====================================================================
function inspectBtn(where,i){ if(!FEATURE.inspect) return ''; /* switched off (b_data.js FEATURE): no button, so the card is never opened */ return `<button type="button" class="btn alt sm insp-btn" data-act="inspect" data-k="${where}" data-i="${i}" title="See this fish’s card">Inspect</button>`; }
function inspectClose(){ const o=$('inspcard'); if(o) o.remove(); }
function inspectOpen(where,i){ const L=where==='tank'?S.tank:S.cooler, f=L[i], sp=f&&SPI[f.id]; if(!sp) return 'skip'; inspectClose();
  const rar=(f.sh===2?PRISM[f.pv||'rainbow'].n+' prismatic ':f.sh?'Shiny ':'')+(f.hy?'hybrid ':'')+RAR[sp.r].k, col=f.sh===2?PRISM[f.pv||'rainbow'].c:f.sh?'var(--gold)':RAR[sp.r].c;
  const j=S.journal&&S.journal[sp.id], ms=mastery(sp.id), hy=f.hy&&SPI[f.hy];
  const nums=[['Weight',kgStr(f.kg)],['Sells for',fmt(salePrice(f)),1],[where==='tank'?'Earns':'Would earn',fmt(Math.round(fishRate(f)*60))+' / h',1]];
  const badges=[];
  if(hy) badges.push(['k','Hybrid with '+hy.name]); if(f.trophy) badges.push(['g','Trophy size']);
  badges.push(['k','Aquarium: '+aqTxt(f)]); if(f.fed) badges.push(['','Ate '+NIB_WORD(f.fed)]);
  if(ms) badges.push(['g','Mastery '+'★'.repeat(ms)]); if(j&&j.best) badges.push(['','Your record: '+kgStr(j.best)+(j.n?' · caught '+fmt(j.n):'')]);
  const h=`<div class="card insp-card" id="inspcard" role="dialog" aria-modal="true" aria-label="${esc(sp.name)}"><div class="in${f.sh?' shiny':''}">
    <canvas width="440" height="220" data-fish="${f.id}" data-sh="${f.sh||0}" data-pv="${f.pv||''}"></canvas>
    <div class="rar" style="color:${col}">${esc(rar)}</div><h3>${esc(sp.name)}</h3>
    <div class="badges">${badges.map(b=>`<span class="badge ${b[0]}">${esc(b[1])}</span>`).join('')}</div>
    <div class="nums">${nums.map(n=>`<div><span>${esc(n[0])}</span><b${n[2]?' class="coin"':''}>${esc(n[1])}</b></div>`).join('')}</div>
    <div class="sub">${esc(sp.note||'')}</div><div class="tap">${PLAT.touch()?'Tap to close':'Click or press Esc to close'}</div></div></div>`;
  document.body.insertAdjacentHTML('beforeend',h); const o=$('inspcard'); o.addEventListener('pointerup',e=>{ e.stopPropagation(); inspectClose(); }); try{ paintFish(o); }catch(e){} return 'skip'; }
document.addEventListener('keydown',e=>{ if(e.key==='Escape'&&$('inspcard')){ inspectClose(); e.preventDefault(); e.stopPropagation(); } },true);
document.head.insertAdjacentHTML('beforeend','<style>#inspcard{position:fixed;z-index:70;padding:12px calc(12px + env(safe-area-inset-right)) calc(12px + env(safe-area-inset-bottom)) calc(12px + env(safe-area-inset-left))}#inspcard canvas{width:220px;height:110px;max-width:100%;display:block;margin:0 auto}#inspcard .badges{justify-content:center;flex-wrap:wrap;gap:4px;margin:6px 0}#inspcard .in{max-height:calc(100% - 8px)}@media (max-height:500px){#inspcard canvas{width:160px;height:80px}}</style>');
