# JOCAD 2026 V17 — boletins e placares

1. Faça backup do banco.
2. Execute migracao_v16.sql se ainda não aplicada e, em seguida, migracao_v17.sql no SQL Editor como postgres.
3. Publique os arquivos da pasta, mantendo seu config.js original (não está no ZIP).
4. Teste: publicar boletim, abrir a página pública em janela anônima, editar, atualizar, excluir como administrador.
5. Teste: salvar parcial de vôlei e queimada; verificar placar lado a lado e etapas na listagem e nos fixados.

Mudanças: permissões GRANT na tabela bulletins além das políticas RLS; carregamento público de boletins, confrontos e medalhas do Supabase; cartões fixados com placar lado a lado; etapas sempre visíveis quando registradas; atualização automática a cada 30 s com aba visível.

Atenção: a V16 precisa estar aplicada para o trigger de auditoria ter permissão. A publicação e a exclusão exigem políticas RLS existentes. A edição é permitida a staff e a exclusão a admin. Não foi possível testar com a sessão real do seu banco.
