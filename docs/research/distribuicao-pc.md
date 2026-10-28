# Distribuição do cliente PC (Tauri 2, Windows) a custo mínimo — Valengard

> Pesquisa para o ticket `docs/tickets/valengard-roadmap/issues/02-distribuicao-pc.md`.
> Data da pesquisa: 2026-10-27. Fontes primárias (documentação oficial); cada afirmação traz o link e,
> quando a página informa, a data de atualização. Itens marcados `[nao verificado]` não foram
> confirmados em fonte primária. Perfil: desenvolvedor individual no Brasil, sem serviço recorrente pago.

## Resumo executivo

- **Assinatura de código pública gratuita/barata não está disponível para pessoa física no Brasil.**
  O Azure Artifact Signing (ex-Trusted Signing) só aceita *indivíduos* nos EUA e Canadá; organizações
  só em lista fechada de países que **não inclui o Brasil**. SignPath Foundation exige projeto
  open source (OSI), o que não serve a um jogo comercial fechado.
- **Instalador sem assinatura funciona**, mas gera aviso do SmartScreen e pode ser **bloqueado pelo
  Smart App Control** (Windows 11) quando este está em modo "On".
- **Updater do Tauri 2 é independente da assinatura do Windows**: usa um par de chaves próprio
  (gratuito, obrigatório) e um `latest.json` estático. Funciona com instalador não assinado.
- **Hospedagem gratuita é fácil**: GitHub Releases (sem limite de banda/total documentado, 2 GiB por arquivo)
  cobre instalador + `latest.json`. itch.io é complemento de descoberta. R2 é reserva.
- **Caminho mais barato viável (custo R$ 0):** GitHub Releases (repo público só para releases) + updater
  Tauri assinado com chave própria + instalador NSIS sem assinatura Authenticode no início, mitigado por
  envio de falso-positivo/reputação à Microsoft e por distribuição também no itch.io; avaliar a
  **Microsoft Store (conta individual sem taxa)** como rota de confiança (ver ressalvas na seção 1.5).

---

## 1. Assinatura de código (Authenticode) no Windows

### 1.1 SmartScreen e Smart App Control em 2026

