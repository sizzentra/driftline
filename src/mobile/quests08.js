// =====================================================================
// Phones and tablets, round 8: QUESTS (director, 2026-11-18: "goal shouldn't be on the top header ... rework goal into its own side
// panel tab called Quests which should feature objectives, tutorials, and help to the fisher. Organize that part flawlessly, make sure
// there's a lot to learn there, and also direction to find!").
// A side-panel section (first in the list) with one page in four parts:
//  - GOALS: your next goal (what to do, how close you are, a Show me button that takes you there), anything waiting to be claimed,
//    a live event if one is on, and your journey through the waters to Set sail again.
//  - LEARN: short lessons in seven groups, from casting to prestige. Each opens in place, says what it is and how to use it, and has
//    a Take me there button. Lessons you have read get a tick; the strip counts them.
//  - FIND: where everything lives ("Side panel > Upgrades > Rods"), with a filter box and a Go button on every line.
//  - HELP: the questions players ask most, answered plainly, each with the button that fixes it.
// Every number in the lessons comes from the game's own rules (the same text the game uses elsewhere). Android + iPhone + tablets.
// =====================================================================
{ /* the tab and its place on the side panel (first) */
  const T=$('tabs'); if(T&&!T.querySelector(':scope > [data-tab="quests"]')){ const b=document.createElement('button'); b.setAttribute('role','tab'); b.type='button'; b.dataset.tab='quests'; b.dataset.label='🧭 Quests'; b.setAttribute('aria-selected','false'); b.hidden=true; b.innerHTML='🧭 Quests<span class="dot" hidden></span>'; const sb=T.querySelector('.secbar'); if(sb) T.insertBefore(b,sb); else T.appendChild(b); }
  if(!MENU_SECS.some(s=>s.id==='quests')) MENU_SECS.unshift({id:'quests', name:'Quests', short:'Quests', tabs:['quests'], icon:'<circle cx="12" cy="12" r="8.5"/><path d="m15.5 8.5-2.2 4.8-4.8 2.2 2.2-4.8z"/>'});
  try{ PAGE_DESC.quests='Your goals, short lessons, where to find everything, and help'; }catch(e){}
  try{ SEARCH_IDX.unshift(['Quests: goals','quests','Goals','goal next objective quest what to do journey'],['Quests: learn','quests','Learn','tutorial lesson how to learn guide help basics'],['Quests: find anything','quests','Find','where find directions map menu'],['Quests: help','quests','Help','help faq question problem stuck']); }catch(e){}
}
const Q8={ goal:()=>{ try{ return _nextGoal_036(); }catch(e){ try{ return nextGoal(); }catch(e2){ return {t:'Catch a fish',sub:'',p:null,tab:null}; } } },
  read:()=>{ const s=S.settings; if(!Array.isArray(s.q8read)) s.q8read=[]; return s.q8read; } };
