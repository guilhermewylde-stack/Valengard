---
status: accepted (revisado pelo ADR-0007)
---

# Caçada online no mundo compartilhado, offline como conta determinística

Conectado (na mão ou no AUTO), o herói está no mundo compartilhado e o servidor o simula em tempo real, disputando monstros com quem estiver lá. Desconectado, a Caçada continua como conta determinística de (Preparo, semente, tempo no relógio do servidor) numa cópia pessoal da área, sem disputa, calculada pelo `core` ao reconectar. Assim o offline nunca rende menos que o online (a reclamação nº 1 do gênero) e o cliente nunca decide o resultado.

## Considered Options

- Manter o herói offline caçando no mundo compartilhado: mais vivo, mas o servidor simularia todos os heróis 24h e áreas cheias de AUTO estragariam a caça manual.

## Consequences

- A simulação é golpe a golpe, não estatística: 24h de Caçada são ~40 mil golpes, baratos para o servidor, e o Diário da Caçada mostra o que aconteceu.
- Mudar Tática ou equipamento durante uma Caçada offline exige o Retorno.
