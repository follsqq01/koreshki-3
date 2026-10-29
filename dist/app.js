'use strict';
const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
const reducedMotion=matchMedia('(prefers-reduced-motion: reduce)');
// Keyboard focus and a tap reveal the same information as a mouse hover.
$$('.cv').forEach(card=>{
 card.addEventListener('click',()=>card.classList.toggle('is-revealed'));
 card.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();card.classList.toggle('is-revealed')}});
});
// Count only once, when the figures actually enter the viewport.
const counts=$$('[data-count]');
function countUp(el){const end=Number(el.dataset.count);if(reducedMotion.matches){el.innerHTML=`${end}<span>%</span>`;return}let start;function frame(now){if(start===undefined)start=now;const progress=Math.min((now-start)/1500,1),ease=1-Math.pow(1-progress,3);el.innerHTML=`${Math.round(end*ease)}<span>%</span>`;if(progress<1)requestAnimationFrame(frame)}requestAnimationFrame(frame)}
if('IntersectionObserver' in window){const countObserver=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){countUp(e.target);countObserver.unobserve(e.target)}}),{threshold:.55});counts.forEach(e=>countObserver.observe(e));const highlightObserver=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('is-visible');highlightObserver.unobserve(e.target)}}),{threshold:1});$$('.highlight').forEach(e=>highlightObserver.observe(e))}else{$$('.highlight').forEach(e=>e.classList.add('is-visible'))}
// Local notes: no account and no server submission.
$$('.write-note textarea').forEach(field=>{
 const key='koreshki:'+field.id.replace('-mobile',''),status=$('.save-status',field.parentElement);let timer;
 try{const saved=localStorage.getItem(key);if(saved!==null){field.value=saved;status.textContent='Сохранено в этом браузере'}}catch{status.textContent='Заметка останется до закрытия страницы'}
 field.addEventListener('input',()=>{$$('.write-note textarea').filter(other=>other!==field&&other.id.replace('-mobile','')===field.id.replace('-mobile','')).forEach(other=>{other.value=field.value;other.parentElement.classList.toggle('has-text',Boolean(field.value))});status.textContent='Сохраняем…';clearTimeout(timer);timer=setTimeout(()=>{try{localStorage.setItem(key,field.value);status.textContent='Сохранено в этом браузере'}catch{status.textContent='Не удалось сохранить. Скопируйте заметку перед закрытием.'}},250)});
});
// The exercise lives at test.html and never changes the main page's layout.
const exercise=$('.test-folder');
if(exercise){
 const ratings={overall:0,skills:0,impression:0},names={overall:'Общая оценка',skills:'Навыки кандидата',impression:'Первое впечатление'};
 $$('.ratings').forEach(group=>{const key=group.dataset.rating;group.setAttribute('role','radiogroup');group.setAttribute('aria-label',names[key]);for(let value=1;value<=5;value++){const b=document.createElement('button');b.type='button';b.setAttribute('role','radio');b.setAttribute('aria-label',`${value} из 5`);b.setAttribute('aria-checked','false');b.tabIndex=value===1?0:-1;b.textContent=value;b.addEventListener('click',()=>select(key,value));b.addEventListener('keydown',e=>{let v=value;if(e.key==='ArrowRight'||e.key==='ArrowDown')v=value%5+1;else if(e.key==='ArrowLeft'||e.key==='ArrowUp')v=(value+3)%5+1;else if(e.key==='Home')v=1;else if(e.key==='End')v=5;else return;e.preventDefault();select(key,v);$$('button',group)[v-1].focus()});group.append(b)}});
 function select(key,value){ratings[key]=value;renderRatings();$('#test-hint').textContent=Object.values(ratings).every(Boolean)?'Оценки сохранены. Какое решение вы примете?':'Оцените кандидата по трём критериям, затем примите решение.'}
 function renderRatings(){ $$('.ratings').forEach(g=>$$('button',g).forEach((b,i)=>{const value=ratings[g.dataset.rating];b.classList.toggle('selected',i<value);b.setAttribute('aria-checked',String(i+1===value));b.tabIndex=(value?i+1===value:i===0)?0:-1})) }
 $$('[data-decision]').forEach(b=>b.addEventListener('click',()=>{const missing=Object.keys(ratings).find(key=>!ratings[key]);if(missing){$('#test-hint').textContent='Сначала выберите оценку в каждой из трёх строк.';$(`.ratings[data-rating="${missing}"] button`).focus();return}$('#before-reveal').hidden=true;$('#after-reveal').hidden=false;$('#candidate-photo').hidden=false;$('.anonymous').hidden=true;$('#candidate-age').hidden=false;$('#test-progress').textContent='02 / 02 — теперь вы знаете возраст';$('#previous-rating').textContent=`Ваша общая оценка: ${ratings.overall} из 5. Навыки: ${ratings.skills} из 5. Первое впечатление: ${ratings.impression} из 5. Вы решили ${b.dataset.decision==='yes'?'пригласить кандидата на собеседование':'отказать'}.`;$('.resume-head').scrollIntoView({behavior:reducedMotion.matches?'instant':'smooth',block:'center'});$('.reveal-note').setAttribute('tabindex','-1');$('.reveal-note').focus({preventScroll:true})}));
 $$('[data-answer]').forEach(b=>b.addEventListener('click',()=>{const result=$('#test-result'),changed=b.dataset.answer==='yes';result.hidden=false;$('h3',result).textContent=changed?'Что изменилось, кроме цифры?':'Навыки остались навыками.';$('p',result).textContent=changed?'Возраст повлиял на первое впечатление. Вернитесь к аргументам: знания и опыт кандидата остались прежними. Этот эксперимент — повод заметить свои привычные реакции, а не оценка ваших убеждений.':'Вы сохранили своё мнение после раскрытия возраста. Одинаковые критерии и внимание к реальным навыкам помогают принимать обоснованные решения.';$('#test-progress').textContent='Готово — спасибо за участие';result.focus();result.scrollIntoView({behavior:reducedMotion.matches?'instant':'smooth',block:'center'})}));
 $('#restart').addEventListener('click',()=>{Object.keys(ratings).forEach(k=>ratings[k]=0);renderRatings();$('#before-reveal').hidden=false;$('#after-reveal').hidden=true;$('#test-result').hidden=true;$('#candidate-photo').hidden=true;$('.anonymous').hidden=false;$('#candidate-age').hidden=true;$('#test-progress').textContent='01 / 02 — первое впечатление';$('#test-hint').textContent='Оцените кандидата по трём критериям, затем примите решение.';$('.test-heading').scrollIntoView({behavior:reducedMotion.matches?'instant':'smooth'});$('.ratings button').focus({preventScroll:true})});
}

