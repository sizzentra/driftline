// =====================================================================
// Stonebrook River rework (director, round 6: "rework the environment and the water; remove the grass behind each pillar;
// maybe a dam and/or a village in the background; the boat should be closer to or tied to the dock; the waterwheel could
// use a rework"). Shared scene art for every platform (the river scene itself is in f2_areas.js):
//  - a small village with a church on the far hill above the bridge, its windows lit after dusk, chimney smoke by day
//  - the arches show the river running on upstream (f2_areas.js) instead of a wall of green
//  - a little mill jetty on the far bank with the rowboat tied to it by a rope
//  - a proper overshot waterwheel: two rims, buckets, a hub, an axle into the mill wall and a wooden flume pouring water on it
//  - the river reads as moving water: a deeper channel in the middle, lighter shallows along the far bank
// =====================================================================
const RV_HOUSES=[[.478,.0,1],[.503,.012,0],[.53,.022,1],[.558,.03,0],[.634,.026,1],[.66,.016,0],[.687,.008,1],[.712,0,0]];
const RV_CHURCH=.596; const RV_CHURCH_DY=.036;
// sizes of the river buildings follow the screen height, capped on tall phone screens so the bridge and mill keep their shape
function rvH(){ return Math.min(H,W*.8); }
function rvBaseY(hz,dy){ return hz-rvH()*(.125+dy); }
function riverVillage(x,P,hz){ // the hill the village climbs: a rise behind the bridge so every house stands on ground
  x.fillStyle=mix(mix(P.far,P.farHaze,.25),P.hill,.25); x.beginPath(); x.moveTo(W*.4,hz); x.bezierCurveTo(W*.47,hz-rvH()*.13,W*.52,hz-rvH()*.19,W*.6,hz-rvH()*.19); x.bezierCurveTo(W*.68,hz-rvH()*.19,W*.72,hz-rvH()*.13,W*.8,hz); x.closePath(); x.fill();
  const haze=.42, nt=P.night||0, wall=mix(mix(mix('#e8dcc4',P.stone,.4),P.farHaze,haze),P.far,nt*.7), wallD=mix(wall,'#000000',.18), roof=mix(P.roof,P.farHaze,haze-.08), hh=rvH()*.017, hw=rvH()*.024;
  for(const [fx,dy,big] of RV_HOUSES){ const bx=W*fx, by=rvBaseY(hz,dy), w=hw*(big?1.15:.9), h=hh*(big?1.05:.9);
    x.fillStyle=wall; x.fillRect(bx-w/2,by-h,w,h+rvH()*.006); x.fillStyle=wallD; x.fillRect(bx+w*.18,by-h,w*.32,h+rvH()*.006);
    x.fillStyle=roof; x.beginPath(); x.moveTo(bx-w*.62,by-h+.5); x.lineTo(bx-w*.1,by-h-h*.85); x.lineTo(bx+w*.62,by-h-h*.55); x.lineTo(bx+w*.62,by-h+.5); x.closePath(); x.fill();
    x.fillStyle=mix(roof,'#000000',.25); x.fillRect(bx+w*.25,by-h-h*.95,w*.12,h*.5); // chimney
    x.fillStyle=mix(wallD,'#000000',.35); x.fillRect(bx-w*.3,by-h*.62,w*.14,h*.26); if(big) x.fillRect(bx+w*.05,by-h*.62,w*.14,h*.26); }
  // the church: nave, bell tower and spire
  { const cx=W*RV_CHURCH, by=rvBaseY(hz,RV_CHURCH_DY), nw=hw*1.5, nh=hh*1.05, tw=hw*.5, th=hh*2.1;
    x.fillStyle=wall; x.fillRect(cx-nw*.15,by-nh,nw,nh+rvH()*.006); x.fillStyle=roof; x.beginPath(); x.moveTo(cx-nw*.2,by-nh+.5); x.lineTo(cx+nw*.35,by-nh-nh*.7); x.lineTo(cx+nw*.9,by-nh+.5); x.closePath(); x.fill();
    x.fillStyle=mix(wall,'#ffffff',.05); x.fillRect(cx-tw/2-nw*.18,by-th,tw,th+rvH()*.006); x.fillStyle=wallD; x.fillRect(cx-nw*.18,by-th,tw*.5,th+rvH()*.006);
    x.fillStyle=roof; x.beginPath(); x.moveTo(cx-tw*.62-nw*.18,by-th+.5); x.lineTo(cx-nw*.18,by-th-th*.75); x.lineTo(cx+tw*.62-nw*.18,by-th+.5); x.closePath(); x.fill();
    x.fillStyle=mix(wallD,'#000000',.4); x.beginPath(); x.arc(cx-nw*.18,by-th*.72,tw*.17,0,7); x.fill(); }
  // a few small trees between the houses so the village sits in the hill
  const r=v3rng(611); for(let i=0;i<7;i++){ const tx=W*(.47+r()*.25), ty=rvBaseY(hz,.004+r()*.02)+rvH()*.004; x.fillStyle=mix(P.back,P.farHaze,.5); x.beginPath(); x.arc(tx,ty-rvH()*.006,rvH()*(.006+r()*.004),0,7); x.fill(); } }
