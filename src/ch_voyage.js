// =====================================================================
// 0.4.9 [20] Voyages reworked (director, 2026-11-19: "Completely reworked voyage system. More buffs (that can be upgraded up to a limit)
// at the end ... Game needs heavier scaling towards the end ... wisdom pearls get harder and harder to accumulate as a voyage continues
// ... Pearls can be directly exchanged for +1% more gold from all sources, +1% more XP from all sources - 2 pearls per level, up to 100
// levels ... Tons more voyage milestones (up to 100) ... Tons more Pearl relics"). Shared by every platform.
//  - Wisdom Pearls are now a currency to spend: each pearl on a voyage needs more coins than the last (earned^(1/2.4) instead of the
//    square root). Pearls held before 0.4.9 keep their old +25% bonus for good ("old pearls"), and stay spendable as a thank-you.
//  - Pearl shop: +1% coins / +1% XP per level, 2 pearls a level, 100 levels each.
//  - Boons: every voyage gives Boon points (3, +1 for every 4 voyages) to raise 16 lasting Boons, rank 1 to 5 (a rank costs its number).
//  - 32 milestones up to voyage 100 (the old 6 plus 26 more), 20 more one-level relics (2 to 40 pearls).
// =====================================================================
const PSHOP_MAX=100, PSHOP_COST=2;
function pshopLv(k){ return clamp(Math.floor((S&&S.pshop&&S.pshop[k])||0),0,PSHOP_MAX); }
// ---------- Boons ----------
const BOONS=[
 ['heavy','Heavy Waters','Fish grow up to {v}% heavier than their normal range.',3],
 ['derby','Derby Crown','Derby weight ×{m} (multiplies).',.1],
 ['surge','Catch Surge','Every {n} fish in a streak: a Surge for 15 min (+8% bite speed, reel speed and rare bonus), up to 5 at once.',0],
 ['treasure','Magpie','+{v}% junk and treasure chance.',8],
 ['hotspot','Hot Water','+{v}% hotspots.',8],
 ['shine','Glimmer','+{v}% shiny chance.',6],
 ['trophy','Wall Mount','+{v}% trophy chance.',8],
 ['calm','Soft Hands','−{v}% fish temper.',5],
 ['tank','Old Friends','+{v}% aquarium income.',8],
 ['tickets','Season Pass','+{v}% tickets.',10],
 ['nibkeep','Candy Jar','Keep {v}% more of your Nibbles when you set sail.',8],
 ['cooler','Deep Cooler','+{v} cooler space.',1],
 ['nest','Nest Egg','Start each voyage with {v}% of the coins you earned on the last one (at most 100 million).',2],
 ['wisdom','Wisdom','+{v}% XP.',6],
 ['weather','Weather Eye','Weather effects {v}% stronger.',10],
 ['pearls','Pearl Sense','+{v}% Wisdom Pearls.',5],
].map(a=>({id:a[0],name:a[1],d:a[2],per:a[3],max:5}));
const BOONI=Object.fromEntries(BOONS.map(b=>[b.id,b]));
const SURGE_N=[0,50,40,30,20,10], SURGE_MIN=15, SURGE_MAX=5;
function boonR(id){ return clamp(Math.floor((S&&S.boons&&S.boons[id])||0),0,5); }
function boonText(b,r){ const R=Math.max(1,r); return b.d.replace('{v}',Math.round(b.per*R)).replace('{m}',Math.pow(1+b.per,R).toFixed(2)).replace('{n}',SURGE_N[R]); }
const boonPtsFor = t => 3+Math.floor(t/4)+(relic('boonstone')?2:0);
// ---------- milestones up to voyage 100 ----------
[[12,'Sailor’s Due','+2 Boon points.',{pts:2}],[14,'Fair Winds','+5% Legacy.',{legacy:.05}],[16,'Bigger Hold','+2 cooler space.',{cooler:2}],
 [18,'Known Waters','Begin every voyage with the first 4 waters open.',{unlock:4}],[20,'Pearl Eye','+10% Wisdom Pearls.',{pearl:.1}],
 [23,'Nest Egg','Begin every voyage with 250,000 coins.',{start:250000}],[26,'Old Instincts','+3% rare bonus.',{rare:.03}],[29,'Boon Chest','+3 Boon points.',{pts:3}],
 [32,'Well-Kept Tackle','Begin every voyage with every piece of tackle at level 3 or better.',{tackle:3}],[35,'Following Seas','+10% Legacy.',{legacy:.1}],
 [38,'Ship’s Hold','+3 cooler space.',{cooler:3}],[41,'Charted Waters','Begin every voyage with the first 6 waters open.',{unlock:6}],[44,'Pearl Diver’s Luck','+10% Wisdom Pearls.',{pearl:.1}],
 [47,'Boon Hoard','+4 Boon points.',{pts:4}],[50,'Half-Century','+15% Legacy and +5% rare bonus.',{legacy:.15,rare:.05}],[54,'Strongbox','Begin every voyage with 5 million coins.',{start:5e6}],
 [58,'Master’s Tackle','Begin every voyage with every piece of tackle at level 5 or better.',{tackle:5}],[62,'Boon Vault','+4 Boon points.',{pts:4}],[66,'Pearl Reef','+15% Wisdom Pearls.',{pearl:.15}],
 [70,'Every Shore','Begin every voyage with the first 8 waters open.',{unlock:8}],[75,'Trade Winds','+20% Legacy.',{legacy:.2}],[80,'Cargo Hold','+4 cooler space.',{cooler:4}],
 [85,'Boon Trove','+5 Boon points.',{pts:5}],[90,'Sixth Sense','+8% rare bonus.',{rare:.08}],[95,'Pearl Crown','+20% Wisdom Pearls.',{pearl:.2}],
 [100,'Admiral of the Drift','+50% Legacy and +10 Boon points.',{legacy:.5,pts:10}],
].forEach(a=>{ if(!VOYAGE_MS.some(m=>m.n===a[0])) VOYAGE_MS.push({n:a[0],name:a[1],d:a[2],fx:a[3]}); });
VOYAGE_MS.sort((a,b)=>a.n-b.n);
function msSum(k){ let v=0; for(const m of VOYAGE_MS) if(m.fx&&m.fx[k]&&voyMs(m.n)) v=(k==='unlock'||k==='tackle'||k==='start')?Math.max(v,m.fx[k]):v+m.fx[k]; return v; }
// ---------- more relics (one level each) ----------
const RELIC_BONUS={seaglass:{sell:.1}, almanac:{xp:.15}, chime:{bite:.15}, goldnet:{reel:.1}, eelcharm:{tension:.1}, moonmirror:{shiny:.15}, ancientlure:{rare:.1},
  coralcrown:{tank:.2}, hourglass:{hot:.25}, plaque:{trophy:.2}, stillwater:{calm:.15}, lodestone:{treasure:.25}};
