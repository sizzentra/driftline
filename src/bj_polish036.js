// =====================================================================
// 0.3.6 polish pass. Every choice that changes your odds now shows its real effect at the water you are fishing,
// computed from the same weights the game uses to pick a catch (catchOdds), so a number on a card is never a guess.
// =====================================================================
function oddsHere(o){ return 'Epic or better here: <b>'+fmtOdds(o.epic)+'</b>'; }
function oddsDelta(now,then){ const d=then.epic-now.epic; if(Math.abs(d)<.0005) return '<span class="odds-same">same as now</span>';
  return '<span class="'+(d>0?'odds-up':'odds-down')+'">'+(d>0?'▲ ':'▼ ')+'from '+fmtOdds(now.epic)+'</span>'; }
// bait rows: the odds with that bait at this water, against the bait you are using now
const _baitRow_036=baitRow;
baitRow=function(e){ const html=_baitRow_036(e), k=e[0]; let line='';
  try{ const now=catchOdds(), o=catchOdds({bait:k}); line=`<div class="odds">${oddsHere(o)} ${S.baitSel===k?'<span class="odds-same">in use</span>':oddsDelta(now,o)}</div>`; }catch(err){}
  return html.replace(/<\/div>(\s*)<div class="tk-acts">/, line+'</div>$1<div class="tk-acts">'); };
// rods: every rod in the rack shows the odds it would give you here
const _renderRods_036=renderRods;
renderRods=function(P){ _renderRods_036(P); try{ const now=catchOdds(), byName={}; RODS.forEach(r=>byName[r.name]=r);
  P.querySelectorAll('.grid .tile').forEach(t=>{ const h=t.querySelector('h4'), r=h&&byName[h.textContent.trim()]; if(!r) return; const o=catchOdds({rod:r.id});
    const here=S.rods&&S.rods.eq===r.id; const d=document.createElement('div'); d.className='odds'; d.innerHTML=oddsHere(o)+' '+(here?'<span class="odds-same">equipped</span>':oddsDelta(now,o)); const btn=t.querySelector('button,.meta:last-child'); t.insertBefore(d, t.querySelector('button')||null); }); }catch(err){} };
// skills: Lucky Charm shows what its next rank does at this water
const _renderSkills2_036=renderSkills2;
renderSkills2=function(P){ _renderSkills2_036(P); try{ const h=[...P.querySelectorAll('h4')].find(x=>x.textContent.trim()==='Lucky Charm'); if(!h) return; const tile=h.closest('.tile')||h.parentElement; const r=pr('lucky');
  const now=catchOdds(), d=document.createElement('div'); d.className='odds';
  d.innerHTML = r>=10 ? oddsHere(now)+' <span class="odds-same">fully learned</span>' : (()=>{ const o=catchOdds({lucky:r+1}); return 'Next rank here: epic or better <b>'+fmtOdds(o.epic)+'</b> '+oddsDelta(now,o); })();
  const btn=[...tile.querySelectorAll('button')].pop(); tile.insertBefore(d, btn||null); }catch(err){} };
document.head.insertAdjacentHTML('beforeend',`<style>
#panel .odds{font-size:12.5px;color:var(--muted,#9fb2c8);margin-top:6px;line-height:1.35}
#panel .odds b{color:#e9d8ff;font-variant-numeric:tabular-nums}
#panel .odds .odds-up{color:var(--kelp,#7fe3c4);font-weight:700;margin-left:4px;white-space:nowrap}
#panel .odds .odds-down{color:#ff9a8a;font-weight:700;margin-left:4px;white-space:nowrap}
#panel .odds .odds-same{color:var(--muted,#9fb2c8);margin-left:4px;white-space:nowrap}
</style>`);

// ---------------------------------------------------------------------
// PC: one screen, like phones. The water, the section bar and the page share the window; only the page scrolls, so a
// page is visible the moment you open it (at 1280x800 it used to start below the fold and every visit needed a page
// scroll). Full screen and phones keep their own layouts. The water gives up a little height to make room.
// ---------------------------------------------------------------------
const PC_APP=()=>!document.body.classList.contains('phone-app')&&!document.body.classList.contains('phone-land')&&innerWidth>=760&&innerHeight>=560&&!document.fullscreenElement&&!window.__noPcApp;
function pcFit(){ const w=document.querySelector('.wrap'); if(!w) return; if(!document.body.classList.contains('pc-app')){ w.style.height=''; return; }
  const top=w.getBoundingClientRect().top+(window.scrollY||0); w.style.height=Math.max(420,Math.round(innerHeight-top-10))+'px'; }
