// =====================================================================
// Phones and tablets, round 8: every page is organised like the aquarium and the Dock (director, 2026-11-18: "Docks and aquarium
// are pinnacle layouts now of what we're looking for for mobile. Update every tab that hasn't been changed to the new standard
// organization and performance").
// The standard (one engine, the aquarium's own aq07 classes, so every page shares one look and one set of checks):
//  - The page itself never scrolls. A summary strip shows the page's key numbers and its main action (Sell all, Reset skills...).
//  - Under it, the page's sections as tabs (equal width, at the top of the panel) over ONE scrolling body. The page's intro is a
//    short note at the top of the body. Pages without sections that are long get them (Bounties, Events).
//  - Sideways: the summary on the left, the sections on the right (like the aquarium's view + options).
//  - The body keeps its scroll position when the page refreshes (a purchase or a live timer no longer jumps you to the top);
//    switching section starts at the top.
// Aquarium and Dock are the models (their own files); the Wardrobe gets their view + Options layout (below); Boardwalk and Trophy Room use this engine.
// Android + iPhone + tablets.
// =====================================================================
{ const h=(tag,cls,html)=>{ const e=document.createElement(tag); if(cls) e.className=cls; if(html!=null) e.innerHTML=html; return e; };
  const num=(t,re,i=1)=>{ const m=String(t||'').match(re); return m?m[i]:null; };
  const txt=e=>e?(e.textContent||'').replace(/\s+/g,' ').trim():'';
  const enabled=P=>sel=>[...P.querySelectorAll(sel)].filter(b=>!b.disabled).length;
  const locName=()=>{ try{ return LOCS[locIdx(S.loc)].name; }catch(e){ return ''; } };
  // per page: summary cells [label, value], the main actions (moved into the strip), and sections for long pages without any
  const CFG={
    cooler:{ cells:(P,hd)=>{ const t=txt(hd); const a=num(t,/(\d+) of (\d+) slots/), b=num(t,/(\d+) of (\d+) slots/,2), bo=num(t,/\+(\d+)% to every sale/); return [['In your cooler',a!=null?a+' / '+b:String(S.cooler.length)],bo!=null?['Sale bonus','+'+bo+'%']:null]; },
      acts:P=>[P.querySelector('[data-act="sellall"]')] },
    map:{ cells:()=>[['Fishing at',locName()],['Waters open',S.unlocked.length+' / '+LOCS.length]] },
    prestige:{ note:()=>'', cells:()=>[['Wisdom Pearls',String(S.pearls||0)],['Voyage',String((S.tides||0)+1)],['Pearl bonus','+'+Math.round((coinMult()-1)*100)+'% coins & XP']], groups:K=>{ const j=K.filter(c=>c.classList.contains('jsec')); const nm=c=>{ const h=c.querySelector('h2'); return h?h.textContent.trim():''; }; return j.map(c=>({name:nm(c),nodes:[c]})); } }, /* round 8: waters08.js */
    shop:{ cells:()=>{ let a=0,b=0; try{ for(const k in GEAR){ a+=(S.gear[k]|0); b+=GEAR[k].lv.length-1; } }catch(e){} return [['Gear upgrades',a+' / '+b],['Fishing at',locName()]]; } },
    rods:{ cells:(P,hd)=>[['Rod in use',txt(P.querySelector('.rp-card.on b'))||'—'],['Scales',txt(hd&&hd.querySelector('.pts'))||'0']] },
    skills:{ cells:(P,hd)=>[['Skill points',txt(hd&&hd.querySelector('.pts'))||'0'],['Level',String(S.lvl)]], acts:P=>[P.querySelector('[data-act="respec"]')] },
    paths:{ cells:P=>[['Level',String(S.lvl)],['Paths chosen',P.querySelectorAll('.spec.on, .spec[aria-pressed="true"]').length+' / 5']] },
    bounties:{ cells:P=>[['Ready to claim',String(enabled(P)('[data-act="taskclaim"],[data-act="wqclaim"],[data-act="bclaim"],[data-act="bounty"]'))],['Board',locName()]],
      groups:K=>{ const d=K.find(c=>c.classList.contains('dtasks')), w=K.find(c=>c.classList.contains('wq')); const rest=K.filter(c=>c!==d&&c!==w);
        const ready=ns=>ns.reduce((n,e)=>n+[...e.querySelectorAll('button[data-act$="claim"]')].filter(b=>!b.disabled).length,0)||0; /* a badge shows where a reward is waiting */
        return [{name:'Daily tasks',nodes:d?[d]:[],badge:d?ready([d]):0},{name:'Weekly quests',nodes:w?[w]:[],badge:w?ready([w]):0},{name:'Bounties',nodes:rest,badge:ready(rest)}]; } },
    pass:{ cells:(P,hd)=>{ const t=hd&&hd.querySelector('.tile'); return [['Tide Pass',txt(t&&t.querySelector('.rar'))||'—'],['Progress',(txt(t&&t.querySelector('.meta'))||'').replace(/\s*to level.*$/,'')||'—']]; } },
    feats:{ cells:(P,hd,sub)=>{ const t=txt(sub); return [['Feats done',(num(t,/(\d+) of (\d+) done/)||'0')+' / '+(num(t,/(\d+) of (\d+) done/,2)||'?')]]; } },
    events:{ cells:P=>{ const w=txt(P.querySelector('.wxf b, .wxf h4'))||''; return [['Weather now',(typeof wx3k==='function'?(()=>{ try{ return wx3k(); }catch(e){ return ''; } })():'')||w||'—'],['Challenges',String(P.querySelectorAll('.ev-grid > *').length)]]; },
      groups:K=>{ const cal=K.filter(c=>c.classList.contains('ev-cal')||c.classList.contains('wxf')); const hs=K.filter(c=>c.tagName==='H3'); const out=[{name:'Calendar',nodes:cal}];
        hs.forEach((hh,i)=>{ const a=K.indexOf(hh), b=i+1<hs.length?K.indexOf(hs[i+1]):K.length; out.push({name:txt(hh).replace(/^Fishing\s+/,'')||('Part '+(i+1)),nodes:K.slice(a,b)}); });
        const used=new Set(out.flatMap(g=>g.nodes)); const left=K.filter(c=>!used.has(c)); if(left.length) out[0].nodes=out[0].nodes.concat(left); return out; } },
    journal:{ cells:(P,hd,sub)=>{ const t=txt(sub); return [['Species found',(num(t,/(\d+) of (\d+) species/)||'0')+' / '+(num(t,/(\d+) of (\d+) species/,2)||'?')],['Mastery stars',num(txt(P.querySelector('.jrank b')),/(\d+)/)||'0']]; } },
    pets:{ cells:(P,hd,sub)=>{ const t=txt(sub); let fav=''; try{ fav=S.pet&&PETI[S.pet]?PETI[S.pet].name:''; }catch(e){} return [['Favourite',fav||'None yet'],['Pets found',(num(t,/(\d+) of (\d+) found/)||'0')+' / '+(num(t,/(\d+) of (\d+) found/,2)||'?')]]; } },
    settings:{ cells:()=>[['Settings for',(typeof IS_IPHONE==='function'&&IS_IPHONE())?'This iPhone':'This device'],['Saved','Automatically']] },
    stats:{ cells:P=>{ const t=P.textContent||'', b=t.match(/Bite speed[^×]{0,80}(×\s?[\d.]+)/), s=t.match(/Sale price[^×]{0,80}(×\s?[\d.]+)/); /* not Time played: the first card already shows it */
      return [['Level',String(S.lvl)], b?['Bite speed',b[1].replace(/\s/g,'')]:null, s?['Sale price',s[1].replace(/\s/g,'')]:null]; } },
    games:{ unwrap:'.bwx', note:P=>txt(P.querySelector('.bwx-ht p')), side:P=>P.querySelector('.bwx-hero'), drop:'.bwx-wallet',
      cells:P=>{ const wl=P.querySelector('.bwx-wallet'); if(!wl) return []; const sp=[...wl.children].map(txt); const f=re=>sp.find(s=>re.test(s));
        return [/* coins: already in the menu's top row */ ['Tickets',(num(f(/tickets/)||'',/([\d,]+)/)||'0')],['Scales',(num(f(/Scales/)||'',/([\d,]+)/)||'0')],f(/free spin/)?['Free spins',num(f(/free spin/),/(\d+)/)||'0']:null]; } },
    trophy:{ note:P=>txt(P.querySelector('.tp-sub')), drop:'.tp-head',
      cells:P=>{ const c=P.querySelector('.tp-count'); return [['Mounted',txt(c&&c.querySelector('b'))||'0'],['Species',(txt(c&&c.querySelector('span'))||'').replace(/\s*species$/,'').replace(' of ',' / ')||'—']]; } },
    save:{ cells:(P,hd,sub)=>{ const v=[...P.querySelectorAll(':scope > p.sub')].map(txt).find(t=>/^Version/.test(t)); let ago='just now'; try{ const s=Math.round((Date.now()-(S.savedAt||Date.now()))/1000); ago=s<60?'just now':s<3600?Math.round(s/60)+' min ago':Math.round(s/3600)+' h ago'; }catch(e){} return [['Last saved',ago],['Version',v?v.replace(/^Version\s*/,''):'—']]; } }
  };
  let prev=null; /* only a refresh of the page you are on keeps its place; opening a page starts at the top */
  const _rp=renderPanel; renderPanel=function(){ const P0=$('panel'); const ob=P0&&P0.classList.contains('pg08')&&P0.dataset.pgTab===S.tab?P0.querySelector('.aq07-body'):null; prev=ob?{tab:S.tab, top:ob.scrollTop, sec:P0.dataset.pgSec||''}:null;
    const r=_rp.apply(this,arguments);
    try{ const P=$('panel'), tab=S.tab, cfg=CFG[tab]; if(!P) return r;
      if(!MOB()||!cfg){ P.classList.remove('pg08','pg08-nostage'); delete P.dataset.pgTab; if(S.tab!=='aquarium'&&!P.classList.contains('dk08')) P.classList.remove('aq07','aq07-open'); return r; }
      const kids=[...P.children].filter(c=>!c.classList.contains('crumb'));
      const hd=kids.find(c=>c.classList.contains('row')&&!!c.querySelector('h2.dl-dup')), loneH=kids.find(c=>c.tagName==='H2'&&c.classList.contains('dl-dup')), sub=(hd&&hd.querySelector('.sub'))||kids.find(c=>c.tagName==='P'&&c.classList.contains('sub'));
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
      [...P.children].forEach(c=>{ if(!c.classList.contains('crumb')) c.remove(); }); P.appendChild(bar); P.appendChild(sheet); if(nv){ sheet.appendChild(nv); const n=nv.querySelectorAll(':scope > button').length; nv.style.setProperty('grid-template-columns',`repeat(${PG_COLS(nv,n)},minmax(0,1fr))`,'important'); } /* up to 4 tabs in one row; 5-6 in balanced rows of 3 */ sheet.appendChild(body);
      P.classList.add('aq07','aq07-open','pg08','pg08-nostage'); P.classList.remove('dk08'); P.dataset.pgTab=tab;
      if(nv){ const n2=nv.querySelectorAll(':scope > button').length; nv.style.setProperty('grid-template-columns',`repeat(${PG_COLS(nv,n2)},minmax(0,1fr))`,'important'); } /* measured again with the page's final layout */
      // keep the scroll place on a refresh of the same page and section; a new section starts at the top
      const curSec=()=>{ const s=nv&&nv.querySelector('[aria-selected="true"], [aria-pressed="true"], .on'); return s?(s.dataset.sect||s.dataset.k||s.dataset.v||txt(s).replace(/\s*\d+$/,'')):''; };
      P.dataset.pgSec=curSec(); const was=prev; if(was&&was.tab===tab&&was.top>0&&was.sec===P.dataset.pgSec) queueMicrotask(()=>{ if(body.isConnected) body.scrollTop=was.top; }); /* after the page is finished: one layout, not two */
      if(nv) nv.addEventListener('click',()=>setTimeout(()=>{ const s=curSec(); if(s!==P.dataset.pgSec){ P.dataset.pgSec=s; body.scrollTop=0; } },0));
    }catch(e){ console.error(e); } return r; }; }