const RELIC_MUL={cartopen:{unlock:.8}, necklace:{pearl:1.15}, tidecrown:{legacy:1.25}, kraken:{mythic:1.5}};
[['seaglass','Sea Glass',2,'+10% sale price.'],['almanac','Angler’s Almanac',2,'+15% XP.'],['chime','Wind Chime',3,'+15% bite speed.'],['goldnet','Golden Net',3,'+10% reel speed.'],
 ['eelcharm','Eel Charm',3,'−10% line tension.'],['moonmirror','Moon Mirror',4,'+15% shiny chance.'],['ancientlure','Ancient Lure',5,'+10% rare bonus.'],['coralcrown','Coral Crown',5,'+20% aquarium income.'],
 ['hourglass','Sand Hourglass',6,'+25% hotspots.'],['plaque','Brass Plaque',6,'+20% trophy chance.'],['stillwater','Still Water',8,'−15% fish temper.'],['lodestone','Lodestone',8,'+25% junk and treasure chance.'],
 ['boonstone','Boon Stone',10,'+2 Boon points every time you set sail.'],['cartopen','Cartographer’s Pen',12,'The next water opens with 20% fewer catches.'],['candytin','Candy Tin',12,'Keep 25% more of your Nibbles when you set sail.'],
 ['necklace','Pearl Necklace',15,'+15% Wisdom Pearls.'],['surgehorn','Surge Horn',15,'Catch Surges last 25 minutes instead of 15.'],['tidecrown','Crown of Tides',20,'Your Legacy is 25% bigger.'],
 ['secondhook','Second Hook',25,'5% chance a landed fish brings a twin into your cooler.'],['goldcompass','Golden Compass',30,'+20% coins and XP from everything.'],['kraken','Kraken Tooth',40,'Mythic fish 50% more often.'],
].forEach(a=>{ if(!RELICS.some(r=>r.id===a[0])) RELICS.push({id:a[0],name:a[1],cost:a[2],d:a[3]}); });
// ---------- effects ----------
function voyMul(k){ let m=1; if(!S) return 1; for(const id in RELIC_MUL) if(RELIC_MUL[id][k]&&relic(id)) m*=RELIC_MUL[id][k];
  if(k==='pearl') m*=(1+.05*boonR('pearls'))*(1+msSum('pearl')); if(k==='tix') m*=1+.1*boonR('tickets'); return m; }
