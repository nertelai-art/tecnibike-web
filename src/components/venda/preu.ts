import type { BiciVenda } from '@/lib/plataforma/esquema';
import { formatEuros } from '@/lib/preus';

type Traductor = (clau: 'preuConsultar' | 'preuDesDe', valors?: { preu: string }) => string;

/** El preu d'una bici en venda com l'ha posat la botiga: tancat, «des de» o a consultar. */
export function textPreuVenda(bici: Pick<BiciVenda, 'preu' | 'preuBase'>, t: Traductor, locale: string): string {
  if (bici.preu === null || bici.preuBase === 'consultar') return t('preuConsultar');
  const preu = formatEuros(bici.preu, locale);
  return bici.preuBase === 'desDe' ? t('preuDesDe', { preu }) : preu;
}
