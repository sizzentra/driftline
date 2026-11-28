// =====================================================================
// 0.3.4 quality-of-life (feedback from Cam): sell filters, a feed button by Collect, aquarium income on hover,
// the fishmonger asks mostly for local fish, Bounties opens on your water, a soft sound when a fish runs,
// and twinkling sparkles on shiny fish pictures.
// =====================================================================

// ---------- Sell all filters: by rarity, by price, or both ----------
const SELL_RAR=[['all','Any rarity'],['0','Common only'],['1','Up to Uncommon'],['2','Up to Rare'],['3','Up to Epic'],['4','Up to Legendary']];
function sellFilterOn(){ const s=S.settings; return (s.sellR&&s.sellR!=='all')||(+s.sellP>0); }
// a fish stays in the cooler when it is protected (Protect rare fish setting) or does not match the filter
// shinies: the "Sell shinies too" box decides on its own (it starts as before: off while Protect rare fish is on)
function sellShinyOn(){ const s=S.settings; return s.sellShiny!=null ? !!s.sellShiny : !s.protectRare; }
function sellHybridOn(){ const s=S.settings; return s.sellHybrid!=null ? !!s.sellHybrid : !s.protectRare; } /* batch 2: the Hybrid switch beside Shinies starts the same way */
/* what Sell all keeps (bug fix, director 2026-11-23: "filters just don't work, same with the sell toggles"): the cooler's own choices win.
   A rarity picked in the dropdown sells up to that rarity even with Protect rare fish on; "Sell shinies too" and "Sell hybrids too" sell
   them whatever their rarity; Protect rare fish keeps Epic and up only while the dropdown says Any rarity */
function sellKeep(f){ const s=S.settings, sp=SPI[f.id]; if(!sp) return true;
  if(f.hy && !sellHybridOn()) return true; if(f.sh && !sellShinyOn()) return true;
  const pick=s.sellR&&s.sellR!=='all', chosen=(f.sh&&sellShinyOn())||(f.hy&&sellHybridOn());
  if(pick){ if(sp.r>+s.sellR) return true; } else if(s.protectRare && sp.r>=3 && !chosen) return true;
  if(+s.sellP>0&&salePrice(f)>=+s.sellP) return true; return false; }
stepOn('renderCooler', { after(t,P){ const btn=P.querySelector('[data-act="sellall"]'); if(!btn) return; const s=S.settings;
  const sel=(k,list,cur)=>`<select data-sf="${k}">${list.map(([v,n])=>`<option value="${v}" ${String(cur)===String(v)?'selected':''}>${n}</option>`).join('')}</select>`;
  // 0.3.4.3: the price is typed in (plain numbers or 50k / 1.2m); empty means any price
  const pv=+s.sellP>0?fmtShort(+s.sellP):'';
  btn.insertAdjacentHTML('beforebegin',`<div class="sellf"><span class="meta">Sell</span>${sel('sellR',SELL_RAR,s.sellR||'all')}<label class="sellp"><span>under</span><input data-sp type="text" inputmode="decimal" autocomplete="off" placeholder="any price" value="${pv}" aria-label="Only sell fish worth less than this"></label>${+s.sellP>0?'<button class="btn alt sm" data-spclear title="Clear the price limit">×</button>':''}<button class="chipb sellsh" data-ssh aria-pressed="${sellShinyOn()}" title="When on, Sell all also sells shiny fish"><span class="ssh-star" aria-hidden="true">✦</span> Sell shinies too</button><button class="chipb sellsh" data-shy aria-pressed="${sellHybridOn()}" title="When on, Sell all also sells hybrid fish"><span class="ssh-star" aria-hidden="true">×</span> Sell hybrids too</button></div>`); { const n=S.cooler.filter(f=>!sellKeep(f)).length; btn.insertAdjacentHTML('afterend',`<button class="btn alt" data-act="scrapall" ${n?'':'disabled'} title="Scrap every fish Sell all would sell, for Fish Nibbles">Scrap ${sellFilterOn()?'matching':'all'} (${n})</button>`); } /* Cam's list #7: Scrap all sits right beside Sell all, the same size */ /* C11: Scrap all lives in the filter row, so it uses the same filters and travels with them on every layout */
  const ssh=P.querySelector('[data-ssh]'); if(ssh) ssh.onclick=()=>{ S.settings.sellShiny=!sellShinyOn(); save(); renderPanel(); }; const shy=P.querySelector('[data-shy]'); if(shy) shy.onclick=()=>{ S.settings.sellHybrid=!sellHybridOn(); save(); renderPanel(); };
  P.querySelectorAll('[data-sf]').forEach(el=>el.onchange=()=>{ S.settings[el.dataset.sf]=el.value; save(); renderPanel(); });
  const inp=P.querySelector('[data-sp]'); if(inp){ const apply=()=>{ const v=sellParse(inp.value); if(v===+S.settings.sellP||(!v&&!(+S.settings.sellP))){ inp.value=v?fmtShort(v):''; return; } S.settings.sellP=v; save(); renderPanel(); };
    inp.addEventListener('change',apply); inp.addEventListener('keydown',e=>{ if(e.key==='Enter'){ e.preventDefault(); inp.blur(); } }); }
  const clr=P.querySelector('[data-spclear]'); if(clr) clr.onclick=()=>{ S.settings.sellP=0; save(); renderPanel(); }; } });