function voyAdd(k){ if(!S) return 0; if(k==='nibkeep') return .08*boonR('nibkeep')+(relic('candytin')?.25:0); return 0; }
{ const _pm=pathMul; pathMul=function(k){ return _pm(k)*voyMul(k); }; }
const BOON_BONUS={treasure:['treasure',.08], hotspot:['hot',.08], shine:['shiny',.06], trophy:['trophy',.08], calm:['calm',.05], tank:['tank',.08], wisdom:['xp',.06]};
{ const _b=bonus; bonus=function(k){ let v=_b(k), add=0; if(!S) return v;
    for(const id in RELIC_BONUS) if(RELIC_BONUS[id][k]&&relic(id)) add+=RELIC_BONUS[id][k];
    for(const id in BOON_BONUS) if(BOON_BONUS[id][0]===k) add+=BOON_BONUS[id][1]*boonR(id);
    if(k==='rare') add+=msSum('rare');
    return BONUS_CAP[k] ? Math.min(BONUS_CAP[k], v+add) : v+add; }; }
// Legacy = the voyage Legacy (already ×paths and ×Crown of Tides through pathMul) + milestone Legacy (×Crown of Tides) + the Golden Compass
{ const _v=voyageLegacy; voyageLegacy=function(){ return _v()+msSum('legacy')*(relic('tidecrown')?1.25:1)+(relic('goldcompass')?.2:0); }; }
{ const _w=weather; weather=function(){ const w=_w(), r=boonR('weather'); if(!r) return w; const m=1+.1*r, amp=x=>x>1?1+(x-1)*m:x;
    return Object.assign({},w,{bite:w.bite?amp(w.bite):w.bite, shiny:w.shiny?amp(w.shiny):w.shiny, xp:w.xp?amp(w.xp):w.xp, rare:w.rare!=null?w.rare*m:w.rare}); }; }
{ const _d=derbyCatch; derbyCatch=function(f){ const d=S.derby, before=d?d.total:0; _d(f); try{ const r=boonR('derby'); if(r&&S.derby&&S.derby.total>before) S.derby.total=+(before+(S.derby.total-before)*Math.pow(1.1,r)).toFixed(2); }catch(e){} }; }
{ const _rf=rollFish; rollFish=function(sp){ const f=_rf.apply(this,arguments); const r=boonR('heavy'); if(f&&f.kind==='fish'&&r){ const m=1+Math.random()*.03*r; f.kg*=m; f.value=Math.round(f.value*Math.pow(m,.85)); } return f; }; }
{ const _ac=voyApplyCooler; voyApplyCooler=function(){ _ac(); const add=boonR('cooler')+msSum('cooler'); if(add) GEAR.cooler.lv=GEAR.cooler.lv.map(v=>v+add); }; voyApplyCooler(); }
// Catch Surge and the Second Hook ride on every landed fish
{ const _lf=landFish; landFish=function(){ const f=G.fish, was=f&&f.kind==='fish'; const r=_lf.apply(this,arguments);
    try{ if(was){ const rk=boonR('surge'); if(rk&&S.streak>0&&S.streak%SURGE_N[rk]===0){ const t=Date.now(), mins=relic('surgehorn')?25:SURGE_MIN; let slot=1;
        for(let i=1;i<=SURGE_MAX;i++){ const b=S.buffs.find(x=>x.src==='Surge '+i+' bite'); if(!b||b.until<=t){ slot=i; break; } if(i===SURGE_MAX) slot=1+((S.surgeNext||0)%SURGE_MAX); }
        S.surgeNext=slot; S.buffs=S.buffs.filter(x=>!(x.src&&x.src.indexOf('Surge '+slot+' ')===0)); for(const k of ['bite','reel','rare']) S.buffs.push({k,v:.08,until:t+mins*60000,src:'Surge '+slot+' '+k});
        const n=S.buffs.filter(x=>x.k==='bite'&&/^Surge /.test(x.src||'')&&x.until>t).length; setTimeout(()=>toast('Catch Surge! '+S.streak+' in a row: +8% bite speed, reel speed and rare bonus for '+mins+' min ('+n+' active).'),700); }
      if(relic('secondhook')&&Math.random()<.05&&S.cooler.length<gv('cooler')){ const last=S.cooler[S.cooler.length-1]; if(last&&f&&last.id===f.sp.id){ S.cooler.push(Object.assign({},last)); setTimeout(()=>toast('Second Hook: a twin '+f.sp.name+' came up too!'),900); } } } }catch(e){} return r; }; }
