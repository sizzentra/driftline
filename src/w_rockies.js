// =====================================================================
// Rocky Mountains: its whole scene in one file (Clean Scenes 5, 2026-11-22): the scene, then its extra life and its own moment
// (WA_MORE). Its colours (WA_PAL) and the newer waters' shared drawing helpers stay in cn_waterart.js.
// =====================================================================
V3SCENES.rockies={
  sky(P,t,hz){ const gl=P.gloom||0; if(P.night<.2||gl>.45) return; const a=(P.night-.2)/.8*(1-gl);
    if(!waStarsC||waStarsC.w!==W||waStarsC.h!==hz){ const r=v3rng(91); waStarsC={w:W,h:hz,a:Array.from({length:240},()=>{ const u=r(), band=r()<.45; const x=band?u*W:r()*W, y=band?(hz*.08+u*hz*.6+(r()-.5)*hz*.18):r()*hz*.8; return [x,y,r(),r()<.07]; })}; }
    for(let i=0;i<7;i++){ const u=i/6; v3glow(g,W*(.05+u*.9),hz*(.12+u*.55),H*.14,'rgba(210,215,255,.9)',.07*a); }
    g.fillStyle='#ffffff'; for(const s of waStarsC.a){ g.globalAlpha=a*(.3+.7*Math.abs(Math.sin(t*.9+s[2]*17))); const z=s[3]?1.7:.9; g.fillRect(s[0],s[1],z,z); } g.globalAlpha=1; },
  land(x,P,hz,cnv){
    /* map redo (director, 2026-11-22: "recycled mountains again"): the Canadian Rockies' own shape, tilted limestone slabs: each peak a
       long ramp of rock beds rising one way and breaking off in a steep cliff the other, the beds drawn as bands with snow lying on them;
       the snow and the pale rock dim with the night (they shone white at night) */
    { const nk=P.night*.55, rock=mix(mix(P.far,'#c8c0b8',.25),'#141a30',nk), rockD=mix(mix(P.far,'#3a3a50',.45),'#0a0e20',nk), sn=mix(P.snow||'#f4f8ff','#3a4a70',nk);
      const peaks=[[.02,.16,.2,1],[.22,.3,.18,-1],[.43,.24,.16,1],[.62,.33,.2,1],[.84,.26,.18,-1],[1.02,.2,.16,1]];
      for(const [cx,hh,ww,dir] of peaks){ const top=hz-H*hh, tx=W*cx, ramp=W*ww, cliff=W*ww*.28, foot=hz+1, lx=dir>0?tx-ramp:tx-cliff, rx=dir>0?tx+cliff:tx+ramp;
        x.fillStyle=rock; x.beginPath(); x.moveTo(lx,foot); x.lineTo(tx,top); x.lineTo(rx,foot); x.closePath(); x.fill();
        x.fillStyle=rockD; x.beginPath(); x.moveTo(tx,top); x.lineTo(dir>0?rx:lx,foot); x.lineTo(tx+(dir>0?cliff*.2:-cliff*.2),foot); x.closePath(); x.fill(); /* the shadowed cliff face */
        x.save(); x.beginPath(); x.moveTo(lx,foot); x.lineTo(tx,top); x.lineTo(rx,foot); x.closePath(); x.clip(); const sl=(top-foot)/((dir>0?tx-lx:rx-tx)||1);
        for(let k=1;k<10;k++){ const d=k*((dir>0?tx-lx:rx-tx))/10*1.15, sx=dir>0?lx+d:rx-d, ex=dir>0?sx+W*.5:sx-W*.5, ey=foot+sl*W*.5; /* rock beds parallel to the ramp, inside it */
          x.strokeStyle=v3rgba(rockD,.5); x.lineWidth=Math.max(1,H*.0025); x.beginPath(); x.moveTo(sx,foot); x.lineTo(ex,ey); x.stroke();
          if(k<6){ x.strokeStyle=v3rgba(sn,.85); x.lineWidth=Math.max(1.4,H*.0045); x.beginPath(); x.moveTo(sx-(dir>0?1:-1)*W*.003,foot); x.lineTo(ex-(dir>0?1:-1)*W*.003,ey); x.stroke(); } }
        x.restore(); }
      const hg=x.createLinearGradient(0,hz-H*.2,0,hz); hg.addColorStop(0,v3rgba(P.farHaze,0)); hg.addColorStop(1,v3rgba(P.farHaze,.55)); x.fillStyle=hg; x.fillRect(0,hz-H*.2,W,H*.2); }
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
    /* the shore forest (director: no recycled look): uneven spruce of very different heights with golden larches among them, never one even row */
    { const r=v3rng(23); for(let row=0;row<2;row++) for(let i=0;i<30;i++){ const px=W*(i/29)+(r()-.5)*W*.02, base=hz-H*(.004+row*.004), h=H*(.035+r()*.07)*(row?1.15:1); if(row&&((px>W*.34&&px<W*.62)||(px>W*.76&&px<W*.86))) continue;
      const larch=r()<.22, col=larch?mix('#c89a3a',P.front,.25+P.night*.5):(row?P.front:mix(P.back,P.farHaze,.3)); v3pine(x,px,base,h*(larch?.85:1),col,P.rim,.25*(1-P.night)); } }
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
fore(P,t){ /* the pine that hung in from the top corner (director: floating trees) now stands rooted on a boulder in the bottom corner */ const b=H+2, rc=mix('#6a6460',P.top,P.night*.4); v3rock(g,W*.965,b-H*.035,W*.06,H*.07,P); const sw=Math.sin(t*.7)*.01; g.save(); g.translate(W*.965,b-H*.06); g.rotate(sw); v3pine(g,0,0,H*.42,mix('#1a3424',P.top,P.night*.4),null,0); g.restore(); }
};
