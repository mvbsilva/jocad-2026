# Organização V34

A V34 organiza a base V33 sem alterar as regras de negócio ou o banco. O arquivo `index.html` continua contendo o JavaScript legado de apresentação porque as funções globais são chamadas por atributos `onclick`/`onchange` e pelos scripts de integração; separá-lo exigiria testes de regressão específicos.

Os estilos que estavam no `<head>` foram consolidados em `assets/css/site.css`, respeitando a ordem dos blocos originais. Um bloco de estilo tardio permanece no HTML para preservar a precedência original de cascata.

`docs/historico/` reúne material de versões anteriores. As migrações SQL permanecem em `database/migrations/`, e os resets destrutivos permanecem separados.

## Checklist de aceitação

- [ ] Cabeçalho com logomarcas oficiais e ano na cor `#043e77`.
- [ ] Lista de confrontos compacta em celular, com Fixar e status à direita.
- [ ] Card fixado com identificação à esquerda e Remover/status à direita.
- [ ] Selects da Secretaria com o mesmo padrão visual da Home.
- [ ] Login e perfis staff/admin.
- [ ] Atualização de resultados e súmulas.
- [ ] Registro e histórico de conquistas.
- [ ] Publicação de boletins e atualização pública.
- [ ] Sincronização periódica.
