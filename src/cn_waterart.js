// =====================================================================
// 0.4.9 [3]-[7] [69] scenes for the ten new waters (data in cm_waters.js). Each water: a palette for day, dusk and night, still land
// (cached like every other water), a live layer (kept light: a few dozen shapes a frame) and a foreground corner.
//  Cherry Blossom Lake: a distant Mount Fuji among lower ranges, cherry trees, a pagoda, stone lanterns, a torii, lilies; ducks, petals on the water (C33).
//  Canadian Rockies: peaks and Shield granite, pines and birches, a waterfall, beaver dam and lodge, cabin and flag; beavers, moose, geese, a canoe, starry nights (C34).
//  Florida Keys: low islands with palms and a long arched bridge over turquoise flats; pelicans diving, gulls.
//  Amazon Rainforest: a waterfall pouring off a jungle cliff; mist, parrots, fireflies at night, hanging vines.
//  Animal Farm: a red barn, silo, windmill, fences and hay; the windmill turns, birds cross.
//  The Buffet: mashed-potato mountains with gravy rivers, broccoli forests, a giant cake; steam and sprinkles.
//  Corporate Pond: glass towers with a stock ticker; window lights at night, the ticker scrolls.
//  The Nile: dunes, pyramids, a sphinx and palms; a felucca sails by, heat shimmer.
//  Circuit Lake: a neon skyline; flying cars, flickering signs, a hologram moon.
//  Mount Olympus: a marble temple on a peak above a sea of clouds; golden sparkles and the odd thunderbolt.
// =====================================================================
const WA_BASE={blossom:'pond', rockies:'pond', keys:'coast', amazon:'river', farm:'pond', buffet:'coast', corporate:'coast', nile:'reef', circuit:'starfall', olympus:'pond'};
const WA_PAL={
 blossom:{day:{top:'#7ab4e4',mid:'#bcdcf0',bot:'#ffe4ec',far:'#8a9ac8',farHaze:'#e8d8ea',snow:'#ffffff',hill:'#6a9a6a',back:'#4a7a5a',front:'#2e5240',bank:'#5a8a52',wTop:'#a8d4d8',wMid:'#5a9aa4',wBot:'#1e4a58',leaf:'#f4a8c4',leafHi:'#ffe4ee'},
   dusk:{top:'#2a2a64',mid:'#c06a94',bot:'#ffc4a0',far:'#8a6aa0',farHaze:'#f0a0b4',hill:'#5a4a7a',leaf:'#d08aa8',leafHi:'#ffc8d8',wTop:'#f0a8a8',wMid:'#7a5a8a'},
   night:{top:'#060a1e',mid:'#141c44',bot:'#2c3470',far:'#2a3260',farHaze:'#3c4680',hill:'#1c2444',leaf:'#4a3a5a',leafHi:'#8a7ab0',wTop:'#2a3670',wMid:'#141c44'}},
 rockies:{day:{top:'#3a86d8',mid:'#8cc4ec',bot:'#e8f4fa',far:'#7a8ca8',farHaze:'#c8dcec',snow:'#ffffff',hill:'#3e6450',back:'#2e5040',front:'#1e3a2e',bank:'#4a6a48',wTop:'#7ad8d8',wMid:'#2a9aa8',wBot:'#0a4858'},
   dusk:{top:'#1e2a5a',mid:'#a0608a',bot:'#ffb880',far:'#7a5a88',farHaze:'#e09090',hill:'#3a3460',wTop:'#e8988a',wMid:'#5a5a8a'},
   night:{top:'#040a1c',mid:'#0e1a3a',bot:'#1e2c60',far:'#1e2a50',farHaze:'#2e3c70',hill:'#121c34',wTop:'#1e3a68',wMid:'#0c1e3c'}},
 keys:{day:{top:'#2a9ce8',mid:'#7ad0f4',bot:'#e8faff',far:'#6ab08a',farHaze:'#c0ece4',hill:'#4a9a6a',sand:'#f4e6c0',sandD:'#d8c490',isl:'#3a8a5a',wTop:'#8af0e0',wMid:'#28c0c8',wBot:'#0a7090',trunk:'#8a6a4a',frond:'#3a9a4a',frondD:'#2a6a3a'},
   dusk:{top:'#2a2a6a',mid:'#e8608a',bot:'#ffc070',far:'#6a4a6a',farHaze:'#f09a8a',wTop:'#ffa888',wMid:'#a05a8a',frond:'#3a4a3a',frondD:'#2a2a2a'},
   night:{top:'#03081c',mid:'#0a1a40',bot:'#1a3070',far:'#142246',farHaze:'#283c74',wTop:'#1e4a78',wMid:'#0a2448',frond:'#0e1a20',frondD:'#0a1018',trunk:'#1a1a24'}},
 amazon:{day:{top:'#5a9ac0',mid:'#a8d0d8',bot:'#e8f4e0',far:'#4a7a5a',farHaze:'#a8c8b0',hill:'#2e6a32',back:'#1e5226',front:'#123a18',bank:'#3a6a2a',wTop:'#7a9a5a',wMid:'#3a5a32',wBot:'#142414',leaf:'#3a8a3a',leafHi:'#a8e07a'},
   dusk:{top:'#2a2a5a',mid:'#b06a6a',bot:'#ffb070',far:'#4a3a4a',farHaze:'#c08070',hill:'#2a3a2a',leaf:'#3a4a2a',wTop:'#c08060',wMid:'#4a3a3a'},
   night:{top:'#040a14',mid:'#0c1a24',bot:'#18303a',far:'#10201e',farHaze:'#1e3438',hill:'#0a1a10',leaf:'#10241a',leafHi:'#3a6a4a',wTop:'#1a3030',wMid:'#0a1a18'}},
 farm:{day:{top:'#5aa8e8',mid:'#a8d8f4',bot:'#fff4dc',far:'#8ab0a0',farHaze:'#d8e8dc',hill:'#6aaa4a',back:'#4a8a3a',front:'#3a6a2a',bank:'#6a9a4a',wTop:'#9ab88a',wMid:'#5a7a4a',wBot:'#2a3a22',leaf:'#6aaa4a',leafHi:'#d8f0a0',cabin:'#b8322a',roof:'#5a2a22'},
   dusk:{top:'#2a2a5a',mid:'#c06a7a',bot:'#ffc080',hill:'#4a4a3a',wTop:'#e09a7a',wMid:'#6a4a4a'},
   night:{top:'#050a1a',mid:'#101a3a',bot:'#24306a',hill:'#141e24',wTop:'#22305a',wMid:'#101a30'}},
 buffet:{day:{top:'#f8b878',mid:'#fcd8a8',bot:'#fff6e4',far:'#e8d8c0',farHaze:'#fff0dc',hill:'#f4ecd8',back:'#e8d8b8',front:'#c89858',bank:'#d8a860',wTop:'#e8b060',wMid:'#c07a30',wBot:'#7a3a10',cloud:'#fffaf0',cloudLit:'#ffffff',leaf:'#3a8a3a',leafHi:'#8ad06a'},
   dusk:{top:'#5a2a4a',mid:'#e07a6a',bot:'#ffd090',hill:'#e8c8a8',wTop:'#e09060',wMid:'#a05a30'},
   night:{top:'#1a0e1a',mid:'#3a1e2a',bot:'#5a3a3a',hill:'#4a3a32',wTop:'#5a3a22',wMid:'#3a2010',far:'#3a2a2a',farHaze:'#4a3a32'}},
 corporate:{day:{top:'#6a9ac8',mid:'#b8cce0',bot:'#eef2f6',far:'#8a9ab0',farHaze:'#d0dae4',hill:'#7a8a98',back:'#5a6a78',front:'#3a4652',bank:'#8a9a8a',wTop:'#9ab8cc',wMid:'#4a6a88',wBot:'#18283a'},
   dusk:{top:'#2a2a5a',mid:'#b06a8a',bot:'#ffb890',far:'#6a5a7a',farHaze:'#d8909a',wTop:'#e0989a',wMid:'#5a4a7a'},
   night:{top:'#060a18',mid:'#101830',bot:'#202c50',far:'#1a2236',farHaze:'#2a3450',wTop:'#1e2c50',wMid:'#0e1830'}},
 nile:{day:{top:'#4a9ad8',mid:'#a8d0e8',bot:'#fff0d4',far:'#d8b880',farHaze:'#f4e4c4',sand:'#e8c890',sandD:'#c8a060',isl:'#6a9a4a',wTop:'#5ab0b0',wMid:'#2a7a80',wBot:'#0a3a40',trunk:'#7a5a3a',frond:'#4a8a3a',frondD:'#2a5a2a'},
   dusk:{top:'#2a2050',mid:'#d0607a',bot:'#ffc070',far:'#b07a6a',farHaze:'#f0a080',sand:'#e0a070',wTop:'#e09a7a',wMid:'#7a4a6a'},
   night:{top:'#040818',mid:'#0e1838',bot:'#22306a',far:'#2a2a48',farHaze:'#3a3a5a',sand:'#4a4a60',sandD:'#2e2e42',wTop:'#1e3a5a',wMid:'#0a1e38',frond:'#0e1a18',frondD:'#0a100e',trunk:'#1a1a20'}},
 circuit:{day:{top:'#2a1050',mid:'#8a3a9a',bot:'#ff7ab8',far:'#2a1a4a',farHaze:'#6a3a8a',hill:'#1a1030',wTop:'#5a3a9a',wMid:'#1a1a4a',wBot:'#05051a',glow:'#ffd0f0'},
   dusk:{top:'#1a0838',mid:'#6a2a8a',bot:'#ff5aa0'},
   night:{top:'#05030f',mid:'#140a2a',bot:'#3a1a5a',far:'#100a20',farHaze:'#2a1440',wTop:'#2a1a5a',wMid:'#0a0a28'}},
 olympus:{day:{top:'#4a7ae0',mid:'#a0c0f4',bot:'#fff4dc',far:'#c8c8e0',farHaze:'#f0eef8',snow:'#ffffff',hill:'#e8e4f0',back:'#d8d4e4',front:'#b8b4c8',bank:'#c8c4d8',wTop:'#9ae0f0',wMid:'#4aa0d8',wBot:'#1a4a8a',cloud:'#ffffff'},
   dusk:{top:'#3a2a6a',mid:'#e07a9a',bot:'#ffd090',hill:'#e8c8d0',wTop:'#f0a8b0',wMid:'#8a6aa8'},
   night:{top:'#060a22',mid:'#141e4a',bot:'#2c3a7a',hill:'#4a4a6a',far:'#3a3a5a',farHaze:'#4a4a70',wTop:'#2a3a7a',wMid:'#141e4a'}},
};
// palettes: every field any water uses (so platforms and helpers always find a color), then the base water's look, then this water's
{ const ph=['day','dusk','night'], union={}; for(const p of ph){ union[p]={}; for(const id in V3PAL) Object.assign(union[p],V3PAL[id][p]||{}); }
  for(const id in WA_PAL){ const b=V3PAL[WA_BASE[id]]||V3PAL.pond, o={}; for(const p of ph) o[p]=Object.assign({},union[p],b[p]||{},WA_PAL[id].day,p==='day'?{}:WA_PAL[id][p]||{}); V3PAL[id]=o; } }
