// =====================================================================
// 0.4 additions (2026-11-17):
//  1. Weekly quests: four bigger goals every week (Monday to Sunday) under the daily tasks, plus a weekly crate for
//     finishing them all. Progress is read from the save's own counters, so every catch, coin and task counts
//     wherever it happens, with no extra hooks.
//  2. Weather forecast: the weather follows a fixed schedule (weatherAt), so the Events page shows what is coming,
//     and a heads-up arrives just before rare weather starts.

// =====================================================================

// ---------- 1. weekly quests ----------
function weekKey(d=new Date()){ const t=new Date(d); t.setHours(0,0,0,0); t.setDate(t.getDate()-((t.getDay()+6)%7)); return dayKey(t); }
function weekLeftMs(){ const t=new Date(); t.setHours(0,0,0,0); t.setDate(t.getDate()-((t.getDay()+6)%7)+7); return Math.max(0,t-Date.now()); }
const WQ_POOL=[
  {t:'caught',  d:'Land {n} fish',                    n:()=>rint(120,180), stat:()=>S.stats.caught||0},
  {t:'shiny',   d:'Catch {n} shiny fish',             n:()=>rint(3,5),     stat:()=>S.stats.shiny||0},
  {t:'earned',  d:'Earn {n} coins',                   n:()=>Math.round(bestLoot()*rint(120,200)/100)*100, stat:()=>S.stats.earned||0},
  {t:'tasks',   d:'Finish {n} daily tasks',           n:()=>rint(8,12),    stat:()=>S.gstats.tasks||0},
  {t:'hot',     d:'Land {n} catches from hotspots',   n:()=>rint(20,35),   stat:()=>S.stats.hot||0},
  {t:'chal',    d:'Win {n} challenges',               n:()=>rint(2,4),     stat:()=>S.stats.chalWins||0},
  {t:'species', d:'Find {n} species you have not caught yet', n:()=>rint(3,6), stat:()=>Object.keys(S.journal).length, ok:n=>Object.keys(S.journal).length+n<=SP.length},
];
const wqDef=t=>WQ_POOL.find(p=>p.t===t);
function wqMake(){ const pool=WQ_POOL.slice(), out=[]; while(out.length<4&&pool.length){ const p=pool.splice(Math.floor(Math.random()*pool.length),1)[0]; const n=p.n(); if(p.ok&&!p.ok(n)) continue;
    out.push({t:p.t, n, base:p.stat(), claimed:false, coins:Math.round(bestLoot()*rnd(12,20)), scales:rint(8,15)}); } return out; }
