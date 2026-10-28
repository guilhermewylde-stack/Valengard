# Conta de Convidado no PC

Type: grilling
Status: open
Blocked by: —

## Question

Como o cliente Tauri identifica o Convidado (credencial gerada no primeiro uso, onde fica guardada), o que acontece ao reinstalar ou formatar o PC (perde a Conta?), se o mesmo PC pode ter várias Contas, e o que precisa ficar pronto agora para o Convidado virar Conta com e-mail no Marco 3 sem migração.

Contexto da pesquisa de stack (ticket 01): a origem do webview do Tauri (`http://tauri.localhost` ou `https` com `useHttpsScheme`) precisa ser fixada antes do primeiro instalador, porque trocá-la depois apaga o `localStorage` e o IndexedDB, onde a credencial do Convidado poderia morar.
