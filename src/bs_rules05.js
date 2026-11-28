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
function featCatDone(cat){ try{ if(!FEAT_CATS_REF||!S.feats) return false; const ids=cat==='Waters'?FEATS.filter(f=>/^Master of /.test(f.name)).map(f=>f.id):((FEAT_CATS_REF.find(c=>c[0]===cat)||[])[1]||[]).filter(id=>FEATS.some(f=>f.id===id)); return ids.length>0&&ids.every(id=>S.feats[id]); }catch(e){ oops('bs_rules05:featCatDone',e); return false; } }
function featCatBonus(k){ const n=S.feats?Object.keys(S.feats).length:0; if(featBonusCache.n!==n){ const v={}; for(const cat in FEAT_CAT_BONUS) if(featCatDone(cat)){ const [bk,x]=FEAT_CAT_BONUS[cat]; v[bk]=(v[bk]||0)+x; } featBonusCache={n,v}; } return featBonusCache.v[k]||0; }
function featBonusText(cat){ const b=FEAT_CAT_BONUS[cat]; if(!b) return ''; const n=BK[b[0]]||b[0]; return '+'+Math.round(b[1]*100)+'% '+n+' forever'; }
stepOn('bonus', function(v,k){ return v+featCatBonus(k); });
{ const _v=specLocValue; specLocValue=function(loc){ return _v(loc)*(S.setDone&&S.setDone[loc]?1.1:1); }; }

// ---------- bounty rewards (director, 2026-11-27: "Just scales and nibble crates"; no coins; daily tasks and weekly quests are gone) ----------
//  The reward follows the effort (director, 2026-11-27: "some of these bounties don't equal the same rewards for effort"): bountyEffort scores a
//  bounty from the rarity of its fish, how many, and how picky it is; the score sets the Scales (2 to 12) and the size of the Nibble crate (4 to 10
//  Nibbles). The player picks on claim; with the Bounty Ledger relic a bounty pays both. Every claim also
//  gives Tide Pass XP (daily tasks did).
//  A Nibble crate opens straight away: each Nibble rolls its own tier from the pool. One kind of crate (director, 2026-11-27: "i just dont see the point of big crates"): a harder bounty's crate holds more Nibbles, nothing else differs. The odds are the director's (2026-11-27: "legendary should be 5", Mythic no longer left out).
//  Feel calls (first versions, the director and Cam tune them): the effort weights, the Scales, the crate sizes and odds, the Tide Pass XP.
const BOUNTY_PASS=40, BOUNTY_W=[1,1.5,3,5,8,12], NIB_CRATE=[38,30,18,8,5,1]; /* the chance of each kind for every single Nibble in a crate, Common to Mythic; adds up to 100 */
/* how much work a bounty is: one common fish = 1. A fish counts by its rarity (BOUNTY_W), more for one that only bites by day or by night; a size
   bounty counts double (it needs a big one); a style hunt 1.2 a fish, a variety hunt 1.5 a kind, a trophy 8, a shiny or a legend 12 */
function bountyEffort(b){ const sp=b.sp&&SPI[b.sp]; if(b.legend||b.type==='shiny') return 12; if(b.type==='trophy') return 8; if(b.type==='kinds') return (b.n||1)*1.5; if(b.type==='style') return (b.n||1)*1.2;
  if(!sp) return 1; const w=BOUNTY_W[Math.min(5,sp.r)]*(sp.time&&sp.time!=='any'?1.25:1); return b.type==='size' ? w*2 : w*(b.n||1); }
/* What a bounty pays follows the fishing it takes (director, 2026-11-27: "we want this system to be worth the players time"; measured that day: most
   bounties took 45 to 500 catches and paid 4 to 12 Scales, while that fishing alone gave 12 to 130). bountyCatches: the catches a bounty takes on
   plain odds (no aimed bait, no hunt), from the water's own base weights (rarBase, what catchOdds starts from): n of one fish = n / its share; a set
   size counts double; a day-only or night-only fish half as often again; a style = n / the share of fish that fight that way; a variety hunt 1.6 a
   kind; a trophy 1 in 18; a shiny 1 in 50. The Scales are about what those catches bring on their own (BOUNTY_SC a catch), so a finished bounty
   roughly doubles them; the crate grows more slowly. Feel calls, all four numbers: BOUNTY_SC, BOUNTY_SC_MAX, BOUNTY_NIB, BOUNTY_NIB_MAX. */
