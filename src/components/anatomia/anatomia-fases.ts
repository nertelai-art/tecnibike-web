import type { Peca } from '@/lib/plataforma/esquema';

// Dades de l'escena del taller: el vídeo (public/video/anatomia.mp4, 10 s) on la bici es desmunta peça
// a peça amb el scroll; després surten els bàners de les peces. Les posicions són en % del fotograma.
// Sense dependències de React ni del DOM, perquè es pugui provar.

export type Moment = {
  peca: Peca;
  /** Segon del vídeo en què la peça ja ha sortit del tot. */
  t: number;
  /** On és la peça en aquell moment, en % del fotograma. */
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

export const DURADA = 10.04;

/** Part del recorregut de scroll del principi amb la bici sencera, abans que comenci a desmuntar-se. */
export const INICI = 0.06;
/** A partir d'aquí la bici ja és desmuntada del tot: el que queda de scroll és per als bàners. */
export const DESMUNTADA = 0.88;
/** Quan entren els textos de la secció. */
export const TEXTOS = 0.1;

/**
 * Segon del vídeo per a un progrés de scroll (0–1): quiet al principi i al final, i entremig avança
 * amb una corba suau perquè les peces surtin i s'aturin sense cops.
 */
export function tempsDeProgres(p: number): number {
  const x = Math.min(1, Math.max(0, (p - INICI) / (DESMUNTADA - INICI)));
  const suau = x * x * (3 - 2 * x);
  return suau * DURADA;
}

/**
 * On queda cada peça a l'últim fotograma (bici desmuntada), en % del fotograma, i on va
 * el bàner que l'explica (cantonada de dalt a l'esquerra, en %), en una zona buida.
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
