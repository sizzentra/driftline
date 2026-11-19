// =====================================================================
// 0.3.1 decorations: not every aquarium piece is about income any more. Each one has a kind:
//   income   : +% aquarium income (as before)
//   boost    : +% strength of every buff your aquarium fish give
//   showpiece: +% income from shiny and hybrid fish in the tank
// Some older pieces moved to the new kinds (at a matching value), and new pieces join both the
// aquarium and the dock. Saves keep what you own and where it stands; only what a piece does changed.
// =====================================================================
const DECOR_KIND={ kelp:'boost', coral:'boost', bonsai:'boost', starfish:'boost', jellylamp:'boost', crystal:'boost', lantern:'boost', bigclam:'boost', gardenbench:'boost',
  treasurepile:'show', neon:'show', disco:'show', carousel:'show', tvfish:'show', chest:'show', ufo:'show' };
// how much each kind gives for the same price (income is the yardstick)
const DECOR_K={ income:1, boost:1.25, show:3 };
const DECOR_KIND_NAME={ income:'aquarium income', boost:'fish buffs', show:'shiny & hybrid income' };
const DECOR_KIND_SHORT={ income:'Income', boost:'Fish buffs', show:'Showpiece' };

// new aquarium pieces
[['reefarch','Coral Arch',9000,.05,'boost'],['sunkenbell','Sunken Bell',7500,.04,'income'],['glowshrooms','Glow Mushrooms',6000,.04,'show'],['bottlemap','Message in a Bottle',4500,.03,'boost'],['lighthouse','Tiny Lighthouse',16000,.06,'income']]
  .forEach(a=>{ if(DECORI[a[0]]) return; const d={id:a[0],name:a[1],price:a[2],b:+(a[3]*2).toFixed(3)}; DECOR.push(d); DECORI[d.id]=d; DECOR_KIND[a[0]]=a[4]; });
const decorKind = id => DECOR_KIND[id]||'income';
const decorVal = d => d.b*DECOR_K[decorKind(d.id)];
function decorSumKind(kind){ let s=0; for(const id of (S.aq&&S.aq.decor)||[]){ const d=DECORI[id]; if(d&&decorKind(id)===kind) s+=decorVal(d); } return s; }
decorBonus = function(){ return decorSumKind('income'); };
const decorBoost = () => decorSumKind('boost'), decorShow = () => decorSumKind('show');
// fish buffs: every aquarium buff a little stronger (the caps on each bonus still apply)
const _aqBuffsOf_04 = aqBuffsOf;
aqBuffsOf = function(f){ const L=_aqBuffsOf_04(f), m=1+decorBoost(); if(m!==1) for(const e of L) e.v*=m; return L; };
// showpiece: shiny and hybrid fish earn more
const _aqFishBase_04 = aqFishBase;
aqFishBase = function(f){ const v=_aqFishBase_04(f); return (f&&(f.sh||f.hy)) ? v*(1+decorShow()) : v; };

