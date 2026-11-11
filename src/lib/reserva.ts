import { esPassat, sumaDies, type Instant } from './calendari';
import { horesRecollida, horesRetorn, MAX_DIES_LLOGUER } from './horari';
import type { HorariBotiga, LiniaNutricio, Moment } from './plataforma/esquema';

// Ajudes del formulari de reserva amb diverses bicis. Pures: la disponibilitat, l'horari i l'«ara»
// entren per paràmetre.

type Disponibilitat = {
  bicis: Record<string, Record<string, number>>;
  extres: Record<string, number | null>;
  variantsExtres?: Record<string, Record<string, number | null>>;
};
type Linia = { biciId: string; talla: string | null; pedals: string; extres: readonly string[]; variants?: Readonly<Record<string, string>> };

/** Les unitats d'una línia de nutrició no passen d'aquí (com a l'esquema). */
export const MAX_QUANTITAT_NUTRICIO = 10;

/** Unitats de cada talla que li queden a la bici `index`, descomptant les que han triat les altres. */
export function tallesLliures(disponibilitat: Disponibilitat | null, linies: readonly Linia[], index: number): Record<string, number> | null {
  if (!disponibilitat) return null;
  const linia = linies[index];
  const talles = linia ? disponibilitat.bicis[linia.biciId] : undefined;
  if (!linia || !talles) return {};
  return Object.fromEntries(
    Object.entries(talles).map(([talla, n]) => [
      talla,
      Math.max(0, n - linies.filter((l, i) => i !== index && l.biciId === linia.biciId && l.talla === talla).length),
    ]),
  );
}

/** Unitats de cada extra (i pedals) que li queden a la bici `index`; `null` vol dir sense límit. */
export function extresLliures(disponibilitat: Disponibilitat | null, linies: readonly Linia[], index: number): Record<string, number | null> {
  if (!disponibilitat) return {};
  return Object.fromEntries(
    Object.entries(disponibilitat.extres).map(([id, n]) => [
      id,
      n === null ? null : Math.max(0, n - linies.filter((l, i) => i !== index && (l.pedals === id || l.extres.includes(id))).length),
    ]),
  );
}

/** De cada variant d'un extra (talla del casc), el que li queda a la bici `index`, descomptant les altres. */
export function variantsLliures(disponibilitat: Disponibilitat | null, linies: readonly Linia[], index: number, extraId: string): Record<string, number | null> {
  const variants = disponibilitat?.variantsExtres?.[extraId];
  if (!variants) return {};
  return Object.fromEntries(
    Object.entries(variants).map(([variant, n]) => [
      variant,
      n === null ? null : Math.max(0, n - linies.filter((l, i) => i !== index && l.extres.includes(extraId) && l.variants?.[extraId] === variant).length),
    ]),
  );
}

/** Afegeix una unitat d'un producte i sabor: suma a la línia que ja hi és o n'obre una de nova. */
export function afegeixNutricio(linies: readonly LiniaNutricio[], producteId: string, sabor: string): LiniaNutricio[] {
  const i = linies.findIndex((l) => l.producteId === producteId && l.sabor === sabor);
  if (i < 0) return [...linies, { producteId, sabor, quantitat: 1 }];
  return linies.map((l, j) => (j === i ? { ...l, quantitat: Math.min(MAX_QUANTITAT_NUTRICIO, l.quantitat + 1) } : l));
}

/**
 * El que queda d'un sabor, descomptant el que ja és a la reserva. `null`: sense límit; `undefined`:
 * encara no se sap.
 */
export function nutricioLliure(
  disponibilitat: { nutricio: Record<string, Record<string, number | null>> } | null,
  linies: readonly LiniaNutricio[],
  producteId: string,
  sabor: string,
): number | null | undefined {
  const n = disponibilitat?.nutricio[producteId]?.[sabor];
  if (n === undefined || n === null) return n;
  const triades = linies.filter((l) => l.producteId === producteId && l.sabor === sabor).reduce((s, l) => s + l.quantitat, 0);
  return Math.max(0, n - triades);
}

/** Primera hora de recollida que encara no ha passat, dins dels propers dies. */
export function primeraRecollida(ara: Instant, horari: HorariBotiga): Moment | null {
  for (let i = 0; i < MAX_DIES_LLOGUER; i++) {
    const dia = sumaDies(ara.dia, i);
    const hora = horesRecollida(dia, horari).find((h) => !esPassat(dia, h, ara));
    if (hora) return { dia, hora };
  }
  return null;
}

/** Per defecte, el lloguer és d'un dia: es torna el mateix dia a l'última hora. */
export function retornPerDefecte(recollida: Moment, horari: HorariBotiga): Moment {
  const hores = horesRetorn(recollida.dia, horari);
  return { dia: recollida.dia, hora: hores.at(-1) ?? recollida.hora };
}

/**
 * Posa o treu un extra de la llista d'una bici. Dels extres d'un mateix grup de la plataforma
 * (`grupId`) se'n pot triar un com a molt: el nou substitueix el que hi hagués.
 */
export function commutaExtra(triats: readonly string[], id: string, extres: readonly { id: string; grupId?: string }[]): string[] {
  if (triats.includes(id)) return triats.filter((x) => x !== id);
  const grup = extres.find((e) => e.id === id)?.grupId;
  const delGrup = grup ? new Set(extres.filter((e) => e.grupId === grup).map((e) => e.id)) : new Set<string>();
  return [...triats.filter((x) => !delGrup.has(x)), id];
}
