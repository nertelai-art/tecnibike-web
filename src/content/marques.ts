// Marques que treballa la botiga, agrupades com a la web antiga del client. Els logos són a
// public/img/marques: els SVG són de Wikimedia Commons (domini públic) i els WebP surten de la web
// antiga de Tecnibike, retallats. Sense logo (el que hi havia de SiS era el d'un altre producte), es
// pinta el nom.

export const CATEGORIES_MARCA = ['bicis', 'components', 'equipament', 'nutricio'] as const;
export type CategoriaMarca = (typeof CATEGORIES_MARCA)[number];

export const TIPUS_MARCA = ['bicis', 'quadres', 'pedals', 'grups', 'pneumatics', 'manteniment', 'portabicis', 'cascs', 'ulleres', 'roba', 'sabates', 'nutricio'] as const;
export type TipusMarca = (typeof TIPUS_MARCA)[number];

export type Marca = {
  nom: string;
  logo?: string;
  categoria: CategoriaMarca;
  tipus: TipusMarca[];
};

export const MARQUES: Marca[] = [
  { nom: 'Pinarello', logo: 'pinarello.svg', categoria: 'bicis', tipus: ['bicis'] },
  { nom: 'Colnago', logo: 'colnago.svg', categoria: 'bicis', tipus: ['bicis'] },
  { nom: 'Cannondale', logo: 'cannondale.svg', categoria: 'bicis', tipus: ['bicis'] },
  { nom: 'Scott', logo: 'scott.svg', categoria: 'bicis', tipus: ['bicis'] },
  { nom: 'Specialized', logo: 'specialized.svg', categoria: 'bicis', tipus: ['bicis'] },
  { nom: 'Look', logo: 'look.svg', categoria: 'bicis', tipus: ['quadres', 'pedals'] },

  { nom: 'Shimano', logo: 'shimano.svg', categoria: 'components', tipus: ['grups', 'pedals'] },
  { nom: 'SRAM', logo: 'sram.svg', categoria: 'components', tipus: ['grups'] },
  { nom: 'Continental', logo: 'continental.webp', categoria: 'components', tipus: ['pneumatics'] },
  { nom: 'Pirelli', logo: 'pirelli.svg', categoria: 'components', tipus: ['pneumatics'] },
  { nom: 'Muc-Off', logo: 'mucoff.webp', categoria: 'components', tipus: ['manteniment'] },
  { nom: 'X-Sauce', logo: 'xsauce.webp', categoria: 'components', tipus: ['manteniment'] },
  { nom: 'Thule', logo: 'thule.svg', categoria: 'components', tipus: ['portabicis'] },

  { nom: 'POC', logo: 'poc.webp', categoria: 'equipament', tipus: ['cascs', 'ulleres'] },
  { nom: 'Kask', logo: 'kask.webp', categoria: 'equipament', tipus: ['cascs'] },
  { nom: 'Oakley', logo: 'oakley.svg', categoria: 'equipament', tipus: ['ulleres'] },
  { nom: 'Bliz', logo: 'bliz.webp', categoria: 'equipament', tipus: ['ulleres'] },
  { nom: 'Eassun', logo: 'eassun.webp', categoria: 'equipament', tipus: ['cascs', 'ulleres'] },
  { nom: 'Assos', logo: 'assos.webp', categoria: 'equipament', tipus: ['roba'] },
  { nom: 'Gobik', logo: 'gobik.webp', categoria: 'equipament', tipus: ['roba'] },
  { nom: 'Pissei', logo: 'pissei.webp', categoria: 'equipament', tipus: ['roba'] },
  { nom: 'DMT', logo: 'dmt.webp', categoria: 'equipament', tipus: ['sabates'] },

  { nom: 'Maurten', logo: 'maurten.webp', categoria: 'nutricio', tipus: ['nutricio'] },
  { nom: '226ERS', logo: '226ers.webp', categoria: 'nutricio', tipus: ['nutricio'] },
  { nom: 'SiS', categoria: 'nutricio', tipus: ['nutricio'] },
  { nom: 'Nutrinovex', logo: 'nutrinovex.webp', categoria: 'nutricio', tipus: ['nutricio'] },
];

export function marquesDeTipus(tipus: TipusMarca): Marca[] {
  return MARQUES.filter((m) => m.tipus.includes(tipus));
}
