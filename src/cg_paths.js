// =====================================================================
// 0.4.9 [11] Paths, rebuilt (director, 2026-11-19: "Add up to a total of 15 Paths that incorporate things from every single tab and
// upgrade ... a way to completely remove a choice ... list what the current fee is to change or remove a path per feat. Each feat as it
// increases in XP required to reach it should be more costly to change or remove ... the rarer the mechanic it alters, the higher in XP
// level it should be"). Shared by every platform.
//  - 15 forks (the 5 old ones keep their tier index, so saves keep their choices), each opening at a player level from 5 to 75.
//  - Fee to switch or remove grows with the fork's level and with what your best water pays (specFee in d5_v16).
//  - Path ranks I–V: a chosen path grows with the fish you land while it is on (50 / 150 / 400 / 1,000 / 2,500). Each rank makes a
//    new path's effect 10% stronger, and every path's rank adds +1% sale price and XP. Ranks are kept if you switch away and back.
// =====================================================================
SPEC_TIERS[0].lvl=5; SPEC_TIERS[1].lvl=8; SPEC_TIERS[2].lvl=12; SPEC_TIERS[3].lvl=45; SPEC_TIERS[4].lvl=22;
SPEC_TIERS.push(
 {lvl:16, name:'Rest', opts:[
   ['snoozer','Snoozer','Bites come 40% faster while you rest.',''],
   ['dreamer','Lucid Dreamer','+30% rare bonus while you rest.',''],
   ['homebody','Homebody','Cozy counts 50% more, and its cap rises from 40 to 60.','']]},
 {lvl:19, name:'Weather', opts:[
   ['stormchaser','Storm Chaser','In Storms and Blood Moons fish fight no harder than usual, and the rare bonus is 50% stronger.',''],
   ['rainmaker','Rainmaker','Rain and the Spawning Run speed up bites 50% more.',''],
   ['skywatcher','Sky Watcher','Rainbow, Gilded and Aurora weather are 50% stronger.','']]},
 {lvl:26, name:'Bait', opts:[
   ['thrifty','Thrifty','25% chance a bait is not used up.',''],
   ['gourmand','Gourmand','A fish’s favourite food pulls it in 40% more often.',''],
   ['chummer','Chummer','+15% bite speed with any bait except worms.','']]},
 {lvl:30, name:'Boardwalk', opts:[
   ['ticketmaster','Ticket Master','+30% tickets from Boardwalk games and prizes.',''],
   ['highroller','High Roller','Boardwalk coin wins are doubled.',''],
   ['regular','Regular','Free spins at the Boardwalk come 40% sooner.','']]},
 {lvl:35, name:'Aquarium', opts:[
   ['candymaker','Candy Maker','Scrapping a fish is 20% more likely to give Nibbles, and gives 1 extra.',''],
   ['lazyriver','Lazy River','Your Aquarium keeps earning twice as long while you are away.',''],
   ['showtank','Show Tank','+30% aquarium income.','']]},
 {lvl:40, name:'Events', opts:[
   ['hotshot','Hotshot','Hotspots appear 50% more often.',''],
   ['derbyace','Derby Ace','Your Derby catches count 20% more weight.',''],
   ['champion','Champion','Challenge rewards ×1.5.','']]},
 {lvl:50, name:'Oddities', opts:[
   ['treasurer','Treasure Hunter','Oddities and treasure 50% more often.',''],
   ['snagmaster','Snag Master','Snags strain your line 40% less.',''],
   ['appraiser','Appraiser','Oddities pay twice the coins.','']]},
 {lvl:57, name:'Hybrids', opts:[
   ['geneticist','Geneticist','Hybrids 60% more often.',''],
   ['purist','Purist','Hybrids inside their normal weight range are worth 30% more.',''],
   ['splicer','Splicer','Hybrids in your Aquarium earn 40% more.','']]},
 {lvl:65, name:'Voyage', opts:[
   ['pearldiver','Pearl Diver','+20% Wisdom Pearls when you set sail.',''],
   ['oldsalt','Old Salt','The coin Legacy of your voyages is 30% bigger.',''],
   ['pathfinder','Pathfinder','The next water opens with 30% fewer catches.','']]},
 {lvl:75, name:'Mythos', opts:[
   ['titlebearer','Title Bearer','Titled shinies (Rainbow, Starry, Spectral, Ancient) twice as often.',''],
   ['leviathan','Leviathan','Big fish swallow your catch twice as often, and pay ×2 instead of ×1.5.',''],
   ['mythheart','Mythic Heart','Mythic fish 50% more often and worth 30% more.','']]});
