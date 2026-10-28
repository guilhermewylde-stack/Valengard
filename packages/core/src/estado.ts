import type { Rng } from './rng.ts';

export type Direcao = 'sul' | 'norte' | 'leste' | 'oeste';

export const DELTA: Readonly<Record<Direcao, readonly [number, number]>> = {
  sul: [0, 1],
  norte: [0, -1],
  leste: [1, 0],
  oeste: [-1, 0],
};

/** O que existe agora; é o que vai para o save (ADR-0009). */
export interface Estado {
  tick: number;
  rng: Rng;
  herois: Readonly<Record<string, Heroi>>;
}

export interface Heroi {
  id: string;
  x: number;
  y: number;
  direcao: Direcao;
  /** Tick a partir do qual o herói pode dar o próximo passo. */
  livreEm: number;
  /** Direção pedida no meio de um passo, cumprida quando ele termina. */
  passoPedido: Direcao | null;
}

/** O que o cliente (ou a Tática) pede; aplicado no próximo tick (ADR-0010). */
export type Intencao = { tipo: 'andar'; heroi: string; direcao: Direcao };

/** Chaves de i18n que o core usa como motivo de recusa; o cliente precisa traduzir todas. */
export const MOTIVOS_RECUSA = ['recusa.bloqueado'] as const;
export type MotivoRecusa = (typeof MOTIVOS_RECUSA)[number];

/** O que aconteceu no tick; alimenta o Diário e as animações. */
export type Evento =
  | { tipo: 'passo'; heroi: string; x: number; y: number; direcao: Direcao }
  | { tipo: 'recusa'; heroi: string; motivo: MotivoRecusa };
