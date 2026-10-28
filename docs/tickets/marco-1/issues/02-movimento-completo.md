# 02: Movimento completo

Type: task
Status: ready-for-agent
Blocked by: 01
Spec: [Marco 1](../spec.md)

## What to build

Andar fica com a sensação certa mesmo com ping alto. O jogador clica num tile e o herói vai até lá pelo caminho mais curto; o próprio passo responde na hora (previsão) e volta se o servidor recusar; tudo o que não é o próprio herói aparece ~100 ms atrás, interpolado entre tiles. O servidor só manda o que está perto do herói.

## Acceptance criteria

- [x] Intenção `andar até` (tile) com pathfinding em grade no `core`; tile inalcançável gera recusa.
- [x] Intenção `parar` cancela o caminho.
- [x] Duração do passo fixada como número inteiro de ticks (decisão de sensação, registrada no ticket ao fechar).
- [x] Previsão só do passo do próprio herói, com volta ao tile anterior quando o servidor recusa.
- [x] Outras entidades desenhadas ~100 ms atrás e interpoladas entre tiles.
- [x] Estado filtrado por área de interesse (~15×11 tiles + margem) com `StateView`.
- [x] Escala inteira ×1/×2 conforme a janela; camada "por cima" desenhada sobre o herói.
- [x] Animação de andar por código: balanço vertical e leve inclinação alternada (números do protótipo do teste das 3 direções revistos para 64 px).
- [x] Testes do `core`: caminho mais curto, desvio de obstáculo, recusa de destino bloqueado.

## Comments

- 2026-10-28: pronto. Decisões de implementação:
  - **Duração do passo**: 3 ticks (300 ms), o ritmo do protótipo do teste das 3 direções.
  - **Previsão sem o `Predict` do Colyseus**: o `Reconciler` dele exige `defineInput` com uma entrada por tick, feito para física contínua; o passo em grade é intenção discreta. O cliente prevê com as regras de mapa do próprio `core` (o motivo de ter um código só, ADR-0002) e volta ao tile do servidor na recusa ou se o passo não for confirmado em 600 ms. A regra do ADR-0010 (só o passo do próprio herói é previsto) não muda.
  - **Interpolação**: as outras entidades são desenhadas 100 ms atrás, deslizando 300 ms entre tiles. Ainda não há outras entidades; os monstros chegam no ticket 04.
  - **Área de interesse**: 10×8 tiles para cada lado (meia tela de 15×11 + 3 de margem), com `StateView`.
  - **Escala**: a maior inteira que ainda mostra 15×11 tiles (×2 a partir de 1920×1408).
  - O HUD passou para HTML, porque o zoom da câmera do Phaser ampliava também os textos do canvas.
  - Verificado no navegador com 300 ms de latência simulada (`COLYSEUS_LATENCY`): o passo aparece na hora e o servidor confirma depois.
