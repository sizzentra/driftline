// =====================================================================
// 0.3.3 more life: details and motion for every water, weighted toward the quietest ones.
// Shared: "cat's-paw" wind gusts that ripple across calm water, and a wake that trails the float when a fish runs.
// Per water: things that happen now and then, each easing in and out (nothing pops), all cheap to draw.
// High graphics (gfxHigh) adds density, never different behaviour.
// =====================================================================
const L3={};
const l3s=v=>v*v*(3-2*v); // smoothstep
const l3hash=n=>((Math.sin(n*12.9898)*43758.5)%1+1)%1;
// a soft breath of wind crossing the water: a band of fine ripples that darkens the surface as it travels
function l3gust(P,t,hz,seed,strength){ const per=26, q=((t+seed*9)%per)/per; if(q>.55) return; const e=q/.55, a=Math.sin(e*Math.PI)*strength;
  const y=hz+H*(.08+l3hash(Math.floor((t+seed*9)/per)+seed)*.35), u=(y-hz)/(H-hz), x=W*(-.2+e*1.4), w=W*(.18+u*.2), hh=H*(.012+u*.03);
  const gr=g.createRadialGradient(x,y,0,x,y,w); gr.addColorStop(0,v3rgba(P.wBot||'#123',.14*a)); gr.addColorStop(1,v3rgba(P.wBot||'#123',0)); g.save(); g.translate(x,y); g.scale(1,hh/w); g.translate(-x,-y); g.fillStyle=gr; g.fillRect(x-w,y-w,w*2,w*2); g.restore();
  g.strokeStyle=v3rgba(mix(P.wTop||'#acd','#ffffff',.5),.35*a); g.lineWidth=1; const n=gfxHigh()?22:14; for(let i=0;i<n;i++){ const rx=x+(l3hash(i+seed*3)-.5)*w*1.6, ry=y+(l3hash(i*7+seed)-.5)*hh*1.6, l=W*(.006+u*.012); g.beginPath(); g.moveTo(rx,ry); g.lineTo(rx+l,ry-.4); g.stroke(); } }
// a V-shaped wake behind the float while a fish is running (all waters)
function l3wake(P,t){ if(G.st!=='reeling'||!G.run) return; const x=G.bob.x, y=G.bob.y, foam=mix(P.wTop||'#acd','#ffffff',.7); g.strokeStyle=v3rgba(foam,.45); g.lineWidth=1.1;
  for(let k=1;k<=4;k++){ const d=k*7, a=.5-k*.1; g.globalAlpha=a; g.beginPath(); g.moveTo(x-d*1.6,y-d*.18-Math.sin(t*9+k)*.6); g.lineTo(x,y); g.lineTo(x-d*1.6,y+d*.22+Math.sin(t*9+k)*.6); g.stroke(); } g.globalAlpha=1; }
for(const id in V3SCENES) m33wrap(id,'live',function(P,t,hz){ l3wake(P,t); });
for(const id of ['pond','river','frost','ember','starfall','trench']) m33wrap(id,'live',function(P,t,hz){ if(S.settings.effects) l3gust(P,t,hz,id.length,id==='frost'?.7:1); });

