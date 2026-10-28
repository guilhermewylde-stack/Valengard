import { div } from './inteiros.ts';

/**
 * O mapa no formato que o core lê (ticket 10 do roadmap). Gerado pelo build a partir do `.tmj`
 * do Tiled; o cliente desenha direto do `.tmj`. A `versao` entra na versão do core (ADR-0009).
 */
export interface MapaCompacto {
  versao: string;
  largura: number;
  altura: number;
  /** Uma letra por tile, linha a linha: '.' dá para andar, '#' bloqueia. */
  grade: string;
  templo: Tile;
  zonasSeguras: Retangulo[];
  npcs: Npc[];
  nascimentos: PontoDeNascimento[];
  /** Nomes das regiões; o índice 0 é "sem região nomeada". */
  regioes: string[];
  /** Índice em `regioes` de cada tile, linha a linha. */
  regiaoPorTile: number[];
}

export interface Tile {
  x: number;
  y: number;
}

export interface Retangulo extends Tile {
  largura: number;
  altura: number;
}

export interface Npc extends Tile {
  papel: string;
}

export interface PontoDeNascimento extends Tile {
  especie: string;
  raio: number;
  /** Ticks até o monstro renascer. */
  renascimento: number;
}

export function podeAndar(mapa: MapaCompacto, x: number, y: number): boolean {
  if (x < 0 || y < 0 || x >= mapa.largura || y >= mapa.altura) return false;
  return mapa.grade[y * mapa.largura + x] === '.';
}

// --- Conversão do Tiled -------------------------------------------------------------------------

interface PropriedadeTiled {
  name: string;
  value: unknown;
  type?: string;
}

interface ObjetoTiled {
  type?: string;
  class?: string;
  name?: string;
  x: number;
  y: number;
  width?: number;
  height?: number;
  point?: boolean;
  properties?: PropriedadeTiled[];
}

interface CamadaTiled {
  type: string;
  name: string;
  data?: number[];
  objects?: ObjetoTiled[];
}

interface TilesetTiled {
  firstgid: number;
  tiles?: { id: number; properties?: PropriedadeTiled[] }[];
}

export interface MapaTiled {
  width: number;
  height: number;
  tilewidth: number;
  tileheight: number;
  tilesets: TilesetTiled[];
  layers: CamadaTiled[];
}

// Os bits altos do gid do Tiled marcam espelhamento; não importam para a colisão.
const MASCARA_GID = 0x1fffffff;

/** Converte um mapa do Tiled (JSON, tilesets embutidos) para o formato do core. */
export function converterTiled(tmj: MapaTiled, versao: string): MapaCompacto {
  const { width: largura, height: altura, tilewidth: tw, tileheight: th } = tmj;
  const bloqueia = gidsQueBloqueiam(tmj.tilesets);

  const grade: string[] = new Array<string>(largura * altura).fill('.');
  for (const camada of tmj.layers) {
    if (camada.type !== 'tilelayer' || !camada.data) continue;
    camada.data.forEach((gid, i) => {
      if (bloqueia.has(gid & MASCARA_GID)) grade[i] = '#';
    });
  }

  const objetos = tmj.layers.flatMap((c) => (c.type === 'objectgroup' ? (c.objects ?? []) : []));
  const tipo = (o: ObjetoTiled) => o.type ?? o.class ?? '';
  const tileDe = (o: ObjetoTiled): Tile => ({ x: div(o.x, tw), y: div(o.y, th) });
  const retanguloDe = (o: ObjetoTiled): Retangulo => ({
    x: div(o.x, tw),
    y: div(o.y, th),
    largura: div(o.width ?? 0, tw),
    altura: div(o.height ?? 0, th),
  });

  const templos = objetos.filter((o) => tipo(o) === 'templo');
  const primeiroTemplo = templos[0];
  if (templos.length !== 1 || !primeiroTemplo) throw new Error(`o mapa precisa de exatamente 1 templo (achou ${templos.length})`);
  const templo = tileDe(primeiroTemplo);
  if (grade[templo.y * largura + templo.x] !== '.') throw new Error('o templo está num tile bloqueado');

  const regioes = [''];
  const regiaoPorTile = new Array<number>(largura * altura).fill(0);
  for (const o of objetos.filter((o) => tipo(o) === 'regiao')) {
    const indice = regioes.push(o.name ?? '') - 1;
    const r = retanguloDe(o);
    for (let y = r.y; y < r.y + r.altura && y < altura; y++) {
      for (let x = r.x; x < r.x + r.largura && x < largura; x++) regiaoPorTile[y * largura + x] = indice;
    }
  }

  return {
    versao,
    largura,
    altura,
    grade: grade.join(''),
    templo,
    zonasSeguras: objetos.filter((o) => tipo(o) === 'zona_segura').map(retanguloDe),
    npcs: objetos.filter((o) => tipo(o) === 'npc').map((o) => ({ papel: texto(o, 'papel'), ...tileDe(o) })),
    nascimentos: objetos
      .filter((o) => tipo(o) === 'nascimento')
      .map((o) => ({
        especie: texto(o, 'especie'),
        ...tileDe(o),
        raio: numero(o, 'raio'),
        renascimento: numero(o, 'renascimento'),
      })),
    regioes,
    regiaoPorTile,
  };
}

function gidsQueBloqueiam(tilesets: TilesetTiled[]): Set<number> {
  const gids = new Set<number>();
  for (const ts of tilesets) {
    for (const tile of ts.tiles ?? []) {
      if (tile.properties?.some((p) => p.name === 'bloqueia' && p.value === true)) gids.add(ts.firstgid + tile.id);
    }
  }
  return gids;
}

function propriedade(o: ObjetoTiled, nome: string): unknown {
  const p = o.properties?.find((p) => p.name === nome);
  if (p === undefined) throw new Error(`objeto "${o.type ?? o.class}" em (${o.x}, ${o.y}) sem a propriedade "${nome}"`);
  return p.value;
}

function texto(o: ObjetoTiled, nome: string): string {
  return String(propriedade(o, nome));
}

function numero(o: ObjetoTiled, nome: string): number {
  const v = propriedade(o, nome);
  if (typeof v !== 'number' || !Number.isInteger(v)) throw new Error(`a propriedade "${nome}" precisa ser inteira`);
  return v;
}
