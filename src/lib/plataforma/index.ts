import { sumaDies } from '../calendari';
import { totalReserva } from '../preus';
import { articles, flota, preusAccessoris, productes, ressenyes, serveisTaller, valoracioGoogle } from './dades-prova';
import { frangesTaller, unitatsLliures } from './disponibilitat-prova';
import {
  article,
  biciLloguer,
  producte,
  citaTaller,
  reservaLloguer,
  ressenya,
  serveiTaller,
  valoracio,
  type Accessori,
  type Article,
  type BiciLloguer,
  type CategoriaEquipament,
  type CitaTaller,
  type Confirmacio,
  type FranjaTaller,
  type Producte,
  type ReservaLloguer,
  type Ressenya,
  type ServeiTaller,
  type Valoracio,
} from './esquema';

// Frontera amb la plataforma de Nertel (app.nertel.ai): el catàleg, la flota, el taller i les
// reserves viuen allà, i els agents de veu i WhatsApp hi llegeixen el mateix. La resta de la web
// només parla amb aquesta interfície; el nom i els detalls del proveïdor no surten d'aquí.
//
// Avui la plataforma encara no té API pública per a webs (vegeu docs/proposta-web.md §7), així
// que l'única implementació és la de proves. Quan n'hi hagi, s'hi afegeix una implementació
// remota que fa les crides des del servidor amb la clau del client.

export class ErrorReserva extends Error {
  constructor(readonly motiu: 'bici' | 'talla' | 'durada' | 'esgotat' | 'franja') {
    super(`Reserva rebutjada: ${motiu}`);
  }
}

export interface Plataforma {
  flota(): Promise<BiciLloguer[]>;
  bici(id: string): Promise<BiciLloguer | null>;
  preusAccessoris(): Promise<Record<Accessori, number>>;
  /** Unitats lliures de cada talla per a tot el període. */
  disponibilitat(biciId: string, recollida: string, dies: number): Promise<Record<string, number>>;
  crearReservaLloguer(reserva: ReservaLloguer): Promise<Confirmacio>;
  serveisTaller(): Promise<ServeiTaller[]>;
  frangesTaller(dia: string): Promise<FranjaTaller[]>;
  crearCitaTaller(cita: CitaTaller): Promise<Confirmacio>;
  /** Productes de la botiga que milloren cada peça (el catàleg de venda de la plataforma). */
  productes(): Promise<Producte[]>;
  /** Articles de la botiga d'equipament d'una categoria. */
  articles(categoria: CategoriaEquipament): Promise<Article[]>;
  valoracio(): Promise<Valoracio>;
  ressenyes(): Promise<Ressenya[]>;
}

/**
 * Implementació de proves: dades locals i les reserves en memòria del procés (es perden en
 * reiniciar). L'atzar dels codis entra per paràmetre perquè les proves siguin deterministes.
 */
export function crearPlataformaProva({ generaCodi }: { generaCodi: () => string }): Plataforma {
  const reserves: (ReservaLloguer & Confirmacio)[] = [];
  const cites: (CitaTaller & Confirmacio)[] = [];

  const dies = (r: Pick<ReservaLloguer, 'durada'>) => (r.durada.tipus === 'migDia' ? 1 : r.durada.dies);
  const reservadesEl = (biciId: string, talla: string, dia: string) =>
    reserves
      .filter((r) => r.biciId === biciId && r.talla === talla)
      .filter((r) => {
        for (let i = 0; i < dies(r); i++) if (sumaDies(r.recollida, i) === dia) return true;
        return false;
      })
      .reduce((total, r) => total + r.bicis, 0);

  const lliures = (biciId: string, talla: string, recollida: string, n: number) => {
    let minim = Infinity;
    for (let i = 0; i < n; i++) {
      const dia = sumaDies(recollida, i);
      minim = Math.min(minim, unitatsLliures(biciId, talla, dia, 1, reservadesEl(biciId, talla, dia)));
    }
    return Number.isFinite(minim) ? minim : 0;
  };

  const plataforma: Plataforma = {
    // Es validen igual que les dades remotes: si l'esquema canvia, les proves ho detecten.
    flota: async () => biciLloguer.array().parse(flota),
    bici: async (id) => {
      const trobada = flota.find((b) => b.id === id);
      return trobada ? biciLloguer.parse(trobada) : null;
    },
    preusAccessoris: async () => ({ ...preusAccessoris }),
    disponibilitat: async (biciId, recollida, n) => {
      const bici = flota.find((b) => b.id === biciId);
      if (!bici) return {};
      return Object.fromEntries(bici.talles.map((talla) => [talla, lliures(biciId, talla, recollida, n)]));
    },
    crearReservaLloguer: async (entrada) => {
      const reserva = reservaLloguer.parse(entrada);
      const bici = flota.find((b) => b.id === reserva.biciId);
      if (!bici) throw new ErrorReserva('bici');
      if (!bici.talles.includes(reserva.talla)) throw new ErrorReserva('talla');
      const total = totalReserva(bici.tarifa, reserva.durada, reserva.bicis, reserva.accessoris, preusAccessoris);
      if (total === null) throw new ErrorReserva('durada');
      if (lliures(bici.id, reserva.talla, reserva.recollida, dies(reserva)) < reserva.bicis) throw new ErrorReserva('esgotat');
      const confirmacio = { codi: generaCodi(), totalCentims: total };
      reserves.push({ ...reserva, ...confirmacio });
      return confirmacio;
    },
    serveisTaller: async () => serveiTaller.array().parse(serveisTaller),
    frangesTaller: async (dia) => {
      const ocupades: Record<string, number> = {};
      for (const c of cites) if (c.dia === dia) ocupades[c.hora] = (ocupades[c.hora] ?? 0) + 1;
      return frangesTaller(dia, ocupades);
    },
    crearCitaTaller: async (entrada) => {
      const cita = citaTaller.parse(entrada);
      const franja = (await plataforma.frangesTaller(cita.dia)).find((f) => f.inici === cita.hora);
      if (!franja || franja.places < 1) throw new ErrorReserva('franja');
      const confirmacio = { codi: generaCodi() };
      cites.push({ ...cita, ...confirmacio });
      return confirmacio;
    },
    productes: async () => producte.array().parse(productes),
    articles: async (categoria) => article.array().parse(articles.filter((a) => a.categoria === categoria)),
    valoracio: async () => valoracio.parse(valoracioGoogle),
    ressenyes: async () => ressenya.array().parse(ressenyes),
  };
  return plataforma;
}

/** Codi curt i llegible per telèfon: TB- i sis caràcters sense lletres que es confonguin. */
function codiAleatori() {
  const lletres = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  const bytes = crypto.getRandomValues(new Uint8Array(6));
  return `TB-${Array.from(bytes, (b) => lletres[b % lletres.length]).join('')}`;
}

export const plataforma: Plataforma = crearPlataformaProva({ generaCodi: codiAleatori });
