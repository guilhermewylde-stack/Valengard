import { describe, expect, it } from 'vitest';
import {
  DURACAO_PASSO,
  adicionarHeroi,
  criarEstado,
  dentroDaArea,
  passo,
  type Estado,
  type Evento,
  type Intencao,
  type MapaCompacto,
} from '../src/index.ts';

// 7×5:
// . . . . . . .
// . . . # . . .
// . . . # . . .
// . . . # . . #
// . . . . . # .
const linhas = ['.......', '...#...', '...#...', '...#..#', '.....#.'];
const mapa: MapaCompacto = {
  versao: 'teste',
  largura: 7,
  altura: 5,
  grade: linhas.join(''),
  templo: { x: 0, y: 0 },
  zonasSeguras: [],
  npcs: [],
  nascimentos: [],
  regioes: [''],
  regiaoPorTile: new Array<number>(35).fill(0),
};

function rodar(estado: Estado, ticks: number, intencoes: Intencao[] = []) {
  const eventos: Evento[] = [];
  for (let i = 0; i < ticks; i++) {
    const r = passo(estado, i === 0 ? intencoes : [], mapa);
    estado = r.estado;
    eventos.push(...r.eventos);
  }
  return { estado, eventos };
}

const comHeroi = (x: number, y: number) => adicionarHeroi(criarEstado([1, 2, 3, 4]), 'h1', x, y);
const passos = (eventos: Evento[]) => eventos.filter((e) => e.tipo === 'passo').length;

describe('passo: andar até', () => {
  it('chega ao destino pelo caminho mais curto, um tile por passo', () => {
    // de (0,2) a (2,2): 2 passos para leste
    const { estado, eventos } = rodar(comHeroi(0, 2), DURACAO_PASSO * 2, [{ tipo: 'andarAte', heroi: 'h1', x: 2, y: 2 }]);
    expect(estado.herois.h1).toMatchObject({ x: 2, y: 2, direcao: 'leste' });
    expect(passos(eventos)).toBe(2);
  });

  it('contorna o obstáculo', () => {
    // de (2,2) a (4,2): a parede em x=3 obriga a descer até y=4; caminho mais curto = 6 passos
    const { estado, eventos } = rodar(comHeroi(2, 2), DURACAO_PASSO * 10, [{ tipo: 'andarAte', heroi: 'h1', x: 4, y: 2 }]);
    expect(estado.herois.h1).toMatchObject({ x: 4, y: 2 });
    expect(passos(eventos)).toBe(6);
  });

  it('recusa destino bloqueado ou fora do mapa sem se mexer', () => {
    for (const [x, y] of [
      [3, 1],
      [9, 9],
    ] as const) {
      const { estado, eventos } = rodar(comHeroi(0, 0), DURACAO_PASSO * 3, [{ tipo: 'andarAte', heroi: 'h1', x, y }]);
      expect(estado.herois.h1).toMatchObject({ x: 0, y: 0 });
      expect(eventos).toContainEqual({ tipo: 'recusa', heroi: 'h1', motivo: 'recusa.inalcancavel' });
    }
  });

  it('recusa destino livre mas cercado', () => {
    // (6,4) só encosta em (5,4) e (6,3), ambos bloqueados
    const { estado, eventos } = rodar(comHeroi(0, 0), DURACAO_PASSO, [{ tipo: 'andarAte', heroi: 'h1', x: 6, y: 4 }]);
    expect(estado.herois.h1).toMatchObject({ x: 0, y: 0 });
    expect(eventos).toContainEqual({ tipo: 'recusa', heroi: 'h1', motivo: 'recusa.inalcancavel' });
  });

  it('andar até o próprio tile não faz nada', () => {
    const { estado, eventos } = rodar(comHeroi(1, 1), 3, [{ tipo: 'andarAte', heroi: 'h1', x: 1, y: 1 }]);
    expect(estado.herois.h1).toMatchObject({ x: 1, y: 1, caminho: [] });
    expect(eventos).toEqual([]);
  });

  it('parar cancela o caminho', () => {
    let { estado } = rodar(comHeroi(0, 0), 1, [{ tipo: 'andarAte', heroi: 'h1', x: 0, y: 4 }]);
    ({ estado } = rodar(estado, DURACAO_PASSO * 5, [{ tipo: 'parar', heroi: 'h1' }]));
    expect(estado.herois.h1).toMatchObject({ x: 0, y: 1, caminho: [] });
  });

  it('andar com o teclado troca o caminho pelo passo pedido', () => {
    let { estado } = rodar(comHeroi(0, 0), 1, [{ tipo: 'andarAte', heroi: 'h1', x: 0, y: 4 }]);
    ({ estado } = rodar(estado, DURACAO_PASSO * 5, [{ tipo: 'andar', heroi: 'h1', direcao: 'leste' }]));
    expect(estado.herois.h1).toMatchObject({ x: 1, y: 1, caminho: [] });
  });
});

describe('dentroDaArea', () => {
  it('cobre a tela (15×11) mais a margem em volta do herói', () => {
    const centro = { x: 50, y: 50 };
    expect(dentroDaArea(centro, { x: 50, y: 50 })).toBe(true);
    expect(dentroDaArea(centro, { x: 60, y: 58 })).toBe(true);
    expect(dentroDaArea(centro, { x: 40, y: 42 })).toBe(true);
    expect(dentroDaArea(centro, { x: 61, y: 50 })).toBe(false);
    expect(dentroDaArea(centro, { x: 50, y: 41 })).toBe(false);
  });
});
