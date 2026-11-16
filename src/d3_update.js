
// =====================================================================
// Update 1.5: rods & attachments, pet dress-up / petting / bond,
// daily tasks & gift, patch notes, safe reset, Boardwalk 2.0, quips
// =====================================================================
const GAME_VERSION = '2.2.2';
const PATCHES = [
 {v:'2.2.2', name:'Small patch', items:[
  'Phones held sideways: a new button on the edge of the water hides the menus so the water fills the screen, and brings them back. It remembers your choice.' ]},
 {v:'2.2.1', name:'Quick fix', items:[
  'Sending progress with a 6-digit code now works on every network. Before, it could fail to connect on some home Wi-Fi and phone connections.',
  'Your code now stays valid for 3 hours, so there’s no rush to type it in.',
  'The Save tab explains the new way to move your progress.' ]},
 {v:'2.2', name:'Closer Together', items:[
  'Moving progress between phone and PC is much easier, in both directions: tap Send on the device with your progress and type its 6-digit code on the other one. Phones can scan the code instead. Works for any amount of progress, no matter how far you’ve come.',
  'The old “progress is too big for a QR code” problem is gone.',
  'Links still work as a backup, under “Other ways” in the Save tab.',
  'The Settings shortcut now opens moving progress and save codes.',
  'A gift code box in Settings, for when a friend has something special for you.' ]},
 {v:'2.1', name:'More of Everything', items:[
  '21 new fish across every water. A few of them are very chill. One is an absolute unit.',
  '10 new pets: some in the pet shop, some in crates, one at the Prize Counter.',
  'Two pets at once: pick a ★ favourite that is always with you and bonds faster, plus a companion that tags along. Pet either one on the dock.',
  'Petting in the Pets tab now has a little animation, and the bond hearts update right away.',
  '6 new rods. Not all of them can be bought.',
  '4 new attachments.',
  '5 new skills, each with its own mastery effect.',
  'A fifth Path opens at level 75.',
  '4 new baits, including some for the far waters.',
  '6 new hats and 3 new outfits.',
  '5 new aquarium decorations and 5 new dock decorations.',
  '6 new pieces of junk to fish up.',
  '2 new relics.',
  'A new game on the Boardwalk, and new prizes at the Prize Counter.',
  'A new rare weather.',
  '8 new feats.',
  'Send to my other device: one link (or a QR code) moves your progress between PC and phone. Find it in the Save tab.',
  'All tabs now fit on one screen as a tidy icon grid. No more sideways scrolling. The Encyclopedia is now called the Fish Log.',
  'Settings has a shortcut straight to your save codes.' ]},
 {v:'2.0', name:'Driftline 2.0: Home Waters', items:[
  'Two new waters at the far end of the map, for anglers who think they’ve seen it all.',
  '40 new fish live in them, including a few legends and something rarer still.',
  'Home: your dock now goes with you everywhere. Choose its wood, add up to 8 decorations, and the cozier it gets, the better you fish.',
  'The Tide Pass: a 50-level reward track that fills up just by fishing, with special rewards along the way and bonus rewards after.',
  'Fishing derbies: four-minute contests against three rival anglers. Medals pay well.',
  'Specialisations moved to their own Paths tab.',
  'Every water got a visual makeover: distant mountains, reflections, fish leaping in the distance, wildlife, sunbeams, and warmer light at night.',
  'New hats, outfits and pet colours, some of them only from the Tide Pass.',
  'New gear upgrades for the toughest fish yet.',
  'Phones in landscape now get a side-by-side layout, with the water on the left and menus on the right.',
  'Every tab has an icon now, and buttons, cards and panels got a polish.',
  'New feats for all of the above.' ]},
 {v:'1.7', name:'Try Before You Buy', items:[
  'Try things on before you buy them: clothes, hats, glasses and outfits on your angler, colours and accessories on your pet, water, floors and decorations in your tank.',
  'Prize Counter items now show a picture, and the wearable ones can be previewed.',
  '14 new shirt patterns are rotating into the clothing shop.',
  'The fishing vest, life jacket and captain’s coat can now be any colour.' ]},
 {v:'1.6', name:'Choices & Skies', items:[
  'Specialisations: four big choices on your angler’s path, each with a real trade-off. You can switch later, for a fee.',
  'Every skill now unlocks a special effect when fully learned. Some of them change how fishing feels.',
  'Wisdom Pearls can now be traded for permanent relics. Choose wisely.',
  'Keep an eye on the sky. Some rare weather has been spotted, and it isn’t subtle.',
  'The harbourmaster has new kinds of bounties, and now pays in Scales too.',
  'The update banner now tells you which update is waiting.' ]},
 {v:'1.5', name:'Rods, Pals & the Big Boardwalk', items:[
  'Pets can now be named, dyed and dressed up. They also really like being petted. Try tapping yours.',
  'Pets you pet often grow closer to you, and their bonus grows with them.',
  'A new Rods tab: a whole collection of rods, attachments and upgrades. Not every rod is for sale…',
  'Scales: a new material from rare catches, used for the finest gear.',
  'New baits on the shelf, some with very particular tastes.',
  'Rarer fish now pay out much more: coins, XP, aquarium income, and sometimes a little extra.',
  'Fishermen whisper about something rarer than Legendary.',
  'More fish in every water. Some of them seem to have spent too long on the internet.',
  'New pets to meet, new hats, outfits, glasses, hairstyles and beards.',
  'The aquarium has far more room for decorations, and there are plenty of new ones.',
  'The Boardwalk got a makeover: new games, tickets, a Prize Counter, and free spins every hour.',
  'Daily tasks and a daily gift.',
  'Bigger game window on large screens and in full screen.',
  'Resetting your progress now needs a typed confirmation, and keeps a backup you can restore.',
  'Patch notes! Hello.' ]},
 {v:'1.4', name:'The Boardwalk', items:['Settings with volume controls.','Cozy music and nature sounds.','Aquarium decorating and feeding.','Mastery stars and angler ranks.','Surprise mini-games.','The Boardwalk opens.','Lots of new pets.','A cleaner layout for phones.','A Windows desktop app.','The top bar no longer jumps around.']},
 {v:'1.3', name:'Take It With You', items:['Install Driftline as an app.','Plays offline and updates itself.','Save codes to move your progress between devices.']},
 {v:'1.2', name:'The Big Catch', items:['Three new waters.','Many more fish, each with its own fighting style.','Junk, oddities and treasure.','Hotspots.','Aquarium boosts.','A wardrobe, hats and pets.','The encyclopedia.']},
 {v:'1.1', name:'Deeper Waters', items:['Skills, the aquarium, weather, feats and voyages.']},
 {v:'1.0', name:'First Cast', items:['Driftline launches. Welcome to the water.']},
];

// ---------- quips: a little humour, never the main event ----------
const QUIPS = {
  snap:['The fish sends its regards.','Somewhere a fish is telling its friends about you.','Line: 0. Fish: 1.','That one’s going in the fish newspaper.','It’ll be back. With friends.'],
  lost:['It said “nah”.','Classic fish behaviour.','It had places to be.','It’s fine. You’ll find another. Probably.'],
  pet:['purrs','wiggles happily','does a little hop','leans in','looks very proud','approves'],
  sell:['The fishmonger nods, impressed.','The fishmonger counts it twice. Out loud.','“Pleasure doing business,” says the fishmonger, smelling of fish.','The fishmonger whistles.'],
  full:['Your cooler is full. Even the ice is complaining.','No room left. The cooler is begging you to stop.'],
  seashell:['A pretty seashell. Worth nothing. Treasure it anyway.','A seashell! The wheel thinks this is funny.'],
};
const quip = k => QUIPS[k] ? pick(QUIPS[k]) : '';

