
// =====================================================================
// Driftline 2.0: Paths tab, Home (dock customization & cozy), Tide Pass,
// Fishing Derby, richer scenery for every water, two new waters' looks
// =====================================================================

// ---------- Paths (specialisations get their own tab) ----------
function renderPaths(P){ const specRow=(T,ti)=>{ const cur=S.specs[ti], locked=S.lvl<T.lvl;
    return `<div class="tile ${cur?'done':''}" style="${locked?'opacity:.55':''}"><div class="row spread"><h4>${T.name} <span class="meta">· unlocks at level ${T.lvl}</span></h4>${cur?`<span class="badge g">${T.opts.find(o=>o[0]===cur)[1]}</span>`:locked?`<span class="meta">Level ${S.lvl} / ${T.lvl}</span>`:'<span class="badge">Choose one</span>'}</div>
     <div class="grid" style="grid-template-columns:repeat(auto-fill,minmax(190px,1fr));margin-top:6px">${T.opts.map(o=>{ const on=cur===o[0];
       return `<button class="spec ${on?'on':''}" data-act="spec" data-k="${ti}:${o[0]}" ${locked||on||(cur&&S.money<specFee(ti))?'disabled':''}><b>${o[1]}</b><span class="up">▲ ${o[2]}</span><span class="down">▼ ${o[3]}</span>${cur&&!on&&!locked?`<span class="meta">Switch · ${fmt(specFee(ti))} coins</span>`:''}</button>`; }).join('')}</div></div>`; };
  P.innerHTML=`<h2>Paths</h2><p class="sub">Four forks on your angler’s road. Each choice gives something and takes something, so pick what fits how you like to fish. You can switch later for a fee.</p>
   <div style="display:flex;flex-direction:column;gap:10px;margin-top:12px">${SPEC_TIERS.map(specRow).join('')}</div>`; }

// ---------- Home: dock style, decorations, cozy ----------
const DOCK_WOODS = [['oak','Oak',0,'#6b4a2e'],['birch','Birch',1500,'#c8a878'],['walnut','Walnut',2500,'#3e2a1c'],['driftwood','Driftwood',2000,'#8a7a6a'],['white','Painted white',3000,'#e4e0d6'],
  ['blue','Harbour blue',3000,'#3a6f9a'],['red','Barn red',3000,'#9a3a2a'],['mint','Seafoam',3500,'#7fc8a9'],['pearl','Pearl',0,'#f0e8f4']];
// id, name, price, cozy points, source
const DOCK_DECOR = [['mug','Steaming Mug',600,1],['books','Stack of Books',800,1],['tacklebox','Tackle Box',900,1],['plants','Potted Plants',1200,2],['gnome','Dock Gnome',1500,1],['lantern','Lantern',1500,2],
  ['bunting','Bunting Flags',1800,2],['blanket','Picnic Blanket',2000,2],['umbrella','Beach Umbrella',2200,2],['chair','Cozy Chair',2500,3],['windchime','Wind Chime',2600,2],['birdhouse','Birdhouse',2800,2],
  ['catbed','Cat Bed',3000,2],['lights','String Lights',3500,3],['radio','Old Radio',4000,2],['campfire','Campfire',6000,4],['telescope','Telescope',9000,2],['cottage','Little Cottage',60000,6],
  ['tideflag','Tide Flag',0,2,'pass'],['shipwheel','Ship’s Wheel',0,3,'pass'],['minilight','Tiny Lighthouse',0,4,'pass']].map(a=>({id:a[0],name:a[1],price:a[2],cozy:a[3],src:a[4]||'shop'}));
const DOCKI = Object.fromEntries(DOCK_DECOR.map(d=>[d.id,d]));
const DOCK_SLOTS = 8;
let DOCK_PV=null;
const dockWood = () => { const w=DOCK_WOODS.find(x=>x[0]===((DOCK_PV&&DOCK_PV.kind==='wood')?DOCK_PV.id:S.dock.wood))||DOCK_WOODS[0]; return w[3]; };
function dockView(){ const d=S.dock.decor.slice(); if(DOCK_PV&&DOCK_PV.kind==='decor'&&!d.includes(DOCK_PV.id)) d.push(DOCK_PV.id); return d; }
function cozy(){ let c=S.dock.wood!=='oak'?1:0; for(const id of S.dock.decor) if(DOCKI[id]) c+=DOCKI[id].cozy; return c; }
const cozyBonus = () => Math.min(25,cozy());
const COZY_NAMES = [[0,'Bare boards'],[4,'Snug'],[9,'Homey'],[15,'Cozy'],[22,'Hygge']];
const cozyName = () => COZY_NAMES.filter(x=>cozy()>=x[0]).pop()[1];
function renderHome(P){ const wood=S.dock.wood, c=cozy(), cb=cozyBonus();
  const pvBar = DOCK_PV ? `<div class="pvbar"><span>Previewing on your dock: <b>${esc(DOCK_PV.name)}</b></span><span class="row"><button class="btn sm" data-act="${DOCK_PV.kind==='wood'?'dockwood':'dockdecor'}" data-k="${DOCK_PV.id}" ${S.money>=DOCK_PV.price?'':'disabled'}>Buy · <span class="coin">${fmt(DOCK_PV.price)}</span></button><button class="btn alt sm" data-act="dockpvoff">Stop</button></span></div>` : '';
  P.innerHTML=`<div class="row spread"><div><h2>Home</h2><p class="sub">Your dock goes with you to every water. Make it yours: pick the wood, add decorations, and the cozier it gets, the better you fish.</p></div>
   <div class="tile" style="min-width:200px"><div class="rar" style="color:#ff9ac0">Cozy level: ${cozyName()}</div><b>${c} ♥</b> <span class="meta">· +${cb}% XP, +${(cb*.5).toFixed(1)}% bite speed</span><div class="prog"><i style="width:${Math.min(1,c/25)*100}%;background:#ff9ac0"></i></div></div></div>
   ${pvBar}<div class="tile" style="margin-top:10px;padding:0;overflow:hidden"><canvas id="homecv" width="900" height="360" style="width:100%;height:auto;cursor:default"></canvas></div>${S.dock.decor.length?`<p class="sub" style="margin-top:6px">Drag a decoration along the dock to move it.</p>`:""}
   <h5>Wood</h5><div class="chips">${DOCK_WOODS.filter(w=>w[2]||S.dock.owned.includes(w[0])||w[0]==='oak').map(w=>{ const own=S.dock.owned.includes(w[0]); const pv=DOCK_PV&&DOCK_PV.kind==='wood'&&DOCK_PV.id===w[0];
     return `<button class="chipb" data-act="${own?'dockwood':'dockpv'}" data-k="${own?w[0]:'wood:'+w[0]}" aria-pressed="${wood===w[0]||pv}"><span style="display:inline-block;width:10px;height:10px;border-radius:3px;background:${w[3]};margin-right:6px;vertical-align:-1px"></span>${w[1]}${own?'':' · '+fmt(w[2])}</button>`; }).join('')}</div>
   <h5>Decorations · ${S.dock.decor.length} of ${DOCK_SLOTS} placed</h5><div class="grid" style="grid-template-columns:repeat(auto-fill,minmax(150px,1fr))">${DOCK_DECOR.map(d=>{ const own=S.dock.owned.includes(d.id), placed=S.dock.decor.includes(d.id), hidden=!own&&d.src!=='shop';
     return `<div class="tile ${placed?'done':''}" style="align-items:center;text-align:center;gap:4px"><canvas width="160" height="120" data-dock="${d.id}" data-own="${own||!hidden?1:0}" style="width:80px;height:60px;cursor:default"></canvas><b style="font-size:14px">${hidden?'???':d.name}</b><span class="meta">+${d.cozy} ♥ cozy</span>
     ${own?`<button class="btn ${placed?'alt':''} sm" data-act="dockdecor" data-k="${d.id}">${placed?'Remove':'Place'}</button>`:hidden?'<span class="meta">A Tide Pass reward</span>':`<div class="row" style="justify-content:center;gap:4px"><button class="btn alt sm" data-act="dockpv" data-k="decor:${d.id}">Preview</button><button class="btn sm" data-act="dockdecor" data-k="${d.id}" ${S.money>=d.price?'':'disabled'}>Buy · <span class="coin">${fmt(d.price)}</span></button></div>`}</div>`; }).join('')}</div>`;
  P.querySelectorAll('canvas[data-dock]').forEach(cv2=>{ const x=cv2.getContext('2d'); x.clearRect(0,0,160,120); if(cv2.dataset.own!=='1') mysteryThumb(x,160,120,cv2.dataset.dock); else drawDockItem(x,cv2.dataset.dock,80,100,2.6,0,0); });
  paintHome(); homeDragSetup(); }
