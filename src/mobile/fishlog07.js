// =====================================================================
// Phones, round 7: the Fish Log's Normal / Shiny switch (director, 2026-11-18: "shiny toggle in mobile fish log missing"). PC has had
// it since 2026-11-17 (pc/ui_fhd.js); phones get the same switch under the fish picture in the details, in the phone look:
// Normal by default, Shiny once you have caught that species (it shows what its shiny looks like). Android + iPhone only.
// =====================================================================
{ let shinyView=false, lastSel=null; const _rj=renderJournal;
  renderJournal=function(P){ _rj.apply(this,arguments); try{ if(!MOB()) return;
      const det=P.querySelector('.tile.detail'), sel=encSel&&SPI[encSel]; if(!det||!sel) return;
      if(sel.id!==lastSel){ lastSel=sel.id; shinyView=false; } /* a different fish starts on Normal */
      const caught=!!S.journal[sel.id], cv=det.querySelector('canvas[data-fish]'); if(!cv||det.querySelector('.mb-shsw')) return;
      const sw=document.createElement('div'); sw.className='mb-shsw'; sw.setAttribute('role','group'); sw.setAttribute('aria-label','Show the normal or the shiny look');
      sw.innerHTML=`<button type="button" data-v="0" aria-pressed="${!shinyView}">Normal</button><button type="button" data-v="1" aria-pressed="${shinyView}" ${caught?'':'disabled'}>✦ Shiny</button>${caught?'':'<span class="mb-shnote">Catch it to see its shiny look</span>'}`;
      cv.after(sw); if(caught){ cv.dataset.sh=shinyView?'1':'0'; paintFish(det); }
      sw.querySelectorAll('button').forEach(b=>b.addEventListener('click',e=>{ e.stopPropagation(); if(b.disabled) return; shinyView=b.dataset.v==='1'; sw.querySelectorAll('button').forEach(x=>x.setAttribute('aria-pressed',String(x===b))); cv.dataset.sh=shinyView?'1':'0'; paintFish(det); }));
    }catch(e){ console.error(e); } }; }
document.head.insertAdjacentHTML('beforeend',`<style>
html body.phone-app #panel .mb-shsw,html body.phone-land #panel .mb-shsw{display:flex;flex-wrap:wrap;align-items:center;gap:6px;margin:8px 0 4px;padding:4px;border-radius:12px;background:#0c1626;border:1px solid #ffffff17;width:max-content;max-width:100%;box-sizing:border-box}
html body.phone-app #panel .mb-shsw button,html body.phone-land #panel .mb-shsw button{border:0;border-radius:10px;min-height:36px;padding:0 14px;background:transparent;color:#9fb3c8;font:800 13px var(--display);cursor:pointer}
html body.phone-app #panel .mb-shsw button[aria-pressed="true"],html body.phone-land #panel .mb-shsw button[aria-pressed="true"]{background:linear-gradient(180deg,#ffe08a,#f3b94e);color:#2a1c05}
html body.phone-app #panel .mb-shsw button:disabled,html body.phone-land #panel .mb-shsw button:disabled{opacity:.45;cursor:default}
html body.phone-app #panel .mb-shnote,html body.phone-land #panel .mb-shnote{font:700 11.5px var(--display);color:#9fb3c8;padding:0 6px}
</style>`);