// ---------- rods ----------
// id, name, source, price, water needed, attachment slots, colour, stats, description
const RODS = [
 ['bamboo','Bamboo Rod','start',0,'pond',1,'#d9c7a0',{},'Simple and honest. Everyone starts here.'],
 ['willow','Willow Rod','shop',1500,'pond',1,'#a07a4a',{rare:.05,tension:.05},'Bends like a branch, never breaks.'],
 ['fibre','Fibreglass Rod','shop',6000,'river',2,'#e8e8e8',{reel:.08,tension:.08},'Light, springy and very forgiving.'],
 ['carbon','Carbon Pro','shop',25000,'coast',2,'#2a2a2a',{cast:1.1,rare:.1,reel:.1},'What the serious anglers use. Smells expensive.'],
 ['frostrod','Frostbite Rod','shop',60000,'frost',2,'#9ad8ff',{tension:.15,rare:.1,calm:.15},'Cold to the touch. Fish stay calmer on it.'],
 ['coralrod','Coral Caster','shop',120000,'reef',2,'#ff7a9a',{shiny:.5,rare:.15,bite:.1},'Grown, not built. Shiny fish love it.'],
 ['stormrod','Storm Rod','shop',300000,'shelf',3,'#5a6aca',{rare:.25,reel:.15,cast:1.1},'Hums faintly before thunder.'],
 ['abyssrod','Abyssal Spire','shop',800000,'deep',3,'#3a1a5a',{rare:.35,tension:.2,hook:.15},'Forged from something that lived very far down.'],
 ['scrap','Rusty Old Rod','junk',0,'pond',2,'#8a5a3a',{treasure:.6,trophy:.1},'Rusty and bent. Junk seems to love it anyway.'],
 ['golden','Golden Rod','crate',0,'pond',3,'#ffcc33',{sell:.25,shiny:.5},'Solid gold. The fishmonger can’t say no to it.'],
 ['tides','Rod of Tides','rank',0,'pond',3,'#3ad0c0',{rare:.3,hot:1,bite:.15},'The water itself points you to the good spots.'],
 ['spine','Leviathan Spine','feat',0,'pond',3,'#ff6ad5',{rare:.5,reel:.25,tension:.25},'Rumour says it once belonged to something mythic.'],
].map(a=>({id:a[0],name:a[1],src:a[2],price:a[3],need:a[4],slots:a[5],col:a[6],st:a[7],d:a[8]}));
const ROD_I = Object.fromEntries(RODS.map(r=>[r.id,r]));
// id, name, key, values per tier, description
const ATTS = [
 ['bobber','Bright Bobber','bite',[.08,.15,.25],'Fish notice your bait sooner.'],
 ['sinker','Lead Sinker','rare',[.05,.1,.18],'Gets your bait down to the good stuff.'],
 ['swivel','Ball Swivel','tension',[.05,.1,.16],'Stops the line from twisting under strain.'],
 ['bell','Bite Bell','hook',[.08,.15,.25],'Rings when they bite. More time to strike.'],
 ['charm','Lucky Charm','shiny',[.15,.3,.5],'A tiny four-leaf clover in resin.'],
 ['spool','Deep Spool','spool',[10,20,35],'More line before a runner gets away.'],
 ['bead','Glow Bead','night',[.1,.2,.35],'Glows in the dark. Night fish come to look.'],
 ['magnet','Magnet Tip','treasure',[.2,.4,.7],'Junk and treasure stick to it.'],
 ['feather','Feather Fly','trophy',[.1,.2,.35],'Big fish can’t resist a fancy feather.'],
 ['whistle','Calm Whistle','calm',[.08,.15,.25],'A soothing little tune. Tempers cool.'],
].map(a=>({id:a[0],name:a[1],k:a[2],v:a[3],d:a[4]}));
const ATT_I = Object.fromEntries(ATTS.map(a=>[a.id,a]));
const ATT_COST = [[1500,0],[12000,10],[60000,60]];
const rod = () => ROD_I[S.rods.eq] || ROD_I.bamboo;
const rodLvl = (id=S.rods.eq) => S.rods.lvl[id]||0;
function rodAtts(id=S.rods.eq){ return (S.rods.att[id]||[]).filter(a=>ATT_I[a] && S.atts[a]).slice(0,(ROD_I[id]||ROD_I.bamboo).slots); }
function attVal(a){ const t=S.atts[a]||0; return t ? ATT_I[a].v[t-1] : 0; }
function rodBonus(k){ if(!S.rods) return 0; const r=rod(), L=rodLvl(); let v=(r.st[k]||0);
  if(k==='reel') v+=.03*L; if(k==='tension') v+=.02*L; if(k==='rare') v+=.02*L;
  for(const a of rodAtts()){ const at=ATT_I[a]; if(at.k===k) v+=attVal(a); if(k==='rare' && at.k==='night' && isNight()) v+=attVal(a); }
  return v; }
const rodCast = () => S.rods ? (rod().st.cast||1) : 1;
const rodHook = () => S.rods ? (rod().st.hook||0) + rodAtts().filter(a=>a==='bell').reduce((s,a)=>s+attVal(a),0) : 0;
const rodSpool = () => S.rods ? rodAtts().filter(a=>a==='spool').reduce((s,a)=>s+attVal(a),0) : 0;
const rodUpCost = id => { const L=rodLvl(id); const r=ROD_I[id]; return {coins:Math.round(Math.max(5000,r.price)*.12*(L+1)), scales:(L+1)*(L+1)*2}; };
const statTxt = (k,v) => k==='cast'?'+'+Math.round((v-1)*100)+'% cast distance': k==='hook'?'+'+v.toFixed(2)+' s hook window': k==='spool'?'+'+v+' m of line': k==='night'?'+'+Math.round(v*100)+'% rare odds at night': fmtB(k,v);
function grantRod(id){ if(S.rods.owned.includes(id)) return null; S.rods.owned.push(id); return {title:'New rod: '+ROD_I[id].name+'!', kind:'rod', id}; }
function rodSVG(col,lvl){ return `<svg viewBox="0 0 120 40" width="120" height="40" aria-hidden="true"><path d="M8 34 Q60 30 112 6" stroke="${col}" stroke-width="4" fill="none" stroke-linecap="round"/><circle cx="24" cy="31" r="6" fill="#2a2a2a"/><circle cx="24" cy="31" r="2.5" fill="#8a8a8a"/>${lvl?`<text x="112" y="36" fill="#ffc94d" font-size="11" font-weight="700" text-anchor="end">Lv ${lvl}</text>`:''}</svg>`; }
function renderRods(P){ const r=rod(), atts=rodAtts();
  const stats=r=>{ const keys=Object.keys(r.st); return keys.length?keys.map(k=>statTxt(k,r.st[k])).join(' · '):'No special stats'; };
  const slotRow=(i)=>{ const cur=atts[i]||''; const opts=ATTS.filter(a=>S.atts[a.id] && (a.id===cur || !atts.includes(a.id)));
    return `<div class="toggle"><div><b>Slot ${i+1}</b><div class="meta">${cur?ATT_I[cur].name+' '+'I'.repeat(S.atts[cur])+': '+statTxt(ATT_I[cur].k,attVal(cur)):'Empty'}</div></div>
      <div class="chips"><button class="chipb" data-act="rodatt" data-k="${i}:" aria-pressed="${!cur}">None</button>${opts.map(a=>`<button class="chipb" data-act="rodatt" data-k="${i}:${a.id}" aria-pressed="${cur===a.id}">${a.name}</button>`).join('')}</div></div>`; };
  const up=rodUpCost(r.id), L=rodLvl();
  P.innerHTML=`<div class="row spread"><div><h2>Rods</h2><p class="sub">Your rod shapes every cast. Collect rods, upgrade them with coins and <b>Scales</b>, and fit attachments. Scales come from Rare and better fish.</p></div>
   <div style="text-align:right"><div class="pts" style="color:var(--kelp)">${fmt(S.scales)}</div><div class="sub">Scales</div></div></div>
  <div class="tile" style="margin-top:10px;border-color:${r.col}"><div class="row spread"><div class="row">${rodSVG(r.col,L)}<div><div class="rar" style="color:var(--gold)">In your hands</div><h4>${r.name}</h4><div class="meta">${esc(r.d)}</div></div></div>
    <div style="text-align:right"><div class="meta">Level ${L} / 10</div>${L<10?`<button class="btn sm" data-act="rodup" data-k="${r.id}" ${S.money>=up.coins&&S.scales>=up.scales?'':'disabled'}>Upgrade · <span class="coin">${fmt(up.coins)}</span> + ${up.scales} Scales</button>`:'<span class="badge g">Max level</span>'}</div></div>
    <div class="meta">${stats(r)}${L?` · Level bonus: +${3*L}% reel speed, −${2*L}% line tension, +${2*L}% rare odds`:''}</div>
    <h5>Attachments (${r.slots} slot${r.slots>1?'s':''})</h5>${Array.from({length:r.slots},(_,i)=>slotRow(i)).join('')}
    ${!Object.keys(S.atts).length?'<p class="sub">Buy attachments below, then fit them here.</p>':''}</div>
  <h2 style="margin-top:16px">Rod rack</h2><div class="grid">${RODS.map(x=>{ const own=S.rods.owned.includes(x.id), here=S.rods.eq===x.id, open=S.unlocked.includes(x.need), hidden=!own&&x.src!=='shop'&&x.src!=='start';
    const btn = here?'<button class="btn alt sm" disabled>Equipped</button>' : own?`<button class="btn sm" data-act="rodeq" data-k="${x.id}">Equip</button>` : x.src==='shop'?(open?`<button class="btn sm" data-act="rodbuy" data-k="${x.id}" ${S.money>=x.price?'':'disabled'}>Buy · <span class="coin">${fmt(x.price)}</span></button>`:`<span class="meta">Unlock ${LOCS[locIdx(x.need)].name} first</span>`) : '<span class="meta">Not sold anywhere. Keep fishing…</span>';
    return `<div class="tile ${here?'done':''}">${rodSVG(hidden?'#2a4a55':x.col,own?rodLvl(x.id):0)}<h4>${hidden?'???':x.name}</h4><div class="meta">${hidden?'A mystery rod.':esc(x.d)}</div><div class="meta">${hidden?'':stats(x)+' · '+x.slots+' slot'+(x.slots>1?'s':'')}</div>${btn}</div>`; }).join('')}</div>
  <h2 style="margin-top:16px">Attachments</h2><p class="sub">Each attachment has three tiers. Once you own one, it fits on any rod.</p><div class="grid">${ATTS.map(a=>{ const t=S.atts[a.id]||0, next=t<3?ATT_COST[t]:null;
    return `<div class="tile"><div class="row spread"><h4>${a.name}</h4><span class="meta">Tier ${t} / 3</span></div><div class="pips">${[0,1,2].map(i=>`<i class="${i<t?'on':''}"></i>`).join('')}</div><div class="meta">${esc(a.d)}</div>
      <div class="val" style="font-size:14px">${t?statTxt(a.k,a.v[t-1]):'Not owned'}${next?` <span class="meta">→ ${statTxt(a.k,a.v[t])}</span>`:''}</div>
      ${next?`<button class="btn sm" data-act="attbuy" data-k="${a.id}" ${S.money>=next[0]&&S.scales>=next[1]?'':'disabled'}>${t?'Upgrade':'Buy'} · <span class="coin">${fmt(next[0])}</span>${next[1]?' + '+next[1]+' Scales':''}</button>`:'<span class="badge g">Max tier</span>'}</div>`; }).join('')}</div>`; }

