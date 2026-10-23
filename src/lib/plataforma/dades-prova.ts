import type { Accessori, BiciLloguer, Producte, Ressenya, ServeiTaller, Valoracio } from './esquema';

// Dades de la implementació de proves. Les tarifes són les oficials del PDF de 2026; el que porta
// `ficticia: true` és inventat perquè es vegi com queda i no es pot publicar sense confirmar-ho.

const TALLES_MTB = ['XS', 'S', 'M', 'L', 'XL'];
const TALLES_CARRETERA = ['48', '51', '54', '56', '58'];

export const flota: BiciLloguer[] = [
  {
    id: 'btt',
    nom: 'BTT',
    categoria: 'muntanya',
    electrica: false,
    imatge: '/img/flota/btt.png',
    talles: TALLES_MTB,
    tarifa: { dia: 2800, de2a6: 2520, mesDe6: 2100 },
    model: { valor: 'Cannondale Trail 5', ficticia: true },
  },
  {
    id: 'e-btt',
    nom: 'E-bike rígida',
    categoria: 'muntanya',
    electrica: true,
    imatge: '/img/flota/e-btt.png',
    talles: TALLES_MTB,
    tarifa: { dia: 4000, de2a6: 3000 },
    model: { valor: 'Cannondale Trail Neo 4', ficticia: true },
  },
  {
    id: 'e-btt-doble',
    nom: 'E-bike doble suspensió',
    categoria: 'muntanya',
    electrica: true,
    imatge: '/img/flota/e-btt-doble.png',
    talles: ['S', 'M', 'L', 'XL'],
    tarifa: { dia: 5500, migDia: 4200, de2a6: 4800, mesDe6: 3900 },
    model: { valor: 'Cannondale Moterra Neo', ficticia: true },
  },
  {
    id: 'carretera',
    nom: 'Carretera disc',
    categoria: 'carretera',
    electrica: false,
    imatge: '/img/flota/carretera.jpg',
    talles: TALLES_CARRETERA,
    tarifa: { dia: 3500, de2a6: 2800 },
    model: { valor: 'Pinarello X3 · Shimano 105', ficticia: true },
  },
  {
    id: 'carretera-di2',
    nom: 'Carretera disc Di2',
    categoria: 'carretera',
    electrica: false,
    imatge: '/img/flota/carretera-di2.png',
    talles: TALLES_CARRETERA,
    tarifa: { dia: 6500, de2a6: 5500 },
    // La foto de la web antiga és una Trek: el model inventat ha de quadrar amb la foto.
    model: { valor: 'Trek Domane · Ultegra Di2', ficticia: true },
  },
  {
    id: 'e-carretera',
    nom: 'E-carretera',
    categoria: 'carretera',
    electrica: true,
    imatge: '/img/flota/e-carretera.png',
    talles: ['S', 'M', 'L', 'XL'],
    tarifa: { dia: 4000, de2a6: 3000 },
    model: { valor: 'Cannondale Synapse Neo', ficticia: true },
  },
  {
    id: 'gravel',
    nom: 'Gravel',
    categoria: 'gravel',
    electrica: false,
    imatge: '/img/flota/gravel.png',
    talles: TALLES_MTB,
    tarifa: { dia: 3500, de2a6: 2800 },
    model: { valor: 'Cannondale Topstone 3', ficticia: true },
  },
  {
    id: 'e-gravel',
    nom: 'E-gravel',
    categoria: 'gravel',
    electrica: true,
    imatge: '/img/flota/e-carretera.png',
    talles: ['S', 'M', 'L', 'XL'],
    tarifa: { dia: 4000, de2a6: 3000 },
    model: { valor: 'Cannondale Topstone Neo', ficticia: true },
  },
  {
    id: 'urbana',
    nom: 'Urbana',
    categoria: 'passeig',
    electrica: false,
    imatge: '/img/flota/urbana.png',
    talles: ['S', 'M', 'L'],
    tarifa: { dia: 1200, de2a6: 1020, mesDe6: 900 },
    model: { valor: 'Urbana de quadre baix', ficticia: true },
  },
  {
    id: 'e-urbana',
    nom: 'E-urbana',
    categoria: 'passeig',
    electrica: true,
    imatge: '/img/flota/e-urbana.png',
    talles: ['S', 'M', 'L'],
    tarifa: { dia: 3800, de2a6: 3000 },
    model: { valor: 'Cannondale Mavaro Neo', ficticia: true },
  },
];

