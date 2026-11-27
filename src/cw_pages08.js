// =====================================================================
// Pages first built for phones, shared since PC Reborn (director, 2026-11-21: "implement anything missing on pc that mobile has"):
// Quests, Prestige, Bait and Oddities. Each platform lays them out its own way (mobile/pages08.js, pc/pages_pc.js); the pages, their
// parts and their buttons are written once here. Wording is per device at the source (PLAT.touch(), onPC()).
// =====================================================================
const onPC = () => window.DL_BUILD==='pc';
/* the live event as a goal (a Live chip on phones, the goal chip on PC, the Live line in Quests); null when nothing is on */
function liveNow(){ try{ if(!(S.chal||(typeof liveScheds==='function'&&liveScheds().length))) return null; const gl=nextGoal(); return gl&&gl.live?gl:null; }catch(e){ oops('cw_pages08:liveNow-goal',e); return null; } } /* where things live differs: PC has one header row, phones a top bar and a side panel */
/* QUESTS (moved from mobile/quests08.js) */
  try{ PAGE_DESC.quests='Your goals, short lessons, where to find everything, and help'; }catch(e){ oops('cw_pages08:PAGE_DESC.quests',e); }
  try{ SEARCH_IDX.unshift(['Quests: goals','quests','Goals','goal next objective quest what to do journey'],['Quests: learn','quests','Learn','tutorial lesson how to learn guide help basics'],['Quests: find anything','quests','Find','where find directions map menu'],['Quests: help','quests','Help','help faq question problem stuck']); }catch(e){ oops('cw_pages08:SEARCH_IDX.unshift',e); }
const Q8={ goal:()=>{ try{ return _nextGoal_036(); }catch(e){ try{ return nextGoal(); }catch(e2){ oops('cw_pages08:goal',e2); return {t:'Catch a fish',sub:'',p:null,tab:null}; } } },
  read:()=>{ const s=S.settings; if(!Array.isArray(s.q8read)) s.q8read=[]; return s.q8read; } };
