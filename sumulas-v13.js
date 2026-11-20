(function(){
'use strict';
const $=id=>document.getElementById(id);
const kind=g=>{let s=(g.sport||'').toLowerCase();return s.includes('vôlei')||s.includes('volei')?'volley':s.includes('futsal')?'futsal':s.includes('handebol')?'handball':s.includes('basquete')?'basket':s.includes('queimada')?'dodge':'basic'};
function fields(g){const k=kind(g),d=g.result_details||{},a=g.home,b=g.away;
$('jocadScoreLegacy').hidden=k!=='basic';$('jocadRules').innerHTML='';
$('jocadRules').hidden=k==='basic';
$('jocadRules').dataset.kind=k;
if(k==='basic')return;
let periods=k==='volley'?(g.day==='27'?5:3):k==='dodge'?1:2;
let labels=k==='volley'?Array.from({length:periods},(_,i)=>`${i+1}º set`):k==='dodge'?['8 minutos']:['1º tempo','2º tempo'];
let p=d.periods||[];
$('jocadRules').innerHTML=`<h4>${escapeHTML(g.sport)} · ${escapeHTML(g.gender)}</h4><p>Preencha somente os períodos já disputados. Salve como “Em andamento” para publicar resultados parciais.</p><div class="jocad-period jocad-labels"><b>Etapa</b><b>${escapeHTML(a)}</b><b>${escapeHTML(b)}</b></div>`+labels.map((label,i)=>`<div class="jocad-period"><b>${label}</b><input type="number" min="0" inputmode="numeric" data-side="a" data-index="${i}" value="${p[i]?.a??''}" aria-label="${escapeHTML(a)} ${label}"><input type="number" min="0" inputmode="numeric" data-side="b" data-index="${i}" value="${p[i]?.b??''}" aria-label="${escapeHTML(b)} ${label}"></div>`).join('')+(k==='dodge'?`<p>Informe o número de integrantes queimados de cada equipe; a vencedora é a que tiver menos integrantes queimados. Em empate, registre a decisão no campo abaixo.</p>`:'')+`<label for="jocadTiebreak">Desempate / observação (quando aplicável)</label><input id="jocadTiebreak" value="${escapeHTML(d.tiebreak||'')}" placeholder="Ex.: pênaltis 3–2, sorteio, prorrogação" />`;
}
function escapeHTML(s){return String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
window.jocadRenderRules=fields;
window.jocadCollectRules=function(g){const k=kind(g);if(k==='basic'){g.result_details=g.result_details||{};return;}
const rows=[...$('jocadRules').querySelectorAll('.jocad-period:not(.jocad-labels)')];let periods=rows.map(r=>{const a=r.querySelector('[data-side=a]').value,b=r.querySelector('[data-side=b]').value;return {a:a===''?null:Number(a),b:b===''?null:Number(b)}});const filled=periods.filter(x=>x.a!==null&&x.b!==null);if(periods.some(x=>(x.a===null)!==(x.b===null)))throw Error('Preencha os dois lados de cada período.');
let A=0,B=0;
if(k==='volley'){for(let i=0;i<filled.length;i++){let x=filled[i],target=(i===2||i===4)?15:25;if(x.a===x.b||Math.max(x.a,x.b)<target||Math.abs(x.a-x.b)<2){if(g.status==='Finalizado')throw Error('Set '+(i+1)+' não atende à pontuação mínima e à diferença de dois pontos.');continue;}if(x.a>x.b)A++;else B++;}g.scoreA=String(A);g.scoreB=String(B);if(g.status==='Finalizado'&&Math.max(A,B)<(g.day==='27'?3:2))throw Error('Quantidade insuficiente de sets vencidos para finalizar.');}
else if(k==='dodge'){const x=filled[0];g.scoreA=x?String(x.a):'';g.scoreB=x?String(x.b):'';}
else{g.scoreA=filled.length?String(filled.reduce((s,x)=>s+x.a,0)):'';g.scoreB=filled.length?String(filled.reduce((s,x)=>s+x.b,0)):'';}
if(g.status==='Finalizado'&&!filled.length)throw Error('Registre os períodos antes de finalizar.');
g.result_details={periods,tiebreak:$('jocadTiebreak')?.value.trim()||'',kind:k};
};
window.jocadDetailHtml=function(g,featured=false){const d=g.result_details||{},p=Array.isArray(d.periods)?d.periods:[];const valid=p.map((x,i)=>({x,i})).filter(({x})=>x&&x.a!==null&&x.a!==undefined&&x.a!==''&&x.b!==null&&x.b!==undefined&&x.b!=='');const note=String(d.tiebreak||'').trim();if(!valid.length&&!note)return '';const k=d.kind||kind(g);const stage=i=>k==='volley'?`${i+1}º set`:k==='dodge'?(i===0?'8 minutos':`Etapa ${i+1}`):`${i+1}º tempo`;return `<div class="jocad-public-detail ${featured?'is-featured':''}"><div class="jocad-stage-title">${featured?'Detalhes da partida':'Parciais por etapa'}</div><div class="jocad-stage-list">${valid.map(({x,i})=>`<span class="jocad-stage"><span>${stage(i)}:</span><b>${escapeHTML(x.a)} × ${escapeHTML(x.b)}</b></span>`).join('')}</div>${note?`<div class="jocad-tiebreak">Desempate / observação: ${escapeHTML(note)}</div>`:''}</div>`};
})();
