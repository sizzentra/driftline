// =====================================================================
// Every water's home (batch 5, 2026-11-22; designs in docs/HOME_DESIGNS.md, colours in docs/MAP_THEMES.md). Willow Pond (the
// approved pilot) is in cv_homefmt.js; these 19 are built from the home kit (cw_homekit.js). Each home: the seat plus 5 features
// made for that water, 3 styles each ("none" first where a feature can be left out), one list of 16 colours for every feature.
// A home listed here replaces that water's older home (the scene draws HOMEF homes instead, f_v3scene.js).
// =====================================================================
function hfMake(id,d){ d.seatH=d.seat.map(k=>HK.seatH(k));
  d.els.push({id:'seat',label:'Seat',styles:d.seatNames,def:d.seatDef||[0,0]});
  d.paint=function(o){ o.lights=[]; const col=e=>hfColor(id,e);
    for(const [e,fn] of d.order){ o.elCol=col(e); /* lights read their feature's colour (a stove's body, director 2026-11-22: colours did nothing) */ const r=e==='seat'?HK.seat(o,d.seat[hfStyle(id,'seat')],col('seat')):fn(o,hfStyle(id,e),col(e),col); if(r&&r.x!=null) o.lights.push(r); } };
  HOMEF[id]=d; }
const C16=s=>s.split(';').map(p=>{ const [n,h]=p.split('='); return [n.trim(),h.trim()]; });

/* 2. Stonebrook River: the mill landing */
hfMake('river',{ name:'Stonebrook mill landing', hname:'mill landing',
  colors:C16('River stone=#bab2a2;Dark stone=#8a8478;Slate=#5a6470;Mill oak=#7a5a3e;Dark oak=#4a3626;Roof brick=#7a4a3a;Iron=#3a3a40;Moss=#6a9a5e;Fern=#4f8050;River blue=#5a9aa4;Deep teal=#28525e;Sky=#a8d0ec;Birch white=#eef0e2;Autumn orange=#c8783a;Maple red=#a8402e;Wheat=#d8c08a'),
  /* map redo (director, 2026-11-22): the waterwheel feature is gone (the mill already has one, and it didn't turn): a mooring feature
     instead; the landing styles are three different builds; the lantern offers no open candle on a river landing */
  els:[{id:'moor',label:'Mooring',styles:['Mooring post','Flour sacks','Sack barrow'],def:[0,3]},{id:'landing',label:'Landing',styles:['Flagstones','Oak boards','Brick quay'],def:[0,0]},
       {id:'shed',label:'Mill shed',none:true,styles:['No shed','Slate roof','Timber frame','Thatch'],def:[1,2]},{id:'rack',label:'Fly rack',none:true,styles:['No rack','Rod rack','Creel and net','Fly line'],def:[1,3]},
       {id:'light',label:'Lantern',light:true,styles:['Cage lantern','Oil lamp','Wall bracket'],def:[0,13]}],
  seat:['stump','gardenbench','barrel'], seatNames:['Stump stool','Garden bench','Barrel'], seatDef:[1,3],
  order:[
    ['landing',(o,s,c)=>{
      if(s===0){ HK.supports(o,'#9a948a','stone',4); HK.deck(o,c,'stone'); }
      if(s===1){ HK.supports(o,HK.dk(c,.15),'square',5); HK.deck(o,c,'planks'); }
      if(s===2){ /* a solid brick quay wall down into the water instead of supports */ const x0=HF.x0(), top=o.dockY+HK.fh(), x=o.x, bc=HK.n(o,c), wl=o.wl;
        x.fillStyle=bc; x.fillRect(x0,top,o.pw-x0,wl-top); x.strokeStyle=HK.n(o,HK.dk(c,.35)); x.lineWidth=.8; const rh=H*.009;
        for(let yy=top,row=0;yy<wl;yy+=rh,row++){ x.beginPath(); x.moveTo(x0,yy); x.lineTo(o.pw,yy); for(let xx=x0+(row%2)*W*.006;xx<o.pw;xx+=W*.012){ x.moveTo(xx,yy); x.lineTo(xx,Math.min(wl,yy+rh)); } x.stroke(); }
        const wg=x.createLinearGradient(0,wl-H*.03,0,wl); wg.addColorStop(0,'rgba(26,36,24,0)'); wg.addColorStop(1,'rgba(26,36,24,.5)'); x.fillStyle=wg; x.fillRect(x0,wl-H*.03,o.pw-x0,H*.03);
        const deep=o.P.wBot||'#1a3040', ug=x.createLinearGradient(0,wl,0,wl+H*.16); ug.addColorStop(0,v3rgba(mix(c,deep,.7),.6)); ug.addColorStop(1,v3rgba(deep,0)); x.fillStyle=ug; x.fillRect(x0,wl,o.pw-x0,H*.16);
        for(let i=0;i<5;i++) o.posts.push({x:x0+(o.pw-x0)*(i+.5)/5,w:W*.02}); HK.deck(o,'#9a948a','stone'); } }],
    ['rack',(o,s,c)=>{ const x=HK.at(o,.42), y=o.dockY; if(s===1){ HK.rect(o,x,y-H*.06,W*.02,2,c); for(let i=0;i<3;i++) HK.line(o,[x+i*W*.006,y,x+i*W*.007+W*.004,y-H*.12],HK.dk(c,.2),1.2); } if(s===2){ HK.poly(o,[x,y,x+W*.012,y,x+W*.014,y-H*.02,x-W*.002,y-H*.02],c); HK.line(o,[x+W*.018,y,x+W*.024,y-H*.1],'#5a4030',1.4); HK.ell(o,x+W*.025,y-H*.11,W*.006,H*.01,v3rgba('#3a3a40',.4)); }
      if(s===3){ /* a fly line strung between two posts, sagging under its own weight, with tied flies hanging on short threads (director: it had no physics) */ const a=x-W*.012, b=x+W*.034, ty=y-H*.1, sag=H*.016; HK.rect(o,a-1,ty,2,y-ty,c); HK.rect(o,b-1,ty,2,y-ty,c);
        HK.curve(o,a,ty,(a+b)/2,ty+sag*2,b,ty,'#d8c8a0',1); for(let i=1;i<6;i++){ const u=i/6, px=a+(b-a)*u, py=ty+sag*4*u*(1-u); HK.line(o,[px,py,px,py+H*.008],v3rgba('#e8e0c8',.8),.7); HK.circ(o,px,py+H*.009,1.7,['#c8783a','#a8402e','#d8c08a','#6a9a5e','#5a9aa4'][i-1]); } } }],
    ['shed',(o,s,c)=>{ if(s) HK.roof(o,c,['','slate','timberframe','thatch'][s],.02,.36); }],
    ['moor',(o,s,c)=>{ const x=HK.at(o,.7), y=o.dockY, sc=HF.sc(); /* on the landing's front half, clear of the angler */
      if(s===0){ HK.rect(o,x-3.5*sc,y-9*sc,7*sc,9*sc,'#3a3a40'); HK.ell(o,x,y-9*sc,5*sc,1.6*sc,'#4a4a52'); HK.ell(o,x+9*sc,y-1.6*sc,6*sc,1.8*sc,c); HK.ell(o,x+9*sc,y-1.6*sc,3.5*sc,1*sc,HK.dk(c,.3)); /* an iron bollard and a coil of rope */
        HK.curve(o,x+3*sc,y-7*sc,x+12*sc,y+2*sc,x+16*sc,o.wl,c,Math.max(1.2,1.1*sc)); }
      if(s===1){ for(const [dx,dy,k] of [[0,0,1],[9,0,1],[4.5,-7,1]]){ const bx=x+dx*sc, by=y+dy*sc; HK.poly(o,[bx-4.5*sc,by,bx+4.5*sc,by,bx+4*sc,by-7*sc,bx-4*sc,by-7*sc],'#e8dcc0'); HK.rect(o,bx-4.4*sc,by-4.6*sc,8.8*sc,1.6*sc,c); HK.ell(o,bx,by-7.4*sc,1.4*sc,1*sc,'#c8b890'); } } /* flour sacks with the mill's band */
      if(s===2){ const wx=x+2*sc; HK.line(o,[x-4*sc,y-18*sc,x+1*sc,y-2*sc,x+10*sc,y-2*sc],HK.dk(c,.2),Math.max(1.4,1.4*sc)); HK.circ(o,wx,y-3*sc,3*sc,'#3a3a40'); HK.circ(o,wx,y-3*sc,1.2*sc,c);
        for(const k of [0,1]){ const by=y-3*sc-k*6.5*sc, bx=x+5*sc-k*1.5*sc; HK.poly(o,[bx-4*sc,by,bx+4*sc,by,bx+3.6*sc,by-6*sc,bx-3.6*sc,by-6*sc],'#e8dcc0'); HK.rect(o,bx-3.9*sc,by-3.8*sc,7.8*sc,1.4*sc,c); } } }],
    ['seat'],
    ['light',(o,s)=>HK.light(o,['cage','hanging','bracket'][s])]] });