function wqValid(w){ return w&&typeof w==='object'&&typeof w.wk==='string'&&Array.isArray(w.quests)&&w.quests.length>0&&w.quests.every(q=>q&&wqDef(q.t)&&isFinite(q.n)&&q.n>0&&isFinite(q.base)&&isFinite(q.coins)&&isFinite(q.scales)); }
function ensureWeekly(){ const k=weekKey(); if(!wqValid(S.weekly)||S.weekly.wk!==k) S.weekly={wk:k, quests:wqMake(), bonus:false}; return S.weekly; }
function wqHave(q){ const d=wqDef(q.t); return d?Math.max(0,Math.min(q.n,d.stat()-q.base)):0; }
function wqReady(){ const w=ensureWeekly(); return w.quests.filter(q=>!q.claimed&&wqHave(q)>=q.n).length+(!w.bonus&&w.quests.every(q=>q.claimed)?1:0); }
function wqLeftTxt(){ const ms=weekLeftMs(), d=Math.floor(ms/86400000), h=Math.floor(ms%86400000/3600000), m=Math.floor(ms%3600000/60000); return d?d+'d '+h+'h':h?h+'h '+m+'m':m+'m'; }
function weeklyHTML(){ const w=ensureWeekly(), done=w.quests.filter(q=>q.claimed).length;
  return `<div class="tile wq dtasks" style="margin-bottom:12px"><div class="row spread"><div><h4>Weekly quests</h4><div class="meta">Bigger goals for the week. Finish all four for a big Mystery Crate. New quests in <b>${wqLeftTxt()}</b>.</div></div><span class="meta">${done} / ${w.quests.length}</span></div>
   ${w.quests.map((q,i)=>{ const h=wqHave(q), ok=h>=q.n; return `<div class="toggle"><div style="min-width:0;flex:1"><b>${esc(wqDef(q.t).d.replace('{n}',fmt(q.n)))}</b><div class="meta">${fmt(h)} / ${fmt(q.n)} · reward <span class="coin">${fmt(q.coins*coinMult())}</span> + ${q.scales} Scales</div><div class="prog" style="margin-top:4px"><i style="width:${Math.round(h/q.n*100)}%"></i></div></div>
     ${q.claimed?'<span class="badge g">Done</span>':`<button class="btn sm" data-act="wqclaim" data-i="${i}" ${ok?'':'disabled'}>Claim</button>`}</div>`; }).join('')}
   ${w.quests.every(q=>q.claimed)?(w.bonus?'<p class="sub">Weekly crate collected. New quests on Monday.</p>':'<button class="btn" data-act="wqbonus" style="margin-top:8px">Claim the weekly crate</button>'):''}</div>`; }
{ const _rb=renderBounties; renderBounties=function(P){ _rb(P); try{ const d=[...P.children].find(c=>c.classList&&c.classList.contains('tile')&&/Daily tasks/.test(c.textContent)); const html=weeklyHTML(); if(d) d.insertAdjacentHTML('afterend',html); else P.insertAdjacentHTML('afterbegin',html); }catch(e){ oops('bq_feat04:find',e); } }; }
{ const _xw=extraAct2; extraAct2=function(b){ const a=b.dataset.act;
  if(a==='wqclaim'){ const w=ensureWeekly(), q=w.quests[+b.dataset.i]; if(!q||q.claimed||wqHave(q)<q.n) return 'skip'; q.claimed=true; const c=earn(q.coins*coinMult()); S.scales+=q.scales; try{ addPassXP(60); }catch(e){ oops('bq_feat04:addPassXP',e); } try{ sfx.coin(); }catch(e){ oops('bq_feat04:sfx.coin',e); } toast('Weekly quest done: +'+fmt(c)+' coins, +'+q.scales+' Scales'); save(); return 'render'; }
  if(a==='wqbonus'){ const w=ensureWeekly(); if(w.bonus||!w.quests.every(q=>q.claimed)) return 'skip'; w.bonus=true; S.tokens.big=(S.tokens.big||0)+1; S.scales+=25; try{ sfx.catch(3); }catch(e){ oops('bq_feat04:sfx.catch',e); } toast('Weekly quests done! +25 Scales and a big Mystery Crate (Boardwalk).'); save(); return 'render'; }
  return _xw(b); }; }
if(typeof ACT_OK==='object'){ ACT_OK.wqclaim=(k,i)=>Number.isInteger(i)&&i>=0&&i<ensureWeekly().quests.length; ACT_OK.wqbonus=()=>true; }
/* the Bounties badge: one count, in e_ui's hud (Cam's list #6: it used to add a second writer here and count yesterday's daily tasks) */
function bountyReady(){ const u=new Set(S.unlocked); const d=ensureDaily(); return S.bounties.filter(b=>bDone(b)&&(!b.loc||u.has(b.loc))).length+d.tasks.filter(t=>!t.claimed&&taskHave(t)>=t.n).length+wqReady(); }

// ---------- 2. weather forecast ----------
const WX_SPECIAL=new Set(['Rainbow','Gilded','Aurora','Blood Moon','Spawning Run']);
function forecastHTML(){ const now=weather(), f=wxForecast(5), tag=k=>(typeof WX_TAG==='object'&&WX_TAG[k])||'';
  return `<div class="tile wxf" style="margin-top:10px"><h4>Weather forecast</h4><div class="meta">The weather turns every few minutes at every water. Plan your fishing around it.</div>
   <div class="wxf-row on"><b>Now: ${esc(wxName(now.k))}</b><span class="meta">${esc(tag(now.k)||now.note)}</span><span class="badge g" data-wxl>${mmss(wxLeft())} left</span></div>
   ${f.map(x=>`<div class="wxf-row${WX_SPECIAL.has(x.k)?' sp':''}"><b>${esc(wxName(x.k))}</b><span class="meta">${esc(tag(x.k)||x.note)}</span><span class="badge ${WX_SPECIAL.has(x.k)?'g':'n'}">in ${mmss(Math.max(0,Math.round(x.at)))}</span></div>`).join('')}</div>`; }
{ const _re=renderEvents; renderEvents=function(P){ _re(P); try{ const cal=P.querySelector('.ev-cal'); const html=forecastHTML(); if(cal) cal.insertAdjacentHTML('afterend',html); else P.insertAdjacentHTML('beforeend',html); }catch(e){ oops('bq_feat04:P.querySelector',e); } }; }
// keep the forecast's countdowns live while the Events page is open (one cheap text update a second)
setInterval(()=>{ if(S.tab!=='events') return; const box=document.querySelector('#panel .wxf'); if(!box) return; const now=Date.now()/1000, cur=Math.floor(now/WX_LEN); if(box.dataset.slot&&+box.dataset.slot!==cur){ box.outerHTML=forecastHTML(); return; } box.dataset.slot=cur;
  const l=box.querySelector('[data-wxl]'); if(l) l.textContent=mmss(wxLeft())+' left'; const f=wxForecast(5); box.querySelectorAll('.wxf-row:not(.on) .badge').forEach((b,i)=>{ if(f[i]) b.textContent='in '+mmss(Math.max(0,Math.round(f[i].at))); }); },1000);