document.head.insertAdjacentHTML('beforeend',`<style>
/* pages without a view: the strip on top, the sheet fills the rest (upright); sideways the summary column on the left */
html body.phone-app #menuov #panel.pg08 .pg08-sheet,html body.phone-land #menuov #panel.pg08 .pg08-sheet{flex:1 1 0;min-height:0}
html body.phone-app #menuov #panel.pg08 .pg08-bank b,html body.phone-land #menuov #panel.pg08 .pg08-bank b{display:block;font:800 14px var(--display)!important;color:#fff;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
html body.phone-app #menuov #panel.pg08 .pg08-note,html body.phone-land #menuov #panel.pg08 .pg08-note{margin:2px 2px 10px!important}
html body.phone-app #menuov #panel.pg08 .aq07-sheet > .bwx-nav,html body.phone-land #menuov #panel.pg08 .aq07-sheet > .bwx-nav{display:grid!important;grid-auto-flow:row!important;margin:0!important;position:static!important;box-shadow:none!important;flex:0 0 auto;overflow:visible!important}
html body.phone-app #menuov #panel.pg08 .aq07-sheet > .bwx-nav > button,html body.phone-land #menuov #panel.pg08 .aq07-sheet > .bwx-nav > button{min-width:0!important;width:auto!important}
html body.phone-app #menuov #panel.pg08 .aq07-body > .bwx-nav.sect-nav,html body.phone-land #menuov #panel.pg08 .aq07-body > .bwx-nav.sect-nav{position:sticky;top:0;z-index:2}
@media (orientation:landscape) and (max-height:560px){
  html body.phone-land #menuov #panel.aq07.pg08{display:grid!important;grid-template-columns:minmax(150px,.42fr) minmax(0,1fr)!important;grid-template-rows:minmax(0,1fr)!important;column-gap:10px}
  html body.phone-land #menuov #panel.pg08 .pg08-bar{grid-column:1;grid-row:1;align-self:start;flex-direction:column}
  html body.phone-land #menuov #panel.pg08 .pg08-sheet{grid-column:2;grid-row:1;height:100%}
  html body.phone-land #menuov #panel.pg08 .pg08-bank{grid-template-columns:minmax(0,1fr)!important;row-gap:8px!important;padding:10px!important}
  html body.phone-land #menuov #panel.pg08 .pg08-bank .btn{width:100%}
  html body.phone-land #menuov #panel.pg08 .pg08-body > .pg08-note{display:none!important}
  html body.phone-land #menuov #panel.aq07.pg08 .pg08-bar > .pg08-side{display:block}
}
html body.phone-app #menuov #panel.pg08 .pg08-bar > .pg08-side,html body.phone-land #menuov #panel.pg08 .pg08-bar > .pg08-side{display:none;margin:0;padding:2px 4px;font-size:12.5px;line-height:1.45;color:#97abc2}
</style>`);
/* the Aquarium and the Dock keep their place too: placing a decoration or adding a fish redraws the page, which jumped to the top */
{ const keep={}; const sec=P=>{ const s=P.querySelector('.aq07-sheet .sect-nav [aria-selected="true"]'); return s?s.textContent.trim():''; };
  const _rp=renderPanel; renderPanel=function(){ const P0=$('panel'); const t0=S.tab; delete keep[t0]; if(P0&&((t0==='aquarium'&&P0.classList.contains('aq07')&&!P0.classList.contains('dk08')&&!P0.classList.contains('pg08')&&!P0.classList.contains('wd08'))||(t0==='home'&&P0.classList.contains('dk08')))){ const b=P0.querySelector('.aq07-body'); if(b&&b.scrollTop>0) keep[t0]={top:b.scrollTop, sec:sec(P0)}; }
    const r=_rp.apply(this,arguments);
    try{ const P=$('panel'), t=S.tab; if(MOB()&&P&&(t==='aquarium'||t==='home')&&t===t0){ const b=P.querySelector('.aq07-body'), k=keep[t]; if(b&&k&&k.sec===sec(P)) queueMicrotask(()=>{ if(b.isConnected) b.scrollTop=k.top; }); } }catch(e){} return r; }; }
