// =====================================================================
// 0.4 Events. Three kinds, each asking for a different way of fishing:
//  - Challenges you start whenever you like (one at a time, each rests 12 minutes after it ends). Every target is set
//    from your real odds at this water with your gear and bait, so a challenge is fair at every stage of the game and
//    better choices make it easier.
//  - Scheduled events on the real clock (Shoal Run, Golden Hour, Market Rush): each lifts one thing at every water for a
//    few minutes. A calendar shows what is live and what comes next.
//  - The Fishing Derby (unchanged).
// Live progress shows on the water. Rewards scale with your best water like the derby, at about a third of a derby win.
// =====================================================================
const CHAL_CD=12*60*1000, MIN=60*1000;
const CHAL_RIVALS=['Old Marta','Captain Reed','Lily-Ann','Bo the Barge'];
const CATCHES_PER_MIN = 3.6; // a steady pace (about one landed fish every 16 seconds), used to size targets
// scheduled events: every N minutes on the real clock, for M minutes, shifted so they rarely meet
const SCHED=[
  {id:'shoal', name:'Shoal Run',   icon:'🐟', every:90,  len:8, off:0,  col:'#7fe3c4', fx:{bite:.6, rare:.15}, what:'Bites +60% and more rare fish', d:'A great shoal passes through every water: bites come 60% faster and rare fish are more common.'},
  {id:'gold',  name:'Golden Hour', icon:'✨', every:120, len:6, off:50, col:'#ffd36a', fx:{shiny:1},          what:'Shiny fish twice as common',  d:'The light turns gold over every water and shiny fish come out twice as often.'},
  {id:'market',name:'Market Rush', icon:'💰', every:75,  len:6, off:25, col:'#ffb36a', fx:{sell:()=>.3*(sellBase()+_bonus_036('sell'))}, /* a true +30% of your sale price, whatever your level */          what:'Fish sell for 30% more',      d:'Buyers crowd the harbour: the fishmonger pays 30% more for everything you sell.'},
];
const schedLeft = e => { const p=e.every*MIN, t=(Date.now()-e.off*MIN)%p, tt=t<0?t+p:t; return tt<e.len*MIN ? e.len*MIN-tt : 0; };
const schedNext = e => { const p=e.every*MIN, t=(Date.now()-e.off*MIN)%p, tt=t<0?t+p:t; return p-tt; };
const liveScheds = () => SCHED.filter(e=>schedLeft(e)>0);
const shoalLeft = () => schedLeft(SCHED[0]), shoalNext = () => schedNext(SCHED[0]);
const CHAL={
  rare:  {name:'Rare Run', icon:'💎', mins:6, m:.3, rule:c=>'Land '+c.need+' Rare or better fish', hint:o=>'Your chance of Rare or better per catch here: '+fmtOdds(o.by[2]+o.by[3]+o.by[4]+o.by[5])+'. Better bait, hotspots and far casts raise it.',
    setup:o=>{ const q=o.by[2]+o.by[3]+o.by[4]+o.by[5]; return {need:Math.max(2,Math.min(8,Math.round(6*CATCHES_PER_MIN*q*.75)))}; },
    onCatch:(c,f)=>{ if(f.sp.r>=2){ c.prog++; return true; } } },
  bag:   {name:'Mixed Bag', icon:'🧺', mins:6, m:.3, rule:c=>'Land '+c.need+' different species', hint:()=>'Every species counts once. Try different spots and casting distances to find the less common ones.',
    setup:o=>{ const n=6*CATCHES_PER_MIN, e=o.shares.reduce((a,[s,p])=>a+(1-Math.pow(1-p,n)),0); return {need:Math.max(4,Math.round(e*.9)), seen:[]}; },
    onCatch:(c,f)=>{ if(!c.seen.includes(f.sp.id)){ c.seen.push(f.sp.id); c.prog=c.seen.length; return true; } } },
  long:  {name:'Long Cast', icon:'🎯', mins:6, m:.25, rule:c=>'Land '+c.need+' fish from far casts', hint:()=>'Charge your cast past the far mark on the power bar. Far casts also bring better fish. Long Caster lowers the mark.',
    setup:()=>({need:5}), onCatch:(c,f,perfect,far)=>{ if(far){ c.prog++; return true; } } },
  steady:{name:'Steady Hands', icon:'✋', mins:6, m:.25, rule:c=>'Land '+c.need+' perfect-hook fish without losing one', hint:()=>'Strike the instant it bites. A late hook just does not count; only a hooked fish that gets away resets the count. A longer hook window (Hook upgrades, Quick Reflexes) helps.',
    setup:()=>({need:4}), onCatch:(c,f,perfect)=>{ if(perfect){ c.prog++; return true; } }, onLost:(c)=>{ if(c.prog){ c.prog=0; toast('Fish lost: Steady Hands count back to 0.'); return true; } } }, /* director 2026-11-18: counters reset only on a failed catch, never on a late hook that still lands the fish */
  treasure:{name:'Treasure Dive', icon:'🧭', mins:6, m:.3, rule:c=>'Fish up '+c.need+' piece'+(c.need>1?'s':'')+' of junk or treasure', hint:()=>'Your chance of junk or treasure per bite here: '+fmtOdds(junkChance())+'. Magnet Lures, the Magnet Tip and Scavenger raise it.',
    setup:()=>({need:Math.max(1,Math.min(5,Math.round(6*CATCHES_PER_MIN*junkChance()*.85)))}), onJunk:(c)=>{ c.prog++; return true; } },
  weigh: {name:'Trophy Weigh-in', icon:'⚖️', mins:5, m:.35, rule:()=>'Weigh in your heaviest fish', hint:()=>'Only your heaviest fish counts. Spinners, Trophy Hunter and Feather Flies bring bigger fish.', ranked:true, slow:true,
    setup:()=>{ // rivals are set from what anglers really catch here: the best fish out of a five-minute session
      const n=Math.round(5*CATCHES_PER_MIN), trials=[]; for(let t=0;t<80;t++){ let best=0; for(let i=0;i<n;i++){ const f=chooseCatch(); if(f.kind==='fish'&&!f.hy) best=Math.max(best,f.kg); } trials.push(best); } trials.sort((a,b)=>a-b);
      const q=k=>+trials[Math.floor(k*(trials.length-1))].toFixed(2), names=CHAL_RIVALS.slice().sort(()=>Math.random()-.5).slice(0,3);
      return {need:1, best:0, rivals:[[names[0],q(.62)],[names[1],q(.42)],[names[2],q(.2)]]}; },
    onCatch:(c,f)=>{ if(!f.hy&&f.kg>c.best){ c.best=+f.kg.toFixed(2); c.prog=1; return true; } } },
};
function chalPlace(c){ return 1+c.rivals.filter(r=>r[1]>c.best).length; }
function chalReward(m){ const base=bestLoot(); return {coins:Math.round(base*25*m*coinMult()), scales:Math.max(1,Math.round(30*m)), tickets:Math.round(150*m), xp:Math.round(300*m)}; }
function chalStart(id){ const C=CHAL[id]; if(!C||S.chal||(S.chalCd&&S.chalCd[id]>Date.now())) return false;
  const o=catchOdds(), extra=C.setup(o); S.chal=Object.assign({id, until:Date.now()+C.mins*MIN, loc:S.loc, prog:0}, extra);
  try{ sfx.catch(2); }catch(e){ oops('bk_events036:sfx.catch',e); } save(); return true; } /* no notice: the Events page shows the challenge you started (director, 2026-11-21) */