document.head.insertAdjacentHTML('beforeend',`<style>
#panel .wxf-row{display:flex;align-items:center;gap:10px;padding:6px 0;border-top:1px solid var(--line)}
#panel .wxf-row > b{flex:0 0 auto;min-width:96px}
#panel .wxf-row > .meta{flex:1 1 auto;min-width:0}
#panel .wxf-row > .badge{flex:0 0 auto;white-space:nowrap}
#panel .wxf-row.on > b{color:var(--gold,#ffd36a)}
#panel .wxf-row.sp > b{color:#ffe7a6}
@container (min-width:560px){ #menuov #panel .wxf{display:grid;grid-template-columns:repeat(auto-fill,minmax(230px,1fr));column-gap:14px} #menuov #panel .wxf > h4,#menuov #panel .wxf > .meta{grid-column:1 / -1} }
</style>`);

// ---------- 3. the Boardwalk pays out in prizes, not coins (director, 2026-11-17) ----------
// Every game except the coin flip now pays tickets, crates and cosmetics. "Wear" prizes are things you don't own yet:
// shop clothes, glasses, hats, fabrics, colors and pet extras, and now and then a Boardwalk-only piece from the counter.
const BW_KIND={shoe:'shoes',neck:'neckwear',back:'back piece',out:'outfit',glasses:'glasses',hat:'hat',pat:'fabric',col:'color',petacc:'pet accessory',pettint:'pet color'};
function bwWearPool(){ const o=S.owned, out=[]; const add=(arr,kind,list)=>arr.forEach(x=>{ if(x[0]!=='none'&&x[3]==='shop'&&x[2]>0&&!list.includes(x[0])) out.push({kind,id:x[0],name:x[1]}); });
  add(SHOES,'shoe',o.shoes); add(NECKS,'neck',o.necks); add(BACKS,'back',o.backs); add(OUTFITS,'out',o.outfits);
  GLASSES.forEach(g=>{ if(g[2]>0&&!o.glasses.includes(g[0])) out.push({kind:'glasses',id:g[0],name:g[1]}); });
  HATS.forEach(h=>{ if(h.src==='shop'&&!o.hats.includes(h.id)) out.push({kind:'hat',id:h.id,name:h.name}); });
  PATTERNS.forEach(p=>{ if(p[2]>0&&!o.pats.includes(p[0])) out.push({kind:'pat',id:p[0],name:p[1]}); });
  SHOP_COLS.forEach(c=>{ if(!o.cols.includes(c[0])) out.push({kind:'col',id:c[0],name:c[1]}); });
  PET_ACCS.forEach(a=>{ if(a[2]>0&&!(a[0] in PRIZE_ACC)&&!S.petAccs.includes(a[0])) out.push({kind:'petacc',id:a[0],name:a[1]}); });
  PET_TINTS.forEach(t=>{ if(t[2]>0&&!(t[0] in PRIZE_TINT)&&!S.petTints.includes(t[0])) out.push({kind:'pettint',id:t[0],name:t[1]}); });
  return out; }
function bwGrantWear(it){ const o=S.owned, L={shoe:o.shoes,neck:o.necks,back:o.backs,out:o.outfits,glasses:o.glasses,hat:o.hats,pat:o.pats,col:o.cols,petacc:S.petAccs,pettint:S.petTints}[it.kind]; if(L&&!L.includes(it.id)) L.push(it.id); }
// excl: a Boardwalk-only piece when one is left (the jackpots); otherwise mostly shop wear, sometimes Boardwalk-only
function bwWearPrize(excl){ const ex=bwPool().filter(x=>!bwOwned(x)), pool=bwWearPool(); let it=null;
  if(ex.length&&(excl||!pool.length||Math.random()<.3)) it=pick(ex); else if(pool.length) it=pick(pool);
  if(!it) return null; const isEx=ex.some(x=>x.kind===it.kind&&x.id===it.id); it={kind:it.kind,id:it.id,name:it.name,excl:isEx}; bwGrantWear(it);
  return {title:'New '+BW_KIND[it.kind]+': '+it.name+(it.excl?' (Boardwalk only)':''), kind:'wear', wear:it}; }
