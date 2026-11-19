
// =====================================================================
// 0.3 Tide Pass regular levels: customisation instead of pocket change. Each level shows exactly which
// piece you get (picked from things you don't own yet), so every claim adds something to your look or home.
// =====================================================================
function passWearPool(){ return [...HATS.filter(x=>x.src==='shop'&&!S.owned.hats.includes(x.id)).map(x=>({kind:'hat',id:x.id,name:x.name,cat:'Hat'})),
  ...GLASSES.filter(x=>x[2]&&!S.owned.glasses.includes(x[0])).map(x=>({kind:'gls',id:x[0],name:x[1],cat:'Glasses'})),
  ...OUTFITS.filter(x=>x[3]==='shop'&&!S.owned.outfits.includes(x[0])).map(x=>({kind:'out',id:x[0],name:x[1],cat:'Outfit'})),
  ...PATTERNS.filter(x=>x[2]&&!S.owned.pats.includes(x[0])).map(x=>({kind:'pat',id:x[0],name:x[1]+' fabric',cat:'Fabric'})),
  ...SHOES.filter(x=>x[3]==='shop'&&!S.owned.shoes.includes(x[0])).map(x=>({kind:'shoe',id:x[0],name:x[1],cat:'Shoes'})),
  ...NECKS.filter(x=>x[3]==='shop'&&!S.owned.necks.includes(x[0])).map(x=>({kind:'neck',id:x[0],name:x[1],cat:'Neckwear'})),
  ...BACKS.filter(x=>x[3]==='shop'&&!S.owned.backs.includes(x[0])).map(x=>({kind:'back',id:x[0],name:x[1],cat:'Worn on your back'}))].sort((a,b)=>(a.kind+a.id).localeCompare(b.kind+b.id)); }
function passDecorPool(){ return [...DOCK_DECOR.filter(d=>d.src==='shop'&&!S.dock.owned.includes(d.id)).map(d=>({kind:'dock',id:d.id,name:d.name,cat:'Home decoration'})),
  ...DECOR.filter(d=>d.price&&!(d.src&&d.src!=='shop')&&!S.aq.owned.includes(d.id)).map(d=>({kind:'aq',id:d.id,name:d.name,cat:'Aquarium decoration'}))].sort((a,b)=>(a.kind+a.id).localeCompare(b.kind+b.id)); }
// upcoming levels pick in order and never promise the same item twice (so no repeats, back to back or otherwise)
// when you already own everything a clothing or decoration level could give, it falls back to Scales or tickets
// (never the same as the level next to it)
const PASS_FB_SCALES={k:'scales', name:'50 Scales', d:'Scales level up rods.'}, PASS_FB_TIX={k:'tickets', name:'300 tickets', d:'Tickets buy Boardwalk prizes.'};
function passPickItem(L,pool){ if(!pool.length) return null; const decor=pool[0].kind==='dock'||pool[0].kind==='aq', used=new Set(); let pick=null;
  for(let l=(S.pass.claimed||0)+1; l<=L; l++){ if(PASS_SPECIAL[l]) continue; const slot=(passPlainIndex(l)-1)%5; if(decor?slot!==3:!(slot===0||slot===2)) continue;
    let i=hashStr('tide'+l)%pool.length, n=0; while(used.has(pool[i].kind+pool[i].id)&&n<pool.length){ i=(i+1)%pool.length; n++; } pick=pool[i]; used.add(pick.kind+pick.id); }
  return pick; }
function passPlainIndex(L){ let n=0; for(let i=1;i<=L;i++) if(!PASS_SPECIAL[i]) n++; return n; }
passPlain = function(L){ if(S.pass.got&&S.pass.got[L]&&L<=S.pass.claimed) return {k:'got', name:S.pass.got[L], d:'Claimed.'}; if(L<=S.pass.claimed) return {k:'got', name:'Claimed', d:'Already claimed.'}; const slot=[0,1,2,3,4][(passPlainIndex(L)-1)%5];
  if(slot===0||slot===2){ const it=passPickItem(L,passWearPool()); if(it) return {k:'wear', it, name:it.name, d:it.cat+': yours to wear, only a claim away.'};  return slot===0?PASS_FB_SCALES:PASS_FB_TIX; }
  if(slot===3){ const it=passPickItem(L,passDecorPool()); if(it) return {k:'decor', it, name:it.name, d:it.cat+' for your '+(it.kind==='dock'?'dock':'tank')+'.'};  return PASS_FB_SCALES; }
  if(slot===1) return {k:'big', name:'Big Mystery Crate', d:'Clothes, Boardwalk-only wear, decor and the rarer pets.'};
  return {k:'bundle', name:'25 Scales + 150 tickets', d:'Scales level up rods; tickets buy Boardwalk prizes.'}; };