Object.assign(TANK_ART,{
  reefarch(c,t){ const sh=(x0,y0,x1,y1,a,b)=>{ const g=c.createLinearGradient(x0,y0,x1,y1); g.addColorStop(0,a); g.addColorStop(1,b); return g; };
    c.fillStyle=sh(0,-80,0,0,'#ff9a8a','#c8506a'); c.beginPath(); c.moveTo(-46,0); c.bezierCurveTo(-50,-60,-30,-86,0,-86); c.bezierCurveTo(30,-86,50,-60,46,0); c.lineTo(28,0); c.bezierCurveTo(30,-50,18,-64,0,-64); c.bezierCurveTo(-18,-64,-30,-50,-28,0); c.closePath(); c.fill();
    c.fillStyle='rgba(255,220,210,.5)'; for(let i=0;i<22;i++){ const a=Math.PI*(1+i/21), r=i%2?73:78; c.beginPath(); c.arc(Math.cos(a)*r*.52,-12+Math.sin(a)*r*.95,1.6+(i%3),0,7); c.fill(); }
    for(const [x,cl] of [[-40,'#ffd23a'],[38,'#7ad8ff'],[-14,'#b88aff']]){ for(let k=0;k<5;k++){ const a=-Math.PI/2+(k-2)*.4+Math.sin(t*1.4+x)*.08; c.strokeStyle=cl; c.lineWidth=2.4; c.lineCap='round'; c.beginPath(); c.moveTo(x,-82+Math.abs(x)*.3); c.lineTo(x+Math.cos(a)*8,-82+Math.abs(x)*.3+Math.sin(a)*8); c.stroke(); } }
    c.fillStyle='rgba(255,255,255,.5)'; for(let i=0;i<3;i++){ const k=((t*.4+i/3)%1); c.beginPath(); c.arc(-4+i*5,-60-k*70,1.6+k*1.4,0,7); c.fill(); } },
  sunkenbell(c,t){ const sw=Math.sin(t*.7)*.04; c.save(); c.rotate(-.18+sw);
    const g=c.createLinearGradient(-26,0,26,0); g.addColorStop(0,'#5a4a2a'); g.addColorStop(.45,'#c89a4a'); g.addColorStop(.7,'#e8c070'); g.addColorStop(1,'#7a5a2a'); c.fillStyle=g;
    c.beginPath(); c.moveTo(-14,-60); c.quadraticCurveTo(-16,-30,-30,-6); c.lineTo(30,-6); c.quadraticCurveTo(16,-30,14,-60); c.quadraticCurveTo(0,-66,-14,-60); c.fill();
    c.fillStyle='#6a5228'; c.beginPath(); c.ellipse(0,-6,30,5,0,0,7); c.fill(); c.fillStyle='#3a2a14'; c.beginPath(); c.ellipse(0,-6,25,3.2,0,0,7); c.fill();
    c.strokeStyle='#8a6a34'; c.lineWidth=2; for(const y of [-48,-22]){ c.beginPath(); c.moveTo(-16-(y+48)*-.2,y); c.quadraticCurveTo(0,y+2,16+(y+48)*-.2,y); c.stroke(); }
    c.fillStyle='rgba(90,180,160,.45)'; for(let i=0;i<7;i++){ c.beginPath(); c.arc(-12+((i*9)%24),-54+((i*13)%44),2.4,0,7); c.fill(); } c.fillStyle='#5a4a2a'; c.fillRect(-4,-72,8,10); c.restore();
    c.fillStyle='rgba(255,255,255,.55)'; const k=(t*.35)%1; c.beginPath(); c.arc(12,-20-k*80,2+k,0,7); c.fill(); },
  glowshrooms(c,t){ const caps=[[-22,-30,13,'#5ad8ff'],[0,-46,17,'#b88aff'],[20,-24,11,'#7affc8'],[-6,-16,8,'#ff9ae0']];
    for(const [x,y,r,cl] of caps){ const p=.6+.4*Math.sin(t*1.6+x*.2); if(typeof v3glow==='function') v3glow(c,x,y,r*2.4,cl,.25+.25*p); c.fillStyle='#e8e0f0'; c.beginPath(); c.moveTo(x-r*.22,0); c.quadraticCurveTo(x-r*.3,y*.5,x-r*.18,y+r*.2); c.lineTo(x+r*.18,y+r*.2); c.quadraticCurveTo(x+r*.3,y*.5,x+r*.22,0); c.closePath(); c.fill();
      c.fillStyle=cl; c.beginPath(); c.ellipse(x,y,r,r*.62,0,Math.PI,0); c.quadraticCurveTo(x,y+r*.25,x-r,y); c.fill(); c.fillStyle='rgba(255,255,255,'+(.4+.3*p)+')'; for(let i=0;i<4;i++){ c.beginPath(); c.arc(x-r*.5+i*r*.33,y-r*.3-(i%2)*r*.15,r*.09,0,7); c.fill(); } }
    c.fillStyle='rgba(220,240,255,.8)'; for(let i=0;i<6;i++){ const k=((t*.3+i/6)%1); c.fillRect(-26+i*9+Math.sin(t+i)*3,-20-k*60,1.4,1.4); } },
  bottlemap(c,t){ c.save(); c.translate(0,-9); c.rotate(-.12+Math.sin(t*.6)*.02);
    c.fillStyle='rgba(150,220,200,.35)'; c.beginPath(); c.roundRect?c.roundRect(-30,-11,48,22,10):c.rect(-30,-11,48,22); c.fill(); c.fillRect(18,-5,12,10); c.fillStyle='#8a5a30'; c.fillRect(29,-6,6,12);
    c.fillStyle='#f0e0b0'; c.save(); c.translate(-6,0); c.rotate(.08); c.fillRect(-16,-6,32,12); c.fillStyle='#d8c08a'; c.beginPath(); c.arc(-16,0,6,Math.PI*.5,Math.PI*1.5); c.fill(); c.beginPath(); c.arc(16,0,6,-Math.PI*.5,Math.PI*.5); c.fill(); c.strokeStyle='#c8302a'; c.lineWidth=1.2; c.beginPath(); c.moveTo(-10,3); c.lineTo(-2,-2); c.lineTo(4,2); c.stroke(); c.font='bold 7px sans-serif'; c.fillStyle='#c8302a'; c.fillText('x',6,4); c.restore();
    c.strokeStyle='rgba(255,255,255,.6)'; c.lineWidth=1.6; c.beginPath(); c.moveTo(-24,-7); c.lineTo(10,-7); c.stroke(); c.restore();
    c.fillStyle='#d8c890'; c.beginPath(); c.ellipse(0,0,34,3,0,0,7); c.fill(); },
  lighthouse(c,t){ const R=(x,y,w,h,cl)=>{ c.fillStyle=cl; c.fillRect(x,y,w,h); };
    c.fillStyle='#7a7a86'; c.beginPath(); c.ellipse(0,-4,30,9,0,Math.PI,0); c.fill(); c.fillStyle='#5a5a66'; c.beginPath(); c.ellipse(-12,-2,12,5,0,Math.PI,0); c.fill();
    c.fillStyle='#f4f0ea'; c.beginPath(); c.moveTo(-12,-8); c.lineTo(-8,-90); c.lineTo(8,-90); c.lineTo(12,-8); c.closePath(); c.fill(); c.fillStyle='#d8302a'; for(const y of [-30,-62]){ c.beginPath(); c.moveTo(-11.2-(y+8)*.05,y); c.lineTo(-10.2-(y+8)*.05,y-12); c.lineTo(10.2+(y+8)*.05,y-12); c.lineTo(11.2+(y+8)*.05,y); c.closePath(); c.fill(); }
    R(-11,-96,22,6,'#3a3a44'); R(-7,-108,14,12,'rgba(255,240,180,.9)'); c.fillStyle='#d8302a'; c.beginPath(); c.moveTo(-9,-108); c.lineTo(0,-118); c.lineTo(9,-108); c.closePath(); c.fill(); R(-3,-34,6,9,'#5a4a3a');
    const a=t*.9; if(typeof v3glow==='function') v3glow(c,0,-102,26,'rgba(255,230,150,.9)',.5); c.save(); c.globalAlpha=.22; c.fillStyle='#fff4c0'; c.beginPath(); c.moveTo(0,-102); c.lineTo(Math.cos(a)*90,-102+Math.sin(a)*14-8); c.lineTo(Math.cos(a)*90,-102+Math.sin(a)*14+8); c.closePath(); c.fill(); c.restore(); },
});

