import { CATEGORIES_EQUIPAMENT } from '../../../content/equipament';
import { horesRecollida } from '../../horari';
import { crearPlataformaProva, ErrorReserva, type Plataforma } from '../index';
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
    { id: CASC, name: 'Casc', description: null, imageUrl: null, groupId: G_CASC, priceCents: 0, priceUnit: 'booking', limited: true, variants: ['S', 'M'] },
    { id: CADENAT, name: 'Cadenat', description: null, imageUrl: null, groupId: G_ACCESSORIS, priceCents: 300, priceUnit: 'booking', limited: true, variants: [] },
    { id: COMPTA, name: 'Comptaquilòmetres', description: null, imageUrl: null, groupId: G_ACCESSORIS, priceCents: 200, priceUnit: 'day', limited: true, variants: [] },
  ],
  seasons: [],
  shopItems: [],
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
    holdMinutes: 15, paymentEnabled: false, participantsEnabled: false, shopItemsEnabled: false,
    ...(payment && { payment: { ...payment, payAtShop: false, cancellation: { noticeHours: 48, refundPercentInside: 100, refundPercentOutside: 0 } } }),
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

function remota(
  respostes: Record<string, { estat?: number; cos: unknown }> = {},
  { clauCites, compilant }: { clauCites?: string; compilant?: boolean } = {},
) {
  const totes = { [`GET ${R}/catalog`]: { cos: cataleg }, [`GET ${R}/hours`]: { cos: hores }, [`GET ${R}/settings`]: { cos: ajustos() }, ...respostes };
  const api = apiFalsa(totes);
  const plataforma = crearPlataformaRemota({
    url: 'https://app.prova', clau: 'clau-prova', clauCites, compilant, fetch: api.fetch, generaClau: () => 'clau-idempotencia-1', proves: proves(),
  });
  return { plataforma, crides: api.crides, respostes: totes };
}

/** Quantes vegades s'ha demanat cada ruta de lectura (`GET`). */
const lectures = (crides: Crida[]) =>
  crides.filter((c) => c.metode === 'GET').reduce<Record<string, number>>((n, c) => ({ ...n, [c.url.pathname.replace(R, '')]: (n[c.url.pathname.replace(R, '')] ?? 0) + 1 }), {});

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

