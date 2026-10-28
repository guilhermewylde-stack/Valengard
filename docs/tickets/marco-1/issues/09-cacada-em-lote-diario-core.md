# 09: Caçada em lote e Diário no core

Type: task
Status: ready-for-agent
Blocked by: 08
Spec: [Marco 1](../spec.md)

## What to build

O `core` passa a rodar uma Caçada inteira em lote numa Cópia pessoal, pulando direto para o próximo tick em que algo acontece, com o mesmo resultado de rodar tick a tick. Junto vem o Diário da Caçada: resumo e receita, com o golpe a golpe recalculado sob demanda. É o que prova no CI que o offline rende igual ao AUTO online (ADR-0001, ADR-0009).

## Acceptance criteria

- [ ] Função de Caçada em lote: recebe a Cópia pessoal (estado inicial com os mesmos Pontos de nascimento da área, Preparo, semente) e um instante final; devolve estado final, eventos e resumo; para no Retorno ou no Teto de 12h.
- [ ] O lote pula o tempo morto (próximo tick com evento) e dá resultado idêntico ao `passo` tick a tick.
- [ ] Diário: resumo (duração, XP, Níveis, Skill, Ouro, Saque, poções, Mortes, motivo do Retorno) e receita por trecho (Preparo, estado inicial, semente, versão do `core`).
- [ ] Recalcular um trecho pela receita devolve exatamente os mesmos eventos (golpe a golpe).
- [ ] Linhas do Diário como chaves de i18n com parâmetros.
- [ ] A versão do `core` inclui a versão do mapa compacto.
- [ ] **Teste no CI**: N sementes, tick a tick × lote, com estado final e resumo idênticos (critério de pronto do Marco 1).
