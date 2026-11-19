// iPhone test notes (preview builds only; the live game never shows them). Write what the next test build changes here
// (spoiler-free, one short line per change, curly apostrophes only). The card opens once per device whenever the text changes.
// Released notes live in notes_release.js.
const TEST_NOTES={v:'test', label:'Test build · iPhone', name:'Natural frame rate, Settings fix', items:[
  'Android draws a steady 60 frames a second again (also on 120 Hz screens), iPhone runs at its natural rate. No frame-rate choice in Settings.',
  'Android stays automatically full screen, like iPhone, and no longer re-asks for full screen on every tap (that caused extra frames and jumpy fps during actions).',
  'Opening and closing Settings (or any menu) no longer shows another water’s scenery for a moment.',
  'Water pictures for the Map are only made while the Map is open, so other menus stay light.',
  'Much smoother with a decorated home: decorations on the dock are no longer re-lit from scratch every frame (a moved save with many decorations made Android drop to about 25 fps).',
  'After moving your progress from another device, patch notes you already saw on this phone don’t come back.',
  'Smoother fights and storms on phones: the red danger glow on the fight ring and the rain ripples on the water are much cheaper to draw.',
  'Smoother on boats and floating docks: decorations that bob with the water are no longer re-lit every frame.',
  'Smoother dusk, dawn and weather changes: the scenery’s light now changes in fewer, softer steps on phones, so the game rebuilds it far less often.',
  'Tester tools (Stats), Graphics test: the angler, pets, home decorations, moving cosmetic effects and oddities now have their own buttons. If a moved save makes the game slow, turn them off one at a time and watch the frame counter.']};
addTestNotes(TEST_NOTES);
