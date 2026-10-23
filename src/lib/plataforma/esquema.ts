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

// ── Reserves (el que la web envia) ──────────────────────────────────────────────────────────

const data = z.string().regex(/^\d{4}-\d{2}-\d{2}$/);
const telefon = z.string().trim().regex(/^\+?[\d\s().-]{9,20}$/);

export const accessori = z.enum(['casc', 'cadenat', 'cadiraNado', 'alforges', 'comptaquilometres']);
export const pedals = z.enum(['plans', 'spd', 'spdSl', 'look']);
export const durada = z.discriminatedUnion('tipus', [
  z.object({ tipus: z.literal('dies'), dies: z.number().int().min(1).max(30) }),
  z.object({ tipus: z.literal('migDia') }),
]);

const client = {
  nom: z.string().trim().min(2).max(80),
  telefon,
  correu: z.email(),
  idioma: z.enum(['ca', 'es', 'en', 'fr']),
  privacitat: z.literal(true),
};

export const reservaLloguer = z.object({
  biciId: z.string(),
  talla: z.string(),
  pedals,
  recollida: data,
  durada,
  bicis: z.number().int().min(1).max(5),
  accessoris: z.array(accessori).max(5),
  ...client,
});

export const franjaTaller = z.object({ inici: z.string().regex(/^\d{2}:\d{2}$/), places: z.number().int().nonnegative() });

export const citaTaller = z.object({
  tipusBici: z.enum(['carretera', 'muntanya', 'gravel', 'electrica', 'urbana']),
  serveis: z.array(peca).min(1),
  nota: z.string().trim().max(500).optional(),
  dia: data,
  hora: z.string().regex(/^\d{2}:\d{2}$/),
  ...client,
});

export const confirmacio = z.object({ codi: z.string(), totalCentims: z.number().int().optional() });

export type Accessori = z.infer<typeof accessori>;
export type Pedals = z.infer<typeof pedals>;
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
export type Valoracio = z.infer<typeof valoracio>;
