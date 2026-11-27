// =====================================================================
// PC header (director, 2026-11-17): on PC the fishing screen uses the same top row as the menu, in the same place, so opening
// and closing the menu only changes what is below it. Row 1: Driftline | the five categories | coins, search, settings.
// Row 2: level, where you fish, the goal, cooler, aquarium, Fish Log (the menu shows its page tabs on this row). The category
// bar under the water is gone on PC and the water reaches down to the bottom. Phones and tablets are unchanged.
// =====================================================================
{ const wrap=document.querySelector('.wrap'), hud=document.querySelector('.hud'), stage=$('stage');
  const PCH=document.createElement('div'); PCH.id='pchead';
  PCH.innerHTML=`<div class="pch-brand" aria-hidden="true"><svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12c3-4 7-5 10-5 3 0 5 2 7 5-2 3-4 5-7 5-3 0-7-1-10-5z"/><path d="M3 12l-1.5-3M3 12l-1.5 3"/><circle cx="16" cy="11" r=".9" fill="currentColor"/></svg><span>Driftline</span></div><div class="pch-cats"></div><div class="pch-tools"><button type="button" class="pch-tb" data-pch="search" aria-label="Search the menus" title="Search the menus">🔍</button><button type="button" class="pch-tb" data-pch="settings" aria-label="Settings" title="Settings">⚙</button></div>`;
  if(wrap&&hud) wrap.insertBefore(PCH,hud);
  const cats=PCH.querySelector('.pch-cats');
  PCH.querySelector('.pch-tools').addEventListener('click',e=>{ const b=e.target.closest('[data-pch]'); if(!b) return; e.stopPropagation(); try{ startAudio(); }catch(er){ oops('pc/ui_header_row:startAudio',er); } const t=$(b.dataset.pch==='search'?'searchbtn':'settingsbtn'); if(t) t.click(); });
  const label=(full)=>CD.querySelectorAll('.cdb[data-cd]').forEach(b=>{ const sec=MENU_SECS.find(s=>s.id===b.dataset.cd), l=b.querySelector('.cdl'); if(sec&&l){ const t=full?sec.name:(sec.short||sec.name); if(l.textContent!==t) l.textContent=t; } });
  const on=()=>{ const b=document.body.classList; return b.contains('plat-pc')&&b.contains('pc-app')&&!b.contains('phone-app')&&!b.contains('phone-land')&&innerWidth>=800; };
  let was=null; const apply=()=>{ const v=on(); if(v===was) return; was=v; document.body.classList.toggle('pch-on',v);
    if(v){ if(CD.parentElement!==cats) cats.appendChild(CD); label(true); } else { if(CD.parentElement===cats&&stage) stage.after(CD); label(false); }
    try{ requestAnimationFrame(()=>resize()); }catch(e){ oops('pc/ui_header_row:requestAnimationFrame',e); } };
  addEventListener('resize',()=>setTimeout(apply,30)); document.addEventListener('fullscreenchange',()=>setTimeout(apply,140));
  new MutationObserver(()=>apply()).observe(document.body,{attributes:true,attributeFilter:['class']});
  apply(); setTimeout(apply,80); }
