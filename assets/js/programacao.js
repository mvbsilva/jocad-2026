/* JOCAD V35 — programação dinâmica; leitura pública, edição autenticada e RLS no Supabase. */
(function(){
'use strict';
const $=id=>document.getElementById(id);
const esc=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let activities=[],loaded=false,loading=false;
const online=()=>window.JOCAD_ONLINE;
const client=()=>online()?.client;
const feedback=(msg,error=false)=>{const el=$('agendaAdminFeedback');if(el){el.textContent=msg;el.style.color=error?'#a12626':'#286548';}};
const clock=t=>String(t||'').slice(0,5);
const sorted=items=>[...items].sort((a,b)=>a.start_time.localeCompare(b.start_time)||Number(a.id)-Number(b.id));
const displayTime=a=>clock(a.start_time).replace(':','h')+(a.end_time?' às '+clock(a.end_time).replace(':','h'):'');
function drawPublic(){
 if(!loaded)return;
 if(typeof tabs==='function')tabs('agendaDays',agendaDay,'setAgenda');
 const items=sorted(activities.filter(a=>String(a.day)===String(agendaDay)));
 $('events').innerHTML=items.length?items.map(a=>`<div class="event"><time>${esc(displayTime(a))}</time><div><b>${esc(a.title)}</b><small>${esc(a.category)} · ${esc(a.place)}${a.status!=='Programada'?' · '+esc(a.status):''}</small>${a.description?`<small>${esc(a.description)}</small>`:''}</div></div>`).join(''):'<p class="agenda-empty">Nenhuma atividade cadastrada para este dia.</p>';
}
function drawAdmin(){
 const day=$('agendaAdminDay')?.value||'24';const list=$('agendaAdminList');if(!list)return;
 const items=sorted(activities.filter(a=>String(a.day)===day));
 list.innerHTML=items.length?items.map(a=>`<div class="agenda-admin-item"><div><strong>${esc(displayTime(a))} · ${esc(a.title)}</strong><small>${esc(a.category)} · ${esc(a.place)} · ${esc(a.status)}</small></div><div class="agenda-admin-actions"><button type="button" data-agenda-edit="${a.id}" class="secondary">Editar</button><button type="button" data-agenda-delete="${a.id}" class="secondary">Excluir</button></div></div>`).join(''):'<p>Nenhuma atividade cadastrada neste dia.</p>';
}
async function fetchAll(silent=false){
 if(loading)return;const db=client();if(!db){if(!silent)feedback('Supabase indisponível. Verifique config.js.',true);return;}
 loading=true;
 try{
  const {data,error}=await db.from('schedule_activities').select('id,day,start_time,end_time,title,category,place,status,description').order('day').order('start_time').order('id');
  if(error)throw error;
  activities=data||[];loaded=true;drawPublic();drawAdmin();if(!silent)feedback('Programação sincronizada.');
 }catch(e){if(!silent)feedback('Não foi possível carregar a programação: '+e.message,true);console.warn('JOCAD programação:',e.message);}
 finally{loading=false;}
}
function clearForm(){
 $('agendaAdminForm').reset();$('agendaEditId').value='';$('agendaDay').value=$('agendaAdminDay').value;$('agendaFormTitle').textContent='Nova atividade';
}
function edit(id){
 const a=activities.find(x=>String(x.id)===String(id));if(!a)return;
 $('agendaEditId').value=a.id;$('agendaDay').value=a.day;$('agendaTime').value=clock(a.start_time);$('agendaEnd').value=clock(a.end_time);$('agendaTitle').value=a.title;$('agendaCategory').value=a.category;$('agendaPlace').value=a.place;$('agendaStatus').value=a.status;$('agendaDescription').value=a.description||'';
 $('agendaFormTitle').textContent='Editar atividade';$('agendaAdminForm').scrollIntoView({behavior:'smooth',block:'nearest'});
}
function requireStaff(){const o=online();if(!o?.client||!o.session||!['admin','staff'].includes(o.role))throw Error('Entre na Secretaria com uma conta autorizada.');return o;}
async function save(e){
 e.preventDefault();const btn=$('agendaSave');
 try{
  const o=requireStaff();const id=$('agendaEditId').value;
  const payload={day:$('agendaDay').value,start_time:$('agendaTime').value,end_time:$('agendaEnd').value||null,title:$('agendaTitle').value.trim(),category:$('agendaCategory').value,place:$('agendaPlace').value.trim(),status:$('agendaStatus').value,description:$('agendaDescription').value.trim()};
  if(payload.title.length<2||payload.place.length<2)throw Error('Informe atividade e local com pelo menos dois caracteres.');
  if(payload.end_time&&payload.end_time<=payload.start_time)throw Error('O horário final deve ser posterior ao inicial.');
  btn.disabled=true;feedback('Salvando atividade…');
  const query=id?o.client.from('schedule_activities').update(payload).eq('id',Number(id)).select('id'):o.client.from('schedule_activities').insert({...payload,created_by:o.session.user.id}).select('id');
  const {data,error}=await query;if(error)throw error;if(!data?.length)throw Error('Nenhuma atividade foi alterada. Confira suas permissões.');
  $('agendaAdminDay').value=payload.day;clearForm();await fetchAll(true);feedback('Atividade salva com sucesso.');
 }catch(err){feedback('Não foi possível salvar: '+err.message,true);}finally{btn.disabled=false;}
}
async function remove(id){
 const a=activities.find(x=>String(x.id)===String(id));if(!a)return;
 if(!confirm(`Excluir a atividade “${a.title}” de ${a.day}/11 às ${clock(a.start_time)}? Esta ação será registrada na auditoria.`))return;
 try{const o=requireStaff();feedback('Excluindo atividade…');const {data,error}=await o.client.from('schedule_activities').delete().eq('id',Number(id)).select('id');if(error)throw error;if(!data?.length)throw Error('Exclusão não autorizada.');await fetchAll(true);feedback('Atividade excluída.');}catch(e){feedback('Não foi possível excluir: '+e.message,true);}
}
// A função global já é usada pelas abas da Home.
window.renderAgenda=drawPublic;
$('agendaAdminDay')?.addEventListener('change',()=>{drawAdmin();if(!$('agendaEditId').value)$('agendaDay').value=$('agendaAdminDay').value;});
$('agendaAdminForm')?.addEventListener('submit',save);
$('agendaClear')?.addEventListener('click',clearForm);
$('agendaAdminList')?.addEventListener('click',e=>{const editBtn=e.target.closest('[data-agenda-edit]'),deleteBtn=e.target.closest('[data-agenda-delete]');if(editBtn)edit(editBtn.dataset.agendaEdit);if(deleteBtn)remove(deleteBtn.dataset.agendaDelete);});
document.querySelector('[data-sec-tab="programacao"]')?.addEventListener('click',()=>fetchAll());
const originalOpen=window.openAdmin;
window.openAdmin=function(){originalOpen();fetchAll(true);};
// Primeira leitura e sincronização periódica durante o evento.
document.addEventListener('DOMContentLoaded',()=>fetchAll(true));
setInterval(()=>{if(!document.hidden)fetchAll(true);},30000);
})();