/* 3. Cherry Blossom Lake: the tea house deck */
hfMake('blossom',{ name:'Tea house deck', hname:'tea house deck',
  colors:C16('Lacquer red=#b8322a;Vermilion=#d8503a;Cedar=#9a6a42;Dark cedar=#5a3a26;Black lacquer=#2a2426;Paper white=#f4ece0;Rice beige=#e0d0b0;Bamboo=#b8b06a;Moss=#6a8a52;Jade=#5a9a9a;Deep jade=#1e4a58;Blossom pink=#f4a8c4;Pale sakura=#ffe4ee;Wisteria=#a88ac8;Lantern amber=#f0a848;Stone grey=#9a948a'),
  /* map redo (director, 2026-11-22: "veranda styles don't look different from the earlier homes", "options overlap and look cluttered",
     "don't capture Japan", the torii covered nothing): three different builds, a wisteria trellis instead of the torii, the tree kept to
     the left of the seat, the wind chime hanging from the roof's front edge (or its own bamboo pole when there is no roof) */
  els:[{id:'engawa',label:'Veranda',styles:['Cedar engawa','Bamboo deck','Red bridge deck'],def:[0,2]},{id:'roof',label:'Roof',none:true,styles:['Open sky','Curved tiles','Thatched gate','Wisteria trellis'],def:[1,4]},
       {id:'lanterns',label:'Lanterns',light:true,styles:['Paper lanterns','Stone tōrō','Red chōchin'],def:[0,14]},{id:'tree',label:'Cherry tree',none:true,styles:['No tree','Blossom branch','Bonsai','Weeping cherry'],def:[1,11]},
       {id:'chime',label:'Wind chime',none:true,styles:['No chime','Glass fūrin','Bamboo chimes','Temple bell'],def:[1,5]}],
  seat:['cushion','lowbench','stool'], seatNames:['Zabuton cushion','Bamboo bench','Lacquer stool'], seatDef:[0,0],
  order:[
    ['engawa',(o,s,c)=>{ if(s===0){ HK.supports(o,'#3a3436','square',5); HK.deck(o,c,'walnut'); HK.rect(o,HF.x0(),o.dockY-1,o.pw-HF.x0(),Math.max(2,H*.004),'#c8c49a'); } /* dark cedar on black posts, a tatami-edge strip along the boards */
      if(s===1){ HK.supports(o,'#b8b06a','bamboo',6); HK.deck(o,c,'bamboo'); }
      if(s===2){ HK.supports(o,c,'round',4); HK.deck(o,c,'red'); const x0=HF.x0(), y=o.dockY, rh=H*.04; for(let i=0;i<=4;i++){ const px=x0+(o.pw-x0)*i/4; HK.rect(o,px-2,y-rh,4,rh,c); HK.ell(o,px,y-rh-H*.004,H*.005,H*.006,'#3a3436'); } HK.rect(o,x0,y-rh*.75,o.pw-x0,Math.max(2.5,H*.005),c); } }], /* a red bridge rail with black giboshi caps */
    ['roof',(o,s,c)=>{ if(s) HK.roof(o,c,['','curved','thatchgate','wisteria'][s],.04,.5); }],
    ['tree',(o,s,c)=>{ if(!s) return; const y=o.dockY, cx=HK.at(o,.68), w=W*.035, X=f=>cx+w*(f-.5); /* a small cherry in a stone planter on the open deck past the angler, in front of the roof, clear of the lanterns and chime */
      HK.poly(o,[X(.3),y,X(.7),y,X(.74),y-H*.014,X(.26),y-H*.014],'#8a847a'); HK.rect(o,X(.24),y-H*.016,w*.52,H*.004,'#6a645a');
      if(s===2){ HK.curve(o,X(.5),y-H*.014,X(.38),y-H*.04,X(.56),y-H*.05,'#5a3a26',2.5); for(let i=0;i<6;i++) HK.circ(o,X(.36+i*.06),y-H*.052-Math.sin(i*1.3)*H*.008,H*.008,i%2?c:HK.lt(c,.3)); return; }
      HK.curve(o,X(.5),y-H*.014,X(.46),y-H*.07,X(.55),y-H*.1,'#5a3a26',3); HK.curve(o,X(.52),y-H*.08,X(.8),y-H*.09,X(.95),y-H*.08,'#5a3a26',1.8); HK.curve(o,X(.5),y-H*.075,X(.25),y-H*.09,X(.08),y-H*.075,'#5a3a26',1.8);
      for(let i=0;i<16;i++){ const k=i/15; HK.circ(o,X(.05+.9*k),y-H*(.095+.02*Math.sin(k*Math.PI))+Math.sin(i*2.1)*H*.006,H*.0085,i%3?c:HK.lt(c,.3)); }
      if(s===3) for(let i=0;i<8;i++) HK.line(o,[X(.1+i*.11),y-H*.09,X(.1+i*.11),y-H*(.045+(i%3)*.01)],v3rgba(c,.85),1.3); }],
    ['chime',(o,s,c)=>{ if(!s) return; const x=HK.at(o,.48), y=o.dockY-H*.12; if(!hfStyle(o.id,'roof')){ HK.rect(o,x+H*.012-1,y-H*.02,2.4,o.dockY-y+H*.02,'#b8b06a'); HK.line(o,[x,y-H*.02,x+H*.012,y-H*.02],'#b8b06a',1.6); } /* no roof: its own bamboo pole */ HK.line(o,[x,y-H*.02,x,y],'#3a2a20',1); if(s===1){ HK.ell(o,x,y+H*.006,H*.006,H*.007,v3rgba(HK.lt(c,.3),.7)); HK.rect(o,x-1,y+H*.012,2,H*.016,c); } if(s===2) for(let i=-2;i<=2;i++) HK.rect(o,x+i*H*.004-1,y,2,H*.02+Math.abs(i)*H*.004,'#b8b06a'); if(s===3){ HK.rect(o,x-H*.012,y-H*.02,H*.024,2,'#5a3a26'); HK.poly(o,[x-H*.008,y+H*.014,x-H*.006,y,x+H*.006,y,x+H*.008,y+H*.014],'#a8743a'); } }],
    ['seat'],
    ['lanterns',(o,s)=>HK.light(o,['paperline','toro','chochin'][s])]] });

