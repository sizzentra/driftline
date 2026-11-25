// =====================================================================
// Every water's home: ONE fixed building, platform and seat per water (homes are fixed since 2026-11-24; the options were removed on
// 2026-11-25). Each home's look is a list of its parts, each part's style and colour (look), drawn by the kit (cw_homekit.js) and the
// building's own file (src/cw_<building>.js); its seat is one kind (seat) and one part carries its light (light).
// =====================================================================
function hfMake(id,d){ d.seatH=HK.seatH(d.seat);
  d.paint=function(o){ o.lights=[]; const col=e=>hfColor(id,e);
    for(const [e,fn] of d.order){ o.elCol=col(e); /* lights read their part's colour (a stove's body) */ const r=e==='seat'?HK.seat(o,d.seat,col('seat')):fn(o,hfStyle(id,e),col(e),col); if(r&&r.x!=null) o.lights.push(r); } };
  HOMEF[id]=d; }
/* 1. Willow Pond: the boathouse (overnight, 2026-11-23; its own design, src/cw_pondhouse.js): a gable-end boathouse over the water with its
   boat bay at the waterline, a cupola on the ridge and a lean-to porch along its side; a pine bank behind it, round piles under the deck */
{   const G1=()=>PH.geo({pw:HF.pw(),dockY:HF.dockY()}), LT=()=>{ const g=G1(); return {x0:g.xb,x1:g.x1,vx:g.xb,wallTop:g.lt,winA:g.xb+W*.014,winB:g.x1-W*.03}; };
  hfMake('pond',{ name:'Boathouse', hname:'boathouse', glow:'255,210,140', seatX:()=>HF.pw()-W*.028, front:null, smoke:null,
    look:{walls:[0,'#a8483a'],roof:[1,'#8a6a4a'],cupola:[0,'#f4efe6'],bay:[0,'#f4efe6'],windows:[0,'#f4efe6'],light:[0,'#e8b04a'],seat:[0,'#b98a5a']}, light:'light',
    seat:'deckchair',
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
    front:null, smoke:(n,t)=>BH.smoke(n,t,MH.chimTop(G2(),['stone','brick','pipe'][hfStyle('river','chimney')]),hfStyle('river','chimney')===2?.7:1),
    look:{walls:[0,'#bab2a2'],roof:[0,'#5a6470'],dormer:[0,'#7a5a3e'],chimney:[0,'#8a8478'],door:[2,'#7a5a3e'],windows:[1,'#4a3626'],seat:[0,'#7a5a3e']}, light:'windows',
    seat:'gardenbench',
    order:[
      ['base',(o)=>{ MH.ground(o); BH.piles(o,'stone','#8a8478'); }],
      ['chimney',(o,s,c)=>MH.chimney(o,G2(),['stone','brick','pipe'][s],c)],
      ['walls',(o,s,c)=>{ const K=['stone','stone','plaster'][s]; MH.walls(o,MH.geo(o),K,s===1?mix('#f6f2ea',c,.1):c); }],
      ['door',(o,s,c)=>BH.door(o,LW(),['plank','dutch','arched'][s],c)],
      ['windows',(o,s,c)=>BH.windows(o,LW(),['four','arched','shutters'][s],c)],
      ['roof',(o,s,c)=>MH.roof(o,MH.geo(o),['tiles','shakes','thatch'][s],c)],
      ['dormer',(o,s,c)=>{ const g=MH.geo(o), ws=hfStyle('river','walls'); MH.dormer(o,g,s,c,['stone','stone','plaster'][ws],ws===1?mix('#f6f2ea',hfColor('river','walls'),.1):hfColor('river','walls'),null,hfColor('river','roof')); HK.deck(o,'#7a5a3e','boards'); }],
      ['seat']] }); }
