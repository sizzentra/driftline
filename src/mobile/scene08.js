// =====================================================================
// Phones and tablets, round 8: mountains without stripes (director, 2026-11-18, iPhone screenshot at Willow Pond by night: "Did
// mountains lose their detail in mobile version? Right now they look bugged").
// The shared mountain painter (v3range in f_v3scene.js) shades a range as hundreds of thin side-by-side strips, one per column of
// pixels. On the iPhone the strips showed thin dark seams between them, so every mountain (and its reflection in the water) looked
// like corrugated metal. Same shapes, same light, same snow here, but each range is painted as ONE shape with a smooth light
// gradient running across it, and its snow as one shape on top: nothing can show between strips because there are no strips. It
// is also much less work for the phone (2 fills instead of about 1,000 per range).
// Android + iPhone + tablets. (PC keeps the original painter.)
// =====================================================================
{ const _vr=v3range;
  v3range=function(c,o){ if(!MOB()) return _vr.apply(this,arguments);
    const n=v3noise(o.seed), m=v3noise(o.seed+101), step=1.5/Math.min(DPR||1,2), raw=[];
    for(let X=0;X<=W+step;X+=step){ const f=X/W;
      let env=0; for(const [c0,a,w0] of o.massifs){ const d=Math.abs(f-c0)/w0; env=Math.max(env,a*Math.exp(-d*2.3)); }
      const r=.62*(1-Math.abs(2*n(f*3+1.3)-1))+.3*(1-Math.abs(2*n(f*7+5.1)-1))+.08*n(f*16+9.7);
      raw.push(o.amp*(.06+env*(.72+.28*r)+.05*r)); }
    const N=raw.length, K=Math.max(3,Math.round(6/step)), cols=raw.map((h,i)=>{ let s=0,wsum=0; for(let j=-K;j<=K;j++){ const v=raw[Math.min(N-1,Math.max(0,i+j))], w=1-Math.abs(j)/(K+1); s+=v*w; wsum+=w; } return o.base-s/wsum; });
    const sk=Math.max(4,Math.round(8/step)), sl=i=>{ const a=cols[Math.max(0,i-sk)], b=cols[Math.min(N-1,i+sk)]; return (b-a)/(2*sk*step); };
    const lit=i=>clamp(.5+sl(i)*1.9,0,1), st=Math.max(1,Math.round(2/step)); /* a colour stop every ~2 px: the light changes slowly */
    const grad=col=>{ const gr=c.createLinearGradient(0,0,W,0); for(let i=0;i<N;i+=st){ const f=i*step/W; if(f>1) break; gr.addColorStop(f,col(lit(i))); } gr.addColorStop(1,col(lit(Math.min(N-1,Math.round(W/step))))); return gr; };
    c.save();
    c.beginPath(); c.moveTo(0,o.base); for(let i=0;i<N;i++) c.lineTo(i*step,cols[i]); c.lineTo(W,o.base); c.closePath();
    c.fillStyle=grad(k=>mix(o.shadow,o.light,k)); c.fill(); c.clip();
    if(o.snow){ const snowC=mix(o.snow,'#8088bc',.4), depth=i=>{ const above=o.snowLine-cols[i]; return above*(.5+.45*m(i*step*.012))+above*.35*Math.max(0,m(i*step*.033+3)-.45); };
      c.beginPath(); let i=0, any=false;
      while(i<N){ if(cols[i]>=o.snowLine){ i++; continue; } const a=i; while(i<N&&cols[i]<o.snowLine) i++; const b=i-1; any=true;
        /* one snow patch: along the crest, then back along its lower edge; the ends meet at the snow line */
        const xa=Math.max(0,a-1)*step, xb=Math.min(N-1,b+1)*step;
        c.moveTo(xa,o.snowLine); for(let k=a;k<=b;k++) c.lineTo(k*step,cols[k]-1); c.lineTo(xb,o.snowLine);
        for(let k=b;k>=a;k--) c.lineTo(k*step,cols[k]+depth(k)); c.closePath(); }
      if(any){ c.fillStyle=grad(k=>mix(snowC,o.snow,k)); c.fill(); } }
    const hg=c.createLinearGradient(0,o.base-o.amp,0,o.base); hg.addColorStop(0,v3rgba(o.haze,0)); hg.addColorStop(.55,v3rgba(o.haze,o.hazeA*.35)); hg.addColorStop(1,v3rgba(o.haze,o.hazeA)); c.fillStyle=hg; c.fillRect(0,o.base-o.amp,W,o.amp+1);
    c.restore(); }; }
