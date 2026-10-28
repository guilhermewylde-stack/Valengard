# Modelo de simulação do core

Type: grilling
Status: resolved
Blocked by: —

## Question

Como o `core` simula: taxa de tick, RNG com semente e onde a semente nasce, o que é estado e o que é evento, e como o mesmo código roda em tempo real dentro da sala do servidor (Jogo manual e AUTO) e em lote numa Cópia pessoal (Caçada offline), dando o mesmo resultado para o mesmo Preparo, semente e tempo.

## Answer

Decidido no [ADR-0009](../../../adr/0009-simulacao-em-ticks-inteiros.md):

- Tick fixo de 100 ms; toda duração (passo, golpe, renascimento, poção) é um número inteiro de ticks.
- `passo(estado, intenções) → (estado novo, eventos)`, função pura. Online, a sala do servidor a chama a cada tick com as intenções dos jogadores ou as decisões da Tática. Offline, o servidor a chama em lote numa Cópia pessoal, pulando direto para o próximo tick com evento (um teste garante resultado idêntico).
- Só inteiros (partes por 10.000, arredondamento para baixo); lint proíbe `Math.random` e números decimais no `core`.
- RNG sfc32 dentro do estado; a semente nasce no servidor ao começar a Caçada e nunca vai ao cliente.
- Estado = o que existe agora (é o que vai para o save). Eventos = o que aconteceu no tick (alimentam o Diário da Caçada e as animações do cliente).
- Monstros da Cópia pessoal: os mesmos pontos de nascimento da área compartilhada, renascimento em ticks fixos, IA simples (perseguir, atacar, alguns fogem), toda escolha aleatória do mesmo RNG.
- Antes de cada atualização, o servidor fecha a conta das Caçadas offline com a versão antiga; cada trecho guarda a versão do `core`.
