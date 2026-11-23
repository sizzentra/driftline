// =====================================================================
// BRINE SHELF: THE SPORT-FISHER (overnight, 2026-11-23; its own design, MAP_THEMES › Brine Shelf: big-game boats off Cabo, Hawaii, the Azores).
// The after half of a big-game boat floating on the swell, its stern toward the fish where the fighting chair is: a tall flared hull with
// the bow running off the left edge, a sheer stepping down to the cockpit, a transom with a tuna door and a swim platform, a cabin with a raked
// windscreen and portholes, a life ring; on top a flybridge with a ladder, an enclosed wheelhouse or a tuna tower; outriggers splayed out,
// a rod rack or a gaff rack; signal flags, a marlin pennant or a burgee. The ids are the old boat's, so saved choices still fit.
// =====================================================================
const SF = {
  geo(o){ const xs=o.pw+W*.008, x0=Math.min(HF.x0(),0)-W*.02, y=o.dockY, wl=o.wl, ck=xs-(xs-Math.max(HF.x0(),0))*.42, cab0=Math.max(HF.x0(),0)+W*.01; return {x0,xs,y,wl,ck,cab0,len:xs-x0}; },
  /* the hull: high at the bow (off the left edge), stepping down to the cockpit, transom with a swim platform; kind 0 sport-fisher, 1 wooden cruiser, 2 steel workboat */
  hull(o,kind,c){ const q=o.x, g=SF.geo(o), lit=HK.lit(o), y=g.y, wl=g.wl, hb=y-H*(kind===2?.03:.05), bot=wl+H*.02;
    q.save(); q.beginPath(); q.moveTo(g.x0,hb-H*.02); q.lineTo(g.ck-W*.02,hb); q.quadraticCurveTo(g.ck,hb,g.ck+W*.01,y); q.lineTo(g.xs,y); q.lineTo(g.xs-W*.004,bot); q.lineTo(g.x0,bot+H*.01); q.closePath();
    const hg=q.createLinearGradient(0,hb,0,bot); hg.addColorStop(0,HK.n(o,HK.lt(c,.06))); hg.addColorStop(1,HK.n(o,HK.dk(c,.22))); q.fillStyle=hg; q.fill(); q.clip();
    if(kind===1){ q.strokeStyle=HK.n(o,HK.dk(c,.25)); q.lineWidth=1; q.beginPath(); for(let Y=hb+H*.012;Y<bot;Y+=H*.012){ q.moveTo(g.x0,Y); q.lineTo(g.xs,Y); } q.stroke(); } /* carvel planking */
    if(kind===2){ q.strokeStyle=HK.n(o,HK.dk(c,.3)); q.lineWidth=1; q.beginPath(); for(let X=g.x0+W*.03;X<g.xs;X+=W*.04){ q.moveTo(X,hb); q.lineTo(X,bot); } q.stroke(); HK.rect(o,g.x0,y+H*.03,g.len,H*.004,'#c8382e'); } /* welded plates and a red band */
    q.fillStyle=HK.n(o,kind===0?'#1e2e4a':'#f2f2ee'); q.fillRect(g.x0,wl-H*.012,g.len+W*.01,H*.006); q.fillStyle=v3rgba(o.P.wMid||'#2a7a9a',.6); q.fillRect(g.x0-2,wl,g.len+W*.02,H*.04); q.restore(); /* boot stripe; the part under the swell seen through it */
    HK.line(o,[g.x0,hb-H*.02,g.ck-W*.02,hb],'#c0c8cc',2); HK.line(o,[g.ck+W*.01,y,g.xs,y],'#c0c8cc',2); /* chrome rub rails */
    HK.rect(o,g.xs-W*.004,y,W*.002,(wl-y)*.6,HK.dk(c,.3)); HK.rect(o,g.xs-W*.03,y+H*.004,W*.002,(wl-y)*.55,HK.dk(c,.25)); /* the tuna door in the transom */
    HK.rect(o,g.xs-W*.004,wl-H*.024,W*.022,H*.006,'#a8743a'); HK.rect(o,g.xs+W*.016,wl-H*.024,W*.002,H*.01,'#c0c8cc'); /* swim platform */
    q.fillStyle=HK.n(o,HK.dk(c,.45)); q.font='italic bold '+Math.round(H*.013)+'px sans-serif'; q.fillText('REEL DEAL',g.ck-W*.08,(hb+wl)/2+H*.01); /* her name */
    o.low=Math.max(o.low==null?-1e9:o.low,y-H*.004); },
  /* the cabin behind the cockpit, with a raked windscreen, portholes and a life ring; then the flybridge, wheelhouse or tuna tower on top */
  bridge(o,s,c,hullC){ const g=SF.geo(o), y=g.y, hb=y-H*.05, a=g.cab0, b=g.ck-W*.004, ct=hb-H*.07, q=o.x;
    q.fillStyle=HK.n(o,HK.lt(hullC,.04)); q.beginPath(); q.moveTo(a,hb); q.lineTo(a,ct); q.lineTo(b-W*.024,ct); q.lineTo(b,hb); q.closePath(); q.fill();
    HK.poly(o,[b-W*.03,ct+H*.006,b-W*.022,ct+H*.006,b-W*.004,hb-H*.004,b-W*.014,hb-H*.004],v3rgba('#2a3440',.9)); for(let k=0;k<3;k++) HK.circ(o,a+W*.02+k*W*.024,ct+H*.035,H*.007,'#2a3440'); { q.strokeStyle=HK.n(o,'#e85a2a'); q.lineWidth=Math.max(3,H*.006); q.beginPath(); q.arc(a+W*.084,ct+H*.035,H*.01,0,7); q.stroke(); } /* windscreen, portholes, a life ring */
    const ft=ct-H*.055;
    if(s===0){ for(const px of [a+W*.01,b-W*.03]) HK.line(o,[px,ct,px,ft],'#c0c8cc',2); HK.rect(o,a-W*.004,ft-H*.006,b-a-W*.016,H*.008,c); HK.poly(o,[b-W*.03,ct,b-W*.02,ct-H*.03,b-W*.03,ct-H*.03],v3rgba('#9ad0e0',.6)); HK.line(o,[b-W*.03,ct,b+W*.004,hb],'#c0c8cc',1.5); for(let k=1;k<4;k++){ const u=k/4; HK.line(o,[b-W*.03+(W*.034)*u-W*.004,ct+(hb-ct)*u,b-W*.03+(W*.034)*u+W*.004,ct+(hb-ct)*u],'#c0c8cc',1); } } /* open flybridge with a hardtop and a ladder down to the cockpit */
    if(s===1){ HK.block(o,a+W*.01,ft,b-a-W*.05,ct-ft,c); HK.rect(o,a+W*.016,ft+H*.012,b-a-W*.062,H*.018,'#2a3440'); HK.rect(o,a+W*.006,ft-H*.006,b-a-W*.04,H*.006,HK.dk(c,.2)); } /* an enclosed wheelhouse */
    if(s===2){ const tt=ft-H*.11, m=(a+b)/2; for(const px of [m-W*.03,m+W*.02]) HK.line(o,[px,ct,px+(m-px)*.3,tt],'#c0c8cc',2); HK.line(o,[m-W*.025,ct-H*.06,m+W*.018,ct-H*.06],'#c0c8cc',1.5); HK.rect(o,m-W*.026,tt-H*.006,W*.05,H*.008,c); HK.line(o,[m-W*.026,tt-H*.024,m+W*.024,tt-H*.024],'#c0c8cc',1.5); } /* a tuna tower */
    o.top=Math.min(o.top==null?y-H*.23:o.top,ft-H*(s===2?.14:.02)); },
  /* outriggers splayed back over the stern, a rod rack on the cabin, or a gaff rack */
  rig(o,s,c){ const g=SF.geo(o), y=g.y, ct=y-H*.12, a=g.cab0;
    if(s===0){ HK.line(o,[g.ck-W*.03,ct,g.ck+W*.06,ct-H*.2],c,1.8); HK.line(o,[g.ck-W*.04,ct,g.ck+W*.03,ct-H*.22],HK.dk(c,.2),1.4); HK.line(o,[g.ck+W*.06,ct-H*.2,g.xs+W*.01,y-H*.02],'rgba(230,230,230,.5)',.6); }
    if(s===1) for(let k=0;k<5;k++){ const rx=a+W*.016+k*W*.012; HK.line(o,[rx,ct-H*.004,rx+W*.004,ct-H*.1],'#2a2a30',1.2); HK.rect(o,rx-W*.002,ct-H*.01,W*.004,H*.008,c); }
    if(s===2){ const rx=g.ck+W*.016; HK.rect(o,rx,y-H*.05,W*.03,H*.004,c); for(let k=0;k<3;k++){ HK.line(o,[rx+W*.006+k*W*.009,y-H*.05,rx+W*.006+k*W*.009,y-H*.012],'#c0c8cc',1.2); HK.curve(o,rx+W*.006+k*W*.009,y-H*.012,rx+W*.009+k*W*.009,y-H*.004,rx+W*.012+k*W*.009,y-H*.012,'#c0c8cc',1.2); } } /* gaffs hung by the cockpit */ }
};