/* the lessons: [id, group, title, one line, body, go] (go = [tab, section] for Take me there) */
const Q8_LESSONS=[
 ['cast','Fishing basics','Casting','Where your line lands matters','Tap the water where you want your line to land. A <b>far cast</b> reaches better fish, and the cast line says so while you aim. If you prefer a power meter, switch the cast style in Settings, Controls.',['settings','Controls']],
 ['bite','Fishing basics','Bites and the hook','Wait for the splash, then tap','Watch the bobber. Small twitches are only nibbles: <b>wait for the big splash</b>, then tap to set the hook. Miss the moment and the fish swims off; <b>Quick Reflexes</b> and <b>Second Bite</b> give you extra tries. Miss every try at a hotspot and the fish takes your bait and your streak. The <b>Hook</b> upgrade in Tackle gives you a longer window.',['shop',['tackleview','gear']]],
 ['reel','Fishing basics','Reeling and the line','Hold to reel, read the warnings','<b>Hold</b> to reel, or draw circles to crank. Read the warnings: <b>It’s about to run!</b> and <b>Watch out…</b> mean reel in <b>short pulls</b> through the run or head shake; <b>Careful…</b> means it will jump away, so let go; <b>Get ready…</b> means it will jump toward you, so reel. In deep water a fish can <b>dive</b>: keep the ring inside the pink band (in shallower water divers dive briefly). A fish stronger than your <b>Line</b> fights twice as long and pulls harder. The ring is your line: green is safe, yellow means careful, red means it is about to snap. When its Fight runs out the fish is <b>tired</b> and comes in fast, but rarer fish can get a <b>Second wind</b> and fight again. A tired fish much stronger than your tackle still comes in slowly, so build up your <b>Line</b> before chasing the giants. Stop reeling for 10 seconds and the fish swims off; let it take all your line and it is gone. <b>Line</b> upgrades take more strain, <b>Reel</b> upgrades wind faster, and the Deep Spool attachment gives more line.',['shop',['tackleview','gear']]],
 ['rest','Fishing basics','Rest mode','Fish slowly while you do other things','<b>Rest</b> (bottom left of the water) sits your angler down to fish by themselves while the game is open, even while you browse the menus. A bite comes every few minutes and the fish goes straight into your cooler. You cannot fish yourself while resting, and the cooler needs room.',null],
 ['bait','Better catches','Bait','Better bait, rarer fish','Better bait brings rarer fish. One bait is used each time you set the hook; <b>Worms never run out</b>. Tap <b>Bait</b> in the top bar: <b>Switch</b> shows every bait and lure you own, one tap to use it; <b>Buy bait</b> sells more.',['bait','Switch']],
 ['weather','Better catches','Weather and time of day','Every weather changes the odds','The chip on the water shows the time, the weather and how long it lasts. <b>Rain</b>: bites +35%. <b>Storm</b>: rarer fish. <b>Fog</b>: night fish by day. <b>Gilded</b>: shiny ×3. <b>Rainbow</b>: shiny ×2 and XP +30%. <b>Aurora</b>: XP ×2. <b>Spawning Run</b>: bites ×2.5. Some fish only bite by day, others only at night. The forecast is in Events.',['events',null]],
 ['hot','Better catches','Hotspots','Ripples mean rarer fish','A <b>hotspot</b> ripples on the water now and then: cast right into it for rarer fish. The <b>Fish Finder</b> upgrade finds more hotspots and tells you more about a bite before you strike.',['shop',['tackleview','gear']]],
 ['shiny','Better catches','Shiny and prismatic fish','Rare colors worth far more','A <b>shiny</b> fish (✦) is a rare color of a species and worth much more; <b>prismatic</b> (✦✦) is rarer still. Gilded and Rainbow weather raise the chance. Sell all leaves shinies alone unless you switch on Shinies in the Cooler.',['cooler',null]],
 ['lures','Better catches','Special lures','Lures for junk and treasure','Special lures change what bites: some pull up junk and treasure instead of fish. You cannot buy them: they come out of junk you fish up. They are on the Bait page (top bar), Special lures.',['bait','Special lures']],
 ['cooler','Your fish','The Cooler','Where every catch goes','Every fish you land goes into the <b>Cooler</b> (top bar). Sell one, <b>Sell all</b> with a filter (rarity, a max price, shinies), put one on display in the Aquarium, or Keep it in the Trophy Room. When the cooler is full you cannot fish until you make room. The <b>Cooler</b> upgrade in Tackle adds space.',['cooler',null]],
 ['monger','Your fish','The fishmonger','Double pay for one species','The fishmonger wants one species at a time and <b>pays double</b> for it until the weather changes. Their wish is at the top of the Cooler.',['cooler',null]],
 ['aquarium','Aquarium','Getting around the Aquarium','Where everything is','Tap <b>Aquarium</b> in the top bar. You see your tank, what you <b>earn</b> per hour, the coins <b>ready</b> to collect and how full the tank is, with <b>Collect</b> and <b>Feed fish</b>. Its tabs are <b>Your tank</b> (fish, boosts, a bigger tank) and <b>Decorate</b>.',['aquarium',null]],
 ['aq-add','Aquarium','Putting fish on display','From the Cooler to the tank','In the <b>Cooler</b>, every fish shows what it would earn per hour in the tank: tap <b>To aquarium</b> on the ones worth keeping. You can also add them from Aquarium, Your tank, Add from your Cooler. Each fish rolls its own boost when caught; heavier fish give more, shiny fish double. Tap <b>Inspect</b> on any fish in the Cooler or the Aquarium to see its full card, and <b>Sort</b> either list by rarity, value or species.',['cooler',null]],
 ['aq-earn','Aquarium','Earning and collecting','Visitors pay while you are away','Fish on display earn coins from visitors even while you are away, for <b>up to 8 hours</b>, so collect before long breaks. The Aquarium chip in the top bar turns <b>gold</b> when coins are waiting. <b>Feed fish</b> gives +25% aquarium income for 30 minutes, once an hour.',['aquarium',null]],
 ['aq-nib','Aquarium','Nibbles','Treats that grow your fish','Scrap fish in the Cooler for <b>Nibbles</b> of their rarity; some bounties give Nibbles too. Your Nibbles of each rarity show above your fish in the Aquarium, with how many to feed at once (<b>1x to 100x</b>). Each Nibble raises that fish’s income, and every 10 its bonuses grow stronger or it gains a new one. Half your Nibbles expire when you set sail.',['aquarium','Your tank']],
 ['aq-boost','Aquarium','Boosts','Every fish on display helps you fish','Each fish on display adds a boost (bite speed, rare odds, line tension, sale price and more) and <b>boosts stack</b>. Your tank lists them under Boosts. Usually a boost fits the fish’s rarity; now and then one rolls much better.',['aquarium','Your tank']],
 ['aq-room','Aquarium','A bigger tank and decorations','More room, more boosts','On Your tank, <b>Expand Tank</b> shows its price, with how many fish the next expansion holds under it. <b>Decorate</b> places decorations in the tank: drag one along the sand to move it. <b>Advice:</b> fill every spot before buying more room, and swap in better fish as you catch them.',['aquarium','Your tank']],
 ['trophy','Your fish','The Trophy Room','Keep a fish forever','<b>Keep</b> mounts a fish in the Trophy Room for good: it earns nothing and gives no boost, but it is never lost, not even when you set sail again.',['trophy',null]],
 ['log','Your fish','The Fish Log and mastery','Every species, and stars for each','The <b>Fish Log</b> (top bar) lists every species at every water. Catch a species 3, 10, 30 and 100 times for its <b>mastery stars</b>: each star adds +10% to that fish’s value, and every 8 stars is a new Angler Rank with coins and a free Mystery Crate.',['journal',null]],
 ['odd','Your fish','Oddities','Junk, odd finds and treasure','Not everything that bites is a fish. Junk, odd junk and rare finds go in <b>Oddities</b> (Collection), with <b>Treasures</b> in their own tab beside them: some pay, some boost your fishing, some come with a pet or a hat. Special lures (Bait, in the top bar) pull up more of them. Hooked oddities don’t fight back: reel steadily, and <b>ease off</b> when one snags.',['oddities',null]],
 ['waters','Getting stronger','New waters','How to open the next water','Each water has 52 fish of its own and is tougher than the last. Catch <b>10 fish</b> at a water (10 more each voyage, up to 50) and you can open the next one with coins on the Map. Your goal (Quests) always says how close you are. The last waters, past Hollow Trench, open by voyages instead: the first after your first voyage, one more after each voyage after that.',['map',null]],
 ['tackle','Getting stronger','Tackle upgrades','Rod length, reel, line, hook, cooler, finder','In Tackle, Gear: <b>Rod length</b> gives better rare odds, <b>Reel</b> winds faster, <b>Line</b> takes more tension, <b>Hook</b> gives a longer window, <b>Cooler</b> holds more fish and the <b>Fish Finder</b> reads bites and finds hotspots.',['shop',['tackleview','gear']]],
 ['rods','Getting stronger','Rods, Scales and attachments','Collect rods, upgrade them, fit parts','Your rod shapes every cast. Collect rods in the Rod rack, upgrade them with coins and <b>Scales</b> (Scales come from Rare and better fish) and fit <b>attachments</b>: each has five tiers and fits any rod once you own it. Save a rod and its parts as a <b>preset</b> to switch in one tap.',['rods','Your rods']],
 ['skills','Getting stronger','Skills','Small steady gains with a big finish','Levels give <b>skill points</b>. Skills are small steady gains in five groups, and every skill unlocks a <b>special effect</b> when fully learned. The XP bar next to your level shows how close the next point is. Skills can be reset for coins. When you set sail, your level starts again at 1 and your skills are handed back; the points from feats and the Fish Log stay.',['skills',null]],
 ['paths','Getting stronger','Paths','One big specialty per tier','Paths are big specialties: forks open from level 5 to 75, you pick one specialty per fork, and each ranks up from I to V as you fish with it. A chosen Path stays through voyages and works again once you reach its level.',['paths',null]],
 ['tasks','Things to do','Daily tasks and weekly quests','Fresh goals every day and week','<b>Tasks</b> (top bar) has three daily tasks (finish all three for a bonus crate; your login streak counts too) and four weekly quests (finish all four for a big Mystery Crate). A number on Tasks means a reward is ready.',['bounties','Daily tasks']],
 ['bounties','Things to do','Bounties','The harbourmaster pays extra','The harbourmaster pays extra for specific catches. Every water has its own board, and its bounties wait there until you finish them. Fish still go in your cooler. Most bounties add a bonus: bait, Scales, Tide Pass XP, Nibbles or a Mystery Crate. Swap a bounty you do not want for a few coins.',['bounties','Bounties']],
 ['events','Things to do','Events','Derbies, frenzies and the forecast','Events bring derbies, frenzies and special weather. When one is on, <b>Live</b> shows in the top bar. In a frenzy, tap the leaping fish.',['events',null]],
 ['feats','Things to do','Feats','Achievements that pay','Feats are achievements for things you do as you play. Each pays coins and a Mystery Crate; some also give a skill point (and a big crate).',['feats',null]],
 ['pass','Things to do','Tide Pass','Levels with rewards','The Tide Pass levels up as you play and each level has a reward to claim. It lives under Challenges.',['pass',null]],
 ['boardwalk','Things to do','The Boardwalk','Games, tickets and prizes','On the old pier: a free <b>Lucky wheel</b> spin every hour (up to 3 saved), plus scratch cards, the duck pond and higher-or-lower. Games pay tickets and prizes, and the Prize counter trades tickets for things you cannot get anywhere else. Open your <b>Mystery crates</b> here: they are not sold for coins; earn them from feats, bounties, tasks and the Tide Pass.',['games',['bwview','games']]],
 ['pets','Pets and style','Pets','Company on the water','Pets keep you company on the water. Find more in Pets, then name and dress them up.',['pets','Your pets']],
 ['style','Pets and style','Wardrobe','Dress your angler','Change your angler’s body, clothes, hats, glasses, shoes and more in the Wardrobe. Tap anything to try it on first.',['style',null]],
 ['sail','Prestige','Set sail again','Start over, stronger every time','Once you reach <b>Hollow Trench</b> you can start over from Willow Pond for <b>Wisdom Pearls</b>: spend them in the Pearl shop (+1% coins or +1% XP a level) or on relics. You also earn Boon points to upgrade lasting voyage Boons, your Legacy grows with every voyage, and 32 milestones up to voyage 100 unlock perks. Your level goes back to 1 and your skills are handed back; you keep the skill points from feats and the Fish Log, your Paths, Fish Log, feats, Trophy Room, pets and clothes.',['prestige','Set sail again']],
 ['relics','Prestige','Pearl relics','Trade pearls for lasting bonuses','Spend Wisdom Pearls on permanent relics. Each relic is bought once and kept forever; the strongest cost the most pearls.',['prestige','Pearl relics']],
 ['save','Settings and saves','Your save on another device','Move your progress','Save, Save codes gives you a code that carries your progress to another phone or a computer. Settings belong to each device.',['save',null]],
];
/* where everything lives on a phone: [place, label, tab, section] */
/* each device's own words, written once: Tap or Click; PC has one header row where phones have a top bar and a side panel */
const q8dev = s => { if(typeof s!=='string') return s; const T=PLAT.touch(); s=s.replace(/\bTap\b/g,T?'Tap':'Click').replace(/\btap\b/g,T?'tap':'click'); if(onPC()) s=s.replace(/top bar/g,'header').replace(/side panel/gi,'header').replace(/the ring around (it|the fish)/g,'the line bar').replace(/keep the ring inside/g,'keep the line inside').replace(/The ring is your line/g,'The line bar shows the strain'); return s; };
const Q8_FIND=()=>{ const TB=onPC()?'Header':'Top bar', SPN=onPC()?'Header · ':'Side panel · ', out=[], lbl=t=>{ try{ return menuTabLabel(t)[1]; }catch(e){ oops('cw_pages08:find-label',e); return t; } };
  out.push([TB,'Cooler','cooler',null],[TB,'Aquarium','aquarium',null],[TB,'Fish Log','journal',null],[TB,'Bait: switch, buy, special lures','bait',null],[TB,'Tasks (daily, weekly, bounties)','bounties',null],[(onPC()?'Header · settings button':'Top bar · settings button'),'Settings','settings',null],[(onPC()?'Header · settings button':'Top bar · settings button'),'Save and save codes','save',null]);
  for(const s of MENU_SECS){ if(s.id==='quests') continue; for(const t of s.tabs) out.push([SPN+s.short,lbl(t),t,null]); }
  out.push([SPN+'Prestige','Set sail again','prestige','Set sail again'],[SPN+'Prestige','Pearl relics','prestige','Pearl relics']);
  return out; };
