# JOCAD 2026 — V15 — Confrontos fixados

- Ranking: ícones de ouro e prata aparecem mesmo com contagem zero.
- Fontes: selects, inputs e opções seguem a mesma família tipográfica do site.
- Cada confronto tem ação 📌 Fixar/Desafixar. O visitante pode fixar até 3 jogos.
- Os jogos fixados ocupam o espaço dos antigos quatro indicadores (4 dias, 36 confrontos, resultados e eixos).
- A seleção é individual e persistida no `localStorage` do navegador; não requer login nem altera a base Supabase.
- O aviso de dados sincronizados fica logo abaixo da data do evento.
- Mantidos os arquivos administrativos V14 e migração V13.

**Instalação:** substitua os arquivos do site pelo conteúdo deste pacote, mantendo o seu `config.js` válido.

**Observação:** a frase “Dados oficiais sincronizados” é texto de interface; a sincronização real depende da configuração e funcionamento do Supabase. Teste com dois dispositivos antes de publicar.