/* 4. Saltmarsh Coast: the pier end */
hfMake('coast',{ name:'Saltmarsh pier end', hname:'pier',
  colors:C16('Driftwood=#a8a090;Silver-grey=#8a8a84;Tar black=#2e2a28;Weathered blue=#5a7a8a;Sea glass=#9adcd8;Sea teal=#3aa0a8;Deep sea=#145a6a;Sand=#e8d6a4;Dune grass=#8aa85a;Rope tan=#c8a878;Buoy red=#c8483a;Buoy yellow=#e8c04a;Lighthouse white=#f4f0e6;Shingle brown=#6a5440;Gull grey=#c8ccd0;Oilskin yellow=#d8b030'),
  els:[{id:'pilings',label:'Pilings',styles:['Tarred pilings','Braced pilings','Rock jetty'],def:[0,2]},{id:'deck',label:'Pier deck',styles:['Salt-grey boards','Tarred planks','Steel grating'],def:[0,0]},
       {id:'shack',label:'Bait shack',none:true,styles:['No shack','Shingle shack','Boathouse','Sail awning'],def:[1,3]},{id:'gear',label:'Fishing gear',none:true,styles:['No gear','Lobster pots','Drying net','Buoys'],def:[3,10]},
       {id:'light',label:'Lamp',light:true,styles:['Ship’s lantern','Harbour lamp','Buoy light'],def:[0,13]}],
  seat:['crate','bucket','driftbench'], seatNames:['Fish crate','Upturned bucket','Driftwood bench'], seatDef:[0,0],
  order:[
    ['pilings',(o,s,c)=>HK.supports(o,c,['tarred','braced','jetty'][s],5)],
    ['deck',(o,s,c)=>HK.deck(o,c,['boards','planks','grate'][s])],
    /* map redo (director, 2026-11-22: "no real variety", options recycled from other homes, buoys floating beside the angler): a shingle
       shack, a boathouse with a board wall and a porthole, a boat's sail rigged as an awning; the buoys hang from a line between two posts */
    ['shack',(o,s,c)=>{ const y=o.dockY, sc=HF.sc(); if(s===1){ HK.roof(o,c,'shackbox',.02,.3); for(let i=1;i<6;i++) HK.line(o,[HK.at(o,.02),y-H*.13+i*H*.004,HK.at(o,.3),y-H*.13-H*.03*(i/6)+i*H*.004],HK.dk(c,.35),.8); }
      if(s===2){ const a=HK.at(o,.0), b=HK.at(o,.12), top=y-H*.12; HK.block(o,a,top,b-a,y-top,HK.dk(c,.1)); for(let i=1;i<6;i++) HK.line(o,[a+(b-a)*i/6,top,a+(b-a)*i/6,y],HK.dk(c,.35),.8); HK.circ(o,(a+b)/2,top+H*.035,H*.008,'#3a3a40'); HK.circ(o,(a+b)/2,top+H*.035,H*.0055,v3rgba('#9adcd8',.7)); HK.roof(o,c,'gable',.0,.34); }
      if(s===3) HK.roof(o,c,'sailawning',.02,.36); }],
    ['gear',(o,s,c)=>{ const x=HK.at(o,.55), y=o.dockY; if(s===1) for(let i=0;i<2;i++){ HK.block(o,x,y-H*.02*(i+1),W*.024,H*.02,HK.dk(c,.1)); for(let k=0;k<4;k++) HK.line(o,[x+k*W*.006,y-H*.02*(i+1),x+k*W*.006,y-H*.02*i],'#2e2a28'); }
      if(s===2){ HK.rect(o,x+W*.01,y-H*.13,2,H*.13,'#6a5440'); o.x.fillStyle=v3rgba(c,.5); o.x.beginPath(); o.x.moveTo(x+W*.011,y-H*.13); o.x.quadraticCurveTo(x-W*.01,y-H*.08,x,y-H*.02); o.x.lineTo(x+W*.011,y-H*.04); o.x.fill(); }
      if(s===3){ const a=x-W*.012, b=x+W*.034, ty=y-H*.085; HK.rect(o,a-1,ty,2.2,y-ty,'#6a5440'); HK.rect(o,b-1,ty,2.2,y-ty,'#6a5440'); HK.curve(o,a,ty,(a+b)/2,ty+H*.016,b,ty,'#c8a878',1.2);
        for(let i=0;i<4;i++){ const u=(i+1)/5, px=a+(b-a)*u, py=ty+H*.032*u*(1-u); HK.line(o,[px,py,px,py+H*.008],'#c8a878',.8); HK.ell(o,px,py+H*.016,H*.006,H*.009,[c,'#e8c04a','#f4f0e6','#c8483a'][i]); } } }],
    ['seat'],
    ['light',(o,s)=>HK.light(o,['hook','lighthouse','buoy'][s])]] });

