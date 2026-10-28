"""Recorta o magenta das imagens do Gemini e reduz para a grade de 64 px.

Uso: python processar.py  (lê ../../assets/inbox, grava sprites/*.png)
Todas as direções de um personagem usam a mesma escala, para o tamanho não pular.
"""
from pathlib import Path
from PIL import Image
import numpy as np

AQUI = Path(__file__).parent
INBOX = AQUI / "../../assets/inbox"
SAIDA = AQUI / "sprites"
TILE = 64
CORES = 48  # cores por personagem depois da redução

PERSONAGENS = {
    "guerreiro": {"sul": "guerreiro-sul", "norte": "guerreiro-norte", "leste": "guerreiro-leste-v2"},
    "lobo": {"sul": "lobo-sul", "norte": "lobo-norte", "leste": "lobo-leste"},
}


def mascara(rgb):
    r, g, b = (rgb[..., i].astype(int) for i in range(3))
    # magenta: R e B altos, G baixo; a franja do JPG ainda é "mais magenta que verde"
    return ~((r > 150) & (b > 150) & (g < 110) | ((r + b) / 2 - g > 110))


def reduzir(rgb, fg, escala, caixa):
    x0, y0, x1, y1 = caixa
    w, h = x1 - x0, y1 - y0
    tw, th = round(w / escala), round(h / escala)
    out = np.zeros((TILE, TILE, 4), np.uint8)
    ox, oy = (TILE - tw) // 2, TILE - th  # centraliza na horizontal, pés no chão do tile
    for ty in range(th):
        for tx in range(tw):
            sx0, sx1 = x0 + int(tx * escala), x0 + int((tx + 1) * escala)
            sy0, sy1 = y0 + int(ty * escala), y0 + int((ty + 1) * escala)
            m = fg[sy0:sy1, sx0:sx1]
            if m.mean() < 0.45:
                continue
            px = rgb[sy0:sy1, sx0:sx1][m]
            out[oy + ty, ox + tx, :3] = np.median(px, axis=0)
            out[oy + ty, ox + tx, 3] = 255
    return out


def contorno(a):
    """Contorno escuro de 1 px: pixel opaco que encosta no fundo vira a própria cor a 30%."""
    op = a[..., 3] > 0
    viz = np.zeros_like(op)
    p = np.pad(op, 1)
    for dy, dx in ((0, 1), (2, 1), (1, 0), (1, 2)):
        viz |= ~p[dy:dy + TILE, dx:dx + TILE]
    borda = op & viz
    a = a.copy()
    a[borda, :3] = (a[borda, :3] * 0.3).astype(np.uint8)
    return a


def quantizar(imgs):
    """Uma paleta comum para as direções do mesmo personagem."""
    tira = Image.fromarray(np.concatenate(imgs, axis=1), "RGBA")
    pal = tira.convert("RGB").quantize(CORES, method=Image.Quantize.MEDIANCUT)
    res = []
    for a in imgs:
        q = Image.fromarray(a[..., :3]).quantize(palette=pal, dither=Image.Dither.NONE).convert("RGB")
        res.append(np.dstack([np.array(q), a[..., 3]]))
    return res


def principal():
    SAIDA.mkdir(exist_ok=True)
    for nome, direcoes in PERSONAGENS.items():
        dados = {}
        for d, arq in direcoes.items():
            rgb = np.array(Image.open(INBOX / f"{arq}.jpg").convert("RGB"))
            fg = mascara(rgb)
            ys, xs = np.nonzero(fg)
            dados[d] = (rgb, fg, (xs.min(), ys.min(), xs.max() + 1, ys.max() + 1))
        maior = max(max(c[2] - c[0], c[3] - c[1]) for _, _, c in dados.values())
        escala = maior / (TILE - 1)
        imgs = [contorno(a) for a in quantizar([reduzir(r, f, escala, c) for r, f, c in dados.values()])]
        for d, a in zip(dados, imgs):
            Image.fromarray(a, "RGBA").save(SAIDA / f"{nome}-{d}.png")
        # comparação lado a lado: sul, norte, leste, oeste (espelhado), ×6
        lado = np.concatenate(imgs + [imgs[2][:, ::-1]], axis=1)
        Image.fromarray(lado, "RGBA").resize((lado.shape[1] * 6, TILE * 6), Image.NEAREST).save(SAIDA / f"{nome}-comparacao.png")
        print(nome, "escala", round(escala, 1))


if __name__ == "__main__":
    principal()
