# Teste das 3 direções (ADR-0005)

Type: prototype
Status: resolved
Blocked by: —

## Question

O pipeline do ADR-0005 funciona? Gerar no Gemini o Guerreiro e um monstro da primeira área (sul; norte e leste por edição sobre a do sul; oeste espelhado) seguindo a ART-BIBLE, recortar o fundo magenta e animar andar, atacar, dano e morte por código num protótipo. O personagem se mantém entre as direções? Se não, vale o plano B.

## Answer

**O pipeline do ADR-0005 passou, mas em 64 px, não em 32.** O personagem se mantém entre as direções; o plano B (base de caminhada desenhada à mão) fica guardado, sem uso por ora. A arte passa a 64×64 por tile ([ADR-0011](../../../adr/0011-arte-em-64-px.md)). Veredito do usuário em 2026-10-27.

- **32 px ficou feio**: a redução por média borrava e apagava rosto, contorno e espada. O Gemini desenha pixel art com uns 55–64 px de altura; em 64 px o desenho chega quase intacto.
- **Pedir a arte já em 32 px não funciona**: na edição ele devolveu a mesma imagem; do zero saiu um boneco tosco, ainda acima de 32 px (`assets/inbox/guerreiro-sul-grade32*.jpg`).
- **Edição sobre o sul funciona** citando o arquivo no prompt (`@assets/inbox/<nome>-sul.jpg`, com `cwd` na raiz do repo): o `generate_image` não tem campo de imagem de referência, mas o Gemini lê o arquivo e mantém rosto, roupa, cores e escala.
- **Guerreiro**: norte fiel de primeira. O leste precisou de 2 tentativas: a 1ª só virou a cabeça; a 2ª, pedindo "corpo inteiro de perfil, pés apontando para a direita", acertou, mas em pose de passo.
- **Lobo**: leste fiel de primeira; o norte mantém o lobo, mas muda a pose (andando, de costas na diagonal).
- **Consequência para o pipeline**: o personagem se mantém, a pose nem sempre. Conte com refazer o leste às vezes, e descreva a pose de corpo inteiro em todo prompt de edição.
- **Processamento**: mesma escala para as direções de um personagem, paleta comum (48 cores) e contorno de 1 px refeito por código.
- **Animação por código** (andar com balanço, ataque com avanço, dano com tremida e flash, morte tombando e escurecendo) basta para ler a ação.

Assets: imagens brutas em `assets/inbox/` (`guerreiro-*`, `lobo-*`); protótipo (script `processar.py`, sprites e `index.html`) no branch `prototype/teste-3-direcoes`, pasta `prototypes/teste-3-direcoes/`, fora do `main`. Para rodar: `python -m http.server --directory prototypes/teste-3-direcoes` e abrir `http://localhost:8000`.