// ---------- small drawing kit ----------
const wa = {
  hills(x,hz,col,pts){ x.fillStyle=col; x.beginPath(); x.moveTo(0,hz+1); for(const [px,py] of pts) x.lineTo(W*px,hz-H*py); x.lineTo(W,hz+1); x.closePath(); x.fill(); },
  blob(x,hz,col,amp,seed,n){ const r=v3rng(seed); x.fillStyle=col; x.beginPath(); x.moveTo(0,hz+1); for(let i=0;i<=n;i++){ x.lineTo(W*i/n,hz-H*amp*(.5+.5*r())); } x.lineTo(W,hz+1); x.closePath(); x.fill(); },
  rect(x,c,X,Y,w,h){ x.fillStyle=c; x.fillRect(X,Y,w,h); },
  petal(c,x,y,s,a,col){ c.save(); c.translate(x,y); c.rotate(a); c.fillStyle=col; c.beginPath(); c.ellipse(0,0,s,s*.55,0,0,7); c.fill(); c.restore(); },
};
// ---------- the scenes ----------
// ---------- C33 Cherry Blossom Lake, quality pass (Cam, 2026-11-20) ----------
// Mount Fuji further back and larger (hazier, a crater top, snow running down its gullies, a scarf of cloud) with lower ranges either side;
// cherry trees with real branching, blossom clouds on the branch ends, weeping cherries and petals fallen on the grass; a five-tier pagoda
// on a stone base and stone lanterns along the shore; the torii in the shallows; water lilies; ducks instead of the koi; petals resting
// and drifting on the lake; floating lanterns at night; now and then a gust carries a swirl of petals across.
function waCherry(c,x,base,h,P,seed,o={}){ const r=v3rng(seed), bark=mix('#3a2420',P.hill,.18), leaf=o.leaf||P.leaf, dk=mix(leaf,'#6a2a48',.42), lt=mix(leaf,'#ffffff',.45), tw=h*.045, lean=(r()-.5)*h*.14, fx=x+lean, fy=base-h*.42;
  c.fillStyle=bark; c.beginPath(); c.moveTo(x-tw,base); c.quadraticCurveTo(x-tw*.3+lean*.2,base-h*.24,fx-tw*.4,fy); c.lineTo(fx+tw*.4,fy); c.quadraticCurveTo(x+tw*.5+lean*.2,base-h*.22,x+tw*1.1,base); c.closePath(); c.fill();
  const tips=[], nb=4+(r()*3|0); c.strokeStyle=bark; c.lineCap='round';
  for(let i=0;i<nb;i++){ const a=-Math.PI/2+(i/(nb-1)-.5)*2.3+(r()-.5)*.3, L=h*(.3+r()*.14), ex=fx+Math.cos(a)*L*1.3, ey=fy+Math.sin(a)*L*.7, mx=fx+Math.cos(a)*L*.55, my=fy+Math.sin(a)*L*.5-h*.05, tx=mx+Math.cos(a-.7)*L*.4, ty=my+Math.sin(a-.7)*L*.35;
    c.lineWidth=Math.max(.8,tw*.75); c.beginPath(); c.moveTo(fx,fy); c.quadraticCurveTo(mx,my,ex,ey); c.stroke();
    c.lineWidth=Math.max(.5,tw*.35); c.beginPath(); c.moveTo(mx,my+h*.02); c.lineTo(tx,ty); c.stroke(); tips.push([ex,ey],[tx,ty]); }
  c.lineCap='butt';
  const B=[]; for(const [tx,ty] of tips) for(let k=0;k<5;k++) B.push([tx+(r()-.5)*h*.22,ty+(r()-.65)*h*.1,h*(.045+r()*.045)]);
  const pass=(col,dx,dy,k,f)=>{ c.fillStyle=col; c.beginPath(); for(const [bx,by,br] of B){ if(f&&!f(by)) continue; c.moveTo(bx+dx+br*k,by+dy); c.arc(bx+dx,by+dy,br*k,0,7); } c.fill(); };
  pass(dk,0,h*.018,1.08); pass(leaf,0,0,.94); pass(lt,-h*.012,-h*.022,.5,by=>by<fy-h*.12);
  if(o.weep){ c.strokeStyle=v3rgba(leaf,.85); c.lineWidth=Math.max(.6,h*.012); c.lineCap='round'; for(const [tx,ty] of tips) for(let k=0;k<3;k++){ const sx=tx+(k-1)*h*.045, L=h*(.16+r()*.16); c.beginPath(); c.moveTo(sx,ty); c.quadraticCurveTo(sx+h*.025,ty+L*.5,sx+h*.012,ty+L); c.stroke(); } c.lineCap='butt'; }
  c.fillStyle=v3rgba(lt,.75); for(let k=0;k<14;k++) c.fillRect(x+(r()-.5)*h*.8,base-h*.005+r()*h*.02,Math.max(1,h*.012),Math.max(.8,h*.007)); }
