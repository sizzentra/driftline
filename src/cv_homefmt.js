// =====================================================================
// The home format (docs/HOME_STANDARD.md, decided with the director 2026-11-21). Pilot: Willow Pond.
// Every format home has the same footprint, standing surface, shore at the left edge, light spot and pet spots; the player changes
// 5 elements (the light fixture always, plus 4 that fit the home), each with 3 styles and curated colors, all free.
// Performance: the still home is painted once into a stored picture and pasted every frame; it is repainted only when a choice,
// the screen size or the light of the day (in small steps) changes. Drawn live each frame: the light's glow, its pool and its
// reflection, the ripples at the supports, and the bob of floating homes (the stored picture pasted a little higher or lower).
// Choices are saved per water in S.dock.el ({element id: [style, color]}), carried by dockCopy like the rest of the home.
// Waters without a format home keep the older home system until they are converted.
// =====================================================================
const HOMEF={};
/* the format, in the scene's own units (W, H): the same for every format home */
const HF = { pw:()=>W*.19, x0:()=>-4 /* the deck starts at the left edge (no bank: director, 2026-11-21) */, dockY:()=>H*.6, wl:dockY=>dockY+H*.075, top:dockY=>dockY-H*.25, lightX:()=>W*.19-W*.012 };
const hfSpec = id => HOMEF[id]||null;
function hfChoice(id,el){ const sp=hfSpec(id), e=sp&&sp.els.find(x=>x.id===el); if(!e) return [0,0]; const c=S.dock&&S.dock.el&&S.dock.el[el];
  return [Array.isArray(c)&&c[0]>=0&&c[0]<e.styles.length?c[0]|0:(e.def?e.def[0]:0), Array.isArray(c)&&c[1]>=0&&c[1]<e.colors.length?c[1]|0:(e.def?e.def[1]:0)]; }
function hfColor(id,el){ const sp=hfSpec(id), e=sp.els.find(x=>x.id===el); return e.colors[hfChoice(id,el)[1]][1]; }
function hfStyle(id,el){ return hfChoice(id,el)[0]; }
/* the saved choices of one home: only valid numbers survive (dockCopy) */
function hfClean(o){ const r={}; if(o&&typeof o==='object'&&!Array.isArray(o)) for(const k in o){ const v=o[k]; if(Array.isArray(v)&&v.length===2&&v.every(n=>Number.isInteger(n)&&n>=0&&n<12)) r[k]=[v[0],v[1]]; } return r; }

/* ---------- the stored picture ---------- */
const HF_CACHE={}; let HF_LAST=null; /* HF_LAST: where the scene last drew the angler, rod and pets on a format home (for the close-up) */
/* d: pixels per scene unit (the scene's own, or the close-up's); slot: a separate stored picture for the close-up */
function hfPaintCache(L,P,night,dockY,dIn,slot){ const sp=hfSpec(L.id), d=dIn||Math.max(1,(typeof cv!=='undefined'&&cv&&W>0)?cv.width/W:1), id=L.id+(slot||'');
  const x0=-4, y0=HF.top(dockY), x1=HF.pw()*1.14, y1=Math.min(H,HF.wl(dockY)+H*.24), key=[L.id,W,H,d,Math.round(night*24),P.rim,...sp.els.map(e=>hfChoice(L.id,e.id).join('.'))].join('|');
  let c=HF_CACHE[id]; if(c&&c.key===key) return c;
  if(!c){ c={cv:document.createElement('canvas')}; HF_CACHE[id]=c; } c.key=key; c.x=x0; c.y=y0; c.w=x1-x0; c.h=y1-y0;
  c.cv.width=Math.max(1,Math.ceil(c.w*d)); c.cv.height=Math.max(1,Math.ceil(c.h*d)); const x=c.cv.getContext('2d'); x.setTransform(d,0,0,d,-x0*d,-y0*d); x.clearRect(x0,y0,c.w,c.h);
  const N=col=>mix(col,'#0a1020',night*.55), ctx={x,P,night,dockY,N,id:L.id,pw:HF.pw(),wl:HF.wl(dockY),posts:[]};
  sp.paint(ctx); c.posts=ctx.posts; c.lights=ctx.lights||[]; return c; }
