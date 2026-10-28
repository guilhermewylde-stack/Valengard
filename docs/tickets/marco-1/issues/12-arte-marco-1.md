# 12: Arte do Marco 1

Type: task
Status: ready-for-agent
Blocked by: 01
Spec: [Marco 1](../spec.md)

## What to build

Toda a arte que falta ao Marco 1, gerada no Gemini e processada do mesmo jeito, aparece no jogo: Rato, vendedor, ferreiro, tileset de Valen e da Área de caça, ícones de itens, poção e troféus. Guerreiro e Lobo já existem (teste das 3 direções).

Regras: ADR-0005, ADR-0011, `docs/art/ART-BIBLE.md` e o ticket 09 do roadmap.

## Acceptance criteria

- [ ] Imagens geradas com `mcp__pool__generate_image` (sem API paga), fundo magenta `#FF00FF`, bloco de estilo da ART-BIBLE em todo prompt; brutos em `assets/inbox/`.
- [ ] Personagens: sul do zero; norte e leste por edição citando o arquivo do sul no prompt, com a pose de corpo inteiro descrita; oeste espelhado no cliente.
- [ ] Script de processamento no repositório (base: o do protótipo do teste das 3 direções): recorta o magenta, mesma escala entre as direções, pés no chão do tile, 64×64, paleta comum de 48 cores, contorno de 1 px refeito.
- [ ] Tileset 64×64 com chão, muralha, templo, árvores (copa na camada "por cima") e obstáculos; ícones dos itens do ticket 07, da poção e dos troféus.
- [ ] Nada dos personagens da referência de estilo, nem sprite do Tibia/OTClient.
- [ ] Arte integrada ao cliente no lugar dos provisórios.
- [ ] O autor aprova a arte antes de fechar o ticket.