// ---------------------------------------------------------------------
// WILLOW POND: a frog that hops between lily pads, a deer that comes down to drink at the far shore, willow leaves
// drifting down and settling on the water, and dandelion seeds floating through the sunlight
// ---------------------------------------------------------------------
L3.pads=[[.5,.78],[.57,.84],[.66,.72],[.86,.9]];
m33wrap('pond','live',function(P,t,hz){ const night=P.night, FX=S.settings.effects;
  // the frog: sits, then leaps in a little arc to the next pad (ripple where it lands)
  { const per=9, cyc=Math.floor(t/per), q=(t%per)/per, a=L3.pads[cyc%4], b=L3.pads[(cyc+1)%4], hop=q>.82?(q-.82)/.18:0, e=l3s(hop);
    const x=W*(a[0]+(b[0]-a[0])*e)+W*.008, y=H*(a[1]+(b[1]-a[1])*e)-H*.012-Math.sin(e*Math.PI)*H*.05, s=H*.0055, fc=mix('#5a9a3a',P.wBot,night*.55);
    g.fillStyle=fc; g.beginPath(); g.ellipse(x,y,s*2,s*1.3,0,0,7); g.fill(); g.beginPath(); g.arc(x+s*1.4,y-s*.8,s*.9,0,7); g.fill();
    g.fillStyle=mix('#c8e080',P.wBot,night*.5); g.beginPath(); g.ellipse(x,y+s*.5,s*1.4,s*.5,0,0,7); g.fill(); g.fillStyle='#14140e'; g.beginPath(); g.arc(x+s*1.6,y-s*1.4,s*.35,0,7); g.fill();
    if(hop>0&&hop<1){ g.strokeStyle=fc; g.lineWidth=s*.5; g.beginPath(); g.moveTo(x-s*1.4,y+s*.4); g.lineTo(x-s*2.8,y+s*1.6); g.stroke(); }
    if(FX&&q>.95){ const k=(q-.95)/.05; g.strokeStyle=v3rgba('#ffffff',.5*(1-k)); g.lineWidth=1; g.beginPath(); g.ellipse(W*b[0]+W*.008,H*b[1]-H*.008,s*(2+k*6),s*(.6+k*1.6),0,0,7); g.stroke(); } }
  // the deer: comes out of the trees at dawn and dusk, drinks, and goes back (fades in and out)
  { const per=70, q=((t+20)%per)/per; if(q<.45){ const a=l3s(Math.min(1,q/.06))*l3s(Math.min(1,(.45-q)/.06)), dip=Math.max(0,Math.sin((q-.08)/.3*Math.PI*3))*(q>.08&&q<.38?1:0), x=W*.62, y=hz+H*.004, s=H*.006, dc=mix('#8a5a34',P.front,.35+night*.4);
      g.save(); g.globalAlpha=a; g.fillStyle=dc; g.beginPath(); g.ellipse(x,y-s*3.4,s*3.2,s*1.5,0,0,7); g.fill(); for(const lx of [-2.2,-1.6,1.8,2.4]) g.fillRect(x+lx*s,y-s*2.4,s*.45,s*2.4);
      g.save(); g.translate(x+s*2.8,y-s*4.2); g.rotate(.4+dip*1.1); g.fillRect(-s*.45,-s*3,s*.9,s*3); g.beginPath(); g.ellipse(0,-s*3.3,s*1.1,s*.7,.5,0,7); g.fill(); g.strokeStyle=dc; g.lineWidth=s*.3; g.beginPath(); g.moveTo(-s*.3,-s*3.8); g.lineTo(-s*1,-s*5.2); g.moveTo(-s*.6,-s*4.6); g.lineTo(-s*1.6,-s*4.8); g.stroke(); g.restore();
      g.fillStyle=mix('#f4ead8',P.front,.4+night*.4); g.fillRect(x-s*3.3,y-s*4,s*.7,s*.7); g.restore();
      g.save(); g.globalAlpha=a*.25; g.fillStyle=dc; g.beginPath(); g.ellipse(x,y+s*2.2,s*3.2,s*1,0,0,7); g.fill(); g.restore(); } }
  // willow leaves drifting down, then floating and turning slowly on the water
  if(FX){ for(let i=0,n=gfxHigh()?8:5;i<n;i++){ const per=11+i*1.7, q=((t+i*3.1)%per)/per, sx=W*(.82+l3hash(i)*.12), wy=hz+H*(.04+l3hash(i+9)*.12), fall=Math.min(1,q/.35), x=sx-q*W*.08+Math.sin(t*1.6+i)*W*.006*(1-fall*.5), y=hz-H*.18+(wy-hz+H*.18)*l3s(fall), a=q<.9?1:(1-q)/.1;
      g.save(); g.globalAlpha=a; g.translate(x,y); g.rotate(t*(fall<1?2:.3)+i); g.fillStyle=mix(P.leafHi||'#cfe08a',P.wMid,night*.5); g.beginPath(); g.ellipse(0,0,H*.004,H*.0014,0,0,7); g.fill(); g.restore(); } }
  // dandelion seeds floating in the daylight
  if(FX&&night<.6){ g.fillStyle=v3rgba('#fffaf0',.7*(1-night)); for(let i=0,n=gfxHigh()?14:8;i<n;i++){ const x=W*((l3hash(i)+t*.006*(1+i%3))%1), y=hz*(.55+l3hash(i+4)*.4)+Math.sin(t*.8+i)*H*.02; g.beginPath(); g.arc(x,y,1.1,0,7); g.fill(); g.fillRect(x-.2,y,.4,2); } }
});

