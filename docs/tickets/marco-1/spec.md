# Spec: Marco 1 — Fatia vertical (PC)

Type: spec
Status: ready-for-agent
Fonte: seção "Marco 1" de [docs/roadmap.md](../../roadmap.md); decisões nos tickets 01–10 de [valengard-roadmap](../valengard-roadmap/map.md) e nos ADRs 0001–0011.

## Problem Statement

O Valengard ainda não existe como jogo: há lore, decisões, um simulador de fórmulas e um teste de sprites, mas nenhum código de produção. Sem uma fatia jogável de ponta a ponta, não dá para saber se o laço central — caçar na mão ou deixar o herói caçar sozinho, online e offline, vender o Saque e ficar mais forte — é divertido, se a Caçada offline rende igual ao AUTO online, se o servidor aguenta ser a única fonte da verdade, nem se a arte do Gemini em 64 px funciona dentro do jogo.

Do ponto de vista do jogador: ele quer instalar um jogo no PC, abrir sem criar login, criar um Guerreiro, caçar Ratos e Lobos perto de Valen, ligar o AUTO, fechar o jogo e voltar horas depois com o herói mais forte e um relato do que aconteceu — sem perder nada porque a internet caiu ou o servidor reiniciou.

## Solution

Um cliente instalável no Windows (Tauri), atualizado sozinho pelo GitHub Releases, ligado a um servidor Colyseus que simula o mundo em ticks de 100 ms com um `core` puro e determinístico. O jogador abre o cliente, ganha uma Conta de Convidado sem tela de login, cria um Guerreiro com nome (2 vagas) e aparece em Valen, uma Zona segura com vendedor e ferreiro. O portão dá direto numa Área de caça contínua com Ratos (perto) e Lobos (longe), do Nível 1 ao 10.

Na Área de caça ele joga na mão (anda em grade, clica num monstro e o herói golpeia sozinho) ou liga o AUTO, que inicia uma Caçada seguindo a Tática (poção abaixo de X%, voltar abaixo de Y%, quantas poções levar). Fechou o jogo ou a conexão caiu? Depois de 30 s a mesma Caçada continua offline, calculada pelo servidor numa Cópia pessoal, com teto de 12h. Ao voltar, o jogador recebe o Diário da Caçada. O Retorno sempre leva a Valen, onde ele vende o Saque, compra poções e equipamento e aprimora até +5 no ferreiro. A Morte tira 30% do XP do Nível e metade do Saque da Caçada.

Nada que vale Ouro, XP ou Saque vem do cliente: ele só manda intenções. Tudo é salvo no servidor e sobrevive a reinício. Todo texto aparece em PT-BR e EN-US. A arte é do Gemini, em 64×64 por tile, parada em 3 direções (oeste espelhado) e animada por código.

## User Stories

### Instalação e atualização

1. Como jogador, quero baixar um instalador do Valengard no GitHub Releases, para instalar o jogo no meu PC Windows sem pagar nada.
2. Como jogador, quero que o instalador funcione mesmo sem assinatura de código (aceitando o aviso do SmartScreen), para conseguir jogar já no Marco 1.
3. Como jogador, quero que o cliente se atualize sozinho quando sair uma versão nova, para nunca precisar baixar o instalador de novo.
4. Como jogador, quero que uma atualização nunca apague minha Conta, para continuar com meus heróis depois de atualizar.
5. Como autor, quero publicar uma versão nova com um comando de CI (tauri-action) que gera o instalador NSIS e o manifesto do atualizador, para lançar versões sem trabalho manual.
6. Como autor, quero que a chave privada do atualizador fique fora do repositório, com backup, para não perder a capacidade de atualizar quem já instalou.

### Conta de Convidado

7. Como jogador, quero abrir o jogo pela primeira vez e já estar dentro, sem usuário, senha ou tela de login, para começar a jogar em segundos.
8. Como jogador, quero que minha Conta de Convidado sobreviva a reinstalar o cliente, para não perder meus heróis por desinstalar.
9. Como jogador, quero ver um aviso na tela de heróis de que formatar o PC perde o Convidado ("ligue um e-mail para não perder"), com o botão de ligar e-mail visível mas desativado, para saber do risco e que a solução vem depois.
10. Como jogador, quero que cada usuário do Windows tenha o próprio Convidado, para que outra pessoa da casa não jogue com os meus heróis.
11. Como jogador que volta no dia seguinte, quero entrar direto sem fazer nada, para que a sessão expirada (24h) seja renovada sem eu perceber.
12. Como autor, quero que o servidor recuse mais de 5 Convidados criados por IP por dia, para conter abuso.
13. Como autor, quero que o segredo do Convidado (256 bits) só exista no cofre de credenciais do Windows e como hash no banco, para que vazar o banco não entregue Contas.
14. Como autor, quero que a Conta nasça com `email` vazio e tipo `convidado`, para que o Marco 3 ligue um e-mail à mesma Conta sem migração.

### Heróis

