// =====================================================================
// The page engine, shared since PC Reborn (director, 2026-11-21: "Gui decisions and layouts should be copied from mobile"; moved from
// mobile/pages08.js). Every page is organised like the Aquarium: a strip with the page's key numbers and main action, its sections as
// tabs, and ONE scrolling body. The page parts (cells, actions, sections) are written once here; each platform styles the frame
// (.pg08) its own way: mobile/pages08.js for phones, pc/pages_pc.js for PC. A platform can leave a page out (PAGES_SKIP: PC keeps its
// Fish Log, Aquarium and Home layouts) and decides how many tabs share a row (PG_COLS).
// =====================================================================
const PAGES_SKIP=new Set(), PAGES={before(){}, after(){}}; /* each platform wraps renderPanel: PAGES.before(); draw; PAGES.after() */
/* Clean Pages (2026-11-21): a page's own finishing touches, run in order at the very end of PAGES.after (after the page engine has
   laid the page out, or skipped it), so a platform file adds them with pageDone('settings',fn) instead of wrapping renderPanel again */
const PAGE_DONE={}; function pageDone(tab,fn){ (PAGE_DONE[tab]=PAGE_DONE[tab]||[]).push(fn); }
function pageDoneRun(){ const P=$('panel'), L=PAGE_DONE[S.tab]; if(P&&L) for(const f of L) try{ f(P); }catch(e){ console.error(e); } }
{ const h=(tag,cls,html)=>{ const e=document.createElement(tag); if(cls) e.className=cls; if(html!=null) e.innerHTML=html; return e; };
  const num=(t,re,i=1)=>{ const m=String(t||'').match(re); return m?m[i]:null; };
  const txt=e=>e?(e.textContent||'').replace(/\s+/g,' ').trim():'';
  const enabled=P=>sel=>[...P.querySelectorAll(sel)].filter(b=>!b.disabled).length;
  const locName=()=>{ try{ return LOCS[locIdx(S.loc)].name; }catch(e){ return ''; } };
  // per page: summary cells [label, value], the main actions (moved into the strip), and sections for long pages without any
  const CFG={
    cooler:{ cells:(P,hd)=>{ const t=txt(hd); const m=t.match(/([\d,]+) of ([\d,]+) slots/), bo=t.match(/\+([\d,]+)% to every sale/); return [['In your cooler',m?m[1]+' / '+m[2]:S.cooler.length+' / '+gv('cooler')],bo?['Sale bonus','+'+bo[1]+'%']:null]; },
      acts:P=>[P.querySelector('[data-act="sellall"]'),P.querySelector('[data-act="scrapall"]')].filter(Boolean) }, /* Cam's list #7: Scrap all beside Sell all */
    map:{ cells:()=>[['Fishing at',locName()],['Waters open',S.unlocked.length+' / '+LOCS.length]] },
    prestige:{ note:()=>'', cells:()=>[['Wisdom Pearls',String(S.pearls||0)],['Voyage',String((S.tides||0)+1)],['Pearl bonus','+'+Math.round((coinMult()-1)*100)+'% coins & XP']], groups:K=>{ const j=K.filter(c=>c.classList.contains('jsec')); const nm=c=>{ const h=c.querySelector('h2'); return h?h.textContent.trim():''; }; return j.map(c=>({name:nm(c),nodes:[c]})); } }, /* round 8: waters08.js */
    quests:{ note:()=>'', cells:()=>{ let g=null; try{ g=_nextGoal_036(); }catch(e){ try{ g=nextGoal(); }catch(e2){ oops('cx_pages:nextGoal',e2); } } const pc=g&&g.p!=null?Math.round(Math.max(0,Math.min(1,g.p))*100)+'%':(g&&g.ready?'Ready':'—'); const r=Array.isArray(S.settings.q8read)?S.settings.q8read.filter(id=>Q8_LESSONS.some(l=>l[0]===id)).length:0; return [g&&(g.ready||g.p!=null)?['Next goal',g.ready?'Ready':pc]:null,['Lessons read',r+' / '+Q8_LESSONS.length]]; }, groups:K=>K.filter(c=>c.dataset&&c.dataset.q8sec).map(c=>({name:c.dataset.q8sec,nodes:[c]})) }, /* round 8: quests08.js */
    oddities:{ note:()=>'', cells:()=>{ const od=JUNK.filter(J=>J.t<3), tr=JUNK.filter(J=>J.t>=3), f=a=>a.filter(J=>S.junk[J.id]).length; return [['Oddities',f(od)+' / '+od.length],['Treasures',f(tr)+' / '+tr.length]]; }, groups:K=>K.filter(c=>c.dataset&&c.dataset.od8).map(c=>({name:c.dataset.od8,nodes:[c]})) }, /* round 8: waters08.js */
    bait:{ note:()=>'', cells:()=>{ const B=BAIT[S.baitSel]||BAIT.worm, own=Object.keys(BAIT).filter(k=>k==='worm'||(S.bait[k]||0)>0).length; return [['In use',B.name+(S.baitSel!=='worm'?' · '+(S.bait[S.baitSel]||0):'')],['Kinds you have',String(own)]]; }, groups:K=>K.filter(c=>c.dataset&&c.dataset.bt8).map(c=>({name:c.dataset.bt8,nodes:[c]})) }, /* round 8: waters08.js */
    shop:{ cells:()=>{ let a=0,b=0; try{ for(const k in GEAR){ a+=(S.gear[k]|0); b+=GEAR[k].lv.length-1; } }catch(e){ oops('cx_pages:a',e); } return [['Gear upgrades',a+' / '+b],['Fishing at',locName()]]; } },
    rods:{ cells:(P,hd)=>[['Rod in use',txt(P.querySelector('.rp-card.on b'))||'—'],['Scales',txt(hd&&hd.querySelector('.pts'))||'0']] },
    skills:{ cells:(P,hd)=>[['Skill points',txt(hd&&hd.querySelector('.pts'))||'0'],['Level',String(S.lvl)]], acts:P=>[P.querySelector('[data-act="respec"]')] },
    paths:{ cells:P=>[['Level',String(S.lvl)],['Paths chosen',P.querySelectorAll('.spec.on, .spec[aria-pressed="true"]').length+' / '+SPEC_TIERS.length]] },
    bounties:{ cells:P=>[['Ready to claim',String(enabled(P)('[data-act="taskclaim"],[data-act="wqclaim"],[data-act="bclaim"],[data-act="bounty"]'))],['Board',locName()]],
      groups:K=>{ const w=K.find(c=>c.classList.contains('wq')), d=K.find(c=>c!==w&&c.classList.contains('tile')&&/Daily tasks/i.test((c.querySelector('h4')||{}).textContent||'')); /* the weekly card also wears .dtasks (its grid style), so the daily card is found by its title (director, 2026-11-19: a weekly reward badged the Daily tab) */ const rest=K.filter(c=>c!==d&&c!==w);
        const ready=ns=>ns.reduce((n,e)=>n+[...e.querySelectorAll('button[data-act$="claim"]')].filter(b=>!b.disabled).length,0)||0; /* a badge shows where a reward is waiting */
        return [{name:'Daily tasks',nodes:d?[d]:[],badge:d?ready([d]):0},{name:'Weekly quests',nodes:w?[w]:[],badge:w?ready([w]):0},{name:'Bounties',nodes:rest,badge:ready(rest)}]; } },
    pass:{ cells:(P,hd)=>{ const t=hd&&hd.querySelector('.tile'); return [['Tide Pass',txt(t&&t.querySelector('.rar'))||'—'],['Progress',(txt(t&&t.querySelector('.meta'))||'').replace(/\s*to level.*$/,'')||'—']]; }, acts:P=>[P.querySelector('[data-act="passclaim"]')] }, /* Cam, 2026-11-20: the claim button went with the header box, so Tide Pass rewards could not be claimed on phones */
    feats:{ cells:(P,hd,sub)=>{ const t=txt(sub); return [['Feats done',(num(t,/(\d+) of (\d+) done/)||'0')+' / '+(num(t,/(\d+) of (\d+) done/,2)||'?')]]; } },
    events:{ cells:P=>{ const w=txt(P.querySelector('.wxf b, .wxf h4'))||''; return [['Weather now',(typeof wx3k==='function'?(()=>{ try{ return wx3k(); }catch(e){ return ''; } })():'')||w||'—'],['Challenges',String(P.querySelectorAll('.ev-grid > *').length)]]; },
      groups:K=>{ const cal=K.filter(c=>c.classList.contains('ev-cal')||c.classList.contains('wxf')); const hs=K.filter(c=>c.tagName==='H3'); const out=[{name:'Calendar',nodes:cal}];
        hs.forEach((hh,i)=>{ const a=K.indexOf(hh), b=i+1<hs.length?K.indexOf(hs[i+1]):K.length; out.push({name:txt(hh).replace(/^Fishing\s+/,'')||('Part '+(i+1)),nodes:K.slice(a,b)}); });
        const used=new Set(out.flatMap(g=>g.nodes)); const left=K.filter(c=>!used.has(c)); if(left.length) out[0].nodes=out[0].nodes.concat(left); return out; } },
    journal:{ cells:(P,hd,sub)=>{ const t=txt(sub), m=t.match(/([\d,]+) of ([\d,]+) species/); return [['Species found',m?m[1]+' / '+m[2]:'0'],['Mastery stars',num(txt(P.querySelector('.jrank b')),/(\d+)/)||'0']]; } },
    pets:{ cells:(P,hd,sub)=>{ const t=txt(sub); let fav=''; try{ fav=S.pet&&PETI[S.pet]?PETI[S.pet].name:''; }catch(e){ oops('cx_pages:fav',e); } return [['Favourite',fav||'None yet'],['Pets found',(num(t,/(\d+) of (\d+) found/)||'0')+' / '+(num(t,/(\d+) of (\d+) found/,2)||'?')]]; } },
    settings:{ cells:()=>[['Settings for',(typeof IS_IPHONE==='function'&&IS_IPHONE())?'This iPhone':'This device'],['Saved','Automatically']] },
    stats:{ cells:P=>{ const t=P.textContent||'', b=t.match(/Bite speed[^×]{0,80}(×\s?[\d.]+)/), s=t.match(/Sale price[^×]{0,80}(×\s?[\d.]+)/); /* not Time played: the first card already shows it */
      return [['Level',String(S.lvl)], b?['Bite speed',b[1].replace(/\s/g,'')]:null, s?['Sale price',s[1].replace(/\s/g,'')]:null]; } },
    games:{ unwrap:'.bwx', note:P=>txt(P.querySelector('.bwx-ht p')), side:P=>P.querySelector('.bwx-hero'), drop:'.bwx-wallet',
      cells:P=>{ const wl=P.querySelector('.bwx-wallet'); if(!wl) return []; const sp=[...wl.children].map(txt); const f=re=>sp.find(s=>re.test(s));
        return [/* coins: already in the menu's top row */ ['Tickets',(num(f(/tickets/)||'',/([\d,]+)/)||'0')],['Scales',(num(f(/Scales/)||'',/([\d,]+)/)||'0')],f(/free spin/)?['Free spins',num(f(/free spin/),/(\d+)/)||'0']:null]; } },
    trophy:{ note:P=>txt(P.querySelector('.tp-sub')), drop:'.tp-head',
      cells:P=>{ const c=P.querySelector('.tp-count'), f=P.querySelector('.tp-foot'), room=f&&(txt(f).match(/Room for ([\d,]+)/)||[])[1]; return [['Mounted',txt(c&&c.querySelector('b'))||'0'],['Species',(txt(c&&c.querySelector('span'))||'').replace(/\s*species$/,'').replace(' of ',' / ')||'—'],room?['Room for',room+' more']:null]; } }, /* round 8: "Room for N more" moves from under the wall into the strip */
    save:{ cells:(P,hd,sub)=>{ const v=[...P.querySelectorAll(':scope > p.sub')].map(txt).find(t=>/^Version/.test(t)); let ago='just now'; try{ const s=Math.round((Date.now()-(S.savedAt||Date.now()))/1000); ago=s<60?'just now':s<3600?Math.round(s/60)+' min ago':Math.round(s/3600)+' h ago'; }catch(e){ oops('cx_pages:Math.round',e); } return [['Last saved',ago],['Version',v?v.replace(/^Version\s*/,''):'—']]; } }
  };
  let prev=null; /* only a refresh of the page you are on keeps its place; opening a page starts at the top */
  PAGES.before=function(){ const P0=$('panel'); const ob=P0&&P0.classList.contains('pg08')&&P0.dataset.pgTab===S.tab?P0.querySelector('.aq07-body'):null; prev=ob?{tab:S.tab, top:ob.scrollTop, sec:P0.dataset.pgSec||''}:null;
    };
  PAGES.after=function(){
    try{ const P=$('panel'), tab=S.tab, cfg=CFG[tab]; if(!P) return;
      if(!cfg||PAGES_SKIP.has(tab)){ P.classList.remove('pg08','pg08-nostage'); delete P.dataset.pgTab; if(S.tab!=='aquarium'&&!P.classList.contains('dk08')) P.classList.remove('aq07','aq07-open'); pageDoneRun(); return; }
      const kids=[...P.children].filter(c=>!c.classList.contains('crumb'));
      /* the page's own header: marked dl-dup when a side-panel tab names the page; pages opened only from the top bar (Cooler, Fish Log)
         have no such tab, so their first header row / title counts too */
      const hd=kids.find(c=>c.classList.contains('row')&&!!c.querySelector('h2.dl-dup'))||kids.slice(0,3).find(c=>c.classList.contains('row')&&!!c.querySelector(':scope > div > h2'))||null, loneH=kids.find(c=>c.tagName==='H2'&&c.classList.contains('dl-dup'))||(!hd&&kids[0]&&kids[0].tagName==='H2'?kids[0]:null), sub=(hd&&hd.querySelector('.sub'))||kids.find(c=>c.tagName==='P'&&c.classList.contains('sub'));
      // pages built inside one wrapper (Boardwalk): its parts become the page's parts; its class goes on the body so its styles still apply
      let bodyCls=''; if(cfg.unwrap){ const wr=P.querySelector(':scope > '+cfg.unwrap); if(wr){ bodyCls=wr.className; [...wr.children].forEach(c=>P.insertBefore(c,wr)); wr.remove(); kids.splice(0,kids.length,...[...P.children].filter(c=>!c.classList.contains('crumb'))); } }
      const nav=kids.find(c=>c.classList.contains('bwx-nav')&&!c.closest('.grid'));
      // the strip: summary cells + main actions
      const cells=(cfg.cells(P,hd,sub)||[]).filter(Boolean), acts=(cfg.acts?cfg.acts(P):[]).filter(Boolean);
      const bar=h('div','aq07-bar pg08-bar'), bank=h('div','aq07-bank pg08-bank'); bar.appendChild(bank);
      cells.forEach(([l,v])=>bank.appendChild(h('div',null,`<span class="sub">${esc(l)}</span><b>${esc(String(v))}</b>`)));
      acts.forEach(b=>{ b.classList.add('sm'); bank.appendChild(b); });
      bank.style.gridTemplateColumns=`repeat(${Math.max(1,cells.length)},minmax(0,1fr))`+(acts.length?` repeat(${acts.length},auto)`:'');
      // the sheet: tabs + one scrolling body
      const sheet=h('div','aq07-sheet pg08-sheet'), body=h('div','aq07-body pg08-body'+(bodyCls?' '+bodyCls:''));
      let note=cfg.note?cfg.note(P):sub?txt(sub):'';
      /* the intro never repeats what the summary already shows ("1 of 8 slots" next to "1 / 8", "+34%" next to "+34%") */
      if(note&&cells.length){ const pats=[]; for(const [,v] of cells){ const s=String(v), m=s.match(/^([\d,]+)\s*\/\s*([\d,]+)$/); if(m) pats.push(new RegExp('\\b'+m[1]+' of '+m[2]+'\\b')); else if(/\d/.test(s)) pats.push(new RegExp(s.replace(/[.*+?^${}()|[\]\\]/g,'\\$&'))); }
        if(pats.length){ const parts=note.replace(/([.!?])\s+/g,'$1\u0001').split(/\u0001|\s+·\s+/); /* no look-behind: older iPhones can't parse it */ const keep=parts.filter(p=>!pats.some(re=>re.test(p))); note=keep.join(/\s·\s/.test(note)&&!/[.!?]\s/.test(note)?' · ':' ').trim(); } }
      if(cfg.side){ const sd=cfg.side(P); if(sd){ sd.classList.add('pg08-sidev'); bar.appendChild(sd); } }
      if(cfg.drop) P.querySelectorAll(cfg.drop).forEach(x=>x.remove()); const extra=hd?[...hd.children].filter(c=>!c.contains(sub)&&!c.querySelector('h2')&&!c.querySelector('.pts')&&!(c.classList.contains('tile')&&tab==='pass')&&!c.querySelector('[data-act="respec"]')):[];
      if(note&&tab!=='save'&&tab!=='settings'){ body.appendChild(h('p','aq07-note pg08-note',esc(note))); bar.appendChild(h('p','pg08-side',esc(note))); } /* upright the intro opens the body; sideways it sits under the summary */
      extra.forEach(x=>body.appendChild(x));
      const rest=kids.filter(c=>c!==hd&&c!==loneH&&c!==sub&&c!==nav&&c.isConnected&&c.parentElement===P);
      rest.forEach(c=>body.appendChild(c));
      let nv=nav;
      if(!nv&&cfg.groups){ try{ const K=[...body.children].filter(c=>!c.classList.contains('pg08-note')); const gs=cfg.groups(K).filter(g=>g.nodes.length); if(gs.length>1){ sectionize(body,tab,gs); nv=body.querySelector(':scope > .bwx-nav'); } }catch(e){ console.error(e); } }
      [...P.children].forEach(c=>{ if(!c.classList.contains('crumb')) c.remove(); }); P.appendChild(bar); P.appendChild(sheet); if(nv){ sheet.appendChild(nv); } /* tab columns are set once below, after the page's final layout classes */ /* up to 4 tabs in one row; 5-6 in balanced rows of 3 */ sheet.appendChild(body);
      P.classList.add('aq07','aq07-open','pg08','pg08-nostage'); P.classList.remove('dk08'); P.dataset.pgTab=tab;
      if(nv){ const n2=nv.querySelectorAll(':scope > button').length; nv.style.setProperty('grid-template-columns',`repeat(${PG_COLS(nv,n2)},minmax(0,1fr))`,'important'); } /* measured again with the page's final layout */
      // keep the scroll place on a refresh of the same page and section; a new section starts at the top
      const curSec=()=>{ const s=nv&&nv.querySelector('[aria-selected="true"], [aria-pressed="true"], .on'); return s?(s.dataset.sect||s.dataset.k||s.dataset.v||txt(s).replace(/\s*\d+$/,'')):''; };
      P.dataset.pgSec=curSec(); const was=prev; if(was&&was.tab===tab&&was.top>0&&was.sec===P.dataset.pgSec) queueMicrotask(()=>{ if(body.isConnected) body.scrollTop=was.top; }); /* after the page is finished: one layout, not two */
      if(nv) nv.addEventListener('click',()=>setTimeout(()=>{ const s=curSec(); if(s!==P.dataset.pgSec){ P.dataset.pgSec=s; body.scrollTop=0; } },0));
      pageDoneRun();
    }catch(e){ console.error(e); } }; }

