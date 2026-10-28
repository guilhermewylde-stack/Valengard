import { DELTA, DURACAO_PASSO, podeAndar, type Direcao, type MapaCompacto } from '@valengard/core';

// Como o cliente desenha o movimento sem decidir nada (ADR-0010): prevê só o passo do próprio
// herói, com as mesmas regras de mapa do core, e volta quando o servidor discorda.

export const MS_POR_TICK = 100;
export const MS_POR_PASSO = DURACAO_PASSO * MS_POR_TICK;
/** Quanto atrás do servidor as outras entidades são desenhadas. */
export const ATRASO_INTERPOLACAO_MS = 100;
/** Passo previsto que o servidor não confirma nesse tempo é desfeito. */
const PRAZO_CONFIRMACAO_MS = 600;

export interface Posicao {
  x: number;
  y: number;
  direcao: Direcao;
}

interface Pendente {
  x: number;
  y: number;
  em: number;
}

/** Previsão do passo do próprio herói: anda na hora e reconcilia com o que o servidor manda. */
export class PrevisaoDoPasso {
  private atual: Posicao;
  private servidor: Posicao;
  private pendentes: Pendente[] = [];
  private livreEm = 0;

  constructor(
    private readonly mapa: MapaCompacto,
    inicio: Posicao,
  ) {
    this.atual = { ...inicio };
    this.servidor = { ...inicio };
  }

  get posicao(): Posicao {
    return this.atual;
  }

  /** O jogador pediu um passo. Prevê se o herói está livre; vira para a direção de todo jeito. */
  andar(direcao: Direcao, agora: number) {
    if (agora < this.livreEm) return;
    const [dx, dy] = DELTA[direcao];
    const x = this.atual.x + dx;
    const y = this.atual.y + dy;
    if (!podeAndar(this.mapa, x, y)) {
      this.atual = { ...this.atual, direcao };
      return;
    }
    this.atual = { x, y, direcao };
    this.pendentes.push({ x, y, em: agora });
    this.livreEm = agora + MS_POR_PASSO;
  }

  /** Chegou a posição do herói segundo o servidor. */
  confirmar(servidor: Posicao, agora: number) {
    this.servidor = { ...servidor };
    const i = this.pendentes.findIndex((p) => p.x === servidor.x && p.y === servidor.y);
    if (i >= 0) this.pendentes.splice(0, i + 1);
    const vencido = this.pendentes[0] !== undefined && agora - this.pendentes[0].em > PRAZO_CONFIRMACAO_MS;
    if (this.pendentes.length === 0 || vencido) this.voltar();
  }

  /** O servidor recusou um passo: volta ao último tile que ele confirmou. */
  recusado() {
    this.voltar();
  }

  private voltar() {
    this.pendentes = [];
    this.atual = { ...this.servidor };
  }
}

/** Desliza o desenho de um tile ao próximo; saltos maiores (correção) são rápidos. */
export class Deslize {
  private de: { x: number; y: number };
  private para: { x: number; y: number };
  private inicio = 0;
  private duracao = 1;

  constructor(x: number, y: number) {
    this.de = { x, y };
    this.para = { x, y };
  }

  mover(x: number, y: number, agora: number) {
    if (x === this.para.x && y === this.para.y) return;
    const atual = this.posicao(agora);
    const vizinho = Math.abs(x - this.para.x) + Math.abs(y - this.para.y) === 1;
    this.de = { x: atual.x, y: atual.y };
    this.para = { x, y };
    this.inicio = agora;
    this.duracao = vizinho ? MS_POR_PASSO : MS_POR_TICK;
  }

  /** Posição em tiles (com fração) e quanto do passo já foi (0 a 1), ou null parado. */
  posicao(agora: number): { x: number; y: number; fase: number | null } {
    const p = Math.min(1, (agora - this.inicio) / this.duracao);
    if (p >= 1) return { ...this.para, fase: null };
    return {
      x: this.de.x + (this.para.x - this.de.x) * p,
      y: this.de.y + (this.para.y - this.de.y) * p,
      fase: p,
    };
  }
}

/** Outras entidades: guarda as mudanças de tile do servidor e desenha ~100 ms atrás. */
export class Interpolador {
  private amostras: { t: number; x: number; y: number }[] = [];

  registrar(x: number, y: number, agora: number) {
    const ultima = this.amostras.at(-1);
    if (ultima && ultima.x === x && ultima.y === y) return;
    this.amostras.push({ t: agora, x, y });
    if (this.amostras.length > 8) this.amostras.shift();
  }

  posicao(agora: number): { x: number; y: number; fase: number | null } | null {
    const alvo = agora - ATRASO_INTERPOLACAO_MS;
    let i = this.amostras.length - 1;
    while (i > 0 && (this.amostras[i]?.t ?? 0) > alvo) i--;
    const atual = this.amostras[i];
    if (!atual) return null;
    const anterior = this.amostras[i - 1];
    const p = (alvo - atual.t) / MS_POR_PASSO;
    if (!anterior || p >= 1 || p < 0) return { x: atual.x, y: atual.y, fase: null };
    return { x: anterior.x + (atual.x - anterior.x) * p, y: anterior.y + (atual.y - anterior.y) * p, fase: p };
  }
}

/** Maior escala inteira que ainda mostra a tela inteira (15×11 tiles de 64 px), no mínimo ×1. */
export function escalaInteira(largura: number, altura: number): number {
  return Math.max(1, Math.min(Math.floor(largura / (15 * 64)), Math.floor(altura / (11 * 64))));
}

/** Balanço do andar (protótipo do teste das 3 direções, revisto para 64 px): sobe até 4 px e inclina. */
export function poseDeAndar(fase: number | null): { dy: number; rotacao: number } {
  if (fase === null) return { dy: 0, rotacao: 0 };
  const s = Math.sin(fase * Math.PI * 2);
  return { dy: -Math.abs(s) * 4, rotacao: s * 0.06 };
}
