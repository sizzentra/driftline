// =====================================================================
// 0.4.9 Tide Pass overhaul (director, 2026-11-19: "tide pass needs a proper overhaul. Right now it doesn't feel special at all and rewards
// don't feel very exclusive ... more direction and way better rewards ... custom new rewards better than others in other places! Maybe
// cosmetics?") and [1] pet colours ("More base colour schemes for pets, unlockable through rewards in boardwalk - but a few more base
// colours purchasable by default"). Shared by every platform.
//  - 100 levels in five chapters (Shallows, The Reef, Open Sea, The Deep, Tidecaller), each with its own exclusive rewards.
//  - New cosmetic kinds that only the Pass gives: angler auras (animated, drawn around your angler everywhere), bobber skins and
//    line colours, plus Pass-only pet colours. Wisdom Pearls and Boon points at chapter milestones.
//  - The page shows the chapter, how far the next exclusive is, and a showcase of every exclusive (owned ones ticked).
//  - Pet colours: 5 new in the pet shop, 5 more only from Boardwalk treasure chests, 3 only from the Pass.
// =====================================================================
// ---------- new cosmetics ----------
const AURAS=[['tideswirl','Tide Swirl','#7fe3ff','#2a8ad8','swirl'],['bubbles','Bubble Ring','#bfefff','#5ac8f0','bubbles'],['embers','Ember Motes','#ffb35a','#ff5a2a','motes'],
  ['glitter','Starfall Glitter','#fff4c8','#b9a2ff','glitter'],['koi','Koi Orbit','#ff8a4a','#ffffff','koi'],['veil','Tidecaller Veil','#7fe3c4','#b97aff','veil']];
const BOBS=[['gold','Gilded Bobber','#ffd36a','#fff6dc','ring'],['puffer','Pufferfish Bobber','#ffd84a','#fff1b0','spikes'],['duck','Rubber Duck Bobber','#ffd23a','#ffd23a','duck'],
  ['lantern','Lantern Bobber','#ff9a3a','#2a1a10','glow'],['star','Star Bobber','#b9a2ff','#f4f1ff','star']];
const LINES=[['seaglass','Sea-glass Line','rgba(127,227,196,A)'],['goldthread','Gold Thread Line','rgba(255,211,106,A)'],['starlight','Starlight Line','star'],['ember','Ember Line','rgba(255,120,70,A)']];
const AURAI=Object.fromEntries(AURAS.map(a=>[a[0],a])), BOBI=Object.fromEntries(BOBS.map(a=>[a[0],a])), LINEI=Object.fromEntries(LINES.map(a=>[a[0],a]));
// pet colours: shop, Boardwalk chests, Tide Pass
const TINT_SHOP=[['ocean','Ocean',2000,'hue-rotate(195deg) saturate(1.4) brightness(.95)'],['moss','Moss',1800,'hue-rotate(60deg) saturate(.8) brightness(.9)'],['sunset','Sunset',2500,'sepia(.5) hue-rotate(-35deg) saturate(2)'],
  ['ash','Ash',2200,'grayscale(.8) brightness(.85) contrast(1.1)'],['cherry','Cherry',2600,'hue-rotate(-70deg) saturate(1.6) brightness(1.05)']];
const TINT_BW=[['neon','Neon',0,'saturate(3) brightness(1.2) hue-rotate(100deg)'],['opal','Opal',0,'grayscale(.4) brightness(1.35) hue-rotate(200deg) saturate(1.4)'],['bronze','Bronze',0,'sepia(1) saturate(1.8) brightness(.8)'],
  ['frosty','Frost',0,'grayscale(.6) brightness(1.4) hue-rotate(170deg) saturate(1.6)'],['candy','Candy',0,'hue-rotate(-90deg) saturate(2.2) brightness(1.15)']];
