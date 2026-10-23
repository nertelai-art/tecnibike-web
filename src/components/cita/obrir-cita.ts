import type { Peca } from '@/lib/plataforma/esquema';

// Comunicació entre els botons «Demana cita» i el diàleg, que només és a la portada. Si el diàleg
// no hi és (una altra pàgina), el botó segueix el seu enllaç a /taller/cita.

export const EVENT_CITA = 'tecnibike:obrir-cita';
export const ID_DIALEG_CITA = 'dialeg-cita';

export function obrirCita(peca?: Peca | null): boolean {
  if (typeof document === 'undefined' || !document.getElementById(ID_DIALEG_CITA)) return false;
  window.dispatchEvent(new CustomEvent<Peca | null>(EVENT_CITA, { detail: peca ?? null }));
  return true;
}
