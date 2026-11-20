(function(){'use strict';
let client=null,refreshing=false;
function getClient(){if(client)return client;const cfg=window.JOCAD_CONFIG;if(!window.supabase||!cfg?.url||!cfg?.anonKey)return null;client=window.supabase.createClient(cfg.url,cfg.anonKey,{auth:{persistSession:false,autoRefreshToken:false,detectSessionInUrl:false},global:{headers:{'X-Client-Info':'jocad-public-v17'}}});return client;}
async function sync(){if(refreshing)return;const c=getClient();if(!c)return;refreshing=true;try{
const [m,b,med]=await Promise.all([c.from('matches').select('id,num,day,home,away,sport,gender,score_a,score_b,status,result_details,winner_side'),c.from('bulletins').select('id,title,body,published_at').order('published_at',{ascending:false}),c.from('medals').select('course,gold,silver')]);
if(m.error)throw m.error;if(b.error)throw b.error;
const index=new Map(games.map(g=>[String(g.id),g]));for(const r of m.data||[]){const g=index.get(String(r.id));if(!g)continue;Object.assign(g,{num:String(r.num).padStart(2,'0'),day:String(r.day),home:r.home,away:r.away,sport:r.sport,gender:r.gender,scoreA:r.score_a===null?'':String(r.score_a),scoreB:r.score_b===null?'':String(r.score_b),status:r.status,result_details:r.result_details||{},winner_side:r.winner_side});}
news=(b.data||[]).map(r=>({id:r.id,title:r.title,body:r.body,date:new Date(r.published_at).toLocaleDateString('pt-BR')}));
if(!med.error){for(const r of med.data||[])medalData[r.course]={gold:r.gold,silver:r.silver};renderMedals();}
render();renderNews();
const el=document.querySelector('.sync-note');if(el)el.title='Última consulta ao banco: '+new Date().toLocaleTimeString('pt-BR');
}catch(e){console.error('Sincronização pública JOCAD:',e);const el=document.querySelector('.sync-note');if(el)el.title='Não foi possível sincronizar os dados: '+e.message;}finally{refreshing=false;}}
window.jocadSyncPublic=sync;
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',sync);else sync();
document.addEventListener('visibilitychange',()=>{if(!document.hidden)sync()});setInterval(()=>{if(!document.hidden)sync()},30000);
})();
