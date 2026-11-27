// =====================================================================
// Phones (Android; iPhone browsers have no page full screen, so nothing happens there): full screen is remembered properly
// (director's tester, 2026-11-18: "full screen toggle on Android hides the navigation bars, would ask the app to remember that setting").
// The game already saved full screen on/off (an_small04.js) and turned it back on at your first tap. But when you close or switch away
// from the app, Android first takes the page out of full screen, and that saved "off" just before the app closed, so the choice was
// lost every time. Now an exit only counts as your choice if the game is still on screen a moment later; exits caused by leaving the
// app keep "on". Coming back to the app (not only a fresh start) also turns full screen back on at your first tap.
// =====================================================================
{ let hiddenAt=0; const want=()=>{ try{ return localStorage.getItem('dl-fs')==='1'&&localStorage.getItem('dl-fs-auto')!=='0'; }catch(e){ return false; } };
  const arm=()=>{ if(!want()||document.fullscreenElement||!document.documentElement.requestFullscreen) return; const go=()=>{ ['pointerdown','keydown'].forEach(ev=>document.removeEventListener(ev,go,true)); if(!document.fullscreenElement&&want()){ try{ const p=document.documentElement.requestFullscreen(); if(p&&p.catch) p.catch(()=>{ /* quiet: the browser may refuse full screen (no tap, a setting, a frame); the game plays the same without it */ }); }catch(e){ oops('mobile/fullscreen07:umentElement.requestFullscreen',e); } } }; ['pointerdown','keydown'].forEach(ev=>document.addEventListener(ev,go,true)); };
  document.addEventListener('visibilitychange',()=>{ if(document.hidden) hiddenAt=performance.now(); else if(MOB()) setTimeout(arm,50); });
  document.addEventListener('fullscreenchange',()=>{ if(!MOB()||document.fullscreenElement) return; const t=performance.now();
    /* the shared listener has just saved "off"; if the app is being left, put "on" back */
    setTimeout(()=>{ if(document.hidden||hiddenAt>=t-50){ try{ localStorage.setItem('dl-fs','1'); }catch(e){ oops('mobile/fullscreen07:localStorage.setItem',e); } } },700); });
  if(/[?&]test\b/.test(location.search)) window.__fsPref=()=>{ try{ return localStorage.getItem('dl-fs'); }catch(e){ return null; } }; }
// Round 2 (director, 2026-11-18: "make full screen remember your choice when you close the app ... Android still doesn't know this is a game"):
// the fix above put "on" back 0.7 s after an exit, but swiping the app away kills the page before that runs, so the "off" the shared
// listener wrote on the way out stuck. Now on phones only the Full screen button (data-act="fullscreen") changes the saved choice:
// any other exit (closing, switching apps, the back gesture) keeps it, written at once, no timer. And on Android full screen is the
// default until you turn it off (the browser still needs your first tap to enter it).
{ let pressed=-1e9; const isAndroid=document.documentElement.classList.contains('plat-android')||/Android/i.test(navigator.userAgent);
  document.addEventListener('click',e=>{ if(e.target.closest&&e.target.closest('[data-act="fullscreen"]')) pressed=performance.now(); },true);
  document.addEventListener('fullscreenchange',()=>{ if(!MOB()) return; try{ if(document.fullscreenElement) localStorage.setItem('dl-fs','1'); else if(performance.now()-pressed>1500) localStorage.setItem('dl-fs','1'); }catch(e){ oops('mobile/fullscreen07:localStorage.setItem#2',e); } });
  try{ if(isAndroid&&localStorage.getItem('dl-fs')===null){ localStorage.setItem('dl-fs','1');
      const go=()=>{ ['pointerdown','keydown'].forEach(ev=>document.removeEventListener(ev,go,true)); if(!document.fullscreenElement&&document.documentElement.requestFullscreen&&localStorage.getItem('dl-fs-auto')!=='0'){ try{ const p=document.documentElement.requestFullscreen(); if(p&&p.catch) p.catch(()=>{ /* quiet: the browser may refuse full screen (no tap, a setting, a frame); the game plays the same without it */ }); }catch(e){ oops('mobile/fullscreen07:umentElement.requestFullscreen#2',e); } } };
      ['pointerdown','keydown'].forEach(ev=>document.addEventListener(ev,go,true)); } }catch(e){ oops('mobile/fullscreen07:localStorage.getItem',e); } }
// Round 3 (director, 2026-11-18: "the full screen fix still doesn't work"): the three places that put full screen back (an_small04
// and rounds 1-2 above) all tried on pointerdown/keydown. A browser only allows full screen as the result of a finished tap: on touch
// screens that is pointerup / touchend / click, never pointerdown, so every automatic attempt was refused without a sound (the
// Settings button worked because it reacts to click). Now: on any finished tap, if full screen is your choice and the page is not
// in full screen, it goes back (taps on the Full screen button itself are left to that button).
{ const want3=()=>true; /* round 4 (director, 2026-11-18: "automatic for all mobile builds, no menu option, like iPhone"): phones are always full screen; the Settings row is gone (settings08) */
  /* round 5 (director, 2026-11-18: Android test build above 60 fps and jumpy on every action, fresh save): the installed Android app
     now opens in the app's own full-screen mode (manifest), where document.fullscreenElement is empty, so every tap asked for full
     screen again; each request re-laid the screen out, resized the water and drew extra frames outside the 60 limit. Now it only asks
     when the screen is really not full screen (not in app full-screen mode, bars visible), at most once every 2 seconds. */
  let lastAsk=0; const appFull=()=>{ try{ if(matchMedia('(display-mode: fullscreen)').matches) return true; }catch(er){ oops('mobile/fullscreen07:matchMedia',er); } const sw=Math.max(screen.width,screen.height), sh=Math.min(screen.width,screen.height), iw=Math.max(innerWidth,innerHeight), ih=Math.min(innerWidth,innerHeight); return Math.abs(iw-sw)<2&&Math.abs(ih-sh)<2; };
  const back=e=>{ if(!MOB()||document.fullscreenElement||!document.documentElement.requestFullscreen||!want3()) return; if(e&&e.target&&e.target.closest&&e.target.closest('[data-act="fullscreen"]')) return; const now=performance.now(); if(now-lastAsk<2000||appFull()) return; lastAsk=now; try{ const p=document.documentElement.requestFullscreen(); if(p&&p.catch) p.catch(()=>{ /* quiet: the browser may refuse full screen (no tap, a setting, a frame); the game plays the same without it */ }); }catch(er){ oops('mobile/fullscreen07:umentElement.requestFullscreen#3',er); } };
  ['pointerup','touchend','click','keyup'].forEach(ev=>document.addEventListener(ev,back,true)); }
