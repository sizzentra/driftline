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
body.pch-on #panel .bq-chg{padding:5px 14px;font-size:15px}
body.pch-on #panel .bq-layer{gap:16px}
body.pch-on #panel .bq-lh{gap:18px}
body.pch-on #panel .bq-lh h3{font-size:34px}
body.pch-on #panel .bq-ct b{font-size:18px}
body.pch-on #panel .bq-ct small{font-size:13px}
body.pch-on #menuov #panel .bq-acts .btn{min-height:50px!important;font-size:17px!important;padding:0 22px!important}
body.pch-on #panel .bq-acts{gap:12px}
body.pch-on #nibodds .no-t{font-size:18px}
body.pch-on #nibodds .no-t thead th{font-size:15px}
body.pch-on #nibodds .no-t th,body.pch-on #nibodds .no-t td{padding:5px 22px}
body.pch-on #nibodds .sub{max-width:480px}
body.pch-on #menuov #panel .bq-x{min-height:50px!important;font-size:18px!important;padding:0 26px!important}
body.pch-on #panel .bq-list{grid-auto-rows:minmax(0,150px);gap:12px}
body.pch-on #panel .bq-w{font-size:21px;padding:0 18px;gap:14px;border-radius:14px}
body.pch-on #panel .bq-w.pic{padding-left:0}
body.pch-on #panel .bq-w.pic::before{content:"";flex:0 0 34%;align-self:stretch;background:var(--th) center 62%/cover} /* the water's own picture, where it is drawn already; the room for it is PC's */
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
/* the water layer on PC shows each water's picture: one not drawn yet is drawn here, one at a time and only in a calm moment (as the background queue in ar_ember033.js does), and the run ends by itself when all are in or the layer is gone */
pageDone('bounties',function bqPics(P){ const miss=[...P.querySelectorAll('.bq-layer .bq-w:not(.pic)')].filter(b=>V3SCENES[b.dataset.k]&&(THUMB_FAIL[b.dataset.k]||0)<2); if(!miss.length) return;
  const b=miss[0], k=b.dataset.k, calm=G.st==='idle'||G.st==='waiting'||G.st==='rest'||G.st==='event'; /* an event card waiting for an answer is calm too */ if(calm&&!V3THUMB[k]){ v3Thumb(k); if(!V3THUMB[k]) THUMB_FAIL[k]=(THUMB_FAIL[k]||0)+1; }
  for(const m of miss){ const u=V3THUMB[m.dataset.k]; if(u){ m.style.setProperty('--th','url('+u+')'); m.classList.add('pic'); } }
  setTimeout(()=>{ if(P.isConnected&&S.tab==='bounties'&&MENU_OPEN) bqPics(P); },calm?60:1500); });

/* The Cooler page on PC, laid out after the director's sketch of 2026-11-28 ("just the layout"): a title band (name, what the page is for, how full the
   cooler is with a bar, then Upgrade, Sell all and Scrap all), one row for the Sell all filters and the sorting, the fishmonger's line, the fish.
   Built from what the page engine has drawn (cx_pages.js): the engine's summary strip gives way to the band, the sort chips to one "Sort by" list.
   The game's own drawn fish and panels stay; nothing about what the buttons do changes. Keep stays a button among the others: it mounts the fish in
   the Trophy Room for good, so a star that reads as "favourite" would mislead. */
