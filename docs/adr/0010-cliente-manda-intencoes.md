# O cliente manda intenções; queda de conexão vira AUTO

O cliente nunca afirma posição, dano ou Saque: manda intenções (`andar`, `andar até`, `atacar`, `parar`, `AUTO`, `usar item`, `comprar`, `vender`, `aprimorar`), que entram numa fila e são aplicadas no próximo tick pela função `passo` (ADR-0009). Intenção inválida é descartada com um evento de recusa. O servidor impõe o ritmo de passo e golpe, ignora intenções a mais no mesmo tick e desconecta quem passa do limite por segundo.

Só o passo do próprio herói é previsto no cliente (`Predict` do Colyseus 0.18), voltando ao tile anterior se o servidor recusar; combate, dano, Saque e as outras entidades esperam o servidor, desenhadas ~100 ms atrás e interpoladas entre tiles.

Se a conexão cai fora da cidade, o herói entra em AUTO na hora, com a Tática dele; na cidade, fica parado. Reconectando em até 30 s, o jogador retoma o controle no mesmo lugar; depois disso, passa para Caçada offline (ticket 06).

## Considered Options

- Sem previsão, como o Tibia clássico: mais simples, mas o passo fica pesado com o ping de quem joga longe do servidor.
- Herói parado ou deslogado ao cair a conexão: morreria no meio da luta por culpa da internet.

## Consequences

- Estado sincronizado filtrado por área de interesse (a tela, ~15×11 tiles, mais margem); mochila, Ouro e XP só para o dono; eventos do tick só para quem está vendo.
- O que vale Ouro (compra, venda, Aprimoramento, Retorno) é gravado na hora, numa transação; posição, vida, XP e mochila em caça vão ao banco a cada 60 s e ao sair.
- NPC: clicar com o herói ao lado abre um menu HTML (Comprar / Vender / Aprimorar), sem palavras-chave digitadas.
