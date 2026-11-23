// =====================================================================
// Every water's home (batch 5, 2026-11-22; designs in docs/HOME_DESIGNS.md, colours in docs/MAP_THEMES.md). Willow Pond (the
// approved pilot) is in cv_homefmt.js; these 19 are built from the home kit (cw_homekit.js). Each home: the seat plus 5 features
// made for that water, 3 styles each ("none" first where a feature can be left out), one list of 16 colours for every feature.
// A home listed here replaces that water's older home (the scene draws HOMEF homes instead, f_v3scene.js).
// =====================================================================
function hfMake(id,d){ d.seatH=d.seat.map(k=>HK.seatH(k));
  d.els.push({id:'seat',label:'Seat',styles:d.seatNames,def:d.seatDef||[0,0],pal:d.seatPal}); /* a home may limit its seats to real colours (seatPal) */
  d.paint=function(o){ o.lights=[]; const col=e=>hfColor(id,e);
    for(const [e,fn] of d.order){ o.elCol=col(e); /* lights read their feature's colour (a stove's body, director 2026-11-22: colours did nothing) */ const r=e==='seat'?HK.seat(o,d.seat[hfStyle(id,'seat')],col('seat')):fn(o,hfStyle(id,e),col(e),col); if(r&&r.x!=null) o.lights.push(r); } };
  HOMEF[id]=d; }
const C16=s=>s.split(';').map(p=>{ const [n,h]=p.split('='); return [n.trim(),h.trim()]; });
/* 1. Willow Pond: the boathouse (overnight, 2026-11-23; its own design, src/cw_pondhouse.js): a gable-end boathouse over the water with its
   boat bay at the waterline, a cupola on the ridge and a lean-to porch along its side; a pine bank behind it, round piles under the deck */
{ const PW=C16('Honey pine=#b98a5a;Weathered pine=#8a6a4a;Dark stain=#5a4030;Driftwood=#9a9488;Moss=#5f8a6c;Pine green=#2c4a3e;Sage=#9ab08a;Willow=#7fae5c;Lake teal=#3f827b;Sky blue=#86bcd9;Canvas=#f3e4ca;Warm white=#f4efe6;Barn red=#a8483a;Lantern gold=#e8b04a;Dusk rose=#c97a8a;Lilac=#8a7aa8');
  const G1=()=>PH.geo({pw:HF.pw(),dockY:HF.dockY()}), LT=()=>{ const g=G1(); return {x0:g.xb,x1:g.x1,vx:g.xb,wallTop:g.lt,winA:g.xb+W*.014,winB:g.x1-W*.03}; };
  hfMake('pond',{ name:'Boathouse', hname:'boathouse', glow:'255,210,140', seatX:()=>HF.pw()-W*.028, colors:PW, front:null, smoke:null,
    els:[{id:'walls',label:'Walls',styles:['Board and batten','Shiplap','Cedar shingles'],def:[0,12],pal:[0,1,2,3,4,5,6,8,10,11,12]},
         {id:'roof',label:'Roof',styles:['Asphalt shingles','Cedar shakes','Tin roof'],def:[1,1],palS:[[2,3,4,5,12],[0,1,2,3],[3,4,5,8,9,11,12]]},
         {id:'cupola',label:'Cupola',styles:['Cupola with a fish vane','Rooster weathervane','Little bell'],def:[0,11],pal:[0,1,2,4,5,10,11,12]},
         {id:'bay',label:'Boat bay',styles:['Open, canoe inside','Swing doors','Sliding door'],def:[0,11],pal:[0,1,2,4,5,8,10,11,12]},
         {id:'windows',label:'Windows',styles:['Four-pane windows','Windows with flower boxes','Shuttered windows'],def:[0,11],pal:[0,1,2,4,5,8,9,10,11,12]},
         {id:'light',label:'Lantern',light:true,styles:['Hurricane lantern','Lamp post','String lights'],def:[0,13],pal:[2,3,5,12,13]}],
    seat:['deckchair','logbench','campchair'], seatNames:['Wooden folding chair','Log bench','Camp chair'], seatDef:[0,0], seatPal:[0,1,2,4,5,8,9,10,12,13],
    order:[
      ['base',(o)=>{ PH.ground(o); BH.piles(o,'log','#8a6a4a'); HK.deck(o,'#b98a5a','planks'); }],
      ['walls',(o,s,c)=>{ const g=PH.geo(o), K=['batten','shiplap','shingles'][s]; PH.leanTo(o,g,K,c,['shingles','shakes','tin'][hfStyle('pond','roof')],hfColor('pond','roof')); }],
      ['windows',(o,s,c)=>BH.windows(o,LT(),['four','boxes','shutters'][s],c)],
      ['bay',(o,s,c)=>{ const g=PH.geo(o); PH.block(o,g,['batten','shiplap','shingles'][hfStyle('pond','walls')],hfColor('pond','walls'),['shingles','shakes','tin'][hfStyle('pond','roof')],hfColor('pond','roof'),s,c); }],
      ['roof',()=>{}],
      ['cupola',(o,s,c)=>PH.cupola(o,PH.geo(o),s,c)],
      ['light',(o,s,c)=>BH.lantern(o,LT(),['hurricane','lamppost','string'][s],c)],
      ['seat']] }); }
/* 2. Stonebrook River: the mill house (overnight, 2026-11-23; its own design, src/cw_millhouse.js): a two-storey stone mill house over the
   mill race with the river running through its arch, a dormer with a hoist, a steep roof and a chimney; a stone retaining wall with steps,
   ferns and foxgloves around it; the deck runs along its front as a walkway */
{ const G2=()=>MH.geo({pw:HF.pw(),dockY:HF.dockY()}), LW=()=>{ const g=G2(), fl=g.wallTop+(HF.dockY()-g.wallTop)*.48; return {x0:g.x0,x1:g.x1,vx:g.vx,wallTop:fl,winA:g.x0+(g.x1-g.x0)*.5,winB:g.x1-W*.026}; };
  hfMake('river',{ name:'Mill house', hname:'mill house', glow:'255,205,140', seatX:()=>HF.pw()-W*.026,
    colors:C16('River stone=#bab2a2;Dark stone=#8a8478;Slate=#5a6470;Mill oak=#7a5a3e;Dark oak=#4a3626;Roof brick=#7a4a3a;Iron=#3a3a40;Moss=#6a9a5e;Fern=#4f8050;River blue=#5a9aa4;Deep teal=#28525e;Sky=#a8d0ec;Birch white=#eef0e2;Autumn orange=#c8783a;Maple red=#a8402e;Wheat=#d8c08a'),
    front:null, smoke:(n,t)=>BH.smoke(n,t,MH.chimTop(G2(),['stone','brick','pipe'][hfStyle('river','chimney')]),hfStyle('river','chimney')===2?.7:1),
    els:[{id:'walls',label:'Walls',styles:['Fieldstone','Whitewashed stone','Timber frame'],def:[0,0],palS:[[0,1,2],[12,0,15],[12,15,0]]},
         {id:'roof',label:'Roof',styles:['Slate','Cedar shakes','Thatch'],def:[0,2],palS:[[2,1,5,6],[3,4,1],[15,3,13]]},
         {id:'dormer',label:'Dormer',styles:['Hoist and flour sack','Dormer window','Pigeon loft'],def:[0,3],pal:[3,4,6,9,10,14]},
         {id:'chimney',label:'Chimney',styles:['Fieldstone','Brick','Stovepipe'],def:[0,1],palS:[[0,1,2],[5,14,13],[6,4,10]]},
         {id:'door',label:'Door',styles:['Plank door','Dutch door','Arched door'],def:[2,3],pal:[3,4,5,7,8,9,10,14]},
         {id:'windows',label:'Windows',light:true,styles:['Four-pane windows','Arched windows','Shuttered windows'],def:[1,4],pal:[3,4,5,7,8,9,10,14]}],
    seat:['stump','gardenbench','barrel'], seatNames:['Stump stool','Slatted bench','Barrel'], seatDef:[1,3], seatPal:[0,1,3,4,7,8,13,14,15],
    order:[
      ['base',(o)=>{ MH.ground(o); BH.piles(o,'stone','#8a8478'); }],
      ['chimney',(o,s,c)=>MH.chimney(o,G2(),['stone','brick','pipe'][s],c)],
      ['walls',(o,s,c)=>{ const K=['stone','stone','plaster'][s]; MH.walls(o,MH.geo(o),K,s===1?mix('#f6f2ea',c,.1):c); }],
      ['door',(o,s,c)=>BH.door(o,LW(),['plank','dutch','arched'][s],c)],
      ['windows',(o,s,c)=>BH.windows(o,LW(),['four','arched','shutters'][s],c)],
      ['roof',(o,s,c)=>MH.roof(o,MH.geo(o),['tiles','shakes','thatch'][s],c)],
      ['dormer',(o,s,c)=>{ const g=MH.geo(o), ws=hfStyle('river','walls'); MH.dormer(o,g,s,c,['stone','stone','plaster'][ws],ws===1?mix('#f6f2ea',hfColor('river','walls'),.1):hfColor('river','walls'),null,hfColor('river','roof')); HK.deck(o,'#7a5a3e','boards'); }],
      ['seat']] }); }
/* 3. Cherry Blossom Lake: the tea house (overnight, 2026-11-23; its own design, src/cw_teahouse.js, inspired by the director's reference
   picture docs/reference/blossom_director_ref.png): a tea house raised on red-lacquered posts with a layered irimoya roof whose eaves curve
   up at the tips, shoji walls between dark posts, paper lanterns under the eaves and a veranda deck with a thick rope railing; a mossy bank
   with a stone path, bamboo fence and azaleas behind it, and a big cherry tree framing the top-left corner */
{ const G3=()=>TH.geo({pw:HF.pw(),dockY:HF.dockY()}), WN=()=>{ const g=G3(); return Object.assign({},g,{winA:g.vx+W*.06,winB:g.x1-W*.03}); };
  hfMake('blossom',{ name:'Tea house', hname:'tea house', glow:'255,200,150', seatX:()=>HF.pw()-W*.028,
    colors:C16('Lacquer red=#b8322a;Vermilion=#d8503a;Cedar=#9a6a42;Dark cedar=#5a3a26;Black lacquer=#2a2426;Paper white=#f4ece0;Rice beige=#e0d0b0;Bamboo=#b8b06a;Moss=#6a8a52;Jade=#5a9a9a;Deep jade=#1e4a58;Blossom pink=#f4a8c4;Pale sakura=#ffe4ee;Wisteria=#a88ac8;Lantern amber=#f0a848;Stone grey=#9a948a'),
    front:(n,cx)=>{ TH.tree(n,cx); TH.rail(n,cx,hfStyle('blossom','rail'),hfColor('blossom','rail')); }, smoke:null,
    els:[{id:'walls',label:'Walls',styles:['Shoji screens','Plaster and timber','Bamboo'],def:[0,3],palS:[[2,3,4,0],[5,6],[7,2]]},
         {id:'roof',label:'Roof',styles:['Curved clay tiles','Cypress bark','Copper'],def:[0,4],palS:[[4,15,3,10],[2,3],[9,10,2]]},
         {id:'light',label:'Lanterns',light:true,styles:['Two paper lanterns','Row of small lanterns','Stone lantern'],def:[0,0],palS:[[0,1,5,11,14],[0,1,5,11,14],[15,4]]},
         {id:'rail',label:'Railing',styles:['Rope railing','Bamboo railing','Open deck'],def:[0,2],pal:[0,2,3,4,7]},
         {id:'door',label:'Door',styles:['Sliding shoji','Plank door','Noren curtain'],def:[2,10],palS:[[2,3,4,0],[2,3,4,0],[0,10,13,4,5,9]]},
         {id:'windows',label:'Windows',styles:['Shoji windows','Round window','Lattice windows'],def:[1,3],pal:[2,3,4,0]}],
    seat:['cushion','lowbench','stool'], seatNames:['Zabuton cushion','Bamboo bench','Lacquer stool'], seatDef:[0,0], seatPal:[0,1,4,5,6,7,9,10,11,13],
    order:[
      ['base',(o)=>{ TH.ground(o); BH.piles(o,'square','#b8322a'); HK.deck(o,'#9a6a42','boards'); }],
      ['walls',(o,s,c)=>TH.walls(o,TH.geo(o),s,c,'#3a2420')],
      ['door',(o,s,c)=>BH.door(o,TH.geo(o),['shoji','plank','noren'][s],c)],
      ['windows',(o,s,c)=>BH.windows(o,WN(),['shoji','round','four'][s],c)],
      ['roof',(o,s,c)=>TH.roof(o,TH.geo(o),s,c)],
      ['light',(o,s,c)=>TH.lanterns(o,TH.geo(o),s,c)],
      ['rail',()=>{}],
      ['seat']] }); }
