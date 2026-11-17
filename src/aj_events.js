
// =====================================================================
// 0.3 Events: a tab for timed events (the fishing derby lives here now, and future events will too).
// =====================================================================
function renderEvents(P){ const base=bestLoot(), row=(icon,m,label)=>`<div class="row spread ev-rw"><span>${icon} <b>${label}</b></span><span class="meta">${m?`<span class="coin">${fmt(Math.round(base*25*m*coinMult()))}</span> · ${Math.round(30*m)} Scales · ${Math.round(150*m)} tickets · ${Math.round(300*m)} Tide Pass XP`:'20 tickets for taking part'}</span></div>`;
  P.innerHTML=`<h2>Events</h2><p class="sub">Timed events with their own rewards. Join one whenever you like.</p>${derbyHTML()}
  <div class="tile"><h4>Derby rewards</h4><div class="meta" style="margin-bottom:6px">Four minutes, one water: the heaviest total catch wins. Rewards grow with the waters you have unlocked.</div>
   ${row('🥇',1,'First place')}${row('🥈',.5,'Second place')}${row('🥉',.25,'Third place')}${row('🎣',0,'Fourth place')}</div>`; }
const _renderPanel_ev = renderPanel;
renderPanel = function(){ if(S.tab==='events'){ const P=$('panel'); if(P){ renderEvents(P); return; } } _renderPanel_ev(); };
{ const anchor=document.querySelector('#tabs [data-tab="games"]'); if(anchor&&!document.querySelector('#tabs [data-tab="events"]')){ anchor.insertAdjacentHTML('beforebegin','<button role="tab" data-tab="events" aria-selected="false" data-label="🎏 Events"></button>'); const nb=document.querySelector('#tabs [data-tab="events"]'); nb.innerHTML=tabHTML(nb.dataset.label); } }
document.head.insertAdjacentHTML('beforeend',`<style>.ev-rw{padding:6px 0;border-top:1px solid var(--line);gap:10px;flex-wrap:wrap}.ev-rw:first-of-type{border-top:0}</style>`);
