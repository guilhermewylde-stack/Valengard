# Simulação em ticks de 100 ms, só inteiros, com o RNG dentro do estado

O `core` é uma função pura `passo(estado, intenções) → (estado novo, eventos)` que avança um tick de 100 ms. A sala do servidor a chama a cada tick no mundo compartilhado. A Caçada offline a chama em lote numa Cópia pessoal, pulando direto para o próximo tick em que algo acontece. Para o mesmo Preparo, semente e tempo, o resultado é sempre o mesmo, em qualquer máquina:

- **Só números inteiros**: porcentagens em partes por 10.000, arredondamento para baixo explícito; um lint proíbe `Math.random` e números decimais no `core`.
- **RNG com semente (sfc32) dentro do estado da simulação**: a semente nasce no servidor (`crypto`) quando começa uma Caçada e nunca vai ao cliente, que poderia prever o Saque.
- **Monstros da Cópia pessoal**: renascimento em ticks fixos por ponto de nascimento; toda escolha aleatória vem do mesmo RNG.
- **Uma versão de `core` por trecho**: antes de publicar uma atualização, o servidor fecha a conta de todas as Caçadas offline até aquele momento com a versão antiga; cada trecho guarda a versão que o calculou.

## Considered Options

- Simulação estatística (taxa de abate × tempo): mais barata, mas o Diário da Caçada não teria o que mostrar, e o offline divergiria do online (ADR-0001).
- Números decimais com tolerância: mais simples de escrever, mas não garante o mesmo resultado entre motores de JavaScript e máquinas.
- Recalcular Caçadas antigas com a versão nova: um ajuste de equilíbrio mudaria o passado de quem já estava caçando.

## Consequences

- Os eventos de cada tick alimentam o Diário da Caçada e as animações do cliente; o save guarda só o estado.
- Um teste garante que pular o tempo morto dá o mesmo resultado que rodar tick por tick.
- O mundo compartilhado não precisa ser reproduzível (o servidor é a verdade); só a Cópia pessoal precisa.
