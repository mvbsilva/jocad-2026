# Migrações incrementais

Ordem histórica de execução sobre o **esquema inicial existente**:

0001. `0001-sumulas-e-status.sql` — origem: `migracao_v13.sql`
0002. `0002-auditoria-e-politicas-boletins.sql` — origem: `migracao_v16.sql`
0003. `0003-permissoes-boletins.sql` — origem: `migracao_v17.sql`
0004. `0004-educacao-do-campo.sql` — origem: `20261120_educacao_do_campo.sql`
0005. `0005-gestao-de-perfis.sql` — origem: `20261122_usuarios_v24.sql`
0006. `0006-nomes-e-emails-de-usuarios.sql` — origem: `20261122_usuarios_v25_nome_email.sql`

**Atenção:** não há schema inicial nesta entrega. Não execute estas migrações indiscriminadamente sobre um banco em produção. Confirme quais já foram aplicadas; a renumeração é apenas organização do repositório. Faça backup e use o SQL Editor com privilégios adequados.

7. `0007-registro-de-conquistas.sql` — premiações esportivas/culturais e contagem automática.

8. `0008-corrigir-recalculo-medalhas.sql` — correção do recálculo de medalhas (V29).

**V34:** a reorganização de arquivos não cria migrações novas. Para um banco já atualizado até a V33, não é necessário executar SQL.
