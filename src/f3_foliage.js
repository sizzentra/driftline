
// =====================================================================
// 0.3 foliage: leafy trees, bushes, reeds, flowers and a proper weeping willow.
// Static pieces draw into the land cache; the willow draws live so its curtains sway.
// =====================================================================
// a leafy (deciduous) tree: trunk + forked limbs + a lumpy crown of leaf clusters, shaded dark-to-light toward the sun, rim lit
function v3leafTree(c,x,base,h,P,seed,o={}){ const r=v3rng(seed), leaf=o.leaf||P.leaf, dk=mix(leaf,'#000000',.42), md=mix(leaf,'#000000',.15), lt=mix(leaf,P.leafHi,.35+P.d*.1), wood=mix(P.cabin,'#000000',.25);
  const tw=h*.06, ty=base-h*.42;
  c.fillStyle=wood; c.beginPath(); c.moveTo(x-tw,base); c.quadraticCurveTo(x-tw*.5,base-h*.2,x-tw*.45,ty); c.lineTo(x+tw*.45,ty); c.quadraticCurveTo(x+tw*.5,base-h*.2,x+tw,base); c.closePath(); c.fill();
  c.strokeStyle=wood; c.lineCap='round'; c.lineWidth=Math.max(1,tw*.6); c.beginPath(); c.moveTo(x,ty+h*.05); c.lineTo(x-h*.14,ty-h*.16); c.moveTo(x,ty+h*.04); c.lineTo(x+h*.12,ty-h*.2); c.stroke(); c.lineCap='butt';
  const cx=x, cy=base-h*.66, rx=h*(o.wide||.34), ry=h*.3, blobs=[];
  for(let i=0;i<26;i++){ const a=r()*Math.PI*2, d=Math.sqrt(r()); blobs.push([cx+Math.cos(a)*rx*d, cy+Math.sin(a)*ry*d*.9, h*(.07+r()*.07)]); }
  const pass=(col,dx,dy,k,filter)=>{ c.fillStyle=col; c.beginPath(); for(const [bx,by,br] of blobs){ if(filter&&!filter(bx,by)) continue; c.moveTo(bx+dx+br*k,by+dy); c.arc(bx+dx,by+dy,br*k,0,7); } c.fill(); };
  pass(dk,0,h*.02,1.1); pass(md,h*.01,-h*.01,.95); pass(lt,h*.03,-h*.035,.62,(bx,by)=>bx>cx-rx*.3&&by<cy+ry*.2);
  if(P.d>.05||o.rim){ c.strokeStyle=v3rgba(P.rim,.25+P.d*.4); c.lineWidth=1; c.beginPath(); c.arc(cx+h*.02,cy-h*.02,Math.max(rx,ry)*.95,-Math.PI*.45,-.1); c.stroke(); } }
// a row of rounded shrubs along a shoreline
function v3bushes(c,x0,x1,base,h,P,seed,o={}){ const r=v3rng(seed), leaf=o.leaf||P.leaf, dk=mix(leaf,'#000000',.45), md=mix(leaf,'#000000',.2), lt=mix(leaf,P.leafHi,.3);
  for(const [col,lift,k] of [[dk,0,1],[md,h*.12,.8],[lt,h*.28,.45]]){ const rr=v3rng(seed); c.fillStyle=col; c.beginPath();
    for(let X=x0;X<x1;X+=h*.55){ const bh=h*(.55+rr()*.6), bx=X+rr()*h*.3; if(col===lt&&rr()<.4) continue; c.moveTo(bx+bh*.7*k,base-bh*.45-lift); c.ellipse(bx+(col===lt?h*.12:0),base-bh*.45-lift,bh*.7*k,bh*.5*k,0,0,7); } c.fill(); } }
// reed and grass tufts at the waterline
function v3reeds(c,x0,x1,base,h,col,seed,o={}){ const r=v3rng(seed); c.strokeStyle=col; c.lineCap='round'; c.lineWidth=Math.max(.8,h*.035); c.beginPath();
  for(let X=x0;X<x1;X+=h*(o.gap||.18)){ const n=2+Math.floor(r()*3); for(let k=0;k<n;k++){ const bx=X+r()*h*.2, hh=h*(.45+r()*.6), lean=(r()-.5)*h*.35; c.moveTo(bx,base); c.quadraticCurveTo(bx+lean*.3,base-hh*.6,bx+lean,base-hh); } } c.stroke();
  if(o.heads){ c.fillStyle=o.heads; const r2=v3rng(seed+3); for(let X=x0;X<x1;X+=h*.7){ if(r2()<.5) continue; const bx=X+r2()*h*.3, hh=h*(.8+r2()*.4); c.fillRect(bx-h*.03,base-hh-h*.18,h*.06,h*.2); c.strokeRect&&0; c.beginPath(); c.moveTo(bx,base); c.lineTo(bx,base-hh-h*.1); c.stroke(); } }
  c.lineCap='butt'; }
