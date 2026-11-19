// =====================================================================
// 0.4.9 [12] Favourite foods (director, 2026-11-19: "make a whole new section of baits. Fish have a favourite and least favourite bait,
// these do have minor fishing buffs as a whole. Bait types that are good for attracting rarer fish ... slightly more expensive depending
// on the overall average rarity of the fish that like it the most. Epic fish and above do not have their favourite baits listed in the
// fish log until you catch them with it."). Shared by every platform.
//  - 8 foods, each with a small effect of its own. Every species has one favourite and one least favourite food, chosen from what it
//    eats (predators like meat, the others insects and plants), the same for every player.
//  - With a fish's favourite on the hook it bites 1.6× as often; with its least favourite, half as often.
//  - A food's price follows how rare its fans are. Epic and rarer fish keep their favourite hidden in the Fish Log until caught with it.
// =====================================================================
const FOOD_FAV=1.6, FOOD_HATE=.5; /* 1.8 let Leeches beat Stardust at Starfall for rare odds (each water's own bait stays the best there: QA) */
const FOOD_KEYS=Object.keys(BAIT).filter(k=>BAIT[k].food); /* the 8 foods live in b_data.js (so a save using one keeps it on reload) */
// favourites: from the species' diet, then a stable pick by name (the same for every player, never stored in saves)
const FISH_FAV={}, FISH_HATE={};
for(const s of SP){ const pred=isPredator(s), like=FOOD_KEYS.filter(k=>BAIT[k].meat===pred||BAIT[k].meat===null), dis=FOOD_KEYS.filter(k=>BAIT[k].meat===!pred);
  const h=hashStr('food|'+s.id); FISH_FAV[s.id]=like[h%like.length]; FISH_HATE[s.id]=dis[(h>>>5)%dis.length]; }
// prices: a pack of 10 costs more the rarer its fans are (100 coins for an all-common following, ~2,500 for a legendary one)
for(const k of FOOD_KEYS){ const fans=SP.filter(s=>FISH_FAV[s.id]===k), avg=fans.length?fans.reduce((a,s)=>a+Math.pow(s.r,1.5),0)/fans.length:0;
  BAIT[k].price=niceNum(100*Math.pow(1+avg,2.2)); }
for(const k in BAIT) BAIT[k].id=k;
// order: everyday baits, water baits, favourite foods, then special lures (junk)
{ const keys=Object.keys(BAIT), junk=keys.filter(k=>BAIT[k].junk), food=keys.filter(k=>BAIT[k].food), rest=keys.filter(k=>!junk.includes(k)&&!food.includes(k)), copy={};
  for(const k of keys){ copy[k]=BAIT[k]; delete BAIT[k]; } for(const k of [...rest,...food,...junk]) BAIT[k]=copy[k]; }
try{ S.bait=Object.assign(baitZero(),S.bait||{}); }catch(e){}
// a favourite pulls, a least favourite puts off
{ const _cw=catchW; catchW=function(s,pool,rare,b){ const w=_cw.apply(this,arguments); if(!b||!b.food) return w; return FISH_FAV[s.id]===b.id ? w*FOOD_FAV*(1+rodBonus('fav'))*(1+.06*pr('gourmet')) : FISH_HATE[s.id]===b.id ? w*FOOD_HATE : w; }; }
// catching a fish on its favourite reveals it in the Fish Log (epic and rarer keep it hidden until then)
{ const _ja=journalAdd; journalAdd=function(f){ const had=f&&f.sp&&S.journal[f.sp.id]&&S.journal[f.sp.id].fav; const r=_ja.apply(this,arguments); try{ if(had&&S.journal[f.sp.id]) S.journal[f.sp.id].fav=1; if(f&&f.sp&&BAIT[S.baitSel]&&BAIT[S.baitSel].food&&FISH_FAV[f.sp.id]===S.baitSel&&S.journal[f.sp.id]) S.journal[f.sp.id].fav=1; }catch(e){} return r; }; }
const foodKnown = (sp,j) => sp.r<3 || !!(j&&j.fav) || maxed('gourmet');
function foodLine(sp,j){ const fv=FISH_FAV[sp.id], ht=FISH_HATE[sp.id]; if(!fv) return ''; return `<div><span>Favourite food</span> ${foodKnown(sp,j)?esc(BAIT[fv].name):'??? <small>(catch it on its favourite)</small>'}</div><div><span>Least favourite</span> ${esc(BAIT[ht].name)}</div>`; }
const foodFans = k => SP.filter(s=>FISH_FAV[s.id]===k);