pageDone('cooler',function ckLayout(P){ const bar=P.querySelector('.pg08-bar'), bank=bar&&bar.querySelector('.pg08-bank'), body=P.querySelector('.pg08-body'); if(!bank||!body) return;
  const n=S.cooler.length, cap=gv('cooler'), sale=Math.round((sellMult()-1)*100), note=body.querySelector('.pg08-note'), head=document.createElement('div'); head.className='ck-head';
  head.innerHTML=`<div class="ck-ti"><h3>Cooler</h3><p>${note?esc(note.textContent):''}</p></div><div class="ck-cap"><b>${n} / ${cap} fish</b><span>+${sale}% sale bonus</span><div class="ck-bar"><i style="width:${Math.min(100,Math.round(n/Math.max(1,cap)*100))}%"></i></div></div><div class="ck-acts"></div>`;
  bank.querySelectorAll(':scope > button').forEach(b=>head.lastChild.appendChild(b)); bar.replaceWith(head); if(note) note.remove();
  const sf=body.querySelector('.sellf'), sort=body.querySelector('.cool-sort');
  if(sf&&sort){ const chips=[...sort.querySelectorAll('[data-act="coolsort"]')], fld=document.createElement('div'); fld.className='fld ck-sort';
    fld.innerHTML=`<span class="fld-l">Sort by</span><select aria-label="Sort the fish by">${chips.map(c=>`<option value="${esc(c.dataset.k)}"${c.classList.contains('on')?' selected':''}>${esc(c.textContent)}</option>`).join('')}</select>`;
    fld.lastChild.addEventListener('change',e=>{ const b=document.createElement('button'); b.type='button'; b.hidden=true; b.dataset.act='coolsort'; b.dataset.k=e.target.value; P.appendChild(b); b.click(); if(b.parentNode) b.remove(); });
    sf.appendChild(fld); sort.remove();
    /* the fishmonger's wish sits in the free middle of this row; as a line of its own it took a whole row of the page for one sentence (director, 2026-11-28: "look how much space fishmongers is taking up") */
    const left=body.querySelector('#dmleft'), wish=left&&left.closest('.tile'); if(wish){ wish.classList.add('ck-monger'); sf.insertBefore(wish,fld); } } });
document.head.insertAdjacentHTML('beforeend',`<style>
body.pch-on #menuov #panel .ck-head{display:flex;align-items:center;gap:28px;padding:18px 26px;margin:0 0 14px;border:1px solid var(--line);border-radius:18px;background:#0e1a2c}
body.pch-on #menuov #panel .ck-ti{flex:0 1 auto;min-width:0}
body.pch-on #menuov #panel .ck-ti h3{margin:0;font:800 40px/1.1 var(--display,system-ui);color:#fff}
body.pch-on #menuov #panel .ck-ti p{margin:4px 0 0;font-size:16px;color:#cfd9e4}
body.pch-on #menuov #panel .ck-cap{flex:1 1 320px;max-width:520px;padding:12px 18px;border:1px solid var(--line);border-radius:14px;background:#0a1424}
body.pch-on #menuov #panel .ck-cap b{display:block;font:800 24px/1.2 var(--display,system-ui);color:#fff}
body.pch-on #menuov #panel .ck-cap span{font:700 15px var(--display,system-ui);color:#7fe3c4}
body.pch-on #menuov #panel .ck-bar{height:10px;margin-top:8px;border-radius:5px;background:#0a1220;border:1px solid var(--line);overflow:hidden}
body.pch-on #menuov #panel .ck-bar i{display:block;height:100%;background:linear-gradient(90deg,#3fd0b5,#7fe3c4)}
body.pch-on #menuov #panel .ck-acts{margin-left:auto;display:flex;flex-wrap:wrap;justify-content:flex-end;align-items:center;gap:12px}
body.pch-on #menuov #panel .ck-acts .btn{min-height:54px!important;font-size:18px!important;padding:0 24px!important}
body.pch-on #menuov #panel[data-pg-tab="cooler"] .sellf.lab{display:flex;flex-wrap:wrap;align-items:flex-end;gap:10px 22px;margin:0 0 12px;padding:14px 20px;border-radius:16px}
body.pch-on #menuov #panel[data-pg-tab="cooler"] .sellf.lab .fld-title{flex:0 0 auto;align-self:center;margin:0 10px 0 0;font:800 19px var(--display,system-ui)}
body.pch-on #menuov #panel[data-pg-tab="cooler"] .sellf.lab .fld{flex:0 0 auto}
body.pch-on #menuov #panel[data-pg-tab="cooler"] .sellf.lab .fld-l{font-size:12px}
body.pch-on #menuov #panel[data-pg-tab="cooler"] .sellf.lab select{min-width:210px;min-height:42px;font-size:16px}
body.pch-on #menuov #panel[data-pg-tab="cooler"] .sellf.lab input{min-height:42px;font-size:16px;width:150px}
body.pch-on #menuov #panel[data-pg-tab="cooler"] .sellf.lab .chipb{min-height:42px;font-size:15px;padding:0 16px}
body.pch-on #menuov #panel[data-pg-tab="cooler"] .sellf.lab .ck-monger{flex:0 1 auto;min-width:0;margin:0 0 0 auto!important;padding:6px 14px!important;gap:10px!important;border-radius:12px;background:#0a1424}
body.pch-on #menuov #panel[data-pg-tab="cooler"] .sellf.lab .ck-monger canvas{width:56px!important;height:28px!important}
body.pch-on #menuov #panel[data-pg-tab="cooler"] .sellf.lab .ck-monger b{font-size:15px}
body.pch-on #menuov #panel[data-pg-tab="cooler"] .sellf.lab .ck-monger .meta{font-size:13px}
</style>`);