/* the ripple rings, drawn BEFORE the home so each support hides the middle of its ring (they read as going around it) */
function hfRings(x,c,t,night,dockY){ for(const p of c.posts){ const k=1+.18*Math.sin(t*1.7+p.x*.07); x.strokeStyle='rgba(255,255,255,'+(.28-night*.12)+')'; x.lineWidth=1; x.beginPath(); x.ellipse(p.x,HF.wl(dockY),(p.w*.62+H*.006)*k,Math.max(1.2,H*.004),0,0,7); /* sized to its support, never touching the next ring */ x.stroke(); } }
/* the light: glow and hot centre on any canvas; on the scene also its pool on the deck and its reflection; a firefly jar has its fireflies */
function hfLights(x,L,c,t,night,dockY,b,P,scene){ const lit=clamp(night*1.2+P.d*.9,0,1), rgb=hfColor(L.id,'light');
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
  const gr=x.createLinearGradient(0,wl,0,wl+H*.22); gr.addColorStop(0,v3rgba(mix(c,wc,.45),.9)); gr.addColorStop(.55,v3rgba(mix(c,wc,.8),.45)); gr.addColorStop(1,v3rgba(wc,0)); x.fillStyle=gr; x.fillRect(px-w/2,wl,w,H*.22);
  o.posts.push({x:px,w}); }