/* the Wardrobe works like the Dock: your angler is the live view, the categories are the Options panel's tabs */
{ let WD_OPEN=true; try{ WD_OPEN=localStorage.getItem('dl-wd-open')!=='0'; }catch(e){}
  const h=(tag,cls,html)=>{ const e=document.createElement(tag); if(cls) e.className=cls; if(html!=null) e.innerHTML=html; return e; };
  const _rp=renderPanel; renderPanel=function(){ const r=_rp.apply(this,arguments); try{ const P=$('panel'); if(!MOB()||S.tab!=='style'){ if(P) P.classList.remove('wd08'); return r; }
      const nav=P.querySelector(':scope > .wd-nav'), wrap=P.querySelector(':scope > .stylewrap'), prev=wrap&&wrap.querySelector(':scope > .wd-prev'), main=wrap&&wrap.querySelector(':scope > .wd-main'); if(!nav||!prev||!main) return r;
      const land=document.body.classList.contains('phone-land');
      const stage=h('div','aq07-stage wd08-stage'); stage.appendChild(prev);
      const bar=h('div','aq07-bar'); const cur=nav.querySelector('[aria-selected="true"] .wl'); const bank=h('div','aq07-bank wd08-bank',`<div><span class="sub">Wardrobe</span><b>${esc(cur?cur.textContent:'Your look')}</b></div><div><span class="sub">Tip</span><b>Tap to try on</b></div>`); bar.appendChild(bank);
      const tog=h('button','aq07-tog'); tog.type='button'; const paint=()=>{ tog.setAttribute('aria-expanded',String(WD_OPEN)); tog.title=WD_OPEN?'Hide the options and see your whole angler':'Show the wardrobe';
        tog.innerHTML=`<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="${land?(WD_OPEN?'M9 6l6 6-6 6':'M15 6l-6 6 6 6'):(WD_OPEN?'M6 9l6 6 6-6':'M6 15l6-6 6 6')}"/></svg><span>${WD_OPEN?'Hide':'Options'}</span>`; };
      paint(); bar.appendChild(tog); tog.addEventListener('click',e=>{ e.preventDefault(); e.stopPropagation(); WD_OPEN=!WD_OPEN; try{ localStorage.setItem('dl-wd-open',WD_OPEN?'1':'0'); }catch(er){} P.classList.toggle('aq07-open',WD_OPEN); paint(); });
      const sheet=h('div','aq07-sheet'), body=h('div','aq07-body '+wrap.className); sheet.appendChild(nav); sheet.appendChild(body); body.appendChild(main);
      [...P.children].forEach(c=>{ if(!c.classList.contains('crumb')) c.remove(); }); P.append(stage,bar,sheet);
      P.classList.add('aq07','wd08'); P.classList.toggle('aq07-open',WD_OPEN); P.classList.remove('pg08','pg08-nostage','dk08');
      const n=nav.querySelectorAll(':scope > button').length; nav.style.setProperty('grid-template-columns',`repeat(${PG_COLS(nav,n)},minmax(0,1fr))`,'important'); nav.querySelectorAll('.wl').forEach(l=>{ if(l.textContent.trim()==='Neck & back'&&l.scrollWidth>l.clientWidth+1){ l.textContent='Neck/back'; l.parentElement.title='Neck & back'; } }); /* narrowest phones */
    }catch(e){ console.error(e); } return r; };
  let rt=0, lastL=null; addEventListener('resize',()=>{ clearTimeout(rt); rt=setTimeout(()=>{ try{ const l=document.body.classList.contains('phone-land'); if(MOB()&&S.tab==='style'&&MENU_OPEN&&lastL!==null&&l!==lastL) renderPanel(); lastL=l; }catch(e){} },160); }); }
