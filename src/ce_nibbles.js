// =====================================================================
// 0.4.9 [19] Fish Nibbles (director, 2026-11-19: "make even fish from earlier zones reasonable to keep longer term ... Scrapping gives
// Fish Nibbles - a type of candy that can be used to level up your favourite fish"). Shared by every platform.
//  - Scrap a fish in the Cooler: Nibbles of its RARITY (since C27; they were per species). Common/uncommon always, rare 50%, epic 1 in 3, legendary/mythic 25%.
//    1 Nibble, +2 shiny, +2 hybrid, +2 titled (prismatic): at most 7.
//  - Feed them in the Aquarium only, to any fish of that rarity: a Nibble in the fish's colors drops into the tank and the fish
//    swims up to eat it, in its own way. Each Nibble raises that fish's income (diminishing returns that still scale).
//  - Every 10 Nibbles: the fish's bonuses get stronger, or (10% chance, 50% every 30th) it gains another bonus, up to 5.
//  - Half of every species' Nibbles expire when you set sail again. The Fish Log shows your Nibbles, the Trophy Room what a fish ate.
// =====================================================================
const FEED_SMALL=.2, FEED_BIG=.05, FEED_BOOST=.05, FEED_INC=.1; /* C28 feeding (see feedRoll) */
const NIB_ODDS=[1,1,.5,1/3,.25,.25], NIB_KEEP=.5, NIB_MAX_BUFFS=5, NIB_STEP=10, NIB_BIG=30, NIB_ADD=.1, NIB_ADD_BIG=.5, NIB_BOOST=.15;
/* C27 (director + Cam, 2026-11-20): Nibbles belong to a rarity, not a species: scrap any common fish and feed any common fish. Saves with
   per-species Nibbles fold them into their rarity the first time they are read. */
const NIB_RAR=['common','uncommon','rare','epic','legendary','mythic'];
const nibKey = id => { const sp=SPI[id]; return sp?'r'+Math.min(5,sp.r):(/^r[0-5]$/.test(id)?id:null); };
function nibFold(){ if(!S.nib) return; for(const k of Object.keys(S.nib)){ if(/^r[0-5]$/.test(k)) continue; const kk=nibKey(k); if(kk) S.nib[kk]=(S.nib[kk]||0)+(S.nib[k]||0); delete S.nib[k]; } }
const nibOf = id => { nibFold(); const k=nibKey(id); return (k&&S.nib&&S.nib[k])||0; };
function nibAdd(id,n){ nibFold(); const k=nibKey(id); if(!k) return; S.nib=S.nib||{}; S.nib[k]=(S.nib[k]||0)+n; if(S.nib[k]<=0) delete S.nib[k]; }
const nibRarName = id => { const sp=SPI[id]; return sp?NIB_RAR[Math.min(5,sp.r)]:''; };
const nibOdds = f => { const sp=SPI[f.id]; return sp?Math.min(1,NIB_ODDS[Math.min(5,sp.r)]+rodBonus('nib')+.04*pr('nibbler')+pathAdd('nibodds')):0; }; /* [14] Nibble Pouch adds to the chance */
const nibAmount = f => 1+(f.sh?2:0)+(f.hy?2:0)+(f.sh===2?2:0);
const nibIncome = fed => 1+.08*Math.pow(fed||0,.8);
const nibBuffCount = f => (f.ab?1:0)+(f.ab2?1:0)+((f.abx&&f.abx.length)||0);
function nibHalve(){ nibFold(); const o={}; for(const k in (S.nib||{})){ const n=Math.floor(S.nib[k]*Math.min(.95,NIB_KEEP+voyAdd('nibkeep'))); if(n>0) o[k]=n; } return o; }
const NIB_WORD = n => n+' Nibble'+(n===1?'':'s');