/* the lessons: [id, group, title, one line, body, go] (go = [tab, section] for Take me there) */
const Q8_LESSONS=[
 ['cast','Fishing basics','Casting','Where your line lands matters','Tap the water where you want your line to land. A <b>far cast</b> reaches better fish, and the cast line says so while you aim. If you prefer a power meter, switch the cast style in Settings, Controls.',['settings','Controls']],
 ['bite','Fishing basics','Bites and the hook','Wait for the splash, then tap','Watch the bobber. Small twitches are only nibbles: <b>wait for the big splash</b>, then tap to set the hook. Miss the moment and the fish swims off. The <b>Hook</b> upgrade in Tackle gives you a longer window.',['shop',['tackleview','gear']]],
 ['reel','Fishing basics','Reeling and the line','Hold to reel, let go when it fights','<b>Hold</b> to reel, or draw circles to crank. <b>Let go</b> when the fish runs, jumps, shakes its head or gets angry. The ring around the fish is your line: green is safe, yellow means careful, red means it is about to snap. <b>Line</b> upgrades take more strain, <b>Reel</b> upgrades wind faster.',['shop',['tackleview','gear']]],
 ['rest','Fishing basics','Rest mode','Fish slowly while you do other things','<b>Rest</b> (bottom left of the water) sits your angler down to fish by themselves while the game is open, even while you browse the menus. A bite comes every few minutes and the fish goes straight into your cooler. You cannot fish yourself while resting, and the cooler needs room.',null],
 ['bait','Better catches','Bait','Better bait, rarer fish','Better bait brings rarer fish. One bait is used each time you set the hook; <b>Worms never run out</b>. Tap <b>Bait</b> in the top bar: <b>Switch</b> shows every bait and lure you own, one tap to use it; <b>Buy bait</b> sells more.',['bait','Switch']],
 ['weather','Better catches','Weather and time of day','Every weather changes the odds','The chip on the water shows the time, the weather and how long it lasts. <b>Rain</b>: bites +35%. <b>Storm</b>: rarer fish. <b>Fog</b>: night fish by day. <b>Gilded</b>: shiny ×3. <b>Rainbow</b>: shiny ×2 and XP +30%. <b>Aurora</b>: XP ×2. <b>Spawning Run</b>: bites ×2.5. Some fish only bite by day, others only at night. The forecast is in Events.',['events',null]],
 ['hot','Better catches','Hotspots','Ripples mean rarer fish','A <b>hotspot</b> ripples on the water now and then: cast right into it for rarer fish. The <b>Fish Finder</b> upgrade finds more hotspots and tells you more about a bite before you strike.',['shop',['tackleview','gear']]],
 ['shiny','Better catches','Shiny and prismatic fish','Rare colours worth far more','A <b>shiny</b> fish (✦) is a rare colour of a species and worth much more; <b>prismatic</b> (✦✦) is rarer still. Gilded and Rainbow weather raise the chance. Sell all leaves shinies alone unless you switch on Shinies in the Cooler.',['cooler',null]],
 ['lures','Better catches','Special lures','Lures for junk and treasure','Special lures change what bites: some pull up junk and treasure instead of fish. You cannot buy them: they come out of junk you fish up. They are on the Bait page (top bar), Special lures.',['bait','Special lures']],
 ['cooler','Your fish','The Cooler','Where every catch goes','Every fish you land goes into the <b>Cooler</b> (top bar). Sell one, <b>Sell all</b> with a filter (rarity, a max price, shinies), put one on display in the Aquarium, or Keep it in the Trophy Room. When the cooler is full you cannot fish until you make room. The <b>Cooler</b> upgrade in Tackle adds space.',['cooler',null]],
 ['monger','Your fish','The fishmonger','Double pay for one species','The fishmonger wants one species at a time and <b>pays double</b> for it until the weather changes. Their wish is at the top of the Cooler.',['cooler',null]],
 ['aquarium','Aquarium','Getting around the Aquarium','Where everything is','Tap <b>Aquarium</b> in the top bar. Your tank fills the left side; the strip under it shows what you <b>earn</b> per hour, the coins <b>ready</b> to collect, and how full the <b>tank</b> is, with <b>Collect</b> and <b>Feed fish</b>. The panel on the right has two tabs: <b>Your tank</b> (fish, boosts, a bigger tank) and <b>Decorate</b>. <b>Hide</b> folds the panel away to watch the whole tank.',['aquarium',null]],
 ['aq-add','Aquarium','Putting fish on display','From the Cooler to the tank','In the <b>Cooler</b>, every fish shows what it would earn per hour in the tank: tap <b>To aquarium</b> on the ones worth keeping. You can also add them from Aquarium, Your tank, Add from your Cooler. Each fish rolls its own boost when caught; heavier fish give more, shiny fish double.',['cooler',null]],
 ['aq-earn','Aquarium','Earning and collecting','Visitors pay while you are away','Fish on display earn coins from visitors even while you are away, for <b>up to 8 hours</b>, so collect before long breaks. The Aquarium chip in the top bar turns <b>gold</b> when coins are waiting. <b>Feed fish</b> gives +25% aquarium income for 30 minutes, once an hour.',['aquarium',null]],
 ['aq-boost','Aquarium','Boosts','Every fish on display helps you fish','Each fish on display adds a boost (bite speed, rare odds, line tension, sale price and more) and <b>boosts stack</b>. Your tank lists them under Boosts. Usually a boost fits the fish\'s rarity; now and then one rolls much better.',['aquarium','Your tank']],
 ['aq-room','Aquarium','A bigger tank and decorations','More room, more boosts','On Your tank, the <b>Room for … fish</b> button shows how many more fish the next tank holds and its price. <b>Decorate</b> places decorations in the tank: drag one along the sand to move it. <b>Advice:</b> fill every spot before buying more room, and swap in better fish as you catch them.',['aquarium','Your tank']],
 ['trophy','Your fish','The Trophy Room','Keep a fish forever','<b>Keep</b> mounts a fish in the Trophy Room for good: it earns nothing and gives no boost, but it is never lost, not even when you set sail again.',['trophy',null]],
 ['log','Your fish','The Fish Log and mastery','Every species, and stars for each','The <b>Fish Log</b> (top bar) lists every species at every water. Catch a species 3, 10, 30 and 100 times for its <b>mastery stars</b>: each star adds +10% to that fish\'s value, and every 8 stars is a new Angler Rank with coins and a free Mystery Crate.',['journal',null]],
 ['odd','Your fish','Oddities','Junk, odd finds and treasure','Not everything that bites is a fish. Junk, odd junk and rare finds go in <b>Oddities</b> (Collection), with <b>Treasures</b> in their own tab beside them: some pay, some boost your fishing, some come with a pet or a hat. Special lures (Bait, in the top bar) pull up more of them.',['oddities',null]],
 ['waters','Getting stronger','New waters','How to open the next water','Each water has 52 fish of its own and is tougher than the last. Catch <b>10 fish</b> at a water (10 more each voyage, up to 50) and you can open the next one with coins on the Map. Your goal (Quests) always says how close you are.',['map',null]],
 ['tackle','Getting stronger','Tackle upgrades','Rod length, reel, line, hook, cooler, finder','In Tackle, Gear: <b>Rod length</b> casts farther with better far-cast odds, <b>Reel</b> winds faster, <b>Line</b> takes more tension, <b>Hook</b> gives a longer window, <b>Cooler</b> holds more fish and the <b>Fish Finder</b> reads bites and finds hotspots.',['shop',['tackleview','gear']]],
 ['rods','Getting stronger','Rods, Scales and attachments','Collect rods, upgrade them, fit parts','Your rod shapes every cast. Collect rods in the Rod rack, upgrade them with coins and <b>Scales</b> (Scales come from Rare and better fish) and fit <b>attachments</b>: each has three tiers and fits any rod once you own it. Save a rod and its parts as a <b>preset</b> to switch in one tap.',['rods','Your rods']],
 ['skills','Getting stronger','Skills','Small steady gains with a big finish','Levels give <b>skill points</b>. Skills are small steady gains in five groups, and every skill unlocks a <b>special effect</b> when fully learned. The XP bar next to your level shows how close the next point is. Skills can be reset for coins.',['skills',null]],
 ['paths','Getting stronger','Paths','One big specialty per tier','Paths are big specialties: you pick one per tier, and each changes how you fish in its own way.',['paths',null]],
 ['tasks','Things to do','Daily tasks and weekly quests','Fresh goals every day and week','<b>Tasks</b> (top bar) has three daily tasks (finish all three for a bonus crate; your login streak counts too) and four weekly quests (finish all four for a big Mystery Crate). A number on Tasks means a reward is ready.',['bounties','Daily tasks']],
 ['bounties','Things to do','Bounties','The harbourmaster pays extra','The harbourmaster pays extra for specific catches. Every water has its own board, and its bounties wait there until you finish them. Fish still go in your cooler. Swap a bounty you do not want for a few coins.',['bounties','Bounties']],
 ['events','Things to do','Events','Derbies, frenzies and the forecast','Events bring derbies, frenzies and special weather. When one is on, <b>Live</b> shows in the top bar. In a frenzy, tap the leaping fish.',['events',null]],
 ['feats','Things to do','Feats','Achievements that pay','Feats are achievements for things you do as you play, each with a reward.',['feats',null]],
 ['pass','Things to do','Tide Pass','Levels with rewards','The Tide Pass levels up as you play and each level has a reward to claim. It lives under Challenges.',['pass',null]],
 ['boardwalk','Things to do','The Boardwalk','Games, tickets and prizes','On the old pier: a free <b>Lucky wheel</b> spin every hour (up to 3 saved), plus scratch cards, the duck pond and higher-or-lower. Games pay tickets and prizes, and the Prize counter trades tickets for things you cannot get anywhere else.',['games',['bwview','games']]],
 ['home','Your home','Getting around your home','Where everything is','Tap <b>Home</b> in the top bar (it shows how cozy your home is, ♥). The live view of the water fills the left side; the strip under it shows your <b>Cozy</b> hearts, the XP <b>bonus</b> and how many decorations are <b>placed</b>. The panel on the right has two tabs: the home itself (style and wood) and <b>Decorations</b>.',['home',null]],
 ['home-deco','Your home','Decorating','Up to 8 decorations','Pick decorations in the <b>Decorations</b> tab; up to 8 fit. <b>Drag</b> a decoration or a pet along your home in the live view to move it to the exact spot you want.',['home',null]],
 ['home-cozy','Your home','Cozy and the XP bonus','Hearts mean more XP','Every decoration and nicer wood adds <b>cozy hearts</b>, and each heart gives <b>+1% XP</b>, up to <b>+40%</b>. <b>Advice:</b> decorate the water you fish at most first; the bonus counts where you are.',['home',null]],
 ['home-each','Your home','A home at every water','Each water keeps its own','Every water has its own home. A new one starts as a copy of the home you arrive with, and you can copy another water\'s home over it from the home page. Docks, boats and shores each look their own way.',['home',null]],
 ['pets','Home and style','Pets','Company on the water','Pets keep you company on the water. Find more in Pets, then name and dress them up.',['pets','Your pets']],
 ['style','Home and style','Wardrobe','Dress your angler','Change your angler\'s body, clothes, hats, glasses, shoes and more in the Wardrobe. Tap anything to try it on first.',['style',null]],
 ['sail','Prestige','Set sail again','Start over, stronger every time','Once you reach <b>Hollow Trench</b> you can start over from Willow Pond for <b>Wisdom Pearls</b>: spend them in the Pearl shop (+1% coins or +1% XP a level) or on relics. You also earn Boon points to upgrade lasting voyage Boons, your Legacy grows with every voyage, and 32 milestones up to voyage 100 unlock perks. You keep your level, skills, Fish Log, feats, Trophy Room, pets and clothes.',['prestige','Set sail again']],
 ['relics','Prestige','Pearl relics','Trade pearls for lasting bonuses','Spend Wisdom Pearls on permanent relics. Each relic is bought once and kept forever; the strongest cost the most pearls.',['prestige','Pearl relics']],
 ['save','Settings and saves','Your save on another device','Move your progress','Save, Save codes gives you a code that carries your progress to another phone or a computer. Settings belong to each device.',['save',null]],
];
/* where everything lives on a phone: [place, label, tab, section] */
const Q8_FIND=()=>{ const out=[], lbl=t=>{ try{ return menuTabLabel(t)[1]; }catch(e){ return t; } };
  out.push(['Top bar','Cooler','cooler',null],['Top bar','Aquarium','aquarium',null],['Top bar','Home','home',null],['Top bar','Fish Log','journal',null],['Top bar','Bait: switch, buy, special lures','bait',null],['Top bar','Tasks (daily, weekly, bounties)','bounties',null],['Top bar · settings button','Settings','settings',null],['Top bar · settings button','Save and save codes','save',null]);
  for(const s of MENU_SECS){ if(s.id==='quests') continue; for(const t of s.tabs) out.push(['Side panel · '+s.short,lbl(t),t,null]); }
  out.push(['Side panel · Prestige','Set sail again','prestige','Set sail again'],['Side panel · Prestige','Pearl relics','prestige','Pearl relics']);
  return out; };
