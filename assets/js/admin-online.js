(function(){
'use strict';
let client=null,session=null,role=null;
const $=id=>document.getElementById(id);
function err(message){if($('authError'))$('authError').textContent=message;}
function ready(){if(!window.supabase||!window.JOCAD_CONFIG?.url||!window.JOCAD_CONFIG?.anonKey){err('Configure config.js e carregue a biblioteca Supabase.');return false;}if(!client)client=window.supabase.createClient(window.JOCAD_CONFIG.url,window.JOCAD_CONFIG.anonKey,{auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:true}});return true;}
async function authorize(user){if(!user)return false;const {data,error}=await client.from('staff_roles').select('role,active').eq('user_id',user.id).maybeSingle();if(error)throw error;role=data?.active?data.role:null;return !!role;}
async function refresh(){if(!ready())return;const {data}=await client.auth.getSession();session=data?.session||null;try{if(session&&!await authorize(session.user))session=null;}catch(e){console.warn('Autorização:',e);session=null;}const bar=$('sessionBar');if(bar)bar.style.display=session?'flex':'none';if($('sessionName')){let display=session?.user?.email||'';if(session){try{const {data}=await client.from('staff_roles').select('full_name').eq('user_id',session.user.id).maybeSingle();if(data?.full_name)display=data.full_name+' · '+session.user.email;}catch(e){console.warn('Nome do operador indisponível:',e);}}$('sessionName').textContent=display;}}
window.JOCAD_ONLINE={get client(){return client},get session(){return session},get role(){return role},refresh};
window.jocadOpenSecretaria=async function(){if(!ready()){$('authBox').classList.add('show');return;}await refresh();if(session){$('authBox').classList.remove('show');window.openAdmin();}else{$('authBox').classList.add('show');$('authEmail').focus();}};
document.addEventListener('DOMContentLoaded',async()=>{
$('authForm')?.addEventListener('submit',async e=>{e.preventDefault();if(!ready())return;const btn=e.target.querySelector('[type=submit]');btn.disabled=true;err('');try{const {data,error}=await client.auth.signInWithPassword({email:$('authEmail').value.trim(),password:$('authPassword').value});if(error)throw error;if(!await authorize(data.user)){await client.auth.signOut();throw Error('Usuário sem autorização ativa na Secretaria.');}await refresh();$('authBox').classList.remove('show');$('authPassword').value='';window.openAdmin();}catch(ex){err(ex.message);}finally{btn.disabled=false;}});
$('authCancel')?.addEventListener('click',()=>$('authBox').classList.remove('show'));
$('logoutBtn')?.addEventListener('click',async()=>{if(client)await client.auth.signOut();session=null;role=null;await refresh();window.closeAdmin();});
if(ready()){client.auth.onAuthStateChange(()=>{setTimeout(refresh,0)});await refresh();}
});
window.jocadSaveRemote=async function(g){if(!ready())throw Error('Supabase não configurado');await refresh();if(!session)throw Error('Sessão expirada. Faça login novamente.');const payload={score_a:g.scoreA===''?null:Number(g.scoreA),score_b:g.scoreB===''?null:Number(g.scoreB),status:g.status,result_details:g.result_details||{},winner_side:g.winner_side||null};const {error}=await client.from('matches').update(payload).eq('id',g.id);if(error)throw error;};
})();