document.head.insertAdjacentHTML('beforeend',`<style>
html body.phone-app #menuov #panel.pg08 .pg08-bar > .pg08-sidev,html body.phone-land #menuov #panel.pg08 .pg08-bar > .pg08-sidev{display:none}
@media (orientation:landscape) and (max-height:560px){ html body.phone-land #menuov #panel.aq07.pg08 .pg08-bar > .pg08-sidev{display:block;margin:0!important;border-radius:12px;overflow:hidden} }
html body.phone-app #menuov #panel.wd08 .aq07-stage > .wd-prev,html body.phone-land #menuov #panel.wd08 .aq07-stage > .wd-prev{flex:1 1 auto;min-height:0;height:auto!important;max-height:none!important;width:auto!important;margin:0!important;border-radius:16px;overflow:hidden;display:flex;align-items:center;justify-content:center}
html body.phone-app #menuov #panel.wd08 .aq07-stage > .wd-prev > canvas,html body.phone-land #menuov #panel.wd08 .aq07-stage > .wd-prev > canvas{width:100%!important;height:100%!important;max-height:none!important;object-fit:contain;display:block}
html body.phone-app #menuov #panel.wd08 .wd08-bank,html body.phone-land #menuov #panel.wd08 .wd08-bank{grid-template-columns:repeat(2,minmax(0,1fr))!important}
html body.phone-app #menuov #panel.wd08 .wd08-bank b,html body.phone-land #menuov #panel.wd08 .wd08-bank b{display:block;font:800 14px var(--display)!important;color:#fff;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
html body.phone-app #menuov #panel.wd08 .aq07-body > .wd-main,html body.phone-land #menuov #panel.wd08 .aq07-body > .wd-main{width:auto!important;max-width:none!important;padding:0!important;overflow:visible!important;height:auto!important;max-height:none!important}
html body.phone-app #menuov #panel.wd08 .aq07-body,html body.phone-land #menuov #panel.wd08 .aq07-body{display:block!important;grid-template-columns:none!important}
</style>`);
document.head.insertAdjacentHTML('beforeend',`<style>
html body.phone-app #menuov #panel.wd08 .aq07-sheet > .bwx-nav,html body.phone-land #menuov #panel.wd08 .aq07-sheet > .bwx-nav{display:grid!important;grid-auto-flow:row!important;margin:0!important;position:static!important;box-shadow:none!important;flex:0 0 auto;overflow:visible!important;gap:6px!important}
html body.phone-app #menuov #panel.wd08 .aq07-sheet > .bwx-nav > button,html body.phone-land #menuov #panel.wd08 .aq07-sheet > .bwx-nav > button{min-width:0!important;width:auto!important;flex-direction:row!important;gap:5px!important}
</style>`);
document.head.insertAdjacentHTML('beforeend',`<style>
html body.phone-app #menuov #panel.wd08 .aq07-sheet > .bwx-nav,html body.phone-land #menuov #panel.wd08 .aq07-sheet > .bwx-nav,html body.phone-app #menuov #panel.pg08 .aq07-sheet > .bwx-nav,html body.phone-land #menuov #panel.pg08 .aq07-sheet > .bwx-nav{height:auto!important;min-height:0!important;max-height:none!important;grid-auto-rows:auto!important;align-content:start!important}
</style>`);
/* speed: pictures that are not on screen when a page opens are drawn right after it shows (or when they come into view) */
{ /* Pets: the Customize preview (hidden until you pick Customize) */
  const _pp=paintPetCustom; let io=null;
  paintPetCustom=function(){ if(!MOB()) return _pp.apply(this,arguments); const a=arguments, self=this;
    queueMicrotask(()=>{ const c=$('petcv'); if(!c) return; if(c.getClientRects().length){ _pp.apply(self,a); return; }
      clearTimeout(io); io=setTimeout(()=>{ try{ if($('petcv')) _pp(); }catch(er){} },120); }); };
  /* Dock: the decoration cards (the Decorations tab) */
  let q=null; const _dt=dockThumb, _mt=mysteryThumb;
  dockThumb=function(x){ if(q&&x&&x.canvas&&x.canvas.dataset&&x.canvas.dataset.dock){ q.push([_dt,this,[...arguments]]); return; } return _dt.apply(this,arguments); };
  mysteryThumb=function(x){ if(q&&x&&x.canvas&&x.canvas.dataset&&x.canvas.dataset.dock){ q.push([_mt,this,[...arguments]]); return; } return _mt.apply(this,arguments); };
  const _rh=renderHome; renderHome=function(){ if(!MOB()) return _rh.apply(this,arguments); q=[]; let jobs; try{ return _rh.apply(this,arguments); } finally{ jobs=q; q=null;
      if(jobs.length) queueMicrotask(()=>{ const now=[], later=[]; for(const j of jobs){ const c=j[2][0].canvas; if(!c||!c.isConnected) continue; (c.getClientRects().length?now:later).push(j); }
        for(const [f,t,a] of now){ try{ f.apply(t,a); }catch(e){} }
        const step=()=>{ const part=later.splice(0,8); for(const [f,t,a] of part){ if(a[0].canvas.isConnected) try{ f.apply(t,a); }catch(e){} } if(later.length) setTimeout(step,0); }; if(later.length) setTimeout(step,0); }); } }; }
