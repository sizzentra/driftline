// =====================================================================
// The automatic check, in-page part (phase 2, 2026-11-19). Test builds only: build.ps1 adds src/testonly/ to previews, never to a
// release. tools/check.ps1 opens each build at one exact screen size with ?test&autocheck=<target>&w=&h=[&safe=l,r,t,b]; this
// runs every check in that page and sends the results to the check's local server (POST /report/<target>).
// Nothing here runs without ?autocheck in the address.
// =====================================================================
if(/[?&]autocheck=/.test(location.search)&&/[?&]test\b/.test(location.search)) (function(){
  const q=new URLSearchParams(location.search), target=(q.get('autocheck')||'x').replace(/[^\w-]/g,''), want={w:+q.get('w')||0, h:+q.get('h')||0};
  const safe=(q.get('safe')||'').split(',').filter(Boolean).map(Number);
  const PAGE_MS=300; /* a page that takes longer than this to open on this PC is far too slow for a phone */
  const errs=[]; const where=()=>{ try{ return MENU_OPEN?'page '+S.tab:'fishing'; }catch(e){ return 'start-up'; } };
  addEventListener('error',e=>errs.push(where()+': '+(e.message||e.error)));
  addEventListener('unhandledrejection',e=>errs.push(where()+': '+String(e.reason&&e.reason.message||e.reason)));
  const ce=console.error; console.error=function(...a){ errs.push(where()+': '+a.map(x=>x&&x.stack?x.stack.split('\n').slice(0,2).join(' '):String(x)).join(' ').slice(0,300)); return ce.apply(this,a); };
  /* the window is already the phone's full screen: a full-screen request (the random-action test presses the game's own button) would
     resize the headless window to its default screen and every later result would be for the wrong size */
  for(const o of [Element.prototype,Document.prototype]){ if(o.requestFullscreen) o.requestFullscreen=function(){ return Promise.reject(new Error('full screen is off during the check')); }; }
  /* a game controller plugged into this PC (someone playing) must not reach the tests: a held trigger reels in every fight test */
  try{ Object.defineProperty(navigator,'getGamepads',{configurable:true,value:()=>[]}); }catch(e){}
  const sizes=new Set(); addEventListener('resize',()=>{ if(innerWidth!==want.w||innerHeight!==want.h) sizes.add(innerWidth+'x'+innerHeight+' during '+where()); });
  const wait=ms=>new Promise(r=>setTimeout(r,ms));
  const send=(name,o)=>fetch('/report/'+name,{method:'POST',body:JSON.stringify(o)}).catch(()=>{});
  const pages=()=>window.__allPages();
  async function run(){
    const R={target, build:window.DL_BUILD, stamp:window.DL_VERSION, version:GAME_VERSION, size:innerWidth+'x'+innerHeight, layout:document.body.className.replace(/\s+/g,' ').trim(), started:new Date().toISOString(), steps:[]};
    const step=async(name,fn)=>{ await send(target+'-progress',{at:name}); const t0=performance.now(); let r; try{ r=await fn(); }catch(e){ r={ok:false, detail:'the check itself threw: '+(e&&e.message)}; } r.name=name; r.ms=Math.round(performance.now()-t0); R.steps.push(r); };
    await step('screen size',()=>({ok:innerWidth===want.w&&innerHeight===want.h, detail:'window '+innerWidth+'x'+innerHeight+' (wanted '+want.w+'x'+want.h+')'}));
    if(safe.length===4) await step('iPhone camera and corners',()=>{ const n=window.__safeSim(...safe); return {ok:n>0, detail:'safe areas '+safe.join('/')+' px simulated in '+n+' rules'}; });
    await step('logic tests (__qa)',async()=>{ const r=await window.__qa(); return {ok:r.fail===0, detail:r.pass+'/'+(r.pass+r.fail)+' pass', problems:r.fails.map(f=>f.sys+': '+f.name+' :: '+f.detail)}; });
    await wait(2600); /* __qa puts the save back 1.8 s after it ends */
    await step('layout on every page (__layoutQC)',async()=>{ const r=await window.__layoutQC(); const p=[];
      for(const k of ['dash','audit','trunc','head']) for(const x of (r[k]||[])) p.push(k+': '+(typeof x==='string'?x:JSON.stringify(x)));
      const f=r.fishing||{}; for(const k of ['stageFillsToBottom','waterUncovered','canvasFillsStage','menuButton']) if(f[k]===false) p.push('fishing screen: '+k+' is false'); if(f.pageScrolls) p.push('fishing screen: the page scrolls'); for(const x of (f.hudCut||[])) p.push('top bar cut: '+(typeof x==='string'?x:JSON.stringify(x)));
      return {ok:!!r.clean&&!p.length, detail:r.clean?'clean':p.length+' problems', problems:p.slice(0,40)}; });
    if(typeof window.__spec==='function') await step('phone frame and controls on every page (__spec)',async()=>{ const bad=[]; closeMenu(); await wait(400);
      for(const x of window.__spec()) bad.push('fishing: '+x);
      for(const t of pages()){ try{ openMenu(t); }catch(e){ bad.push(t+': opening threw '+e.message); continue; } await wait(250); for(const x of window.__spec()) bad.push(t+': '+x); }
      closeMenu(); await wait(300); return {ok:!bad.length, detail:bad.length?bad.length+' problems':'clean on '+(pages().length+1)+' screens', problems:bad.slice(0,40)}; });
    if(typeof window.__searchQC==='function') await step('search (__searchQC)',async()=>{ const r=await window.__searchQC(); return {ok:!r.bad.length, detail:r.checked+' checked', problems:r.bad.slice(0,20)}; });
    await wait(800); /* back-to-back tools collide (LESSONS): let Search finish closing */
    if(typeof window.__questsQC==='function') await step('quests (__questsQC)',async()=>{ const r=await window.__questsQC(); return {ok:!r.bad.length, detail:r.checked+' checked', problems:r.bad.slice(0,20)}; });
    await step('page open time',async()=>{ const slow=[], times=[]; for(const t of pages()){ closeMenu(); await wait(80); const t0=performance.now(); openMenu(t); const ms=Math.round(performance.now()-t0); times.push([t,ms]); if(ms>PAGE_MS) slow.push(t+' took '+ms+' ms (limit '+PAGE_MS+')'); }
      closeMenu(); times.sort((a,b)=>b[1]-a[1]); return {ok:!slow.length, detail:'slowest: '+times.slice(0,3).map(x=>x[0]+' '+x[1]+' ms').join(', '), problems:slow}; });
    await wait(500);
    await step('the window kept its size the whole run',()=>({ok:!sizes.size, detail:sizes.size?'it changed':want.w+'x'+want.h+' throughout', problems:[...sizes].slice(0,10)}));
    await step('no errors during the whole run',()=>({ok:!errs.length, detail:errs.length?errs.length+' errors':'none', problems:[...new Set(errs)].slice(0,20)}));
    R.ok=R.steps.every(s=>s.ok); R.ended=new Date().toISOString(); await send(target,R); document.title='CHECK DONE '+(R.ok?'PASS':'FAIL');
  }
  addEventListener('load',()=>setTimeout(()=>run().catch(e=>send(target,{target,ok:false,steps:[{name:'runner',ok:false,detail:'runner threw: '+(e&&e.message)}]})),2500));
})();
