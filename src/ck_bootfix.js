// =====================================================================
// 0.4.9 start-up pass: the save is first read in c_logic.js, before the later files' lists exist, so only the core checks of migrate()
// can run there (its coreOnly read), and the defaults from fresh() (pearlMig:1, boonMig, passMig) hid that an old save still needed the
// later steps. Here, once every core file has loaded, the stored save goes through the whole of migrate() and the parts those later
// steps own are copied into S, before anything can be saved. Later loads (import, link, cloud, backup) always run the whole function.
// A save field that a later step of migrate() sets belongs in BOOTFIX_KEYS, unless its owner file also sets it on S when it loads.
// =====================================================================
const BOOTFIX_KEYS=['egPaid','pearls','pearlV','pearlOld','pearlMig','pshop','boons','boonPts','boonMig','pathXP','specs','pass','passMig','owned','look','petTints'];
function bootFixFrom(raw){ try{ if(raw){ const o=JSON.parse(raw); if(o&&typeof o==='object'){ const m=migrate(o); for(const k of BOOTFIX_KEYS) if(m[k]!==undefined) S[k]=m[k]; try{ voyApplyCooler(); }catch(e){ oops('ck_bootfix:voyApplyCooler',e); } return true; } } }catch(e){ try{ console.error("boot fix",e); }catch(_){ oops('ck_bootfix:console.error',_); } } return false; }
try{ bootFixFrom(localStorage.getItem(LS_KEY)); }catch(e){ oops('ck_bootfix:bootFixFrom',e); }