const Q8_HELP=[
 ['My line keeps snapping','Reel in short pulls while the fish runs or shakes its head, let go when it jumps away, and watch the ring around it: red means let go now. A fish stronger than your <b>Line</b> pulls harder, so a stronger Line in Tackle helps.',['shop',['tackleview','gear']],'Tackle'],
 ['How do I catch rarer fish?','Better bait, far casts, hotspots, Storm weather and the rare-odds skills all help. Your Wisdom Pearls raise rare odds too.',['bait','Buy bait'],'Bait'],
 ['My cooler is full','Open the Cooler and Sell all (with a filter if you want to keep some), put fish in the Aquarium, or Keep the best ones in the Trophy Room. A bigger Cooler is in Tackle.',['cooler',null],'Cooler'],
 ['How do I earn more coins?','Sell bigger and rarer fish, fill the fishmonger’s wish (double pay), keep the Aquarium full, finish bounties and tasks, and raise your sale bonus with skills and mastery stars.',['bounties','Bounties'],'Bounties'],
 ['Where do Scales come from?','Rare and better fish. You spend them on rod upgrades.',['rods','Your rods'],'Rods'],
 ['What are Fish Nibbles?','Scrap a fish in the Cooler (next to Sell) for Nibbles of its rarity: always for common fish, less often for rarer ones, more for shiny, hybrid and titled fish. Feed them to any fish of the same rarity in your Aquarium: it earns more, and every 10 Nibbles its bonuses grow. Half of your Nibbles expire when you set sail again.',['cooler',null]],
 ['How do I open the next water?','Catch 10 fish at the water before it this voyage (10 more each voyage, up to 50), then pay its price on the Map. Your goal shows both.',['map',null],'Map'],
 ['What do I keep when I set sail again?','Your Fish Log, feats, Paths, Trophy Room, pets, clothes, relics, Boons and Wisdom Pearls, and the skill points from feats and the Fish Log. Your level starts again at 1 and your skills are handed back. Coins, tackle, bait, cooler fish, bounties and waters reset; aquarium fish are mounted in the Trophy Room.',['prestige','Set sail again'],'Prestige'],
 ['Where did my aquarium coins go?','Visitors pay for up to 8 hours while you are away, then stop until you collect. Collect from the strip under the tank (the Aquarium chip turns gold when coins wait).',['aquarium',null],'Aquarium'],
 ['How do I move a decoration?','In the Aquarium, drag it along the sand.',['aquarium','Decorate'],'Aquarium'],
 ['How do I get a bigger XP bonus?','Keep a long catch streak, fish in Aurora or Rainbow weather, and once you set sail, take the Wisdom Boon, the Old Mentor relic and XP levels in the Pearl shop.',['prestige',null],'Prestige'],
 ['How do I see all my bonuses?','Stats shows your level, bite speed, sale price and every bonus, worked out the way the game does.',['stats',null],'Stats'],
 ['How do I move my game to another device?','Save, Save codes: copy the code there and enter it on the other device.',['save',null],'Save'],
 ['How do I turn hints or sounds off?','Settings has Sound and Gameplay sections; they belong to this device only.',['settings',null],'Settings'],
];
function q8go(tab,sect){ try{ startAudio(); }catch(e){ oops('cw_pages08:startAudio',e); } try{ if(typeof sect==='string'&&typeof SECT==='object') SECT[tab]=sect; }catch(e){ oops('cw_pages08:n4',e); } /* the page opens on that section */ try{ if(tab==='journal'){ encLoc=S.loc; encSel=null; } if(Array.isArray(sect)&&sect[0]==='tackleview'){ tackleView=sect[1]; sect=null; } }catch(e){ oops('cw_pages08:Array.isArray',e); }
  try{ if(!MENU_OPEN) openMenu(tab); else if(S.tab!==tab){ setTab(tab); save(); } }catch(e){ try{ openMenu(tab); }catch(e2){ oops('cw_pages08:openMenu',e2); } }
  if(sect) setTimeout(()=>{ try{ const P=$('panel'); if(Array.isArray(sect)){ const b=P.querySelector(`[data-act="${sect[0]}"][data-k="${sect[1]}"]`); if(b) b.click(); } else { const b=[...P.querySelectorAll('[data-sect]')].find(x=>x.dataset.sect===sect||x.dataset.sect.startsWith(sect)); if(b) b.click(); } }catch(e){ oops('cw_pages08:Array.isArray#2',e); } },40); }
