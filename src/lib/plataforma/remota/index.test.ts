import { horesRecollida } from '../../horari';
import { crearPlataformaProva, ErrorReserva } from '../index';
import type { ReservaLloguer } from '../esquema';
import {
  RentalAvailabilityResponseSchema,
  RentalBookingRequestSchema,
  RentalBookingResponseSchema,
  RentalCatalogResponseSchema,
  RentalHoursResponseSchema,
  RentalSettingsResponseSchema,
} from './contracte';
import { crearPlataformaRemota, resultatDelPagament } from './index';

// Una API de la plataforma falsa que respon amb les formes del contracte (es validen amb el seu
// esquema), per provar la traducció sense xarxa ni clau.

const BTT = '11111111-1111-4111-8111-111111111111';
const DOBLE = '22222222-2222-4222-8222-222222222222';
const CARRETERA = '33333333-3333-4333-8333-333333333333';
const G_PEDALS = 'a0000000-0000-4000-8000-000000000001';
const G_CASC = 'a0000000-0000-4000-8000-000000000002';
const G_ACCESSORIS = 'a0000000-0000-4000-8000-000000000003';
const PLANS = 'b0000000-0000-4000-8000-000000000001';
const SPD = 'b0000000-0000-4000-8000-000000000002';
const CASC = 'b0000000-0000-4000-8000-000000000003';
const CADENAT = 'b0000000-0000-4000-8000-000000000004';
const COMPTA = 'b0000000-0000-4000-8000-000000000005';
const RETENCIO = 'c0000000-0000-4000-8000-000000000001';

const dia = (fromUnits: number, priceCents: number) => ({ seasonId: null, unit: 'day' as const, fromUnits, priceCents });

const cataleg = RentalCatalogResponseSchema.parse({
  timeZone: 'Europe/Madrid',
  currency: 'EUR',
  models: [
    {
      id: BTT, name: 'BTT', description: 'Muntanya', imageUrl: 'https://abc.supabase.co/storage/v1/object/public/cataleg/btt.png',
      attributes: {}, variants: ['S', 'M'], rates: [dia(1, 2800), dia(2, 2520), dia(7, 2100)], turnaroundMinutes: 30,
    },
    {
      id: DOBLE, name: 'E-bike doble suspensió', description: null, imageUrl: null, attributes: {}, variants: ['M'],
      rates: [dia(1, 5500), { seasonId: null, unit: 'half_day', fromUnits: 1, priceCents: 4200 }, dia(2, 4800), dia(7, 3900)],
      turnaroundMinutes: 30,
    },
    {
      id: CARRETERA, name: 'Carretera disc', description: null, imageUrl: null,
      attributes: { category: 'carretera', slug: 'carretera', model: 'Pinarello X3' }, variants: ['54'],
      rates: [dia(1, 3500), dia(2, 2800)], turnaroundMinutes: 30,
    },
  ],
  optionGroups: [
    { id: G_PEDALS, name: 'Pedals', required: true },
    { id: G_CASC, name: 'Casc', required: false },
    { id: G_ACCESSORIS, name: 'Accessoris', required: false },
  ],
  options: [
    { id: PLANS, name: 'Pedals plans', description: null, imageUrl: null, groupId: G_PEDALS, priceCents: 0, priceUnit: 'booking', limited: false, variants: [] },
    { id: SPD, name: 'Shimano SPD', description: null, imageUrl: null, groupId: G_PEDALS, priceCents: 0, priceUnit: 'booking', limited: true, variants: [] },
    { id: CASC, name: 'Casc', description: null, imageUrl: null, groupId: G_CASC, priceCents: 0, priceUnit: 'booking', limited: true, variants: [] },
    { id: CADENAT, name: 'Cadenat', description: null, imageUrl: null, groupId: G_ACCESSORIS, priceCents: 300, priceUnit: 'booking', limited: true, variants: [] },
    { id: COMPTA, name: 'Comptaquilòmetres', description: null, imageUrl: null, groupId: G_ACCESSORIS, priceCents: 200, priceUnit: 'day', limited: true, variants: [] },
  ],
  seasons: [],
});

