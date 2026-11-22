/* Componente: admin-online.js */
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

/* Componente: sumulas-v13.js */
(function(){
'use strict';
const $=id=>document.getElementById(id);
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const kind=g=>{const s=(g.sport||'').toLowerCase();return s.includes('vôlei')||s.includes('volei')||s.includes('voleibol')?'volley':s.includes('futsal')?'futsal':s.includes('handebol')?'handball':s.includes('basquete')?'basket':s.includes('queimada')?'dodge':'basic'};
// A programação original identifica as finais coletivas no dia 27.
const isFinal=g=>Number(g.day)===27 || /final/i.test(String(g.phase||g.round||g.stage||''));
const number=(value)=>value===''||value===null||value===undefined?null:Number(value);
function fields(g){
 const k=kind(g),d=g.result_details||{},a=jocadTeamName(g,'home'),b=jocadTeamName(g,'away');
 $('jocadScoreLegacy').hidden=k!=='basic';$('jocadRules').hidden=k==='basic';$('jocadRules').dataset.kind=k;
 if(k==='basic'){$('jocadRules').innerHTML='';return;}
 const final=isFinal(g),count=k==='volley'?(final?5:3):k==='dodge'?1:2;
 const labels=k==='volley'?Array.from({length:count},(_,i)=>final&&i===4?'5º set · tie-break (15 pontos)':!final&&i===2?'3º set · desempate (15 pontos)':`${i+1}º set (25 pontos)`):k==='dodge'?['8 minutos']:['1º tempo','2º tempo'];
 const periods=Array.isArray(d.periods)?d.periods:[];
 const rows=labels.map((label,i)=>`<div class="jocad-period"><b>${esc(label)}</b><input type="number" min="0" inputmode="numeric" data-side="a" data-index="${i}" value="${esc(periods[i]?.a??'')}" aria-label="${esc(a)} ${esc(label)}"><input type="number" min="0" inputmode="numeric" data-side="b" data-index="${i}" value="${esc(periods[i]?.b??'')}" aria-label="${esc(b)} ${esc(label)}"></div>`).join('');
 const penalties=k==='futsal'?`<div class="jocad-penalties"><h5>Desempate por pênaltis (se necessário)</h5><p>Em caso de empate após os dois tempos, registre os gols nas cobranças. O edital prevê uma série inicial de três cobranças por equipe.</p><div class="jocad-period jocad-labels"><b>Pênaltis</b><b>${esc(a)}</b><b>${esc(b)}</b></div><div class="jocad-period"><b>Cobranças convertidas</b><input id="jocadPenaltyA" type="number" min="0" inputmode="numeric" value="${esc(d.penalties?.a??'')}" aria-label="Pênaltis ${esc(a)}"><input id="jocadPenaltyB" type="number" min="0" inputmode="numeric" value="${esc(d.penalties?.b??'')}" aria-label="Pênaltis ${esc(b)}"></div></div>`:'';
 $('jocadRules').innerHTML=`<h4>${esc(g.sport)} · ${esc(g.gender)}</h4><p>${k==='volley'?(final?'Final: quatro sets regulares e um possível 5º set de desempate, já disponíveis.':'Partida não final: dois sets regulares e um possível 3º set de desempate, já disponíveis.'):'Preencha os períodos disputados.'} Para divulgar resultados parciais, selecione “Em andamento”.</p><div class="jocad-period jocad-labels"><b>Etapa</b><b>${esc(a)}</b><b>${esc(b)}</b></div>${rows}${penalties}${k==='dodge'?'<p>Informe os integrantes queimados de cada equipe: vence quem tiver menos integrantes queimados.</p>':''}<label for="jocadTiebreak">Observação / outros desempates (quando aplicável)</label><input id="jocadTiebreak" value="${esc(d.tiebreak||'')}" placeholder="Ex.: prorrogação, sorteio, observações" />`;
}
window.jocadRenderRules=fields;
window.jocadCollectRules=function(g){
 const k=kind(g);if(k==='basic'){g.result_details=g.result_details||{};return;}
 const rows=[...$('jocadRules').querySelectorAll('.jocad-period:not(.jocad-labels)')].filter(r=>r.querySelector('[data-side="a"]'));
 const periods=rows.map(r=>({a:number(r.querySelector('[data-side="a"]').value),b:number(r.querySelector('[data-side="b"]').value)}));
 if(periods.some(x=>(x.a===null)!==(x.b===null)))throw Error('Preencha os dois lados de cada etapa.');
 const filled=periods.filter(x=>x.a!==null&&x.b!==null);
 const final=isFinal(g),required=final?3:2;
 let A=0,B=0;
 if(k==='volley'){
  let decided=false;
  for(let i=0;i<periods.length;i++){
   const x=periods[i];if(x.a===null)continue;
   if(decided&&g.status==='Finalizado')throw Error('Há sets preenchidos após a definição da partida.');
   const target=(final?i===4:i===2)?15:25;
   const complete=x.a!==x.b&&Math.max(x.a,x.b)>=target&&Math.abs(x.a-x.b)>=2;
   if(!complete){if(g.status==='Finalizado')throw Error(`O ${i+1}º set precisa atingir ${target} pontos e diferença mínima de dois.`);continue;}
   if(x.a>x.b)A++;else B++;
   if(Math.max(A,B)===required)decided=true;
  }
  g.scoreA=String(A);g.scoreB=String(B);
  if(g.status==='Finalizado'&&Math.max(A,B)!==required)throw Error(`Para finalizar, uma equipe precisa vencer ${required} sets.`);
 }else if(k==='dodge'){
  const x=filled[0];g.scoreA=x?String(x.a):'';g.scoreB=x?String(x.b):'';
 }else{
  g.scoreA=filled.length?String(filled.reduce((s,x)=>s+x.a,0)):'';
  g.scoreB=filled.length?String(filled.reduce((s,x)=>s+x.b,0)):'';
 }
 if(g.status==='Finalizado'&&!filled.length)throw Error('Registre os períodos antes de finalizar.');
 let penalties=null;
 if(k==='futsal'){
  const a=number($('jocadPenaltyA').value),b=number($('jocadPenaltyB').value);
  if((a===null)!==(b===null))throw Error('Informe os pênaltis das duas equipes.');
  if(a!==null)penalties={a,b};
  if(g.status==='Finalizado'&&g.scoreA===g.scoreB&&(!penalties||a===b))throw Error('Empate no futsal: informe o desempate por pênaltis, com vencedor definido.');
 }
 g.result_details={...(g.result_details||{}),periods,penalties,tiebreak:$('jocadTiebreak')?.value.trim()||'',kind:k};
};
window.jocadDetailHtml=function(g,featured=false){
 const d=g.result_details||{},p=Array.isArray(d.periods)?d.periods:[],k=d.kind||kind(g),final=isFinal(g);
 const valid=p.map((x,i)=>({x,i})).filter(({x})=>x&&x.a!==null&&x.a!==undefined&&x.a!==''&&x.b!==null&&x.b!==undefined&&x.b!=='');
 const note=String(d.tiebreak||'').trim();const penalties=d.penalties;
 if(!valid.length&&!note&&!penalties)return '';
 const stage=i=>k==='volley'?(final&&i===4?'Tie-break (5º set)':!final&&i===2?'Desempate (3º set)':`${i+1}º set`):k==='dodge'?'8 minutos':`${i+1}º tempo`;
 const penaltyHtml=penalties&&penalties.a!==null&&penalties.b!==null?`<div class="jocad-tiebreak">Pênaltis: <b>${esc(penalties.a)} × ${esc(penalties.b)}</b></div>`:'';
 return `<div class="jocad-public-detail ${featured?'is-featured':''}"><div class="jocad-stage-title">${featured?'Detalhes da partida':'Parciais por etapa'}</div><div class="jocad-stage-list">${valid.map(({x,i})=>`<span class="jocad-stage"><span>${esc(stage(i))}:</span><b>${esc(x.a)} × ${esc(x.b)}</b></span>`).join('')}</div>${penaltyHtml}${note?`<div class="jocad-tiebreak">Observação: ${esc(note)}</div>`:''}</div>`;
};
})();

