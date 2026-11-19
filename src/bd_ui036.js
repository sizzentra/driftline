// =====================================================================
// 0.3.6 UI clarity (research-led: visible navigation, labels above controls, 44pt touch targets, findability):
//  - every page title matches its name in the menu
//  - filter rows and dropdowns get a clear title above them
//  - the Cooler's sell filter becomes labelled fields
//  - bigger tap targets on touch screens
//  - a menu search in the top bar: type "bait", "relics", "hats"... and jump straight there
// =====================================================================
const PAGE_TITLE={shop:'Tackle',journal:'Fish Log',games:'Boardwalk',save:'Save'};
const CHIP_LABEL={bounties:'Water',journal:'Water',aquarium:'Show decorations that give',pets:'Show pets that boost'};
function uiTidy(P){ if(!P) return; const t=S.tab;
  // titles that match the menu
  const h=P.querySelector('h2'); if(h&&PAGE_TITLE[t]&&h.textContent.trim()!==PAGE_TITLE[t]) h.textContent=PAGE_TITLE[t];
  // a title above the page's first untitled filter row
  if(CHIP_LABEL[t]){ const titled=c=>{ const p=c.previousElementSibling; return p&&(/H4|H5|LABEL/.test(p.tagName)||p.classList.contains('ctl-l')); }; const row=[...P.querySelectorAll('.chips')].find(c=>!titled(c)&&(t!=='aquarium'||/Any bonus/.test(c.textContent))&&(t!=='pets'||/^All/.test(c.textContent.trim()))); if(row&&!(row.previousElementSibling&&row.previousElementSibling.classList.contains('ctl-l'))){ const pv=row.previousElementSibling; if(!(pv&&/H4|H5|LABEL/.test(pv.tagName))) row.insertAdjacentHTML('beforebegin',`<div class="ctl-l">${CHIP_LABEL[t]}</div>`); } }
  // the Cooler's sell filter: labelled fields
  if(t==='cooler'){ const f=P.querySelector('.sellf'); if(f&&!f.classList.contains('lab')){ f.classList.add('lab'); const s=f.querySelector(':scope > .meta'); if(s) s.remove();
      const wrap=(el,l)=>{ if(!el) return; const d=document.createElement('div'); d.className='fld'; d.innerHTML=`<span class="fld-l">${l}</span>`; el.parentNode.insertBefore(d,el); d.appendChild(el); };
      wrap(f.querySelector('[data-sf="sellR"]'),'Rarity'); const pr=f.querySelector('.sellp'); if(pr){ const sp=pr.querySelector('span'); if(sp) sp.remove(); wrap(pr,'Price under'); const x=f.querySelector('[data-spclear]'); if(x) pr.parentNode.appendChild(x); }
      wrap(f.querySelector('[data-ssh]'),'Shinies');
      f.insertAdjacentHTML('afterbegin','<div class="fld-title">Sell all: what to sell</div>'); } }
  // any text box without a name gets one read out by screen readers and shown as a title
  P.querySelectorAll('input[type=text]:not([aria-label]):not([id])').forEach(i=>{ if(!i.closest('label')&&!(i.previousElementSibling&&/LABEL|SPAN|B/.test(i.previousElementSibling.tagName))) i.setAttribute('aria-label',i.placeholder||'Text'); }); }
{ const _rp=renderPanel; renderPanel=function(){ const r=_rp.apply(this,arguments); try{ uiTidy($('panel')); }catch(e){} return r; }; }

