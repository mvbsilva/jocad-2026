# JOCAD 2026 — IFPA Campus Bragança

Portal público de jogos, resultados, programação, boletins e medalhas, com Central da Secretaria autenticada no Supabase.

## Estrutura

- `index.html` — interface e lógica de apresentação (HTML/CSS/JavaScript)
- `assets/js/bootstrap.js` — integração inicial e súmulas
- `assets/js/portal.js` — sincronização pública, Secretaria, boletins e usuários
- `assets/images/` — imagens institucionais
- `config.example.js` — exemplo de configuração do Supabase
- `database/migrations/` — seis migrações incrementais, numeradas por ordem de aplicação
- `database/reset/` — **scripts destrutivos**, somente para operação manual controlada
- `data/` — CSVs de referência
- `docs/` — instalação, operação, arquitetura e histórico

## Publicação no GitHub Pages

1. Publique o conteúdo **desta pasta** na raiz da branch escolhida para o GitHub Pages.
2. Preserve o seu `config.js` existente ou crie-o a partir de `config.example.js` com a URL e chave **anon/publishable** do Supabase. O arquivo é ignorado pelo Git por padrão; garanta que esteja disponível na publicação por um método seguro de deploy. **Nunca use `service_role` no navegador.**
3. No GitHub, configure **Settings → Pages → Deploy from a branch**.
4. Para testar localmente, execute `python3 -m http.server 8000` na raiz e abra `http://localhost:8000`.
5. Teste login, permissões, edição de jogos, súmulas, medalhas, boletins, seleção automática do dia e sincronização silenciosa a cada 30 segundos durante o evento.

## Banco de dados

**Este pacote não inclui o esquema inicial do banco Supabase.** As migrações são incrementais e pressupõem a estrutura já existente (`matches`, `medals`, `bulletins`, `staff_roles`, `audit_log`, autenticação e funções RLS).

- **Banco existente:** não reaplique automaticamente migrações já executadas. Renomear os arquivos não cria uma nova necessidade de execução.
- **Banco novo:** primeiro é necessário provisionar o esquema inicial; depois aplicar `0001` a `0006`, na ordem, verificando pré-requisitos.
- Os arquivos de `database/reset/` **não são migrações** e podem apagar dados.

Consulte `docs/INSTALACAO.md` e `database/migrations/README.md`.

## Segurança e operação

O controle de acesso efetivo depende das políticas RLS e funções do Supabase. A interface administrativa não substitui as regras de autorização no banco. Não inclua senhas ou chaves privadas no repositório.

**Créditos:** Desenvolvimento: Prof. Dr. Marcus Vinicius Brito · Informática - IFPA Campus Bragança.


### Ajuste visual dos confrontos
Corrigido o grid desktop dos cards de jogos: eram quatro colunas CSS para três blocos HTML, causando uma coluna vazia à direita. Agora são três colunas (informações, equipes/placar e ações), com responsividade preservada. Sem migração SQL.


## V28 — Registro de conquistas

A V28 acrescenta medalhas esportivas e culturais com justificativa, histórico de alterações, filtro público e gerenciamento na Secretaria. Execute `database/migrations/0007-registro-de-conquistas.sql` antes de publicar. Consulte `docs/CONQUISTAS_V28.md`.


## V30 — Cabeçalho institucional

Novo cabeçalho responsivo aprovado: logos oficiais nas extremidades, JOCAD em verde e 2026 em azul, tema e data centralizados. Não requer SQL adicional. Consulte `docs/CABECALHO_V30.md`.
