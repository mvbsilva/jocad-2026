# Chaveamento automático — V19

Os campos originais `Venc. Jg. NN` do arquivo `data/confrontos_2026.csv` definem os vínculos. O portal resolve esses vínculos em tempo real usando os resultados da tabela `matches` do Supabase. **Não é necessário alterar as colunas `home` e `away` no banco.**

Exemplo: jogo 27, visitante = vencedor do jogo 07. Após finalizar o jogo 07 com `winner_side` e/ou placar, o portal apresenta `Informática` e a indicação `Vencedor do jogo 07` se ela vencer. O mesmo ocorre em cascata (jogo 27 → 33).

Se o resultado anterior for reaberto, o próximo confronto volta a indicar `Vencedor do jogo NN` até existir novo vencedor confirmado. Os placares posteriores não são apagados automaticamente; **antes de corrigir um resultado que já alimentou jogos posteriores, revise manualmente os resultados dependentes**.

A edição na Secretaria usa os nomes resolvidos, e a finalização é bloqueada se algum participante ainda depender de resultado não confirmado. Os nomes derivados não são gravados na tabela `matches`: o vínculo é preservado na programação original. A sincronização pública existente ocorre a cada 30 segundos ou ao reabrir a aba.

## Educação do Campo

Executar `database/migrations/20261120_educacao_do_campo.sql` para inserir o curso no Supabase, com ouro e prata zerados. A lista local do portal também foi atualizada.

## Identidade visual

A nova imagem foi salva em `assets/images/logo_jocad_2026.jpg` e referenciada pelo cabeçalho visual da página.
