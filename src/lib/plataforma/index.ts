import { crearPlataformaProva } from './proves';
import { crearPlataformaRemota } from './remota';
import type { Plataforma } from './interficie';

// La plataforma que fa servir la web. Amb la clau de la botiga (variables d'entorn del servidor, mai
// al repositori), l'API de lloguer de la plataforma; sense, la implementació de proves, amb les dades
// de dades-prova.ts. Vegeu .env.example.

export { ErrorReserva, type Disponibilitat, type EstatRetencio, type Plataforma } from './interficie';
export { crearPlataformaProva } from './proves';
export { resultatDelPagament } from './remota';

/** Codi curt i llegible per telèfon: TB- i sis caràcters sense lletres que es confonguin. */
function codiAleatori() {
  const lletres = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  const bytes = crypto.getRandomValues(new Uint8Array(6));
  return `TB-${Array.from(bytes, (b) => lletres[b % lletres.length]).join('')}`;
}

// La nutrició amb la reserva, només en desenvolupament: a producció i a les previsualitzacions,
// apagada fins que el client la decideixi i la plataforma en porti l'estoc.
const proves = crearPlataformaProva({
  generaCodi: codiAleatori,
  rellotge: () => new Date(),
  configuracio: { nutricio: { actiu: process.env.NODE_ENV === 'development' } },
});
const { PLATAFORMA_API_URL: url, PLATAFORMA_API_CLAU: clau } = process.env;

export const plataformaRemota = Boolean(url && clau);
export const plataforma: Plataforma = url && clau ? crearPlataformaRemota({ url, clau, proves }) : proves;
