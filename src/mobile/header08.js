// =====================================================================
// Phones and tablets, round 8: the top bar's goal (director, 2026-11-18: "The 'next goal' function on mobile upper header is too big
// and doesn't even work right now with proper goals and quick opens associating with the correct next goal. After it's condensed
// more things can go on the upper header that's appropriate: focus on organization, performance and logic").
// What was wrong: one chip took ~400 pt of the top bar, and a live event REPLACED your goal in it (label "Live", text of the event,
// tap to Events), so during events your real goal and its shortcut were gone; outside events the label could still say Live.
// Now two compact chips that look and work like the other top-bar chips:
//  - Goal: always your real next goal in a few words ("1/8 species", "Open Stonebrook", "Cooler full"), a thin progress line,
//    gold when it is ready. Tap: the exact page and place for it (Fish Log on that water, Waters, Cooler).
//  - Live: only while an event or challenge runs ("✨ Golden Hour 4:49"). Tap: Events.
// Updates twice a second, text only when it changes (no layout work otherwise).
// =====================================================================
{ const h=(tag,cls,html)=>{ const e=document.createElement(tag); if(cls) e.className=cls; if(html!=null) e.innerHTML=html; return e; };
  const realGoal=()=>{ try{ return _nextGoal_036(); }catch(e){ return nextGoal(); } }; /* the goal without live events in front of it */
  const short=gl=>{ const t=gl.t||'', s=gl.sub||''; let m;
    if(/cooler is full/i.test(t)) return 'Cooler full';
    if(/first fish/i.test(t)) return 'Catch a fish';
    if((m=t.match(/^(.+) is ready to open$/))) return 'Open '+m[1];
    if(/^Save /.test(t)&&(m=s.match(/^(.+?) \/ (.+)$/))) return m[1]+' / '+m[2];
    if((m=s.match(/^(\d+) \/ (\d+) found/))) return m[1]+'/'+m[2]+' species';
    if((m=s.match(/^(\d+) \/ (\d+) species found here/))) return m[1]+'/'+m[2]+' here';
    if(/^Every species here/.test(t)) return 'All found here';
    return t; };
  const liveNow=()=>{ try{ if(!(S.chal||(typeof liveScheds==='function'&&liveScheds().length))) return null; const gl=nextGoal(); return gl&&gl.live?gl:null; }catch(e){ return null; } };
  let G0=null, L0=null, lastG='', lastL='';
  const mk=(id,cls)=>{ const b=h('button','stat hudx '+cls); b.type='button'; b.id=id; b.innerHTML='<span class="lbl"></span><b></b>'; return b; };
  const ensure=()=>{ const hud=document.querySelector('.hud'), gc=document.getElementById('goalchip'); if(!hud||!gc) return false; if(G0&&G0.isConnected) return true;
    G0=mk('mbgoal','mb-goal'); L0=mk('mblive','mb-live'); G0.insertAdjacentHTML('beforeend','<i class="mbg-bar"><b></b></i>'); gc.before(G0); G0.after(L0); L0.hidden=true;
    G0.addEventListener('pointerdown',e=>e.stopPropagation()); L0.addEventListener('pointerdown',e=>e.stopPropagation());
    G0.addEventListener('click',e=>{ e.stopPropagation(); e.preventDefault(); const gl=realGoal(); try{ startAudio(); }catch(er){}
      if(!gl.tab){ try{ setHint(gl.sub||gl.t); }catch(er){} return; }
      try{ if(gl.tab==='journal'){ encLoc=gl.loc&&LOCS[locIdx(gl.loc)]?gl.loc:S.loc; encSel=null; } if(gl.tab==='map') SECT.map='Waters'; }catch(er){}
      openMenu(gl.tab); });
    L0.addEventListener('click',e=>{ e.stopPropagation(); e.preventDefault(); try{ startAudio(); }catch(er){} openMenu('events'); });
    return true; };
  const tick=()=>{ if(!MOB()||!ensure()) return; const gl=realGoal(), lv=liveNow();
    const g=(gl.ready?'1':'0')+'|'+short(gl)+'|'+Math.round((gl.p||0)*100)+'|'+gl.t+'|'+(gl.sub||'');
    if(g!==lastG){ lastG=g; G0.querySelector('.lbl').textContent=gl.ready?'Ready':'Goal'; G0.querySelector(':scope > b').textContent=short(gl); G0.classList.toggle('ready',!!gl.ready);
      const bar=G0.querySelector('.mbg-bar'); bar.hidden=gl.p==null; bar.firstChild.style.width=Math.round(Math.max(0,Math.min(1,gl.p||0))*100)+'%'; G0.title=gl.t+(gl.sub?'. '+gl.sub:'')+(gl.tab?'. Tap to open it.':''); }
    let l=lv?lv.t.replace(/\s*·\s*/g,' ').replace(/ left$/,'').replace(/\s*\(at [^)]*\)$/,''):''; /* "🐟 Shoal Run 6:12" */
    if(l&&!document.body.classList.contains('phone-land')){ const p=l.split(' '); if(p.length>2) l=p[0]+' '+p[p.length-1]; } /* upright the chip is narrow: icon + time ("🐟 6:12"), the name in the tooltip */
    if(l!==lastL){ lastL=l; L0.hidden=!l; document.querySelector('.hud').classList.toggle('mb-has-live',!!l); if(l){ L0.querySelector('.lbl').textContent='Live'; L0.querySelector(':scope > b').textContent=l; L0.title=lv.t+(lv.sub?'. '+lv.sub:'')+'. Tap for Events.'; } } };
  setInterval(tick,500); setTimeout(tick,0); setTimeout(tick,900);
  if(/[?&]test\b/.test(location.search)) window.__goal=()=>{ tick(); return {goal:G0&&G0.textContent, live:L0&&!L0.hidden?L0.textContent:'', real:realGoal()}; }; }

