// =====================================================================
// The home format (docs/HOME_STANDARD.md, decided with the director 2026-11-21). Pilot: Willow Pond.
// Every format home has the same footprint, standing surface, shore at the left edge, light spot and pet spots; the player changes
// 5 elements (the light fixture always, plus 4 that fit the home), each with 3 styles and curated colours, all free.
// Performance: the still home is painted once into a stored picture and pasted every frame; it is repainted only when a choice,
// the screen size or the light of the day (in small steps) changes. Drawn live each frame: the light's glow, its pool and its
// reflection, the ripples at the supports, and the bob of floating homes (the stored picture pasted a little higher or lower).
// Choices are saved per water in S.dock.el ({element id: [style, colour]}), carried by dockCopy like the rest of the home.
// Waters without a format home keep the older home system until they are converted.
// =====================================================================
const HOMEF={};
/* the format, in the scene's own units (W, H): the same for every format home */
const HF = { pw:()=>W*.19, x0:()=>W*.035 /* where the deck starts (resting on the bank) */, dockY:()=>H*.6, wl:dockY=>dockY+H*.075, top:dockY=>dockY-H*.25, lightX:()=>W*.19-W*.012 };
const hfSpec = id => HOMEF[id]||null;
function hfChoice(id,el){ const sp=hfSpec(id), e=sp&&sp.els.find(x=>x.id===el); if(!e) return [0,0]; const c=S.dock&&S.dock.el&&S.dock.el[el];
  return [Array.isArray(c)&&c[0]>=0&&c[0]<e.styles.length?c[0]|0:(e.def?e.def[0]:0), Array.isArray(c)&&c[1]>=0&&c[1]<e.colours.length?c[1]|0:(e.def?e.def[1]:0)]; }
function hfColour(id,el){ const sp=hfSpec(id), e=sp.els.find(x=>x.id===el); return e.colours[hfChoice(id,el)[1]][1]; }
function hfStyle(id,el){ return hfChoice(id,el)[0]; }
/* the saved choices of one home: only valid numbers survive (dockCopy) */
function hfClean(o){ const r={}; if(o&&typeof o==='object'&&!Array.isArray(o)) for(const k in o){ const v=o[k]; if(Array.isArray(v)&&v.length===2&&v.every(n=>Number.isInteger(n)&&n>=0&&n<12)) r[k]=[v[0],v[1]]; } return r; }

/* ---------- the stored picture ---------- */
const HF_CACHE={};
function hfPaintCache(L,P,night,dockY){ const sp=hfSpec(L.id), d=Math.max(1,(typeof cv!=='undefined'&&cv&&W>0)?cv.width/W:1);
  const x0=-4, y0=HF.top(dockY), x1=HF.pw()*1.14, y1=Math.min(H,HF.wl(dockY)+H*.24), key=[L.id,W,H,d,Math.round(night*24),P.rim,...sp.els.map(e=>hfChoice(L.id,e.id).join('.'))].join('|');
  let c=HF_CACHE[L.id]; if(c&&c.key===key) return c;
  if(!c){ c={cv:document.createElement('canvas')}; HF_CACHE[L.id]=c; } c.key=key; c.x=x0; c.y=y0; c.w=x1-x0; c.h=y1-y0;
  c.cv.width=Math.max(1,Math.ceil(c.w*d)); c.cv.height=Math.max(1,Math.ceil(c.h*d)); const x=c.cv.getContext('2d'); x.setTransform(d,0,0,d,-x0*d,-y0*d); x.clearRect(x0,y0,c.w,c.h);
  const N=col=>mix(col,'#0a1020',night*.55), ctx={x,P,night,dockY,N,id:L.id,pw:HF.pw(),wl:HF.wl(dockY),posts:[]};
  sp.paint(ctx); c.posts=ctx.posts; c.lights=ctx.lights||[]; return c; }
