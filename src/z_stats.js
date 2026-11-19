
// =====================================================================
// 0.3 Stats tab: everything that shapes your fishing in one place, read straight from the same
// functions the game uses (so it is always correct). Three short sections: Overview, Bonuses
// (where every bonus comes from), Gear. Plus preview-only tester tools (never in the release build).
// =====================================================================
let statSec='overview';
const pctS = v => (v>=0?'+':'−')+Math.round(Math.abs(v)*1000)/10+'%';
const mulS = v => '×'+(Math.round(v*100)/100).toFixed(2);
function statRow(label,val,note){ return `<div class="st-row"><span>${label}${note?`<small>${note}</small>`:''}</span><b>${val}</b></div>`; }
function statsHTML(){ const wx=weather(), b=BAIT[S.baitSel]||BAIT.worm, dm={rare:0,weight:1};
  const keys=['bite','rare','shiny','trophy','reel','tension','calm','sell','xp','treasure','tank','hot'].filter(k=>BK[k]);
  if(statSec==='bonuses'){ const rows=keys.map(k=>{ const parts=[buffSum(k),aqSum(k),petSum(k),rodBonus(k)], raw=parts.reduce((a,c)=>a+c,0), tot=bonus(k), cap=BONUS_CAP[k];
      const cell=v=>v?`<td>${(k==='tension'||k==='calm'?'−':'+')+Math.round(v*1000)/10}%</td>`:'<td class="z">·</td>';
      return `<tr><th>${BK[k][0].toUpperCase()+BK[k].slice(1)}</th>${parts.map(cell).join('')}<td class="t">${tot?(k==='tension'||k==='calm'?'−':'+')+Math.round(tot*1000)/10+'%':'·'}${cap&&raw>cap?' <small>(max)</small>':''}</td></tr>`; }).join('');
    return `<p class="sub">Every bonus and where it comes from. Boosts are timed buffs from junk and tasks; Aquarium is your displayed fish; Pets are your favourite and companion; Rod includes its level and attachments.</p>
      <div class="st-table-wrap"><table class="st-table"><thead><tr><th></th><th>Boosts</th><th>Aquarium</th><th>Pets</th><th>Rod</th><th>Total</th></tr></thead><tbody>${rows}</tbody></table></div>`; }
  if(statSec==='gear'){ const g=k=>GEAR[k].fmt(gv(k));
    return `<div class="st-grid"><div class="tile"><h4>Tackle</h4>${statRow('Rod length',g('rod'),'Level '+(S.gear.rod+1)+' of '+GEAR.rod.lv.length)}${statRow('Reel',g('reel'),'Level '+(S.gear.reel+1)+' of '+GEAR.reel.lv.length)}${statRow('Line',g('line'),'Level '+(S.gear.line+1)+' of '+GEAR.line.lv.length)}${statRow('Angler strength',strTxt(anglerStr()),'Line plus skills that lower tension')}
      ${statRow('Hook',g('hook'),'Level '+(S.gear.hook+1)+' of '+GEAR.hook.lv.length)}${statRow('Cooler',g('cooler'))}${statRow('Fish finder',g('finder'))}</div>
      <div class="tile"><h4>Rod: ${esc(rod().name)}</h4>${statRow('Rod level',rodLvl()+' / 10')}${Object.keys(rod().st).map(k=>statRow(k==='cast'?'Cast distance':BK[k]?BK[k][0].toUpperCase()+BK[k].slice(1):k, k==='cast'?mulS(rod().st[k]):k==='hook'?'+'+rod().st[k].toFixed(2)+' s':pctS(rod().st[k]))).join('')||'<div class="meta">No special stats</div>'}
      ${statRow('Attachments',rodAtts().length?rodAtts().map(a=>esc(ATT_I[a].name)).join(', '):'None')}</div>
      <div class="tile"><h4>Bait</h4>${statRow('In use',esc(b.name)+(S.baitSel!=='worm'?' · '+(S.bait[S.baitSel]||0)+' left':''))}${statRow('Bite speed',mulS(b.speed))}${statRow('Rare odds',b.rare?'+'+Math.round(b.rare*100)+'%':'—')}</div></div>`; }
  // overview
  const bite=biteSpeed(false), sh=shinyChance(false), rs=rareScore(dm,false,false), rsFar=rareScore(dm,true,false), sm=sellMult(), xm=xpMult(), cm=coinMult();
  /* 0.4: the real odds at this water, from the same weights as a catch (they used to come from a generic table) */ const oNow=catchOdds(), oBase=catchOdds({mul:()=>1}), legNow=oNow.legend, legW=oBase.legend, tw=1, epNow=oNow.epic, epBase=oBase.epic;
  return `<div class="st-grid">
    <div class="tile"><h4>Catching</h4>${statRow('Bite speed',mulS(bite),'Bait, level, skills, weather, boosts')}${statRow('Hook window',hookWin().toFixed(2)+' s')}${statRow('Rare odds score',rs.toFixed(2),'Far casts: '+rsFar.toFixed(2))}
      ${statRow('Epic or better',fmtOdds(epNow),'per fish here, '+fmtOdds(epBase)+' with no bonuses')}${statRow('Legendary or better',fmtOdds(legNow),'per fish here, '+fmtOdds(legW)+' with no bonuses')}${statRow('Shiny chance',(sh*100).toFixed(2)+'%')}${statRow('Hybrid chance',(hybridChance()*100).toFixed(2)+'%')}${statRow('Junk chance',(junkChance()*100).toFixed(1)+'%')}${statRow('Far casts count from',Math.round(farAt()*100)+'% power')}</div>
    <div class="tile"><h4>Fighting</h4>${statRow('Reel speed',reelSpeed().toFixed(2)+' m/s')}${statRow('Angler strength',strTxt(anglerStr()),'Your Line, plus skills that lower tension. Fish stronger than this are heavy for you.')}${statRow('Line strength',Math.round(wNum(gv('line')))+' '+wUnit())}${statRow('Line tension',mulS(tensionMult()),'Lower is better')}${statRow('Temper build-up',mulS(tempMult()),'Lower is better')}${statRow('Max line out',Math.round(gv('rod')*rodCast()+28+rodSpool())+' m')}</div>
    <div class="tile"><h4>Coins & XP</h4>${statRow('Sale price',mulS(sm),'Level, Haggler, rank, boosts, pearls')}${statRow('XP',mulS(xm))}${statRow('Wisdom Pearls',mulS(cm),S.pearls+' pearl'+(S.pearls===1?'':'s'))}${statRow('Streak bonus cap','+'+Math.round(streakCap()*100)+'% XP')}
      ${statRow('Aquarium',fmt(Math.round(tankRate()*60))+' / hour',S.tank.length+' fish · up to '+Math.round(offlineCap()/60)+' h away')}${statRow('Cozy level',cozy()+' ♥','+'+cozyBonus()+'% XP, +'+(cozyBonus()*.5)+'% bite speed and sale price')}</div>
    <div class="tile"><h4>Right now</h4>${statRow('Water',esc(curLoc().name))}${statRow('Weather',esc(wxName(wx.k)),esc(wx.note||''))}${statRow('Time of day',isNight()?'Night':'Day')}${statRow('Active boosts',S.buffs.filter(x=>x.until>Date.now()).length||'None')}${statRow('Skill points',ptsFree()+' free · '+ptsSpent()+' spent')}</div>
  </div>`; }
