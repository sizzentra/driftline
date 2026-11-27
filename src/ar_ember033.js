// =====================================================================
// EMBER SPRINGS rebuilt (0.3.3): a natural lava-rock shelf to stand on, a real travertine hillside, a basalt headland
// =====================================================================
// the shelf: one weathered slab of dark basalt with a worn flat top, soft joints, a warm crust, ferns in the cracks,
// a glowing seam and a little steam vent, standing in the warm water (the part under the surface fades into it)

// the travertine hillside: a soft hill with creamy terraces stepping down it, turquoise pools on each step, scrub on top
function embHillY(hz,X){ const segs=[[[-2,hz-H*.135],[W*.06,hz-H*.15],[W*.14,hz-H*.12],[W*.22,hz-H*.06]],[[W*.22,hz-H*.06],[W*.28,hz-H*.03],[W*.33,hz-H*.008],[W*.37,hz+1]]];
  for(const s of segs){ let px=null,py=null; for(let i=0;i<=30;i++){ const u=i/30,v=1-u, xx=v*v*v*s[0][0]+3*v*v*u*s[1][0]+3*v*u*u*s[2][0]+u*u*u*s[3][0], yy=v*v*v*s[0][1]+3*v*v*u*s[1][1]+3*v*u*u*s[2][1]+u*u*u*s[3][1]; if(px!==null&&X>=px&&X<=xx) return py+(yy-py)*(X-px)/(xx-px||1); px=xx; py=yy; } } return hz; }

// the basalt headland: tall hexagonal columns of varied height, each with a lit facet, a shaded facet and a tilted
// cap; talus at the foot, green on top


// =====================================================================
// Waters tab pictures, 1:1: a still frame of the real scene (sky, scenery, life, the place you stand, foreground),
// rendered on the game canvas at a fixed daytime moment in clear weather and copied out. The next game frame
// redraws over it, so it is never seen. Rendered once per session.
// =====================================================================
var THUMB_CLEAR=false;
const _wx3k_th = wx3k; wx3k = function(){ return THUMB_CLEAR?'Clear':_wx3k_th(); };
function v3Thumb(id){ if(V3THUMB[id]) return V3THUMB[id]; const L=LOCS.find(l=>l.id===id); if(!L||!V3SCENES[id]||!(W>40&&H>40)) return null;
  const oWXA=WXA; try{ THUMB_CLEAR=true; WXA=0; v3palette.k=null; const hz=HZ(), t=(function(){ let tt=42; if(typeof sfEvent==="function") while(sfEvent(tt).into<=SF_DUR+1) tt+=1.7; return tt; })(), p=.3, /* a calm moment between events */ gloom=id==='deep'?.1:0;
    g.save(); g.setTransform(DPR,0,0,DPR,0,0); g.clearRect(0,0,W,H);
    v3Scene(L,t,p,0,0,gloom,hz,{k:'Clear'}); v3Platform(L,t,0,H*.6,0); v3Fore(L,t,0); g.restore();
    const tw=840, th=Math.round(840*H/W), c=document.createElement('canvas'); c.width=tw; c.height=th; c.getContext('2d').drawImage(cv,0,0,cv.width,cv.height,0,0,tw,th);
    V3THUMB[id]=c.toDataURL('image/jpeg',.86); thumbSave(id,V3THUMB[id]); }
  catch(e){ V3THUMB[id]=null; console.warn('thumb '+id,e); }
  finally{ THUMB_CLEAR=false; WXA=oWXA; v3palette.k=null; }
  return V3THUMB[id]; };
