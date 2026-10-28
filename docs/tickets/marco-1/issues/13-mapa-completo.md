# 13: Mapa completo

Type: task
Status: ready-for-agent
Blocked by: 04, 12
Spec: [Marco 1](../spec.md)

## What to build

O mundo inteiro do Marco 1: Valen murada, com templo, vendedor e ferreiro, e o portão dando direto numa Área de caça contínua com Ratos perto e Lobos longe, do Nível 1 ao 10. A primeira versão sai de um script; o autor refina no Tiled.

Decisões: ticket 10 do roadmap.

## Acceptance criteria

- [ ] Script gera o `.tmj`: Valen ~40×30 (muralha, templo, vendedor, ferreiro, Zona segura) e Área de caça ~100×80 contínua, com o tileset do ticket 12.
- [ ] ~30 Pontos de nascimento, renascimento de 60 s; Ratos perto do portão (Níveis 1–4), Lobos mais longe (4–10), em grupos de 2–3 pontos para ~1 encontro em 3 ter dois monstros.
- [ ] Camadas chão, decoração, obstáculos (`bloqueia`) e por cima; cada tile marca a região.
- [ ] O build gera o formato compacto do `core`, e a versão do mapa entra na versão do `core`.
- [ ] Servidor e cliente usam o mapa completo no lugar do de teste.
- [ ] Teste do `core`: todo Ponto de nascimento e todo NPC alcançáveis a partir do templo; nenhum tile da Zona segura acessível a monstros.
- [ ] O autor refina no Tiled e aprova antes de fechar o ticket.
