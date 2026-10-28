# Autoridade cliente↔servidor

Type: grilling
Status: resolved
Blocked by: 01, 03

## Question

O que o cliente envia ao servidor (intenções: passo, alvo, AUTO, usar poção, comprar, aprimorar), o que o servidor devolve e com que frequência, e como o passo em grade fica responsivo com latência (previsão no cliente ou não). O que acontece quando a conexão cai no meio do Jogo manual ou do AUTO?

Contexto da pesquisa de stack (ticket 01): o Colyseus 0.18 tem `setFixedTimestep`, `defineInput` e `Predict` para predição no cliente; patches a cada 50 ms por padrão.

## Answer

Decidido no [ADR-0010](../../../adr/0010-cliente-manda-intencoes.md):

- O cliente só manda intenções (`andar`, `andar até`, `atacar`, `parar`, `AUTO`, `usar item`, `comprar`, `vender`, `aprimorar`), aplicadas no próximo tick; inválida → evento de recusa.
- Previsão só do passo do próprio herói (`Predict`); o resto espera o servidor, desenhado ~100 ms atrás e interpolado entre tiles.
- Estado filtrado por área de interesse (~15×11 tiles + margem); mochila, Ouro e XP só para o dono; eventos do tick como mensagens para quem está vendo.
- Queda de conexão fora da cidade liga o AUTO com a Tática do herói; volta em até 30 s retoma o controle; depois disso vira Caçada offline.
- Ritmo imposto pelo servidor, intenções a mais ignoradas, limite por segundo com desconexão e log.
- Save: o que vale Ouro grava na hora, em transação; o resto a cada 60 s e ao sair.
- NPC: menu HTML ao clicar, com o herói ao lado.