// "50k" -> 50000, "1.2m" -> 1200000, "2,500" -> 2500, anything else -> 0 (no limit)
function sellParse(t){ const m=String(t||'').trim().toLowerCase().replace(/[, _]/g,'').match(/^(\d+(?:\.\d+)?)([kmb]?)$/); if(!m) return 0; const n=parseFloat(m[1])*({k:1e3,m:1e6,b:1e9}[m[2]]||1); return Math.max(0,Math.round(n)); }

// ---------- the aquarium's Feed button, always beside Collect ----------
const _renderAquarium_034 = renderAquarium;
renderAquarium = function(P){ _renderAquarium_034(P); const c=P.querySelector('#collectbtn'); if(!c||P.querySelector('#feedbtn2')) return; const left=Math.max(0,3600000-(Date.now()-S.fedT));
  c.insertAdjacentHTML('afterend',`<button class="btn ${left?'alt':''}" id="feedbtn2" data-act="feed" ${left?'disabled':''} title="Feeding gives +25% aquarium income for 30 minutes">${left?'Fed · hungry in '+Math.ceil(left/60000)+' min':'Feed fish'}</button>`); const fb=P.querySelector('#feedbtn2'); if(fb) fb.addEventListener('click',()=>setTimeout(()=>{ if(S.tab==='aquarium') renderPanel(); },60)); };

// ---------- what a fish would earn in the aquarium: on the catch card and on the To aquarium button ----------
// what a fish earns per hour once it is on display, counting its own aquarium boost (the same number the Aquarium tab will show)
function aqRateIf(f){ if(S.tank.includes(f)) return fishRate(f)*60; S.tank.push(f); try{ return fishRate(f)*60; } finally{ S.tank.pop(); } }
function aqIncomeTxt(f){ try{ return 'Earns '+fmt(aqRateIf(f))+' coins per hour in your aquarium'; }catch(e){ oops('au_fix034:aqIncomeTxt',e); return ''; } }
stepOn('showCard', { before(){ const ce=G.lastEntry; $('cardin').querySelectorAll('.aqinc').forEach(e=>e.remove()); /* one line per card, never stacked */ return ce; }, after(ce){ const q=$('cardq'); if(!ce||!q) return; const inc=aqIncomeTxt(ce); if(!inc) return;
  const tb=q.querySelector('[data-q="tank"]'); if(tb){ tb.title=(tb.disabled?'Your aquarium is full. ':'')+inc; }
  // 0.3.5: a compact fourth stat beside Weight, Sells for and XP (the full sentence is on hover)
  const full=S.tank.length>=aqCap(), nums=$('cardnums'); if(nums) nums.insertAdjacentHTML('beforeend',`<div class="aqinc${full?' full':''}" title="${inc}${full?' (your aquarium is full)':''}"><span>Aquarium</span><b class="coin">${fmt(aqRateIf(ce))}<small>/h</small></b></div>`); } });