// ---------- pets: looks, petting, bond ----------
const PET_HEAD = {dog:[8,-13,4.2],cat:[1,-14,4],frog:[0,-8.5,3.5],duck:[5,-11,3.3],goat:[8.5,-14,3.6],turtle:[7,-3,2.3],sheep:[8,-10,3],otter:[0,-18,3.7],owl:[0,-13,4],llama:[6.5,-27,3],capybara:[8,-9,4],
  parrot:[1,-15,3],lizard:[8,-3,2.5],horse:[17,-38,4],penguin:[.5,-17,3.6],crab:[0,-4,3.5],rabbit:[6,-11,4],hamster:[0,-6,4.5],chicken:[4,-14,3.4],pig:[8,-10,4.2],hedgehog:[6,-3.5,3],fox:[7,-12,3.8],
  raccoon:[7,-11,4],seal:[9,-8,4],redpanda:[7,-11,4],snail:[-1,-7,5],bat:[0,-1,3.5],axopet:[8,-5,3.2],flamingo:[8.5,-27,2.4],pelican:[3,-18,3.4],panda:[7,-12,4.4],koala:[1,-15,4.5],monkey:[1,-15,4],
  polarbear:[8,-11,4.6],octopus:[0,-9,6],ghost:[0,-10,7],robot:[0,-16,5],slime:[0,-8,7],dragon:[7,-12,4],unicorn:[13,-26,4],corgi:[8,-11,4],shiba:[8,-12,4],goose:[6,-20,3],squirrel:[3,-13,3.6],
  beaver:[7,-9,4],cow:[10,-15,4.5],sloth:[2,-12,4],deer:[9,-19,3.6],jelly:[0,-12,6],tiger:[8,-12,4.2],phoenix:[5,-17,3.6],narwhal:[6,-7,4],teddy:[0,-15,5]};
const PET_TINTS = [['none','Natural',0,''],['rose','Rose',800,'hue-rotate(-40deg) saturate(1.3)'],['mint','Mint',800,'hue-rotate(90deg)'],['sky','Sky',800,'hue-rotate(180deg)'],['violet','Violet',1500,'hue-rotate(250deg) saturate(1.2)'],
  ['shadow','Shadow',5000,'brightness(.5) contrast(1.2)'],['snow','Snow',5000,'grayscale(1) brightness(1.55)'],['golden','Golden',0,'sepia(1) saturate(3) hue-rotate(-10deg) brightness(1.1)'],['rainbow','Rainbow',0,'rainbow'],
  ['tidal','Tidal',0,'hue-rotate(160deg) saturate(1.5) brightness(1.1)'],['peach','Peach',1200,'sepia(.6) hue-rotate(-20deg) saturate(1.6)'],['lavender','Lavender',1500,'hue-rotate(220deg) saturate(.8) brightness(1.15)'],['cocoa','Cocoa',1200,'sepia(1) saturate(1.2) brightness(.7)']];
const PET_ACCS = [['none','Nothing',0],['bandana','Bandana',0],['bow','Bow',600],['bowtie','Bow tie',1200],['scarf','Scarf',900],['bell','Bell collar',1000],['flower','Flower',800],['glasses','Sunglasses',1500],['cape','Hero cape',3000],['balloon','Star balloon',0],['partyhat','Party hat',0]];
const PRIZE_TINT = {golden:600, rainbow:1200, tidal:1}, PRIZE_ACC = {balloon:150, partyhat:250};
let PET_EDIT=null; const editPet = () => (PET_EDIT && (PET_EDIT===S.pet||PET_EDIT===S.pet2)) ? PET_EDIT : S.pet;
function petLook(id=editPet()){ if(!S.petLook[id]) S.petLook[id]={name:'',tint:'none',hat:'none',hatCol:'#c8553a',acc:'none',accCol:'#d8303a'}; return S.petLook[id]; }
const petName = (id=S.pet) => (S.petLook[id]&&S.petLook[id].name) || PETI[id].name;
function bondLevel(id){ const b=S.bond&&S.bond[id]; return b ? Math.min(10, Math.floor(Math.sqrt(b.xp/4))) : 0; }
function tintFilter(lk,t){ const tt=PET_TINTS.find(x=>x[0]===lk.tint); if(!tt||!tt[3]) return 'none'; return tt[3]==='rainbow' ? 'hue-rotate('+((t*80)%360|0)+'deg) saturate(1.4)' : tt[3]; }
function petOffset(id,t){ if(id==='frog') return [0,-Math.pow(Math.max(0,Math.sin(t*1.4)),10)*7]; if(id==='bat') return [0,-14+Math.sin(t*2)*2]; if(id==='ghost') return [0,Math.sin(t*2)*2-4]; if(id==='crab') return [Math.sin(t*1.2)*2,0]; return [0,0]; }
function drawPetGear(c,id,lk,t){ if(id==='lily'){ drawLilyGear(c,lk,t); return; } const a=PET_HEAD[id]||[2,-12,4]; const [hx,hy,r]=a; const k=r/7.5;
  const col=lk.accCol||'#d8303a';
  c.save(); c.lineCap='round';
  if(lk.acc==='cape'){ c.fillStyle=col; c.beginPath(); c.moveTo(hx-r*.9,hy+r*.8); c.quadraticCurveTo(hx-r*3.4,hy+r*2+Math.sin(t*4)*1.2,hx-r*3,hy+r*3.6); c.lineTo(hx-r*.4,hy+r*2.4); c.closePath(); c.fill(); }
  if(lk.acc==='balloon'){ c.strokeStyle='#ddd'; c.lineWidth=.5; c.beginPath(); c.moveTo(hx-r,hy+r); c.quadraticCurveTo(hx-r*2,hy-r*3,hx-r*1.6+Math.sin(t*1.5)*1.5,hy-r*6); c.stroke(); c.fillStyle='#ffd84a'; c.save(); c.translate(hx-r*1.6+Math.sin(t*1.5)*1.5,hy-r*6.6); c.beginPath(); for(let i=0;i<10;i++){ const ang=-Math.PI/2+i*Math.PI/5, rr=i%2?r*.6:r*1.4; c.lineTo(Math.cos(ang)*rr,Math.sin(ang)*rr); } c.fill(); c.restore(); }
  if(lk.hat && lk.hat!=='none'){ c.save(); c.translate(hx,hy); c.scale(k,k); drawHat(c,lk.hat,HATI[lk.hat]&&HATI[lk.hat].fixed?'#888888':(lk.hatCol||'#c8553a'),t); c.restore(); }
  if(lk.acc==='partyhat'){ c.save(); c.translate(hx,hy); c.scale(k,k); drawHat(c,'party',col,t); c.restore(); }
  const nx=hx-r*.2, ny=hy+r*1.05;
  if(lk.acc==='bandana'){ c.fillStyle=col; c.beginPath(); c.moveTo(nx-r*.9,ny-r*.2); c.lineTo(nx+r*.9,ny-r*.2); c.lineTo(nx,ny+r*.8); c.closePath(); c.fill(); }
  if(lk.acc==='scarf'){ c.fillStyle=col; c.fillRect(nx-r*.9,ny-r*.25,r*1.8,r*.45); c.fillRect(nx-r*.9,ny,r*.4,r*1.1); }
  if(lk.acc==='bowtie'||lk.acc==='bow'){ const bx=lk.acc==='bow'?hx-r*.7:nx, by=lk.acc==='bow'?hy-r*.9:ny; c.fillStyle=col; c.beginPath(); c.moveTo(bx,by); c.lineTo(bx-r*.6,by-r*.35); c.lineTo(bx-r*.6,by+r*.35); c.closePath(); c.moveTo(bx,by); c.lineTo(bx+r*.6,by-r*.35); c.lineTo(bx+r*.6,by+r*.35); c.closePath(); c.fill(); c.beginPath(); c.arc(bx,by,r*.15,0,7); c.fill(); }
  if(lk.acc==='bell'){ c.strokeStyle=col; c.lineWidth=r*.25; c.beginPath(); c.moveTo(nx-r*.8,ny-r*.2); c.lineTo(nx+r*.8,ny-r*.2); c.stroke(); c.fillStyle='#ffcc33'; c.beginPath(); c.arc(nx,ny+r*.15,r*.3,0,7); c.fill(); }
  if(lk.acc==='flower'){ const fx=hx-r*.6, fy=hy-r*.75; for(let i=0;i<5;i++){ c.fillStyle='#ff9ad0'; c.beginPath(); c.arc(fx+Math.cos(i*1.26)*r*.28,fy+Math.sin(i*1.26)*r*.28,r*.2,0,7); c.fill(); } c.fillStyle='#ffd84a'; c.beginPath(); c.arc(fx,fy,r*.15,0,7); c.fill(); }
  if(lk.acc==='glasses'){ c.fillStyle='#111'; c.beginPath(); c.ellipse(hx+r*.25,hy-r*.15,r*.32,r*.22,0,0,7); c.ellipse(hx+r*.85,hy-r*.15,r*.28,r*.2,0,0,7); c.fill(); c.strokeStyle='#111'; c.lineWidth=r*.1; c.beginPath(); c.moveTo(hx+r*.5,hy-r*.18); c.lineTo(hx+r*.6,hy-r*.18); c.stroke(); }
  c.restore(); }