/* 5. Frostbite Lake: the ice camp (stands on the ice) */
hfMake('frost',{ name:'Ice camp', hname:'ice camp', ice:true,
  colors:C16('Snow white=#f6f8ff;Frost=#d8e8f6;Ice blue=#8aaad0;Glacier=#4a6a9a;Deep ice=#1a2a4a;Spruce=#3e5a78;Birch=#e8e0d0;Birch bark=#4a4440;Timber=#7a5440;Dark timber=#4a3428;Wool red=#b8383a;Wool cream=#f0e6d0;Stove iron=#2a2a30;Lantern orange=#f0983a;Aurora green=#7af0b0;Dusk mauve=#9a88b8'),
  /* map redo (director, 2026-11-22): the ice huts stay (the first building the director liked); the blocky platform becomes an ice shelf
     with a ragged snow-capped edge; a floor choice made no sense outdoors, so that slot is the angler's gear; the stoves are stoves (no
     storm lantern) and take the chosen colour; the shanty's roof sits on its walls; the sleds stand clear of the hut door, with detail */
  els:[{id:'hut',label:'Ice hut',styles:['Canvas tent','Timber shanty','Snow igloo'],def:[0,10]},{id:'gear',label:'Gear',styles:['Hand auger','Bait bucket','Catch on the ice'],def:[0,10]},
       {id:'hole',label:'Ice hole',styles:['Tip-up flag','Skimmer','Twin holes'],def:[0,10]},{id:'stove',label:'Stove',light:true,styles:['Box stove','Pot-belly stove','Campfire tray'],def:[0,12]},
       {id:'sled',label:'Sled',none:true,styles:['No sled','Box sled','Snowmobile','Dog sled'],def:[1,8]}],
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
    ['hole',(o,s,c)=>{ const x=HK.at(o,.97), y=o.dockY+H*.004; HK.ell(o,x,y,W*.01,H*.003,'#1a2a4a'); if(s===0){ HK.line(o,[x+W*.006,y,x+W*.012,y-H*.03],'#4a4440',1.2); HK.poly(o,[x+W*.012,y-H*.03,x+W*.024,y-H*.026,x+W*.012,y-H*.022],c); } if(s===1){ HK.line(o,[x-W*.008,y,x-W*.018,y-H*.04],'#4a3428',1.4); HK.ell(o,x-W*.008,y,W*.004,H*.003,c); } if(s===2){ HK.ell(o,x-W*.02,y,W*.006,H*.003,'#1a2a4a'); HK.poly(o,[x-W*.012,y,x-W*.004,y,x-W*.005,y-H*.016,x-W*.011,y-H*.016],c); } }],
    ['hut',(o,s,c)=>{ if(s===0) HK.roof(o,c,'walltent',.02,.4); if(s===1){ HK.roof(o,c,'shackbox',.02,.34); HK.rect(o,HK.at(o,.08),o.dockY-H*.09,W*.012,H*.014,'#f0983a'); } if(s===2){ const m=HK.at(o,.2), R=(HK.at(o,.4)-HK.at(o,.0))*.5; o.x.fillStyle=HK.n(o,c); o.x.beginPath(); o.x.arc(m,o.dockY,R,Math.PI,0); o.x.fill(); for(let i=1;i<4;i++){ o.x.strokeStyle=HK.n(o,HK.dk(c,.12)); o.x.beginPath(); o.x.arc(m,o.dockY,R*i/4+R*.2,Math.PI,0); o.x.stroke(); } HK.poly(o,[m+R*.3,o.dockY,m+R*.3,o.dockY-R*.4,m+R*.6,o.dockY-R*.4,m+R*.6,o.dockY],'#1a2a4a'); } }],
    ['sled',(o,s,c)=>{ if(!s) return; const x=HK.at(o,.74), y=o.dockY, sc=HF.sc()*.8; /* past the angler, clear of the hut door */
      if(s===1){ HK.curve(o,x-2*sc,y-.5*sc,x+12*sc,y+.6*sc,x+20*sc,y-4*sc,'#4a4440',1.4*sc); HK.line(o,[x+1*sc,y-.5*sc,x+1*sc,y-3*sc],'#4a4440',1); HK.line(o,[x+15*sc,y-.5*sc,x+15*sc,y-3*sc],'#4a4440',1);
        HK.block(o,x,y-11*sc,17*sc,8*sc,c); for(let k=1;k<4;k++) HK.line(o,[x+k*17*sc/4,y-11*sc,x+k*17*sc/4,y-3*sc],HK.dk(c,.3),.8); HK.curve(o,x+17*sc,y-9*sc,x+24*sc,y-6*sc,x+26*sc,y,'#c8a878',.9); } /* a box sled: curled runners, slatted box, tow rope */
      if(s===2){ HK.curve(o,x-1*sc,y,x+14*sc,y+.6*sc,x+22*sc,y-3*sc,'#2a2a30',1.6*sc); HK.poly(o,[x,y-2*sc,x+18*sc,y-2*sc,x+21*sc,y-7*sc,x+12*sc,y-11*sc,x+2*sc,y-10*sc],c); HK.poly(o,[x+12*sc,y-11*sc,x+16*sc,y-16*sc,x+18*sc,y-15*sc,x+16*sc,y-10*sc],v3rgba('#cfe0f4',.7));
        HK.block(o,x+1*sc,y-13*sc,9*sc,3*sc,'#2a2a30'); HK.rect(o,x-1*sc,y-4*sc,10*sc,3*sc,'#3a3a40'); for(let k=0;k<5;k++) HK.rect(o,x+k*2*sc-1*sc,y-4*sc,1,3*sc,'#5a5a62'); HK.rect(o,x+19*sc,y-8*sc,2*sc,1.4*sc,'#f0e080'); } /* a snowmobile: front ski, body, windshield, seat, track, headlight */
      if(s===3){ HK.curve(o,x-2*sc,y,x+14*sc,y+.6*sc,x+22*sc,y-5*sc,'#4a3428',1.4*sc); HK.line(o,[x+2*sc,y,x+2*sc,y-6*sc],'#4a3428',1); HK.line(o,[x+14*sc,y,x+14*sc,y-6*sc],'#4a3428',1);
        o.x.fillStyle=HK.n(o,v3rgba(c,.85)); o.x.beginPath(); o.x.moveTo(x+1*sc,y-6*sc); o.x.quadraticCurveTo(x+8*sc,y-3*sc,x+16*sc,y-6*sc); o.x.lineTo(x+16*sc,y-10*sc); o.x.lineTo(x+1*sc,y-10*sc); o.x.closePath(); o.x.fill(); HK.line(o,[x+1*sc,y-6*sc,x-2*sc,y-17*sc,x+3*sc,y-17*sc],'#4a3428',1.4*sc); } }], /* a dog sled: runners, a basket in the chosen colour, the driver's handlebar */
    ['seat'],
    ['stove',(o,s)=>HK.light(o,['stove','potbelly','firering'][s],HK.at(o,.6))]] });