const grantPass_ = function(L){ const sp=PASS_SPECIAL[L]; if(L%10===0 && maxed('tidewalker')) S.tokens.big++;
  if(sp){ const [k,id]=sp; if(k==='dock'&&!S.dock.owned.includes(id)) S.dock.owned.push(id); if(k==='tint'&&!S.petTints.includes(id)) S.petTints.push(id); if(k==='hat'&&!S.owned.hats.includes(id)) S.owned.hats.push(id);
    if(k==='wood'&&!S.dock.owned.includes(id)) S.dock.owned.push(id); if(k==='out'&&!S.owned.outfits.includes(id)) S.owned.outfits.push(id); if(k==='crate2') S.tokens.legend+=2; if(k==='bait') S.bait[id]=(S.bait[id]||0)+6;
    if(k==='shoe'&&!S.owned.shoes.includes(id)) S.owned.shoes.push(id); if(k==='neck'&&!S.owned.necks.includes(id)) S.owned.necks.push(id); if(k==='back'&&!S.owned.backs.includes(id)) S.owned.backs.push(id); return sp[2]; }
  const p=passPlain(L);
  if(p.k==='wear'){ const it=p.it, o=S.owned; ({hat:o.hats,gls:o.glasses,out:o.outfits,pat:o.pats,shoe:o.shoes,neck:o.necks,back:o.backs})[it.kind].push(it.id); return it.name; }
  if(p.k==='decor'){ (p.it.kind==='dock'?S.dock.owned:S.aq.owned).push(p.it.id); return p.it.name; }
  if(p.k==='big'){ S.tokens.big++; return p.name; }
  if(p.k==='scales'){ S.scales+=50; return p.name; } if(p.k==='tickets'){ S.tickets+=300; return p.name; }
  S.scales+=25; S.tickets+=150; return p.name; };
grantPass = function(L){ const r=grantPass_(L); S.pass.got=S.pass.got||{}; S.pass.got[L]=r; return r; };
const _passArt_0 = passArt;
passArt = function(x,w,h,L){ if(PASS_SPECIAL[L]) return _passArt_0(x,w,h,L); const p=passPlain(L); x.clearRect(0,0,w,h); if(p.k==='got'){ x.fillStyle='#7fe3c4'; x.font='700 '+Math.round(h*.4)+'px system-ui'; x.textAlign='center'; x.fillText('✓',w/2,h*.64); return; }
  if(p.k==='wear'){ const it=p.it; if(it.kind==='hat') hatPreview(x,w,h,it.id,S.look.hatCol); else if(it.kind==='out') drawAngler(x,w/2,h*.96,h/80,Object.assign({},S.look,{outfit:it.id,hat:'none'}),{}); else if(it.kind==='gls'){ const s=h/24; drawAngler(x,w*.42,h*.5+56*s,s,Object.assign({},S.look,{glasses:it.id,hat:'none'}),{}); }
    else if(it.kind==='pat'){ x.save(); x.translate(w/2,h*.16); x.scale(h/32,h/32); x.fillStyle=S.look.shirt; x.beginPath(); x.moveTo(-9,0); x.lineTo(9,0); x.lineTo(8,24); x.lineTo(-8,24); x.closePath(); x.fill(); x.clip(); drawPattern(x,it.id,S.look.shirt,-10,-1,20,26); x.restore(); }
    else wearPreview(x,it.kind,it.id,w,h); return; }
  if(p.k==='decor'){ if(p.it.kind==='dock') dockThumb(x,p.it.id,w,h); else drawDecor(x,p.it.id,w/2,h*.92,w/160,0); return; }
  if(p.k==='big') drawJunk(x,w,h,'chest'); else { x.fillStyle='#7fc8a9'; x.beginPath(); for(let i=0;i<6;i++){ const a=i/6*Math.PI*2; x.lineTo(w*.4+Math.cos(a)*w*.16,h/2+Math.sin(a)*w*.16); } x.fill(); x.font=Math.round(w*.24)+'px system-ui'; x.textAlign='center'; x.fillText('🎟',w*.72,h*.62); } };