/* labels in a section that was hidden when the page was built are fitted when you open that section (the fit step runs on any
   change inside the menu: a tiny no-op change after each section switch triggers it) */
document.addEventListener('click',e=>{ const b=e.target.closest&&e.target.closest('#panel.aq07 .aq07-sheet > .bwx-nav > button, #panel.aq07 .aq07-sheet > .sect-nav > button'); if(!b||!MOB()) return;
  setTimeout(()=>{ try{ const body=document.querySelector('#panel .aq07-body'); if(!body) return; const n=document.createComment(''); body.appendChild(n); n.remove(); }catch(er){} },0); },true);
/* short tab names where the full one does not fit a phone row */
{ const SHORT={'Move to another device':'Move progress','Aquarium & pets':'Tank & pets'};
  const _rp=renderPanel; renderPanel=function(){ const r=_rp.apply(this,arguments); try{ if(MOB()) document.querySelectorAll('#panel .aq07-sheet > .bwx-nav > button[data-sect]').forEach(b=>{ const s=SHORT[b.dataset.sect]; if(s&&b.firstChild&&b.firstChild.nodeType===3) b.firstChild.nodeValue=s+(b.firstChild.nodeValue.endsWith(' ')?' ':''); }); }catch(e){} return r; }; }
/* Waters, Set sail again: the locked button's label is shortened on phones so it fits its card ("Reach Hollow Trench first" -> "Reach Hollow Trench") */
{ const _rp=renderPanel; renderPanel=function(){ const r=_rp.apply(this,arguments); try{ if(MOB()&&S.tab==='map') document.querySelectorAll('#panel button[data-act="retire"][disabled]').forEach(b=>{ const m=b.textContent.trim().match(/^Reach (.+) first$/); if(m) b.textContent='Reach '+m[1]; }); }catch(e){} return r; }; }
/* colour choices (director: "color choices in customization don't look good and take up too much space, descriptions can be condensed
   with proper coloring"): every colour chip (home light, hull paint, pet colour) becomes a compact round swatch; the chosen colour's
   name sits next to its heading ("Light · Golden"); the name stays as the button's label for screen readers and long-press */
{ const _rp=renderPanel; renderPanel=function(){ const r=_rp.apply(this,arguments); try{ if(!MOB()) return r; const P=$('panel'); if(!P) return r;
    P.querySelectorAll('button.chipb').forEach(b=>{ if(b.classList.contains('mb-swatch')) return; const sw=b.querySelector('.hm-sw, .tint-dot'); if(!sw) return;
      const name=(b.textContent||'').trim(); b.classList.add('mb-swatch'); b.title=name; b.setAttribute('aria-label',name);
      [...b.childNodes].forEach(n=>{ if(n!==sw){ if(n.nodeType===3){ const s=document.createElement('span'); s.className='mb-swn'; s.textContent=n.nodeValue; n.replaceWith(s); } else if(n.nodeType===1) n.classList.add('mb-swn'); } });
      const row=b.parentElement; if(row) row.classList.add('mb-swrow'); });
    P.querySelectorAll('.chips.mb-swrow').forEach(row=>{ const hd=row.previousElementSibling; const on=row.querySelector('.mb-swatch[aria-pressed="true"]'); if(hd&&hd.tagName==='H5'&&on){ let t=hd.querySelector('.mb-swsel'); if(!t){ t=document.createElement('span'); t.className='mb-swsel'; hd.appendChild(t); } t.textContent=' · '+on.title; } });
    const note=P.querySelector('.hm-note'); if(note&&!note.dataset.short){ note.dataset.short='1'; note.textContent='Free to change. Every choice shows on the water at once.'; }
  }catch(e){ console.error(e); } return r; }; }
