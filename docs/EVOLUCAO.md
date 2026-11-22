# Histórico de evolução — JOCAD 2026

Documentação das melhorias implementadas, preservada para consulta.

---

## USUARIOS E PERMISSOES

# Usuários e permissões — V24

1. No Supabase, abra **Authentication → Users** e crie ou convide a pessoa. Copie o **UID**.
2. Execute `database/migrations/20261122_usuarios_v24.sql` no SQL Editor.
3. Publique os arquivos do repositório no GitHub Pages, preservando seu `config.js`.
4. Entre com um usuário administrador, abra **Acesso administrativo → Usuários e permissões**.
5. Cole o UID, escolha `staff` ou `admin` e salve.
6. Para suspender acesso, use **Desativar**. A conta de autenticação não é excluída.

**Segurança:** o navegador não cria contas nem manipula senhas. O menu é oculto para não administradores, e a autorização efetiva é verificada pela RLS no Supabase. O administrador atual não pode desativar ou rebaixar a própria conta pela interface. A tela mostra UIDs, não e-mails, porque `auth.users` não deve ser exposto ao cliente.

**Teste:** crie um usuário de teste, conceda `staff`, entre em janela anônima, verifique que ele pode acessar a Secretaria mas não vê **Usuários e permissões**; depois altere para `admin` e faça novo login.


---

## USUARIOS V25

# Usuários e permissões — V25

1. Execute `database/migrations/20261122_usuarios_v25_nome_email.sql` no SQL Editor do Supabase, após a migração V24.
2. Publique os arquivos da V25, preservando o `config.js` configurado.
3. Crie/convide usuários em **Authentication → Users**; use o UID na Secretaria, informe o nome completo e escolha o perfil.
4. A lista administrativa consulta o e-mail da conta diretamente em `auth.users` por meio de uma função restrita a administradores. Não é possível alterar o e-mail nem criar senhas pela Secretaria.
5. A identificação da sessão exibe nome e e-mail para o operador autenticado.

As funções usam `SECURITY DEFINER`: execute a migração com um proprietário confiável que tenha acesso a `auth.users` e `staff_roles`. O acesso às funções é concedido apenas a `authenticated`, com verificação explícita de `is_admin()` no corpo. Não exponha `service_role` no frontend.

**Testes recomendados:** entrar como admin, listar nomes/e-mails, editar nome, adicionar staff existente, verificar que staff não acessa a lista, sair e entrar novamente. Nenhuma alteração em jogos, medalhas ou boletins é necessária.


---

## PROGRAMACAO V26

# V26 — Seleção automática da data

Ao abrir ou atualizar o portal, as abas de **Jogos e resultados** e **Programação** selecionam automaticamente a data do JOCAD 2026 (24 a 27/11) mais próxima da data local do navegador. Antes do evento seleciona 24/11; depois do evento seleciona 27/11.

O visitante pode trocar as abas manualmente sem que a seleção seja alterada durante a navegação. Ao recarregar, o dia é recalculado. Não há mudanças no banco de dados ou no Supabase.

## Instalação

Substitua os arquivos do site pelos da V26, preservando seu `config.js`. Nenhuma migração SQL é necessária.


---

## V27 SINCRONIZACAO

# V27 — Sincronização pública silenciosa

- Consulta inicial ao abrir o portal.
- De 24 a 27/11/2026, consulta a cada 30 segundos, somente com a aba visível.
- Consulta ao retornar à aba, inclusive fora do período do evento.
- Compara resultados de jogos, boletins e medalhas; atualiza somente os blocos com alterações.
- Mantém dia escolhido, filtros, confrontos fixados e rolagem da página.
- Exibe horário da última sincronização e sinaliza erros sem recarregar a página.
- Sem migração SQL. Preservar config.js na publicação.

