// =====================================================================
// 0.4.9 hair and body shapes, rebuilt (director, 2026-11-19: "Hair and body shape/design has been a huge problem for you ... figure out
// why it hasn't been working").
// Why it failed (from this project's history and how character artists work):
//  - Hair was drawn as thin shapes hugging the skull: about half a unit of thickness over a 7.5-unit head. Real (and good stylised) hair is
//    a VOLUME that sits above the skull, with a hairline and parting that frame the face; ours read as painted-on caps and helmets.
//  - Every style was a separate hand-placed polygon with its own magic numbers, patched later in other files (hat fitting, curls, spikes),
//    so styles never shared proportions and each fix broke another.
//  - Body builds only stretched one torso ±20% sideways, which disappears in a silhouette: a build must be readable as a solid shape.
// The fix:
//  - One parametric hair system for every style: an outline around the skull with volume (most at the crown, less at the hairline and
//    nape), a hairline at the temple, a back length (ear, nape, jaw, shoulder, mid-back), an optional fringe, side swoop or spikes, curl
//    lobes, and extras (bun, ponytail, top knot, braid, mohawk). Shading is shared: lit crown, darker underside, a sheen band, a few
//    strand lines that follow the flow. Long back hair is drawn behind the body, the rest on the head.
//  - Builds change the side profile itself: chest, upper back, waist, seat and belly (plus limb weight), and female anglers get a waist
//    and hips, so each build reads as its own silhouette.
// Head space: skull centre (0,-56), radius 7.5, face toward +x, eye (4.4,-57), ear (-1.8,-55.4). Under a hat everything above y -63.9 is
// clipped by the caller and extras above the brim are skipped.
// =====================================================================
var A3SHAPE0={bk:0,wa:0,se:0,ch:0}, A3SHAPE=A3SHAPE0;
const A3_SHAPES={average:[1,1,1,0,{bk:0,wa:0,se:0,ch:0}], slim:[.8,1.04,.8,0,{bk:-.3,wa:.5,se:-.3,ch:-.4}], athletic:[1.1,1,1.12,0,{bk:.5,wa:.9,se:.4,ch:1.1}],
  broad:[1.28,1,1.25,0,{bk:1,wa:0,se:.3,ch:1.2}], sturdy:[1.2,.94,1.18,1.5,{bk:.6,wa:-.6,se:.8,ch:.4}], tall:[.95,1.15,.95,0,{bk:0,wa:.3,se:0,ch:.2}], petite:[.86,.86,.86,0,{bk:-.2,wa:.4,se:.1,ch:-.2}]};
for(const b of BUILDS){ const v=A3_SHAPES[b[0]]; if(v) Object.assign(b[2],{w:v[0],l:v[1],lw:v[2],belly:v[3],shape:v[4]}); }
const A3_SHAPE_F=new Map();
function a3Shape(B,f){ const s=B.shape||A3SHAPE0; if(!f) return s; let o=A3_SHAPE_F.get(s); if(!o){ o={bk:s.bk-.2,wa:s.wa+.7,se:s.se+.6,ch:s.ch}; A3_SHAPE_F.set(s,o); } return o; }
// ---------- hair ----------
// vol: thickness above the skull at the crown; front: 'none' | 'fringe' | 'side' | 'spikes' | 'quiff'; back: y where the back hair ends
// (-52 nape, -50 jaw, -46 shoulder, -40 mid-back); bw: thickness of hanging back hair; curl: lobed edge; ear: hair covers the ear;
// cap: 'shave' (sides shaved, only a top strip), 'thin' (a buzz); x: extra ('bun','pony','knot','braid','mohawk')
const HAIR_P={
  short:{vol:1.1,front:'quiff',back:-52.5}, buzz:{vol:.25,front:'none',back:-53,cap:'thin'}, long:{vol:1.2,front:'side',back:-40,bw:3.2},
  ponytail:{vol:.8,front:'none',back:-53,x:'pony'}, bun:{vol:.8,front:'none',back:-53,x:'bun'}, curly:{vol:2.4,front:'fringe',back:-51,curl:1,ear:1},
  coils:{vol:2.4,front:'fringe',back:-51,curl:1,ear:1}, spiky:{vol:1.3,front:'spikes',back:-52.5}, bald:null,
  sidepart:{vol:1.4,front:'side',back:-52.5}, bob:{vol:1.5,front:'fringe',back:-50.2,bw:2.4,ear:1}, pixie:{vol:.9,front:'fringe',back:-53},
  wavy:{vol:1.7,front:'side',back:-42,bw:3.6,wave:1}, braid:{vol:.8,front:'none',back:-53,x:'braid'}, topknot:{vol:.6,front:'none',back:-53,x:'knot'},
  mullet:{vol:1,front:'quiff',back:-46,bw:2}, undercut:{vol:2,front:'quiff',back:-55,cap:'shave'}, mohawk:{vol:0,front:'none',back:-55,cap:'shave',x:'mohawk'},
  afro:{vol:4.4,front:'fringe',back:-50.5,curl:1.6,ear:1}
};
const HC={x:0,y:-56,r:7.5};
// volume around the skull by angle (0 = front, -π/2 = top, ±π = back): most at the crown, less at the hairline and nape
function hairVolAt(a){ const d=Math.abs(a-(-1.85)); return Math.max(.2,1-Math.pow(d/2.2,2)); }
function hairOutline(P){ const pts=[], a0=-.62, a1=-Math.PI-.95; /* from the hairline over the top to the nape */
  for(let i=0;i<=26;i++){ const a=a0+(a1-a0)*i/26; let r=HC.r+P.vol*hairVolAt(a); if(P.curl) r+=P.curl*.55*Math.max(0,Math.sin(i*1.6))*hairVolAt(a); pts.push([HC.x+Math.cos(a)*r,HC.y+Math.sin(a)*r]); }
  return pts; }