document.head.insertAdjacentHTML('beforeend',`<style>
html body.phone-app #menuov #panel .chips.mb-swrow,html body.phone-land #menuov #panel .chips.mb-swrow{display:flex!important;flex-wrap:wrap!important;gap:8px!important}
html body.phone-app #menuov #panel button.chipb.mb-swatch,html body.phone-land #menuov #panel button.chipb.mb-swatch{width:32px!important;min-width:32px!important;height:32px!important;padding:3px!important;border-radius:50%!important;position:relative;display:inline-flex!important;align-items:center;justify-content:center}
html body.phone-app #menuov #panel button.chipb.mb-swatch > .hm-sw,html body.phone-land #menuov #panel button.chipb.mb-swatch > .hm-sw,html body.phone-app #menuov #panel button.chipb.mb-swatch > .tint-dot,html body.phone-land #menuov #panel button.chipb.mb-swatch > .tint-dot{width:100%!important;height:100%!important;margin:0!important;border-radius:50%!important;display:block!important;vertical-align:0!important}
html body.phone-app #menuov #panel button.chipb.mb-swatch[aria-pressed="true"],html body.phone-land #menuov #panel button.chipb.mb-swatch[aria-pressed="true"]{box-shadow:0 0 0 2px #ffd36a!important;border-color:#ffd36a!important;background:#13233a!important}
html body.phone-app #menuov #panel .mb-swn,html body.phone-land #menuov #panel .mb-swn{position:absolute!important;width:1px!important;height:1px!important;overflow:hidden!important;clip:rect(0 0 0 0)!important;white-space:nowrap!important}
html body.phone-app #menuov #panel h5 .mb-swsel,html body.phone-land #menuov #panel h5 .mb-swsel{color:#ffd36a;text-transform:none;letter-spacing:0;font-weight:700}
html body.phone-app #menuov #panel .hm-note,html body.phone-land #menuov #panel .hm-note{font-size:12.5px!important;color:#97abc2!important;margin:10px 2px 2px!important}
</style>`);
document.head.insertAdjacentHTML('beforeend',`<style>
html body.phone-app #menuov #panel button.chipb.mb-swatch,html body.phone-land #menuov #panel button.chipb.mb-swatch{color:#eaf3fb!important} /* the hidden name keeps a readable colour (contrast check) */
</style>`);
document.head.insertAdjacentHTML('beforeend',`<style>
html body.phone-app #menuov #panel.wd08 .aq07-sheet > .bwx-nav > button .wi,html body.phone-land #menuov #panel.wd08 .aq07-sheet > .bwx-nav > button .wi{display:none!important} /* text tabs like every other page (8 tabs fit any width) */
</style>`);
document.head.insertAdjacentHTML('beforeend',`<style>
html body.phone-app #menuov #panel.wd08 .aq07-sheet > .bwx-nav > button .wl,html body.phone-land #menuov #panel.wd08 .aq07-sheet > .bwx-nav > button .wl{max-width:none!important;width:auto!important;overflow:visible!important;text-overflow:clip!important;flex:0 1 auto!important;min-width:0!important}
</style>`);
document.head.insertAdjacentHTML('beforeend',`<style>
html body.phone-app #menuov #panel.wd08 .aq07-sheet > .bwx-nav > button,html body.phone-land #menuov #panel.wd08 .aq07-sheet > .bwx-nav > button{padding-left:3px!important;padding-right:3px!important;justify-content:center!important}
</style>`);
/* "home", not "dock", wherever the text is about any water (director: "some places won't be called docks, make sure that's corrected
   for places without a true dock"). Phones and tablets: the Home page, feats, Tide Pass rewards, notices and Search. Flavour text
   (a fish that is "a dock regular") stays. */
const DEDOCK=[[/\bDock decoration:/g,'Home decoration:'],[/\bDock decorations\b/g,'Home decorations'],[/\bDock wood: pale, pearly planks for any of your docks\./g,'Home wood: pale, pearly planks for any home with wood.'],
  [/\bdecorations on your dock\b/g,'decorations at your home'],[/\bcozy on your dock\b/g,'cozy at your home'],[/\bYour dock is full\b/g,'Your home is full'],[/\bfor more docks\b/g,'for more homes'],
  [/\bYou are editing the dock at\b/g,'You are editing your home at'],[/\bIt starts as a copy of the dock you arrive with\b/g,'It starts as a copy of the home you arrive with'],
  [/^Tap again: replace the (.+) dock$/,'Tap again: replace your home at $1'],[/\bPreviewing on your dock:/g,'Trying at your home:'],[/\bon your dock\b/g,'at your home'],
  [/\bYour dock and its decorations\b/g,'Your home and its decorations'],[/\bYour dock at each water\b/g,'Your home at each water'],[/^Home: dock\b/,'Home'],[/^Full dock$/,'Full home']];
