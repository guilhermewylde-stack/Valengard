# 02: Movimento completo

Type: task
Status: ready-for-agent
Blocked by: 01
Spec: [Marco 1](../spec.md)

## What to build

Andar fica com a sensação certa mesmo com ping alto. O jogador clica num tile e o herói vai até lá pelo caminho mais curto; o próprio passo responde na hora (previsão) e volta se o servidor recusar; tudo o que não é o próprio herói aparece ~100 ms atrás, interpolado entre tiles. O servidor só manda o que está perto do herói.

## Acceptance criteria

- [ ] Intenção `andar até` (tile) com pathfinding em grade no `core`; tile inalcançável gera recusa.
- [ ] Intenção `parar` cancela o caminho.
- [ ] Duração do passo fixada como número inteiro de ticks (decisão de sensação, registrada no ticket ao fechar).
- [ ] Previsão só do passo do próprio herói (`Predict` do Colyseus 0.18), com volta ao tile anterior quando o servidor recusa.
- [ ] Outras entidades desenhadas ~100 ms atrás e interpoladas entre tiles.
- [ ] Estado filtrado por área de interesse (~15×11 tiles + margem) com `StateView`.
- [ ] Escala inteira ×1/×2 conforme a janela; camada "por cima" desenhada sobre o herói.
- [ ] Animação de andar por código: balanço vertical e leve inclinação alternada (números do protótipo do teste das 3 direções revistos para 64 px).
- [ ] Testes do `core`: caminho mais curto, desvio de obstáculo, recusa de destino bloqueado.
