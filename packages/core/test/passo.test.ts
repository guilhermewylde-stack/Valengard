import { describe, expect, it } from 'vitest';
import {
  DURACAO_PASSO,
  adicionarHeroi,
  criarEstado,
  passo,
  type Estado,
  type Evento,
  type Intencao,
  type MapaCompacto,
} from '../src/index.ts';

// 5×3, com um bloqueio no meio:
// . . . . .
// . . # . .
// . . . . .
const mapa: MapaCompacto = {
  versao: 'teste',
  largura: 5,
  altura: 3,
  grade: '.....' + '..#..' + '.....',
  templo: { x: 0, y: 0 },
  zonasSeguras: [],
  npcs: [],
  nascimentos: [],
  regioes: [''],
  regiaoPorTile: new Array<number>(15).fill(0),
};

/** Roda `ticks` ticks; as intenções entram só no primeiro. */
function rodar(estado: Estado, ticks: number, intencoes: Intencao[] = []) {
  const eventos: Evento[] = [];
  for (let i = 0; i < ticks; i++) {
    const r = passo(estado, i === 0 ? intencoes : [], mapa);
    estado = r.estado;
    eventos.push(...r.eventos);
  }
  return { estado, eventos };
}

function comHeroi(x: number, y: number) {
  return adicionarHeroi(criarEstado([1, 2, 3, 4]), 'h1', x, y);
}

describe('passo: andar', () => {
  it('anda um tile na direção pedida e vira para ela', () => {
    const { estado, eventos } = rodar(comHeroi(1, 1), 1, [{ tipo: 'andar', heroi: 'h1', direcao: 'norte' }]);
    expect(estado.herois.h1).toMatchObject({ x: 1, y: 0, direcao: 'norte' });
    expect(eventos).toContainEqual({ tipo: 'passo', heroi: 'h1', x: 1, y: 0, direcao: 'norte' });
  });

  it('guarda o pedido feito no meio do passo e o cumpre quando o passo termina', () => {
    let { estado } = rodar(comHeroi(0, 1), 1, [{ tipo: 'andar', heroi: 'h1', direcao: 'leste' }]);
    ({ estado } = rodar(estado, 1, [{ tipo: 'andar', heroi: 'h1', direcao: 'sul' }]));
    expect(estado.herois.h1).toMatchObject({ x: 1, y: 1 });
    ({ estado } = rodar(estado, DURACAO_PASSO));
    expect(estado.herois.h1).toMatchObject({ x: 1, y: 2, direcao: 'sul' });
  });

  it('anda no máximo um tile a cada DURACAO_PASSO ticks', () => {
    let estado = comHeroi(0, 0);
    for (let i = 0; i < DURACAO_PASSO * 2; i++) {
      ({ estado } = rodar(estado, 1, [{ tipo: 'andar', heroi: 'h1', direcao: 'leste' }]));
    }
    expect(estado.herois.h1?.x).toBe(2);
  });

  it('recusa andar para um tile bloqueado, mas vira para ele', () => {
    const { estado, eventos } = rodar(comHeroi(1, 1), 1, [{ tipo: 'andar', heroi: 'h1', direcao: 'leste' }]);
    expect(estado.herois.h1).toMatchObject({ x: 1, y: 1, direcao: 'leste' });
    expect(eventos).toContainEqual({ tipo: 'recusa', heroi: 'h1', motivo: 'recusa.bloqueado' });
  });

  it('recusa andar para fora do mapa', () => {
    const { estado, eventos } = rodar(comHeroi(0, 0), 1, [{ tipo: 'andar', heroi: 'h1', direcao: 'oeste' }]);
    expect(estado.herois.h1).toMatchObject({ x: 0, y: 0 });
    expect(eventos).toContainEqual({ tipo: 'recusa', heroi: 'h1', motivo: 'recusa.bloqueado' });
  });

  it('ignora intenção de herói que não existe', () => {
    const inicial = comHeroi(0, 0);
    const { estado, eventos } = rodar(inicial, 1, [{ tipo: 'andar', heroi: 'fantasma', direcao: 'sul' }]);
    expect(estado.herois).toEqual(inicial.herois);
    expect(eventos).toEqual([]);
  });

  it('não muda o estado recebido (função pura)', () => {
    const inicial = comHeroi(0, 0);
    const copia = structuredClone(inicial);
    rodar(inicial, 3, [{ tipo: 'andar', heroi: 'h1', direcao: 'sul' }]);
    expect(inicial).toEqual(copia);
  });

  it('avança o relógio em um tick por chamada', () => {
    expect(rodar(comHeroi(0, 0), 7).estado.tick).toBe(7);
  });

  it('o mesmo estado e as mesmas intenções dão sempre o mesmo resultado', () => {
    const intencoes: Intencao[] = [{ tipo: 'andar', heroi: 'h1', direcao: 'sul' }];
    expect(rodar(comHeroi(0, 0), 5, intencoes)).toEqual(rodar(comHeroi(0, 0), 5, intencoes));
  });
});

describe('adicionarHeroi', () => {
  it('põe o herói virado para o sul no tile pedido', () => {
    expect(comHeroi(2, 1).herois.h1).toMatchObject({ x: 2, y: 1, direcao: 'sul' });
  });
});