const deDockText=s=>{ if(!s||s.indexOf('ock')<0) return s; let t=s; for(const [re,to] of DEDOCK) t=t.replace(re,to); return t; };
{ const walk=root=>{ if(!root) return; const it=document.createTreeWalker(root,NodeFilter.SHOW_TEXT); let n; while((n=it.nextNode())){ const v=n.nodeValue; if(v.indexOf('ock')<0) continue; const t=deDockText(v); if(t!==v) n.nodeValue=t; } };
  const _rp=renderPanel; renderPanel=function(){ const r=_rp.apply(this,arguments); try{ if(MOB()) walk($('panel')); }catch(e){} return r; };
  const _t=toast; toast=function(m){ return _t.call(this,MOB()?deDockText(String(m)):m); };
  /* Search results are built from the index when you type: their text is fixed as it appears */
  new MutationObserver(ms=>{ if(!MOB()) return; for(const m of ms) for(const a of m.addedNodes) if(a.nodeType===1) walk(a); }).observe(document.body,{childList:true,subtree:false});
  document.addEventListener('input',()=>{ if(MOB()) setTimeout(()=>{ const sv=document.getElementById('searchov'); if(sv) walk(sv); },0); },true); }
/* touch words only (director: "Mobile users don't need to know about 'space' in the how to fish tooltip"). The phone builds run on touch
   screens, so the hint, the catch card and the pages never mention Space, clicking or a mouse, even if a browser reports a mouse. */
const TOUCH_TXT=[[/<b>Click the water<\/b> where you want to cast \(or hold Space for the power meter\)\./g,'<b>Tap the water</b> where you want to cast.'],
  [/<b>Hold<\/b> on the water \(or Space\) to charge a cast, <b>release<\/b> to throw\./g,'<b>Touch and hold</b> the water to charge a cast, <b>let go</b> to throw.'],
  [/Click or press Space to set the hook\./g,'Tap to set the hook.'],[/^Release to cast\./,'Let go to cast.'],
  [/Click or press Space to keep fishing/g,'Tap to keep fishing'],[/Click a fish for its records/g,'Tap a fish for its records'],[/\s*\(or (hold )?Space[^)]*\)/g,'']];
const touchText=s=>{ if(!s||!/Space|Click|Release/.test(s)) return s; let t=s; for(const [re,to] of TOUCH_TXT) t=t.replace(re,to); return t; };
{ const fix=el=>{ if(!el) return; const h=el.innerHTML, t=touchText(h); if(t!==h) el.innerHTML=t; };
  const watch=id=>{ const el=document.getElementById(id); if(!el) return; fix(el); new MutationObserver(()=>fix(el)).observe(el,{childList:true,characterData:true,subtree:true}); };
  const start=()=>{ watch('hint'); watch('card'); }; if(document.readyState==='loading') addEventListener('DOMContentLoaded',start); else setTimeout(start,0);
  const _rp=renderPanel; renderPanel=function(){ const r=_rp.apply(this,arguments); try{ const P=$('panel'); if(P){ const it=document.createTreeWalker(P,NodeFilter.SHOW_TEXT); let n; while((n=it.nextNode())){ const v=n.nodeValue; if(!/Space|Click/.test(v)) continue; const t=touchText(v); if(t!==v) n.nodeValue=t; } } }catch(e){} return r; }; }
/* Save > App on phones: how to install Driftline on THIS phone (the Windows program was the only thing offered) */
{ const _rp=renderPanel; renderPanel=function(){ const r=_rp.apply(this,arguments); try{ if(!MOB()||S.tab!=='save') return r; const P=$('panel');
      const tile=[...P.querySelectorAll('.tile')].find(t=>/Windows desktop app/.test(t.textContent)); if(!tile||tile.dataset.mb) return r; tile.dataset.mb='1';
      const ip=typeof IS_IPHONE==='function'&&IS_IPHONE(), app=window.matchMedia&&(matchMedia('(display-mode: standalone)').matches||matchMedia('(display-mode: fullscreen)').matches)||navigator.standalone;
      tile.innerHTML=app?`<h4>Installed</h4><p class="meta">You are playing the Driftline app on this ${ip?'iPhone':'phone'}. It opens full screen and keeps your progress here.</p>`
        :`<h4>Play it like an app</h4><p class="meta">${ip?'In Safari, tap <b>Share</b>, then <b>Add to Home Screen</b>.':'Open the browser menu <b>⋮</b> and tap <b>Install app</b> (or <b>Add to Home screen</b>).'} Driftline then opens full screen from its own icon and keeps your progress.</p>`;
      tile.insertAdjacentHTML('beforeend','<p class="meta" style="margin-top:8px">Playing on a computer too? There is a Windows app; bring your progress with <b>Move progress</b>.</p>');
    }catch(e){ console.error(e); } return r; }; }
/* badges never cut off or covering a neighbour (director, 2026-11-18, screenshot: the side rail's "2" on Fishing was cut off at the
   top, the "1" for Upgrades sat over the button above). In menus the rail is a scrolling box, and its badges poked 12 px above each
   button: the first one was clipped, the others covered the button above. Rail badges now sit inside their button, as a count at
   the right end of the row (centred); collapsed, in the button's top-right corner. */
