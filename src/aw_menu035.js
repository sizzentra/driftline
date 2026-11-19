// =====================================================================
// 0.3.5 menus: the 18 tabs are grouped into 5 sections (Fishing, Gear, Collection, Home, Rewards).
// A row of section buttons sits right under the water (never over it); the open section shows its pages as
// pills; Settings, Stats and Save live behind the gear button. On phones held upright the section row docks
// along the bottom edge of the screen. The old tab buttons stay in #tabs, hidden: every existing badge,
// link (data-tabgo) and setTab() call keeps working, and this layer just mirrors them.
// =====================================================================
// the page's fade-in, started without forcing a layout (the old way read a size right after building the page, which made the
// browser finish laying out a big page early: 8-11 ms per menu change). Same look: from 35% to full, rising 3 px, 0.22 s.
function pageIn(P){ try{ if(!P||!P.animate||matchMedia('(prefers-reduced-motion:reduce)').matches) return; P.animate([{opacity:.35,transform:'translateY(3px)'},{opacity:1,transform:'none'}],{duration:220,easing:'ease-out'}); }catch(e){} }
const MENU_SECS=[
  {id:'fish',  name:'Fishing',    tabs:['cooler','map','bounties','events'],
   icon:'<path d="M4 12c3-4.5 9-5.5 13-1l3-2.5v7L17 13c-4 4.5-10 3.5-13-1z"/><circle cx="8.5" cy="11.4" r=".9" fill="currentColor" stroke="none"/>'},
  {id:'gear',  name:'Gear',       tabs:['shop','rods','skills','paths'],
   icon:'<path d="M5 20 18.5 4.5"/><path d="M18.5 4.5v9.5"/><circle cx="18.5" cy="16.2" r="2.2"/><circle cx="8.6" cy="15.2" r="2.3"/>'},
  {id:'coll',  name:'Collection', tabs:['aquarium','journal','feats'],
   icon:'<rect x="3.5" y="5" width="17" height="14" rx="2.5"/><path d="M7 13c1.8-2.4 4.8-2.9 7-.6l1.8-1.4v4l-1.8-1.4c-2.2 2.3-5.2 1.8-7-.6z"/><path d="M3.5 16.5c3 .8 5 .8 8 0s5-.8 9 0"/>'},
  {id:'home',  name:'Home',       tabs:['home','pets','style'],
   icon:'<path d="M4 11.5 12 5l8 6.5"/><path d="M6 10v9h12v-9"/><path d="M10 19v-5h4v5"/>'},
  {id:'reward',name:'Rewards',    tabs:['pass','games'],
   icon:'<rect x="4" y="9.5" width="16" height="10" rx="1.5"/><path d="M3 9.5h18M12 9.5v10"/><path d="M12 9.5c-2.5 0-4.5-1-4.5-2.8S10.5 4.5 12 9.5c1.5-5 4.5-4.6 4.5-2.8S14.5 9.5 12 9.5z"/>'},
];
const MENU_MORE={id:'more', name:'More', tabs:['settings','stats','save']}; // reached from the gear button in the top bar
function menuSecOf(tab){ return MENU_SECS.find(s=>s.tabs.includes(tab)) || (MENU_MORE.tabs.includes(tab)?MENU_MORE:null); }
function menuTabBtn(t){ return $('tabs').querySelector(':scope > [data-tab="'+t+'"]'); }
// the label of a page: the old tab's emoji + name; Settings has no tab button any more, so it is named here
function menuTabLabel(t){ if(t==='settings') return ['🎛️','Settings']; /* not a second gear: the gear button above already opens this section */ const b=menuTabBtn(t), l=(b&&b.dataset.label)||t, i=l.indexOf(' '); return i>0?[l.slice(0,i),l.slice(i+1)]:['',l]; }
function menuTabsIn(sec){ return sec.tabs.filter(t=>t==='settings'||menuTabBtn(t)); }
function menuDot(t){ const b=menuTabBtn(t), d=b&&b.querySelector('.dot'); return d?(parseInt(d.textContent,10)||0):0; }
function menuLast(){ const s=S.settings; if(!s.secLast||typeof s.secLast!=='object') s.secLast={}; return s.secLast; }

