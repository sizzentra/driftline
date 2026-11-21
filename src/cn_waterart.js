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
V3SCENES.blossom={
  land(x,P,hz,cnv){
    waFuji(x,P,hz);
    v3range(x,{seed:12, base:hz+1, amp:.2*H, massifs:[[.04,.95,.09],[.2,.6,.07],[.82,.62,.08],[.97,1,.08]], light:mix(P.far,P.hill,.35), shadow:mix(P.far,'#1a1030',.35), haze:P.farHaze, snow:null, hazeA:.5});
    wa.hills(x,hz,mix(P.hill,P.farHaze,.35),[[0,.05],[.12,.07],[.3,.045],[.5,.035],[.7,.05],[.88,.07],[1,.055]]);
    for(let i=0;i<16;i++) waCherry(x,W*(.02+i*.065)+((i*29)%7-3)*3,hz-H*.03,H*.035,P,200+i,{leaf:mix(P.leaf,P.farHaze,.35)});
    wa.hills(x,hz,P.hill,[[0,.03],[.15,.04],[.3,.025],[.5,.03],[.7,.025],[.85,.04],[1,.03]]);
    waPagoda(x,W*.14,hz-H*.022,H*.0072,P);
    for(const [px,hh,wp,deep] of [[.03,.1,0,0],[.25,.085,1,0],[.36,.11,0,1],[.47,.075,0,0],[.6,.1,1,1],[.7,.08,0,0],[.9,.115,0,1],[.98,.08,1,0]]) waCherry(x,W*px,hz-H*.008,H*hh,P,300+Math.round(px*100),{weep:wp,leaf:deep?mix(P.leaf,'#d8507a',.35):P.leaf});
    for(const px of WA_TORO) waToro(x,W*px,hz-H*.006,H*.0055,P);
    v3water(x,P,hz,cnv,.38);
    // the red torii standing in the shallows on the right
    { const gx=W*.78, gb=hz+H*.03, gh=H*.12, gw=H*.11, red=mix('#d8382a',P.wBot,P.night*.6); x.fillStyle=red; x.fillRect(gx-gw*.4,gb-gh,gh*.07,gh); x.fillRect(gx+gw*.4-gh*.07,gb-gh,gh*.07,gh);
      x.fillRect(gx-gw*.5,gb-gh*.78,gw,gh*.07); x.beginPath(); x.moveTo(gx-gw*.66,gb-gh*.98); x.quadraticCurveTo(gx,gb-gh*.9,gx+gw*.66,gb-gh*.98); x.lineTo(gx+gw*.6,gb-gh*.88); x.quadraticCurveTo(gx,gb-gh*.82,gx-gw*.6,gb-gh*.88); x.closePath(); x.fill();
      x.fillStyle=mix('#1a1a1a',P.wBot,P.night*.5); x.fillRect(gx-gw*.62,gb-gh*1.02,gw*1.24,gh*.05);
      x.fillStyle=v3rgba(red,.25); x.fillRect(gx-gw*.4,gb,gh*.07,gh*.5); x.fillRect(gx+gw*.4-gh*.07,gb,gh*.07,gh*.5); }
    // water lilies near the shores, bigger toward you
    { const r=v3rng(41); for(const [cx,cy,n] of [[.42,.05,4],[.55,.09,3],[.88,.13,5],[.33,.24,4],[.66,.36,4],[.95,.5,3]]) for(let i=0;i<n;i++){ const yy=hz+H*cy+(r()-.5)*H*.02, k=(yy-hz)/(H-hz), s=H*(.008+k*.04)*(.7+r()*.5), fl=r()<.35?(r()<.5?'#f4a8c4':'#fff4f8'):null; waLily(x,W*cx+(r()-.5)*W*.06*(1+k*2),yy,s,P,500+i+Math.round(cx*100),fl); } } },
  live(P,t,hz,sun){ const FX=S.settings.effects; v3glitter(P,t,hz,sun);
    // petals resting on the lake, drifting slowly with the breeze (smaller and flatter toward the far shore)
    for(let i=0,n=gfxHigh()?30:18;i<n;i++){ const y=hz+H*(.015+((i*.377)%1)*.75), k=(y-hz)/(H-hz), x=((W*((i*.618)%1)+t*W*(.003+(i%3)*.0015)*(1+k))%(W*1.05))-W*.02, s=1+k*3.2;
      g.fillStyle=i%3?'rgba(255,196,214,.85)':'rgba(255,236,244,.9)'; g.beginPath(); g.ellipse(x,y+Math.sin(t*.8+i)*k*1.5,s,s*.42,(i%5)*.3,0,7); g.fill(); }
    if(FX) for(let i=0,n=gfxHigh()?22:12;i<n;i++){ const per=9+(i%5), q=((t+i*1.7)%per)/per, x=W*(((i*.137)+q*.25)%1), y=H*.05+q*H*.85+Math.sin(t*1.3+i)*6; if(y>H*.97) continue; wa.petal(g,x,y,2.6,t*2+i,i%3?'rgba(255,190,210,.85)':'rgba(255,230,240,.9)'); }
    // ducks paddling (they replaced the koi), turning at the ends of their lap
    for(let i=0;i<3;i++){ const ph=t*.022+i*2.1, y=hz+H*(.05+i*.045), k=(y-hz)/(H-hz); waDuck(W*(.55+.3*Math.sin(ph)),y,H*(.006+k*.012),Math.cos(ph)>=0?1:-1,P,t,i,i===1); }
    // the stone lanterns glow at night and paper lanterns drift on the lake
    if(P.night>.3){ for(const px of WA_TORO) v3glow(g,W*px,hz-H*.006-H*.018,H*.025,'rgba(255,190,110,.9)',.6*P.night);
      for(let i=0;i<5;i++){ const q=((t*.01+i*.2)%1), x=W*(.25+q*.7), y=hz+H*(.04+i*.035)+Math.sin(t*.8+i)*2, s=H*.006*(1+(y-hz)/(H-hz)*3); v3glow(g,x,y,s*5,'rgba(255,180,120,.9)',.5*P.night); g.fillStyle='rgba(255,210,150,'+P.night+')'; g.fillRect(x-s*.6,y-s,s*1.2,s*1.2); g.fillStyle=v3rgba('#ffc890',.25*P.night); g.fillRect(x-s*.4,y+s*.4,s*.8,s*3); } }
    // now and then a gust carries a swirl of petals across the lake
    if(FX){ const q=t%47; if(q<7){ const e=q/7; for(let i=0;i<36;i++){ const u=i/36, x=-W*.1+(e*1.4-u*.35)*W*1.1, y=hz*.55+Math.sin(u*9+t*2)*H*.08+u*H*.25; if(x<-10||x>W+10) continue; wa.petal(g,x,y,2.4,t*4+i,i%3?'rgba(255,190,210,.9)':'rgba(255,236,244,.95)'); } } } },
  fore(P,t){ const sw=Math.sin(t*.6)*.03; g.save(); g.translate(W,0); g.rotate(sw); g.strokeStyle=mix('#4a3022',P.top,P.night*.4); g.lineWidth=H*.012; g.lineCap='round'; g.beginPath(); g.moveTo(0,H*.05); g.quadraticCurveTo(-W*.08,H*.06,-W*.16,H*.14); g.stroke();
    for(let i=0;i<14;i++){ const u=i/13, px=-W*.16*u, py=H*.05+H*.09*u*u; g.fillStyle=i%2?'rgba(255,190,214,.95)':'rgba(255,224,236,.95)'; g.beginPath(); g.arc(px+((i*7)%5-2)*2,py+((i*11)%5-2)*2,H*.012,0,7); g.fill(); } g.restore(); }
};
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
V3SCENES.rockies={
  sky(P,t,hz){ const gl=P.gloom||0; if(P.night<.2||gl>.45) return; const a=(P.night-.2)/.8*(1-gl);
    if(!waStarsC||waStarsC.w!==W||waStarsC.h!==hz){ const r=v3rng(91); waStarsC={w:W,h:hz,a:Array.from({length:240},()=>{ const u=r(), band=r()<.45; const x=band?u*W:r()*W, y=band?(hz*.08+u*hz*.6+(r()-.5)*hz*.18):r()*hz*.8; return [x,y,r(),r()<.07]; })}; }
    for(let i=0;i<7;i++){ const u=i/6; v3glow(g,W*(.05+u*.9),hz*(.12+u*.55),H*.14,'rgba(210,215,255,.9)',.07*a); }
    g.fillStyle='#ffffff'; for(const s of waStarsC.a){ g.globalAlpha=a*(.3+.7*Math.abs(Math.sin(t*.9+s[2]*17))); const z=s[3]?1.7:.9; g.fillRect(s[0],s[1],z,z); } g.globalAlpha=1; },
  land(x,P,hz,cnv){
    v3range(x,{seed:21, base:hz+1, amp:.29*H, massifs:[[.2,.95,.12],[.4,.78,.1],[.63,1,.12],[.86,.8,.1]], light:mix(P.far,'#ffffff',.3), shadow:mix(P.far,'#101830',.4), haze:P.farHaze, snow:P.snow, snowLine:hz-.14*H, hazeA:.45});
    v3range(x,{seed:44, base:hz+1, amp:.1*H, massifs:[[.15,.8,.15],[.55,.7,.18],[.88,.8,.12]], light:mix(P.far,P.hill,.5), shadow:mix(P.hill,'#081018',.3), haze:P.farHaze, snow:null, hazeA:.4});
    // the Canadian Shield: low rounded pink-grey granite in front of the Rockies
    { const r=v3rng(64), rock=mix(mix('#b8968e',P.far,.35),P.farHaze,.15+P.night*.3); for(let i=0;i<10;i++){ const cx=W*(i/9)+(r()-.5)*W*.05, w=W*(.06+r()*.05), h=H*(.02+r()*.022), b=hz+1;
      x.fillStyle=rock; x.beginPath(); x.moveTo(cx-w,b); x.bezierCurveTo(cx-w*.7,b-h*1.15,cx+w*.5,b-h*1.3,cx+w,b); x.closePath(); x.fill();
      x.fillStyle=v3rgba('#ffffff',.16*(1-P.night)); x.beginPath(); x.ellipse(cx-w*.15,b-h*.75,w*.45,h*.18,-.08,0,7); x.fill(); x.strokeStyle=v3rgba('#3a2a2a',.22); x.lineWidth=1; x.beginPath(); x.moveTo(cx-w*.3,b-h*.5); x.lineTo(cx+w*.1,b-h*.2); x.stroke(); } }
    // the cliff the river falls over
    { const fx=W*WA_FALL.x, ft=hz-H*WA_FALL.top; const rk=mix(mix('#6a6468',P.far,.25),'#0a1020',P.night*.6), rkD=mix(rk,'#000000',.3), rkL=mix(rk,'#ffffff',.18);
      x.fillStyle=rk; x.beginPath(); x.moveTo(fx-W*.055,hz+1); x.bezierCurveTo(fx-W*.06,ft+H*.03,fx-W*.04,ft+H*.004,fx-W*.012,ft); x.lineTo(fx+W*.012,ft+H*.001); x.bezierCurveTo(fx+W*.04,ft+H*.004,fx+W*.06,ft+H*.03,fx+W*.065,hz+1); x.closePath(); x.fill();
      x.fillStyle=rkL; x.beginPath(); x.ellipse(fx-W*.03,ft+H*.012,W*.02,H*.005,-.1,0,7); x.ellipse(fx+W*.035,ft+H*.03,W*.018,H*.004,.1,0,7); x.fill();
      x.strokeStyle=rkD; x.lineWidth=1; x.beginPath(); x.moveTo(fx-W*.035,ft+H*.02); x.lineTo(fx-W*.025,ft+H*.05); x.moveTo(fx+W*.03,ft+H*.04); x.lineTo(fx+W*.045,ft+H*.065); x.moveTo(fx-W*.045,ft+H*.045); x.lineTo(fx-W*.05,hz); x.stroke();
      x.fillStyle=mix('#4a6a3a','#0a1020',P.night*.6); x.beginPath(); x.ellipse(fx-W*.03,ft+H*.004,W*.022,H*.005,0,Math.PI,0); x.ellipse(fx+W*.032,ft+H*.006,W*.022,H*.005,0,Math.PI,0); x.fill(); }
    for(let row=0;row<2;row++) for(let i=0;i<26;i++){ const px=W*(i/25)+((i*31)%7-3)*2, base=hz-H*(.004+row*.004), h=H*(.05+((i*17)%5)*.008)*(row?1.2:1); if(row&&((px>W*.34&&px<W*.62)||(px>W*.76&&px<W*.86))) continue; v3pine(x,px,base,h,row?P.front:mix(P.back,P.farHaze,.3),P.rim,.25*(1-P.night)); }
    for(const [px,hh] of [[.26,.06],[.31,.05],[.55,.065],[.68,.055],[.93,.06]]) waBirch(x,W*px,hz-H*.006,H*hh,P,Math.round(px*1000));
    // fireweed along the shore
    { const r=v3rng(12); for(let i=0;i<30;i++){ const px=W*(.2+r()*.75), hh=H*(.008+r()*.01); if(px>W*.76&&px<W*.88) continue; x.strokeStyle=mix('#4a6a3a',P.front,P.night*.5); x.lineWidth=1; x.beginPath(); x.moveTo(px,hz); x.lineTo(px,hz-hh); x.stroke(); x.fillStyle=mix('#d8508a',P.front,.15+P.night*.55); x.fillRect(px-1,hz-hh,2,hh*.55); } }
    waCabin(x,W*.04,hz-H*.004,H*.0058,P);
    v3water(x,P,hz,cnv,.42);
    // crystal-clear water: rocks and weeds on the bottom, clearer toward you
    { const r=v3rng(73); for(let i=0;i<30;i++){ const yy=hz+H*(.07+r()*.9), k=(yy-hz)/(H-hz), s=H*(.008+k*.05)*(.6+r()*.7), xx=W*r(), a=.1+k*.3; if(xx<W*.22&&k>.12) continue;
        x.fillStyle=v3rgba(mix('#8a8270',P.wBot,.45),a); x.beginPath(); x.ellipse(xx,yy,s,s*.42,0,0,7); x.fill(); x.fillStyle=v3rgba(mix('#c8c0a8',P.wMid,.4),a*.6); x.beginPath(); x.ellipse(xx-s*.2,yy-s*.12,s*.55,s*.16,0,0,7); x.fill(); }
      x.lineCap='round'; for(let i=0;i<22;i++){ const yy=hz+H*(.1+r()*.85), k=(yy-hz)/(H-hz), hh=H*(.01+k*.06), xx=W*r(); if(xx<W*.22&&k>.12) continue; x.strokeStyle=v3rgba(mix('#4a8a4a',P.wMid,.35),.12+k*.28); x.lineWidth=Math.max(.8,k*3);
        for(let j=0;j<4;j++){ const ox=(j-1.5)*hh*.18; x.beginPath(); x.moveTo(xx+ox,yy); x.quadraticCurveTo(xx+ox+hh*.2,yy-hh*.5,xx+ox-hh*.05,yy-hh*(.7+j%2*.3)); x.stroke(); } } x.lineCap='butt'; }
    waBeaverDam(x,W*(WA_FALL.x-.045),W*(WA_FALL.x+.075),hz+H*.006,P,5);
    { const lx=W*(WA_FALL.x+.06), ly=hz+H*.012; x.fillStyle=mix('#5a3e24',P.wBot,.2+P.night*.5); x.beginPath(); x.ellipse(lx,ly,H*.03,H*.024,0,Math.PI,0); x.fill(); waBeaverDam(x,lx-H*.03,lx+H*.03,ly-H*.004,P,9); } },
  live(P,t,hz,sun){ v3glitter(P,t,hz,sun); const FX=S.settings.effects, fx=W*WA_FALL.x, ft=hz-H*WA_FALL.top;
    // the waterfall pours and foams onto the dam
    g.fillStyle=v3rgba(mix('#ffffff',P.wTop,.25),.8-P.night*.3); g.beginPath(); g.moveTo(fx-W*.006,ft); g.lineTo(fx+W*.006,ft); g.lineTo(fx+W*.01,hz+H*.004); g.lineTo(fx-W*.01,hz+H*.004); g.closePath(); g.fill();
    if(FX){ g.strokeStyle='rgba(255,255,255,.75)'; g.lineWidth=1; for(let i=0;i<6;i++){ const xx=fx-W*.005+i*W*.002, q=((t*1.4+i*.37)%1), y=ft+q*(hz-ft); g.beginPath(); g.moveTo(xx,y); g.lineTo(xx,y+H*.015); g.stroke(); }
      for(let i=0;i<5;i++){ const q=((t*.4+i*.2)%1); g.fillStyle='rgba(240,250,255,'+(.3*(1-q))+')'; g.beginPath(); g.arc(fx+(i-2)*W*.006,hz-q*H*.025,H*(.006+q*.012),0,7); g.fill(); } }
    // chimney smoke
    if(FX) for(let i=0;i<5;i++){ const q=((t*.15+i*.2)%1), sx=W*.04+H*.0058*12*.74+H*.0058*.8+q*H*.03, sy=hz-H*.06-q*H*.08; g.fillStyle='rgba(220,226,234,'+(.25*(1-q))+')'; g.beginPath(); g.arc(sx,sy,H*(.006+q*.012),0,7); g.fill(); }
    waFlag(W*.135,hz-H*.006-H*.0105*4.6,H*.0105,P,t);
    // beavers: one swims out from the lodge and slaps its tail before diving; one gnaws on the dam
    { const per=26, q=(t%per)/per; if(q<.62){ const e=q/.62, bx=W*(WA_FALL.x+.05)-e*W*.22, by=hz+H*.035, s=H*.0045, oc=mix('#5a3a22',P.wMid,.15+P.night*.5);
        g.fillStyle=oc; g.beginPath(); g.ellipse(bx,by,s*2.2,s*.9,0,Math.PI,0); g.fill(); g.beginPath(); g.ellipse(bx-s*1.8,by-s*.5,s*1,s*.8,0,0,7); g.fill(); m33dot(g,bx-s*2.2,by-s*.7,s*.18,'#140c08');
        g.strokeStyle=v3rgba(mix(P.wTop,'#ffffff',.6),.5); g.lineWidth=1; g.beginPath(); g.moveTo(bx+s*2,by); g.lineTo(bx+s*7,by-s*1.2); g.moveTo(bx+s*2,by+s*.3); g.lineTo(bx+s*7,by+s*1.6); g.stroke(); }
      else if(q<.7){ const k=(q-.62)/.08, bx=W*(WA_FALL.x+.05)-W*.22, by=hz+H*.035, s=H*.0045; if(k<.3){ g.fillStyle=mix('#3a2614',P.wMid,P.night*.5); g.beginPath(); g.ellipse(bx+s,by-s*k*6,s*1.6,s*.6,-.4,0,7); g.fill(); }
        g.strokeStyle='rgba(255,255,255,'+(1-k)+')'; g.lineWidth=1.3; g.beginPath(); g.ellipse(bx,by,s*(2+k*8),s*(.6+k*2),0,0,7); g.stroke(); if(FX) for(let i=0;i<5;i++){ g.fillStyle='rgba(255,255,255,'+(.8*(1-k))+')'; g.fillRect(bx+(i-2)*s*1.4,by-s*(2+Math.sin(i*1.7)*1.5)*Math.sin(k*Math.PI)*3,1.6,1.6); } } }
    { const bx=W*(WA_FALL.x+.012), by=hz-H*.008, s=H*.004, ch=Math.sin(t*9)*.25*(Math.sin(t*.7)>0?1:0), oc=mix('#5a3a22',P.front,P.night*.5); g.fillStyle=oc; g.beginPath(); g.ellipse(bx,by,s*1.8,s*1.4,0,0,7); g.fill(); g.beginPath(); g.ellipse(bx+s*1.6,by-s*.6+ch*s,s*.9,s*.75,.2,0,7); g.fill(); g.fillStyle=mix('#3a2614',P.front,P.night*.5); g.beginPath(); g.ellipse(bx-s*2.2,by+s*.9,s*1.3,s*.4,.3,0,7); g.fill(); m33dot(g,bx+s*1.9,by-s*.9+ch*s,s*.16,'#140c08'); }
    waMoose(W*.42,hz-H*.004,H*.0034,P,t);
    // Canada geese: a pair swimming near the far shore, and now and then a V flying over
    for(let i=0;i<2;i++){ const ph=t*.015+i*.5, y=hz+H*(.02+i*.012); waGoose(W*(.58+.08*Math.sin(ph))+i*H*.03,y,H*.0045,Math.cos(ph)>=0?1:-1,P,t,i,false); }
    if(FX){ const per=37, q=(t%per)/per; if(q<.45){ const e=q/.45, lx=W*(1.1-e*1.3), ly=hz*.32+Math.sin(e*3)*hz*.04; for(let i=0;i<7;i++){ const row=Math.ceil(i/2), side=i%2?1:-1; waGoose(lx+row*H*.03,ly+side*row*H*.016,H*.0035,-1,P,t,i,true); } } }
    waCanoe(W*(.5+.1*Math.sin(t*.012)),hz+H*.075,H*.0045,P,t);
    v3mist(P,t,hz,.14+P.night*.06); },
  fore(P,t){ const sw=Math.sin(t*.7)*.02; g.save(); g.translate(W*1.01,-H*.02); g.rotate(sw); for(let i=0;i<4;i++) v3pine(g,-W*.03-i*W*.012,H*.32-i*H*.01,H*.36,mix('#1a3424',P.top,P.night*.4),null,0); g.restore(); }
};
V3SCENES.keys={
  land(x,P,hz,cnv){
    for(const [ix,iw,ih] of [[.12,.12,.012],[.46,.08,.01],[.86,.14,.016]]){ x.fillStyle=mix(P.isl,P.farHaze,.35); x.beginPath(); x.ellipse(W*ix,hz,W*iw,H*ih,0,Math.PI,0); x.fill(); }
    for(const [px,hh,l] of [[.06,.08,.2],[.1,.1,-.15],[.82,.09,.1],[.9,.11,-.1]]) v3palm(x,W*px,hz-H*.008,H*hh,l,P,Math.round(px*100));
    // Cam's list #3: beaches along the keys (a pale sand line at the foot of each island, seen from the side)
    for(const [ix,iw] of [[.12,.12],[.46,.08],[.86,.14]]){ x.fillStyle=mix(P.sand,P.farHaze,.2+P.night*.45); x.beginPath(); x.ellipse(W*ix,hz,W*iw*1.04,H*.0045,0,Math.PI,0); x.fill(); }
    // Cam's list #3: the long road bridge between the keys, bigger: a flat concrete deck on piers with a hump in the middle for boats,
    // a guard rail along it; traffic drives along it (live layer below). Side view: deck, rail and piers, no top-down road
    { const N=c0=>mix(c0,P.farHaze,.28+P.night*.35), dk=H*.011, x0=W*.04, x1=W*.96;
      x.fillStyle=N('#8a8e94'); for(let i=0;i<=46;i++){ const px=x0+(x1-x0)*i/46, top=keysDeck(px,hz)+dk; x.fillRect(px-H*.0025,top,H*.005,hz-top); } /* piers down to the water */
      x.fillStyle=N('#dcdad4'); x.beginPath(); x.moveTo(x0,keysDeck(x0,hz)); for(let i=1;i<=60;i++){ const px=x0+(x1-x0)*i/60; x.lineTo(px,keysDeck(px,hz)); } for(let i=60;i>=0;i--){ const px=x0+(x1-x0)*i/60; x.lineTo(px,keysDeck(px,hz)+dk); } x.closePath(); x.fill();
      x.strokeStyle=N('#f4f2ee'); x.lineWidth=Math.max(1,H*.0016); x.beginPath(); for(let i=0;i<=60;i++){ const px=x0+(x1-x0)*i/60, py=keysDeck(px,hz)-H*.0035; i?x.lineTo(px,py):x.moveTo(px,py); } x.stroke(); /* the guard rail */
      x.fillStyle=N('#6a6e74'); x.fillRect(x0,keysDeck(x0,hz)+dk-H*.0015,x1-x0,H*.0015); }
    waMore('keys','shore',x,P,hz); v3water(x,P,hz,cnv,.3);
    // seagrass beds and sand patches seen through the shallow water
    { const r=v3rng(17); for(let i=0;i<14;i++){ const px=W*r(), py=hz+H*(.12+r()*.8), s=H*(.03+r()*.05); x.fillStyle=v3rgba(i%3?mix(P.sand,P.wMid,.5):mix('#3a7a4a',P.wMid,.5),.35); x.beginPath(); x.ellipse(px,py,s*2.2,s*.5,0,0,7); x.fill(); } } },
  live(P,t,hz,sun){ waMore('keys','live',null,P,hz,t); v3glitter(P,t,hz,sun); if(!S.settings.effects) return;
    // gulls
    if(P.night<.5) for(let i=0;i<3;i++){ const q=((t*.04+i*.33)%1), x=W*(-.05+q*1.1), y=hz*(.3+i*.12)+Math.sin(t+i)*6, f=Math.sin(t*5+i)*.6, s=H*.008; g.strokeStyle='rgba(250,250,250,.9)'; g.lineWidth=1.3; g.beginPath(); g.moveTo(x-s*2,y-s*f); g.quadraticCurveTo(x-s,y-s,x,y); g.quadraticCurveTo(x+s,y-s,x+s*2,y-s*f); g.stroke(); }
    // a pelican diving now and then
    { const per=16, q=(t%per)/per; if(q<.25){ const e=q/.25, x=W*.62, y=hz*.4+e*e*(hz*.62); g.fillStyle='rgba(120,110,100,.9)'; g.beginPath(); g.ellipse(x,y,H*.006,H*.016,.2,0,7); g.fill(); } else if(q<.32){ v3fxSplash&&0; const k=(q-.25)/.07; g.strokeStyle='rgba(255,255,255,'+(1-k)+')'; g.lineWidth=1.4; g.beginPath(); g.ellipse(W*.62,hz+2,H*.01+k*H*.03,H*.004+k*H*.008,0,0,7); g.stroke(); } } },
  fore(P,t){ g.save(); g.strokeStyle=mix('#4a3a2a',P.top,P.night*.4); g.lineWidth=H*.008; g.lineCap='round'; for(let i=0;i<6;i++){ const x0=W*(.9+i*.02); g.beginPath(); g.moveTo(x0,H); g.quadraticCurveTo(x0-W*.02,H*.86,x0+W*.01,H*.78-i*H*.01); g.stroke(); }
    g.fillStyle=mix('#2a6a3a',P.top,P.night*.5); for(let i=0;i<9;i++){ g.beginPath(); g.ellipse(W*(.9+((i*13)%7)*.014),H*(.72+((i*7)%5)*.012),W*.018,H*.01,(i-4)*.3,0,7); g.fill(); } g.restore(); }
};
/* AMAZON (Cam's list #4, 2026-11-21), every piece drawn from the side: a deep layered rainforest with tall emergent trees, the jungle cliff
   with ledges, moss and boulders, its waterfall ending in a foaming pool at the water line, a forested island that keeps the channel narrow,
   aerial roots and water plants along the banks; alive with dragonflies, butterflies, macaws, a caiman, a bullfrog, floating branches, and
   one moment at a time (the pink river dolphin, an anaconda swimming, a basilisk running on the water). */
