
// ---------- state ----------
const LS_KEY = 'driftline-save-v1';
const baitZero = () => Object.fromEntries(Object.keys(BAIT).filter(k=>k!=='worm').map(k=>[k,0]));
const fresh = () => ({v:3, money:0, xp:0, lvl:1, gear:{rod:0,reel:0,line:0,hook:0,cooler:0,finder:0}, bait:baitZero(), baitSel:'worm',
  unlocked:['pond'], loc:'pond', cooler:[], journal:{}, bounties:[], setDone:{},
  perks:{}, bonusPts:0, tank:[], tankSlots:3, tankT:0, tankBank:0, feats:{}, pearls:0, tides:0, streak:0,
  buffs:[], look:{g:'m',skin:1,hair:1,shirt:'#3a6f9a',pat:'none',pants:'#2f3b4a',hat:'cap',hatCol:'#c8553a'},
  owned:{hats:['none','cap','bucket'],cols:[],pats:['none'],pets:['dog']}, pet:'dog', junk:{},
  settings:{master:.8, music:.55, sfx:.7, amb:.5, musicOn:true, ambient:true, style:'auto', effects:true, boostsOnScreen:true, hints:true, protectRare:true},
  aq:{theme:'lagoon', sand:'gold', decor:[], owned:['lagoon','gold']}, fedT:0, wheelT:0, rankClaimed:0, tokens:{small:0,big:0,legend:0},
  gstats:{frenzy:0, frenzyFish:0, chests:0, stars:0, spins:0, crates:0, flips:0, flipWins:0, scratch:0, scratchWins:0},
  stats:{caught:0,earned:0,runEarned:0,snapped:0,shiny:0,treasure:0,stormEpic:0,trophies:0,bestStreak:0,perfect:0,demand:0,hot:0,bought:0,maxBuffs:0},
  muted:true, tab:'cooler', savedAt:0});
let S = fresh();
const uniq = a => [...new Set(a)];
function migrate(o){ const d=fresh(); if(!o||typeof o!=='object') return d; const m=Object.assign(d,o);
  m.gear=Object.assign(fresh().gear,o.gear||{}); for(const k in GEAR) m.gear[k]=clamp(m.gear[k]|0,0,GEAR[k].lv.length-1);
  m.bait=Object.assign(baitZero(),o.bait||{}); if(!BAIT[m.baitSel]) m.baitSel='worm';
  m.stats=Object.assign(fresh().stats,o.stats||{}); m.perks=Object.assign({},o.perks||{}); for(const k in m.perks){ if(!PERKS[k]) delete m.perks[k]; else m.perks[k]=Math.min(m.perks[k],PERKS[k].max); }
  m.feats=Object.assign({},o.feats||{}); m.tank=(m.tank||[]).filter(f=>SPI[f.id]); m.cooler=(m.cooler||[]).filter(f=>SPI[f.id]);
  m.unlocked=(m.unlocked||['pond']).filter(id=>LOCS.some(l=>l.id===id)); if(!m.unlocked.includes('pond')) m.unlocked.unshift('pond'); if(!m.unlocked.includes(m.loc)) m.loc='pond';
  for(const k in m.journal){ if(!SPI[k]) delete m.journal[k]; }
  m.look=Object.assign(fresh().look,o.look||{}); const ow=o.owned||{};
  m.owned={hats:uniq([...d.owned.hats,...(ow.hats||[])]).filter(h=>HATI[h]), cols:uniq(ow.cols||[]), pats:uniq(['none',...(ow.pats||[])]), pets:uniq(['dog',...(ow.pets||[])]).filter(p=>PETI[p])};
  if(!m.owned.hats.includes(m.look.hat)) m.look.hat='cap'; if(!PETI[m.pet]||!m.owned.pets.includes(m.pet)) m.pet='dog';
  m.buffs=(o.buffs||[]).filter(b=>b&&BK[b.k]&&b.until>Date.now()); m.junk=Object.assign({},o.junk||{});
  m.settings=Object.assign(fresh().settings,o.settings||{}); const aq=Object.assign(fresh().aq,o.aq||{}); aq.owned=uniq(['lagoon','gold',...(aq.owned||[])]); aq.decor=(aq.decor||[]).filter(x=>aq.owned.includes(x)); m.aq=aq;
  m.tokens=Object.assign(fresh().tokens,o.tokens||{}); m.gstats=Object.assign(fresh().gstats,o.gstats||{}); delete m.muted;
  m.bounties=(m.bounties||[]).filter(b=>SPI[b.sp]); if(m.tankSlots>TANK_COST.length) m.tankSlots=TANK_COST.length; m.v=3; return m; }
try { const raw = localStorage.getItem(LS_KEY); if (raw) S = migrate(JSON.parse(raw)); } catch(e) {}

let cloudDoc = null, saveTimer = null, saving = false, pendingSave = false;
function save(){ S.savedAt = Date.now(); try{ localStorage.setItem(LS_KEY, JSON.stringify(S)); }catch(e){}
  if (cloudDoc){ clearTimeout(saveTimer); saveTimer = setTimeout(pushCloud, 2500); } }
async function pushCloud(){ if(!cloudDoc) return; if(saving){ pendingSave=true; return; } saving=true;
  try{ await cloudDoc.set({state: JSON.parse(JSON.stringify(S))}); }catch(e){ if(e && (e.code==='invalid_argument'||e.code==='revoked'||e.code==='not_granted')) cloudDoc=null; }
  saving=false; if(pendingSave){ pendingSave=false; pushCloud(); } }
async function initCloud(){
  try{
    if(!window.claude || !window.claude.use) return;
    const [user, db] = await Promise.all([window.claude.use('user'), window.claude.use('db')]);
    if(!user || !db) return; const id = await user.id(); if(!id) return;
    const doc = db.doc('data/users/'+id+'/save');
    const snap = await doc.get(); cloudDoc = doc;
    if(snap.exists){ const st = snap.data() && snap.data().state; if(st && (st.savedAt||0) > (S.savedAt||0) && G.st==='idle'){ S = migrate(JSON.parse(JSON.stringify(st))); offlineIncome(); try{localStorage.setItem(LS_KEY,JSON.stringify(S));}catch(e){} refreshAll(); toast('Progress loaded from your account'); } }
    else if(S.savedAt) pushCloud();
  }catch(e){ cloudDoc=null; }
}

