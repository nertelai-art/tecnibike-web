// Talla orientativa a partir de l'alçada. És la taula general que fan servir les marques; a la
// botiga es comprova i s'ajusta igualment.

export const TRAMS_ALCADA = [
  { min: 150, max: 159 },
  { min: 160, max: 167 },
  { min: 168, max: 175 },
  { min: 176, max: 183 },
  { min: 184, max: 200 },
] as const;

const LLETRES = ['XS', 'S', 'M', 'L', 'XL'];
const CARRETERA = ['48', '51', '54', '56', '58'];

/** Talla suggerida entre les que té la bici, o la més propera si la ideal no hi és. */
export function tallaSuggerida(alcadaCm: number, talles: readonly string[]): string | null {
  if (talles.length === 0) return null;
  const tram = TRAMS_ALCADA.findIndex((t) => alcadaCm <= t.max);
  const index = tram === -1 ? TRAMS_ALCADA.length - 1 : tram;
  const escala = CARRETERA.includes(talles[0]!) ? CARRETERA : LLETRES;
  const ordenades = talles.map((t) => ({ talla: t, pos: escala.indexOf(t) })).filter((t) => t.pos >= 0);
  if (ordenades.length === 0) return null;
  return ordenades.reduce((millor, t) => (Math.abs(t.pos - index) < Math.abs(millor.pos - index) ? t : millor)).talla;
}
