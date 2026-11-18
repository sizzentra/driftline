// =====================================================================
// Phones, round 7: weather notices stop covering the screen (director, 2026-11-18: "weather updates on mobile block a lot of UI.
// It should only be notified outside of full-screen UI, or have its own changes that work better").
// The two weather notices (the weather changed / a special weather starts in under a minute) used the big centre notice box,
// which sat over menus, popups and the fight. On phones now:
//  - they show as a small note under the scene chip and your boosts (top left of the water), which never takes taps
//  - never while a menu or a popup card (like the news card) is open, or while a cast or a fish is in progress: the note waits and shows when you are back
//    on the water between catches, and only if it is still true (a warning for weather that already started is dropped)
// Every other notice is unchanged. Android + iPhone only.
// =====================================================================
{ let pend=null, el=null, hideT=0, poll=0; const BUSY=/^(charging|flying|bite|reeling|landing|event)$/; /* event = a popup card is open (news, a choice, a reward) */
  const blocked=()=>MENU_OPEN||document.hidden||document.body.classList.contains('ev-open')||(()=>{ const ev=document.getElementById('evcard'); return !!(ev&&ev.getClientRects().length); })()||(typeof G==='object'&&BUSY.test(G.st));
  const still=p=>p.kind==='chg'?weather().k===p.k:Math.floor(Date.now()/1000/WX_LEN)===p.cur;
  const show=p=>{ const st=document.getElementById('stage'); if(!st) return; if(!el||!el.isConnected){ el=document.createElement('div'); el.id='mbwx'; el.setAttribute('role','status'); st.appendChild(el); }
    el.style.top=(typeof MB_STATUS_B==='number'?Math.round(MB_STATUS_B)+2:36)+'px'; /* under the scene chip and your boosts (boosts07.js) */
    el.innerHTML=''; const b=document.createElement('b'); b.textContent=p.head; el.append(b,document.createTextNode(p.rest)); el.dataset.k=p.k;
    el.classList.remove('on'); void el.offsetWidth; el.classList.add('on'); clearTimeout(hideT); hideT=setTimeout(()=>el.classList.remove('on'),5000); };
  const tick=()=>{ if(!pend){ clearInterval(poll); poll=0; return; } if(!still(pend)){ pend=null; return; } if(blocked()) return; const p=pend; pend=null; show(p); };
  const _t=toast; toast=function(m){ try{ if(MOB()&&typeof m==='string'){
      let p=null;
      if(m.startsWith('Weather: ')){ const k=weather().k, n=wxName(k); p={kind:'chg',k,head:n+' now',rest:m.slice(9+n.length).replace(/^\.\s*/,' · ')}; }
      else { const W1=' weather starts in under a minute: ', i=m.indexOf(W1); if(i>0){ const cur=Math.floor(Date.now()/1000/WX_LEN); p={kind:'warn',cur,k:weatherAt(cur+1).k,head:m.slice(0,i)+' in under a minute',rest:' · '+m.slice(i+W1.length)}; } }
      if(p){ if(!blocked()) show(p); else { pend=p; if(!poll) poll=setInterval(tick,1000); } return; } } }catch(e){ console.error(e); }
    return _t.apply(this,arguments); };
  if(/[?&]test\b/.test(location.search)) window.__wxNote=()=>({pending:pend&&pend.head, shown:!!(el&&el.classList.contains('on')), text:el&&el.textContent}); }
document.head.insertAdjacentHTML('beforeend',`<style>
html body.phone-app #mbwx,html body.phone-land #mbwx{position:absolute;left:10px;top:36px;z-index:6;max-width:min(320px,calc(100% - 20px));box-sizing:border-box;padding:5px 10px;border-radius:10px;background:rgba(8,16,28,.84);border:1px solid #ffffff1c;border-left:3px solid #8fd3ff;color:#c9d8e8;font:700 12px/1.3 var(--display);pointer-events:none;opacity:0;transform:translateY(-4px);transition:opacity .25s,transform .25s;display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:2;overflow:hidden}
html body.phone-app #mbwx b,html body.phone-land #mbwx b{color:#fff;font-weight:900}
html body.phone-app #mbwx.on,html body.phone-land #mbwx.on{opacity:1;transform:none}
html body.phone-app #mbwx[data-k="Storm"],html body.phone-land #mbwx[data-k="Storm"]{border-left-color:#b49cff}
html body.phone-app #mbwx[data-k="Rain"],html body.phone-land #mbwx[data-k="Rain"]{border-left-color:#7fb4ff}
</style>`);
