# JOCAD 2026 — V13 (Súmulas digitais)

## Instalação
1. Faça backup do projeto Supabase (tabelas e políticas).
2. No SQL Editor execute **migracao_v13.sql** sobre o banco V12 já existente. Não reexecute o schema inicial para migrar.
3. Publique **todos os arquivos da pasta** no repositório, inclusive `sumulas-v13.js` e `admin-online.js`.
4. Preserve o `config.js` válido no seu projeto. Não publique `service_role`.
5. Entre como secretaria, teste um jogo de cada modalidade e confirme em outro navegador.

## Escopo
- Voleibol: sets 25 pontos (3º e 5º a 15), diferença de dois; 2 sets para vitória, 3 na final.
- Futsal, handebol, basquete: dois tempos; desempate quando necessário.
- Queimada: queimados, prorrogação, sorteio.
- Modalidades sem regra de súmula específica: resultado básico e vencedor opcional.
- Detalhes públicos expansíveis. Dados persistidos em `matches.result_details` e `matches.winner_side`.
- Não altera os 36 confrontos, boletins, cursos e medalhas.

## Limitações e testes
- O vencedor de chaves subsequentes não é propagado automaticamente.
- O módulo de medalhas continua com edição manual; a classificação geral por pontos ainda não foi implementada.
- O empate de queimada com prorrogação precisa ser confirmado pela arbitragem; registro de desempate manual.
- Sem navegador conectado ao Supabase real, a integração de escrita não foi validada ponta a ponta.
- A publicação e a execução do SQL são tarefas manuais; o ZIP não altera o banco sozinho.
