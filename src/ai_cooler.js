
// =====================================================================
// 0.3 catch card quick actions: sell the fish you just landed or put it straight in the aquarium.
// Tapping anywhere else keeps it in the cooler, as always. (The Cooler stays a normal menu tab.)
// =====================================================================
stepOn('showCard', { after(){ const old=$('cardq'); if(old) old.remove(); const ce=G.lastEntry; G.lastEntry=null; if(!ce||!S.cooler.includes(ce)){ const t=$('cardin').querySelector('.tap'); if(t) t.textContent=PLAT.touch()?'Tap to dismiss':'Click to dismiss'; return; } /* C1 (director + Cam, 2026-11-20): an oddity or other non-fish catch kept the last fish card's "keep it in your cooler" line */
  const tankFree=S.tank.length<aqCap(), price=salePrice(ce), d=document.createElement('div'); d.id='cardq'; d.className='cardq';
  d.innerHTML=`<button class="btn sm" data-q="sell">Sell · <span class="coin">${fmt(price)}</span></button><button class="btn alt sm" data-q="tank" ${tankFree?'':'disabled title="Your aquarium is full"'}>To aquarium</button>`;
  const tap=$('cardin').querySelector('.tap'); $('cardin').insertBefore(d,$('cardbadges'));
  d.addEventListener('pointerdown',e=>{ e.stopPropagation(); const b=e.target.closest('[data-q]'); if(!b||b.disabled) return; const i=S.cooler.indexOf(ce); if(i<0){ hideCard(); return; }
    if(b.dataset.q==='sell'){ const c=earn(salePrice(ce)); S.cooler.splice(i,1); sfx.coin(); toast('Sold for '+fmt(c)+' coins.'); }
    else if(S.tank.length<aqCap()){ accrue(); S.tank.push(ce); S.cooler.splice(i,1); toast(SPI[ce.id].name+' is on display'+(aqEff(ce)?': '+aqTxt(ce):'')+'.'); }
    save(); hideCard(); if(S.tab==='cooler'||S.tab==='aquarium') renderPanel(); });
  if(tap) tap.textContent='Tap anywhere else to keep it in your cooler'; } });
document.head.insertAdjacentHTML('beforeend',`<style>
.cardq{display:flex;gap:8px;justify-content:center;margin:6px 0 8px}.cardq .btn{min-width:120px}@media (max-width:560px){.card canvas{width:128px!important;height:64px!important}.cardq .btn{min-width:0;flex:1}.card #carddesc{font-size:12px}}
</style>`);