describe('plataforma remota: els camps nous del catàleg (13-11-2026)', () => {
  // La referència, la categoria, l'ordre, «Elèctrica» i els grups de tria múltiple. Fins que la botiga
  // no els ompli arriben nuls o no hi són, i llavors la web fa com abans (els casos de dalt).
  const ambCamps = RentalCatalogResponseSchema.parse({
    ...cataleg,
    models: [
      { ...cataleg.models[0]!, name: 'BTT rígida', sku: 'btt', category: 'Muntanya', position: 1 },
      { ...cataleg.models[1]!, name: 'Urbana', sku: 'e-urbana', category: 'Passeig', position: 2, attributes: { 'elèctrica': true } },
      { ...cataleg.models[2]!, name: 'Road disc', sku: null, category: 'Carretera', position: null, attributes: { 'elèctrica': false } },
    ],
    optionGroups: cataleg.optionGroups.map((g) => (g.id === G_ACCESSORIS ? { ...g, multiple: true } : { ...g, multiple: false })),
  });
  const amb = () => remota({ [`GET ${R}/catalog`]: { cos: ambCamps } }).plataforma;

  it("l'adreça surt de la referència; sense, del nom; i en l'ordre de la botiga", async () => {
    expect((await amb().flota()).map((b) => b.id)).toEqual(['btt', 'e-urbana', 'road-disc']);
  });

  it("la categoria i si és elèctrica surten dels camps del catàleg, no del nom", async () => {
    const [btt, urbana, carretera] = await amb().flota();
    expect(btt).toMatchObject({ categoria: 'muntanya', electrica: false });
    expect(urbana).toMatchObject({ categoria: 'passeig', electrica: true });
    expect(carretera).toMatchObject({ categoria: 'carretera', electrica: false });
  });

  it("una adreça d'abans (feta amb el nom) encara troba la bici", async () => {
    expect((await amb().bici('urbana'))?.id).toBe('e-urbana');
    expect(await amb().bici('no-hi-es')).toBeNull();
  });

  it('cada extra porta el nom del seu grup, per agrupar-los al formulari', async () => {
    const extres = await amb().extres();
    expect(extres.find((e) => e.id === CADENAT)?.grupNom).toBe('Accessoris');
    expect(extres.find((e) => e.id === CASC)?.grupNom).toBe('Casc');
  });

  it("d'un grup de tria múltiple se'n poden triar diversos: els seus extres no porten grup", async () => {
    const extres = await amb().extres();
    expect(extres.find((e) => e.id === CADENAT)?.grupId).toBeUndefined();
    expect(extres.find((e) => e.id === CASC)?.grupId).toBe(G_CASC);
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
      options: [
        { optionId: SPD, variants: [{ variant: null, free: 3 }] },
        { optionId: PLANS, variants: [{ variant: null, free: null }] },
        { optionId: CASC, variants: [{ variant: 'S', free: 1 }, { variant: 'M', free: 4 }] },
      ],
      shopItems: [],
    });
    const { plataforma, crides } = remota({ [`GET ${R}/availability`]: { cos: lliures } });
    expect(await plataforma.disponibilitat(recollida, retorn, ['btt'])).toEqual({
      bicis: { btt: { S: 2, M: 0 } },
      extres: { [SPD]: 3, [PLANS]: null, [CASC]: 5 },
      variantsExtres: { [CASC]: { S: 1, M: 4 } },
      nutricio: {},
    });
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

  it('envia la variant triada de cada opció que en té', async () => {
    const { plataforma, crides } = remota({ [`POST ${R}/bookings`]: { estat: 201, cos: feta } });
    await plataforma.crearReservaLloguer({ ...reserva, bicis: [{ ...reserva.bicis[0]!, extres: [CASC, CADENAT], variants: { [CASC]: 'M' } }] });
    expect((crides.find((c) => c.metode === 'POST')!.cos as { items: { options: unknown[] }[] }).items[0]!.options).toEqual([
      { optionId: PLANS, variant: null },
      { optionId: CASC, variant: 'M' },
      { optionId: CADENAT, variant: null },
    ]);
  });

  it("la nutrició hi és apagada fins que la plataforma en porti l'estoc, i no se n'envia cap", async () => {
    const { plataforma, crides } = remota({ [`POST ${R}/bookings`]: { estat: 201, cos: feta } });
    expect((await plataforma.configuracioReserves()).nutricio.actiu).toBe(false);
    await expect(plataforma.crearReservaLloguer({ ...reserva, nutricio: [{ producteId: 'maurten-gel-100', sabor: 'neutre', quantitat: 1 }] })).rejects.toMatchObject({
      motiu: 'noDisponible',
    });
    expect(crides.some((c) => c.metode === 'POST')).toBe(false);
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
    const retinguda = { holdId: RETENCIO, status: 'active', expiresAt: '2026-10-27T07:15:00.000Z', totalCents: 8460, rentalCents: 8460, shopCents: 0, currency: 'EUR', timeZone: 'Europe/Madrid', pickup: feta.pickup, return: feta.return, booking: null };
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

describe('plataforma remota: la nutrició amb el lloguer (articles de botiga)', () => {
  const GEL = 'e0000000-0000-4000-8000-000000000001';
  const COLA = 'e1000000-0000-4000-8000-000000000001';
  const LLIMONA = 'e1000000-0000-4000-8000-000000000002';
  const BARRETA = 'e0000000-0000-4000-8000-000000000002';
  const BARRETA_UNICA = 'e1000000-0000-4000-8000-000000000003';
  const ambArticles = RentalCatalogResponseSchema.parse({
    ...cataleg,
    shopItems: [
      {
        id: GEL, name: 'Gel 100', description: 'Hidrogel', imageUrl: 'https://abc.supabase.co/storage/v1/object/public/cataleg/gel.png',
        category: 'Nutrició', attributes: { marca: 'Maurten', format: '40 g', carbohidrats: 25, 'cafeïna': 0 }, priceCents: 350, maxPerLine: 10,
        kind: 'article', priceUnit: 'unit',
        variants: [{ id: COLA, label: 'Cola', priceCents: null }, { id: LLIMONA, label: 'Llimona', priceCents: 380 }],
      },
      {
        id: BARRETA, name: 'Barreta de civada', description: null, imageUrl: null, category: null, attributes: {}, priceCents: 250, maxPerLine: 10,
        variants: [{ id: BARRETA_UNICA, label: null, priceCents: null }],
      },
    ],
  });
  const ajustosAmbArticles = { ...ajustos(), shopItemsEnabled: true };
  const amb = (mes: Record<string, { estat?: number; cos: unknown }> = {}) =>
    remota({ [`GET ${R}/catalog`]: { cos: ambArticles }, [`GET ${R}/settings`]: { cos: ajustosAmbArticles }, ...mes });

  it('els articles de la plataforma són la nutrició: marca, format, sabors i el preu de cada sabor', async () => {
    const [gel, barreta] = await amb().plataforma.nutricio();
    expect(gel).toMatchObject({ id: GEL, marca: 'Maurten', nom: 'Gel 100', tipus: 'gel', format: '40 g', carbohidratsG: 25, preu: 350, ficticia: false });
    expect(gel!.sabors).toEqual([
      { id: COLA, nom: 'Cola', estoc: null },
      { id: LLIMONA, nom: 'Llimona', preu: 380, estoc: null },
    ]);
    // Sense marca ni tipus escrits, es dedueixen del nom; un producte sense sabors en té un de sol, sense nom.
    expect(barreta).toMatchObject({ marca: '', tipus: 'barreta', sabors: [{ id: BARRETA_UNICA, nom: '', estoc: null }] });
  });

  it('la nutrició és activa quan la botiga ven articles amb el lloguer i en té algun', async () => {
    expect((await amb().plataforma.configuracioReserves()).nutricio.actiu).toBe(true);
    const sense = remota({ [`GET ${R}/catalog`]: { cos: ambArticles } });
    expect((await sense.plataforma.configuracioReserves()).nutricio.actiu).toBe(false);
  });

  it('el que queda de cada sabor surt de la disponibilitat de la plataforma', async () => {
    const lliures = RentalAvailabilityResponseSchema.parse({
      timeZone: 'Europe/Madrid', pickup: { date: '2026-11-02', time: '09:00' }, return: { date: '2026-11-04', time: '19:00' },
      models: [], options: [], shopItems: [{ variantId: COLA, free: 4 }, { variantId: LLIMONA, free: 0 }, { variantId: BARRETA_UNICA, free: null }],
    });
    const { plataforma } = amb({ [`GET ${R}/availability`]: { cos: lliures } });
    const d = await plataforma.disponibilitat({ dia: '2026-11-02', hora: '09:00' }, { dia: '2026-11-04', hora: '19:00' }, []);
    expect(d.nutricio).toEqual({ [GEL]: { [COLA]: 4, [LLIMONA]: 0 }, [BARRETA]: { [BARRETA_UNICA]: null } });
  });

  it('la reserva envia la nutrició com a línies de botiga, amb el sabor i la quantitat, sense el preu', async () => {
    const feta = RentalBookingResponseSchema.parse({
      reference: '6DB3FB', status: 'pending', totalCents: 9160, currency: 'EUR', accessToken: 'x'.repeat(40), timeZone: 'Europe/Madrid',
      pickup: { date: '2026-11-02', time: '09:00' }, return: { date: '2026-11-04', time: '19:00' },
    });
    const { plataforma, crides } = amb({ [`POST ${R}/bookings`]: { estat: 201, cos: feta } });
    await plataforma.crearReservaLloguer({
      recollida: { dia: '2026-11-02', hora: '09:00' }, retorn: { dia: '2026-11-04', hora: '19:00' },
      bicis: [{ biciId: 'btt', talla: 'M', pedals: PLANS, extres: [], ciclista: {} }],
      nutricio: [{ producteId: GEL, sabor: LLIMONA, quantitat: 2 }, { producteId: BARRETA, sabor: BARRETA_UNICA, quantitat: 1 }],
      nom: 'Anna Puig', telefon: '+34 600 000 000', correu: 'anna@example.com', idioma: 'ca', privacitat: true,
    });
    const cos = RentalBookingRequestSchema.parse(crides.find((c) => c.metode === 'POST')!.cos);
    expect(cos.shopItems).toEqual([{ variantId: LLIMONA, quantity: 2 }, { variantId: BARRETA_UNICA, quantity: 1 }]);
  });
});

describe('plataforma remota: les bicis en venda', () => {
  const bici = (n: number, mes: Record<string, unknown> = {}) => ({
    id: `f0000000-0000-4000-8000-00000000000${n}`, name: `Bici ${n}`, description: null, imageUrl: null, category: 'Bicicletes',
    attributes: {}, priceCents: 150000, priceBasis: 'exact', vatIncluded: true, ...mes,
  });
  const ambVenda = (saleProducts: unknown[]) => ({ [`GET ${R}/catalog`]: { cos: { ...cataleg, saleProducts } } });

  it('les bicis en venda són els productes de venda de la categoria de bicis, no la flota de lloguer', async () => {
    const { plataforma } = remota(ambVenda([
      bici(1, {
        name: 'Orbea Oiz M30', description: 'Doble suspensió de carboni', imageUrl: 'https://abc.supabase.co/storage/v1/object/public/cataleg/oiz.png',
        attributes: { marca: 'Orbea', any: 2026, quadre: 'Carboni', 'elèctrica': false }, priceBasis: 'from', variantName: 'Talles',
        variants: [{ id: 'f1000000-0000-4000-8000-000000000001', label: 'M', priceCents: null, sku: null }, { id: 'f1000000-0000-4000-8000-000000000002', label: 'L', priceCents: 320000, sku: null }],
      }),
      bici(2, { category: 'Cascs' }),
      bici(3, { category: 'bicis de segona mà', name: 'Trek Domane', priceCents: null, priceBasis: 'on_request' }),
    ]));
    const bicis = await plataforma.bicisVenda();
    expect(bicis.map((b) => b.id)).toEqual(['orbea-oiz-m30', 'trek-domane']);
    expect(bicis[0]).toMatchObject({
      nom: 'Orbea Oiz M30', marca: 'Orbea', preu: 150000, preuBase: 'desDe', ivaInclos: true, descripcio: 'Doble suspensió de carboni', nomVariants: 'Talles',
      variants: [{ nom: 'M', preu: null }, { nom: 'L', preu: 320000 }], ficticia: false,
    });
    expect(bicis[0]!.fitxa).toEqual([{ camp: 'any', valor: '2026' }, { camp: 'quadre', valor: 'Carboni' }, { camp: 'elèctrica', valor: false }]);
    expect(bicis[1]).toMatchObject({ preu: null, preuBase: 'consultar', variants: [] });
    expect(await plataforma.bicisVenda()).toEqual(bicis);
    expect((await plataforma.biciVenda('trek-domane'))?.nom).toBe('Trek Domane');
    expect(await plataforma.biciVenda('no-hi-es')).toBeNull();
  });

  it("porta si es pot comprar, quantes n'hi ha (de la bici i de cada talla) i totes les fotos (plataforma v1.0.14)", async () => {
    const foto = (n: number) => `https://abc.supabase.co/storage/v1/object/public/cataleg/bici-${n}.png`;
    const { plataforma } = remota(ambVenda([
      bici(1, {
        name: 'Gravel', imageUrl: foto(1), images: [foto(1), foto(2)], availability: 'available', stock: 3,
        variants: [
          { id: 'f1000000-0000-4000-8000-000000000001', label: 'M', priceCents: null, sku: null, stock: 0 },
          { id: 'f1000000-0000-4000-8000-000000000002', label: 'L', priceCents: null, sku: null, stock: null },
        ],
      }),
      bici(2, { name: 'Carretera', availability: 'on_order', stock: null }),
      bici(3, { name: 'BTT', availability: 'unavailable', stock: 0 }),
      bici(4, { name: 'Urbana' }),
    ]));
    const [gravel, carretera, btt, urbana] = await plataforma.bicisVenda();
    expect(gravel).toMatchObject({ disponibilitat: 'disponible', estoc: 3, imatge: foto(1), imatges: [foto(1), foto(2)] });
    expect(gravel!.variants).toEqual([{ nom: 'M', preu: null, estoc: 0 }, { nom: 'L', preu: null, estoc: null }]);
    expect(carretera).toMatchObject({ disponibilitat: 'perEncarrec', estoc: null, imatges: [] });
    expect(btt).toMatchObject({ disponibilitat: 'esgotada', estoc: 0 });
    // Una resposta d'abans de la v1.0.14 no diu res: no s'inventa ni que n'hi ha ni que no.
    expect(urbana!.disponibilitat).toBeUndefined();
    expect(urbana!.estoc).toBeNull();
  });

  it('mentre la botiga no en té cap al catàleg, surten les de prova, marcades com a mostra', async () => {
    const { plataforma } = remota(ambVenda([bici(2, { category: 'Cascs' })]));
    const bicis = await plataforma.bicisVenda();
    expect(bicis.length).toBeGreaterThan(0);
    expect(bicis.every((b) => b.ficticia)).toBe(true);
  });
});

describe("plataforma remota: la botiga d'equipament", () => {
  const venda = (id: string, categoria: string | null, marca: string, preu: number | null, base: 'exact' | 'from' | 'on_request' = 'exact') => ({
    id, name: `Article ${id.slice(-1)}`, description: null, imageUrl: 'https://abc.supabase.co/storage/v1/object/public/cataleg/a.png',
    category: categoria, attributes: { marca }, priceCents: preu, priceBasis: base, vatIncluded: true,
  });
  const ambVenda = (saleProducts: unknown[]) => ({ [`GET ${R}/catalog`]: { cos: { ...cataleg, saleProducts } } });

  it('els articles i els preus surten dels productes de venda de la plataforma, per categoria', async () => {
    const { plataforma } = remota(ambVenda([
      venda('d0000000-0000-4000-8000-000000000001', 'Cascs', 'POC', 27000),
      venda('d0000000-0000-4000-8000-000000000002', 'Nutrició', 'Maurten', 350),
      venda('d0000000-0000-4000-8000-000000000003', 'cascs', 'Kask', 19900, 'from'),
      venda('d0000000-0000-4000-8000-000000000004', 'Cascs', 'Kask', null, 'on_request'),
    ]));
    const cascs = await plataforma.articles('cascs');
    expect(cascs.map((a) => [a.marca, a.preu, a.preuBase, a.ficticia])).toEqual([
      ['POC', 27000, 'exacte', false],
      ['Kask', 19900, 'desDe', false],
      ['Kask', null, 'consultar', false],
    ]);
    expect(cascs[0]!.imatge).toContain('supabase.co');
  });

  it("mentre la plataforma no en té cap d'una categoria, surten els de prova, de mostra", async () => {
    const { plataforma } = remota(ambVenda([]));
    const roba = await plataforma.articles('roba');
    expect(roba.length).toBeGreaterThan(0);
    expect(roba.every((a) => a.ficticia)).toBe(true);
  });
});

describe('plataforma remota: el que encara no té API', () => {
  it('els participants encara no hi són', async () => {
    const { plataforma, crides } = remota();
    await expect(plataforma.registrarParticipants({ codi: 'X', participants: [], condicions: true } as never)).rejects.toMatchObject({ motiu: 'noDisponible' });
    expect(crides).toHaveLength(0);
  });
});

describe('plataforma remota: el taller', () => {
  const B = '/api/public/bookings';
  const servei = (category: string | null, priceCents: number | null, priceBasis: 'exact' | 'from' | 'on_request', extra: object = {}) => ({
    id: crypto.randomUUID(), name: `Servei ${category}`, description: null, imageUrl: null, category, attributes: {},
    priceCents, priceBasis, priceUnit: 'unit', vatIncluded: true, priceHidden: false, ...extra,
  });
  const ambServeis = (workshopServices: unknown[]) => ({ [`GET ${R}/catalog`]: { cos: RentalCatalogResponseSchema.parse({ ...cataleg, workshopServices }) } });

  it('els preus del taller són els del catàleg de la plataforma, per peça; sense, no se n’inventa cap', async () => {
    const serveis = await remota(
      ambServeis([
        servei('Frens', 2500, 'from'),
        servei('Rodes', 1200, 'exact'),
        servei('Transmissió', null, 'on_request'),
        servei('Seient', 6000, 'exact', { priceHidden: true }),
        servei('Rentat', 1000, 'exact'),
      ]),
    ).plataforma.serveisTaller();
    expect(serveis.map((x) => [x.peca, x.preu, x.preuBase, x.ficticia])).toEqual([
      ['frens', 2500, 'desDe', false],
      ['rodes', 1200, 'exacte', false],
      ['transmissio', null, 'consultar', false],
      ['seient', null, 'consultar', false],
    ]);
    await expect(remota(ambServeis([])).plataforma.serveisTaller()).resolves.toEqual([]);
  });

  const lliures = {
    timeZone: 'Europe/Madrid', today: '2026-11-13',
    service: { key: 'cita-de-taller', name: 'Cita de taller', durationMinutes: 60 },
    days: [{ date: '2026-11-17', closed: false, times: ['09:00', '10:00', '16:00'] }],
  };

  it('les hores lliures surten de la plataforma, amb la clau de cites', async () => {
    const { plataforma, crides } = remota({ [`GET ${B}/availability`]: { cos: lliures } }, { clauCites: 'clau-cites' });
    expect(await plataforma.frangesTaller('2026-11-17')).toEqual([
      { inici: '09:00', places: null },
      { inici: '10:00', places: null },
      { inici: '16:00', places: null },
    ]);
    const crida = crides.find((c) => c.url.pathname === `${B}/availability`)!;
    expect(Object.fromEntries(crida.url.searchParams)).toEqual({ from: '2026-11-17', to: '2026-11-17' });
    expect(crida.capcaleres.get('x-api-key')).toBe('clau-cites');
  });

  it('un dia que el taller tanca no té hores', async () => {
    const tancat = { ...lliures, days: [{ date: '2026-11-17', closed: true, times: [] }] };
    expect(await remota({ [`GET ${B}/availability`]: { cos: tancat } }, { clauCites: 'c' }).plataforma.frangesTaller('2026-11-17')).toEqual([]);
  });

  const cita = {
    tipusBici: 'gravel' as const, serveis: ['frens' as const, 'rodes' as const], nota: 'Grinyolen els frens', dia: '2026-11-17', hora: '10:00',
    nom: 'Anna Puig', telefon: '+34 600 000 000', correu: 'anna@example.com', idioma: 'ca' as const, privacitat: true as const,
  };
  const feta = {
    reference: '6DB3FA', status: 'confirmed', pendingConfirmation: false, service: 'cita-de-taller', date: '2026-11-17', time: '10:00',
    endTime: '11:00', timeZone: 'Europe/Madrid', startsAt: '2026-11-17T09:00:00Z', endsAt: '2026-11-17T10:00:00Z',
  };

  it('la cita es desa a la plataforma, amb el servei, la bici i el que li passa, una sola vegada', async () => {
    const { plataforma, crides } = remota({ [`GET ${B}/availability`]: { cos: lliures }, [`POST ${B}`]: { estat: 201, cos: feta } }, { clauCites: 'clau-cites' });
    expect(await plataforma.crearCitaTaller(cita)).toEqual({ codi: '6DB3FA', estat: 'confirmada' });
    const post = crides.find((c) => c.metode === 'POST')!;
    expect(post.capcaleres.get('idempotency-key')).toBe('clau-idempotencia-1');
    expect(post.cos).toEqual({
      service: 'cita-de-taller', date: '2026-11-17', time: '10:00',
      customer: { name: 'Anna Puig', phone: '+34 600 000 000', email: 'anna@example.com' },
      note: 'Grinyolen els frens',
      details: { bici: 'gravel', serveis: 'frens, rodes', idioma: 'ca' },
      privacyAccepted: true,
    });
  });

  it('una cita que el taller ha de confirmar queda pendent', async () => {
    const pendent = { ...feta, status: 'pending', pendingConfirmation: true };
    const { plataforma } = remota({ [`GET ${B}/availability`]: { cos: lliures }, [`POST ${B}`]: { estat: 201, cos: pendent } }, { clauCites: 'c' });
    expect(await plataforma.crearCitaTaller(cita)).toEqual({ codi: '6DB3FA', estat: 'pendent' });
  });

  it('una hora plena és un error de franja; un telèfon que no val, de dades', async () => {
    const error = (code: string, field?: string) => ({ error: { code, message: 'no', ...(field && { field }) } });
    const ple = remota({ [`GET ${B}/availability`]: { cos: lliures }, [`POST ${B}`]: { estat: 409, cos: error('full') } }, { clauCites: 'c' });
    await expect(ple.plataforma.crearCitaTaller(cita)).rejects.toMatchObject({ motiu: 'franja' });
    const mal = remota({ [`GET ${B}/availability`]: { cos: lliures }, [`POST ${B}`]: { estat: 422, cos: error('invalid_request', 'customer.phone') } }, { clauCites: 'c' });
    await expect(mal.plataforma.crearCitaTaller(cita)).rejects.toMatchObject({ motiu: 'dades' });
  });

  it('sense la clau de cites, no es fan veure hores ni es desa res en memòria: la cita no es perd', async () => {
    const { plataforma, crides } = remota();
    expect(await plataforma.frangesTaller('2026-11-17')).toBeNull();
    await expect(plataforma.crearCitaTaller(cita)).rejects.toMatchObject({ motiu: 'noDisponible' });
    expect(crides.filter((c) => c.url.pathname.startsWith(B))).toHaveLength(0);
  });
});

describe('plataforma remota: una compilació llegeix el catàleg una vegada (16-11-2026)', () => {
  // El 16-11-2026, dues previsualitzacions de Vercel van fer 593 crides al catàleg de producció:
  // a Vercel, la memòria de `fetch` de Next no torna res durant la compilació, i cada pàgina hi
  // tornava. Això fa el que fan les pàgines en generar-se: els quatre idiomes, la portada, una fitxa
  // per bici (amb les metadades) i una pàgina per categoria de la botiga.
  const IDIOMES = ['ca', 'es', 'en', 'fr'];
  async function generaTotesLesPagines(p: Plataforma) {
    const bicis = await p.flota(); // generateStaticParams de la fitxa
    await Promise.all(
      IDIOMES.flatMap(() => [
        Promise.all([p.flota(), p.serveisTaller(), p.valoracio(), p.ressenyes()]),
        ...bicis.map((b) => Promise.all([p.bici(b.id), p.bici(b.id), p.flota(), p.extres(), p.horari(), p.configuracioReserves(), p.nutricio()])),
        ...CATEGORIES_EQUIPAMENT.map((c) => Promise.all([c === 'nutricio' ? p.nutricio() : p.articles(c), p.configuracioReserves()])),
      ]),
    );
  }

  it("durant la compilació, el catàleg, l'horari i els ajustos es demanen una sola vegada", async () => {
    const { plataforma, crides } = remota({}, { compilant: true });
    await generaTotesLesPagines(plataforma);
    await generaTotesLesPagines(plataforma); // les pàgines que es generen quan les primeres ja han acabat
    expect(lectures(crides)).toEqual({ '/catalog': 1, '/hours': 1, '/settings': 1 });
  });

  it('fora de la compilació, les lectures simultànies en fan una; la següent torna a la plataforma', async () => {
    const { plataforma, crides } = remota();
    await Promise.all([plataforma.flota(), plataforma.extres(), plataforma.bici('btt'), plataforma.horari(), plataforma.horari()]);
    expect(lectures(crides)).toEqual({ '/catalog': 1, '/hours': 1 });
    await plataforma.flota();
    expect(lectures(crides)['/catalog']).toBe(2);
  });

  it('una lectura que falla no es guarda: la següent ho torna a provar', async () => {
    const { plataforma, crides, respostes } = remota({ [`GET ${R}/catalog`]: { estat: 503, cos: { error: { code: 'unavailable', message: 'ocupada' } } } }, { compilant: true });
    await expect(plataforma.flota()).rejects.toThrow(/503/);
    respostes[`GET ${R}/catalog`] = { cos: cataleg };
    expect(await plataforma.flota()).toHaveLength(3);
    expect(lectures(crides)['/catalog']).toBe(2);
  });

  it('la disponibilitat no es comparteix mai, ni compilant: és sempre en directe', async () => {
    const lliures = RentalAvailabilityResponseSchema.parse({
      timeZone: 'Europe/Madrid', pickup: { date: '2026-11-20', time: '10:00' }, return: { date: '2026-11-21', time: '10:00' }, models: [], options: [], shopItems: [],
    });
    const { plataforma, crides } = remota({ [`GET ${R}/availability`]: { cos: lliures } }, { compilant: true });
    const franja = [{ dia: '2026-11-20', hora: '10:00' }, { dia: '2026-11-21', hora: '10:00' }] as const;
    await Promise.all([plataforma.disponibilitat(...franja, ['btt']), plataforma.disponibilitat(...franja, ['btt'])]);
    expect(lectures(crides)['/availability']).toBe(2);
  });
});

describe('plataforma remota: la tornada del pagament', () => {
  it('llegeix si s\'ha pagat o cancel·lat del paràmetre que hi afegeix la plataforma', () => {
    expect(resultatDelPagament({ retencio: 'x', nertel_checkout: 'success' })).toBe('pagat');
    expect(resultatDelPagament({ nertel_checkout: 'cancel' })).toBe('cancellat');
    expect(resultatDelPagament({})).toBeNull();
  });
});
