import {
  article,
  biciLloguer,
  biciVenda,
  categoriaLloguer,
  citaTaller,
  contacteVenda,
  serveiTaller,
  type Peca,
  type Article,
  type BiciLloguer,
  type BiciVenda,
  type CategoriaEquipament,
  type CategoriaLloguer,
  type Extra,
  type HorariBotiga,
  type MomentNutricio,
  type ProducteNutricio,
  type ReservaLloguer,
  type TipusNutricio,
  type Tarifa,
} from '../esquema';
import { ErrorReserva, type Plataforma } from '../interficie';
import {
  RentalAvailabilityResponseSchema,
  RentalBookingRequestSchema,
  RentalBookingResponseSchema,
  RentalCatalogResponseSchema,
  RentalCheckoutResponseSchema,
  RentalErrorResponseSchema,
  RentalHoldCreatedResponseSchema,
  RentalHoldSchema,
  RentalHoursResponseSchema,
  RentalSettingsResponseSchema,
  type RentalBookingRequest,
  type RentalCatalogResponse,
  type RentalErrorCode,
  type RentalHoursResponse,
} from './contracte';
import { WebRequestErrorResponseSchema, WebRequestResponseSchema } from './contracte-sollicituds';
import { WebBookingAvailabilityResponseSchema, WebBookingErrorResponseSchema, WebBookingResponseSchema } from './contracte-cites';

// Implementació remota de la plataforma: l'API de lloguer de app.nertel.ai
// (`/api/public/rental/*`, contracte a ./contracte.ts). Sempre des del servidor: la clau només és en
// variables d'entorn sense `NEXT_PUBLIC_`, que Next no posa mai al codi del navegador.
//
// El que la plataforma encara no té a l'API (els productes per peça, les ressenyes i els
// participants) surt de la implementació de proves. La nutrició i les bicis en venda, també, mentre
// la botiga no n'hagi donat d'alta cap al catàleg.

/**
 * Quant temps es reaprofita el catàleg, l'horari i els ajustos: el que hi canviï a la plataforma surt
 * a la web en aquest temps. Les pàgines que els llegeixen ho diuen també amb `export const revalidate`.
 */
export const REVALIDA_S = 300;
/** La foto d'una bici que a la plataforma no en té. */
const SENSE_FOTO = '/img/flota/sense-foto.svg';

type Opcions = {
  /** L'arrel de la plataforma: `https://app.nertel.ai`. */
  url: string;
  /** La clau lligada a la botiga, amb els abasts `rental_read` i `rental_write`. */
  clau: string;
  /**
   * La clau de cites, lligada a la botiga, amb els abasts `web_booking_read` i `web_booking_write`
   * (`/api/public/bookings`). Sense, no es poden demanar cites de taller en línia.
   */
  clauCites?: string;
  /** El servei de la cita, si la botiga en té més d'un que es reservi a hores. Sense, el seu únic servei. */
  serveiCita?: string;
  /** La implementació del que la plataforma encara no té a l'API. */
  proves: Plataforma;
  /**
   * Si és la compilació (`next build`): el catàleg, l'horari i els ajustos es demanen una sola vegada
   * per procés i serveixen per a totes les pàgines. Fora de la compilació, només es comparteixen les
   * lectures simultànies.
   */
  compilant?: boolean;
  fetch?: typeof globalThis.fetch;
  /** Una clau d'idempotència per a cada enviament d'una reserva. */
  generaClau?: () => string;
  /** El rellotge, en mil·lisegons: només per saber quan cal tornar a mirar el permís de la clau. */
  rellotge?: () => number;
};

type Model = RentalCatalogResponse['models'][number];

/** Els codis de la plataforma que són culpa del que s'ha demanat, amb el motiu que la web sap ensenyar. */
const MOTIUS: Partial<Record<RentalErrorCode, ErrorReserva['motiu']>> = {
  unknown_model: 'bici',
  unknown_variant: 'talla',
  sold_out: 'esgotat',
  invalid_option: 'extra',
  outside_hours: 'franja',
  invalid_duration: 'durada',
  not_enabled: 'noDisponible',
  payment_mode_not_allowed: 'noDisponible',
  hold_expired: 'retencio',
  not_found: 'retencio',
};

/** Adreça llegible d'un model: la que hi posi la botiga (`attributes.slug`) o el nom sense accents. */
export function slugDe(model: Pick<Model, 'name' | 'attributes' | 'sku'>): string {
  // La referència del catàleg (`sku`) és el codi estable que tria la botiga: és la bona per a l'adreça.
  return model.sku?.trim() ? normalitza(model.sku) : slugAntic(model);
}

/** L'adreça d'abans de la referència: `attributes.slug` o el nom. Les d'enllaços vells encara valen. */
export function slugAntic(model: Pick<Model, 'name' | 'attributes'>): string {
  const triat = model.attributes.slug;
  return normalitza(typeof triat === 'string' && triat.trim() ? triat : model.name);
}