15. Como jogador, quero ver minhas 2 vagas de herói (ocupadas e livres), para escolher com quem jogar.
16. Como jogador, quero criar um Guerreiro escolhendo o nome, para que o herói seja meu.
17. Como jogador, quero saber na hora se o nome é inválido (menos de 3 ou mais de 16 letras, espaço fora de entre palavras, palavrão) ou já existe no Mundo, para corrigir antes de criar.
18. Como jogador, quero que o Guerreiro novo comece com o kit inicial vestido (espada curta, capuz, roupa, calça), 0 de Ouro e 20 poções de vida, para poder sair caçando já.
19. Como jogador, quero que o herói novo apareça no templo de Valen, para começar na Zona segura.
20. Como jogador, quero entrar com um herói existente e voltar onde ele estava, para continuar de onde parei.
21. Como jogador com as 2 vagas ocupadas, quero que a criação de herói fique indisponível, para entender que o limite é 2.

### Mundo, movimento e câmera

22. Como jogador, quero ver Valen e a Área de caça em pixel art de 64 px por tile, mostrada em escala inteira (×1 ou ×2) conforme o tamanho da janela, para que a arte fique nítida.
23. Como jogador, quero andar um tile por vez com as setas/WASD, para mover o herói como no Tibia.
24. Como jogador, quero clicar num tile para o herói andar até lá pelo caminho mais curto, para atravessar o mapa sem segurar tecla.
25. Como jogador, quero que meu próprio passo responda na hora, mesmo com ping alto, e volte ao tile anterior se o servidor recusar, para que andar não pareça pesado.
26. Como jogador, quero ver monstros andando suavemente entre tiles (desenhados ~100 ms atrás e interpolados), para que o mundo não pule.
27. Como jogador, quero que paredes, muralhas e obstáculos bloqueiem a passagem, para que o mapa tenha forma.
28. Como jogador, quero que copas de árvores e telhados sejam desenhados por cima do herói, para dar profundidade.
29. Como jogador, quero que o herói e os monstros virem para a direção em que andam ou atacam (sul, norte, leste, oeste espelhado), para ler o que está acontecendo.
30. Como jogador, quero ver andar com balanço, ataque com avanço, dano com tremida e flash e morte tombando e escurecendo, para entender a ação sem animação desenhada quadro a quadro.
31. Como jogador, quero sair pelo portão de Valen direto na Área de caça, sem tela de carregamento, para que o mundo pareça contínuo.
32. Como jogador, quero encontrar Ratos perto do portão e Lobos mais longe, para que a área tenha uma progressão do Nível 1 ao 10.

### Combate (Jogo manual)

33. Como jogador, quero clicar num monstro para travar o alvo, e o herói andar até ele e golpear sozinho a cada 2 s, para lutar como no Tibia.
34. Como jogador, quero parar de atacar (intenção `parar`), para fugir ou mudar de alvo.
35. Como jogador, quero ver o dano de cada golpe (inclusive 0) sobre quem apanhou, para entender a luta.
36. Como jogador, quero ver a barra de vida do herói e dos monstros, para decidir quando beber poção ou fugir.
37. Como jogador, quero beber uma poção com um atalho ou clique (cura 80, espera de 1 s entre poções), para sobreviver.
38. Como jogador, quero que monstros me ataquem quando eu entro no raio de visão deles (~3 tiles), para que a área seja perigosa.
39. Como jogador, quero que às vezes dois monstros venham juntos (~1 encontro em 3), para que a Tática e as poções importem.
40. Como jogador, quero que o monstro morto renasça no mesmo Ponto de nascimento depois de 60 s, para que a área não se esvazie.
41. Como jogador, quero regenerar 4 de vida a cada 3 s, para me recuperar entre lutas.
42. Como jogador, quero que dentro dos muros de Valen nenhum monstro entre e ninguém ataque ninguém, para ter onde me reorganizar.

### Progressão

43. Como jogador, quero ganhar XP ao matar (Rato 4, Lobo 13) e subir de Nível pela curva decidida (Nível 2 = 100, 5 = 800, 10 = 9.300), para sentir o herói crescer.
44. Como jogador, quero que a vida máxima suba 25 por Nível, para aguentar monstros mais fortes.
45. Como jogador, quero que a Skill Espada suba com os golpes dados (110 golpes de 10→11, +25% por Skill), para que lutar me deixe mais forte.
46. Como jogador, quero ver Nível, XP até o próximo, Skill Espada e progresso da Skill, para acompanhar minha evolução.
47. Como jogador, quero um aviso visível ao subir de Nível ou de Skill, para comemorar.

### Saque

48. Como jogador, quero que o Saque (Ouro, troféus e, raramente, um Elmo de pele de lobo) vá direto para a mochila ao matar, sem abrir corpo, para não perder tempo.
49. Como jogador, quero uma mochila de 20 espaços em que troféus iguais empilham, com as poções num espaço próprio e o Ouro à parte, para saber quanto ainda cabe.
50. Como jogador, quero ver a mochila, o equipamento vestido e o Ouro numa janela HTML, para gerenciar meu herói.
51. Como jogador, quero ver o que caiu de cada monstro, para saber o que a caça está rendendo.
52. Como jogador, quero trocar o equipamento vestido por outro da mochila, para usar o que comprei ou achei.

### AUTO e Tática