// ---------- new dock pieces ----------
[['rockingchair','Rocking Chair',5200,3],['teakettle','Camp Stove & Kettle',2400,2],['mailbox','Mailbox',1300,1],['buoy','Old Buoy',1700,1],['lemontree','Potted Lemon Tree',6200,3]]
  .forEach(a=>{ if(DOCKI[a[0]]) return; const d={id:a[0],name:a[1],price:a[2],cozy:a[3],src:'shop'}; DOCK_DECOR.push(d); DOCKI[d.id]=d; });
Object.assign(DOCK_H,{rockingchair:40,teakettle:16,mailbox:30,buoy:22,lemontree:44});
Object.assign(DOCK_ART,{
  rockingchair(c,t,D){ const {R,RR,L,E}=dkHelpers(c,D), r=Math.sin(t*1.1)*.07; c.save(); c.rotate(r);
    c.strokeStyle=D('#6a4426'); c.lineWidth=2.4; c.lineCap='round'; c.beginPath(); c.moveTo(-18,-1); c.quadraticCurveTo(0,4,16,-1); c.stroke();
    L([-12,0,-11,-20],'#7a5030',2.2); L([10,1,9,-20],'#7a5030',2.2); RR(-13,-22,24,4,1.5,'#8a5a34'); L([-12,-22,-14,-42],'#7a5030',2.4); for(let i=0;i<4;i++) L([-12.4+i*.1,-26-i*4,-2,-25-i*4.2],'#8a5a34',1.4);
    RR(-12,-28,14,6,2,'#c8553a'); E(-5,-26,6,2,'#d86a4a'); L([8,-21,9,-30,1,-30],'#7a5030',1.6); c.restore(); },
  teakettle(c,t,D,night){ const {R,RR,E,L}=dkHelpers(c,D); RR(-9,-6,18,6,1,'#3a3a44'); R(-8,-7,16,1.2,'#5a5a66'); for(const x of [-7,6]) R(x,-1,1.4,1.4,'#2a2a30');
    if(typeof v3glow==='function') v3glow(c,0,-6,10,'rgba(120,170,255,.9)',.3+.15*Math.sin(t*8)); c.fillStyle='rgba(120,180,255,.85)'; for(let i=0;i<5;i++){ c.beginPath(); c.ellipse(-4+i*2,-7.6,.7,1.2+Math.sin(t*12+i)*.3,0,0,7); c.fill(); }
    c.fillStyle=D('#d8302a'); c.beginPath(); c.moveTo(-6,-8); c.quadraticCurveTo(-7,-15,0,-15.6); c.quadraticCurveTo(7,-15,6,-8); c.closePath(); c.fill(); L([5,-11,10,-14],'#d8302a',1.6); L([-3,-15.4,0,-18,3,-15.4],'#2a2a30',.8); E(0,-15.8,1.4,.7,'#2a2a30');
    c.strokeStyle='rgba(255,255,255,.55)'; c.lineWidth=.8; for(let i=0;i<2;i++){ const k=((t*.6+i/2)%1); c.globalAlpha=1-k; c.beginPath(); c.moveTo(10.4,-14.4-k*10); c.quadraticCurveTo(12+Math.sin(t*2+i)*2,-17-k*10,10.4,-20-k*10); c.stroke(); } c.globalAlpha=1; },
  mailbox(c,t,D){ const {R,RR,P,E}=dkHelpers(c,D), flag=(Math.sin(t*.25)>.6); R(-1.2,-20,2.4,20,'#6a4426'); RR(-7,-28,14,9,4,'#3a6f9a'); R(-7,-23.5,14,4.5,'#3a6f9a'); E(-7,-23.6,1.2,4.4,'#2a5a80');
    c.save(); c.translate(6,-24); c.rotate(flag?-1.4:0); R(0,-.6,1,6,'#d8302a'); R(-.2,-1.4,4,3,'#d8302a'); c.restore(); R(-3,-26,6,.8,'#f4f0ea'); },
  buoy(c,t,D){ const {R,RR,E,L}=dkHelpers(c,D), b=Math.sin(t*1.3)*.5; c.save(); c.translate(0,b*.3); RR(-7,-16,14,15,6,'#e8483a'); R(-7,-12,14,3,'#f4f0ea'); R(-7,-6,14,3,'#f4f0ea'); RR(-2,-22,4,6,1,'#5a5a66'); E(0,-23,3,1.2,'#3a3a44');
    c.strokeStyle=D('#c8b088'); c.lineWidth=1; c.beginPath(); c.moveTo(6,-4); c.quadraticCurveTo(12,0,9,1); c.stroke(); E(-3,-11,1.4,3,'rgba(255,255,255,.3)'); c.restore(); },
  lemontree(c,t,D){ const {R,RR,E,P}=dkHelpers(c,D); P([-7,-10,7,-10,5.6,0,-5.6,0],'#c8693a'); R(-7.6,-11,15.2,2,'#a8552a'); R(-.9,-30,1.8,20,'#6a4426');
    c.fillStyle=D('#4f8a4a'); for(let i=0;i<14;i++){ const a=i*2.4, r=6+((i*5)%5); c.beginPath(); c.ellipse(Math.cos(a)*r,-34+Math.sin(a)*r*.7+Math.sin(t*1.2+i)*.3,4,2,a,0,7); c.fill(); }
    c.fillStyle=D('#6aa860'); for(let i=0;i<6;i++){ const a=i*1.1; c.beginPath(); c.ellipse(Math.cos(a)*5-2,-38+Math.sin(a)*3,3,1.4,a,0,7); c.fill(); }
    for(const [x,y] of [[-6,-30],[5,-36],[1,-28],[-3,-40],[8,-30]]){ E(x,y,1.8,2.2,'#ffd84a'); E(x-.5,y-.8,.5,.6,'rgba(255,255,255,.6)'); } },
});

