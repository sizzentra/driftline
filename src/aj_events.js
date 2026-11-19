
// =====================================================================
// 0.3 Events: a tab for timed events (the fishing derby lives here now, and future events will too).
// =====================================================================
const _renderPanel_ev = renderPanel;
renderPanel = function(){ if(S.tab==='events'){ const P=$('panel'); if(P){ renderEvents(P); return; } } _renderPanel_ev(); };
{ const anchor=document.querySelector('#tabs [data-tab="games"]'); if(anchor&&!document.querySelector('#tabs [data-tab="events"]')){ anchor.insertAdjacentHTML('beforebegin','<button role="tab" data-tab="events" aria-selected="false" data-label="🎏 Events"></button>'); const nb=document.querySelector('#tabs [data-tab="events"]'); nb.innerHTML=tabHTML(nb.dataset.label); } }
document.head.insertAdjacentHTML('beforeend',`<style>.ev-rw{padding:6px 0;border-top:1px solid var(--line);gap:10px;flex-wrap:wrap}.ev-rw:first-of-type{border-top:0}</style>`);
