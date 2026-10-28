---
status: accepted (revisado pelo ADR-0007)
---

# Cliente instalável no PC primeiro, depois Android, depois Steam

No PC o jogo é um cliente instalável (Tauri, ~10 MB, atualização automática, download no site), não um site; o navegador é só conveniência de desenvolvimento. Depois Android (Capacitor) e Steam, todos com o mesmo código TypeScript e o mesmo save. Um código só mantém um `core` no cliente e no servidor; uma engine nativa (Godot/Unity) obrigaria o `core` em duas linguagens. Jogadores falsos (os bots do protótipo) não existem.