/* ---------- Willow Pond: a lakeside dock (pilot) ---------- */
/* an element whose first style is "nothing" (none:true) offers 3 real styles besides it (director, 2026-11-21: "nothing" is no choice) */
HOMEF.pond = { name:'Willow Pond dock', hname:'dock',
  els:[
    {id:'light', label:'Lantern', styles:['Lamp post','Hurricane lantern','Firefly jar'], def:[0,0], colors:[['Warm gold','255,196,90'],['Candle','255,224,160'],['Rose','255,140,175'],['Sea glass','130,255,205'],['Moon blue','150,195,255'],['Lilac','195,150,255']]},
    {id:'deck', label:'Deck', styles:['Planks','Wide boards','Weathered boards'], def:[0,0], colors:[['Oak','#9a6a44'],['Birch','#c8a878'],['Walnut','#5e3e28'],['Driftwood','#8a8478'],['Painted white','#e6e2da'],['Sage','#8aa08a']]},
    {id:'posts', label:'Posts', styles:['Round posts','Square posts','Stone piers'], def:[0,0], colors:[['Dark oak','#4a3222'],['Weathered','#6e6658'],['Mossy','#4e5e3a'],['Painted white','#dedad2'],['River stone','#7a7a74'],['Charcoal','#2e2e32']]},
    {id:'rail', label:'Rail', none:true, styles:['No rail','Rope rail','Wooden rail','Iron rail'], def:[0,0], colors:[['Natural','#9a7a54'],['White','#ece8e0'],['Sage','#8aa08a'],['Barn red','#a8402e'],['Harbour blue','#3a6a9a'],['Charcoal','#34343a']]},
    {id:'canopy', label:'Canopy', none:true, styles:['Open sky','Patio umbrella','Cloth pergola','Wooden shelter'], def:[0,0], colors:[['Cream','#efe6d0'],['Sage','#9ab89a'],['Rose','#e8a8b0'],['Sky','#9ac0e0'],['Butter','#f0d890'],['Lilac','#c0a8e0']]}
  ],
  paint(o){ const {x,N,P,dockY,pw,id}=o, th=Math.max(4,H*.012), fh=Math.max(6,H*.018), night=o.night, rimA=.35*(1-night*.6);
    const deckC=hfColor(id,'deck'), postC=hfColor(id,'posts'), railC=hfColor(id,'rail'), canC=hfColor(id,'canopy'), x0=HF.x0(), at=f=>x0+(pw-x0)*f;
    /* posts: from the deck's underside, every one fully under the deck */
    { const ps=hfStyle(id,'posts'), w=ps===2?Math.max(8,W*.018):Math.max(5,W*.011), xs=[.08,.3,.53,.76,.97].map(f=>Math.min(pw-w/2-1,at(f))), under=dockY+fh;
      if(ps===1){ x.strokeStyle=N(mix(postC,'#000000',.2)); x.lineWidth=Math.max(2,W*.004); for(let i=0;i<xs.length-1;i++){ x.beginPath(); x.moveTo(xs[i],under); x.lineTo(xs[i+1],o.wl-H*.01); x.moveTo(xs[i+1],under); x.lineTo(xs[i],o.wl-H*.01); x.stroke(); } }
      for(const px of xs) hfPost(o,px,w,postC,['round','square','stone'][ps],under); }
    /* deck: surface, face, seams, a hint of grain, nails, lit edge */
    { const ds=hfStyle(id,'deck'), top=N(mix(deckC,'#ffffff',.08)), face=N(mix(deckC,'#000000',.24));
      x.fillStyle=face; x.fillRect(x0,dockY+th,pw-x0,fh-th); x.fillStyle=top; x.fillRect(x0,dockY,pw-x0,th);
      { const gr=x.createLinearGradient(0,dockY,0,dockY+th); gr.addColorStop(0,v3rgba('#ffffff',.1*(1-night*.6))); gr.addColorStop(1,v3rgba('#000000',.12)); x.fillStyle=gr; x.fillRect(x0,dockY,pw-x0,th); }
      const n=ds===1?7:14; x.strokeStyle=N(mix(deckC,'#000000',.32)); x.lineWidth=1;
      for(let i=1;i<n;i++){ const sx=at(i/n)+(ds===2?((i*37)%7-3):0); x.beginPath(); x.moveTo(sx,dockY+.5); x.lineTo(sx,dockY+th); x.stroke(); }
      if(ds===2){ for(let i=0;i<n;i++){ x.fillStyle=v3rgba(i%3?'#000000':'#ffffff',.07); x.fillRect(at(i/n),dockY,(pw-x0)/n,th); } x.fillStyle=N(mix(deckC,'#000000',.4)); for(let i=0;i<5;i++){ x.beginPath(); x.ellipse(at(.1+i*.2),dockY+th*.5,1.6,.9,0,0,7); x.fill(); } }
      if(ds===1){ x.fillStyle=N(mix(deckC,'#ffffff',.18)); x.fillRect(x0,dockY+th,pw-x0,Math.max(2,fh*.25)); }
      x.strokeStyle=v3rgba('#000000',.08); for(let i=0;i<3;i++){ x.beginPath(); x.moveTo(x0,dockY+th*(.3+i*.22)); x.lineTo(pw,dockY+th*(.3+i*.22)+((i%2)?.6:-.6)); x.stroke(); }
      x.fillStyle=N(mix(deckC,'#000000',.45)); for(let i=0;i<9;i++) x.fillRect(at(.05+i*.11),dockY+th+(fh-th)*.5,1.5,1.5);
      x.fillStyle=v3rgba(P.rim||'#fff0d0',rimA); x.fillRect(x0,dockY,pw-x0,1.2); }
    /* canopy, drawn as seen from the side, over the left part so the angler stays in the open */
    { const cs=hfStyle(id,'canopy'), cc=N(canC), shade=N(mix(canC,'#000000',.22)), wood=N(mix(deckC,'#000000',.35)), a=at(.04), b=at(.44);
      if(cs===1){ /* patio umbrella: one pole, a shallow dome with panels and a scalloped edge */
        const ux=at(.27), R=(pw-x0)*.19, ty=dockY-H*.17, ey=ty+H*.03; x.fillStyle=N('#3a3a40'); x.fillRect(ux-1.2,ty,2.4,dockY-ty);
        x.fillStyle=cc; x.beginPath(); x.moveTo(ux-R,ey); x.quadraticCurveTo(ux-R*.55,ty-H*.006,ux,ty-H*.012); x.quadraticCurveTo(ux+R*.55,ty-H*.006,ux+R,ey); x.closePath(); x.fill();
        x.fillStyle=shade; for(let i=0;i<6;i++){ const u0=i/6, u1=(i+1)/6; x.beginPath(); x.arc(ux-R+(2*R)*(u0+u1)/2,ey,R/6,0,Math.PI); x.fill(); } /* scalloped edge, the underside in shade */
        x.strokeStyle=v3rgba('#000000',.18); x.lineWidth=1; for(const f of [-.6,-.2,.2,.6]){ x.beginPath(); x.moveTo(ux,ty-H*.012); x.lineTo(ux+R*f,ey); x.stroke(); }
        x.fillStyle=v3rgba('#ffffff',.25*(1-night*.6)); x.beginPath(); x.moveTo(ux-R*.85,ey-H*.004); x.quadraticCurveTo(ux-R*.5,ty-H*.002,ux,ty-H*.009); x.lineTo(ux,ty-H*.004); x.quadraticCurveTo(ux-R*.5,ty+H*.004,ux-R*.85,ey-H*.002); x.fill();
        x.fillStyle=N('#2a2a2e'); x.beginPath(); x.arc(ux,ty-H*.015,2,0,7); x.fill(); }
      if(cs===2){ /* cloth pergola: two posts and a beam; the cloth lies over the beam and its ends drape down, tied back to the posts */
        const by=dockY-H*.165, ov=W*.008; x.fillStyle=wood; x.fillRect(a-1.5,by,3,dockY-by); x.fillRect(b-1.5,by,3,dockY-by); x.fillRect(a-ov,by-2,(b-a)+ov*2,3);
        x.fillStyle=cc; x.fillRect(a-ov,by-H*.012,(b-a)+ov*2,H*.012); /* the cloth on top */
        for(const [px,dir] of [[a-ov,1],[b+ov,-1]]){ x.fillStyle=cc; x.beginPath(); x.moveTo(px,by-H*.012); x.lineTo(px+dir*W*.022,by-H*.012); x.quadraticCurveTo(px+dir*W*.006,by+H*.05,px+dir*ov,by+H*.09); x.lineTo(px,by+H*.085); x.closePath(); x.fill();
          x.fillStyle=shade; x.fillRect(px+dir*ov-(dir>0?0:3),by+H*.07,3,H*.008); } /* the tie */
        x.fillStyle=shade; x.fillRect(a-ov,by-1,(b-a)+ov*2,2); x.fillStyle=v3rgba('#ffffff',.22*(1-night*.6)); x.fillRect(a-ov,by-H*.012,(b-a)+ov*2,1.2); }      if(cs===3){ /* wooden shelter: a small slanted plank roof on two posts, in the deck's wood, with a fabric edge in your color */
        const y1=dockY-H*.175, y2=dockY-H*.145, t2=H*.014; x.fillStyle=wood; x.fillRect(a-1.5,y1,3,dockY-y1); x.fillRect(b-1.5,y2,3,dockY-y2);
        x.fillStyle=N(mix(deckC,'#000000',.15)); x.beginPath(); x.moveTo(a-W*.008,y1-t2*.4); x.lineTo(b+W*.008,y2-t2*.4); x.lineTo(b+W*.008,y2+t2*.6); x.lineTo(a-W*.008,y1+t2*.6); x.closePath(); x.fill();
        x.strokeStyle=N(mix(deckC,'#000000',.4)); x.lineWidth=1; for(let i=1;i<6;i++){ const u=i/6, px=a-W*.008+(b-a+W*.016)*u, py=y1+(y2-y1)*u; x.beginPath(); x.moveTo(px,py-t2*.4); x.lineTo(px,py+t2*.6); x.stroke(); }
        x.fillStyle=v3rgba(P.rim||'#fff0d0',rimA); x.beginPath(); x.moveTo(a-W*.008,y1-t2*.4); x.lineTo(b+W*.008,y2-t2*.4); x.lineTo(b+W*.008,y2-t2*.4+1.2); x.lineTo(a-W*.008,y1-t2*.4+1.2); x.fill();
        for(let i=0;i<8;i++){ const u0=i/8, u=(i+.5)/8, px=a-W*.008+(b-a+W*.016)*u, py=y1+(y2-y1)*u+t2*.6; x.fillStyle=i%2?cc:shade; x.beginPath(); x.arc(px,py,(b-a+W*.016)/16,0,Math.PI); x.fill(); } } }
    /* rail */
    { const rs=hfStyle(id,'rail'), rh=H*.045, rc=N(railC);
      if(rs===1){ const xs=[.02,.27,.52,.77,.98]; x.fillStyle=N(mix(railC,'#000000',.3)); for(const f of xs) x.fillRect(at(f)-1.5,dockY-rh,3,rh);
        x.strokeStyle=rc; x.lineWidth=Math.max(1.6,H*.0035); for(let i=0;i<xs.length-1;i++){ const a=at(xs[i]), b=at(xs[i+1]); x.beginPath(); x.moveTo(a,dockY-rh*.85); x.quadraticCurveTo((a+b)/2,dockY-rh*.45,b,dockY-rh*.85); x.stroke(); }
        x.strokeStyle=v3rgba('#ffffff',.25*(1-night*.6)); x.lineWidth=1; for(let i=0;i<xs.length-1;i++){ const a=at(xs[i]), b=at(xs[i+1]); x.beginPath(); x.moveTo(a,dockY-rh*.86-1); x.quadraticCurveTo((a+b)/2,dockY-rh*.46-1,b,dockY-rh*.86-1); x.stroke(); } }
      if(rs===2){ x.fillStyle=rc; for(let i=0;i<=6;i++) x.fillRect(at(i/6)-2,dockY-rh,4,rh); x.fillRect(x0,dockY-rh,pw-x0,Math.max(3,H*.006)); x.fillRect(x0,dockY-rh*.5,pw-x0,Math.max(2,H*.004));
        x.fillStyle=v3rgba(P.rim||'#fff0d0',rimA); x.fillRect(x0,dockY-rh,pw-x0,1); }
      if(rs===3){ /* iron rail: thin dark rails, slim balusters and a small curl between each pair */ const ic=N(mix(railC,'#1a1a1e',.55)); x.fillStyle=ic;
        x.fillRect(x0,dockY-rh,pw-x0,2.2); x.fillRect(x0,dockY-rh*.18,pw-x0,1.6); for(let i=0;i<=12;i++) x.fillRect(at(i/12)-.8,dockY-rh,1.6,rh);
        x.strokeStyle=ic; x.lineWidth=1.2; for(let i=0;i<12;i++){ const cx2=at((i+.5)/12); x.beginPath(); x.arc(cx2,dockY-rh*.6,Math.max(2,(pw-x0)/60),0,Math.PI*1.6); x.stroke(); }
        x.fillStyle=v3rgba('#ffffff',.2*(1-night*.6)); x.fillRect(x0,dockY-rh,pw-x0,.8); } }
    /* the light fixture at the light spot (its glow is drawn live); all three stay at the end of the dock */
    { const ls=hfStyle(id,'light'), lx=HF.lightX(), iron=N('#2a2a30'); o.lights=[];
      if(ls===0){ x.fillStyle=iron; x.fillRect(lx-1.5,dockY-H*.1,3,H*.1); x.fillRect(lx-H*.009,dockY-H*.118,H*.018,2.5); x.strokeStyle=iron; x.lineWidth=1.2; x.strokeRect(lx-H*.008,dockY-H*.115,H*.016,H*.02); x.beginPath(); x.moveTo(lx-H*.01,dockY-H*.116); x.lineTo(lx,dockY-H*.128); x.lineTo(lx+H*.01,dockY-H*.116); x.stroke();
        o.lights.push({x:lx,y:dockY-H*.105}); }
      if(ls===1){ /* hurricane lantern sitting on the boards: a base, a glass chimney, a cap and a wire handle */ const hx=lx-W*.004, by=dockY, gh=H*.026, gw=H*.016;
        x.fillStyle=N('#3a3a40'); x.fillRect(hx-gw*.7,by-H*.006,gw*1.4,H*.006); x.fillRect(hx-gw*.55,by-H*.006-gh-H*.006,gw*1.1,H*.006);
        x.fillStyle=v3rgba('#e8f0f4',.35); x.beginPath(); x.ellipse(hx,by-H*.006-gh/2,gw*.55,gh/2,0,0,7); x.fill(); x.strokeStyle=N('#3a3a40'); x.lineWidth=1; x.stroke();
        x.strokeStyle=v3rgba('#ffffff',.5*(1-night*.5)); x.beginPath(); x.ellipse(hx-gw*.2,by-H*.006-gh/2,gw*.12,gh*.3,0,0,7); x.stroke();
        x.strokeStyle=N('#3a3a40'); x.lineWidth=1.2; x.beginPath(); x.arc(hx,by-H*.012-gh,gw*.6,Math.PI,0); x.stroke();
        o.lights.push({x:hx,y:by-H*.006-gh/2,r:.15,a:.55}); }
      if(ls===2){ /* firefly jar hanging from a short hook on the end post */ const px=lx; x.fillStyle=N(mix(deckC,'#000000',.4)); x.fillRect(px-2,dockY-H*.07,4,H*.07);
        x.strokeStyle=iron; x.lineWidth=1.6; x.beginPath(); x.moveTo(px,dockY-H*.068); x.lineTo(px-H*.012,dockY-H*.068); x.lineTo(px-H*.012,dockY-H*.062); x.stroke();
        const jx=px-H*.012, jy=dockY-H*.046, jw=H*.013, jh=H*.018; x.fillStyle=v3rgba('#dceee8',.3); x.beginPath(); x.ellipse(jx,jy,jw*.5,jh*.5,0,0,7); x.fill(); x.strokeStyle=v3rgba(N('#9ab0a8'),.8); x.lineWidth=1; x.stroke();
        x.fillStyle=N('#6a5a3a'); x.fillRect(jx-jw*.35,jy-jh*.6,jw*.7,H*.004); x.strokeStyle=N('#6a5a3a'); x.beginPath(); x.moveTo(jx,jy-jh*.6); x.lineTo(jx,dockY-H*.062); x.stroke();
        o.lights.push({x:jx,y:jy,r:.11,a:.5,jar:1}); }
    } }
};
/* ---------- the Home page for a format home: a close-up of the home and its 5 elements (styles, then colors) ---------- */
function renderHomeF(P){ const sp=hfSpec(S.loc), L=LOCS[locIdx(S.loc)];
  const sw=(e,c,i,on)=>`<button type="button" class="chipb hf-col" data-act="hfcol" data-k="${e.id}" data-v="${i}" aria-pressed="${on}" title="${esc(c[0])}"><span class="hm-sw${e.id==='light'?' hm-glow':''}" style="background:${e.id==='light'?'radial-gradient(circle,rgb('+c[1]+') 0%,rgba('+c[1]+',.35) 55%,transparent 75%)':c[1]}"></span>${esc(c[0])}</button>`;
  P.innerHTML=`<i class="hf-mark" hidden></i>
   <div class="tile" style="margin-top:10px;padding:0;overflow:hidden"><canvas id="homecv" width="900" height="360" style="width:100%;height:auto;cursor:default"></canvas></div>`+
   sp.els.map(e=>{ const [s,c]=hfChoice(S.loc,e.id);
     return `<h5 data-hel="${e.id}">Style</h5><div class="chips" data-hel="${e.id}">${e.styles.map((n,i)=>`<button type="button" class="chipb" data-act="hfel" data-k="${e.id}" data-v="${i}" aria-pressed="${i===s}">${esc(n)}</button>`).join('')}</div>`+
       `<h5 data-hel="${e.id}">Color</h5><div class="chips" data-hel="${e.id}">${e.colors.map((col,i)=>sw(e,col,i,i===c)).join('')}</div>`; }).join('');
  paintHome(); }
