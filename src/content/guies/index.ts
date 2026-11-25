// Guies de les categories de la botiga d'equipament, una per fitxer. Recerca del novembre del 2026.

import type { CategoriaEquipament } from '@/lib/plataforma/esquema';
import { accessoris } from './accessoris';
import { cascs } from './cascs';
import { nutricio } from './nutricio';
import { roba } from './roba';
import { sabates } from './sabates';
import type { GuiaEquipament } from './tipus';
import { ulleres } from './ulleres';

export type { GuiaEquipament } from './tipus';

export const GUIES_EQUIPAMENT: Record<CategoriaEquipament, GuiaEquipament> = {
  cascs,
  ulleres,
  roba,
  sabates,
  nutricio,
  accessoris,
};