/** Preu de cada accessori per bici i per reserva. Inventats: el casc inclòs és una suposició. */
export const preusAccessoris: Record<Accessori, number> = {
  casc: 0,
  cadenat: 300,
  cadiraNado: 800,
  alforges: 600,
  comptaquilometres: 400,
};

/** Tots els preus i terminis del taller són inventats: no n'hi ha cap llista publicada. */
export const serveisTaller: ServeiTaller[] = [
  { id: 'transmissio', peca: 'transmissio', desDe: 1500, dies: 1, ficticia: true },
  { id: 'frens', peca: 'frens', desDe: 2000, dies: 1, ficticia: true },
  { id: 'rodes', peca: 'rodes', desDe: 1200, dies: 1, ficticia: true },
  { id: 'direccio', peca: 'direccio', desDe: 1800, dies: 1, ficticia: true },
  { id: 'seient', peca: 'seient', desDe: 6000, dies: 1, ficticia: true },
  { id: 'quadre', peca: 'quadre', desDe: 6900, dies: 2, ficticia: true },
];

/**
 * Productes de la botiga per peça. Les marques són les que Tecnibike té a la web i a l'Instagram;
 * els models i els preus són inventats fins que tinguem el catàleg de la plataforma.
 */
export const productes: Producte[] = [
  { id: 'gp5000', peca: 'rodes', marca: 'Continental', nom: 'Grand Prix 5000 S TR', preu: 7495, ficticia: true },
  { id: 'pzero', peca: 'rodes', marca: 'Pirelli', nom: 'P Zero Race TLR', preu: 6990, ficticia: true },
  { id: 'tubeless', peca: 'rodes', marca: 'Muc-Off', nom: 'Kit tubeless amb segellant', preu: 3999, ficticia: true },
  { id: 'pastilles', peca: 'frens', marca: 'Shimano', nom: 'Pastilles de resina L05A', preu: 2495, ficticia: true },
  { id: 'discs', peca: 'frens', marca: 'Shimano', nom: 'Discs RT-MT800 160 mm', preu: 5995, ficticia: true },
  { id: 'cadena', peca: 'transmissio', marca: 'Shimano', nom: 'Cadena Ultegra 12v', preu: 4495, ficticia: true },
  { id: 'cassette', peca: 'transmissio', marca: 'SRAM', nom: 'Cassette Force XG-1270', preu: 21900, ficticia: true },
  { id: 'lubricant', peca: 'transmissio', marca: 'Muc-Off', nom: 'Lubricant Ceramic Wet', preu: 1799, ficticia: true },
  { id: 'pedals', peca: 'transmissio', marca: 'Look', nom: 'Pedals Kéo Blade Carbon', preu: 17900, ficticia: true },
  { id: 'cinta', peca: 'direccio', marca: 'Specialized', nom: 'Cinta S-Wrap HexTack', preu: 3500, ficticia: true },
  { id: 'gps', peca: 'direccio', marca: 'Thule', nom: 'Suport frontal per a GPS', preu: 2990, ficticia: true },
  { id: 'sella', peca: 'seient', marca: 'Specialized', nom: 'Sella Power Expert Mirror', preu: 32000, ficticia: true },
  { id: 'culot', peca: 'seient', marca: 'Gobik', nom: 'Culot Absolute 6.0', preu: 15990, ficticia: true },
  { id: 'netejador', peca: 'quadre', marca: 'Muc-Off', nom: 'Kit de neteja i protecció', preu: 4999, ficticia: true },
  { id: 'casc', peca: 'quadre', marca: 'POC', nom: 'Casc Ventral Air', preu: 27000, ficticia: true },
];

/** Consultat a Google Maps el 23-10-2026. */
export const valoracioGoogle: Valoracio = { mitjana: 4.3, total: 123, font: 'google' };

/** Ressenyes reals de Google (textos literals). Cal el vistiplau del client per publicar-les. */
export const ressenyes: Ressenya[] = [
  {
    autor: 'Carlos Villa Poza',
    estrelles: 5,
    text: 'Es el tercer año que alquilo con ellos, súper profesionales, bicis de mucha calidad y atención muy personalizada. Muy recomendables. Gracias',
    quan: '2025',
  },
  {
    autor: 'Carlos Villa',
    estrelles: 5,
    text: 'La bici y su puesta a punto ha sido de una calidad excelente y la puntualidad en la entrega como su atención en el correo impecable.',
    quan: '2024',
  },
  {
    autor: 'Ressenya a Google',
    estrelles: 5,
    text: 'Recomendables al 100%, se ve que son buenos profesionales.',
    quan: '2025',
  },
];