function waPagoda(c,x,base,s,P){ const T=(c0,k0)=>mix(mix(c0,P.farHaze,.15),'#141a38',k0), red=T('#c8402a',P.night*.62), wall=T('#f2e8d6',P.night*.68), roof=T('#34343e',P.night*.4), edge=mix(roof,'#ffffff',.28), stone=T('#a09a90',P.night*.65);
  c.fillStyle=stone; c.fillRect(x-s*5.2,base-s*1.1,s*10.4,s*1.1); c.fillStyle=mix(stone,'#000000',.22); c.fillRect(x-s*5.2,base-s*.35,s*10.4,s*.35);
  let y=base-s*1.1;
  for(let i=0;i<5;i++){ const w=s*(3.6-i*.48), hh=s*(2-i*.1);
    c.fillStyle=wall; c.fillRect(x-w,y-hh,w*2,hh); c.fillStyle=red; c.fillRect(x-w,y-hh,w*.22,hh); c.fillRect(x+w*.78,y-hh,w*.22,hh); c.fillRect(x-w,y-hh,w*2,hh*.16); c.fillRect(x-w*.18,y-hh*.84,w*.36,hh*.84);
    if(P.night>.3){ c.fillStyle=v3rgba('#ffc878',P.night*.8); c.fillRect(x-w*.12,y-hh*.7,w*.24,hh*.6); }
    const rw=w*1.8, ry=y-hh, rt=s*.85, eave=()=>{ c.moveTo(x-rw,ry-rt*1.25); c.quadraticCurveTo(x-rw*.5,ry+rt*.25,x,ry+rt*.15); c.quadraticCurveTo(x+rw*.5,ry+rt*.25,x+rw,ry-rt*1.25); };
    c.fillStyle=roof; c.beginPath(); eave(); c.quadraticCurveTo(x+rw*.55,ry-rt*.85,x+w*.6,ry-rt*1.8); c.lineTo(x-w*.6,ry-rt*1.8); c.quadraticCurveTo(x-rw*.55,ry-rt*.85,x-rw,ry-rt*1.25); c.closePath(); c.fill();
    c.strokeStyle=edge; c.lineWidth=Math.max(.6,s*.18); c.beginPath(); eave(); c.stroke();
    y=ry-rt*1.8; }
  c.fillStyle=T('#c8a040',P.night*.55); c.fillRect(x-s*.12,y-s*4.4,s*.24,s*4.4); for(let i=0;i<7;i++) c.fillRect(x-s*.45,y-s*1-i*s*.45,s*.9,s*.16); c.beginPath(); c.arc(x,y-s*4.5,s*.3,0,7); c.fill(); }
function waToro(c,x,base,s,P){ const st=mix(mix('#9a968c',P.hill,.2),'#141a38',P.night*.6), dk=mix(st,'#000000',.25); c.fillStyle=st; c.fillRect(x-s*.9,base-s*.5,s*1.8,s*.5); c.fillRect(x-s*.25,base-s*2.4,s*.5,s*1.9); c.fillRect(x-s*.8,base-s*2.8,s*1.6,s*.4);
  c.fillStyle=dk; c.fillRect(x-s*.6,base-s*3.8,s*1.2,s); c.fillStyle=P.night>.3?'rgba(255,200,120,.95)':mix(dk,'#000000',.3); c.fillRect(x-s*.3,base-s*3.6,s*.6,s*.6);
  c.fillStyle=st; c.beginPath(); c.moveTo(x-s*1.3,base-s*3.8); c.quadraticCurveTo(x,base-s*4.9,x+s*1.3,base-s*3.8); c.closePath(); c.fill(); c.fillRect(x-s*.15,base-s*5.1,s*.3,s*.5); }
