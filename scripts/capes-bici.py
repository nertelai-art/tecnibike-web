# Separa la foto de la Pinarello en capes: dues rodes (que giraran) i el quadre per sobre.
# - Fons blanc -> transparent amb farciment des de fora, des de dins de cada roda i dels triangles
#   del quadre, perquè les lletres blanques del quadre no es buidin.
# - Gira tot el que és roda (pneumàtic, llanta, radis), menys el quadre (blau), el bujé i el disc, el
#   canvi i la cadena.
# - On la forquilla o la cadena tapaven el pneumàtic, la roda es completa copiant el mateix radi
#   uns graus més enllà (pneumàtic i llanta són iguals tot al voltant).
import sys, math
import numpy as np
from PIL import Image, ImageDraw
font, desti, llarg = sys.argv[1], sys.argv[2], int(sys.argv[3])
im = np.asarray(Image.open(font).convert('RGB')).astype(np.float32)
H, W, _ = im.shape
x0, x1, y0, y1 = 120, 1785, 240, 1276
RODES = {'darrera': (491.4, 918.2, 360.0), 'davant': (1421.6, 913.3, 357.0)}
mn = im.min(axis=2)
blanc = Image.fromarray(((mn > 222) * 255).astype(np.uint8)).copy()  # còpia: si no, comparteix memòria i no es pot pintar
llavors = [(0, 0), (W - 1, 0), (0, H - 1), (W - 1, H - 1), (700, 690), (600, 830), (1100, 760), (760, 700), (800, 650), (900, 620), (1000, 600), (630, 650), (660, 700), (650, 760)]
for cx, cy, rr in RODES.values():
    for f in (0.3, 0.55, 0.8):
        llavors += [(int(cx + f * rr * math.cos(a / 90 * math.pi)), int(cy + f * rr * math.sin(a / 90 * math.pi))) for a in range(180)]
for p in llavors:
    if blanc.getpixel(p) == 255:
        ImageDraw.floodfill(blanc, p, 128)
fons = np.asarray(blanc) == 128
veins = fons.copy()
for dy, dx in ((1, 0), (-1, 0), (0, 1), (0, -1)):
    veins |= np.roll(np.roll(fons, dy, 0), dx, 1)
alfa = np.where(fons, 0.0, 1.0)
vora = veins & ~fons
alfa[vora] = np.clip((255 - mn[vora]) / 110, 0, 1)

yy, xx = np.mgrid[0:H, 0:W]
blau = (im[..., 2] - im[..., 0] > 10) & (mn < 200)
fix = blau.copy()
for cx, cy, rr in RODES.values():
    fix |= np.hypot(xx - cx, yy - cy) < 0.3 * rr  # bujé, disc i pinça
# Canvi i cadena (roda del darrere): caixes mesurades sobre la foto original.
fix |= (xx > 440) & (xx < 540) & (yy > 925) & (yy < 1095)
fix |= (xx > 480) & (yy > 1040) & (yy < 1112) & (xx < 880)
fix |= (xx > 491) & (yy > 845) & (yy < 905) & (xx < 880)
fix |= (xx > 740) & (yy > 820) & (yy < 1130) & (xx < 900)

escala = llarg / (x1 - x0)
def guarda(nom, rgb, a, caixa):
    img = Image.fromarray(np.dstack([rgb.astype(np.uint8), (a * 255).astype(np.uint8)]), 'RGBA').crop(caixa)
    img = img.resize((round(img.width * escala), round(img.height * escala)), Image.LANCZOS)
    img.save(f'{desti}/{nom}.webp', quality=92, method=6)
    return img.size

gira_total = np.zeros((H, W), bool)
for nom, (cx, cy, rr) in RODES.items():
    d = np.hypot(xx - cx, yy - cy)
    dins = d < rr
    gira = dins & ~fix
    gira_total |= gira
    rgb = im.copy(); a = alfa * gira
    # Completa l'anella exterior (pneumàtic i llanta) on hi havia peces fixes al davant.
    anella = dins & (d > 0.72 * rr) & ~gira
    ang = np.arctan2(yy - cy, xx - cx)
    pendent = anella.copy()
    for k in range(1, 40):
        if not pendent.any():
            break
        th = ang[pendent] + math.radians(4 * k)
        sx = np.clip(np.round(cx + d[pendent] * np.cos(th)).astype(int), 0, W - 1)
        sy = np.clip(np.round(cy + d[pendent] * np.sin(th)).astype(int), 0, H - 1)
        ok = gira[sy, sx]
        py, px = np.where(pendent)
        py, px = py[ok], px[ok]
        rgb[py, px] = im[sy[ok], sx[ok]]
        a[py, px] = alfa[sy[ok], sx[ok]]
        pendent[py, px] = False
    caixa = (round(cx - rr), round(cy - rr), round(cx + rr), round(cy + rr))
    print(nom, guarda('roda-' + nom, rgb, a, caixa), 'centre %', round((cx - x0) / (x1 - x0) * 100, 2), round((cy - y0) / (y1 - y0) * 100, 2), 'diametre %', round(2 * rr / (x1 - x0) * 100, 2))
print('quadre', guarda('quadre', im, alfa * ~gira_total, (x0, y0, x1, y1)))