53. Como jogador, quero ligar o AUTO de onde o herói está na Área de caça, para que ele cace sozinho pela minha Tática.
54. Como jogador, quero que o AUTO seja recusado dentro de Valen com uma mensagem clara, para entender que a Zona segura não permite.
55. Como jogador, quero configurar a Tática com 3 regras (beber poção abaixo de X% de vida, voltar abaixo de Y%, quantas poções levar), para controlar como o herói caça.
56. Como jogador novo, quero que a Tática venha preenchida com o padrão (poção abaixo de 50%, voltar abaixo de 15%, 20 poções), para não precisar entender tudo antes de caçar.
57. Como jogador, quero ver o herói em AUTO procurar monstros, lutar, beber poção e recolher Saque sozinho, para confiar na Caçada.
58. Como jogador, quero assumir o controle a qualquer momento (qualquer intenção manual), o que encerra a Caçada ali mesmo, sem levar a Valen, para jogar na mão quando quiser.
59. Como jogador, quero que o AUTO grave o Preparo (equipamento, atributos, poções, Tática) no início da Caçada, para que ela siga as mesmas regras online e offline.
60. Como jogador, quero que mudar a Tática ou o equipamento exija sair da Caçada, para que o Preparo não mude no meio.

### Retorno

61. Como jogador, quero que a Caçada termine com Retorno a Valen quando as poções acabam, a mochila enche, a vida fica crítica ou chega ao Teto de 12h, para que o herói não fique preso.
62. Como jogador, quero que, por vida crítica, o herói saia andando da luta, com os monstros batendo, e só seja levado a Valen depois de ~6 s, para que uma Tática ruim tenha consequência.
63. Como jogador, quero que os outros motivos de Retorno (poções, mochila, Teto) esperem a luta atual acabar, para não perder um monstro quase morto.
64. Como jogador, quero aparecer no templo de Valen no Retorno, com o Saque na mochila, para vender e me preparar.
65. Como jogador, quero ver no Retorno o motivo dele, para ajustar a Tática.

### Morte

66. Como jogador, quero que a Morte tire 30% do XP do Nível atual, sem cair de Nível, para que morrer doa sem destruir meu progresso.
67. Como jogador, quero que a Morte tire metade do Saque da Caçada (no Jogo manual, o Saque juntado desde a última saída de Valen), para que arriscar tenha preço.
68. Como jogador, quero que o Ouro que já estava comigo em Valen nunca se perca na Morte, para que vender seja seguro.
69. Como jogador, quero reaparecer no templo de Valen depois da Morte com a vida cheia, para continuar jogando.
70. Como jogador, quero ver claramente o que perdi na Morte, para entender a penalidade.

### Caçada offline

71. Como jogador, quero fechar o jogo com o herói em AUTO e que a mesma Caçada continue offline, com o mesmo Preparo e Diário, para o herói evoluir enquanto não estou.
72. Como jogador, quero que, se a minha conexão cair fora da cidade, o herói entre em AUTO na hora com a Tática dele, para não morrer por culpa da internet.
73. Como jogador que estava no Jogo manual quando a conexão caiu, quero que o AUTO ligue e comece uma Caçada ali, com o Preparo daquele momento, para não ficar parado no meio da luta.
74. Como jogador, quero que, se eu reconectar em até 30 s, eu retome o controle no mesmo lugar, para que uma oscilação de rede não vire Caçada offline.
75. Como jogador desconectado na cidade, quero que o herói só fique parado, para que nada aconteça em Valen.
76. Como jogador, quero que a Caçada offline dure no máximo 12h (Teto da Caçada), para que o retorno tenha limite claro.
77. Como jogador que volta com a Caçada ainda correndo, quero ver o herói no mundo, no tile onde a Cópia pessoal estava, ainda em AUTO, com o Diário até ali, para decidir se assumo.
78. Como jogador que volta depois que a Caçada acabou, quero aparecer em Valen com o Diário completo, para ver o que aconteceu.
79. Como jogador, quero que a Caçada offline renda exatamente o mesmo que o AUTO online renderia com o mesmo Preparo, semente e tempo, para nunca ser punido por fechar o jogo.
80. Como jogador com dois heróis, quero que cada um tenha a própria Caçada, para deixar os dois caçando.
81. Como autor, quero que a semente da Caçada nasça no servidor e nunca vá ao cliente, para que ninguém preveja o Saque.

### Diário da Caçada

82. Como jogador, quero ver o resumo da Caçada (duração, XP, Níveis, Skill, Ouro, Saque, poções usadas, Mortes, motivo do Retorno), para saber se valeu a pena.
83. Como jogador, quero abrir o golpe a golpe dos trechos offline da Caçada, para entender por que morri ou voltei.
84. Como jogador, quero ver os últimos 10 Diários de cada herói, para comparar Táticas.
85. Como jogador, quero que o trecho online de uma Caçada apareça no Diário como resumo, já que vi ao vivo, para que o Diário cubra a Caçada inteira.

### Vendedor

86. Como jogador, quero clicar no vendedor com o herói ao lado e abrir um menu HTML com Comprar e Vender, sem digitar palavras-chave, para negociar rápido.
87. Como jogador, quero comprar poções de vida a 10 de Ouro cada, para me preparar.
88. Como jogador, quero comprar as peças melhores (Espada 1.000, Capacete 1.200, Cota de malha 4.500, Calças de couro 2.000), para ficar mais forte.
89. Como jogador, quero vender troféus a preço fixo (Cauda de rato 15, Pele de lobo 35) e equipamento por 25% do preço (sem contar o Aprimoramento; Elmo de pele de lobo 600), para transformar Saque em Ouro.
90. Como jogador, quero vender todos os troféus de uma vez, para não clicar um por um.
91. Como jogador, quero que uma compra sem Ouro suficiente ou sem espaço na mochila seja recusada com o motivo, para entender o que falta.
92. Como jogador, quero que o menu só abra com o herói ao lado do NPC, para que a loja faça parte do mundo.