function waLily(c,x,y,s,P,seed,flower){ const r=v3rng(seed), pad=mix('#4a8a3a',P.wMid,.3+P.night*.45), hi=mix(pad,'#d8f0a0',.3), a=r()*7;
  c.save(); c.translate(x,y); c.scale(1,.38); c.fillStyle=mix(pad,'#000000',.28); c.beginPath(); c.moveTo(0,s*.14); c.arc(0,s*.14,s,a+.3,a+6); c.closePath(); c.fill();
  c.fillStyle=pad; c.beginPath(); c.moveTo(0,0); c.arc(0,0,s,a+.3,a+6); c.closePath(); c.fill(); c.strokeStyle=v3rgba(hi,.5); c.lineWidth=Math.max(.5,s*.08); c.beginPath(); c.arc(0,0,s*.62,a+1.5,a+3.5); c.stroke(); c.restore();
  if(flower){ const pk=mix(flower,P.wMid,P.night*.4); for(let i=0;i<7;i++){ const an=i/7*Math.PI*2; c.fillStyle=i%2?pk:mix(pk,'#ffffff',.35); c.beginPath(); c.ellipse(x+Math.cos(an)*s*.28,y-s*.18+Math.sin(an)*s*.1,s*.32,s*.14,an,0,7); c.fill(); } c.fillStyle=mix('#ffd84a',P.wMid,P.night*.4); c.beginPath(); c.arc(x,y-s*.22,s*.12,0,7); c.fill(); } }
function waDuck(x,y,s,dir,P,t,i,kind){ const N=c0=>mix(c0,P.wMid,P.night*.55); g.save(); g.translate(x,y+Math.sin(t*2+i)*s*.15); g.scale(dir,1);
  g.strokeStyle=v3rgba(mix(P.wTop,'#ffffff',.6),.45); g.lineWidth=1; g.beginPath(); g.moveTo(-s*1.6,s*.25); g.lineTo(-s*4.6,s*.9); g.moveTo(-s*1.6,s*.25); g.lineTo(-s*4.6,-s*.2); g.stroke();
  const body=kind?N('#8a5a3a'):N('#8a7a6a'), head=kind?N('#e8783a'):N('#2a6a3a');
  g.fillStyle=body; g.beginPath(); g.moveTo(-s*1.7,-s*.2); g.quadraticCurveTo(-s*1.2,s*.45,s*.6,s*.35); g.quadraticCurveTo(s*1.4,s*.2,s*1.2,-s*.4); g.quadraticCurveTo(0,-s*.9,-s*1.7,-s*.2); g.fill();
  g.fillStyle=mix(body,'#ffffff',.25); g.beginPath(); g.ellipse(-s*.3,-s*.25,s*.8,s*.28,-.1,0,7); g.fill();
  g.fillStyle=head; g.beginPath(); g.arc(s*1.1,-s*.95,s*.5,0,7); g.fill(); g.fillStyle=N('#e8b830'); g.beginPath(); g.moveTo(s*1.5,-s*1.02); g.lineTo(s*2,-s*.86); g.lineTo(s*1.5,-s*.74); g.fill();
  if(kind){ g.fillStyle=N('#ffffff'); g.fillRect(s*.9,-s*1.16,s*.55,s*.13); } g.fillStyle='#101010'; g.fillRect(s*1.25,-s*1.06,s*.15,s*.15); g.restore(); }
function waFuji(x,P,hz){ const cx=W*.5, top=hz-H*.34, bw=W*.46, cw=W*.03, far=mix(P.far,P.farHaze,.25), lit=mix(far,'#ffffff',.2), sh=mix(far,'#1c1c44',.22), r=v3rng(88);
  const path=()=>{ x.beginPath(); x.moveTo(cx-bw,hz+1); x.bezierCurveTo(cx-bw*.42,hz-H*.035,cx-cw*2.6,top+H*.07,cx-cw,top); x.lineTo(cx-cw*.35,top-H*.004); x.lineTo(cx+cw*.3,top+H*.003); x.lineTo(cx+cw,top); x.bezierCurveTo(cx+cw*2.6,top+H*.07,cx+bw*.42,hz-H*.035,cx+bw,hz+1); x.closePath(); };
  x.save(); path(); x.clip(); const gr=x.createLinearGradient(cx-W*.12,0,cx+W*.12,0); gr.addColorStop(0,lit); gr.addColorStop(.46,lit); gr.addColorStop(.56,sh); gr.addColorStop(1,sh); x.fillStyle=gr; x.fillRect(cx-bw,top-4,bw*2,hz-top+6);
  x.strokeStyle=v3rgba(sh,.3); x.lineWidth=1; for(let i=0;i<14;i++){ const u=i/13-.5; x.beginPath(); x.moveTo(cx+u*cw*3,top+H*.02); x.quadraticCurveTo(cx+u*bw*.35,hz-H*.12,cx+u*bw*(.6+r()*.2),hz); x.stroke(); }
  const sl=top+H*.11, snow=P.snow||'#ffffff', sLit=mix(snow,far,.08), sSh=mix(snow,'#8a94c8',.4), sg=x.createLinearGradient(cx-W*.1,0,cx+W*.1,0); sg.addColorStop(0,sLit); sg.addColorStop(.48,sLit); sg.addColorStop(.56,sSh); sg.addColorStop(1,sSh); x.fillStyle=sg;
  x.beginPath(); x.moveTo(cx-W*.2,top-5); x.lineTo(cx-W*.2,sl); for(let i=0;i<=44;i++){ const u=i/44, f=Math.abs(u-.5)*2, gul=Math.pow(Math.max(0,Math.sin(u*31+r()*1.5)),3); x.lineTo(cx-W*.2+u*W*.4,sl-f*H*.045+gul*H*(.025+r()*.03)*(1-f*.5)-r()*H*.008); } x.lineTo(cx+W*.2,top-5); x.closePath(); x.fill();
  const hg=x.createLinearGradient(0,top,0,hz); hg.addColorStop(0,v3rgba(P.farHaze,.12)); hg.addColorStop(.6,v3rgba(P.farHaze,.35)); hg.addColorStop(1,v3rgba(P.farHaze,.75)); x.fillStyle=hg; x.fillRect(cx-bw,top-4,bw*2,hz-top+6); x.restore();
  x.fillStyle=v3rgba(mix('#ffffff',P.farHaze,.3),.38*(1-P.night*.5)); for(const [dx,dy,w2] of [[-.06,.2,.12],[.05,.22,.1],[0,.205,.07]]){ x.beginPath(); x.ellipse(cx+W*dx,top+H*dy,W*w2,H*.012,0,0,7); x.fill(); } }
