# Roadmap do Valengard

> Destino do mapa [Valengard do MVP ao lançamento](tickets/valengard-roadmap/map.md). Só ordem e
> critério de pronto, sem estimativas de tempo. O Marco 1 está decidido e segue para o
> `/to-spec`; os outros são esboço, com as perguntas abertas, e cada um ganha o próprio mapa
> ou spec quando chegar a vez. Um Mundo só, do Marco 2 até o lançamento.

## Marco 1 — Fatia vertical (PC)

**Escopo**

- Conta de Convidado no PC, sem login ([ticket 08](tickets/valengard-roadmap/issues/08-conta-convidado-pc.md)); 2 vagas de herói, só Guerreiro.
- Valen (Zona segura) com vendedor e ferreiro, e 1 Área de caça contínua com Rato e Lobo, do Nível 1 ao 10 ([Formato de mapa](tickets/valengard-roadmap/issues/10-formato-de-mapa.md)).
- Jogo manual e AUTO simulados pelo servidor em tempo real, com movimento em grade e alvo travado ([ADR-0008](adr/0008-movimento-em-grade.md)); o cliente só manda intenções ([ADR-0010](adr/0010-cliente-manda-intencoes.md)).
- `core` puro em ticks inteiros de 100 ms ([ADR-0009](adr/0009-simulacao-em-ticks-inteiros.md)), com as fórmulas de combate e progressão ([ticket 05](tickets/valengard-roadmap/issues/05-formulas-combate-progressao.md)).
- Caçada offline calculada pelo `core` no servidor, teto de 12h, Retorno a Valen, Diário ([ticket 06](tickets/valengard-roadmap/issues/06-cacada-offline.md)).
- Saque, venda, compra de equipamento e Aprimoramento até +5 nos 4 Slots ([ticket 07](tickets/valengard-roadmap/issues/07-economia-m1.md)); poção de vida como único Suprimento.
- Tática com 3 regras (poção abaixo de X%, voltar abaixo de Y%, quantas poções levar); Morte com perda de XP e de metade do Saque.
- Save no servidor; arte do Gemini em 64×64 por tile, parada nas 3 direções e animada por código ([ADR-0005](adr/0005-sprites-parados-animacao-por-codigo.md), [ADR-0011](adr/0011-arte-em-64-px.md)).
- Textos em PT-BR e EN-US via i18n.
- Cliente instalável pelo GitHub Releases com atualizador do Tauri ([ticket 02](tickets/valengard-roadmap/issues/02-distribuicao-pc.md)), na stack do [ADR-0003](adr/0003-stack.md) ([ticket 01](tickets/valengard-roadmap/issues/01-stack-2026.md)).

**Fica de fora**: Bênção e sacerdotisa, Missões, Depósito, prioridade de alvo, magia de área, outras vocações, Conta com e-mail, outros heróis no mesmo Mundo.

**Pronto quando**

- Um jogador instala o cliente, abre sem criar login, cria um Guerreiro com nome e entra em Valen.
- Joga na mão e liga o AUTO na Área de caça; fecha o jogo, volta horas depois e recebe a Caçada offline com o Diário, sem diferença entre online e offline (teste no CI com N sementes, tick a tick e em lote).
- Com a Tática padrão chega ao Nível 8 em ~2h e compra a primeira peça melhor em ~1h, como no simulador.
- Vende o Saque, compra equipamento e aprimora no ferreiro; o Ouro e o save sobrevivem a reiniciar o servidor.
- Nenhum valor de Ouro, XP ou Saque vem do cliente.
- Todo texto aparece em PT-BR e EN-US.

## Marco 2 — Mundo compartilhado

**Escopo**: vários heróis no mesmo Mundo, monstros disputados, chat.

**Pronto quando** (esboço): vários jogadores caçam na mesma área, manual e AUTO misturados, sem que o servidor caia ou o Saque fique ambíguo.

**Perguntas abertas**: como se disputam monstros e Saque (primeiro golpe, maior dano, compartilhado); áreas cheias de heróis em AUTO; chat e moderação; quantos heróis um Mundo aguenta (o `StateView` do Colyseus não é feito para grandes volumes: protótipo de carga e/ou salas por mapa).

## Marco 3 — Conteúdo solo

**Escopo**: Patrulheiro e Mago, regiões até a Fortaleza (~45), cadeia de Missões, Depósito, Bênção de Aerion e sacerdotisa, Conta com e-mail.

**Pronto quando** (esboço): um herói de qualquer vocação vai do Nível 1 ao ~45 por regiões e Missões, e o Convidado liga um e-mail sem perder nada.

**Perguntas abertas**: equilíbrio entre as 3 vocações; regiões e faixas de nível; modelos de item por região; o fluxo do Convidado para Conta com e-mail.

## Marco 4 — Dungeon

**Pronto quando** (esboço): um grupo entra numa instância própria, enfrenta um chefe e sai com recompensa que o idle não alcança.

**Perguntas abertas**: instâncias, tamanho do grupo, chefe, recompensas.

## Marco 5 — Raid

**Pronto quando** (esboço): um evento agendado reúne muitos heróis contra um chefe e recompensa quem participou.

**Perguntas abertas**: agenda, escala, recompensa por participação.

## Marco 6 — BG/PvP

**Pronto quando** (esboço): PvP só consensual (BG, arena, desafio), com pareamento e o que se ganha definidos.

**Perguntas abertas**: formato da BG, pareamento, arena e desafio, recompensas.

## Marco 7 — Android

**Pronto quando** (esboço): o mesmo herói e o mesmo save jogam no PC e no celular, com a Caçada offline avisando por notificação local.

**Perguntas abertas**: Capacitor; notificação local; a mesma Conta nos dois; escala da arte de 64 px em telas entre ×1 e ×2 (ADR-0011).

## Marco 8 — Monetização

**Escopo**: Gemas, Pacote do Aventureiro, VIP, Passe da Jornada, Recompensa diária, com pagamento em sandbox; nunca vender o que o [ADR-0006](adr/0006-o-que-nunca-vendemos.md) proíbe.

**Pronto quando** (esboço): toda compra passa de ponta a ponta em sandbox, validada no servidor, no PC e no Android.

**Perguntas abertas**: provedor de pagamento no PC (cobra por transação, precisa de aprovação); Google Play Billing; ECA Digital; revisão do ADR-0006 ("por ora"); o que é a "Caçada extra na fila" do VIP.

## Marco 9 — Teste fechado

**Pronto quando** (esboço): um grupo de convidados joga no servidor do PC do autor, sem custo, e a telemetria mostra onde abandonam.

**Perguntas abertas**: como expor o servidor (túnel ou porta); quem convidar; telemetria.

## Marco 10 — Lançamento

**Escopo**: troca dos nomes ⚠ ([ADR-0004](adr/0004-nomes-de-trabalho.md)), hospedagem e teste aberto, depois Play Store e PC (site/itch.io).

**Pronto quando** (esboço): nenhum nome ⚠ restante, termos e LGPD publicados, servidor fora do PC do autor, cliente nas lojas.

**Perguntas abertas**: nomes substitutos; hospedagem (PC com túnel, plano grátis como Oracle Cloud Always Free, ou VPS ~€5/mês com aprovação); LGPD e termos de uso; página da loja.

## Fora do roadmap

- **Steam**: esforço próprio depois do lançamento ([ADR-0002](adr/0002-plataformas-e-online.md)).
- **Vários Mundos**: um só até o lançamento.
