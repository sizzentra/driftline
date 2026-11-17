// =====================================================================
// 0.3.6 Events, expanded. Three kinds of event, each asking for a different way of fishing:
//  - Challenges you start whenever you like (one at a time, each rests 12 minutes after it ends): Rare Run, Mixed Bag,
//    Steady Hands and Trophy Weigh-in. Every target is set from your real odds at this water with your gear and bait,
//    so a challenge is fair at every stage of the game, and better choices make it easier.
//  - The Shoal Run: a scheduled event on the real clock (8 minutes every 90), bites and rare odds up at every water.
//  - The Fishing Derby (unchanged).
// Live progress shows on the water. Rewards scale with your best water like the derby, at about a third of a derby win.
// =====================================================================
const CHAL_CD=12*60*1000, SHOAL_EVERY=90*60*1000, SHOAL_LEN=8*60*1000;
const CHAL_RIVALS=['Old Marta','Captain Reed','Lily-Ann','Bo the Barge'];
const shoalLeft = () => { const t=Date.now()%SHOAL_EVERY; return t<SHOAL_LEN ? SHOAL_LEN-t : 0; };
const shoalNext = () => SHOAL_EVERY-(Date.now()%SHOAL_EVERY);
const CATCHES_PER_MIN = 3.6; // a steady pace (about one landed fish every 16 seconds), used to size targets
const CHAL={
  rare:  {name:'Rare Run', icon:'💎', mins:6, m:.3, rule:c=>'Land '+c.need+' Rare or better fish', hint:o=>'Your chance of Rare or better per catch here: '+fmtOdds(o.by[2]+o.by[3]+o.by[4]+o.by[5])+'. Better bait, hotspots and far casts raise it.',
    setup:o=>{ const q=o.by[2]+o.by[3]+o.by[4]+o.by[5]; return {need:Math.max(2,Math.min(8,Math.round(6*CATCHES_PER_MIN*q*.75)))}; },
    onCatch:(c,f)=>{ if(f.sp.r>=2){ c.prog++; return true; } } },
  bag:   {name:'Mixed Bag', icon:'🧺', mins:6, m:.3, rule:c=>'Land '+c.need+' different species', hint:()=>'Every species counts once. Try different spots and casting distances to find the less common ones.',
    setup:o=>{ const n=6*CATCHES_PER_MIN, e=o.shares.reduce((a,[s,p])=>a+(1-Math.pow(1-p,n)),0); return {need:Math.max(4,Math.round(e*.9)), seen:[]}; },
    onCatch:(c,f)=>{ if(!c.seen.includes(f.sp.id)){ c.seen.push(f.sp.id); c.prog=c.seen.length; return true; } } },
  steady:{name:'Steady Hands', icon:'✋', mins:6, m:.25, rule:c=>'Land '+c.need+' perfect-hook fish in a row', hint:()=>'Strike the instant it bites. A fish hooked late resets the count. A longer hook window (Hook upgrades, Quick Reflexes) helps.',
    setup:()=>({need:4}), onCatch:(c,f,perfect)=>{ if(perfect){ c.prog++; return true; } if(c.prog){ c.prog=0; toast('Late hook: Steady Hands count back to 0.'); } } },
  weigh: {name:'Trophy Weigh-in', icon:'⚖️', mins:5, m:.35, rule:()=>'Weigh in your heaviest fish', hint:()=>'Only your heaviest fish counts. Spinners, Trophy Hunter and Feather Flies bring bigger fish.', ranked:true,
    setup:()=>{ // rivals are set from what anglers really catch here: the best fish out of a five-minute session
      const n=Math.round(5*CATCHES_PER_MIN), trials=[]; for(let t=0;t<80;t++){ let best=0; for(let i=0;i<n;i++){ const f=chooseCatch(); if(f.kind==='fish'&&!f.hy) best=Math.max(best,f.kg); } trials.push(best); } trials.sort((a,b)=>a-b);
      const q=k=>+trials[Math.floor(k*(trials.length-1))].toFixed(2), names=CHAL_RIVALS.slice().sort(()=>Math.random()-.5).slice(0,3);
      return {need:1, best:0, rivals:[[names[0],q(.62)],[names[1],q(.42)],[names[2],q(.2)]]}; },
    onCatch:(c,f)=>{ if(!f.hy&&f.kg>c.best){ c.best=+f.kg.toFixed(2); c.prog=1; return true; } } },
};
function chalPlace(c){ return 1+c.rivals.filter(r=>r[1]>c.best).length; }
function chalReward(m){ const base=bestLoot(); return {coins:Math.round(base*25*m*coinMult()), scales:Math.max(1,Math.round(30*m)), tickets:Math.round(150*m), xp:Math.round(300*m)}; }
function chalStart(id){ const C=CHAL[id]; if(!C||S.chal||(S.chalCd&&S.chalCd[id]>Date.now())) return false;
  const o=catchOdds(), extra=C.setup(o); S.chal=Object.assign({id, until:Date.now()+C.mins*60000, loc:S.loc, prog:0}, extra);
  toast(C.icon+' '+C.name+' started at '+curLoc().name+': '+C.rule(S.chal)+' in '+C.mins+' minutes.'); try{ sfx.catch(2); }catch(e){} save(); return true; }