const TINT_PASS=[['coral','Coral',0,'sepia(.4) hue-rotate(-30deg) saturate(2.4) brightness(1.1)'],['abyssal','Abyssal',0,'brightness(.55) hue-rotate(190deg) saturate(2) contrast(1.3)'],['aurora','Aurora',0,'aurora']];
for(const t of [...TINT_SHOP,...TINT_BW,...TINT_PASS]) if(!PET_TINTS.some(x=>x[0]===t[0])) PET_TINTS.push(t);
for(const t of [...TINT_BW,...TINT_PASS]) PRIZE_TINT[t[0]]=0; /* hidden in the pet shop until owned, never sold */
{ const _tf=tintFilter; tintFilter=function(lk,t){ const tt=PET_TINTS.find(x=>x[0]===lk.tint); if(tt&&tt[3]==='aurora') return 'hue-rotate('+(100+Math.sin(t*.8)*60|0)+'deg) saturate(1.8) brightness(1.1)'; return _tf(lk,t); }; }
function petColourPrize(){ const left=TINT_BW.filter(t=>!S.petTints.includes(t[0])); if(!left.length) return null; const t=pick(left); S.petTints.push(t[0]); return 'A new pet colour: '+t[1]+'! (Pets, Colour)'; }
// ---------- the track: 100 levels in 5 chapters ----------
const PASS_CHAPTERS=[[1,'Shallows'],[21,'The Reef'],[41,'Open Sea'],[61,'The Deep'],[81,'Tidecaller']];
const passChapter = L => { let c=0; for(let i=0;i<PASS_CHAPTERS.length;i++) if(L>=PASS_CHAPTERS[i][0]) c=i; return c; };
Object.assign(PASS_SPECIAL,{
  22:['bob','gold','Gilded Bobber','Bobber skin: polished gold that catches the sun. Only in the Tide Pass.'],
  24:['pearl',1,'1 Wisdom Pearl','A Wisdom Pearl to spend in the Pearl shop or on relics.'],
  28:['line','seaglass','Sea-glass Line','Line colour: soft sea-glass green. Only in the Tide Pass.'],
  33:['aura','tideswirl','Tide Swirl aura','Aura: a ring of water circles your angler. Only in the Tide Pass.'],
  38:['tint','coral','Coral pet colour','Pet colour: warm coral pink. Only in the Tide Pass.'],
  42:['bob','puffer','Pufferfish Bobber','Bobber skin: a spiky little puffer. Only in the Tide Pass.'],
  48:['aura','bubbles','Bubble Ring aura','Aura: bubbles drift up around you. Only in the Tide Pass.'],
  52:['boon',2,'2 Boon points','Boon points to raise your voyage Boons (Prestige, Boons).'],
  55:['line','goldthread','Gold Thread Line','Line colour: spun gold. Only in the Tide Pass.'],
  58:['tint','abyssal','Abyssal pet colour','Pet colour: the deep blue-black of the trench. Only in the Tide Pass.'],
  60:['aura','embers','Ember Motes aura','Aura: glowing embers rise around you. Only in the Tide Pass.'],
  63:['bob','duck','Rubber Duck Bobber','Bobber skin: a rubber duck rides your line. Only in the Tide Pass.'],
  66:['pearl',2,'2 Wisdom Pearls','Two Wisdom Pearls to spend in the Pearl shop or on relics.'],
  70:['aura','glitter','Starfall Glitter aura','Aura: stars twinkle all around you. Only in the Tide Pass.'],
  73:['line','starlight','Starlight Line','Line colour: shifts through every colour of a starry night. Only in the Tide Pass.'],
  76:['tint','aurora','Aurora pet colour','Pet colour: slowly shifts like the northern lights. Only in the Tide Pass.'],
  80:['bob','lantern','Lantern Bobber','Bobber skin: a tiny lantern that glows on the water. Only in the Tide Pass.'],
  84:['aura','koi','Koi Orbit aura','Aura: two little koi swim circles around you. Only in the Tide Pass.'],
  88:['boon',3,'3 Boon points','Boon points to raise your voyage Boons (Prestige, Boons).'],
  90:['line','ember','Ember Line','Line colour: glowing ember orange. Only in the Tide Pass.'],
  93:['bob','star','Star Bobber','Bobber skin: a glowing star. Only in the Tide Pass.'],
  96:['pearl',3,'3 Wisdom Pearls','Three Wisdom Pearls to spend in the Pearl shop or on relics.'],
  100:['aura','veil','Tidecaller Veil','Aura: ribbons of light and a crown of water. The rarest thing in the Pass.']});
const PASS_NEW_KINDS={aura:'auras', bob:'bobs', line:'lines'};
function passOwnList(k){ S.owned=S.owned||{}; const key=PASS_NEW_KINDS[k]; if(!Array.isArray(S.owned[key])) S.owned[key]=[]; return S.owned[key]; }
{ const _gp=grantPass; grantPass=function(L){ const sp=PASS_SPECIAL[L]; if(sp&&(PASS_NEW_KINDS[sp[0]]||sp[0]==='pearl'||sp[0]==='boon')){ const [k,id]=sp;
    if(PASS_NEW_KINDS[k]){ const o=passOwnList(k); if(!o.includes(id)) o.push(id); }
    if(k==='pearl') S.pearls=(S.pearls||0)+id; if(k==='boon') S.boonPts=(S.boonPts||0)+id;
    S.pass.got=S.pass.got||{}; S.pass.got[L]=sp[2]; return sp[2]; } return _gp(L); }; }
