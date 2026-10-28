import Phaser from 'phaser';
import { Client } from '@colyseus/sdk';
import type { MapaCompacto } from '@valengard/core';
import { CenaMundo } from './cena-mundo.ts';
import { definirIdioma, idiomaDoSistema, t } from './i18n/index.ts';

// No desenvolvimento, ?servidor=ws://... troca o servidor (ex.: um com latência simulada).
const SERVIDOR =
  (import.meta.env.DEV ? new URLSearchParams(location.search).get('servidor') : null) ??
  import.meta.env.VITE_SERVIDOR ??
  'ws://localhost:2567';

definirIdioma(idiomaDoSistema(navigator.language));
document.title = t('jogo.titulo');

const elemento = (id: string) => document.getElementById(id) as HTMLElement;
const status = elemento('status');
const ajuda = elemento('ajuda');
const aviso = elemento('aviso');
let limparAviso: ReturnType<typeof setTimeout> | undefined;

const hud = {
  aviso(texto: string) {
    aviso.textContent = texto;
    clearTimeout(limparAviso);
    limparAviso = setTimeout(() => (aviso.textContent = ''), 1500);
  },
};

status.textContent = t('conexao.conectando');

try {
  // O cliente usa o mapa compacto só para prever o próprio passo; quem decide é o servidor.
  const mapa = (await (await fetch('mapas/mundo.compacto.json')).json()) as MapaCompacto;
  const sala = await new Client(SERVIDOR).joinOrCreate('mundo');
  // A cena lê o estado a cada quadro: só começa quando o primeiro estado chegou.
  await new Promise<void>((pronto) => sala.onStateChange.once(() => pronto()));
  status.textContent = '';
  ajuda.textContent = `${t('jogo.titulo')} — ${t('hud.ajuda')}`;
  sala.onLeave(() => (status.textContent = t('conexao.caiu')));
  const jogo = new Phaser.Game({
    type: Phaser.AUTO,
    parent: 'jogo',
    backgroundColor: '#14110f',
    pixelArt: true,
    scale: { mode: Phaser.Scale.RESIZE, width: window.innerWidth, height: window.innerHeight },
    scene: new CenaMundo(sala, mapa, hud),
  });
  if (import.meta.env.DEV) Object.assign(window, { jogo, sala });
} catch (erro) {
  console.error(erro);
  status.textContent = t('conexao.falhou');
}