// ---------- helpers ----------
const $ = id => document.getElementById(id);
const fmt = n => Math.floor(n).toLocaleString('en-US');
const rnd = (a,b) => a + Math.random()*(b-a);
const pick = a => a[Math.floor(Math.random()*a.length)];
function clamp(v,a,b){ return Math.max(a,Math.min(b,v)); }
const gv = k => GEAR[k].lv[S.gear[k]];
const pr = k => S.perks[k]||0;
const locIdx = id => LOCS.findIndex(l=>l.id===id);
const curLoc = () => LOCS[locIdx(S.loc)];
const kgStr = kg => kg < 10 ? kg.toFixed(2)+' kg' : kg < 100 ? kg.toFixed(1)+' kg' : fmt(kg)+' kg';
const xpNeed = l => Math.round(80*Math.pow(1.38,l-1));
const coinMult = () => 1 + .1*S.pearls;
const hashStr = s => { let h=2166136261; for(let i=0;i<s.length;i++){ h^=s.charCodeAt(i); h=Math.imul(h,16777619); } return h>>>0; };
// boosts (timed), aquarium fish and the pet all feed the same bonus keys
function buffSum(k){ const t=Date.now(); let s=0; for(const b of S.buffs) if(b.k===k && b.until>t) s+=b.v; return s; }
const aqCache = {};
function aqBase(id){ if(!(id in aqCache)){ const sp=SPI[id]; aqCache[id] = sp.r ? {k:AQ_KEYS[hashStr(id)%AQ_KEYS.length], v:AQ_MAG[sp.r]} : null; } return aqCache[id]; }
function aqEff(f){ const b=aqBase(f.id); return b ? {k:b.k, v:b.v*(f.sh?2:1)*(f.tr?1.25:1)} : null; }
function aqSum(k){ let s=0; for(const f of S.tank){ const e=aqEff(f); if(e && e.k===k) s+=e.v; } return s; }
const petVal = () => { const p=PETI[S.pet]; return p ? p.v*(1+.1*pr('petpal')) : 0; };
function petSum(k){ const p=PETI[S.pet]; return p && p.k===k ? petVal() : 0; }
function bonus(k){ const v=buffSum(k)+aqSum(k)+petSum(k); return BONUS_CAP[k] ? Math.min(BONUS_CAP[k],v) : v; }
const sellMult = () => (1 + .03*(S.lvl-1) + .04*pr('haggler') + bonus('sell') + .01*anglerRank()) * coinMult();
const xpMult = () => (1 + bonus('xp')) * coinMult();
function earn(n){ n=Math.floor(n); S.money+=n; S.stats.earned+=n; S.stats.runEarned+=n; return n; }
const pearlsFor = () => Math.floor(Math.sqrt(S.stats.runEarned/40000));
function demandSp(){ const pool=SP.filter(s=>S.unlocked.includes(s.loc)&&s.r<=3); const slot=Math.floor(Date.now()/1000/WX_LEN); return pool[(Math.imul(slot+17,40503)>>>0)%pool.length]; }
const salePrice = f => Math.round(f.value*sellMult()*(demandSp().id===f.id?2:1));
const hookWin = () => gv('hook') + .05*pr('reflex');
const reelSpeed = () => gv('reel') * (1 + .04*pr('strong')) * (1 + bonus('reel'));
const tensionMult = () => (1 - .04*pr('steady')) * (1 - bonus('tension'));
const tempMult = () => Math.max(.25, (1 - .06*pr('softtouch')) * (1 - bonus('calm')));
const farAt = () => .8 - .02*pr('caster');
const hotRate = () => 1 + .1*pr('reader') + .2*S.gear.finder + bonus('hot');
const streakCap = () => .5 + .1*pr('streaker');
const ptsTotal = () => (S.lvl-1) + S.bonusPts;
const ptsSpent = () => Object.values(S.perks).reduce((a,b)=>a+b,0);
const ptsFree = () => ptsTotal() - ptsSpent();
const activeBuffs = () => { const t=Date.now(); return S.buffs.filter(b=>b.until>t); };
function addBuff(k,v,min,src){ const t=Date.now(); S.buffs=S.buffs.filter(b=>b.until>t); const ex=S.buffs.find(b=>b.src===src);
  if(ex){ ex.until=Math.max(ex.until,t)+min*60000; ex.v=Math.max(ex.v,v); } else S.buffs.push({k,v,until:t+min*60000,src});
  S.stats.maxBuffs=Math.max(S.stats.maxBuffs,activeBuffs().length); }
function hex2rgb(h){ const n=parseInt(h.slice(1),16); return [n>>16&255,n>>8&255,n&255]; }
function mix(a,b,t){ const A=hex2rgb(rgb2hex(a)),B=hex2rgb(rgb2hex(b)); return '#'+A.map((v,i)=>Math.round(v+(B[i]-v)*t).toString(16).padStart(2,'0')).join(''); }
function rgb2hex(s){ if(s[0]==='#') return s; const m=s.match(/\d+/g); return '#'+m.slice(0,3).map(v=>(+v).toString(16).padStart(2,'0')).join(''); }
const lum = h => { const [r,g2,b]=hex2rgb(h); return .3*r+.59*g2+.11*b; };
function caughtAt(loc){ return SP.filter(s=>s.loc===loc && S.journal[s.id]).length; }
const spAt = loc => SP.filter(s=>s.loc===loc);

const CYCLE = 360;
function phase(){ return (Date.now()/1000 % CYCLE)/CYCLE; }
function tod(p=phase()){ if(p<.05||p>=.95) return 'Dawn'; if(p<.45) return 'Day'; if(p<.55) return 'Dusk'; return 'Night'; }
function isNight(p=phase()){ const t=tod(p); return t==='Night'||t==='Dusk'; }
function timeOk(sp,p){ if(sp.time==='any') return true; if(sp.time==='night') return isNight(p) || !!weather().fog; return !isNight(p) || tod(p)==='Dusk'; }
function nextFlip(){ const p=phase(); const target = isNight(p) ? .95 : .45; let d = target - p; if(d<0) d+=1; return {label: isNight(p)?'Day in':'Dusk in', s: Math.round(d*CYCLE)}; }
function weatherAt(slot){ const h = (Math.imul(slot ^ 0x9e3779b9, 2654435761) >>> 0) % 10000 / 100; let x=h; for(const w of WEATHERS){ x-=w.w; if(x<0) return w; } return WEATHERS[0]; }
function weather(){ return weatherAt(Math.floor(Date.now()/1000/WX_LEN)); }
function wxLeft(){ return Math.ceil(WX_LEN - (Date.now()/1000 % WX_LEN)); }
const mmss = s => Math.floor(s/60)+':'+String(Math.max(0,s)%60).padStart(2,'0');

