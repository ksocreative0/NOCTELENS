const SUPABASE_READY = window.SUPABASE_CONFIG?.url && window.SUPABASE_CONFIG?.anonKey && !window.SUPABASE_CONFIG.url.includes('YOUR_') && !window.SUPABASE_CONFIG.anonKey.includes('YOUR_');
const publicDb = SUPABASE_READY ? window.supabase.createClient(window.SUPABASE_CONFIG.url, window.SUPABASE_CONFIG.anonKey) : null;
const escapeHtml = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
async function renderProjects(filter='all') {
 const grid=document.getElementById('projectGrid'); if(!grid)return;
 if(!publicDb){grid.innerHTML='<div class="empty-projects">Connect the Supabase project to display published work here.</div>';return;}
 const {data,error}=await publicDb.from('projects').select('*').eq('status','published').order('created_at',{ascending:false});
 if(error){console.error(error);grid.innerHTML='<div class="empty-projects">Projects could not be loaded just now.</div>';return;}
 const rows=(data||[]).filter(p=>filter==='all'||p.category===filter);
 grid.innerHTML=rows.length?rows.map(p=>{const title=escapeHtml(p.title||'Untitled project');const label=p.category==='web'?'Website development':'Video editing & videography';const media=p.media_url?(p.media_type==='video'?`<video src="${escapeHtml(p.media_url)}" controls playsinline preload="metadata"></video>`:`<img src="${escapeHtml(p.media_url)}" alt="${title}" loading="lazy">`):'<div class="media-empty">Project preview</div>';return `<article class="project-card"><div class="project-media">${media}</div><div class="project-info"><div class="project-meta">${label}</div><h3>${title}</h3><p>${escapeHtml(p.description||'')}</p>${p.tools?`<small class="project-tools">${escapeHtml(p.tools)}</small>`:''}</div>${p.url?`<a class="project-link" href="${escapeHtml(p.url)}" target="_blank" rel="noopener">View project ↗</a>`:''}</article>`}).join(''):'<div class="empty-projects">No published projects yet. Check back soon.</div>';
}
document.addEventListener('DOMContentLoaded',()=>{
 renderProjects();
 document.querySelectorAll('.filter').forEach(btn=>btn.addEventListener('click',()=>{document.querySelectorAll('.filter').forEach(b=>b.classList.remove('active'));btn.classList.add('active');renderProjects(btn.dataset.filter)}));
 const menu=document.getElementById('menuToggle'),nav=document.getElementById('mainNav');menu?.addEventListener('click',()=>nav.classList.toggle('open'));nav?.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>nav.classList.remove('open')));
 const service=document.getElementById('serviceChoice'),videoFields=document.getElementById('videoFields');function updateVideoFields(){videoFields?.classList.toggle('show',['Video editing','Videography'].includes(service?.value));}service?.addEventListener('change',updateVideoFields);updateVideoFields();
 const form=document.getElementById('bookingForm'),feedback=document.getElementById('formFeedback');form?.addEventListener('submit',e=>{if(form.action.includes('YOUR_FORMSPREE_ID')){e.preventDefault();feedback.textContent='Add your Formspree form endpoint to the form action before accepting enquiries.';feedback.style.color='#a33d57';}});
 const date=document.querySelector('input[name="Preferred date"]');if(date)date.min=new Date().toISOString().split('T')[0];const eventDate=document.querySelector('input[name="Event or shoot date"]');if(eventDate)eventDate.min=new Date().toISOString().split('T')[0];
 document.getElementById('year').textContent=new Date().getFullYear();
});
