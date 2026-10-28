# 01: Esqueleto andante

Type: task
Status: ready-for-agent
Blocked by: — (pode começar já)
Spec: [Marco 1](../spec.md)

## What to build

O primeiro caminho de ponta a ponta: o jogador abre o cliente (Tauri no PC; navegador só no desenvolvimento), vê um mapa mínimo em 64 px e anda com o Guerreiro tile a tile pelas setas/WASD. Quem decide o passo é o servidor: a sala Colyseus chama a função pura `passo(estado, intenções)` do `core` a cada tick de 100 ms, e o cliente só manda a intenção `andar` e desenha o estado que volta.

Cria o monorepo pnpm (`core`, `client`, `server`) na stack do ADR-0003 e do ticket 01 do roadmap (Colyseus 0.18, Phaser 4.2, Tauri 2.12, Node ≥22), o CI e a base do i18n.

## Acceptance criteria

- [x] Monorepo pnpm com `core` (Vitest), `server` e `client`; `pnpm test` roda no CI a cada push.
- [x] Lint do `core` proíbe `Math.random` e números decimais; o CI falha se aparecerem.
- [x] `core` expõe `passo(estado, intenções) → (estado novo, eventos)`, puro, com RNG sfc32 no estado e a intenção `andar` (direção); tile bloqueado recusa o passo com evento de recusa.
- [x] Passo de build converte um `.tmj` mínimo do Tiled (tileset 64×64; camadas chão, decoração, obstáculos com `bloqueia`, por cima) no formato compacto do `core` (grade "dá para andar", zonas, NPCs, templo, região por tile).
- [x] Sala Colyseus com tick fixo de 100 ms aplica as intenções enfileiradas no próximo tick e sincroniza o estado.
- [x] Cliente desenha o tilemap do `.tmj` e o Guerreiro com os sprites parados do protótipo (sul, norte, leste; oeste espelhado), virando para a direção do passo.
- [ ] Cliente roda dentro do Tauri em modo dev, com a origem do webview padrão (`http://tauri.localhost`).
- [x] Base de i18n com PT-BR e EN-US; teste no CI falha se uma chave existe num idioma e falta no outro.
- [x] Testes do `core` pela interface pública: andar, colisão, recusa.

## Comments

- 2026-10-27: implementado tudo menos rodar no Tauri. Monorepo, CI, lint do core, passo com andar, build do mapa, sala Colyseus a 10 ticks/s, cliente Phaser e i18n com teste de chaves; verificado no navegador (andar, virar, recusa na muralha). O shell Tauri existe (identificador com.valengard.cliente, que não deve mudar), mas falta compilar: as Build Tools do Visual Studio (C++) não instalaram. Duração do passo provisória em 3 ticks (o ticket 02 fixa).