const WA_TORO=[.21,.31,.53,.66];
// ---------- C34 Canadian Rockies (Cam, 2026-11-20) ----------
// The jagged Rockies with the rounded pink-grey granite of the Canadian Shield right in front; pines and white birches; a river runs down
// to a granite cliff and drops over a waterfall and meets a beaver dam and lodge; beavers swim, slap their tails and gnaw on the dam; a moose
// on the shore lowers its head to drink; Canada geese swim and fly over in a V; a canoe drifts with a quiet angler; a reworked log cabin
// with a stone chimney and porch, the Canadian flag on its pole; fireweed on the shore; crystal-clear water with rocks and weeds on the
// bottom; clear, starry nights with the Milky Way.
const WA_FALL={x:.815, top:.075}; /* waterfall: its x, and how far above the horizon it starts (in H) */
function waBirch(c,x,base,h,P,seed){ const r=v3rng(seed), bark=mix('#f0ece4',P.back,.25+P.night*.55), leaf=mix('#9ac04a',P.back,.3+P.night*.45); c.fillStyle=bark; c.fillRect(x-h*.02,base-h*.72,h*.04,h*.72);
  c.fillStyle=mix('#2a2a2a',P.back,.3); for(let k=0;k<5;k++) c.fillRect(x-h*.02,base-h*(.1+k*.12),h*.024,h*.012);
  c.fillStyle=leaf; c.beginPath(); for(let k=0;k<9;k++){ const bx=x+(r()-.5)*h*.32, by=base-h*(.6+r()*.34), br=h*(.07+r()*.06); c.moveTo(bx+br,by); c.arc(bx,by,br,0,7); } c.fill();
  c.fillStyle=v3rgba(mix(leaf,'#ffffff',.35),.55); c.beginPath(); for(let k=0;k<4;k++){ const bx=x+(r()-.3)*h*.2, by=base-h*(.75+r()*.18), br=h*.05; c.moveTo(bx+br,by); c.arc(bx,by,br,0,7); } c.fill(); }
function waCabin(c,x,b,s,P){ const k=P.night*.55, log=mix('#8a5432',P.front,k), logL=mix('#9a6440',P.front,k), roof=mix('#3a3430',P.front,k*.8), roofL=mix(roof,'#ffffff',.15), stone=mix('#8a8a90',P.front,k), endC=mix('#d8b080',P.front,k), w=s*12, h=s*5.4, fl=b-s*.8;
  c.fillStyle=mix(log,'#000000',.3); c.fillRect(x-s*2,fl,w+s*4,s*.8);
  for(let i=0;i<6;i++){ const y=fl-(i+1)*h/6; c.fillStyle=i%2?log:logL; c.fillRect(x,y,w,h/6-.4); c.fillStyle=endC; c.beginPath(); c.arc(x,y+h/12,h/12,0,7); c.moveTo(x+w+h/12,y+h/12); c.arc(x+w,y+h/12,h/12,0,7); c.fill(); }
  c.fillStyle=logL; c.beginPath(); c.moveTo(x,fl-h); c.lineTo(x+w*.5,fl-h-s*3.6); c.lineTo(x+w,fl-h); c.closePath(); c.fill();
  c.fillStyle=stone; c.fillRect(x+w*.74,fl-h-s*4.6,s*1.6,s*4.6+h); c.fillStyle=mix(stone,'#000000',.25); for(let i=0;i<5;i++) c.fillRect(x+w*.74+(i%2)*s*.6,fl-h-s*4.2+i*s*1.6,s*.9,s*.25);
  c.fillStyle=roof; c.beginPath(); c.moveTo(x-s*1.4,fl-h+s*.4); c.lineTo(x+w*.5,fl-h-s*4.2); c.lineTo(x+w+s*1.4,fl-h+s*.4); c.lineTo(x+w+s*1.4,fl-h+s*1.1); c.lineTo(x+w*.5,fl-h-s*3.4); c.lineTo(x-s*1.4,fl-h+s*1.1); c.closePath(); c.fill();
  c.strokeStyle=roofL; c.lineWidth=Math.max(.6,s*.25); c.beginPath(); c.moveTo(x-s*1.4,fl-h+s*.4); c.lineTo(x+w*.5,fl-h-s*4.2); c.lineTo(x+w+s*1.4,fl-h+s*.4); c.stroke();
  const lit=P.night>.3; c.fillStyle=mix('#4a2a18',P.front,k); c.fillRect(x+w*.42,fl-h*.72,w*.16,h*.72);
  for(const wx of [.12,.7]){ c.fillStyle=mix('#5a3018',P.front,k); c.fillRect(x+w*wx-s*.3,fl-h*.72-s*.3,w*.18+s*.6,h*.38+s*.6); c.fillStyle=lit?'#ffd080':mix('#2a3a4a',P.front,.3); c.fillRect(x+w*wx,fl-h*.72,w*.18,h*.38); c.fillStyle=mix('#5a3018',P.front,k); c.fillRect(x+w*wx+w*.085,fl-h*.72,s*.25,h*.38); }
  c.fillStyle=mix('#5a3018',P.front,k); for(const px of [-.12,1.1]) c.fillRect(x+w*px,fl-h*.9,s*.4,h*.9); }
function waBeaverDam(c,x0,x1,y,P,seed){ const r=v3rng(seed), wood=mix('#6a4a2a',P.wBot,.2+P.night*.5), dk=mix(wood,'#000000',.35), lt=mix(wood,'#d8b080',.35);
  c.fillStyle=dk; c.beginPath(); c.moveTo(x0,y+H*.012); c.quadraticCurveTo((x0+x1)/2,y-H*.022,x1,y+H*.012); c.closePath(); c.fill();
  c.lineCap='round'; for(let i=0;i<60;i++){ const u=r(), xx=x0+(x1-x0)*u, top=y+H*.012-H*.034*4*u*(1-u)*.95, yy=top+r()*(y+H*.012-top), a=(r()-.5)*1.6, L=H*(.008+r()*.016); c.strokeStyle=r()<.3?lt:wood; c.lineWidth=Math.max(.7,H*.0022); c.beginPath(); c.moveTo(xx-Math.cos(a)*L,yy-Math.sin(a)*L); c.lineTo(xx+Math.cos(a)*L,yy+Math.sin(a)*L); c.stroke(); } c.lineCap='butt'; }