// ---------- menu search ----------
const SEARCH_IDX=[
 ['Cooler','cooler',null,'fish sell sell all filter shiny price cooler space'],
 ['Waters','map','Waters','travel water unlock location pond river coast frost reef shelf deep trench ember starfall map'],
 ['Set sail again (voyages)','map','Set sail again','voyage prestige pearls wisdom legacy milestones start over retire'],
 ['Pearl relics','map','Pearl relics','relic pearls permanent bonus'],
 ['Bounties','bounties',null,'bounty harbourmaster daily tasks reward login streak weekly quests week crate'],
 ['Events','events',null,'derby frenzy event medals challenges calendar weather forecast rain storm aurora'],
 ['Tackle: gear','shop',['tackleview','gear'],'line reel cooler upgrade rod length hook finder tackle buy'],
 ['Tackle: bait','shop',['tackleview','bait'],'bait worms lures glow chum shrimp buy'],
 ['Tackle: special lures','shop',['tackleview','lures'],'special lures junk lures magnet golden disco'],
 ['Rods: your rods','rods','Your rods','rod equip upgrade presets'],
 ['Rods: rod rack','rods','Rod rack','rods collection buy rod'],
 ['Rods: attachments','rods','Attachments','attachments slots rod parts'],
 ['Skills','skills',null,'skill points perks talents level'],
 ['Paths','paths',null,'path specialisation specialization choose style'],
 ['Aquarium: your tank','aquarium','Your tank','aquarium tank income collect feed boosts'],
 ['Aquarium: decorate','aquarium','Decorate','aquarium decorations theme sand decor'],
 ['Trophy Room','trophy',null,'trophy room keep mount museum forever collection storage'],
 ['Fish Log','journal',null,'fish log encyclopedia species oddities junk collection missing'],
 ['Feats','feats',null,'feats achievements goals'],
 ['Home: dock','home','Dock','home dock style wood'],
 ['Home: decorations','home','Decorations','home dock decorations furniture cozy'],
 ['Pets: your pets','pets','Your pets','pets companion favourite'],
 ['Pets: find more','pets','Find more','pets adopt buy new pets'],
 ['Pets: customize','pets','Customize','pet name colour hat customize'],
 ['Wardrobe: body','style',['wsec','body'],'wardrobe body skin hair build face beard'],
 ['Wardrobe: clothes','style',['wsec','clothes'],'clothes shirt jacket outfit colour pattern'],
 ['Wardrobe: hats','style',['wsec','hats'],'hats cap hat'],
 ['Wardrobe: glasses','style',['wsec','glasses'],'glasses sunglasses'],
 ['Wardrobe: shoes','style',['wsec','shoes'],'shoes boots'],
 ['Wardrobe: neck & back','style',['wsec','neckback'],'scarf cape backpack neck back'],
 ['Wardrobe: shop','style',['wsec','shop'],'clothes shop buy outfit'],
 ['Tide Pass','pass',null,'tide pass levels rewards claim'],
 ['Boardwalk: games','games',['bwview','games'],'boardwalk wheel spin scratch duck higher lower claw mini games tickets'],
 ['Boardwalk: prize counter','games',['bwview','prizes'],'prizes tickets counter hats pet colours cosmetics'],
 ['Boardwalk: counter specials','games',['bwview','specials'],'specials boardwalk only wear clothes shoes neckwear outfit costume tickets'],
 ['Settings: sound','settings','Sound','sound music volume ambient'],
 ['Settings: controls','settings','Controls','controls cast aim keyboard'],
 ['Settings: display','settings','Display','display effects motion full screen'],
 ['Settings: weights (kg or lb)','settings','Display','weight weights units kg kilograms lb pounds metric imperial'],
 ['Settings: rod hand (left or right)','settings','Display','left handed right handed lefty hand rod reel'],
 ['Settings: gameplay','settings','Gameplay','gameplay protect rare fish minigames'],
 ['Settings: patch notes','settings','Patch notes','patch notes updates whats new changes'],
 ['Settings: save & codes','settings','Save & codes','save code backup restore erase'],
 ['Stats','stats',null,'stats numbers odds income'],
 ['Angler strength (heavy fish)','stats',null,'angler strength heavy fish line strong weak pull'],
 ['Fish Nibbles (scrap and feed)','cooler',null,'nibbles nibble scrap candy feed level up upgrade favourite fish aquarium'],
 ['Save: move to another device','save','Move to another device','transfer phone pc move progress code'],
];
function searchGo(e){ const [,tab,sect]=e; if(S.tab!==tab){ setTab(tab); save(); } const P=$('panel');
  setTimeout(()=>{ if(Array.isArray(sect)){ const b=P.querySelector(`[data-act="${sect[0]}"][data-k="${sect[1]}"]`); if(b&&b.getAttribute('aria-selected')!=='true'&&b.getAttribute('aria-pressed')!=='true') b.click(); }
    else if(sect){ const b=[...P.querySelectorAll('[data-sect]')].find(x=>x.dataset.sect===sect||x.dataset.sect.startsWith(sect)); if(b) b.click(); }
    try{ if(document.body.classList.contains('phone-app')) P.scrollTop=0; else $('tabs').scrollIntoView({behavior:'smooth',block:'start'}); }catch(er){} },30); }
