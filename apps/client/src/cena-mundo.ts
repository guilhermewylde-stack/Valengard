import Phaser from 'phaser';
import type { Room } from '@colyseus/sdk';
import { DELTA, type Direcao, type Evento, type MapaCompacto } from '@valengard/core';
import { t } from './i18n/index.ts';
import {
  Deslize,
  Interpolador,
  MS_POR_TICK,
  PrevisaoDoPasso,
  escalaInteira,
  poseDeAndar,
  type Posicao,
} from './movimento.ts';

const TILE = 64;
/** Enquanto a tecla está apertada, repete a intenção neste ritmo (o servidor impõe o do passo). */
const REPETIR_ANDAR_MS = MS_POR_TICK;

interface HeroiVisto {
  x: number;
  y: number;
  direcao: string;
}

interface EstadoVisto {
  herois: { get(id: string): HeroiVisto | undefined; forEach(cb: (h: HeroiVisto, id: string) => void): void };
}

interface Entidade {
  sprite: Phaser.GameObjects.Image;
  sombra: Phaser.GameObjects.Ellipse;
  direcao: string;
  movimento: Deslize | Interpolador;
}

export interface Hud {
  aviso(texto: string): void;
}

/**
 * Desenha o mundo e manda intenções; nunca decide nada (ADR-0010). O próprio herói é previsto
 * (PrevisaoDoPasso) e os outros são desenhados ~100 ms atrás, interpolados entre tiles.
 */
export class CenaMundo extends Phaser.Scene {
  private entidades = new Map<string, Entidade>();
  private teclas!: Record<Direcao, Phaser.Input.Keyboard.Key[]>;
  private ultimoAndar = 0;
  private previsao: PrevisaoDoPasso | null = null;

  constructor(
    private readonly sala: Room<unknown, EstadoVisto>,
    private readonly mapaCore: MapaCompacto,
    private readonly hud: Hud,
  ) {
    super('mundo');
  }

  preload() {
    this.load.tilemapTiledJSON('mundo', 'mapas/mundo.tmj');
    this.load.image('provisorio', 'tilesets/provisorio.png');
    for (const d of ['sul', 'norte', 'leste']) this.load.image(`guerreiro-${d}`, `sprites/guerreiro-${d}.png`);
  }

  create() {
    const mapa = this.make.tilemap({ key: 'mundo' });
    const tileset = mapa.addTilesetImage('provisorio', 'provisorio');
    if (!tileset) throw new Error('tileset não encontrado no mapa');
    mapa.createLayer('chao', tileset)?.setDepth(0);
    mapa.createLayer('decoracao', tileset)?.setDepth(1);
    mapa.createLayer('obstaculos', tileset)?.setDepth(2);
    mapa.createLayer('por_cima', tileset)?.setDepth(10);
    this.cameras.main.setBounds(0, 0, mapa.widthInPixels, mapa.heightInPixels);
    this.ajustarEscala();
    this.scale.on('resize', () => this.ajustarEscala());

    this.prepararTeclado();
    this.input.on('pointerdown', (ponteiro: Phaser.Input.Pointer) => {
      const x = Math.floor(ponteiro.worldX / TILE);
      const y = Math.floor(ponteiro.worldY / TILE);
      this.sala.send('andarAte', { x, y });
    });

    this.sala.onMessage('eventos', (eventos: Evento[]) => {
      for (const e of eventos) {
        if (e.tipo !== 'recusa') continue;
        this.previsao?.recusado();
        this.hud.aviso(t(e.motivo));
      }
    });
  }

  update(agora: number) {
    this.lerTeclado(agora);
    this.sincronizar(agora);
    this.desenhar(agora);
  }

  private ajustarEscala() {
    this.cameras.main.setZoom(escalaInteira(this.scale.width, this.scale.height));
  }