// build the two rows once (inside #tabs, so every layout puts them exactly where the old grid was)
(function menuBuild(){ const T=$('tabs'); if(!T||T.querySelector('.secbar')) return; T.classList.add('secmode');
  const svg=p=>`<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${p}</svg>`;
  T.insertAdjacentHTML('beforeend',`<div class="secbar" role="toolbar" aria-label="Menu sections">${MENU_SECS.map(s=>`<button type="button" class="secb" data-sec="${s.id}" aria-pressed="false"><span class="seci">${svg(s.icon)}</span><span class="secl">${s.name}</span><span class="secdot" hidden></span></button>`).join('')}</div><div class="subbar" role="toolbar" aria-label="Pages"></div>`);
  T.addEventListener('click',e=>{ const sb=e.target.closest('[data-sec]'), pb=e.target.closest('[data-sub]'); if(!sb&&!pb) return; e.stopPropagation(); startAudio&&startAudio();
    if(sb){ const sec=MENU_SECS.find(s=>s.id===sb.dataset.sec), list=menuTabsIn(sec), last=menuLast()[sec.id]; const go=list.includes(last)?last:list[0]; if(S.tab!==go){ setTab(go); save(); } menuReveal(); }
    else { const t=pb.dataset.sub; if(S.tab!==t){ setTab(t); save(); } pb.scrollIntoView({block:'nearest',inline:'nearest'}); } });
  // keyboard: arrows move between section buttons / page pills like a tab row
  T.addEventListener('keydown',e=>{ if(e.key!=='ArrowLeft'&&e.key!=='ArrowRight') return; const row=e.target.closest('.secbar,.subbar'); if(!row) return; const bs=[...row.querySelectorAll('button')], i=bs.indexOf(e.target); if(i<0) return; e.preventDefault(); const n=bs[(i+(e.key==='ArrowRight'?1:-1)+bs.length)%bs.length]; n.focus(); n.click(); });
  { const sb=T.querySelector('.subbar'); sb.addEventListener('scroll',()=>{ sb.classList.toggle('more-r',sb.scrollLeft+sb.clientWidth<sb.scrollWidth-4); sb.classList.toggle('more-l',sb.scrollLeft>4); },{passive:true}); }
  // badges: the hidden tab buttons are still updated by the game; mirror their numbers onto sections and pills
  const mo=new MutationObserver(()=>menuBadges()); T.querySelectorAll(':scope > [data-tab]').forEach(b=>mo.observe(b,{childList:true,subtree:true,characterData:true}));
})();

let menuSubKey='';
function menuSync(){ const T=$('tabs'); if(!T) return; const sec=menuSecOf(S.tab), sb=T.querySelector('.subbar');
  T.querySelectorAll('.secb').forEach(b=>{ const on=!!sec&&b.dataset.sec===sec.id; b.setAttribute('aria-pressed',on?'true':'false'); b.classList.toggle('on',on); });
  const sbtn=$('settingsbtn'); if(sbtn) sbtn.classList.toggle('menu-on',!!sec&&sec.id==='more');
  if(sec) menuLast()[sec.id]=S.tab;
  // the pills of the open section (rebuilt only when the section changes)
  const list=sec?menuTabsIn(sec):[], key=(sec?sec.id:'')+'|'+list.join(',');
  if(key!==menuSubKey){ menuSubKey=key; sb.innerHTML=list.map(t=>{ const [ic,nm]=menuTabLabel(t); return `<button type="button" class="subp" data-sub="${t}" aria-pressed="false"><span class="subi" aria-hidden="true">${ic}</span><span>${nm}</span><span class="subdot" hidden></span></button>`; }).join('');
    if(document.body.classList.contains('pch-on')){ sb.querySelectorAll('.subp').forEach((p,i)=>{ try{ if(p.animate&&!matchMedia('(prefers-reduced-motion:reduce)').matches) p.animate([{opacity:0,transform:'translateY(4px)'},{opacity:1,transform:'none'}],{duration:280,delay:Math.min(i,3)*30,easing:'ease-out',fill:'backwards'}); }catch(e){} }); } else if(typeof MOB==='function'&&MOB()){ try{ sb.animate([{opacity:.35},{opacity:1}],{duration:200,easing:'ease-out'}); }catch(e){} } /* phones (round 8 speed): the same fade without a forced layout */ else { sb.classList.remove('subin'); void sb.offsetWidth; sb.classList.add('subin'); } }
  sb.hidden=!list.length; let onP=null; sb.querySelectorAll('.subp').forEach(p=>{ const on=p.dataset.sub===S.tab; p.setAttribute('aria-pressed',on?'true':'false'); p.classList.toggle('on',on); if(on) onP=p; });
  // keep the open page's pill in view when the row scrolls sideways (small phones), without moving the page
  menuPillView(sb,onP); requestAnimationFrame(()=>menuPillView(sb,onP));
  menuBadges(); }