document.head.insertAdjacentHTML('beforeend',`<style>
html body.phone-app.dl-fish .hud > #goalchip,html body.phone-land.dl-fish .hud > #goalchip{display:none!important}
html body.phone-app .hud > #mbgoal,html body.phone-land .hud > #mbgoal,html body.phone-app .hud > #mblive,html body.phone-land .hud > #mblive{position:relative;overflow:hidden}
html body.phone-app .hud > #mblive[hidden],html body.phone-land .hud > #mblive[hidden]{display:none!important}
html body.phone-app .hud > #mbgoal > b,html body.phone-land .hud > #mbgoal > b,html body.phone-app .hud > #mblive > b,html body.phone-land .hud > #mblive > b{white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:150px}
html body.phone-app .hud > #mbgoal .mbg-bar,html body.phone-land .hud > #mbgoal .mbg-bar{position:absolute;left:8px;right:8px;bottom:3px;height:3px;border-radius:3px;background:#ffffff1f;overflow:hidden;display:block}
html body.phone-app .hud > #mbgoal .mbg-bar[hidden],html body.phone-land .hud > #mbgoal .mbg-bar[hidden]{display:none}
html body.phone-app .hud > #mbgoal .mbg-bar > b,html body.phone-land .hud > #mbgoal .mbg-bar > b{display:block;height:100%;border-radius:3px;background:linear-gradient(90deg,#7fe3c4,#ffd36a)}
html body.phone-app .hud > #mbgoal.ready,html body.phone-land .hud > #mbgoal.ready{border-color:#ffd36a!important;box-shadow:0 0 0 1px #ffd36a66,0 0 14px #ffd36a44!important}
html body.phone-app .hud > #mbgoal.ready .lbl,html body.phone-land .hud > #mbgoal.ready .lbl{color:#ffd36a!important}
html body.phone-app .hud > #mblive .lbl,html body.phone-land .hud > #mblive .lbl{color:#ffd36a!important}
/* upright (tablets, split screen): the goal takes the goal's old place on the second row; with a live event they share it */
html body.phone-app.dl-fish .hud > #mbgoal{grid-column:3 / 6!important;grid-row:2!important;height:30px!important;min-height:0!important;flex-direction:row!important;align-items:center!important;gap:8px!important;justify-content:flex-start!important}
html body.phone-app.dl-fish .hud.mb-has-live > #mbgoal{grid-column:3 / 5!important}
html body.phone-app.dl-fish .hud > #mblive{grid-column:5 / 6!important;grid-row:2!important;height:30px!important;min-height:0!important;flex-direction:row!important;align-items:center!important;gap:6px!important}
html body.phone-app.dl-fish .hud > #mbgoal .mbg-bar{bottom:2px}
</style>`);
/* the room the goal gave back: two shortcuts players check all the time, sideways only (upright the bar has no room):
   Tasks (daily tasks + weekly quests: how many rewards are ready) and Tide Pass (level; gold when a reward waits).
   If a narrow phone runs out of room, Tide Pass goes first, then Tasks: Goal, Live and the core chips always stay. */
{ const h=(tag,cls,html)=>{ const e=document.createElement(tag); if(cls) e.className=cls; if(html!=null) e.innerHTML=html; return e; };
  let T=null, Pz=null, last='';
  const mk=(id,go,lbl)=>{ const b=h('button','stat hudx mb-x'); b.type='button'; b.id=id; b.innerHTML=`<span class="lbl">${lbl}</span><b></b>`;
    b.addEventListener('pointerdown',e=>e.stopPropagation()); b.addEventListener('click',e=>{ e.stopPropagation(); e.preventDefault(); try{ startAudio(); }catch(er){} openMenu(go); }); return b; };
  const tasks=()=>{ try{ const d=ensureDaily(); const ready=d.tasks.filter(t=>!t.claimed&&taskHave(t)>=t.n).length+(typeof wqReady==='function'?wqReady():0); const done=d.tasks.filter(t=>t.claimed).length; return {ready, txt:ready?ready+' ready':done+'/'+d.tasks.length+' done'}; }catch(e){ return {ready:0,txt:'—'}; } };
  const pass=()=>{ try{ const pl=S.pass.lvl|0, un=pl-(S.pass.claimed|0); return {ready:un>0, txt:'Lv '+pl+(un>0?' · claim':'')}; }catch(e){ return {ready:false,txt:'—'}; } };
  const fit=()=>{ const hud=document.querySelector('.hud'); if(!hud||!T) return; const land=document.body.classList.contains('phone-land');
    T.hidden=!land; Pz.hidden=true; if(!land) return;
    /* when the bar runs out of room: Tasks steps aside first, then Live shrinks to its icon and time, then Live steps aside; Bait, Cooler,
       Aquarium, Home and Fish Log always stay */
    /* "out of room" also means the Bait name is being cut: the Bait chip is allowed to shrink (polish08), so without this it soaked up all
       the shortage, the bar never overflowed and Tasks and Live never stepped aside (0.4.8.9.4 hotfix: Bait squeezed to a 19 px sliver) */
    const over=()=>{ if(hud.scrollWidth>hud.clientWidth+1) return true; const bb=document.querySelector('#mbbait > b'); return !!(bb&&bb.offsetParent&&bb.scrollWidth>bb.clientWidth+1); }, L=document.getElementById('mblive'), has=hud.classList.contains('mb-has-live');
    if(L&&has){ L.hidden=false; const b=L.querySelector(':scope > b'); if(b&&b.dataset.full){ if(b.textContent===b.dataset.tight) b.textContent=b.dataset.full; delete b.dataset.full; delete b.dataset.tight; } /* (a newer event text written meanwhile wins) */ L.classList.remove('mb-tight'); }
    if(over()) T.hidden=true;
    if(over()&&L&&has){ const b=L.querySelector(':scope > b'); if(b){ const p=b.textContent.trim().split(' '); if(p.length>2){ b.dataset.full=b.textContent; b.textContent=p[0]+' '+p[p.length-1]; b.dataset.tight=b.textContent; } } L.classList.add('mb-tight'); }
    if(over()&&L&&has) L.hidden=true;
    if(!ro&&typeof ResizeObserver==='function'){ ro=new ResizeObserver(()=>{ if(!busy) requestAnimationFrame(()=>{ busy=true; try{ fit(); }finally{ busy=false; } }); }); } if(ro){ for(const k of [hud,...hud.children]) if(!seen.has(k)){ seen.add(k); ro.observe(k); } } };
  if(/[?&]test\b/.test(location.search)) window.__hudFit=()=>fit(); /* QA: run the step-aside check now (the 500 ms tick is too slow for a test) */
  let ro=null, busy=false; const seen=new WeakSet(); /* round 8 (director: "settings cut off sometimes on top right"): the bar is re-checked whenever it or any chip changes size (the Live timer text, opening or closing the side panel), not only when Tasks or Tide Pass change */
  const tick=()=>{ if(!MOB()) return; const hud=document.querySelector('.hud'), lv=document.getElementById('mblive'); if(!hud||!lv) return;
    if(!T||!T.isConnected){ T=mk('mbtasks','bounties','Tasks'); Pz=mk('mbpass','pass','Tide Pass'); lv.after(T); T.after(Pz); last=''; }
    const a=tasks(), b=pass(), live=!lv.hidden, key=a.txt+'|'+a.ready+'|'+b.txt+'|'+live+'|'+document.body.classList.contains('phone-land');
    if(key===last){ fit(); return; } last=key; T.querySelector('b').textContent=a.txt; T.classList.toggle('ready',a.ready>0); Pz.querySelector('b').textContent=b.txt; Pz.classList.toggle('ready',b.ready);
    T.title=a.ready?a.ready+' task reward'+(a.ready===1?'':'s')+' ready. Tap for Bounties.':'Daily tasks and weekly quests. Tap for Bounties.'; Pz.title='Tide Pass. Tap to open it.'; fit(); };
  setInterval(tick,500); setTimeout(tick,50); addEventListener('resize',()=>{ last=''; setTimeout(tick,200); }); }
