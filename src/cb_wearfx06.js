// =====================================================================
// Living cosmetics (director, round 6: "a lot of customization items don't look cool... make them actually awesome, with new FX
// when it fits the theme"). Shared for every platform. The angler code (g_angler.js) records where the hat, chest and neck are
// each frame (A3FXP); after the angler is drawn, these effects are drawn on top in the same places, so they follow every pose,
// lean and scale: in the scene, the Wardrobe preview, the Boardwalk, the Tide Pass and the boards.
// Only drawn while the angler is animated (o.t given): still thumbnails stay cached and cheap.
//   hats:    crown and tiara gems glint; wizard and witch hats trail twinkling stars; the astronaut visor catches a moving
//            glare; the diving helmet lets out bubbles; the halo shimmers
//   outfits: the spacesuit's chest lights blink; the Tide coat's hem glows like a wave and sheds glints; the captain's gold
//            buttons catch the light; the fish suit's scales shimmer
//   necks:   the big gold chain and the pearls catch the light
// =====================================================================
// A3FXP (anchors) is declared in g_angler.js, which fills it while drawing
function wearFxDraw(c,lk,t,toC,k){ try{ const A=A3FXP; if(!A||(!A.hat&&!A.torso&&!A.neck)) return;
    const P=(M,x,y)=>{ const p=M.transformPoint({x,y}); return toC(p); }, S0=M=>Math.hypot(M.a,M.b)*k;
    c.save(); c.globalCompositeOperation='lighter';
    const flare=(M,x,y,sz,pal,i,a,long)=>{ const p=P(M,x,y); sfxFlare(c,p.x,p.y,sz*S0(M),pal,i,t,a,(i*.7+t*.3)%1-.5,long); };
    const life=(per,off)=>{ const k2=(t+off)/per, n=Math.floor(k2), u=k2-n; return {n,a:u<.1?u/.1:Math.max(0,1-(u-.1)/.6)**1.5}; };
    const H=A.hat, T=A.torso, N=A.neck, gold=SFX_PAL.shiny;
    if(H){ const h=lk.hat;
      if(h==='crown'||h==='tiara'){ const pts=h==='crown'?[[-3.6,-14.2],[0,-15.8],[3.6,-14.2]]:[[0,-12.6],[-2.6,-11.8],[2.6,-11.8]]; pts.forEach(([x,y],i)=>{ const L=life(1.4+i*.35,i*.5); flare(H,x,y,.9,gold,i,L.a,true); }); }
      if(h==='wizard'||h==='witch'){ for(let i=0;i<5;i++){ const ang=t*1.1+i*1.26, x=Math.cos(ang)*8.5, y=-12+Math.sin(ang)*2.6-((t*.6+i*.2)%1)*5, a=.55+.45*Math.sin(t*4+i); if(Math.sin(ang)<-.2) continue; flare(H,x,y,.45,h==='witch'?SFX_PAL.spectral:SFX_PAL.starry,i,a*.8,false); } }
      if(h==='astro'){ const p0=P(H,-.4,.2), R=10.6*S0(H), kx=((t*.4)%1.8)-.4; c.save(); c.beginPath(); c.arc(p0.x,p0.y,R*.92,0,7); c.clip(); const g=c.createLinearGradient(p0.x-R+kx*2*R,p0.y-R,p0.x-R*.4+kx*2*R,p0.y+R); g.addColorStop(0,'rgba(255,255,255,0)'); g.addColorStop(.5,'rgba(220,240,255,.35)'); g.addColorStop(1,'rgba(255,255,255,0)'); c.fillStyle=g; c.fillRect(p0.x-R,p0.y-R,R*2,R*2); c.restore(); }
      if(h==='diver'){ for(let i=0;i<4;i++){ const q=((t*.5+i*.25)%1), p=P(H,-5+Math.sin(q*9+i)*1.2,-11-q*16), r=(.6+q*.9)*S0(H); c.strokeStyle='rgba(200,235,255,'+(.7*(1-q)).toFixed(2)+')'; c.lineWidth=Math.max(.6,.25*S0(H)); c.beginPath(); c.arc(p.x,p.y,r,0,7); c.stroke(); } }
      if(h==='halo'){ for(let i=0;i<3;i++){ const L=life(1.2+i*.3,i*.4), ang=i*2.1+L.n*1.7; flare(H,Math.cos(ang)*6,-17+Math.sin(ang)*1.4,.6,gold,i,L.a*.9,false); } } }
    if(T){ const o=lk.outfit;
      /* spacesuit: its chest lights blink inside the suit drawing (g_angler.js), so the arm still covers them */
      if(o==='tidecoat'){ for(let i=0;i<6;i++){ const xx=-9+i*3.6, p=P(T,xx,-21.4+Math.sin(xx*.9+t*2)*1.1), sz=2.4*S0(T), a=.25+.2*Math.sin(t*2.4+i); const g=c.createRadialGradient(p.x,p.y,0,p.x,p.y,sz); g.addColorStop(0,'rgba(90,216,232,'+a.toFixed(2)+')'); g.addColorStop(1,'rgba(90,216,232,0)'); c.fillStyle=g; c.beginPath(); c.arc(p.x,p.y,sz,0,7); c.fill(); }
        for(let i=0;i<2;i++){ const L=life(1.6+i*.5,i*.8); flare(T,-7+sfxHash(L.n,i)*14,-40+sfxHash(L.n,i+9)*18,.55,SFX_PAL.starry,i,L.a,false); } }
      if(o==='captain'){ const L=life(2.2,0); flare(T,1.4,-42+(L.n%4)*6,.6,gold,0,L.a,true); }
      if(o==='fishsuit'){ for(let i=0;i<3;i++){ const L=life(1.3+i*.3,i*.45); flare(T,-7+sfxHash(L.n,i*3)*14,-47+sfxHash(L.n,i*3+1)*22,.45,SFX_PAL.mythic,i,L.a*.9,false); } } }
    if(N){ const n=lk.neck;
      if(n==='goldchain'||n==='pearls'){ for(let i=0;i<2;i++){ const L=life(1.5+i*.4,i*.7), a0=.3+sfxHash(L.n,i)*2.5, rx=5*(A.nw||1), ry=n==='goldchain'?5.4:4.2; flare(N,.4+Math.cos(a0)*rx,-45.4+Math.sin(a0)*ry,n==='goldchain'?.6:.45,n==='goldchain'?gold:SFX_PAL.starry,i,L.a,false); } } }
    c.restore(); }catch(e){} }