// ---------- drawing ----------
const tnow = () => performance.now()/1000;
function auraDraw(c,a,x,y,s,front){ const t=tnow(), cx=x, cy=y-42*s, R=24*s, st=a[4], c1=a[2], c2=a[3]; c.save();
  if(st==='swirl'){ for(let i=0;i<12;i++){ const an=t*1.6+i/12*Math.PI*2, z=Math.sin(an); if((z>0)!==!!front) continue; c.globalAlpha=.35+.45*(z*.5+.5); c.fillStyle=i%3?c1:c2; c.beginPath(); c.arc(cx+Math.cos(an)*R*1.1, cy+12*s+z*5*s+Math.sin(t*2+i)*2*s, (1.6+z*.6)*s,0,7); c.fill(); } }
  else if(st==='bubbles'){ if(front) for(let i=0;i<9;i++){ const k=(t*.35+i/9)%1, bx=cx+Math.sin(i*2.3+t)*R*.9, by=y-k*80*s; c.globalAlpha=.6*(1-k); c.strokeStyle=c1; c.lineWidth=Math.max(.6,.8*s); c.beginPath(); c.arc(bx,by,(1.4+((i*7)%3))*s,0,7); c.stroke(); } }
  else if(st==='motes'){ if(front) for(let i=0;i<10;i++){ const k=(t*.4+i*.137)%1, bx=cx+Math.sin(i*3.1+k*4)*R*.9, by=y-6*s-k*84*s; c.globalAlpha=.8*(1-k); c.fillStyle=k<.5?c1:c2; c.beginPath(); c.arc(bx,by,(1.5-k)*s+.4,0,7); c.fill(); } }
  else if(st==='glitter'){ if(front) for(let i=0;i<11;i++){ const ph=(t*1.3+i*.61)%2, tw=ph<1?Math.sin(ph*Math.PI):0; if(tw<.05) continue; const bx=cx+Math.cos(i*2.4)*R*(.7+.4*((i*13)%5)/5), by=cy+Math.sin(i*1.7)*R*1.4, r=(2.6*tw)*s; c.globalAlpha=tw; c.fillStyle=i%2?c1:c2; c.beginPath(); c.moveTo(bx,by-r); c.lineTo(bx+r*.3,by-r*.3); c.lineTo(bx+r,by); c.lineTo(bx+r*.3,by+r*.3); c.lineTo(bx,by+r); c.lineTo(bx-r*.3,by+r*.3); c.lineTo(bx-r,by); c.lineTo(bx-r*.3,by-r*.3); c.closePath(); c.fill(); } }
  else if(st==='koi'){ for(let i=0;i<2;i++){ const an=t*1.1+i*Math.PI, z=Math.sin(an); if((z>0)!==!!front) continue; const fx=cx+Math.cos(an)*R*1.2, fy=cy+10*s+z*6*s, dir=-Math.sin(an)>0?1:-1; c.globalAlpha=.9; c.save(); c.translate(fx,fy); c.scale(dir*s*(1+z*.15),s*(1+z*.15)); c.fillStyle=i?c2:c1; c.beginPath(); c.ellipse(0,0,5,2.2,0,0,7); c.fill(); c.beginPath(); c.moveTo(-4,0); c.lineTo(-8,-2.6+Math.sin(t*12)*1); c.lineTo(-8,2.6+Math.sin(t*12)*1); c.closePath(); c.fill(); c.fillStyle=i?c1:c2; c.beginPath(); c.arc(1.5,-.6,1,0,7); c.fill(); c.restore(); } }
  else if(st==='veil'){ if(!front){ const g2=c.createRadialGradient(cx,cy,2,cx,cy,R*1.9); g2.addColorStop(0,v3rgba(c1,.28)); g2.addColorStop(1,v3rgba(c2,0)); c.fillStyle=g2; c.fillRect(cx-R*2,cy-R*2,R*4,R*4); }
    else { c.lineWidth=Math.max(.8,1.1*s); for(let i=0;i<3;i++){ c.globalAlpha=.55; c.strokeStyle=i%2?c2:c1; c.beginPath(); for(let k=0;k<=20;k++){ const u=k/20, xx=cx-R*1.3+u*R*2.6, yy=cy+18*s-i*10*s+Math.sin(u*6+t*2+i)*4*s; k?c.lineTo(xx,yy):c.moveTo(xx,yy); } c.stroke(); }
      c.globalAlpha=.8; c.strokeStyle=c1; c.beginPath(); c.ellipse(cx,y-86*s,9*s,2.6*s,0,0,7); c.stroke(); for(let i=0;i<5;i++){ const an=t*2+i/5*Math.PI*2; c.fillStyle=c2; c.beginPath(); c.arc(cx+Math.cos(an)*9*s,y-86*s+Math.sin(an)*2.6*s,1.1*s,0,7); c.fill(); } } }
  c.restore(); }
{ const _da=drawAngler; drawAngler=function(c,x,y,s,lk,o){ const a=lk&&lk.aura&&AURAI[lk.aura], fx=a&&!(S.settings&&S.settings.effects===false); if(fx) try{ auraDraw(c,a,x,y,s,0); }catch(e){}
    const r=_da.apply(this,arguments); if(fx) try{ auraDraw(c,a,x,y,s,1); }catch(e){} return r; }; }
