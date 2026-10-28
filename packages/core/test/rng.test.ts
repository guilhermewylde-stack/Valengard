import { describe, expect, it } from 'vitest';
import { proximoU32, sortear, type Rng } from '../src/index.ts';

describe('RNG sfc32', () => {
  it('é determinístico para a mesma semente', () => {
    const a = proximoU32([1, 2, 3, 4]);
    expect(a).toEqual(proximoU32([1, 2, 3, 4]));
    expect(Number.isInteger(a[0])).toBe(true);
    expect(a[0]).toBeGreaterThanOrEqual(0);
  });

  it('muda com a semente', () => {
    expect(proximoU32([1, 2, 3, 4])[0]).not.toBe(proximoU32([1, 2, 3, 5])[0]);
  });

  it('sorteia inteiros de 0 até o máximo, inclusive, cobrindo a faixa', () => {
    let rng: Rng = [9, 8, 7, 6];
    const vistos = new Set<number>();
    for (let i = 0; i < 500; i++) {
      const [v, novo] = sortear(rng, 5);
      rng = novo;
      expect(v).toBeGreaterThanOrEqual(0);
      expect(v).toBeLessThanOrEqual(5);
      vistos.add(v);
    }
    expect(vistos.size).toBe(6);
  });

  it('sortear até 0 sempre dá 0', () => {
    expect(sortear([1, 2, 3, 4], 0)[0]).toBe(0);
  });
});