// =====================================================================
// 0.3.1 shiny fish: a soft glow behind, a warm golden tint and twinkling sparkles
// (drawn through one shared layer, so the tint only lands on the fish itself)
// =====================================================================
const SHINY3={c:null};
const _drawCreature3_sh = drawCreature3;
drawCreature3 = function(c,sp,x,y,L,o={}){ if(!o.shiny||o.sil||o._sh) return _drawCreature3_sh(c,sp,x,y,L,o);
  const t=performance.now()/1000, m=c.getTransform(), sc=Math.max(.5,Math.hypot(m.a,m.b)), R=L*1.2, px=Math.ceil(R*2*sc), ph=((hashStr(sp.id)%100)/100);
  if(px<6||px>1600) return _drawCreature3_sh(c,sp,x,y,L,o);
  const pulse=.5+.5*Math.sin(t*2.2+ph*6);
  if(typeof v3glow==='function') v3glow(c,x,y,L*.72,o.shiny===2&&typeof PRISM!=='undefined'&&PRISM[o.pv]?v3rgba(PRISM[o.pv].c,.9):'rgba(255,222,130,.9)',.16+.12*pulse); // prismatic fish glow in their own colour
  let C=SHINY3.c; if(!C) C=SHINY3.c=document.createElement('canvas'); if(C.width<px||C.height<px){ C.width=Math.max(C.width,px); C.height=Math.max(C.height,px); }
  const ox=C.getContext('2d'); ox.setTransform(1,0,0,1,0,0); ox.clearRect(0,0,px,px); ox.setTransform(sc,0,0,sc,px/2,px/2);
  const r=_drawCreature3_sh(ox,sp,0,0,L,Object.assign({},o,{_sh:1}));
  ox.save(); ox.globalCompositeOperation='source-atop'; ox.fillStyle='rgba(255,226,140,.12)'; ox.fillRect(-R,-R,R*2,R*2); ox.restore(); /* a warm golden tint (the sweeping glint band was removed: director, 2026-11-19, "distracting and clunky") */
  c.drawImage(C,0,0,px,px,x-R,y-R,R*2,R*2);
  // shiny FX (round 6 overhaul, ca_shiny06.js): flares, glitter and per-kind signatures that pop on new spots of the body
  if(!SHINY3.still&&typeof shinyFxWater==='function') shinyFxWater(c,x,y,L,t,sp,o);
  return r; };

