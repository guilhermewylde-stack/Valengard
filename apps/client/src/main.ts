import Phaser from 'phaser';
import { Client } from '@colyseus/sdk';
import { CenaMundo } from './cena-mundo.ts';
import { definirIdioma, idiomaDoSistema, t } from './i18n/index.ts';

const SERVIDOR = import.meta.env.VITE_SERVIDOR ?? 'ws://localhost:2567';

definirIdioma(idiomaDoSistema(navigator.language));
document.title = t('jogo.titulo');

const status = document.getElementById('status');
const mostrar = (texto: string) => {
  if (status) status.textContent = texto;
};

mostrar(t('conexao.conectando'));

try {
  const sala = await new Client(SERVIDOR).joinOrCreate('mundo');
  mostrar('');
  sala.onLeave(() => mostrar(t('conexao.caiu')));
  const jogo = new Phaser.Game({
    type: Phaser.AUTO,
    parent: 'jogo',
    backgroundColor: '#14110f',
    pixelArt: true,
    scale: { mode: Phaser.Scale.RESIZE, width: window.innerWidth, height: window.innerHeight },
    scene: new CenaMundo(sala),
  });
  if (import.meta.env.DEV) Object.assign(window, { jogo, sala });
} catch (erro) {
  console.error(erro);
  mostrar(t('conexao.falhou'));
}
