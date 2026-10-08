"""Gera os ícones do PWA (icons/*.png) — casa estilizada sobre o fundo do header.

Uso:  python tools/gen_icons.py
"""
from pathlib import Path
from PIL import Image, ImageDraw

OUT = Path(__file__).resolve().parent.parent / "icons"
BG = (15, 23, 42)        # --construido (#0f172a)
WALL = (226, 232, 240)   # --text-dark
ROOF = (245, 158, 11)    # --amber
SUN = (250, 204, 21)
GRASS = (95, 122, 63)    # LOT_FILL


def draw_house(size, scale):
    """Desenha a casa centralizada ocupando `scale` da largura (maskable: ≤0,8)."""
    S = 4 * size                      # supersampling p/ bordas suaves
    img = Image.new("RGB", (S, S), BG)
    d = ImageDraw.Draw(img)
    u = S * scale / 100               # unidade: 100u = área útil
    ox = oy = (S - 100 * u) / 2
    P = lambda x, y: (ox + x * u, oy + y * u)

    d.ellipse([*P(70, 4), *P(90, 24)], fill=SUN)                    # sol (norte)
    d.rectangle([*P(0, 86), *P(100, 96)], fill=GRASS)               # terreno
    d.rectangle([*P(18, 48), *P(82, 86)], fill=WALL)                # paredes
    d.polygon([P(8, 50), P(50, 18), P(92, 50)], fill=ROOF)          # telhado
    d.rectangle([*P(42, 62), *P(58, 86)], fill=BG)                  # porta
    d.rectangle([*P(24, 58), *P(36, 70)], fill=BG)                  # janela O
    d.rectangle([*P(64, 58), *P(76, 70)], fill=BG)                  # janela L
    return img.resize((size, size), Image.LANCZOS)


OUT.mkdir(exist_ok=True)
draw_house(192, 0.86).save(OUT / "icon-192.png")
draw_house(512, 0.86).save(OUT / "icon-512.png")
draw_house(512, 0.66).save(OUT / "icon-maskable-512.png")   # dentro do círculo seguro (80%)
draw_house(180, 0.80).save(OUT / "apple-touch-icon.png")    # RGB = sem transparência
draw_house(32, 0.92).save(OUT / "favicon-32.png")
print("ok:", sorted(p.name for p in OUT.iterdir()))
