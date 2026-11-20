# JOCAD 2026 — V18: sets e pênaltis

- Finais de voleibol: cinco campos previamente disponíveis, quatro sets regulares até 25 pontos e um quinto tie-break até 15 pontos, sempre com dois pontos de diferença.
- Demais partidas de voleibol: três campos, dois sets até 25 e um terceiro decisivo até 15.
- Futsal: dois tempos e campos específicos para registrar os pênaltis de cada equipe, quando houver empate.
- Resultados parciais continuam permitidos com status Em andamento.
- Parciais e pênaltis são exibidos nos detalhes públicos e nos jogos fixados.
- Nenhuma migração SQL adicional: os dados são armazenados em matches.result_details (jsonb).

## Instalação
Publique os arquivos desta pasta no GitHub Pages preservando o config.js existente. Não execute novamente migrações antigas já aplicadas.

## Observação
A identificação da final segue a convenção existente no projeto: dia 27 (ou campo de fase com texto final). Confirme se todos os jogos do dia 27 são finais; caso contrário, o cadastro precisará de uma coluna explícita de fase.

Testar no Supabase: parcial de voleibol, final com tie-break, empate em futsal e desempate por pênaltis.