// ---------- setting sail: Boon points, milestone gifts ----------
document.addEventListener('click',e=>{ const b=e.target.closest&&e.target.closest('[data-act="retireok"]'); if(!b||!canRetire()) return; const before=S.tides, earned=S.stats.runEarned||0;
  setTimeout(()=>{ if(S.tides===before) return; const t=S.tides; let pts=boonPtsFor(t); const ms=VOYAGE_MS.find(m=>m.n===t); if(ms&&ms.fx&&ms.fx.pts) pts+=ms.fx.pts; S.boonPts=(S.boonPts||0)+pts;
    const nest=Math.min(1e8,Math.round(earned*.02*boonR('nest'))), start=msSum('start'); if(nest||start) S.money+=nest+start;
    const un=msSum('unlock'); for(let i=0;i<Math.min(un,LOCS.length);i++) if(!S.unlocked.includes(LOCS[i].id)) S.unlocked.push(LOCS[i].id);
    const tk=msSum('tackle'); if(tk) for(const k in S.gear) S.gear[k]=Math.max(S.gear[k],Math.min(tk,GEAR[k].lv.length-1));
    voyApplyCooler(); save(); try{ renderPanel(); }catch(er){}
    setTimeout(()=>toast('+'+pts+' Boon points to spend in Prestige, Boons.'+(nest?' Nest Egg: +'+fmt(nest)+' coins.':'')),2400); },0); },true);
// ---------- saves ----------
{ const _m=migrate; migrate=function(o){ const raw=isObj(o)?o:null; const m=_m(o);
    try{ if(raw&&raw.pearlMig!==1){ m.pearlOld=Math.max(0,Math.floor(+raw.pearls||0)); m.pearlMig=1; }
      if(!isFinite(+m.pearlOld)||m.pearlOld<0) m.pearlOld=0; m.pearlOld=Math.floor(m.pearlOld);
      const ps={}; if(isObj(m.pshop)) for(const k of ['gold','xp']){ const n=Math.floor(+m.pshop[k]); if(isFinite(n)&&n>0) ps[k]=Math.min(PSHOP_MAX,n); } m.pshop=ps;
      const bo={}; if(isObj(m.boons)) for(const k in m.boons){ const n=Math.floor(+m.boons[k]); if(BOONI[k]&&isFinite(n)&&n>0) bo[k]=Math.min(5,n); } m.boons=bo;
      if(raw&&raw.boonMig!==1){ let p=0; const T=Math.max(0,Math.floor(+m.tides||0)); for(let t=1;t<=T;t++){ p+=3+Math.floor(t/4); const ms=VOYAGE_MS.find(x=>x.n===t); if(ms&&ms.fx&&ms.fx.pts) p+=ms.fx.pts; } m.boonPts=Math.max(+m.boonPts||0,p); }
      m.boonMig=1; m.boonPts=Math.max(0,Math.floor(+m.boonPts||0)); if(!isFinite(m.boonPts)) m.boonPts=0; }catch(e){} return m; }; }
// ---------- actions ----------
let voyAll=false;
{ const _ea=extraAct7; extraAct7=function(b){ const a=b.dataset.act, k=b.dataset.k;
  if(a==='pshop'){ if(k!=='gold'&&k!=='xp') return 'skip'; const n=Math.max(1,Math.min(+b.dataset.n||1,PSHOP_MAX-pshopLv(k))), cost=n*PSHOP_COST; if(pshopLv(k)>=PSHOP_MAX||S.pearls<cost) return 'skip';
    S.pearls-=cost; S.pshop=S.pshop||{}; S.pshop[k]=pshopLv(k)+n; sfx.shiny(); toast((k==='gold'?'Coins':'XP')+' from everything: +'+pshopLv(k)+'% now.'); save(); return 'render'; }
  if(a==='boon'){ const B=BOONI[k]; if(!B) return 'skip'; const r=boonR(k); if(r>=B.max) return 'skip'; const c=r+1; if((S.boonPts||0)<c) return 'skip';
    S.boonPts-=c; S.boons=S.boons||{}; S.boons[k]=c; if(k==='cooler') voyApplyCooler(); sfx.shiny(); toast(B.name+' rank '+c+': '+boonText(B,c)); save(); return 'render'; }
  if(a==='voyall'){ voyAll=!voyAll; return 'render'; }
  return _ea(b); }; }
