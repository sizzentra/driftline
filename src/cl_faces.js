// =====================================================================
// 0.4.9 [59] Character looks (director, 2026-11-19: "We don't need the character models overly stylized ... As some people may like these
// styles, keep them available. Try to create restylized models that ... fit the world ... Expand greatly into hair choices, facial
// features and structure, nose types, eye types, mouth types"). Shared by every platform.
//  - Face style: Natural (rounder head, softer jaw, gentler shading; the default for new anglers) or Classic (the old look, kept for
//    everyone who had it).
//  - Eye shapes (5), 6 more noses, 5 more mouths, 3 more brows, 10 more hairstyles.
// =====================================================================
const FACES=[['natural','Natural'],['classic','Classic']];
const EYESHAPES=[['round','Round'],['almond','Almond'],['narrow','Narrow'],['wide','Wide'],['sleepy','Sleepy']];
var A3_EYESH={round:[1,1], almond:[1.12,.78], narrow:[1.05,.6], wide:[1.2,1.08], sleepy:[1,.7]};
NOSES.push(['soft','Soft'],['snub','Snub'],['broad','Broad'],['hooked','Hooked'],['petite','Petite'],['long','Long']);
MOUTHS.push(['neutral','Neutral'],['gentle','Gentle'],['pout','Pout'],['open','Open'],['tight','Tight']);
BROWS.push(['bushy','Bushy'],['flat','Flat'],['angled','Angled']);
HAIRSTYLES.push(['sidepart','Side part'],['bob','Bob'],['pixie','Pixie'],['wavy','Wavy'],['braid','Braid'],['topknot','Top knot'],['mullet','Mullet'],['undercut','Undercut'],['mohawk','Mohawk'],['afro','Afro']);
// noses (side view, the tip near x 7.5)
{ const _n=a3Nose; a3Nose=function(c,id,sk,skD){ const hi='rgba(255,248,236,.45)'; c.fillStyle=sk; c.strokeStyle=skD; c.lineWidth=.38;
  switch(id){
    case 'soft': c.beginPath(); c.moveTo(7,-57.2); c.quadraticCurveTo(7.9,-55.9,7.9,-55); c.quadraticCurveTo(7.6,-54.4,7,-54.6); c.closePath(); c.fill(); c.beginPath(); c.arc(7.1,-55,.55,.2,2); c.stroke(); return;
    case 'snub': c.beginPath(); c.moveTo(7,-56.6); c.quadraticCurveTo(7.5,-55.9,8.1,-55.5); c.quadraticCurveTo(8,-54.7,7.2,-54.7); c.closePath(); c.fill(); c.beginPath(); c.moveTo(7.6,-54.9); c.lineTo(7.2,-55.1); c.stroke(); return;
    case 'broad': c.beginPath(); c.ellipse(7.3,-55.2,1.5,1.2,0,0,7); c.fill(); c.beginPath(); c.arc(7.1,-55,1.05,-.1,1.9); c.stroke(); c.fillStyle=hi; c.beginPath(); c.arc(7.6,-55.8,.4,0,7); c.fill(); return;
    case 'hooked': c.beginPath(); c.moveTo(6.9,-58); c.quadraticCurveTo(8.5,-57.2,8.5,-55.3); c.quadraticCurveTo(8.2,-54.3,7.3,-54.6); c.lineTo(6.9,-54.9); c.closePath(); c.fill(); c.beginPath(); c.moveTo(8,-54.7); c.quadraticCurveTo(7.5,-54.6,7.2,-55); c.stroke(); return;
    case 'petite': c.beginPath(); c.ellipse(7.2,-55.3,.7,.65,0,0,7); c.fill(); c.beginPath(); c.arc(7.15,-55.15,.5,0,1.6); c.stroke(); return;
    case 'long': c.beginPath(); c.moveTo(6.9,-58.2); c.quadraticCurveTo(7.8,-56.6,8.2,-54.6); c.quadraticCurveTo(7.9,-54,7.2,-54.2); c.lineTo(6.9,-54.6); c.closePath(); c.fill(); c.beginPath(); c.moveTo(7.8,-54.3); c.quadraticCurveTo(7.4,-54.2,7.1,-54.6); c.stroke(); return; }
  return _n.apply(this,arguments); }; }
{ const _m=a3Mouth; a3Mouth=function(c,id,D){ c.strokeStyle=D('#7a2e24'); c.fillStyle=D('#7a2e24'); c.lineCap='round';
  switch(id){
    case 'neutral': c.lineWidth=.45; c.beginPath(); c.moveTo(4.6,-52.8); c.lineTo(6.4,-52.8); c.stroke(); return;
    case 'gentle': c.lineWidth=.45; c.beginPath(); c.moveTo(4.5,-52.9); c.quadraticCurveTo(5.5,-52.4,6.5,-52.95); c.stroke(); return;
    case 'pout': c.fillStyle=D('#b85a50'); c.beginPath(); c.ellipse(5.9,-52.8,.9,.55,0,0,7); c.fill(); c.lineWidth=.3; c.beginPath(); c.moveTo(5.1,-52.8); c.lineTo(6.6,-52.8); c.stroke(); return;
    case 'open': c.beginPath(); c.ellipse(5.6,-52.7,.95,.6,0,0,7); c.fill(); c.fillStyle='#ffffff'; c.fillRect(4.9,-53.2,1.3,.3); return;
    case 'tight': c.lineWidth=.38; c.beginPath(); c.moveTo(4.9,-52.75); c.lineTo(6.2,-52.85); c.stroke(); return; }
  return _m.apply(this,arguments); }; }
{ const _b=a3Brow; a3Brow=function(c,id,col,ex,by,mood){ if(id==='bushy'){ c.strokeStyle=col; c.lineCap='round'; c.lineWidth=1.35; c.beginPath(); c.moveTo(ex-1.6,by+.3); c.quadraticCurveTo(ex,by-.35,ex+1.6,by+.1); c.stroke(); return; }
    if(id==='flat'){ c.strokeStyle=col; c.lineCap='round'; c.lineWidth=.7; c.beginPath(); c.moveTo(ex-1.5,by+.1); c.lineTo(ex+1.6,by+.1); c.stroke(); return; }
    if(id==='angled'){ c.strokeStyle=col; c.lineCap='round'; c.lineWidth=.8; c.beginPath(); c.moveTo(ex-1.5,by+.4); c.lineTo(ex+.6,by-.5); c.lineTo(ex+1.6,by+.2); c.stroke(); return; }
    return _b.apply(this,arguments); }; }