### Ferreiro e Aprimoramento

93. Como jogador, quero clicar no ferreiro e aprimorar qualquer peça comprada ou achada dos 4 Slots (arma, cabeça, corpo, pernas) de +1 a +5, para ficar mais forte com o Ouro que junto.
94. Como jogador, quero que o ferreiro recuse aprimorar o kit inicial, com o motivo, para entender que ele é feito para ser trocado.
95. Como jogador, quero ver o custo (metade do preço do item no +1, dobrando a cada nível) e a chance (+1 a +3 sempre; +4 60%; +5 40%) antes de confirmar, para decidir com informação.
96. Como jogador, quero que uma falha no +4 ou +5 só gaste o Ouro, sem perder nível nem quebrar o item, para que tentar não seja cruel.
97. Como jogador, quero que cada +1 de Aprimoramento na arma dê +2 de ataque e, nas peças de armadura, +1 de armadura a cada 2 níveis (+2 e +4), para sentir o efeito.
98. Como jogador, quero ver o Aprimoramento no nome e no ícone do item, para distinguir exemplares.

### Save e confiabilidade

99. Como jogador, quero que toda compra, venda, Aprimoramento e Retorno sejam gravados na hora, para nunca perder Ouro.
100. Como jogador, quero que posição, vida, XP e mochila em caça sejam salvos a cada 60 s e ao sair, para perder no máximo um minuto se algo der errado.
101. Como jogador, quero que meu Ouro e meu herói sobrevivam a reiniciar o servidor, para confiar no jogo.
102. Como jogador caçando quando o servidor reinicia, quero que isso seja tratado como uma queda de conexão (fora da cidade a Caçada segue offline; na cidade fico parado), para não perder a Caçada.
103. Como autor, quero que, antes de publicar uma atualização, o servidor feche a conta de todas as Caçadas offline com a versão antiga do `core`, guardando a versão em cada trecho, para que um ajuste de equilíbrio não mude o passado.
104. Como autor, quero que o servidor imponha o ritmo de passo e golpe, ignore intenções a mais no mesmo tick e desconecte (com log) quem passar do limite por segundo, para que um cliente adulterado não ganhe vantagem.
105. Como autor, quero que toda intenção inválida vire um evento de recusa, sem mudar o estado, para que o cliente saiba o que deu errado.
106. Como autor, quero que mochila, Ouro e XP só sejam enviados ao dono e o estado seja filtrado por área de interesse (~15×11 tiles + margem), para não vazar informação e economizar banda.

### Idiomas

107. Como jogador brasileiro, quero o jogo todo em PT-BR, para jogar na minha língua.
108. Como jogador estrangeiro, quero o jogo todo em EN-US, para entender tudo.
109. Como jogador, quero trocar o idioma nas configurações, com o idioma do sistema como padrão, para escolher.
110. Como autor, quero que nomes de monstros, itens, NPCs, mensagens de recusa e linhas do Diário venham de chaves de tradução, nunca de texto fixo, para trocar nomes ⚠ só editando arquivos (ADR-0004).
111. Como autor, quero que o CI falhe se uma chave existir em um idioma e faltar no outro, para nunca lançar texto pela metade.

### Arte e mapa

112. Como autor, quero gerar no Gemini o Rato, o vendedor, o ferreiro, o tileset (chão, muralha, templo, árvores, obstáculos) e os ícones de itens seguindo a ART-BIBLE, com fundo magenta, para completar a arte do Marco 1.
113. Como autor, quero um script que recorte o magenta, reduza para 64×64 com a mesma escala entre as direções, aplique a paleta comum de 48 cores e refaça o contorno de 1 px, para processar todo sprite igual.
114. Como autor, quero gerar a primeira versão do mapa (Valen ~40×30 e Área de caça ~100×80 com ~30 Pontos de nascimento) por script e refinar no Tiled, para não desenhar tudo à mão.
115. Como autor, quero que um passo de build converta o mapa do Tiled no formato compacto do `core` (grade de "dá para andar", Pontos de nascimento, zonas, NPCs, templo, região por tile), para que o mesmo mapa sirva ao `core` e ao cliente.
116. Como autor, quero que a versão do mapa faça parte da versão do `core`, para que mudar o mapa feche as Caçadas offline antes de valer.

### Equilíbrio

117. Como autor, quero um teste que rode a Tática padrão por várias sementes e confira Nível 8 em ~2h e a primeira peça melhor comprada em ~1h, como no simulador, para que o jogo real bata com o que foi decidido.

## Implementation Decisions

### Estrutura (ADR-0003, ticket 01)

- Monorepo pnpm com três partes: `core` (simulação pura, Vitest), `client` (Vite + Phaser 4.2 para o mundo, Preact/HTML para menus, Tauri 2.12 no PC) e `server` (Node ≥22 + Colyseus 0.18 com `@colyseus/schema` 5 e `@colyseus/sdk` 0.18, PostgreSQL via Drizzle 0.45 com o driver `pg`). Mais um passo de build de mapa e o script de processamento de sprites.
- Nada de API paga nem serviço cobrado por uso. Desenvolvimento roda no PC do autor.

### `core` — o módulo profundo do Marco 1

