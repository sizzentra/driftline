// iPhone: holding a finger on the water (hold to reel) brought up iOS's magnifier loupe over the game. Touches on the game's
// own drawing surfaces belong to the game: their default action is cancelled at touchstart, so iOS never starts its press-and-hold
// tools there. The game reads these surfaces through pointer events, which still arrive.
document.addEventListener('touchstart',e=>{ const t=e.target; if(t&&t.tagName==='CANVAS'&&(t.id==='cv'||t.id==='tankcv'||t.id==='homecv')&&e.cancelable) e.preventDefault(); },{passive:false});
document.head.insertAdjacentHTML('beforeend',`<style>#cv,#tankcv,#homecv{-webkit-user-select:none;user-select:none;-webkit-touch-callout:none;-webkit-tap-highlight-color:transparent}</style>`);
