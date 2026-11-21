// =====================================================================
// 0.4.9 start-up pass: the save is read in c_logic.js before later files add their own save rules (wrappers around migrate), so those
// rules never ran on the save loaded at start-up, and the defaults from fresh() (pearlMig:1, boonMig, passMig) hid that the old save
// still needed them. Here, once every core file has loaded, the stored save is run through the full migrate chain again and the parts
// those later rules own are copied into S, before anything can be saved. Later loads (import, link, cloud, backup) already use the
// full chain.
// =====================================================================
const BOOTFIX_KEYS=['egPaid','pearls','pearlOld','pearlMig','pshop','boons','boonPts','boonMig','pathXP','specs','pass','passMig','owned','look','petTints'];
function bootFixFrom(raw){ try{ if(raw){ const o=JSON.parse(raw); if(o&&typeof o==='object'){ const m=migrate(o); for(const k of BOOTFIX_KEYS) if(m[k]!==undefined) S[k]=m[k]; try{ voyApplyCooler(); }catch(e){} return true; } } }catch(e){ try{ console.error("boot fix",e); }catch(_){} } return false; }
try{ bootFixFrom(localStorage.getItem(LS_KEY)); }catch(e){}