const feiner = (weekday: number) => ({ weekday, opensAt: '09:00', closesAt: '20:00' });
const hores = RentalHoursResponseSchema.parse({
  timeZone: 'Europe/Madrid',
  slotMinutes: 30,
  weekly: [1, 2, 3, 4, 5, 6].map(feiner),
  periods: [],
  exceptions: [
    { date: '2026-12-24', closed: false, ranges: [{ opensAt: '09:00', closesAt: '13:00' }], note: null },
    { date: '2026-12-25', closed: true, ranges: [], note: 'Nadal' },
  ],
});

const ajustos = (payment?: { mode: 'none' | 'deposit' | 'full'; depositPercent: number | null }) =>
  RentalSettingsResponseSchema.parse({
    timeZone: 'Europe/Madrid', slotMinutes: 30, maxDays: 30, minNoticeMinutes: 60, turnaroundMinutes: 30, halfDayMinutes: 240,
    holdMinutes: 15, paymentEnabled: false, participantsEnabled: false,
    ...(payment && { payment: { ...payment, cancellation: { noticeHours: 48, refundPercentInside: 100, refundPercentOutside: 0 } } }),
  });

type Crida = { metode: string; url: URL; capcaleres: Headers; cos: unknown };

function apiFalsa(respostes: Record<string, { estat?: number; cos: unknown }>) {
  const crides: Crida[] = [];
  const fetch = async (entrada: string | URL | Request, init?: RequestInit) => {
    const url = new URL(String(entrada));
    const metode = init?.method ?? 'GET';
    crides.push({ metode, url, capcaleres: new Headers(init?.headers), cos: init?.body ? JSON.parse(String(init.body)) : undefined });
    const resposta = respostes[`${metode} ${url.pathname}`];
    if (!resposta) return new Response(JSON.stringify({ error: { code: 'not_found', message: 'no hi és' } }), { status: 404 });
    return new Response(JSON.stringify(resposta.cos), { status: resposta.estat ?? 200, headers: { 'content-type': 'application/json' } });
  };
  return { fetch: fetch as typeof globalThis.fetch, crides };
}

const proves = () => crearPlataformaProva({ generaCodi: () => 'TB-PROVA', rellotge: () => new Date('2026-10-27T07:00:00Z') });
const R = '/api/public/rental';

function remota(respostes: Record<string, { estat?: number; cos: unknown }> = {}) {
  const api = apiFalsa({ [`GET ${R}/catalog`]: { cos: cataleg }, [`GET ${R}/hours`]: { cos: hores }, [`GET ${R}/settings`]: { cos: ajustos() }, ...respostes });
  const plataforma = crearPlataformaRemota({
    url: 'https://app.prova', clau: 'clau-prova', fetch: api.fetch, generaClau: () => 'clau-idempotencia-1', proves: proves(),
  });
  return { plataforma, crides: api.crides };
}

