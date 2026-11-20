// =====================================================================
// 0.4.9 a platform of its own for every new water (director: "don't overly use duplicated assets ... Everything should feel original").
// Cherry Blossom: a red lacquered bridge. Rockies: a granite ledge with cut logs. Florida Keys: a flats skiff. Amazon: a stilt deck under
// a palm-leaf roof. Animal Farm: a dock with hay bales and a white fence. The Buffet: a giant china platter. Corporate Pond: a steel and
// glass pier. The Nile: a felucca deck with its sail. Circuit Lake: a neon hover pad. Mount Olympus: marble temple steps.
// Each has its own light (which follows the Home light colour).
// =====================================================================
const WA_PLAT={blossom:'bridge', rockies:'ledge', keys:'skiff', amazon:'stilts', farm:'haydock', buffet:'platter', corporate:'steelpier', nile:'felucca', circuit:'hover', olympus:'marble'};
for(const id in WA_PLAT){ const L=LOCS[locIdx(id)]; if(L) L.plat=WA_PLAT[id]; }
/* C33/C35 functional homes (Cam, 2026-11-20: "wood and metal colour/material editable like every other dock"; "functional customizable
   homes" on every new map): each new home now offers the wood choices for its wooden parts and one paint for its signature part
   (lacquer, fence, hull, rim, steel, sail, neon, trim), named for what it paints. Until a wood other than the starter oak is picked the
   home keeps its own natural wood, so nothing changes for players who never open the page. */
const WA_WOOD=new Set(['bridge','ledge','stilts','haydock','felucca']);
const WA_PAINT={bridge:['Lacquer','#c8382a','the railings and posts'], ledge:['Canoe paint','#c8402a','the canoe'], haydock:['Fence paint','#ffffff','the fence'], skiff:['Hull paint','#f4f0e8','the hull'], platter:['Rim colour','#3a6ab8','the rim'], steelpier:['Steel finish','#8a96a4','the deck and legs'], felucca:['Sail colour','#f8f0e0','the sail'], hover:['Neon colour','#3af0ff','the glow'], marble:['Trim','#e8b830','the gold trim']};
const waWood = def => { const id=(DOCK_PV&&DOCK_PV.kind==='wood')?DOCK_PV.id:S.dock.wood; return !id||id==='oak'?def:dockWood(); };
const waPaint = plat => homeHull(WA_PAINT[plat][1]);
try{ for(const p of Object.values(WA_PLAT)) HOME_FEATURES[p]=[WA_WOOD.has(p)?'wood':'', WA_PAINT[p]?'hull':'', 'light'].filter(Boolean);
  for(const p in WA_PAINT){ HOME_PAINT_NAMES[p]=WA_PAINT[p][0]; HOME_PAINT_PARTS[p]=WA_PAINT[p][2]; }
  Object.assign(HOME_NAMES,{bridge:'bridge', ledge:'ledge', skiff:'skiff', stilts:'stilt deck', haydock:'hay dock', platter:'platter', steelpier:'pier', felucca:'felucca', hover:'hover pad', marble:'steps'}); }catch(e){}