/* drawn every frame: paste the stored picture (with the bob), then the live parts */
function hfDraw(L,t,night,dockY,pb,P){ const sp=hfSpec(L.id), c=hfPaintCache(L,P,night,dockY), b=sp.floats?(pb||0):0;
  g.drawImage(c.cv,c.x,c.y+b,c.w,c.h);
  for(const p of c.posts){ const k=1+.18*Math.sin(t*1.7+p.x*.07); g.strokeStyle='rgba(255,255,255,'+(.28-night*.12)+')'; g.lineWidth=1; g.beginPath(); g.ellipse(p.x,HF.wl(dockY),p.w*1.25*k,Math.max(1.2,p.w*.26),0,0,7); g.stroke(); }
  const lit=clamp(night*1.2+P.d*.9,0,1), rgb=hfColour(L.id,'light');
  for(const l of c.lights){ const fl=.93+.07*Math.sin(t*7.1+l.x)*Math.sin(t*3.3+l.y);
    if(lit>.05){ v3glow(g,l.x,l.y+b,H*(l.r||.2),'rgba('+rgb+',.85)',lit*(l.a||.6)*fl); if(!l.small){ v3lightPool(l.x-W*.01,dockY-1+b,W*.075,rgb,.28*lit); v3lanternReflect(l.x,HF.wl(dockY),lit,t,rgb); } }
    g.fillStyle=lit>.05?'rgba(255,240,205,'+(.55+lit*.45)+')':(l.glass||'rgba(200,210,220,.55)'); g.beginPath(); g.arc(l.x,l.y+b,(l.small?H*.004:H*.008),0,7); g.fill(); } }

/* ---------- shared pieces for format homes (draw into the stored picture) ---------- */
/* the shore at the left edge, in the map's own ground */
/* the bank the home starts from: grass on top (lit edge), an earth face down to the water, stones and reeds at the water line.
   The deck rests on its edge (HF.x0), so the home is always tied to land */
function hfShore(o,grass,earth,stones,reeds){ const {x,N,P,dockY,wl,night}=o, x0=HF.x0(), top=dockY-H*.01, foot=x0+W*.03;
  /* a grassy bank sloping down into the water: grass on top, a little earth showing on the slope, stones and reeds at the water */
  x.fillStyle=N(mix(grass,'#000000',.28)); x.beginPath(); x.moveTo(-4,top); x.lineTo(x0*.85,top+H*.002); x.bezierCurveTo(x0*1.15,top+H*.01,foot*.95,wl-H*.03,foot,wl+H*.006); x.lineTo(-4,wl+H*.012); x.closePath(); x.fill();
  x.fillStyle=N(mix(earth,grass,.25)); x.beginPath(); x.moveTo(x0*.6,top+H*.03); x.bezierCurveTo(x0*1.0,top+H*.035,foot*.85,wl-H*.02,foot*.95,wl+H*.004); x.lineTo(x0*.5,wl+H*.006); x.closePath(); x.fill(); /* earth where the slope is steepest */
  x.fillStyle=N(grass); x.beginPath(); x.moveTo(-4,top-H*.004); x.quadraticCurveTo(x0*.5,top-H*.008,x0*.9,top+H*.001); x.bezierCurveTo(x0*1.1,top+H*.008,x0*1.15,top+H*.03,x0*.95,top+H*.034); x.quadraticCurveTo(x0*.5,top+H*.02,-4,top+H*.022); x.closePath(); x.fill();
  x.strokeStyle=N(mix(grass,'#ffffff',.18)); x.lineWidth=1; for(let i=0;i<12;i++){ const gx=x0*i/11, gy=top-H*.003+Math.sin(i*1.7)*1.2; x.beginPath(); x.moveTo(gx,gy+2); x.lineTo(gx+1.5,gy-H*.007); x.stroke(); } /* tufts */
  x.fillStyle=v3rgba(P.rim||'#fff0d0',.35*(1-night*.6)); x.fillRect(-4,top-H*.005,x0*.85,1.2);
  x.fillStyle=N('#f4e48a'); for(let i=0;i<3;i++){ x.beginPath(); x.arc(x0*(.2+i*.28),top-H*.004,1.6,0,7); x.fill(); } /* a few buttercups */
  for(let i=0;i<5;i++){ x.fillStyle=N(i%2?stones:mix(stones,'#ffffff',.18)); x.beginPath(); x.ellipse(x0*.4+i*(foot-x0*.4)/5,wl-H*.002+((i*7)%3),W*.007,H*.006,0,0,7); x.fill(); }
  if(reeds){ x.strokeStyle=N(reeds); x.lineWidth=1.3; for(let i=0;i<7;i++){ const rx=x0*.3+i*(foot-x0*.3)/7, rh=H*(.03+((i*13)%5)*.006); x.beginPath(); x.moveTo(rx,wl+H*.004); x.quadraticCurveTo(rx+2,wl-rh*.5,rx+((i%2)?3:-2),wl-rh); x.stroke(); } } }
