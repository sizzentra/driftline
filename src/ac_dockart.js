
// =====================================================================
// 0.3 decoration overhaul, part 1: every dock decoration redrawn with detail and a little life
// (like the pets got): flames flicker, flags flutter, the hammock sways, a bird visits the birdhouse,
// the radio plays notes, lights twinkle at night. Item space: dock surface at y=0, sizes in angler
// units (the angler is about 70 tall), so they sit at a believable size.
// =====================================================================
const DOCK_ART={};
function dkHelpers(c,D){ return { R:(x,y,w,h,cl)=>{ c.fillStyle=D(cl); c.fillRect(x,y,w,h); }, E:(x,y,rx,ry,cl,r=0)=>{ c.fillStyle=D(cl); c.beginPath(); c.ellipse(x,y,rx,ry,r,0,7); c.fill(); },
  RR:(x,y,w,h,r,cl)=>{ c.fillStyle=D(cl); c.beginPath(); c.roundRect?c.roundRect(x,y,w,h,r):c.rect(x,y,w,h); c.fill(); }, P:(pts,cl)=>{ c.fillStyle=D(cl); c.beginPath(); c.moveTo(pts[0],pts[1]); for(let i=2;i<pts.length;i+=2) c.lineTo(pts[i],pts[i+1]); c.closePath(); c.fill(); },
  L:(pts,cl,w)=>{ c.strokeStyle=D(cl); c.lineWidth=w; c.lineCap='round'; c.beginPath(); c.moveTo(pts[0],pts[1]); for(let i=2;i<pts.length;i+=2) c.lineTo(pts[i],pts[i+1]); c.stroke(); },
  G:(x0,y0,x1,y1,a,b)=>{ const g=c.createLinearGradient(x0,y0,x1,y1); g.addColorStop(0,D(a)); g.addColorStop(1,D(b)); return g; } }; }