/* the 5 elements become the page's tabs */
function hfSections(P){ const sp=hfSpec(S.loc); if(!sp) return false; sectionize(P,'home',sp.els.map(e=>({name:e.label,nodes:[...P.querySelectorAll(':scope > [data-hel="'+e.id+'"]')]}))); return true; }
/* the Home view frames the home: its footprint, the free zone above it and the water under it, at the view's own shape */
function hfFrame(c,top){ const pw=HF.pw(), dy=HF.dockY(), want={x:0,y:HF.top(dy)+H*.02,w:pw*1.08,h:(HF.wl(dy)+H*.05)-(HF.top(dy)+H*.02)}, ar=c.width/c.height;
  let w=want.w, h=want.h; if(w/h<ar) w=h*ar; else h=w/ar;
  if(w>want.w/.5){ w=want.w/.5; h=w/ar; } /* a wide view: the home still fills about half of it (the top of the free zone may be cut) */
  let y=Math.min(want.y+want.h/2,dy-H*.03)-h/2; y=Math.max(top||0,Math.min(H-h,y)); return {sx:0,sy:y,sw:Math.min(W,w),sh:h}; }
/* a choice: the element's style or color (saved with this water's home) */
function hfAct(b){ const a=b.dataset.act; if(a!=='hfel'&&a!=='hfcol') return undefined; const sp=hfSpec(S.loc), e=sp&&sp.els.find(x=>x.id===b.dataset.k), v=+b.dataset.v; if(!e) return 'skip';
  const cur=hfChoice(S.loc,e.id); if(a==='hfel'){ if(!(v>=0&&v<e.styles.length)) return 'skip'; cur[0]=v; } else { if(!(v>=0&&v<e.colors.length)) return 'skip'; cur[1]=v; }
  S.dock.el=hfClean(S.dock.el); S.dock.el[e.id]=cur; try{ sfx.coin(); }catch(er){} save(); return 'render'; }
