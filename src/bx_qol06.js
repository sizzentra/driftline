// =====================================================================
// Round 6 quality of life that works the same on every platform (director, 2026-11-18: "use those QoL's across all
// platforms and make them function properly on each build").
// =====================================================================

// ---------- after "Travel here" the menu closes and you are fishing at the new water at once ----------
// (director: "when moving to a new zone through Waters, jump back to the game screen once Travel here is clicked")
document.addEventListener('click',e=>{ const b=e.target.closest&&e.target.closest('[data-act="goto"]'); if(!b||!MENU_OPEN) return; const from=S.loc;
  setTimeout(()=>{ try{ if(S.loc!==from&&MENU_OPEN){ closeMenu(); } }catch(er){} },60); },true);

// ---------- rows that scroll sideways show a small arrow at the edge that has more (director: "whenever a bar can be scrolled
// left or right, add a slight indicator at the corner so players don't miss a function or menu") ----------
{ const SEL='#menuov .subbar, #menuov .chips, #menuov .bwx-nav, #menuov .wd-nav, #menuov .fl-show, #menuov .shoptools, #menuov .hunt-chips, .hud, #catdock';
  const mark=el=>{ const can=el.scrollWidth>el.clientWidth+4, l=can&&el.scrollLeft>4, r=can&&el.scrollLeft+el.clientWidth<el.scrollWidth-4;
    if(el.classList.contains('sc-l')!==l) el.classList.toggle('sc-l',l); if(el.classList.contains('sc-r')!==r) el.classList.toggle('sc-r',r);
    const host=el.parentElement; if(host){ if(getComputedStyle(host).position==='static') host.classList.add('sc-host'); let a=el._scA; if(!a&&(l||r)){ a=el._scA=[document.createElement('i'),document.createElement('i')]; a[0].className='sc-arrow sc-al'; a[1].className='sc-arrow sc-ar'; a[0].textContent='‹'; a[1].textContent='›'; el.after(a[0],a[1]); }
      if(a){ const r1=el.getBoundingClientRect(), hr=host.getBoundingClientRect(); for(const [i,on] of [[0,l],[1,r]]){ a[i].hidden=!on; if(on){ a[i].style.top=(r1.top-hr.top+r1.height/2)+'px'; a[i].style.left=(i?r1.right-hr.left-18:r1.left-hr.left)+'px'; } } } } };
  let q=0; const scan=()=>{ q=0; document.querySelectorAll(SEL).forEach(el=>{ const ox=getComputedStyle(el).overflowX; if(ox==='auto'||ox==='scroll') mark(el); else if(el._scA){ el._scA.forEach(x=>x.hidden=true); } }); };
  const soon=()=>{ if(!q) q=setTimeout(scan,120); };
  document.addEventListener('scroll',e=>{ const el=e.target; if(el&&el.matches&&el.matches(SEL)) mark(el); },true);
  new MutationObserver(soon).observe(document.body,{childList:true,subtree:true}); addEventListener('resize',soon); setTimeout(scan,800); }
document.head.insertAdjacentHTML('beforeend',`<style>
.sc-host{position:relative}
.sc-arrow{position:absolute;z-index:6;width:18px;height:26px;margin-top:-13px;display:flex;align-items:center;justify-content:center;border-radius:9px;background:linear-gradient(180deg,#1f8a86,#14666a);border:1px solid #7fe3c4;color:#fff;font:900 16px/1 system-ui;font-style:normal;pointer-events:none;box-shadow:0 2px 8px #0009;opacity:.92}
.sc-arrow[hidden]{display:none}
</style>`);

// ---------- the water always fills its frame: if the layout around it settles after the water was sized (a chip arriving in the
// strip, a font loading, a page closing), the water is fitted again. A cheap check once a second; it only acts on a real gap ----------
setInterval(()=>{ try{ if(document.hidden||(typeof MENU_OPEN!=='undefined'&&MENU_OPEN)) return; const st=$('stage'), c=$('cv'); if(!st||!c||!st.clientHeight) return;
  const ch=parseFloat(c.style.height)||c.getBoundingClientRect().height; if(Math.abs(st.clientHeight-ch)>3) resize(); }catch(e){} },1000);
