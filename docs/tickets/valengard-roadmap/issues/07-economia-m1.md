# Economia do Marco 1

Type: grilling
Status: resolved
Blocked by: 05

## Question

Preços do vendedor (poção e equipamento inicial), valor de venda do Saque, custo do Aprimoramento +1 a +5, se ele tem chance de falhar e o que a falha faz (nada, perde o nível, quebra o item). Quanto Ouro por hora o M1 rende e para onde ele vai?

Contexto do ticket 05: o simulador do branch `prototype/formulas-m1` já tem preço de poção, valor de item e Ouro por monstro como campos; use-o para fechar os números. Com os números atuais, a Tática padrão rende só ~+35 de Ouro na primeira hora.

## Answer

Números fechados com o simulador do branch `prototype/formulas-m1` (preço da poção 10, valor médio de troféu 25, Ouro do Rato 0–8 e do Lobo 0–24; 20 sementes, Tática padrão).

**Regras**

- Saque: Ouro direto; troféus que só se vendem; raramente um equipamento incomum do Lobo. Equipamento comum só no vendedor.
- O Marco 1 usa 4 Slots: arma, cabeça, corpo e pernas; a armadura do herói é a soma das peças. O vendedor tem duas peças por Slot (a inicial, que o herói ganha, e uma melhor).
- Aprimoramento: +1 a +3 sempre dão certo; +4 tem 60% de chance e +5 tem 40%. A falha só gasta o Ouro (o item não perde nível nem quebra). Custo de +1 = metade do preço do item; cada próximo custa o dobro do anterior.
- O vendedor compra equipamento por 25% do preço, sem contar o Aprimoramento; troféus têm preço fixo.
- O Ouro que já está com o herói em Valen nunca se perde; na Morte vai só metade do Saque daquela Caçada.

**Preços**

| Item | Efeito | Compra | Venda |
|---|---|---|---|
| Poção de vida | cura 80 | 10 | — |
| Espada curta (inicial) | ataque 12 | — | — |
| Espada | ataque 16 | 1.000 | 250 |
| Capuz (inicial) / Capacete | armadura 1 / 2 | — / 1.200 | — / 300 |
| Roupa (inicial) / Cota de malha | armadura 2 / 5 | — / 4.500 | — / 1.125 |
| Calça (inicial) / Calças de couro | armadura 1 / 3 | — / 2.000 | — / 500 |
| Cauda de rato (troféu, 5%) | — | — | 15 |
| Pele de lobo (troféu, 8%) | — | — | 35 |
| Elmo de pele de lobo (incomum, 0,3% do Lobo) | armadura 3 | — | 600 |

Aprimoramento da Espada: 500, 1.000, 2.000, 4.000 (60%), 8.000 (40%). Esperado até +5: ~31 mil de Ouro.

**Ritmo resultante**: ~1.000 de Ouro líquido na 1ª hora (compra a Espada), ~3.000 em 2h, ~7.600 em 4h, ~10.400 em 5h (compra o kit melhor inteiro, 8.700). As poções levam ~46% do bruto na 1ª hora e ~28% nas 5 primeiras horas. Depois do kit, o dreno é o Aprimoramento, que dura até o fim da área (Teto de 12h, Nível ~12).

Simplificação a revisitar na implementação: o simulador não troca o equipamento durante a simulação; com o kit melhor o herói mata mais rápido e gasta menos poção, então o Ouro por hora real fica um pouco acima.
