
// =====================================================================
// Update 1.7: try before you buy (wardrobe, pets, aquarium, prizes),
// more shirt patterns
// =====================================================================
let PREVIEW=null, PET_PV=null, AQ_PV=null; // what's being tried on right now (never saved)
const PV_KIND_NAME = {col:'colour', pat:'fabric', hat:'hat', out:'outfit', gls:'glasses', shoe:'shoes', neck:'neckwear', back:'back piece'};
function previewLook(){ const lk=Object.assign({},S.look); if(!PREVIEW) return lk; const {kind,id}=PREVIEW;
  if(kind==='col') lk.shirt=id; else if(kind==='pat') lk.pat=id; else if(kind==='hat') lk.hat=id; else if(kind==='out') lk.outfit=id; else if(kind==='gls') lk.glasses=id; else if(kind==='shoe') lk.shoes=id; else if(kind==='neck') lk.neck=id; else if(kind==='back') lk.back=id; return lk; }
function previewBarHTML(){ if(!PREVIEW) return ''; const p=PREVIEW;
  const buy = p.prize ? `<button class="btn sm" data-act="prize" data-k="${p.prize}" ${S.tickets>=p.price?'':'disabled'}>Get · 🎟 ${p.price}</button>` : `<button class="btn sm" data-act="buyoffer" data-k="${p.kind}:${p.id}" ${S.money>=p.price?'':'disabled'}>Buy · <span class="coin">${fmt(p.price)}</span></button>`;
  return `<div class="pvbar"><span>Trying on: <b>${esc(p.name)}</b></span><span class="row">${buy}<button class="btn alt sm" data-act="tryoff">Take off</button></span></div>`; }
function petPreviewLook(id=editPet()){ const lk=Object.assign({},petLook(id)); if(PET_PV) lk[PET_PV.kind]=PET_PV.id; return lk; }
function petPvBarHTML(){ if(!PET_PV) return ''; const p=PET_PV;
  const buy = p.prize ? `<button class="btn sm" data-act="prize" data-k="${p.prize}" ${S.tickets>=p.price?'':'disabled'}>Get · 🎟 ${p.price}</button>` : `<button class="btn sm" data-act="${p.kind==='tint'?'pettint':'petacc'}" data-k="${p.id}" ${S.money>=p.price?'':'disabled'}>Buy · <span class="coin">${fmt(p.price)}</span></button>`;
  return `<div class="pvbar"><span>Previewing: <b>${esc(p.name)}</b></span><span class="row">${buy}<button class="btn alt sm" data-act="petpvoff">Stop</button></span></div>`; }
function aqView(){ const v={theme:S.aq.theme, sand:S.aq.sand, decor:S.aq.decor.slice()}; if(!AQ_PV) return v;
  if(AQ_PV.kind==='theme') v.theme=AQ_PV.id; else if(AQ_PV.kind==='sand') v.sand=AQ_PV.id; else if(!v.decor.includes(AQ_PV.id)) v.decor.push(AQ_PV.id); return v; }
function aqPvBarHTML(){ if(!AQ_PV) return ''; const p=AQ_PV;
  const buy = p.prize ? `<button class="btn sm" data-act="prize" data-k="${p.prize}" ${S.tickets>=p.price?'':'disabled'}>Get · 🎟 ${p.price}</button>` : `<button class="btn sm" data-act="${p.kind==='theme'?'aqtheme':p.kind==='sand'?'aqsand':'decor'}" data-k="${p.id}" ${S.money>=p.price?'':'disabled'}>Buy · <span class="coin">${fmt(p.price)}</span></button>`;
  return `<div class="pvbar"><span>Previewing in your tank: <b>${esc(p.name)}</b></span><span class="row">${buy}<button class="btn alt sm" data-act="aqpvoff">Stop</button></span></div>`; }