function drawPetStyled(c,id,x,y,s,t,night=0,lkOver=null){ const lk=lkOver||petLook(id); if(id==='lily') LILY.lk=lk; c.save(); c.filter=tintFilter(lk,t); drawPet(c,id,x,y,s,t,night); c.restore();
  const o=petOffset(id,t); c.save(); c.translate(x+o[0]*s,y+o[1]*s); c.scale(s,s); if(id==='slime'){ const sq=1+Math.sin(t*3)*.08; c.scale(1/sq,sq); } drawPetGear(c,id,lk,t); c.restore(); }
let PET_NIGHT=0, PET_BOX=null, PET_BOX2=null, hearts=[], petT=-9999, petT2=-9999, lastPetAt=0, petNameFor=null;
function drawOnePet(id,px,ay,sc,t,night,pt){ const big=id==='horse'||id==='cow'; const s=sc*(big?.85:1);
  const k=(performance.now()-pt)/650; g.save(); if(k>=0&&k<1){ const b=Math.sin(k*Math.PI); g.translate(px,ay); g.scale(1+.1*b,1-.12*b); g.translate(-px,-ay-b*7*sc); }
  drawPetStyled(g,id,px,ay,s,t,night*.6); g.restore(); return {x0:px-18*s,x1:px+(big?22:16)*s,y0:ay-(big?48:30)*s,y1:ay+4,k}; }
function drawPetScene(ax,ay,sc,t,night){ PET_NIGHT=night; const id=S.pet, big=id==='horse'||id==='cow'; const px=ax-(big?40:26)*sc;
  if(S.pet2&&PETI[S.pet2]){ const big2=S.pet2==='horse'||S.pet2==='cow'; PET_BOX2=drawOnePet(S.pet2,px-(big?22:12)*sc-(big2?34:22)*sc,ay,sc*.9,t,night,petT2); } else PET_BOX2=null;
  PET_BOX=drawOnePet(id,px,ay,sc,t,night,petT);
  const two=PET_BOX2&&PET_BOX2.k<PET_BOX.k, nb=two?PET_BOX2:PET_BOX, nmId=two?S.pet2:id, k=nb.k;
  if(k>=0&&k<2.2){ const nm=(nmId===id&&S.pet2?'★ ':'')+petName(nmId), cx=(nb.x0+nb.x1)/2; g.font='700 11px system-ui'; g.textAlign='center'; const tw=g.measureText(nm).width; g.globalAlpha=Math.min(1,2.2-k); g.fillStyle='rgba(5,14,20,.7)'; rr(cx-tw/2-7,nb.y0-22,tw+14,17,8); g.fill(); g.fillStyle='#ffc94d'; g.fillText(nm,cx,nb.y0-10); g.globalAlpha=1; }
  for(let i=hearts.length-1;i>=0;i--){ const h=hearts[i]; h.t+=1/60; if(h.t>1.4){ hearts.splice(i,1); continue; } const hy=h.y-h.t*40, hx=h.x+Math.sin(h.t*5+i)*6; g.globalAlpha=Math.max(0,1-h.t/1.4); g.fillStyle='#ff6a9a'; g.beginPath(); const z=h.s; g.moveTo(hx,hy+z*.4); g.bezierCurveTo(hx-z,hy-z*.3,hx-z*.5,hy-z,hx,hy-z*.4); g.bezierCurveTo(hx+z*.5,hy-z,hx+z,hy-z*.3,hx,hy+z*.4); g.fill(); } g.globalAlpha=1; }
const inPetBox = (m,b) => b && m.x>=b.x0 && m.x<=b.x1 && m.y>=b.y0 && m.y<=b.y1;
function petHit(e){ if(!e||!PET_BOX) return false; const m=canvasXY(e); const hit=inPetBox(m,PET_BOX)?S.pet:inPetBox(m,PET_BOX2)?S.pet2:null; if(!hit) return false;
  const now=performance.now(); if(now-lastPetAt<300) return true; lastPetAt=now; const bx=hit===S.pet?PET_BOX:PET_BOX2; if(hit===S.pet) petT=now; else petT2=now;
  for(let i=0;i<3;i++) hearts.push({x:(bx.x0+bx.x1)/2+rnd(-8,8), y:bx.y0+rnd(0,8), t:-i*.12, s:rnd(4,7)});
  tone(880,.08,'sine',.05); tone(1320,.12,'sine',.04,0,.08); petTap(hit); return true; }
// one pet (on the dock or in the Pets tab). The favourite bonds twice as fast.
function petTap(id){ const today=dayKey(); const b=S.bond[id]||(S.bond[id]={xp:0,day:today,today:0}); if(b.day!==today){ b.day=today; b.today=0; }
  const before=bondLevel(id); if(b.today<25){ b.today++; b.xp+=id===S.pet?2:1; } S.gstats.pets++; taskProgress('pet',1);
  if(maxed('petpal') && Date.now()-(S.petGiftT||0)>3600000 && Math.random()<.35){ S.petGiftT=Date.now(); const r=Math.random(); let gift;
    if(r<.4){ gift=fmt(earn(bestLoot()*rnd(2,5)*coinMult()))+' coins'; } else if(r<.75){ const sc=rint(3,8); S.scales+=sc; gift=sc+' Scales'; } else { const opts=Object.keys(BAIT).filter(k=>k!=='worm'&&!BAIT[k].junk&&!BAIT[k].scales); const k=pick(opts); S.bait[k]+=5; renderBait(); gift='5 '+BAIT[k].name; }
    setTimeout(()=>toast(petName(id)+' brought you a gift: '+gift+'!'),600); sfx.coin(); }
  refreshPetInfo(); const after=bondLevel(id); if(after>before){ toast(petName(id)+' feels closer to you. Bond level '+after+'! (+'+after*5+'% pet bonus)'); sfx.shiny(); } else if(Math.random()<.25) toast(petName(id)+' '+quip('pet')+'.');
  checkFeats(); save(); }
