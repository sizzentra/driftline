// =====================================================================
// 0.3 MUSIC: a cozy theme for every water, all made live in the browser (no audio files).
// "Follow the water" picks the theme of the area you fish in; the old three styles stay as choices.
// Each theme is a voice function called once per eighth-note step by musicTick (d2_extra.js).
// =====================================================================
Object.assign(STYLES, {
  shanty:   {bpm:100, swing:.08, key:62, progs:[[[50,[0,4,7]],[55,[0,4,7]],[57,[0,4,7,10]],[50,[0,4,7]]],[[47,[0,3,7]],[55,[0,4,7]],[57,[0,4,7]],[50,[0,4,7,12]]]], mel:.42},
  musicbox: {bpm:66,  swing:0,   key:72, progs:[[[48,[0,4,7,11]],[45,[0,3,7,10]],[41,[0,4,7,11]],[43,[0,4,7,14]]],[[41,[0,4,7,9]],[43,[0,4,7]],[40,[0,3,7]],[45,[0,3,7,10]]]], mel:.0},
  island:   {bpm:94,  swing:.12, key:65, progs:[[[41,[0,4,7]],[46,[0,4,7]],[48,[0,4,7,10]],[41,[0,4,7,9]]],[[38,[0,3,7]],[46,[0,4,7]],[48,[0,4,7]],[41,[0,4,7]]]], mel:.0},
  strings:  {bpm:64,  swing:0,   key:62, progs:[[[50,[0,3,7]],[46,[0,4,7]],[41,[0,4,7]],[45,[0,4,7,10]]],[[43,[0,3,7]],[46,[0,4,7]],[45,[0,4,7]],[50,[0,3,7]]]], mel:.3},
  cello:    {bpm:52,  swing:0,   key:50, progs:[[[38,[0,3,7]],[34,[0,4,7]],[36,[0,4,7]],[33,[0,3,7]]],[[31,[0,3,7]],[34,[0,4,7]],[33,[0,3,7,10]],[38,[0,3,7]]]], mel:.34},
  abyss:    {bpm:48,  swing:0,   key:57, progs:[[[45,[0,3,7,14]],[41,[0,4,7,11]],[43,[0,4,7,14]],[40,[0,3,7,10]]]], mel:.0},
  taiko:    {bpm:86,  swing:0,   key:62, progs:[[[38,[0,3,7]],[36,[0,3,7]],[34,[0,4,7]],[36,[0,5,7]]]], mel:.3},
  celestial:{bpm:60,  swing:0,   key:69, progs:[[[45,[0,4,7,11,14]],[41,[0,4,7,11]],[43,[0,4,7,14]],[48,[0,4,7,11]]],[[38,[0,3,7,10]],[41,[0,4,7,11]],[40,[0,3,7,10]],[43,[0,4,7,14]]]], mel:.0}
});
const MUS_AREA = {pond:null, river:null, coast:'shanty', frost:'musicbox', reef:'island', shelf:'strings', deep:'cello', trench:'abyss', ember:'taiko', starfall:'celestial'};
const MUS_NAMES = [['auto','Follow the water'],['shanty','Sea shanty'],['musicbox','Music box'],['island','Island breeze'],['strings','Harbour strings'],['cello','Storm cello'],['abyss','Deep dreams'],['taiko','Hot spring drums'],['celestial','Starlight'],['lofi','Cozy lo-fi'],['acoustic','Harbour acoustic'],['night','Dreamy night']];
function curStyle3(){ const s=S.settings.style; if(s!=='auto') return STYLES[s]?s:'lofi'; const L=curLoc(), a=MUS_AREA[L.id]; if(a) return a; const t=tod(); if(L.id==='river') return t==='Night'?'night':'acoustic'; return t==='Day'?'lofi':t==='Dawn'?'acoustic':'night'; }

// ---- small instruments built from oscillators and noise ----
function i3Bell(f,t,peak,dur,outs){ mv('sine',f,t,dur,peak,.004,outs); mv('sine',f*2.76,t,dur*.45,peak*.35,.003,outs); mv('sine',f*5.4,t,dur*.2,peak*.12,.002,outs); }
function i3Pluck(f,t,peak,dur,outs,bright=2600){ const o=AC.createOscillator(), fl=AC.createBiquadFilter(), gn=AC.createGain(); o.type='triangle'; o.frequency.value=f; fl.type='lowpass'; fl.frequency.setValueAtTime(bright,t); fl.frequency.exponentialRampToValueAtTime(500,t+dur*.6);
  gn.gain.setValueAtTime(0,t); gn.gain.linearRampToValueAtTime(peak,t+.004); gn.gain.exponentialRampToValueAtTime(.0001,t+dur); o.connect(fl); fl.connect(gn); outs.forEach(x=>gn.connect(x)); o.start(t); o.stop(t+dur+.05); }
