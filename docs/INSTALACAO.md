# Instalação e publicação

## 1. Configuração

Crie `config.js` na raiz com o formato de `config.example.js`:

```js
window.JOCAD_CONFIG = {
  url: 'https://SEU-PROJETO.supabase.co',
  anonKey: 'SUA_CHAVE_PUBLICAVEL'
};
```

`config.js` é ignorado pelo Git por padrão. **Para GitHub Pages usando publicação direta da branch**, o arquivo precisa ser disponibilizado no site; configure um fluxo de implantação que injete os valores públicos ou publique explicitamente esse arquivo após revisar seu conteúdo. A chave publishable é pública por definição, mas nunca publique service_role, senhas ou tokens administrativos. Sem `config.js`, a interface online não funciona.

## 2. Banco de dados

Use um projeto Supabase existente com as tabelas `matches`, `medals`, `bulletins`, `staff_roles` e `audit_log`. Os scripts em `database/migrations/` documentam a evolução V13, V16 e V17. **Eles não são uma instalação inicial completa e não devem ser executados novamente sem verificar o histórico do banco.** Faça backup antes de mudanças. Confirme privilégios SQL, RLS, funções `is_staff`, `is_admin` e auditoria `record_change`.

## 3. GitHub Pages

Crie um repositório, envie os arquivos preservando a estrutura, e configure **Settings → Pages → Deploy from a branch → main / (root)**. O endereço esperado é `https://USUARIO.github.io/NOME-DO-REPOSITORIO/`. Configure esse endereço no Supabase Authentication → URL Configuration quando necessário.

## 4. Homologação

Em dois navegadores diferentes, valide o placar parcial, persistência, sets de voleibol, pênaltis, boletins públicos e edição, quadro de medalhas e jogos fixados. Use contas distintas para testar perfis de acesso.
