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

export function colorSabor(id: string): string {
  return COLORS_SABOR[id] ?? '#9aa5b1';
}

/** Les marques en l'ordre de la secció, com els expositors de la botiga d'esquerra a dreta. */
export const ORDRE_MARQUES = ['Maurten', '226ERS', 'Nutrinovex', 'SiS'] as const;

/** La foto d'un producte en un sabor: la del sabor si l'envàs canvia, si no la del producte. */
export function imatgeDe(producte: { imatge?: string; sabors: readonly { id: string; imatge?: string }[] }, sabor: string): string | undefined {
  return producte.sabors.find((s) => s.id === sabor)?.imatge ?? producte.imatge;
}

/** Els productes que surten a l'escena d'una marca: com a molt `quants`, primer un de cada tipus. */
export function destacats<T extends { tipus: string }>(productes: readonly T[], quants = 4): T[] {
  const vistos = new Set<string>();
  const unDeCada = productes.filter((p) => !vistos.has(p.tipus) && vistos.add(p.tipus));
  return [...unDeCada, ...productes.filter((p) => !unDeCada.includes(p))].slice(0, quants);
}
