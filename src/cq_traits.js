// =====================================================================
// More body variety in the newer waters. The water costumes that used to sit on these fish (Farm ears and horns, Buffet toppings,
// Corporate ties, Nile headdresses, Circuit lines, Olympus laurels, and the odd fox ear or maple leaf elsewhere) were removed on
// 2026-11-22 (director: "I don't like the idea of adding the custom map apparel to the fish. This is bad design"): every fish is drawn
// as just the fish; its family, pattern and colors make it what it is.
// =====================================================================
// more body variety in the new waters: a fish that would get the plain default body gets a plan, tail and fin of its own (from its id)
{ const NEWW=new Set(WATERS_NEW.map(w=>w.id)), EGP=['fusi','deep','long','disc','grouper','tuna','mahi','ball','box','koi','goldfish','sculpin','mola','hatchet','tadpole','bill','carp','guppy'],
    NP=['fusi','deep','long','disc','grouper','tuna','koi','carp','sculpin','blenny','guppy','bill'], TAILS=['fork','round','lunate','fan','fork'], DORS=['round','long','sail','spiny','trail','trigger','round'];
  for(const sp of SP){ if(!NEWW.has(sp.loc)||sp.shape!=='f') continue; const d=fishDesign(sp); if(d.plan!=='fusi'||d.fam) continue; /* real fish keep their own body */ let h=0; for(let i=0;i<sp.id.length;i++) h=(h*33+sp.id.charCodeAt(i))>>>0;
    const L2=sp.eg?EGP:NP; d.plan=L2[h%L2.length]; d.tail=TAILS[(h>>>4)%TAILS.length]; d.dorsal=DORS[(h>>>8)%DORS.length]; if(d.plan==='mola'||d.plan==='ball'||d.plan==='box') d.h=Math.max(d.h,.5); } }