// ---------------------------------------------------------------------
// CORAL REEF: surf breaking on the outer reef, a seabird that folds and plunges for fish, a ray gliding over the sand,
// and a dark shoal turning together under the surface
// ---------------------------------------------------------------------
m33wrap('reef','live',function(P,t,hz){ const night=P.night, FX=S.settings.effects, foam=mix(P.wTop,'#ffffff',.8);
  // surf on the outer reef line: white water rising and falling in sets
  { const y=hz+H*.012; for(let i=0,n=gfxHigh()?40:26;i<n;i++){ const x=W*(.28+i/n*.7), set=Math.max(0,Math.sin(t*.7+i*.35)), h=H*.006*set; if(set<.15) continue; g.fillStyle=v3rgba(foam,.6*set); g.beginPath(); g.ellipse(x,y-h*.4,W*.01,Math.max(.6,h),0,0,7); g.fill(); }
    g.strokeStyle=v3rgba(foam,.35); g.lineWidth=1; g.beginPath(); for(let X=W*.27;X<=W;X+=8){ const yy=y+H*.004+Math.sin(X*.05+t*1.4)*.8; X<=W*.27?g.moveTo(X,yy):g.lineTo(X,yy); } g.stroke(); }
  // a gannet: circles, folds its wings and plunges, a splash, then flies off
  if(night<.7){ const per=24, q=(t%per)/per, bx=W*.68, sy=hz*.4, s=H*.006, wc=mix('#f4f4f0',P.top,night*.8);
    if(q<.4){ const a=q/.4*Math.PI*2, x=bx+Math.cos(a)*W*.06, y=sy+Math.sin(a)*hz*.05, fl=Math.sin(t*6)*.6; g.strokeStyle=wc; g.lineWidth=Math.max(1,s*.45); g.beginPath(); g.moveTo(x-s*3,y-s*fl); g.quadraticCurveTo(x-s*1.4,y-s*.8,x,y); g.quadraticCurveTo(x+s*1.4,y-s*.8,x+s*3,y-s*fl); g.stroke(); }
    else if(q<.5){ const e=(q-.4)/.1, x=bx+W*.06, y=sy+(hz+H*.06-sy)*e*e; g.fillStyle=wc; g.beginPath(); g.moveTo(x,y+s*2.4); g.lineTo(x-s*.7,y-s*1.4); g.lineTo(x+s*.7,y-s*1.4); g.closePath(); g.fill(); }
    else if(q<.62&&FX){ const e=(q-.5)/.12, x=bx+W*.06, y=hz+H*.06; for(let j=0;j<9;j++){ const ang=-Math.PI/2+(j-4)*.3, r=s*(1+e*5); g.fillStyle=v3rgba(foam,.8*(1-e)); g.beginPath(); g.arc(x+Math.cos(ang)*r,y+Math.sin(ang)*r*1.6,1.3,0,7); g.fill(); } g.strokeStyle=v3rgba(foam,.6*(1-e)); g.beginPath(); g.ellipse(x,y,s*(2+e*7),s*(.5+e*1.6),0,0,7); g.stroke(); } }
  // a ray gliding over the sand, its wings rippling
  { const per=48, q=(t%per)/per, a=l3s(Math.min(1,q/.1))*l3s(Math.min(1,(1-q)/.1)), x=W*(1.05-q*.85), y=hz+H*(.42+Math.sin(q*6)*.03), s=H*.012, fl=Math.sin(t*2.4)*.25;
    g.save(); g.globalAlpha=.32*a; g.fillStyle=mix(P.wBot,'#000000',.2); g.beginPath(); g.moveTo(x-s*1.4,y); g.quadraticCurveTo(x,y-s*(1.4+fl),x+s*1.6,y); g.quadraticCurveTo(x,y+s*(1.4-fl),x-s*1.4,y); g.fill(); g.lineWidth=1; g.strokeStyle=g.fillStyle; g.beginPath(); g.moveTo(x+s*1.4,y); g.lineTo(x+s*3.4,y+Math.sin(t*2)*s*.3); g.stroke(); g.restore(); }
  // a bait ball: a dark shoal swirling just under the surface, flashing silver as it turns
  { const cx=W*.5+Math.sin(t*.07)*W*.12, cy=hz+H*.26, R=H*.04; for(let i=0,n=gfxHigh()?40:24;i<n;i++){ const a=t*.9+i*.7, r=R*(.4+l3hash(i)*.6), x=cx+Math.cos(a)*r*1.6, y=cy+Math.sin(a)*r*.5, fl=Math.sin(a*2+t*3)>.85; g.fillStyle=fl?v3rgba('#e8f4ff',.7):v3rgba(mix(P.wBot,'#000000',.2),.35); g.fillRect(x,y,2.4,1); } }
});

