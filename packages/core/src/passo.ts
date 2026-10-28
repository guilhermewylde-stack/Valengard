import { DELTA, type Estado, type Evento, type Heroi, type Intencao } from './estado.ts';
import { podeAndar, type MapaCompacto } from './mapa.ts';
import type { Rng } from './rng.ts';

/** Ticks de 100 ms que um passo leva. Provisório: o ticket 02 do Marco 1 fixa o valor final. */
export const DURACAO_PASSO = 3;

export function criarEstado(semente: Rng): Estado {
  return { tick: 0, rng: semente, herois: {} };
}

export function adicionarHeroi(estado: Estado, id: string, x: number, y: number): Estado {
  const heroi: Heroi = { id, x, y, direcao: 'sul', livreEm: estado.tick, passoPedido: null };
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
    herois[heroi.id] = { ...heroi, passoPedido: intencao.direcao };
  }

  for (const id of Object.keys(herois).sort()) {
    const heroi = herois[id];
    if (!heroi?.passoPedido || estado.tick < heroi.livreEm) continue;
    const direcao = heroi.passoPedido;
    const [dx, dy] = DELTA[direcao];
    const x = heroi.x + dx;
    const y = heroi.y + dy;
    if (podeAndar(mapa, x, y)) {
      herois[id] = { ...heroi, x, y, direcao, passoPedido: null, livreEm: estado.tick + DURACAO_PASSO };
      eventos.push({ tipo: 'passo', heroi: id, x, y, direcao });
    } else {
      herois[id] = { ...heroi, direcao, passoPedido: null };
      eventos.push({ tipo: 'recusa', heroi: id, motivo: 'recusa.bloqueado' });
    }
  }

  return { estado: { ...estado, tick: estado.tick + 1, herois }, eventos };
}