function q8goal(){ const gl=Q8.goal(); try{ if(gl.tab==='journal'){ encLoc=gl.loc&&LOCS[locIdx(gl.loc)]?gl.loc:S.loc; encSel=null; } if(gl.tab==='map') SECT.map='Waters'; }catch(e){ oops('cw_pages08:locIdx',e); } if(gl.tab) q8go(gl.tab,null); else { try{ closeMenu(); }catch(e){ oops('cw_pages08:closeMenu',e); } } }
function q8ready(){ const r=[]; try{ const d=ensureDaily(); const n=d.tasks.filter(t=>!t.claimed&&taskHave(t)>=t.n).length+(typeof wqReady==='function'?wqReady():0); if(n) r.push([n+' task reward'+(n>1?'s':'')+' ready','bounties','Daily tasks']); }catch(e){ oops('cw_pages08:ensureDaily',e); }
  try{ const un=(S.pass.lvl|0)-(S.pass.claimed|0); if(un>0) r.push([un+' Tide Pass reward'+(un>1?'s':'')+' ready','pass',null]); }catch(e){ oops('cw_pages08:r.push',e); }
  try{ if(S.tankBank>=1) r.push([fmt(Math.floor(S.tankBank))+' coins waiting in the Aquarium','aquarium',null]); }catch(e){ oops('cw_pages08:r.push#2',e); }
  try{ if(typeof ptsFree==='function'&&ptsFree()>0) r.push([ptsFree()+' skill point'+(ptsFree()>1?'s':'')+' to spend','skills',null]); }catch(e){ oops('cw_pages08:ptsFree',e); }
  return r; }
