# Valengard — como começar (passo a passo, com prompts prontos)

Funciona igual no **app Claude Code desktop** (ambiente Local com a pasta
`D:\Games\Valengard`) ou no **VS Code** (painel do Claude, ícone laranja, com esta pasta
aberta). Os agentes, o `pool` e as skills são os mesmos nos dois. Copie cada prompt
**exatamente** como está, sempre numa conversa nova aberta nesta pasta.

## 0. Antes da primeira sessão (uma vez)

- [x] Login no Gemini: `agy` (Antigravity CLI, substituto do Gemini CLI). Já feito.
- [ ] Modelo local ligado, a cada sessão de trabalho:
      - **Desktop:** peça "Ligue o modelo local (D:\MultAgent\llama\start.ps1) numa aba do terminal".
      - **VS Code:** tarefa **MultAgent: start local model (llama.cpp)**.
- [ ] Skills do Matt Pocock: já instaladas (`mattpocock-skills`). Confira digitando `/`:
      devem aparecer `/grill-with-docs`, `/wayfinder` etc. Se não aparecerem, abra uma
      conversa nova (no VS Code: *Developer: Reload Window*).
- [ ] Modo de permissão: **automático / Accept edits** para tudo, exceto quando o passo
      disser *Plan*.
- Para **ver o jogo**: no desktop, o Claude usa o navegador embutido do app; no VS Code,
  peça para abrir no navegador.
- Java/Android SDK **não** são necessários agora; viram um ticket quando chegar a hora do APK.

## 1. Configurar o método (uma vez)

```
/setup-matt-pocock-skills
```
Respostas: issue tracker = **arquivos locais em `docs/tickets/`**; labels = aceite o padrão;
documentos = **`docs/`**.

## 2. Pesquisa de mercado (Gemini, de graça)

```
Use mcp__pool__ask_gemini com cwd D:/Games/Valengard para pesquisar na web e responder em PT-BR:
1) Os 8 idle RPGs mobile de maior receita/retencao hoje (ex.: estilo Tibia, AFK, MMO-lite):
   loop principal, como fazem o progresso offline, o que monetizam e o que os jogadores mais
   reclamam nas avaliacoes da Play Store.
2) Boas praticas atuais de battle pass e monetizacao "justa" em idle RPG (sem pay-to-win
   agressivo), e as regras da Google Play para compras, anuncios premiados e loot boxes.
3) Stacks usadas por jogos 2D mobile pequenos com backend proprio.
Salve o resultado em docs/research/mercado.md com as fontes citadas. Depois me de um resumo
de 10 linhas do que isso muda para o Valengard.
```

## 3. Alinhamento total — a sessão mais importante (*Plan* ou *Accept edits*)

```
/grill-with-docs

Quero criar do zero o Valengard: um idle RPG 2D para PC e mobile (Android), com o mesmo
save nos dois, dark fantasy inspirado em O Senhor dos Aneis e no Tibia. Decida comigo qual
plataforma vem primeiro e como o PC e distribuido (navegador, Steam/itch, app desktop).
Idiomas: PT-BR e EN-US desde o inicio (i18n). Arte: pixel art estilo Tibia gerada pelo
Gemini, ver docs/art/ART-BIBLE.md e docs/art/referencias/. O heroi caca sozinho online e offline. Sistemas
desejados: quests, mapas/regioes, equipamentos com aprimoramento, vocacoes, cidades, comercio
local (NPCs e entre jogadores?), battle pass, monetizacao justa (gemas, VIP, anuncios
premiados), login diario.

Contexto obrigatorio para ler antes de perguntar:
- CLAUDE.md (regras do projeto e delegacao entre agentes)
- docs/lore/LORE-LEGADO.md (historia e nomes que eu gostei, com a tabela de risco de IP)
- docs/research/mercado.md (se existir)
- docs/art/ART-BIBLE.md (estilo de arte escolhido)
- Valengard/HANDOFF.md (prototipo antigo: so referencia do que funcionou; nao reaproveitar codigo)

Minha posicao inicial de stack (questione se tiver algo melhor):
TypeScript em monorepo pnpm — packages/core (simulacao pura e deterministica: combate, idle,
economia, offline; testada com Vitest e reutilizada pelo servidor), apps/client (Phaser +
Vite, rodando no navegador do PC e empacotado para Android com Capacitor; para PC instalavel,
avaliar Tauri/Electron), apps/server (Node + Fastify, banco SQLite no
inicio). Tudo gratuito. Meu PC: Windows, Xeon sem AVX2, 32 GB RAM, RX 580 8 GB.

Me grelhe ate cada galho de design estar resolvido: fantasia central e loop de 30s/5min/1dia,
como o idle offline funciona sem trapaca, progressao e curva de XP, vocacoes, itens e
raridades, economia (fontes e drenos de ouro), o que e online de verdade no lancamento vs
depois, monetizacao e o que nunca vamos vender, estilo de arte, e o escopo do MVP. Renomeie
comigo os nomes com risco de IP. Atualize GLOSSARY.md e registre as decisoes dificeis em ADRs
conforme avancamos.
```
Responda com calma; pode levar mais de uma sessão. Se a conversa ficar longa: `/handoff`,
abra uma conversa nova e cole o arquivo gerado.

