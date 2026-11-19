// iPhone test notes (preview builds only; the live game never shows them). One short line per change in the next test build,
// curly apostrophes only. The card opens once per device whenever the text changes. Released notes live in notes_release.js.
const TEST_NOTES={v:'test', label:'Test build · iPhone', name:'0.4.9, part 1: fixes (2)', items:[
  'Menus: the side panel always shows every section (on iPhone it could stop after Quests). Please check Trophy Room, Your home and the Aquarium.',
  'A tab’s name is no longer repeated as the heading under it (Your tank, Your boat).',
  'An empty Trophy Room fills the page with a wall of empty plaques.',
  'Aquarium coins use the short form for big amounts, so they always fit.',
  'Settings › Patch notes is a short list; tap an update to read it in the same card as when it first arrived (it used to be one long, hard-to-scroll block).',
  'While you reel in a fish, the hint and the Rest button step aside so you can see the fight (new players keep the hint for their first catches).',
  'Search sits at the top and keeps its results above the keyboard.',
  'Events, Feats, Pets and Bounties: each tab shows only its own things. Rods: the presets stay on “Your rods”.',
  'Aquarium: big Earning and Ready numbers no longer run into each other.',
  'When a bigger fish swallows your catch, the first fish stays a surprise until you land it.',
  'The top Fish Finder only names fish you have caught before.',
  'Fish shadows are one even tone; shiny fish lost the sweeping band of light.',
  'Challenges show either LIVE or a count, not both. Hints off leaves no empty box.']};
addTestNotes(TEST_NOTES);