document.head.insertAdjacentHTML('beforeend',`<style>
html body.phone-land #menuov .secbar .secb,html body.phone-app #menuov .secbar .secb{position:relative!important}
html body.phone-land #menuov #tabs .secbar .secb .secdot,html body.phone-app #menuov #tabs .secbar .secb .secdot{top:50%!important;bottom:auto!important;right:4px!important;left:auto!important;transform:translateY(-50%)!important;margin:0!important}
</style>`);
document.head.insertAdjacentHTML('beforeend',`<style>
html body.phone-land.dock-mini #menuov #tabs .secbar .secb .secdot{top:0!important;right:0!important;bottom:auto!important;left:auto!important;transform:none!important} html body.phone-land.dock-mini #menuov #tabs .secbar .secb{justify-content:center!important;padding-left:0!important;padding-right:0!important} html body.phone-land.dock-mini #menuov #tabs .secbar .secb .seci{margin:0!important;transform:translateY(3px)} /* collapsed rail (director: "doesn't look centered"): every icon in the middle of its button, a touch low so the badge fits in the top-right corner */
</style>`);
/* how many section tabs share a row: up to 4 in one row, 5-6 in rows of 3, 7-8 in rows of 4, but never narrower than ~70 px a tab (the fit step shrinks a long label a little, never below 11 px)
   (round 8: the Wardrobe's side sheet is only ~234 px wide on the smallest iPhone, where 4 tabs a row cut "Clothes") */
function PG_COLS(el,n){ const base=n<=4?n:n<=6?3:4; let w=0; try{ w=el&&el.isConnected?el.getBoundingClientRect().width:0; }catch(e){} if(w>0&&n<=6&&(w+6)/n>=118) return n; /* all in one row when each tab still gets ~118 px */ return w>0?Math.max(2,Math.min(base,Math.floor((w+6)/74))):base; }
document.head.insertAdjacentHTML('beforeend',`<style>html body.phone-app #menuov #panel.wd08 .aq07-sheet > .bwx-nav > button .wl,html body.phone-land #menuov #panel.wd08 .aq07-sheet > .bwx-nav > button .wl{white-space:nowrap!important}</style>`); /* one line per tab; the fit step shrinks a long one a little */
document.head.insertAdjacentHTML('beforeend',`<style>@media (orientation:landscape) and (max-height:560px) and (max-width:760px){ html body.phone-land #menuov #panel.wd08 .aq07-sheet > .bwx-nav{gap:4px!important} html body.phone-land #menuov #panel.wd08 .aq07-sheet > .bwx-nav > button{padding-left:2px!important;padding-right:2px!important} html body.phone-land #menuov #panel.wd08 .aq07-sheet > .bwx-nav > button .wl{max-width:100%!important;overflow:hidden!important} }</style>`); /* smallest iPhones: the Wardrobe's 3-a-row tabs get 4 px more room each */
/* round 8 (director: "A lot of tabs take up way too much space on the left side when it comes to info. So much empty space wasted"):
   sideways, pages without a picture no longer give a whole left column to two or three numbers and the intro. The summary is one slim
   strip across the top (numbers side by side, the page's main button at the end), the content gets the full width, and the intro
   opens the scrolling content instead (it scrolls away). The Boardwalk too: its pier picture only repeated the intro, so sideways it steps aside. */
document.head.insertAdjacentHTML('beforeend',`<style>
@media (orientation:landscape) and (max-height:560px){
  html body.phone-land #menuov #panel.aq07.pg08{grid-template-columns:minmax(0,1fr)!important;grid-template-rows:auto minmax(0,1fr)!important;row-gap:8px!important}
  html body.phone-land #menuov #panel.pg08 .pg08-bar{grid-column:1!important;grid-row:1!important;flex-direction:row!important;align-self:stretch!important}
  html body.phone-land #menuov #panel.pg08 .pg08-sheet{grid-column:1!important;grid-row:2!important}
  html body.phone-land #menuov #panel.pg08 .pg08-bank{display:flex!important;align-items:center!important;gap:18px!important;padding:7px 12px!important;flex:1 1 auto}
  html body.phone-land #menuov #panel.pg08 .pg08-bank > div{flex:0 1 auto;min-width:0;max-width:40%}
  html body.phone-land #menuov #panel.pg08 .pg08-bank > .btn{width:auto!important;margin-left:auto!important;flex:0 0 auto}
  html body.phone-land #menuov #panel.pg08 .pg08-bank > .btn ~ .btn{margin-left:0!important}
  html body.phone-land #menuov #panel.pg08 .pg08-bar > .pg08-side{display:none!important}
  html body.phone-land #menuov #panel.pg08 .pg08-body > .pg08-note{display:block!important}
}
</style>`);
/* round 8 (director: "most left side things in mobile tabs definitely can be condensed and sized properly"): sideways the summary
   strip is one slim line (each label next to its number), and cards keep a readable width (at least 200 px: two a row on the smallest
   iPhones, three on bigger ones) now that the content has the full width */
document.head.insertAdjacentHTML('beforeend',`<style>
@media (orientation:landscape) and (max-height:560px){
  html body.phone-land #menuov #panel.pg08 .pg08-bank{padding:5px 10px!important;min-height:38px;box-sizing:border-box}
  html body.phone-land #menuov #panel.pg08 .pg08-bank > div{display:flex!important;align-items:baseline;gap:6px;white-space:nowrap}
  html body.phone-land #menuov #panel.pg08 .pg08-bank > div > .sub{margin:0!important}
  html body.phone-land #menuov #panel.pg08 .pg08-bank > div > b{min-width:0}
  html body.phone-land #menuov #panel.pg08 .pg08-bank > .btn{min-height:30px!important}
  html body.phone-land #menuov #panel.pg08 .pg08-body .grid:not(.sect-one){grid-template-columns:repeat(auto-fill,minmax(200px,1fr))!important}
}
</style>`);
document.head.insertAdjacentHTML('beforeend',`<style>@media (orientation:landscape) and (max-height:560px){ html body.phone-land #menuov #panel.pg08 .pg08-bar > .pg08-sidev{display:none!important} }</style>`);
