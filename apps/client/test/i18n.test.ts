import { describe, expect, it } from 'vitest';
import { MOTIVOS_RECUSA } from '@valengard/core';
import { IDIOMAS, achatar, definirIdioma, idiomaDoSistema, t } from '../src/i18n/index.ts';

const chaves = Object.fromEntries(
  Object.entries(IDIOMAS).map(([idioma, arvore]) => [idioma, Object.keys(achatar(arvore)).sort()]),
);

describe('i18n', () => {
  it('toda chave existe em PT-BR e em EN-US', () => {
    expect(chaves['en-US']).toEqual(chaves['pt-BR']);
  });

  it('nenhum texto está vazio', () => {
    for (const arvore of Object.values(IDIOMAS)) {
      for (const [chave, texto] of Object.entries(achatar(arvore))) expect(texto.trim(), chave).not.toBe('');
    }
  });

  it('traduz todo motivo de recusa que o core pode mandar', () => {
    for (const motivo of MOTIVOS_RECUSA) expect(chaves['pt-BR']).toContain(motivo);
  });

  it('troca parâmetros e devolve a chave quando falta tradução', () => {
    definirIdioma('pt-BR');
    expect(t('recusa.bloqueado')).toBe('O caminho está bloqueado.');
    expect(t('nao.existe')).toBe('nao.existe');
  });

  it('escolhe o idioma pelo sistema', () => {
    expect(idiomaDoSistema('pt-BR')).toBe('pt-BR');
    expect(idiomaDoSistema('pt-PT')).toBe('pt-BR');
    expect(idiomaDoSistema('en-GB')).toBe('en-US');
    expect(idiomaDoSistema('es')).toBe('en-US');
  });
});
