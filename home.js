const $=s=>document.querySelector(s);
function toast(text){const el=$('#toast');if(!el)return;el.textContent=text;el.classList.add('show');clearTimeout(window.__toast);window.__toast=setTimeout(()=>el.classList.remove('show'),2400)}
function go(id){closeFeatures();const el=document.getElementById(id);if(el)el.scrollIntoView({behavior:'smooth',block:'start'});setTimeout(()=>history.replaceState(null,'','#'+id),500)}
function openFeatures(){document.getElementById('featureDrawer')?.classList.add('open')}
function closeFeatures(){document.getElementById('featureDrawer')?.classList.remove('open')}
function toggleTheme(){const light=document.documentElement.classList.toggle('light');localStorage.setItem('kh-theme',light?'light':'dark');const b=$('#themeBtn');if(b)b.textContent=light?'☀':'☾'}
function initTheme(){if(localStorage.getItem('kh-theme')==='light'){document.documentElement.classList.add('light');if($('#themeBtn'))$('#themeBtn').textContent='☀'}}
function addComment(id){const input=document.querySelector(`[data-comment="${id}"]`);const text=input?.value.trim();if(!text)return toast('اكتب سؤالك الأول');const key='kh-comments-'+id;const arr=JSON.parse(localStorage.getItem(key)||'[]');arr.push(text);localStorage.setItem(key,JSON.stringify(arr));input.value='';renderComments(id);toast('تم إرسال سؤالك')}
function renderComments(id){const box=document.getElementById('comments-'+id);if(!box)return;const arr=JSON.parse(localStorage.getItem('kh-comments-'+id)||'[]');box.innerHTML=arr.slice(-4).map(x=>`<div class="comment">💬 ${escapeHtml(x)}</div>`).join('')}
function escapeHtml(s){return String(s).replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]))}
function downloadPDF(name){toast('سيتم فتح ملف '+name+' من مكتبة المنصة عند ربط رابط الملف في قاعدة البيانات')}
function sendTeacherMessage(){const name=$('#studentName')?.value.trim(),msg=$('#studentMessage')?.value.trim();if(!name||!msg)return toast('اكتب اسمك والسؤال');localStorage.setItem('teacher-message',JSON.stringify({name,subject:'رياضيات',msg,date:new Date().toISOString()}));toast('تم إرسال السؤال للمستر')}
function openVideoChat(title){sessionStorage.setItem('video-ai-context',title);location.href='ai.html?video='+encodeURIComponent(title)}
function revealInit(){const els=document.querySelectorAll('.reveal');const io=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting)e.target.classList.add('show')}),{threshold:.12});els.forEach(e=>io.observe(e))}
document.querySelectorAll('#tabs button').forEach(btn=>btn.addEventListener('click',()=>{document.querySelectorAll('#tabs button').forEach(b=>b.classList.remove('active'));btn.classList.add('active');const grade=btn.dataset.grade;document.querySelectorAll('[data-grade]').forEach(card=>{card.style.display=grade==='all'||card.dataset.grade===grade?'':'none'})}));
['v1','v2','v3'].forEach(renderComments);initTheme();revealInit();
window.addEventListener('keydown',e=>{if(e.key==='Escape')closeFeatures()});