function paintHome(){ const c=$("homecv"); if(!c) return; if(V3ON && paintHome3(c)) return; const x=c.getContext('2d'), w=c.width, h=c.height, t=performance.now()/1000; x.clearRect(0,0,w,h);
  const sky=x.createLinearGradient(0,0,0,h*.6); sky.addColorStop(0,'#86bcd9'); sky.addColorStop(1,'#f2dcb6'); x.fillStyle=sky; x.fillRect(0,0,w,h*.6);
  const wt=x.createLinearGradient(0,h*.55,0,h); wt.addColorStop(0,'#3f827b'); wt.addColorStop(1,'#173e42'); x.fillStyle=wt; x.fillRect(0,h*.55,w,h*.45);
  const dy=h*.62, s=2.4; x.fillStyle=dockWood(); x.fillRect(0,dy,w*.92,14); x.fillStyle=mix(dockWood(),'#000000',.3); for(let i=0;i<5;i++) x.fillRect(30+i*w*.2,dy+14,12,h-dy); x.fillStyle=mix(dockWood(),'#ffffff',.12); for(let px=0;px<w*.92;px+=26) x.fillRect(px,dy,2,14);
  const items=dockView(); const xs=homeSlots(items.length,w*.04,w*.88,w*.5,w*.62);
  items.forEach((id,i)=>drawDockItem(x,id,xs[i],dy,s*(id==='cottage'?.9:1),t,0));
  drawPetStyled(x,S.pet,w*.5,dy,S.pet==='horse'||S.pet==='cow'?2.2:3,t); drawAngler(x,w*.58,dy,2.6,S.look,{t}); }
function homeSlots(n,x0,x1,avoid0,avoid1){ const out=[]; const span=(x1-x0)-(avoid1-avoid0); for(let i=0;i<n;i++){ let x=x0+span*(i+.5)/Math.max(n,1); if(x>avoid0) x+=avoid1-avoid0; out.push(x); } return out; }
// decorations drawn on the dock in the scene, behind the angler
function drawHome(L,t,night,dockY,pb,sc){ const items=dockView(); if(!items.length) return; const PW=W*.19, ax=W*.12;
  const surf = dockY+pb, X0=W*.008, X1=PW-W*.012, P=dockPositions(items,(ax-40*sc-X0)/(X1-X0),(ax+12*sc-X0)/(X1-X0));
  const cot=items.indexOf('cottage'); if(cot>=0) drawDockItem(g,'cottage',W*.045,surf,sc*1.5,t,night,true);
  items.forEach(id=>{ if(id==='cottage'||P[id]==null) return; drawDockItem(g,id,X0+P[id]*(X1-X0),surf,sc*dockItemScale(id),t,night); }); }
