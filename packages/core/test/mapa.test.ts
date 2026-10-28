import { describe, expect, it } from 'vitest';
import { converterTiled, podeAndar } from '../src/index.ts';

// Mapa Tiled mínimo 3×2: tile 1 = grama, tile 2 = muralha (bloqueia).
const tmj = {
  width: 3,
  height: 2,
  tilewidth: 64,
  tileheight: 64,
  tilesets: [{ firstgid: 1, tiles: [{ id: 1, properties: [{ name: 'bloqueia', type: 'bool', value: true }] }] }],
  layers: [
    { type: 'tilelayer', name: 'chao', data: [1, 1, 1, 1, 1, 1] },
    { type: 'tilelayer', name: 'obstaculos', data: [0, 2, 0, 0, 0, 0] },
    {
      type: 'objectgroup',
      name: 'objetos',
      objects: [
        { type: 'templo', x: 32, y: 96, point: true },
        { type: 'npc', x: 160, y: 96, point: true, properties: [{ name: 'papel', value: 'vendedor' }] },
        { type: 'zona_segura', x: 0, y: 0, width: 64, height: 128 },
        { type: 'regiao', name: 'valen', x: 0, y: 0, width: 64, height: 128 },
        {
          type: 'nascimento',
          x: 160,
          y: 32,
          point: true,
          properties: [
            { name: 'especie', value: 'rato' },
            { name: 'raio', value: 3 },
            { name: 'renascimento', value: 600 },
          ],
        },
      ],
    },
  ],
};

describe('converterTiled', () => {
  const mapa = converterTiled(tmj, 'v1');

  it('marca como bloqueado o tile com a propriedade bloqueia, em qualquer camada', () => {
    expect(mapa.grade).toBe('.#.' + '...');
    expect(podeAndar(mapa, 1, 0)).toBe(false);
    expect(podeAndar(mapa, 0, 0)).toBe(true);
  });

  it('trata fora do mapa como bloqueado', () => {
    expect(podeAndar(mapa, -1, 0)).toBe(false);
    expect(podeAndar(mapa, 3, 0)).toBe(false);
    expect(podeAndar(mapa, 0, 2)).toBe(false);
  });

  it('lê templo, NPC, zona segura e ponto de nascimento em tiles', () => {
    expect(mapa.templo).toEqual({ x: 0, y: 1 });
    expect(mapa.npcs).toEqual([{ papel: 'vendedor', x: 2, y: 1 }]);
    expect(mapa.zonasSeguras).toEqual([{ x: 0, y: 0, largura: 1, altura: 2 }]);
    expect(mapa.nascimentos).toEqual([{ especie: 'rato', x: 2, y: 0, raio: 3, renascimento: 600 }]);
  });

  it('marca a região de cada tile (0 = sem região nomeada)', () => {
    expect(mapa.regioes).toEqual(['', 'valen']);
    expect(mapa.regiaoPorTile).toEqual([1, 0, 0, 1, 0, 0]);
  });

  it('guarda a versão recebida', () => {
    expect(mapa.versao).toBe('v1');
  });

  it('falha sem templo', () => {
    const semTemplo = { ...tmj, layers: tmj.layers.slice(0, 2) };
    expect(() => converterTiled(semTemplo, 'v1')).toThrow(/templo/);
  });

  it('falha se o templo está num tile bloqueado', () => {
    const comMuro = structuredClone(tmj);
    comMuro.layers[1] = { type: 'tilelayer', name: 'obstaculos', data: [0, 0, 0, 2, 0, 0] };
    expect(() => converterTiled(comMuro, 'v1')).toThrow(/templo/);
  });
});