/* 4. Saltmarsh Coast: the lobster shack (overnight, 2026-11-23; its own design, src/cw_saltshack.js): a tall saltbox shack at the end of a long
   weathered pier, seen from its gable end, with a stovepipe; buoys on its wall, lobster pots or a drying net; the pier's tarred pilings with
   bracing, barnacles and weed, a ladder with a dory tied to it and a gull on the mooring piling */
{ const G4=()=>SS.geo({pw:HF.pw(),dockY:HF.dockY()}), WN=()=>{ const g=G4(); return {x0:g.x0,x1:g.x1,vx:g.vx,wallTop:g.wallTop,winA:g.x0+g.w*.36,winB:g.x0+g.w*.6}; };
  hfMake('coast',{ name:'Lobster shack', hname:'lobster shack', glow:'255,210,150', seatX:()=>HF.pw()-W*.03,
  colors:C16('Driftwood=#a8a090;Silver-grey=#8a8a84;Tar black=#2e2a28;Weathered blue=#5a7a8a;Sea glass=#9adcd8;Sea teal=#3aa0a8;Deep sea=#145a6a;Sand=#e8d6a4;Dune grass=#8aa85a;Rope tan=#c8a878;Buoy red=#c8483a;Buoy yellow=#e8c04a;Lighthouse white=#f4f0e6;Shingle brown=#6a5440;Gull grey=#c8ccd0;Oilskin yellow=#d8b030'),
  front:null, smoke:null,
  els:[{id:'siding',label:'Siding',styles:['Cedar shingles','Clapboard','Board and batten'],def:[0,1],palS:[[0,1,13,14],[3,10,12,6,14],[0,1,3,10,12]]},
       {id:'roof',label:'Roof',styles:['Asphalt shingles','Cedar shakes','Tin roof'],def:[0,2],palS:[[2,1,6,13],[13,0,1],[1,14,10,3]]},
       {id:'door',label:'Door',styles:['Plank door','Dutch door','Arched door'],def:[0,10],pal:[2,3,5,6,10,11,12,15]},
       {id:'windows',label:'Windows',light:true,styles:['Four-pane windows','Porthole windows','Shuttered windows'],def:[0,12],pal:[2,3,5,6,10,12,15]},
       {id:'tackle',label:'Fishing gear',styles:['Buoys on the wall','Lobster pots','Drying net'],def:[0,10],palS:[[10,11,12,5,15],[13,0,3,10],[5,8,9,6]]},
       {id:'light',label:'Lamp',styles:['Ship’s lantern','Harbour lamp','Buoy light'],def:[0,13]}],
  seat:['crate','bucket','driftbench'], seatNames:['Fish crate','Upturned bucket','Driftwood bench'], seatDef:[0,0],
  order:[
    ['base',(o)=>{ SS.ground(o); HK.deck(o,'#a8a090','boards'); }],
    ['siding',(o,s,c)=>SS.walls(o,SS.geo(o),['shingles','clapboard','batten'][s],c)],
    ['door',(o,s,c)=>BH.door(o,SS.geo(o),['plank','dutch','arched'][s],c)],
    ['windows',(o,s,c)=>BH.windows(o,WN(),['four','porthole','shutters'][s],c)],
    ['roof',(o,s,c)=>SS.roof(o,SS.geo(o),s,c)],
    ['tackle',(o,s,c)=>SS.gear(o,SS.geo(o),s,c)],
    ['seat'],
    ['light',(o,s)=>HK.light(o,['hook','lighthouse','buoy'][s])]] }); }

/* 5. Frostbite Lake: the ice shanty (overnight, 2026-11-23; its own design, src/cw_icehut.js): a timber fish house on sled skids standing on
   the ice shelf, a steep roof under a snow cap with icicles, a stovepipe with smoke, a window glowing at night; drifts against its walls,
   footprints to a tip-up over its hole, a box sled beside it. The old tent, igloo, stove, hole and sled choices became this one building */
{ const G5=()=>FS.geo({pw:HF.pw(),dockY:HF.dockY()}), WN=()=>{ const g=G5(); return {x0:g.x0,x1:g.x1,vx:g.x0,wallTop:g.wallTop,winA:g.x0+g.w*.45,winB:g.x0+g.w*.72}; }, DR=()=>{ const g=G5(); return {x0:g.x0,x1:g.x1,vx:g.x0,wallTop:g.wallTop}; };
hfMake('frost',{ name:'Ice shanty', hname:'ice shanty', ice:true, glow:'255,190,120', seatX:()=>HF.pw()-W*.03,
  colors:C16('Snow white=#f6f8ff;Frost=#d8e8f6;Ice blue=#8aaad0;Glacier=#4a6a9a;Deep ice=#1a2a4a;Spruce=#3e5a78;Birch=#e8e0d0;Birch bark=#4a4440;Timber=#7a5440;Dark timber=#4a3428;Wool red=#b8383a;Wool cream=#f0e6d0;Stove iron=#2a2a30;Lantern orange=#f0983a;Aurora green=#7af0b0;Dusk mauve=#9a88b8'),
  front:null, smoke:(n,t)=>BH.smoke(n,t,FS.chimTop(G5(),hfStyle('frost','chimney')),.8),
  els:[{id:'walls',label:'Walls',styles:['Painted boards','Shiplap','Canvas over a frame'],def:[0,10],palS:[[10,5,3,8,6,15],[8,9,6],[11,10,5,3]]},
       {id:'roof',label:'Roof',styles:['Tin roof','Shingles','Canvas'],def:[0,12],palS:[[12,3,10,5],[9,7,12],[11,5,10]]},
       {id:'chimney',label:'Stovepipe',styles:['Straight pipe','Capped pipe','Elbow pipe'],def:[0,12],pal:[12,7,9,13]},
       {id:'door',label:'Door',styles:['Plank door','Dutch door','Arched door'],def:[0,9],pal:[9,8,10,11,5,3]},
       {id:'windows',label:'Windows',light:true,styles:['Four-pane windows','Round windows','Shuttered windows'],def:[0,11],pal:[11,9,10,5,3,6]},
       {id:'gear',label:'Gear',styles:['Hand auger','Bait bucket','Catch on the ice'],def:[0,10]}],
  seat:['bucket','furbench','icechair'], seatNames:['Bucket stool','Fur bench','Ice chair'], seatDef:[0,12],
  order:[
    ['shelf',(o)=>{ const x0=HF.x0(), y=o.dockY, x=o.x, pw=o.pw+W*.012, wl=o.wl, r=v3rng(7); /* the ice shelf the camp stands on: snow on top, blue ice face, ragged foot with icicles, fading into the water */
      const g=x.createLinearGradient(0,y,0,wl+H*.04); g.addColorStop(0,HK.n(o,'#cfe0f4')); g.addColorStop(.6,HK.n(o,'#7a9ac8')); g.addColorStop(1,v3rgba(HK.n(o,'#4a6a9a'),0)); x.fillStyle=g;
      x.beginPath(); x.moveTo(x0,y); x.lineTo(pw,y); let px=pw; for(let k=0;k<=12;k++){ const u=k/12; px=pw-(pw-x0)*u; x.lineTo(px+(k%2?W*.004:-W*.003),wl+H*(.01+r()*.03)); } x.lineTo(x0,y); x.closePath(); x.fill();
      x.strokeStyle=v3rgba('#ffffff',.35); x.lineWidth=1; for(let i=0;i<5;i++){ const cx=x0+(pw-x0)*(.1+i*.2); x.beginPath(); x.moveTo(cx,y+H*.01); x.lineTo(cx+W*.006,y+H*.03); x.lineTo(cx+W*.002,wl); x.stroke(); }
      x.fillStyle=HK.n(o,'#f6f8ff'); x.beginPath(); x.moveTo(x0,y+H*.004); for(let k=0;k<=16;k++){ const u=k/16; x.lineTo(x0+(pw-x0)*u,y-H*(.003+.004*Math.abs(Math.sin(u*9)))); } x.lineTo(pw+W*.004,y+H*.006); for(let k=16;k>=0;k--) x.lineTo(x0+(pw-x0)*k/16,y+H*(.006+.003*((k%3)/2))); x.closePath(); x.fill();
      x.fillStyle=v3rgba('#e8f4ff',.8); for(let i=0;i<9;i++){ const ix=x0+(pw-x0)*(.05+i*.11), ih=H*(.006+r()*.012); x.beginPath(); x.moveTo(ix-W*.002,y+H*.008); x.lineTo(ix+W*.002,y+H*.008); x.lineTo(ix,y+H*.008+ih); x.closePath(); x.fill(); }
      for(let i=0;i<4;i++) o.posts.push({x:x0+(pw-x0)*(i+.5)/4,w:W*.03}); }],
    ['gear',(o,s,c)=>{ const x=HK.at(o,.86), y=o.dockY, sc=HF.sc();
      if(s===0){ HK.line(o,[x,y,x+3*sc,y-26*sc],'#5a5a62',1.6*sc); HK.line(o,[x+1.5*sc,y-13*sc,x+9*sc,y-15*sc],c,1.6*sc); HK.line(o,[x+3*sc,y-26*sc,x-4*sc,y-25*sc],c,1.8*sc); for(let k=0;k<4;k++) HK.line(o,[x-1*sc,y-2*sc-k*2*sc,x+2*sc,y-3*sc-k*2*sc],'#8a8a92',1); } /* a hand auger leaning, its crank and handle in the chosen colour */
      if(s===1){ HK.poly(o,[x-4*sc,y,x+4*sc,y,x+5*sc,y-9*sc,x-5*sc,y-9*sc],c); HK.ell(o,x,y-9*sc,5*sc,1.3*sc,HK.dk(c,.3)); HK.curve(o,x-5*sc,y-9*sc,x,y-15*sc,x+5*sc,y-9*sc,'#5a5a62',1); } /* a bait bucket with its handle */
      if(s===2){ for(const [dx,k] of [[0,1],[7,.8]]){ const fx=x+dx*sc, L=10*sc*k; HK.ell(o,fx,y-1.4*sc,L*.5,1.6*sc*k,mix('#8aa0b8',c,.25)); HK.poly(o,[fx+L*.45,y-1.4*sc,fx+L*.7,y-3*sc*k,fx+L*.7,y+.2*sc],mix('#6a8098',c,.25)); HK.circ(o,fx-L*.32,y-1.8*sc,.8*sc,'#14181e'); } } }], /* two fish laid on the ice */
    ['shanty',(o)=>{ FS.ground(o); FS.skids(o,FS.geo(o)); }],
    ['walls',(o,s,c)=>FS.walls(o,FS.geo(o),['batten','shiplap','canvas'][s],c)],
    ['door',(o,s,c)=>BH.door(o,DR(),['plank','dutch','arched'][s],c)],
    ['windows',(o,s,c)=>BH.windows(o,WN(),['four','round','shutters'][s],c)],
    ['chimney',(o,s,c)=>FS.chimney(o,FS.geo(o),s,c)],
    ['roof',(o,s,c)=>FS.roof(o,FS.geo(o),s,c)],
    ['seat']] }); }

