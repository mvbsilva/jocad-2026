# V37 — implantação em produção

1. Faça backup do banco e preserve o config.js atual. Confira os triggers existentes de matches e o backup antes de executar SQL. Não execute cargas, resets ou migrações anteriores.
2. Execute apenas database/migrations/0010-acompanhamento-ao-vivo.sql no SQL Editor. A transação tem limite de espera de bloqueio de 5 segundos; se falhar, investigue antes de repetir.
3. Confira a consulta de validação ao final. A última finalização fornecida na auditoria foi jogo 24-10, às 21:09:17 UTC (18:09:17 local), se ainda finalizado e se não houver evento posterior. Jogos finalizados sem histórico ficam sem timestamp e não são escolhidos como último resultado. Registros anteriores ao evento não são apagados; se ainda finalizados, podem aparecer conforme a ordem registrada.
4. Publique index.html, assets/js/portal.js e assets/css/site.css; inclua a migração e documentação no repositório. Preserve config.js. O pacote completo também pode ser usado sem substituir a configuração.
5. Confira a Home e a Secretaria. Não altere resultados reais para testar. Use ambiente de teste para transições de status, reabertura e correções. O frontend tenta a consulta antiga caso a coluna ainda não exista; nesse caso não mostra último resultado.
6. Rollback de frontend: restaure os três arquivos da V36. Não é necessário remover a coluna ou trigger.

A migração atualiza somente finished_at nos jogos atualmente finalizados com histórico. Triggers preexistentes podem registrar auditoria ou atualizar metadados de edição. A trigger nova preserva finished_at em correções de placar e limpa o campo ao reabrir ou resetar um jogo. Não altera RLS. Os scripts de reset existentes continuam destrutivos e não devem ser executados durante o evento.

Validação local: sintaxe JavaScript, referências e seleção de cards com dados sintéticos. SQL não executado contra PostgreSQL/Supabase; teste visual e integração de produção pendentes.
