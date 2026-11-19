// =====================================================================
// 0.4.9 the aquarium shows real sizes (director, 2026-11-19: "Fish in the aquarium also don't feel like their size even affects how they
// display. Definitely doesn't feel dynamic and real"). Shared by every platform.
//  - Length follows the cube root of weight, as real fish do (8× the weight = 2× the length): 1 kg is about 11% of the tank's height,
//    a 0.05 kg minnow a tiny dart, a 100 kg giant fills a good part of the glass. Big fish are softly capped so they always fit.
//    (Before: a log scale made a 100 kg fish only about twice a 0.1 kg one, and a fish's own weight changed it by at most 25%.)
//  - Depth: every fish swims at its own distance from the glass; far ones are smaller, a little hazier and drawn behind near ones.
//  - Big fish move and beat their tails slower, small fish faster.
// =====================================================================
function tankLen(f,h,w){ const kg=Math.max(.005,+f.kg||.1), cap=Math.min(h*.46,w*.34), raw=h*.115*Math.cbrt(kg); return Math.max(9,cap*Math.tanh(raw/cap)); }
function tankDepth(f,i){ const s=hashStr((f.id||'')+'|'+(f.kg||0)+'|'+i); return (s%1000)/1000; }
const tankPace = f => clamp(1.3-.22*Math.log10(1+Math.max(0,+f.kg||0)*4),.5,1.3);
// the draw order (far fish first), depth and pace only change when the tank's fish change, so they are worked out once, not every frame
let tankOrd=null, tankOrdOf=[];
function tankOrder(){ const T=S.tank; let ok=tankOrd&&tankOrdOf.length===T.length; for(let i=0;ok&&i<T.length;i++) ok=tankOrdOf[i]===T[i];
  if(!ok){ tankOrdOf=T.slice(); tankOrd=T.map((f,i)=>({f,i,sp:SPI[f.id],z:tankDepth(f,i),pace:tankPace(f)})).filter(o=>o.sp).sort((a,b)=>b.z-a.z); }
  return tankOrd; }
function drawTank(now){ const cnv=$('tankcv'); if(!cnv) return; const r=cnv.getBoundingClientRect(); const w=r.width, h=r.height; if(!w||h<20) return;
  if(cnv.width!==Math.round(w*DPR)||cnv.height!==Math.round(h*DPR)){ cnv.width=Math.round(w*DPR); cnv.height=Math.round(h*DPR); }
  const c=cnv.getContext('2d'); c.setTransform(DPR,0,0,DPR,0,0); const t=now/1000;
  drawTankBack(c,w,h,t);
  for(const o of tankOrder()){ const {f,i,sp,z,pace}=o, k=1-.3*z, L=tankLen(f,h,w)*k, tk=t*pace;
    const M=tankMove(f,sp,i,tk,w,h,L); nibMove(f,M,t,w,h); const y=M.y+(z-.5)*h*.06; /* farther fish sit a touch higher, like looking into the tank */
    c.save(); if(z>.35) c.globalAlpha=1-(z-.35)*.45;
    drawCreature(c,sp,M.x,y,L,{shiny:f.sh||0,pv:f.pv,seedAdd:i,wag:tk*M.wag+i,flip:!M.dir}); c.restore(); }
  c.fillStyle='rgba(220,245,255,.35)'; for(let i=0;i<12;i++){ const x=(i*73)%w+Math.sin(t+i)*4, y=h-((t*30+i*40)%h); c.beginPath(); c.arc(x,y,1.5+(i%3),0,7); c.fill(); }
  nibDraw(c,t,w,h); drawTankFront(c,w,h,t);
};
