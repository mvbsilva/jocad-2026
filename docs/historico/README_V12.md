# JOCAD 2026 — V12 | Busca de jogos na Secretaria

Esta versão mantém a V11 e adiciona ao painel **Resultados** uma busca por número do jogo ou nome de equipe, com filtro por dia. A busca ignora acentos e diferenças entre maiúsculas/minúsculas, apresenta contagem de resultados e impede salvamento quando não há confronto selecionado.

## Publicação

Substitua o `index.html` no GitHub Pages pelo deste pacote, preservando o `config.js` já configurado no repositório. Os demais arquivos são incluídos para referência. Não há mudança de esquema SQL nem migração de banco.

## Testes recomendados

Entre na Secretaria, abra Resultados, pesquise por `09`, `Servidores` e `Informática`; teste o filtro por 27/11 e confirme os jogos 31–36. Não grave placares fictícios no banco oficial.
