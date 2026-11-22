# V26 — Seleção automática da data

Ao abrir ou atualizar o portal, as abas de **Jogos e resultados** e **Programação** selecionam automaticamente a data do JOCAD 2026 (24 a 27/11) mais próxima da data local do navegador. Antes do evento seleciona 24/11; depois do evento seleciona 27/11.

O visitante pode trocar as abas manualmente sem que a seleção seja alterada durante a navegação. Ao recarregar, o dia é recalculado. Não há mudanças no banco de dados ou no Supabase.

## Instalação

Substitua os arquivos do site pelos da V26, preservando seu `config.js`. Nenhuma migração SQL é necessária.