- **Interface pública** (ADR-0009): `passo(estado, intenções) → (estado novo, eventos)`, pura, avança um tick de 100 ms. Mais uma função de **Caçada em lote** que avança uma Cópia pessoal de um instante até outro (ou até o Retorno), pulando direto para o próximo tick com evento, e devolve o estado final, os eventos e o resumo do Diário. Todo o resto (combate, IA, Tática, Retorno, Morte, Saque, economia, progressão) fica atrás dessas duas portas.
- **Só inteiros**: porcentagens em partes por 10.000, arredondamento para baixo explícito. Lint proíbe `Math.random` e números decimais no `core`.
- **RNG sfc32 dentro do estado**. Na Cópia pessoal a semente nasce no servidor (`crypto`) quando a Caçada começa (ou quando passa a offline: semente nova) e nunca vai ao cliente. O mundo compartilhado também carrega um RNG semeado pelo servidor, mas não precisa ser reproduzível.
- **Estado** = o que existe agora (herói, monstros, mochila, Caçada ativa, RNG) e é o que vai para o save. **Eventos** = o que aconteceu no tick (passo, golpe com dano, poção, Saque, Nível, Skill, Morte, Retorno com motivo, recusa com motivo, compra, venda, Aprimoramento com sucesso/falha) e alimentam o Diário e as animações.
- **Intenções** (ADR-0010): `andar` (direção), `andar até` (tile; pathfinding em grade), `atacar` (alvo), `parar`, `AUTO`, `usar item` (poção; equipar), `comprar`, `vender`, `aprimorar`. Aplicadas no próximo tick; inválida → evento de recusa sem mudar o estado. Comprar, vender e aprimorar exigem o herói ao lado do NPC certo e dentro da Zona segura.
- **Durações em ticks**: golpe 20 ticks (herói e monstro), espera da poção 10, regen 4 de vida a cada 30, renascimento 600, fuga por vida crítica ~60. A duração do passo é um número inteiro de ticks a fixar no ticket do `core` (decisão de sensação, não de regra).
- **Fórmulas** (ticket 05):
  - Vida máxima = 150 + 25 × (Nível − 1).
  - XP total para o Nível L = ⌊50 × (L³ − 6L² + 17L − 12) / 3⌋.
  - Skill Espada começa em 10; 110 golpes dados para 10→11; cada próxima pede ⌊anterior × 125 / 100⌋.
  - Dano máximo do herói = ⌊Skill × ataque × 85 / 1000⌋ + ⌊Nível / 5⌋; ataque = ataque da arma + 2 por +1 de Aprimoramento.
  - Golpe = sorteio 0..dano máximo − sorteio 0..armadura do alvo, mínimo 0. Monstro bate igual contra a armadura do herói (soma das 4 peças).
  - Morte: perde 30% do XP do Nível atual (sem cair de Nível) e metade do Saque da Caçada; reaparece no templo com vida cheia.
- **Bônus de Aprimoramento nas peças de armadura** (decidido nesta spec): armadura da peça = armadura base + ⌊Aprimoramento / 2⌋ (+1 no +2 e no +4; +2 no +5). Na arma continua +2 de ataque por nível.
- **Monstros** (ticket 05): Rato vida 20, ataque 8, armadura 1, XP 4, Ouro 0–8, Cauda de rato 5%; Lobo vida 45, ataque 32, armadura 2, XP 13, Ouro 0–24, Pele de lobo 8%, Elmo de pele de lobo 0,3%. Atacam quem entra no raio de visão (~3 tiles); andam num raio de ~3 tiles do Ponto de nascimento; IA simples (perseguir, atacar, fugir): no Marco 1 o Rato tenta fugir com vida abaixo de 25% (2.500/10.000) e o Lobo luta até o fim; o limiar de fuga é dado da tabela de monstros. Na Cópia pessoal usam os mesmos Pontos de nascimento da área compartilhada, renascimento em ticks fixos, toda escolha aleatória do mesmo RNG.
- **Itens e preços** (ticket 07): tabela de Modelos de item no `core` (dados, não código), com os 4 Slots do Marco 1 (arma, cabeça, corpo, pernas), ataque/armadura, preço de compra, preço de venda (25% do preço, sem o Aprimoramento; troféus com preço fixo). Kit inicial: Espada curta (ataque 12), Capuz (1), Roupa (2), Calça (1) — armadura total 4. Poção de vida: cura 80, custa 10.
- **Aprimoramento**: custo do +1 = metade do preço do item; cada próximo, o dobro do anterior. +1 a +3 sempre dão certo; +4 tem 6.000/10.000 e +5 tem 4.000/10.000, sorteados pelo RNG do estado. Falha só gasta o Ouro. O kit inicial (sem preço) não se aprimora: o ferreiro recusa com evento de recusa.
- **Herói novo**: Guerreiro, Nível 1, Skill Espada 10, kit inicial vestido, 0 de Ouro, 20 poções de vida, no templo de Valen, Tática padrão (poção abaixo de 50%, voltar abaixo de 15%, 20 poções).
- **Mochila**: 20 espaços para Saque e equipamento não vestido; troféus iguais empilham até 100 por espaço; as poções ficam num espaço próprio, fora dos 20; o Ouro é um número à parte. Saque entra direto na mochila ao matar, sem abrir corpo; item que não cabe se perde, com aviso "mochila cheia" (no AUTO, mochila cheia é motivo de Retorno). Ouro do Saque soma no Ouro do herói, marcado como "Ouro da Caçada" até o Retorno, para a regra de Morte.
- **Caçada**: começa com a intenção `AUTO` fora da Zona segura (dentro dela, recusa). Grava o Preparo (equipamento, atributos, poções, Tática). A Tática decide as intenções do herói a cada tick (procurar o monstro mais próximo, travar alvo, beber poção abaixo de X%, iniciar o Retorno abaixo de Y%). Qualquer intenção manual do jogador encerra a Caçada no lugar, sem levar a Valen. Não há troca de Tática ou equipamento dentro da Caçada.
- **Retorno**: motivos = poções acabaram, mochila cheia, vida crítica, Teto da Caçada (12h, em ticks), jogador assumiu, Morte. Vida crítica: o herói sai andando da luta, com os monstros batendo, e é levado a Valen depois de ~6 s; os outros motivos esperam a luta atual acabar. Sempre termina no templo de Valen, menos quando o jogador assume.
- **Saque da Caçada no Jogo manual**: fora de Caçada, o "Saque da Caçada" usado pela Morte é o que entrou desde a última saída da Zona segura (Ouro e itens). Entrar em Valen zera essa conta.
- **Zona segura**: definida pelo mapa; monstros não entram, ninguém ataca, AUTO recusado.
- **Diário**: resumo (duração, XP, Níveis, Skill, Ouro, Saque, poções, Mortes, motivo do Retorno) e receita por trecho (Preparo, estado inicial da Cópia pessoal, semente, versão do `core`). O golpe a golpe é recalculado sob demanda reexecutando a receita, **só para os trechos offline**; o trecho online entra apenas como resumo.
- **Versão do `core`**: inclui a versão do mapa compacto. Cada trecho de Caçada offline guarda a versão que o calculou.

