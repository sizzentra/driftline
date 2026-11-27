// =====================================================================
// PC Reborn (director, 2026-11-21): PC gets the phones' pages, names and organisation, laid out for a big screen. Every page is
// organised like the Aquarium (src/cx_pages.js, shared): a strip with the page's key numbers and main action, the sections as ONE
// row of tabs, and one scrolling body. PC keeps its own Fish Log (the director: "fish log looks great on pc"), Aquarium and Home.
// Everything sits under the one header row; the header's Stats chip is where Stats lives on PC, so Stats is not a section here.
// One size on every page (PC_UI below, checked by __pcSpec in test builds).
// =====================================================================
['journal','aquarium'].forEach(t=>PAGES_SKIP.add(t)); /* own frames: the Fish Log (PC's own), the Aquarium (the tank on top, their tabs under it, like the phones) */
/* Stats lives in the header chip on PC (one place per page) */
{ const i=MENU_SECS.findIndex(s=>s.id==='stats'); if(i>=0) MENU_SECS.splice(i,1); const b=document.querySelector('#catdock [data-cd="stats"]'); if(b) b.remove(); const s=document.querySelector('#tabs .secbar [data-sec="stats"]'); if(s) s.remove(); }
/* every section's tabs share one row on PC */
function PG_COLS(el,n){ return Math.max(1,n); }
/* the engine, after every PC page tweak has run */
panelStep({ before(){ PAGES.before(); for(let i=PC_STEPS.pre.length-1;i>=0;i--) PC_STEPS.pre[i](); }, after(){ for(const f of PC_STEPS.post) f(); PAGES.after(); } }); /* PC_STEPS: br_pc05.js */
/* PC_UI: one size for every page (the phones' MB_UI, for a big screen). Text 15 px, small text 13 px, card titles 16 px, controls 40 px. */
const PC_UI={text:15, small:13, title:16, h2:22, ctl:40, tab:42, cell:20, gap:12};
document.head.insertAdjacentHTML('beforeend',`<style>
body.pch-on #menuov #panel.pg08{display:flex!important;flex-direction:column!important;gap:${PC_UI.gap}px;height:100%;min-height:0;overflow:hidden!important;font-size:${PC_UI.text}px}
body.pch-on #menuov #panel.pg08 > .pg08-bar{flex:0 0 auto;display:flex;align-items:stretch;gap:${PC_UI.gap}px;margin:0}
body.pch-on #menuov #panel.pg08 .pg08-bank{flex:1 1 auto;display:grid;align-items:center;gap:6px 18px;padding:10px 16px;border-radius:14px;background:#0e1a2c;border:1px solid #ffffff14}
body.pch-on #menuov #panel.pg08 .pg08-bank > div{min-width:0}
body.pch-on #menuov #panel.pg08 .pg08-bank .sub{display:block;font:800 11px var(--display,system-ui);letter-spacing:.08em;text-transform:uppercase;color:#9fb2c8}
body.pch-on #menuov #panel.pg08 .pg08-bank b{display:block;font:800 ${PC_UI.cell}px var(--display,system-ui);color:#fff;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
body.pch-on #menuov #panel.pg08 .pg08-bank > .btn{min-height:${PC_UI.ctl}px;font-size:${PC_UI.text}px;padding:0 18px;white-space:nowrap}
body.pch-on #menuov #panel.pg08 .pg08-side{display:none}
body.pch-on #menuov #panel.pg08 .pg08-sidev{flex:0 0 auto;max-width:42%;border-radius:14px;overflow:hidden}
body.pch-on #menuov #panel.pg08 > .pg08-sheet{flex:1 1 0;min-height:0;display:flex;flex-direction:column;gap:${PC_UI.gap}px}
body.pch-on #menuov #panel.pg08 .pg08-sheet > .bwx-nav{flex:0 0 auto;display:grid!important;gap:6px;margin:0!important;padding:4px!important;border-radius:14px;background:#0a1424;border:1px solid #ffffff14}
body.pch-on #menuov #panel.pg08 .pg08-sheet > .bwx-nav > button{min-height:${PC_UI.tab}px!important;height:${PC_UI.tab}px;font:800 ${PC_UI.text}px var(--display,system-ui)!important;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;padding:0 12px!important;border-radius:10px}
body.pch-on #menuov #panel.pg08 .pg08-body{flex:1 1 0;min-height:0;overflow:auto;padding:2px 6px 16px 2px;scrollbar-width:thin}
body.pch-on #menuov #panel.pg08 .pg08-note{margin:0 0 ${PC_UI.gap}px!important;font-size:${PC_UI.small}px;color:#b8c8d6}
body.pch-on #menuov #panel.pg08 .pg08-body .meta,body.pch-on #menuov #panel.pg08 .pg08-body .sub{font-size:${PC_UI.small}px}
body.pch-on #menuov #panel.pg08 .pg08-body h4{font-size:${PC_UI.title}px}
body.pch-on #menuov #panel.pg08 .pg08-body h2{font-size:${PC_UI.h2}px}
body.pch-on #menuov #panel.pg08 .pg08-body .btn{min-height:36px;font-size:14px}
body.pch-on #menuov #panel.pg08 .pg08-body .btn.sm{min-height:32px;font-size:13px}
body.pch-on #menuov #panel.pg08 .jsec > h2{display:none}
body.pch-on .pch-stats > .stat.ready{border-color:#ffd36a!important;box-shadow:0 0 0 1px #ffd36a55}
body.pch-on #menuov #panel .chipb{min-height:36px}
body.pch-on #menuov #panel .bwx-row > .btn{align-self:center;white-space:nowrap;flex:0 0 auto}
body.pch-on #menuov #panel a.btn{display:inline-flex;align-items:center;justify-content:center}
body.pch-on #menuov #panel .q8-k{font-size:11px}
body.pch-on #menuov #panel.pg08 .pg08-body .btn:not(.sm){min-height:36px;padding-top:0;padding-bottom:0}
</style>`);
/* test builds: window.__pcSpec() opens every page and checks the PC_UI standard: the frame (strip, one row of tabs, the body scrolls,
   nothing spills out of the page), text only in the standard sizes, controls in the standard heights, and no text cut off.
   Returns {pages, issues[]}. Part of the sweep for PC (1920×1080, 2560×1440, 1440×900). */