function menuBadges(){ const T=$('tabs'); if(!T) return;
  T.querySelectorAll('.secb').forEach(b=>{ const sec=MENU_SECS.find(s=>s.id===b.dataset.sec), n=sec.tabs.reduce((a,t)=>a+menuDot(t),0), d=b.querySelector('.secdot'); if(n){ const txt=n>99?'99+':String(n); if(d.textContent!==txt) d.textContent=txt; d.hidden=false; } else d.hidden=true; });
  T.querySelectorAll('.subp').forEach(p=>{ const n=menuDot(p.dataset.sub), d=p.querySelector('.subdot'); if(n){ d.textContent=n>99?'99+':String(n); d.hidden=false; } else d.hidden=true; }); }
// after picking a section, make sure its page is in view (on phones the section row is docked at the bottom)
function menuReveal(){ const sb=$('tabs').querySelector('.subbar'); if(!sb) return; const r=sb.getBoundingClientRect(); if(r.top<0||r.top>innerHeight*.6){ try{ sb.scrollIntoView({behavior:'smooth',block:'start'}); }catch(e){ sb.scrollIntoView(); } } }

// keep both rows in step with whatever opened a page (tab links, the gear button, saves loading, events)
const _renderPanel_035=renderPanel;
renderPanel=function(){ const r=_renderPanel_035.apply(this,arguments); try{ menuSync(); const P=$('panel'); if(P&&P.dataset.tab035!==S.tab){ P.dataset.tab035=S.tab; pageIn(P); } }catch(e){} return r; };

