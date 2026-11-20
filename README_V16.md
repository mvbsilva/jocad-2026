# JOCAD 2026 — V16

## Instalação
1. Faça backup do Supabase. Execute `migracao_v16.sql` no SQL Editor com conta administradora. O SQL preserva os dados e altera a função de auditoria para `SECURITY DEFINER`; confirme que seu proprietário é um papel confiável com permissão de escrita em `audit_log`.
2. Substitua os arquivos do site pelos deste pacote, preservando seu `config.js` (não incluído).
3. Faça login e teste placar parcial, edição/exclusão de boletim e salvamento de medalhas.

## Segurança e limites
- A tabela `audit_log` **não** recebe permissão pública de INSERT. O trigger insere com privilégios do proprietário da função.
- A edição de boletins é para staff ativo; a exclusão é somente para admin ativo.
- A V16 busca boletins e medalhas no Supabase; salvamentos nessas seções deixam de ser apenas locais.
- Não houve teste ponta a ponta contra o seu Supabase; confirme as permissões e a política de auditoria antes de publicar.
- O portal ainda contém partes legadas com armazenamento local (por exemplo, backup e carregamento inicial de confrontos); não considere isso uma migração integral de todo o portal.