// income and bonuses of a fed fish
{ const _base=aqFishBase; aqFishBase=function(f){ const v=_base(f); return f ? v*(f.fed?nibIncome(f.fed):1)*(1+FEED_INC*(f.fdi||0)) : v; }; /* Nibbles, and C28 feeding gains */
  const _buffs=aqBuffsOf; aqBuffsOf=function(f){ const L=_buffs(f); if(!f) return L; const sp=SPI[f.id];
    if(sp&&f.abx) for(const b of f.abx) if(b&&BK[b.k]) L.push({k:b.k, v:AQ_MAG2[clamp(b.t|0,0,5)]*(b.w||1), t:b.t, nib:1});
    if(f.nbst||f.fdb){ const m=(1+NIB_BOOST*(f.nbst||0))*(1+FEED_BOOST*(f.fdb||0)); for(const e of L) e.v*=m; } return L; }; }

// scrap and feed
let NIB_ANIM=null;
/* one fish: removes it and returns the Nibbles it gave (0 on a miss); shared by Scrap and Scrap all */
function nibScrapOne(f){ const sp=SPI[f.id], ok=Math.random()<nibOdds(f); S.stats.scrapped=(S.stats.scrapped||0)+1;
  if(!ok) return 0; const n=nibAmount(f)+(maxed('nibbler')?1:0)+Math.round(pathAdd('nibplus')); NIB_UP=null; const up=sp.r<5&&Math.random()<.01*pr('nibbler')?SP.find(s=>s.r===sp.r+1):null; if(up) NIB_UP=up.id; nibAdd(up?up.id:sp.id,n); return n; } /* Candy Maker: 1% a rank that the Nibbles are a rarity higher (director, 2026-11-23) */
let NIB_UP=null;
function nibScrap(i){ const f=S.cooler[i]; if(!f||!SPI[f.id]) return 'skip'; const sp=SPI[f.id]; S.cooler.splice(i,1); const n=nibScrapOne(f);
  if(n){ sfx.coin(); toast('+'+nibTierWord(NIB_UP||sp.id,n)+(NIB_UP?' (a rarity higher!)':'')+' for your Aquarium.'); } else toast('Scrapped. No Nibbles this time.'); /* Cam's list #1: the message names the Nibble tier, not the fish */
  return 'render'; }
/* C11 (director + Cam, 2026-11-20): Scrap all, like Sell all and with the same filters (what Sell all would sell gets scrapped) */
function nibScrapAll(){ const go=S.cooler.filter(f=>!sellKeep(f)&&SPI[f.id]); if(!go.length) return 'skip'; S.cooler=S.cooler.filter(f=>!go.includes(f)); let got=0; const by={}; for(const f of go){ const n=nibScrapOne(f); if(n){ got+=n; const r=SPI[f.id].r; by[r]=(by[r]||0)+n; } }
  if(got) sfx.coin(); toast('Scrapped '+go.length+' fish: '+(got?Object.keys(by).sort((a,b)=>a-b).map(r=>'+'+by[r]+' '+NIB_TIER[Math.min(5,r)]).join(', ')+' Nibbles.':'no Nibbles this time.')); return 'render'; }
const NIB_TIER=['Common','Uncommon','Rare','Epic','Legendary','Mythic'];
const nibTierWord = (id,n) => n+' '+NIB_TIER[Math.min(5,(SPI[id]||{r:0}).r)]+' Nibble'+(n===1?'':'s');
function nibFeed(i){ const f=S.tank[i]; if(!f||!SPI[f.id]||nibOf(f.id)<1) return 'skip'; const sp=SPI[f.id]; accrue();
  nibAdd(sp.id,-1); f.fed=(f.fed||0)+1; let msg=sp.name+' ate a Nibble: '+fmt(Math.round(fishRate(f)*60))+' coins per hour now.';
  if(f.fed%NIB_STEP===0){ const ch=f.fed%NIB_BIG===0?NIB_ADD_BIG:NIB_ADD;
    if(nibBuffCount(f)<NIB_MAX_BUFFS&&Math.random()<ch){ const b=rollAqBuff(sp,f.kg); f.abx=(f.abx||[]).concat([b]); msg=sp.name+' grew a new bonus: +'+BK[b.k]+'!'; }
    else { f.nbst=(f.nbst||0)+1; msg=sp.name+'’s bonuses grew stronger (+'+Math.round(NIB_BOOST*100*f.nbst)+'%).'; } }
  NIB_ANIM={f, t0:performance.now(), col:sp.col||'#ffd36a', col2:sp.belly||'#fff3c8', beh:sp.beh}; sfx.coin(); toast(msg); save(); return f.fed%NIB_STEP!==0&&nibPatch()?'skip':'render'; }