(function(){ let on=null; const apply=()=>{ const v=PC_APP(); if(v!==on){ on=v; document.body.classList.toggle('pc-app',v); document.documentElement.classList.toggle('pc-app',v); if(v) window.scrollTo(0,0); }
    pcFit(); try{ resize(); }catch(e){} };
  addEventListener('resize',apply); document.addEventListener('fullscreenchange',()=>setTimeout(apply,80)); setTimeout(apply,0); })();
const _stageHOverride_036=stageHOverride;
stageHOverride=function(W,H){ const o=_stageHOverride_036(W,H); if(o) return o; if(!document.body.classList.contains('pc-app')) return 0;
  return Math.max(260,Math.min(Math.round(W*.5),Math.round(innerHeight*.38))); };
{ let lastTab=null; const _rp=renderPanel; renderPanel=function(){ const P=$('panel'), same=S.tab===lastTab, keep=P?P.scrollTop:0; const r=_rp.apply(this,arguments); try{ if(document.body.classList.contains('pc-app')&&P) P.scrollTop=same?keep:0; }catch(e){} lastTab=S.tab; return r; }; }
document.head.insertAdjacentHTML('beforeend',`<style>
html.pc-app{overflow:hidden;height:100%}
body.pc-app{overflow:hidden;height:100vh;overscroll-behavior:none}
body.pc-app .wrap{display:flex;flex-direction:column;overflow:hidden}
body.pc-app .wrap > *{flex:0 0 auto}
body.pc-app #panel{flex:1 1 auto;min-height:0;overflow-y:auto;overflow-x:hidden;overscroll-behavior:contain;scrollbar-width:thin;scrollbar-color:#3a5070 transparent;padding:2px 6px 16px 2px}
body.pc-app #panel::-webkit-scrollbar{width:8px} body.pc-app #panel::-webkit-scrollbar-thumb{background:#3a5070;border-radius:8px}
</style>`);
// Wide PC screens: the page sits in its own full-height column beside the water instead of under it, so it always has
// room (at 1280x800 the stacked layout left it about 125 px). The section bar sits at the top of that column.
const PC_WIDE=()=>document.body.classList.contains('pc-app')&&innerWidth>=980&&innerWidth/innerHeight>=1.2;
(function(){ const apply=()=>{ const v=PC_WIDE(); if(document.body.classList.contains('pc-wide')!==v){ document.body.classList.toggle('pc-wide',v); try{ resize(); }catch(e){} } };
  addEventListener('resize',()=>setTimeout(apply,0)); document.addEventListener('fullscreenchange',()=>setTimeout(apply,120)); setTimeout(apply,30); })();
const _stageHOverride_036b=stageHOverride;
stageHOverride=function(W,H){ if(document.body.classList.contains('pc-wide')){ const hud=document.querySelector('.hud'), top=hud?hud.getBoundingClientRect().bottom:60; return Math.max(300,Math.min(Math.round(W*.52),Math.round(innerHeight-top-56))); } return _stageHOverride_036b(W,H); };
document.head.insertAdjacentHTML('beforeend',`<style>
body.pc-wide .wrap{display:grid;grid-template-columns:minmax(0,1fr) clamp(380px,32vw,540px);grid-template-rows:auto auto minmax(0,1fr) auto;column-gap:14px;row-gap:8px;max-width:none}
body.pc-wide .wrap > .hud{grid-column:1 / -1;grid-row:1}
body.pc-wide .wrap > #stage{grid-column:1;grid-row:2 / 4;align-self:start}
body.pc-wide .wrap > #hint{grid-column:1;grid-row:4;margin:0}
body.pc-wide .wrap > #tabs{grid-column:2;grid-row:2;margin:0}
body.pc-wide .wrap > #panel{grid-column:2;grid-row:3 / 5;margin:0;border-radius:16px}
body.pc-wide #tabs.secmode .secbar{gap:4px}
body.pc-wide #tabs.secmode .secb{flex-direction:column;gap:2px;font-size:12px;min-height:52px;padding:5px 2px}
body.pc-wide #tabs.secmode .secdot{right:4px}
</style>`);
// in the wide layout the tip line sits on the water (as on phones), and the water is a little taller to fill its column
(function(){ const hint=$('hint'), stage=$('stage'); if(!hint||!stage) return; const home=hint.parentElement; let placed=false;
  const apply=()=>{ const wide=document.body.classList.contains('pc-wide'); if(wide&&!placed){ stage.appendChild(hint); placed=true; } else if(!wide&&placed&&!document.body.classList.contains('phone-app')){ const tabs=$('tabs'); home.insertBefore(hint,tabs); placed=false; } };
  addEventListener('resize',()=>setTimeout(apply,10)); setTimeout(apply,60); })();