const PATH_ORDER = SPEC_TIERS.map((T,i)=>i).sort((a,b)=>SPEC_TIERS[a].lvl-SPEC_TIERS[b].lvl);
// what each new path does, as multipliers (mul: 1.5 = +50%) or additions to a bonus key (add); 'when' limits it
const PATH_FX = {
  snoozer:{mul:{restbite:.6}}, dreamer:{add:{rare:.3}, when:()=>G.st==='rest'}, homebody:{mul:{cozy:1.5, cozycap:1.5}},
  stormchaser:{}, rainmaker:{}, skywatcher:{},
  thrifty:{save:.25}, gourmand:{mul:{fav:1.4}}, chummer:{add:{bite:.15}, when:()=>S.baitSel!=='worm'},
  ticketmaster:{mul:{tix:1.3}}, highroller:{mul:{bwcoin:2}}, regular:{mul:{spin:1.4}},
  candymaker:{addv:{nibodds:.2, nibplus:1}}, lazyriver:{mul:{offline:2}}, showtank:{add:{tank:.3}},
  hotshot:{mul:{hotrate:1.5}}, derbyace:{mul:{derby:1.2}}, champion:{mul:{chal:1.5}},
  treasurer:{mul:{junk:1.5}}, snagmaster:{mul:{snag:.6}}, appraiser:{mul:{oddgold:2}},
  geneticist:{mul:{hybrid:1.6}}, purist:{mul:{hx:1.3}}, splicer:{mul:{hyaq:1.4}},
  pearldiver:{mul:{pearl:1.2}}, oldsalt:{mul:{legacy:1.3}}, pathfinder:{mul:{unlock:.7}},
  titlebearer:{mul:{prism:2}}, leviathan:{mul:{eat:2, eatval:4/3}}, mythheart:{mul:{mythic:1.5, mythval:1.3}},
};
const PATH_RANKS=[50,150,400,1000,2500], PATH_RN=['','I','II','III','IV','V'];
const pathRank = id => { const n=(S.pathXP&&S.pathXP[id])||0; let r=0; while(r<5&&n>=PATH_RANKS[r]) r++; return r; };
const pathPow = id => 1+.1*pathRank(id);
function pathOn(id){ return spec(id); }
function pathChosen(){ return S.specs ? Object.values(S.specs).filter(Boolean) : []; }
function pathMul(k){ let m=1; if(!S||!S.specs) return 1; for(const id of pathChosen()){ const fx=PATH_FX[id]; if(!fx||!fx.mul||fx.mul[k]==null||(fx.when&&!fx.when())) continue; m*=1+(fx.mul[k]-1)*pathPow(id); } return Math.max(.05,m); }
function pathAdd(k){ let v=0; if(!S||!S.specs) return 0; for(const id of pathChosen()){ const fx=PATH_FX[id]; if(fx&&fx.addv&&fx.addv[k]!=null) v+=fx.addv[k]*(k==='nibplus'?1:pathPow(id)); } return v; }
function pathSave(){ for(const id of pathChosen()){ const fx=PATH_FX[id]; if(fx&&fx.save&&Math.random()<fx.save*pathPow(id)) return true; } return false; }
const spinEvery = () => SPIN_EVERY/pathMul('spin');
// bonus keys: the new paths' additions plus +1% sale price and XP per rank of every chosen path
{ const _b=bonus; bonus=function(k){ let v=_b(k); if(!S||!S.specs) return v; let add=0;
    for(const id of pathChosen()){ const fx=PATH_FX[id]; if(fx&&fx.add&&fx.add[k]!=null&&(!fx.when||fx.when())) add+=fx.add[k]*pathPow(id); if(k==='sell'||k==='xp') add+=.01*pathRank(id); }
    return BONUS_CAP[k] ? Math.min(BONUS_CAP[k], v+add) : v+add; }; }
