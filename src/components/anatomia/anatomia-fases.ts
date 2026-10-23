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
/**
 * Dins del tram de cada peça, la part que avança el vídeo; la resta és una aturada curta. Com més
 * llarga, més contínua i flotant es veu la sortida de les peces.
 */
const MOVIMENT = 0.82;

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
  const x = Math.min(1, dins / MOVIMENT);
  // «Smootherstep»: velocitat i acceleració zero als dos extrems, de manera que cada peça surt i
  // s'atura sense cops, com si suressin.
  const suau = x * x * x * (x * (6 * x - 15) + 10);
  return inici + (fi - inici) * suau;
}

/** Si la peça ja ha sortit prou per mostrar-ne l'etiqueta (una mica abans d'aturar-se). */
export function aturat(p: number): boolean {
  const pas = pasActiu(p);
  return pas >= 0 && tram(p) - pas >= MOVIMENT * 0.6;
}

/** Progrés de scroll (0–1) en què la peça `i` ja és a lloc: per saltar-hi des de l'índex. */
export function progresDePeca(i: number): number {
  return INTRO + ((i + MOVIMENT + (1 - MOVIMENT) / 2) * (1 - INTRO)) / MOMENTS.length;
}

/**
 * On queda cada peça a l'últim fotograma (bici desmuntada), en % del fotograma, i on va el bàner que
 * l'explica (cantonada de dalt a l'esquerra, en %), triat en una zona buida del fons.
 */
export const FINAL: Readonly<Record<Peca, { x: number; y: number; bx: number; by: number }>> = {
  rodes: { x: 88, y: 57, bx: 62, by: 70 },
  frens: { x: 75.5, y: 62, bx: 62, by: 70 },
  transmissio: { x: 59, y: 72, bx: 3, by: 68 },
  direccio: { x: 75, y: 24, bx: 4, by: 5 },
  seient: { x: 49, y: 13, bx: 4, by: 5 },
  quadre: { x: 63, y: 47, bx: 4, by: 5 },
};

/**
 * Peça del bàner següent, a l'atzar però mai la mateixa que ara. L'atzar entra per paràmetre
 * (`aleatori` entre 0 i 1) perquè sigui determinista a les proves.
 */
export function seguentBanner(actual: number, aleatori: number): number {
  const n = MOMENTS.length;
  if (actual < 0 || actual >= n) return Math.min(n - 1, Math.floor(aleatori * n));
  return (actual + 1 + Math.min(n - 2, Math.floor(aleatori * (n - 1)))) % n;
}
