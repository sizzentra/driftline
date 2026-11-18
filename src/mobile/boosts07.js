// =====================================================================
// Phones, round 7: your active boosts are never hidden behind the buttons (director, 2026-11-18, screenshots: "the bottom left
// headers cover the background UI behind it"). The boost timers ("+25% Bite speed  0:26", Settings > Boosts on screen) were drawn
// in the bottom-left corner of the water, exactly where the phone's Rest and Bait buttons sit, so they peeked out half covered.
// On phones they now stack in the top-left corner, right under the time and weather chip (a status corner: weather, then boosts),
// same look as before. The weather note (weather07.js) appears under them. Android + iPhone only.
// =====================================================================
var MB_STATUS_B=40; /* the bottom of the top-left status corner (scene chip + boosts), read by weather07.js */
{ let chipB=32, labB=0, labT=0;
  // the scene chip's real height (it differs upright / sideways / per weather): read from the box it draws
  const _sc=drawSceneChip; drawSceneChip=function(){ if(!MOB()) return _sc.apply(this,arguments); const r0=rr; let b=0;
    rr=function(x,y,w,h){ if(y+h>b) b=y+h; return r0.apply(this,arguments); }; try{ return _sc.apply(this,arguments); } finally{ rr=r0; if(b>0) chipB=b; } };
  // test builds only: the test label sits under the chip when sideways; start below it (checked once a second, no layout reads per frame)
  const label=()=>{ const n=performance.now(); if(n-labT<1000) return labB; labT=n; labB=0; const d=document.querySelector('.dlprev'), cv=document.getElementById('cv');
    if(d&&cv&&document.body.classList.contains('phone-land')){ const a=d.getBoundingClientRect(), c=cv.getBoundingClientRect(); if(a.width&&a.top-c.top<120&&a.left-c.left<200) labB=Math.round(a.bottom-c.top); } return labB; };
  const _dr=draw; draw=function(){ if(!MOB()) return _dr.apply(this,arguments);
    const st=S.settings, on=st.boostsOnScreen; st.boostsOnScreen=false; /* the shared bottom-left list is skipped... */
    try{ _dr.apply(this,arguments); } finally{ st.boostsOnScreen=on; }
    let y=Math.max(chipB,label())+6; /* ...and drawn here, under the chip */
    if(on&&typeof G==='object'&&G.st!=='reeling'&&G.st!=='frenzy'&&G.st!=='charging'){ const bs=activeBuffs().slice(0,4);
      if(bs.length){ g.save(); g.font='700 11px "Bricolage Grotesque", system-ui'; g.textAlign='left'; const now=Date.now();
        for(const b of bs){ const txt=fmtB(b.k,b.v)+'  '+mmss(Math.max(0,Math.ceil((b.until-now)/1000))); const tw=g.measureText(txt).width;
          g.fillStyle='rgba(5,14,20,.62)'; rr(10,y,tw+18,20,10); g.fill(); g.fillStyle='#7fc8a9'; g.fillText(txt,19,y+14); y+=24; }
        g.restore(); y-=4; } }
    MB_STATUS_B=y; }; }
