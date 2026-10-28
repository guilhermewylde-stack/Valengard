# Bíblia de arte — Valengard (rascunho inicial)

> Rascunho de 2026-10-27, criado a partir da referência escolhida pelo usuário. O passo 7 do
> `KICKOFF.md` completa este arquivo (paleta exata e lista de imagens) depois do
> `/grill-with-docs`.

## Referência

`referencias/estilo-sprite-kit.jpg`: kit de sprites com quatro vocações (andar, atacar,
morto, itens, retrato). Vale **só pelo estilo**. Os personagens, símbolos e nomes dela
(Aragorn, Legolas, Gandalf, Frodo, Árvore Branca, Um Anel) são de Tolkien e **não** entram
no jogo; nada de sprites do Tibia/OTClient.

## O que copiar do estilo

- **Pixel art clássica de MMORPG**, como o Tibia: personagens que cabem em um tile de
  32×32 px, ampliados por múltiplos inteiros (×2, ×3), sem suavização.
- **Perspectiva 3/4 de cima**, quatro direções (sul, norte, leste, oeste).
- **Três poses paradas por personagem** (ADR-0005): sul; norte e leste por *edição* sobre
  a do sul ("repinte mantendo pose, proporção e perspectiva"); oeste = leste espelhado.
  Andar, atacar, dano e morte são animados por código, não por quadros desenhados.
- **Teste antes de tudo:** o primeiro trabalho de arte é 1 herói nas 3 direções. Se o
  Gemini não mantiver o personagem igual, o herói ganha uma base de caminhada desenhada à
  mão (plano B); monstros seguem só com poses paradas.
- **Contorno escuro de 1 px** e sombreamento por faixas de cor (sem degradê suave);
  luz vindo de cima à esquerda.
- **Paleta dessaturada de dark fantasy:** cinzas, verdes de floresta, marrons de couro,
  com um destaque de cor por vocação (azul da magia, dourado do metal).
- **Retratos** maiores (64×64 ou 96×96) com moldura dourada, para a ficha do herói e os NPCs.
- **Ícones de item** em 32×32 sobre slot de madeira escura.
- **Interface** em painéis de madeira escura com bordas e títulos dourados.

## Bloco de estilo para os prompts do Gemini

Repetir este bloco em todo prompt de `mcp__pool__generate_image`:

```
Classic 2D MMORPG pixel art in the style of early-2000s top-down online RPGs.
3/4 top-down view, character fits a 32x32 pixel tile, crisp pixels, no anti-aliasing,
1-pixel dark outline, flat cel shading with 3-4 tones per color, light from top-left.
Muted dark-fantasy palette: stone greys, forest greens, worn leather browns, one accent
color. Original character design, no existing franchise characters or symbols.
Solid flat magenta background #FF00FF, no shadow on the background, no text.
```

O Gemini devolve JPG 1024×1024. O script de processamento (passo 7 do kickoff) recorta o
magenta, reduz para a grade de 32 px e prende os pixels à paleta.

## Arte por código (ideia do Dunloc Online)

O vídeo "Meu MMORPG não usa imagens" (Dunloc Online, Tech Bite #002) desenha tudo em
Canvas 2D por código, com a IA escrevendo o código de desenho. No Valengard, o Gemini fica
com os sprites, e o código fica com o que ele faz melhor:

- **Efeitos:** partículas de magia, números de dano, brilho de raridade, luz de tocha.
- **Variações sem gerar imagem nova:** troca de paleta para tingir equipamentos e
  raridades, e para monstros "elite".
- **Molduras e painéis da interface** desenhados por código, para escalar bem do celular
  ao monitor.
- **Placeholders** desenhados por código enquanto a arte final não chega, para não travar
  a fatia vertical.