function q8html(){ const gl=Q8.goal(), read=Q8.read(), p=gl.p!=null?Math.max(0,Math.min(1,gl.p)):null;
  const goal=`<div class="tile q8-goal${gl.ready?' ready':''}"><span class="q8-k">${gl.ready?'Ready':'Your next goal'}</span><b class="q8-gt">${esc(gl.t)}</b>${gl.sub?`<span class="meta">${esc(gl.sub)}</span>`:''}${p!=null?`<span class="q8-bar"><i style="width:${(p*100).toFixed(1)}%"></i></span>`:''}<button class="btn" data-q8goal>${gl.tab?'Show me':'Back to the water'}</button></div>`;
  let live=''; try{ const L=liveNow&&liveNow(); if(L) live=`<div class="tile q8-row"><div><b>${esc(L.t)}</b>${L.sub?`<div class="meta">${esc(L.sub)}</div>`:''}</div><button class="btn alt sm" data-q8go="events">Events</button></div>`; }catch(e){ oops('cw_pages08:liveNow',e); }
  const rd=q8ready(); const ready=rd.length?`<h5>Waiting for you</h5><div class="q8-list">${rd.map(([t,tab,sect])=>`<div class="tile q8-row"><b>${esc(t)}</b><button class="btn alt sm" data-q8go="${tab}"${sect?` data-q8s="${esc(sect)}"`:''}>Open</button></div>`).join('')}</div>`:'';
  /* the journey: every water, then Hollow Trench and the voyages */
  const jr=LOCS.map((L,i)=>{ const open=S.unlocked.includes(L.id), prev=i?LOCS[i-1]:null, need=prev?unlockLine(i):''; return `<div class="q8-step${open?' done':''}"><span class="q8-dot">${open?'✓':i+1}</span><div><b>${open?'Opened ':'Open '}${esc(L.name)}</b>${!open&&prev?`<div class="meta">${need} · ${fmtShort(locCost(L))} coins</div>`:''}</div></div>`; }).join('')+
    `<div class="q8-step${(S.tides||0)>0?' done':''}"><span class="q8-dot">${(S.tides||0)>0?'✓':'⚓'}</span><div><b>Set sail again</b><div class="meta">${(S.tides||0)>0?(S.tides+' voyage'+(S.tides>1?'s':'')+' so far, '+(S.pearls||0)+' Wisdom Pearls'):'Reach Hollow Trench to start over for Wisdom Pearls'}</div></div></div>`;
  const goals=`<div class="jsec q8-sec" data-q8sec="Goals"><h2>Goals</h2>${goal}${live}${ready}<h5>Your journey</h5><div class="q8-journey">${jr}</div></div>`;
  /* lessons, grouped */
  const groups=[...new Set(Q8_LESSONS.map(l=>l[1]))];
  const learn=`<div class="jsec q8-sec" data-q8sec="Learn"><h2>Learn</h2><p class="meta q8-intro">${q8dev('Short lessons, one tap each. Tap a lesson to open it; read ones get a tick.')}</p>${groups.map(g=>`<h5>${esc(g)}</h5><div class="q8-lessons">${Q8_LESSONS.filter(l=>l[1]===g).map(([id,,t,one,body,go])=>`<details class="tile q8-lesson${read.includes(id)?' read':''}" data-q8id="${id}"><summary><span class="q8-tick" aria-hidden="true">${read.includes(id)?'✓':''}</span><span class="q8-st"><b>${esc(q8dev(t))}</b><span class="meta">${esc(q8dev(one))}</span></span></summary><div class="q8-body">${q8dev(body)}</div>${go?`<button class="btn alt sm" data-q8go="${go[0]}"${go[1]?` data-q8s='${esc(JSON.stringify(go[1]))}'`:''}>Take me there</button>`:''}</details>`).join('')}</div>`).join('')}</div>`;
  /* find anything */
  const F=Q8_FIND(); const places=[...new Set(F.map(f=>f[0]))];
  const find=`<div class="jsec q8-sec" data-q8sec="Find"><h2>Find</h2><input class="q8-filter" type="search" placeholder="Find anything: bait, pets, relics…" aria-label="Find a page" autocomplete="off"><div class="q8-find">${places.map(pl=>`<div class="q8-place" data-q8place><h5>${esc(pl)}</h5>${F.filter(f=>f[0]===pl).map(([,l,tab,sect])=>`<div class="tile q8-row q8-fi" data-q8k="${esc((l+' '+pl).toLowerCase())}"><b>${esc(l)}</b><button class="btn alt sm" data-q8go="${tab}"${sect?` data-q8s='${esc(JSON.stringify(sect))}'`:''}>Go</button></div>`).join('')}</div>`).join('')}<p class="meta q8-none" hidden>${q8dev('Nothing by that name. Try the search button in the top bar for more.')}</p></div></div>`;
  const help=`<div class="jsec q8-sec" data-q8sec="Help"><h2>Help</h2><div class="q8-lessons">${Q8_HELP.map(([q,a,go,gl])=>`<details class="tile q8-lesson q8-faq"><summary><span class="q8-tick" aria-hidden="true">?</span><span class="q8-st"><b>${esc(q8dev(q))}</b></span></summary><div class="q8-body">${q8dev(a)}</div><button class="btn alt sm" data-q8go="${go[0]}"${go[1]?` data-q8s='${esc(JSON.stringify(go[1]))}'`:''}>${esc(gl)}</button></details>`).join('')}</div></div>`;
  return `<div class="row spread"><div><h2 class="dl-dup">Quests</h2></div></div>${goals}${learn}${find}${help}`; }
/* the shared pages are drawn through the game's normal page drawing (unknown pages fall back to renderCooler): ONE hook, one entry per page */
const SHARED_PAGES={ quests:P=>{ P.innerHTML=q8html(); } };
{ const _rc=renderCooler; renderCooler=function(P){ const f=P&&SHARED_PAGES[S.tab]; if(f){ f(P); return; } return _rc.apply(this,arguments); }; }
{
  /* taps inside the page */
  document.addEventListener('click',e=>{ const P=$('panel'); if(!P||S.tab!=='quests'||!P.contains(e.target)) return;
    if(e.target.closest('[data-q8goal]')){ e.stopPropagation(); q8goal(); return; }
    const g=e.target.closest('[data-q8go]'); if(g){ e.stopPropagation(); let s=g.dataset.q8s||null; if(s&&(s[0]==='['||s[0]==='"')) try{ s=JSON.parse(s); }catch(er){ oops('cw_pages08:JSON.parse',er); } q8go(g.dataset.q8go,s); } },true);
  document.addEventListener('toggle',e=>{ const d=e.target; if(!(d instanceof HTMLDetailsElement)||!d.open||!d.dataset.q8id) return; const r=Q8.read(); if(!r.includes(d.dataset.q8id)){ r.push(d.dataset.q8id); save(); d.classList.add('read'); const t=d.querySelector('.q8-tick'); if(t) t.textContent='✓'; const c=$('panel').querySelector('.pg08-bank'); if(c){ const cell=[...c.children].find(x=>/^Lessons read/.test((x.querySelector('.sub')||{}).textContent||'')); if(cell){ const b=cell.querySelector('b'); if(b) b.textContent=r.filter(id=>Q8_LESSONS.some(l=>l[0]===id)).length+' / '+Q8_LESSONS.length; } } } },true);
  document.addEventListener('input',e=>{ const f=e.target; if(!f.classList||!f.classList.contains('q8-filter')) return; const q=f.value.trim().toLowerCase(), box=f.closest('.q8-sec'); let any=0;
    box.querySelectorAll('.q8-fi').forEach(r=>{ const on=!q||q.split(/\s+/).every(w=>r.dataset.q8k.includes(w)); r.hidden=!on; if(on) any++; }); box.querySelectorAll('[data-q8place]').forEach(p=>{ p.hidden=![...p.querySelectorAll('.q8-fi')].some(r=>!r.hidden); }); const n=box.querySelector('.q8-none'); if(n) n.hidden=!!any; });
}
/* test builds: window.__questsQC() taps Show me (your goal) and every Take me there / Go / help button in Quests and checks each lands on
   its page (and section; Tackle views too). Part of every final QC with the search check (director, 2026-11-18). */