function petBondText(id){ const bl=bondLevel(id), b=S.bond[id], p=PETI[id], fav=id===S.pet; const val=fav?petVal(id):petVal(id)*compShare();
  return `Bonus: <span class="aq">${fmtB(p.k,val)}</span>${bl?' (bond +'+bl*5+'%)':''}${fav?'':' ('+Math.round(compShare()*100)+'% as your companion, rising with bond)'}. ${bl<10?`Pet them to grow closer: ${b?b.xp:0} / ${Math.pow(bl+1,2)*4}. Up to 25 pets a day count${b&&b.today>=25?' (that’s today’s 25!)':''}${fav?', and favourites bond twice as fast':''}.`:'You’re best friends.'}`; }
function petCustomHTML(){ const id=editPet(), lk=petLook(id), p=PETI[id], bl=bondLevel(id);
  const pvOn=(kind,id)=>PET_PV&&PET_PV.kind===kind&&PET_PV.id===id;
  const tints=PET_TINTS.filter(x=>x[2]||S.petTints.includes(x[0])||!(x[0] in PRIZE_TINT)).map(x=>{ const own=S.petTints.includes(x[0]); return `<button class="chipb" data-act="${own?'pettint':'petpv'}" data-k="${own?x[0]:'tint:'+x[0]}" aria-pressed="${lk.tint===x[0]||pvOn('tint',x[0])}">${x[1]}${own?'':' · '+fmt(x[2])}</button>`; }).join('');
  const accs=PET_ACCS.filter(x=>x[2]||S.petAccs.includes(x[0])||!PRIZE_ACC[x[0]]).map(x=>{ const own=S.petAccs.includes(x[0]); return `<button class="chipb" data-act="${own?'petacc':'petpv'}" data-k="${own?x[0]:'acc:'+x[0]}" aria-pressed="${lk.acc===x[0]||pvOn('acc',x[0])}">${x[1]}${own?'':' · '+fmt(x[2])}</button>`; }).join('');
  const hats=HATS.filter(h=>S.owned.hats.includes(h.id)).map(h=>`<button class="chipb" data-act="pethat" data-k="${h.id}" aria-pressed="${lk.hat===h.id}">${esc(h.name)}</button>`).join('');
  const cols=[...FREE_COLS,...S.owned.cols]; const sw=k=>`<div class="chips">${cols.map(cl=>`<button class="sw" data-act="petcol" data-k="${k}" data-v="${cl}" aria-pressed="${lk[k]===cl}" style="background:${cl}" title="${cl}"></button>`).join('')}</div>`;
  const pick2 = S.pet2 ? `<div class="chips" style="margin-bottom:8px"><span class="meta" style="align-self:center">Dressing up:</span><button class="chipb" data-act="petedit" data-k="${S.pet}" aria-pressed="${id===S.pet}">★ ${esc(petName(S.pet))}</button><button class="chipb" data-act="petedit" data-k="${S.pet2}" aria-pressed="${id===S.pet2}">${esc(petName(S.pet2))}</button></div>` : '';
  return `<div class="tile" style="margin-top:10px">${petPvBarHTML()}${pick2}<div class="stylewrap" style="margin-top:0;grid-template-columns:200px 1fr"><div class="preview"><canvas id="petcv" width="400" height="300" style="cursor:pointer" title="Pet me!"></canvas></div><div>
    <div class="row spread"><h4>${id===S.pet?'<span title="Favourite" style="color:#ffc94d">★</span> ':''}${esc(petName(id))} <span class="meta">the ${p.name.toLowerCase()}${S.pet2?(id===S.pet?' · favourite':' · companion'):''}</span></h4><span id="petbond"><span class="meta">Bond ${'♥'.repeat(bl)}${'♡'.repeat(10-bl)}</span></span></div>
    <div class="meta" id="petbondinfo">${petBondText(id)}</div>
    <div class="meta" style="color:#ff9ac0">Tap ${esc(petName(id))} in the picture to pet them.</div>
    <h5>Name</h5><input id="petname" maxlength="16" value="${esc(lk.name)}" placeholder="${esc(p.name)}" style="width:100%;background:#0a161d;color:var(--ink);border:1px solid var(--line);border-radius:9px;padding:8px">
    <h5>Colour</h5><div class="chips">${tints}</div>
    <h5>Accessory</h5><div class="chips">${accs}</div>${lk.acc!=='none'&&lk.acc!=='balloon'?'<h5>Accessory colour</h5>'+sw('accCol'):''}
    <h5>Hat <span style="text-transform:none;letter-spacing:0">(shares your hat collection)</span></h5><div class="chips">${hats}</div>${lk.hat!=='none'&&!(HATI[lk.hat]&&HATI[lk.hat].fixed)?'<h5>Hat colour</h5>'+sw('hatCol'):''}
  </div></div></div>`; }
function paintPetCustom(){ const c=$('petcv'); if(!c) return; const id=editPet();
  if(id==='lily'&&!paintPetCustom.live){ paintPetCustom.live=true; const step=()=>{ if(!$('petcv')||editPet()!=='lily'){ paintPetCustom.live=false; return; } paintPetCustom(); requestAnimationFrame(step); }; requestAnimationFrame(step); } const x=c.getContext('2d'); x.clearRect(0,0,c.width,c.height); const big=id==='horse'||id==='cow'; const now=performance.now(), k=(now-(id===S.pet?petT:petT2))/700;
  x.save(); if(k>=0&&k<1){ const b=Math.sin(k*Math.PI); x.translate(200,250); x.scale(1+.08*b,1-.1*b); x.translate(-200,-250-b*28); }
  PET_NIGHT=0; drawPetStyled(x,id,200,250,big?4.2:6.5,now/1000,0,petPreviewLook(id)); x.restore();
  if(k>=0&&k<1.6){ for(let i=0;i<4;i++){ const hk=k-i*.12; if(hk<0) continue; const hx=170+i*22+Math.sin(hk*6+i)*10, hy=150-hk*110, z=12; x.globalAlpha=Math.max(0,1-hk/1.4); x.fillStyle='#ff6a9a'; x.beginPath(); x.moveTo(hx,hy+z*.4); x.bezierCurveTo(hx-z,hy-z*.3,hx-z*.5,hy-z,hx,hy-z*.4); x.bezierCurveTo(hx+z*.5,hy-z,hx+z,hy-z*.3,hx,hy+z*.4); x.fill(); } x.globalAlpha=1; requestAnimationFrame(paintPetCustom); }
  c.onclick=()=>{ const pid=editPet(); for(let i=0;i<3;i++) setTimeout(()=>tone(900+i*200,.08,'sine',.04),i*70); if(pid===S.pet) petT=performance.now(); else petT2=performance.now(); petTap(pid); requestAnimationFrame(paintPetCustom); }; }
// update the bond text without rebuilding the whole tab (so the petting animation keeps playing)
function refreshPetInfo(){ if(S.tab!=='pets') return; const el=$('petbond'); if(!el) return; const id=editPet(), bl=bondLevel(id);
  el.innerHTML=`<span class="meta">Bond ${'♥'.repeat(bl)}${'♡'.repeat(10-bl)}</span>`; const inf=$('petbondinfo'); if(inf) inf.innerHTML=petBondText(id); }

