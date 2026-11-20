# Arquitetura

- **Frontend:** HTML/CSS/JavaScript sem bundler. `index.html` concentra a estrutura, estilos e parte da lógica; `assets/js/` contém módulos legados carregados por `<script>` em ordem.
- **Backend:** Supabase Auth + PostgreSQL com RLS. O navegador usa apenas a chave pública.
- **Tabelas conhecidas:** `matches` (`result_details` JSONB, `score_a`, `score_b`, `status`), `medals` (`course`, `gold`, `silver`), `bulletins` (`title`, `body`, `published_at`), `staff_roles`, `audit_log`.
- **Auditoria:** trigger `record_change()` para registrar mudanças; privilégios e dono da função devem ser revisados antes de produção.
- **Atualização pública:** consultas ao Supabase e atualização periódica prevista na V17.
- **Pins:** preferência local do navegador, não salva no Supabase.

## Componentes JS

| Arquivo | Responsabilidade |
|---|---|
| `admin-online.js` | Sessão, autorização e atualização de jogos |
| `sumulas-v13.js` | Formulários e regras de súmulas (inclui ajustes V18) |
| `public-online-v17.js` | Sincronização da página pública |
| `secretaria-v14.js` | Navegação e filtros da Secretaria |
| `secretaria-v16.js` | Boletins e melhorias administrativas |

A nomenclatura dos arquivos preserva compatibilidade com a implementação existente. Refatoração em módulos ES pode ser feita futuramente com testes de regressão.
