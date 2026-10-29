'use strict';
// Move the existing controls, rather than duplicating forms or answer state.
(() => {
 const mobile=matchMedia('(max-width: 900px)');
 const node=id=>document.querySelector(`[data-node-id="1:${id}"]`);
 const layouts=[
  {screen:'rating',items:[['.exercise-progress','progress'],[()=>node(320),'intro'],[()=>node(370),'header'],['.candidate-details','details'],[()=>node(328),'ratings'],['.art-decisions','decisions']]},
  {screen:'reveal',items:[['.exercise-progress','progress'],[()=>node(429),'header'],[()=>node(395),'fact-title'],['#candidate-fact','fact'],['#previous-rating','previous'],[()=>node(407),'question'],[()=>node(408),'answers'],['.candidate-details','details']]},
  {screen:'summary',items:[['.summary-copy','summary'],['.summary-actions','actions']]}
 ];
 const moved=[];
 layouts.forEach(({screen,items})=>{
  const section=document.querySelector(`#${screen}-screen`);
  const layout=document.createElement('div');layout.className='mobile-exercise-layout';section.append(layout);
  items.forEach(([selector,name])=>{
   const element=typeof selector==='function'?selector():section.querySelector(selector);
   const marker=document.createComment('responsive position');element.before(marker);
   const slot=document.createElement('div');slot.className=`mobile-slot mobile-${name}`;layout.append(slot);
   moved.push({element,marker,slot});
  });
 });
 function update(){
  moved.forEach(({element,marker,slot})=>{
   if(mobile.matches)slot.append(element);
   else marker.after(element);
  });
  sizeArt();
 }
 mobile.addEventListener('change',update);update();
})();