function renderStats(P){ P.innerHTML=`<h2>Stats</h2><p class="sub">Everything that shapes your fishing, worked out exactly like the game does.</p>
  <div class="bwx-nav" role="tablist">${[['overview','Overview'],['bonuses','Bonuses'],['gear','Gear']].map(([k,n])=>`<button role="tab" data-act="statsec" data-k="${k}" aria-selected="${statSec===k}">${n}</button>`).join('')}</div>${statsHTML()}${window.DL_PREVIEW?testerHTML():''}`; }
// ---------- preview-only tester tools: for the director to test everything; the release build never shows them ----------
function testerHTML(){ const B=(k,t,alt)=>`<button class="btn${alt?' alt':''} sm" data-act="tester" data-k="${k}">${t}</button>`;
  return `<details class="tile st-test" open><summary><b>Tester tools</b> <span class="meta">· test builds only, never in the real game</span></summary><p class="sub">The test build has its own save, so your real game is untouched.</p>
  <div class="row" style="gap:6px;flex-wrap:wrap">${B('all','Unlock everything')}${B('coins','+1 billion coins',1)}${B('scales','+10,000 Scales & tickets',1)}${B('pearls','+20 Wisdom Pearls',1)}${B('pass','Tide Pass to level 50',1)}${B('lvl','+10 levels',1)}${B('log','Fill the Fish Log + oddities',1)}${B('feats','Finish every feat',1)}${B('cooler','Fill the cooler',1)}${B('time','Skip 8 hours (aquarium, spins)',1)}</div></details>`; }