/* test builds: window.__menuMap() lists what a player can reach: the sections and their pages, every page's name, and every page's tabs.
   The sweep runs it on PC and on a phone and compares the two (PC Reborn rule: PC never falls behind the phones again). */
if(/[?&]test\b/.test(location.search)) window.__menuMap=async()=>{ const w=ms=>new Promise(r=>setTimeout(r,ms)), clean=s=>String(s||'').replace(/\s*·\s*\d.*$/,'').replace(/\s+\d+$/,'').trim();
  const label=t=>{ try{ return (menuTabLabel(t)||[])[1]||t; }catch(e){ return t; } };
  const pages=new Set(['cooler','aquarium','journal','bait','stats','settings']); for(const s of MENU_SECS) for(const t of s.tabs) pages.add(t);
  const out={secs:MENU_SECS.map(s=>({id:s.id, name:s.short||s.name, tabs:s.tabs.slice()})), labels:{}, tabs:{}};
  for(const t of pages){ out.labels[t]=label(t); try{ openMenu(t); }catch(e){ continue; } await w(220); const P=$('panel'); if(!P||S.tab!==t) continue;
    out.tabs[t]=[...P.querySelectorAll('.sect-nav > button')].map(b=>clean(b.dataset.sect||b.textContent)).filter(Boolean); }
  try{ closeMenu(); }catch(e){ oops('cx_pages:closeMenu',e); } return out; };