## 4. Mapa do jogo inteiro

```
/wayfinder

Planeje o Valengard inteiro, do MVP ate o lancamento na Play Store, com base no GLOSSARY.md,
nos ADRs e na lore. Quero marcos em ordem, sendo o primeiro uma fatia vertical jogavel no
cliente do PC: conta de convidado, heroi Guerreiro, Valen, 1 area de caca, caca manual e AUTO
no servidor em tempo real, saque, venda e aprimoramento no NPC, save, e Cacada offline
calculada pelo core no servidor. Depois: multijogador no mundo, Dungeon, raid, BG/PvP,
Android, teste fechado e lancamento.
```

## 5. Especificar e quebrar o primeiro marco

```
/to-spec
Especifique o Marco 1 (fatia vertical) do mapa do wayfinder.
```
```
/to-tickets
Quebre a spec do Marco 1 em tickets tracer-bullet com dependencias.
```

## 6. Construir (repita para cada ticket)

```
/implement
Implemente o proximo ticket desbloqueado em docs/tickets/. Use o local-coder para tabelas de
dados e boilerplate. Ao final rode os testes, peca uma revisao ao gemini-reviewer alem do
/code-review, e faca o commit.
```
Para um marco inteiro de uma vez (mais autônomo, gasta mais cota): `/implement-spec`.

Para **ver o jogo**: peça "rode o client e abra no navegador embutido".

## 7. Arte gerada pelo Gemini (em paralelo, a partir do passo 3)

```
Com base no GLOSSARY.md e nos ADRs de estilo, complete o rascunho docs/art/ART-BIBLE.md (paleta, resolucao
dos sprites e tiles, perspectiva, iluminacao, referencias de estilo) e docs/art/PROMPTS.md com
a lista de imagens do Marco 1 (tiles da cidade e da regiao, heroi, 4 monstros, icones de
itens, retrato do NPC). Use o mcp__pool__ask_gemini para escrever cada prompt de imagem no
formato que funciona melhor no Nano Banana, sempre repetindo o bloco de estilo e pedindo fundo
magenta #FF00FF liso. Inclua para cada um o nome do arquivo esperado.
```
Depois, para gerar (o Gemini cria as imagens pela sua assinatura Pro, ~1–2 min cada):
```
Gere as 3 primeiras imagens de docs/art/PROMPTS.md com mcp__pool__generate_image, salvando em
assets/inbox/ com os nomes indicados (cwd D:/Games/Valengard). Me mostre as tres e espere
minha aprovacao do estilo antes de gerar o resto.
```
Aprovado o estilo:
```
Gere o resto de docs/art/PROMPTS.md. Depois crie um script Python local (Pillow) que recorta o
fundo magenta para transparencia, redimensiona para a resolucao da ART-BIBLE e reduz para a
paleta definida; processe assets/inbox/ com ele e mova para o lugar certo do client. Me mostre
o resultado no navegador embutido.
```
Os testes `assets/inbox/test-warrior.jpg` e `test-ring.jpg` mostram a qualidade esperada; pode
apagá-los.

## 8. Manutenção (toda semana)
- `/improve-codebase-architecture` — acha módulos para simplificar antes de virar bagunça.
- `/retro` — no fim de uma sessão longa, melhora o próprio ambiente dos agentes.
- `/handoff` — sempre que a conversa ficar grande.
- `/ask-matt` — quando não souber qual skill usar.
