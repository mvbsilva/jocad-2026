# Limpeza dos dados do JOCAD 2026

Três scripts **independentes**, executados manualmente no Supabase SQL Editor como administrador. **Faça backup** antes de executar. Cada SQL usa uma transação e exige substituir `SUBSTITUA_PELA_CONFIRMACAO` pelo token indicado no cabeçalho. Sem confirmação, a operação aborta.

1. **01_limpar_resultados_jogos.sql**: apaga placares, detalhes de etapas, vencedores e redefine status para `Programado`. Mantém os 36 confrontos, equipes, modalidades, categorias e datas.
2. **02_limpar_boletins.sql**: exclui todos os boletins. Não altera jogos nem medalhas.
3. **03_zerar_dados_operacionais.sql**: executa as duas operações anteriores e zera ouro e prata. Mantém os cursos do quadro de medalhas.

**Zerar tudo significa zerar dados operacionais**, não excluir tabelas, contas, permissões, confrontos ou o histórico `audit_log`. A auditoria permanece ativa e registra as operações conforme os triggers existentes. IDs de boletins não são reiniciados.

Depois de executar, recarregue o portal; jogos fixados no navegador continuarão fixados, mas sem resultados.

## Conferência

```sql
SELECT count(*) AS jogos,
 count(*) FILTER (WHERE score_a IS NOT NULL OR score_b IS NOT NULL OR status <> 'Programado' OR result_details <> '{}'::jsonb OR winner_side IS NOT NULL) AS jogos_com_resultado
FROM public.matches;
SELECT count(*) AS boletins FROM public.bulletins;
SELECT count(*) AS categorias, sum(gold) AS ouros, sum(silver) AS pratas FROM public.medals;
```