/* 3. Maplewood Hollow (was Cherry Blossom Lake until 2026-11-25): the treehouse draws itself, src/w_maple.js (its tea house, cw_teahouse.js, is gone) */
/* 4. Saltmarsh Coast: the lobster shack (overnight, 2026-11-23; its own design, src/cw_saltshack.js): a tall saltbox shack at the end of a long
   weathered pier, seen from its gable end, with a stovepipe; buoys on its wall, lobster pots or a drying net; the pier's tarred pilings with
   bracing, barnacles and weed, a ladder with a dory tied to it and a gull on the mooring piling */
{ const G4=()=>SS.geo({pw:HF.pw(),dockY:HF.dockY()}), WN=()=>{ const g=G4(); return {x0:g.x0,x1:g.x1,vx:g.vx,wallTop:g.wallTop,winA:g.x0+g.w*.36,winB:g.x0+g.w*.6}; };
  hfMake('coast',{ name:'Lobster shack', hname:'lobster shack', glow:'255,210,150', seatX:()=>HF.pw()-W*.03,
  front:null, smoke:null,
  look:{siding:[0,'#8a8a84'],roof:[0,'#2e2a28'],door:[0,'#c8483a'],windows:[0,'#f4f0e6'],tackle:[0,'#c8483a'],light:[0,'#6a5440'],seat:[0,'#a8a090']}, light:'windows',
  seat:'crate',
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
  front:null, smoke:(n,t)=>BH.smoke(n,t,FS.chimTop(G5(),hfStyle('frost','chimney')),.8),
  look:{walls:[0,'#b8383a'],roof:[0,'#2a2a30'],chimney:[0,'#2a2a30'],door:[0,'#4a3428'],windows:[0,'#f0e6d0'],gear:[0,'#b8383a'],seat:[0,'#2a2a30']}, light:'windows',
  seat:'bucket',
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
  /* the log cabin (director, 2026-11-22 night: "customise aspects of a log cabin"): a wide log lodge seen from its long side at the back of a
     log deck on a granite ledge. Its walls, roof, chimney, porch, door and windows are the choices, each one real-life option for that part
     in the colours real ones come in (director, 2026-11-23: door and windows are two parts; "tin" any colour; a real sod roof) */
  look:{walls:[0,'#9a6a42'],roof:[0,'#5a5650'],chimney:[0,'#9a948a'],porch:[1,'#7a5a3e'],door:[0,'#b8322a'],windows:[0,'#4a3426'],seat:[0,'#b8322a']}, light:'windows',
  seat:'muskoka',
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
  front:null, smoke:null,
  look:{walls:[0,'#c8b088'],thatch:[0,'#d8b46a'],door:[0,'#ff7a6a'],windows:[0,'#18b0c0'],gear:[1,'#ff7a6a'],torch:[0,'#c86ad8'],seat:[0,'#18b0c0']}, light:'torch',
  seat:'beachchair',
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
  front:null, smoke:null,
  look:{hull:[0,'#f4f6f4'],top:[1,'#ece4d0'],console:[0,'#f4f6f4'],gear:[0,'#d8483a'],light:[0,'#3a8a5a'],seat:[0,'#1e3a5a']}, light:'light',
  seat:'captain',
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
  look:{hull:[0,'#f2f2ee'],bridge:[0,'#f2f2ee'],rig:[0,'#c0c8cc'],flags:[1,'#c8382e'],light:[1,'#ffe0a8'] /* the light up on the tower, not a lamp post on the deck (2026-11-25) */,seat:[0,'#a8743a']}, light:'light',
  seat:'fighting',
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
  look:{walls:[0,'#7a5a3e'],thatch:[0,'#c8a85a'],door:[0,'#a8843a'],canoe:[1,'#4a3420'],lamp:[0,'#f0c83a'],seat:[0,'#d8302a']}, light:'lamp',
  seat:'hammock',
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
  look:{hull:[0,'#6a7480'],house:[0,'#e8ecf0'],gear:[0,'#4a6a5a'],mast:[1,'#3a424c'],light:[0,'#f4eccc'],seat:[0,'#4a6a5a']}, light:'light',
  seat:'floatcrate',
  order:[
    ['hull',(o,s,c)=>MT.hull(o,s,c)],
    ['house',(o,s,c)=>MT.house(o,s,c)],
    ['mast',(o,s,c)=>MT.mast(o,s,c)],
    ['gear',(o,s,c)=>MT.gear(o,s,c)],
    ['seat'],
    ['light',(o,s)=>HK.light(o,['floodpole','workcage','hook'][s])]] });

/* 12. Hollow Trench: the castaway raft (overnight, 2026-11-23; its own design, src/cw_castaway.js; floats): barrels and salvaged planks lashed with
   rope, glowing growth below; the shelter an upturned lifeboat on props, a sailcloth tent over an oar, or a plank shack with a porthole */
hfMake('trench',{ name:'Castaway raft', hname:'raft', floats:true, glow:'255,180,90', seatX:()=>HF.pw()-W*.03, front:null, smoke:null,
  look:{raft:[0,'#4a3a2a'],mast:[0,'#c8bca0'],salvage:[0,'#a8884a'],cabin:[0,'#4a3a2a'],light:[0,'#f0b050'],seat:[0,'#4a3a2a']}, light:'light',
  seat:'barrel',
  order:[
    ['raft',(o,s,c)=>TR.raft(o,s,c)],
    ['cabin',(o,s,c)=>TR.shelter(o,s,c)],
    ['mast',(o,s,c)=>{ const x=HK.at(o,.5), top=o.dockY-H*.2; HK.rect(o,x,top,2.4,H*.2,'#3a3028'); if(s===0) HK.poly(o,[x+2,top+H*.01,x+W*.035,top+H*.03,x+W*.03,top+H*.1,x+2,top+H*.12],c); if(s===1) HK.poly(o,[x-W*.008,top,x+W*.01,top,x+W*.008,top+H*.02,x-W*.006,top+H*.02],c); if(s===2) HK.poly(o,[x+2,top,x+W*.02,top+H*.006,x+W*.016,top+H*.03,x+2,top+H*.024],c); }],
    ['salvage',(o,s,c)=>{ const x=HK.at(o,.78), y=o.dockY; if(s===0){ HK.block(o,x,y-H*.024,W*.026,H*.024,'#4a3a2a'); HK.rect(o,x,y-H*.016,W*.026,1.6,c); } if(s===1){ HK.line(o,[x+W*.01,y,x+W*.01,y-H*.04],c,2.4); HK.curve(o,x,y-H*.012,x+W*.01,y+H*.004,x+W*.02,y-H*.012,c,2.4); HK.rect(o,x+W*.004,y-H*.036,W*.012,2,c); } if(s===2){ o.x.strokeStyle=HK.n(o,c); o.x.lineWidth=2; o.x.beginPath(); o.x.arc(x+W*.012,y-H*.03,H*.022,0,7); o.x.stroke(); for(let k=0;k<8;k++){ const a=k*Math.PI/4; HK.line(o,[x+W*.012,y-H*.03,x+W*.012+Math.cos(a)*H*.03,y-H*.03+Math.sin(a)*H*.03],c,1.4); } } }],
    ['seat'],
    ['light',(o,s)=>HK.light(o,['hook','jellyjar','wreck'][s])]] });

/* 13. Ember Springs: the basalt bathhouse (overnight, 2026-11-23; its own design, src/cw_bathhouse.js): a low basalt bathhouse on hexagonal basalt
   columns with a curved iron barrel-vault roof, round glowing windows and a steam vent; the steaming pool beside it. The old base, floor and roof
   choices became this one building; the pool and lantern keep their ids */
{ const G13=()=>EB.geo({pw:HF.pw(),dockY:HF.dockY()});
hfMake('ember',{ name:'Basalt bathhouse', hname:'bathhouse', glow:'255,150,80', seatX:()=>HF.pw()-W*.03, front:null, smoke:(n,t)=>BH.smoke(n,t,EB.ventTop(G13()),.9),
  look:{walls:[0,'#4a3a3a'],vault:[0,'#3a3436'],door:[0,'#5a4a44'],pool:[0,'#7ad8d0'],light:[0,'#ff7a2a'],seat:[0,'#7a6e6a']}, light:'light',
  seat:'steelbench',
  order:[
    ['base',(o)=>EB.ground(o)],
    ['deck',(o)=>HK.deck(o,'#4a3a3a','stone')],
    ['walls',(o,s,c)=>EB.walls(o,EB.geo(o),s,c)],
    ['door',(o,s,c)=>BH.door(o,EB.geo(o),['plank','dutch','arched'][s],c)],
    ['vault',(o,s,c)=>EB.roof(o,EB.geo(o),s,c)],
    ['pool',(o,s,c)=>EB.pool(o,EB.geo(o),s,c)],
    ['seat'],
    ['light',(o,s)=>HK.light(o,['chain','lavabowl','steam'][s])]] }); }

/* 14. Starfall Lake: the star observatory (overnight, 2026-11-23; its own design, src/cw_observatory.js; floats): a round moonstone observatory with a
   crystal, silver or star-blossom dome and a gold star finial, a moon-shaped door, on a floating rock island with crystals hanging beneath. The old
   platform, underglow and arch choices became this one building; telescope and star lantern keep their ids */
hfMake('starfall',{ name:'Star observatory', hname:'observatory', floats:true, glow:'220,200,255', seatX:()=>HF.pw()-W*.03, front:null, smoke:null,
  look:{walls:[0,'#e8e0f4'],dome:[0,'#b88aff'],door:[0,'#6a5ab0'],scope:[1,'#f0d080'],light:[0,'#fff8ff'],seat:[0,'#e8e0f4']}, light:'light',
  seat:'crescent',
  order:[
    ['base',(o)=>{ SO.ground(o); HK.deck(o,'#e8e0f4','moonstone'); }],
    ['walls',(o,s,c)=>SO.walls(o,SO.geo(o),s,c)],
    ['door',(o,s,c)=>SO.door(o,SO.geo(o),s,c)],
    ['dome',(o,s,c)=>SO.dome(o,SO.geo(o),s,c)],
    ['scope',(o,s,c)=>{ if(!s) return; const x=HK.at(o,.42), y=o.dockY; if(s===1){ HK.line(o,[x,y,x+W*.008,y-H*.04,x+W*.016,y],'#5a4030',1.2); HK.line(o,[x+W*.002,y-H*.042,x+W*.022,y-H*.062],c,3); } if(s===2){ HK.rect(o,x+W*.006,y-H*.03,2,H*.03,c); o.x.strokeStyle=HK.n(o,c); o.x.lineWidth=1.4; o.x.beginPath(); o.x.arc(x+W*.007,y-H*.045,H*.014,0,7); o.x.stroke(); HK.line(o,[x-W*.004,y-H*.045,x+W*.018,y-H*.045],c,1); } if(s===3){ HK.line(o,[x,y,x+W*.01,y-H*.06,x+W*.02,y],'#5a4030',1.2); HK.rect(o,x+W*.002,y-H*.07,W*.018,H*.03,'#2a1a5a'); for(let i=0;i<5;i++) HK.circ(o,x+W*(.005+i*.003),y-H*(.065-(i%2)*.012),1,c); } }],
    ['seat'],
    ['light',(o,s)=>HK.light(o,['star','moon','wisps'][s])]] });

/* 15. Animal Farm: the red barn (overnight, 2026-11-23; its own design, src/cw_barn.js): a red barn seen from its gable end with a gambrel roof,
   white trim, a hayloft with a hoist and big white X-braced doors; a grassy bank with a hay stack and sunflowers; the dock on fence posts. The old
   deck, footing and roof choices became this one building; the fence and lantern keep their ids */
hfMake('farm',{ name:'Red barn', hname:'barn', glow:'255,205,130', seatX:()=>HF.pw()-W*.03, front:null, smoke:null,
  look:{walls:[0,'#b8322a'],gambrel:[0,'#7a2a22'],loft:[0,'#7a2a22'],doors:[0,'#b8322a'],fence:[1,'#f4f0e6'],light:[0,'#f0c83a'],seat:[0,'#e0c060']}, light:'light',
  seat:'haybale',
  order:[
    ['base',(o)=>{ AB.ground(o); HK.supports(o,'#9a948a','fence',5); HK.deck(o,'#8a6a4a','boards'); }],
    ['walls',(o,s,c)=>AB.walls(o,AB.geo(o),s,c)],
    ['doors',(o,s,c)=>AB.doors(o,AB.geo(o),s,c)],
    ['loft',(o,s,c)=>AB.loft(o,AB.geo(o),s,c)],
    ['gambrel',(o,s,c)=>AB.roof(o,AB.geo(o),s,c)],
    ['fence',(o,s,c)=>{ if(s) HK.rail(o,c,['','picket','postrail','wheel'][s]); }],
    ['seat'],
    ['light',(o,s)=>HK.light(o,['nail','bulbs','milkcan'][s])]] });

/* 16. The Buffet: the gingerbread house (overnight, 2026-11-23; its own design, src/cw_ginger.js): a gingerbread house seen from its gable end with a
   steep roof under dripping icing and gumdrops, candy-cane corners, icing piping, a peppermint window; a giant fork in the soup with a cherry, a dollop
   of cream on the platter. The old platter, posts and roof choices became this one building; trim and candle keep their ids */
hfMake('buffet',{ name:'Gingerbread house', hname:'gingerbread house', glow:'255,200,130', seatX:()=>HF.pw()-W*.03, front:null, smoke:null,
  look:{walls:[0,'#b8743a'],iroof:[0,'#7a4a22'],door:[0,'#5a3420'],windows:[0,'#7a8ad8'],trim:[1,'#fff6ee'],light:[0,'#ffd060'],seat:[0,'#f4a0b0']}, light:'light',
  seat:'cupcake',
  order:[
    ['base',(o)=>{ GB.ground(o); HK.supports(o,'#e8c890','wafer',5); HK.deck(o,'#c8c8d0','platter'); }],
    ['walls',(o,s,c)=>GB.walls(o,GB.geo(o),s,c)],
    ['door',(o,s,c)=>GB.door(o,GB.geo(o),s,c)],
    ['windows',(o,s,c)=>GB.windows(o,GB.geo(o),s,c)],
    ['iroof',(o,s,c)=>GB.roof(o,GB.geo(o),s,c)],
    ['trim',(o,s,c)=>{ if(s) HK.rail(o,c,['','icing','licorice','breadstick'][s]); }],
    ['seat'],
    ['light',(o,s)=>HK.light(o,['dripcandle','cupcake','jellymould'][s])]] });

/* 17. Corporate Pond: the glass pavilion (overnight, 2026-11-23; its own design, src/cw_officebox.js): a modernist glass office on steel columns
   with a thin cantilevered roof slab and a logo, the office visible inside; a concrete planter and a coffee cup on the deck. The old floor,
   supports and awning choices became this one building; the partition and lamp keep their ids */
hfMake('corporate',{ name:'Glass pavilion', hname:'glass pavilion', glow:'230,240,255', seatX:()=>HF.pw()-W*.03, front:null, smoke:null,
  look:{glass:[0,'#9ad0e0'],slab:[0,'#a8b0b8'],inside:[0,'#9ad0e0'],partition:[1,'#9ad0e0'],light:[0,'#f4f6f8'],seat:[0,'#1e2e4a']}, light:'light',
  seat:'swivel',
  order:[
    ['base',(o)=>{ CO.ground(o); HK.deck(o,'#c8c8c4','concrete'); }],
    ['glass',(o,s,c)=>CO.walls(o,CO.geo(o),s,c)],
    ['inside',(o,s,c)=>CO.inside(o,CO.geo(o),s,c)],
    ['slab',(o,s,c)=>CO.roof(o,CO.geo(o),s,c)],
    ['partition',(o,s,c)=>{ if(s) HK.rail(o,c,['','glass','cubicle','velvet'][s]); }],
    ['seat'],
    ['light',(o,s)=>HK.light(o,['desk','floor','sign'][s])]] });

/* 18. The Nile: the reed boat (floats; its own drawing overnight 2026-11-23, src/cw_reedboat.js: a papyrus crescent hull with high ends and flower heads, lashings, a steering oar, a lotus-column cabin) */
hfMake('nile',{ name:'Reed boat', hname:'reed boat', floats:true, seatX:()=>HF.pw()-W*.03, front:null, smoke:null,
  look:{hull:[0,'#c8b060'],sail:[0,'#f0e8d4'],cabin:[1,'#f0e8d4'],cargo:[1,'#c8803a'],light:[0,'#f0a8b8'],seat:[0,'#7a5a3a']}, light:'light',
  seat:'lionstool',
  order:[
    ['hull',(o,s,c)=>NB.hull(o,s,c)], /* its own drawing (overnight 2026-11-23, src/cw_reedboat.js) */
    ['sail',(o,s,c)=>{ const x=HK.at(o,.6), y=o.dockY, top=y-H*.24; HK.rect(o,x,top,2.4,H*.24,'#7a5a3a'); if(s===0){ HK.line(o,[x-W*.04,y-H*.04,x+W*.02,top-H*.02],'#7a5a3a',1.6); HK.poly(o,[x-W*.036,y-H*.05,x+W*.018,top-H*.012,x+W*.03,y-H*.05],c); } else { HK.rect(o,x-W*.03,top+H*.02,W*.06,2,'#7a5a3a'); HK.poly(o,[x-W*.03,top+H*.022,x+W*.03,top+H*.022,x+W*.026,y-H*.06,x-W*.026,y-H*.06],c); if(s===2){ HK.ell(o,x,top+H*.09,W*.01,H*.008,'#f4f0e6'); HK.circ(o,x,top+H*.09,H*.006,'#2a4a9a'); HK.line(o,[x-W*.012,top+H*.09,x-W*.016,top+H*.1],'#2a2428',1.4); } } }],
    ['cabin',(o,s,c)=>NB.cabin(o,s,c)],
    ['cargo',(o,s,c)=>{ if(!s) return; const x=HK.at(o,.78), y=o.dockY; if(s===1) for(let i=0;i<2;i++){ HK.ell(o,x+i*W*.012,y-H*.016,W*.005,H*.016,c); HK.rect(o,x+i*W*.012-W*.002,y-H*.036,W*.004,H*.006,c); } if(s===2) for(let i=0;i<2;i++){ HK.poly(o,[x+i*W*.014,y,x+i*W*.014+W*.012,y,x+i*W*.014+W*.014,y-H*.018,x+i*W*.014-W*.002,y-H*.018],c); HK.ell(o,x+i*W*.014+W*.006,y-H*.02,W*.006,H*.004,'#c0c8cc'); } if(s===3){ HK.block(o,x,y-H*.022,W*.024,H*.022,'#7a5a3a'); HK.rect(o,x+W*.004,y-H*.03,W*.016,H*.008,c); } }],
    ['seat'],
    ['light',(o,s)=>HK.light(o,['lotus','brazier','sundisclamp'][s])]] });

/* 19. Circuit Lake: the capsule pod (overnight, 2026-11-23; its own design, src/cw_capsule.js; hovers above the water): a pill-shaped capsule
   home with a glowing round window (or a noodle stall, or an arcade booth), a neon sign on the roof, an antenna and a vending machine beside it.
   Pad, thrusters, trim and light keep their ids; the canopy id is retired */
hfMake('circuit',{ name:'Capsule pod', hname:'capsule pod', glow:'255,120,220', seatX:()=>HF.pw()-W*.03, front:null, smoke:null,
  look:{pod:[0,'#c8ccd8'],sign:[0,'#ff4ab8'],pad:[0,'#c8ccd8'],thrust:[0,'#3ae8ff'],trim:[1,'#ff4ab8'],light:[0,'#ff4ab8'],seat:[0,'#1a1c22']}, light:'light',
  seat:'gaming',
  order:[
    ['thrust',(o,s,c)=>HK.supports(o,c,['rings','jets','coils'][s],4)],
    ['pad',(o,s,c)=>HK.deck(o,c,['chrome','carbon','glass'][s])],
    ['trim',(o,s,c)=>{ if(s) HK.rail(o,c,['','neon','holo','cable'][s]); }],
    ['pod',(o,s,c)=>CP.pod(o,s,c)],
    ['sign',(o,s,c)=>CP.sign(o,s,c)],
    ['seat'],
    ['light',(o,s)=>HK.light(o,['neontube','hologram','orb'][s])]] });

/* 20. Mount Olympus: the temple (overnight, 2026-11-23; its own design, src/cw_temple.js): a small marble temple on a stepped base over the
   cloud-water, four columns (Doric, Ionic, Corinthian), a frieze and pediment with gold acroteria, a god's statue inside, clouds around the
   posts. The old floor, columns and roof ids are retired; balustrade and brazier keep theirs */
hfMake('olympus',{ name:'Marble temple', hname:'temple', glow:'255,220,140', seatX:()=>HF.pw()-W*.03, front:null, smoke:null,
  look:{colorder:[0,'#f0ecf4'],pediment:[0,'#d8a830'],statue:[0,'#f0ecf4'],balustrade:[0,'#f0ecf4'],light:[0,'#d8a830'],seat:[0,'#f0ecf4']}, light:'light',
  seat:'marblethrone',
  order:[
    ['base',(o)=>{ HK.supports(o,'#e8e4f0','column',5); HK.deck(o,'#f0ecf4','marble'); TP.clouds(o); TP.base(o,TP.geo(o)); }],
    ['statue',(o,s,c)=>TP.statue(o,TP.geo(o),s,c)],
    ['colorder',(o,s,c)=>TP.columns(o,TP.geo(o),s,c)],
    ['pediment',(o,s,c)=>TP.pediment(o,TP.geo(o),s,c)],
    ['balustrade',(o,s,c)=>{ if(s) HK.rail(o,c,['','balustrade','garland','gold'][s]); }],
    ['seat'],
    ['light',(o,s)=>HK.light(o,['goldbrazier','lightning','laurel'][s])]] });
