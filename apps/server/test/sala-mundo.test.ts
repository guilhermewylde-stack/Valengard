import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { boot, type ColyseusTestServer } from '@colyseus/testing';
import { mapaDoMundo } from '../src/mapa.ts';
import { criarServidor } from '../src/servidor.ts';
import type { SalaMundo } from '../src/sala-mundo.ts';

let colyseus: ColyseusTestServer;

beforeAll(async () => {
  // Porta própria: a padrão do boot (2568) bate com servidores de desenvolvimento.
  colyseus = await boot(criarServidor(), 25670);
});
afterAll(() => colyseus.shutdown());
beforeEach(() => colyseus.cleanup());

/** Espera até `cond` valer, checando a cada patch. */
async function ate(cond: () => boolean, tentativas = 30) {
  for (let i = 0; i < tentativas && !cond(); i++) await new Promise((r) => setTimeout(r, 50));
  expect(cond()).toBe(true);
}

describe('sala do mundo', () => {
  it('põe o herói no templo ao entrar', async () => {
    const sala = await colyseus.createRoom<SalaMundo>('mundo');
    const cliente = await colyseus.connectTo(sala);
    const { templo } = mapaDoMundo();
    await ate(() => cliente.state.herois.get(cliente.sessionId) !== undefined);
    expect(cliente.state.herois.get(cliente.sessionId)).toMatchObject({ x: templo.x, y: templo.y, direcao: 'sul' });
  });

  it('anda um tile quando o cliente manda a intenção andar', async () => {
    const sala = await colyseus.createRoom<SalaMundo>('mundo');
    const cliente = await colyseus.connectTo(sala);
    const { templo } = mapaDoMundo();
    cliente.send('andar', 'leste');
    await ate(() => cliente.state.herois.get(cliente.sessionId)?.x === templo.x + 1);
    expect(cliente.state.herois.get(cliente.sessionId)).toMatchObject({ y: templo.y, direcao: 'leste' });
  });

  it('manda o evento de recusa ao bater na muralha', async () => {
    const sala = await colyseus.createRoom<SalaMundo>('mundo');
    const cliente = await colyseus.connectTo(sala);
    const recusas: string[] = [];
    cliente.onMessage('eventos', (eventos: { tipo: string; motivo?: string }[]) => {
      for (const e of eventos) if (e.tipo === 'recusa' && e.motivo) recusas.push(e.motivo);
    });
    // do templo para o norte até a muralha de Valen
    for (let i = 0; i < 6; i++) {
      cliente.send('andar', 'norte');
      await new Promise((r) => setTimeout(r, 350));
    }
    await ate(() => recusas.length > 0);
    expect(recusas[0]).toBe('recusa.bloqueado');
  });

  it('anda até o tile clicado e para quando pedido', async () => {
    const sala = await colyseus.createRoom<SalaMundo>('mundo');
    const cliente = await colyseus.connectTo(sala);
    const { templo } = mapaDoMundo();
    const heroi = () => cliente.state.herois.get(cliente.sessionId);
    cliente.send('andarAte', { x: templo.x + 2, y: templo.y });
    await ate(() => heroi()?.x === templo.x + 2);
    cliente.send('andarAte', { x: templo.x - 2, y: templo.y + 3 });
    await ate(() => heroi()?.x !== templo.x + 2 || heroi()?.y !== templo.y);
    cliente.send('parar');
    await new Promise((r) => setTimeout(r, 1200));
    const parado = { x: heroi()?.x, y: heroi()?.y };
    expect(parado).not.toEqual({ x: templo.x - 2, y: templo.y + 3 });
  });

  it('ignora intenção malformada sem mudar nada', async () => {
    const sala = await colyseus.createRoom<SalaMundo>('mundo');
    const cliente = await colyseus.connectTo(sala);
    const { templo } = mapaDoMundo();
    cliente.send('andar', { x: 99, y: 99 });
    cliente.send('andar', 'cima');
    cliente.send('andarAte', { x: 1.5, y: 'a' });
    cliente.send('andarAte', null);
    await new Promise((r) => setTimeout(r, 300));
    expect(cliente.state.herois.get(cliente.sessionId)).toMatchObject({ x: templo.x, y: templo.y });
  });
});
