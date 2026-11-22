# Usuários e permissões — V25

1. Execute `database/migrations/20261122_usuarios_v25_nome_email.sql` no SQL Editor do Supabase, após a migração V24.
2. Publique os arquivos da V25, preservando o `config.js` configurado.
3. Crie/convide usuários em **Authentication → Users**; use o UID na Secretaria, informe o nome completo e escolha o perfil.
4. A lista administrativa consulta o e-mail da conta diretamente em `auth.users` por meio de uma função restrita a administradores. Não é possível alterar o e-mail nem criar senhas pela Secretaria.
5. A identificação da sessão exibe nome e e-mail para o operador autenticado.

As funções usam `SECURITY DEFINER`: execute a migração com um proprietário confiável que tenha acesso a `auth.users` e `staff_roles`. O acesso às funções é concedido apenas a `authenticated`, com verificação explícita de `is_admin()` no corpo. Não exponha `service_role` no frontend.

**Testes recomendados:** entrar como admin, listar nomes/e-mails, editar nome, adicionar staff existente, verificar que staff não acessa a lista, sair e entrar novamente. Nenhuma alteração em jogos, medalhas ou boletins é necessária.