/* 6. Canadian Rockies: the lodge ledge */
hfMake('rockies',{ name:'Lodge ledge', hname:'lodge ledge',
  colors:C16('Cedar log=#9a6a42;Spruce log=#7a5a3e;Dark log=#4a3426;Granite=#9a948a;Dark granite=#5a5650;Glacier turquoise=#2a9aa8;Ice teal=#7ad8d8;Deep lake=#0a4858;Spruce green=#2e5040;Moss=#5a7a4a;Snow=#f4f8fc;Flannel red=#b8322a;Flannel black=#2a2626;Maple orange=#d8702a;Birch cream=#ece2cc;Canoe green=#3a6a4a'),
  els:[{id:'deck',label:'Ledge deck',styles:['Log deck','Cedar planks','Granite slab'],def:[0,0]},{id:'footing',label:'Footing',styles:['Log cribbing','Granite boulders','Log stilts'],def:[0,1]},
       {id:'shelter',label:'Shelter',none:true,styles:['Open sky','Log porch roof','Tarp shelter','Canvas fly'],def:[1,2]} /* map redo: its own shelters, all clear of the angler (director: options covered the player and were borrowed from other homes) */,{id:'canoe',label:'Canoe',none:true,styles:['No canoe','Canoe on a rack','Canoe beside','Kayak'],def:[2,15]},
       {id:'fire',label:'Campfire',light:true,styles:['Fire ring','Lodge lantern','Fire bowl'],def:[0,13]}],
  seat:['muskoka','stumpblanket','rocker'], seatNames:['Muskoka chair','Stump and blanket','Log rocker'], seatDef:[0,11],
  order:[
    ['footing',(o,s,c)=>HK.supports(o,c,['crib','boulder','stilts'][s],s===1?4:5)],
    ['deck',(o,s,c)=>HK.deck(o,c,['logs','planks','stone'][s])],
    ['shelter',(o,s,c)=>{ if(s) HK.roof(o,c,['','logporch','tarp','canvasfly'][s],.02,.4); }],
    ['canoe',(o,s,c)=>{ if(!s) return; const a=HK.at(o,s===1?.04:.42), y=o.dockY-(s===1?H*.07:0), L2=W*(s===3?.045:.06); if(s===1){ HK.rect(o,a+W*.006,y,2,o.dockY-y,'#4a3426'); HK.rect(o,a+L2-W*.006,y,2,o.dockY-y,'#4a3426'); }
      o.x.fillStyle=HK.n(o,c); o.x.beginPath(); o.x.moveTo(a,y-H*.012); o.x.quadraticCurveTo(a+L2/2,y+H*.014,a+L2,y-H*.012); o.x.quadraticCurveTo(a+L2/2,y-H*.002,a,y-H*.012); o.x.fill(); if(s===2) HK.line(o,[a+L2*.3,y-H*.014,a+L2*.8,y-H*.03],'#ece2cc',1.6); }],
    ['seat'],
    ['fire',(o,s)=>HK.light(o,['firering','nail','firebowl'][s],HK.at(o,.62))]] });

