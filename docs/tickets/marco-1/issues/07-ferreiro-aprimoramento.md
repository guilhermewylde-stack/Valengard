# 07: Ferreiro e Aprimoramento

Type: task
Status: ready-for-agent
Blocked by: 05
Spec: [Marco 1](../spec.md)

## What to build

O jogador clica no ferreiro com o herói ao lado, escolhe uma peça e vê o custo e a chance antes de confirmar. +1 a +3 sempre dão certo; +4 e +5 podem falhar, e a falha só gasta o Ouro. A peça aprimorada fica mais forte e mostra o +N.

## Acceptance criteria

- [ ] Intenção `aprimorar` (peça vestida ou na mochila), só com o herói ao lado do ferreiro.
- [ ] Custo do +1 = metade do preço do item; cada próximo, o dobro do anterior (Espada: 500, 1.000, 2.000, 4.000, 8.000).
- [ ] +1 a +3 sempre; +4 com 6.000/10.000; +5 com 4.000/10.000, pelo RNG do estado; a falha só gasta o Ouro.
- [ ] Bônus: arma +2 de ataque por nível; armadura da peça + ⌊Aprimoramento / 2⌋.
- [ ] Recusas com motivo: kit inicial (sem preço), peça já em +5, falta de Ouro.
- [ ] Menu HTML com custo e chance antes de confirmar; resultado (sucesso/falha) como evento; +N no nome e no ícone.
- [ ] Aprimoramento gravado na hora, numa transação.
- [ ] Testes do `core` (custos, chances com semente, bônus, recusas) e de integração (persistência).
