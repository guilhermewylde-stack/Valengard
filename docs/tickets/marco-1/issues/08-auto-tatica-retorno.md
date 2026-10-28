# 08: AUTO, Tática e Retorno (online)

Type: task
Status: ready-for-agent
Blocked by: 06
Spec: [Marco 1](../spec.md)

## What to build

Na Área de caça o jogador liga o AUTO e o herói caça sozinho seguindo a Tática: procura monstros, luta, bebe poção abaixo de X% e volta abaixo de Y%. A Caçada termina com Retorno a Valen quando as poções acabam, a mochila enche, a vida fica crítica ou chega ao Teto; ou quando o jogador assume o controle, o que a encerra no lugar.

## Acceptance criteria

- [ ] Intenção `AUTO` inicia a Caçada fora da Zona segura e grava o Preparo (equipamento, atributos, poções, Tática); dentro de Valen é recusada com mensagem.
- [ ] Editor da Tática com 3 regras (poção abaixo de X%, voltar abaixo de Y%, quantas poções levar), padrão 50% / 15% / 20; não muda durante a Caçada.
- [ ] A Tática gera as intenções do herói a cada tick: procurar o monstro mais próximo, travar alvo, beber poção, iniciar o Retorno.
- [ ] Qualquer intenção manual encerra a Caçada no lugar, sem levar a Valen.
- [ ] Retorno por: poções acabaram, mochila cheia, vida crítica, Teto da Caçada (12h em ticks), Morte. Por vida crítica o herói sai andando da luta, com os monstros batendo, e só é levado a Valen depois de ~60 ticks; os outros motivos esperam a luta atual acabar.
- [ ] O Retorno termina no templo de Valen, com o Saque na mochila, e é gravado na hora; o cliente mostra o motivo.
- [ ] Morte durante a Caçada usa o Saque da Caçada (Ouro e itens desde o AUTO).
- [ ] Testes do `core`: cada motivo de Retorno, a fuga de ~6 s, a espera da luta, assumir o controle, recusa em Valen.