document.head.insertAdjacentHTML('beforeend',`<style>
html body.phone-land .hud > #mbgoal,html body.phone-land .hud > #mblive,html body.phone-land .hud > .mb-x{flex:0 1 auto!important}
html body.phone-app .hud > .mb-x:not(#mbhome){display:none!important} /* the narrow layout (split-screen windows; phones themselves are landscape-only) hides the extra chips, but never Home: it is the only way into your home on phones (2026-11-19) */
html body.phone-land .hud > .mb-x[hidden]{display:none!important}
html body.phone-land .hud > .mb-x.ready{border-color:#ffd36a!important;box-shadow:0 0 0 1px #ffd36a66!important}
html body.phone-land .hud > .mb-x.ready .lbl{color:#ffd36a!important}
</style>`);
/* sideways top bar: ONE row, chips at their natural size, spare room shared evenly (replaces ~15 stacked legacy grid layouts whose
   fixed columns gave the old goal chip a third of the bar and pushed extra chips onto a second row) */
document.head.insertAdjacentHTML('beforeend',`<style>
@media (orientation:landscape) and (max-height:560px){
  html body.phone-land.dl-fish .hud{display:flex!important;flex-wrap:nowrap!important;gap:5px!important;align-items:stretch!important;grid-template-columns:none!important;grid-template-areas:none!important}
  html body.phone-land.dl-fish .hud > *{flex:1 1 auto!important;grid-column:auto!important;grid-row:auto!important}
  html body.phone-land.dl-fish .hud > .hudbtns{flex:0 0 auto!important}
}
</style>`);
document.head.insertAdjacentHTML('beforeend',`<style>
html body.phone-app .hud > #mbgoal > .lbl,html body.phone-land .hud > #mbgoal > .lbl,html body.phone-app .hud > #mblive > .lbl,html body.phone-land .hud > #mblive > .lbl,html body.phone-land .hud > .mb-x > .lbl{flex:0 0 auto!important;white-space:nowrap!important;overflow:visible!important}
</style>`);
/* round 8 (director, 2026-11-18: "Coins, level, and fishing at should be grouped into one ui box on the top left header ... we don't
   need it to be a direct link anywhere, just needs to look neat and organized and clearly not a button compared to what else is on
   the top header"): the three are one quiet status panel (no fill, no button edge, thin dividers between them). Tapping it does
   nothing: Stats and the Waters have their own buttons on the side panel. The chips to its right stay the tappable shortcuts. */
{ const group=()=>{ if(!MOB()) return; const hud=document.querySelector('.hud'); if(!hud) return; let g=hud.querySelector(':scope > .mb-stat8');
    const coins=hud.querySelector('.st-coins'), lvl=hud.querySelector('.st-lvl'), loc=hud.querySelector('.stat.loc'); if(!coins||!lvl||!loc) return;
    if(!g){ g=document.createElement('div'); g.className='mb-stat8'; g.setAttribute('role','group'); g.setAttribute('aria-label','Coins, level and where you are fishing'); coins.before(g);
      /* not a link: taps on it stop here (the old Level and Fishing at shortcuts) */
      ['click','pointerdown','pointerup','touchstart'].forEach(ev=>g.addEventListener(ev,e=>{ e.stopPropagation(); if(ev==='click') e.preventDefault(); },true)); }
    for(const el of [coins,lvl,loc]) if(el.parentElement!==g){ g.appendChild(el); el.classList.remove('hud-link'); el.removeAttribute('role'); el.removeAttribute('tabindex'); el.title=''; }
    lvl.removeAttribute('data-mbtap'); };
  setTimeout(group,0); setTimeout(group,1600); addEventListener('resize',()=>setTimeout(group,250)); }
