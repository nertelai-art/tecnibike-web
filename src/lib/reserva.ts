import { esPassat, sumaDies, type Instant } from './calendari';
import { horesRecollida, horesRetorn, MAX_DIES_LLOGUER } from './horari';
import type { HorariBotiga, Moment } from './plataforma/esquema';

// Ajudes del formulari de reserva amb diverses bicis. Pures: la disponibilitat, l'horari i l'«ara»
// entren per paràmetre.

type Disponibilitat = { bicis: Record<string, Record<string, number>>; extres: Record<string, number | null> };
type Linia = { biciId: string; talla: string | null; pedals: string; extres: readonly string[] };

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