/* The fish rows of the Cooler on PC, after the director's second sketch (2026-11-28): a lock at the front, the name with its rarity as a pill, weight and
   marks under it, then every aquarium bonus the fish has on a line of its own (a fish can hold several: the line wraps), price and coins per hour, and
   the actions as a picture with its word (Sell and Scrap cannot be undone, so they keep their words). The buttons are the page's own, with what they do. */
const CK_ICON={ totank:'<rect x="3" y="6" width="18" height="12" rx="3"/><path d="M8 12c2-2.6 5-2.6 7 0-2 2.6-5 2.6-7 0zm7 0l2.6-1.8v3.6z"/>', sell:'<ellipse cx="12" cy="8" rx="6" ry="2.6"/><path d="M6 8v4c0 1.4 2.7 2.6 6 2.6s6-1.2 6-2.6V8M6 12v4c0 1.4 2.7 2.6 6 2.6s6-1.2 6-2.6v-4"/>', scrap:'<path d="M19 12a7 7 0 1 1-2.2-5.1"/><path d="M19.5 4.5v4.2h-4.2"/>', inspect:'<circle cx="12" cy="12" r="8.5"/><path d="M12 11v5.5M12 7.6v.4"/>', keep:'<path d="M8 4h8v4.5a4 4 0 0 1-8 0z"/><path d="M8 5.5H5.2a2.8 2.8 0 0 0 2.8 3.4M16 5.5h2.8a2.8 2.8 0 0 1-2.8 3.4M12 12.5V17M8.5 20h7"/>', lock:'<rect x="5.5" y="10.5" width="13" height="9.5" rx="2"/><path d="M8.5 10.5V8a3.5 3.5 0 0 1 7 0v2.5"/>' };
const ckSvg = k => `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${CK_ICON[k]}</svg>`;
pageDone('cooler',function ckRows(P){ if(!P.querySelector('.ck-head')) return;
  for(const row of P.querySelectorAll('.pg08-body .fishrow')){ const sell=row.querySelector('[data-act="sell"]'), i=sell?+sell.dataset.i:-1, f=S.cooler[i], sp=f&&SPI[f.id], nm=row.querySelector('.nm'), acts=row.querySelector('.acts'); if(!sp||!nm||!acts) continue;
    nm.innerHTML=`<span class="ck-n"><b style="color:${RAR[sp.r].c}">${esc(sp.name)}</b><i class="ck-r" style="--rc:${RAR[sp.r].c}">${RAR[sp.r].k}</i></span><small>${kgStr(f.kg)}${tags(f)}${sellKeepWhy(f)&&!f.lk?'<em class="ck-kept" title="Sell all and Scrap all leave it alone (the filters above)">Sell all skips it</em>':''}</small>`; /* a fish the filters keep says so on its card: the count on the Sell all button alone left the director looking for a lock */
    /* the aquarium bonuses sit on one line of their own under the name and the price, one chip a bonus in the colour of its tier; the line runs the whole width of the card, under the buttons too (director, 2026-11-28: "theres room for it to go sideways if the buffs went down just a tade underneath the icons"), and never wraps, so
       every row is the same height however many bonuses a fish holds (director, 2026-11-28: "the fact that cards woudlnt all be the same size is a bad idea") */
    { const L=aqMerged(f); /* bonuses on the same stat add up into one chip (cz_inspect.js) */ row.insertAdjacentHTML('beforeend',`<div class="ck-bs" title="In the aquarium: ${esc(aqTxt(f))}"><span class="ck-bl" aria-label="In the aquarium">${ckSvg('totank')}</span>${L.length?L.map(e=>`<i style="--rc:${RAR[e.t].c}">${aqChipTxt(e)}</i>`).join(''):'<i class="none">no bonus</i>'}</div>`); }
    const h=row.querySelector('.aqh'); if(h) h.textContent=h.textContent.replace(' in tank','');
    row.insertAdjacentHTML('afterbegin',`<button type="button" class="ck-lock" data-act="coollock" data-i="${i}" aria-pressed="${!!f.lk}" aria-label="${f.lk?'Locked':'Lock'}: Sell all and Scrap all leave ${esc(sp.name)} alone" title="${f.lk?'Locked: Sell all and Scrap all leave it alone. Click to unlock.':'Lock it: Sell all and Scrap all will leave it alone.'}">${ckSvg('lock')}</button>`);
    for(const b of acts.querySelectorAll('button')){ const k=b.classList.contains('tp-keep')?'keep':b.dataset.act==='totank'?'totank':b.dataset.act==='sell'?'sell':b.dataset.act==='inspect'?'inspect':'scrap', word={keep:'Keep',totank:'Display',sell:'Sell',scrap:'Scrap',inspect:'Inspect'}[k];
      if(!b.title) b.title={keep:'',totank:'',sell:'Sell this fish',scrap:'Scrap it for Nibbles',inspect:'See its full card'}[k]; b.classList.add('ck-a'); b.innerHTML=ckSvg(k)+`<span>${word}</span>`; } }
  /* chips that do not fit the line give way to one that counts them; the full list is the line's tooltip and the fish's Inspect card */
  for(const bs of P.querySelectorAll('.ck-bs')){ const chips=[...bs.querySelectorAll('i')], w=bs.clientWidth; if(!chips.length||chips[chips.length-1].offsetLeft+chips[chips.length-1].offsetWidth<=w) continue;
    let keep=chips.length; while(keep>1&&chips[keep-1].offsetLeft+chips[keep-1].offsetWidth>w-50) keep--; for(const c of chips.slice(keep)) c.remove(); const ins=bs.parentNode.querySelector('[data-act="inspect"]'); bs.insertAdjacentHTML('beforeend','<button type="button" class="more" data-act="inspect" data-k="cooler" data-i="'+(ins?ins.dataset.i:'')+'" title="See every bonus on its card">+'+(chips.length-keep)+' more</button>'); } /* the chip that says something is hidden is the way to see it: it opens the fish's Inspect card */ });
