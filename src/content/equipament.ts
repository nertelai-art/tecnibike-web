// Seccions de la botiga d'equipament. Les fotos són de Wikimedia Commons (llicències CC que demanen
// citar l'autor i la llicència): els crèdits surten al peu de la web. Quan hi hagi fotos pròpies de
// la botiga, se substitueixen i aquests crèdits marxen.

import { categoriaEquipament, type CategoriaEquipament } from '@/lib/plataforma/esquema';
import { marquesDeTipus, type Marca, type TipusMarca } from './marques';

export const CATEGORIES_EQUIPAMENT = categoriaEquipament.options;

type Foto = { src: string; autor: string; llicencia: string; llicenciaUrl: string; font: string };

const TIPUS: Record<CategoriaEquipament, TipusMarca[]> = {
  cascs: ['cascs'],
  ulleres: ['ulleres'],
  roba: ['roba'],
  sabates: ['sabates'],
  nutricio: ['nutricio'],
  accessoris: ['manteniment', 'portabicis'],
};

export const FOTOS_EQUIPAMENT: Record<CategoriaEquipament, Foto> = {
  cascs: {
    src: '/img/equipament/cascs.webp',
    autor: 'Matti Blume',
    llicencia: 'CC BY-SA 4.0',
    llicenciaUrl: 'https://creativecommons.org/licenses/by-sa/4.0/',
    font: 'https://commons.wikimedia.org/wiki/File:Cyclingworld_Europe_2024,_Meerbusch_(P1170855).jpg',
  },
  ulleres: {
    src: '/img/equipament/ulleres.webp',
    autor: 'David Brandt',
    llicencia: 'CC BY-SA 3.0',
    llicenciaUrl: 'https://creativecommons.org/licenses/by-sa/3.0/',
    font: 'https://commons.wikimedia.org/wiki/File:Cycling_Time_Trial_effort.jpg',
  },
  roba: {
    src: '/img/equipament/roba.webp',
    autor: 'Silar',
    llicencia: 'CC BY-SA 4.0',
    llicenciaUrl: 'https://creativecommons.org/licenses/by-sa/4.0/',
    font: 'https://commons.wikimedia.org/wiki/File:020230923_cycling_jerseys_for_men.jpg',
  },
  sabates: {
    src: '/img/equipament/sabates.webp',
    autor: 'Glory Cycles',
    llicencia: 'CC BY 2.0',
    llicenciaUrl: 'https://creativecommons.org/licenses/by/2.0/',
    font: 'https://commons.wikimedia.org/wiki/File:LAKE_CX332_Cycling_Shoe.jpg',
  },
  nutricio: {
    src: '/img/equipament/nutricio.webp',
    autor: 'Usesope',
    llicencia: 'CC BY-SA 4.0',
    llicenciaUrl: 'https://creativecommons.org/licenses/by-sa/4.0/',
    font: 'https://commons.wikimedia.org/wiki/File:PXL_20211208_195048218(6970).jpg',
  },
  accessoris: {
    src: '/img/equipament/accessoris.webp',
    autor: 'cyclonebill',
    llicencia: 'CC BY-SA 2.0',
    llicenciaUrl: 'https://creativecommons.org/licenses/by-sa/2.0/',
    font: 'https://commons.wikimedia.org/wiki/File:Flickr_-_cyclonebill_-_Vand_(5).jpg',
  },
};

/** Marques de la botiga que tenen productes d'aquesta categoria, sense repetir-ne cap. */
export function marquesDeCategoria(categoria: CategoriaEquipament): Marca[] {
  const vistes = new Set<string>();
  return TIPUS[categoria].flatMap(marquesDeTipus).filter((m) => !vistes.has(m.nom) && vistes.add(m.nom));
}