if(/[?&]test\b/.test(location.search)) window.__pcSpec=async()=>{ const w=ms=>new Promise(r=>setTimeout(r,ms)), out=[]; let n=0;
  const SIZES=new Set([11,12,13,14,15,16,18,20,22]), CTL=new Set([32,36,40,42]);
  const vis=e=>{ const r=e.getBoundingClientRect(), cs=getComputedStyle(e); return r.width>0&&r.height>0&&cs.visibility!=='hidden'&&cs.display!=='none'; };
  const tabs=[...new Set([...document.querySelectorAll('#tabs [data-tab]')].map(b=>b.dataset.tab).concat(['trophy','events','stats']))];
  for(const t of tabs){ if(PAGES_SKIP.has(t)||t==='settings'||t==='save') continue; try{ openMenu(t); }catch(e){ oops('pc/pages_pc:qc-openMenu',e); continue; } await w(250); const P=$('panel'); if(!P||S.tab!==t) continue; n++;
    const nm=(menuTabLabel(t)||[])[1]||t;
    if(P.classList.contains('pg08')){ const bar=P.querySelector(':scope > .pg08-bar'), body=P.querySelector('.pg08-body'), nav=P.querySelector('.pg08-sheet > .bwx-nav');
      if(!bar) out.push(nm+': no key-number strip'); if(!body) out.push(nm+': no scrolling body');
      if(nav){ const tops=[...nav.querySelectorAll(':scope > button')].filter(vis).map(b=>Math.round(b.getBoundingClientRect().top)); if(new Set(tops).size>1) out.push(nm+': tabs on '+new Set(tops).size+' rows'); }
      if(P.scrollHeight>P.clientHeight+2) out.push(nm+': the page itself scrolls ('+(P.scrollHeight-P.clientHeight)+' px)'); }
    const scope=P.querySelector('.pg08-body')||P, bad=new Map(), badCtl=new Map(), cut=[];
    for(const el of scope.querySelectorAll('*')){ if(!vis(el)) continue; const own=[...el.childNodes].some(c=>c.nodeType===3&&/[A-Za-z0-9]/.test(c.textContent)); /* words and numbers; picture emoji are art */ if(own){ const fs=Math.round(parseFloat(getComputedStyle(el).fontSize));  /* font sizes are set before the zoom */ if(!SIZES.has(fs)) bad.set(fs,(bad.get(fs)||0)+1);
        const cs=getComputedStyle(el); if(cs.whiteSpace==='nowrap'&&cs.textOverflow!=='ellipsis'&&el.scrollWidth>el.clientWidth+1&&cs.overflow!=='visible') cut.push((el.textContent||'').trim().slice(0,24)); }
      if(document.body.classList.contains('pc-fhd')&&el.matches('.btn,.chipb')&&!el.closest('.bwx-nav')){ /* control heights at the full-HD sizes (smaller windows scale the whole menu) */ const h=Math.round(el.getBoundingClientRect().height/(UIZ||1)); if(h>=24&&!CTL.has(h)){ const k=h+'px '+(el.dataset.act||el.className.toString().split(' ').slice(0,2).join('.')); badCtl.set(k,(badCtl.get(k)||0)+1); } } }
    if(bad.size) out.push(nm+': text sizes outside the standard '+[...bad].map(([s,c])=>s+'px×'+c).join(', '));
    if(badCtl.size) out.push(nm+': control heights outside the standard '+[...badCtl].map(([s,c])=>s+' ×'+c).join(', '));
    if(cut.length) out.push(nm+': text cut off: '+cut.slice(0,3).join(' | ')); }
  try{ closeMenu(); }catch(e){ oops('pc/pages_pc:closeMenu',e); } return {pages:n, issues:out}; };
