
// =====================================================================
// Update 2.1: send progress to your other device with one link (or a
// QR code), and tabs that fit on one screen
// =====================================================================
const SHARE_BASE = 'https://sizzentra.github.io/driftline/';
let shareLink='', qrState='';
// links use URL-safe base64 (no escaping), which keeps them short and the QR code easy to scan
async function makeShareLink(){ const code=await makeCode(); const tag=code.slice(0,4), b=code.slice(4).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,''); return SHARE_BASE+'#load='+tag+b; }
function codeFromAny(v){ v=String(v||'').trim(); const i=v.indexOf('#load='); if(i<0) return v; let c=decodeURIComponent(v.slice(i+6)); const tag=c.slice(0,4); let b=c.slice(4).replace(/-/g,'+').replace(/_/g,'/'); while(b.length%4) b+='='; return tag+b; }
function linkHTML(){ const canShare=!!navigator.share;
  return `<div class="tile" style="margin-top:12px;border-color:#7fc8a988"><div class="row spread"><div><h4>📲 Send to my other device</h4><div class="meta">One link carries all your progress. Open it on your phone or PC and tap <b>Load</b>. That’s it.</div></div></div>
   <div class="linkwrap"><div class="qrbox" id="qrbox" aria-label="QR code with your progress"><span class="meta">Making your QR code…</span></div>
    <div style="display:flex;flex-direction:column;gap:8px;min-width:0;flex:1">
     <div class="meta"><b>On a phone?</b> Point your camera at the code, or use the buttons:</div>
     ${canShare?'<button class="btn" data-act="sharelink">📤 Share link</button>':''}
     <button class="btn ${canShare?'alt':''}" data-act="copylink">🔗 Copy link</button>
     <button class="btn alt" data-act="maillink">✉️ Email it to myself</button>
     <div class="meta">The link only works for loading progress and nothing is uploaded anywhere: your progress lives inside the link itself.</div></div></div></div>`; }
function loadQRLib(){ return new Promise((res,rej)=>{ if(window.QRCode) return res(); const s=document.createElement('script'); s.src='https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js'; s.onload=()=>res(); s.onerror=()=>rej(); document.head.appendChild(s); }); }
async function paintLink(){ const box=$('qrbox'); if(!box) return; shareLink=await makeShareLink();
  try{ await loadQRLib(); box.innerHTML=''; new window.QRCode(box,{text:shareLink,width:440,height:440,colorDark:'#0a161d',colorLight:'#ffffff',correctLevel:window.QRCode.CorrectLevel.L}); qrState='ok'; }
  catch(e){ box.innerHTML='<span class="meta">Your progress is too big for a QR code right now. Use the buttons instead, they always work.</span>'; qrState='fail'; } }
function extraAct7(b){ switch(b.dataset.act){
    case 'sharelink': (async()=>{ const url=shareLink||await makeShareLink(); try{ await navigator.share({title:'My Driftline progress', text:'Open this on my other device to load my Driftline progress.', url}); }catch(e){} })(); return 'skip';
    case 'copylink': (async()=>{ const url=shareLink||await makeShareLink(); try{ await navigator.clipboard.writeText(url); toast('Link copied. Paste it into a message to yourself, then open it on your other device.'); }catch(e){ prompt('Copy this link:',url); } })(); return 'skip';
    case 'maillink': (async()=>{ const url=shareLink||await makeShareLink(); location.href='mailto:?subject='+encodeURIComponent('My Driftline progress')+'&body='+encodeURIComponent('Open this on my other device to load my Driftline progress:\n\n'+url); })(); return 'skip';
    case 'linkload': { const o=pendingLink; if(!o) return 'skip'; S=migrate(o); pendingLink=null; S.savedAt=Date.now(); closeEvent(); offlineIncome(); fillBounties(); toast('Welcome back! Your progress is here now.'); sfx.shiny(); return 'render'; }
    case 'linkkeep': pendingLink=null; closeEvent(); toast('Kept the progress on this device.'); return 'skip';
    case 'pet2': { const k=b.dataset.k; if(!S.owned.pets.includes(k)||k===S.pet) return 'skip'; S.pet2=k; PET_EDIT=null; toast(petName(k)+' is tagging along as your companion.'); return 'render'; }
    case 'pet2off': if(S.pet2){ toast(petName(S.pet2)+' heads home for a nap.'); S.pet2=null; PET_EDIT=null; } return 'render';
    case 'petedit': { const k=b.dataset.k; if(k!==S.pet&&k!==S.pet2) return 'skip'; PET_EDIT=k; PET_PV=null; return 'render'; }
  } return undefined; }
// a new favourite: the old one becomes the companion if that spot is free (or if they simply swap places)
function setFav(k){ if(!PETI[k]||k===S.pet) return; const old=S.pet; if(S.pet2===k||!S.pet2) S.pet2=old; S.pet=k; if(S.pet2===S.pet) S.pet2=null; PET_EDIT=null;
  toast(petName(k)+' is your favourite now'+(S.pet2===old?', and '+petName(old)+' tags along.':'.')); }
// opening a link: offer to load the progress it carries
let pendingLink=null;
async function checkIncomingLink(){ if(!location.hash.startsWith('#load=')) return; const code=codeFromAny(location.hash); try{ history.replaceState(null,'',location.pathname+location.search); }catch(e){}
  try{ const o=await readCode(code); if(!o||!o.journal) throw 0; pendingLink=o; G.st='event';
    $('evin').innerHTML=`<div class="rar" style="color:var(--kelp)">From your other device</div><h3>Load this progress?</h3>
     <div class="kv" style="text-align:left;margin:10px 0"><div><span>Level</span> ${o.lvl||1}</div><div><span>Coins</span> ${fmt(o.money||0)}</div><div><span>Species</span> ${Object.keys(o.journal||{}).length}</div><div><span>Saved</span> ${o.savedAt?new Date(o.savedAt).toLocaleString():'—'}</div></div>
     <p class="sub">This replaces the progress on this device${S.stats.caught?` (level ${S.lvl}, ${Object.keys(S.journal).length} species)`:''}.</p>
     <div class="row" style="justify-content:center;margin-top:10px"><button class="btn" data-act="linkload">Load it</button><button class="btn alt" data-act="linkkeep">Keep this device’s</button></div>`;
    $('evcard').hidden=false; }catch(e){ toast('That progress link didn’t work. Try copying it again.'); } }
$('evcard').addEventListener('click',e=>{ const b=e.target.closest('[data-act="linkload"],[data-act="linkkeep"]'); if(!b) return; const r=extraAct7(b); checkFeats(); save(); if(r!=='skip') refreshAll(); });
window.addEventListener('hashchange',checkIncomingLink);
setTimeout(checkIncomingLink,900);

// ---------- tabs: icon on top, short name under, all on one screen ----------
const tabHTML = l => { const i=l.indexOf(' '); return `<span class="ti">${l.slice(0,i)}</span><span class="tl">${l.slice(i+1)}</span>`; };
document.querySelectorAll('#tabs [data-tab]').forEach(b=>{ b.innerHTML=tabHTML(b.dataset.label); });
