
// =====================================================================
// Update 1.6: skill specialisations & mastery effects, pearl relics,
// rare weathers, richer bounties
// =====================================================================
// ---------- specialisations: one choice per tier (rebalanced 2026-11-17: pure upsides, unlock at levels 5-25) ----------
const SPEC_TIERS = [
 {lvl:5,  name:'Style', opts:[
   ['speedy','Quick Draw','Bites come 20% faster.',''],
   ['patient','Still Waters','Rare odds +20%.',''],
   ['tinker','Tinkerer','Junk and treasure ×1.6.','']]},
 {lvl:10, name:'Fight', opts:[
   ['brawler','Brawler','Reel 20% faster.',''],
   ['gentle','Gentle Giant','Fish tempers rise 35% slower.',''],
   ['acrobat','Acrobat','Jumps and head-shakes strain your line 50% less.','']]},
 {lvl:15, name:'Trade', opts:[
   ['merchant','Merchant','Sale price +12%.',''],
   ['curator','Curator','Aquarium income +25% and 2 extra decoration spots.',''],
   ['collector','Collector','Mastery stars give +15% value each (not 10%), new species give triple XP.','']]},
 {lvl:20, name:'Legacy', opts:[
   ['mythseeker','Myth Seeker','Legendary and rarer fish ×1.4.',''],
   ['shinyhunter','Shiny Hunter','Shiny fish ×1.6.',''],
   ['trophyking','Trophy King','Trophy-size fish ×1.6, and worth ×2 (not ×1.5).','']]},
];
const spec = id => !!(S.specs && Object.values(S.specs).includes(id));
const specFee = tier => 2000*(tier+1)*(tier+1);
const maxed = k => pr(k) >= PERKS[k].max;
// what each skill does once it is fully learned
const MASTERY_FX = {
  steady:'Second wind: once per fight, your line survives a snap.',
  strong:'Power start: the first 2 seconds of every fight reel twice as fast.',
  softtouch:'Calm aura: fish lose their temper twice as fast whenever you let go.',
  reflex:'Lightning hook: a perfect hook pulls the fish halfway in.',
  patience:'Every 10th cast bites almost instantly.',
  lucky:'Every 25th catch is at least Rare.',
  caster:'Bullseye: a full-power cast makes its own little hotspot.',
  trophy:'Trophy-size fish give double Scales.',
  reader:'Hotspots last twice as long.',
  scavenger:'Junk pays 50% more coins.',
  haggler:'The fishmonger’s wanted fish pays ×3 instead of ×2.',
  keeper:'The aquarium keeps earning for 16 hours while you’re away, not 8.',
  petpal:'Petting sometimes earns a little gift from your pet (once an hour).',
  streaker:'A lost fish only halves your streak instead of ending it.',
  nightowl:'Night fish also bite at dawn.',
};
const offlineCap = () => maxed('keeper') ? 16*60 : OFFLINE_CAP_MIN;
function renderSkills2(P){ const free=ptsFree(), cost=50*S.lvl;
  const specRow=(T,ti)=>{ const cur=S.specs[ti], locked=S.lvl<T.lvl;
    return `<div class="tile ${cur?'done':''}" style="${locked?'opacity:.55':''}"><div class="row spread"><h4>${T.name} <span class="meta">· level ${T.lvl}</span></h4>${cur?`<span class="badge g">${SPEC_TIERS[ti].opts.find(o=>o[0]===cur)[1]}</span>`:locked?'<span class="meta">Locked</span>':'<span class="badge">Choose one</span>'}</div>
     <div class="grid" style="grid-template-columns:repeat(auto-fill,minmax(180px,1fr));margin-top:6px">${T.opts.map(o=>{ const on=cur===o[0];
       return `<button class="spec ${on?'on':''}" data-act="spec" data-k="${ti}:${o[0]}" ${locked||on||(cur&&S.money<specFee(ti))?'disabled':''}><b>${o[1]}</b><span class="up">▲ ${o[2]}</span><span class="down">▼ ${o[3]}</span>${cur&&!on&&!locked?`<span class="meta">Switch · ${fmt(specFee(ti))} coins</span>`:''}</button>`; }).join('')}</div></div>`; };
  P.innerHTML=`<div class="row spread"><div><h2>Skills</h2><p class="sub">Two kinds of growth. <b>Paths</b> are big specialties, one per tier. <b>Skills</b> are small steady gains, and each one unlocks a special effect when fully learned.</p></div>
   <div class="row"><div style="text-align:right"><div class="pts">${free}</div><div class="sub">skill points</div></div><button class="btn alt" data-act="respec" ${ptsSpent()&&S.money>=cost?'':'disabled'}>Reset skills · <span class="coin">${fmt(cost)}</span></button></div></div>
   <div class="tile" style="margin-top:10px;flex-direction:row;align-items:center;justify-content:space-between"><span class="meta">Looking for specialisations? They have their own <b>Paths</b> tab now.</span><button class="btn alt sm" data-tabgo="paths">Open Paths</button></div>
   <div class="grid">`+Object.entries(PERKS).map(([k,p])=>{ const r=pr(k), mx=r>=p.max;
    return `<div class="tile ${mx?'done':''}"><div class="row spread"><h4>${p.name}</h4><span class="meta">Rank ${r} / ${p.max}</span></div>
     <div class="pips">${Array.from({length:p.max},(_,i)=>`<i class="${i<r?'on':''}"></i>`).join('')}</div><div class="meta">${p.d} Each rank: ${p.per}.</div>
     <div class="meta" style="color:${mx?'var(--gold)':'var(--muted)'}">${mx?'★ ':'At max rank: '}${MASTERY_FX[k]}</div>
     <button class="btn" data-act="perk" data-k="${k}" ${free>0&&r<p.max?'':'disabled'}>${mx?'Mastered':'Learn rank '+(r+1)}</button></div>`; }).join('')+'</div>'; }

