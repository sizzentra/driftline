// =====================================================================
// Phones (Android + iPhone), round 6 performance (director, 2026-11-18: "Aquarium tab on Android the only screen that
// experiences lag while scrolling", "reeling in storms on Android has a severely impacted frame rate").
// =====================================================================
const MOB=()=>{ const b=document.body.classList; return b.contains('phone-app')||b.contains('phone-land'); };

// 1) a menu covers the whole phone screen, so the fishing scene behind it is not drawn (the aquarium tank, the page and its
//    scrolling get the whole frame). The line waits while a menu is open, so nothing on the water is missed.
{ const _dr=draw; draw=function(now){ if(MENU_OPEN&&MOB()) return; return _dr.apply(this,arguments); }; }

// 2) the aquarium tank: 30 frames a second on phones, and it holds still while you scroll the page (scrolling stays smooth)
{ let lastT=0, scrollUntil=0; const P=$('panel'); if(P) P.addEventListener('scroll',()=>{ scrollUntil=performance.now()+180; },{passive:true});
  addEventListener('touchmove',()=>{ if(S.tab==='aquarium') scrollUntil=performance.now()+180; },{passive:true});
  const _dt=drawTank; drawTank=function(now){ if(MOB()){ const t=performance.now(); if(t<scrollUntil) return; if(t-lastT<32) return; lastT=t; } return _dt.apply(this,arguments); }; }

// 3) steady frame rate: the water's resolution follows how the phone keeps up. If frames drop for a few seconds (a storm, a
//    big fight), the water is drawn a little less sharp until the phone keeps up again; never more than two steps.
let MOB_DPR_CAP=2;
{ const _rd=renderDPR; renderDPR=function(w,h){ const d=_rd(w,h); return MOBDPR_ON()?Math.min(d,MOB_DPR_CAP):d; };
  function MOBDPR_ON(){ return MOB(); }
  const steps=[2,1.6,1.3]; let i=0, acc=0, n=0, slow=0, fast=0, last=0;
  const tick=t=>{ requestAnimationFrame(tick); if(!MOB()||document.hidden||MENU_OPEN){ last=0; return; } if(last){ const dt=t-last; if(dt<200){ acc+=dt; n++; } } last=t;
    if(n>=60){ const avg=acc/n; acc=0; n=0;
      if(avg>21){ slow++; fast=0; if(slow>=2&&i<steps.length-1){ i++; slow=0; MOB_DPR_CAP=steps[i]; try{ resize(); }catch(e){} } }
      else if(avg<15){ fast++; slow=0; if(fast>=8&&i>0){ i--; fast=0; MOB_DPR_CAP=steps[i]; try{ resize(); }catch(e){} } }
      else { slow=0; fast=0; } } };
  requestAnimationFrame(tick);
  if(/[?&]test\b/.test(location.search)) window.__mobperf=()=>({cap:MOB_DPR_CAP, step:i}); }

// 4) live events never move the game frame (director: "some live events on Android move the game frame as the counter moves
//    down while in portrait mode, seen with Market Rush"): the goal / live chip keeps to one line, digits keep the same width,
//    and the top bar chips keep their height, so the water above never gets re-measured while a countdown ticks
document.head.insertAdjacentHTML('beforeend',`<style>
body.phone-app,body.phone-land{font-variant-numeric:tabular-nums}
body.phone-app.dl-fish .hud > #goalchip .gl-t{white-space:nowrap!important;overflow:hidden!important;text-overflow:ellipsis!important;display:block;min-width:0}
body.phone-app.dl-fish .hud > #goalchip .gl-s{white-space:nowrap!important;overflow:hidden!important;text-overflow:ellipsis!important;display:block;min-width:0}
body.phone-app.dl-fish .hud > #goalchip{overflow:hidden}
</style>`);

// 5) Bait on the fishing screen (phones): a Bait button beside Rest shows the bait you use and opens the bait list
{ let btn=null; const label=()=>{ const b=BAIT[S.baitSel]||BAIT.worm; return '🪱 '+b.name+(S.baitSel!=='worm'?' · '+(S.bait[S.baitSel]||0):''); };
  const place=()=>{ if(!MOB()) { if(btn) btn.hidden=true; return; } const st=$('stage'), rest=$('resttog'); if(!st) return;
    if(!btn){ btn=document.createElement('button'); btn.type='button'; btn.id='baitqk'; btn.className='resttog baitqk'; btn.addEventListener('click',e=>{ e.stopPropagation(); try{ startAudio(); }catch(er){} try{ tackleView='bait'; }catch(er){} openMenu('shop'); }); st.appendChild(btn); }
    btn.hidden=false; const t=label(); if(btn.textContent!==t) btn.textContent=t;
    if(rest&&rest.offsetWidth){ const l=(rest.offsetLeft+rest.offsetWidth+8)+'px', tp=rest.offsetTop+'px', hh=rest.offsetHeight+'px'; // the Rest style pins left with !important, so ours must too
      if(btn.style.left!==l) btn.style.setProperty('left',l,'important'); if(btn.style.top!==tp) btn.style.setProperty('top',tp,'important'); if(btn.style.height!==hh) btn.style.setProperty('height',hh,'important'); btn.style.setProperty('bottom','auto','important'); } };
  setInterval(()=>{ try{ place(); }catch(e){} },1000); setTimeout(place,900); }
document.head.insertAdjacentHTML('beforeend',`<style>
body.phone-app #baitqk,body.phone-land #baitqk{max-width:46vw;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;border-color:#7fe3c466!important}
body.card-open #baitqk{opacity:0;pointer-events:none}
body:not(.phone-app):not(.phone-land) #baitqk{display:none!important}
</style>`);

// 6) Rods (phones): the "Your rods" presets at the top of the Rods page
{ const _rp=renderPanel; renderPanel=function(){ const r=_rp.apply(this,arguments); try{ if(S.tab!=='rods'||!MOB()) return r; const P=$('panel'); if(P.querySelector('.rp-box')) return r; const anchor=P.querySelector(':scope > .tile')||P.querySelector(':scope > .grid'); if(anchor) anchor.insertAdjacentHTML('beforebegin',rodPresetsHTML()); else P.insertAdjacentHTML('afterbegin',rodPresetsHTML()); }catch(e){} return r; }; }
