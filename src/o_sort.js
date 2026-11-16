
// =====================================================================
// 0.3: every shop list runs from cheap to expensive (not in the order things were added over updates).
// The free default stays first; items you can't buy (prizes, Tide Pass, feats, gifts) go to the end.
// =====================================================================
function sortByPrice(arr){ if(!Array.isArray(arr)||!arr.length) return; const first=arr[0];
  const SRCS=["start","shop","prize","pass","bw","fish","junk","gift","feat"], srcOf=x=>Array.isArray(x)?(x.slice(3).find(v=>SRCS.includes(v))||"shop"):(x.src||"shop"), price=x=>Array.isArray(x)?(+x[2]||0):(+x.price||0);
  const key=x=>(x===first||srcOf(x)==="start")?-1:(price(x)>0&&(srcOf(x)==="shop"||srcOf(x)==="bw"))?price(x):1e15; const s=arr.map((x,i)=>[x,i]).sort((a,b)=>key(a[0])-key(b[0])||a[1]-b[1]); s.forEach((p,i)=>arr[i]=p[0]); }
[DECOR,THEMES,SANDS,DOCK_DECOR,DOCK_WOODS,PETS,RODS,HATS,SHOES,NECKS,BACKS,OUTFITS,GLASSES].forEach(sortByPrice);