const BOUNTY_SC=.25, BOUNTY_SC_MAX=60, BOUNTY_NIB=.12, BOUNTY_NIB_MAX=30, BOUNTY_C=new WeakMap();
function bountyCatches(b){ if(BOUNTY_C.has(b)) return BOUNTY_C.get(b); const sp=b.sp&&SPI[b.sp], L=b.loc||(sp&&sp.loc)||S.loc, pool=SP.filter(s=>s.loc===L); let c=1;
  if(b.type==='shiny') c=50; else if(b.type==='trophy') c=18; else if(b.type==='kinds') c=(b.n||1)*1.6;
  else if(pool.length){ const w=pool.map(s=>rarBase(s,pool)), tot=w.reduce((a,x)=>a+x,0)||1;
    if(b.type==='style'){ const p=pool.reduce((a,s,i)=>a+(s.beh===b.beh?w[i]:0),0)/tot; c=p?(b.n||1)/p:(b.n||1)*4; }
    else if(sp){ const i=pool.indexOf(sp), p=i<0?0:w[i]/tot; if(p) c=(b.type==='size'?2:(b.n||1))/p*(sp.time&&sp.time!=='any'?1.5:1); } }
  BOUNTY_C.set(b,c); return c; }
const bountyPay = b => { const c=bountyCatches(b); return {sc:clamp(Math.round(c*BOUNTY_SC),2,BOUNTY_SC_MAX), n:clamp(Math.round(3+c*BOUNTY_NIB),4,BOUNTY_NIB_MAX)}; };
const bountyBoth = () => !!relic('seasoned');
const bountySwapCost = b => Math.max(5, Math.round(LOCS[locIdx(b.loc||S.loc)].loot*bountyEffort(b)*.5)); /* coins to swap a bounty for another: by the water and the effort (it was a tenth of the old coin reward, 15 beside 9,900 on one board); Feel call */
const bountyPayText = b => { const p=bountyPay(b); return p.sc+' Scales '+(bountyBoth()?'and':'or')+' a crate of '+p.n+' Nibbles'; };
function bountyClaimBtns(b,i,sm){ const p=bountyPay(b), c='btn'+(sm?' sm':''); if(bountyBoth()) return `<button class="${c}" data-act="claim" data-i="${i}" data-k="both">Claim</button>`;
  return `<span class="bpick"><button class="${c}" data-act="claim" data-i="${i}" data-k="sc" title="Take ${p.sc} Scales">${p.sc} Scales</button><button class="${c}" data-act="claim" data-i="${i}" data-k="cr" title="Take the crate of ${p.n} Nibbles: it opens straight away">Nibble Crate</button></span>`; }
function nibCrateRoll(n){ const out=[0,0,0,0,0,0];
  for(let j=0;j<n;j++){ let x=Math.random()*100, t=0; for(let i=0;i<6;i++){ if(x<NIB_CRATE[i]){ t=i; break; } x-=NIB_CRATE[i]; } out[t]++; }
  return out; }
let bountyGot=null; /* what the claims of one press paid, shown once (Claim all pays many) */
function bountyGive(b,pick){ const p=bountyPay(b), g=bountyGot||(bountyGot={sc:0, nib:[0,0,0,0,0,0], crates:0, n:0}); g.n++;
  if(pick!=='cr'){ S.scales+=p.sc; g.sc+=p.sc; }
  if(pick!=='sc'){ nibCrateRoll(p.n).forEach((n,i)=>{ if(n){ nibAdd('r'+i,n); g.nib[i]+=n; } }); g.crates++; }
  addPassXP(BOUNTY_PASS); S.gstats.tasks=(S.gstats.tasks||0)+1; /* the counter daily tasks used; its two feats count bounties now */
  setTimeout(bountyShow,0); }
