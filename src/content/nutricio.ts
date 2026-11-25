// Aspecte de les marques de nutrició i dels sabors, per a la il·lustració dels paquets i la secció de
// la portada. Els colors són els dominants del packaging i dels expositors de cada marca a la botiga
// (fotos del client, 11-11-2026, i les webs de les marques, docs/nutricio-productes.md). No són els
// seus logos ni les seves fotos: és una il·lustració pròpia, que no reprodueix cap disseny de paquet.

export type TemaMarca = {
  /** El color de l'expositor i del fons de la marca. */
  fons: string;
  /** El text sobre `fons`. */
  text: string;
  /** El que ressalta: etiquetes, punts, la vora de la targeta triada. */
  accent: string;
  /** El paquet: color del plàstic i de la lletra. */
  paquet: string;
  tinta: string;
  /** Una línia sobre què la fa diferent, als missatges: `nutricio.marques.<clau>`. */
  clau: string;
};

const NEUTRE: TemaMarca = { fons: '#1c1f24', text: '#ffffff', accent: '#f85a00', paquet: '#f4f5f7', tinta: '#121417', clau: 'altres' };

export const TEMES_MARCA: Record<string, TemaMarca> = {
  // Monocrom: negre #050505 i blanc trencat #FAFAFA, com la seva web i l'expositor.
  Maurten: { fons: '#050505', text: '#fafafa', accent: '#fafafa', paquet: '#fafafa', tinta: '#050505', clau: 'maurten' },
  // Negre i blanc, amb el taronja #F18700 de la web; el color el posen els sabors.
  '226ERS': { fons: '#000000', text: '#ffffff', accent: '#f18700', paquet: '#ffffff', tinta: '#000000', clau: '226ers' },
  // El blau de marca #0044BE, el de l'expositor i dels paquets.
  Nutrinovex: { fons: '#0044be', text: '#ffffff', accent: '#8fd3ff', paquet: '#ffffff', tinta: '#0044be', clau: 'nutrinovex' },
  // Negre #1A1919 amb el groc #F8D930 de la web i dels prestatges de la botiga.
  SiS: { fons: '#1a1919', text: '#ffffff', accent: '#f8d930', paquet: '#262525', tinta: '#ffffff', clau: 'sis' },
};

export function temaDe(marca: string): TemaMarca {
  return TEMES_MARCA[marca] ?? NEUTRE;
}

/** El color de cada sabor, per a la franja del paquet i el punt del selector. */
const COLORS_SABOR: Record<string, string> = {
  neutre: '#cfd3d8',
  civada: '#d8c39a',
  cacau: '#6d4c41',
  poma: '#9ccc3c',
  pomaVerda: '#7cb342',
  mentol: '#7fd8c8',
  speculoos: '#b9773e',
  xocolataDubai: '#7a9a3a',
  maduixaSalada: '#e85a76',
  platan: '#f7d54a',
  xocolataBlancaMaduixa: '#f4b6c2',
  ametllesLlavors: '#c9a27a',
  mangoMandarina: '#ff9f1c',
  maduixaKiwi: '#e04f6f',
  llimaLlimona: '#c6d93a',
  gerdLlimona: '#d63c6a',
  herbasanaRegalessia: '#4a7d5c',
  citric: '#ffc93c',
  eucaliptusMentol: '#5fb3a1',
  llimonaMenta: '#b5d96b',
  pomeloRosat: '#f28b82',
  maduixaLlima: '#e8566f',
  maduixa: '#e8365d',
  llimona: '#f2d43a',
  llima: '#7cc242',
  salat: '#9aa5b1',
  cafe: '#6b4226',
  cola: '#5a2a1c',
  sindria: '#f0566e',
  xocolata: '#5b3a29',
  xocolataNegra: '#3b2418',
  vainilla: '#f1dfa8',
  platanGingebre: '#f5c842',
  pomaCanyella: '#c8a165',
  fruitsVermells: '#c2185b',
  taronja: '#f68b1f',
  tropical: '#ffb000',
  variat: '#8fa3d9',
};

const GRIS = '#9aa5b1';

/**
 * Paraules de cada sabor en català, castellà, anglès i francès (sense accents ni majúscules), per als
 * sabors de la plataforma, que tenen un id intern i només el nom que hi escriu la botiga.
 */