/* a support standing IN the water: full colour above the water line, then darker, fading into the water (ripples are drawn live) */
function hfPost(o,px,w,col,kind){ const {x,N,P,dockY,wl}=o, wc=P.wMid||'#3a6a7a', top=dockY+Math.max(4,H*.012), c=N(col);
  if(kind==='stone'){ col=mix('#8a8a82',col,.3); /* stone keeps its stone look, tinted by the chosen colour */ for(let y=top,i=0;y<wl;y+=H*.016,i++){ x.fillStyle=N(i%2?mix(col,'#ffffff',.1):col); x.beginPath(); x.roundRect?x.roundRect(px-w/2-(i%2),y,w+(i%2)*2,H*.015,2):x.rect(px-w/2,y,w,H*.015); x.fill(); }
    x.fillStyle=N('#4e6a34'); x.fillRect(px-w/2,wl-H*.008,w,H*.006); }
  else { x.fillStyle=c; x.fillRect(px-w/2,top,w,wl-top);
    if(kind==='round'){ const gr=x.createLinearGradient(px-w/2,0,px+w/2,0); gr.addColorStop(0,v3rgba('#ffffff',.18*(1-o.night*.6))); gr.addColorStop(.45,v3rgba('#000000',0)); gr.addColorStop(1,v3rgba('#000000',.35)); x.fillStyle=gr; x.fillRect(px-w/2,top,w,wl-top); }
    else { x.fillStyle=mix(c,'#000000',.3); x.fillRect(px+w*.15,top,w*.35,wl-top); } }
  const gr=x.createLinearGradient(0,wl,0,wl+H*.22); gr.addColorStop(0,v3rgba(mix(c,wc,.45),.9)); gr.addColorStop(.55,v3rgba(mix(c,wc,.8),.45)); gr.addColorStop(1,v3rgba(wc,0)); x.fillStyle=gr; x.fillRect(px-w/2,wl,w,H*.22);
  o.posts.push({x:px,w}); }

