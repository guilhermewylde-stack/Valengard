# 04: Combate manual com Rato e Lobo

Type: task
Status: ready-for-agent
Blocked by: 02, 03
Spec: [Marco 1](../spec.md)

## What to build

O jogador sai de Valen, encontra Ratos e Lobos, clica num deles e o herói anda até ele e golpeia sozinho a cada 2 s. Os monstros atacam quem entra no raio de visão, o Rato tenta fugir com pouca vida, e o morto renasce no Ponto de nascimento depois de 60 s. Matar dá XP; o herói sobe de Nível e de Skill Espada pelas fórmulas do ticket 05 do roadmap.

## Acceptance criteria

- [ ] Tabela de monstros no `core` (dados): Rato vida 20, ataque 8, armadura 1, XP 4, foge abaixo de 25%; Lobo vida 45, ataque 32, armadura 2, XP 13, luta até o fim.
- [ ] Pontos de nascimento lidos do mapa (espécie, raio ~3 tiles, renascimento de 600 ticks); a IA persegue e ataca quem entra no raio de visão (~3 tiles).
- [ ] Intenções `atacar` (alvo travado: anda até o alvo e golpeia) e `parar`.
- [ ] Golpe a cada 20 ticks para os dois lados; dano = sorteio 0..dano máximo − sorteio 0..armadura, mínimo 0; dano máximo do herói = ⌊Skill × ataque × 85 / 1000⌋ + ⌊Nível / 5⌋.
- [ ] Vida máxima = 150 + 25 × (Nível − 1); regen de 4 a cada 30 ticks.
- [ ] XP total para o Nível L = ⌊50 × (L³ − 6L² + 17L − 12) / 3⌋; Skill: 110 golpes de 10→11, cada próxima ⌊anterior × 125 / 100⌋.
- [ ] Eventos de golpe (com o dano), morte de monstro, Nível e Skill; o cliente mostra números de dano, barras de vida e aviso de Nível/Skill.
- [ ] HUD: vida, XP até o próximo Nível, Nível, Skill e progresso.
- [ ] Animações por código: ataque com avanço, dano com tremida e flash, morte tombando e escurecendo, sombra.
- [ ] Mapa de teste com Ratos e Lobos fora de Valen (o mapa completo é o ticket 13); arte provisória para o Rato até o ticket 12.
- [ ] XP, Nível e Skill entram no save.
- [ ] Testes do `core`: tabela de XP (Nível 2 = 100, 5 = 800, 10 = 9.300), progressão de Skill, ritmo de golpe, armadura, fuga do Rato, renascimento, agressão no raio de visão.
