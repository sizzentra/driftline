/* Do the two ceilings hold? Line tension may not pass 60% and fish temper 70% (BONUS_CAP). Gives the player a huge boost of each,
   then every relic and every Boon at its top, and reads bonus(). Puts everything back. Changes nothing. */
const out={save:SAVE_NAME, build:window.DL_VERSION||'', caps:BONUS_CAP, rows:[]}, keep={buffs:S.buffs, relics:S.relics, boons:JSON.stringify(S.boons||null)};
try{ for(const k of Object.keys(BONUS_CAP)){
    S.buffs=keep.buffs.concat([{k,v:5,until:Date.now()+9e6,src:'t'}]); const plain=bonus(k);
    S.relics=Object.keys(RELIC_BONUS).concat(S.relics||[]); const withRelics=bonus(k);
    out.rows.push({stat:k, cap:BONUS_CAP[k], withHugeBoost:+plain.toFixed(3), plusEveryRelic:+withRelics.toFixed(3), steps:stepsOf('bonus').length, afterEachStep:stepsOf('bonus').map((_,i)=>+bonus(k,i+1).toFixed(3))});
    S.buffs=keep.buffs; S.relics=keep.relics; }
} finally { S.buffs=keep.buffs; S.relics=keep.relics; }
return JSON.stringify(out);