function nibCrateClose(){ const o=$('nibcrate'); if(o) o.remove(); }
function bountyShow(){ const g=bountyGot; bountyGot=null; if(!g) return; const head=g.n>1?g.n+' bounties paid':'Bounty paid';
  if(!g.crates){ toast(head+': +'+g.sc+' Scales'); return; }
  nibCrateClose(); const chips=g.nib.map((n,i)=>n?`<span class="nibs-r" style="--rc:${RAR[i].c}">${NIB_TIER[i]} <b>+${n}</b></span>`:'').join('');
  document.body.insertAdjacentHTML('beforeend',`<div class="card nibcrate" id="nibcrate" role="dialog" aria-modal="true" aria-label="Nibble crate"><div class="in"><div class="rar" style="color:var(--gold)">${esc(head)}</div><h3>${g.crates>1?g.crates+' Nibble crates':'Nibble crate'}</h3><div class="nc-row">${chips}</div>${g.sc?`<div class="nc-sc">and +${g.sc} Scales</div>`:''}<div class="sub">Feed Nibbles to your fish in the Aquarium.</div><div class="tap">${PLAT.touch()?'Tap to close':'Click or press Esc to close'}</div></div></div>`);
  $('nibcrate').addEventListener('pointerup',e=>{ e.stopPropagation(); nibCrateClose(); }); try{ sfx.shiny(); }catch(e){ oops('bs_rules05:sfx.shiny',e); } }
/* what a Nibble crate can hold, shown when asked (director, 2026-11-27: "nibble crates need more information on odds"). The numbers are NIB_CRATE's own, so the card cannot disagree with the roll */
function nibOddsClose(){ const o=$('nibodds'); if(o) o.remove(); }
function nibOddsShow(){ nibOddsClose(); const pc=v=>v?v+'%':'none';
  const rows=NIB_TIER.map((t,i)=>`<tr><th scope="row"><span class="nibs-r" style="--rc:${RAR[i].c}">${t}</span></th><td>${pc(NIB_CRATE[i])}</td></tr>`).join('');
  document.body.insertAdjacentHTML('beforeend',`<div class="card nibcrate" id="nibodds" role="dialog" aria-modal="true" aria-label="Nibble crate odds"><div class="in"><div class="rar" style="color:var(--gold)">Bounty reward</div><h3>Nibble crate odds</h3><div class="sub">Every Nibble in a crate is drawn on its own.</div>
   <table class="no-t"><thead><tr><th scope="col">Nibble</th><th scope="col">Chance</th></tr></thead><tbody>${rows}</tbody></table>
   <div class="sub">A crate holds 4 to ${BOUNTY_NIB_MAX} Nibbles: the longer the bounty takes, the more.</div><div class="tap">${PLAT.touch()?'Tap to close':'Click or press Esc to close'}</div></div></div>`);
  $('nibodds').addEventListener('pointerup',e=>{ e.stopPropagation(); nibOddsClose(); }); }
document.addEventListener('keydown',e=>{ if(e.key!=='Escape') return; const c=$('nibcrate'), o=$('nibodds'); if(!c&&!o) return; nibCrateClose(); nibOddsClose(); e.preventDefault(); e.stopPropagation(); },true);
document.head.insertAdjacentHTML('beforeend','<style>#nibcrate,#nibodds{position:fixed;z-index:70;padding:12px calc(12px + env(safe-area-inset-right)) calc(12px + env(safe-area-inset-bottom)) calc(12px + env(safe-area-inset-left))}#nibodds .no-t{margin:8px auto;border-collapse:collapse;font:700 13px var(--display,system-ui);color:#e6efe8}#nibodds .no-t th,#nibodds .no-t td{padding:3px 12px;text-align:center}#nibodds .no-t thead th{font-size:12px;color:#9fb2c8;border-bottom:1px solid var(--line)}#nibodds .no-t tbody th{text-align:left}#nibodds .sub{max-width:340px;margin-left:auto;margin-right:auto}#nibcrate .nc-row{display:flex;flex-wrap:wrap;justify-content:center;gap:6px;margin:10px 0}#nibcrate .nc-row .nibs-r{font-size:14px;padding:5px 12px}#nibcrate .nc-sc{font:700 14px var(--display,system-ui);color:var(--gold);margin:0 0 8px}.bpick{display:inline-flex;flex-wrap:wrap;gap:6px;justify-content:flex-end}.brew{font-size:12.5px;color:var(--muted)}</style>');

