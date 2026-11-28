/* How often each rarity is really caught, by the game's own chooseCatch (60,000 catches a row), beside what catchOdds says.
   Rows: the save as it is; with the bait that is best for legendaries here; inside hotspots of each colour; with a large rare bonus.
   Puts back everything it touches. Changes nothing. */
const out={save:SAVE_NAME, build:window.DL_VERSION||'', water:S.loc, rows:[]}, N=60000;
const keep={bait:S.baitSel, buffs:S.buffs, inHot:G.inHot, hotMin:G.hotMin, hotShiny:G.hotShiny, last:G.lastCast, caught:S.stats.caught, perks:S.perks};
const run=(label)=>{ const by=[0,0,0,0,0,0]; let fish=0, other=0, shiny=0, trophy=0, hybrid=0; for(let i=0;i<N;i++){ S.stats.caught=keep.caught+i; const c=chooseCatch(); if(!c||c.kind==='hat'||c.kind==='junk'||!c.sp){ other++; continue; } fish++; by[c.sp.r]++; if(c.shiny) shiny++; if(c.trophy) trophy++; if(c.hy) hybrid++; }
  const o=catchOdds({hot:G.inHot}); out.rows.push({label, bait:S.baitSel, rareShown:Math.round(bonus('rare')*100), fishPct:+(fish/N*100).toFixed(1), byRarity:by.map(x=>+(x/fish*100).toFixed(2)), oneLegendIn:by[4]+by[5]?Math.round(fish/(by[4]+by[5])):null, oddsSays:o.by.map(x=>+(x*100).toFixed(2)), shinyPct:+(shiny/fish*100).toFixed(2), trophyPct:+(trophy/fish*100).toFixed(2), hybridPct:+(hybrid/fish*100).toFixed(2)}); };
try{
  G.inHot=false; G.hotMin=0; G.hotShiny=false; G.lastCast=.5; run('as the save is, mid cast, no hotspot');
  G.lastCast=1; run('far cast');
  let best=keep.bait, top=-1; for(const id of Object.keys(BAIT)){ const v=catchOdds({bait:id}).legend; if(v>top){ top=v; best=id; } } S.baitSel=best; run('far cast, the best bait for legendaries here');
  for(const m of [0,2,3,4]){ G.inHot=true; G.hotMin=m; run('the same, inside a hotspot'+(m?' of colour '+RAR[m].k:' (plain)')); } G.inHot=false; G.hotMin=0;
  for(const add of [1,4,8,24]){ S.buffs=keep.buffs.concat([{k:'rare',v:add-bonus('rare'),until:Date.now()+9e6,src:'t'}]); run('far cast, best bait, rare bonus +'+add*100+'%'); S.buffs=keep.buffs; }
  S.buffs=keep.buffs.concat([{k:'rare',v:4-bonus('rare'),until:Date.now()+9e6,src:'t'}]); G.inHot=true; G.hotMin=0; run('far cast, best bait, rare bonus +400%, plain hotspot'); G.hotMin=4; run('far cast, best bait, rare bonus +400%, Legendary hotspot');
} finally { S.baitSel=keep.bait; S.buffs=keep.buffs; G.inHot=keep.inHot; G.hotMin=keep.hotMin; G.hotShiny=keep.hotShiny; G.lastCast=keep.last; S.stats.caught=keep.caught; S.perks=keep.perks; }
return JSON.stringify(out);
