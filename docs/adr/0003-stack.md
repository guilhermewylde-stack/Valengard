# Monorepo TypeScript, servidor em tempo real, menus em HTML

pnpm com `packages/core` (simulação pura em ticks, Vitest, usada pelo cliente e pelo servidor), `apps/client` (Vite + Phaser para o mundo, Preact/HTML para os menus; Tauri no PC, Capacitor no Android) e `apps/server` (Node + Colyseus para salas em tempo real, PostgreSQL via Drizzle). Menus em HTML porque um RPG é sobretudo mochila, loja e fichas, e HTML resolve texto, i18n e telas de vários tamanhos melhor que o canvas. PostgreSQL desde o início porque é o dialeto mais bem suportado pelo Drizzle (com `RETURNING`), as migrações rodam em transação (uma migração que falha não deixa o banco pela metade) e há planos grátis hospedados (Neon, Supabase) para quando sair do PC do autor.

## Considered Options

- MariaDB, já instalado como serviço no PC do autor para o projeto LOTR: economizaria uma instalação, mas DDL sem transação e suporte de segunda classe no Drizzle pesam mais que isso.

## Consequences

Desenvolvimento e teste fechado rodam no PC do autor, sem custo. A VPS (~€5/mês) só entra no teste aberto, com aprovação explícita.
