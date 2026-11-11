import { biciLloguer, categoriaLloguer, type BiciLloguer, type CategoriaLloguer, type Extra, type HorariBotiga, type ReservaLloguer, type Tarifa } from '../esquema';
import { ErrorReserva, type Plataforma } from '../interficie';
import {
  RentalAvailabilityResponseSchema,
  RentalBookingRequestSchema,
  RentalBookingResponseSchema,
  RentalCatalogResponseSchema,
  RentalCheckoutResponseSchema,
  RentalErrorResponseSchema,
  RentalHoldCreatedResponseSchema,
  RentalHoldSchema,
  RentalHoursResponseSchema,
  RentalSettingsResponseSchema,
  type RentalBookingRequest,
  type RentalCatalogResponse,
  type RentalErrorCode,
  type RentalHoursResponse,
} from './contracte';

// Implementació remota de la plataforma: l'API de lloguer de app.nertel.ai
// (`/api/public/rental/*`, contracte a ./contracte.ts). Sempre des del servidor: la clau només és en
// variables d'entorn sense `NEXT_PUBLIC_`, que Next no posa mai al codi del navegador.
//
// El que la plataforma encara no té a l'API (el taller, la botiga d'equipament, les ressenyes i els
// participants) surt de la implementació de proves.

/** Quant temps es reaprofita el catàleg, l'horari i els ajustos: el que hi canviï a la plataforma surt a la web en aquest temps. */
const REVALIDA_S = 300;
/** La foto d'una bici que a la plataforma no en té. */
const SENSE_FOTO = '/img/flota/sense-foto.svg';

type Opcions = {
  /** L'arrel de la plataforma: `https://app.nertel.ai`. */
  url: string;
  /** La clau lligada a la botiga, amb els abasts `rental_read` i `rental_write`. */
  clau: string;
  /** La implementació del que la plataforma encara no té a l'API. */
  proves: Plataforma;
  fetch?: typeof globalThis.fetch;
  /** Una clau d'idempotència per a cada enviament d'una reserva. */
  generaClau?: () => string;
};

type Model = RentalCatalogResponse['models'][number];

/** Els codis de la plataforma que són culpa del que s'ha demanat, amb el motiu que la web sap ensenyar. */
const MOTIUS: Partial<Record<RentalErrorCode, ErrorReserva['motiu']>> = {
  unknown_model: 'bici',
  unknown_variant: 'talla',
  sold_out: 'esgotat',
  invalid_option: 'extra',
  outside_hours: 'franja',
  invalid_duration: 'durada',
  not_enabled: 'noDisponible',
  payment_mode_not_allowed: 'noDisponible',
  hold_expired: 'retencio',
  not_found: 'retencio',
};