document.head.insertAdjacentHTML('beforeend',`<style>
/* the old grid stays in the page (hidden) so the game can keep updating it */
#tabs.secmode{display:flex!important;flex-direction:column;min-width:0;max-width:100%;box-sizing:border-box;gap:10px;padding:10px 0 8px!important;grid-template-columns:none!important;background:transparent!important}
#tabs.secmode > button[data-tab]{display:none!important}
body.side-off #tabs.secmode{display:none!important} /* phones sideways: "Hide menus" still hides everything */
#tabs.secmode .secbar{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:8px}
#tabs.secmode .secb{position:relative;display:flex;flex-direction:row;align-items:center;justify-content:center;gap:9px;min-height:52px;padding:6px 8px;border-radius:16px;border:1px solid var(--line,#26385180);background:var(--glass,#111c2e);box-shadow:var(--lit,none),0 4px 14px #02060f55;color:#a9bdd4;font-family:var(--display,inherit);font-weight:800;font-size:15px;letter-spacing:.01em;cursor:pointer;transition:background .18s,color .18s,border-color .18s,box-shadow .18s,transform .12s}
#tabs.secmode .secb:hover{color:var(--ink,#eef3f8);border-color:#5a7ea866;transform:translateY(-1px)}
#tabs.secmode .secb:active{transform:translateY(0) scale(.98)}
#tabs.secmode .secb:focus-visible,#tabs.secmode .subp:focus-visible{outline:2px solid var(--gold,#ffd36a);outline-offset:2px}
#tabs.secmode .secb .seci{display:flex;color:#7f97b2;transition:color .18s,filter .18s}
#tabs.secmode .secb:hover .seci{color:var(--kelp,#7fe3c4)}
#tabs.secmode .secb.on{background:linear-gradient(180deg,#ffe08a,#f2b84e);border-color:#ffe7a6;color:#2a1806;box-shadow:inset 0 1px 0 #fff6d6aa,0 0 0 1px #ffd36a55,0 6px 20px #02060f99,0 0 26px #ffd36a40}
#tabs.secmode .secb.on .seci{color:#3a2206;filter:drop-shadow(0 1px 0 #fff3c066)}
#tabs.secmode .secdot,#tabs.secmode .subdot{position:absolute;top:-7px;right:10px;min-width:20px;height:20px;padding:0 6px;box-sizing:border-box;border-radius:999px;background:linear-gradient(180deg,#ffb36a,#ff7a4a);color:#2a1206;font:800 12px/20px var(--display,system-ui);text-align:center;box-shadow:0 0 10px #ff8a5c88,0 2px 6px #0008}
#tabs.secmode .secb.on .secdot{box-shadow:0 0 0 2px #2a1806,0 2px 6px #0008}
#tabs.secmode .subbar{display:flex;gap:8px;overflow-x:auto;min-width:0;max-width:100%;scrollbar-width:none;padding:6px 2px 4px;-webkit-overflow-scrolling:touch}
#tabs.secmode .subbar::-webkit-scrollbar{display:none}
#tabs.secmode .subbar.more-r{-webkit-mask-image:linear-gradient(90deg,#000 85%,transparent);mask-image:linear-gradient(90deg,#000 85%,transparent)}
#tabs.secmode .subbar.more-l{-webkit-mask-image:linear-gradient(90deg,transparent,#000 15%);mask-image:linear-gradient(90deg,transparent,#000 15%)}
#tabs.secmode .subbar.more-l.more-r{-webkit-mask-image:linear-gradient(90deg,transparent,#000 12%,#000 88%,transparent);mask-image:linear-gradient(90deg,transparent,#000 12%,#000 88%,transparent)}
#tabs.secmode .subbar[hidden]{display:none}
#tabs.secmode .subp{position:relative;flex:0 0 auto;display:inline-flex;flex-direction:row;white-space:nowrap;align-items:center;gap:7px;min-height:40px;padding:0 16px;border-radius:999px;border:1px solid var(--line,#26385180);background:#111c2ecc;color:#bcd0e4;font-family:var(--display,inherit);font-weight:700;font-size:14px;cursor:pointer;transition:background .18s,color .18s,border-color .18s,box-shadow .18s}
#tabs.secmode .subp:hover{border-color:#5a7ea8aa;color:var(--ink,#eef3f8);background:#16243a}
#tabs.secmode .subp.on{border-color:var(--gold,#ffd36a);color:#fff3cf;background:linear-gradient(180deg,#2a3a56,#1c2a42);box-shadow:inset 0 1px 0 #ffffff14,0 0 0 1px #ffd36a33,0 0 16px #ffd36a26}
#tabs.secmode .subp .subi{font-size:16px;line-height:1}
#tabs.secmode .subp .subdot{position:static;margin-left:2px;min-width:18px;height:18px;font-size:11px;line-height:18px;padding:0 5px}
@media (hover:hover) and (pointer:fine){#tabs.secmode .subbar.subin .subp{animation:subin .28s ease-out both}}
#tabs.secmode .subbar.subin .subp:nth-child(2){animation-delay:.03s}#tabs.secmode .subbar.subin .subp:nth-child(3){animation-delay:.06s}#tabs.secmode .subbar.subin .subp:nth-child(4){animation-delay:.09s}
@keyframes subin{from{opacity:0;transform:translateY(4px)}to{opacity:1;transform:none}}
@media (hover:hover) and (pointer:fine){#panel.pagein{animation:pagein .22s ease-out both}} /* touch screens switch pages instantly */
@keyframes pagein{from{opacity:.35;transform:translateY(3px)}to{opacity:1;transform:none}}
#settingsbtn.menu-on{border-color:var(--gold,#ffd36a)!important;color:#fff3cf;box-shadow:var(--lit,none),0 0 0 1px #ffd36a44,0 0 16px #ffd36a33!important}
@media (prefers-reduced-motion:reduce){#tabs.secmode .subbar.subin .subp,#panel.pagein{animation:none}#tabs.secmode .secb,#tabs.secmode .secb:hover{transition:none;transform:none}}
/* narrow screens: icon over the name */
@media (max-width:860px){#tabs.secmode .secb{flex-direction:column;gap:2px;font-size:12px;min-height:54px;padding:5px 2px}#tabs.secmode .secdot{right:6px}}
/* phones held upright: the section row docks along the bottom edge, below everything else */
@media (max-width:700px) and (orientation:portrait){
  #tabs.secmode .secbar{position:fixed;left:0;right:0;bottom:0;z-index:20;gap:2px;padding:6px 6px calc(6px + env(safe-area-inset-bottom));background:linear-gradient(180deg,#0c1828,#08111d);border-top:1px solid var(--line,#26385180);box-shadow:0 -6px 18px #02060f88;transform:translateZ(0)} /* solid, no blur: a blur over the moving water costs phones every frame */
  #tabs.secmode .secb{min-height:52px;border-radius:14px;background:transparent;border-color:transparent;box-shadow:none;font-size:11px}
  #tabs.secmode .secb.on{background:linear-gradient(180deg,#ffe08a,#f2b84e);border-color:#ffe7a6}
  #tabs.secmode .secdot{top:-3px;right:calc(50% - 26px)}
  body,body.v3{padding-bottom:calc(84px + env(safe-area-inset-bottom))!important}
  .dlprev{bottom:calc(80px + env(safe-area-inset-bottom))!important}
  #tabs.secmode{padding-top:6px!important}
  #tabs.secmode .subp{min-height:38px;padding:0 13px;font-size:13px}
}
/* phones held sideways: compact rows at the top of the menu column */
@media (orientation:landscape) and (max-height:560px){
  #tabs.secmode{gap:5px;padding:2px 0 4px!important}
  #tabs.secmode .secbar{gap:4px}#tabs.secmode .secb{min-height:40px;font-size:10px;border-radius:12px;padding:3px 1px}#tabs.secmode .secb .seci svg{width:18px;height:18px}
  #tabs.secmode .secdot{top:-5px;right:4px;min-width:17px;height:17px;font-size:10px;line-height:17px}
  #tabs.secmode .subbar{padding:2px 1px 2px;gap:5px}#tabs.secmode .subp{min-height:32px;padding:0 11px;font-size:12px}#tabs.secmode .subp .subi{font-size:14px}
}
</style>`);
// scroll the pill row (not the page) so the open page's pill sits fully in view, clear of the edge fades
function menuPillView(sb,p){ if(!sb||!p) return; if(document.body.classList.contains('pch-on')&&sb.closest('#menuov')) return; /* PC: the page tabs always fit, so no measuring */ if(sb.scrollWidth>sb.clientWidth+2){ const s=sb.getBoundingClientRect(), r=p.getBoundingClientRect(), pad=34;
    if(r.right>s.right-pad) sb.scrollLeft+=r.right-(s.right-pad); else if(r.left<s.left+pad) sb.scrollLeft-=(s.left+pad)-r.left; }
  const edges=()=>{ sb.classList.toggle('more-r',sb.scrollLeft+sb.clientWidth<sb.scrollWidth-4); sb.classList.toggle('more-l',sb.scrollLeft>4); };
  edges(); requestAnimationFrame(edges); } // again next frame: the row can still change width after this (the edge fade must match the final scroll)

