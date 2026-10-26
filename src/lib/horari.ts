import { diaSetmana, esPassat, type Instant } from './calendari';
import type { BlocHorari, HorariBotiga, Moment } from './plataforma/esquema';

// Hores en què es pot recollir i tornar una bici, a partir de l'horari de la botiga que dona la
// plataforma. Funcions pures: l'horari i l'«ara» entren per paràmetre.

/** Dies màxims d'un lloguer, el de recollida i el de retorn inclosos. */
export const MAX_DIES_LLOGUER = 30;

const minuts = (hora: string) => {
  const [h, m] = hora.split(':').map(Number) as [number, number];
  return h * 60 + m;
};
const hora = (total: number) => `${String(Math.floor(total / 60)).padStart(2, '0')}:${String(total % 60).padStart(2, '0')}`;

/** Blocs d'obertura d'un dia: el període especial que el conté o, si no, la setmana habitual. */
export function blocsDelDia(dia: string, horari: HorariBotiga): readonly BlocHorari[] {
  if (horari.tancats.some((t) => t.dia === dia)) return [];
  const periode = horari.periodes.find((p) => p.des <= dia && dia <= p.fins);
  return (periode ?? horari).setmana[diaSetmana(dia)] ?? [];
}

function graella(dia: string, horari: HorariBotiga, finsATancar: boolean): string[] {
  const hores: string[] = [];
  for (const bloc of blocsDelDia(dia, horari)) {
    // Per recollir cal una estona de marge abans de tancar; per tornar, fins a l'hora de tancar.
    const ultima = minuts(bloc.tanca) - (finsATancar ? 0 : horari.pasMinuts);
    for (let m = minuts(bloc.obre); m <= ultima; m += horari.pasMinuts) hores.push(hora(m));
  }
  return hores;
}

export const horesRecollida = (dia: string, horari: HorariBotiga) => graella(dia, horari, false);
export const horesRetorn = (dia: string, horari: HorariBotiga) => graella(dia, horari, true);

/** Dies de calendari d'una data a una altra, totes dues incloses. */
export function diesEntre(des: string, fins: string): number {
  return Math.round((Date.parse(`${fins}T00:00:00Z`) - Date.parse(`${des}T00:00:00Z`)) / 86_400_000) + 1;
}

/** Minuts entre dos moments (pot ser negatiu). */
export function minutsEntre(des: Moment, fins: Moment): number {
  return (diesEntre(des.dia, fins.dia) - 1) * 1440 + minuts(fins.hora) - minuts(des.hora);
}

export type ErrorFranja = 'passat' | 'recollida' | 'retorn' | 'ordre' | 'massaLlarg';

/**
 * Comprova que es pugui recollir i tornar a les hores triades: dins de l'horari, en un pas de la
 * graella, no en el passat, en ordre i sense passar del màxim de dies. `null` si tot és correcte.
 */
export function validaFranja(
  { recollida, retorn }: { recollida: Moment; retorn: Moment },
  horari: HorariBotiga,
  ara: Instant,
): ErrorFranja | null {
  if (esPassat(recollida.dia, recollida.hora, ara)) return 'passat';
  if (!horesRecollida(recollida.dia, horari).includes(recollida.hora)) return 'recollida';
  if (minutsEntre(recollida, retorn) <= 0) return 'ordre';
  if (!horesRetorn(retorn.dia, horari).includes(retorn.hora)) return 'retorn';
  if (diesEntre(recollida.dia, retorn.dia) > MAX_DIES_LLOGUER) return 'massaLlarg';
  return null;
}
