// =====================================================================
// PC: one header row (director, 2026-11-17: "make this header super clean; if 1 row is possible, that's the dream, allowing the
// fishing scene to get larger"; "level and money as close to the fishing scene as possible").
//   [ Level · Coins ] [ Fishing  Upgrades  Collections  Challenges  Customization ]        [ Cooler  Aquarium  Fish Log ] [ ⛶ 🔍 ⚙ ]
// - The left block is as wide as "Back to fishing" in the menus, and the section tabs have the same fixed width and position in
//   both, so nothing moves when a menu opens.
// - What belongs to the water sits on the water: one badge in its top-left corner with where you fish, the day and weather, and
//   your next goal (the weather chip the canvas drew there is replaced by it on PC).
// - The info row is gone on PC, so the water gets its height. Every chip keeps its own clicks and live updates (they are moved,
//   not copied) and goes back to the info row on every other layout.
// =====================================================================
{ const pc=()=>document.body.classList.contains('pch-on');
  let scene=null, wx=null, stats=null, built=false;
  const marks=new Map(); // element -> comment that marks its home in the info row
  const park=(el,host,before)=>{ if(!el||!host) return; if(!marks.has(el)){ const c=document.createComment('pc-home'); el.parentNode.insertBefore(c,el); marks.set(el,c); } if(el.parentElement!==host||(before!==undefined&&el.nextSibling!==before)) host.insertBefore(el,before||null); };
  const home=el=>{ const c=marks.get(el); if(c&&c.parentNode&&el.previousSibling!==c) c.parentNode.insertBefore(el,c.nextSibling); };
  const parts=()=>{ const st=id=>{ const e=$(id); return e&&e.closest('.stat'); }; return { lv:st('lvl'), co:st('money'), cool:st('coolerct'), aq:document.querySelector('.stat.st-aq'), log:document.querySelector('.stat.st-log'), loc:document.querySelector('.stat.loc'), goal:$('goalchip') }; };
  const build=()=>{ if(built) return true; const tools=document.querySelector('#pchead .pch-tools'), stg=$('stage'); if(!tools||!stg) return false;
    stats=document.createElement('div'); stats.className='pch-stats'; tools.prepend(stats);
    // the strip directly above the water (director, 2026-11-17: nothing may cover the fishing scene)
    scene=document.createElement('div'); scene.id='pcscene'; scene.innerHTML='<div class="pcs-wx"><span class="lbl"></span><b></b></div><span class="pcs-gap"></span><span class="pcs-boosts"></span><span class="pcs-streak"></span>'; wx=scene.firstChild; stg.parentNode.insertBefore(scene,stg);
    built=true; return true; };
  const apply=()=>{ if(!build()) return; const p=parts(), br=document.querySelector('#pchead .pch-brand');
    if(pc()){ if(br){ br.classList.add('pch-me'); br.removeAttribute('aria-hidden'); park(p.lv,br); park(p.co,br); }
      park(p.cool,stats); park(p.aq,stats); park(p.log,stats);
      park(p.loc,scene,wx); park(p.goal,scene,scene.querySelector('.pcs-gap')); park($('resttog'),scene); tick(); }
    else [p.lv,p.co,p.cool,p.aq,p.log,p.loc,p.goal,$('hint'),$('resttog')].forEach(e=>e&&home(e)); };
  // the day and weather ("Day · Rain  bites +35% · 0:58"), boosts and streak, as the canvas drew them on the water
  const tick=()=>{ if(!built||!pc()) return; try{ const w=weather(), tag=WX_TAG[w.k], l=tod(phase())+' · '+wxName(w.k), v=(tag?tag+' · ':'changes in ')+mmss(wxLeft());
      const a=wx.firstChild, b=wx.lastChild; if(a.textContent!==l) a.textContent=l; if(b.textContent!==v) b.textContent=v; wx.classList.toggle('special',!!tag); wx.classList.toggle('gilded',w.k==='Gilded');
      const sk=scene.querySelector('.pcs-streak'), st=S.streak>=2?'Streak '+S.streak+' · +'+Math.round(streakXP(S.streak)*100)+'% XP':''; if(sk.textContent!==st) sk.textContent=st; sk.classList.toggle('hot',S.streak>=10);
      const bo=scene.querySelector('.pcs-boosts'), now=Date.now(), bt=S.settings.boostsOnScreen?activeBuffs().slice(0,3).map(x=>fmtB(x.k,x.v)+' '+mmss(Math.ceil((x.until-now)/1000))).join('   '):''; if(bo.textContent!==bt) bo.textContent=bt; }catch(e){ oops('pc/ui_header:weather',e); } };
  setInterval(tick,1000);
  const _sc=drawSceneChip; drawSceneChip=function(){ if(pc()) return; return _sc.apply(this,arguments); };
  const init=()=>{ apply(); new MutationObserver(apply).observe(document.body,{attributes:true,attributeFilter:['class']}); setTimeout(apply,300); setTimeout(apply,1200); addEventListener('resize',()=>setTimeout(apply,200)); };
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',init); else init(); }
document.head.insertAdjacentHTML('beforeend',`<style>
/* the tabs' width, shared by the header and the menus: as wide as fits between the left block and the right block, at most 700 */
html body.pch-on{--pcTabs:min(700px,calc(calc(100*var(--uvw,1vw)) - 32px - 190px - 500px - 56px))}
html body.pch-on.dl-fish .hud{display:none!important}
html body.pch-on.dl-fish #pchead{grid-template-columns:190px calc(var(--pcTabs) + 14px) minmax(0,1fr) auto!important;column-gap:14px!important;grid-template-rows:46px!important;height:46px!important}
html body.pch-on #pchead .pch-brand{grid-column:1!important;grid-row:1!important}
html body.pch-on #pchead .pch-cats{grid-column:2!important;grid-row:1!important;margin-left:14px!important}
html body.pch-on #pchead .pch-tools{grid-column:4!important;grid-row:1!important}
html body.pch-on #pchead .pch-coin{display:none!important}
html body.pch-on #menuov .mo-in{grid-template-columns:190px 0 var(--pcTabs) minmax(0,1fr) auto!important;grid-template-areas:"back home secs . tools" "sub sub sub sub sub" "body body body body body"!important}
/* left block: Level and coins */
html body.pch-on #pchead .pch-brand.pch-me{display:grid!important;grid-template-columns:minmax(0,1.1fr) minmax(0,1fr);padding:0;overflow:hidden;cursor:default}
html body.pch-on #pchead .pch-me > *:not(.stat){display:none}
html body.pch-on #pchead .pch-me > .stat{display:flex!important;flex-direction:column;justify-content:center;gap:3px;min-width:0;padding:4px 12px;margin:0;border:0!important;border-radius:0!important;background:none!important;box-shadow:none!important;flex:none!important;max-width:none!important;height:auto!important}
html body.pch-on #pchead .pch-me > .stat + .stat{border-left:1px solid #7fe3c42a!important}
html body.pch-on #pchead .pch-me .st-lvl .lbl{display:flex;align-items:baseline;gap:6px}
html body.pch-on #pchead .pch-me #lvl{font-size:15px!important;color:#fff}
html body.pch-on #pchead .pch-me #money{font-size:15px}
/* right block: cooler, aquarium, Fish Log as compact counters */
html body.pch-on #pchead .pch-stats{display:flex;gap:6px;height:46px}
html body.pch-on #pchead .pch-stats > .stat{display:flex!important;flex-direction:column;justify-content:center;gap:2px;height:46px!important;box-sizing:border-box;padding:4px 12px!important;margin:0!important;min-width:0!important;max-width:none!important;flex:0 0 auto!important;border-radius:14px!important}
html body.pch-on #pchead .pch-stats > .stat b{font-size:14px;white-space:nowrap}
/* the strip directly above the water: one line, nothing on the picture itself */
html body:not(.pch-on) #pcscene,html body.pch-on:not(.dl-fish) #pcscene{display:none}
html body.pch-on.dl-fish #pcscene{display:flex;align-items:center;gap:4px;height:30px;margin:6px 0 4px;padding:0 4px;flex:0 0 auto;min-width:0;overflow:hidden}
html body.pch-on #pcscene > *{flex:0 1 auto;min-width:0}
html body.pch-on #pcscene > .stat,html body.pch-on #pcscene > #goalchip,html body.pch-on #pcscene > .pcs-wx{position:static!important;inset:auto!important;transform:none!important;display:flex!important;flex-direction:row!important;align-items:baseline!important;gap:7px!important;margin:0!important;padding:4px 10px!important;width:auto!important;height:auto!important;max-width:none!important;border:0!important;border-radius:9px!important;background:none!important;box-shadow:none!important}
html body.pch-on #pcscene > .pcs-wx{border-left:1px solid #ffffff14!important;border-right:1px solid #ffffff14!important;border-radius:0!important}
html body.pch-on #pcscene > .hud-link:hover,html body.pch-on #pcscene > #goalchip:hover{background:#ffffff0d!important}
html body.pch-on #pcscene .lbl{font-size:10px;letter-spacing:.08em;text-transform:uppercase;color:#8ea4b9;white-space:nowrap}
html body.pch-on #pcscene b{font-size:13px;color:#eef4f8;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
html body.pch-on #pcscene .pcs-wx.special b{color:#bfe8ff}
html body.pch-on #pcscene .pcs-wx.gilded b{color:#ffc94d}
html body.pch-on #pcscene #goalchip > .gl-s{display:none!important}
html body.pch-on #pcscene #goalchip > .gl-k{font-size:10px;letter-spacing:.08em;text-transform:uppercase;color:#8ea4b9;white-space:nowrap}
html body.pch-on #pcscene #goalchip > .gl-t{font-size:13px;font-weight:800;color:#eef4f8;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
html body.pch-on #pcscene #goalchip > .gl-bar{position:static!important;display:inline-block!important;width:46px;height:4px;border-radius:4px;background:#ffffff1a;overflow:hidden;align-self:center;margin:0!important}
html body.pch-on #pcscene #goalchip > .gl-bar b{display:block;height:100%;background:linear-gradient(90deg,#7fe3c4,#ffd36a)}
html body.pch-on #pcscene .pcs-gap{flex:1 1 auto}
html body.pch-on #pcscene > #hint{position:static!important;inset:auto!important;transform:none!important;margin:0 8px!important;padding:0!important;background:none!important;border:0!important;box-shadow:none!important;font-size:12px!important;color:#8ea4b9!important;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:none!important;flex:0 1 auto;opacity:1!important}
html body.pch-on #pcscene .pcs-boosts{font-size:12px;font-weight:700;color:#7fc8a9;white-space:nowrap;flex:0 0 auto}
html body.pch-on #pcscene .pcs-streak{font-size:12px;font-weight:800;color:#e6efe8;white-space:nowrap;flex:0 0 auto}
html body.pch-on #pcscene .pcs-streak.hot{color:#ffc94d}
html body.pch-on #pcscene .pcs-boosts:empty,html body.pch-on #pcscene .pcs-streak:empty{display:none}
html body.pch-on #pcscene > #resttog{position:static!important;inset:auto!important;transform:none!important;margin:0 0 0 6px!important;flex:0 0 auto}
/* narrower PC windows: icon-only section tabs (names on hover) in both rows, and a tighter right block */
@media (max-width:1320px){
  html body.pch-on{--pcTabs:max(240px,min(700px,calc(calc(100*var(--uvw,1vw)) - 32px - 190px - 480px - 56px)))}
  html body.pch-on #pchead #catdock .cdl,html body.pch-on #menuov #tabs .secl{display:none!important}
  html body.pch-on #pchead #catdock .cdb,html body.pch-on #menuov #tabs .secb{padding:4px 6px!important}
  html body.pch-on #pchead .pch-stats > .stat{padding:4px 9px!important}
}
</style>`);
document.head.insertAdjacentHTML('beforeend',`<style>
html body.pch-on #pcscene > #goalchip{position:relative!important;inset:auto!important;transform:none!important;left:auto!important;top:auto!important}
/* short section names on PC (Collection, Customize) in both rows, with room for icon, name and badge */
html body.pch-on #menuov #tabs.secmode .secb .secfull{display:none!important}
html body.pch-on #menuov #tabs.secmode .secb .secshort{display:inline!important}
html body.pch-on #pchead #catdock .cdb,html body.pch-on #menuov #tabs.secmode .secb{gap:6px!important;padding-left:8px!important;padding-right:8px!important}
</style>`);
{ const shortNames=()=>{ if(!document.body.classList.contains('pch-on')) return; document.querySelectorAll('#pchead #catdock .cdb[data-cd]').forEach(b=>{ const sec=MENU_SECS.find(s=>s.id===b.dataset.cd), l=b.querySelector('.cdl'); if(sec&&l){ const t=sec.short||sec.name; if(l.textContent!==t) l.textContent=t; b.title=sec.name; } }); };
  new MutationObserver(()=>setTimeout(shortNames,0)).observe(document.body,{attributes:true,attributeFilter:['class']}); addEventListener('resize',()=>setTimeout(shortNames,60)); setTimeout(shortNames,200); }