/* 6. Canadian Rockies: the log cabin */
hfMake('rockies',{ name:'Log cabin', hname:'log cabin', glow:'255,205,130', front:(n,cx)=>rkFront(n,cx), smoke:(n,t)=>rkSmoke(n,t), seatX:()=>HF.pw()-W*.028 /* at the deck's edge, close to the water (director, 2026-11-23: "why would anybody ever fish from that far away") */,
  colors:C16('Cedar log=#9a6a42;Spruce log=#7a5a3e;Dark log=#4a3426;Granite=#9a948a;Dark granite=#5a5650;Glacier turquoise=#2a9aa8;Ice teal=#7ad8d8;Deep lake=#0a4858;Spruce green=#2e5040;Moss=#5a7a4a;Snow=#f4f8fc;Flannel red=#b8322a;Flannel black=#2a2626;Maple orange=#d8702a;Birch cream=#ece2cc;Canoe green=#3a6a4a'),
  /* the log cabin (director, 2026-11-22 night: "customise aspects of a log cabin"): a wide log lodge seen from its long side at the back of a
     log deck on a granite ledge. Its walls, roof, chimney, porch, door and windows are the choices, each one real-life option for that part
     in the colours real ones come in (director, 2026-11-23: door and windows are two parts; "tin" any colour; a real sod roof) */
  els:[{id:'walls',label:'Log walls',styles:['Round logs','Dovetailed timbers','Logs on a stone base'],def:[0,0],pal:[0,1,2,8,11,12,13,14,15]},
       {id:'roof',label:'Cabin roof',styles:['Cedar shakes','Tin roof','Sod roof'],def:[0,4],palS:[[0,1,2,3,4,8,12,13,14],[0,2,3,4,5,7,8,10,11,12,13,14,15],[9,8,13,14]]},
       {id:'chimney',label:'Chimney',styles:['Fieldstone','Stovepipe','Brick'],def:[0,3],palS:[[3,4,14,0],[12,2,4,7,8,11,15],[11,13,0,2,14,12]]},
       {id:'porch',label:'Porch',styles:['Open deck','Covered porch','Porch with log rail'],def:[1,1],pal:[0,1,2,8,11,12,13,14,15]},
       {id:'door',label:'Door',styles:['Plank door','Dutch door','Door with a glass pane'],def:[0,11],pal:[0,1,2,5,7,8,11,12,13,14,15]},
       {id:'windows',label:'Windows',light:true,styles:['Four-pane windows','Windows with flower boxes','Shuttered windows'],def:[0,2],pal:[0,1,2,5,7,8,11,12,13,14,15]}],
  seat:['muskoka','stumpblanket','logrocker'], seatNames:['Muskoka chair','Stump and blanket','Log rocker'], seatDef:[0,11], seatPal:[0,1,2,8,11,12,13,14,15],
  order:[
    ['base',(o)=>{ rkShore(o); rkLedge(o); HK.deck(o,'#8a6040','logs'); }],
    ['chimney',(o,s,c)=>{ const C=rkCab(o), x=C.x1-W*.04, w=W*.016, top=C.roofTop-H*.045, y=C.wallTop+H*.01, q=o.x; /* at the lodge's right end; drawn before the roof, which covers its foot */
      if(s===0){ q.save(); q.beginPath(); q.rect(x,top,w,y-top); q.clip(); HK.rect(o,x,top,w,y-top,HK.dk(mix('#8a8680',c,.4),.25)); const r=v3rng(4); for(let yy=top,row=0;yy<y;yy+=H*.008,row++){ for(let xx=x-(row%2)*W*.002;xx<x+w;){ const sw=W*(.003+r()*.003); HK.rect(o,xx+.6,yy+.6,sw-1.2,H*.008-1.2,mix(r()<.5?'#a8a298':'#7a7670',c,.45)); xx+=sw; } } q.restore(); /* fieldstones laid in courses, inside the stack */
        HK.rect(o,x-W*.002,top-H*.006,w+W*.004,H*.007,HK.dk(mix('#6a6660',c,.3),.1)); HK.rect(o,x-W*.002,top-H*.006,w+W*.004,1,v3rgba('#ffffff',.25*HK.lit(o))); } /* the capstone */
      if(s===1){ const px=x+w*.45, pw=Math.max(4,W*.0055), pt=C.roofTop-H*.06, pc=mix('#2a2a30',c,.85), grd=q.createLinearGradient(px-pw/2,0,px+pw/2,0); grd.addColorStop(0,HK.n(o,HK.lt(pc,.25))); grd.addColorStop(.4,HK.n(o,pc)); grd.addColorStop(1,HK.n(o,HK.dk(pc,.35))); q.fillStyle=grd; q.fillRect(px-pw/2,pt,pw,y-pt);
        for(let yy=pt+H*.014;yy<C.roofTop;yy+=H*.014){ HK.rect(o,px-pw/2-.6,yy,pw+1.2,Math.max(1.4,H*.0022),HK.dk(pc,.3)); HK.rect(o,px-pw/2-.6,yy,pw+1.2,.7,v3rgba('#ffffff',.18*HK.lit(o))); } /* crimped joints between the pipe's sections */
        HK.poly(o,[px-pw*1.1,C.roofTop-H*.002,px+pw*1.1,C.roofTop-H*.002,px+pw*.62,C.roofTop-H*.012,px-pw*.62,C.roofTop-H*.012],HK.dk(pc,.15)); /* the storm collar where it leaves the roof */
        HK.circ(o,px+pw*.5+1.5,C.roofTop-H*.022,Math.max(1.4,pw*.22),HK.dk(pc,.4)); HK.rect(o,px+pw*.5+1.5,C.roofTop-H*.0225,pw*.9,Math.max(1,H*.0016),HK.dk(pc,.4)); /* the damper handle */
        q.strokeStyle=HK.n(o,HK.dk(pc,.2)); q.lineWidth=.7; q.beginPath(); for(let k=0;k<3;k++){ q.moveTo(px-pw/2,pt-H*.002-k*H*.0025); q.lineTo(px+pw/2,pt-H*.002-k*H*.0025); } q.moveTo(px-pw*.25,pt); q.lineTo(px-pw*.25,pt-H*.008); q.moveTo(px+pw*.25,pt); q.lineTo(px+pw*.25,pt-H*.008); q.stroke(); /* the spark-arrestor mesh and the cap's legs */
        HK.poly(o,[px-pw*1.5,pt-H*.008,px+pw*1.5,pt-H*.008,px,pt-H*.02],pc); HK.rect(o,px-pw*1.5,pt-H*.008,pw*3,Math.max(1,H*.0016),HK.dk(pc,.35)); } /* the rain cap */
      if(s===2){ const bc=mix('#a8483a',c,.6); q.save(); q.beginPath(); q.rect(x,top,w,y-top); q.clip(); HK.rect(o,x,top,w,y-top,bc); q.strokeStyle=HK.n(o,mix('#d8ccb8',c,.15)); q.lineWidth=.6; q.beginPath(); for(let yy=top,row=0;yy<y;yy+=H*.006,row++){ q.moveTo(x,yy); q.lineTo(x+w,yy); for(let xx=x+(row%2)*w/4;xx<x+w;xx+=w/2){ q.moveTo(xx,yy); q.lineTo(xx,yy+H*.006); } } q.stroke(); q.restore(); /* running-bond bricks, inside the stack */
        HK.rect(o,x-W*.002,top-H*.005,w+W*.004,H*.006,HK.dk(bc,.25)); HK.rect(o,x+w*.2,top-H*.011,w*.22,H*.006,HK.dk(bc,.35)); HK.rect(o,x+w*.58,top-H*.011,w*.22,H*.006,HK.dk(bc,.35)); } }], /* a corbelled cap and two clay flue pots */
    ['walls',(o,s,c)=>{ const C=rkCab(o), x0=C.x0, x1=C.x1, top=C.wallTop, y=o.dockY, n=9, lh=(y-top)/n, ex=W*.003, q=o.x;
      const roundLog=(ly)=>{ HK.rect(o,x0-ex,ly,x1-x0+ex*2,lh-.5,HK.lt(c,.04)); HK.rect(o,x0-ex,ly+lh*.68,x1-x0+ex*2,lh*.32,HK.dk(c,.22)); HK.rect(o,x0-ex,ly+lh*.12,x1-x0+ex*2,1,v3rgba('#ffffff',.12*HK.lit(o))); for(const e of [x0-ex,x1+ex]){ HK.circ(o,e,ly+lh/2,lh*.5,HK.lt(c,.18)); HK.circ(o,e,ly+lh/2,lh*.3,HK.lt(c,.1)); HK.circ(o,e,ly+lh/2,lh*.12,HK.dk(c,.15)); } }; /* a peeled log: rounded shading, its end grain showing at both corners */
      if(s===0) for(let k=0;k<n;k++) roundLog(top+k*lh);
      if(s===1){ const ck=mix('#d8d0bc',c,.15); HK.rect(o,x0-ex,top,x1-x0+ex*2,y-top,ck); /* chinking behind */ const r=v3rng(8);
        for(let k=0;k<n;k++){ const ly=top+k*lh, tc=k%3===1?HK.dk(c,.06):k%3===2?HK.lt(c,.04):c; HK.rect(o,x0-ex,ly+.7,x1-x0+ex*2,lh-1.4,tc); HK.rect(o,x0-ex,ly+lh-2.2,x1-x0+ex*2,1.5,HK.dk(c,.2)); /* a hewn timber, flat faced, the chinking line between */
          q.strokeStyle=HK.n(o,HK.dk(c,.14)); q.lineWidth=.7; q.beginPath(); for(let i=0;i<10;i++){ const ax=x0+(x1-x0)*r(), ay=ly+lh*(.25+r()*.4); q.moveTo(ax,ay); q.lineTo(ax+W*.006,ay+lh*.12); } q.stroke(); /* adze marks */
          for(const [e,d] of [[x0-ex,1],[x1+ex,-1]]){ const cw=W*.007, cx=d>0?e:e-cw; HK.rect(o,cx,ly+.7,cw,lh-1.4,HK.lt(c,k%2?.16:.1)); HK.line(o,[d>0?cx+cw:cx,ly+.7,d>0?cx+cw:cx,ly+lh-.7],HK.dk(c,.3),.8); HK.line(o,[cx+cw*.3,ly+lh*.35,cx+cw*.7,ly+lh*.65],HK.dk(c,.18),.6); } } } /* dovetail corners: the timbers end flush, their end grain in a straight column at each corner */
      if(s===2){ const sb=3, sy=y-sb*lh, r=v3rng(14), ee=ex+lh*.5; /* the stone base and its sill reach out under the log ends, so the corners line up (director, 2026-11-23) */ for(let k=0;k<n-sb;k++) roundLog(top+k*lh); /* logs above a fieldstone base */
        q.save(); q.beginPath(); q.rect(x0-ee,sy,x1-x0+ee*2,y-sy); q.clip(); HK.rect(o,x0-ee,sy,x1-x0+ee*2,y-sy,'#6a6660'); for(let yy=sy,row=0;yy<y;yy+=H*.011,row++){ for(let xx=x0-ee-(row%2)*W*.005;xx<x1+ee;){ const sw=W*(.007+r()*.008), sh=H*.011; o.x.fillStyle=HK.n(o,['#a8a298','#8e8a84','#b4a890','#7e7a76'][Math.floor(r()*4)]); o.x.beginPath(); o.x.roundRect?o.x.roundRect(xx+1,yy+1,sw-2,sh-2,Math.min(sw,sh)*.35):o.x.rect(xx+1,yy+1,sw-2,sh-2); o.x.fill(); HK.rect(o,xx+2,yy+1.5,sw*.5,1,v3rgba('#ffffff',.2*HK.lit(o))); xx+=sw; } } q.restore();
        HK.rect(o,x0-ee,sy-H*.004,x1-x0+ee*2,H*.006,HK.dk(c,.3)); } /* the sill log the walls stand on */
      HK.rect(o,x0,top,x1-x0,H*.005,HK.dk(c,.35)); }],
    ['door',(o,s,c)=>{ const C=rkCab(o), y=o.dockY, dw=W*.018, dh=(y-C.wallTop)*.72, dx=C.vx+W*.012, dk=HK.dk(c,.3), q=o.x;
      HK.rect(o,dx-3,y-dh-3,dw+6,dh+3,HK.dk(mix('#6a4a32',c,.2),.25)); HK.rect(o,dx-3,y-dh-3,dw+6,1,v3rgba('#ffffff',.15*HK.lit(o))); /* the door frame */
      if(s===0){ HK.rect(o,dx,y-dh,dw,dh,c); for(let i=1;i<4;i++) HK.line(o,[dx+dw*i/4,y-dh,dx+dw*i/4,y],dk,.8); for(const yy of [.18,.78]) HK.rect(o,dx,y-dh*(1-yy)-H*.003,dw,H*.006,HK.dk(c,.12)); HK.line(o,[dx+1,y-dh*.18,dx+dw-1,y-dh*.78],HK.dk(c,.12),Math.max(2,H*.004)); /* a ledged and braced plank door: boards, two ledges and the Z brace */
        for(const yy of [.2,.8]) HK.rect(o,dx-1,y-dh*(1-yy)-1,dw*.55,Math.max(2,H*.003),'#2a2a2e'); HK.circ(o,dx+dw*.84,y-dh*.5,1.7,'#2a2a2e'); HK.rect(o,dx+dw*.78,y-dh*.5-.5,dw*.12,1.5,'#2a2a2e'); } /* forged strap hinges and a thumb latch */
      if(s===1){ for(const [y0,y1] of [[y-dh,y-dh*.5],[y-dh*.5,y]]){ HK.rect(o,dx,y0,dw,y1-y0-1,c); for(let i=1;i<4;i++) HK.line(o,[dx+dw*i/4,y0,dx+dw*i/4,y1-1],dk,.8); HK.rect(o,dx-1,y0+H*.006,dw*.5,Math.max(2,H*.003),'#2a2a2e'); }
        HK.rect(o,dx-1,y-dh*.5-H*.003,dw+4,H*.005,HK.lt(c,.08)); HK.circ(o,dx+dw*.84,y-dh*.3,1.7,'#c8a050'); } /* a Dutch door: two halves, the lower one with a ledge */
      if(s===2){ HK.rect(o,dx,y-dh,dw,dh,c); const gx=dx+dw*.18, gy=y-dh*.86, gw=dw*.64, gh=dh*.38; HK.rect(o,gx,gy,gw,gh,'#2a3440'); HK.rect(o,gx+gw/2-.5,gy,1,gh,dk); HK.rect(o,gx,gy+gh/2-.5,gw,1,dk);
        for(const py of [.56,.78]) HK.rect(o,dx+dw*.18,y-dh*(1-py),dw*.64,dh*.16,HK.dk(c,.12)); HK.circ(o,dx+dw*.84,y-dh*.5,1.7,'#c8a050'); o.lights.push({x:gx+gw/2,y:gy+gh/2,r:.08,a:.45,small:1,win:[gw,gh]}); } }], /* a door with a glass pane: four lights above two raised panels; the glass glows at night */
    ['windows',(o,s,c)=>{ const C=rkCab(o), y=o.dockY, wy=C.wallTop+(y-C.wallTop)*.22, wh=(y-C.wallTop)*.3, wA=W*.084, wB=C.x1-W*.026, ww=W*.016, dk=HK.dk(c,.3), q=o.x;
      const win=(wx)=>{ HK.rect(o,wx-3,wy-3,ww+6,wh+6,c); HK.rect(o,wx-3,wy-3,ww+6,1,v3rgba('#ffffff',.2*HK.lit(o))); HK.rect(o,wx,wy,ww,wh,'#2a3440'); HK.rect(o,wx+ww/2-.6,wy,1.2,wh,c); HK.rect(o,wx,wy+wh/2-.6,ww,1.2,c); HK.rect(o,wx-4,wy+wh+2,ww+8,Math.max(2,H*.004),HK.dk(c,.15)); return {x:wx+ww/2,y:wy+wh/2,r:.1,a:.5,small:1,win:[ww,wh]}; }; /* trim, four panes, a sill */
      const L1=win(wA), L2=win(wB);
      if(s===1){ const r=v3rng(31); for(const bx of [wA,wB]){ const by=wy+wh+2+Math.max(2,H*.004), bw=ww+8, bh=H*.012; HK.rect(o,bx-4,by,bw,bh,HK.dk(c,.1)); HK.line(o,[bx-4,by+bh*.5,bx-4+bw,by+bh*.5],dk,.6); /* a planter box under each window */
          for(let i=0;i<9;i++){ const lx=bx-3+bw*(i+.5)/9, ly=by-H*(.001+r()*.004); q.fillStyle=HK.n(o,i%2?'#3e6a34':'#4f7a3a'); q.beginPath(); q.ellipse(lx,ly,H*.004,H*.0028,(r()-.5)*1.2,0,7); q.fill(); } /* leaves */
          q.strokeStyle=HK.n(o,'#4a7a3a'); q.lineWidth=1; q.beginPath(); for(const tx of [bx-2,bx+bw-7]){ q.moveTo(tx,by+bh*.4); q.quadraticCurveTo(tx-2,by+bh*1.4,tx+1,by+bh*2.1); } q.stroke(); /* trailing ivy */
          for(let i=0;i<5;i++){ const fx=bx-1+bw*(i+.5)/5, fy=by-H*(.005+r()*.004), pc=['#d83a3a','#f4f0f0','#e86a9a','#f0c040','#d83a3a'][i]; rkFlower(q,fx,fy,H*.0032,HK.n(o,pc),HK.n(o,'#f0d040')); } } } /* geraniums and daisies in bloom */
      if(s===2){ const sw=W*.0065, sc=mix(c,'#000000',0); for(const sx of [wA-sw-4,wA+ww+4,wB-sw-4,wB+ww+4]){ HK.rect(o,sx-1,wy-3,sw+2,wh+6,HK.dk(sc,.45)); HK.rect(o,sx,wy-2,sw,wh+4,sc); for(let k=1;k<7;k++) HK.rect(o,sx+1,wy-2+(wh+4)*k/7,sw-2,1.2,HK.dk(sc,.28)); HK.rect(o,sx+1,wy-2,sw-2,1,v3rgba('#ffffff',.2*HK.lit(o))); } } /* louvred shutters, in the windows' colour */
      o.lights.push(L2); return L1; }],
    ['roof',(o,s,c)=>{ const C=rkCab(o), x=o.x, ov=W*.01, L0=C.x0-ov, R0=C.x1+ov, bt=C.wallTop+H*.004, tp=C.roofTop, lit=HK.lit(o);
      /* seen from the long side: the near roof slope as a band above the wall, eaves overhanging both ends */
      const slope=(k)=>[L0+(C.x0+ov*.2-L0)*(1-k),R0-(R0-(C.x1-ov*.2))*(1-k)]; /* the slope's left and right edge at a height k (0 eave, 1 ridge) */
      if(s<2){ x.fillStyle=HK.n(o,c); x.beginPath(); x.moveTo(L0,bt); x.lineTo(C.x0+ov*.2,tp); x.lineTo(C.x1-ov*.2,tp); x.lineTo(R0,bt); x.closePath(); x.fill(); }
      if(s===0){ x.strokeStyle=HK.n(o,HK.dk(c,.3)); x.lineWidth=1; const rows=5, r=v3rng(12); for(let k=1;k<=rows;k++){ const yy=tp+(bt-tp)*k/rows, [l,r2]=slope(1-k/rows); x.beginPath(); x.moveTo(l,yy); x.lineTo(r2,yy); x.stroke(); x.beginPath(); for(let xx=l+((k%2)*W*.004);xx<r2;xx+=W*(.006+r()*.004)){ x.moveTo(xx,yy-(bt-tp)/rows); x.lineTo(xx,yy); } x.stroke(); }
        HK.rect(o,C.x0+ov*.1,tp-H*.003,C.x1-C.x0-ov*.2,H*.004,HK.dk(c,.3)); } /* cedar shake courses and the ridge cap */
      if(s===1){ x.strokeStyle=HK.n(o,HK.lt(c,.2)); x.lineWidth=1.2; x.beginPath(); for(let xx=C.x0;xx<C.x1;xx+=W*.007){ x.moveTo(xx,tp+1); x.lineTo(xx-(xx-(C.x0+C.x1)/2)*.02,bt-1); } x.stroke(); x.strokeStyle=HK.n(o,HK.dk(c,.25)); x.lineWidth=.8; x.beginPath(); for(let xx=C.x0+2;xx<C.x1;xx+=W*.007){ x.moveTo(xx,tp+1); x.lineTo(xx-(xx-(C.x0+C.x1)/2)*.02,bt-1); } x.stroke(); /* standing seams, lit and shaded */
        const sh=x.createLinearGradient(0,tp,0,bt); sh.addColorStop(0,v3rgba('#ffffff',.18*lit)); sh.addColorStop(.5,'rgba(255,255,255,0)'); x.fillStyle=sh; x.beginPath(); x.moveTo(L0,bt); x.lineTo(C.x0+ov*.2,tp); x.lineTo(C.x1-ov*.2,tp); x.lineTo(R0,bt); x.closePath(); x.fill(); /* the sheen of painted metal */
        HK.rect(o,C.x0+ov*.1,tp-H*.004,C.x1-C.x0-ov*.2,H*.005,HK.dk(c,.2)); HK.rect(o,L0,bt-1,R0-L0,2,HK.dk(c,.35)); } /* the ridge cap and the drip edge */
      if(s===2){ const r=v3rng(9), th=H*.014, gc=c, soil='#3a2a1c', bk='#e8dcc4';
        /* a real sod roof: boards, a layer of birch bark, then thick turf over the whole slope, held at the eave by a log on wooden brackets;
           the turf bulges over the ridge and its grass hangs over the eave; wildflowers grow in it (director, 2026-11-23: "look like an actual sod roof") */
        x.fillStyle=HK.n(o,'#4a3626'); x.beginPath(); x.moveTo(L0,bt); x.lineTo(C.x0+ov*.2,tp); x.lineTo(C.x1-ov*.2,tp); x.lineTo(R0,bt); x.closePath(); x.fill(); /* the roof boards */
        x.fillStyle=HK.n(o,HK.dk(gc,.25)); x.beginPath(); x.moveTo(L0-W*.002,bt-H*.002); for(let X=C.x0+ov*.2;X<=C.x1-ov*.2;X+=W*.004) x.lineTo(X,tp-th*(.75+.35*r())); x.lineTo(R0+W*.002,bt-H*.002); x.closePath(); x.fill(); /* the turf body, bumpy along the top */
        x.fillStyle=HK.n(o,gc); x.beginPath(); x.moveTo(L0,bt-H*.004); for(let X=C.x0+ov*.2;X<=C.x1-ov*.2;X+=W*.004) x.lineTo(X,tp-th*(.6+.3*r())); x.lineTo(R0,bt-H*.004); x.lineTo(R0-ov*.4,bt-(bt-tp)*.35); x.lineTo(L0+ov*.4,bt-(bt-tp)*.35); x.closePath(); x.fill(); /* its lit grass */
        x.strokeStyle=HK.n(o,HK.lt(gc,.22)); x.lineWidth=.8; x.beginPath(); for(let i=0;i<140;i++){ const k=r(), [l,rr]=slope(k), X=l+(rr-l)*r(), Y=bt-(bt-tp)*k-th*.4*k; x.moveTo(X,Y); x.lineTo(X+(r()-.5)*2,Y-H*(.003+r()*.004)); } x.stroke(); /* grass blades */
        x.strokeStyle=HK.n(o,HK.lt(gc,.12)); x.lineWidth=1; x.beginPath(); for(let X=C.x0+ov*.2;X<=C.x1-ov*.2;X+=W*.0022){ const Y=tp-th*.62; x.moveTo(X,Y); x.lineTo(X+(r()-.5)*3,Y-H*(.004+r()*.006)); } x.stroke(); x.strokeStyle=v3rgba(o.P.rim||'#fff0d0',.35*lit); x.beginPath(); for(let X=C.x0+ov*.2;X<=C.x1-ov*.2;X+=W*.006){ x.moveTo(X,tp-th*.66); x.lineTo(X+W*.004,tp-th*.7); } x.stroke(); /* tufts along the top, lit by the sky */
        x.strokeStyle=HK.n(o,HK.dk(gc,.3)); x.beginPath(); for(let X=L0;X<R0;X+=W*.0025){ const hl=H*(.004+r()*.006); x.moveTo(X,bt-H*.003); x.quadraticCurveTo(X+1,bt+hl*.5,X-.5+r(),bt+hl); } x.stroke(); /* grass hanging over the eave */
        HK.rect(o,L0,bt-H*.0045,R0-L0,1.2,bk); /* the birch-bark layer showing at the edge */
        const lg=Math.max(3,H*.006); HK.rect(o,L0+ov*.3,bt-lg*.6,R0-L0-ov*.6,lg,'#6a4a30'); HK.rect(o,L0+ov*.3,bt-lg*.6,R0-L0-ov*.6,1,v3rgba('#ffffff',.2*lit)); HK.circ(o,L0+ov*.3,bt-lg*.1,lg*.5,'#a87a50'); HK.circ(o,R0-ov*.3,bt-lg*.1,lg*.5,'#a87a50');
        for(let X=L0+ov*.8;X<R0-ov*.5;X+=W*.03) HK.rect(o,X,bt-lg*.6,Math.max(2,W*.002),lg*1.6,'#4a3020'); /* the turf log on its brackets */
        for(let i=0;i<16;i++){ const k=.15+r()*.75, [l,rr]=slope(k), X=l+(rr-l)*(.04+r()*.92), Y=bt-(bt-tp)*k-th*.5*k; if(i%4===0){ x.strokeStyle=HK.n(o,'#4a7a3a'); x.lineWidth=1; x.beginPath(); x.moveTo(X,Y); x.lineTo(X,Y-H*.012); x.stroke(); for(let b=0;b<4;b++) HK.circ(o,X,Y-H*(.006+b*.0018),H*.0016,'#d8508a'); } else rkFlower(x,X,Y-H*.004,H*.0026,HK.n(o,['#f4f0f0','#f0c040','#8a8ad8'][i%3]),HK.n(o,'#f0d040')); } } /* daisies, buttercups, harebells and a fireweed spike */
      HK.line(o,[L0,bt,R0,bt],HK.dk(s===2?'#3a2a1c':c,.45),1.4); /* the eave's shadow line */
      o.top=Math.min(o.top==null?o.dockY-H*.23:o.top,tp-H*.04); o.low=Math.max(o.low==null?-1e9:o.low,C.wallTop+H*.01); /* the resting rod stays under the eaves, never across the roof */ }],
    ['porch',(o,s,c)=>{ if(!s) return; const C=rkCab(o), y=o.dockY, sc=HF.sc(), lo=y-84*sc*1.06, th=Math.max(4,H*.012), a=C.x0-W*.004, b=C.x1+W*.01, x=o.x;
      /* a porch roof across the cabin's front, lower than the cabin roof, on log posts standing on the deck; the angler fishes under it. It is a
         shed roof in the cabin roof's own material (a sod roof's porch keeps cedar shakes), sloping from the wall down to a fascia on the posts,
         and it shades the wall under it, so it reads as a roof and not as one more log */
      const rs=hfStyle('rockies','roof'), rc=rs===2?'#5a4a3a':hfColor('rockies','roof'), bk=Math.max(C.wallTop+H*.008,lo-th-H*.026);
      const sh=x.createLinearGradient(0,lo,0,lo+H*.03); sh.addColorStop(0,'rgba(10,8,6,.42)'); sh.addColorStop(1,'rgba(10,8,6,0)'); x.fillStyle=sh; x.fillRect(C.x0-W*.003,lo,C.x1-C.x0+W*.006,H*.03); /* its shadow on the wall */
      for(const px of [C.vx+W*.006,(C.vx+C.x1)/2+W*.02,C.x1-W*.006]){ HK.rect(o,px-3,lo,6,y-lo,'#3e2a1c'); HK.rect(o,px-1.5,lo,1.5,y-lo,v3rgba('#c89a6a',.5*HK.lit(o)+.15)); HK.rect(o,px-4,lo,8,H*.004,'#2e2016'); HK.rect(o,px-4,y-H*.004,8,H*.004,'#2e2016'); } /* posts stand on the deck in front of the wall, inside its ends */
      x.fillStyle=HK.n(o,rc); x.beginPath(); x.moveTo(a+W*.004,bk); x.lineTo(b-W*.004,bk); x.lineTo(b,lo-th); x.lineTo(a,lo-th); x.closePath(); x.fill();
      x.strokeStyle=HK.n(o,HK.dk(rc,.3)); x.lineWidth=1; x.beginPath(); if(rs===1){ for(let xx=a+W*.006;xx<b;xx+=W*.007){ x.moveTo(xx,bk+1); x.lineTo(xx,lo-th-1); } } else { for(let k=1;k<3;k++){ const yy=bk+(lo-th-bk)*k/3; x.moveTo(a,yy); x.lineTo(b,yy); } } x.stroke(); /* tin seams, or shake courses */
      HK.rect(o,a,bk-H*.002,b-a,H*.003,HK.dk(rc,.35)); /* the flashing where it meets the wall */
      x.fillStyle=HK.n(o,mix('#6a5040',c,.35)); x.fillRect(a,lo-th,b-a,th); x.fillStyle=HK.n(o,HK.dk(mix('#6a5040',c,.35),.25)); x.fillRect(a,lo-H*.003,b-a,H*.003); HK.line(o,[a,lo-th,b,lo-th],v3rgba(o.P.rim||'#fff0d0',.4*HK.lit(o)),1); /* the fascia, in the porch's colour */
      /* (the porch's log rail is drawn in front of the angler and the chair: rkFront, called after them by the scene) */
      o.low=Math.max(o.low==null?-1e9:o.low,lo-th); }],
    ['seat']] });
