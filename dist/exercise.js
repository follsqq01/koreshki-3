'use strict';
// Fictional learning scenarios; photos do not imply real biographies.
const candidates = [
 {name:'Рогозный Никита Юрьевич',role:'Инженер',age:'67 лет',photo:'candidate-1.png',education:'Высшее техническое образование. Дополнительный курс по 3D-моделированию.',about:'Проектирует детали и механизмы. Проверяет чертежи и помогает команде находить причины производственных ошибок.',now:'Ищет работу инженером-конструктором. Готов выполнить тестовое задание в CAD.',skills:'CAD, 3D-модели, техническая документация, расчёт допусков, работа в команде.',fact:'Никита самостоятельно освоил 3D-печать и сделал прототип, который помог команде сократить время сборки вдвое.'},
 {name:'Морозова Анна Игоревна',role:'Менеджер проектов',age:'24 года',photo:'candidate-2.png',education:'Бакалавриат по менеджменту. Курс по управлению цифровыми проектами.',about:'Координирует работу дизайнеров и разработчиков. Ведёт задачи, договаривается о сроках и собирает обратную связь.',now:'Ищет команду, где сможет вести проекты от первого брифа до запуска.',skills:'Планирование, бюджетирование, Jira, переговоры, управление рисками.',fact:'Когда руководитель выбыл из проекта, Анна организовала работу команды из восьми человек и довела запуск до конца в срок.'},
 {name:'Соколова Ирина Павловна',role:'Аналитик данных',age:'56 лет',photo:'candidate-3.png',education:'Высшее экономическое образование. Переподготовка по анализу данных.',about:'Анализирует продажи, проверяет гипотезы и превращает таблицы в понятные рекомендации для бизнеса.',now:'Ищет работу аналитиком. В портфолио — отчёты по запасам и поведению покупателей.',skills:'SQL, Python, Excel, Power BI, визуализация данных, проверка гипотез.',fact:'Ирина написала скрипт для сверки отчётов: задача, на которую уходил рабочий день, теперь занимает двадцать минут.'},
 {name:'Лебедева Мария Андреевна',role:'UX/UI-дизайнер',age:'22 года',photo:'candidate-4.png',education:'Бакалавриат по дизайну. Практикум по исследованиям пользовательского опыта.',about:'Создаёт интерфейсы, проводит интервью и проверяет прототипы с пользователями. Аргументирует решения результатами тестов.',now:'Ищет работу продуктовым дизайнером. Готова показать ход работы над каждым кейсом.',skills:'Figma, прототипирование, интервью, тестирование, доступность интерфейсов.',fact:'Мария заметила, что людям с плохим зрением трудно заполнить форму. После её доработки число ошибок на тестах снизилось вдвое.'},
 {name:'Волкова Татьяна Олеговна',role:'Специалист по обучению',age:'61 год',photo:'candidate-5.png',education:'Высшее педагогическое образование. Курс по созданию онлайн-обучения.',about:'Разрабатывает программы адаптации сотрудников. Разбирает сложные процессы на понятные шаги и собирает обратную связь.',now:'Ищет команду для развития внутреннего обучения и системы наставничества.',skills:'Методика обучения, LMS, видеокурсы, фасилитация, оценка результатов.',fact:'Татьяна превратила длинные инструкции в короткие видеокурсы. Новые сотрудники стали проходить адаптацию на неделю быстрее.'}
];
const scores={overall:0,skills:0,impression:0};
const scoreNames={overall:'Общая оценка',skills:'Навыки кандидата',impression:'Первое впечатление'};
let candidateIndex=0,phase='rating',initialDecision=null;
const answers=[];
const find=s=>document.querySelector(s);
const all=s=>document.querySelectorAll(s);
const node=n=>find(`[data-node-id="1:${n}"]`);
all('.art-ratings').forEach(group=>{
 const key=group.dataset.rating;group.setAttribute('role','radiogroup');group.setAttribute('aria-label',scoreNames[key]);
 for(let value=1;value<=5;value++){
  const button=document.createElement('button');button.type='button';button.setAttribute('role','radio');button.setAttribute('aria-label',`${value} из 5`);button.textContent=value;
  button.onclick=()=>choose(key,value);button.onkeydown=e=>{let target=value;if(e.key==='ArrowRight'||e.key==='ArrowDown')target=value%5+1;else if(e.key==='ArrowLeft'||e.key==='ArrowUp')target=(value+3)%5+1;else if(e.key==='Home')target=1;else if(e.key==='End')target=5;else return;e.preventDefault();choose(key,target);group.children[target-1].focus()};group.append(button);
 }
});
function choose(key,value){if(phase!=='rating')return;scores[key]=value;renderScores();find('#test-hint').textContent='Оцените кандидата по трём критериям, затем примите решение.'}
function renderScores(){all('.art-ratings').forEach(group=>[...group.children].forEach((button,index)=>{const score=scores[group.dataset.rating];button.classList.toggle('selected',index<score);button.setAttribute('aria-checked',String(index+1===score));button.tabIndex=(score?index+1===score:index===0)?0:-1}))}
function show(screen,focus){['rating','reveal','summary'].forEach(name=>find(`#${name}-screen`).hidden=name!==screen);sizeArt();window.scrollTo({top:0,behavior:'instant'});if(focus){focus.tabIndex=-1;focus.focus({preventScroll:true})}}
function renderCandidate(moveFocus=false){
 const c=candidates[candidateIndex];phase='rating';initialDecision=null;Object.keys(scores).forEach(k=>scores[k]=0);renderScores();
 all('[data-field]').forEach(el=>{el.textContent=c[el.dataset.field];if(el.dataset.field==='role'&&el.closest('#reveal-screen'))el.textContent+=`, ${c.age}`});
 all('.exercise-photo img').forEach(img=>{img.src=`assets/${c.photo}`;img.alt=img.closest('#rating-screen')?'Фото скрыто до первого решения':`Портрет: ${c.name}`});
 all('[data-tab="current"] p').forEach(el=>el.textContent=`кандидат №${candidateIndex+1}`);
 all('[data-tab="next"] p').forEach(el=>el.textContent=candidateIndex<4?`кандидат №${candidateIndex+2}`:'итоги');
 all('.exercise-progress').forEach(el=>el.textContent=`Кандидат ${candidateIndex+1} из 5`);
 find('#candidate-fact').textContent=c.fact;
 find('#test-hint').textContent='Оцените кандидата по трём критериям, затем примите решение.';
 show('rating',moveFocus?node(320):null);
}
all('[data-decision]').forEach(button=>button.onclick=()=>{
 if(phase!=='rating')return;
 const missing=Object.keys(scores).find(key=>!scores[key]);if(missing){find('#test-hint').textContent='Оцените кандидата по каждому из трёх критериев.';find(`[data-rating="${missing}"] button`).focus();return}
 initialDecision=button.dataset.decision;phase='reveal';
 find('#previous-rating').textContent=`Ваша общая оценка: ${scores.overall} из 5. Решение: ${initialDecision==='yes'?'пригласить':'отказать'}.`;
 show('reveal',node(395));
});
all('[data-answer]').forEach(button=>button.onclick=()=>{
 if(phase!=='reveal')return;phase='transition';
 const changed=button.dataset.answer==='yes';answers.push({scores:{...scores},initial:initialDecision,final:changed?(initialDecision==='yes'?'no':'yes'):initialDecision,changed});
 if(candidateIndex<candidates.length-1){candidateIndex++;renderCandidate(true)}else renderSummary();
});
function renderSummary(){
 phase='summary';
 const changed=answers.filter(a=>a.changed).length;
 const invited=answers.filter(a=>a.final==='yes').length;
 find('#summary-count').textContent=`${invited} из ${candidates.length}.`;
 find('#summary-insight').textContent=changed
  ?'Дополнительная информация помогла увидеть в анкетах то, чего не было заметно сначала.'
  :'Вы сохранили все пять решений. Подумайте, какие навыки и примеры работы стали для вас решающими.';
 show('summary',find('#summary-title'));
}
find('#restart').onclick=()=>{answers.length=0;candidateIndex=0;renderCandidate(true)};
renderCandidate();