m33wrap('river','live',function(P,t,hz){ const night=P.night, d=P.d, lit=clamp(night*1.2+d*.7,0,1), hh=rvH()*.017, hw=rvH()*.024;
  if(lit>.05){ g.fillStyle=v3rgba('#ffcf7a',.25+lit*.7); for(const [fx,dy,big] of RV_HOUSES){ const bx=W*fx, by=rvBaseY(hz,dy), w=hw*(big?1.15:.9), h=hh*(big?1.05:.9), on=(Math.sin(fx*91)+1)/2<.75+lit*.25;
      if(!on) continue; g.fillRect(bx-w*.3,by-h*.62,w*.14,h*.26); if(big) g.fillRect(bx+w*.05,by-h*.62,w*.14,h*.26); }
    const cx=W*RV_CHURCH, by=rvBaseY(hz,RV_CHURCH_DY); v3glow(g,cx-hw*1.5*.18,by-hh*2.1*.72,hw*.9,'rgba(255,210,130,.9)',lit*.35); }
  // chimney smoke drifting downstream (left) by day and dusk
  if(S.settings.effects&&night<.7){ for(const [fx,dy,big] of RV_HOUSES){ if(!big) continue; const w=hw*1.15, h=hh*1.05, sx=W*fx+w*.31, sy=rvBaseY(hz,dy)-h-h*.95;
      for(let k=0;k<4;k++){ const q=((t*.12+k/4+fx*7)%1); g.fillStyle=v3rgba(mix('#e8e8ee',P.farHaze,.3),.28*(1-q)*(1-night)); g.beginPath(); g.arc(sx-q*rvH()*.03,sy-q*rvH()*.035,rvH()*(.003+q*.006),0,7); g.fill(); } } }
});
// the river itself: a deeper channel in the middle and lighter shallows along the far bank (static, drawn once with the land)
function riverWater(x,P,hz){ const deep=x.createLinearGradient(0,hz+H*.05,0,hz+H*.42); deep.addColorStop(0,v3rgba(P.wBot,0)); deep.addColorStop(.45,v3rgba(P.wBot,.16)); deep.addColorStop(1,v3rgba(P.wBot,0)); x.fillStyle=deep; x.fillRect(0,hz+H*.05,W,H*.37);
  const sh=x.createLinearGradient(0,hz,0,hz+H*.03); sh.addColorStop(0,v3rgba(mix(P.wTop,'#ffffff',.35),.32)); sh.addColorStop(1,v3rgba(P.wTop,0)); x.fillStyle=sh; x.fillRect(0,hz+1,W,H*.03); }
