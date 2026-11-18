// =====================================================================
// Shiny sparkles (director, 2026-11-18: "remove the static sparkles from shiny fish. All sparkles should be animated and
// dynamic to the fish sprite. Prismatic and other high-end shiny variants need some distinct graphical separation, and perhaps
// the sparkles are different colours"). Shared drawing for every platform:
//  - the fixed sparkles painted into fish pictures and the fixed sparkle overlay on shiny cards are gone
//  - instead every shiny, prismatic or Mythic fish picture twinkles with sparkles that sit ON the fish itself (positions are
//    picked from the fish's own pixels) and come and go over time
//  - colours: shiny = warm gold, Mythic = pink and teal, Rainbow = every colour, Starry = light blue, Spectral = purple,
//    Ancient = old gold; prismatic fish also twinkle more
//  - cheap: only pictures on screen animate, about 15 times a second; spots are worked out once per fish picture size
// =====================================================================
shineDecorate=function(){};
const SPK=new Map(), SPK_SPOTS=new Map();
const SPK_COL={shiny:['#fff6c8','#ffd36a'], mythic:['#ff9ae0','#8affea'], rainbow:null, starry:['#bfe6ff','#7fc8ff'], spectral:['#d6b8ff','#a77cff'], ancient:['#ffe9a8','#e8b860']};
const spkVis=window.IntersectionObserver?new IntersectionObserver(es=>{ for(const e of es){ const o=SPK.get(e.target); if(o) o.vis=e.isIntersecting; } }):null;
function spkWants(sp,known,shiny){ return !!(known&&sp&&(shiny||sp.r===5)); }
function spkDrop(cnv){ if(SPK.has(cnv)){ SPK.delete(cnv); if(spkVis) spkVis.unobserve(cnv); } }
// start twinkling on a canvas that already shows the fish (without sparkles)
function spkAttach(cnv,sp,shiny,pv){ try{ const w=cnv.width, h=cnv.height; if(w<8||h<8) return; const base=document.createElement('canvas'); base.width=w; base.height=h; base.getContext('2d').drawImage(cnv,0,0);
    const kind=shiny===2?(pv&&SPK_COL.hasOwnProperty(pv)?pv:'rainbow'):shiny?'shiny':'mythic', key=[sp.id,w,h,kind,typeof V3ON!=='undefined'&&V3ON?1:0].join('|');
    let spots=SPK_SPOTS.get(key);
    if(!spots){ // spots on the fish: solid pixels only (the soft glow around shiny fish is see-through, so it never gets a sparkle)
      const d=cnv.getContext('2d').getImageData(0,0,w,h).data, pts=[], st=Math.max(2,Math.round(Math.min(w,h)/40)); for(let y=0;y<h;y+=st) for(let x=0;x<w;x+=st){ if(d[(y*w+x)*4+3]>215) pts.push([x,y]); }
      if(!pts.length) return; const n=shiny===2?9:6, r=v3rng(hashStr(sp.id)+w); spots=[];
      for(let i=0;i<n;i++){ const p=pts[Math.floor(r()*pts.length)]; spots.push({x:p[0],y:p[1],ph:r()*6.28,sp:.8+r()*1.4,sz:(.7+r()*.6)*Math.max(2.6,w*(shiny===2?.032:.027))}); }
      if(SPK_SPOTS.size>400) SPK_SPOTS.clear(); SPK_SPOTS.set(key,spots); }
    const was=SPK.get(cnv); SPK.set(cnv,{base,spots,kind,vis:was?was.vis:true}); if(spkVis&&!was) spkVis.observe(cnv); }catch(e){} }
{ const _fc=fishCanvas; fishCanvas=function(cnv,sp,known=true,shiny=false,pv=null){ spkDrop(cnv);
    const keep=sparkles; sparkles=function(){}; SHINY3.still=true; try{ _fc.apply(this,arguments); } finally{ sparkles=keep; SHINY3.still=false; }
    if(spkWants(sp,known,shiny)&&cnv.isConnected) spkAttach(cnv,sp,shiny,pv); }; }
// menu pictures are drawn once into a kept copy and then copied onto the page: attach to the page canvas, never the kept copy
{ const _pf=paintFish; paintFish=function(P){ const r=_pf.apply(this,arguments); try{ P.querySelectorAll('canvas[data-fish]').forEach(c=>{ const sp=SPI[c.dataset.fish], known=c.dataset.known!=='0', sh=+c.dataset.sh||0;
      if(spkWants(sp,known,sh)) spkAttach(c,sp,sh,c.dataset.pv||null); else spkDrop(c); }); }catch(e){} return r; }; }
function spkStar(c,x,y,s,col,a){ c.globalAlpha=a; c.fillStyle=col; c.beginPath(); c.moveTo(x,y-s); c.quadraticCurveTo(x+s*.16,y-s*.16,x+s,y); c.quadraticCurveTo(x+s*.16,y+s*.16,x,y+s); c.quadraticCurveTo(x-s*.16,y+s*.16,x-s,y); c.quadraticCurveTo(x-s*.16,y-s*.16,x,y-s); c.fill();
  c.globalAlpha=a*.55; c.beginPath(); c.arc(x,y,s*.32,0,7); c.fillStyle='#ffffff'; c.fill(); }
function spkDraw(cnv,o,t){ const c=cnv.getContext('2d'); c.save(); c.setTransform(1,0,0,1,0,0); c.globalAlpha=1; c.clearRect(0,0,cnv.width,cnv.height); c.drawImage(o.base,0,0); const cols=SPK_COL[o.kind];
  o.spots.forEach((s,i)=>{ const k=Math.sin(t*s.sp*2.2+s.ph); if(k<=.15) return; const a=Math.min(1,(k-.15)/.85); const col=cols?cols[i%cols.length]:'hsl('+Math.round((t*60+i*47)%360)+',100%,75%)'; spkStar(c,s.x,s.y,s.sz*(.55+.45*a),col,a); });
  c.restore(); }
setInterval(()=>{ if(document.hidden||!SPK.size) return; const t=performance.now()/1000; for(const [cnv,o] of SPK){ if(!cnv.isConnected){ spkDrop(cnv); continue; } if(o.vis) spkDraw(cnv,o,t); } },66);