function i3Saw(f,t,dur,peak,att,cut,outs,det=8,trem=0){ const fl=AC.createBiquadFilter(); fl.type='lowpass'; fl.frequency.value=cut; const gn=AC.createGain(); gn.gain.setValueAtTime(0,t); gn.gain.linearRampToValueAtTime(peak,t+att); gn.gain.setValueAtTime(peak,t+Math.max(att,dur-.25)); gn.gain.exponentialRampToValueAtTime(.0001,t+dur);
  for(const d of [-det,det]){ const o=AC.createOscillator(); o.type='sawtooth'; o.frequency.value=f; o.detune.value=d; o.connect(fl); o.start(t); o.stop(t+dur+.05); }
  if(trem){ const l=AC.createOscillator(), lg=AC.createGain(); l.frequency.value=trem; lg.gain.value=peak*.35; l.connect(lg); lg.connect(gn.gain); l.start(t); l.stop(t+dur+.05); }
  fl.connect(gn); outs.forEach(x=>gn.connect(x)); }
function i3Drum(f0,f1,t,peak,dur,out){ const o=mv('sine',f0,t,dur,peak,.004,[out]); o.frequency.exponentialRampToValueAtTime(f1,t+dur*.5); nz(t,dur*.35,peak*.25,'lowpass',380,out); }
function i3Steel(f,t,peak,out){ const o=mv('sine',f*1.02,t,.9,peak,.003,out); o.frequency.exponentialRampToValueAtTime(f,t+.05); mv('sine',f*2,t,.5,peak*.3,.003,out); mv('sine',f*3.01,t,.25,peak*.12,.002,out); }
function i3Choir(f,t,dur,peak,outs){ const fl=AC.createBiquadFilter(); fl.type='bandpass'; fl.frequency.value=900; fl.Q.value=.8; const gn=AC.createGain(); gn.gain.setValueAtTime(0,t); gn.gain.linearRampToValueAtTime(peak,t+dur*.35); gn.gain.linearRampToValueAtTime(0,t+dur);
  for(const d of [-9,0,9]){ const o=AC.createOscillator(); o.type='sawtooth'; o.frequency.value=f; o.detune.value=d; const v=AC.createOscillator(), vg=AC.createGain(); v.frequency.value=4.6+d*.03; vg.gain.value=f*.006; v.connect(vg); vg.connect(o.frequency); o.connect(fl); o.start(t); o.stop(t+dur+.05); v.start(t); v.stop(t+dur+.05); }
  fl.connect(gn); outs.forEach(x=>gn.connect(x)); }
function i3Glide(f0,f1,f2,t,dur,peak,outs){ const o=AC.createOscillator(), gn=AC.createGain(); o.type='sine'; o.frequency.setValueAtTime(f0,t); o.frequency.exponentialRampToValueAtTime(f1,t+dur*.45); o.frequency.exponentialRampToValueAtTime(f2,t+dur);
  const v=AC.createOscillator(), vg=AC.createGain(); v.frequency.value=6; vg.gain.value=f1*.01; v.connect(vg); vg.connect(o.frequency); gn.gain.setValueAtTime(0,t); gn.gain.linearRampToValueAtTime(peak,t+dur*.25); gn.gain.linearRampToValueAtTime(0,t+dur);
  o.connect(gn); outs.forEach(x=>gn.connect(x)); o.start(t); o.stop(t+dur+.05); v.start(t); v.stop(t+dur+.05); }
const PENT_MIN=[0,3,5,7,10], YO=[0,2,5,7,9];
function m3Wander(scale,lo,hi){ MUS.idx=clamp(MUS.idx+pick([-2,-1,-1,0,1,1,2]),lo,hi); return scale[MUS.idx%scale.length]+12*Math.floor(MUS.idx/scale.length); }

