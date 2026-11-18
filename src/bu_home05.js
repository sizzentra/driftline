// =====================================================================
// Your home (director, 2026-11-18: "Instead of having Docks that aren't editable for maps that don't have a dock, make them
// have features that work for its environment... it needs to work everywhere. Consider changing it to Your home").
// Shared game data and drawing hooks (every platform): each water's home keeps, besides its decorations and wood,
//   light: the colour of that home's own light (dock lantern, pier lamp, ice-camp lantern, beach torch, boat and trawler
//          cabin lights, raft lantern, ember-ledge lantern, crystal glow)
//   hull:  the paint of the boat's and the trawler's hull
// The platform drawings read homeLight() / homeHull(), so a choice shows on the water at once. Free to choose.
// =====================================================================
const HOME_LIGHTS=[['','Natural',null],['gold','Golden','255,196,90'],['rose','Rose','255,140,175'],['mint','Sea glass','130,255,205'],['moon','Moon blue','150,195,255'],['violet','Violet','195,150,255'],['ember','Ember','255,115,60']];
const HOME_HULLS=[['','Original',null],['navy','Navy','#26456e'],['forest','Forest','#2f5e46'],['sun','Sunshine','#e8c04a'],['coral','Coral','#e07a62'],['plum','Plum','#6a3f74'],['night','Night','#24272e'],['snow','Snow','#f2f0ea']];
// what each kind of home can change (the page only offers what works where you are)
const HOME_FEATURES={dock:['wood','style','light'], pier:['wood','light'], boat:['wood','hull','light'], trawler:['hull','light'], raft:['light'], ice:['light'], sand:['light'], stone:['light'], crystal:['light']};
const HOME_NAMES={dock:'dock', pier:'pier', boat:'boat', trawler:'trawler', raft:'raft', ice:'ice camp', sand:'beach', stone:'stone ledge', crystal:'crystal shelf'};
function homeLightOk(id){ return typeof id==='string'&&HOME_LIGHTS.some(x=>x[0]===id); }
function homeHullOk(id){ return typeof id==='string'&&HOME_HULLS.some(x=>x[0]===id); }
function homeLight(def){ const k=S&&S.dock&&S.dock.light, L=k&&HOME_LIGHTS.find(x=>x[0]===k); return L&&L[2]?L[2]:def; }
function homeHull(def){ const k=S&&S.dock&&S.dock.hull, h=k&&HOME_HULLS.find(x=>x[0]===k); return h&&h[2]?h[2]:def; }
function homeHullDark(def,defDark){ const k=S&&S.dock&&S.dock.hull, h=k&&HOME_HULLS.find(x=>x[0]===k); return h&&h[2]?mix(h[2],'#000000',.22):defDark; }
