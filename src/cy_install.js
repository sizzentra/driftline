// =====================================================================
// Install welcome (batch 6; director 2026-11-21, option B of three: "players can't find how to install"; changed 2026-11-22: "should always
// open on the versions not installed in their own way", so every visit in a browser, not once per device; Install stays one tap away in
// Settings; goal: everyone plays the installed version, not the browser). Shared by every platform.
// Every time the game opens in a browser (not installed), a card offers that device's own way to install, or playing in the browser.
// Never in the installed app, the Windows app, or test pages (?test, ?sweep), where it would sit over the checks.
// The Windows download is not offered here until the director has tested it (CLAUDE.md: never publish the Windows exes untested).
// =====================================================================
function installSteps(){ const p=window.DL_PLAT||{}, ip=window.__dlInstallPrompt;
  if(p.ios) return {html:'In <b>Safari</b>, tap <b>Share</b>, then <b>Add to Home Screen</b>. Then open Driftline from your home screen.', act:null};
  if(ip) return {html:'Install it in one '+(PLAT.touch()?'tap':'click')+'.', act:'Install Driftline'};
  if(p.android) return {html:'Open the browser menu <b>⋮</b> and tap <b>Install app</b> (or <b>Add to Home screen</b>).', act:null};
  return {html:'In <b>Chrome</b> or <b>Edge</b>, click the install icon at the right of the address bar, or open the menu and choose <b>Install Driftline</b>.', act:null}; }
function installWelcome(force){ const p=window.DL_PLAT||{}, mm=q=>!!(window.matchMedia&&matchMedia(q).matches); if(p.app||window.DL_DESKTOP||mm('(display-mode: fullscreen)')||mm('(display-mode: minimal-ui)')||document.getElementById('dl-install')) return; /* the installed Android app runs in fullscreen display mode */
  if(!force&&(!FEATURE.installWelcome||/[?&](test|sweep)\b/.test(location.search))) return; /* FEATURE.installWelcome off (b_data.js): it never opens by itself; Settings › Install Driftline (force) still shows it */
  const st=installSteps(), el=document.createElement('div'); el.id='dl-install'; el.setAttribute('role','dialog'); el.setAttribute('aria-modal','true'); el.setAttribute('aria-labelledby','dl-install-h');
  el.innerHTML=`<div class="dli-card"><h3 id="dl-install-h">Play Driftline like an app</h3><p>Install it once: it gets its own icon, plays full screen and works offline. It updates itself.</p><p class="dli-steps">${st.html}</p><div class="dli-row">${st.act?`<button type="button" class="dli-go" data-dli="install">${st.act}</button>`:`<button type="button" class="dli-go" data-dli="ok">Got it</button>`}<button type="button" class="dli-alt" data-dli="skip">Play in the browser</button></div><p class="dli-note">You can find this again in Settings.</p></div>`;
  const close=()=>el.remove();
  el.addEventListener('click',e=>{ const b=e.target.closest('[data-dli]'); if(!b) return; if(b.dataset.dli==='install'){ const ip=window.__dlInstallPrompt; if(ip){ ip.prompt(); ip.userChoice.finally(()=>{ window.__dlInstallPrompt=null; }); } } close(); });
  document.body.appendChild(el); const go=el.querySelector('.dli-go'); if(go) go.focus(); }
function installWhenIdle(){ const ev=document.getElementById('evcard'); if((typeof G!=='undefined'&&G.st!=='idle')||(ev&&ev.offsetWidth)){ setTimeout(installWhenIdle,3000); return; } try{ installWelcome(false); }catch(e){} } /* never over another card (patch notes, the first-day tips) or mid-cast */
setTimeout(installWhenIdle,6000); /* after loading and after the cards that open by themselves (what's new ~1 s, test notes 3.5 s); the browser's install offer usually arrives first */
document.addEventListener('click',e=>{ const b=e.target.closest&&e.target.closest('[data-act="installhelp"]'); if(b) installWelcome(true); }); /* Settings › Install Driftline */
document.head.insertAdjacentHTML('beforeend',`<style>
#dl-install{position:fixed;inset:0;z-index:9000;display:flex;align-items:center;justify-content:center;padding:16px;background:rgba(5,10,16,.72)}
#dl-install .dli-card{box-sizing:border-box;width:100%;max-width:440px;max-height:calc(100% - 8px);overflow:auto;background:#0e1a2c;border:1px solid rgba(255,255,255,.1);border-radius:16px;padding:18px 20px;color:#e6efe8;font-family:var(--body,system-ui)}
#dl-install h3{margin:0 0 8px;font:800 20px var(--display,system-ui);color:#e6efe8}
#dl-install p{margin:0 0 10px;color:#9fb2c8;font-size:14px;line-height:1.45}
#dl-install .dli-steps{color:#e6efe8;background:#0a1424;border:1px solid rgba(255,255,255,.08);border-radius:12px;padding:10px 12px}
#dl-install .dli-row{display:flex;gap:10px;flex-wrap:wrap;margin-top:4px}
#dl-install .dli-go{font:800 15px var(--display,system-ui);min-height:42px;padding:0 20px;border:0;border-radius:10px;color:#fff;background:linear-gradient(180deg,#197a76,#14666a);cursor:pointer}
#dl-install .dli-alt{font:800 15px var(--display,system-ui);min-height:42px;padding:0 18px;border:1px solid rgba(255,255,255,.12);border-radius:10px;color:#e6efe8;background:#0a1424;cursor:pointer}
#dl-install button:focus-visible{outline:3px solid #7fe3c4;outline-offset:2px}
#dl-install .dli-note{font-size:12.5px;margin:10px 0 0}
</style>`);
