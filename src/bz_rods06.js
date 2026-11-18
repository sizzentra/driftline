// =====================================================================
// Rod presets, "Your rods" (director, 2026-11-18: "you can have 3 presets here to choose from of rods from your Rod Rack that
// maintain their attachments. Attachments can be equipped to more than one Rod Preset at a time"). Shared data and rules:
//  S.rodPresets = 3 slots, each {rod, att:[...]} or null; S.rodPreset = the one in use (-1 = none).
//  Using a preset equips its rod with its attachments. While a preset is in use, changing the rod or its attachments
//  updates that preset, so it always keeps what you set. Attachments are a collection you own once, so the same attachment
//  can sit on several presets.
// Each platform shows the presets with rodPresetsHTML() in its own layout.
// =====================================================================
function rpClean(st){ const src=Array.isArray(st.rodPresets)?st.rodPresets:[];
  const out=[0,1,2].map(i=>{ const p=src[i]; if(!p||typeof p!=='object'||!ROD_I[p.rod]) return null; const n=ROD_I[p.rod].slots; return {rod:p.rod, att:(Array.isArray(p.att)?p.att:[]).map(x=>typeof x==='string'&&ATT_I[x]?x:'').slice(0,n)}; });
  st.rodPresets=out; st.rodPreset=(Number.isInteger(st.rodPreset)&&st.rodPreset>=0&&st.rodPreset<3&&out[st.rodPreset])?st.rodPreset:-1; return st; }
function rpInit(){ rpClean(S); if(!S.rodPresets.some(Boolean)&&S.rods&&ROD_I[S.rods.eq]){ S.rodPresets[0]={rod:S.rods.eq, att:(S.rods.att[S.rods.eq]||[]).slice(0,rod().slots)}; S.rodPreset=0; } }
rpInit();
{ const _mig=migrate; migrate=function(o){ const m=_mig(o); try{ rpClean(m); }catch(e){ m.rodPresets=[null,null,null]; m.rodPreset=-1; } return m; }; }
// keep the preset in use matching what you hold
function rpSync(){ try{ const i=S.rodPreset; if(i<0||!S.rodPresets[i]||!S.rods.owned.includes(S.rods.eq)) return; S.rodPresets[i]={rod:S.rods.eq, att:(S.rods.att[S.rods.eq]||[]).slice(0,rod().slots)}; }catch(e){} }
function rpUse(i){ const p=S.rodPresets[i]; if(!p||!S.rods.owned.includes(p.rod)) return false; S.rods.eq=p.rod; S.rods.att[p.rod]=p.att.filter(a=>!a||S.atts[a]).slice(0,ROD_I[p.rod].slots); S.rodPreset=i; save(); return true; }
function rpSave(i){ if(!S.rods.owned.includes(S.rods.eq)) return false; S.rodPresets[i]={rod:S.rods.eq, att:(S.rods.att[S.rods.eq]||[]).slice(0,rod().slots)}; S.rodPreset=i; save(); return true; }
function rpClear(i){ S.rodPresets[i]=null; if(S.rodPreset===i) S.rodPreset=-1; save(); }
{ const _sv=save; save=function(){ rpSync(); return _sv.apply(this,arguments); }; }
{ const _rp=renderPanel; renderPanel=function(){ if(S.tab==='rods') rpSync(); return _rp.apply(this,arguments); }; }
function rodPresetsHTML(){ return `<div class="rp-box"><div class="rp-head"><b>Your rods</b><span>Three presets: a rod and its attachments. The one in use updates as you change it.</span></div><div class="rp-list">${[0,1,2].map(i=>{ const p=S.rodPresets[i], on=S.rodPreset===i, R=p&&ROD_I[p.rod];
    if(!R) return `<div class="rp-card empty"><span class="rp-n">Preset ${i+1}</span><em>Empty</em><button type="button" class="btn alt sm" data-rp="save:${i}">Save the rod in your hands here</button></div>`;
    const atts=p.att.filter(a=>a&&ATT_I[a]).map(a=>`<span class="rp-att">${esc(ATT_I[a].name)}</span>`).join('')||'<span class="rp-att none">No attachments</span>';
    return `<div class="rp-card${on?' on':''}"><span class="rp-n">Preset ${i+1}${on?' · in use':''}</span><b>${esc(R.name)}</b><span class="rp-lv">Level ${(S.rods.lvl&&S.rods.lvl[p.rod])||0} / 10 · ${R.slots} slot${R.slots>1?'s':''}</span><div class="rp-atts">${atts}</div><div class="rp-acts">${on?'<span class="badge g">In use</span>':`<button type="button" class="btn sm" data-rp="use:${i}">Use</button>`}<button type="button" class="btn alt sm" data-rp="save:${i}">${on?'Saved':'Replace with current'}</button><button type="button" class="btn alt sm" data-rp="clear:${i}">Clear</button></div></div>`; }).join('')}</div></div>`; }
document.addEventListener('click',e=>{ const b=e.target.closest&&e.target.closest('[data-rp]'); if(!b) return; e.stopPropagation(); const [a,n]=b.dataset.rp.split(':'), i=+n; if(!(i>=0&&i<3)) return;
  if(a==='use'){ if(rpUse(i)){ toast('Rod preset '+(i+1)+': '+rod().name+'.'); } } else if(a==='save'){ if(S.rodPreset===i) return; rpSave(i); toast('Saved to preset '+(i+1)+'.'); } else if(a==='clear'){ rpClear(i); }
  try{ sfx.coin(); }catch(er){} renderPanel(); },true);
document.head.insertAdjacentHTML('beforeend',`<style>
.rp-box{display:flex;flex-direction:column;gap:8px;margin:0 0 12px}
.rp-head{display:flex;flex-direction:column;gap:2px} .rp-head b{font:800 15px var(--display,system-ui);color:#fff} .rp-head span{font-size:12px;color:#9fb2c8}
.rp-list{display:grid;gap:8px}
.rp-card{display:flex;flex-direction:column;gap:4px;padding:10px 12px;border-radius:12px;background:#0a1424;border:1px solid #ffffff18}
.rp-card.on{border-color:#7fe3c4;box-shadow:0 0 0 1px #7fe3c4 inset}
.rp-card.empty{border-style:dashed;align-items:flex-start}
.rp-n{font:800 11px var(--display,system-ui);letter-spacing:.07em;text-transform:uppercase;color:#8fa6bf} .rp-card.on .rp-n{color:#7fe3c4}
.rp-card b{font:800 15px var(--display,system-ui);color:#fff} .rp-lv{font-size:12px;color:#9fb2c8} .rp-card em{font-style:normal;color:#7f93a8;font-size:13px}
.rp-atts{display:flex;flex-wrap:wrap;gap:4px} .rp-att{padding:2px 8px;border-radius:999px;background:#ffffff10;font-size:11.5px;color:#dbe6f2} .rp-att.none{color:#7f93a8}
.rp-acts{display:flex;flex-wrap:wrap;gap:6px;margin-top:4px;align-items:center}
</style>`);
