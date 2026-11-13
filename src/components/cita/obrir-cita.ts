import { peca as esquemaPeca, type Peca } from '@/lib/plataforma/esquema';

// La cita al taller es demana només al diàleg de la portada (DialegCita). Els botons «Demana cita»
// l'obren si hi és; si no (una altra pàgina, o sense JavaScript), porten a la portada amb `?cita`, i
// la portada obre el diàleg en carregar-se. L'adreça vella /taller/cita hi redirigeix.

export const EVENT_CITA = 'tecnibike:obrir-cita';
export const ID_DIALEG_CITA = 'dialeg-cita';

export function obrirCita(peca?: Peca | null): boolean {
  if (typeof document === 'undefined' || !document.getElementById(ID_DIALEG_CITA)) return false;
  window.dispatchEvent(new CustomEvent<Peca | null>(EVENT_CITA, { detail: peca ?? null }));
  return true;
}

/** L'enllaç a la cita: la portada amb el diàleg obert, i la peça triada si n'hi ha. */
export function enllacCita(peca?: Peca | null) {
  return { pathname: '/' as const, query: { cita: 'taller', ...(peca && { peca }) } };
}

/** Si la portada ha d'obrir el diàleg en carregar-se (`?cita`) i amb quina peça. */
export function citaDeLAdreca(cerca: string): { obrir: boolean; peca: Peca | null } {
  const parametres = new URLSearchParams(cerca);
  if (!parametres.has('cita')) return { obrir: false, peca: null };
  const peca = esquemaPeca.safeParse(parametres.get('peca'));
  return { obrir: true, peca: peca.success ? peca.data : null };
}