if(/[?&]test\b/.test(location.search)) window.__questsQC=async()=>{ const w=ms=>new Promise(r=>setTimeout(r,ms)), bad=[]; let n=0; const P=()=>$('panel');
  const nav=s=>{ const x=[...P().querySelectorAll('.bwx-nav > button')].find(b=>b.textContent.trim()===s); if(x) x.click(); return !!x; };
  /* Show me (first let any earlier check's menu close finish: run right after __searchQC it used to collide) */ try{ closeMenu(); }catch(e){ oops('cw_pages08:closeMenu#2',e); } await w(700); openMenu('quests'); await w(250); nav('Goals'); await w(80); const gl=Q8.goal(); const sm=P().querySelector('[data-q8goal]'); if(!sm) bad.push('no Show me'); else { sm.click(); await w(300); n++; if(gl.tab){ if(S.tab!==gl.tab||!MENU_OPEN) bad.push('Show me -> '+S.tab+' (want '+gl.tab+')'); } else if(MENU_OPEN) bad.push('Show me should return to the water'); }
  for(const part of ['Goals','Find','Learn','Help']){ openMenu('quests'); await w(250); nav(part); await w(80); const cnt=P().querySelectorAll('.q8-sec[data-q8sec="'+part+'"] [data-q8go]').length;
    for(let i=0;i<cnt;i++){ openMenu('quests'); await w(220); if(!nav(part)){ bad.push('no '+part+' tab'); break; } await w(60); const b=P().querySelectorAll('.q8-sec[data-q8sec="'+part+'"] [data-q8go]')[i]; if(!b) break; const want=b.dataset.q8go; let ws=b.dataset.q8s||''; try{ ws=JSON.parse(ws); }catch(e){ /* quiet: this check tries every target as a list; a plain page name is not one, by design */ }
      const label=((b.closest('.q8-fi,details,.q8-row')||b).querySelector('b')||{}).textContent||want; b.click(); await w(300); n++; let ok=S.tab===want&&MENU_OPEN;
      if(ok&&typeof ws==='string'&&ws){ const s=P().querySelector('.bwx-nav [aria-selected="true"]'); ok=!!s&&s.textContent.trim().startsWith(ws); }
      if(ok&&Array.isArray(ws)&&ws[0]==='tackleview') ok=tackleView===ws[1]||S.tab==='shop';
      if(!ok) bad.push(part+' "'+label.slice(0,30)+'" -> '+S.tab+' (want '+want+' '+JSON.stringify(ws)+')'); } }
  try{ closeMenu(); }catch(e){ oops('cw_pages08:closeMenu#3',e); } return {checked:n, bad}; };
document.head.insertAdjacentHTML('beforeend',`<style>
#menuov #panel .q8-goal{display:flex;flex-direction:column;gap:4px;padding:12px 14px!important;border-color:#7fe3c455!important}
#menuov #panel .q8-goal.ready{border-color:#ffd36aaa!important;box-shadow:0 0 0 1px #ffd36a55,0 0 18px #ffd36a22}
#menuov #panel .q8-k{font:800 10px var(--display,system-ui);letter-spacing:.09em;text-transform:uppercase;color:#9fb2c8}
#menuov #panel .q8-goal.ready .q8-k{color:#ffd36a}
#menuov #panel .q8-gt{font:800 16px var(--display,system-ui);color:#fff}
#menuov #panel .q8-bar{display:block;height:7px;border-radius:999px;background:#0a161d;box-shadow:inset 0 0 0 1px #ffffff14;overflow:hidden;margin:4px 0}
#menuov #panel .q8-bar > i{display:block;height:100%;border-radius:999px;background:linear-gradient(90deg,#7fe3c4,#ffd36a)}
#menuov #panel .q8-goal > .btn{align-self:flex-start;margin-top:4px}
#menuov #panel .q8-list,#menuov #panel .q8-lessons{display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:6px}
#menuov #panel .q8-row{display:flex!important;flex-direction:row!important;align-items:center!important;justify-content:space-between;gap:10px;padding:8px 12px!important;min-height:0!important}
#menuov #panel .q8-row > b,#menuov #panel .q8-row > div{min-width:0}
#menuov #panel .q8-row .btn{flex:0 0 auto}
#menuov #panel .q8-journey{display:grid;grid-template-columns:repeat(auto-fill,minmax(230px,1fr));gap:4px 12px}
#menuov #panel .q8-step{display:flex;align-items:flex-start;gap:8px;padding:5px 0}
#menuov #panel .q8-step b{font-size:13px}
#menuov #panel .q8-step .meta{font-size:11.5px}
#menuov #panel .q8-dot{flex:0 0 22px;height:22px;border-radius:50%;display:flex;align-items:center;justify-content:center;font:800 11px var(--display,system-ui);background:#0a161d;color:#9fb2c8;box-shadow:inset 0 0 0 1px #ffffff22}
#menuov #panel .q8-step.done .q8-dot{background:#7fe3c4;color:#05261f;box-shadow:none}
#menuov #panel .q8-step.done b{color:#bff5e3}
#menuov #panel .q8-lesson{padding:0!important;display:block!important;min-height:0!important}
#menuov #panel .q8-lesson > summary{list-style:none;display:flex;align-items:center;gap:10px;padding:9px 12px;cursor:pointer}
#menuov #panel .q8-lesson > summary::-webkit-details-marker{display:none}
#menuov #panel .q8-lesson > summary::after{content:'›';margin-left:auto;color:#7f93a8;font:800 16px var(--display,system-ui);transition:transform .15s}
#menuov #panel .q8-lesson[open] > summary::after{transform:rotate(90deg)}
#menuov #panel .q8-st{display:flex;flex-direction:column;min-width:0}
#menuov #panel .q8-st b{font-size:13.5px}
#menuov #panel .q8-st .meta{font-size:11.5px}
#menuov #panel .q8-tick{flex:0 0 22px;height:22px;border-radius:50%;display:flex;align-items:center;justify-content:center;font:800 11px var(--display,system-ui);background:#0a161d;color:#7fe3c4;box-shadow:inset 0 0 0 1px #ffffff22}
#menuov #panel .q8-lesson.read .q8-tick{background:#7fe3c4;color:#05261f;box-shadow:none}
#menuov #panel .q8-faq .q8-tick{color:#ffd36a}
#menuov #panel .q8-body{padding:0 12px 8px 44px;font-size:13px;line-height:1.5;color:#cfdbe6}
#menuov #panel .q8-lesson > .btn{margin:0 12px 10px 44px}
#menuov #panel .q8-filter{width:100%;box-sizing:border-box;height:36px;border-radius:10px;border:1px solid var(--line,#26385180);background:#0a161d;color:var(--ink,#e6efe8);padding:0 12px;font-size:14px;margin:0 0 6px}
#menuov #panel .q8-place[hidden],#menuov #panel .q8-fi[hidden]{display:none!important}
#menuov #panel .q8-place{display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:6px}
#menuov #panel .q8-place > h5{grid-column:1/-1}
</style>`);
/* PRESTIGE: its own page and section, Set sail again and Pearl relics (moved from mobile/waters08.js; the Map page keeps only the waters) */
  try{ SEARCH_IDX.forEach(e=>{ if(e[1]==='map'&&/^(Set sail again|Pearl relics)/.test(e[0])) e[1]='prestige'; }); }catch(e){ oops('cw_pages08:SEARCH_IDX.forEach',e); }
  try{ PAGE_DESC.prestige='Set sail again for Wisdom Pearls, and trade pearls for permanent relics'; }catch(e){ oops('cw_pages08:PAGE_DESC.prestige',e); }