/* a small five-petal flower seen face on (daisies, geraniums in a window box, flowers in the sod): petals around a centre */
function rkFlower(q,x,y,r,pc,cc){ q.fillStyle=pc; for(let i=0;i<5;i++){ const a=i*1.2566; q.beginPath(); q.ellipse(x+Math.cos(a)*r*.75,y+Math.sin(a)*r*.75,r*.55,r*.38,a,0,7); q.fill(); } q.fillStyle=cc; q.beginPath(); q.arc(x,y,r*.38,0,7); q.fill(); }
/* the cabin's frame, shared by its parts: seen from its long side at the back of the deck, the walls a little taller than the angler */
/* the porch rail runs along the deck's front edge, nearest to you, so it is drawn after the angler, the chair and the pets (director: "ordering issues") */
function rkFront(night,cx){ const q=cx||g; if(hfStyle('rockies','porch')!==2) return; const y=HF.dockY(), C=rkCab({pw:HF.pw(),dockY:y}), x0=C.x0, x1=C.x1, rh=H*.034, c=hfColor('rockies','porch'), N=c0=>mix(c0,'#0a1020',night*.55), wood=N(mix('#8a6040',c,.3)), post=N('#5a3e2a');
  q.fillStyle=post; for(let i=0;i<=6;i++){ const px=x0+W*.004+(x1-x0)*i/6; q.fillRect(px-1.5,y-rh,3,rh); } q.fillStyle=wood; q.fillRect(x0,y-rh,x1-x0+W*.004,Math.max(3,H*.005)); q.fillRect(x0,y-rh*.5,x1-x0+W*.004,Math.max(2,H*.004)); q.fillStyle=v3rgba('#ffffff',.15*(1-night)); q.fillRect(x0,y-rh,x1-x0+W*.004,1); }
/* smoke from the cabin's chimney (director, 2026-11-23: "the player's home doesn't have smoke"): soft puffs rising from the chimney's top,
   growing and drifting with the breeze as they fade; from the stovepipe's cap they are thinner */
function rkSmoke(night,t){ if(!S.settings.effects) return; const C=rkCab({pw:HF.pw(),dockY:HF.dockY()}), st=hfStyle('rockies','chimney'), w=W*.016, cx=C.x1-W*.04+(st===1?w*.45:w*.5), cy=st===1?C.roofTop-H*.082:C.roofTop-H*.052, k=st===1?.7:1, c=mix('#dfe4ea','#5a6478',night*.6);
  for(let i=0;i<7;i++){ const q=((t*.12+i/7)%1), r=H*(.005+q*.018)*k; g.fillStyle=v3rgba(c,.32*(1-q)*(q<.08?q/.08:1)); g.beginPath(); g.arc(cx+q*H*.05+Math.sin(t*.8+i)*H*.004,cy-q*H*.11,r,0,7); g.fill(); } }
