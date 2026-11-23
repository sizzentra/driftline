// =====================================================================
// FLORIDA KEYS: THE FLATS SKIFF (overnight, 2026-11-23; its own design, MAP_THEMES › Keys: flats fishing for tarpon and bonefish).
// A shallow-draft skiff floating on the flats, seen from the side, bow to the right where the angler casts: a low fiberglass hull with a
// sheer rising to a sharp bow, a rub rail and a boot stripe, only a sliver below the waterline (shown through the water), an outboard on the
// transom; a center console with a windscreen, a poling platform over the motor, or a plain tiller boat; a T-top, a bimini or a clamp-on
// umbrella; rods, a cooler or a flamingo float. It is staked out with a push pole planted in the sand off the stern.
// The ids (hull, top, console, gear, light) are the old skiff's, so saved choices still fit.
// =====================================================================
const FK = {
  geo(o){ const x0=Math.max(HF.x0(),0)+W*.06, xb=o.pw+W*.014, y=o.dockY, wl=o.wl; return {x0,xb,y,wl,len:xb-x0,mid:x0+(xb-x0)*.45}; },
  /* the hull: sheer line, chine, bow; kind 0 flats skiff, 1 bay boat (taller bow), 2 jon boat (square, flat) */
  hull(o,kind,c){ const q=o.x, g=FK.geo(o), lit=HK.lit(o), y=g.y, wl=g.wl, rise=kind===1?H*.04:kind===2?H*.004:H*.024, bot=wl+H*(kind===2?.004:.008), fx=g.xb-(kind===2?W*.02:g.len*.22);
    const sheer=X=>y-rise*Math.pow(Math.max(0,(X-g.x0)/g.len),2.2);
    q.save(); q.beginPath(); q.moveTo(g.x0,y); for(let X=g.x0;X<=g.xb;X+=4) q.lineTo(X,sheer(X)); if(kind===2){ q.lineTo(g.xb-W*.006,bot-H*.004); } else q.quadraticCurveTo(g.xb-W*.004,wl-H*.004,fx,bot); q.lineTo(g.x0+W*.004,bot); q.lineTo(g.x0,y); q.closePath();
    const hg=q.createLinearGradient(0,y,0,bot); hg.addColorStop(0,HK.n(o,HK.lt(c,.08))); hg.addColorStop(1,HK.n(o,HK.dk(c,.18))); q.fillStyle=hg; q.fill(); q.clip();
    q.fillStyle=HK.n(o,kind===2?HK.dk(c,.25):'#0a7090'); q.fillRect(g.x0,wl-H*.009,g.len+W*.01,H*.005); /* the boot stripe */
    if(kind===2){ q.strokeStyle=HK.n(o,HK.dk(c,.2)); q.lineWidth=1; q.beginPath(); for(let X=g.x0+W*.01;X<g.xb;X+=W*.012){ q.moveTo(X,y); q.lineTo(X,bot); } q.stroke(); } /* jon boat ribs */
    q.fillStyle=v3rgba(o.P.wMid||'#28c0c8',.55); q.fillRect(g.x0-2,wl,g.len+W*.02,H*.03); q.restore(); /* the sliver under the water, seen through it */
    q.strokeStyle=HK.n(o,'#3a3a40'); q.lineWidth=Math.max(2.5,H*.005); q.beginPath(); q.moveTo(g.x0,y); for(let X=g.x0;X<=g.xb;X+=4) q.lineTo(X,sheer(X)); q.stroke(); HK.line(o,[g.x0,y+H*.004,g.xb-W*.01,sheer(g.xb-W*.01)+H*.004],v3rgba('#ffffff',.25*lit),1); /* rub rail and its highlight */
    q.fillStyle=HK.n(o,HK.dk(c,.45)); q.font=Math.round(H*.011)+'px sans-serif'; q.fillText('FL 7212 KY',g.x0+g.len*.68,y+(wl-y)*.55); /* registration */
    const mx=g.x0-W*.018, mt=y-H*.045; HK.rect(o,mx+W*.011,y-H*.004,W*.004,wl-y+H*.03,'#2a2a30'); HK.poly(o,[mx,mt,mx+W*.02,mt-H*.006,mx+W*.022,mt+H*.04,mx+W*.004,mt+H*.046],'#2a2a30'); HK.rect(o,mx+W*.002,mt+H*.008,W*.014,H*.004,'#f4f6f4'); HK.rect(o,mx+W*.012,wl+H*.022,W*.008,H*.006,'#2a2a30'); /* the outboard on the transom */
    o.low=Math.max(o.low==null?-1e9:o.low,y-H*.004); },
  /* center console with a windscreen and grab rail, a poling platform over the motor, or a tiller boat (bench and tiller arm) */
  console(o,s,c){ const g=FK.geo(o), y=g.y, x=g.mid;
    if(s===0){ const w=W*.028, h=H*.05; HK.block(o,x,y-h,w,h,c); HK.rect(o,x,y-h,w,H*.004,HK.dk(c,.2)); HK.poly(o,[x+W*.004,y-h,x+W*.01,y-h-H*.026,x+w-W*.002,y-h-H*.026,x+w,y-h],v3rgba('#9ad0e0',.55)); HK.line(o,[x+W*.01,y-h-H*.026,x+w-W*.002,y-h-H*.026],'#b8c0c4',1.5); HK.rect(o,x+w*.3,y-h+H*.012,w*.4,H*.012,'#2a3440'); HK.line(o,[x-W*.004,y-h*.4,x-W*.004,y-h,x+W*.002,y-h],'#b8c0c4',1.5); }
    if(s===1){ const px=g.x0-W*.008, pt=y-H*.11, pw=W*.03; for(const a of [px,px+pw]) HK.line(o,[a,y,a+(a===px?W*.004:-W*.004),pt],'#b8c0c4',2); HK.line(o,[px+W*.002,y-H*.055,px+pw-W*.002,y-H*.055],'#b8c0c4',1.5); HK.rect(o,px-W*.002,pt-H*.004,pw+W*.004,H*.006,c); HK.line(o,[px+pw,pt-H*.004,px+pw+W*.002,pt-H*.02],'#b8c0c4',1.2); HK.block(o,x,y-H*.03,W*.02,H*.03,c); } /* poling platform at the stern, a low console */
    if(s===2){ HK.block(o,g.x0+W*.02,y-H*.016,W*.04,H*.016,c); HK.line(o,[g.x0-W*.004,y-H*.03,g.x0+W*.02,y-H*.022],'#2a2a30',2.5); } /* a bench and the outboard's tiller arm */ },
  /* the top over the console: an aluminium T-top with rod holders on it, a bimini on bows, or a clamp-on umbrella */
  top(o,s,c){ const g=FK.geo(o), y=g.y, x=g.mid; if(!s) return; const q=o.x;
    if(s===1){ const tt=y-H*.13, a=x-W*.004, b=x+W*.032; HK.line(o,[a,y-H*.05,a,tt],'#b8c0c4',2); HK.line(o,[b,y-H*.05,b,tt],'#b8c0c4',2); q.fillStyle=HK.n(o,c); q.beginPath(); q.moveTo(a-W*.012,tt); q.quadraticCurveTo((a+b)/2,tt-H*.008,b+W*.012,tt); q.lineTo(b+W*.01,tt+H*.008); q.lineTo(a-W*.01,tt+H*.008); q.closePath(); q.fill(); for(let k=0;k<4;k++) HK.line(o,[a+k*W*.011,tt-H*.004,a+k*W*.011-W*.004,tt-H*.03],'#b8c0c4',1.2); o.low=Math.max(o.low==null?-1e9:o.low,tt+H*.008); } /* T-top with rocket launchers */
    if(s===2){ const a=g.x0+W*.01, b=x+W*.02, tt=y-H*.1; HK.line(o,[a,y,a+W*.01,tt],'#b8c0c4',1.5); HK.line(o,[b,y-H*.01,b-W*.004,tt],'#b8c0c4',1.5); q.fillStyle=HK.n(o,c); q.beginPath(); q.moveTo(a+W*.004,tt+H*.004); q.quadraticCurveTo((a+b)/2,tt-H*.018,b+W*.004,tt+H*.004); q.lineTo(b,tt+H*.012); q.quadraticCurveTo((a+b)/2,tt-H*.006,a+W*.008,tt+H*.012); q.closePath(); q.fill(); o.low=Math.max(o.low==null?-1e9:o.low,tt+H*.012); } /* bimini */
    if(s===3) HK.roof(o,c,'beachumbrella',.1,.42); },
  gear(o,s,c){ const g=FK.geo(o), y=g.y, x=g.mid+W*.04;
    if(s===0) for(let i=0;i<3;i++){ const rx=g.x0+W*.012+i*W*.008; HK.line(o,[rx,y+H*.004,rx+W*.004,y-H*.12],'#2a2a30',1.2); HK.circ(o,rx+W*.0012,y-H*.012,H*.003,'#b8c0c4'); } /* rods in the gunwale holders by the stern */
    if(s===1){ HK.block(o,x,y-H*.024,W*.026,H*.024,c); HK.rect(o,x,y-H*.024,W*.026,H*.004,HK.dk(c,.15)); HK.rect(o,x+W*.004,y-H*.024,W*.002,H*.024,'#2a2a30'); HK.rect(o,x+W*.02,y-H*.024,W*.002,H*.024,'#2a2a30'); } /* a cooler with its straps */
    if(s===2){ const fx=g.x0+W*.04, fy=y+H*.006; HK.ell(o,fx,fy-H*.004,W*.014,H*.008,c); o.x.strokeStyle=HK.n(o,c); o.x.lineWidth=Math.max(3,H*.007); o.x.beginPath(); o.x.moveTo(fx+W*.008,fy-H*.006); o.x.quadraticCurveTo(fx+W*.014,fy-H*.03,fx+W*.006,fy-H*.036); o.x.stroke(); HK.poly(o,[fx+W*.006,fy-H*.038,fx,fy-H*.034,fx+W*.006,fy-H*.032],'#f4e07a'); } /* an inflatable flamingo riding on the deck */ },
  /* the stake-out: a push pole planted in the sand off the stern, tied to a cleat */
  ground(o){ const g=FK.geo(o), y=g.y; HK.line(o,[g.x0-W*.04,g.wl+H*.05,g.x0-W*.036,y-H*.16],'#e8e0c8',Math.max(2,H*.0035)); HK.rect(o,g.x0-W*.042,g.wl+H*.03,W*.006,H*.006,'#3a3a40'); HK.line(o,[g.x0-W*.038,y-H*.02,g.x0+W*.004,y-H*.002],'#c8a878',1); }
};