stepOn('renderCooler', { after(t,P){ P.querySelectorAll('.fishrow').forEach(row=>{ const ib=row.querySelector('[data-i]'); const f=ib?S.cooler[+ib.dataset.i]:null; if(!f) return; /* rows are shown newest first: read each row's own index */ const b=row.querySelector('[data-act="totank"],[data-act="tank"]'); if(b) b.title=(b.disabled?'Your aquarium is full. ':'')+aqIncomeTxt(f); const v=row.querySelector('.val'); if(v&&!v.querySelector('.aqh')) v.insertAdjacentHTML('beforeend','<div class="aqh" title="What it would earn on display in your aquarium">'+fmt(aqRateIf(f))+' / h in tank</div>'); }); } });

// ---------- the fishmonger asks for a fish from the water you are on 80% of the time ----------
const DEMAND={slot:-1,id:null};
function demandSp(){ const slot=Math.floor(Date.now()/1000/WX_LEN); if(DEMAND.slot!==slot||!SPI[DEMAND.id]){ const h=hashStr('dm'+slot), local=SP.filter(s=>s.loc===S.loc&&s.r<=3), any=SP.filter(s=>S.unlocked.includes(s.loc)&&s.r<=3), pool=(h%10<8&&local.length)?local:any; DEMAND.slot=slot; DEMAND.id=pool[(h>>>4)%pool.length].id; } return SPI[DEMAND.id]; };

// ---------- Bounties opens on the board of the water you are fishing ----------
let lastTab034=null;
panelStep({ before(){ if(S.tab==='bounties'&&lastTab034!=='bounties'){ bLoc=null; bPick=false; } lastTab034=S.tab; } });

// ---------- a soft cue when a hooked fish starts to run (line hissing off the reel) ----------
const _fight_034 = fight;
fight = function(dt){ const was=G.run; _fight_034(dt); if(G.st==='reeling'&&G.run&&!was){ try{ tone(520,.14,'triangle',.035,-160); tone(380,.18,'sine',.025,-90,.06); }catch(e){ oops('au_fix034:tone',e); } if(typeof vib==='function') vib(12); } };

// ---------- shiny fish pictures twinkle (cooler, aquarium, fish log, catch card) ----------
panelStep({ after(){ try{ requestAnimationFrame(()=>shineDecorate($('panel'))); }catch(e){ oops('au_fix034:requestAnimationFrame',e); } } });
stepOn('showCard', { before(){ return G.lastEntry; }, after(ce){ try{ const cv=$('cardfish'); const old=$('cardin').querySelector('.shine'); if(old) old.remove(); const f=ce&&{shiny:ce.sh}; if(cv&&f&&f.shiny){ cv.classList.add('shiny'); cv.dataset.sh=String(f.shiny); requestAnimationFrame(()=>shineDecorate($('cardin'))); } else if(cv){ cv.classList.remove('shiny'); delete cv.dataset.sh; } }catch(e){ oops('au_fix034:querySelector',e); } } });

