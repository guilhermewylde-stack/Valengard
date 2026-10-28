# 14: Instalador e atualizador

Type: task
Status: ready-for-agent
Blocked by: 01
Spec: [Marco 1](../spec.md)

## What to build

Um jogador baixa o instalador do Valengard no GitHub Releases, instala no Windows (aceitando o aviso do SmartScreen) e, quando sai uma versão nova, o cliente se atualiza sozinho, sem perder a Conta. Custo zero.

Decisões: ticket 02 do roadmap.

## Acceptance criteria

- [ ] CSP em `app.security.csp` com o host do servidor em `connect-src` (`wss` em produção, `ws://localhost` no dev); origem do webview padrão, sem mudança.
- [ ] Workflow de CI com `tauri-action` gera o instalador NSIS (sem assinatura de código) e o manifesto do atualizador num GitHub Release (repositório público só de releases, se o código for privado).
- [ ] Atualizador do Tauri 2 com chave própria; a chave privada fica fora do repositório (segredo do CI), com backup. Gerar e guardar a chave é passo do autor.
- [ ] Instalar e atualizar testados num Windows limpo (VM), inclusive com o Smart App Control ligado, com o resultado anotado no ticket.
- [ ] Atualizar o cliente mantém o Convidado (cofre do Windows) e os heróis.