function lineStyle(a){ const L=LINEI[S.look&&S.look.line]; if(!L) return 'rgba(235,240,235,'+a+')'; if(L[2]==='star') return 'hsla('+((tnow()*60)%360|0)+',90%,80%,'+a+')'; return L[2].replace('A',a); }
function drawBobSkin(g,x,y,br,id){ const B=BOBI[id||(S.look&&S.look.bob)]; if(!B) return false; const t=tnow();
  if(B[4]==='glow') v3glow(g,x,y,br*4,'rgba(255,170,80,.9)',.35+.15*Math.sin(t*3));
  if(B[4]==='star'){ v3glow(g,x,y,br*3.5,'rgba(185,162,255,.9)',.3); g.fillStyle=B[2]; g.beginPath(); for(let i=0;i<10;i++){ const r=i%2?br*.55:br*1.25, an=-Math.PI/2+i*Math.PI/5; g.lineTo(x+Math.cos(an)*r,y+Math.sin(an)*r); } g.closePath(); g.fill(); return true; }
  g.fillStyle=B[3]; g.beginPath(); g.arc(x,y+br*.35,br,0,Math.PI); g.fill(); g.fillStyle=B[2]; g.beginPath(); g.arc(x,y,br,Math.PI,0); g.fill();
  if(B[4]==='ring'){ g.strokeStyle='#fff6dc'; g.lineWidth=1; g.beginPath(); g.moveTo(x-br,y+.5); g.lineTo(x+br,y+.5); g.stroke(); }
  if(B[4]==='spikes'){ g.strokeStyle='#c89a20'; g.lineWidth=1; for(let i=0;i<7;i++){ const an=Math.PI+i/6*Math.PI; g.beginPath(); g.moveTo(x+Math.cos(an)*br,y+Math.sin(an)*br); g.lineTo(x+Math.cos(an)*br*1.45,y+Math.sin(an)*br*1.45); g.stroke(); } g.fillStyle='#222'; g.beginPath(); g.arc(x+br*.4,y-br*.3,br*.15,0,7); g.fill(); }
  if(B[4]==='duck'){ g.fillStyle=B[2]; g.beginPath(); g.arc(x+br*.5,y-br*1.05,br*.55,0,7); g.fill(); g.fillStyle='#ff8a2a'; g.beginPath(); g.moveTo(x+br*.95,y-br*1.1); g.lineTo(x+br*1.5,y-br*.95); g.lineTo(x+br*.95,y-br*.85); g.closePath(); g.fill(); g.fillStyle='#222'; g.beginPath(); g.arc(x+br*.65,y-br*1.2,br*.12,0,7); g.fill(); }
  g.strokeStyle='rgba(10,18,28,.45)'; g.lineWidth=1; g.beginPath(); g.arc(x,y+br*.18,br*1.02,0,7); g.stroke(); return true; }
