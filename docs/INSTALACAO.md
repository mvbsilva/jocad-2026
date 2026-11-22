# Instalação e publicação

1. Faça backup do projeto e do banco Supabase.
2. Publique os arquivos do pacote na raiz do repositório GitHub Pages.
3. Mantenha a configuração pública do Supabase em `config.js` (URL e chave anon/publishable), sem expor `service_role`. Como `config.js` está no `.gitignore`, providencie-o no fluxo de publicação.
4. Se o banco já está em operação, **não execute novamente** migrações só porque foram renomeadas.
5. Se estiver criando um banco novo, este pacote não inclui o schema inicial: obtenha-o antes de aplicar as migrações incrementais `0001` a `0006`.
6. Confira as políticas RLS, os perfis de administrador e a disponibilidade da função RPC de listagem de usuários.
7. Teste o portal público e o acesso à Secretaria, incluindo atualização a cada 30 segundos nos dias 24–27/11/2026.

Os scripts de `database/reset/` são destrutivos e não devem ser usados durante a publicação.
