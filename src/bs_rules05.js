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
//  Nibbles; from a score of 8 it is a big crate). The player picks on claim; with the Bounty Ledger relic a bounty pays both. Every claim also
//  gives Tide Pass XP (daily tasks did).
//  A Nibble crate opens straight away: each Nibble rolls its own tier from the pool; a big crate holds at least one Epic or better.
//  Feel calls (first versions, the director and Cam tune them): the effort weights, the Scales, the crate sizes and odds, the Tide Pass XP.
const BOUNTY_PASS=40, BOUNTY_BIG=8, BOUNTY_W=[1,1.5,3,5,8,12], NIB_CRATE={small:{odds:[50,30,14,5,1,0], min:0}, big:{odds:[30,30,22,12,5,1], min:3}};
/* how much work a bounty is: one common fish = 1. A fish counts by its rarity (BOUNTY_W), more for one that only bites by day or by night; a size
   bounty counts double (it needs a big one); a style hunt 1.2 a fish, a variety hunt 1.5 a kind, a trophy 8, a shiny or a legend 12 */
function bountyEffort(b){ const sp=b.sp&&SPI[b.sp]; if(b.legend||b.type==='shiny') return 12; if(b.type==='trophy') return 8; if(b.type==='kinds') return (b.n||1)*1.5; if(b.type==='style') return (b.n||1)*1.2;
  if(!sp) return 1; const w=BOUNTY_W[Math.min(5,sp.r)]*(sp.time&&sp.time!=='any'?1.25:1); return b.type==='size' ? w*2 : w*(b.n||1); }
const bountyPay = b => { const e=bountyEffort(b); return {sc:clamp(Math.round(1+e),2,12), cr:e>=BOUNTY_BIG?'big':'small', n:clamp(Math.round(3+e*.7),4,10)}; };
const bountyBoth = () => !!relic('seasoned');
const bountyPayText = b => { const p=bountyPay(b); return p.sc+' Scales '+(bountyBoth()?'and':'or')+' a '+(p.cr==='big'?'big ':'')+'crate of '+p.n+' Nibbles'; };
function bountyClaimBtns(b,i,sm){ const p=bountyPay(b), c='btn'+(sm?' sm':''); if(bountyBoth()) return `<button class="${c}" data-act="claim" data-i="${i}" data-k="both">Claim</button>`;
  return `<span class="bpick"><button class="${c}" data-act="claim" data-i="${i}" data-k="sc" title="Take ${p.sc} Scales">${p.sc} Scales</button><button class="${c}" data-act="claim" data-i="${i}" data-k="cr" title="Take the crate of ${p.n} Nibbles: it opens straight away">${p.n} Nibbles</button></span>`; }
function nibCrateRoll(size,n){ const C=NIB_CRATE[size]||NIB_CRATE.small, out=[0,0,0,0,0,0];
  for(let j=0;j<n;j++){ let x=Math.random()*100, t=0; for(let i=0;i<6;i++){ if(x<C.odds[i]){ t=i; break; } x-=C.odds[i]; } out[t]++; }
  if(C.min&&!out.slice(C.min).some(n=>n>0)){ out[out.findIndex(n=>n>0)]--; out[C.min]++; } return out; }
let bountyGot=null; /* what the claims of one press paid, shown once (Claim all pays many) */
function bountyGive(b,pick){ const p=bountyPay(b), g=bountyGot||(bountyGot={sc:0, nib:[0,0,0,0,0,0], crates:0, n:0}); g.n++;
  if(pick!=='cr'){ S.scales+=p.sc; g.sc+=p.sc; }
  if(pick!=='sc'){ nibCrateRoll(p.cr,p.n).forEach((n,i)=>{ if(n){ nibAdd('r'+i,n); g.nib[i]+=n; } }); g.crates++; }
  addPassXP(BOUNTY_PASS); S.gstats.tasks=(S.gstats.tasks||0)+1; /* the counter daily tasks used; its two feats count bounties now */
  setTimeout(bountyShow,0); }
function nibCrateClose(){ const o=$('nibcrate'); if(o) o.remove(); }
function bountyShow(){ const g=bountyGot; bountyGot=null; if(!g) return; const head=g.n>1?g.n+' bounties paid':'Bounty paid';
  if(!g.crates){ toast(head+': +'+g.sc+' Scales'); return; }
  nibCrateClose(); const chips=g.nib.map((n,i)=>n?`<span class="nibs-r" style="--rc:${RAR[i].c}">${NIB_TIER[i]} <b>+${n}</b></span>`:'').join('');
  document.body.insertAdjacentHTML('beforeend',`<div class="card nibcrate" id="nibcrate" role="dialog" aria-modal="true" aria-label="Nibble crate"><div class="in"><div class="rar" style="color:var(--gold)">${esc(head)}</div><h3>${g.crates>1?g.crates+' Nibble crates':'Nibble crate'}</h3><div class="nc-row">${chips}</div>${g.sc?`<div class="nc-sc">and +${g.sc} Scales</div>`:''}<div class="sub">Feed Nibbles to your fish in the Aquarium.</div><div class="tap">${PLAT.touch()?'Tap to close':'Click or press Esc to close'}</div></div></div>`);
  $('nibcrate').addEventListener('pointerup',e=>{ e.stopPropagation(); nibCrateClose(); }); try{ sfx.shiny(); }catch(e){ oops('bs_rules05:sfx.shiny',e); } }
document.addEventListener('keydown',e=>{ if(e.key==='Escape'&&$('nibcrate')){ nibCrateClose(); e.preventDefault(); e.stopPropagation(); } },true);
document.head.insertAdjacentHTML('beforeend','<style>#nibcrate{position:fixed;z-index:70;padding:12px calc(12px + env(safe-area-inset-right)) calc(12px + env(safe-area-inset-bottom)) calc(12px + env(safe-area-inset-left))}#nibcrate .nc-row{display:flex;flex-wrap:wrap;justify-content:center;gap:6px;margin:10px 0}#nibcrate .nc-row .nibs-r{font-size:14px;padding:5px 12px}#nibcrate .nc-sc{font:700 14px var(--display,system-ui);color:var(--gold);margin:0 0 8px}.bpick{display:inline-flex;flex-wrap:wrap;gap:6px;justify-content:flex-end}.brew{font-size:12.5px;color:var(--muted)}</style>');

// ---------- Fish Log: the completion reward says what it really gives ----------
{ const _rj=renderJournal; renderJournal=function(P){ _rj(P); try{ const m=P.querySelector('.fl-mh .meta'); if(m&&/find them all for/.test(m.innerHTML)) m.insertAdjacentHTML('beforeend',' <b class="fl-perk">+ fish from here worth 10% more, forever</b>'); else if(m&&/complete/.test(m.textContent)) m.insertAdjacentHTML('beforeend',' <b class="fl-perk got">· fish from here worth 10% more</b>'); }catch(e){ oops('bs_rules05:P.querySelector',e); } }; }
document.head.insertAdjacentHTML('beforeend',`<style>#panel .fl-perk{color:#ffd36a;font-weight:800} #panel .fl-perk.got{color:#7fe3c4}</style>`);