### Mapa (ticket 10, ADR-0011)

- Tiled, JSON `.tmj`, tileset 64×64. Camadas: chão; decoração; obstáculos (propriedade `bloqueia` por tile); por cima. Objetos: Ponto de nascimento (espécie, raio ~3, renascimento), NPC (vendedor, ferreiro), Zona segura (retângulo), templo. Cada tile marca a região a que pertence.
- Um mapa contínuo: Valen (~40×30, muralha, templo, vendedor, ferreiro) com o portão dando direto na Área de caça (~100×80, ~30 Pontos de nascimento, renascimento de 60 s). Ratos perto do portão (Níveis 1–4), Lobos mais longe (4–10), em grupos de 2–3 Pontos para ~1 encontro em 3 ter dois monstros.
- Build converte o `.tmj` no formato compacto do `core`; o cliente desenha direto do `.tmj`. A primeira versão do mapa é gerada por script e refinada pelo autor no Tiled.

### Servidor

- **Sala**: como "outros heróis no mesmo Mundo" fica para o Marco 2, a sala do Marco 1 simula o mapa para um herói conectado por vez (uma sala por herói em jogo). A sala chama `passo` a cada 100 ms (`setFixedTimestep`) com as intenções enfileiradas do herói ou as decisões da Tática. A divisão em salas por região e a disputa de monstros são do Marco 2.
- **Autenticação**: rota para pedir Convidado (cria Conta, devolve identificador + segredo de 256 bits; guarda só o hash; máximo 5 por IP por dia); rota que troca o segredo por um token de sessão de 24h; a sala valida o token em `onAuth`.
- **Heróis**: rotas para listar (2 vagas), criar (nome de 3 a 16 letras, espaço só entre palavras, único no Mundo, filtro de palavrões; só Guerreiro) e entrar com um herói.
- **Sincronização** (ADR-0010): estado com `@colyseus/schema`, patches a cada 50 ms, filtrado por área de interesse (~15×11 tiles + margem) com `StateView`; mochila, Ouro e XP só para o dono; eventos do tick como mensagens para quem está vendo. Previsão (`Predict`) só do passo do próprio herói.
- **Proteção**: ritmo imposto pelo servidor, intenções a mais no mesmo tick ignoradas, limite de intenções por segundo com desconexão e log (o número exato é fixado no ticket do servidor).
- **Queda de conexão**: fora da Zona segura liga o AUTO na hora (se estava no Jogo manual, começa uma Caçada ali com o Preparo do momento); na cidade, fica parado. Reconectar em até 30 s devolve o controle. Depois de 30 s a mesma Caçada passa a offline: o servidor cria a Cópia pessoal a partir do estado atual (vida, poções, mochila, tile) com semente nova e tira o herói da sala.
- **Reconexão com Caçada offline**: o servidor roda a Caçada em lote até o instante atual (relógio do servidor, até o Teto). Se ainda corre, o herói volta à sala no tile da Cópia, em AUTO, e o cliente mostra o Diário até ali. Se acabou, aparece em Valen com o Diário completo.
- **Reinício e atualização**: ao parar, o servidor grava tudo e trata cada herói conectado como desconectado (fora da cidade a Caçada segue offline; na cidade fica parado). Numa atualização, antes de publicar a versão nova, fecha a conta de todas as Caçadas offline até aquele instante com a versão antiga; o trecho seguinte usa a nova.
- **Save** (ADR-0010): compra, venda, Aprimoramento e Retorno gravados na hora, numa transação; posição, vida, XP e mochila em caça a cada 60 s e ao sair. Os valores de Ouro, XP e Saque gravados vêm sempre do estado do `core` no servidor.
- **Esquema** (Drizzle, migrações em transação): Conta (identificador, hash do segredo, `email` vazio, tipo `convidado | ligada`, criada em, IP de criação para o limite); sessão/token; herói (Conta, nome único, vocação, Nível, XP, Skill e progresso, vida, posição, Ouro, Tática); itens do herói (Modelo, Aprimoramento, vestido em qual Slot ou espaço da mochila, quantidade para troféus); poções; Caçada ativa (Preparo, início, Teto, Saque da Caçada, estado da Cópia pessoal quando offline); trechos da Caçada (semente, versão do `core`, início, fim, estado inicial); Diário (resumo + receita; últimos 10 por herói).

