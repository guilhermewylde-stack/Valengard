// Converte cada mapa do Tiled (content/mapas/*.tmj) no formato compacto do core (ticket 10 do roadmap).
// A versão do mapa é o hash do .tmj e entra na versão do core (ADR-0009).
// Uso: pnpm mapa   (o CI roda e falha se o compacto commitado estiver desatualizado)
import { createHash } from 'node:crypto';
import { readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { converterTiled, type MapaTiled } from '@valengard/core';

const pasta = join(import.meta.dirname, '..', 'content', 'mapas');

for (const arquivo of readdirSync(pasta).filter((a) => a.endsWith('.tmj'))) {
  const bruto = readFileSync(join(pasta, arquivo), 'utf8').replace(/\r\n/g, '\n');
  const versao = createHash('sha256').update(bruto).digest('hex').slice(0, 12);
  const compacto = converterTiled(JSON.parse(bruto) as MapaTiled, versao);
  const saida = arquivo.replace(/\.tmj$/, '.compacto.json');
  writeFileSync(join(pasta, saida), JSON.stringify(compacto) + '\n');
  console.log(`${arquivo} -> ${saida} (versão ${versao})`);
}
