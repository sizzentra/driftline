// =====================================================================
// 0.4 small things: time played, and a scrollbar that keeps out of the way.
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
</style>`);
document.addEventListener('scroll',e=>{ const el=e.target===document?document.documentElement:e.target; if(!el||!el.classList) return; el.classList.add('sb-on'); clearTimeout(el._sbT); el._sbT=setTimeout(()=>el.classList.remove('sb-on'),900); },true);
