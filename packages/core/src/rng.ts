// RNG sfc32 com o estado guardado na própria simulação (ADR-0009): quatro inteiros de 32 bits.

export type Rng = readonly [number, number, number, number];

/** Avança o RNG e devolve um inteiro de 0 a 2³² − 1. */
export function proximoU32(rng: Rng): [number, Rng] {
  let [a, b, c, d] = rng;
  a >>>= 0;
  b >>>= 0;
  c >>>= 0;
  d >>>= 0;
  const t = (((a + b) | 0) + d) | 0;
  d = (d + 1) | 0;
  a = b ^ (b >>> 9);
  b = (c + (c << 3)) | 0;
  c = (c << 21) | (c >>> 11);
  c = (c + t) | 0;
  return [t >>> 0, [a >>> 0, b >>> 0, c >>> 0, d >>> 0]];
}

const LIMITE_U32 = 4294967296;

/** Sorteia um inteiro de 0 a `max`, inclusive, sem viés (rejeita o resto da faixa). */
export function sortear(rng: Rng, max: number): [number, Rng] {
  const faixa = max + 1;
  const aceitavel = LIMITE_U32 - (LIMITE_U32 % faixa);
  let atual = rng;
  for (;;) {
    const [v, novo] = proximoU32(atual);
    atual = novo;
    if (v < aceitavel) return [v % faixa, atual];
  }
}
