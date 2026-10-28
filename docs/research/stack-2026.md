# Pesquisa: stack em 2026 (valida a ADR-0003)

Data da pesquisa: 2026-10-27. Ticket: `docs/tickets/valengard-roadmap/issues/01-stack-2026.md`.
Fontes primárias: documentação oficial, GitHub Releases e registro npm (datas de publicação). Onde a página não informa o ano, está marcado.

## Veredito

Nada invalida a ADR-0003. Duas correções de versão e uma decisão a tomar:

1. **Colyseus**: usar a linha **0.18** (não 0.16/0.17). Exige Node >= 22.
2. **Phaser**: **Phaser 4 já é estável** (4.0.0 em abril/2026, 4.2.1 em jul/2026). Começar direto no 4; o Phaser 3 está parado em 3.90.0 (mai/2025).
3. **Drizzle**: a versão `latest` no npm ainda é a **0.45.4**; a 1.0 só existe como RC (rc.5, 21 out 2026). Decidir se fixa 0.45.x (estável) ou entra no 1.0-rc.

## 1. Colyseus

### Versão estável
- npm `colyseus@latest` = **0.18.10** (2026-10-22). 0.18.0 saiu em 2026-05-22; 0.17.0 em 2026-01-09; 0.16.0 em 2025-02-17. Há também `legacy-0.17` = 0.17.11. [registro npm](https://registry.npmjs.org/colyseus)
- `engines.node >= 22` no pacote 0.18.10. [registro npm](https://registry.npmjs.org/colyseus/latest)
- SDK de cliente: `@colyseus/sdk` 0.18.8 (2026-10-26). `@colyseus/schema` 5.x (latest 5.0.42, 2026-10-20). [Releases](https://github.com/colyseus/colyseus/releases)
- Guia 0.18 exige `@colyseus/schema` ^5.0.8 e `@colyseus/sdk` ^0.18.1. [Migração 0.18](https://docs.colyseus.io/migrating/0.18)

### Como funciona a sincronização
- O servidor define o estado com `schema()` / `t.*` (ou decoradores `@type`). Só o servidor muta o estado; clientes enviam mensagens (`room.send`) e o servidor aplica. [State](https://docs.colyseus.io/state)
- Cada `Schema` tem um `ChangeTree`; a cada intervalo de patch só as propriedades alteradas são codificadas em binário. Só a última mutação de cada propriedade é enviada no intervalo (várias mudanças no mesmo tick colapsam). Ao entrar, o cliente recebe os tipos e o estado completo. [State](https://docs.colyseus.io/state)
- **patchRate padrão: 50 ms (20 fps)**; `patchRate = null` desliga e você chama `broadcastPatch()`. Loop de simulação padrão 16,6 ms (~60 fps); `setTimestep()` (antigo `setSimulationInterval`, ainda funciona); `setFixedTimestep(step, tickRate)` para passo fixo. `maxClients` padrão `Infinity`. Mensagens usam MsgPack. [Room](https://docs.colyseus.io/room)
- Callbacks no cliente: `onAdd`, `onRemove`, `onChange`, `listen`. Cliente: `@colyseus/sdk` (JS/TS).

### Limites relevantes
- **Máximo de 63 campos por Schema** (0.18; era 64), contando campos herdados; estoura na definição da classe. Usar Schemas aninhados. [Migração 0.18](https://docs.colyseus.io/migrating/0.18), [State](https://docs.colyseus.io/state)
- Sem arrays multidimensionais; `NaN` vira 0; a ordem de definição dos campos precisa ser idêntica em cliente e servidor. [State](https://docs.colyseus.io/state)
- **StateView** (visibilidade por cliente, base para área de interesse: `view.add/remove/subscribe`). A própria doc avisa para não confiar nele com grandes volumes de dados, pois ainda não é otimizado; o custo cresce com o número de views distintas. [State View](https://docs.colyseus.io/state/view)
- Novos na 0.18: `defineInput()`, `setFixedTimestep()`, `allowRewindState()`, `room.input()`/`Predict` no cliente (predição e compensação de lag), `room.request()`. Úteis para movimento tile a tile com predição. [Migração 0.18](https://docs.colyseus.io/migrating/0.18)
- Removidos: `client.id` (usar `sessionId`), serializer fossil-delta.

### Impacto para Valengard
- Um mundo compartilhado com muitos monstros em **uma só sala sem filtro** manda a todos tudo que muda. O padrão de patch (20 Hz, só mudanças) é bom para movimento grid-a-grid (poucas mudanças por tick), mas escala mal sem AOI. Mitigações: dividir o mundo em salas por mapa/região e/ou StateView por área (testar com carga). **Não há benchmark oficial**; é preciso medir (candidato a ticket de protótipo).
- Como `packages/core` é determinístico e compartilhado, o Colyseus serve de transporte/estado de apresentação; manter a simulação no core e espelhar no Schema o que o cliente precisa ver.
- Persistência vai ao PostgreSQL, não ao Schema. A 0.18 traz `@colyseus/database` opcional; não é necessário (Drizzle cobre).

## 2. Phaser 3 vs Phaser 4

- Releases: **v4.0.0** (abril/2026; a página não mostra o ano, mas 4.1.0 é de 30 abr 2026), **v4.1.0** 30 abr 2026, **v4.2.0** 19 jun 2026, **v4.2.1** 9 jul 2026. Todos publicados como releases normais; os RC ficaram marcados como pré-release. [GitHub Releases](https://github.com/phaserjs/phaser/releases)
- npm `phaser@latest` = **4.2.1** (2026-07-09). [registro npm](https://registry.npmjs.org/phaser)
- Phaser 3: última versão **3.90.0** (23 mai 2025), sem novidades desde então. [GitHub Releases](https://github.com/phaserjs/phaser/releases)
- Phaser 4: novo renderizador WebGL baseado em nós, sistema de Filters unificado, `SpriteGPULayer`, **`TilemapGPULayer`**, Tint revisado. [GitHub Releases](https://github.com/phaserjs/phaser/releases)
- **Tilemap**: carrega JSON do Tiled, mapas ortogonais (também isométrico/hex), `createLayer()` por nome ou índice, colisão por índice de tile. Restrições: tilesets precisam estar embutidos no JSON, tilesets "coleção de imagens" não são suportados, grupos de camadas são achatados. No Phaser 4, `createLayer` com a opção `gpu` cria `TilemapGPULayer` (só WebGL, só ortogonal, mais rápido, menos flexível). [Docs Tilemap](https://docs.phaser.io/api-documentation/class/tilemaps-tilemap)
- **Vite**: o template oficial `phaserjs/template-vite-ts` foi atualizado para Phaser 4 (README cita Vite 6.3.1 e TS 5.7.2; hoje o Vite `latest` é 8.3.5). O template envia telemetria anônima em dev/build (usar `dev-nolog`/`build-nolog` ou remover). [Template](https://github.com/phaserjs/template-vite-ts)
- Para pixel art, o 4.0 RC3 adicionou `vertexRoundMode` e o filtro Blocky. [GitHub Releases](https://github.com/phaserjs/phaser/releases)
- Não verificado: guia de migração 3 -> 4 e compatibilidade de plugins (changelog inacessível). Projeto novo, sem migração; só conferir plugins que forem usados.
- **Recomendação**: Phaser 4.2.x com versão exata fixada.

## 3. Tauri 2 + Vite + WebSocket

- Versões: crate `tauri` **2.12.5** (21 out; a página não mostra o ano); `tauri-cli` 2.12.4; `@tauri-apps/api` 2.12.4 (2026-10-14). A 3.0 só existe em alpha. [Releases](https://github.com/tauri-apps/tauri/releases), [npm](https://registry.npmjs.org/@tauri-apps/api)
- **CSP**: só é aplicada se definida em `app.security.csp` no `tauri.conf.json`; `devCsp` é separado para desenvolvimento (se ausente, vale a mesma). O Tauri injeta nonces/hashes dos próprios assets. O exemplo oficial restringe `connect-src` a `ipc:` e `http://ipc.localhost`, então é preciso **acrescentar o host do servidor**, por exemplo `connect-src ipc: http://ipc.localhost wss://jogo.exemplo.com` (e `ws://localhost:2567` no `devCsp`). A página do Tauri não trata ws/wss explicitamente; o controle por `connect-src` é o comportamento padrão de CSP. [CSP](https://v2.tauri.app/security/csp/), [Config](https://v2.tauri.app/reference/config/)
- **Origem no Windows**: por padrão `http://tauri.localhost`; com `useHttpsScheme: true` vira `https://tauri.localhost` (vale também para Android). A doc diz que o esquema HTTPS **não permite mixed content**. Mudar isso entre versões perde IndexedDB/cookies/localStorage, então decidir cedo. [Config](https://v2.tauri.app/reference/config/)
- Inferência (sem fonte primária): em produção usar sempre `wss://` com TLS válido; `ws://` remoto a partir de página HTTPS seria mixed content. Em dev local `ws://localhost` funciona.
- WebAssembly no frontend exige `'wasm-unsafe-eval'` em `script-src`. Evitar scripts de CDN. [CSP](https://v2.tauri.app/security/csp/)
- Nenhum bloqueio conhecido ao usar `@colyseus/sdk` (WebSocket do webview) no Tauri; confirmar num protótipo curto.

## 4. Drizzle + PostgreSQL

- npm `drizzle-orm@latest` = **0.45.4** (2026-10-08). A **1.0 está em release candidate**: `1.0.0-rc.5` (2026-10-21), após beta.1 a beta.23 e rc.1 a rc.4. [Releases](https://github.com/drizzle-team/drizzle-orm/releases), [npm](https://registry.npmjs.org/drizzle-orm)
- rc.5 traz mudança incompatível no driver `postgres-js` (remover `JSON.stringify` manual em json/jsonb para evitar dupla serialização); rc.1 removeu RQBv1 (`db._query`) para Postgres. [Releases](https://github.com/drizzle-team/drizzle-orm/releases)
- Drivers PostgreSQL: `pg` (node-postgres) latest 8.23.1 (2026-09-30); `postgres-js` também suportado. [npm pg](https://registry.npmjs.org/pg)
- **Recomendação**: começar na 0.45.x estável (com o `drizzle-kit` correspondente) e `pg`; migrar para a 1.0 quando sair do RC. Registrar na ADR.

## Itens em aberto / riscos

1. Escala de um mundo com muitos monstros no Colyseus: sem números oficiais. Fazer protótipo de carga (N monstros, M clientes, patchRate 50 ms) antes de fixar a topologia (sala por mapa vs. StateView).
2. Fixar versões: Colyseus 0.18.x + schema 5.x + sdk 0.18.x, Phaser 4.2.x, Tauri 2.12.x, Vite 8.x, Node 22.
3. Decidir Drizzle 0.45 vs 1.0-rc.
4. Decidir `useHttpsScheme` do Tauri antes do primeiro save local de usuários.
5. Não verificados em fonte primária: guia de migração Phaser 3->4, comportamento do WebView2 com `ws://` remoto, Capacitor/Android (fora do escopo).
