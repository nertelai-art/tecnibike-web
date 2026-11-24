// Forma de la guia de cada categoria de la botiga d'equipament (cascs, ulleres, roba, sabates,
// nutrició i accessoris). Cada categoria té el seu fitxer en aquesta carpeta; `index.ts` els reuneix.
//
// El que diu de la botiga (què fa Tecnibike) només pot ser el que el client ja diu: et triem la talla,
// t'ajustem el casc, et muntem i ajustem la cala, et diem quina nutrició et convé, assessorament en
// la compra. La resta és informació general de cada producte, contrastada amb les fonts (`fonts`).

import type { Locale } from '@/i18n/routing';
import type { CategoriaEquipament } from '@/lib/plataforma/esquema';

export type Text = Record<Locale, string>;

export type GuiaEquipament = {
  categoria: CategoriaEquipament;
  /** Una frase de títol per a la introducció (la H1 és el nom de la categoria). */
  lema: Text;
  /** Dos o tres paràgrafs, separats per una línia en blanc (`\n\n`). */
  intro: Text;
  /** Els tipus principals de la categoria (3 o 4): per a què és cadascun. */
  tipus: { nom: Text; text: Text }[];
  /** Com triar-ne (4 consells curts, concrets i útils). */
  consells: { titol: Text; text: Text }[];
  /** Què hi fa la botiga en aquesta categoria: només el que el client ja diu (vegeu a dalt). */
  aTecnibike: Text;
  /** Preguntes freqüents (3 o 4), que també van com a dades estructurades FAQPage. */
  preguntes: { pregunta: Text; resposta: Text }[];
  /** Fonts consultades per a la informació general. */
  fonts: { nom: string; url: string }[];
};
