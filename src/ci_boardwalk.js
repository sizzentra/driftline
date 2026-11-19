// =====================================================================
// 0.4.9 [52] Boardwalk, deeper (director, 2026-11-19: "needs to feel a ton more diverse and deep ... coin rewards do need to come back –
// but at a slightly smaller scale ... ensuring this doesn't break pearl generation ... Focus on tickets with occasional big wins
// sprinkled in to get coins plus tickets ... Gamble with fish in your cooler maybe?"). Shared by every platform.
//  - Coin jackpots: any Boardwalk game that pays tickets has a 4% chance of a coin jackpot on top (15–40× your best water's catch).
//  - Fishmonger's Gamble: stake a fish from your cooler: lose it (and get tickets), or win 1.8×, 3× or 8× its sale price in coins.
//  - Treasure chests: 120 tickets, pick 1 of 3: tickets, Scales, Nibbles, favourite foods, coins, or a pet colour (rarer).
//  Every coin win goes through bwEarn, so Boardwalk coins count for at most a quarter of a voyage's pearl progress.
// =====================================================================
const BW_JACK=.04, CHEST_COST=120;
let gamble=null, chest=null, bwJackLock=false;
const bwCoinWin = mul => bwEarn(Math.round(bestLoot()*mul*coinMult()*pathMul('bwcoin')));
// coin jackpots on top of ticket wins at the Boardwalk
{ const _t=addTickets; addTickets=function(n){ const r=_t(n); try{ if(S.tab==='games'&&!bwJackLock&&n>0&&Math.random()<BW_JACK){ bwJackLock=true; const c=bwCoinWin(rnd(15,40)); setTimeout(()=>{ toast('Coin jackpot! +'+fmt(c)+' coins on top.'); try{ sfx.catch(3); }catch(e){} bwJackLock=false; },400); } }catch(e){ bwJackLock=false; } return r; }; }
// Fishmonger's Gamble
const GAMBLE=[[.5,0,'The Fishmonger keeps it.'],[.35,1.8,'×1.8!'],[.12,3,'×3!'],[.03,8,'JACKPOT ×8!']];
function gambleList(){ return S.cooler.map((f,i)=>({f,i,p:salePrice(f)})).filter(x=>SPI[x.f.id]&&x.p>0).sort((a,b)=>b.p-a.p).slice(0,4); }
function gamblePlay(i){ const f=S.cooler[i]; if(!f||!SPI[f.id]) return 'skip'; const p=salePrice(f), sp=SPI[f.id]; S.cooler.splice(i,1);
  let x=Math.random(), o=GAMBLE[0]; for(const g of GAMBLE){ if(x<g[0]){ o=g; break; } x-=g[0]; }
  if(!o[1]){ const t=addTickets(Math.max(5,Math.round(p/Math.max(1,bestLoot())*8))); gamble={txt:'Your '+sp.name+' is gone. '+o[2]+' You get '+t+' tickets for the trouble.', win:false}; try{ sfx.lost(); }catch(e){} }
  else { const c=bwEarn(Math.round(p*o[1]*pathMul('bwcoin'))); gamble={txt:o[2]+' Your '+sp.name+' (worth '+fmt(p)+') wins '+fmt(c)+' coins.', win:true}; try{ sfx.catch(o[1]>=8?4:2); }catch(e){} }
  S.gstats.gambles=(S.gstats.gambles||0)+1; save(); return 'render'; }
// Treasure chests
function chestPrize(){ const r=Math.random(), base=bestLoot(); const caught=Object.keys(S.journal||{}).filter(id=>SPI[id]);
  if(r<.34) return {k:'tix', n:rint(60,260)}; if(r<.54) return {k:'scales', n:rint(6,24)}; if(r<.70&&caught.length) return {k:'nib', id:pick(caught), n:rint(2,6)};
  if(r<.84) return {k:'food', id:pick(FOOD_KEYS), n:10}; if(r<.97) return {k:'coins', n:rnd(8,30)}; return {k:'petcol'}; }
