import type { ProducteNutricio, SaborNutricio } from './esquema';

// Nutrició esportiva de la botiga, a les dades de prova. Els productes són els dels expositors de la
// botiga (fotos del client, 11-11-2026) i el format, els sabors, els carbohidrats i la cafeïna, els de
// les webs de les marques (docs/nutricio-productes.md, consultades l'11-11-2026). Els preus són el PVP
// de cada marca (o la caixa dividida per unitats), no els de la botiga, i l'estoc és inventat: per
// això tot porta `ficticia`. Les fotos són de les webs de les marques (pujades al repositori amb el
// vistiplau de l'usuari); abans de publicar-les a producció cal el permís de les marques. Quan la plataforma porti el catàleg i l'estoc, tot això surt d'allà.

/** Les fotos que tenim, baixades de les webs de les marques (public/img/nutricio). */
const AMB_FOTO = new Set([
  '226ers-high-fructose-gel-xs', '226ers-high-energy-gel', '226ers-isotonic-gel', '226ers-race-day-bar', '226ers-isotonic-drink',
  '226ers-hydrazero', '226ers-recovery-drink', 'nutrinovex-longovit-30', 'nutrinovex-glucomin', 'nutrinovex-glucobar',
  'nutrinovex-cramp-rescuer',
]);
/** La foto d'un producte i sabor (public/img/nutricio; es regeneren amb scripts/fotos-nutricio.mjs). */
const foto = (producte: string, sabor: string) => `/img/nutricio/${producte}--${sabor}.webp`;

/** Sabors amb un estoc inventat i, als productes que en tenen, la foto de cada sabor. */
const sabors = (producte: string, ...ids: string[]): SaborNutricio[] =>
  ids.map((id, i) => ({ id, estoc: [12, 8, 5, 3, 10, 6, 9][i % 7]!, ...(AMB_FOTO.has(producte) && { imatge: foto(producte, id) }) }));