  private prepararTeclado() {
    const teclado = this.input.keyboard;
    if (!teclado) throw new Error('sem teclado');
    const K = Phaser.Input.Keyboard.KeyCodes;
    this.teclas = {
      norte: [teclado.addKey(K.UP), teclado.addKey(K.W)],
      sul: [teclado.addKey(K.DOWN), teclado.addKey(K.S)],
      oeste: [teclado.addKey(K.LEFT), teclado.addKey(K.A)],
      leste: [teclado.addKey(K.RIGHT), teclado.addKey(K.D)],
    };
    // Um toque rápido conta como um passo; segurar repete em lerTeclado().
    for (const direcao of Object.keys(this.teclas) as Direcao[]) {
      for (const tecla of this.teclas[direcao]) tecla.on('down', () => this.andar(direcao, this.time.now));
    }
    teclado.addKey(K.ESC).on('down', () => this.sala.send('parar'));
  }

  private lerTeclado(agora: number) {
    if (agora - this.ultimoAndar < REPETIR_ANDAR_MS) return;
    for (const direcao of Object.keys(DELTA) as Direcao[]) {
      if (this.teclas[direcao].some((k) => k.isDown)) {
        this.andar(direcao, agora);
        return;
      }
    }
  }

  private andar(direcao: Direcao, agora: number) {
    this.previsao?.andar(direcao, agora);
    this.sala.send('andar', direcao);
    this.ultimoAndar = agora;
  }

  /** Lê o estado do servidor: confirma a previsão do próprio herói e registra os outros. */
  private sincronizar(agora: number) {
    const vistos = new Set<string>();
    this.sala.state.herois.forEach((h, id) => {
      vistos.add(id);
      const meu = id === this.sala.sessionId;
      const posicao = { x: h.x, y: h.y, direcao: h.direcao as Direcao };
      let entidade = this.entidades.get(id);
      if (!entidade) {
        entidade = this.criarEntidade(posicao, meu);
        this.entidades.set(id, entidade);
        if (meu) {
          this.previsao = new PrevisaoDoPasso(this.mapaCore, posicao);
          this.cameras.main.startFollow(entidade.sprite, true);
        }
      }
      if (meu && this.previsao) {
        this.previsao.confirmar(posicao, agora);
        const { x, y, direcao } = this.previsao.posicao;
        (entidade.movimento as Deslize).mover(x, y, agora);
        entidade.direcao = direcao;
      } else {
        (entidade.movimento as Interpolador).registrar(h.x, h.y, agora);
        entidade.direcao = h.direcao;
      }
    });
    for (const [id, entidade] of this.entidades) {
      if (vistos.has(id)) continue;
      entidade.sprite.destroy();
      entidade.sombra.destroy();
      this.entidades.delete(id);
    }
  }

  private criarEntidade(p: Posicao, meu: boolean): Entidade {
    const sombra = this.add.ellipse(0, 0, 36, 12, 0x000000, 0.3).setDepth(4);
    const sprite = this.add.image(0, 0, 'guerreiro-sul').setOrigin(0.5, 1).setDepth(5);
    const movimento = meu ? new Deslize(p.x, p.y) : new Interpolador();
    if (movimento instanceof Interpolador) movimento.registrar(p.x, p.y, 0);
    return { sprite, sombra, direcao: p.direcao, movimento };
  }

  private desenhar(agora: number) {
    for (const e of this.entidades.values()) {
      const p = e.movimento.posicao(agora);
      if (!p) continue;
      const pose = poseDeAndar(p.fase);
      const px = p.x * TILE + TILE / 2;
      const py = p.y * TILE + TILE;
      const oeste = e.direcao === 'oeste';
      e.sprite
        .setTexture(`guerreiro-${oeste ? 'leste' : e.direcao}`)
        .setFlipX(oeste)
        .setPosition(Math.round(px), Math.round(py + pose.dy))
        .setRotation(pose.rotacao);
      e.sombra.setPosition(Math.round(px), Math.round(py - 4));
    }
  }
}
