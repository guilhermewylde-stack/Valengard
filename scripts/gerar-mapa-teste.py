"""Gera o mapa mínimo do Marco 1 (ticket 01) e um tileset PROVISÓRIO de 64×64.

O tileset de verdade vem do Gemini no ticket 12; o mapa completo, no ticket 13.
Uso: python scripts/gerar-mapa-teste.py  (grava em content/)
"""
import json
import random
from pathlib import Path

from PIL import Image, ImageDraw

RAIZ = Path(__file__).resolve().parent.parent
TILE = 64

# id do tile no tileset -> (nome, cor base, bloqueia)
TILES = [
    ("grama", (58, 92, 46), False),
    ("piso", (112, 98, 80), False),
    ("muralha", (88, 86, 92), True),
    ("agua", (40, 70, 110), True),
    ("tronco", (82, 58, 36), True),
    ("copa", (34, 70, 34), False),
]
GRAMA, PISO, MURALHA, AGUA, TRONCO, COPA = range(len(TILES))


def tileset():
    img = Image.new("RGBA", (TILE * len(TILES), TILE), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)
    rnd = random.Random(7)
    for i, (nome, cor, _) in enumerate(TILES):
        x0 = i * TILE
        if nome == "copa":
            d.ellipse([x0 + 4, 4, x0 + 60, 56], fill=cor + (235,), outline=(20, 40, 20, 255), width=2)
            continue
        if nome == "tronco":
            d.rectangle([x0, 0, x0 + TILE - 1, TILE - 1], fill=TILES[GRAMA][1] + (255,))
            d.rectangle([x0 + 26, 8, x0 + 38, 63], fill=cor + (255,), outline=(40, 28, 18, 255))
            continue
        d.rectangle([x0, 0, x0 + TILE - 1, TILE - 1], fill=cor + (255,))
        for _ in range(40):  # textura de pixels soltos
            px, py = x0 + rnd.randrange(TILE), rnd.randrange(TILE)
            k = rnd.choice((-14, -8, 8, 14))
            d.point((px, py), fill=tuple(max(0, min(255, c + k)) for c in cor) + (255,))
        if nome == "muralha":
            for y in range(0, TILE, 16):
                off = 0 if (y // 16) % 2 == 0 else 16
                for x in range(-off, TILE, 32):
                    d.rectangle([x0 + max(0, x), y, x0 + min(TILE - 1, x + 31), y + 15], outline=(60, 58, 64, 255))
    return img


def mapa():
    w, h = 24, 16
    chao = [GRAMA + 1] * (w * h)
    obst = [0] * (w * h)
    cima = [0] * (w * h)

    def pos(x, y):
        return y * w + x

    # Valen: muralha de (2,2) a (11,9), piso dentro, portão em (6,9)
    for y in range(2, 10):
        for x in range(2, 12):
            borda = x in (2, 11) or y in (2, 9)
            if borda and (x, y) != (6, 9):
                obst[pos(x, y)] = MURALHA + 1
            else:
                chao[pos(x, y)] = PISO + 1
    # lago e árvores na Área de caça
    for y in range(11, 14):
        for x in range(16, 20):
            obst[pos(x, y)] = AGUA + 1
    for x, y in [(14, 4), (18, 6), (21, 3), (13, 12)]:
        obst[pos(x, y)] = TRONCO + 1
        cima[pos(x, y - 1)] = COPA + 1

    def ponto(tipo, x, y, props=None, nome=""):
        o = {"type": tipo, "name": nome, "x": x * TILE + TILE // 2, "y": y * TILE + TILE // 2,
             "width": 0, "height": 0, "point": True, "rotation": 0, "visible": True}
        if props:
            o["properties"] = [{"name": k, "type": "int" if isinstance(v, int) else "string", "value": v}
                               for k, v in props.items()]
        return o

    def retangulo(tipo, x, y, rw, rh, nome=""):
        return {"type": tipo, "name": nome, "x": x * TILE, "y": y * TILE, "width": rw * TILE,
                "height": rh * TILE, "rotation": 0, "visible": True}

    objetos = [
        ponto("templo", 6, 5),
        ponto("npc", 4, 4, {"papel": "vendedor"}),
        ponto("npc", 9, 4, {"papel": "ferreiro"}),
        retangulo("zona_segura", 3, 3, 8, 6),
        retangulo("regiao", 0, 0, 12, 10, "valen"),
        retangulo("regiao", 12, 0, 12, 16, "area-de-caca"),
        retangulo("regiao", 0, 10, 12, 6, "area-de-caca"),
        ponto("nascimento", 15, 9, {"especie": "rato", "raio": 3, "renascimento": 600}),
        ponto("nascimento", 20, 9, {"especie": "lobo", "raio": 3, "renascimento": 600}),
    ]
    for i, o in enumerate(objetos, start=1):
        o["id"] = i

    def camada(i, nome, data):
        return {"id": i, "name": nome, "type": "tilelayer", "width": w, "height": h, "x": 0, "y": 0,
                "opacity": 1, "visible": True, "data": data}

    return {
        "type": "map", "version": "1.10", "tiledversion": "1.11.2", "orientation": "orthogonal",
        "renderorder": "right-down", "infinite": False, "width": w, "height": h,
        "tilewidth": TILE, "tileheight": TILE, "nextlayerid": 6, "nextobjectid": len(objetos) + 1,
        "tilesets": [{
            "firstgid": 1, "name": "provisorio", "image": "../tilesets/provisorio.png",
            "imagewidth": TILE * len(TILES), "imageheight": TILE, "tilewidth": TILE, "tileheight": TILE,
            "columns": len(TILES), "tilecount": len(TILES), "margin": 0, "spacing": 0,
            "tiles": [{"id": i, "properties": [{"name": "bloqueia", "type": "bool", "value": True}]}
                      for i, (_, _, b) in enumerate(TILES) if b],
        }],
        "layers": [
            camada(1, "chao", chao),
            camada(2, "decoracao", [0] * (w * h)),
            camada(3, "obstaculos", obst),
            camada(4, "por_cima", cima),
            {"id": 5, "name": "objetos", "type": "objectgroup", "x": 0, "y": 0, "opacity": 1,
             "visible": True, "draworder": "topdown", "objects": objetos},
        ],
    }


if __name__ == "__main__":
    (RAIZ / "content/tilesets").mkdir(parents=True, exist_ok=True)
    (RAIZ / "content/mapas").mkdir(parents=True, exist_ok=True)
    tileset().save(RAIZ / "content/tilesets/provisorio.png")
    (RAIZ / "content/mapas/mundo.tmj").write_text(json.dumps(mapa(), indent=1), encoding="utf-8")
    print("ok: content/tilesets/provisorio.png, content/mapas/mundo.tmj")