function searchFind(q){ q=q.toLowerCase().trim(); if(!q) return SEARCH_IDX.slice(0,8); const words=q.split(/\s+/);
  return SEARCH_IDX.map(e=>{ const tw=e[0].toLowerCase().split(/[^a-z0-9]+/), hw=(e[0]+' '+e[3]).toLowerCase().split(/[^a-z0-9]+/); let s=0; for(const w of words){ if(tw.some(x=>x.startsWith(w))) s+=3; else if(hw.some(x=>x.startsWith(w))) s+=1; else return null; } return [s,e]; }).filter(Boolean).sort((a,b)=>b[0]-a[0]).slice(0,8).map(x=>x[1]); }
(function(){ const sb=$('settingsbtn'); if(!sb||$('searchbtn')) return;
  const box=document.createElement('div'); box.className='hudbtns'; sb.parentNode.insertBefore(box,sb); box.innerHTML='<button class="ghost" id="searchbtn" type="button" aria-label="Search the menus" title="Search the menus"><span aria-hidden="true">🔍</span><span class="sbl"> Search</span></button>'; box.appendChild(sb);
  const ov=document.createElement('div'); ov.id='searchov'; ov.hidden=true; ov.innerHTML='<div class="sv-in" role="dialog" aria-label="Search the menus"><label class="ctl-l" for="searchq">Search the menus</label><input id="searchq" type="search" autocomplete="off" placeholder="Try bait, relics, hats, aquarium…"><div id="searchres" role="listbox"></div><button class="btn alt sm" id="searchclose" type="button">Close</button></div>'; document.body.appendChild(ov);
  const q=ov.querySelector('#searchq'), res=ov.querySelector('#searchres'); let list=[], sel=0;
  const draw=()=>{ list=searchFind(q.value); sel=Math.min(sel,Math.max(0,list.length-1)); res.innerHTML=list.length?list.map((e,i)=>{ const sec=menuSecOf(e[1]); return `<button type="button" class="sv-r${i===sel?' on':''}" data-i="${i}" role="option" aria-selected="${i===sel}"><b>${e[0]}</b><span class="meta">${sec?sec.name:'Menu'}</span></button>`; }).join(''):'<div class="meta" style="padding:10px 4px">Nothing found. Try another word.</div>'; };
  const open=()=>{ ov.hidden=false; q.value=''; sel=0; draw(); setTimeout(()=>q.focus(),20); }, close=()=>{ ov.hidden=true; };
  ['pointerdown','touchstart','mousedown'].forEach(ev=>box.addEventListener(ev,e=>e.stopPropagation(),{passive:true})); /* the stage under the top bar turns touches into casts, which ate the tap on Android (director, 2026-11-19: search needed press-and-hold); the other top-bar buttons already shield themselves this way */ $('searchbtn').addEventListener('click',e=>{ e.stopPropagation(); open(); });
  ov.addEventListener('click',e=>{ if(e.target===ov||e.target.id==='searchclose'){ close(); return; } const b=e.target.closest('.sv-r'); if(b){ const it=list[+b.dataset.i]; close(); if(it) searchGo(it); } });
  q.addEventListener('input',()=>{ sel=0; draw(); });
  q.addEventListener('keydown',e=>{ if(e.key==='ArrowDown'){ sel=Math.min(list.length-1,sel+1); draw(); e.preventDefault(); } else if(e.key==='ArrowUp'){ sel=Math.max(0,sel-1); draw(); e.preventDefault(); } else if(e.key==='Enter'){ const it=list[sel]; if(it){ close(); searchGo(it); } e.preventDefault(); } else if(e.key==='Escape'){ close(); } e.stopPropagation(); });
  window.addEventListener('keydown',e=>{ if(e.key==='/'&&ov.hidden&&!/INPUT|TEXTAREA|SELECT/.test((document.activeElement||{}).tagName||'')){ e.preventDefault(); open(); } });
})();
if(/[?&]test\b/.test(location.search)) window.__search=q=>searchFind(q).map(e=>e[0]);

