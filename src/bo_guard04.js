// =====================================================================
// 0.4: one gate in front of every page action. A button whose target no longer exists (a stale button after the
// page changed, or a hand-edited page) is ignored instead of throwing or writing nonsense into the save:
// unknown water, gear, rod, attachment, bounty slot, offer or preview item. Runs before the game's own handler.
// =====================================================================
const ACT_OK=(()=>{ const has=(arr,k)=>arr.some(x=>(Array.isArray(x)?x[0]:x&&x.id)===k), colon=k=>typeof k==='string'&&/^[\w-]+:[\w-]*$/.test(k), idx=(i,a)=>Number.isInteger(i)&&i>=0&&i<a.length;
  const pv={wood:k=>has(DOCK_WOODS,k), style:k=>has(DOCK_STYLES,k), decor:k=>!!DOCKI[k]}, apv={theme:k=>has(THEMES,k), sand:k=>has(SANDS,k), decor:k=>!!DECORI[k]};
  return { baitfold:k=>['0','1','2'].includes(String(k)), /* C16 bait groups (u_tackle.js) */ buygear:k=>!!GEAR[k], unlock:k=>LOCS.some(L=>L.id===k)&&!S.unlocked.includes(k), goto:k=>S.unlocked.includes(k)&&LOCS.some(L=>L.id===k),
    reroll:(k,i)=>idx(i,S.bounties), claim:(k,i)=>idx(i,S.bounties), sell:(k,i)=>idx(i,S.cooler), totank:(k,i)=>idx(i,S.cooler), untank:(k,i)=>idx(i,S.tank),
    rodup:k=>!!ROD_I[k], rodbuy:k=>!!ROD_I[k], rodeq:k=>!!ROD_I[k], attbuy:k=>has(ATTS,k),
    buyoffer:colon, bwbuy:colon, rodatt:colon, spec:colon, tryon:colon, petpv:colon,
    dockpv:k=>colon(k)&&!!pv[k.split(':')[0]]&&pv[k.split(':')[0]](k.split(':')[1]), aqpv:k=>colon(k)&&!!apv[k.split(':')[0]]&&apv[k.split(':')[0]](k.split(':')[1]),
    dockwood:k=>has(DOCK_WOODS,k), dockstyle:k=>has(DOCK_STYLES,k), dockdecor:k=>!!DOCKI[k], aqtheme:k=>has(THEMES,k), aqsand:k=>has(SANDS,k), decor:k=>!!DECORI[k],
    buypet:k=>!!PETI[k], pet:k=>!!PETI[k], usebait:k=>!!BAIT[k], buybait:k=>!!BAIT[k], perk:k=>!!PERKS[k] }; })();
$('panel').addEventListener('click',e=>{ const b=e.target.closest('[data-act]'); if(!b) return; const f=ACT_OK[b.dataset.act]; if(!f) return;
  let ok=false; try{ ok=!!f(b.dataset.k, b.dataset.i!=null&&b.dataset.i!==''?+b.dataset.i:NaN); }catch(er){ ok=false; }
  if(!ok){ e.stopImmediatePropagation(); e.preventDefault(); try{ renderPanel(); }catch(er){} } },true);
