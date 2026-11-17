// =====================================================================
// 0.3 CONTROLS: new ways to fish, all optional and all on top of the classic one-button controls.
//  - Tap to aim (setting): tap the spot on the water you want; a little scatter keeps it honest.
//  - Crank to reel: draw circles on the water (finger or mouse) or roll the mouse wheel while a fish is on.
//  - Gamepad: A / Cross does everything Space does; the right trigger reels with pressure (a light pull reels gently).
//  - Vibration (phones): a buzz on a bite, a tick when the line is about to snap, a little pattern on a catch.
// =====================================================================
const CTRL={ crankA:null, crankCx:0, crankCy:0, padDown:false, padPrev:false, padIdx:-1 };
function vib(p){ try{ if(S.settings.vibrate!==false && navigator.vibrate && matchMedia('(pointer:coarse)').matches) navigator.vibrate(p); }catch(e){} }

// tap to aim: returns true when it handled the press
function aimCast(e){ if(!V3ON || S.settings.castMode!=='aim' || G.st!=='idle' || !e || e.clientX==null) return false;
  const r=cv.getBoundingClientRect(), x=(e.clientX-r.left)*(W/r.width), y=(e.clientY-r.top)*(H/r.height); if(y<HZ()) return false;
  startCharge(); if(G.st!=='charging') return true;
  let p=clamp((x-W*.27)/(W*.66),0,.96); p=clamp(p+(Math.random()*2-1)*.045,0,.965); G.power=p; release(); return true; }

// crank: angle swept around the point where the press started; one full turn is about half a second of reeling
function crankMove(e){ if(G.st!=='reeling' || CTRL.crankA==null) return; const dx=e.clientX-CTRL.crankCx, dy=e.clientY-CTRL.crankCy; if(dx*dx+dy*dy<14*14) return;
  const a=Math.atan2(dy,dx); let d=a-CTRL.crankA; if(d>Math.PI) d-=Math.PI*2; if(d<-Math.PI) d+=Math.PI*2; CTRL.crankA=a;
  const k=Math.abs(d); if(k>1.2) return; G.crank=Math.min(.3,(G.crank||0)+k/(Math.PI*2)*.5); }
stage.addEventListener('pointerdown',e=>{ if(G.st==='reeling'){ CTRL.crankCx=e.clientX; CTRL.crankCy=e.clientY; CTRL.crankA=null; CTRL.start=true; } });
stage.addEventListener('pointermove',e=>{ if(G.st!=='reeling'||!(e.buttons&1)&&e.pointerType==='mouse'&&!CTRL.start) return;
  if(CTRL.crankA==null){ const dx=e.clientX-CTRL.crankCx, dy=e.clientY-CTRL.crankCy; if(dx*dx+dy*dy>=14*14){ CTRL.crankA=Math.atan2(dy,dx); } return; } crankMove(e); /* 0.3.4: moving while holding never stops the reel; a held press always reels */ });
stage.addEventListener('pointerup',()=>{ CTRL.crankA=null; CTRL.start=false; });
stage.addEventListener('wheel',e=>{ const now=performance.now(); if(G.st!=='reeling'){ /* keep wheel reeling from scrolling the page as the fight ends (catch or escape) */ if(now-(stage._reelT||-1e9)<1600||G.st==='landing'){ e.preventDefault(); stage._reelT=now; } return; } stage._reelT=now; e.preventDefault(); G.crank=Math.min(.3,(G.crank||0)+Math.min(1,Math.abs(e.deltaY)/100)*.09); },{passive:false});

// gamepad: polled only while a pad is connected
window.addEventListener('gamepadconnected',e=>{ CTRL.padIdx=e.gamepad.index; toast('Controller connected: A to cast and reel, right trigger to reel gently.'); });
window.addEventListener('gamepaddisconnected',()=>{ CTRL.padIdx=-1; G.padReel=0; });
function padPoll(){ if(CTRL.padIdx<0||!navigator.getGamepads) return; const p=navigator.getGamepads()[CTRL.padIdx]; if(!p) return;
  const a=!!(p.buttons[0]&&p.buttons[0].pressed); if(a&&!CTRL.padPrev){ startAudio(); down(null); } if(!a&&CTRL.padPrev) up(); CTRL.padPrev=a;
  const rt=p.buttons[7]?p.buttons[7].value:0; G.padReel=rt>.08?rt:0; }

// the reel uses all of these: hold, crank credit, or trigger pressure (called from fight)
function reelInput(dt){ if(G.hold) return 1; if(G.padReel>0) return G.padReel; if(G.crank>0){ const k=Math.min(1,G.crank/dt); G.crank=Math.max(0,G.crank-dt); return k; } return 0; }
