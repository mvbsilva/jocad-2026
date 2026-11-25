# V40 — Classificação geral

Faça backup. Execute exclusivamente `database/migrations/0011-classificacao-geral.sql` no SQL Editor após confirmar a V39 e as migrações anteriores. Não execute seeds ou resets. Depois publique index.html, assets/js/awards.js, assets/js/portal.js e assets/css/site.css juntos. Preserve config.js.

A classificação soma 6 menos a colocação (1 a 5), somente conquistas confirmadas. Desempate lexicográfico pela quantidade de cada colocação. Empate integral compartilha posição (1,1,3). Cursos sem pontos não recebem posição. Servidores participam. Medalhas são opcionais, ouro/prata apenas, conforme premiação efetiva. A classificação por medalhas permanece alternativa. Use nome de atividade padronizado, incluindo categoria/faixa quando houver; o índice impede duas colocações iguais confirmadas na mesma atividade/eixo/naipe. Não registre vitórias isoladas. Cancelamento preserva auditoria. A migração conserva registros anteriores e infere colocação de ouro/prata, se existirem.

Validação após migração: SELECT count(*) FROM public.medal_awards; SELECT count(*) FROM public.matches; SELECT count(*) FROM public.bulletins; compare com os totais anteriores. Teste registro, edição, cancelamento e sincronização em ambiente de teste antes de lançar dados oficiais. Testes locais: node scripts/test-ranking-v40.js. SQL e interface não executados contra produção.
