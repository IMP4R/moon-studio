(()=>{
const track=document.querySelector('.web-carousel');if(!track)return;
const slides=[...track.children],reduced=matchMedia('(prefers-reduced-motion: reduce)');let index=0,drag=null,suppress=false;
const records=slides.map(el=>({el,video:el.querySelector('video'),visible:false}));
const offset=i=>slides[i].offsetLeft-slides[0].offsetLeft;
function sync(r){if(!r.video.src&&r.visible){r.video.src=r.video.dataset.src;r.video.load()}if(records[index]===r&&r.visible&&!document.hidden&&!reduced.matches)r.video.play().catch(()=>{});else r.video.pause()}
function update(){index=slides.reduce((n,s,i)=>Math.abs(offset(i)-track.scrollLeft)<Math.abs(offset(n)-track.scrollLeft)?i:n,0);records.forEach(sync)}
function move(i,instant=false){track.scrollTo({left:offset(Math.max(0,Math.min(slides.length-1,i))),behavior:instant||reduced.matches?'instant':'smooth'})}
track.addEventListener('scroll',update,{passive:true});track.addEventListener('keydown',e=>{if(e.key==='ArrowRight'||e.key==='ArrowLeft'){e.preventDefault();move(index+(e.key==='ArrowRight'?1:-1),true)}});
track.addEventListener('pointerdown',e=>{if(e.pointerType!=='mouse'||e.button!==0)return;drag={id:e.pointerId,x:e.clientX,left:track.scrollLeft,moved:false};suppress=false});
track.addEventListener('pointermove',e=>{if(!drag)return;const dx=e.clientX-drag.x;if(!drag.moved&&Math.abs(dx)>5){drag.moved=true;track.setPointerCapture(e.pointerId);track.classList.add('is-dragging')}if(drag.moved){e.preventDefault();track.scrollLeft=drag.left-dx}});
function release(){if(!drag)return;const moved=drag.moved;drag=null;track.classList.remove('is-dragging');if(moved){suppress=true;update();move(index);setTimeout(()=>suppress=false,0)}}
track.addEventListener('pointerup',release);track.addEventListener('pointercancel',()=>{drag=null;track.classList.remove('is-dragging')});track.addEventListener('click',e=>{if(suppress){e.preventDefault();e.stopPropagation()}},true);track.addEventListener('dragstart',e=>e.preventDefault());
slides.forEach((s,i)=>s.addEventListener('focusin',()=>{move(i,true)}));addEventListener('resize',()=>move(index,true));
const observer=new IntersectionObserver(entries=>entries.forEach(e=>{const r=records.find(r=>r.el===e.target);r.visible=e.isIntersecting;sync(r)}),{threshold:.3});records.forEach(r=>observer.observe(r.el));document.addEventListener('visibilitychange',()=>records.forEach(sync));reduced.addEventListener('change',()=>records.forEach(sync));update();
})();