/* 7. Coral Shallows: the beach hut on stilts */
hfMake('reef',{ name:'Beach hut', hname:'beach hut',
  colors:C16('Palm wood=#9a7a52;Bleached wood=#c8b088;Thatch=#d8b46a;Dark thatch=#a8843a;Sand=#f4e2b0;Shell white=#fbf2e4;Turquoise=#18b0c0;Lagoon=#7ae8e0;Deep reef=#0a6a8a;Palm green=#3a9a4a;Frond dark=#22703a;Coral=#ff7a6a;Mango=#ffb84a;Orchid=#c86ad8;Hibiscus red=#e0403a;Sky blue=#6ccaf4'),
  els:[{id:'stilts',label:'Stilts',styles:['Palm trunks','Bamboo','Coral stone'],def:[0,0]},{id:'deck',label:'Platform',styles:['Palm planks','Reed mat','Driftwood'],def:[0,1]},
       {id:'roof',label:'Hut roof',none:true,styles:['Open sky','Palapa','Scallop shell','Shade sail'],def:[1,2]},{id:'gear',label:'Beach gear',none:true,styles:['No gear','Surfboard','Snorkel set','Shell garland'],def:[1,11]},
       {id:'torch',label:'Torch',light:true,styles:['Tiki torch','Shell lantern','Glass floats'],def:[0,13]}],
  seat:['beachchair','hammock','peacock'], seatNames:['Beach chair','Hammock','Peacock chair'], seatDef:[0,6],
  order:[
    ['stilts',(o,s,c)=>HK.supports(o,c,['palm','bamboo','stone'][s],5)],
    ['deck',(o,s,c)=>HK.deck(o,c,['planks','mat','boards'][s])],
    ['roof',(o,s,c)=>{ if(s===1) HK.roof(o,c,'palapa',.02,.42); if(s===2) HK.roof(o,c,'scallop',.02,.42); if(s===3) HK.roof(o,c,'shadesail',.02,.42); /* its own covers (map redo: thatch, fronds and the beach umbrella were shared with other homes) */ }],
    ['gear',(o,s,c)=>{ const x=HK.at(o,.42), y=o.dockY; if(s===1){ HK.ell(o,x+W*.006,y-H*.05,W*.006,H*.05,c,-.08); HK.line(o,[x+W*.006,y-H*.09,x+W*.006,y-H*.01],'#f4efe6',1); } if(s===2){ HK.rect(o,x,y-H*.1,2,H*.1,'#9a7a52'); HK.ell(o,x+W*.006,y-H*.08,W*.004,H*.006,c); HK.poly(o,[x+W*.002,y-H*.06,x+W*.012,y-H*.06,x+W*.016,y-H*.035,x+W*.004,y-H*.04],HK.dk(c,.2)); } if(s===3){ HK.curve(o,x-W*.02,y-H*.11,x,y-H*.08,x+W*.02,y-H*.11,'#c8a878',1); for(let i=0;i<6;i++) HK.circ(o,x-W*.016+i*W*.0064,y-H*(.1-Math.sin(i/5*Math.PI)*.02),H*.004,i%2?c:'#fbf2e4'); } }],
    ['seat'],
    ['torch',(o,s)=>HK.light(o,['tiki','shells','floats'][s])]] });

/* 8. Florida Keys: the flats skiff (floats) */
hfMake('keys',{ name:'Flats skiff', hname:'skiff', floats:true,
  colors:C16('Boat white=#f4f6f4;Fiberglass cream=#ece4d0;Aluminium=#b8c0c4;Teak=#9a6a3a;Flats aqua=#28c0c8;Shallow mint=#8af0e0;Deep channel=#0a7090;Conch pink=#f0a0a8;Flamingo=#f06a8a;Mint=#9ae0c0;Lemon=#f4e07a;Sunset orange=#f8a050;Sand=#f4e6c0;Palm green=#3a8a5a;Navy trim=#1e3a5a;Cooler red=#d8483a'),
  els:[{id:'hull',label:'Hull',styles:['Flats skiff','Center console','Pastel jon boat'],def:[0,0]},{id:'top',label:'Top',none:true,styles:['Open sky','T-top','Bimini','Clamp umbrella'],def:[1,1]},
       {id:'console',label:'Console',styles:['Center console','Poling platform','Tiller outboard'],def:[0,0]},{id:'gear',label:'Gear',styles:['Rod holders','Cooler and bucket','Flamingo float'],def:[0,15]},
       {id:'light',label:'Nav lights',light:true,styles:['Bow lights','T-top light','Cooler lantern'],def:[0,13]}],
  seat:['captain','coolerseat','beanbag'], seatNames:['Captain’s chair','Cooler seat','Bean bag'], seatDef:[0,14],
  order:[
    ['hull',(o,s,c)=>HK.hull(o,c,['skiff','console','jon'][s])],
    ['console',(o,s,c)=>{ const x=HK.at(o,.5), y=o.dockY; if(s===0){ HK.block(o,x,y-H*.035,W*.02,H*.035,c); HK.poly(o,[x,y-H*.035,x+W*.006,y-H*.05,x+W*.016,y-H*.05,x+W*.02,y-H*.035],v3rgba('#9ad0e0',.6)); } if(s===1){ const a=HK.at(o,.04); for(const px of [a,a+W*.022]) HK.rect(o,px,y-H*.1,2,H*.1,'#b8c0c4'); HK.rect(o,a-W*.002,y-H*.1,W*.026,H*.006,c); } if(s===2){ const a=HF.x0(); HK.block(o,a-W*.012,y-H*.03,W*.014,H*.03,'#2a2a30'); HK.rect(o,a-W*.008,y,W*.004,H*.06,'#2a2a30'); } }],
    ['top',(o,s,c)=>{ if(s===1) HK.roof(o,c,'ttop',.36,.72); if(s===2) HK.roof(o,c,'bimini',.3,.72); if(s===3) HK.roof(o,c,'beachumbrella',.1,.42); }],
    ['gear',(o,s,c)=>{ const x=HK.at(o,.8), y=o.dockY; if(s===0) for(let i=0;i<3;i++) HK.line(o,[x+i*W*.005,y,x+i*W*.007+W*.01,y-H*.13],'#2a2a30',1.2); if(s===1){ HK.block(o,x,y-H*.024,W*.024,H*.024,c); HK.rect(o,x,y-H*.024,W*.024,H*.006,'#f4f6f4'); } if(s===2){ HK.ell(o,x+W*.016,o.wl,W*.016,H*.008,c); HK.curve(o,x+W*.03,o.wl-H*.006,x+W*.036,o.wl-H*.03,x+W*.03,o.wl-H*.034,c,2.4); } }],
    ['seat'],
    ['light',(o,s)=>HK.light(o,['navlight','post','table'][s])]] });