// ---------- the catch card on phones (upright and sideways): everything on one card, no scrolling ----------
document.head.insertAdjacentHTML('beforeend',`<style>
@media (max-width:560px), (orientation:landscape) and (max-height:560px){
  #card{position:fixed;inset:0;z-index:40;padding:12px;padding-bottom:calc(12px + env(safe-area-inset-bottom))} /* the card floats over the whole phone screen, so it always fits */
  #card #cardin{display:grid;grid-template-columns:auto minmax(0,1fr);grid-template-areas:"fish rar" "fish name" "q q" "badges badges" "nums nums" "desc desc" "tap tap";column-gap:12px;row-gap:0;align-items:center;text-align:left;padding:10px 12px 8px;border-radius:18px;overflow:hidden;width:min(400px,100%)}
  #card #cardfish{grid-area:fish;width:104px!important;height:52px!important;margin:0}
  #card #cardrar{grid-area:rar;align-self:end;font-size:11px;letter-spacing:.08em}
  #card #cardname{grid-area:name;align-self:start;font-size:19px;line-height:1.15;margin:1px 0 0;text-wrap:balance}
  #card #cardq{grid-area:q;margin:6px 0 5px}#card #cardq .btn{min-height:36px;padding:6px 10px;font-size:14px}
  #card #cardbadges{grid-area:badges;display:flex;flex-wrap:wrap;justify-content:center;gap:4px;margin:0 0 4px}#card #cardbadges .badge{font-size:11px;padding:2px 8px}
  #card #cardnums{grid-area:nums;display:grid;grid-template-columns:repeat(auto-fit,minmax(0,1fr));gap:6px;margin:4px 0 4px;text-align:center}
  #card #cardnums span{font-size:9.5px;letter-spacing:.05em}#card #cardnums b{font-size:15px;white-space:nowrap}
  #card #carddesc{grid-area:desc;text-align:center;font-size:11.5px;line-height:1.3;margin:2px 0 0;display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden}
  #card .tap{grid-area:tap;text-align:center;font-size:10.5px;margin-top:2px}
  #card #cardbadges .badge{line-height:1.35}
}
/* every size: the stage buttons (Rest, menus) step aside while a catch card is open */
body.card-open #resttog{opacity:0;pointer-events:none}
@media (max-width:560px), (orientation:landscape) and (max-height:560px){
}
</style>`);

