import { z } from 'zod';

// Esquema del domini que la web llegeix de la plataforma. Els tipus en deriven: no s'escriuen a
// mà. Quan app.nertel.ai publiqui la seva API per a webs, aquest fitxer s'ha de generar o
// validar contra el seu contracte.

/** Import en cèntims d'euro, sempre enter. */
const centims = z.number().int().nonnegative();

export const categoriaLloguer = z.enum(['muntanya', 'carretera', 'gravel', 'passeig']);

export const tarifa = z.object({
  dia: centims,
  migDia: centims.optional(),
  de2a6: centims.optional(),
  mesDe6: centims.optional(),
});

export const biciLloguer = z.object({
  id: z.string(),
  nom: z.string(),
  categoria: categoriaLloguer,
  electrica: z.boolean(),
  imatge: z.string(),
  talles: z.array(z.string()).min(1),
  tarifa,
  /** Model concret de la flota. Mentre el client no ens el doni, és inventat. */
  model: z.object({ valor: z.string(), ficticia: z.boolean() }),
});

/** Peça de la bici de l'escena d'anatomia a la qual pertany un servei. */
export const peca = z.enum(['transmissio', 'frens', 'rodes', 'direccio', 'seient', 'quadre']);

export const serveiTaller = z.object({
  id: z.string(),
  peca,
  desDe: centims,
  /** Dies laborables habituals. */
  dies: z.number().int().positive(),
  ficticia: z.boolean(),
});

/** Producte de la botiga (accessori o recanvi) que millora una peça de la bici. */
export const producte = z.object({
  id: z.string(),
  peca,
  marca: z.string(),
  nom: z.string(),
  preu: centims,
  ficticia: z.boolean(),
});

/** Categoria de la botiga d'equipament (casc, roba, nutrició…). */
export const categoriaEquipament = z.enum(['cascs', 'ulleres', 'roba', 'sabates', 'nutricio', 'accessoris']);

/** Article de la botiga d'equipament: el que es vendrà en línia quan la plataforma ho permeti. */
export const article = z.object({
  id: z.string(),
  categoria: categoriaEquipament,
  marca: z.string(),
  nom: z.string(),
  preu: centims,
  ficticia: z.boolean(),
});

export const ressenya = z.object({
  autor: z.string(),
  estrelles: z.number().int().min(1).max(5),
  text: z.string(),
  quan: z.string(),
});

export const valoracio = z.object({
  mitjana: z.number(),
  total: z.number().int(),
  font: z.literal('google'),
});

// ── Horari de la botiga ─────────────────────────────────────────────────────────────────────

const data = z.string().regex(/^\d{4}-\d{2}-\d{2}$/);
const hora = z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/);

export const blocHorari = z.object({ obre: hora, tanca: hora });
/** Blocs d'obertura de cada dia de la setmana: índex 0 diumenge … 6 dissabte. */
const setmana = z.array(z.array(blocHorari)).length(7);

export const horariBotiga = z.object({
  setmana,
  /** Temporades amb un altre horari (estiu, Setmana Santa…), dates incloses. */
  periodes: z.array(z.object({ des: data, fins: data, setmana })),
  /** Dies que la botiga tanca encara que li toqui obrir (festius, vacances). */
  tancats: z.array(z.object({ dia: data, ficticia: z.boolean() })),
  /** Cada quants minuts es pot recollir o tornar una bici. */
  pasMinuts: z.number().int().positive(),
});

// ── Extres del lloguer ──────────────────────────────────────────────────────────────────────

/** Una variant d'un extra (la talla d'un casc): el nom que es tria i les unitats, si se'n porta el compte. */
export const varianteExtra = z.object({
  nom: z.string().trim().min(1).max(40),
  estoc: z.number().int().nonnegative().nullable(),
});

/**
 * Pedals, casc, cadenat… Els pedals són un grup obligatori (se'n tria un per bici); la resta,
 * opcionals.
 */
export const extra = z.object({
  id: z.string(),
  grup: z.enum(['pedals', 'extres']),
  /** El nom que hi ha posat la botiga. Sense, el nom surt dels missatges de la web per l'`id`. */
  nom: z.string().optional(),
  /** El grup d'opcions de la plataforma: dels extres d'un mateix grup se'n pot triar un com a molt. */
  grupId: z.string().optional(),
  imatge: z.string().optional(),
  preu: centims,
  cobrament: z.enum(['perReserva', 'perDia']),
  /**
   * Unitats que té la botiga; `null` si no se'n porta el compte o no se sap (la plataforma no diu el
   * total). El que queda lliure per a unes dates surt de `disponibilitat`.
   */
  estoc: z.number().int().nonnegative().nullable(),
  /** Si en té (talles d'un casc), cal triar-ne una en afegir l'extra. */
  variants: z.array(varianteExtra).optional(),
  ficticia: z.boolean(),
});