const Q8_HELP=[
 ['My line keeps snapping','Let go of the screen when the fish runs, jumps or shakes its head, and watch the ring around it: red means let go now. A stronger <b>Line</b> in Tackle takes more strain.',['shop',['tackleview','gear']],'Tackle'],
 ['How do I catch rarer fish?','Better bait, far casts, hotspots, Storm weather and the rare-odds skills all help. Your Wisdom Pearls raise rare odds too.',['bait','Buy bait'],'Bait'],
 ['My cooler is full','Open the Cooler and Sell all (with a filter if you want to keep some), put fish in the Aquarium, or Keep the best ones in the Trophy Room. A bigger Cooler is in Tackle.',['cooler',null],'Cooler'],
 ['How do I earn more coins?','Sell bigger and rarer fish, fill the fishmonger\'s wish (double pay), keep the Aquarium full, finish bounties and tasks, and raise your sale bonus with skills and mastery stars.',['bounties','Bounties'],'Bounties'],
 ['Where do Scales come from?','Rare and better fish. You spend them on rod upgrades.',['rods','Your rods'],'Rods'],
 ['What are Fish Nibbles?','Scrap a fish in the Cooler (next to Sell) for Nibbles of that species: always for common fish, less often for rarer ones, more for shiny, hybrid and titled fish. Feed them to a fish of the same species in your Aquarium: it earns more, and every 10 Nibbles its bonuses grow. Half of your Nibbles expire when you set sail again.',['cooler',null]],
 ['How do I open the next water?','Catch 10 fish at the water before it this voyage (10 more each voyage, up to 50), then pay its price on the Map. Your goal shows both.',['map',null],'Map'],
 ['What do I keep when I set sail again?','Your level, skills, Fish Log, feats, Trophy Room, pets, clothes, relics and Wisdom Pearls. Coins, tackle, bait, cooler fish, bounties and waters reset; aquarium fish are mounted in the Trophy Room.',['prestige','Set sail again'],'Prestige'],
 ['Where did my aquarium coins go?','Visitors pay for up to 8 hours while you are away, then stop until you collect. Collect from the strip under the tank (the Aquarium chip turns gold when coins wait).',['aquarium',null],'Aquarium'],
 ['How do I move a decoration?','In the Aquarium, drag it along the sand. At home, drag it (or your pet) along your home in the live view.',['home',null],'Home'],
 ['How do I get a bigger XP bonus?','Make your home cozier: every decoration and nicer wood adds hearts, each +1% XP up to +40%.',['home',null],'Home'],
 ['How do I see all my bonuses?','Stats shows your level, bite speed, sale price and every bonus, worked out the way the game does.',['stats',null],'Stats'],
 ['How do I move my game to another device?','Save, Save codes: copy the code there and enter it on the other device.',['save',null],'Save'],
 ['How do I turn hints or sounds off?','Settings has Sound and Gameplay sections; they belong to this device only.',['settings',null],'Settings'],
];
function q8go(tab,sect){ try{ startAudio(); }catch(e){} try{ if(typeof sect==='string'&&typeof SECT==='object') SECT[tab]=sect; }catch(e){} /* the page opens on that section */ try{ if(tab==='journal'){ encLoc=S.loc; encSel=null; } if(Array.isArray(sect)&&sect[0]==='tackleview'){ tackleView=sect[1]; sect=null; } }catch(e){}
  try{ if(!MENU_OPEN) openMenu(tab); else if(S.tab!==tab){ setTab(tab); save(); } }catch(e){ try{ openMenu(tab); }catch(e2){} }
  if(sect) setTimeout(()=>{ try{ const P=$('panel'); if(Array.isArray(sect)){ const b=P.querySelector(`[data-act="${sect[0]}"][data-k="${sect[1]}"]`); if(b) b.click(); } else { const b=[...P.querySelectorAll('[data-sect]')].find(x=>x.dataset.sect===sect||x.dataset.sect.startsWith(sect)); if(b) b.click(); } }catch(e){} },40); }