/** Adreça llegible d'un model: la que hi posi la botiga (`attributes.slug`) o el nom sense accents. */
export function slugDe(model: Pick<Model, 'name' | 'attributes'>): string {
  const triat = model.attributes.slug;
  const base = typeof triat === 'string' && triat.trim() ? triat : model.name;
  return base
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

/**
 * Categoria per als filtres de la flota: la de `attributes.category`, si la botiga l'hi posa; si
 * no, se'n dedueix del nom, mentre la plataforma no la tingui.
 */
export function categoriaDe(model: Pick<Model, 'name' | 'attributes'>): CategoriaLloguer {
  const triada = categoriaLloguer.safeParse(model.attributes.category);
  if (triada.success) return triada.data;
  const nom = model.name.toLowerCase();
  if (/carretera|road|ruta/.test(nom)) return 'carretera';
  if (/gravel/.test(nom)) return 'gravel';
  if (/urban|passeig|paseo|ciutat|ciudad|city/.test(nom)) return 'passeig';
  return 'muntanya';
}

/** Si és elèctrica: `attributes.electric`, o un nom com «E-bike» o «E-gravel». */
export function electricaDe(model: Pick<Model, 'name' | 'attributes'>): boolean {
  const marcada = model.attributes.electric;
  if (typeof marcada === 'boolean') return marcada;
  return /^e-|el[eè]ctric/i.test(model.name.trim());
}

/** Les tarifes de tot l'any, en els trams de la web (1 dia, de 2 a 6, més de 6 i mig dia). */
export function tarifaDe(model: Model): Tarifa | null {
  const tot = model.rates.filter((r) => r.seasonId === null);
  const dies = tot.filter((r) => r.unit === 'day').sort((a, b) => a.fromUnits - b.fromUnits);
  const primer = dies[0];
  if (!primer) return null;
  const tram = (des: number, fins: number) => dies.filter((r) => r.fromUnits >= des && r.fromUnits <= fins).at(-1)?.priceCents;
  const migDia = tot.find((r) => r.unit === 'half_day')?.priceCents;
  return {
    dia: primer.priceCents,
    ...(migDia !== undefined && { migDia }),
    ...(tram(2, 6) !== undefined && { de2a6: tram(2, 6) }),
    ...(tram(7, Infinity) !== undefined && { mesDe6: tram(7, Infinity) }),
  };
}

/** L'horari de la plataforma en la forma de la web. Els dies especials amb trams, com un període d'un dia. */
export function horariDe(hores: RentalHoursResponse): HorariBotiga {
  // A la web, el diumenge és 0; a la plataforma, 7. Mitjanit (24:00) es queda en 23:59.
  const tanca = (h: string) => (h === '24:00' ? '23:59' : h);
  const setmana = (trams: RentalHoursResponse['weekly']) =>
    Array.from({ length: 7 }, (_, dia) =>
      trams.filter((t) => t.weekday % 7 === dia).map((t) => ({ obre: t.opensAt, tanca: tanca(t.closesAt) })),
    );
  const especials = hores.exceptions
    .filter((e) => !e.closed)
    .map((e) => ({ des: e.date, fins: e.date, setmana: Array.from({ length: 7 }, () => e.ranges.map((r) => ({ obre: r.opensAt, tanca: tanca(r.closesAt) }))) }));
  return {
    setmana: setmana(hores.weekly),
    // Els dies especials, primer: manen sobre els períodes.
    periodes: [...especials, ...hores.periods.map((p) => ({ des: p.startsOn, fins: p.endsOn, setmana: setmana(p.weekly) }))],
    tancats: hores.exceptions.filter((e) => e.closed).map((e) => ({ dia: e.date, ficticia: false })),
    pasMinuts: hores.slotMinutes,
  };
}

/** En tornar de la pàgina de pagament, la plataforma hi afegeix si s'ha pagat o s'ha cancel·lat. */
export function resultatDelPagament(parametres: Record<string, string | string[] | undefined>): 'pagat' | 'cancellat' | null {
  const valor = parametres.nertel_checkout;
  if (valor === 'success') return 'pagat';
  if (valor === 'cancel') return 'cancellat';
  return null;
}

export function crearPlataformaRemota({ url, clau, proves, fetch = globalThis.fetch, generaClau = () => crypto.randomUUID() }: Opcions): Plataforma {
  async function crida(ruta: string, { metode = 'GET', cos, idempotencia, revalida }: { metode?: string; cos?: unknown; idempotencia?: string; revalida?: boolean } = {}) {
    const resposta = await fetch(new URL(`/api/public/rental${ruta}`, url), {
      method: metode,
      headers: {
        'x-api-key': clau,
        accept: 'application/json',
        ...(cos !== undefined && { 'content-type': 'application/json' }),
        ...(idempotencia && { 'Idempotency-Key': idempotencia }),
      },
      body: cos === undefined ? undefined : JSON.stringify(cos),
      ...(revalida ? { next: { revalidate: REVALIDA_S } } : { cache: 'no-store' as const }),
    });
    const json: unknown = await resposta.json().catch(() => null);
    if (resposta.ok) return json;
    const problema = RentalErrorResponseSchema.safeParse(json);
    const codi = problema.success ? problema.data.error.code : undefined;
    const detall = problema.success ? [problema.data.error.field, problema.data.error.message].filter(Boolean).join(': ') : undefined;
    const motiu = codi && MOTIUS[codi];
    if (motiu) throw new ErrorReserva(motiu, detall);
    // La clau, el servei o un cos mal format: no és culpa de qui reserva.
    throw new Error(`La plataforma ha respost ${resposta.status} ${codi ?? ''} a ${metode} ${ruta}${detall ? ` (${detall})` : ''}`.replace(/ {2,}/g, ' '));
  }

  const cataleg = async () => RentalCatalogResponseSchema.parse(await crida('/catalog', { revalida: true }));

  /** Les bicis de la web amb el seu model de la plataforma, per traduir l'adreça llegible a l'identificador. */
  async function bicis(): Promise<{ bici: BiciLloguer; model: Model }[]> {
    const vistes = new Set<string>();
    const resultat: { bici: BiciLloguer; model: Model }[] = [];
    for (const model of (await cataleg()).models) {
      const tarifa = tarifaDe(model);
      if (!tarifa) continue; // sense tarifa per dies, la web no el sap llogar
      let id = slugDe(model) || model.id;
      for (let n = 2; vistes.has(id); n++) id = `${slugDe(model)}-${n}`;
      vistes.add(id);
      const valor = typeof model.attributes.model === 'string' ? model.attributes.model : '';
      resultat.push({
        model,
        bici: biciLloguer.parse({
          id,
          nom: model.name,
          categoria: categoriaDe(model),
          electrica: electricaDe(model),
          imatge: model.imageUrl ?? SENSE_FOTO,
          talles: model.variants.length ? model.variants : ['—'],
          tarifa,
          model: { valor, ficticia: false },
        }),
      });
    }
    return resultat;
  }

  async function modelId(biciId: string): Promise<string> {
    const trobada = (await bicis()).find((b) => b.bici.id === biciId);
    if (!trobada) throw new ErrorReserva('bici');
    return trobada.model.id;
  }

  async function cosDe(reserva: ReservaLloguer): Promise<RentalBookingRequest> {
    const items = await Promise.all(
      reserva.bicis.map(async (b) => ({
        modelId: await modelId(b.biciId),
        variant: b.talla === '—' ? null : b.talla,
        options: [...(b.pedals ? [b.pedals] : []), ...b.extres].map((optionId) => ({ optionId, variant: null })),
        rider: {
          ...(b.ciclista.nom && { name: b.ciclista.nom }),
          ...(b.ciclista.alcadaCm && { heightCm: b.ciclista.alcadaCm }),
          ...(b.ciclista.alcadaSeientCm && { saddleHeightCm: b.ciclista.alcadaSeientCm }),
        },
      })),
    );
    return RentalBookingRequestSchema.parse({
      pickup: { date: reserva.recollida.dia, time: reserva.recollida.hora },
      return: { date: reserva.retorn.dia, time: reserva.retorn.hora },
      items,
      customer: { name: reserva.nom, phone: reserva.telefon, email: reserva.correu, language: reserva.idioma },
      ...(reserva.comentaris && { notes: reserva.comentaris }),
      privacyAccepted: true,
    });
  }

  return {
    flota: async () => (await bicis()).map((b) => b.bici),
    bici: async (id) => (await bicis()).find((b) => b.bici.id === id)?.bici ?? null,
    extres: async () => {
      const { optionGroups, options } = await cataleg();
      const obligatoris = new Set(optionGroups.filter((g) => g.required).map((g) => g.id));
      return options.map(
        (o): Extra => ({
          id: o.id,
          grup: obligatoris.has(o.groupId) ? 'pedals' : 'extres',
          nom: o.name,
          grupId: o.groupId,
          ...(o.imageUrl && { imatge: o.imageUrl }),
          preu: o.priceCents,
          cobrament: o.priceUnit === 'day' ? 'perDia' : 'perReserva',
          estoc: null,
          ficticia: false,
        }),
      );
    },
    horari: async () => horariDe(RentalHoursResponseSchema.parse(await crida('/hours', { revalida: true }))),
    configuracioReserves: async () => {
      const ajustos = RentalSettingsResponseSchema.parse(await crida('/settings', { revalida: true }));
      const mode = ajustos.payment?.mode ?? 'none';
      return {
        pagament: {
          actiu: mode !== 'none',
          modalitats: [mode === 'full' ? 'total' : 'senyal'],
          senyalPercent: ajustos.payment?.depositPercent ?? 100,
        },
        participants: { actiu: false },
        retencioMinuts: ajustos.holdMinutes,
      };
    },
    disponibilitat: async (recollida, retorn, biciIds) => {
      const totes = await bicis();
      const demanades = totes.filter((b) => biciIds.includes(b.bici.id));
      const consulta = new URLSearchParams({ pickupDate: recollida.dia, pickupTime: recollida.hora, returnDate: retorn.dia, returnTime: retorn.hora });
      if (demanades.length) consulta.set('models', demanades.map((b) => b.model.id).join(','));
      const lliures = RentalAvailabilityResponseSchema.parse(await crida(`/availability?${consulta}`));
      const perModel = new Map(demanades.map((b) => [b.model.id, b.bici.id]));
      const resultat: Awaited<ReturnType<Plataforma['disponibilitat']>> = { bicis: {}, extres: {} };
      for (const m of lliures.models) {
        const id = perModel.get(m.modelId);
        if (id) resultat.bicis[id] = Object.fromEntries(m.variants.map((v) => [v.variant ?? '—', v.free ?? 0]));
      }
      for (const o of lliures.options) {
        // Sense variants, n'hi ha una sola entrada; amb variants (talles d'un casc), el total.
        const lliure = o.variants.map((v) => v.free);
        resultat.extres[o.optionId] = lliure.includes(null) ? null : lliure.reduce<number>((a, b) => a + (b ?? 0), 0);
      }
      return resultat;
    },
    crearReservaLloguer: async (reserva) => {
      const feta = RentalBookingResponseSchema.parse(await crida('/bookings', { metode: 'POST', cos: await cosDe(reserva), idempotencia: generaClau() }));
      // El testimoni d'accés (`accessToken`) caldrà per als participants (L10); avui la web no el desa.
      return { codi: feta.reference, totalCentims: feta.totalCents, estat: feta.status === 'pending' ? 'pendent' : 'confirmada' };
    },
    retenirReserva: async (reserva) => {
      const retinguda = RentalHoldCreatedResponseSchema.parse(await crida('/holds', { metode: 'POST', cos: await cosDe(reserva), idempotencia: generaClau() }));
      return { id: retinguda.holdId, caducaA: retinguda.expiresAt, totalCentims: retinguda.totalCents };
    },
    alliberarRetencio: async (id) => {
      await crida(`/holds/${encodeURIComponent(id)}`, { metode: 'DELETE' }).catch((e: unknown) => {
        // Ja caducada o convertida: no hi ha res a alliberar.
        if (!(e instanceof ErrorReserva)) throw e;
      });
    },
    iniciarPagament: async (id, modalitat, tornada) => {
      const pagament = RentalCheckoutResponseSchema.parse(
        await crida(`/holds/${encodeURIComponent(id)}/checkout`, { metode: 'POST', cos: { mode: modalitat === 'total' ? 'full' : 'deposit', returnUrl: tornada } }),
      );
      return { url: pagament.checkoutUrl };
    },
    estatRetencio: async (id) => {
      const retinguda = RentalHoldSchema.parse(await crida(`/holds/${encodeURIComponent(id)}`));
      const estat = ({ active: 'activa', expired: 'caducada', released: 'alliberada', converted: 'convertida' } as const)[retinguda.status];
      return { estat, ...(retinguda.booking && { codi: retinguda.booking.reference }) };
    },
    registrarParticipants: async () => {
      throw new ErrorReserva('noDisponible');
    },
    serveisTaller: () => proves.serveisTaller(),
    frangesTaller: (dia) => proves.frangesTaller(dia),
    crearCitaTaller: (cita) => proves.crearCitaTaller(cita),
    productes: () => proves.productes(),
    articles: (categoria) => proves.articles(categoria),
    valoracio: () => proves.valoracio(),
    ressenyes: () => proves.ressenyes(),
  };
}
