(()=>{
const track=document.querySelector('.web-carousel');if(!track)return;
const slides=[...track.children],prev=document.querySelector('[data-web-prev]'),next=document.querySelector('[data-web-next]'),count=document.querySelector('.web-carousel-count'),reduced=matchMedia('(prefers-reduced-motion: reduce)');let index=0;
const records=slides.map(el=>({el,video:el.querySelector('video'),button:el.querySelector('.web-player-toggle'),error:el.querySelector('.web-film-error'),visible:false,manual:false}));
function offset(i){return slides[i].offsetLeft-slides[0].offsetLeft}
function sync(r){const active=records[index]===r;if(!r.video.src&&r.visible&&active){r.video.src=r.video.dataset.src;r.video.load()}if(active&&r.visible&&!document.hidden&&!reduced.matches&&!r.manual)r.video.play().catch(()=>{r.button.textContent='Смотреть видео'});else r.video.pause()}
function update(){let nearest=0;slides.forEach((s,i)=>{if(Math.abs(offset(i)-track.scrollLeft)<Math.abs(offset(nearest)-track.scrollLeft))nearest=i});index=nearest;prev.disabled=index===0;next.disabled=index===slides.length-1;count.textContent=(index+1)+' / '+slides.length;records.forEach(sync)}
function move(d){const target=Math.max(0,Math.min(slides.length-1,index+d));track.scrollTo({left:offset(target),behavior:reduced.matches?'instant':'smooth'})}
prev.addEventListener('click',()=>move(-1));next.addEventListener('click',()=>move(1));track.addEventListener('scroll',update,{passive:true});track.addEventListener('keydown',e=>{if(e.target!==track)return;if(e.key==='ArrowRight'){e.preventDefault();move(1)}if(e.key==='ArrowLeft'){e.preventDefault();move(-1)}});
slides.forEach((s,i)=>s.addEventListener('focusin',()=>{if(index!==i){track.scrollTo({left:offset(i),behavior:'instant'});update()}}));
addEventListener('resize',()=>{track.scrollLeft=offset(index);update()});
records.forEach(r=>{r.button.addEventListener('click',()=>{if(!r.video.src){r.video.src=r.video.dataset.src;r.video.load()}if(r.video.paused){r.manual=false;r.video.play().catch(()=>r.error.hidden=false)}else{r.manual=true;r.video.pause()}});r.video.addEventListener('play',()=>{r.button.textContent='Пауза';r.button.setAttribute('aria-pressed','true')});r.video.addEventListener('pause',()=>{r.button.textContent='Смотреть видео';r.button.setAttribute('aria-pressed','false')});r.video.addEventListener('error',()=>{r.error.hidden=false;r.button.hidden=true})});
const observer=new IntersectionObserver(entries=>entries.forEach(e=>{const r=records.find(r=>r.el===e.target);r.visible=e.isIntersecting;sync(r)}),{threshold:.3});records.forEach(r=>observer.observe(r.el));document.addEventListener('visibilitychange',()=>records.forEach(sync));reduced.addEventListener('change',()=>records.forEach(sync));update();
})();
