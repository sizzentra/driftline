// =====================================================================
// Phones, round 7 performance (director, 2026-11-18, Pixel 10: "storms can still majorly drop frames on Android, even more so on
// open seas; the first three waters hold about 50 fps, the others drop to 20-30 when you switch to them, storms to 20 or below").
// On a phone the cost that grows with weather and water is painting: every full-screen layer is millions of pixels on a dense
// screen. This file trims the layers drawn over the whole screen each frame:
//  - the two vignettes (the soft dark frame) and the storm / rain darkening are pre-drawn into ONE small cached picture and
//    drawn once, instead of up to four full-screen layers in a storm (two in clear weather)
// Android + iPhone only. (The open-sea storm chop and the willow are fixed in the shared code, for every platform.)
// =====================================================================
{ let OV=null;
  const q=(v,n)=>Math.round(v*n)/n;
  const build=(night,k,a)=>{ const key=W+'x'+H+'|'+q(night,10)+'|'+k+'|'+q(a,10); if(OV&&OV.key===key) return OV.c;
    const c=(OV&&OV.c)||document.createElement('canvas'), s=Math.min(1,600/Math.max(W,H)), w=Math.max(8,Math.round(W*s)), h=Math.max(8,Math.round(H*s)); if(c.width!==w||c.height!==h){ c.width=w; c.height=h; }
    const x=c.getContext('2d'); x.setTransform(1,0,0,1,0,0); x.clearRect(0,0,w,h);
    try{ x.drawImage(finVignette(),0,0,w,h); }catch(e){}
    // the scene's own vignette (d7_v20 drawVignette), in the small picture's scale
    const sc=w/W; { const gr=x.createRadialGradient(w/2,h*.55,Math.min(W,H)*.35*sc,w/2,h*.55,Math.max(W,H)*.75*sc); gr.addColorStop(0,'rgba(0,0,0,0)'); gr.addColorStop(1,'rgba(4,10,16,'+(.22+night*.2)+')'); x.fillStyle=gr; x.fillRect(0,0,w,h); }
    // the weather's darkening (as_depth033), faded in with the weather
    if(a>.01&&k==='Storm'){ x.globalAlpha=a; x.fillStyle='rgba(8,12,20,.2)'; x.fillRect(0,0,w,h); const vg=x.createRadialGradient(w/2,h*.5,H*.3*sc,w/2,h*.5,W*.8*sc); vg.addColorStop(0,'rgba(0,0,0,0)'); vg.addColorStop(1,'rgba(0,0,6,.35)'); x.fillStyle=vg; x.fillRect(0,0,w,h); x.globalAlpha=1; }
    if(a>.01&&k==='Rain'){ x.globalAlpha=a; x.fillStyle='rgba(30,40,54,.12)'; x.fillRect(0,0,w,h); x.globalAlpha=1; }
    OV={key,c}; return c; };
  // the cached vignette in v3Fore is skipped on phones (it is part of the combined picture)
  { const _dr=draw; draw=function(){ window.__noVig=MOB(); return _dr.apply(this,arguments); }; }
  // the storm / rain full-screen darkening inside the weather layer is skipped on phones (also part of the combined picture)
  { const _wx=drawWeatherX0; drawWeatherX0=function(t,wx,hz){ if(!MOB()||(wx.k!=='Storm'&&wx.k!=='Rain')) return _wx.apply(this,arguments);
      const fr=g.fillRect; g.fillRect=function(x,y,w,h){ if(x<=0&&y<=0&&w>=W-1&&h>=H-1) return; return fr.apply(this,arguments); };
      try{ return _wx.apply(this,arguments); } finally{ g.fillRect=fr; delete g.fillRect; } }; }
  { const _dv=drawVignette; drawVignette=function(night){ if(!MOB()) return _dv.apply(this,arguments);
      const wx=weather(), on=S.settings.effects&&typeof WXA==='number'&&WXA>.01, k=on?wx.k:'', a=on?WXA:0;
      const c=build(night||0,k,a); g.save(); g.imageSmoothingEnabled=true; g.drawImage(c,0,0,W,H); g.restore(); }; }
  if(/[?&]test\b/.test(location.search)) window.__ov=()=>OV&&{key:OV.key,w:OV.c.width,h:OV.c.height}; }
// ---------- the scenery's light (round 7f, director: "make sure performance is completely fixed and solid on both phones"). The still
// scenery is redrawn whenever the light moves up a step; at Willow Pond that redraw is about 6.5 ms of work (Frostbite, Ember and the
// river less), so on a phone it can cost a frame. Measured over a whole in-game day: 55 redraws at Willow Pond. On phones now:
//  - fewer, slightly bigger light steps (55 -> 37 a day at Willow Pond), each fading in a little longer, so the change stays invisible
//  - never while you charge a cast or have a fish on the line: a light step waits until you are between catches ----------
{ const _vs=v3steps, _vf=v3fade; v3steps=function(){ return MOB()?[9,6,4]:_vs.apply(this,arguments); }; v3fade=function(){ return MOB()?4.2:_vf.apply(this,arguments); };
  const BUSY=/^(charging|flying|bite|reeling|landing)$/;
  const _vl=v3land; v3land=function(L,P,hz){ if(MOB()&&V3CACHE&&!v3land.now&&typeof G==='object'&&BUSY.test(G.st)){ const base=L.id+'|'+W+'|'+H+'|'+DPR; if(V3CACHE.base===base&&V3CACHE.key!==base+'|'+P.key) return V3CACHE; } return _vl.apply(this,arguments); }; }