const _stageHOverride_036c=stageHOverride;
stageHOverride=function(W,H){ if(document.body.classList.contains('pc-wide')){ const hud=document.querySelector('.hud'), top=hud?hud.getBoundingClientRect().bottom:60; return Math.max(300,Math.min(Math.round(W*1.15),Math.round(innerHeight-top-22))); } return _stageHOverride_036c(W,H); };
document.head.insertAdjacentHTML('beforeend',`<style>
body.pc-wide #stage{position:relative}
body.pc-wide #stage > #hint{position:absolute;left:50%;bottom:16px;transform:translateX(-50%);z-index:3;margin:0;max-width:calc(100% - 200px);width:max-content;padding:5px 12px;border-radius:12px;background:#0a1220b8;border:1px solid #ffffff1a;color:#dbe7f3;font-size:12.5px;line-height:1.35;text-align:center;pointer-events:none}
body.pc-wide #stage > #hint:empty{display:none}
body.pc-wide .wrap{grid-template-rows:auto auto minmax(0,1fr)}
body.pc-wide .wrap > #stage{grid-row:2 / 4}
body.pc-wide .wrap > #panel{grid-row:3}
</style>`);

// ---------------------------------------------------------------------
// Next goal: one quiet line on the water that always says what to do next and how close you are, and opens the right
// page when tapped. It follows the game's own rules (species found at the last water, then coins, then open it), so a
// new player knows where they are going without a tutorial.
// ---------------------------------------------------------------------
function nextGoal(){ if(!S.stats.caught) return {t:'Catch your first fish', sub:'Hold on the water, let go to cast', tab:null};
  const i=LOCS.findIndex(L=>!S.unlocked.includes(L.id));
  if(i>0){ const L=LOCS[i], prev=LOCS[i-1], have=caughtAt(prev.id), cost=locCost(L);
    if(have<L.need) return {t:'Find '+L.need+' species at '+prev.name, sub:have+' / '+L.need+' found, then '+fmtShort(cost)+' coins opens '+L.name, p:have/L.need, tab:'journal'};
    if(S.money<cost) return {t:'Save '+fmtShort(cost)+' coins for '+L.name, sub:fmtShort(S.money)+' / '+fmtShort(cost), p:S.money/cost, tab:'map'};
    return {t:L.name+' is ready to open', sub:'Tap to go to Waters', p:1, tab:'map', ready:true}; }
  const here=SP.filter(s=>s.loc===S.loc), got=here.filter(s=>S.journal[s.id]).length;
  if(got<here.length) return {t:'Fish Log: '+curLoc().name, sub:got+' / '+here.length+' species found here', p:got/here.length, tab:'journal'};
  const all=SP.filter(s=>S.journal[s.id]).length; return {t:'Every species here found', sub:all+' / '+SP.length+' in the Fish Log', p:all/SP.length, tab:'journal'}; }
(function(){ const stage=$('stage'); if(!stage) return; const el=document.createElement('button'); el.id='goalchip'; el.type='button'; stage.appendChild(el);
  el.addEventListener('pointerdown',e=>e.stopPropagation()); el.addEventListener('click',e=>{ e.stopPropagation(); const gl=nextGoal(); if(!gl.tab) return; setTab(gl.tab); try{ menuSync(); }catch(er){} const P=$('panel'); if(P&&!document.body.classList.contains('pc-app')&&!document.body.classList.contains('phone-app')) P.scrollIntoView({behavior:'smooth',block:'start'}); });
  let last=''; const tick=()=>{ const show=['idle','waiting','result','rest'].includes(G.st)&&!S.settings.hideGoal; let html='';
    if(show){ const gl=nextGoal(); html=`<span class="gl-k">${gl.ready?'Ready':'Next goal'}</span><span class="gl-t">${esc(gl.t)}</span><span class="gl-s">${esc(gl.sub)}</span>${gl.p!=null?`<i class="gl-bar"><b style="width:${Math.round(clamp(gl.p,0,1)*100)}%"></b></i>`:''}`; el.classList.toggle('ready',!!gl.ready); el.title=gl.tab?'Open the page for this goal':''; }
    if(html!==last){ last=html; el.innerHTML=html; el.hidden=!html; } };
  setInterval(tick,700); tick(); })();