describe('plataforma remota: el catàleg', () => {
  it('cada model és una bici de la flota, amb una adreça llegible i les tarifes per trams', async () => {
    const flota = await remota().plataforma.flota();
    expect(flota.map((b) => b.id)).toEqual(['btt', 'e-bike-doble-suspensio', 'carretera']);
    expect(flota[0]).toMatchObject({ nom: 'BTT', categoria: 'muntanya', electrica: false, talles: ['S', 'M'], tarifa: { dia: 2800, de2a6: 2520, mesDe6: 2100 } });
    expect(flota[0]!.imatge).toBe('https://abc.supabase.co/storage/v1/object/public/cataleg/btt.png');
    expect(flota[1]).toMatchObject({ electrica: true, tarifa: { dia: 5500, migDia: 4200, de2a6: 4800, mesDe6: 3900 } });
    expect(flota[2]).toMatchObject({ categoria: 'carretera', model: { valor: 'Pinarello X3', ficticia: false }, tarifa: { dia: 3500, de2a6: 2800 } });
    expect(flota[2]!.tarifa.mesDe6).toBeUndefined();
  });

  it('una bici sense foto en té una de genèrica de la web', async () => {
    const bici = await remota().plataforma.bici('carretera');
    expect(bici?.imatge).toMatch(/^\/img\//);
  });

  it('els pedals són el grup obligatori; la resta, extres, amb el nom i el grup de la plataforma', async () => {
    const extres = await remota().plataforma.extres();
    expect(extres.filter((e) => e.grup === 'pedals').map((e) => e.nom)).toEqual(['Pedals plans', 'Shimano SPD']);
    expect(extres.find((e) => e.id === COMPTA)).toMatchObject({ grup: 'extres', nom: 'Comptaquilòmetres', grupId: G_ACCESSORIS, preu: 200, cobrament: 'perDia' });
    expect(extres.find((e) => e.id === CADENAT)).toMatchObject({ cobrament: 'perReserva', ficticia: false });
  });
});

describe('plataforma remota: horari i ajustos', () => {
  it("l'horari de la setmana, els dies tancats i els dies amb un altre horari", async () => {
    const horari = await remota().plataforma.horari();
    expect(horari.setmana[0]).toEqual([]);
    expect(horari.setmana[1]).toEqual([{ obre: '09:00', tanca: '20:00' }]);
    expect(horari.tancats).toContainEqual({ dia: '2026-12-25', ficticia: false });
    expect(horesRecollida('2026-12-24', horari).at(-1)).toBe('12:30');
    expect(horesRecollida('2026-12-25', horari)).toEqual([]);
  });

  it('mitjanit (24:00) es converteix en una hora vàlida', async () => {
    const tard = RentalHoursResponseSchema.parse({ ...hores, weekly: [{ weekday: 6, opensAt: '18:00', closesAt: '24:00' }], exceptions: [] });
    const { plataforma } = remota({ [`GET ${R}/hours`]: { cos: tard } });
    expect((await plataforma.horari()).setmana[6]).toEqual([{ obre: '18:00', tanca: '23:59' }]);
  });

  it('el pagament en línia només és actiu si la botiga cobra senyal o el total', async () => {
    expect((await remota().plataforma.configuracioReserves()).pagament.actiu).toBe(false);
    const { plataforma } = remota({ [`GET ${R}/settings`]: { cos: ajustos({ mode: 'deposit', depositPercent: 30 }) } });
    expect(await plataforma.configuracioReserves()).toMatchObject({
      pagament: { actiu: true, modalitats: ['senyal'], senyalPercent: 30 }, participants: { actiu: false }, retencioMinuts: 15,
    });
  });

  it("l'antelació mínima per reservar és la de la botiga", async () => {
    expect((await remota().plataforma.configuracioReserves()).antelacioMinuts).toBe(60);
  });
});

describe('plataforma remota: disponibilitat i reserva', () => {
  const recollida = { dia: '2026-11-02', hora: '09:00' };
  const retorn = { dia: '2026-11-04', hora: '19:00' };

  it('demana la disponibilitat amb les hores i la torna per talla i per extra', async () => {
    const lliures = RentalAvailabilityResponseSchema.parse({
      timeZone: 'Europe/Madrid', pickup: { date: '2026-11-02', time: '09:00' }, return: { date: '2026-11-04', time: '19:00' },
      models: [{ modelId: BTT, variants: [{ variant: 'S', free: 2 }, { variant: 'M', free: 0 }] }],
      options: [{ optionId: SPD, variants: [{ variant: null, free: 3 }] }, { optionId: PLANS, variants: [{ variant: null, free: null }] }],
    });
    const { plataforma, crides } = remota({ [`GET ${R}/availability`]: { cos: lliures } });
    expect(await plataforma.disponibilitat(recollida, retorn, ['btt'])).toEqual({ bicis: { btt: { S: 2, M: 0 } }, extres: { [SPD]: 3, [PLANS]: null } });
    const url = crides.find((c) => c.url.pathname.endsWith('/availability'))!.url;
    expect(Object.fromEntries(url.searchParams)).toEqual({ pickupDate: '2026-11-02', pickupTime: '09:00', returnDate: '2026-11-04', returnTime: '19:00', models: BTT });
  });

  const reserva: ReservaLloguer = {
    recollida, retorn,
    bicis: [{ biciId: 'btt', talla: 'M', pedals: PLANS, extres: [CADENAT], ciclista: { nom: 'Jordi', alcadaCm: 178 } }],
    comentaris: 'Arribem a les 9', nom: 'Anna Puig', telefon: '+34 600 000 000', correu: 'anna@example.com', idioma: 'ca', privacitat: true,
  };
  const feta = RentalBookingResponseSchema.parse({
    reference: '6DB3FA', status: 'pending', totalCents: 8460, currency: 'EUR', accessToken: 'x'.repeat(40), timeZone: 'Europe/Madrid',
    pickup: { date: '2026-11-02', time: '09:00' }, return: { date: '2026-11-04', time: '19:00' },
  });

  it('envia la reserva amb el contracte de la plataforma, la clau al servidor i una clau d\'idempotència', async () => {
    const { plataforma, crides } = remota({ [`POST ${R}/bookings`]: { estat: 201, cos: feta } });
    await expect(plataforma.crearReservaLloguer(reserva)).resolves.toEqual({ codi: '6DB3FA', totalCentims: 8460, estat: 'pendent' });
    const crida = crides.find((c) => c.metode === 'POST')!;
    expect(crida.url.href).toBe('https://app.prova/api/public/rental/bookings');
    expect(crida.capcaleres.get('x-api-key')).toBe('clau-prova');
    expect(crida.capcaleres.get('idempotency-key')).toBe('clau-idempotencia-1');
    expect(RentalBookingRequestSchema.parse(crida.cos)).toEqual({
      pickup: { date: '2026-11-02', time: '09:00' }, return: { date: '2026-11-04', time: '19:00' },
      items: [{ modelId: BTT, variant: 'M', options: [{ optionId: PLANS, variant: null }, { optionId: CADENAT, variant: null }], rider: { name: 'Jordi', heightCm: 178 } }],
      customer: { name: 'Anna Puig', phone: '+34 600 000 000', email: 'anna@example.com', language: 'ca' },
      notes: 'Arribem a les 9', privacyAccepted: true,
    });
  });

  it("sense pedals configurats, la bici va sense l'opció", async () => {
    const { plataforma, crides } = remota({ [`POST ${R}/bookings`]: { estat: 201, cos: feta } });
    await plataforma.crearReservaLloguer({ ...reserva, bicis: [{ ...reserva.bicis[0]!, pedals: undefined, extres: [] }] });
    expect((crides.find((c) => c.metode === 'POST')!.cos as { items: { options: unknown[] }[] }).items[0]!.options).toEqual([]);
  });

  it.each([
    [409, 'sold_out', 'esgotat'],
    [422, 'outside_hours', 'franja'],
    [422, 'invalid_option', 'extra'],
    [422, 'unknown_variant', 'talla'],
    [422, 'invalid_duration', 'durada'],
    [409, 'not_enabled', 'noDisponible'],
  ] as const)('el codi %s %s de la plataforma és el motiu «%s» de la web', async (estat, code, motiu) => {
    const { plataforma } = remota({ [`POST ${R}/bookings`]: { estat, cos: { error: { code, message: 'no' } } } });
    await expect(plataforma.crearReservaLloguer(reserva)).rejects.toMatchObject({ motiu });
  });

  it('el refús guarda el camp i la frase de la plataforma, perquè es vegin als registres', async () => {
    const problema = { code: 'outside_hours', field: 'pickup', message: 'Cal reservar amb més antelació.' };
    const { plataforma } = remota({ [`POST ${R}/bookings`]: { estat: 422, cos: { error: problema } } });
    await expect(plataforma.crearReservaLloguer(reserva)).rejects.toMatchObject({
      motiu: 'franja',
      message: expect.stringContaining('pickup: Cal reservar amb més antelació.'),
    });
  });

  it('un error de la plataforma sense motiu de la web també en guarda la frase', async () => {
    const { plataforma } = remota({ [`POST ${R}/bookings`]: { estat: 400, cos: { error: { code: 'invalid_request', field: 'items', message: 'Falta el model.' } } } });
    await expect(plataforma.crearReservaLloguer(reserva)).rejects.toThrow('items: Falta el model.');
  });

  it('un error de la clau o del servei no és culpa de qui reserva', async () => {
    const { plataforma } = remota({ [`POST ${R}/bookings`]: { estat: 401, cos: { error: { code: 'unauthorized', message: 'no' } } } });
    const error = await plataforma.crearReservaLloguer(reserva).catch((e: unknown) => e);
    expect(error).toBeInstanceOf(Error);
    expect(error).not.toBeInstanceOf(ErrorReserva);
  });

  it('retenir, pagar i consultar una retenció', async () => {
    const retinguda = { holdId: RETENCIO, status: 'active', expiresAt: '2026-10-27T07:15:00.000Z', totalCents: 8460, currency: 'EUR', timeZone: 'Europe/Madrid', pickup: feta.pickup, return: feta.return, booking: null };
    const { plataforma, crides } = remota({
      [`POST ${R}/holds`]: { estat: 201, cos: { ...retinguda, accessToken: 'y'.repeat(40) } },
      [`POST ${R}/holds/${RETENCIO}/checkout`]: { estat: 201, cos: { checkoutUrl: 'https://pagament.prova/s/1', expiresAt: '2026-10-27T07:30:00.000Z', amountCents: 2538, totalCents: 8460, currency: 'EUR', mode: 'deposit' } },
      [`GET ${R}/holds/${RETENCIO}`]: { cos: { ...retinguda, status: 'converted', booking: { reference: '6DB3FA', status: 'pending' } } },
    });
    await expect(plataforma.retenirReserva(reserva)).resolves.toEqual({ id: RETENCIO, caducaA: '2026-10-27T07:15:00.000Z', totalCentims: 8460 });
    await expect(plataforma.iniciarPagament(RETENCIO, 'senyal', 'https://web.prova/ca/reserva/pagament')).resolves.toEqual({ url: 'https://pagament.prova/s/1' });
    expect(crides.at(-1)!.cos).toEqual({ mode: 'deposit', returnUrl: 'https://web.prova/ca/reserva/pagament' });
    await expect(plataforma.estatRetencio(RETENCIO)).resolves.toEqual({ estat: 'convertida', codi: '6DB3FA' });
  });
});

describe('plataforma remota: el que encara no té API', () => {
  it('el taller, la botiga i les ressenyes surten de la implementació de proves', async () => {
    const { plataforma, crides } = remota();
    await expect(plataforma.serveisTaller()).resolves.toHaveLength(6);
    await expect(plataforma.registrarParticipants({ codi: 'X', participants: [], condicions: true } as never)).rejects.toMatchObject({ motiu: 'noDisponible' });
    expect(crides).toHaveLength(0);
  });
});

describe('plataforma remota: la tornada del pagament', () => {
  it('llegeix si s\'ha pagat o cancel·lat del paràmetre que hi afegeix la plataforma', () => {
    expect(resultatDelPagament({ retencio: 'x', nertel_checkout: 'success' })).toBe('pagat');
    expect(resultatDelPagament({ nertel_checkout: 'cancel' })).toBe('cancellat');
    expect(resultatDelPagament({})).toBeNull();
  });
});
