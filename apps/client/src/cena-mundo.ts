import Phaser from 'phaser';
import type { Room } from '@colyseus/sdk';
import { DELTA, DURACAO_PASSO, type Direcao, type Evento } from '@valengard/core';
import { t } from './i18n/index.ts';

const TILE = 64;
const MS_POR_TICK = 100;
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

/**
 * Desenha o mundo e manda intenções; nunca decide nada (ADR-0010). A previsão do passo e a
 * interpolação de verdade são do ticket 02; aqui o sprite só desliza até o tile novo.
 */
export class CenaMundo extends Phaser.Scene {
  private sprites = new Map<string, Phaser.GameObjects.Image>();
  private teclas!: Record<Direcao, Phaser.Input.Keyboard.Key[]>;
  private ultimoAndar = 0;
  private aviso!: Phaser.GameObjects.Text;

  constructor(private readonly sala: Room<unknown, EstadoVisto>) {
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

    this.add
      .text(12, 12, `${t('jogo.titulo')} — ${t('hud.ajuda')}`, { fontFamily: 'monospace', fontSize: '14px', color: '#e8dcc0' })
      .setScrollFactor(0)
      .setDepth(100);
    this.aviso = this.add
      .text(12, 36, '', { fontFamily: 'monospace', fontSize: '14px', color: '#e0a080' })
      .setScrollFactor(0)
      .setDepth(100);

    this.sala.onMessage('eventos', (eventos: Evento[]) => {
      for (const e of eventos) if (e.tipo === 'recusa') this.avisar(t(e.motivo));
    });
  }

  update(agora: number) {
    this.sincronizarHerois();
    this.lerTeclado(agora);
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
    this.sala.send('andar', direcao);
    this.ultimoAndar = agora;
  }

  private sincronizarHerois() {
    const vistos = new Set<string>();
    this.sala.state.herois.forEach((h, id) => {
      vistos.add(id);
      let sprite = this.sprites.get(id);
      const px = h.x * TILE + TILE / 2;
      const py = h.y * TILE + TILE;
      if (!sprite) {
        sprite = this.add.image(px, py, 'guerreiro-sul').setOrigin(0.5, 1).setDepth(5);
        this.sprites.set(id, sprite);
        if (id === this.sala.sessionId) this.cameras.main.startFollow(sprite, true);
      }
      const oeste = h.direcao === 'oeste';
      sprite.setTexture(`guerreiro-${oeste ? 'leste' : h.direcao}`).setFlipX(oeste);
      if (sprite.getData('alvoX') !== px || sprite.getData('alvoY') !== py) {
        sprite.setData({ alvoX: px, alvoY: py });
        this.tweens.add({ targets: sprite, x: px, y: py, duration: DURACAO_PASSO * MS_POR_TICK });
      }
    });
    for (const [id, sprite] of this.sprites) {
      if (!vistos.has(id)) {
        sprite.destroy();
        this.sprites.delete(id);
      }
    }
  }

  private avisar(texto: string) {
    this.aviso.setText(texto);
    this.time.delayedCall(1500, () => this.aviso.setText(''));
  }
}
