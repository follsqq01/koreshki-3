'use strict';
// Give the decorative stickers their own page-level layer when moved, so no
// transformed collage or clipped section can confine them to the board.
(() => {
 const targets=[
  ...document.querySelectorAll('.board-art [data-node-id="1:169"],.board-art [data-node-id="1:191"],.board-art [data-node-id="1:207"]'),
  ...document.querySelectorAll('.notice-board .pin-face')
 ];
 targets.forEach((source,index)=>{
  const image=source.matches('img')?source:source.querySelector('img');
  source.classList.add('movable-sticker');source.tabIndex=0;
  source.setAttribute('role','button');
  source.setAttribute('aria-label','Переместить эмодзи: перетащите или используйте стрелки. Home — вернуть на доску.');
  source.querySelectorAll('img').forEach(img=>img.draggable=false);
  let floating=null,drag=null;
  function lift(){
   if(floating)return floating;
   const rect=(image||source).getBoundingClientRect();
   floating=document.createElement('button');floating.type='button';floating.className='floating-sticker';
   floating.setAttribute('aria-label',source.getAttribute('aria-label'));
   if(image){const copy=document.createElement('img');copy.src=image.src;copy.alt='';copy.draggable=false;floating.append(copy)}
   else floating.textContent=source.textContent;
   Object.assign(floating.style,{left:`${rect.left+scrollX}px`,top:`${rect.top+scrollY}px`,width:`${rect.width}px`,height:`${rect.height}px`});
   document.body.append(floating);source.style.visibility='hidden';source.tabIndex=-1;
   bind(floating);return floating;
  }
  function reset(){
   if(!floating)return;
   floating.remove();floating=null;drag=null;source.style.visibility='';source.tabIndex=0;source.focus({preventScroll:true});
  }
  function move(x,y){
   const maxX=Math.max(0,document.documentElement.clientWidth-floating.offsetWidth);
   const maxY=Math.max(0,document.documentElement.scrollHeight-floating.offsetHeight);
   floating.style.left=`${Math.max(0,Math.min(maxX,x))}px`;
   floating.style.top=`${Math.max(0,Math.min(maxY,y))}px`;
  }
  function bind(el){
   el.addEventListener('pointerdown',e=>{
    if(e.button!==0)return;e.preventDefault();
    const sticker=lift(),x=parseFloat(sticker.style.left),y=parseFloat(sticker.style.top);
    drag={id:e.pointerId,x,y,startX:e.clientX+scrollX,startY:e.clientY+scrollY};
    sticker.classList.add('is-dragging');sticker.focus({preventScroll:true});sticker.setPointerCapture(e.pointerId);
   });
   el.addEventListener('pointermove',e=>{
    if(!drag||drag.id!==e.pointerId)return;
    move(drag.x+e.clientX+scrollX-drag.startX,drag.y+e.clientY+scrollY-drag.startY);
   });
   const finish=e=>{if(!drag||drag.id!==e.pointerId)return;drag=null;floating.classList.remove('is-dragging')};
   el.addEventListener('pointerup',finish);el.addEventListener('pointercancel',finish);el.addEventListener('lostpointercapture',finish);
   el.addEventListener('keydown',e=>{
    if(e.key==='Home'){e.preventDefault();reset();return}
    if(e.key==='Escape'&&drag){e.preventDefault();move(drag.x,drag.y);drag=null;floating.classList.remove('is-dragging');return}
    const delta={ArrowLeft:[-1,0],ArrowRight:[1,0],ArrowUp:[0,-1],ArrowDown:[0,1]}[e.key];
    if(!delta)return;e.preventDefault();const sticker=lift(),step=e.shiftKey?30:10;
    move(parseFloat(sticker.style.left)+delta[0]*step,parseFloat(sticker.style.top)+delta[1]*step);sticker.focus({preventScroll:true});
   });
  }
  bind(source);
  addEventListener('resize',()=>{if(floating)move(parseFloat(floating.style.left),parseFloat(floating.style.top))});
 });
})();
