// =====================================================================
// Living cosmetics (director, round 6: "a lot of customization items don't look cool... make them actually awesome, with new FX
// when it fits the theme"; then: "some hats don't feel magical, no wizard FX is crazy. We want everything to feel alive. Don't just
// end with hats, or just one option. Everywhere it makes sense"). Shared for every platform.
// The angler code (g_angler.js) records where the hat, chest, neck, back and feet are each frame (A3FXP). After the angler is
// drawn, these effects are drawn on top in the same places, so they follow every pose, lean and scale: in the scene, the Wardrobe
// preview, the Boardwalk, the Tide Pass and the boards. Only while the angler is animated (o.t given); still thumbnails stay cheap.
// Everything is drawn as light ("lighter"), except things that are not light (smoke, petals, notes, bubbles, confetti).
//   hats:    wizard (arcane glow, a spiral of sparkles climbing to the tip, a pulsing tip star, orbiting runes), witch (green and
//            violet wisps off the tip), crown and tiara gems, halo, astronaut glare, diving-helmet bubbles, fishbowl bubbles, top hat
//            and carnival hat magic bursts, headphones music notes, mushroom spores, flower-crown petals, party confetti, lantern
//            hat flicker, Tide cap droplets, knight / viking / pirate / graduation / captain / sailor glints
//   outfits: Tide coat glow and glints, captain buttons, fish-suit scales, clown confetti sparkles, kimono petals, hot-dog steam,
//            raincoat drips, life-jacket reflective strip, spacesuit lights (inside the suit drawing)
//   backs:   angel feathers and holy motes, butterfly wing dust, dragon embers, bat shadows, jetpack smoke, lantern moths,
//            Tide cape and wings droplets, guitar notes
//   necks:   gold chain, pearls, medal glints, lei petals, Tide scarf droplets
//   shoes:   glow kicks pulse and sparkle, Tide treads droplets, moon boots stars, roller wheel glints, fish feet bubbles
//   glasses: lens glints (sunglasses, heart, goggles, monocle, pixel, frames), pixel sparkles, little floating hearts
// A3FXP (anchors) is declared in g_angler.js, which fills it while drawing.
// =====================================================================
function wearFxDraw(c,lk,t,toC,k){ try{ const A=A3FXP; if(!A||(!A.hat&&!A.torso&&!A.neck&&!A.back&&!A.feet)) return;
    const P=(M,x,y)=>toC(M.transformPoint({x,y})), S0=M=>Math.hypot(M.a,M.b)*k, gold=SFX_PAL.shiny, starry=SFX_PAL.starry, spec=SFX_PAL.spectral, myth=SFX_PAL.mythic;
    const flare=(M,x,y,sz,pal,i,a,long,rot)=>{ if(a<=.02) return; const p=P(M,x,y); sfxFlare(c,p.x,p.y,sz*S0(M),pal,i,t,a,rot!=null?rot:((i*.7+t*.3)%1-.5),long); };
    const life=(per,off)=>{ const k2=(t+off)/per, n=Math.floor(k2), u=k2-n; return {n,u,a:u<.1?u/.1:Math.max(0,1-(u-.1)/.6)**1.5}; };
    const glow=(M,x,y,r,rgb,a)=>{ if(a<=.01) return; const p=P(M,x,y), R=Math.max(1,r*S0(M)); const g=c.createRadialGradient(p.x,p.y,0,p.x,p.y,R); g.addColorStop(0,'rgba('+rgb+','+a.toFixed(3)+')'); g.addColorStop(1,'rgba('+rgb+',0)'); c.fillStyle=g; c.beginPath(); c.arc(p.x,p.y,R,0,7); c.fill(); };
    const dot=(M,x,y,r,col)=>{ const p=P(M,x,y), R=Math.max(.5,r*S0(M)); c.fillStyle=col; c.beginPath(); c.arc(p.x,p.y,R,0,7); c.fill(); };
    const ink=f=>{ c.save(); c.globalCompositeOperation='source-over'; f(); c.restore(); };
    const note=(M,x,y,sz,a,col)=>{ if(a<=.02) return; const p=P(M,x,y); ink(()=>{ c.globalAlpha=a; c.fillStyle=col; c.font='700 '+Math.max(6,sz*S0(M)).toFixed(1)+'px system-ui,sans-serif'; c.textAlign='center'; c.fillText('♪',p.x,p.y); }); };
    const petal=(M,x,y,sz,rot,col,a)=>{ if(a<=.02) return; const p=P(M,x,y), s=Math.max(.8,sz*S0(M)); ink(()=>{ c.globalAlpha=a; c.translate(p.x,p.y); c.rotate(rot); c.fillStyle=col; c.beginPath(); c.ellipse(0,0,s,s*.55,0,0,7); c.fill(); }); };
    const bubble=(M,x,y,r,a)=>{ if(a<=.02) return; const p=P(M,x,y), R=Math.max(.6,r*S0(M)); ink(()=>{ c.strokeStyle='rgba(210,240,255,'+(.75*a).toFixed(2)+')'; c.lineWidth=Math.max(.5,R*.28); c.beginPath(); c.arc(p.x,p.y,R,0,7); c.stroke(); c.fillStyle='rgba(255,255,255,'+(.6*a).toFixed(2)+')'; c.beginPath(); c.arc(p.x-R*.35,p.y-R*.35,R*.25,0,7); c.fill(); }); };
    const puff=(M,x,y,r,rgba)=>{ const p=P(M,x,y), R=Math.max(.8,r*S0(M)); ink(()=>{ c.fillStyle=rgba; c.beginPath(); c.arc(p.x,p.y,R,0,7); c.fill(); }); };
    const H=A.hat, T=A.torso, N=A.neck, Bk=A.back, F=A.feet;
    c.save(); c.globalCompositeOperation='lighter';
    // ---------------- hats (origin = head centre) ----------------
    if(H){ const h=lk.hat;
      if(h==='wizard'){ // 0.4.9 [50] redone (director: "Wizard hat effects look mid"): stardust falling from a turning tip star, rune glyphs
        // orbiting the brim (dim behind the head), a spell burst from the tip every few seconds, and a wisp looping around the head
        const RUNES=[[[0,-1,0,1],[0,-1,.7,-.4],[0,0,.7,.5]],[[-.5,-1,-.5,1],[-.5,-1,.5,0],[.5,0,-.5,1]],[[0,-1,0,1],[-.6,-.3,.6,-.3],[-.6,.3,.6,.3]],[[-.6,1,0,-1],[0,-1,.6,1],[-.35,.25,.35,.25]]];
        const glyph=(M,x,y,sz,id,a)=>{ if(a<=.02) return; const s=sz*S0(M); ink(()=>{ c.globalCompositeOperation='lighter'; c.lineCap='round'; for(const pass of [[3.2,.18],[1.2,.9]]){ c.strokeStyle='rgba(190,170,255,'+(a*pass[1]).toFixed(2)+')'; c.lineWidth=Math.max(.6,s*.18*pass[0]); c.beginPath(); for(const L of RUNES[id]){ const p0=P(M,x+L[0]*sz,y+L[1]*sz), p1=P(M,x+L[2]*sz,y+L[3]*sz); c.moveTo(p0.x,p0.y); c.lineTo(p1.x,p1.y); } c.stroke(); } }); };
        glow(H,-1.5,-11,12,'130,100,255',.18+.08*Math.sin(t*1.7));
        // tip star, slowly turning, brighter on a pulse
        const pulse=.55+.45*Math.max(0,Math.sin(t*2.6)); glow(H,-4.6,-20.4,5.5,'210,190,255',.45*pulse); flare(H,-4.6,-20.4,1.5,starry,0,.55+.45*pulse,true,t*.5);
        // stardust drifting down and back off the tip
        for(let i=0;i<9;i++){ const L=life(1.8+(i%3)*.35,i*.41), u=L.u, x=-4.6-u*(5+((i*37)%5)), y=-20.4+u*u*16+Math.sin(u*6+i)*1.2; const tw=.5+.5*Math.sin(t*9+i*2.1); flare(H,x,y,.35+.35*(1-u),i%2?spec:starry,i,L.a*tw*.9,false,t+i); }
        // rune glyphs orbiting the brim
        for(let i=0;i<3;i++){ const ang=t*.7+i*Math.PI*2/3, z=Math.sin(ang), x=Math.cos(ang)*11, y=-5.2+z*2.4; glyph(H,x,y-2,1.8,i%RUNES.length,(z>-.2?1:.3)*(.8+.2*Math.sin(t*3+i))); }
        // a spell burst from the tip every ~4.5 s
        { const B=life(4.5,1.3); if(B.u<.35){ const k=B.u/.35; for(let i=0;i<10;i++){ const an=i/10*Math.PI*2+B.n, r=2+k*9; flare(H,-4.6+Math.cos(an)*r,-20.4+Math.sin(an)*r*.8,.55*(1-k)+.2,i%2?starry:gold,i,(1-k)*.9,false,an); } glow(H,-4.6,-20.4,4+k*8,'220,200,255',(1-k)*.35); } }
        // the wisp: a figure-eight around the head with a fading tail
        for(let tr=0;tr<7;tr++){ const tt=t-tr*.045, an=tt*1.4, x=Math.sin(an)*12, y=-2+Math.sin(an*2)*4, z=Math.cos(an); if(z<-.35&&tr===0) break; glow(H,x,y,tr?1.8-tr*.18:3.4,tr?'150,200,255':'210,235,255',(tr?.42-tr*.05:.85)*(z<-.35?.35:1)); if(!tr) dot(H,x,y,.6,'rgba(245,250,255,.95)'); } }
      if(h==='witch'){ glow(H,-3,-11,10,'120,255,160',.1+.05*Math.sin(t*1.7)); for(let i=0;i<6;i++){ const q=((t*.4+i/6)%1), x=-4.6+Math.sin(q*7+i)*2.2*q, y=-21-q*10; glow(H,x,y,1.2+q*1.8,i%2?'150,255,170':'190,140,255',.42*(1-q)); }
        for(let i=0;i<2;i++){ const L=life(1.3+i*.4,i*.6); flare(H,-6+sfxHash(L.n,i)*10,-6-sfxHash(L.n,i+5)*12,.55,i?spec:myth,i,L.a,false); } }
      if(h==='crown'||h==='tiara'){ const pts=h==='crown'?[[-3.6,-14.2],[0,-15.8],[3.6,-14.2]]:[[0,-12.6],[-2.6,-11.8],[2.6,-11.8]]; pts.forEach(([x,y],i)=>{ const L=life(1.4+i*.35,i*.5); flare(H,x,y,.9,gold,i,L.a,true); }); }
      if(h==='halo'){ glow(H,0,-17,8,'255,240,190',.18+.06*Math.sin(t*2)); for(let i=0;i<3;i++){ const L=life(1.2+i*.3,i*.4), ang=i*2.1+L.n*1.7; flare(H,Math.cos(ang)*6,-17+Math.sin(ang)*1.4,.6,gold,i,L.a*.9,false); } }
      if(h==='astro'){ const p0=P(H,-.4,.2), R=10.6*S0(H), kx=((t*.4)%1.8)-.4; c.save(); c.beginPath(); c.arc(p0.x,p0.y,R*.92,0,7); c.clip(); const g=c.createLinearGradient(p0.x-R+kx*2*R,p0.y-R,p0.x-R*.4+kx*2*R,p0.y+R); g.addColorStop(0,'rgba(255,255,255,0)'); g.addColorStop(.5,'rgba(220,240,255,.35)'); g.addColorStop(1,'rgba(255,255,255,0)'); c.fillStyle=g; c.fillRect(p0.x-R,p0.y-R,R*2,R*2); c.restore(); }
      if(h==='diver'){ for(let i=0;i<5;i++){ const q=((t*.5+i*.2)%1); bubble(H,-5+Math.sin(q*9+i)*1.2,-11-q*16,.6+q*.9,1-q); } }
      if(h==='fishbowl'){ for(let i=0;i<4;i++){ const q=((t*.35+i*.25)%1); bubble(H,-3+i*2+Math.sin(q*8+i)*.8,6-q*16,.35+q*.35,Math.sin(q*Math.PI)); } }
      if(h==='tophat'||h==='carnival'){ const per=4.4, k2=(t%per)/per; if(k2<.32){ const e=k2/.32; for(let j=0;j<5;j++){ const ang=j*1.26+Math.floor(t/per), a=Math.sin(e*Math.PI); flare(H,Math.cos(ang)*(6+e*5),-14+Math.sin(ang)*2.2-e*4,.55,h==='carnival'?myth:gold,j,a*.9,true); } } const L=life(2.1,.3); flare(H,4,-15,.6,gold,7,L.a*.7,false); }
      if(h==='headphones'){ for(let i=0;i<3;i++){ const q=((t*.33+i/3)%1), side=i%2?1:-1; note(H,side*9+side*q*3,-4-q*14,4.2,Math.sin(q*Math.PI)*.9,i%2?'#bfe6ff':'#ffd6f4'); } }
      if(h==='mushroom'){ for(let i=0;i<6;i++){ const q=((t*.25+i/6)%1), x=-9+((i*37)%18)+Math.sin(q*6+i)*1.5, y=-3-q*12; glow(H,x,y,.9,'200,255,190',.6*Math.sin(q*Math.PI)); } }
      if(h==='flower'){ for(let i=0;i<2;i++){ const q=((t*.18+i*.5)%1); petal(H,-6+i*8+Math.sin(q*8)*3,-6+q*34,1,q*9+i,i?'#ffb8d8':'#fff0a8',Math.sin(q*Math.PI)*.9); } }
      if(h==='party'){ const per=2.6, k2=(t%per)/per; if(k2<.45){ const e=k2/.45; ink(()=>{ for(let j=0;j<7;j++){ const ang=-Math.PI/2+(j-3)*.42, d=e*9, p=P(H,Math.cos(ang)*d,-19+Math.sin(ang)*d+e*e*7), s=Math.max(.6,.5*S0(H)); c.fillStyle=['#ff5a7a','#ffd84a','#5ad8ff','#7aff9a','#c08aff'][j%5]; c.globalAlpha=1-e; c.fillRect(p.x-s,p.y-s*.5,s*2,s); } }); } }
      if(h==='lanternhat'){ glow(H,0,-18,7,'255,200,110',.32+.08*Math.sin(t*3)+.05*Math.sin(t*11.3)); }
      if(h==='tidecap'){ for(let i=0;i<2;i++){ const L=life(1.5+i*.4,i*.7); flare(H,-5+sfxHash(L.n,i)*10,-9-sfxHash(L.n,i+3)*5,.5,starry,i,L.a,false); } }
      if(['knight','viking','pirate','grad','captain','sailor'].includes(h)){ const L=life(2.6,(hashStr(h)%3)*.4), pt={knight:[4,-6],viking:[-7,-12],pirate:[1.5,-10],grad:[5,-11],captain:[3,-9],sailor:[2,-8]}[h]; flare(H,pt[0],pt[1],.7,gold,0,L.a*.85,true); } }
    // glasses (also on the head): lens glints, pixel sparkles, floating hearts
    if(H&&lk.glasses&&lk.glasses!=='none'){ const gl=lk.glasses;
      if(['sunglasses','heart','goggles','monocle','pixel','nerd','round'].includes(gl)){ const L=life(gl==='monocle'?2.4:3.2,.9); flare(H,7.2,-1.6,gl==='nerd'||gl==='round'?.45:.65,gold,3,L.a*.85,true); }
      if(gl==='pixel'){ ink(()=>{ for(let i=0;i<3;i++){ const q=((t*.6+i/3)%1), p=P(H,9+q*3,-2+((i*5)%4)-1), s=Math.max(.6,.45*S0(H)); c.globalAlpha=Math.sin(q*Math.PI)*.8; c.fillStyle=['#5ae8ff','#ff5ac8','#ffe85a'][i]; c.fillRect(p.x,p.y,s,s); } }); }
      if(gl==='heart'){ const per=3.6, q=(t%per)/per; if(q<.6){ const e=q/.6, p=P(H,9+e*2,-3-e*9), s=Math.max(4,2.6*S0(H)); ink(()=>{ c.globalAlpha=Math.sin(e*Math.PI)*.85; c.fillStyle='#ff6a9a'; c.font='700 '+s.toFixed(1)+'px system-ui'; c.textAlign='center'; c.fillText('♥',p.x,p.y); }); } } }
    // ---------------- outfits (torso coordinates) ----------------
    if(T){ const o=lk.outfit;
      if(o==='tidecoat'){ for(let i=0;i<6;i++){ const xx=-9+i*3.6; glow(T,xx,-21.4+Math.sin(xx*.9+t*2)*1.1,2.4,'90,216,232',.25+.2*Math.sin(t*2.4+i)); } for(let i=0;i<2;i++){ const L=life(1.6+i*.5,i*.8); flare(T,-7+sfxHash(L.n,i)*14,-40+sfxHash(L.n,i+9)*18,.55,starry,i,L.a,false); } }
      if(o==='captain'){ const L=life(2.2,0); flare(T,6.6,-41+(L.n%4)*5.8,.6,gold,0,L.a,true); }
      if(o==='fishsuit'){ for(let i=0;i<3;i++){ const L=life(1.3+i*.3,i*.45); flare(T,-7+sfxHash(L.n,i*3)*14,-47+sfxHash(L.n,i*3+1)*22,.45,myth,i,L.a*.9,false); } }
      if(o==='clownsuit'){ for(let i=0;i<3;i++){ const L=life(1.1+i*.25,i*.37); flare(T,-7+sfxHash(L.n,i*5)*14,-46+sfxHash(L.n,i*5+1)*24,.45,SFX_PAL.rainbow,i+L.n,L.a,false); } }
      if(o==='kimono'){ for(let i=0;i<2;i++){ const q=((t*.16+i*.5)%1); petal(T,-6+i*7+Math.sin(q*7+i)*3,-44+q*40,.9,q*8+i,'#ffc0d8',Math.sin(q*Math.PI)*.85); } }
      if(o==='hotdog'){ for(let i=0;i<3;i++){ const q=((t*.3+i/3)%1); puff(T,-2+i*2.4+Math.sin(q*5+i)*1.4,-52-q*12,1+q*2.4,'rgba(240,240,248,'+(.22*(1-q)).toFixed(3)+')'); } }
      if(o==='raincoat'){ for(let i=0;i<2;i++){ const q=((t*.7+i*.5)%1); puff(T,-6+i*9,-16+q*7,.35,'rgba(190,225,255,'+(.8*(1-q)).toFixed(2)+')'); } }
      if(o==='lifejacket'){ const L=life(3,.5); flare(T,-4+(L.n%3)*4,-31,.5,gold,1,L.a*.7,true,0); } }
    // ---------------- backs (back-item coordinates) ----------------
    if(Bk){ const b=lk.back, w=A.bw||1;
      if(b==='angelwings'){ glow(Bk,-10*w,-45,9,'255,245,210',.12+.05*Math.sin(t*1.8)); for(let i=0;i<4;i++){ const q=((t*.22+i/4)%1); glow(Bk,-12*w-q*5+Math.sin(q*7+i)*2,-46+q*20,.9,'255,240,200',.6*Math.sin(q*Math.PI)); }
        const q=((t*.12)%1); petal(Bk,-14*w-q*6+Math.sin(q*9)*2,-44+q*30,1.1,q*6,'rgba(250,250,255,.95)',Math.sin(q*Math.PI)*.8); }
      if(b==='butterfly'){ for(let i=0;i<5;i++){ const q=((t*.3+i/5)%1); glow(Bk,-11*w+Math.sin(q*6+i)*3,-48+q*18,.7,i%2?'200,255,255':'255,220,250',.65*Math.sin(q*Math.PI)); } }
      if(b==='dragonwings'){ for(let i=0;i<5;i++){ const q=((t*.45+i/5)%1); glow(Bk,-12*w+Math.sin(q*5+i)*3,-42-q*14,.7,'255,140,60',.75*(1-q)); } }
      if(b==='batwings'){ for(let i=0;i<3;i++){ const q=((t*.25+i/3)%1); puff(Bk,-12*w-q*4,-50+Math.sin(q*6+i)*3,1.2+q*1.6,'rgba(60,30,80,'+(.25*(1-q)).toFixed(3)+')'); } }
      if(b==='jetpack'){ for(let i=0;i<4;i++){ const q=((t*.8+i/4)%1); puff(Bk,-7.4*w-2+Math.sin(q*4+i)*1.4,-24+q*14,.8+q*2.6,'rgba(200,200,210,'+(.22*(1-q)).toFixed(3)+')'); } }
      if(b==='lanternpole'){ const lx=-13*w, ly=-60.6; glow(Bk,lx,ly,9,'255,210,130',.18+.06*Math.sin(t*7.3)); ink(()=>{ for(let i=0;i<2;i++){ const ang=t*(3.2+i)+i*2, p=P(Bk,lx+Math.cos(ang)*3.4,ly+Math.sin(ang*1.3)*2.4), s=Math.max(.5,.35*S0(Bk)); c.fillStyle='rgba(60,50,40,.85)'; c.beginPath(); c.ellipse(p.x,p.y,s*1.4,s*.7,ang,0,7); c.fill(); } }); }
      if(b==='tidecape'||b==='tidewings'){ for(let i=0;i<3;i++){ const L=life(1.4+i*.35,i*.5); flare(Bk,-13*w+sfxHash(L.n,i)*8*w,-44+sfxHash(L.n,i+4)*24,.5,starry,i,L.a,false); } }
      if(b==='guitar'){ const q=((t*.3)%1); note(Bk,-9*w-q*4,-40-q*14,4.4,Math.sin(q*Math.PI)*.8,'#ffe6a8'); } }
    // ---------------- necks ----------------
    if(N){ const n=lk.neck;
      if(n==='goldchain'||n==='pearls'){ for(let i=0;i<2;i++){ const L=life(1.5+i*.4,i*.7), a0=.3+sfxHash(L.n,i)*2.5, rx=5*(A.nw||1), ry=n==='goldchain'?5.4:4.2; flare(N,.4+Math.cos(a0)*rx,-45.4+Math.sin(a0)*ry,n==='goldchain'?.6:.45,n==='goldchain'?gold:starry,i,L.a,false); } }
      if(n==='medal'){ const L=life(2,.2); flare(N,1.2,-38,.7,gold,0,L.a,true); }
      if(n==='lei'){ const q=((t*.15)%1); petal(N,2+Math.sin(q*7)*2,-42+q*28,.8,q*7,'#ff9ac0',Math.sin(q*Math.PI)*.8); }
      if(n==='tidescarf'){ const L=life(1.7,.3); flare(N,-3+sfxHash(L.n,1)*6,-44+sfxHash(L.n,2)*5,.5,starry,0,L.a,false); } }
    // ---------------- shoes (feet, at ground level) ----------------
    if(F){ const s=lk.shoes||'boots';
      if(s==='glowkicks'){ for(const fx of [F.f,F.b]) glow(F.M,fx+1.4,-.6,5,'110,240,255',.22+.12*Math.sin(t*3)); for(let i=0;i<2;i++){ const L=life(1.1+i*.3,i*.5); flare(F.M,(i?F.f:F.b)+sfxHash(L.n,i)*5-1,-1.5-sfxHash(L.n,i+2)*2,.5,starry,i,L.a,false); } }
      if(s==='tidetreads'){ const L=life(1.6,.4); flare(F.M,F.b+sfxHash(L.n,3)*5,-2.2,.5,starry,0,L.a,false); }
      if(s==='moonboots'){ for(let i=0;i<2;i++){ const L=life(1.8+i*.4,i*.9); flare(F.M,(i?F.f:F.b)+sfxHash(L.n,i)*4,-3-sfxHash(L.n,i+1)*2,.45,starry,i,L.a,false); } }
      if(s==='rollers'){ const L=life(1.2,0); flare(F.M,F.b+(L.n%3)*1.6,.6,.45,gold,0,L.a,false); }
      if(s==='fishfeet'){ for(let i=0;i<2;i++){ const q=((t*.4+i*.5)%1); bubble(F.M,F.b+3+i*2,-1-q*9,.4+q*.4,Math.sin(q*Math.PI)); } } }
    c.restore(); }catch(e){} }

// ---------- the Wardrobe preview is alive: while it is on screen it is drawn every display frame, so the angler breathes and every
// cosmetic effect above plays there too (it used to be drawn once, a still picture). Stops by itself when the page closes ----------
{ let raf=0; const loop=()=>{ raf=0; const c=document.getElementById('lookcv'); if(!c||!c.isConnected) return; if(!document.hidden){ const r=c.getBoundingClientRect(); if(r.width>0&&r.bottom>0&&r.top<innerHeight) drawLookPreview(); } raf=requestAnimationFrame(loop); };
  const _rp=renderPanel; renderPanel=function(){ const x=_rp.apply(this,arguments); try{ if(!raf&&document.getElementById('lookcv')) raf=requestAnimationFrame(loop); }catch(e){} return x; }; }
