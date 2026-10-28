// Único lugar do core onde a divisão é permitida: sempre arredonda para baixo (ADR-0009).

/** ⌊a / b⌋ para inteiros, com b > 0. */
export function div(a: number, b: number): number {
  return Math.floor(a / b);
}
