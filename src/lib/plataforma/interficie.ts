import type {
  Article,
  BiciLloguer,
  CategoriaEquipament,
  CitaTaller,
  Confirmacio,
  ConfiguracioReserves,
  Extra,
  FranjaTaller,
  HorariBotiga,
  ModalitatPagament,
  Moment,
  ParticipantsReserva,
  Producte,
  ProducteNutricio,
  ReservaLloguer,
  Ressenya,
  Retencio,
  ServeiTaller,
  Valoracio,
} from './esquema';

// Frontera amb la plataforma de Nertel (app.nertel.ai): el catàleg, la flota, el taller i les
// reserves viuen allà, i els agents de veu i WhatsApp hi llegeixen el mateix. La resta de la web
// només parla amb aquesta interfície; el nom i els detalls del proveïdor no surten d'aquesta carpeta.

export class ErrorReserva extends Error {
  constructor(
    readonly motiu: 'bici' | 'talla' | 'durada' | 'esgotat' | 'extra' | 'franja' | 'retencio' | 'participants' | 'noDisponible',
    /** Per als registres: què ha dit la plataforma, si n'ha dit res. La web decideix pel motiu. */
    detall?: string,
  ) {
    super(`Reserva rebutjada: ${motiu}${detall ? ` (${detall})` : ''}`);
  }
}

/** Unitats lliures durant tot un lloguer: de cada talla de cada bici i de cada extra. */
export type Disponibilitat = {
  bicis: Record<string, Record<string, number>>;
  /** `null`: l'extra no té límit d'unitats. D'un extra amb variants, el total. */
  extres: Record<string, number | null>;
  /** Dels extres amb variants (talles d'un casc), el que queda de cada variant. */
  variantsExtres: Record<string, Record<string, number | null>>;
  /**
   * El que queda de cada sabor de cada producte de nutrició. No depèn de les dates: es ven i no
   * torna. Buit si la reserva no admet nutrició.
   */
  nutricio: Record<string, Record<string, number | null>>;
};

/** Com està una retenció: guarda les bicis, ha caducat, s'ha alliberat o ja és una reserva (`codi`). */
export type EstatRetencio = { estat: 'activa' | 'caducada' | 'alliberada' | 'convertida'; codi?: string };

export interface Plataforma {
  flota(): Promise<BiciLloguer[]>;
  bici(id: string): Promise<BiciLloguer | null>;
  /** Pedals i extres que es poden afegir a cada bici. */
  extres(): Promise<Extra[]>;
  horari(): Promise<HorariBotiga>;
  configuracioReserves(): Promise<ConfiguracioReserves>;
  /** Disponibilitat de les bicis demanades i de tots els extres, de la recollida al retorn. */
  disponibilitat(recollida: Moment, retorn: Moment, biciIds: readonly string[]): Promise<Disponibilitat>;
  /** Reserva sense pagament en línia: es paga a la botiga. Pot quedar pendent que la botiga la confirmi. */
  crearReservaLloguer(reserva: ReservaLloguer): Promise<Confirmacio>;
  /** Guarda bicis i extres uns minuts mentre el client paga. */
  retenirReserva(reserva: ReservaLloguer): Promise<Retencio>;
  alliberarRetencio(id: string): Promise<void>;
  /** Adreça de la passarel·la de pagament de la plataforma per a una retenció. */
  iniciarPagament(retencioId: string, modalitat: ModalitatPagament, tornada: string): Promise<{ url: string }>;
  /** En tornar del pagament: si la retenció ja s'ha convertit en reserva. */
  estatRetencio(id: string): Promise<EstatRetencio>;
  /** Dades dels ciclistes i signatura del contracte abans de recollir. */
  registrarParticipants(participants: ParticipantsReserva): Promise<void>;
  serveisTaller(): Promise<ServeiTaller[]>;
  frangesTaller(dia: string): Promise<FranjaTaller[]>;
  crearCitaTaller(cita: CitaTaller): Promise<Confirmacio>;
  /** Gels, barretes i begudes que es poden afegir a una reserva de lloguer. */
  nutricio(): Promise<ProducteNutricio[]>;
  /** Productes de la botiga que milloren cada peça (el catàleg de venda de la plataforma). */
  productes(): Promise<Producte[]>;
  /** Articles de la botiga d'equipament d'una categoria. */
  articles(categoria: CategoriaEquipament): Promise<Article[]>;
  valoracio(): Promise<Valoracio>;
  ressenyes(): Promise<Ressenya[]>;
}
