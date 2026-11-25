
// =====================================================================
// Driftline 2.0: Paths tab, Tide Pass,
// Fishing Derby, richer scenery for every water, two new waters' looks
// =====================================================================

// ---------- Tide Pass (0.3: a longer climb, a Tide-only item every five levels, every reward spelled out) ----------
const PASS_MAX = 100; /* 0.4.9: five chapters of 20 (cj_tidepass.js) */
const passNeed = L => Math.round(180 + L*45 + L*L*.8);
const PASS_XP = [8,14,30,60,150,400];
const PASS_SPECIAL = {3:['aq','lantern','Sea Lantern','Aquarium decoration: a lantern that glows on the sand.'], 5:['shoe','tidetreads','Tide Treads','Shoes: sea-glass boots with a rolling wave stripe.'],
  8:['tint','tidal','Tidal pet color','Pet color: recolors any pet in deep sea blues.'], 10:['neck','tidescarf','Tide Scarf','Neckwear: a long scarf of sea foam that drifts behind you.'],
  12:['hat','tidecap','Tide Cap','Hat: a captain’s cap with the Tide crest.'], 15:['bait','mythbait','6 Myth Bait','Bait: legendary fish are far more likely to bite.'],
  18:['aq','anchor','Old Anchor','Aquarium decoration: a rusty anchor half sunk in the sand.'], 20:['back','tidecape','Tide Cape','On your back: a cape of rolling water that shimmers as it moves.'],
  25:['aq','chest','Treasure Chest','Aquarium decoration: a chest that lets out bubbles.'], 30:['out','tidecoat','Tide Coat','Outfit: a long coat with a glowing wave hem.'],
  35:['back','shellpack','Seashell Pack','On your back: a backpack made from a giant scallop shell.'], 40:['aq','diver','Little Diver','Aquarium decoration: a tiny diver who waves at your fish.'],
  45:['crate2','legend','2 Legendary Crates','Two Legendary Mystery Crates, the best crates there are.'], 50:['back','tidewings','Tide Wings','On your back: wings of living water. The rarest thing in the Pass.']};
function passReward(L){ const sp=PASS_SPECIAL[L]; return sp?sp[2]:passPlain(L).name; }
function addPassXP(n){ S.pass.xp+=Math.round(n*(1+.06*pr('tidewalker'))*(relic('tidecaller')?1.3:1)); let ups=0; while(S.pass.xp>=passNeed(S.pass.lvl+1)){ S.pass.xp-=passNeed(S.pass.lvl+1); S.pass.lvl++; ups++; } if(ups){ setTimeout(()=>toast('Tide Pass level '+S.pass.lvl+'! Rewards are waiting in the Pass tab.'),1300); } }
function passArt(x,w,h,L){ const sp=PASS_SPECIAL[L]; x.clearRect(0,0,w,h); const cx=w/2, s=w/120;
  if(sp){ const [k,id]=sp; if(k==='aq') drawDecor(x,id,w/2,h*.92,w/160,0); else if(k==='hat') hatPreview(x,w,h,id,S.look.hatCol); else if(k==='out') drawAngler(x,cx,h*.96,h/80,Object.assign({},S.look,{outfit:id,hat:'none'}),{});
    else if(k==='tint') drawPetStyled(x,S.pet,cx,h*.86,2.8*s,0,0,Object.assign({},petLook(),{tint:id})); else if(k==='wood'){ x.fillStyle='#f0e8f4'; x.fillRect(w*.08,h*.5,w*.84,h*.13); x.fillStyle='#c8b8d0'; for(let i=0;i<5;i++) x.fillRect(w*(.12+i*.17),h*.5,2*s,h*.13); }
    else if(k==='shoe'||k==='neck'||k==='back') wearPreview(x,k,id,w,h); else if(k==='bait') drawJunk(x,w,h,'goldlure'); else drawJunk(x,w,h,'chest'); return; }
  const p=L>PASS_MAX?{k:'coins'}:passPlain(L); if(p.k==='big'||p.k==='small') drawJunk(x,w,h,'chest'); else if(p.k==='coins'||p.k==='bonus') drawJunk(x,w,h,'coin');
  else if(p.k==='scales'){ x.fillStyle='#7fc8a9'; x.beginPath(); for(let i=0;i<6;i++){ const a=i/6*Math.PI*2; x.lineTo(cx+Math.cos(a)*24*s,h/2+Math.sin(a)*24*s); } x.fill(); } else { x.font=Math.round(34*s)+'px system-ui'; x.textAlign='center'; x.fillText('🎟',cx,h*.64); } }
