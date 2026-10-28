# MMO completo no lançamento, mundo compartilhado, PvP só consensual

Substitui a parte "sem multiplayer real no lançamento" do ADR-0002 e a premissa de "jogador comandante" do ADR-0001. O idle é uma comodidade; jogar na mão vale muito. O lançamento traz mundo aberto compartilhado como o Tibia, Dungeons, raids, BG e PvP; conteúdo de grupo e PvP só no Jogo manual, com recompensas que o idle não alcança. Manual e idle seguem as mesmas regras na caça solo, sem multiplicador: quem joga na mão rende mais por decidir melhor. PvP só consensual (arena, BG, desafio), sem perda de itens para ataque surpresa.

## Consequences

- O servidor passa a simular o mundo em tempo real (WebSocket), não só validar contas; o `core` nasce em ticks para rodar dentro dele.
- Monstros disputados por vários jogadores quebram a Caçada como conta isolada do ADR-0001: ver a decisão sobre idle em mundo compartilhado.
- O escopo do lançamento cresce muito; o Marco 1 continua sendo uma fatia vertical pequena.