function q8goal(){ const gl=Q8.goal(); try{ if(gl.tab==='journal'){ encLoc=gl.loc&&LOCS[locIdx(gl.loc)]?gl.loc:S.loc; encSel=null; } if(gl.tab==='map') SECT.map='Waters'; }catch(e){} if(gl.tab) q8go(gl.tab,null); else { try{ closeMenu(); }catch(e){} } }
function q8ready(){ const r=[]; try{ const d=ensureDaily(); const n=d.tasks.filter(t=>!t.claimed&&taskHave(t)>=t.n).length+(typeof wqReady==='function'?wqReady():0); if(n) r.push([n+' task reward'+(n>1?'s':'')+' ready','bounties','Daily tasks']); }catch(e){}
  try{ const un=(S.pass.lvl|0)-(S.pass.claimed|0); if(un>0) r.push([un+' Tide Pass reward'+(un>1?'s':'')+' ready','pass',null]); }catch(e){}
  try{ if(S.tankBank>=1) r.push([fmt(Math.floor(S.tankBank))+' coins waiting in the Aquarium','aquarium',null]); }catch(e){}
  try{ if(typeof ptsFree==='function'&&ptsFree()>0) r.push([ptsFree()+' skill point'+(ptsFree()>1?'s':'')+' to spend','skills',null]); }catch(e){}
  return r; }
