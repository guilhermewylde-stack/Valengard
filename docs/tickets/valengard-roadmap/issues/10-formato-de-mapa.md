# Formato de mapa

Type: grilling
Status: resolved
Blocked by: —

## Question

Que editor e formato de mapa usar (Tiled ou outro), tamanho do tile, tamanho de Valen e da Área de caça do M1, como se marcam pontos de nascimento de monstros, áreas seguras e NPCs, e como o mesmo mapa é lido pelo `core` (colisão, pathfinding) e pelo cliente (desenho).

Contexto do ticket 05: monstros atacam quem entra no raio de visão deles (~3 tiles), e a Área de caça do Marco 1 deve ser desenhada para que ~1 encontro em 3 tenha dois monstros. A área serve do Nível 1 ao 10.

## Answer

- **Editor e formato**: Tiled, salvando JSON (`.tmj`), tileset de 64×64 px (era 32×32; trocado pelo [ADR-0011](../../../adr/0011-arte-em-64-px.md) depois do teste das 3 direções). RME/OTBM descartados: dependem de itens e sprites do Tibia.
- **Camadas**: chão; decoração (não bloqueia); obstáculos (propriedade `bloqueia` por tile); por cima (copas e telhados desenhados sobre o herói). Objetos: ponto de nascimento (espécie, raio de ~3 tiles por onde anda, renascimento), NPC (vendedor, ferreiro), zona segura (retângulo), templo (onde o herói aparece no Retorno e na Morte).
- **Um mapa contínuo no Marco 1**: o portão de Valen dá direto na Área de caça. Cada tile marca a região a que pertence, para dividir em salas por região no Marco 2 se a carga pedir.
- **Tamanho**: Valen ~40×30 tiles (muralha, templo, vendedor, ferreiro); Área de caça ~100×80 com ~30 pontos de nascimento e renascimento de 60 s. Ratos perto do portão (Níveis 1–4), Lobos mais longe (4–10), em grupos de 2–3 pontos para ~1 encontro em 3 ter dois monstros.
- **Leitura pelo `core`**: um script de build converte o `.tmj` num formato compacto (grade de bits "dá para andar", pontos de nascimento, zonas, NPCs); o cliente desenha do `.tmj`. A versão do mapa faz parte da versão do `core` (ADR-0009): mudar o mapa fecha as Caçadas offline antes de valer.
- **Zona segura**: dentro dos muros de Valen monstros não entram, ninguém ataca ninguém e o AUTO não liga (a intenção é recusada).
- **Quem faz**: o tileset vem do Gemini depois do teste das 3 direções (ticket 09); a primeira versão do mapa é gerada por script e refinada pelo autor no Tiled. Isso é tarefa de implementação do Marco 1.
