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