function q8html(){ const gl=Q8.goal(), read=Q8.read(), p=gl.p!=null?Math.max(0,Math.min(1,gl.p)):null;
  const goal=`<div class="tile q8-goal${gl.ready?' ready':''}"><span class="q8-k">${gl.ready?'Ready':'Your next goal'}</span><b class="q8-gt">${esc(gl.t)}</b>${gl.sub?`<span class="meta">${esc(gl.sub)}</span>`:''}${p!=null?`<span class="q8-bar"><i style="width:${(p*100).toFixed(1)}%"></i></span>`:''}<button class="btn" data-q8goal>${gl.tab?'Show me':'Back to the water'}</button></div>`;
  let live=''; try{ const L=liveNow&&liveNow(); if(L) live=`<div class="tile q8-row"><div><b>${esc(L.t)}</b>${L.sub?`<div class="meta">${esc(L.sub)}</div>`:''}</div><button class="btn alt sm" data-q8go="events">Events</button></div>`; }catch(e){}
  const rd=q8ready(); const ready=rd.length?`<h5>Waiting for you</h5><div class="q8-list">${rd.map(([t,tab,sect])=>`<div class="tile q8-row"><b>${esc(t)}</b><button class="btn alt sm" data-q8go="${tab}"${sect?` data-q8s="${esc(sect)}"`:''}>Open</button></div>`).join('')}</div>`:'';
  /* the journey: every water, then Hollow Trench and the voyages */
  const jr=LOCS.map((L,i)=>{ const open=S.unlocked.includes(L.id), prev=i?LOCS[i-1]:null, need=prev?unlockLine(i):''; return `<div class="q8-step${open?' done':''}"><span class="q8-dot">${open?'✓':i+1}</span><div><b>${open?'Opened ':'Open '}${esc(L.name)}</b>${!open&&prev?`<div class="meta">${need} · ${fmtShort(locCost(L))} coins</div>`:''}</div></div>`; }).join('')+
    `<div class="q8-step${(S.tides||0)>0?' done':''}"><span class="q8-dot">${(S.tides||0)>0?'✓':'⚓'}</span><div><b>Set sail again</b><div class="meta">${(S.tides||0)>0?(S.tides+' voyage'+(S.tides>1?'s':'')+' so far, '+(S.pearls||0)+' Wisdom Pearls'):'Reach Hollow Trench to start over for Wisdom Pearls'}</div></div></div>`;
  const goals=`<div class="jsec q8-sec" data-q8sec="Goals"><h2>Goals</h2>${goal}${live}${ready}<h5>Your journey</h5><div class="q8-journey">${jr}</div></div>`;
  /* lessons, grouped */
  const groups=[...new Set(Q8_LESSONS.map(l=>l[1]))];
  const learn=`<div class="jsec q8-sec" data-q8sec="Learn"><h2>Learn</h2><p class="meta q8-intro">Short lessons, one tap each. Tap a lesson to open it; read ones get a tick.</p>${groups.map(g=>`<h5>${esc(g)}</h5><div class="q8-lessons">${Q8_LESSONS.filter(l=>l[1]===g).map(([id,,t,one,body,go])=>`<details class="tile q8-lesson${read.includes(id)?' read':''}" data-q8id="${id}"><summary><span class="q8-tick" aria-hidden="true">${read.includes(id)?'✓':''}</span><span class="q8-st"><b>${esc(t)}</b><span class="meta">${esc(one)}</span></span></summary><div class="q8-body">${body}</div>${go?`<button class="btn alt sm" data-q8go="${go[0]}"${go[1]?` data-q8s='${esc(JSON.stringify(go[1]))}'`:''}>Take me there</button>`:''}</details>`).join('')}</div>`).join('')}</div>`;
  /* find anything */
  const F=Q8_FIND(); const places=[...new Set(F.map(f=>f[0]))];
  const find=`<div class="jsec q8-sec" data-q8sec="Find"><h2>Find</h2><input class="q8-filter" type="search" placeholder="Find anything: bait, pets, relics…" aria-label="Find a page" autocomplete="off"><div class="q8-find">${places.map(pl=>`<div class="q8-place" data-q8place><h5>${esc(pl)}</h5>${F.filter(f=>f[0]===pl).map(([,l,tab,sect])=>`<div class="tile q8-row q8-fi" data-q8k="${esc((l+' '+pl).toLowerCase())}"><b>${esc(l)}</b><button class="btn alt sm" data-q8go="${tab}"${sect?` data-q8s='${esc(JSON.stringify(sect))}'`:''}>Go</button></div>`).join('')}</div>`).join('')}<p class="meta q8-none" hidden>Nothing by that name. Try the search button in the top bar for more.</p></div></div>`;
  const help=`<div class="jsec q8-sec" data-q8sec="Help"><h2>Help</h2><div class="q8-lessons">${Q8_HELP.map(([q,a,go,gl])=>`<details class="tile q8-lesson q8-faq"><summary><span class="q8-tick" aria-hidden="true">?</span><span class="q8-st"><b>${esc(q)}</b></span></summary><div class="q8-body">${a}</div><button class="btn alt sm" data-q8go="${go[0]}"${go[1]?` data-q8s='${esc(JSON.stringify(go[1]))}'`:''}>${esc(gl)}</button></details>`).join('')}</div></div>`;
  return `<div class="row spread"><div><h2 class="dl-dup">Quests</h2></div></div>${goals}${learn}${find}${help}`; }
{ /* drawn through the game's normal page drawing (unknown pages fall back to renderCooler) */
  const _rc=renderCooler; renderCooler=function(P){ if(MOB()&&S.tab==='quests'&&P){ P.innerHTML=q8html(); return; } return _rc.apply(this,arguments); };
  /* taps inside the page */
  document.addEventListener('click',e=>{ const P=$('panel'); if(!P||S.tab!=='quests'||!P.contains(e.target)) return;
    if(e.target.closest('[data-q8goal]')){ e.stopPropagation(); q8goal(); return; }
    const g=e.target.closest('[data-q8go]'); if(g){ e.stopPropagation(); let s=g.dataset.q8s||null; if(s&&(s[0]==='['||s[0]==='"')) try{ s=JSON.parse(s); }catch(er){} q8go(g.dataset.q8go,s); } },true);
  document.addEventListener('toggle',e=>{ const d=e.target; if(!(d instanceof HTMLDetailsElement)||!d.open||!d.dataset.q8id) return; const r=Q8.read(); if(!r.includes(d.dataset.q8id)){ r.push(d.dataset.q8id); save(); d.classList.add('read'); const t=d.querySelector('.q8-tick'); if(t) t.textContent='✓'; const c=$('panel').querySelector('.pg08-bank'); if(c){ const cell=[...c.children].find(x=>/^Lessons read/.test((x.querySelector('.sub')||{}).textContent||'')); if(cell){ const b=cell.querySelector('b'); if(b) b.textContent=r.filter(id=>Q8_LESSONS.some(l=>l[0]===id)).length+' / '+Q8_LESSONS.length; } } } },true);
  document.addEventListener('input',e=>{ const f=e.target; if(!f.classList||!f.classList.contains('q8-filter')) return; const q=f.value.trim().toLowerCase(), box=f.closest('.q8-sec'); let any=0;
    box.querySelectorAll('.q8-fi').forEach(r=>{ const on=!q||q.split(/\s+/).every(w=>r.dataset.q8k.includes(w)); r.hidden=!on; if(on) any++; }); box.querySelectorAll('[data-q8place]').forEach(p=>{ p.hidden=![...p.querySelectorAll('.q8-fi')].some(r=>!r.hidden); }); const n=box.querySelector('.q8-none'); if(n) n.hidden=!!any; });
  /* the side-panel badge: 1 when your goal is ready */
  setInterval(()=>{ try{ const b=$('tabs').querySelector(':scope > [data-tab="quests"] .dot'); if(!b) return; const on=!!Q8.goal().ready; if(b.hidden===on){ b.hidden=!on; b.textContent=on?'1':''; } }catch(e){} },1500);
}
document.head.insertAdjacentHTML('beforeend',`<style>
html body.phone-land #menuov #panel.pg08[data-pg-tab="quests"] .q8-sec > h2,html body.phone-app #menuov #panel.pg08[data-pg-tab="quests"] .q8-sec > h2{display:none!important}
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
/* line icons for the new pages' tabs at the top of the menu (the theme masks an icon per page; a page without one showed a square) */
{ const ico=d=>'url("data:image/svg+xml,'+encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">'+d+'</svg>')+'")';
  const I8={ bait:'<path d="M12 3v9a4 4 0 1 1-8 0v-1"/><path d="M12 3h3"/><path d="M4 11l-2 2"/><path d="M15 14c2-1 4 0 5 2"/>', quests:'<circle cx="12" cy="12" r="8.5"/><path d="m15.5 8.5-2.2 4.8-4.8 2.2 2.2-4.8z"/>', oddities:'<path d="M8 3h6v8l5 3.5V20H6.5L5 18v-4.5L8 11z"/><path d="M8 7h6M5.5 16h13"/>', prestige:'<circle cx="12" cy="13" r="6.5"/><path d="M9.2 10.6a3.4 3.4 0 0 1 3-1.8"/><path d="M12 3.5v2M6.2 5.6l1.3 1.5M17.8 5.6l-1.3 1.5"/>' };
  document.head.insertAdjacentHTML('beforeend','<style>'+Object.keys(I8).map(k=>`html body.phone-app #menuov .subbar .subp[data-sub="${k}"] .subi,html body.phone-land #menuov .subbar .subp[data-sub="${k}"] .subi{-webkit-mask:${ico(I8[k])} center/contain no-repeat;mask:${ico(I8[k])} center/contain no-repeat}`).join('\n')+'</style>'); }
/* Collection holds the Trophy Room and Oddities: the Aquarium opens from its own chip in the top bar (director, 2026-11-18) */
{ const c=MENU_SECS.find(s=>s.id==='coll'); if(c) c.tabs=c.tabs.filter(t=>t!=='aquarium'); }
/* SEARCH (director, 2026-11-18: "the search menu doesn't work properly and is at the top menu of all side panel full UIs. It only needs
   to be at the front of the upper panel"):
   - search lives on the fishing screen's top bar only; the menus' top row no longer repeats it
   - picking a page from the empty-search map now opens it (it only switched the page behind the scenes when no menu was open)
   - the map starts with the Top bar pages (Cooler, Aquarium, Home, Bait, Fish Log, Tasks); results say "Top bar" / "Settings" instead
     of "Menu"; the same result never shows twice */
{ const TOP={cooler:1,aquarium:1,home:1,bait:1,journal:1,bounties:1};
  const where=t=>{ if(TOP[t]) return 'Top bar'; try{ const s=menuSecOf(t); if(s) return s.id==='more'?'Settings':s.name; }catch(e){} return t==='settings'||t==='save'?'Settings':''; };
  const _sf=searchFind; searchFind=function(q){ const r=_sf.apply(this,arguments); if(!MOB()) return r; const seen=new Set(); return r.filter(e=>{ const k=e[0]+'|'+e[1]; if(seen.has(k)) return false; seen.add(k); return true; }); };
  const res=$('searchres'), ov=$('searchov');
  if(res&&ov){ new MutationObserver(()=>{ if(!MOB()) return;
      const map=res.querySelector('.sv-map'); if(map&&!map.querySelector('.sv8-top')) map.insertAdjacentHTML('afterbegin',`<div class="sv-sec sv8-top"><div class="sv-sec-h">Top bar</div>${Object.keys(TOP).map(t=>`<button type="button" class="sv-r sv-p" data-tab="${t}"><b>${esc((menuTabLabel(t)||[])[1]||t)}</b><span class="meta">${esc((typeof PAGE_DESC==='object'&&PAGE_DESC[t])||'')}</span></button>`).join('')}</div>`);
      res.querySelectorAll('.sv-r[data-i] .meta').forEach(m=>{ if(m.dataset.sv8) return; m.dataset.sv8='1'; const b=m.closest('.sv-r'), name=(b.querySelector('b')||{}).textContent||''; const e=SEARCH_IDX.find(x=>x[0]===name); if(e){ const w=where(e[1]); if(w) m.textContent=w; } });
    }).observe(res,{childList:true,subtree:true});
    ov.addEventListener('click',e=>{ if(!MOB()) return; const b=e.target.closest('.sv-p'); if(!b) return; e.stopImmediatePropagation(); e.stopPropagation(); ov.hidden=true; try{ if(MENU_OPEN){ setTab(b.dataset.tab); save(); } else openMenu(b.dataset.tab); }catch(er){ try{ openMenu(b.dataset.tab); }catch(e2){} } },true); }
  document.head.insertAdjacentHTML('beforeend','<style>html body.phone-land #menuov .mo-tb[title^="Search"],html body.phone-app #menuov .mo-tb[title^="Search"]{display:none!important}</style>'); }
/* the settings button is a gear again (director, 2026-11-18: "settings logo should go back to being a gear, it makes way more sense") */
{ const g='<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>';
  const u='url("data:image/svg+xml,'+encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">'+g+'</svg>')+'")';
  document.head.insertAdjacentHTML('beforeend',`<style>html body.phone-land .hud > .hudbtns > #settingsbtn::before,html body.phone-app .hud > .hudbtns > #settingsbtn::before,html body.phone-land #menuov .mo-tools .mo-tb:not([data-mo="search"])::before,html body.phone-app #menuov .mo-tools .mo-tb:not([data-mo="search"])::before{-webkit-mask:${u} center/contain no-repeat!important;mask:${u} center/contain no-repeat!important}</style>`); }