// the picture of a wear prize (crate reveal)
function bwDrawWear(x,w,h,it){ if(!it) return; const lk=Object.assign({},S.look,{hat:'none'});
  if(it.kind==='shoe'||it.kind==='neck'||it.kind==='back') return wearPreview(x,it.kind,it.id,w,h);
  if(it.kind==='hat') return hatPreview(x,w,h,it.id,S.look.hatCol,true);
  if(it.kind==='col'){ x.fillStyle=it.id; x.beginPath(); x.arc(w/2,h/2,Math.min(w,h)*.28,0,7); x.fill(); return; }
  if(it.kind==='glasses'){ lk.glasses=it.id; const s=h/32; return drawAngler(x,w*.46,h*.52+50*s,s,lk,{}); }
  if(it.kind==='petacc'||it.kind==='pettint'){
    // shown on your favourite pet, awake; a new color on a pet whose coat it barely changes (Dax is black) is shown on another of your pets
    let id=S.pet; if(it.kind==='pettint'&&id==='daxniko') id=['lily','dog','cat','puppy','kitten'].find(p=>S.owned.pets.includes(p))||id;
    const L=Object.assign({},_petLook_pair?_petLook_pair(id):petLook(id),it.kind==='petacc'?{acc:it.id}:{tint:it.id});
    drawPetStyled(x,id,w/2,h*.83,petFitScale(id)*h/300,0,0,L); return; }
  if(it.kind==='pat'){ lk.pat=it.id; lk.outfit='none'; const s=h/34; return drawAngler(x,w*.46,h*.5+50*s,s,lk,{}); }
  if(it.kind==='out') lk.outfit=it.id;
  drawAngler(x,w/2,h*.95,h/90,lk,{}); }
const bwTix=(n,why)=>({title:'+'+addTickets(n)+' tickets'+(why?' ('+why+')':''), kind:'tix'});

// the wheel: tickets, lures, a boost, crates, a wear prize, a small coin slice, and a Boardwalk-only jackpot
WHEEL.length=0; WHEEL.push(['25 tickets',22,'#3a6f9a'],['Lure pack',13,'#4f8a4a'],['60 tickets',14,'#7a4a9a'],['Lucky boost',12,'#2a8aa8'],['Small crate',12,'#c8553a'],['Coins ×3',10,'#6a7680'],['Big crate',6,'#d87aa0'],['Wear prize',8,'#2f9a7a'],['JACKPOT',3,'#d8a020']);
function wheelPrize(i){ const lab=(WHEEL[i]||WHEEL[0])[0]; try{ sfx.coin(); }catch(e){ oops('bq_feat04:sfx.coin#2',e); }
  if(lab==='25 tickets') return '+'+addTickets(25)+' tickets';
  if(lab==='60 tickets') return '+'+addTickets(60)+' tickets';
  if(lab==='Lure pack'){ const opts=Object.keys(BAIT).filter(k=>k!=='worm'&&!BAIT[k].junk); const k=pick(opts); S.bait[k]+=8; renderBait(); return '8 '+BAIT[k].name; }
  if(lab==='Lucky boost'){ const fo=pick(FORTUNES); addBuff(fo[1],fo[2],15,'Lucky wheel'); return 'Boost: '+fmtB(fo[1],fo[2])+' for 15 min'; }
  if(lab==='Small crate'){ S.tokens.small++; return 'A small Mystery Crate (open it in Mystery crates)'; }
  if(lab==='Big crate'){ S.tokens.big++; return 'A BIG Mystery Crate (open it in Mystery crates)'; }
  if(lab==='Coins ×3') return '+'+fmt(bwEarn(bestLoot()*3*coinMult()))+' coins';
  if(lab==='Wear prize'){ const r=bwWearPrize(false); return r?r.title:'+'+addTickets(150)+' tickets (you own every prize)'; }
  try{ sfx.shiny(); }catch(e){ oops('bq_feat04:sfx.shiny',e); } const r=bwWearPrize(true); return 'JACKPOT! '+(r?r.title:'+'+addTickets(400)+' tickets'); };

