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
{ const _rb=renderBounties; renderBounties=function(P){ _rb(P); try{ const d=[...P.children].find(c=>c.classList&&c.classList.contains('tile')&&/Daily tasks/.test(c.textContent)); const html=weeklyHTML(); if(d) d.insertAdjacentHTML('afterend',html); else P.insertAdjacentHTML('afterbegin',html); }catch(e){} }; }
{ const _xw=extraAct2; extraAct2=function(b){ const a=b.dataset.act;
  if(a==='wqclaim'){ const w=ensureWeekly(), q=w.quests[+b.dataset.i]; if(!q||q.claimed||wqHave(q)<q.n) return 'skip'; q.claimed=true; const c=earn(q.coins*coinMult()); S.scales+=q.scales; try{ addPassXP(60); }catch(e){} try{ sfx.coin(); }catch(e){} toast('Weekly quest done: +'+fmt(c)+' coins, +'+q.scales+' Scales'); save(); return 'render'; }
  if(a==='wqbonus'){ const w=ensureWeekly(); if(w.bonus||!w.quests.every(q=>q.claimed)) return 'skip'; w.bonus=true; S.tokens.big=(S.tokens.big||0)+1; S.scales+=25; try{ sfx.catch(3); }catch(e){} toast('All weekly quests done! +25 Scales and a big Mystery Crate at the Boardwalk.'); save(); return 'render'; }
  return _xw(b); }; }
if(typeof ACT_OK==='object'){ ACT_OK.wqclaim=(k,i)=>Number.isInteger(i)&&i>=0&&i<ensureWeekly().quests.length; ACT_OK.wqbonus=()=>true; }
// the Bounties tab counts claimable weekly quests too
{ const _hudw=hud; hud=function(){ _hudw.apply(this,arguments); try{ const b=document.querySelector('#tabs [data-tab="bounties"]'); if(!b) return; const n=S.bounties.filter(x=>bDone(x)).length+(S.daily?S.daily.tasks.filter(t=>!t.claimed&&taskHave(t)>=t.n).length:0)+wqReady(); const d=b.querySelector('.dot');
  if(n){ if(d){ if(d.textContent!==String(n)) d.textContent=n; } else b.insertAdjacentHTML('beforeend','<span class="dot">'+n+'</span>'); } else if(d) d.remove(); }catch(e){} }; }

// ---------- 2. weather forecast ----------
const WX_SPECIAL=new Set(['Rainbow','Gilded','Aurora','Blood Moon','Spawning Run']);
function wxForecast(n=6){ const now=Date.now()/1000, cur=Math.floor(now/WX_LEN), out=[]; for(let i=1;out.length<n&&i<60;i++){ const w=weatherAt(cur+i), prev=out[out.length-1]; if(prev&&prev.k===w.k){ prev.len+=WX_LEN; continue; } if(!prev&&w.k===weatherAt(cur).k) continue; out.push({k:w.k, note:w.note, at:(cur+i)*WX_LEN-now, len:WX_LEN}); } return out; }
function forecastHTML(){ const now=weather(), f=wxForecast(5), tag=k=>(typeof WX_TAG==='object'&&WX_TAG[k])||'';
  return `<div class="tile wxf" style="margin-top:10px"><h4>Weather forecast</h4><div class="meta">The weather turns every few minutes at every water. Plan your fishing around it.</div>
   <div class="wxf-row on"><b>Now: ${esc(wxName(now.k))}</b><span class="meta">${esc(tag(now.k)||now.note)}</span><span class="badge g" data-wxl>${mmss(wxLeft())} left</span></div>
   ${f.map(x=>`<div class="wxf-row${WX_SPECIAL.has(x.k)?' sp':''}"><b>${esc(wxName(x.k))}</b><span class="meta">${esc(tag(x.k)||x.note)}</span><span class="badge ${WX_SPECIAL.has(x.k)?'g':'n'}">in ${mmss(Math.max(0,Math.round(x.at)))}</span></div>`).join('')}</div>`; }
{ const _re=renderEvents; renderEvents=function(P){ _re(P); try{ const cal=P.querySelector('.ev-cal'); const html=forecastHTML(); if(cal) cal.insertAdjacentHTML('afterend',html); else P.insertAdjacentHTML('beforeend',html); }catch(e){} }; }
// keep the forecast's countdowns live while the Events page is open (one cheap text update a second)
setInterval(()=>{ if(S.tab!=='events') return; const box=document.querySelector('#panel .wxf'); if(!box) return; const now=Date.now()/1000, cur=Math.floor(now/WX_LEN); if(box.dataset.slot&&+box.dataset.slot!==cur){ box.outerHTML=forecastHTML(); return; } box.dataset.slot=cur;
  const l=box.querySelector('[data-wxl]'); if(l) l.textContent=mmss(wxLeft())+' left'; const f=wxForecast(5); box.querySelectorAll('.wxf-row:not(.on) .badge').forEach((b,i)=>{ if(f[i]) b.textContent='in '+mmss(Math.max(0,Math.round(f[i].at))); }); },1000);
// a heads-up a minute before rare weather starts (once per weather change)
let wxWarned=-1; setInterval(()=>{ try{ const cur=Math.floor(Date.now()/1000/WX_LEN), next=weatherAt(cur+1); if(!WX_SPECIAL.has(next.k)||next.k===weatherAt(cur).k||wxWarned===cur||wxLeft()>60) return; wxWarned=cur; toast(wxName(next.k)+' weather starts in under a minute: '+((typeof WX_TAG==='object'&&WX_TAG[next.k])||next.note)); }catch(e){} },5000);
document.head.insertAdjacentHTML('beforeend',`<style>
#panel .wxf-row{display:flex;align-items:center;gap:10px;padding:6px 0;border-top:1px solid var(--line)}
#panel .wxf-row > b{flex:0 0 auto;min-width:96px}
#panel .wxf-row > .meta{flex:1 1 auto;min-width:0}
#panel .wxf-row > .badge{flex:0 0 auto;white-space:nowrap}
#panel .wxf-row.on > b{color:var(--gold,#ffd36a)}
#panel .wxf-row.sp > b{color:#ffe7a6}
@container (min-width:560px){ #menuov #panel .wxf{display:grid;grid-template-columns:repeat(auto-fill,minmax(230px,1fr));column-gap:14px} #menuov #panel .wxf > h4,#menuov #panel .wxf > .meta{grid-column:1 / -1} }
</style>`);

if(/[?&]test\b/.test(location.search)) window.__feat={ensureWeekly, wqHave, wqReady, weeklyHTML, wxForecast, forecastHTML, weekKey};
document.head.insertAdjacentHTML('beforeend','<style>#panel .badge.n{background:#ffffff0d;color:#c9d7e8;border-color:#ffffff24}</style>');
document.head.insertAdjacentHTML('beforeend','<style>@container (min-width:560px){ #menuov #panel .tile.dtasks > :not(.toggle){grid-column:1 / -1} #menuov #panel .tile.dtasks > .btn{justify-self:start} }</style>');