// ---------- one tap between the water and the menus (PC and phones held upright) ----------
// Scrolled down into a menu: "Back to the water" jumps up so the water fills the view.
// At the water with the menus below the screen edge: "Menus" jumps down to the open page.
// (Phones held sideways keep their own Hide / Show menus toggle on the water's edge.)
(function(){ const b=document.createElement('button'); b.id='towater'; b.type='button'; b.hidden=true; document.body.appendChild(b); let mode='', ticking=false;
  const landSide=()=>matchMedia('(orientation:landscape) and (max-height:560px)').matches;
  function update(){ ticking=false; const st=document.querySelector('.stage'), sb=$('tabs')&&$('tabs').querySelector('.subbar'); if(!st||!sb||landSide()){ set(''); return; }
    const sr=st.getBoundingClientRect(), mr=sb.getBoundingClientRect(), barH=matchMedia('(max-width:700px) and (orientation:portrait)').matches?80:0;
    if(sr.bottom<Math.min(160,sr.height*.45)) set('up'); else if(mr.top>innerHeight-barH-30) set('down'); else set(''); }
  function set(m){ if(m===mode) return; mode=m; if(!m){ b.classList.remove('show'); setTimeout(()=>{ if(!mode) b.hidden=true; },220); return; }
    b.hidden=false; b.innerHTML=m==='up'?'<span aria-hidden="true">↑</span> Back to the water':'Menus <span aria-hidden="true">↓</span>'; b.setAttribute('aria-label',m==='up'?'Back to the water':'Go to the menus'); setTimeout(()=>b.classList.add('show'),20); }
  b.addEventListener('click',e=>{ e.stopPropagation(); const smooth=!matchMedia('(prefers-reduced-motion:reduce)').matches;
    const y=mode==='up'?0:Math.max(0,$('tabs').getBoundingClientRect().top+scrollY-8); /* the section buttons and the page */
    window.scrollTo({top:y,behavior:smooth?'smooth':'auto'});
    // safety net: if smooth scrolling is paused or interrupted, land there anyway
    setTimeout(()=>{ if(Math.abs(scrollY-y)>4) window.scrollTo(0,y); req(); },900); });
  const req=()=>{ if(!ticking){ ticking=true; setTimeout(update,60); } };
  addEventListener('scroll',req,{passive:true}); addEventListener('resize',req); setTimeout(req,600); setInterval(req,1500); })();
