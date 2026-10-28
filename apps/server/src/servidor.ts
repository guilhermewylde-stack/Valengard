import { defineRoom, defineServer } from '@colyseus/core';
import { WebSocketTransport } from '@colyseus/ws-transport';
import { SalaMundo } from './sala-mundo.ts';

export function criarServidor() {
  return defineServer({
    transport: new WebSocketTransport(),
    rooms: {
      mundo: defineRoom(SalaMundo),
    },
  });
}
