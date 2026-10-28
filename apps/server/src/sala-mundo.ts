import { randomInt } from 'node:crypto';
import { Room, type Client, type Messages } from '@colyseus/core';
import { schema, t, MapSchema, StateView, type SchemaType } from '@colyseus/schema';
import {
  DELTA,
  dentroDaArea,
  adicionarHeroi,
  criarEstado,
  passo,
  removerHeroi,
  type Direcao,
  type Estado,
  type Evento,
  type Intencao,
  type MapaCompacto,
} from '@valengard/core';
import { mapaDoMundo } from './mapa.ts';

/** Ticks por segundo: um tick do core = 100 ms (ADR-0009). */
export const TICKS_POR_SEGUNDO = 10;

export const HeroiSala = schema(
  {
    x: t.uint16(),
    y: t.uint16(),
    direcao: t.string(),
  },
  'HeroiSala',
);

export const EstadoSala = schema(
  {
    herois: t.map(HeroiSala).view(),
  },
  'EstadoSala',
);

type EstadoSalaT = SchemaType<typeof EstadoSala>;

/**
 * A sala do Marco 1: o mapa simulado para um herói conectado por vez (outros heróis no mesmo
 * Mundo ficam para o Marco 2). O estado verdadeiro é o do core; o schema só espelha o que o
 * cliente precisa desenhar. O cliente manda intenções; nada que ele diga vira valor (ADR-0010).
 */
export class SalaMundo extends Room<{ state: EstadoSalaT }> {
  maxClients = 1;
  state = new EstadoSala({ herois: new MapSchema() });

  private mapa: MapaCompacto = mapaDoMundo();
  private sim: Estado = criarEstado([randomInt(2 ** 32), randomInt(2 ** 32), randomInt(2 ** 32), randomInt(2 ** 32)]);
  private fila: Intencao[] = [];

  messages: Messages<this> = {
    andar: (client: Client, direcao: unknown) => {
      if (!ehDirecao(direcao)) return;
      this.fila.push({ tipo: 'andar', heroi: client.sessionId, direcao });
    },
    andarAte: (client: Client, destino: unknown) => {
      if (!ehTile(destino)) return;
      this.fila.push({ tipo: 'andarAte', heroi: client.sessionId, x: destino.x, y: destino.y });
    },
    parar: (client: Client) => {
      this.fila.push({ tipo: 'parar', heroi: client.sessionId });
    },
  };

  onCreate() {
    this.setFixedTimestep(() => this.avancar(), TICKS_POR_SEGUNDO);
  }

  onJoin(client: Client) {
    const { x, y } = this.mapa.templo;
    this.sim = adicionarHeroi(this.sim, client.sessionId, x, y);
    client.view = new StateView();
    this.espelhar();
  }

  onLeave(client: Client) {
    this.sim = removerHeroi(this.sim, client.sessionId);
    this.espelhar();
  }

  private avancar() {
    const { estado, eventos } = passo(this.sim, this.fila, this.mapa);
    this.fila = [];
    this.sim = estado;
    this.espelhar();
    this.enviarEventos(eventos);
  }

  private espelhar() {
    const herois = this.state.herois;
    for (const id of herois.keys()) if (!this.sim.herois[id]) herois.delete(id);
    for (const h of Object.values(this.sim.herois)) {
      const atual = herois.get(h.id);
      if (atual) {
        atual.x = h.x;
        atual.y = h.y;
        atual.direcao = h.direcao;
      } else {
        herois.set(h.id, new HeroiSala({ x: h.x, y: h.y, direcao: h.direcao }));
      }
    }
    this.atualizarAreas();
  }

  /** Cada cliente só recebe o que está na área de interesse do próprio herói (ADR-0010). */
  private atualizarAreas() {
    for (const client of this.clients) {
      const centro = this.sim.herois[client.sessionId];
      const view = client.view;
      if (!centro || !view) continue;
      this.state.herois.forEach((h, id) => {
        const visivel = id === client.sessionId || dentroDaArea(centro, h);
        if (visivel && !view.has(h)) view.add(h);
        else if (!visivel && view.has(h)) view.remove(h);
      });
    }
  }

  /** Eventos do tick só para o dono do herói (no Marco 1, quem vê é só ele). */
  private enviarEventos(eventos: Evento[]) {
    if (eventos.length === 0) return;
    for (const client of this.clients) {
      const meus = eventos.filter((e) => e.heroi === client.sessionId);
      if (meus.length > 0) client.send('eventos', meus);
    }
  }
}

function ehDirecao(v: unknown): v is Direcao {
  return typeof v === 'string' && Object.hasOwn(DELTA, v);
}

function ehTile(v: unknown): v is { x: number; y: number } {
  if (typeof v !== 'object' || v === null) return false;
  const { x, y } = v as Record<string, unknown>;
  return Number.isInteger(x) && Number.isInteger(y);
}
