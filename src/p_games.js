
// =====================================================================
// 0.3 mini-games between catches: Knot Tying, Memory Match and Stone Skipping join Fish Frenzy and
// the Three Chests. Every one can be skipped, and Settings can turn them off for good.
// =====================================================================
const MG_NEW = ['knot','memory','skip'];
let MG=null;
function afterCard(){ catchesSinceEvent++; if(pendingEvent){ const ev=pendingEvent; pendingEvent=null; openEvent(ev); return; }
  if(S.settings.minigames===false) return;
  if(S.stats.caught>=5 && catchesSinceEvent>=6 && Math.random()<.12){ catchesSinceEvent=0; openEvent(pick(['frenzy','chests','frenzy','chests',...MG_NEW])); } };
const _openEvent0 = openEvent;
openEvent = function(kind){ if(!MG_NEW.includes(kind)) return _openEvent0(kind); const box=$('evin'); G.st='event'; clearInterval(MG&&MG.iv); MG={kind};
  const head=(t,s)=>`<div class="rar" style="color:var(--gold)">Mini-game</div><h3>${t}</h3><p class="sub">${s}</p>`, skip='<button class="btn alt" data-ev="skip">Not now</button>';
  if(kind==='knot') box.innerHTML=head('Tie the knot','A big one is coming. Tap the arrows in order before the timer runs out. Every step tied pays.')+`<div class="row" style="justify-content:center;margin-top:12px"><button class="btn" data-ev="mgstart">Ready</button>${skip}</div>`;
  if(kind==='memory') box.innerHTML=head('Tackle box shuffle','Your lures got mixed up. Find the matching pairs in eight tries or fewer.')+`<div class="row" style="justify-content:center;margin-top:12px"><button class="btn" data-ev="mgstart">Open the box</button>${skip}</div>`;
  if(kind==='skip') box.innerHTML=head('Skip a stone','The water is glassy. Throw when the marker is in the green: the closer to the middle, the more skips. Three throws.')+`<div class="row" style="justify-content:center;margin-top:12px"><button class="btn" data-ev="mgstart">Pick up a stone</button>${skip}</div>`;
  $('evcard').hidden=false; sfx.hot(); };
const MG_ARROWS=['←','↑','→','↓'], MG_LURES=['🐟','🦀','🐚','🪱','🦐','🐙'];
function mgDone(title,coins,extra){ clearInterval(MG&&MG.iv); const c=coins>0?bwEarn(coins*coinMult()):0; S.gstats.minis=(S.gstats.minis||0)+1; MG=null; sfx.catch(c?3:1); if(c) sfx.coin();
  $('evin').innerHTML=`<h3>${esc(title)}</h3><p class="sub">${c?'You earned <b class="coin">'+fmt(c)+'</b>.':'Nothing this time.'}${extra?' '+esc(extra):''}</p><button class="btn" data-ev="skip">Keep fishing</button>`; checkFeats(); save(); lastHud=''; }
function mgRender(){ const box=$('evin'), base=bestLoot();
  if(MG.kind==='knot'){ const left=Math.max(0,MG.end-performance.now())/1000;
    box.innerHTML=`<h3>Tie the knot</h3><div class="row" style="justify-content:center;gap:6px;font-size:26px;margin:8px 0">${MG.seq.map((a,i)=>`<span style="opacity:${i<MG.at?.3:1};color:${i===MG.at?'var(--gold)':'var(--ink)'}">${a}</span>`).join('')}</div>
      <div class="prog"><i style="width:${left/MG.dur*100}%"></i></div><div class="row" style="justify-content:center;gap:8px;margin-top:12px">${MG_ARROWS.map(a=>`<button class="btn alt" style="font-size:22px;min-width:56px" data-ev="mgkey" data-k="${a}">${a}</button>`).join('')}</div>`; }
  if(MG.kind==='memory'){ box.innerHTML=`<h3>Tackle box shuffle</h3><p class="sub">${MG.pairs} of ${MG.cards.length/2} pairs · ${MG.tries} tries left</p><div style="display:grid;grid-template-columns:repeat(4,1fr);gap:8px;margin-top:8px">${MG.cards.map((c,i)=>`<button class="btn alt" style="font-size:24px;height:58px" data-ev="mgcard" data-i="${i}" ${MG.open.includes(i)||MG.got[i]?'disabled':''}>${MG.open.includes(i)||MG.got[i]?c:'?'}</button>`).join('')}</div>`; }
  if(MG.kind==='skip'){ box.innerHTML=`<h3>Skip a stone</h3><p class="sub">Throw ${MG.n+1} of 3 · best so far: ${MG.best} skip${MG.best===1?'':'s'}</p>
      <div style="position:relative;height:22px;border-radius:11px;background:#0a1220;overflow:hidden;margin:12px 0"><i style="position:absolute;left:38%;width:24%;top:0;bottom:0;background:#2a7a5a"></i><i style="position:absolute;left:46%;width:8%;top:0;bottom:0;background:#5ad8a0"></i><i id="mgmark" style="position:absolute;top:0;bottom:0;width:4px;left:0;background:#ffd36a;box-shadow:0 0 8px #ffd36a"></i></div>
      <div class="row" style="justify-content:center"><button class="btn" data-ev="mgthrow">Throw!</button></div>${MG.last?`<div class="val" style="text-align:center">${esc(MG.last)}</div>`:''}`; } }
