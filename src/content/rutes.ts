// Rutes de mostra des de la botiga. Les distàncies, els desnivells i els traçats són inventats
// (ficticia) fins que Tecnibike ens doni les seves rutes de debò.

export type Ruta = {
  id: 'gavarres' | 'fitor' | 'ardenya';
  km: number;
  desnivell: number;
  bici: string;
  /** Traçat estilitzat en un quadrat de 200×200 per al dibuix SVG, i el punt de sortida. */
  tracat: string;
  sortida: [number, number];
  ficticia: true;
};

export const rutes: Ruta[] = [
  {
    id: 'gavarres',
    km: 62,
    desnivell: 980,
    bici: 'Carretera disc',
    sortida: [30, 170],
    tracat: 'M30 170 C 40 120, 70 110, 80 80 S 120 30, 150 40 S 185 90, 165 120 S 120 150, 110 165 S 60 180, 30 170 Z',
    ficticia: true,
  },
  {
    id: 'fitor',
    km: 38,
    desnivell: 640,
    bici: 'Gravel',
    sortida: [25, 160],
    tracat: 'M25 160 L 60 140 C 80 128, 85 100, 105 92 S 150 70, 160 45 L 175 30 M160 45 C 140 80, 150 110, 120 130 S 70 165, 25 160',
    ficticia: true,
  },
  {
    id: 'ardenya',
    km: 24,
    desnivell: 720,
    bici: 'E-bike doble suspensió',
    sortida: [40, 175],
    tracat: 'M40 175 C 30 140, 60 130, 55 100 S 80 60, 100 70 S 120 110, 140 90 S 150 40, 175 30 M140 90 C 160 120, 150 150, 120 165 S 70 185, 40 175',
    ficticia: true,
  },
];
