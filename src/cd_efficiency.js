// =====================================================================
// Shared efficiency fixes, every platform (director, 2026-11-19: "Why would we want to just fix this for phones, if it doesn't
// effect quality negatively?"). Each fix here draws the same picture with less work, so PC, Android and iPhone all get it.
// They started in src/mobile/polish08.js (phones only) and moved here. Phone-only trade-offs (things that do change the picture a
// little, like fewer light steps) stay in the phone files.
// =====================================================================
/* Platform values (glow dot size, how often moving decorations refresh) come from PLAT (a3_plat.js); phones set their own. */

/* 1) Wrong scenery after opening a menu (director, 2026-11-18: "clicking settings and exiting brought up the wrong map for a bit"):
   a Map thumbnail for another water reused the live scenery canvases (and the Willow Pond slices), so the real water could show the
   other water's scenery until the light changed. A thumbnail now always gets fresh canvases; the live ones are never painted over.
   Thumbnails are only made while the Map page is open (the only place they show): Settings and other menus no longer pay for them. */
{ const _vt=v3Thumb; v3Thumb=function(id){ if(V3THUMB[id]) return _vt(id); const c=V3CACHE, p=V3PREV; V3CACHE=null; V3PREV=null; const wl={c:V3WIL.c,t:V3WIL.t,k:V3WIL.k,turn:V3WIL.turn}; V3WIL.c=[]; V3WIL.t=[-9,-9,-9]; V3WIL.k="";
    try{ return _vt(id); } finally{ V3CACHE=c; V3PREV=p; V3WIL.c=wl.c; V3WIL.t=wl.t; V3WIL.k=wl.k; V3WIL.turn=wl.turn; try{ v3palette.k=null; }catch(e){ oops('cd_efficiency:v3palette.k',e); } } }; }
{ const _tn=thumbNext; thumbNext=function(){ if(S.tab!=='map'){ setTimeout(thumbNext,1500); return; } return _tn.apply(this,arguments); }; }

/* 2) Glows: v3glow (108 uses: lanterns, lamps, Starfall's star whale, blossoms, sun and moon) built a new radial gradient on every
   call, over 30 a frame at Starfall. Now a ready-made soft dot per color (same centre color, same fade to nothing) is stamped at the
   same size and strength (256 px on PC for big screens, 128 px on phones). */
{ const _gl=v3glow, GS=new Map();
  const parse=col=>{ col=String(col).trim(); let m=/^rgba?\(([^)]+)\)$/i.exec(col); if(m){ const p=m[1].split(',').map(s=>s.trim()); if(p.length<3) return null; const a=p[3]!==undefined?parseFloat(p[3]):1; return isFinite(a)?{rgb:p[0]+','+p[1]+','+p[2],a}:null; }
    m=/^#([0-9a-f]{6})$/i.exec(col); if(m){ const v=parseInt(m[1],16); return {rgb:((v>>16)&255)+','+((v>>8)&255)+','+(v&255),a:1}; } return null; };
  v3glow=function(c,x,y,r,col,a){ if(!(r>0)) return _gl.apply(this,arguments); const p=parse(col); if(!p) return _gl.apply(this,arguments);
    const S2=PLAT.glowPx(), H=S2/2, key=p.rgb+'|'+S2;
    let s=GS.get(key); if(!s){ s=document.createElement('canvas'); s.width=s.height=S2; const sx=s.getContext('2d'), gr=sx.createRadialGradient(H,H,0,H,H,H); gr.addColorStop(0,'rgba('+p.rgb+',1)'); gr.addColorStop(1,'rgba(0,0,0,0)'); sx.fillStyle=gr; sx.fillRect(0,0,S2,S2); if(GS.size>96) GS.clear(); GS.set(key,s); }
    const ga=a*p.a; if(!(ga>0)) return; c.save(); c.globalAlpha=Math.min(1,ga); c.drawImage(s,x-r,y-r,r*2,r*2); c.restore(); }; }

/* 3) Starfall's sky events: sfEvent counted every event from the start of the session on every call (twice a frame), a little more
   work the longer you play. It now resumes from where the last call got to (same events, same timing). */
{ const _sf=sfEvent; let cs=0, cn=0;
  sfEvent=function(t){ if(!(t>=cs)){ cs=0; cn=0; } let start=cs, n=cn; while(true){ const gap=18+((Math.sin(n*91.7)*43758.5)%1+1)%1*22; if(start+gap>t) break; start+=gap; n++; } cs=start; cn=n;
    const kind=Math.floor((((Math.sin(n*37.3)*12345.6)%1+1)%1)*5); return {kind,into:t-start,n}; }; }

/* 4) Tinted pets: a canvas color filter makes every brush stroke of the pet go through the filter separately. The pet is now drawn
   once without the tint into a picture at screen resolution, then put on the water through the filter in one step. */
{ const _dp=drawPetStyled; let PC=null;
  drawPetStyled=function(c,id,x,y,s,t,night,lkOver){ if(c!==g||id==='daxniko') return _dp.apply(this,arguments); /* Dax & Niko tint each dog on its own (never the hearts or z's): left as before */ let lk, f='none'; try{ lk=lkOver||petLook(id); f=tintFilter(lk,t); }catch(e){ return _dp.apply(this,arguments); }
    if(!f||f==='none') return _dp.apply(this,arguments);
    const m=c.getTransform(), k=Math.hypot(m.a,m.b); if(m.b||m.c||!(m.a>0)||!(m.d>0)||!(s>0)) return _dp.apply(this,arguments); /* mirrored (facing left) or rotated: as before */
    const bw=170*s, bh=150*s, bx=-bw/2, by=-bh*.82, pw=Math.ceil(bw*k), ph=Math.ceil(bh*k); if(pw*ph>4e6) return _dp.apply(this,arguments);
    if(!PC) PC=document.createElement('canvas'); if(PC.width<pw||PC.height<ph){ PC.width=Math.max(PC.width,pw); PC.height=Math.max(PC.height,ph); }
    const px=PC.getContext('2d'); px.setTransform(1,0,0,1,0,0); px.clearRect(0,0,PC.width,PC.height); px.setTransform(k,0,0,k,-(x+bx)*k,-(y+by)*k);
    const r=_dp(px,id,x,y,s,t,night,Object.assign({},lk,{tint:undefined}));
    c.save(); c.setTransform(1,0,0,1,0,0); c.filter=f; c.drawImage(PC,0,0,pw,ph,m.a*(x+bx)+m.e,m.d*(y+by)+m.f,pw,ph); c.restore(); return r; }; }

/* 5) The top bar (hud): it ran every frame (up to 120 times a second), reading the clock, weather, coins and badges and building a
   comparison key each time, though what it shows changes at most once a second. It now runs at most 10 times a second, and at
   once whenever something asks for a refresh (lastHud cleared) or the fishing state changes (hints follow the line right away). */
{ const _hd=hud; let at=0, st=''; hud=function(){ const now=performance.now(); if(lastHud!==''&&G.st===st&&now-at<100) return; at=now; st=G.st; return _hd.apply(this,arguments); }; }