/* everything in the header that can open a page does (director: "Everything that could be hyperlinked on pc should be hyperlinked"):
   Level opens Skills (where its points go), Coins opens Stats (what you earn and why) */
{ const link=(sel,tab,tip)=>{ const el=document.querySelector(sel); if(!el||el.dataset.pcLink) return; el.dataset.pcLink=tab; el.classList.add('hud-link'); el.setAttribute('role','button'); el.tabIndex=0; el.title=tip; el.style.cursor='pointer';
    ['pointerdown','mousedown'].forEach(ev=>el.addEventListener(ev,e=>e.stopPropagation(),{passive:true})); const go=e=>{ e.preventDefault(); e.stopPropagation(); try{ startAudio(); }catch(er){ oops('pc/pages_pc:startAudio',er); } openMenu(tab); };
    el.addEventListener('click',go); el.addEventListener('keydown',e=>{ if(e.key==='Enter'||e.key===' ') go(e); }); };
  const wire=()=>{ link('#pchead .stat.st-lvl','skills','Your level. Click for Skills, where your skill points go.'); link('#pchead .stat.st-coins','stats','Your coins. Click for Stats: what you earn and why.'); };
  setTimeout(wire,0); setTimeout(wire,1200); }
// Fishmonger's Gamble on PC (batch 2, 2026-11-21): in the eight-column games grid the card was 226 px wide, so a long fish name wrapped
// its button onto two lines (41 px, off the button standard). The card takes two columns and lists one fish per row, on one line.
document.head.insertAdjacentHTML('beforeend','<style>body.pch-on #panel .bwx-grid > .bwx-card:has(.bwx-gl){grid-column:span 2}body.pch-on #panel .bwx-gl{display:grid;grid-template-columns:1fr;gap:6px}body.pch-on #panel .bwx-gl .btn{white-space:nowrap;width:100%}</style>');
/* Bounties on PC (director, 2026-11-27: "it looks so small on pc"): the same page as the phones (e_ui.js renderBounties, styles in bs_rules05.js),
   sized for a full screen: three bounties across the whole width, larger type, a taller title band. */
document.head.insertAdjacentHTML('beforeend',`<style>
body.pch-on #panel .bq-head{min-height:118px;padding:16px 26px;gap:20px;margin-bottom:16px;border-radius:18px}
body.pch-on #panel .bq-ic{flex-basis:56px;width:56px;height:56px;border-width:4px;box-shadow:inset 0 0 0 8px #0e1a2c,inset 0 0 0 12px #7fe3c4}
body.pch-on #panel .bq-ti h3{font-size:38px}
body.pch-on #panel .bq-ti p{font-size:18px}
body.pch-on #panel .bq-row{gap:12px 18px;margin-bottom:16px}
body.pch-on #panel .bq-pick{min-height:60px;min-width:420px;font-size:21px;border-radius:14px}
body.pch-on #panel .bq-pick .bq-th{flex-basis:120px}
body.pch-on #panel .bq-ready{min-height:50px;padding:0 20px;font-size:18px}
body.pch-on #panel .bq-list{grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:8px;padding:12px;margin-bottom:16px}
body.pch-on #panel .bq-w{min-height:52px;font-size:17px}
body.pch-on #panel .bq-w .bq-th{flex-basis:76px}
body.pch-on #panel .bq-n{font-size:14px}
body.pch-on #panel .bq-grid{grid-template-columns:repeat(3,minmax(0,1fr));gap:18px}
body.pch-on #menuov #panel .tile.bq{padding:24px 28px!important;gap:14px;border-radius:18px}
body.pch-on #menuov #panel .tile.bq h4{font-size:26px!important;line-height:1.2!important}
body.pch-on #panel .bq-meta{font-size:17px}
body.pch-on #panel .bq-bar{height:13px;border-radius:7px}
body.pch-on #panel .bq-rew{gap:10px}
body.pch-on #panel .bq-lbl{flex:0 0 auto;font-size:16px;margin-right:6px}
body.pch-on #panel .bq-rew{margin-top:10px}
body.pch-on #panel .bq-rew > .bq-chip{flex:0 0 auto}
body.pch-on #panel .bq-chip{min-height:46px;padding:0 20px;font-size:18px;gap:10px}
body.pch-on #panel button.bq-chip.go{min-height:54px;font-size:19px}
body.pch-on #panel .bq-i-sc{width:14px;height:14px}
body.pch-on #panel .bq-i-cr{width:19px;height:15px}
body.pch-on #menuov #panel .tile.bq .bq-swap{min-height:46px!important;font-size:17px!important;padding:0 24px!important;margin-top:4px}
body.pch-on #panel .bq-claim{min-height:54px;font-size:19px}
</style>`);
