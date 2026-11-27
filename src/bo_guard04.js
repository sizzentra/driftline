// =====================================================================
// 0.4: one gate in front of every page action. A button whose target no longer exists (a stale button after the
// page changed, or a hand-edited page) is ignored instead of throwing or writing nonsense into the save:
// unknown water, gear, rod, attachment, bounty slot, offer or preview item. Runs before the game's own handler.
// =====================================================================
const ACT_OK=(()=>{ const has=(arr,k)=>arr.some(x=>(Array.isArray(x)?x[0]:x&&x.id)===k), colon=k=>typeof k==='string'&&/^[\w-]+:[\w-]*$/.test(k), idx=(i,a)=>Number.isInteger(i)&&i>=0&&i<a.length;
  const apv={theme:k=>has(THEMES,k), sand:k=>has(SANDS,k), decor:k=>!!DECORI[k]};
  return { scrapall:()=>true, coolsort:k=>['recent','old','rarity','value','aq','species'].includes(k), tanksort:k=>['old','recent','rarity','income','species'].includes(k), inspect:(k,i)=>(k==='cooler'||k==='tank')&&Number.isInteger(i)&&i>=0&&i<(k==='cooler'?S.cooler:S.tank).length, baitfold:k=>['0','1','2'].includes(String(k)), /* C16 bait groups (u_tackle.js) */ buygear:k=>!!GEAR[k], unlock:k=>LOCS.some(L=>L.id===k)&&!S.unlocked.includes(k), goto:k=>S.unlocked.includes(k)&&LOCS.some(L=>L.id===k),
    reroll:(k,i)=>idx(i,S.bounties), claim:(k,i)=>idx(i,S.bounties), sell:(k,i)=>idx(i,S.cooler), totank:(k,i)=>idx(i,S.cooler), untank:(k,i)=>idx(i,S.tank),
    rodup:k=>!!ROD_I[k], rodbuy:k=>!!ROD_I[k], rodeq:k=>!!ROD_I[k], attbuy:k=>has(ATTS,k),
    buyoffer:colon, bwbuy:colon, rodatt:colon, spec:colon, tryon:colon, petpv:colon,
    aqpv:k=>colon(k)&&!!apv[k.split(':')[0]]&&apv[k.split(':')[0]](k.split(':')[1]),
    aqtheme:k=>has(THEMES,k), aqsand:k=>has(SANDS,k), decor:k=>!!DECORI[k],
    buypet:k=>!!PETI[k], pet:k=>!!PETI[k], usebait:k=>!!BAIT[k], buybait:k=>!!BAIT[k], perk:k=>!!PERKS[k] }; })();
$('panel').addEventListener('click',e=>{ const b=e.target.closest('[data-act]'); if(!b) return; const f=ACT_OK[b.dataset.act]; if(!f) return;
  let ok=false; try{ ok=!!f(b.dataset.k, b.dataset.i!=null&&b.dataset.i!==''?+b.dataset.i:NaN); }catch(er){ ok=false; }
  if(!ok){ e.stopImmediatePropagation(); e.preventDefault(); try{ renderPanel(); }catch(er){ oops('bo_guard04:renderPanel',er); } } },true);
// ---- an option you pick stays where it was (C13, Cam, 2026-11-20: "the customization menu never snaps or moves when an option is
// picked"; __snapQC found it on phones (23-66 px) and PC (back to the top) in the Wardrobe, Your home, pets, Settings and the aquarium).
// One rule for every page instead of a fix per page: before the page redraws, the tapped option's place on screen is noted; after the
// redraw (and once more just before the next frame, for pages that finish later) its scroll box is moved so the option is back on
// that exact spot. Only option buttons (the ones that show a chosen state) are held; buttons that change the page keep their behaviour.
{ let held=null; const keyOf=b=>'button[aria-pressed]'+['act','k','v','i'].map(a=>b.dataset[a]!=null?'[data-'+a+'="'+CSS.escape(b.dataset[a])+'"]':'').join('');
  const scroller=e=>{ for(let p=e.parentElement;p&&p!==document.body;p=p.parentElement){ const cs=getComputedStyle(p); if(/(auto|scroll)/.test(cs.overflowY)&&p.scrollHeight>p.clientHeight+1) return p; } return null; };
  /* sideways too (iPhone, 2026-11-20: in a row of chips that scrolls sideways, Bounties' waters, the redraw put the row back at its start and the tapped water jumped 1,044 px) */
  const xscroller=e=>{ for(let p=e.parentElement;p&&p!==document.body;p=p.parentElement){ const cs=getComputedStyle(p); if(/(auto|scroll)/.test(cs.overflowX)&&p.scrollWidth>p.clientWidth+1) return p; } return null; };
  const settle=()=>{ if(!held) return; const P=document.getElementById('panel'), el=P&&P.querySelector(held.k); if(!el||!el.getClientRects().length) return; const dx=el.getBoundingClientRect().left-held.left; if(Math.abs(dx)>=1){ const xs=xscroller(el); if(xs) xs.scrollLeft+=dx; } const dy=el.getBoundingClientRect().top-held.top; if(Math.abs(dy)<1) return; const sc=scroller(el); if(!sc) return;
    /* at the very bottom, a line removed below the option shortens the page and the browser scrolls everything down; a little empty room
       at the end (gone with the next redraw) lets the option stay put */
    const want=sc.scrollTop+dy, max=sc.scrollHeight-sc.clientHeight; if(want>max+.5){ let pad=sc.querySelector(':scope > .snap-pad'); if(!pad){ pad=document.createElement('div'); pad.className='snap-pad'; pad.setAttribute('aria-hidden','true'); sc.appendChild(pad); } pad.style.height=((parseFloat(pad.style.height)||0)+want-max)+'px'; }
    sc.scrollTop=want; };
  addEventListener('click',e=>{ const b=e.target&&e.target.closest&&e.target.closest('#panel button[aria-pressed][data-act]'); held=b&&!b.disabled?{k:keyOf(b), top:b.getBoundingClientRect().top, left:b.getBoundingClientRect().left}:null;
    /* held for a short moment: some pages finish later (the phone home view resizes its picture after the redraw) */
    if(held){ const h=held, again=()=>{ if(held===h) settle(); }; requestAnimationFrame(()=>{ again(); requestAnimationFrame(again); }); setTimeout(again,150); setTimeout(()=>{ again(); if(held===h) held=null; },350); } },true);
  addEventListener('click',()=>settle());
  for(const ev of ['wheel','touchmove','keydown','dl-reveal']) addEventListener(ev,()=>{ held=null; },{capture:true,passive:true}); /* the player scrolls on, or the page shows a hidden preview (pvReveal): let go */ }
