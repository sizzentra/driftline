
// =====================================================================
// 0.3 cooler, less menu: sell or display a fish right from the catch card, a "Sell all" pill on the
// water, the Cooler counter at the top opens the cooler (it no longer takes a spot in the menu grid),
// and an optional auto-sell when the cooler is full.
// =====================================================================
function coolerSellAll(){ const sell=S.cooler.filter(f=>!isProtected(f)); if(!sell.length) return 0; const tot=earn(sell.reduce((a,f)=>a+salePrice(f),0)); S.cooler=S.cooler.filter(f=>isProtected(f)); sfx.coin(); save(); return [sell.length,tot]; }
// ---- catch card: Sell / To aquarium for the fish you just landed (tap anywhere else to keep it)
const _showCard_cq = showCard;
showCard = function(o){ _showCard_cq(o); const old=$('cardq'); if(old) old.remove(); const ce=G.lastEntry; G.lastEntry=null; if(!ce||!S.cooler.includes(ce)) return;
  const tankFree=S.tank.length<aqCap(), price=salePrice(ce), d=document.createElement('div'); d.id='cardq'; d.className='cardq';
  d.innerHTML=`<button class="btn sm" data-q="sell">Sell · <span class="coin">${fmt(price)}</span></button><button class="btn alt sm" data-q="tank" ${tankFree?'':'disabled title="Your aquarium is full"'}>To aquarium</button>`;
  const tap=$('cardin').querySelector('.tap'); $('cardin').insertBefore(d,$('cardbadges'));
  d.addEventListener('pointerdown',e=>{ e.stopPropagation(); const b=e.target.closest('[data-q]'); if(!b||b.disabled) return; const i=S.cooler.indexOf(ce); if(i<0){ hideCard(); return; }
    if(b.dataset.q==='sell'){ const c=earn(salePrice(ce)); S.cooler.splice(i,1); sfx.coin(); toast('Sold for '+fmt(c)+' coins.'); }
    else if(S.tank.length<aqCap()){ accrue(); S.tank.push(ce); S.cooler.splice(i,1); toast(SPI[ce.id].name+' is on display'+(aqEff(ce)?': '+aqTxt(ce):'')+'.'); }
    save(); hideCard(); coolerPill(); if(S.tab==='cooler'||S.tab==='aquarium') renderPanel(); });
  if(tap) tap.textContent='Tap anywhere else to keep it in your cooler'; };
// ---- the "Sell all" pill on the water
function coolerPill(){ let p=$('sellpill'); const st=$('stage'); if(!st) return; if(!p){ p=document.createElement('button'); p.id='sellpill'; p.type='button'; p.className='sellpill'; st.appendChild(p);
    p.addEventListener('click',e=>{ e.stopPropagation(); const r=coolerSellAll(); if(r){ toast('Sold '+r[0]+' fish for '+fmt(r[1])+' coins'+(S.cooler.length?' (rare fish kept)':'')+'.'); } coolerPill(); if(S.tab==='cooler') renderPanel(); });
    p.addEventListener('pointerdown',e=>e.stopPropagation()); }
  const sell=S.cooler.filter(f=>!isProtected(f)), tot=sell.reduce((a,f)=>a+salePrice(f),0), busy=G.st!=='idle'&&G.st!=='rest';
  p.hidden=!sell.length||busy; if(sell.length) p.innerHTML='Sell all · <span class="coin">'+fmt(tot)+'</span>'; }
setInterval(()=>{ try{ coolerPill(); }catch(e){} },700);
// ---- the Cooler counter at the top opens the cooler; the menu grid no longer has a Cooler button
(function(){ const chip=$('coolerct')&&$('coolerct').closest('.stat'); if(chip){ chip.classList.add('statbtn'); chip.setAttribute('role','button'); chip.tabIndex=0; chip.title='Open your cooler';
    const go=()=>{ setTab('cooler'); save(); $('panel').scrollIntoView({behavior:'smooth',block:'start'}); }; chip.addEventListener('click',go); chip.addEventListener('keydown',e=>{ if(e.key==='Enter'||e.key===' '){ e.preventDefault(); go(); } }); }
  const tb=document.querySelector('#tabs [data-tab="cooler"]'); if(tb) tb.remove(); if(S.tab==='cooler') S.tab='cooler'; })();
document.head.insertAdjacentHTML('beforeend',`<style>
.cardq{display:flex;gap:8px;justify-content:center;margin:6px 0 8px}.cardq .btn{min-width:120px}@media (max-width:560px){.card canvas{width:128px!important;height:64px!important}.cardq .btn{min-width:0;flex:1}.card #carddesc{font-size:12px}}
.sellpill{position:absolute;left:84px;bottom:10px;z-index:3;border:1px solid rgba(255,255,255,.18);background:rgba(10,20,34,.72);color:var(--ink);font:600 12px system-ui;padding:6px 12px;border-radius:999px;cursor:pointer;backdrop-filter:blur(4px)}
.sellpill:hover{background:rgba(20,34,54,.85)}.sellpill[hidden]{display:none}
.hud .statbtn{cursor:pointer}.hud .statbtn:hover{border-color:var(--gold)}.hud .statbtn:focus-visible{outline:2px solid var(--gold)}
</style>`);
