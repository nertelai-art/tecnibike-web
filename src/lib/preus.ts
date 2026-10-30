import { diesEntre, minutsEntre } from './horari';
import type { Durada, Extra, Moment, Tarifa } from './plataforma/esquema';

// Càlcul del preu d'un lloguer amb els trams de la tarifa de Tecnibike: 1 dia, de 2 a 6 dies i
// més de 6. El preu és per bici i per dia, i el tram s'aplica a tots els dies.

/** Preu per dia del tram que toca, o `null` si la bici no es lloga així (p. ex. mig dia). */
export function preuPerDia(tarifa: Tarifa, durada: Durada): number | null {
  if (durada.tipus === 'migDia') return tarifa.migDia ?? null;
  const { dies } = durada;
  if (!Number.isInteger(dies) || dies < 1) return null;
  if (dies === 1) return tarifa.dia;
  // Un tram que el PDF deixa en blanc hereta el preu del tram anterior.
  const de2a6 = tarifa.de2a6 ?? tarifa.dia;
  if (dies <= 6) return de2a6;
  return tarifa.mesDe6 ?? de2a6;
}

/** Total en cèntims per a `bicis` bicis. */
export function preuLloguer(tarifa: Tarifa, durada: Durada, bicis = 1): number | null {
  const perDia = preuPerDia(tarifa, durada);
  if (perDia === null || !Number.isInteger(bicis) || bicis < 1) return null;
  const dies = durada.tipus === 'migDia' ? 1 : durada.dies;
  return perDia * dies * bicis;
}

/** Fins a quantes hores, el mateix dia, compta com a mig dia (si la tarifa en té). */
export const MIG_DIA_MINUTS = 4 * 60;

/** Durada d'un lloguer per a una tarifa: dies de calendari, o mig dia si és curt i la bici en té. */
export function duradaDe(recollida: Moment, retorn: Moment, tarifa: Tarifa): Durada {
  const dies = diesEntre(recollida.dia, retorn.dia);
  if (dies === 1 && tarifa.migDia !== undefined && minutsEntre(recollida, retorn) <= MIG_DIA_MINUTS) return { tipus: 'migDia' };
  return { tipus: 'dies', dies };
}

export type LiniaPreu = { tarifa: Tarifa; extres: readonly Pick<Extra, 'id' | 'preu' | 'cobrament'>[] };

export type Desglos = {
  durada: Durada;
  /** Preu real per dia per a aquestes dates (el del tram que toca), o el del mig dia. */
  perDia: number;
  dies: number;
  lloguer: number;
  /** Només els extres de pagament: els inclosos no sumen res. */
  extres: { id: string; import: number }[];
  total: number;
};

/** D'on surt el preu d'una bici de la reserva: el lloguer i els seus extres (els pedals també en són). */
export function desglosLinia({ tarifa, extres }: LiniaPreu, recollida: Moment, retorn: Moment): Desglos | null {
  const durada = duradaDe(recollida, retorn, tarifa);
  const perDia = preuPerDia(tarifa, durada);
  const lloguer = preuLloguer(tarifa, durada);
  if (perDia === null || lloguer === null) return null;
  const dies = durada.tipus === 'migDia' ? 1 : durada.dies;
  const ambPreu = extres.map((e) => ({ id: e.id, import: e.cobrament === 'perDia' ? e.preu * dies : e.preu })).filter((e) => e.import > 0);
  return { durada, perDia, dies, lloguer, extres: ambPreu, total: ambPreu.reduce((suma, e) => suma + e.import, lloguer) };
}

export function preuLinia(linia: LiniaPreu, recollida: Moment, retorn: Moment): number | null {
  return desglosLinia(linia, recollida, retorn)?.total ?? null;
}

/** Total d'una reserva. Es recalcula sempre al servidor; el del navegador només és orientatiu. */
export function totalReserva(linies: readonly LiniaPreu[], recollida: Moment, retorn: Moment): number | null {
  if (linies.length === 0) return null;
  let total = 0;
  for (const linia of linies) {
    const preu = preuLinia(linia, recollida, retorn);
    if (preu === null) return null;
    total += preu;
  }
  return total;
}

/** El preu més baix per dia que pot arribar a pagar algú: el reclam «des de». */
export function preuMinimPerDia(tarifa: Tarifa): number {
  return Math.min(tarifa.dia, tarifa.de2a6 ?? tarifa.dia, tarifa.mesDe6 ?? tarifa.dia);
}

export function formatEuros(centims: number, locale: string): string {
  const senseDecimals = centims % 100 === 0;
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: senseDecimals ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(centims / 100);
}
