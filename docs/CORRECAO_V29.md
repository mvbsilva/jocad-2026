# Correções V29

1. Execute `database/migrations/0008-corrigir-recalculo-medalhas.sql` no SQL Editor do Supabase, após backup.
2. Publique os arquivos da V29, mantendo `config.js`.
3. Recarregue a página sem cache e teste cadastrar, editar e cancelar uma conquista.

O erro de UPDATE sem WHERE era causado pelo gatilho de recálculo da migração 0007. A migração 0008 substitui o gatilho por atualização limitada ao curso afetado. O JavaScript remove o acesso obrigatório a `medalCourse`, que não existe no novo formulário.