document.head.insertAdjacentHTML('beforeend',`<style>
.ctl-l{display:block;font:800 11px var(--display,system-ui);letter-spacing:.08em;text-transform:uppercase;color:#97abc2;margin:10px 0 6px}
.sellf.lab{display:grid;grid-template-columns:auto auto auto;align-items:end;gap:10px 14px;margin:6px 0 10px;padding:10px 12px;border:1px solid var(--line,#26385180);border-radius:14px;background:#0e1828}
.sellf.lab .fld-title{grid-column:1/-1;font:800 13px var(--display,system-ui);color:var(--ink,#eef3f8)}
.sellf.lab .fld{display:flex;flex-direction:column;gap:5px;min-width:0}
.sellf.lab .fld-l{font:800 10.5px var(--display,system-ui);letter-spacing:.08em;text-transform:uppercase;color:#97abc2}
.sellf.lab .sellp{display:flex;align-items:center;gap:6px}
.sellf.lab [data-spclear]{align-self:end}
@container (max-width:520px){.sellf.lab{grid-template-columns:1fr 1fr}.sellf.lab .fld:last-of-type{grid-column:1/-1}}
.hudbtns{display:flex;gap:6px;align-items:stretch}
.hudbtns>button{flex:1 1 auto;white-space:nowrap}
#searchbtn{display:inline-flex;align-items:center;justify-content:center;gap:4px}
@media (max-width:1199px){#searchbtn .sbl{display:none}}
body.phone-app .hudbtns #settingsbtn{font-size:0;padding:0;display:flex;align-items:center;justify-content:center}
body.phone-app .hudbtns #settingsbtn::before{content:"⚙";font-size:19px;line-height:1}
#searchov{position:fixed;inset:0;z-index:60;background:#02060fcc;display:flex;align-items:flex-start;justify-content:center;padding:max(12vh,24px) 14px 14px}
#searchov[hidden]{display:none}
#searchov .sv-in{width:min(520px,100%);background:linear-gradient(180deg,#1a2a44,#111c2e);border:1px solid #4a6a9466;border-radius:20px;padding:14px;box-shadow:0 24px 70px #02060fdd;display:flex;flex-direction:column;gap:8px}
#searchov input{font:inherit;font-size:16px;padding:12px 14px;border-radius:12px;border:1px solid #ffd36a88;background:#0a1220;color:#eef3f8;outline:none}
#searchov input:focus{box-shadow:0 0 0 3px #ffd36a33}
#searchres{display:flex;flex-direction:column;gap:4px;max-height:52vh;overflow-y:auto}
.sv-r{display:flex;justify-content:space-between;align-items:center;gap:10px;min-height:46px;padding:8px 12px;border-radius:12px;border:1px solid transparent;background:#0e1828;color:#eef3f8;font:inherit;text-align:left;cursor:pointer}
.sv-r:hover,.sv-r.on{border-color:#ffd36a88;background:#16243a}
#searchclose{align-self:flex-end}
/* touch screens: tap targets of at least 44px (buttons) and 40px (chips), per Apple / Material guidance */
@media (pointer:coarse){ body.v3 .btn{min-height:44px} body.v3 .btn.sm{min-height:40px} body.v3 .chipb{min-height:40px} body.v3 #panel .acts .btn{min-height:40px} }
</style>`);

