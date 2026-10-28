# 10: Caçada offline no servidor e Diário na tela

Type: task
Status: ready-for-agent
Blocked by: 09
Spec: [Marco 1](../spec.md)

## What to build

O jogador fecha o jogo com o herói em AUTO (ou a conexão cai fora da cidade) e a mesma Caçada continua offline. Volta horas depois: o servidor calcula a Caçada até agora e mostra o Diário. Se ela ainda corre, o herói aparece no tile da Cópia pessoal, ainda em AUTO; se acabou, aparece em Valen.

Decisões: ticket 06 do roadmap e ADR-0010.

## Acceptance criteria

- [ ] Queda de conexão fora da Zona segura liga o AUTO na hora; se estava no Jogo manual, começa uma Caçada ali com o Preparo do momento; na cidade o herói fica parado.
- [ ] Reconectar em até 30 s devolve o controle no mesmo lugar.
- [ ] Depois de 30 s a mesma Caçada passa a offline: Cópia pessoal a partir do estado atual (vida, poções, mochila, tile) com semente nova do servidor (`crypto`), persistida; o herói sai da sala. A semente nunca vai ao cliente.
- [ ] Ao reconectar, o servidor roda o lote até o relógio dele (respeitando o Teto) e grava o resultado em transação.
- [ ] Caçada ainda correndo: o herói volta à sala no tile da Cópia, em AUTO, com o Diário até ali. Caçada encerrada: aparece em Valen com o Diário completo.
- [ ] Cada herói da Conta tem a própria Caçada.
- [ ] Diário guardado (últimos 10 por herói); o trecho online entra só como resumo; tela do Diário com o resumo e o golpe a golpe dos trechos offline.
- [ ] Testes de integração: queda → AUTO, retomada em 30 s, passagem para offline, reconexão com Caçada correndo e encerrada, últimos 10 Diários.