// ---------- audio ----------
let AC=null, BUS=null;
function ac(){ if(!AC){ try{ AC = new (window.AudioContext||window.webkitAudioContext)();
    BUS={master:AC.createGain(), sfx:AC.createGain(), music:AC.createGain(), amb:AC.createGain()}; BUS.master.connect(AC.destination); BUS.sfx.connect(BUS.master); BUS.music.connect(BUS.master); BUS.amb.connect(BUS.master); applyVolumes();
  }catch(e){ return null; } } if(AC.state==='suspended') AC.resume(); return AC; }
function applyVolumes(){ if(!BUS) return; const s=S.settings, t=AC.currentTime; const set=(gn,v)=>{ gn.gain.cancelScheduledValues(t); gn.gain.setTargetAtTime(v,t,.08); };
  set(BUS.master,s.master); set(BUS.sfx,s.sfx); set(BUS.music,s.musicOn?s.music*.7:0); set(BUS.amb,s.ambient?s.amb*.6:0); }
function tone(f,dur,type='sine',vol=.12,slide=0,delay=0){ if(!S.settings.sfx||!S.settings.master) return; const a=ac(); if(!a) return; const t=a.currentTime+delay; const o=a.createOscillator(), g=a.createGain(); o.type=type; o.frequency.setValueAtTime(f,t); if(slide) o.frequency.exponentialRampToValueAtTime(Math.max(30,f+slide),t+dur); g.gain.setValueAtTime(vol,t); g.gain.exponentialRampToValueAtTime(.0001,t+dur); o.connect(g).connect(BUS.sfx); o.start(t); o.stop(t+dur+.02); }
function noise(dur,vol=.2,freq=900){ if(!S.settings.sfx||!S.settings.master) return; const a=ac(); if(!a) return; const n=a.sampleRate*dur, b=a.createBuffer(1,n,a.sampleRate), d=b.getChannelData(0); for(let i=0;i<n;i++) d[i]=(Math.random()*2-1)*(1-i/n); const s=a.createBufferSource(); s.buffer=b; const f=a.createBiquadFilter(); f.type='bandpass'; f.frequency.value=freq; const g=a.createGain(); g.gain.value=vol; s.connect(f).connect(g).connect(BUS.sfx); s.start(); }
const sfx = {
  cast(){ tone(500,.25,'triangle',.05,600); },
  splash(){ noise(.35,.25,700); },
  nibble(){ tone(320,.06,'sine',.05); },
  bite(){ noise(.25,.3,500); tone(880,.08,'square',.06); tone(1180,.1,'square',.06,0,.09); },
  tick(){ tone(1400+Math.random()*200,.02,'square',.015); },
  snap(){ tone(220,.35,'sawtooth',.12,-160); noise(.15,.2,2400); },
  lost(){ tone(400,.3,'triangle',.08,-200); },
  catch(r){ const base=[523,659,784,988,1175]; for(let i=0;i<=2+r;i++) tone(base[i%5],.22,'triangle',.08,0,i*.08); },
  shiny(){ for(let i=0;i<6;i++) tone(1568+i*220,.18,'sine',.06,0,.4+i*.06); },
  coin(){ tone(1320,.08,'square',.05); tone(1760,.12,'square',.05,0,.07); },
  thunder(){ noise(1.2,.25,120); },
  jump(){ noise(.3,.3,1200); tone(300,.15,'triangle',.05,300); },
  warn(){ tone(180,.08,'square',.05); },
  hot(){ tone(1046,.12,'sine',.06); tone(1318,.16,'sine',.06,0,.1); },
  pull(){ noise(.4,.3,900); tone(700,.3,'triangle',.06,500); },
};

// ---------- canvas ----------
const cv=$('cv'), g=cv.getContext('2d'); let W=800,H=400,DPR=1;
function resize(){ const r=cv.parentElement.getBoundingClientRect(); W=Math.max(280,r.width); const portrait=window.innerHeight>window.innerWidth*1.15; H=clamp(Math.round(W*(portrait?.82:.5)),250,portrait?Math.round(window.innerHeight*.56):520); DPR=Math.min(2,window.devicePixelRatio||1); cv.width=W*DPR; cv.height=H*DPR; cv.style.height=H+'px'; g.setTransform(DPR,0,0,DPR,0,0); }
new ResizeObserver(resize).observe(cv.parentElement); resize();
const HZ = () => H*.42;
const TIP = () => ({x:W*.215, y:H*.27});
function waterY(x){ const t=clamp((x-W*.22)/(W*.74),0,1); return H*.86 + (H*.49 - H*.86)*t; }
function castX(p){ return W*.27 + p*W*.66; }

// ---------- game state (not saved) ----------
const G = {st:'idle', power:0, pdir:1, t:0, bob:{x:0,y:0}, from:null, to:null, waitT:0, biteAt:0, biteEnd:0, nib:[], nibOn:0,
  fish:null, pend:null, d:0, d0:0, maxOut:0, ten:0, sta:1, temper:0, run:false, runT:0, ev:null, evT:2, evDur:0, hold:false, tickT:0, warnT:0,
  parts:[], lastCast:.5, flash:0, nextBolt:5, hot:null, hotNext:8, inHot:false, land:null, perfect:false};

function startCharge(){ if(S.cooler.length >= gv('cooler')){ toast('Your cooler is full. Sell your catch or move fish to the aquarium.'); setTab('cooler'); return; }
  if(S.baitSel!=='worm' && S.bait[S.baitSel]<=0){ S.baitSel='worm'; renderBait(); }
  G.st='charging'; G.power=0; G.pdir=1; ac(); }
function release(){ if(G.st!=='charging') return; G.st='flying'; G.t=0; G.lastCast=G.power; const tip=TIP(); G.from={x:tip.x,y:tip.y}; const x=castX(G.power); G.to={x, y:waterY(x)};
  G.inHot = !!(G.hot && Math.abs(G.power-G.hot.p) <= G.hot.r); if(G.inHot) G.hot=null; sfx.cast(); }
function beginWait(){ G.st='waiting'; G.waitT=0; const b=BAIT[S.baitSel]; const wx=weather();
  const speed=b.speed*(1+.01*(S.lvl-1))*(1+.05*pr('patience'))*(wx.bite||1)*(1+bonus('bite'))*(G.inHot?1.3:1);
  G.biteAt = rnd(1.4,4.6)/speed; G.nib=[]; const n=Math.floor(Math.random()*3); for(let i=0;i<n;i++) G.nib.push(rnd(.5,Math.max(.6,G.biteAt-.4))); G.nibOn=0;
  splash(G.bob.x,G.bob.y,10); sfx.splash(); if(G.inHot){ splash(G.bob.x,G.bob.y,14); sfx.hot(); toast('Right in the hotspot! Rare fish are gathering.'); } }