function rkCab(o){ const sc=HF.sc(), vx=Math.max(HF.x0(),0)+Math.max(W*.006,5*sc), x1=o.pw-W*.016, wallTop=o.dockY-84*sc*1.15, wh=o.dockY-wallTop, x0=Math.min(vx,x1-wh*2.9); return {x0,vx,x1,wallTop,roofTop:wallTop-Math.max(H*.05,(x1-vx)*.14)}; } /* a long, low lodge seen from its long side, nearly the deck's full width behind the porch (director: "make sure the lodge is actually wide") */ /* always at least 2.9 times as wide as its walls are tall: where the screen is too narrow (phones) the lodge runs on past the left edge instead of being squeezed (director, 2026-11-22 night: "on mobile… very stretched out"); vx is its visible left end, for the door and the porch posts */
/* the lakeshore the cabin is built on (director, 2026-11-22 night: "this shouldn't just look like a random cabin in the middle of a lake, it
   needs to connect properly"): a forested bank behind the cabin, rising off the left edge and sloping down to meet the water just past the
   deck's end; spruces on it stand above the roof; granite, shrubs and a strip of wet shingle where the bank meets the water. Drawn first,
   so the cabin, the ledge and the deck stand in front of it, and the bank's foot reaches the water line with no gap */
function rkShore(o){ const x=o.x, y=o.dockY, wl=o.wl, x0=HF.x0(), xe=o.pw+W*.022, N=c0=>HK.n(o,c0), r=v3rng(23), lit=HK.lit(o);
  const top0=y-H*.27, topY=X=>{ const u=clamp((X-x0)/(xe-x0),0,1); return wl-(wl-top0)*Math.pow(1-u,1.1)+H*.004*Math.sin(X*.05)*(1-u); }; /* reaches the water line smoothly at its end: no edge */
  { const shape=()=>{ x.beginPath(); x.moveTo(x0,wl); for(let X=x0;X<=xe;X+=4) x.lineTo(X,Math.min(wl,topY(X))); x.lineTo(xe,wl); x.closePath(); };
    const bg=x.createLinearGradient(0,top0,0,wl); bg.addColorStop(0,N('#2c4a32')); bg.addColorStop(.55,N('#2a4430')); bg.addColorStop(1,N('#1e3226')); x.fillStyle=bg; shape(); x.fill(); x.save(); shape(); x.clip(); /* one slope, lit at the top and darker toward the water (two flat layers looked pasted: director, 2026-11-23) */
    const rr=v3rng(29); x.fillStyle=N('#3a5a3a'); for(let i=0;i<26;i++){ const X=x0+(xe-x0)*rr(), Y=topY(X)+(wl-topY(X))*rr()*.8, s=H*(.004+rr()*.006); x.beginPath(); x.ellipse(X,Y,s*1.8,s*.7,0,0,7); x.fill(); } /* mossy hummocks */
    x.strokeStyle=N('#4a6e3e'); x.lineWidth=1; x.beginPath(); for(let i=0;i<220;i++){ const X=x0+(xe-x0)*rr(), Y=topY(X)+(wl-topY(X))*rr()*.9; x.moveTo(X,Y); x.lineTo(X+(rr()-.5)*2.5,Y-H*(.003+rr()*.005)); } x.stroke(); /* grass all over the slope */
    x.strokeStyle=N('#3e6a36'); x.lineWidth=1.1; for(let i=0;i<10;i++){ const X=x0+(xe-x0)*(.1+rr()*.85), Y=topY(X)+(wl-topY(X))*(.2+rr()*.6), L=H*(.012+rr()*.008); x.beginPath(); for(let k=-2;k<=2;k++){ x.moveTo(X,Y); x.quadraticCurveTo(X+k*L*.3,Y-L*.7,X+k*L*.55,Y-L*.35); } x.stroke(); } /* ferns */
    x.fillStyle=N('#6e6a62'); for(let i=0;i<8;i++){ const X=x0+(xe-x0)*(.3+rr()*.65), Y=topY(X)+(wl-topY(X))*(.4+rr()*.5), s=H*(.003+rr()*.004); x.beginPath(); x.ellipse(X,Y,s*1.5,s,0,Math.PI,0); x.fill(); } x.restore(); /* stones in the grass */
    x.strokeStyle=v3rgba(o.P.rim||'#fff0d0',.25*lit); x.lineWidth=1; x.beginPath(); for(let X=x0;X<=xe;X+=W*.004){ const Y=Math.min(wl,topY(X)); x.moveTo(X,Y); x.lineTo(X+(r()-.5)*2,Y-H*(.003+r()*.004)); } x.stroke(); } /* grass along the bank's skyline, lit */
  for(let i=0;i<7;i++){ const X=x0+(xe-x0)*(.04+i*.105)+(r()-.5)*W*.006, /* none at the bank's foot by the deck's end, where one seemed to stand on the deck */ base=Math.min(wl,topY(X))+H*.004, h=H*(.09+r()*.07)*(1-i*.05); rkSpruce(x,X,base,h,N(i%3===1?'#3a5e40':'#1e3a2a'),o.P.rim,.25*lit,i+11); } /* spruces on the bank */
  x.fillStyle=N('#7a7468'); x.beginPath(); x.moveTo(o.pw-W*.04,wl); x.quadraticCurveTo(o.pw-W*.01,wl-H*.009,xe+W*.006,wl); x.closePath(); x.fill(); /* wet shingle at the water's edge, tapering out */
  for(const [fx,s] of [[.86,1],[.97,1.3],[1.06,.8]]){ const X=x0+(o.pw-x0)*fx, rs=H*.012*s; x.fillStyle=N('#8a8680'); x.beginPath(); x.ellipse(X,wl-rs*.35,rs*1.4,rs*.8,0,Math.PI,0); x.fill(); x.fillStyle=v3rgba('#ffffff',.15*lit); x.beginPath(); x.ellipse(X-rs*.3,wl-rs*.7,rs*.5,rs*.18,0,0,7); x.fill(); } /* granite boulders at the foot of the bank */
  x.fillStyle=N('#3e6040'); for(let i=0;i<10;i++){ const X=o.pw-W*.035+r()*W*.05, Y=wl-H*(.004+r()*.012); x.beginPath(); x.ellipse(X,Y,W*.004,H*.005,0,Math.PI,0); x.fill(); } } /* shrubs */
/* the cabin's foundation (director, 2026-11-22 night: supports "need way more detail into the support physics… more realism"): a granite
   ledge rising out of the lake under the cabin end, its lit and shaded facets, cracks, lichen and moss, a dark wet band where the water laps
   it and its body fading into the water below; under the porch, peeled log posts stand on the ledge or on submerged boulders, notched into a
   log beam under the deck, with iron straps and knee braces, darkened and weedy at the water line */
function rkLedge(o){ const x=o.x, y=o.dockY, yu=y+HK.fh(), wl=o.wl, at=f=>HK.at(o,f), x0=HF.x0()-W*.01, N=c0=>HK.n(o,c0), lit=HK.lit(o);
  const top=[[x0,yu+H*.002],[at(.12),yu+H*.003],[at(.26),yu+H*.012],[at(.34),yu+H*.02],[at(.42),wl-H*.02],[at(.5),wl-H*.004],[at(.58),wl+H*.016],[at(.66),wl+H*.05],[at(.72),wl+H*.1],[at(.76),wl+H*.17]]; /* the ledge drops away into deep water before the deck's end */
  const bot=wl+H*.2, rockPath=()=>{ x.beginPath(); x.moveTo(x0,bot); for(const [X,Y] of top) x.lineTo(X,Y); x.lineTo(at(.78),bot); x.closePath(); };
  const gr=x.createLinearGradient(0,yu,0,bot); gr.addColorStop(0,N('#a8a49c')); gr.addColorStop(.5,N('#8a8680')); gr.addColorStop(1,N('#6a6660')); x.fillStyle=gr; rockPath(); x.fill();
  x.save(); rockPath(); x.clip();
  /* facets: the faces turned from the light (from the left) in shade, a few block joints */
  x.fillStyle=v3rgba('#1a2030',.28); x.beginPath(); for(let i=1;i<top.length;i++){ const [X0,Y0]=top[i-1], [X1,Y1]=top[i]; if(Y1>Y0+H*.004){ x.moveTo(X0,Y0); x.lineTo(X1,Y1); x.lineTo(X1-W*.004,bot); x.lineTo(X0+W*.01,bot); x.closePath(); } } x.fill();
  x.strokeStyle=N('#4a4844'); x.lineWidth=1; x.beginPath(); for(const [fx,fy,L] of [[.08,.01,.05],[.2,.02,.07],[.3,.03,.05],[.46,.012,.06]]){ const X=at(fx), Y=yu+H*fy; x.moveTo(X,Y); x.lineTo(X+W*.004,Y+H*L*.5); x.lineTo(X-W*.002,Y+H*L); } x.stroke();
  x.strokeStyle=v3rgba('#ffffff',.18*lit); x.beginPath(); x.moveTo(top[0][0],top[0][1]+1); for(let i=1;i<5;i++) x.lineTo(top[i][0],top[i][1]+1); x.stroke(); /* the lit top edge */
  const r=v3rng(17); for(let i=0;i<26;i++){ const X=x0+(at(.45)-x0)*r(), Y=yu+H*(.004+r()*.04); if(Y>wl-H*.008) continue; x.fillStyle=N(r()<.6?'#b8b890':'#c8a060'); x.beginPath(); x.ellipse(X,Y,W*(.002+r()*.003),H*.0018,0,0,7); x.fill(); } /* lichen */
  x.fillStyle=N('#4f6a34'); for(let i=0;i<4;i++){ const [X,Y]=top[i]; x.beginPath(); x.ellipse(X+W*.006,Y+H*.002,W*.008,H*.0028,0,0,7); x.fill(); } /* moss along the top */
  const wb=x.createLinearGradient(0,wl-H*.022,0,wl+H*.002); wb.addColorStop(0,'rgba(20,26,22,0)'); wb.addColorStop(1,'rgba(20,26,22,.55)'); x.fillStyle=wb; x.fillRect(x0,wl-H*.022,o.pw+W*.04-x0,H*.024); /* wet rock where the water laps */
  const deep=o.P.wBot||'#0a3040', uw=x.createLinearGradient(0,wl,0,bot); uw.addColorStop(0,v3rgba(o.P.wMid||'#2a7a88',.45)); uw.addColorStop(.5,v3rgba(deep,.8)); uw.addColorStop(1,v3rgba(deep,1)); x.fillStyle=uw; x.fillRect(x0,wl,o.pw+W*.04-x0,bot-wl); /* under the surface it takes the water's colour and fades */
  x.restore();
  x.save(); x.globalCompositeOperation='destination-out'; const fo=x.createLinearGradient(0,wl+H*.08,0,bot); fo.addColorStop(0,'rgba(0,0,0,0)'); fo.addColorStop(1,'rgba(0,0,0,1)'); x.fillStyle=fo; x.fillRect(x0,wl+H*.08,o.pw+W*.04-x0,bot-wl); x.restore(); /* lost in the depth */
  /* the log beam under the deck's front, its end showing */
  const bt=yu, bh=0, wood=N('#6a4a32'), woodL=N('#8a6448'), woodD=N('#3a281c'); /* no separate beam: the posts and braces meet the deck's own underside, so the platform reads as one deck (director: "all things need to line up correctly on the base platform") */
  /* posts: on the ledge where it is high enough, else on a submerged boulder footing */
  const surf=X=>{ for(let i=1;i<top.length;i++){ const [X0,Y0]=top[i-1], [X1,Y1]=top[i]; if(X>=X0&&X<=X1) return Y0+(Y1-Y0)*(X-X0)/(X1-X0); } return wl+H*.07; };
  /* piles (director, 2026-11-22 night: "the support beams going into the water look bad, not natural at all"): above the water a peeled log
     with bark checks, an iron strap and knee braces up to the deck; at the surface a dark wet band, weed and a ripple; below it the pile is
     seen through the water: shifted a little by refraction, darker, and fading into the depth on its way to the lake bed, never ending on a disc */
  for(const f of [.5,.7,.92]){ const px=Math.min(o.pw-W*.006,at(f)), pw2=Math.max(6,W*.0085), foot=surf(px), sub=foot>wl, end=sub?wl:foot;
    const pg=x.createLinearGradient(px-pw2/2,0,px+pw2/2,0); pg.addColorStop(0,woodL); pg.addColorStop(.45,wood); pg.addColorStop(1,woodD); x.fillStyle=pg; x.fillRect(px-pw2/2,bt,pw2,end-bt);
    x.strokeStyle=v3rgba('#2a1c12',.45); x.lineWidth=.8; x.beginPath(); for(let k=0;k<4;k++){ const yy=bt+(end-bt)*(k+.5)/4; x.moveTo(px-pw2/2,yy); x.lineTo(px-pw2*.1,yy+H*.003); } x.stroke();
    x.fillStyle=N('#3a3a40'); x.fillRect(px-pw2/2-.5,bt+H*.006,pw2+1,Math.max(1.5,H*.003));
    x.strokeStyle=wood; x.lineWidth=Math.max(2,pw2*.5); x.lineCap='round'; x.beginPath(); x.moveTo(px,bt+H*.03); x.lineTo(px-W*.012,bt); if(f<.9){ x.moveTo(px,bt+H*.03); x.lineTo(px+W*.012,bt); } x.stroke(); x.lineCap='butt';
    if(!sub) continue;
    const w2=x.createLinearGradient(0,wl-H*.022,0,wl); w2.addColorStop(0,'rgba(18,24,20,0)'); w2.addColorStop(1,'rgba(18,24,20,.6)'); x.fillStyle=w2; x.fillRect(px-pw2/2,wl-H*.022,pw2,H*.022);
    x.fillStyle=N('#3f5a2c'); for(let k=0;k<4;k++){ const wx=px-pw2/2+pw2*k/4, wh=H*(.004+.004*((k*7)%3)/2); x.beginPath(); x.moveTo(wx,wl); x.quadraticCurveTo(wx+pw2*.2,wl-wh*.6,wx+pw2*.1,wl-wh); x.lineTo(wx+pw2*.25,wl); x.fill(); }
    /* under the surface the same pile carries straight on down (no sideways jump: director, 2026-11-23 "the support beams don't line up with
       the water"), taking the water's colour as it goes, to the lake bed */
    const deep=o.P.wBot||'#0a3040', uc=mix(mix('#4a3424',deep,.45),'#000000',.05), depth=H*.16, ug=x.createLinearGradient(0,wl,0,wl+depth); ug.addColorStop(0,v3rgba(uc,.92)); ug.addColorStop(.55,v3rgba(mix(uc,deep,.4),.55)); ug.addColorStop(1,v3rgba(deep,0)); x.fillStyle=ug; x.fillRect(px-pw2/2,wl,pw2,depth);
    const ul=x.createLinearGradient(0,wl,0,wl+depth*.7); ul.addColorStop(0,v3rgba(mix(uc,'#9ac8b0',.35),.5*lit)); ul.addColorStop(1,'rgba(150,200,180,0)'); x.fillStyle=ul; x.fillRect(px-pw2/2,wl,pw2*.25,depth*.7); /* its lit side, fading with depth */
    HK.rect(o,px-pw2/2-1,wl-1,pw2+2,1.5,v3rgba('#e8f4f0',.35*lit+.05)); /* the bright line where the surface meets it */
    o.posts.push({x:px,w:pw2}); } }

