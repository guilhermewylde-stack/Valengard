import type { Tile } from './mapa.ts';

/** Meia tela (15×11 tiles) mais 3 tiles de margem, para quem entra já chegar sincronizado (ADR-0010). */
export const RAIO_AREA_X = 7 + 3;
export const RAIO_AREA_Y = 5 + 3;

/** O que o servidor manda a quem está em `centro`: só o que cabe na área de interesse. */
export function dentroDaArea(centro: Tile, alvo: Tile): boolean {
  return Math.abs(alvo.x - centro.x) <= RAIO_AREA_X && Math.abs(alvo.y - centro.y) <= RAIO_AREA_Y;
}
