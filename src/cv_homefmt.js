// =====================================================================
// The home format (docs/HOME_STANDARD.md, decided with the director 2026-11-21). Pilot: Willow Pond.
// Every format home has the same footprint, standing surface, light spot, seat spot and pet spots; the player changes 6 features
// (the light and the seat always, plus 4 that fit the home), each with 3 styles, all coloured from ONE list of 16+ colours per home
// (director, 2026-11-21: so parts can match), all free. Every home's design: docs/HOME_DESIGNS.md.
// Performance: the still home is painted once into a stored picture and pasted every frame; it is repainted only when a choice,
// the screen size or the light of the day (in small steps) changes. Drawn live each frame: the light's glow, its pool and its
// reflection, the ripples at the supports, and the bob of floating homes (the stored picture pasted a little higher or lower).
// Choices are saved per water in S.dock.el ({element id: [style, color]}), carried by dockCopy like the rest of the home.
// Waters without a format home keep the older home system until they are converted.
// =====================================================================
const HOMEF={};
/* the format, in the scene's own units (W, H): the same for every format home */
const HF = { pw:()=>W*.19, x0:()=>-4 /* the deck starts at the left edge (no bank: director, 2026-11-21) */, dockY:()=>H*.6, wl:dockY=>dockY+H*.075, top:dockY=>dockY-H*.25, lightX:()=>W*.19-W*.012,
  seatX:()=>W*.064 /* the seat: behind the angler (who stands at W*.12), under the canopy; resting sits the angler in it */, sc:()=>clamp(H/420,.7,1.25) /* the angler's scale */ };
const hfSpec = id => HOMEF[id]||null;
function hfChoice(id,el){ const sp=hfSpec(id), e=sp&&sp.els.find(x=>x.id===el); if(!e) return [0,0]; const c=S.dock&&S.dock.el&&S.dock.el[el];
  return [Array.isArray(c)&&c[0]>=0&&c[0]<e.styles.length?c[0]|0:(e.def?e.def[0]:0), Array.isArray(c)&&c[1]>=0&&c[1]<sp.colors.length?c[1]|0:(e.def?e.def[1]:0)]; }
function hfColor(id,el){ const sp=hfSpec(id); return sp.colors[hfChoice(id,el)[1]][1]; }
/* the light's glow colour: the chosen colour, lifted toward white so even a deep shade still reads as light */
function hfGlow(id){ const sp=hfSpec(id), e=sp&&sp.els.find(x=>x.light||x.id==='light'); const v=hex2rgb(mix(hfColor(id,e?e.id:'light'),'#ffffff',.3)); return v.join(','); } /* the feature that carries the home's light (batch 5: not always called "light") */
function hfStyle(id,el){ return hfChoice(id,el)[0]; }
/* the saved choices of one home: only valid numbers survive (dockCopy) */
function hfClean(o){ const r={}; if(o&&typeof o==='object'&&!Array.isArray(o)) for(const k in o){ const v=o[k]; if(Array.isArray(v)&&v.length===2&&v.every(n=>Number.isInteger(n)&&n>=0&&n<32)) r[k]=[v[0],v[1]]; } return r; }

/* ---------- the stored picture ---------- */
const HF_CACHE={}; let HF_LAST=null; /* HF_LAST: where the scene last drew the angler, rod and pets on a format home (for the close-up) */
/* d: pixels per scene unit (the scene's own, or the close-up's); slot: a separate stored picture for the close-up */
function hfPaintCache(L,P,night,dockY,dIn,slot){ const sp=hfSpec(L.id), d=dIn||Math.max(1,(typeof cv!=='undefined'&&cv&&W>0)?cv.width/W:1), id=L.id+(slot||'');
  const x0=-4, y0=HF.top(dockY), x1=HF.pw()*1.14, y1=H /* down to the bottom of the screen: the supports fade into the water all the way (director) */, key=[L.id,W,H,d,Math.round(night*24),P.rim,...sp.els.map(e=>hfChoice(L.id,e.id).join('.'))].join('|');
  let c=HF_CACHE[id]; if(c&&c.key===key) return c;
  if(!c){ c={cv:document.createElement('canvas')}; HF_CACHE[id]=c; } c.key=key; c.x=x0; c.y=y0; c.w=x1-x0; c.h=y1-y0;
  c.cv.width=Math.max(1,Math.ceil(c.w*d)); c.cv.height=Math.max(1,Math.ceil(c.h*d)); const x=c.cv.getContext('2d'); x.setTransform(d,0,0,d,-x0*d,-y0*d); x.clearRect(x0,y0,c.w,c.h);
  const N=col=>mix(col,'#0a1020',night*.55), ctx={x,P,night,dockY,N,id:L.id,pw:HF.pw(),wl:HF.wl(dockY),posts:[]};
  sp.paint(ctx); c.posts=ctx.posts; c.lights=ctx.lights||[]; return c; }