function waMoose(x,y,s,P,t){ const N=c0=>mix(c0,P.front,P.night*.6), body=N('#4a3020'), dk=N('#2e1c12'), ant=N('#c8a878'), q=t%23, dip=q<6?Math.sin(q/6*Math.PI):0; g.save(); g.translate(x,y);
  g.strokeStyle=dk; g.lineWidth=Math.max(1,s*.55); for(const lx of [-3.2,-2.2,2.4,3.3]){ g.beginPath(); g.moveTo(lx*s,-s*4.2); g.lineTo(lx*s+(lx>0?.2:-.2)*s,0); g.stroke(); }
  g.fillStyle=body; g.beginPath(); g.ellipse(0,-s*5.2,s*4.4,s*1.9,0,0,7); g.fill(); g.beginPath(); g.ellipse(s*2.6,-s*6.3,s*1.8,s*1.4,-.3,0,7); g.fill();
  g.save(); g.translate(s*3.8,-s*6.2); g.rotate(dip*1.05); g.fillStyle=body; g.beginPath(); g.moveTo(0,-s*.8); g.lineTo(s*2.4,-s*.4); g.lineTo(s*2.4,s*.9); g.lineTo(0,s*.9); g.closePath(); g.fill();
  g.beginPath(); g.moveTo(s*2.2,-s*.6); g.quadraticCurveTo(s*3.6,-s*.4,s*3.9,s*.6); g.quadraticCurveTo(s*3.6,s*1.4,s*2.4,s*1.3); g.closePath(); g.fill(); g.fillStyle=dk; g.beginPath(); g.ellipse(s*1.4,s*1.4,s*.5,s*.9,0,0,7); g.fill();
  g.fillStyle=ant; g.beginPath(); g.ellipse(s*1.2,-s*1.6,s*1.9,s*.7,-.25,0,7); g.fill(); for(let i=0;i<4;i++){ g.beginPath(); g.ellipse(s*(-.2+i*.9),-s*2.3+Math.abs(i-1.5)*s*.2,s*.22,s*.55,0,0,7); g.fill(); } g.restore();
  g.fillStyle=dk; g.beginPath(); g.ellipse(-s*4.3,-s*5.6,s*.5,s*.3,0,0,7); g.fill(); g.restore(); }
function waGoose(x,y,s,dir,P,t,i,fly){ const N=c0=>mix(c0,fly?P.top:P.wMid,P.night*.55); g.save(); g.translate(x,y); g.scale(dir,1);
  if(fly){ const f=Math.sin(t*6+i)*.8; g.fillStyle=N('#6a5a4a'); g.beginPath(); g.ellipse(0,0,s*1.6,s*.45,0,0,7); g.fill(); g.strokeStyle=N('#5a4a3a'); g.lineWidth=Math.max(1,s*.4); g.beginPath(); g.moveTo(-s*.2,0); g.lineTo(-s*.6,-s*1.8*f); g.moveTo(s*.2,0); g.lineTo(s*.4,-s*1.6*f); g.stroke(); g.strokeStyle=N('#1a1a1a'); g.lineWidth=Math.max(1,s*.3); g.beginPath(); g.moveTo(s*1.4,0); g.lineTo(s*2.4,-s*.2); g.stroke(); g.restore(); return; }
  g.fillStyle=N('#7a6a58'); g.beginPath(); g.ellipse(0,0,s*1.7,s*.6,0,0,7); g.fill(); g.fillStyle=N('#e8e0d4'); g.beginPath(); g.ellipse(-s*1.3,s*.05,s*.5,s*.3,0,0,7); g.fill();
  g.strokeStyle=N('#1a1a1a'); g.lineWidth=Math.max(1,s*.35); g.beginPath(); g.moveTo(s*1.1,-s*.2); g.quadraticCurveTo(s*1.4,-s*1.4,s*1.3,-s*2); g.stroke(); g.fillStyle=N('#1a1a1a'); g.beginPath(); g.ellipse(s*1.5,-s*2.05,s*.42,s*.26,0,0,7); g.fill(); g.fillStyle=N('#f4f0e8'); g.fillRect(s*1.15,-s*2,s*.35,s*.18);
  g.strokeStyle=v3rgba(mix(P.wTop,'#ffffff',.6),.4); g.lineWidth=1; g.beginPath(); g.moveTo(-s*1.6,s*.4); g.lineTo(-s*4,s*.9); g.stroke(); g.restore(); }
function waFlag(x,y,s,P,t){ const N=c0=>mix(c0,P.top,P.night*.5), fw=s*2.2, fh=s*1.1, red=N('#d8202a'), wht=N('#f8f4f0');
  g.fillStyle=N('#c8c8cc'); g.fillRect(x-s*.06,y,s*.12,s*4.6); for(let i=0;i<12;i++){ const u=i/12, u2=(i+1)/12, oy=Math.sin(t*4-u*5)*fh*.12*u; g.fillStyle=(u<.25||u>=.75)?red:wht; g.fillRect(x+fw*u,y+oy,fw/12+.6,fh); }
  const cx=x+fw*.5, cy=y+fh*.5+Math.sin(t*4-2.5)*fh*.06, r=fh*.32; g.fillStyle=red; g.beginPath(); for(let i=0;i<10;i++){ const a=-Math.PI/2+i*Math.PI/5, rr=i%2?r*.45:r; g.lineTo(cx+Math.cos(a)*rr,cy+Math.sin(a)*rr*.95); } g.closePath(); g.fill(); g.fillRect(cx-r*.06,cy+r*.3,r*.12,r*.55); }
function waCanoe(x,y,s,P,t){ const N=c0=>mix(c0,P.wMid,P.night*.55), cast=(t%19)/19; g.save(); g.translate(x,y+Math.sin(t*1.1)*s*.15);
  g.fillStyle=v3rgba(N('#000000'),.15); g.beginPath(); g.ellipse(0,s*.5,s*6,s*.5,0,0,7); g.fill();
  g.fillStyle=N('#2a6a4a'); g.beginPath(); g.moveTo(-s*6,-s*.8); g.quadraticCurveTo(0,s*1.4,s*6,-s*.8); g.quadraticCurveTo(0,s*.2,-s*6,-s*.8); g.fill(); g.fillStyle=N('#c8a070'); g.fillRect(-s*4.5,-s*.25,s*9,s*.25);
  g.fillStyle=N('#3a4048'); g.beginPath(); g.ellipse(-s*.6,-s*1.9,s*1,s*1.5,0,0,7); g.fill(); g.fillStyle=N('#c8987a'); g.beginPath(); g.arc(-s*.4,-s*3.7,s*.75,0,7); g.fill(); g.fillStyle=N('#5a4a3a'); g.fillRect(-s*1.3,-s*4.5,s*1.8,s*.45); g.fillRect(-s*.9,-s*5,s*1,s*.6);
  const ra=cast<.08?-1.2+cast/.08*1.6:.4; g.strokeStyle=N('#2a2a2a'); g.lineWidth=Math.max(.8,s*.18); g.beginPath(); g.moveTo(s*.2,-s*2.2); g.lineTo(s*.2+Math.cos(-ra-.6)*s*6,-s*2.2+Math.sin(-ra-.6)*s*6); g.stroke();
  g.strokeStyle=v3rgba('#ffffff',.35); g.lineWidth=.8; g.beginPath(); g.moveTo(s*.2+Math.cos(-ra-.6)*s*6,-s*2.2+Math.sin(-ra-.6)*s*6); g.lineTo(s*7,s*.2); g.stroke(); g.restore(); }
let waStarsC=null;
/* AMAZON (Cam's list #4, 2026-11-21), every piece drawn from the side: a deep layered rainforest with tall emergent trees, the jungle cliff
   with ledges, moss and boulders, its waterfall ending in a foaming pool at the water line, a forested island that keeps the channel narrow,
   aerial roots and water plants along the banks; alive with dragonflies, butterflies, macaws, a caiman, a bullfrog, floating branches, and
   one moment at a time (the pink river dolphin, an anaconda swimming, a basilisk running on the water). */
