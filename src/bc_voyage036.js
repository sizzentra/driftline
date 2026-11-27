// =====================================================================
// 0.3.6 voyages revamped. Every voyage you complete now counts for something on top of the pearls:
//  - Legacy: +10% coins and XP for each completed voyage (+5% each after the tenth), and a little rare luck.
//  - Pearl yield grows with experience: +15% pearls per completed voyage, up to triple.
//  - Voyage milestones unlock permanent perks at 1, 2, 3, 5, 7 and 10 voyages.
//  - Four new, stronger relics.
//  - Setting sail moves your aquarium fish into the Trophy Room (kept forever, but no longer earning), so the
//    aquarium's income and boosts are earned again each voyage. If the Trophy Room is full they stay in the tank.
// =====================================================================
function voyageLegacy(){ const v=(S&&S.tides)||0; return .10*Math.min(v,10) + .05*Math.max(0,v-10); }
function voyagePearlMult(){ const v=(S&&S.tides)||0; return Math.min(3, 1+.15*v); }
const VOYAGE_MS=[
 {n:1,  name:'A Head Start',       d:'Begin every voyage with 10,000 coins.'},
 {n:2,  name:'Familiar Waters',    d:'Begin every voyage with Stonebrook River already unlocked.'},
 {n:3,  name:'A Bigger Cooler',    d:'+2 cooler space at every cooler size, forever.'},
 {n:5,  name:'Bait Stash',         d:'Begin every voyage with 20 Glow Lures.'},
 {n:7,  name:'Old Tackle',         d:'Begin every voyage with every piece of tackle at level 2 or better.'},
 {n:10, name:'Sea Legs',           d:'Begin every voyage with Saltmarsh Coast already unlocked too.'},
];
const voyMs = n => ((S&&S.tides)||0) >= n;

// new relics (they appear in the Pearl relics list and use the same trade button)
[['tankkeeper','Tank Keeper',3,'Your aquarium earns 30% more.'],
 ['widenet','Wide Net',3,'+3 cooler space at every cooler size.'],
 ['abyssal','Abyssal Charm',4,'Noticeably better odds of rare fish, everywhere.'],
 ['pearlseeker','Pearl Seeker',4,'+1 extra pearl every time you set sail.'],
].forEach(a=>{ if(!RELICS.some(r=>r.id===a[0])) RELICS.push({id:a[0],name:a[1],cost:a[2],d:a[3]}); });

// relic and Legacy effects flow through the normal bonus pipeline (aquarium income, rare odds)
{ const _bonus=bonus; bonus=function(k){ let v=_bonus(k); if(k==='tank'&&relic('tankkeeper')) v+=.3; if(k==='rare'){ if(relic('abyssal')) v+=.12; v+=.02*Math.min((S.tides||0),10); } return v; }; }

// cooler space from the milestone and the relic: added to every cooler size once (gear data is not saved)
const COOLER_BASE=GEAR.cooler.lv.slice();
function voyApplyCooler(){ const extra=(voyMs(3)?2:0)+(relic('widenet')?3:0); GEAR.cooler.lv=COOLER_BASE.map(v=>v+extra); }
voyApplyCooler();

// setting sail: remember the aquarium, then apply the milestones once the voyage has reset
document.addEventListener('click',e=>{ const b=e.target.closest&&e.target.closest('[data-act="retireok"]'); if(!b||!canRetire()) return;
  const before=S.tides, tank=S.tank.slice();
  setTimeout(()=>{ if(S.tides===before) return; // the voyage did not happen
    // aquarium fish go to the Trophy Room (as many as fit); the rest stay on display
    let moved=0; if(tank.length){ const V=vaultList(); for(const f of tank){ if(V.length>=VAULT_MAX) break; const e2=Object.assign({},f); e2.kept=Date.now(); if(!e2.loc&&SPI[f.id]) e2.loc=SPI[f.id].loc; V.push(e2); moved++; } S.tank.splice(0,moved); }
    if(voyMs(1)) S.money+=10000;
    if(voyMs(2)&&!S.unlocked.includes('river')) S.unlocked.push('river');
    if(voyMs(10)&&!S.unlocked.includes('coast')) S.unlocked.push('coast');
    if(voyMs(5)) S.bait.glow=(S.bait.glow||0)+20;
    if(voyMs(7)) for(const k in S.gear) S.gear[k]=Math.max(S.gear[k],Math.min(2,GEAR[k].lv.length-1));
    voyApplyCooler(); save(); try{ renderPanel(); refreshAll&&refreshAll(); }catch(er){ oops('bc_voyage036:renderPanel',er); }
    const ms=VOYAGE_MS.find(m=>m.n===S.tides);
    setTimeout(()=>toast((moved?moved+' aquarium fish '+(moved===1?'was':'were')+' mounted in your Trophy Room. ':'')+(ms?'New voyage milestone: '+ms.name+'!':'Legacy is now +'+Math.round(voyageLegacy()*100)+'%.')),900);
  },0); },true);

document.head.insertAdjacentHTML('beforeend',`<style>
.voy-stats{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px;margin:8px 0}
.voy-stats>div{display:flex;flex-direction:column;align-items:flex-start;padding:8px 10px;border-radius:12px;border:1px solid var(--line,#26385180);background:#0e1828}
.voy-stats b{font-family:var(--display);font-size:20px;color:var(--ink,#eef3f8)}
.voy-list{display:flex;flex-direction:column;gap:6px;margin-top:6px}
.voy-ms{display:grid;grid-template-columns:30px minmax(0,1fr) auto;gap:10px;align-items:center;padding:7px 10px;border-radius:12px;border:1px solid var(--line,#26385180);background:#0e1828}
.voy-ms .voy-n{width:28px;height:28px;border-radius:50%;display:flex;align-items:center;justify-content:center;font:800 13px var(--display);background:#17253a;color:#97abc2;border:1px solid var(--line,#26385180)}
.voy-ms.got{border-color:#7fe3c455}.voy-ms.got .voy-n{background:linear-gradient(180deg,#7fe3c4,#3fb894);color:#062018;border-color:#bff5e2}
.voy-ms>span.meta{white-space:nowrap;font-size:11.5px}
.voy-confirm{border-color:var(--danger)!important}
@container (max-width:520px){.voy-stats{grid-template-columns:1fr 1fr}.voy-ms{grid-template-columns:28px minmax(0,1fr)}.voy-ms>span.meta{grid-column:2}}
</style>`);

// ---------- tiny hybrids: smaller than their species' normal range = stronger aquarium boosts ----------
// ×1 just below the normal minimum, rising to ×3 at about 1/15 of it (on top of the usual hybrid ×1.5).
function tinyHybridK(f){ const sp=f&&SPI[f.id]; if(!sp||!f.hy||!(f.kg>0)||f.kg>=sp.min) return 1; return Math.min(3, 1+.75*Math.log(sp.min/f.kg)); }
{ const _aq=aqBuffsOf; aqBuffsOf=function(f){ const L=_aq(f), k=tinyHybridK(f); if(k>1) for(const e of L) e.v*=k; return L; }; }
{ const _sc=showCard; showCard=function(o){ const ce=G.lastEntry; _sc(o); try{ const k=tinyHybridK(ce); if(k>1){ const b=$('cardbadges'); if(b&&!b.querySelector('.tinyhy')) b.insertAdjacentHTML('beforeend',`<span class="badge g tinyhy" title="Smaller than its species ever grows: its aquarium boosts are ×${k.toFixed(1)} stronger">Tiny hybrid · boosts ×${k.toFixed(1)}</span>`); } }catch(e){ oops('bc_voyage036:tinyHybridK',e); } }; }