// crates: mostly things to wear and place; tickets (not coins) when you already own everything a roll could give
function openCrate(k){ const r=Math.random(); let res;
  const petPool=tier=>PETS.filter(p=>p.src==='crate'&&p.price<=tier&&!S.owned.pets.includes(p.id));
  const decor=rare=>{ const pool=DECOR.filter(d=>!S.aq.owned.includes(d.id)&&(rare?true:d.price>0)); if(!pool.length) return null; const d=rare&&pool.some(x=>!x.price)&&Math.random()<.6?pick(pool.filter(x=>!x.price)):pick(pool); S.aq.owned.push(d.id); return {title:'Aquarium decor: '+d.name+' (+'+Math.round(d.b*100)+'% income)', kind:'decor', id:d.id}; };
  const pet=(tier,legendBias)=>{ let pool=petPool(tier); if(legendBias){ const top=pool.filter(p=>p.price===3); if(top.length&&Math.random()<.35) pool=top; } if(!pool.length) return null; const p=pick(pool); S.owned.pets.push(p.id); return {title:'New pet: '+p.name+'!', kind:'pet', id:p.id}; };
  const coins=(a,b)=>({title:'+'+fmt(bwEarn(bestLoot()*rnd(a,b)*coinMult()))+' coins', kind:'coins'});
  const lure=()=>{ const opts=Object.keys(BAIT).filter(x=>x!=='worm'); const kk=pick(opts); const n=BAIT[kk].junk?4:10; S.bait[kk]+=n; renderBait(); return {title:n+' '+BAIT[kk].name, kind:'lure'}; };
  const wear=excl=>bwWearPrize(excl), own='you own everything this could have been';
  if(k==='small') res = r<.15?coins(2,6) : r<.35?lure() : r<.75?(wear(false)||bwTix(40,own)) : r<.9?(decor(false)||bwTix(40,own)) : (pet(1)||wear(false)||bwTix(60,own));
  else if(k==='big') res = r<.1?coins(10,25) : r<.5?(wear(Math.random()<.4)||bwTix(150,own)) : r<.68?(decor(false)||wear(false)||bwTix(150,own)) : r<.92?(pet(2)||wear(true)||bwTix(200,own)) : (decor(true)||wear(true)||bwTix(200,own));
  else res = (r<.1&&grantRod('golden')) || (r<.45?(pet(3,true)||wear(true)||coins(150,300)) : r<.75?(decor(true)||wear(true)||coins(150,300)) : r<.9?(wear(true)||coins(100,300)) : coins(100,300));
  S.gstats.crates++; try{ sfx.catch(k==='legend'?4:k==='big'?3:2); if(res.kind==='pet'||res.kind==='decor'||res.kind==='wear') sfx.shiny(); }catch(e){ oops('bq_feat04:sfx.catch#2',e); } crateRes=Object.assign({crate:k},res); };

// duck pond: every duck wins tickets; a few hide a crate or something to wear
function newDuck(){ const prizes=[]; for(let i=0;i<6;i++){ const r=Math.random(); prizes.push(r<.05?{k:'crate'}:r<.08?{k:'wear'}:r<.3?{k:'tix',n:rint(40,70)}:r<.6?{k:'tix',n:rint(20,40)}:{k:'tix',n:rint(8,16)}); } duck={prizes, pick:-1}; };
// scratch card: tickets, a crate, or a Boardwalk-only piece
const SCRATCH_PAY=[30,60,120];
function newScratch(){ const sym=['🐟','🦀','🐚','💎','👑'], ws=[50,25,15,8,2]; const win=Math.random()<.35; let w=-1; if(win){ let x=Math.random()*100; w=0; for(let i=0;i<5;i++){ x-=ws[i]; if(x<=0){ w=i; break; } } }
  const cells=[]; if(win) cells.push(w,w,w); const cnt=[0,0,0,0,0]; if(win) cnt[w]=3; while(cells.length<9){ const s=Math.floor(Math.random()*5); if(s===w||cnt[s]>=2) continue; cnt[s]++; cells.push(s); }
  for(let i=cells.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [cells[i],cells[j]]=[cells[j],cells[i]]; }
  scratch={cells, open:Array(9).fill(false), win:w, prize:0, txt:'', done:false, sym}; };