// little flowers dotted through grass
function v3flowers(c,x0,x1,y0,y1,cols,seed,n){ const r=v3rng(seed); for(let i=0;i<n;i++){ const x=x0+r()*(x1-x0), y=y0+r()*(y1-y0), s=.9+r()*1.1; c.fillStyle=cols[i%cols.length]; c.beginPath(); c.arc(x,y,s,0,7); c.fill(); c.fillStyle='rgba(255,250,220,.8)'; c.fillRect(x-.4,y-.4,.8,.8); } }

// ---------- the weeping willow (pond): a forked trunk, arching limbs, long leafy curtains that sway ----------
const V3WIL={c:[],t:[-9,-9,-9],k:'',turn:0}; const V3WIL_N=3; /* three equal slices of the drawing, in drawing order (tree + first dark strands; ... ; last mid + light strands) */
// 2026-11-18 (director: "Willow Pond still stuttering"): the willow used to be redrawn whole (about 2,500 leaf strokes) every 0.05 s,
// so every third frame was a heavy one: an uneven rhythm phones show as a regular stutter. It is now three cached layers, three equal slices
// of the drawing in its own order, and exactly one is refreshed per frame (each every third frame, the old rhythm), so every frame
// carries the same third of the work. The leaf colours are solid, so slicing changes nothing in the picture.
function v3willow(P,t,hz){ const DP=Math.min(DPR||1,2), bxw=W*.905, x0=bxw-H*.17, y0=hz-H*.25, w=Math.ceil((Math.min(W,bxw+H*.15)-x0)*DP), h=Math.ceil(H*.35*DP), key=W+'|'+H+'|'+P.key; /* the layers cover only where the tree is (measured: .157H left, .135H right, .236H up, .089H down) */
  for(let i=0;i<V3WIL_N;i++){ if(!V3WIL.c[i]) V3WIL.c[i]=document.createElement('canvas'); const C=V3WIL.c[i]; if(C.width!==w||C.height!==h){ C.width=w; C.height=h; V3WIL.k=''; } }
  const paint=i=>{ const c=V3WIL.c[i].getContext('2d'); c.setTransform(1,0,0,1,0,0); c.clearRect(0,0,w,h); c.setTransform(DP,0,0,DP,-x0*DP,-y0*DP); v3willowDraw(c,P,t,hz,i); V3WIL.t[i]=t; };
  if(V3WIL.k!==key){ const fresh=V3WIL.k===""; V3WIL.k=key; if(fresh){ for(let i=0;i<V3WIL_N;i++) paint(i); } else V3WIL.t=V3WIL.t.map(()=>-9); } /* first time or a new size: all at once; a new light level: each slice catches up on its turn (3 frames) */
  else { const i=V3WIL.turn; V3WIL.turn=(i+1)%V3WIL_N; if(Math.abs(t-V3WIL.t[i])>((typeof MOB==='function'&&MOB())?.25:.03)) paint(i); } /* phones (director, 2026-11-19: Willow Pond was the one water that dragged Android down): each slice repaints at most every 0.25 s; the strands sway about 1 px a second, so they move under 0.3 px between repaints (invisible), and the tree costs about an eighth of the work per frame. (A bend of a finished picture instead was tried and rejected: it also slides the trunk.) */
  for(let i=0;i<V3WIL_N;i++) g.drawImage(V3WIL.c[i],x0,y0,w/DP,h/DP); }
