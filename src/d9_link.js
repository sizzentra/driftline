
// =====================================================================
// Update 2.1: send progress to your other device with one link (or a
// QR code), and tabs that fit on one screen
// =====================================================================
const SHARE_BASE = 'https://sizzentra.github.io/driftline/';
let shareLink='', qrState='';
// links use URL-safe base64 (no escaping), which keeps them short
async function makeShareLink(){ const code=await makeCode(); const tag=code.slice(0,4), b=code.slice(4).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,''); return SHARE_BASE+'#load='+tag+b; }
function codeFromAny(v){ v=String(v||'').trim(); const i=v.indexOf('#load='); if(i<0) return v; let c=decodeURIComponent(v.slice(i+6)); const tag=c.slice(0,4); let b=c.slice(4).replace(/-/g,'+').replace(/_/g,'/'); while(b.length%4) b+='='; return tag+b; }

// ---------- device to device: a 6-digit code (works PC <-> phone in both directions) ----------
// The device WITH the progress taps Send: its progress goes into a short-lived mailbox named after a
// 6-digit code (ntfy.sh, a free public relay; files expire there after a few hours). The other device
// taps Get progress, types the code (a phone can scan the QR) and picks it up. Plain HTTPS, so it works
// on any network: no direct device-to-device connection that routers can block.
const XF_RELAY='https://ntfy.sh/', XF_PREFIX='driftline-move-';
let XF={mode:null, code:'', stat:'', ok:false, ready:false, es:null, timer:0, run:0};
function loadLib(src,test){ return new Promise((res,rej)=>{ if(test()) return res(); const s=document.createElement('script'); s.src=src; s.onload=()=>res(); s.onerror=()=>rej(); document.head.appendChild(s); }); }
const loadQRLib = () => loadLib('https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js', ()=>!!window.QRCode);
function xfStat(t,ok){ XF.stat=t; XF.ok=!!ok; const el=$('xfstat'); if(el){ el.textContent=t; el.style.color=ok?'var(--kelp)':''; } }
function xfStop(){ clearTimeout(XF.timer); try{ XF.es&&XF.es.close(); }catch(e){ oops('d9_link:es.close',e); } XF.es=null; XF.ready=false; XF.run++; }
const xfCodeFmt = c => c.slice(0,3)+' '+c.slice(3);
const xfTopic = code => XF_RELAY+XF_PREFIX+code;
// the newest progress parcel in a code's mailbox (or null)
async function xfLatest(code){ const r=await fetch(xfTopic(code)+'/json?poll=1&since=3h',{cache:'no-store'}); if(!r.ok) throw new Error('relay '+r.status);
  const lines=(await r.text()).trim().split('\n').filter(Boolean).map(l=>{ try{ return JSON.parse(l); }catch(e){ return null; } }).filter(m=>m&&m.event==='message'&&m.attachment&&m.attachment.url);
  return lines.length ? lines[lines.length-1] : null; }
async function xfSend(tries=0){ xfStop(); const run=XF.run; XF.mode='send'; XF.code=String(100000+Math.floor(Math.random()*900000)); xfStat('Getting your code ready…'); refreshXfer();
  try{
    if(tries<4 && await xfLatest(XF.code)) return xfSend(tries+1); // that code is in use right now: pick another
    const body=await makeCode();
    const r=await fetch(xfTopic(XF.code),{method:'PUT', body, headers:{'Filename':'driftline-progress.txt'}}); if(!r.ok) throw new Error('relay '+r.status);
    if(run!==XF.run) return; XF.ready=true; xfStat('Waiting for your other device… (the code works for 3 hours; if you keep playing here first, tap Send again)'); refreshXfer();
    try{ const es=new EventSource(xfTopic(XF.code+'-ok')+'/sse'); XF.es=es; es.onmessage=()=>{ if(run!==XF.run) return; xfStat('All done: your progress is on your other device now.',true); toast('Your progress arrived on your other device.'); sfx.shiny(); try{ es.close(); }catch(e){ oops('d9_link:es.close#2',e); } }; }catch(e){ oops('d9_link:EventSource',e); }
    XF.timer=setTimeout(()=>{ if(run===XF.run&&!XF.ok){ xfStop(); XF.mode=null; xfStat(''); toast('The code expired. Tap Send for a new one.'); refreshXfer(); } },3*60*60*1000);
  }catch(e){ if(run===XF.run){ xfStat('Couldn’t reach the internet just now. Check your connection and tap Send again, or use another way below.'); } } }