export const productesNutricio: ProducteNutricio[] = [
  // ── Maurten ──
  { id: 'maurten-gel-100', marca: 'Maurten', nom: 'Gel 100', tipus: 'gel', moments: ['abans', 'durant'], format: '40 g', carbohidratsG: 25, imatge: foto('maurten-gel-100', 'neutre'), preu: 340, sabors: sabors('maurten-gel-100', 'neutre'), ficticia: true },
  { id: 'maurten-gel-100-caf', marca: 'Maurten', nom: 'Gel 100 Caf 100', tipus: 'gel', moments: ['abans', 'durant'], format: '40 g', carbohidratsG: 25, cafeinaMg: 100, imatge: foto('maurten-gel-100-caf', 'neutre'), preu: 395, sabors: sabors('maurten-gel-100-caf', 'neutre'), ficticia: true },
  { id: 'maurten-gel-160', marca: 'Maurten', nom: 'Gel 160', tipus: 'gel', moments: ['abans', 'durant'], format: '65 g', carbohidratsG: 40, imatge: foto('maurten-gel-160', 'neutre'), preu: 460, sabors: sabors('maurten-gel-160', 'neutre'), ficticia: true },
  { id: 'maurten-drink-mix-160', marca: 'Maurten', nom: 'Drink Mix 160', tipus: 'beguda', moments: ['abans', 'durant', 'despres'], format: '42 g · 500 ml', carbohidratsG: 40, imatge: foto('maurten-drink-mix-160', 'neutre'), preu: 235, sabors: sabors('maurten-drink-mix-160', 'neutre', 'poma', 'cola', 'mentol', 'taronja'), ficticia: true },
  { id: 'maurten-drink-mix-320', marca: 'Maurten', nom: 'Drink Mix 320', tipus: 'beguda', moments: ['abans', 'durant'], format: '83 g · 500 ml', carbohidratsG: 80, imatge: foto('maurten-drink-mix-320', 'neutre'), preu: 345, sabors: sabors('maurten-drink-mix-320', 'neutre'), ficticia: true },
  { id: 'maurten-solid-160', marca: 'Maurten', nom: 'Solid 160', tipus: 'barreta', moments: ['abans', 'durant', 'despres'], format: '55 g', carbohidratsG: 40, imatge: foto('maurten-solid-160', 'civada'), preu: 335, sabors: sabors('maurten-solid-160', 'civada', 'cacau'), ficticia: true },

  // ── 226ERS ──
  { id: '226ers-high-fructose-gel-xs', marca: '226ERS', nom: 'High Fructose Gel XS', tipus: 'gel', moments: ['durant'], format: '44 g', carbohidratsG: 30, imatge: foto('226ers-high-fructose-gel-xs', 'maduixa'), preu: 200, sabors: sabors('226ers-high-fructose-gel-xs', 'maduixa', 'neutre', 'speculoos', 'xocolataDubai', 'cola'), ficticia: true },
  { id: '226ers-high-energy-gel', marca: '226ERS', nom: 'High Energy Gel', tipus: 'gel', moments: ['durant'], format: '76 g', carbohidratsG: 50, imatge: foto('226ers-high-energy-gel', 'llimona'), preu: 300, sabors: sabors('226ers-high-energy-gel', 'llimona', 'neutre', 'platan', 'maduixaSalada', 'cafe'), ficticia: true },
  { id: '226ers-isotonic-gel', marca: '226ERS', nom: 'Isotonic Gel', tipus: 'gel', moments: ['durant', 'despres'], format: '68 g', carbohidratsG: 22, imatge: foto('226ers-isotonic-gel', 'sindria'), preu: 320, sabors: sabors('226ers-isotonic-gel', 'sindria', 'llima', 'cola'), ficticia: true },
  { id: '226ers-race-day-bar', marca: '226ERS', nom: 'Race Day Bar', tipus: 'barreta', moments: ['durant'], format: '40 g', imatge: foto('226ers-race-day-bar', 'xocolataNegra'), preu: 200, sabors: sabors('226ers-race-day-bar', 'xocolataNegra', 'pomaCanyella', 'platanGingebre', 'xocolataBlancaMaduixa', 'ametllesLlavors'), ficticia: true },
  { id: '226ers-isotonic-drink', marca: '226ERS', nom: 'Isotonic Drink', tipus: 'beguda', moments: ['abans', 'durant', 'despres'], format: '20 g · 500 ml', imatge: foto('226ers-isotonic-drink', 'fruitsVermells'), preu: 180, sabors: sabors('226ers-isotonic-drink', 'fruitsVermells', 'llimona'), ficticia: true },
  { id: '226ers-hydrazero', marca: '226ERS', nom: 'Hydrazero', tipus: 'pastilles', moments: ['durant'], format: '20 pastilles', imatge: foto('226ers-hydrazero', 'llimona'), preu: 1100, sabors: sabors('226ers-hydrazero', 'llimona', 'maduixa', 'tropical'), ficticia: true },
  { id: '226ers-recovery-drink', marca: '226ERS', nom: 'Recovery Drink', tipus: 'recuperacio', moments: ['despres'], format: '50 g', imatge: foto('226ers-recovery-drink', 'xocolata'), preu: 320, sabors: sabors('226ers-recovery-drink', 'xocolata', 'maduixa', 'vainilla'), ficticia: true },

  // ── Nutrinovex ──
  { id: 'nutrinovex-longovit-30', marca: 'Nutrinovex', nom: 'Longovit 360 Gel 30', tipus: 'gel', moments: ['durant'], format: '45 g', carbohidratsG: 30, imatge: foto('nutrinovex-longovit-30', 'mangoMandarina'), preu: 220, sabors: sabors('nutrinovex-longovit-30', 'mangoMandarina', 'maduixaKiwi', 'sindria', 'llimaLlimona', 'cola', 'neutre', 'pomaVerda'), ficticia: true },
  { id: 'nutrinovex-glucomin', marca: 'Nutrinovex', nom: 'Glucomin Hydrogel', tipus: 'gel', moments: ['durant', 'despres'], format: '70 g', carbohidratsG: 25, imatge: foto('nutrinovex-glucomin', 'citric'), preu: 260, sabors: sabors('nutrinovex-glucomin', 'citric', 'neutre', 'eucaliptusMentol'), ficticia: true },
  { id: 'nutrinovex-glucobar', marca: 'Nutrinovex', nom: 'Glucobar', tipus: 'barreta', moments: ['durant'], format: '40 g', carbohidratsG: 33, imatge: foto('nutrinovex-glucobar', 'maduixa'), preu: 230, sabors: sabors('nutrinovex-glucobar', 'maduixa', 'sindria', 'llimaLlimona', 'cola', 'poma'), ficticia: true },
  { id: 'nutrinovex-cramp-rescuer', marca: 'Nutrinovex', nom: 'Cramp Rescuer', tipus: 'gel', moments: ['durant'], format: '40 g', carbohidratsG: 15, imatge: foto('nutrinovex-cramp-rescuer', 'gerdLlimona'), preu: 250, sabors: sabors('nutrinovex-cramp-rescuer', 'gerdLlimona', 'herbasanaRegalessia'), ficticia: true },

  // ── SiS ──
  { id: 'sis-go-isotonic', marca: 'SiS', nom: 'GO Isotonic Energy', tipus: 'gel', moments: ['durant'], format: '60 ml', carbohidratsG: 22, imatge: foto('sis-go-isotonic', 'taronja'), preu: 250, sabors: sabors('sis-go-isotonic', 'taronja'), ficticia: true },
  { id: 'sis-go-cafeina', marca: 'SiS', nom: 'GO Isotonic Energy + Caffeine', tipus: 'gel', moments: ['abans', 'durant'], format: '60 ml', carbohidratsG: 22, cafeinaMg: 75, imatge: foto('sis-go-cafeina', 'cafe'), preu: 275, sabors: sabors('sis-go-cafeina', 'cafe'), ficticia: true },
  { id: 'sis-go-electrolyte', marca: 'SiS', nom: 'GO Energy + Electrolyte', tipus: 'gel', moments: ['durant'], format: '60 ml', carbohidratsG: 22, imatge: foto('sis-go-electrolyte', 'llimonaMenta'), preu: 275, sabors: sabors('sis-go-electrolyte', 'llimonaMenta'), ficticia: true },
  { id: 'sis-beta-fuel-chews', marca: 'SiS', nom: 'Beta Fuel Energy Chews', tipus: 'gominoles', moments: ['durant'], format: '60 g', carbohidratsG: 46, imatge: foto('sis-beta-fuel-chews', 'taronja'), preu: 300, sabors: sabors('sis-beta-fuel-chews', 'taronja'), ficticia: true },
  { id: 'sis-go-hydro', marca: 'SiS', nom: 'GO Hydro', tipus: 'pastilles', moments: ['durant'], format: '20 pastilles', imatge: foto('sis-go-hydro', 'pomeloRosat'), preu: 1000, sabors: sabors('sis-go-hydro', 'pomeloRosat', 'maduixaLlima', 'llimona'), ficticia: true },
];
