# 05: Saque, mochila e vendedor

Type: task
Status: ready-for-agent
Blocked by: 04
Spec: [Marco 1](../spec.md)

## What to build

Monstros mortos deixam Saque, que vai direto para a mochila. O jogador volta a Valen, clica no vendedor com o herói ao lado e abre um menu HTML para vender troféus e equipamento e comprar poções e peças melhores. Tudo que mexe em Ouro é decidido pelo `core` no servidor e gravado na hora.

Números: ticket 07 do roadmap.

## Acceptance criteria

- [ ] Saque no `core`: Ouro do Rato 0–8 e do Lobo 0–24; Cauda de rato 5%; Pele de lobo 8%; Elmo de pele de lobo 0,3% do Lobo; sorteios pelo RNG do estado.
- [ ] Mochila de 20 espaços; troféus iguais empilham até 100 por espaço; poções num espaço próprio fora dos 20; Ouro à parte.
- [ ] Item de Saque que não cabe na mochila se perde, com aviso "mochila cheia" (decisão do autor, 2026-10-27). No AUTO, mochila cheia é motivo de Retorno (ticket 08).
- [ ] Tabela de Modelos de item no `core` (dados): 4 Slots (arma, cabeça, corpo, pernas), kit inicial e as peças do vendedor, com ataque/armadura e preços do ticket 07.
- [ ] Janela de mochila e equipamento; intenção `usar item` equipa uma peça da mochila no Slot dela (a armadura do herói é a soma das 4 peças).
- [ ] NPC vendedor: clicar com o herói ao lado abre o menu Comprar / Vender; longe do NPC, `comprar` e `vender` são recusadas.
- [ ] Comprar poção (10) e as peças (Espada 1.000, Capacete 1.200, Cota de malha 4.500, Calças de couro 2.000); recusa por falta de Ouro ou de espaço, com motivo.
- [ ] Vender troféus a preço fixo (15 / 35) e equipamento por 25% do preço, sem contar Aprimoramento (Elmo de pele de lobo 600); botão "vender todos os troféus".
- [ ] Compra e venda gravadas na hora, numa transação; mochila, Ouro e XP só são sincronizados para o dono.
- [ ] Nomes de itens e mensagens de recusa por chave de i18n nos dois idiomas.
- [ ] Testes do `core` (sorteios com semente, empilhamento, mochila cheia, preços, recusas) e de integração do servidor (compra e venda persistidas em transação).
