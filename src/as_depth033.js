// =====================================================================
// 0.3.3 depth and heavy weather.
// Depth on every water: atmospheric haze where the land meets the horizon (far things recede), soft out-of-focus
// motes in the near foreground, and a gentle darkening at the bottom edge, so the scene reads in layers.
// Heavy fog swallows the distance and thins the near view; storms darken everything a step further.
// All weather parts follow WXA, so they build and fade smoothly.
// =====================================================================
const DEPTH_MOTE={ pond:'255,250,230', river:'255,250,230', coast:'255,255,255', frost:'255,255,255', reef:'255,255,240', shelf:'255,255,255', deep:'200,215,230', trench:'120,240,220', ember:'255,170,90', starfall:'210,190,255' };
/* the depth layers every older water gets, added by each water file at its place in the drawing order (src/w_<id>.js) */
function depthHazeLayer(id){
  // haze over the far land: drawn right after the cached scenery
  m33wrap(id,'live',function(P,t,hz){ const hg=g.createLinearGradient(0,hz-H*.16,0,hz+H*.02); hg.addColorStop(0,v3rgba(P.farHaze,0)); hg.addColorStop(.75,v3rgba(P.farHaze,.16)); hg.addColorStop(1,v3rgba(P.farHaze,.06)); g.fillStyle=hg; g.fillRect(0,hz-H*.16,W,H*.18);
    // the water darkens and gains contrast as it comes toward you
    const wg=g.createLinearGradient(0,hz+H*.15,0,H); wg.addColorStop(0,'rgba(0,0,0,0)'); wg.addColorStop(1,'rgba(4,8,16,.16)'); g.fillStyle=wg; g.fillRect(0,hz+H*.15,W,H-hz-H*.15); });
}
function depthMotesLayer(id){
  // near layer: out-of-focus motes drifting slowly across the bottom of the view, and a soft vignette at the edge
  m33wrap(id,'fore',function(P,t){ if(S.settings.effects){ const col=DEPTH_MOTE[id]||'255,255,255', n=gfxHigh()?6:4;
      for(let i=0;i<n;i++){ const sp=.006+(i%3)*.003, x=W*((((i*.27+t*sp)%1.3)+1.3)%1.3-.15), y=H*(.68+((i*37)%25)/100)+Math.sin(t*.4+i)*H*.02, r=H*(.025+(i%3)*.012), a=(.05+.04*Math.sin(t*.5+i*1.3))*(id==='trench'||id==='ember'?1.4:1);
        const gr=g.createRadialGradient(x,y,0,x,y,r); gr.addColorStop(0,'rgba('+col+','+a+')'); gr.addColorStop(.6,'rgba('+col+','+(a*.5)+')'); gr.addColorStop(1,'rgba('+col+',0)'); g.fillStyle=gr; g.fillRect(x-r,y-r,r*2,r*2); } }
    const vg=g.createLinearGradient(0,H*.82,0,H); vg.addColorStop(0,'rgba(0,0,0,0)'); vg.addColorStop(1,'rgba(2,4,10,.18)'); g.fillStyle=vg; g.fillRect(0,H*.82,W,H*.18); });
}
// heavy fog: a thick wall at the horizon that hides the far shore, a milky veil over the middle distance,
// and banks drifting past close by; the float stays readable but everything beyond it fades
const _drawWeatherX0_fog = drawWeatherX0;
drawWeatherX0 = function(t,wx,hz){ _drawWeatherX0_fog(t,wx,hz);
  if(wx.k==='Fog'){ const fg=g.createLinearGradient(0,0,0,H); fg.addColorStop(0,'rgba(214,220,226,.55)'); fg.addColorStop(hz/H*.85,'rgba(214,220,226,.82)'); fg.addColorStop(hz/H+.05,'rgba(214,220,226,.7)'); fg.addColorStop(Math.min(.98,hz/H+.22),'rgba(214,220,226,.26)'); fg.addColorStop(1,'rgba(214,220,226,.1)'); g.fillStyle=fg; g.fillRect(0,0,W,H);
    for(let i=0;i<4;i++){ const y=H*(.5+i*.12), x=((i*.41+t*.012*(1+i*.35))%1.8)*W-W*.4, w=W*.8; const bg=g.createRadialGradient(x+w/2,y,0,x+w/2,y,w*.5); bg.addColorStop(0,'rgba(226,230,234,.3)'); bg.addColorStop(1,'rgba(226,230,234,0)'); g.save(); g.translate(0,y); g.scale(1,.22); g.translate(0,-y); g.fillStyle=bg; g.fillRect(x,y-w*.5,w,w); g.restore(); } }
  if(wx.k==='Storm'){ g.fillStyle='rgba(8,12,20,.2)'; g.fillRect(0,0,W,H); const vg=g.createRadialGradient(W/2,H*.5,H*.3,W/2,H*.5,W*.8); vg.addColorStop(0,'rgba(0,0,0,0)'); vg.addColorStop(1,'rgba(0,0,6,.35)'); g.fillStyle=vg; g.fillRect(0,0,W,H); }
  if(wx.k==='Rain'){ g.fillStyle='rgba(30,40,54,.12)'; g.fillRect(0,0,W,H); }
};