function settleScratch(){ if(!scratch||scratch.done) return; scratch.done=true; S.gstats.scratch++;
  if(scratch.win>=0){ const w=scratch.win; let t; if(w<3) t='+'+addTickets(SCRATCH_PAY[w])+' tickets'; else if(w===3){ S.tokens.small++; t='a small Mystery Crate and +'+addTickets(100)+' tickets'; } else { const r=bwWearPrize(true); t=r?r.title:'+'+addTickets(500)+' tickets'; }
    scratch.txt=t; S.gstats.scratchWins++; try{ sfx.catch(w>=3?4:2); }catch(e){ oops('bq_feat04:sfx.catch#3',e); } } else { try{ sfx.lost(); }catch(e){ oops('bq_feat04:sfx.lost',e); } } };
// higher or lower: the pot is tickets now; a right guess grows it by half, eight in a row pays it out
const HILO_POT=12;
{ const _xh=extraAct2; extraAct2=function(b){ const a=b.dataset.act, k=b.dataset.k, i=+b.dataset.i;
  if(a==='hilostart'){ const c=bestLoot()*2; if(S.money<c) return 'skip'; S.money-=c; hilo={card:rint(1,13), streak:0, pot:HILO_POT, done:false}; taskProgress('game',1); return 'render'; }
  if(a==='hilo'){ if(!hilo||hilo.done) return 'skip'; let n; do{ n=rint(1,13); }while(n===hilo.card); const ok=(k==='hi')===(n>hilo.card), prev=hilo.card; hilo.card=n;
    if(ok){ hilo.streak++; hilo.pot=Math.round(hilo.pot*1.5); try{ tone(900+hilo.streak*100,.1,'triangle',.06); }catch(e){ oops('bq_feat04:tone',e); } if(hilo.streak>=8){ addTickets(hilo.pot); hilo.done=true; hilo.msg='Eight in a row! The pot pays out: +'+fmt(hilo.pot)+' tickets.'; try{ sfx.catch(4); }catch(e){ oops('bq_feat04:sfx.catch#4',e); } } }
    else { hilo.done=true; hilo.msg=prev+' → '+n+'. Wrong way! The pot sinks, but you keep '+addTickets(2)+' tickets for trying.'; try{ sfx.lost(); }catch(e){ oops('bq_feat04:sfx.lost#2',e); } } return 'render'; }
  if(a==='hilocash'){ if(!hilo||hilo.done||!hilo.streak) return 'skip'; addTickets(hilo.pot); hilo.done=true; hilo.msg='Cashed out: +'+fmt(hilo.pot)+' tickets after '+hilo.streak+' right guess'+(hilo.streak>1?'es':'')+'.'; try{ sfx.coin(); }catch(e){ oops('bq_feat04:sfx.coin#3',e); } return 'render'; }
  if(a==='duckpick'){ if(!duck||duck.pick>=0) return 'skip'; if(!Number.isInteger(i)||i<0||i>=duck.prizes.length) return 'skip'; duck.pick=i; const p=duck.prizes[i];
    if(p.k==='crate'){ S.tokens.small++; duck.msg='A small Mystery Crate! Quack.'; try{ sfx.shiny(); }catch(e){ oops('bq_feat04:sfx.shiny#2',e); } }
    else if(p.k==='wear'){ const r=bwWearPrize(false); duck.msg=(r?r.title:'+'+addTickets(120)+' tickets')+'. Quack!'; try{ sfx.shiny(); }catch(e){ oops('bq_feat04:sfx.shiny#3',e); } }
    else { duck.msg='+'+addTickets(p.n)+' tickets. Quack.'; try{ tone(1200,.08,'triangle',.05); }catch(e){ oops('bq_feat04:tone#2',e); } } return 'render'; }
  return _xh(b); }; }

// (2026-11-17 balance check: Wild Berries, Ice Flies and Live Shrimp were too weak to be the best bait at their own
//  water, so their base odds were raised in b_data.js; Lava Worms and Stardust already were.)

if(/[?&]test\b/.test(location.search)) window.__feat={ensureWeekly, wqHave, wqReady, weeklyHTML, wxForecast, forecastHTML, weekKey, bwWearPool, bwWearPrize, bwDrawWear, wheel:()=>WHEEL.map(w=>w.slice(0,2))};
document.head.insertAdjacentHTML('beforeend','<style>#panel .badge.n{background:#ffffff0d;color:#c9d7e8;border-color:#ffffff24}</style>');
document.head.insertAdjacentHTML('beforeend','<style>@container (min-width:560px){ #menuov #panel .tile.dtasks > :not(.toggle){grid-column:1 / -1} #menuov #panel .tile.dtasks > .btn{justify-self:start} }</style>');