// ---------- daily tasks & gift ----------
function dayKey(d=new Date()){ return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0'); }
const rint = (a,b) => a+Math.floor(Math.random()*(b-a+1));
function makeTasks(){ const L=pick(S.unlocked), base=bestLoot(); const pool=[
  {t:'catch', n:rint(10,20), d:'Land {n} fish'}, {t:'catchat', loc:L, n:rint(5,10), d:'Land {n} fish at '+LOCS[locIdx(L)].name}, {t:'rare', n:rint(2,4), d:'Land {n} Rare or better fish'},
  {t:'pet', n:rint(5,10), d:'Pet {pet} {n} times'}, {t:'hot', n:rint(2,3), d:'Land {n} catches from hotspots'}, {t:'junk', n:2, d:'Fish up {n} pieces of junk'},
  {t:'earn', n:Math.round(base*rint(15,30)), start:S.stats.earned, d:'Earn {n} coins'}, {t:'game', n:rint(1,3), d:'Play {n} Boardwalk games'} ];
  const out=[]; while(out.length<3){ const x=pick(pool); if(out.some(o=>o.t===x.t)) continue; out.push(Object.assign({have:0, claimed:false, coins:Math.round(base*rnd(4,8)), scales:rint(3,8)},x)); } return out; }
function ensureDaily(){ const k=dayKey(); if(!S.daily||S.daily.day!==k) S.daily={day:k, tasks:makeTasks(), bonus:false}; return S.daily; }
function taskHave(t){ return t.t==='earn' ? Math.max(0,S.stats.earned-t.start) : t.have; }
function taskProgress(type,n,sp){ const d=ensureDaily(); for(const t of d.tasks){ if(t.claimed) continue; if(t.t===type || (t.t==='catchat' && type==='catch' && sp && sp.loc===t.loc)) t.have=Math.min(t.n,t.have+n); } }
function dailyLogin(){ const k=dayKey(), y=dayKey(new Date(Date.now()-86400000)); if(S.login.last===k) return null; S.login.streak = S.login.last===y ? S.login.streak+1 : 1; S.login.last=k;
  if(!S.stats.caught && !S.savedAt) return null; const day=S.login.streak, mult=Math.min(3,1+day*.25); const coins=earn(bestLoot()*3*mult*coinMult()); const sc=Math.min(10,day); S.scales+=sc; let extra='';
  if(day%7===0){ S.tokens.big++; extra=' and a big Mystery Crate'; } S.freeSpins=Math.min(3,S.freeSpins+1);
  return 'Daily gift, day '+day+': +'+fmt(coins)+' coins, +'+sc+' Scales, a free spin'+extra+'!'; }
function dailyHTML(){ const d=ensureDaily(); const done=d.tasks.filter(t=>taskHave(t)>=t.n).length;
  return `<div class="tile" style="margin-bottom:12px"><div class="row spread"><div><h4>Daily tasks</h4><div class="meta">New tasks every day. Finish all three for a bonus crate. Login streak: ${S.login.streak} day${S.login.streak===1?'':'s'}.</div></div><span class="meta">${done} / 3</span></div>
   ${d.tasks.map((t,i)=>{ const h=Math.min(t.n,taskHave(t)), ok=h>=t.n; return `<div class="toggle"><div style="min-width:0"><b>${esc(t.d.replace('{n}',fmt(t.n)).replace('{pet}',petName()))}</b><div class="meta">${fmt(h)} / ${fmt(t.n)} · reward <span class="coin">${fmt(t.coins)}</span> + ${t.scales} Scales</div><div class="prog"><i style="width:${h/t.n*100}%"></i></div></div>
     ${t.claimed?'<span class="badge g">Done</span>':`<button class="btn sm" data-act="taskclaim" data-i="${i}" ${ok?'':'disabled'}>Claim</button>`}</div>`; }).join('')}
   ${d.tasks.every(t=>t.claimed)?(d.bonus?'<p class="sub">Bonus collected. See you tomorrow!</p>':'<button class="btn" data-act="taskbonus" style="margin-top:8px">Claim bonus crate</button>'):''}</div>`; }

// ---------- patch notes ----------
function patchHTML(p){ return `<div class="rar" style="color:var(--gold)">${p.label?esc(p.label):"Update "+p.v}</div><h3>${esc(p.name)}</h3><ul style="text-align:left;margin:8px 0 0;padding-left:20px;line-height:1.55">${p.items.map(i=>`<li>${esc(i)}</li>`).join('')}</ul>`; }
function showPatchNotes(p=PATCHES[0], after){ G.st='event'; $('evin').innerHTML=patchHTML(p)+`<div class="row" style="justify-content:center;margin-top:12px"><button class="btn" data-ev="skip">Let’s fish!</button></div>`; $('evcard').hidden=false;
  if(after) setTimeout(()=>toast(after),400); }
function allPatchesHTML(){ return (S.owned.pets.includes("lily")?[LILY_PATCH]:[]).concat(PATCHES).map(p=>`<details ${p===PATCHES[0]?'open':''} style="margin:6px 0"><summary style="cursor:pointer"><b>${p.label?esc(p.label):"Update "+p.v}</b> · ${esc(p.name)}</summary><ul style="margin:6px 0;padding-left:20px;line-height:1.5">${p.items.map(i=>`<li class="meta" style="color:var(--ink)">${esc(i)}</li>`).join('')}</ul></details>`).join(''); }

// ---------- safe reset ----------
const BACKUP_KEY='driftline-backup';
function hasBackup(){ try{ return !!localStorage.getItem(BACKUP_KEY); }catch(e){ return false; } }
function dangerHTML(){ const bk=hasBackup();
  return `<details class="tile" style="margin-top:12px;border-color:#ff546855"><summary style="cursor:pointer"><b>Danger zone</b> <span class="meta">· reset progress</span></summary>
   <p class="sub">This erases your coins, fish, pets, rods, everything. A backup is saved first, so you can restore it on this device afterwards.</p>
   <label class="meta" for="resetword">Type <b>DELETE</b> to confirm</label><div class="row" style="margin-top:6px"><input id="resetword" autocomplete="off" style="background:#0a161d;color:var(--ink);border:1px solid var(--line);border-radius:9px;padding:7px;width:140px">
   <button class="btn sm" id="resetbtn" data-act="safereset" style="background:var(--danger)" disabled>Erase everything</button></div>
   ${bk?'<div class="toggle"><div><b>Restore backup</b><div class="meta">Bring back the progress you had before your last reset.</div></div><button class="btn alt sm" data-act="restorebk">Restore</button></div>':''}</details>`; }
document.addEventListener('fullscreenchange',()=>setTimeout(resize,60));
document.addEventListener('input',e=>{ if(e.target.id==='resetword'){ const b=$('resetbtn'); if(b) b.disabled=e.target.value.trim()!=='DELETE'; } });
document.addEventListener('change',e=>{ if(e.target.id==='petname'){ petLook().name=e.target.value.trim().slice(0,16); save(); lastHud=''; toast(petName()+' likes that name.'); } });

// ---------- Boardwalk 2.0 ----------
const SPIN_EVERY = 3600*1000, SPIN_BANK = 3;
function accrueSpins(){ const now=Date.now(); if(!S.wheelT){ S.wheelT=now; return; } const h=Math.floor((now-S.wheelT)/SPIN_EVERY); if(h>0){ S.freeSpins=Math.min(SPIN_BANK,S.freeSpins+h); S.wheelT = S.freeSpins>=SPIN_BANK ? now : S.wheelT+h*SPIN_EVERY; } }
const PRIZES = [
 ['scales10','10 Scales',100,()=>{ S.scales+=10; return '10 Scales'; }],
 ['crate','Small Mystery Crate',120,()=>{ S.tokens.small++; return 'a small Mystery Crate'; }],
 ['myth','3 Myth Bait',220,()=>{ S.bait.mythbait=(S.bait.mythbait||0)+3; renderBait(); return '3 Myth Bait'; }],
 ['balloon','Star balloon (pet accessory)',150,()=>{ S.petAccs.push('balloon'); return 'a star balloon for your pet'; },()=>S.petAccs.includes('balloon')],
 ['partyhat','Party hat (pet accessory)',250,()=>{ S.petAccs.push('partyhat'); return 'a tiny party hat for your pet'; },()=>S.petAccs.includes('partyhat')],
 ['golden','Golden pet colour',600,()=>{ S.petTints.push('golden'); return 'the Golden pet colour'; },()=>S.petTints.includes('golden')],
 ['carousel','Carousel (aquarium decor)',700,()=>{ S.aq.owned.push('carousel'); return 'a Carousel for your aquarium'; },()=>S.aq.owned.includes('carousel')],
 ['sixsevencap','67 Cap (hat)',670,()=>{ S.owned.hats.push('sixsevencap'); return 'the 67 Cap'; },()=>S.owned.hats.includes('sixsevencap')],
 ['carnival','Carnival Top Hat (hat)',900,()=>{ S.owned.hats.push('carnival'); return 'the Carnival Top Hat'; },()=>S.owned.hats.includes('carnival')],
 ['fishbowl','Fishbowl Helmet (hat)',1100,()=>{ S.owned.hats.push('fishbowl'); return 'the Fishbowl Helmet'; },()=>S.owned.hats.includes('fishbowl')],
 ['rainbow','Rainbow pet colour',1200,()=>{ S.petTints.push('rainbow'); return 'the Rainbow pet colour'; },()=>S.petTints.includes('rainbow')],
 ['teddy','Teddy Bear (pet)',1500,()=>{ S.owned.pets.push('teddy'); return 'a Teddy Bear pet!'; },()=>S.owned.pets.includes('teddy')],
 ['spacesuit','Space suit (outfit)',1800,()=>{ S.owned.outfits.push('spacesuit'); return 'a Space suit'; },()=>S.owned.outfits.includes('spacesuit')],
];
function addTickets(n){ n=Math.max(0,Math.round(n)); S.tickets+=n; return n; }
let duck=null, hilo=null;
function newDuck(){ const prizes=[]; for(let i=0;i<6;i++){ const r=Math.random(); prizes.push(r<.04?{k:'crate',t:'a small crate!'}:r<.2?{k:'coins',m:rnd(2,4)}:r<.5?{k:'tix',n:rint(20,45)}:{k:'tix',n:rint(5,15)}); } duck={prizes, pick:-1}; }
function newHilo(){ hilo={card:rint(1,13), streak:0, pot:Math.round(bestLoot()*2), done:false, msg:'Higher or lower than '+0+'?'}; }
const CARD_FISH = ['','Minnow','Perch','Trout','Bass','Carp','Pike','Salmon','Tuna','Shark','Marlin','Kraken','Leviathan','Legend'];
function boardwalkBanner(){ return `<div class="bw-banner"><div class="bw-lights">${Array.from({length:18},(_,i)=>`<i style="animation-delay:${(i%6)*.25}s"></i>`).join('')}</div><h2>The Boardwalk</h2><p class="sub">Games of chance on the pier. Coins only, no real money, and the gulls are watching.</p>
  <div class="row" style="justify-content:center;gap:18px;margin-top:6px"><span><b class="coin">${fmtShort(S.money)}</b></span><span><b>🎟 ${fmt(S.tickets)}</b> <span class="meta">tickets</span></span><span><b style="color:var(--kelp)">${fmt(S.scales)}</b> <span class="meta">Scales</span></span></div></div>`; }
function renderBoardwalk(P){ accrueSpins(); const tk=S.tokens, base=bestLoot(); const nextIn=Math.max(0,Math.ceil((SPIN_EVERY-(Date.now()-S.wheelT))/60000));
  const crateRow=(k,name,desc)=>`<div class="row spread" style="padding:6px 0;border-bottom:1px solid var(--line)"><div style="min-width:0"><b>${name}</b>${tk[k]?` <span class="badge g">${tk[k]} free</span>`:''}<div class="meta">${desc}</div></div>
    ${tk[k]?`<button class="btn sm" data-act="crate" data-k="${k}" data-free="1">Open free</button>`:`<button class="btn sm" data-act="crate" data-k="${k}" ${S.money>=crateCost(k)?'':'disabled'}>Open · <span class="coin">${fmt(crateCost(k))}</span></button>`}</div>`;
  const betBtn=f=>{ const amt=Math.min(Math.floor(S.money*f), base*60); return `<button class="btn alt sm" data-act="flip" data-k="${f}" ${amt>=10?'':'disabled'}>Bet ${Math.round(f*100)}% · <span class="coin">${fmt(Math.max(0,amt))}</span></button>`; };
  const ducks = duck ? duck.prizes.map((p,i)=>{ const open=duck.pick>=0; const lab=p.k==='crate'?'📦':p.k==='coins'?'🪙':'🎟'+p.n; return `<button class="duckb ${open?(i===duck.pick?'picked':'open'):''}" data-act="duckpick" data-i="${i}" ${open?'disabled':''} aria-label="Duck ${i+1}" style="animation-delay:${i*.3}s">${open?`<span>${lab}</span>`:'🦆'}</button>`; }).join('') : '';
  P.innerHTML=boardwalkBanner()+`<div class="grid bw">
   <div class="tile bwt" style="--c:#c8553a"><h4>Lucky wheel</h4><div class="wheelwrap"><div class="wheelring"><canvas id="wheelcv" width="520" height="520"></canvas></div>
     ${S.freeSpins>0?`<button class="btn" data-act="spin" data-k="free" ${WH.spinning?'disabled':''}>Free spin! (${S.freeSpins} left)</button>`:`<button class="btn" data-act="spin" ${WH.spinning||S.money<wheelCost()?'disabled':''}>Spin · <span class="coin">${fmt(wheelCost())}</span></button>`}
     <span class="meta">A free spin every hour, up to ${SPIN_BANK} saved.${S.freeSpins<SPIN_BANK?' Next in '+nextIn+' min.':''}</span>
     ${WH.result?`<div class="val" style="text-align:center">${esc(WH.result)}</div>`:''}</div></div>
   <div class="tile bwt" style="--c:#7a4a9a"><h4>Mystery crates</h4><div class="meta">Coins, lures, clothes, decor, rods, and pets you can’t get anywhere else.</div>
     ${crateRow('small','Small crate','Mostly coins and lures. Sometimes a pet.')}${crateRow('big','Big crate','Clothes, decor, and the rarer pets.')}${crateRow('legend','Legendary crate','The really good stuff.')}
     ${crateRes?`<div class="reveal" style="text-align:center;margin-top:8px"><canvas width="240" height="180" id="crateprev"></canvas><div class="val">${esc(crateRes.title)}</div></div>`:''}</div>
   <div class="tile bwt" style="--c:#2a8aa8"><h4>Duck pond</h4><div class="meta">Pick a rubber duck. Every duck wins something. Mostly tickets. Sometimes…</div>
     ${duck?`<div class="ducks">${ducks}</div>${duck.pick>=0?`<div class="val" style="text-align:center">${esc(duck.msg||'')}</div><button class="btn alt sm" data-act="duckagain" ${S.money>=base?'':'disabled'}>Play again · <span class="coin">${fmt(base)}</span></button>`:''}`:`<button class="btn" data-act="duckagain" ${S.money>=base?'':'disabled'}>Play · <span class="coin">${fmt(base)}</span></button>`}</div>
   <div class="tile bwt" style="--c:#4f8a4a"><h4>Higher or lower</h4><div class="meta">Guess if the next fish card is higher or lower. Every right guess grows the pot by half. Cash out any time.</div>
     ${hilo&&!hilo.done?`<div class="hilocard"><b>${hilo.card}</b><span>${CARD_FISH[hilo.card]}</span></div><div class="val" style="text-align:center">Pot: <span class="coin">${fmt(hilo.pot)}</span> · streak ${hilo.streak}</div>
       <div class="row" style="justify-content:center"><button class="btn sm" data-act="hilo" data-k="hi">Higher ▲</button><button class="btn sm" data-act="hilo" data-k="lo">Lower ▼</button><button class="btn alt sm" data-act="hilocash" ${hilo.streak?'':'disabled'}>Cash out</button></div>`
      :`${hilo&&hilo.done?`<div class="val" style="text-align:center">${esc(hilo.msg)}</div>`:''}<button class="btn" data-act="hilostart" ${S.money>=base*2?'':'disabled'}>Deal · <span class="coin">${fmt(base*2)}</span></button>`}</div>
   <div class="tile bwt" style="--c:#d8a020"><h4>Coin flip with the Fishmonger</h4><div class="meta">Heads you double it, tails he keeps it. A fair coin, he swears on his best haddock.</div>
     <div class="row">${betBtn(.1)}${betBtn(.25)}${betBtn(.5)}</div>${flipRes?`<div class="val" style="font-size:18px;color:${flipRes.win?'var(--gold)':'var(--muted)'}">${esc(flipRes.txt)}</div>`:''}<div class="meta">${S.gstats.flips} flips · ${S.gstats.flipWins} won</div></div>
   <div class="tile bwt" style="--c:#d87aa0"><h4>Scratch card</h4><div class="meta">Find three of the same: 🐟 ×2 · 🦀 ×4 · 🐚 ×8 · 💎 ×20 · 👑 ×60 (times ${fmt(base)} coins).</div>
     ${scratch&&!scratch.done?`<div class="scratch">${scratch.cells.map((s,i)=>`<button data-act="scratch" data-i="${i}" class="${scratch.open[i]?'open':''}" aria-label="Scratch box ${i+1}">${scratch.open[i]?scratch.sym[s]:''}</button>`).join('')}</div><div class="row" style="justify-content:center"><button class="btn alt sm" data-act="scratchall">Reveal all</button></div>`
      :`${scratch&&scratch.done?`<div class="scratch">${scratch.cells.map(s=>`<button class="open" disabled>${scratch.sym[s]}</button>`).join('')}</div><div class="val" style="text-align:center;color:${scratch.win>=0?'var(--gold)':'var(--muted)'}">${scratch.win>=0?'Winner! +'+fmt(scratch.prize)+' coins':'No match this time.'}</div>`:''}
      <button class="btn" data-act="buyscratch" ${S.money>=base*2?'':'disabled'}>Buy a card · <span class="coin">${fmt(base*2)}</span></button>`}</div>
   ${clawHTML()}
  </div>
  <div class="tile bwt" style="--c:#ffc94d;margin-top:12px"><div class="row spread"><div><h4>Prize counter</h4><div class="meta">Every Boardwalk game hands out tickets. Trade them here for things you can’t get anywhere else.</div></div><b>🎟 ${fmt(S.tickets)}</b></div>
   <div class="grid" style="grid-template-columns:repeat(auto-fill,minmax(200px,1fr))">${PRIZES.map(p=>{ const owned=p[4]&&p[4](); return `<div class="row spread prize"><span class="row" style="gap:8px;flex-wrap:nowrap"><canvas width="96" height="80" data-prize="${p[0]}" style="width:48px;height:40px;cursor:default;flex:0 0 auto"></canvas><span>${esc(p[1])}</span></span>
     <span class="row" style="gap:4px">${!owned&&PRIZE_PV[p[0]]?`<button class="btn alt sm" data-act="prizepv" data-k="${p[0]}">Preview</button>`:''}${owned?'<span class="badge g">Owned</span>':`<button class="btn sm" data-act="prize" data-k="${p[0]}" ${S.tickets>=p[2]?'':'disabled'}>🎟 ${p[2]}</button>`}</span></div>`; }).join('')}</div></div>`;
  paintPrizes(P); paintClaw();
  drawWheel(); const cp=$('crateprev'); if(cp&&crateRes){ const x=cp.getContext('2d'); const k=crateRes.kind;
    if(k==='pet') drawPetStyled(x,crateRes.id,120,160,crateRes.id==='unicorn'?3.4:5,0); else if(k==='decor') drawDecor(x,crateRes.id,120,170,1.6,0); else if(k==='hat') hatPreview(x,240,180,crateRes.id,S.look.hatCol,true);
    else if(k==='rod'){ x.strokeStyle=ROD_I[crateRes.id].col; x.lineWidth=8; x.lineCap='round'; x.beginPath(); x.moveTo(30,160); x.quadraticCurveTo(120,150,215,30); x.stroke(); }
    else if(k==='col'){ x.fillStyle=crateRes.id; x.beginPath(); x.arc(120,90,50,0,7); x.fill(); } else drawJunk(x,240,180,k==='lure'?'goldlure':'chest'); } }

// ---------- actions for this update ----------
function extraAct2(b){ const k=b.dataset.k, i=+b.dataset.i;
  switch(b.dataset.act){
    case 'rodeq': if(S.rods.owned.includes(k)){ S.rods.eq=k; toast('You pick up the '+ROD_I[k].name+'.'); } return 'render';
    case 'rodbuy': { const r=ROD_I[k]; if(!r||r.src!=='shop'||S.rods.owned.includes(k)||S.money<r.price||!S.unlocked.includes(r.need)) return 'skip'; S.money-=r.price; S.rods.owned.push(k); S.rods.eq=k; sfx.coin(); toast('New rod: '+r.name+'!'); return 'render'; }
    case 'rodup': { const c=rodUpCost(k); if(rodLvl(k)>=10||S.money<c.coins||S.scales<c.scales) return 'skip'; S.money-=c.coins; S.scales-=c.scales; S.rods.lvl[k]=rodLvl(k)+1; sfx.catch(2); toast(ROD_I[k].name+' is now level '+S.rods.lvl[k]); return 'render'; }
    case 'rodatt': { const [si,a]=k.split(':'); const id=S.rods.eq, list=(S.rods.att[id]||[]).slice(); list[+si]=a||''; S.rods.att[id]=list.slice(0,rod().slots); return 'render'; }
    case 'attbuy': { const t=S.atts[k]||0; if(t>=3) return 'skip'; const c=ATT_COST[t]; if(S.money<c[0]||S.scales<c[1]) return 'skip'; S.money-=c[0]; S.scales-=c[1]; S.atts[k]=t+1; sfx.coin(); toast(ATT_I[k].name+' tier '+(t+1)+'!');
      const cur=S.rods.att[S.rods.eq]||[]; if(!t && cur.filter(Boolean).length<rod().slots && !cur.includes(k)){ const l=cur.slice(); const free=l.findIndex(x=>!x); if(free>=0) l[free]=k; else l.push(k); S.rods.att[S.rods.eq]=l.slice(0,rod().slots); } return 'render'; }
    case 'pettint': { const tt=PET_TINTS.find(x=>x[0]===k); if(!tt) return 'skip'; PET_PV=null; if(!S.petTints.includes(k)){ if(!tt[2]||S.money<tt[2]) return 'skip'; S.money-=tt[2]; S.petTints.push(k); sfx.coin(); } petLook().tint=k; return 'render'; }
    case 'petacc': { const a=PET_ACCS.find(x=>x[0]===k); if(!a) return 'skip'; PET_PV=null; if(!S.petAccs.includes(k)){ if(!a[2]||S.money<a[2]) return 'skip'; S.money-=a[2]; S.petAccs.push(k); sfx.coin(); } petLook().acc=k; return 'render'; }
    case 'pethat': if(S.owned.hats.includes(k)) petLook().hat=k; return 'render';
    case 'petcol': petLook()[k]=b.dataset.v; return 'render';
    case 'taskclaim': { const t=ensureDaily().tasks[i]; if(!t||t.claimed||taskHave(t)<t.n) return 'skip'; t.claimed=true; addPassXP(40); earn(t.coins*coinMult()); S.scales+=t.scales; S.gstats.tasks++; sfx.coin(); toast('Task done: +'+fmt(t.coins*coinMult())+' coins, +'+t.scales+' Scales'); return 'render'; }
    case 'taskbonus': { const d=ensureDaily(); if(d.bonus||!d.tasks.every(t=>t.claimed)) return 'skip'; d.bonus=true; S.tokens.small++; sfx.catch(3); toast('All tasks done! A small Mystery Crate is waiting at the Boardwalk.'); return 'render'; }
    case 'patches': showPatchNotes(); return 'skip';
    case 'safereset': { const w=$('resetword'); if(!w||w.value.trim()!=='DELETE') return 'skip'; try{ localStorage.setItem(BACKUP_KEY, JSON.stringify(S)); }catch(e){}
      S=fresh(); S.seenPatch=GAME_VERSION; S.tab='settings'; S.savedAt=Date.now(); G.st='idle'; fillBounties(); toast('Progress erased. A backup was kept. You can restore it in Settings.'); return 'render'; }
    case 'restorebk': { try{ const raw=localStorage.getItem(BACKUP_KEY); if(!raw) return 'skip'; S=migrate(JSON.parse(raw)); S.savedAt=Date.now(); localStorage.removeItem(BACKUP_KEY); G.st='idle'; toast('Backup restored. Welcome back!'); }catch(e){ toast('That backup couldn’t be read.'); } return 'render'; }
    case 'duckagain': { const c=bestLoot(); if(S.money<c) return 'skip'; S.money-=c; newDuck(); taskProgress('game',1); return 'render'; }
    case 'duckpick': { if(!duck||duck.pick>=0) return 'skip'; duck.pick=i; const p=duck.prizes[i]; if(p.k==='crate'){ S.tokens.small++; duck.msg='A small Mystery Crate! Quack.'; sfx.shiny(); } else if(p.k==='coins'){ duck.msg='+'+fmt(earn(bestLoot()*p.m*coinMult()))+' coins. Quack quack.'; sfx.coin(); } else { duck.msg='+'+addTickets(p.n)+' tickets. Quack.'; tone(1200,.08,'triangle',.05); } return 'render'; }
    case 'hilostart': { const c=bestLoot()*2; if(S.money<c) return 'skip'; S.money-=c; newHilo(); taskProgress('game',1); return 'render'; }
    case 'hilo': { if(!hilo||hilo.done) return 'skip'; let n; do{ n=rint(1,13); }while(n===hilo.card); const ok=(k==='hi')===(n>hilo.card); const prev=hilo.card; hilo.card=n;
      if(ok){ hilo.streak++; hilo.pot=Math.round(hilo.pot*1.5); addTickets(3); tone(900+hilo.streak*100,.1,'triangle',.06); if(hilo.streak>=8){ earn(hilo.pot); hilo.done=true; hilo.msg='Eight in a row! The pot pays out: +'+fmt(hilo.pot)+' coins.'; sfx.catch(4); } }
      else { hilo.done=true; hilo.msg=prev+' → '+n+'. Wrong way! The pot sinks to the bottom of the sea.'; addTickets(2); sfx.lost(); } return 'render'; }
    case 'hilocash': { if(!hilo||hilo.done||!hilo.streak) return 'skip'; earn(hilo.pot); hilo.done=true; hilo.msg='Cashed out: +'+fmt(hilo.pot)+' coins after '+hilo.streak+' right guesses.'; sfx.coin(); return 'render'; }
    case 'prize': { const p=PRIZES.find(x=>x[0]===k); if(!p||S.tickets<p[2]||(p[4]&&p[4]())) return 'skip'; S.tickets-=p[2]; const got=p[3](); PREVIEW=null; PET_PV=null; AQ_PV=null;
      if(k==='golden'||k==='rainbow') petLook().tint=k; if(k==='balloon'||k==='partyhat') petLook().acc=k; if(['sixsevencap','carnival','fishbowl'].includes(k)) S.look.hat=k; if(k==='spacesuit') S.look.outfit='spacesuit'; sfx.shiny(); toast('Prize counter: you got '+got+'!'); return 'render'; }
  }
  return undefined; }