// ---------------------------------------------------------------------
// MOONLIT TRENCH: low sea mist rolling past the stacks, glowing crests on the swell, a lantern bobbing on the wreck,
// and now and then the shadow of something huge passing beneath
// ---------------------------------------------------------------------
m33wrap('trench','live',function(P,t,hz){ const FX=S.settings.effects, bio=P.bio||'#5af0d8';
  for(let i=0;i<4;i++){ const y=hz+H*(.005+i*.012), x=((i*.37+t*.004*(1+i*.3))%1.6)*W-W*.3, w=W*.5; const fg=g.createRadialGradient(x+w/2,y,0,x+w/2,y,w*.5); fg.addColorStop(0,'rgba(170,210,215,.16)'); fg.addColorStop(1,'rgba(170,210,215,0)'); g.save(); g.translate(0,y); g.scale(1,.1); g.translate(0,-y); g.fillStyle=fg; g.fillRect(x,y-w*.5,w,w); g.restore(); }
  if(FX){ g.fillStyle=v3rgba(bio,.5); for(let i=0,n=gfxHigh()?30:18;i<n;i++){ const y=hz+H*.04+Math.pow((i*.137)%1,1.3)*(H-hz)*.8, u=(y-hz)/(H-hz), x=(((i*97.3)%1000)/1000*W+t*W*.01)%W, a=Math.max(0,Math.sin(t*1.3+i*1.7)); if(a<.3) continue; g.globalAlpha=a*.7; g.fillRect(x,y,W*(.01+u*.02),1.2); } g.globalAlpha=1; }
  { const lx=W*.66, ly=hz-H*.03+Math.sin(t*1.1)*H*.003, p=.7+.3*Math.sin(t*3.1)*Math.sin(t*1.7); v3glow(g,lx,ly,H*.05,'rgba(255,210,140,.9)',.35*p); g.fillStyle='rgba(255,226,170,'+(.6+.3*p)+')'; g.fillRect(lx-1.6,ly-2.4,3.2,4); if(typeof v3lanternReflect==='function') v3lanternReflect(lx,hz+2,.5*p,t,'255,210,140'); }
  { const per=60, q=(t%per)/per; if(q<.25){ const e=q/.25, a=Math.sin(e*Math.PI)*.22, x=W*(1.1-e*1.3), y=hz+H*.3, s=H*.06; g.save(); g.globalAlpha=a; g.fillStyle='#000000'; g.beginPath(); g.ellipse(x,y,s*2.6,s*.5,0,0,7); g.fill(); g.beginPath(); g.moveTo(x+s*2.4,y); g.lineTo(x+s*3.6,y-s*.5); g.lineTo(x+s*3.4,y); g.lineTo(x+s*3.6,y+s*.5); g.closePath(); g.fill(); g.restore(); } }
});