/* ---------- Willow Pond: a lakeside dock (pilot) ---------- */
HOMEF.pond = { name:'Willow Pond dock', hname:'dock',
  els:[
    {id:'light', label:'Lantern', styles:['Lamp post','Hook lantern','String lights'], def:[0,0], colours:[['Warm gold','255,196,90'],['Candle','255,224,160'],['Rose','255,140,175'],['Sea glass','130,255,205'],['Moon blue','150,195,255'],['Lilac','195,150,255']]},
    {id:'deck', label:'Deck', styles:['Planks','Wide boards','Weathered boards'], def:[0,0], colours:[['Oak','#9a6a44'],['Birch','#c8a878'],['Walnut','#5e3e28'],['Driftwood','#8a8478'],['Painted white','#e6e2da'],['Sage','#8aa08a']]},
    {id:'posts', label:'Posts', styles:['Round posts','Square posts','Stone piers'], def:[0,0], colours:[['Dark oak','#4a3222'],['Weathered','#6e6658'],['Mossy','#4e5e3a'],['Painted white','#dedad2'],['River stone','#7a7a74'],['Charcoal','#2e2e32']]},
    {id:'rail', label:'Rail', styles:['No rail','Rope rail','Wooden rail'], def:[0,0], colours:[['Natural','#9a7a54'],['White','#ece8e0'],['Sage','#8aa08a'],['Barn red','#a8402e'],['Harbour blue','#3a6a9a'],['Charcoal','#34343a']]},
    {id:'canopy', label:'Canopy', styles:['Open sky','Striped awning','Willow arch'], def:[0,0], colours:[['Cream','#efe6d0'],['Sage','#9ab89a'],['Rose','#e8a8b0'],['Sky','#9ac0e0'],['Butter','#f0d890'],['Lilac','#c0a8e0']]}
  ],
  paint(o){ const {x,N,P,dockY,pw,id}=o, th=Math.max(4,H*.012), fh=Math.max(6,H*.018), night=o.night, rimA=.35*(1-night*.6);
    const deckC=hfColour(id,'deck'), postC=hfColour(id,'posts'), railC=hfColour(id,'rail'), canC=hfColour(id,'canopy'), x0=HF.x0(), at=f=>x0+(pw-x0)*f;
    /* posts */
    { const ps=hfStyle(id,'posts'), xs=[.06,.3,.53,.76,.97].map(at), w=ps===2?Math.max(8,W*.018):Math.max(5,W*.011);
      if(ps===1){ x.strokeStyle=N(mix(postC,'#000000',.2)); x.lineWidth=Math.max(2,W*.004); for(let i=0;i<xs.length-1;i++){ x.beginPath(); x.moveTo(xs[i],dockY+fh); x.lineTo(xs[i+1],o.wl-H*.01); x.moveTo(xs[i+1],dockY+fh); x.lineTo(xs[i],o.wl-H*.01); x.stroke(); } }
      for(const px of xs) hfPost(o,px,w,postC,['round','square','stone'][ps]); }
    hfShore(o,'#6a9a4a','#6a5440','#8a8a80','#6a8a3a');
    /* deck: surface, face, seams, lit edge */
    { const ds=hfStyle(id,'deck'), top=N(mix(deckC,'#ffffff',.08)), face=N(mix(deckC,'#000000',.24));
      x.fillStyle=face; x.fillRect(x0,dockY+th,pw-x0,fh-th);
      x.fillStyle=top; x.fillRect(x0,dockY,pw-x0,th);
      { const gr=x.createLinearGradient(0,dockY,0,dockY+th); gr.addColorStop(0,v3rgba('#ffffff',.1*(1-night*.6))); gr.addColorStop(1,v3rgba('#000000',.12)); x.fillStyle=gr; x.fillRect(x0,dockY,pw-x0,th); } /* soft shade across the boards */
      const n=ds===1?7:14; x.strokeStyle=N(mix(deckC,'#000000',.32)); x.lineWidth=1;
      for(let i=1;i<n;i++){ const sx=at(i/n)+(ds===2?((i*37)%7-3):0); x.beginPath(); x.moveTo(sx,dockY+.5); x.lineTo(sx,dockY+th); x.stroke(); }
      if(ds===2){ for(let i=0;i<n;i++){ x.fillStyle=v3rgba(i%3?'#000000':'#ffffff',.07); x.fillRect(at(i/n),dockY,(pw-x0)/n,th); } x.fillStyle=N(mix(deckC,'#000000',.4)); for(let i=0;i<5;i++){ x.beginPath(); x.ellipse(at(.1+i*.2),dockY+th*.5,1.6,.9,0,0,7); x.fill(); } }
      if(ds===1){ x.fillStyle=N(mix(deckC,'#ffffff',.18)); x.fillRect(x0,dockY+th,pw-x0,Math.max(2,fh*.25)); }
      x.strokeStyle=v3rgba('#000000',.08); for(let i=0;i<3;i++){ x.beginPath(); x.moveTo(x0,dockY+th*(.3+i*.22)); x.lineTo(pw,dockY+th*(.3+i*.22)+((i%2)?.6:-.6)); x.stroke(); } /* a hint of grain */
      x.fillStyle=N(mix(deckC,'#000000',.45)); for(let i=0;i<9;i++) x.fillRect(at(.05+i*.11),dockY+th+(fh-th)*.5,1.5,1.5); /* nails on the face */
      x.fillStyle=v3rgba(P.rim||'#fff0d0',rimA); x.fillRect(x0,dockY,pw-x0,1.2); }
    /* rail */
    { const rs=hfStyle(id,'rail'), rh=H*.045, rc=N(railC);
      if(rs===1){ const xs=[.02,.27,.52,.77,.98]; x.fillStyle=N(mix(railC,'#000000',.3)); for(const f of xs) x.fillRect(at(f)-1.5,dockY-rh,3,rh);
        x.strokeStyle=rc; x.lineWidth=Math.max(1.6,H*.0035); for(let i=0;i<xs.length-1;i++){ const a=at(xs[i]), b=at(xs[i+1]); x.beginPath(); x.moveTo(a,dockY-rh*.85); x.quadraticCurveTo((a+b)/2,dockY-rh*.45,b,dockY-rh*.85); x.stroke(); }
        x.strokeStyle=v3rgba('#ffffff',.25*(1-night*.6)); x.lineWidth=1; for(let i=0;i<xs.length-1;i++){ const a=at(xs[i]), b=at(xs[i+1]); x.beginPath(); x.moveTo(a,dockY-rh*.86-1); x.quadraticCurveTo((a+b)/2,dockY-rh*.46-1,b,dockY-rh*.86-1); x.stroke(); } }
      if(rs===2){ x.fillStyle=rc; for(let i=0;i<=6;i++) x.fillRect(at(i/6)-2,dockY-rh,4,rh); x.fillRect(x0,dockY-rh,pw-x0,Math.max(3,H*.006)); x.fillRect(x0,dockY-rh*.5,pw-x0,Math.max(2,H*.004));
        x.fillStyle=v3rgba(P.rim||'#fff0d0',rimA); x.fillRect(x0,dockY-rh,pw-x0,1); } }
    /* canopy (the free zone above the deck), over the left part so the angler stays in the open */
    { const cs=hfStyle(id,'canopy'), a=at(.03), b=at(.42), cc=N(canC), wood=N(mix(deckC,'#000000',.35));
      if(cs===1){ const ht=H*.17; x.fillStyle=wood; x.fillRect(a,dockY-ht,3,ht); x.fillRect(b-3,dockY-ht*.82,3,ht*.82);
        const y1=dockY-ht, y2=dockY-ht*.82; for(let i=0;i<8;i++){ const u0=i/8, u1=(i+1)/8; x.fillStyle=i%2?cc:N('#faf6ee'); x.beginPath(); x.moveTo(a+(b-a)*u0,y1+(y2-y1)*u0); x.lineTo(a+(b-a)*u1,y1+(y2-y1)*u1); x.lineTo(a+(b-a)*u1,y1+(y2-y1)*u1+H*.03); x.lineTo(a+(b-a)*u0,y1+(y2-y1)*u0+H*.03); x.closePath(); x.fill(); }
        for(let i=0;i<8;i++){ const u=(i+.5)/8; x.fillStyle=i%2?cc:N('#faf6ee'); x.beginPath(); x.arc(a+(b-a)*u,y1+(y2-y1)*u+H*.03,(b-a)/16,0,Math.PI); x.fill(); }
        x.fillStyle=v3rgba('#000000',.12); x.fillRect(a,dockY-1,b-a,1.5); }
      if(cs===2){ const ht=H*.18, mx=(a+b)/2; x.strokeStyle=wood; x.lineWidth=Math.max(3,W*.005); x.beginPath(); x.moveTo(a,dockY); x.lineTo(a,dockY-ht*.6); x.quadraticCurveTo(mx,dockY-ht*1.15,b,dockY-ht*.6); x.lineTo(b,dockY); x.stroke();
        for(let i=0;i<16;i++){ const u=i/15, px=a+(b-a)*u, py=dockY-ht*.6-Math.sin(u*Math.PI)*ht*.38, len=H*(.04+((i*7)%5)*.012); x.strokeStyle=N(i%3?'#5e8a3a':'#7aa44a'); x.lineWidth=1.4; x.beginPath(); x.moveTo(px,py); x.quadraticCurveTo(px+2,py+len*.5,px+((i%2)?3:-2),py+len); x.stroke();
          if(i%3===1){ x.fillStyle=cc; x.beginPath(); x.arc(px+((i%2)?3:-2),py+len,H*.004,0,7); x.fill(); } } } }
    /* the light fixture (its glow is drawn live) */
    { const ls=hfStyle(id,'light'), lx=HF.lightX(), iron=N('#2a2a30'); o.lights=[];
      if(ls===0){ x.fillStyle=iron; x.fillRect(lx-1.5,dockY-H*.1,3,H*.1); x.fillRect(lx-H*.009,dockY-H*.118,H*.018,2.5); x.strokeStyle=iron; x.lineWidth=1.2; x.strokeRect(lx-H*.008,dockY-H*.115,H*.016,H*.02); x.beginPath(); x.moveTo(lx-H*.01,dockY-H*.116); x.lineTo(lx,dockY-H*.128); x.lineTo(lx+H*.01,dockY-H*.116); x.stroke();
        o.lights.push({x:lx,y:dockY-H*.105}); }
      if(ls===1){ x.strokeStyle=iron; x.lineWidth=2.4; x.beginPath(); x.moveTo(lx,dockY); x.lineTo(lx,dockY-H*.12); x.quadraticCurveTo(lx,dockY-H*.135,lx-H*.014,dockY-H*.13); x.stroke(); x.lineWidth=1; x.beginPath(); x.moveTo(lx-H*.016,dockY-H*.128); x.lineTo(lx-H*.016,dockY-H*.118); x.stroke();
        x.strokeRect(lx-H*.023,dockY-H*.118,H*.014,H*.018); o.lights.push({x:lx-H*.016,y:dockY-H*.109}); }
      if(ls===2){ const a=at(.02), ht=H*.13; x.fillStyle=iron; x.fillRect(lx-1.5,dockY-ht,3,ht); x.fillRect(a-1.5,dockY-ht,3,ht);
        x.strokeStyle=N('#3a3a40'); x.lineWidth=1; x.beginPath(); x.moveTo(a,dockY-ht); x.quadraticCurveTo((a+lx)/2,dockY-ht+H*.03,lx,dockY-ht); x.stroke();
        for(let i=1;i<8;i++){ const u=i/8, bx=a+(lx-a)*u, by=dockY-ht+H*.03*4*u*(1-u)*.5+H*.004; o.lights.push({x:bx,y:by,small:1,r:.045,a:.45}); } }
    } }
};
/* the light fixture's spot is fixed by the format; the angler and pets stand on the same surface on every format home */

