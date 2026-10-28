# Conta de Convidado no PC

Type: grilling
Status: resolved
Blocked by: —

## Question

Como o cliente Tauri identifica o Convidado (credencial gerada no primeiro uso, onde fica guardada), o que acontece ao reinstalar ou formatar o PC (perde a Conta?), se o mesmo PC pode ter várias Contas, e o que precisa ficar pronto agora para o Convidado virar Conta com e-mail no Marco 3 sem migração.

Contexto da pesquisa de stack (ticket 01): a origem do webview do Tauri (`http://tauri.localhost` ou `https` com `useHttpsScheme`) precisa ser fixada antes do primeiro instalador, porque trocá-la depois apaga o `localStorage` e o IndexedDB, onde a credencial do Convidado poderia morar.

## Answer

- **Nascimento**: na primeira abertura, o cliente pede um Convidado; o servidor cria a Conta e devolve identificador + segredo aleatório de 256 bits (no banco, só o hash). Sem usuário, senha ou tela de login.
- **Guarda**: o segredo vai para o cofre de credenciais do sistema (Gerenciador de Credenciais do Windows, via plugin de keyring do Tauri), nunca para o `localStorage`; sobrevive a reinstalar. A origem do webview fica a padrão (`http://tauri.localhost`) e não muda.
- **Formatar o PC** perde o Convidado. A tela do herói avisa desde o Marco 1 ("ligue um e-mail para não perder"), com o botão desativado até o Marco 3.
- **Sessão**: o segredo é trocado por um token de 24h ao abrir; a sala do Colyseus valida o token em `onAuth`.
- **Contas e heróis**: um Convidado por usuário do Windows; 2 vagas de herói por Conta (extras com Gemas no Marco 8); no Marco 1 só Guerreiro.
- **Abuso**: no máximo 5 Convidados por IP por dia.
- **Nome do herói**: escolhido na criação, 3 a 16 letras, espaço só entre palavras, único no Mundo, com filtro de palavrões; sem nome padrão.
- **E-mail no Marco 3**: a mesma Conta ganha e-mail, sem migração; a tabela nasce com `email` vazio e tipo `convidado | ligada`.
