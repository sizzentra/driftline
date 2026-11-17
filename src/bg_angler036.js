// =====================================================================
// 0.3.6 a real cap: a six-panel crown with seams and a button, a sweatband edge, and a curved brim that grows out of
// the front of the crown (it used to be a flat slab floating in front of the face), with its own underside shadow.
// Same space as every hat: the crown sits on y=0, the face looks to +x.
// =====================================================================
const _drawHat_036=drawHat;
drawHat=function(c,id,col,t=0){ if(id!=='cap'||(typeof HAT_TRIM_OFF!=='undefined'&&HAT_TRIM_OFF)) return _drawHat_036(c,id,col,t);
  const dk=mix(col,'#000000',.32), lt=mix(col,'#ffffff',.22), dd=mix(col,'#000000',.5);
  c.save(); c.lineCap='round'; c.lineJoin='round';
  // crown: a soft dome a little taller at the front, with a rounded back
  const crown=()=>{ c.beginPath(); c.moveTo(-8.2,-.6); c.bezierCurveTo(-8.6,-6.4,-4.8,-10.2,.4,-10.1); c.bezierCurveTo(5.4,-10,8.4,-6.6,8.4,-1.8); c.lineTo(8.2,-.4); c.quadraticCurveTo(0,.6,-8.2,-.6); c.closePath(); };
  const cg=c.createLinearGradient(-8,-10,6,0); cg.addColorStop(0,dk); cg.addColorStop(.45,col); cg.addColorStop(1,lt); c.fillStyle=cg; crown(); c.fill();
  c.save(); crown(); c.clip();
  // panel seams and stitching
  c.strokeStyle=v3rgba(dd,.5); c.lineWidth=.32; c.beginPath(); c.moveTo(.6,-10); c.quadraticCurveTo(3.2,-5,3.4,.2); c.moveTo(.4,-10); c.quadraticCurveTo(-3.6,-5.4,-4.6,0); c.stroke();
  c.strokeStyle=v3rgba(lt,.45); c.lineWidth=.2; c.setLineDash([.5,.45]); c.beginPath(); c.moveTo(1.1,-9.6); c.quadraticCurveTo(3.8,-5,4,0); c.stroke(); c.setLineDash([]);
  // a front panel highlight and a darker back
  c.fillStyle='rgba(255,250,240,.14)'; c.beginPath(); c.ellipse(4.6,-6.4,3.2,2.2,-.5,0,7); c.fill();
  c.fillStyle='rgba(10,6,16,.18)'; c.beginPath(); c.ellipse(-7,-3,3.4,6,0,0,7); c.fill();
  // sweatband edge
  c.fillStyle=dk; c.beginPath(); c.moveTo(-8.6,-1.2); c.quadraticCurveTo(0,-.2,8.6,-1.4); c.lineTo(8.6,1); c.lineTo(-8.6,1); c.closePath(); c.fill();
  c.restore();
  // button on top
  c.fillStyle=dk; c.beginPath(); c.ellipse(.4,-10.1,1.2,.65,0,0,7); c.fill(); c.fillStyle=v3rgba(lt,.6); c.beginPath(); c.ellipse(.2,-10.35,.6,.25,0,0,7); c.fill();
  // brim: grows out of the front of the crown, curves down at the tip; top lit, underside dark, thin edge
  c.fillStyle=dd; c.beginPath(); c.moveTo(6.4,-1.4); c.quadraticCurveTo(11,-2.2,14.2,-.2); c.quadraticCurveTo(14.6,.5,13.8,.8); c.quadraticCurveTo(10.4,.2,6.6,.6); c.closePath(); c.fill();
  const bg=c.createLinearGradient(6,-2.6,14,0); bg.addColorStop(0,mix(col,'#000000',.12)); bg.addColorStop(1,lt); c.fillStyle=bg;
  c.beginPath(); c.moveTo(6.2,-2.2); c.quadraticCurveTo(10.8,-3.3,14.2,-.6); c.quadraticCurveTo(14.4,-.1,13.9,.1); c.quadraticCurveTo(10.6,-1.2,6.4,-.7); c.closePath(); c.fill();
  c.strokeStyle=v3rgba(lt,.5); c.lineWidth=.22; c.beginPath(); c.moveTo(7,-2.25); c.quadraticCurveTo(10.8,-3.1,13.8,-.75); c.stroke();
  c.restore(); };