/* Cam's list #9: a plain feed updates the page in place (the feed buttons, each fish's coins an hour, the earnings) instead of rebuilding
   the whole Aquarium, which made the phone screen jump; a feed that grows a bonus still redraws the page (its boosts change) */
function nibPatch(){ const P=$('panel'); if(!P||S.tab!=='aquarium') return false; const bs=[...P.querySelectorAll('[data-act="nibfeed"]')]; if(!bs.length) return false; const sh=aqShownRates();
  for(const b of bs){ const i=+b.dataset.i, f=S.tank[i]; if(!f) return false; const row=b.closest('.fishrow'), html=nibFeedBtn(f,i);
    if(html){ const t=document.createElement('template'); t.innerHTML=html.trim(); b.replaceWith(t.content.firstElementChild); } else b.remove();
    const v=row&&row.querySelector('.val .coin'); if(v) v.textContent=fmt(sh[i]); const sm=row&&row.querySelector('.nm small'); if(sm){ const sp=SPI[f.id]; sm.innerHTML=`${RAR[sp.r].k} · ${kgStr(f.kg)}${tags(f)} · <span class="aq">${aqTxt(f)}</span>${nibFedTxt(f)}`; } }
  const e=P.querySelector('.bank b.coin'); if(e){ const r=tankRate()*60; e.textContent=fmtShort(r); e.title=fmt(r)+' coins an hour'; } return true; }
{ const _ea7=extraAct7; extraAct7=function(b){ const i=+b.dataset.i; if(b.dataset.act==='scrap') return nibScrap(i); if(b.dataset.act==='scrapall') return nibScrapAll(); if(b.dataset.act==='nibfeed') return nibFeed(i); return _ea7(b); }; }

// ---- C28 (director + Cam, 2026-11-20): feeding the aquarium. Every fish swims up to the falling food (each at its own moment and spot),
// eats, and goes back. Each feed: FEED_SMALL chance one fish's bonuses grow a little (not its income); FEED_BIG chance one fish earns
// more and gains another bonus. Feel calls: the chances and sizes below.
function feedRoll(){ const T=S.tank.filter(f=>f&&SPI[f.id]); if(!T.length) return; const msgs=[];
  if(Math.random()<FEED_SMALL){ const f=pick(T); f.fdb=(f.fdb||0)+1; msgs.push(SPI[f.id].name+': bonuses +'+Math.round(FEED_BOOST*100*f.fdb)+'%'); }
  if(Math.random()<FEED_BIG){ const f=pick(T), sp=SPI[f.id]; f.fdi=(f.fdi||0)+1; let m=sp.name+' earns '+Math.round(FEED_INC*100*f.fdi)+'% more'; if(nibBuffCount(f)<NIB_MAX_BUFFS){ const b=rollAqBuff(sp,f.kg); f.abx=(f.abx||[]).concat([b]); m+=', new bonus +'+BK[b.k]; } msgs.push(m); }
  if(msgs.length){ save(); setTimeout(()=>toast('Fed! '+msgs.join(' · ')),1600); } }
function feedMove(f,M,i,w,h){ if(!feedAnim) return; const k=(performance.now()-feedAnim)/1000; if(k>7){ return; }
  const st=.4+(i%7)*.32, go=clamp((k-st)/1.1,0,1), back=clamp((k-st-2.3)/1.2,0,1), e=go*(1-back), s=e*e*(3-2*e); if(s<=0) return;
  const tx=w*(.3+((i*37)%40)/100), ty=Math.max(h*.12,Math.min(h*.5,k*30*(.6+((i*13)%10)/20)+((i*7)%20)))+6; /* a flake's spot, just under it */
  M.x+=(tx-M.x)*s; M.y+=(ty+Math.sin(k*9+i)*2-M.y)*s; if(s>.2) M.dir=tx>=M.x; M.wag=(M.wag||5)*(1+s*1.2); }
