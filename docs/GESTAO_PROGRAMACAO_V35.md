# V35 — Gestão da programação

A Secretaria possui aba **Gestão da programação** para incluir, editar e excluir atividades de 24 a 27/11/2026. Todas as atividades são editáveis, inclusive **almoço (11h às 13h)** e **lanche (18h às 19h)** em cada dia.

## Publicação

1. Faça backup do Supabase e da V34 antes de qualquer mudança.
2. Execute **database/migrations/0009-gestao-programacao.sql** no SQL Editor do Supabase, após 0008. A migração cria a tabela, regras RLS, auditoria e 28 atividades da programação oficial. A importação inicial ocorre apenas quando a tabela está vazia.
3. Publique todos os arquivos do repositório V35 no GitHub Pages, preservando o `config.js` atual.
4. Acesse a Secretaria e abra **Gestão da programação**; teste cadastro, edição e exclusão e confirme a atualização na Home.

## Segurança e operação

Leitura pública e alterações apenas por usuários autorizados em `staff_roles` através de `public.is_staff()`. Ações são registradas em `audit_log`. A interface atualiza a agenda a cada 30 segundos quando a aba está visível. Os confrontos e resultados não são modificados por este módulo.

**Atenção:** não há sincronização de alterações com uma nova versão do PDF; após a primeira carga, a tabela Supabase é a fonte oficial. A migração não deve ser repetida para reimportar a programação, pois isso pode gerar duplicatas caso a tabela tenha sido esvaziada intencionalmente.