function drawDockItem(c,id,x,y,s,t,night,back){ c.save(); c.translate(x,y); c.scale(s,s); const D=cl=>night?mix(cl,'#0a1018',night*.45):cl; c.lineCap='round';
  const R=(x,y,w,h,cl)=>{ c.fillStyle=D(cl); c.fillRect(x,y,w,h); }, Ci=(x,y,r,cl)=>{ c.fillStyle=D(cl); c.beginPath(); c.arc(x,y,r,0,7); c.fill(); }, glow=(gx,gy,r,col)=>{ if(night<.25 && !back) return; const gr=c.createRadialGradient(gx,gy,1,gx,gy,r); gr.addColorStop(0,col); gr.addColorStop(1,'rgba(0,0,0,0)'); c.fillStyle=gr; c.fillRect(gx-r,gy-r,r*2,r*2); };
  switch(id){
    default: drawDockZ(c,id,t,R,Ci,D); break;
    case 'mug': R(-3,-6,6,6,'#d8553a'); c.strokeStyle=D('#d8553a'); c.lineWidth=1.2; c.beginPath(); c.arc(3.5,-3,1.8,-1.5,1.5); c.stroke(); c.strokeStyle='rgba(255,255,255,.5)'; c.lineWidth=.8; for(let i=0;i<2;i++){ c.beginPath(); c.moveTo(-1+i*2,-7); c.quadraticCurveTo(-2+i*2+Math.sin(t*2+i)*1.5,-11,-1+i*2,-14); c.stroke(); } break;
    case 'books': R(-6,-3,12,3,'#3a6f9a'); R(-5,-6,11,3,'#c8553a'); R(-6,-9,10,3,'#4f8a4a'); R(-4,-11,8,2,'#e0c050'); break;
    case 'tacklebox': R(-7,-7,14,7,'#4a7a4a'); R(-7,-8,14,2,'#3a6a3a'); R(-2,-10,4,2,'#888'); break;
    case 'plants': for(const [px,cl] of [[-5,'#c8703a'],[4,'#a85a3a']]){ c.fillStyle=D(cl); c.beginPath(); c.moveTo(px-3,0); c.lineTo(px-4,-6); c.lineTo(px+4,-6); c.lineTo(px+3,0); c.fill(); for(let i=-2;i<=2;i++){ c.strokeStyle=D('#3a9a4a'); c.lineWidth=1.4; c.beginPath(); c.moveTo(px,-6); c.quadraticCurveTo(px+i*2,-10,px+i*3+Math.sin(t+i)*.6,-14+Math.abs(i)); c.stroke(); } } Ci(5,-14,1.4,'#ff7ab0'); break;
    case 'gnome': c.fillStyle=D('#d8473a'); c.beginPath(); c.moveTo(-3,-9); c.lineTo(3,-9); c.lineTo(0,-17); c.fill(); Ci(0,-8,2.5,'#f6d0b0'); c.fillStyle=D('#f4f4f4'); c.beginPath(); c.moveTo(-2.5,-7); c.lineTo(2.5,-7); c.lineTo(0,-2); c.fill(); R(-3,-3,6,3,'#3a6fca'); break;
    case 'lantern': R(-.7,-20,1.4,20,'#3a2a1a'); R(-3,-26,6,6,'#2a2a2a'); R(-2.2,-25,4.4,4.4,night>.25?'#ffe08a':'#c8b880'); glow(0,-23,28,'rgba(255,216,138,.35)'); break;
    case 'bunting': { c.strokeStyle=D('#c8b08a'); c.lineWidth=.6; c.beginPath(); c.moveTo(-12,-22); c.quadraticCurveTo(0,-17,12,-22); c.stroke(); R(-12.5,-22,1,22,'#5a3a20'); R(11.5,-22,1,22,'#5a3a20'); const cols=['#ff6a6a','#ffd84a','#5aa9ff','#7fc8a9','#c38bff']; for(let i=0;i<5;i++){ const fx=-9+i*4.5, fy=-20.5+Math.sin((i/4)*Math.PI)*2.2; c.fillStyle=D(cols[i]); c.beginPath(); c.moveTo(fx-1.6,fy); c.lineTo(fx+1.6,fy); c.lineTo(fx,fy+3.4+Math.sin(t*3+i)*.3); c.fill(); } break; }
    case 'blanket': c.fillStyle=D('#d84a4a'); c.beginPath(); c.moveTo(-10,0); c.lineTo(10,0); c.lineTo(8,-2.5); c.lineTo(-8,-2.5); c.fill(); c.fillStyle=D('#ffffff'); for(let i=-8;i<8;i+=4) c.fillRect(i,-2.5,2,2.5); R(-3,-5,6,3,'#c89a5a'); break;
    case 'umbrella': R(-.5,-22,1,22,'#ddd'); c.fillStyle=D('#ff7a5a'); c.beginPath(); c.moveTo(-12,-18); c.quadraticCurveTo(0,-30,12,-18); c.closePath(); c.fill(); c.fillStyle=D('#ffffff'); c.beginPath(); c.moveTo(-4,-18); c.quadraticCurveTo(0,-29.5,4,-18); c.closePath(); c.fill(); break;
    case 'chair': R(-6,-6,12,2,'#8a5a3a'); R(-6,-14,2,10,'#8a5a3a'); R(-6,-4,1.5,4,'#6a4228'); R(4.5,-4,1.5,4,'#6a4228'); R(-5,-13,2.4,7,'#d8a84a'); R(-4,-6.5,9,2,'#d8a84a'); R(4,-9,2,5,'#8a5a3a'); break;
    case 'windchime': R(-.5,-26,1,4,'#888'); R(-5,-22,10,1.2,'#8a6a4a'); for(let i=0;i<4;i++){ const sw=Math.sin(t*2+i)*.8; R(-4+i*2.6+sw,-21,1,6+i%2*2,'#b8c8d8'); } break;
    case 'birdhouse': R(-.6,-16,1.2,16,'#5a3a20'); R(-4,-24,8,8,'#4a8ab8'); c.fillStyle=D('#c8553a'); c.beginPath(); c.moveTo(-5.5,-24); c.lineTo(0,-28); c.lineTo(5.5,-24); c.fill(); Ci(0,-20.5,1.4,'#1a1a1a'); if(night<.5 && Math.sin(t*.7)>.5){ Ci(5,-27,1.4,'#c86a3a'); } break;
    case 'catbed': c.fillStyle=D('#9a5aa8'); c.beginPath(); c.ellipse(0,-2,8,3.4,0,0,7); c.fill(); c.fillStyle=D('#c89ad8'); c.beginPath(); c.ellipse(0,-3,6,2,0,0,7); c.fill(); break;
    case 'lights': { c.strokeStyle=D('#444'); c.lineWidth=.5; c.beginPath(); c.moveTo(-14,-24); c.quadraticCurveTo(0,-18,14,-24); c.stroke(); R(-14.5,-24,1,24,'#5a3a20'); R(13.5,-24,1,24,'#5a3a20'); const cols=['#ffd84a','#ff7a5a','#7fc8a9','#5aa9ff','#ff9ad0'];
      for(let i=0;i<7;i++){ const lx=-12+i*4, ly=-22.6+Math.sin((i/6)*Math.PI)*2.8, on=night>.25; c.fillStyle=on?cols[i%5]:D('#c8c0a0'); c.beginPath(); c.arc(lx,ly+1,1.1,0,7); c.fill(); if(on){ const gr=c.createRadialGradient(lx,ly+1,.5,lx,ly+1,6); gr.addColorStop(0,cols[i%5]+'88'); gr.addColorStop(1,'rgba(0,0,0,0)'); c.fillStyle=gr; c.fillRect(lx-6,ly-5,12,12); } } break; }
    case 'radio': R(-6,-7,12,7,'#a85a3a'); R(-5,-6,5,5,'#c8b890'); Ci(3,-3.5,1.8,'#2a2a2a'); R(-1,-10,.8,3,'#888'); if(Math.sin(t*.8)>0){ c.fillStyle='rgba(255,255,255,.7)'; c.font='6px system-ui'; c.fillText('♪',6+Math.sin(t*2)*2,-10-((t*6)%6)); } break;
    case 'campfire': { for(let i=-1;i<=1;i++){ c.save(); c.rotate(i*.5); R(-6,-1.4,12,2.4,'#6a4228'); c.restore(); } const fl=Math.sin(t*12)*.6; c.fillStyle='#ff7a1a'; c.beginPath(); c.moveTo(-4,-1); c.quadraticCurveTo(-2,-9-fl,0,-12+fl); c.quadraticCurveTo(2,-9+fl,4,-1); c.fill(); c.fillStyle='#ffd84a'; c.beginPath(); c.moveTo(-2,-1); c.quadraticCurveTo(0,-7+fl,2,-1); c.fill();
      { const gr=c.createRadialGradient(0,-4,1,0,-4,night>.25?42:14); gr.addColorStop(0,'rgba(255,150,60,.35)'); gr.addColorStop(1,'rgba(0,0,0,0)'); c.fillStyle=gr; c.fillRect(-42,-46,84,84); } c.fillStyle='rgba(200,200,200,.25)'; for(let i=0;i<3;i++){ const k=((t*.4+i/3)%1); c.beginPath(); c.arc(Math.sin(t+i)*3,-14-k*20,2+k*3,0,7); c.fill(); } break; }
    case 'telescope': R(-.6,-10,1.2,10,'#5a3a20'); R(-4,-2,8,1,'#5a3a20'); c.save(); c.translate(0,-11); c.rotate(-.5); R(-7,-1.8,14,3.6,'#c8a050'); R(6,-2.2,3,4.4,'#a88030'); c.restore(); break;
    case 'cottage': { c.save(); if(back) c.globalAlpha=.97; R(-16,-26,32,26,'#c8a878'); c.fillStyle=D('#8a3a2a'); c.beginPath(); c.moveTo(-20,-26); c.lineTo(0,-42); c.lineTo(20,-26); c.fill(); R(8,-44,5,10,'#6a4a3a'); R(-4,-14,8,14,'#6a3a20'); const win=night>.25?'#ffd88a':'#9ad0e8'; R(-13,-20,7,6,win); R(7,-20,7,6,win);
      if(night>.25){ const gr=c.createRadialGradient(-9,-17,1,-9,-17,18); gr.addColorStop(0,'rgba(255,210,130,.4)'); gr.addColorStop(1,'rgba(0,0,0,0)'); c.fillStyle=gr; c.fillRect(-28,-36,40,40); }
      c.fillStyle='rgba(220,220,220,.35)'; for(let i=0;i<4;i++){ const k=((t*.25+i/4)%1); c.beginPath(); c.arc(10.5+k*6,-46-k*22,2+k*4,0,7); c.fill(); } c.restore(); break; }
    case 'tideflag': R(-.6,-26,1.2,26,'#ddd'); c.fillStyle=D('#2a8aa8'); c.beginPath(); c.moveTo(.6,-26); c.quadraticCurveTo(7,-24+Math.sin(t*3)*1.5,13,-26+Math.sin(t*3+1)); c.lineTo(13,-18+Math.sin(t*3+1)); c.quadraticCurveTo(7,-16+Math.sin(t*3)*1.5,.6,-18); c.fill(); c.strokeStyle='#fff'; c.lineWidth=.8; c.beginPath(); c.moveTo(3,-22); c.quadraticCurveTo(6,-24,9,-22); c.stroke(); break;
    case 'shipwheel': { c.save(); c.translate(0,-11); c.rotate(Math.sin(t*.5)*.3); c.strokeStyle=D('#8a5a2a'); c.lineWidth=1.6; c.beginPath(); c.arc(0,0,7,0,7); c.stroke(); for(let i=0;i<8;i++){ const a=i*Math.PI/4; c.beginPath(); c.moveTo(0,0); c.lineTo(Math.cos(a)*10,Math.sin(a)*10); c.stroke(); } Ci(0,0,2,'#c8a050'); c.restore(); R(-.8,-4,1.6,4,'#6a4228'); break; }
    case 'minilight': { R(-3,-22,6,22,'#f4f0e8'); R(-3,-16,6,3,'#c8403a'); R(-3,-8,6,3,'#c8403a'); R(-4,-26,8,4,'#333'); R(-2.4,-25.4,4.8,2.8,night>.25?'#fff2a8':'#d8d0a0'); if(night>.25){ c.fillStyle='rgba(255,240,170,.14)'; c.beginPath(); c.moveTo(0,-24); const a=t*1.5; c.lineTo(Math.cos(a)*70,-24-14); c.lineTo(Math.cos(a)*70,-24+14); c.fill(); } break; }
  }
  c.restore(); }