function chalEnd(won){ const c=S.chal; if(!c) return; const C=CHAL[c.id]; S.chal=null; S.chalCd=S.chalCd||{}; S.chalCd[c.id]=Date.now()+CHAL_CD;
  let title, m=0; if(C.ranked){ const place=c.best>0?chalPlace(c):4; m=place<=3?[1,.55,.3][place-1]*C.m:0; title=c.best>0?(['🥇 First place!','🥈 Second place','🥉 Third place','Fourth place'][place-1]):'No fish weighed in'; }
  else { m=won?C.m:0; title=won?C.name+' complete!':C.name+': out of time'; }
  let txt; if(m>0){ const r=chalReward(m); earn(r.coins); S.scales+=r.scales; S.tickets+=r.tickets; addPassXP(r.xp); txt=`+${fmt(r.coins)} coins, +${r.scales} Scales, +${r.tickets} tickets`; try{ sfx.catch(4); }catch(e){} S.stats.chalWins=(S.stats.chalWins||0)+1; }
  else { S.tickets+=10; txt='+10 tickets for taking part'; try{ sfx.lost(); }catch(e){} }
  const table=C.ranked?`<div class="list" style="margin:8px 0">${[['You',c.best],...c.rivals].sort((a,b)=>b[1]-a[1]).map((r,i)=>`<div class="row spread prize"><span>${i+1}. <b>${esc(r[0])}</b></span><span>${r[1]?r[1].toFixed(2)+' kg':'–'}</span></div>`).join('')}</div>`:`<p class="sub">${c.prog} / ${c.need}</p>`;
  const show=()=>{ $('evin').innerHTML=`<div class="rar" style="color:var(--gold)">${C.icon} ${esc(C.name)}</div><h3>${esc(title)}</h3>${table}<p class="sub">${txt}</p><button class="btn" data-ev="skip">Back to fishing</button>`; G.st='event'; $('evcard').hidden=false; };
  if(G.st==='idle') show(); else setTimeout(()=>{ if(G.st==='idle') show(); else toast(C.name+': '+title+'. '+txt); },2500);
  checkFeats(); save(); if(S.tab==='events') renderPanel(); }
// progress from every landed fish (the fish and whether its hook was perfect are read before the catch is processed)
const _landFish_036=landFish;
landFish=function(){ const f=G.fish, perfect=!!G.perfect; _landFish_036.apply(this,arguments);
  try{ const c=S.chal; if(c&&f&&f.kind==='fish'&&Date.now()<c.until&&S.loc===c.loc){ const C=CHAL[c.id]; if(C.onCatch(c,f,perfect)){ if(!C.ranked&&c.prog>=c.need) setTimeout(()=>chalEnd(true),900); else save(); } if(S.tab==='events') renderPanel(); } }catch(e){} };
// the Shoal Run lifts bites and rare odds while it lasts (through the shared bonus, so cards and odds show it too)
const _bonus_036=bonus;
bonus=function(k){ const v=_bonus_036(k); if(!shoalLeft()) return v; return k==='bite'?v+.6:k==='rare'?v+.15:v; };
let shoalWas=!!shoalLeft();
setInterval(()=>{ const c=S.chal; if(c&&Date.now()>=c.until) chalEnd(false);
  const on=!!shoalLeft(); if(on&&!shoalWas){ toast('🐟 A Shoal Run is passing through every water: bites +60% and more rare fish for 8 minutes!'); try{ sfx.hot(); }catch(e){} } shoalWas=on;
  if(S.tab==='events'){ // a rest that just ended, or the Shoal Run starting or ending, redraws the page so its buttons are right
    const stale=[...document.querySelectorAll('[data-evleft]')].some(el=>{ const k=el.dataset.evleft; return k!=='shoal'&&k!=='chal'&&!((S.chalCd&&S.chalCd[k]||0)>Date.now()); }) || (document.querySelector('#panel .ev-live')&&document.querySelector('#panel .ev-live').classList.contains('on')!==on);
    if(stale){ renderPanel(); return; }
    document.querySelectorAll('[data-evleft]').forEach(el=>{ const k=el.dataset.evleft; const ms=k==='shoal'?(shoalLeft()||shoalNext()):k==='chal'&&S.chal?Math.max(0,S.chal.until-Date.now()):(S.chalCd&&S.chalCd[k]||0)-Date.now(); el.textContent=mmss(Math.max(0,Math.ceil(ms/1000))); }); } },1000);