// ---------- rarity you can feel: each step up looks, sounds and buzzes better than the one below ----------
// common: clean · uncommon: tinted frame · rare: glowing frame · epic: slow light rays · legendary: golden rays,
// rising sparkles and a shimmer over the name · mythic: prismatic rays, more sparkles and a pulsing frame
const RAR_FEEL={ buzz:[[0],[18],[22,40,22],[30,40,30,40,30],[40,50,40,50,80],[60,40,60,40,60,40,140]] };
function rarFanfare(r){ try{ if(r>=4){ const base=r===5?[523,659,784,1047,1319]:[392,523,659,784,1047]; base.forEach((f,i)=>tone(f,.5,'triangle',.06,0,.12+i*.09)); tone(r===5?1568:1319,.9,'sine',.05,0,.62); }
    else if(r===3){ [659,880,1109].forEach((f,i)=>tone(f,.32,'triangle',.05,0,.1+i*.07)); } }catch(e){}
  try{ if(r>=1&&typeof vib==='function') vib(RAR_FEEL.buzz[r]); }catch(e){} }
{ const _sc=showCard; showCard=function(o){ const ce=G.lastEntry; _sc(o); try{ const ci=$('cardin'); ci.querySelectorAll('.rf').forEach(e=>e.remove()); const sp=ce&&SPI[ce.id], r=sp?sp.r:-1; ci.dataset.rar=r>=0?String(r):'';
    if(r>=3){ ci.insertAdjacentHTML('afterbegin',`<div class="rf rf-rays" aria-hidden="true"></div>`); }
    if(r>=4){ let s='<div class="rf rf-sparks" aria-hidden="true">'; const n=r===5?14:9; for(let i=0;i<n;i++) s+=`<i style="left:${6+((i*37)%88)}%;animation-delay:${(i*.23).toFixed(2)}s;animation-duration:${(2.2+(i%4)*.35).toFixed(2)}s"></i>`; ci.insertAdjacentHTML('afterbegin',s+'</div>'); }
    if(r>=0) rarFanfare(r); }catch(e){} }; }
document.head.insertAdjacentHTML('beforeend',`<style>
#cardin{position:relative;isolation:isolate}
#cardin > *:not(.rf):not(.shine){position:relative;z-index:1}
#cardin > .shine{z-index:2}
#cardin .rf{position:absolute;inset:0;border-radius:inherit;pointer-events:none;z-index:0;overflow:hidden}
#cardin[data-rar="1"]{border-color:#7fe3a888!important}
#cardin[data-rar="2"]{border-color:#6ab8ff!important;box-shadow:inset 0 1px 0 #ffffff1a,0 24px 70px #02060fdd,0 0 34px #6ab8ff44!important}
#cardin[data-rar="3"]{border-color:#c48aff!important;box-shadow:inset 0 1px 0 #ffffff1a,0 24px 70px #02060fdd,0 0 44px #c48aff55!important}
#cardin[data-rar="4"]{border-color:#ffc94d!important;box-shadow:inset 0 1px 0 #fff3c066,0 24px 70px #02060fdd,0 0 60px #ffc94d66!important}
#cardin[data-rar="5"]{border-color:#ff6ad5!important;box-shadow:inset 0 1px 0 #ffd6f566,0 24px 70px #02060fdd,0 0 70px #ff6ad577!important;animation:rfPulse 2.4s ease-in-out infinite}
.rf-rays{-webkit-mask-image:radial-gradient(circle at 50% 24%,#000 0 22%,transparent 62%);mask-image:radial-gradient(circle at 50% 24%,#000 0 22%,transparent 62%)}
.rf-rays::before{content:"";position:absolute;left:50%;top:26%;width:220%;aspect-ratio:1;transform:translate(-50%,-50%);border-radius:50%;opacity:.5;animation:rfSpin 18s linear infinite}
#cardin[data-rar="3"] .rf-rays::before{background:repeating-conic-gradient(from 0deg,#c48aff2e 0 8deg,transparent 8deg 24deg);opacity:.55}
#cardin[data-rar="4"] .rf-rays::before{background:repeating-conic-gradient(from 0deg,#ffd36a3a 0 7deg,transparent 7deg 20deg);opacity:.75;animation-duration:12s}
#cardin[data-rar="5"] .rf-rays::before{background:repeating-conic-gradient(from 0deg,#ff6ad53a 0 6deg,#7ae8ff2e 6deg 12deg,transparent 12deg 20deg);opacity:.85;animation-duration:9s}
.rf-sparks i{position:absolute;bottom:-6px;width:5px;height:5px;border-radius:50%;background:#fff3c0;box-shadow:0 0 8px #ffd36a;opacity:0;animation:rfRise 2.6s ease-in infinite}
#cardin[data-rar="5"] .rf-sparks i:nth-child(odd){background:#ffd6f6;box-shadow:0 0 8px #ff6ad5}
#cardin[data-rar="4"] #cardname,#cardin[data-rar="5"] #cardname{background:linear-gradient(100deg,#fff 0 38%,#fff6d0 46%,#fff 54% 100%);background-size:250% 100%;-webkit-background-clip:text;background-clip:text;color:transparent;animation:rfShine 3.2s ease-in-out infinite}
@keyframes rfSpin{to{transform:translate(-50%,-50%) rotate(360deg)}}
@keyframes rfRise{0%{opacity:0;transform:translateY(0) scale(.6)}15%{opacity:1}100%{opacity:0;transform:translateY(-240px) scale(1.1)}}
@keyframes rfShine{0%,30%{background-position:100% 0}70%,100%{background-position:0 0}}
@keyframes rfPulse{0%,100%{box-shadow:inset 0 1px 0 #ffd6f566,0 24px 70px #02060fdd,0 0 54px #ff6ad555}50%{box-shadow:inset 0 1px 0 #ffd6f566,0 24px 70px #02060fdd,0 0 90px #ff6ad599}}
@media (prefers-reduced-motion:reduce){.rf-rays::before,.rf-sparks i,#cardin[data-rar] #cardname,#cardin[data-rar="5"]{animation:none!important}#cardin[data-rar="4"] #cardname,#cardin[data-rar="5"] #cardname{color:#fff;background:none}}
</style>`);
document.head.insertAdjacentHTML('beforeend',`<style>
/* catch card stats: values never break mid-number; with four stats they wrap as whole units when space is short */
.card .nums{flex-wrap:wrap;gap:8px 16px}
.card .nums b{white-space:nowrap}
.card .nums div{align-items:center;min-width:64px}
</style>`);

