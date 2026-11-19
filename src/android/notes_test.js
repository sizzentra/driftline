// Android test notes (preview builds only; the live game never shows them). Write what the next test build changes here
// (spoiler-free, one short line per change, curly apostrophes only). The card opens once per device whenever the text changes.
// Released notes live in notes_release.js.
const TEST_NOTES={v:'test', label:'Test build · Android', name:'Natural frame rate, Settings fix', items:[
  'Android draws a steady 60 frames a second again (also on 120 Hz screens), iPhone runs at its natural rate. No frame-rate choice in Settings.',
  'Android stays automatically full screen, like iPhone, and no longer re-asks for full screen on every tap (that caused extra frames and jumpy fps during actions).',
  'Opening and closing Settings (or any menu) no longer shows another water’s scenery for a moment.',
  'Water pictures for the Map are only made while the Map is open, so other menus stay light.',
  'Much smoother with a decorated home: decorations on the dock are no longer re-lit from scratch every frame (a moved save with many decorations made Android drop to about 25 fps).',
  'After moving your progress from another device, patch notes you already saw on this phone don’t come back.',
  'Smoother fights and storms on phones: the red danger glow on the fight ring and the rain ripples on the water are much cheaper to draw.',
  'Smoother on boats and floating docks: decorations that bob with the water are no longer re-lit every frame.',
  'Switching waters no longer leaves the game stuck at a lower sharpness: the automatic resolution comes back up once the phone keeps up again (it could not on a 60 Hz screen).',
  'Stardust is now always the best rare bait at Starfall Lake (odds ×2.5 there, was ×2): cheap minnows could beat it by day.',
  'Willow Pond is much lighter on phones: the big willow repaints far less often (its sway is unchanged), and still home decorations are drawn once instead of 15 times a second.',
  'Lighter on phones everywhere: lanterns, lamps, glows and Starfall’s star whale are drawn with ready-made soft lights (they look the same), and coloured pets no longer slow the game down.',
  'The frame counter also shows the current water sharpness (res 2x = full, lower = the game is easing off).',
  'Smoother dusk, dawn and weather changes: the scenery’s light now changes in fewer, softer steps on phones, so the game rebuilds it far less often.',
  'The top bar updates 10 times a second instead of every frame (the numbers you see are the same), a little less work every frame.',
  'In narrow windows (split-screen), the top bar shows Home again (it was hidden there) and your coins, level and water are readable instead of cut off.',
  'Tester tools (Stats), Graphics test: the angler, pets, home decorations, moving cosmetic effects and oddities now have their own buttons. If a moved save makes the game slow, turn them off one at a time and watch the frame counter.']};
addTestNotes(TEST_NOTES);