// what the water's goal chip shows while something is live: your challenge first, then the Shoal Run
const _nextGoal_036=nextGoal;
nextGoal=function(){ const c=S.chal; if(c){ const C=CHAL[c.id], left=mmss(Math.max(0,Math.ceil((c.until-Date.now())/1000)));
    const wrong=S.loc!==c.loc?' (at '+LOCS[locIdx(c.loc)].name+')':'';
    if(C.ranked) return {t:C.icon+' '+C.name+' · '+left+wrong, sub:(c.best?'Your best '+c.best.toFixed(2)+' kg · place '+chalPlace(c):'No fish weighed yet')+' · to beat: '+Math.max(...c.rivals.map(r=>r[1])).toFixed(2)+' kg', p:Math.min(1,c.best/Math.max(...c.rivals.map(r=>r[1]))), tab:'events', live:true};
    return {t:C.icon+' '+C.name+' · '+left+wrong, sub:C.rule(c)+': '+c.prog+' / '+c.need, p:c.prog/c.need, tab:'events', live:true}; }
  const sl=shoalLeft(); if(sl) return {t:'🐟 Shoal Run · '+mmss(Math.ceil(sl/1000))+' left', sub:'Bites +60% and more rare fish at every water', p:sl/SHOAL_LEN, tab:'events', live:true};
  return _nextGoal_036(); };
// the Events page
function evRewardTxt(m){ const r=chalReward(m); return `<span class="coin">${fmtShort(r.coins)}</span> · ${r.scales} Scales · ${r.tickets} tickets`; }
renderEvents=function(P){ const o=catchOdds(), c=S.chal, sl=shoalLeft();
  const shoal=`<div class="tile ev-live ${sl?'on':''}"><div class="row spread"><div><span class="rar" style="color:${sl?'var(--kelp)':'var(--muted)'}">${sl?'Live now':'Scheduled'}</span><h4>🐟 Shoal Run</h4></div><span class="badge ${sl?'g':''}">${sl?'<span data-evleft="shoal">'+mmss(Math.ceil(sl/1000))+'</span> left':'Next in <span data-evleft="shoal">'+mmss(Math.ceil(shoalNext()/1000))+'</span>'}</span></div>
    <div class="meta">Every 90 minutes a great shoal passes through every water for 8 minutes: bites come 60% faster and rare fish are more common. Nothing to join, just be fishing.</div></div>`;
  const active=c?(()=>{ const C=CHAL[c.id], left=Math.max(0,Math.ceil((c.until-Date.now())/1000)), pct=C.ranked?Math.min(1,c.best/Math.max(...c.rivals.map(r=>r[1]))):c.prog/c.need;
    return `<div class="tile ev-active"><div class="row spread"><div><span class="rar" style="color:var(--gold)">Your challenge · ${esc(LOCS[locIdx(c.loc)].name)}</span><h4>${C.icon} ${esc(C.name)}</h4></div><span class="badge g"><span data-evleft="chal">${mmss(left)}</span> left</span></div>
      <div class="meta">${esc(C.rule(c))}${C.ranked?'':': <b>'+c.prog+' / '+c.need+'</b>'}${S.loc!==c.loc?' · <b style="color:#ff9a8a">Only catches at '+esc(LOCS[locIdx(c.loc)].name)+' count</b>':''}</div>
      <i class="ev-bar"><b style="width:${Math.round(pct*100)}%"></b></i>
      ${C.ranked?`<div class="list" style="margin-top:6px">${[['You',c.best],...c.rivals].sort((a,b)=>b[1]-a[1]).map((r,i)=>`<div class="row spread prize"><span>${i+1}. <b>${esc(r[0])}</b></span><span>${r[1]?r[1].toFixed(2)+' kg':'–'}</span></div>`).join('')}</div>`:''}
      <div class="row" style="margin-top:8px"><button class="btn alt sm" data-act="chalquit">Give up</button></div></div>`; })():'';
  const tiles=Object.entries(CHAL).map(([id,C])=>{ const cd=S.chalCd&&S.chalCd[id]>Date.now(), fake={need:C.setup===CHAL.weigh.setup?1:C.setup(o).need};
    const btn=c?'<button class="btn sm" disabled>Finish your challenge first</button>':cd?`<button class="btn alt sm" disabled>Ready in <span data-evleft="${id}">${mmss(Math.ceil((S.chalCd[id]-Date.now())/1000))}</span></button>`:`<button class="btn sm" data-act="chalgo" data-k="${id}">Start · ${C.mins} min</button>`;
    return `<div class="tile ev-ch"><h4>${C.icon} ${esc(C.name)}</h4><div class="meta"><b>${esc(C.rule(fake))}</b> · ${C.mins} minutes, at the water you are on</div><div class="meta">${esc(C.hint(o))}</div>
      <div class="meta ev-rw2">${C.ranked?'Medals: '+evRewardTxt(C.m)+' for first':'Reward: '+evRewardTxt(C.m)}</div>${btn}</div>`; }).join('');
  const base=bestLoot(), row=(icon,m,label)=>`<div class="row spread ev-rw"><span>${icon} <b>${label}</b></span><span class="meta">${m?`<span class="coin">${fmtShort(Math.round(base*25*m*coinMult()))}</span> · ${Math.round(30*m)} Scales · ${Math.round(150*m)} tickets`:'20 tickets for taking part'}</span></div>`;
  P.innerHTML=`<h2>Events</h2><p class="sub">Live events and challenges with their own rewards. Challenges are sized to your odds here, so better gear and bait make them easier.</p>
   ${shoal}${active}<h3 class="ev-h">Challenges</h3>${c?'':'<p class="sub" style="margin-top:-4px">One at a time. Each rests for 12 minutes after it ends.</p>'}<div class="grid ev-grid">${tiles}</div>
   <h3 class="ev-h">Fishing Derby</h3>${derbyHTML()}<div class="tile"><h4>Derby rewards</h4><div class="meta" style="margin-bottom:6px">Four minutes, one water: the heaviest total catch wins.</div>${row('🥇',1,'First place')}${row('🥈',.5,'Second place')}${row('🥉',.25,'Third place')}${row('🎣',0,'Fourth place')}</div>`; };
