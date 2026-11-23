
// ---------- state ----------
const LS_KEY = 'driftline-save-v1';
const baitZero = () => Object.fromEntries(Object.keys(BAIT).filter(k=>k!=='worm').map(k=>[k,0]));
const fresh = () => ({v:3, money:0, xp:0, lvl:1, gear:{rod:0,reel:0,line:0,hook:0,cooler:0,finder:0}, bait:baitZero(), baitSel:'worm',
  unlocked:['pond'], loc:'pond', cooler:[], journal:{}, bounties:[], egPaid:[], setDone:{},
  perks:{}, bonusPts:0, tank:[], tankSlots:3, tankT:0, tankBank:0, feats:{}, pearls:0, pearlV:2, tides:0, streak:0,
  buffs:[], look:{g:'m',skin:1,hair:1,shirt:'#3a6f9a',pat:'none',pants:'#2f3b4a',hat:'cap',hatCol:'#c8553a',hairStyle:'auto',beard:'none',glasses:'none',outfit:'none',outCol:'#d8a020',build:'average',eye:0,shoes:'boots',neck:'none',back:'none',accCol:'#c8553a',nose:'button',brows:'soft',mouth:'smile',blush:'on',aura:'none',bob:'none',line:'none',face:'natural',eyeShape:'round'},
  owned:{hats:['none','cap','bucket'],cols:[],pats:['none'],pets:['dog'],outfits:['none','vest'],glasses:['none','round'],shoes:['boots','sneakers','barefoot'],necks:['none'],backs:['none'],auras:[],bobs:[],lines:[]}, pet:'dog', junk:{}, tickets:0, freeSpins:1,
  settings:{master:.8, music:.55, sfx:.7, amb:.5, musicOn:true, ambient:true, style:'auto', castMode:'meter', dist:'m', vibrate:true, minigames:true, rest:false, effects:true, boostsOnScreen:true, hints:true, protectRare:true, units:'kg', hand:'r', uiScale:'auto', renderQ:'auto'},
  aq:{theme:'lagoon', sand:'gold', decor:[], hid:[], owned:['lagoon','gold']}, voyCatch:{}, titled:{}, nib:{}, pathXP:{}, pearlOld:0, pearlMig:1, pshop:{}, boons:{}, boonPts:0, passMig:1, fedT:0, wheelT:0, rankClaimed:0, tokens:{small:0,big:0,legend:0},
  gstats:{frenzy:0, frenzyFish:0, chests:0, stars:0, spins:0, crates:0, flips:0, flipWins:0, scratch:0, scratchWins:0, pets:0, tasks:0},
  petLook:{}, bond:{}, petTints:['none'], petAccs:['none','bandana'], scales:0, specs:{}, relics:[], castN:0,
  pet2:null, dock:{wood:'oak', decor:[], owned:['oak']}, pass:{xp:0,lvl:0,claimed:0}, derby:null, medals:{gold:0,silver:0,bronze:0},
  rods:{owned:['bamboo'], eq:'bamboo', lvl:{}, att:{}}, atts:{}, daily:null, login:{last:'', streak:0}, seenPatch:'',
  stats:{caught:0,earned:0,runEarned:0,snapped:0,shiny:0,treasure:0,stormEpic:0,trophies:0,bestStreak:0,perfect:0,demand:0,hot:0,bought:0,maxBuffs:0},
  muted:true, tab:'cooler', savedAt:0});
let S = fresh();
const uniq = a => [...new Set(a)];
// 0.4: a damaged save never crashes loading. Anything with the wrong type (text where a number belongs, a list that is
// not a list...) falls back to its default, numbers stay finite and never negative, and lists only hold real entries.
const isObj = v => !!v && typeof v==='object' && !Array.isArray(v);
function saveClean(o,d){ const out={}; for(const k of Object.keys(o)){ const v=o[k], dv=d?d[k]:undefined;
    if(dv===undefined||dv===null){ out[k]=v; continue; }
    if(typeof dv==='number'){ const n=typeof v==='string'&&v.trim()!==''?+v:v; if(typeof n==='number'&&isFinite(n)) out[k]=n; continue; }
    if(typeof dv==='string'||typeof dv==='boolean'){ if(typeof v===typeof dv) out[k]=v; continue; }
    if(Array.isArray(dv)){ if(Array.isArray(v)) out[k]=v.filter(x=>x!==null&&x!==undefined); continue; }
    if(isObj(dv)){ if(isObj(v)) out[k]=saveClean(v,dv); continue; }
    out[k]=v; }
  return out; }
