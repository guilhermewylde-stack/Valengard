# 11: Robustez do servidor

Type: task
Status: ready-for-agent
Blocked by: 10
Spec: [Marco 1](../spec.md)

## What to build

O servidor pode reiniciar ou ser atualizado sem que ninguém perca Ouro, herói ou Caçada, e um cliente adulterado não ganha nada. Reiniciar é tratado como queda de conexão; atualizar fecha antes as Caçadas offline com a versão antiga do `core`.

## Acceptance criteria

- [ ] Parada do servidor: grava tudo e trata cada herói conectado como desconectado (fora da cidade a Caçada segue offline; na cidade fica parado).
- [ ] Antes de publicar uma atualização, o servidor fecha a conta de todas as Caçadas offline até aquele instante com a versão antiga; o trecho seguinte usa a nova; cada trecho guarda a versão do `core` (que inclui a do mapa).
- [ ] Ritmo de passo e golpe imposto pelo servidor; intenções a mais no mesmo tick ignoradas; limite de intenções por segundo com desconexão e log (número fixado ao fechar o ticket).
- [ ] Mensagens fora do formato das intenções são descartadas; nenhum valor de Ouro, XP ou Saque é aceito do cliente.
- [ ] Testes de integração: Ouro e save sobrevivem a reiniciar o servidor; Caçada offline fechada na versão antiga; cliente de teste que manda valores ou passa do limite é ignorado ou desconectado, e o estado não muda.