// ---------------------------------------------------------------------
// EMBER SPRINGS: a geyser that hisses, builds and erupts every so often, ash drifting on the warm air,
// and the volcano's glow breathing on the water
// ---------------------------------------------------------------------
m33wrap('ember','live',function(P,t,hz){ const FX=S.settings.effects, lava=P.lava||'#ff7a2a';
  if(FX){ g.fillStyle='rgba(60,50,48,.45)'; for(let i=0,n=gfxHigh()?24:14;i<n;i++){ const x=W*((l3hash(i)+t*.004*(1+i%3))%1), y=(l3hash(i+7)*hz*1.2+t*H*.006*(1+i%2))%(H*.9); g.fillRect(x+Math.sin(t+i)*4,y,1.4,1.4); } }
  { const p=.5+.5*Math.sin(t*.6); g.fillStyle=v3rgba(lava,.05+.04*p); g.fillRect(0,hz,W,H*.25); }
});

// ---------------------------------------------------------------------
// FROSTBITE LAKE: spindrift blowing across the ice, and a seal that pops up in an open lead to look around
// ---------------------------------------------------------------------
m33wrap('frost','live',function(P,t,hz){ const FX=S.settings.effects, night=P.night;
  if(FX){ g.fillStyle=v3rgba(mix(P.snow,'#ffffff',.3),.4); for(let i=0,n=gfxHigh()?40:24;i<n;i++){ const x=W*((l3hash(i)+t*.05*(1+i%4*.3))%1.1)-W*.05, y=hz+H*(.01+l3hash(i+3)*.025)+Math.sin(t*3+i)*1.2; g.fillRect(x,y,3+i%3,1); } }
  { const per=30, q=(t%per)/per; if(q<.3){ const e=q/.3, up=l3s(Math.min(1,e/.2))*l3s(Math.min(1,(1-e)/.2)), x=W*.55, y=hz+H*.2, s=H*.008, sc=mix('#5a6a78',P.wBot,night*.5);
      g.save(); g.beginPath(); g.rect(0,0,W,y); g.clip(); g.fillStyle=sc; g.beginPath(); g.ellipse(x,y+s*2*(1-up),s*1.4,s*2*up+.1,0,0,7); g.fill(); g.fillStyle='#10141a'; g.beginPath(); g.arc(x+s*.6,y-s*1.1*up+s*2*(1-up),s*.25*up,0,7); g.fill(); g.restore();
      g.strokeStyle=v3rgba('#ffffff',.4*up); g.lineWidth=1; g.beginPath(); g.ellipse(x,y+1,s*(2.4+Math.sin(t*2)*.3),s*.6,0,0,7); g.stroke(); } }
});

// ---------------------------------------------------------------------
// Stonebrook, Saltmarsh, Brine Shelf, Midnight Deep, Starfall: a little extra each
// ---------------------------------------------------------------------
// River: foam lines curling round the rocks downstream, and a kingfisher sitting on the mill wheel's post now and then
m33wrap('river','live',function(P,t,hz){ if(!S.settings.effects) return; const foam=mix(P.wTop,'#ffffff',.7); g.strokeStyle=v3rgba(foam,.4); g.lineWidth=1;
  for(const [rx,ry] of [[.43,.21],[.6,.45],[.82,.43]]){ for(let k=0;k<3;k++){ const q=((t*.5+k/3)%1), x=W*rx+q*W*.06, y=hz+H*ry-H*.004+Math.sin(q*6+k)*H*.004; g.globalAlpha=.6*(1-q); g.beginPath(); g.moveTo(x,y); g.lineTo(x+W*.02,y+H*.002); g.stroke(); } } g.globalAlpha=1; });