/* the water flowing past each support (director, 2026-11-21: subtle, like water going by, not rings that grow and shrink): a faint
   contact line where the support meets the water, and two short ripples drifting away downstream and fading. Drawn BEFORE the home,
   so the support covers the start of each line. */
function hfRings(x,c,t,night,dockY){ const wl=HF.wl(dockY), a0=.26-night*.1; x.lineWidth=1;
  for(const p of c.posts){ x.strokeStyle='rgba(255,255,255,'+a0+')'; x.beginPath(); x.moveTo(p.x-p.w*.62,wl); x.lineTo(p.x+p.w*.62,wl); x.stroke();
    for(let k=0;k<2;k++){ const u=((t*.32+k*.5+p.x*.0137)%1+1)%1, dx=p.w*.55+u*H*.045, len=H*(.012+.01*u), y=wl+H*(.002+.003*u);
      x.strokeStyle='rgba(255,255,255,'+(a0*(1-u)*.9)+')'; x.beginPath(); x.moveTo(p.x+dx,y); x.quadraticCurveTo(p.x+dx+len*.5,y+H*.0015,p.x+dx+len,y); x.stroke(); } } }
/* the light: glow and hot centre on any canvas; on the scene also its pool on the deck and its reflection; a firefly jar has its fireflies */
function hfLights(x,L,c,t,night,dockY,b,P,scene){ const lit=clamp(night*1.2+P.d*.9,0,1), rgb=hfGlow(L.id);
  for(const l of c.lights){ const fl=.93+.07*Math.sin(t*7.1+l.x)*Math.sin(t*3.3+l.y);
    if(lit>.05){ v3glow(x,l.x,l.y+b,H*(l.r||.2),'rgba('+rgb+',.85)',lit*(l.a||.6)*fl); if(scene&&!l.small){ v3lightPool(l.x-W*.01,dockY-1+b,W*.075,rgb,.28*lit); v3lanternReflect(l.x,HF.wl(dockY),lit,t,rgb); } }
    if(l.jar){ for(let i=0;i<3;i++){ const a=t*(1.1+i*.37)+i*2.1; x.fillStyle='rgba('+rgb+','+(.35+.55*lit)*(.6+.4*Math.sin(t*5+i))+')'; x.beginPath(); x.arc(l.x+Math.cos(a)*H*.004,l.y+b+Math.sin(a*1.3)*H*.006,Math.max(.8,H*.0016),0,7); x.fill(); } }
    else { x.fillStyle=lit>.05?'rgba(255,240,205,'+(.55+lit*.45)+')':(l.glass||'rgba(200,210,220,.55)'); x.beginPath(); x.arc(l.x,l.y+b,(l.small?H*.004:H*.007),0,7); x.fill(); } } }
/* drawn every frame on the water: rings, the stored picture (with the bob), the light */
function hfDraw(L,t,night,dockY,pb,P){ const sp=hfSpec(L.id), c=hfPaintCache(L,P,night,dockY), b=sp.floats?(pb||0):0;
  hfRings(g,c,t,night,dockY); g.drawImage(c.cv,c.x,c.y+b,c.w,c.h); hfLights(g,L,c,t,night,dockY,b,P,true); }
/* the Home close-up, drawn at its own size (director, 2026-11-21: the stretched scene made the angler blurry): a soft copy of the
   water behind, then the home from a stored picture at close-up resolution, the light, the angler with the rod, and the pets, all sharp */
function hfCloseup(c,f){ const L=LOCS[locIdx(S.loc)], P=v3palette.v, A=HF_LAST; if(!P||!A) return false; const x=c.getContext('2d'), d=cv.width/W, k=c.width/f.sw, dockY=HF.dockY(), night=A.night, t=performance.now()/1000;
  x.setTransform(1,0,0,1,0,0); x.imageSmoothingEnabled=true; x.imageSmoothingQuality='low'; x.drawImage(cv,f.sx*d,f.sy*d,f.sw*d,f.sh*d,0,0,c.width,c.height);
  x.setTransform(k,0,0,k,-f.sx*k,-f.sy*k); const hc=hfPaintCache(L,P,night,dockY,k,':close'); hfRings(x,hc,t,night,dockY); x.drawImage(hc.cv,hc.x,hc.y,hc.w,hc.h); hfLights(x,L,hc,t,night,dockY,0,P,false);
  try{ const hp=drawAngler(x,A.ax,A.ay,A.sc,S.look,{night:night*.8,hx:A.hx,hy:A.hy,t:A.t,rodA:A.rodA,sit:A.sit,rim:A.rim,glow:A.glow}); const hand=hp&&hp.x!=null?{x:hp.x,y:hp.y}:{x:A.ax+A.hx*A.sc,y:A.ay+A.hy*A.sc};
    if(V3ON){ v3Rod(x,hand,{x:A.tx,y:A.ty},(hand.x+A.tx)/2,(hand.y+A.ty)/2-6+A.ten*.08,ROD_I[S.rods.eq],night,t,false); if(hp&&hp.fingers) hp.fingers(); }
    drawPetScene(A.pax,A.pay,A.sc,A.t,night,x); }catch(e){}
  x.setTransform(1,0,0,1,0,0); return true; }

