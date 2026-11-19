// =====================================================================
// 0.4.9 [19] Fish Nibbles (director, 2026-11-19: "make even fish from earlier zones reasonable to keep longer term ... Scrapping gives
// Fish Nibbles - a type of candy that can be used to level up your favourite fish"). Shared by every platform.
//  - Scrap a fish in the Cooler: Nibbles of THAT species. Common/uncommon always, rare 50%, epic 1 in 3, legendary/mythic 25%.
//    1 Nibble, +2 shiny, +2 hybrid, +2 titled (prismatic): at most 7.
//  - Feed them in the Aquarium only, to a fish of that species: a Nibble in the fish's colours drops into the tank and the fish
//    swims up to eat it, in its own way. Each Nibble raises that fish's income (diminishing returns that still scale).
//  - Every 10 Nibbles: the fish's bonuses get stronger, or (10% chance, 50% every 30th) it gains another bonus, up to 5.
//  - Half of every species' Nibbles expire when you set sail again. The Fish Log shows your Nibbles, the Trophy Room what a fish ate.
// =====================================================================
const NIB_ODDS=[1,1,.5,1/3,.25,.25], NIB_KEEP=.5, NIB_MAX_BUFFS=5, NIB_STEP=10, NIB_BIG=30, NIB_ADD=.1, NIB_ADD_BIG=.5, NIB_BOOST=.15;
const nibOf = id => (S.nib&&S.nib[id])||0;
const nibOdds = f => { const sp=SPI[f.id]; return sp?NIB_ODDS[Math.min(5,sp.r)]:0; };
const nibAmount = f => 1+(f.sh?2:0)+(f.hy?2:0)+(f.sh===2?2:0);
const nibIncome = fed => 1+.08*Math.pow(fed||0,.8);
const nibBuffCount = f => (f.ab?1:0)+(f.ab2?1:0)+((f.abx&&f.abx.length)||0);
function nibHalve(){ const o={}; for(const k in (S.nib||{})){ const n=Math.floor(S.nib[k]*NIB_KEEP); if(n>0) o[k]=n; } return o; }
const NIB_WORD = n => n+' Nibble'+(n===1?'':'s');

// income and bonuses of a fed fish
{ const _base=aqFishBase; aqFishBase=function(f){ const v=_base(f); return f&&f.fed ? v*nibIncome(f.fed) : v; };
  const _buffs=aqBuffsOf; aqBuffsOf=function(f){ const L=_buffs(f); if(!f) return L; const sp=SPI[f.id];
    if(sp&&f.abx) for(const b of f.abx) if(b&&BK[b.k]) L.push({k:b.k, v:AQ_MAG2[clamp(b.t|0,0,5)]*(b.w||1), t:b.t, nib:1});
    if(f.nbst){ const m=1+NIB_BOOST*f.nbst; for(const e of L) e.v*=m; } return L; }; }

// scrap and feed
let NIB_ANIM=null;
function nibScrap(i){ const f=S.cooler[i]; if(!f||!SPI[f.id]) return 'skip'; const sp=SPI[f.id], ok=Math.random()<nibOdds(f); S.cooler.splice(i,1);
  S.stats.scrapped=(S.stats.scrapped||0)+1;
  if(ok){ const n=nibAmount(f); S.nib=S.nib||{}; S.nib[sp.id]=nibOf(sp.id)+n; sfx.coin(); toast('Scrapped: +'+NIB_WORD(n)+' for '+sp.name+'. Feed them to a '+sp.name+' in your Aquarium.'); }
  else toast('Scrapped the '+sp.name+', but no Nibbles this time.');
  return 'render'; }
function nibFeed(i){ const f=S.tank[i]; if(!f||!SPI[f.id]||nibOf(f.id)<1) return 'skip'; const sp=SPI[f.id]; accrue();
  S.nib[sp.id]--; if(!S.nib[sp.id]) delete S.nib[sp.id]; f.fed=(f.fed||0)+1; let msg=sp.name+' ate a Nibble: '+fmt(Math.round(fishRate(f)*60))+' coins per hour now.';
  if(f.fed%NIB_STEP===0){ const ch=f.fed%NIB_BIG===0?NIB_ADD_BIG:NIB_ADD;
    if(nibBuffCount(f)<NIB_MAX_BUFFS&&Math.random()<ch){ const b=rollAqBuff(sp,f.kg); f.abx=(f.abx||[]).concat([b]); msg=sp.name+' grew a new bonus: +'+BK[b.k]+'!'; }
    else { f.nbst=(f.nbst||0)+1; msg=sp.name+'’s bonuses grew stronger (+'+Math.round(NIB_BOOST*100*f.nbst)+'%).'; } }
  NIB_ANIM={f, t0:performance.now(), col:sp.col||'#ffd36a', col2:sp.belly||'#fff3c8', beh:sp.beh}; sfx.coin(); toast(msg); return 'render'; }
{ const _ea7=extraAct7; extraAct7=function(b){ const i=+b.dataset.i; if(b.dataset.act==='scrap') return nibScrap(i); if(b.dataset.act==='nibfeed') return nibFeed(i); return _ea7(b); }; }

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
function nibScrapBtn(f,i){ const p=Math.round(nibOdds(f)*100), n=nibAmount(f), sp=SPI[f.id]; return `<button class="btn alt sm" data-act="scrap" data-i="${i}" title="Scrap for Fish Nibbles: ${p}% chance of ${NIB_WORD(n)} for ${esc(sp.name)}. Feed them to a ${esc(sp.name)} in your Aquarium to make it earn more.">Scrap</button>`; }
function nibFeedBtn(f,i){ const n=nibOf(f.id); if(!n&&!f.fed) return ''; return `<button class="btn ${n?'':'alt '}sm nibbtn" data-act="nibfeed" data-i="${i}" ${n?'':'disabled'} title="${n?'Feed it a Nibble: more coins per hour. Every '+NIB_STEP+' Nibbles its bonuses grow.':'Scrap '+esc(SPI[f.id].name)+' fish in the Cooler to get Nibbles'}">Feed · ${n}</button>`; }
const nibFedTxt = f => f&&f.fed ? ' · ate '+NIB_WORD(f.fed) : '';
document.head.insertAdjacentHTML('beforeend','<style>#panel .nibbtn{white-space:nowrap}</style>');
