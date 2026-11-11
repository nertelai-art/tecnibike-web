import type { ProducteNutricio, SaborNutricio } from './esquema';

// Nutrició esportiva de la botiga, a les dades de prova. Els productes són els dels expositors de la
// botiga (fotos del client, 11-11-2026) i el format, els sabors, els carbohidrats i la cafeïna, els de
// les webs de les marques (docs/nutricio-productes.md, consultades l'11-11-2026). Els preus són el PVP
// de cada marca (o la caixa dividida per unitats), no els de la botiga, i l'estoc és inventat: per
// això tot porta `ficticia`. Quan la plataforma porti el catàleg i l'estoc, tot això surt d'allà.

const sabors = (...ids: string[]): SaborNutricio[] => ids.map((id, i) => ({ id, estoc: [12, 8, 5, 3, 10, 6, 9][i % 7]! }));

export const productesNutricio: ProducteNutricio[] = [
  // ── Maurten ──
  { id: 'maurten-gel-100', marca: 'Maurten', nom: 'Gel 100', tipus: 'gel', moments: ['abans', 'durant'], format: '40 g', carbohidratsG: 25, preu: 340, sabors: sabors('neutre'), ficticia: true },
  { id: 'maurten-gel-100-caf', marca: 'Maurten', nom: 'Gel 100 Caf 100', tipus: 'gel', moments: ['abans', 'durant'], format: '40 g', carbohidratsG: 25, cafeinaMg: 100, preu: 395, sabors: sabors('neutre'), ficticia: true },
  { id: 'maurten-gel-160', marca: 'Maurten', nom: 'Gel 160', tipus: 'gel', moments: ['abans', 'durant'], format: '65 g', carbohidratsG: 40, preu: 460, sabors: sabors('neutre'), ficticia: true },
  { id: 'maurten-drink-mix-160', marca: 'Maurten', nom: 'Drink Mix 160', tipus: 'beguda', moments: ['abans', 'durant', 'despres'], format: '42 g · 500 ml', carbohidratsG: 40, preu: 235, sabors: sabors('neutre', 'poma', 'cola', 'mentol', 'taronja'), ficticia: true },
  { id: 'maurten-drink-mix-320', marca: 'Maurten', nom: 'Drink Mix 320', tipus: 'beguda', moments: ['abans', 'durant'], format: '83 g · 500 ml', carbohidratsG: 80, preu: 345, sabors: sabors('neutre'), ficticia: true },
  { id: 'maurten-solid-160', marca: 'Maurten', nom: 'Solid 160', tipus: 'barreta', moments: ['abans', 'durant', 'despres'], format: '55 g', carbohidratsG: 40, preu: 335, sabors: sabors('civada', 'cacau'), ficticia: true },

  // ── 226ERS ──
  { id: '226ers-high-fructose-gel-xs', marca: '226ERS', nom: 'High Fructose Gel XS', tipus: 'gel', moments: ['durant'], format: '44 g', carbohidratsG: 30, preu: 200, sabors: sabors('maduixa', 'neutre', 'speculoos', 'xocolataDubai', 'cola'), ficticia: true },
  { id: '226ers-high-energy-gel', marca: '226ERS', nom: 'High Energy Gel', tipus: 'gel', moments: ['durant'], format: '76 g', carbohidratsG: 50, preu: 300, sabors: sabors('llimona', 'neutre', 'platan', 'maduixaSalada', 'cafe'), ficticia: true },
  { id: '226ers-isotonic-gel', marca: '226ERS', nom: 'Isotonic Gel', tipus: 'gel', moments: ['durant', 'despres'], format: '68 g', carbohidratsG: 22, preu: 320, sabors: sabors('sindria', 'llima', 'cola'), ficticia: true },
  { id: '226ers-race-day-bar', marca: '226ERS', nom: 'Race Day Bar', tipus: 'barreta', moments: ['durant'], format: '40 g', preu: 200, sabors: sabors('xocolataNegra', 'pomaCanyella', 'platanGingebre', 'xocolataBlancaMaduixa', 'ametllesLlavors'), ficticia: true },
  { id: '226ers-isotonic-drink', marca: '226ERS', nom: 'Isotonic Drink', tipus: 'beguda', moments: ['abans', 'durant', 'despres'], format: '20 g · 500 ml', preu: 180, sabors: sabors('fruitsVermells', 'llimona'), ficticia: true },
  { id: '226ers-hydrazero', marca: '226ERS', nom: 'Hydrazero', tipus: 'pastilles', moments: ['durant'], format: '20 pastilles', preu: 1100, sabors: sabors('llimona', 'maduixa', 'tropical'), ficticia: true },
  { id: '226ers-recovery-drink', marca: '226ERS', nom: 'Recovery Drink', tipus: 'recuperacio', moments: ['despres'], format: '50 g', preu: 320, sabors: sabors('xocolata', 'maduixa', 'vainilla'), ficticia: true },

  // ── Nutrinovex ──
  { id: 'nutrinovex-longovit-30', marca: 'Nutrinovex', nom: 'Longovit 360 Gel 30', tipus: 'gel', moments: ['durant'], format: '45 g', carbohidratsG: 30, preu: 220, sabors: sabors('mangoMandarina', 'maduixaKiwi', 'sindria', 'llimaLlimona', 'cola', 'neutre', 'pomaVerda'), ficticia: true },
  { id: 'nutrinovex-glucomin', marca: 'Nutrinovex', nom: 'Glucomin Hydrogel', tipus: 'gel', moments: ['durant', 'despres'], format: '70 g', carbohidratsG: 25, preu: 260, sabors: sabors('citric', 'neutre', 'eucaliptusMentol'), ficticia: true },
  { id: 'nutrinovex-glucobar', marca: 'Nutrinovex', nom: 'Glucobar', tipus: 'barreta', moments: ['durant'], format: '40 g', carbohidratsG: 33, preu: 230, sabors: sabors('maduixa', 'sindria', 'llimaLlimona', 'cola', 'poma'), ficticia: true },
  { id: 'nutrinovex-cramp-rescuer', marca: 'Nutrinovex', nom: 'Cramp Rescuer', tipus: 'gel', moments: ['durant'], format: '40 g', carbohidratsG: 15, preu: 250, sabors: sabors('gerdLlimona', 'herbasanaRegalessia'), ficticia: true },

  // ── SiS ──
  { id: 'sis-go-isotonic', marca: 'SiS', nom: 'GO Isotonic Energy', tipus: 'gel', moments: ['durant'], format: '60 ml', carbohidratsG: 22, preu: 250, sabors: sabors('taronja'), ficticia: true },
  { id: 'sis-go-cafeina', marca: 'SiS', nom: 'GO Isotonic Energy + Caffeine', tipus: 'gel', moments: ['abans', 'durant'], format: '60 ml', carbohidratsG: 22, cafeinaMg: 75, preu: 275, sabors: sabors('citric'), ficticia: true },
  { id: 'sis-go-electrolyte', marca: 'SiS', nom: 'GO Energy + Electrolyte', tipus: 'gel', moments: ['durant'], format: '60 ml', carbohidratsG: 22, preu: 275, sabors: sabors('llimonaMenta'), ficticia: true },
  { id: 'sis-beta-fuel-chews', marca: 'SiS', nom: 'Beta Fuel Energy Chews', tipus: 'gominoles', moments: ['durant'], format: '60 g', carbohidratsG: 46, preu: 300, sabors: sabors('variat'), ficticia: true },
  { id: 'sis-go-hydro', marca: 'SiS', nom: 'GO Hydro', tipus: 'pastilles', moments: ['durant'], format: '20 pastilles', preu: 1000, sabors: sabors('pomeloRosat', 'maduixaLlima', 'llimona'), ficticia: true },
];