async function xfGet(code){ code=String(code||'').replace(/\D/g,''); if(code.length!==6){ xfStat('Type the 6-digit code from your other device.'); return; }
  xfStop(); const run=XF.run; XF.mode='get'; XF.code=code; refreshXfer(); xfStat('Looking for your progress…');
  try{ const m=await xfLatest(code); if(run!==XF.run) return;
    if(!m){ xfStat('No progress found for that code. Check the number, and make sure you tapped Send on the other device first.'); return; }
    const r=await fetch(m.attachment.url,{cache:'no-store'}); if(!r.ok) throw new Error('file '+r.status); const text=(await r.text()).trim(); if(run!==XF.run) return;
    xfStat('Got it!',true); XF.onLoaded=()=>{ fetch(xfTopic(code+'-ok'),{method:'POST', body:'done'}).catch(e=>{ oops('d9_link:transfer-ok',e); }); };
    offerCode(text,'From your other device');
  }catch(e){ if(run===XF.run) xfStat('Couldn’t reach the internet just now. Check your connection and try again, or use another way below.'); } }
function linkHTML(){ const canShare=!!navigator.share; const m=XF.mode;
  const send = m==='send' ? `<div class="xfcode" aria-label="Your code">${XF.ready?xfCodeFmt(XF.code):'··· ···'}</div>
      <div class="meta">On your other device: open Driftline, go to <b>Save</b>, tap <b>Get progress</b> and type this code.</div>
      <div class="linkwrap"><div class="qrbox sm" id="qrbox"></div><div class="meta"><b>On a phone?</b> Just point the camera at this code instead of typing.</div></div>
      <button class="btn alt sm" data-act="xfcancel">Stop sending</button>` : '';
  const get = m==='get' ? `<div class="row" style="gap:8px;flex-wrap:nowrap"><input id="xfin" inputmode="numeric" autocomplete="one-time-code" maxlength="7" placeholder="123 456" value="${XF.code?xfCodeFmt(XF.code):''}" class="xfin"><button class="btn" data-act="xfgo">Connect</button></div>
      <div class="meta">Type the code shown on your other device.</div>` : '';
  return `<div class="tile" style="margin-top:12px;border-color:#7fc8a988"><h4>📲 Move progress between phone and PC</h4>
   <div class="meta">Works both ways. ${PLAT.touch()?"Tap":"Click"} <b>Send</b> on the device that has your progress and <b>Get progress</b> on the other one.</div>
   <div class="row" style="gap:8px;margin:10px 0;flex-wrap:wrap"><button class="btn ${m==='send'?'':'alt'}" data-act="xfsend" aria-pressed="${m==='send'}">📤 Send from this device</button><button class="btn ${m==='get'?'':'alt'}" data-act="xfget" aria-pressed="${m==='get'}">📥 Get progress on this device</button></div>
   ${send}${get}<div class="meta" id="xfstat" style="min-height:1.2em;font-weight:700${XF.ok?';color:var(--kelp)':''}">${esc(XF.stat)}</div>
   <details class="xfmore"><summary>Other ways (if the code won’t connect)</summary>
     <div class="meta" style="margin:6px 0">A link that carries all your progress. Send it to yourself and open it on the other device.</div>
     <div class="row" style="gap:8px;flex-wrap:wrap">${canShare?'<button class="btn sm" data-act="sharelink">📤 Share link</button>':''}<button class="btn sm alt" data-act="copylink">🔗 Copy link</button><button class="btn sm alt" data-act="maillink">✉️ Email it to myself</button></div></details></div>`; }