/* ---------- the Home page for a format home: a close-up of the home and its 5 elements (styles, then colours) ---------- */
function renderHomeF(P){ const sp=hfSpec(S.loc), L=LOCS[locIdx(S.loc)];
  const sw=(e,c,i,on)=>`<button type="button" class="chipb hf-col" data-act="hfcol" data-k="${e.id}" data-v="${i}" aria-pressed="${on}" title="${esc(c[0])}"><span class="hm-sw${e.id==='light'?' hm-glow':''}" style="background:${e.id==='light'?'radial-gradient(circle,rgb('+c[1]+') 0%,rgba('+c[1]+',.35) 55%,transparent 75%)':c[1]}"></span>${esc(c[0])}</button>`;
  P.innerHTML=`<i class="hf-mark" hidden></i><div class="row spread"><div><h2>Home</h2><p class="sub">Your ${esc(sp.hname)} at ${esc(L.name)}. Every part and colour here is free to change.</p></div></div>
   <div class="tile" style="margin-top:10px;padding:0;overflow:hidden"><canvas id="homecv" width="900" height="360" style="width:100%;height:auto;cursor:default"></canvas></div>`+
   sp.els.map(e=>{ const [s,c]=hfChoice(S.loc,e.id);
     return `<h5 data-hel="${e.id}">Style</h5><div class="chips" data-hel="${e.id}">${e.styles.map((n,i)=>`<button type="button" class="chipb" data-act="hfel" data-k="${e.id}" data-v="${i}" aria-pressed="${i===s}">${esc(n)}</button>`).join('')}</div>`+
       `<h5 data-hel="${e.id}">Colour</h5><div class="chips" data-hel="${e.id}">${e.colours.map((col,i)=>sw(e,col,i,i===c)).join('')}</div>`; }).join('');
  paintHome(); }