/* test builds: window.__searchQC() opens every search entry the way a tap does and checks it lands on its page (and section), then
   opens every page from the empty-search map. Part of every final QC (director, 2026-11-18). Returns {checked, bad[]}. */
if(/[?&]test\b/.test(location.search)) window.__searchQC=async()=>{ const w=ms=>new Promise(r=>setTimeout(r,ms)), bad=[]; let n=0; const ov=$('searchov'), q=$('searchq');
  const open=()=>{ try{ closeMenu(); }catch(e){} const b=$('searchbtn'); if(b) b.click(); };
  for(const e of SEARCH_IDX.slice()){ open(); await w(120); q.value=e[0].replace(/[^A-Za-z0-9 ]+/g,' ').replace(/ +/g,' ').trim(); /* typed like a player: words, no punctuation */ q.dispatchEvent(new Event('input',{bubbles:true})); await w(80);
    const btn=[...ov.querySelectorAll('.sv-r[data-i]')].find(x=>(x.querySelector('b')||{}).textContent===e[0]); if(!btn){ bad.push('not found: '+e[0]); continue; }
    if(/^(|Menu)$/.test(((btn.querySelector('.meta')||{}).textContent||'').trim())) bad.push('no location: '+e[0]);
    btn.click(); await w(260); n++; if(S.tab!==e[1]||!MENU_OPEN){ bad.push(e[0]+' -> '+S.tab+(MENU_OPEN?'':' (menu closed)')); continue; }
    if(typeof e[2]==='string'){ const s=$('panel').querySelector('.bwx-nav [aria-selected="true"]'), has=[...$('panel').querySelectorAll('.bwx-nav [data-sect]')].some(x=>x.dataset.sect.startsWith(e[2])); /* a section this save doesn't have (e.g. Find more when every pet is owned) is not a fault */ if(s&&has&&!s.textContent.trim().startsWith(e[2])&&!s.dataset.sect?.startsWith(e[2])) bad.push(e[0]+' section '+s.textContent.trim()); } }
  open(); await w(150); q.value=''; q.dispatchEvent(new Event('input',{bubbles:true})); await w(150); const tabs=[...ov.querySelectorAll('.sv-p')].map(b=>b.dataset.tab);
  for(const t of tabs){ open(); await w(120); q.value=''; q.dispatchEvent(new Event('input',{bubbles:true})); await w(100); const b=[...ov.querySelectorAll('.sv-p')].find(x=>x.dataset.tab===t); if(!b){ bad.push('map missing '+t); continue; } b.click(); await w(260); n++; if(S.tab!==t||!MENU_OPEN) bad.push('map '+t+' -> '+S.tab+(MENU_OPEN?'':' (menu closed)')); }
  try{ closeMenu(); }catch(e){} ov.hidden=true; return {checked:n, mapPages:tabs.length, bad}; };
