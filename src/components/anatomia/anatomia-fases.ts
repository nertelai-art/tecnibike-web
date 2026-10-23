import type { Peca } from '@/lib/plataforma/esquema';

// Coreografia de l'escena d'anatomia, sense three.js perquè l'HTML (textos, pas actiu) la pugui
// llegir sense arrossegar la llibreria. El progrés va de 0 a 1 dins la secció.
//
//   0.00 ─ portada ─ 0.10
//          0.08 ─ la bici s'esbotza ─ 0.30
//                                    0.30 ─ sis peces, una per una ─ 0.86
//                                                                    0.86 ─ es torna a muntar ─ 0.97

export const FASES = {
  portada: [0, 0.1],
  esbotzat: [0.08, 0.3],
  peces: [0.3, 0.86],
  muntatge: [0.86, 0.97],
} as const;

/** L'ordre en què es recorren les peces: de la que més es toca al taller a la que menys. */
export const ORDRE_PECES: readonly Peca[] = ['transmissio', 'frens', 'rodes', 'direccio', 'seient', 'quadre'];

export const tram = (p: number, [a, b]: readonly [number, number]) => Math.min(1, Math.max(0, (p - a) / (b - a)));

export const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

/** Fins a quin punt està esbotzada la bici (0 muntada, 1 del tot oberta). */
export function obertura(p: number): number {
  return easeInOut(tram(p, FASES.esbotzat)) * (1 - easeInOut(tram(p, FASES.muntatge)));
}

/**
 * Peça que s'explica ara: -1 abans de començar, de 0 a 5 mentre es recorren i 6 quan ja s'han
 * vist totes.
 */
export function pasActiu(p: number): number {
  const [a, b] = FASES.peces;
  if (p < a) return -1;
  if (p >= b) return ORDRE_PECES.length;
  return Math.min(ORDRE_PECES.length - 1, Math.floor(((p - a) / (b - a)) * ORDRE_PECES.length));
}

/** Opacitat del text de portada: es fon quan la bici comença a obrir-se. */
export function opacitatPortada(p: number): number {
  return 1 - tram(p, [0.05, 0.11]);
}