function amzTree(x,base,h,crown,col,dk){ x.fillStyle=dk; x.fillRect(-h*.012+base[0],base[1]-h,h*.024,h); x.fillStyle=col; for(let i=0;i<5;i++){ const a=(i-2)/2; x.beginPath(); x.ellipse(base[0]+a*crown*.55,base[1]-h-crown*(.18-Math.abs(a)*.08),crown*.42,crown*.2,0,0,7); x.fill(); } }
V3SCENES.amazon={
  land(x,P,hz,cnv){ const N=(c0,k)=>mix(c0,P.farHaze,k+P.night*.3);
    // the deep rainforest: three layers of canopy, hazier with distance, with tall emergent trees standing above it
    wa.blob(x,hz,N(P.hill,.45),.1,5,34);
    { const r=v3rng(71); for(let i=0;i<7;i++){ const px=W*(.38+r()*.6), h=H*(.1+r()*.05); amzTree(x,[px,hz-H*.03],h,H*(.05+r()*.03),N('#3f6a3a',.42),N('#3a2e22',.45)); } }
    wa.blob(x,hz,N(P.hill,.25),.07,7,30); v3bushes(x,W*.3,W,hz-H*.022,H*.06,P,62,{leaf:N(P.hill,.12)});
    // the jungle cliff on the left: stepped rock ledges, moss, boulders at its foot
    const cx1=W*.34, top=hz-H*.2; x.fillStyle=mix(P.back,'#000000',.22); x.beginPath(); x.moveTo(0,hz+1); x.lineTo(0,top); x.quadraticCurveTo(W*.18,top-H*.03,cx1,top+H*.02); x.quadraticCurveTo(cx1+W*.025,top+H*.1,cx1+W*.03,hz+1); x.closePath(); x.fill();
    x.fillStyle=mix(P.back,'#000000',.4); for(const [y0,w0] of [[.05,.3],[.1,.26],[.145,.31]]){ x.fillRect(0,top+H*y0,W*w0,H*.006); } /* the ledges */
    x.fillStyle=mix(P.back,'#2a6a2a',.5); for(const [y0,w0] of [[.05,.3],[.1,.26],[.145,.31]]){ const r=v3rng(Math.round(y0*1000)); for(let i=0;i<10;i++){ const px=W*r()*w0; x.beginPath(); x.ellipse(px,top+H*y0,W*.01,H*.006,0,Math.PI,0); x.fill(); } } /* moss on the ledges */
    x.fillStyle=mix(P.back,'#000000',.3); for(const [bx,bs] of [[.2,.022],[.3,.03],[.33,.02],[.04,.025]]){ x.beginPath(); x.ellipse(W*bx,hz,H*bs*1.4,H*bs,0,Math.PI,0); x.fill(); } /* boulders at the water */
    v3bushes(x,0,cx1+W*.04,top+H*.02,H*.05,P,61,{leaf:P.back});
    // the waterfall: a curtain that ends at the water line in a foaming pool (it no longer runs past the water)
    { const fx=W*.24, fw=W*.05; const gr=x.createLinearGradient(0,top,0,hz); gr.addColorStop(0,v3rgba(mix('#ffffff',P.wTop,.25),.9)); gr.addColorStop(1,v3rgba(mix('#ffffff',P.wTop,.4),.7)); x.fillStyle=gr; x.beginPath(); x.moveTo(fx,top+H*.015); x.lineTo(fx+fw,top+H*.015); x.quadraticCurveTo(fx+fw*1.08,(top+hz)/2,fx+fw*1.12,hz); x.lineTo(fx-fw*.12,hz); x.quadraticCurveTo(fx-fw*.08,(top+hz)/2,fx,top+H*.015); x.fill();
      x.fillStyle=v3rgba('#ffffff',.85); for(let i=0;i<9;i++){ x.beginPath(); x.ellipse(fx-fw*.2+i*fw*.18,hz,fw*.16,H*.008,0,Math.PI,0); x.fill(); } }
    // the island that keeps the channel narrow (Cam: "keep the channels thinner"): sand, dense brush and two tall trees, its roots in the water
    { const ix0=W*.56, ix1=W*.98, ib=hz+H*.024; x.fillStyle=N('#8a7a52',.2); x.beginPath(); x.ellipse((ix0+ix1)/2,ib,(ix1-ix0)/2,H*.006,0,Math.PI,0); x.fill();
      v3bushes(x,ix0+W*.01,ix1-W*.01,ib-H*.004,H*.045,P,64,{leaf:mix(P.front,P.farHaze,.1)});
      amzTree(x,[W*.66,ib-H*.03],H*.11,H*.05,mix('#2f5a2a',P.farHaze,.12+P.night*.3),mix('#3a2a1c',P.farHaze,.15)); amzTree(x,[W*.88,ib-H*.03],H*.13,H*.06,mix('#2f5a2a',P.farHaze,.12+P.night*.3),mix('#3a2a1c',P.farHaze,.15));
      x.strokeStyle=mix('#4a3622',P.farHaze,.2+P.night*.3); x.lineWidth=Math.max(1,H*.0025); for(let i=0;i<14;i++){ const rx=ix0+W*.015+i*(ix1-ix0-W*.03)/13; x.beginPath(); x.moveTo(rx,ib-H*.012); x.quadraticCurveTo(rx-W*.008,ib-H*.004,rx-W*.004,ib+H*.003); x.stroke(); } } /* aerial roots into the water */
    // roots along the far bank
    { x.strokeStyle=mix('#3a2a1c',P.farHaze,.3+P.night*.3); x.lineWidth=Math.max(1,H*.002); for(let i=0;i<18;i++){ const rx=W*(.36+i*.012); x.beginPath(); x.moveTo(rx,hz-H*.01); x.quadraticCurveTo(rx+W*.006,hz-H*.004,rx+W*.003,hz+1); x.stroke(); } }
    waMore('amazon','shore',x,P,hz); v3water(x,P,hz,cnv,.32);
    // water plants: lily pads and water lettuce along the banks, clear of the fishing line
    { const r=v3rng(29); for(let i=0;i<16;i++){ const left=i<8, px=left?W*(.02+r()*.32):W*(.56+r()*.4), py=left?hz+H*(.006+r()*.02):hz+H*(.026+r()*.012), s=H*(.006+r()*.006);
        x.fillStyle=mix(i%3?'#3f8a3a':'#5aa040',P.wMid,.25+P.night*.4); x.beginPath(); x.ellipse(px,py,s*2,s*.45,0,.25,Math.PI*2-.25); x.lineTo(px,py); x.fill(); if(i%5===0){ x.fillStyle=mix('#f4a8c8',P.wMid,.2+P.night*.5); x.beginPath(); x.ellipse(px+s*.4,py-s*.4,s*.45,s*.35,0,0,7); x.fill(); } } } },
  live(P,t,hz,sun){ waMore('amazon','live',null,P,hz,t); const FX=S.settings.effects, top=hz-H*.2+H*.015;
    // falling water streaks and mist at the foot of the falls
    if(FX){ g.save(); g.globalAlpha=.6; g.strokeStyle='rgba(255,255,255,.7)'; g.lineWidth=1.2; for(let i=0;i<10;i++){ const x=W*(.243+i*.0045), q=((t*1.2+i*.37)%1), y=top+q*(hz-top-H*.03); g.beginPath(); g.moveTo(x,y); g.lineTo(x,y+H*.03); g.stroke(); } g.restore();
      for(let i=0;i<7;i++){ const q=((t*.3+i*.14)%1), x=W*.265+(i-3)*W*.012+q*W*.02, y=hz-q*H*.05; g.fillStyle='rgba(240,248,255,'+(.25*(1-q))+')'; g.beginPath(); g.arc(x,y,H*(.012+q*.02),0,7); g.fill(); } }
    v3glitter(P,t,hz,sun);
    const day=P.night<.5, s=H;
    // floating branches drifting slowly down the river (always), with a ripple where they touch the water
    for(let i=0;i<2;i++){ const q=((t*.008+i*.5)%1), bx=W*(1.05-q*.7), by=hz+H*(.012+i*.006); if(bx<W*.36) continue; g.strokeStyle=mix('#4a3420',P.wMid,.2+P.night*.5); g.lineWidth=Math.max(2,H*.004); g.beginPath(); g.moveTo(bx-H*.03,by); g.lineTo(bx+H*.03,by-H*.002); g.moveTo(bx+H*.01,by-H*.001); g.lineTo(bx+H*.02,by-H*.012); g.stroke(); if(FX) waRing(bx,by+1,H*.006,(t*.5+i)%1,.35); }
    // a caiman drifting by the far bank: eyes and snout above the water, sinking out of sight now and then
    { const q=(t%40)/40, up=q<.85?1:Math.max(0,1-(q-.85)/.06), cx=W*(.42+.06*Math.sin(t*.03)), cy=hz+H*.006; if(up>.05){ g.fillStyle=mix('#3a4a2a',P.wMid,.2+P.night*.5); g.globalAlpha=up; g.beginPath(); g.ellipse(cx,cy,H*.016,H*.0028*up,0,Math.PI,0); g.fill(); g.beginPath(); g.ellipse(cx+H*.02,cy,H*.0045,H*.004*up,0,Math.PI,0); g.fill(); g.fillStyle=P.night>.5?'#e8d070':'#2a2010'; g.fillRect(cx+H*.017,cy-H*.004*up,H*.002,H*.002); g.globalAlpha=1; } }
    // a bullfrog on a lily pad by the cliff, its throat puffing
    { const fx=W*.12, fy=hz+H*.014, fs=H*.006, puff=Math.max(0,Math.sin(t*1.7))*.5; g.fillStyle=mix('#5a7a2a',P.wMid,.15+P.night*.5); g.beginPath(); g.ellipse(fx,fy-fs*.8,fs*1.5,fs*.9,0,0,7); g.fill(); g.fillStyle=mix('#d8d098',P.wMid,.2+P.night*.5); g.beginPath(); g.ellipse(fx+fs*.9,fy-fs*.5,fs*.5*(1+puff),fs*.45*(1+puff),0,0,7); g.fill(); g.fillStyle='#1a1a10'; g.fillRect(fx+fs*.6,fy-fs*1.5,fs*.3,fs*.3); }
    if(FX&&day){
      // dragonflies: dart, hover, dart, low over the water in front of the falls and the island
      for(let i=0;i<3;i++){ const seg=Math.floor(t*.6+i*3.7), r=v3rng(seg*13+i), k=(t*.6+i*3.7)-seg, e=k<.25?k/.25:1, ax=W*(.3+r()*.5), ay=hz+H*(.01+r()*.05), r2=v3rng((seg-1)*13+i), px=W*(.3+r2()*.5), py=hz+H*(.01+r2()*.05), x=px+(ax-px)*(e*e*(3-2*e)), y=py+(ay-py)*(e*e*(3-2*e))+Math.sin(t*20+i)*1.2, d=ax>=px?1:-1, ds=H*.007;
        g.save(); g.translate(x,y); g.scale(d,1); g.strokeStyle=i===1?'#2a8ac8':'#c8402a'; g.lineWidth=Math.max(1.4,ds*.25); g.beginPath(); g.moveTo(-ds*1.6,0); g.lineTo(ds*.9,0); g.stroke(); g.fillStyle='rgba(220,240,255,.55)'; const fl=Math.abs(Math.sin(t*40+i)); for(const wx of [-.1,.35]){ g.beginPath(); g.ellipse(ds*wx,-ds*.35*fl,ds*.8,ds*.22,-.2,0,7); g.fill(); g.beginPath(); g.ellipse(ds*wx,ds*.3*fl,ds*.75,ds*.2,.2,0,7); g.fill(); } g.restore(); }
      // butterflies: blue morphos and an orange one, wings drawn as two pairs that flap
      for(let i=0;i<3;i++){ const bx=W*(.4+.18*Math.sin(t*.11+i*2.1))+i*W*.08, by=hz-H*(.05+.03*Math.sin(t*.37+i))+H*.015*i, bs=H*.008, f=Math.abs(Math.sin(t*8+i*1.3)), col=i===2?'#f08a20':'#3a8cff';
        g.save(); g.translate(bx,by); g.fillStyle=col; for(const sd of [-1,1]){ g.beginPath(); g.ellipse(sd*bs*.7*f,-bs*.35,bs*.9*f+.3,bs*.75,sd*.35,0,7); g.fill(); g.beginPath(); g.ellipse(sd*bs*.55*f,bs*.45,bs*.6*f+.2,bs*.5,-sd*.3,0,7); g.fill(); } g.fillStyle='#1a1a1a'; g.fillRect(-.6,-bs*.7,1.2,bs*1.4); g.restore(); }
      // macaws crossing the sky: red bodies, blue and yellow wings, long tails
      for(let i=0;i<2;i++){ const q=((t*.045+i*.5)%1), x=W*(1.06-q*1.18), y=hz*(.34+i*.16)+Math.sin(t*2+i)*6, ms=H*.011, f=Math.sin(t*7+i);
        g.save(); g.translate(x,y); g.fillStyle='#d8302a'; g.beginPath(); g.ellipse(0,0,ms*1.2,ms*.42,0,0,7); g.fill(); g.beginPath(); g.moveTo(ms*1,-ms*.1); g.lineTo(ms*3.2,ms*.15); g.lineTo(ms*1,ms*.25); g.fill(); g.fillStyle='#2a6ad8'; g.beginPath(); g.moveTo(-ms*.3,0); g.quadraticCurveTo(0,-ms*1.8*f,ms*.6,-ms*.1); g.fill(); g.fillStyle='#f0c830'; g.beginPath(); g.ellipse(-ms*.2,-ms*.5*f,ms*.45,ms*.18,0,0,7); g.fill(); g.fillStyle='#f4f0e0'; g.beginPath(); g.ellipse(-ms*1.15,-ms*.05,ms*.3,ms*.22,0,0,7); g.fill(); g.restore(); } }
    if(FX&&P.night>.3) for(let i=0;i<14;i++){ const x=W*(.36+((i*.173)%.6))+Math.sin(t*.7+i)*10, y=hz-H*.05+Math.sin(t*.9+i*2)*H*.03, a=P.night*(.5+.5*Math.sin(t*3+i*1.7)); v3glow(g,x,y,H*.012,'rgba(200,255,120,.9)',a*.6); }
    // one moment at a time, once a minute: the dolphin (WA_MORE), then an anaconda swimming, then a basilisk running on the water
    if(FX){ const m=t%60;
      if(m>=20&&m<32){ const e=(m-20)/12, sx=W*(.38+e*.42), sy=hz+H*.04; g.strokeStyle=mix('#4a5a28',P.wMid,.25+P.night*.45); g.lineWidth=Math.max(2,H*.006); g.lineCap='round'; g.beginPath(); for(let k=0;k<=24;k++){ const u=k/24, px=sx-u*W*.07, py=sy+Math.sin(u*9-t*4)*H*.004; k?g.lineTo(px,py):g.moveTo(px,py); } g.stroke(); g.fillStyle=g.strokeStyle; g.beginPath(); g.ellipse(sx+H*.004,sy-H*.002,H*.006,H*.0035,0,0,7); g.fill(); waRing(sx,sy+1,H*.006,(t*.8)%1,.4); waRing(sx-W*.04,sy+1,H*.005,(t*.8+.5)%1,.3); }
      if(m>=40&&m<43.5){ const e=(m-40)/3.5, lx=W*(.36+e*.5), ly=hz+H*.03, ls=H*.007, run=Math.sin(t*30); g.save(); g.translate(lx,ly-ls*.6); g.fillStyle=mix('#5a8a3a',P.wMid,.15+P.night*.5); g.beginPath(); g.ellipse(0,0,ls*1.2,ls*.45,-.35,0,7); g.fill(); g.beginPath(); g.moveTo(-ls,ls*.1); g.lineTo(-ls*3,ls*.4); g.lineTo(-ls,ls*.35); g.fill(); g.beginPath(); g.ellipse(ls*1,-ls*.45,ls*.45,ls*.3,0,0,7); g.fill(); g.strokeStyle=g.fillStyle; g.lineWidth=Math.max(1,ls*.25); g.beginPath(); g.moveTo(ls*.2,ls*.3); g.lineTo(ls*(.2+run*.5),ls*.9); g.moveTo(-ls*.3,ls*.3); g.lineTo(-ls*(.3+run*.5),ls*.9); g.stroke(); g.restore(); for(let k=0;k<4;k++){ const sp=((t*6+k*.25)%1); g.fillStyle='rgba(255,255,255,'+(.6*(1-sp))+')'; g.beginPath(); g.arc(lx-sp*W*.03,ly+1,H*.003*(1-sp)+1,0,7); g.fill(); } } } },
  fore(P,t){ g.save(); const col=mix('#1e4a1e',P.top,P.night*.5); g.strokeStyle=col; g.lineWidth=H*.005; for(let i=0;i<4;i++){ const x=W*(.82+i*.05), L=H*(.25+((i*7)%3)*.08), sw=Math.sin(t*.8+i)*W*.006; g.beginPath(); g.moveTo(x,0); g.quadraticCurveTo(x+sw,L*.5,x+sw*1.5,L); g.stroke(); g.fillStyle=col; for(let k=1;k<6;k++){ g.beginPath(); g.ellipse(x+sw*k/5,L*k/6,H*.012,H*.005,.5,0,7); g.fill(); } }
    g.fillStyle=mix('#2a6a2a',P.top,P.night*.5); for(const [x,y,r,a] of [[.98,.82,.09,-.6],[.92,.92,.08,-.2],[1,.66,.07,-1]]){ g.beginPath(); g.ellipse(W*x,H*y,W*r,H*r*.45,a,0,7); g.fill(); }
    /* poison dart frogs on the front leaves (Cam: "some bright, some stealthy"): a blue one and a red one, now and then a hop */
    for(const [fx,fy,c1,c2,ph] of [[.915,.885,'#2a7ae8','#101010',0],[.965,.79,'#e83a2a','#1a1a1a',2.4]]){ const hop=Math.max(0,Math.sin(t*.9+ph)-.96)*25, x=W*fx, y=H*fy-hop*H*.01, fs=H*.0075; g.fillStyle=mix(c1,P.top,P.night*.6); g.beginPath(); g.ellipse(x,y-fs*.6,fs*1.3,fs*.75,0,0,7); g.fill(); g.beginPath(); g.ellipse(x+fs*1.1,y-fs*.9,fs*.55,fs*.45,0,0,7); g.fill(); g.fillStyle=c2; for(const [dx,dy] of [[-.4,-.7],[.2,-.4],[-.1,-.9]]){ g.beginPath(); g.arc(x+dx*fs,y+dy*fs,fs*.18,0,7); g.fill(); } g.strokeStyle=g.fillStyle=mix(c1,P.top,P.night*.6); g.lineWidth=Math.max(1,fs*.3); g.beginPath(); g.moveTo(x-fs*.8,y-fs*.3); g.lineTo(x-fs*1.3,y+fs*.1); g.moveTo(x+fs*.6,y-fs*.2); g.lineTo(x+fs*.9,y+fs*.1); g.stroke(); }
    g.restore(); }
};
V3SCENES.farm={
  land(x,P,hz,cnv){
    wa.hills(x,hz,mix(P.hill,P.farHaze,.35),[[0,.06],[.2,.09],[.45,.05],[.7,.08],[1,.05]]); wa.hills(x,hz,P.hill,[[0,.03],[.3,.05],[.6,.025],[1,.04]]);
    // the red barn, the silo and a windmill tower (its blades turn in the live layer)
    { const bx=W*.62, bb=hz-H*.02, bw=H*.12, bh=H*.07, red=P.cabin; x.fillStyle=red; x.fillRect(bx,bb-bh,bw,bh); x.beginPath(); x.moveTo(bx-bw*.06,bb-bh); x.lineTo(bx+bw*.5,bb-bh-H*.04); x.lineTo(bx+bw*1.06,bb-bh); x.closePath(); x.fill();
      x.strokeStyle=mix('#ffffff',red,P.night*.6); x.lineWidth=Math.max(1,H*.003); x.strokeRect(bx+bw*.35,bb-bh*.7,bw*.3,bh*.7); x.beginPath(); x.moveTo(bx+bw*.35,bb-bh*.7); x.lineTo(bx+bw*.65,bb); x.moveTo(bx+bw*.65,bb-bh*.7); x.lineTo(bx+bw*.35,bb); x.stroke();
      x.fillStyle=mix('#c8c8d0',P.farHaze,P.night*.5); x.fillRect(bx+bw*1.1,bb-bh*1.5,bw*.28,bh*1.5); x.beginPath(); x.arc(bx+bw*1.24,bb-bh*1.5,bw*.14,Math.PI,0); x.fill();
      x.fillStyle=mix('#8a7a6a',P.farHaze,P.night*.4); x.beginPath(); x.moveTo(W*.86,bb); x.lineTo(W*.875,bb-H*.12); x.lineTo(W*.89,bb); x.closePath(); x.fill(); }
    // fence and hay bales
    x.fillStyle=mix('#d8c8a8',P.hill,.2+P.night*.5); for(let i=0;i<16;i++) x.fillRect(W*(.05+i*.028),hz-H*.03,2,H*.018); x.fillRect(W*.05,hz-H*.026,W*.42,1.5); x.fillRect(W*.05,hz-H*.02,W*.42,1.5);
    for(const px of [.2,.26,.48]){ x.fillStyle=mix('#e8c860',P.hill,P.night*.5); x.beginPath(); x.ellipse(W*px,hz-H*.012,H*.016,H*.012,0,0,7); x.fill(); }
    waMore('farm','shore',x,P,hz); v3water(x,P,hz,cnv,.36); },
  live(P,t,hz,sun){ waMore('farm','live',null,P,hz,t); v3glitter(P,t,hz,sun); const cx=W*.875, cy=hz-H*.02-H*.12, L=H*.05, a=t*.9; g.strokeStyle=mix('#f0e8d8','#303040',P.night*.6); g.lineWidth=Math.max(1.5,H*.004);
    for(let i=0;i<4;i++){ const an=a+i*Math.PI/2; g.beginPath(); g.moveTo(cx,cy); g.lineTo(cx+Math.cos(an)*L,cy+Math.sin(an)*L); g.stroke(); }
    if(S.settings.effects&&P.night<.6) for(let i=0;i<3;i++){ const q=((t*.05+i*.33)%1), x=W*(-.05+q*1.1), y=hz*(.25+i*.1), f=Math.sin(t*6+i)*.6, s=H*.006; g.strokeStyle='rgba(40,40,50,.7)'; g.lineWidth=1.2; g.beginPath(); g.moveTo(x-s*2,y-s*f); g.quadraticCurveTo(x-s,y-s,x,y); g.quadraticCurveTo(x+s,y-s,x+s*2,y-s*f); g.stroke(); } },
  fore(P,t){ g.save(); for(let i=0;i<3;i++){ const x=W*(.9+i*.04), y=H*(.62+i*.06), sw=Math.sin(t*.9+i)*3; g.strokeStyle=mix('#3a7a2a',P.top,P.night*.5); g.lineWidth=H*.006; g.beginPath(); g.moveTo(x,H); g.lineTo(x+sw,y); g.stroke();
    g.fillStyle=mix('#f8c820',P.top,P.night*.6); for(let k=0;k<10;k++){ const an=k/10*Math.PI*2; g.beginPath(); g.ellipse(x+sw+Math.cos(an)*H*.022,y+Math.sin(an)*H*.022,H*.014,H*.006,an,0,7); g.fill(); } g.fillStyle=mix('#5a3a1a',P.top,P.night*.5); g.beginPath(); g.arc(x+sw,y,H*.016,0,7); g.fill(); } g.restore(); }
};
V3SCENES.buffet={
  land(x,P,hz,cnv){
    // mashed potato mountains with gravy running down
    for(const [cx,w,h] of [[.2,.2,.16],[.52,.24,.2],[.85,.18,.13]]){ x.fillStyle=mix('#fff4dc',P.farHaze,.2+P.night*.5); x.beginPath(); x.moveTo(W*(cx-w),hz+1); x.quadraticCurveTo(W*(cx-w*.4),hz-H*h*1.3,W*cx,hz-H*h); x.quadraticCurveTo(W*(cx+w*.4),hz-H*h*1.3,W*(cx+w),hz+1); x.closePath(); x.fill();
      x.save(); x.beginPath(); x.moveTo(W*(cx-w),hz+1); x.quadraticCurveTo(W*(cx-w*.4),hz-H*h*1.3,W*cx,hz-H*h); x.quadraticCurveTo(W*(cx+w*.4),hz-H*h*1.3,W*(cx+w),hz+1); x.closePath(); x.clip(); const gv=mix('#9a5a24',P.farHaze,P.night*.5); x.fillStyle=gv; x.beginPath(); x.moveTo(W*(cx-w*.5),hz-H*h*.6); for(let k=0;k<=8;k++){ const u=k/8; x.lineTo(W*(cx-w*.5+u*w),hz-H*h*(.62+.06*Math.sin(u*9))+(k%2?H*h*.12:0)); } x.lineTo(W*(cx+w*.5),hz-H*h*1.4); x.lineTo(W*(cx-w*.5),hz-H*h*1.4); x.closePath(); x.fill(); x.fillStyle=v3rgba('#ffffff',.25*(1-P.night)); x.beginPath(); x.ellipse(W*(cx-w*.08),hz-H*h*.9,W*w*.08,H*h*.05,-.2,0,7); x.fill(); x.restore(); }
    // broccoli forest
    for(let i=0;i<10;i++){ const bx=W*(.05+i*.1), by=hz-H*.01, s=H*(.025+((i*7)%3)*.006); x.fillStyle=mix('#9ac868',P.front,P.night*.5); x.fillRect(bx-s*.15,by-s,s*.3,s); x.fillStyle=mix('#3a8a3a',P.front,P.night*.5); for(const [dx,dy] of [[-.5,-1],[.5,-1],[0,-1.4],[-.3,-1.6],[.3,-1.6]]){ x.beginPath(); x.arc(bx+dx*s,by+dy*s,s*.5,0,7); x.fill(); } }
    // a giant layer cake on the right shore
    { const cx=W*.72, cb=hz-H*.01, cw=H*.1; for(let k=0;k<3;k++){ x.fillStyle=k%2?mix('#f8e0e8',P.farHaze,P.night*.5):mix('#8a4a2a',P.farHaze,P.night*.5); x.fillRect(cx-cw*(1-k*.25)/2,cb-H*.02*(k+1),cw*(1-k*.25),H*.02); } x.fillStyle='#d8302a'; x.beginPath(); x.arc(cx,cb-H*.065,H*.008,0,7); x.fill(); }
    waMore('buffet','shore',x,P,hz); v3water(x,P,hz,cnv,.3); },
  live(P,t,hz,sun){ waMore('buffet','live',null,P,hz,t); v3glitter(P,t,hz,sun); if(!S.settings.effects) return;
    for(let i=0;i<6;i++){ const q=((t*.2+i*.17)%1), x=W*(.15+i*.14)+Math.sin(t+i)*6, y=hz+H*.02-q*H*.12; g.fillStyle='rgba(255,255,255,'+(.22*(1-q))+')'; g.beginPath(); g.arc(x,y,H*(.008+q*.015),0,7); g.fill(); } /* steam off the soup */
    const cols=['#ff5a8a','#5ac8ff','#ffd83a','#8aff6a','#c87aff']; for(let i=0;i<16;i++){ const per=7+(i%4), q=((t+i*1.3)%per)/per, x=W*((i*.173)%1), y=q*hz*.95; g.save(); g.translate(x,y); g.rotate(t*3+i); g.fillStyle=cols[i%5]; g.fillRect(-2.5,-.8,5,1.6); g.restore(); } },
  fore(P,t){ g.save(); g.translate(W*.97,H*.98); g.rotate(-.5+Math.sin(t*.5)*.02); g.fillStyle=mix('#d8dce4',P.top,P.night*.5); g.fillRect(-H*.012,-H*.42,H*.024,H*.3); for(let k=0;k<4;k++) g.fillRect(-H*.03+k*H*.02,-H*.5,H*.008,H*.1); g.fillRect(-H*.032,-H*.42,H*.064,H*.02); g.restore(); }
};
V3SCENES.corporate={
  land(x,P,hz,cnv){ const r=v3rng(9);
    for(let layer=0;layer<2;layer++) for(let i=0;i<14;i++){ const bw=W*(.04+r()*.04), bx=W*(i/13)-bw/2+(r()-.5)*W*.03, bh=H*(layer?(.08+r()*.14):(.1+r()*.2)), col=layer?mix(P.front,'#9ab0c8',.3*(1-P.night)):mix(P.far,P.farHaze,.4);
      x.fillStyle=col; x.fillRect(bx,hz-bh,bw,bh); x.fillStyle=v3rgba(layer?'#cfe0f0':'#e0ecf8',.12*(1-P.night)); x.fillRect(bx+bw*.55,hz-bh,bw*.45,bh);
      if(layer){ const lit=P.night>.3; for(let wy=hz-bh+4;wy<hz-4;wy+=6) for(let wx=bx+3;wx<bx+bw-3;wx+=5) if(r()<(lit?.45:.15)){ x.fillStyle=lit?'rgba(255,224,150,.85)':'rgba(220,235,250,.35)'; x.fillRect(wx,wy,2.4,3); } } }
    x.fillStyle=mix('#1a2028',P.front,.3); x.fillRect(0,hz-H*.03,W,H*.012); /* the ticker band (text drawn live) */
    v3water(x,P,hz,cnv,.45); },
  live(P,t,hz,sun){ waMore('corporate','live',null,P,hz,t); v3glitter(P,t,hz,sun); const y=hz-H*.03, txt='DRFT ▲2.4%  KOI ▼0.8%  TUNA ▲11.2%  CARP ▲0.3%  BASS ▼1.9%  SNAPR ▲4.0%  EEL ▲6.6%  ', fs=Math.max(8,H*.011);
    g.save(); g.beginPath(); g.rect(0,y,W,H*.012); g.clip(); g.font='700 '+fs+'px system-ui'; g.textBaseline='middle'; const tw=g.measureText(txt).width||1, off=-(t*40)%tw; for(let k=0;off+k*tw<W;k++){ let xx=off+k*tw; for(const part of txt.split('  ')){ g.fillStyle=/▼/.test(part)?'#ff6a5a':'#5aff8a'; g.fillText(part,xx,y+H*.006); xx+=g.measureText(part+'  ').width; } } g.restore(); },
  fore(P,t){ g.save(); const x=W*.95, b=H; g.fillStyle=mix('#d8d8dc',P.top,P.night*.5); g.beginPath(); g.moveTo(x-H*.04,b); g.lineTo(x-H*.032,b-H*.07); g.lineTo(x+H*.032,b-H*.07); g.lineTo(x+H*.04,b); g.fill();
    g.fillStyle=mix('#3a8a4a',P.top,P.night*.5); for(let i=0;i<7;i++){ const a=-Math.PI/2+(i-3)*.32+Math.sin(t*.6+i)*.04; g.beginPath(); g.ellipse(x+Math.cos(a)*H*.06,b-H*.07+Math.sin(a)*H*.06,H*.05,H*.012,a,0,7); g.fill(); } g.restore(); }
};
V3SCENES.nile={
  land(x,P,hz,cnv){
    wa.hills(x,hz,mix(P.sand,P.farHaze,.35),[[0,.03],[.25,.05],[.5,.03],[.75,.045],[1,.03]]);
    // pyramids and the sphinx
    for(const [px,s] of [[.24,.16],[.34,.11],[.42,.07]]){ const b=hz-H*.01, h=H*s; x.fillStyle=mix(P.sand,P.farHaze,.15); x.beginPath(); x.moveTo(W*px-h,b); x.lineTo(W*px,b-h); x.lineTo(W*px+h,b); x.closePath(); x.fill(); x.fillStyle=mix(P.sandD,P.farHaze,.15); x.beginPath(); x.moveTo(W*px,b-h); x.lineTo(W*px+h,b); x.lineTo(W*px+h*.25,b); x.closePath(); x.fill(); }
    { const sx=W*.6, sb=hz-H*.008, s=H*.02; x.fillStyle=mix(P.sandD,P.farHaze,.2); x.fillRect(sx-s*3,sb-s*1.1,s*4.4,s*1.1); x.beginPath(); x.moveTo(sx+s*.6,sb-s*1.1); x.lineTo(sx+s*.9,sb-s*2.6); x.lineTo(sx+s*1.9,sb-s*2.4); x.lineTo(sx+s*1.9,sb-s*1.1); x.closePath(); x.fill(); x.fillRect(sx+s*1.4,sb-s*.6,s*1.6,s*.6); }
    for(const [px,hh,l] of [[.07,.1,.12],[.12,.08,-.1],[.78,.09,.1],[.9,.11,-.12]]) v3palm(x,W*px,hz-H*.006,H*hh,l,P,Math.round(px*100)+7);
    v3reeds(x,W*.68,W*.76,hz+H*.005,H*.035,mix('#6a8a3a',P.front,P.night*.5),73);
    waMore('nile','shore',x,P,hz); v3water(x,P,hz,cnv,.36); waMore('nile','water',x,P,hz); },
  live(P,t,hz,sun){ waMore('nile','live',null,P,hz,t); v3glitter(P,t,hz,sun);
    // a felucca sailing slowly across
    { const per=80, q=(t%per)/per, x=W*(-.1+q*1.2), y=hz+H*.03, s=H*.03; g.fillStyle=mix('#5a3a2a','#202030',P.night*.6); g.beginPath(); g.moveTo(x-s*1.2,y); g.lineTo(x+s*1.2,y); g.lineTo(x+s*.9,y+s*.3); g.lineTo(x-s*.9,y+s*.3); g.closePath(); g.fill();
      g.fillStyle=mix('#f8f0e0','#6a6a80',P.night*.6); g.beginPath(); g.moveTo(x,y-s*.05); g.lineTo(x-s*.2,y-s*2.2); g.lineTo(x+s*1.1,y-s*.4); g.closePath(); g.fill(); }
    if(S.settings.effects&&P.night<.4){ g.save(); g.globalAlpha=.05; g.fillStyle='#fff8e0'; for(let i=0;i<3;i++){ const y=hz-H*(.01+i*.012)+Math.sin(t*2+i)*1.5; g.fillRect(0,y,W,H*.004); } g.restore(); } },
  fore(P,t){ v3reeds(g,W*.88,W,H*1.01,H*.2,mix('#4a7a2a',P.top,P.night*.5),91,{sway:Math.sin(t*.8)*.04}); }
};
V3SCENES.circuit={
  sky(P,t,hz){ const r=H*.06, x=W*.8, y=hz*.3; g.save(); g.globalAlpha=.55+.15*Math.sin(t*2); g.strokeStyle='#ff6ad8'; g.lineWidth=1.5; g.beginPath(); g.arc(x,y,r,0,7); g.stroke(); for(let i=-3;i<=3;i++){ g.beginPath(); g.moveTo(x-Math.sqrt(Math.max(0,r*r-(i*r/4)**2)),y+i*r/4); g.lineTo(x+Math.sqrt(Math.max(0,r*r-(i*r/4)**2)),y+i*r/4); g.globalAlpha=.25; g.stroke(); } g.restore(); },
  land(x,P,hz,cnv){ const r=v3rng(31), neon=['#3af0ff','#ff3ab8','#b8ff3a','#ffd03a'];
    for(let i=0;i<22;i++){ const bw=W*(.03+r()*.035), bx=W*(i/21)-bw/2, bh=H*(.06+r()*.2); x.fillStyle=mix('#140a24',P.far,.3); x.fillRect(bx,hz-bh,bw,bh); x.strokeStyle=v3rgba(neon[i%4],.55); x.lineWidth=1; x.strokeRect(bx+.5,hz-bh+.5,bw-1,bh-1);
      for(let wy=hz-bh+4;wy<hz-3;wy+=5) for(let wx=bx+2;wx<bx+bw-2;wx+=4) if(r()<.3){ x.fillStyle=v3rgba(neon[(i+wy|0)%4],.6); x.fillRect(wx,wy,2,2); } }
    v3water(x,P,hz,cnv,.5);
    x.strokeStyle='rgba(58,240,255,.18)'; x.lineWidth=1; for(let i=0;i<12;i++){ const y=hz+(H-hz)*Math.pow(i/12,1.6); x.beginPath(); x.moveTo(0,y); x.lineTo(W,y); x.stroke(); } for(let i=-10;i<=10;i++){ x.beginPath(); x.moveTo(W/2+i*W*.02,hz); x.lineTo(W/2+i*W*.12,H); x.stroke(); } },
  live(P,t,hz,sun){ waMore('circuit','live',null,P,hz,t); if(!S.settings.effects) return; const neon=['#3af0ff','#ff3ab8','#b8ff3a'];
    for(let i=0;i<4;i++){ const q=((t*(.08+i*.02)+i*.25)%1), x=W*(-.05+q*1.1)*(i%2?1:-1)+(i%2?0:W), y=hz*(.45+i*.1); g.fillStyle=neon[i%3]; g.fillRect(x,y,6,2); v3glow(g,x+3,y+1,10,'rgba(255,255,255,.8)',.25); }
    for(let i=0;i<3;i++){ const on=Math.sin(t*(3+i)+i*2)>-.3; if(!on) continue; const x=W*(.15+i*.3), y=hz-H*(.12+i*.03); g.fillStyle=neon[i]; g.globalAlpha=.85; g.fillRect(x,y,W*.04,H*.008); g.globalAlpha=1; v3glow(g,x+W*.02,y,H*.04,'rgba(255,120,220,.6)',.25); } },
  fore(P,t){ g.save(); g.strokeStyle='#ff3ab8'; g.globalAlpha=.6+.2*Math.sin(t*3); g.lineWidth=2; g.beginPath(); g.moveTo(W,H*.55); g.quadraticCurveTo(W*.93,H*.7,W*.96,H); g.stroke(); g.strokeStyle='#3af0ff'; g.beginPath(); g.moveTo(W,H*.6); g.quadraticCurveTo(W*.95,H*.78,W*.985,H); g.stroke(); g.restore(); }
};
V3SCENES.olympus={
  land(x,P,hz,cnv){
    v3range(x,{seed:77, base:hz+1, amp:.24*H, massifs:[[.5,1,.1]], light:mix(P.far,'#ffffff',.4), shadow:mix(P.far,'#3a3a5a',.3), haze:P.farHaze, snow:P.snow, snowLine:hz-.18*H, hazeA:.4});
    // the temple on the peak
    { const tx=W*.5, tb=hz-H*.215, tw=H*.09, col=mix('#fbf6ec',P.farHaze,P.night*.5); x.fillStyle=col; x.fillRect(tx-tw/2,tb-H*.006,tw,H*.006); for(let k=0;k<6;k++) x.fillRect(tx-tw/2+tw*(k/5)*.94,tb-H*.04,tw*.06,H*.034); x.fillRect(tx-tw*.55,tb-H*.046,tw*1.1,H*.007); x.beginPath(); x.moveTo(tx-tw*.55,tb-H*.046); x.lineTo(tx,tb-H*.066); x.lineTo(tx+tw*.55,tb-H*.046); x.closePath(); x.fill(); }
    // a sea of clouds at the foot of the mountain
    /* C35 polish: two banks of rounded cloud, the back one hazier, each puff lit on top and shaded underneath */
    { const r=v3rng(23), base=mix('#ffffff',P.farHaze,.2+P.night*.5); for(let row=0;row<2;row++){ const n=row?22:16, col=row?base:mix(base,P.farHaze,.35), shd=mix(col,'#7a7aa8',.28), hi=mix(col,'#ffffff',.6), y0=hz-H*(row?.004:.03);
      for(let i=0;i<n;i++){ const cx=W*(i/(n-1))+(r()-.5)*W*.03, rr=H*(row?.028:.036)*(.75+r()*.6); x.fillStyle=shd; x.beginPath(); x.ellipse(cx,y0,rr*1.25,rr,0,Math.PI,0); x.fill(); x.fillStyle=col; x.beginPath(); x.ellipse(cx-rr*.12,y0-rr*.1,rr*1.12,rr*.88,0,Math.PI,0); x.fill(); x.fillStyle=v3rgba(hi,.55*(1-P.night*.6)); x.beginPath(); x.ellipse(cx-rr*.35,y0-rr*.55,rr*.45,rr*.22,-.3,0,7); x.fill(); } } }
    waMore('olympus','shore',x,P,hz); v3water(x,P,hz,cnv,.4); },
  live(P,t,hz,sun){ waMore('olympus','live',null,P,hz,t); v3glitter(P,t,hz,sun); if(!S.settings.effects) return;
    for(let i=0;i<10;i++){ const x=W*(.3+((i*.137)%.4)), y=hz-H*(.05+((i*.29)%.2))+Math.sin(t+i)*4, a=.5+.5*Math.sin(t*2+i*1.7); g.fillStyle='rgba(255,220,120,'+(.7*a)+')'; g.fillRect(x,y,1.6,1.6); }
    { const per=11, q=(t%per)/per; if(q<.05){ const k=q/.05; g.save(); g.strokeStyle='rgba(255,250,210,'+(1-k)+')'; g.lineWidth=2.2; g.beginPath(); let x=W*.68, y=0; g.moveTo(x,y); for(let i=0;i<6;i++){ x+=((i*37)%7-3)*6; y+=hz*.12; g.lineTo(x,y); } g.stroke(); g.fillStyle='rgba(255,255,240,'+(.08*(1-k))+')'; g.fillRect(0,0,W,H); g.restore(); } } },
  fore(P,t){ g.save(); const x=W*.955, col=mix('#f4efe4',P.top,P.night*.5); g.fillStyle=col; g.fillRect(x-H*.03,H*.3,H*.06,H*.7); g.fillStyle=mix(col,'#000000',.12); for(let k=0;k<3;k++) g.fillRect(x-H*.02+k*H*.016,H*.3,H*.004,H*.7); g.fillStyle=col; g.fillRect(x-H*.042,H*.28,H*.084,H*.025);
    g.fillStyle=mix('#4a8a3a',P.top,P.night*.5); for(let i=0;i<8;i++){ const a=i*.45+Math.sin(t*.6)*.05; g.beginPath(); g.ellipse(x-H*.04+i*H*.012,H*.27-Math.sin(i*.8)*H*.008,H*.012,H*.005,a,0,7); g.fill(); } g.restore(); }
};
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
const WA_MORE={
  keys:{
    shore(x,P,hz){ const N=c0=>mix(c0,P.farHaze,.3+P.night*.4);
      for(const [ix,iw] of [[.12,.12],[.86,.14]]){ x.fillStyle=N('#1e5a34'); for(let i=0;i<9;i++){ const u=i/8; x.beginPath(); x.ellipse(W*(ix-iw*.8+u*iw*1.6),hz-H*.008,W*.012,H*.008,0,Math.PI,0); x.fill(); } }
      const lx=W*.885, lb=hz-H*.014, lh=H*.085, lw=H*.012; for(let i=0;i<5;i++){ x.fillStyle=N(i%2?'#c8302a':'#f4f0ea'); x.beginPath(); x.moveTo(lx-lw*(1-i*.08),lb-i*lh/5); x.lineTo(lx-lw*(1-(i+1)*.08),lb-(i+1)*lh/5); x.lineTo(lx+lw*(1-(i+1)*.08),lb-(i+1)*lh/5); x.lineTo(lx+lw*(1-i*.08),lb-i*lh/5); x.fill(); }
      x.fillStyle=N('#2a2a30'); x.fillRect(lx-lw*.75,lb-lh-H*.004,lw*1.5,H*.004); x.fillStyle=P.night>.3?'#fff0b0':N('#cfe8f0'); x.fillRect(lx-lw*.5,lb-lh-H*.016,lw,H*.012); x.fillStyle=N('#2a2a30'); x.beginPath(); x.moveTo(lx-lw*.7,lb-lh-H*.016); x.lineTo(lx,lb-lh-H*.026); x.lineTo(lx+lw*.7,lb-lh-H*.016); x.fill(); },
    live(x,P,hz,t){ const FX=S.settings.effects;
      /* Cam's list #3: traffic on the bridge, both ways (cars and minivans, now and then a box truck or a semi); each fades in and out at the
         bridge's ends behind the keys' trees, never popping up in the open */
      { const x0=W*.04, x1=W*.96, span=x1-x0, KINDS=['car','van','car','box','car','semi','car','van'], COLS=['#c8302a','#2a5a9a','#f0f0ec','#1f6a4a','#d8a020','#3a3a42','#8a2a6a','#e86a2a'];
        for(let i=0;i<8;i++){ const dir=i%2?-1:1, v=W*(.018+((i*37)%11)*.0016)*(KINDS[i]==='semi'||KINDS[i]==='box'?.8:1), per=span/v+4+(i%3)*3, q=((t+i*9.3)%per)*v/span;
          if(q>1) continue; const px=dir>0?x0+q*span:x1-q*span, a=Math.min(1,Math.min(px-x0,x1-px)/(W*.05)); if(a<=0) continue; keysVehicle(px,keysDeck(px,hz)-(dir>0?H*.0012:0),dir,KINDS[i],COLS[i],P,a); } }
      /* Cam's list #3: a speedboat now and then, and sport-fishing boats ripping by on the far water */
      { const runs=[[41,'speed',-1,.034,7],[57,'sport',1,.044,9.5],[73,'speed',1,.05,6]]; for(const [per,kind,dir,dy,dur] of runs){ const q=(t%per); if(q>dur) continue; const e=q/dur, px=dir>0?W*(-.08+e*1.16):W*(1.08-e*1.16); keysFastBoat(px,hz+H*dy,H*(kind==='sport'?.0085:.0072),dir,kind,P,t); } }
      /* Cam's list #3: a school of fish under the water, deep in the foreground on the right, clear of the line and the fishing area */
      if(FX){ const cx=W*(.7+.18*Math.sin(t*.05)), cy=H*(.84+.03*Math.sin(t*.09)), dirx=Math.cos(t*.05)>=0?1:-1; g.save(); g.fillStyle='rgba(20,60,70,'+(.22-P.night*.1)+')';
        for(let i=0;i<14;i++){ const a=i*2.4, r=H*(.012+.004*(i%4)), fx=cx+Math.cos(a+t*.6)*r*2.6, fy=cy+Math.sin(a*1.3+t*.5)*r*.9, s=H*.0065; g.beginPath(); g.ellipse(fx,fy,s*1.6,s*.55,0,0,7); g.fill(); g.beginPath(); g.moveTo(fx-dirx*s*1.5,fy); g.lineTo(fx-dirx*s*2.4,fy-s*.6); g.lineTo(fx-dirx*s*2.4,fy+s*.6); g.fill(); } g.restore(); }
      { const q=((t*.006)%1), sx=W*(.25+.5*(.5+.5*Math.sin(q*Math.PI*2))), sy=hz+H*.035, s=H*.012, N=c0=>mix(c0,P.wMid,P.night*.55); g.fillStyle=N('#f4f0ea'); g.beginPath(); g.moveTo(sx-s*1.6,sy); g.lineTo(sx+s*1.6,sy); g.lineTo(sx+s*1.2,sy+s*.5); g.lineTo(sx-s*1.2,sy+s*.5); g.fill(); g.beginPath(); g.moveTo(sx,sy-s*.1); g.lineTo(sx,sy-s*3.2); g.lineTo(sx+s*1.5,sy-s*.3); g.fill(); g.fillStyle=N('#e8e0d0'); g.beginPath(); g.moveTo(sx-s*.15,sy-s*.2); g.lineTo(sx-s*.15,sy-s*2.6); g.lineTo(sx-s*1.3,sy-s*.3); g.fill(); }
      if(P.night>.3){ const lx=W*.885, ly=hz-H*.014-H*.085-H*.01, a=t*.8, len=W*.35; for(const d of [0,Math.PI]){ const an=a+d, dx=Math.cos(an); if(dx*dx<.02) continue; const gr=g.createLinearGradient(lx,ly,lx+dx*len,ly); gr.addColorStop(0,'rgba(255,240,180,'+(.35*P.night)+')'); gr.addColorStop(1,'rgba(255,240,180,0)'); g.fillStyle=gr; g.beginPath(); g.moveTo(lx,ly); g.lineTo(lx+dx*len,ly-H*.03*Math.abs(dx)); g.lineTo(lx+dx*len,ly+H*.03*Math.abs(dx)); g.closePath(); g.fill(); } }
      if(FX){ const q=(t%29)/29; if(q<.12){ const e=q/.12; for(let i=0;i<2;i++){ const ee=e-i*.18; if(ee<0||ee>1) continue; const y=hz+H*.1, s=H*.01; waLeaper(W*(.58+i*.03),y,s,ee,mix('#7a8ea0',P.wMid,P.night*.5)); if(ee<.12||ee>.88) waRing(W*.58+(ee<.5?-1:1)*s*7+i*W*.03,y,s,ee<.5?ee/.12:(ee-.88)/.12,.8); } } } } },
  amazon:{
    shore(x,P,hz){ const N=c0=>mix(c0,P.front,.15+P.night*.55);
      for(const [px,s,d] of [[.66,H*.0055,1],[.7,H*.0045,-1],[.73,H*.005,1]]){ const cx=W*px, cy=hz-H*.003; x.fillStyle=N('#8a5a32'); x.beginPath(); x.ellipse(cx,cy-s*1.5,s*2.4,s*1.4,0,0,7); x.fill(); x.beginPath(); x.ellipse(cx+d*s*2.3,cy-s*2,s*1.2,s*1,0,0,7); x.fill(); x.fillStyle=N('#5a3a20'); x.fillRect(cx-s*1.6,cy-s*.4,s*.5,s*.4); x.fillRect(cx+s*1.1,cy-s*.4,s*.5,s*.4); x.fillStyle='#140c08'; x.fillRect(cx+d*s*2.6,cy-s*2.4,s*.3,s*.3); }
      { const tx=W*.14, ty=hz-H*.2+H*.005, s=H*.006; x.fillStyle=N('#141414'); x.beginPath(); x.ellipse(tx,ty-s*1.6,s*1,s*1.7,.2,0,7); x.fill(); x.fillStyle=N('#f8f0d8'); x.beginPath(); x.ellipse(tx+s*.4,ty-s*2.6,s*.6,s*.5,0,0,7); x.fill(); x.fillStyle=N('#f08a20'); x.beginPath(); x.moveTo(tx+s*.7,ty-s*3); x.quadraticCurveTo(tx+s*3.2,ty-s*3.1,tx+s*3,ty-s*2.2); x.lineTo(tx+s*.8,ty-s*2.4); x.fill(); x.fillStyle=N('#5a3a20'); x.fillRect(tx-s*2,ty,s*5,s*.4); } },
    live(x,P,hz,t){ const FX=S.settings.effects;
      { const q=(t%60)/60; if(q<.055){ const e=q/.055, /* the dolphin is the minute's first moment (then the anaconda, then the basilisk) */ y=hz+H*.12, s=H*.006, up=Math.sin(e*Math.PI); g.save(); g.beginPath(); g.rect(0,0,W,y); g.clip(); g.fillStyle=mix('#f0a0b0',P.wMid,.15+P.night*.5); g.beginPath(); g.ellipse(W*.55+e*W*.03,y+s*2*(1-up),s*3,s*1.6*up+.1,0,Math.PI,0); g.fill(); g.beginPath(); g.ellipse(W*.55+e*W*.03+s*3,y-s*.6*up+s*2*(1-up),s*1.4,s*.6*up+.05,.1,0,7); g.fill(); g.restore(); if(FX) waRing(W*.55+e*W*.03,y+1,s,e,.5); } } } },
  farm:{
    shore(x,P,hz){ const road=mix('#d8c090',P.hill,.3+P.night*.5); x.strokeStyle=road; x.lineWidth=H*.006; x.beginPath(); x.moveTo(0,hz-H*.034); x.bezierCurveTo(W*.3,hz-H*.044,W*.6,hz-H*.03,W,hz-H*.04); x.stroke();
      for(const [px,sh,d] of [[.12,0,1],[.18,1,1],[.22,1,-1],[.33,0,-1],[.4,1,1],[.53,0,1],[.95,1,-1]]){ x.save(); x.translate(W*px,hz-H*.012); x.scale(d,1); waCow(x,0,0,H*.0042,P,!!sh); x.restore(); } },
    live(x,P,hz,t){ const FX=S.settings.effects;
      /* map standard (2026-11-21), life after dark: fireflies over the field by the fence, and a barn owl gliding low over the fields now and then */
      if(FX&&P.night>.3) for(let i=0;i<10;i++){ const fx=W*(.06+((i*.137)%.42))+Math.sin(t*.6+i)*W*.008, fy=hz-H*(.03+((i*7)%5)*.006)+Math.sin(t*.8+i*2)*H*.006, a=P.night*(.5+.5*Math.sin(t*2.6+i*1.9)); v3glow(g,fx,fy,H*.01,'rgba(220,255,140,.9)',a*.55); }
      if(P.night>.5){ const q=(t%34)/34; if(q<.4){ const e=q/.4, ox=W*(1.06-e*1.14), oy=hz-H*(.19+.03*Math.sin(e*Math.PI*2)), s=H*.0065; v3owlFly(ox,oy,s,t,mix('#e8dcc0',P.hill,.45),mix('#d8c8a0',P.hill,.4),mix('#fff8ec',P.hill,.3),'#1a1410'); } }
      for(let i=0;i<2;i++){ const ph=t*.02+i*2.6, y=hz+H*(.05+i*.05); waDuck(W*(.5+.25*Math.sin(ph)),y,H*(.006+waK(y,hz)*.012),Math.cos(ph)>=0?1:-1,P,t,i,false); }
      { const q=(t%55)/55; if(q<.4){ const e=q/.4, tx=W*(-.05+e*1.1), ty=hz-H*.038-Math.sin(e*3.1)*H*.004, s=H*.0045, N=c0=>mix(c0,P.hill,P.night*.55); g.fillStyle=N('#2a8a3a'); g.fillRect(tx-s*2,ty-s*2.2,s*3.2,s*1.4); g.fillRect(tx-s*.4,ty-s*4,s*1.6,s*1.9); g.fillStyle=N('#bfe0f0'); g.fillRect(tx-s*.1,ty-s*3.7,s*1,s*1); g.fillStyle=N('#1a1a1a'); g.beginPath(); g.arc(tx-s*1.2,ty-s*.9,s*1.1,0,7); g.moveTo(tx+s*1.6,ty-s*.6); g.arc(tx+s*1,ty-s*.6,s*.6,0,7); g.fill(); if(S.settings.effects){ g.fillStyle='rgba(90,90,90,.35)'; g.beginPath(); g.arc(tx+s*1.5,ty-s*5-((t*2)%1)*s*2,s*.6,0,7); g.fill(); } } } } },
  buffet:{
    shore(x,P,hz){ const N=c0=>mix(c0,P.farHaze,.15+P.night*.5); x.fillStyle=N('#c8ccd8'); x.save(); x.translate(W*.56,hz-H*.16); x.rotate(.25); x.fillRect(-H*.004,0,H*.008,H*.08); for(let k=0;k<4;k++) x.fillRect(-H*.012+k*H*.008,-H*.03,H*.004,H*.032); x.fillRect(-H*.013,-H*.002,H*.026,H*.006); x.restore();
      const r=v3rng(5); x.fillStyle=N('#5aa83a'); for(let i=0;i<14;i++){ x.beginPath(); x.arc(W*(.3+r()*.6),hz-H*.004+r()*H*.006,H*.004,0,7); x.fill(); } },
    live(x,P,hz,t){ const FX=S.settings.effects, N=c0=>mix(c0,P.farHaze,P.night*.5);
      /* map standard (2026-11-21), life on the lake: a gummy bear rows a cracker across the far water, oars dipping, a little wake behind */
      { const per=96, q=(t%per)/per; if(q<.85){ const e=q/.85, rx=W*(1.06-e*1.12), ry=hz+H*.045+Math.sin(t*1.3)*H*.0015, s=H*.009, ro=Math.sin(t*2.2), M=c0=>mix(c0,P.wMid,.1+P.night*.5);
        g.fillStyle=M('#e0b060'); g.fillRect(rx-s*3,ry-s*.7,s*6,s*.9); g.fillStyle=M('#c89040'); for(let k=0;k<5;k++) g.fillRect(rx-s*2.4+k*s*1.2,ry-s*.45,1.2,1.2); /* the cracker, side on, with its holes */
        g.fillStyle=v3rgba(M('#ff4a5a'),.9); g.beginPath(); g.ellipse(rx,ry-s*1.9,s*1,s*1.25,0,0,7); g.fill(); g.beginPath(); g.arc(rx-s*.3,ry-s*3.5,s*.75,0,7); g.fill(); g.beginPath(); g.arc(rx-s*.05,ry-s*4.2,s*.28,0,7); g.fill(); /* body, head, ear */
        g.fillStyle='rgba(255,255,255,.4)'; g.beginPath(); g.ellipse(rx-s*.4,ry-s*2.3,s*.25,s*.5,-.3,0,7); g.fill(); g.fillStyle='#401018'; g.fillRect(rx-s*.85,ry-s*3.65,1.3,1.3);
        g.strokeStyle=M('#8a5a2a'); g.lineWidth=Math.max(1,s*.25); g.beginPath(); g.moveTo(rx-s*.4,ry-s*2); g.lineTo(rx+s*(1.6+ro*.9),ry+s*(.5-ro*.3)); g.stroke();
        if(FX){ g.strokeStyle=v3rgba(mix(P.wTop,'#ffffff',.5),.35); g.lineWidth=1; g.beginPath(); g.moveTo(rx+s*3.2,ry+s*.1); g.lineTo(rx+s*6,ry); g.moveTo(rx+s*3.2,ry+s*.3); g.lineTo(rx+s*6,ry+s*.6); g.stroke(); if(ro>.7) waRing(rx+s*2.2,ry+s*.3,s*.6,(ro-.7)/.3,.4); } } }
      { const jx=W*.9, jy=hz-H*.004, w=Math.sin(t*3.2)*.06; g.fillStyle=v3rgba(N('#e83a5a'),.85); g.beginPath(); g.ellipse(jx,jy-H*.02*(1-w),H*.03*(1+w),H*.02*(1-w),0,Math.PI,0); g.fill(); g.fillStyle='rgba(255,255,255,.35)'; g.beginPath(); g.ellipse(jx-H*.01,jy-H*.03*(1-w),H*.008,H*.004,-.3,0,7); g.fill(); }
      for(let i=0;i<3;i++){ const cx=W*.72+(i-1)*H*.02, cy=hz-H*.01-H*.07; g.fillStyle=N('#f4e8d0'); g.fillRect(cx-1,cy,2,H*.01); const fl=1+Math.sin(t*12+i*2)*.15; v3glow(g,cx,cy-H*.004,H*.014,'rgba(255,200,100,.9)',.35+P.night*.3); g.fillStyle='#ffd060'; g.beginPath(); g.ellipse(cx,cy-H*.004,H*.0025,H*.005*fl,0,0,7); g.fill(); }
      { const q=(t%33)/33; if(q<.2){ const e=q/.2, px=W*(.2+e*.2), py=e<.85?hz-H*.16*(1-Math.pow(e/.85,1.6))+H*.004:hz+H*.01, r=H*.02; if(e<.85){ g.save(); g.translate(px,py-r); g.rotate(e*14); g.fillStyle=N('#7a3a1a'); g.beginPath(); g.arc(0,0,r,0,7); g.fill(); g.fillStyle=N('#5a2a10'); g.beginPath(); g.arc(r*.3,r*.2,r*.3,0,7); g.arc(-r*.4,-r*.3,r*.22,0,7); g.fill(); g.restore(); } else if(FX){ const k=(e-.85)/.15; g.fillStyle=v3rgba(N('#9a5a24'),1-k); for(let i=0;i<6;i++){ const a=-Math.PI*(i+.5)/6; g.beginPath(); g.arc(px+Math.cos(a)*k*H*.04,py+Math.sin(a)*k*H*.03-k*k*H*.0,H*.004,0,7); g.fill(); } waRing(px,py,H*.008,k,.7); } } } } },
  corporate:{
    live(x,P,hz,t){ const FX=S.settings.effects, fx=W*.62, fy=hz+H*.13;
      /* map standard (2026-11-21), life by day: pigeons strut along the top of the ticker band, pecking, now and then turning round */
      if(P.night<.6) for(let i=0;i<3;i++){ const s=H*.0065, seg=Math.floor(t*.12+i*1.7), r=v3rng(seg*17+i), dir=r()<.5?1:-1, px=W*(.18+i*.27)+Math.sin(t*.12+i*1.7)*W*.03, py=hz-H*.03, peck=Math.max(0,Math.sin(t*3+i*2))>.85?s*.5:0, N=c0=>mix(c0,P.front,.2+P.night*.5);
        g.save(); g.translate(px,py); g.scale(dir,1); g.fillStyle=N('#5e6474'); g.beginPath(); g.ellipse(0,-s*1.1,s*1.3,s*.75,-.15,0,7); g.fill(); g.beginPath(); g.moveTo(-s*1.1,-s*1); g.lineTo(-s*2,-s*.8); g.lineTo(-s*1.1,-s*.6); g.fill();
        g.fillStyle=N('#3e4456'); g.beginPath(); g.arc(s*1.05,-s*1.75+peck,s*.48,0,7); g.fill(); g.fillStyle=N('#e8b080'); g.fillRect(s*1.45,-s*1.75+peck,s*.4,1.2); g.fillStyle=N('#5a8a7a'); g.fillRect(s*.6,-s*1.45+peck*.5,s*.6,s*.3);
        g.strokeStyle=N('#d07060'); g.lineWidth=1; g.beginPath(); g.moveTo(-s*.2,-s*.4); g.lineTo(-s*.2,0); g.moveTo(s*.3,-s*.4); g.lineTo(s*.3,0); g.stroke(); g.restore(); }
      g.fillStyle=mix('#c8ccd4',P.wMid,.2+P.night*.5); g.beginPath(); g.ellipse(fx,fy,H*.03,H*.008,0,0,7); g.fill();
      if(FX){ g.fillStyle='rgba(230,245,255,.7)'; for(let i=0;i<16;i++){ const q=((t*.9+i/16)%1), a=(i/16-.5)*1.4, px=fx+Math.sin(a)*q*H*.05, py=fy-Math.sin(q*Math.PI)*H*.06*(1-Math.abs(a)*.4); g.fillRect(px,py,1.6,1.6); } }
      { const q=(t%25)/25; if(q<.3){ const e=q/.3, px=W*(.2+e*.55), py=hz*.35+e*hz*.5+Math.sin(e*12)*H*.012, s=H*.014; g.save(); g.translate(px,py); g.rotate(.25+Math.cos(e*12)*.25); g.fillStyle='#f8f8f4'; g.beginPath(); g.moveTo(s*1.6,0); g.lineTo(-s,-s*.6); g.lineTo(-s*.6,0); g.lineTo(-s,s*.4); g.closePath(); g.fill(); g.restore(); } }
      { const q=(t%53)/53; if(q<.35){ const e=q/.35, px=W*(1.05-e*1.15), py=hz*.22, s=H*.006; g.fillStyle=P.night>.5?'#1a1e28':'#3a404a'; g.beginPath(); g.ellipse(px,py,s*2,s*.9,0,0,7); g.fill(); g.fillRect(px,py-s*.2,s*3.4,s*.35); g.strokeStyle=g.fillStyle; g.lineWidth=1; const r=Math.sin(t*40)*s*3; g.beginPath(); g.moveTo(px-r,py-s*1.3); g.lineTo(px+r,py-s*1.3); g.stroke(); if(P.night>.3){ g.fillStyle=Math.sin(t*6)>0?'#ff4040':'#40ff60'; g.fillRect(px+s*3.2,py-s*.3,1.5,1.5); } } } } },
  nile:{
    shore(x,P,hz){ const N=c0=>mix(c0,P.farHaze,.2+P.night*.4); x.fillStyle=N('#d8b878'); x.beginPath(); x.moveTo(W*.505,hz-H*.006); x.lineTo(W*.509,hz-H*.075); x.lineTo(W*.512,hz-H*.082); x.lineTo(W*.515,hz-H*.075); x.lineTo(W*.519,hz-H*.006); x.fill(); x.fillStyle=N('#b89858'); x.fillRect(W*.513,hz-H*.075,W*.006,H*.069); },
    water(x,P,hz){ const r=v3rng(19); for(const [cx,cy,n] of [[.66,.04,4],[.74,.07,3],[.4,.18,3]]) for(let i=0;i<n;i++){ const yy=hz+H*cy+(r()-.5)*H*.015, s=H*(.008+waK(yy,hz)*.04)*(.7+r()*.4); waLily(x,W*cx+(r()-.5)*W*.05,yy,s,P,700+i+Math.round(cx*100),r()<.5?(r()<.5?'#8ab8ff':'#fff8f0'):null); } },
    live(x,P,hz,t){ const FX=S.settings.effects, N=c0=>mix(c0,P.farHaze,P.night*.6);
      /* map standard (2026-11-21), life after dark: fruit bats flit over the palms, darting and turning */
      if(P.night>.4) for(let i=0;i<4;i++){ const seg=Math.floor(t*.5+i*2.3), k=(t*.5+i*2.3)-seg, r1=v3rng(seg*7+i), r0=v3rng((seg-1)*7+i), ax=W*(.15+r1()*.7), ay=hz*(.45+r1()*.4), bx=W*(.15+r0()*.7), by=hz*(.45+r0()*.4), e=k*k*(3-2*k), x0=bx+(ax-bx)*e, y0=by+(ay-by)*e, s=H*.005, f=Math.sin(t*16+i*2);
        g.fillStyle=v3rgba('#141018',P.night); g.beginPath(); g.moveTo(x0,y0); g.quadraticCurveTo(x0-s*1.2,y0-s*1.6*f,x0-s*2.6,y0-s*.6*f); g.lineTo(x0-s*1.4,y0+s*.3); g.lineTo(x0,y0+s*.5); g.lineTo(x0+s*1.4,y0+s*.3); g.lineTo(x0+s*2.6,y0-s*.6*f); g.quadraticCurveTo(x0+s*1.2,y0-s*1.6*f,x0,y0); g.fill(); }
      { const per=110, q=(t%per)/per, base=W*(1.08-q*1.25); for(let i=0;i<4;i++){ const cx=base+i*H*.035, cy=hz-H*.027, s=H*.0035, st=Math.sin(t*3+i)*s*.5; g.fillStyle=N('#a07a4a'); g.strokeStyle=g.fillStyle; g.lineWidth=Math.max(1,s*.5); g.beginPath(); g.moveTo(cx-s*1.5,cy); g.lineTo(cx-s*1.5+st,cy+s*3.4); g.moveTo(cx+s*1.4,cy); g.lineTo(cx+s*1.4-st,cy+s*3.4); g.stroke(); g.beginPath(); g.ellipse(cx,cy-s*.4,s*2.2,s*1.2,0,0,7); g.fill(); g.beginPath(); g.ellipse(cx,cy-s*1.5,s*.9,s*.8,0,0,7); g.fill(); g.beginPath(); g.moveTo(cx-s*2,cy-s*.6); g.quadraticCurveTo(cx-s*3.4,cy-s*2.5,cx-s*3.2,cy-s*3.2); g.lineTo(cx-s*3.8,cy-s*3.2); g.quadraticCurveTo(cx-s*3,cy-s*1.6,cx-s*1.6,cy); g.fill(); if(i===0){ g.fillStyle=N('#f4f0e8'); g.fillRect(cx-s*.4,cy-s*3.8,s*.9,s*1.8); } } }
      if(FX&&P.night<.5) for(let i=0;i<3;i++){ const q=((t*.03+i*.3)%1), bx=W*(-.05+q*1.1), by=hz*(.3+i*.08)+Math.sin(t+i)*5, f=Math.sin(t*5+i)*.6, s=H*.007; g.strokeStyle='rgba(250,250,250,.9)'; g.lineWidth=1.3; g.beginPath(); g.moveTo(bx-s*2,by-s*f); g.quadraticCurveTo(bx-s,by-s,bx,by); g.quadraticCurveTo(bx+s,by-s,bx+s*2,by-s*f); g.stroke(); g.strokeStyle='#1a1a1a'; g.beginPath(); g.moveTo(bx,by); g.quadraticCurveTo(bx+s*1.2,by+s*.2,bx+s*1.6,by+s*.8); g.stroke(); }
      { const q=(t%21)/21; if(q<.25){ const e=q/.25, up=Math.min(1,Math.sin(e*Math.PI)*1.6), y=hz+H*.09, s=H*.006, cx=W*.46+e*W*.04, col=mix('#4a5a3a',P.wMid,.25+P.night*.5); g.save(); g.beginPath(); g.rect(0,0,W,y); g.clip(); g.fillStyle=col; g.beginPath(); g.ellipse(cx,y+s*(1-up)*1.5,s*4,s*.7*up+.05,0,Math.PI,0); g.fill(); for(const ox of [-1.6,-1.1]){ g.beginPath(); g.arc(cx+ox*s*2,y-s*.5*up+s*(1-up),s*.45,0,7); g.fill(); g.fillStyle='#e8d040'; g.fillRect(cx+ox*s*2-.6,y-s*.6*up+s*(1-up),1.3,1.3); g.fillStyle=col; } for(let i=0;i<5;i++){ g.beginPath(); g.arc(cx+s*(.6+i*.8),y-s*.3*up+s*(1-up),s*.25,0,7); g.fill(); } g.restore(); if(FX) waRing(cx,y+1,s*2,e,.4); } } } },
  circuit:{
    live(x,P,hz,t){ if(!S.settings.effects) return; const neon=['#3af0ff','#ff3ab8','#b8ff3a'];
      for(let i=0;i<14;i++){ const cx=W*((i*.0731+.03)%1), sp=.25+(i%4)*.08, q=((t*sp+i*.37)%1), y0=q*hz*1.1; for(let j=0;j<6;j++){ const y=y0-j*H*.018; if(y<0||y>hz) continue; g.fillStyle=v3rgba(neon[i%3],(1-j/6)*.5); g.fillRect(cx,y,2,H*.008); } }
      { const a=t*.35, cx=W*.3+Math.cos(a)*W*.08, cy=hz*.45+Math.sin(a*1.3)*hz*.06; for(let i=0;i<5;i++){ const dx=cx+(i-2)*H*.025, dy=cy+Math.abs(i-2)*H*.01; g.fillStyle='#1a1a2a'; g.fillRect(dx-3,dy-1,6,2); g.fillStyle=(Math.sin(t*5+i)>0)?'#ff4060':'#40ff80'; g.fillRect(dx-.8,dy+1,1.6,1.6); } }
      { const q=t%31; if(q<.4){ const r=v3rng(Math.floor(t*20)); for(let i=0;i<7;i++){ const y=r()*H, h=H*(.008+r()*.03); g.fillStyle=v3rgba(neon[i%3],.18+r()*.2); g.fillRect((r()-.5)*W*.06,y,W,h); } g.fillStyle='rgba(255,255,255,.06)'; g.fillRect(0,0,W,H); } } } },
  olympus:{
    shore(x,P,hz){ const col=mix('#f4efe4',P.farHaze,.25+P.night*.45), sh=mix(col,'#000000',.12); for(const [px,h,br] of [[.16,.07,1],[.2,.045,0],[.8,.06,0],[.85,.08,1],[.89,.035,0]]){ const cx=W*px, b=hz-H*.008, cw=H*.012; x.fillStyle=col; x.fillRect(cx-cw,b-H*h,cw*2,H*h); x.fillStyle=sh; x.fillRect(cx-cw*.4,b-H*h,cw*.25,H*h); x.fillRect(cx+cw*.3,b-H*h,cw*.25,H*h);
        x.fillStyle=col; if(br){ x.fillRect(cx-cw*1.4,b-H*h-H*.008,cw*2.8,H*.008); } else { x.beginPath(); x.moveTo(cx-cw,b-H*h); x.lineTo(cx-cw*.2,b-H*h-H*.008); x.lineTo(cx+cw*.4,b-H*h-H*.003); x.lineTo(cx+cw,b-H*h-H*.006); x.lineTo(cx+cw,b-H*h); x.fill(); } } },
    live(x,P,hz,t){ { const ox=W*.955, oy=H*.28-H*.004, s=H*.008, bl=(t%6)<.15, N=c0=>mix(c0,P.top,P.night*.4); g.fillStyle=N('#8a7a64'); g.beginPath(); g.ellipse(ox,oy-s*1.6,s*1.2,s*1.7,0,0,7); g.fill(); g.beginPath(); g.ellipse(ox,oy-s*3.4,s*1.05,s*.9,0,0,7); g.fill(); g.fillStyle=N('#e8dcc4'); g.beginPath(); g.ellipse(ox,oy-s*1.3,s*.7,s*1.1,0,0,7); g.fill();
        if(!bl){ g.fillStyle='#ffd040'; g.beginPath(); g.arc(ox-s*.42,oy-s*3.45,s*.3,0,7); g.arc(ox+s*.42,oy-s*3.45,s*.3,0,7); g.fill(); g.fillStyle='#1a1a1a'; g.fillRect(ox-s*.5,oy-s*3.55,s*.18,s*.18); g.fillRect(ox+s*.34,oy-s*3.55,s*.18,s*.18); } else { g.strokeStyle='#3a3020'; g.lineWidth=1; g.beginPath(); g.moveTo(ox-s*.7,oy-s*3.45); g.lineTo(ox-s*.15,oy-s*3.45); g.moveTo(ox+s*.15,oy-s*3.45); g.lineTo(ox+s*.7,oy-s*3.45); g.stroke(); }
        g.fillStyle=N('#e0a030'); g.beginPath(); g.moveTo(ox-s*.15,oy-s*3.2); g.lineTo(ox+s*.15,oy-s*3.2); g.lineTo(ox,oy-s*2.8); g.fill(); }
      { const q=(t%41)/41; if(q<.3){ const e=q/.3, px=W*(-.08+e*1.16), py=hz*(.42-.18*Math.sin(e*Math.PI)), s=H*.007, f=Math.sin(t*5); g.save(); g.translate(px,py); g.fillStyle='#fbf8f0'; g.beginPath(); g.ellipse(0,0,s*2.4,s*1,0,0,7); g.fill(); g.beginPath(); g.moveTo(s*1.6,-s*.4); g.lineTo(s*2.6,-s*1.8); g.lineTo(s*3.4,-s*1.6); g.lineTo(s*2.4,-s*.2); g.fill(); g.beginPath(); g.ellipse(s*3.2,-s*1.9,s*.9,s*.45,.3,0,7); g.fill();
        g.strokeStyle='#fbf8f0'; g.lineWidth=Math.max(1,s*.35); g.beginPath(); g.moveTo(s*1.3,s*.6); g.lineTo(s*2.4,s*1.4); g.moveTo(s*.9,s*.6); g.lineTo(s*1.4,s*1.8); g.moveTo(-s*1.4,s*.6); g.lineTo(-s*2.2,s*1.5); g.moveTo(-s*1.8,s*.5); g.lineTo(-s*2.4,s*1.9); g.stroke();
        g.fillStyle='rgba(255,255,255,.95)'; g.beginPath(); g.moveTo(-s*.2,-s*.6); g.quadraticCurveTo(-s*1.6,-s*(2.6+f*1.4),-s*3,-s*(2+f*2)); g.quadraticCurveTo(-s*1.4,-s*(1+f*.6),s*.8,-s*.6); g.fill(); g.strokeStyle='#e8d090'; g.lineWidth=1; g.beginPath(); g.moveTo(-s*2.4,0); g.quadraticCurveTo(-s*3.2,s*.2,-s*3.6,s*1); g.stroke(); g.restore(); v3glow(g,px,py,H*.04,'rgba(255,230,160,.9)',.25); } } } }
};
// music, depth motes and search words for the new waters
try{ Object.assign(MUS_AREA,{blossom:'musicbox', rockies:'strings', keys:'island', amazon:'taiko', farm:'shanty', buffet:'island', corporate:'strings', nile:'cello', circuit:'abyss', olympus:'celestial'}); }catch(e){}
try{ Object.assign(DEPTH_MOTE,{blossom:'255,230,240', rockies:'255,255,255', keys:'255,255,240', amazon:'220,240,200', farm:'255,250,230', buffet:'255,240,200', corporate:'220,230,255', nile:'255,240,210', circuit:'120,240,255', olympus:'255,240,200'}); }catch(e){}
try{ const s=SEARCH_IDX.find(e=>e[0]==='Waters'); if(s) s[3]+=' cherry blossom japan rockies canada keys florida amazon farm buffet corporate nile egypt circuit cyber olympus'; }catch(e){}
// end-game waters: open them for anyone with enough voyages (start-up, any load, and after setting sail)
{ const _m=migrate; migrate=function(o){ const m=_m(o); try{ egOpenAdd(m); }catch(e){} return m; }; }
try{ egOpenAdd(S); }catch(e){}
document.addEventListener('click',e=>{ const b=e.target.closest&&e.target.closest('[data-act="retireok"]'); if(!b) return; setTimeout(()=>{ try{ egOpenAdd(S); }catch(er){} },30); },true);
// end-game fish pay 25% more than your best normal water and fight like it
{ const _rf=rollFish; rollFish=function(sp){ const f=_rf.apply(this,arguments); try{ if(f&&sp&&sp.eg){ const k=egScale(); f.value=Math.max(1,Math.round(f.value*k.v)); f.str=+(f.str*k.s).toFixed(2); } }catch(e){} return f; }; }
// end-game fish in the Aquarium: their income cap follows the same scale (it is computed from the water's fish)
