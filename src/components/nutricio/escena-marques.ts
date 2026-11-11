// Model de l'escena de marques de nutrició: amb el progrés del scroll (0–1) diu com està cada
// capítol (una marca) i cada producte. Pur: sense React ni DOM, i sense atzar ni rellotge.
//
// Cada marca té un tram igual del recorregut. Dins del seu tram, els productes entren de sota
// girant sobre si mateixos, es queden de cara gronxant-se una mica i surten per dalt girant, mentre
// ja entren els de la marca següent. La primera marca ja és mig entrada al principi i l'última no
// surt: al final del recorregut queda a lloc.

export type EstatProducte = {
  opacitat: number;
  /** Lloc al ventall: -1,5 … 1,5 amb quatre productes (la vista el multiplica pel pas). */
  x: number;
  /** Desplaçament vertical en % de l'alçada del producte. */
  y: number;
  /** Gir sobre si mateix (eix vertical), en graus. 0: de cara. */
  girY: number;
  /** Inclinació en el pla, en graus. */
  girZ: number;
  escala: number;
};

export type EstatCapitol = {
  /** Opacitat del text de la marca. */
  text: number;
  /** Desplaçament vertical del text, en px. */
  textY: number;
};

/** Fases dins del tram d'una marca (0–1 del tram). Se solapen amb les de la veïna. */
export const FASES = {
  entrada: [-0.12, 0.34],
  repos: [0.34, 0.62],
  sortida: [0.62, 1.02],
} as const;

/** Gir de gronxar-se en repòs: de cara (0) exactament al mig del tram. */
const GRONXA = 18;
const gronxa = (t: number) => {
  const g = clamp((t - 0.5) / 0.2, -1, 1);
  return g === 0 ? 0 : g * GRONXA;
};

const clamp = (v: number, min = 0, max = 1) => Math.min(max, Math.max(min, v));
const tram = (t: number, [a, b]: readonly [number, number]) => clamp((t - a) / (b - a));
const easeOutCubic = (t: number) => 1 - (1 - t) ** 3;
const easeInCubic = (t: number) => t ** 3;
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/** Progrés local (pot sortir de 0–1) d'una marca dins del recorregut. */
export function progresMarca(p: number, marca: number, total: number): number {
  return p * total - marca;
}

/** On va cada producte en repòs, segons quants n'hi ha: un ventall centrat. */
export function posicioRepos(index: number, quants: number): { x: number; y: number; girZ: number } {
  if (quants <= 1) return { x: 0, y: 0, girZ: 0 };
  const centrat = index - (quants - 1) / 2; // -1,5 … 1,5 amb quatre
  return { x: centrat, y: Math.abs(centrat) * 8 - 4, girZ: centrat * 5 };
}

/** L'estat d'un producte de la marca `marca` amb el progrés global `p`. */
export function estatProducte(p: number, marca: number, total: number, index: number, quants: number): EstatProducte {
  const t = progresMarca(p, marca, total);
  // Cada producte, una mica després de l'anterior.
  const retard = index * 0.05;
  const repos = posicioRepos(index, quants);
  const primera = marca === 0;
  const ultima = marca === total - 1;

  const entrada = primera ? 1 : easeOutCubic(tram(t - retard, FASES.entrada));
  const sortida = ultima ? 0 : easeInCubic(tram(t - retard, FASES.sortida));

  if (entrada >= 1 && sortida <= 0) {
    // En repòs: es gronxa una mica amb el scroll. Al centre del tram, exactament de cara.
    return { opacitat: 1, x: repos.x, y: repos.y, girY: gronxa(t), girZ: repos.girZ, escala: 1 };
  }
  if (sortida > 0) {
    return {
      opacitat: 1 - sortida,
      x: repos.x,
      y: lerp(repos.y, -140, sortida),
      girY: lerp(gronxa(FASES.sortida[0] + retard), gronxa(FASES.sortida[0] + retard) + 360, sortida),
      girZ: lerp(repos.girZ, repos.girZ * 3, sortida),
      escala: lerp(1, 0.85, sortida),
    };
  }
  return {
    opacitat: clamp(entrada * 1.6),
    x: repos.x,
    y: lerp(160, repos.y, entrada),
    girY: lerp(-540, gronxa(FASES.entrada[1] + retard), entrada),
    girZ: lerp(-repos.girZ * 2, repos.girZ, entrada),
    escala: lerp(0.8, 1, entrada),
  };
}

/** Com està el text d'una marca: apareix quan entren els productes i se'n va quan surten. */
export function estatCapitol(p: number, marca: number, total: number): EstatCapitol {
  const t = progresMarca(p, marca, total);
  const dins = marca === 0 ? 1 : clamp((t - 0.05) / 0.2);
  const fora = marca === total - 1 ? 0 : clamp((t - 0.75) / 0.15);
  return { text: Math.min(dins, 1 - fora), textY: (1 - dins) * 40 - fora * 40 };
}

/** La marca que mana en aquest punt (la del fons i l'indicador). */
export function marcaActiva(p: number, total: number): number {
  return Math.min(total - 1, Math.max(0, Math.floor(p * total + 0.1)));
}