/* 9. Brine Shelf: the sport-fishing boat (floats) */
hfMake('shelf',{ name:'Sport-fishing boat', hname:'boat', floats:true,
  colors:C16('Hull white=#f2f2ee;Deck teak=#a8743a;Dark teak=#6a4626;Brass=#c8a04a;Chrome=#c0c8cc;Navy hull=#1e2e4a;Ocean blue=#2a7a9a;Deep ocean=#0c3a5a;Foam=#e4f0f0;Sail canvas=#f4ead8;Rope=#c8a878;Flag red=#c8382e;Flag yellow=#e8c03a;Flag blue=#2a5aa8;Life-ring orange=#f0782a;Horizon gold=#ffe0a8'),
  els:[{id:'hull',label:'Hull',styles:['Sport-fisher','Wooden cruiser','Steel workboat'],def:[0,0]},{id:'bridge',label:'Flybridge',styles:['Open flybridge','Wheelhouse','Tuna tower'],def:[0,0]},
       {id:'rig',label:'Outriggers',styles:['Twin outriggers','Rod rack','Harpoon pulpit'],def:[0,4]},{id:'flags',label:'Flags',none:true,styles:['No flags','Signal flags','Marlin pennant','Burgee'],def:[1,11]},
       {id:'light',label:'Deck light',light:true,styles:['Brass lantern','Masthead light','Floodlight'],def:[0,15]}],
  seat:['fighting','teakbench','deckstool'], seatNames:['Fighting chair','Teak bench','Deck stool'], seatDef:[0,1],
  order:[
    ['hull',(o,s,c)=>HK.hull(o,c,['sport','cruiser','steel'][s])],
    ['rig',(o,s,c)=>{ const x=HK.at(o,.55), y=o.dockY; if(s===0){ HK.line(o,[x,y,x-W*.05,y-H*.2],c,1.6); HK.line(o,[x+W*.01,y,x+W*.06,y-H*.18],c,1.6); } if(s===1){ HK.rect(o,HK.at(o,.02),y-H*.03,W*.04,2,c); for(let i=0;i<4;i++) HK.line(o,[HK.at(o,.03)+i*W*.009,y-H*.03,HK.at(o,.03)+i*W*.009-W*.004,y-H*.12],'#2a2a30',1); } if(s===2){ HK.rect(o,o.pw,y-H*.004,W*.03,H*.004,c); HK.line(o,[o.pw+W*.03,y,o.pw+W*.03,y-H*.04],c,1.4); } }],
    ['bridge',(o,s,c)=>{ const a=HK.at(o,.45), b=HK.at(o,.8), y=o.dockY; if(s===0){ HK.rect(o,a,y-H*.07,2,H*.07,'#c0c8cc'); HK.rect(o,b,y-H*.07,2,H*.07,'#c0c8cc'); HK.rect(o,a-W*.004,y-H*.075,b-a+W*.01,H*.008,c); HK.rail(Object.assign({},o,{dockY:y-H*.075}),'#c0c8cc','iron'); } if(s===1){ HK.block(o,a,y-H*.09,b-a,H*.09,c); for(let i=0;i<3;i++) HK.rect(o,a+(b-a)*(.1+i*.3),y-H*.075,(b-a)*.2,H*.025,'#1e2e4a'); } if(s===2){ for(const px of [a,b]) HK.line(o,[px,y,px+(px===a?W*.015:-W*.015),y-H*.22],'#c0c8cc',1.6); HK.rect(o,a+W*.012,y-H*.225,b-a-W*.024,H*.008,c); } }],
    ['flags',(o,s,c)=>{ if(!s) return; const x=HK.at(o,.62), top=o.dockY-H*.22; HK.rect(o,x,top,1.6,H*.22,'#c0c8cc'); if(s===1){ HK.line(o,[x,top,HK.at(o,.05),o.dockY-H*.04],'#c8a878',.8); for(let i=1;i<6;i++){ const u=i/6; HK.poly(o,[x+(HK.at(o,.05)-x)*u,top+(H*.18)*u,x+(HK.at(o,.05)-x)*u-W*.006,top+(H*.18)*u+H*.004,x+(HK.at(o,.05)-x)*u,top+(H*.18)*u+H*.012],['#c8382e','#e8c03a','#2a5aa8'][i%3]); } } if(s===2){ HK.poly(o,[x,top,x+W*.03,top+H*.01,x,top+H*.02],c); HK.ell(o,x+W*.012,top+H*.01,W*.006,H*.003,'#2a5aa8'); } if(s===3) HK.poly(o,[x,top,x+W*.022,top+H*.008,x,top+H*.016],c); }],
    ['seat'],
    ['light',(o,s)=>HK.light(o,['brass','mast','flood'][s],s===1?HK.at(o,.62):undefined)]] });