document.head.insertAdjacentHTML('beforeend',`<style>
#pchead{display:none}
html body.pch-on.dl-fish .wrap{padding-left:4px!important;padding-right:4px!important;box-sizing:border-box}
html body.pch-on.dl-fish #pchead{display:grid;grid-template-columns:190px minmax(0,1fr) auto;column-gap:14px;align-items:stretch;height:46px;margin:2px 0 0;flex:0 0 auto}
body.pch-on #menuov .mo-back{width:190px;justify-content:flex-start;box-sizing:border-box}
#pchead .pch-brand{display:flex;align-items:center;gap:10px;padding:0 14px;border-radius:14px;border:1px solid #7fe3c433;background:linear-gradient(180deg,#132c3c,#0e2131);color:#dff7ef;font:800 16px var(--display,system-ui);letter-spacing:.01em;box-shadow:inset 0 1px 0 #ffffff12;user-select:none}
#pchead .pch-brand svg{color:#7fe3c4;flex:0 0 auto}
#pchead .pch-cats{margin-left:14px;min-width:0}
html body.pch-on #pchead #catdock{position:static!important;inset:auto!important;transform:none!important;display:grid!important;grid-template-columns:repeat(5,minmax(0,1fr));gap:4px;height:46px;width:100%;padding:0!important;margin:0!important;background:none!important;border:0!important;border-radius:0!important;box-shadow:none!important;-webkit-backdrop-filter:none!important;backdrop-filter:none!important;z-index:auto}
html body.pch-on #pchead #catdock > .cdmini{display:none!important}
html body.pch-on #pchead #catdock .cdb{position:relative!important;display:flex!important;flex-direction:row!important;align-items:center!important;justify-content:center!important;gap:8px!important;height:46px!important;min-width:0!important;padding:4px 10px!important;border-radius:16px!important;border:1px solid #26385180!important;background:linear-gradient(180deg,#16243a,#111c2e)!important;box-shadow:inset 0 1px 0 #ffffff12,inset 0 0 0 1px #ffffff06,0 4px 14px #02060f55!important;color:#a9bdd4!important;font:800 14px var(--display,system-ui)!important;transform:none!important;transition:border-color .15s,color .15s,background .15s!important}
html body.pch-on #pchead #catdock .cdb svg{width:22px;height:22px;color:#7f97b2;flex:0 0 auto}
html body.pch-on #pchead #catdock .cdb .cdl{white-space:nowrap;overflow:hidden;text-overflow:ellipsis;font-size:14px}
html body.pch-on #pchead #catdock .cdb:hover{color:#eef3f8!important;border-color:#5a7ea866!important}
html body.pch-on #pchead #catdock .cdb:hover svg{color:#7fe3c4}
html body.pch-on #pchead #catdock .cdb:active{transform:scale(.985)!important}
html body.pch-on #pchead #catdock .cddot{position:absolute!important;top:-7px!important;right:8px!important;left:auto!important;min-width:20px;height:20px;padding:0 6px;box-sizing:border-box;border-radius:999px;background:linear-gradient(180deg,#ffb36a,#ff7a4a)!important;color:#2a1206!important;font:800 12px/20px var(--display,system-ui)!important;text-align:center;box-shadow:0 0 10px #ff8a5c88,0 2px 6px #0008!important}
html body.pch-on #pchead #catdock .cdb.live::before{top:6px!important;left:8px!important}
#pchead .pch-tools{display:flex;align-items:center;gap:8px}
#pchead .pch-tb{width:42px;height:42px;border-radius:12px;border:1px solid #26385180;background:#111c2e;color:#dbe7f3;font-size:18px;cursor:pointer;transition:border-color .15s,color .15s;display:flex;align-items:center;justify-content:center;padding:0}
#pchead .pch-tb:hover{border-color:#5a7ea8aa;color:#fff}
#pchead .pch-tb:focus-visible,html body.pch-on #pchead #catdock .cdb:focus-visible{outline:2px solid var(--gold,#ffd36a);outline-offset:2px}
/* row 2: the info chips, the height and place of the menu's page tabs */
html body.pch-on.dl-fish .hud{display:flex!important;flex-wrap:nowrap!important;grid-template-columns:none!important;grid-template-areas:none!important;gap:8px!important;height:50px;margin:-2px 0 0!important;padding:0!important;flex:0 0 auto}
html body.pch-on.dl-fish .hud > *{height:50px!important;grid-area:auto!important}
html body.pch-on.dl-fish .hud > .st-coins,html body.pch-on.dl-fish .hud > .hudbtns,html body.pch-on.dl-fish .hud > .brand,html body.pch-on.dl-fish .hud > .st-buff,html body.pch-on.dl-fish .hud > .st-bait{display:none!important}
html body.pch-on.dl-fish .hud > .st-lvl{flex:0 0 190px!important;max-width:none!important;box-sizing:border-box}
html body.pch-on.dl-fish .hud > .stat.loc{flex:0 0 auto!important;max-width:none!important}
html body.pch-on.dl-fish .hud > #goalchip{flex:1 1 0!important;min-width:140px!important;max-width:none!important}
html body.pch-on.dl-fish .hud > .st-cool,html body.pch-on.dl-fish .hud > .st-aq,html body.pch-on.dl-fish .hud > .st-log{flex:0 0 auto!important;max-width:none!important;min-width:96px}
html body.pch-on.dl-fish .hud > .stat b{white-space:nowrap}
html body.pch-on.dl-fish #stage{margin-left:0!important;margin-right:0!important}
html body.pch-on.dl-fish .wrap > #catdock{display:none!important}
/* up to 1100 px the menu puts its categories on their own row under Back; the header does the same so both still line up */
@media (max-width:1100px){ html body.pch-on.dl-fish #pchead{grid-template-rows:46px 46px;row-gap:6px;height:auto} #pchead .pch-brand{grid-row:1;grid-column:1} #pchead .pch-tools{grid-row:1;grid-column:3} #pchead .pch-cats{grid-row:2;grid-column:1 / -1;margin-left:0} html body.pch-on.dl-fish .hud > .st-cool,html body.pch-on.dl-fish .hud > .st-aq,html body.pch-on.dl-fish .hud > .st-log{min-width:0} }
</style>`);