// ---------------------------------------------------------------------
// Top bar: only what you check constantly (coins, level, water, cooler, boosts, bait). The clock and weather move onto
// the water as one chip with what the weather actually does, on every screen (it was cut off on mid-size PCs).
// ---------------------------------------------------------------------
const WX_TAG={Rain:'bites +35%', Storm:'rarer fish', Fog:'night fish', Gilded:'shiny ×3', Rainbow:'shiny ×2, XP +30%', Aurora:'XP ×2', 'Spawning Run':'bites ×2.5'};
drawSceneChip=function(p,wx){ const tag=WX_TAG[wx.k]; const txt=tod(p)+' · '+wxName(wx.k)+(tag?' ('+tag+')':'')+' · '+mmss(wxLeft()); const big=W>=700; g.font='700 '+(big?12:11)+'px system-ui'; const tw=g.measureText(txt).width, h=big?22:20;
  g.fillStyle='rgba(5,14,20,.62)'; rr(10,10,tw+(big?20:16),h,h/2); g.fill(); g.fillStyle=wx.k==='Gilded'?'#ffc94d':tag?'#bfe8ff':'#e6efe8'; g.textAlign='left'; g.fillText(txt,big?20:18,big?25:24); };
document.head.insertAdjacentHTML('beforeend',`<style>
.hud .stat.opt,.hud #wxchip{display:none!important}
#goalchip{position:absolute;left:10px;top:38px;z-index:4;display:grid;grid-template-columns:auto;gap:1px;max-width:min(340px,calc(100% - 20px));padding:6px 11px 7px;border-radius:12px;border:1px solid #ffffff1c;background:#08121ed0;color:#e6efe8;text-align:left;font:inherit;cursor:pointer;box-shadow:0 4px 14px #0006;-webkit-backdrop-filter:blur(4px);backdrop-filter:blur(4px)}
#goalchip[hidden]{display:none}
#goalchip:hover{border-color:#ffd36a66}
#goalchip .gl-k{font-size:9.5px;font-weight:800;letter-spacing:.09em;text-transform:uppercase;color:#9fb2c8}
#goalchip .gl-t{font-size:13px;font-weight:800;color:#fff;line-height:1.25}
#goalchip .gl-s{font-size:11.5px;color:#b8c8d8;line-height:1.3}
#goalchip .gl-bar{display:block;height:4px;border-radius:4px;background:#ffffff1a;margin-top:4px;overflow:hidden}
#goalchip .gl-bar b{display:block;height:100%;border-radius:4px;background:linear-gradient(90deg,#7fe3c4,#ffd36a)}
#goalchip.ready{border-color:#ffd36aaa;box-shadow:0 0 0 1px #ffd36a55,0 0 18px #ffd36a33}
#goalchip.ready .gl-k{color:#ffd36a}
@media (max-width:520px),(max-height:520px){ #goalchip{top:34px;padding:4px 9px 5px;max-width:calc(100% - 130px)} #goalchip .gl-k{font-size:8.5px} #goalchip .gl-t{font-size:11.5px} #goalchip .gl-s{display:none} #goalchip .gl-bar{margin-top:3px;height:3px} }
</style>`);

// ---------------------------------------------------------------------
// Saving: also when the page is hidden or closed (phones put tabs to sleep and iOS may discard them), so nothing done
// since the last save is ever lost
// ---------------------------------------------------------------------
document.addEventListener('visibilitychange',()=>{ if(document.visibilityState==='hidden'){ try{ save(); }catch(e){} } });
addEventListener('pagehide',()=>{ try{ save(); }catch(e){} });
// narrower PC windows stack the water over the page: a compact section bar leaves the page more room
document.head.insertAdjacentHTML('beforeend',`<style>
body.pc-app:not(.pc-wide) #tabs.secmode .secb{min-height:42px;padding:4px 8px;font-size:13px}
body.pc-app:not(.pc-wide) #tabs.secmode .subp{min-height:34px}
body.pc-app:not(.pc-wide) #hint{margin:2px 0}
</style>`);