// prize counter thumbnails
function paintPrizes(P){ P.querySelectorAll('canvas[data-prize]').forEach(c=>{ const x=c.getContext('2d'), id=c.dataset.prize; x.clearRect(0,0,c.width,c.height); const t=0;
  // pet prizes: drawn awake (the scene's night used to put them to sleep), sized to fit, a balloon smaller so it shows;
  // a colour is shown on a pet whose coat it changes (Dax is black, so a hue shift barely shows on him)
  const pet=(lk)=>{ let id=S.pet; if(lk.tint&&id==='daxniko') id=['lily','dog','cat','puppy','kitten'].find(p=>S.owned.pets.includes(p))||id; const bal=lk.acc==='balloon', n0=PET_NIGHT; PET_NIGHT=0;
    try{ drawPetStyled(x,id,bal?42:48,bal?77:67,petFitScale(id)*80/300*(bal?.62:.95),t,0,Object.assign({},typeof _petLook_pair==='function'?_petLook_pair(id):petLook(id),lk)); } finally{ PET_NIGHT=n0; } };
  if(id==='teddy') drawPet(x,'teddy',48,72,3,t); else if(id==='carousel') drawDecor(x,'carousel',48,74,.55,t); else if(id==='golden'||id==='rainbow') pet({tint:id}); else if(id==='balloon'||id==='partyhat') pet({acc:id});
  else if(id==='sixsevencap'||id==='carnival'||id==='fishbowl') hatPreview(x,96,80,id,S.look.hatCol); else if(id==='spacesuit') drawAngler(x,48,78,1.05,Object.assign({},S.look,{outfit:'spacesuit',hat:'none'}),{});
  else if(id==='crate') drawJunk(x,96,80,'chest'); else if(id==='myth') drawJunk(x,96,80,'goldlure'); else { x.fillStyle='#7fc8a9'; x.beginPath(); for(let i=0;i<6;i++){ const a=i/6*Math.PI*2; x.lineTo(48+Math.cos(a)*22,40+Math.sin(a)*22); } x.fill(); x.fillStyle='#0a161d'; x.font='800 14px system-ui'; x.textAlign='center'; x.fillText('10',48,45); } }); }
const PRIZE_PV = {sixsevencap:['hat','sixsevencap'], carnival:['hat','carnival'], fishbowl:['hat','fishbowl'], spacesuit:['out','spacesuit'], golden:['pet','tint'], rainbow:['pet','tint'], balloon:['pet','acc'], partyhat:['pet','acc'], carousel:['aq','decor']};

// ---------- more shirt patterns ----------
function drawPatternX(c,pat,base,x,y,w,h){ const dk='rgba(0,0,0,.3)', lt='rgba(255,255,255,.75)';
  switch(pat){
    case 'pinstripe': c.fillStyle=lt; for(let xx=x+1.5;xx<x+w;xx+=3.2) c.fillRect(xx,y,.6,h); break;
    case 'checker': c.fillStyle=dk; for(let yy=y,r=0;yy<y+h;yy+=3.5,r++) for(let xx=x+(r%2)*3.5;xx<x+w;xx+=7) c.fillRect(xx,yy,3.5,3.5); break;
    case 'zigzag': c.strokeStyle=lt; c.lineWidth=1.1; for(let yy=y+3;yy<y+h;yy+=5){ c.beginPath(); for(let xx=x,i=0;xx<=x+w;xx+=2.5,i++) c.lineTo(xx,yy+(i%2?1.6:-1.6)); c.stroke(); } break;
    case 'hearts': c.fillStyle='#ff5a8a'; for(let i=0;i<10;i++){ const hx=x+2+((i*37)%90)/100*w, hy=y+3+((i*53)%85)/100*h; c.beginPath(); c.moveTo(hx,hy+1.4); c.bezierCurveTo(hx-2,hy,hx-1,hy-1.6,hx,hy-.6); c.bezierCurveTo(hx+1,hy-1.6,hx+2,hy,hx,hy+1.4); c.fill(); } break;
    case 'stars': c.fillStyle='#ffe066'; for(let i=0;i<9;i++){ const sx=x+2+((i*41)%90)/100*w, sy=y+3+((i*59)%85)/100*h; c.beginPath(); for(let k=0;k<10;k++){ const a=-Math.PI/2+k*Math.PI/5, r=k%2?.7:1.7; c.lineTo(sx+Math.cos(a)*r,sy+Math.sin(a)*r); } c.fill(); } break;
    case 'waves': c.strokeStyle=lt; c.lineWidth=1; for(let yy=y+3;yy<y+h;yy+=4.5){ c.beginPath(); for(let xx=x;xx<=x+w;xx+=1) c.lineTo(xx,yy+Math.sin(xx*.9)*1.1); c.stroke(); } break;
    case 'plaid': c.fillStyle='rgba(200,40,40,.35)'; for(let xx=x;xx<x+w;xx+=6) c.fillRect(xx,y,2.4,h); for(let yy=y;yy<y+h;yy+=6) c.fillRect(x,yy,w,2.4); c.fillStyle='rgba(255,220,90,.5)'; for(let xx=x+4;xx<x+w;xx+=6) c.fillRect(xx,y,.6,h); for(let yy=y+4;yy<y+h;yy+=6) c.fillRect(x,yy,w,.6); break;
    case 'fishbones': c.strokeStyle=lt; c.lineWidth=.6; for(let i=0;i<5;i++){ const fx=x+3+((i*43)%80)/100*w, fy=y+4+((i*61)%80)/100*h; c.beginPath(); c.moveTo(fx-3,fy); c.lineTo(fx+3,fy); for(let k=-2;k<=1;k++){ c.moveTo(fx+k*1.3,fy-1.4); c.lineTo(fx+k*1.3,fy+1.4); } c.moveTo(fx+3,fy); c.arc(fx+3.6,fy,.8,0,7); c.stroke(); } break;
    case 'leopard': for(let i=0;i<16;i++){ const lx=x+((i*37)%100)/100*w, ly=y+((i*53)%100)/100*h; c.fillStyle='rgba(60,30,10,.75)'; c.beginPath(); c.ellipse(lx,ly,1.6,1.2,i,0,7); c.fill(); c.fillStyle='rgba(200,140,60,.6)'; c.beginPath(); c.arc(lx,ly,.6,0,7); c.fill(); } break;
    case 'tiedye': { const gr=c.createRadialGradient(x+w/2,y+h*.45,1,x+w/2,y+h*.45,w); ['#ff5a8a','#ffd84a','#5ad8a0','#5aa9ff','#c38bff','#ff5a8a'].forEach((cl,i)=>gr.addColorStop(i/5,cl)); c.globalAlpha*=.75; c.fillStyle=gr; c.fillRect(x,y,w,h); c.globalAlpha/=.75; break; }
    case 'pixel': for(let yy=y;yy<y+h;yy+=3) for(let xx=x;xx<x+w;xx+=3){ const v=(Math.floor(xx*7+yy*13))%5; if(v<2){ c.fillStyle=v?'rgba(255,255,255,.35)':'rgba(0,0,0,.3)'; c.fillRect(xx,yy,3,3); } } break;
    case 'sunset': { const gr=c.createLinearGradient(0,y,0,y+h); gr.addColorStop(0,'#ff9a5a'); gr.addColorStop(.5,'#ff5a8a'); gr.addColorStop(1,'#6a4ad8'); c.globalAlpha*=.8; c.fillStyle=gr; c.fillRect(x,y,w,h); c.globalAlpha/=.8; break; }
    case 'galaxy': c.fillStyle='rgba(20,10,50,.75)'; c.fillRect(x,y,w,h); c.fillStyle='rgba(160,90,255,.45)'; c.beginPath(); c.ellipse(x+w*.5,y+h*.5,w*.45,h*.18,-.5,0,7); c.fill(); c.fillStyle='#fff'; for(let i=0;i<14;i++) c.fillRect(x+((i*37)%100)/100*w,y+((i*61)%100)/100*h,.7,.7); break;
    case 'sixseven': c.fillStyle='rgba(255,224,90,.85)'; c.font='800 4px system-ui'; for(let yy=y+4,r=0;yy<y+h;yy+=5,r++) for(let xx=x+(r%2)*3;xx<x+w;xx+=7) c.fillText(r%2?'7':'6',xx,yy); break;
  } }

