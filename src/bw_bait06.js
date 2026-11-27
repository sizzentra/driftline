// =====================================================================
// Water baits (director, 2026-11-18: "make bait listed that are associated with areas they're best at scale proportionally
// in price to the economy of the area while keeping them fair, also ensure they're grouped together in the menu, sequential
// respective to the unlock order of the Waters"). Shared game data (every platform):
//  - a water bait's pack price = 3 average catches at its water (waterEV), rounded to a tidy number, so it always matches
//    that water's economy (before: Wild Berries 3.1, Ice Flies 2.3, Live Shrimp 3.4, Lava Worms 2.9, Stardust 2.9)
//  - the bait list order: everyday baits first, then every water bait together in the order the waters unlock, then lures
// =====================================================================
const BAIT_WATER_K=3;
const niceNum=n=>{ if(n<100) return Math.round(n/5)*5; const p=Math.pow(10,Math.floor(Math.log10(n))-1); return Math.round(Math.round(n/p)*p); }; /* 0.4.9 QC: whole numbers (a fee read 339,999) */
try{ for(const k in BAIT){ const b=BAIT[k]; if(b.loc&&!b.junk&&!b.scales&&LOCS.some(L=>L.id===b.loc)) b.price=niceNum(waterEV(b.loc)*BAIT_WATER_K); } }catch(e){ oops('bw_bait06:LOCS.some',e); }
try{ const keys=Object.keys(BAIT), water=keys.filter(k=>BAIT[k].loc&&!BAIT[k].junk).sort((a,b)=>locIdx(BAIT[a].loc)-locIdx(BAIT[b].loc)), junk=keys.filter(k=>BAIT[k].junk), rest=keys.filter(k=>!water.includes(k)&&!junk.includes(k));
  const all=[...rest,...water,...junk], copy={}; for(const k of keys){ copy[k]=BAIT[k]; delete BAIT[k]; } for(const k of all) BAIT[k]=copy[k]; }catch(e){ oops('bw_bait06:Object.keys',e); }
// the bait counts in your save follow the new order too (a save made before keeps every count, only the order changes)
try{ S.bait=Object.assign(baitZero(),S.bait||{}); }catch(e){ oops('bw_bait06:Object.assign',e); }