/* 7. Coral Shallows: the overwater bungalow (overnight, 2026-11-23; its own design, src/cw_bungalow.js): a hut high on palm stilts over the
   shallows with a tall thatched hip roof, a shaggy fringe and a gablet vent; a ladder into the clear water, the sandbar with coral heads and a
   starfish showing through, a coconut palm leaning over the roof. The old stilts, platform and cover choices became this one building */
{ const G7=()=>RB.geo({pw:HF.pw(),dockY:HF.dockY()}), WN=()=>{ const g=G7(); return {x0:g.x0,x1:g.x1,vx:g.x0,wallTop:g.wallTop,winA:g.x0+g.w*.45,winB:g.x0+g.w*.72}; };
hfMake('reef',{ name:'Overwater bungalow', hname:'bungalow', glow:'255,200,140', seatX:()=>HF.pw()-W*.03,
  colors:C16('Palm wood=#9a7a52;Bleached wood=#c8b088;Thatch=#d8b46a;Dark thatch=#a8843a;Sand=#f4e2b0;Shell white=#fbf2e4;Turquoise=#18b0c0;Lagoon=#7ae8e0;Deep reef=#0a6a8a;Palm green=#3a9a4a;Frond dark=#22703a;Coral=#ff7a6a;Mango=#ffb84a;Orchid=#c86ad8;Hibiscus red=#e0403a;Sky blue=#6ccaf4'),
  front:null, smoke:null,
  els:[{id:'walls',label:'Walls',styles:['Woven bamboo','Palm planks','Reed screens'],def:[0,1],palS:[[1,0,4],[0,1,5,6],[1,2,3]]},
       {id:'thatch',label:'Roof',styles:['Palm thatch','Layered reed thatch','Palm-leaf shingles'],def:[0,2],palS:[[2,3],[2,3,1],[9,10,3]]},
       {id:'door',label:'Door',styles:['Cloth curtain','Plank door','Arched door'],def:[0,11],palS:[[11,12,13,14,6,5],[0,1,6,8],[0,1,6,8]]},
       {id:'windows',label:'Windows',styles:['Shuttered windows','Round windows','Four-pane windows'],def:[0,6],pal:[0,1,5,6,8,11,12]},
       {id:'gear',label:'Beach gear',none:true,styles:['No gear','Surfboard','Snorkel set','Shell garland'],def:[1,11]},
       {id:'torch',label:'Torch',light:true,styles:['Tiki torch','Shell lantern','Glass floats'],def:[0,13]}],
  seat:['beachchair','hammock','peacock'], seatNames:['Beach chair','Hammock','Peacock chair'], seatDef:[0,6],
  order:[
    ['base',(o)=>{ RB.ground(o); HK.supports(o,'#9a7a52','palm',5); HK.deck(o,'#c8b088','planks'); }],
    ['walls',(o,s,c)=>RB.walls(o,RB.geo(o),['woven','shiplap','bamboo'][s],c)],
    ['door',(o,s,c)=>BH.door(o,RB.geo(o),['noren','plank','arched'][s],c)],
    ['windows',(o,s,c)=>BH.windows(o,WN(),['shutters','round','four'][s],c)],
    ['thatch',(o,s,c)=>RB.roof(o,RB.geo(o),s,c)],
    ['gear',(o,s,c)=>{ const x=HK.at(o,.42), y=o.dockY; if(s===1){ HK.ell(o,x+W*.006,y-H*.05,W*.006,H*.05,c,-.08); HK.line(o,[x+W*.006,y-H*.09,x+W*.006,y-H*.01],'#f4efe6',1); } if(s===2){ HK.rect(o,x,y-H*.1,2,H*.1,'#9a7a52'); HK.ell(o,x+W*.006,y-H*.08,W*.004,H*.006,c); HK.poly(o,[x+W*.002,y-H*.06,x+W*.012,y-H*.06,x+W*.016,y-H*.035,x+W*.004,y-H*.04],HK.dk(c,.2)); } if(s===3){ HK.curve(o,x-W*.02,y-H*.11,x,y-H*.08,x+W*.02,y-H*.11,'#c8a878',1); for(let i=0;i<6;i++) HK.circ(o,x-W*.016+i*W*.0064,y-H*(.1-Math.sin(i/5*Math.PI)*.02),H*.004,i%2?c:'#fbf2e4'); } }],
    ['seat'],
    ['torch',(o,s)=>HK.light(o,['tiki','shells','floats'][s])]] }); }
/* 8. Florida Keys: the flats skiff (overnight, 2026-11-23; its own design, src/cw_skiff.js; floats): a shallow-draft fiberglass skiff, bow
   to the right, with a rub rail, boot stripe, registration and an outboard; console, top and gear choices; staked out with a push pole.
   Same ids as before, so saved choices still fit */
hfMake('keys',{ name:'Flats skiff', hname:'skiff', floats:true, seatX:()=>HF.pw()-W*.03,
  colors:C16('Boat white=#f4f6f4;Fiberglass cream=#ece4d0;Aluminium=#b8c0c4;Teak=#9a6a3a;Flats aqua=#28c0c8;Shallow mint=#8af0e0;Deep channel=#0a7090;Conch pink=#f0a0a8;Flamingo=#f06a8a;Mint=#9ae0c0;Lemon=#f4e07a;Sunset orange=#f8a050;Sand=#f4e6c0;Palm green=#3a8a5a;Navy trim=#1e3a5a;Cooler red=#d8483a'),
  front:null, smoke:null,
  els:[{id:'hull',label:'Hull',styles:['Flats skiff','Bay boat','Pastel jon boat'],def:[0,0]},{id:'top',label:'Top',none:true,styles:['Open sky','T-top','Bimini','Clamp umbrella'],def:[1,1]},
       {id:'console',label:'Console',styles:['Center console','Poling platform','Tiller boat'],def:[0,0]},{id:'gear',label:'Gear',styles:['Rod holders','Cooler','Flamingo float'],def:[0,15]},
       {id:'light',label:'Nav lights',light:true,styles:['Bow lights','T-top light','Cooler lantern'],def:[0,13]}],
  seat:['captain','coolerseat','beanbag'], seatNames:['Captain’s chair','Cooler seat','Bean bag'], seatDef:[0,14],
  order:[
    ['stake',(o)=>FK.ground(o)],
    ['hull',(o,s,c)=>FK.hull(o,s,c)],
    ['console',(o,s,c)=>FK.console(o,s,c)],
    ['top',(o,s,c)=>FK.top(o,s,c)],
    ['gear',(o,s,c)=>FK.gear(o,s,c)],
    ['seat'],
    ['light',(o,s)=>HK.light(o,['navlight','post','table'][s])]] });

/* 9. Brine Shelf: the sport-fisher (overnight, 2026-11-23; its own design, src/cw_sportfisher.js; floats): the after half of a big-game boat,
   stern toward the fish, bow off the left edge; cabin, flybridge / wheelhouse / tuna tower, outriggers. Same ids as before, so saved choices fit */
hfMake('shelf',{ name:'Sport-fisher', hname:'boat', floats:true, seatX:()=>HF.pw()-W*.03, front:null, smoke:null,
  colors:C16('Hull white=#f2f2ee;Deck teak=#a8743a;Dark teak=#6a4626;Brass=#c8a04a;Chrome=#c0c8cc;Navy hull=#1e2e4a;Ocean blue=#2a7a9a;Deep ocean=#0c3a5a;Foam=#e4f0f0;Sail canvas=#f4ead8;Rope=#c8a878;Flag red=#c8382e;Flag yellow=#e8c03a;Flag blue=#2a5aa8;Life-ring orange=#f0782a;Horizon gold=#ffe0a8'),
  els:[{id:'hull',label:'Hull',styles:['Sport-fisher','Wooden cruiser','Steel workboat'],def:[0,0]},{id:'bridge',label:'Flybridge',styles:['Open flybridge','Wheelhouse','Tuna tower'],def:[0,0]},
       {id:'rig',label:'Outriggers',styles:['Twin outriggers','Rod rack','Gaff rack'],def:[0,4]},
{id:'flags',label:'Flags',none:true,styles:['No flags','Signal flags','Marlin pennant','Burgee'],def:[1,11]},
       {id:'light',label:'Deck light',light:true,styles:['Brass lantern','Masthead light','Floodlight'],def:[0,15]}],
  seat:['fighting','teakbench','deckstool'], seatNames:['Fighting chair','Teak bench','Deck stool'], seatDef:[0,1],
  order:[
    ['hull',(o,s,c)=>SF.hull(o,s,c)],
    ['bridge',(o,s,c)=>SF.bridge(o,s,c,hfColor('shelf','hull'))],
    ['rig',(o,s,c)=>SF.rig(o,s,c)],
    ['flags',(o,s,c)=>{ if(!s) return; const x=HK.at(o,.62), top=o.dockY-H*.22; HK.rect(o,x,top,1.6,H*.22,'#c0c8cc'); if(s===1){ HK.line(o,[x,top,HK.at(o,.05),o.dockY-H*.04],'#c8a878',.8); for(let i=1;i<6;i++){ const u=i/6; HK.poly(o,[x+(HK.at(o,.05)-x)*u,top+(H*.18)*u,x+(HK.at(o,.05)-x)*u-W*.006,top+(H*.18)*u+H*.004,x+(HK.at(o,.05)-x)*u,top+(H*.18)*u+H*.012],['#c8382e','#e8c03a','#2a5aa8'][i%3]); } } if(s===2){ HK.poly(o,[x,top,x+W*.03,top+H*.01,x,top+H*.02],c); HK.ell(o,x+W*.012,top+H*.01,W*.006,H*.003,'#2a5aa8'); } if(s===3) HK.poly(o,[x,top,x+W*.022,top+H*.008,x,top+H*.016],c); }],
    ['seat'],
    ['light',(o,s)=>HK.light(o,['brass','mast','flood'][s],s===1?HK.at(o,.62):undefined)]] });

/* 10. Amazon Rainforest: the palafito (overnight, 2026-11-23; its own design, src/cw_palafito.js): a stilt house high on lashed poles with a
   very steep A-frame thatch roof hanging low over half walls; vine-lashed braces, a notched log ladder, giant Victoria lily pads, buttress roots.
   The old stilts, floor and roof choices became this one building; river gear and lamp keep their ids */
{
hfMake('amazon',{ name:'Palafito', hname:'palafito', glow:'255,190,110', seatX:()=>HF.pw()-W*.03, front:null, smoke:null,
  colors:C16('Hardwood=#7a5a3e;Dark hardwood=#4a3420;Vine=#5a6a2a;Palm thatch=#c8a85a;Dry thatch=#a8843a;River clay=#a8683a;Jungle green=#2e6a32;Deep jungle=#123a18;Fern=#6aa04a;Leaf highlight=#a8e07a;Tannin water=#3a5a32;Macaw red=#d8302a;Macaw blue=#2a6ad8;Macaw yellow=#f0c83a;Orchid pink=#e070b0;Mist=#e8f4e0'),
  els:[{id:'walls',label:'Walls',styles:['Split palm','Woven cane','Clay plaster'],def:[0,0],palS:[[0,1,3],[3,4,0],[5,3,4]]},
       {id:'thatch',label:'Roof',styles:['Palm thatch','Dry thatch','Giant leaves'],def:[0,3],palS:[[3,4],[4,3],[6]]},
       {id:'door',label:'Door',styles:['Woven mat','Plank door','Bead curtain'],def:[0,4],palS:[[3,4,2],[0,1],[11,12,13,14,15]]},
       {id:'canoe',label:'River gear',none:true,styles:['No gear','Dugout canoe','Paddle and trap','Hanging net'],def:[1,1]},
       {id:'lamp',label:'Lamp',light:true,styles:['Gourd lamp','Firefly basket','Bamboo torch'],def:[0,13]}],
  seat:['hammock','wovenstool','logseat'], seatNames:['Hammock','Woven stool','Carved log seat'], seatDef:[0,11],
  order:[
    ['base',(o)=>{ AP.ground(o); HK.deck(o,'#7a5a3e','planks'); }],
    ['walls',(o,s,c)=>AP.walls(o,AP.geo(o),['batten','woven','plaster'][s],c)],
    ['door',(o,s,c)=>BH.door(o,AP.geo(o),['noren','plank','noren'][s],c)],
    ['canoe',(o,s,c)=>{ const x=HK.at(o,.3), y=o.dockY; if(s===1){ o.x.fillStyle=HK.n(o,c); o.x.beginPath(); o.x.moveTo(x,o.wl-H*.004); o.x.quadraticCurveTo(x+W*.04,o.wl+H*.016,x+W*.08,o.wl-H*.004); o.x.lineTo(x,o.wl-H*.004); o.x.fill(); o.posts.push({x:x+W*.08,w:W*.01}); } if(s===2){ HK.line(o,[HK.at(o,.42),y,HK.at(o,.46),y-H*.1],c,2); HK.ell(o,HK.at(o,.46),y-H*.1,W*.003,H*.012,c); HK.ell(o,HK.at(o,.5),y-H*.012,W*.008,H*.012,'#a8843a'); } if(s===3){ HK.rect(o,HK.at(o,.44),y-H*.13,2,H*.13,'#4a3420'); o.x.fillStyle=v3rgba(c,.5); o.x.beginPath(); o.x.moveTo(HK.at(o,.44),y-H*.13); o.x.lineTo(HK.at(o,.38),y-H*.04); o.x.lineTo(HK.at(o,.44),y-H*.05); o.x.fill(); } }],
    ['thatch',(o,s,c)=>AP.roof(o,AP.geo(o),s,c)],
    ['seat'],
    ['lamp',(o,s)=>HK.light(o,['gourd','fireflybasket','torch'][s])]] }); }