// ---------------------------------------------------------------------
// PC: hide the menus (the same switch phones use, remembered on this device). The handle on the water's right edge, or
// the M key, collapses the page column so the water fills the window, and brings it back.
// ---------------------------------------------------------------------
const _stageHOverride_036d=stageHOverride;
stageHOverride=function(W,H){ const b=document.body.classList; if(b.contains('pc-app')&&b.contains('side-off')){ const hud=document.querySelector('.hud'), top=hud?hud.getBoundingClientRect().bottom:60; return Math.max(300,Math.min(Math.round(W*.62),Math.round(innerHeight-top-22))); } return _stageHOverride_036d(W,H); };
addEventListener('keydown',e=>{ if(e.key!=='m'&&e.key!=='M'||e.ctrlKey||e.metaKey||e.altKey) return; const t=(document.activeElement&&document.activeElement.tagName)||''; if(/INPUT|TEXTAREA|SELECT/.test(t)) return; if(!document.body.classList.contains('pc-app')) return; const b=$('sidetog'); if(b){ e.preventDefault(); b.click(); } });
(function(){ const b=$('sidetog'); if(b) b.addEventListener('click',()=>setTimeout(()=>{ try{ pcFit(); resize(); }catch(e){} },60)); })();
document.head.insertAdjacentHTML('beforeend',`<style>
body.pc-app .sidetog{display:flex!important;position:absolute;right:8px;top:50%;transform:translateY(-50%);width:28px;height:64px;border-radius:10px;align-items:center;justify-content:center;background:#08121ec8;border:1px solid #ffffff22;color:#e6efe8;font-size:20px;font-weight:800;z-index:5;cursor:pointer;box-shadow:0 4px 14px #0006}
body.pc-app .sidetog:hover{border-color:#ffd36a88;color:#ffd36a}
body.pc-app.side-off #tabs,body.pc-app.side-off #panel{display:none!important}
body.pc-wide.side-off .wrap{grid-template-columns:minmax(0,1fr)}
body.pc-wide.side-off .wrap > #stage{grid-column:1 / -1}
</style>`);

// ---------------------------------------------------------------------
// "Where is that?" Every page says where you are; the search opens on a map of every page with what it is for; badges
// say what is waiting; and search knows the newer things.
// ---------------------------------------------------------------------
const PAGE_DESC={cooler:'Fish you are carrying: sell them or keep them', map:'Travel between waters, and set sail again', bounties:'Paid jobs for specific catches, and your daily reward', events:'Challenges, the event calendar and the derby',
  shop:'Line, reel and other gear, bait and special lures', rods:'Your rods, upgrades and attachments', skills:'Spend skill points on small steady gains', paths:'Big choices that shape your style',
  aquarium:'Fish that earn coins and boosts while you play', trophy:'Fish you keep forever', journal:'Every species and oddity, found and missing', feats:'Goals with rewards',
  home:'Your dock and its decorations', pets:'Your companions, new pets and their looks', style:'Your angler: body, clothes and accessories', pass:'Levels and rewards from fishing', games:'Mini-games, prizes and tickets',
  settings:'Sound, controls, display, patch notes and saves', stats:'Every number in the game, and your odds', save:'Move your progress to another device'};
SEARCH_IDX.push(
 ['Events: challenges','events',null,'challenge rare run mixed bag long cast steady hands treasure dive weigh in trophy'],
 ['Events: calendar','events',null,'calendar schedule shoal run golden hour market rush live next'],
 ['Daily reward','bounties',null,'daily login gift reward streak'],
 ['Fish odds','shop',['tackleview','bait'],'odds chance epic rare legendary percent bait best'],
 ['Hide menus','settings',null,'hide menus collapse full water bigger screen'],
 ['Keyboard shortcuts','settings',null,'keyboard shortcuts keys hotkeys help']);
