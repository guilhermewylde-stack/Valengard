# Mapa: Valengard do MVP ao lançamento

Label: wayfinder:map
Status: resolved — destino alcançado em [docs/roadmap.md](../../roadmap.md) (2026-10-27); próximo passo: `/to-spec` do Marco 1.

## Destination

Um `docs/roadmap.md` com os marcos em ordem, cada um com escopo, o que fica de fora e critério de "pronto quando", e todas as decisões que travam o `/to-spec` do Marco 1 tomadas. Os marcos seguintes ficam em esboço, com as perguntas abertas anotadas; cada um ganha o próprio mapa ou spec quando chegar a vez.

## Notes

- Domínio: `GLOSSARY.md`, `docs/adr/`, `docs/lore/LORE-LEGADO.md`, `docs/research/mercado.md`. Conversa em PT-BR.
- Toda sessão de grilling chama as skills `grilling` e `domain-modeling`; termo novo vai para o `GLOSSARY.md`, decisão difícil de reverter vira ADR.
- Delegação conforme `D:/MultAgent/ROUTING.md` e o `CLAUDE.md` do projeto (Gemini para pesquisa e imagem; nada de API paga).
- Sem estimativas de tempo: só ordem e critério de pronto.

### Ordem dos marcos (fixada no mapeamento)

1. **Fatia vertical (PC)**: Conta de Convidado, herói Guerreiro, Valen (vendedor + ferreiro), 1 Área de caça, Jogo manual e AUTO simulados pelo servidor em tempo real, Saque, venda e Aprimoramento no NPC, save no servidor, Caçada offline calculada pelo `core` no servidor.
2. **Mundo compartilhado**: vários heróis no mesmo Mundo, monstros disputados, chat.
3. **Conteúdo solo**: Patrulheiro e Mago, regiões até a Fortaleza (~45), cadeia de Missões, Depósito, Bênção de Aerion e sacerdotisa, Conta com e-mail.
4. **Dungeon**.
5. **Raid**.
6. **BG/PvP**.
7. **Android**: Capacitor, a mesma Conta e o mesmo save.
8. **Monetização**: Gemas, Pacote do Aventureiro, VIP, Passe da Jornada, Recompensa diária, com pagamento em sandbox.
9. **Teste fechado**: no PC do autor, sem custo.
10. **Lançamento**: troca dos nomes ⚠, VPS e teste aberto, depois Play Store e PC (site/itch.io).

Um Mundo só, do Marco 2 até o lançamento.

### Escopo do Marco 1 (fixado no mapeamento)

- Entra: Morte com perda completa (XP do nível e metade do Saque da Caçada); um Suprimento (poção de vida, vendida no vendedor); Tática com 3 regras (beber poção abaixo de X% de vida, voltar abaixo de Y%, quantas poções levar); Nível e Skill Espada; movimento em grade com alvo travado ([ADR-0008](../../adr/0008-movimento-em-grade.md)); sprites do Gemini (pipeline aprovado no teste das 3 direções); textos em PT-BR e EN-US.
- Fica de fora: Bênção e sacerdotisa, Missões, Depósito, prioridade de alvo, magia de área, outras vocações, Conta com e-mail.

## Decisions so far

<!-- uma linha por ticket resolvido: [título](issues/NN-slug.md): resumo -->

