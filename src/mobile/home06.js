// =====================================================================
// Phones, round 6 critique: "Your home" on phones too (round 5 built it for PC only). Every water has a home (dock, pier,
// boat, trawler, raft, ice camp, beach, stone ledge, crystal shelf); the page offers only what works there: wood where the
// home has wood, the dock's style only at a dock, hull paint on boats, and the home's own light everywhere.
// Shared data and drawing: bu_home05.js. This file is only the phone layout.
// =====================================================================
{ const L=()=>LOCS.find(x=>x.id===S.loc)||LOCS[0];
  let lbl=null; const sync=()=>{ try{ const b=menuTabBtn('home'); if(!b) return; if(lbl==null) lbl=b.dataset.label; const want=MOB()?'🏠 Your home':lbl; if(b.dataset.label!==want){ b.dataset.label=want; menuSubKey=''; if(MENU_OPEN) menuSync(); } }catch(e){} };
  new MutationObserver(sync).observe(document.body,{attributes:true,attributeFilter:['class']}); setTimeout(sync,0); setTimeout(sync,900);
  const _rp=renderPanel; renderPanel=function(){ const r=_rp.apply(this,arguments); try{ if(S.tab!=='home'||!MOB()) return r; const P=$('panel'); if(P.querySelector('.hm-phone')||P.querySelector(':scope > .hf-mark')) return r; /* format homes have their own elements */
      const loc=L(), feats=HOME_FEATURES[loc.plat]||['light'], hname=HOME_NAMES[loc.plat]||'home', h5=[...P.querySelectorAll(':scope > h5')];
      const wood=h5.find(h=>/^Wood/i.test(h.textContent)), style=h5.find(h=>/style/i.test(h.textContent)), deco=h5.find(h=>/^Decorations/i.test(h.textContent));
      const hide=h=>{ if(!h) return; h.style.display='none'; const n=h.nextElementSibling; if(n&&n.classList.contains('chips')) n.style.display='none'; };
      if(!feats.includes('wood')) hide(wood); if(!feats.includes('style')) hide(style);
      let html='<div class="hm-phone">';
      if(feats.includes('hull')){ const cur=(S.dock&&S.dock.hull)||''; html+=`<h5>${esc(homePaintName(loc.plat))}</h5><div class="chips">${HOME_HULLS.map(([id,n,c])=>`<button type="button" class="chipb" data-home="hull:${id}" aria-pressed="${cur===id}"><span class="hm-sw" style="background:${c||'linear-gradient(135deg,#f2eee2,#9a2e24)'}"></span>${esc(n)}</button>`).join('')}</div>`; }
      { const cur=(S.dock&&S.dock.light)||''; html+=`<h5>Light</h5><div class="chips">${HOME_LIGHTS.map(([id,n,rgb])=>`<button type="button" class="chipb" data-home="light:${id}" aria-pressed="${cur===id}"><span class="hm-sw hm-glow" style="background:${rgb?'radial-gradient(circle,rgb('+rgb+') 0%,rgba('+rgb+',.35) 55%,transparent 72%)':'radial-gradient(circle,#ffd690 0%,#ffb85a55 55%,transparent 72%)'}"></span>${esc(n)}</button>`).join('')}</div>`; }
      html+=`<p class="hm-note">${feats.includes('style')?'The wood colours your dock; the style shapes it. ':feats.includes('wood')?'The wood colours the wooden parts of your '+esc(hname)+'. ':''}${feats.includes('hull')?esc(homePaintLine(loc.plat,hname)):''}The light recolours the ${loc.plat==='crystal'?'glow':loc.plat==='sand'?'torch':'lamp'} of your ${esc(hname)}. Free to change.</p></div>`;
      if(deco) deco.insertAdjacentHTML('beforebegin',html); else P.insertAdjacentHTML('beforeend',html);
      // the page switches between "Your home" and "Decorations": our block follows the home part, the sort row follows the decorations
      const hm=P.querySelector('.hm-phone'), tools=P.querySelector(':scope > .shoptools'), grid=P.querySelector(':scope > .grid'), dockbar=P.querySelector(':scope > .dockbar');
      const follow=()=>{ const homeOn=dockbar?dockbar.style.display!=='none':true; hm.style.display=homeOn?'':'none'; if(tools&&grid) tools.style.display=grid.style.display==='none'?'none':''; };
      follow(); const nv=P.querySelector(':scope > .bwx-nav'); if(nv) nv.addEventListener('click',()=>setTimeout(follow,0));
      // words: "home" instead of "dock" where the page talks about every water
      const intro=P.querySelector('.dl-head'); if(intro){ for(const n of intro.querySelectorAll('*')) if(n.children.length===0&&/Every water has its own dock/.test(n.textContent)) n.textContent='Every water has its own home: here it is your '+hname+'. Pick its look and its decorations: the cozier it gets, the better you fish here.'; }
      const nav=P.querySelector(':scope > .bwx-nav'); if(nav&&nav.firstElementChild&&/^Dock$/.test(nav.firstElementChild.textContent.trim())) nav.firstElementChild.textContent='Your '+hname;
    }catch(e){ console.error(e); } return r; };
  document.addEventListener('click',e=>{ const b=e.target.closest&&e.target.closest('#panel [data-home]'); if(!b||!MOB()) return; e.stopPropagation(); const [k,id]=b.dataset.home.split(':');
    if(k==='light'&&homeLightOk(id)) S.dock.light=id; else if(k==='hull'&&homeHullOk(id)) S.dock.hull=id; else return;
    try{ sfx.coin(); }catch(er){} save(); renderPanel(); },true); }
document.head.insertAdjacentHTML('beforeend',`<style>
body.phone-app #panel .hm-phone h5,body.phone-land #panel .hm-phone h5{margin:14px 0 6px}
body.phone-app #panel .hm-sw,body.phone-land #panel .hm-sw{display:inline-block;width:12px;height:12px;border-radius:4px;margin-right:6px;vertical-align:-2px;box-shadow:inset 0 0 0 1px #ffffff33}
body.phone-app #panel .hm-glow,body.phone-land #panel .hm-glow{border-radius:50%;width:14px;height:14px;box-shadow:none}
body.phone-app #panel .hm-note,body.phone-land #panel .hm-note{margin:8px 2px 4px;font-size:12.5px;color:#9fb2c8;line-height:1.45}
</style>`);