const _extraAct2_ev036=extraAct2;
extraAct2=function(b){ const a=b.dataset.act; if(a==='chalgo'){ if(G.st!=='idle'&&G.st!=='waiting'&&G.st!=='result'){ toast('Finish your catch first.'); return 'skip'; } return chalStart(b.dataset.k)?'render':'skip'; }
  if(a==='chalquit'){ if(!S.chal) return 'skip'; if(!b.dataset.sure){ b.dataset.sure='1'; b.textContent='Tap again to give up'; return 'skip'; } chalEnd(false); return 'render'; } return _extraAct2_ev036(b); };
// the Events tab shows a dot while the Shoal Run is live or a challenge is running
setInterval(()=>{ const b=document.querySelector('#tabs [data-tab="events"]'); if(!b) return; let d=b.querySelector('.dot'); const n=(shoalLeft()?1:0)+(S.chal?1:0);
  if(n){ if(!d){ d=document.createElement('span'); d.className='dot'; b.appendChild(d); } if(d.textContent!==String(n)) d.textContent=n; } else if(d) d.remove(); },1500);
document.head.insertAdjacentHTML('beforeend',`<style>
#panel .ev-h{margin:16px 0 8px}
#panel .ev-live.on{border-color:#7fe3c488;box-shadow:inset 0 1px 0 #ffffff12,0 0 22px #7fe3c422}
#panel .ev-active{border-color:#ffd36a88;box-shadow:inset 0 1px 0 #ffffff12,0 0 22px #ffd36a22;margin-top:10px}
#panel .ev-bar{display:block;height:6px;border-radius:6px;background:#ffffff14;margin-top:8px;overflow:hidden}
#panel .ev-bar b{display:block;height:100%;border-radius:6px;background:linear-gradient(90deg,#7fe3c4,#ffd36a)}
#panel .ev-ch .ev-rw2{margin-top:2px;color:#cfdcea}
#panel .ev-ch .btn{margin-top:8px;align-self:flex-start}
#goalchip.live{border-color:#7fe3c488}
#goalchip.live .gl-k{color:#7fe3c4}
</style>`);
// the goal chip says "Live" for events
setInterval(()=>{ const el=$('goalchip'); if(!el) return; const live=!!(S.chal||shoalLeft()); el.classList.toggle('live',live); const k=el.querySelector('.gl-k'); if(k&&live&&k.textContent!=='Live') k.textContent='Live'; },700);
if(/[?&]test\b/.test(location.search)) window.__ev={chalStart, chalEnd, CHAL, shoalLeft, shoalNext, bonus:k=>bonus(k), rareRaw:()=>_rareScore_034(distanceMods(),false,false,phase()), rare:()=>rareScore(distanceMods(),false,false,phase())};
