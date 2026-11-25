// Noms del catàleg de la plataforma que la web ja sap traduir. La plataforma guarda un sol nom per
// extra, sabor o grup, en l'idioma en què l'escriu la botiga (el català); la web té els extres, els
// sabors i els grups coneguts traduïts als quatre idiomes (`reserva.extresNoms`, `nutricio.sabors`,
// `reserva.grupsNoms`). Si un nom de la plataforma és un d'aquests, en qualsevol idioma, se'n torna la
// clau i la pàgina n'ensenya la traducció; si no, es queda el nom de la botiga.
//
// Només per al servidor: llegeix els missatges dels quatre idiomes.

import ca from '@/messages/ca.json';
import en from '@/messages/en.json';
import es from '@/messages/es.json';
import fr from '@/messages/fr.json';

const IDIOMES = [ca, es, en, fr];

/** Sense accents, majúscules, guionets de partició ni espais de més. */
export function normalitzaNom(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f\u00ad]/g, '')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim();
}

/** Nom normalitzat (en qualsevol idioma, amb i sense el que va entre parèntesis) → clau. */
function index(tria: (m: typeof ca) => Record<string, string>): Map<string, string> {
  const mapa = new Map<string, string>();
  for (const missatges of IDIOMES) {
    for (const [clau, nom] of Object.entries(tria(missatges))) {
      mapa.set(normalitzaNom(nom), clau);
      mapa.set(normalitzaNom(nom.replace(/\s*\([^)]*\)/g, '')), clau);
    }
  }
  return mapa;
}

const EXTRES = index((m) => m.reserva.extresNoms);
const SABORS = index((m) => m.nutricio.sabors);
const GRUPS = index((m) => m.reserva.grupsNoms);
const CLAUS_SABORS = new Set(Object.keys(ca.nutricio.sabors));

export function clauExtra(nom: string): string | undefined {
  return EXTRES.get(normalitzaNom(nom));
}

export function clauGrup(nom: string): string | undefined {
  return GRUPS.get(normalitzaNom(nom));
}

/** Pel nom exacte o, si no, pel sabor conegut que formen les paraules: «Maduixa i kiwi» → maduixaKiwi. */
export function clauSabor(nom: string): string | undefined {
  const net = normalitzaNom(nom);
  if (!net) return undefined;
  const exacte = SABORS.get(net);
  if (exacte) return exacte;
  const paraules = net.split(/[^a-z]+/).filter((w) => w && !['i', 'y', 'and', 'et', 'amb', 'con', 'with', 'avec'].includes(w));
  const camel = paraules.map((w, i) => (i ? w[0]!.toUpperCase() + w.slice(1) : w)).join('');
  return CLAUS_SABORS.has(camel) ? camel : undefined;
}