function v3willowDraw(c,P,t,hz,part){ /* part: undefined = the whole tree; 0, 1, 2 = a third of it in drawing order (0 includes the trunk, limbs and crown) */
  const ALL=part===undefined, BASE=ALL||part===0;
  const bx=W*.905, by=hz+H*.012, th=H*.1, wood=mix(P.cabin,'#000000',.25), woodL=mix(P.cabin,P.rim,.25), u=H/500;
  const leafD=mix(P.leaf,'#000000',.45), leafM=mix(P.leaf,'#000000',.12), leafL=mix(P.leaf,P.leafHi,.3+P.d*.15);
  const wind=Math.sin(t*.6)*H*.006+Math.sin(t*1.3)*H*.002;
  // reflection first (under everything)
  if(BASE){ c.save(); c.globalAlpha=.14; c.fillStyle=leafM; c.beginPath(); c.ellipse(bx-H*.005,hz+H*.05,H*.12,H*.04,0,0,7); c.fill(); c.restore();
  // trunk: wide flared base, slight lean, bark lines, lit edge
  c.fillStyle=wood; c.beginPath(); c.moveTo(bx-H*.026,by); c.bezierCurveTo(bx-H*.012,by-H*.012,bx-H*.016,by-th*.55,bx-H*.012,by-th); c.lineTo(bx+H*.01,by-th); c.bezierCurveTo(bx+H*.012,by-th*.55,bx+H*.01,by-H*.014,bx+H*.028,by); c.closePath(); c.fill();
  c.strokeStyle=mix(wood,'#000000',.3); c.lineWidth=Math.max(.7,u*.8); c.beginPath(); for(const dx of [-.006,.002]){ c.moveTo(bx+H*dx,by-H*.01); c.quadraticCurveTo(bx+H*(dx-.003),by-th*.5,bx+H*dx,by-th*.95); } c.stroke();
  c.strokeStyle=v3rgba(P.rim,.25+P.d*.45); c.lineWidth=1; c.beginPath(); c.moveTo(bx+H*.026,by); c.bezierCurveTo(bx+H*.01,by-H*.014,bx+H*.011,by-th*.55,bx+H*.009,by-th); c.stroke();
  }
  // limbs arching out from the fork
  const limbs=[[-.11,-.07],[-.06,-.11],[.0,-.125],[.06,-.105],[.1,-.06]], fork={x:bx,y:by-th}, tips=[];
  c.strokeStyle=wood; c.lineCap='round';
  limbs.forEach(([dx,dy],i)=>{ const tx=bx+H*dx+wind*.4, ty=by-th+H*dy, mx=bx+H*dx*.35, my=by-th+H*dy*1.05; if(BASE){ c.lineWidth=Math.max(1.2,H*(.009-Math.abs(dx)*.03)); c.beginPath(); c.moveTo(fork.x,fork.y); c.quadraticCurveTo(mx,my,tx,ty); c.stroke(); } tips.push([fork.x,fork.y,mx,my,tx,ty]); });
  // crown tufts along the limbs (irregular top, not a dome)
  const r=v3rng(53), tuft=(col,k,lift)=>{ c.fillStyle=col; c.beginPath(); for(const [x0,y0,mx,my,x1,y1] of tips){ for(let s=.25;s<=1;s+=.15){ const m=1-s, px=m*m*x0+2*m*s*mx+s*s*x1, py=m*m*y0+2*m*s*my+s*s*y1, rr=H*(.014+r()*.012)*k; c.moveTo(px+rr*.8,py-lift); c.ellipse(px+(r()-.5)*H*.01,py-lift+rr*.4,rr*.8,rr*1.25,0,0,7); } } c.fill(); };
  if(BASE){ tuft(leafD,.75,0); tuft(leafM,.6,H*.004); tuft(leafL,.38,H*.008); }
  // curtains: strands hanging from points along every limb, falling almost to the water, leaves as short slanted dabs
  const fr=v3rng(61), strands=[];
  tips.forEach(([x0,y0,mx,my,x1,y1],li)=>{ for(let s=.12;s<=1.04;s+=.032){ const m=1-s, px=m*m*x0+2*m*s*mx+s*s*x1, py=m*m*y0+2*m*s*my+s*s*y1, outer=Math.abs(px-bx)/(H*.12);
      const len=(by+H*.008-py)*(.7+outer*.22+fr()*.12), ph=fr()*6.28, dir=limbs[li][0]<0?-1:limbs[li][0]>0?1:(((s*100)|0)%2?1:-1); strands.push({px,py,len,ph,dir,out:.4+outer*.8,layer:fr()<.4?0:fr()<.66?1:2,sw:(.5+outer)}); } });
  // strands in drawing order (all dark, then mid, then light), cut into three equal slices; slice 0 starts a little later because it also has the tree
  const nL=[0,0,0]; for(const S2 of strands) nL[S2.layer]++; const off=[0,nL[0],nL[0]+nL[1]], NS=strands.length, cut=[0,Math.round(NS*.3),Math.round(NS*.65),NS];
  const leafPass=(layer,col,lw)=>{ c.strokeStyle=col; c.lineWidth=lw; c.beginPath(); let si=-1; const lo=ALL?0:cut[part], hi=ALL?NS:cut[part+1]; if(off[layer]+nL[layer]<=lo||off[layer]>=hi) return;
    for(const S2 of strands){ if(S2.layer!==layer) continue; si++; const gi=off[layer]+si; if(gi<lo||gi>=hi) continue; const sw=(wind+Math.sin(t*1.1+S2.ph)*H*.003)*S2.sw;
      for(let k=0;k<=1;k+=.06){ const arc=Math.sin(Math.min(1,k*2.6)*Math.PI/2), y=S2.py-Math.sin(Math.min(1,k*3)*Math.PI)*H*.008+S2.len*Math.pow(k,1.25), x=S2.px+S2.dir*S2.out*arc*H*.02+sw*k*k+Math.sin(k*3+S2.ph)*H*.0022, ll=u*(3.8-k*1.5), side=((k*100|0)%2)?1:-1; c.moveTo(x,y); c.lineTo(x+side*ll*.45,y+ll); } }
    c.stroke(); };
  c.lineCap='round'; leafPass(0,leafD,Math.max(1.3,u*2.1)); leafPass(1,leafM,Math.max(1.2,u*1.9)); leafPass(2,leafL,Math.max(1,u*1.6)); c.lineCap='butt';
  // rim light on the sunward tufts at dusk
  if(BASE&&P.d>.05){ c.fillStyle=v3rgba(P.rim,.25*P.d); c.beginPath(); for(const [,, ,,x1,y1] of tips){ if(x1<bx) continue; c.moveTo(x1+H*.012,y1-H*.01); c.arc(x1,y1-H*.01,H*.012,0,7); } c.fill(); }
}
