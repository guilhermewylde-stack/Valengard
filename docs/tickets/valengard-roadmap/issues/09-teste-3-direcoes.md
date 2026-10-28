# Teste das 3 direções (ADR-0005)

Type: prototype
Status: resolved
Blocked by: —

## Question

O pipeline do ADR-0005 funciona? Gerar no Gemini o Guerreiro e um monstro da primeira área (sul; norte e leste por edição sobre a do sul; oeste espelhado) seguindo a ART-BIBLE, recortar o fundo magenta e animar andar, atacar, dano e morte por código num protótipo. O personagem se mantém entre as direções? Se não, vale o plano B.

## Answer

**O pipeline do ADR-0005 passou: o personagem se mantém entre as direções.** O plano B (base de caminhada desenhada à mão) fica guardado, sem uso por ora. Veredito do usuário em 2026-10-27, sobre a comparação lado a lado em 32×32.

- **Edição sobre o sul funciona** citando o arquivo no prompt (`@assets/inbox/<nome>-sul.jpg`, com `cwd` na raiz do repo): o `generate_image` não tem campo de imagem de referência, mas o Gemini lê o arquivo e mantém rosto, roupa, cores e escala.
- **Guerreiro**: norte fiel de primeira. O leste precisou de 2 tentativas: a 1ª só virou a cabeça; a 2ª, pedindo "corpo inteiro de perfil, pés apontando para a direita", acertou, mas em pose de passo.
- **Lobo**: leste fiel de primeira; o norte mantém o lobo, mas muda a pose (andando, de costas na diagonal).
- **Consequência para o pipeline**: o personagem se mantém, a pose nem sempre. Conte com refazer o leste às vezes, e peça a pose explicitamente em todo prompt de edição.
- **Redução para 32 px**: os detalhes somem, mas a silhueta e a paleta continuam reconhecíveis. O contorno de 1 px é refeito por código (a redução apaga o do Gemini); todas as direções de um personagem usam a mesma escala e uma paleta comum (24 cores).
- **Animação por código** (andar com balanço, ataque com avanço, dano com tremida e flash, morte tombando e escurecendo) basta para ler a ação em ×2 e ×3.

Assets: imagens brutas em `assets/inbox/` (`guerreiro-*`, `lobo-*`); protótipo (script de recorte `processar.py`, sprites e `index.html`) no branch `prototype/teste-3-direcoes`, pasta `prototypes/teste-3-direcoes/`, fora do `main`. Para rodar: `python -m http.server --directory prototypes/teste-3-direcoes` e abrir `http://localhost:8000`.