if(typeof ACT_OK==='object'){ ACT_OK.pshop=k=>k==='gold'||k==='xp'; ACT_OK.boon=k=>!!BOONI[k]; ACT_OK.voyall=()=>true; }
// ---------- the Prestige page ----------
function nextPearlAt(){ const pm=voyagePearlMult()*pathMul('pearl'), n=Math.floor(Math.pow((S.stats.runEarned||0)/PEARL_DIV,1/PEARL_EXP)*pm); return Math.ceil(Math.pow((n+1)/pm,PEARL_EXP)*PEARL_DIV); }
renderVoyage=function(){ const n=pearlsFor(), ok=canRetire(), v=S.tides||0, leg=Math.round(voyageLegacy()*100), full=vaultList().length+S.tank.length>VAULT_MAX, nextMs=VOYAGE_MS.find(m=>m.n>v), np=boonPtsFor(v+1)+(nextMs&&nextMs.n===v+1&&nextMs.fx&&nextMs.fx.pts||0);
  const box = confirmBox==='retire' ? `<div class="tile voy-confirm"><h4>Set sail again?</h4>
    <div class="meta">You lose your coins, tackle, bait, cooler fish, bounties and every water except Willow Pond (and the waters your milestones keep). Your aquarium fish are mounted in your Trophy Room${full?' (as many as fit; the rest stay on display)':''}. You keep your level, skills, Paths, Fish Log, feats, Trophy Room, pets, clothes, relics, Boons, Pearl shop levels and Wisdom Pearls.</div>
    <div class="meta" style="margin-top:6px;color:var(--kelp)">You get +${n} pearl${n===1?'':'s'} and +${np} Boon points${nextMs&&nextMs.n===v+1?', and a new milestone: '+esc(nextMs.name):''}.</div>
    <div class="row" style="margin-top:8px"><button class="btn" data-act="retireok">Set sail with +${n} pearl${n===1?'':'s'}</button><button class="btn alt" data-act="cancel">Keep fishing</button></div></div>` : '';
  const got=VOYAGE_MS.filter(m=>v>=m.n).length, list=voyAll?VOYAGE_MS:VOYAGE_MS.filter(m=>m.n>v).slice(0,5);
  const msRows=list.map(m=>{ const g=v>=m.n; return `<div class="voy-ms ${g?'got':''}"><span class="voy-n">${g?'✓':m.n}</span><div><b>${esc(m.name)}</b><div class="meta">${esc(m.d)}</div></div><span class="meta">${g?'Unlocked':'after '+m.n+' voyage'+(m.n>1?'s':'')}</span></div>`; }).join('');
  const pRow=(k,label)=>{ const L=pshopLv(k), max=L>=PSHOP_MAX; return `<div class="voy-ps"><div><b>${label} +${L}%</b><div class="meta">Level ${L} / ${PSHOP_MAX} · ${PSHOP_COST} pearls a level</div><div class="prog" style="margin-top:4px"><i style="width:${L}%"></i></div></div>
    <div class="row">${max?'<span class="badge g">Maxed</span>':`<button class="btn sm" data-act="pshop" data-k="${k}" data-n="1" ${S.pearls>=PSHOP_COST?'':'disabled'}>+1% · ${PSHOP_COST}</button><button class="btn alt sm" data-act="pshop" data-k="${k}" data-n="10" ${S.pearls>=PSHOP_COST*Math.min(10,PSHOP_MAX-L)?'':'disabled'}>+${Math.min(10,PSHOP_MAX-L)}% · ${PSHOP_COST*Math.min(10,PSHOP_MAX-L)}</button>`}</div></div>`; };
  const boonRows=BOONS.map(B=>{ const r=boonR(B.id), c=r+1, max=r>=B.max; return `<div class="voy-boon ${r?'on':''}"><div><b>${esc(B.name)}</b> <span class="meta">rank ${r} / ${B.max}</span><div class="meta">${esc(boonText(B,max?r:c))}${max||!r?'':' (next rank)'}</div></div>${max?'<span class="badge g">Maxed</span>':`<button class="btn sm" data-act="boon" data-k="${B.id}" ${(S.boonPts||0)>=c?'':'disabled'}>Rank ${c} · ${c} pt${c>1?'s':''}</button>`}</div>`; }).join('');
  return `<div class="jsec"><h2>Set sail again</h2><p class="sub">Once you reach Hollow Trench you can start over from Willow Pond. Every voyage gives Wisdom Pearls to spend (each pearl on a voyage needs more coins than the last), Boon points for lasting Boons, a bigger Legacy, and milestones up to voyage 100.</p>
  <div class="grid"><div class="tile"><div class="row spread"><h4>Voyage ${v+1}</h4><span class="meta">${S.pearls} pearl${S.pearls===1?'':'s'} to spend · ${S.boonPts||0} Boon point${S.boonPts===1?'':'s'}</span></div>
  <div class="voy-stats"><div><span class="meta">Legacy</span><b>+${leg}%</b><span class="meta">coins and XP from ${v} voyage${v===1?'':'s'}</span></div><div><span class="meta">Pearl finder</span><b>×${(voyagePearlMult()*pathMul('pearl')).toFixed(2)}</b><span class="meta">more pearls each voyage</span></div><div><span class="meta">This voyage</span><b class="coin">${fmtShort(S.stats.runEarned)}</b><span class="meta">coins earned</span></div></div>
  ${S.pearlOld?`<div class="meta">Old pearls (from before 0.4.9): ${S.pearlOld}, still giving +${Math.round(PEARL_COIN*S.pearlOld*100)}% coins and XP for good.</div>`:''}
  <div class="meta">Next pearl at <span class="coin">${fmt(nextPearlAt())}</span> coins earned this voyage. Boardwalk winnings count for at most a quarter of it.</div>
  <div class="val">Setting sail now gives +${n} pearl${n===1?'':'s'} and +${np} Boon points</div>
  <button class="btn" data-act="retire" ${ok&&!confirmBox?'':'disabled'}>${S.unlocked.includes('trench')?(n?'Set sail again':'Earn more coins first'):'Reach Hollow Trench first'}</button></div>${box}
  <div class="tile"><h4>Pearl shop</h4><div class="meta">Spend pearls on bonuses that never reset.</div>${pRow('gold','Coins from everything')}${pRow('xp','XP from everything')}</div>
  <div class="tile voy-boons"><div class="row spread"><h4>Boons</h4><span class="meta">${S.boonPts||0} point${S.boonPts===1?'':'s'}</span></div><div class="meta">Lasting upgrades, earned by setting sail: ${boonPtsFor(v+1)} points next voyage. A rank costs its number in points.</div><div class="voy-list">${boonRows}</div></div>
  <div class="tile"><div class="row spread"><h4>Voyage milestones</h4><span class="meta">${got} / ${VOYAGE_MS.length}</span></div><div class="voy-list">${msRows||'<div class="meta">Every milestone unlocked.</div>'}</div><button class="btn alt sm" data-act="voyall" style="margin-top:6px">${voyAll?'Show the next few':'Show all '+VOYAGE_MS.length}</button></div></div></div>`; };
