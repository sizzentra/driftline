// =====================================================================
// WILLOW POND, PAINTED (director, 2026-11-24): ChatGPT's painting from the director's mock-up, plugged into the painted-waters engine
// (w_paint.js). Its distinct choices (docs/MAP_STANDARD.md › distinctness board): a lowland storybook pond, a duck-egg-blue boathouse seen from
// its long side with a front cross gable and a rowboat in its slip, the great weeping willow on the far right bank, open summer sky, reeds and
// cattails in the corners, an early-summer-morning mist; no moment. Numbers are in the atlas's own pixels (1768 x 889 per layer).
// =====================================================================
pwMake('pond',{ art:PW_POND_ART, IW:1768, IH:889, CB:460,
  WL:440 /* the far shoreline */, W0:380 /* the stored lake starts here (its top repeated up under the shore) */, WT:470 /* water effects start below the willow's roots */,
  band:[60,25] /* where each column's waterline is looked for */, reflH:320, reflect:false /* director, 2026-11-24: water quality over reflections here; the sun and moon still make their path */, waves:true, mist:true, rain:false /* the shared weather layer draws the rain */,
  clouds:[[932,8,172,36],[1108,24,108,24],[468,40,608,136],[1300,108,144,32],[0,112,548,128],[932,136,564,188],[352,200,548,132],[876,208,128,32],[76,276,96,28],[208,284,140,24],[0,292,308,84],[1328,300,432,92],[780,316,380,72],[156,344,380,68],[684,348,116,24],[1148,372,140,24],[456,380,212,52],[1012,380,216,40],[692,384,224,52],[1296,388,120,20]],
  cloudMaxY:270 /* clouds stay above the hilltops */, cloudHide:930 /* and fade out before the willow (picture x where it starts) */,
  sway:[[930,0,838,470,1.6,0] /* the willow, its fronds most, its roots not at all */,[0,700,120,189,2,1.3] /* the reeds bottom left */,[1390,670,378,219,2.2,2.6] /* the cattails bottom right */],
  life:(P,t,M)=>pwFireflies(P,t,M,gfxHigh()?44:28) /* director: more fireflies at night */ });
/* the boathouse and its chair, in their stored pictures' pixels (house 1100 x 600, chair 223 x 300): the deck surface, the posts' waterline,
   where the angler stands (in front of the door) and sits (on the open deck), the lantern, the window centres, the posts; 1 angler height =
   144.8 stored pixels (the door is 1.18 angler heights) */
pwHomeMake('pond',{ house:PW_POND_HOUSE, glow:PW_POND_GLOW, chair:PW_POND_CHAIR,
  deck:428, post:598, stand:627, sit:917, reflTop:140, reflect:false, lanterns:[[731,284,22]], windows:[[340,295],[642,133]], posts:[91,135,568,792,1053], postW:40,
  k:.462, chairK:.0968, chairSit:96, chairFoot:300, seatUnits:17 });
