# 15: Equilíbrio e fechamento do Marco 1

Type: task
Status: ready-for-agent
Blocked by: 07, 11, 13, 14
Spec: [Marco 1](../spec.md)

## What to build

A prova de que o Marco 1 está pronto: um teste de equilíbrio confere que o jogo real bate com o simulador do ticket 05 do roadmap, e o roteiro de "pronto quando" do roadmap é jogado de ponta a ponta no cliente instalado.

## Acceptance criteria

- [ ] Teste de equilíbrio no `core`, com o mapa completo e várias sementes: a Tática padrão e um laço só de teste ("Retorno → vende o Saque → compra poções e a próxima peça → volta ao AUTO") chegam em média ao Nível 8 em ~2h e compram a primeira peça melhor em ~1h, dentro de uma tolerância declarada no teste.
- [ ] Se o resultado sair da faixa (fuga do Rato, troféus empilhando e troca de equipamento não estavam no simulador), o ajuste é de números nas tabelas, registrado no ticket.
- [ ] Roteiro jogado no cliente instalado: instala, abre sem login, cria um Guerreiro com nome e entra em Valen; joga na mão e liga o AUTO; fecha, volta depois e recebe a Caçada offline com o Diário; vende o Saque, compra equipamento e aprimora; reinicia o servidor e o Ouro e o save continuam.
- [ ] Revisão de i18n: todo texto aparece em PT-BR e EN-US; nenhum texto fixo no código.
- [ ] Revisão de autoridade: nenhum valor de Ouro, XP ou Saque vem do cliente.
