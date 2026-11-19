// Android test notes (preview builds only; the live game never shows them). Write what the next test build changes here
// (spoiler-free, one short line per change, curly apostrophes only). The card opens once per device whenever the text changes.
// Released notes live in notes_release.js.
const TEST_NOTES={v:'test', label:'Test build · Android', name:'60 fps and full screen', items:[
  'Every phone is locked at 60 frames a second, iPhone and Android alike. The frame-rate choice is gone from Settings.',
  'Android is always full screen, like iPhone: no Settings option. The installed app opens without the bars, and a tap brings full screen back if they appear.',
  'Android test app: remove it from the home screen and add it again once, so Android opens it full screen at launch.',
  'The angler is drawn less often on phones (it was the most expensive part of each frame).',
  'The frame counter (Settings, Display) shows the frames actually drawn, your screen’s rate and the slowest gap.',
  'Tester tools (Stats): a Graphics test turns parts of the water off one at a time, so you can see which part slows your phone.',
  'Tester tools: Unlock everything adds Wisdom Pearls; new buttons for levels, Fish Log, feats, cooler and an 8-hour skip.',
  'Side-panel counts never cover a button’s name, even at 99+.',
  'Notices like “Travelled to …” sit below the weather and streak tags.',
  'Opening a menu over an info card closes the card first, so Travel here always works.',
  'The update message only appears for real updates.',
  'Patch notes: 0.4.8.6.2 Fixes lists everything above for players (Settings, Patch notes).']};
addTestNotes(TEST_NOTES);