/* test builds: window.__questsQC() taps Show me (your goal) and every Take me there / Go / help button in Quests and checks each lands on
   its page (and section; Tackle views too). Part of every final QC with the search check (director, 2026-11-18). */
if(/[?&]test\b/.test(location.search)) window.__questsQC=async()=>{ const w=ms=>new Promise(r=>setTimeout(r,ms)), bad=[]; let n=0; const P=()=>$('panel');
  const nav=s=>{ const x=[...P().querySelectorAll('.bwx-nav > button')].find(b=>b.textContent.trim()===s); if(x) x.click(); return !!x; };
  /* Show me (first let any earlier check's menu close finish: run right after __searchQC it used to collide) */ try{ closeMenu(); }catch(e){} await w(700); openMenu('quests'); await w(250); nav('Goals'); await w(80); const gl=Q8.goal(); const sm=P().querySelector('[data-q8goal]'); if(!sm) bad.push('no Show me'); else { sm.click(); await w(300); n++; if(gl.tab){ if(S.tab!==gl.tab||!MENU_OPEN) bad.push('Show me -> '+S.tab+' (want '+gl.tab+')'); } else if(MENU_OPEN) bad.push('Show me should return to the water'); }
  for(const part of ['Goals','Find','Learn','Help']){ openMenu('quests'); await w(250); nav(part); await w(80); const cnt=P().querySelectorAll('.q8-sec[data-q8sec="'+part+'"] [data-q8go]').length;
    for(let i=0;i<cnt;i++){ openMenu('quests'); await w(220); if(!nav(part)){ bad.push('no '+part+' tab'); break; } await w(60); const b=P().querySelectorAll('.q8-sec[data-q8sec="'+part+'"] [data-q8go]')[i]; if(!b) break; const want=b.dataset.q8go; let ws=b.dataset.q8s||''; try{ ws=JSON.parse(ws); }catch(e){}
      const label=((b.closest('.q8-fi,details,.q8-row')||b).querySelector('b')||{}).textContent||want; b.click(); await w(300); n++; let ok=S.tab===want&&MENU_OPEN;
      if(ok&&typeof ws==='string'&&ws){ const s=P().querySelector('.bwx-nav [aria-selected="true"]'); ok=!!s&&s.textContent.trim().startsWith(ws); }
      if(ok&&Array.isArray(ws)&&ws[0]==='tackleview') ok=tackleView===ws[1]||S.tab==='shop';
      if(!ok) bad.push(part+' "'+label.slice(0,30)+'" -> '+S.tab+' (want '+want+' '+JSON.stringify(ws)+')'); } }
  try{ closeMenu(); }catch(e){} return {checked:n, bad}; };