// ---------- Tide Pass (0.3: a longer climb, a Tide-only item every five levels, every reward spelled out) ----------
const PASS_MAX = 50;
const passNeed = L => Math.round(180 + L*45 + L*L*.8);
const PASS_XP = [8,14,30,60,150,400];
const PASS_SPECIAL = {3:['dock','tideflag','Tide Flag','Dock decoration: a flag that ripples in the wind.'], 5:['shoe','tidetreads','Tide Treads','Shoes: sea-glass boots with a rolling wave stripe.'],
  8:['tint','tidal','Tidal pet colour','Pet colour: recolours any pet in deep sea blues.'], 10:['neck','tidescarf','Tide Scarf','Neckwear: a long scarf of sea foam that drifts behind you.'],
  12:['hat','tidecap','Tide Cap','Hat: a captain’s cap with the Tide crest.'], 15:['bait','mythbait','6 Myth Bait','Bait: legendary fish are far more likely to bite.'],
  18:['dock','shipwheel','Ship’s Wheel','Dock decoration: an old helm that turns in the breeze.'], 20:['back','tidecape','Tide Cape','On your back: a cape of rolling water that shimmers as it moves.'],
  25:['wood','pearl','Pearl dock wood','Dock wood: pale, pearly planks for your Home dock.'], 30:['out','tidecoat','Tide Coat','Outfit: a long coat with a glowing wave hem.'],
  35:['back','shellpack','Seashell Pack','On your back: a backpack made from a giant scallop shell.'], 40:['dock','minilight','Tiny Lighthouse','Dock decoration: its beam sweeps the water at night.'],
  45:['crate2','legend','2 Legendary Crates','Two Legendary Mystery Crates, the best crates there are.'], 50:['back','tidewings','Tide Wings','On your back: wings of living water. The rarest thing in the Pass.']};
// regular levels cycle through these, every amount shown before you claim it
function passPlain(L){ const base=bestLoot(); if(L>PASS_MAX) return {k:'bonus', name:'Coins and 20 Scales', d:fmt(Math.round(base*12*coinMult()))+' coins and 20 Scales.'};
  return [{k:'big', name:'Big Mystery Crate', d:'Clothes, decor and the rarer pets.'},{k:'coins', name:fmt(Math.round(base*10*coinMult()))+' coins', d:'Straight to your purse.'},{k:'scales', name:'15 Scales', d:'Level up rods, buy attachments and special bait.'},{k:'tix', name:'100 tickets', d:'Spend them at the Boardwalk prize counter.'},{k:'small', name:'Small Mystery Crate', d:'Coins and lures, sometimes a pet.'}][L%5]; }
function passReward(L){ const sp=PASS_SPECIAL[L]; return sp?sp[2]:passPlain(L).name; }
function grantPass(L){ const sp=PASS_SPECIAL[L], base=bestLoot(); if(L%10===0 && maxed('tidewalker')) S.tokens.big++;
  if(sp){ const [k,id]=sp; if(k==='dock'&&!S.dock.owned.includes(id)) S.dock.owned.push(id); if(k==='tint'&&!S.petTints.includes(id)) S.petTints.push(id); if(k==='hat'&&!S.owned.hats.includes(id)) S.owned.hats.push(id);
    if(k==='wood'&&!S.dock.owned.includes(id)) S.dock.owned.push(id); if(k==='out'&&!S.owned.outfits.includes(id)) S.owned.outfits.push(id); if(k==='crate2') S.tokens.legend+=2; if(k==='bait') S.bait[id]=(S.bait[id]||0)+6;
    if(k==='shoe'&&!S.owned.shoes.includes(id)) S.owned.shoes.push(id); if(k==='neck'&&!S.owned.necks.includes(id)) S.owned.necks.push(id); if(k==='back'&&!S.owned.backs.includes(id)) S.owned.backs.push(id); return sp[2]; }
  if(L>PASS_MAX){ earn(base*12*coinMult()); S.scales+=20; return 'Coins and 20 Scales'; }
  const p=passPlain(L); switch(p.k){ case 'big': S.tokens.big++; break; case 'coins': earn(base*10*coinMult()); break; case 'scales': S.scales+=15; break; case 'tix': S.tickets+=100; break; case 'small': S.tokens.small++; break; } return p.name; }
