(()=>{
'use strict';
const DATA=/*DATA_PLACEHOLDER*/;
const $=s=>document.querySelector(s), $$=s=>Array.from(document.querySelectorAll(s));
const authors=DATA.authors;const TOTAL=authors.reduce((n,a)=>n+a.count,0);
const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const T={
 zh:{navHome:'首页',navAuthors:'作家画廊',navWorks:'作品展厅',navMap:'文学地图',heroEyebrow:'一场穿越俄罗斯文学黄金时代的旅行',heroTitleLine1:'俄罗斯文学的',heroTitleLine2:'流动画廊',heroIntro:'让文字成为画，让时间在画框之间缓缓流动。从普希金的舞会，到契诃夫最后的樱桃园。',enterGallery:'进入画廊',heroFoot:`五位作家 · 十四部作品 · ${TOTAL} 幅画`,authorsEyebrow:'第一展厅 · 文学群像',authorsHeading:'五位作家，五个世界',dragHint:'拖动、点击或使用方向键，进入另一位作家的世界',chapterEyebrow:'第二展厅 · 作品与情节',paintingLabel:'馆藏画作',thumbHead:'沿着原著情节，缓慢翻阅',literaryConcept:'作品的文学核心',mapEyebrow:'第三展厅 · 文学地理',mapHeading:'文学的地理与记忆',mapCentre:'文学中的俄罗斯',mapStPete:'圣彼得堡',mapMoscow:'莫斯科',mapYasnaya:'亚斯纳亚·波利亚纳',mapTaganrog:'塔甘罗格',mapEssayEyebrow:'从城市到庄园',mapEssayHeading:'故事发生的地方，也是文学诞生的地方。',mapEssayBody:'圣彼得堡的河岸承载奥涅金和地下室人的孤独；莫斯科的舞会、战火与剧院映照人的命运；俄国乡间的庄园则收藏了关于故乡、家庭与失去的记忆。',mapDisclaimer:'地理示意为艺术化排布，非精确比例地图。',closingTitle:'时间流逝，故事仍在。',closingBody:'一座缓缓流动的线上文学展厅。每一幅画，都是重新走近原著的一扇窗。',backTop:'回到起点',footerText:'文学与绘画的私人收藏',pause:'暂停流动',play:'继续流动',scene:'情节',of:'共'},
 ru:{navHome:'Главная',navAuthors:'Писатели',navWorks:'Произведения',navMap:'Карта',heroEyebrow:'Путешествие в золотой век русской литературы',heroTitleLine1:'Галерея русской',heroTitleLine2:'литературы',heroIntro:'Когда слова становятся картинами, время течёт между рамами. От бала Пушкина до последнего вишнёвого сада Чехова.',enterGallery:'Войти в галерею',heroFoot:`Пять писателей · 14 произведений · ${TOTAL} картин`,authorsEyebrow:'Зал первый · Писатели',authorsHeading:'Пять писателей, пять миров',dragHint:'Перетаскивайте карточки или используйте стрелки',chapterEyebrow:'Зал второй · Произведения',paintingLabel:'Картина',thumbHead:'Листайте историю по картинам',literaryConcept:'Литературная идея',mapEyebrow:'Зал третий · География',mapHeading:'География и память',mapCentre:'Литературная Россия',mapStPete:'Санкт-Петербург',mapMoscow:'Москва',mapYasnaya:'Ясная Поляна',mapTaganrog:'Таганрог',mapEssayEyebrow:'От городов к усадьбам',mapEssayHeading:'Места действия становятся частью литературной судьбы.',mapEssayBody:'Петербургские улицы хранят одиночество героев, московские балы и пожары — их испытания, а дворянские усадьбы — память о семье и родине.',mapDisclaimer:'Художественная схема, не точная географическая карта.',closingTitle:'Время проходит. Истории остаются.',closingBody:'Медленно текущая литературная галерея. Каждая картина возвращает нас к книге.',backTop:'К началу',footerText:'Частная литературная коллекция',pause:'Пауза',play:'Воспроизвести',scene:'Сцена',of:'из'}
};
let lang='zh';let activeAuthor=0,activeWork=0,activeScene=0, currentImage=0;
let manualPaused=false,previewHover=false,worksVisible=false,coversVisible=false,coverHover=false,coverManualUntil=0;
let mediaLoadedToken=0,nextSceneTime=Date.now()+7400,nextCoverTime=Date.now()+10000;
const durationScene=7400, durationCover=10000;
const media=$('#stageMedia'), stageImgs=[$('#stageImageA'),$('#stageImageB')], stageCopy=$('#stageCopy');
const getAuthor=()=>authors[activeAuthor],getWork=()=>getAuthor().works[activeWork],getScene=()=>getWork().scenes[activeScene];
const display=(o,key)=>lang==='ru'?(o[key+'Ru']||o.ru||o[key]):(o[key]||o.zh);
const escapeHTML=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const two=i=>String(i).padStart(2,'0');
function translateStatic(){
 $$('[data-t]').forEach(el=>{const value=T[lang][el.dataset.t];if(value!==undefined)el.textContent=value;});
 document.documentElement.lang=lang==='ru'?'ru':'zh-CN';
 document.body.classList.toggle('russian-mode',lang==='ru');
 $('#langText').textContent=lang==='ru'?'中':'Рус';
 $('.hero-ru').textContent=lang==='ru'?'Галерея из пяти эпох':'Галерея русской литературы';
 $('#playLabel').textContent=manualPaused?T[lang].play:T[lang].pause;
 if(lang==='ru') $('.hero-title').classList.add('ru');else $('.hero-title').classList.remove('ru');
}
function renderCover(){
 const el=$('#coverStage');el.innerHTML=authors.map((a,i)=>`<button class="cover-card" type="button" data-index="${i}" aria-label="${escapeHTML(a.zh)}，${a.dates}"><div class="cover-image"><img src="${a.cover}" alt="${escapeHTML(a.zh)}的作品情节画" ${i<2?'loading="eager"':'loading="lazy"'} /></div><div class="cover-caption"><strong data-card-title="${i}">${escapeHTML(a.zh)}</strong><span class="ru">${escapeHTML(a.ru)}</span><em>${a.dates}</em></div></button>`).join('');
 $$('button.cover-card').forEach(card=>card.addEventListener('click',()=>{
  const idx=Number(card.dataset.index); if(idx===activeAuthor){$('#works').scrollIntoView({behavior:reduced?'auto':'smooth'});}else changeAuthor(idx,true);
 }));updateCover();
}
function updateCover(){
 const cards=$$('.cover-card');
 cards.forEach((c,i)=>{
 let diff=i-activeAuthor;
 // Circular Cover Flow: two neighbors on each side while advancing chronologically.
 const half=Math.floor(authors.length/2);
 if(diff>half) diff-=authors.length;
 if(diff< -half) diff+=authors.length;
 let abs=Math.abs(diff),isActive=abs===0;
 const x=diff*83;const z=-abs*105;const rot=-diff*27;const scale=1-abs*.092;
 c.style.transform=`translateX(calc(-50% + ${x}%)) translateX(var(--cover-drag, 0px)) translateZ(${z}px) rotateY(${rot}deg) scale(${scale})`;
 c.style.zIndex=String(12-abs);c.style.opacity=String(abs>2?.22:abs===2?.58:abs===1?.84:1);
 c.style.filter=abs>1?'brightness(.87)':'none';
 c.setAttribute('aria-current',String(isActive));c.tabIndex=isActive?0:-1;
 const name=c.querySelector('[data-card-title]');if(name)name.textContent=lang==='ru'?authors[i].ru:authors[i].zh;
 c.querySelector('.cover-caption .ru').textContent=lang==='ru'?authors[i].zh:authors[i].ru;
 });
 $('#authorCounter').textContent=`${two(activeAuthor+1)} / ${two(authors.length)}`;
 $('#coverBackdrop').style.backgroundImage=`url('${getAuthor().cover}')`;
}
function writeTheme(){
 const a=getAuthor(),[tone,ink,accent]=a.palette;
 document.documentElement.style.setProperty('--tone',tone);
 document.documentElement.style.setProperty('--ink',ink);
 document.documentElement.style.setProperty('--accent',accent);
 $('#chapterIndex').textContent=`${two(activeAuthor+1)} / ${two(authors.length)}`;
}
function renderAuthorIntro(){
 const a=getAuthor();
 $('#authorIntro').innerHTML=`<div class="author-name"><p class="author-number ru">${two(activeAuthor+1)} — ${a.dates}</p><h2>${escapeHTML(lang==='ru'?a.ru:a.zh)}</h2><p class="ru">${escapeHTML(lang==='ru'?a.zh:a.ru)}</p><span class="dates">${escapeHTML(lang==='ru'?a.kickerRu:a.kicker)}</span></div><div class="author-description"><p class="statement">${escapeHTML(lang==='ru'?a.themeRu:a.theme)}</p><p class="intro-text">${escapeHTML(lang==='ru'?a.summaryRu:a.summary)}</p><p class="ru">${escapeHTML(lang==='ru'?a.summary:a.summaryRu)}</p></div>`;
}
// One shared selection surface slides between tabs, in the spirit of Motion Primitives' animated background.
function moveWorkHighlight(){
 const root=$('#workTabs'), active=root.querySelector('.work-tab.active'), indicator=root.querySelector('.work-tab-indicator');
 if(!active||!indicator)return;
 indicator.style.width=`${active.offsetWidth}px`;
 indicator.style.height=`${active.offsetHeight}px`;
 indicator.style.transform=`translate3d(${active.offsetLeft}px,${active.offsetTop}px,0)`;
 indicator.style.opacity='1';
}
function renderWorkTabs(){
 const a=getAuthor(),root=$('#workTabs');
 if(root.dataset.author!==a.id||root.querySelectorAll('.work-tab').length!==a.works.length){
  root.innerHTML=a.works.map((w,i)=>`<button type="button" class="work-tab" data-work="${i}" role="tab" aria-selected="false"><span>${two(i+1)}</span>${escapeHTML(lang==='ru'?w.ru:w.zh)}</button>`).join('')+'<span class="work-tab-indicator" aria-hidden="true"></span>';
  root.dataset.author=a.id;
  root.querySelectorAll('.work-tab').forEach(c=>c.addEventListener('click',()=>changeWork(Number(c.dataset.work))));
 }
 root.querySelectorAll('.work-tab').forEach((c,i)=>{
  c.classList.toggle('active',i===activeWork);
  c.setAttribute('aria-selected',String(i===activeWork));
  c.tabIndex=i===activeWork?0:-1;
  c.innerHTML=`<span>${two(i+1)}</span>${escapeHTML(lang==='ru'?a.works[i].ru:a.works[i].zh)}`;
 });
 requestAnimationFrame(moveWorkHighlight);
}
function renderThumbs(){
 const w=getWork();$('#thumbCount').textContent=`01 — ${two(w.scenes.length)}`;
 $('#thumbs').innerHTML=w.scenes.map((s,i)=>`<button class="thumb-button ${i===activeScene?'active':''}" type="button" data-scene="${i}" aria-current="${i===activeScene}" aria-label="${escapeHTML(lang==='ru'?s.ru:s.zh)}"><img loading="lazy" src="${s.image}" alt="${escapeHTML(lang==='ru'?s.ru:s.zh)}"/><div class="thumb-label"><span class="num">${two(i+1)}</span><span class="title">${escapeHTML(lang==='ru'?s.ru:s.zh)}</span></div></button>`).join('');
 $$('.thumb-button').forEach(btn=>btn.addEventListener('click',()=>showScene(Number(btn.dataset.scene),true)));
}
function updateSceneText(immediate=false){
 const a=getAuthor(),w=getWork(),s=getScene();
 const render=()=>{
 $('#frameNumber').textContent=`${two(activeScene+1)} / ${two(w.scenes.length)}`;
 $('#paintSerial').textContent=`${two(activeWork+1)} — ${two(activeScene+1)}`;
 $('#stageWork').textContent=lang==='ru'?w.ru:w.zh;
 $('#stageTitle').textContent=lang==='ru'?s.ru:s.zh;
 $('#stageTitleRu').textContent=lang==='ru'?s.zh:s.ru;
 $('#stageDesc').textContent=lang==='ru'?s.descRu:s.desc;
 stageCopy.classList.remove('changing');
 };
 if(immediate||reduced)render();else{stageCopy.classList.add('changing');window.setTimeout(render,210);}
 $('#workIdea').textContent=lang==='ru'?w.ideaRu:w.idea;
 $('#workIdeaRu').textContent=lang==='ru'?w.idea:w.ideaRu;
 $('#workOverview').textContent=lang==='ru'?w.overviewRu:w.overview;
 $$('.thumb-button').forEach((b,i)=>{b.classList.toggle('active',i===activeScene);b.setAttribute('aria-current',String(i===activeScene));});
 const scroll=$('#thumbs');const thumb=scroll.children[activeScene];if(thumb){const target=thumb.offsetLeft-scroll.offsetLeft-scroll.clientWidth/2+thumb.clientWidth/2;scroll.scrollTo({left:target,behavior:reduced?'instant':'smooth'});}
 $('#stageMedia').className='stage-media '+s.fx.split(/\s+/).map(x=>'fx-'+x).join(' ');
 $('#lightboxCaption').textContent=(lang==='ru'?w.ru:w.zh)+' / '+(lang==='ru'?s.ru:s.zh);
}
function loadImage(src,alt,immediate){
 let serial=++mediaLoadedToken;
 if(immediate){stageImgs.forEach(im=>{im.classList.remove('active');im.alt='';});currentImage=0;stageImgs[0].src=src;stageImgs[0].alt=alt;stageImgs[0].classList.add('active');return;}
 const next=1-currentImage,oldImg=stageImgs[currentImage],newImg=stageImgs[next];
 newImg.classList.remove('active');newImg.alt=alt;
 newImg.onload=()=>{if(serial!==mediaLoadedToken)return;newImg.classList.add('active');oldImg.classList.remove('active');currentImage=next;};
 newImg.onerror=()=>{if(serial!==mediaLoadedToken)return;console.error('未能载入画作',src)};
 newImg.src=src;
 if(newImg.complete && newImg.naturalWidth>0)newImg.onload();
}
function updateScene(immediate=false){
 const s=getScene();loadImage(s.image,lang==='ru'?s.ru:s.zh,immediate);updateSceneText(immediate);nextSceneTime=Date.now()+durationScene;
 $('#storyProgressBar').style.width='0%';
}
function showScene(i,manual=false){
 const w=getWork();activeScene=(i+w.scenes.length)%w.scenes.length;updateScene(false);
 if(manual){coverManualUntil=Date.now()+13000;nextSceneTime=Date.now()+10500;}
}
function renderWork(){activeScene=0;renderWorkTabs();renderThumbs();updateScene(true)}
function changeWork(idx){if(idx<0||idx>=getAuthor().works.length)return;activeWork=idx;renderWork();}
function changeAuthor(idx,manual=false){activeAuthor=(idx+authors.length)%authors.length;activeWork=0;activeScene=0;
 updateCover();writeTheme();renderAuthorIntro();renderWork();if(manual)coverManualUntil=Date.now()+15000;
}
function refreshLanguage(){translateStatic();updateCover();renderAuthorIntro();renderWorkTabs();renderThumbs();updateSceneText(true);}
$('#langToggle').addEventListener('click',()=>{lang=lang==='zh'?'ru':'zh';refreshLanguage()});
$('#authorPrev').addEventListener('click',()=>changeAuthor(activeAuthor-1,true));
$('#authorNext').addEventListener('click',()=>changeAuthor(activeAuthor+1,true));
$('#coverStage').addEventListener('keydown',e=>{if(e.key==='ArrowLeft'){e.preventDefault();changeAuthor(activeAuthor-1,true)}else if(e.key==='ArrowRight'){e.preventDefault();changeAuthor(activeAuthor+1,true)}else if(e.key==='Enter'){e.preventDefault();$('#works').scrollIntoView({behavior:reduced?'auto':'smooth'})}});
// Drag-follow + spring snap: pointer movement previews the neighboring cards without locking vertical scrolling.
const coverStage=$('#coverStage');
let coverDrag=null, suppressCoverClick=false;
coverStage.addEventListener('pointerdown',e=>{
 if(e.button!==0||e.target.closest('a'))return;
 coverDrag={pointerId:e.pointerId,startX:e.clientX,startY:e.clientY,moved:false,axis:null};
});
window.addEventListener('pointermove',e=>{
 const d=coverDrag;if(!d||d.pointerId!==e.pointerId)return;
 const dx=e.clientX-d.startX,dy=e.clientY-d.startY;
 if(!d.axis&&Math.hypot(dx,dy)>9)d.axis=Math.abs(dx)>Math.abs(dy)*1.2?'horizontal':'vertical';
 if(d.axis!=='horizontal')return;
 d.moved=Math.abs(dx)>14;
 coverStage.classList.add('is-dragging');
 coverStage.style.setProperty('--cover-drag',`${Math.max(-185,Math.min(185,dx*.70))}px`);
}, {passive:true});
function endCoverDrag(e){
 const d=coverDrag;if(!d||d.pointerId!==e.pointerId)return;
 const delta=e.clientX-d.startX;
 coverDrag=null;
 coverStage.classList.remove('is-dragging');
 coverStage.style.removeProperty('--cover-drag');
 if(d.axis==='horizontal'&&Math.abs(delta)>46){
  suppressCoverClick=true;
  changeAuthor(activeAuthor+(delta<0?1:-1),true);
  setTimeout(()=>{suppressCoverClick=false},70);
 }
}
window.addEventListener('pointerup',endCoverDrag);
window.addEventListener('pointercancel',()=>{
 coverDrag=null;coverStage.classList.remove('is-dragging');coverStage.style.removeProperty('--cover-drag');
});
coverStage.addEventListener('click',e=>{
 if(suppressCoverClick){e.stopImmediatePropagation();e.preventDefault();}
},true);
$('#coverStage').addEventListener('mouseenter',()=>coverHover=true);
$('#coverStage').addEventListener('mouseleave',()=>coverHover=false);
$('#coverStage').addEventListener('focusin',()=>coverHover=true);
$('#coverStage').addEventListener('focusout',e=>{if(!$('#coverStage').contains(e.relatedTarget))coverHover=false});
$('#workTabs').addEventListener('keydown',e=>{
 if(e.key!=='ArrowLeft'&&e.key!=='ArrowRight'&&e.key!=='Home'&&e.key!=='End')return;
 e.preventDefault();
 const count=getAuthor().works.length;
 const next=e.key==='Home'?0:e.key==='End'?count-1:(activeWork+(e.key==='ArrowRight'?1:-1)+count)%count;
 changeWork(next);
 $('#workTabs').querySelector('.work-tab.active')?.focus();
});
window.addEventListener('resize',()=>requestAnimationFrame(moveWorkHighlight),{passive:true});
$('#stagePrev').addEventListener('click',()=>showScene(activeScene-1,true));
$('#stageNext').addEventListener('click',()=>showScene(activeScene+1,true));
const artwork=$('#artworkShell');
artwork.addEventListener('mouseenter',()=>previewHover=true);
artwork.addEventListener('mouseleave',()=>{previewHover=false;nextSceneTime=Date.now()+3000});
artwork.addEventListener('focusin',()=>previewHover=true);
artwork.addEventListener('focusout',e=>{if(!artwork.contains(e.relatedTarget)){previewHover=false;nextSceneTime=Date.now()+3000}});
function togglePlay(){manualPaused=!manualPaused;$('#playIcon').textContent=manualPaused?'▶':'Ⅱ';$('#playLabel').textContent=manualPaused?T[lang].play:T[lang].pause;$('#playToggle').setAttribute('aria-pressed',String(manualPaused));nextSceneTime=Date.now()+durationScene;}
$('#playToggle').addEventListener('click',togglePlay);
let rafTime=0;function tick(ts){
 if(ts-rafTime>120){rafTime=ts;const now=Date.now();const inactive=document.hidden||reduced||$('#lightbox').classList.contains('open');
 if(!inactive&&worksVisible&&!manualPaused&&!previewHover){if(now>=nextSceneTime){showScene(activeScene+1);nextSceneTime=now+durationScene;}
 $('#storyProgressBar').style.width=(Math.max(0,Math.min(100,100-(nextSceneTime-now)/durationScene*100)))+'%';}
 else{$('#storyProgressBar').style.width='0%';if(now>nextSceneTime)nextSceneTime=now+durationScene;}
 if(!inactive&&coversVisible&&!coverHover&&now>coverManualUntil&&now>=nextCoverTime){changeAuthor(activeAuthor+1,false);nextCoverTime=now+durationCover;} }
 window.requestAnimationFrame(tick);
}window.requestAnimationFrame(tick);
if('IntersectionObserver' in window){
 const secObserver=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.target.id==='works')worksVisible=e.isIntersecting&&e.intersectionRatio>.23;if(e.target.id==='authors')coversVisible=e.isIntersecting&&e.intersectionRatio>.23;}),{threshold:[0,.23,.55]});secObserver.observe($('#authors'));secObserver.observe($('#works'));
 const revealObs=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');revealObs.unobserve(e.target);}}),{threshold:.08,rootMargin:'0px 0px -25px 0px'});$$('.reveal').forEach(el=>revealObs.observe(el));
 const navObserver=new IntersectionObserver(entries=>{entries.forEach(e=>{if(e.isIntersecting){$$('.main-nav a').forEach(a=>a.classList.toggle('active',a.hash==='#'+e.target.id));}})},{rootMargin:'-80px 0px -66% 0px',threshold:0});$$('main>section').forEach(el=>navObserver.observe(el));
}else{$$('.reveal').forEach(el=>el.classList.add('visible'));worksVisible=true;coversVisible=true;}
let ticking=false;function onScroll(){if(ticking)return;ticking=true;requestAnimationFrame(()=>{const doc=document.documentElement;const max=doc.scrollHeight-innerHeight;$('#scrollIndicator').style.width=(max>0?scrollY/max*100:0)+'%';$('#siteHeader').classList.toggle('scrolled',scrollY>15);ticking=false})}window.addEventListener('scroll',onScroll,{passive:true});onScroll();
$('.menu-toggle').addEventListener('click',()=>{const nav=$('.main-nav');const shown=nav.classList.toggle('open');$('.menu-toggle').setAttribute('aria-expanded',String(shown));});$$('.main-nav a').forEach(link=>link.addEventListener('click',()=>{$('.main-nav').classList.remove('open');$('.menu-toggle').setAttribute('aria-expanded','false');}));
$$('.magnetic').forEach(el=>{if(reduced)return;el.addEventListener('pointermove',e=>{if(e.pointerType==='touch')return;const r=el.getBoundingClientRect();const x=(e.clientX-r.left-r.width/2)*.10;const y=(e.clientY-r.top-r.height/2)*.12;el.style.transform=`translate(${x}px,${y}px)`});el.addEventListener('pointerleave',()=>el.style.transform='')});
$$('.map-point').forEach(el=>el.addEventListener('click',()=>{const index=authors.findIndex(a=>a.id===el.dataset.artist);if(index>=0){changeAuthor(index,true);$('#works').scrollIntoView({behavior:reduced?'auto':'smooth'})}}));
// Enlarged painting follows the same scene order as the gallery.
const lb=$('#lightbox');let lastFocus=null;
function updateLightbox(){const s=getScene(),w=getWork();$('#lightboxImage').src=s.image;$('#lightboxImage').alt=lang==='ru'?s.ru:s.zh;$('#lightboxCaption').textContent=(lang==='ru'?w.ru:w.zh)+' / '+(lang==='ru'?s.ru:s.zh);}
function openLightbox(){lastFocus=document.activeElement;lb.classList.add('open');lb.setAttribute('aria-hidden','false');document.body.classList.add('lightbox-open');updateLightbox();$('#lightboxClose').focus();}
function closeLightbox(){lb.classList.remove('open');lb.setAttribute('aria-hidden','true');document.body.classList.remove('lightbox-open');if(lastFocus?.focus)lastFocus.focus();}
$('#expandImage').addEventListener('click',openLightbox);
$('#lightboxClose').addEventListener('click',closeLightbox);
lb.addEventListener('click',e=>{if(e.target===lb)closeLightbox()});
$('#lightboxPrev').addEventListener('click',()=>{showScene(activeScene-1,true);updateLightbox()});
$('#lightboxNext').addEventListener('click',()=>{showScene(activeScene+1,true);updateLightbox()});
document.addEventListener('keydown',e=>{if(lb.classList.contains('open')){if(e.key==='Escape')closeLightbox();if(e.key==='ArrowLeft'){$('#lightboxPrev').click()}if(e.key==='ArrowRight'){$('#lightboxNext').click()}if(e.key==='Tab'){const options=[$('#lightboxClose'),$('#lightboxPrev'),$('#lightboxNext')];let index=options.indexOf(document.activeElement);if(e.shiftKey&&index===0){e.preventDefault();options.at(-1).focus()}else if(!e.shiftKey&&index===options.length-1){e.preventDefault();options[0].focus()}}}});
let artTouch=null;media.addEventListener('touchstart',e=>artTouch=e.changedTouches[0].clientX,{passive:true});media.addEventListener('touchend',e=>{if(artTouch===null)return;let delta=e.changedTouches[0].clientX-artTouch;artTouch=null;if(Math.abs(delta)>55)showScene(activeScene+(delta<0?1:-1),true)},{passive:true});
// Start with the cover selected by chronological order.
translateStatic();renderCover();writeTheme();renderAuthorIntro();renderWork();
})();