/* the Bounties page (director's layout, 2026-11-27): title band, water picker, bounty tiles with a bar and reward chips. Sizes here suit phones; PC makes them larger (pc/pages_pc.js) */
document.head.insertAdjacentHTML('beforeend',`<style>
.bq-head{position:relative;display:flex;align-items:center;gap:10px;min-height:46px;padding:6px 12px;border:1px solid var(--line);border-radius:14px;overflow:hidden;background:#0e1a2c;margin:0 0 8px}
.bq-art{position:absolute;inset:0 0 0 30%;background-size:cover;background-position:center 62%;-webkit-mask-image:linear-gradient(90deg,transparent,#000 40%);mask-image:linear-gradient(90deg,transparent,#000 40%);opacity:.9}
.bq-ic{position:relative;flex:0 0 28px;width:28px;height:28px;box-sizing:border-box;border-radius:50%;border:3px solid #7fe3c4;box-shadow:inset 0 0 0 4px #0e1a2c,inset 0 0 0 7px #7fe3c4}
.bq-ti{position:relative;min-width:0}
.bq-acts{position:relative;margin-left:auto;display:flex;flex-wrap:wrap;justify-content:flex-end;gap:6px} /* the band carries the page-wide buttons (Claim all, Crate odds), so the row under it stays one line on a phone */
.bq-ti h3{margin:0;font:800 18px/1.15 var(--display,system-ui);color:#fff}
.bq-ti p{margin:0;font-size:12px;color:#e6efe8}
.bq-row{display:flex;flex-wrap:wrap;align-items:center;gap:6px 10px;margin:0 0 8px}
.bq-pick,.bq-w{display:flex;align-items:center;gap:10px;min-height:38px;padding:0 12px 0 0;border:1px solid var(--line);border-radius:12px;background:#0e1a2c;color:#e6efe8;font:800 14px var(--display,system-ui);cursor:pointer;overflow:hidden;text-align:left;white-space:nowrap}
.bq-pick{min-width:220px;max-width:100%}
.bq-pick b,.bq-w b{flex:1 1 auto;min-width:0;overflow:hidden;text-overflow:ellipsis} /* the name keeps its own room: nothing sits on top of it */
.bq-chg{flex:0 0 auto;padding:3px 9px;border-radius:999px;border:1px solid #7fe3c4;color:#7fe3c4;font:800 11.5px var(--display,system-ui)}
.bq-th{flex:0 0 58px;align-self:stretch;min-height:38px;background:#16324a center/cover}
.bq-ready{display:inline-flex;align-items:center;min-height:32px;padding:0 12px;border-radius:999px;border:1px solid var(--line);color:#9fb2c8;font:800 13px var(--display,system-ui)}
.bq-ready.on{color:#ffd36a;border-color:#ffd36a66}
.bq-layer{display:flex;flex-direction:column;gap:8px;min-height:0} /* the water layer: as tall as the page's visible part (e_ui.js bountyLayerFit), its rows share that height */
.bq-lh{flex:0 0 auto;display:flex;align-items:center;gap:10px}
.bq-lh .bq-x{flex:0 0 auto;white-space:nowrap} /* the way back comes first, where a back button is looked for */
.bq-lh h3{flex:1;min-width:0;margin:0;font:800 18px/1.15 var(--display,system-ui);color:#fff}
.bq-list{flex:1 1 auto;min-height:0;display:grid;grid-template-columns:repeat(var(--c,4),minmax(0,1fr));grid-auto-rows:minmax(0,52px);gap:6px}
.bq-w{min-height:0;padding:0 10px;gap:6px;font-size:13px;line-height:1.12;white-space:normal}
.bq-w b{display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:2}
.bq-w.on{border-color:#ffd36a}
.bq-n{flex:0 0 auto;font:700 12px var(--display,system-ui);color:#ffd36a}
.bq-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(165px,1fr));gap:8px} /* three across on a phone held sideways, also inside the notch margins (director, 2026-11-27: "I want all the bounties to fit on this screen") */
#panel .tile.bq{display:flex;flex-direction:column;gap:4px;margin:0;padding:9px 10px}
#panel .tile.bq h4{margin:0;font-size:14px!important;line-height:1.2!important}
#panel .tile.bq.done{border-color:#ffd36a;box-shadow:0 0 0 1px #ffd36a}
.bq-meta{font-size:12px;color:#8fc7e8}
.bq-bar{height:6px;border-radius:3px;background:#0a1220;border:1px solid var(--line);overflow:hidden}
.bq-bar i{display:block;height:100%;background:linear-gradient(90deg,#3fd0b5,#7fe3c4)}
.bq-rew{display:flex;flex-wrap:wrap;align-items:center;gap:4px 5px;margin-top:auto;padding-top:2px}
.bq-rew > .bq-chip{flex:1 1 0;justify-content:center;white-space:nowrap}
.bq-ct{display:flex;flex-direction:column;align-items:flex-start;line-height:1.05;text-align:left} /* the crate chip names the crate; what it holds sits under the name (director, 2026-11-27: "it just says 10 nibbles not actually a Nibble Crate") */
.bq-ct b{font-size:11.5px}
.bq-ct small{font:700 10px var(--display,system-ui);opacity:.82}
.bq-lbl{flex:0 0 100%;font-size:11.5px;color:#9fb2c8}
.bq-chip{display:inline-flex;align-items:center;gap:5px;min-height:28px;padding:0 6px;border-radius:999px;border:1px solid var(--line);background:#0a1424;color:#e6efe8;font:800 12.5px var(--display,system-ui)}
button.bq-chip.go{min-height:38px;border:0;color:#1d1300;background:linear-gradient(180deg,#ffe08a,#f3b94e);cursor:pointer}
button.bq-chip.go:focus-visible,.bq-pick:focus-visible,.bq-w:focus-visible{outline:3px solid #7fe3c4;outline-offset:2px}
.bq-i-sc{flex:0 0 auto;width:10px;height:10px;background:#6fb3ff;transform:rotate(45deg);border-radius:2px}
button.bq-chip.go .bq-i-sc{background:#1f5fae}
.bq-i-cr{flex:0 0 auto;width:14px;height:11px;border-radius:2px;background:#e0a23a;box-shadow:inset 0 3px 0 #f6cf7a,inset 0 -1px 0 #8a5a12}
button.bq-chip.go .bq-i-cr{background:#8a5a12;box-shadow:inset 0 3px 0 #b97c1e}
#panel .tile.bq .bq-swap{align-self:center;min-height:30px;font-size:12.5px;padding:0 12px}
@media (max-height:400px){ .bq-head{min-height:0;padding:3px 10px} .bq-ic,.bq-art,.bq-ti p{display:none} .bq-ti h3{font-size:14px} .bq-chip{min-height:25px} button.bq-chip.go{min-height:32px} #panel .tile.bq .bq-swap{min-height:27px} #panel .tile.bq{gap:3px;padding:7px 9px} } /* a short phone: the title band shrinks to its name and its buttons and gives the room to the bounties */
</style>`);
// ---------- Fish Log: the completion reward says what it really gives ----------
{ const _rj=renderJournal; renderJournal=function(P){ _rj(P); try{ const m=P.querySelector('.fl-mh .meta'); if(m&&/find them all for/.test(m.innerHTML)) m.insertAdjacentHTML('beforeend',' <b class="fl-perk">+ fish from here worth 10% more, forever</b>'); else if(m&&/complete/.test(m.textContent)) m.insertAdjacentHTML('beforeend',' <b class="fl-perk got">· fish from here worth 10% more</b>'); }catch(e){ oops('bs_rules05:P.querySelector',e); } }; }
document.head.insertAdjacentHTML('beforeend',`<style>#panel .fl-perk{color:#ffd36a;font-weight:800} #panel .fl-perk.got{color:#7fe3c4}</style>`);

