# Autoridade cliente↔servidor

Type: grilling
Status: open
Blocked by: 01, 03

## Question

O que o cliente envia ao servidor (intenções: passo, alvo, AUTO, usar poção, comprar, aprimorar), o que o servidor devolve e com que frequência, e como o passo em grade fica responsivo com latência (previsão no cliente ou não). O que acontece quando a conexão cai no meio do Jogo manual ou do AUTO?

Contexto da pesquisa de stack (ticket 01): o Colyseus 0.18 tem `setFixedTimestep`, `defineInput` e `Predict` para predição no cliente; patches a cada 50 ms por padrão.
