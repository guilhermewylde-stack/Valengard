# Regras da Caçada offline

Type: grilling
Status: resolved
Blocked by: 03

## Question

Qual o teto de duração da Caçada offline sem VIP, quando ela começa (ao desconectar em AUTO? ao fechar o cliente?), como o relógio do servidor fecha a conta ao reconectar, o que o Diário da Caçada mostra, e como provar com teste que o offline nunca rende menos que o AUTO online na mesma área (ADR-0001).

Contexto do ticket 03 (ADR-0009): uma Caçada offline pode ser fechada em trechos (a cada atualização do jogo), cada um calculado com a sua versão do `core`. O Diário da Caçada precisa juntar os trechos.

Contexto do ticket 04 (ADR-0010): a queda de conexão fora da cidade liga o AUTO; depois de 30 s sem reconectar, o herói passa para Caçada offline. Falta decidir como é essa passagem (mesma Caçada ou outra, o que vira Preparo).

## Answer

- **Teto da Caçada**: 12h sem VIP, 24h com VIP (VIP só no Marco 8). Chegar ao teto é um motivo de Retorno (glossário atualizado).
- **Mesma Caçada**: do AUTO online para o offline continua a mesma Caçada (mesmo Preparo e Diário); a Cópia pessoal parte do estado atual (vida, poções, mochila, tile) com semente nova. Se o herói estava no Jogo manual, a queda liga o AUTO e começa uma Caçada ali, com o Preparo daquele momento. Na cidade, nada.
- **Reconectar com a Caçada correndo**: o servidor calcula até agora pelo relógio dele, e o herói reaparece no mundo compartilhado, no tile da Cópia, ainda em AUTO; o jogador vê o Diário até ali e decide se assume. Se a Caçada já acabou, aparece em Valen com o Diário completo.
- **Retorno**: sempre leva a Valen, online e offline (também na Morte), menos quando o jogador assume o controle.
- **Diário**: guarda só o resumo (duração, XP, Níveis, Skill, Ouro, Saque, poções, Mortes, motivo do Retorno) e a receita (Preparo, sementes e versão do `core` por trecho); o golpe a golpe é recalculado sob demanda. Últimos 10 por herói.
- **Offline ≥ online**: garantido pela estrutura (o offline é o AUTO sozinho com a mesma função `passo`); um teste no CI roda N sementes tick a tick e em lote e exige resultado idêntico.
- **Vários heróis**: cada herói tem a própria Caçada, sem limite por Conta. A "Caçada extra na fila" do VIP é definida no Marco 8.