SHARED_PAGES.prestige=P=>{ P.innerHTML='<div class="row spread"><div><h2 class="dl-dup">Prestige</h2></div></div>'+renderVoyage()+relicHTML(); };
/* ODDITIES: its own page in Collection, with Oddities and Treasures as tabs (moved from mobile/waters08.js) */
{
  try{ SEARCH_IDX.push(['Oddities','oddities',null,'oddities junk treasure rare finds boot can found things']); }catch(e){ oops('cw_pages08:SEARCH_IDX.push',e); }
  try{ PAGE_DESC.oddities='Junk, odd finds and treasure you have pulled from the water'; }catch(e){ oops('cw_pages08:PAGE_DESC.oddities',e); }
  /* the first 12 pictures are drawn at once, the rest as they come into view (100 pictures took about 10 ms per switch) */
  const draw=P=>{ const cvs=[...P.querySelectorAll('canvas[data-junk]')], one=cv=>{ const cx=cv.getContext('2d'); cx.clearRect(0,0,cv.width,cv.height); if(cv.dataset.known==='1') drawJunk(cx,cv.width,cv.height,cv.dataset.junk,null); else mysteryThumb(cx,cv.width,cv.height,cv.dataset.junk); };
    cvs.slice(0,12).forEach(one); if(typeof IntersectionObserver!=='function'){ cvs.slice(12).forEach(one); return; } const io=new IntersectionObserver(es=>es.forEach(e=>{ if(!e.isIntersecting) return; io.unobserve(e.target); one(e.target); }),{rootMargin:'240px'}); cvs.slice(12).forEach(c=>io.observe(c)); };
  SHARED_PAGES.oddities=P=>{ {
      /* two tabs (director: "oddities include treasures but they aren't separated"): Oddities (junk, odd junk, rare finds) and Treasures */
      const card=J=>{ const n=S.junk[J.id]||0; return `<div class="jcard" style="cursor:default" ${n?'data-odd="'+J.id+'"':''}><canvas width="200" height="100" data-junk="${J.id}" data-known="${n?1:0}"></canvas><b style="color:${n?(J.t>=2?'var(--gold)':'var(--ink)'):'var(--muted)'}">${n?esc(J.name):'???'}</b><small>${n?['Junk','Odd junk','Rare find','Treasure'][J.t]+' · ×'+n:'Not found yet'}</small></div>`; };
      const odd=JUNK.filter(J=>J.t<3).sort((a,b)=>a.t-b.t), tr=JUNK.filter(J=>J.t>=3);
      P.innerHTML=`<div class="row spread"><div><h2 class="dl-dup">Oddities</h2><p class="sub">Things humanity dropped in the water. Some pay, some boost your fishing, some come with a pet or a hat.</p></div></div>`+
        `<div class="jsec od8" data-od8="Oddities"><h2>Oddities</h2><p class="meta">Junk, odd junk and rare finds: everyday things the water gives back, from rarest last.</p><div class="jgrid">${odd.map(card).join('')}</div></div>`+
        `<div class="jsec od8" data-od8="Treasures"><h2>Treasures</h2><p class="meta">The rarest things in the water. Special lures in Tackle pull up more of them.</p><div class="jgrid">${tr.map(card).join('')}</div></div>`;
      draw(P); } };
}
document.head.insertAdjacentHTML('beforeend','<style>#menuov #panel .od8 > .meta{margin:0 0 8px!important}</style>');
/* BAIT: its own page, opened from Bait in the top bar: Switch, Buy bait, Special lures (moved from mobile/waters08.js); Tackle keeps its Gear */
{
  try{ SEARCH_IDX.forEach(e=>{ if(e[1]==='shop'&&Array.isArray(e[2])&&e[2][1]==='bait'){ e[0]='Bait'; e[1]='bait'; e[2]='Buy bait'; } else if(e[1]==='shop'&&Array.isArray(e[2])&&e[2][1]==='lures'){ e[0]='Bait: special lures'; e[1]='bait'; e[2]='Special lures'; } }); SEARCH_IDX.push(['Switch bait','bait','Switch','switch change bait use bait lure']); }catch(e){ oops('cw_pages08:SEARCH_IDX.forEach#2',e); }
  try{ PAGE_DESC.bait='Switch bait, buy more, and use the special lures you found'; }catch(e){ oops('cw_pages08:PAGE_DESC.bait',e); }
  const isLure=k=>!!(BAIT[k]&&('junk' in BAIT[k]));
  const take=(P,view,keep)=>{ const was=tackleView; tackleView=view; try{ renderShop(P); }finally{ tackleView=was; } const f=document.createDocumentFragment(); [...P.children].filter(keep).forEach(c=>f.appendChild(c)); return f; };
  SHARED_PAGES.bait=P=>{
    const buy=take(P,'bait',c=>c.classList.contains('tk-list')), cur=take(P,'bait',c=>c.classList.contains('tk-cur')), lures=take(P,'lures',c=>c.classList.contains('tk-list')||(c.tagName==='P'&&c.classList.contains('sub')&&/bought|junk/i.test(c.textContent)));
    const own=Object.keys(BAIT).filter(k=>k==='worm'||(S.bait[k]||0)>0);
    /* each button: the name and how many are left on one line, then the bait's own short description (director: "show a brief
       description of the bait choices, simple and neat"); "Found as junk." is left off lures (they sit under their own heading) */
    const btn=k=>{ const B=BAIT[k], n=S.bait[k]||0, on=S.baitSel===k, d=String(B.note||'').replace(/^Found as junk\.\s*/,''); return `<button type="button" class="bt8-b${on?' on':''}${isLure(k)?' lure':''}" data-act="usebait" data-k="${k}" aria-pressed="${on}" title="${esc(B.name)}: ${esc(d)}"><span class="bt8-top"><b>${esc(B.name)}</b><span class="bt8-n">${k==='worm'?'Endless':'× '+n}</span></span><span class="bt8-d">${esc(d)}</span></button>`; };
    P.innerHTML=`<div class="row spread"><div><h2 class="dl-dup">Bait</h2><p class="sub">Better bait brings rarer fish; one bait is used each time you set the hook. Worms never run out.</p></div></div>`+
      `<div class="jsec bt8" data-bt8="Switch"><h2>Switch</h2><div class="bt8-cur"></div><h5>Your bait</h5><div class="bt8-grid">${own.filter(k=>!isLure(k)).map(btn).join('')}</div>${own.some(isLure)?`<h5>Your special lures</h5><div class="bt8-grid">${own.filter(isLure).map(btn).join('')}</div>`:''}</div>`+
      `<div class="jsec bt8" data-bt8="Buy bait"><h2>Buy bait</h2></div><div class="jsec bt8" data-bt8="Special lures"><h2>Special lures</h2></div>`;
    /* the "Bait in use" card keeps the same height whichever bait is on (Cam's Pixel, 2026-11-20: Worms has no "Switch to worms" button,
       so picking Crickets made the card 36 px taller and every bait button below jumped): an invisible stand-in holds the button's place */
    { const t=cur.querySelector&&cur.querySelector('.tk-cur'); if(t&&!t.querySelector('[data-act="usebait"]')) t.insertAdjacentHTML('beforeend','<button type="button" class="btn alt sm" tabindex="-1" aria-hidden="true" style="visibility:hidden">Switch to worms</button>'); }
    P.querySelector('.bt8-cur').appendChild(cur); P.querySelector('[data-bt8="Buy bait"]').appendChild(buy); P.querySelector('[data-bt8="Special lures"]').appendChild(lures); };
  /* Tackle: Gear only (bait and lures live on the Bait page) */
  panelStep({ before(){ if(S.tab==='shop'){ try{ tackleView='gear'; }catch(e){ oops('cw_pages08:tackleView',e); } } }, after(){ try{ if(S.tab==='shop'){ const P=$('panel'); P.querySelectorAll('[data-act="tackleview"]').forEach(b=>{ if(b.dataset.k!=='gear') b.remove(); }); P.querySelectorAll(':scope > .bwx-nav').forEach(n=>{ if(n.querySelectorAll('button').length<2) n.remove(); }); } }catch(e){ console.error(e); } } }); }