document.head.insertAdjacentHTML('beforeend',`<style>
.sellsh{display:inline-flex;align-items:center;gap:6px;color:#cfe0ec}.sellsh .ssh-star{color:#8fa6ba;transition:color .2s}.sellsh[aria-pressed="true"]{color:#ffe7a8}.sellsh[aria-pressed="true"] .ssh-star{color:#ffd36a;text-shadow:0 0 8px #ffd36a99}.sellf{display:flex;gap:6px;align-items:center;flex-wrap:wrap;margin-right:8px}.sellp{display:flex;align-items:center;gap:6px;font-size:13px;color:var(--mute,#9ab0c2)}.sellp input{width:96px;font:inherit;font-size:13px;padding:5px 8px;border-radius:10px;border:1px solid rgba(255,255,255,.18);background:rgba(10,24,36,.6);color:#e8eef4}.sellp input::placeholder{color:#7f93a4}.sellf select{font:inherit;font-size:13px;padding:5px 8px;border-radius:10px;border:1px solid rgba(255,255,255,.18);background:rgba(10,24,36,.6);color:inherit}
.aqh{font-size:11px;color:#9fe0c0;font-weight:600;white-space:nowrap}.card .nums .aqinc b{color:#9fe0c0}.card .nums .aqinc b small{font-size:.62em;margin-left:1px;opacity:.85}.card .nums .aqinc.full b{opacity:.7}@media (max-width:560px){.card .nums{gap:12px;flex-wrap:wrap}.card .nums b{font-size:16px}.card .nums span{font-size:10px;letter-spacing:.05em}}
.shine{position:absolute;pointer-events:none}.shine i{position:absolute;width:10px;height:10px;margin:-5px 0 0 -5px;background:radial-gradient(circle,#fff8d0 0 18%,rgba(255,230,140,.6) 30%,transparent 62%);clip-path:polygon(50% 0,60% 40%,100% 50%,60% 60%,50% 100%,40% 60%,0 50%,40% 40%);animation:shinetw 1.9s ease-in-out infinite;opacity:0}
.shine.prism i{background:radial-gradient(circle,#fff 0 18%,rgba(255,140,230,.7) 32%,transparent 62%)}
@keyframes shinetw{0%,100%{opacity:0;transform:scale(.4) rotate(0)}45%{opacity:1;transform:scale(1.15) rotate(25deg)}70%{opacity:.4;transform:scale(.8) rotate(40deg)}}
</style>`);

// ---------- rarity balance: each rarity has the same overall chance in every water, whatever its species count,
// and within a rarity every fish keeps its own steady rate (some legendaries rarer than others) ----------
var RAR_REF=[11,10,7,4,3,1]; // the typical number of species per rarity in a water (keeps today's average odds)
var RAR_MEMO={key:null,map:null};
function rarIndiv(s){ return .6+((hashStr('rw'+s.id)%1000)/1000)*.8; } // .6 .. 1.4, fixed per species
function rarBase(s,pool){ if(!RAR_MEMO) RAR_MEMO={key:null}; if(!RAR_REF) RAR_REF=[11,10,7,4,3,1]; const key=pool.length+'|'+(pool[0]&&pool[0].id)+'|'+(pool[pool.length-1]&&pool[pool.length-1].id);
  if(RAR_MEMO.key!==key){ const cnt=[0,0,0,0,0,0], ind=[0,0,0,0,0,0]; for(const p of pool){ cnt[p.r]++; ind[p.r]+=rarIndiv(p); } RAR_MEMO.map={cnt,ind}; RAR_MEMO.key=key; }
  const {cnt,ind}=RAR_MEMO.map; return RAR[s.r].w*RAR_REF[s.r]*rarIndiv(s)/Math.max(.001,ind[s.r]); }
// late-game luck (strong baits, long rods, pearls, hotspots) stacks with diminishing returns,
// so legendaries stay special in the last waters instead of turning up every few casts
const RARE_SOFT=3; const _rareScore_034=rareScore;
rareScore=function(dm,far,hot,p){ const r=_rareScore_034(dm,far,hot,p); return r>0 ? r/(1+r/RARE_SOFT) : r; };
if(/[?&]test\b/.test(location.search)) window.__land=(id,o={})=>{ __forceCatch(id,o); G.fish=G.forced; G.forced=null; G.st='reeling'; landFish(); return !$('card').hidden; };
if(/[?&]test\b/.test(location.search)) window.__demand=()=>demandSp();

// ---------- Boardwalk winnings: every coin counts toward Voyage pearls (C25, director + Cam, 2026-11-20: the "at most a quarter" limit is gone) ----------
function bwEarn(n){ n=Math.floor(n); S.money+=n; S.stats.earned+=n; const st=S.stats; st.runEarned+=n; st.runBw=(st.runBw||0)+n; return n; }
if(/[?&]test\b/.test(location.search)) window.__bwEarn=n=>bwEarn(n);
