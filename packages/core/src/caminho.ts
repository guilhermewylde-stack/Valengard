import { DELTA, type Direcao } from './estado.ts';
import { podeAndar, type MapaCompacto, type Tile } from './mapa.ts';

// Ordem fixa dos vizinhos: o desempate entre caminhos de mesmo tamanho é sempre o mesmo.
const ORDEM: readonly Direcao[] = ['norte', 'leste', 'sul', 'oeste'];

/**
 * Caminho mais curto em grade (busca em largura, 4 direções) de `de` até `para`.
 * Devolve as direções a seguir, `[]` se já está lá, ou `null` se não há caminho.
 */
export function acharCaminho(mapa: MapaCompacto, de: Tile, para: Tile): Direcao[] | null {
  if (de.x === para.x && de.y === para.y) return [];
  if (!podeAndar(mapa, para.x, para.y)) return null;

  const largura = mapa.largura;
  // direção com que se chegou a cada tile; undefined = ainda não visitado
  const chegada: (Direcao | 'inicio' | undefined)[] = new Array(largura * mapa.altura);
  chegada[de.y * largura + de.x] = 'inicio';
  const fila: Tile[] = [de];

  for (let i = 0; i < fila.length; i++) {
    const atual = fila[i];
    if (!atual) break;
    for (const direcao of ORDEM) {
      const [dx, dy] = DELTA[direcao];
      const x = atual.x + dx;
      const y = atual.y + dy;
      if (!podeAndar(mapa, x, y) || chegada[y * largura + x] !== undefined) continue;
      chegada[y * largura + x] = direcao;
      if (x === para.x && y === para.y) return refazer(chegada, largura, para);
      fila.push({ x, y });
    }
  }
  return null;
}

function refazer(chegada: (Direcao | 'inicio' | undefined)[], largura: number, para: Tile): Direcao[] {
  const caminho: Direcao[] = [];
  let { x, y } = para;
  for (;;) {
    const direcao = chegada[y * largura + x];
    if (direcao === 'inicio' || direcao === undefined) return caminho.reverse();
    caminho.push(direcao);
    const [dx, dy] = DELTA[direcao];
    x -= dx;
    y -= dy;
  }
}
