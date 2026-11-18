// =====================================================================
// Test notes (shared helper). Each platform's own notes file (src/pc, src/android, src/ios) calls addTestNotes(...) with
// its text. In a preview build the notes go on top of the patch notes list and open once per device and notes text; the
// live game ignores them. They carry no version number (the director picks it at release).
// =====================================================================
function addTestNotes(n){ try{ if(!window.DL_PREVIEW||!n||!Array.isArray(n.items)) return; PATCHES.unshift(n);
    const id='dl-test-notes:'+(window.DL_BUILD||'')+':'+n.name+':'+n.items.length; let seen=''; try{ seen=localStorage.getItem('dl-test-notes')||''; }catch(e){}
    if(seen===id) return; let tries=0;
    const go=()=>{ if(G.st!=='idle'||(typeof MENU_OPEN!=='undefined'&&MENU_OPEN)){ if(++tries<20) setTimeout(go,1500); return; }
      try{ localStorage.setItem('dl-test-notes',id); }catch(e){} try{ showPatchNotes(n); }catch(e){} };
    setTimeout(go,3500); }catch(e){} }