// hairstyles (head centre 0,-56, radius 7.5, the face toward +x; front hair stays above the eyes at y -57)
const A3_NEW_HAIR=new Set(['sidepart','bob','pixie','wavy','braid','topknot','mullet','undercut','mohawk','afro']);
{ const _h=drawHair3; drawHair3=function(c,hs,hair,hairC,D,t){ if(!A3_NEW_HAIR.has(hs)) return _h.apply(this,arguments);
  const dk=D(mix(hairC,'#000000',.3)), lt=D(mix(hairC,'#ffffff',.25));
  const cap=()=>_h(c,'short',hair,hairC,D,t), buzz=a=>{ c.save(); c.globalAlpha*=a; _h(c,'buzz',hair,hairC,D,t); c.restore(); };
  const back=(y2,x2,wav)=>{ c.fillStyle=hair; c.beginPath(); c.moveTo(-2.6,-57); c.bezierCurveTo(-3.2,-53,-3,y2+3,-3.6,y2); for(let i=0;i<=6;i++){ const u=i/6; c.lineTo(-3.6-u*(x2-3.6),y2+(wav?Math.sin(u*Math.PI*3)*.8:0)+(i%2?.5:0)); } c.bezierCurveTo(-x2-.4,y2-4,-7,-53,-6.6,-56); c.closePath(); c.fill(); c.strokeStyle=lt; c.lineWidth=.35; c.beginPath(); c.moveTo(-3.6,-55); c.bezierCurveTo(-4,-52,-4,y2+2,-4.4,y2+.6); c.stroke(); };
  c.fillStyle=hair;
  switch(hs){
    case 'sidepart': cap(); c.fillStyle=hair; c.beginPath(); c.moveTo(-1.5,-63.4); c.quadraticCurveTo(4,-65,7.4,-60.6); c.quadraticCurveTo(5.6,-60.4,4,-61.2); c.quadraticCurveTo(1.6,-60.6,-.8,-61.6); c.closePath(); c.fill(); c.strokeStyle=dk; c.lineWidth=.35; c.beginPath(); c.moveTo(-1,-63.2); c.quadraticCurveTo(3,-64,6.4,-61); c.stroke(); break;
    case 'bob': cap(); back(-49.5,7.6,false); c.fillStyle=hair; c.beginPath(); c.moveTo(3,-61.6); c.quadraticCurveTo(6.6,-61.4,7.6,-59.2); c.lineTo(5.6,-59.6); c.quadraticCurveTo(4,-59.4,3,-60.4); c.closePath(); c.fill(); break;
    case 'pixie': cap(); c.fillStyle=hair; for(const [x,y] of [[4.4,-60.6],[5.6,-60.2],[6.6,-59.6]]){ c.beginPath(); c.moveTo(x-1.4,y-1.4); c.quadraticCurveTo(x+.4,y-.6,x+.6,y+.9); c.quadraticCurveTo(x-.4,y,x-1.6,y-.4); c.closePath(); c.fill(); } break;
    case 'wavy': cap(); back(-44.5,8.2,true); break;
    case 'braid': cap(); c.fillStyle=hair; for(let i=0;i<7;i++){ const y=-54.5+i*1.8, x=-6.6-i*.18+(i%2?.35:-.35); c.beginPath(); c.ellipse(x,y,1.05-i*.04,1.15,i%2?.4:-.4,0,7); c.fill(); c.strokeStyle=dk; c.lineWidth=.25; c.stroke(); } c.fillStyle=D('#c8553a'); c.beginPath(); c.arc(-7.9,-41.6,.6,0,7); c.fill(); break;
    case 'topknot': cap(); c.fillStyle=hair; c.beginPath(); c.arc(-1.4,-65.6,2.5,0,7); c.fill(); c.strokeStyle=lt; c.lineWidth=.35; c.beginPath(); c.arc(-1.4,-65.6,1.6,3.6,5.4); c.stroke(); c.fillStyle=dk; c.fillRect(-2.6,-63.6,2.4,.6); break;
    case 'mullet': cap(); c.fillStyle=hair; c.beginPath(); c.moveTo(-3,-55); c.quadraticCurveTo(-3.6,-50,-3.4,-46.4); c.lineTo(-6,-47.2); c.quadraticCurveTo(-7,-51,-6.6,-55.6); c.closePath(); c.fill(); break;
    case 'undercut': buzz(.55); c.fillStyle=hair; c.beginPath(); c.moveTo(-5.6,-61); c.quadraticCurveTo(-2,-66.4,4,-65.2); c.quadraticCurveTo(7.6,-64,7.4,-61); c.quadraticCurveTo(4,-62,-.6,-61.6); c.quadraticCurveTo(-3.6,-61.2,-5.6,-61); c.closePath(); c.fill(); c.strokeStyle=lt; c.lineWidth=.4; c.beginPath(); c.moveTo(-3,-63.4); c.quadraticCurveTo(1,-65.4,5.6,-63.6); c.stroke(); break;
    case 'mohawk': buzz(.4); c.fillStyle=hair; c.beginPath(); { const a0=Math.PI*1.28, a1=Math.PI*1.78; c.moveTo(Math.cos(a0)*7.4,-56+Math.sin(a0)*7.4); for(let i=0;i<=8;i++){ const a=a0+(a1-a0)*i/8, R=7.4+(i%2?1.2:3.4); c.lineTo(Math.cos(a)*R,-56+Math.sin(a)*R); } c.lineTo(Math.cos(a1)*7.4,-56+Math.sin(a1)*7.4); c.arc(0,-56,7.4,a1,a0,true); } c.closePath(); c.fill(); break;
    case 'afro': cap(); c.fillStyle=hair; for(let i=0;i<=11;i++){ const a=-.35-i/11*(Math.PI*1.3), bx=-1+Math.cos(a)*7.9, by=-58+Math.sin(a)*7.9; c.beginPath(); c.arc(bx,by,3.3,0,7); c.fill(); }
      c.strokeStyle=lt; c.lineWidth=.35; for(let i=1;i<11;i+=2){ const a=-.35-i/11*(Math.PI*1.3); c.beginPath(); c.arc(-1+Math.cos(a)*8.4,-58+Math.sin(a)*8.4,1.2,a-1,a+.4); c.stroke(); } break;
  } }; }