// ── Nutrició esportiva ──────────────────────────────────────────────────────────────────────

/** Quan es pren: abans de sortir, durant la ruta o després, per recuperar. */
export const momentNutricio = z.enum(['abans', 'durant', 'despres']);
export const tipusNutricio = z.enum(['gel', 'barreta', 'beguda', 'pastilles', 'gominoles', 'recuperacio', 'shot']);

/** Un sabor d'un producte, amb les unitats que en queden a la botiga (`null` si no se'n porta el compte). */
export const saborNutricio = z.object({
  id: z.string().min(1).max(40),
  /** El nom que hi ha posat la botiga. Sense, surt dels missatges de la web per l'`id`. */
  nom: z.string().optional(),
  /** La foto d'aquest sabor, si l'envàs canvia. Sense, la del producte. */
  imatge: z.string().optional(),
  estoc: z.number().int().nonnegative().nullable(),
});

/**
 * Gel, barreta, beguda… de la botiga, que es pot afegir a una reserva de lloguer. És un producte que
 * es ven i es consumeix: l'estoc no torna quan s'acaba el lloguer.
 */
export const producteNutricio = z.object({
  id: z.string(),
  marca: z.string(),
  nom: z.string(),
  tipus: tipusNutricio,
  moments: z.array(momentNutricio).min(1),
  /** El format de venda: «40 g», «sobre de 80 g», «tub de 20 pastilles». */
  format: z.string(),
  carbohidratsG: z.number().nonnegative().optional(),
  cafeinaMg: z.number().nonnegative().optional(),
  /** El text de la botiga. Sense, surt dels missatges de la web per l'`id`. */
  descripcio: z.string().optional(),
  imatge: z.string().optional(),
  /** Preu per unitat. */
  preu: centims,
  sabors: z.array(saborNutricio).min(1),
  ficticia: z.boolean(),
});

/** Una línia de nutrició de la reserva: és de la reserva sencera, no d'una bici. */
export const liniaNutricio = z.object({
  producteId: z.string().min(1),
  sabor: z.string().min(1).max(40),
  quantitat: z.number().int().min(1).max(10),
});

// ── Reserves (el que la web envia) ──────────────────────────────────────────────────────────

const telefon = z.string().trim().regex(/^\+?[\d\s().-]{9,20}$/);

export const durada = z.discriminatedUnion('tipus', [
  z.object({ tipus: z.literal('dies'), dies: z.number().int().min(1).max(30) }),
  z.object({ tipus: z.literal('migDia') }),
]);

export const moment = z.object({ dia: data, hora });

const client = {
  nom: z.string().trim().min(2).max(80),
  telefon,
  correu: z.email(),
  idioma: z.enum(['ca', 'es', 'en', 'fr']),
  privacitat: z.literal(true),
};

/** Qui farà servir la bici: amb l'alçada se suggereix la talla i la bici es prepara a mida. */
export const ciclista = z.object({
  nom: z.string().trim().max(60).optional(),
  alcadaCm: z.number().int().min(100).max(220).optional(),
  /** Alçada del seient (de l'eix del pedaler a dalt del seient), si ja la sap. */
  alcadaSeientCm: z.number().int().min(50).max(100).optional(),
});

/** Una bici de la reserva. Totes comparteixen les dates i la botiga. */
export const biciReserva = z.object({
  biciId: z.string(),
  talla: z.string(),
  /** Id de l'extra del grup «pedals». Res si la botiga no en té cap de configurat. */
  pedals: z.string().min(1).optional(),
  extres: z.array(z.string()).max(8),
  /** La variant triada de cada extra que en té (la talla del casc), per l'id de l'extra. */
  variants: z.record(z.string(), z.string().trim().min(1).max(40)).optional(),
  ciclista,
});

export const reservaLloguer = z.object({
  recollida: moment,
  retorn: moment,
  bicis: z.array(biciReserva).min(1).max(8),
  /** Gels, barretes i begudes per a la ruta, de la reserva sencera. */
  nutricio: z.array(liniaNutricio).max(20).optional(),
  comentaris: z.string().trim().max(500).optional(),
  ...client,
});

