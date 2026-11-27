// =====================================================================
// PC: continuous day, night and weather (director, 2026-11-17: the light changes must be as smooth as the frame rate). The light
// follows the clock, so the scenery for 3 s from now can be drawn ahead of time, between frames; every frame blends from the
// current picture to that one by exactly how far the clock has moved. No steps, no pops, at any frame rate. If something else is
// changing the light right now (it does not match the clock), the stepped fade is used for that moment instead. Phones unchanged.
// =====================================================================
{ const POOL=[document.createElement('canvas'),document.createElement('canvas'),document.createElement('canvas')], D=3000;
  let A=null, B=null, J=null, base='', bq=0, fallbackUntil=0, builds=0; const _ld=v3landDraw;
  const pcOn=()=>document.body.classList.contains('pch-on');
  const lightAt=ms=>{ const real=Date.now, off=ms-real(); Date.now=()=>real()+off;
    try{ const L=curLoc(), p=phase(), wx=weather(), night=nightness(p);
      const dusk=Math.max(0,1-Math.abs(p-.5)/.06)+Math.max(0,1-Math.min(Math.abs(p-1),p)/.06)*.7, wa=wxAmt();
      const gloom=(wx.k==='Storm'?.7:wx.k==='Rain'?.38:wx.k==='Fog'?.3:0)*wa+(L.id==='deep'?.1:0); return {night,dusk,gloom}; }
    finally{ Date.now=real; } };
  const buildAt=(L,ms,hz,rec)=>{ const lt=lightAt(ms), keep=[V3CACHE,V3PREV,v3palette.k,v3palette.v];
    const tgt=POOL.find(c=>(!A||c!==A.c)&&(!B||c!==B.c)&&(!J||c!==J.c));
    try{ builds++; const P=v3palette(L.id,lt.night,lt.dusk,lt.gloom); V3CACHE={c:tgt,base:'#pch',key:'#pch'}; V3PREV=null; v3land.now=true; v3land.rec=!!rec; const C=v3land(L,P,hz); return {c:C.c,ms,lt,C}; }
    finally{ v3land.now=false; v3land.rec=false; V3CACHE=keep[0]; V3PREV=keep[1]; v3palette.k=keep[2]; v3palette.v=keep[3]; } };
  v3landDraw=function(L,P,hz){ const now=Date.now(); if(!pcOn()||now<fallbackUntil){ A=B=J=null; base=''; return _ld.apply(this,arguments); }
    const b=L.id+'|'+W+'|'+H+'|'+DPR;
    if(b!==base||!A||now<A.ms-50||now>(B?B.ms:A.ms)+D*2){
      // does the clock explain the light on screen? (events and tests can set it by hand)
      const lt=lightAt(now), d=clamp(lt.dusk,0,1)*(1-lt.night*.45);
      if(Math.abs(lt.night-(P.night||0))>.03||Math.abs(d-(P.d||0))>.03||Math.abs(lt.gloom-(P.gloom||0))>.03){ fallbackUntil=now+4000; A=B=J=null; base=''; return _ld.apply(this,arguments); }
      base=b; clearTimeout(bq); bq=0; B=J=null; A=buildAt(L,now,hz); V3CACHE={key:'#pchA',base:b,c:A.c}; V3PREV=null; }
    if(B&&now>=B.ms){ A=B; B=null; V3CACHE={key:'#pchA',base:b,c:A.c}; }
    // 2026-11-18 (director: "stutter at Willow Pond constantly every couple seconds, also Frostbite Lake"): drawing the landscape
    // ahead costs 6-19 ms (Willow Pond the most) and used to happen every 3 s even when the light stayed the same. Now it is drawn
    // only when the light 3 s from now really differs (dawn, dusk, weather changing); otherwise the picture just carries on.
    if(J&&v3play(J.C,now>J.ms-1000?12:4)){ B={c:J.c,ms:J.ms,lt:J.lt}; J=null; } /* 8b: the next picture is painted a few ms per frame (it was one 300 ms frame on the director's PC) */
    if(!B&&!J&&!bq&&now>=(A.chk||0)){ A.chk=now+500; const ms=Math.max(A.ms,now)+D, lt2=lightAt(ms), lt1=A.lt;
      if(lt1&&Math.abs(lt2.night-lt1.night)<.004&&Math.abs(lt2.dusk-lt1.dusk)<.004&&Math.abs(lt2.gloom-lt1.gloom)<.004){ A.ms=now; }
      else bq=setTimeout(()=>{ bq=0; try{ const L2=curLoc(); if(base!==L2.id+'|'+W+'|'+H+'|'+DPR||!A) return; const r=buildAt(L2,ms,HZ(),1); J={c:r.c,ms,lt:r.lt,C:r.C}; }catch(e){ oops('pc/scene_light:curLoc',e); } },0); }
    g.drawImage(A.c,0,0,W,H);
    if(B){ const a=clamp((now-A.ms)/(B.ms-A.ms),0,1); if(a>0){ g.globalAlpha=a; g.drawImage(B.c,0,0,W,H); g.globalAlpha=1; } } };
  if(/[?&]test\b/.test(location.search)) window.__pclight=()=>({on:pcOn()&&Date.now()>=fallbackUntil, A:A&&A.ms, B:B&&B.ms, fallback:Date.now()<fallbackUntil, builds}); }
document.head.insertAdjacentHTML('beforeend',`<style>
/* PC: the count badges on the category tabs sit on the tab's top edge, fully inside the screen (they were cut off by 4 px);
   the menu's category badges move the same way so both header rows still match */
html body.pch-on #pchead #catdock .cddot{top:-3px!important}
body.pch-on #menuov #tabs.secmode .secdot{top:-3px!important}
/* (the phones-upright goal rule moved to src/mobile/perf_round6.js, where phone rules belong) */
</style>`);
