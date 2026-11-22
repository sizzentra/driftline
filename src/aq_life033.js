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
/* the float's wake and the wind gusts: each water file adds them at its place in the drawing order (src/w_<id>.js) */
function l3wakeLayer(id){ m33wrap(id,'live',function(P,t,hz){ l3wake(P,t); }); }
function l3gustLayer(id){ m33wrap(id,'live',function(P,t,hz){ if(S.settings.effects) l3gust(P,t,hz,id.length,id==='frost'?.7:1); }); } /* pond, river, frost, ember, starfall, trench */

// ---------------------------------------------------------------------
// WILLOW POND: a frog that hops between lily pads, a deer that comes down to drink at the far shore, willow leaves
// drifting down and settling on the water, and dandelion seeds floating through the sunlight
// ---------------------------------------------------------------------
L3.pads=[[.5,.78],[.57,.84],[.66,.72],[.86,.9]];

// ---------------------------------------------------------------------
// CORAL REEF: surf breaking on the outer reef, a seabird that folds and plunges for fish, a ray gliding over the sand,
// and a dark shoal turning together under the surface
// ---------------------------------------------------------------------

// ---------------------------------------------------------------------
// MOONLIT TRENCH: low sea mist rolling past the stacks, glowing crests on the swell, a lantern bobbing on the wreck,
// and now and then the shadow of something huge passing beneath
// ---------------------------------------------------------------------

// ---------------------------------------------------------------------
// EMBER SPRINGS: a geyser that hisses, builds and erupts every so often, ash drifting on the warm air,
// and the volcano's glow breathing on the water
// ---------------------------------------------------------------------

// ---------------------------------------------------------------------
// FROSTBITE LAKE: spindrift blowing across the ice, and a seal that pops up in an open lead to look around
// ---------------------------------------------------------------------

// ---------------------------------------------------------------------
// Stonebrook, Saltmarsh, Brine Shelf, Midnight Deep, Starfall: a little extra each
// ---------------------------------------------------------------------
// River: foam lines curling round the rocks downstream, and a kingfisher sitting on the mill wheel's post now and then
// Coast: sandpipers running along the tide line under the dunes
// Shelf and Deep: sun or moon glitter that breaks up on the swell, plus spray blown off the tallest crests on Deep
// Starfall: tiny stars twinkling on the lake surface and motes rising from the crystals

// =====================================================================
// EMBER SPRINGS, more detail: no flat clouds (they read like an airship); instead feathered ash plumes drift away
// from the crater. The volcano gets ash bands, crags lit on the sun side, a parasitic cone, a cooled lava field with
// glowing seams, lava pulses running down its veins, and the hills get scrub, dead trees and rock outcrops.
// =====================================================================
function embCone(x,hz){ const vx=W*.62, vb=hz+1, vw=W*.26, vh=H*.22, cw=vw*.16, ty=vb-vh; x.beginPath(); x.moveTo(vx-vw,vb); x.quadraticCurveTo(vx-vw*.4,vb-vh*.35,vx-cw,ty); x.lineTo(vx-cw*.4,ty+vh*.03); x.lineTo(vx+cw*.3,ty+vh*.015); x.lineTo(vx+cw,ty); x.quadraticCurveTo(vx+vw*.45,vb-vh*.4,vx+vw,vb); x.closePath(); }