// ---- the themes: (t, step 0-7, root, intervals, step length, nodes, bar index) ----
const V3MUS = {
  shanty(t,s,root,ivs,L,n,bar){ // accordion oom-pah in a rolling 6/8 lilt, a bright tin-whistle tune on top
    if(s===0||s===4) mv('sine',mtof(root-12+(s===4?7:0)),t,L*1.6,.11,.01,[n.dry]);
    if(s===2||s===6) ivs.slice(0,3).forEach(iv=>i3Saw(mtof(root+12+iv),t,L*1.4,.012,.02,1500,[n.dry,n.wet],9,6));
    if(s===0&&bar%2===0) ivs.slice(0,3).forEach(iv=>i3Saw(mtof(root+12+iv),t,L*3.6,.009,.08,1300,[n.dry,n.wet],9,5.5));
    const rest=(bar%8)>=6; if(s%2===0 && Math.random()<(rest?.15:.55)){ const m=STYLES.shanty.key+12+m3Wander(PENT,2,9); const o=mv('square',mtof(m),t,L*(Math.random()<.3?2.4:1.2),.012,.01,[n.dry,n.dls]); const v=AC.createOscillator(), vg=AC.createGain(); v.frequency.value=5.5; vg.gain.value=mtof(m)*.005; v.connect(vg); vg.connect(o.frequency); v.start(t); v.stop(t+L*2.6); }
    if(s===3||s===7) nz(t,.05,.01,'highpass',5000,n.dry); },
  musicbox(t,s,root,ivs,L,n,bar){ // a wind-up music box: bell arpeggios, a soft low pad, a tinkle of sleigh bells now and then
    if(s===0) ivs.slice(0,3).forEach(iv=>mv('triangle',mtof(root+iv),t,L*9,.012,1.2,[n.dry,n.wet]));
    const seq=[0,2,1,3,2,1,3,2]; if(Math.random()<.82){ const iv=ivs[seq[s]%ivs.length]; i3Bell(mtof(root+24+iv+(s>=4&&Math.random()<.4?12:0)),t,.03,1.8,[n.dry,n.wet,n.dls]); }
    if(s===6&&Math.random()<.25) for(let k=0;k<5;k++) nz(t+k*.03,.08,.008,'highpass',7000,n.wet); },
  island(t,s,root,ivs,L,n,bar){ // ukulele strums, a lazy bass, steel drum melody, a shaker
    if(s===0||s===3||s===4||s===6){ const dn=s!==3; ivs.slice(0,4).forEach((iv,k)=>i3Pluck(mtof(root+12+iv+(k===3?12:0)),t+(dn?k:3-k)*.016,s===0?.03:.02,.5,[n.dry,n.wet],3200)); }
    if(s===0||s===5) mv('sine',mtof(root-12+(s===5?7:0)),t,L*1.8,.1,.01,[n.dry]);
    nz(t,.035,s%2?.008:.012,'highpass',6500,n.dry);
    if(s%2===0&&Math.random()<((bar%8)>=6?.15:.5)){ const m=STYLES.island.key+12+m3Wander(PENT,2,9); i3Steel(mtof(m),t,.04,[n.dry,n.wet]); } },
  strings(t,s,root,ivs,L,n,bar){ // a warm string section swelling under a slow violin line, pizzicato basses, the hull creaks
    if(s===0) ivs.slice(0,3).forEach((iv,k)=>i3Saw(mtof(root+12+iv),t,L*8.6,.008,L*2.4,900,[n.dry,n.wet],11));
    if(s===0||s===4) i3Pluck(mtof(root-12+(s===4?7:0)),t,.07,.6,[n.dry],1200);
    if(s%4===0&&Math.random()<.6){ const m=STYLES.strings.key+12+m3Wander(PENT_MIN,3,10); i3Saw(mtof(m),t,L*(Math.random()<.5?4:2.4),.01,L*.8,1800,[n.dry,n.wet,n.dls],5); }
    if(S.settings.ambient&&s===2&&Math.random()<.08){ const o=mv('sawtooth',160,t,.6,.006,.2,[BUS.amb]); o.frequency.exponentialRampToValueAtTime(120,t+.5); } },
  cello(t,s,root,ivs,L,n,bar){ // a low cello drone and a slow, brave melody; distant thunder rolls under it
    if(s===0) i3Saw(mtof(root),t,L*8.4,.02,L*1.5,520,[n.dry,n.wet],6);
    if(s===0&&bar%2===0) ivs.slice(1,3).forEach(iv=>i3Saw(mtof(root+12+iv),t,L*16,.006,L*4,700,[n.wet],10));
    if(s%2===0&&Math.random()<.42){ const m=STYLES.cello.key+m3Wander(PENT_MIN,2,8); i3Saw(mtof(m),t,L*(Math.random()<.5?3.6:2),.016,L*.6,1100,[n.dry,n.wet],4,0); }
    if(s===0&&Math.random()<.18){ const sb=AC.createBufferSource(); sb.buffer=noiseBuf(3,true); const fl=AC.createBiquadFilter(); fl.type='lowpass'; fl.frequency.value=140; const gn=AC.createGain(); gn.gain.setValueAtTime(0,t); gn.gain.linearRampToValueAtTime(.35,t+.4); gn.gain.exponentialRampToValueAtTime(.001,t+3); sb.connect(fl); fl.connect(gn); gn.connect(BUS.amb); sb.start(t); sb.stop(t+3.1); } },
  abyss(t,s,root,ivs,L,n,bar){ // slow breathing pads, a whale singing far away, the odd sonar ping
    if(s===0&&bar%2===0) ivs.slice(0,4).forEach((iv,k)=>{ mv('sine',mtof(root+iv+(k>1?12:0)),t,L*17,.02,L*5,[n.dry,n.wet],-5); mv('sine',mtof(root+iv+(k>1?12:0)),t,L*17,.014,L*5,[n.wet],6); });
    if(s===4&&Math.random()<.16){ const f=220+Math.random()*120; i3Glide(f,f*1.9,f*.85,t,2.8+Math.random()*1.5,.05,[n.dry,n.wet,n.dls]); }
    if(s===2&&Math.random()<.1) mv('sine',1400,t,1.6,.012,.005,[n.wet,n.dls]); },
  taiko(t,s,root,ivs,L,n,bar){ // taiko drums, a breathy bamboo flute, springs bubbling
    if(s===0) i3Drum(78,44,t,.22,.7,n.dry); if(s===3) i3Drum(84,48,t,.12,.5,n.dry); if(s===4&&bar%2===1) i3Drum(70,40,t,.18,.7,n.dry); if(s===6) i3Drum(96,60,t,.08,.3,n.dry);
    if(s===2||s===7) nz(t,.04,.02,'highpass',3500,n.dry);
    if(s===0) mv('triangle',mtof(root),t,L*8,.02,1,[n.dry,n.wet]);
    if(s%2===0&&Math.random()<.32){ const m=STYLES.taiko.key+12+m3Wander(YO,2,9), d=L*(Math.random()<.5?3.6:1.8); const o=mv('sine',mtof(m),t,d,.03,.06,[n.dry,n.wet,n.dls]); nz(t,d*.6,.006,'bandpass',mtof(m)*2,n.wet); const v=AC.createOscillator(), vg=AC.createGain(); v.frequency.value=5; vg.gain.value=mtof(m)*.006; v.connect(vg); vg.connect(o.frequency); v.start(t+d*.3); v.stop(t+d); }
    if(S.settings.ambient&&Math.random()<.12){ const o=mv('sine',300+Math.random()*300,t,.06,.012,.005,[BUS.amb]); o.frequency.exponentialRampToValueAtTime(900+Math.random()*400,t+.05); } },
  celestial(t,s,root,ivs,L,n,bar){ // celesta sparkles over a soft choir
    if(s===0&&bar%2===0) ivs.slice(0,3).forEach(iv=>i3Choir(mtof(root+12+iv),t,L*16,.014,[n.dry,n.wet]));
    if(Math.random()<.55){ const iv=ivs[Math.floor(Math.random()*ivs.length)]; const f=mtof(root+24+iv+(Math.random()<.35?12:0)); mv('sine',f,t,1.4,.05,.003,[n.dry,n.wet,n.dls]); mv('sine',f*4,t,.35,.01,.002,[n.wet]); }
    if(s===0) mv('sine',mtof(root-12),t,L*8,.08,.6,[n.dry]); }
};

// settings list and the per-area pick replace the old three-way choice in the preview
if(typeof V3ON!=='undefined'&&V3ON){ /* curStyle and the settings list read these when the preview is on */ }