const junkChance = () => .05*(1+.1*pr('scavenger'))*(1+bonus('treasure'))*(BAIT[S.baitSel].treasure||1)*(G.inHot?1.5:1);
function pickJunk(){ const ws=JUNK.map(j=>JUNK_W[j.t]); let x=Math.random()*ws.reduce((a,b)=>a+b,0); for(let i=0;i<JUNK.length;i++){ x-=ws[i]; if(x<=0) return JUNK[i]; } return JUNK[0]; }
const fishHatsLeft = () => HATS.filter(h=>h.src==='fish' && !S.owned.hats.includes(h.id));
function chooseCatch(){
  const p=phase(), b=BAIT[S.baitSel], wx=weather(), li=locIdx(S.loc); const weak={str:1.5+li*2.2, th:.15, beh:'calm', aggr:.15, kg:1};
  if(Math.random() < .007*(G.inHot?2.5:1)*(1+bonus('treasure')*.5) && fishHatsLeft().length) return Object.assign({kind:'hat', hat:pick(fishHatsLeft())}, weak);
  if(Math.random() < junkChance()) return Object.assign({kind:'junk', item:pickJunk()}, weak);
  let rare = b.rare + ROD_RARE[S.gear.rod] + (G.lastCast>farAt() ? .2+.03*pr('caster') : 0) + .06*pr('lucky') + (wx.rare||0) + bonus('rare')*2 + (isNight(p)?.1*pr('nightowl'):0) + (G.inHot?1:0);
  if(S.baitSel==='glow' && isNight(p)) rare*=1.5; if(b.loc===S.loc) rare*=1.6; if(b.sea && SEA.includes(S.loc)) rare*=1.5;
  const pool=SP.filter(s=>s.loc===S.loc && timeOk(s,p)); const ws=pool.map(s=>RAR[s.r].w*(1+rare*RAR[s.r].f));
  let x=Math.random()*ws.reduce((a,c)=>a+c,0), sp=pool[0]; for(let i=0;i<pool.length;i++){ x-=ws[i]; if(x<=0){ sp=pool[i]; break; } }
  const tb = 1 + bonus('trophy') + .06*pr('trophy') + (b.trophy||0);
  const kg = sp.min + (sp.max-sp.min)*Math.pow(Math.random(),1.8/tb);
  const rel=(kg-sp.min)/(sp.max-sp.min); const str=sp.str*(.8+.4*rel)*(wx.str||1);
  const shiny = Math.random() < (.02 + .003*pr('lucky')) * (wx.shiny||1) * (b.shiny||1) * (1+bonus('shiny')) * (G.inHot?2:1);
  const trophy = rel > .9;
  let value = Math.max(1,Math.round(sp.base*Math.pow(kg/((sp.min+sp.max)/2),.85)));
  value=Math.round(value*(1+.1*mastery(sp.id))); if(trophy) value=Math.round(value*1.5); if(shiny) value*=4;
  return {kind:'fish', sp, kg, rel, str, th:sp.th, beh:sp.beh, aggr:sp.aggr, value, shiny, trophy, storm: wx.k==='Storm', hot:G.inHot};
}
function hookIt(){ const perfect = (G.waitT - (G.biteEnd - hookWin())) < .3*hookWin(); G.fish = G.pend || chooseCatch(); G.pend=null; G.perfect = perfect;
  if(S.baitSel!=='worm'){ S.bait[S.baitSel]=Math.max(0,S.bait[S.baitSel]-1); if(S.bait[S.baitSel]===0) toast(BAIT[S.baitSel].name+' used up. Back to worms.'); renderBait(); save(); }
  G.st='reeling'; G.d0=G.d= 6 + G.lastCast*gv('rod')*.6; G.maxOut = gv('rod') + 28; G.ten=10; G.sta=1; G.temper=0; G.run=false; G.runT=rnd(.5,1.1); G.ev=null; G.evT=rnd(1,2.2); G.hold=false; tone(660,.08,'square',.05);
  if(perfect){ G.sta=.65; G.ten=0; G.runT=rnd(1,1.6); S.stats.perfect++; toast('Perfect hook! The fish starts tired.'); tone(990,.1,'triangle',.07,0,.05); } }
function breakStreak(){ if(S.streak>=3) setTimeout(()=>toast('Streak of '+S.streak+' ended'),1200); S.streak=0; }
function endFight(kind){
  if(kind==='caught'){ G.st='landing'; G.land={t:0, dur:.85, x0:G.bob.x, y0:G.bob.y}; splash(G.bob.x,G.bob.y,24); sfx.pull(); return; }
  G.st='idle'; G.fish=null; G.inHot=false; breakStreak();
  if(kind==='snap'){ S.stats.snapped++; sfx.snap(); toast(G.temper>1.6 ? 'Snap! It lost its temper. Let go now and then.' : 'Snap! The line broke. Ease off when it runs.'); checkFeats(); save(); }
  else { sfx.lost(); toast(kind==='spool' ? 'It ran out all your line and got away.' : 'It slipped off the hook.'); }
}
function finishCatch(){ const f=G.fish; G.land=null; if(!f){ G.st='idle'; return; }
  if(f.hot) S.stats.hot++; G.inHot=false;
  if(f.kind==='fish') landFish(); else if(f.kind==='hat') landHat(); else landJunk(); }