function chestLabel(p){ return p.k==='tix'?'🎟 '+p.n+' tickets':p.k==='scales'?'◆ '+p.n+' Scales':p.k==='nib'?'🍬 '+p.n+' '+SPI[p.id].name+' Nibbles':p.k==='food'?'🪱 10 '+BAIT[p.id].name:p.k==='coins'?'🪙 Coins':'🎨 Pet colour'; }
function chestGive(p){ if(p.k==='tix') return '+'+addTickets(p.n)+' tickets'; if(p.k==='scales'){ S.scales+=p.n; return '+'+p.n+' Scales'; }
  if(p.k==='nib'){ S.nib=S.nib||{}; S.nib[p.id]=(S.nib[p.id]||0)+p.n; return '+'+p.n+' Nibbles for '+SPI[p.id].name; }
  if(p.k==='food'){ S.bait[p.id]=(S.bait[p.id]||0)+10; return '+10 '+BAIT[p.id].name; }
  if(p.k==='coins') return '+'+fmt(bwCoinWin(p.n))+' coins';
  if(typeof petColourPrize==='function'){ const t=petColourPrize(); if(t) return t; } return '+'+addTickets(400)+' tickets'; }
{ const _ea=extraAct7; extraAct7=function(b){ const a=b.dataset.act;
  if(a==='gamble') return gamblePlay(+b.dataset.i);
  if(a==='chestbuy'){ if(chest&&chest.pick<0) return 'skip'; if(S.tickets<CHEST_COST){ toast('A chest costs '+CHEST_COST+' tickets.'); return 'skip'; } S.tickets-=CHEST_COST; chest={prizes:[chestPrize(),chestPrize(),chestPrize()], pick:-1, msg:''}; save(); return 'render'; }
  if(a==='chestpick'){ const i=+b.dataset.i; if(!chest||chest.pick>=0||!chest.prizes[i]) return 'skip'; chest.pick=i; chest.msg=chestGive(chest.prizes[i]); try{ sfx.shiny(); }catch(e){} save(); return 'render'; }
  return _ea(b); }; }
if(typeof ACT_OK==='object'){ ACT_OK.gamble=(k,i)=>Number.isInteger(i)&&i>=0&&i<S.cooler.length; ACT_OK.chestbuy=()=>true; ACT_OK.chestpick=(k,i)=>Number.isInteger(i)&&i>=0&&i<3; }
{ const _g=bwGamesHTML; bwGamesHTML=function(){ const h=_g(), L=gambleList();
  const gm=bwCard('🐟','#ff6f91','Fishmonger’s Gamble','Stake a fish from your cooler: half the time the Fishmonger keeps it (you get tickets), otherwise you win 1.8×, 3× or even 8× its price in coins. '+(S.gstats.gambles||0)+' played.',
    (gamble?`<div class="val bwx-res" style="color:${gamble.win?'var(--gold)':'var(--muted)'}">${esc(gamble.txt)}</div>`:'')+(L.length?`<div class="bwx-gl">${L.map(x=>`<button class="btn alt sm" data-act="gamble" data-i="${x.i}">${esc(SPI[x.f.id].name)} · <span class="coin">${fmtShort(x.p)}</span></button>`).join('')}</div>`:'<div class="meta">Your cooler is empty: catch something to stake.</div>'),'');
  const ch=bwCard('🧰','#c8a26a','Treasure chests',CHEST_COST+' tickets: three chests, pick one. Tickets, Scales, Nibbles, favourite foods, sometimes coins, and rarely a pet colour you can’t buy.',
    chest?`<div class="ducks">${chest.prizes.map((p,i)=>{ const open=chest.pick>=0; return `<button class="duckb ${open?(i===chest.pick?'picked':'open'):''}" data-act="chestpick" data-i="${i}" ${open?'disabled':''} aria-label="Chest ${i+1}">${open?esc(chestLabel(p)):'🧰'}</button>`; }).join('')}</div>${chest.pick>=0?`<div class="val bwx-res">${esc(chest.msg)}</div>`:''}`:'<div class="bwx-art">🧰 🧰 🧰</div>',
    `<button class="btn${chest&&chest.pick<0?' alt':''}" data-act="chestbuy" ${S.tickets>=CHEST_COST&&!(chest&&chest.pick<0)?'':'disabled'}>${chest?'Another chest':'Open'} · 🎟 ${CHEST_COST}</button>`);
  const k=h.lastIndexOf('</div>'); return k>0 ? h.slice(0,k)+gm+ch+h.slice(k) : h+gm+ch; }; }
document.head.insertAdjacentHTML('beforeend','<style>.bwx-gl{display:flex;flex-wrap:wrap;gap:6px}.bwx-gl .btn{white-space:nowrap}</style>');