function normalitza(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

/**
 * Categoria per als filtres de la flota: la de `attributes.category`, si la botiga l'hi posa; si
 * no, se'n dedueix del nom, mentre la plataforma no la tingui.
 */
export function categoriaDe(model: Pick<Model, 'name' | 'attributes' | 'category'>): CategoriaLloguer {
  // La categoria del catàleg («Muntanya», «Carretera», «Gravel», «Passeig»), sense majúscules ni accents.
  const delCataleg = model.category ? CATEGORIES_CATALEG[normalitza(model.category)] : undefined;
  if (delCataleg) return delCataleg;
  const triada = categoriaLloguer.safeParse(model.attributes.category);
  if (triada.success) return triada.data;
  const nom = model.name.toLowerCase();
  if (/carretera|road|ruta/.test(nom)) return 'carretera';
  if (/gravel/.test(nom)) return 'gravel';
  if (/urban|passeig|paseo|ciutat|ciudad|city/.test(nom)) return 'passeig';
  return 'muntanya';
}

/** El nom de categoria del catàleg, ja normalitzat, a la categoria dels filtres de la flota. */
const CATEGORIES_CATALEG: Record<string, CategoriaLloguer> = {
  muntanya: 'muntanya', montana: 'muntanya', mountain: 'muntanya', btt: 'muntanya', mtb: 'muntanya',
  carretera: 'carretera', road: 'carretera',
  gravel: 'gravel',
  passeig: 'passeig', paseo: 'passeig', urbana: 'passeig', city: 'passeig', ciutat: 'passeig',
};

/**
 * Si és elèctrica: el camp «Elèctrica» del catàleg (`attributes["elèctrica"]`, sí o no); si no hi és,
 * `attributes.electric`; i si tampoc, un nom com «E-bike» o «E-gravel».
 */
export function electricaDe(model: Pick<Model, 'name' | 'attributes'>): boolean {
  for (const clau of ['elèctrica', 'electrica', 'electric']) {
    const marcada = model.attributes[clau];
    if (typeof marcada === 'boolean') return marcada;
  }
  return /^e-|el[eè]ctric/i.test(model.name.trim());
}

/** Les tarifes de tot l'any, en els trams de la web (1 dia, de 2 a 6, més de 6 i mig dia). */
export function tarifaDe(model: Model): Tarifa | null {
  const tot = model.rates.filter((r) => r.seasonId === null);
  const dies = tot.filter((r) => r.unit === 'day').sort((a, b) => a.fromUnits - b.fromUnits);
  const primer = dies[0];
  if (!primer) return null;
  const tram = (des: number, fins: number) => dies.filter((r) => r.fromUnits >= des && r.fromUnits <= fins).at(-1)?.priceCents;
  const migDia = tot.find((r) => r.unit === 'half_day')?.priceCents;
  return {
    dia: primer.priceCents,
    ...(migDia !== undefined && { migDia }),
    ...(tram(2, 6) !== undefined && { de2a6: tram(2, 6) }),
    ...(tram(7, Infinity) !== undefined && { mesDe6: tram(7, Infinity) }),
  };
}

/** L'horari de la plataforma en la forma de la web. Els dies especials amb trams, com un període d'un dia. */
export function horariDe(hores: RentalHoursResponse): HorariBotiga {
  // A la web, el diumenge és 0; a la plataforma, 7. Mitjanit (24:00) es queda en 23:59.
  const tanca = (h: string) => (h === '24:00' ? '23:59' : h);
  const setmana = (trams: RentalHoursResponse['weekly']) =>
    Array.from({ length: 7 }, (_, dia) =>
      trams.filter((t) => t.weekday % 7 === dia).map((t) => ({ obre: t.opensAt, tanca: tanca(t.closesAt) })),
    );
  const especials = hores.exceptions
    .filter((e) => !e.closed)
    .map((e) => ({ des: e.date, fins: e.date, setmana: Array.from({ length: 7 }, () => e.ranges.map((r) => ({ obre: r.opensAt, tanca: tanca(r.closesAt) }))) }));
  return {
    setmana: setmana(hores.weekly),
    // Els dies especials, primer: manen sobre els períodes.
    periodes: [...especials, ...hores.periods.map((p) => ({ des: p.startsOn, fins: p.endsOn, setmana: setmana(p.weekly) }))],
    tancats: hores.exceptions.filter((e) => e.closed).map((e) => ({ dia: e.date, ficticia: false })),
    pasMinuts: hores.slotMinutes,
  };
}

/** El nom de categoria que posa la botiga al catàleg, a la categoria d'equipament de la web. */
const CATEGORIES_VENDA: Record<string, CategoriaEquipament> = {
  casc: 'cascs', cascs: 'cascs', cascos: 'cascs', helmets: 'cascs',
  ullera: 'ulleres', ulleres: 'ulleres', gafas: 'ulleres', glasses: 'ulleres',
  roba: 'roba', ropa: 'roba', clothing: 'roba',
  sabata: 'sabates', sabates: 'sabates', zapatillas: 'sabates', shoes: 'sabates',
  nutricio: 'nutricio', nutricion: 'nutricio', nutrition: 'nutricio',
  accessori: 'accessoris', accessoris: 'accessoris', accesorios: 'accessoris', accessories: 'accessoris',
};

/** La categoria d'equipament d'un nom de categoria del catàleg, o `null` si no és de la botiga. */
export function categoriaVendaDe(nom: string | null): CategoriaEquipament | null {
  if (!nom) return null;
  const clau = nom.normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim().toLowerCase();
  return CATEGORIES_VENDA[clau] ?? null;
}

type ProducteVenda = NonNullable<RentalCatalogResponse['saleProducts']>[number];

/** Un producte de venda de la plataforma, com a article de la botiga de la web. */
function articleDe(p: ProducteVenda, categoria: CategoriaEquipament): Article {
  const marca = p.attributes.marca ?? p.attributes.brand;
  return article.parse({
    id: p.id,
    categoria,
    marca: typeof marca === 'string' ? marca : '',
    nom: p.name,
    preu: p.priceBasis === 'on_request' ? null : p.priceCents,
    preuBase: p.priceBasis === 'on_request' || p.priceCents === null ? 'consultar' : p.priceBasis === 'from' ? 'desDe' : 'exacte',
    ...(p.description && { descripcio: p.description }),
    ...(p.imageUrl && { imatge: p.imageUrl }),
    ficticia: false,
  });
}

/** El nom de la peça al catàleg del taller (la categoria del servei, o el nom), ja normalitzat. */
const PECES_CATALEG: Record<string, Peca> = {
  transmissio: 'transmissio', transmision: 'transmissio', canvis: 'transmissio', cambios: 'transmissio', drivetrain: 'transmissio',
  frens: 'frens', frenos: 'frens', brakes: 'frens',
  rodes: 'rodes', ruedas: 'rodes', wheels: 'rodes', punxades: 'rodes',
  direccio: 'direccio', direccion: 'direccio', steering: 'direccio',
  seient: 'seient', sillin: 'seient', 'bike-fitting': 'seient',
  quadre: 'quadre', cuadro: 'quadre', frame: 'quadre', 'posada-a-punt': 'quadre',
};

type ServeiCataleg = NonNullable<RentalCatalogResponse['workshopServices']>[number];

/** La peça d'un servei del taller del catàleg: per la categoria, una clau `peca` dels atributs o el nom. */
export function pecaDe(s: ServeiCataleg): Peca | null {
  for (const valor of [s.category, s.attributes.peca, s.name]) {
    if (typeof valor !== 'string' || !valor.trim()) continue;
    const peca = PECES_CATALEG[normalitza(valor)];
    if (peca) return peca;
  }
  return null;
}

type ArticleBotiga = RentalCatalogResponse['shopItems'][number];

/** El primer atribut que hi hagi d'unes quantes claus (la botiga les escriu en minúscules, en qualsevol idioma). */
function atribut(atributs: Record<string, unknown>, ...claus: string[]): unknown {
  for (const clau of claus) if (atributs[clau] !== undefined && atributs[clau] !== null && atributs[clau] !== '') return atributs[clau];
  return undefined;
}

const text = (valor: unknown) => (typeof valor === 'string' && valor.trim() ? valor.trim() : undefined);
const nombre = (valor: unknown) =>
  typeof valor === 'number' && valor >= 0 ? valor : typeof valor === 'string' && /^\d+([.,]\d+)?$/.test(valor.trim()) ? Number(valor.trim().replace(',', '.')) : undefined;

/** El tipus d'un producte de nutrició: el camp «Tipus» del catàleg o, si no hi és, el nom. Sense pistes, gel. */
export function tipusNutricioDe(nom: string, atributs: Record<string, unknown>): TipusNutricio {
  const pista = normalitza(`${text(atribut(atributs, 'tipus', 'tipo', 'type')) ?? ''} ${nom}`);
  if (/recupera|recovery/.test(pista)) return 'recuperacio';
  if (/barr|(^|-)bar(-|$)/.test(pista)) return 'barreta';
  if (/gomin|chew|gummi/.test(pista)) return 'gominoles';
  if (/pastill|tab/.test(pista)) return 'pastilles';
  if (/shot/.test(pista)) return 'shot';
  if (/beguda|bebida|drink|isoton|hidrat|mix/.test(pista)) return 'beguda';
  return 'gel';
}

const MOMENTS: Record<string, MomentNutricio> = {
  abans: 'abans', antes: 'abans', before: 'abans',
  durant: 'durant', durante: 'durant', during: 'durant',
  despres: 'despres', despues: 'despres', after: 'despres',
};

/** Un article de botiga de la plataforma (`shopItems`) com a producte de nutrició de la web. */
function producteNutricioDe(a: ArticleBotiga): ProducteNutricio {
  const moments = String(atribut(a.attributes, 'moment', 'moments', 'momento') ?? '')
    .split(/[,;/]/)
    .map((m) => MOMENTS[normalitza(m)])
    .filter((m): m is MomentNutricio => m !== undefined);
  const carbohidrats = nombre(atribut(a.attributes, 'carbohidrats', 'carbohidratos', 'carbs'));
  const cafeina = nombre(atribut(a.attributes, 'cafeïna', 'cafeina', 'caffeine'));
  return {
    id: a.id,
    marca: text(atribut(a.attributes, 'marca', 'brand')) ?? '',
    nom: a.name,
    tipus: tipusNutricioDe(a.name, a.attributes),
    moments: moments.length ? [...new Set(moments)] : ['durant'],
    format: text(atribut(a.attributes, 'format', 'formato', 'size')) ?? '',
    ...(carbohidrats !== undefined && { carbohidratsG: carbohidrats }),
    ...(cafeina !== undefined && cafeina > 0 && { cafeinaMg: cafeina }),
    ...(a.description && { descripcio: a.description }),
    ...(a.imageUrl && { imatge: a.imageUrl }),
    preu: a.priceCents,
    // Sense sabors, la plataforma n'envia un de sol sense nom: el nom buit no s'ensenya.
    sabors: a.variants.map((v) => ({
      id: v.id,
      nom: v.label ?? '',
      ...(v.priceCents !== null && v.priceCents !== a.priceCents && { preu: v.priceCents }),
      estoc: null,
    })),
    ficticia: false,
  };
}

/** Si una categoria del catàleg és la de les bicis en venda: «Bicicletes», «Bicis de segona mà», «Bikes»… */
export function esCategoriaBicis(nom: string | null | undefined): boolean {
  return Boolean(nom) && /^(bici|bicicleta|bicycle|bike)/.test(normalitza(nom!));
}

/** Els atributs que no van a la fitxa tècnica: la marca ja surt a dalt, i l'adreça és de la web. */
const FORA_DE_FITXA = new Set(['marca', 'brand', 'slug']);

const DISPONIBILITATS = { available: 'disponible', unavailable: 'esgotada', on_order: 'perEncarrec' } as const;

/** L'estoc de la plataforma: nul (o no hi és) vol dir que no se'n porta el compte, no que sigui zero. */
const estocDe = (n: number | null | undefined) => (typeof n === 'number' ? Math.max(0, n) : null);

/** Un producte de venda de la categoria de bicis com a bici en venda de la web. */
function biciVendaDe(p: ProducteVenda, id: string): BiciVenda {
  const fitxa = Object.entries(p.attributes).flatMap(([camp, valor]): BiciVenda['fitxa'] => {
    if (FORA_DE_FITXA.has(camp)) return [];
    if (typeof valor === 'boolean') return [{ camp, valor }];
    if (typeof valor === 'number') return [{ camp, valor: String(valor) }];
    const escrit = text(valor);
    return escrit ? [{ camp, valor: escrit }] : [];
  });
  const consultar = p.priceBasis === 'on_request' || p.priceCents === null;
  return biciVenda.parse({
    id,
    nom: p.name,
    marca: text(atribut(p.attributes, 'marca', 'brand')) ?? '',
    preu: consultar ? null : p.priceCents,
    preuBase: consultar ? 'consultar' : p.priceBasis === 'from' ? 'desDe' : 'exacte',
    ivaInclos: p.vatIncluded,
    ...(p.description && { descripcio: p.description }),
    ...(p.imageUrl && { imatge: p.imageUrl }),
    imatges: p.images ?? [],
    ...(p.availability && { disponibilitat: DISPONIBILITATS[p.availability] }),
    estoc: estocDe(p.stock),
    ...(p.variantName && { nomVariants: p.variantName }),
    variants: (p.variants ?? []).map((v) => ({ nom: v.label, preu: v.priceCents, estoc: estocDe(v.stock) })),
    fitxa,
    ficticia: false,
  });
}

/** En tornar de la pàgina de pagament, la plataforma hi afegeix si s'ha pagat o s'ha cancel·lat. */
export function resultatDelPagament(parametres: Record<string, string | string[] | undefined>): 'pagat' | 'cancellat' | null {
  const valor = parametres.nertel_checkout;
  if (valor === 'success') return 'pagat';
  if (valor === 'cancel') return 'cancellat';
  return null;
}

export function crearPlataformaRemota({
  url,
  clau,
  clauCites,
  serveiCita,
  proves,
  compilant = false,
  fetch = globalThis.fetch,
  generaClau = () => crypto.randomUUID(),
  rellotge = () => Date.now(),
}: Opcions): Plataforma {
  /**
   * Les lectures que fan servir totes les pàgines (catàleg, horari i ajustos), una per ruta. Qui la
   * demana mentre ja s'està fent espera la mateixa resposta; compilant, a més, es guarda fins al final.
   * No es pot deixar a la memòria de `fetch` de Next: a Vercel, durant la compilació, no torna res, i
   * el 16-11-2026 cada pàgina va tornar a la plataforma (593 crides al catàleg en dues compilacions).
   * Una lectura que falla no es guarda.
   */
  const compartides = new Map<string, Promise<unknown>>();

  function crida(ruta: string, opcions: { metode?: string; cos?: unknown; idempotencia?: string; revalida?: boolean } = {}): Promise<unknown> {
    if (!opcions.revalida) return demana(ruta, opcions);
    const compartida = compartides.get(ruta);
    if (compartida) return compartida;
    const lectura = demana(ruta, opcions);
    compartides.set(ruta, lectura);
    const oblida = () => {
      if (compartides.get(ruta) === lectura) compartides.delete(ruta);
    };
    lectura.then(compilant ? undefined : oblida, oblida);
    return lectura;
  }

  async function demana(ruta: string, { metode = 'GET', cos, idempotencia, revalida }: { metode?: string; cos?: unknown; idempotencia?: string; revalida?: boolean }) {
    const resposta = await fetch(new URL(`/api/public/rental${ruta}`, url), {
      method: metode,
      headers: {
        'x-api-key': clau,
        accept: 'application/json',
        ...(cos !== undefined && { 'content-type': 'application/json' }),
        ...(idempotencia && { 'Idempotency-Key': idempotencia }),
      },
      body: cos === undefined ? undefined : JSON.stringify(cos),
      ...(revalida ? { next: { revalidate: REVALIDA_S } } : { cache: 'no-store' as const }),
    });
    const json: unknown = await resposta.json().catch(() => null);
    if (resposta.ok) return json;
    const problema = RentalErrorResponseSchema.safeParse(json);
    const codi = problema.success ? problema.data.error.code : undefined;
    const detall = problema.success ? [problema.data.error.field, problema.data.error.message].filter(Boolean).join(': ') : undefined;
    const motiu = codi && MOTIUS[codi];
    if (motiu) throw new ErrorReserva(motiu, detall);
    // La clau, el servei o un cos mal format: no és culpa de qui reserva.
    throw new Error(`La plataforma ha respost ${resposta.status} ${codi ?? ''} a ${metode} ${ruta}${detall ? ` (${detall})` : ''}`.replace(/ {2,}/g, ' '));
  }

  const cataleg = async () => RentalCatalogResponseSchema.parse(await crida('/catalog', { revalida: true }));
  const ajustos = async () => RentalSettingsResponseSchema.parse(await crida('/settings', { revalida: true }));

  /** Si la botiga ven articles (la nutrició) amb el lloguer i en té algun d'actiu. */
  async function ambNutricio(): Promise<boolean> {
    const [{ shopItemsEnabled }, { shopItems }] = await Promise.all([ajustos(), cataleg()]);
    return shopItemsEnabled && shopItems.length > 0;
  }

  /** Si la botiga no ven nutrició amb el lloguer, millor dir-ho que perdre-la pel camí. */
  async function comprovaNutricio(reserva: ReservaLloguer) {
    if (reserva.nutricio?.length && !(await ambNutricio())) throw new ErrorReserva('noDisponible', 'la botiga no ven nutrició amb el lloguer');
  }

  /** Les bicis en venda del catàleg, amb una adreça llegible única i l'identificador del producte. */
  async function bicisEnVendaAmbProducte(): Promise<{ bici: BiciVenda; producteId: string }[]> {
    const vistes = new Set<string>();
    return ((await cataleg()).saleProducts ?? [])
      .filter((p) => esCategoriaBicis(p.category))
      .map((p) => {
        const base = normalitza(text(p.attributes.slug) ?? p.name) || p.id;
        let id = base;
        for (let n = 2; vistes.has(id); n++) id = `${base}-${n}`;
        vistes.add(id);
        return { bici: biciVendaDe(p, id), producteId: p.id };
      });
  }
  const bicisEnVenda = async () => (await bicisEnVendaAmbProducte()).map((b) => b.bici);

  /**
   * Una sol·licitud al panell de la botiga (`POST /api/public/requests`, abast `web_request_write`), amb
   * la mateixa clau de la web. Sense `cos` ni `Idempotency-Key` només mira si la clau hi té permís: la
   * plataforma comprova la clau abans que res i, si la clau és bona, rebutja la crida per la capçalera
   * que falta (`422`) sense desar res.
   */
  async function cridaSollicitud(cos?: unknown, idempotencia?: string) {
    const resposta = await fetch(new URL('/api/public/requests', url), {
      method: 'POST',
      headers: {
        'x-api-key': clau,
        accept: 'application/json',
        'content-type': 'application/json',
        ...(idempotencia && { 'Idempotency-Key': idempotencia }),
      },
      body: JSON.stringify(cos ?? {}),
      cache: 'no-store',
    });
    const json: unknown = await resposta.json().catch(() => null);
    const problema = WebRequestErrorResponseSchema.safeParse(json);
    return { estat: resposta.status, ok: resposta.ok, json, problema: problema.success ? problema.data.error : undefined };
  }

  // Si la clau pot desar sol·licituds no canvia d'una pàgina a l'altra: es mira un cop cada 5 minuts.
  let permisSollicituds: { pot: boolean; fins: number } | null = null;

  /** L'API de cites (`/api/public/bookings`), la mateixa que fan servir els agents de veu i WhatsApp. */
  async function cridaCites(ruta: string, { metode = 'GET', cos, idempotencia }: { metode?: string; cos?: unknown; idempotencia?: string } = {}) {
    if (!clauCites) throw new ErrorReserva('noDisponible', 'falta la clau de cites de la plataforma');
    const resposta = await fetch(new URL(`/api/public/bookings${ruta}`, url), {
      method: metode,
      headers: {
        'x-api-key': clauCites,
        accept: 'application/json',
        ...(cos !== undefined && { 'content-type': 'application/json' }),
        ...(idempotencia && { 'Idempotency-Key': idempotencia }),
      },
      body: cos === undefined ? undefined : JSON.stringify(cos),
      cache: 'no-store',
    });
    const json: unknown = await resposta.json().catch(() => null);
    if (resposta.ok) return json;
    const problema = WebBookingErrorResponseSchema.safeParse(json);
    const codi = problema.success ? problema.data.error.code : undefined;
    const camp = problema.success ? problema.data.error.field : undefined;
    const detall = problema.success ? [camp, problema.data.error.message].filter(Boolean).join(': ') : undefined;
    if (codi === 'full' || codi === 'outside_hours' || codi === 'date_out_of_range') throw new ErrorReserva('franja', detall);
    if (codi === 'invalid_request' && camp?.startsWith('customer')) throw new ErrorReserva('dades', detall);
    // La clau, el servei o un cos mal format: no és culpa de qui demana la cita.
    throw new Error(`La plataforma de cites ha respost ${resposta.status} ${codi ?? ''} a ${metode} ${ruta || '/'}${detall ? ` (${detall})` : ''}`.replace(/ {2,}/g, ' '));
  }

  /** Les hores lliures d'un dia del servei de cita del taller. */
  async function horesLliures(dia: string) {
    const consulta = new URLSearchParams({ ...(serveiCita && { service: serveiCita }), from: dia, to: dia });
    return WebBookingAvailabilityResponseSchema.parse(await cridaCites(`/availability?${consulta}`));
  }

  /** Les bicis de la web amb el seu model de la plataforma, per traduir l'adreça llegible a l'identificador. */
  async function bicis(): Promise<{ bici: BiciLloguer; model: Model }[]> {
    const vistes = new Set<string>();
    const resultat: { bici: BiciLloguer; model: Model }[] = [];
    for (const model of (await cataleg()).models) {
      const tarifa = tarifaDe(model);
      if (!tarifa) continue; // sense tarifa per dies, la web no el sap llogar
      let id = slugDe(model) || model.id;
      for (let n = 2; vistes.has(id); n++) id = `${slugDe(model)}-${n}`;
      vistes.add(id);
      const valor = typeof model.attributes.model === 'string' ? model.attributes.model : '';
      resultat.push({
        model,
        bici: biciLloguer.parse({
          id,
          nom: model.name,
          categoria: categoriaDe(model),
          electrica: electricaDe(model),
          imatge: model.imageUrl ?? SENSE_FOTO,
          talles: model.variants.length ? model.variants : ['—'],
          tarifa,
          model: { valor, ficticia: false },
        }),
      });
    }
    return resultat;
  }

  async function modelId(biciId: string): Promise<string> {
    const trobada = (await bicis()).find((b) => b.bici.id === biciId);
    if (!trobada) throw new ErrorReserva('bici');
    return trobada.model.id;
  }

  async function cosDe(reserva: ReservaLloguer): Promise<RentalBookingRequest> {
    const items = await Promise.all(
      reserva.bicis.map(async (b) => ({
        modelId: await modelId(b.biciId),
        variant: b.talla === '—' ? null : b.talla,
        options: [...(b.pedals ? [b.pedals] : []), ...b.extres].map((optionId) => ({ optionId, variant: b.variants?.[optionId] ?? null })),
        rider: {
          ...(b.ciclista.nom && { name: b.ciclista.nom }),
          ...(b.ciclista.alcadaCm && { heightCm: b.ciclista.alcadaCm }),
          ...(b.ciclista.alcadaSeientCm && { saddleHeightCm: b.ciclista.alcadaSeientCm }),
        },
      })),
    );
    return RentalBookingRequestSchema.parse({
      pickup: { date: reserva.recollida.dia, time: reserva.recollida.hora },
      return: { date: reserva.retorn.dia, time: reserva.retorn.hora },
      items,
      // La nutrició: el sabor és la variant de l'article. El preu el posa la plataforma.
      ...(reserva.nutricio?.length && { shopItems: reserva.nutricio.map((l) => ({ variantId: l.sabor, quantity: l.quantitat })) }),
      customer: { name: reserva.nom, phone: reserva.telefon, email: reserva.correu, language: reserva.idioma },
      ...(reserva.comentaris && { notes: reserva.comentaris }),
      privacyAccepted: true,
    });
  }

  return {
    flota: async () => (await bicis()).map((b) => b.bici),
    // Primer per l'adreça d'ara; si no, per la d'abans de la referència (enllaços que ja circulen).
    bici: async (id) => {
      const totes = await bicis();
      return (totes.find((b) => b.bici.id === id) ?? totes.find((b) => slugAntic(b.model) === id))?.bici ?? null;
    },
    extres: async () => {
      const { optionGroups, options } = await cataleg();
      const obligatoris = new Set(optionGroups.filter((g) => g.required).map((g) => g.id));
      // D'un grup de tria múltiple se'n poden triar diversos: sense grup, la web no en desmarca cap en
      // triar-ne un altre. Sense `multiple` (respostes d'abans), un per grup, com sempre.
      const multiples = new Set(optionGroups.filter((g) => g.multiple).map((g) => g.id));
      const nomsGrups = new Map(optionGroups.map((g) => [g.id, g.name]));
      return options.map(
        (o): Extra => ({
          id: o.id,
          grup: obligatoris.has(o.groupId) ? 'pedals' : 'extres',
          nom: o.name,
          ...(!multiples.has(o.groupId) && { grupId: o.groupId }),
          ...(nomsGrups.has(o.groupId) && { grupNom: nomsGrups.get(o.groupId) }),
          ...(o.imageUrl && { imatge: o.imageUrl }),
          preu: o.priceCents,
          cobrament: o.priceUnit === 'day' ? 'perDia' : 'perReserva',
          estoc: null,
          ...(o.variants.length > 0 && { variants: o.variants.map((nom) => ({ nom, estoc: null })) }),
          ficticia: false,
        }),
      );
    },
    horari: async () => horariDe(RentalHoursResponseSchema.parse(await crida('/hours', { revalida: true }))),
    configuracioReserves: async () => {
      const [{ payment, holdMinutes, minNoticeMinutes }, nutricio] = await Promise.all([ajustos(), ambNutricio()]);
      const mode = payment?.mode ?? 'none';
      return {
        pagament: {
          actiu: mode !== 'none',
          // Primer la que cobra en línia; «a la botiga» només si la botiga també ho deixa.
          modalitats: [mode === 'full' ? 'total' : 'senyal', ...(payment?.payAtShop ? (['botiga'] as const) : [])],
          senyalPercent: payment?.depositPercent ?? 100,
        },
        participants: { actiu: false },
        // Els articles que la botiga ven amb el lloguer (`shopItems`), si en ven i en té algun.
        nutricio: { actiu: nutricio },
        retencioMinuts: holdMinutes,
        antelacioMinuts: minNoticeMinutes,
      };
    },
    disponibilitat: async (recollida, retorn, biciIds) => {
      const totes = await bicis();
      const demanades = totes.filter((b) => biciIds.includes(b.bici.id));
      const consulta = new URLSearchParams({ pickupDate: recollida.dia, pickupTime: recollida.hora, returnDate: retorn.dia, returnTime: retorn.hora });
      if (demanades.length) consulta.set('models', demanades.map((b) => b.model.id).join(','));
      const [lliures, { shopItems }] = await Promise.all([crida(`/availability?${consulta}`).then((r) => RentalAvailabilityResponseSchema.parse(r)), cataleg()]);
      const perModel = new Map(demanades.map((b) => [b.model.id, b.bici.id]));
      const resultat: Awaited<ReturnType<Plataforma['disponibilitat']>> = { bicis: {}, extres: {}, variantsExtres: {}, nutricio: {} };
      for (const m of lliures.models) {
        const id = perModel.get(m.modelId);
        if (id) resultat.bicis[id] = Object.fromEntries(m.variants.map((v) => [v.variant ?? '—', v.free ?? 0]));
      }
      for (const o of lliures.options) {
        // Sense variants, n'hi ha una sola entrada; amb variants (talles d'un casc), el total.
        const lliure = o.variants.map((v) => v.free);
        resultat.extres[o.optionId] = lliure.includes(null) ? null : lliure.reduce<number>((a, b) => a + (b ?? 0), 0);
        const ambNom = o.variants.filter((v) => v.variant !== null);
        if (ambNom.length) resultat.variantsExtres[o.optionId] = Object.fromEntries(ambNom.map((v) => [v.variant!, v.free]));
      }
      // El que queda de cada sabor (la variant d'un article), pel producte: no depèn de les dates.
      const producteDe = new Map(shopItems.flatMap((a) => a.variants.map((v) => [v.id, a.id] as const)));
      for (const { variantId, free } of lliures.shopItems) {
        const producte = producteDe.get(variantId);
        if (producte) (resultat.nutricio[producte] ??= {})[variantId] = free;
      }
      return resultat;
    },
    crearReservaLloguer: async (reserva) => {
      await comprovaNutricio(reserva);
      const feta = RentalBookingResponseSchema.parse(await crida('/bookings', { metode: 'POST', cos: await cosDe(reserva), idempotencia: generaClau() }));
      // El testimoni d'accés (`accessToken`) caldrà per als participants (L10); avui la web no el desa.
      return { codi: feta.reference, totalCentims: feta.totalCents, estat: feta.status === 'pending' ? 'pendent' : 'confirmada' };
    },
    retenirReserva: async (reserva) => {
      await comprovaNutricio(reserva);
      const retinguda = RentalHoldCreatedResponseSchema.parse(await crida('/holds', { metode: 'POST', cos: await cosDe(reserva), idempotencia: generaClau() }));
      return { id: retinguda.holdId, caducaA: retinguda.expiresAt, totalCentims: retinguda.totalCents };
    },
    alliberarRetencio: async (id) => {
      await crida(`/holds/${encodeURIComponent(id)}`, { metode: 'DELETE' }).catch((e: unknown) => {
        // Ja caducada o convertida: no hi ha res a alliberar.
        if (!(e instanceof ErrorReserva)) throw e;
      });
    },
    iniciarPagament: async (id, modalitat, tornada) => {
      const pagament = RentalCheckoutResponseSchema.parse(
        await crida(`/holds/${encodeURIComponent(id)}/checkout`, { metode: 'POST', cos: { mode: modalitat === 'total' ? 'full' : 'deposit', returnUrl: tornada } }),
      );
      return { url: pagament.checkoutUrl };
    },
    estatRetencio: async (id) => {
      const retinguda = RentalHoldSchema.parse(await crida(`/holds/${encodeURIComponent(id)}`));
      const estat = ({ active: 'activa', expired: 'caducada', released: 'alliberada', converted: 'convertida' } as const)[retinguda.status];
      return { estat, ...(retinguda.booking && { codi: retinguda.booking.reference }) };
    },
    registrarParticipants: async () => {
      throw new ErrorReserva('noDisponible');
    },
    // Els preus del taller, del catàleg (`workshopServices`): un per peça, el primer que hi encaixi. Si
    // la botiga no n'ha posat cap, cap: la web no s'inventa preus.
    serveisTaller: async () => {
      const vistes = new Set<Peca>();
      return ((await cataleg()).workshopServices ?? []).flatMap((s) => {
        const peca = pecaDe(s);
        if (!peca || vistes.has(peca)) return [];
        vistes.add(peca);
        const amagat = s.priceHidden || s.priceBasis === 'on_request' || s.priceCents === null;
        return [
          serveiTaller.parse({ id: s.id, peca, preu: amagat ? null : s.priceCents, preuBase: amagat ? 'consultar' : s.priceBasis === 'from' ? 'desDe' : 'exacte', ficticia: false }),
        ];
      });
    },
    // Les hores i les cites, de l'API de cites. Sense la clau, no se'n fan veure: una cita que es
    // desés en memòria es perdria, i la plataforma és l'única agenda (també la dels agents).
    frangesTaller: async (dia) => {
      if (!clauCites) return null;
      const dies = (await horesLliures(dia)).days.find((d) => d.date === dia);
      if (!dies || dies.closed) return [];
      return dies.times.map((inici) => ({ inici, places: null }));
    },
    crearCitaTaller: async (entrada) => {
      const cita = citaTaller.parse(entrada);
      if (!clauCites) throw new ErrorReserva('noDisponible', 'falta la clau de cites de la plataforma');
      const { service } = await horesLliures(cita.dia);
      const feta = WebBookingResponseSchema.parse(
        await cridaCites('', {
          metode: 'POST',
          idempotencia: generaClau(),
          cos: {
            service: service.key,
            date: cita.dia,
            time: cita.hora,
            customer: { name: cita.nom, phone: cita.telefon, email: cita.correu },
            ...(cita.nota && { note: cita.nota }),
            details: { bici: cita.tipusBici, serveis: cita.serveis.join(', '), idioma: cita.idioma },
            privacyAccepted: true,
          },
        }),
      );
      return { codi: feta.reference, estat: feta.pendingConfirmation || feta.status === 'pending' ? 'pendent' : 'confirmada' };
    },
    // Els articles que la botiga ven amb el lloguer. Mentre no n'hi hagi cap, els de prova, que només
    // s'ensenyen al catàleg de nutrició (a la reserva, la nutrició és apagada: vegeu `ambNutricio`).
    nutricio: async () => {
      const { shopItems } = await cataleg();
      return shopItems.length ? shopItems.map(producteNutricioDe) : proves.nutricio();
    },
    productes: () => proves.productes(),
    // Els productes de venda de la plataforma (`saleProducts`). Mentre la botiga no n'hagi donat d'alta
    // cap d'una categoria, els de prova, que són de mostra i no ensenyen el preu.
    articles: async (categoria) => {
      const venda = ((await cataleg()).saleProducts ?? []).filter((p) => categoriaVendaDe(p.category) === categoria);
      return venda.length ? venda.map((p) => articleDe(p, categoria)) : proves.articles(categoria);
    },
    // Les bicis en venda del catàleg (categoria de bicis). Mentre la botiga no n'hagi donat d'alta cap, les
    // de mostra, que la pàgina marca com a tals.
    bicisVenda: async () => {
      const bicis = await bicisEnVenda();
      return bicis.length ? bicis : proves.bicisVenda();
    },
    biciVenda: async (id) => {
      const bicis = await bicisEnVenda();
      return bicis.length ? (bicis.find((b) => b.id === id) ?? null) : proves.biciVenda(id);
    },
    // La petició de contacte d'una bici en venda és una sol·licitud al panell de la botiga. Si la clau no
    // en pot desar (sense l'abast `web_request_write`), la fitxa no ensenya el formulari i demana que truquin.
    contacteVendaEnLinia: async () => {
      const ara = rellotge();
      if (permisSollicituds && ara < permisSollicituds.fins) return permisSollicituds.pot;
      let pot = false;
      try {
        const { estat, problema } = await cridaSollicitud();
        pot = estat === 422 && problema?.code === 'invalid_request';
        if (!pot) console.error(`La clau de la web no pot desar sol·licituds: ${estat} ${problema?.code ?? ''}`);
      } catch (e) {
        console.error('No es pot comprovar si la clau desa sol·licituds', e);
      }
      permisSollicituds = { pot, fins: ara + REVALIDA_S * 1000 };
      return pot;
    },
    enviarContacteVenda: async (entrada) => {
      const contacte = contacteVenda.parse(entrada);
      const trobada = (await bicisEnVendaAmbProducte()).find((b) => b.bici.id === contacte.biciId);
      if (!trobada) throw new ErrorReserva('dades', 'la bici no és en venda');
      // La marca davant del nom, si el nom no la porta ja («Orbea Oiz M30»).
      const { marca, nom: nomBici } = trobada.bici;
      const nom = marca && !nomBici.toLowerCase().startsWith(marca.toLowerCase()) ? `${marca} ${nomBici}` : nomBici;
      const cos = {
        kind: 'purchase',
        contact: { name: contacte.nom, phone: contacte.telefon, ...(contacte.correu && { email: contacte.correu }) },
        summary: `Interès per ${nom}${contacte.variant ? ` (${contacte.variant})` : ''}${contacte.missatge ? `: ${contacte.missatge}` : ''}`.slice(0, 2000),
        details: { producte: trobada.producteId, bici: nom, ...(contacte.variant && { variant: contacte.variant }), idioma: contacte.idioma },
        privacyAccepted: true,
      };
      const { estat, ok, json, problema } = await cridaSollicitud(cos, generaClau());
      if (ok) return { codi: WebRequestResponseSchema.parse(json).reference };
      const detall = problema ? [problema.field, problema.message].filter(Boolean).join(': ') : undefined;
      if (estat === 401 || problema?.code === 'key_not_bound') throw new ErrorReserva('noDisponible', detall);
      if (problema?.code === 'invalid_request' && problema.field?.startsWith('contact')) throw new ErrorReserva('dades', detall);
      throw new Error(`La plataforma ha respost ${estat} ${problema?.code ?? ''} a POST /api/public/requests${detall ? ` (${detall})` : ''}`);
    },
    valoracio: () => proves.valoracio(),
    ressenyes: () => proves.ressenyes(),
  };
}