/* the 5 elements become the page's tabs */
function hfSections(P){ const sp=hfSpec(S.loc); if(!sp) return false; sectionize(P,'home',sp.els.map(e=>({name:e.label,nodes:[...P.querySelectorAll(':scope > [data-hel="'+e.id+'"]')]}))); return true; }
/* the Home view frames the home: its footprint, the free zone above it and the water under it, at the view's own shape */
function hfFrame(c,top){ const pw=HF.pw(), dy=HF.dockY(), want={x:0,y:HF.top(dy)+H*.02,w:pw*1.08,h:(HF.wl(dy)+H*.05)-(HF.top(dy)+H*.02)}, ar=c.width/c.height;
  let w=want.w, h=want.h; if(w/h<ar) w=h*ar; else h=w/ar;
  if(w>want.w/.5){ w=want.w/.5; h=w/ar; } /* a wide view: the home still fills about half of it (the top of the free zone may be cut) */
  let y=Math.min(want.y+want.h/2,dy-H*.03)-h/2; y=Math.max(top||0,Math.min(H-h,y)); return {sx:0,sy:y,sw:Math.min(W,w),sh:h}; }
/* a choice: the element's style or colour (saved with this water's home) */
function hfAct(b){ const a=b.dataset.act; if(a!=='hfel'&&a!=='hfcol') return undefined; const sp=hfSpec(S.loc), e=sp&&sp.els.find(x=>x.id===b.dataset.k), v=+b.dataset.v; if(!e) return 'skip';
  const cur=hfChoice(S.loc,e.id); if(a==='hfel'){ if(!(v>=0&&v<e.styles.length)) return 'skip'; cur[0]=v; } else { if(!(v>=0&&v<e.colours.length)) return 'skip'; cur[1]=v; }
  S.dock.el=hfClean(S.dock.el); S.dock.el[e.id]=cur; try{ sfx.coin(); }catch(er){} save(); return 'render'; }