function chalEnd(won){ const c=S.chal; if(!c) return; const C=CHAL[c.id]; S.chal=null; S.chalCd=S.chalCd||{}; S.chalCd[c.id]=Date.now()+CHAL_CD;
  let title, m=0; if(C.ranked){ const place=c.best>0?chalPlace(c):4; m=place<=3?[1,.55,.3][place-1]*C.m:0; title=c.best>0?(['🥇 First place!','🥈 Second place','🥉 Third place','Fourth place'][place-1]):'No fish weighed in'; }
  else { m=won?C.m:0; title=won?C.name+' complete!':C.name+': out of time'; }
  let txt; if(m>0){ const r=chalReward(m); earn(r.coins); S.scales+=r.scales; S.tickets+=r.tickets; addPassXP(r.xp); txt=`+${fmt(r.coins)} coins, +${r.scales} Scales, +${r.tickets} tickets`; try{ sfx.catch(4); }catch(e){ oops('bk_events036:sfx.catch#2',e); } S.stats.chalWins=(S.stats.chalWins||0)+1; }
  else { S.tickets+=10; txt='+10 tickets for taking part'; try{ sfx.lost(); }catch(e){ oops('bk_events036:sfx.lost',e); } }
  const table=C.ranked?`<div class="list" style="margin:8px 0">${[['You',c.best],...c.rivals].sort((a,b)=>b[1]-a[1]).map((r,i)=>`<div class="row spread prize"><span>${i+1}. <b>${esc(r[0])}</b></span><span>${r[1]?wFix(r[1],2):'–'}</span></div>`).join('')}</div>`:`<p class="sub">${c.prog} / ${c.need}</p>`;
  const show=()=>{ $('evin').innerHTML=`<div class="rar" style="color:var(--gold)">${C.icon} ${esc(C.name)}</div><h3>${esc(title)}</h3>${table}<p class="sub">${txt}</p><button class="btn" data-ev="skip">Back to fishing</button>`; G.st='event'; $('evcard').hidden=false; };
  if(G.st==='idle') show(); else setTimeout(()=>{ if(G.st==='idle') show(); else toast(C.name+': '+title+'. '+txt); },2500);
  checkFeats(); save(); if(S.tab==='events') renderPanel(); }