function renderPass(P){ const pl=S.pass.lvl, need=passNeed(pl+1), unclaimed=pl-S.pass.claimed;
  const shown=[]; const start=Math.max(1,Math.min(S.pass.claimed+1, pl+1)-2); for(let L=start; L<start+15; L++) shown.push(L);
  const nextSp=Object.keys(PASS_SPECIAL).map(Number).find(L=>L>pl), ns=nextSp&&PASS_SPECIAL[nextSp];
  P.innerHTML=`<div class="row spread"><div><h2>Tide Pass</h2><p class="sub">Every fish you land fills the Tide Pass. Rarer fish fill it faster. ${PASS_MAX} levels with special Tide rewards along the way, then bonus rewards forever.</p></div>
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
   <div class="list" style="margin:8px 0">${[{name:'You',score:d.total},...d.rivals].sort((a,b)=>b.score-a.score).map((r,i)=>`<div class="row spread prize"><span>${i+1}. <b>${esc(r.name)}</b></span><span>${wFix(r.score,1)}</span></div>`).join('')}</div>
   <p class="sub">${txt}</p><button class="btn" data-ev="skip">Back to fishing</button>`; if(G.st==='idle'){ G.st='event'; $('evcard').hidden=false; } else { setTimeout(()=>{ if(G.st==='idle'){ G.st='event'; $('evcard').hidden=false; } else toast('Derby over: place '+place+'. '+txt); },2500); } checkFeats(); save(); }
setInterval(()=>{ if(S.derby && Date.now()>=S.derby.until) endDerby(); const dl=$('derbyleft'); if(dl&&S.derby) dl.textContent=mmss(Math.max(0,Math.ceil((S.derby.until-Date.now())/1000)))+' left'; },1000);
function derbyHTML(){ const d=S.derby; if(d){ const left=Math.max(0,Math.ceil((d.until-Date.now())/1000));
    return `<div class="tile bwt" style="--c:#ffc94d;margin-bottom:12px"><div class="row spread"><h4>Fishing derby at ${LOCS[locIdx(d.loc)].name}</h4><span class="badge g" id="derbyleft">${mmss(left)} left</span></div><div class="meta">Your total: <b>${wFix(d.total,1)}</b> from ${d.n} fish · you’re in place ${derbyPlace()}${S.loc!==d.loc?' · <span style="color:var(--danger)">travel back there for catches to count!</span>':''}</div>
     ${d.rivals.map(r=>`<div class="meta">${esc(r.name)}: ${wFix(r.score,1)}</div>`).join('')}</div>`; }
  return `<div class="tile bwt" style="--c:#ffc94d;margin-bottom:12px"><div class="row spread"><div><h4>Fishing derby</h4><div class="meta">Four minutes at ${curLoc().name}: land the heaviest total catch to beat ${RIVALS.map(r=>r[0]).join(', ')}. Medals pay coins, Scales, tickets and Tide Pass XP.</div><div class="meta">Medals: 🥇 ${S.medals.gold} · 🥈 ${S.medals.silver} · 🥉 ${S.medals.bronze}</div></div>
    <button class="btn" data-act="derby" ${S.money>=derbyCost()&&G.st==='idle'?'':'disabled'}>Enter · <span class="coin">${fmt(derbyCost())}</span></button></div></div>`; }
function drawDerbyHUD(){ const d=S.derby; if(!d) return; const left=Math.max(0,Math.ceil((d.until-Date.now())/1000)); const txt='🏆 Derby '+mmss(left)+' · '+wFix(d.total,1)+' · #'+derbyPlace()+(S.loc!==d.loc?' (wrong water)':'');
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