document.head.insertAdjacentHTML('beforeend',`<style>
#menuov #panel .bt8-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(140px,1fr));gap:6px;margin:0 0 6px}
#menuov #panel .bt8-b{display:flex;flex-direction:column;align-items:flex-start;gap:2px;min-height:48px;padding:7px 11px;border-radius:12px;border:1px solid #ffffff1c;background:linear-gradient(180deg,#16263d,#111e31);color:#e8f1fb;text-align:left;cursor:pointer;font:inherit}
#menuov #panel .bt8-b b{font:800 13.5px var(--display,system-ui);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:100%}
#menuov #panel .bt8-b span{font-size:11.5px;color:#9fb3c8}
#menuov #panel .bt8-b.lure span{color:#c9a6ff}
#menuov #panel .bt8-b.on{background:linear-gradient(180deg,#ffd36a,#f0b43c);border-color:#ffd36a;color:#2a1a04}
#menuov #panel .bt8-b.on span{color:#5a3a08}
#menuov #panel .bt8-b:active{transform:translateY(1px)}
#menuov #panel .bt8-cur > .tile{margin:0 0 8px!important}
#menuov #panel .bt8-grid{grid-template-columns:repeat(auto-fill,minmax(190px,1fr))!important}
#menuov #panel .bt8-b{gap:3px!important;min-height:58px!important;justify-content:flex-start}
#menuov #panel .bt8-top{display:flex;align-items:baseline;justify-content:space-between;gap:8px;width:100%;min-width:0}
#menuov #panel .bt8-top b{min-width:0}
#menuov #panel .bt8-b .bt8-n{flex:0 0 auto;font:700 11px var(--display,system-ui);color:#9fb3c8}
#menuov #panel .bt8-b .bt8-d{display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;font-size:11.5px;line-height:1.3;color:#b8c8d6;text-align:left}
#menuov #panel .bt8-b.lure .bt8-d{color:#d3bdf5}
#menuov #panel .bt8-b.on .bt8-n,#menuov #panel .bt8-b.on .bt8-d{color:#4a3006}
</style>`);
