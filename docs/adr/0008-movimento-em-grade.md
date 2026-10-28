# Movimento em grade, passo a passo, com alvo travado

O herói e os monstros andam um tile por vez numa grade, como no Tibia, e o combate é por alvo travado: o jogador clica no monstro e o herói golpeia sozinho no ritmo da arma. A grade torna o servidor autoritativo e a Caçada determinística muito mais simples (colisão por tile, pathfinding em grade, estado pequeno para sincronizar) e combina com os sprites em 3 direções do ADR-0005.

## Considered Options

- Movimento livre em pixels: mais fluido, mas exige interpolação, física e reconciliação no servidor, e foge do estilo Tibia.
