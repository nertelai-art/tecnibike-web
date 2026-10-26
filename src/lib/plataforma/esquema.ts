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

/**
 * Pedals, casc, cadenat… El nom de cada extra surt dels missatges de la web per l'`id`. Els pedals
 * són un grup obligatori (se'n tria un per bici); la resta, opcionals.
 */
export const extra = z.object({
  id: z.string(),
  grup: z.enum(['pedals', 'extres']),
  imatge: z.string().optional(),
  preu: centims,
  cobrament: z.enum(['perReserva', 'perDia']),
  /** Unitats que té la botiga; `null` si no se'n porta el compte (p. ex. «porto els meus pedals»). */
  estoc: z.number().int().nonnegative().nullable(),
  ficticia: z.boolean(),
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
  /** Id de l'extra del grup «pedals». */
  pedals: z.string(),
  extres: z.array(z.string()).max(8),
  ciclista,
});

export const reservaLloguer = z.object({
  recollida: moment,
  retorn: moment,
  bicis: z.array(biciReserva).min(1).max(8),
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

export const confirmacio = z.object({ codi: z.string(), totalCentims: z.number().int().optional() });

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
  /** Quant temps es guarden les bicis mentre es paga. */
  retencioMinuts: z.number().int().positive(),
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