- A doc do Tauri informa que assinar ajuda a evitar avisos do SmartScreen em arquivos baixados pelo
  navegador; apps sem assinatura ainda rodam, mas o Smart App Control do Windows 11 pode bloqueá-los
  totalmente. Desde 2024, certificados **EV não dão mais reputação instantânea**: EV e OV constroem
  reputação com o tempo; assinar todo release com o mesmo certificado ajuda a acumular reputação; é
  possível submeter o arquivo à Microsoft para análise.
  Fonte: [Tauri 2 — Windows Code Signing](https://v2.tauri.app/distribute/sign/windows/) (consultado 2026-10-27).
- Smart App Control (atualizado 2026-10-06): em modo *enforcement* só roda app reconhecido pela
  inteligência da Microsoft **ou** assinado por certificado de uma CA do Trusted Root Program;
  "código desconhecido e não assinado é bloqueado por padrão". Em modo *evaluation* o Windows avalia
  se o dispositivo combina com o recurso e pode desligá-lo sozinho.
  Fonte: [Microsoft Learn — Smart App Control](https://learn.microsoft.com/en-us/windows/apps/develop/smart-app-control/overview).
- Implicação: para o público geral, instalador não assinado terá atrito (aviso "Windows protegeu seu PC"
  e, em máquinas com SAC ligado, bloqueio). Isso é um risco de conversão, não um impedimento técnico.

### 1.2 Azure Artifact Signing (antigo Trusted Signing)

- Serviço gerenciado da Microsoft; certificados em HSM; contas Basic e Premium.
  Fonte: [Learn — What is Artifact Signing](https://learn.microsoft.com/en-us/azure/artifact-signing/overview) (atualizada 2026-08-03).
- **Elegibilidade (decisivo):** certificados *Public Trust* são para organizações em EUA, Canadá, UE, Reino
  Unido, Austrália, Nova Zelândia, Japão, Coreia do Sul, Singapura, Suíça, Noruega e Israel;
  **"Individual developers must be located in the United States or Canada"**. A restrição não vale para
  *Private Trust* (que não serve para distribuição pública).
  Fonte: [Learn — Quickstart: Set up Artifact Signing](https://learn.microsoft.com/en-us/azure/artifact-signing/quickstart) (atualizada 2026-10-08).
- Conclusão: **o Brasil não está na lista nem para pessoa física nem para organização**. Ter CNPJ
  brasileiro não resolve (o país da organização precisa estar na lista). Há região Azure "Brazil South"
  para hospedar a conta, mas isso não altera a regra de elegibilidade da identidade.
- Custo: a página oficial de preços mostra placeholders (`$-`) no momento da consulta; documenta apenas
  5.000 assinaturas/mês incluídas no Basic e 100.000 no Premium, e manda usar a calculadora.
  Fonte: [Azure — Artifact Signing pricing](https://azure.microsoft.com/en-us/pricing/details/artifact-signing/).
  Valor mensal exato: `[nao verificado]` (irrelevante enquanto o Brasil for inelegível).
- Integração com Tauri existe (`artifact-signing-cli` + `signCommand`), caso a elegibilidade mude.
  Fonte: [Tauri 2 — Windows Code Signing](https://v2.tauri.app/distribute/sign/windows/).

### 1.3 SignPath Foundation (open source)

- Gratuito, mas exige: licença **aprovada pela OSI** em todos os componentes, sem dual licensing
  comercial, sem código proprietário, projeto mantido e já lançado, política pública de assinatura,
  MFA, builds verificáveis, aprovação manual de cada release; aceitação é caso a caso.
  Fonte: [SignPath Foundation — Terms / conditions](https://signpath.org/terms).
- Conclusão: **inelegível** para um MMORPG comercial com cliente fechado. Só seria opção se o cliente
  fosse open source (decisão de produto fora do escopo; o servidor poderia permanecer fechado).

### 1.4 Certificados OV / EV de CAs comerciais

- OV: normalmente mais barato e disponível a indivíduos; EV exige entidade jurídica e token de hardware.
  Pós-2023 as chaves precisam ficar em HSM/token (a doc do Tauri avisa que o guia de `.pfx` vale só para
  OV emitido antes de 1º/jun/2023; certificados novos seguem a documentação da emissora).
  Fonte: [Tauri 2 — Windows Code Signing](https://v2.tauri.app/distribute/sign/windows/).
- **Custo real:** CAs cobram anualmente (ordem de grandeza de dezenas a centenas de USD/ano para OV e
  mais para EV) — **`[nao verificado]`: não consultei páginas de preço de CAs nesta pesquisa**; cotar
  antes de decidir (ex.: Certum, Sectigo/revendedores, SSL.com). É custo **recorrente**, portanto
  precisa de aprovação, e pelo texto acima não dá reputação instantânea.

### 1.5 Microsoft Store como caminho alternativo

- Conta de desenvolvedor **individual sem taxa de registro** no novo fluxo (`storedeveloper.microsoft.com`),
  com verificação de identidade por documento + selfie.
  Fonte: [Learn — Open a Store developer account](https://learn.microsoft.com/en-us/windows/apps/publish/partner-center/open-a-developer-account) (atualizada 2026-07-17).
  Observação: a taxa era cobrada no fluxo antigo; o fluxo novo é só pelo link acima. Disponibilidade
  para residentes no Brasil: `[nao verificado]` (a página não lista países).
- Dois formatos: MSIX, ou **MSI/EXE** (você hospeda o instalador em URL HTTPS versionada e imutável;
  a Loja exige instalador offline/standalone, instalação silenciosa e desinstalação limpa).
  Fonte: [Learn — Certificação de apps MSI/EXE](https://learn.microsoft.com/en-us/windows/apps/publish/publish-your-app/msi/app-certification-process) (conteúdo de 2022, revisado 2026-08-24).
- Para MSI/EXE a assinatura é **"altamente recomendada"** pela Microsoft, não declarada obrigatória
  na página; se a Loja re-assina o pacote (comportamento de MSIX) não está documentado para EXE/MSI nessa página
  `[nao verificado]`. Para MSIX a Store assina o pacote na publicação (conhecimento geral; `[nao verificado]` nesta pesquisa).
- Ressalvas para Valengard: o cliente com auto-update próprio (Tauri updater) conflita com o modelo da
  Loja, que gerencia atualizações; versões novas exigem nova submissão com URL nova. Requer testar se
  o instalador NSIS do Tauri passa na validação de instalação silenciosa (NSIS suporta `/S`).
  Avaliar como **canal adicional** depois do lançamento, não como substituto.

---

## 2. Updater do Tauri 2

Fonte principal: [Tauri 2 — Updater plugin](https://v2.tauri.app/plugin/updater/) (consultado 2026-10-27).

| Item | Requisito |
|---|---|
| Assinatura | **Obrigatória e não desativável.** Par de chaves gerado por `tauri signer generate`; chave pública vai em `tauri.conf.json`, privada assina os artefatos. **Perder a chave privada impede atualizar instalações existentes** (guardar backup seguro). |
| Variáveis de build | `TAURI_SIGNING_PRIVATE_KEY` (caminho ou conteúdo) e opcionalmente `TAURI_SIGNING_PRIVATE_KEY_PASSWORD`. Arquivos `.env` não são suportados. |
| Config | `bundle.createUpdaterArtifacts: true`; `plugins.updater.pubkey` (conteúdo, não caminho); `plugins.updater.endpoints` (lista de URLs; TLS exigido em produção). Placeholders: `{{current_version}}`, `{{target}}`, `{{arch}}`. |
| Manifesto estático | JSON com `version` (SemVer), `platforms.<os-arch>.url` e `.signature` (conteúdo do arquivo `.sig`), opcionais `notes` e `pub_date`. Chaves como `windows-x86_64`. O arquivo inteiro é validado, então todas as plataformas listadas devem estar completas. |
| Servidor dinâmico | Alternativa: responde `204` sem update, ou `200` com JSON (`version`, `url`, `signature`). |
| Windows | Instalação `passive` (padrão), `basicUi` ou `quiet` (esta só funciona em instalação por usuário ou se já houver admin). O app **fecha antes de instalar** (limitação do instalador); há o hook `on_before_exit`. |

**GitHub Releases:** o tauri-action cria a release e pode gerar o `latest.json`; o endpoint aponta para o
`latest.json` da release (guia:
[Tauri 2 — GitHub pipeline](https://v2.tauri.app/distribute/pipelines/github/); detalhes do `latest.json`
estão no README do tauri-action, **não lido nesta pesquisa**). O workflow precisa de
`permissions: contents: write`.

**Interação com a assinatura do Windows:** a página do updater **não** trata de Authenticode; são dois
mecanismos independentes. A assinatura do updater garante a integridade/autoria do update para o app já
instalado; o Authenticode serve ao SmartScreen/SAC/Loja. Portanto o auto-update funciona com instalador
não assinado (inferência direta do texto: a verificação do updater usa só a `pubkey`). Contudo, cada
update baixado e executado pode, em tese, passar pelo mesmo atrito de reputação (instalador novo sem
assinatura); `[nao verificado]` na prática com SmartScreen, pois o download vem do próprio app e não do
navegador (sem Mark-of-the-Web, em geral) — testar numa VM limpa.

---

## 3. Hospedagem gratuita

| Opção | Limites e custo (fontes primárias) | Encaixe |
|---|---|---|
| **GitHub Releases** | Arquivo < **2 GiB**; **sem limite** de tamanho total da release nem de banda; até 1.000 assets por release. Gratuito. Fonte: [GitHub Docs — About releases](https://docs.github.com/en/repositories/releasing-projects-on-github/about-releases). | Melhor opção: instalador + `.sig` + `latest.json` com URL estável (`/releases/latest/download/latest.json`). Para o updater baixar sem autenticação, os assets precisam estar em repositório **público** (inferência; `[nao verificado]` em doc). Se o código for privado, usar um repositório público só de releases. |
| **itch.io + butler** | butler é CLI open source (MIT) para enviar builds e gerar/aplicar patches; a página não menciona custo nem limite de tamanho. Revenue share padrão **10%**, ajustável de **0% a 100%** pelo vendedor; PayPal/Stripe cobram US$0,30 + 2,9%. Fontes: [butler](https://itch.io/docs/butler/), [Pagamentos](https://itch.io/docs/creators/payments). | Bom canal de **descoberta** e para o app do itch (que atualiza sozinho). Não substitui o updater Tauri se o instalador for baixado direto. Para jogo gratuito, taxa efetiva zero (se 0%). Limite de upload: `[nao verificado]`. |
| **Cloudflare R2** | Free tier (Standard): **10 GB-mês** de armazenamento, **1 M** operações Classe A, **10 M** Classe B por mês; **egress sem cobrança**. Fonte: [R2 Pricing](https://developers.cloudflare.com/r2/pricing/). | Reserva/CDN próprio. Requer conta Cloudflare (com meio de pagamento para R2 — `[nao verificado]` na doc lida) e risco de cobrança se passar do free tier: só com aprovação. |
| **Cloudflare Pages** | Asset único máx. **25 MiB**; 20.000 arquivos/site no Free; 500 builds/mês Free. Banda: não listada na página. Fonte: [Pages Limits](https://developers.cloudflare.com/pages/platform/limits/). | Serve o **`latest.json` e o site**, mas **não o instalador** se passar de 25 MiB (o alvo do Tauri é ~10 MB, então cabe, com folga pequena para versões futuras). Binários maiores iriam para R2. |

---

## 4. Opções comparadas (custo)

| Caminho | Custo | Resultado para o usuário | Viável para o Brasil? |
|---|---|---|---|
| A. Sem Authenticode + updater Tauri + GitHub Releases | **R$ 0** | Aviso SmartScreen; bloqueio possível com Smart App Control ligado | Sim |
| B. A + Microsoft Store (individual, sem taxa) | R$ 0 `[disponibilidade BR nao verificada]` | Canal confiável, mas updates passam pela Loja | A confirmar |
| C. Certificado OV comercial | Recorrente anual (valor `[nao verificado]`) | Reputação ainda se constrói com o tempo | Sim, mas exige aprovação de gasto |
| D. Azure Artifact Signing | Mensal (valor `[nao verificado]`) | Melhor integração CI | **Não** (país inelegível) |
| E. SignPath Foundation | R$ 0 | Assinatura gratuita | **Não** (só projeto open source) |

## 5. Recomendação (caminho mais barato viável)

1. **Agora (R$ 0):** gerar o par de chaves do updater; publicar instalador NSIS + `.sig` + `latest.json` em
   **GitHub Releases** (repo público só de releases se o código for privado) via GitHub Actions/tauri-action;
   espelhar no **itch.io** (butler) para descoberta. Documentar no site o aviso do SmartScreen.
2. **Mitigar o atrito sem pagar:** enviar cada release à Microsoft para análise de falso-positivo/reputação;
   manter o nome do publicador e do arquivo estáveis; testar em VM com Smart App Control ligado.
3. **Depois do lançamento, se a conversão sofrer:** (a) tentar Microsoft Store individual (conta sem taxa;
   confirmar BR); (b) só então propor ao dono o gasto recorrente em certificado OV, com cotação real.
4. **Guardar a chave privada do updater** em local seguro com backup (perda = impossível atualizar a base instalada).

## 6. Lacunas (a resolver antes de decidir)

- Preço atual do Artifact Signing e de certificados OV/EV (não apurados em fonte primária).
- Se residentes no Brasil podem abrir conta individual na Microsoft Store sem taxa.
- README do tauri-action: formato exato do `latest.json` gerado e uso com repositório privado.
- Comportamento do SmartScreen/SAC em atualização iniciada pelo próprio app (testar empiricamente).
