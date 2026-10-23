'use server';

import { araABotiga, esData, esPassat } from '@/lib/calendari';
import { ErrorReserva, plataforma } from '@/lib/plataforma';
import { citaTaller, reservaLloguer } from '@/lib/plataforma/esquema';

// Accions de servidor de les reserves. Tot el que arriba del navegador es torna a validar aquí, i
// el preu el calcula la plataforma: el del formulari només és orientatiu.

export type ResultatReserva =
  | { ok: true; codi: string; totalCentims?: number }
  | { ok: false; error: 'dades' | 'esgotat' | 'durada' | 'talla' | 'franja' | 'xarxa'; camps?: string[] };

export async function consultarDisponibilitat(biciId: string, recollida: string, dies: number) {
  if (!esData(recollida) || !Number.isInteger(dies) || dies < 1 || dies > 30) return {};
  return plataforma.disponibilitat(biciId, recollida, dies);
}

export async function consultarFranges(dia: string) {
  if (!esData(dia)) return [];
  return plataforma.frangesTaller(dia);
}

function errorDe(e: unknown): ResultatReserva {
  if (e instanceof ErrorReserva) return { ok: false, error: e.motiu === 'bici' ? 'dades' : e.motiu };
  console.error('Reserva fallida', e);
  return { ok: false, error: 'xarxa' };
}

export async function reservarLloguer(entrada: unknown): Promise<ResultatReserva> {
  const validada = reservaLloguer.safeParse(entrada);
  if (!validada.success) return { ok: false, error: 'dades', camps: validada.error.issues.map((i) => String(i.path[0])) };
  if (validada.data.recollida < araABotiga(new Date()).dia) return { ok: false, error: 'dades', camps: ['recollida'] };
  try {
    return { ok: true, ...(await plataforma.crearReservaLloguer(validada.data)) };
  } catch (e) {
    return errorDe(e);
  }
}

export async function demanarCita(entrada: unknown): Promise<ResultatReserva> {
  const validada = citaTaller.safeParse(entrada);
  if (!validada.success) return { ok: false, error: 'dades', camps: validada.error.issues.map((i) => String(i.path[0])) };
  // El rellotge només entra aquí, a la frontera: la resta rep l'hora per paràmetre.
  if (esPassat(validada.data.dia, validada.data.hora, araABotiga(new Date()))) return { ok: false, error: 'franja' };
  try {
    return { ok: true, ...(await plataforma.crearCitaTaller(validada.data)) };
  } catch (e) {
    return errorDe(e);
  }
}
