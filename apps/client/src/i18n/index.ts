import ptBR from './pt-BR.json';
import enUS from './en-US.json';

// Todo texto do jogo vem daqui, nunca fixo no código (CLAUDE.md). O core e o servidor só mandam chaves.

export const IDIOMAS = { 'pt-BR': ptBR, 'en-US': enUS } as const;
export type Idioma = keyof typeof IDIOMAS;

type Arvore = { [chave: string]: string | Arvore };

/** Achata `{ a: { b: "x" } }` em `{ "a.b": "x" }`. */
export function achatar(arvore: Arvore, prefixo = ''): Record<string, string> {
  const saida: Record<string, string> = {};
  for (const [k, v] of Object.entries(arvore)) {
    const chave = prefixo ? `${prefixo}.${k}` : k;
    if (typeof v === 'string') saida[chave] = v;
    else Object.assign(saida, achatar(v, chave));
  }
  return saida;
}

const textos: Record<Idioma, Record<string, string>> = {
  'pt-BR': achatar(ptBR),
  'en-US': achatar(enUS),
};

let atual: Idioma = 'pt-BR';

export function idiomaDoSistema(lingua: string): Idioma {
  return lingua.toLowerCase().startsWith('pt') ? 'pt-BR' : 'en-US';
}

export function definirIdioma(idioma: Idioma) {
  atual = idioma;
}

/** Traduz `chave`, trocando `{nome}` pelos parâmetros. Sem tradução, devolve a própria chave. */
export function t(chave: string, params: Record<string, string | number> = {}): string {
  const texto = textos[atual][chave] ?? chave;
  return texto.replace(/\{(\w+)\}/g, (_, nome: string) => String(params[nome] ?? `{${nome}}`));
}