### Cliente

- Tauri 2.12 com origem do webview padrão (`http://tauri.localhost`), que nunca muda. CSP em `app.security.csp` com o host do servidor em `connect-src` (`wss` em produção, `ws://localhost` no dev).
- O segredo do Convidado vai para o Gerenciador de Credenciais do Windows via plugin de keyring do Tauri, nunca para o `localStorage`.
- **Telas HTML (Preact)**: abertura (pede ou recupera o Convidado e troca por token), heróis (2 vagas, criação com nome e erros de validação, aviso de e-mail com botão desativado), HUD (vida, XP, Nível, Skill, Ouro, poções, botão AUTO), mochila e equipamento, Tática, NPC (Comprar / Vender / Aprimorar, abre ao clicar no NPC com o herói ao lado), Diário (resumo, golpe a golpe dos trechos offline, últimos 10), aviso de Morte e de Retorno, configurações (idioma).
- **Mundo (Phaser 4)**: tilemap do `.tmj` em 64 px, escala inteira ×1/×2; camada "por cima" sobre o herói. Sprites parados em 3 direções, oeste espelhado. Animação por código como no protótipo do teste das 3 direções: andar com balanço vertical (~2 px) e leve inclinação alternada; ataque com avanço de ~6 px na direção e volta; dano com tremida e flash branco → vermelho; morte tombando de lado e escurecendo; sombra elíptica sob o personagem; barra de vida acima. Os números do protótipo eram para 32 px de grade e devem ser revistos para 64.
- Entrada: setas/WASD (`andar`), clique no chão (`andar até`), clique no monstro (`atacar`), Esc (`parar`), atalho de poção (`usar item`), botão AUTO.
- O cliente nunca calcula dano, Saque ou XP; só desenha estado e eventos do servidor. Prevê só o próprio passo e volta se o servidor recusar; as outras entidades são desenhadas ~100 ms atrás, interpoladas entre tiles.

### i18n

- Todo texto do jogo em arquivos de tradução PT-BR e EN-US: telas, mensagens de recusa, nomes de monstros, itens, NPCs, motivos de Retorno, linhas do Diário. O `core` e o servidor só emitem chaves e parâmetros; o cliente traduz. Idioma padrão = idioma do sistema; troca nas configurações.

### Arte (ADR-0005, ADR-0011, ticket 09)

- Gerada no Gemini via `mcp__pool__generate_image`, fundo magenta `#FF00FF`, bloco de estilo da ART-BIBLE em todo prompt. Sul do zero; norte e leste por edição citando o arquivo do sul no prompt; pose de corpo inteiro descrita em toda edição (o leste pode precisar de nova tentativa); oeste espelhado.
- Já existem Guerreiro e Lobo (em `assets/inbox/` e no branch do protótipo). Faltam: Rato, vendedor, ferreiro, tileset de Valen e da Área de caça, ícones dos itens, da poção e dos troféus.
- Processamento por script (base: `processar.py` do protótipo): recorte do magenta, mesma escala para as direções de um personagem, pés no chão do tile, paleta comum de 48 cores, contorno de 1 px refeito.
- Nenhum personagem da referência de estilo nem sprite do Tibia/OTClient entra no jogo.

### Distribuição (ticket 02)

- GitHub Releases (repositório público só de releases, se o código for privado), publicado pelo `tauri-action`; instalador NSIS sem assinatura de código; atualizador do Tauri 2 com chave própria guardada fora do repositório, com backup; cada versão enviada à Microsoft para análise de reputação. Espelho no itch.io fica para quando houver público (não é critério do Marco 1).

## Testing Decisions

- **Bom teste** = testa comportamento externo pela interface pública, não detalhes de implementação. Para o `core`: monta um estado, manda intenções, avança ticks e confere estado e eventos. Nada de testar funções internas de fórmula isoladas se o comportamento já aparece pelo `passo` (as fórmulas podem ter testes de tabela pequenos quando o número decidido precisa ser fixado, como "Nível 10 = 9.300 XP").
- **Seam principal: a interface pública do `core`** (`passo` + Caçada em lote). Cobre:
  - Movimento em grade, colisão, pathfinding, Zona segura, recusas.
  - Combate: ritmo de 20 ticks, dano, armadura, regen, poção com espera.
  - Progressão: curva de XP, Skill, vida por Nível.
  - Tática, AUTO, Retorno com cada motivo (inclusive a fuga de ~6 s e a espera da luta), assumir controle.
  - Morte: 30% do XP do Nível, metade do Saque da Caçada (e do Saque desde a última saída no Jogo manual), Ouro de Valen intacto.
  - Saque e mochila: 20 espaços, empilhamento de troféus até 100, poções fora.
  - Economia: preços, revenda a 25%, Aprimoramento com custo dobrando, chance de +4/+5, falha que só gasta Ouro, bônus na arma e na armadura, recusa do kit inicial.
  - IA: perseguir no raio de visão, fuga do Rato abaixo de 25%.
  - **Online = offline** (critério de pronto): no CI, N sementes rodadas tick a tick com `passo` e em lote com a Caçada em lote dão resultado idêntico (estado final e resumo do Diário).
  - **Reexecução do Diário**: recalcular um trecho pela receita dá os mesmos eventos.
  - **Equilíbrio** (critério de pronto): com a Tática padrão, várias sementes, laço de "Retorno → vende o Saque → compra poções e equipamento → volta" como no simulador, a média chega ao Nível 8 em ~2h e compra a primeira peça melhor em ~1h (com tolerância declarada no teste). Esse laço é só do teste, não é recurso do jogo.
  - Determinismo: mesma semente → mesmo resultado; lint sem `Math.random` e sem decimais.