- [Pesquisar a stack em 2026](issues/01-stack-2026.md): ADR-0003 vale; Colyseus 0.18, Phaser 4.2, Tauri 2.12, Drizzle 0.45 com `pg`; fixar a origem do webview cedo.
- [Modelo de simulação do core](issues/03-modelo-simulacao-core.md): tick de 100 ms, função pura `passo`, só inteiros, RNG com semente no estado, lote pula o tempo morto, atualização fecha as Caçadas offline antes ([ADR-0009](../../adr/0009-simulacao-em-ticks-inteiros.md)).
- [Autoridade cliente↔servidor](issues/04-autoridade-cliente-servidor.md): cliente só manda intenções, previsão só do próprio passo, queda de conexão vira AUTO, o que vale Ouro grava na hora ([ADR-0010](../../adr/0010-cliente-manda-intencoes.md)).
- [Regras da Caçada offline](issues/06-cacada-offline.md): teto de 12h (24h VIP); AUTO online e offline são a mesma Caçada; reconectar devolve o herói ao mundo ainda em AUTO; Retorno leva a Valen; Diário guarda resumo e recalcula o detalhe.
- [Fórmulas de combate e progressão do Marco 1](issues/05-formulas-combate-progressao.md): curva de XP cúbica, Skill por golpes (+25% cada), dano = Skill × ataque; Nível 8 em ~2h, área do 1 ao 10; Retorno por vida crítica leva ~6 s de fuga; monstros atacam no raio de visão.
- [Economia do Marco 1](issues/07-economia-m1.md): 4 Slots; ~1h compra a primeira peça melhor e ~5h o kit todo; poção leva ~1/3 do bruto; Aprimoramento +4/+5 com chance, falha só gasta Ouro; revenda a 25%.
- [Formato de mapa](issues/10-formato-de-mapa.md): Tiled em JSON, tiles 64×64 (ADR-0011); um mapa contínuo Valen + área (~100×80, ~30 pontos de nascimento); build converte para o formato do `core` e a versão do mapa entra na versão do `core`; Valen é Zona segura.
- [Conta de Convidado no PC](issues/08-conta-convidado-pc.md): segredo de 256 bits no cofre do Windows (sobrevive a reinstalar, não a formatar), token de sessão de 24h, 2 vagas de herói, 5 Convidados por IP por dia, e-mail liga a mesma Conta no Marco 3.
- [Pesquisar a distribuição do cliente PC sem custo](issues/02-distribuicao-pc.md): R$ 0 com GitHub Releases + atualizador do Tauri com chave própria + instalador sem assinatura; certificado OV só se o aviso do SmartScreen derrubar a conversão.
- [Teste das 3 direções](issues/09-teste-3-direcoes.md): o personagem se mantém e o pipeline do ADR-0005 vale, mas em 64 px (a 32 borrava): arte em 64×64 por tile ([ADR-0011](../../adr/0011-arte-em-64-px.md)); plano B guardado; a pose às vezes muda e o leste pode precisar de nova tentativa.

## Not yet specified

- **Mundo compartilhado (M2)**: como se disputam monstros e Saque (primeiro golpe, maior dano, compartilhado), áreas cheias de heróis em AUTO, chat e moderação, quantos heróis um Mundo aguenta (o `StateView` do Colyseus não é otimizado para grandes volumes: protótipo de carga e/ou salas por mapa).
- **Conteúdo solo (M3)**: equilíbrio entre as 3 vocações, regiões e faixas de nível, modelos de item por região, como o Convidado vira Conta com e-mail.
- **Dungeon (M4)**: instâncias, tamanho do grupo, chefe, recompensas que o idle não alcança.
- **Raid (M5)**: agenda, escala, recompensa para quem participa.
- **BG/PvP (M6)**: formato da BG, pareamento, arena e desafio, o que se ganha.
- **Android (M7)**: Capacitor, Caçada offline com notificação local, a mesma Conta no PC e no celular.
- **Monetização (M8)**: provedor de pagamento no PC (cobra por transação, precisa de aprovação), Google Play Billing, ECA Digital, revisão do ADR-0006 ("por ora"), o que é a "Caçada extra na fila" do VIP.
- **Teste fechado (M9)**: como expor o servidor do PC do autor (túnel ou porta), quem convidar, telemetria.
- **Lançamento (M10)**: nomes que substituem os ⚠, onde hospedar (PC do autor com túnel, plano grátis como Oracle Cloud Always Free, ou VPS ~€5/mês com aprovação), LGPD e termos de uso, página da loja.

## Out of scope

- **Steam**: vira um esforço próprio depois do lançamento (ADR-0002).
- **Vários Mundos**: um só até o lançamento.
- **Estimativas de tempo**: sem histórico de velocidade, seriam ficção.