document.head.insertAdjacentHTML('beforeend',`<style>
#towater{position:fixed;right:16px;bottom:48px;z-index:25;display:inline-flex;align-items:center;gap:7px;min-height:42px;padding:0 16px;border-radius:999px;border:1px solid #ffd36a88;background:linear-gradient(180deg,#22385a,#162640);color:#fff3cf;font:800 14px var(--display,system-ui);cursor:pointer;box-shadow:0 8px 24px #02060fcc,0 0 18px #ffd36a2e;opacity:0;transform:translateY(10px);transition:opacity .2s,transform .2s}
#towater.show{opacity:1;transform:none}
#towater:hover{border-color:var(--gold,#ffd36a);box-shadow:0 8px 24px #02060fcc,0 0 22px #ffd36a55}
#towater:focus-visible{outline:2px solid var(--gold,#ffd36a);outline-offset:2px}
#towater span{font-size:16px;line-height:1}
@media (max-width:700px) and (orientation:portrait){#towater{left:50%;right:auto;transform:translate(-50%,10px);bottom:calc(84px + env(safe-area-inset-bottom));min-height:38px;font-size:13px;padding:0 14px}#towater.show{transform:translate(-50%,0)}}
@media (orientation:landscape) and (max-height:560px){#towater{display:none!important}}
@media (prefers-reduced-motion:reduce){#towater{transition:none}}
</style>`);

// ---------- the aquarium on phones: a wide tank like on PC, decorations sized to fit it ----------
// (decorations used to scale with the tank's height only, so a tall, narrow phone tank crammed them together)
function tankK(w,h){ return .82*Math.min(h/230, w/520); } // round 6: fish and decorations a little smaller so every piece can be seen (director)
document.head.insertAdjacentHTML('beforeend',`<style>
@media (max-width:560px){ .tank canvas{height:auto!important;aspect-ratio:16/10;max-height:46vh} }
@media (orientation:landscape) and (max-height:560px){ .tank canvas{height:auto!important;aspect-ratio:16/9;max-height:62vh} }
</style>`);
// fish rows (cooler, aquarium) in a narrow menu column (phones, the sideways menu): the buttons go on their own
// line under the fish, so the name and details never get squeezed into one word per line
document.head.insertAdjacentHTML('beforeend',`<style>
@container (max-width:620px){
  #panel .fishrow{grid-template-columns:48px minmax(0,1fr) auto;row-gap:6px}
  #panel .fishrow canvas{width:48px;height:24px}
  #panel .fishrow .acts{grid-column:1/-1;justify-content:flex-end;flex-wrap:wrap}
  #panel .fishrow .val{text-align:right}
}
</style>`);
// a cheap switch for "a catch card is open" (instead of a :has() style rule the browser keeps re-checking)
{ const _sc=showCard; showCard=function(o){ _sc(o); document.body.classList.add('card-open'); };
  const _hc=hideCard; hideCard=function(){ document.body.classList.remove('card-open'); return _hc.apply(this,arguments); }; }
