// =====================================================================
// The home kit (batch 5, 2026-11-22): side-view parts every format home is built from (docs/HOME_DESIGNS.md). Each home in
// cw_homes.js picks its parts and colours; everything here draws into the home's stored picture (cv_homefmt.js), so nothing in
// this file runs per frame. Side view only: a roof is a roof line, a boat a hull outline, a deck a plank edge with posts.
// Coordinates are the scene's own units; o is the paint context from hfPaintCache (x, N, P, dockY, pw, wl, posts, night, id).
// =====================================================================
const HK = {
  n:(o,c)=>(typeof c==="string"&&c[0]==="#")?o.N(c):c, /* night tint for hex colours; rgba() strings pass as they are */
  lit:o=>1-o.night*.6, dk:(c,k)=>mix(c,'#000000',k), lt:(c,k)=>mix(c,'#ffffff',k),
  at:(o,f)=>HF.x0()+(o.pw-HF.x0())*f, th:()=>Math.max(4,H*.012), fh:()=>Math.max(6,H*.018), s:()=>HF.sc(),
  rect(o,x,y,w,h,col){ o.x.fillStyle=HK.n(o,col); o.x.fillRect(x,y,w,h); },
  poly(o,pts,col){ const x=o.x; x.fillStyle=HK.n(o,col); x.beginPath(); x.moveTo(pts[0],pts[1]); for(let i=2;i<pts.length;i+=2) x.lineTo(pts[i],pts[i+1]); x.closePath(); x.fill(); },
  circ(o,cx,cy,r,col){ o.x.fillStyle=HK.n(o,col); o.x.beginPath(); o.x.arc(cx,cy,Math.max(.5,r),0,7); o.x.fill(); },
  ell(o,cx,cy,rx,ry,col,rot){ o.x.fillStyle=HK.n(o,col); o.x.beginPath(); o.x.ellipse(cx,cy,Math.max(.5,rx),Math.max(.5,ry),rot||0,0,7); o.x.fill(); },
  line(o,pts,col,w){ const x=o.x; x.strokeStyle=HK.n(o,col); x.lineWidth=w||1; x.beginPath(); x.moveTo(pts[0],pts[1]); for(let i=2;i<pts.length;i+=2) x.lineTo(pts[i],pts[i+1]); x.stroke(); },
  curve(o,x0,y0,cx,cy,x1,y1,col,w){ const x=o.x; x.strokeStyle=HK.n(o,col); x.lineWidth=w||1; x.beginPath(); x.moveTo(x0,y0); x.quadraticCurveTo(cx,cy,x1,y1); x.stroke(); },
  rim(o,x0,y,w,a){ o.x.fillStyle=v3rgba(o.P.rim||'#fff0d0',(a||.35)*HK.lit(o)); o.x.fillRect(x0,y,w,1.2); },
  hi(o,x0,y,w,h,a){ o.x.fillStyle=v3rgba('#ffffff',(a||.2)*HK.lit(o)); o.x.fillRect(x0,y,w,h||1); },
  sh(o,x0,y,w,h,a){ o.x.fillStyle=v3rgba('#000000',a||.2); o.x.fillRect(x0,y,w,h); },
  /* a shaded block: body, lit top edge, darker right side */
  block(o,x0,y,w,h,col){ HK.rect(o,x0,y,w,h,col); HK.sh(o,x0+w*.68,y,w*.32,h,.18); HK.hi(o,x0,y,w,1.2,.25); },

  /* ---------- the standing surface (deck) ---------- */
  deck(o,col,kind){ const x0=HF.x0(), w=o.pw-x0, y=o.dockY, th=HK.th(), fh=HK.fh(), top=HK.lt(col,.08), face=HK.dk(col,.24), at=f=>HK.at(o,f);
    HK.rect(o,x0,y+th,w,fh-th,face); HK.rect(o,x0,y,w,th,top);
    const seams=(n,c,jit)=>{ for(let i=1;i<n;i++){ const sx=at(i/n)+(jit?((i*37)%7-3):0); HK.line(o,[sx,y+.5,sx,y+th],c); } };
    switch(kind){
      case 'planks': seams(14,HK.dk(col,.32)); break;
      case 'boards': seams(11,HK.dk(col,.32),1); for(let i=0;i<11;i++) o.x.fillStyle=v3rgba(i%3?'#000000':'#ffffff',.06), o.x.fillRect(at(i/11),y,w/11,th); break;
      case 'logs': { const r=(fh-th)*.5, n=Math.max(8,Math.round(w/(r*2.05))); for(let i=0;i<n;i++){ const cx=at((i+.5)/n), cy=y+th+(fh-th)*.5; HK.circ(o,cx,cy,r,HK.lt(col,.12)); o.x.strokeStyle=HK.n(o,HK.dk(col,.35)); o.x.lineWidth=1; o.x.beginPath(); o.x.arc(cx,cy,r*.55,0,7); o.x.stroke(); } break; }
      case 'stone': { const n=7; for(let i=0;i<n;i++){ const a=at(i/n), b=at((i+1)/n); HK.rect(o,a+1,y+th,b-a-2,fh-th,i%2?HK.dk(col,.18):HK.dk(col,.28)); HK.line(o,[a,y,a,y+th],HK.dk(col,.4)); } break; }
      case 'bamboo': { const r=(fh-th)*.42, n=Math.round(w/(r*2.2)); for(let i=0;i<n;i++){ const cx=at((i+.5)/n); HK.circ(o,cx,y+th+(fh-th)*.5,r,HK.lt(col,.1)); HK.circ(o,cx,y+th+(fh-th)*.5,r*.45,HK.dk(col,.3)); } break; }
      case 'mat': for(let i=0;i<w;i+=3){ HK.line(o,[x0+i,y,x0+i+2,y+th],HK.dk(col,.2)); } break;
      case 'grate': for(let i=0;i<w;i+=4) HK.rect(o,x0+i,y+th+1,2,fh-th-2,HK.dk(col,.5)); break;
      case 'tile': seams(18,HK.dk(col,.3)); HK.line(o,[x0,y+th*.5,o.pw,y+th*.5],HK.dk(col,.25)); break;
      case 'marble': HK.rect(o,x0,y+th+(fh-th)*.35,w,Math.max(1.2,(fh-th)*.15),'#d8a830'); for(let i=0;i<6;i++) HK.curve(o,at(i/6),y+th+1,at(i/6+.05),y+fh*.5,at(i/6+.09),y+fh-1,HK.dk(col,.12)); break;
      case 'mosaic': for(let i=0;i<24;i++) HK.rect(o,at(i/24),y+th,w/24-.5,fh-th,['#2a4aa8','#d8a830','#c8683a','#f0ecf4'][i%4]); break;
      case 'carpet': for(let i=0;i<w;i+=6) HK.rect(o,x0+i,y,3,th,HK.dk(col,.08)); HK.rect(o,x0,y+th,w,Math.max(2,fh*.25),'#a8b0b8'); break;
      case 'concrete': for(let i=0;i<4;i++) HK.line(o,[at(i/4),y,at(i/4),y+fh],HK.dk(col,.2)); break;
      case 'walnut': seams(9,HK.dk(col,.35)); HK.hi(o,x0,y+1,w,1,.3); break;
      case 'cloud': for(let i=0;i<10;i++) HK.circ(o,at((i+.5)/10),y+fh*.75,fh*.55,HK.lt(col,.1)); break;
      case 'crystal': case 'moonstone': case 'glass': { const g=o.x.createLinearGradient(0,y,0,y+fh); g.addColorStop(0,v3rgba(HK.lt(col,.4),.95)); g.addColorStop(1,v3rgba(col,.6)); o.x.fillStyle=g; o.x.fillRect(x0,y,w,fh); if(kind!=='moonstone') for(let i=0;i<8;i++) HK.line(o,[at(i/8),y+fh,at(i/8+.06),y],v3rgba('#ffffff',.25)); if(kind==='glass') for(let i=0;i<5;i++) HK.line(o,[at(i/5+.02),y+fh*.6,at(i/5+.12),y+fh*.6,at(i/5+.12),y+fh*.3],'#3ae8ff',1); break; }
      case 'chrome': { const g=o.x.createLinearGradient(0,y,0,y+fh); g.addColorStop(0,'#f4f8ff'); g.addColorStop(.5,HK.n(o,col)); g.addColorStop(1,'#3a3e4a'); o.x.fillStyle=g; o.x.fillRect(x0,y,w,fh); break; }
      case 'carbon': for(let i=0;i<w;i+=4) HK.line(o,[x0+i,y,x0+i+3,y+fh],HK.lt(col,.12)); break;
      case 'snow': for(let i=0;i<9;i++) HK.circ(o,at((i+.5)/9),y+th*.4,th*1.1,HK.lt(col,.15)); break;
      case 'fur': for(let i=0;i<w;i+=2.5) HK.line(o,[x0+i,y+fh,x0+i+1,y+fh+H*.006],HK.dk(col,.1)); break;
      case 'hay': seams(11,HK.dk(col,.3)); for(let i=0;i<14;i++) HK.line(o,[at(i/14+.02),y,at(i/14+.04),y-H*.004],'#e0c060',1); break;
      case 'platter': case 'plate': { HK.ell(o,(x0+o.pw)/2,y+th,w*.52,fh*.7,kind==='plate'?'#f0f0f4':'#c8ccd8'); if(kind==='plate') HK.line(o,[x0,y+th*.7,o.pw,y+th*.7],'#5a7ad8',1.5); else HK.hi(o,x0,y,w,1.5,.5); break; }
      case 'cracker': for(let i=0;i<10;i++) HK.circ(o,at((i+.5)/10),y+th+(fh-th)*.5,1.2,HK.dk(col,.35)); break;
      case 'red': seams(12,HK.dk(col,.35)); HK.hi(o,x0,y,w,1.2,.25); break;
      default: seams(12,HK.dk(col,.3)); }
    HK.rim(o,x0,y,w); },

  /* ---------- supports from the deck down into the water ---------- */
  supports(o,col,kind,n){ const x0=HF.x0(), under=o.dockY+HK.fh(), at=f=>HK.at(o,f), cnt=n||5, w=['stone','boulder','crib','hay','tyres','cabinet','column','cloud','jetty'].includes(kind)?Math.max(8,W*.018):['stilts','pretzel','cane'].includes(kind)?Math.max(3,W*.006):Math.max(5,W*.011);
    const xs=[]; for(let i=0;i<cnt;i++) xs.push(Math.min(o.pw-w/2-1,at(.08+.89*i/(cnt-1))));
    const base={square:'square',fence:'square',hex:'square',iron:'round',round:'round',stilts:'round',tarred:'round',palm:'round',bamboo:'round',pretzel:'round',cane:'round',glass:'round',column:'round',wafer:'square',cabinet:'square',crib:'square',hay:'square',tyres:'round',stone:'stone',boulder:'stone',jetty:'stone',mangrove:'round',braced:'round'}[kind]||'round';
    if(kind==='braced'||kind==='crib'){ for(let i=0;i<xs.length-1;i++){ HK.line(o,[xs[i],under,xs[i+1],o.wl-H*.01],HK.dk(col,.2),Math.max(2,W*.004)); HK.line(o,[xs[i+1],under,xs[i],o.wl-H*.01],HK.dk(col,.2),Math.max(2,W*.004)); } }
    if(kind==='cloud'){ for(const px of xs){ for(let k=0;k<6;k++) HK.circ(o,px+(k%2?2:-2),under+k*H*.03,w*.7,v3rgba(HK.lt(col,.1),Math.max(.15,1-k*.15))); o.posts.push({x:px,w}); } return; }
    if(kind==='spires'||kind==='floatstones'||kind==='glowroots'||kind==='rings'||kind==='jets'||kind==='coils'){ HK.under(o,col,kind,xs); return; }
    for(const px of xs) hfPost(o,px,w,col,base,under);
    for(const px of xs){ const t=under, b=o.wl;
      if(kind==='bamboo'||kind==='palm') for(let y=t+H*.012;y<b;y+=H*.018) HK.rect(o,px-w/2,y,w,1.2,HK.dk(col,.35));
      if(kind==='hex') HK.line(o,[px-w*.15,t,px-w*.15,b],HK.dk(col,.4));
      if(kind==='column'){ for(let k=-1;k<=1;k++) HK.line(o,[px+k*w*.25,t,px+k*w*.25,b],HK.dk(col,.15)); HK.rect(o,px-w*.7,t,w*1.4,H*.006,HK.lt(col,.1)); }
      if(kind==='pretzel') for(let y=t;y<b;y+=H*.01) HK.circ(o,px+((y*7)%3-1),y,.7,'#f4f0e6');
      if(kind==='cane') for(let y=t;y<b;y+=H*.012) HK.rect(o,px-w/2,y,w,H*.005,'#f4f0e6');
      if(kind==='wafer') for(let y=t;y<b;y+=H*.008) HK.rect(o,px-w/2,y,w,1,HK.dk(col,.25));
      if(kind==='cabinet') for(let y=t+H*.004;y<b;y+=H*.016){ HK.rect(o,px-w*.4,y,w*.8,H*.012,HK.lt(col,.08)); HK.rect(o,px-w*.12,y+H*.005,w*.24,1.5,'#3a3e4a'); }
      if(kind==='hay') for(let y=t;y<b;y+=H*.014){ HK.rect(o,px-w/2,y,w,H*.012,'#e0c060'); HK.line(o,[px-w/2,y+H*.004,px+w/2,y+H*.004],'#a8843a'); }
      if(kind==='tyres') for(let y=t+H*.006;y<b;y+=H*.012) HK.ell(o,px,y,w*.6,H*.006,'#1e1e22');
      if(kind==='tarred'){ HK.rect(o,px-w*.65,b-H*.012,w*1.3,H*.012,HK.dk(col,.4)); }
      if(kind==='glass'){ HK.rect(o,px-w/2,t,w,b-t,v3rgba('#9ad0e0',.35)); HK.line(o,[px-w/2,t,px-w/2,b],'#3ae8ff'); }
      if(kind==='mangrove'){ HK.curve(o,px,t+H*.02,px-W*.01,b-H*.02,px-W*.014,b,col,2); HK.curve(o,px,t+H*.02,px+W*.01,b-H*.02,px+W*.015,b,col,2); }
      if(kind==='boulder'||kind==='jetty'){ HK.ell(o,px,b-H*.01,w*1.1,H*.022,HK.dk(col,.1)); HK.ell(o,px-w*.3,b-H*.026,w*.7,H*.016,HK.lt(col,.05)); } } },
  /* supports that don't touch the water: glowing, floating or hovering (Starfall, Circuit Lake) */
  under(o,col,kind,xs){ const t=o.dockY+HK.fh();
    for(const px of xs){ const g=o.x.createLinearGradient(0,t,0,o.wl+H*.08);
      if(kind==='spires'){ g.addColorStop(0,v3rgba(HK.lt(col,.3),.9)); g.addColorStop(1,v3rgba(col,0)); o.x.fillStyle=g; o.x.beginPath(); o.x.moveTo(px-W*.008,t); o.x.lineTo(px+W*.008,t); o.x.lineTo(px,o.wl+H*.08); o.x.fill(); }
      if(kind==='floatstones'){ HK.ell(o,px,t+H*.03,W*.01,H*.012,HK.dk(col,.2)); HK.ell(o,px+W*.006,t+H*.065,W*.006,H*.008,HK.dk(col,.25)); }
      if(kind==='glowroots'){ HK.curve(o,px,t,px-W*.01,t+H*.05,px+W*.004,o.wl+H*.05,v3rgba(HK.lt(col,.3),.7),2); }
      if(kind==='rings'){ for(let k=0;k<3;k++) { o.x.strokeStyle=v3rgba('#3ae8ff',.7-k*.2); o.x.lineWidth=1.5; o.x.beginPath(); o.x.ellipse(px,t+H*.01+k*H*.018,W*.012-k*W*.002,H*.004,0,0,7); o.x.stroke(); } }
      if(kind==='jets'){ g.addColorStop(0,'rgba(255,74,184,.85)'); g.addColorStop(1,'rgba(255,74,184,0)'); o.x.fillStyle=g; o.x.beginPath(); o.x.moveTo(px-W*.006,t); o.x.lineTo(px+W*.006,t); o.x.lineTo(px+W*.003,o.wl); o.x.lineTo(px-W*.003,o.wl); o.x.fill(); HK.rect(o,px-W*.007,t,W*.014,H*.01,'#3a3e4a'); }
      if(kind==='coils'){ for(let k=0;k<4;k++) HK.ell(o,px,t+H*.006+k*H*.008,W*.008,H*.004,k%2?'#7aff4a':'#3a3e4a'); } } },

  /* ---------- a hull for homes that float (boats, rafts) ---------- */
  hull(o,col,kind){ const x0=HF.x0(), x1=o.pw, y=o.dockY, wl=o.wl, at=f=>HK.at(o,f), d=wl+H*.02, bow=x1+W*.02, lit=HK.lit(o);
    const shape=(bt,sk)=>{ HK.poly(o,[x0,y,bow,y-H*(sk||0),x1-W*.005,d,x0+W*.01,bt||d],col); };
    switch(kind){
      case 'skiff': shape(d-H*.01,.004); HK.rect(o,x0,y,bow-x0,H*.005,HK.lt(col,.3)); break;
      case 'console': case 'sport': shape(d,.012); HK.rect(o,x0,y+H*.012,bow-x0,H*.006,'#1e3a5a'); break;
      case 'jon': HK.poly(o,[x0,y,x1+W*.01,y,x1,d,x0,d],col); HK.rect(o,x0,y+H*.02,x1-x0,H*.006,HK.dk(col,.2)); break;
      case 'cruiser': shape(d,.01); for(let i=0;i<4;i++) HK.line(o,[x0,y+H*(.008+i*.01),bow-W*.004*i,y+H*(.008+i*.01)],HK.dk(col,.25)); break;
      case 'work': case 'steel': case 'rusty': shape(d+H*.01,.008); HK.rect(o,x0,y+H*.008,bow-x0,H*.006,'#1a1c20'); if(kind==='rusty') for(let i=0;i<9;i++) HK.rect(o,at(i/9+.03),y+H*.016,1.5,H*.03,'#8a4a2a'); break;
      case 'woodsteel': shape(d,.006); HK.rect(o,x0,y,bow-x0,H*.008,'#a8743a'); break;
      case 'reed': case 'barque': { HK.poly(o,[x0-W*.01,y-H*.03,x0+W*.01,y,x1-W*.01,y,bow+W*.005,y-H*.035,x1,d,x0,d],col); for(let i=0;i<10;i++) HK.line(o,[at(i/10),y+H*.004,at(i/10)+W*.004,d-H*.004],HK.dk(col,.25)); if(kind==='barque') for(const f of [.2,.5,.8]) HK.rect(o,at(f),y,W*.004,d-y,'#d8a830'); break; }
      case 'felucca': shape(d,.02); for(let i=0;i<3;i++) HK.line(o,[x0,y+H*(.01+i*.012),bow-W*.006,y+H*(.01+i*.012)],HK.dk(col,.3)); break;
      case 'barrels': { const n=6; for(let i=0;i<n;i++){ const cx=at((i+.5)/n); HK.ell(o,cx,wl,W*.012,H*.03,col); HK.rect(o,cx-W*.012,wl-H*.012,W*.024,1.5,'#5a5a5a'); HK.rect(o,cx-W*.012,wl+H*.01,W*.024,1.5,'#5a5a5a'); } HK.deck(o,'#6a5a48','boards'); return; }
      case 'planks': HK.rect(o,x0,y,x1-x0,wl-y+H*.006,HK.dk(col,.15)); for(let i=0;i<9;i++) HK.line(o,[at(i/9),y,at(i/9),wl],HK.dk(col,.4)); break;
      case 'door': HK.rect(o,x0,y,x1-x0,wl-y,col); HK.rect(o,at(.15),y+2,W*.01,wl-y-4,HK.dk(col,.2)); HK.rect(o,at(.6),y+2,W*.01,wl-y-4,HK.dk(col,.2)); HK.circ(o,at(.9),y+(wl-y)*.5,1.6,'#a8884a'); break;
      default: shape(d,.008); }
    HK.hi(o,x0,y,bow-x0,1.2,.3); o.posts.push({x:x1,w:W*.02},{x:x0+W*.02,w:W*.02}); /* the water flowing past the hull ends */ },

  /* ---------- roofs and canopies (side view) ---------- */
  roof(o,col,kind,f0,f1){ const a=HK.at(o,f0==null?.03:f0), b=HK.at(o,f1==null?.47:f1), y=o.dockY, c=col, wood=HK.dk(col,.4), lit=HK.lit(o), post=(px,top)=>HK.rect(o,px-1.5,top,3,y-top,wood);
    switch(kind){
      case 'umbrella': case 'beachumbrella': case 'logoumbrella': { const ux=(a+b)/2, R=(b-a)*.48, ty=y-H*.17, ey=ty+H*.03; HK.rect(o,ux-1.2,ty,2.4,y-ty,'#3a3a40'); HK.rect(o,ux-H*.007,y-H*.004,H*.014,H*.004,'#3a3a40');
        HK.poly(o,[ux-R,ey,ux-R*.55,ty-H*.004,ux,ty-H*.012,ux+R*.55,ty-H*.004,ux+R,ey],c); if(kind==='beachumbrella') for(let i=0;i<3;i++) HK.poly(o,[ux-R+i*R*.66,ey,ux-R*.55+i*R*.5,ty-H*.003,ux-R*.3+i*R*.5,ty-H*.006,ux-R*.66+i*R*.66,ey],'#f4efe6');
        if(kind==='logoumbrella') HK.circ(o,ux,ty+H*.012,H*.008,'#f4f6f8'); for(let i=0;i<6;i++) HK.circ(o,ux-R+(2*R)*(i+.5)/6,ey,R/6.5,HK.dk(c,.22)); HK.circ(o,ux,ty-H*.015,2,'#2a2a2e'); break; }
      case 'leanto': case 'shingle': case 'tin': case 'canvas': { const y1=y-H*.18, y2=y-H*.14, t2=H*.012; post(a,y1); post(b,y2); HK.poly(o,[a-W*.008,y1-t2*.5,b+W*.01,y2-t2*.5,b+W*.01,y2+t2*.5,a-W*.008,y1+t2*.5],c);
        const n=kind==='tin'?14:7; for(let i=1;i<n;i++){ const u=i/n; HK.line(o,[a+(b-a)*u,y1+(y2-y1)*u-t2*.5,a+(b-a)*u,y1+(y2-y1)*u+t2*.5],v3rgba('#000000',.2)); } HK.line(o,[a-W*.008,y1-t2*.5,b+W*.01,y2-t2*.5],v3rgba(o.P.rim||'#fff0d0',.4*lit),1.2); break; }
      case 'sail': { const py=y-H*.17, t2=Math.max(2.4,H*.0055); post(a,py); post(b,py+H*.008); o.x.fillStyle=HK.n(o,c); o.x.beginPath(); o.x.moveTo(a,py); o.x.quadraticCurveTo((a+b)/2,py+H*.024,b,py+H*.008); o.x.lineTo(b,py+H*.008+t2); o.x.quadraticCurveTo((a+b)/2,py+H*.024+t2,a,py+t2); o.x.fill(); break; }
      case 'gable': case 'slate': case 'barn': case 'aframe': case 'shack': { const h=kind==='aframe'?H*.2:H*.08, base=y-H*.12, m=(a+b)/2; if(kind!=='aframe'){ post(a+W*.004,base); post(b-W*.004,base); }
        HK.poly(o,[a-W*.01,kind==='aframe'?y:base,m,base-h,b+W*.01,kind==='aframe'?y:base],c); HK.poly(o,[m,base-h,b+W*.01,kind==='aframe'?y:base,m+(b-m)*.2,kind==='aframe'?y:base],HK.dk(c,.18));
        if(kind==='slate') for(let i=1;i<5;i++) HK.line(o,[a+(m-a)*i/5,base-h*i/5,b-(b-m)*i/5,base-h*i/5],HK.dk(c,.3)); if(kind==='barn') HK.rect(o,m-W*.006,base-h*.55,W*.012,h*.4,'#f4f0e6'); break; }
      case 'shackbox': { const top=y-H*.13; HK.block(o,a,top,b-a,y-top,c); HK.poly(o,[a-W*.006,top,b+W*.008,top-H*.03,b+W*.008,top-H*.02,a-W*.006,top+H*.008],HK.dk(c,.35)); HK.rect(o,a+(b-a)*.55,top+H*.04,(b-a)*.2,y-top-H*.04,HK.dk(c,.35)); break; }
      case 'curved': case 'tiled': { const base=y-H*.13; post(a+W*.006,base); post(b-W*.006,base); o.x.fillStyle=HK.n(o,c); o.x.beginPath(); o.x.moveTo(a-W*.016,base-H*.02); o.x.quadraticCurveTo(a,base-H*.004,(a+b)/2,base-H*.05); o.x.quadraticCurveTo(b,base-H*.004,b+W*.016,base-H*.02); o.x.lineTo(b+W*.01,base); o.x.lineTo(a-W*.01,base); o.x.fill(); for(let i=1;i<8;i++) HK.line(o,[a+(b-a)*i/8,base-H*.012,a+(b-a)*i/8,base],HK.dk(c,.3)); break; }
      case 'thatch': case 'thatchgate': { const base=y-H*.12, m=(a+b)/2; post(a+W*.006,base); post(b-W*.006,base); o.x.fillStyle=HK.n(o,c); o.x.beginPath(); o.x.moveTo(a-W*.014,base+H*.006); o.x.quadraticCurveTo(m,base-H*.11,b+W*.014,base+H*.006); o.x.fill(); for(let i=0;i<16;i++){ const px=a-W*.014+(b-a+W*.028)*i/16; HK.line(o,[px,base+H*.006,px+1,base+H*.016],HK.dk(c,.25)); } break; }
      case 'torii': { const top=y-H*.17; HK.rect(o,a+W*.004,top,W*.006,y-top,c); HK.rect(o,b-W*.01,top,W*.006,y-top,c); HK.rect(o,a-W*.004,top+H*.025,b-a+W*.008,H*.008,c); o.x.fillStyle=HK.n(o,HK.dk(c,.2)); o.x.beginPath(); o.x.moveTo(a-W*.014,top-H*.006); o.x.quadraticCurveTo((a+b)/2,top+H*.004,b+W*.014,top-H*.006); o.x.lineTo(b+W*.012,top+H*.004); o.x.quadraticCurveTo((a+b)/2,top+H*.012,a-W*.012,top+H*.004); o.x.fill(); break; }
      case 'leaf': { const base=y-H*.16; HK.curve(o,a+W*.004,y,a,base,a+W*.01,base-H*.01,'#3a6a2a',2); o.x.fillStyle=HK.n(o,c); o.x.beginPath(); o.x.moveTo(a+W*.008,base-H*.012); o.x.quadraticCurveTo((a+b)*.5,base-H*.06,b+W*.012,base+H*.02); o.x.quadraticCurveTo((a+b)*.5,base-H*.01,a+W*.008,base-H*.012); o.x.fill(); HK.curve(o,a+W*.008,base-H*.012,(a+b)*.5,base-H*.035,b+W*.012,base+H*.02,HK.dk(c,.3),1); break; }
      case 'fronds': { const base=y-H*.14; post(a,base); post(b,base+H*.02); for(let i=0;i<7;i++){ const px=a+(b-a)*i/6; o.x.fillStyle=HK.n(o,i%2?c:HK.dk(c,.15)); o.x.beginPath(); o.x.moveTo(px-W*.02,base+(px-a)/(b-a)*H*.02); o.x.quadraticCurveTo(px,base-H*.02,px+W*.02,base+H*.012+(px-a)/(b-a)*H*.02); o.x.fill(); } break; }
      case 'flat': case 'ttop': case 'hardtop': case 'glass': case 'ceiling': case 'overhang': { const top=y-H*.15, tt=H*.008; post(a+W*.006,top); post(b-W*.006,top);
        HK.rect(o,a-W*.008,top-tt,b-a+W*.016,tt,kind==='glass'?v3rgba(c,.55):c); HK.hi(o,a-W*.008,top-tt,b-a+W*.016,1,.4); if(kind==='ceiling') for(let i=0;i<6;i++) HK.line(o,[a+(b-a)*i/6,top-tt,a+(b-a)*i/6,top],HK.dk(c,.3)); break; }
      case 'bimini': { const top=y-H*.15; HK.curve(o,a,y,a+W*.004,top+H*.02,a+W*.012,top,'#c0c8cc',1.6); HK.curve(o,b,y,b-W*.004,top+H*.02,b-W*.012,top,'#c0c8cc',1.6); o.x.fillStyle=HK.n(o,c); o.x.beginPath(); o.x.moveTo(a,top+H*.006); o.x.quadraticCurveTo((a+b)/2,top-H*.03,b,top+H*.006); o.x.lineTo(b,top+H*.014); o.x.quadraticCurveTo((a+b)/2,top-H*.02,a,top+H*.014); o.x.fill(); break; }
      case 'tent': case 'stripedtent': case 'walltent': { const m=(a+b)/2, top=y-H*.15; HK.poly(o,[a-W*.006,y,m,top,b+W*.006,y],c); if(kind==='stripedtent') for(let i=1;i<6;i+=2) HK.poly(o,[a+(m-a)*i/6,y-(y-top)*i/6,a+(m-a)*(i+1)/6,y-(y-top)*(i+1)/6,a+(m-a)*(i+1)/6,y,a+(m-a)*i/6,y],'#f0e8d4'); HK.poly(o,[m,top,b+W*.006,y,m+(b-m)*.25,y],HK.dk(c,.2)); if(kind==='walltent'){ HK.rect(o,m+W*.01,top-H*.04,2.5,H*.05,'#2a2a30'); } break; }
      case 'cloche': { const m=(a+b)/2, R=(b-a)*.4, top=y-H*.06; o.x.fillStyle=HK.n(o,c); o.x.beginPath(); o.x.ellipse(m,top,R,H*.06,-.25,Math.PI,0); o.x.fill(); HK.circ(o,m-R*.1,top-H*.06,2.5,c); HK.hi(o,m-R*.6,top-H*.03,R*.6,1.5,.5); break; }
      case 'cone': { const m=(a+b)/2, top=y-H*.17; HK.rect(o,m-1,top,2,y-top,'#f4f0e6'); HK.poly(o,[m-(b-a)*.32,top,m,top+H*.05,m+(b-a)*.32,top],c); HK.ell(o,m,top-H*.006,(b-a)*.3,H*.01,'#f4a0b0'); break; }
      case 'pediment': { const top=y-H*.14; post(a+W*.008,top); post(b-W*.008,top); HK.rect(o,a,top,b-a,H*.01,c); HK.poly(o,[a-W*.008,top,(a+b)/2,top-H*.045,b+W*.008,top],c); HK.poly(o,[a+W*.01,top-H*.004,(a+b)/2,top-H*.034,b-W*.01,top-H*.004],HK.dk(c,.12)); break; }
      case 'crescent': case 'neonarch': case 'rainbow': case 'sundisc': case 'ring': case 'bower': { const m=(a+b)/2, R=(b-a)*.5, cy=y;
        if(kind==='rainbow'){ ['#e84a4a','#f8a050','#f4e07a','#7aff4a','#3a8ae8','#8a3a9a'].forEach((cc,i)=>{ o.x.strokeStyle=HK.n(o,cc); o.x.lineWidth=2; o.x.beginPath(); o.x.arc(m,cy,R-i*2,Math.PI,0); o.x.stroke(); }); break; }
        if(kind==='ring'){ o.x.strokeStyle=HK.n(o,c); o.x.lineWidth=2.5; o.x.beginPath(); o.x.ellipse(m,cy-H*.12,R,H*.03,-.15,0,7); o.x.stroke(); HK.circ(o,m,cy-H*.12,H*.02,HK.lt(c,.2)); break; }
        if(kind==='sundisc'){ HK.circ(o,m,cy-H*.13,H*.025,'#f0c84a'); HK.poly(o,[m-H*.025,cy-H*.13,m-R,cy-H*.15,m-R*.8,cy-H*.12],c); HK.poly(o,[m+H*.025,cy-H*.13,m+R,cy-H*.15,m+R*.8,cy-H*.12],c); post(m,cy-H*.105); break; }
        o.x.strokeStyle=HK.n(o,c); o.x.lineWidth=kind==='neonarch'?3:H*.012; o.x.beginPath(); o.x.arc(m,cy,R,Math.PI,0); o.x.stroke(); if(kind==='neonarch'){ o.x.strokeStyle=v3rgba(c,.3); o.x.lineWidth=8; o.x.stroke(); }
        if(kind==='bower') for(let i=0;i<9;i++){ const an=Math.PI+Math.PI*i/8; HK.circ(o,m+Math.cos(an)*R,cy+Math.sin(an)*R,H*.008,'#ffb8e0'); } break; }
      case 'slab': { HK.ell(o,a+W*.004,y-H*.004,W*.006,H*.006,'#3a3436'); HK.ell(o,b-W*.004,y-H*.004,W*.006,H*.006,'#3a3436'); HK.rect(o,a-W*.008,y-H*.13,b-a+W*.016,H*.012,c); post(a+W*.004,y-H*.12); post(b-W*.004,y-H*.12); break; }
      case 'iron': { const top=y-H*.14; HK.rect(o,a+W*.004,top,2,y-top,'#3a3436'); HK.rect(o,b-W*.004,top,2,y-top,'#3a3436'); HK.poly(o,[a-W*.008,top,(a+b)/2,top-H*.04,b+W*.008,top],c); HK.line(o,[a-W*.008,top,(a+b)/2,top-H*.04,b+W*.008,top],'#3a3436',1.5); break; }
      case 'holo': { const top=y-H*.15; o.x.fillStyle=v3rgba(c,.35); o.x.beginPath(); o.x.moveTo(a,top); o.x.quadraticCurveTo((a+b)/2,top-H*.03,b,top); o.x.lineTo(b,top+H*.008); o.x.quadraticCurveTo((a+b)/2,top-H*.02,a,top+H*.008); o.x.fill(); for(let i=0;i<5;i++) HK.line(o,[a+(b-a)*i/4,top,a+(b-a)*i/4,y],v3rgba(c,.25)); break; }
      default: break; } },

  /* ---------- rails and edges ---------- */
  rail(o,col,kind){ const x0=HF.x0(), y=o.dockY, rh=H*.045, at=f=>HK.at(o,f), w=o.pw-x0, c=col;
    switch(kind){
      case 'rope': case 'chain': case 'velvet': case 'licorice': case 'garland': { const xs=[.02,.27,.52,.77,.98]; for(const f of xs) HK.rect(o,at(f)-1.5,y-rh,3,rh,kind==='velvet'?'#d8a830':HK.dk(c,.3));
        for(let i=0;i<xs.length-1;i++) HK.curve(o,at(xs[i]),y-rh*.85,(at(xs[i])+at(xs[i+1]))/2,y-rh*.45,at(xs[i+1]),y-rh*.85,kind==='garland'?'#6a8a4a':kind==='chain'?'#5a5a5a':c,Math.max(1.6,H*(kind==='garland'?.006:.0035)));
        if(kind==='garland') for(let i=0;i<16;i++) HK.circ(o,at(.02+.96*i/15),y-rh*(.55+.25*Math.abs(Math.sin(i*1.57))),H*.004,'#8a9a5a'); break; }
      case 'slat': case 'postrail': case 'oak': case 'weathered': case 'bamboo': case 'lacquer': case 'breadstick': { const n=kind==='bamboo'?8:6; for(let i=0;i<=n;i++) HK.rect(o,at(i/n)-2,y-rh,4,rh,c); HK.rect(o,x0,y-rh,w,Math.max(3,H*.006),c); if(kind!=='lacquer') HK.rect(o,x0,y-rh*.5,w,Math.max(2,H*.004),c); HK.rim(o,x0,y-rh,w); break; }
      case 'log': { const ly=y-rh*.5, lr=Math.max(2.5,H*.0055); for(let i=0;i<=4;i++) HK.rect(o,at(i/4)-2,ly,4,y-ly,HK.dk(c,.3)); HK.rect(o,x0,ly-lr,w,lr*2,c); HK.sh(o,x0,ly+lr*.2,w,lr*.8,.22); HK.hi(o,x0,ly-lr,w,1.2,.22); break; }
      case 'picket': for(let i=0;i<=18;i++){ const px=at(i/18); HK.poly(o,[px-1.6,y,px-1.6,y-rh*.8,px,y-rh,px+1.6,y-rh*.8,px+1.6,y],c); } HK.rect(o,x0,y-rh*.55,w,2,c); break;
      case 'iron': case 'gold': { const ic=kind==='gold'?'#d8a830':HK.dk(c,.5); HK.rect(o,x0,y-rh,w,2.2,ic); for(let i=0;i<=12;i++) HK.rect(o,at(i/12)-.8,y-rh,1.6,rh,ic); if(kind==='gold') for(let i=0;i<=12;i+=3) HK.circ(o,at(i/12),y-rh-2,2,'#f4d060'); break; }
      case 'glass': HK.rect(o,x0,y-rh,w,rh,v3rgba('#9ad0e0',.3)); HK.rect(o,x0,y-rh,w,2.2,'#a8b0b8'); for(let i=0;i<=6;i++) HK.rect(o,at(i/6)-1,y-rh,2,rh,'#a8b0b8'); break;
      case 'cubicle': HK.block(o,x0,y-rh*1.1,w,rh*1.1,c); HK.rect(o,x0,y-rh*1.1,w,2,'#a8b0b8'); break;
      case 'balustrade': HK.rect(o,x0,y-rh,w,H*.006,c); for(let i=0;i<=16;i++){ const px=at(i/16); HK.ell(o,px,y-rh*.5,W*.003,rh*.38,c); } HK.rect(o,x0,y-H*.004,w,H*.004,c); break;
      case 'icing': o.x.strokeStyle=HK.n(o,c); o.x.lineWidth=2.4; o.x.beginPath(); for(let i=0;i<=40;i++){ const px=at(i/40), py=y-rh*.4-Math.sin(i*1.2)*H*.004; if(!i) o.x.moveTo(px,py); else o.x.lineTo(px,py); } o.x.stroke(); break;
      case 'neon': case 'holo': case 'cable': HK.rect(o,x0,y-(kind==='neon'?2:rh),w,kind==='neon'?2.4:2,c); if(kind!=='neon') for(let i=0;i<=6;i++) HK.rect(o,at(i/6)-1,y-rh,2,rh,kind==='holo'?v3rgba(c,.5):'#3a3e4a'); o.x.fillStyle=v3rgba(c,.25); o.x.fillRect(x0,y-(kind==='neon'?4:rh+2),w,4); break;
      case 'lowwall': for(let i=0;i<8;i++) HK.block(o,at(i/8)+.5,y-rh*.55,w/8-1,rh*.55,i%2?c:HK.dk(c,.1)); break;
      case 'wheel': HK.rect(o,x0,y-rh*.55,w,2.4,c); for(const f of [.02,.98]){ o.x.strokeStyle=HK.n(o,HK.dk(c,.2)); o.x.lineWidth=2; o.x.beginPath(); o.x.arc(at(f),y-rh*.5,rh*.5,0,7); o.x.stroke(); for(let k=0;k<6;k++){ const an=k*Math.PI/3; HK.line(o,[at(f),y-rh*.5,at(f)+Math.cos(an)*rh*.5,y-rh*.5+Math.sin(an)*rh*.5],HK.dk(c,.2)); } } break;
      default: break; } },

  /* ---------- lights: draw the fixture, return the glow spot (cv_homefmt draws the glow live) ---------- */
  light(o,kind,px){ const x=px==null?HF.lightX():px, y=o.dockY, iron='#2a2a30', L=(lx,ly,r,a,extra)=>Object.assign({x:lx,y:ly,r:r||.16,a:a||.55},extra||{});
    const pole=(h,col)=>HK.rect(o,x-1.4,y-h,2.8,h,col||iron), foot=()=>HK.rect(o,x-H*.006,y-H*.004,H*.012,H*.004,iron);
    const lantern=(lx,ly,gw)=>{ HK.rect(o,lx-gw*.6,ly-gw*1.1,gw*1.2,2,iron); HK.ell(o,lx,ly,gw*.5,gw*.8,v3rgba('#e8f0f4',.35)); HK.rect(o,lx-gw*.6,ly+gw*.8,gw*1.2,2,iron); };
    switch(kind){
      case 'post': pole(H*.1); foot(); lantern(x,y-H*.105,H*.012); return L(x,y-H*.105);
      case 'hook': pole(H*.11); HK.rect(o,x-H*.016,y-H*.11,H*.016,2,iron); lantern(x-H*.014,y-H*.085,H*.011); return L(x-H*.014,y-H*.085);
      case 'table': HK.rect(o,x-H*.012,y-H*.006,H*.024,H*.006,iron); lantern(x,y-H*.022,H*.012); return L(x,y-H*.022,.14,.5);
      case 'paperline': { const a=HK.at(o,.05), b=o.pw-W*.01, top=y-H*.14; HK.rect(o,b-1,top,2,y-top,'#5a3a26'); HK.curve(o,a,top+H*.01,(a+b)/2,top+H*.03,b,top,'#3a2a20',1); for(let i=1;i<5;i++){ const u=i/5, lx=a+(b-a)*u, ly=top+H*.01+H*.022*(1-Math.pow(2*u-1,2))-u*H*.01; HK.ell(o,lx,ly+H*.01,H*.007,H*.009,'#f0a848'); } return L((a+b)/2,top+H*.03,.2,.55); }
      case 'toro': HK.rect(o,x-H*.008,y-H*.008,H*.016,H*.008,'#9a948a'); HK.rect(o,x-2,y-H*.03,4,H*.022,'#9a948a'); HK.rect(o,x-H*.009,y-H*.046,H*.018,H*.016,'#9a948a'); HK.rect(o,x-H*.005,y-H*.043,H*.01,H*.01,'#f0a848'); HK.poly(o,[x-H*.014,y-H*.046,x,y-H*.058,x+H*.014,y-H*.046],'#6a665e'); return L(x,y-H*.038,.13,.5);
      case 'chochin': pole(H*.12,'#5a3a26'); HK.ell(o,x-H*.012,y-H*.09,H*.011,H*.016,'#d8302a'); HK.rect(o,x-H*.02,y-H*.106,H*.016,2,'#2a2426'); return L(x-H*.012,y-H*.09,.17,.6);
      case 'cage': pole(H*.1); HK.rect(o,x,y-H*.1,H*.014,2,iron); o.x.strokeStyle=HK.n(o,iron); o.x.lineWidth=1; o.x.strokeRect(x+H*.006,y-H*.096,H*.014,H*.02); return L(x+H*.013,y-H*.086);
      case 'hanging': pole(H*.11); HK.curve(o,x,y-H*.11,x-H*.012,y-H*.112,x-H*.016,y-H*.1,iron,1.4); HK.ell(o,x-H*.016,y-H*.088,H*.006,H*.01,'#e8d8a0'); return L(x-H*.016,y-H*.088,.13);
      case 'candle': case 'millcandle': HK.ell(o,x,y-H*.004,H*.014,H*.005,'#9a948a'); HK.rect(o,x-H*.003,y-H*.024,H*.006,H*.02,'#f4ece0'); HK.ell(o,x,y-H*.028,1.4,2.6,'#ffd060'); return L(x,y-H*.028,.11,.5,{small:1});
      case 'lighthouse': HK.rect(o,x-H*.006,y-H*.07,H*.012,H*.07,'#f4f0e6'); for(let i=0;i<3;i++) HK.rect(o,x-H*.006,y-H*.06+i*H*.02,H*.012,H*.008,'#c8483a'); HK.rect(o,x-H*.008,y-H*.085,H*.016,H*.015,'#e8f0f4'); HK.poly(o,[x-H*.01,y-H*.085,x,y-H*.095,x+H*.01,y-H*.085],'#c8483a'); return L(x,y-H*.078,.16);
      case 'buoy': pole(H*.11); HK.line(o,[x,y-H*.11,x-H*.014,y-H*.11,x-H*.014,y-H*.08],'#c8a878',1); HK.circ(o,x-H*.014,y-H*.072,H*.008,'#c8483a'); return L(x-H*.014,y-H*.082,.14);
      case 'stove': { HK.block(o,x-H*.016,y-H*.026,H*.03,H*.026,iron); HK.rect(o,x-H*.008,y-H*.018,H*.012,H*.008,'#f0983a'); HK.rect(o,x+H*.004,y-H*.075,H*.005,H*.05,iron); for(let i=0;i<3;i++) HK.circ(o,x+H*.006+i*H*.004,y-H*.08-i*H*.008,H*.004+i*.6,v3rgba('#c8ccd0',.35-i*.08)); return L(x-H*.002,y-H*.014,.15,.55); }
      case 'stake': HK.rect(o,x-1,y-H*.05,2,H*.05,'#7a5440'); lantern(x,y-H*.06,H*.011); return L(x,y-H*.06);
      case 'campfire': case 'firering': case 'firebowl': { if(kind==='firebowl') HK.poly(o,[x-H*.018,y-H*.02,x+H*.018,y-H*.02,x+H*.01,y,x-H*.01,y],'#3a3436'); else for(let i=0;i<5;i++) HK.ell(o,x-H*.016+i*H*.008,y-H*.003,H*.005,H*.004,'#7a7a74');
        HK.poly(o,[x-H*.01,y-H*.006,x-H*.004,y-H*.03,x,y-H*.018,x+H*.005,y-H*.034,x+H*.01,y-H*.006],'#ff7a2a'); HK.poly(o,[x-H*.005,y-H*.006,x,y-H*.022,x+H*.005,y-H*.006],'#ffd060'); if(kind==='firering'){ HK.rect(o,x-H*.016,y-H*.042,H*.032,1.5,iron); HK.ell(o,x,y-H*.036,H*.008,H*.006,iron); } return L(x,y-H*.016,.2,.65); }
      case 'tiki': pole(H*.1,'#b8b06a'); for(let y2=y-H*.09;y2<y;y2+=H*.012) HK.rect(o,x-1.4,y2,2.8,1.2,'#7a6a3a'); HK.poly(o,[x-H*.004,y-H*.1,x,y-H*.118,x+H*.004,y-H*.1],'#ff7a2a'); return L(x,y-H*.106,.17,.6);
      case 'shells': pole(H*.1,'#9a7a52'); HK.line(o,[x,y-H*.1,x-H*.012,y-H*.09],'#c8a878'); for(let i=0;i<4;i++) HK.circ(o,x-H*.012,y-H*.086+i*H*.006,H*.004,'#fbf2e4'); return L(x-H*.012,y-H*.08,.13);
      case 'floats': { const a=HK.at(o,.5), b=o.pw-W*.006; HK.rect(o,b-1,y-H*.1,2,H*.1,'#9a7a52'); HK.curve(o,a,y-H*.08,(a+b)/2,y-H*.06,b,y-H*.1,'#c8a878',1); for(let i=1;i<4;i++) HK.circ(o,a+(b-a)*i/4,y-H*.075+Math.sin(i)*H*.004,H*.006,'#7ae8e0'); return L((a+b)/2,y-H*.07,.17); }
      case 'navlight': HK.rect(o,x-1,y-H*.05,2,H*.05,'#c0c8cc'); HK.circ(o,x-H*.004,y-H*.052,H*.004,'#e84a4a'); HK.circ(o,x+H*.004,y-H*.052,H*.004,'#4ad86a'); return L(x,y-H*.052,.12,.5);
      case 'deck': case 'brass': HK.rect(o,x-H*.004,y-H*.03,H*.008,H*.03,'#c8a04a'); lantern(x,y-H*.04,H*.011); return L(x,y-H*.04);
      case 'mast': HK.rect(o,x-1.2,y-H*.17,2.4,H*.17,'#c0c8cc'); HK.circ(o,x,y-H*.172,H*.005,'#fff4cc'); return L(x,y-H*.172,.12,.5,{small:1});
      case 'flood': case 'floodpole': pole(H*.13,'#3a424c'); HK.poly(o,[x-H*.002,y-H*.13,x-H*.02,y-H*.122,x-H*.02,y-H*.108,x-H*.002,y-H*.116],'#3a424c'); HK.rect(o,x-H*.021,y-H*.122,2,H*.014,'#f4eccc'); return L(x-H*.02,y-H*.115,.22,.7);
      case 'workcage': HK.rect(o,x-H*.008,y-H*.03,H*.016,H*.03,'#3a424c'); o.x.strokeStyle=HK.n(o,'#f0782a'); o.x.lineWidth=1; o.x.strokeRect(x-H*.007,y-H*.028,H*.014,H*.016); return L(x,y-H*.02,.14);
      case 'gourd': HK.circ(o,x,y-H*.012,H*.011,'#c8a85a'); HK.rect(o,x-1,y-H*.03,2,H*.008,'#7a5a3a'); HK.ell(o,x,y-H*.034,1.4,2.6,'#ffd060'); return L(x,y-H*.024,.13);
      case 'fireflybasket': HK.ell(o,x,y-H*.016,H*.012,H*.014,'#a8843a'); for(let i=0;i<5;i++) HK.line(o,[x-H*.012,y-H*.03+i*H*.006,x+H*.012,y-H*.03+i*H*.006],'#7a5a2a'); return L(x,y-H*.016,.12,.5,{jar:1});
      case 'torch': pole(H*.1,'#b8b06a'); HK.poly(o,[x-H*.005,y-H*.1,x,y-H*.12,x+H*.005,y-H*.1],'#ff7a2a'); return L(x,y-H*.108,.17,.6);
      case 'jelly': case 'jellyjar': HK.ell(o,x,y-H*.016,H*.01,H*.014,v3rgba('#5afff0',.4)); HK.rect(o,x-H*.006,y-H*.032,H*.012,2,'#6a5a48'); return L(x,y-H*.016,.13,.5,{jar:1});
      case 'wreck': pole(H*.12,'#3a3028'); HK.rect(o,x-H*.02,y-H*.12,H*.02,2,'#3a3028'); HK.ell(o,x-H*.018,y-H*.1,H*.008,H*.011,'#a8884a'); return L(x-H*.018,y-H*.1);
      case 'chain': pole(H*.12,'#3a3436'); for(let i=0;i<4;i++) HK.ell(o,x-H*.014,y-H*.115+i*H*.007,1.3,2.3,'#5a4a44'); HK.block(o,x-H*.024,y-H*.088,H*.02,H*.024,'#3a3436'); HK.rect(o,x-H*.02,y-H*.082,H*.012,H*.012,'#ff9a5a'); return L(x-H*.014,y-H*.076,.16);
      case 'lavabowl': HK.poly(o,[x-H*.016,y-H*.016,x+H*.016,y-H*.016,x+H*.01,y,x-H*.01,y],'#4a3a3a'); for(let i=0;i<4;i++) HK.circ(o,x-H*.009+i*H*.006,y-H*.017,H*.004,i%2?'#ff7a2a':'#ffc04a'); return L(x,y-H*.018,.15,.6);
      case 'steam': pole(H*.08,'#3a3436'); HK.ell(o,x,y-H*.088,H*.009,H*.012,'#ffd8b0'); for(let i=0;i<3;i++) HK.circ(o,x+i*H*.004,y-H*.11-i*H*.01,H*.005,v3rgba('#f0e8e4',.3)); return L(x,y-H*.088);
      case 'star': pole(H*.1,'#c8c8d8'); HK.ell(o,x-H*.012,y-H*.085,H*.009,H*.012,v3rgba('#e8e0f4',.5)); HK.circ(o,x-H*.012,y-H*.085,H*.004,'#fff8ff'); HK.rect(o,x-H*.012,y-H*.1,H*.012,1.5,'#c8c8d8'); return L(x-H*.012,y-H*.085,.18,.65);
      case 'moon': HK.rect(o,x-1,y-H*.05,2,H*.05,'#c8c8d8'); HK.circ(o,x,y-H*.06,H*.012,'#f0e8d0'); return L(x,y-H*.06,.2,.6);
      case 'wisps': for(let i=0;i<5;i++) HK.circ(o,x-H*.03+i*H*.012,y-H*.06-Math.sin(i*1.3)*H*.02,1.6,'#fff8ff'); return L(x-H*.006,y-H*.065,.2,.5,{small:1});
      case 'nail': pole(H*.1,'#8a6a4a'); HK.rect(o,x-H*.004,y-H*.088,H*.004,2,iron); lantern(x-H*.01,y-H*.078,H*.01); return L(x-H*.01,y-H*.078);
      case 'bulbs': { const a=HK.at(o,.05), b=o.pw-W*.01, top=y-H*.12; HK.rect(o,b-1,top,2,y-top,'#5a4030'); HK.curve(o,a,top+H*.02,(a+b)/2,top+H*.04,b,top,'#2a2a2e',1); for(let i=1;i<7;i++){ const u=i/7; HK.circ(o,a+(b-a)*u,top+H*.02+H*.028*(1-Math.pow(2*u-1,2))-u*H*.02+H*.004,1.8,'#ffe8a0'); } return L((a+b)/2,top+H*.04,.22,.45); }
      case 'milkcan': HK.rect(o,x-H*.008,y-H*.024,H*.016,H*.024,'#a8b0b4'); lantern(x,y-H*.036,H*.01); return L(x,y-H*.036,.14);
      case 'dripcandle': HK.rect(o,x-H*.004,y-H*.04,H*.008,H*.04,'#f4ece0'); HK.ell(o,x+H*.003,y-H*.03,1.2,H*.006,'#f4ece0'); HK.ell(o,x,y-H*.045,1.5,2.8,'#ffd060'); return L(x,y-H*.045,.13,.55,{small:1});
      case 'cupcake': HK.poly(o,[x-H*.012,y-H*.014,x+H*.012,y-H*.014,x+H*.009,y,x-H*.009,y],'#d88a3a'); HK.ell(o,x,y-H*.016,H*.013,H*.007,'#f4a0b0'); for(let i=-1;i<=1;i++){ HK.rect(o,x+i*H*.006-1,y-H*.03,2,H*.012,'#7a8ad8'); HK.ell(o,x+i*H*.006,y-H*.033,1.1,2,'#ffd060'); } return L(x,y-H*.032,.13,.55,{small:1});
      case 'jellymould': HK.poly(o,[x-H*.014,y,x-H*.01,y-H*.024,x+H*.01,y-H*.024,x+H*.014,y],v3rgba('#e84a6a',.7)); return L(x,y-H*.012,.14,.5);
      case 'desk': HK.rect(o,x-H*.008,y-H*.004,H*.016,H*.004,'#3a3e4a'); HK.line(o,[x,y-H*.004,x-H*.008,y-H*.03,x+H*.004,y-H*.042],'#3a3e4a',1.6); HK.poly(o,[x+H*.002,y-H*.046,x+H*.014,y-H*.04,x+H*.008,y-H*.034],'#3a3e4a'); return L(x+H*.008,y-H*.036,.13);
      case 'floor': pole(H*.11,'#3a3e4a'); HK.poly(o,[x-H*.012,y-H*.11,x+H*.012,y-H*.11,x+H*.008,y-H*.125,x-H*.008,y-H*.125],'#f4f6f8'); foot(); return L(x,y-H*.112,.17);
      case 'sign': HK.rect(o,x-H*.02,y-H*.05,H*.036,H*.018,'#1e2e4a'); HK.rect(o,x-H*.018,y-H*.046,H*.032,H*.01,'#ff7ab8'); HK.rect(o,x-1,y-H*.032,2,H*.032,'#3a3e4a'); return L(x-H*.002,y-H*.041,.13,.45);
      case 'lotus': HK.ell(o,x,y-H*.006,H*.01,H*.006,'#f0a8b8'); for(let i=-2;i<=2;i++) HK.ell(o,x+i*H*.004,y-H*.012,H*.003,H*.006,'#f0a8b8',i*.3); HK.ell(o,x,y-H*.02,1.4,2.6,'#ffd060'); return L(x,y-H*.018,.13,.5,{small:1});
      case 'brazier': case 'goldbrazier': HK.line(o,[x-H*.012,y,x,y-H*.024,x+H*.012,y],'#a8743a',1.6); HK.poly(o,[x-H*.014,y-H*.03,x+H*.014,y-H*.03,x+H*.008,y-H*.022,x-H*.008,y-H*.022],kind==='goldbrazier'?'#d8a830':'#a8743a'); HK.poly(o,[x-H*.008,y-H*.03,x,y-H*.05,x+H*.008,y-H*.03],'#ff7a2a'); return L(x,y-H*.036,.2,.65);
      case 'sundisclamp': pole(H*.09,'#a8743a'); HK.circ(o,x,y-H*.1,H*.012,'#f0c84a'); return L(x,y-H*.1,.18,.6);
      case 'neontube': HK.rect(o,x-1,y-H*.04,2,H*.04,'#3a3e4a'); HK.rect(o,x-H*.016,y-H*.07,H*.032,3,'#ff4ab8'); o.x.fillStyle=v3rgba('#ff4ab8',.3); o.x.fillRect(x-H*.018,y-H*.073,H*.036,9); return L(x,y-H*.068,.18,.6);
      case 'hologram': HK.rect(o,x-H*.008,y-H*.008,H*.016,H*.008,'#3a3e4a'); o.x.fillStyle=v3rgba('#3ae8ff',.3); o.x.beginPath(); o.x.moveTo(x-H*.004,y-H*.008); o.x.lineTo(x-H*.014,y-H*.05); o.x.lineTo(x+H*.014,y-H*.05); o.x.lineTo(x+H*.004,y-H*.008); o.x.fill(); HK.circ(o,x,y-H*.045,H*.006,'#3ae8ff'); return L(x,y-H*.04,.15,.5);
      case 'orb': HK.circ(o,x,y-H*.06,H*.01,'#f4f8ff'); return L(x,y-H*.06,.18,.6);
      case 'lightning': HK.rect(o,x-H*.006,y-H*.008,H*.012,H*.008,'#d8a830'); HK.circ(o,x,y-H*.022,H*.013,v3rgba('#c8e0ff',.4)); HK.line(o,[x-H*.004,y-H*.03,x+H*.002,y-H*.022,x-H*.002,y-H*.02,x+H*.004,y-H*.012],'#fff07a',1.4); return L(x,y-H*.022,.17,.6);
      case 'laurel': pole(H*.1,'#a8743a'); for(let i=0;i<4;i++) HK.ell(o,x+(i%2?2:-2),y-H*.09+i*H*.008,2,1,'#6a8a4a',i%2?.5:-.5); HK.poly(o,[x-H*.005,y-H*.1,x,y-H*.12,x+H*.005,y-H*.1],'#ff7a2a'); return L(x,y-H*.108,.18,.6);
      default: pole(H*.1); foot(); lantern(x,y-H*.105,H*.012); return L(x,y-H*.105); } },

  /* ---------- seats (every home has one; resting sits the angler at its height) ---------- */
  SEAT_H:{campchair:17,logbench:12,deckchair:15,stump:11,gardenbench:14,barrel:15,cushion:4,lowbench:9,stool:12,crate:12,bucket:11,driftbench:12,furbench:12,icechair:10,muskoka:13,stumpblanket:11,rocker:14,beachchair:9,hammock:13,peacock:13,captain:18,coolerseat:13,beanbag:7,fighting:18,teakbench:14,deckstool:15,wovenstool:10,logseat:10,floatcrate:12,steelbench:14,ropecoil:8,seachest:12,bathstool:8,warmrock:9,crescent:13,cloudcushion:9,crystalstool:13,haybale:12,milkcan:14,cupcake:12,teacup:12,macaron:10,swivel:16,executive:16,lionstool:12,xstool:13,throne:15,gaming:16,orbseat:14,arcadestool:15,marblethrone:15,cloudbench:12,klismos:15},
  seatH:kind=>HK.SEAT_H[kind]||14,
  seat(o,kind,col){ const s=HK.s(), x=HF.seatX(), y=o.dockY, sh=HK.seatH(kind)*s, top=y-sh, c=col, d=HK.dk(c,.3), metal='#3a3a40', lt=HK.lt(c,.2);
    const legs=(w,cl)=>{ HK.rect(o,x-w*.45,top,2*s,sh,cl||d); HK.rect(o,x+w*.45-2*s,top,2*s,sh,cl||d); };
    const back=(px,h,cl,lean)=>{ o.x.save(); o.x.translate(px,top); o.x.rotate(-(lean||0)); HK.rect(o,-1.2*s,-h,2.6*s,h,cl||c); o.x.restore(); };
    switch(kind){
      case 'campchair': { const w=14*s; HK.line(o,[x-w/2,y,x+w/2,top,x+w/2,y,x-w/2,top],metal,1.4*s); HK.ell(o,x,top+1,w*.5,1.6*s,c); back(x-w*.5,14*s,c,.12); break; }
      case 'logbench': case 'driftbench': { const w=24*s; HK.rect(o,x-w*.38,top,3.4*s,sh,d); HK.rect(o,x+w*.38-3.4*s,top,3.4*s,sh,d); HK.rect(o,x-w/2,top,w,3.6*s,c); HK.circ(o,x+w/2-1,top+1.8*s,1.6*s,lt); break; }
      case 'deckchair': case 'muskoka': { const w=16*s; legs(w); HK.rect(o,x-w/2,top-1.6*s,w,2.6*s,c); back(x-w*.45,(kind==='muskoka'?20:16)*s,c,kind==='muskoka'?.55:.42); HK.rect(o,x-w*.5,top-7*s,w*.9,1.8*s,d); break; }
      case 'stump': case 'stumpblanket': HK.block(o,x-6*s,top,12*s,sh,c); HK.ell(o,x,top,6*s,1.6*s,lt); if(kind==='stumpblanket'){ HK.rect(o,x-6.5*s,top,13*s,6*s,'#b8322a'); for(let i=0;i<3;i++) HK.rect(o,x-6.5*s+i*4.4*s,top,1.4*s,6*s,'#2a2626'); } break;
      case 'gardenbench': case 'teakbench': case 'steelbench': case 'lowbench': case 'furbench': { const w=26*s; legs(w,kind==='gardenbench'?metal:d); HK.rect(o,x-w/2,top-2*s,w,3*s,c); if(kind!=='lowbench'&&kind!=='furbench'){ HK.rect(o,x-w/2,top-11*s,2*s,9*s,kind==='gardenbench'?metal:d); for(let i=0;i<3;i++) HK.rect(o,x-w/2,top-10*s+i*3*s,w*.25,2*s,c); } if(kind==='furbench') for(let i=0;i<10;i++) HK.line(o,[x-w/2+i*w/10,top+s,x-w/2+i*w/10+s,top+3*s],lt); break; }
      case 'barrel': HK.ell(o,x,top+sh/2,7*s,sh/2,c); HK.rect(o,x-7*s,top+sh*.25,14*s,1.4*s,metal); HK.rect(o,x-7*s,top+sh*.7,14*s,1.4*s,metal); HK.ell(o,x,top+1,6*s,1.6*s,'#c8a878'); break;
      case 'cushion': case 'cloudcushion': if(kind==='cloudcushion'){ for(let i=0;i<4;i++) HK.circ(o,x-6*s+i*4*s,top+2*s,3.5*s,lt); } else HK.ell(o,x,top+2*s,9*s,2.4*s,c); break;
      case 'stool': case 'deckstool': case 'arcadestool': case 'crystalstool': HK.rect(o,x-1.4*s,top,2.8*s,sh,kind==='crystalstool'?lt:metal); HK.ell(o,x,top,6*s,1.8*s,c); HK.rect(o,x-5*s,y-1,10*s,1.5,kind==='arcadestool'?'#3ae8ff':metal); break;
      case 'crate': case 'floatcrate': HK.block(o,x-7*s,top,14*s,sh,c); for(let i=0;i<3;i++) HK.rect(o,x-7*s,top+i*sh/3,14*s,1.2,d); if(kind==='floatcrate'){ HK.circ(o,x-3*s,top-2*s,2.6*s,'#f0782a'); HK.circ(o,x+3*s,top-2*s,2.6*s,'#e85a2a'); } break;
      case 'bucket': case 'milkcan': HK.poly(o,[x-6*s,top,x+6*s,top,x+5*s,y,x-5*s,y],c); HK.rect(o,x-6.3*s,top,12.6*s,1.6*s,lt); if(kind==='milkcan') HK.ell(o,x,top,5*s,2*s,'#b8322a'); break;
      case 'icechair': { const w=14*s; legs(w,metal); HK.rect(o,x-w/2,top-1.4*s,w,2.4*s,c); back(x-w*.45,10*s,c,.2); break; }
      case 'rocker': HK.curve(o,x-10*s,y-2*s,x,y+3*s,x+10*s,y-2*s,d,2*s); legs(14*s); HK.rect(o,x-7*s,top-1.4*s,14*s,2.4*s,c); back(x-6*s,16*s,c,.25); break;
      case 'beachchair': { const w=16*s; HK.line(o,[x-w/2,y,x+w/2,top],'#b8b06a',1.4*s); HK.line(o,[x+w/2,y,x-w/3,top-6*s],'#b8b06a',1.4*s); HK.poly(o,[x-w/2,top-12*s,x+w/2,top,x+w/2,top+2*s,x-w/2+2*s,top-12*s],c); for(let i=0;i<3;i++) HK.line(o,[x-w/2+i*w/3,top-12*s+i*4*s,x-w/2+i*w/3+2*s,top-12*s+i*4*s+.5],'#f4efe6',1.2); break; }
      case 'hammock': { const a=x-14*s, b=x+14*s, ty=top-10*s; HK.rect(o,a-1,ty,2,y-ty,d); HK.rect(o,b-1,ty,2,y-ty,d); o.x.fillStyle=HK.n(o,c); o.x.beginPath(); o.x.moveTo(a,ty+2*s); o.x.quadraticCurveTo(x,top+12*s,b,ty+2*s); o.x.quadraticCurveTo(x,top+6*s,a,ty+2*s); o.x.fill(); break; }
      case 'peacock': HK.ell(o,x-3*s,top-12*s,10*s,14*s,c); HK.ell(o,x-3*s,top-12*s,7*s,10*s,HK.dk(c,.15)); HK.rect(o,x-6*s,top-1,12*s,3*s,c); HK.rect(o,x-1,top+2*s,2,sh-2*s,d); break;
      case 'captain': case 'fighting': case 'swivel': case 'executive': case 'gaming': { HK.rect(o,x-1.6*s,top+2*s,3.2*s,sh-2*s,metal); HK.rect(o,x-6*s,y-1.5,12*s,1.5,metal); HK.rect(o,x-7*s,top-1,14*s,3.4*s,c); HK.rect(o,x-7*s,top-(kind==='executive'||kind==='gaming'?18:13)*s,4*s,(kind==='executive'||kind==='gaming'?17:12)*s,c); if(kind==='gaming'){ HK.rect(o,x-7.5*s,top-16*s,1.4*s,10*s,'#ff4ab8'); } if(kind==='fighting') HK.rect(o,x+5*s,top+5*s,6*s,1.6*s,metal); break; }
      case 'coolerseat': HK.block(o,x-8*s,top,16*s,sh,'#f4f6f4'); HK.rect(o,x-8*s,top,16*s,3*s,c); HK.rect(o,x-8*s,top+5*s,16*s,1.5,'#d8483a'); break;
      case 'beanbag': case 'macaron': if(kind==='macaron'){ HK.ell(o,x,top+3*s,8*s,3*s,c); HK.rect(o,x-8*s,top+3*s,16*s,2*s,'#fff6ee'); HK.ell(o,x,top+7*s,8*s,3*s,c); } else HK.ell(o,x,y-sh*.5,10*s,sh*.6,c); break;
      case 'wovenstool': HK.poly(o,[x-6*s,top,x+6*s,top,x+5*s,y,x-5*s,y],c); for(let i=0;i<4;i++) HK.line(o,[x-6*s,top+i*sh/4,x+6*s,top+i*sh/4],d); break;
      case 'logseat': HK.rect(o,x-10*s,top,20*s,sh,c); HK.circ(o,x+10*s,top+sh/2,sh/2,lt); HK.rect(o,x-10*s,top,20*s,1.4,HK.lt(c,.3)); break;
      case 'ropecoil': for(let i=0;i<4;i++) HK.ell(o,x,y-2*s-i*1.8*s,9*s-i*.6*s,2.2*s,i%2?c:d); break;
      case 'seachest': HK.block(o,x-9*s,top,18*s,sh,c); HK.rect(o,x-9*s,top+3*s,18*s,1.4,'#a8884a'); HK.rect(o,x-1.5*s,top+2*s,3*s,4*s,'#a8884a'); break;
      case 'bathstool': HK.rect(o,x-6*s,top,12*s,2.4*s,c); HK.rect(o,x-5*s,top,2*s,sh,d); HK.rect(o,x+3*s,top,2*s,sh,d); break;
      case 'warmrock': HK.ell(o,x,y-sh*.45,9*s,sh*.55,'#4a3a3a'); HK.ell(o,x,top+1.5*s,7*s,2.2*s,c); break;
      case 'crescent': o.x.fillStyle=HK.n(o,c); o.x.beginPath(); o.x.arc(x,top-6*s,10*s,.2,Math.PI-.2); o.x.arc(x,top-9*s,9*s,Math.PI-.3,.3,true); o.x.fill(); HK.rect(o,x-1,top,2,sh,lt); break;
      case 'haybale': HK.block(o,x-9*s,top,18*s,sh,'#e0c060'); HK.rect(o,x-9*s,top+sh*.35,18*s,1.2,'#a8843a'); HK.rect(o,x-9*s,top+sh*.7,18*s,1.2,'#a8843a'); break;
      case 'cupcake': HK.poly(o,[x-6*s,top+4*s,x+6*s,top+4*s,x+5*s,y,x-5*s,y],'#d88a3a'); HK.ell(o,x,top+3*s,7*s,3.6*s,c); HK.circ(o,x,top-1*s,1.8*s,'#d8303a'); break;
      case 'teacup': HK.ell(o,x,y-1,10*s,2*s,'#f0f0f4'); o.x.fillStyle=HK.n(o,c); o.x.beginPath(); o.x.moveTo(x-8*s,top); o.x.quadraticCurveTo(x-8*s,y-2*s,x,y-2*s); o.x.quadraticCurveTo(x+8*s,y-2*s,x+8*s,top); o.x.fill(); HK.curve(o,x+8*s,top+3*s,x+12*s,top+5*s,x+7*s,top+9*s,c,1.6*s); break;
      case 'lionstool': case 'xstool': if(kind==='xstool') HK.line(o,[x-7*s,y,x+7*s,top,x+7*s,y,x-7*s,top],'#7a5a3a',1.6*s); else legs(14*s); HK.rect(o,x-7*s,top-1,14*s,2.6*s,c); break;
      case 'throne': case 'marblethrone': HK.block(o,x-7*s,top,14*s,sh,c); HK.rect(o,x-8*s,top-24*s,4*s,24*s,c); HK.rect(o,x-9*s,top-26*s,6*s,2.4*s,kind==='throne'?'#d8a830':HK.lt(c,.2)); HK.rect(o,x+5*s,top-8*s,2.4*s,8*s,c); break;
      case 'orbseat': HK.circ(o,x,top+4*s,7*s,c); HK.ell(o,x,top+2*s,6*s,1.6*s,lt); HK.ell(o,x,y-1,5*s,1.4*s,v3rgba('#3ae8ff',.5)); break;
      case 'cloudbench': for(let i=0;i<5;i++) HK.circ(o,x-10*s+i*5*s,top+3*s,4*s,lt); for(let i=0;i<3;i++) HK.circ(o,x-9*s+i*3*s,top-6*s+i*2*s,3.4*s,lt); break;
      case 'klismos': HK.curve(o,x-7*s,y,x-6*s,top+3*s,x-4*s,top,c,1.8*s); HK.curve(o,x+7*s,y,x+6*s,top+3*s,x+4*s,top,c,1.8*s); HK.rect(o,x-6*s,top-1,12*s,2.4*s,c); HK.curve(o,x-5*s,top,x-8*s,top-8*s,x-6*s,top-14*s,c,2*s); break;
      default: HK.block(o,x-7*s,top,14*s,sh,c); } }
};