function amzTree(x,base,h,crown,col,dk){ x.fillStyle=dk; x.fillRect(-h*.012+base[0],base[1]-h,h*.024,h); x.fillStyle=col; for(let i=0;i<5;i++){ const a=(i-2)/2; x.beginPath(); x.ellipse(base[0]+a*crown*.55,base[1]-h-crown*(.18-Math.abs(a)*.08),crown*.42,crown*.2,0,0,7); x.fill(); } }
// ---------- C35 every new map (Cam, 2026-11-20: "more populated, functional customizable homes, better effects, occasional map-specific
// animations, full polish"). Homes: cp_plats.js (wood and a paint on every new home). Here each map gets more life on its shores and water
// and one moment of its own that comes round every half minute or so:
//  Florida Keys: a striped lighthouse (its beam sweeps at night), mangroves, a sailboat; dolphins leap.
//  Amazon: capybaras on the bank, a toucan on the cliff, blue morpho butterflies; a pink river dolphin surfaces.
//  Animal Farm: a farm road with cows and sheep, ducks on the pond; a tractor drives by.
//  The Buffet: a fork in the mashed potatoes, peas, a wobbling jelly, candles on the cake; a meatball rolls down into the gravy.
//  Corporate Pond: an office fountain in the pond; paper planes glide down; a helicopter crosses.
//  The Nile: an obelisk, lotus flowers, a camel caravan on the dunes, ibises; a crocodile surfaces.
//  Circuit Lake: data rain, a drone swarm with blinking lights; now and then the whole scene glitches.
//  Mount Olympus: broken columns on the clouds, an owl on the column by you; Pegasus flies past.
const waK = (y,hz) => clamp((y-hz)/(H-hz),0,1);
function waMore(id,part,x,P,hz,t){ const M=WA_MORE[id]; if(M&&M[part]) M[part](x,P,hz,t); }
function waCow(c,x,y,s,P,sheep){ const N=c0=>mix(c0,P.hill,.12+P.night*.55);
  if(sheep){ c.fillStyle=N('#2a2a2a'); c.fillRect(x-s*1.2,y-s*.9,s*.3,s*.9); c.fillRect(x+s,y-s*.9,s*.3,s*.9); c.fillStyle=N('#f4f0e8'); c.beginPath(); for(let i=0;i<6;i++){ const bx=x+(i-2.5)*s*.65, by=y-s*1.4+(i%2)*s*.3; c.moveTo(bx+s*.8,by); c.arc(bx,by,s*.8,0,7); } c.fill(); c.fillStyle=N('#2a2a2a'); c.beginPath(); c.ellipse(x+s*2.3,y-s*1.5,s*.6,s*.45,0,0,7); c.fill(); return; }
  c.fillStyle=N('#2a2626'); for(const lx of [-1.6,-1,1,1.5]) c.fillRect(x+lx*s,y-s,s*.35,s);
  c.fillStyle=N('#f4f0ea'); c.beginPath(); c.ellipse(x,y-s*1.6,s*2.2,s,0,0,7); c.fill(); c.fillStyle=N('#2a2626'); c.beginPath(); c.ellipse(x-s*.6,y-s*1.8,s*.8,s*.55,.3,0,7); c.moveTo(x+s*1.7,y-s*1.4); c.ellipse(x+s*1.1,y-s*1.4,s*.6,s*.5,-.2,0,7); c.fill();
  c.fillStyle=N('#f4f0ea'); c.beginPath(); c.ellipse(x+s*2.5,y-s*1.5,s*.7,s*.55,.4,0,7); c.fill(); c.fillStyle=N('#e8a0a0'); c.beginPath(); c.ellipse(x+s*2.9,y-s*1.15,s*.35,s*.28,0,0,7); c.fill(); }
function waLeaper(cx,y,s,e,col){ const px=cx+(e-.5)*s*14, py=y-Math.sin(e*Math.PI)*s*5; g.save(); g.translate(px,py); g.rotate(Math.PI*(e-.5)*1.1); g.fillStyle=col;
  g.beginPath(); g.ellipse(0,0,s*2.4,s*.7,0,0,7); g.fill(); g.beginPath(); g.moveTo(-s*.2,-s*.6); g.lineTo(s*.3,-s*1.4); g.lineTo(s*.8,-s*.5); g.fill(); g.beginPath(); g.moveTo(-s*2.2,0); g.lineTo(-s*3.1,-s*.7); g.lineTo(-s*3.1,s*.7); g.fill(); g.beginPath(); g.moveTo(s*2.2,-s*.15); g.lineTo(s*3,0); g.lineTo(s*2.2,s*.3); g.fill(); g.restore(); }
/* Florida Keys (Cam's list #3): the bridge deck's height at x (flat, with a gentle hump for boats in the middle) */
function keysDeck(x,hz){ const u=(x/W-.5)/.09; return hz-H*.034-(Math.abs(u)<1?H*.02*(Math.cos(u*Math.PI)*.5+.5):0); }
/* a vehicle on the bridge, seen from the side, sitting on the deck: car, minivan, box truck or semi; front toward dir */
function keysVehicle(x,base,dir,kind,col,P,a){ const u=H*.0052; g.save(); g.globalAlpha=a; g.translate(x,base); g.scale(dir,1);
  const N=c0=>mix(c0,P.farHaze,.25+P.night*.45), win=P.night>.4?'#1a2230':N('#9ec6dc'); g.fillStyle=N(col);
  if(kind==='car'){ g.fillRect(-2*u,-1.2*u,4*u,.85*u); g.beginPath(); g.moveTo(-1.3*u,-1.2*u); g.lineTo(-.8*u,-1.95*u); g.lineTo(.9*u,-1.95*u); g.lineTo(1.4*u,-1.2*u); g.fill(); g.fillStyle=win; g.fillRect(-.7*u,-1.8*u,1.5*u,.5*u); }
  else if(kind==='van'){ g.beginPath(); g.moveTo(-2.2*u,-.35*u); g.lineTo(-2.2*u,-2.1*u); g.lineTo(1.4*u,-2.1*u); g.lineTo(2.2*u,-1.2*u); g.lineTo(2.2*u,-.35*u); g.fill(); g.fillStyle=win; g.fillRect(-1.8*u,-1.9*u,3*u,.55*u); }
  else if(kind==='box'){ g.fillRect(-2.6*u,-2.6*u,3.6*u,2.25*u); g.fillStyle=N('#e8e4dc'); g.fillRect(-2.6*u,-2.6*u,3.6*u,2.25*u); g.fillStyle=N(col); g.beginPath(); g.moveTo(1.15*u,-.35*u); g.lineTo(1.15*u,-1.9*u); g.lineTo(2*u,-1.9*u); g.lineTo(2.5*u,-1.1*u); g.lineTo(2.5*u,-.35*u); g.fill(); g.fillStyle=win; g.fillRect(1.6*u,-1.75*u,.6*u,.5*u); }
  else { g.fillStyle=N('#e4e2dc'); g.fillRect(-5*u,-2.7*u,6.6*u,2.3*u); g.fillStyle=N(col); g.beginPath(); g.moveTo(1.8*u,-.35*u); g.lineTo(1.8*u,-2.4*u); g.lineTo(2.9*u,-2.4*u); g.lineTo(3.4*u,-1.3*u); g.lineTo(3.4*u,-.35*u); g.fill(); g.fillStyle=win; g.fillRect(2.4*u,-2.2*u,.65*u,.6*u); }
  const len=kind==='semi'?[-4.2,-3.2,2.7]:kind==='box'?[-1.9,1.8]:kind==='van'?[-1.4,1.4]:[-1.3,1.3]; g.fillStyle='#1a1a1e'; for(const wx of len){ g.beginPath(); g.arc(wx*u,-.35*u,.38*u,0,7); g.fill(); }
  if(P.night>.3){ const back=kind==='semi'?-5:kind==='box'?-2.6:kind==='van'?-2.2:-2, front=kind==='semi'?3.4:kind==='box'?2.5:kind==='van'?2.2:2; g.globalAlpha=a*P.night; g.fillStyle='#ffe9a8'; g.fillRect(front*u-.3*u,-1*u,.4*u,.3*u); g.fillStyle='#ff4040'; g.fillRect(back*u,-1*u,.35*u,.3*u); }
  g.restore(); }
