// Phones (round 7f, performance): the fishing scene's canvas is opaque. The scene always paints every pixel (sky to water), so the
// phone no longer has to blend the whole canvas with the page behind it on every frame (one full-screen layer less for the GPU).
// It must run before the game first asks the canvas for its 2D context, so it is placed in c_logic.js with an //@layer line.
try{ const c0=document.getElementById('cv'); if(c0) c0.getContext('2d',{alpha:false}); }catch(e){}
