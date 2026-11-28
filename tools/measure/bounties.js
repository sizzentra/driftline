/* What bounties take and pay, by kind, on every open water: 400 bounties a water from the game's own makers, the catches each takes
   on today's odds (catchOdds), what it pays (bountyPay), and what the same catches bring on their own. Changes nothing. */
const out={save:SAVE_NAME, build:window.DL_VERSION||'', waters:[]}, med=a=>{ a=a.slice().sort((x,y)=>x-y); return a.length?a[Math.floor(a.length/2)]:null; };
for(const W of S.unlocked){ const o=catchOdds({loc:W}), sh={}; o.shares.forEach(([s,p])=>sh[s.id]=p);
  const scales=o.shares.reduce((a,[s,p])=>a+p*RAR[s.r].sc,0), nib=o.shares.reduce((a,[s,p])=>a+p*NIB_ODDS[Math.min(5,s.r)],0), rows={};
  for(let k=0;k<400;k++){ const b=makeBounty2(W)||makeBounty(W); if(!b) continue; const sp=b.sp&&SPI[b.sp]; let need=null;
    if(b.type==='count'&&sp&&sh[sp.id]) need=b.n/sh[sp.id]; else if(b.type==='size'&&sp&&sh[sp.id]) need=2/sh[sp.id]; else if(b.type==='style'){ const p=o.shares.filter(([s])=>s.beh===b.beh).reduce((a,[s,pp])=>a+pp,0); if(p) need=b.n/p; } else if(b.type==='kinds') need=b.n*1.6; else if(b.type==='trophy') need=18; else if(b.type==='shiny') need=50;
    const pay=bountyPay(b), key=b.type+(b.legend?'-legend':'')+(sp?'-r'+sp.r:''), R=rows[key]=rows[key]||{n:0,need:[],sc:[],nb:[],plan:[]}; R.n++; if(need!=null) R.need.push(need); R.sc.push(pay.sc); R.nb.push(pay.n); if(typeof bountyCatches==='function') R.plan.push(bountyCatches(b)); }
  const kinds={}; for(const k in rows){ const R=rows[k], c=R.need.length?med(R.need):null; kinds[k]={share:Math.round(R.n/4), catches:c==null?null:Math.round(c), counted:R.plan.length?Math.round(med(R.plan)):null, scales:med(R.sc), nibbles:med(R.nb), fishingScales:c==null?null:+(c*scales).toFixed(1), fishingNibbles:c==null?null:Math.round(c*nib)}; }
  out.waters.push({water:W, byRarity:o.by.map(x=>+(x*100).toFixed(1)), scalesPerCatch:+scales.toFixed(2), nibblesPerScrap:+nib.toFixed(2), kinds}); }
return JSON.stringify(out);
