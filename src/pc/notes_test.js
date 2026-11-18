// PC test notes (preview builds only; the live game never shows them). Write what the next test build changes here
// (spoiler-free); it opens once in the PC test app. Released notes live in notes_release.js.
const TEST_NOTES={v:'test', label:'Test build · PC', name:'Alive and Well Dressed', items:[
  '## Fixed',
  'Send and Get progress in Settings > Save & codes work again: Send shows your 6-digit code and the QR code, and Get progress shows the box to type a code.',
  '## Smoother frames',
  'Willow Pond no longer stutters: the willow used to redraw its whole curtain every third frame; its work is now spread evenly over every frame.',
  'Storm waves on the open sea draw in a handful of shapes instead of hundreds.',
  '## Fairer streaks',
  'Reeling in early, casting by accident or missing a strike never costs you anything: your streak stays. A streak only ends when a fish you have hooked gets away (a snapped line, a fish that slips off or runs out your line).',
  'On a Roll, fully learned: a lost fish now only halves your streak instead of ending it.',
  'Steady Hands challenge: a late hook just does not count; only a hooked fish that gets away resets the count.',
  '## Your angler',
  'Shoes look like real shoes from the side: a rounded heel, a sole with a heel block, and a toe that slopes down. One foot stands a little ahead of the other.',
  'Bodies have their real depth: the hips and seat fill out under the jacket, so legs no longer look pinned under a wide body.',
  'Buttons, zips and seams sit on the front of the clothes (life jacket and spacesuit fixed).',
  '## Everything comes alive',
  'The wizard hat glows with a spiral of climbing sparkles, orbiting runes and a pulsing star at its tip.',
  'Many more items have their own effect: music notes from headphones, petals from the flower crown and kimono, mushroom spores, party confetti, top-hat magic, witch wisps, diving and fishbowl bubbles, lantern moths, angel feathers, butterfly dust, dragon embers, jetpack smoke, guitar notes, glinting medals and lenses, little hearts from heart shades, glowing glow kicks and more.',
  'The Wardrobe preview is animated now, so you see every effect live while you dress up.',
  'Smoother: shiny sparkles run at your screen’s full frame rate.',
  '## Fixes',
  'The water fits its frame exactly in smaller PC windows.']};
addTestNotes(TEST_NOTES);