function landFish(){
  const f=G.fish, sp=f.sp; G.st='result'; G.fish=null;
  const j=S.journal[sp.id]; const isNew=!j; const record = j && f.kg > j.best;
  S.journal[sp.id] = {n:(j?j.n:0)+1, best:Math.max(j?j.best:0, +f.kg.toFixed(3)), sh:(j&&j.sh)||f.shiny, tr:(j&&j.tr)||f.trophy, bv:Math.max((j&&j.bv)||0, f.value), first:(j&&j.first)||Date.now()};
  S.streak++; S.stats.bestStreak=Math.max(S.stats.bestStreak,S.streak); const streakBonus = Math.min(streakCap(),.05*(S.streak-1));
  const xp = Math.round((5+Math.sqrt(f.value/(f.shiny?4:1))*3)*RAR[sp.r].xp*(f.shiny?2:1)*(1+streakBonus)*xpMult());
  f.demand = demandSp().id===sp.id; if(f.demand) S.stats.demand++; f.streakBonus=streakBonus;
  S.cooler.push({id:sp.id, kg:+f.kg.toFixed(3), value:f.value, sh:f.shiny?1:0, tr:f.trophy?1:0}); S.stats.caught++;
  if(f.shiny) S.stats.shiny++; if(f.trophy) S.stats.trophies++; if(f.storm && sp.r>=3) S.stats.stormEpic++;
  const lvUps = addXP(xp); const bdone = checkBounties(sp, f.kg); const setNow = checkSet(sp.loc);
  const b=[]; if(f.shiny) b.push(['g','Shiny ×4 value']); if(f.trophy) b.push(['g','Trophy size ×1.5']); if(f.hot) b.push(['k','Hotspot catch']);
  if(f.demand) b.push(['g','Fishmonger wants it: ×2 if sold now']); if(G.perfect) b.push(['','Perfect hook']); if(S.streak>=2) b.push(['','Streak '+S.streak+' · +'+Math.round(streakBonus*100)+'% XP']);
  if(isNew) b.push(['','New species']); if(record) b.push(['g','Personal record']); const ae=aqBase(sp.id); if(ae && isNew) b.push(['k','In the aquarium: '+fmtB(ae.k,ae.v)]);
  const ms=mastery(sp.id); if(ms && [3,10,30,100][ms-1]===S.journal[sp.id].n) b.push(['g','Mastery '+'★'.repeat(ms)+': +'+ms*10+'% value for this fish']);
  const rk=checkRank(); if(rk) b.push(['g',rk]);
  if(lvUps) b.push(['g','Level up! Lv '+S.lvl+' · +'+lvUps+' skill point']); bdone.forEach(()=>b.push(['g','Bounty ready'])); if(setNow) b.push(['g',LOCS[locIdx(sp.loc)].name+' complete: +'+fmt(setNow)]);
  showCard({draw:c=>fishCanvas(c,sp,true,f.shiny), shiny:f.shiny, rar:(f.shiny?'Shiny ':'')+RAR[sp.r].k, rarCol:f.shiny?'var(--gold)':RAR[sp.r].c, name:sp.name,
    nums:[['Weight',kgStr(f.kg)],['Worth',fmt(f.value),1],['XP','+'+xp]], desc:sp.note, badges:b});
  f.shiny ? (sfx.catch(sp.r), sfx.shiny()) : sfx.catch(sp.r); checkFeats(); save(); refreshAll();
}
function landJunk(){
  const J=G.fish.item; G.st='result'; G.fish=null; const L=curLoc(), e=J.e, li=locIdx(S.loc); const base=L.loot*rnd(.8,1.2); const b=[]; let coins=0, quote=J.q, found='—';
  const isNew=!S.junk[J.id]; S.junk[J.id]=(S.junk[J.id]||0)+1; S.stats.treasure++;
  if(e.c) coins += base*e.c;
  if(e.buff){ const [k,v,m]=e.buff; addBuff(k,v,m,J.name); b.push(['k','Boost: '+fmtB(k,v)+' for '+m+' min']); }
  if(e.lure){ const [k,n]=e.lure; S.bait[k]=(S.bait[k]||0)+n; found=n+' '+BAIT[k].name; b.push(['k','+'+n+' '+BAIT[k].name]); }
  if(e.pet){ if(!S.owned.pets.includes(e.pet)){ S.owned.pets.push(e.pet); found='A '+PETI[e.pet].name.toLowerCase(); b.push(['g','New pet: '+PETI[e.pet].name+'! See the Pets tab']); } else coins += base; }
  if(e.hat){ let h=e.hat; if(h==='random'){ const left=HATS.filter(x=>x.src!=='junk'&&x.src!=='start'&&!S.owned.hats.includes(x.id)); h=left.length?pick(left).id:null; }
    if(h && !S.owned.hats.includes(h)){ S.owned.hats.push(h); found=HATI[h].name; b.push(['g','New hat: '+HATI[h].name+'! See the Wardrobe']); } else coins += base; }
  if(e.special==='lottery'){ const r=Math.random(); if(r<.05){ coins=base*30; quote='WE HAVE A WINNER! All six numbers! I need to sit down.'; b.push(['g','Jackpot ×30']); } else if(r<.3){ coins=base*3; quote='A small winner. Better than a boot!'; } else { coins=0; quote='Not a winner. Not even close. Keep it as a souvenir.'; } }
  if(e.special==='fortune'){ const fo=pick(FORTUNES); quote='The paper says: "'+fo[0]+'"'; addBuff(fo[1],fo[2],5,'Fortune: '+BK[fo[1]]); b.push(['k','Boost: '+fmtB(fo[1],fo[2])+' for 5 min']); }
  if(e.special==='chest'){ coins=base*3; const bk = li<=1?'cricket':li<=3?'glow':'chum'; const n=bk==='chum'?3:5; S.bait[bk]+=n; found=n+' '+BAIT[bk].name; b.push(['k','+'+n+' '+BAIT[bk].name]); }
  coins = coins>0 ? earn(coins*coinMult()) : 0; if(coins) b.unshift(['g','+'+fmt(coins)+' coins']); if(isNew) b.push(['','New oddity']);
  S.streak++; S.stats.bestStreak=Math.max(S.stats.bestStreak,S.streak); const xp=Math.round((12+li*10)*xpMult()); const lv=addXP(xp); if(lv) b.push(['g','Level up! Lv '+S.lvl]);
  showCard({draw:c=>{ const cx=c.getContext('2d'); cx.clearRect(0,0,c.width,c.height); drawJunk(cx,c.width,c.height,J.id); }, shiny:J.t>=3, rar:['Junk','Odd junk','Rare find','Treasure'][J.t], rarCol:J.t>=2?'var(--gold)':'var(--muted)', name:J.name,
    nums:[['Found',found],['Worth',fmt(coins),1],['XP','+'+xp]], desc:quote?'<span class="quote">Fishmonger: '+esc(quote)+'</span>':'', badges:b, html:true});
  sfx.coin(); sfx.catch(J.t); renderBait(); checkFeats(); save(); refreshAll();
}
function landHat(){
  const h=G.fish.hat; G.st='result'; G.fish=null; if(!S.owned.hats.includes(h.id)) S.owned.hats.push(h.id); const li=locIdx(S.loc);
  S.streak++; const xp=Math.round((20+li*10)*xpMult()); const lv=addXP(xp); const b=[['g','New hat for your Wardrobe']]; if(lv) b.push(['g','Level up! Lv '+S.lvl]);
  showCard({draw:c=>{ const cx=c.getContext('2d'); cx.clearRect(0,0,c.width,c.height); hatPreview(cx,c.width,c.height,h.id,S.look.hatCol,true); }, shiny:true, rar:'Fished-up hat', rarCol:'var(--gold)', name:h.name,
    nums:[['Found','A hat!'],['Owned',S.owned.hats.length-1+' hats'],['XP','+'+xp]], desc:'Soggy, but it dries fast. Put it on in the Wardrobe tab.', badges:b});
  sfx.shiny(); sfx.catch(3); checkFeats(); save(); refreshAll();
}
function addXP(x){ S.xp+=x; let ups=0; while(S.xp>=xpNeed(S.lvl)){ S.xp-=xpNeed(S.lvl); S.lvl++; ups++; } return ups; }
function checkSet(loc){ if(S.setDone[loc]) return 0; if(spAt(loc).every(s=>S.journal[s.id])){ S.setDone[loc]=true; return earn(LOCS[locIdx(loc)].bonus*coinMult()); } return 0; }
function splash(x,y,n){ for(let i=0;i<n;i++) G.parts.push({x,y,vx:rnd(-60,60),vy:rnd(-160,-60),life:rnd(.4,.8),t:0}); }
const esc = s => String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));