// pass art for the new kinds
{ const _pa=passArt; passArt=function(x,w,h,L){ const sp=PASS_SPECIAL[L]; if(!sp||!(PASS_NEW_KINDS[sp[0]]||sp[0]==='pearl'||sp[0]==='boon'||(sp[0]==='tint'&&TINT_PASS.some(t=>t[0]===sp[1])))) return _pa(x,w,h,L);
    const [k,id]=sp; x.clearRect(0,0,w,h);
    if(k==='aura') drawAngler(x,w/2,h*.96,h/96,Object.assign({},S.look,{aura:id}),{});
    else if(k==='bob'){ const r=Math.min(w,h)*.2; drawBobSkin(x,w/2,h*.55,r,id); }
    else if(k==='line'){ const L2=LINEI[id]; x.lineWidth=Math.max(2,h/30); x.strokeStyle=L2[2]==='star'?'hsl(270,90%,80%)':L2[2].replace('A',1); x.beginPath(); x.moveTo(w*.1,h*.2); x.quadraticCurveTo(w*.5,h*.95,w*.9,h*.35); x.stroke(); drawBobSkin(x,w*.9,h*.38,h*.08,'gold'); }
    else if(k==='tint') drawPetStyled(x,S.pet,w/2,h*.86,2.8*w/120,0,0,Object.assign({},petLook(),{tint:id}));
    else if(k==='pearl'){ const r=h*.2; const g2=x.createRadialGradient(w/2-r*.3,h/2-r*.3,r*.1,w/2,h/2,r); g2.addColorStop(0,'#ffffff'); g2.addColorStop(.6,'#e8e0f4'); g2.addColorStop(1,'#a89ac8'); x.fillStyle=g2; x.beginPath(); x.arc(w/2,h/2,r,0,7); x.fill(); if(id>1){ x.fillStyle='#ffd36a'; x.font='800 '+Math.round(h*.18)+'px system-ui'; x.textAlign='center'; x.fillText('×'+id,w*.78,h*.85); } }
    else { x.fillStyle='#ffd36a'; x.beginPath(); for(let i=0;i<10;i++){ const r=i%2?h*.12:h*.3, an=-Math.PI/2+i*Math.PI/5; x.lineTo(w/2+Math.cos(an)*r,h/2+Math.sin(an)*r); } x.closePath(); x.fill(); } }; }
// ---------- the Pass page: chapter, next exclusive, showcase ----------
{ const _rp=renderPass; renderPass=function(P){ _rp(P); try{ const pl=S.pass.lvl, ch=passChapter(Math.max(1,pl)), C=PASS_CHAPTERS[ch], next=PASS_CHAPTERS[ch+1], end=next?next[0]-1:PASS_MAX;
    const sub=P.querySelector('.sub'); if(sub) sub.innerHTML=`Every fish you land fills the Tide Pass; rarer fish fill it faster. ${PASS_MAX} levels in five chapters, with things you can only get here: auras, bobber skins, line colours, pet colours, Wisdom Pearls and Boon points. After level ${PASS_MAX}, bonus rewards keep coming.`;
    const ex=Object.keys(PASS_SPECIAL).map(Number).sort((a,b)=>a-b), got=ex.filter(L=>L<=S.pass.claimed).length;
    const html=`<div class="tile pass-ch"><div class="row spread"><h4>Chapter ${ch+1} of ${PASS_CHAPTERS.length}: ${esc(C[1])}</h4><span class="meta">Levels ${C[0]}–${end} · ${got} / ${ex.length} exclusives</span></div>
      <div class="prog" style="margin-top:4px"><i style="width:${clamp((pl-C[0]+1)/(end-C[0]+1),0,1)*100}%;background:var(--kelp)"></i></div>
      <div class="pass-show">${ex.map(L=>{ const sp=PASS_SPECIAL[L], own=L<=S.pass.claimed; return `<span class="pass-ex ${own?'got':''} ${L<=pl&&!own?'ready':''}" title="${esc(sp[3])}"><b>${L}</b>${own?'✓ ':''}${esc(sp[2])}</span>`; }).join('')}</div></div>`;
    const head=P.querySelector('.row.spread'); if(head) head.insertAdjacentHTML('afterend',html); else P.insertAdjacentHTML('afterbegin',html); }catch(e){} }; }
