'use server';

import { headers } from 'next/headers';
import { araABotiga, esData, esPassat } from '@/lib/calendari';
import { diesEntre, MAX_DIES_LLOGUER } from '@/lib/horari';
import { ErrorReserva, plataforma, type Disponibilitat } from '@/lib/plataforma';
import { citaTaller, modalitatPagament, participantsReserva, reservaLloguer } from '@/lib/plataforma/esquema';

// Accions de servidor de les reserves. Tot el que arriba del navegador es torna a validar aquí, i
// el preu, l'horari i les unitats lliures els comprova la plataforma: el formulari només orienta.

export type ErrorResultat = 'dades' | 'esgotat' | 'extra' | 'durada' | 'talla' | 'franja' | 'noDisponible' | 'xarxa';

export type ResultatReserva =
  | { ok: true; codi: string; totalCentims?: number }
  | { ok: true; pagament: string }
  | { ok: false; error: ErrorResultat; camps?: string[] };

export async function consultarDisponibilitat(des: string, fins: string, biciIds: string[]): Promise<Disponibilitat | null> {
  if (!esData(des) || !esData(fins) || diesEntre(des, fins) < 1 || diesEntre(des, fins) > MAX_DIES_LLOGUER) return null;
  if (!Array.isArray(biciIds) || biciIds.length > 8 || biciIds.some((id) => typeof id !== 'string')) return null;
  return plataforma.disponibilitat(des, fins, biciIds);
}

export async function consultarFranges(dia: string) {
  if (!esData(dia)) return [];
  return plataforma.frangesTaller(dia);
}

function errorDe(e: unknown): ResultatReserva {
  if (e instanceof ErrorReserva) {
    const error: ErrorResultat = e.motiu === 'bici' || e.motiu === 'participants' ? 'dades' : e.motiu === 'retencio' ? 'esgotat' : e.motiu;
    return { ok: false, error };
  }
  console.error('Reserva fallida', e);
  return { ok: false, error: 'xarxa' };
}

const campsAmbError = (issues: { path: PropertyKey[] }[]) => issues.map((i) => i.path.map(String).join('.'));

/**
 * Sense pagament en línia, la reserva queda feta i es paga a la botiga. Amb pagament (quan la
 * plataforma l'activi), les bicis queden retingudes i es torna l'adreça de la passarel·la.
 */
export async function reservarLloguer(entrada: unknown, modalitat?: unknown): Promise<ResultatReserva> {
  const validada = reservaLloguer.safeParse(entrada);
  if (!validada.success) return { ok: false, error: 'dades', camps: campsAmbError(validada.error.issues) };
  try {
    const { pagament } = await plataforma.configuracioReserves();
    if (!pagament.actiu) return { ok: true, ...(await plataforma.crearReservaLloguer(validada.data)) };

    const triada = modalitatPagament.safeParse(modalitat);
    if (!triada.success || !pagament.modalitats.includes(triada.data)) return { ok: false, error: 'dades', camps: ['modalitat'] };
    const retencio = await plataforma.retenirReserva(validada.data);
    try {
      const capcaleres = await headers();
      const origen = `${capcaleres.get('x-forwarded-proto') ?? 'https'}://${capcaleres.get('host')}`;
      const { url } = await plataforma.iniciarPagament(retencio.id, triada.data, `${origen}/${validada.data.idioma}/reserva/pagament`);
      return { ok: true, pagament: url };
    } catch (e) {
      // Si no es pot començar a pagar, les bicis no es queden guardades per a ningú.
      await plataforma.alliberarRetencio(retencio.id);
      throw e;
    }
  } catch (e) {
    return errorDe(e);
  }
}

export async function enviarParticipants(entrada: unknown): Promise<{ ok: true } | { ok: false; error: ErrorResultat; camps?: string[] }> {
  const validada = participantsReserva.safeParse(entrada);
  if (!validada.success) return { ok: false, error: 'dades', camps: campsAmbError(validada.error.issues) };
  try {
    await plataforma.registrarParticipants(validada.data);
    return { ok: true };
  } catch (e) {
    const r = errorDe(e);
    return r.ok ? { ok: false, error: 'xarxa' } : r;
  }
}

export async function demanarCita(entrada: unknown): Promise<ResultatReserva> {
  const validada = citaTaller.safeParse(entrada);
  if (!validada.success) return { ok: false, error: 'dades', camps: validada.error.issues.map((i) => String(i.path[0])) };
  // El rellotge entra aquí, a la frontera: la resta rep l'hora per paràmetre.
  if (esPassat(validada.data.dia, validada.data.hora, araABotiga(new Date()))) return { ok: false, error: 'franja' };
  try {
    return { ok: true, ...(await plataforma.crearCitaTaller(validada.data)) };
  } catch (e) {
    return errorDe(e);
  }
}
