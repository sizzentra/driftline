// =====================================================================
// 0.3.6 polish pass. Every choice that changes your odds now shows its real effect at the water you are fishing,
// computed from the same weights the game uses to pick a catch (catchOdds), so a number on a card is never a guess.
// =====================================================================
function oddsHere(o){ return 'Epic or better here: <b>'+fmtOdds(o.epic)+'</b>'; }
function oddsDelta(now,then){ const d=then.epic-now.epic; if(Math.abs(d)<.0005) return '<span class="odds-same">same as now</span>';
  return '<span class="'+(d>0?'odds-up':'odds-down')+'">'+(d>0?'▲ ':'▼ ')+'from '+fmtOdds(now.epic)+'</span>'; }
// bait rows: the odds with that bait at this water, against the bait you are using now
const _baitRow_036=baitRow;
baitRow=function(e){ const html=_baitRow_036(e), k=e[0]; let line='';
  try{ const now=catchOdds(), o=catchOdds({bait:k}); line=`<div class="odds">${oddsHere(o)} ${S.baitSel===k?'<span class="odds-same">in use</span>':oddsDelta(now,o)}</div>`; }catch(err){}
  return html.replace(/<\/div>(\s*)<div class="tk-acts">/, line+'</div>$1<div class="tk-acts">'); };
// rods: every rod in the rack shows the odds it would give you here
const _renderRods_036=renderRods;
renderRods=function(P){ _renderRods_036(P); try{ const now=catchOdds(), byName={}; RODS.forEach(r=>byName[r.name]=r);
  P.querySelectorAll('.grid .tile').forEach(t=>{ const h=t.querySelector('h4'), r=h&&byName[h.textContent.trim()]; if(!r) return; const o=catchOdds({rod:r.id});
    const here=S.rods&&S.rods.eq===r.id; const d=document.createElement('div'); d.className='odds'; d.innerHTML=oddsHere(o)+' '+(here?'<span class="odds-same">equipped</span>':oddsDelta(now,o)); const btn=t.querySelector('button,.meta:last-child'); t.insertBefore(d, t.querySelector('button')||null); }); }catch(err){} };
// skills: Lucky Charm shows what its next rank does at this water
const _renderSkills2_036=renderSkills2;
renderSkills2=function(P){ _renderSkills2_036(P); try{ const h=[...P.querySelectorAll('h4')].find(x=>x.textContent.trim()==='Lucky Charm'); if(!h) return; const tile=h.closest('.tile')||h.parentElement; const r=pr('lucky');
  const now=catchOdds(), d=document.createElement('div'); d.className='odds';
  d.innerHTML = r>=10 ? oddsHere(now)+' <span class="odds-same">fully learned</span>' : (()=>{ const o=catchOdds({lucky:r+1}); return 'Next rank here: epic or better <b>'+fmtOdds(o.epic)+'</b> '+oddsDelta(now,o); })();
  const btn=[...tile.querySelectorAll('button')].pop(); tile.insertBefore(d, btn||null); }catch(err){} };
document.head.insertAdjacentHTML('beforeend',`<style>
#panel .odds{font-size:12.5px;color:var(--muted,#9fb2c8);margin-top:6px;line-height:1.35}
#panel .odds b{color:#e9d8ff;font-variant-numeric:tabular-nums}
#panel .odds .odds-up{color:var(--kelp,#7fe3c4);font-weight:700;margin-left:4px;white-space:nowrap}
#panel .odds .odds-down{color:#ff9a8a;font-weight:700;margin-left:4px;white-space:nowrap}
#panel .odds .odds-same{color:var(--muted,#9fb2c8);margin-left:4px;white-space:nowrap}
</style>`);
