// =====================================================================
// Shiny FX (director, 2026-11-18: "add significantly more variety to shiny fish, way more in-depth detail in FX; it should feel
// like a sparkle rather than floating stars; treat it as FX everywhere: it shouldn't feel like part of the design, it should
// feel alive"). Shared drawing for every platform; used by
//  - still fish pictures (catch card, Cooler, Aquarium, Fish Log, Trophy Room): a live layer over the picture
//  - fish in the water and in the aquarium tank (al_decor04.js calls shinyFxWater)
// What a sparkle is here: a light flash that pops on a new spot of the fish's body, flares (bright core + long rays that
// stretch and turn), and fades; plus glitter (tiny fast twinkles),
// and per-kind signatures. Everything is drawn additively ("lighter"), so it reads as light, not as stickers.
// Variety: every shiny fish rolls one of 4 styles from its species (glint / glitter / shimmer / flare), and each prismatic
// kind has its own signature: Rainbow = colour-shifting flares, Starry = a twinkling starfield with
// shooting stars, Spectral = ghostly wisps rising off the fish, Ancient = gold dust drifting up,
// Mythic = pink and teal motes circling the fish.
// Cost: pictures animate only while on screen, 30 times a second; positions come from the fish's own pixels (worked out once
// per species and size); no per-frame allocations beyond a few gradients.
// =====================================================================
shineDecorate=function(){};
const SFX_PAL={shiny:{a:'#fff3c4',b:'#ffcf5a',dust:'#ffe7a0'}, mythic:{a:'#ffb0e8',b:'#8affea',dust:'#ffd6f4'}, rainbow:{a:'#ffffff',b:'#ffffff',dust:'#ffffff',hue:true},
  starry:{a:'#e4f3ff',b:'#8fc4ff',dust:'#ffffff'}, spectral:{a:'#ecd8ff',b:'#9ef0ff',dust:'#c9a8ff'}, ancient:{a:'#fff0c4',b:'#e8b04a',dust:'#f2c464'}};
const SFX_STYLES=['glint','glitter','shimmer','flare'];
function sfxHash(a,b){ let h=Math.imul(a|0,374761393)^Math.imul(b|0,668265263); h=Math.imul(h^(h>>>13),1274126177); return ((h^(h>>>16))>>>0)/4294967296; }
function sfxRgba(hex,a){ const n=parseInt(hex.slice(1),16); return 'rgba('+(n>>16)+','+((n>>8)&255)+','+(n&255)+','+Math.max(0,Math.min(1,a)).toFixed(3)+')'; }
function sfxCol(P,i,t,which){ return P.hue?'hsl('+Math.round((t*90+i*61)%360)+',100%,'+(which?72:82)+'%)':(which?P.b:P.a); }
function sfxColA(P,i,t,which,a){ if(!P.hue) return sfxRgba(which?P.b:P.a,a); return 'hsla('+Math.round((t*90+i*61)%360)+',100%,'+(which?72:82)+'%,'+a.toFixed(3)+')'; }
// one flare: a hot white core, a coloured halo, 2 long rays and 2 short ones, all tapering to nothing
function sfxFlare(c,x,y,s,P,i,t,a,rot,long){ if(a<=.01||s<.4) return;
  if(s<2.6){ // small sparkles (fish in the tank, far fish): the same look from plain shapes, no gradients (cheap)
    const L=s*(long?4:3); c.fillStyle=sfxColA(P,i,t,1,a*.35); c.beginPath(); c.arc(x,y,s*1.1,0,7); c.fill(); c.fillStyle='rgba(255,255,255,'+(a*.9).toFixed(3)+')'; c.fillRect(x-L,y-.35,L*2,.7); c.fillRect(x-.35,y-L*.8,.7,L*1.6); c.fillRect(x-s*.4,y-s*.4,s*.8,s*.8); return; }
  c.save(); c.translate(x,y); c.rotate(rot);
  const g=c.createRadialGradient(0,0,0,0,0,s*1.25); g.addColorStop(0,'rgba(255,255,255,'+Math.min(1,a*1.1).toFixed(3)+')'); g.addColorStop(.18,sfxColA(P,i,t,0,a*.9)); g.addColorStop(.5,sfxColA(P,i,t,1,a*.28)); g.addColorStop(1,sfxColA(P,i,t,1,0));
  c.fillStyle=g; c.beginPath(); c.arc(0,0,s*1.25,0,7); c.fill();
  const ray=(len,wd,al)=>{ const lg=c.createLinearGradient(-len,0,len,0); lg.addColorStop(0,'rgba(255,255,255,0)'); lg.addColorStop(.5,'rgba(255,255,255,'+al.toFixed(3)+')'); lg.addColorStop(1,'rgba(255,255,255,0)'); c.fillStyle=lg; c.beginPath(); c.moveTo(-len,0); c.quadraticCurveTo(0,-wd,len,0); c.quadraticCurveTo(0,wd,-len,0); c.fill(); };
  const L=s*(long?4.2:3); ray(L,s*.16,a); c.rotate(Math.PI/2); ray(L*.82,s*.14,a*.9); c.rotate(Math.PI/4); ray(L*.38,s*.1,a*.55); c.rotate(Math.PI/2); ray(L*.38,s*.1,a*.55); c.restore(); }
