import { esObert, sumaDies } from '../calendari';
import type { FranjaTaller } from './esquema';

// Disponibilitat inventada però estable per a la implementació de proves: depèn només de la bici,
// la talla i el dia (un hash), així cada visita veu el mateix. La de debò la donarà la plataforma.

function hash(text: string): number {
  let h = 2166136261;
  for (let i = 0; i < text.length; i++) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/** Unitats lliures d'una bici i talla durant tots els dies del lloguer (el mínim de cada dia). */
export function unitatsLliures(biciId: string, talla: string, recollida: string, dies: number, reservades = 0): number {
  let minim = Infinity;
  for (let i = 0; i < dies; i++) {
    const dia = sumaDies(recollida, i);
    minim = Math.min(minim, hash(`${biciId}|${talla}|${dia}`) % 4);
  }
  return Math.max(0, (Number.isFinite(minim) ? minim : 0) - reservades);
}

export const HORES_RECEPCIO = ['09:00', '10:00', '11:00', '12:00', '16:00', '17:00', '18:00', '19:00'] as const;

/** Franges de recepció del taller d'un dia, amb les places que queden. Diumenge, cap. */
export function frangesTaller(dia: string, ocupades: Readonly<Record<string, number>> = {}): FranjaTaller[] {
  if (!esObert(dia)) return [];
  return HORES_RECEPCIO.map((inici) => ({
    inici,
    places: Math.max(0, (hash(`taller|${dia}|${inici}`) % 3) - (ocupades[inici] ?? 0)),
  }));
}
