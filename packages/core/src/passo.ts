import { acharCaminho } from './caminho.ts';
import { DELTA, type Direcao, type Estado, type Evento, type Heroi, type Intencao } from './estado.ts';
import { podeAndar, type MapaCompacto } from './mapa.ts';
import type { Rng } from './rng.ts';

/** Ticks de 100 ms que um passo leva (300 ms, o ritmo do protótipo do teste das 3 direções). */
export const DURACAO_PASSO = 3;

export function criarEstado(semente: Rng): Estado {
  return { tick: 0, rng: semente, herois: {} };
}

export function adicionarHeroi(estado: Estado, id: string, x: number, y: number): Estado {
  const heroi: Heroi = { id, x, y, direcao: 'sul', livreEm: estado.tick, passoPedido: null, caminho: [] };
  return { ...estado, herois: { ...estado.herois, [id]: heroi } };
}

export function removerHeroi(estado: Estado, id: string): Estado {
  const { [id]: _removido, ...herois } = estado.herois;
  return { ...estado, herois };
}

/**
 * Avança um tick de 100 ms (ADR-0009). Pura: não muda `estado` nem lê relógio ou acaso de fora.
 * Intenções de heróis que não existem são ignoradas; inválidas viram evento de recusa.
 */
export function passo(
  estado: Estado,
  intencoes: readonly Intencao[],
  mapa: MapaCompacto,
): { estado: Estado; eventos: Evento[] } {
  const herois: Record<string, Heroi> = { ...estado.herois };
  const eventos: Evento[] = [];

  for (const intencao of intencoes) {
    const heroi = herois[intencao.heroi];
    if (!heroi) continue;
    herois[heroi.id] = aplicar(heroi, intencao, mapa, eventos);
  }

  for (const id of Object.keys(herois).sort()) {
    const heroi = herois[id];
    if (!heroi || estado.tick < heroi.livreEm) continue;
    const [direcao, ...resto] = heroi.passoPedido ? [heroi.passoPedido] : heroi.caminho;
    if (!direcao) continue;
    herois[id] = andar(heroi, direcao, heroi.passoPedido ? [] : resto, estado.tick, mapa, eventos);
  }

  return { estado: { ...estado, tick: estado.tick + 1, herois }, eventos };
}

function aplicar(heroi: Heroi, intencao: Intencao, mapa: MapaCompacto, eventos: Evento[]): Heroi {
  switch (intencao.tipo) {
    case 'andar':
      return { ...heroi, passoPedido: intencao.direcao, caminho: [] };
    case 'parar':
      return { ...heroi, passoPedido: null, caminho: [] };
    case 'andarAte': {
      const caminho = acharCaminho(mapa, heroi, intencao);
      if (caminho === null) {
        eventos.push({ tipo: 'recusa', heroi: heroi.id, motivo: 'recusa.inalcancavel' });
        return heroi;
      }
      return { ...heroi, passoPedido: null, caminho };
    }
  }
}

function andar(
  heroi: Heroi,
  direcao: Direcao,
  resto: readonly Direcao[],
  tick: number,
  mapa: MapaCompacto,
  eventos: Evento[],
): Heroi {
  const [dx, dy] = DELTA[direcao];
  const x = heroi.x + dx;
  const y = heroi.y + dy;
  if (!podeAndar(mapa, x, y)) {
    eventos.push({ tipo: 'recusa', heroi: heroi.id, motivo: 'recusa.bloqueado' });
    return { ...heroi, direcao, passoPedido: null, caminho: [] };
  }
  eventos.push({ tipo: 'passo', heroi: heroi.id, x, y, direcao });
  return { ...heroi, x, y, direcao, passoPedido: null, caminho: resto, livreEm: tick + DURACAO_PASSO };
}