// Waters pictures are rendered in the background, one per idle moment after the game loads, so opening the Waters
// tab never freezes; any still missing when the tab opens fade in as they finish.
const THUMB_Q={busy:false};
function thumbIdle(fn){ (window.requestIdleCallback||((f)=>setTimeout(()=>f({timeRemaining:()=>16}),120)))(fn,{timeout:1500}); }
const THUMB_FAIL={};
function thumbNext(){ const id=LOCS.map(l=>l.id).find(id=>V3SCENES[id]&&!V3THUMB[id]&&(THUMB_FAIL[id]||0)<2); if(!id){ THUMB_Q.busy=false; return; } THUMB_Q.busy=true;
  (S.tab==='map'&&MENU_OPEN?f=>setTimeout(f,40):thumbIdle)(()=>{ if((G.st!=='idle'&&G.st!=='waiting'&&G.st!=='rest')||!MENU_OPEN){ /* resting is calm too (2026-11-22). Cam's list #2: with the Map open the pictures come one after another, not one per idle moment */ setTimeout(thumbNext,1500); return; } /* only while a menu is open (thumbnails are only seen there): never a hitch while fishing */ v3Thumb(id); if(!V3THUMB[id]) THUMB_FAIL[id]=(THUMB_FAIL[id]||0)+1; const i=LOCS.findIndex(l=>l.id===id), el=document.querySelectorAll('.loc .sw2')[i]; if(el&&V3THUMB[id]){ el.style.background='url('+V3THUMB[id]+') center/cover'; el.classList.add('v3th'); el.animate&&el.animate([{opacity:.3},{opacity:1}],{duration:400}); } setTimeout(thumbNext,60); }); }
setTimeout(thumbNext,3000);
// the Waters pictures are kept on the device between visits (Cam's list #2: after a restart they took about 10 s to appear); a new
// build or a changed home makes fresh ones, and old ones are cleared out
const THUMB_DB={ready:null};
const thumbSig = () => { const s=(window.DL_VERSION||'')+'|'+LOCS.map(L=>L.id).join(','); /* a new build or a new water list makes fresh pictures (homes are fixed: no choices to follow, 2026-11-25) */ let h=0; for(let i=0;i<s.length;i++) h=(h*31+s.charCodeAt(i))|0; return String(h>>>0); };
function thumbDB(){ if(THUMB_DB.ready) return THUMB_DB.ready; return THUMB_DB.ready=new Promise(res=>{ try{ const r=indexedDB.open('dl-thumbs',1); r.onupgradeneeded=()=>{ try{ r.result.createObjectStore('t'); }catch(e){ oops('ar_ember033:result.createObjectStore',e); } }; r.onsuccess=()=>res(r.result); r.onerror=()=>res(null); }catch(e){ oops('ar_ember033:indexedDB.open',e); res(null); } }); }
function thumbSave(id,url){ if(!url||!window.indexedDB) return; const k=thumbSig()+'|'+id; thumbDB().then(db=>{ if(!db) return; try{ db.transaction('t','readwrite').objectStore('t').put(url,k); }catch(e){ oops('ar_ember033:db.transaction',e); } }); }
function thumbLoadAll(){ if(!window.indexedDB) return; const sig=thumbSig(); thumbDB().then(db=>{ if(!db) return; try{ const rq=db.transaction('t','readwrite').objectStore('t').openCursor();
  rq.onsuccess=()=>{ const c=rq.result; if(!c){ const P=document.getElementById('panel'); if(P&&S.tab==='map'&&MENU_OPEN) v3WaterThumbs(P); return; } const k=String(c.key); if(k.startsWith(sig+'|')){ const id=k.slice(sig.length+1); if(!V3THUMB[id]) V3THUMB[id]=c.value; } else c.delete(); c.continue(); }; }catch(e){ oops('ar_ember033:db.transaction#2',e); } }); }
setTimeout(thumbLoadAll,0);
function v3WaterThumbs(P){ P.querySelectorAll('.loc .sw2').forEach((el,i)=>{ const L=LOCS[i]; if(!L) return; const u=V3THUMB[L.id]; if(u){ el.style.background='url('+u+') center/cover'; el.classList.add('v3th'); } }); if(!THUMB_Q.busy) thumbNext(); };