// ---------- pearl relics ----------
const RELICS = [
 ['headstart','Head Start',1,'Start every voyage with 25,000 coins.'],
 ['mentor','Old Mentor',1,'+25% XP, always.'],
 ['tacklebox','Old Tackle Box',1,'Keep all your bait when you set sail.'],
 ['pockets','Deep Pockets',1,'Junk pays 25% more coins.'],
 ['charts','Sea Charts',2,'New waters cost 30% less to unlock.'],
 ['compass','Brass Compass',2,'Hotspots appear 40% more often.'],
 ['tidecaller','Tide Caller',2,'+30% Tide Pass XP.'],
 ['goldhook','Golden Hook',2,'+0.15 s hook window, and perfect hooks add 10% value.'],
 ['luckypearl','Lucky Pearl',2,'+50% shiny chance.'],
 ['seasoned','Seasoned Angler',3,'Start every voyage with every piece of tackle at level 3.'],
].map(a=>({id:a[0],name:a[1],cost:a[2],d:a[3]}));
const relic = id => S.relics && S.relics.includes(id);
const locCost = L => Math.round(L.cost*(relic('charts')?.7:1));
function relicHTML(){ return `<div class="jsec"><h2>Pearl relics</h2><p class="sub">Spend Wisdom Pearls on permanent relics. Every pearl you spend gives up its +25% coins and XP and its rare-odds boost, so choose what matters to you. You have <b>${S.pearls}</b> pearl${S.pearls===1?'':'s'}.</p>
  <div class="grid">${RELICS.map(r=>{ const own=relic(r.id); return `<div class="tile ${own?'done':''}"><div class="row spread"><h4>${r.name}</h4><span class="meta">${r.cost} pearl${r.cost>1?'s':''}</span></div><div class="meta">${r.d}</div>
   ${own?'<span class="badge g">Owned forever</span>':`<button class="btn sm" data-act="relic" data-k="${r.id}" ${S.pearls>=r.cost?'':'disabled'}>Trade ${r.cost} pearl${r.cost>1?'s':''}</button>`}</div>`; }).join('')}</div></div>`; }