/* search entries on phones: no keyboard shortcuts (touch screens); Save & codes lives in Save now; "Dock" entries say Home */
try{ for(let i=SEARCH_IDX.length-1;i>=0;i--){ const e=SEARCH_IDX[i]; if(e[1]==='__keys'||e[0]==='Keyboard shortcuts'){ if(typeof MOB==='function') SEARCH_IDX.splice(i,1); continue; }
    if(e[1]==='settings'&&/Save & codes/.test(e[2]||'')) SEARCH_IDX[i]=['Save codes and gift codes','save','Save codes',e[3]+' gift'];
    if(/^Dock:/.test(e[0])) SEARCH_IDX[i]=[e[0].replace(/^Dock:/,'Home:'),e[1],e[2],e[3]]; } }catch(e){}
/* section names that carry a count ("Find more · 30") still match a plain name from search, Quests or a link ("Find more"); search sets
   the section before it opens the page, so it opens right there */
{ const _sz=sectionize; sectionize=function(P,tab,groups,before){ try{ const s=SECT[tab]; if(s&&groups&&!groups.some(g=>g.name===s)){ const g=groups.find(g=>g.nodes&&g.nodes.length&&String(g.name).startsWith(s)); if(g) SECT[tab]=g.name; } }catch(e){} return _sz.apply(this,arguments); };
  const _sg=searchGo; searchGo=function(e){ try{ if(MOB()&&e&&typeof e[2]==='string') SECT[e[1]]=e[2]; }catch(er){} return _sg.apply(this,arguments); }; }
