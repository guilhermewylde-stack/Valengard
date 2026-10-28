# Arte em 64 px por tile

Sprites, tiles e ícones são desenhados em 64×64 px, não em 32×32. O Gemini desenha pixel art com uns 55–64 px de altura; reduzir para 32 tirando a média borrava tudo e apagava rosto, contorno e espada (teste das 3 direções, ticket 09). Em 64 px o desenho chega ao jogo quase intacto, e um tile de 64 mostrado ×1 ocupa na tela o mesmo que o 32 do Tibia ampliado ×2. A grade lógica do ADR-0008 não muda: o que muda é só quantos pixels de arte cabem num tile.

## Considered Options

- 32 px com redução por média: fiel ao Tibia, mas borrado e sem detalhe.
- Pedir ao Gemini a arte já em 32 px: ignorou o pedido na edição e saiu tosco quando gerado do zero.
- Sprite de 64 sobre tile de 32 (boneco maior que o tile): mistura duas densidades de pixel na mesma tela.

## Consequences

- Tilesets do Tiled em 64×64 ([Formato de mapa](../tickets/valengard-roadmap/issues/10-formato-de-mapa.md)).
- Escala inteira no PC (×1, ×2). No celular, um tamanho entre ×1 e ×2 pede ×1 com mais tiles à vista ou aceitar um leve serrilhado; fica para o Marco 7.
