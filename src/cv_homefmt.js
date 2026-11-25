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
const HF = { pw:()=>W*.19, x0:()=>-4 /* the deck starts at the left edge (no bank: director, 2026-11-21) */, dockY:()=>H*.6, wl:dockY=>dockY+H*.075, top:dockY=>dockY-H*.42 /* the stored picture reaches high enough for a lifted cover (HK.roof) */, lightX:()=>W*.19-W*.012,
  seatX:()=>{ const sp=typeof HOMEF!=='undefined'&&S&&HOMEF[S.loc]; return sp&&typeof sp.seatX==='function'?sp.seatX():W*(sp&&sp.seatX||.064); } /* a home can place its seat (the Rockies cabin: nearer the front of the dock, director) */ /* the seat: behind the angler (who stands at W*.12), under the canopy; resting sits the angler in it */, sc:()=>clamp(H/420,.7,1.25) /* the angler's scale */ };
const hfSpec = id => HOMEF[id]||null;
/* homes are fixed (director, 2026-11-24: customisation removed for now, the idea comes back later as something else): every home shows its
   default look; the choices players made stay in their saves untouched (S.dock / S.docks) for that later idea */
function hfChoice(id,el){ const sp=hfSpec(id), e=sp&&sp.els.find(x=>x.id===el); if(!e) return [0,0]; const c=null; /* each water's own choices: the map pictures of other waters showed the current water's (2026-11-22) */
  const st=Array.isArray(c)&&c[0]>=0&&c[0]<e.styles.length?c[0]|0:(e.def?e.def[0]:0), pal=hfPal(e,st), d1=e.def?e.def[1]:0;
  return [st, Array.isArray(c)&&c[1]>=0&&c[1]<sp.colors.length&&(!pal||pal.includes(c[1]|0))?c[1]|0:(!pal||pal.includes(d1)?d1:pal[0])]; } /* a feature may offer only the colours real ones come in (e.pal: indices into the home's list) */
/* the colours a feature offers in a style: e.palS[style] when its styles differ (a sod roof grows grass, a tin roof is painted any colour), else e.pal, else all */
function hfPal(e,st){ return e.palS&&e.palS[st]||e.pal||null; }
function hfColor(id,el){ const sp=hfSpec(id); return sp.colors[hfChoice(id,el)[1]][1]; }
/* the light's glow colour: the chosen colour, lifted toward white so even a deep shade still reads as light */
function hfGlow(id){ const sp=hfSpec(id); if(sp&&sp.glow) return sp.glow; /* a home whose light is a window glows warm whatever the door's colour */ const e=sp&&sp.els.find(x=>x.light||x.id==='light'); const v=hex2rgb(mix(hfColor(id,e?e.id:'light'),'#ffffff',.3)); return v.join(','); } /* the feature that carries the home's light (batch 5: not always called "light") */
function hfStyle(id,el){ return hfChoice(id,el)[0]; }
/* the saved choices of one home: only valid numbers survive (dockCopy) */
function hfClean(o){ const r={}; if(o&&typeof o==='object'&&!Array.isArray(o)) for(const k in o){ const v=o[k]; if(Array.isArray(v)&&v.length===2&&v.every(n=>Number.isInteger(n)&&n>=0&&n<32)) r[k]=[v[0],v[1]]; } return r; }

/* ---------- the stored picture ---------- */
const HF_CACHE={};
/* d: pixels per scene unit (the scene's own, or the close-up's); slot: a separate stored picture for the close-up */
function hfPaintCache(L,P,night,dockY,dIn,slot){ const sp=hfSpec(L.id), d=dIn||Math.max(1,(typeof cv!=='undefined'&&cv&&W>0)?cv.width/W:1), id=L.id+(slot||'');
  const x0=-4, y0=HF.top(dockY), x1=HF.pw()*1.14, y1=H /* down to the bottom of the screen: the supports fade into the water all the way (director) */, key=[L.id,W,H,d,Math.round(night*24),P.rim,...sp.els.map(e=>hfChoice(L.id,e.id).join('.'))].join('|');
  let c=HF_CACHE[id]; if(c&&c.key===key) return c;
  if(!c){ c={cv:document.createElement('canvas')}; HF_CACHE[id]=c; } c.key=key; c.x=x0; c.y=y0; c.w=x1-x0; c.h=y1-y0;
  c.cv.width=Math.max(1,Math.ceil(c.w*d)); c.cv.height=Math.max(1,Math.ceil(c.h*d)); const x=c.cv.getContext('2d'); x.setTransform(d,0,0,d,-x0*d,-y0*d); x.clearRect(x0,y0,c.w,c.h);
  const N=col=>mix(col,'#0a1020',night*.55), ctx={x,P,night,dockY,N,id:L.id,pw:HF.pw(),wl:HF.wl(dockY),posts:[]};
  sp.paint(ctx); c.posts=ctx.posts; c.top=ctx.top==null?dockY-H*.23:ctx.top; c.low=ctx.low; c.lights=ctx.lights||[]; return c; }
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
    else if(l.win){ const [ww,wh]=l.win; x.fillStyle=lit>.05?'rgba('+rgb+','+(.35+lit*.6)+')':'rgba(40,52,64,.9)'; x.fillRect(l.x-ww/2,l.y+b-wh/2,ww,wh); x.fillStyle='rgba(40,30,20,.85)'; x.fillRect(l.x-.5,l.y+b-wh/2,1,wh); x.fillRect(l.x-ww/2,l.y+b-.5,ww,1); } /* a lit window glows across the whole pane, its cross bars dark */
    /* the glass shows the chosen colour by day too (director, 2026-11-22: "changing the colour barely changes anything", on every home) */
    else { x.fillStyle=lit>.05?'rgba('+rgb+','+(.6+lit*.4)+')':'rgba('+rgb+',.8)'; x.beginPath(); x.arc(l.x,l.y+b,(l.small?H*.0045:H*.0085),0,7); x.fill();
      if(lit>.05){ x.fillStyle='rgba(255,248,230,'+(.5*lit)+')'; x.beginPath(); x.arc(l.x,l.y+b,(l.small?H*.002:H*.0035),0,7); x.fill(); } } } }