document.head.insertAdjacentHTML('beforeend',`<style>
html body.phone-land .hud > .mb-stat8,html body.phone-app .hud > .mb-stat8{display:flex;align-items:stretch;flex:0 0 auto;min-width:0;padding:0 4px;border-radius:12px;background:rgba(4,12,18,.42);box-shadow:none;border:0}
html body.phone-app .hud > .mb-stat8{grid-column:span 2}
html body.phone-land .hud > .mb-stat8 > .stat,html body.phone-app .hud > .mb-stat8 > .stat{background:transparent!important;border:0!important;box-shadow:none!important;cursor:default!important;min-width:0!important;padding:4px 10px!important;margin:0!important;border-radius:0!important;display:flex!important;flex-direction:column!important;justify-content:center!important;transform:none!important}
html body.phone-land .hud > .mb-stat8 > .stat + .stat,html body.phone-app .hud > .mb-stat8 > .stat + .stat{border-left:1px solid #ffffff1c!important}
html body.phone-land .hud > .mb-stat8 > .stat .lbl,html body.phone-app .hud > .mb-stat8 > .stat .lbl{color:#8fa6bf!important}
html body.phone-land .hud > .mb-stat8 > .stat b,html body.phone-app .hud > .mb-stat8 > .stat b{color:#fff!important}
html body.phone-land .hud > .mb-stat8 > .stat.loc .lbl::after,html body.phone-app .hud > .mb-stat8 > .stat.loc .lbl::after{content:none!important;display:none!important}
</style>`);
/* round 8 (director, 2026-11-18: "Tide pass doesn't need to be on the top header" / "Move home to the top panel next to aquarium.
   Customize should just consist of wardrobe and pets"): no Tide Pass chip (it lives in Challenges); a Home chip right after the
   Aquarium shows how cozy your home here is and opens it. Home is reached from this chip only, so it never steps aside for room. */
{ const ensure=()=>{ if(!MOB()) return; const hud=document.querySelector('.hud'); if(!hud) return; const pz=document.getElementById('mbpass'); if(pz&&!pz.hidden) pz.hidden=true;
    const aq=hud.querySelector('.st-aq'); if(!aq) return; let h=document.getElementById('mbhome');
    if(!h){ h=document.createElement('button'); h.type='button'; h.id='mbhome'; h.className='stat hudx mb-x mb-home'; h.innerHTML='<span class="lbl">Home</span><b></b>'; h.title='Your home at this water. Tap to open it.';
      h.addEventListener('pointerdown',e=>e.stopPropagation()); h.addEventListener('click',e=>{ e.stopPropagation(); e.preventDefault(); try{ startAudio(); }catch(er){} openMenu('home'); }); }
    if(h.previousElementSibling!==aq) aq.after(h);
    let v='—'; try{ v=cozy()+' ♥'; }catch(e){} const b=h.querySelector('b'); if(b.textContent!==v) b.textContent=v; };
  ensure(); setInterval(ensure,1000); addEventListener('resize',()=>setTimeout(ensure,220)); } /* built as the page loads (a 60 ms delay let the top bar open without Home and then shift; the QA top-bar check caught it right after a reload) */
