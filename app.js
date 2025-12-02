// app.js — simple frontend logic for Atinama LMS
const API_STATE='api.php';
const UPLOAD_API='upload.php';
const WHATSAPP='https://wa.me/989300565169?text=سلام،%20میخواهم%20دوره%20را%20خریداری%20کنم%20.%20';
const DEFAULT_ADMIN='teacher';
const DEFAULT_ADMIN_PASS='admin2025';
let clientState = {students:[],sessions:[],assignments:[],quizzes:[],qa:[]};
async function init(){
  // try load from server
  try{
    const r=await fetch(API_STATE);
    if(r.ok){ clientState=await r.json(); console.log('Loaded server state'); }
  }catch(e){ console.log('Server state not available, using local fallback'); }
  // attach actions for some pages
  if(document.getElementById('coursesCards')){ /* placeholder */ }
}
function buy(courseId){
  // redirect to whatsapp with message containing course id
  window.location.href = WHATSAPP + encodeURIComponent(courseId);
}
async function doLogin(){
  const u=document.getElementById('loginUser').value.trim();
  const p=document.getElementById('loginPass').value.trim();
  // admin shortcut
  if((u===DEFAULT_ADMIN && p===DEFAULT_ADMIN_PASS) || (u==='teacher' && p==='admin2025')){
    localStorage.setItem('atinama_user','teacher'); alert('وارد شدی به پنل مدرس'); window.location='teacher-panel.html'; return;
  }
  // student login: check server or local
  try{
    const r=await fetch(API_STATE);
    if(r.ok){ const s=await r.json(); const stu = s.students.find(x=> (x.phone===u||x.username===u) && x.pass===p ); if(stu){
      if(stu.approved){ localStorage.setItem('atinama_user',stu.username); localStorage.setItem('atinama_role','student'); window.location='student-panel.html'; } else { alert('حساب شما هنوز توسط معلم تأیید نشده'); } return;
    } }
  }catch(e){}
  // fallback: localStorage
  const local=JSON.parse(localStorage.getItem('atinama_local')||'{"students":[]}');
  const found=local.students.find(x=> (x.phone===u||x.username===u) && x.pass===p );
  if(found){ if(found.approved){ localStorage.setItem('atinama_user',found.username); localStorage.setItem('atinama_role','student'); window.location='student-panel.html'; } else alert('حساب شما هنوز تأیید نشده'); return; }
  alert('ورود ناموفق');
}
function registerStudent(){
  const name=document.getElementById('regName').value.trim();
  const phone=document.getElementById('regPhone').value.trim();
  const pass=document.getElementById('regPass').value.trim();
  if(!name||!phone||!pass){ alert('همه موارد را پر کنید'); return; }
  const username = 'u'+Date.now();
  // send to server if available
  fetch(API_STATE).then(r=>r.json()).then(state=>{
    state.students = state.students || [];
    state.students.push({id:username,username:username,name:name,phone:phone,pass:pass,approved:false,courses:[]});
    // post back
    fetch(API_STATE,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(state)}).then(()=>{ alert('ثبت‌نام انجام شد — منتظر تایید معلم باشید'); window.location='login.html'; }).catch(()=>{ // fallback local
      const local=JSON.parse(localStorage.getItem('atinama_local')||'{"students":[]}');
      local.students.push({id:username,username:username,name:name,phone:phone,pass:pass,approved:false,courses:[]});
      localStorage.setItem('atinama_local',JSON.stringify(local));
      alert('ثبت شد — منتظر تایید معلم (آفلاین)'); window.location='login.html';
    });
  }).catch(()=>{ const local=JSON.parse(localStorage.getItem('atinama_local')||'{"students":[]}'); local.students.push({id:username,username:username,name:name,phone:phone,pass:pass,approved:false,courses:[]}); localStorage.setItem('atinama_local',JSON.stringify(local)); alert('ثبت شد — منتظر تایید معلم (آفلاین)'); window.location='login.html'; });
}
function loadPending(){
  fetch(API_STATE).then(r=>r.json()).then(s=>{
    const pend = s.students.filter(x=>!x.approved);
    let html = '<h3>دانش‌آموزان در انتظار تأیید</h3>';
    if(!pend.length) html += '<div class="muted">هیچ دانش‌آموزی در انتظار نیست</div>';
    pend.forEach(p=>{ html += `<div class="card"><strong>${p.name}</strong> — ${p.phone} <div class="row"><button onclick="approveStudent('${p.username}')">تأیید</button><button onclick="rejectStudent('${p.username}')">رد</button></div></div>`; });
    document.getElementById('teacherArea').innerHTML = html;
  }).catch(()=>alert('دسترسی به سرور ممکن نیست'));
}
function approveStudent(username){
  fetch(API_STATE).then(r=>r.json()).then(s=>{
    const st = s.students.find(x=>x.username===username);
    if(!st) return alert('پیدا نشد');
    st.approved = true;
    fetch(API_STATE,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(s)}).then(()=>{ alert('تأیید شد'); loadPending(); }).catch(()=>alert('خطا'));
  }).catch(()=>alert('خطا'));
}
function rejectStudent(username){
  fetch(API_STATE).then(r=>r.json()).then(s=>{
    s.students = s.students.filter(x=>x.username!==username);
    fetch(API_STATE,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(s)}).then(()=>{ alert('رد شد'); loadPending(); }).catch(()=>alert('خطا'));
  }).catch(()=>alert('خطا'));
}
window.addEventListener('load',init);
