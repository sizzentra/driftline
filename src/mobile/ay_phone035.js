// =====================================================================
// 0.3.5.2 phones held upright: one screen, no page scrolling. A compact top bar, the water, the page pills,
// and the open page scrolling inside its own area just above the section bar. The water never scrolls away.
// The game's tip line sits on the water as a small overlay instead of taking a row of its own.
// Switched on by body.phone-app, decided by the same rule the water's size uses (c_logic resize()).
// =====================================================================
/* any phone-width window that is not a short sideways screen (phone-land) is upright: split-screen and near-square windows used to fall back to an old layout (director, 2026-11-18: build around aspect ratios and safe areas, handle multi-window) */
const PHONE_APP=()=>window.innerWidth<=700 && !(window.innerWidth>window.innerHeight && window.innerHeight<=560);
(function(){ const hint=$('hint'), stage=$('stage'), wrap=document.querySelector('.wrap'); if(!hint||!stage||!wrap) return;
  const home=hint.parentElement, next=hint.nextElementSibling; let on=null;
  function apply(){ const v=PHONE_APP(); if(v===on) return; on=v; document.body.classList.toggle('phone-app',v); document.documentElement.classList.toggle('phone-app',v);
    // the tip line moves onto the water (and back when the phone is turned)
    if(v){ if(hint.parentElement!==stage) stage.appendChild(hint); } else if(hint.parentElement!==home){ next&&next.parentElement===home?home.insertBefore(hint,next):home.appendChild(hint); }
    try{ resize(); }catch(e){} }
  addEventListener('resize',apply); addEventListener('orientationchange',()=>setTimeout(apply,60)); apply(); })();

// a new page starts at its top (inside its own scroll area on phones); the same page re-drawing keeps its place
{ let lastTab=null; const _rp=renderPanel; renderPanel=function(){ const P=$('panel'), keep=P?P.scrollTop:0, same=S.tab===lastTab; const r=_rp.apply(this,arguments);
    try{ if(document.body.classList.contains('phone-app')&&P){ P.scrollTop=same?keep:0; } }catch(e){} lastTab=S.tab; return r; }; }

document.head.insertAdjacentHTML('beforeend',`<style>
body.phone-app{height:100dvh;overflow:hidden;padding-top:8px!important;padding-bottom:0!important;overscroll-behavior:none}
html.phone-app{overflow:hidden;height:100%}
body.phone-app .wrap{height:calc(100dvh - 8px - 70px - env(safe-area-inset-bottom));display:flex;flex-direction:column;gap:6px;overflow:hidden}
body.phone-app .wrap > *{flex:0 0 auto}
body.phone-app #panel{flex:1 1 auto;min-height:0;overflow-y:auto;overflow-x:hidden;overscroll-behavior:contain;-webkit-overflow-scrolling:touch;padding:2px 2px 14px;scrollbar-width:thin;contain:layout paint}
body.phone-app #tabs.secmode{padding:0!important;gap:0}
body.phone-app #tabs.secmode .subbar{padding:2px 2px 2px}
body.phone-app #tabs.secmode .subp{min-height:34px;padding:0 12px;font-size:12.5px}
/* a compact top bar: two slim rows */
body.phone-app .hud{gap:5px}
body.phone-app .hud>*{height:36px}
body.phone-app .hud .stat{padding:2px 8px}
body.phone-app .hud .stat .lbl{font-size:8.5px;letter-spacing:.06em}
body.phone-app .hud .stat b{font-size:13px}
body.phone-app .hud .ghost{font-size:12px}
/* the tip line, on the water */
body.phone-app #stage > #hint{position:absolute;left:50%;bottom:58px;transform:translateX(-50%);z-index:3;margin:0;max-width:calc(100% - 28px);min-width:110px;width:max-content;padding:4px 10px;border-radius:12px;background:#0a1220b8;border:1px solid #ffffff1a;color:#dbe7f3;font-size:11px;line-height:1.3;text-align:center;pointer-events:none;display:block}
body.phone-app #stage > #hint:empty{display:none}
body.phone-app.card-open #stage > #hint{opacity:0}
/* the water is always in view here, so the jump button is not needed */
body.phone-app #towater{display:none!important}
</style>`);

// ---------- full-screen water on phones held upright: the same toggle and saved setting as phones held sideways ----------
// One tap and the water fills the screen (menus hidden, the top bar stays); one more tap and the menus come back.
stageHOverride=function(W,H){ /* replaces the core one explicitly (a second declaration of the same name is refused by the build) */ if(!(document.body.classList.contains('phone-app')&&document.body.classList.contains('side-off'))) return 0;
  const hud=document.querySelector('.hud'), top=hud?hud.getBoundingClientRect().bottom:0; return Math.max(240,Math.round(window.innerHeight-top-14)); };