// weather paths
{ const _w=weather; weather=function(){ const w=_w(); if(!S||!S.specs) return w; const amp=(x,m)=>x>1?1+(x-1)*m:x; let o=w;
    if(spec('stormchaser')&&(w.str||1)>1){ o=Object.assign({},o,{str:1, rare:(o.rare||0)*(1+.5*pathPow('stormchaser'))}); }
    if(spec('rainmaker')&&(o.bite||1)>1){ o=Object.assign({},o,{bite:amp(o.bite,1+.5*pathPow('rainmaker'))}); }
    if(spec('skywatcher')&&(o.shiny>1||o.xp>1)){ const m=1+.5*pathPow('skywatcher'); o=Object.assign({},o,{shiny:amp(o.shiny||1,m), xp:amp(o.xp||1,m)}); }
    return o; }; }
// rest, foods, mythics, tickets, events, voyage, hybrids in the tank
{ const _r=restBiteTime; restBiteTime=function(){ return _r()*pathMul('restbite'); }; }
{ const _cw=catchW; catchW=function(s,pool,rare,b){ let w=_cw.apply(this,arguments); if(b&&b.food&&FISH_FAV[s.id]===b.id) w*=pathMul('fav'); if(s.r>=5) w*=pathMul('mythic'); return w; }; }
{ const _rf=rollFish; rollFish=function(sp){ const f=_rf.apply(this,arguments); if(f&&sp&&sp.r>=5){ const m=pathMul('mythval'); if(m!==1) f.value=Math.round(f.value*m); } return f; }; }
{ const _t=addTickets; addTickets=function(n){ return _t(n*pathMul('tix')); }; }
{ const _c=chalReward; chalReward=function(m){ return _c(m*pathMul('chal')); }; }
{ const _d=derbyCatch; derbyCatch=function(f){ const d=S.derby, before=d?d.total:0; _d(f); try{ const m=pathMul('derby'); if(m!==1&&S.derby&&S.derby.total>before) S.derby.total=+(S.derby.total+(S.derby.total-before)*(m-1)).toFixed(2); }catch(e){} }; }
{ const _v=voyageLegacy; voyageLegacy=function(){ return _v()*pathMul('legacy'); }; }
{ const _a=aqFishBase; aqFishBase=function(f){ const v=_a(f); return f&&f.hy ? v*pathMul('hyaq') : v; }; }
// ranks grow with every fish landed while a path is chosen
{ const _lf=landFish; landFish=function(){ const f=G.fish, was=f&&f.kind==='fish'; const r=_lf.apply(this,arguments);
    try{ if(was&&S.specs){ S.pathXP=S.pathXP||{}; for(const id of pathChosen()){ const r0=pathRank(id); S.pathXP[id]=(S.pathXP[id]||0)+1; const r1=pathRank(id);
      if(r1>r0){ const T=SPEC_TIERS.find(T=>T.opts.some(o=>o[0]===id)), o=T&&T.opts.find(o=>o[0]===id); if(o) setTimeout(()=>toast('Path rank up: '+o[1]+' is now rank '+PATH_RN[r1]+'.'),600); } } } }catch(e){} return r; }; }
// saves: pathXP is a plain map of path id → fish landed
{ const _m=migrate; migrate=function(s){ const o=_m.apply(this,arguments); const t=o||s; try{ if(t&&typeof t==='object'){ const px={}; if(t.pathXP&&typeof t.pathXP==='object') for(const k in t.pathXP){ const n=+t.pathXP[k]; if(PATH_FX[k]!==undefined||SPEC_TIERS.some(T=>T.opts.some(op=>op[0]===k))) if(isFinite(n)&&n>0) px[k]=Math.floor(n); } t.pathXP=px;
    if(t.specs&&typeof t.specs==='object') for(const k of Object.keys(t.specs)){ const T=SPEC_TIERS[+k]; if(!T||!T.opts.some(op=>op[0]===t.specs[k])) delete t.specs[k]; } } }catch(e){} return o; }; }