/* ---------- shared pieces for format homes (draw into the stored picture) ---------- */
/* a support standing IN the water, from the deck's underside: full color above the water line, then darker, fading into the water
   (its ripple ring is drawn live, behind it) */
function hfPost(o,px,w,col,kind,top){ const {x,N,P,wl}=o, wc=P.wMid||'#3a6a7a'; let c=N(col);
  if(kind==='stone'){ const sc=mix('#8a8a82',col,.3), rows=Math.max(2,Math.round((wl-top)/(H*.016))), rh=(wl-top)/rows;
    for(let i=0;i<rows;i++){ x.fillStyle=N(i%2?mix(sc,'#ffffff',.1):sc); x.fillRect(px-w/2,top+i*rh,w,rh-1); }
    x.fillStyle=v3rgba('#000000',.2); x.fillRect(px+w*.2,top,w*.3,wl-top); x.fillStyle=N('#4e6a34'); x.fillRect(px-w/2,wl-H*.007,w,H*.006); c=N(sc); }
  else { x.fillStyle=c; x.fillRect(px-w/2,top,w,wl-top);
    if(kind==='round'){ const gr=x.createLinearGradient(px-w/2,0,px+w/2,0); gr.addColorStop(0,v3rgba('#ffffff',.18*(1-o.night*.6))); gr.addColorStop(.45,v3rgba('#000000',0)); gr.addColorStop(1,v3rgba('#000000',.35)); x.fillStyle=gr; x.fillRect(px-w/2,top,w,wl-top); }
    else { x.fillStyle=mix(c,'#000000',.3); x.fillRect(px+w*.15,top,w*.35,wl-top); } }
  /* under the water line: the support runs on down to the bottom of the screen, taking on the water's colour and fading out gradually
     (director, 2026-11-21: they stopped as hard blocks above the bottom) */
  const gr=x.createLinearGradient(0,wl,0,H); gr.addColorStop(0,v3rgba(mix(c,wc,.4),.92)); gr.addColorStop(.3,v3rgba(mix(c,wc,.68),.6)); gr.addColorStop(.7,v3rgba(mix(c,wc,.88),.22)); gr.addColorStop(1,v3rgba(wc,0)); x.fillStyle=gr; x.fillRect(px-w/2,wl,w,H-wl);
  o.posts.push({x:px,w}); }