// re-measure the water whenever the toggle flips (the sideways code already does this; upright needs it too)
{ const t=$('sidetog'); if(t) t.addEventListener('click',()=>setTimeout(()=>{ try{ resize(); }catch(e){} },40)); }
document.head.insertAdjacentHTML('beforeend',`<style>
body.phone-app .sidetog{display:flex!important;position:absolute;right:10px;top:auto;bottom:10px;transform:none;width:40px;height:40px;border-radius:12px;align-items:center;justify-content:center;background:#0a1220c4;border:1px solid #ffffff2e;color:#fff;font-size:0;z-index:4;box-shadow:0 4px 12px #0008}
body.phone-app .sidetog::before{content:"";width:18px;height:18px;background:currentColor;-webkit-mask:var(--fsic) center/contain no-repeat;mask:var(--fsic) center/contain no-repeat}
body.phone-app .sidetog[aria-expanded="true"]{--fsic:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2.4' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5'/%3E%3C/svg%3E")}
body.phone-app .sidetog[aria-expanded="false"]{--fsic:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2.4' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M9 4v5H4M15 4v5h5M9 20v-5H4M15 20v-5h5'/%3E%3C/svg%3E")}
body.phone-app.card-open .sidetog{opacity:0;pointer-events:none}
/* full-screen water (upright): menus and the section bar step away, the water takes the space */
body.phone-app.side-off #panel,body.phone-app.side-off #tabs.secmode{display:none!important}
body.phone-app.side-off .wrap{height:calc(100dvh - 8px - env(safe-area-inset-bottom))}
body.phone-app.side-off #stage > #hint{bottom:62px}
</style>`);
// Rest, built into the phone controls: a proper button mirroring the full-screen one (bottom-left / bottom-right)
document.head.insertAdjacentHTML('beforeend',`<style>
body.phone-app #resttog,body.phone-land #resttog{left:10px;bottom:10px;height:40px;min-width:40px;padding:0 13px 0 11px;border-radius:12px;display:inline-flex;align-items:center;gap:6px;font:800 13px var(--display,system-ui);background:#0a1220c4;border:1px solid #ffffff2e;box-shadow:0 4px 12px #0008;z-index:4}
body.phone-app #resttog[aria-pressed="true"],body.phone-land #resttog[aria-pressed="true"]{background:linear-gradient(180deg,#3a3010e6,#241c08e6);border-color:#ffd36a;color:#ffe6a0;box-shadow:0 0 0 1px #ffd36a44,0 0 18px #ffd36a44}
</style>`);
// phones held sideways get the same controls look
(function(){ const f=()=>document.body.classList.toggle('phone-land',matchMedia('(orientation:landscape) and (max-height:560px)').matches); addEventListener('resize',f); f(); })();
// small phones: a two-line tip, an icon-only gear button, and more room for coins
document.head.insertAdjacentHTML('beforeend',`<style>
body.phone-app #stage > #hint{display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
body.phone-app #stage > #hint:empty{display:none}
@media (max-width:380px){
  body.phone-app .hud{grid-template-columns:1.25fr .9fr 1fr .8fr}
  body.phone-app .hud #settingsbtn{font-size:0;padding:0;display:flex;align-items:center;justify-content:center}
  body.phone-app .hud #settingsbtn::before{content:"⚙";font-size:19px;line-height:1}
  body.phone-app #stage > #hint{font-size:10.5px}
}
</style>`);
// event cards (patch notes, chests, choices) float over the whole phone screen too, like the catch card
document.head.insertAdjacentHTML('beforeend',`<style>
body.phone-app #evcard,body.phone-land #evcard{position:fixed;inset:0;z-index:40;padding:12px;padding-bottom:calc(12px + env(safe-area-inset-bottom))}
body.phone-app #evcard .in,body.phone-land #evcard .in{max-height:100%;overflow-y:auto;overscroll-behavior:contain;width:min(460px,100%)}
</style>`);
// hide the water controls while an event card is open, like for catches
{ const ev=$('evcard'); if(ev) new MutationObserver(()=>document.body.classList.toggle('ev-open',!ev.hidden)).observe(ev,{attributes:true,attributeFilter:['hidden']}); }
document.head.insertAdjacentHTML('beforeend',`<style>body.ev-open #resttog,body.ev-open.phone-app .sidetog{opacity:0;pointer-events:none}</style>`);