function addPassXP(n){ S.pass.xp+=Math.round(n*(1+.06*pr('tidewalker'))); let ups=0; while(S.pass.xp>=passNeed(S.pass.lvl+1)){ S.pass.xp-=passNeed(S.pass.lvl+1); S.pass.lvl++; ups++; } if(ups){ setTimeout(()=>toast('Tide Pass level '+S.pass.lvl+'! Rewards are waiting in the Pass tab.'),1300); } }
function passArt(x,w,h,L){ const sp=PASS_SPECIAL[L]; x.clearRect(0,0,w,h); const cx=w/2, s=w/120;
  if(sp){ const [k,id]=sp; if(k==='dock') drawDockItem(x,id,cx,h*.9,2.4*s,performance.now()/1000,0); else if(k==='hat') hatPreview(x,w,h,id,S.look.hatCol); else if(k==='out') drawAngler(x,cx,h*.96,h/80,Object.assign({},S.look,{outfit:id,hat:'none'}),{});
    else if(k==='tint') drawPetStyled(x,S.pet,cx,h*.86,2.8*s,0,0,Object.assign({},petLook(),{tint:id})); else if(k==='wood'){ x.fillStyle='#f0e8f4'; x.fillRect(w*.08,h*.5,w*.84,h*.13); x.fillStyle='#c8b8d0'; for(let i=0;i<5;i++) x.fillRect(w*(.12+i*.17),h*.5,2*s,h*.13); }
    else if(k==='shoe'||k==='neck'||k==='back') wearPreview(x,k,id,w,h); else if(k==='bait') drawJunk(x,w,h,'goldlure'); else drawJunk(x,w,h,'chest'); return; }
  const p=L>PASS_MAX?{k:'coins'}:passPlain(L); if(p.k==='big'||p.k==='small') drawJunk(x,w,h,'chest'); else if(p.k==='coins'||p.k==='bonus') drawJunk(x,w,h,'coin');
  else if(p.k==='scales'){ x.fillStyle='#7fc8a9'; x.beginPath(); for(let i=0;i<6;i++){ const a=i/6*Math.PI*2; x.lineTo(cx+Math.cos(a)*24*s,h/2+Math.sin(a)*24*s); } x.fill(); } else { x.font=Math.round(34*s)+'px system-ui'; x.textAlign='center'; x.fillText('🎟',cx,h*.64); } }
function renderPass(P){ const pl=S.pass.lvl, need=passNeed(pl+1), unclaimed=pl-S.pass.claimed;
  const shown=[]; const start=Math.max(1,Math.min(S.pass.claimed+1, pl+1)-2); for(let L=start; L<start+15; L++) shown.push(L);
  const nextSp=Object.keys(PASS_SPECIAL).map(Number).find(L=>L>pl), ns=nextSp&&PASS_SPECIAL[nextSp];
  P.innerHTML=`<div class="row spread"><div><h2>Tide Pass</h2><p class="sub">Every fish you land fills the Tide Pass. Rarer fish fill it faster. ${PASS_MAX} levels, a Tide-only reward every five levels, then bonus rewards forever.</p></div>
   <div class="tile" style="min-width:220px"><div class="rar" style="color:var(--kelp)">Level ${pl}</div><div class="meta">${fmt(S.pass.xp)} / ${fmt(need)} to level ${pl+1}</div><div class="prog"><i style="width:${S.pass.xp/need*100}%;background:var(--kelp)"></i></div>
   ${unclaimed?`<button class="btn" data-act="passclaim" style="margin-top:6px">Claim ${unclaimed} reward${unclaimed>1?'s':''}</button>`:''}</div></div>
   ${ns?`<div class="tile pass-next"><canvas width="240" height="180" data-passbig="${nextSp}"></canvas><div><span class="bwx-cat">Next Tide reward · level ${nextSp}</span><h3 style="margin:2px 0">${esc(ns[2])}</h3><div class="meta">${esc(ns[3])}</div><div class="meta" style="margin-top:6px">${nextSp-pl} level${nextSp-pl>1?'s':''} to go.</div></div></div>`:''}
   <div class="passtrack">${shown.map(L=>{ const got=L<=S.pass.claimed, ready=!got&&L<=pl, sp=PASS_SPECIAL[L], d=sp?sp[3]:passPlain(L).d;
     return `<div class="passcell ${got?'got':''} ${ready?'ready':''} ${sp?'special':''}" title="${esc(d)}"><span class="lv">${L}</span><canvas width="120" height="90" data-pass="${L}"></canvas><b style="font-size:12.5px;line-height:1.2">${got?'✓ ':''}${esc(passReward(L))}</b><span class="meta" style="font-size:11px;line-height:1.25">${esc(d)}</span></div>`; }).join('')}</div>
   <p class="sub" style="margin-top:8px">Fish ×${PASS_XP.join(' / ')} XP by rarity. Shiny ×2, trophy ×1.5. Daily tasks and derbies give extra.</p>`;
  P.querySelectorAll('canvas[data-pass]').forEach(cv2=>passArt(cv2.getContext('2d'),120,90,+cv2.dataset.pass));
  P.querySelectorAll('canvas[data-passbig]').forEach(cv2=>passArt(cv2.getContext('2d'),240,180,+cv2.dataset.passbig)); }

// ---------- Fishing Derby ----------
const DERBY_LEN = 4*60*1000;
const RIVALS = [['Old Pete','has fished here since before the dock'],['Marina','never misses a hook'],['Captain Gull','a seagull in a captain’s hat']];
function derbyCost(){ return Math.round(bestLoot()*3); }
function startDerby(){ const sps=spAt(S.loc).filter(s=>s.r<=1); const mean=sps.reduce((a,s)=>a+(s.min+s.max)/2*RAR[s.r].w,0)/sps.reduce((a,s)=>a+RAR[s.r].w,0);
  const soft=(1-.04*pr('derbypro'))*(relic('derbyhorn')?.9:1);
  const rivals=RIVALS.map((r,i)=>({name:r[0], score:+(mean*14*[.7,1,1.35][i]*rnd(.85,1.15)*soft).toFixed(1)}));
  S.derby={until:Date.now()+(maxed('derbypro')?5*60*1000:DERBY_LEN), loc:S.loc, total:0, n:0, best:0, rivals}; toast('The derby has begun! Heaviest total catch at '+curLoc().name+' in 4 minutes wins.'); sfx.catch(3); }
