# JOCAD 2026 — Portal com contas individuais (versão preparada para implantação)

Esta versão preserva o design da V8 e adiciona autenticação por e-mail/senha, papéis **administrador** e **operador**, consulta pública sem login, atualização de resultados/boletins/medalhas no Supabase e histórico de alterações no banco. **Ainda não está online nem configurada**: é necessário criar um projeto Supabase e publicar o conteúdo.

## Implantação

1. Crie um projeto no [Supabase](https://supabase.com/) e, em **SQL Editor**, execute `supabase_schema.sql`. Os 36 confrontos (sexta-feira: jogos 31–36) e os nove cursos/segmentos serão cadastrados. **Execute apenas uma vez em um projeto novo**.
2. Em **Authentication → Providers → Email**, mantenha autenticação por e-mail/senha. Para impedir cadastro público, desative *Allow new users to sign up*; crie manualmente as contas em **Authentication → Users → Add user**. Convém exigir senhas fortes e configurar confirmação de e-mail conforme a política institucional.
3. Copie os UUIDs dos usuários em **Authentication → Users**. No **SQL Editor**, execute, para cada conta, substituindo pelo UUID real:

   ```sql
   insert into public.staff_roles(user_id,role,active)
   values ('UUID-REAL-DO-USUARIO','admin',true)
   on conflict(user_id) do update set role=excluded.role,active=true;
   ```

   Para os demais integrantes, use `'operador'`. **Não execute comandos com UUIDs fictícios**. O administrador pode gerenciar papéis pela tabela `staff_roles` no Supabase; ainda não há tela de gestão de usuários no site.
4. Em **Project Settings → API**, copie a URL do projeto e a chave **publishable/anon** para `config.js`. **Nunca use a chave `service_role` ou outra chave secreta no HTML ou JavaScript público.**
5. Configure **Authentication → URL Configuration** com a URL definitiva do site. Publique `index.html`, `config.js` e `admin-online.js` no GitHub Pages (repositório com GitHub Pages ativado). Mantenha os demais arquivos do pacote fora da publicação, se preferir.
6. Teste: visitante anônimo deve apenas consultar; operador autorizado deve alterar um placar; outro dispositivo deve visualizar o resultado; operador inativo deve perder acesso; o histórico deve aparecer em `audit_log`.
7. Para atualização em tempo real via Realtime, habilite as tabelas `matches`, `medals` e `bulletins` na publicação `supabase_realtime` pelo painel Database → Publications (ou use SQL apropriado). Mesmo sem Realtime, a página atualiza ao retornar à aba; recarregar a página busca o estado atual.

## Segurança e operação

- O banco aplica RLS: visitantes somente leem partidas, boletins e medalhas; contas autorizadas podem atualizar placares e medalhas e inserir boletins. A tabela de auditoria não permite escrita direta pelo navegador.
- **Não use um login compartilhado.** Cada integrante deve ter sua própria conta. O administrador é o único que pode alterar papéis via políticas do banco.
- Para evitar resultados divergentes, os dados locais de demonstração são substituídos pelos dados do servidor quando a conexão estiver configurada. Sem configuração, o portal informa que está em modo prévia e não permite gravar oficialmente.
- O cadastro de **equipes → cursos** está no CSV `vinculo_equipes_cursos.csv` para validação. Medalhas são lançadas por curso/servidores, não automaticamente por vitória em partida: essa associação depende de conferência e regulamento.
- Antes de usar oficialmente: revisar equipes, modalidades, numeração, confrontos de classificação, regras de medalhas e validar em dois aparelhos. Configurar backups e monitorar limites do plano gratuito do Supabase/GitHub Pages.
- **Limitação atual:** há autenticação e auditoria, mas ainda não há interface de gestão de contas, de edição de equipes, nem de atribuição de medalhas a uma prova individual. A edição de medalhas é por totais de curso.

## Correções da V10
- A prévia inclui os 36 confrontos diretamente no HTML; não depende do Supabase para exibir a programação.
- Os nove cursos/segmentos aparecem mesmo sem medalhas.
- Quando o banco online está vazio, a página mantém a programação local e informa que ela não é sincronizada.
- A imagem `logo_ifpa_braganca.png` é o PNG fornecido, com o fundo claro convertido em transparência para evitar uma moldura aparente.
- Para publicação, envie também `logo_ifpa_braganca.png` junto de `index.html`, `config.js` e `admin-online.js`.
- O armazenamento local da prévia usa uma nova chave para evitar que registros antigos ocultem o calendário atualizado.