// the mill jetty on the far bank with the rowboat tied to it
function riverJetty(x,P,hz){ riverWater(x,P,hz);
  const jx=W*.79, bw=W*.018, fw=W*.026, len=rvH()*.034, top=hz-1, front=hz+len, wood=P.wood, woodD=mix(wood,'#000000',.35), woodL=mix(wood,P.rim,.25);
  // posts into the water with their reflections
  for(const px of [jx-fw/2+2,jx+fw/2-2]){ x.fillStyle=woodD; x.fillRect(px-1.5,front-1,3,rvH()*.014); x.fillStyle=v3rgba(woodD,.3); x.fillRect(px-1.5,front+rvH()*.013,3,rvH()*.012); }
  for(const px of [jx-bw/2+2,jx+bw/2-2]){ x.fillStyle=woodD; x.fillRect(px-1.2,top+len*.45,2.4,rvH()*.01); }
  // the deck, narrower at the far end (it points toward you)
  x.fillStyle=wood; x.beginPath(); x.moveTo(jx-bw/2,top); x.lineTo(jx+bw/2,top); x.lineTo(jx+fw/2,front); x.lineTo(jx-fw/2,front); x.closePath(); x.fill();
  x.strokeStyle=v3rgba(woodD,.8); x.lineWidth=.8; x.beginPath(); for(let k=1;k<7;k++){ const u=k/7, y=top+len*u*u*.4+len*u*.6, hw=(bw+(fw-bw)*u)/2; x.moveTo(jx-hw,y); x.lineTo(jx+hw,y); } x.stroke();
  x.fillStyle=woodD; x.fillRect(jx-fw/2,front,fw,rvH()*.004); x.fillStyle=v3rgba(woodL,.6); x.fillRect(jx-fw/2,front-1,fw,1);
  // the rowboat, side-on, nose tied to the jetty's front post
  const s=rvH()*.0038, bx=jx-fw/2-s*11.5, by=hz+len*.86, hc=mix(P.wood,P.wMid,.15);
  x.save(); x.globalAlpha=.22; x.fillStyle=hc; x.beginPath(); x.ellipse(bx,by+s*3,s*10,s*1.4,0,0,7); x.fill(); x.restore();
  x.fillStyle=hc; x.beginPath(); x.moveTo(bx-s*10,by-s*1.6); x.lineTo(bx+s*10,by-s*1.6); x.quadraticCurveTo(bx+s*8,by+s*1.6,bx+s*5,by+s*1.8); x.lineTo(bx-s*6,by+s*1.8); x.quadraticCurveTo(bx-s*9,by+s*1.4,bx-s*10,by-s*1.6); x.fill();
  x.fillStyle=mix(hc,'#000000',.3); x.fillRect(bx-s*8,by-s*1.6,s*16,s*.6); x.fillStyle=v3rgba(P.rim,.3); x.fillRect(bx-s*9,by-s*1.9,s*18,s*.4);
  x.strokeStyle=mix(P.wood,'#000000',.2); x.lineWidth=1.3; x.beginPath(); x.moveTo(bx-s*3,by-s*1.4); x.lineTo(bx+s*4,by-s*5); x.stroke(); // oar
  x.strokeStyle=mix('#d8c49a',P.wMid,.25+P.night*.4); x.lineWidth=1; x.beginPath(); x.moveTo(bx+s*9.6,by-s*1.6); x.quadraticCurveTo(bx+s*11.5,by+s*.6,jx-fw/2+2,front-rvH()*.004); x.stroke(); } // the rope