// ---------- actions ----------
function extraAct4(b){ const k=b.dataset.k;
  switch(b.dataset.act){
    case 'tryon': { const [kind,id]=k.split(':'); const o=shopOffers().find(x=>x.kind===kind&&x.id===id); if(!o) return 'skip'; PREVIEW={kind,id,name:o.name,price:o.price}; setTimeout(()=>{ const c=$('lookcv'); c&&c.scrollIntoView({behavior:'smooth',block:'center'}); },30); return 'render'; }
    case 'tryoff': PREVIEW=null; return 'render';
    case 'petpv': { const [kind,id]=k.split(':'); const list=kind==='tint'?PET_TINTS:PET_ACCS; const it=list.find(x=>x[0]===id); if(!it) return 'skip'; PET_PV={kind,id,name:it[1],price:it[2]}; return 'render'; }
    case 'petpvoff': PET_PV=null; return 'render';
    case 'aqpv': { const [kind,id]=k.split(':'); let name, price; if(kind==='theme'){ const th=THEMES.find(x=>x[0]===id); name=th[1]+' water'; price=th[2]; } else if(kind==='sand'){ const sd=SANDS.find(x=>x[0]===id); name=sd[1]; price=sd[2]; } else { const d=DECORI[id]; name=d.name; price=d.price; }
      AQ_PV={kind,id,name,price}; setTimeout(()=>{ const c=$('tankcv'); c&&c.scrollIntoView({behavior:'smooth',block:'center'}); },30); return 'render'; }
    case 'aqpvoff': AQ_PV=null; return 'render';
    case 'prizepv': { const p=PRIZES.find(x=>x[0]===k); const how=PRIZE_PV[k]; if(!p||!how) return 'skip'; const nm=p[1].replace(/ \(.*\)$/,'');
      if(how[0]==='hat'||how[0]==='out'){ PREVIEW={kind:how[0],id:how[1],name:nm,price:p[2],prize:k}; S.tab='style'; }
      else if(how[0]==='pet'){ PET_PV={kind:how[1],id:k,name:nm,price:p[2],prize:k}; S.tab='pets'; }
      else { AQ_PV={kind:'decor',id:k,name:nm,price:p[2],prize:k}; S.tab='aquarium'; }
      setTimeout(()=>$('panel').scrollIntoView({behavior:'smooth',block:'start'}),30); return 'render'; }
  }
  return undefined; }