/* 10. Amazon Rainforest: the stilt house */
hfMake('amazon',{ name:'River stilt house', hname:'stilt house',
  colors:C16('Hardwood=#7a5a3e;Dark hardwood=#4a3420;Vine=#5a6a2a;Palm thatch=#c8a85a;Dry thatch=#a8843a;River clay=#a8683a;Jungle green=#2e6a32;Deep jungle=#123a18;Fern=#6aa04a;Leaf highlight=#a8e07a;Tannin water=#3a5a32;Macaw red=#d8302a;Macaw blue=#2a6ad8;Macaw yellow=#f0c83a;Orchid pink=#e070b0;Mist=#e8f4e0'),
  els:[{id:'stilts',label:'Stilts',styles:['Hardwood stilts','Mangrove roots','Bamboo bundles'],def:[0,1]},{id:'floor',label:'Floor',styles:['Lashed planks','Split bamboo','Reed mat'],def:[0,0]},
       {id:'roof',label:'Roof',none:true,styles:['Open sky','Maloca roof','Giant leaf','Palm fronds'],def:[1,3]},{id:'canoe',label:'River gear',none:true,styles:['No gear','Dugout canoe','Paddle and trap','Hanging net'],def:[1,1]},
       {id:'lamp',label:'Lamp',light:true,styles:['Gourd lamp','Firefly basket','Bamboo torch'],def:[0,13]}],
  seat:['hammock','wovenstool','logseat'], seatNames:['Hammock','Woven stool','Carved log seat'], seatDef:[0,11],
  order:[
    ['stilts',(o,s,c)=>HK.supports(o,c,['stilts','mangrove','bamboo'][s],5)],
    ['floor',(o,s,c)=>HK.deck(o,c,['planks','bamboo','mat'][s])],
    ['canoe',(o,s,c)=>{ const x=HK.at(o,.3), y=o.dockY; if(s===1){ o.x.fillStyle=HK.n(o,c); o.x.beginPath(); o.x.moveTo(x,o.wl-H*.004); o.x.quadraticCurveTo(x+W*.04,o.wl+H*.016,x+W*.08,o.wl-H*.004); o.x.lineTo(x,o.wl-H*.004); o.x.fill(); o.posts.push({x:x+W*.08,w:W*.01}); } if(s===2){ HK.line(o,[HK.at(o,.42),y,HK.at(o,.46),y-H*.1],c,2); HK.ell(o,HK.at(o,.46),y-H*.1,W*.003,H*.012,c); HK.ell(o,HK.at(o,.5),y-H*.012,W*.008,H*.012,'#a8843a'); } if(s===3){ HK.rect(o,HK.at(o,.44),y-H*.13,2,H*.13,'#4a3420'); o.x.fillStyle=v3rgba(c,.5); o.x.beginPath(); o.x.moveTo(HK.at(o,.44),y-H*.13); o.x.lineTo(HK.at(o,.38),y-H*.04); o.x.lineTo(HK.at(o,.44),y-H*.05); o.x.fill(); } }],
    ['roof',(o,s,c)=>{ if(s===1) HK.roof(o,c,'maloca',.02,.44); if(s===2) HK.roof(o,c,'leaf',.02,.46); if(s===3) HK.roof(o,c,'fronds',.02,.44); }],
    ['seat'],
    ['lamp',(o,s)=>HK.light(o,['gourd','fireflybasket','torch'][s])]] });

/* 11. Midnight Deep: the trawler deck (floats) */
hfMake('deep',{ name:'Trawler deck', hname:'trawler', floats:true,
  colors:C16('Steel grey=#6a7480;Dark steel=#3a424c;Gunmetal=#2a2e34;Rust=#8a4a2a;Rust light=#b8683a;Safety orange=#f0782a;Float orange=#e85a2a;Oilskin yellow=#d8b030;Floodlight=#f4eccc;Net green=#4a6a5a;Deck black=#1a1c20;Sea grey=#6a8290;Deep sea=#0a1826;Foam white=#e8ecf0;Bruised amber=#c8704a;Cold rim=#8aa0d8'),
  els:[{id:'hull',label:'Hull',styles:['Steel deck','Rusty trawler','Wood on steel'],def:[0,0]},{id:'house',label:'Wheelhouse',styles:['Boxy wheelhouse','Low pilothouse','Open helm'],def:[0,13]},
       {id:'gear',label:'Trawl gear',styles:['Net drum','A-frame gantry','Crab pots'],def:[0,9]},{id:'mast',label:'Mast',none:true,styles:['No mast','Mast and boom','Radar mast','Antenna mast'],def:[1,1]},
       {id:'light',label:'Floodlight',light:true,styles:['Floodlight','Caged lamp','Swinging lantern'],def:[0,8]}],
  seat:['floatcrate','steelbench','ropecoil'], seatNames:['Crate of floats','Steel bench','Rope coil'], seatDef:[0,9],
  order:[
    ['hull',(o,s,c)=>HK.hull(o,c,['steel','rusty','woodsteel'][s])],
    ['gear',(o,s,c)=>{ const x=HK.at(o,.08), y=o.dockY; if(s===0){ HK.rect(o,x,y-H*.035,W*.03,H*.035,'#3a424c'); HK.ell(o,x+W*.015,y-H*.035,W*.015,H*.02,c); for(let i=0;i<4;i++) HK.line(o,[x+W*.004,y-H*.05+i*H*.008,x+W*.026,y-H*.05+i*H*.008],HK.dk(c,.3)); } if(s===1){ HK.line(o,[x,y,x+W*.02,y-H*.16,x+W*.04,y],c,2.4); HK.line(o,[x+W*.02,y-H*.16,x+W*.02,y-H*.08],'#2a2e34',1); } if(s===2) for(let i=0;i<3;i++) for(let j=0;j<2;j++){ HK.block(o,x+j*W*.018,y-H*.02*(i+1),W*.016,H*.019,HK.dk(c,.05*i)); HK.line(o,[x+j*W*.018,y-H*.02*(i+.5),x+j*W*.018+W*.016,y-H*.02*(i+.5)],'#2a2e34'); } }],
    ['house',(o,s,c)=>{ const a=HK.at(o,.5), b=HK.at(o,.86), y=o.dockY; if(s===0){ HK.block(o,a,y-H*.12,b-a,H*.12,c); for(let i=0;i<3;i++) HK.rect(o,a+(b-a)*(.1+i*.3),y-H*.105,(b-a)*.2,H*.03,'#2a2e34'); HK.rect(o,a-W*.004,y-H*.125,b-a+W*.008,H*.008,'#3a424c'); } if(s===1){ HK.poly(o,[a,y,a,y-H*.07,b-W*.01,y-H*.07,b,y-H*.04,b,y],c); HK.rect(o,a+W*.01,y-H*.06,(b-a)*.6,H*.02,'#2a2e34'); } if(s===2){ HK.rect(o,b-W*.01,y-H*.04,2,H*.04,'#3a424c'); HK.circ(o,b-W*.01,y-H*.045,H*.01,'#3a424c'); HK.rect(o,b-W*.02,y-H*.07,W*.004,H*.03,v3rgba('#c0c8cc',.6)); } }],
    ['mast',(o,s,c)=>{ if(!s) return; const x=HK.at(o,.42), top=o.dockY-H*.23; HK.rect(o,x,top,2.4,H*.23,c); if(s===1) HK.line(o,[x,top+H*.04,HK.at(o,.05),o.dockY-H*.06],c,1.6); if(s===2){ HK.rect(o,x-W*.012,top,W*.024,H*.004,c); HK.ell(o,x,top-H*.012,W*.006,H*.01,'#c0c8cc'); } if(s===3) HK.line(o,[x+1,top,x+1,top-H*.06],c,1); }],
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
