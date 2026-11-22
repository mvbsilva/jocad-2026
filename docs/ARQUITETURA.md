# Arquitetura

Aplicação estática em HTML/CSS/JavaScript, sem bundler, publicada no GitHub Pages. `index.html` mantém a interface, estilos e scripts de apresentação. `assets/js/bootstrap.js` contém as dependências de inicialização e súmulas; `assets/js/portal.js` contém sincronização, operações da Secretaria e usuários. A separação em dois arquivos preserva a ordem de carregamento em torno de um script inline do `index.html`. O Supabase fornece autenticação, dados e RLS.