function derbyCatch(f){ const d=S.derby; if(!d||Date.now()>d.until||S.loc!==d.loc||f.kind!=='fish') return; d.total=+(d.total+f.kg).toFixed(2); d.n++; d.best=Math.max(d.best,f.kg); }
function derbyPlace(){ const d=S.derby; return 1+d.rivals.filter(r=>r.score>d.total).length; }
function endDerby(){ const d=S.derby; if(!d) return; const place=derbyPlace(), base=bestLoot(); S.derby=null; const medal=['gold','silver','bronze'][place-1]; let txt;
  if(medal){ const m=[1,.5,.25][place-1]; const coins=earn(base*25*m*coinMult()), sc=Math.round(30*m), tk=Math.round(150*m); S.scales+=sc; S.tickets+=tk; S.medals[medal]++; addPassXP(300*m); txt=`+${fmt(coins)} coins, +${sc} Scales, +${tk} tickets`; sfx.catch(4); }
  else { S.tickets+=20; txt='+20 tickets for taking part'; sfx.lost(); }
  G.st = G.st==='idle'||G.st==='result'?G.st:G.st; $('evin').innerHTML=`<div class="rar" style="color:var(--gold)">Fishing derby results</div><h3>${medal?['🥇 First place!','🥈 Second place','🥉 Third place'][place-1]:'Fourth place. Next time!'}</h3>
   <div class="list" style="margin:8px 0">${[{name:'You',score:d.total},...d.rivals].sort((a,b)=>b.score-a.score).map((r,i)=>`<div class="row spread prize"><span>${i+1}. <b>${esc(r.name)}</b></span><span>${r.score.toFixed(1)} kg</span></div>`).join('')}</div>
   <p class="sub">${txt}</p><button class="btn" data-ev="skip">Back to fishing</button>`; if(G.st==='idle'){ G.st='event'; $('evcard').hidden=false; } else { setTimeout(()=>{ if(G.st==='idle'){ G.st='event'; $('evcard').hidden=false; } else toast('Derby over: place '+place+'. '+txt); },2500); } checkFeats(); save(); }
setInterval(()=>{ if(S.derby && Date.now()>=S.derby.until) endDerby(); const dl=$('derbyleft'); if(dl&&S.derby) dl.textContent=mmss(Math.max(0,Math.ceil((S.derby.until-Date.now())/1000)))+' left'; },1000);
function derbyHTML(){ const d=S.derby; if(d){ const left=Math.max(0,Math.ceil((d.until-Date.now())/1000));
    return `<div class="tile bwt" style="--c:#ffc94d;margin-bottom:12px"><div class="row spread"><h4>Fishing derby at ${LOCS[locIdx(d.loc)].name}</h4><span class="badge g" id="derbyleft">${mmss(left)} left</span></div><div class="meta">Your total: <b>${d.total.toFixed(1)} kg</b> from ${d.n} fish · you’re in place ${derbyPlace()}${S.loc!==d.loc?' · <span style="color:var(--danger)">travel back there for catches to count!</span>':''}</div>
     ${d.rivals.map(r=>`<div class="meta">${esc(r.name)}: ${r.score.toFixed(1)} kg</div>`).join('')}</div>`; }
  return `<div class="tile bwt" style="--c:#ffc94d;margin-bottom:12px"><div class="row spread"><div><h4>Fishing derby</h4><div class="meta">Four minutes at ${curLoc().name}: land the heaviest total catch to beat ${RIVALS.map(r=>r[0]).join(', ')}. Medals pay coins, Scales, tickets and Tide Pass XP.</div><div class="meta">Medals: 🥇 ${S.medals.gold} · 🥈 ${S.medals.silver} · 🥉 ${S.medals.bronze}</div></div>
    <button class="btn" data-act="derby" ${S.money>=derbyCost()&&G.st==='idle'?'':'disabled'}>Enter · <span class="coin">${fmt(derbyCost())}</span></button></div></div>`; }
function drawDerbyHUD(){ const d=S.derby; if(!d) return; const left=Math.max(0,Math.ceil((d.until-Date.now())/1000)); const txt='🏆 Derby '+mmss(left)+' · '+d.total.toFixed(1)+' kg · #'+derbyPlace()+(S.loc!==d.loc?' (wrong water)':'');
  g.font='700 12px system-ui'; const tw=g.measureText(txt).width; g.fillStyle='rgba(5,14,20,.78)'; rr(W-tw-34,40,tw+20,24,12); g.fill(); g.fillStyle='#ffc94d'; g.textAlign='left'; g.fillText(txt,W-tw-24,56); }

// ---------- richer scenery ----------
const MOUNT = {pond:['#7a9ab8',.16],river:['#6a8aa8',.22],coast:['#9aa8b8',.12],frost:['#c8d8e8',.24],reef:['#7ab8c8',.1],ember:['#5a3a3a',.26],starfall:['#4a3a8a',.14]};
function drawBackLayer(L,t,night,hz,skyBot){ const m=MOUNT[L.id]; const t0=t;
  if(m){ const col=mix(mix(m[0],skyBot,.45),'#0a1220',night*.6); g.fillStyle=col; g.beginPath(); g.moveTo(0,hz); for(let x=0;x<=W;x+=10){ const y=hz-H*m[1]*(.45+.35*Math.sin(x/W*5.1+L.freq)+.2*Math.sin(x/W*13.3)); g.lineTo(x,y); } g.lineTo(W,hz); g.fill();
    if(L.id==='frost'||L.id==='river'||L.id==='starfall'){ g.fillStyle=mix(L.id==='starfall'?'#e8d8ff':'#ffffff',col,night*.5); for(let x=0;x<=W;x+=W/7){ const y=hz-H*m[1]*(.45+.35*Math.sin(x/W*5.1+L.freq)+.2*Math.sin(x/W*13.3)); g.beginPath(); g.moveTo(x-10,y+7); g.lineTo(x,y); g.lineTo(x+10,y+7); g.fill(); } } }
  // soft cloud banks
  if(L.id!=='trench'&&L.id!=='deep'){ for(let i=0;i<3;i++){ const cx=((i*W/2.2)+t0*(3+i))%(W+300)-150, cy=hz*(.22+.15*i), sc2=1+i*.25; const gr=g.createLinearGradient(0,cy-20*sc2,0,cy+16*sc2); gr.addColorStop(0,'rgba(255,255,255,'+(.42-night*.32)+')'); gr.addColorStop(1,'rgba(200,210,225,'+(.18-night*.12)+')'); g.fillStyle=gr; g.beginPath(); g.ellipse(cx,cy,60*sc2,14*sc2,0,0,7); g.ellipse(cx+35*sc2,cy-8*sc2,34*sc2,13*sc2,0,0,7); g.ellipse(cx-30*sc2,cy-4*sc2,28*sc2,10*sc2,0,0,7); g.fill(); } } }
