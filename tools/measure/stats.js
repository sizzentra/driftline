/* Every bonus stat: what it is now and where it comes from, and the highest each source can give.
   Runs inside the game; uses the game's own functions, so the numbers are the game's. Puts back everything it touches. */
const keys=[...Object.keys(BK),...Object.keys(BK2)], R=x=>+(+x).toFixed(4), out={save:SAVE_NAME, build:window.DL_VERSION||'', level:S.lvl, voyages:S.tides||0, caps:BONUS_CAP, names:Object.assign({},BK,BK2), now:{}, tank:{}, ceil:{}};
/* 1. now, by source */
for(const k of keys){ const buff=buffSum(k), aq=aqSum(k), pet=petSum(k), rodv=rodBonus(k), four=buff+aq+pet+rodv, capped=BONUS_CAP[k]?Math.min(BONUS_CAP[k],four):four, total=bonus(k);
  out.now[k]={boosts:R(buff), aquarium:R(aq), pets:R(pet), rod:R(rodv), others:R(total-capped), total:R(total), overCap:BONUS_CAP[k]&&four>BONUS_CAP[k]?R(four-BONUS_CAP[k]):0}; }
/* 2. the aquarium now */
{ const best={}; for(const f of S.tank) for(const e of aqNet(f)){ if(!best[e.k]||e.v>best[e.k].v) best[e.k]={v:R(e.v), fish:(SPI[f.id]||{}).name, rarity:(SPI[f.id]||{}).r, fed:f.fed||0, stronger:f.nbst||0}; }
  out.tank={fish:S.tank.length, room:aqCap(), slots:S.tankSlots, slotsMax:TANK_COST.length-1, roomMax:Math.ceil((TANK_COST.length-1)*1.5), bestFishPerStat:best, fedTotal:S.tank.reduce((a,f)=>a+(f.fed||0),0)}; }
/* 3. the highest each source can give */
const keepPerks=S.perks, keepRods=JSON.stringify(S.rods), keepAtts=JSON.stringify(S.atts), keepBuffs=S.buffs, keepTank=S.tank;
try{
  /* rod: every rod at level 10 with the best attachments for this stat in its slots (the game's own rodBonus decides) */
  S.atts=Object.fromEntries(ATTS.map(a=>[a.id,5])); out.ceil.rod={};
  for(const k of keys){ let top={v:0}; for(const r of RODS){ S.rods.eq=r.id; S.rods.lvl=Object.assign({},S.rods.lvl,{[r.id]:10}); const fit=ATTS.filter(a=>a.k===k).map(a=>a.id).concat(ATTS.filter(a=>a.k!==k).map(a=>a.id)); S.rods.att=Object.assign({},S.rods.att,{[r.id]:fit}); const v=rodBonus(k); if(v>top.v) top={v:R(v), rod:r.name, own:R(r.st[k]||0), slots:r.slots}; }
    out.ceil.rod[k]=top; }
  S.rods=JSON.parse(keepRods); S.atts=JSON.parse(keepAtts);
  /* pets: the best pet as favourite and the second best as companion, Pet Whisperer and both bonds at their top */
  out.ceil.pets={}; const petpalMax=PERKS.petpal.max, bondMax=10, mult=(1+.1*petpalMax)*(1+.05*bondMax), share=.5+.02*bondMax;
  for(const k of keys){ const L=Object.values(PETI).filter(p=>p.k===k).sort((a,b)=>b.v-a.v); if(!L.length) continue; out.ceil.pets[k]={v:R(L[0].v*mult+(L[1]?L[1].v*mult*share:0)), favourite:L[0].name, base:L[0].v, companion:L[1]?L[1].name:null, gift:L.slice(0,2).some(p=>p.src==='gift')}; }
  /* one aquarium fish at its very best, by the game's own aqBuffsOf: a Mythic, titled prismatic, trophy, tiny hybrid, both own bonuses and three Nibble bonuses on this stat at the top tier and weight, Aquarist at its top */
  out.ceil.oneFish={}; const myth=SP.find(s=>s.r===5), allPerks=Object.fromEntries(Object.keys(PERKS).map(p=>[p,PERKS[p].max])); S.perks=allPerks; S.tank=[];
  /* two shapes compete: a tiny hybrid (far under its kind's lightest: its bonuses count up to three times, but each rolls at the lightest weight, 0.75)
     and a record-heavy trophy hybrid (bonuses roll at the top weight, 1.25, and count a little more). Five bonuses is the most a fish can hold. */
  for(const k of AQ_KEYS){ const pv=Object.keys(TITLE_BUFFS).find(t=>TITLE_BUFFS[t].keys.includes(k))||'rainbow';
    const mk=(tiny,nb)=>{ const w=tiny?.75:1.25, b=()=>({k,t:5,w}); return {id:myth.id, kg:tiny?myth.min*.05:myth.min+(myth.max-myth.min)*1.5, sh:2, pv, tr:tiny?0:1, hy:1, ab:b(), ab2:b(), abx:[b(),b(),b()], nbst:nb, value:1}; };
    const sum=(tiny,nb)=>R(aqBuffsOf(mk(tiny,nb)).filter(e=>e.k===k).reduce((a,e)=>a+e.v,0)), tiny=sum(true,0)>=sum(false,0);
    const plain=R(aqBuffsOf({id:myth.id, kg:(myth.min+myth.max)/2, ab:{k,t:5,w:1}, value:1}).filter(e=>e.k===k).reduce((a,e)=>a+e.v,0));
    out.ceil.oneFish[k]={plainMythic:plain, best:sum(tiny,0), shape:tiny?'tiny hybrid':'record-heavy trophy hybrid', other:sum(!tiny,0), bestStronger10:sum(tiny,10), bestStronger50:sum(tiny,50), bestStronger100:sum(tiny,100)}; }
  S.perks=keepPerks; S.tank=keepTank;
  /* fixed extras: relics, finished feat groups, voyages */
  out.ceil.relics={}; for(const id in RELIC_BONUS) for(const k in RELIC_BONUS[id]) out.ceil.relics[k]=R((out.ceil.relics[k]||0)+RELIC_BONUS[id][k]);
  out.ceil.relics.rare=R((out.ceil.relics.rare||0)+.12); out.ceil.relics.tank=R((out.ceil.relics.tank||0)+.3); out.ceil.voyages={rare:.2};
  out.ceil.featGroups={}; for(const c in FEAT_CAT_BONUS){ const [k,x]=FEAT_CAT_BONUS[c]; out.ceil.featGroups[k]=R((out.ceil.featGroups[k]||0)+x); }
} finally { S.perks=keepPerks; S.rods=JSON.parse(keepRods); S.atts=JSON.parse(keepAtts); S.buffs=keepBuffs; S.tank=keepTank; }
return JSON.stringify(out);