relicHTML=function(){ const own=RELICS.filter(r=>relic(r.id)).length, list=RELICS.slice().sort((a,b)=>a.cost-b.cost);
  return `<div class="jsec"><h2>Pearl relics</h2><p class="sub">Spend Wisdom Pearls on relics: each is bought once and kept forever, through every voyage. You have <b>${S.pearls}</b> pearl${S.pearls===1?'':'s'} · ${own} / ${RELICS.length} relics owned.</p>
  <div class="grid">${list.map(r=>{ const o=relic(r.id); return `<div class="tile ${o?'done':''}"><div class="row spread"><h4>${esc(r.name)}</h4><span class="meta">${r.cost} pearl${r.cost>1?'s':''}</span></div><div class="meta">${esc(r.d)}</div>
   ${o?'<span class="badge g">Owned forever</span>':`<button class="btn sm" data-act="relic" data-k="${r.id}" ${S.pearls>=r.cost?'':'disabled'}>Trade ${r.cost} pearl${r.cost>1?'s':''}</button>`}</div>`; }).join('')}</div></div>`; };
document.head.insertAdjacentHTML('beforeend',`<style>
.voy-ps,.voy-boon{display:flex;align-items:center;justify-content:space-between;gap:10px;padding:7px 10px;margin-top:6px;border-radius:12px;border:1px solid var(--line,#26385180);background:#0e1828}
.voy-ps>div:first-child,.voy-boon>div:first-child{min-width:0;flex:1}.voy-ps .row{gap:6px;flex-wrap:nowrap}.voy-boon.on{border-color:#7fe3c455}
.voy-boon .btn,.voy-ps .btn{white-space:nowrap}
</style>`);