function drawGodRays(t,dusk,bx,by,hz){ if(dusk<.15 || !S.settings.effects) return; g.save(); g.globalAlpha=Math.min(.18,dusk*.2); g.fillStyle='#ffd8a0'; for(let i=0;i<5;i++){ const a=-.9+i*.45+Math.sin(t*.1+i)*.05; g.beginPath(); g.moveTo(bx,by); g.lineTo(bx+Math.cos(a)*W,by+Math.sin(a)*W*.15+hz*.6); g.lineTo(bx+Math.cos(a+.08)*W,by+Math.sin(a+.08)*W*.15+hz*.6); g.fill(); } g.restore(); }
function drawReflect(L,night,hz){ if(L.amp<=0) return; g.save(); g.globalAlpha=.16-night*.08; g.fillStyle=mix(L.hill,'#0a1220',night*.7); g.beginPath(); g.moveTo(0,hz); for(let x=0;x<=W;x+=8){ const y=hz + ((Math.sin(x/W*L.freq*Math.PI+1)*.5+.5)*H*L.amp + Math.sin(x/W*L.freq*7.3)*H*L.amp*.25 + H*.012)*.55; g.lineTo(x,y); } g.lineTo(W,hz); g.fill(); g.restore(); }
let AMB={jumps:[], nextJump:3, flies:null, leaves:null};
function drawAmbient(L,t,night,hz,dt){ if(!S.settings.effects) return;
  // distant fish jumping, with ripples
  AMB.nextJump-=dt; if(AMB.nextJump<=0){ AMB.nextJump=rnd(4,9); AMB.jumps.push({x:rnd(W*.35,W*.95), t:0}); }
  for(let i=AMB.jumps.length-1;i>=0;i--){ const j=AMB.jumps[i]; j.t+=dt; if(j.t>2.4){ AMB.jumps.splice(i,1); continue; } const y0=hz+(j.x-W*.3)/(W*.7)*H*.06+H*.04;
    if(j.t<.6){ const k=j.t/.6; g.save(); g.translate(j.x+k*14,y0-Math.sin(k*Math.PI)*12); g.rotate(-Math.cos(k*Math.PI)*.9); g.fillStyle=mix('#5a7a8a','#0a1220',night*.6); g.beginPath(); g.ellipse(0,0,4,1.6,0,0,7); g.fill(); g.restore(); }
    const rk=Math.max(0,j.t-.5); if(rk>0){ g.strokeStyle='rgba(255,255,255,'+(.35*(1-rk/1.9))+')'; g.lineWidth=1; g.beginPath(); g.ellipse(j.x+14,y0,rk*12,rk*3,0,0,7); g.stroke(); } }
  // dragonflies by day, near the shore
  if(night<.4 && ['pond','river','reef','ember'].includes(L.id)){ for(let i=0;i<3;i++){ const x=W*(.3+.2*i)+Math.sin(t*1.3+i*2)*40+Math.sin(t*4.1+i)*8, y=hz+H*.06+Math.sin(t*1.7+i)*14+Math.cos(t*5+i)*3; g.fillStyle=L.id==='ember'?'#ff9a4a':'#3ab0e0'; g.fillRect(x-3,y,6,1.2); g.fillStyle='rgba(220,240,255,.6)'; g.fillRect(x-1,y-2+Math.sin(t*40)*.6,1,1.6); g.fillRect(x+1,y-2-Math.sin(t*40)*.6,1,1.6); } }
  // falling leaves
  if(['pond','river'].includes(L.id)){ if(!AMB.leaves) AMB.leaves=Array.from({length:10},()=>[Math.random(),Math.random(),.5+Math.random()]); const cols=['#d8903a','#c8553a','#e0c050','#a86a2a'];
    AMB.leaves.forEach((lf,i)=>{ const x=((lf[0]*W+Math.sin(t*.8+i)*30+t*12*lf[2])%W+W)%W, y=((lf[1]*H*.7+t*18*lf[2])%(H*.7)); g.save(); g.translate(x,y); g.rotate(t*2+i); g.fillStyle=mix(cols[i%4],'#0a1220',night*.6); g.beginPath(); g.ellipse(0,0,3,1.6,0,0,7); g.fill(); g.restore(); }); }
  // shooting stars over the sky lake, always
  if(L.id==='starfall'){ const k=(t*.35)%1, i=Math.floor(t*.35)%5; const sx=W*(.3+.13*i)-k*W*.3, sy=hz*(.1+.07*(i%3))+k*hz*.25; const gr=g.createLinearGradient(sx,sy,sx+60,sy-20); gr.addColorStop(0,'rgba(255,255,240,'+Math.sin(k*Math.PI)+')'); gr.addColorStop(1,'rgba(255,255,240,0)'); g.strokeStyle=gr; g.lineWidth=2; g.beginPath(); g.moveTo(sx,sy); g.lineTo(sx+60,sy-20); g.stroke(); }
  // embers rising at the springs
  if(L.id==='ember'){ for(let i=0;i<18;i++){ const x=(i*97+Math.sin(t+i)*20)%W, y=H-((t*25+i*60)%(H*.9)); g.fillStyle='rgba(255,'+(140+(i%3)*40)+',60,'+(.5+.4*Math.sin(t*3+i))+')'; g.fillRect(x,y,2,2); } } }
function drawVignette(night){ const gr=g.createRadialGradient(W/2,H*.55,Math.min(W,H)*.35,W/2,H*.55,Math.max(W,H)*.75); gr.addColorStop(0,'rgba(0,0,0,0)'); gr.addColorStop(1,'rgba(4,10,16,'+(.22+night*.2)+')'); g.fillStyle=gr; g.fillRect(0,0,W,H); }

// ---------- actions ----------
function extraAct5(b){ const k=b.dataset.k;
  switch(b.dataset.act){
    case 'derby': { if(S.derby||G.st!=='idle') return 'skip'; const c=derbyCost(); if(S.money<c) return 'skip'; S.money-=c; startDerby(); return 'render'; }
    case 'passclaim': { const got=[]; while(S.pass.claimed<S.pass.lvl){ S.pass.claimed++; got.push(grantPass(S.pass.claimed)); } if(got.length){ sfx.shiny(); toast('Tide Pass: '+got.slice(0,3).join(', ')+(got.length>3?' and more':'')); renderBait(); } return 'render'; }
    case 'dockwood': { const w=DOCK_WOODS.find(x=>x[0]===k); if(!w) return 'skip'; if(!S.dock.owned.includes(k)){ if(!w[2]||S.money<w[2]) return 'skip'; S.money-=w[2]; S.dock.owned.push(k); sfx.coin(); } S.dock.wood=k; DOCK_PV=null; return 'render'; }
    case 'dockdecor': { const d=DOCKI[k]; if(!d) return 'skip'; DOCK_PV=null; if(!S.dock.owned.includes(k)){ if(d.src!=='shop'||S.money<d.price) return 'skip'; S.money-=d.price; S.dock.owned.push(k); sfx.coin(); }
      if(S.dock.decor.includes(k)) S.dock.decor=S.dock.decor.filter(x=>x!==k); else if(S.dock.decor.length<DOCK_SLOTS){ S.dock.decor.push(k); toast(d.name+' placed. Cozy!'); } else toast('Your dock is full. Remove something first.'); return 'render'; }
    case 'dockpv': { const [kind,id]=k.split(':'); if(kind==='wood'){ const w=DOCK_WOODS.find(x=>x[0]===id); DOCK_PV={kind,id,name:w[1]+' wood',price:w[2]}; } else { const d=DOCKI[id]; DOCK_PV={kind:'decor',id,name:d.name,price:d.price}; } setTimeout(()=>{ const c=$('homecv'); c&&c.scrollIntoView({behavior:'smooth',block:'center'}); },30); return 'render'; }
    case 'dockpvoff': DOCK_PV=null; return 'render';
  }
  return undefined; }