// Smooth single-open FAQ accordion, including an animated close.
const faqItems=$$('.faq details');
function animateFaq(details,open){
 const summary=$('summary',details),answer=$('.faq-answer',details),start=details.getBoundingClientRect().height;
 details._faqAnimation?.cancel();details._faqAnswerAnimation?.cancel();
 if(open)details.open=true;
 if(reducedMotion.matches){details.open=open;details.dataset.faqState=open?'open':'closed';return Promise.resolve()}
 const end=open?summary.offsetHeight+answer.offsetHeight:summary.offsetHeight;
 details.dataset.faqState=open?'opening':'closing';details.classList.add('faq-animating');details.style.height=`${start}px`;details.style.overflow='hidden';
 const animation=details.animate({height:[`${start}px`,`${end}px`]},{duration:open?520:420,easing:'cubic-bezier(.22,.8,.25,1)'});details._faqAnimation=animation;
 details._faqAnswerAnimation=answer.animate(open?{opacity:[0,1],transform:['translateY(-8px)','translateY(0)']}:{opacity:[1,0],transform:['translateY(0)','translateY(-6px)']},{duration:open?360:240,delay:open?90:0,easing:'ease-out',fill:'both'});
 return new Promise(resolve=>{animation.onfinish=()=>{if(details._faqAnimation!==animation){resolve();return}details.open=open;details.dataset.faqState=open?'open':'closed';details.classList.remove('faq-animating');details.style.height='';details.style.overflow='';details._faqAnimation=null;details._faqAnswerAnimation?.cancel();details._faqAnswerAnimation=null;resolve()}});
}
let faqBusy=false;
faqItems.forEach(details=>{
 details.dataset.faqState=details.open?'open':'closed';
 $('summary',details).addEventListener('click',async event=>{event.preventDefault();if(faqBusy)return;faqBusy=true;const open=!details.open;if(open){const current=faqItems.find(item=>item!==details&&item.open);if(current)await animateFaq(current,false)}await animateFaq(details,open);faqBusy=false});
});

// Scale each original collage uniformly, using width only (never scroll position).
const artSections=$$('.art-section');
function sizeArt(){document.documentElement.style.setProperty('--page-scale',innerWidth/1512);artSections.forEach(section=>{const scale=section.clientWidth/1512;section.style.setProperty('--art-scale',scale);section.style.setProperty('--art-height',section.dataset.artHeight);section.style.height=(Number(section.dataset.artHeight)*scale)+'px'});$$('.story').forEach(card=>card.style.setProperty('--paper-scale',card.clientWidth/800.211))}
sizeArt();let artWidth=innerWidth;addEventListener('resize',()=>{if(innerWidth!==artWidth){artWidth=innerWidth;sizeArt()}});
$$('.cv-art').forEach(card=>{card.addEventListener('click',()=>card.classList.toggle('is-revealed'));card.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();card.classList.toggle('is-revealed')}})});
$$('.write-note textarea').forEach(field=>{const update=()=>field.parentElement.classList.toggle('has-text',Boolean(field.value));update();field.addEventListener('input',update)});
$$('.more').forEach(link=>link.href='#about-mobile');

const storySection=document.querySelector('.stories-section');
if(storySection){
 const rail=storySection.querySelector('.stories-track');
 const desktopStories=matchMedia('(min-width:901px)');let distance=0,queued=false;
 function measureStories(){
  if(!desktopStories.matches){storySection.style.removeProperty('--story-distance');rail.style.removeProperty('--story-x');return}
  distance=Math.max(0,rail.scrollWidth-innerWidth);
  storySection.style.setProperty('--story-distance',distance+'px');
  $$('.story',rail).forEach(card=>card.style.setProperty('--paper-scale',card.clientWidth/800.211));
  moveStories();
 }
 function moveStories(){queued=false;if(!desktopStories.matches)return;const travelled=Math.max(0,Math.min(distance,-storySection.getBoundingClientRect().top));rail.style.setProperty('--story-x',-travelled+'px')}
 addEventListener('scroll',()=>{if(!queued){queued=true;requestAnimationFrame(moveStories)}},{passive:true});
 addEventListener('resize',measureStories);addEventListener('load',measureStories);document.fonts.ready.then(measureStories);measureStories();
}