const PARAULES_SABOR: [RegExp, string][] = [
  [/poma verda|manzana verde|green apple|pomme verte/, 'pomaVerda'],
  [/neutr|sense sabor|sin sabor|unflavou?red|nature/, 'neutre'],
  [/cola/, 'cola'],
  [/cafe|coffee|expresso|espresso/, 'cafe'],
  [/sindria|sandia|watermelon|pasteque/, 'sindria'],
  [/maduixa|fresa|strawberr|fraise/, 'maduixa'],
  [/llimona|limon|lemon|citron/, 'llimona'],
  [/llima|lima|lime/, 'llima'],
  [/mango|mangue/, 'mangoMandarina'],
  [/taronja|naranja|orange|mandarin|tangerin/, 'taronja'],
  [/gerd|frambues|raspberr|framboise/, 'gerdLlimona'],
  [/fruits vermells|frutos rojos|red berr|fruits rouges|berr|baies/, 'fruitsVermells'],
  [/pomelo|grapefruit|pamplemousse/, 'pomeloRosat'],
  [/poma|manzana|apple|pomme/, 'poma'],
  [/platan|banan/, 'platan'],
  [/xocolata negra|chocolate negro|dark chocolate|chocolat noir/, 'xocolataNegra'],
  [/xocolata|chocolate|chocolat/, 'xocolata'],
  [/cacau|cacao|cocoa/, 'cacau'],
  [/vainilla|vanill/, 'vainilla'],
  [/eucalipt|eucalypt/, 'eucaliptusMentol'],
  [/menta|mint|menthe|mentol|menthol/, 'mentol'],
  [/regalessia|regaliz|liquorice|licorice|reglisse/, 'herbasanaRegalessia'],
  [/civada|avena|oat|avoine/, 'civada'],
  [/ametll|almendra|almond|amande/, 'ametllesLlavors'],
  [/canyella|canela|cinnamon|cannelle/, 'pomaCanyella'],
  [/gingebre|jengibre|ginger|gingembre/, 'platanGingebre'],
  [/citric|citrus|agrume/, 'citric'],
  [/tropical|pinya|pina|pineapple|ananas/, 'tropical'],
  [/salat|salad|salty|sale/, 'salat'],
  [/variat|variado|mixed|assorti/, 'variat'],
];

/**
 * El color d'un sabor: pel seu id (el catàleg de prova) o, si no el coneix, pel nom (els sabors de la
 * plataforma). Amb dos sabors al nom («Mango i mandarina»), mana el que surt primer. Si no, gris.
 */
export function colorSabor(id: string, nom?: string): string {
  const perId = COLORS_SABOR[id];
  if (perId) return perId;
  if (!nom) return GRIS;
  const net = nom
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
  // El nom d'un sabor conegut («Maduixa i kiwi» → maduixaKiwi) té el seu color exacte.
  const paraules = net.split(/[^a-z]+/).filter((w) => w && !['i', 'y', 'and', 'et', 'amb', 'con', 'with', 'avec'].includes(w));
  const exacte = COLORS_SABOR[paraules.map((w, i) => (i ? w[0]!.toUpperCase() + w.slice(1) : w)).join('')];
  if (exacte) return exacte;
  let millor: { pos: number; llarg: number; clau: string } | null = null;
  for (const [patro, clau] of PARAULES_SABOR) {
    const m = patro.exec(net);
    if (!m) continue;
    const candidat = { pos: m.index, llarg: m[0].length, clau };
    if (!millor || candidat.pos < millor.pos || (candidat.pos === millor.pos && candidat.llarg > millor.llarg)) millor = candidat;
  }
  return millor ? COLORS_SABOR[millor.clau]! : GRIS;
}

/** Les marques en l'ordre de la secció, com els expositors de la botiga d'esquerra a dreta. */
export const ORDRE_MARQUES = ['Maurten', '226ERS', 'Nutrinovex', 'SiS'] as const;

/** La foto d'un producte en un sabor: la del sabor si l'envàs canvia, si no la del producte. */
export function imatgeDe(producte: { imatge?: string; sabors: readonly { id: string; imatge?: string }[] }, sabor: string): string | undefined {
  return producte.sabors.find((s) => s.id === sabor)?.imatge ?? producte.imatge;
}

/**
 * La descripció d'un producte: la que porta (la de la plataforma) o, si és dels de prova, la dels
 * missatges (`nutricio.productes.<id>`). Un article de la plataforma sense descripció no en té cap.
 */
export function descripcioDe(
  producte: { id: string; descripcio?: string },
  t: { (clau: string): string; has(clau: string): boolean },
): string | null {
  if (producte.descripcio) return producte.descripcio;
  const clau = `productes.${producte.id}`;
  return t.has(clau) ? t(clau) : null;
}

/** Els productes que surten a l'escena d'una marca: com a molt `quants`, primer un de cada tipus. */
export function destacats<T extends { tipus: string }>(productes: readonly T[], quants = 4): T[] {
  const vistos = new Set<string>();
  const unDeCada = productes.filter((p) => !vistos.has(p.tipus) && vistos.add(p.tipus));
  return [...unDeCada, ...productes.filter((p) => !unDeCada.includes(p))].slice(0, quants);
}