function testerUnlock(k){ if(!window.DL_PREVIEW) return; const o=S.owned, U=(arr,ids)=>{ for(const id of ids) if(!arr.includes(id)) arr.push(id); };
  if(k==='coins'){ S.money+=1e9; return 'One billion coins added.'; } if(k==='scales'){ S.scales+=1e4; S.tickets+=1e4; return 'Scales and tickets added.'; }
  if(k==='pearls'){ S.pearls=(S.pearls||0)+20; return '20 Wisdom Pearls added: spend them in Prestige, Pearl relics.'; }
  if(k==='pass'){ S.pass.lvl=Math.max(S.pass.lvl,50); return 'Tide Pass set to level 50. Claim your rewards in the Tide Pass tab.'; }
  if(k==='lvl'){ for(let i=0;i<10;i++){ try{ addXP(Math.max(1,xpNeed(S.lvl)-S.xp)); }catch(e){ S.lvl++; } } return 'Now level '+S.lvl+'.'; }
  if(k==='log'){ const now=Date.now(); for(const sp of SP){ if(!S.journal[sp.id]) S.journal[sp.id]={n:1,best:1,min:1,sh:false,pr:false,tr:false,bv:0,first:now}; } for(const j of JUNK) if(!S.junk[j.id]) S.junk[j.id]=1; try{ checkFeats(); }catch(e){} return 'Every fish species and oddity is now in your Fish Log.'; }
  if(k==='feats'){ let n=0; try{ for(const f of FEATS){ if(!S.feats[f.id]){ S.feats[f.id]=true; n++; } } }catch(e){ return 'Feats could not be finished: '+e.message; } return n+' feats finished (their rewards were not paid out).'; }
  if(k==='cooler'){ const pool=SP.filter(s=>s.loc===S.loc); let n=0; while(S.cooler.length<gv('cooler')&&n<200){ const sp=pool[n%pool.length]; S.cooler.push({id:sp.id,kg:1,value:100,sh:0,tr:0}); n++; } return n+' fish added to your cooler.'; }
  if(k==='time'){ const h=8*3600e3; try{ S.tankT=(S.tankT||Date.now())-h; accrue(); }catch(e){} try{ S.wheelT=(S.wheelT||Date.now())-h; accrueSpins(); }catch(e){} return 'Skipped 8 hours: collect your aquarium and spins.'; }
  S.money+=1e9; S.scales+=1e4; S.tickets+=1e4; S.pearls=(S.pearls||0)+20; S.unlocked=LOCS.map(l=>l.id); for(const g in GEAR) S.gear[g]=GEAR[g].lv.length-1;
  U(S.rods.owned,RODS.map(r=>r.id)); for(const r of RODS) S.rods.lvl[r.id]=10; for(const a of ATTS) S.atts[a.id]=3;
  U(o.hats,HATS.map(h=>h.id)); U(o.cols,SHOP_COLS.map(c=>c[0])); U(o.pats,PATTERNS.map(p=>p[0])); U(o.outfits,OUTFITS.map(x=>x[0])); U(o.glasses,GLASSES.map(x=>x[0])); U(o.shoes,SHOES.map(x=>x[0])); U(o.necks,NECKS.map(x=>x[0])); U(o.backs,BACKS.map(x=>x[0]));
  U(o.pets,PETS.filter(p=>(p.id!=='lily'||o.pets.includes('lily'))&&(p.id!=='daxniko'||o.pets.includes('daxniko'))).map(p=>p.id)); U(S.petTints,PET_TINTS.map(x=>x[0])); U(S.petAccs,PET_ACCS.map(x=>x[0]));
  U(S.dock.owned,[...DOCK_DECOR.map(d=>d.id),...DOCK_WOODS.map(w=>w[0])]); U(S.aq.owned,[...DECOR.map(d=>d.id),...THEMES.map(x=>x[0]),...SANDS.map(x=>x[0])]); S.tankSlots=TANK_COST.length;
  for(const b2 in BAIT) if(b2!=='worm') S.bait[b2]=(S.bait[b2]||0)+99; S.lvl=Math.max(S.lvl,40); S.tokens.small+=5; S.tokens.big+=5; S.tokens.legend+=5;
  return 'Everything unlocked for testing.'; }
