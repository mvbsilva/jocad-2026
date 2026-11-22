# V28 — Conquistas esportivas e culturais

## Instalação
1. Faça backup do Supabase.
2. Execute `database/migrations/0007-registro-de-conquistas.sql` **uma única vez**, após 0006.
3. Publique os arquivos do repositório, preservando `config.js`.
4. Entre na Secretaria > Medalhas e teste uma premiação cultural e outra esportiva.

## Operação
A Secretaria registra a equipe, categoria, medalha, modalidade ou atividade, naipe opcional, jogo opcional e descrição. Uma conquista confirmada soma uma medalha; cancelamentos deixam de contar e permanecem no histórico. A tabela `audit_log` guarda o antes/depois de cada alteração. O público pode filtrar medalhas gerais, esportivas e culturais e clicar em uma equipe para ver os detalhes.

A migração converte saldos antigos de `medals` em registros individuais da categoria `legacy`, descritos como saldo anterior sem detalhamento. Isso mantém a classificação existente, mas não inventa a origem de medalhas antigas. É recomendável revisar esses saldos antes do evento.

**Importante:** não executar a migração novamente após iniciar lançamentos. A restrição de unicidade impede duas medalhas de mesmo tipo na mesma categoria, atividade e naipe; ajuste nomes das atividades para distingui-las corretamente. A Secretaria não concede medalhas automaticamente a partir de jogos finalizados.

O reset `03_zerar_dados_operacionais.sql` foi atualizado para remover também as conquistas.

## Verificação
A sintaxe dos scripts JavaScript foi validada. É necessário testar a migração, as políticas RLS e as operações reais no Supabase antes de usar em produção.
