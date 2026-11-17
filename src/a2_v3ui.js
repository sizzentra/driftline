// 0.3 UI layer (Glow Diorama), scoped under body.v3 (always on since 0.3)
{ document.body.classList.add('v3'); document.head.insertAdjacentHTML('beforeend', `
<style>
/* =====================================================================
   0.3 UI: "Glow Diorama". One layer over the old styles, active only with body.v3.
   Night-blue glass panels lit from above, warm lantern accents, soft glows, rounder corners.
   ===================================================================== */
body.v3{
  --bg:#0a1220; --panel:#111c2e; --panel2:#17253a; --line:#26385180; --line2:#3a5878;
  --ink:#eef3f8; --muted:#97abc2; --buoy:#ff8a5c; --buoy2:#ffb36a; --kelp:#7fe3c4; --gold:#ffd36a; --danger:#ff6a7a; --shiny:#ffe9a8; --violet:#b9a2ff;
  --glass:linear-gradient(180deg,#16243a 0%,#111c2e 100%);
  --lit:inset 0 1px 0 #ffffff12, inset 0 0 0 1px #ffffff06;
  --lift:0 10px 30px #02060f99, 0 2px 6px #02060f66;
  --radius:16px;
}
body.v3, html:has(body.v3){ background:radial-gradient(1400px 700px at 50% -15%,#1b2c4a 0%,#0e1830 45%,#0a1220 75%) fixed,#0a1220 }
body.v3 ::selection{background:#ff8a5c55}
/* no blue tap flash or focus ring on the game window (phones flashed on every tap while reeling) */
html, body, .stage, .stage *, canvas{ -webkit-tap-highlight-color:transparent }
.stage:focus, .stage:focus-visible, canvas:focus{ outline:none }
.stage, canvas{ -webkit-user-select:none; user-select:none; -webkit-touch-callout:none }

/* ---- the game window ---- */
body.v3 .stage{ border-radius:20px; border:1px solid #3a587855; box-shadow:0 0 0 1px #0a1220, 0 18px 60px #02060fcc, 0 0 80px #3a6aa022 }
body.v3 #toast{ background:linear-gradient(180deg,#1a2a44f2,#111c2ef2); border:1px solid var(--line2); box-shadow:var(--lift), 0 0 24px #ffd36a22; letter-spacing:.01em }

/* ---- HUD chips ---- */
body.v3 .stat, body.v3 .ghost{ background:var(--glass); border:1px solid var(--line); border-radius:14px; box-shadow:var(--lit), 0 4px 14px #02060f55 }
body.v3 .stat .lbl{ color:#8ea6c4; letter-spacing:.1em }
body.v3 .stat b{ color:var(--ink) }
body.v3 .ghost{ transition:border-color .15s, box-shadow .15s, transform .12s }
body.v3 .ghost:hover{ border-color:#7fe3c488; box-shadow:var(--lit), 0 0 0 1px #7fe3c422, 0 0 18px #7fe3c422 }
body.v3 .brand i{ background:radial-gradient(circle at 35% 35%,#ffd6a0,#ff7a4a 60%,#c8452a); box-shadow:0 0 0 3px #ff8a5c26, 0 0 14px #ff8a5c88 }
body.v3 .xpbar{ background:#0a1220; height:6px; border-radius:4px; box-shadow:inset 0 1px 2px #000a }
body.v3 .xpbar i{ background:linear-gradient(90deg,#5ad8b0,#a8f0d8); box-shadow:0 0 8px #7fe3c499 }
body.v3 .coin::before{ background:radial-gradient(circle at 35% 30%,#fff2b8,#ffd36a 45%,#c9902a); box-shadow:0 0 6px #ffd36a77 }

/* ---- tab strip: glass pills on a soft bar ---- */
body.v3 .tabs{ background:linear-gradient(180deg,#0a1220f2 70%,#0a122000); border-bottom:0; padding:10px 2px 12px; gap:6px }
body.v3 .tabs{ grid-template-columns:repeat(auto-fill,minmax(92px,1fr)) }
body.v3 .tabs button{ border-radius:14px; border:1px solid var(--line); background:var(--glass); box-shadow:var(--lit); color:#a9bdd4; padding:7px 4px; transition:background .15s, color .15s, box-shadow .15s, border-color .15s }
@media (max-width:520px){ body.v3 .tabs{ grid-template-columns:repeat(6,minmax(0,1fr)) } body.v3 .tabs button{ padding:5px 1px; font-size:clamp(8.6px,2.5vw,10.5px); letter-spacing:-.03em } body.v3 .tabs .tl{ text-overflow:clip } }
@media (orientation:landscape) and (max-height:560px){ body.v3 .tabs{ grid-template-columns:repeat(5,minmax(0,1fr)) } body.v3 .tabs button{ padding:3px 1px; font-size:9.5px; letter-spacing:-.03em } body.v3 .tabs .tl{ text-overflow:clip } }
body.v3 .tabs button:hover{ background:#16243a; color:var(--ink) }
body.v3 .tabs button[aria-selected="true"]{ background:linear-gradient(180deg,#24395a,#18273f); border-color:#5a7ea866; color:#fff; box-shadow:var(--lit), 0 0 0 1px #ffd36a1f, 0 6px 18px #02060f88, 0 0 22px #ffd36a1a }
body.v3 .tabs button .dot{ background:linear-gradient(180deg,#ffb36a,#ff7a4a); color:#2a1206; box-shadow:0 0 10px #ff8a5c88 }

/* ---- type ---- */
body.v3 h2{ font-size:21px; letter-spacing:-.01em; color:#fff; text-shadow:0 1px 0 #0006 }
body.v3 h5{ color:#8ea6c4; letter-spacing:.12em; display:flex; align-items:center; gap:8px }
body.v3 h5::before{ content:""; width:6px; height:6px; border-radius:50%; background:var(--gold); box-shadow:0 0 8px #ffd36aaa; flex:0 0 auto }
body.v3 .sub{ color:var(--muted) }

/* ---- buttons ---- */
body.v3 .btn{ background:linear-gradient(180deg,var(--buoy2),var(--buoy) 55%,#f0683c); color:#2a1206; border-radius:12px; box-shadow:inset 0 1px 0 #ffffff55, 0 2px 0 #9a3a1a, 0 6px 16px #ff8a5c33; text-shadow:0 1px 0 #ffffff44 }
body.v3 .btn:hover:not(:disabled){ filter:brightness(1.06); box-shadow:inset 0 1px 0 #ffffff66, 0 2px 0 #9a3a1a, 0 8px 22px #ff8a5c55 }
body.v3 .btn:active:not(:disabled){ transform:translateY(1px); box-shadow:inset 0 1px 0 #ffffff33, 0 1px 0 #9a3a1a, 0 3px 10px #ff8a5c33 }
body.v3 .btn.alt{ background:var(--glass); color:var(--ink); border:1px solid var(--line2); box-shadow:var(--lit), 0 2px 0 #02060f, 0 4px 12px #02060f55; text-shadow:none }
body.v3 .btn.alt:hover:not(:disabled){ border-color:#7fe3c488; box-shadow:var(--lit), 0 2px 0 #02060f, 0 0 16px #7fe3c422 }
body.v3 .btn:disabled{ opacity:.38; filter:saturate(.4) }

/* ---- panels, tiles, rows, cards ---- */
body.v3 .tile, body.v3 .fishrow, body.v3 .spec, body.v3 .jcard, body.v3 .passcell, body.v3 .prize, body.v3 .detail, body.v3 .bank{
  background:var(--glass); border:1px solid var(--line); border-radius:var(--radius); box-shadow:var(--lit), 0 6px 18px #02060f66 }
body.v3 .tile{ position:relative; overflow:hidden }
body.v3 .tile::before{ content:""; position:absolute; left:14px; right:14px; top:0; height:1px; background:linear-gradient(90deg,transparent,#ffffff22,transparent); pointer-events:none }
body.v3 .tile:has(button:not(:disabled),[data-act],a,select,input):hover, body.v3 .jcard:hover, body.v3 .spec:hover:not(:disabled){ border-color:#5a7ea8aa; transform:translateY(-1px); box-shadow:var(--lit), 0 10px 26px #02060f88 }
body.v3 .tile.done{ border-color:#ffd36a66; box-shadow:var(--lit), 0 0 0 1px #ffd36a22, 0 6px 18px #02060f66, 0 0 26px #ffd36a14 }
body.v3 .tile h4{ color:#fff }
body.v3 .spec.on, body.v3 .jcard.sel{ border-color:var(--gold); box-shadow:var(--lit), 0 0 0 1px #ffd36a44, 0 0 24px #ffd36a22 }
body.v3 .fishrow{ border-radius:14px }
body.v3 .passcell.ready{ border-color:var(--kelp); box-shadow:var(--lit), 0 0 0 1px #7fe3c455, 0 0 22px #7fe3c433 }
body.v3 .passcell.special{ border-color:#b9a2ff88; box-shadow:var(--lit), 0 0 20px #b9a2ff22 }
body.v3 .pips i{ background:#0a1220; box-shadow:inset 0 1px 1px #000a }
body.v3 .pips i.on{ background:linear-gradient(90deg,#5ad8b0,#a8f0d8); box-shadow:0 0 6px #7fe3c477 }
body.v3 .prog{ background:#0a1220 }
body.v3 .badge{ border-radius:999px; box-shadow:0 0 10px #ff8a5c22 }
body.v3 .badge.g{ box-shadow:0 0 10px #ffd36a22 }
body.v3 .badge.k{ box-shadow:0 0 10px #7fe3c422 }

/* the catch card that pops up over the water */
body.v3 .card{ background:radial-gradient(circle at 50% 45%,#0a122066,#05080fb3) }
body.v3 .card .in{ background:linear-gradient(180deg,#1c2c48 0%,#121d31 60%,#0f1828 100%); border:1px solid #4a6a9466; border-radius:22px; box-shadow:inset 0 1px 0 #ffffff1a, 0 24px 70px #02060fdd, 0 0 50px #5a8ad022 }
body.v3 .card .in.shiny{ border-color:#ffd36aaa; box-shadow:inset 0 1px 0 #ffffff26, 0 0 0 1px #ffd36a55, 0 24px 70px #02060fdd, 0 0 70px #ffd36a44 }
body.v3 .card h3{ color:#fff; text-shadow:0 2px 0 #0008 }

/* chips, switches and toggles */
body.v3 .chipb, body.v3 .sw, body.v3 .hatb, body.v3 .toggle button, body.v3 .chests button, body.v3 .scratch button{ border-radius:12px; border:1px solid var(--line); background:var(--glass); box-shadow:var(--lit) }
body.v3 .chipb[aria-pressed="true"], body.v3 .sw[aria-pressed="true"], body.v3 .hatb[aria-pressed="true"]{ border-color:var(--gold); box-shadow:var(--lit), 0 0 0 1px #ffd36a44, 0 0 16px #ffd36a26 }
body.v3 select, body.v3 input[type=text], body.v3 input[type=number], body.v3 textarea{ background:#0d1626; border:1px solid var(--line2); border-radius:12px; color:var(--ink) }
body.v3 input[type=range]{ accent-color:var(--buoy) }
body.v3 .tank, body.v3 .preview{ border-radius:18px; border:1px solid var(--line); box-shadow:var(--lit), 0 10px 30px #02060f88 }
body.v3 .empty{ color:var(--muted) }
body.v3 .loc .sw2.v3th{ height:84px; border-radius:12px; box-shadow:inset 0 0 0 1px #ffffff14, 0 4px 14px #02060f66 }
body.v3 .loc.here{ border-color:var(--kelp); box-shadow:var(--lit), 0 0 0 1px #7fe3c444, 0 0 24px #7fe3c422 }

/* boardwalk keeps its striped awning, on the new panel */
body.v3 .bw-banner::after{ background:linear-gradient(#111c2ef2,#111c2e) }
body.v3 .bwt{ background:linear-gradient(180deg,color-mix(in srgb,var(--c,#c8553a) 16%,#111c2e),#111c2e 70px) }

/* a quiet entrance for panels */
@keyframes v3in{ from{opacity:0; transform:translateY(4px)} to{opacity:1; transform:none} }
body.v3 #panel.pin > *{ animation:v3in .22s ease-out both }
@media (prefers-reduced-motion:reduce){ body.v3 #panel > *{ animation:none } body.v3 .tile:hover, body.v3 .jcard:hover{ transform:none } }
</style>
`); }
