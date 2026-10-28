# Valengard

MMORPG 2D com caça idle, dark fantasy inspirado em O Senhor dos Anéis e Tibia. Plataformas:
cliente instalável no PC primeiro, depois Android e Steam, com o mesmo save (ADR-0002).
Decisões em `docs/adr/`, vocabulário em `GLOSSARY.md`. Joga-se na mão ou o herói caça
sozinho online e offline; dungeons, raids, BG e PvP consensual; quests, mapas, equipamentos, vocações, cidades,
comércio local, battle pass e monetização.

## Como trabalhamos
- Método Matt Pocock (plugin `mattpocock-skills`): alinhar com `/grill-with-docs`, planejar
  com `/wayfinder` → `/to-spec` → `/to-tickets`, construir com `/implement` (TDD, fatias
  verticais), revisar com `/code-review`. Vocabulário do domínio em `GLOSSARY.md`; decisões
  difíceis em ADRs.
- Delegação (ver `D:/MultAgent/ROUTING.md`), com estes acréscimos para o jogo:
  - **Gemini** (via Antigravity CLI): pesquisa de mercado e concorrentes (tem busca na web),
    leitura de muitos arquivos, revisão de diffs, e **toda a geração de imagem** com
    `mcp__pool__generate_image` (assinatura Pro; nunca API paga). Sai em JPG 1024×1024:
    peça fundo magenta `#FF00FF` liso para recortar, e repita o bloco de estilo de
    `docs/art/ART-BIBLE.md` em todo prompt.
  - **local-coder**: tabelas de dados (itens, monstros, drops), boilerplate, testes simples.
  - **Claude**: arquitetura, simulação/combate/economia, código de produção.

## Regras do projeto
- Sem custo por token: nenhuma API paga, nenhum serviço com cobrança por uso sem aprovação.
- A lógica do jogo fica em um núcleo puro e determinístico, testável sem Android/navegador.
- Tudo que dá vantagem ou vale dinheiro (ouro, gemas, recompensa offline, compras) é
  validado no servidor; o cliente nunca é confiável.
- Nomes: inspirados em Tolkien, nunca copiados no lançamento. Os marcados com ⚠ em
  `docs/lore/LORE-LEGADO.md` são nomes de trabalho, trocados antes do primeiro lançamento
  público (ADR-0004).
- Idiomas do jogo: PT-BR e EN-US desde o início, via arquivos de tradução (i18n), nunca
  texto fixo no código. Toda chave nova entra nos dois idiomas.
- Arte: pixel art estilo Tibia (ver `docs/art/ART-BIBLE.md`), gerada pelo Gemini. A
  referência `docs/art/referencias/estilo-sprite-kit.jpg` vale **só pelo estilo**: os
  personagens dela (Aragorn, Legolas, Gandalf, Frodo, Árvore Branca, Um Anel) não podem
  aparecer no jogo, e nenhum sprite do Tibia/OTClient é reaproveitado.
- Conversa com o usuário sempre em PT-BR.

## Pastas
- `Valengard/` — protótipo antigo em Kotlin. **Só leitura**, referência de ideias e lore;
  não reaproveitar código. Será removido.
- `docs/lore/` — lore. `docs/art/` — bíblia de arte e prompts de imagem.
- `assets/inbox/` — imagens geradas no Gemini, antes de processar.

## Agent skills

### Issue tracker

Issues e specs ficam como arquivos markdown em `docs/tickets/<feature>/`. See `docs/agents/issue-tracker.md`.

### Triage labels

Os cinco rótulos canônicos (needs-triage, needs-info, ready-for-agent, ready-for-human, wontfix), gravados como linha `Status:`. See `docs/agents/triage-labels.md`.

### Domain docs

Single-context: `GLOSSARY.md` + `docs/adr/` na raiz. See `docs/agents/domain.md`.
