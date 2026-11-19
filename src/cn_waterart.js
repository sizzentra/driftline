// =====================================================================
// 0.4.9 [3]-[7] [69] scenes for the ten new waters (data in cm_waters.js). Each water: a palette for day, dusk and night, still land
// (cached like every other water), a live layer (kept light: a few dozen shapes a frame) and a foreground corner.
//  Cherry Blossom Lake: Mount Fuji, cherry trees, a torii gate and a pagoda; falling petals, koi under the water, lanterns at night.
//  Canadian Rockies: jagged snowy peaks, pine forests, a log cabin and a glacier-blue lake; an eagle circling, drifting mist.
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
// palettes: every field any water uses (so platforms and helpers always find a colour), then the base water's look, then this water's
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
V3SCENES.blossom={
  land(x,P,hz,cnv){
    v3range(x,{seed:5, base:hz+1, amp:.28*H, massifs:[[.36,1,.16]], light:mix(P.far,'#ffffff',.25), shadow:mix(P.far,'#1a1030',.3), haze:P.farHaze, snow:P.snow, snowLine:hz-.16*H, hazeA:.55}); /* Mount Fuji */
    wa.hills(x,hz,P.hill,[[0,.04],[.15,.06],[.3,.035],[.5,.05],[.7,.04],[.85,.06],[1,.045]]);
    // pagoda on the far left hill
    { const px=W*.12, pb=hz-H*.05, s=H*.012; x.fillStyle=mix(P.back,'#000000',.25); for(let i=0;i<4;i++){ const y=pb-i*s*3.2, w=s*(6-i); x.fillRect(px-w*.4,y-s*2.2,w*.8,s*2.2); x.beginPath(); x.moveTo(px-w*.75,y-s*2.2); x.quadraticCurveTo(px,y-s*3.4,px+w*.75,y-s*2.2); x.closePath(); x.fill(); } x.fillRect(px-.5,pb-s*15,1.2,s*2.4); }
    for(let i=0;i<7;i++) v3leafTree(x,W*(.04+i*.14+((i*37)%5)*.006),hz-H*.03,H*(.07+((i*13)%4)*.01),P,40+i,{leaf:P.leaf});
    v3water(x,P,hz,cnv,.38);
    // a red torii gate standing in the shallows on the right
    { const gx=W*.78, gb=hz+H*.03, gh=H*.12, gw=H*.11, red=mix('#d8382a',P.wBot,P.night*.6); x.fillStyle=red; x.fillRect(gx-gw*.4,gb-gh,gh*.07,gh); x.fillRect(gx+gw*.4-gh*.07,gb-gh,gh*.07,gh);
      x.fillRect(gx-gw*.5,gb-gh*.78,gw,gh*.07); x.beginPath(); x.moveTo(gx-gw*.66,gb-gh*.98); x.quadraticCurveTo(gx,gb-gh*.9,gx+gw*.66,gb-gh*.98); x.lineTo(gx+gw*.6,gb-gh*.88); x.quadraticCurveTo(gx,gb-gh*.82,gx-gw*.6,gb-gh*.88); x.closePath(); x.fill();
      x.fillStyle=mix('#1a1a1a',P.wBot,P.night*.5); x.fillRect(gx-gw*.62,gb-gh*1.02,gw*1.24,gh*.05);
      x.fillStyle=v3rgba(red,.25); x.fillRect(gx-gw*.4,gb,gh*.07,gh*.5); x.fillRect(gx+gw*.4-gh*.07,gb,gh*.07,gh*.5); } },
  live(P,t,hz,sun){ const FX=S.settings.effects; v3glitter(P,t,hz,sun);
    if(FX) for(let i=0,n=gfxHigh()?22:12;i<n;i++){ const per=9+(i%5), q=((t+i*1.7)%per)/per, x=W*(((i*.137)+q*.25)%1), y=H*.05+q*H*.85+Math.sin(t*1.3+i)*6; if(y>H*.97) continue; wa.petal(g,x,y,2.6,t*2+i,i%3?'rgba(255,190,210,.85)':'rgba(255,230,240,.9)'); }
    // koi gliding under the surface
    for(let i=0;i<3;i++){ const per=28+i*7, q=((t+i*9)%per)/per, x=W*(-.1+q*1.2), y=hz+H*(.2+i*.12)+Math.sin(t*.7+i)*4, s=H*.016, dir=1; g.save(); g.globalAlpha=.35; g.translate(x,y); g.fillStyle=['#ff8a3a','#ffffff','#ffd03a'][i]; g.beginPath(); g.ellipse(0,0,s*2.2,s*.8,0,0,7); g.fill(); g.beginPath(); g.moveTo(-s*2,0); g.lineTo(-s*3.2,-s*.9+Math.sin(t*6+i)*s*.3); g.lineTo(-s*3.2,s*.9+Math.sin(t*6+i)*s*.3); g.closePath(); g.fill(); if(i===1){ g.fillStyle='#e8402a'; g.beginPath(); g.arc(s*1.2,-s*.2,s*.45,0,7); g.fill(); } g.restore(); }
    if(P.night>.3) for(let i=0;i<5;i++){ const x=W*(.25+i*.12), y=hz-H*.01+Math.sin(t*.8+i)*2; v3glow(g,x,y,H*.03,'rgba(255,180,120,.9)',.5*P.night); g.fillStyle='rgba(255,200,140,'+P.night+')'; g.fillRect(x-2,y-3,4,6); } },
  fore(P,t){ const sw=Math.sin(t*.6)*.03; g.save(); g.translate(W,0); g.rotate(sw); g.strokeStyle=mix('#4a3022',P.top,P.night*.4); g.lineWidth=H*.012; g.lineCap='round'; g.beginPath(); g.moveTo(0,H*.05); g.quadraticCurveTo(-W*.08,H*.06,-W*.16,H*.14); g.stroke();
    for(let i=0;i<14;i++){ const u=i/13, px=-W*.16*u, py=H*.05+H*.09*u*u; g.fillStyle=i%2?'rgba(255,190,214,.95)':'rgba(255,224,236,.95)'; g.beginPath(); g.arc(px+((i*7)%5-2)*2,py+((i*11)%5-2)*2,H*.012,0,7); g.fill(); } g.restore(); }
};
V3SCENES.rockies={
  land(x,P,hz,cnv){
    v3range(x,{seed:21, base:hz+1, amp:.27*H, massifs:[[.2,.95,.12],[.4,.78,.1],[.63,1,.12],[.86,.8,.1]], light:mix(P.far,'#ffffff',.3), shadow:mix(P.far,'#101830',.4), haze:P.farHaze, snow:P.snow, snowLine:hz-.14*H, hazeA:.5});
    v3range(x,{seed:44, base:hz+1, amp:.1*H, massifs:[[.15,.8,.15],[.55,.7,.18],[.88,.8,.12]], light:mix(P.far,P.hill,.5), shadow:mix(P.hill,'#081018',.3), haze:P.farHaze, snow:null, hazeA:.4});
    for(let row=0;row<2;row++) for(let i=0;i<26;i++){ const px=W*(i/25)+((i*31)%7-3)*2, base=hz-H*(.004+row*.004), h=H*(.05+((i*17)%5)*.008)*(row?1.2:1); if(px>W*.34&&px<W*.62&&row) continue; v3pine(x,px,base,h,row?P.front:mix(P.back,P.farHaze,.3),P.rim,.25*(1-P.night)); }
    // a log cabin on the left shore, smoke from the chimney drawn live
    { const cx=W*.08, cb=hz-H*.006, cw=H*.07, ch=H*.035; x.fillStyle=mix('#7a4a2a',P.front,P.night*.6); x.fillRect(cx,cb-ch,cw,ch); x.fillStyle=mix('#5a3018',P.front,P.night*.6); for(let k=1;k<5;k++) x.fillRect(cx,cb-ch+k*ch/5,cw,1);
      x.fillStyle=mix('#3a2a24',P.front,P.night*.5); x.beginPath(); x.moveTo(cx-cw*.1,cb-ch); x.lineTo(cx+cw*.5,cb-ch-H*.03); x.lineTo(cx+cw*1.1,cb-ch); x.closePath(); x.fill(); x.fillRect(cx+cw*.72,cb-ch-H*.03,cw*.1,H*.02);
      x.fillStyle=P.night>.3?'#ffd080':mix('#2a3a4a',P.front,.3); x.fillRect(cx+cw*.2,cb-ch*.7,cw*.18,ch*.3); x.fillRect(cx+cw*.6,cb-ch*.7,cw*.18,ch*.3); }
    v3water(x,P,hz,cnv,.42); },
  live(P,t,hz,sun){ v3glitter(P,t,hz,sun); if(!S.settings.effects) return;
    // chimney smoke
    for(let i=0;i<5;i++){ const q=((t*.15+i*.2)%1), x=W*.08+H*.07*.77+q*H*.04, y=hz-H*.07-q*H*.08; g.fillStyle='rgba(220,226,234,'+(.25*(1-q))+')'; g.beginPath(); g.arc(x,y,H*(.006+q*.012),0,7); g.fill(); }
    // an eagle circling high up
    { const a=t*.25, x=W*.55+Math.cos(a)*W*.12, y=hz*.35+Math.sin(a)*hz*.08, fl=Math.sin(t*3)*.5, s=H*.012; g.strokeStyle=P.night>.5?'rgba(20,24,40,.8)':'rgba(40,30,24,.85)'; g.lineWidth=Math.max(1.2,s*.25); g.beginPath(); g.moveTo(x-s*2.2,y-s*fl); g.quadraticCurveTo(x-s,y-s*.6,x,y); g.quadraticCurveTo(x+s,y-s*.6,x+s*2.2,y-s*fl); g.stroke(); }
    v3mist(P,t,hz,.18+P.night*.08); },
  fore(P,t){ const sw=Math.sin(t*.7)*.02; g.save(); g.translate(W*1.01,-H*.02); g.rotate(sw); for(let i=0;i<4;i++) v3pine(g,-W*.03-i*W*.012,H*.32-i*H*.01,H*.36,mix('#1a3424',P.top,P.night*.4),null,0); g.restore(); }
};
V3SCENES.keys={
  land(x,P,hz,cnv){
    for(const [ix,iw,ih] of [[.12,.12,.012],[.46,.08,.01],[.86,.14,.016]]){ x.fillStyle=mix(P.isl,P.farHaze,.35); x.beginPath(); x.ellipse(W*ix,hz,W*iw,H*ih,0,Math.PI,0); x.fill(); }
    for(const [px,hh,l] of [[.06,.08,.2],[.1,.1,-.15],[.82,.09,.1],[.9,.11,-.1]]) v3palm(x,W*px,hz-H*.008,H*hh,l,P,Math.round(px*100));
    // the long old bridge on arches across the horizon
    { const y=hz-H*.025, col=mix('#e8e4dc',P.farHaze,.35+P.night*.3); x.fillStyle=col; x.fillRect(W*.16,y,W*.66,H*.006); for(let i=0;i<=22;i++){ const bx=W*(.16+i*.03); x.fillRect(bx,y,H*.004,H*.025); x.beginPath(); x.moveTo(bx,y+H*.006); x.quadraticCurveTo(bx+W*.015,y+H*.018,bx+W*.03,y+H*.006); x.lineTo(bx+W*.03,y+H*.004); x.lineTo(bx,y+H*.004); x.fill(); } }
    v3water(x,P,hz,cnv,.3);
    // seagrass beds and sand patches seen through the shallow water
    { const r=v3rng(17); for(let i=0;i<14;i++){ const px=W*r(), py=hz+H*(.12+r()*.8), s=H*(.03+r()*.05); x.fillStyle=v3rgba(i%3?mix(P.sand,P.wMid,.5):mix('#3a7a4a',P.wMid,.5),.35); x.beginPath(); x.ellipse(px,py,s*2.2,s*.5,0,0,7); x.fill(); } } },
  live(P,t,hz,sun){ v3glitter(P,t,hz,sun); if(!S.settings.effects) return;
    // gulls
    for(let i=0;i<3;i++){ const q=((t*.04+i*.33)%1), x=W*(-.05+q*1.1), y=hz*(.3+i*.12)+Math.sin(t+i)*6, f=Math.sin(t*5+i)*.6, s=H*.008; g.strokeStyle='rgba(250,250,250,.9)'; g.lineWidth=1.3; g.beginPath(); g.moveTo(x-s*2,y-s*f); g.quadraticCurveTo(x-s,y-s,x,y); g.quadraticCurveTo(x+s,y-s,x+s*2,y-s*f); g.stroke(); }
    // a pelican diving now and then
    { const per=16, q=(t%per)/per; if(q<.25){ const e=q/.25, x=W*.62, y=hz*.4+e*e*(hz*.62); g.fillStyle='rgba(120,110,100,.9)'; g.beginPath(); g.ellipse(x,y,H*.006,H*.016,.2,0,7); g.fill(); } else if(q<.32){ v3fxSplash&&0; const k=(q-.25)/.07; g.strokeStyle='rgba(255,255,255,'+(1-k)+')'; g.lineWidth=1.4; g.beginPath(); g.ellipse(W*.62,hz+2,H*.01+k*H*.03,H*.004+k*H*.008,0,0,7); g.stroke(); } } },
  fore(P,t){ g.save(); g.strokeStyle=mix('#4a3a2a',P.top,P.night*.4); g.lineWidth=H*.008; g.lineCap='round'; for(let i=0;i<6;i++){ const x0=W*(.9+i*.02); g.beginPath(); g.moveTo(x0,H); g.quadraticCurveTo(x0-W*.02,H*.86,x0+W*.01,H*.78-i*H*.01); g.stroke(); }
    g.fillStyle=mix('#2a6a3a',P.top,P.night*.5); for(let i=0;i<9;i++){ g.beginPath(); g.ellipse(W*(.9+((i*13)%7)*.014),H*(.72+((i*7)%5)*.012),W*.018,H*.01,(i-4)*.3,0,7); g.fill(); } g.restore(); }
};
V3SCENES.amazon={
  land(x,P,hz,cnv){
    // a jungle cliff on the left with a waterfall pouring off it
    const cx0=0, cx1=W*.34, top=hz-H*.2; x.fillStyle=mix(P.back,'#000000',.2); x.beginPath(); x.moveTo(cx0,hz+1); x.lineTo(cx0,top); x.quadraticCurveTo(W*.18,top-H*.03,cx1,top+H*.02); x.lineTo(cx1+W*.02,hz+1); x.closePath(); x.fill();
    x.fillStyle=mix(P.back,'#000000',.4); for(let i=0;i<8;i++) x.fillRect(W*(.02+i*.04),top+H*.03,W*.006,hz-top-H*.03);
    v3bushes(x,cx0,cx1+W*.04,top+H*.02,H*.05,P,61,{leaf:P.back});
    wa.blob(x,hz,mix(P.hill,P.farHaze,.3),.07,7,30); v3bushes(x,W*.32,W,hz-H*.02,H*.06,P,62,{leaf:P.hill}); v3bushes(x,W*.36,W,hz,H*.04,P,63,{leaf:P.front});
    x.fillStyle=v3rgba(mix('#ffffff',P.wTop,.3),.85); x.fillRect(W*.24,top+H*.015,W*.05,hz-top);
    v3water(x,P,hz,cnv,.32); },
  live(P,t,hz,sun){ const FX=S.settings.effects, top=hz-H*.2+H*.015;
    // falling water streaks and mist at the foot of the falls
    if(FX){ g.save(); g.globalAlpha=.6; g.strokeStyle='rgba(255,255,255,.7)'; g.lineWidth=1.2; for(let i=0;i<10;i++){ const x=W*(.243+i*.0045), q=((t*1.2+i*.37)%1), y=top+q*(hz-top); g.beginPath(); g.moveTo(x,y); g.lineTo(x,y+H*.03); g.stroke(); } g.restore();
      for(let i=0;i<7;i++){ const q=((t*.3+i*.14)%1), x=W*.265+(i-3)*W*.012+q*W*.02, y=hz-q*H*.05; g.fillStyle='rgba(240,248,255,'+(.25*(1-q))+')'; g.beginPath(); g.arc(x,y,H*(.012+q*.02),0,7); g.fill(); } }
    v3glitter(P,t,hz,sun);
    // parrots by day, fireflies by night
    if(FX&&P.night<.5) for(let i=0;i<2;i++){ const q=((t*.05+i*.5)%1), x=W*(1.05-q*1.15), y=hz*(.35+i*.15)+Math.sin(t*2+i)*8, s=H*.01; g.fillStyle=i?'#e8302a':'#2a8ae8'; g.beginPath(); g.ellipse(x,y,s*1.4,s*.6,0,0,7); g.fill(); g.fillStyle='#f8d030'; g.beginPath(); g.ellipse(x-s*.4,y-s*Math.abs(Math.sin(t*9+i))*.9,s*.9,s*.4,0,0,7); g.fill(); }
    if(FX&&P.night>.3) for(let i=0;i<14;i++){ const x=W*(.36+((i*.173)%.6))+Math.sin(t*.7+i)*10, y=hz-H*.05+Math.sin(t*.9+i*2)*H*.03, a=P.night*(.5+.5*Math.sin(t*3+i*1.7)); v3glow(g,x,y,H*.012,'rgba(200,255,120,.9)',a*.6); } },
  fore(P,t){ g.save(); const col=mix('#1e4a1e',P.top,P.night*.5); g.strokeStyle=col; g.lineWidth=H*.005; for(let i=0;i<4;i++){ const x=W*(.82+i*.05), L=H*(.25+((i*7)%3)*.08), sw=Math.sin(t*.8+i)*W*.006; g.beginPath(); g.moveTo(x,0); g.quadraticCurveTo(x+sw,L*.5,x+sw*1.5,L); g.stroke(); g.fillStyle=col; for(let k=1;k<6;k++){ g.beginPath(); g.ellipse(x+sw*k/5,L*k/6,H*.012,H*.005,.5,0,7); g.fill(); } }
    g.fillStyle=mix('#2a6a2a',P.top,P.night*.5); for(const [x,y,r,a] of [[.98,.82,.09,-.6],[.92,.92,.08,-.2],[1,.66,.07,-1]]){ g.beginPath(); g.ellipse(W*x,H*y,W*r,H*r*.45,a,0,7); g.fill(); } g.restore(); }
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
    v3water(x,P,hz,cnv,.36); },
  live(P,t,hz,sun){ v3glitter(P,t,hz,sun); const cx=W*.875, cy=hz-H*.02-H*.12, L=H*.05, a=t*.9; g.strokeStyle=mix('#f0e8d8','#303040',P.night*.6); g.lineWidth=Math.max(1.5,H*.004);
    for(let i=0;i<4;i++){ const an=a+i*Math.PI/2; g.beginPath(); g.moveTo(cx,cy); g.lineTo(cx+Math.cos(an)*L,cy+Math.sin(an)*L); g.stroke(); }
    if(S.settings.effects) for(let i=0;i<3;i++){ const q=((t*.05+i*.33)%1), x=W*(-.05+q*1.1), y=hz*(.25+i*.1), f=Math.sin(t*6+i)*.6, s=H*.006; g.strokeStyle='rgba(40,40,50,.7)'; g.lineWidth=1.2; g.beginPath(); g.moveTo(x-s*2,y-s*f); g.quadraticCurveTo(x-s,y-s,x,y); g.quadraticCurveTo(x+s,y-s,x+s*2,y-s*f); g.stroke(); } },
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
    v3water(x,P,hz,cnv,.3); },
  live(P,t,hz,sun){ v3glitter(P,t,hz,sun); if(!S.settings.effects) return;
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
  live(P,t,hz,sun){ v3glitter(P,t,hz,sun); const y=hz-H*.03, txt='DRFT ▲2.4%  KOI ▼0.8%  TUNA ▲11.2%  CARP ▲0.3%  BASS ▼1.9%  SNAPR ▲4.0%  EEL ▲6.6%  ', fs=Math.max(8,H*.011);
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
    v3water(x,P,hz,cnv,.36); },
  live(P,t,hz,sun){ v3glitter(P,t,hz,sun);
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
  live(P,t,hz,sun){ if(!S.settings.effects) return; const neon=['#3af0ff','#ff3ab8','#b8ff3a'];
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
    for(let i=0;i<24;i++){ const cx=W*(i/23), r=H*(.03+((i*7)%4)*.008); x.fillStyle=mix('#ffffff',P.farHaze,.2+P.night*.5); x.beginPath(); x.arc(cx,hz-H*.005,r,Math.PI,0); x.fill(); }
    v3water(x,P,hz,cnv,.4); },
  live(P,t,hz,sun){ v3glitter(P,t,hz,sun); if(!S.settings.effects) return;
    for(let i=0;i<10;i++){ const x=W*(.3+((i*.137)%.4)), y=hz-H*(.05+((i*.29)%.2))+Math.sin(t+i)*4, a=.5+.5*Math.sin(t*2+i*1.7); g.fillStyle='rgba(255,220,120,'+(.7*a)+')'; g.fillRect(x,y,1.6,1.6); }
    { const per=11, q=(t%per)/per; if(q<.05){ const k=q/.05; g.save(); g.strokeStyle='rgba(255,250,210,'+(1-k)+')'; g.lineWidth=2.2; g.beginPath(); let x=W*.68, y=0; g.moveTo(x,y); for(let i=0;i<6;i++){ x+=((i*37)%7-3)*6; y+=hz*.12; g.lineTo(x,y); } g.stroke(); g.fillStyle='rgba(255,255,240,'+(.08*(1-k))+')'; g.fillRect(0,0,W,H); g.restore(); } } },
  fore(P,t){ g.save(); const x=W*.955, col=mix('#f4efe4',P.top,P.night*.5); g.fillStyle=col; g.fillRect(x-H*.03,H*.3,H*.06,H*.7); g.fillStyle=mix(col,'#000000',.12); for(let k=0;k<3;k++) g.fillRect(x-H*.02+k*H*.016,H*.3,H*.004,H*.7); g.fillStyle=col; g.fillRect(x-H*.042,H*.28,H*.084,H*.025);
    g.fillStyle=mix('#4a8a3a',P.top,P.night*.5); for(let i=0;i<8;i++){ const a=i*.45+Math.sin(t*.6)*.05; g.beginPath(); g.ellipse(x-H*.04+i*H*.012,H*.27-Math.sin(i*.8)*H*.008,H*.012,H*.005,a,0,7); g.fill(); } g.restore(); }
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
