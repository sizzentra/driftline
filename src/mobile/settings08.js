// =====================================================================
// Phones, round 8: settings belong to the device (director, 2026-11-18: "we're even due for settings options separate to specific
// devices... decide what's necessary for settings options to make the user have control over what's necessary").
// Research (Apple HIG "Settings", Microsoft/Xbox accessibility guidance, mobile game support pages, WebKit status):
//  - Sound, controls, display and performance choices depend on the device in your hand (a PC's volume or "tap to aim" make no sense
//    on a phone), so they stay on this device. Moving progress (6-digit code, save code, cloud) carries your progress and the
//    gameplay choices (protect rare fish, mini-games, auto bait, sell filters), never this device's settings.
//  - Frame rate: phones offer 30 (battery saver: less heat and battery) / 60 / Max (the screen's own rate, e.g. 120 Hz Android).
//    iPhone browsers draw at most 60, so iPhone shows 30 / 60 only.
//  - Only settings that work on this device are shown: iPhone has no vibration and no page full screen in the browser, so those
//    two are hidden there. The help text speaks about touch only (no mouse wheel, no keyboard).
// Android + iPhone only.
// =====================================================================
const DEV_KEYS=['master','music','sfx','amb','musicOn','ambient','style','castMode','vibrate','effects','boostsOnScreen','hints','showFps','gfx','fpsCap','dockMini','hdrStat','logShow','vaultSort','hideGoal','lastPage','pageLast'];
const DEV_STORE='dl-device-settings-v1';
var DEV_GUARD=null;
const IS_IPHONE=()=>/iPhone|iPod/.test(navigator.userAgent)||(/[?&]test\b/.test(location.search)&&/[?&]iphone\b/.test(location.search));
{ let dev=null, cur=null; const done=new WeakSet(), _mig=migrate, DEF=fresh().settings||{};
  const read=()=>{ try{ const r=localStorage.getItem(DEV_STORE); return r?JSON.parse(r):null; }catch(e){ return null; } };
  const pick=st=>{ const o={}; if(st) for(const k of DEV_KEYS) if(st[k]!==undefined) o[k]=st[k]; return o; };
  const write=()=>{ try{ localStorage.setItem(DEV_STORE,JSON.stringify(dev)); }catch(e){} };
  const apply=s=>{ if(s&&s.settings&&dev){ for(const k of DEV_KEYS){ if(dev[k]!==undefined) s.settings[k]=dev[k]; else if(DEF[k]!==undefined) s.settings[k]=DEF[k]; else delete s.settings[k]; } } return s; };
  /* first run after this update: this device keeps the settings it has now */
  dev=read(); if(!dev||typeof dev!=="object"){ dev=pick(S.settings); write(); } apply(S); cur=S;
  /* a fresh start or a save arriving from anywhere (code, transfer, cloud, backup) keeps this device's settings */
  migrate=function(){ const s=apply(_mig.apply(this,arguments)); if(s&&typeof s==="object") done.add(s); return s; };
  /* any replaced save (progress reset, code, transfer, cloud, backup) gets this device's settings back before it is used or saved */
  const guard=()=>{ if(S!==cur){ if(!done.has(S)) apply(S); cur=S; } }; DEV_GUARD=guard;
  const _save=save; save=function(){ guard(); if(S&&S.settings){ dev=pick(S.settings); write(); } return _save.apply(this,arguments); };
  if(/[?&]test\b/.test(location.search)) window.__devSettings=()=>({store:read(), keys:DEV_KEYS.slice()}); }

// ---------- frame rate: the game's work runs only as often as the chosen rate (the display keeps its own timing) ----------
{ const _fr=frame; let shown=0;
  const capMs=()=>{ const c=S.settings.fpsCap; return c==='30'?1000/30:c==='60'?1000/60:0; };
  frame=function(now){ if(DEV_GUARD) DEV_GUARD(); const cap=MOB()?capMs():0; if(cap&&shown&&now>=shown&&now-shown<cap-2){ requestAnimationFrame(frame); return; } shown=(cap&&shown&&now>=shown&&now-shown<cap*2)?shown+cap:now; return _fr.apply(this,arguments); }; }

// ---------- the Settings page on phones ----------
{ const _rs=renderSettings;
  renderSettings=function(P){ _rs(P); if(!MOB()) return; try{ const ip=IS_IPHONE(), dev=ip?'iPhone':'phone';
    const sub=P.querySelector('h2 + .sub'); if(sub) sub.textContent='These settings belong to this '+dev+'. Moving your progress to another device keeps each device’s own settings.';
    const rowOf=b=>b&&b.closest('.toggle');
    if(ip){ const v=rowOf(P.querySelector('[data-act="tog"][data-k="vibrate"]')); if(v) v.remove(); const f=rowOf(P.querySelector('[data-act="fullscreen"]')); if(f) f.remove(); }
    for(const m of P.querySelectorAll('.tile .meta')) if(/mouse wheel/i.test(m.textContent)) m.innerHTML='Reel by <b>holding</b> the water, or by <b>drawing circles</b> on it like a crank.';
    const fr=rowOf(P.querySelector('[data-act="tog"][data-k="showFps"]')); if(fr){ const b=fr.querySelector('b'), m=fr.querySelector('.meta'); if(b) b.textContent='Frame rate counter'; if(m) m.textContent='Shows the current frame rate in the corner of the water.'; }
    const disp=[...P.querySelectorAll('.tile')].find(t=>{ const h=t.querySelector('h4'); return h&&h.textContent.trim()==='Display'; });
    if(disp){ const cur=S.settings.fpsCap||(ip?'60':'max'), opt=ip?[['30','30 · Saver'],['60','60 · Smooth']]:[['30','30 · Saver'],['60','60 · Standard'],['max','Max']];
      const why={ '30':'Draws 30 frames a second: cooler phone, longer battery.', '60':ip?'Draws up to 60 frames a second, as smooth as an iPhone browser allows.':'Draws up to 60 frames a second.', 'max':'Draws as fast as your screen allows (90 or 120 on many phones). Uses the most battery.' };
      disp.insertAdjacentHTML('beforeend',`<h5>Frame rate</h5><div class="chips">${opt.map(([k,n])=>`<button class="chipb" type="button" data-fps="${k}" aria-pressed="${cur===k}">${n}</button>`).join('')}</div><div class="meta" style="margin-top:6px">${why[cur]||why['60']}</div>`);
      disp.querySelectorAll('[data-fps]').forEach(b=>b.addEventListener('click',e=>{ e.stopPropagation(); S.settings.fpsCap=b.dataset.fps; save(); renderPanel(); })); }
  }catch(e){} }; }