// Coast: sandpipers running along the tide line under the dunes
m33wrap('coast','live',function(P,t,hz){ if(P.night>.7) return; for(let i=0;i<3;i++){ const x=W*(.62+((t*.02+i*.07)%.3)), run=Math.sin(t*2+i)>0, y=hz-H*.003, s=H*.0035, bc=mix('#8a7a64',P.sandD,.3);
  g.fillStyle=bc; g.beginPath(); g.ellipse(x,y-s*1.4,s*1.4,s*.8,0,0,7); g.fill(); g.beginPath(); g.arc(x+s*1.2,y-s*2,s*.55,0,7); g.fill(); g.strokeStyle='#2a241c'; g.lineWidth=.6; g.beginPath(); g.moveTo(x+s*1.6,y-s*2); g.lineTo(x+s*2.6,y-s*1.8); g.moveTo(x,y-s*.8); g.lineTo(x+(run?Math.sin(t*20+i)*s*.6:0),y); g.stroke(); } });
// Shelf and Deep: sun or moon glitter that breaks up on the swell, plus spray blown off the tallest crests on Deep
m33wrap('deep','live',function(P,t,hz){ if(!S.settings.effects) return; for(let i=0;i<8;i++){ const q=((t*.7+i*.13)%1); if(q>.3) continue; const x=W*l3hash(i+Math.floor(t*.7+i*.13)), y=hz+H*(.06+l3hash(i*3)*.5), e=q/.3; g.fillStyle='rgba(225,235,240,'+(.45*(1-e))+')'; for(let k=0;k<5;k++) g.fillRect(x+e*W*.03+k*3,y-Math.sin(e*Math.PI)*H*.012-k,1.4,1.4); } });
// Starfall: tiny stars twinkling on the lake surface and motes rising from the crystals
m33wrap('starfall','live',function(P,t,hz){ if(!S.settings.effects) return; for(let i=0,n=gfxHigh()?18:10;i<n;i++){ const q=((t*.2+i*.17)%1), x=W*[.3,.33,.78,.82,.9][i%5]+(l3hash(i)-.5)*W*.02, y=hz-H*.02-q*H*.12; g.fillStyle=v3rgba(i%2?(P.cry2||'#8ae8ff'):(P.cry||'#c890ff'),.7*Math.sin(q*Math.PI)); g.fillRect(x,y,1.5,1.5); } });

// =====================================================================
// EMBER SPRINGS, more detail: no flat clouds (they read like an airship); instead feathered ash plumes drift away
// from the crater. The volcano gets ash bands, crags lit on the sun side, a parasitic cone, a cooled lava field with
// glowing seams, lava pulses running down its veins, and the hills get scrub, dead trees and rock outcrops.
// =====================================================================
V3SCENES.ember.noClouds=true;
function embCone(x,hz){ const vx=W*.62, vb=hz+1, vw=W*.26, vh=H*.22, cw=vw*.16, ty=vb-vh; x.beginPath(); x.moveTo(vx-vw,vb); x.quadraticCurveTo(vx-vw*.4,vb-vh*.35,vx-cw,ty); x.lineTo(vx-cw*.4,ty+vh*.03); x.lineTo(vx+cw*.3,ty+vh*.015); x.lineTo(vx+cw,ty); x.quadraticCurveTo(vx+vw*.45,vb-vh*.4,vx+vw,vb); x.closePath(); }
m33wrap('ember','sky',function(P,t,hz){ const vx=W*.62, ty=hz+1-H*.22, night=P.night;
  // ash plumes: long soft streams leaving the crater and drifting downwind, built from overlapping feathered puffs
  for(let s=0;s<3;s++){ for(let i=0;i<14;i++){ const k=((t*.012+i/14+s*.31)%1), x=vx+k*W*(.55+s*.12)-W*.02, y=ty-H*(.05+s*.04)-Math.sqrt(k)*H*(.12+s*.05)+Math.sin(k*5+s+t*.1)*H*.015, r=H*(.025+k*.07)*(1-s*.15), a=(.3-s*.06)*Math.sin(k*Math.PI)*(1-night*.3);
      const gr=g.createRadialGradient(x,y,0,x,y,r); const col=mix(mix('#6a5a58',P.cloud||'#8a7a78',.4),P.lava||'#ff7a2a',night*.12); gr.addColorStop(0,v3rgba(col,a)); gr.addColorStop(1,v3rgba(col,0)); g.fillStyle=gr; g.fillRect(x-r,y-r,r*2,r*2); } } });