function refreshXfer(){ if(S.tab!=='save') return; renderPanel(); }
async function paintLink(){ const box=$('qrbox'); if(!box||XF.mode!=="send"||!XF.ready) return;
  try{ await loadQRLib(); box.innerHTML=''; new window.QRCode(box,{text:SHARE_BASE+'#pair='+XF.code,width:300,height:300,colorDark:'#0a161d',colorLight:'#ffffff',correctLevel:window.QRCode.CorrectLevel.M}); qrState='ok'; }
  catch(e){ box.remove(); qrState='fail'; } }
actOn('xfsend redeem xfget xfgo xfcancel sharelink copylink maillink linkload linkkeep pet2 pet2off petedit', function(b){ switch(b.dataset.act){
    case 'xfsend': xfSend(); return 'skip';
    case 'redeem': { const i=$('giftin'); return redeemGift(i?i.value:''); }
    case 'xfget': xfStop(); XF.mode='get'; XF.code=''; xfStat(''); refreshXfer(); setTimeout(()=>{ const i=$('xfin'); i&&i.focus(); },50); return 'skip';
    case 'xfgo': { const i=$('xfin'); xfGet(i?i.value:''); return 'skip'; }
    case 'xfcancel': xfStop(); XF.mode=null; xfStat(''); refreshXfer(); return 'skip';
    case 'sharelink': (async()=>{ const url=await makeShareLink(); try{ await navigator.share({title:'My Driftline progress', text:'Open this on my other device to load my Driftline progress.', url}); }catch(e){ oops('d9_link:navigator.share',e); } })(); return 'skip';
    case 'copylink': (async()=>{ const url=await makeShareLink(); try{ await navigator.clipboard.writeText(url); toast('Link copied. Paste it into a message to yourself, then open it on your other device.'); }catch(e){ prompt('Copy this link:',url); } })(); return 'skip';
    case 'maillink': (async()=>{ const url=await makeShareLink(); location.href='mailto:?subject='+encodeURIComponent('My Driftline progress')+'&body='+encodeURIComponent('Open this on my other device to load my Driftline progress:\n\n'+url); })(); return 'skip';
    case 'linkload': { const o=pendingLink; if(!o) return 'skip'; S=migrate(o); pendingLink=null; S.savedAt=Date.now(); closeEvent(); offlineIncome(); fillBounties(); toast('Welcome back! Your progress is here now.'); sfx.shiny(); if(XF.onLoaded){ XF.onLoaded(); XF.onLoaded=null; } XF.mode=null; xfStat('Loaded!',true); return 'render'; }
    case 'linkkeep': pendingLink=null; closeEvent(); toast('Kept the progress on this device.'); return 'skip';
    case 'pet2': { const k=b.dataset.k; if(!S.owned.pets.includes(k)||k===S.pet) return 'skip'; S.pet2=k; PET_EDIT=null; toast(petName(k)+' is tagging along as your companion.'); return 'render'; }
    case 'pet2off': if(S.pet2){ toast(petName(S.pet2)+' heads home for a nap.'); S.pet2=null; PET_EDIT=null; } return 'render';
    case 'petedit': { const k=b.dataset.k; if(k!==S.pet&&k!==S.pet2) return 'skip'; PET_EDIT=k; PET_PV=null; return 'render'; }
  } return undefined; });
document.addEventListener('keydown',e=>{ if(e.key==='Enter'&&e.target&&e.target.id==='xfin'){ e.preventDefault(); xfGet(e.target.value); } });
// a new favourite: the old one becomes the companion if that spot is free (or if they simply swap places)
function setFav(k){ if(!PETI[k]||k===S.pet) return; const old=S.pet; if(S.pet2===k||!S.pet2) S.pet2=old; S.pet=k; if(S.pet2===S.pet) S.pet2=null; PET_EDIT=null;
  toast(petName(k)+' is your favourite now'+(S.pet2===old?', and '+petName(old)+' tags along.':'.')); }
