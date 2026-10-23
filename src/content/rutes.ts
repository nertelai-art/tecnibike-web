import dades from './rutes.json';

// Rutes proposades des de la botiga. El traçat, la distància i el desnivell són reals: els calcula
// BRouter sobre OpenStreetMap (scripts/rutes.mjs). El que encara cal que Tecnibike validi és
// la tria de les rutes i la bici que hi recomanem.

export type IdRuta = 'gavarres' | 'fitor' | 'arques';

/** Punt del traçat: [longitud, latitud, alçada en metres]. */
export type Punt = [number, number, number];

export type Ruta = {
  id: IdRuta;
  perfil: string;
  metres: number;
  desnivell: number;
  punts: Punt[];
  /** Model de la flota que hi recomanem (id de la bici de lloguer). */
  bici: string;
  /** Color del traçat al mapa. */
  color: string;
};

const EXTRES: Record<IdRuta, Pick<Ruta, 'bici' | 'color'>> = {
  gavarres: { bici: 'carretera', color: '#3d5f9e' },
  fitor: { bici: 'gravel', color: '#f85a00' },
  arques: { bici: 'e-btt-doble', color: '#1f7a4d' },
};

export const rutes: Ruta[] = (dades as Omit<Ruta, 'bici' | 'color'>[]).map((ruta) => ({ ...ruta, ...EXTRES[ruta.id] }));

/** La botiga, punt de sortida de les rutes: [longitud, latitud]. */
export const BOTIGA: [number, number] = [3.1084, 41.8501];