// a breadcrumb at the top of every page
(function(){ const _rp=renderPanel; renderPanel=function(){ const r=_rp.apply(this,arguments); try{ const P=$('panel'), t=S.tab, sec=menuSecOf(t); if(P&&sec&&!P.querySelector(':scope > .crumb')){ const lab=menuTabLabel(t)[1]; const d=document.createElement('div'); d.className='crumb'; d.innerHTML=`<span>${esc(sec.name==='More'?'Settings':sec.name)}</span><b>${esc(lab)}</b>`; P.prepend(d); } }catch(e){} return r; }; })();
// the search opens on a map of every page, grouped by section
(function(){ const res=$('searchres'), q=$('searchq'); if(!res||!q) return; const ov=$('searchov');
  const map=()=>{ if(q.value.trim()) return; const secs=MENU_SECS.concat([{id:'more',name:'Settings',tabs:MENU_MORE.tabs}]);
    res.innerHTML='<div class="sv-map">'+secs.map(s=>`<div class="sv-sec"><div class="sv-sec-h">${esc(s.name)}</div>${s.tabs.filter(t=>t==='settings'||menuTabBtn(t)||t==='stats'||t==='save').map(t=>`<button type="button" class="sv-r sv-p" data-tab="${t}"><b>${esc(menuTabLabel(t)[1]||t)}</b><span class="meta">${esc(PAGE_DESC[t]||'')}</span></button>`).join('')}</div>`).join('')+'</div>'; };
  new MutationObserver(()=>{ if(!ov.hidden&&!q.value.trim()&&!res.querySelector('.sv-map')) map(); }).observe(res,{childList:true});
  res.addEventListener('click',e=>{ const b=e.target.closest('.sv-p'); if(!b) return; e.stopPropagation(); ov.hidden=true; setTab(b.dataset.tab); try{ menuSync(); }catch(er){} },true);
  q.placeholder='Search, or pick a page below'; })();
// badges say what is waiting
setInterval(()=>{ const T=$('tabs'); if(!T) return; T.querySelectorAll('.secb').forEach(b=>{ const sec=MENU_SECS.find(s=>s.id===b.dataset.sec); if(!sec) return; const parts=sec.tabs.map(t=>[t,menuDot(t)]).filter(x=>x[1]).map(([t,n])=>n+' in '+menuTabLabel(t)[1]);
    const tip=parts.length?sec.name+': '+parts.join(', '):sec.name; if(b.title!==tip) b.title=tip; });
  T.querySelectorAll('.subp').forEach(p=>{ const t=p.dataset.sub, n=menuDot(t), tip=(menuTabLabel(t)[1]||'')+(PAGE_DESC[t]?': '+PAGE_DESC[t]:'')+(n?' ('+n+' waiting)':''); if(p.title!==tip) p.title=tip; }); },1500);
document.head.insertAdjacentHTML('beforeend',`<style>
#panel > .crumb{display:flex;align-items:center;gap:6px;font:800 10.5px var(--display,system-ui);letter-spacing:.09em;text-transform:uppercase;color:#7f97b2;margin:2px 0 4px}
#panel > .crumb b{color:#cfdcea;font-weight:800}
#panel > .crumb span::after{content:"›";margin-left:6px;color:#55708f}
#searchres .sv-map{display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:10px 14px;max-height:min(60vh,520px);overflow:auto;padding:2px}
#searchres .sv-sec-h{font:800 10.5px var(--display,system-ui);letter-spacing:.09em;text-transform:uppercase;color:#97abc2;margin:2px 0 4px}
#searchres .sv-p{display:flex;flex-direction:column;align-items:flex-start;gap:1px;width:100%;text-align:left}
#searchres .sv-p .meta{font-size:11.5px;line-height:1.3}
</style>`);

// ---------------------------------------------------------------------
// Quality of life
// ---------------------------------------------------------------------
// 1) Bait restocks itself (one pack) when it runs out, if you can afford it. Switch it on or off on the Tackle page.
const _hookIt_04=hookIt;
hookIt=function(){ const sel=S.baitSel; _hookIt_04.apply(this,arguments);
  try{ const b=BAIT[sel]; if(sel!=='worm'&&S.settings.autoBait&&S.bait[sel]===0&&b&&!b.junk&&b.price>0&&S.money>=b.price){ S.money-=b.price; S.bait[sel]+=b.pack; S.baitSel=sel; renderBait(); save(); setTimeout(()=>toast('Restocked '+b.name+': '+b.pack+' more for '+fmtShort(b.price)+' coins.'),700); } }catch(e){} };