function chalProgress(){ const c=S.chal, C=CHAL[c.id]; if(!C.ranked&&c.prog>=c.need) setTimeout(()=>chalEnd(true),900); else save(); if(S.tab==='events') renderPanel(); }
// progress from every landed fish (the fish, its hook and its cast are read before the catch is processed)
const _landFish_036=landFish;
landFish=function(){ const f=G.fish, perfect=!!G.perfect, far=G.lastCast>farAt(); _landFish_036.apply(this,arguments);
  try{ const c=S.chal; if(c&&f&&f.kind==='fish'&&Date.now()<c.until&&S.loc===c.loc){ const C=CHAL[c.id]; if(C.onCatch&&C.onCatch(c,f,perfect,far)) chalProgress(); else if(S.tab==='events') renderPanel(); } }catch(e){ oops('bk_events036:Date.now',e); } };
const _landJunk_04=landJunk;
landJunk=function(){ _landJunk_04.apply(this,arguments); try{ const c=S.chal; if(c&&Date.now()<c.until&&S.loc===c.loc){ const C=CHAL[c.id]; if(C.onJunk&&C.onJunk(c)) chalProgress(); } }catch(e){ oops('bk_events036:Date.now#2',e); } };
// scheduled events lift their stat while they last (through the shared bonus, so cards and odds show it too)
const _bonus_036=bonus;
bonus=function(k){ let v=_bonus_036(k); for(const e of SCHED) if(e.fx[k]&&schedLeft(e)) v+=typeof e.fx[k]==='function'?e.fx[k]():e.fx[k]; return v; };
const schedWas={}; SCHED.forEach(e=>schedWas[e.id]=!!schedLeft(e));
setInterval(()=>{ const c=S.chal; if(c&&Date.now()>=c.until) chalEnd(false);
  let changed=false; for(const e of SCHED){ const on=!!schedLeft(e); if(on!==schedWas[e.id]){ changed=true; if(on){ try{ sfx.hot(); }catch(er){ oops('bk_events036:sfx.hot',er); } } /* no notice: the LIVE marker and badges show it (director, 2026-11-21) */ } schedWas[e.id]=on; }
  if(S.tab==='events'){ // a rest that just ended, or a scheduled event starting or ending, redraws the page so its buttons are right
    const stale=changed||[...document.querySelectorAll('[data-evleft]')].some(el=>{ const k=el.dataset.evleft; return CHAL[k]&&!((S.chalCd&&S.chalCd[k]||0)>Date.now()); });
    if(stale){ renderPanel(); return; }
    document.querySelectorAll('[data-evleft]').forEach(el=>{ const k=el.dataset.evleft, e=SCHED.find(x=>x.id===k); const ms=e?(schedLeft(e)||schedNext(e)):k==='chal'&&S.chal?Math.max(0,S.chal.until-Date.now()):(S.chalCd&&S.chalCd[k]||0)-Date.now(); el.textContent=mmss(Math.max(0,Math.ceil(ms/1000))); }); } },1000);
// what the water's goal chip shows while something is live: your challenge first, then a live scheduled event
const _nextGoal_036=nextGoal;
nextGoal=function(){ const c=S.chal; if(c){ const C=CHAL[c.id], left=mmss(Math.max(0,Math.ceil((c.until-Date.now())/1000)));
    const wrong=S.loc!==c.loc?' (at '+LOCS[locIdx(c.loc)].name+')':'';
    if(C.ranked) return {t:C.icon+' '+C.name+' · '+left+wrong, sub:(c.best?'Your best '+wFix(c.best,2)+' · place '+chalPlace(c):'No fish weighed yet')+' · to beat: '+wFix(Math.max(...c.rivals.map(r=>r[1])),2), p:Math.min(1,c.best/Math.max(...c.rivals.map(r=>r[1]))), tab:'events', live:true};
    return {t:C.icon+' '+C.name+' · '+left+wrong, sub:C.rule(c)+': '+c.prog+' / '+c.need, p:c.prog/c.need, tab:'events', live:true}; }
  const e=liveScheds()[0]; if(e){ const l=schedLeft(e); return {t:e.icon+' '+e.name+' · '+mmss(Math.ceil(l/1000))+' left', sub:e.what+' at every water', p:l/(e.len*MIN), tab:'events', live:true}; }
  return _nextGoal_036(); };