const _renderPanel_1 = renderPanel;
renderPanel = function(){ if(S.tab==='stats'){ renderStats($('panel')); return; } _renderPanel_1(); };
const _extraAct2_4 = extraAct2;
extraAct2 = function(b){ if(b.dataset.act==='statsec'){ statSec=b.dataset.k; return 'render'; }
  if(b.dataset.act==='tester'){ const m=testerUnlock(b.dataset.k); if(m){ toast(m); save(); lastHud=''; } return 'render'; } return _extraAct2_4(b); };
// the tab itself, next to Save
{ const sv=document.querySelector('#tabs [data-tab="save"]'); if(sv&&!document.querySelector('#tabs [data-tab="stats"]')){ sv.insertAdjacentHTML('beforebegin','<button role="tab" data-tab="stats" aria-selected="false" data-label="📊 Stats"></button>'); const nb=document.querySelector('#tabs [data-tab="stats"]'); nb.innerHTML=tabHTML(nb.dataset.label); } }
document.head.insertAdjacentHTML('beforeend',`<style>
.st-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:12px}
.st-row{display:flex;justify-content:space-between;gap:10px;padding:6px 0;border-bottom:1px solid #ffffff0e;align-items:baseline}
.st-row:last-child{border-bottom:0} .st-row span{color:var(--muted);display:flex;flex-direction:column} .st-row small{font-size:11px;opacity:.75} .st-row b{color:#fff;text-align:right;white-space:nowrap}
.st-table-wrap{overflow-x:auto;border-radius:14px;border:1px solid var(--line)}
.st-table{width:100%;border-collapse:collapse;font-size:13px;background:var(--glass,#16243a)}
.st-table th,.st-table td{padding:8px 10px;text-align:right;border-bottom:1px solid #ffffff0e;white-space:nowrap}
.st-table thead th{color:var(--muted);font-weight:600;font-size:11.5px;letter-spacing:.04em;text-transform:uppercase}
.st-table tbody th{text-align:left;color:var(--ink);font-weight:600} .st-table td.z{color:#ffffff30} .st-table td.t{color:#ffd36a;font-weight:700}
.st-test{margin-top:14px;border-color:#ff9a5c55} .st-test summary{cursor:pointer}
</style>`);
document.head.insertAdjacentHTML('beforeend',`<style>li.pn-h{list-style:none;margin:12px 0 4px -20px;font-weight:800;color:#ffd36a;font-size:13px;letter-spacing:.06em;text-transform:uppercase} li.pn-h:first-child{margin-top:4px}
#evin ul{max-height:58vh;overflow:auto;padding-right:6px}</style>`);
