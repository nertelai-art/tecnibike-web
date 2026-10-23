// Dates de calendari com a text `AAAA-MM-DD`, sense hores ni zones horàries: una reserva és «el
// dia 12», no un instant. L'avui sempre entra per paràmetre (mai `new Date()` aquí dins).

const FORMAT = /^\d{4}-\d{2}-\d{2}$/;

export function esData(text: string): boolean {
  if (!FORMAT.test(text)) return false;
  const [a, m, d] = text.split('-').map(Number) as [number, number, number];
  const data = new Date(Date.UTC(a, m - 1, d));
  return data.getUTCFullYear() === a && data.getUTCMonth() === m - 1 && data.getUTCDate() === d;
}

function aUtc(text: string): Date {
  const [a, m, d] = text.split('-').map(Number) as [number, number, number];
  return new Date(Date.UTC(a, m - 1, d));
}

function deUtc(data: Date): string {
  return data.toISOString().slice(0, 10);
}

export function sumaDies(text: string, dies: number): string {
  const data = aUtc(text);
  data.setUTCDate(data.getUTCDate() + dies);
  return deUtc(data);
}

/** 0 diumenge … 6 dissabte. */
export function diaSetmana(text: string): number {
  return aUtc(text).getUTCDay();
}

/** La botiga obre de dilluns a dissabte. */
export function esObert(text: string): boolean {
  return diaSetmana(text) !== 0;
}

/** Els propers `quants` dies que la botiga obre, començant per `des` (inclòs). */
export function propersDiesOberts(des: string, quants: number): string[] {
  const dies: string[] = [];
  for (let dia = des; dies.length < quants; dia = sumaDies(dia, 1)) if (esObert(dia)) dies.push(dia);
  return dies;
}

/** Data local d'un `Date` del navegador, per fer d'«avui» a la interfície. */
export function dataLocal(data: Date): string {
  const mes = String(data.getMonth() + 1).padStart(2, '0');
  const dia = String(data.getDate()).padStart(2, '0');
  return `${data.getFullYear()}-${mes}-${dia}`;
}

export type Instant = { dia: string; hora: string };

/** Si una data i hora (HH:MM) ja ha passat respecte d'`ara`. */
export function esPassat(dia: string, hora: string, ara: Instant): boolean {
  return dia < ara.dia || (dia === ara.dia && hora <= ara.hora);
}

/** Dia i hora actuals a la botiga (hora de Madrid), a partir d'un instant qualsevol. */
export function araABotiga(instant: Date): Instant {
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Madrid', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' })
      .formatToParts(instant)
      .map((p) => [p.type, p.value]),
  );
  return { dia: `${parts.year}-${parts.month}-${parts.day}`, hora: `${parts.hour}:${parts.minute}` };
}