// the waterwheel: overshot, fed by a wooden flume, turning clockwise; the part under the water is hidden
function riverWheel(P,t,hz,mx,mb,mw,mh,FX){ const R=mh*.62, xL=mx-mw/2, cx=xL-R*.5, cy=mb-R*.42, a=t*.75, wood=P.wood, woodD=mix(wood,'#000000',.38), woodL=mix(wood,P.rim,.22), iron=mix('#3a3a40',P.front,.3+P.night*.4);
  // the axle running into the mill wall
  g.fillStyle=woodD; g.fillRect(cx,cy-R*.06,xL-cx+R*.2,R*.12);
  g.save(); g.beginPath(); g.rect(cx-R*1.4,cy-R*1.6,R*2.9,(hz+1)-(cy-R*1.6)); g.clip();
  const rim=(ox,oy,col,lw)=>{ g.strokeStyle=col; g.lineWidth=lw; g.beginPath(); g.arc(cx+ox,cy+oy,R,0,7); g.stroke(); g.beginPath(); g.arc(cx+ox,cy+oy,R*.78,0,7); g.stroke(); };
  rim(R*.1,-R*.05,woodD,Math.max(1.2,R*.07));
  // buckets between the rims
  for(let i=0;i<12;i++){ const aa=a+i*Math.PI/6; g.save(); g.translate(cx+Math.cos(aa)*R*.89,cy+Math.sin(aa)*R*.89); g.rotate(aa); g.fillStyle=woodD; g.fillRect(-R*.11,-R*.05,R*.22,R*.13); g.fillStyle=woodL; g.fillRect(-R*.11,-R*.05,R*.22,R*.03); g.restore(); }
  rim(0,0,wood,Math.max(1.4,R*.08));
  // spokes and hub
  g.strokeStyle=wood; g.lineWidth=Math.max(1.1,R*.06); g.beginPath(); for(let i=0;i<6;i++){ const aa=a+i*Math.PI/3; g.moveTo(cx+Math.cos(aa)*R*.12,cy+Math.sin(aa)*R*.12); g.lineTo(cx+Math.cos(aa)*R*.78,cy+Math.sin(aa)*R*.78); } g.stroke();
  g.fillStyle=woodD; g.beginPath(); g.arc(cx,cy,R*.18,0,7); g.fill(); g.fillStyle=iron; g.beginPath(); g.arc(cx,cy,R*.09,0,7); g.fill();
  g.restore();
  // the flume on its trestle, coming in from upstream (the right, past the mill) over the top of the wheel
  const fy=cy-R*1.18, fx0=cx-R*.05, fx1=xL+mw*.1;
  g.fillStyle=woodD; g.fillRect(fx0+R*.15,fy,R*.08,cy-R*.95-fy); g.fillStyle=wood; g.fillRect(fx0,fy-R*.12,fx1-fx0,R*.14); g.fillStyle=woodL; g.fillRect(fx0,fy-R*.12,fx1-fx0,R*.035);
  g.fillStyle=v3rgba(mix(P.wTop,'#ffffff',.5),.8); g.fillRect(fx0+1,fy-R*.1,fx1-fx0-2,R*.03);
  // water pouring off the flume onto the buckets, then churning white where the wheel meets the river
  const wc=mix(P.wTop,'#ffffff',.6); g.fillStyle=v3rgba(wc,.55); g.beginPath(); g.moveTo(fx0,fy-R*.08); g.quadraticCurveTo(fx0-R*.12,fy+R*.05,fx0-R*.05,cy-R*.86); g.lineTo(fx0+R*.07,cy-R*.86); g.quadraticCurveTo(fx0+R*.02,fy+R*.05,fx0+R*.05,fy-R*.06); g.closePath(); g.fill();
  if(FX){ for(let i=0;i<6;i++){ const k=((t*1.6+i/6)%1); g.fillStyle=v3rgba(wc,.7*(1-k)); g.fillRect(fx0-R*.06+((i*7)%3)*R*.05,fy+k*(cy-R*.86-fy),1.3,2.4); }
    for(let i=0;i<9;i++){ const u=i/8, al=.3+.3*Math.sin(t*4.5+i*2.1); g.fillStyle=v3rgba(wc,al); g.beginPath(); g.ellipse(cx-R*.95+u*R*1.9,hz+1.5+Math.sin(u*Math.PI)*R*.07,R*.14,R*.05,0,0,7); g.fill(); }
    for(let i=0;i<4;i++){ const k=((t*.9+i/4)%1); g.strokeStyle=v3rgba(wc,.35*(1-k)); g.lineWidth=1; g.beginPath(); g.ellipse(cx-R*.2-k*R*1.4,hz+3+k*R*.12,R*(.25+k*.4),R*(.05+k*.06),0,0,7); g.stroke(); } } }