// the life of one sparkle: pops in fast, flares, fades slower; a new spot every cycle
function sfxLife(u){ return u<.1?u/.1:Math.max(0,1-(u-.1)/.6)**1.6; }
// draw every effect for one fish. o = {kind, style, seed, pick(r1,r2)->[x,y], size, w, h, motes:boolean}
function shinyFxDraw(c,t,o){ const P=SFX_PAL[o.kind]||SFX_PAL.shiny, st=o.style, sd=o.seed|0, s=o.size;
  c.save(); c.globalCompositeOperation='lighter';
  const nFlare=o.kind==='shiny'?(st==='glint'?3:st==='glitter'?1:st==='shimmer'?2:3):(o.kind==='mythic'?3:4), nGlit=st==='glitter'?22:o.kind==='starry'?26:o.kind==='shiny'?8:12;
  // flares
  for(let i=0;i<nFlare;i++){ const per=1.15+sfxHash(sd,i*7+1)*.9, off=sfxHash(sd,i*7+2)*per, k=(t+off)/per, n=Math.floor(k), u=k-n, a=sfxLife(u); if(a<=.02) continue;
    const p=o.pick(sfxHash(sd+n,i*13+3),sfxHash(sd+n,i*13+4)), sz=s*(.75+sfxHash(sd+n,i*13+5)*.7)*(st==='flare'?1.25:1)*(.55+.45*a), rot=sfxHash(sd+n,i*13+6)*.5-.25+u*.6;
    sfxFlare(c,p[0],p[1],sz,P,i+n,t,a,rot,st==='flare'||o.kind==='rainbow'); }
  // flare burst (flare style): every few seconds four flares go off together along the body
  if(st==='flare'){ const per=4.2, k=(t+sfxHash(sd,99)*per)/per, n=Math.floor(k), u=(k-n)*per; if(u<.7){ for(let j=0;j<4;j++){ const a=sfxLife(Math.max(0,u-j*.08)/.7); const p=o.pick(sfxHash(sd+n,200+j),sfxHash(sd+n,300+j)); sfxFlare(c,p[0],p[1],s*.7*(.6+.4*a),P,j,t,a*.9,j*.4,true); } } }
  // glitter: tiny fast twinkles, each hops to a new spot every couple of seconds
  for(let i=0;i<nGlit;i++){ const per=1.6+sfxHash(sd,i*5+40)*1.4, k=(t+sfxHash(sd,i*5+41)*per)/per, n=Math.floor(k), u=k-n; const tw=Math.sin(u*Math.PI)**3*(o.kind==='starry'?(.55+.45*Math.sin(t*3+i)):(.6+.4*Math.sin(t*11+i*2.3))); if(tw<.05) continue;
    const p=o.pick(sfxHash(sd+n,i*9+42),sfxHash(sd+n,i*9+43)), r=Math.max(.6,s*(o.kind==='starry'?.16:.12)*(.6+tw*.6)); c.fillStyle=sfxColA(P,i,t,i%2,tw); c.fillRect(p[0]-r,p[1]-r*.25,r*2,r*.5); c.fillRect(p[0]-r*.25,p[1]-r,r*.5,r*2); c.fillStyle='rgba(255,255,255,'+(tw*.9).toFixed(3)+')'; c.fillRect(p[0]-r*.3,p[1]-r*.3,r*.6,r*.6); }
  // per-kind signatures
  if(o.kind==='starry'&&o.w){ const per=5.2, k=(t+sfxHash(sd,88)*per)/per, n=Math.floor(k), u=(k-n)*per; if(u<.6){ const e=u/.6, x0=o.w*(.05+sfxHash(sd+n,1)*.4), y0=o.h*(.08+sfxHash(sd+n,2)*.25), x=x0+e*o.w*.5, y=y0+e*o.h*.35, ln=o.w*.18;
      const lg=c.createLinearGradient(x,y,x-ln,y-ln*.7); lg.addColorStop(0,'rgba(255,255,255,'+(.95*(1-e*.6)).toFixed(3)+')'); lg.addColorStop(1,'rgba(160,200,255,0)'); c.strokeStyle=lg; c.lineWidth=Math.max(1,s*.18); c.beginPath(); c.moveTo(x,y); c.lineTo(x-ln,y-ln*.7); c.stroke(); } }
  if(o.motes){ const nm=o.kind==='spectral'?5:o.kind==='ancient'?9:o.kind==='mythic'?6:0;
    for(let i=0;i<nm;i++){ const per=o.kind==='spectral'?2.8:3.4, k=(t+sfxHash(sd,i*3+500)*per)/per, n=Math.floor(k), u=k-n, p=o.pick(sfxHash(sd+n,i*3+501),sfxHash(sd+n,i*3+502));
      if(o.kind==='mythic'){ const ang=t*1.4+i*Math.PI*2/nm, rx=(o.w||s*20)*.36, ry=(o.h||s*10)*.3, cx=(o.cx!=null?o.cx:(o.w||0)/2), cy=(o.cy!=null?o.cy:(o.h||0)/2), mx=cx+Math.cos(ang)*rx, my=cy+Math.sin(ang)*ry, a=.55+.45*Math.sin(t*3+i);
        const g=c.createRadialGradient(mx,my,0,mx,my,s*.9); g.addColorStop(0,sfxRgba(i%2?P.b:P.a,a)); g.addColorStop(1,sfxRgba(i%2?P.b:P.a,0)); c.fillStyle=g; c.beginPath(); c.arc(mx,my,s*.9,0,7); c.fill(); continue; }
      const rise=(o.kind==='spectral'?s*9:s*7)*u, sway=Math.sin(u*6+i)*s*(o.kind==='spectral'?1.6:.6), x=p[0]+sway, y=p[1]-rise, a=Math.sin(u*Math.PI)*(o.kind==='spectral'?.2:.85), rr=o.kind==='spectral'?s*(.7+u*1.1):Math.max(.7,s*.22);
      if(rr<2.2){ c.fillStyle=sfxRgba(o.kind==='spectral'?(i%2?P.b:P.a):P.dust,a*.8); c.fillRect(x-rr*.6,y-rr*.6,rr*1.2,rr*1.2); continue; }
      const g=c.createRadialGradient(x,y,0,x,y,rr); g.addColorStop(0,sfxRgba(o.kind==='spectral'?(i%2?P.b:P.a):P.dust,a)); g.addColorStop(1,sfxRgba(o.kind==='spectral'?(i%2?P.b:P.a):P.dust,0)); c.fillStyle=g; c.beginPath(); c.arc(x,y,rr,0,7); c.fill(); } }
  c.restore(); }