document.head.insertAdjacentHTML('beforeend',`<style>html body.phone-land .hud > .mb-stat8,html body.phone-land .hud > .mb-stat8 > .stat{flex:0 0 auto!important;min-width:max-content!important}html body.phone-land .hud > .mb-stat8 > .stat .lbl,html body.phone-land .hud > .mb-stat8 > .stat b{white-space:nowrap!important;overflow:visible!important;text-overflow:clip!important}</style>`); /* the info box never squeezes its words; the chips to its right make room (Tasks steps aside first) */
/* round 8 (director, 2026-11-18: "goal shouldn't be on the top header. Bait should move up there instead"): the goal lives in Quests
   (side panel); Bait sits in the top bar after Tasks: the bait you use (and how many are left), tap to open Tackle, Bait. The Bait
   button on the water (next to Rest) is gone. */
{ const lbl=()=>{ const b=BAIT[S.baitSel]||BAIT.worm; return b.name+(S.baitSel!=='worm'?' · '+(S.bait[S.baitSel]||0):''); };
  const ensure=()=>{ if(!MOB()) return; const hud=document.querySelector('.hud'); if(!hud) return; let c=document.getElementById('mbbait');
    if(!c){ c=document.createElement('button'); c.type='button'; c.id='mbbait'; c.className='stat hudx mb-x mb-bait'; c.innerHTML='<span class="lbl">Bait</span><b></b>'; c.title='The bait you fish with. Tap to switch bait, buy more or use a special lure.';
      c.addEventListener('pointerdown',e=>e.stopPropagation()); c.addEventListener('click',e=>{ e.stopPropagation(); e.preventDefault(); try{ startAudio(); }catch(er){} openMenu('bait'); }); }
    const after=document.getElementById('mbtasks')||document.getElementById('mblive'), cool=hud.querySelector('.st-cool');
    if(cool&&c.nextElementSibling!==cool) cool.before(c); else if(!cool&&after&&c.previousElementSibling!==after) after.after(c);
    const t=lbl(), b=c.querySelector('b'); if(b.textContent!==t) b.textContent=t; };
  ensure(); setInterval(ensure,1000); addEventListener('resize',()=>setTimeout(ensure,230)); }