m33wrap('ember','land',function(x,P,hz){ const vx=W*.62, vb=hz+1, vw=W*.26, vh=H*.22, cw=vw*.16, ty=vb-vh, r=v3rng(91);
  x.save(); embCone(x,hz); x.clip();
  // ash and lava strata following the slope
  for(let k=1;k<6;k++){ const y=ty+vh*k*.17; x.strokeStyle=v3rgba(k%2?P.rockD:mix(P.rock,'#8a6a5a',.3),.35); x.lineWidth=Math.max(1,H*.003); x.beginPath(); x.moveTo(vx-vw,y+vh*.1); x.quadraticCurveTo(vx,y-vh*.05,vx+vw,y+vh*.12); x.stroke(); }
  // crags: small faceted rocks, lit on the left (sun) and dark on the right
  for(let i=0;i<0;i++){ const u=r(), v=r(), y=ty+vh*(.08+v*.9), half=cw+(vw-cw)*((y-ty)/vh)*.95, X=vx+(u*2-1)*half, s=H*(.003+r()*.006), lit=X<vx; x.fillStyle=v3rgba(lit?mix(P.rock,P.rim,.35):P.rockD,.7); x.beginPath(); x.moveTo(X-s,y); x.lineTo(X-s*.3,y-s*1.2); x.lineTo(X+s*.8,y-s*.5); x.lineTo(X+s,y); x.closePath(); x.fill(); }
  // gullies of loose scree
  x.strokeStyle=v3rgba(mix(P.rockD,'#000000',.2),.5); x.lineWidth=1; for(let k=0;k<12;k++){ const a=-.9+k*.16+(r()-.5)*.05; x.beginPath(); x.moveTo(vx+a*cw,ty+vh*.05); x.bezierCurveTo(vx+a*vw*.25,vb-vh*.6,vx+a*vw*.6+(r()-.5)*W*.01,vb-vh*.3,vx+a*vw*.95,vb); x.stroke(); }
  x.restore();
  // a parasitic cone on the left flank
  { const px=vx-vw*.55, pb=vb, pw=W*.04, ph=H*.045; x.fillStyle=mix(P.rock,P.rockD,.3); x.beginPath(); x.moveTo(px-pw,pb); x.quadraticCurveTo(px-pw*.3,pb-ph*.7,px-pw*.18,pb-ph); x.lineTo(px+pw*.18,pb-ph); x.quadraticCurveTo(px+pw*.3,pb-ph*.7,px+pw,pb); x.closePath(); x.fill(); x.fillStyle=v3rgba(P.rim,.15); x.beginPath(); x.moveTo(px-pw,pb); x.quadraticCurveTo(px-pw*.3,pb-ph*.7,px-pw*.18,pb-ph); x.lineTo(px,pb-ph); x.lineTo(px-pw*.2,pb); x.closePath(); x.fill(); x.fillStyle=mix(P.lava2||'#ffd06a',P.rockD,.4); x.beginPath(); x.ellipse(px,pb-ph,pw*.17,ph*.06,0,0,7); x.fill(); }
  // a cooled lava field spreading from the volcano's right foot into the lake: dark crusted lobes with seams
  { const fx=vx+vw*.35; x.fillStyle=mix(P.rockD,'#000000',.25); x.beginPath(); x.moveTo(fx-W*.06,vb); for(let i=0;i<=10;i++){ const X=fx-W*.06+i*W*.016, Y=vb+H*(.004+Math.abs(Math.sin(i*1.7))*.01); x.lineTo(X,Y); } x.lineTo(fx+W*.1,vb); x.closePath(); x.fill();
    x.strokeStyle=v3rgba(P.lava||'#ff7a2a',.55); x.lineWidth=1; for(let i=0;i<6;i++){ const X=fx-W*.045+i*W*.025; x.beginPath(); x.moveTo(X,vb); x.lineTo(X+W*.006,vb+H*.006); x.lineTo(X+W*.002,vb+H*.011); x.stroke(); } }
  // the far hills: rock outcrops and scraggly scrub along the ridge, a few dead trees
  for(let i=0;i<26;i++){ const X=W*(r()*.32), base=hz-H*(.02+.06*Math.max(0,1-Math.abs(X/W-.12)/.2))*(.7+r()*.3); x.fillStyle=v3rgba(mix(P.rockD,'#1a1410',.3),.6); x.beginPath(); x.arc(X,base,H*(.002+r()*.004),Math.PI,0); x.fill(); }
  for(const [tx,th] of [[.86,.05],[.91,.06],[.97,.045]]){ const X=W*tx, base=hz-H*(.06+.02*Math.sin(tx*30)); x.strokeStyle=mix('#2a1e1a',P.farHaze,.15); x.lineWidth=Math.max(1,H*.002); x.beginPath(); x.moveTo(X,base); x.lineTo(X,base-H*th); x.moveTo(X,base-H*th*.6); x.lineTo(X-H*th*.25,base-H*th*.85); x.moveTo(X,base-H*th*.45); x.lineTo(X+H*th*.22,base-H*th*.7); x.stroke(); }
});
m33wrap('ember','live',function(P,t,hz){ const vx=W*.62, vb=hz+1, vw=W*.26, vh=H*.22, cw=vw*.16, ty=vb-vh, lava=P.lava||'#ff7a2a', lava2=P.lava2||'#ffd06a';
  // pulses of fresh lava running down each vein (same paths as the land's veins)
  g.save(); g.globalCompositeOperation='lighter'; for(const [a,len,sd] of [[-.35,.75,1],[.1,.55,2],[.42,.85,3]]){ const r=v3rng(sd); let X=vx+a*cw, Y=ty+vh*.02; const pts=[[X,Y]]; for(let k=0;k<8;k++){ Y+=vh*len/8; X+=a*vw*.07+(r()-.5)*vw*.04; pts.push([X,Y]); }
    for(let p=0;p<2;p++){ const q=((t*.08+sd*.31+p*.5)%1), f=q*8, i=Math.min(7,Math.floor(f)), u=f-i, px=pts[i][0]+(pts[i+1][0]-pts[i][0])*u, py=pts[i][1]+(pts[i+1][1]-pts[i][1])*u; v3glow(g,px,py,H*.018,v3rgba(lava2,.9),.5*Math.sin(q*Math.PI)); } }
  g.restore();
  // the lava field's seams and the parasitic cone breathe
  const p=.5+.5*Math.sin(t*1.1); v3glow(g,vx+vw*.35,vb+H*.006,W*.06,v3rgba(lava,.8),.12+.08*p);
  if(S.settings.effects){ const px=vx-vw*.55, pyy=vb-H*.045; for(let k=0;k<4;k++){ const q=((t*.12+k/4)%1); g.fillStyle=v3rgba('#e8e0d8',.22*(1-q)); g.beginPath(); g.arc(px+q*W*.012,pyy-q*H*.05,H*(.004+q*.01),0,7); g.fill(); } }
});
