// =====================================================================
// MOUNT OLYMPUS: THE TEMPLE (overnight, 2026-11-23; its own design, MAP_THEMES › Mount Olympus: Greek temples and statues, laurel, gold, the
// heavens). A small marble temple standing on a stepped base over the cloud-water, seen from the front: four columns (Doric, Ionic or
// Corinthian capitals, fluted), an entablature with a frieze, a pediment with a gold relief or a painted scene and gold acroteria at its
// corners, and inside the cella a statue of a god (Zeus with a thunderbolt, Athena with her owl, Poseidon with a trident); clouds drift around
// the base. Parts: column order, pediment, statue, balustrade, brazier, seat (the old floor, columns and roof ids are retired).
// =====================================================================
const TP = {
  geo(o){ const C=BH.cab(o,{h:1.2,ratio:1.4}), wh=C.wh, x0=Math.max(HF.x0(),0)+W*.008, w=Math.min(wh*1.45,o.pw*.44), x1=x0+w, et=C.wallTop; return {x0,x1,w,wh,et,ct:et+H*.022,pk:et-w*.2,mid:(x0+x1)/2}; },
  base(o,g){ const y=o.dockY; for(let k=0;k<3;k++){ HK.rect(o,g.x0-W*.012+k*W*.004,y-H*.006*(3-k),g.w+W*.024-k*W*.008,H*.006,k%2?'#d8d4e4':'#f0ecf4'); HK.rect(o,g.x0-W*.012+k*W*.004,y-H*.006*(3-k),g.w+W*.024-k*W*.008,1,v3rgba('#ffffff',.5)); } }, /* the stepped base */
  /* the cella's dark doorway with a god's statue inside, then the four columns in front */
  statue(o,g,s,c){ const y=o.dockY-H*.018, a=g.x0+g.w*.25, b=g.x1-g.w*.25, sx=g.mid, sh=(y-g.ct)*.7, sy=y-sh; HK.rect(o,a,g.ct,b-a,y-g.ct,'#3a3448'); HK.rect(o,a,g.ct,b-a,H*.006,'#2a2438');
    HK.rect(o,sx-W*.008,y-H*.012,W*.016,H*.012,'#d8d4e4'); HK.circ(o,sx,sy+sh*.12,sh*.09,c); HK.poly(o,[sx-sh*.12,sy+sh*.22,sx+sh*.12,sy+sh*.22,sx+sh*.16,y-H*.012,sx-sh*.16,y-H*.012],c); /* a robed figure on a plinth */
    if(s===0){ HK.poly(o,[sx+sh*.14,sy+sh*.1,sx+sh*.24,sy+sh*.3,sx+sh*.18,sy+sh*.32,sx+sh*.28,sy+sh*.55,sx+sh*.16,sy+sh*.34,sx+sh*.22,sy+sh*.32],'#f4d060'); } /* Zeus holding a thunderbolt */
    if(s===1){ HK.line(o,[sx-sh*.2,sy+sh*.05,sx-sh*.2,y-H*.012],'#a8743a',2); HK.ell(o,sx+sh*.2,sy+sh*.3,sh*.05,sh*.07,'#a8743a'); HK.circ(o,sx+sh*.19,sy+sh*.27,1.2,'#f4d060'); } /* Athena with a spear and her owl */
    if(s===2){ HK.line(o,[sx+sh*.2,sy-sh*.05,sx+sh*.2,y-H*.012],'#f4d060',2); for(const d of [-1,0,1]) HK.line(o,[sx+sh*.2+d*sh*.05,sy-sh*.05,sx+sh*.2+d*sh*.05,sy+sh*.05],'#f4d060',1.5); HK.line(o,[sx+sh*.15,sy+sh*.05,sx+sh*.25,sy+sh*.05],'#f4d060',1.5); } /* Poseidon with his trident */
    o.lights.push({x:sx,y:sy+sh*.4,r:.08,a:.35,small:1}); },
  columns(o,g,s,c){ const y=o.dockY-H*.018, n=4, cw=g.w*.09;
    for(let k=0;k<n;k++){ const cx=g.x0+g.w*(.08+k*.84/(n-1)); HK.rect(o,cx-cw/2,g.ct,cw,y-g.ct,c); for(let f=1;f<4;f++) HK.rect(o,cx-cw/2+cw*f/4,g.ct,1,y-g.ct,HK.dk(c,.12)); HK.rect(o,cx-cw/2,g.ct,cw*.25,y-g.ct,v3rgba('#ffffff',.25)); /* shaft with flutes */
      if(s===0) HK.rect(o,cx-cw*.7,g.ct-H*.006,cw*1.4,H*.008,c); /* Doric: a plain slab */
      if(s===1){ HK.rect(o,cx-cw*.65,g.ct-H*.004,cw*1.3,H*.006,c); HK.circ(o,cx-cw*.62,g.ct+H*.002,cw*.22,HK.dk(c,.08)); HK.circ(o,cx+cw*.62,g.ct+H*.002,cw*.22,HK.dk(c,.08)); } /* Ionic: scroll volutes */
      if(s===2){ HK.poly(o,[cx-cw*.5,g.ct+H*.012,cx-cw*.8,g.ct-H*.006,cx+cw*.8,g.ct-H*.006,cx+cw*.5,g.ct+H*.012],c); for(let l=-1;l<=1;l++) HK.ell(o,cx+l*cw*.4,g.ct+H*.004,cw*.18,H*.006,'#6a8a4a'); } /* Corinthian: acanthus leaves */
      HK.rect(o,cx-cw*.6,y-H*.004,cw*1.2,H*.004,c); } },
  /* the entablature and pediment: a frieze band, the triangle with a gold relief, a painted scene, or plain marble; gold acroteria */
  pediment(o,g,s,c){ const q=o.x, lit=HK.lit(o), L=g.x0-W*.008, R=g.x1+W*.008; HK.rect(o,L,g.et,R-L,g.ct-g.et,'#f0ecf4'); for(let X=L+W*.004;X<R;X+=W*.01) HK.rect(o,X,g.et+H*.004,W*.003,g.ct-g.et-H*.008,'#b8b4c8'); /* triglyphs */
    HK.poly(o,[L,g.et,g.mid,g.pk,R,g.et],'#f0ecf4'); HK.poly(o,[L+W*.01,g.et-H*.004,g.mid,g.pk+H*.008,R-W*.01,g.et-H*.004],s===2?'#2a4aa8':'#d8d4e4'); HK.line(o,[L-W*.004,g.et,g.mid,g.pk-H*.004,R+W*.004,g.et],'#f0ecf4',Math.max(3,H*.006)); HK.line(o,[L-W*.004,g.et-1,g.mid,g.pk-H*.005],v3rgba('#ffffff',.6*lit),1);
    if(s===0){ HK.circ(o,g.mid,g.et-(g.et-g.pk)*.4,(g.et-g.pk)*.25,c); for(let k=0;k<8;k++){ const a=k*Math.PI/4; HK.line(o,[g.mid,g.et-(g.et-g.pk)*.4,g.mid+Math.cos(a)*(g.et-g.pk)*.38,g.et-(g.et-g.pk)*.4+Math.sin(a)*(g.et-g.pk)*.32],c,1.2); } } /* a gold sun relief */
    if(s===2) for(let k=0;k<5;k++){ const fx=L+(R-L)*(.25+k*.125), fh=(g.et-g.pk)*(.55-Math.abs(k-2)*.15); HK.rect(o,fx-1,g.et-fh,2.5,fh,'#f4d060'); HK.circ(o,fx,g.et-fh,2,'#f4d060'); } /* painted figures in gold on blue */
    for(const [ax,ay] of [[L,g.et],[g.mid,g.pk],[R,g.et]]) HK.poly(o,[ax-W*.004,ay,ax,ay-H*.016,ax+W*.004,ay],'#d8a830'); /* gold acroteria */
    o.top=Math.min(o.top==null?o.dockY-H*.23:o.top,g.pk-H*.04); o.low=Math.max(o.low==null?-1e9:o.low,g.ct); },
  /* clouds drifting around the base and over the water at the posts */
  clouds(o){ const q=o.x, y=o.dockY, N=c0=>HK.n(o,c0), x0=HF.x0(); for(let i=0;i<9;i++){ const cx=x0+(o.pw-x0)*(i/8), cy=y+HK.fh()+H*.03+(i%3)*H*.012; q.fillStyle=v3rgba(N('#fbf8ff'),.85); q.beginPath(); for(let k=0;k<4;k++) q.arc(cx+(k-1.5)*W*.008,cy-(k%2)*H*.008,H*.016,0,7); q.fill(); } }
};
