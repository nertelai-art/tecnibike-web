// Perfil d'alçada d'una ruta: distància acumulada de cada punt i el traçat SVG de l'àrea.

type Punt = readonly [number, number, number];

/** Distància entre dos punts [lon, lat] en metres (haversine). */
export function distancia(a: Punt, b: Punt): number {
  const R = 6371000;
  const rad = (g: number) => (g * Math.PI) / 180;
  const h = Math.sin(rad(b[1] - a[1]) / 2) ** 2 + Math.cos(rad(a[1])) * Math.cos(rad(b[1])) * Math.sin(rad(b[0] - a[0]) / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

/** Distància acumulada (m) i alçada (m) de cada punt. */
export function perfil(punts: readonly Punt[]): { d: number; alt: number }[] {
  let acumulat = 0;
  return punts.map((punt, i) => {
    if (i > 0) acumulat += distancia(punts[i - 1]!, punt);
    return { d: acumulat, alt: punt[2] };
  });
}

/** Traçat SVG (línia i àrea) del perfil dins d'un rectangle `amplada` × `alcada`. */
export function camiPerfil(punts: readonly Punt[], amplada: number, alcada: number) {
  const p = perfil(punts);
  const total = p.at(-1)?.d ?? 0;
  const alts = p.map((x) => x.alt);
  const min = Math.min(...alts);
  const max = Math.max(...alts);
  const rang = Math.max(1, max - min);
  const coord = p.map(({ d, alt }) => [total ? (d / total) * amplada : 0, alcada - ((alt - min) / rang) * alcada * 0.9] as const);
  const linia = coord.map(([x, y], i) => `${i ? 'L' : 'M'}${x.toFixed(1)} ${y.toFixed(1)}`).join(' ');
  return { linia, area: `${linia} L${amplada} ${alcada} L0 ${alcada} Z`, min, max, metres: total };
}