// ---------- Ember Springs & Starfall Lake looks ----------
function drawFarX(L,t,night,hz){ const N=cl=>mix(cl,'#0a1220',night*.6); const sy=x=>hz-(Math.sin(x/W*L.freq*Math.PI+1)*.5+.5)*H*L.amp-Math.sin(x/W*L.freq*7.3)*H*L.amp*.25-H*.012;
  if(L.id==='ember'){ const vx=W*.72, vy=sy(vx)+2; g.fillStyle=N('#2a1a18'); g.beginPath(); g.moveTo(vx-H*.22,vy+4); g.lineTo(vx-H*.04,vy-H*.2); g.lineTo(vx+H*.04,vy-H*.2); g.lineTo(vx+H*.22,vy+4); g.fill();
    g.fillStyle='rgba(255,120,40,'+(.5+night*.4)+')'; g.beginPath(); g.moveTo(vx-H*.03,vy-H*.2); g.lineTo(vx-H*.015,vy-H*.12); g.lineTo(vx+H*.01,vy-H*.15); g.lineTo(vx+H*.03,vy-H*.2); g.fill();
    for(let i=0;i<6;i++){ const k=((t*.12+i/6)%1); g.fillStyle='rgba(90,80,80,'+(.4*(1-k))+')'; g.beginPath(); g.arc(vx+Math.sin(t*.3+i)*10+k*30,vy-H*.2-k*H*.25,6+k*22,0,7); g.fill(); }
    for(let i=0;i<4;i++){ const x=W*(.35+.15*i); g.fillStyle='rgba(240,240,240,'+(.12+.06*Math.sin(t+i))+')'; for(let k=0;k<3;k++){ g.beginPath(); g.arc(x+Math.sin(t*.8+k)*6,hz+4-k*8-((t*8)%8),5+k*2,0,7); g.fill(); } } }
  if(L.id==='starfall'){ for(const [ix,iy,ir] of [[.3,.55,.05],[.62,.4,.035],[.85,.6,.06]]){ const x=W*ix, y=hz*iy+Math.sin(t*.5+ix*9)*4; g.fillStyle=N('#4a8a5a'); g.beginPath(); g.ellipse(x,y,W*ir,H*.012,0,Math.PI,0); g.fill(); g.fillStyle=N('#5a4a7a'); g.beginPath(); g.moveTo(x-W*ir,y); g.lineTo(x,y+H*.06); g.lineTo(x+W*ir,y); g.fill(); g.fillStyle='rgba(180,220,255,.5)'; for(let k=0;k<3;k++) g.fillRect(x-4+k*4,y+H*.06+((t*20+k*7)%20),1,4); }
    const px=W*.15, py=hz*.3; const gr=g.createRadialGradient(px-6,py-6,2,px,py,26); gr.addColorStop(0,'#ffd0a0'); gr.addColorStop(1,'#a85a8a'); g.fillStyle=gr; g.beginPath(); g.arc(px,py,24,0,7); g.fill(); g.strokeStyle='rgba(255,220,180,.6)'; g.lineWidth=2; g.beginPath(); g.ellipse(px,py,40,8,-.3,0,7); g.stroke(); } }
function drawWaterDecoX(L,t,night,hz){ if(L.id==='ember'){ for(let i=0;i<10;i++){ const x=W*(.3+((i*37)%70)/100), y=hz+H*(.08+((i*53)%40)/100), k=((t*.6+i*.3)%1); g.strokeStyle='rgba(255,200,120,'+(.4*(1-k))+')'; g.lineWidth=1; g.beginPath(); g.arc(x,y,2+k*6,0,7); g.stroke(); }
    for(const [fx,fy] of [[.45,.7],[.8,.62],[.6,.85]]){ const x=W*fx, y=H*fy; g.fillStyle='#2a1a18'; g.beginPath(); g.ellipse(x,y,16,6,0,Math.PI,0); g.fill(); g.fillStyle='rgba(255,110,40,'+(.5+.3*Math.sin(t*2+fx*9))+')'; g.fillRect(x-6,y-3,12,1.5); } }
  if(L.id==='starfall'){ for(let i=0;i<40;i++){ const x=(i*61)%W, y=hz+((i*37)%100)/100*(H-hz); g.fillStyle='rgba(255,255,255,'+(.25+.35*Math.abs(Math.sin(t*1.5+i)))+')'; g.fillRect(x,y,1.4,1.4); }
    g.strokeStyle='rgba(200,160,255,.25)'; g.lineWidth=1; for(let i=0;i<3;i++){ g.beginPath(); g.ellipse(W*(.4+.25*i),H*(.7+.05*i),30+10*Math.sin(t+i),6,0,0,7); g.stroke(); } } }
function drawPlatformX(L,t,night,dockY,pb){ const PW=W*.19, N=(cl,k=.6)=>mix(cl,'#0a1018',night*k);
  if(L.plat==='stone'){ g.fillStyle=N('#3a2a28'); g.beginPath(); g.moveTo(-2,dockY); g.lineTo(PW*.4,dockY-3); g.lineTo(PW+8,dockY+2); g.lineTo(PW+20,H); g.lineTo(-2,H); g.fill(); g.fillStyle=N('#4a3a36'); for(let i=0;i<6;i++){ g.beginPath(); g.ellipse(((i*37)%100)/100*PW,dockY+10+((i*53)%60)/100*(H-dockY),8,4,0,0,7); g.fill(); }
    g.strokeStyle='rgba(255,110,40,'+(.5+.2*Math.sin(t*2))+')'; g.lineWidth=1.5; g.beginPath(); g.moveTo(PW*.2,dockY+8); g.lineTo(PW*.35,dockY+20); g.lineTo(PW*.3,dockY+34); g.stroke(); g.fillStyle=N(dockWood()); g.fillRect(-2,dockY-2,PW*.9,4); }
  else { const y=dockY+Math.sin(t*.8)*2; g.fillStyle=N('#8a7ad8',.4); g.beginPath(); g.moveTo(-2,y); g.lineTo(PW+6,y); g.lineTo(PW*.75,y+H*.14); g.lineTo(PW*.4,y+H*.22); g.lineTo(PW*.1,y+H*.12); g.lineTo(-2,y+H*.1); g.fill();
    g.fillStyle='rgba(220,200,255,.35)'; g.beginPath(); g.moveTo(PW*.2,y); g.lineTo(PW*.4,y+H*.18); g.lineTo(PW*.5,y); g.fill(); g.fillStyle=N(dockWood(),.4); g.fillRect(-2,y-3,PW+8,4); for(let i=0;i<3;i++){ g.fillStyle='rgba(200,180,255,'+(.4+.3*Math.sin(t*2+i))+')'; g.fillRect(PW*(.3+.2*i),y+H*.2+((t*14+i*9)%18),2,2); } } }