const _renderShop_04=renderShop;
renderShop=function(P){ _renderShop_04(P); try{ const cur=P.querySelector('.tk-cur'); if(!cur) return; const on=!!S.settings.autoBait; const b=document.createElement('button'); b.className='btn alt sm'; b.dataset.act='autobait'; b.setAttribute('aria-pressed',on); b.title='When your bait runs out, buy one more pack automatically if you have the coins'; b.textContent=on?'Auto-restock: on':'Auto-restock: off'; b.style.marginLeft='auto'; cur.appendChild(b); }catch(e){} };
const _extraAct2_qol=extraAct2;
extraAct2=function(b){ if(b.dataset.act==='autobait'){ S.settings.autoBait=!S.settings.autoBait; save(); toast(S.settings.autoBait?'Bait will restock itself when it runs out (if you have the coins).':'Bait restocking is off.'); return 'render'; } return _extraAct2_qol(b); };
// 2) A full cooler shows on the water before you try to cast
const _nextGoal_qol=nextGoal;
nextGoal=function(){ if(S.cooler&&S.cooler.length>=gv('cooler')&&!S.chal) return {t:'Your cooler is full', sub:'Tap to sell or keep your catch', p:1, tab:'cooler', ready:true}; return _nextGoal_qol(); };
// 3) Keyboard shortcuts on PC: 1-5 sections, [ ] previous and next page, M hide menus, / search, Esc closes, ? shows them
const KEYS=[['1 - 5','Open a section (Fishing, Gear, Collection, Home, Rewards)'],['[  ]','Previous / next page in the section'],['Space','Cast and reel (hold)'],['M','Hide or show the menus'],['/','Search, or browse every page'],['Esc','Close a card or the search'],['?','Show these shortcuts']];
function showKeys(){ if(G.st!=='idle'&&G.st!=='waiting') return; G.st='event'; $('evin').innerHTML=`<div class="rar" style="color:var(--gold)">Keyboard</div><h3>Shortcuts</h3><div class="list keys">${KEYS.map(k=>`<div class="row spread prize"><kbd>${k[0]}</kbd><span>${k[1]}</span></div>`).join('')}</div><button class="btn" data-ev="skip">Got it</button>`; $('evcard').hidden=false; }
SEARCH_IDX.forEach((e,i)=>{ if(e[0]==='Keyboard shortcuts') SEARCH_IDX[i]=['Keyboard shortcuts','__keys',null,'keyboard shortcuts keys hotkeys help']; });
{ const _sg=searchGo; searchGo=function(e){ if(e&&e[1]==='__keys'){ showKeys(); return; } return _sg.apply(this,arguments); }; }
addEventListener('keydown',e=>{ if(e.ctrlKey||e.metaKey||e.altKey) return; const tag=(document.activeElement&&document.activeElement.tagName)||''; if(/INPUT|TEXTAREA|SELECT/.test(tag)) return;
  const sov=$('searchov'); if(sov&&!sov.hidden) return;
  if(e.key==='Escape'){ const card=$('card'); if(card&&!card.hidden&&G.st==='result'){ hideCard(); e.preventDefault(); return; }
    const ev=$('evcard'); if(ev&&!ev.hidden){ const btns=ev.querySelectorAll('button'), skip=ev.querySelector('[data-ev="skip"]'); if(skip&&btns.length===1){ skip.click(); e.preventDefault(); } } return; }
  if(e.key==='?'){ e.preventDefault(); showKeys(); return; }
  if(/^[1-5]$/.test(e.key)){ const b=document.querySelectorAll('#tabs .secb')[+e.key-1]; if(b){ e.preventDefault(); b.click(); } return; }
  if(e.key==='['||e.key===']'){ const ps=[...document.querySelectorAll('#tabs .subbar .subp')]; if(!ps.length) return; const i=ps.findIndex(p=>p.dataset.sub===S.tab); const n=ps[(i+(e.key===']'?1:ps.length-1))%ps.length]; if(n){ e.preventDefault(); n.click(); } } });
document.head.insertAdjacentHTML('beforeend',`<style>
#evin .keys kbd{display:inline-block;min-width:54px;text-align:center;padding:2px 8px;border-radius:7px;background:#ffffff14;border:1px solid #ffffff2a;border-bottom-width:2px;font:800 12px ui-monospace,Consolas,monospace;color:#fff}
#evin .keys .prize{gap:12px;align-items:center}
#evin .keys .prize span{flex:1;text-align:left;color:#cfdcea}
</style>`);