// ---------- rare weathers ----------
let fishRain=null;
function drawWeatherX(t,wx,hz){ if(!S.settings.effects||WXA<.01) return; g.save(); g.globalAlpha=WXA; drawWeatherX0(t,wx,hz); g.restore(); }
function drawWeatherX0(t,wx,hz){
  if(wx.k==='Aurora'){ for(let b=0;b<3;b++){ g.strokeStyle=['rgba(90,255,170,','rgba(160,120,255,','rgba(90,220,255,'][b]+'.22)'; g.lineWidth=16-b*4; g.beginPath(); for(let x=0;x<=W;x+=12){ const y=hz*(.2+b*.12)+Math.sin(x*.008+t*.4+b)*hz*.08+Math.sin(x*.02+t*.7)*6; x?g.lineTo(x,y):g.moveTo(x,y); } g.stroke(); } }
  if(wx.k==='Blood Moon'){ g.fillStyle='rgba(140,10,30,.16)'; g.fillRect(0,0,W,H); const gr=g.createRadialGradient(W*.8,hz*.35,4,W*.8,hz*.35,40); gr.addColorStop(0,'rgba(255,90,80,.95)'); gr.addColorStop(.5,'rgba(200,30,40,.6)'); gr.addColorStop(1,'rgba(200,30,40,0)'); g.fillStyle=gr; g.beginPath(); g.arc(W*.8,hz*.35,40,0,7); g.fill(); }
  // Spawning Run: silvery fish leap out of the water in short arcs and splash back, ripples spreading where they land
  if(wx.k==='Spawning Run'){ if(!fishRain) fishRain=Array.from({length:9},(_,i)=>[Math.random(),.25+Math.random()*.7,1.1+Math.random()*.9,i*.7+Math.random()*3]);
    for(const f of fishRain){ const per=f[2]+1.6, k=((t+f[3])%per)/f[2]; const x0=W*(.28+f[0]*.68), y0=hz+(H-hz)*f[1]*.85, s=.55+f[1]*.9, arcW=W*.05*s, arcH=H*.07*s;
      if(k<=1){ const x=x0+arcW*k, y=y0-Math.sin(k*Math.PI)*arcH, a=Math.atan2(-Math.cos(k*Math.PI)*arcH*Math.PI, arcW);
        g.save(); g.translate(x,y); g.rotate(a); drawFish(g,0,0,14*s,'#c8d4e0','#f4f8ff',.4,t*16,false,{}); g.restore();
        g.fillStyle='rgba(255,255,255,.8)'; g.fillRect(x+2,y-2,1.6,1.6); }
      const kr=k-1; if(kr>0&&kr<1.2){ const e=kr/1.2; g.strokeStyle='rgba(235,245,255,'+(.55*(1-e))+')'; g.lineWidth=1.2; g.beginPath(); g.ellipse(x0+arcW,y0,3+e*16*s,1+e*5*s,0,0,7); g.stroke(); }
      if(k<.12||(k>.9&&k<1.05)){ const sx=k<.5?x0:x0+arcW; g.fillStyle='rgba(235,245,255,.7)'; for(let i=0;i<4;i++) g.fillRect(sx-4*s+i*2.6*s,y0-2-((i*7)%5)*s,1.4,1.4); } } } }

// ---------- bounties with more variety ----------
const STYLE_BOUNTY = ['jump','run','thrash','dive','sulk','dart'];
function makeBounty2(L){ const r=Math.random(); L=L||pick(S.unlocked); const base=LOCS[locIdx(L)].loot;
  if(r<.12) return {type:'trophy', loc:L, n:1, have:0, reward:Math.round(base*6), scales:4};
  if(r<.24){ const opts=STYLE_BOUNTY.filter(k=>SP.some(s=>s.loc===L&&s.beh===k)), st=pick(opts.length?opts:STYLE_BOUNTY); return {type:'style', loc:L, beh:st, n:rint(3,6), have:0, reward:Math.round(bestLoot()*3), scales:3}; }
  if(r<.3) return {type:'shiny', loc:L, n:1, have:0, reward:Math.round(bestLoot()*12), scales:10};
  return null; }
function bountyText(b){ if(b.type==='trophy') return {what:'Catch any trophy-size fish at '+LOCS[locIdx(b.loc)].name, where:LOCS[locIdx(b.loc)].name};
  const wn=b.loc?LOCS[locIdx(b.loc)].name:'Any water'; if(b.type==='style') return {what:'Catch '+b.n+' '+BEH[b.beh].n.toLowerCase()+'s'+(b.loc?' at '+wn:''), where:wn}; if(b.type==='shiny') return {what:'Catch any shiny fish'+(b.loc?' at '+wn:''), where:wn}; return null; }
function checkBounties2(f){ const done=[]; for(const b of S.bounties){ if(!['trophy','style','shiny'].includes(b.type)||bDone(b)) continue;
  if(b.type==='trophy' && f.trophy && f.sp.loc===b.loc) b.have=1; const here=!b.loc||f.sp.loc===b.loc; if(b.type==='style' && here && f.sp.beh===b.beh) b.have++; if(b.type==='shiny' && here && f.shiny) b.have=1; if(bDone(b)) done.push(b); } return done; }

// ---------- actions ----------
function extraAct3(b){ const k=b.dataset.k;
  switch(b.dataset.act){
    case 'spec': { const [ti,id]=k.split(':'); const T=SPEC_TIERS[+ti]; if(!T||S.lvl<T.lvl) return 'skip'; const cur=S.specs[ti]; if(cur===id) return 'skip'; if(cur){ const fee=specFee(+ti); if(S.money<fee) return 'skip'; S.money-=fee; }
      S.specs[ti]=id; sfx.catch(3); toast('Specialisation: '+T.opts.find(o=>o[0]===id)[1]+'.'); return 'render'; }
    case 'relic': { const r=RELICS.find(x=>x.id===k); if(!r||relic(k)||S.pearls<r.cost) return 'skip'; S.pearls-=r.cost; S.relics.push(k); sfx.shiny(); toast('Relic gained: '+r.name+'. It’s yours forever.'); return 'render'; }
  }
  return undefined; }