function shinyStyle(sp,shiny,pv){ const kind=shiny===2?(pv&&SFX_PAL[pv]?pv:'rainbow'):shiny?'shiny':'mythic'; return {kind, style:kind==='shiny'?SFX_STYLES[hashStr(sp.id)%4]:kind==='mythic'?'glint':'glint', seed:hashStr(sp.id+(pv||''))}; }

// ---------- fish in the water and in the tank (called from al_decor04.js with the fish's body drawn on its own layer) ----------
function shinyFxWater(c,x,y,L,t,sp,o,layer,px,R){ try{ const S0=shinyStyle(sp,o.shiny,o.pv);
    shinyFxDraw(c,t,{kind:S0.kind, style:S0.style, seed:S0.seed+(o.seedAdd||0), size:Math.max(1.1,L*.085), w:L*1.4, h:L*.6, cx:x, cy:y, motes:true,
      pick:(r1,r2)=>{ const a=r1*Math.PI*2, rr=Math.sqrt(r2); return [x+Math.cos(a)*rr*L*.42, y+Math.sin(a)*rr*L*.14]; }}); }catch(e){} }

// ---------- still pictures ----------
const SPK=new Map(), SPK_SPOTS=new Map();
const spkVis=window.IntersectionObserver?new IntersectionObserver(es=>{ for(const e of es){ const o=SPK.get(e.target); if(o) o.vis=e.isIntersecting; } }):null;
function spkWants(sp,known,shiny){ return !!(known&&sp&&(shiny||sp.r===5)); }
function spkDrop(cnv){ if(SPK.has(cnv)){ SPK.delete(cnv); if(spkVis) spkVis.unobserve(cnv); } }
function spkAttach(cnv,sp,shiny,pv){ try{ const w=cnv.width, h=cnv.height; if(w<8||h<8) return; const base=document.createElement('canvas'); base.width=w; base.height=h; base.getContext('2d').drawImage(cnv,0,0);
    const S0=shinyStyle(sp,shiny,pv), key=[sp.id,w,h,S0.kind,typeof V3ON!=='undefined'&&V3ON?1:0].join('|');
    let sp0=SPK_SPOTS.get(key);
    if(!sp0){ // spots on the fish: solid pixels only
      const d=cnv.getContext('2d').getImageData(0,0,w,h).data, pts=[], st=Math.max(2,Math.round(Math.min(w,h)/40)); for(let yy=0;yy<h;yy+=st) for(let xx=0;xx<w;xx+=st){ if(d[(yy*w+xx)*4+3]>215) pts.push([xx,yy]); }
      if(!pts.length) return;
      let sx=0,sy=0; for(const p of pts){ sx+=p[0]; sy+=p[1]; } sp0={pts,cx:sx/pts.length,cy:sy/pts.length}; if(SPK_SPOTS.size>300) SPK_SPOTS.clear(); SPK_SPOTS.set(key,sp0); }
    const was=SPK.get(cnv); SPK.set(cnv,Object.assign({base,w,h,vis:was?was.vis:true},S0,sp0)); if(spkVis&&!was) spkVis.observe(cnv); spkDraw(cnv,SPK.get(cnv),performance.now()/1000); }catch(e){} }
{ const _fc=fishCanvas; fishCanvas=function(cnv,sp,known=true,shiny=false,pv=null){ spkDrop(cnv);
    const keep=sparkles; sparkles=function(){}; SHINY3.still=true; try{ _fc.apply(this,arguments); } finally{ sparkles=keep; SHINY3.still=false; }
    if(spkWants(sp,known,shiny)&&cnv.isConnected) spkAttach(cnv,sp,shiny,pv); }; }
