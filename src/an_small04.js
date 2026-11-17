// =====================================================================
// 0.3.1 small things: time played, and a scrollbar that keeps out of the way.
// =====================================================================

// ---------- time played: counts every second the game is open and in front of you ----------
setInterval(()=>{ if(!document.hidden && S && S.stats){ S.stats.playS=(+S.stats.playS||0)+1; } },1000);
function playTimeStr(s){ s=Math.max(0,Math.floor(+s||0)); const d=Math.floor(s/86400), h=Math.floor(s%86400/3600), m=Math.floor(s%3600/60);
  return d ? d+' d '+h+' h' : h ? h+' h '+m+' min' : m ? m+' min' : s+' s'; }
const _statsHTML_04 = statsHTML;
statsHTML = function(){ const h=_statsHTML_04(); if(statSec!=='overview') return h;
  return `<div class="tile st-play"><h4>Time played</h4>${statRow('On this save',playTimeStr(S.stats.playS))}${statRow('Fish caught',fmt(S.stats.caught||0))}${statRow('Coins earned',fmt(S.stats.earned||0))}</div>`+h; };

// ---------- scrollbars: thin, no track, and only visible while you scroll or hover over a list ----------
document.head.insertAdjacentHTML('beforeend',`<style>
*{scrollbar-width:thin;scrollbar-color:transparent transparent;transition:scrollbar-color .45s ease}
*:hover{scrollbar-color:rgba(170,205,235,.16) transparent}
.sb-on,.sb-on:hover{scrollbar-color:rgba(190,220,245,.42) transparent}
.st-play{margin-bottom:10px}
.badge{white-space:nowrap}
</style>`);
document.addEventListener('scroll',e=>{ const el=e.target===document?document.documentElement:e.target; if(!el||!el.classList) return; el.classList.add('sb-on'); clearTimeout(el._sbT); el._sbT=setTimeout(()=>el.classList.remove('sb-on'),900); },true);

// ---------- notification numbers: newly completed feats on the Feats tab (with a NEW mark inside), and the skill
// sections that have something you can spend a point on (set in x_sections). Same little orange counter as the other tabs.
function featNew(){ if(!Array.isArray(S.featSeen)) S.featSeen=FEATS.filter(f=>S.feats[f.id]).map(f=>f.id); return FEATS.filter(f=>S.feats[f.id]&&!S.featSeen.includes(f.id)); }
let featBadgeN=-1;
function featBadge(){ const n=S.tab==='feats'?0:featNew().length; const b=document.querySelector('#tabs [data-tab="feats"]'); if(!b) return; if(n===featBadgeN&&b.querySelector('.dot')?true:n===0&&featBadgeN===0) return; featBadgeN=n; b.innerHTML=tabHTML(b.dataset.label)+(n?'<span class="dot">'+n+'</span>':''); }
setInterval(featBadge,1000);
const _renderFeats_04 = renderFeats;
renderFeats = function(P){ const fresh=featNew().map(f=>f.name); _renderFeats_04(P);
  if(fresh.length){ P.querySelectorAll('.tile h4').forEach(h=>{ if(fresh.includes(h.textContent.trim())&&!h.querySelector('.newmark')) h.insertAdjacentHTML('beforeend',' <span class="newmark">New</span>'); }); }
  S.featSeen=FEATS.filter(f=>S.feats[f.id]).map(f=>f.id); featBadgeN=-1; featBadge(); };
document.head.insertAdjacentHTML('beforeend',`<style>
.sdot{display:inline-block;min-width:16px;padding:0 5px;margin-left:4px;border-radius:999px;font-size:11px;line-height:16px;font-weight:700;background:linear-gradient(180deg,#ffb36a,#ff7a4a);color:#2a1206;box-shadow:0 0 8px #ff8a5c66;vertical-align:1px}
.newmark{display:inline-block;margin-left:6px;padding:1px 7px;border-radius:999px;font-size:10.5px;font-weight:800;letter-spacing:.04em;text-transform:uppercase;background:linear-gradient(180deg,#ffb36a,#ff7a4a);color:#2a1206;vertical-align:2px}
</style>`);

// ---------- full screen is remembered on this device: if you left the game in full screen, it goes back to full
// screen on your first tap or key press (browsers only allow full screen after you touch the page) ----------
(function(){ let want=false; try{ want=localStorage.getItem('dl-fs')==='1'; }catch(e){}
  document.addEventListener('fullscreenchange',()=>{ try{ localStorage.setItem('dl-fs',document.fullscreenElement?'1':'0'); }catch(e){} });
  if(!want) return; const go=()=>{ ['pointerdown','keydown'].forEach(ev=>document.removeEventListener(ev,go,true)); if(!document.fullscreenElement&&document.documentElement.requestFullscreen){ try{ const p=document.documentElement.requestFullscreen(); if(p&&p.catch) p.catch(()=>{}); }catch(e){} } };
  ['pointerdown','keydown'].forEach(ev=>document.addEventListener(ev,go,true)); })();
if(/[?&]test\b/.test(location.search)) window.__frenzy=()=>{ G.st='frenzy'; G.fz={t:0,dur:10,next:0,jumpers:[],caught:0}; return 'ok'; };
// test: jump the clock to a moment with the given weather, inside a phase range, away from the weather's fade edges
if(/[?&]test\b/.test(location.search)) window.__findWx=(k,ph0=0,ph1=1)=>{ for(let i=0;i<60000;i++){ window.__off+=29000; const now=Date.now(), ph=(now/1000%360)/360, s=now/1000/WX_LEN, into=(s-Math.floor(s))*WX_LEN; if(ph>ph0&&ph<ph1&&into>45&&into<WX_LEN-45&&weather().k===k) return true; } return false; };

// ---------- Graphics quality: High (the default on computers) or Balanced (the default on phones and tablets).
// High draws the scenery at full screen sharpness and adds more life: denser rain rings and whitecaps, more drifting
// leaves, plankton and glints. Auto picks for you; the choice is saved on this device.
var GFX_TOUCH = !!(window.matchMedia&&matchMedia('(pointer:coarse)').matches);
function gfxHigh(){ const v=S&&S.settings&&S.settings.gfx; return v==='high' || (v!=='balanced' && !GFX_TOUCH); }
function gfxK(){ return gfxHigh()?1.6:1; }
const _renderSettings_gfx = renderSettings;
renderSettings = function(P){ _renderSettings_gfx(P); const cur=S.settings.gfx||'auto', grid=P.querySelector('.grid'); if(!grid) return;
  const opt=[['auto','Auto ('+(GFX_TOUCH?'Balanced':'High')+' here)'],['high','High'],['balanced','Balanced']];
  grid.insertAdjacentHTML('afterbegin',`<div class="tile"><h4>Graphics</h4><div class="meta">High draws everything at full sharpness and adds more life to the water and weather. Balanced is lighter on phones and older devices.</div><div class="chips" style="margin-top:8px">${opt.map(([k,n])=>`<button class="chipb" type="button" data-gfx="${k}" aria-pressed="${cur===k}">${n}</button>`).join('')}</div></div>`);
  grid.querySelectorAll('[data-gfx]').forEach(b=>b.onclick=e=>{ e.stopPropagation(); S.settings.gfx=b.dataset.gfx==='auto'?undefined:b.dataset.gfx; if(!S.settings.gfx) delete S.settings.gfx; save(); if(typeof V3CACHE!=='undefined'&&V3CACHE) V3CACHE.key=''; renderPanel(); }); };