function hairShade(c,hairC,D,top,bot){ const g2=c.createLinearGradient(-3,top,3,bot); g2.addColorStop(0,D(mix(hairC,'#ffffff',.3))); g2.addColorStop(.4,D(hairC)); g2.addColorStop(1,D(mix(hairC,'#000000',.38))); return g2; }
drawHair3=(function(_old){ return function(c,hs,hair,hairC,D,t){ const P=HAIR_P[hs]===undefined?HAIR_P.short:HAIR_P[hs]; /* an unknown style draws as short hair */ if(P===null){ c.fillStyle='rgba(255,255,255,.22)'; c.beginPath(); c.ellipse(2,-61.4,2.6,1.1,-.3,0,7); c.fill(); return; }
  const dk=D(mix(hairC,'#000000',.32)), lt=D(mix(hairC,'#ffffff',.32)), fill=hairShade(c,hairC,D,-66,-48);
  // shaved sides: a soft short layer over the whole cap
  if(P.cap==='shave'||P.cap==='thin'){ c.save(); c.globalAlpha*=P.cap==='thin'?.85:.45; c.fillStyle=D(hairC); c.beginPath(); c.arc(HC.x,HC.y,HC.r+.25,-.62,-Math.PI-.95,true); c.lineTo(-3.4,-53.6); c.lineTo(-1.2,-58.4); c.lineTo(3.2,-60.2); c.closePath(); c.fill(); c.restore(); if(P.cap==='thin') return; }
  // the main mass: outline over the top and back, then in along the nape, behind the ear (or over it) and along the temple to the hairline
  const O=P.cap==='shave'?hairOutline(P).slice(0,14):hairOutline(P), last=O[O.length-1];
  c.fillStyle=fill; c.beginPath(); c.moveTo(O[0][0],O[0][1]); for(const p of O) c.lineTo(p[0],p[1]);
  if(P.cap==='shave'){ c.lineTo(-5,-60.8); c.quadraticCurveTo(0,-62.6,4.2,-61.2); }
  else { const by=Math.max(P.back,last[1]); c.lineTo(Math.min(last[0],-6.8),by); if(P.ear){ c.quadraticCurveTo(-4,by+.6,.4,Math.max(by,-51)); c.quadraticCurveTo(1.2,-55,2.6,-58.8); } else { c.quadraticCurveTo(-4.6,by,-3.6,-53.4); c.quadraticCurveTo(-3.2,-57.4,-1.2,-58.6); c.lineTo(2.6,-59.6); } }
  c.lineTo(4.6,-60.6); c.closePath(); c.fill();
  // the front: a quiff lifts at the hairline, a fringe falls to the brows, a side part sweeps across, spikes break the outline
  c.fillStyle=fill;
  if(P.front==='quiff'){ c.beginPath(); c.moveTo(1.4,-63.4-P.vol*.3); c.quadraticCurveTo(5.4,-64.2-P.vol*.25,6.7,-61.4); c.quadraticCurveTo(5.6,-60.7,4.2,-60.8); c.lineTo(1.8,-61.4); c.closePath(); c.fill(); }
  else if(P.front==='fringe'){ c.beginPath(); c.moveTo(0,-64-P.vol*.3); c.quadraticCurveTo(6.6,-64.2-P.vol*.2,7.5+P.vol*.25,-60); c.lineTo(6.6,-59.6); c.lineTo(6,-60.4); c.lineTo(5.2,-59.4); c.lineTo(4.4,-60.2); c.lineTo(3.4,-59.6); c.lineTo(2.4,-61); c.closePath(); c.fill(); }
  else if(P.front==='side'){ c.beginPath(); c.moveTo(-3,-64-P.vol*.5); c.bezierCurveTo(2.6,-66.4-P.vol*.3,7.4,-64.4,8.1,-60.4); c.quadraticCurveTo(7,-59.2,5.6,-59.9); c.quadraticCurveTo(3.4,-62.2,-.6,-62.4); c.closePath(); c.fill();
    c.strokeStyle=dk; c.lineWidth=.32; c.beginPath(); c.moveTo(-2.2,-63.8-P.vol*.4); c.quadraticCurveTo(3.4,-64.8,7.2,-60.8); c.stroke(); }
  else if(P.front==='spikes'&&!A3HATON){ for(let i=0;i<6;i++){ const a=-.75-i*.42, r0=HC.r+P.vol*hairVolAt(a)*.8, r1=r0+2.6+(i%2)*1.2; c.beginPath(); c.moveTo(Math.cos(a-.2)*r0,HC.y+Math.sin(a-.2)*r0); c.lineTo(Math.cos(a+.08)*r1,HC.y+Math.sin(a+.08)*r1); c.lineTo(Math.cos(a+.28)*r0,HC.y+Math.sin(a+.28)*r0); c.closePath(); c.fill(); } }
  // shared finish: a sheen band across the crown and strand lines that follow the flow back and down
  c.save(); c.globalAlpha*=.4; c.strokeStyle=lt; c.lineWidth=.7; c.beginPath(); c.arc(HC.x,HC.y,HC.r+P.vol*.55,-2.35,-1.15); c.stroke(); c.restore();
  c.strokeStyle=v3rgba(dk,.55); c.lineWidth=.28; for(let i=0;i<3;i++){ const a=-1.1-i*.42, r=HC.r+P.vol*.5; c.beginPath(); c.moveTo(Math.cos(a)*r*.92,HC.y+Math.sin(a)*r*.92); c.quadraticCurveTo(Math.cos(a-.5)*(r+.4),HC.y+Math.sin(a-.5)*(r+.4),Math.cos(a-1)*r*.95,HC.y+Math.sin(a-1)*r*.95); c.stroke(); }
  if(P.curl){ c.fillStyle=fill; for(let i=0;i<O.length;i+=2){ const p=O[i], a=Math.atan2(p[1]-HC.y,p[0]-HC.x); if(p[1]>-50.5) continue; c.beginPath(); c.arc(p[0]-Math.cos(a)*.4,p[1]-Math.sin(a)*.4,.9+P.curl*.9*hairVolAt(a),0,7); c.fill(); } /* a cloud of curls along the edge */
    c.strokeStyle=v3rgba(dk,.5); c.lineWidth=.3; for(let i=0;i<9;i++){ const a=-.8-i*.32, r=HC.r+P.vol*hairVolAt(a)*.6; c.beginPath(); c.arc(Math.cos(a)*r,HC.y+Math.sin(a)*r,.9,0,5); c.stroke(); } }
  // extras on top of the head (hidden under a hat)
  if(!A3HATON){
    if(P.x==='bun'){ c.fillStyle=fill; c.beginPath(); c.arc(-3.4,-65.4,3.4,0,7); c.fill(); c.strokeStyle=dk; c.lineWidth=.35; c.beginPath(); c.arc(-3.4,-65.4,2,.4,3.4); c.stroke(); }
    if(P.x==='knot'){ c.fillStyle=fill; c.beginPath(); c.arc(-1.2,-64.9,2.4,0,7); c.fill(); c.fillStyle=dk; c.fillRect(-2.6,-63,2.8,.6); }
    if(P.x==='mohawk'){ c.fillStyle=fill; c.beginPath(); const a0=-2.4, a1=-1.05; c.moveTo(Math.cos(a0)*7.6,HC.y+Math.sin(a0)*7.6); for(let i=0;i<=8;i++){ const a=a0+(a1-a0)*i/8, R=7.6+(i%2?1.4:3.6); c.lineTo(Math.cos(a)*R,HC.y+Math.sin(a)*R); } c.lineTo(Math.cos(a1)*7.6,HC.y+Math.sin(a1)*7.6); c.closePath(); c.fill(); } }
}; })(drawHair3);
// the back layer (behind the body): long and wavy hair, the bob's back, a mullet, ponytail, braid
function hairBack3(c,hs,hairF,hairC,D,t,lean,live){ const P=HAIR_P[hs]; if(!P) return false; const sw=Math.sin(t*1.3)*.25+(live?-lean*2:0), fill=hairShade(c,hairC,D,-62,P.back), dk=D(mix(hairC,'#000000',.34));
  if(P.bw&&P.back>-55){ const bw=P.bw; c.fillStyle=fill; c.beginPath(); c.moveTo(-5.4,-62.6); c.bezierCurveTo(-8.6-bw*.3,-61,-9.2-bw*.35,-56,-8.6-bw*.3,-51);
    if(P.wave){ for(let y=-51;y<P.back;y+=2.2){ const k=Math.sin(y*1.4+t)*.7; c.lineTo(-8.6-bw*.3+k+sw*(y+51)/(P.back+51||1),y); } } else c.bezierCurveTo(-8.4-bw*.3,-48,-8.8-bw*.2+sw,P.back+3,-8.2+sw,P.back);
    for(let i=0;i<4;i++) c.lineTo(-8.2+sw+i*(bw*.6),P.back+(i%2?-.8:.3)); c.bezierCurveTo(-5+sw*.5,P.back+4,-4.4,-48,-3.4,-53); c.lineTo(-3,-60); c.closePath(); c.fill();
    c.strokeStyle=v3rgba(dk,.6); c.lineWidth=.35; for(let i=0;i<3;i++){ c.beginPath(); c.moveTo(-6-i*.8,-58); c.quadraticCurveTo(-7.6-i*.6,(P.back-58)/2,-7+sw-i*.5+i*bw*.4,P.back+.5); c.stroke(); } }
  if(P.x==='pony'){ const s2=Math.sin(t*1.6)*.12+(live?-lean*.8:0); c.save(); c.translate(-7.4,-60); c.rotate(.45+s2);  c.fillStyle=fill; c.beginPath(); c.moveTo(0,-.6); c.quadraticCurveTo(3.4,4,1.6,11); c.quadraticCurveTo(.2,13,-1.2,11.4); c.quadraticCurveTo(-1.6,5,0,-.6); c.fill(); c.fillStyle=D('#c8553a'); c.fillRect(-.9,-.4,2.2,1.1); c.restore(); }
  if(P.x==='braid'){ c.fillStyle=fill; for(let i=0;i<8;i++){ const y=-55+i*2, x=-7-i*.2+(i%2?.4:-.4)+sw*i*.08; c.beginPath(); c.ellipse(x,y,1.15-i*.04,1.25,i%2?.45:-.45,0,7); c.fill(); c.strokeStyle=v3rgba(dk,.7); c.lineWidth=.25; c.stroke(); } c.fillStyle=D('#c8553a'); c.beginPath(); c.arc(-8.6+sw*.6,-39.6,.6,0,7); c.fill(); }
  return true; }
// the Natural face keeps every nose smaller and closer to the face (the Classic face keeps the old big noses)
var A3NAT=false;
{ const _n=a3Nose; a3Nose=function(c,id,sk,skD){ if(!A3NAT) return _n.apply(this,arguments); c.save(); c.translate(6.9,-55.6); c.scale(.72,.8); c.translate(-6.9,55.6); const r=_n.apply(this,arguments); c.restore(); return r; }; }
