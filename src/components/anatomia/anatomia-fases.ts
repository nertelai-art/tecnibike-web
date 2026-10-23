import type { Peca } from '@/lib/plataforma/esquema';

// Línia de temps de l'anatomia: el scroll mou el vídeo (public/video/anatomia.mp4, 10 s) on la bici
// es desmunta peça a peça. Cada peça té un tram de scroll: la primera part avança el vídeo fins
// que la peça ha sortit, i la resta s'hi atura perquè es pugui llegir la fitxa.
// Sense dependències de React ni del DOM, perquè es pugui provar.

export type Moment = {
  peca: Peca;
  /** Segon del vídeo en què la peça ja ha sortit del tot. */
  t: number;
  /** On és la peça en aquell moment, en % del fotograma (per a l'etiqueta). */
  x: number;
  y: number;
};

/** L'ordre real en què es desmunta la bici al vídeo, mesurat fotograma a fotograma. */
export const MOMENTS: readonly Moment[] = [
  { peca: 'rodes', t: 4.0, x: 86, y: 60 },
  { peca: 'frens', t: 5.5, x: 74, y: 64 },
  { peca: 'transmissio', t: 7.0, x: 60, y: 71 },
  { peca: 'direccio', t: 8.5, x: 74, y: 27 },
  { peca: 'seient', t: 9.5, x: 52, y: 14 },
  { peca: 'quadre', t: 9.95, x: 62, y: 44 },
];

export const ORDRE_PECES: readonly Peca[] = MOMENTS.map((m) => m.peca);

/** Part del scroll del principi amb la bici sencera i la introducció. */
const INTRO = 0.1;
/** Dins del tram de cada peça, la part que avança el vídeo (la resta s'hi atura). */
const MOVIMENT = 0.55;

const tram = (p: number) => (Math.min(1, Math.max(0, p)) - INTRO) / ((1 - INTRO) / MOMENTS.length);

/** Peça que s'explica ara: -1 durant la introducció, de 0 a 5 després. */
export function pasActiu(p: number): number {
  if (p < INTRO) return -1;
  return Math.min(MOMENTS.length - 1, Math.floor(tram(p)));
}

/** Segon del vídeo que toca per a un progrés de scroll (0–1). */
export function tempsVideo(p: number): number {
  const pas = pasActiu(p);
  if (pas < 0) return 0;
  const inici = pas === 0 ? 0 : MOMENTS[pas - 1]!.t;
  const fi = MOMENTS[pas]!.t;
  const dins = tram(p) - pas;
  const avanc = Math.min(1, dins / MOVIMENT);
  // Arrencada i arribada suaus: la peça accelera en sortir i frena en arribar.
  const suau = avanc < 0.5 ? 2 * avanc * avanc : 1 - Math.pow(-2 * avanc + 2, 2) / 2;
  return inici + (fi - inici) * suau;
}

/** Si la peça ja és a lloc i s'està aturat (per mostrar-ne l'etiqueta). */
export function aturat(p: number): boolean {
  const pas = pasActiu(p);
  return pas >= 0 && tram(p) - pas >= MOVIMENT;
}
