# 06: Poção, Morte e Zona segura

Type: task
Status: ready-for-agent
Blocked by: 05
Spec: [Marco 1](../spec.md)

## What to build

O jogador bebe poção no meio da luta para sobreviver. Se a vida zera, o herói morre: perde 30% do XP do Nível (sem cair de Nível) e metade do Saque juntado desde a última saída de Valen, e reaparece no templo com vida cheia. Dentro dos muros de Valen monstros não entram e ninguém ataca.

## Acceptance criteria

- [ ] Intenção `usar item` com poção: cura 80, espera de 10 ticks entre poções, recusa sem poção ou durante a espera; atalho de teclado e clique no HUD.
- [ ] "Saque da Caçada" no Jogo manual: Ouro e itens que entraram desde a última saída da Zona segura; entrar em Valen zera essa conta.
- [ ] Morte: perde 30% do XP do Nível atual (sem cair de Nível) e metade do Saque da Caçada (Ouro e itens); reaparece no templo com vida cheia; o Ouro que o herói já tinha em Valen não se perde.
- [ ] Aviso de Morte mostra o que foi perdido.
- [ ] Zona segura lida do mapa: monstros não entram (a IA não pisa nos tiles); `atacar` recusado dentro dela.
- [ ] Testes do `core`: espera da poção, perda de XP sem cair de Nível, metade do Saque, Ouro de Valen intacto, monstro barrado na Zona segura.
