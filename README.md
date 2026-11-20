# JOCAD 2026 — Portal oficial de acompanhamento

Portal estático do IFPA Campus Bragança para consulta pública de jogos, placares, súmulas por modalidade, boletins e medalhas. Secretaria com autenticação Supabase, atualização de resultados e gestão de boletins. Base de código consolidada da **V18**.

## Estrutura

```text
.
├── index.html                 # Página pública e interface da Secretaria
├── config.example.js         # Modelo de configuração pública
├── assets/
│   ├── images/               # Logotipo institucional
│   └── js/                   # Integração e lógica da Secretaria
├── data/                      # CSVs de referência (não substituem o banco)
├── database/migrations/       # Migrações históricas do Supabase
├── docs/
│   ├── INSTALACAO.md
│   ├── ARQUITETURA.md
│   ├── OPERACAO.md
│   └── historico/             # Notas de versões V11–V18
├── .gitignore
└── .nojekyll
```

## Implantação rápida

1. Copie `config.example.js` para `config.js` e informe **URL** e chave **publishable/anon** do Supabase. Nunca use chave secreta/service_role.
2. Para desenvolvimento local, sirva a pasta via `python3 -m http.server 8000` e abra `http://localhost:8000`.
3. No GitHub, publique a **raiz da branch `main`** em **Settings → Pages → Deploy from a branch**. O `config.js` precisa existir no conteúdo publicado (veja `docs/INSTALACAO.md`).
4. No Supabase, confirme RLS, permissões, triggers e migrações já aplicadas. **Não reaplique indiscriminadamente migrações antigas em um banco com dados.**
5. Valide login, placar parcial, voleibol, futsal com pênaltis, medalhas, publicação/edição/exclusão de boletins e fixação de até 3 jogos.

## Funcionalidades

- 36 confrontos cadastrados; seleção por dia, modalidade e categoria.
- Súmulas digitais com detalhes de sets/tempos, parciais e desempates.
- Até 3 jogos fixados por visitante no navegador.
- Boletins públicos e gerenciamento na Secretaria.
- Quadro de medalhas por curso/segmento.
- Autenticação por usuário e políticas RLS no Supabase.

## Observações

- O `index.html` contém CSS e lógica de apresentação embutidos. **Esta entrega organiza o repositório sem reescrever essa parte**, para minimizar regressões na versão validada pelo usuário.
- Os nomes `sumulas-v13.js`, `secretaria-v16.js` etc. foram mantidos por compatibilidade; são componentes ativos da V18, não versões independentes.
- A V18 infere finais de voleibol pelo dia 27 ou indicação textual de fase; confirme os confrontos antes do evento.
- O projeto depende do Supabase para persistência; o ZIP não contém banco de dados nem credenciais de acesso.

Leia [Instalação](docs/INSTALACAO.md), [Arquitetura](docs/ARQUITETURA.md) e [Operação](docs/OPERACAO.md).