// ---------- feats ----------
const nLeg = () => Object.keys(S.journal).filter(k=>SPI[k].r===4).length;
const nJunkKinds = () => Object.keys(S.junk).filter(k=>JUNKI[k]).length;
const FEATS = [
  {id:'c10',   name:'Getting the hang of it', d:'Land 10 fish',              p:()=>[S.stats.caught,10],   coins:100},
  {id:'c100',  name:'Regular at the dock',    d:'Land 100 fish',             p:()=>[S.stats.caught,100],  coins:1500, pt:1},
  {id:'c500',  name:'Old salt',               d:'Land 500 fish',             p:()=>[S.stats.caught,500],  coins:20000, pt:1},
  {id:'c2000', name:'Living legend',          d:'Land 2,000 fish',           p:()=>[S.stats.caught,2000], coins:250000, pt:2},
  {id:'c5000', name:'Fish whisperer',         d:'Land 5,000 fish',           p:()=>[S.stats.caught,5000], coins:1000000, pt:3},
  {id:'sp10',  name:'Naturalist',             d:'Find 10 species',           p:()=>[Object.keys(S.journal).length,10], coins:500},
  {id:'sp20',  name:'Field guide',            d:'Find 20 species',           p:()=>[Object.keys(S.journal).length,20], coins:3000, pt:1},
  {id:'sp50',  name:'Marine biologist',       d:'Find 50 species',           p:()=>[Object.keys(S.journal).length,50], coins:25000, pt:1},
  {id:'sp100', name:'Walking encyclopedia',   d:'Find 100 species',          p:()=>[Object.keys(S.journal).length,100], coins:150000, pt:2},
  {id:'sp160', name:'Professor of fish',      d:'Find 160 species',          p:()=>[Object.keys(S.journal).length,160], coins:600000, pt:2},
  {id:'spall', name:'Complete encyclopedia',  d:'Find all '+SP.length+' species', p:()=>[Object.keys(S.journal).length,SP.length], coins:3000000, pt:5},
  {id:'leg',   name:'Myth made real',         d:'Land a Legendary fish',     p:()=>[nLeg(),1], coins:2000, pt:1},
  {id:'leg5',  name:'Legend hunter',          d:'Land 5 different Legendaries', p:()=>[nLeg(),5], coins:60000, pt:2},
  {id:'leg12', name:'Mythologist',            d:'Land 12 different Legendaries', p:()=>[nLeg(),12], coins:500000, pt:3},
  {id:'legall',name:'Keeper of legends',      d:'Land all 24 Legendaries',   p:()=>[nLeg(),24], coins:2500000, pt:5},
  ...LOCS.map(L=>({id:'set_'+L.id, name:'Master of '+L.name, d:'Find every fish in '+L.name, p:()=>[caughtAt(L.id),spAt(L.id).length], coins:Math.round(L.bonus*.5), pt:1, pet:L.id==='frost'?'penguin':null})),
  {id:'shiny', name:'Something glittered',    d:'Land a shiny fish',         p:()=>[S.stats.shiny,1],     coins:1000, pt:1},
  {id:'shiny10',name:'Shine collector',       d:'Land 10 shiny fish',        p:()=>[S.stats.shiny,10],    coins:25000, pt:1},
  {id:'shiny50',name:'Dragon’s hoard',        d:'Land 50 shiny fish',        p:()=>[S.stats.shiny,50],    coins:250000, pt:2},
  {id:'trophy',name:'Wall mount',             d:'Land 5 trophy-size fish',   p:()=>[S.stats.trophies,5],  coins:1200},
  {id:'trophy50',name:'Trophy room',          d:'Land 50 trophy-size fish',  p:()=>[S.stats.trophies,50], coins:40000, pt:1},
  {id:'snap10',name:'Butterfingers',          d:'Snap 10 lines',             p:()=>[S.stats.snapped,10],  coins:250},
  {id:'snap50',name:'Line shop’s best customer', d:'Snap 50 lines',          p:()=>[S.stats.snapped,50],  coins:3000},
  {id:'loot5', name:'Finders keepers',        d:'Fish up 5 pieces of junk',  p:()=>[S.stats.treasure,5],  coins:800},
  {id:'loot25',name:'Beachcomber',            d:'Fish up 25 pieces of junk', p:()=>[S.stats.treasure,25], coins:8000, pt:1, pet:'crab'},
  {id:'junk20',name:'Cabinet of curiosities', d:'Find 20 different oddities', p:()=>[nJunkKinds(),20], coins:30000, pt:1},
  {id:'junkall',name:'Museum of the absurd',  d:'Find all '+JUNK.length+' oddities', p:()=>[nJunkKinds(),JUNK.length], coins:800000, pt:3},
  {id:'hats5', name:'Hat trick',              d:'Own 5 hats',                p:()=>[S.owned.hats.length-1,5], coins:2000},
  {id:'hats15',name:'Milliner',               d:'Own 15 hats',               p:()=>[S.owned.hats.length-1,15], coins:40000, pt:1},
  {id:'hatsall',name:'Head of the class',     d:'Own all '+(HATS.length-1)+' hats', p:()=>[S.owned.hats.length-1,HATS.length-1], coins:1000000, pt:3},
  {id:'pets3', name:'Menagerie',              d:'Own 3 pets',                p:()=>[S.owned.pets.length,3], coins:5000, pt:1},
  {id:'petsall',name:'Noah’s dock',           d:'Own all '+PETS.length+' pets', p:()=>[S.owned.pets.length,PETS.length], coins:1500000, pt:3},
  {id:'style5',name:'Fashion statement',      d:'Buy 5 clothing items',      p:()=>[S.stats.bought,5], coins:5000},
  {id:'hot10', name:'Water reader',           d:'Land 10 catches from hotspots', p:()=>[S.stats.hot,10], coins:4000, pt:1},
  {id:'hot100',name:'Ripple sense',           d:'Land 100 catches from hotspots', p:()=>[S.stats.hot,100], coins:80000, pt:2},
  {id:'buff4', name:'Fully boosted',          d:'Have 4 boosts running at once', p:()=>[S.stats.maxBuffs,4], coins:15000, pt:1},
  {id:'storm', name:'Storm chaser',           d:'Land an Epic or Legendary fish in a storm', p:()=>[S.stats.stormEpic,1], coins:3000, pt:1},
  {id:'tank6', name:'Show tank',              d:'Have 6 fish in your aquarium', p:()=>[S.tank.length,6], coins:5000, pt:1},
  {id:'tank12',name:'Public aquarium',        d:'Have 12 fish in your aquarium', p:()=>[S.tank.length,12], coins:200000, pt:2},
  {id:'rich',  name:'Deep pockets',           d:'Earn 100,000 coins in total', p:()=>[S.stats.earned,100000], coins:10000, pt:1},
  {id:'rich1m',name:'Millionaire',            d:'Earn 1,000,000 coins in total', p:()=>[S.stats.earned,1e6], coins:100000, pt:2},
  {id:'rich10m',name:'Tycoon',                d:'Earn 10,000,000 coins in total', p:()=>[S.stats.earned,1e7], coins:1000000, pt:3},
  {id:'trench',name:'Into the dark',          d:'Unlock Hollow Trench',      p:()=>[S.unlocked.includes('trench')||S.tides?1:0,1], coins:10000, pt:1},
  {id:'perfect25',name:'Sharp eye',           d:'Land 25 perfect hooks',     p:()=>[S.stats.perfect,25],  coins:2500, pt:1},
  {id:'streak10',name:'On a roll',            d:'Reach a catch streak of 10',p:()=>[S.stats.bestStreak,10], coins:1500},
  {id:'streak30',name:'Unbroken line',        d:'Reach a catch streak of 30',p:()=>[S.stats.bestStreak,30], coins:15000, pt:1},
  {id:'demand10',name:'Market regular',       d:'Catch 10 fish the fishmonger wants', p:()=>[S.stats.demand,10], coins:3000},
  {id:'rank5', name:'Rising angler',          d:'Reach angler rank 5',       p:()=>[anglerRank(),5],      coins:5000, pt:1},
  {id:'rank20',name:'Master angler',          d:'Reach angler rank 20',      p:()=>[anglerRank(),20],     coins:150000, pt:2},
  {id:'rank50',name:'Grand master',           d:'Reach angler rank 50',      p:()=>[anglerRank(),50],     coins:2000000, pt:4},
  {id:'frenzy5',name:'Frenzy fan',            d:'Play 5 fish frenzies',      p:()=>[S.gstats.frenzy,5],   coins:3000},
  {id:'frenzy100',name:'Fast fingers',        d:'Tap 100 frenzy fish',       p:()=>[S.gstats.frenzyFish,100], coins:20000, pt:1},
  {id:'star1', name:'Make a wish',            d:'Catch a falling star',      p:()=>[S.gstats.stars,1],    coins:2000, pt:1},
  {id:'crates10',name:'Crate expectations',   d:'Open 10 Mystery Crates',    p:()=>[S.gstats.crates,10],  coins:10000, pt:1},
  {id:'decor5',name:'Interior designer',      d:'Place 5 decorations in your aquarium', p:()=>[S.aq.decor.length,5], coins:8000, pt:1},
  {id:'tide1', name:'Second voyage',          d:'Set sail again once',       p:()=>[S.tides,1],           coins:0, pt:2},
  {id:'tide3', name:'Old sea dog',            d:'Set sail again 3 times',    p:()=>[S.tides,3],           coins:0, pt:3},
];
function checkFeats(){ for(const f of FEATS){ if(S.feats[f.id]) continue; const [a,b]=f.p(); if(a>=b){ S.feats[f.id]=true; earn(f.coins); if(f.pt) S.bonusPts+=f.pt;
  let extra=''; if(f.pet && !S.owned.pets.includes(f.pet)){ S.owned.pets.push(f.pet); extra=', new pet: '+PETI[f.pet].name; }
  setTimeout(()=>{ toast('Feat: '+f.name+' (+'+fmt(f.coins)+' coins'+(f.pt?', +'+f.pt+' skill point'+(f.pt>1?'s':''):'')+extra+')'); sfx.coin(); }, 900); } } }

