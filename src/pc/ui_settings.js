// =====================================================================
// PC quality of life (director, 2026-11-17: "on pc there's no exit button?", "a settings rework for pc where pc has exclusive
// controls and options. Nothing new, just QOL", "gold got moved? I liked it next to level").
// - Coins are back next to Level on the info row; the header keeps the same width so it still lines up with the menu's row.
// - A full screen button beside search, in the header and in the menus (Exit full screen when you are in it), and the F key.
// - Settings on PC: Sound, Controls, Display, Gameplay and a PC group on one page ("General"), patch notes and save as before.
// Phones and tablets are unchanged.
// =====================================================================
const pcFs={ api:()=>!!document.fullscreenElement,
  // full screen by F11 (browser menu) cannot be left from the page: it fills the screen without the fullscreen API
  f11:()=>!document.fullscreenElement&&innerHeight>=screen.height-2&&innerWidth>=screen.width-2,
  on(){ return this.api()||this.f11(); },
  toggle(){ const d=document; try{ if(window.DL_TESTAPP&&window.chrome&&chrome.webview){ chrome.webview.postMessage('dl-fullscreen'); return; } /* the Driftline Test app switches its own window (it starts full screen) */ if(d.fullscreenElement){ d.exitFullscreen(); return; } if(this.f11()){ toast('Press F11 to leave full screen.'); return; } const p=d.documentElement.requestFullscreen&&d.documentElement.requestFullscreen(); if(p&&p.catch) p.catch(()=>toast('This browser did not allow full screen.')); }catch(e){} } };
{ const ICON_IN='<svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/></svg>',
    ICON_OUT='<svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 4v5H4M15 4v5h5M9 20v-5H4M15 20v-5h5"/></svg>';
  const mk=cls=>{ const b=document.createElement('button'); b.type='button'; b.className=cls+' pc-fsb'; b.addEventListener('click',e=>{ e.stopPropagation(); e.preventDefault(); pcFs.toggle(); setTimeout(sync,250); },true); return b; };
  const bs=[]; const add=(host,cls)=>{ if(!host) return; const b=mk(cls); const ref=host.querySelector('[data-pch="search"],[data-mo="search"]'); host.insertBefore(b,ref||null); bs.push(b); };
  const sync=()=>{ const on=pcFs.on(); bs.forEach(b=>{ b.innerHTML=on?ICON_OUT:ICON_IN; const t=on?'Exit full screen (Esc or F)':'Full screen (F)'; b.title=t; b.setAttribute('aria-label',t); b.setAttribute('aria-pressed',on); });
    document.querySelectorAll('#panel [data-act="fullscreen"]').forEach(x=>{ x.textContent=on?'Exit full screen':'Full screen'; const m=x.closest('.toggle')&&x.closest('.toggle').querySelector('.meta'); if(m&&m.dataset.pcfs) m.textContent=on?(pcFs.api()?'You are in full screen. Esc also leaves it.':'Full screen from the browser: press F11 to leave it.'):'Fill the whole screen with the game. F does it too.'; }); };
  const init=()=>{ add(document.querySelector('#pchead .pch-tools'),'pch-tb'); add(document.querySelector('#menuov .mo-tools'),'mo-tb'); sync(); };
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',init); else init();
  document.addEventListener('fullscreenchange',()=>setTimeout(sync,60)); addEventListener('resize',()=>setTimeout(sync,120));
  window.pcFsSync=sync;
  // F: full screen on PC (not while typing)
  addEventListener('keydown',e=>{ if((e.key!=='f'&&e.key!=='F')||e.ctrlKey||e.metaKey||e.altKey||e.repeat) return; if(!document.body.classList.contains('pch-on')) return; const t=(document.activeElement&&document.activeElement.tagName)||''; if(/INPUT|TEXTAREA|SELECT/.test(t)) return; const sov=$('searchov'); if(sov&&!sov.hidden) return; e.preventDefault(); pcFs.toggle(); setTimeout(sync,250); });
  // the shortcut list: current section names, and F
  try{ const k=KEYS.find(x=>x[0]==='1 - 5'); if(k) k[1]='Open a section (Fishing, Upgrades, Collections, Challenges, Customization)'; if(!KEYS.some(x=>x[0]==='F')) KEYS.splice(KEYS.findIndex(x=>x[0]==='M')+1,0,['F','Full screen on or off (PC)']); }catch(e){} }
// Settings on PC
{ const _rs=renderSettings; renderSettings=function(P){ _rs(P); if(!document.body.classList.contains('pch-on')) return; try{ const grid=P.querySelector(':scope > .grid'); if(!grid) return; const s=S.settings;
    // the full screen and frame rate rows move from Display into the PC group
    const disp=[...grid.children].find(t=>/^Display/.test((t.querySelector('h4')||{}).textContent||'')); let fpsRow=null;
    if(disp){ disp.querySelectorAll('.toggle').forEach(r=>{ if(r.querySelector('[data-act="fullscreen"]')) r.remove(); else if(r.querySelector('[data-k="showFps"]')) fpsRow=r; }); if(fpsRow) fpsRow.remove(); }
    let auto=true; try{ auto=localStorage.getItem('dl-fs-auto')!=='0'; }catch(e){}
    const t=document.createElement('div'); t.className='tile pc-set'; t.innerHTML=`<h4>PC</h4>
      <div class="toggle"><div><b>Full screen</b><div class="meta" data-pcfs="1"></div></div><button class="btn sm" data-act="fullscreen" type="button">Full screen</button></div>
      <div class="toggle"><div><b>Back to full screen</b><div class="meta">If you leave the game in full screen, it goes back to full screen the next time you play.</div></div><button class="btn ${auto?'':'alt'} sm" data-pcauto="1" type="button" aria-pressed="${auto}">${auto?'On':'Off'}</button></div>
      ${fpsRow?fpsRow.outerHTML:''}
      <h5>Keyboard</h5><div class="pc-keys">${KEYS.map(k=>`<div><kbd>${esc(k[0])}</kbd><span>${esc(k[1])}</span></div>`).join('')}</div>`;
    grid.appendChild(t);
    const ab=t.querySelector('[data-pcauto]'); ab.addEventListener('click',e=>{ e.stopPropagation(); let v=true; try{ v=localStorage.getItem('dl-fs-auto')==='0'; localStorage.setItem('dl-fs-auto',v?'1':'0'); }catch(er){} ab.textContent=v?'On':'Off'; ab.classList.toggle('alt',!v); ab.setAttribute('aria-pressed',v); });
    if(window.pcFsSync) pcFsSync(); }catch(e){ console.error(e); } };
}
document.head.insertAdjacentHTML('beforeend',`<style>
.pc-fsb{display:none!important}
html body.pch-on .pc-fsb{display:inline-grid!important;place-items:center}
html body.pch-on .pc-fsb svg{display:block}
/* coins next to Level again on PC; the header keeps the menu row's width so the two rows still line up */
/* (coins sit with Level in the header corner, see below) */

body.pch-on #panel .pc-set .pc-keys{display:grid;grid-template-columns:auto minmax(0,1fr);gap:5px 10px;align-items:center;margin-top:4px}
body.pch-on #panel .pc-set .pc-keys > div{display:contents}
body.pch-on #panel .pc-set kbd{display:inline-block;min-width:46px;text-align:center;padding:2px 7px;border-radius:7px;background:#ffffff14;border:1px solid #ffffff2a;border-bottom-width:2px;font:800 11.5px ui-monospace,Consolas,monospace;color:#fff}
body.pch-on #panel .pc-set .pc-keys span{font-size:12.5px;color:#cfdcea}
</style>`);
