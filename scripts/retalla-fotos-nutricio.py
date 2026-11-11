# Retalla les fotos de producte: treu el fons (blanc o gris) omplint des de la vora, retalla a la
# caixa del producte i desa WebP amb transparència. Ús: retalla.py <entrada> <sortida>
import sys, os
import numpy as np
from PIL import Image, ImageFilter
from collections import deque

ent, sort = sys.argv[1], sys.argv[2]
os.makedirs(sort, exist_ok=True)
MAX = 560  # costat llarg

def fons_per_vora(rgb, tol):
    h, w, _ = rgb.shape
    cant = np.concatenate([rgb[0], rgb[-1], rgb[:, 0], rgb[:, -1]]).astype(int)
    color = np.median(cant, axis=0)
    dist = np.abs(rgb.astype(int) - color).max(axis=2)
    proper = dist <= tol
    fons = np.zeros((h, w), bool)
    q = deque()
    for x in range(w):
        for y in (0, h - 1):
            if proper[y, x] and not fons[y, x]: fons[y, x] = True; q.append((y, x))
    for y in range(h):
        for x in (0, w - 1):
            if proper[y, x] and not fons[y, x]: fons[y, x] = True; q.append((y, x))
    while q:
        y, x = q.popleft()
        for dy, dx in ((1,0),(-1,0),(0,1),(0,-1)):
            ny, nx = y + dy, x + dx
            if 0 <= ny < h and 0 <= nx < w and proper[ny, nx] and not fons[ny, nx]:
                fons[ny, nx] = True; q.append((ny, nx))
    return fons

for f in sorted(os.listdir(ent)):
    im = Image.open(os.path.join(ent, f)).convert('RGBA')
    im.thumbnail((1000, 1000))
    a = np.array(im)
    transparent = a[..., 3].min() < 250 and a[0, 0, 3] < 20
    if not transparent:
        fons = fons_per_vora(a[..., :3], 14)
        alfa = Image.fromarray(np.where(fons, 0, 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(0.8))
        im.putalpha(alfa)
    caixa = im.getchannel('A').point(lambda v: 255 if v > 24 else 0).getbbox()
    im = im.crop(caixa)
    im.thumbnail((MAX, MAX), Image.LANCZOS)
    nom = os.path.splitext(f)[0] + '.webp'
    im.save(os.path.join(sort, nom), 'WEBP', quality=80, alpha_quality=80, method=6)
    print(nom, im.size, 'transparent' if transparent else 'retallada')
