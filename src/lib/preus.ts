import type { Accessori, Durada, Tarifa } from './plataforma/esquema';

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

/**
 * Total d'una reserva: el lloguer més els accessoris, que es cobren un cop per bici i per
 * reserva. Es recalcula sempre al servidor; el del navegador només és orientatiu.
 */
export function totalReserva(
  tarifa: Tarifa,
  durada: Durada,
  bicis: number,
  accessoris: readonly Accessori[],
  preusAccessoris: Readonly<Record<Accessori, number>>,
): number | null {
  const lloguer = preuLloguer(tarifa, durada, bicis);
  if (lloguer === null) return null;
  const extres = new Set(accessoris);
  let total = lloguer;
  for (const accessori of extres) total += preusAccessoris[accessori] * bicis;
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
