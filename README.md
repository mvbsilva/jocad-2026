# V37 — Acompanhamento ao vivo

Atualização incremental da V36 em produção. Consulte [instruções de implantação](docs/ACOMPANHAMENTO_V37.md). Execute somente a migração 0010 após backup; preserve config.js e não execute cargas ou resets.

> **V35:** Gestão da programação na Secretaria, com CRUD, atualização pública e migração `0009-gestao-programacao.sql`. Veja [instruções](docs/GESTAO_PROGRAMACAO_V35.md).

# JOCAD 2026 — Portal do IFPA Campus Bragança

Portal público e Central da Secretaria para jogos, placares, súmulas, programação, boletins e premiações. **Versão organizada: V34 (base funcional V33).**

## Organização

```text
jocad-2026/
├── index.html                  # Página pública e Secretaria; scripts de interface legados mantidos
├── assets/
│   ├── css/site.css           # Estilos consolidados da página
│   ├── images/                # Logomarcas oficiais, sem alterações
│   └── js/                    # Bootstrap, portal e premiações
├── config.example.js          # Modelo de configuração pública
├── data/                      # CSVs de referência
├── database/
│   ├── migrations/            # Migrações incrementais 0001–0008
│   └── reset/                 # Scripts DESTRUTIVOS; não executar em deploy
├── docs/                      # Instalação, operação, arquitetura, versões e histórico
├── scripts/check_repo.py      # Verificações locais de integridade
├── .gitignore
└── .nojekyll
```

## Publicar no GitHub Pages

1. Copie **o conteúdo desta pasta** para a raiz da branch publicada (não a pasta-pai).
2. Preserve sua configuração `config.js` atual. Para uma instalação nova, use `config.example.js` como referência e configure somente URL e chave **anon/publishable** do Supabase. **Nunca use `service_role` no navegador.** O arquivo `config.js` é ignorado pelo Git e precisa ser disponibilizado por um processo de publicação adequado.
3. Em **Settings → Pages**, configure a publicação da branch e da pasta `/ (root)`.
4. Antes do commit, execute `python3 scripts/check_repo.py` e, se disponível, `node --check assets/js/bootstrap.js && node --check assets/js/portal.js && node --check assets/js/awards.js`.
5. Para testar localmente: `python3 -m http.server 8000` e abra `http://localhost:8000`.

## Banco e segurança

As migrações em `database/migrations/` **dependem de um esquema inicial já existente**, que não integra esta entrega. Não aplique migrações automaticamente nem repita scripts em produção sem conferir o histórico do banco. Os scripts em `database/reset/` apagam dados e não são usados na implantação. A autenticação e autorização efetivas dependem das políticas RLS do Supabase.

## Mudanças da V34

- Estilos CSS do cabeçalho do documento extraídos para `assets/css/site.css`, mantendo a ordem original das regras.
- Documentação principal e estrutura do projeto revisadas, incluindo as migrações 0007 e 0008.
- Adicionado verificador de integridade para caminhos locais e arquivos obrigatórios.
- Arquivo legado de usuários V24 não referenciado movido para `docs/historico/`, se aplicável.
- Mantidos os ajustes V30–V33: cabeçalho com **2026 em `#043e77`**, cards responsivos e selects da Secretaria.

**Importante:** não foi realizada validação ponta a ponta contra o Supabase de produção. Verifique o fluxo de login, resultados, premiações e boletins em ambiente de teste antes da publicação definitiva.

Consulte `docs/INSTALACAO.md`, `docs/OPERACAO.md`, `docs/ARQUITETURA.md` e `docs/EVOLUCAO.md`.

**Créditos:** Desenvolvimento: Prof. Dr. Marcus Vinicius Brito · Informática — IFPA Campus Bragança.