// the Events page
function evRewardTxt(m){ const r=chalReward(m); return `<span class="coin">${fmtShort(r.coins)}</span> · ${r.scales} Scales · ${r.tickets} tickets`; }
function schedCal(){ const items=SCHED.map(e=>({e, live:schedLeft(e), next:schedNext(e)})).sort((a,b)=>(a.live?-1e12+a.live:a.next)-(b.live?-1e12+b.live:b.next));
  return `<div class="tile ev-cal"><h4>Event calendar</h4><div class="meta" style="margin-bottom:6px">These run on the clock at every water. Nothing to join: just be fishing.</div>
   ${items.map(({e,live,next})=>`<div class="ev-cal-row ${live?'on':''}" style="--c:${e.col}"><span class="ev-cal-ic">${e.icon}</span><div class="ev-cal-txt"><b>${esc(e.name)}</b><span class="meta">${esc(e.what)} · ${e.len} min, every ${e.every} min</span></div>
     <span class="badge ${live?'g':''}">${live?'Live · <span data-evleft="'+e.id+'">'+mmss(Math.ceil(live/1000))+'</span> left':'In <span data-evleft="'+e.id+'">'+mmss(Math.ceil(next/1000))+'</span>'}</span></div>`).join('')}</div>`; }
function renderEvents(P){ const o=catchOdds(), c=S.chal;
  const active=c?(()=>{ const C=CHAL[c.id], left=Math.max(0,Math.ceil((c.until-Date.now())/1000)), pct=C.ranked?Math.min(1,c.best/Math.max(...c.rivals.map(r=>r[1]))):c.prog/c.need;
    return `<div class="tile ev-active"><div class="row spread"><div><span class="rar" style="color:var(--gold)">Your challenge · ${esc(LOCS[locIdx(c.loc)].name)}</span><h4>${C.icon} ${esc(C.name)}</h4></div><span class="badge g"><span data-evleft="chal">${mmss(left)}</span> left</span></div>
      <div class="meta">${esc(C.rule(c))}${C.ranked?'':': <b>'+c.prog+' / '+c.need+'</b>'}${S.loc!==c.loc?' · <b style="color:#ff9a8a">Only catches at '+esc(LOCS[locIdx(c.loc)].name)+' count</b>':''}</div>
      <i class="ev-bar"><b style="width:${Math.round(pct*100)}%"></b></i>
      ${C.ranked?`<div class="list" style="margin-top:6px">${[['You',c.best],...c.rivals].sort((a,b)=>b[1]-a[1]).map((r,i)=>`<div class="row spread prize"><span>${i+1}. <b>${esc(r[0])}</b></span><span>${r[1]?wFix(r[1],2):'–'}</span></div>`).join('')}</div>`:''}
      <div class="row" style="margin-top:8px"><button class="btn alt sm" data-act="chalquit">Give up</button></div></div>`; })():'';
  const tiles=Object.entries(CHAL).map(([id,C])=>{ const cd=S.chalCd&&S.chalCd[id]>Date.now(), fake={need:C.slow?1:C.setup(o).need};
    const btn=c?'<button class="btn sm" disabled>Finish your challenge first</button>':cd?`<button class="btn alt sm" disabled>Ready in <span data-evleft="${id}">${mmss(Math.ceil((S.chalCd[id]-Date.now())/1000))}</span></button>`:`<button class="btn sm" data-act="chalgo" data-k="${id}">Start · ${C.mins} min</button>`;
    return `<div class="tile ev-ch"><h4>${C.icon} ${esc(C.name)}</h4><div class="meta"><b>${esc(C.rule(fake))}</b> · ${C.mins} minutes, at the water you are on</div><div class="meta">${esc(C.hint(o))}</div>
      <div class="meta ev-rw2">${C.ranked?'Medals: '+evRewardTxt(C.m)+' for first':'Reward: '+evRewardTxt(C.m)}</div>${btn}</div>`; }).join('');
  const base=bestLoot(), row=(icon,m,label)=>`<div class="row spread ev-rw"><span>${icon} <b>${label}</b></span><span class="meta">${m?`<span class="coin">${fmtShort(Math.round(base*25*m*coinMult()))}</span> · ${Math.round(30*m)} Scales · ${Math.round(150*m)} tickets`:'20 tickets for taking part'}</span></div>`;
  P.innerHTML=`<h2>Events</h2><p class="sub">Live events, challenges and the derby. Challenges are sized to your odds here, so better gear and bait make them easier.</p>
   ${active}${schedCal()}<h3 class="ev-h">Challenges</h3>${c?'':'<p class="sub" style="margin-top:-4px">One at a time. Each rests for 12 minutes after it ends.</p>'}<div class="grid ev-grid">${tiles}</div>
   <h3 class="ev-h">Fishing Derby</h3>${derbyHTML()}<div class="tile"><h4>Derby rewards</h4><div class="meta" style="margin-bottom:6px">Four minutes, one water: the heaviest total catch wins.</div>${row('🥇',1,'First place')}${row('🥈',.5,'Second place')}${row('🥉',.25,'Third place')}${row('🎣',0,'Fourth place')}</div>`; };
