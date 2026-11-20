# JOCAD V14 — Secretaria

## Publicação
1. Copie os arquivos para o GitHub Pages.
2. Crie `config.js` a partir de `config.example.js`, usando URL e chave **publishable** do seu Supabase. Não use `service_role`.
3. Execute antes a migração V13, se ainda não aplicada.
4. Teste login, reabertura, scroll, jogo em andamento, súmulas e persistência após recarregar em outro navegador.

## Notas
- O código da V13 recebido estava sem `admin-online.js` e `sumulas-v13.js`; esta versão os inclui e reconstitui os fluxos principais.
- Os 36 confrontos originais foram preservados.
- Para salvamento remoto, a tabela `matches` deve ter a coluna `id` correspondente aos jogos e colunas `score_a`, `score_b`, `status`, `result_details`, `winner_side`. Se o esquema diferir, adapte o mapeamento em `admin-online.js`.
- Acesso é condicionado a Supabase Auth + `staff_roles.active`; revise as políticas RLS para que apenas operadores ativos possam atualizar.
- Não foi realizado teste de gravação no projeto Supabase do usuário.