/* 11. Midnight Deep: the trawler (overnight, 2026-11-23; its own design, src/cw_trawler.js; floats): a rust-streaked steel stern trawler with a
   high bulwark, freeing ports, tyre fenders and a towering wheelhouse forward; net drum, gantry with a trawl door, or crab pots. Same ids as before */
hfMake('deep',{ name:'Trawler', hname:'trawler', floats:true, seatX:()=>HF.pw()-W*.03, front:null, smoke:null,
  colors:C16('Steel grey=#6a7480;Dark steel=#3a424c;Gunmetal=#2a2e34;Rust=#8a4a2a;Rust light=#b8683a;Safety orange=#f0782a;Float orange=#e85a2a;Oilskin yellow=#d8b030;Floodlight=#f4eccc;Net green=#4a6a5a;Deck black=#1a1c20;Sea grey=#6a8290;Deep sea=#0a1826;Foam white=#e8ecf0;Bruised amber=#c8704a;Cold rim=#8aa0d8'),
  els:[{id:'hull',label:'Hull',styles:['Steel deck','Rusty trawler','Wood on steel'],def:[0,0]},{id:'house',label:'Wheelhouse',styles:['Boxy wheelhouse','Low pilothouse','Open helm'],def:[0,13]},
       {id:'gear',label:'Trawl gear',styles:['Net drum','A-frame gantry','Crab pots'],def:[0,9]},{id:'mast',label:'Mast',none:true,styles:['No mast','Mast and boom','Radar mast','Antenna mast'],def:[1,1]},
       {id:'light',label:'Floodlight',light:true,styles:['Floodlight','Caged lamp','Swinging lantern'],def:[0,8]}],
  seat:['floatcrate','steelbench','ropecoil'], seatNames:['Crate of floats','Steel bench','Rope coil'], seatDef:[0,9],
  order:[
    ['hull',(o,s,c)=>MT.hull(o,s,c)],
    ['house',(o,s,c)=>MT.house(o,s,c)],
    ['mast',(o,s,c)=>MT.mast(o,s,c)],
    ['gear',(o,s,c)=>MT.gear(o,s,c)],
    ['seat'],
    ['light',(o,s)=>HK.light(o,['floodpole','workcage','hook'][s])]] });

/* 12. Hollow Trench: the salvage raft (floats) */
hfMake('trench',{ name:'Salvage raft', hname:'raft', floats:true,
  colors:C16('Salvage plank=#6a5a48;Dark plank=#3a3028;Tarred barrel=#4a3a2a;Barrel band=#5a5a5a;Rope=#9a8868;Old brass=#a8884a;Lantern amber=#f0b050;Sail scrap=#c8bca0;Abyss black=#020e14;Deep teal=#123a44;Trench teal=#3a6a70;Bio cyan=#5afff0;Bio violet=#a080ff;Pale glow=#b8e8dc;Wet rock=#2a3e46;Bone=#e0dccc'),
  els:[{id:'raft',label:'Raft',styles:['Barrel raft','Plank raft','Door raft'],def:[0,2]},{id:'mast',label:'Mast',styles:['Scrap sail','Crow’s nest','Oar flag'],def:[0,7]},
       {id:'salvage',label:'Salvage',styles:['Sea chest','Anchor','Ship’s wheel'],def:[0,5]},{id:'shelter',label:'Shelter',none:true,styles:['No shelter','Sailcloth tent','Plank lean-to','Upturned boat'],def:[1,7]},
       {id:'light',label:'Lantern',light:true,styles:['Pole lantern','Jellyfish jar','Wreck lamp'],def:[0,6]}],
  seat:['barrel','seachest','crate'], seatNames:['Barrel','Sea chest','Broken crate'], seatDef:[0,2],
  order:[
    ['raft',(o,s,c)=>HK.hull(o,c,['barrels','planks','door'][s])],
    ['shelter',(o,s,c)=>{ if(s===1) HK.roof(o,c,'tent',.02,.36); if(s===2) HK.roof(o,c,'leanto',.02,.36); if(s===3){ const a=HK.at(o,.02), b=HK.at(o,.38), y=o.dockY-H*.09; HK.rect(o,a+W*.004,y,2,o.dockY-y,'#3a3028'); HK.rect(o,b-W*.004,y,2,o.dockY-y,'#3a3028'); o.x.fillStyle=HK.n(o,c); o.x.beginPath(); o.x.moveTo(a-W*.01,y); o.x.quadraticCurveTo((a+b)/2,y-H*.05,b+W*.012,y); o.x.lineTo(a-W*.01,y); o.x.fill(); } }],
    ['mast',(o,s,c)=>{ const x=HK.at(o,.5), top=o.dockY-H*.2; HK.rect(o,x,top,2.4,H*.2,'#3a3028'); if(s===0) HK.poly(o,[x+2,top+H*.01,x+W*.035,top+H*.03,x+W*.03,top+H*.1,x+2,top+H*.12],c); if(s===1) HK.poly(o,[x-W*.008,top,x+W*.01,top,x+W*.008,top+H*.02,x-W*.006,top+H*.02],c); if(s===2) HK.poly(o,[x+2,top,x+W*.02,top+H*.006,x+W*.016,top+H*.03,x+2,top+H*.024],c); }],
    ['salvage',(o,s,c)=>{ const x=HK.at(o,.78), y=o.dockY; if(s===0){ HK.block(o,x,y-H*.024,W*.026,H*.024,'#4a3a2a'); HK.rect(o,x,y-H*.016,W*.026,1.6,c); } if(s===1){ HK.line(o,[x+W*.01,y,x+W*.01,y-H*.04],c,2.4); HK.curve(o,x,y-H*.012,x+W*.01,y+H*.004,x+W*.02,y-H*.012,c,2.4); HK.rect(o,x+W*.004,y-H*.036,W*.012,2,c); } if(s===2){ o.x.strokeStyle=HK.n(o,c); o.x.lineWidth=2; o.x.beginPath(); o.x.arc(x+W*.012,y-H*.03,H*.022,0,7); o.x.stroke(); for(let k=0;k<8;k++){ const a=k*Math.PI/4; HK.line(o,[x+W*.012,y-H*.03,x+W*.012+Math.cos(a)*H*.03,y-H*.03+Math.sin(a)*H*.03],c,1.4); } } }],
    ['seat'],
    ['light',(o,s)=>HK.light(o,['hook','jellyjar','wreck'][s])]] });

/* 13. Ember Springs: the bathhouse */
hfMake('ember',{ name:'Hot-spring bathhouse', hname:'bathhouse',
  colors:C16('Basalt=#4a3a3a;Black basalt=#2a2024;Obsidian=#1a1418;Ash grey=#7a6e6a;Volcanic earth=#7a6258;Iron=#3a3436;Forged iron=#5a4a44;Copper=#b8683a;Ember orange=#ff7a2a;Lava gold=#ffc04a;Crimson=#a83030;Spring turquoise=#7ad8d0;Steam white=#f0e8e4;Onsen cedar=#a87a52;Tile red=#b8483a;Amber sky=#f0c8a0'),
  els:[{id:'base',label:'Basalt base',styles:['Basalt columns','Stone blocks','Iron pillars'],def:[0,0]},{id:'floor',label:'Floor',styles:['Basalt slabs','Tiled floor','Onsen cedar'],def:[0,1]},
       {id:'pool',label:'Hot pool',styles:['Stone bath','Cedar tub','Lava-rock ring'],def:[0,11]},{id:'roof',label:'Roof',none:true,styles:['Open sky','Iron frame','Copper hood','Obsidian slab'],def:[2,13]},
       {id:'light',label:'Lantern',light:true,styles:['Iron lantern','Lava bowl','Steam lamp'],def:[0,8]}],
  seat:['steelbench','bathstool','warmrock'], seatNames:['Stone bench','Bath stool','Warm rock'], seatDef:[0,3],
  order:[
    ['base',(o,s,c)=>HK.supports(o,c,['hex','stone','iron'][s],5)],
    ['floor',(o,s,c)=>HK.deck(o,c,['stone','tile','walnut'][s])],
    ['roof',(o,s,c)=>{ if(s===1) HK.roof(o,c,'iron',.02,.38); if(s===2) HK.roof(o,c,'copper',.02,.38); if(s===3) HK.roof(o,c,'slab',.02,.38); }],
    ['pool',(o,s,c)=>{ const x=HK.at(o,.4), y=o.dockY, w=W*.04, g=s===2?'#ffc04a':c; if(s===0) HK.block(o,x,y-H*.022,w,H*.022,'#5a4a44'); if(s===1){ HK.poly(o,[x,y-H*.024,x+w,y-H*.024,x+w-W*.003,y,x+W*.003,y],'#a87a52'); HK.rect(o,x,y-H*.018,w,1.5,'#3a3436'); HK.rect(o,x,y-H*.008,w,1.5,'#3a3436'); } if(s===2) for(let i=0;i<6;i++) HK.ell(o,x+i*w/5,y-H*.006,W*.004,H*.006,i%2?'#4a3a3a':'#2a2024');
      HK.ell(o,x+w/2,y-H*.022,w*.42,H*.004,g); for(let i=0;i<3;i++) HK.circ(o,x+w*(.3+i*.2),y-H*.035-i*H*.01,H*.007,v3rgba('#f0e8e4',.25)); }],
    ['seat'],
    ['light',(o,s)=>HK.light(o,['chain','lavabowl','steam'][s])]] });

/* 14. Starfall Lake: the floating crystal platform (floats) */
hfMake('starfall',{ name:'Crystal platform', hname:'crystal platform', floats:true,
  colors:C16('Moonstone=#e8e0f4;Silver=#c8c8d8;Starlight=#fff8ff;Crystal violet=#b88aff;Crystal cyan=#7ae0ff;Deep violet=#6a5ab0;Night indigo=#2a1a5a;Lilac=#c8a0e8;Cloud lavender=#c8b8e0;Moon gold=#f0d080;Planet peach=#f0b890;Rose=#ff9ab0;Plum=#7a3a8a;Island moss=#5a8a6a;Twilight blue=#4a4aa8;Star ring=#e8d0ff'),
  els:[{id:'platform',label:'Platform',styles:['Crystal disc','Moonstone slab','Cloud platform'],def:[0,3]},{id:'under',label:'Underglow',styles:['Crystal spires','Floating stones','Glowing roots'],def:[0,4]},
       {id:'arch',label:'Arch',none:true,styles:['Open sky','Crescent moon','Planet ring','Star-blossom bower'],def:[1,9]},{id:'scope',label:'Telescope',none:true,styles:['None','Brass telescope','Astrolabe','Star chart'],def:[1,9]},
       {id:'light',label:'Star lantern',light:true,styles:['Star lantern','Moon orb','Constellation wisps'],def:[0,2]}],
  seat:['crescent','cloudcushion','crystalstool'], seatNames:['Crescent bench','Cloud cushion','Crystal stool'], seatDef:[0,0],
  order:[
    ['under',(o,s,c)=>HK.supports(o,c,['spires','floatstones','glowroots'][s],5)],
    ['platform',(o,s,c)=>HK.deck(o,c,['crystal','moonstone','cloud'][s])],
    ['arch',(o,s,c)=>{ if(s) HK.roof(o,c,['','crescentgate','planet','bower'][s],.02,.46); }], /* map redo (director: "the home still gets fixed"): a crescent-moon sculpture behind the seat and a ringed planet on a pedestal instead of a ring and an arc hanging over the angler */
    ['scope',(o,s,c)=>{ if(!s) return; const x=HK.at(o,.42), y=o.dockY; if(s===1){ HK.line(o,[x,y,x+W*.008,y-H*.04,x+W*.016,y],'#5a4030',1.2); HK.line(o,[x+W*.002,y-H*.042,x+W*.022,y-H*.062],c,3); } if(s===2){ HK.rect(o,x+W*.006,y-H*.03,2,H*.03,c); o.x.strokeStyle=HK.n(o,c); o.x.lineWidth=1.4; o.x.beginPath(); o.x.arc(x+W*.007,y-H*.045,H*.014,0,7); o.x.stroke(); HK.line(o,[x-W*.004,y-H*.045,x+W*.018,y-H*.045],c,1); } if(s===3){ HK.line(o,[x,y,x+W*.01,y-H*.06,x+W*.02,y],'#5a4030',1.2); HK.rect(o,x+W*.002,y-H*.07,W*.018,H*.03,'#2a1a5a'); for(let i=0;i<5;i++) HK.circ(o,x+W*(.005+i*.003),y-H*(.065-(i%2)*.012),1,c); } }],
    ['seat'],
    ['light',(o,s)=>HK.light(o,['star','moon','wisps'][s])]] });

/* 15. Animal Farm: the barn dock */
hfMake('farm',{ name:'Barn dock', hname:'barn dock',
  colors:C16('Barn red=#b8322a;Dark barn=#7a2a22;Trim white=#f4f0e6;Fence grey=#9a948a;Weathered board=#8a6a4a;Hay gold=#e0c060;Straw=#d8b46a;Tin=#a8b0b4;Rust tin=#a8683a;Grass green=#6aaa4a;Field green=#3a6a2a;Pond green=#5a7a4a;Sky blue=#a8d8f4;Gingham blue=#5a8ad8;Sunflower=#f0c83a;Mud brown=#6a5038'),
  els:[{id:'deck',label:'Deck',styles:['Barn-red boards','Weathered boards','Hay-strewn planks'],def:[0,0]},{id:'footing',label:'Footing',styles:['Fence posts','Hay bales','Tractor tyres'],def:[0,4]},
       {id:'fence',label:'Fence',none:true,styles:['No fence','Picket fence','Post-and-rail','Wagon wheel'],def:[1,2]},{id:'roof',label:'Barn roof',none:true,styles:['Open sky','Tin lean-to','Barn gable','Windmill vane'],def:[2,0]},
       {id:'light',label:'Lantern',light:true,styles:['Lantern on a nail','String of bulbs','Milk-can lantern'],def:[0,14]}],
  seat:['haybale','milkcan','rocker'], seatNames:['Hay bale','Milk-can stool','Rocking chair'], seatDef:[0,5],
  order:[
    ['footing',(o,s,c)=>HK.supports(o,c,['fence','hay','tyres'][s],5)],
    ['deck',(o,s,c)=>HK.deck(o,c,['red','boards','hay'][s])],
    ['fence',(o,s,c)=>{ if(s) HK.rail(o,c,['','picket','postrail','wheel'][s]); }],
    ['roof',(o,s,c)=>{ if(s===1) HK.roof(o,c,'tin',.02,.4); if(s===2) HK.roof(o,c,'barn',.02,.4); if(s===3){ const x=HK.at(o,.04); HK.rect(o,x,o.dockY-H*.16,2,H*.16,'#7a2a22'); HK.poly(o,[x,o.dockY-H*.16,x+W*.06,o.dockY-H*.14,x+W*.06,o.dockY-H*.12,x,o.dockY-H*.135],c); } }],
    ['seat'],
    ['light',(o,s)=>HK.light(o,['nail','bulbs','milkcan'][s])]] });

