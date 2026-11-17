
// =====================================================================
// 0.3 clothing shop: a curated rotation instead of 8 random picks. Every 20 minutes: one featured
// premium piece, then a set mix (hats, shoes, back pieces, neckwear, an outfit, glasses, a pattern,
// a colour), never something you already own.
// =====================================================================
const SHOP_LEN2 = 1200;
shopOffers = function(){ const slot=Math.floor(Date.now()/1000/SHOP_LEN); let h=hashStr('shop2'+slot); const rnd2=()=>{ h=Math.imul(h^(h>>>13),1597334677)>>>0; return h/4294967296; };
  const all={ col:SHOP_COLS.map(c=>({kind:'col',id:c[0],name:c[1],price:c[2]})), pat:PATTERNS.filter(p=>p[2]).map(p=>({kind:'pat',id:p[0],name:p[1]+' fabric',price:p[2]})), hat:HATS.filter(x=>x.src==='shop').map(x=>({kind:'hat',id:x.id,name:x.name,price:x.price})),
    out:OUTFITS.filter(o=>o[3]==='shop').map(o=>({kind:'out',id:o[0],name:o[1],price:o[2]})), gls:GLASSES.filter(g2=>g2[2]).map(g2=>({kind:'gls',id:g2[0],name:g2[1],price:g2[2]})),
    shoe:SHOES.filter(x=>x[3]==='shop').map(x=>({kind:'shoe',id:x[0],name:x[1],price:x[2]})), neck:NECKS.filter(x=>x[3]==='shop').map(x=>({kind:'neck',id:x[0],name:x[1],price:x[2]})), back:BACKS.filter(x=>x[3]==='shop').map(x=>({kind:'back',id:x[0],name:x[1],price:x[2]}))};
  for(const k in all) all[k]=all[k].filter(o=>!ownedOffer(o));
  const out=[], take=(k,n)=>{ const a=all[k]; for(let i=0;i<n&&a.length;i++) out.push(a.splice(Math.floor(rnd2()*a.length),1)[0]); };
  const prem=[...all.back,...all.out,...all.hat,...all.shoe].filter(o=>o.price>=4000);
  if(prem.length){ const f=prem[Math.floor(rnd2()*prem.length)]; f.feat=true; out.push(f); const a=all[f.kind]; a.splice(a.indexOf(f),1); }
  take('hat',2); take('shoe',2); take('back',2); take('neck',1); take('out',1); take('gls',1); take('pat',1); take('col',1);
  const fill=['hat','shoe','back','neck','pat','out']; let i=0; while(out.length<12 && fill.some(k=>all[k].length)){ take(fill[i%fill.length],1); i++; }
  return [out[0]&&out[0].feat?out[0]:null, ...out.filter(o=>!o.feat).sort((a,b)=>a.price-b.price)].filter(Boolean); };
document.head.insertAdjacentHTML('beforeend',`<style>
#panel .offer canvas{border-radius:12px;background:radial-gradient(circle at 50% 60%,#24365a,#101a2c)}
#panel .grid > .offer:first-child{grid-column:1/-1;border-color:#ffd36a77;box-shadow:inset 0 1px 0 #ffffff14,0 0 26px #ffd36a1f}
#panel .grid > .offer:first-child::after{content:"Featured";position:absolute;top:10px;right:12px;font:700 10.5px system-ui;letter-spacing:.08em;text-transform:uppercase;color:#ffd36a}
</style>`);
document.head.insertAdjacentHTML('beforeend',`<style>#panel .offer canvas{width:88px;height:88px;flex:0 0 auto} #panel .grid > .offer:first-child canvas{width:132px;height:132px}</style>`);