function migrate(o){ const d=fresh(); if(!isObj(o)) return d; o=saveClean(o,d);
  for(const k of ['cooler','tank','bounties']) if(o[k]) o[k]=o[k].filter(isObj);
  if(o.journal!==undefined&&!isObj(o.journal)) delete o.journal; else if(o.journal) for(const k in o.journal) if(!isObj(o.journal[k])) delete o.journal[k];
  for(const k of ['money','scales','tickets','pearls','xp','tankBank','freeSpins','tides']) if(typeof o[k]==='number') o[k]=Math.max(0,o[k]);
  if(typeof o.lvl==='number') o.lvl=Math.max(1,Math.floor(o.lvl));
  if(o.rods){ if(o.rods.owned) o.rods.owned=o.rods.owned.filter(x=>typeof x==='string'); /* unknown rods are dropped later, once the rod list exists (bm_ui04) */ if(typeof o.rods.eq!=='string') delete o.rods.eq; }
  if(o.pass){ for(const k of ['xp','lvl','claimed']) if(typeof o.pass[k]==='number') o.pass[k]=Math.max(0,Math.floor(o.pass[k])); if(o.pass.claimed>o.pass.lvl) o.pass.claimed=o.pass.lvl||0; }
  if(o.bait&&isObj(o.bait)) for(const k in o.bait){ const n=+o.bait[k]; o.bait[k]=isFinite(n)&&n>0?Math.floor(n):0; }
  const m=Object.assign(d,o);
  m.gear=Object.assign(fresh().gear,o.gear||{}); for(const k in GEAR) m.gear[k]=clamp(m.gear[k]|0,0,GEAR[k].lv.length-1);
  m.bait=Object.assign(baitZero(),o.bait||{}); if(!BAIT[m.baitSel]) m.baitSel='worm';
  m.stats=Object.assign(fresh().stats,o.stats||{}); m.perks=Object.assign({},o.perks||{}); for(const k in m.perks){ if(!PERKS[k]) delete m.perks[k]; else m.perks[k]=Math.min(m.perks[k],PERKS[k].max); }
  m.feats=Object.assign({},o.feats||{}); m.tank=(m.tank||[]).filter(f=>SPI[f.id]); m.tankBank=+m.tankBank||0; for(const f of m.tank.concat(m.cooler||[])) if(f&&SPI[f.id]&&!(+f.value>0)) f.value=Math.max(1,Math.round(SPI[f.id].base*RAR[SPI[f.id].r].val)); m.cooler=(m.cooler||[]).filter(f=>SPI[f.id]);
  m.unlocked=(m.unlocked||['pond']).filter(id=>LOCS.some(l=>l.id===id)); if(!m.unlocked.includes('pond')) m.unlocked.unshift('pond'); if(!m.unlocked.includes(m.loc)) m.loc='pond';
  for(const k in m.journal){ if(!SPI[k]) delete m.journal[k]; }
  m.look=Object.assign(fresh().look,o.look||{}); const ow=o.owned||{};
  m.owned={hats:uniq([...d.owned.hats,...(ow.hats||[])]).filter(h=>HATI[h]), cols:uniq(ow.cols||[]), pats:uniq(['none',...(ow.pats||[])]), pets:uniq(['dog',...(ow.pets||[])]).filter(p=>PETI[p]), outfits:uniq(['none','vest',...(ow.outfits||[])]), glasses:uniq(['none','round',...(ow.glasses||[])]),
    shoes:uniq(['boots','sneakers','barefoot',...(ow.shoes||[])]).filter(x=>SHOEI[x]), necks:uniq(['none',...(ow.necks||[])]).filter(x=>NECKI[x]), backs:uniq(['none',...(ow.backs||[])]).filter(x=>BACKI[x])};
  if(!BUILDI[m.look.build]) m.look.build='average'; if(m.look.shoeCol&&!/^#[0-9a-f]{6}$/i.test(m.look.shoeCol)) m.look.shoeCol=''; for(const [k,L,d] of [['nose',NOSES,'button'],['brows',BROWS,'soft'],['mouth',MOUTHS,'smile'],['blush',BLUSHES,'on']]) if(!L.some(x=>x[0]===m.look[k])) m.look[k]=d; if(!EYES[m.look.eye]) m.look.eye=0; if(!m.owned.shoes.includes(m.look.shoes)) m.look.shoes='boots'; if(!m.owned.necks.includes(m.look.neck)) m.look.neck='none'; if(!m.owned.backs.includes(m.look.back)) m.look.back='none';
  m.tickets=+o.tickets||0; if(o.freeSpins==null) m.freeSpins = (Date.now()-(o.wheelT||0)>=3600000) ? 1 : 0;
  if(!m.owned.hats.includes(m.look.hat)) m.look.hat='cap'; if(!PETI[m.pet]||!m.owned.pets.includes(m.pet)) m.pet='dog';
  m.buffs=(o.buffs||[]).filter(b=>b&&BK[b.k]&&b.until>Date.now()); m.junk=Object.assign({},o.junk||{});
  m.settings=Object.assign(fresh().settings,o.settings||{}); if(m.settings.units!=='lb') m.settings.units='kg'; if(m.settings.dist!=='ft') m.settings.dist='m'; if(m.settings.hand!=='l') m.settings.hand='r'; if(m.settings.uiScale!=='auto'&&!(+m.settings.uiScale>=.85&&+m.settings.uiScale<=2.5)) m.settings.uiScale='auto'; if(!['auto','sharp','balanced','fast'].includes(m.settings.renderQ)) m.settings.renderQ='auto'; const aq=Object.assign(fresh().aq,o.aq||{}); aq.owned=uniq(['lagoon','gold',...(aq.owned||[])]); aq.decor=(aq.decor||[]).filter(x=>aq.owned.includes(x)); aq.hid=(Array.isArray(aq.hid)?aq.hid:[]).filter(x=>aq.decor.includes(x));
  if(!o.voyCatch||typeof o.voyCatch!=='object'){ m.voyCatch={}; for(const L of LOCS){ let n=0; for(const s of SP) if(s.loc===L.id&&m.journal&&m.journal[s.id]) n+=m.journal[s.id].n||1; if(n) m.voyCatch[L.id]=n; } } else { m.voyCatch={}; for(const k in o.voyCatch) if(LOCS.some(L=>L.id===k)&&o.voyCatch[k]>0) m.voyCatch[k]=Math.floor(o.voyCatch[k]); } /* [16] old saves start with their lifetime catches per water */
  { const t={}; if(o.titled&&typeof o.titled==='object'){ for(const k in o.titled){ const id=k.split(':')[0]; if(SPI[id]) t[k]=1; } } else { for(const id in (m.journal||{})) if(m.journal[id]&&m.journal[id].pr) t[id+':old']=1; } m.titled=t; } /* [18] titled shinies ever caught; old saves count every species with a prismatic catch */
  { const nb={}; if(o.nib&&typeof o.nib==='object') for(const k in o.nib){ const n=Math.floor(+o.nib[k]); if(!(n>0)) continue; const kk=/^r[0-5]$/.test(k)?k:SPI[k]?'r'+Math.min(5,SPI[k].r):null; if(kk) nb[kk]=Math.min((nb[kk]||0)+n,1e6); } /* C27: Nibbles are kept per rarity (r0 common .. r5 mythic); old per-species ones fold into their rarity */ m.nib=nb; for(const f of (m.tank||[])){ if(f.fed!=null) f.fed=Math.max(0,Math.floor(+f.fed)||0); if(f.nbst!=null) f.nbst=Math.max(0,Math.floor(+f.nbst)||0); for(const q of ['fdb','fdi']) if(f[q]!=null) f[q]=Math.min(50,Math.max(0,Math.floor(+f[q])||0)); /* C28 feeding gains */ if(f.abx) f.abx=(Array.isArray(f.abx)?f.abx:[]).filter(b=>b&&BK[b.k]).slice(0,5); } } /* [19] Fish Nibbles */ m.aq=aq;
  m.tokens=Object.assign(fresh().tokens,o.tokens||{}); m.gstats=Object.assign(fresh().gstats,o.gstats||{}); delete m.muted;
  m.petLook=Object.assign({},o.petLook||{}); m.bond=Object.assign({},o.bond||{}); m.petTints=uniq(['none',...(o.petTints||[])]); m.petAccs=uniq(['none','bandana',...(o.petAccs||[])]);
  const rd=Object.assign(fresh().rods,o.rods||{}); rd.owned=uniq(['bamboo',...(rd.owned||[])]); if(!rd.owned.includes(rd.eq)) rd.eq='bamboo'; rd.lvl=Object.assign({},rd.lvl||{}); rd.att=Object.assign({},rd.att||{}); m.rods=rd;
  m.atts=Object.assign({},o.atts||{}); m.login=Object.assign(fresh().login,o.login||{}); m.scales=+o.scales||0;
  m.specs=Object.assign({},o.specs||{}); for(const k in m.specs) if(m.specs[k]==='homebody') m.specs[k]='petnap'; /* batch 5: Homebody became Pet Nap with the decorations */ m.relics=uniq(o.relics||[]); if(!m.pet2||!PETI[m.pet2]||!m.owned.pets.includes(m.pet2)||m.pet2===m.pet) m.pet2=null;
  const dk=Object.assign(fresh().dock,o.dock||{}); dk.owned=uniq(['oak',...(dk.owned||[])]); dk.decor=[]; /* batch 5: home decorations are gone (no refunds: director 2026-11-21) */ if(!dk.owned.includes(dk.wood)) dk.wood='oak'; m.dock=dk;
  m.pass=Object.assign(fresh().pass,o.pass||{}); m.medals=Object.assign(fresh().medals,o.medals||{}); if(m.derby && !(m.derby.until>Date.now()-3600000)) m.derby=null;
  if((o.pearlV||1)<2){ m.pearls=Math.ceil((+o.pearls||0)*.4); m.pearlV=2; }
  m.bounties=(m.bounties||[]).filter(b=>SPI[b.sp]||['trophy','style','shiny'].includes(b.type)); if(m.tankSlots>TANK_COST.length) m.tankSlots=TANK_COST.length; m.v=3; return m; }
try { const raw = localStorage.getItem(LS_KEY); if (raw) { try { S = migrate(JSON.parse(raw)); } catch(e) { try{ localStorage.setItem(LS_KEY+'-unreadable', raw); window.__dlUnreadable=true; }catch(e2){} } } } catch(e) {} // 0.4: a save that cannot be read is kept aside, never overwritten

let cloudDoc = null, saveTimer = null, saving = false, pendingSave = false;
function save(){ S.savedAt = Date.now(); try{ localStorage.setItem(LS_KEY, JSON.stringify(S)); }catch(e){} try{ autoBackup(); }catch(e){} /* at most every 5 minutes (d3_update.js) */
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
/* weights: one formatter for the whole game, in the unit picked in Settings (director, 2026-11-19: "metric and imperial") */
const wLb=()=>!!(S&&S.settings&&S.settings.units==='lb'), wNum=kg=>wLb()?kg*2.20462:kg, wUnit=()=>wLb()?'lb':'kg';
/* distances (Cam's list #11): stored in metres, shown in metres or feet; depths are rounded so they read evenly, with "about" in feet */
const dFt=()=>!!(S&&S.settings&&S.settings.dist==='ft'), dStr=(m,dp)=>dFt()?(m*3.28084).toFixed(dp==null?0:dp)+' ft':m.toFixed(dp==null?1:dp)+' m';
function depthStr(s){ s=String(s||''); if(!dFt()) return s; const ft=n=>{ const v=n*3.28084, st=v<20?1:v<200?5:v<2000?50:500; return Math.round(v/st)*st; }; let any=false; const out=s.replace(/(\d[\d,]*(?:\.\d+)?)/g,(x)=>{ any=true; return ft(parseFloat(x.replace(/,/g,''))).toLocaleString('en-US'); }).replace(/ m\b/g,' ft'); return any?'about '+out:s; }
const wFix=(kg,d)=>wNum(kg).toFixed(d)+' '+wUnit();
const kgStr = kg => { const v=wNum(kg), u=' '+wUnit(); return v < 10 ? v.toFixed(2)+u : v < 100 ? v.toFixed(1)+u : fmt(v)+u; };
const xpNeed = l => Math.round(l<=20 ? 80*Math.pow(1.38,l-1) : 80*Math.pow(1.38,19)*Math.pow(1.22,l-20)); // 0.3: gentler past level 20 so late levels stay reachable
const PEARL_COIN=.25, PEARL_RARE=.03, PEARL_DIV=250000, PEARL_EXP=2.4; // 0.3: pearls are rarer but each one does more
const coinMult = () => 1 + PEARL_COIN*(S.pearlOld||0) + .01*pshopLv('gold') + voyageLegacy() + titleLegacy(); /* 0.3.6: plus the Legacy of every voyage completed */
const hashStr = s => { let h=2166136261; for(let i=0;i<s.length;i++){ h^=s.charCodeAt(i); h=Math.imul(h,16777619); } return h>>>0; };
// boosts (timed), aquarium fish and the pet all feed the same bonus keys
function buffSum(k){ const t=Date.now(); let s=0; for(const b of S.buffs) if(b.k===k && b.until>t) s+=b.v; return s; }
const aqCache = {};
function aqBase(id){ if(!(id in aqCache)){ const sp=SPI[id]; aqCache[id] = sp.r ? {k:AQ_KEYS[hashStr(id)%AQ_KEYS.length], v:AQ_MAG[sp.r]} : null; } return aqCache[id]; }
/* one owner for what a fish really gives in the aquarium (batch 2, 2026-11-21): its own boosts times the titled-shiny lift
   (titled shinies lift every other fish, not themselves). Every total, line and badge reads this, so shown = applied. */
function aqNet(f){ const L=aqBuffsOf(f); const m=f.sh===2?1:1+titleAura(); return m===1?L:L.map(e=>Object.assign({},e,{v:e.v*m})); }
function aqEff(f){ return aqNet(f)[0]||null; }
function aqSum(k){ let s=0; for(const f of S.tank) for(const e of aqNet(f)) if(e.k===k) s+=e.v; return s; } /* [18] titled shinies lift every other fish */
const petVal = (id=S.pet) => { const p=PETI[id]; return p ? p.v*(1+.1*pr('petpal'))*(1+.05*bondLevel(id)) : 0; };
function petSum(k){ const p=PETI[S.pet], q=S.pet2&&PETI[S.pet2]; return (p && p.k===k ? petVal() : 0) + (q && q.k===k ? petVal(S.pet2)*compShare() : 0); }
const compShare = () => .5+.02*bondLevel(S.pet2);
function bonus(k){ const v=buffSum(k)+aqSum(k)+petSum(k)+rodBonus(k); return BONUS_CAP[k] ? Math.min(BONUS_CAP[k],v) : v; }
/* the sale price before bonuses: one formula, also used by Market Rush (a copy of it missed the Merchant Path, so Rush gave 27.5% instead of 30%: Cam's Pixel, 2026-11-20) */
const sellBase = () => 1 + .03*(S.lvl-1) + .04*pr('haggler') + .01*anglerRank() + (spec('merchant')?.12:0);
const sellMult = () => (sellBase() + bonus('sell')) * coinMult();
const xpMult = () => (1 + bonus('xp')) * (coinMult() + .01*(pshopLv('xp')-pshopLv('gold')));
function earn(n){ n=Math.floor(n); S.money+=n; S.stats.earned+=n; S.stats.runEarned+=n; return n; }
const pearlsFor = () => { const n=Math.floor(Math.pow(S.stats.runEarned/PEARL_DIV,1/PEARL_EXP)*voyagePearlMult()*pathMul('pearl')); return n>0 ? n+(relic("pearlseeker")?1:0) : 0; }; /* 0.3.6: experienced sailors find more pearls */
const salePrice = f => Math.round(f.value*sellMult()*(demandSp().id===f.id?(maxed('haggler')?3:2):1));
const hookWin = () => gv('hook') + .05*pr('reflex') + rodHook() + (relic('goldhook')?.15:0);
const reelSpeed = () => gv('reel') * (1 + .04*pr('strong')) * (1 + bonus('reel'));
const tensionMult = () => (1 - .04*pr('steady')) * (1 - bonus('tension'));
const tempMult = () => Math.max(.25, (1 - .06*pr('softtouch')) * (1 - bonus('calm')) * (1 - (BAIT[S.baitSel].calm||0)) * (spec('gentle')?.65:1));
const farAt = () => .8 - .02*pr('caster');
const hotRate = () => Math.min(4, (1 + .1*pr('reader') + .2*S.gear.finder + bonus('hot')) * (relic('compass')?1.4:1) * pathMul('hotrate')); /* batch 6: hotspots at most 4× as often */
/* C29 (director + Cam, 2026-11-20): a hotspot's color tells its lowest rarity: green uncommon (most often) .. gold legendary (rarest);
   about 1 in 20 also promises a shiny (rising sparkles). In a hotspot hybrids, shinies and titles come more often. Feel calls: all numbers here. */
const HOT_TIERS=[[1,'#5ee08a',.55],[2,'#5aa8ff',.28],[3,'#c27bff',.13],[4,'#ffc94d',.04]], HOT_SHINY=.05, HOT_SHINY_K=2.5, HOT_HYBRID_K=1.5, HOT_PRISM_K=1.5;
function hotTier(){ let x=Math.random()*HOT_TIERS.reduce((a,t)=>a+t[2],0), T=HOT_TIERS[0]; for(const t of HOT_TIERS){ x-=t[2]; if(x<=0){ T=t; break; } } return {min:T[0], col:T[1], shiny:Math.random()<HOT_SHINY}; }
const streakCap = () => .5 + .1*pr('streaker');
/* [15] more ways to earn skill points: +1 for every 25 species in your Fish Log, +2 for every water whose Fish Log is complete (worked out
   from the Fish Log, so nothing extra is saved and nothing can be lost; cached until the Fish Log changes) */
let LOGPTS_K=-1, LOGPTS_V=0, LOGPTS_S=null;
function logPts(){ const n=Object.keys(S.journal||{}).length; if(n!==LOGPTS_K||LOGPTS_S!==S){ LOGPTS_K=n; LOGPTS_S=S; const found=SP.filter(s=>S.journal[s.id]).length, done=LOCS.filter(L=>{ const a=SP.filter(s=>s.loc===L.id); return a.length&&a.every(s=>S.journal[s.id]); }).length; LOGPTS_V=Math.floor(found/25)+2*done; } return LOGPTS_V; }
const ptsTotal = () => (S.lvl-1) + S.bonusPts + logPts();
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
// 0.4.9 [16] (director: "10 fish catches are required now. Each voyage, another 10 ... 5th time, 50 fish. This is where it stops
// scaling"): the next water opens after that many fish caught at the one before, during this voyage.
const unlockNeed = () => Math.max(5,Math.round(Math.min(50, 10*((S.tides||0)+1))*pathMul('unlock')));
const voyCatchAt = loc => (S.voyCatch&&S.voyCatch[loc])||0;
const unlockMet = i => i<=0 || S.unlocked.includes(LOCS[i].id) || (LOCS[i].eg ? egCharted(LOCS[i]) : voyCatchAt(LOCS[i-1].id) >= unlockNeed()); /* [69] end-game waters open by voyages, not catches */
const unlockLine = i => { if(LOCS[i].eg) return egCharted(LOCS[i]) ? 'Voyage '+egVoy(LOCS[i])+' complete: open it for coins' : 'Complete voyage '+egVoy(LOCS[i])+' to unlock ('+(S.tides||0)+' so far)'; const prev=LOCS[i-1]; return Math.min(voyCatchAt(prev.id),unlockNeed())+' / '+unlockNeed()+' fish caught at '+prev.name+' this voyage'; };
const spAt = loc => SP.filter(s=>s.loc===loc);

const CYCLE = 360;
function phase(){ return (Date.now()/1000 % CYCLE)/CYCLE; }
function tod(p=phase()){ if(p<.05||p>=.95) return 'Dawn'; if(p<.45) return 'Day'; if(p<.55) return 'Dusk'; return 'Night'; }
function isNight(p=phase()){ const t=tod(p); return t==='Night'||t==='Dusk'; }
function timeOk(sp,p){ if(sp.time==='any') return true; if(sp.time==='night') return isNight(p) || !!weather().fog || (maxed('nightowl') && tod(p)==='Dawn'); return !isNight(p) || tod(p)==='Dusk'; }
function nextFlip(){ const p=phase(); const target = isNight(p) ? .95 : .45; let d = target - p; if(d<0) d+=1; return {label: isNight(p)?'Day in':'Dusk in', s: Math.round(d*CYCLE)}; }
function weatherAt(slot){ const h = (Math.imul(slot ^ 0x9e3779b9, 2654435761) >>> 0) % 10000 / 100; let x=h; for(const w of WEATHERS){ x-=w.w; if(x<0) return w; } return WEATHERS[0]; }
const WX_NAME={Fog:'Heavy fog'}; function wxName(k){ return WX_NAME[k]||k; }
// how strongly the current weather shows (0..1): it builds up over the first half minute and fades out over the
// last one when the next slot brings different weather (looks only; the gameplay effect is the whole slot)
const WX_FADE=32;
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
  gulp(){ tone(90,.35,'sine',.12,-30); tone(60,.5,'triangle',.08,0,.12); tone(140,.12,'square',.03,0,.05); },
  coin(){ tone(1320,.08,'square',.05); tone(1760,.12,'square',.05,0,.07); },
  thunder(){ noise(1.2,.25,120); },
  jump(){ noise(.3,.3,1200); tone(300,.15,'triangle',.05,300); },
  warn(){ tone(180,.08,'square',.05); },
  hot(){ tone(1046,.12,'sine',.06); tone(1318,.16,'sine',.06,0,.1); },
  pull(){ noise(.4,.3,900); tone(700,.3,'triangle',.06,500); },
};

// ---------- canvas ----------
//@layer mobile mobile/canvas_opaque.js
const cv=$('cv'), g=cv.getContext('2d'); let W=800,H=400,DPR=1, UIZ=1; /* UIZ: the PC interface zoom (pc/ui_display.js); 1 everywhere else */
// the water's height override: none by default; layers and later files replace or wrap it (the phone layer has its own)
function stageHOverride(W,H){ return 0; }
function resize(){ const r=cv.parentElement.getBoundingClientRect(); W=Math.max(280,cv.parentElement.clientWidth||r.width); /* the inside of the water frame, not its border: the picture is drawn at exactly the size it is shown, never rescaled (it was 2 px too wide, which blurred it a little and cost a rescale every frame) */ const portrait=(window.innerHeight/UIZ)>(window.innerWidth/UIZ)*1.15;
  const fs=!!document.fullscreenElement, shortLand=!portrait && (window.innerHeight/UIZ)<560; const app=portrait&&(window.innerWidth/UIZ)<=700; /* 0.3.5.2: phones held upright use the one-screen layout, so the water leaves room for the menu */ const maxH=portrait?(window.innerHeight/UIZ)*(app?.40:.56):shortLand?(window.innerHeight/UIZ)-70:Math.max(520,(window.innerHeight/UIZ)*(fs?.8:.66));
  H=clamp(Math.round(W*(portrait?(app?.74:.82):fs?.56:shortLand?.62:.5)),shortLand?180:app?200:250,Math.round(maxH)); if(typeof stageHOverride==="function"){ const o=stageHOverride(W,H); if(o) H=o; } DPR=UIZ===1?renderDPR(W,H):Math.round(renderDPR(W*UIZ,H*UIZ)*UIZ*100)/100;
  // resizing a canvas wipes it: skip when nothing changed, and draw the scene again at once so a blank frame never shows (folding the side panels flashed)
  if(cv.width===Math.floor(W*DPR)&&cv.height===Math.floor(H*DPR)&&cv.style.height===H+'px'){ g.setTransform(DPR,0,0,DPR,0,0); return; }
  cv.width=W*DPR; cv.height=H*DPR; cv.style.height=H+'px'; g.setTransform(DPR,0,0,DPR,0,0);
  if(resize.live){ resize.force=true; try{ draw(performance.now()); }catch(e){} resize.force=false; } }
// drawing size: the screen's sharpness (at most 2x), but a very large picture on a high-scaling PC screen is capped at about 3.2 million
// pixels (never below normal sharpness), so big full-screen windows stay smooth on fast monitors
function renderDPR(w,h){ let d=Math.min(2,window.devicePixelRatio||1); const cap=3.2e6; if(d>1&&w*h*d*d>cap) d=Math.max(1,Math.sqrt(cap/(w*h))); return Math.round(d*100)/100; }
new ResizeObserver(resize).observe(cv.parentElement); resize();
const HZ = () => H*.42;
const TIP = () => ({x:W*.215, y:H*.27});
function waterY(x){ const t=clamp((x-W*.22)/(W*.74),0,1); return H*.86 + (H*.49 - H*.86)*t; }
function castX(p){ return W*.27 + p*W*.66; }

// ---------- game state (not saved) ----------
const G = {st:'idle', power:0, pdir:1, t:0, bob:{x:0,y:0}, from:null, to:null, waitT:0, biteAt:0, biteEnd:0, nib:[], nibOn:0,
  fish:null, pend:null, d:0, d0:0, maxOut:0, ten:0, sta:1, temper:0, run:false, runT:0, ev:null, evT:2, evDur:0, hold:false, tickT:0, warnT:0,
  parts:[], lastCast:.5, flash:0, nextBolt:5, hot:null, hotNext:8, inHot:false, land:null, perfect:false};

function startCharge(){ if(S.cooler.length >= gv('cooler')){ toast(quip('full')+' Sell or move fish to the Aquarium.'); setTab('cooler'); return; }
  if(S.baitSel!=='worm' && S.bait[S.baitSel]<=0){ S.baitSel='worm'; renderBait(); }
  G.st='charging'; G.power=0; G.pdir=1; ac(); }
function release(){ if(G.st!=='charging') return; G.st='flying'; G.t=0; G.lastCast=G.power; const tip=TIP(); G.from={x:tip.x,y:tip.y}; const x=castX(G.power); G.to={x, y:waterY(x)};
  G.inHot = !!(G.hot && Math.abs(G.power-G.hot.p) <= G.hot.r); if(G.inHot){ G.hotMin=G.hot.min||0; G.hotShiny=!!G.hot.shiny; G.hot=null; } else { G.hotMin=0; G.hotShiny=false; } /* C29: what this hotspot promises */ if(!G.inHot && maxed('caster') && G.power>.97){ G.inHot=true; toast('Bullseye!'); } sfx.cast(); }
function beginWait(){ G.st='waiting'; G.waitT=0; G.missN=0; const b=BAIT[S.baitSel]; const wx=weather();
  const speed=biteSpeed(G.inHot);
  G.biteAt = rnd(1.4,4.6)/speed; S.castN=(S.castN||0)+1; if(maxed('patience') && S.castN%10===0) G.biteAt=.35; G.nib=[]; const n=Math.floor(Math.random()*3); for(let i=0;i<n;i++) G.nib.push(rnd(.5,Math.max(.6,G.biteAt-.4))); G.nibOn=0;
  splash(G.bob.x,G.bob.y,10); sfx.splash(); if(G.inHot){ splash(G.bob.x,G.bob.y,14); sfx.hot(); toast('Right in the hotspot! Rare fish are gathering.'); } }
// shared by fishing and the Stats tab, so the sheet always shows the real numbers
function biteSpeed(hot){ const b=BAIT[S.baitSel], wx=weather(); return b.speed*(1+.01*(S.lvl-1))*(1+.05*pr('patience'))*(wx.bite||1)*(1+bonus('bite'))*(hot?1.3:1)*(spec('speedy')?1.2:1)*((wx.k!=='Clear'||maxed('weatherwise'))?1+.04*pr('weatherwise'):1); }
function rareScore(dm,far,hot,p){ const b=BAIT[S.baitSel], wx=weather(); p=p==null?phase():p;
  let rare = dm.rare + PEARL_RARE*(S.pearlOld||0) + b.rare + (ROD_RARE[S.gear.rod]||0) + (far ? .2+.03*pr('caster') : 0) + .06*pr('lucky') + (wx.rare||0) + bonus('rare')*2 + (isNight(p)?.1*pr('nightowl'):0) + (hot?1:0);
  if(S.baitSel==='glow' && isNight(p)) rare*=1.5; if(b.loc===S.loc) rare*=(b.locMul||2); if(b.sea && SEA.includes(S.loc)) rare*=1.5; if(b.night && isNight(p)) rare*=b.night; rare*=(spec('patient')?1.2:1)*specLocRare(S.loc)*(G.missN>0?1+.05*pr('secondbite'):1); return rare; } /* Second Bite: better odds on every try after a miss */
function shinyChance(hot){ const b=BAIT[S.baitSel], wx=weather(); return Math.min(.15, (.02 + .003*pr('lucky')) * (wx.shiny||1) * (b.shiny||1) * (1+bonus('shiny')) * (hot?HOT_SHINY_K:1) * (spec('shinyhunter')?1.6:1) * (relic('luckypearl')?1.5:1)); } /* batch 6: at most 15% shiny, whatever stacks */
const junkChance = () => Math.min(.2, .05*(1+.1*pr('scavenger'))*(1+bonus('treasure'))*(BAIT[S.baitSel].treasure||1)*(G.inHot?1.5:1)*(spec('tinker')?1.6:1)*(weather().treasure||1)*pathMul('junk')); /* batch 6: at most 1 cast in 5 brings up an oddity, however it is stacked */
function pickJunk(){ const ws=JUNK.map(j=>JUNK_W[j.t]); let x=Math.random()*ws.reduce((a,b)=>a+b,0); for(let i=0;i<JUNK.length;i++){ x-=ws[i]; if(x<=0) return JUNK[i]; } return JUNK[0]; }
const fishHatsLeft = () => HATS.filter(h=>h.src==='fish' && !S.owned.hats.includes(h.id));
function chooseCatch(){
  const p=phase(), b=BAIT[S.baitSel], wx=weather(), li=locIdx(S.loc); const weak={str:1.5+li*2.2, th:.15, beh:'calm', aggr:.15, kg:1};
  if(Math.random() < .007*(G.inHot?2.5:1)*(1+bonus('treasure')*.5) && fishHatsLeft().length) return Object.assign({kind:'hat', hat:pick(fishHatsLeft())}, weak);
  if(Math.random() < junkChance()) return Object.assign({kind:'junk', item:pickJunk()}, weak);
  const dm=distanceMods();
  const rare = rareScore(dm, G.lastCast>farAt(), G.inHot, p);
  let pool=SP.filter(s=>s.loc===S.loc && timeOk(s,p)); if(G.inHot&&G.hotMin){ const mx=Math.max(...pool.map(s=>s.r)), up=pool.filter(s=>s.r>=Math.min(G.hotMin,mx)); if(up.length) pool=up; } /* C29: a hotspot's color is its lowest rarity (or the best this water has at this hour) */ if(maxed('lucky') && (S.stats.caught+1)%25===0 && pool.some(s=>s.r>=2)) pool=pool.filter(s=>s.r>=2);
  const ws=pool.map(s=>catchW(s,pool,rare,b));
  let x=Math.random()*ws.reduce((a,c)=>a+c,0), sp=pool[0]; for(let i=0;i<pool.length;i++){ x-=ws[i]; if(x<=0){ sp=pool[i]; break; } }
  return rollFish(sp,{dist:{rare:dm.rare,weight:dm.weight}});
}
// 0.3.6: how much better rare odds make each rarity. Compounding, so every source of rare odds keeps mattering as they
// stack (it used to be a flat sum, where each new source counted for less and less). Commons are never boosted.
const rareMul = (rare,f) => f ? Math.pow(1+Math.max(0,rare)*.6, f*1.25) : 1;
function catchW(s,pool,rare,b){ return rarBase(s,pool)*rareMul(rare,RAR[s.r].f)*(b.beh&&b.beh.includes(s.beh)?1.9:1)*(b.legend&&s.r>=4?b.legend:1)*(spec('mythseeker')&&s.r>=4?1.4:1); }
// the real chance of each rarity on your next normal cast here (no hotspot, not a far cast), from the same weights as a
// catch; opts can try a different bait or rod or extra Lucky Charm ranks, so cards can show exactly what a choice changes
function catchOdds(opts={}){ const keep={bait:S.baitSel, rod:S.rods&&S.rods.eq, perks:S.perks};
  try{ if(opts.bait) S.baitSel=opts.bait; if(opts.rod&&S.rods) S.rods.eq=opts.rod; if(opts.lucky!=null) S.perks=Object.assign({},S.perks,{lucky:opts.lucky});
    const p=phase(), b=BAIT[S.baitSel], rare=rareScore(distanceMods(), !!opts.far, !!opts.hot, p), pool=SP.filter(s=>s.loc===(opts.loc||S.loc) && timeOk(s,p));
    const ws=pool.map(s=>opts.mul?rarBase(s,pool)*opts.mul(rare,RAR[s.r].f):catchW(s,pool,rare,b)), tot=ws.reduce((a,c)=>a+c,0)||1, by=[0,0,0,0,0,0]; pool.forEach((s,i)=>by[s.r]+=ws[i]/tot);
    const ev=opts.ev?pool.reduce((a,s,i)=>a+ws[i]/tot*opts.ev(s),0):0; return {by, epic:by[3]+by[4]+by[5], legend:by[4]+by[5], ev, rare, shares:pool.map((s,i)=>[s,ws[i]/tot])}; }
  finally{ S.baitSel=keep.bait; if(S.rods) S.rods.eq=keep.rod; S.perks=keep.perks; } }
const fmtOdds = x => x>=.1 ? (x*100).toFixed(0)+'%' : x>=.01 ? (x*100).toFixed(1)+'%' : (x*100).toFixed(2)+'%';
function hookIt(){ const perfect = (G.waitT - (G.biteEnd - hookWin())) < .3*hookWin(); G.fish = G.pend || chooseCatch(); G.pend=null; G.perfect = perfect;
  if(S.baitSel!=='worm'&&!pathSave()){ S.bait[S.baitSel]=Math.max(0,S.bait[S.baitSel]-1); if(S.bait[S.baitSel]===0) toast(BAIT[S.baitSel].name+' used up. Back to worms.'); renderBait(); save(); }
  G.st='reeling'; G.crank=0; G.d0=G.d= 6 + G.lastCast*gv('rod')*.6*rodCast(); G.maxOut = gv('rod')*rodCast() + 28 + rodSpool(); G.ten=10; G.sta=1; G.temper=0; G.run=false; G.face=1; G.runT=rnd(.5,1.1); G.ev=null; G.evT=rnd(1,2.2); G.hold=false; tone(660,.08,'square',.05);
  G.fightT=0; G.saved=false; G.eat=null; G.strip=null; G.swN=0; G.hotT=0; G.hotRolled=false; G.swT=0; G.eatDone=false; G.behT=0; G.surge=null; G.surgeN=0; G.dd=0; if(fishNew()) ffInit();
  if(G.fish.kind==='fish'){ const fp=fishPull(G.fish), as=anglerStr(); if(fp>as) setTimeout(()=>toast(Math.round(wNum(fp))-Math.round(wNum(as))>=10?'Good luck, this fish is out of your league!':'Prepare for a fight, this fish is strong!'),300); /* C8 (director + Cam, 2026-11-20): never "heavier", no numbers unless 10+ stronger than you */ else if(fightWill(G.fish)>=.66&&G.fish.shiny!==2) setTimeout(()=>toast('Something big is on the line. Watch it closely.'),300); }
  G.eatAt = G.forceEat ? (G.forceEat=false, .5) : (G.fish.kind==='fish' && !isPredator(G.fish.sp) && G.fish.sp.r<=2 && Math.random()<.05*pathMul('eat')) ? rnd(1.4,3.8) : null; /* 0.4.9: half as often (director: "slightly rarer") */
  if(G.fish.kind==='fish' && G.fish.shiny===2) setTimeout(()=>toast('It shimmers like nothing you have seen. It will fight every way a fish can.'),400);
  if(G.fish.kind==='fish' && G.fish.hy) setTimeout(()=>toast(G.fish.kg>(G.fish.sp.min+G.fish.sp.max)/2?'This feels far too heavy for what it looks like...':'Strangely light on the line...'),600);
  if(perfect){ G.sta=.8; G.ten=0; G.runT=rnd(.5,.9); /* 0.4.9 (director: "perfect hook needs fish inactivity time slightly reduced"): a smaller head start in stamina and a shorter first rest */ S.stats.perfect++; if(maxed('reflex')){ G.d*=.5; toast('Lightning hook! Halfway in already.'); } else toast('Perfect hook! The fish starts tired.'); tone(990,.1,'triangle',.07,0,.05); } }
function breakStreak(why){ const n=S.streak; if(!n){ if(why) toast(why); return; } const keep=maxed("streaker")?Math.floor(n/2):0; /* director 2026-11-18: a streak ends only when a fish that bit gets away; On a Roll maxed keeps half */ S.streak=keep; const msg=keep?"Fish lost: streak "+n+" halved to "+keep:"Streak of "+n+" ended"; if(why) toast(n>=3?why+' '+msg+'.':why); else if(n>=3) setTimeout(()=>toast(msg),1200); save(); } /* why: Cam's list #10 puts the reason into the streak message */ /* 0.3.6: saved at once, so a refresh can't bring a broken streak back */
function endFight(kind){
  if(kind==='caught'){ G.st='landing'; G.land={t:0, dur:.85, x0:G.bob.x, y0:G.bob.y}; splash(G.bob.x,G.bob.y,24); sfx.pull(); return; }
  if(kind==='baited'){ G.st='idle'; G.fish=null; G.inHot=false; sfx.lost(); if(S.baitSel!=='worm'&&(S.bait[S.baitSel]||0)>0&&!pathSave()){ S.bait[S.baitSel]--; if(!S.bait[S.baitSel]) toast(BAIT[S.baitSel].name+' used up. Back to worms.'); renderBait(); } if(!maxed('secondbite')) breakStreak('You waited too long, the fish got your bait!'); return; } /* Second Bite at full rank: a missed hotspot bite keeps the streak */ /* Cam's list #10: every try missed at a hotspot */
  G.st='idle'; G.fish=null; G.inHot=false; if(kind!=='nohook') breakStreak(); /* director 2026-11-18: a missed strike keeps the streak; only a hooked fish that gets away ends it */
  if(kind==='snap'){ S.stats.snapped++; sfx.snap(); toast((G.temper>1.6 ? 'Snap! Let go when it gets angry. ' : fishNew() ? 'Snap! Short pulls when it fights. ' : 'Snap! Ease off when it runs. ')+quip('snap')); checkFeats(); save(); }
  else if(kind==='nohook'){ sfx.lost(); toast('Missed a bite'); } /* a missed strike said "slipped off the hook" before */
  else { sfx.lost(); toast((kind==='spool' ? 'It took all your line. ' : kind==='escape' ? 'It swam off while you waited. ' : 'It slipped off the hook. ')+quip('lost')); }
}
function finishCatch(){ const f=G.fish; G.land=null; if(!f){ G.st='idle'; return; } if(V3ON) vib([30,40,70]);
  if(f.hot) S.stats.hot++; G.inHot=false;
  if(f.kind==='fish') landFish(); else if(f.kind==='hat') landHat(); else landJunk(); }
function landFish(){
  const f=G.fish, sp=f.sp; G.st='result'; G.fish=null; S.voyCatch=S.voyCatch||{}; S.voyCatch[sp.loc]=(S.voyCatch[sp.loc]||0)+1; /* [16] catches per water this voyage */ const titleNew = f.shiny===2 && f.pv && !(S.titled=S.titled||{})[sp.id+':'+f.pv]; if(titleNew) S.titled[sp.id+':'+f.pv]=1; /* [18] */
  const j=S.journal[sp.id]; const isNew=!j; const record = j && !f.hy && f.kg > j.best; const hyNew = f.hy && !(j&&j.hb!=null);
  journalAdd(f);
  S.streak++; S.stats.bestStreak=Math.max(S.stats.bestStreak,S.streak); const streakBonus = Math.min(streakCap(),.05*(S.streak-1));
  if(G.perfect && relic('goldhook')) f.value=Math.round(f.value*1.1);
  const xp = Math.round((5+Math.sqrt(f.value/(f.shiny?4:1))*3)*RAR[sp.r].xp*(f.shiny?2:1)*(1+streakBonus)*xpMult()*(weather().xp||1)*(relic('mentor')?1.25:1)*(spec('collector')&&isNew?3:1)*1);
  /* (Naturalist's Scales for new species moved: it is a mastery skill now, director 2026-11-23) */
  f.demand = demandSp().id===sp.id; if(f.demand) S.stats.demand++; f.streakBonus=streakBonus;
  { const ce=coolerEntry(f); S.cooler.push(ce); G.lastEntry=ce; } S.stats.caught++; if(f.shiny===2) S.stats.prism=(S.stats.prism||0)+1; if(f.hy) S.stats.hybrid=(S.stats.hybrid||0)+1;
  const preyB=[]; for(const p of (f.prey||[])){ journalAdd(p); S.stats.caught++; S.cooler.push(coolerEntry(p)); preyB.push(['k','Swallowed '+p.sp.name+' ('+kgStr(p.kg)+'): in your cooler'+(S.cooler.length>gv('cooler')?' (over its limit)':'')]); } /* C19 (director + Cam, 2026-11-20): fish a predator swallowed always go to the cooler, even past its limit */
  if(f.shiny) S.stats.shiny++; if(f.trophy) S.stats.trophies++; if(f.storm && sp.r>=3) S.stats.stormEpic++;
  const scl=Math.round(RAR[sp.r].sc*(f.shiny?3:1)*(f.trophy?(maxed('trophy')?3:1.5):1)*(relic('luckyscale')?1.2:1)); if(scl) S.scales+=scl;
  const tok = sp.r>=4 && Math.random()<(sp.r===5?1:.15) ? (sp.r===5?'big':'small') : null; if(tok) S.tokens[tok]++;
  taskProgress('catch',1,sp); if(sp.r>=2) taskProgress('rare',1,sp); if(f.hot) taskProgress('hot',1);
  addPassXP(PASS_XP[sp.r]*(f.shiny?2:1)*(f.trophy?1.5:1)); derbyCatch(f);
  const lvUps = addXP(xp); const bdone = checkBounties(sp, f.kg).concat(checkBounties2(f)); const setNow = checkSet(sp.loc);
  const b=[]; if(f.shiny===2){ b.push(['g',PRISM[f.pv].n+' prismatic ×'+PRISM_VALUE+' value']); const T=TITLE_BUFFS[f.pv]; if(T) b.push(['g','In your aquarium: +'+T.keys.map(k=>BK[k]).join(', +')+', and every other fish’s bonuses +'+Math.round(T.aura*100)+'%']); if(titleNew) b.push(['g','New title: +'+Math.round(TITLE_COIN*100)+'% coins on every voyage'+(titleLegacy()>=TITLE_COIN_CAP?' (at the +'+Math.round(TITLE_COIN_CAP*100)+'% cap)':'')]); } else if(f.shiny) b.push(['g','Shiny ×4 value']); if(f.hy) b.push(['g','Hybrid: the weight of a '+SPI[f.hy].name+(f.hx?' and still its own size: ×'+f.hx+' value and aquarium income':'')]); if(hyNew) b.push(['g','First hybrid of this fish']); b.push(...preyB); if(f.ate) b.push(['g','Swallowed your catch: ×1.5 coins']); if(f.trophy) b.push(['g','Trophy size ×1.5']); if(f.hot) b.push(['k','Hotspot catch']);
  if(f.demand) b.push(['g','Fishmonger wants it: ×2 if sold now']); if(G.perfect) b.push(['','Perfect hook']); if(S.streak>=2) b.push(['','Streak '+S.streak+' · +'+Math.round(streakBonus*100)+'% XP']);
  if(scl) b.push(['k','+'+scl+' Scales']); if(tok) b.push(['g','+1 '+(tok==='big'?'big':'small')+' Mystery Crate']);
  if(isNew) b.push(['','New species']); if(record) b.push(['g','Personal record']); const ae=G.lastEntry&&!G.lastEntry.hy&&aqEff(G.lastEntry); if(ae && isNew) b.push(['k','In the aquarium: '+fmtB(ae.k,ae.v)]);
  const ms=mastery(sp.id); if(ms && masteryT()[ms-1]===S.journal[sp.id].n) b.push(['g','Mastery '+'★'.repeat(ms)+': +'+Math.round(ms*masteryK()*100)+'% value for this fish']);
  const rk=checkRank(); if(rk) b.push(['g',rk]);
  if(lvUps) b.push(['g','Level up! Lv '+S.lvl+' · +'+lvUps+' skill point']); bdone.forEach(()=>b.push(['g','Bounty ready'])); if(setNow) b.push(['g',LOCS[locIdx(sp.loc)].name+' complete: +'+fmt(setNow)]);
  showCard({draw:c=>fishCanvas(c,sp,true,f.shiny,f.pv), shiny:!!f.shiny, rar:(f.shiny===2?PRISM[f.pv].n+' prismatic ':f.shiny?'Shiny ':'')+(f.hy?'hybrid ':'')+RAR[sp.r].k, rarCol:f.shiny===2?PRISM[f.pv].c:f.shiny?'var(--gold)':RAR[sp.r].c, name:sp.name,
    nums:[['Weight',kgStr(f.kg)],['Sells for',fmt(salePrice({id:sp.id,value:f.value})),1],['XP','+'+xp]], desc:sp.note, badges:b});
  f.shiny ? (sfx.catch(sp.r), sfx.shiny(), f.shiny===2&&setTimeout(()=>sfx.shiny(),350)) : sfx.catch(sp.r); checkFeats(); save(); refreshAll();
}
function landJunk(){
  const J=G.fish.item; G.st='result'; G.fish=null; const L=curLoc(), e=J.e, li=locIdx(S.loc); const base=oddBase(L,J)*rnd(.8,1.2); /* [2] based on your best water, more for repeat finds */ const b=[]; let coins=0, quote=J.q, found='—';
  const isNew=!S.junk[J.id]; S.junk[J.id]=(S.junk[J.id]||0)+1; S.stats.treasure++;
  if(e.c) coins += base*e.c;
  if(e.buff){ const [k,v,m]=e.buff; addBuff(k,v,m,J.name); b.push(['k','Boost: '+fmtB(k,v)+' for '+m+' min']); }
  if(e.lure){ const [k,n]=e.lure; S.bait[k]=(S.bait[k]||0)+n; found=n+' '+BAIT[k].name; b.push(['k','+'+n+' '+BAIT[k].name]); }
  if(e.pet){ if(!S.owned.pets.includes(e.pet)){ S.owned.pets.push(e.pet); found='A '+PETI[e.pet].name.toLowerCase(); b.push(['g','New pet: '+PETI[e.pet].name+'! See the Pets tab']); } else coins += base; }
  if(e.hat){ let h=e.hat; if(h==='random'){ const left=HATS.filter(x=>x.src!=='junk'&&x.src!=='start'&&!S.owned.hats.includes(x.id)); h=left.length?pick(left).id:null; }
    if(h && !S.owned.hats.includes(h)){ S.owned.hats.push(h); found=HATI[h].name; b.push(['g','New hat: '+HATI[h].name+'! See the Wardrobe']); } else coins += base; }
  if(e.rod){ if(!S.rods.owned.includes(e.rod)){ S.rods.owned.push(e.rod); found='A fishing rod'; b.push(['g','New rod: '+ROD_I[e.rod].name+'! See the Rods tab']); } else coins += base; }
  if(e.scales){ S.scales+=e.scales; b.push(['k','+'+e.scales+' Scales']); }
  taskProgress('junk',1);
  if(e.special==='lottery'){ const r=Math.random(); if(r<.05){ coins=base*30; quote='WE HAVE A WINNER! All six numbers! I need to sit down.'; b.push(['g','Jackpot ×30']); } else if(r<.3){ coins=base*3; quote='A small winner. Better than a boot!'; } else { coins=0; quote='Not a winner. Not even close. Keep it as a souvenir.'; } }
  if(e.special==='fortune'){ const fo=pick(FORTUNES); quote='The paper says: "'+fo[0]+'"'; addBuff(fo[1],fo[2],5,'Fortune: '+BK[fo[1]]); b.push(['k','Boost: '+fmtB(fo[1],fo[2])+' for 5 min']); }
  if(e.special==='chest'){ coins=base*3; const bk = li<=1?'cricket':li<=3?'glow':'chum'; const n=bk==='chum'?3:5; S.bait[bk]+=n; found=n+' '+BAIT[bk].name; b.push(['k','+'+n+' '+BAIT[bk].name]); }
  coins = coins>0 ? earn(coins*coinMult()*(maxed('scavenger')?1.5:1)*(relic('pockets')?1.25:1)) : 0; if(coins) b.unshift(['g','+'+fmt(coins)+' coins']); if(isNew) b.push(['','New oddity']);
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
  {id:'legall',name:'Keeper of legends',      d:'Land every Legendary',      p:()=>[nLeg(),SP.filter(s=>s.r===4).length], coins:2500000, pt:5},
  {id:'myth1', name:'Beyond legend',          d:'Land a fish rarer than Legendary', p:()=>[Object.keys(S.journal).filter(k=>SPI[k].r===5).length,1], coins:50000, pt:2, pet:'narwhal'},
  {id:'myth3', name:'Myth hunter',            d:'Land 3 different Mythic fish', p:()=>[Object.keys(S.journal).filter(k=>SPI[k].r===5).length,3], coins:500000, pt:3, rod:'spine'},
  {id:'mythall',name:'Keeper of myths',       d:'Land every Mythic fish',    p:()=>[Object.keys(S.journal).filter(k=>SPI[k].r===5).length,SP.filter(s=>s.r===5).length], coins:10000000, pt:6},
  {id:'rods4', name:'Rod rack',               d:'Own 4 rods',                p:()=>[S.rods.owned.length,4], coins:20000, pt:1},
  {id:'rod10', name:'Fine-tuned',             d:'Upgrade a rod to level 10', p:()=>[Math.max(0,...Object.values(S.rods.lvl)),10], coins:100000, pt:2},
  {id:'pet50', name:'Good boy, good girl',    d:'Pet your pets 50 times',    p:()=>[S.gstats.pets,50], coins:3000, pt:1},
  {id:'bond10',name:'Best friends',           d:'Reach bond level 10 with a pet', p:()=>[Math.max(0,...PETS.map(p=>bondLevel(p.id))),10], coins:50000, pt:2},
  {id:'tasks10',name:'Daily grind',           d:'Finish 10 daily tasks',     p:()=>[S.gstats.tasks,10], coins:20000, pt:1},
  {id:'tasks100',name:'Creature of habit',    d:'Finish 100 daily tasks',    p:()=>[S.gstats.tasks,100], coins:500000, pt:3},
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
  {id:'petsall',name:'Noah’s dock',           d:'Own all '+PETS.filter(p=>p.src!=='gift').length+' pets', p:()=>[S.owned.pets.filter(id=>PETI[id]&&PETI[id].src!=='gift').length,PETS.filter(p=>p.src!=='gift').length], coins:1500000, pt:3},
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
  {id:'frenzy100',name:'Fast fingers',        d:'Grab 100 frenzy fish',       p:()=>[S.gstats.frenzyFish,100], coins:20000, pt:1},
  {id:'star1', name:'Make a wish',            d:'Catch a falling star',      p:()=>[S.gstats.stars,1],    coins:2000, pt:1},
  {id:'crates10',name:'Crate expectations',   d:'Open 10 Mystery Crates',    p:()=>[S.gstats.crates,10],  coins:10000, pt:1},
  {id:'decor5',name:'Interior designer',      d:'Place 5 decorations in your aquarium', p:()=>[S.aq.decor.length,5], coins:8000, pt:1},
  {id:'derby1', name:'Derby day',             d:'Win a gold medal in a fishing derby', p:()=>[S.medals.gold,1], coins:20000, pt:1},
  {id:'derby10',name:'Derby champion',        d:'Win 10 gold medals',        p:()=>[S.medals.gold,10], coins:300000, pt:2},
  {id:'pass25',name:'Riding the tide',        d:'Reach Tide Pass level 25',  p:()=>[S.pass.lvl,25], coins:100000, pt:2},
  {id:'pass50',name:'Master of tides',        d:'Reach Tide Pass level 50',  p:()=>[S.pass.lvl,50], coins:1000000, pt:3},
  {id:'tide1', name:'Second voyage',          d:'Set sail again once',       p:()=>[S.tides,1],           coins:0, pt:2},
  {id:'tide3', name:'Old sea dog',            d:'Set sail again 3 times',    p:()=>[S.tides,3],           coins:0, pt:3},
];
function checkFeats(){ for(const f of FEATS){ if(S.feats[f.id]) continue; const [a,b]=f.p(); if(a>=b){ S.feats[f.id]=true; earn(f.coins); if(f.pt) S.bonusPts+=f.pt;
  let extra=''; if(f.pet && !S.owned.pets.includes(f.pet)){ S.owned.pets.push(f.pet); extra=', new pet: '+PETI[f.pet].name; }
  if(f.rod && !S.rods.owned.includes(f.rod)){ S.rods.owned.push(f.rod); extra+=', new rod: '+ROD_I[f.rod].name; }
  setTimeout(()=>{ toast('Feat: '+f.name+' (+'+fmt(f.coins)+' coins'+(f.pt?', +'+f.pt+' skill point'+(f.pt>1?'s':''):'')+extra+')'); sfx.coin(); }, 900); } } }

// ---------- aquarium ----------
const fishRate = f => aqFishBase(f)*(spec('curator')?1.25:1)*(1+.08*pr('keeper'))*(1+bonus('tank')+decorBonus())*coinMult();
const tankRate = () => S.tank.reduce((a,f)=>a+fishRate(f),0);
// each fish's coins per hour as whole numbers that add up exactly to the shown total (largest remainders get the spare coins)
function aqShownRates(){ const v=S.tank.map(f=>fishRate(f)*60), fl=v.map(Math.floor); let left=Math.floor(tankRate()*60)-fl.reduce((a,b)=>a+b,0); /* the same total the page shows (a sum of ×60 values could land across a whole number from it) */ v.map((x,i)=>[x-fl[i],i]).sort((a,b)=>b[0]-a[0]).forEach(([,i])=>{ if(left>0){ fl[i]++; left--; } }); return fl; }
function accrue(){ const now=Date.now(); if(!S.tankT){ S.tankT=now; return 0; } const mins=Math.min(offlineCap(),Math.max(0,(now-S.tankT)/60000)); const add=tankRate()*mins; S.tankBank+=add; S.tankT=now; return add; }
function offlineIncome(){ const add=accrue(); if(add>=1 && S.tank.length) setTimeout(()=>toast('While you were away your aquarium earned '+fmt(add)+' coins'),900); }

// ---------- input ----------
function down(e){
  if(G.star && starHit(e)) return;
  if(G.st!=='reeling' && G.st!=='frenzy' && G.st!=='charging' && G.st!=='result' && petHit(e)) return;
  // the dock side of the water never casts (or reels in early): a missed tap on your pet does nothing
  if(e && (G.st==='idle'||G.st==='waiting') && canvasXY(e).x < W*.2) return;
  switch(G.st){
    case 'frenzy': frenzyHit(e); break;
    case 'rest': toast('You are resting. Press the Rest button (bottom left of the water) to fish yourself.'); break;
    case 'idle': if(V3ON && aimCast(e)) break; startCharge(); break;
    case 'waiting': G.st='idle'; G.inHot=false; toast('Reeled in early'); break; /* director 2026-11-18: an early reel or an accidental cast is never punished */
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
function update(dt){ if(V3ON) padPoll(); if(G.st==='rest') restTick(dt);
  if(G.st==='charging'){ G.power+=G.pdir*dt*1.15; if(G.power>=1){G.power=1;G.pdir=-1;} if(G.power<=0){G.power=0;G.pdir=1;} }
  else if(G.st==='flying'){ G.t+=dt/.45; const t=Math.min(1,G.t); G.bob.x=G.from.x+(G.to.x-G.from.x)*t; G.bob.y=G.from.y+(G.to.y-G.from.y)*t - Math.sin(t*Math.PI)*H*.22; if(t>=1) beginWait(); }
  else if(G.st==='waiting'){ G.waitT+=dt; G.nibOn=Math.max(0,G.nibOn-dt);
    for(let i=G.nib.length-1;i>=0;i--) if(G.waitT>=G.nib[i]){ G.nib.splice(i,1); G.nibOn=.3; sfx.nibble(); }
    if(G.waitT>=G.biteAt){ G.pend=G.forced||chooseCatch(); G.forced=null; G.st='bite'; G.biteEnd=G.waitT+hookWin(); sfx.bite(); splash(G.bob.x,G.bob.y,12); if(V3ON) vib(45); } }
  else if(G.st==='bite'){ G.waitT+=dt; if(G.waitT>G.biteEnd){ G.pend=null; G.missN=(G.missN||0)+1; const tries=fishNew()?hookTries():5; /* Cam's list #10: one try per bite to start, more from skills */ if(G.missN>=tries&&fishNew()){ G.missN=0; if(G.inHot) endFight('baited'); else endFight('nohook'); } else if(G.missN<tries){ sfx.lost(); toast('Missed a bite'); G.st='waiting'; G.waitT=0; G.biteAt=rnd(1.4,4.6)/biteSpeed(G.inHot); G.nib=[]; G.nibOn=0; } else { G.missN=0; endFight('nohook'); } } } /* C3 (director + Cam, 2026-11-20): a missed bite keeps the line out; the 5th in a row reels in */
  else if(G.st==='reeling'){ fight(dt); }
  else if(G.st==='landing'){ G.land.t+=dt; if(G.land.t>=G.land.dur) finishCatch(); }
  for(let i=G.parts.length-1;i>=0;i--){ const p=G.parts[i]; p.t+=dt; p.x+=p.vx*dt; p.y+=p.vy*dt; p.vy+=420*dt; if(p.t>p.life) G.parts.splice(i,1); }
  if(weather().k==='Storm'&&wxAmt()>.6){ G.nextBolt-=dt; if(G.nextBolt<=0){ G.flash=1; G.nextBolt=rnd(6,16); setTimeout(()=>sfx.thunder(),400); } }
  G.flash=Math.max(0,G.flash-dt*2.5);
  // hotspots: ripples on the water where rare fish gather
  if(G.hot){ G.hot.t+=dt; if(G.hot.t>G.hot.life) G.hot=null; }
  else { G.hotNext-=dt*hotRate(); if(G.hotNext<=0){ G.hot=Object.assign({p:rnd(.2,.97), r:.065, t:0, life:rnd(14,22)*(1+.05*pr('reader'))*(maxed('reader')?2:1)}, hotTier()); G.hotNext=rnd(14,32); } }
  updateEvents(dt);
}
// 0.3.6 rare fights. A fish's will by rarity (common 0 ... mythic 1). Shinies that switch behaviour count as legendary.
const FIGHT_WILL=[0,0,.18,.38,.66,.88];
function fightWill(f){ if(!f||f.kind!=='fish'||!f.sp) return 0; return Math.max(FIGHT_WILL[Math.min(5,f.sp.r)]||0, f.shiny===2?.66:0); }
// 0.4.9 fight pass (director, 2026-11-19: "fish lose their fight altogether with good gear"; "a maxed mythic should still take
// 30 seconds to a minute with the best gear"; "new voyages increase how hard fish fight up to a certain level"). A fish's
// rank (rarity; prismatic shinies count as legendary) and the voyage now set how hard it holds and pulls RELATIVE to your reel,
// so better gear shortens a fight but never removes it. Voyages add 8% per voyage, up to 5 voyages (+40%).
const FIGHT_VOY_STEP=.08, FIGHT_VOY_CAP=5;
const fightVoy = () => 1 + FIGHT_VOY_STEP*Math.min(FIGHT_VOY_CAP, S.tides||0);
function fishRank(f){ return f&&f.kind==='fish'&&f.sp ? Math.max(Math.min(5,f.sp.r), f.shiny===2?4:0) : 0; }
// Angler strength (director, 2026-11-19: "simply add somewhere to see Angler strength and denote that stat in the Waters tab
// beside each area and where you sit in that area's range"): your Line, made stronger by skills that lower tension. A fish's
// strength is shown in the same unit; a fish stronger than you is "heavy" (close to your line's limit: let it run).
const fishPull = s => s.str*4/3;
const anglerStr = () => gv('line')/tensionMult()*(1+.02*boonR('strength')); /* C30: + the Strong Arms boon */
const strTxt = v => Math.round(wNum(v))+' '+wUnit();
function strStand(sps){ const ps=sps.map(fishPull), lo=Math.min(...ps), hi=Math.max(...ps), a=anglerStr(); return {lo, hi, a, beat:ps.filter(p=>p<=a).length, n:ps.length, pos:clamp((a-lo)/Math.max(1,hi-lo),0,1)}; }
function strStandHTML(sps){ const s=strStand(sps); return `<div class="meta strst" title="Angler strength comes from your Line (Tackle) and skills that lower tension. Fish stronger than you put up a fight: let them run, reel when they rest.">Fish ${Math.round(wNum(s.lo))}–${strTxt(s.hi)} <span class="strbar" aria-hidden="true"><i style="left:${(s.pos*100).toFixed(0)}%"></i></span> your line holds ${strTxt(s.a)}, enough for ${s.beat>=s.n?"all "+s.n:s.beat+" of "+s.n}</div>`; }
document.head.insertAdjacentHTML('beforeend','<style>.strst{white-space:normal;overflow-wrap:anywhere}.strst .strbar{white-space:nowrap}.strbar{display:inline-block;position:relative;width:56px;height:6px;border-radius:3px;margin:0 4px;vertical-align:middle;background:linear-gradient(90deg,#5ad8b0,#ffd36a,#ff7a5a)}.strbar i{position:absolute;top:-3px;width:4px;height:12px;margin-left:-2px;background:#fff;border-radius:2px;box-shadow:0 0 3px #000c}</style>');
// Legendary and mythic fish have a signature surge: halfway in (and again near the end for mythics) they make one long,
// heavy run with a burst of spray, then go still for a moment, then leap. Watching the fish beats it; holding loses it.
function surgeTick(dt,f){ if(G.surge){ G.surge.t+=dt; const s=G.surge;
    if(s.phase==='run'){ G.run=true; G.runT=Math.max(G.runT,.2); if(s.t>=s.dur){ s.phase='calm'; s.t=0; G.run=false; G.runT=1.6; } }
    else if(s.phase==='calm'){ G.run=false; G.runT=Math.max(G.runT,.3); if(s.t>=.95){ s.phase='done'; G.ev='jump'; G.evDur=1; G.evT=2.5; splash(G.bob.x,G.bob.y,22); sfx.jump(); if(V3ON) vib([40,30,80]); G.surge=null; } }
    return; }
  const frac=G.d/G.d0, n=G.surgeN||0, at=n===0?.62:.28, max=f.sp.r>=5||f.shiny===2?2:1;
  if(n<max && frac<at && G.fightT>1.2){ G.surgeN=n+1; G.surge={phase:'run',t:0,dur:rnd(1.8,2.4)*(maxed('grappler')?.7:1)}; G.run=true; G.ev=null; splash(G.bob.x,G.bob.y,26); sfx.warn(); setTimeout(()=>sfx.warn(),140); if(V3ON) vib([70,40,70]); } }
// 0.4.9 (director, 2026-11-19: "Oddities don't fight, they get snagged and by continuing to reel you risk breaking the line"):
// an oddity or hat comes in as dead weight. Now and then it catches on the bottom ("snag") and gains nothing; reeling without
// a pause builds tension until the line snaps, so short pulls bring it home.
function snagFight(dt){ const NF=fishNew(), reel=reelSpeed()*(NF?1.45*(1-.12*((G.fish&&G.fish.item&&G.fish.item.t)||0)):1) /* Cam: oddities come in faster; batch 1 (director): a touch slower than before (1.6x), and rarer finds slower still (treasure 36% slower than junk) */, rin=V3ON?reelInput(dt):(G.hold?1:0), rdt=dt*rin, odt=dt*(1-rin); const oddK=NF?1.3-.15*((G.fish&&G.fish.item&&G.fish.item.t)||1):1; /* Cam: rarer, heavier finds snag more often */ if(!G.fightT) G.evT=(NF?rnd(.7,1.4):rnd(2.2,3.6))*oddK; /* new fight: the first snag comes sooner, so holding stays a risk on a shorter reel-in */ G.fightT=(G.fightT||0)+dt; G.run=false;
  if(G.ev==='snag'){ G.evDur-=dt; if(G.evDur<=0){ G.ev=null; G.evT=rnd(1.6,3.4)*oddK; } } else { G.ev=null; G.evT-=dt; if(G.evT<=0){ G.ev='snag'; G.evDur=rnd(.6,1.2)*(maxed('snagwise')?.5:1); sfx.warn(); } }
  if(rin>0){ if(G.ev!=='snag') G.d -= reel*.6*rdt; G.strain=(G.strain||0)+rdt; G.ten += (G.ev==='snag'?(NF?110:70):(12+4*G.strain)*(NF?1.6:1))*tensionMult()*(1-rodBonus('snag'))*(1-.08*pr('snagwise'))*pathMul('snag')*rdt; /* [14] Snag Guard, [15] Snag Sense */ G.tickT-=rdt; if(G.tickT<=0){ G.tickT=.07; sfx.tick(); } }
  if(rin<1){ G.ten=Math.max(0,G.ten-60*odt); G.strain=Math.max(0,(G.strain||0)-2*odt); }
  if(G.ten>75 && rin>0){ G.warnT-=dt; if(G.warnT<=0){ G.warnT=.25; sfx.warn(); if(V3ON) vib(15); } }
  const frac=clamp(G.d/G.d0,0,1.6), x0=W*.24, x1=castX(G.lastCast); G.bob.x = x0+(x1-x0)*Math.min(frac,1.25)+(G.ev==='snag'?Math.sin(performance.now()/40)*1.5:0); G.bob.y=waterY(G.bob.x);
  if(G.ten>=100){ G.strain=0; endFight('snap'); } else if(G.d<=0){ G.strain=0; endFight('caught'); } }
// batch 6 (director, 2026-11-19: "you can just hold down reel and never fail ... make fish harder to catch"): seconds of reeling a maxed
// angler needs to tire a fish of each rarity (C U R E L M); weaker anglers take longer (Angler strength vs the fish's pull), stronger a bit less.
const FIGHT_T=[2.6,4.2,7,11,18,30], FIGHT_LANDK=.75, FIGHT_TEN_FLOOR=.62, JUMP_WINDUP=.7, EAT_RUN_M=[25,29,33,37,41,45], EAT_RUN_MAX=50, EAT_STRIP_T=3, EAT_STRIP_TEN=30, RUN_REEL_TEN=1.15, RUN_LINE_KG=2.27, SW_SLOW=1.5, SW_SLOWK=.5, SW_HOT=2.2, SW_HOLD=1.2, SW_GAIN=.25; /* Feel calls: C24 above temper SW_SLOW a fish tires at SW_SLOWK speed; temper held above SW_HOT for SW_HOLD s may give a tiring fish (under 70%) a second wind of +SW_GAIN strength (15% common/uncommon, 30% rarer; at most rank+1 times); C23 reeling into a run builds tension this much faster, and only fish over this weight (5 lb) take line when you let go; C21 the wind-up before a jump (s); C22 a swallowing predator takes this share of the line left by rank (common .. mythic; only mythics take it all), over EAT_STRIP_T seconds, and reeling against it adds EAT_STRIP_TEN tension a second */
function fightTireT(f,rk,V){ const pr2=clamp(Math.pow(anglerStr()/Math.max(.1,fishPull(f)),.5),.45,1.3); return FIGHT_T[clamp(rk|0,0,5)]*(1+.5*(V-1))/pr2; }
function fight(dt){ if(fishNew()){ fightNew(dt); return; } /* Cam's fight feel (c2_fightfeel.js); below is the old fight, kept for the test builds' New / Old switch */
  if(!G.fish){ G.st='idle'; return; } /* nothing on the line: never crash the frame loop */
  if(G.fish.kind!=='fish'){ snagFight(dt); return; }
  maybeEatEvent(dt); eatTick(dt);
  if(G.fish.shiny===2){ G.behT=(G.behT||0)-dt; if(G.behT<=0){ G.behT=rnd(2.2,3.6); const ks=Object.keys(BEH); G.fish.beh=ks[Math.floor(Math.random()*ks.length)]; } }
  const f=G.fish, B=BEH[f.beh]||BEH.calm, line=gv('line'), reel=reelSpeed(); const ratio=clamp(f.str/line,.05,4);
  // 0.3.6: a fish's will grows with its rarity, whatever your gear (commons are unchanged): longer runs, shorter rests,
  // slower to tire, and reeling into a rare fish's run strains the line on its own
  const RK=fightWill(f), rk=fishRank(f), V=fightVoy(), fatAt=12+4*rk; /* a rarer fish tires later: mythics keep their runs ~30 s */
  if(RK>=.15) surgeTick(dt,f); /* batch 6: rare and epic fish surge too (they used to be safe to hold) */
  G.runT-=dt; if(G.runT<=0){ G.run=!G.run; G.runT = G.run ? rnd(.4,1.1)*(.6+f.th)*B.runMul*(.5+.5*G.sta)*(1+.45*RK)*(G.fightT>fatAt+2?Math.max(.3,1-(G.fightT-fatAt-2)/12):1) : rnd(.5,1.7)*(1.3-f.th)*B.restMul/(.4+.6*G.sta)*(1-.3*RK); if(G.run){ splash(G.bob.x,G.bob.y,6+RK*6); G.ev=null; } }
  if(!G.run && (B.shake||B.jump) && !G.ev){ G.evT-=dt; if(G.evT<=0){ G.ev=B.jump?'windup':'shake'; G.evDur=B.jump?JUMP_WINDUP:.5; G.evT=rnd(1.3,3)/(.5+f.aggr)*(.6+.4/(.3+G.sta)); if(!B.jump) sfx.warn(); } } /* C21: a jump starts with a wind-up (the shadow sinks, then rushes up) as the warning */
  if(G.ev){ G.evDur-=dt; if(G.evDur<=0){ if(G.ev==='windup'){ G.ev='jump'; G.evDur=.85; splash(G.bob.x,G.bob.y,14); sfx.jump(); } else { if(G.ev==='jump') splash(G.bob.x-30,G.bob.y,18); G.ev=null; } } } /* the jump lands a little ahead of where it left (it travels toward its nose) */
  const tired=.45+.55*G.sta, steady=tensionMult(); G.fightT=(G.fightT||0)+dt;
  const reelK=(spec('brawler')?1.2:1)*(maxed('strong')&&G.fightT<2?2:1);
  // how hard you are reeling right now: 1 = holding; since 0.3 also a crank or a partly pulled trigger (0..1)
  const rin = V3ON ? reelInput(dt) : (G.hold?1:0), rdt=dt*rin, odt=dt*(1-rin);
  if(rin>0){
    // 0.3.2: while the fish runs, reeling only holds the line (none is gained) and strains it much harder
    /* 0.4.9: a fish holds against your reel by rank and voyage, relative to your reel speed: a fresh rare fish keeps you still
       during a run and a fresh legendary or mythic takes line even while you reel; between runs a fresh rare fish slows you */
    const grip=(1-rodBonus('grip'))*(1-.04*pr('grappler')); /* [14] Fighter's Grip, [15] Grappler */ const hold = G.run ? .35-(.1+.09*rk)*Math.sqrt(V)*(.4+.6*G.sta)*grip : 1-.06*rk*Math.sqrt(V)*G.sta*grip;
    G.d -= reel*reelK*rdt*(B.drag?.75:1)*(G.run?Math.max(0,hold):hold); G.d = Math.max(G.d, G.d0*FIGHT_LANDK*Math.pow(G.sta,.85)); /* C23: while you keep reeling, a running fish takes no line (it strains the line harder instead, below) */ /* 0.4.9 batch 6: a fresh fish can't be dragged in: tire it out first */
    const rr = G.run ? Math.max(ratio, (.2+.12*rk)*V) : ratio; /* reeling into a rare fish's run strains any line, however strong */
    let add = (G.run?95*rr*RUN_REEL_TEN:22*ratio)*tired*(B.heavy?1.35:1);
    G.temper = Math.min(3, G.temper + rdt*(.3+f.aggr*.9)*tempMult());
    add += 36*G.temper*G.temper*(.4+f.aggr)*Math.pow(ratio,.3)*(.35+.65*G.sta);
    const evK=spec('acrobat')?.5:1; if(G.ev==='jump') add += 170*evK; else if(G.ev==='shake') add += (110*Math.pow(ratio,.25)+30)*evK;
    if(G.run) add += 52*RK*Math.min(1,.45+ratio)*(G.surge?2.2:1)*(.4+.6*G.sta); /* rare runs strain any line */
    G.ten += add*Math.max(G.run||(G.ev&&G.ev!=='windup')?FIGHT_TEN_FLOOR+(rk>=2?.1:0):.35, steady)*rdt; /* batch 6: tension cuts never cancel the strain of reeling into a run or a jump */
    G.sta = Math.max(0, G.sta - rdt*(G.run?1.5:1)*(B.heavy?.8:1)*(G.temper>SW_SLOW?SW_SLOWK:1)/fightTireT(f,rk,V)); /* C24: a fish with its temper up tires more slowly */ /* batch 6: tiring time by rarity, faster with Angler strength, never instant */ /* 0.4.9: rarer fish and later voyages tire slower */
    G.tickT-=rdt; if(G.tickT<=0){ G.tickT=.07; sfx.tick(); }
  }
  if(rin<1){
    G.temper = Math.max(0, G.temper - odt*1.8*(maxed('softtouch')?2:1));
    G.ten = Math.max(0, G.ten - 55*odt);
    // a running fish takes line back: rarer and fresher fish pull harder, relative to how fast you can reel, so strong
    // gear shortens fights without ever making a big fish trivial
    /* C23 (Cam, 2026-11-20): letting go of a running fish drops the tension at once, and only a fish over 5 lb takes line */
    if(G.run) G.ten*=rin;
    if(G.run&&(f.kg||0)>RUN_LINE_KG){ const r=f.kind==="fish"&&f.sp?Math.min(5,f.sp.r):1, fat=G.fightT>fatAt?Math.min(1,(G.fightT-fatAt)/10):0; G.d += Math.max(1.5 + f.str*.14, reel*(.24+.08*r)) * (.35+.65*G.sta) * (1-.65*fat) * odt; } /* 0.3.6: a long fight tires the fish, so it builds to a finish */
    if(B.drag && !G.run) G.d += (.4 + f.str*.04) * (.3+.7*G.sta) * (G.fightT>fatAt?Math.max(.3,1-(G.fightT-fatAt)/10):1) * odt;
    G.sta = G.run ? Math.max(0, G.sta - .35*odt*(G.temper>SW_SLOW?SW_SLOWK:1)/fightTireT(f,rk,V)) : Math.min(1, G.sta + .12*odt/fightTireT(f,rk,V)); /* batch 6: a fish tires running against no reel, and gets its breath back while you wait */
  }
  if(G.run && rin<.5) G.ten = Math.max(G.ten, 6);
  /* C24 (Cam, 2026-11-20): second wind. Temper kept very high for a moment may give a tiring fish some strength back, a limited number of
     times by rarity (common once, uncommon twice, ...); "Second wind!" shows briefly in the fight message */
  if(f.kind==='fish'){ if(G.temper>SW_HOT){ G.hotT=(G.hotT||0)+dt; if(G.hotT>=SW_HOLD&&!G.hotRolled){ G.hotRolled=true; if((G.swN||0)<rk+1&&G.sta<.7&&Math.random()<(rk<=1?.15:.3)){ G.swN=(G.swN||0)+1; G.sta=Math.min(1,G.sta+SW_GAIN); G.swT=1.4; sfx.warn(); if(V3ON) vib([30,30,30]); } } } else { G.hotT=0; G.hotRolled=false; } if(G.swT) G.swT=Math.max(0,G.swT-dt); }
  if(G.ten>75 && rin>0){ G.warnT-=dt; if(G.warnT<=0){ G.warnT=.25; sfx.warn(); if(V3ON) vib(15); } }
  /* C22 (Cam, 2026-11-20): a predator that swallowed your catch takes line out steadily for a few seconds; reeling cannot stop it (it only
     strains the line, which can break), and it never takes more than its rank allows (all of it only for mythics) */
  if(G.strip){ const P=G.strip; P.t+=dt; const k=Math.min(1,P.t/P.dur), e=1-Math.pow(1-k,2); G.d=Math.max(G.d, P.from+(P.to-P.from)*e); G.run=true; G.runT=Math.max(G.runT,.2); if(rin>0) G.ten+=EAT_STRIP_TEN*rin*dt*tensionMult(); if(k>=1) G.strip=null; }
  const frac = clamp(G.d/G.d0,0,1.6); const x0=W*.24, x1=castX(G.lastCast);
  G.bob.x = x0 + (x1-x0)*Math.min(frac,1.25) + (G.run ? Math.sin(performance.now()/90)*3 : 0) + (G.ev==='shake'?Math.sin(performance.now()/30)*3:0); G.bob.x = clamp(G.bob.x,W*.2,W*.93); G.bob.y = waterY(G.bob.x); /* never off screen */
  if(G.ten>=100 && maxed('steady') && !G.saved){ G.saved=true; G.ten=65; G.hold=false; toast('Second wind! Your line held.'); tone(700,.15,'triangle',.07); }
  if(G.ten>=100) endFight('snap'); else if(G.d>=G.maxOut) endFight('spool'); else if(G.d<=0) endFight('caught');
}