// ---------- Wardrobe: wear what the Pass gave you ----------
function passWearHTML(){ const row=(k,list,cur,label)=>{ const own=passOwnList(k); return `<div class="pw-row"><b>${label}</b><div class="pw-chips"><button class="chipb ${!cur||cur==='none'?'on':''}" data-act="passwear" data-k="${k}:none">None</button>${list.map(a=>{ const o=own.includes(a[0]), L=Object.keys(PASS_SPECIAL).find(l=>PASS_SPECIAL[l][0]===k&&PASS_SPECIAL[l][1]===a[0]);
    return `<button class="chipb ${cur===a[0]?'on':''}" data-act="passwear" data-k="${k}:${a[0]}" ${o?'':'disabled'} title="${o?'Wear it':'Tide Pass level '+L}">${esc(a[1].replace(/ (aura|Bobber|Line)$/,''))}${o?'':' · Lv '+L}</button>`; }).join('')}</div></div>`; };
  return `<div class="jsec pw-sec"><h3>Tide Pass exclusives</h3><p class="sub">Auras, bobber skins and line colours: only from the Tide Pass.</p>${row('aura',AURAS,S.look.aura,'Aura')}${row('bob',BOBS,S.look.bob,'Bobber')}${row('line',LINES,S.look.line,'Line')}</div>`; }
{ const _rs=renderStyle; renderStyle=function(P){ const r=_rs.apply(this,arguments); try{ (P||$('panel')).insertAdjacentHTML('beforeend',passWearHTML()); }catch(e){} return r; }; }
{ const _ea=extraAct7; extraAct7=function(b){ if(b.dataset.act==='passwear'){ const [k,id]=String(b.dataset.k||'').split(':'); if(!PASS_NEW_KINDS[k]) return 'skip'; if(id!=='none'&&!passOwnList(k).includes(id)) return 'skip';
    S.look[k]=id==='none'?'none':id; save(); return 'render'; } return _ea(b); }; }
if(typeof ACT_OK==='object') ACT_OK.passwear=k=>/^(aura|bob|line):[a-z]+$/.test(String(k));
{ const _m=migrate; migrate=function(o){ const raw=isObj(o)&&isObj(o.owned)?o.owned:{}; const m=_m(o); try{ m.owned=m.owned||{}; for(const k in PASS_NEW_KINDS){ const key=PASS_NEW_KINDS[k], I=k==='aura'?AURAI:k==='bob'?BOBI:LINEI, src=Array.isArray(raw[key])?raw[key]:m.owned[key]; m.owned[key]=Array.isArray(src)?[...new Set(src.filter(x=>I[x]))]:[];
      if(m.look&&m.look[k]!=null&&m.look[k]!=='none'&&!m.owned[key].includes(m.look[k])) m.look[k]='none'; } }catch(e){} return m; }; }
document.head.insertAdjacentHTML('beforeend',`<style>
#panel .pass-ch{margin:10px 0}
#panel .pass-show{display:flex;flex-wrap:wrap;gap:5px;margin-top:8px}
#panel .pass-ex{font-size:11.5px;padding:3px 8px;border-radius:10px;border:1px solid var(--line,#26385180);background:#0e1828;color:#97abc2;white-space:nowrap}
#panel .pass-ex b{margin-right:5px;color:#cde1f5}#panel .pass-ex.got{border-color:#7fe3c455;color:#bff5e2}#panel .pass-ex.ready{border-color:#ffd36a;color:#ffe6a8}
#panel .pw-row{display:flex;flex-direction:column;gap:4px;margin-top:8px}#panel .pw-chips{display:flex;flex-wrap:wrap;gap:5px}
</style>`);
// players already past a new exclusive's level get it once (their old claim there was a plain reward)
const PASS_NEW_L=[22,24,28,33,38,42,48,52,55,58,60,63,66,70,73,76,80,84,88,90,93,96,100];
{ const _m=migrate; migrate=function(o){ const raw=isObj(o)?o:null; const m=_m(o); try{ if(raw&&raw.passMig!==1&&m.pass&&m.pass.claimed>=22){ m.pass.got=isObj(m.pass.got)?m.pass.got:{};
      for(const L of PASS_NEW_L){ if(L>m.pass.claimed) break; const [k,id,name]=PASS_SPECIAL[L];
        if(PASS_NEW_KINDS[k]){ const key=PASS_NEW_KINDS[k]; if(!m.owned[key].includes(id)) m.owned[key].push(id); } else if(k==='tint'){ if(Array.isArray(m.petTints)&&!m.petTints.includes(id)) m.petTints.push(id); }
        else if(k==='pearl') m.pearls=(m.pearls||0)+id; else if(k==='boon') m.boonPts=(m.boonPts||0)+id; m.pass.got[L]=name; } }
    m.passMig=1; }catch(e){} return m; }; }
