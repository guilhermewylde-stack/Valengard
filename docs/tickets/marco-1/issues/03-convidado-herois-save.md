# 03: Convidado, heróis e save

Type: task
Status: ready-for-agent
Blocked by: 01
Spec: [Marco 1](../spec.md)

## What to build

O jogador abre o jogo pela primeira vez e já está dentro, sem login: o cliente pede um Convidado, guarda o segredo no cofre do Windows e troca por um token de sessão. Vê as 2 vagas de herói, cria um Guerreiro com nome e aparece no templo de Valen. Ao sair e voltar (ou reinstalar o cliente), continua com o mesmo herói, no mesmo lugar.

Decisões: ticket 08 do roadmap; herói novo e save na spec.

## Acceptance criteria

- [ ] Rota de Convidado: cria a Conta e devolve identificador + segredo aleatório de 256 bits; o banco guarda só o hash; no máximo 5 Convidados por IP por dia.
- [ ] Rota que troca o segredo por um token de 24h; a sala valida em `onAuth` e recusa token inválido ou vencido; o cliente renova sozinho.
- [ ] O cliente guarda o segredo no Gerenciador de Credenciais do Windows (plugin de keyring do Tauri), nunca no `localStorage`; reinstalar o cliente mantém a Conta.
- [ ] Esquema Drizzle/PostgreSQL com migrações em transação: Conta (`email` vazio, tipo `convidado | ligada`), herói, itens, poções, Tática. As tabelas de Caçada e Diário podem nascer aqui ou nos tickets 09/10.
- [ ] Tela de heróis (Preact): 2 vagas; criação indisponível com as 2 ocupadas; aviso "ligue um e-mail para não perder" com o botão desativado.
- [ ] Criação de Guerreiro: nome de 3 a 16 letras, espaço só entre palavras, único no Mundo, filtro de palavrões; erros mostrados na hora.
- [ ] Herói novo: Nível 1, Skill Espada 10, kit inicial vestido (Espada curta, Capuz, Roupa, Calça), 0 de Ouro, 20 poções de vida, Tática padrão (50% / 15% / 20), no templo de Valen.
- [ ] Save do que está em caça a cada 60 s e ao sair; entrar com o herói devolve ao último lugar salvo.
- [ ] Configurações com seletor de idioma (padrão: idioma do sistema); todas as telas em PT-BR e EN-US.
- [ ] Testes de integração do servidor com Postgres real: criação de Convidado, limite por IP, token, validação e unicidade do nome, 2 vagas.
