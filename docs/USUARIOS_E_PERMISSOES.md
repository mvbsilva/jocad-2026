# Usuários e permissões — V24

1. No Supabase, abra **Authentication → Users** e crie ou convide a pessoa. Copie o **UID**.
2. Execute `database/migrations/20261122_usuarios_v24.sql` no SQL Editor.
3. Publique os arquivos do repositório no GitHub Pages, preservando seu `config.js`.
4. Entre com um usuário administrador, abra **Acesso administrativo → Usuários e permissões**.
5. Cole o UID, escolha `staff` ou `admin` e salve.
6. Para suspender acesso, use **Desativar**. A conta de autenticação não é excluída.

**Segurança:** o navegador não cria contas nem manipula senhas. O menu é oculto para não administradores, e a autorização efetiva é verificada pela RLS no Supabase. O administrador atual não pode desativar ou rebaixar a própria conta pela interface. A tela mostra UIDs, não e-mails, porque `auth.users` não deve ser exposto ao cliente.

**Teste:** crie um usuário de teste, conceda `staff`, entre em janela anônima, verifique que ele pode acessar a Secretaria mas não vê **Usuários e permissões**; depois altere para `admin` e faça novo login.
