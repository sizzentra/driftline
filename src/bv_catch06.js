// =====================================================================
// Catch popup, hybrids (director, 2026-11-18: "make sure hybrid fish stat changes are shown in the initial fish catch pop
// up"). Shared by every platform: a hybrid's card says how much heavier than usual it is, how much its value rose for being
// a hybrid, and both aquarium boosts it carries (with the hybrid's ×1.5 already counted in).
// =====================================================================
{ const _sc=showCard; showCard=function(o){ const ce=G.lastEntry; _sc(o); try{ if(!ce||!ce.hy) return; const sp=SPI[ce.id], other=SPI[ce.hy]; if(!sp) return; const b=$('cardbadges'); if(!b||b.querySelector('.hy-stats')) return;
      const avg=(sp.min+sp.max)/2, R=ce.kg/avg, bonus=clamp(Math.pow(R,.85)*(1+.6*Math.abs(Math.log(R))),.3,25)/Math.max(.0001,Math.pow(R,.85));
      const boosts=aqBuffsOf(ce).map(x=>fmtB(x.k,x.v)).join(' and ');
      b.insertAdjacentHTML('beforeend',`<span class="badge g hy-stats">${R>=1?'×'+(Math.round(R*10)/10)+' the usual weight':'×'+(Math.round(R*100)/100)+' the usual weight'}</span><span class="badge g hy-stats">Hybrid value ×${(Math.round(bonus*10)/10).toFixed(1)}</span>${boosts?`<span class="badge g hy-stats">Aquarium: ${esc(boosts)}</span>`:''}`); }catch(e){} }; }
