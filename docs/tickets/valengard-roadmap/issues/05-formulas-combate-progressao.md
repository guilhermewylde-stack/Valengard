# Fórmulas de combate e progressão do Marco 1

Type: prototype
Status: resolved
Blocked by: 03

## Question

Quais fórmulas o M1 usa para dano, defesa, ritmo de golpe, curva de XP por Nível, ganho de Skill Espada, vida e regeneração, e a perda de XP na Morte? Protótipo: uma planilha ou simulador que rode 1h de Caçada na Área de caça do M1 e mostre níveis, mortes e Ouro.

## Answer

Protótipo: `prototipos/05-formulas-m1/index.html` no branch `prototype/formulas-m1` (commit 367c1d9, no GitHub). Ele também serve ao ticket 07.

**Fórmulas** (só inteiros, ⌊⌋ = arredonda para baixo):

- Vida máxima = 150 + 25 × (Nível − 1); regen de 4 de vida a cada 3 s.
- XP total para o Nível L = ⌊50 × (L³ − 6L² + 17L − 12) / 3⌋ (Nível 2 = 100, 5 = 800, 10 = 9.300).
- Skill Espada: 110 golpes para 10→11; cada próxima pede ⌊anterior × 125 / 100⌋. Cada golpe dado conta 1.
- Dano máximo do herói = ⌊Skill × ataque × 85 / 1000⌋ + ⌊Nível / 5⌋, com ataque = arma + 2 por +1 de Aprimoramento.
- Golpe: sorteio 0..dano máximo menos sorteio 0..armadura do alvo (mínimo 0); o monstro bate igual contra a armadura do herói. Ritmo de 2 s (20 ticks) para os dois lados.
- Morte: perde 30% do XP do Nível (sem cair de Nível) e metade do Saque da Caçada.

**Números iniciais do Marco 1**: herói com armadura 4 e espada de ataque 12; poção cura 80 (espera de 1 s); Rato: vida 20, ataque 8, armadura 1, XP 4; Lobo: vida 45, ataque 32, armadura 2, XP 13. Tática padrão: poção abaixo de 50%, voltar abaixo de 15%, 20 poções.

**Resultado com a Tática padrão** (20 sementes): Nível 6 e Skill 16 em 1h, Nível 8 em ~2h, Nível 10 em ~4h; ~0,15 Morte na primeira hora e quase nenhuma depois. Com Tática ruim (poção abaixo de 20%), ~0,65 Morte na primeira hora e Mortes ao longo de todas as horas. A área serve do Nível 1 ao 10.

**Regras novas que o protótipo pediu**:

- **Retorno por vida crítica leva tempo**: o herói sai andando da luta, com os monstros batendo, e só é levado a Valen depois de ~6 s. Online e offline igual. É isso que faz a Tática importar e a Morte existir.
- **Monstros atacam quem entra no raio de visão** (~3 tiles); a área é desenhada para que ~1 encontro em 3 tenha dois monstros (ticket 10).
- Os outros Retornos (poções acabaram, mochila cheia, Teto) esperam a luta atual acabar.

O Ouro ficou só "não negativo" com a Tática padrão; os valores são do ticket 07.
