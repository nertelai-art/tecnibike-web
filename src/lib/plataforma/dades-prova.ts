import type { Article, BiciLloguer, ConfiguracioReserves, Extra, HorariBotiga, Producte, Ressenya, ServeiTaller, Valoracio } from './esquema';

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

/**
 * Extres del lloguer. Els pedals són les opcions del formulari de la web antiga; preus, cobrament i
 * estoc són inventats (el casc inclòs és una suposició) i s'han de confirmar amb el client.
 */
export const extres: Extra[] = [
  { id: 'pedals-plans', grup: 'pedals', imatge: '/img/extres/pedals-plans.webp', preu: 0, cobrament: 'perReserva', estoc: 30, ficticia: true },
  { id: 'pedals-spd', grup: 'pedals', imatge: '/img/extres/pedals-spd.webp', preu: 0, cobrament: 'perReserva', estoc: 12, ficticia: true },
  { id: 'pedals-spdSl', grup: 'pedals', imatge: '/img/extres/pedals-spdSl.webp', preu: 0, cobrament: 'perReserva', estoc: 10, ficticia: true },
  { id: 'pedals-look', grup: 'pedals', imatge: '/img/extres/pedals-look.webp', preu: 0, cobrament: 'perReserva', estoc: 6, ficticia: true },
  { id: 'pedals-propis', grup: 'pedals', preu: 0, cobrament: 'perReserva', estoc: null, ficticia: true },
  { id: 'casc', grup: 'extres', imatge: '/img/extres/casc.webp', preu: 0, cobrament: 'perReserva', estoc: 40, ficticia: true },
  { id: 'cadenat', grup: 'extres', imatge: '/img/extres/cadenat.webp', preu: 300, cobrament: 'perReserva', estoc: 20, ficticia: true },
  { id: 'cadiraNado', grup: 'extres', imatge: '/img/extres/cadiraNado.webp', preu: 800, cobrament: 'perReserva', estoc: 2, ficticia: true },
  { id: 'alforges', grup: 'extres', imatge: '/img/extres/alforges.webp', preu: 600, cobrament: 'perReserva', estoc: 6, ficticia: true },
  { id: 'comptaquilometres', grup: 'extres', imatge: '/img/extres/comptaquilometres.webp', preu: 200, cobrament: 'perDia', estoc: 8, ficticia: true },
];

const FEINER = [
  { obre: '09:00', tanca: '13:00' },
  { obre: '16:00', tanca: '20:00' },
];

/**
 * Horari de la web i de Google: de dilluns a dissabte, 9–13 h i 16–20 h. Falta saber si a l'estiu
 * canvia (`periodes`) i quins festius tanquen: els d'aquí són els oficials, sense confirmar.
 */
export const horari: HorariBotiga = {
  setmana: [[], FEINER, FEINER, FEINER, FEINER, FEINER, FEINER],
  periodes: [],
  tancats: ['2026-12-08', '2026-12-25', '2026-12-26', '2027-01-01', '2027-01-06', '2027-03-26', '2027-03-29', '2027-05-01'].map((dia) => ({ dia, ficticia: true })),
  pasMinuts: 30,
};

/** Pagament i participants, preparats a la web però apagats: la plataforma encara no els té. */
export const configuracioReserves: ConfiguracioReserves = {
  pagament: { actiu: false, modalitats: ['senyal', 'total'], senyalPercent: 30 },
  participants: { actiu: false },
  retencioMinuts: 15,
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

/**
 * Articles de la botiga d'equipament, per categoria. Marques que treballa Tecnibike; models i preus
 * inventats fins que tinguem el catàleg de la plataforma (i aleshores es podran vendre en línia).
 */
export const articles: Article[] = [
  { id: 'poc-ventral', categoria: 'cascs', marca: 'POC', nom: 'Ventral Air MIPS', preu: 27000, ficticia: true },
  { id: 'kask-protone', categoria: 'cascs', marca: 'Kask', nom: 'Protone Icon', preu: 26000, ficticia: true },
  { id: 'kask-valegro', categoria: 'cascs', marca: 'Kask', nom: 'Valegro', preu: 21000, ficticia: true },
  { id: 'eassun-casc', categoria: 'cascs', marca: 'Eassun', nom: 'Vulcano', preu: 8990, ficticia: true },
  { id: 'oakley-sutro', categoria: 'ulleres', marca: 'Oakley', nom: 'Sutro Lite Prizm Road', preu: 17900, ficticia: true },
  { id: 'poc-elicit', categoria: 'ulleres', marca: 'POC', nom: 'Elicit', preu: 23000, ficticia: true },
  { id: 'bliz-breeze', categoria: 'ulleres', marca: 'Bliz', nom: 'Breeze', preu: 11000, ficticia: true },
  { id: 'eassun-ulleres', categoria: 'ulleres', marca: 'Eassun', nom: 'Gaia fotocromàtiques', preu: 6990, ficticia: true },
  { id: 'assos-mille', categoria: 'roba', marca: 'Assos', nom: 'Mallot Mille GT', preu: 15000, ficticia: true },
  { id: 'gobik-culot', categoria: 'roba', marca: 'Gobik', nom: 'Culot Absolute 6.0', preu: 15990, ficticia: true },
  { id: 'gobik-armilla', categoria: 'roba', marca: 'Gobik', nom: 'Armilla Plus 2.0', preu: 7990, ficticia: true },
  { id: 'pissei-mallot', categoria: 'roba', marca: 'Pissei', nom: 'Mallot Primo', preu: 9500, ficticia: true },
  { id: 'dmt-kr1', categoria: 'sabates', marca: 'DMT', nom: 'KR1 carretera', preu: 33000, ficticia: true },
  { id: 'dmt-kr4', categoria: 'sabates', marca: 'DMT', nom: 'KR4 carretera', preu: 16000, ficticia: true },
  { id: 'dmt-km4', categoria: 'sabates', marca: 'DMT', nom: 'KM4 muntanya', preu: 17000, ficticia: true },
  { id: 'maurten-gel', categoria: 'nutricio', marca: 'Maurten', nom: 'Gel 100', preu: 350, ficticia: true },
  { id: '226ers-gel', categoria: 'nutricio', marca: '226ERS', nom: 'High Energy Gel', preu: 220, ficticia: true },
  { id: 'sis-beta', categoria: 'nutricio', marca: 'SiS', nom: 'Beta Fuel', preu: 390, ficticia: true },
  { id: 'nutrinovex-barreta', categoria: 'nutricio', marca: 'Nutrinovex', nom: 'Barreta energètica', preu: 250, ficticia: true },
  { id: 'mucoff-neteja', categoria: 'accessoris', marca: 'Muc-Off', nom: 'Netejador Nano Tech', preu: 1499, ficticia: true },
  { id: 'xsauce-segellant', categoria: 'accessoris', marca: 'X-Sauce', nom: 'Líquid antipunxades 500 ml', preu: 1290, ficticia: true },
  { id: 'thule-proride', categoria: 'accessoris', marca: 'Thule', nom: 'Portabicis ProRide', preu: 16000, ficticia: true },
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
