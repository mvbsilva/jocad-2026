(function(){
'use strict';
const $=id=>document.getElementById(id);
const originalOpen=window.openAdmin,originalClose=window.closeAdmin,originalLoad=window.loadGame,originalFilter=window.filterSecretariaGames;
window.openAdmin=function(){originalOpen();document.body.classList.add('admin-open');$('modal').querySelector('.sec-main').scrollTop=0;};
window.closeAdmin=function(){originalClose();document.body.classList.remove('admin-open');};
window.loadGame=function(){originalLoad();const g=games.find(x=>String(x.id)===String($('editGame').value));if(!g)return;const la=document.querySelector('label[for=scoreA]'),lb=document.querySelector('label[for=scoreB]');if(la)la.textContent=jocadTeamName(g,'home');if(lb)lb.textContent=jocadTeamName(g,'away');window.jocadRenderRules(g);};
window.filterSecretariaGames=function(){originalFilter();const select=$('editGame');[...select.options].forEach(opt=>{const g=games.find(x=>String(x.id)===opt.value);if(g)opt.textContent=`${g.day}/11 · Jogo ${g.num} · ${g.sport} · ${g.gender} · ${jocadTeamName(g,'home')} × ${jocadTeamName(g,'away')}`;});};
window.saveGame=async function(){const g=games.find(x=>String(x.id)===String($('editGame').value));if(!g)return;const before=structuredClone(g);const btn=$('secSaveResult');try{g.status=$('editStatus').value;g.scoreA=$('scoreA').value;g.scoreB=$('scoreB').value;window.jocadCollectRules(g);if(g.status==='Finalizado'&&(['home','away'].some(side=>jocadTeamInfo(g,side).pending)))throw Error('Aguarde a definição dos vencedores dos jogos anteriores.');if(g.status==='Finalizado'&&(g.scoreA===''||g.scoreB===''))throw Error('Informe o placar para finalizar a partida.');btn.disabled=true;btn.textContent='Salvando…';await window.jocadSaveRemote(g);localStorage.setItem('jocadGamesV10',JSON.stringify(games));render();window.filterSecretariaGames();alert(g.status==='Em andamento'?'Parcial salvo e publicado.':'Resultado salvo.');}catch(e){Object.assign(g,before);alert('Não foi possível salvar: '+e.message);}finally{btn.disabled=false;btn.textContent='Salvar andamento / resultado';}};
window.detailHtml=function(g){return window.jocadDetailHtml(g);};
const originalRender=window.render;window.render=function(){originalRender();};
document.addEventListener('DOMContentLoaded',()=>{
const link=document.querySelector('.admin-footer-link');if(link)link.setAttribute('onclick','jocadOpenSecretaria()');
$('modal')?.addEventListener('keydown',e=>{if(e.key==='Escape')window.closeAdmin()});
window.filterSecretariaGames();
});
})();