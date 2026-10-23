# Munta el vídeo del taller: la bici que es desmunta (retallada fotograma a fotograma del vídeo de
# l'anatomia) sobre el fons del taller, amb una ombra suau a terra.
#
#   python scripts/taller-video.py <fotogrames> <mascares> <fons.png> <sortida> [ample]
#
# <fotogrames> i <mascares>: PNG numerats (0001.png…) del vídeo original i de la màscara de la bici
# (rembg, model isnet-general-use; poden ser més petites que els fotogrames, s'amplien).
# Escriu els fotogrames compostos a <sortida>; després es codifica amb ffmpeg.
#
# Entre els radis, la màscara és semitransparent i hi traspuaria la carretera del vídeo original.
# Per evitar-ho: s'endureixen les vores toves de la màscara, s'estima el fons original de cada punt
# amb els píxels de fons del voltant, i se'n treu la contribució abans de posar-hi el taller.
# Requereix Pillow i NumPy.

import os
import sys

import numpy as np
from PIL import Image, ImageDraw, ImageFilter

fotogrames, mascares, fons_png, sortida = sys.argv[1:5]

# Escena 16:9. A 2560 px, la bici (62 %) surt a la mida del vídeo original, sense ampliar-la.
W = int(sys.argv[5]) if len(sys.argv) > 5 else 2560
H = W * 9 // 16
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
ombra = np.asarray(ombra.filter(ImageFilter.GaussianBlur(28 * W / 1600))).astype(np.float32)[..., None] / 255
fons = fons * (1 - 0.45 * ombra)

def mascara(i):
    m = Image.open(os.path.join(mascares, fitxers[i])).convert('L').resize((bw, bh), Image.LANCZOS)
    alfa = np.asarray(m).astype(np.float32) / 255
    # Vores toves més dures: el que és gairebé fons, fons; el que és gairebé bici, bici.
    return np.clip((alfa - 0.12) / 0.76, 0, 1)


# Radi de l'estimació del fons vell, en píxels (es fa reduint i tornant a ampliar, que és ràpid).
PAS = max(2, round(8 * bw / 1000))


def fons_original(bici, alfa):
    """Fons del vídeo original estimat a cada punt amb els píxels de fons del voltant."""
    pes = (alfa < 0.02).astype(np.float32)
    def difumina(a):
        petita = Image.fromarray(a, 'F').resize((bw // PAS, bh // PAS), Image.BOX)
        return np.asarray(petita.resize((bw, bh), Image.BILINEAR))
    suma = np.dstack([difumina(np.ascontiguousarray(bici[..., c] * pes)) for c in range(3)])
    total = difumina(pes)[..., None]
    return np.where(total > 1e-3, suma / np.maximum(total, 1e-3), bici)


os.makedirs(sortida, exist_ok=True)
for i, f in enumerate(fitxers):
    alfa = mascara(i)
    bici = np.asarray(Image.open(os.path.join(fotogrames, f)).convert('RGB').resize((bw, bh), Image.LANCZOS)).astype(np.float32)
    vell = fons_original(bici, alfa)
    a = alfa[..., None]
    # Color de la bici sense el fons vell que s'hi barrejava (només on la màscara és parcial).
    net = np.where(a > 0.999, bici, np.clip((bici - (1 - a) * vell) / np.maximum(a, 0.25), 0, 255))
    escena = fons.copy()
    zona = escena[by : by + bh, bx : bx + bw]
    zona[:] = zona * (1 - a) + net * a
    Image.fromarray(escena.clip(0, 255).astype(np.uint8)).save(os.path.join(sortida, f))
print('fotogrames', len(fitxers), 'bici', (bx, by, bw, bh))
