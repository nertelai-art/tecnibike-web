# Munta el vídeo del taller: la bici que es desmunta (retallada fotograma a fotograma del vídeo de
# l'anatomia) sobre el fons del taller, amb una ombra suau a terra.
#
#   python scripts/taller-video.py <fotogrames> <mascares> <fons.png> <sortida>
#
# <fotogrames> i <mascares>: PNG numerats (0001.png…) del vídeo original i de la màscara de la bici
# (rembg, model isnet-general-use). La màscara es suavitza en el temps (1-2-1) perquè les vores no
# tremolin. Escriu els fotogrames compostos a <sortida>; després es codifica amb ffmpeg.
# Requereix Pillow i NumPy.

import os
import sys

import numpy as np
from PIL import Image, ImageDraw, ImageFilter

fotogrames, mascares, fons_png, sortida = sys.argv[1:5]

W, H = 1600, 900
# On va el fotograma original de la bici dins l'escena (fraccions de l'escena). Ha de coincidir amb
# ENQUADRE de src/components/anatomia/anatomia-fases.ts.
X0, Y0, AMPLE = 0.36, 0.289, 0.62

fons = Image.open(fons_png).convert('RGB')
escala = max(W / fons.width, H / fons.height)
fons = fons.resize((round(fons.width * escala), round(fons.height * escala)), Image.LANCZOS)
fons = fons.crop(((fons.width - W) // 2, (fons.height - H) // 2, (fons.width - W) // 2 + W, (fons.height - H) // 2 + H))
fons = np.asarray(fons).astype(np.float32)

fitxers = sorted(os.listdir(fotogrames))
primer = Image.open(os.path.join(fotogrames, fitxers[0]))
bw = round(W * AMPLE)
bh = round(bw * primer.height / primer.width)
bx, by = round(W * X0), round(H * Y0)

# Ombra a terra: una el·lipse fosca i molt difuminada sota les rodes.
ombra = Image.new('L', (W, H), 0)
ImageDraw.Draw(ombra).ellipse([bx + bw * 0.06, by + bh * 0.9, bx + bw * 0.97, by + bh * 0.98], fill=170)
ombra = np.asarray(ombra.filter(ImageFilter.GaussianBlur(28))).astype(np.float32)[..., None] / 255
fons = fons * (1 - 0.45 * ombra)

def mascara(i):
    i = min(max(i, 0), len(fitxers) - 1)
    m = Image.open(os.path.join(mascares, fitxers[i])).convert('L').resize((bw, bh), Image.LANCZOS)
    return np.asarray(m).astype(np.float32) / 255

os.makedirs(sortida, exist_ok=True)
for i, f in enumerate(fitxers):
    alfa = (mascara(i - 1) + 2 * mascara(i) + mascara(i + 1)) / 4
    bici = np.asarray(Image.open(os.path.join(fotogrames, f)).convert('RGB').resize((bw, bh), Image.LANCZOS)).astype(np.float32)
    escena = fons.copy()
    zona = escena[by : by + bh, bx : bx + bw]
    zona[:] = zona * (1 - alfa[..., None]) + bici * alfa[..., None]
    Image.fromarray(escena.clip(0, 255).astype(np.uint8)).save(os.path.join(sortida, f))
print('fotogrames', len(fitxers), 'bici', (bx, by, bw, bh))