// ---------- aquarium ----------
const fishRate = f => f.value*TANK_RATE*(1+.08*pr('keeper'))*(1+bonus('tank')+decorBonus())*coinMult();
const tankRate = () => S.tank.reduce((a,f)=>a+fishRate(f),0);
function accrue(){ const now=Date.now(); if(!S.tankT){ S.tankT=now; return 0; } const mins=Math.min(OFFLINE_CAP_MIN,Math.max(0,(now-S.tankT)/60000)); const add=tankRate()*mins; S.tankBank+=add; S.tankT=now; return add; }
function offlineIncome(){ const add=accrue(); if(add>=1 && S.tank.length) setTimeout(()=>toast('While you were away your aquarium earned '+fmt(add)+' coins'),900); }

// ---------- input ----------
function down(e){
  if(G.star && starHit(e)) return;
  switch(G.st){
    case 'frenzy': frenzyHit(e); break;
    case 'idle': startCharge(); break;
    case 'waiting': G.st='idle'; G.inHot=false; breakStreak(); toast('Reeled in early. Wait for the big splash.'); break;
    case 'bite': hookIt(); break;
    case 'reeling': G.hold=true; break;
    case 'result': hideCard(); break;
  }
}
function up(){ if(G.st==='charging') release(); else if(G.st==='reeling') G.hold=false; }
const stage=$('stage');
stage.addEventListener('pointerdown',e=>{ if(e.button>0) return; if(e.target.closest('#evcard')) return; e.preventDefault(); try{stage.setPointerCapture(e.pointerId);}catch(_){} startAudio(); down(e); });
stage.addEventListener('pointerup',up); stage.addEventListener('pointercancel',up);
stage.addEventListener('contextmenu',e=>e.preventDefault());
let spaceDown=false;
window.addEventListener('keydown',e=>{ if(e.code!=='Space') return; const tag=(document.activeElement&&document.activeElement.tagName)||''; if(tag==='SELECT'||tag==='INPUT'||tag==='TEXTAREA') return; e.preventDefault(); if(document.activeElement && document.activeElement!==document.body) document.activeElement.blur(); if(spaceDown) return; spaceDown=true; down(); });
window.addEventListener('keyup',e=>{ if(e.code!=='Space') return; spaceDown=false; up(); });
window.addEventListener('blur',()=>{ spaceDown=false; up(); });

