# Pesquisar a distribuição do cliente PC sem custo

Type: research
Status: resolved
Blocked by: —

## Question

Como distribuir o cliente Tauri no Windows sem custo: assinatura de código (o SmartScreen bloqueia instalador não assinado? existe opção gratuita ou barata, como Azure Trusted Signing ou SignPath para código aberto?), atualização automática do Tauri 2 (o que exige: par de chaves, manifesto, GitHub Releases ou outro host) e onde hospedar o instalador e as atualizações de graça.

## Answer

Detalhe: `docs/research/distribuicao-pc.md` no branch `research/distribuicao-pc` (commit b68e9a4, no GitHub).

- **Caminho de R$ 0**: GitHub Releases (repositório público só de releases, se o código for privado) publicado pelo `tauri-action`; o atualizador do Tauri 2 com chave própria (grátis, independe de Authenticode); instalador NSIS sem assinatura de código; espelho no itch.io para ser descoberto; cada versão enviada à Microsoft para análise de reputação.
- **Sem assinatura**, o SmartScreen avisa mas deixa instalar. Com o Smart App Control ligado no Windows 11, o instalador é bloqueado. Testar numa VM com ele ligado.
- **Fora de alcance**: o Azure Artifact Signing (ex-Trusted Signing) não aceita pessoa física do Brasil, e o SignPath gratuito exige código aberto.
- **Se a conversão sofrer**: tentar a Microsoft Store com conta individual (sem taxa; disponibilidade para o Brasil não verificada) e só então um certificado OV, que é custo anual e precisa de aprovação.
- **Cuidado**: perder a chave privada do atualizador impede atualizar quem já instalou. Guardar fora do repositório, com backup.