export const franjaTaller = z.object({ inici: hora, places: z.number().int().nonnegative() });

export const citaTaller = z.object({
  tipusBici: z.enum(['carretera', 'muntanya', 'gravel', 'electrica', 'urbana']),
  serveis: z.array(peca).min(1),
  nota: z.string().trim().max(500).optional(),
  dia: data,
  hora,
  ...client,
});

export const confirmacio = z.object({
  codi: z.string(),
  totalCentims: z.number().int().optional(),
  /** Una reserva de lloguer pot quedar pendent que la botiga la confirmi. */
  estat: z.enum(['pendent', 'confirmada']).optional(),
});

// ── Pagament i participants (preparats, apagats fins que la plataforma ho permeti) ─────────────

export const modalitatPagament = z.enum(['senyal', 'total']);

export const configuracioReserves = z.object({
  pagament: z.object({
    actiu: z.boolean(),
    /** Senyal (un percentatge ara i la resta a la botiga) o tot per avançat. */
    modalitats: z.array(modalitatPagament).min(1),
    senyalPercent: z.number().int().min(1).max(100),
  }),
  /** Dades de cada ciclista i signatura del contracte abans de recollir. */
  participants: z.object({ actiu: z.boolean() }),
  /** Afegir nutrició a la reserva: només quan la plataforma en porta l'estoc. */
  nutricio: z.object({ actiu: z.boolean() }),
  /** Quant temps es guarden les bicis mentre es paga. */
  retencioMinuts: z.number().int().positive(),
  /** Amb quanta antelació, com a mínim, s'ha de reservar: abans d'això no s'ofereix cap hora. */
  antelacioMinuts: z.number().int().min(0),
});

/** Bicis i extres guardats mentre el client paga. Si caduca, tornen a estar lliures. */
export const retencio = z.object({
  id: z.string(),
  caducaA: z.iso.datetime(),
  totalCentims: centims,
});

export const participant = z.object({
  nom: z.string().trim().min(2).max(80),
  document: z.string().trim().min(5).max(20),
  /** Signatura feta amb el dit o el ratolí, en PNG. */
  signatura: z.string().max(300_000).regex(/^data:image\/png;base64,[A-Za-z0-9+/=]+$/),
});

export const participantsReserva = z.object({
  codi: z.string(),
  participants: z.array(participant).min(1).max(8),
  condicions: z.literal(true),
});

export type BlocHorari = z.infer<typeof blocHorari>;
export type HorariBotiga = z.infer<typeof horariBotiga>;
export type Extra = z.infer<typeof extra>;
export type VarianteExtra = z.infer<typeof varianteExtra>;
export type MomentNutricio = z.infer<typeof momentNutricio>;
export type TipusNutricio = z.infer<typeof tipusNutricio>;
export type SaborNutricio = z.infer<typeof saborNutricio>;
export type ProducteNutricio = z.infer<typeof producteNutricio>;
export type LiniaNutricio = z.infer<typeof liniaNutricio>;
export type Moment = z.infer<typeof moment>;
export type Ciclista = z.infer<typeof ciclista>;
export type BiciReserva = z.infer<typeof biciReserva>;
export type ConfiguracioReserves = z.infer<typeof configuracioReserves>;
export type ModalitatPagament = z.infer<typeof modalitatPagament>;
export type Retencio = z.infer<typeof retencio>;
export type Participant = z.infer<typeof participant>;
export type ParticipantsReserva = z.infer<typeof participantsReserva>;

export type Durada = z.infer<typeof durada>;
export type ReservaLloguer = z.infer<typeof reservaLloguer>;
export type FranjaTaller = z.infer<typeof franjaTaller>;
export type CitaTaller = z.infer<typeof citaTaller>;
export type Confirmacio = z.infer<typeof confirmacio>;

export type CategoriaLloguer = z.infer<typeof categoriaLloguer>;
export type Tarifa = z.infer<typeof tarifa>;
export type BiciLloguer = z.infer<typeof biciLloguer>;
export type Peca = z.infer<typeof peca>;
export type ServeiTaller = z.infer<typeof serveiTaller>;
export type Ressenya = z.infer<typeof ressenya>;
export type Producte = z.infer<typeof producte>;
export type CategoriaEquipament = z.infer<typeof categoriaEquipament>;
export type Article = z.infer<typeof article>;
export type Valoracio = z.infer<typeof valoracio>;