// ---------- Fish Log: find what you are missing (the weak spot of most collection logs) ----------
// "Show: All · Missing · Catchable now" (missing fish you can catch here at this time of day), and a hint on each
// missing fish: when it is active and how it fights.
{ const _rj=renderJournal; renderJournal=function(P){ _rj(P); try{ if(encLoc==='junk') return; const L=LOCS[locIdx(encLoc)]; if(!L) return; const mode=S.settings.logShow||'all', p=phase(), open=S.unlocked.includes(L.id);
    const list=spAt(L.id), miss=list.filter(s=>!S.journal[s.id]), now=miss.filter(s=>timeOk(s,p)&&open);
    const row=[...P.querySelectorAll('.chips')].find(c=>c.querySelector('[data-act="encloc"]')); if(!row) return;
    row.insertAdjacentHTML('afterend',`<div class="ctl-l">Show</div><div class="chips logshow">${[['all','All '+list.length],['missing','Missing '+miss.length],['now','Catchable now '+now.length]].map(([k,n])=>`<button class="chipb" type="button" data-logshow="${k}" aria-pressed="${mode===k}">${n}</button>`).join('')}</div>`);
    P.querySelectorAll('.jgrid .jcard[data-k]').forEach(c=>{ const s=SPI[c.dataset.k]; if(!s) return; const got=!!S.journal[s.id], ok=timeOk(s,p)&&open;
      if(mode==='missing'&&got || mode==='now'&&(got||!ok)) c.style.display='none';
      if(!got){ const B=BEH[s.beh], html=(B?B.n:'')+(ok?' · <b class="lognow">Now</b>':''), sm=[...c.querySelectorAll('small')].find(x=>/Not caught yet/.test(x.textContent));
        if(sm){ sm.classList.add('loghint'); sm.innerHTML=html; } else c.insertAdjacentHTML('beforeend','<small class="loghint">'+html+'</small>'); } });
    if(mode!=='all'&&!P.querySelector('.jgrid .jcard[data-k]:not([style*="none"])')) P.querySelector('.jgrid').insertAdjacentHTML('beforebegin',`<div class="empty">${mode==='now'?'Nothing new to catch here right now. Try the other time of day, or another water.':'You have found every fish here. Well done!'}</div>`);
    P.querySelectorAll('[data-logshow]').forEach(b=>b.onclick=e=>{ e.stopPropagation(); S.settings.logShow=b.dataset.logshow; save(); renderPanel(); });
  }catch(e){} }; }
document.head.insertAdjacentHTML('beforeend',`<style>.jcard .loghint{color:#97abc2;font-size:10.5px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:100%}.jcard .lognow{color:var(--kelp,#7fe3c4);font-weight:800}</style>`);