document.head.insertAdjacentHTML('beforeend',`<style>
body.pch-on #menuov #panel[data-pg-tab="cooler"] .pg08-body .list > .fishrow{display:grid!important;grid-template-columns:40px 96px minmax(0,1fr) 118px auto!important;grid-template-rows:auto auto!important;justify-items:stretch;column-gap:14px;row-gap:5px;align-items:center;padding:10px 14px;min-height:0}
body.pch-on #menuov #panel[data-pg-tab="cooler"] .fishrow > .ck-lock{grid-column:1;grid-row:1 / 3}
body.pch-on #menuov #panel[data-pg-tab="cooler"] .fishrow > canvas{grid-column:2;grid-row:1 / 3}
body.pch-on #menuov #panel[data-pg-tab="cooler"] .fishrow > .nm{grid-column:3;grid-row:1;justify-self:stretch;text-align:left;margin:0}
body.pch-on #menuov #panel[data-pg-tab="cooler"] .fishrow > .val{grid-column:4;grid-row:1}
body.pch-on #menuov #panel[data-pg-tab="cooler"] .fishrow > .acts{grid-column:5;grid-row:1}
body.pch-on #menuov #panel[data-pg-tab="cooler"] .ck-bs{grid-column:3 / -1;grid-row:2;position:relative;display:flex;flex-wrap:nowrap;align-items:center;gap:6px;min-height:24px;overflow:hidden;white-space:nowrap;font-size:13px}
body.pch-on #menuov #panel[data-pg-tab="cooler"] .ck-bs .ck-bl{flex:0 0 auto;display:grid;place-items:center;color:#97abc2}
body.pch-on #menuov #panel[data-pg-tab="cooler"] .ck-bs .ck-bl svg{width:17px;height:17px}
body.pch-on #menuov #panel[data-pg-tab="cooler"] .ck-bs i{flex:0 0 auto;font-style:normal;line-height:1.2;padding:2px 9px;border-radius:999px;background:#0a1424;border:1px solid var(--rc,#7fe3c4);color:#e6efe8}
body.pch-on #menuov #panel[data-pg-tab="cooler"] .ck-bs i.none{border-color:var(--line);color:#97abc2}
body.pch-on #menuov #panel[data-pg-tab="cooler"] .ck-bs .more{flex:0 0 auto;font:inherit;line-height:1.2;padding:2px 9px;border-radius:999px;background:#0a1424;border:1px dashed #97abc2;color:#cfd9e4;cursor:pointer}
body.pch-on #menuov #panel[data-pg-tab="cooler"] .ck-bs .more:focus-visible{outline:3px solid #7fe3c4;outline-offset:2px}
body.pch-on #menuov #panel[data-pg-tab="cooler"] .fishrow > canvas{flex:0 0 96px;width:96px;height:48px}
body.pch-on #menuov #panel[data-pg-tab="cooler"] .fishrow .nm{flex:1 1 0;min-width:0;display:flex;flex-direction:column;gap:2px}
body.pch-on #menuov #panel[data-pg-tab="cooler"] .ck-n{display:flex;align-items:center;gap:10px;min-width:0}
body.pch-on #menuov #panel[data-pg-tab="cooler"] .ck-n b{font:800 18px/1.2 var(--display,system-ui);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
body.pch-on #menuov #panel[data-pg-tab="cooler"] .ck-r{flex:0 0 auto;font:800 12px/1 var(--display,system-ui);font-style:normal;color:var(--rc);padding:4px 10px;border:1px solid var(--rc);border-radius:999px}
body.pch-on #menuov #panel[data-pg-tab="cooler"] .fishrow .nm small{font-size:14px;line-height:1.3;color:#cfd9e4}
body.pch-on #menuov #panel[data-pg-tab="cooler"] .ck-kept{font-style:normal;font-size:12px;font-weight:800;color:#ffd36a;margin-left:10px;padding:1px 8px;border:1px solid #ffd36a66;border-radius:999px}
body.pch-on #menuov #panel[data-pg-tab="cooler"] .fishrow .val{flex:0 0 118px;text-align:left}
body.pch-on #menuov #panel[data-pg-tab="cooler"] .fishrow .acts{flex:0 0 auto;display:flex;gap:6px}
body.pch-on #menuov #panel[data-pg-tab="cooler"] .ck-a{display:flex!important;flex-direction:column;align-items:center;justify-content:center;gap:2px;width:64px;min-height:54px!important;padding:4px 0!important;font-size:11.5px!important;line-height:1.1}
body.pch-on #menuov #panel[data-pg-tab="cooler"] .ck-lock{flex:0 0 40px;width:40px;height:40px;display:grid;place-items:center;border-radius:10px;border:1px solid var(--line);background:#0a1424;color:#8fa6ba;cursor:pointer}
body.pch-on #menuov #panel[data-pg-tab="cooler"] .ck-lock[aria-pressed="true"]{color:#1d1300;border-color:#ffd36a;background:linear-gradient(180deg,#ffe08a,#f3b94e)}
body.pch-on #menuov #panel[data-pg-tab="cooler"] .ck-lock:focus-visible{outline:3px solid #7fe3c4;outline-offset:2px}
body.pch-on #menuov #panel[data-pg-tab="cooler"] .sellf.lab .fld-title{width:auto}
</style>`);