/* ---------- Willow Pond: the starter dock (pilot; docs/HOME_DESIGNS.md › 1) ---------- */
/* a feature whose first style is "nothing" (none:true) offers 3 real styles besides it (director, 2026-11-21: "nothing" is no choice) */
HOMEF.pond = { name:'Willow Pond dock', hname:'dock',
  /* one colour list for every feature (docs/MAP_THEMES.md › Willow Pond › Home colours) */
  colors:[['Honey pine','#b98a5a'],['Weathered pine','#8a6a4a'],['Dark stain','#5a4030'],['Driftwood','#9a9488'],['Moss','#5f8a6c'],['Pine green','#2c4a3e'],['Sage','#9ab08a'],['Willow','#7fae5c'],
          ['Lake teal','#3f827b'],['Sky blue','#86bcd9'],['Canvas','#f3e4ca'],['Warm white','#f4efe6'],['Barn red','#a8483a'],['Lantern gold','#e8b04a'],['Dusk rose','#c97a8a'],['Lilac','#8a7aa8']],
  els:[
    {id:'light', label:'Light', styles:['Lamp post','Hurricane lantern','Firefly jar'], def:[0,13]},
    {id:'deck', label:'Deck', styles:['Pine planks','Weathered boards','Log deck'], def:[0,0]},
    {id:'posts', label:'Posts', styles:['Square posts','Round piles','Stone piers'], def:[1,2]},
    {id:'rail', label:'Rail', none:true, styles:['No rail','Rope rail','Slat rail','Log rail'], def:[0,1]},
    {id:'canopy', label:'Canopy', none:true, styles:['Open sky','Patio umbrella','Lean-to roof','Sailcloth shade'], def:[0,10]},
    {id:'seat', label:'Seat', styles:['Camp chair','Log bench','Deck chair'], def:[0,12]}
  ],
  /* where the seat holds the angler, in the angler's own units (restPose sits them at this height) */
  seatH:[17,12,15],
  paint(o){ const {x,N,P,dockY,pw,id}=o, th=Math.max(4,H*.012), fh=Math.max(6,H*.018), night=o.night, rimA=.35*(1-night*.6), lit=1-night*.6;
    const deckC=hfColor(id,'deck'), postC=hfColor(id,'posts'), railC=hfColor(id,'rail'), canC=hfColor(id,'canopy'), seatC=hfColor(id,'seat'), x0=HF.x0(), at=f=>x0+(pw-x0)*f, sc=HF.sc();
    /* supports: from the deck's underside down into the water, every one fully under the deck */
    { const ps=hfStyle(id,'posts'), w=ps===2?Math.max(8,W*.018):Math.max(5,W*.011), xs=[.08,.3,.53,.76,.97].map(f=>Math.min(pw-w/2-1,at(f))), under=dockY+fh;
      if(ps===0){ x.strokeStyle=N(mix(postC,'#000000',.2)); x.lineWidth=Math.max(2,W*.004); for(let i=0;i<xs.length-1;i++){ x.beginPath(); x.moveTo(xs[i],under); x.lineTo(xs[i+1],o.wl-H*.01); x.moveTo(xs[i+1],under); x.lineTo(xs[i],o.wl-H*.01); x.stroke(); } } /* square posts: cross-braced */
      for(const px of xs) hfPost(o,px,w,postC,['square','round','stone'][ps],under);
      if(ps===1){ x.fillStyle=N(mix('#c8a878',postC,.25)); for(const px of xs){ x.fillRect(px-w/2-.5,under+H*.006,w+1,Math.max(2,H*.004)); x.fillRect(px-w/2-.5,under+H*.013,w+1,Math.max(1.5,H*.003)); } } } /* round piles: a band of rope near the top */
    /* deck: surface, face, seams, a hint of grain, lit edge */
    { const ds=hfStyle(id,'deck'), top=N(mix(deckC,'#ffffff',.08)), face=N(mix(deckC,'#000000',.24));
      x.fillStyle=face; x.fillRect(x0,dockY+th,pw-x0,fh-th); x.fillStyle=top; x.fillRect(x0,dockY,pw-x0,th);
      { const gr=x.createLinearGradient(0,dockY,0,dockY+th); gr.addColorStop(0,v3rgba('#ffffff',.1*lit)); gr.addColorStop(1,v3rgba('#000000',.12)); x.fillStyle=gr; x.fillRect(x0,dockY,pw-x0,th); }
      if(ds===2){ /* log deck: round log ends showing along the front, rings in each */ const r=(fh-th)*.5, n=Math.max(8,Math.round((pw-x0)/(r*2.05)));
        for(let i=0;i<n;i++){ const cx=at((i+.5)/n), cy=dockY+th+(fh-th)*.5; x.fillStyle=N(mix(deckC,'#ffffff',.12)); x.beginPath(); x.arc(cx,cy,r,0,7); x.fill(); x.strokeStyle=N(mix(deckC,'#000000',.35)); x.lineWidth=1; x.beginPath(); x.arc(cx,cy,r*.55,0,7); x.stroke(); x.beginPath(); x.arc(cx,cy,r,0,7); x.stroke(); } }
      else { const n=ds===1?11:14; x.strokeStyle=N(mix(deckC,'#000000',.32)); x.lineWidth=1;
        for(let i=1;i<n;i++){ const sx=at(i/n)+(ds===1?((i*37)%7-3):0); x.beginPath(); x.moveTo(sx,dockY+.5); x.lineTo(sx,dockY+th); x.stroke(); }
        if(ds===1){ for(let i=0;i<n;i++){ x.fillStyle=v3rgba(i%3?'#000000':'#ffffff',.07); x.fillRect(at(i/n),dockY,(pw-x0)/n,th); } x.fillStyle=N(mix(deckC,'#000000',.4)); for(let i=0;i<5;i++){ x.beginPath(); x.ellipse(at(.1+i*.2),dockY+th*.5,1.6,.9,0,0,7); x.fill(); } }
        x.fillStyle=N(mix(deckC,'#000000',.45)); for(let i=0;i<9;i++) x.fillRect(at(.05+i*.11),dockY+th+(fh-th)*.5,1.5,1.5); }
      x.strokeStyle=v3rgba('#000000',.08); for(let i=0;i<3;i++){ x.beginPath(); x.moveTo(x0,dockY+th*(.3+i*.22)); x.lineTo(pw,dockY+th*(.3+i*.22)+((i%2)?.6:-.6)); x.stroke(); }
      x.fillStyle=v3rgba(P.rim||'#fff0d0',rimA); x.fillRect(x0,dockY,pw-x0,1.2); }
    /* rail along the deck edge */
    { const rs=hfStyle(id,'rail'), rh=H*.045, rc=N(railC);
      if(rs===1){ const xs=[.02,.27,.52,.77,.98]; x.fillStyle=N(mix(railC,'#000000',.3)); for(const f of xs) x.fillRect(at(f)-1.5,dockY-rh,3,rh);
        x.strokeStyle=N(mix('#c8a878',railC,.35)); x.lineWidth=Math.max(1.6,H*.0035); for(let i=0;i<xs.length-1;i++){ const a=at(xs[i]), b=at(xs[i+1]); x.beginPath(); x.moveTo(a,dockY-rh*.85); x.quadraticCurveTo((a+b)/2,dockY-rh*.45,b,dockY-rh*.85); x.stroke(); }
        x.strokeStyle=v3rgba('#ffffff',.25*lit); x.lineWidth=1; for(let i=0;i<xs.length-1;i++){ const a=at(xs[i]), b=at(xs[i+1]); x.beginPath(); x.moveTo(a,dockY-rh*.86-1); x.quadraticCurveTo((a+b)/2,dockY-rh*.46-1,b,dockY-rh*.86-1); x.stroke(); } }
      if(rs===2){ x.fillStyle=rc; for(let i=0;i<=6;i++) x.fillRect(at(i/6)-2,dockY-rh,4,rh); x.fillRect(x0,dockY-rh,pw-x0,Math.max(3,H*.006)); x.fillRect(x0,dockY-rh*.5,pw-x0,Math.max(2,H*.004));
        x.fillStyle=v3rgba(P.rim||'#fff0d0',rimA); x.fillRect(x0,dockY-rh,pw-x0,1); }
      if(rs===3){ /* low log rail: one round log on stubby posts */ const ly=dockY-rh*.5, lr=Math.max(2.5,H*.0055); x.fillStyle=N(mix(railC,'#000000',.3)); for(let i=0;i<=4;i++) x.fillRect(at(i/4)-2,ly,4,dockY-ly);
        x.fillStyle=rc; x.fillRect(x0,ly-lr,pw-x0,lr*2); x.fillStyle=v3rgba('#000000',.22); x.fillRect(x0,ly+lr*.2,pw-x0,lr*.8); x.fillStyle=v3rgba('#ffffff',.22*lit); x.fillRect(x0,ly-lr,pw-x0,1.2);
        x.fillStyle=N(mix(railC,'#ffffff',.2)); x.beginPath(); x.arc(pw-1,ly,lr,0,7); x.fill(); x.strokeStyle=N(mix(railC,'#000000',.35)); x.lineWidth=1; x.beginPath(); x.arc(pw-1,ly,lr*.5,0,7); x.stroke(); } }
    /* the seat: on the deck at the seat spot, in front of the rail (resting sits the angler in it) */
    { const ss=hfStyle(id,'seat'), sx=HF.seatX(), s=sc, sh=HOMEF.pond.seatH[ss]*s, wood=N(mix(seatC,'#000000',.25)), cc=N(seatC), dark=N(mix(seatC,'#000000',.45));
      if(ss===0){ /* camp chair: X legs, a sling seat and a sling back, armrest tubes */ const w=14*s, by=dockY-sh; x.strokeStyle=N('#3a3a40'); x.lineWidth=Math.max(1.4,1.2*s);
        x.beginPath(); x.moveTo(sx-w/2,dockY); x.lineTo(sx+w/2,by); x.moveTo(sx+w/2,dockY); x.lineTo(sx-w/2,by); x.moveTo(sx-w/2,by-1); x.lineTo(sx-w*.6,by-15*s); x.moveTo(sx-w/2,by-6*s); x.lineTo(sx+w/2,by-6*s); x.stroke();
        x.fillStyle=cc; x.beginPath(); x.moveTo(sx-w/2,by); x.quadraticCurveTo(sx,by+3*s,sx+w/2,by); x.lineTo(sx+w/2,by-1.6*s); x.quadraticCurveTo(sx,by+1.2*s,sx-w/2,by-1.6*s); x.fill();
        x.beginPath(); x.moveTo(sx-w/2,by-1); x.quadraticCurveTo(sx-w*.62,by-8*s,sx-w*.6,by-15*s); x.lineTo(sx-w*.6+2.4*s,by-15*s); x.quadraticCurveTo(sx-w*.5,by-8*s,sx-w/2+2.4*s,by-1); x.fill();
        x.fillStyle=v3rgba('#ffffff',.18*lit); x.fillRect(sx-w*.6,by-15*s,1.2,13*s); }
      if(ss===1){ /* log bench: a split log, flat side up, on two stubby log legs */ const w=24*s, by=dockY-sh, t2=3.6*s; x.fillStyle=wood; x.fillRect(sx-w*.38,by,3.4*s,sh); x.fillRect(sx+w*.38-3.4*s,by,3.4*s,sh);
        x.fillStyle=cc; x.beginPath(); x.moveTo(sx-w/2,by); x.lineTo(sx+w/2,by); x.quadraticCurveTo(sx+w/2,by+t2,sx+w/2-t2,by+t2); x.lineTo(sx-w/2+t2,by+t2); x.quadraticCurveTo(sx-w/2,by+t2,sx-w/2,by); x.fill();
        x.fillStyle=N(mix(seatC,'#ffffff',.25)); x.beginPath(); x.ellipse(sx+w/2-1,by+t2*.45,1.6*s,t2*.5,0,0,7); x.fill(); x.fillStyle=v3rgba('#ffffff',.2*lit); x.fillRect(sx-w/2,by,w,1); }
      if(ss===2){ /* wooden deck chair: a slanted slatted back, a flat seat, flat arms */ const w=16*s, by=dockY-sh; x.fillStyle=wood; x.fillRect(sx-w*.45,by,2.4*s,sh); x.fillRect(sx+w*.4,by,2.4*s,sh);
        x.fillStyle=cc; x.fillRect(sx-w/2,by-1.6*s,w,2.6*s); x.save(); x.translate(sx-w*.45,by-1); x.rotate(-.42); for(let i=0;i<3;i++) x.fillRect(0,-16*s+i*5.6*s,2.6*s,4.6*s); x.fillRect(-.6*s,-16.5*s,3.8*s,17*s*.06+1); x.restore();
        x.fillStyle=dark; x.fillRect(sx-w*.5,by-7*s,w*.9,1.8*s); x.fillRect(sx+w*.3,by-7*s,1.8*s,7*s);
        x.fillStyle=v3rgba('#ffffff',.2*lit); x.fillRect(sx-w/2,by-1.6*s,w,1); } }
    /* canopy: in true side view, drawn after the rail so it stands on the deck (director: it looked attached to the rail) */
    { const cs=hfStyle(id,'canopy'), cc=N(canC), shade=N(mix(canC,'#000000',.22)), wood=N(mix(deckC,'#000000',.35)), iron=N('#3a3a40');
      const foot=(px)=>{ x.fillStyle=iron; x.fillRect(px-H*.007,dockY-H*.004,H*.014,H*.004); }; /* a small foot on the boards */
      if(cs===1){ /* patio umbrella (the director's model): one pole on a foot, a shallow dome with panels, its scalloped rim */
        const ux=at(.27), R=(pw-x0)*.19, ty=dockY-H*.17, ey=ty+H*.03; x.fillStyle=iron; x.fillRect(ux-1.2,ty,2.4,dockY-ty); foot(ux);
        x.fillStyle=cc; x.beginPath(); x.moveTo(ux-R,ey); x.quadraticCurveTo(ux-R*.55,ty-H*.006,ux,ty-H*.012); x.quadraticCurveTo(ux+R*.55,ty-H*.006,ux+R,ey); x.closePath(); x.fill();
        x.fillStyle=shade; for(let i=0;i<6;i++){ const u0=i/6, u1=(i+1)/6; x.beginPath(); x.arc(ux-R+(2*R)*(u0+u1)/2,ey,R/6,0,Math.PI); x.fill(); }
        x.strokeStyle=v3rgba('#000000',.18); x.lineWidth=1; for(const f of [-.6,-.2,.2,.6]){ x.beginPath(); x.moveTo(ux,ty-H*.012); x.lineTo(ux+R*f,ey); x.stroke(); }
        x.fillStyle=v3rgba('#ffffff',.25*lit); x.beginPath(); x.moveTo(ux-R*.85,ey-H*.004); x.quadraticCurveTo(ux-R*.5,ty-H*.002,ux,ty-H*.009); x.lineTo(ux,ty-H*.004); x.quadraticCurveTo(ux-R*.5,ty+H*.004,ux-R*.85,ey-H*.002); x.fill();
        x.fillStyle=N('#2a2a2e'); x.beginPath(); x.arc(ux,ty-H*.015,2,0,7); x.fill(); }
      if(cs===2){ /* lean-to roof: a tall post at the back, a shorter one in front, a plank roof sloping down between them (side view: one roof line) */
        const a=at(.03), b=at(.46), y1=dockY-H*.18, y2=dockY-H*.14, t2=H*.012; x.fillStyle=wood; x.fillRect(a-1.6,y1,3.2,dockY-y1); x.fillRect(b-1.6,y2,3.2,dockY-y2);
        x.fillStyle=cc; x.beginPath(); x.moveTo(a-W*.008,y1-t2*.5); x.lineTo(b+W*.01,y2-t2*.5); x.lineTo(b+W*.01,y2+t2*.5); x.lineTo(a-W*.008,y1+t2*.5); x.closePath(); x.fill();
        x.fillStyle=shade; x.beginPath(); x.moveTo(a-W*.008,y1+t2*.15); x.lineTo(b+W*.01,y2+t2*.15); x.lineTo(b+W*.01,y2+t2*.5); x.lineTo(a-W*.008,y1+t2*.5); x.closePath(); x.fill();
        x.strokeStyle=v3rgba('#000000',.2); x.lineWidth=1; for(let i=1;i<7;i++){ const u=i/7, px=a-W*.008+(b-a+W*.018)*u, py=y1+(y2-y1)*u; x.beginPath(); x.moveTo(px,py-t2*.5); x.lineTo(px,py+t2*.5); x.stroke(); }
        x.fillStyle=v3rgba(P.rim||'#fff0d0',rimA); x.beginPath(); x.moveTo(a-W*.008,y1-t2*.5); x.lineTo(b+W*.01,y2-t2*.5); x.lineTo(b+W*.01,y2-t2*.5+1.2); x.lineTo(a-W*.008,y1-t2*.5+1.2); x.fill(); }
      if(cs===3){ /* sailcloth shade: a pole at each end, the cloth stretched between them as a thin line with a gentle sag, tied at the tops */
        const a=at(.03), b=at(.48), py=dockY-H*.17, sag=H*.012, t2=Math.max(2.4,H*.0055); x.fillStyle=wood; x.fillRect(a-1.4,py,2.8,dockY-py); x.fillRect(b-1.4,py+H*.008,2.8,dockY-py-H*.008);
        x.fillStyle=cc; x.beginPath(); x.moveTo(a,py); x.quadraticCurveTo((a+b)/2,py+sag*2,b,py+H*.008); x.lineTo(b,py+H*.008+t2); x.quadraticCurveTo((a+b)/2,py+sag*2+t2,a,py+t2); x.closePath(); x.fill();
        x.fillStyle=shade; x.beginPath(); x.moveTo(a,py+t2*.55); x.quadraticCurveTo((a+b)/2,py+sag*2+t2*.55,b,py+H*.008+t2*.55); x.lineTo(b,py+H*.008+t2); x.quadraticCurveTo((a+b)/2,py+sag*2+t2,a,py+t2); x.closePath(); x.fill();
        x.strokeStyle=N(mix('#c8a878',canC,.3)); x.lineWidth=1; for(const [px,qy] of [[a,py],[b,py+H*.008]]){ x.beginPath(); x.moveTo(px,qy); x.lineTo(px+(px===a?-W*.006:W*.006),qy-H*.012); x.stroke(); }
        x.fillStyle=v3rgba('#ffffff',.22*lit); x.beginPath(); x.moveTo(a,py); x.quadraticCurveTo((a+b)/2,py+sag*2,b,py+H*.008); x.lineTo(b,py+H*.008+1); x.quadraticCurveTo((a+b)/2,py+sag*2+1,a,py+1); x.fill(); } }
    /* the light at the light spot (its glow is drawn live); all three stand on the deck at the end of the dock */
    { const ls=hfStyle(id,'light'), lx=HF.lightX(), iron=N('#2a2a30'), metal=iron; /* the fixture stays iron: the light's colour is its glow */ o.lights=[];
      if(ls===0){ x.fillStyle=metal; x.fillRect(lx-1.5,dockY-H*.1,3,H*.1); x.fillRect(lx-H*.009,dockY-H*.118,H*.018,2.5); x.strokeStyle=metal; x.lineWidth=1.2; x.strokeRect(lx-H*.008,dockY-H*.115,H*.016,H*.02); x.beginPath(); x.moveTo(lx-H*.01,dockY-H*.116); x.lineTo(lx,dockY-H*.128); x.lineTo(lx+H*.01,dockY-H*.116); x.stroke();
        x.fillStyle=iron; x.fillRect(lx-H*.006,dockY-H*.004,H*.012,H*.004); o.lights.push({x:lx,y:dockY-H*.105}); }
      if(ls===1){ /* hurricane lantern sitting on the boards: a base, a glass chimney, a cap and a wire handle */ const hx=lx-W*.004, by=dockY, gh=H*.026, gw=H*.016;
        x.fillStyle=metal; x.fillRect(hx-gw*.7,by-H*.006,gw*1.4,H*.006); x.fillRect(hx-gw*.55,by-H*.006-gh-H*.006,gw*1.1,H*.006);
        x.fillStyle=v3rgba('#e8f0f4',.35); x.beginPath(); x.ellipse(hx,by-H*.006-gh/2,gw*.55,gh/2,0,0,7); x.fill(); x.strokeStyle=metal; x.lineWidth=1; x.stroke();
        x.strokeStyle=v3rgba('#ffffff',.5*(1-night*.5)); x.beginPath(); x.ellipse(hx-gw*.2,by-H*.006-gh/2,gw*.12,gh*.3,0,0,7); x.stroke();
        x.strokeStyle=metal; x.lineWidth=1.2; x.beginPath(); x.arc(hx,by-H*.012-gh,gw*.6,Math.PI,0); x.stroke();
        o.lights.push({x:hx,y:by-H*.006-gh/2,r:.15,a:.55}); }
      if(ls===2){ /* firefly jar hanging from a short hook on a post standing on the deck */ const px=lx; x.fillStyle=N(mix(deckC,'#000000',.4)); x.fillRect(px-2,dockY-H*.07,4,H*.07);
        x.strokeStyle=iron; x.lineWidth=1.6; x.beginPath(); x.moveTo(px,dockY-H*.068); x.lineTo(px-H*.012,dockY-H*.068); x.lineTo(px-H*.012,dockY-H*.062); x.stroke();
        const jx=px-H*.012, jy=dockY-H*.046, jw=H*.013, jh=H*.018; x.fillStyle=v3rgba('#dceee8',.3); x.beginPath(); x.ellipse(jx,jy,jw*.5,jh*.5,0,0,7); x.fill(); x.strokeStyle=v3rgba(N('#9ab0a8'),.8); x.lineWidth=1; x.stroke();
        x.fillStyle=metal; x.fillRect(jx-jw*.35,jy-jh*.6,jw*.7,H*.004); x.strokeStyle=metal; x.beginPath(); x.moveTo(jx,jy-jh*.6); x.lineTo(jx,dockY-H*.062); x.stroke();
        o.lights.push({x:jx,y:jy,r:.11,a:.5,jar:1}); }
    } }
};
/* ---------- the Home page for a format home: a close-up of the home and its 6 features (styles, then the home's one colour list) ---------- */
function renderHomeF(P){ const sp=hfSpec(S.loc), L=LOCS[locIdx(S.loc)];
  const sw=(e,c,i,on)=>`<button type="button" class="chipb hf-col" data-act="hfcol" data-k="${e.id}" data-v="${i}" aria-pressed="${on}" title="${esc(c[0])}"><span class="hm-sw${e.id==='light'?' hm-glow':''}" style="background:${e.id==='light'?'radial-gradient(circle,'+c[1]+' 0%,'+c[1]+'59 55%,transparent 75%)':c[1]}"></span>${esc(c[0])}</button>`;
  P.innerHTML=`<i class="hf-mark" hidden></i>
   <div class="tile" style="margin-top:10px;padding:0;overflow:hidden"><canvas id="homecv" width="900" height="360" style="width:100%;height:auto;cursor:default"></canvas></div>`+
   sp.els.map(e=>{ const [s,c]=hfChoice(S.loc,e.id);
     return `<h5 data-hel="${e.id}">Style</h5><div class="chips" data-hel="${e.id}">${e.styles.map((n,i)=>`<button type="button" class="chipb" data-act="hfel" data-k="${e.id}" data-v="${i}" aria-pressed="${i===s}">${esc(n)}</button>`).join('')}</div>`+
       `<h5 data-hel="${e.id}">Color</h5><div class="chips" data-hel="${e.id}">${sp.colors.map((col,i)=>sw(e,col,i,i===c)).join('')}</div>`; }).join('');
  paintHome(); }
