(function(){'use strict';
let client=null,refreshing=false,lastMatches=null,lastBulletins=null,lastMedals=null;
const $=s=>document.querySelector(s);
function competitionDay(){const d=new Date();return d.getFullYear()===2026&&d.getMonth()===10&&d.getDate()>=24&&d.getDate()<=27;}
function getClient(){if(client)return client;const cfg=window.JOCAD_CONFIG;if(!window.supabase||!cfg?.url||!cfg?.anonKey)return null;client=window.supabase.createClient(cfg.url,cfg.anonKey,{auth:{persistSession:false,autoRefreshToken:false,detectSessionInUrl:false},global:{headers:{'X-Client-Info':'jocad-public-v27'}}});return client;}
function status(message,error=false){const el=$('#jocadSyncStatus');if(el){el.textContent=message;el.dataset.error=String(error);}const note=$('.sync-note');if(note)note.title=message;}
async function sync(){if(refreshing||document.hidden)return;const c=getClient();if(!c)return;refreshing=true;try{
const [m,b,med]=await Promise.all([c.from('matches').select('id,num,day,home,away,sport,gender,score_a,score_b,status,result_details,winner_side'),c.from('bulletins').select('id,title,body,published_at').order('published_at',{ascending:false}),c.from('medals').select('course,gold,silver')]);
if(m.error)throw m.error;if(b.error)throw b.error;
const ms=JSON.stringify(m.data||[]),bs=JSON.stringify(b.data||[]);
if(ms!==lastMatches){const index=new Map(games.map(g=>[String(g.id),g]));for(const r of m.data||[]){const g=index.get(String(r.id));if(!g)continue;Object.assign(g,{num:String(r.num).padStart(2,'0'),day:String(r.day),home:r.home,away:r.away,sport:r.sport,gender:r.gender,scoreA:r.score_a===null?'':String(r.score_a),scoreB:r.score_b===null?'':String(r.score_b),status:r.status,result_details:r.result_details||{},winner_side:r.winner_side});}lastMatches=ms;render();}
if(bs!==lastBulletins){news=(b.data||[]).map(r=>({id:r.id,title:r.title,body:r.body,date:new Date(r.published_at).toLocaleDateString('pt-BR')}));lastBulletins=bs;renderNews();}
if(!med.error){const ds=JSON.stringify(med.data||[]);if(ds!==lastMedals){for(const r of med.data||[])medalData[r.course]={gold:r.gold,silver:r.silver};lastMedals=ds;renderMedals();}}
status('Última sincronização: '+new Date().toLocaleTimeString('pt-BR')+(competitionDay()?' · atualização a cada 30 s':''));
}catch(e){console.error('Sincronização pública JOCAD:',e);status('Falha na sincronização: '+e.message,true);}finally{refreshing=false;}}
window.jocadSyncPublic=sync;
function start(){const note=$('.sync-note');if(note&&!$('#jocadSyncStatus')){const span=document.createElement('span');span.id='jocadSyncStatus';span.className='sync-timestamp';span.setAttribute('role','status');span.setAttribute('aria-live','off');span.textContent=' · Aguardando sincronização';note.append(span);}sync();}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start);else start();
document.addEventListener('visibilitychange',()=>{if(!document.hidden)sync()});
setInterval(()=>{if(competitionDay()&&!document.hidden)sync()},30000);
})();