/* Rod presets on every platform (Cam, round 5: "What happened to having 3 presets in Your Rods?": PC lost them when its Rods page moved to the shared page engine; this block lived only in the phone layer). The box goes right after the first node of the "Your rods" tab and is shown and hidden with it. */
  pageDone('rods',P=>{ /* a finishing touch of the Rods page, run by the page engine (Clean Pages 2026-11-21: was its own renderPanel wrapper) */
      /* the page engine moves the tab bar above the page body, so the "Your rods" group is found from its content: the body's first item, before the Rod rack heading */
      const body=P.querySelector('.pg08-body')||P, head=c=>{ const h=c.matches('h2,h4,h5')?c:c.querySelector('h2,h4,h5'); return h?h.textContent.trim():''; };
      const ks=[...body.children].filter(c=>!c.classList.contains('pg08-note')&&!c.classList.contains('rp-box')&&!c.classList.contains('sect-nav')), rack=ks.findIndex(c=>head(c)==='Rod rack'); const first=rack>0?ks[0]:null; if(!first) return;
      let box=P.querySelector('.rp-box'); if(!box){ first.insertAdjacentHTML('afterend',rodPresetsHTML()); box=first.nextElementSibling; } else first.after(box);
      P.querySelectorAll('h2').forEach(h=>{ if(/^(Rod rack|Attachments)$/.test(h.textContent.trim())) h.classList.add('rp8-dup'); }); /* the tab above already names it */
      /* shown and hidden with Your rods: synced when a tab is picked (it was a new watcher on every redraw, never released) */
      const sync=()=>{ box.style.display=first.style.display; }; sync(); const nv=P.querySelector('.sect-nav'); if(nv) nv.addEventListener('click',()=>setTimeout(sync,0)); });
/* the Nibbles strip above the tank (Cam, round 5; ce_nibbles.js builds it) */
pageDone('aquarium',P=>{ if(P.querySelector('.nibstrip')||!S.tank.length) return; const bank=P.querySelector('.bank'), body=P.querySelector('.pg08-body'); if(bank) bank.insertAdjacentHTML('afterend',nibStripHTML()); else if(body) body.insertAdjacentHTML('afterbegin',nibStripHTML()); });
