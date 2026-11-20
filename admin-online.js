/* JOCAD 2026 — integração online. A segurança é aplicada pelas políticas RLS do banco. */
(()=>{
'use strict';
const cfg=window.JOCAD_CONFIG||{};
const ready=Boolean(cfg.url&&cfg.anonKey&&window.supabase?.createClient);
const authBox=document.getElementById('authBox'), authError=document.getElementById('authError');
const adminButtons=[...document.querySelectorAll('[onclick="openAdmin()"],[onclick="toggleMedalEditor()"]')];
const status=document.createElement('div');status.id='onlineStatus';status.setAttribute('role','status');status.style.cssText='max-width:1180px;margin:12px auto;padding:10px 16px;border-radius:9px;background:#fff;border:1px solid #e0e8e1;font-size:12px;color:#56665a';
status.textContent=ready?'Conectando aos resultados oficiais…':'Prévia não conectada: configure o Supabase para ativar os dados públicos e o acesso da secretaria.';
document.querySelector('header')?.after(status);
let client=null,user=null,role=null,sub=null;
function report(message){status.textContent=message}
function showLogin(){authError.textContent='';authBox.classList.add('show')}
function hideLogin(){authBox.classList.remove('show')}
function authorized(){return Boolean(user&&role)}
function updateAccess(){
 const bar=document.getElementById('sessionBar');bar.style.display=authorized()?'block':'none';
 document.getElementById('sessionName').textContent=authorized()?`${role==='admin'?'Administrador':'Operador'} · ${user.email}`:'';
 adminButtons.forEach(b=>{b.style.display=authorized()?'':'none'});
 const editor=document.getElementById('medalEditor');if(!authorized())editor?.classList.remove('show');
}
// Keep original functions for UI rendering only. All writes are replaced by authenticated operations.
const originalOpen=window.openAdmin,originalClose=window.closeAdmin,originalLoad=window.loadGame;
window.openAdmin=()=>{if(!ready){alert('Configure o Supabase para habilitar a secretaria.');return}if(!authorized()){showLogin();return}originalOpen()};
window.toggleMedalEditor=()=>{if(!ready){alert('Configure o Supabase.');return}if(!authorized()){showLogin();return}document.getElementById('medalEditor').classList.toggle('show')};
window.saveGame=async()=>{
 if(!authorized())return showLogin();
 const id=document.getElementById('editGame').value,scoreA=document.getElementById('scoreA').value,scoreB=document.getElementById('scoreB').value,gameStatus=document.getElementById('editStatus').value;
 if((scoreA==='')!==(scoreB===''))return alert('Informe os dois placares ou deixe ambos vazios.');
 if(gameStatus==='Finalizado'&&(scoreA===''||scoreB===''))return alert('Informe o placar antes de finalizar.');
 if([scoreA,scoreB].some(x=>x!==''&&(!/^\d+$/.test(x)||Number(x)>999)))return alert('Informe placares inteiros de 0 a 999.');
 const {error}=await client.from('matches').update({score_a:scoreA===''?null:Number(scoreA),score_b:scoreB===''?null:Number(scoreB),status:gameStatus}).eq('id',id);
 if(error)return alert('Não foi possível salvar: '+error.message);
 originalClose();await refresh();
};
window.saveNews=async()=>{
 if(!authorized())return showLogin();
 const title=document.getElementById('newsTitle').value.trim(),body=document.getElementById('newsBody').value.trim();
 if(!title||!body||title.length>160||body.length>6000)return alert('Informe título (até 160 caracteres) e texto (até 6.000).');
 const {error}=await client.from('bulletins').insert({title,body,author_id:user.id});
 if(error)return alert('Não foi possível publicar: '+error.message);
 document.getElementById('newsTitle').value='';document.getElementById('newsBody').value='';originalClose();await refresh();
};
window.saveMedals=async()=>{
 if(!authorized())return showLogin();
 const course=document.getElementById('medalCourse').value,gold=Number(document.getElementById('medalGold').value),silver=Number(document.getElementById('medalSilver').value);
 if(![gold,silver].every(x=>Number.isSafeInteger(x)&&x>=0&&x<=999))return alert('Informe números inteiros entre 0 e 999.');
 const {error}=await client.from('medals').update({gold,silver}).eq('course',course);
 if(error)return alert('Não foi possível salvar medalhas: '+error.message);
 await refresh();window.loadMedalCourse();
};
// Block local backup import/export from becoming a way to alter public results.
window.importJocadBackup=()=>alert('Importação local desabilitada na versão online.');
window.exportJocadBackup=()=>alert('Para backup oficial, utilize os recursos de exportação do Supabase.');
async function refresh(){
 if(!ready)return;
 const [gm,bl,md]=await Promise.all([
  client.from('matches').select('id,num,day,home,away,sport,gender,score_a,score_b,status').order('num'),
  client.from('bulletins').select('id,title,body,published_at').order('published_at',{ascending:false}).limit(100),
  client.from('medals').select('course,gold,silver')
 ]);
 if(gm.error||bl.error||md.error){report('Falha na consulta online. Exibindo programação inicial local, sem resultados oficiais sincronizados.');return}
 if(!gm.data.length || !md.data.length){report('Banco ainda sem carga inicial: exibindo os 36 jogos e os 9 cursos da programação local. Execute supabase_schema.sql no projeto antes da publicação.');return}
 games=gm.data.map(x=>({id:x.id,num:String(x.num).padStart(2,'0'),day:String(x.day),home:x.home,away:x.away,sport:x.sport,gender:x.gender,scoreA:x.score_a===null?'':String(x.score_a),scoreB:x.score_b===null?'':String(x.score_b),status:x.status}));
 news=bl.data.map(x=>({title:x.title,body:x.body,date:new Date(x.published_at).toLocaleDateString('pt-BR')}));
 medalData=Object.fromEntries(md.data.map(x=>[x.course,{gold:x.gold,silver:x.silver}]));
 render();renderNews();renderMedals();
 report('Dados oficiais sincronizados · JOCAD 2026');
 document.getElementById('medalStatus').textContent='Classificação oficial por cursos/servidores, sincronizada com a secretaria.';
}
async function syncRole(){
 const session=await client.auth.getSession();user=session.data.session?.user||null;role=null;
 if(user){const r=await client.from('staff_roles').select('role,active').eq('user_id',user.id).maybeSingle();if(!r.error&&r.data?.active)role=r.data.role}
 updateAccess();
}
document.getElementById('authCancel').onclick=hideLogin;
document.getElementById('logoutBtn').onclick=async()=>{if(client)await client.auth.signOut();user=null;role=null;updateAccess();originalClose();report('Sessão encerrada. Dados públicos disponíveis.');};
document.getElementById('authForm').onsubmit=async e=>{
 e.preventDefault();if(!ready)return;
 authError.textContent='Autenticando…';
 const email=document.getElementById('authEmail').value.trim(),password=document.getElementById('authPassword').value;
 const {error}=await client.auth.signInWithPassword({email,password});
 document.getElementById('authPassword').value='';
 if(error){authError.textContent='Credenciais inválidas ou conta indisponível.';return}
 await syncRole();
 if(!authorized()){authError.textContent='Conta sem permissão ativa de secretaria.';await client.auth.signOut();return}
 hideLogin();originalOpen();
};
updateAccess();
if(!ready)return;
client=window.supabase.createClient(cfg.url,cfg.anonKey,{auth:{persistSession:true,autoRefreshToken:true}});
client.auth.onAuthStateChange(()=>{setTimeout(()=>syncRole(),0)});
Promise.all([syncRole(),refresh()]).then(()=>{
 sub=client.channel('jocad-public-updates')
 .on('postgres_changes',{event:'*',schema:'public',table:'matches'},refresh)
 .on('postgres_changes',{event:'*',schema:'public',table:'bulletins'},refresh)
 .on('postgres_changes',{event:'*',schema:'public',table:'medals'},refresh)
 .subscribe();
 // Fallback for browsers/networks without realtime delivery.
 document.addEventListener('visibilitychange',()=>{if(!document.hidden)refresh()});
}).catch(()=>report('Falha na conexão. Confira a configuração do Supabase.'));
})();
