// Enllaç de la franja «Web feta per Nertel», sota el peu.
import type { Locale } from '@/i18n/routing';

/**
 * D'on ve la visita, per a l'analítica de nertel.ai: el host de la web, sense `www.` ni protocol. El
 * mateix format a totes les webs de clients. Ara és el de Vercel perquè la web encara no és al
 * domini del client: quan hi passi, aquí hi va el domini.
 */
const ORIGEN = 'tecnibike-web.vercel.app';

/** nertel.ai té ca, es, en i fr (i més), així que cada pàgina porta al seu mateix idioma. */
export function enllacCreditNertel(locale: Locale): string {
  return `https://nertel.ai/${locale}?utm_source=${ORIGEN}&utm_medium=credit`;
}
