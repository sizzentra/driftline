// =====================================================================
// Phones, round 6: the page combinations PC got in 0.4.8, adapted for phones (director: "PC had some UI combinations that clean up
// empty space and make things functional together instead of separate, ie aquarium. Was everything run through mobile?").
//  - Aquarium: one compact header card: a one-line note, the boosts and the earnings with Collect / Feed together, and the long
//    explanation behind a "How the aquarium works" line you can open
//  - Cooler: a "Keep, To aquarium, Sell: what they do" line under Sell all that opens a short guide (PC shows it always;
//    phones keep it folded to save room)
// =====================================================================
{ const _rp=renderPanel; renderPanel=function(){ const r=_rp.apply(this,arguments); try{ if(!MOB()) return r; const P=$('panel');
    if(S.tab==='aquarium'&&!P.querySelector('.mb-aqh')){ const hd=P.querySelector(':scope > .dl-head'), badges=P.querySelector(':scope > .badges');
      if(hd){ hd.classList.add('mb-aqh'); const sub=hd.querySelector('p.sub'); if(sub){ const full=sub.textContent; sub.textContent='Visitors pay to see your fish, even while you are away. Every fish on display adds its boost.'; sub.insertAdjacentHTML('afterend',`<details class="mb-more"><summary>How the aquarium works</summary><p>${esc(full)}</p></details>`); }
        if(badges){ badges.removeAttribute('style'); badges.classList.add('mb-aqb'); hd.appendChild(badges); } } }
    if(S.tab==='cooler'&&!P.querySelector('.mb-help')){ const sell=[...P.querySelectorAll('button')].find(b=>/^Sell all/.test(b.textContent.trim()));
      if(sell){ (sell.closest('.row')||sell).insertAdjacentHTML('afterend',`<details class="mb-help mb-more"><summary>Keep, To aquarium, Sell: what they do</summary><div><p><b>🏛️ Keep</b> mounts the fish in the Trophy Room for good. No income, but it is never lost on a new voyage.</p><p><b>🐠 To aquarium</b> puts it on display: it earns coins every hour, even while you are away, and gives its boost.</p><p><b>🪙 Sell</b> gives coins right now. Sell all sells everything that matches the choices above.</p></div></details>`); } }
  }catch(e){ console.error(e); } return r; }; }
document.head.insertAdjacentHTML('beforeend',`<style>
body.phone-app #panel .mb-aqh,body.phone-land #panel .mb-aqh{display:flex!important;flex-direction:column;align-items:stretch!important;justify-content:flex-start!important;height:auto!important;min-height:0!important;gap:10px;padding:12px 14px;border-radius:16px;background:linear-gradient(180deg,#132238,#0e1a2c);border:1px solid #ffffff14;margin-bottom:10px}
body.phone-app #panel .mb-aqh p.sub,body.phone-land #panel .mb-aqh p.sub{margin:0;font-size:13px;line-height:1.4;color:#b9cadb}
body.phone-app #panel .mb-aqh .bank,body.phone-land #panel .mb-aqh .bank{margin:0!important;width:100%;box-sizing:border-box}
body.phone-app #panel .mb-aqb,body.phone-land #panel .mb-aqb{margin:0!important;display:flex;flex-wrap:wrap;gap:6px}
body.phone-app #panel .mb-more,body.phone-land #panel .mb-more{border-radius:12px;background:#0a1424;border:1px solid #ffffff12;padding:0}
body.phone-app #panel .mb-more > summary,body.phone-land #panel .mb-more > summary{list-style:none;cursor:pointer;padding:9px 12px;font:700 13px var(--display,system-ui);color:#7fe3c4;display:flex;align-items:center;gap:8px}
body.phone-app #panel .mb-more > summary::-webkit-details-marker,body.phone-land #panel .mb-more > summary::-webkit-details-marker{display:none}
body.phone-app #panel .mb-more > summary::before,body.phone-land #panel .mb-more > summary::before{content:'›';display:inline-block;transition:transform .15s;font-size:16px;line-height:1}
body.phone-app #panel .mb-more[open] > summary::before,body.phone-land #panel .mb-more[open] > summary::before{transform:rotate(90deg)}
body.phone-app #panel .mb-more p,body.phone-land #panel .mb-more p{margin:0 12px 10px;font-size:12.5px;line-height:1.45;color:#a9bccf}
body.phone-app #panel .mb-help,body.phone-land #panel .mb-help{margin:8px 0 10px}
body.phone-app #panel .mb-help b,body.phone-land #panel .mb-help b{color:#fff}
</style>`);
document.head.insertAdjacentHTML('beforeend',`<style>
body.phone-app #panel .mb-aqh > *,body.phone-land #panel .mb-aqh > *{flex:0 0 auto!important;height:auto!important;min-height:0!important}
</style>`);