/* drawn every frame on the water: rings, the stored picture (with the bob), the light */
function hfDraw(L,t,night,dockY,pb,P){ const sp=hfSpec(L.id); if(sp.draw&&sp.draw(t,night,dockY,P)) return; /* a painted home draws itself (Cherry Blossom, w_blossom_home.js) */ const c=hfPaintCache(L,P,night,dockY), b=sp.floats?(pb||0):0;
  if(sp.reflect) hfReflect(c,t,night,dockY); hfRings(g,c,t,night,dockY); g.drawImage(c.cv,c.x,c.y+b,c.w,c.h); hfLights(g,L,c,t,night,dockY,b,P,true); }
/* a home that stands in a painted lake mirrors in it (director, 2026-11-23, Cherry Blossom: the trees, bridge and torii all reflect, so the house
   must too): the stored picture flipped at the water line in thin strips that sway with the ripples, fading with depth, behind the posts */
function hfReflect(c,t,night,dockY){ const wl=HF.wl(dockY), k=c.cv.height/c.h, ht=Math.min(wl-c.y,H-wl), st=Math.max(3,Math.round(H/260)); if(ht<=0) return;
  g.save(); g.beginPath(); g.rect(0,wl,W,H-wl); g.clip(); g.translate(0,2*wl); g.scale(1,-1);
  for(let yy=0;yy<ht;yy+=st){ const y0=wl-yy-st, a=.28*(1-yy/ht)**1.6*(1-night*.3); if(a<.01) break; g.globalAlpha=a; const off=Math.sin(t*1.6+yy*.09)*(1+yy*.012)*H/700;
    g.drawImage(c.cv,0,Math.max(0,(y0-c.y)*k),c.cv.width,st*k,c.x+off,y0,c.w,st); }
  g.restore(); }

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
  /* director, 2026-11-22 ("dry, just runs straight down with nothing to define its look"): a cap where the support meets the deck beam,
     a wet dark band just above the water line and a ragged fringe of weed where the water laps it */
  if(kind!=='stone'){ x.fillStyle=mix(c,'#000000',.38); x.fillRect(px-w*.62,top,w*1.24,Math.max(1.5,H*.005)); }
  const wb=Math.min(H*.03,(wl-top)*.5), wg=x.createLinearGradient(0,wl-wb,0,wl); wg.addColorStop(0,v3rgba('#1a2418',0)); wg.addColorStop(1,v3rgba('#1a2418',.42*(1-o.night*.3))); x.fillStyle=wg; x.fillRect(px-w/2,wl-wb,w,wb);
  x.fillStyle=N(mix('#3f5a2c',wc,.25)); for(let i=0;i<4;i++){ const fx=px-w/2+w*(i+.5)/4, fh=H*(.004+.004*((Math.sin(px*.37+i*2.1)+1)/2)); x.fillRect(fx-w*.09,wl-fh,w*.18,fh); }
  /* under the water line: the support runs on down to the bottom of the screen, taking on the water's colour and fading out gradually
     (director, 2026-11-21: they stopped as hard blocks above the bottom) */
  /* director, 2026-11-22: "blend into the water properly": under the surface the support is murky, darker than the water around it
     (never a pale block), and it is lost in the depth well before the bottom */
  const deep=P.wBot||mix(wc,'#000000',.4), mur=mix(mix(c,deep,.7),'#000000',.12), gr=x.createLinearGradient(0,wl,0,Math.min(H,wl+H*.2));
  gr.addColorStop(0,v3rgba(mur,.62)); gr.addColorStop(.25,v3rgba(mur,.36)); gr.addColorStop(.6,v3rgba(deep,.14)); gr.addColorStop(1,v3rgba(deep,0)); x.fillStyle=gr; x.fillRect(px-w/2,wl,w,Math.min(H,wl+H*.2)-wl);
  o.posts.push({x:px,w}); }
/* cross bracing between neighbouring wooden or iron supports (behind them): one diagonal pair per gap, from under the beam to just above
   the water, so a row of supports reads as one built frame (director, 2026-11-22: they ran "straight down with nothing to define" them) */
/* beam:true gives one horizontal crossbeam (a waling) instead, so round piles and square posts stay clearly different */
function hfBraces(o,xs,top,col,w,beam){ const x=o.x; x.save(); x.globalCompositeOperation='destination-over'; x.strokeStyle=o.N(mix(col,'#000000',.45)); x.lineWidth=Math.max(1.2,w*(beam?.5:.32));
  if(beam){ const by=top+(o.wl-top)*.55; x.beginPath(); x.moveTo(xs[0],by); x.lineTo(xs[xs.length-1],by); x.stroke(); x.restore(); return; }
  for(let i=0;i+1<xs.length;i++){ const a=xs[i], b=xs[i+1], t=top+H*.008, bt=o.wl-H*.006; if(b-a<H*.03||bt-t<H*.02) continue; x.beginPath(); x.moveTo(a,t); x.lineTo(b,bt); x.moveTo(b,t); x.lineTo(a,bt); x.stroke(); }
  x.restore(); }

