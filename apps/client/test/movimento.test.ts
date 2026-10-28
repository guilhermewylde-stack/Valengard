import { describe, expect, it } from 'vitest';
import type { MapaCompacto } from '@valengard/core';
import {
  ATRASO_INTERPOLACAO_MS,
  Deslize,
  Interpolador,
  MS_POR_PASSO,
  PrevisaoDoPasso,
  escalaInteira,
  poseDeAndar,
} from '../src/movimento.ts';

// 4×1 com muro no fim: . . . #
const mapa: MapaCompacto = {
  versao: 't',
  largura: 4,
  altura: 1,
  grade: '...#',
  templo: { x: 0, y: 0 },
  zonasSeguras: [],
  npcs: [],
  nascimentos: [],
  regioes: [''],
  regiaoPorTile: [0, 0, 0, 0],
};

const inicio = { x: 0, y: 0, direcao: 'sul' as const };

describe('PrevisaoDoPasso', () => {
  it('anda na hora, antes do servidor responder', () => {
    const p = new PrevisaoDoPasso(mapa, inicio);
    p.andar('leste', 0);
    expect(p.posicao).toEqual({ x: 1, y: 0, direcao: 'leste' });
  });

  it('não prevê outro passo antes do anterior terminar', () => {
    const p = new PrevisaoDoPasso(mapa, inicio);
    p.andar('leste', 0);
    p.andar('leste', MS_POR_PASSO - 1);
    expect(p.posicao.x).toBe(1);
    p.andar('leste', MS_POR_PASSO);
    expect(p.posicao.x).toBe(2);
  });

  it('só vira contra um tile bloqueado', () => {
    const p = new PrevisaoDoPasso(mapa, { x: 2, y: 0, direcao: 'sul' });
    p.andar('leste', 0);
    expect(p.posicao).toEqual({ x: 2, y: 0, direcao: 'leste' });
  });

  it('mantém a previsão enquanto o servidor ainda não chegou lá', () => {
    const p = new PrevisaoDoPasso(mapa, inicio);
    p.andar('leste', 0);
    p.confirmar(inicio, 50);
    expect(p.posicao.x).toBe(1);
    p.confirmar({ x: 1, y: 0, direcao: 'leste' }, 120);
    expect(p.posicao.x).toBe(1);
  });

  it('volta ao tile do servidor quando ele recusa', () => {
    const p = new PrevisaoDoPasso(mapa, inicio);
    p.andar('leste', 0);
    p.recusado();
    expect(p.posicao).toEqual(inicio);
  });

  it('desfaz o passo que o servidor não confirma a tempo', () => {
    const p = new PrevisaoDoPasso(mapa, inicio);
    p.andar('leste', 0);
    p.confirmar(inicio, 1000);
    expect(p.posicao.x).toBe(0);
  });

  it('segue o servidor quando não há previsão (andar até)', () => {
    const p = new PrevisaoDoPasso(mapa, inicio);
    p.confirmar({ x: 2, y: 0, direcao: 'leste' }, 10);
    expect(p.posicao).toEqual({ x: 2, y: 0, direcao: 'leste' });
  });
});

describe('Deslize', () => {
  it('leva a duração de um passo para chegar ao tile vizinho', () => {
    const d = new Deslize(0, 0);
    d.mover(1, 0, 1000);
    expect(d.posicao(1000 + MS_POR_PASSO / 2)).toMatchObject({ x: 0.5, y: 0 });
    expect(d.posicao(1000 + MS_POR_PASSO)).toEqual({ x: 1, y: 0, fase: null });
  });

  it('corrige saltos maiores bem mais rápido', () => {
    const d = new Deslize(0, 0);
    d.mover(3, 0, 0);
    expect(d.posicao(100)).toEqual({ x: 3, y: 0, fase: null });
  });
});

describe('Interpolador', () => {
  it('desenha o tile antigo até o atraso passar e depois desliza', () => {
    const i = new Interpolador();
    i.registrar(0, 0, 0);
    i.registrar(1, 0, 1000);
    expect(i.posicao(1000)).toMatchObject({ x: 0, y: 0 });
    expect(i.posicao(1000 + ATRASO_INTERPOLACAO_MS + MS_POR_PASSO / 2)).toMatchObject({ x: 0.5 });
    expect(i.posicao(5000)).toEqual({ x: 1, y: 0, fase: null });
  });

  it('sem amostras não desenha nada', () => {
    expect(new Interpolador().posicao(0)).toBeNull();
  });
});

describe('escalaInteira', () => {
  it('usa ×2 só quando cabem 15×11 tiles ampliados', () => {
    expect(escalaInteira(1280, 720)).toBe(1);
    expect(escalaInteira(1920, 1408)).toBe(2);
    expect(escalaInteira(2560, 1440)).toBe(2);
    expect(escalaInteira(500, 400)).toBe(1);
  });
});

describe('poseDeAndar', () => {
  it('parado fica reto; andando sobe até 4 px', () => {
    expect(poseDeAndar(null)).toEqual({ dy: 0, rotacao: 0 });
    expect(poseDeAndar(0.25).dy).toBeCloseTo(-4);
  });
});