// the Wardrobe: face style and eye shape rows next to the other face options
{ const _rs=renderStyle; renderStyle=function(P){ const r=_rs.apply(this,arguments); try{ const pn=P||$('panel'), h=[...pn.querySelectorAll('h5')].find(x=>/^Nose$/.test(x.textContent.trim())); const lk=S.look;
    const chips=(k,L,cur)=>`<div class="chips">${L.map(([v,n])=>`<button class="chipb" data-act="look" data-k="${k}" data-v="${v}" aria-pressed="${cur===v}">${n}</button>`).join('')}</div>`;
    const html=`<h5>Face style</h5>${chips('face',FACES,lk.face||'classic')}<h5>Eye shape</h5>${chips('eyeShape',EYESHAPES,lk.eyeShape||'round')}`;
    if(h&&!pn.querySelector('[data-k="face"]')) h.insertAdjacentHTML('beforebegin',html); }catch(e){} return r; }; }
// saves: unknown values fall back; an angler made before 0.4.9 keeps the Classic face
{ const _m=migrate; migrate=function(o){ const raw=isObj(o)&&isObj(o.look)?o.look:null; const m=_m(o); try{ if(raw&&raw.face===undefined) m.look.face='classic';
    if(!FACES.some(x=>x[0]===m.look.face)) m.look.face='natural'; if(!A3_EYESH[m.look.eyeShape]) m.look.eyeShape='round'; }catch(e){} return m; }; }