/* 16. The Buffet: the gingerbread platter */
hfMake('buffet',{ name:'Gingerbread platter', hname:'platter',
  colors:C16('Gingerbread=#b8743a;Dark gingerbread=#7a4a22;Wafer=#e8c890;Biscuit=#d8a860;Chocolate=#5a3420;Milk chocolate=#8a5a3a;Icing white=#fff6ee;Strawberry=#f4a0b0;Mint=#a8e0c8;Lemon=#f8e08a;Blueberry=#7a8ad8;Cherry red=#d8303a;Caramel=#d88a3a;Candle gold=#ffd060;Porcelain=#f0f0f4;Broth gold=#e8b060'),
  els:[{id:'platter',label:'Platter',styles:['Silver platter','Porcelain plate','Giant cracker'],def:[0,14]},{id:'posts',label:'Posts',styles:['Pretzel sticks','Wafer pillars','Candy canes'],def:[0,1]},
       {id:'trim',label:'Trim',none:true,styles:['No trim','Icing piping','Licorice rope','Breadsticks'],def:[1,6]},{id:'roof',label:'Roof',none:true,styles:['Open sky','Gingerbread roof','Cloche lid','Waffle-cone parasol'],def:[1,0]},
       {id:'light',label:'Candle',light:true,styles:['Dripping candle','Cupcake candles','Jelly mould'],def:[0,13]}],
  seat:['cupcake','teacup','macaron'], seatNames:['Cupcake stool','Teacup chair','Macaron pouf'], seatDef:[0,7],
  order:[
    ['posts',(o,s,c)=>HK.supports(o,s===2?'#d8303a':c,['pretzel','wafer','cane'][s],5)],
    ['platter',(o,s,c)=>HK.deck(o,c,['platter','plate','cracker'][s])],
    ['trim',(o,s,c)=>{ if(s) HK.rail(o,c,['','icing','licorice','breadstick'][s]); }],
    ['roof',(o,s,c)=>{ if(s===1){ HK.roof(o,c,'gable',.02,.4); for(let i=0;i<10;i++) HK.ell(o,HK.at(o,.02+i*.04),o.dockY-H*.12+H*.004,H*.003,H*.006,'#fff6ee'); } if(s===2) HK.roof(o,c,'cloche',.02,.4); if(s===3) HK.roof(o,c,'cone',.04,.4); }],
    ['seat'],
    ['light',(o,s)=>HK.light(o,['dripcandle','cupcake','jellymould'][s])]] });

/* 17. Corporate Pond: the office deck */
hfMake('corporate',{ name:'Office deck', hname:'office deck',
  colors:C16('Brushed steel=#a8b0b8;Dark steel=#5a6470;Concrete=#9a9a98;Light concrete=#c8c8c4;Glass cyan=#9ad0e0;Glass blue=#4a6a88;Corporate navy=#1e2e4a;Carpet grey=#6a6e74;Office white=#f4f6f8;Ficus green=#4a8a4a;Coffee brown=#6a4a32;Sticky yellow=#f8e070;Ticker green=#4ad86a;Ticker red=#e84a4a;Lanyard blue=#2a6ad8;Walnut=#8a5a3a'),
  els:[{id:'floor',label:'Floor',styles:['Carpet tiles','Polished concrete','Walnut boardroom'],def:[0,7]},{id:'supports',label:'Supports',styles:['Steel columns','Glass legs','Filing cabinets'],def:[0,0]},
       {id:'partition',label:'Partition',none:true,styles:['None','Glass balustrade','Cubicle wall','Velvet rope'],def:[1,4]},{id:'awning',label:'Awning',none:true,styles:['Open sky','Glass awning','Logo umbrella','Ceiling tiles'],def:[1,4]},
       {id:'light',label:'Lamp',light:true,styles:['Desk lamp','Floor lamp','Open 9–5 sign'],def:[0,8]}],
  seat:['swivel','executive','beanbag'], seatNames:['Swivel chair','Executive chair','Beanbag'], seatDef:[0,6],
  order:[
    ['supports',(o,s,c)=>HK.supports(o,c,['iron','glass','cabinet'][s],5)],
    ['floor',(o,s,c)=>HK.deck(o,c,['carpet','concrete','walnut'][s])],
    ['partition',(o,s,c)=>{ if(s) HK.rail(o,c,['','glass','cubicle','velvet'][s]); }],
    ['awning',(o,s,c)=>{ if(s===1) HK.roof(o,c,'glass',.02,.44); if(s===2) HK.roof(o,c,'logoumbrella',.06,.4); if(s===3) HK.roof(o,c,'ceiling',.02,.44); }],
    ['seat'],
    ['light',(o,s)=>HK.light(o,['desk','floor','sign'][s])]] });

/* 18. The Nile: the reed boat (floats) */
hfMake('nile',{ name:'Reed boat', hname:'reed boat', floats:true,
  colors:C16('Sandstone=#d8b880;Dark sandstone=#a8844a;Limestone=#ece0c4;Papyrus reed=#c8b060;Papyrus green=#6a9a4a;Palm wood=#7a5a3a;Linen=#f0e8d4;Gold leaf=#d8a830;Bright gold=#f0c84a;Lapis blue=#2a4a9a;Turquoise=#3ab0a8;Nile teal=#2a7a80;Carnelian=#b8402e;Ochre=#c8803a;Kohl black=#2a2428;Lotus pink=#f0a8b8'),
  els:[{id:'hull',label:'Hull',styles:['Papyrus reeds','Wooden felucca','Gilded barque'],def:[0,3]},{id:'sail',label:'Sail',styles:['Lateen sail','Square sail','Painted eye sail'],def:[0,6]},
       {id:'cabin',label:'Cabin',none:true,styles:['No cabin','Linen awning','Temple pylon','Striped tent'],def:[1,6]},{id:'cargo',label:'Cargo',none:true,styles:['No cargo','Amphorae','Fish baskets','Scroll chest'],def:[1,13]},
       {id:'light',label:'Lamp',light:true,styles:['Lotus lamp','Bronze brazier','Sun-disc lantern'],def:[0,15]}],
  seat:['lionstool','xstool','throne'], seatNames:['Lion-foot stool','Folding X stool','Gilded throne'], seatDef:[0,5],
  order:[
    ['hull',(o,s,c)=>HK.hull(o,c,['reed','felucca','barque'][s])],
    ['sail',(o,s,c)=>{ const x=HK.at(o,.6), y=o.dockY, top=y-H*.24; HK.rect(o,x,top,2.4,H*.24,'#7a5a3a'); if(s===0){ HK.line(o,[x-W*.04,y-H*.04,x+W*.02,top-H*.02],'#7a5a3a',1.6); HK.poly(o,[x-W*.036,y-H*.05,x+W*.018,top-H*.012,x+W*.03,y-H*.05],c); } else { HK.rect(o,x-W*.03,top+H*.02,W*.06,2,'#7a5a3a'); HK.poly(o,[x-W*.03,top+H*.022,x+W*.03,top+H*.022,x+W*.026,y-H*.06,x-W*.026,y-H*.06],c); if(s===2){ HK.ell(o,x,top+H*.09,W*.01,H*.008,'#f4f0e6'); HK.circ(o,x,top+H*.09,H*.006,'#2a4a9a'); HK.line(o,[x-W*.012,top+H*.09,x-W*.016,top+H*.1],'#2a2428',1.4); } } }],
    ['cabin',(o,s,c)=>{ if(s===1) HK.roof(o,c,'flat',.04,.4); if(s===2) HK.roof(o,c,'pylon',.04,.4); if(s===3) HK.roof(o,c,'stripedtent',.04,.4); }],
    ['cargo',(o,s,c)=>{ if(!s) return; const x=HK.at(o,.78), y=o.dockY; if(s===1) for(let i=0;i<2;i++){ HK.ell(o,x+i*W*.012,y-H*.016,W*.005,H*.016,c); HK.rect(o,x+i*W*.012-W*.002,y-H*.036,W*.004,H*.006,c); } if(s===2) for(let i=0;i<2;i++){ HK.poly(o,[x+i*W*.014,y,x+i*W*.014+W*.012,y,x+i*W*.014+W*.014,y-H*.018,x+i*W*.014-W*.002,y-H*.018],c); HK.ell(o,x+i*W*.014+W*.006,y-H*.02,W*.006,H*.004,'#c0c8cc'); } if(s===3){ HK.block(o,x,y-H*.022,W*.024,H*.022,'#7a5a3a'); HK.rect(o,x+W*.004,y-H*.03,W*.016,H*.008,c); } }],
    ['seat'],
    ['light',(o,s)=>HK.light(o,['lotus','brazier','sundisclamp'][s])]] });

/* 19. Circuit Lake: the hover pad (hovers above the water) */
hfMake('circuit',{ name:'Hover pad', hname:'hover pad',
  colors:C16('Chrome=#c8ccd8;Gunmetal=#3a3e4a;Carbon=#1a1c22;Hot pink=#ff4ab8;Neon magenta=#d83ad8;Electric cyan=#3ae8ff;Deep blue=#1a1a4a;Violet=#8a3a9a;Hologram lilac=#c8a0ff;Acid green=#7aff4a;Warning yellow=#ffe04a;LED white=#f4f8ff;Night purple=#2a1050;Cable black=#0e0e14;Sunset pink=#ff7ab8;Teal glow=#2ad8c8'),
  els:[{id:'pad',label:'Pad',styles:['Chrome plate','Carbon deck','Circuit glass'],def:[0,0]},{id:'thrust',label:'Thrusters',styles:['Anti-gravity rings','Thruster jets','Magnetic coils'],def:[0,5]},
       {id:'trim',label:'Trim',none:true,styles:['No trim','Neon strip','Hologram rail','Cable rail'],def:[1,3]},{id:'canopy',label:'Canopy',none:true,styles:['Open sky','Hologram canopy','Neon arch','Vending machine'],def:[1,8]},
       {id:'light',label:'Neon light',light:true,styles:['Neon tube','Hologram','LED orb'],def:[0,3]}],
  seat:['gaming','orbseat','arcadestool'], seatNames:['Gaming chair','Orb seat','Arcade stool'], seatDef:[0,2],
  order:[
    ['thrust',(o,s,c)=>HK.supports(o,c,['rings','jets','coils'][s],4)],
    ['pad',(o,s,c)=>HK.deck(o,c,['chrome','carbon','glass'][s])],
    ['trim',(o,s,c)=>{ if(s) HK.rail(o,c,['','neon','holo','cable'][s]); }],
    ['canopy',(o,s,c)=>{ if(s===1) HK.roof(o,c,'holo',.02,.44); if(s===2) HK.roof(o,c,'neonarch',.04,.44); if(s===3){ const a=HK.at(o,.02); HK.block(o,a,o.dockY-H*.13,W*.034,H*.13,c); HK.rect(o,a+W*.004,o.dockY-H*.12,W*.02,H*.06,'#3ae8ff'); for(let i=0;i<3;i++) HK.rect(o,a+W*.006,o.dockY-H*.115+i*H*.018,W*.016,H*.008,['#ff4ab8','#7aff4a','#ffe04a'][i]); } }],
    ['seat'],
    ['light',(o,s)=>HK.light(o,['neontube','hologram','orb'][s])]] });

/* 20. Mount Olympus: the temple porch */
hfMake('olympus',{ name:'Temple porch', hname:'temple porch',
  colors:C16('White marble=#f0ecf4;Veined marble=#d8d4e4;Shadow marble=#b8b4c8;Gold=#d8a830;Bright gold=#f4d060;Bronze=#a8743a;Laurel green=#6a8a4a;Olive=#8a9a5a;Royal blue=#2a4aa8;Cerulean=#4aa0d8;Sky blue=#a0c0f4;Cloud white=#ffffff;Storm violet=#5a4a9a;Lightning yellow=#fff07a;Tyrian purple=#7a2a6a;Terracotta=#c8683a'),
  els:[{id:'floor',label:'Floor',styles:['White marble','Mosaic','Cloud floor'],def:[0,0]},{id:'columns',label:'Columns',styles:['Fluted columns','Cloud pillars','Yggdrasil roots'],def:[0,1]},
       {id:'balustrade',label:'Balustrade',none:true,styles:['None','Marble balustrade','Laurel garland','Golden rail'],def:[0,0]},{id:'roof',label:'Roof',none:true,styles:['Open sky','Pediment','Winged sun disc','Rainbow arch'],def:[1,0]},
       {id:'light',label:'Brazier',light:true,styles:['Golden brazier','Lightning orb','Laurel torch'],def:[0,3]}],
  seat:['marblethrone','cloudbench','klismos'], seatNames:['Marble throne','Cloud bench','Klismos chair'], seatDef:[0,0],
  order:[
    ['columns',(o,s,c)=>HK.supports(o,c,['column','cloud','mangrove'][s],5)],
    ['floor',(o,s,c)=>HK.deck(o,c,['marble','mosaic','cloud'][s])],
    ['balustrade',(o,s,c)=>{ if(s) HK.rail(o,c,['','balustrade','garland','gold'][s]); }],
    ['roof',(o,s,c)=>{ if(s) HK.roof(o,c,['','pediment','sundisc','rainbow'][s],.02,.44); }],
    ['seat'],
    ['light',(o,s)=>HK.light(o,['goldbrazier','lightning','laurel'][s])]] });