// menu pictures are drawn once into a kept copy and then copied onto the page: attach to the page canvas, never the kept copy
{ // the shine is set up just after the page appears, a few pictures at a time, so opening a page never waits for it
  const Q=[]; let qT=0; const run=()=>{ qT=0; const t0=performance.now(); while(Q.length&&performance.now()-t0<6){ const [c,sp,sh,pv]=Q.shift(); if(c.isConnected) spkAttach(c,sp,sh,pv); } if(Q.length) qT=setTimeout(run,16); };
  const _pf=paintFish; paintFish=function(P){ const r=_pf.apply(this,arguments); try{ P.querySelectorAll('canvas[data-fish]').forEach(c=>{ const sp=SPI[c.dataset.fish], known=c.dataset.known!=='0', sh=+c.dataset.sh||0;
      if(spkWants(sp,known,sh)) Q.push([c,sp,sh,c.dataset.pv||null]); else spkDrop(c); }); if(Q.length&&!qT) qT=setTimeout(run,0); }catch(e){} return r; }; }
function spkDraw(cnv,o,t){ const c=cnv.getContext('2d'), w=o.w, h=o.h; c.save(); c.setTransform(1,0,0,1,0,0); c.globalAlpha=1; c.globalCompositeOperation='source-over'; c.clearRect(0,0,w,h); c.drawImage(o.base,0,0);
  const sz=Math.max(1.6,Math.min(w,h)*.06), pts=o.pts;
  shinyFxDraw(c,t,{kind:o.kind, style:o.style, seed:o.seed, size:sz, w, h, cx:o.cx, cy:o.cy, motes:true,
    pick:(r1)=>pts[Math.floor(r1*pts.length)]});
  c.restore(); }
// every display frame (director: "use more frames, push the limits without breaking"); runs only while a shiny picture exists
{ let raf=0; const tick=()=>{ raf=0; if(!SPK.size) return; if(!document.hidden){ const t=performance.now()/1000; for(const [cnv,o] of SPK){ if(!cnv.isConnected){ spkDrop(cnv); continue; } if(o.vis) spkDraw(cnv,o,t); } } if(SPK.size) raf=requestAnimationFrame(tick); };
  setInterval(()=>{ if(!raf&&SPK.size) raf=requestAnimationFrame(tick); },250); }