/* a fast boat crossing the far water, side view: a speedboat (low wedge, spray) or a sport-fishing boat (cabin and a tall tuna tower) */
function keysFastBoat(x,y,s,dir,kind,P,t){ const N=c0=>mix(c0,P.wMid,P.night*.55); g.save(); g.translate(x,y); g.scale(dir,1);
  g.fillStyle='rgba(255,255,255,'+(.55-P.night*.3)+')'; g.beginPath(); g.moveTo(-s*2.6,s*.15); g.quadraticCurveTo(-s*7,s*.05+Math.sin(t*9)*s*.05,-s*12,s*.25); g.lineTo(-s*12,s*.45); g.quadraticCurveTo(-s*7,s*.4,-s*2.6,s*.45); g.fill(); /* the wake */
  g.fillStyle=N('#f6f4ee'); g.beginPath(); g.moveTo(-s*2.8,-s*.15); g.lineTo(s*2.2,-s*.15); g.quadraticCurveTo(s*3.4,-s*.3,s*3.9,-s*.95); g.lineTo(s*3.9,-s*.75); g.lineTo(s*2.4,s*.4); g.lineTo(-s*2.6,s*.4); g.closePath(); g.fill();
  g.fillStyle=N(kind==='sport'?'#1f4a7a':'#d8342a'); g.fillRect(-s*2.6,s*.05,s*5,s*.14);
  if(kind==='sport'){ g.fillStyle=N('#eceae4'); g.fillRect(-s*1.2,-s*1.1,s*2.2,s*.95); g.fillStyle=N('#2a3440'); g.fillRect(-s*.6,-s*.95,s*1.4,s*.4); g.strokeStyle=N('#d8d8d8'); g.lineWidth=Math.max(1,s*.12); g.beginPath(); g.moveTo(-s*.9,-s*1.1); g.lineTo(-s*.5,-s*3.2); g.moveTo(s*.7,-s*1.1); g.lineTo(s*.4,-s*3.2); g.moveTo(-s*.7,-s*3.2); g.lineTo(s*.6,-s*3.2); g.moveTo(-s*.75,-s*2.2); g.lineTo(s*.55,-s*2.2); g.stroke(); }
  else { g.fillStyle=N('#2a3440'); g.beginPath(); g.moveTo(-s*.4,-s*.15); g.lineTo(s*.5,-s*.75); g.lineTo(s*1.2,-s*.15); g.fill(); }
  g.fillStyle='rgba(255,255,255,'+(.7-P.night*.4)+')'; for(let i=0;i<4;i++){ const k=((t*6+i*.25)%1); g.beginPath(); g.arc(s*(2.6-k*1.5),s*(.1-k*.6),s*.18*(1-k),0,7); g.fill(); } /* spray at the bow */
  g.restore(); }
function waRing(x,y,s,k,a){ g.strokeStyle='rgba(255,255,255,'+(a*(1-k))+')'; g.lineWidth=1.2; g.beginPath(); g.ellipse(x,y,s*(1+k*4),s*(.3+k*1.2),0,0,7); g.stroke(); }
const WA_MORE={}; /* each newer water's extra life and its moment: src/w_<id>.js (Clean Scenes 5, 2026-11-22) */
// music, depth motes and search words for the new waters
try{ Object.assign(MUS_AREA,{blossom:'hanami', rockies:'glacier', keys:'flats', amazon:'canopy', farm:'fair', buffet:'dinner', corporate:'lounge', nile:'nile', circuit:'neon', olympus:'thunder'}); }catch(e){} /* batch 5: every water its own theme (j_music.js) */
try{ Object.assign(DEPTH_MOTE,{blossom:'255,230,240', rockies:'255,255,255', keys:'255,255,240', amazon:'220,240,200', farm:'255,250,230', buffet:'255,240,200', corporate:'220,230,255', nile:'255,240,210', circuit:'120,240,255', olympus:'255,240,200'}); }catch(e){}
try{ const s=SEARCH_IDX.find(e=>e[0]==='Waters'); if(s) s[3]+=' cherry blossom japan rockies canada keys florida amazon farm buffet corporate nile egypt circuit cyber olympus'; }catch(e){}
// end-game waters: open them for anyone with enough voyages (start-up, any load, and after setting sail)
{ const _m=migrate; migrate=function(o){ const m=_m(o); try{ egOpenAdd(m); }catch(e){} return m; }; }
try{ egOpenAdd(S); }catch(e){}
document.addEventListener('click',e=>{ const b=e.target.closest&&e.target.closest('[data-act="retireok"]'); if(!b) return; setTimeout(()=>{ try{ egOpenAdd(S); }catch(er){} },30); },true);
// end-game fish pay 25% more than your best normal water and fight like it
{ const _rf=rollFish; rollFish=function(sp){ const f=_rf.apply(this,arguments); try{ if(f&&sp&&sp.eg){ const k=egScale(); f.value=Math.max(1,Math.round(f.value*k.v)); f.str=+(f.str*k.s).toFixed(2); } }catch(e){} return f; }; }
// end-game fish in the Aquarium: their income cap follows the same scale (it is computed from the water's fish)