// the page
function pathCard(ti){ const T=SPEC_TIERS[ti], cur=S.specs[ti], locked=S.lvl<T.lvl, fee=specFee(ti), poor=S.money<fee;
  const curO=cur&&T.opts.find(o=>o[0]===cur);
  return `<div class="tile pathtier ${cur?'done':''}" style="${locked?'opacity:.55':''}"><div class="row spread"><h4>${esc(T.name)} <span class="meta">· level ${T.lvl}</span></h4>${curO?`<span class="badge g">${esc(curO[1])}${pathRank(cur)?' · rank '+PATH_RN[pathRank(cur)]:''}</span>`:locked?`<span class="meta">Level ${S.lvl} / ${T.lvl}</span>`:'<span class="badge">Choose one</span>'}</div>
   <div class="grid pathgrid" style="grid-template-columns:repeat(auto-fill,minmax(190px,1fr));margin-top:6px">${T.opts.map(o=>{ const on=cur===o[0], rk=pathRank(o[0]), n=(S.pathXP&&S.pathXP[o[0]])||0;
     return `<button class="spec ${on?'on':''}" data-act="spec" data-k="${ti}:${o[0]}" ${locked||on||(cur&&poor)?'disabled':''}><b>${esc(o[1])}</b><span class="up">▲ ${esc(o[2])}</span>${rk||on?`<span class="meta">Rank ${rk?PATH_RN[rk]:'0'}${rk<5?' · '+fmt(n)+' / '+fmt(PATH_RANKS[rk])+' fish':' · max'}</span>`:''}${cur&&!on&&!locked?`<span class="meta">Switch · ${fmt(fee)} coins</span>`:''}</button>`; }).join('')}</div>
   ${cur?`<div class="row spread" style="margin-top:6px"><span class="meta">Switch or remove: <b>${fmt(fee)}</b> coins</span><button class="btn alt sm" data-act="specrm" data-i="${ti}" ${poor?'disabled':''}>Remove</button></div>`:locked?'':`<div class="meta" style="margin-top:6px">Free to choose. Switching or removing later costs ${fmt(fee)} coins.</div>`}</div>`; }
function renderPaths(P){ const open=SPEC_TIERS.filter(T=>S.lvl>=T.lvl).length, chosen=pathChosen().length;
  P.innerHTML=`<h2>Paths</h2><p class="sub path-intro">${SPEC_TIERS.length} forks open from level 5 to 75. Pick one specialty per fork: it ranks up from I to V as you fish with it.<br>Switching or removing a path costs the fee shown on its fork.</p>
   <div class="meta" style="margin-top:4px">${chosen} chosen · ${open} of ${SPEC_TIERS.length} open at level ${S.lvl}</div>
   <div class="path-list">${PATH_ORDER.map(pathCard).join('')}</div>`; };
{ const _ea=extraAct7; extraAct7=function(b){ if(b.dataset.act==='specrm'){ const ti=+b.dataset.i, T=SPEC_TIERS[ti]; if(!T||!S.specs[ti]) return 'skip'; const fee=specFee(ti); if(S.money<fee){ toast('Removing this path costs '+fmt(fee)+' coins.'); return 'skip'; }
    const o=T.opts.find(o=>o[0]===S.specs[ti]); S.money-=fee; delete S.specs[ti]; toast('Removed '+(o?o[1]:'the path')+' ('+fmt(fee)+' coins). Its rank is kept if you pick it again.'); save(); return 'render'; } return _ea(b); }; }
if(typeof ACT_OK==='object') ACT_OK.specrm=(k,i)=>Number.isInteger(i)&&i>=0&&i<SPEC_TIERS.length;
// feats for the longer road
try{ const f5=FEATS.find(f=>f.id==='paths5'); if(f5){ f5.name='Five roads'; f5.d='Choose five Paths'; }
  FEATS.push({id:'paths10', name:'Ten roads', d:'Choose ten Paths at once', p:()=>[pathChosen().length,10], coins:3000000, pt:3},
             {id:'paths15', name:'Every road taken', d:'Choose all fifteen Paths at once', p:()=>[pathChosen().length,15], coins:50000000, pt:5},
             {id:'pathrank', name:'Well travelled', d:'Raise a path to rank V', p:()=>[Math.max(0,...pathChosen().map(pathRank),...Object.keys(S.pathXP||{}).map(pathRank)),5], coins:5000000, pt:3}); }catch(e){}
document.head.insertAdjacentHTML('beforeend','<style>#panel .path-list{display:grid;gap:10px;margin-top:12px;grid-template-columns:1fr}#panel .path-intro{max-width:760px}@media (min-width:1280px){#panel .path-list{grid-template-columns:repeat(2,minmax(0,1fr))}#panel .path-list .pathgrid{grid-template-columns:repeat(3,minmax(0,1fr))!important}}</style>');