document.head.insertAdjacentHTML('beforeend',`<style>
html body.phone-land .hud > #mbgoal,html body.phone-app .hud > #mbgoal,html body.phone-land #goalchip,html body.phone-app #goalchip{display:none!important}

html body.phone-land .hud > #mbbait > b{max-width:120px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
</style>`);
/* Narrow layout (split-screen windows; phones themselves are landscape-only), 2026-11-19: the bar was already two rows, but Home was
   hidden (the only way into your home on phones) and the Coins / Level / Fishing at box was squeezed into two columns, cutting all
   of its text. Now: the info box takes the whole first row (gear on the right), Cooler, Aquarium, Home and Fish Log share the second
   row (search on the right), every label readable. */
document.head.insertAdjacentHTML('beforeend',`<style>
html body.phone-app.dl-fish .hud{grid-template-columns:repeat(4,minmax(0,1fr)) 32px!important}
html body.phone-app.dl-fish .hud > .mb-stat8{grid-column:1 / 5!important;grid-row:1!important}
html body.phone-app.dl-fish .hud > .mb-stat8 > .stat{flex:1 1 0!important}
html body.phone-app.dl-fish .hud > .st-cool{grid-column:1!important;grid-row:2!important}
html body.phone-app.dl-fish .hud > .st-aq{grid-column:2!important;grid-row:2!important}
html body.phone-app.dl-fish .hud > #mbhome{grid-column:3!important;grid-row:2!important}
html body.phone-app.dl-fish .hud > .st-log{grid-column:4!important;grid-row:2!important}
html body.phone-app.dl-fish .hud #settingsbtn{grid-column:5!important;grid-row:1!important}
html body.phone-app.dl-fish .hud #searchbtn{grid-column:5!important;grid-row:2!important}
</style>`);
/* 0.4.9 QC (outsider pass): with a live event and a long water name the Bait chip was squeezed to 15 px ("BA|"): the small chips could shrink, so the bar
   never overflowed and the "step aside" rule above never ran. Small chips now keep their full width; Tasks, then Live make room as designed.
   This rule alone did not fix it (the Bait chip's own id rule in polish08 still lets it shrink); the real fix is in fit()'s over() above. */
document.head.insertAdjacentHTML('beforeend','<style>html body.phone-land .hud > .mb-x{flex-shrink:0!important;min-width:max-content!important}</style>');