Object.assign(DOCK_ART,{
  umbrella(c,t,D){ const {R,E,L,P}=dkHelpers(c,D), sw=Math.sin(t*1.1)*.03; R(-.7,-74,1.4,74,'#e8e4dc'); E(0,-.5,5,1.4,'#6a6a72'); c.save(); c.translate(0,-72); c.rotate(sw);
    const cols=['#ff6a4a','#f4f0e6']; for(let i=0;i<6;i++){ const a0=Math.PI+i*Math.PI/6, a1=a0+Math.PI/6; c.fillStyle=D(cols[i%2]); c.beginPath(); c.moveTo(0,-4); c.lineTo(Math.cos(a0)*30,Math.sin(a0)*-0+4); c.quadraticCurveTo(Math.cos((a0+a1)/2)*31,6,Math.cos(a1)*30,4); c.closePath(); c.fill(); }
    for(let i=0;i<=6;i++){ const x=-30+i*10; P([x,4,x+5,4,x+2.5,7],i%2?'#ff6a4a':'#f4f0e6'); } E(0,-4.4,1.6,1.6,'#e8e4dc'); c.restore(); },
  birdhouse(c,t,D){ const {R,E,P,RR,L}=dkHelpers(c,D); R(-1.6,-58,3.2,58,'#7a5a3a'); RR(-9,-74,18,17,1.5,'#4a8ab0'); P([-11.5,-72,0,-82,11.5,-72],'#c8553a'); L([-11.5,-72,0,-82,11.5,-72],'#8a3a24',.8); E(0,-67,3,3,'#1a1a22'); R(-.5,-62.6,1,3,'#7a5a3a');
    const k=(t%9)/9, out=k>.15&&k<.55; if(out){ const hop=Math.abs(Math.sin(t*6))*1.4; E(2.6,-59.6-hop,2.6,2,'#e8a03a'); E(4.4,-61.6-hop,1.6,1.5,'#e8a03a'); P([5.8,-61.8-hop,7.6,-61.3-hop,5.8,-60.8-hop],'#3a2a1a'); E(4.8,-62-hop,.35,.35,'#1a1a1a'); } },
  bookshelf(c,t,D){ const {R,RR}=dkHelpers(c,D); RR(-14,-50,28,50,1.5,'#6a4426'); R(-12,-48,24,46,'#3a2416'); const cols=['#c8553a','#3a6f9a','#4f8a4a','#e0c050','#7a4a9a','#d87aa0','#2a2d33','#8a6a4a'];
    for(let s=0;s<3;s++){ const y=-2-s*15.4; R(-14,y-1.4,28,1.6,'#6a4426'); let x=-11.6; for(let i=0;x<10.6;i++){ const w=1.6+((i*7+s*3)%3)*.6, h=9+((i*5+s)%4)*1.2; R(x,y-1.4-h,w,h,cols[(i+s*3)%8]); R(x,y-1.4-h+1.5,w,.5,'#f4ece0'); x+=w+.3; } }
    RR(4,-56,6,6,1,'#c8693a'); DOCK_ART._leaf(c,7,-56,D,t); },
  _leaf(c,x,y,D,t){ c.fillStyle=D('#4f8a4a'); for(let i=0;i<5;i++){ const a=-Math.PI/2+(i-2)*.45+Math.sin(t*1.3+i)*.06; c.beginPath(); c.ellipse(x+Math.cos(a)*4,y+Math.sin(a)*4,3.6,1.2,a,0,7); c.fill(); } },
  bunting(c,t,D){ const {R,P}=dkHelpers(c,D); R(-27,-62,1.6,62,'#7a5a3a'); R(25.4,-62,1.6,62,'#7a5a3a'); c.strokeStyle=D('#e8d8b0'); c.lineWidth=.5; c.beginPath(); c.moveTo(-26,-60); c.quadraticCurveTo(0,-50,26,-60); c.stroke();
    const cols=['#ff6a4a','#ffd23a','#5ab8ff','#6ad88a','#d87aff','#ff9ac0']; for(let i=0;i<7;i++){ const u=(i+.5)/7, x=-26+52*u, y=-60+(1-(2*u-1)**2)*10*.5*2, fl=Math.sin(t*3+i)*1.4; P([x-3,y,x+3,y,x+fl*.5,y+6.5],cols[i%6]); } },
  campfire(c,t,D,night){ const {E,RR,L}=dkHelpers(c,D); for(let i=0;i<7;i++){ const a=Math.PI*(1+i/6); E(Math.cos(a)*10,-1.2-Math.sin(a)*1.4,2.6,1.8,i%2?'#8a8a92':'#6a6a74'); }
    RR(-9,-4,18,3.2,1.5,'#6a4426'); c.save(); c.translate(0,-2.4); c.rotate(.45); RR(-8,-1.6,16,3.2,1.5,'#7a5030'); c.restore(); c.save(); c.translate(0,-2.4); c.rotate(-.45); RR(-8,-1.6,16,3.2,1.5,'#5a3a20'); c.restore();
    if(typeof v3glow==='function') v3glow(c,0,-8,18,'rgba(255,170,80,.9)',.35+.25*(night||0)+.08*Math.sin(t*9));
    for(const [k,cl,sc] of [[0,'#ff6a1a',1],[1,'#ffb02a',.72],[2,'#fff2a0',.42]]){ const f=1+Math.sin(t*10+k)*.08; c.fillStyle=cl; c.beginPath(); c.moveTo(-6*sc,-3); c.quadraticCurveTo(-7*sc,-10*sc*f,-1*sc,-19*sc*f+Math.sin(t*7+k)*1.2); c.quadraticCurveTo(1*sc,-12*sc,3*sc,-15*sc*f); c.quadraticCurveTo(7*sc,-9*sc,6*sc,-3); c.closePath(); c.fill(); }
    c.fillStyle='rgba(255,200,120,.9)'; for(let i=0;i<4;i++){ const k=((t*.7+i/4)%1); c.fillRect(Math.sin(i*2.1+t)*4,-12-k*16,.8*(1-k)+.2,.8*(1-k)+.2); } },
  gnome(c,t,D){ const {E,RR,P,L}=dkHelpers(c,D); E(0,-.6,5.4,1.2,'#3a3a3a'); RR(-4,-9,8,9,3,'#3a6f9a'); RR(-4.6,-4,9.2,1.6,.6,'#5a3a20'); E(0,-11,3.4,3.2,'#f2c8a0'); P([-3.8,-11.4,0,-21,3.8,-11.4],'#d8302a');
    c.fillStyle=D('#f4f4f2'); c.beginPath(); c.moveTo(-3.4,-11); c.quadraticCurveTo(-3.6,-5,0,-4.2); c.quadraticCurveTo(3.6,-5,3.4,-11); c.quadraticCurveTo(0,-9,-3.4,-11); c.fill(); E(1.4,-11.6,1.2,1,'#e89a80'); E(-1,-12.6,.4,.4,'#1a1a1a'); E(2.2,-12.8,.4,.4,'#1a1a1a');
    L([3.6,-8,8,-18],'#8a6a3a',.6); L([8,-18,10,-8+Math.sin(t*2)*.6],'rgba(230,230,230,.7)',.2); },
  hammock(c,t,D){ const {R,L}=dkHelpers(c,D), sw=Math.sin(t*1.2)*1.6; R(-24,-40,2.4,40,'#6a4426'); R(21.6,-40,2.4,40,'#6a4426');
    c.fillStyle=D('#e8c890'); c.beginPath(); c.moveTo(-22,-34); c.quadraticCurveTo(sw,-10,22,-34); c.quadraticCurveTo(sw,-14,-22,-34); c.fill(); c.strokeStyle=D('#c8a060'); c.lineWidth=.3; for(let i=1;i<8;i++){ const u=i/8; c.beginPath(); c.moveTo(-22+44*u,-34+Math.sin(u*Math.PI)*21); c.lineTo(-22+44*u,-34+Math.sin(u*Math.PI)*24.5); c.stroke(); }
    c.strokeStyle=D('#d8553a'); c.lineWidth=1.2; c.beginPath(); c.moveTo(-22,-34); c.quadraticCurveTo(sw,-10,22,-34); c.stroke(); c.fillStyle=D('#5ab8ff'); c.beginPath(); c.ellipse(-12+sw*.4,-25,4,1.8,.5,0,7); c.fill(); },
  lantern(c,t,D,night){ const {R,RR,E,L}=dkHelpers(c,D); R(-1,-30,2,30,'#2c2232'); R(-1,-30,7,1.4,'#2c2232'); L([5,-29,5,-26],'#2c2232',.5); const fl=.9+.1*Math.sin(t*8)*Math.sin(t*3);
    if(typeof v3glow==='function') v3glow(c,5,-22,14,'rgba(255,200,110,.9)',(.25+.6*(night||0))*fl); RR(2.6,-26,4.8,7,1,'#2c2232'); RR(3.2,-25.2,3.6,5.4,.8,'#ffe08a'); E(5,-22.6,.8,1.4*fl,'#ff9a2a'); R(2.4,-19.4,5.2,1,'#2c2232'); },
  grill(c,t,D){ const {L,E,RR}=dkHelpers(c,D); L([-6,0,-3,-12],'#3a3a3a',1); L([6,0,3,-12],'#3a3a3a',1); L([0,0,0,-12],'#3a3a3a',1); c.fillStyle=D('#2a2a2e'); c.beginPath(); c.arc(0,-14,8.4,0,Math.PI); c.fill(); c.beginPath(); c.arc(0,-15,8.4,Math.PI,0); c.fill(); E(0,-23.6,1.6,1,'#6a6a72');
    c.strokeStyle='rgba(255,255,255,.25)'; c.lineWidth=.6; c.beginPath(); c.arc(-2,-17,5,Math.PI*1.2,Math.PI*1.6); c.stroke(); for(let i=0;i<3;i++){ const k=((t*.35+i/3)%1); c.fillStyle='rgba(220,220,220,'+(.45*(1-k))+')'; c.beginPath(); c.arc(Math.sin(k*5+i)*2,-25-k*18,1.6+k*3,0,7); c.fill(); } },
  plants(c,t,D){ const {RR,E}=dkHelpers(c,D); for(const [x,h,fl] of [[-5,16,0],[5,13,1]]){ RR(x-4,-8,8,8,1.2,'#c8693a'); RR(x-4.6,-9,9.2,2,.8,'#a8552a'); for(let i=0;i<6;i++){ const a=-Math.PI/2+(i-2.5)*.32+Math.sin(t*1.4+i+x)*.05; c.fillStyle=D(i%2?'#4f8a4a':'#6aa85a'); c.beginPath(); c.ellipse(x+Math.cos(a)*h*.45,-9+Math.sin(a)*h*.55,h*.3,1.5,a,0,7); c.fill(); }
    if(fl){ for(const [dx,dy] of [[-2,-19],[2,-17]]){ for(let p=0;p<5;p++){ const a=p*1.26; E(x+dx+Math.cos(a)*1.2,dy+Math.sin(a)*1.2,1,1,'#ff7ab0'); } E(x+dx,dy,.7,.7,'#ffe08a'); } } } },
  pumpkins(c,t,D,night){ const {E,RR}=dkHelpers(c,D); for(const [x,r,carve] of [[-6,7,0],[4.6,5.2,1],[11,3.4,0]]){ c.fillStyle=D('#e8781a'); c.beginPath(); c.ellipse(x,-r*.85,r,r*.85,0,0,7); c.fill(); c.strokeStyle=D('#b8540e'); c.lineWidth=.5; for(const k of [-.5,0,.5]){ c.beginPath(); c.ellipse(x+k*r*.6,-r*.85,r*.32,r*.84,0,0,7); c.stroke(); } RR(x-.6,-r*1.85,1.2,2.4,.4,'#4a6a2a');
    if(carve){ const gl=(night||0)>.3; c.fillStyle=gl?'#ffd25a':D('#5a2a0a'); c.beginPath(); c.moveTo(x-2.6,-5.6); c.lineTo(x-1.2,-5.2); c.lineTo(x-2,-4); c.fill(); c.beginPath(); c.moveTo(x+1.2,-5.2); c.lineTo(x+2.6,-5.6); c.lineTo(x+2,-4); c.fill(); c.beginPath(); c.moveTo(x-2.6,-2.8); c.lineTo(x+2.6,-2.8); c.lineTo(x+1.6,-1.6); c.lineTo(x-1.6,-1.6); c.fill(); } } },
  lights(c,t,D,night){ const {R}=dkHelpers(c,D); R(-27,-62,1.6,62,'#5a4030'); R(25.4,-62,1.6,62,'#5a4030'); c.strokeStyle=D('#3a3a3a'); c.lineWidth=.4; c.beginPath(); c.moveTo(-26,-60); c.quadraticCurveTo(0,-48,26,-60); c.stroke();
    for(let i=0;i<9;i++){ const u=(i+.5)/9, x=-26+52*u, y=-60+(1-(2*u-1)**2)*6+1.6, on=.6+.4*Math.sin(t*2.4+i*1.7); if((night||0)>.2&&typeof v3glow==='function') v3glow(c,x,y+1,6,'rgba(255,220,140,.9)',on*.6*(night||0)); c.fillStyle=(night||0)>.2?'rgba(255,236,170,'+on+')':D('#f4ecd0'); c.beginPath(); c.ellipse(x,y+1.4,1.1,1.5,0,0,7); c.fill(); } },
  surfboard(c,t,D){ const {E}=dkHelpers(c,D); c.save(); c.translate(0,-30); c.rotate(.12); const g=c.createLinearGradient(-6,0,6,0); g.addColorStop(0,D('#2ab8d8')); g.addColorStop(1,D('#7ae8f8')); c.fillStyle=g; c.beginPath(); c.ellipse(0,0,6,30,0,0,7); c.fill();
    c.fillStyle=D('#ff6a4a'); c.fillRect(-6,-6,12,2.4); c.fillStyle=D('#ffd23a'); c.fillRect(-6,-2.6,12,1.2); c.strokeStyle=D('#f4f4f2'); c.lineWidth=.5; c.beginPath(); c.moveTo(0,-29); c.lineTo(0,29); c.stroke(); c.restore(); },
  telescope(c,t,D){ const {L,RR,E}=dkHelpers(c,D), sw=Math.sin(t*.3)*.05; L([0,-24,-8,0],'#5a4030',1); L([0,-24,8,0],'#5a4030',1); L([0,-24,0,0],'#5a4030',1); c.save(); c.translate(0,-26); c.rotate(-.45+sw);
    RR(-12,-2.6,26,5.2,1.6,'#c8963a'); RR(10,-3.2,6,6.4,1.2,'#e8b860'); RR(-14,-1.8,3,3.6,.8,'#8a6420'); E(16,0,.8,2.8,'#bfe8ff'); c.restore(); },
  chair(c,t,D){ const {RR,R}=dkHelpers(c,D), w='#8a5a3a', l='#a8744a'; RR(-11,-42,3.4,42,1,w); RR(8,-20,3,20,1,w); RR(-3,-20,2.8,20,1,w); RR(-11.6,-21.6,23.4,4,1.6,l); RR(-12,-43,4.4,23,1.6,l); RR(-9.6,-24.6,19,3,1.2,'#c84a4a'); RR(-10.8,-41,3.2,15,1.2,'#c84a4a'); R(-11.6,-31,23,2,l); },
});
// extend the redraw list: anything in DOCK_ART is drawn the new way (the litDraw wrapper lights it)
const _dockItemNew_0 = dockItemNew;
dockItemNew = function(c,id,t,D){ const f=DOCK_ART[id]; if(f&&id[0]!=='_'){ f(c,t,D,DOCK_NIGHT); return true; } return _dockItemNew_0(c,id,t,D); };
let DOCK_NIGHT=0;
const _drawDockItem_1 = drawDockItem;
drawDockItem = function(c,id,x,y,s,t,night,back){ DOCK_NIGHT=night||0; return _drawDockItem_1(c,id,x,y,s,t,night,back); };
Object.assign(DOCK_H,{umbrella:78,birdhouse:82,bookshelf:56,bunting:66,campfire:24,gnome:21,hammock:42,lantern:30,grill:40,plants:20,pumpkins:13,lights:64,surfboard:60,telescope:40,chair:43});
// a dock decoration fitted into a thumbnail box (bottom-centred, never overflowing)
function dockThumb(x,id,w,h,night){ const N2=dockNative(id), s=Math.min(3.2,(h*.8)/(N2.h||30),(w*.86)/(N2.w||30)); drawDockItem(x,id,w/2,h*.9,s,performance.now()/1000,night||0); }
Object.assign(DOCK_ART,{
  umbrella(c,t,D){ const {R,E}=dkHelpers(c,D), sw=Math.sin(t*1.1)*.025; R(-.7,-74,1.4,74,'#e8e4dc'); E(0,-.5,5,1.4,'#6a6a72'); c.save(); c.translate(0,-72); c.rotate(sw);
    const dome=()=>{ c.beginPath(); c.moveTo(-31,5); c.quadraticCurveTo(-26,-9,0,-11); c.quadraticCurveTo(26,-9,31,5); for(let i=6;i>=0;i--){ const x=-31+i*62/6; c.quadraticCurveTo(x+62/12,7.6,x,5); } c.closePath(); };
    c.fillStyle=D('#f4f0e6'); dome(); c.fill(); c.save(); dome(); c.clip(); c.fillStyle=D('#ff6a4a'); for(let i=0;i<6;i+=2){ c.beginPath(); c.moveTo(0,-11); c.lineTo(-31+i*62/6,8); c.lineTo(-31+(i+1)*62/6,8); c.closePath(); c.fill(); }
    const sh=c.createLinearGradient(0,-11,0,8); sh.addColorStop(0,'rgba(255,255,255,.15)'); sh.addColorStop(1,'rgba(0,0,0,.18)'); c.fillStyle=sh; c.fillRect(-32,-12,64,21); c.restore(); E(0,-11,1.6,1.4,'#e8e4dc'); c.restore(); },
  hammock(c,t,D){ const {R}=dkHelpers(c,D), sw=Math.sin(t*1.2)*1.4; R(-24,-40,2.4,40,'#6a4426'); R(21.6,-40,2.4,40,'#6a4426');
    const yT=u=>-34+40*u*(1-u), yB=u=>-34+48*u*(1-u), xs=u=>-22+44*u+sw*Math.sin(u*Math.PI);
    c.fillStyle=D('#e8c890'); c.beginPath(); for(let i=0;i<=20;i++){ const u=i/20; i?c.lineTo(xs(u),yT(u)):c.moveTo(xs(u),yT(u)); } for(let i=20;i>=0;i--){ const u=i/20; c.lineTo(xs(u),yB(u)); } c.closePath(); c.fill();
    c.strokeStyle=D('#c8a060'); c.lineWidth=.3; for(let i=1;i<10;i++){ const u=i/10; c.beginPath(); c.moveTo(xs(u),yT(u)); c.lineTo(xs(u),yB(u)); c.stroke(); }
    c.strokeStyle=D('#d8553a'); c.lineWidth=1.1; c.beginPath(); for(let i=0;i<=20;i++){ const u=i/20; i?c.lineTo(xs(u),yB(u)):c.moveTo(xs(u),yB(u)); } c.stroke(); c.fillStyle=D('#5ab8ff'); c.beginPath(); c.ellipse(xs(.24),yT(.24)-1.6,4,1.8,.45,0,7); c.fill(); },
  catbed(c,t,D){ const {E,P}=dkHelpers(c,D), br=Math.sin(t*1.8)*.15; E(0,-2.6,9,3.2,'#9a5aa8'); E(0,-3.6,7.2,2.2,'#c88ad8'); E(0,-3.4,6.4,1.6,'#e8c8f0');
    E(-.6,-5.6-br,4.6,2.6+br,'#e09a5a'); E(3.4,-6.4,2.2,1.9,'#e09a5a'); P([2.2,-7.6,2.8,-9.4,3.6,-7.8],'#e09a5a'); P([3.8,-7.8,4.8,-9.2,5,-7.4],'#e09a5a'); c.strokeStyle=D('#5a3a20'); c.lineWidth=.3; c.beginPath(); c.arc(3.9,-6.5,.45,.2,2.9); c.stroke();
    c.strokeStyle=D('#e09a5a'); c.lineWidth=1.2; c.lineCap='round'; c.beginPath(); c.moveTo(-4.8,-5); c.quadraticCurveTo(-6.4,-2.6,-2,-3.4); c.stroke(); c.strokeStyle=D('#c87a3a'); c.lineWidth=.35; for(const x of [-2.6,-.8,1]){ c.beginPath(); c.moveTo(x,-8); c.lineTo(x+.4,-6.4); c.stroke(); } },
});