// ---------- update ----------
function update(dt){
  if(G.st==='charging'){ G.power+=G.pdir*dt*1.15; if(G.power>=1){G.power=1;G.pdir=-1;} if(G.power<=0){G.power=0;G.pdir=1;} }
  else if(G.st==='flying'){ G.t+=dt/.45; const t=Math.min(1,G.t); G.bob.x=G.from.x+(G.to.x-G.from.x)*t; G.bob.y=G.from.y+(G.to.y-G.from.y)*t - Math.sin(t*Math.PI)*H*.22; if(t>=1) beginWait(); }
  else if(G.st==='waiting'){ G.waitT+=dt; G.nibOn=Math.max(0,G.nibOn-dt);
    for(let i=G.nib.length-1;i>=0;i--) if(G.waitT>=G.nib[i]){ G.nib.splice(i,1); G.nibOn=.3; sfx.nibble(); }
    if(G.waitT>=G.biteAt){ G.pend=chooseCatch(); G.st='bite'; G.biteEnd=G.waitT+hookWin(); sfx.bite(); splash(G.bob.x,G.bob.y,12); } }
  else if(G.st==='bite'){ G.waitT+=dt; if(G.waitT>G.biteEnd){ G.pend=null; endFight('nohook'); } }
  else if(G.st==='reeling'){ fight(dt); }
  else if(G.st==='landing'){ G.land.t+=dt; if(G.land.t>=G.land.dur) finishCatch(); }
  for(let i=G.parts.length-1;i>=0;i--){ const p=G.parts[i]; p.t+=dt; p.x+=p.vx*dt; p.y+=p.vy*dt; p.vy+=420*dt; if(p.t>p.life) G.parts.splice(i,1); }
  if(weather().k==='Storm'){ G.nextBolt-=dt; if(G.nextBolt<=0){ G.flash=1; G.nextBolt=rnd(6,16); setTimeout(()=>sfx.thunder(),400); } }
  G.flash=Math.max(0,G.flash-dt*2.5);
  // hotspots: ripples on the water where rare fish gather
  if(G.hot){ G.hot.t+=dt; if(G.hot.t>G.hot.life) G.hot=null; }
  else { G.hotNext-=dt*hotRate(); if(G.hotNext<=0){ G.hot={p:rnd(.2,.97), r:.065, t:0, life:rnd(14,22)*(1+.05*pr('reader'))}; G.hotNext=rnd(14,32); } }
  updateEvents(dt);
}
function fight(dt){
  const f=G.fish, B=BEH[f.beh]||BEH.calm, line=gv('line'), reel=reelSpeed(); const ratio=clamp(f.str/line,.05,4);
  G.runT-=dt; if(G.runT<=0){ G.run=!G.run; G.runT = G.run ? rnd(.4,1.1)*(.6+f.th)*B.runMul*(.5+.5*G.sta) : rnd(.5,1.7)*(1.3-f.th)*B.restMul/(.4+.6*G.sta); if(G.run){ splash(G.bob.x,G.bob.y,6); G.ev=null; } }
  if(!G.run && (B.shake||B.jump) && !G.ev){ G.evT-=dt; if(G.evT<=0){ G.ev=B.jump?'jump':'shake'; G.evDur=B.jump?.85:.5; G.evT=rnd(1.3,3)/(.5+f.aggr)*(.6+.4/(.3+G.sta)); if(B.jump){ splash(G.bob.x,G.bob.y,14); sfx.jump(); } else sfx.warn(); } }
  if(G.ev){ G.evDur-=dt; if(G.evDur<=0){ if(G.ev==='jump') splash(G.bob.x,G.bob.y,16); G.ev=null; } }
  const tired=.45+.55*G.sta, steady=tensionMult();
  if(G.hold){
    G.d -= reel*dt*(G.run?.25:1)*(B.drag?.75:1);
    let add = (G.run?70:22)*ratio*tired*(B.heavy?1.35:1);
    G.temper = Math.min(3, G.temper + dt*(.3+f.aggr*.9)*tempMult());
    add += 36*G.temper*G.temper*(.4+f.aggr)*Math.pow(ratio,.3)*(.35+.65*G.sta);
    if(G.ev==='jump') add += 170; else if(G.ev==='shake') add += 110*Math.pow(ratio,.25)+30;
    G.ten += add*steady*dt;
    G.sta = Math.max(0, G.sta - (G.run?.18:.09)*dt*(B.heavy?.6:1));
    G.tickT-=dt; if(G.tickT<=0){ G.tickT=.07; sfx.tick(); }
  } else {
    G.temper = Math.max(0, G.temper - dt*1.8);
    G.ten = Math.max(0, G.ten - 55*dt);
    if(G.run) G.d += (1.5 + f.str*.18) * (.35+.65*G.sta) * dt;
    if(B.drag && !G.run) G.d += (.4 + f.str*.04) * (.3+.7*G.sta) * dt;
    G.sta = Math.max(0, G.sta - .045*dt);
  }
  if(G.run && !G.hold) G.ten = Math.max(G.ten, 6);
  if(G.ten>75 && G.hold){ G.warnT-=dt; if(G.warnT<=0){ G.warnT=.25; sfx.warn(); } }
  const frac = clamp(G.d/G.d0,0,1.6); const x0=W*.24, x1=castX(G.lastCast);
  G.bob.x = x0 + (x1-x0)*Math.min(frac,1.25) + (G.run ? Math.sin(performance.now()/90)*3 : 0) + (G.ev==='shake'?Math.sin(performance.now()/30)*3:0); G.bob.y = waterY(G.bob.x);
  if(G.ten>=100) endFight('snap'); else if(G.d>=G.maxOut) endFight('spool'); else if(G.d<=0) endFight('caught');
}