$('evcard').addEventListener('click',e=>{ const b=e.target.closest('[data-ev]'); if(!b||!MG) return; const ev=b.dataset.ev, base=bestLoot();
  if(ev==='skip'){ clearInterval(MG.iv); MG=null; return; }
  if(ev==='mgstart'){ if(MG.kind==='knot'){ MG.seq=Array.from({length:6},()=>pick(MG_ARROWS)); MG.at=0; MG.dur=6; MG.end=performance.now()+MG.dur*1000; MG.iv=setInterval(()=>{ if(!MG) return; if(performance.now()>=MG.end){ mgDone(MG.at>=6?'Perfect knot!':'The line slipped',base*.5*MG.at,MG.at+' of 6 steps tied.'); } else { const p=document.querySelector('#evin .prog i'); if(p) p.style.width=(Math.max(0,MG.end-performance.now())/1000/MG.dur*100)+'%'; } },100); }
    if(MG.kind==='memory'){ const pool=MG_LURES.slice(0,4).flatMap(x=>[x,x]); for(let i=pool.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [pool[i],pool[j]]=[pool[j],pool[i]]; } MG.cards=pool; MG.open=[]; MG.got={}; MG.pairs=0; MG.tries=8; }
    if(MG.kind==='skip'){ MG.n=0; MG.best=0; MG.total=0; MG.t0=performance.now(); MG.iv=setInterval(()=>{ const m=$('mgmark'); if(!m||!MG) return; const p=(Math.sin((performance.now()-MG.t0)/1000*3.1)+1)/2; MG.pos=p; m.style.left=(p*100)+'%'; },16); }
    mgRender(); return; }
  if(ev==='mgkey'&&MG.kind==='knot'){ if(b.dataset.k===MG.seq[MG.at]){ MG.at++; tone(520+MG.at*80,.07,'triangle',.06); if(MG.at>=6){ mgDone('Perfect knot!',base*.5*6*1.5,'Six of six, and a bonus for speed.'); return; } } else { MG.end-=700; tone(180,.12,'square',.05); } mgRender(); return; }
  if(ev==='mgcard'&&MG.kind==='memory'){ const i=+b.dataset.i; if(MG.open.length>=2) return; MG.open.push(i); mgRender(); if(MG.open.length===2){ const [a,c]=MG.open; MG.tries--;
      setTimeout(()=>{ if(!MG) return; if(MG.cards[a]===MG.cards[c]){ MG.got[a]=MG.got[c]=1; MG.pairs++; tone(780,.1,'triangle',.06); } MG.open=[]; if(MG.pairs>=4) mgDone('All matched!',base*(1+MG.tries*.4)*1.2,MG.tries+' tries to spare.'); else if(MG.tries<=0) mgDone('Out of tries',base*.4*MG.pairs,MG.pairs+' pairs found.'); else mgRender(); },550); } return; }
  if(ev==='mgthrow'&&MG.kind==='skip'){ const d=Math.abs((MG.pos||0)-.5), skips=d<.04?9:d<.08?6+Math.round((.08-d)*40):d<.12?3+Math.round((.12-d)*30):d<.2?1:0; MG.best=Math.max(MG.best,skips); MG.total+=skips; MG.n++; MG.last=skips?skips+' skip'+(skips===1?'':'s')+'!':'Plop. It sank.'; tone(skips?600+skips*40:150,.1,'triangle',.06);
    if(MG.n>=3){ mgDone(MG.best>=9?'A perfect skip!':'Nice arm',base*.22*MG.total,'Best throw: '+MG.best+' skips.'); return; } mgRender(); return; } });
if(/[?&]test\b/.test(location.search)) window.__mg=k=>openEvent(k);