- **Seam secundário: integração do servidor** (sala Colyseus + PostgreSQL real, sem mock do banco):
  - Convidado: criação, limite de 5 por IP por dia, troca do segredo por token, `onAuth` recusando token inválido ou vencido.
  - Heróis: 2 vagas, validação e unicidade do nome.
  - Compra, venda e Aprimoramento gravados em transação; Ouro e save sobrevivem a reiniciar o servidor.
  - Nenhum valor de Ouro, XP ou Saque aceito do cliente: um cliente de teste que manda mensagens fora das intenções ou com valores é ignorado/recusado, e o estado não muda.
  - Limite de intenções por segundo desconecta.
  - Queda de conexão: AUTO na hora, retomada em 30 s, passagem para offline depois; reconexão roda o lote até agora; reinício do servidor vira queda.
  - Fechamento das Caçadas offline com a versão antiga antes de uma atualização.
- **Cliente**: só um teste no CI que confere que toda chave i18n existe em PT-BR e EN-US (e que nenhum texto visível está fixo no código, por lint quando possível). O resto do cliente é validado jogando.
- **Prior art**: o repositório ainda não tem testes. Referências de comportamento: o simulador do ticket 05 (branch `prototype/formulas-m1`), cujos números o teste de equilíbrio reproduz, e o protótipo do teste das 3 direções (branch `prototype/teste-3-direcoes`) para a animação.

## Out of Scope

- Bênção de Aerion e sacerdotisa.
- Missões e mestre de missões.
- Depósito.
- Prioridade de alvo e magia de área na Tática.
- Patrulheiro, Mago e qualquer vocação além do Guerreiro.
- Conta com e-mail (o botão aparece desativado; a tabela já nasce pronta).
- Outros heróis no mesmo Mundo, disputa de monstros e Saque, chat (Marco 2).
- Slots de equipamento além de arma, cabeça, corpo e pernas; Suprimentos além da poção de vida.
- VIP, Gemas, Teto de 24h e qualquer monetização (Marco 8).
- Android, Steam, itch.io como critério, Microsoft Store, certificado de assinatura.
- Troca dos nomes ⚠ (Marco 10).
- Hospedagem fora do PC do autor.

## Further Notes

- **Decisões tomadas pelo autor durante esta spec** (2026-10-27), sobre pontos que os tickets não fixavam: herói novo com 0 de Ouro e 20 poções; mochila de 20 espaços com troféus empilhando até 100 e poções em espaço próprio; Saque direto na mochila e "Saque da Caçada" no Jogo manual = desde a última saída de Valen; golpe a golpe do Diário só nos trechos offline; reinício do servidor tratado como queda de conexão; Aprimoramento em armadura = ⌊nível / 2⌋; kit inicial não se aprimora; Rato foge abaixo de 25%. A fuga do Rato não estava no simulador e pode baixar um pouco o ritmo de XP nos Níveis 1–4.
- **Detalhes de sensação e operação** deixados para os tickets de implementação, sem mudar regra: duração do passo em ticks; número do limite de intenções por segundo; tolerância do teste de equilíbrio.
- **Equilíbrio x simulador**: o simulador usou mochila de 20 itens sem empilhar e não trocava equipamento no meio da simulação. Com troféus empilhando até 100, o Retorno por mochila cheia fica raro; com o kit melhor, o herói gasta menos poção. Os dois efeitos empurram o Ouro por hora um pouco para cima; o teste de equilíbrio deve medir isso e, se sair da faixa do roadmap, o ajuste é de números, não de regra.
- **Caçada offline encerra no Retorno**: como o Retorno leva a Valen e encerra a Caçada, com 20 poções o offline costuma terminar bem antes do Teto de 12h. Isso já é o que o ticket 06 decidiu; o teste de equilíbrio usa o laço de reabastecimento só para comparar com o simulador.
- **Risco do Marco 2**: o `StateView` do Colyseus não é otimizado para muitos heróis; o Marco 1 já marca a região de cada tile para dividir em salas por região depois.
- **Ordem sugerida das fatias verticais** para o `/to-tickets`: (1) esqueleto do monorepo com um herói andando em grade num mapa mínimo, servidor autoritativo e cliente desenhando; (2) Convidado, heróis e save; (3) combate manual e progressão com Rato e Lobo; (4) Saque, mochila, vendedor; (5) AUTO, Tática, Retorno e Morte; (6) Caçada offline, Diário e teste online = offline; (7) ferreiro e Aprimoramento; (8) mapa completo e arte do Gemini; (9) i18n completo e teste de chaves; (10) instalador, atualizador e reinício/atualização do servidor; (11) teste de equilíbrio.