// the tank: the Nibble drops, the fish swims up and eats it (how depends on how it swims), then goes back to its own path
function nibMove(f,M,t,w,h){ const A=NIB_ANIM; if(!A||A.f!==f) return; const k=(performance.now()-A.t0)/1000;
  const speed=A.beh==='dart'||A.beh==='run'?1.6:A.beh==='sulk'||A.beh==='calm'?.7:1, go=clamp((k-.35)*speed/1.1,0,1), back=clamp((k-1.9/speed)/.9,0,1), e=go*(1-back), s=e*e*(3-2*e);
  if(!A.x0){ A.x0=clamp(M.x,w*.12,w*.88); A.yC=h*.32; } const cy=Math.min(A.yC, -8+k*h*.5);
  M.x+=(A.x0-M.x)*s; M.y+=(cy+(A.beh==='jump'&&k>1.2&&k<1.6?-14*Math.sin((k-1.2)/.4*Math.PI):0)-M.y)*s; if(s>.2) M.dir=A.x0>=M.x; M.wag=(M.wag||5)*(1+s*1.5);
  if(k>=1.6/speed&&!A.eaten){ A.eaten=true; A.ex=A.x0; A.ey=cy; } if(k>3.4/speed) NIB_ANIM=null; }
function nibDraw(c,t,w,h){ const A=NIB_ANIM; if(!A) return; const k=(performance.now()-A.t0)/1000;
  if(!A.eaten){ const x=A.x0||w*.5, y=Math.min(A.yC||h*.32, -8+k*h*.5)+Math.sin(k*5)*1.5; c.save(); c.fillStyle=A.col; c.beginPath(); c.arc(x,y,5,0,7); c.fill(); c.fillStyle=A.col2; c.beginPath(); c.arc(x-1.5,y-1.5,2,0,7); c.fill(); c.strokeStyle='rgba(255,255,255,.55)'; c.lineWidth=1; c.beginPath(); c.arc(x,y,5,0,7); c.stroke(); c.restore(); }
  else { const q=clamp((performance.now()-A.t0)/1000-1.6,0,.6)/.6; if(q<1){ c.save(); c.globalAlpha=1-q; c.fillStyle=A.col2; for(let i=0;i<6;i++){ const a=i*1.05; c.beginPath(); c.arc(A.ex+Math.cos(a)*q*14,A.ey+Math.sin(a)*q*14,1.6,0,7); c.fill(); } c.restore(); } } }

// page parts: Scrap in the Cooler, Feed in the Aquarium, Nibbles in the Fish Log details, what a trophy ate
function nibScrapBtn(f,i){ const p=Math.round(nibOdds(f)*100), n=nibAmount(f), sp=SPI[f.id]; return `<button class="btn alt sm" data-act="scrap" data-i="${i}" title="Scrap: ${p}% chance of ${n} ${nibRarName(sp.id)} Nibble${n===1?'':'s'}. Feed them to any ${nibRarName(sp.id)} fish in the Aquarium to make it earn more.">Scrap</button>`; }
function nibFeedBtn(f,i){ const n=nibOf(f.id); if(!n&&!f.fed) return ''; return `<button class="btn ${n?'':'alt '}sm nibbtn" data-act="nibfeed" data-i="${i}" ${n?'':'disabled'} title="${n?'Feed it a Nibble: more coins per hour. Every '+NIB_STEP+' Nibbles its bonuses grow.':'Scrap '+nibRarName(f.id)+' fish in the Cooler to get Nibbles'}">Feed · ${n}</button>`; }
const nibFedTxt = f => f&&f.fed ? ' · ate '+NIB_WORD(f.fed) : '';
document.head.insertAdjacentHTML('beforeend','<style>#panel .nibbtn{white-space:nowrap}</style>');
