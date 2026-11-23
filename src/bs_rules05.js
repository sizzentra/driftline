// Shared game rules (every platform's build): bounty bonuses, Feats category boosts, Fish Log completion bonus.
// One save works on every device, so the rules that touch it live in the shared core, not in a platform layer.
// =====================================================================
// Rewards worth chasing (director, 2026-11-17: "gold is sad to look at", "we need completion bonuses for finishing a
// collection", "consider better rewards"). These are game rules, so they apply on every platform:
//  - every bounty also pays a bonus besides coins: bait for its water, a special lure, Scales or Tide Pass XP
//  - finishing a whole Feats category gives a permanent boost
//  - finishing a water's Fish Log makes every fish from that water worth 10% more, forever
// =====================================================================
var FEAT_CATS_REF; // set by the Feats page code (bm_ui04.js)
const FEAT_CAT_BONUS={'Catching':['bite',.05],'Collection':['sell',.05],'Legends & myths':['rare',.05],'Pets':['trophy',.05],'Waters':['xp',.05],'Aquarium & home':['tank',.1],'Style':['shiny',.05],'Gear':['reel',.05],'Boardwalk & events':['treasure',.1],'Progress':['xp',.05]};
let featBonusCache={n:-1,v:{}};
function featCatDone(cat){ try{ if(!FEAT_CATS_REF||!S.feats) return false; const ids=cat==='Waters'?FEATS.filter(f=>/^Master of /.test(f.name)).map(f=>f.id):((FEAT_CATS_REF.find(c=>c[0]===cat)||[])[1]||[]).filter(id=>FEATS.some(f=>f.id===id)); return ids.length>0&&ids.every(id=>S.feats[id]); }catch(e){ return false; } }
function featCatBonus(k){ const n=S.feats?Object.keys(S.feats).length:0; if(featBonusCache.n!==n){ const v={}; for(const cat in FEAT_CAT_BONUS) if(featCatDone(cat)){ const [bk,x]=FEAT_CAT_BONUS[cat]; v[bk]=(v[bk]||0)+x; } featBonusCache={n,v}; } return featBonusCache.v[k]||0; }
function featBonusText(cat){ const b=FEAT_CAT_BONUS[cat]; if(!b) return ''; const n=BK[b[0]]||b[0]; return '+'+Math.round(b[1]*100)+'% '+n+' forever'; }
{ const _b=bonus; bonus=function(k){ return _b(k)+featCatBonus(k); }; }
{ const _v=specLocValue; specLocValue=function(loc){ return _v(loc)*(S.setDone&&S.setDone[loc]?1.1:1); }; }

// ---------- bounty bonuses ----------
function bountyBx(b){ const ox=b.x; if(ox&&typeof ox==='object'&&Number.isInteger(ox.n)&&ox.n>0&&((ox.k==='bait'&&BAIT[ox.id]&&ox.n<=12)||(ox.k==='scales'&&ox.n<=12)||(ox.k==='pass'&&ox.n<=400))) return ox; /* a saved bonus is used only if it is one the game could have rolled */ const r=Math.random(), here=Object.entries(BAIT).filter(([k,x])=>x.loc===b.loc&&!x.junk&&!x.scales), shop=Object.entries(BAIT).filter(([k,x])=>k!=='worm'&&!x.junk&&!x.scales), lure=Object.entries(BAIT).filter(([k,x])=>x.junk);
  let x; if(b.legend||r<.12) x={k:'bait', id:pick(lure)[0], n:b.legend?2:1};
  else if(r<.45){ const e=pick(here.length?here:shop); x={k:'bait', id:e[0], n:rint(5,10)}; }
  else if(r<.72) x={k:'scales', n:rint(3,8)+(b.scales?2:0)};
  else x={k:'pass', n:rint(12,30)*10};
  b.x=x; return x; }
function bountyBxText(x){ if(!x) return ''; if(x.k==='bait'){ const B=BAIT[x.id]; return B?x.n+' × '+B.name:''; } if(x.k==='scales') return x.n+' Scales'; if(x.k==='pass') return x.n+' Tide Pass XP'; return ''; }
function bountyBxGive(x){ if(!x) return ''; try{ if(x.k==='bait'&&BAIT[x.id]){ S.bait[x.id]=(S.bait[x.id]||0)+x.n; try{ renderBait(); }catch(e){} } else if(x.k==='scales') S.scales+=x.n; else if(x.k==='pass') addPassXP(x.n); }catch(e){} return bountyBxText(x); }
{ const _fb=fillBounties; fillBounties=function(){ const r=_fb.apply(this,arguments); try{ for(const b of S.bounties) bountyBx(b); }catch(e){} return r; }; }
document.addEventListener('click',e=>{ const btn=e.target.closest&&e.target.closest('[data-act="claim"]'); if(!btn) return; const b=S.bounties[+btn.dataset.i]; if(!b) return; const x=bountyBx(b);
  setTimeout(()=>{ if(S.bounties.includes(b)) return; const t=bountyBxGive(x); if(t){ save(); setTimeout(()=>{ try{ toast('Bounty bonus: '+t+'!'); }catch(er){} },1100); } },0); },true);
{ const _rb=renderBounties; renderBounties=function(P){ try{ for(const b of S.bounties) bountyBx(b); }catch(e){} _rb(P); try{
      P.querySelectorAll('[data-act="reroll"][data-i],[data-act="claim"][data-i]').forEach(btn=>{ const b=S.bounties[+btn.dataset.i], card=btn.closest('.tile'); if(!b||!card||card.querySelector('.bx')) return; const t=bountyBxText(b.x); if(!t) return;
        const ic=b.x.k==='bait'?(BAIT[b.x.id]&&BAIT[b.x.id].junk?'✨':'🎣'):b.x.k==='scales'?'🔷':'🌊'; const row=btn.closest('.row'); (row||btn).insertAdjacentHTML('beforebegin',`<div class="bx${b.x.k==='bait'&&BAIT[b.x.id]&&BAIT[b.x.id].junk?' sp':''}"><span>${ic}</span>+ ${esc(t)}</div>`); });
    }catch(e){ console.error(e); } }; }
document.head.insertAdjacentHTML('beforeend',`<style>
#panel .bx{display:flex;align-items:center;gap:6px;margin:2px 0 4px;padding:4px 10px;border-radius:999px;background:#7fe3c41a;border:1px solid #7fe3c455;color:#bff3e2;font:700 12px var(--display,system-ui);width:max-content;max-width:100%}
#panel .bx.sp{background:#ffd36a1f;border-color:#ffd36a77;color:#ffe9b0}
</style>`);

// ---------- Fish Log: the completion reward says what it really gives ----------
{ const _rj=renderJournal; renderJournal=function(P){ _rj(P); try{ const m=P.querySelector('.fl-mh .meta'); if(m&&/find them all for/.test(m.innerHTML)) m.insertAdjacentHTML('beforeend',' <b class="fl-perk">+ fish from here worth 10% more, forever</b>'); else if(m&&/complete/.test(m.textContent)) m.insertAdjacentHTML('beforeend',' <b class="fl-perk got">· fish from here worth 10% more</b>'); }catch(e){} }; }
document.head.insertAdjacentHTML('beforeend',`<style>#panel .fl-perk{color:#ffd36a;font-weight:800} #panel .fl-perk.got{color:#7fe3c4}</style>`);