function waLamp(t,x,y,lit){ if(lit<=.05) return; v3glow(g,x,y,H*.16,'rgba('+homeLight('255,200,110')+',.85)',lit*.55*(.93+.07*Math.sin(t*7.1))); g.fillStyle='rgba(255,236,190,'+(.5+lit*.5)+')'; g.beginPath(); g.arc(x,y,H*.008,0,7); g.fill(); }
const waLit = (P,night) => clamp(night*1.2+P.d*.9,0,1);
Object.assign(V3PLAT,{
  bridge(P,t,night,dockY){ const PW=W*.2, N=c=>mix(c,'#0a1020',night*.55), red=N(waPaint('bridge')), wd=waWood('#9a6a44'), th=H*.016, arc=u=>dockY-H*.02*4*u*(1-u);
    g.fillStyle=N(mix(wd,'#000000',.42)); g.beginPath(); g.moveTo(-2,dockY+th); g.quadraticCurveTo(PW*.5,dockY-H*.024+th,PW,dockY+th); g.lineTo(PW,dockY+th*1.8); g.quadraticCurveTo(PW*.5,dockY-H*.016+th,-2,dockY+th*1.8); g.closePath(); g.fill();
    g.fillStyle=N(wd); g.beginPath(); g.moveTo(-2,dockY); g.quadraticCurveTo(PW*.5,dockY-H*.04,PW,dockY); g.lineTo(PW,dockY+th); g.quadraticCurveTo(PW*.5,dockY-H*.04+th,-2,dockY+th); g.closePath(); g.fill();
    g.fillStyle=red; for(const px of [.04,.95]) g.fillRect(PW*px-H*.006,dockY+th,H*.012,H-dockY);
    for(let i=0;i<=6;i++){ const u=i/6; g.fillRect(PW*u-1.2,arc(u)-H*.05,2.4,H*.05); }
    g.strokeStyle=red; g.lineWidth=Math.max(2,H*.006); g.beginPath(); for(let i=0;i<=20;i++){ const u=i/20; i?g.lineTo(PW*u,arc(u)-H*.05):g.moveTo(PW*u,arc(u)-H*.05); } g.stroke();
    const lit=waLit(P,night); g.fillStyle=N('#f0e8d8'); g.fillRect(PW*.86,dockY-H*.095,H*.018,H*.026); waLamp(t,PW*.86+H*.009,dockY-H*.082,lit); },
  ledge(P,t,night,dockY){ const PW=W*.2, N=c=>mix(c,'#0a1020',night*.55);
    g.fillStyle=N('#5a5a62'); g.beginPath(); g.moveTo(-2,dockY-2); g.lineTo(PW*.5,dockY-4); g.lineTo(PW*.95,dockY); g.lineTo(PW*1.05,H); g.lineTo(-2,H); g.closePath(); g.fill();
    g.fillStyle=N('#7a7a84'); g.beginPath(); g.moveTo(-2,dockY-2); g.lineTo(PW*.5,dockY-4); g.lineTo(PW*.95,dockY); g.lineTo(PW*.9,dockY+H*.02); g.lineTo(-2,dockY+H*.016); g.closePath(); g.fill();
    g.strokeStyle=N('#4a4a52'); g.lineWidth=1; for(const [a,b] of [[.2,.35],[.55,.7]]){ g.beginPath(); g.moveTo(PW*a,dockY+H*.03); g.lineTo(PW*b,dockY+H*.08); g.stroke(); }
    for(let i=0;i<3;i++){ { const lw=waWood('#7a4a2a'); g.fillStyle=N(i%2?mix(lw,'#ffffff',.1):lw); } g.beginPath(); g.ellipse(PW*(.62+i*.09),dockY-H*.012,H*.03,H*.011,0,0,7); g.fill(); g.fillStyle=N('#d8b080'); g.beginPath(); g.ellipse(PW*(.62+i*.09)+H*.028,dockY-H*.012,H*.006,H*.01,0,0,7); g.fill(); }
    /* C34: a canoe pulled up on the ledge, upside down, in the Canoe paint (the Rockies home's paint choice) */
    { const cp=N(waPaint('ledge')), cx=PW*.22, cy=dockY-H*.004, L=PW*.2, hh=H*.016; g.fillStyle=cp; g.beginPath(); g.moveTo(cx-L,cy); g.quadraticCurveTo(cx-L*.9,cy-hh*1.4,cx,cy-hh*1.5); g.quadraticCurveTo(cx+L*.9,cy-hh*1.4,cx+L,cy); g.closePath(); g.fill();
      g.fillStyle=mix(cp,'#ffffff',.25); g.beginPath(); g.ellipse(cx-L*.15,cy-hh*1.15,L*.55,hh*.18,0,0,7); g.fill(); g.fillStyle=N('#c8a070'); g.fillRect(cx-L*.98,cy-hh*.22,L*1.96,hh*.22); }
    const lit=waLit(P,night); g.fillStyle=N('#3a3a40'); g.fillRect(PW*.9,dockY-H*.07,2.5,H*.07); waLamp(t,PW*.9+1,dockY-H*.075,lit); },
  skiff(P,t,night,dockY){ const PW=W*.2, N=c=>mix(c,'#0a1020',night*.55), b=0;
    g.fillStyle=N(waPaint('skiff')); g.beginPath(); g.moveTo(-2,dockY+b); g.lineTo(PW*1.05,dockY+b); g.quadraticCurveTo(PW*1.12,dockY+H*.02+b,PW*.95,dockY+H*.05+b); g.lineTo(-2,dockY+H*.05+b); g.closePath(); g.fill();
    g.fillStyle=N('#3a9ab8'); g.fillRect(-2,dockY+H*.014+b,PW*1.02,H*.008); g.fillStyle=N('#c8c0b0'); g.fillRect(-2,dockY+b-2,PW*1.05,3);
    g.fillStyle=N('#2a2a30'); g.fillRect(PW*.02,dockY-H*.035+b,H*.03,H*.035); g.fillStyle=N('#5a5a62'); g.fillRect(PW*.02+H*.012,dockY+b,H*.006,H*.07); /* the outboard motor */
    g.strokeStyle=N('#c8b890'); g.lineWidth=2; g.beginPath(); g.moveTo(PW*.95,dockY+b); g.lineTo(PW*1.02,dockY-H*.2+b); g.stroke(); /* the push pole */
    const lit=waLit(P,night); waLamp(t,PW*.98,dockY-H*.02+b,lit); },
  stilts(P,t,night,dockY){ const PW=W*.2, N=c=>mix(c,'#0a1020',night*.55);
    const sw=waWood('#b8a060'), sp=waWood('#5a3a20')==='#5a3a20'?'#5a3a20':mix(sw,'#000000',.45); g.strokeStyle=N(sp); g.lineWidth=Math.max(3,W*.006); for(const px of [.06,.4,.75,.97]){ g.beginPath(); g.moveTo(PW*px,dockY); g.lineTo(PW*px+(px-.5)*6,H); g.stroke(); }
    g.fillStyle=N(sw); g.fillRect(-2,dockY-3,PW,6); g.strokeStyle=N(mix(sw,'#000000',.25)); g.lineWidth=1; for(let x=0;x<PW;x+=6){ g.beginPath(); g.moveTo(x,dockY-3); g.lineTo(x,dockY+3); g.stroke(); }
    g.fillStyle=N('#7a8a3a'); g.beginPath(); g.moveTo(-2,dockY-H*.13); g.lineTo(PW*.3,dockY-H*.17); g.lineTo(PW*.62,dockY-H*.13); g.closePath(); g.fill(); g.strokeStyle=N('#5a6a2a'); for(let i=0;i<8;i++){ g.beginPath(); g.moveTo(PW*.3,dockY-H*.17); g.lineTo(-2+i*PW*.09,dockY-H*.13); g.stroke(); }
    g.fillStyle=N(sp); g.fillRect(PW*.02,dockY-H*.13,2,H*.13); g.fillRect(PW*.58,dockY-H*.13,2,H*.13);
    const lit=waLit(P,night); waLamp(t,PW*.58,dockY-H*.1,lit); },
  haydock(P,t,night,dockY){ const PW=W*.2, N=c=>mix(c,'#0a1020',night*.55);
    { const hw=waWood('#8a6a42'); g.fillStyle=N(hw); g.fillRect(-2,dockY,PW,H*.014); g.fillStyle=N(mix(hw,'#000000',.25)); } for(const px of [.05,.5,.92]) g.fillRect(PW*px,dockY,W*.008,H-dockY);
    for(let i=0;i<2;i++){ const hx=PW*(.62+i*.18); g.fillStyle=N('#e8c860'); g.fillRect(hx,dockY-H*.035,H*.05,H*.035); g.strokeStyle=N('#b89838'); g.lineWidth=1; g.strokeRect(hx,dockY-H*.035,H*.05,H*.035); g.beginPath(); g.moveTo(hx,dockY-H*.018); g.lineTo(hx+H*.05,dockY-H*.018); g.stroke(); }
    g.fillStyle=N(waPaint('haydock')); for(let i=0;i<4;i++) g.fillRect(PW*(.02+i*.06),dockY-H*.03,2,H*.03); g.fillRect(PW*.02,dockY-H*.026,PW*.2,2);
    const lit=waLit(P,night); g.fillStyle=N('#3a3a40'); g.fillRect(PW*.56,dockY-H*.06,2,H*.06); waLamp(t,PW*.56+1,dockY-H*.062,lit); },
  platter(P,t,night,dockY){ const PW=W*.21, N=c=>mix(c,'#1a1018',night*.55);
    g.fillStyle=N('#d8d4cc'); g.beginPath(); g.ellipse(PW*.48,dockY+H*.012,PW*.56,H*.032,0,0,7); g.fill(); g.fillStyle=N('#ffffff'); g.beginPath(); g.ellipse(PW*.48,dockY+H*.004,PW*.5,H*.022,0,0,7); g.fill();
    g.strokeStyle=N(waPaint('platter')); g.lineWidth=1.5; g.beginPath(); g.ellipse(PW*.48,dockY+H*.006,PW*.53,H*.026,0,0,7); g.stroke();
    g.fillStyle=N('#e8b040'); g.beginPath(); g.moveTo(PW*.78,dockY); g.lineTo(PW*.93,dockY-H*.03); g.lineTo(PW*.98,dockY); g.closePath(); g.fill(); g.fillStyle=N('#c83a2a'); g.beginPath(); g.arc(PW*.9,dockY-H*.008,H*.004,0,7); g.fill();
    const lit=waLit(P,night); g.fillStyle=N('#c8c8d0'); g.fillRect(PW*.12,dockY-H*.05,H*.006,H*.05); waLamp(t,PW*.12+H*.003,dockY-H*.055,lit); },
  steelpier(P,t,night,dockY){ const PW=W*.2, N=c=>mix(c,'#0a1020',night*.55);
    { const st=waPaint('steelpier'); g.fillStyle=N(st); g.fillRect(-2,dockY,PW,H*.012); g.fillStyle=N(mix(st,'#101820',.45)); } for(const px of [.08,.5,.92]) g.fillRect(PW*px,dockY+H*.012,W*.006,H-dockY);
    g.strokeStyle=v3rgba(N('#c8e0f0'),.6); g.lineWidth=2; g.strokeRect(-2,dockY-H*.05,PW,H*.05); g.fillStyle=v3rgba('#c8e0f0',.12*(1-night*.6)); g.fillRect(-2,dockY-H*.05,PW,H*.05);
    const lit=waLit(P,night); g.fillStyle=N('#2a3038'); g.fillRect(PW*.9,dockY-H*.11,2.5,H*.11); waLamp(t,PW*.9+1,dockY-H*.112,lit); },
  felucca(P,t,night,dockY){ const PW=W*.2, N=c=>mix(c,'#0a1020',night*.55), b=0; /* the angler stands still on it, so it does not bob */
    g.fillStyle=N(waWood('#6a4428')); g.beginPath(); g.moveTo(-2,dockY+b); g.lineTo(PW*1.08,dockY-4+b); g.quadraticCurveTo(PW,dockY+H*.05+b,PW*.8,dockY+H*.055+b); g.lineTo(-2,dockY+H*.055+b); g.closePath(); g.fill();
    g.fillStyle=N('#d8c090'); g.fillRect(-2,dockY+H*.012+b,PW*1.02,2); g.strokeStyle=N('#4a3020'); g.lineWidth=2; g.beginPath(); g.moveTo(PW*.35,dockY+b); g.lineTo(PW*.42,dockY-H*.2+b); g.stroke();
    g.fillStyle=v3rgba(N(waPaint('felucca')),.92); g.beginPath(); g.moveTo(PW*.43,dockY-H*.21+b); g.quadraticCurveTo(PW*.75,dockY-H*.14+b,PW*.62,dockY-H*.04+b); g.lineTo(PW*.37,dockY-H*.03+b); g.closePath(); g.fill();
    const lit=waLit(P,night); waLamp(t,PW*.95,dockY-H*.02+b,lit); },
  hover(P,t,night,dockY){ const PW=W*.2, f=Math.sin(t*2)*2;
    g.fillStyle='#14102a'; g.beginPath(); g.moveTo(-2,dockY+f); g.lineTo(PW,dockY+f); g.lineTo(PW*.85,dockY+H*.025+f); g.lineTo(-2,dockY+H*.025+f); g.closePath(); g.fill();
    const ne=waPaint('hover'); g.strokeStyle=ne; g.lineWidth=2; g.beginPath(); g.moveTo(-2,dockY+f); g.lineTo(PW,dockY+f); g.stroke(); g.strokeStyle='#ff3ab8'; g.beginPath(); g.moveTo(-2,dockY+H*.025+f); g.lineTo(PW*.85,dockY+H*.025+f); g.stroke();
    for(const px of [.2,.6]) v3glow(g,PW*px,dockY+H*.04+f,H*.05,v3rgba(ne,.9),.45+.15*Math.sin(t*6+px*9)); },
  marble(P,t,night,dockY){ const PW=W*.2, N=c=>mix(c,'#0a1020',night*.45);
    for(let i=0;i<3;i++){ g.fillStyle=N(i%2?'#e8e4dc':'#f4f0e8'); g.fillRect(-2,dockY+i*H*.016,PW*(1+i*.06),H*.016); g.fillStyle=v3rgba('#c8c0b0',.5); g.fillRect(-2,dockY+i*H*.016+H*.014,PW*(1+i*.06),2); }
    g.fillStyle=N('#f4efe4'); g.fillRect(-2,dockY+H*.048,PW*1.14,H); g.fillStyle=N(waPaint('marble')); g.fillRect(PW*.88,dockY-H*.06,H*.02,H*.06); g.beginPath(); g.ellipse(PW*.88+H*.01,dockY-H*.065,H*.022,H*.01,0,0,7); g.fill();
    const lit=waLit(P,night); waLamp(t,PW*.88+H*.01,dockY-H*.075,lit); }
});