const _extraAct2_ev036=extraAct2;
extraAct2=function(b){ const a=b.dataset.act; if(a==='chalgo'){ if(G.st!=='idle'&&G.st!=='waiting'&&G.st!=='result'){ toast('Finish your catch first.'); return 'skip'; } return chalStart(b.dataset.k)?'render':'skip'; }
  if(a==='chalquit'){ if(!S.chal) return 'skip'; if(!b.dataset.sure){ b.dataset.sure='1'; b.textContent=(PLAT.touch()?'Tap':'Click')+' again to give up'; return 'skip'; } chalEnd(false); return 'render'; } return _extraAct2_ev036(b); };
// the Events tab shows how many things are live (scheduled events and your challenge)
setInterval(()=>{ const b=document.querySelector('#tabs [data-tab="events"]'); if(!b) return; let d=b.querySelector('.dot'); const n=liveScheds().length+(S.chal?1:0);
  if(n){ if(!d){ d=document.createElement('span'); d.className='dot'; b.appendChild(d); } if(d.textContent!==String(n)) d.textContent=n; } else if(d) d.remove(); },1500);
document.head.insertAdjacentHTML('beforeend',`<style>
#panel .ev-h{margin:16px 0 8px}
#panel .ev-active{border-color:#ffd36a88;box-shadow:inset 0 1px 0 #ffffff12,0 0 22px #ffd36a22;margin:10px 0}
#panel .ev-bar{display:block;height:6px;border-radius:6px;background:#ffffff14;margin-top:8px;overflow:hidden}
#panel .ev-bar b{display:block;height:100%;border-radius:6px;background:linear-gradient(90deg,#7fe3c4,#ffd36a)}
#panel .ev-cal{margin-top:10px}
#panel .ev-cal-row{display:flex;align-items:center;gap:10px;padding:8px 0;border-top:1px solid var(--line)}
#panel .ev-cal-row:first-of-type{border-top:0}
#panel .ev-cal-row.on .ev-cal-ic{box-shadow:0 0 0 2px var(--c),0 0 14px var(--c)}
#panel .ev-cal-ic{flex:0 0 auto;width:30px;height:30px;border-radius:50%;display:grid;place-items:center;background:#ffffff10;font-size:16px}
#panel .ev-cal-txt{flex:1;min-width:0;display:flex;flex-direction:column}
#panel .ev-cal-txt b{color:#fff}
#panel .ev-cal-row .badge{flex:0 0 auto;white-space:nowrap}
#panel .ev-ch .ev-rw2{margin-top:2px;color:#cfdcea}
#panel .ev-ch .btn{margin-top:8px;align-self:flex-start}
#goalchip.live{border-color:#7fe3c488}
#goalchip.live .gl-k{color:#7fe3c4}
</style>`);
// the goal chip says "Live" for events
setInterval(()=>{ const el=$('goalchip'); if(!el) return; const live=!!(S.chal||liveScheds().length); el.classList.toggle('live',live); const k=el.querySelector('.gl-k'); if(k&&live&&k.textContent!=='Live') k.textContent='Live'; },700);
if(/[?&]test\b/.test(location.search)) window.__ev={chalStart, chalEnd, CHAL, SCHED, schedLeft, schedNext, shoalLeft, shoalNext, bonus:k=>bonus(k), junk:()=>junkChance(), rare:()=>rareScore(distanceMods(),false,false,phase())};
// a fish that bit and got away (missed strike, snap, slipped off, ran out the line) is the only thing that resets a challenge count
{ const _ef=endFight; endFight=function(kind){ try{ if(kind!=='caught'&&kind!=='nohook'&&S.chal){ const C=CHAL[S.chal.id]; if(C&&C.onLost&&C.onLost(S.chal)){ save(); if(S.tab==='events') renderPanel(); } } }catch(e){ console.error(e); } return _ef.apply(this,arguments); }; }