// ---------- 0.3.2: the pineapple house redrawn (its pattern stays inside the fruit), plus two more seaside homes ----------
[['snoozyrock','Snoozy Rock',6500,.04,'show'],['tikihouse','Grumpy Tiki House',9500,.05,'income']]
  .forEach(a=>{ if(DECORI[a[0]]) return; const d={id:a[0],name:a[1],price:a[2],b:+(a[3]*2).toFixed(3)}; DECOR.push(d); DECORI[d.id]=d; DECOR_KIND[a[0]]=a[4]; });
Object.assign(TANK_ART,{
  pineapple(c,t){ const body=()=>{ c.beginPath(); c.ellipse(0,-36,25,36,0,0,7); };
    const g=c.createLinearGradient(-25,0,25,0); g.addColorStop(0,'#c8781a'); g.addColorStop(.45,'#f0a838'); g.addColorStop(1,'#d88a20'); c.fillStyle=g; body(); c.fill();
    c.save(); body(); c.clip(); c.strokeStyle='rgba(150,80,10,.55)'; c.lineWidth=1.6; for(let i=-6;i<=6;i++){ c.beginPath(); c.moveTo(i*9-30,-80); c.lineTo(i*9+30,0); c.stroke(); c.beginPath(); c.moveTo(i*9+30,-80); c.lineTo(i*9-30,0); c.stroke(); }
    c.fillStyle='rgba(255,220,130,.5)'; for(let r=0;r<8;r++) for(let i=-3;i<=3;i++){ const x=i*9+(r%2)*4.5, y=-68+r*9; c.beginPath(); c.arc(x,y,1.1,0,7); c.fill(); }
    c.fillStyle='rgba(255,240,200,.2)'; c.beginPath(); c.ellipse(8,-48,6,20,-.15,0,7); c.fill(); c.restore();
    for(let i=0;i<7;i++){ const a=-Math.PI/2+(i-3)*.36+Math.sin(t*1.1+i)*.05, L=26-Math.abs(i-3)*3; c.fillStyle=i%2?'#3a8a3a':'#4fa84a'; c.beginPath(); c.moveTo(-3,-70); c.quadraticCurveTo(Math.cos(a)*L*.5-4,-70+Math.sin(a)*L*.6,Math.cos(a)*L,-70+Math.sin(a)*L); c.quadraticCurveTo(Math.cos(a)*L*.5+4,-70+Math.sin(a)*L*.6,3,-70); c.fill(); }
    c.fillStyle='#4a90b8'; c.beginPath(); c.arc(-8,-44,6,0,7); c.fill(); c.strokeStyle='#8a5a20'; c.lineWidth=2; c.stroke(); c.strokeStyle='rgba(255,255,255,.5)'; c.lineWidth=1; c.beginPath(); c.moveTo(-8,-50); c.lineTo(-8,-38); c.moveTo(-14,-44); c.lineTo(-2,-44); c.stroke();
    c.fillStyle='#7a8a96'; c.beginPath(); c.moveTo(4,0); c.lineTo(4,-16); c.arc(10,-16,6,Math.PI,0); c.lineTo(16,0); c.closePath(); c.fill(); c.fillStyle='#5a6a76'; c.beginPath(); c.arc(14,-8,1,0,7); c.fill(); },
  snoozyrock(c,t){ const g=c.createLinearGradient(-36,-40,30,0); g.addColorStop(0,'#a07a5a'); g.addColorStop(.6,'#7a5a40'); g.addColorStop(1,'#5a4030'); c.fillStyle=g; c.beginPath(); c.moveTo(-38,0); c.bezierCurveTo(-38,-30,-18,-42,0,-42); c.bezierCurveTo(18,-42,38,-30,38,0); c.closePath(); c.fill();
    c.fillStyle='rgba(60,40,26,.35)'; for(const [x,y,r] of [[-20,-14,4],[14,-24,3],[22,-8,5],[-6,-30,2.6]]){ c.beginPath(); c.ellipse(x,y,r,r*.7,0,0,7); c.fill(); }
    c.fillStyle='rgba(255,230,200,.18)'; c.beginPath(); c.ellipse(-10,-30,12,5,-.3,0,7); c.fill();
    const sw=Math.sin(t*.9)*.12; c.save(); c.translate(0,-42); c.rotate(sw); c.strokeStyle='#5a4030'; c.lineWidth=2; c.beginPath(); c.moveTo(0,0); c.lineTo(0,-16); c.stroke(); c.fillStyle='#e8d0a0'; c.beginPath(); c.moveTo(0,-16); c.lineTo(9,-13); c.lineTo(0,-10); c.closePath(); c.fill(); c.restore();
    c.fillStyle='rgba(255,255,255,.75)'; c.font='bold 9px sans-serif'; c.textAlign='center'; const z=(t*.5)%1; c.globalAlpha=1-z; c.fillText('z',18+z*8,-44-z*18); c.globalAlpha=1; },
  tikihouse(c,t){ const g=c.createLinearGradient(-26,0,26,0); g.addColorStop(0,'#5a6a7a'); g.addColorStop(.5,'#8a98a8'); g.addColorStop(1,'#5a6676'); c.fillStyle=g;
    c.beginPath(); c.moveTo(-24,0); c.lineTo(-22,-74); c.quadraticCurveTo(0,-92,22,-74); c.lineTo(24,0); c.closePath(); c.fill();
    c.fillStyle='#4a5868'; c.beginPath(); c.moveTo(-22,-62); c.lineTo(22,-62); c.lineTo(20,-56); c.lineTo(-20,-56); c.closePath(); c.fill(); // the heavy brow
    for(const x of [-11,11]){ c.fillStyle='#2a3a4a'; c.beginPath(); c.ellipse(x,-48,5,6,0,0,7); c.fill(); const lit=.5+.3*Math.sin(t*1.3+x); c.fillStyle='rgba(255,220,140,'+lit+')'; c.beginPath(); c.ellipse(x,-48,3.6,4.6,0,0,7); c.fill(); }
    c.fillStyle='#6a7888'; c.beginPath(); c.moveTo(-5,-56); c.lineTo(5,-56); c.lineTo(7,-24); c.quadraticCurveTo(0,-20,-7,-24); c.closePath(); c.fill(); // long nose
    c.fillStyle='#3a2a1a'; c.beginPath(); c.moveTo(-8,0); c.lineTo(-8,-12); c.arc(0,-12,8,Math.PI,0); c.lineTo(8,0); c.closePath(); c.fill(); c.fillStyle='#c8a050'; c.beginPath(); c.arc(5,-6,1,0,7); c.fill();
    c.strokeStyle='rgba(30,40,50,.35)'; c.lineWidth=1; for(const y of [-34,-16]){ c.beginPath(); c.moveTo(-23,y); c.lineTo(-10,y+1); c.moveTo(10,y+1); c.lineTo(23,y); c.stroke(); } },
});
