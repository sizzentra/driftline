// =====================================================================
// Device report (phase 2, 2026-11-19): test builds only. build.ps1 adds src/testonly/ to previews and never to a release, and
// tools/code_rules.ps1 refuses a release page that holds "dl-devreport". Hidden until the "test build" badge is tapped.
// While you play it records, per screen: frames per second, the worst frame and the stutters (a frame over 50 ms), plus every
// error with the screen it happened on, the screen size, the OS version and the build stamp. "Copy report" puts it on the
// clipboard as plain text for the director (and Cam, by text message) to paste into the session.
// Kept in this phone's storage until "Start over" or a new build, so a reload or switching apps never loses it.
// =====================================================================
if(window.DL_PREVIEW) (function(){
  const KEY='dl-devreport', STUTTER=50, now=()=>Date.now();
  const blank=()=>({stamp:window.DL_VERSION, build:window.DL_BUILD, start:now(), screens:{}, errors:[], worst:[], launches:0});
  let D; try{ D=JSON.parse(localStorage.getItem(KEY)||'null'); }catch(e){ D=null; }
  if(!D||D.stamp!==window.DL_VERSION||D.build!==window.DL_BUILD) D=blank();
  D.launches++;
  const store=()=>{ try{ localStorage.setItem(KEY,JSON.stringify(D)); }catch(e){} };
  // which screen the player is on, in the words the player sees
  function where(){ try{
    const sov=document.getElementById('searchov'); if(sov&&!sov.hidden&&sov.getClientRects().length) return 'Search';
    if(MENU_OPEN){ const b=document.querySelector('#tabs > [data-tab="'+S.tab+'"]'); return 'Page: '+((b&&(b.dataset.label||b.textContent.trim()))||S.tab); }
    const card=document.getElementById('card'); if(card&&!card.hidden&&card.getClientRects().length) return 'Catch card';
    if(G.st==='bite'||G.st==='reeling') return 'Fishing: reeling';
    return 'Fishing';
  }catch(e){ return 'Starting up'; } }
  const row=n=>D.screens[n]||(D.screens[n]={frames:0, ms:0, worst:0, stutters:0, draws:0});
  // frames: the browser's own frame rhythm (what the eye sees, menus and scrolling included)
  let last=0;
  const tick=t=>{ if(last&&!document.hidden){ const dt=t-last; if(dt<5000){ const r=row(where()); r.frames++; r.ms+=dt; if(dt>r.worst) r.worst=dt; if(dt>STUTTER){ r.stutters++; D.worst.push([Math.round(dt),where(),now()]); D.worst.sort((a,b)=>b[0]-a[0]); D.worst.length=Math.min(D.worst.length,5); } } } last=t; requestAnimationFrame(tick); };
  requestAnimationFrame(tick);
  document.addEventListener('visibilitychange',()=>{ last=0; if(document.hidden) store(); });
  addEventListener('pagehide',store); setInterval(store,5000);
  // the game's own drawing (Android draws at most 60 a second on purpose; the browser may run faster)
  const _draw=draw; draw=function(){ row(where()).draws++; return _draw.apply(this,arguments); };
  // errors, with the screen they happened on (the game loop reports a failing frame through console.error)
  const err=m=>{ m=String(m||'unknown error').slice(0,240); const s=where(); const e=D.errors.find(x=>x.m===m&&x.s===s); if(e) e.n++; else if(D.errors.length<30) D.errors.push({m, s, n:1, t:now()}); store(); };
  addEventListener('error',e=>err((e.message||'error')+(e.filename?' @'+String(e.lineno||''):'')));
  addEventListener('unhandledrejection',e=>err('promise: '+(e.reason&&e.reason.message||e.reason)));
  const ce=console.error; console.error=function(...a){ try{ err(a.map(x=>x&&x.message?x.message:String(x)).join(' ')); }catch(_){} return ce.apply(this,a); };

  function osName(){ const u=navigator.userAgent; let m;
    if((m=u.match(/iPhone OS (\d+)_(\d+)(?:_(\d+))?/))) return 'iOS '+m[1]+'.'+m[2]+(m[3]?'.'+m[3]:'');
    if((m=u.match(/Android (\d+(?:\.\d+)*)/))) return 'Android '+m[1];
    if((m=u.match(/Windows NT (\d+\.\d+)/))) return 'Windows NT '+m[1];
    if((m=u.match(/Mac OS X (\d+[._]\d+)/))) return 'macOS '+m[1].replace('_','.');
    return u.slice(0,80); }
  const dur=ms=>{ const s=Math.round(ms/1000); return s>=60?Math.floor(s/60)+'m '+String(s%60).padStart(2,'0')+'s':s+'s'; };
  const clock=t=>new Date(t).toTimeString().slice(0,5);
  function text(){
    const inst=!!(window.matchMedia&&(matchMedia('(display-mode: standalone)').matches||matchMedia('(display-mode: fullscreen)').matches)||navigator.standalone);
    const all=Object.values(D.screens), F=all.reduce((a,r)=>a+r.frames,0), MS=all.reduce((a,r)=>a+r.ms,0);
    const L=['Driftline device report',
      'Build: '+({pc:'PC',android:'Android',ios:'iPhone'}[D.build]||D.build)+' test build, version '+GAME_VERSION+', stamp '+D.stamp,
      'Device: '+osName()+', screen '+screen.width+'x'+screen.height+' at '+(window.devicePixelRatio||1)+'x, window '+innerWidth+'x'+innerHeight+(inst?', installed app':', in the browser'),
      'Recorded: '+dur(MS)+' of play since '+clock(D.start)+(D.launches>1?' ('+D.launches+' launches)':'')+(F?', about '+Math.round(F*1000/MS)+' fps overall':''),
      '', 'Screens (fps / worst frame / stutters over '+STUTTER+' ms / time / game draws a second):'];
    const rows=Object.entries(D.screens).filter(([,r])=>r.frames>10).sort((a,b)=>b[1].ms-a[1].ms);
    if(!rows.length) L.push('  nothing yet: play for a minute first');
    for(const [n,r] of rows) L.push('  '+n+': '+Math.round(r.frames*1000/r.ms)+' fps / '+Math.round(r.worst)+' ms / '+r.stutters+' / '+dur(r.ms)+' / '+Math.round(r.draws*1000/r.ms));
    L.push('', 'Worst stutters:'); if(!D.worst.length) L.push('  none'); for(const [ms,s,t] of D.worst) L.push('  '+ms+' ms on '+s+' at '+clock(t));
    L.push('', 'Errors ('+D.errors.length+'):'); if(!D.errors.length) L.push('  none'); for(const e of D.errors) L.push('  ['+e.s+'] '+e.m+(e.n>1?' (x'+e.n+')':'')+' at '+clock(e.t));
    return L.join('\n'); }

  // the panel: opened by tapping the "test build" badge
  let box=null;
  function show(){ if(!box){ box=document.createElement('div'); box.id='dl-devreport'; box.setAttribute('role','dialog'); box.setAttribute('aria-label','Device report');
      box.style.cssText='position:fixed;inset:0;z-index:2147483000;display:flex;align-items:center;justify-content:center;background:#0008;padding:12px;box-sizing:border-box';
      box.innerHTML='<div style="background:#14202b;color:#e6efe8;border:1px solid #ffd59a88;border-radius:14px;max-width:640px;width:100%;max-height:100%;display:flex;flex-direction:column;font:13px/1.4 system-ui,sans-serif;box-sizing:border-box">'
        +'<div style="display:flex;align-items:center;gap:8px;padding:10px 12px;border-bottom:1px solid #ffffff22"><b style="flex:1;font-size:15px;color:#ffd59a">Device report (test build)</b>'
        +'<button type="button" data-dr="copy" style="font:700 14px system-ui;padding:9px 14px;border-radius:10px;border:0;background:#1f8a86;color:#fff">Copy report</button>'
        +'<button type="button" data-dr="reset" style="font:600 13px system-ui;padding:9px 12px;border-radius:10px;border:1px solid #ffffff44;background:none;color:#e6efe8">Start over</button>'
        +'<button type="button" data-dr="close" aria-label="Close" style="font:700 16px system-ui;padding:6px 12px;border-radius:10px;border:0;background:#ffffff1a;color:#e6efe8">✕</button></div>'
        +'<pre style="margin:0;padding:10px 12px;overflow:auto;white-space:pre-wrap;user-select:text;-webkit-user-select:text;font:12px/1.45 ui-monospace,Menlo,Consolas,monospace"></pre>'
        +'<div data-dr="msg" style="padding:0 12px 10px;color:#ffd59a;min-height:18px"></div></div>';
      box.addEventListener('click',e=>{ const b=e.target.closest('[data-dr]'); e.stopPropagation(); if(e.target===box){ hide(); return; } if(!b) return; const k=b.dataset.dr;
        if(k==='close') hide();
        else if(k==='reset'){ D=blank(); D.launches=1; store(); fill(); msg('Started over: play the script, then copy.'); }
        else if(k==='copy') copy(); });
      ['pointerdown','pointerup','mousedown','mouseup'].forEach(t=>box.addEventListener(t,e=>e.stopPropagation()));
      document.body.appendChild(box); }
    fill(); box.style.display='flex'; }
  const hide=()=>{ if(box) box.style.display='none'; };
  const fill=()=>{ box.querySelector('pre').textContent=text(); };
  const msg=m=>{ box.querySelector('[data-dr="msg"]').textContent=m; };
  function copy(){ const t=text(); box.querySelector('pre').textContent=t;
    const fallback=()=>{ const r=document.createRange(); r.selectNodeContents(box.querySelector('pre')); const s=getSelection(); s.removeAllRanges(); s.addRange(r); let ok=false; try{ ok=document.execCommand('copy'); }catch(e){} msg(ok?'Copied. Paste it into the session (Cam: text it to the director).':'Selected: tap Copy in the menu that appears.'); };
    if(navigator.clipboard&&navigator.clipboard.writeText) navigator.clipboard.writeText(t).then(()=>msg('Copied. Paste it into the session (Cam: text it to the director).'),fallback); else fallback(); }
  // the badge is drawn by build.ps1 at the end of the page (it takes taps in test builds); tapping it opens the report
  const hook=()=>{ const b=document.querySelector('.dlprev'); if(!b||b.dataset.dr) return; b.dataset.dr='1'; b.setAttribute('role','button'); b.setAttribute('aria-label','Test build: open the device report');
    b.addEventListener('pointerdown',e=>e.stopPropagation());
    b.addEventListener('click',e=>{ e.stopPropagation(); e.preventDefault(); show(); });
    ['pointerup','mousedown','mouseup'].forEach(t=>b.addEventListener(t,e=>e.stopPropagation())); };
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',hook); else hook();
  setTimeout(hook,1500);
  if(/[?&]test\b/.test(location.search)) window.__devReport={text, show, data:()=>D};
})();