// show a "load this progress?" prompt for a code that arrived (link, device code)
let pendingLink=null;
async function offerCode(code,title='From your other device'){
  try{ const o=await readCode(code); if(!o||!o.journal) throw 0; pendingLink=o; G.st='event';
    $('evin').innerHTML=`<div class="rar" style="color:var(--kelp)">${esc(title)}</div><h3>Load this progress?</h3>
     <div class="kv" style="text-align:left;margin:10px 0"><div><span>Level</span> ${o.lvl||1}</div><div><span>Coins</span> ${fmt(o.money||0)}</div><div><span>Species</span> ${Object.keys(o.journal||{}).length}</div><div><span>Saved</span> ${o.savedAt?new Date(o.savedAt).toLocaleString():'—'}</div></div>
     <p class="sub">This replaces the progress on this device${S.stats.caught?` (level ${S.lvl}, ${Object.keys(S.journal).length} species)`:''}.</p>
     <div class="row" style="justify-content:center;margin-top:10px"><button class="btn" data-act="linkload">Load it</button><button class="btn alt" data-act="linkkeep">Keep this device’s</button></div>`;
    $('evcard').hidden=false; }catch(e){ toast('That progress didn’t come through. Try again.'); } }
// opening a link: #load= carries the progress, #pair= opens Get progress with the code filled in (phone camera)
function checkIncomingLink(){ const h=location.hash; if(!h.startsWith('#load=')&&!h.startsWith('#pair=')) return; try{ history.replaceState(null,'',location.pathname+location.search); }catch(e){ oops('d9_link:history.replaceState',e); }
  if(h.startsWith('#load=')) return offerCode(codeFromAny(h));
  const code=h.slice(6).replace(/\D/g,''); setTab('save'); xfGet(code); }
$('evcard').addEventListener('click',e=>{ const b=e.target.closest('[data-act="linkload"],[data-act="linkkeep"]'); if(!b) return; const r=actRun(b); checkFeats(); save(); if(r!=='skip') refreshAll(); });
window.addEventListener('hashchange',checkIncomingLink);
setTimeout(checkIncomingLink,900);

// ---------- tabs: icon on top, short name under, all on one screen ----------
const tabHTML = l => { const i=l.indexOf(' '); return `<span class="ti">${l.slice(0,i)}</span><span class="tl">${l.slice(i+1)}</span>`; };
document.querySelectorAll('#tabs [data-tab]').forEach(b=>{ b.innerHTML=tabHTML(b.dataset.label); });

// ---------- phones in landscape: hide / show the menu sidebar so the water fills the screen ----------
(function(){ const b=$('sidetog'); if(!b) return; let mode='on'; try{ const v=localStorage.getItem('driftline-side-off'); mode=v==='1'?'off':'on'; }catch(e){ oops('d9_link:localStorage.getItem',e); } /* 0.3.5: a saved "wide" setting from 0.3 opens as normal */
  // 0.3.5 (director): back to two steps. Menus beside the water <-> menus hidden (the water fills the screen)
  const L={on:['›','Hide menus'],off:['‹','Show menus']};
  const apply=()=>{ document.body.classList.toggle('side-off',mode==='off'); document.body.classList.toggle('side-wide',mode==='wide'); b.textContent=L[mode][0]; b.title=L[mode][1]; b.setAttribute('aria-label',L[mode][1]); b.setAttribute('aria-expanded',String(mode!=='off')); };
  ['pointerdown','touchstart','mousedown'].forEach(ev=>b.addEventListener(ev,e=>e.stopPropagation(),{passive:true}));
  b.addEventListener('click',e=>{ e.stopPropagation(); mode=mode==='on'?'off':'on'; try{ localStorage.setItem('driftline-side-off',mode==='off'?'1':'0'); }catch(er){ oops('d9_link:localStorage.setItem',er); } apply(); setTimeout(()=>resize(),30); });
  apply(); })();
