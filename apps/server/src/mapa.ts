import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import type { MapaCompacto } from '@valengard/core';

const ARQUIVO = join(import.meta.dirname, '..', '..', '..', 'content', 'mapas', 'mundo.compacto.json');

let cache: MapaCompacto | undefined;

/** O mapa compacto gerado por `pnpm mapa`, lido uma vez. */
export function mapaDoMundo(): MapaCompacto {
  cache ??= JSON.parse(readFileSync(ARQUIVO, 'utf8')) as MapaCompacto;
  return cache;
}