/* the 6 features become the page's tabs */
function hfSections(P){ const sp=hfSpec(S.loc); if(!sp) return false; sectionize(P,'home',sp.els.map(e=>({name:e.label,nodes:[...P.querySelectorAll(':scope > [data-hel="'+e.id+'"]')]}))); return true; }
/* the Home view frames the home: its footprint, the free zone above it and the water under it, at the view's own shape */
function hfFrame(c,top){ const pw=HF.pw(), dy=HF.dockY(), want={x:0,y:HF.top(dy)+H*.02,w:pw*1.08,h:(HF.wl(dy)+H*.05)-(HF.top(dy)+H*.02)}, ar=c.width/c.height;
  let w=want.w, h=w/ar; /* the home fills the view's width */
  if(h>H*.96){ h=H*.96; w=h*ar; } if(h<H*.25){ h=H*.25; w=h*ar; } /* never so flat that the deck or the canopy is cut */ /* the preview shows only the home (director, 2026-11-21): framed on the home's width, never the fishing scene beside it; a wide view crops water below instead */
  let y=h>=want.h?Math.min(want.y+want.h/2,dy-H*.03)-h/2:dy-H*.205; y=Math.max(top||0,Math.min(H-h,y)); return {sx:0,sy:y,sw:Math.min(W,w),sh:h}; }
/* a choice: the element's style or color (saved with this water's home) */
function hfAct(b){ const a=b.dataset.act; if(a!=='hfel'&&a!=='hfcol') return undefined; const sp=hfSpec(S.loc), e=sp&&sp.els.find(x=>x.id===b.dataset.k), v=+b.dataset.v; if(!e) return 'skip';
  const cur=hfChoice(S.loc,e.id); if(a==='hfel'){ if(!(v>=0&&v<e.styles.length)) return 'skip'; cur[0]=v; } else { if(!(v>=0&&v<sp.colors.length)) return 'skip'; cur[1]=v; }
  S.dock.el=hfClean(S.dock.el); S.dock.el[e.id]=cur; try{ sfx.coin(); }catch(er){} save(); return 'render'; }
